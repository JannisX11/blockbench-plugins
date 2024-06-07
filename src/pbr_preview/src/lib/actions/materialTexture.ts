import { registry, CHANNELS, setups, teardowns } from "../../constants";
import { three as THREE } from "../../deps";
import PbrMaterial from "../PbrMaterials";

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

      const channels = {
        ...CHANNELS,
      };

      const texture = new Texture({
        name: "New Material",
        saved: false,
        particle: false,
        keep_size: false,
        layers_enabled: true,
      });

      const scope =
        Texture.all.filter((t) => t.selected || t.multi_selected) ??
        Texture.all;

      const mat = Texture.selected
        ? new PbrMaterial(scope, Texture.selected.uuid)
        : null;

      try {
        const baseColor =
          mat?.findTexture(CHANNELS.albedo, true)?.canvas.toDataURL() ??
          Texture.selected?.canvas.toDataURL() ??
          colorDataUrl(new THREE.Color(0x808080), texture.canvas);

        if (!baseColor) {
          return;
        }

        texture.fromDataURL(baseColor);

        const layer = new TextureLayer(
          {
            name: channels.albedo.label,
            visible: true,
            data_url: baseColor,
          },
          texture
        );

        layer.extend({ channel: channels.albedo.id });

        layer.addForEditing();
        layer.texture.updateChangesAfterEdit();

        delete channels.albedo;
      } catch (e) {
        console.warn("Failed to create base color texture", e);
        Blockbench.showStatusMessage(
          "Failed to create base color texture in new material",
          3000
        );
      }

      // Create PBR channels as texture layers for the new texture
      const layers = Object.keys(channels)
        .map((key) => {
          const channel = CHANNELS[key];
          const channelTexture = mat?.findTexture(channel, true);

          const data = channelTexture
            ? channelTexture.canvas.toDataURL()
            : colorDataUrl(channel.default ?? new THREE.Color(0));

          if (!data) {
            return;
          }

          const layer = new TextureLayer(
            {
              name: channel.label,
              visible: true,
              data_url: data,
            },
            texture
          );

          layer.extend({ channel: channel.id });

          return layer;
        })
        .filter(Boolean) as TextureLayer[];

      Undo.initEdit({ textures: Texture.all, layers });

      texture.add().select();
      layers.map((layer) => layer.addForEditing());
      texture.updateChangesAfterEdit();

      Undo.finishEdit("Create Material Texture");
    },
  });

  MenuBar.addAction(registry.createMaterialTexture, "tools");
  Toolbars.texturelist.add(registry.createMaterialTexture, 3);
});

teardowns.push(() => {
  MenuBar.removeAction("tools.create_material_texture");
});
