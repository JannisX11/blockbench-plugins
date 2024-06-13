import { three as THREE } from "../deps";
import PbrMaterial from "./PbrMaterials";
import { debounce } from "./util";

function applyToFace(
  face: CubeFace | MeshFace,
  materialParams: THREE.MeshStandardMaterialParameters
) {
  const texture = face.getTexture();

  if (!texture || !Project) {
    return null;
  }

  const projectMaterial = Project.materials[texture.uuid];

  if (projectMaterial.isShaderMaterial && !Project.bb_materials[texture.uuid]) {
    Project.bb_materials[texture.uuid] = projectMaterial;
  }

  const material = new PbrMaterial(
    texture.layers_enabled
      ? texture.layers.filter((layer) => layer.visible) ?? null
      : Project.textures,
    texture.uuid
  ).getMaterial(materialParams);

  material.side = Canvas.getRenderSide(texture) as THREE.Side;

  Project.materials[texture.uuid] = THREE.ShaderMaterial.prototype.copy.call(
    material,
    projectMaterial
  );

  return texture;
}

function updateFaces(applied: Record<string, Texture>) {
  return (
    Object.values(applied).filter((texture) => {
      if (texture) {
        Canvas.updateAllFaces(texture);
        return true;
      }

      return false;
    }).length > 0
  );
}

function applyToMesh(
  mesh: Mesh,
  materialParams: THREE.MeshStandardMaterialParameters
) {
  const applied: Record<string, Texture> = {};
  mesh.forAllFaces((face) => {
    const texture = applyToFace(face, materialParams);

    if (texture) {
      applied[texture.uuid] = texture;
    }
  });

  return updateFaces(applied);
}

function applyToCube(
  cube: Cube,
  materialParams: THREE.MeshStandardMaterialParameters
) {
  const applied: Record<string, Texture> = {};

  Object.keys(cube.faces).forEach((key) => {
    const face = cube.faces[key];
    const texture = applyToFace(face, materialParams);

    if (texture) {
      applied[texture.uuid] = texture;
    }
  });

  return updateFaces(applied);
}

/**
 * ### Apply PBR Material
 * Iterates over all faces in the project and applies a PBR material to each face
 * @param materialParams Parameters to extend the base material with
 * @returns `THREE.MeshStandardMaterial` with PBR textures applied
 */
export const applyPbrMaterial = (
  materialParams: THREE.MeshStandardMaterialParameters = {}
) => {
  if (!Project) {
    return;
  }

  // @ts-expect-error - Property 'pbr_active' does not exist on type 'Project'
  Project.pbr_active =
    Texture.all.length > 0 &&
    Project.elements
      .map(
        (item) =>
          (item instanceof Mesh && applyToMesh(item, materialParams)) ||
          (item instanceof Cube && applyToCube(item, materialParams))
      )
      .filter(Boolean).length > 0;
};

export const debounceApplyPbrMaterial = (wait = 100) =>
  debounce(applyPbrMaterial, wait);
