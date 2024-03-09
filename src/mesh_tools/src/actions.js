const MESH_CONDITION = {
  modes: ["edit"],
  features: ["meshes"],
};
const OBJECT_MODE_CONDITION = {
  modes: ["edit"],
  features: ["meshes"],
  method: () =>
    Mesh.selected.length && BarItems["selection_mode"].value == "object",
};
const NON_OBJECT_MODE_CONDITION = {
  modes: ["edit"],
  features: ["meshes"],
  method: () =>
    Mesh.selected.length && BarItems["selection_mode"].value != "object",
};

const LANG_BEFORE = "Before";
const LANG_AFTER = "After";
const LANG_MESH = "Mesh";
const LANG_UV = "Uv";
export const ACTIONS = /** @type {const}  */ ({
  laplacian_smooth: {
    docs: {
      images: [
        { src: "laplacian_smooth_before.png", caption: LANG_BEFORE },
        { src: "laplacian_smooth_after.png", caption: LANG_AFTER },
      ],
    },
    name: "Laplacian Smooth",
    icon: "blur_on",
    description:
      "Smoothens selected vertices by averaging the position of neighboring vertices.",
  },
  to_sphere: {
    docs: {
      images: [
        { src: "to_sphere_1_before.png", caption: LANG_BEFORE },
        { src: "to_sphere_1_after.png", caption: LANG_AFTER },
        { src: "to_sphere_2_before.png", caption: LANG_BEFORE },
        { src: "to_sphere_2_after.png", caption: LANG_AFTER },
      ],
    },
    name: "To Sphere",
    icon: "change_circle",
    description:
      "Casts selected vertices into a smooth, spherical shape with adjustable influence.",
  },
  bridge_edge_loops: {
    docs: {
      images: [],
    },
    name: "Bridge Edge Loops",
    icon: "hub",
    description: "Connects multiple edge loops with faces.",
    selection_mode: ["edge", "face"],
  },
  poke: {
    docs: {
      images: [
        { src: "poke_before.png", caption: LANG_BEFORE },
        { src: "poke_after.png", caption: LANG_AFTER },
      ],
    },
    name: "Poke Faces",
    icon: "control_camera",
    description: "Generates a fan out of a face.",
    selection_mode: "face",
  },
  tris_to_quad: {
    docs: {
      images: [
        { src: "tris_to_quad_before.png", caption: LANG_BEFORE },
        { src: "tris_to_quad_after.png", caption: LANG_AFTER },
      ],
    },
    name: "Triangles To Quadrilaterals",
    icon: `fas.fa-external-link-square-alt`,
    description: "Attempts to merge adjacent triangles into quadrilaterals.",
    selection_mode: "face",
  },
  triangulate: {
    docs: {
      images: [
        { src: "triangulate_before.png", caption: LANG_BEFORE },
        { src: "triangulate_after.png", caption: LANG_AFTER },
      ],
    },
    name: "Triangulate Faces",
    icon: "pie_chart_outline",
    description: "Splits selected faces into triangles.",
    selection_mode: "face",
  },
  uv_project_view: {
    docs: {
      images: [
        { src: "uv_project_view_solid.png", caption: LANG_MESH },
        { src: "uv_project_view_uv.png", caption: LANG_UV },
      ],
    },
    name: "Project From View",
    icon: "view_in_ar",
    description: "Projects the selected faces to the UV map from the camera.",
  },
  uv_turnaround_projection: {
    docs: {
      images: [
        { src: "uv_turnaround_projection_solid.png", caption: LANG_MESH },
        { src: "uv_turnaround_projection_uv.png", caption: LANG_UV },
      ],
    },
    name: "Cubic Projection",
    icon: "open_with",
    description: "Unwraps the UV map from the 6 sides of a cube.",
  },
  uv_mapping: {
    name: "UV Mapping",
    icon: "map",
    children: ["uv_project_view", "uv_turnaround_projection"],
  },
  expand_selection: {
    name: "Expand Selection",
    icon: "unfold_more_double",
    description: "Expands the selection with neighboring vertices.",
    keybind: {
      key: "l",
      ctrl: true,
    },
  },
  shrink_selection: {
    name: "Shrink Selection",
    icon: "unfold_less_double",
    description: "Shrinks the selection with neighboring vertices.",
    keybind: { key: "k", ctrl: true },
  },
  tools: {
    name: "MTools",
    icon: "fas.fa-vector-square",
    condition: NON_OBJECT_MODE_CONDITION,
    children: [
      "to_sphere",
      "laplacian_smooth",
      "bridge_edge_loops",
      "_",
      "poke",
      "tris_to_quad",
      "triangulate",
      "_",
      "uv_mapping",
      "_",
      "expand_selection",
      "shrink_selection",
    ],
  },
  operators: {
    name: "MTools Operators",
    icon: "fas.fa-vector-square",
    condition: OBJECT_MODE_CONDITION,
    children: ["subdivide", "split_edges", "_", "scatter", "array_elements"],
  },
  subdivide: {
    docs: {
      images: [
        { src: "subdivide_before.png", caption: LANG_BEFORE },
        { src: "subdivide_after.png", caption: LANG_AFTER },
      ],
    },
    name: "Subdivide",
    icon: "content_cut",
    description:
      "Splits the faces of a mesh into smaller faces, giving it a smooth appearance.",
  },
  split_edges: {
    docs: {
      images: [{ src: "split_edges.png" }],
    },
    name: "Split Edges",
    icon: "vertical_split",
    description:
      "Splits and duplicates edges within a mesh, breaking 'links' between faces around those split edges.",
  },
  scatter: {
    docs: {
      images: [{ src: "scatter.png" }],
    },
    name: "Scatter",
    description: "Scatters selected meshes on the active mesh.",
    icon: "scatter_plot",
  },
  array_elements: {
    docs: {
      images: [{ src: "array.png" }],
    },
    name: "Array",
    icon: "fas.fa-layer-group",
    description:
      "Generates an array of copies of the base object, with each copy being offset from the previous one.",
  },
  /*  */
  generators: {
    name: "MTools Generate",
    icon: "fas.fa-vector-square",
    condition: MESH_CONDITION,
    children: [
      "terrain_action",
      "terrainse",
      "_",
      "textmesh",
      "xyzmathsurfacefunction",
      "quickprimitives",
    ],
  },
  terrain_action: {
    docs: {
      images: [{ src: "terrain_solid.png" }, { src: "terrain_wire.png" }],
    },
    name: "Terrain",
    icon: "terrain",
    description:
      "Generates terrains procedurally with fully customized settings.",
  },
  terrainse: {
    name: "Terrain Style Editor",
    icon: "draw",
    description:
      "Configure the Custom color gradient style of the terrain generator.",
  },
  textmesh: {
    docs: {
      images: [{ src: "text.png", caption: `"Butcher" expressed in Chinese` }],
    },
    name: "Text Mesh",
    icon: "format_size",
    description:
      "Converts text into a 3D object, ideal for creating signs or logos.",
  },
  xyzmathsurfacefunction: {
    docs: {
      images: [{ src: "xyz.png", caption: `Twisted Torus Preset` }],
    },
    name: "XYZ Math Surface",
    icon: "fas.fa-brain",
    description:
      "Generates an xyz surface based on mathematical equations containing 23 pre-built presets!",
  },
  quickprimitives: {
    name: "Quick Primitives",
    icon: "fas.fa-shapes",
    children: ["polyhedron", "torusknot"],
  },
  polyhedron: {
    docs: {
      images: [{ src: "polyhedron.png", caption: `Icosahedron` }],
    },
    name: "Polyhedron",
    icon: "offline_bolt",
    description:
      "Generate a polyhedron such as an Icosahedron, a Dodecahedron, an Octahedron or a Tetrahedron.",
  },
  torusknot: {
    docs: {
      images: [{ src: "torus_knot.png" }],
    },
    name: "Torus Knot",
    icon: "offline_bolt",
    description: "Generate a Torus Knot with fully customized settings.",
  },
});
for (const id in ACTIONS) {
  const action = ACTIONS[id];
  action.id = id;
}

export const qualifyName = (id) => (id == "_" ? id : `@meshtools/${id}`);

/**
 *
 * @param {keyof ACTIONS} id
 * @param {?Function} click
 * @returns {Action}
 */
export function action(id, click) {
  console.assert(id in ACTIONS, id);

  const options = Object.assign({ click }, ACTIONS[id]);
  if (options.children) {
    // TODO qualify with parents
    options.children = options.children.map(qualifyName);
  }
  if (options.selection_mode) {
    const oldCondition = options.condition;
    options.condition = () =>
      Mesh.selected.length &&
      (options.selection_mode instanceof Array
        ? options.selection_mode.includes(BarItems["selection_mode"].value)
        : BarItems["selection_mode"].value == options.selection_mode) &&
      Condition(oldCondition);
  }
  if (options.keybind) {
    options.keybind = new Keybind(options.keybind);
  }
  return new Action(qualifyName(id), options);
}
