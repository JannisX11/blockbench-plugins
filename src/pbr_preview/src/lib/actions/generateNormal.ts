import { registry, setups, teardowns } from "../../constants";
import { CHANNELS } from "../../constants";
import PbrMaterial from "../PbrMaterials";

setups.push(() => {
  registry.generateNormal = new Action("generate_normal", {
    icon: "altitude",
    name: "Generate Normal Map",
    description: "Generates a normal map from the height map",
    condition: () =>
      (TextureLayer.selected || Texture.all.find((t) => t.selected)) !==
      undefined,
    click() {
      const texture: Texture | TextureLayer =
        TextureLayer.selected ??
        (!!Project && Project.selected_texture
          ? // @ts-ignore Selected layer does exist on selected_texture property
            Project.selected_texture.selected_layer ?? Project.selected_texture
          : Texture.getDefault());

      if (!texture) {
        return;
      }

      const mat = new PbrMaterial(
        texture instanceof Texture && texture.layers_enabled
          ? texture.layers
          : null,
        texture.uuid,
      );

      const normalMap = mat.createNormalMap(texture);

      if (normalMap) {
        mat.saveTexture(CHANNELS.normal, normalMap);
        normalMap.select();
        Blockbench.showQuickMessage("Normal map generated", 2000);
        return;
      }

      Blockbench.showQuickMessage("Failed to generate normal map", 2000);
    },
  });

  MenuBar.addAction(registry.generateNormal, "tools");
});

teardowns.push(() => {
  MenuBar.removeAction(`tools.generate_normal`);
});
