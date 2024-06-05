/**
 * ### Disable PBR
 * Reverts all faces in the project to their original materials
 * @returns void
 */
export const disablePbr = () => {
  if (!Project || !Project.bb_materials) {
    return;
  }

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

      const projectMaterial = Project.bb_materials[texture.uuid];

      if (!projectMaterial) {
        return;
      }

      Project.materials[texture.uuid] = projectMaterial;
    });
  });

  Project.pbr_active = false;
  Canvas.updateAll();
};
