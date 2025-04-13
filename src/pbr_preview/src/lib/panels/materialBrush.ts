import { registry, setups } from "../../constants";

setups.push(() => {
  registry.materialBrushPanel = new Panel("material_brush_panel", {
    name: "Material Brush",
    id: "material_brush_panel",
    icon: "view_in_ar",
    toolbars: [
      new Toolbar("material_brush_toolbar", {
        id: "material_brush_toolbar",
        children: [
          "material_brush",
          "load_brush_preset",
          "slider_brush_metalness",
          "slider_brush_roughness",
          "brush_emissive_color",
          "slider_brush_height",
        ],
        name: "Material Settings",
      }),
    ],
    condition: {
      modes: ["paint"],
      project: true,
    },
    component: {},
    expand_button: true,
    growable: false,
    onFold() {},
    onResize() {},
    default_side: "right",
    default_position: {
      slot: "right_bar",
      float_position: [0, 0],
      float_size: [400, 300],
      height: 300,
      folded: false,
    },
    insert_after: "color",
    insert_before: "outliner",
  });
});
