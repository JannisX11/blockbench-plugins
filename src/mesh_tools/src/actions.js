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
const FACE_MODE_CONDITION = {
  modes: ["edit"],
  features: ["meshes"],
  method: () =>
    Mesh.selected.length && BarItems["selection_mode"].value == "face",
};
const VERTEX_MODE_CONDITION = {
  modes: ["edit"],
  features: ["meshes"],
  method: () =>
    Mesh.selected.length && BarItems["selection_mode"].value == "vertex",
};

const ACTIONS = /** @type {const}  */ ({
  laplacian_smooth: {
    name: "Laplacian Smooth",
    icon: "blur_on",
    description:
      "Smoothens selected vertices by averaging the position of neighboring vertices.",
    condition: NON_OBJECT_MODE_CONDITION,
  },
  to_sphere: {
    name: "To Sphere",
    icon: "change_circle",
    description:
      "Casts selected vertices into a smooth, spherical shape with adjustable influence.",
    condition: NON_OBJECT_MODE_CONDITION,
  },
  poke: {
    name: "Poke Faces",
    description: "Generates a fan out of a face.",
    icon: "control_camera",
    condition: FACE_MODE_CONDITION,
  },
  tris_to_quad: {
    name: "Triangles To Quadrilaterals",
    description: "Attempts to merge adjacent triangles into quadrilaterals.",
    icon: `fas.fa-external-link-square-alt`,
    condition: FACE_MODE_CONDITION,
  },
  triangulate: {
    name: "Triangulate Faces",
    description: "Splits selected faces into triangles.",
    icon: "pie_chart_outline",
    condition: FACE_MODE_CONDITION,
  },
  uv_project_view: {
    name: "Project From View",
    description: "Projects the selected faces to the UV map from the camera.",
    icon: "view_in_ar",
  },
  uv_turnaround_projection: {
    name: "Cubic Projection",
    description: "Unwraps the UV map from the 6 sides of a cube.",
    icon: "open_with",
  },
  uv_mapping: {
    name: "UV Mapping",
    icon: "map",
    condition: NON_OBJECT_MODE_CONDITION,
    children: ["uv_project_view", "uv_turnaround_projection"],
  },
  expand_selection: {
    name: "Expand Selection",
    icon: "unfold_more_double",
    description: "Expands the selection with neighboring vertices.",
    keybind: { key: "l", ctrl: true },
    condition: VERTEX_MODE_CONDITION,
  },
  shrink_selection: {
    name: "Shrink Selection",
    icon: "unfold_less_double",
    description: "Shrinks the selection with neighboring vertices.",
    keybind: { key: "k", ctrl: true },
    condition: VERTEX_MODE_CONDITION,
  },
  "": {
    name: "MTools",
    icon: "fas.fa-vector-square",
    children: [
      "to_sphere",
      "laplacian_smooth",
      "_",
      "poke",
      "tris_to_quad",
      "triangulate",
      "_",
      "uv_mapping",
      "_",
      "expand_selection",
      "shrink_selection",

      //

      "subdivide",
      "split_edges",
      "_",
      "scatter",
      "array_elements",
    ],
  },

  subdivide: {
    name: "Subdivide",
    icon: "content_cut",
    description:
      "Splits the faces of a mesh into smaller faces, giving it a smooth appearance.",
    condition: OBJECT_MODE_CONDITION,
  },
  split_edges: {
    name: "Split Edges",
    icon: "vertical_split",
    description:
      "Splits and duplicates edges within a mesh, breaking 'links' between faces around those split edges.",
    condition: OBJECT_MODE_CONDITION,
  },
  scatter: {
    name: "Scatter",
    description: "Scatters selected meshes on the active mesh.",
    icon: "scatter_plot",
    condition: OBJECT_MODE_CONDITION,
  },
  array_elements: {
    name: "Array",
    icon: "fas.fa-layer-group",
    description:
      "Generates an array of copies of the base object, with each copy being offset from the previous one.",
    condition: OBJECT_MODE_CONDITION,
  },
  /*  */
  generators: {
    name: "MTools Generate",
    icon: "fas.fa-vector-square",
    children: [
      "terrain_action",
      "terrainse",
      "_",
      "textmesh",
      "xyzmathsurfacefunction",
      "quickprimitives",
    ],
    condition: MESH_CONDITION,
  },
  terrain_action: {
    name: "Terrain",
    description:
      "Generates terrains procedurally with fully customized settings.",
    icon: "terrain",
  },
  terrainse: {
    name: "Terrain Style Editor",
    description:
      "Configure the Custom color gradient style of the terrain generator.",
    icon: "draw",
  },
  textmesh: {
    name: "Text Mesh",
    icon: "format_size",
    description:
      "Converts text into a 3D object, ideal for creating signs or logos.",
  },
  xyzmathsurfacefunction: {
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
    name: "Polyhedron",
    icon: "offline_bolt",
    description:
      "Generate a polyhedron such as an Icosahedron, a Dodecahedron, an Octahedron and a Tetrahedron.",
  },
  torusknot: {
    name: "Torus Knot",
    icon: "offline_bolt",
    description: "Generate a Torus Knot.",
  },
});

const qualifyName = (id) => (id == "" ? "meshtools" : `@meshtools/${id}`);

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
  if (options.keybind) {
    options.keybind = new Keybind(options.keybind);
  }
  return new Action(qualifyName(id), options);
}
