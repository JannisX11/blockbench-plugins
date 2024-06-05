import { registry, setups } from "../../constants";

// TODO: Teardown toolbars

setups.push(() => {
  registry.displaySettingsPanel = new Panel("display_settings", {
    name: "PBR Display Settings",
    id: "display_settings_panel",
    icon: "display_settings",
    toolbars: [
      new Toolbar("controls_toolbar", {
        id: "controls_toolbar",
        children: [
          "toggle_pbr",
          "correct_lights",
          "display_settings_tone_mapping",
          "display_settings_exposure",
          "display_settings_reset_exposure",
        ],
        name: "Display Settings",
      }),
    ],
    display_condition: {
      modes: ["edit", "paint", "animate"],
      project: true,
    },
    component: {},
    expand_button: true,
    growable: false,
    onFold() {},
    onResize() {},
    default_side: "left",
    default_position: {
      slot: "left_bar",
      float_position: [0, 0],
      float_size: [400, 300],
      height: 300,
      folded: false,
    },
    insert_after: "textures",
    insert_before: "color",
  });
});
