import {
  registry,
  CHANNELS,
  setups,
  teardowns,
  NA_CHANNEL,
} from "../../constants";
import { three as THREE } from "../../deps";
import PbrMaterial from "../PbrMaterials";
import {
  colorDataUrl,
  generatePreviewImage,
  getSelectedTexture,
} from "../util";

setups.push(() => {
  registry.createMaterialTexture = new Action("create_material_texture", {
    icon: "stacks",
    name: "Create Material Texture",
    description: "Creates a new texture for a PBR material",
    condition: {
      modes: ["edit", "paint"],
      project: true,
    },
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
      });

      texture.extend({ material: true });

      const scope =
        Texture.all.filter((t) => t.selected || t.multi_selected) ??
        Texture.all;

      const selected = getSelectedTexture();

      const mat = selected ? new PbrMaterial(scope, selected.uuid) : null;

      try {
        const baseColor =
          mat?.findTexture(CHANNELS.albedo, true)?.canvas.toDataURL() ??
          selected?.canvas.toDataURL() ??
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
            keep_size: true,
          },
          texture
        );

        layer.extend({ channel: channels.albedo.id });
        layer.addForEditing();
        layer.texture.updateChangesAfterEdit();
        mat?.saveTexture(channels.albedo, layer);
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
              keep_size: true,
            },
            texture
          );

          layer.extend({ channel: channel.id });

          mat?.saveTexture(channel, layer);

          return layer;
        })
        .filter(Boolean) as TextureLayer[];

      Undo.initEdit({ textures: Texture.all, layers });

      texture.add().select();
      texture.activateLayers();
      layers.map((layer) => {
        layer.addForEditing();

        texture.width = Math.max(texture.width, layer.img.width);
        texture.height = Math.max(texture.height, layer.img.height);
      });
      texture.updateChangesAfterEdit();

      Undo.finishEdit("Create Material Texture");

      if (mat) {
        texture.updateSource(generatePreviewImage(mat.getMaterial()));
      }
    },
  });

  Blockbench.on("save_project", function generateMaterialThumbnail() {
    Texture.all.map((texture) => {
      if (!texture.material) {
        return;
      }

      const mat = new PbrMaterial(texture.layers, texture.uuid);

      texture.updateSource(generatePreviewImage(mat.getMaterial()));
    });
  });

  MenuBar.addAction(registry.createMaterialTexture, "tools");
  Toolbars.texturelist.add(registry.createMaterialTexture, 3);
});

teardowns.push(() => {
  MenuBar.removeAction("tools.create_material_texture");
  Toolbars.texturelist.remove("tools.create_material_texture");
});
