import { registry, setups, teardowns } from "../../constants";
import { CHANNELS } from "../../constants";
import PbrMaterial from "../PbrMaterials";
import { getSelectedLayer, getSelectedTexture } from "../util";
import { createNormalMap, createAoMap } from "../normalMap";

setups.push(() => {
  registry.generateNormal = new Action("generate_normal", {
    icon: CHANNELS.normal.icon ?? "altitude",
    name: "Generate Normal Map",
    description: "Generates a normal map from the height map",
    condition: () => (getSelectedLayer() ?? getSelectedTexture()) !== null,
    click(e) {
      const texture: Texture | TextureLayer =
        getSelectedLayer() ?? getSelectedTexture() ?? Texture.getDefault();

      if (!texture) {
        return;
      }

      const normalMap = createNormalMap(texture);

      if (!normalMap) {
        Blockbench.showQuickMessage("Failed to generate normal map", 2000);
        return;
      }

      normalMap.select(e);

      new PbrMaterial(
        texture instanceof Texture && texture.layers_enabled
          ? texture.layers
          : null,
        texture.uuid
      ).saveTexture(CHANNELS.normal, normalMap);

      Blockbench.showQuickMessage("Normal map generated", 2000);
    },
  });

  registry.generateAo = new Action("generate_ao", {
    icon: CHANNELS.ao.icon ?? "motion_mode",
    name: "Generate Ambient Occlusion Map",
    description: "Generates an ambient occlusion map from the height map",
    condition: {
      selected: {
        texture: true,
      },
      project: true,
    },
    click() {
      const texture: Texture | TextureLayer =
        getSelectedLayer() ?? getSelectedTexture() ?? Texture.getDefault();

      if (!texture) {
        return;
      }

      const mat = new PbrMaterial(
        texture instanceof Texture && texture.layers_enabled
          ? texture.layers
          : null,
        texture.uuid
      );

      const normalMap =
        mat.findTexture(CHANNELS.normal) ?? createNormalMap(texture);

      if (!normalMap) {
        // TODO: Use Validator
        Blockbench.showQuickMessage(
          "Unable to generate ambient occlusion map without a normal map",
          2000
        );
        return;
      }

      const aoMap = createAoMap(normalMap);

      if (aoMap) {
        mat.saveTexture(CHANNELS.ao, aoMap);
        aoMap.select();
        Blockbench.showQuickMessage("Ambient occlusion map generated", 2000);
        return;
      }

      Blockbench.showQuickMessage(
        "Failed to generate ambient occlusion map",
        2000
      );
    },
  });

  MenuBar.addAction(registry.generateNormal, "tools");
  MenuBar.addAction(registry.generateAo, "tools");
});

teardowns.push(() => {
  MenuBar.removeAction(`tools.generate_normal`);
});
