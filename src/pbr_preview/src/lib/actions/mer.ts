import { CHANNELS, registry, setups, teardowns } from "../../constants";
import PbrMaterial from "../PbrMaterials";
import { exportMer } from "../mer";

export function setup() {
  registry.generateMer = new Action("create_mer", {
    icon: "lightbulb_circle",
    name: "Export MER",
    description:
      "Exports a texture map from the metalness, emissive, and roughness channels. (For use in Bedrock resource packs.)",
    condition: {
      formats: ["bedrock_block", "bedrock_entity"],
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
    icon: "arrow_split",
    name: "Decode MER",
    description:
      "Decodes a MER texture map into metalness, emissive, and roughness channels",
    condition: () =>
      !!Project &&
      Project.selected_texture !== null &&
      !Project.selected_texture.layers_enabled,
    click() {
      const selected =
        TextureLayer.selected?.texture ??
        Texture.all.find((t) => t.selected) ??
        Texture.getDefault();

      const mat = new PbrMaterial(
        selected.layers_enabled ? selected.layers : [selected],
        selected.uuid,
      );

      const mer = mat.decodeMer();
      const merChannels = [
        CHANNELS.metalness,
        CHANNELS.emissive,
        CHANNELS.roughness,
      ];

      Undo.initEdit({ textures: [selected] });
      selected.activateLayers(true);

      merChannels.forEach((channel) => {
        const key = channel.id as keyof typeof mer;
        const canvas = mer[key];

        if (!canvas) {
          Blockbench.showStatusMessage(
            `Failed to decode ${channel.label} channel`,
            3000,
          );
          return;
        }

        const layer = new TextureLayer(
          {
            name: `${selected?.name}_${key}`,
            data_url: canvas.toDataURL(),
          },
          selected,
        );

        mat.saveTexture(channel, layer);

        layer.addForEditing();
      });

      Undo.finishEdit("Decode MER");
    },
  });

  MenuBar.addAction(registry.decodeMer, "tools");
  MenuBar.addAction(registry.generateMer, "file.export");
}

export function teardown() {
  MenuBar.removeAction(`file.export.create_mer`);
  MenuBar.removeAction(`tools.decode_mer`);
}

setups.push(setup);
teardowns.push(teardown);
