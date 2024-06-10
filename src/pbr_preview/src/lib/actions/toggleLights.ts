import { registry, setups, teardowns } from "../../constants";
import { debounceApplyPbrMaterial } from "../applyPbrMaterial";

setups.push(() => {
  registry.toggleCorrectLights = new Toggle("correct_lights", {
    category: "preview",
    name: "Correct Lights",
    description: "Corrects the lighting in the preview",
    icon: "fluorescent",
    default: false,
    onChange(value) {
      Preview.all.forEach((preview) => {
        preview.renderer.physicallyCorrectLights = value;
      });

      Preview.selected.renderer.physicallyCorrectLights = value;

      Blockbench.showQuickMessage(
        `Physically corrected lighting is now ${value ? "enabled" : "disabled"}`,
        2000,
      );

      if (value) {
        // @ts-expect-error Set method exists on the toggle
        registry.togglePbr?.set(true);
      }

      debounceApplyPbrMaterial();
    },
    click() {},
  });

  MenuBar.addAction(registry.toggleCorrectLights, "preview");
});

teardowns.push(() => {
  MenuBar.removeAction("preview.correct_lights");
});
