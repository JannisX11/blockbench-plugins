import { CHANNELS, registry, setups, teardowns } from "../../constants";
import PbrMaterial from "../PbrMaterials";
import { exportMer } from "../mer";
import { getSelectedTexture } from "../util";

setups.push(() => {
  registry.generateMer = new Action("create_mer", {
    icon: "lightbulb_circle",
    name: "Export MER",
    description:
      "Exports a texture map from the metalness, emissive, and roughness channels. (For use in Bedrock resource packs.)",
    condition: {
      formats: ["bedrock", "bedrock_block"],
      project: true,
    },
    click() {
      try {
        exportMer();
      } catch (err) {
        console.error("Failed to export MER map:", err);
        Blockbench.showStatusMessage("Failed to export MER map", 3000);
      }
    },
  });

  registry.decodeMer = new Action("decode_mer", {
    name: "Decode MER",
    icon: "arrow_split",
    condition: {
      formats: ["bedrock", "bedrock_block"],
      project: true,
      selected: {
        texture: true,
      },
    },
    children: [
      {
        icon: "move_item",
        name: "Decode MER to Textures",
        description:
          "Decodes a MER texture map into metalness, emissive, and roughness channels into separate textures",
        click() {
          const selected = getSelectedTexture() ?? Texture.getDefault();

          const mat = new PbrMaterial([selected], selected.uuid);

          const mer = mat.decodeMer();
          const merChannels = [
            CHANNELS.metalness,
            CHANNELS.emissive,
            CHANNELS.roughness,
          ];

          Undo.initEdit({ textures: [selected] });

          merChannels.forEach((channel) => {
            const key = channel.id as keyof typeof mer;
            const canvas = mer[key];

            if (!canvas) {
              Blockbench.showStatusMessage(
                `Failed to decode ${channel.label} channel`,
                3000
              );
              return;
            }

            const texture = new Texture({
              name: `${selected?.name}_${key}`,
              keep_size: false,
            }).fromDataURL(canvas.toDataURL());

            texture.add(true);

            mat.saveTexture(channel, texture);
          });

          Undo.finishEdit("Decode MER to textures");
        },
      },
      {
        icon: "move_group",
        name: "Decode MER to Layers",
        description:
          "Decodes a MER texture map into metalness, emissive, and roughness channels into material layers",
        condition: () => getSelectedTexture()?.layers_enabled === true,
        click() {
          const selected =
            TextureLayer.selected?.texture ??
            Texture.all.find((t) => t.selected) ??
            Texture.getDefault();

          const mat = new PbrMaterial(
            selected.layers_enabled ? selected.layers : [selected],
            selected.uuid
          );

          const mer = mat.decodeMer();
          const merChannels = [
            CHANNELS.metalness,
            CHANNELS.emissive,
            CHANNELS.roughness,
          ];

          Undo.initEdit({ textures: [selected] });

          const copy = selected.selected.activateLayers(true);

          merChannels.forEach((channel) => {
            const key = channel.id as keyof typeof mer;
            const canvas = mer[key];

            if (!canvas) {
              Blockbench.showStatusMessage(
                `Failed to decode ${channel.label} channel`,
                3000
              );
              return;
            }

            const layer = new TextureLayer(
              {
                name: `${selected?.name}_${key}`,
                data_url: canvas.toDataURL(),
              },
              selected
            );

            mat.saveTexture(channel, layer);

            layer.addForEditing();
          });

          Undo.finishEdit("Decode MER to layers");
        },
      },
    ],
    click() {},
  });

  MenuBar.addAction(registry.decodeMer, "tools");
  MenuBar.addAction(registry.generateMer, "file.export");
});

teardowns.push(() => {
  MenuBar.removeAction(`file.export.create_mer`);
  MenuBar.removeAction(`tools.decode_mer`);
});
