import { registry, setups, teardowns } from "../../constants";
import { CHANNELS } from "../../constants";
import PbrMaterial from "../PbrMaterials";
import { getSelectedLayer, getSelectedTexture } from "../util";
import { createNormalMap, createAoMap } from "../normalMap";

const generateNormal = (
  e: Event,
  orientation: "OpenGL" | "DirectX" = "DirectX"
) => {
  const texture: Texture | TextureLayer =
    getSelectedLayer() ?? getSelectedTexture() ?? Texture.getDefault();

  if (!texture) {
    return;
  }

  const normalMap = createNormalMap(texture, orientation, false);

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
};

setups.push(() => {
  registry.generateDirectXNormal = new Action("generate_dx_normal", {
    icon: CHANNELS.normal.icon ?? "altitude",
    name: "Generate DirectX Normal Map",
    description: "Generates a DirectX normal map from the height map",
    condition: () => (getSelectedLayer() ?? getSelectedTexture()) !== null,
    click: (e) => generateNormal(e),
  });

  registry.generateOpenGlNormal = new Action("generate_opengl_normal", {
    icon: CHANNELS.normal.icon ?? "altitude",
    name: "Generate OpenGL Normal Map",
    description: "Generates an OpenGL normal map from the height map",
    condition: () => (getSelectedLayer() ?? getSelectedTexture()) !== null,
    click: (e) => generateNormal(e, "OpenGL"),
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

  registry.generateNormal = new Action("generate_normal", {
    children: [registry.generateDirectXNormal, registry.generateOpenGlNormal],
    name: "Generate Normal Map",
    description: "Generates a normal map from the height map",
    condition: () => (getSelectedLayer() ?? getSelectedTexture()) !== null,
    click() {},
    icon: CHANNELS.normal.icon ?? "altitude",
  });

  MenuBar.addAction(registry.generateNormal, "tools");
  MenuBar.addAction(registry.generateAo, "tools");
});

teardowns.push(() => {
  MenuBar.removeAction(`tools.generate_normal`);
  MenuBar.removeAction(`tools.generate_ao`);
});
