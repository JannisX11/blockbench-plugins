import { three as THREE } from "../../deps";
import { registry, setups, teardowns } from "../../constants";
import { bakeTextures } from "../bakery";

setups.push(() => {
  registry.bakeTexturesDialog = new Dialog("bake_textures", {
    id: "bake_textures",
    title: "Bake Textures",
    buttons: ["Bake", "Cancel"],
    form: {
      ambientLight: {
        type: "color",
        label: "Ambient Light",
        value: "#1f1f1f",
      },
      lightDiffuse: {
        type: "color",
        label: "Light Diffuse",
        value: "#ffffff",
      },
      lightHeight: {
        type: "range",
        label: "Light Height",
        min: 0,
        max: 1,
        step: 0.01,
        value: 0.66,
      },
      minLightIntensity: {
        type: "range",
        label: "Minimum Light Intensity",
        min: 0,
        max: 1,
        step: 0.01,
        value: 0,
      },
      directions: {
        type: "number",
        label: "Directions",
        value: 8,
        min: 1,
        max: 360,
        step: 1,
      },
      blendEmissive: {
        type: "checkbox",
        label: "Blend Emissive",
        value: false,
      },
    },
    onConfirm(formResult: Record<string, any>) {
      const ambientLight = new THREE.Color(formResult.ambientLight.toString());
      const lightDiffuse = new THREE.Color(formResult.lightDiffuse.toString());
      bakeTextures(
        {
          ambientLight: [ambientLight.r, ambientLight.g, ambientLight.b],
          lightDiffuse: [lightDiffuse.r, lightDiffuse.g, lightDiffuse.b],
          lightHeight: Number(formResult.lightHeight),
          minLightIntensity: Number(formResult.minLightIntensity),
        },
        formResult.directions ?? 8,
        formResult.blendEmissive ?? false,
      );
    },
  });

  registry.bakeTexturesAction = new Action("bake_textures", {
    icon: "cake",
    name: "Bake Textures",
    description: "Bakes textures for the selected PBR material",
    click() {
      registry.bakeTexturesDialog?.show();
    },
  });

  MenuBar.addAction(registry.bakeTexturesAction, "tools");
});

teardowns.push(() => {
  MenuBar.removeAction("tools.bake_textures");
});
