import { registry, setups, teardowns } from "../../constants";
import PbrMaterial from "../PbrMaterials";

const exportNormalMap = (
  normalMap: HTMLCanvasElement,
  baseName = "texture",
) => {
  normalMap.toBlob(async (blob) => {
    if (!blob) {
      return;
    }

    Blockbench.export({
      content: await blob.arrayBuffer(),
      type: "PNG",
      name: `${baseName}_n`,
      extensions: ["png"],
      resource_id: "normal_map",
      savetype: "image",
    });
  });
};

const exportSpecularMap = (
  specularMap: HTMLCanvasElement,
  baseName = "texture",
) => {
  specularMap.toBlob(async (blob) => {
    if (!blob) {
      return;
    }

    Blockbench.export({
      content: await blob.arrayBuffer(),
      type: "PNG",
      name: `${baseName}_s`,
      extensions: ["png"],
      resource_id: "specular_map",
      savetype: "image",
    });
  });
};

setups.push(() => {
  registry.generateLabPbr = new Action("generate_lab_pbr", {
    icon: "experiment",
    name: "Generate labPBR textures",
    description:
      "Generate a specular and normal map in labPBR format for Java shaders",
    condition: {
      formats: ["java_block"],
      project: true,
    },
    async click() {
      const selected = Project.selected_texture;
      if (!selected) {
        return;
      }
      const mat = new PbrMaterial(
        selected.layers_enabled ? selected.layers : [selected],
        selected.uuid,
      );
      const outputs = mat.createLabPbrOutput();

      if (outputs === null) {
        return;
      }

      const baseName =
        selected.name ?? (!!Project ? Project.getDisplayName() : "texture");

      await Promise.all([
        exportNormalMap(outputs.normalMap, pathToName(baseName)),
        exportSpecularMap(outputs.specular, pathToName(baseName)),
      ]);

      Blockbench.showQuickMessage("Exported labPBR textures");
    },
  });

  registry.decodeLabPbr = new Action("decode_lab_pbr", {
    icon: "frame_source",
    name: "Decode labPBR textures",
    description:
      "Decodes the selected texture into a specular or normal map in labPBR format",
    condition: () => !!Project && Project.selected_texture !== null,
    click() {
      const selected =
        TextureLayer.selected?.texture ??
        Texture.all.find((t) => t.selected) ??
        Texture.getDefault();

      const mat = new PbrMaterial(
        selected.layers_enabled ? selected.layers : [selected],
        selected.uuid,
      );

      if (selected.name.endsWith("_n") || selected.name.endsWith("_n.png")) {
        mat.createTexturesFromNormal(selected);
        return;
      }

      if (selected.name.endsWith("_s") || selected.name.endsWith("_s.png")) {
        mat.createTexturesFromSpecular(selected);
        return;
      }

      Blockbench.showQuickMessage("Failed to decode labPBR texture");
    },
  });

  MenuBar.addAction(registry.generateLabPbr, "file.export");
  MenuBar.addAction(registry.decodeLabPbr, "tools");
});

teardowns.push(() => {
  MenuBar.removeAction("file.export.generate_lab_pbr");
});
