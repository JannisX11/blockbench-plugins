/**
 * AzureLib Animator — Mesh & Armature Import
 * ------------------------------------------
 * Rebuilds polygon meshes, armatures, armature bones and vertex weights from an
 * exported .geo.json, so a model can be recovered when its .bbmodel is lost.
 *
 * Cubes, groups, locators and UVs still load through Blockbench's own Bedrock
 * parser (Codecs.bedrock.parseGeometry). This module hooks that parser's
 * events:
 *
 *  - parse:  for AzureLib geometry, switch the project to the AzureLib format
 *            (Bedrock's own format can't hold meshes or armatures) and pull the
 *            armature bones out of the bone list so they don't load as groups.
 *  - parsed: rebuild meshes from poly_mesh, and armatures with their skinned
 *            meshes from the stashed bones.
 *
 * It runs for the "Import AzureLib .geo Model" action, and when a .geo.json is
 * opened the normal way and the user picks AzureLib. Normal opens ask whether to
 * open the file as an AzureLib or a Bedrock model, as set by the "Open Bedrock
 * .geo.json files as" setting.
 *
 * Exports carry per-mesh metadata (name, shading, origin, rotation, and which
 * polygons belong to which mesh). Geometry without it, such as poly_mesh from
 * other tools, still loads: meshes that share a bone come back as one mesh and
 * shading is guessed from the stored normals.
 *
 * © 2026 AzureDoom — MIT License
 */

import {
  EXT_ARMATURE,
  EXT_ARMATURE_BONE,
  EXT_MESH_PARTS,
  EXT_SKINNED_MESHES,
  restWorldMatrix,
} from './azure-mesh.js';

const FORMAT_ID = 'azure_model';

let explicitImport = false;
let pending = null;
let importAction = null;
let openAs = null;
let originalBedrockLoad = null;
let openSetting = null;

const SETTING_ID = 'azurelib_geo_open_mode';

const OPEN_MODES = {
  ask: 'Ask every time',
  auto: 'AzureLib for AzureLib exports, otherwise Bedrock',
  azurelib: 'Always AzureLib',
  bedrock: 'Always Bedrock',
};

function isAzureGeometry(model) {
  return Array.isArray(model?.bones) && model.bones.some(bone =>
    bone && (bone[EXT_ARMATURE] || bone[EXT_ARMATURE_BONE] || bone[EXT_SKINNED_MESHES] || bone[EXT_MESH_PARTS])
  );
}

function hasPolyMesh(model) {
  return Array.isArray(model?.bones) && model.bones.some(bone => bone?.poly_mesh);
}

function canHoldMeshes() {
  return typeof Mesh !== 'undefined' && !!Format?.meshes;
}

function canHoldArmatures() {
  return typeof Armature !== 'undefined' && typeof ArmatureBone !== 'undefined' && !!Format?.armature_rig;
}

export function handleGeometryParse(event) {
  pending = null;
  const choice = openAs;
  openAs = null;

  const model = event?.model;
  if (!model) return;

  const azure = isAzureGeometry(model);
  const useAzure = explicitImport || choice === 'azurelib' || (choice === null && azure);

  if (!useAzure) {
    if (azure) {
      Blockbench.showQuickMessage('Opened as a Bedrock model: AzureLib meshes and armatures were not loaded.', 3500);
    }
    return;
  }

  if (Format?.id !== FORMAT_ID && Formats?.[FORMAT_ID]) {
    Formats[FORMAT_ID].select();
  }

  const stashed = [];
  if (Array.isArray(model.bones)) {
    model.bones = model.bones.filter(bone => {
      if (bone && (bone[EXT_ARMATURE] || bone[EXT_ARMATURE_BONE])) {
        stashed.push(bone);
        return false;
      }
      return true;
    });
  }

  pending = { model, stashed };
}

export function handleGeometryParsed(event) {
  const state = pending;
  pending = null;

  if (!state) {
    if (hasPolyMesh(event?.model) && !canHoldMeshes()) {
      Blockbench.showQuickMessage('This model has polygon meshes. Use File > Import > Import AzureLib .geo Model to load them.', 4000);
    }
    return;
  }

  const report = { meshes: 0, armatures: 0, bones: 0, skinned: 0, warnings: [] };

  try {
    rebuildRigidMeshes(state.model, report);
    rebuildArmatures(state.stashed, report);
  } catch (error) {
    console.error('[AzureLib] Mesh import failed', error);
    report.warnings.push(`Mesh import failed: ${error?.message || error}`);
  }

  Canvas.updateAll();
  Canvas.updateAllBones?.();

  const parts = [];
  if (report.meshes) parts.push(`${report.meshes} mesh${report.meshes === 1 ? '' : 'es'}`);
  if (report.armatures) parts.push(`${report.armatures} armature${report.armatures === 1 ? '' : 's'} (${report.bones} bones, ${report.skinned} skinned mesh${report.skinned === 1 ? '' : 'es'})`);
  if (parts.length) console.log(`[AzureLib] Rebuilt ${parts.join(', ')}`);

  if (report.warnings.length) {
    console.warn('[AzureLib] Mesh import warnings:\n' + report.warnings.join('\n'));
    Blockbench.showMessageBox({
      title: 'AzureLib Mesh Import',
      message: report.warnings.join('\n\n'),
      buttons: ['OK'],
    });
  } else if (parts.length) {
    Blockbench.showQuickMessage(`[AzureLib] Rebuilt ${parts.join(', ')}`, 2500);
  }
}

function fromBedrock(vector) {
  return [-(vector?.[0] || 0), vector?.[1] || 0, vector?.[2] || 0];
}

function findGroup(name) {
  if (!name) return null;
  const lower = name.toLowerCase();
  return Group.all.find(group => group.name === name) || Group.all.find(group => group.name.toLowerCase() === lower) || null;
}

function explicitPolys(polyMesh) {
  const polys = polyMesh?.polys;
  if (Array.isArray(polys)) return polys;

  const size = polys === 'quad_list' ? 4 : polys === 'tri_list' ? 3 : 0;
  const count = Array.isArray(polyMesh?.positions) ? polyMesh.positions.length : 0;
  if (!size) return [];

  const result = [];
  for (let start = 0; start + size <= count; start += size) {
    const poly = [];
    for (let i = start; i < start + size; i++) poly.push([i, i, i]);
    result.push(poly);
  }
  return result;
}

function looksSmooth(polyMesh, polys) {
  const normalOf = new Map();
  let shared = false;

  for (const poly of polys) {
    for (const corner of poly) {
      const [position, normal] = corner;
      if (!normalOf.has(position)) {
        normalOf.set(position, normal);
      } else if (normalOf.get(position) !== normal) {
        return false;
      } else {
        shared = true;
      }
    }
  }

  return shared;
}

function uvScale(polyMesh) {
  if (polyMesh?.normalized_uvs !== true) return [1, 1];
  return [Project.texture_width || 16, Project.texture_height || 16];
}

function buildMesh(parent, meta, polyMesh, polys, positionToSource, makeToLocal, sourceToParent = null) {
  const positions = polyMesh.positions || [];
  const uvs = polyMesh.uvs || [];
  const [uScale, vScale] = uvScale(polyMesh);

  const mesh = new Mesh({
    name: meta.name || 'mesh',
    origin: meta.origin ? meta.origin.slice() : [0, 0, 0],
    rotation: meta.rotation ? meta.rotation.slice() : [0, 0, 0],
    vertices: {},
  });
  mesh.shading = meta.shading || (looksSmooth(polyMesh, polys) ? 'smooth' : 'flat');
  if (typeof meta.color === 'number') mesh.color = meta.color;

  mesh.addTo(parent || undefined).init();

  if (!meta.origin) {
    const centre = new THREE.Vector3();
    let count = 0;
    for (const index of new Set(polys.flatMap(poly => poly.map(corner => corner[0])))) {
      if (!positions[index]) continue;
      centre.add(new THREE.Vector3(...positionToSource(positions[index])));
      count++;
    }
    if (count) {
      centre.divideScalar(count);
      if (sourceToParent) centre.applyMatrix4(sourceToParent);
      mesh.origin = centre.toArray().map(value => Math.round(value * 1e4) / 1e4);
    }
  }

  const toLocal = makeToLocal(mesh);
  const keyOf = new Map();
  const vector = new THREE.Vector3();

  const keyFor = index => {
    let key = keyOf.get(index);
    if (key === undefined) {
      vector.fromArray(positionToSource(positions[index])).applyMatrix4(toLocal);
      key = mesh.addVertices(vector.toArray().map(value => Math.round(value * 1e5) / 1e5))[0];
      keyOf.set(index, key);
    }
    return key;
  };

  for (const poly of polys) {
    const corners = [];
    for (const corner of poly) {
      if (!Array.isArray(corner) || !positions[corner[0]]) continue;
      if (corners.length && corners[corners.length - 1][0] === corner[0]) continue;
      corners.push(corner);
    }
    if (corners.length > 3 && corners[0][0] === corners[corners.length - 1][0]) corners.pop();
    if (corners.length < 3) continue;

    const pieces = corners.length <= 4
      ? [corners]
      : corners.slice(1, -1).map((corner, i) => [corners[0], corner, corners[i + 2]]);

    for (const piece of pieces) {
      const vertices = [];
      const uv = {};
      for (const [position, , uvIndex] of piece) {
        const key = keyFor(position);
        if (vertices.includes(key)) continue;
        vertices.push(key);
        const value = uvs[uvIndex] || [0, 0];
        uv[key] = [value[0] * uScale, value[1] * vScale];
      }
      if (vertices.length >= 3) mesh.addFaces(new MeshFace(mesh, { vertices, uv }));
    }
  }

  return { mesh, keyOf };
}

function rebuildRigidMeshes(model, report) {
  if (!Array.isArray(model?.bones)) return;

  for (const bone of model.bones) {
    const polyMesh = bone?.poly_mesh;
    if (!polyMesh) continue;

    if (!canHoldMeshes()) {
      report.warnings.push('This project format does not support meshes, so polygon meshes were skipped.');
      return;
    }

    const group = findGroup(bone.name);
    if (!group) {
      report.warnings.push(`Bone "${bone.name}" has a poly_mesh but wasn't imported as a group, so its mesh was skipped.`);
      continue;
    }

    const polys = explicitPolys(polyMesh);
    const storedParts = Array.isArray(bone[EXT_MESH_PARTS]) ? bone[EXT_MESH_PARTS] : null;
    const parts = storedParts || [{ name: group.name === 'bb_main' ? 'mesh' : `${group.name}_mesh`, polys: [0, polys.length] }];

    const pivot = group.origin;
    const groupSpace = restWorldMatrix(group).multiply(new THREE.Matrix4().makeTranslation(-pivot[0], -pivot[1], -pivot[2]));

    for (const part of parts) {
      const [start, count] = Array.isArray(part.polys) ? part.polys : [0, polys.length];
      const subset = polys.slice(start, start + count);
      if (!subset.length) continue;

      buildMesh(
        group,
        part,
        polyMesh,
        subset,
        position => fromBedrock(position),
        mesh => restWorldMatrix(mesh).invert().multiply(groupSpace)
      );
      report.meshes++;
    }
  }
}

function rebuildArmatures(stashed, report) {
  if (!stashed.length) return;

  if (!canHoldArmatures()) {
    report.warnings.push('This Blockbench version or format does not support armatures, so armatures and skinned meshes were skipped.');
    return;
  }

  const byName = new Map(stashed.map(bone => [bone.name, bone]));
  const childrenOf = new Map();
  for (const bone of stashed) {
    if (!bone[EXT_ARMATURE_BONE]) continue;
    if (!childrenOf.has(bone.parent)) childrenOf.set(bone.parent, []);
    childrenOf.get(bone.parent).push(bone);
  }

  const built = new Set();

  for (const data of stashed) {
    if (!data[EXT_ARMATURE]) continue;

    const group = data.parent ? findGroup(data.parent) : null;
    if (data.parent && !group) {
      report.warnings.push(`Armature "${data.name}" belonged to bone "${data.parent}", which wasn't found. It was placed at the root.`);
    }

    const armature = new Armature({ name: data.name });
    armature.addTo(group || undefined).init();
    armature.isOpen = true;
    built.add(data.name);
    report.armatures++;

    const nodesByName = new Map([[data.name, armature]]);

    const visit = (parentData, parentNode) => {
      const parentPivot = fromBedrock(parentData.pivot);
      for (const childData of childrenOf.get(parentData.name) || []) {
        const pivot = fromBedrock(childData.pivot);
        const extra = typeof childData[EXT_ARMATURE_BONE] === 'object' ? childData[EXT_ARMATURE_BONE] : {};
        const rotation = Array.isArray(childData.rotation)
          ? [-childData.rotation[0], -childData.rotation[1], childData.rotation[2]]
          : [0, 0, 0];

        const node = new ArmatureBone({
          name: childData.name,
          origin: pivot.map((value, i) => value - parentPivot[i]),
          rotation,
          ...(typeof extra.length === 'number' ? { length: extra.length } : {}),
          ...(typeof extra.width === 'number' ? { width: extra.width } : {}),
          ...(typeof extra.connected === 'boolean' ? { connected: extra.connected } : {}),
        });
        node.addTo(parentNode).init();
        node.isOpen = true;
        nodesByName.set(childData.name, node);
        built.add(childData.name);
        report.bones++;

        rebuildLocators(childData, node, pivot);
        visit(childData, node);
      }
    };
    visit(data, armature);

    const skinned = Array.isArray(data[EXT_SKINNED_MESHES]) ? data[EXT_SKINNED_MESHES] : [];
    for (const entry of skinned) {
      if (rebuildSkinnedMesh(entry, armature, nodesByName, report)) report.skinned++;
    }
  }

  for (const bone of stashed) {
    if (!built.has(bone.name)) {
      report.warnings.push(`Armature bone "${bone.name}" has no armature above it in the file and was skipped.`);
    }
  }
}

function rebuildLocators(data, node, pivot) {
  if (!data.locators || typeof data.locators !== 'object') return;

  for (const [key, value] of Object.entries(data.locators)) {
    const offset = fromBedrock(Array.isArray(value) ? value : value?.offset);
    const position = offset.map((v, i) => v - pivot[i]);
    const rotation = Array.isArray(value?.rotation) ? [-value.rotation[0], -value.rotation[1], value.rotation[2]] : undefined;

    if (key.startsWith('_null_') && typeof NullObject !== 'undefined') {
      new NullObject({ name: key.substring(6), position }).addTo(node).init();
    } else {
      const locator = new Locator({ name: key, position, rotation });
      if (value?.ignore_inherited_scale) locator.ignore_inherited_scale = true;
      locator.addTo(node).init();
    }
  }
}

function rebuildSkinnedMesh(entry, armature, nodesByName, report) {
  if (!canHoldMeshes()) return false;

  const polys = explicitPolys(entry);
  if (!polys.length || !Array.isArray(entry.positions)) return false;

  const { mesh, keyOf } = buildMesh(
    armature,
    entry,
    entry,
    polys,
    position => fromBedrock(position),
    built => restWorldMatrix(built).invert(),
    restWorldMatrix(armature).invert()
  );

  const joints = Array.isArray(entry.joints) ? entry.joints : [];
  const jointNodes = joints.map(name => {
    const node = nodesByName.get(name);
    return node instanceof ArmatureBone ? node : null;
  });

  const missing = new Set();
  const weights = Array.isArray(entry.weights) ? entry.weights : [];

  for (const [position, key] of keyOf) {
    for (const pair of weights[position] || []) {
      if (!Array.isArray(pair)) continue;
      const [jointIndex, weight] = pair;
      const node = jointNodes[jointIndex];
      if (node) {
        node.setVertexWeight(mesh, key, weight);
      } else if (joints[jointIndex] && !nodesByName.has(joints[jointIndex])) {
        missing.add(joints[jointIndex]);
      }
    }
  }

  if (missing.size) {
    report.warnings.push(`Mesh "${mesh.name}" is weighted to bones that aren't in its armature (${[...missing].join(', ')}); those weights were dropped.`);
  }

  return true;
}

function openMode() {
  const value = openSetting?.value ?? globalThis.settings?.[SETTING_ID]?.value;
  return OPEN_MODES[value] ? value : 'ask';
}

function rememberOpenMode(mode) {
  if (!openSetting) return;
  if (typeof openSetting.set === 'function') {
    openSetting.set(mode);
  } else {
    openSetting.value = mode;
    globalThis.Settings?.saveLocalStorages?.();
  }
}

function loadWithChoice(model, file, args = {}) {
  const codec = this;
  const importToCurrent = typeof args === 'boolean' ? args : args?.import_to_current_project;
  openAs = null;

  if (importToCurrent || !Formats?.[FORMAT_ID]) {
    return originalBedrockLoad.call(codec, model, file, args);
  }

  const geometries = Array.isArray(model?.['minecraft:geometry']) ? model['minecraft:geometry'] : [];
  const azure = geometries.some(isAzureGeometry);
  const proceed = choice => {
    openAs = choice;
    return originalBedrockLoad.call(codec, model, file, args);
  };

  const mode = openMode();
  if (mode === 'azurelib' || mode === 'bedrock') return proceed(mode);
  if (mode === 'auto') return proceed(azure ? 'azurelib' : 'bedrock');

  const name = file?.path ? pathToName(file.path, true) : (file?.name || 'this model');
  const meshNote = azure
    ? 'It contains AzureLib meshes or armatures, which only load as an AzureLib model.'
    : geometries.some(hasPolyMesh)
      ? 'It contains polygon meshes, which only load as an AzureLib model.'
      : 'Open it as an AzureLib model to use AzureLib\'s animation and rig tools, or as a Bedrock model for Minecraft Bedrock.';

  Blockbench.showMessageBox({
    title: 'Open Bedrock Geometry',
    message: `How do you want to open ${name}?\n\n${meshNote}`,
    icon: 'view_in_ar',
    buttons: ['AzureLib Model', 'Bedrock Model', 'dialog.cancel'],
    confirm: azure ? 0 : 1,
    confirmIndex: azure ? 0 : 1,
    cancel: 2,
    cancelIndex: 2,
    checkboxes: {
      remember: { value: false, text: 'Remember my choice (change it in Settings > AzureLib)' },
    },
  }, (button, result) => {
    if (button !== 0 && button !== 1) return;
    const choice = button === 0 ? 'azurelib' : 'bedrock';
    if (result?.remember) rememberOpenMode(choice);
    proceed(choice);
  });
}

const SETTINGS_CATEGORY = 'azurelib';

let addedSettingsCategory = false;

function ensureSettingsCategory() {
  const S = globalThis.Settings;
  if (!S?.structure) return 'general';
  if (S.structure[SETTINGS_CATEGORY]) return SETTINGS_CATEGORY;

  try {
    if (S.dialog?.object && typeof S.addCategory === 'function') {
      S.addCategory(SETTINGS_CATEGORY, { name: 'AzureLib' });
    } else {
      S.structure[SETTINGS_CATEGORY] = { name: 'AzureLib', open: false, items: {} };
      if (S.dialog?.sidebar?.pages) S.dialog.sidebar.pages[SETTINGS_CATEGORY] = 'AzureLib';
    }
    addedSettingsCategory = true;
  } catch (error) {
    console.warn('[AzureLib] Could not add the AzureLib settings page', error);
  }

  return S.structure[SETTINGS_CATEGORY] ? SETTINGS_CATEGORY : 'general';
}

function removeSettingsCategory() {
  const S = globalThis.Settings;
  if (!addedSettingsCategory || !S?.structure?.[SETTINGS_CATEGORY]) return;
  if (Object.keys(S.structure[SETTINGS_CATEGORY].items || {}).length) return;

  delete S.structure[SETTINGS_CATEGORY];
  if (S.dialog?.sidebar?.pages) delete S.dialog.sidebar.pages[SETTINGS_CATEGORY];
  try {
    if (S.dialog?.object) S.dialog.sidebar.build();
  } catch {}
  addedSettingsCategory = false;
}

function registerOpenChoice() {
  const bedrock = Codecs?.bedrock;
  if (!bedrock || originalBedrockLoad) return;

  if (typeof Setting !== 'undefined') {
    try {
      openSetting = new Setting(SETTING_ID, {
        name: 'Open Bedrock .geo.json files as',
        description: 'Whether opening a Bedrock geometry file creates an AzureLib model or a Bedrock model.',
        category: ensureSettingsCategory(),
        type: 'select',
        value: 'ask',
        options: OPEN_MODES,
      });
    } catch (error) {
      console.warn('[AzureLib] Could not register the open-mode setting', error);
      openSetting = null;
    }
  }

  originalBedrockLoad = bedrock.load;
  bedrock.load = loadWithChoice;
}

function unregisterOpenChoice() {
  const bedrock = Codecs?.bedrock;
  if (bedrock && originalBedrockLoad) bedrock.load = originalBedrockLoad;
  originalBedrockLoad = null;
  openSetting?.delete?.();
  openSetting = null;
  removeSettingsCategory();
  openAs = null;
}

function pickGeometry(geometries, callback) {
  if (geometries.length === 1) return callback(geometries[0]);

  const options = {};
  geometries.forEach((geo, index) => {
    options[index] = geo?.description?.identifier || `geometry ${index + 1}`;
  });

  new Dialog({
    id: 'azurelib_select_geometry',
    title: 'Select Geometry',
    form: { geometry: { label: 'Geometry', type: 'select', options, default: '0' } },
    onConfirm(form) {
      callback(geometries[Number(form.geometry)]);
    },
  }).show();
}

function importGeometryFile(file) {
  let json;
  try {
    json = autoParseJSON(file.content, false);
  } catch {
    return Blockbench.showQuickMessage('[AzureLib] Not a valid JSON file.');
  }

  const geometries = (json?.['minecraft:geometry'] || []).filter(geo => geo && typeof geo === 'object');
  if (!geometries.length) {
    return Blockbench.showQuickMessage('[AzureLib] No geometry found in this file.');
  }

  pickGeometry(geometries, geometry => {
    const create = typeof newProject === 'function'
      ? () => newProject(Formats[FORMAT_ID])
      : () => Formats[FORMAT_ID].new();
    if (!create()) return;

    if (file.path && isApp) {
      const name = pathToName(file.path, true);
      Project.name = pathToName(name, false);
      Project.export_path = file.path;
    }

    openAs = null;
    explicitImport = true;
    try {
      Codecs.bedrock.parseGeometry({ object: geometry }, { switch_to_existing_tab: false });
    } finally {
      explicitImport = false;
    }
  });
}

export function registerMeshImport() {
  const bedrock = Codecs?.bedrock;
  if (!bedrock) return;

  bedrock.on('parse', handleGeometryParse);
  bedrock.on('parsed', handleGeometryParsed);
  try {
    registerOpenChoice();
  } catch (error) {
    console.error('[AzureLib] Could not set up the AzureLib/Bedrock open prompt', error);
  }

  importAction = new Action('import_azurelib_geo', {
    name: 'Import AzureLib .geo Model',
    description: 'Open a .geo.json as an AzureLib model, rebuilding its meshes, armatures and vertex weights.',
    icon: 'view_in_ar',
    category: 'file',
    click() {
      Blockbench.import({
        resource_id: 'model',
        type: 'AzureLib Geometry',
        extensions: ['json'],
        readtype: 'text',
        multiple: false,
      }, files => {
        if (files?.[0]) importGeometryFile(files[0]);
      });
    },
  });
  MenuBar.addAction(importAction, 'file.import');
}

export function unregisterMeshImport() {
  const bedrock = Codecs?.bedrock;
  bedrock?.events?.parse?.remove?.(handleGeometryParse);
  bedrock?.events?.parsed?.remove?.(handleGeometryParsed);
  unregisterOpenChoice();
  importAction?.delete();
  importAction = null;
  pending = null;
}
