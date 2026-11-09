/**
 * AzureLib Animator — Mesh & Armature Export
 * ------------------------------------------
 * Blockbench's Bedrock geometry codec only writes cubes, locators and texture
 * meshes. This module hooks its compile event (for the azure_model format) and
 * adds the polygon meshes and armatures the Bedrock compiler skips:
 *
 *  - A Mesh directly under a group (or at the root) is written to that bone's
 *    standard Bedrock `poly_mesh`. Every mesh under the same bone is merged into
 *    one poly_mesh, baked into the bone's absolute (pivot) space, so it moves
 *    rigidly with the bone exactly like a cube does.
 *
 *  - An Armature becomes a plain bone (flagged `azurelib:armature`) parented to
 *    the armature's group, and each ArmatureBone becomes a regular bone under it
 *    (flagged `azurelib:armature_bone`). AzureLib animates them like any other
 *    bone, so animation keyframes on armature bones export unchanged.
 *
 *  - A Mesh inside an Armature is written to the armature bone's
 *    `azurelib:skinned_meshes` list: rest-pose positions in model space, per
 *    corner normals/UVs, and up to four normalized joint weights per position.
 *    AzureLib deforms these with linear blend skinning, the same math as the
 *    Blockbench preview, so the in-editor deformation is what you get in game.
 *
 * Coordinates follow the Bedrock convention used by the rest of the file: X is
 * negated on export and negated back by AzureLib's loader. Vertex order is kept
 * as Blockbench renders it (tris as stored, quads in sorted loop order), so the
 * winding matches the exported normals.
 *
 * azure-mesh-import.js rebuilds all of this when a .geo.json is opened again,
 * using the azurelib:* metadata written here.
 *
 * © 2026 AzureDoom — MIT License
 */

export const EXT_SKINNED_MESHES = 'azurelib:skinned_meshes';
export const EXT_ARMATURE = 'azurelib:armature';
export const EXT_ARMATURE_BONE = 'azurelib:armature_bone';
export const EXT_MESH_PARTS = 'azurelib:mesh_parts';
export const MAX_INFLUENCES = 4;

const MIN_WEIGHT = 1e-4;
const DEDUPE_PRECISION = 1e5;

let meshValidatorCheck = null;
let lastExportWarnings = [];

function hasMeshes() {
  return typeof Mesh !== 'undefined' && Array.isArray(Mesh.all);
}

function hasArmatures() {
  return typeof Armature !== 'undefined' && typeof ArmatureBone !== 'undefined' && Array.isArray(Armature.all);
}

function isNode(node) {
  return node && node !== 'root' && typeof node === 'object';
}

function formatEulerOrder() {
  return (typeof Format !== 'undefined' && Format?.euler_order) || 'ZYX';
}

function eulerOrder(node) {
  const order = node?.mesh?.rotation?.order;
  if (typeof order === 'string' && order.length === 3) return order;
  if (typeof Mesh !== 'undefined' && node instanceof Mesh) return 'XYZ';
  return formatEulerOrder();
}

function degToRad(value) {
  return ((Number(value) || 0) * Math.PI) / 180;
}

function localMatrix(node) {
  const matrix = new THREE.Matrix4();

  if (hasArmatures() && node instanceof Armature) {
    return matrix;
  }

  const origin = Array.isArray(node.origin) ? node.origin : [0, 0, 0];
  const position = new THREE.Vector3(origin[0], origin[1], origin[2]);
  const parent = node.parent;

  if (isNode(parent) && parent.getTypeBehavior?.('use_absolute_position') && Array.isArray(parent.origin)) {
    position.x -= parent.origin[0];
    position.y -= parent.origin[1];
    position.z -= parent.origin[2];
  }

  const quaternion = new THREE.Quaternion();
  if (Array.isArray(node.rotation)) {
    quaternion.setFromEuler(
      new THREE.Euler(degToRad(node.rotation[0]), degToRad(node.rotation[1]), degToRad(node.rotation[2]), eulerOrder(node))
    );
  }

  const scale = new THREE.Vector3(1, 1, 1);
  if (Array.isArray(node.scale) && node.getTypeBehavior?.('scalable')) {
    scale.set(node.scale[0] || 1e-7, node.scale[1] || 1e-7, node.scale[2] || 1e-7);
  }

  return matrix.compose(position, quaternion, scale);
}

export function restWorldMatrix(node) {
  const chain = [];
  for (let current = node; isNode(current); current = current.parent) {
    chain.unshift(current);
  }

  const matrix = new THREE.Matrix4();
  for (const link of chain) {
    matrix.multiply(localMatrix(link));
  }
  return matrix;
}

export function groupPivot(group) {
  return group instanceof Group ? group.origin.slice() : [0, 0, 0];
}

function extractPolygons(mesh) {
  const smooth = mesh.shading === 'smooth';
  const vertexNormals = smooth ? mesh.calculateNormals() : null;
  const polygons = [];

  for (const fkey in mesh.faces) {
    const face = mesh.faces[fkey];
    if (!face || face.vertices.length < 3) continue;
    if (face.texture === null) continue;

    const order = face.vertices.length === 4 ? face.getSortedVertices() : face.vertices.slice();
    const faceNormal = face.getNormal(true);
    const corners = [];

    for (const vkey of order) {
      const position = mesh.vertices[vkey];
      if (!position) continue;

      const normal = (smooth && vertexNormals?.[vkey]) || faceNormal;
      const uv = face.uv?.[vkey] || [0, 0];

      corners.push({ vkey, position, normal, uv });
    }

    if (corners.length >= 3) polygons.push(corners);
  }

  return polygons;
}

function round(value, precision = DEDUPE_PRECISION) {
  return Math.round(value * precision) / precision;
}

function toBedrock(vector) {
  return [-vector.x, vector.y, vector.z];
}

class PolyMeshBuilder {
  constructor() {
    this.positions = [];
    this.normals = [];
    this.uvs = [];
    this.polys = [];
    this.positionIndex = new Map();
    this.normalIndex = new Map();
    this.uvIndex = new Map();
  }

  addPosition(key, vector) {
    let index = this.positionIndex.get(key);
    if (index === undefined) {
      index = this.positions.length;
      this.positions.push(toBedrock(vector));
      this.positionIndex.set(key, index);
    }
    return index;
  }

  addNormal(vector) {
    const normal = toBedrock(vector).map(component => round(component));
    const key = normal.join(',');
    let index = this.normalIndex.get(key);
    if (index === undefined) {
      index = this.normals.length;
      this.normals.push(normal);
      this.normalIndex.set(key, index);
    }
    return index;
  }

  addUV(uv) {
    const value = [round(uv[0]), round(uv[1])];
    const key = value.join(',');
    let index = this.uvIndex.get(key);
    if (index === undefined) {
      index = this.uvs.length;
      this.uvs.push(value);
      this.uvIndex.set(key, index);
    }
    return index;
  }

  addMesh(mesh, matrix, onPosition) {
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix);
    const position = new THREE.Vector3();
    const normal = new THREE.Vector3();
    let polygonCount = 0;

    for (const corners of extractPolygons(mesh)) {
      const poly = [];

      for (const corner of corners) {
        const key = `${mesh.uuid}:${corner.vkey}`;
        const isNew = !this.positionIndex.has(key);

        position.fromArray(corner.position).applyMatrix4(matrix);
        const positionIndex = this.addPosition(key, position);
        if (isNew && onPosition) onPosition(corner.vkey, positionIndex);

        normal.fromArray(corner.normal).applyMatrix3(normalMatrix).normalize();
        poly.push([positionIndex, this.addNormal(normal), this.addUV(corner.uv)]);
      }

      this.polys.push(poly);
      polygonCount++;
    }

    return polygonCount;
  }

  isEmpty() {
    return this.polys.length === 0;
  }

  toJSON() {
    return {
      normalized_uvs: false,
      positions: this.positions,
      normals: this.normals,
      uvs: this.uvs,
      polys: this.polys,
    };
  }
}

function vertexInfluences(mesh, vkey, bones, jointIndexOf, stats) {
  const influences = [];

  for (const bone of bones) {
    const weight = bone.getVertexWeight(mesh, vkey);
    if (weight > 0) influences.push({ bone, weight });
  }

  if (influences.length > MAX_INFLUENCES) {
    stats.truncated++;
    influences.sort((a, b) => b.weight - a.weight);
    influences.length = MAX_INFLUENCES;
  }

  const total = influences.reduce((sum, entry) => sum + entry.weight, 0);
  if (total <= 0) {
    stats.unweighted++;
    return [[0, 1]];
  }

  const result = [];
  for (const { bone, weight } of influences) {
    const normalized = weight / total;
    if (normalized < MIN_WEIGHT) continue;
    result.push([jointIndexOf(bone), round(normalized)]);
  }

  return result.length ? result : [[0, 1]];
}

function findLooseBone(bones) {
  const realGroupNames = new Set(Group.all.map(group => group.name));
  return bones.find(bone => !bone.parent && /^bb_main\d*$/.test(bone.name) && !realGroupNames.has(bone.name));
}

function ownerBoneFor(element, bonesByName, bones) {
  const parent = element.parent;
  if (parent instanceof Group) return bonesByName.get(parent.name) || null;
  if (!isNode(parent)) return findLooseBone(bones) || null;
  return null;
}

function exportRigidMeshes(bones, bonesByName, warnings) {
  if (!hasMeshes()) return 0;

  const builders = new Map();
  const parts = new Map();
  let exported = 0;

  for (const mesh of Mesh.all) {
    if (!mesh.export) continue;
    if (mesh.getArmature?.()) continue;

    const parent = mesh.parent;
    if (isNode(parent) && !(parent instanceof Group)) {
      warnings.push(`Mesh "${mesh.name}" is inside a ${parent.type}, which AzureLib can't attach geometry to. Move it into a group or an armature.`);
      continue;
    }

    const bone = ownerBoneFor(mesh, bonesByName, bones);
    if (!bone) {
      warnings.push(`Mesh "${mesh.name}" has no exported bone to attach to and was skipped.`);
      continue;
    }

    if (bone.poly_mesh && !builders.has(bone)) {
      warnings.push(`Bone "${bone.name}" already had a poly_mesh; it was replaced by the bone's Blockbench meshes.`);
    }

    const owner = parent instanceof Group ? parent : null;
    const pivot = groupPivot(owner);
    const toBoneSpace = new THREE.Matrix4()
      .makeTranslation(pivot[0], pivot[1], pivot[2])
      .multiply(restWorldMatrix(owner).invert())
      .multiply(restWorldMatrix(mesh));

    let builder = builders.get(bone);
    if (!builder) {
      builder = new PolyMeshBuilder();
      builders.set(bone, builder);
    }

    const start = builder.polys.length;
    const count = builder.addMesh(mesh, toBoneSpace);
    if (count > 0) {
      exported++;
      if (!parts.has(bone)) parts.set(bone, []);
      parts.get(bone).push({ ...meshMetadata(mesh), polys: [start, count] });
    }
  }

  for (const [bone, builder] of builders) {
    if (builder.isEmpty()) continue;
    bone.poly_mesh = builder.toJSON();
    if (parts.has(bone)) bone[EXT_MESH_PARTS] = parts.get(bone);
  }

  return exported;
}

function meshMetadata(mesh) {
  const meta = { name: mesh.name, shading: mesh.shading === 'smooth' ? 'smooth' : 'flat' };
  if (Array.isArray(mesh.origin)) meta.origin = mesh.origin.slice();
  if (Array.isArray(mesh.rotation) && !mesh.rotation.allEqual(0)) meta.rotation = mesh.rotation.slice();
  if (typeof mesh.color === 'number') meta.color = mesh.color;
  return meta;
}

function uniqueBoneName(name, usedNames) {
  if (!usedNames.has(name)) return name;
  let index = 2;
  while (usedNames.has(`${name}_${index}`)) index++;
  return `${name}_${index}`;
}

function exportArmatures(bones, bonesByName, warnings) {
  if (!hasArmatures()) return { armatures: 0, skinned: 0 };

  const usedNames = new Set(bones.map(bone => bone.name));
  let armatureCount = 0;
  let skinnedCount = 0;

  for (const armature of Armature.all) {
    if (!armature.export) continue;

    const parent = armature.parent;
    const ownerGroup = parent instanceof Group ? parent : null;
    if (isNode(parent) && !ownerGroup) {
      warnings.push(`Armature "${armature.name}" must be at the root or inside a group to export.`);
      continue;
    }

    const parentBone = ownerGroup ? bonesByName.get(ownerGroup.name) : null;
    if (ownerGroup && !parentBone) {
      warnings.push(`Armature "${armature.name}" is inside group "${ownerGroup.name}", which was not exported. It was exported at the root instead.`);
    }

    const armaturePivot = groupPivot(ownerGroup);
    const armatureName = uniqueBoneName(armature.name, usedNames);
    if (armatureName !== armature.name) {
      warnings.push(`Armature "${armature.name}" was exported as bone "${armatureName}" because a bone with that name already exists.`);
    }
    usedNames.add(armatureName);

    const armatureBone = {
      name: armatureName,
      pivot: [-armaturePivot[0], armaturePivot[1], armaturePivot[2]],
      [EXT_ARMATURE]: true,
    };
    if (parentBone) armatureBone.parent = parentBone.name;
    bones.push(armatureBone);
    bonesByName.set(armatureName, armatureBone);
    armatureCount++;

    const exportedBones = [];
    const visit = (node, parentName, parentPivot) => {
      for (const child of node.children) {
        if (!(child instanceof ArmatureBone)) continue;

        const pivot = [
          parentPivot[0] + child.origin[0],
          parentPivot[1] + child.origin[1],
          parentPivot[2] + child.origin[2],
        ];

        if (!child.export) {
          visit(child, parentName, pivot);
          continue;
        }

        if (usedNames.has(child.name)) {
          warnings.push(`Armature bone "${child.name}" has the same name as another bone. AzureLib keeps only one of them, so rename one.`);
        }
        usedNames.add(child.name);

        const bone = {
          name: child.name,
          parent: parentName,
          pivot: [-pivot[0], pivot[1], pivot[2]],
          [EXT_ARMATURE_BONE]: {
            length: child.length,
            width: child.width,
            connected: child.connected !== false,
          },
        };

        if (Array.isArray(child.rotation) && !child.rotation.allEqual(0)) {
          bone.rotation = [-child.rotation[0], -child.rotation[1], child.rotation[2]];
        }

        const locators = compileArmatureBoneLocators(child, pivot);
        if (locators) bone.locators = locators;

        bones.push(bone);
        bonesByName.set(child.name, bone);
        exportedBones.push(child);
        visit(child, child.name, pivot);
      }
    };
    visit(armature, armatureName, armaturePivot);

    const skinnedMeshes = [];
    for (const mesh of armature.children) {
      if (!(mesh instanceof Mesh) || !mesh.export) continue;

      const joints = [armatureName];
      const jointIndices = new Map();
      const jointIndexOf = bone => {
        let index = jointIndices.get(bone);
        if (index === undefined) {
          index = joints.length;
          joints.push(bone.name);
          jointIndices.set(bone, index);
        }
        return index;
      };

      const builder = new PolyMeshBuilder();
      const weights = [];
      const stats = { truncated: 0, unweighted: 0 };

      builder.addMesh(mesh, restWorldMatrix(mesh), (vkey, positionIndex) => {
        weights[positionIndex] = vertexInfluences(mesh, vkey, exportedBones, jointIndexOf, stats);
      });

      if (builder.isEmpty()) continue;

      if (stats.truncated) {
        warnings.push(`Mesh "${mesh.name}": ${stats.truncated} vertices have more than ${MAX_INFLUENCES} bone weights. Only the ${MAX_INFLUENCES} strongest were kept.`);
      }
      if (stats.unweighted && stats.unweighted === builder.positions.length) {
        warnings.push(`Mesh "${mesh.name}" has no vertex weights, so it won't deform. Paint weights or use Attach Armature.`);
      }

      skinnedMeshes.push({
        ...meshMetadata(mesh),
        joints,
        ...builder.toJSON(),
        weights,
      });
      skinnedCount++;
    }

    if (skinnedMeshes.length) armatureBone[EXT_SKINNED_MESHES] = skinnedMeshes;
  }

  return { armatures: armatureCount, skinned: skinnedCount };
}

function compileArmatureBoneLocators(bone, pivot) {
  const locators = {};

  for (const child of bone.children) {
    if (!child.export) continue;
    if (!(child instanceof Locator) && !(typeof NullObject !== 'undefined' && child instanceof NullObject)) continue;

    const position = child.position || child.from || [0, 0, 0];
    const offset = [-(pivot[0] + position[0]), pivot[1] + position[1], pivot[2] + position[2]];
    const key = child instanceof Locator ? child.name : `_null_${child.name}`;
    const rotatable = child.getTypeBehavior?.('rotatable') && Array.isArray(child.rotation) && !child.rotation.allEqual(0);

    if (rotatable || child.ignore_inherited_scale) {
      locators[key] = { offset };
      if (rotatable) locators[key].rotation = [-child.rotation[0], -child.rotation[1], child.rotation[2]];
      if (child.ignore_inherited_scale) locators[key].ignore_inherited_scale = true;
    } else {
      locators[key] = offset;
    }
  }

  return Object.keys(locators).length ? locators : null;
}

export function injectMeshGeometry(geometry) {
  if (!geometry) return;
  const meshCount = hasMeshes() ? Mesh.all.length : 0;
  const armatureCount = hasArmatures() ? Armature.all.length : 0;
  if (!meshCount && !armatureCount) {
    lastExportWarnings = [];
    return;
  }

  if (!Array.isArray(geometry.bones)) geometry.bones = [];
  const bones = geometry.bones;
  const bonesByName = new Map(bones.map(bone => [bone.name, bone]));
  const warnings = [];

  try {
    exportRigidMeshes(bones, bonesByName, warnings);
    exportArmatures(bones, bonesByName, warnings);
  } catch (error) {
    console.error('[AzureLib] Mesh export failed', error);
    warnings.push(`Mesh export failed: ${error?.message || error}`);
  }

  lastExportWarnings = warnings;
  if (warnings.length) {
    console.warn('[AzureLib] Mesh export warnings:\n' + warnings.join('\n'));
    Blockbench.showQuickMessage(`[AzureLib] Exported with ${warnings.length} mesh warning(s). See the Validator for details.`, 3000);
    Validator?.validate?.();
  }
}

function runMeshValidation() {
  for (const message of lastExportWarnings) {
    this.warn({ message });
  }

  if (!hasArmatures()) return;

  const groupNames = new Set(Group.all.map(group => group.name));
  for (const bone of ArmatureBone.all) {
    if (groupNames.has(bone.name)) {
      this.warn({
        message: `Armature bone "${bone.name}" has the same name as a group. AzureLib addresses bones by name, so one of them will be ignored.`,
        buttons: [{ name: 'Select', icon: 'fa-crosshairs', click() { bone.select(); } }],
      });
    }
  }

  for (const mesh of Mesh.all) {
    const armature = mesh.getArmature?.();
    if (!armature) continue;

    const bones = armature.getAllBones();
    let over = 0;
    for (const vkey in mesh.vertices) {
      let count = 0;
      for (const bone of bones) {
        if (bone.getVertexWeight(mesh, vkey) > 0) count++;
      }
      if (count > MAX_INFLUENCES) over++;
    }

    if (over) {
      this.warn({
        message: `Mesh "${mesh.name}" has ${over} vertices weighted to more than ${MAX_INFLUENCES} bones. AzureLib keeps the ${MAX_INFLUENCES} strongest, so they may deform slightly differently in game.`,
        buttons: [{ name: 'Select', icon: 'fa-crosshairs', click() { mesh.select(); } }],
      });
    }
  }
}

export function registerMeshSupport() {
  if (meshValidatorCheck || typeof ValidatorCheck === 'undefined') return;

  meshValidatorCheck = new ValidatorCheck('azurelib_meshes', {
    condition: { formats: ['azure_model'] },
    update_triggers: ['update_selection'],
    run: runMeshValidation,
  });
}

export function unregisterMeshSupport() {
  meshValidatorCheck?.delete();
  meshValidatorCheck = null;
  lastExportWarnings = [];
}
