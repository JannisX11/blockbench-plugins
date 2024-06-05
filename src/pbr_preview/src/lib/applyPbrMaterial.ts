import { three as THREE } from "../deps";
import PbrMaterial from "./PbrMaterials";

/**
 * ### Apply PBR Material
 * Iterates over all faces in the project and applies a PBR material to each face
 * @param materialParams Parameters to extend the base material with
 * @returns `THREE.MeshStandardMaterial` with PBR textures applied
 */
export const applyPbrMaterial = (
  materialParams?: THREE.MeshStandardMaterialParameters,
) => {
  // Don't overwrite placeholder material in Edit and Paint mode
  if (!Project || Texture.all.length === 0) {
    return;
  }

  let materialsSet = false;

  Project.elements.forEach((item) => {
    if (!(item instanceof Cube)) {
      return;
    }

    Object.keys(item.faces).forEach((key) => {
      const face = item.faces[key];
      const texture = face.getTexture();

      if (!texture) {
        return;
      }

      const projectMaterial = Project.materials[texture.uuid];

      if (
        projectMaterial.isShaderMaterial &&
        !Project.bb_materials[texture.uuid]
      ) {
        Project.bb_materials[texture.uuid] = projectMaterial;
      }

      const material = new PbrMaterial(
        texture.layers_enabled
          ? texture.layers.filter((layer) => layer.visible) ?? null
          : Project.textures,
        texture.uuid,
      ).getMaterial(materialParams);

      Project.materials[texture.uuid] =
        THREE.ShaderMaterial.prototype.copy.call(material, projectMaterial);

      Canvas.updateAllFaces(texture);
      materialsSet = true;
    });
  });

  Project.pbr_active = materialsSet;
};
