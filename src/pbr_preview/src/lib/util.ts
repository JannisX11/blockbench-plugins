export function getSelectedTexture(): Texture | null {
  if (Texture.selected) {
    return Texture.selected;
  }

  if (TextureLayer.selected) {
    return TextureLayer.selected.texture;
  }

  if (!Project) {
    return Texture.all.find((t) => t.selected) ?? Texture.getDefault();
  }

  if (Project.selected_texture) {
    return Project.selected_texture;
  }

  return Project.textures.find((t) => t.selected) ?? null; // Texture.getDefault();
}

export function getSelectedLayer(): TextureLayer | null {
  if (TextureLayer.selected) {
    return TextureLayer.selected;
  }

  if (Texture.selected?.selected_layer) {
    return Texture.selected.selected_layer;
  }

  if (
    Project.selected_texture !== null &&
    Project.selected_texture?.layers_enabled === true
  ) {
    return (
      Project.selected_texture.layers.find((l: TextureLayer) => l.selected) ??
      Project.selected_texture.layers[0]
    );
  }

  return getSelectedTexture()?.getActiveLayer() ?? null;
}

export function getOutputBaseName() {
  if (!Project) {
    return pathToName(getSelectedTexture()?.name ?? "texture");
  }

  return Project.model_identifier.length > 0
    ? Project.model_identifier
    : Project.getDisplayName();
}

export function getMaterialsFromProject() {
  const materials: Record<string, THREE.MeshStandardMaterial> = {};
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

      if (projectMaterial.isMeshStandardMaterial) {
        materials[texture.uuid] = projectMaterial;
      }
    });
  });

  return materials;
}

export function debounce(func: Function, wait: number) {
  let timeout: number | undefined;
  return function (this: any, ...args: any[]) {
    const later = () => {
      timeout = undefined;
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
