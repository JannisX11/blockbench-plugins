import { three as THREE } from "../deps";

/**
 * Attempts to find the selected texture/layer using various methods
 * @returns Texture | null
 */
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

/**
 * Attempts to find the currently selected layer
 * @returns TextureLayer | null
 */
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

  if (!Project) {
    return materials;
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

export function generatePreviewImage(
  settings:
    | THREE.MeshStandardMaterial
    | (THREE.MeshStandardMaterialParameters & {
        albedo: THREE.ColorRepresentation;
        emissive: THREE.ColorRepresentation;
        height?: number;
      })
): string {
  const renderer =
    MediaPreview.renderer ??
    new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 96 / 96, 0.1, 1000);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);
  const geometry = new THREE.SphereGeometry(1, 32, 32);

  const material =
    settings instanceof THREE.MeshStandardMaterial &&
    settings.isMeshStandardMaterial
      ? settings
      : new THREE.MeshStandardMaterial({
          color: settings.albedo,
          metalness: settings.metalness ?? 0,
          roughness: settings.roughness ?? 1,
          emissive: settings.emissive,
          bumpScale: settings.height ?? 0,
          envMap: PreviewScene.active?.cubemap ?? null,
          envMapIntensity: 0.5,
        });

  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 2;

  renderer.setSize(96, 96);

  renderer.render(scene, camera);

  const data = renderer.domElement.toDataURL();

  material.dispose();

  if (!MediaPreview.renderer) {
    renderer.clear();
    renderer.dispose();
  }

  return data;
}

export function colorDataUrl(color: THREE.Color, src?: HTMLCanvasElement) {
  const canvas = src ?? document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    canvas.remove();
    return null;
  }

  const width = Math.max(Project ? Project.texture_width : 16, 16);
  const height = Math.max(Project ? Project.texture_height : 16, 16);

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
  ctx.fillRect(0, 0, width, height);

  const data = canvas.toDataURL();

  if (!src) {
    canvas.remove();
  }

  return data;
}
