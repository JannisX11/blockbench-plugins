import { registry, CHANNELS, setups, teardowns } from "../../constants";
import { three as THREE } from "../../deps";

const colorDataUrl = (color: THREE.Color, src?: HTMLCanvasElement) => {
  const canvas = src ?? document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const width = Math.max(Project ? Project.texture_width : 16, 16);
  const height = Math.max(Project ? Project.texture_height : 16, 16);

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL();
};

setups.push(() => {
  registry.createMaterialTexture = new Action("create_material_texture", {
    icon: "stacks",
    name: "Create Material Texture",
    description: "Creates a new texture for a PBR material",
    click() {
      if (!Project) {
        return;
      }

      const texture = new Texture({
        name: "New Material",
        saved: false,
        particle: false,
        keep_size: false,
        layers_enabled: true,
      });

      const filler = colorDataUrl(new THREE.Color(0x808080));

      if (!filler) {
        return;
      }

      texture.fromDataURL(filler).add().select();

      // Create PBR channels as texture layers for the new texture
      Object.keys(CHANNELS).forEach((key) => {
        const channel = CHANNELS[key];

        const layer = new TextureLayer(
          {
            name: channel.label,
            visible: true,
          },
          texture,
        );

        layer.setSize(
          Project.texture_width ?? texture.width,
          Project.texture_height ?? texture.height,
        );

        const data = colorDataUrl(
          channel.default ?? new THREE.Color(0),
          layer.canvas,
        );

        if (data) {
          layer.texture.fromDataURL(data);
        }

        layer.extend({ channel: channel.id });

        layer.addForEditing();
      });
    },
  });

  MenuBar.addAction(registry.createMaterialTexture, "tools");
});

teardowns.push(() => {
  MenuBar.removeAction("tools.create_material_texture");
});
