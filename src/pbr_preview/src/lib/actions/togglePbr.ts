import { registry, setups, teardowns } from "../../constants";
import { applyPbrMaterial } from "../applyPbrMaterial";
import { disablePbr } from "../disablePbr";

/**
 * List of Blockbench events which trigger a PBR material update
 */
const subscribeToEvents: EventName[] = [
  "undo",
  "redo",
  "add_texture",
  "finish_edit",
  "finished_edit",
  "load_project",
  "select_preview_scene",
  "change_texture_path",
  "select_project",
];

/**
 * Conditionally triggers the PBR material update based on the `pbr_active` setting
 * @returns void
 */
const renderPbrScene = () =>
  Project && Project.pbr_active && applyPbrMaterial();

const enableListeners = () => {
  subscribeToEvents.forEach((event) => {
    Blockbench.addListener(event as EventName, renderPbrScene);
  });
};

const disableListeners = () => {
  subscribeToEvents.forEach((event) => {
    Blockbench.removeListener(event as EventName, renderPbrScene);
  });
};

setups.push(() => {
  registry.togglePbr = new Toggle("toggle_pbr", {
    name: "PBR Preview",
    description: "Toggle PBR Preview",
    icon: "panorama_photosphere",
    category: "view",
    default: false,
    click() {},
    onChange(value) {
      if (value) {
        applyPbrMaterial();
        enableListeners();

        Blockbench.showQuickMessage("PBR Preview is now enabled");

        return;
      }
      disablePbr();
      disableListeners();

      Blockbench.showQuickMessage("PBR Preview is now disabled");
    },
  });

  MenuBar.addAction(registry.togglePbr, "view");
});

teardowns.push(() => {
  disableListeners();
  MenuBar.removeAction("view.toggle_pbr");
});
