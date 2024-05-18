(function () {
  'use strict';

  var bevel = {
  	docs: {
  		"private": true
  	},
  	name: "Bevel",
  	icon: "rounded_corner",
  	description: "Chamfers selected edges",
  	selection_mode: [
  		"edge"
  	]
  };
  var laplacian_smooth = {
  	docs: {
  		lines: [
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "laplacian_smooth_before.png",
  						caption: "word.before"
  					},
  					{
  						type: "image",
  						src: "laplacian_smooth_after.png",
  						caption: "word.after"
  					}
  				]
  			}
  		]
  	},
  	name: "Laplacian Smooth",
  	icon: "blur_on",
  	description: "Smoothens selected vertices by averaging the position of neighboring vertices."
  };
  var to_sphere = {
  	docs: {
  		lines: [
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "to_sphere_1_before.png",
  						caption: "word.before"
  					},
  					{
  						type: "image",
  						src: "to_sphere_1_after.png",
  						caption: "word.after"
  					}
  				]
  			},
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "to_sphere_2_before.png",
  						caption: "word.before"
  					},
  					{
  						type: "image",
  						src: "to_sphere_2_after.png",
  						caption: "word.after"
  					}
  				]
  			}
  		]
  	},
  	name: "To Sphere",
  	icon: "change_circle",
  	description: "Casts selected vertices into a smooth, spherical shape with adjustable influence."
  };
  var bridge_edge_loops = {
  	docs: {
  		tags: [
  			"New"
  		],
  		lines: [
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "bridge_edge_loops_before.png",
  						caption: "word.before"
  					},
  					{
  						type: "image",
  						src: "bridge_edge_loops_1_after.png",
  						caption: "word.after"
  					}
  				]
  			},
  			"Results with Blend Path enabled.",
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "bridge_edge_loops_before.png",
  						caption: "word.before"
  					},
  					{
  						type: "image",
  						src: "bridge_edge_loops_2_after.png",
  						caption: "word.after"
  					}
  				]
  			}
  		]
  	},
  	name: "Bridge Edge Loops",
  	icon: "hub",
  	description: "Connects multiple edge loops with faces.",
  	selection_mode: [
  		"edge",
  		"face"
  	]
  };
  var poke = {
  	docs: {
  		lines: [
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "poke_before.png",
  						caption: "word.before"
  					},
  					{
  						type: "image",
  						src: "poke_after.png",
  						caption: "word.after"
  					}
  				]
  			}
  		]
  	},
  	name: "Poke Faces",
  	icon: "control_camera",
  	description: "Generates a fan out of a face.",
  	selection_mode: "face"
  };
  var tris_to_quad = {
  	docs: {
  		lines: [
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "tris_to_quad_before.png",
  						caption: "word.before"
  					},
  					{
  						type: "image",
  						src: "tris_to_quad_after.png",
  						caption: "word.after"
  					}
  				]
  			}
  		]
  	},
  	name: "Triangles To Quadrilaterals",
  	icon: "fas.fa-external-link-square-alt",
  	description: "Attempts to merge adjacent triangles into quadrilaterals.",
  	selection_mode: "face"
  };
  var triangulate$1 = {
  	docs: {
  		lines: [
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "triangulate_before.png",
  						caption: "word.before"
  					},
  					{
  						type: "image",
  						src: "triangulate_after.png",
  						caption: "word.after"
  					}
  				]
  			}
  		]
  	},
  	name: "Triangulate Faces",
  	icon: "pie_chart_outline",
  	description: "Splits selected faces into triangles.",
  	selection_mode: "face"
  };
  var uv_project_view = {
  	docs: {
  		lines: [
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "uv_project_view_solid.png",
  						caption: "word.mesh"
  					},
  					{
  						type: "image",
  						src: "uv_project_view_uv.png",
  						caption: "word.uv"
  					}
  				]
  			}
  		]
  	},
  	name: "Project From View",
  	icon: "view_in_ar",
  	description: "Projects the selected faces to the UV map from the camera."
  };
  var uv_turnaround_projection = {
  	docs: {
  		lines: [
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "uv_turnaround_projection_solid.png",
  						caption: "word.mesh"
  					},
  					{
  						type: "image",
  						src: "uv_turnaround_projection_uv.png",
  						caption: "word.uv"
  					}
  				]
  			}
  		]
  	},
  	name: "Cubic Projection",
  	icon: "open_with",
  	description: "Unwraps the UV map from the 6 sides of a cube."
  };
  var uv_mapping = {
  	name: "UV Mapping",
  	icon: "map",
  	children: [
  		"uv_project_view",
  		"uv_turnaround_projection"
  	]
  };
  var expand_selection = {
  	name: "Expand Selection",
  	icon: "unfold_more_double",
  	description: "Expands the selection with neighboring vertices.",
  	keybind: {
  		key: "l",
  		ctrl: true
  	}
  };
  var shrink_selection = {
  	name: "Shrink Selection",
  	icon: "unfold_less_double",
  	description: "Shrinks the selection with neighboring vertices.",
  	keybind: {
  		key: "k",
  		ctrl: true
  	}
  };
  var tools = {
  	name: "MTools",
  	icon: "fas.fa-vector-square",
  	condition: "NON_OBJECT_MODE",
  	children: [
  		"bridge_edge_loops",
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
  		"shrink_selection"
  	]
  };
  var operators = {
  	name: "MTools Operators",
  	icon: "fas.fa-vector-square",
  	condition: "OBJECT_MODE",
  	children: [
  		"subdivide",
  		"split_edges",
  		"_",
  		"scatter",
  		"array_elements"
  	]
  };
  var subdivide = {
  	docs: {
  		lines: [
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "subdivide_before.png",
  						caption: "word.before"
  					},
  					{
  						type: "image",
  						src: "subdivide_after.png",
  						caption: "word.after"
  					}
  				]
  			}
  		]
  	},
  	name: "Subdivide",
  	icon: "content_cut",
  	description: "Splits the faces of a mesh into smaller faces, giving it a smooth appearance."
  };
  var split_edges = {
  	docs: {
  		lines: [
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "split_edges.png"
  					}
  				]
  			}
  		]
  	},
  	name: "Split Edges",
  	icon: "vertical_split",
  	description: "Splits and duplicates edges within a mesh, breaking 'links' between faces around those split edges."
  };
  var scatter = {
  	docs: {
  		lines: [
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "scatter.png"
  					}
  				]
  			}
  		]
  	},
  	name: "Scatter",
  	description: "Scatters selected meshes on the active mesh.",
  	icon: "scatter_plot"
  };
  var array_elements = {
  	docs: {
  		lines: [
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "array.png"
  					}
  				]
  			}
  		]
  	},
  	name: "Array",
  	icon: "fas.fa-layer-group",
  	description: "Generates an array of copies of the base object, with each copy being offset from the previous one."
  };
  var generators = {
  	name: "MTools Generate",
  	icon: "fas.fa-vector-square",
  	condition: "MESH",
  	children: [
  		"terrain_action",
  		"terrainse",
  		"_",
  		"textmesh",
  		"xyzmathsurfacefunction",
  		"quickprimitives"
  	]
  };
  var terrain_action = {
  	docs: {
  		lines: [
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "terrain_solid.png"
  					},
  					{
  						type: "image",
  						src: "terrain_wire.png"
  					}
  				]
  			}
  		]
  	},
  	name: "Terrain",
  	icon: "terrain",
  	description: "Generates terrains procedurally with fully customized settings."
  };
  var terrainse = {
  	name: "Terrain Style Editor",
  	icon: "draw",
  	description: "Configure the Custom color gradient style of the terrain generator."
  };
  var textmesh = {
  	docs: {
  		lines: [
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "text.png",
  						caption: "\"Butcher\" expressed in Chinese"
  					}
  				]
  			}
  		]
  	},
  	name: "Text Mesh",
  	icon: "format_size",
  	description: "Converts text into a 3D object, ideal for creating signs or logos."
  };
  var xyzmathsurfacefunction = {
  	docs: {
  		lines: [
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "xyz.png",
  						caption: "Twisted Torus Preset"
  					}
  				]
  			}
  		]
  	},
  	name: "XYZ Math Surface",
  	icon: "fas.fa-brain",
  	description: "Generates an xyz surface based on mathematical equations containing 23 pre-built presets!"
  };
  var quickprimitives = {
  	name: "Quick Primitives",
  	icon: "fas.fa-shapes",
  	children: [
  		"polyhedron",
  		"torusknot"
  	]
  };
  var polyhedron = {
  	docs: {
  		lines: [
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "polyhedron.png",
  						caption: "Icosahedron"
  					}
  				]
  			}
  		]
  	},
  	name: "Polyhedron",
  	icon: "offline_bolt",
  	description: "Generate a polyhedron such as an Icosahedron, a Dodecahedron, an Octahedron or a Tetrahedron."
  };
  var torusknot = {
  	docs: {
  		lines: [
  			{
  				type: "inset_row",
  				items: [
  					{
  						type: "image",
  						src: "torus_knot.png"
  					}
  				]
  			}
  		]
  	},
  	name: "Torus Knot",
  	icon: "offline_bolt",
  	description: "Generate a Torus Knot with fully customized settings."
  };
  var _ACTIONS = {
  	bevel: bevel,
  	laplacian_smooth: laplacian_smooth,
  	to_sphere: to_sphere,
  	bridge_edge_loops: bridge_edge_loops,
  	poke: poke,
  	tris_to_quad: tris_to_quad,
  	triangulate: triangulate$1,
  	uv_project_view: uv_project_view,
  	uv_turnaround_projection: uv_turnaround_projection,
  	uv_mapping: uv_mapping,
  	expand_selection: expand_selection,
  	shrink_selection: shrink_selection,
  	tools: tools,
  	operators: operators,
  	subdivide: subdivide,
  	split_edges: split_edges,
  	scatter: scatter,
  	array_elements: array_elements,
  	generators: generators,
  	terrain_action: terrain_action,
  	terrainse: terrainse,
  	textmesh: textmesh,
  	xyzmathsurfacefunction: xyzmathsurfacefunction,
  	quickprimitives: quickprimitives,
  	polyhedron: polyhedron,
  	torusknot: torusknot
  };

  const KEYS_KEY = "<keys>";
  const SUBS_KEY = "<subs>";
  class BasicQualifiedStorage {
    constructor(id) {
      this.id = id;
    }
    #isQualified() {
      return this.id.startsWith("@");
    }
    qualifyKey(key) {
      if (this.#isQualified()) {
        return `${this.id}/${key}`;
      }
      return `@${this.id}/${key}`;
    }
    set(key, value) {
      key = this.qualifyKey(key);

      localStorage.setItem(key, JSON.stringify(value));
    }
    delete(key) {
      key = this.qualifyKey(key);

      localStorage.removeItem(key);
    }
    has(key) {
      key = this.qualifyKey(key);

      return localStorage.hasOwnProperty(key);
    }
    get(key) {
      key = this.qualifyKey(key);

      const rawValue = localStorage.getItem(key);
      if (rawValue != null) {
        return JSON.parse(rawValue);
      }
      return null;
    }
    update(key, callback, defaultValue) {
      const value = this.get(key) ?? defaultValue;
      const newValue = callback(value);
      return this.set(key, newValue);
    }
  }

  const keysStorage = new BasicQualifiedStorage(KEYS_KEY);
  const subStoragesStorage = new BasicQualifiedStorage(SUBS_KEY);
  class QualifiedStorage extends BasicQualifiedStorage {
    
    in(key) {
      subStoragesStorage.update(this.id, (keys) => {
        keys.safePush(key);
        return keys;
      }, []);
      return new QualifiedStorage(this.qualifyKey(key));
    }

    constructor(id) {
      console.assert(
        id != KEYS_KEY,
        `QualifiedStorage: id cannot be equal to ${JSON.stringify(KEYS_KEY)}`
      );

      super(id);
    }
    set(key, value) {
      keysStorage.update(
        this.id,
        (keys) => {
          keys.safePush(key);
          return keys;
        },
        []
      );

      super.set(key, value);
    }
    delete(key) {
      keysStorage.update(
        this.id,
        (keys) => {
          const index = keys.indexOf(key);
          if (index != -1) {
            keys.splice(index, 1);
          }

          return keys;
        },
        []
      );

      super.delete(key);
    }
    getAllKeys() {
      return keysStorage.get(this.id) ?? [];
    }
    clear() {
      for (const key of this.getAllKeys()) {
        super.delete(key);
      }
      const subKeys = subStoragesStorage.get(this.id) ?? [];
      for (const subKey of subKeys) {
        new QualifiedStorage(this.qualifyKey(subKey)).clear();
      }
      keysStorage.delete(this.id);
      subStoragesStorage.delete(this.id);
    }
  }

  const PLUGIN_ID = "mesh_tools";
  const storage = new QualifiedStorage(PLUGIN_ID);

  const ACTIONS = _ACTIONS;

  const CONDITIONS = {
    MESH: {
      modes: ["edit"],
      features: ["meshes"],
    },
    OBJECT_MODE: {
      modes: ["edit"],
      features: ["meshes"],
      method: () =>
        Mesh.selected.length && BarItems["selection_mode"].value == "object",
    },
    NON_OBJECT_MODE: {
      modes: ["edit"],
      features: ["meshes"],
      method: () =>
        Mesh.selected.length && BarItems["selection_mode"].value != "object",
    },
  };


  const qualifyName = (id) => (id == "_" ? id : `@${PLUGIN_ID}/${id}`);

  /**
   *
   * @param {keyof ACTIONS} id
   * @param {?Function} click
   * @returns {Action}
   */
  function action(id, click) {
    console.assert(id in ACTIONS, id);

    const options = Object.assign({ click }, ACTIONS[id]);
    if (options.children) {
      // TODO qualify with parents
      options.children = options.children.map(qualifyName);
    }
    if (typeof options.condition == 'string') {
      options.condition = CONDITIONS[options.condition];
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

  /**
   * @template {V}
   * @template {K}
   * @param {V[]} arr
   * @param {(value: V, currentIndex: number, array: V[]) => K[]} callback
   * @returns {{[k: K]: V[]}}
   */

  function minIndex(array) {
    let minI = -1;
    let minValue = Infinity;
    for (let i = 0; i < array.length; i++) {
      const value = array[i];

      if (value <= minValue) {
        minValue = value;
        minI = i;
      }
    }
    return minI;
  }
  function findMin(array, map = (x) => x) {
    if (array.length == 1) return array[0];
    if (array.length == 0) return null;

    let minElement = null;
    let minValue = Infinity;

    for (const element of array) {
      const value = map(element);

      if (value <= minValue) {
        minElement = element;
        minValue = value;
      }
    }

    return minElement;
  }

  /**
   *
   * @param {ArrayVector3} a
   * @param {ArrayVector3} b
   * @param {number} t
   * @returns {ArrayVector3}
   */
  function lerp3(a, b, t) {
    return a.map((e, i) => Math.lerp(e, b[i], t));
  }
  function groupElementsCollided(array, every = 2) {
    const newArray = [];
    for (let i = 0; i < array.length; i++) {
      const sub = [];
      for (let j = 0; j < every; j++) {
        const element = array[(i + j) % array.length];
        sub.push(element);
      }
      newArray.push(sub);
    }
    return newArray;
  }

  function offsetArray(array, offset) {
    while (offset < 0) offset += array.length;
    while (offset >= array.length) offset -= array.length;

    const newArr = [];
    for (let i = 0; i < array.length; i++) {
      newArr[(i + offset) % array.length] = array[i];
    }

    array.splice(0, Infinity, ...newArr);
  }

  class Neighborhood {
    /**
     *
     * @param {Mesh} mesh
     * @returns {{[vertexKey: string]: string[]}}
     */
    static VertexVertices(mesh) {
      const map = {};

      for (const key in mesh.faces) {
        const face = mesh.faces[key];

        face.vertices.forEach((vkey) => {
          if (!(vkey in map)) {
            map[vkey] = [];
          }

          face.vertices.forEach((neighborkey) => {
            if (neighborkey == vkey) return;

            map[vkey].safePush(neighborkey);
          });
        });
      }

      return map;
    }

    /**
     *
     * @param {Mesh} mesh
     * @returns {{[vertexKey: string]: MeshFace[]}}
     */
    static VertexFaces(mesh) {
      const neighborhood = {};

      for (const key in mesh.faces) {
        const face = mesh.faces[key];

        for (const vertexKey of face.vertices) {
          neighborhood[vertexKey] ??= [];
          neighborhood[vertexKey].safePush(face);
        }
      }

      return neighborhood;
    }

    /**
     *
     * @param {Mesh} mesh
     * @returns {{[edgeKey: string]: MeshFace[]}}
     */
    static EdgeFaces(mesh) {
      const neighborhood = {};
      for (const key in mesh.faces) {
        const face = mesh.faces[key];
        const vertices = face.getSortedVertices();

        for (let i = 0; i < vertices.length; i++) {
          const vertexCurr = vertices[i];
          const vertexNext = vertices[(i + 1) % vertices.length];
          const edgeKey = getEdgeKey(vertexCurr, vertexNext);
          neighborhood[edgeKey] ??= [];
          neighborhood[edgeKey].safePush(face);
        }
      }
      return neighborhood;
    }

    /**
     *
     * @param {Mesh} mesh
     * @returns {{[vertexKey: string]: string[]}}
     */
    static VertexEdges(mesh) {
      const neighborhood = {};
      for (const key in mesh.faces) {
        const face = mesh.faces[key];
        const vertices = face.getSortedVertices();

        for (let i = 0; i < vertices.length; i++) {
          const vertexCurr = vertices[i];
          const vertexNext = vertices[(i + 1) % vertices.length];
          const edgeKey = getEdgeKey(vertexCurr, vertexNext);
          neighborhood[vertexCurr] ??= [];
          neighborhood[vertexNext] ??= [];
          neighborhood[vertexCurr].safePush(edgeKey);
          neighborhood[vertexNext].safePush(edgeKey);
        }
      }
      return neighborhood;
    }
  }

  function xKey(obj) {
    if (obj instanceof THREE.Vector3 || obj instanceof THREE.Vector2) {
      return "x";
    }
    if (obj instanceof Array) {
      return 0;
    }
    return null;
  }
  function yKey(obj) {
    if (obj instanceof THREE.Vector3 || obj instanceof THREE.Vector2) {
      return "y";
    }
    if (obj instanceof Array) {
      return 1;
    }
    return null;
  }
  function zKey(obj) {
    if (obj instanceof THREE.Vector3) {
      return "z";
    }
    if (obj instanceof Array) {
      return 2;
    }
    return null;
  }

  function getX(obj) {
    return obj[xKey(obj)];
  }
  function getY(obj) {
    return obj[yKey(obj)];
  }
  function getZ(obj) {
    return obj[zKey(obj)] ?? 0;
  }
  /**
   * @typedef {THREE.Vector3 | ArrayVector3} Vector3
   *
   * @template T
   * @param {T} a
   * @param {Vector3} b
   * @returns {T}
   */
  function addVectors(target, source) {
    target[xKey(target)] += source[xKey(source)];
    target[yKey(target)] += source[yKey(source)];
    target[zKey(target)] += source[zKey(source)];
    return target;
  }
  /**
   * @template T
   * @param {T} a
   * @param {Vector3} b
   * @returns {T}
   */
  function subtractVectors(target, source) {
    target[xKey(target)] -= source[xKey(source)];
    target[yKey(target)] -= source[yKey(source)];
    target[zKey(target)] -= source[zKey(source)];
    return target;
  }
  /**
   * @param {Vector3} a
   * @param {Vector3} b
   */
  function distanceBetween(a, b) {
    return Math.hypot(getX(a) - getX(b), getY(a) - getY(b), getZ(a) - getZ(b));
  }
  /**
   * @param {Vector3} vector
   */
  function isZeroVector(vector) {
    return getX(vector) === 0 && getY(vector) === 0 && getZ(vector) === 0;
  }

  const reusableEuler1$1 = new THREE.Euler();
  const reusableQuat1 = new THREE.Quaternion();
  const reusableVec1$1 = new THREE.Vector3();
  const reusableVec2$1 = new THREE.Vector3();
  const reusableVec3$1 = new THREE.Vector3();
  const reusableVec4$1 = new THREE.Vector3();
  const reusableVec5$1 = new THREE.Vector3();
  new THREE.Vector2();
  new THREE.Vector2(1, 0);

  const gradient256 = {};
  for (let x = 0; x < 256; x++) gradient256[[x, 0]] = x / 255;

  /**
   *
   * @param {THREE.Vector3} vector
   * @param {THREE.Euler} targetEuler
   * @returns {THREE.Euler}
   */
  const reusableObject = new THREE.Object3D();
  reusableObject.rotation.order = "XYZ";
  function rotationFromDirection(
    target,
    targetEuler = new THREE.Euler(),
    { rotateX = 0, rotateY = 0, rotateZ = 0 } = {}
  ) {
    reusableObject.lookAt(target);
    reusableObject.rotateX(Math.degToRad(90));
    reusableObject.rotateX(rotateX);
    reusableObject.rotateY(rotateY);
    reusableObject.rotateZ(rotateZ);

    targetEuler.copy(reusableObject.rotation);
    return targetEuler;
  }
  /**
   *
   * @param {import("./vector.js").Vector3} A
   * @param {import("./vector.js").Vector3} B
   * @param {import("./vector.js").Vector3} C
   * @returns {THREE.Vector3}
   */
  function computeTriangleNormal(A, B, C) {
    reusableVec1$1.set(getX(A), getY(A), getZ(A));
    reusableVec2$1.set(getX(B), getY(B), getZ(B));
    reusableVec3$1.set(getX(C), getY(C), getZ(C));
    return reusableVec4$1
      .crossVectors(
        reusableVec2$1.sub(reusableVec1$1),
        reusableVec3$1.sub(reusableVec1$1)
      )
      .clone();
  }
  function parseRGB(s) {
    let string = "";
    for (let i = 4; i < s.length - 1; i++) {
      string += s[i];
    }
    string = string.split(",");
    return new THREE.Color(string[0] / 255, string[1] / 255, string[2] / 255);
  }

  function sm(v) {
    let a = 3;
    let b = 2.7;
    return Math.pow(v, a) / (Math.pow(v, a) + Math.pow(b - b * v, a));
  }
  function falloffMap(i, j, width, height, v) {
    let x = (i / width) * 2 - 1;
    let y = (j / height) * 2 - 1;
    return sm(Math.max(Math.abs(x), Math.abs(y)));
  }

  function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  }

  function getAdjacentElements(arr, index) {
    return [
      arr[(index + 1 + arr.length) % arr.length],
      arr[index],
      arr[(index - 1 + arr.length) % arr.length],
    ];
  }

  /**
   * Determines on which side of a line a point lies.
   *
   * @param {THREE.Vector2} p
   * @param {THREE.Vector2} p1
   * @param {THREE.Vector2} p2
   * @returns {-1 | 0 | 1} 1 if the point is on the left side, -1 if on the right side, and 0 if on the line.
   */
  function lineSide(p, p1, p2) {
    return Math.sign((p.x - p2.x) * (p1.y - p2.y) - (p1.x - p2.x) * (p.y - p2.y));
  }

  /**
   *
   * @param {THREE.Vector2} point
   * @param {THREE.Vector2} point1
   * @param {THREE.Vector2} point2
   * @param {THREE.Vector2} point3
   * @returns {boolean}
   */
  function isPointInTriangle(point, point1, point2, point3) {
    const d1 = lineSide(point, point1, point2);
    const d2 = lineSide(point, point2, point3);
    const d3 = lineSide(point, point3, point1);
    const hasNegative = d1 < 0 || d2 < 0 || d3 < 0;
    const hasPositive = d1 > 0 || d2 > 0 || d3 > 0;

    return !(hasNegative && hasPositive);
  }
  /**
   * Note: If the polygon length is less than 3, true is returned.
   * @param {ArrayVector2[]} polygon
   * @returns {boolean}
   */
  function isPolygonClockWise(polygon) {
    if (polygon.length <= 2) {
      return true;
    }
    let sum = 0;
    for (let i = 0; i < polygon.length; i++) {
      const vertexA = polygon[i];
      const vertexB = polygon[(i + 1) % polygon.length];
      sum += (getX(vertexB) - getX(vertexA)) * (getY(vertexB) - getY(vertexA));
    }
    return sum >= 0;
  }

  /**
   * @param {THREE.Vector3[]} polygon
   * @return {THREE.Vector2[]}
   * @throws When `polygon.length` is less than 3
   */
  function projectIntoOwnPlane(polygon) {
    if (polygon.length < 3) {
      throw new Error(
        "projectIntoOwnPlane(): Polygon should have 3 or more vertices!"
      );
    }
    const plane = new THREE.Plane();
    plane.setFromCoplanarPoints(polygon[0], polygon[1], polygon[2]);
    return projectOnPlane(polygon, plane);
  }
  /**
   * @overload
   * @param {THREE.Vector3} point
   * @return {THREE.Vector2}
   */
  /**
   * @overload
   * @param {THREE.Vector3[]} polygon
   * @return {THREE.Vector2[]}
   */
  /**
   * @param {THREE.Vector3 | THREE.Vector3[]} polygon
   * @return {THREE.Vector2 | THREE.Vector2[]}
   */
  function projectOnPlane(polygonOrPoint, plane) {
    const euler = rotationFromDirection(plane.normal, reusableEuler1$1);
    const quat = reusableQuat1.setFromEuler(euler);
    quat.invert();

    if (polygonOrPoint instanceof Array) {
      return polygonOrPoint.map((e) => {
        reusableVec5$1.copy(e);
        reusableVec5$1.applyQuaternion(quat);
        return new THREE.Vector2(reusableVec5$1.x, reusableVec5$1.z);
      });
    }
    reusableVec5$1.copy(polygonOrPoint);
    reusableVec5$1.applyQuaternion(quat);
    return new THREE.Vector2(reusableVec5$1.x, reusableVec5$1.z);
  }

  /**
   * Triangulates a polygon into a set of triangles.
   *
   * @param {ArrayVector3[]} polygon
   * @returns {Array<ArrayVector3>} An array of triangles.
   */
  function triangulate(polygon) {
    const vertices3d = polygon.map((v) => v.V3_toThree());
    const indices = Array.from(Array(vertices3d.length).keys());
    const triangles = [];

    const vertices = projectIntoOwnPlane(vertices3d);
    const isClockWise = isPolygonClockWise(vertices);

    const SAFETY_LIMIT = 100;
    let safetyIndex = 0;
    while (indices.length > 3 && safetyIndex <= SAFETY_LIMIT) {
      for (let i = 0; i < indices.length; i++) {
        const [a, b, c] = getAdjacentElements(indices, i);

        const vecAC = vertices[c].clone().sub(vertices[a]);
        const vecAB = vertices[b].clone().sub(vertices[a]);

        const cross = vecAC.x * vecAB.z - vecAC.z * vecAB.x;
        const isConcave = isClockWise ? cross <= 0 : cross >= 0;
        if (isConcave) continue;

        let someVertexLiesInsideEar = false;
        for (let j = 0; j < vertices.length; j++) {
          if (j === a || j === b || j === c) continue;

          someVertexLiesInsideEar = isPointInTriangle(
            vertices[j],
            vertices[a],
            vertices[b],
            vertices[c]
          );
          if (someVertexLiesInsideEar) break;
        }
        if (!someVertexLiesInsideEar) {
          triangles.push([a, b, c].sort((a, b) => b - a));
          indices.splice(i, 1);
          break;
        }
      }
      safetyIndex++;
    }
    // Add the remaining triangle
    triangles.push(indices.sort((a, b) => b - a));

    return triangles;
  }

  function worldToScreen(p, camera, width, height) {
    // https://stackoverflow.com/a/27448966/16079500
    const vector = p.project(camera);

    vector.x = ((vector.x + 1) / 2) * width;
    vector.y = (-(vector.y - 1) / 2) * height;

    return vector;
  }

  function getMinProjectTextureSize() {
    return Math.min(Project._texture_width, Project._texture_height);
  }

  function v3Tov2(v3) {
    return [v3[0], v3[1]];
  }
  function getFaceUVCenter(face) {
    let uv = face.uv;
    let center = [0, 0, 0];
    let i = 0;
    for (const key in uv) {
      const currentPT = uv[key];
      center.V3_add(currentPT);
      i++;
    }
    center.V3_divide(i + 1e-5);
    return v3Tov2(center);
  }

  function freezeProperty(object, key) {
    Object.defineProperty(object, key, { configurable: false, writable: false });
    return object;
  }
  function snakeToPascal(subject) {
    return subject
      .split(/[_\s]+/g)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  }
  /**
   *
   * @param {ArrayVector3[]} points
   * @returns {boolean}
   */
  function isValidQuad(points) {
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (
          points[i][0] === points[j][0] &&
          points[i][1] === points[j][1] &&
          points[i][2] === points[j][2]
        ) {
          return false;
        }
      }
    }

    let prevCurvature = undefined;
    for (let i = 0; i < points.length; i++) {
      const prev = points[(i - 1 + points.length) % points.length];
      const current = points[i];
      const next = points[(i + 1) % points.length];

      const edge1 = prev.V3_toThree().sub(current.V3_toThree());
      const edge2 = next.V3_toThree().sub(current.V3_toThree());

      const cross = edge1.cross(edge2);
      const curvature = cross.x - cross.y - cross.z > 0;
      if (prevCurvature !== undefined && curvature !== prevCurvature) {
        return false;
      }
      prevCurvature = curvature;
    }
    return true;
  }

  /**
   * @param {Mesh} mesh
   * @param {Set<string>} vertexSet
   */
  function getSelectedFacesAndEdgesByVertices(mesh, vertexSet) {
    const selectedFaces = [];
    const selectedEdges = [];
    const foundEdges = new Set();

    for (const faceKey in mesh.faces) {
      const face = mesh.faces[faceKey];
      if (face.vertices.length < 2) continue;

      const areAllVerticesSelected = !face.vertices.some(
        (e) => !vertexSet.has(e)
      );
      if (areAllVerticesSelected) {
        selectedFaces.push(faceKey);
      }

      const sortedVertices = face.getSortedVertices();
      for (let i = 0; i < sortedVertices.length; i++) {
        const vertexA = sortedVertices[i];
        const vertexB = sortedVertices[(i + 1) % sortedVertices.length];
        if (vertexA == vertexB) continue;
        const edgeKey = getEdgeKey(vertexA, vertexB);
        if (foundEdges.has(edgeKey)) {
          continue;
        }
        foundEdges.add(edgeKey);

        if (vertexSet.has(vertexA) && vertexSet.has(vertexB)) {
          selectedEdges.push([vertexA, vertexB]);
        }
      }
    }
    return { edges: selectedEdges, faces: selectedFaces };
  }

  /**
   * Note: The caller is responsible for calling `Canvas.updateView()`
   * @param {Mesh} mesh
   * @param {Set<string>} vertexSet
   */
  function selectFacesAndEdgesByVertices(mesh, vertexSet) {
    if (!Project) {
      throw new Error(
        "selectFacesAndEdgesByVertices(): An open project is required before calling!"
      );
    }
    const { edges, faces } = getSelectedFacesAndEdgesByVertices(mesh, vertexSet);
    const vertices = Array.from(vertexSet);

    mesh.getSelectedVertices().splice(0, Infinity, ...vertices);
    switch (BarItems["selection_mode"].value) {
      case "vertex":
        break;
      case "edge":
        mesh.getSelectedEdges().splice(0, Infinity, ...edges);
        mesh.getSelectedFaces().splice(0, Infinity);
        break;
      case "cluster":
      case "face":
        mesh.getSelectedFaces().splice(0, Infinity, ...faces);
        mesh.getSelectedEdges().splice(0, Infinity);
        break;
    }
  }
  function getEdgeKey(a, b) {
    if (b < a) {
      const tmp = a;
      a = b;
      b = tmp;
    }
    return `${a}_${b}`;
  }
  /**
   *
   * @param {string} edgeKey
   * @returns {[string, string]}
   */
  function extractEdgeKey(edgeKey) {
    return edgeKey.split("_");
  }
  function getSelectedEdgesConnectedCountMap(mesh) {
    const { edges } = getSelectedFacesAndEdgesByVertices(
      mesh,
      new Set(mesh.getSelectedVertices())
    );
    const selectedConnectedCount = {};
    const connectedCount = {};

    const neighborhood = Neighborhood.EdgeFaces(mesh);

    for (const [a, b] of edges) {
      const edgeKey = getEdgeKey(a, b);
      selectedConnectedCount[edgeKey] ??= 0;
      connectedCount[edgeKey] ??= 0;
      if (!(edgeKey in neighborhood)) {
        continue;
      }
      connectedCount[edgeKey] = neighborhood[edgeKey].length;
      for (const connectedFace of neighborhood[edgeKey]) {
        if (connectedFace.isSelected()) {
          selectedConnectedCount[edgeKey] += 1;
        }
      }
    }
    return { connectedCount, selectedConnectedCount };
  }

  function computeCentroid(polygon) {
    const centroid = new THREE.Vector3();
    for (const vertex of polygon) {
      addVectors(centroid, vertex);
    }
    centroid.divideScalar(polygon.length);
    return centroid;
  }


  /**
   *
   * @param {THREE.Vector3} rClose
   * @param {THREE.Vector3} p
   * @param {THREE.Vector3} rayOrigin
   * @param {THREE.Vector3} rayDir
   * @returns
   */
  function closestToRay(rClose, p, rayOrigin, rayDir) {
    if (isZeroVector(rayDir)) {
      rClose.copy(rayOrigin);
      return 0.0;
    }

    const h = new THREE.Vector3();
    h.subVectors(p, rayOrigin);

    const lambda = h.dot(rayDir) / rayDir.dot(rayDir);

    rClose.copy(rayOrigin).addScaledVector(rayDir, lambda);

    return lambda;
  }
  /**
   * Returns a point on ({@linkcode l1}{@linkcode l2}) closest point to {@linkcode p}.
   * @param {*} rClose
   * @param {*} p
   * @param {*} l1
   * @param {*} l2
   * @returns
   */
  function closestToLine(rClose, p, l1, l2) {
    const ray = new THREE.Vector3();
    ray.subVectors(l2, l1);

    return closestToRay(rClose, p, l1, ray);
  }

  function CubicBezier(t, p0, p1, p2, p3) {
    t = Math.clamp(t, 0, 1);

    return (
      (1 - t) ** 3 * p0 +
      3 * (1 - t) ** 2 * t * p1 +
      3 * (1 - t) * t ** 2 * p2 +
      t ** 3 * p3
    );
  }

  /**
   * !
   * ! Big thanks to Blender for inspiration.
   * ! Special thanks to this code that came in clutch when i was about to give up on path interpolation option.
   * ! https://github.com/blender/blender/blob/703353b5dafc344ac4080d280312ef3aa496b6de/source/blender/bmesh/operators/bmo_subdivide_edgering.cc#L67
   * !
   */

  // +
  /**
   *
   * @param {THREE.Vector3} coordinateA
   * @param {THREE.Vector3} normalA
   * @param {THREE.Vector3} coordinateB
   * @param {THREE.Vector3} normalB
   * @returns {number}
   */
  function bezierHandleCalcLength(coordinateA, normalA, coordinateB, normalB) {
    const dot = normalA.dot(normalB);
    /* gives closest approx at a circle with 2 parallel handles */
    let fac = 1.333333;
    let len;
    if (dot < 0.0) {
      /* Scale down to 0.666 if we point directly at each other rough but ok. */
      /* TODO: current blend from dot may not be optimal but its also a detail. */
      const t = 1.0 + dot;
      fac = fac * t + 0.75 * (1.0 - t);
    }

    /* 2d length projected on plane of normals */
    {
      let co_a_ofs = new THREE.Vector3().crossVectors(normalA, normalB);

      if (co_a_ofs.lengthSq() > Number.MIN_VALUE) {
        co_a_ofs.add(coordinateA);
        closestToLine(co_a_ofs, coordinateB, coordinateA, co_a_ofs);
      } else {
        co_a_ofs.copy(coordinateA);
      }
      len = co_a_ofs.distanceTo(coordinateB);
    }

    return len * 0.5 * fac;
  }
  // +

  /**
   *
   * @param {Mesh} mesh
   * @param {*} edgeLoopA
   * @param {*} edgeLoopB
   */
  function bridgeLoops(mesh, edgeLoopA, edgeLoopB) {
    for (let i = 0; i < edgeLoopA.length; i++) {
      const edgeA = edgeLoopA[i];
      const edgeB = edgeLoopB[Math.min(i, edgeLoopB.length - 1)];

      let vertexA = edgeA[0];
      let vertexB = edgeA[1];
      let vertexC = edgeB[1];
      let vertexD = edgeB[0];

      const width = distanceBetween(
        mesh.vertices[vertexB],
        mesh.vertices[vertexA]
      );
      const height = distanceBetween(
        mesh.vertices[vertexA],
        mesh.vertices[vertexD]
      );
      const face = new MeshFace(mesh, {
        vertices: [vertexB, vertexA, vertexD, vertexC],
        uv: {
          [vertexB]: [0, 0],
          [vertexA]: [width, 0],
          [vertexD]: [width, height],
          [vertexC]: [0, height],
        },
      });
      mesh.addFaces(face);
    }
  }

  /**
   *
   * @param {Mesh} mesh
   * @param {*} edgeLoopA
   * @param {*} edgeLoopB
   * @param {THREE.Vector3} centroidA
   * @param {THREE.Vector3} centroidB
   */
  function bridgeLoopsConfigured(
    mesh,
    edgeLoopA,
    edgeLoopB,
    centroidA,
    centroidB,
    { twist, numberOfCuts, blendPath, blendInfluence, reverse }
  ) {
    if (edgeLoopA.length < 3 || edgeLoopB.length < 3) {
      return;
    }
    edgeLoopA = edgeLoopA.map((e) => e.slice());
    edgeLoopB = edgeLoopB.map((e) => e.slice());

    const bestOffset = bestEdgeLoopsOffset(edgeLoopA, edgeLoopB, mesh);
    offsetArray(edgeLoopB, bestOffset);

    const reversedEdgeLoopB = edgeLoopB.map((e) => e.slice().reverse()).reverse();

    const bestOffsetReversed = bestEdgeLoopsOffset(
      edgeLoopA,
      reversedEdgeLoopB,
      mesh
    );
    offsetArray(reversedEdgeLoopB, bestOffsetReversed);
    if (
      edgeLoopsLength(mesh, edgeLoopA, reverse ? edgeLoopB : reversedEdgeLoopB) <
      edgeLoopsLength(mesh, edgeLoopA, reverse ? reversedEdgeLoopB : edgeLoopB)
    ) {
      edgeLoopB = reversedEdgeLoopB;
    }

    let handleA;
    let handleB;
    let direction;
    if (blendPath) {
      // +
      direction = new THREE.Vector3().subVectors(centroidB, centroidA);
      const edgeLoopANormal = computeTriangleNormal(
        mesh.vertices[edgeLoopA[0][0]],
        mesh.vertices[edgeLoopA[1][0]],
        mesh.vertices[edgeLoopA[2][0]]
      ).normalize();
      const edgeLoopBNormal = computeTriangleNormal(
        mesh.vertices[edgeLoopB[0][0]],
        mesh.vertices[edgeLoopB[1][0]],
        mesh.vertices[edgeLoopB[2][0]]
      ).normalize();

      // Normals should be facing each other
      if (direction.dot(edgeLoopANormal) < 0) {
        edgeLoopANormal.negate();
      }
      if (direction.dot(edgeLoopBNormal) > 0) {
        edgeLoopBNormal.negate();
      }
      // +

      const handleLength =
        bezierHandleCalcLength(
          centroidA,
          edgeLoopANormal,
          centroidB,
          edgeLoopBNormal
        ) * blendInfluence;
      handleA = edgeLoopANormal.clone();
      handleA.setLength(handleLength);
      handleA.add(centroidA);
      handleB = edgeLoopBNormal.clone();
      handleB.setLength(handleLength);
      handleB.add(centroidB);
    }

    const subEdgeLoops = [];
    offsetArray(edgeLoopB, twist);

    for (let i = 0; i < numberOfCuts; i++) {
      const t = i / (numberOfCuts - 1);

      const subEdgeLoop = [];
      // TODO ??
      const centroid = lerp3(centroidA.toArray(), centroidB.toArray(), t);
      lerp3(centroidA.toArray(), centroidB.toArray(), t);

      for (let j = 0; j < edgeLoopA.length; j++) {
        const edgeA = edgeLoopA[j];
        const edgeB = edgeLoopB[Math.min(j, edgeLoopB.length - 1)];

        if (i == 0) {
          subEdgeLoop.push(edgeA[0]);
        } else if (i == numberOfCuts - 1) {
          subEdgeLoop.push(edgeB[0]);
        } else {
          const vertex = lerp3(
            mesh.vertices[edgeA[0]],
            mesh.vertices[edgeB[0]],
            t
          );
          if (handleA && handleB) {
            const v3Vertex = vertex.V3_toThree();
            subtractVectors(v3Vertex, centroid);

            // const smoothenedTangent = [
            //   CBTangent(t, centroidA.x, handleA.x, handleB.x, centroidB.x),
            //   CBTangent(t, centroidA.y, handleA.y, handleB.y, centroidB.y),
            //   CBTangent(t, centroidA.z, handleA.z, handleB.z, centroidB.z),
            // ].V3_toThree();
            // const eulerInitial = rotationFromDirection(direction);
            // const eulerTarget = rotationFromDirection(smoothenedTangent);
            // const matrix4Initial = new THREE.Matrix4().makeRotationFromEuler(
            //   eulerInitial
            // );
            // const matrix4Target = new THREE.Matrix4().makeRotationFromEuler(
            //   eulerTarget
            // );
            // const matrix = matrix4Initial
            //   .clone()
            //   .transpose()
            //   .multiply(matrix4Target);
            // v3Vertex.applyMatrix4(matrix);

            const smoothenedCentroid = [
              CubicBezier(t, centroidA.x, handleA.x, handleB.x, centroidB.x),
              CubicBezier(t, centroidA.y, handleA.y, handleB.y, centroidB.y),
              CubicBezier(t, centroidA.z, handleA.z, handleB.z, centroidB.z),
            ];

            addVectors(v3Vertex, smoothenedCentroid);
            vertex[0] = v3Vertex.x;
            vertex[1] = v3Vertex.y;
            vertex[2] = v3Vertex.z;
          }

          subEdgeLoop.push(mesh.addVertices(vertex)[0]);
        }
      }

      subEdgeLoops.push(groupElementsCollided(subEdgeLoop, 2));
    }

    for (let i = 0; i < subEdgeLoops.length - 1; i++) {
      const fromEdgeLoop = subEdgeLoops[i];
      const intoEdgeLoop = subEdgeLoops[i + 1];
      bridgeLoops(mesh, fromEdgeLoop, intoEdgeLoop);
    }
  }

  function runEdit$c(
    amend,
    numberOfCuts,
    twist,
    cutHoles,
    blendPath,
    blendInfluence,
    reverse
  ) {
    Undo.initEdit({ elements: Mesh.selected, selection: true }, amend);

    for (const mesh of Mesh.selected) {
      // Delete selected faces and keep outer edges
      let keptVerticesSet;
      if (BarItems["selection_mode"].value == "face") {
        keptVerticesSet = new Set();
        const keptEdges = new Set();
        const {
          selectedConnectedCount: edgesConnectedCount,
          connectedCount: edgesAllConnectedCount,
        } = getSelectedEdgesConnectedCountMap(mesh);

        for (const edge in edgesConnectedCount) {
          const [a, b] = extractEdgeKey(edge);
          const count = edgesConnectedCount[edge];
          const allCount = edgesAllConnectedCount[edge];

          if (count == 1) {
            keptEdges.add(edge);
            keptVerticesSet.add(a);
            keptVerticesSet.add(b);

            if (allCount == 1 && cutHoles) {
              mesh.addFaces(
                new MeshFace(mesh, {
                  vertices: [a, b],
                })
              );
            }
          }
        }

        if (cutHoles) {
          const leftVerticesSet = new Set();
          for (const vertexKey of mesh.getSelectedVertices()) {
            if (!keptVerticesSet.has(vertexKey)) {
              leftVerticesSet.add(vertexKey);
            }
          }
          for (const vertexKey of leftVerticesSet) {
            delete mesh.vertices[vertexKey];
          }
          for (const faceKey of mesh.getSelectedFaces()) {
            delete mesh.faces[faceKey];
          }
        }
        selectFacesAndEdgesByVertices(mesh, keptVerticesSet);
      } else {
        keptVerticesSet = new Set(mesh.getSelectedVertices());
      }
      const loops = [];
      const { edges } = getSelectedFacesAndEdgesByVertices(mesh, keptVerticesSet);

      const visitedEdges = new Set();
      for (const edge of edges) {
        if (visitedEdges.has(edge)) continue;
        visitedEdges.add(edge);

        const currentLoop = [edge];
        while (true) {
          const targetEdge = currentLoop.last();
          let connectedEdge;
          for (const otherEdge of edges) {
            if (
              !currentLoop.includes(otherEdge) &&
              (otherEdge[0] == targetEdge[0] ||
                otherEdge[1] == targetEdge[0] ||
                otherEdge[1] == targetEdge[1] ||
                otherEdge[0] == targetEdge[1])
            ) {
              connectedEdge = otherEdge;
              break;
            }
          }
          if (!connectedEdge) break;
          if (visitedEdges.has(connectedEdge)) break;

          visitedEdges.add(connectedEdge);
          currentLoop.push(connectedEdge);
        }
        // Organize unorganized loops
        for (let i = 0; i < currentLoop.length; i++) {
          const currEdge = currentLoop[i];
          const nextEdge = currentLoop[(i + 1) % currentLoop.length];
          if (currEdge[1] != nextEdge[0]) {
            nextEdge.reverse();
          }
        }

        loops.push(currentLoop);
      }

      if (loops.length < 2) continue;
      for (let i = 0; i < loops.length; i++) {
        loops[i] = {
          loop: loops[i],
          centroid: computeCentroid(loops[i].map((e) => mesh.vertices[e[0]])),
        };
      }

      const furthestLoop = findMin(loops, e => e.centroid.length());
      loops.remove(furthestLoop);

      const sortedEdgeLoops = [furthestLoop];
      mesh.addVertices(sortedEdgeLoops[0].centroid.toArray());
      while (loops.length) {
        const currEdgeLoop = sortedEdgeLoops.last();
        const closestLoop = findMin(loops, (e) =>
          e.centroid.distanceToSquared(currEdgeLoop.centroid)
        );

        sortedEdgeLoops.push(closestLoop);
        loops.remove(closestLoop);
      }
      for (let i = 0; i < sortedEdgeLoops.length - 1; i++) {
        const { centroid: fromCentroid, loop: fromEdgeLoop } = sortedEdgeLoops[i];
        const { centroid: intoCentroid, loop: intoEdgeLoop } =
          sortedEdgeLoops[i + 1];

        bridgeLoopsConfigured(
          mesh,
          fromEdgeLoop,
          intoEdgeLoop,
          fromCentroid,
          intoCentroid,
          {
            twist,
            numberOfCuts,
            blendPath,
            blendInfluence,
            reverse
          }
        );
      }
    }
    Canvas.updateView({
      elements: Mesh.selected,
      element_aspects: { geometry: true, uv: true, faces: true },
    });
    Undo.finishEdit("MTools: Bridged Edge Loops.");
  }
  action("bridge_edge_loops", () => {
    runEdit$c(false, 2, 0, true, true, 1, false);

    Undo.amendEdit(
      {
        // reverse: {
        //   type: "checkbox",
        //   label: "Reverse Winding",
        //   value: false,
        // },
        blend_influence: {
          type: "number",
          label: "Smoothness",
          value: 100,
          min: -200,
          max: 200,
        },
        num_cuts: {
          type: "number",
          label: "Number Of Cuts",
          min: 1,
          value: 1,
        },
        twist: {
          type: "number",
          label: "Twist",
          value: 0,
        },
        blend_path: {
          type: "checkbox",
          label: "Blend Path",
          value: true,
        },
        cut_holes: {
          type: "checkbox",
          label: "Cut Holes",
          value: true,
          condition: () => BarItems["selection_mode"].value == "face",
        },
      },
      (form) => {
        runEdit$c(
          true,
          form.num_cuts + 1,
          form.twist,
          form.cut_holes,
          form.blend_path,
          form.blend_influence / 100,
          form.reverse
        );
      }
    );
  });
  function edgeLoopsLength(mesh, fromEdgeLoop, intoEdgeLoop) {
    let length = 0;
    for (let i = 0; i < fromEdgeLoop.length; i++) {
      const [vertexA0] = fromEdgeLoop[i];
      const [vertexB0] = intoEdgeLoop[Math.min(i, intoEdgeLoop.length - 1)];
      length += distanceBetween(mesh.vertices[vertexA0], mesh.vertices[vertexB0]);
    }
    return length;
  }
  /**
   * Returns the best offset applied on {@linkcode intoEdgeLoop} when connected with {@linkcode fromEdgeLoop}
   * @param {*} fromEdgeLoop
   * @param {*} intoEdgeLoop
   * @param {Mesh} mesh
   * @returns {number}
   */
  function bestEdgeLoopsOffset(fromEdgeLoop, intoEdgeLoop, mesh) {
    let bestOffset = 0;
    let minLength = Infinity;
    outer: for (let i = 0; i < intoEdgeLoop.length; i++) {
      let length = 0;
      for (let i = 0; i < fromEdgeLoop.length; i++) {
        const [vertexA0] = fromEdgeLoop[i];
        const [vertexB0] = intoEdgeLoop[Math.min(i, intoEdgeLoop.length - 1)];
        length += distanceBetween(
          mesh.vertices[vertexA0],
          mesh.vertices[vertexB0]
        );

        // Optimization
        if (length > minLength) {
          offsetArray(intoEdgeLoop, 1);
          continue outer;
        }
      }
      if (length <= minLength) {
        bestOffset = i;
        minLength = length;
      }
      offsetArray(intoEdgeLoop, 1);
    }
    return bestOffset;
  }

  action("expand_selection", () => {
    Mesh.selected.forEach((mesh) => {
      const neighborMap = Neighborhood.VertexVertices(mesh);

      const selectedVertices = mesh.getSelectedVertices();
      const selectedVertexSet = new Set(selectedVertices);
      for (const vertexKey of selectedVertices) {
        const neighbors = neighborMap[vertexKey];
        if (neighbors) {
          for (const neighbor of neighbors) {
            selectedVertexSet.add(neighbor);
          }
        }
      }
      selectFacesAndEdgesByVertices(mesh, selectedVertexSet);
    });
    Canvas.updateView({ elements: Mesh.selected, selection: true });
  });

  function runEdit$b(amend = false, influence = 1, iterations = 1) {
    Undo.initEdit({ elements: Mesh.selected, selection: true }, amend);

    Mesh.selected.forEach((mesh) => {
      if (!influence || !iterations) return; //

      const { vertices } = mesh;
      const neighborMap = Neighborhood.VertexVertices(mesh);

      const selectedVertices = mesh.getSelectedVertices();

      const originalVertexPositions = {};
      for (let i = 0; i < iterations; i++) {
        for (let vertexKey of selectedVertices) {
          originalVertexPositions[vertexKey] = mesh.vertices[vertexKey].slice();
        }

        for (let vertexKey of selectedVertices) {
          const neighbors = neighborMap[vertexKey];

          const vertexSmoothed = [0, 0, 0];
          for (const neigbor of neighbors) {
            const neigborPosition = originalVertexPositions[neigbor];
            vertexSmoothed.V3_add(neigborPosition);
          }
          vertexSmoothed.V3_divide(neighbors.length);

          vertices[vertexKey] = vertices[vertexKey].map((e, i) =>
            Math.lerp(e, vertexSmoothed[i], influence)
          );
        }
      }
    });
    Undo.finishEdit("MTools: Laplacian Smooth selected vertices");
    Canvas.updateView({
      elements: Mesh.selected,
      element_aspects: { geometry: true, uv: true, faces: true },
      selection: true,
    });
  }

  action("laplacian_smooth", () => {
    runEdit$b();
    Undo.amendEdit(
      {
        influence: {
          type: "number",
          value: 100,
          label: "Influence",
          min: 0,
          max: 100,
        },
        iterations: {
          type: "number",
          value: 1,
          label: "Iterations",
          min: 0,
          max: 10,
        },
      },
      (form) => runEdit$b(true, form.influence / 100, form.iterations)
    );
  });

  function runEdit$a(amended, depth = 0) {
    Undo.initEdit({ elements: Mesh.selected, selection: true }, amended);
    /* selected meshes */
    Mesh.selected.forEach((mesh) => {
      /* selected faces */

      mesh.getSelectedFaces().forEach((key) => {
        const face = mesh.faces[key];

        /* center vertex creation */
        const am = face.getNormal(true).V3_multiply(depth);
        const centerVertex = mesh.addVertices(face.getCenter().V3_add(am))[0];

        /* faces creation */
        const vertices = face.getSortedVertices();
        for (let i = 0; i < vertices.length; i++) {
          const vertexA = vertices[i];
          const vertexB = vertices[(i + 1) % vertices.length];
          const new_face = new MeshFace(mesh, face).extend({
            vertices: [vertexA, vertexB, centerVertex],
          });
          new_face.uv[centerVertex] = getFaceUVCenter(face);

          mesh.addFaces(new_face);
        }
        delete mesh.faces[key];
      });
    });
    Undo.finishEdit("MTools: Poke mesh face selection");
    Canvas.updateView({
      elements: Mesh.selected,
      element_aspects: { geometry: true, uv: true, faces: true },
      selection: true,
    });
  }

  action("poke", () => {
    runEdit$a(false);
    Undo.amendEdit(
      {
        depth: { type: "number", value: 0, label: "Depth" },
      },
      (form) => {
        runEdit$a(true, form.depth);
      }
    );
  });

  action("shrink_selection", () => {
    Mesh.selected.forEach((mesh) => {
      const neighborMap = Neighborhood.VertexVertices(mesh);

      const selectedVertices = mesh.getSelectedVertices();
      const selectedVertexSet = new Set(selectedVertices);
      for (const vertexKey of selectedVertices) {
        const neighbors = neighborMap[vertexKey];

        for (const neighbor of neighbors) {
          const isNotSelected = !selectedVertexSet.has(neighbor);

          if (isNotSelected) {
            selectedVertexSet.delete(vertexKey);
            break;
          }
        }
      }
      selectFacesAndEdgesByVertices(mesh, selectedVertexSet);
    });
    Canvas.updateView({ elements: Mesh.selected, selection: true });
  });

  function runEdit$9(amend, influence = 100) {
    influence /= 100;
    Undo.initEdit({ elements: Mesh.selected, selection: true }, amend);
    /* selected meshes */
    Mesh.selected.forEach((mesh) => {
      const center = [0, 0, 0];
      const selectedVertices = mesh.getSelectedVertices();
      const positions = [];
      const size = [0, 0, 0];
      selectedVertices.forEach((key) => {
        positions.push(mesh.vertices[key]);
        center.V3_add(mesh.vertices[key]);
      });
      center.V3_divide(selectedVertices.length);

      for (let i = 0; i < 3; i++) {
        positions.sort((a, b) => a[i] - b[i]);
        size[i] = positions.last()[i] - positions[0][i];
      }
      size.V3_divide(2);

      selectedVertices.forEach((key) => {
        const vertex = mesh.vertices[key];
        const spherePosition = vertex
          .V3_subtract(center)
          .V3_toThree()
          .normalize()
          .toArray()
          .V3_multiply(size)
          .V3_add(center)
          .V3_toThree();

        const finalPoint = vertex
          .V3_add(center)
          .V3_toThree()
          .lerp(spherePosition, influence)
          .toArray();
        mesh.vertices[key] = finalPoint;
      });
    });
    Undo.finishEdit("MTools: Spherize mesh selection");
    Canvas.updateView({
      elements: Mesh.selected,
      element_aspects: { geometry: true, uv: true, faces: true },
      selection: true,
    });
  }

  action("to_sphere", () => {
    runEdit$9(false, 100);
    Undo.amendEdit(
      {
        influence: {
          type: "number",
          value: 100,
          label: "Influence",
          min: 0,
          max: 100,
        },
      },
      (form) => {
        runEdit$9(true, form.influence);
      }
    );
  });

  /**
   * ! I'm very aware that BlockBench only supports quadrilaterals and triangles for faces.
   * ! However, this action is kept for the future if higher vertex polygons are implemented.
   * !
   */
  action("triangulate", () => {
    Undo.initEdit({ elements: Mesh.selected, selection: true });
    /* selected meshes */
    Mesh.selected.forEach((mesh) => {
      /* selected faces */
      mesh.getSelectedFaces().forEach((key) => {
        const face = mesh.faces[key];
        const vertices = face.getSortedVertices();
        if (!(vertices.length <= 3)) {
          const triangles = triangulate(
            vertices.map((key) => mesh.vertices[key]),
            face.getNormal(true)
          );
          // create faces
          for (let i = 0; i < triangles.length; i++) {
            const newTri = new MeshFace(mesh, face).extend({
              vertices: [
                vertices[triangles[i][0]],
                vertices[triangles[i][2]],
                vertices[triangles[i][1]],
              ],
            });
            mesh.addFaces(newTri);
          }
          delete mesh.faces[key];
        }
      });
    });
    Undo.finishEdit("MTools: Triangulate mesh face selection");
    Canvas.updateView({
      elements: Mesh.selected,
      element_aspects: { geometry: true, uv: true, faces: true },
      selection: true,
    });
  });

  function runEdit$8(maxAngle, ignoreDisjointUVs = true, amend = false) {
    Undo.initEdit({ elements: Mesh.selected, selection: true }, amend);
    /* selected meshes */
    Mesh.selected.forEach((mesh) =>
      /* selected faces */
      mesh.getSelectedFaces().forEach((faceKey) => {
        const face = mesh.faces[faceKey];

        if (!face || face.vertices.length != 3) return;

        const vertices = face.getSortedVertices().slice();
        const faceNormal = face.getNormal(true);

        const adjacentFacesEdges = [];
        const adjacentFaces = [];
        const adjacentFaceKeys = [];
        const adjacentFacesIndices = [];
        for (let i = 0; i < 3; i++) {
          const currentAdjacentFaceData = face.getAdjacentFace(i);

          if (!currentAdjacentFaceData) continue;

          const currentAdjacentFace = currentAdjacentFaceData.face;
          const currentAdjacentFaceKey = currentAdjacentFaceData.key;
          const currentAdjacentFaceEdge = currentAdjacentFaceData.edge;

          if (currentAdjacentFace.vertices.length != 3) continue;
          if (
            adjacentFaces.length > 1 &&
            adjacentFaces.last() == adjacentFaces[i]
          )
            break;
          if (!currentAdjacentFace.isSelected()) continue;

          adjacentFaces.push(currentAdjacentFace);
          adjacentFacesEdges.push(currentAdjacentFaceEdge);
          adjacentFaceKeys.push(currentAdjacentFaceKey);
          adjacentFacesIndices.push(i);
        }
        const angles = adjacentFaces.map((e) => face.getAngleTo(e));
        const minAngledFaceIndex = minIndex(angles);
        if (minAngledFaceIndex == -1) return;
        const minAngle = angles[minAngledFaceIndex];
        const adjacentFace = adjacentFaces[minAngledFaceIndex];
        const adjacentFaceKey = adjacentFaceKeys[minAngledFaceIndex];
        const adjacentEdge = adjacentFacesEdges[minAngledFaceIndex];
        if (minAngle > maxAngle) {
          return;
        }
        const adjacentVertices = adjacentFace.getSortedVertices().slice();
        const uniqueVertex = vertices.find(
          (key) => !adjacentVertices.includes(key)
        );
        if (!uniqueVertex) {
          return;
        }

        adjacentVertices.splice(
          adjacentFacesIndices[minAngledFaceIndex] + 1,
          0,
          uniqueVertex
        );

        const newQuad = new MeshFace(mesh, {
          vertices: adjacentVertices,
        });
        const newFaceNormal = newQuad.getNormal(true);
        if (
          !isValidQuad(newQuad.getSortedVertices().map((e) => mesh.vertices[e]))
        ) {
          return;
        }
        if (newFaceNormal.V3_toThree().dot(faceNormal.V3_toThree()) < 0) {
          newQuad.invert();
        }

        if (ignoreDisjointUVs) {
          for (const edgeVertex of adjacentEdge) {
            const areUVsJoint =
              Math.roundTo(face.uv[edgeVertex][0], 5) ==
                Math.roundTo(adjacentFace.uv[edgeVertex][0], 5) &&
              Math.roundTo(face.uv[edgeVertex][1], 5) ==
                Math.roundTo(adjacentFace.uv[edgeVertex][1], 5);

            if (!areUVsJoint) {
              return;
            }
          }
        }

        newQuad.uv = adjacentFace.uv;
        if (face.uv[uniqueVertex] instanceof Array) {
          newQuad.uv[uniqueVertex] = face.uv[uniqueVertex];
        }
        for (const key of newQuad.vertices) {
          newQuad.uv[key] ??= [0, 0];
        }

        newQuad.texture = face.texture;
        mesh.addFaces(newQuad);
        delete mesh.faces[adjacentFaceKey];
        delete mesh.faces[faceKey];
      })
    );
    Undo.finishEdit("MTools: Convert selected Triangles to Quads");
    Canvas.updateView({
      elements: Mesh.selected,
      element_aspects: { geometry: true, uv: true, faces: true },
      selection: true,
    });
  }
  action("tris_to_quad", () => {
    runEdit$8(45);
    Undo.amendEdit(
      {
        max_angle: {
          label: "Max Angle",
          value: 45,
          min: 0,
          max: 180,
          type: "number",
        },
        ignore_disjoint_uvs: {
          label: "Ignore Disjoint UVS",
          value: true,
          type: "checkbox",
        },
      },
      (out) => runEdit$8(out.max_angle, out.ignore_disjoint_uvs, true)
    );
  });

  action("uv_mapping");

  function runEdit$7(preview, preserveAspect, amend) {
    const { width, height, camera } = preview;

    Undo.initEdit(
      {
        elements: Mesh.selected,
        selection: true,
        uv_only: true,
        uv_mode: true,
      },
      amend
    );

    const aspect = preserveAspect
      ? height / width
      : Math.max(width, height) / Math.min(width, height);

    Mesh.selected.forEach((mesh) => {
      /* selected faces */
      mesh.getSelectedFaces().forEach((key) => {
        const face = mesh.faces[key];

        face.vertices.forEach((vkey) => {
          const vertex = mesh.mesh.localToWorld(mesh.vertices[vkey].V3_toThree());

          const screenCoordinate = worldToScreen(vertex, camera, width, height);
          face.uv[vkey] = [
            (screenCoordinate.x / width) * Project.texture_width,
            (screenCoordinate.y / height) * Project.texture_height * aspect,
          ];
        });
      });
    });
    Undo.finishEdit("MTools: Unwrap mesh face selection uv from view", {
      uv_only: true,
      uv_mode: true,
    });
    Canvas.updateView({
      elements: Mesh.selected,
      element_aspects: { geometry: true, uv: true, faces: true },
      selection: true,
    });
    updateSelection();
  }
  action("uv_project_view", () => {
    const preview = Canvas.getHoveredPreview();
    runEdit$7(preview, true, false);

    Undo.amendEdit(
      {
        preserve_aspect: {
          type: "checkbox",
          value: true,
          label: "Preserve Aspect",
        },
      },
      (form) => runEdit$7(preview, form.preserve_aspect, true)
    );
  });

  function runEdit$6(margin, split, amend) {
    /* selected meshes */
    Undo.initEdit(
      {
        elements: Mesh.selected,
        selection: true,
        uv_only: true,
        uv_mode: true,
      },
      amend
    );
    Mesh.selected.forEach((mesh) => {
      if (mesh.getSelectedFaces().length) {
        let positions = [];
        let selectionBound = { min: [0, 0, 0], max: [0, 0, 0] };
        let gatheredDirs = {
          "1,0,0": [],
          "-1,0,0": [],
          "0,1,0": [],
          "0,-1,0": [],
          "0,0,1": [],
          "0,0,-1": [],
        };
        /* selected faces */
        mesh.getSelectedFaces().forEach((key) => {
          let face = mesh.faces[key];
          let normal = face.getNormal(true);
          face.vertices.forEach((Vkey) => {
            positions.push(mesh.vertices[Vkey]);
          });
          // choose its direction
          let d0 = normal[0];
          let d1 = normal[1];
          let d2 = normal[2];
          let finalDir = [0, 0, 0];
          /* chooses the furthest from 0 ( there should be one )*/
          let furthest = Math.max(
            Math.abs(normal[0]),
            Math.abs(normal[1]),
            Math.abs(normal[2])
          );
          if (furthest == d0 * Math.sign(normal[0])) {
            finalDir = [Math.sign(d0), 0, 0];
          } else if (furthest == d1 * Math.sign(normal[1])) {
            finalDir = [0, Math.sign(d1), 0];
          } else if (furthest == d2 * Math.sign(normal[2])) {
            finalDir = [0, 0, Math.sign(d2)];
          }

          if (face.vertices.length >= 3) {
            gatheredDirs[finalDir.toString()].push(key);
          }
        });
        for (let i = 0; i < 3; i++) {
          positions.sort((a, b) => b[i] - a[i]);
          selectionBound.max[i] = positions[0][i] + 0.0001;
          selectionBound.min[i] = positions.last()[i] - positions[0][i] + 0.0001;
        }
        let x = 0;
        let S_res = getMinProjectTextureSize();
        let _margin = 1 - margin / 100;
        for (const key in gatheredDirs) {
          x++;
          gatheredDirs[key].forEach((Fkey) => {
            let face = mesh.faces[Fkey];
            let I = key.replace("-", "").replaceAll(",", "");
            I = I == "100" ? [2, 1] : I == "010" ? [0, 2] : [0, 1];
            face.vertices.forEach((Vkey) => {
              let uv = [
                ((selectionBound.max[I[0]] - mesh.vertices[Vkey][I[0]] + 0.0001) *
                  _margin) /
                  -selectionBound.min[I[0]],
                ((selectionBound.max[I[1]] - mesh.vertices[Vkey][I[1]] + 0.0001) *
                  _margin) /
                  -selectionBound.min[I[1]],
              ];
              if (split) {
                // work with normalised values
                uv[0] *= 0.33;
                uv[1] *= 0.33;
                // remove the safety number
                uv[0] -= 0.0001;
                uv[1] -= 0.0001;

                uv[0] += (x % 3) * 0.33;
                uv[1] += x > 3 ? 0.33 : 0;
              }

              // scale to project res
              uv[0] *= S_res;
              uv[1] *= S_res;

              mesh.faces[Fkey].uv[Vkey] = uv;
            });
          });
        }
      }
    });
    Undo.finishEdit("MTools: Unwrap mesh face selection (cubic projection)", {
      uv_only: true,
      uv_mode: true,
    });
    Canvas.updateView({
      elements: Mesh.selected,
      element_aspects: { geometry: true, uv: true, faces: true },
      selection: true,
    });
    updateSelection();
  }
  action("uv_turnaround_projection", () => {
    runEdit$6(0.1, true, false);
    Undo.amendEdit(
      {
        margin: {
          type: "number",
          value: 0,
          label: "Margin",
          min: 0,
          max: 100,
        },
        split: { type: "checkbox", label: "Split", value: true },
      },
      (form) => {
        runEdit$6(form.margin, form.split, true);
      }
    );
  });

  action("tools");

  /**
   *
   * @param {THREE.Vector3} offset _
   */
  function runEdit$5(selected, offset = [1, 0, 0], count = 1, amend = false) {
    offset = offset.V3_toThree();

    const elements = [];
    Undo.initEdit({ elements, selection: true }, amend);
    selected.forEach((mesh) => {
      const bounding = new THREE.Vector3();
      mesh.mesh.geometry.boundingBox.getSize(bounding);

      for (let i = 0; i < count; i++) {
        const newMesh = mesh.duplicate();
        newMesh.moveVector(
          offset
            .clone()
            .multiplyScalar(i + 1)
            .multiply(bounding)
        );
        elements.push(newMesh);
      }
    });
    Undo.finishEdit("MTools: Array selected meshes");
  }

  action("array_elements", () => {
    const selected = Mesh.selected;
    selected.forEach((mesh) => {
      mesh.mesh.geometry.computeBoundingBox();
    });
    runEdit$5(selected);
    Undo.amendEdit(
      {
        // shameful vector input
        x: { type: "number", value: 1, label: "OffsetX", step: 0.1 },
        y: { type: "number", value: 0, label: "OffsetY", step: 0.1 },
        z: { type: "number", value: 0, label: "OffsetZ", step: 0.1 },
        count: {
          type: "number",
          value: 1,
          label: "Count",
          min: 0,
          max: 50,
        },
      },
      (form) => {
        runEdit$5(selected, [form.x, form.y, form.z], form.count, true);
      }
    );
  });

  const LanguageDefinitions = {
    "word.before": "Input",
    "word.after": "Result",
    "word.mesh": "Mesh",
    "word.uv": "UV",
  };
  function getLanguage() {
    return LanguageDefinitions;
  }
  function translate(subject) {
    return subject.replace(/[a-zA-Z_][a-zA-Z0-9_\.]+/g, (key) => {
      return getLanguage()[key] ?? key;
    });
    
  }
  const getURL = (e) =>
      // `http://127.0.0.1:5500/${e}?t=${Math.random()}`;
    `https://github.com/Malik12tree/blockbench-plugins/blob/master/src/mesh_tools/${e}?raw=true`;
  function renderImage({ src, caption = "" }) {
    return `
  <figure>
  <img style="image-rendering: auto;object-fit:contain;width: 250px; height: 250px;min-width: 100px" src="${getURL(
    `assets/actions/${src}`
  )}" />
  <figcaption>${translate(caption)}</figcaption>
  </figure>
  `;
  }
  function renderOverflow(children) {
    return `<content>${children}</content>`;
  }
  function renderInsetRow({ items }) {
    return `<div style="display: flex;flex-wrap:wrap;">
		${items
      .map(
        (e) =>
          `<div style="border: 1px solid var(--color-dark);background: var(--color-back);">${renderLine(
            e
          )}</div>`
      )
      .join("\n")}
	</div>
	`;
  }
  function renderLine(options) {
    if (typeof options == "string") return options;

    switch (options.type) {
      case "image":
        return renderImage(options);
      case "overflow":
        return renderOverflow(options);
      case "inset_row":
        return renderInsetRow(options);
      default:
        throw new Error(`Unknown line type: ${options.type}`);
    }
  }

  const dontShowAgainInfoStorage = storage.in("dont_show_again_info_storage");
  function dontShowAgainInfo(id, title, message) {
    if (dontShowAgainInfoStorage.has(id)) {
      return;
    }

    const messageBox = Blockbench.showMessageBox(
      {
        title,
        message,
        icon: "info",
        checkboxes: {
          dont_show_again: { value: false, text: "dialog.dontshowagain" },
        },
        buttons: ["dialog.ok"],
      },
      (_, { dont_show_again: dontShowAgain }) => {
        if (dontShowAgain) {
          dontShowAgainInfoStorage.set(id, true);
        }
      }
    );
    messageBox.object.querySelector(".dialog_content").style.overflow = "auto";
  }

  /**
   *
   * @param {string} message
   * @param {?number} timeout
   * @returns {never}
   */
  function throwQuickMessage(message, timeout) {
    Blockbench.showQuickMessage(message, timeout);
    throw message;
  }

  const reusableEuler1 = new THREE.Euler();
  const reusableVec1 = new THREE.Vector3();
  const reusableVec2 = new THREE.Vector3();
  const reusableVec3 = new THREE.Vector3();
  const reusableVec4 = new THREE.Vector3();
  const reusableVec5 = new THREE.Vector3();
  // const reusableVec6 = new THREE.Vector3();
  function runEdit$4(
    mesh,
    selected,
    {
      density = 3,
      min_distance: minDistance = 0,
      scale = 100,
      min_scale: minScale = 100,
      scale_factor: scaleFactor = 50,
      rotation = 0,
      rotation_factor: rotationFactor = 0,
    },
    amend = false
  ) {
    const meshes = [];
    scale /= 100;
    minScale /= 100;
    scaleFactor /= 100;
    rotationFactor /= 100;
    const minDistanceSquared = minDistance ** 2;

    Undo.initEdit({ outliner: true, elements: [], selection: true }, amend);

    /**
     * @type {THREE.Mesh}
     */
    const tmesh = mesh.mesh; // threejs mesh

    const faces = tmesh.geometry.getIndex();
    const vertices = tmesh.geometry.getAttribute("position");
    const l = faces.count;

    const points = [];
    for (let d = 0; d < density; d++) {
      const i = Math.floor((Math.random() * l) / 3) * 3; // random face index
      const t0 = reusableVec1.set(
        vertices.getX(faces.getX(i)),
        vertices.getY(faces.getX(i)),
        vertices.getZ(faces.getX(i))
      );
      const t1 = reusableVec2.set(
        vertices.getX(faces.getY(i)),
        vertices.getY(faces.getY(i)),
        vertices.getZ(faces.getY(i))
      );
      const t2 = reusableVec3.set(
        vertices.getX(faces.getZ(i)),
        vertices.getY(faces.getZ(i)),
        vertices.getZ(faces.getZ(i))
      );

      tmesh.localToWorld(t0);
      tmesh.localToWorld(t1);
      tmesh.localToWorld(t2);

      // f*ed up midpoint theroem
      const pointA = reusableVec4.lerpVectors(t0, t1, Math.random());
      const pointB = reusableVec5.lerpVectors(t0, t2, Math.random());

      const point = new THREE.Vector3().lerpVectors(
        pointA,
        pointB,
        Math.random()
      );
      if (points.find((e) => e.distanceToSquared(point) < minDistanceSquared)) {
        continue;
      }
      points.push(point);
      // scatter on points
      /**
       * @type {Mesh}
       */
      const otherMesh =
        selected[Math.floor(selected.length * Math.random())].duplicate();

      otherMesh.removeFromParent();
      otherMesh.parent = "root";

      const currentScale = Math.lerp(
        scale,
        Math.lerp(minScale, 1, Math.random()) * scale,
        scaleFactor
      );

      const currentRotation = rotationFactor * (Math.random() * 2 - 1) * rotation;

      for (const key in otherMesh.vertices) {
        otherMesh.vertices[key].V3_multiply(currentScale);
      }

      const normal = computeTriangleNormal(t0, t1, t2);

      const euler = rotationFromDirection(normal, reusableEuler1, {
        rotateY: Math.degToRad(currentRotation),
      });
      otherMesh.rotation[0] = Math.radToDeg(euler.x);
      otherMesh.rotation[1] = Math.radToDeg(euler.y);
      otherMesh.rotation[2] = Math.radToDeg(euler.z);

      otherMesh.origin = point.toArray();

      meshes.push(otherMesh);
    }
    const group = new Group({ name: "instances_on_" + mesh.name });
    meshes.forEach((e) => {
      // Outliner.root.push(otherMesh);
      e.addTo(group);
    });
    group.init();

    Undo.finishEdit("MTools: Scatter meshes", {
      outliner: true,
      elements: meshes,
      selection: true,
    });
    Canvas.updateAll();
  }
  action("scatter", function () {
    if (Mesh.selected.length < 2) {
      Blockbench.showQuickMessage("At least two meshes must be selected");
      return;
    }
    dontShowAgainInfo(
      "scatter_pivot",
      "Good To Know",
      [
        "Scattered meshes are <b>relative</b> to their <u>pivot points</u> on the target surface.",

        renderLine({
          type: "inset_row",
          items: [
            {
              type: "image",
              src: "scatter_pivot_1.png",
              caption: "Pivot point located on the bottom",
            },
            {
              type: "image",
              src: "scatter_pivot_2.png",
              caption: "Pivot point located far down",
            },
          ],
        }),
      ].join("\n")
    );

    const mesh = Mesh.selected.last();
    mesh.unselect();

    const selected = Mesh.selected.slice();
    runEdit$4(mesh, selected, {});

    Undo.amendEdit(
      {
        density: {
          type: "number",
          value: 3,
          label: "Max Density",
          min: 0,
          max: 100,
        },
        min_distance: {
          type: "number",
          value: 0,
          label: "Min Distance",
          min: 0,
        },
        scale: {
          type: "number",
          value: 100,
          label: "Scale",
          min: 0,
          max: 100,
        },
        min_scale: {
          type: "number",
          value: 100,
          label: "Min Scale",
          min: 0,
          max: 100,
        },
        scale_factor: {
          type: "number",
          value: 50,
          label: "Scale Randomness",
          min: 0,
          max: 100,
        },

        rotation: {
          type: "number",
          value: 0,
          label: "Max Rotation",
          min: 0,
          max: 180,
        },
        rotation_factor: {
          type: "number",
          value: 0,
          label: "Rotation Randomness",
          min: 0,
          max: 100,
        },
      },
      (form) => {
        runEdit$4(mesh, selected, form, true);
      }
    );
  });

  // https://en.wikipedia.org/wiki/Catmull–Clark_subdivision_surface
  // custom data, just for manging other data easily
  class CMFace {
    /**
     * @type Array<CMFace>
     */
    static all = [];
    constructor(bbFace, key) {
      this.key = key;
      this.bbFace = bbFace;
      this.facePoint = bbFace.getCenter();
      this.uuid = guid();
      this.facePointKey = bbFace.mesh.addVertices(this.facePoint)[0];
      this.edgePoints = []; // should be called edges
      this.vertices = []; // store sorted vertices before editing vertices positions and causing BB sorting problems
      CMFace.all.push(this);
    }
    for(vertex) {
      return this.bbFace.vertices.includes(vertex);
    }
  }
  class CMEdge {
    /**
     * @type Array<CMEdge>
     */
    static all = [];
    constructor(a, b, edgePoint, center) {
      this.vertexA = a;
      this.vertexB = b;
      this.uuid = guid();
      this.center = center;
      this.edgePoint = edgePoint;
      CMEdge.all.push(this);
    }
    equals(other) {
      return (
        (other.vertexA == this.vertexA && other.vertexB == this.vertexB) ||
        (other.vertexA == this.vertexB && other.vertexB == this.vertexA)
      );
    }
    equalsV(a, b) {
      return (
        (a == this.vertexA && b == this.vertexB) ||
        (a == this.vertexB && b == this.vertexA)
      );
    }
    equalsU(other) {
      return this.uuid == other.uuid;
    }
    for(vertex) {
      return this.vertexA == vertex || this.vertexB == vertex;
    }
  }

  class MTEdge {
    /**
     * @type Array<MTEdge>
     */
    static all = [];
    static reset() {
      MTEdge.all = [];
    }
    constructor(a, b, data) {
      this.vertexA = a;
      this.vertexB = b;
      this.faces = [];
      this.indices = data.indices;
      this.center = data ? data.center : null;
      MTEdge.all.push(this);
    }
    equals(other) {
      return (
        (other.vertexA == this.vertexA && other.vertexB == this.vertexB) ||
        (other.vertexA == this.vertexB && other.vertexB == this.vertexA)
      );
    }
    equalsV(a, b) {
      return (
        (a == this.vertexA && b == this.vertexB) ||
        (a == this.vertexB && b == this.vertexA)
      );
    }
  }

  function runEdit$3(angle = 30, amend = false) {
    angle = Math.degToRad(angle);
    Undo.initEdit({ elements: Mesh.selected, selection: true }, amend);
    Mesh.selected.forEach((mesh) => {
      MTEdge.reset();

      const faces = mesh.faces;
      for (const key in faces) {
        const face = faces[key];

        const vertices = face.getSortedVertices();
        const len = vertices.length;
        if (len <= 2) continue;
        for (let i = 0; i < len; i++) {
          const a = vertices[i];
          const b = vertices[(i + 1) % len];
          const center = mesh.vertices[a]
            .slice()
            .V3_add(mesh.vertices[b])
            .V3_divide(2);

          const earlyEdge = MTEdge.all.find((e) => e.equalsV(a, b));
          if (earlyEdge) {
            if (earlyEdge.faces.length >= 2) {
              Blockbench.showQuickMessage(
                "Error: non-manifold meshes are not allowed",
                2000
              );
              throw new Error("non-manifold meshes are not allowed");
            }
            earlyEdge.faces.push(face);
            continue;
          }
          // indices in the non sorted order
          const indices = [];
          indices[0] = face.vertices.findIndex((vkey) => vkey == a);
          indices[1] = face.vertices.findIndex((vkey) => vkey == b);

          const e = new MTEdge(a, b, { center, indices });
          e.faces = [face];
        }
      }

      const edgesLength = MTEdge.all.length; // skip calculating length each iteration
      for (let i = 0; i < edgesLength; i++) {
        const edge = MTEdge.all[i];
        if (edge.faces.length < 2) continue;

        const [face1, face2] = edge.faces;

        // Duplicate code!!
        const disp1 = face2.getCenter().V3_subtract(edge.center).V3_toThree();
        const disp2 = face2.getCenter().V3_subtract(edge.center).V3_toThree();

        const theta = disp1.angleTo(disp2);

        // splitting process

        // saved indices since: faces update, edge vertices doesnt
        if (theta <= angle) {
          const newVertices = mesh.addVertices(
            mesh.vertices[edge.vertexA],
            mesh.vertices[edge.vertexB]
          );
          const indexA = edge.indices[0];
          const indexB = edge.indices[1];

          face1.uv[newVertices[0]] = face1.uv[edge.vertexA];
          face1.uv[newVertices[1]] = face1.uv[edge.vertexB];
          face1.vertices[indexA] = newVertices[0];
          face1.vertices[indexB] = newVertices[1];
        }
      }
    });
    Undo.finishEdit("MTools: Split edges");
    Canvas.updateView({
      elements: Mesh.selected,
      element_aspects: { geometry: true, uv: true, faces: true },
      selection: true,
    });
  }

  action("split_edges", () => {
    runEdit$3(180);
    Undo.amendEdit(
      {
        angle: { label: "Angle", value: 180, min: 0, max: 180 },
      },
      (form) => {
        runEdit$3(form.angle, true);
      }
    );
  });

  action("subdivide", () => {
    Undo.initEdit({ elements: Mesh.selected, selection: true });
    Mesh.selected.forEach((mesh) => {
      CMEdge.all = [];
      CMFace.all = [];
      const originalVertices = Object.keys(mesh.vertices);
      const { faces } = mesh;

      for (let key in faces) {
        const face = faces[key];

        const vertices = face.getSortedVertices();
        const len = vertices.length;
        if (len < 3) {
          continue;
        }
        const cmface = new CMFace(face, key);
        cmface.vertices = vertices;

        for (let i = 0; i < len; i++) {
          const a = vertices[i];
          const b = vertices[(i + 1) % len];
          const center = mesh.vertices[a]
            .slice()
            .V3_add(mesh.vertices[b])
            .V3_divide(2);

          const targetEdge =
            CMEdge.all.find((e) => e.equalsV(a, b)) ??
            new CMEdge(a, b, null, center);

          cmface.edgePoints.push(targetEdge);
        }
      }

      const cmedgeLength = CMEdge.all.length;
      for (let i = 0; i < cmedgeLength; i++) {
        const edge = CMEdge.all[i];
        const averagedPoint = [0, 0, 0];
        const cmfaceLength = CMFace.all.length;

        let k = 0;
        for (let j = 0; j < cmfaceLength; j++) {
          const face = CMFace.all[j];
          if (face.edgePoints.find((e) => edge.equalsU(e))) {
            averagedPoint.V3_add(face.facePoint);
            k++;
          }
        }
        if (k < 2) {
          edge.edgePoint = edge.center;
        } else {
          edge.edgePoint = averagedPoint.V3_divide(k);
          edge.edgePoint.V3_add(edge.center).V3_divide(2);
        }
        edge.edgePointKey = mesh.addVertices(edge.edgePoint)[0];
      }

      const originalVertexLength = originalVertices.length;
      for (let index = 0; index < originalVertexLength; index++) {
        const key = originalVertices[index];
        const P = mesh.vertices[key]; // originalPoint;

        const F = [0, 0, 0]; // The average of touching face points
        let l = CMFace.all.length;
        let tlength = 0;
        let atleastFace = false;

        for (let i = 0; i < l; i++) {
          const face = CMFace.all[i];
          if (!face.for(key)) continue;

          F.V3_add(face.facePoint);
          atleastFace = true;
          tlength++;
        }

        if (!atleastFace) continue;

        F.V3_divide(tlength);

        const R = [0, 0, 0]; // The average of touching edge points
        l = CMEdge.all.length;
        let elength = 0;
        for (let i = 0; i < l; i++) {
          const edge = CMEdge.all[i];
          if (!edge.for(key)) continue;

          R.V3_add(edge.center);
          elength++;
        }
        R.V3_divide(elength);

        if (elength != tlength) {
          P.V3_add(R).V3_divide(2);
        } else {
          for (let i = 0; i < 3; i++) {
            P[i] = (F[i] + 2 * R[i] + (tlength - 3) * P[i]) / tlength;
          }
        }
        mesh.vertices[key] = P;
      }

      let facesLength = CMFace.all.length;
      for (let i = 0; i < facesLength; i++) {
        const currentFace = CMFace.all[i];
        const bbFace = currentFace.bbFace;
        const vertices = currentFace.vertices;
        const verticesLen = vertices.length;

        for (let j = 0; j < verticesLen; j++) {
          const vertexA = vertices[j];
          const vertexB = vertices[(j + 1) % verticesLen];
          const vertexBeforeA = vertices[(j - 1 + verticesLen) % verticesLen];
          /*
  									-->
  								c -- b -- z
  								|	 |	  | |
  								d -- a -- y v
  								|	 |    |
  								x -- w -- u
  								*/

          const a = currentFace.facePointKey;
          const b = currentFace.edgePoints.find((e) =>
            e.equalsV(vertexA, vertexB)
          ).edgePointKey;
          const c = vertexA;
          const d = currentFace.edgePoints.find((e) =>
            e.equalsV(vertexA, vertexBeforeA)
          ).edgePointKey;

          const newFace = new MeshFace(mesh, bbFace).extend({
            vertices: [d, c, b, a],
          });

          // uv center point
          newFace.uv[currentFace.facePointKey] = getFaceUVCenter(bbFace);

          // uv edges
          const bPoint = [0, 0, 0]
            .V3_add(bbFace.uv[vertexA])
            .V3_add(bbFace.uv[vertexB]);
          bPoint.V3_divide(2);

          const dPoint = [0, 0, 0]
            .V3_add(bbFace.uv[vertexA])
            .V3_add(bbFace.uv[vertexBeforeA]);
          dPoint.V3_divide(2);

          newFace.uv[b] = v3Tov2(bPoint);
          newFace.uv[d] = v3Tov2(dPoint);
          //

          mesh.addFaces(newFace);
        }
        delete mesh.faces[currentFace.key];
      }
    });
    Undo.finishEdit("MTools: Subdivide selected meshes");
    Canvas.updateView({
      elements: Mesh.selected,
      element_aspects: { geometry: true, uv: true, faces: true },
      selection: true,
    });
  });

  action("operators");

  class TerrainGen {
    static styles = {
      Earth: [
        { blend: 0.5, height: 0.2, color: new THREE.Color(0.13, 0.36, 0.89) },
        {
          blend: 0.2,
          height: 0.375,
          color: new THREE.Color(0.9, 0.86, 0.36),
        },
        {
          blend: 0.3,
          height: 0.5,
          color: new THREE.Color(0.15, 0.87, 0.113),
        },
        { blend: 1, height: 1, color: new THREE.Color(0.113, 0.87, 0.137) },
      ],
      EarthMountains: [
        { blend: 0.5, height: 0.2, color: new THREE.Color(0.13, 0.36, 0.89) },
        {
          blend: 0.2,
          height: 0.375,
          color: new THREE.Color(0.9, 0.86, 0.36),
        },
        {
          blend: 0.3,
          height: 0.5,
          color: new THREE.Color(0.15, 0.87, 0.113),
        },
        { blend: 1, height: 0.6, color: new THREE.Color(0.113, 0.87, 0.137) },
        { blend: 0.1, height: 1, color: new THREE.Color(0.39, 0.28, 0.12) },
      ],
      Grass: [
        { blend: 1, height: 0.2, color: new THREE.Color(0.69, 1, 0.11) },
        { blend: 1, height: 0.375, color: new THREE.Color(0.51, 1, 0.14) },
        {
          blend: 1,
          height: 0.375,
          color: new THREE.Color(0.17, 0.63, 0.054),
        },
      ],
      Desert: [
        { blend: 0, height: 0, color: new THREE.Color(0.54, 0.42, 0.17) },
        { blend: 0.9, height: 1, color: new THREE.Color(0.79, 0.56, 0.25) },
      ],
      Ice: [
        { blend: 0, height: 0, color: new THREE.Color(0.45, 0.68, 0.86) },
        { blend: 1, height: 0.5, color: new THREE.Color(0.58, 0.77, 0.89) },
        { blend: 1, height: 0.75, color: new THREE.Color(0.83, 0.94, 0.97) },
        { blend: 1, height: 1, color: new THREE.Color(0.61, 0.84, 0.94) },
      ],
      Mask: [
        { blend: 0, height: 0, color: new THREE.Color(0, 0, 0) },
        { blend: 1, height: 1, color: new THREE.Color(1, 1, 1) },
      ],
    };
    /**
     * @type {Array<TerrainGen>}
     */
    static all = [];
    static timeWhenDialogWasOpened = 0;
    static genTexture(
      width,
      height,
      noise,
      style = this.styles.Earth,
      asTexture = true
    ) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      for (let y = height - 1; y >= 0; y--) {
        for (let x = width - 1; x >= 0; x--) {
          const currentHeight = Math.clamp(noise[[x, y]], 0, style.last().height);
          for (let i = 0; i < style.length; i++) {
            if (currentHeight <= style[i].height) {
              let s2 = style[Math.clamp(i - 1, 0, Infinity)];
              let percent =
                1 -
                THREE.Math.inverseLerp(s2.height, style[i].height, currentHeight);
              let color = style[i].color
                .clone()
                .lerp(s2.color, percent * style[i].blend);
              ctx.fillStyle = `rgb(${color.r * 255},${color.g * 255},${
              color.b * 255
            })`;
              ctx.fillRect(x, y, 1, 1);
              break;
            }
          }
        }
      }
      if (!asTexture) {
        return canvas.toDataURL();
      }
      const _texture = new Texture({ saved: false }).fromDataURL(
        canvas.toDataURL()
      );
      _texture.add();
      return _texture;
    }
    constructor(data) {
      this.name = data.name;
      this.codeName = data.name.toLowerCase().replaceAll(" ", "_");
      this.settings = data.settings;
      this.suggested = data.suggested || {};
      /**
       * @type {Function}
       */
      this.noise = data.noise;

      TerrainGen.all.push(this);
    }
  }

  const perlin = {
    reusableVec3: new THREE.Vector3(),
    perlinVectorSeed: new THREE.Vector3(12.9898, 78.233, 190.124),

    randomAt(x, y, z) {
      const vec = this.reusableVec3.set(x, y, z);
      return (Math.sin(this.perlinVectorSeed.dot(vec)) * 43758.5453) % 1;
    },
    interpolate(a0, a1, w) {
      if (0 >= w) return a0;
      if (1 <= w) return a1;
      return (a1 - a0) * (3 - w * 2) * w * w + a0;
    },
    grad(ix, iy, iz) {
      const rand = this.randomAt(ix, iy, iz) * Math.PI * 2;

      const sin = Math.sin(rand);
      const cos = Math.cos(rand);

      const x = sin * cos;
      const y = cos * cos;
      const z = sin;

      return { x, y, z };
    },
    dotgrad(ix, iy, iz, x, y, z) {
      const gradient = this.grad(ix, iy, iz);

      const dx = x - ix;
      const dy = y - iy;
      const dz = z - iz;

      return dx * gradient.x + dy * gradient.y + dz * gradient.z;
    },
    get(x = 0, y = 0, z = 0) {
      x = (x + 128) % 128;
      y = (y + 128) % 128;
      z = (z + 128) % 128;

      const x0 = Math.floor(x);
      const x1 = x0 + 1;
      const y0 = Math.floor(y);
      const y1 = y0 + 1;
      const z0 = Math.floor(z);
      const z1 = z0 + 1;

      const sx = x % 1;
      const sy = y % 1;
      const sz = z % 1;

      let n0, n1, n2, n3;

      // North Side of the Cube
      n0 = this.dotgrad(x0, y0, z0, x, y, z);
      n1 = this.dotgrad(x1, y0, z0, x, y, z);
      const i0 = this.interpolate(n0, n1, sx);

      n0 = this.dotgrad(x0, y1, z0, x, y, z);
      n1 = this.dotgrad(x1, y1, z0, x, y, z);
      const i1 = this.interpolate(n0, n1, sx);
      const valuen = this.interpolate(i0, i1, sy);

      // West Side of the Cube
      n2 = this.dotgrad(x0, y0, z1, x, y, z);
      n3 = this.dotgrad(x1, y0, z1, x, y, z);
      const i2 = this.interpolate(n2, n3, sx);

      n2 = this.dotgrad(x0, y1, z1, x, y, z);
      n3 = this.dotgrad(x1, y1, z1, x, y, z);
      const i3 = this.interpolate(n2, n3, sx);
      const valuew = this.interpolate(i2, i3, sy);

      const value = this.interpolate(valuen, valuew, sz);
      return value;
    },
  };

  new TerrainGen({
    name: "Open Terrain",
    settings: {
      time: { label: "Time", type: "number", min: 0, value: 0, step: 1 },
      scale: { label: "Noise Scale", type: "number", min: 0, value: 25 },
      octaves: { label: "Octaves", type: "number", min: 0, value: 2 },
      persistance: {
        label: "Persistancy",
        type: "number",
        min: 0,
        max: 1,
        step: 0.1,
        value: 0.4,
      },
      lacunarity: { label: "lacunarity", type: "number", min: 0, value: 3 },
      min: {
        label: "Min Level",
        type: "number",
        min: 0,
        max: 0.9,
        step: 0.1,
        value: 0.1,
      },
    },
    noise(s, addOn) {
      if (s.scale <= 0) s.scale = 1e-6;
      const z = s.time + TerrainGen.timeWhenDialogWasOpened;
      const map = {};

      for (let y = s.height - 1; y >= 0; y--) {
        for (let x = s.width - 1; x >= 0; x--) {
          const G = Math.pow(2.0, -s.persistance);
          let amplitude = 1;
          let frequency = 1;
          let noiseHeight = 0;
          let normalization = 0;

          for (let i = 0; i < s.octaves; i++) {
            const sampX = (x / s.scale) * frequency;
            const sampY = (y / s.scale) * frequency;
            const val = perlin.get(sampX, sampY, (z / s.scale) * frequency) + 0.4;

            noiseHeight += val * amplitude;
            normalization += amplitude;

            amplitude *= G;
            frequency *= s.lacunarity;
          }
          noiseHeight /= normalization;

          // custom functions
          if (addOn) {
            noiseHeight = addOn(noiseHeight, x, y);
          }

          // falloff
          if (s.falloff) {
            const falloff = falloffMap(x, y, s.width, s.height);
            noiseHeight = Math.clamp(noiseHeight - falloff, 0, 1);
          }

          // min/max level
          if (s.min || s.max) {
            const min = s.min ?? 0;
            const max = s.max ?? 1;

            noiseHeight = Math.clamp(
              THREE.MathUtils.mapLinear(
                easeInOutSine(noiseHeight),
                min,
                max,
                0,
                1
              ),
              0,
              1
            );
          }

          map[x + "," + y] = noiseHeight;
        }
      }
      return map;
    },
  });
  new TerrainGen({
    name: "Valley",
    settings: {
      time: { label: "Time", type: "number", min: 0, value: 0, step: 1 },
      scale: { label: "Noise Scale", type: "number", min: 0, value: 25 },
      octaves: { label: "Octaves", type: "number", min: 0, value: 2 },
      persistance: {
        label: "Persistancy",
        type: "number",
        min: 0,
        max: 1,
        step: 0.1,
        value: 0.4,
      },
      lacunarity: { label: "lacunarity", type: "number", min: 0, value: 3 },
    },
    suggested: {
      style: "EarthMountains",
    },
    noise: function (s) {
      s.min = 0.7;
      const noise = TerrainGen.all[0].noise(s, (v) => 1 - Math.abs(v * 2 - 1));
      return noise;
    },
  });
  new TerrainGen({
    name: "Mesa",
    settings: {
      time: { label: "Time", type: "number", min: 0, value: 0, step: 1 },
      scale: { label: "Noise Scale", type: "number", min: 0, value: 25 },
      octaves: { label: "Octaves", type: "number", min: 0, value: 2 },
      persistance: {
        label: "Persistancy",
        type: "number",
        min: 0,
        max: 1,
        step: 0.1,
        value: 0.4,
      },
      lacunarity: { label: "lacunarity", type: "number", min: 0, value: 3 },
    },
    suggested: {
      falloff: true,
      style: "Desert",
    },
    noise: function (s) {
      s.max = 0.7;
      s.min = 0;
      const noise = TerrainGen.all[0].noise(s);
      return noise;
    },
  });
  new TerrainGen({
    name: "River",
    settings: {
      time: { label: "Time", type: "number", min: 0, value: 0, step: 1 },
      scale: { label: "Noise Scale", type: "number", min: 0, value: 25 },
      octaves: { label: "Octaves", type: "number", min: 0, value: 2 },
      persistance: {
        label: "Persistancy",
        type: "number",
        min: 0,
        max: 1,
        step: 0.1,
        value: 0.4,
      },
      lacunarity: { label: "lacunarity", type: "number", min: 0, value: 3 },
      turbpower: {
        label: "Turb-Power",
        type: "number",
        min: 0,
        value: 1.3,
        step: 0.1,
      },
    },
    suggested: {
      style: "Ice",
      multiplier: 3,
      lacunarity: 2,
      octaves: 4,
    },
    noise: function (s) {
      const noise = TerrainGen.all[0].noise(s, function (val, x, y) {
        const xyValue = x / s.width + y / s.height + s.turbpower * val;
        const sineValue = Math.abs(Math.cos(xyValue * Math.PI));
        return sineValue;
      });

      return noise;
    },
  });

  const styleOptions = {};
  for (const key in TerrainGen.styles) styleOptions[key] = key;
  const settingsCombined = {};
  const form = {
    style: { label: "Style", type: "select", options: styleOptions },
    terrain: { label: "Terrain Type", type: "select" },
    width: {
      label: "Resolution X",
      type: "number",
      value: 32,
      min: 1,
      max: 255,
    },
    height: {
      label: "Resolution Y",
      type: "number",
      value: 32,
      min: 1,
      max: 255,
    },
    size: {
      label: "Size",
      type: "number",
      value: 16,
      min: 16,
    },
    suggested: {
      label: "Update Suggested Settings",
      type: "checkbox",
      value: true,
    },
    _: "_",
    multiplier: {
      label: "Height Multiplier",
      type: "number",
      value: 5,
      max: Infinity,
    },
    falloff: { label: "FallOff Map", type: "checkbox", value: false },
    __: "_",
  };
  styleOptions.custom = "Custom";
  const options = {};
  for (let i = 0; i < TerrainGen.all.length; i++) {
    const { codeName, name, settings } = TerrainGen.all[i];
    options[codeName] = name;

    for (const key in settings) {
      const currentSettingValue = settings[key];

      if (key in settingsCombined) {
        settingsCombined[key].push(codeName);
      } else {
        settingsCombined[key] = [codeName];
      }

      currentSettingValue.condition = ({ terrain } = {}) =>
        settingsCombined[key].includes(terrain);
      form[key] = currentSettingValue;
    }
  }
  form.terrain.options = options;

  action("terrain_action", () => {
    let typeBeforeUpdate;
    TerrainGen.timeWhenDialogWasOpened = Date.now();
    new Dialog({
      title: "Terrain Settings",
      id: "terrain_settings",
      form,
      /** @param {any} _out  */
      onConfirm(_out) {
        let style = TerrainGen.styles[_out.style];

        if (_out.style == "custom") {
          const customStyleString = localStorage.mt_customStyle;
          if (!customStyleString)
            Blockbench.showQuickMessage(
              "No Custom Style found, 'Earth' is used instead.",
              2000
            );

          const customStyle = JSON.parse(customStyleString);
          customStyle.forEach((h) => (h.color = parseRGB(h.col)));
          style = customStyle;
        }
        let terrain = TerrainGen.all.find((e) => e.codeName == _out.terrain);

        function runEdit(out, amended) {
          const { width, height } = out;
          out.falloff = _out.falloff;

          const elements = [];
          const textures = [];
          Undo.initEdit({ elements, textures, selection: true }, amended);

          const map = terrain.noise(out);
          const topLeftX = 0.5 - width / 2;
          const topLeftY = 0.5 - height / 2;

          const mesh = new Mesh({ vertices: {} });
          const texture = TerrainGen.genTexture(
            width,
            height,
            map,
            style,
            out.blending
          );

          const addedVertices = [];
          let vertexIndex = 0;
          for (let j = height - 1; j >= 0; j--) {
            for (let i = width - 1; i >= 0; i--) {
              let x = (out.size * (i + topLeftX)) / width;
              let y = (out.size * (j + topLeftY)) / height;
              let z = map[[i, j]] * out.multiplier + 1;

              let vertex = [x, z, y];
              addedVertices[vertexIndex] = mesh.addVertices(vertex)[0];
              vertexIndex++;
            }
          }
          vertexIndex = 0;
          for (let y = height - 1; y >= 0; y--) {
            for (let x = width - 1; x >= 0; x--) {
              if (x > 0 && y > 0) {
                let indices = [
                  vertexIndex,
                  vertexIndex + 1,
                  vertexIndex + width + 1,
                  vertexIndex + width,
                ];

                const uv = {};
                uv[addedVertices[indices[0]]] = [
                  ((x - 1) / width) * Project._texture_width,
                  ((y - 1) / height) * Project._texture_height,
                ];
                uv[addedVertices[indices[1]]] = [
                  (x / width) * Project._texture_width,
                  ((y - 1) / height) * Project._texture_height,
                ];
                uv[addedVertices[indices[2]]] = [
                  (x / width) * Project._texture_width,
                  (y / height) * Project._texture_height,
                ];
                uv[addedVertices[indices[3]]] = [
                  ((x - 1) / width) * Project._texture_width,
                  (y / height) * Project._texture_height,
                ];

                const face = new MeshFace(mesh, {
                  vertices: [
                    addedVertices[indices[3]],
                    addedVertices[indices[2]],
                    addedVertices[indices[1]],
                    addedVertices[indices[0]],
                  ],
                  uv,
                  texture: texture.uuid,
                });
                const key = mesh.addFaces(face);

                // procces were we want to remove distorted faces that get distorted from sorting problems
                // a quick fix is to triangulate the face
                const sortedVertices = face.getSortedVertices();
                for (let i = 0; i < 4; i++) {
                  const vertexA = mesh.vertices[sortedVertices[i]];
                  const vertexB = mesh.vertices[sortedVertices[(i + 1) % 4]];

                  const dirToB = [
                    vertexB[0] - vertexA[0],
                    vertexB[2] - vertexA[2],
                  ];

                  const daigonalCheck =
                    (dirToB[0] && dirToB[1] == 0) ||
                    (dirToB[1] && dirToB[0] == 0);
                  if (daigonalCheck) continue;

                  delete mesh.faces[key];

                  const face1 = new MeshFace(mesh, {
                    vertices: [
                      addedVertices[indices[3]],
                      addedVertices[indices[2]],
                      addedVertices[indices[0]],
                    ],
                    uv,
                    texture: texture.uuid,
                  });
                  const face2 = new MeshFace(mesh, {
                    vertices: [
                      addedVertices[indices[1]],
                      addedVertices[indices[0]],
                      addedVertices[indices[2]],
                    ],
                    uv,
                    texture: texture.uuid,
                  });
                  mesh.addFaces(face1);
                  mesh.addFaces(face2);

                  break;
                }
              }
              vertexIndex++;
            }
          }
          mesh.init();

          elements.push(mesh);
          mesh.select();
          textures.push(texture);
          Undo.finishEdit("MTools: Generate Terrain Mesh");
        }
        runEdit(_out, false);
        const amendForm = {};

        amendForm.width = form.width;
        amendForm.height = form.height;
        amendForm.size = form.size;
        amendForm.multiplier = form.multiplier;
        for (const key in terrain.settings) {
          const c = {};
          for (const skey in terrain.settings[key]) {
            if (skey == "value") {
              c[skey] = _out[key];
            } else if (skey != "condition") {
              c[skey] = terrain.settings[key][skey];
            }
          }
          amendForm[key] = c;
        }

        Undo.amendEdit(amendForm, (form) => {
          runEdit(form, true);
        });
      },
      onFormChange(data) {
        if (!data.suggested) return;
        if (data.terrain == typeBeforeUpdate) return; // stop call stack

        const selected = TerrainGen.all.find((e) => e.codeName == data.terrain);
        typeBeforeUpdate = data.terrain;

        this.setFormValues(selected.suggested);
      },
    }).show();
  });

  // wtf.
  // TODO clean the code.
  action("terrainse", () => {
    let customStyle;
    new Dialog({
      title: "Terrain Generator Style Editor",
      buttons: ["Save", "Cancel"],
      confirmEnabled: false,
      cancelIndex: 1,
      width: 650,
      onButton(i) {
        if (i == 0) {
          localStorage.setItem("mt_customStyle", JSON.stringify(customStyle));
        }
      },
      lines: [
        `
						  <style>
							  .tgseLevel {
								  background-color: var(--color-back);
								  border-top: 2px solid var(--color-ui);
								  cursor: move;
								  padding: 5px;
							  }
							  #tgse_levels{
								  max-height: 250px;
								  overflow-y: auto;
							  }
						  </style>
						  <div class="dialog_bar form_bar form_bar_t">
							  <label class="name_space_left">Result: </label>
							  <canvas id="tgseCanvas" style="background:white" width="256", height="25"></canvas>
						  </div>
						  <div class="dialog_bar form_bar form_bar_t"> <button id="tgse_addlevel"><b>+</b> Add level</button> </div>
						  <ul id="tgse_levels" class="ui-sortable">
						  </ul>
						  `,
      ],
    }).show();
    /**
     * @type HTMLCanvasElement
     */
    let canvas = $("#tgseCanvas")[0];
    let ctx = canvas.getContext("2d");
    // UI PART
    let c = function (s) {
      return $(document.createElement(s));
    };
    $("#tgse_levels").sortable({
      stop() {
        comuteMTStyle();
      },
    });
    $("#tgse_addlevel")[0].onclick = function (v, col, b, t = true) {
      let level = c("li");
      let deleteBtn = c("span").append(
        `<i class="material-icons icon tool" style="float:right">delete</i>`
      );
      let color = new ColorPicker({
        label: false,
        name: "Color",
        private: true,
        color: col || "#fff",
      });
      color.jq.spectrum({
        preferredFormat: "hex",
        color: col || "#fff",
        showinput: true,
        maxSelectionSize: 128,
        resetText: tl("generic.reset"),
        cancelText: tl("dialog.cancel"),
        chooseText: tl("dialog.confirm"),
        // !! EVERYTHING !!
        hide: function () {
          comuteMTStyle();
        },
        change: function () {
          comuteMTStyle();
        },
        move: function () {
          comuteMTStyle();
        },
      });
      let height = c("input")
        .attr({
          type: "number",
          min: 0,
          max: 100,
          step: 0.5,
          value: typeof v == "number" ? v : 100,
        })
        .addClass("dark_bordered focusable_input");
      let blending = c("input")
        .attr({
          type: "number",
          min: 0,
          max: 100,
          step: 0.5,
          value: typeof b == "number" ? b : 100,
        })
        .addClass("dark_bordered focusable_input");

      height[0].oninput = function () {
        comuteMTStyle();
      };
      blending[0].oninput = function () {
        comuteMTStyle();
      };
      deleteBtn[0].onclick = function () {
        ctx.clearRect(0, 0, 256, 25);
        level.remove();
        comuteMTStyle();
      };
      level
        .addClass("tgseLevel")
        .append(deleteBtn)
        .append(color.getNode())
        .append("&nbsp;&nbsp;")
        .append(c("label").text("At height percent of: "))
        .append("&nbsp;&nbsp;")
        .append(height)
        .append("&nbsp;&nbsp;")
        .append(c("label").text("With blending as: "))
        .append("&nbsp;&nbsp;")
        .append(blending);

      $("#tgse_levels").append(level[0]);
      if (t) {
        comuteMTStyle();
      }
    };
    let cs = localStorage.mt_customStyle;
    if (cs) {
      let custom = JSON.parse(cs);
      custom.forEach((h) => {
        $("#tgse_addlevel")[0].onclick(h.height * 100, h.col, h.blend * 100);
      });
    } else {
      $("#tgse_addlevel")[0].onclick(0, "#f00", 0, false);
      $("#tgse_addlevel")[0].onclick(50, "#0f0", 100, false);
      $("#tgse_addlevel")[0].onclick(100, "#00f", 100);
    }

    // COMPILING part

    function comuteMTStyle() {
      let children = $("#tgse_levels").children();
      customStyle = [];
      const l = children.length;
      for (let i = 0; i < l; i++) {
        const child = children.eq(i);
        const childChildren = child.children();

        let currentHeight = childChildren.eq(3).val() * 1;
        let currentBlend = childChildren.eq(5).val() * 1;
        let currentColor = childChildren
          .find(".sp-preview-inner")
          .css("background-color");
        customStyle.push({
          height: currentHeight / 100,
          col: currentColor,
          color: parseRGB(currentColor),
          blend: currentBlend / 100,
        });
      }
      // !uneffiecent code ahead!
      let image = new Image(256, 1);
      image.src = TerrainGen.genTexture(256, 1, gradient256, customStyle, false);
      image.onload = function () {
        ctx.drawImage(image, 0, 0, 256, 25);
      };
    }
  });

  var glyphs = {
  	"0": {
  		ha: 829,
  		x_min: 37,
  		x_max: 790,
  		o: "m 790 408 q 689 114 790 237 q 414 -18 581 -18 q 139 114 247 -18 q 37 408 37 238 q 139 701 37 578 q 414 832 247 832 q 689 702 581 832 q 790 408 790 579 m 631 408 q 576 589 631 513 q 414 672 515 672 q 252 589 313 672 q 199 408 199 514 q 253 227 199 304 q 414 142 314 142 q 574 229 510 142 q 631 408 631 309 z "
  	},
  	"1": {
  		ha: 389,
  		x_min: 15,
  		x_max: 312,
  		o: "m 312 802 q 311 790 312 799 q 296 387 296 667 q 297 208 296 328 q 298 28 298 87 q 276 1 298 1 q 212 0 254 1 q 149 -1 170 -1 q 127 16 127 -1 q 136 265 127 30 q 140 597 140 379 q 134 613 140 613 q 82 602 117 613 q 31 591 47 591 q 15 600 15 591 q 17 624 15 608 q 18 648 18 640 q 17 671 18 656 q 16 693 16 686 q 31 708 16 702 q 114 764 70 724 q 151 804 116 766 q 185 838 182 838 q 241 825 184 838 q 302 815 262 823 q 312 802 312 812 z "
  	},
  	"2": {
  		ha: 673,
  		x_min: 8,
  		x_max: 656,
  		o: "m 656 125 q 654 64 656 105 q 652 3 652 23 q 629 -12 652 -12 q 565 -7 637 -12 q 353 -1 494 -1 q 207 -3 304 -1 q 61 -5 110 -5 q 41 8 45 -5 l 24 106 q 71 122 24 114 q 138 143 124 132 q 323 337 232 225 q 440 558 440 483 q 390 660 440 620 q 281 697 343 697 q 160 673 220 697 q 77 630 119 657 q 42 606 42 606 q 35 607 37 606 q 26 631 28 610 q 22 677 26 647 q 8 728 8 739 q 18 741 8 733 q 158 808 73 782 q 313 833 240 833 q 518 775 437 833 q 610 589 610 709 q 371 220 610 457 q 288 131 345 189 q 332 130 305 130 q 636 146 465 130 l 642 146 q 656 125 656 146 z "
  	},
  	"3": {
  		ha: 654,
  		x_min: 23,
  		x_max: 619,
  		o: "m 619 232 q 526 41 619 107 q 314 -17 444 -17 q 36 40 160 -17 q 23 52 23 46 q 56 158 23 50 q 68 173 60 173 q 267 111 189 111 q 452 245 452 111 q 388 361 452 329 q 252 385 342 385 q 199 384 233 385 q 151 382 165 382 q 111 399 111 382 q 132 491 111 491 q 221 484 161 491 q 311 477 281 477 q 384 507 356 477 q 412 582 412 537 q 250 707 412 707 q 79 667 155 707 q 73 665 77 665 q 56 766 56 665 q 165 819 56 800 q 301 832 240 832 q 494 783 414 832 q 590 618 590 724 q 560 508 590 563 q 479 429 528 450 q 619 232 619 382 z "
  	},
  	"4": {
  		ha: 694,
  		x_min: 11,
  		x_max: 669,
  		o: "m 669 184 q 654 172 669 172 q 585 174 630 174 q 566 172 569 174 q 561 153 561 168 q 565 81 561 129 q 568 9 568 33 q 551 -8 568 -5 q 472 -12 528 -12 q 377 3 377 -12 q 385 77 377 22 q 392 158 392 132 q 380 174 392 174 q 216 170 326 174 q 52 167 106 167 q 11 250 11 167 q 24 332 11 316 q 158 496 71 385 q 328 741 267 649 q 386 829 347 770 q 407 844 397 844 q 550 808 454 844 q 571 783 571 801 q 566 679 571 749 q 561 575 561 610 q 560 468 561 544 q 559 361 559 399 l 559 306 q 611 309 577 306 q 663 311 646 311 q 668 300 668 311 q 669 242 668 281 q 669 184 669 204 m 416 668 q 412 676 416 673 q 395 653 406 676 q 380 624 388 638 q 146 307 263 467 q 201 299 149 299 l 229 299 q 397 302 342 299 q 399 469 398 386 q 411 632 402 576 q 416 668 416 665 z "
  	},
  	"5": {
  		ha: 661,
  		x_min: 12,
  		x_max: 607,
  		o: "m 607 275 q 511 52 607 128 q 273 -18 424 -18 q 130 -1 225 -18 q 12 46 12 21 q 22 124 12 70 q 45 186 34 186 q 105 150 35 186 q 237 113 176 113 q 375 146 322 113 q 437 267 437 187 q 242 399 437 399 q 166 392 216 399 q 97 385 117 385 q 78 393 82 385 q 77 406 77 397 q 77 446 76 420 q 78 486 78 475 q 77 634 78 535 q 75 783 75 734 q 91 807 75 793 q 115 821 106 821 q 222 818 151 821 q 329 814 293 814 q 432 818 363 814 q 535 821 500 821 q 551 808 551 821 q 544 756 551 794 q 538 699 538 718 q 527 683 538 691 q 509 675 517 675 q 403 679 473 675 q 298 683 333 683 q 210 681 248 683 q 203 510 210 625 q 264 515 223 510 q 326 519 305 519 q 525 462 451 519 q 607 275 607 397 z "
  	},
  	"6": {
  		ha: 713,
  		x_min: 46,
  		x_max: 676,
  		o: "m 676 296 q 593 67 676 152 q 366 -18 509 -18 q 124 92 210 -18 q 46 351 46 191 q 185 691 46 547 q 519 835 324 835 q 538 821 532 835 q 572 724 572 725 q 547 704 572 704 q 378 665 452 704 q 244 533 281 615 q 239 516 239 522 q 246 509 239 508 q 327 540 287 524 q 412 554 370 554 q 602 483 528 554 q 676 296 676 412 m 530 293 q 487 406 530 361 q 375 450 444 450 q 203 311 203 450 q 243 173 203 233 q 364 106 289 106 q 530 293 530 106 z "
  	},
  	"7": {
  		ha: 612,
  		x_min: 9,
  		x_max: 593,
  		o: "m 593 751 q 591 721 593 728 q 564 681 591 717 q 406 359 473 559 q 321 26 340 167 q 316 5 319 10 q 298 -8 311 -5 q 218 -14 279 -14 q 140 -8 155 -14 q 132 8 132 -5 q 201 258 132 92 q 328 529 246 368 q 397 667 397 663 q 379 677 397 677 q 203 668 321 677 q 28 659 86 659 q 9 671 9 659 q 14 705 9 684 q 20 739 19 732 q 21 814 21 751 q 40 828 21 828 q 195 819 85 828 q 567 814 265 814 q 593 751 593 814 z "
  	},
  	"8": {
  		ha: 636,
  		x_min: 11,
  		x_max: 610,
  		o: "m 610 224 q 523 43 610 111 q 319 -20 442 -20 q 104 39 184 -20 q 11 242 11 106 q 117 425 11 366 q 60 502 82 452 q 39 604 39 553 q 125 783 39 719 q 322 840 203 840 q 509 779 429 840 q 597 608 597 712 q 571 502 597 555 q 501 417 545 446 q 610 224 610 355 m 458 600 q 420 681 458 647 q 326 715 382 715 q 224 689 262 715 q 187 622 187 663 q 265 528 187 568 q 397 477 300 509 q 458 600 458 529 m 448 214 q 366 316 448 276 q 234 367 300 342 q 159 233 159 316 q 197 141 159 176 q 314 102 239 102 q 448 214 448 102 z "
  	},
  	"9": {
  		ha: 713,
  		x_min: 36,
  		x_max: 667,
  		o: "m 667 456 q 524 104 667 248 q 172 -39 380 -39 q 154 -26 159 -39 q 121 77 121 58 q 147 92 121 92 q 334 135 249 92 q 425 209 380 159 q 476 312 476 266 q 471 318 476 318 q 456 311 467 318 q 300 268 384 268 q 109 341 182 268 q 36 532 36 414 q 121 754 36 674 q 347 832 204 832 q 591 720 506 832 q 667 456 667 619 m 510 513 q 470 646 510 591 q 350 707 426 707 q 184 532 184 707 q 228 418 184 463 q 339 372 271 372 q 456 407 408 372 q 510 513 510 446 z "
  	},
  	" ": {
  		ha: 347,
  		x_min: 0,
  		x_max: 0,
  		o: ""
  	},
  	"!": {
  		ha: 322,
  		x_min: 79,
  		x_max: 256,
  		o: "m 253 779 q 228 465 253 608 q 201 304 218 412 q 165 278 199 278 q 139 281 146 278 q 125 301 128 284 q 83 561 83 505 l 83 926 q 92 953 83 953 q 129 949 104 953 q 167 946 154 946 q 205 949 180 946 q 243 953 231 953 q 252 927 252 953 q 252 853 252 902 q 253 779 253 804 m 256 79 q 231 10 256 39 q 167 -18 207 -18 q 102 12 127 -18 q 79 79 79 39 q 103 146 79 119 q 167 174 127 174 q 231 146 206 174 q 256 79 256 119 z "
  	},
  	"\"": {
  		ha: 421,
  		x_min: 47,
  		x_max: 375,
  		o: "m 375 937 l 375 869 q 343 663 375 751 q 311 650 338 650 q 272 660 276 650 q 259 718 270 666 q 248 777 248 770 l 248 937 q 252 950 248 942 q 313 954 269 954 q 371 950 329 954 q 375 937 375 942 m 175 777 q 163 718 175 770 q 150 660 152 666 q 111 650 146 650 q 79 663 83 650 q 47 856 47 750 l 47 941 q 110 954 47 954 q 164 951 155 954 q 176 926 176 946 q 175 896 176 920 q 174 850 174 871 q 174 813 174 838 q 175 777 175 789 z "
  	},
  	"#": {
  		ha: 922,
  		x_min: 35,
  		x_max: 887,
  		o: "m 887 625 q 881 576 887 606 q 863 538 873 538 q 857 539 861 538 q 672 549 829 543 q 623 357 656 484 q 829 359 764 359 q 844 348 844 359 q 832 265 844 308 q 820 253 829 253 q 814 254 820 253 q 595 264 786 258 q 544 56 578 197 q 518 -53 537 18 q 500 -69 513 -69 q 490 -66 496 -69 q 461 -50 481 -61 q 433 -40 447 -45 q 415 -22 415 -33 q 494 265 415 -8 l 440 265 q 323 264 359 265 q 248 -47 300 159 q 231 -62 243 -62 q 182 -43 219 -62 q 144 -15 144 -24 q 221 261 144 1 q 135 257 196 260 q 50 254 81 254 q 35 272 35 254 q 39 296 35 280 q 45 318 43 312 q 47 350 45 330 q 65 363 51 363 q 159 360 100 363 q 253 357 227 357 l 300 547 q 197 543 269 547 q 93 539 130 539 q 80 553 80 539 q 90 627 80 593 q 109 639 94 639 q 215 637 148 639 q 322 633 294 634 l 382 861 q 406 958 389 894 q 423 973 410 973 q 445 964 431 973 q 467 950 463 951 q 492 943 479 947 q 509 926 509 938 q 425 632 509 906 l 595 632 q 654 856 614 707 q 676 951 661 888 q 694 968 681 968 q 704 965 699 968 q 739 946 715 958 q 772 933 752 942 q 779 920 779 928 q 696 633 779 916 q 872 636 810 636 q 887 625 887 636 m 572 549 q 510 550 543 550 l 401 550 q 351 355 389 507 l 524 355 q 572 549 541 420 z "
  	},
  	$: {
  		ha: 597,
  		x_min: 50,
  		x_max: 568,
  		o: "m 568 747 q 566 737 568 743 q 546 690 559 722 q 536 650 543 677 q 524 641 533 641 q 462 675 525 641 q 351 711 399 709 q 346 595 346 671 q 346 476 346 536 q 479 382 449 412 q 545 240 545 321 q 431 53 545 114 q 335 20 370 20 q 336 -90 336 -38 q 333 -110 336 -110 q 314 -109 327 -110 q 294 -107 301 -107 q 276 -109 288 -107 q 258 -111 263 -111 q 252 -92 252 -111 q 253 5 252 -46 q 78 26 141 5 q 65 43 66 31 q 61 97 64 61 q 54 127 60 104 q 50 157 50 146 q 60 168 50 168 q 66 168 64 168 q 100 155 79 163 q 208 134 154 134 l 218 133 q 254 135 236 133 q 260 367 256 212 q 125 463 157 433 q 58 607 58 528 q 120 754 58 694 q 267 827 176 808 q 267 919 267 838 q 273 928 267 928 l 349 928 q 355 829 357 928 q 473 801 391 828 q 568 747 568 770 m 268 701 q 214 671 237 694 q 187 615 187 645 q 265 517 187 563 q 268 701 268 627 m 411 216 q 342 315 411 273 l 338 147 q 411 216 411 170 z "
  	},
  	"% ": {
  		ha: 1022,
  		x_min: 32,
  		x_max: 990,
  		o: "m 990 253 q 933 76 990 153 q 774 -8 871 -8 q 613 76 676 -8 q 555 253 555 153 q 613 431 555 353 q 774 515 677 515 q 933 431 871 515 q 990 253 990 353 m 718 812 q 713 796 718 806 q 533 412 652 669 q 370 -1 479 292 q 356 -20 362 -20 q 321 -4 347 -20 q 296 20 296 12 q 302 40 296 27 q 397 233 342 113 q 489 428 469 388 q 572 627 524 498 q 648 833 610 730 q 662 850 655 850 q 694 836 671 850 q 718 812 718 821 m 467 583 q 410 406 467 483 q 250 322 347 322 q 90 406 153 322 q 32 583 32 483 q 90 761 32 684 q 250 846 153 846 q 410 761 347 846 q 467 583 467 684 m 878 253 q 854 351 878 308 q 774 403 825 403 q 693 351 722 403 q 668 253 668 308 q 694 157 668 201 q 774 104 725 104 q 853 155 824 104 q 878 253 878 198 m 354 583 q 330 682 354 638 q 250 733 301 733 q 170 681 199 733 q 144 583 144 637 q 171 487 144 532 q 250 435 202 435 q 330 486 300 435 q 354 583 354 529 z "
  	},
  	"& ": {
  		ha: 956,
  		x_min: 53,
  		x_max: 928,
  		o: "m 928 113 q 927 90 928 106 q 925 66 925 75 q 926 47 925 60 q 928 28 928 35 q 896 0 928 0 q 842 -1 878 0 q 787 -3 806 -3 q 664 40 731 -3 q 566 129 606 78 q 441 18 496 50 q 279 -24 372 -24 q 113 48 176 -24 q 53 221 53 117 q 116 411 53 333 q 278 538 165 473 q 239 713 239 640 q 299 894 239 827 q 475 962 362 962 q 627 918 565 962 q 697 781 697 867 q 617 610 697 684 q 453 501 574 570 q 578 325 515 398 q 697 451 654 421 q 863 497 763 497 q 901 494 892 497 q 918 464 918 487 q 886 357 918 404 q 825 352 855 354 q 765 338 787 348 q 653 240 699 307 q 750 157 708 178 q 873 132 798 132 q 907 132 907 132 q 928 113 928 129 m 571 777 q 545 840 571 817 q 479 863 519 863 q 367 749 367 863 q 396 600 367 690 q 507 670 479 646 q 571 777 571 721 m 496 212 q 330 433 380 347 q 201 237 201 351 q 233 146 201 182 q 321 109 267 109 q 496 212 404 109 z "
  	},
  	"'": {
  		ha: 239,
  		x_min: 47,
  		x_max: 189,
  		o: "m 189 850 q 158 642 189 758 q 149 629 157 636 q 122 627 138 627 q 94 629 106 627 q 60 740 75 634 q 47 871 47 824 l 47 932 q 117 951 47 951 q 182 947 168 951 q 189 850 189 945 z "
  	},
  	"(": {
  		ha: 488,
  		x_min: 75,
  		x_max: 492,
  		o: "m 492 876 q 471 850 492 862 q 323 728 372 794 q 256 566 281 668 q 235 390 235 476 q 260 208 235 308 q 329 40 288 99 q 469 -86 382 -35 q 485 -103 485 -96 q 465 -172 485 -116 q 438 -228 444 -228 q 415 -220 432 -228 q 75 389 75 -50 q 161 739 75 583 q 421 983 254 905 q 442 991 437 991 q 471 939 450 991 q 492 876 492 886 z "
  	},
  	")": {
  		ha: 488,
  		x_min: -5,
  		x_max: 411,
  		o: "m 411 389 q 71 -220 411 -50 q 48 -228 54 -228 q 22 -172 42 -228 q 1 -103 1 -116 q 17 -86 1 -96 q 157 40 104 -34 q 227 208 199 100 q 252 390 252 308 q 230 566 252 476 q 163 728 205 668 q 16 850 115 794 q -5 876 -5 862 q 16 939 -5 886 q 44 991 37 991 q 65 983 49 991 q 324 739 233 905 q 411 389 411 583 z "
  	},
  	"*": {
  		ha: 494,
  		x_min: 26,
  		x_max: 463,
  		o: "m 463 724 q 402 674 463 709 q 342 631 342 640 q 368 563 342 620 q 394 483 394 505 q 382 465 394 473 q 360 457 370 457 q 302 509 347 457 q 248 560 257 560 q 198 509 241 560 q 143 457 154 457 q 118 467 130 457 q 107 489 107 477 q 131 564 107 500 q 155 626 155 627 q 91 675 155 640 q 26 727 26 710 q 47 758 26 758 q 110 753 68 758 q 172 749 151 749 q 202 817 194 749 q 212 904 208 860 q 249 921 218 921 q 282 905 277 921 q 292 817 287 861 q 321 750 300 750 q 382 753 341 750 q 444 755 424 755 q 457 744 451 755 q 463 724 463 732 z "
  	},
  	"+": {
  		ha: 561,
  		x_min: 23,
  		x_max: 532,
  		o: "m 532 467 q 522 354 532 456 q 513 349 520 349 q 424 351 479 349 q 335 353 357 353 q 337 249 335 318 q 339 146 339 180 q 271 119 339 119 q 211 127 226 119 q 204 144 205 132 q 205 248 203 183 q 207 353 207 328 q 121 351 189 353 q 35 349 68 349 q 23 358 23 349 q 29 412 23 363 q 32 471 29 439 q 47 478 37 478 q 207 473 28 478 q 206 574 207 507 q 205 676 205 642 q 218 688 205 688 q 270 689 235 688 q 322 690 305 690 q 339 671 339 690 q 337 572 339 638 q 335 473 335 507 q 427 474 366 473 q 519 475 489 475 q 532 467 532 475 z "
  	},
  	",": {
  		ha: 298,
  		x_min: -5,
  		x_max: 257,
  		o: "m 257 161 q 233 39 257 92 q 152 -68 218 5 q 54 -149 81 -149 q 22 -117 48 -149 q -5 -78 -5 -86 q 31 -31 -5 -79 q 69 50 66 18 q 69 121 69 45 q 143 167 69 148 q 242 182 202 182 q 257 161 257 182 z "
  	},
  	"-": {
  		ha: 536,
  		x_min: 37,
  		x_max: 500,
  		o: "m 499 490 l 498 484 q 482 414 492 460 q 473 349 480 391 q 435 340 472 342 q 361 340 409 339 q 304 342 300 342 q 180 334 262 342 q 56 326 97 326 q 37 349 37 326 q 77 478 37 380 q 96 488 80 488 q 165 486 119 488 q 235 484 212 484 q 360 493 277 484 q 485 501 444 501 q 499 490 500 501 z "
  	},
  	".": {
  		ha: 298,
  		x_min: 46,
  		x_max: 253,
  		o: "m 253 100 q 223 21 253 55 q 149 -12 193 -12 q 75 22 104 -12 q 46 100 46 55 q 75 177 46 145 q 149 210 104 210 q 223 177 193 210 q 253 100 253 144 z "
  	},
  	"/": {
  		ha: 397,
  		x_min: 22,
  		x_max: 375,
  		o: "m 375 908 q 372 892 375 905 q 248 410 330 731 q 169 87 221 305 q 132 -66 158 35 q 121 -80 127 -80 q 25 -40 31 -44 q 22 -33 22 -39 q 26 -14 22 -26 q 155 484 73 145 q 267 942 191 637 q 277 956 271 956 q 329 935 282 956 q 375 908 375 914 z "
  	},
  	":": {
  		ha: 278,
  		x_min: 46,
  		x_max: 231,
  		o: "m 231 452 q 203 383 231 411 q 136 355 176 355 q 72 384 98 355 q 46 452 46 412 q 72 520 46 492 q 138 549 98 549 q 204 520 177 549 q 231 452 231 492 m 231 89 q 204 19 231 49 q 138 -11 177 -11 q 72 19 98 -11 q 46 89 46 49 q 72 159 46 132 q 139 186 97 186 q 205 158 179 186 q 231 89 231 130 z "
  	},
  	";": {
  		ha: 278,
  		x_min: -14,
  		x_max: 236,
  		o: "m 236 452 q 209 382 236 412 q 143 353 182 353 q 78 382 104 353 q 52 452 52 411 q 77 520 52 492 q 143 549 103 549 q 210 520 183 549 q 236 452 236 492 m 231 138 q 136 -75 231 27 q 56 -144 88 -127 q 44 -149 48 -149 q 12 -123 39 -149 q -14 -92 -14 -98 q 22 -43 -14 -88 q 61 41 58 2 q 61 103 61 41 q 78 132 61 125 q 143 146 100 136 q 177 156 146 146 q 212 163 199 163 q 231 138 231 163 z "
  	},
  	"<": {
  		ha: 494,
  		x_min: 36,
  		x_max: 467,
  		o: "m 467 623 q 460 610 467 618 q 325 494 418 557 q 168 408 238 435 q 152 399 161 406 q 167 389 155 394 q 321 298 238 355 q 456 183 412 235 q 465 167 465 172 q 444 127 465 166 q 421 80 424 87 q 414 73 418 73 q 399 82 410 73 q 234 216 275 185 q 52 323 151 277 q 36 347 36 331 l 36 440 q 54 464 36 457 q 225 564 95 479 q 315 634 260 587 q 404 705 378 686 q 419 713 414 713 q 467 623 430 713 z "
  	},
  	"=": {
  		ha: 606,
  		x_min: 43,
  		x_max: 563,
  		o: "m 562 569 q 554 465 562 515 q 547 456 553 456 q 413 460 502 456 q 279 464 323 464 q 168 461 242 464 q 57 458 94 458 q 43 473 43 458 q 50 572 43 545 q 64 583 52 583 q 182 580 103 583 q 301 576 262 576 q 426 578 343 576 q 550 581 509 581 q 562 569 562 581 m 563 363 q 555 262 563 354 q 547 255 553 255 l 541 256 q 279 262 404 262 q 168 259 242 262 q 57 256 94 256 q 44 266 44 256 q 50 366 44 341 q 62 375 52 375 q 182 372 102 375 q 301 370 262 370 q 427 372 343 370 q 553 374 511 374 q 563 363 563 374 z "
  	},
  	">": {
  		ha: 494,
  		x_min: 29,
  		x_max: 460,
  		o: "m 460 347 q 444 323 460 331 q 97 82 271 239 q 82 73 93 77 q 31 167 31 161 q 163 288 31 197 q 329 389 278 367 q 344 399 336 391 q 328 408 340 403 q 36 610 129 494 q 29 623 29 618 q 49 662 29 625 q 71 707 68 699 q 76 714 73 714 q 92 705 79 714 q 271 564 149 656 q 355 509 342 517 q 441 464 410 476 q 460 440 460 457 l 460 347 z "
  	},
  	"?": {
  		ha: 553,
  		x_min: 20,
  		x_max: 524,
  		o: "m 524 692 q 465 517 524 593 q 354 406 458 509 q 286 288 292 346 q 283 258 285 273 q 264 240 281 246 q 233 233 244 233 q 193 235 199 233 q 176 268 176 241 q 204 397 176 349 q 293 515 249 456 q 346 650 346 585 q 310 751 346 713 q 211 790 273 790 q 99 755 161 790 q 41 720 38 720 q 20 850 20 720 q 40 873 20 859 q 264 947 146 947 q 451 877 378 947 q 524 692 524 806 m 330 77 q 305 10 330 39 q 243 -18 280 -18 q 181 10 206 -18 q 157 77 157 39 q 181 142 157 115 q 243 170 205 170 q 306 142 281 170 q 330 77 330 115 z "
  	},
  	"@": {
  		ha: 863,
  		x_min: 39,
  		x_max: 790,
  		o: "m 790 510 q 755 347 790 452 q 673 224 715 224 q 610 258 618 224 q 597 285 604 285 q 557 260 598 285 q 476 235 517 235 q 333 301 386 235 q 283 456 283 363 q 338 622 283 556 q 496 692 397 692 q 603 659 553 692 q 654 627 654 627 q 669 647 669 627 q 612 800 669 732 q 469 869 553 869 q 229 742 323 869 q 144 475 144 627 q 228 206 144 318 q 472 82 321 82 q 490 71 490 82 l 490 -7 q 472 -21 490 -21 q 153 132 277 -21 q 39 475 39 275 q 157 811 39 662 q 467 971 284 971 q 725 820 642 971 q 790 510 790 701 m 652 472 q 617 555 652 522 q 532 589 582 589 q 445 553 479 589 q 411 465 411 517 q 435 379 411 415 q 509 337 462 337 q 610 376 568 337 q 652 472 652 415 z "
  	},
  	A: {
  		ha: 916,
  		x_min: 6,
  		x_max: 909,
  		o: "m 909 8 q 893 0 909 0 q 856 2 880 0 q 818 4 831 4 q 779 2 805 4 q 741 0 753 0 q 692 103 722 0 q 632 207 663 205 q 501 208 607 208 l 394 208 q 267 207 282 208 q 215 102 242 205 q 172 0 187 0 l 20 0 q 6 9 6 0 q 16 40 6 16 l 182 494 q 309 811 203 549 q 361 942 328 854 q 378 968 369 968 q 416 964 391 968 q 454 961 441 961 q 491 965 467 961 q 528 968 516 968 q 545 943 534 968 q 705 534 561 905 q 909 8 909 13 m 593 382 q 532 559 593 402 q 449 758 473 711 q 309 383 309 400 q 360 356 309 360 q 427 355 363 355 l 496 355 q 593 382 593 355 z "
  	},
  	B: {
  		ha: 848,
  		x_min: 71,
  		x_max: 803,
  		o: "m 803 293 q 732 90 803 175 q 541 1 656 1 q 410 3 497 1 q 279 5 323 5 q 183 3 248 5 q 87 0 119 0 q 71 16 71 0 q 78 240 71 90 q 85 464 85 389 q 78 700 85 543 q 71 937 71 858 q 87 951 71 951 q 269 951 148 951 q 452 950 391 950 q 679 897 594 950 q 782 697 782 833 q 755 600 782 650 q 689 524 728 549 q 669 507 669 511 q 689 492 669 503 q 772 408 741 463 q 803 293 803 353 m 612 682 q 527 811 612 778 q 358 831 475 831 q 244 814 244 831 q 242 747 244 791 q 240 679 240 702 q 241 631 240 663 q 241 582 241 598 q 395 562 241 562 q 612 682 612 562 m 631 300 q 557 412 631 382 q 411 431 510 431 q 240 412 240 431 l 240 301 q 241 227 240 277 q 243 151 243 176 q 286 141 243 144 q 415 138 330 138 q 569 165 522 138 q 631 300 631 202 z "
  	},
  	C: {
  		ha: 823,
  		x_min: 39,
  		x_max: 819,
  		o: "m 819 157 q 806 134 819 149 q 478 -20 673 -20 q 153 129 275 -20 q 39 475 39 267 q 155 822 39 682 q 481 972 278 972 q 799 833 686 972 q 810 810 810 819 q 774 742 810 798 q 730 685 738 685 q 689 718 722 685 q 614 779 649 759 q 485 812 555 812 q 276 710 351 812 q 210 479 210 618 q 275 247 210 340 q 484 142 350 142 q 612 175 550 142 q 694 237 652 197 q 733 270 730 270 q 778 216 737 270 q 819 157 819 162 z "
  	},
  	D: {
  		ha: 945,
  		x_min: 73,
  		x_max: 905,
  		o: "m 905 481 q 797 151 905 290 q 494 0 679 0 q 388 3 459 0 q 282 5 317 5 q 186 3 250 5 q 90 0 122 0 q 73 17 73 0 q 79 240 73 91 q 85 464 85 389 q 79 701 85 543 q 74 937 74 859 q 92 951 74 951 q 166 951 117 951 q 241 950 216 950 q 312 951 264 950 q 384 951 359 951 q 734 863 619 951 q 863 691 817 799 q 905 481 905 591 m 739 481 q 656 720 739 627 q 424 815 569 815 q 327 817 304 815 q 248 787 248 812 q 245 631 248 735 q 243 475 243 527 q 245 320 243 423 q 248 165 248 217 q 329 136 248 140 q 428 136 318 136 q 552 153 506 136 q 654 228 609 173 q 739 481 739 331 z "
  	},
  	E: {
  		ha: 747,
  		x_min: 68,
  		x_max: 713,
  		o: "m 713 136 q 707 105 713 125 q 700 74 701 79 q 690 3 698 50 q 673 -9 687 -9 q 647 -7 666 -9 q 389 5 564 5 q 239 3 339 5 q 90 0 140 0 q 68 20 68 0 q 76 248 68 96 q 85 476 85 400 q 77 764 85 553 q 69 926 75 819 l 68 936 q 86 951 68 951 q 229 949 134 951 q 371 946 323 946 q 507 949 416 946 q 643 951 597 951 q 677 932 675 951 q 692 821 692 842 q 677 805 692 805 q 502 811 619 805 q 326 818 385 818 q 256 803 271 818 q 241 729 241 788 l 241 628 q 243 580 241 587 q 279 559 250 559 q 302 559 287 559 q 325 559 317 559 q 564 564 458 559 q 661 571 605 566 q 675 559 675 572 q 670 492 675 537 q 665 425 665 448 q 645 413 665 413 q 585 418 637 413 q 414 422 547 422 q 272 419 302 422 q 241 391 245 417 q 241 338 241 395 l 241 238 q 263 150 241 168 q 348 136 280 136 l 422 136 q 689 153 470 136 l 699 153 q 713 136 713 155 z "
  	},
  	F: {
  		ha: 741,
  		x_min: 68,
  		x_max: 722,
  		o: "m 722 812 q 708 800 722 800 q 534 806 655 800 q 361 810 422 811 l 311 809 q 261 807 264 808 q 248 764 248 802 l 248 601 q 267 555 248 555 q 466 561 333 555 q 664 567 598 567 q 678 556 678 567 q 676 522 678 545 q 675 488 675 499 q 676 451 675 475 q 677 414 677 426 q 663 406 677 406 q 521 408 616 406 q 378 411 426 411 q 279 410 291 411 q 249 385 249 406 q 252 201 249 323 q 256 18 256 79 q 239 -2 256 -2 q 199 1 226 -2 q 158 4 172 4 q 123 2 146 4 q 87 0 99 0 q 71 15 71 0 q 77 241 71 90 q 83 468 83 393 q 69 922 83 538 l 69 931 q 86 947 68 945 q 172 945 92 947 q 370 945 279 943 q 682 958 492 946 q 711 936 708 960 q 714 880 711 918 q 722 812 722 828 z "
  	},
  	G: {
  		ha: 937,
  		x_min: 39,
  		x_max: 902,
  		o: "m 901 33 q 884 18 902 18 q 834 38 873 18 q 785 65 795 57 q 489 -20 660 -20 q 161 130 290 -20 q 39 473 39 271 q 159 822 39 681 q 489 971 286 971 q 690 922 593 971 q 844 787 787 873 q 853 768 853 774 q 805 705 853 758 q 749 652 756 652 q 707 693 743 652 q 625 770 664 743 q 496 811 563 811 q 286 704 368 811 q 211 473 211 606 q 288 244 211 344 q 497 136 371 136 q 725 204 621 136 q 713 333 724 222 q 705 461 705 412 q 720 473 705 473 q 759 471 733 473 q 798 469 785 469 q 837 471 810 469 q 876 472 863 472 q 890 450 890 472 q 889 379 890 427 q 887 307 887 331 q 900 43 887 210 l 901 33 z "
  	},
  	H: {
  		ha: 994,
  		x_min: 71,
  		x_max: 926,
  		o: "m 926 16 q 905 0 926 0 q 870 2 894 0 q 833 4 846 4 q 794 2 821 4 q 755 0 768 0 q 740 16 740 0 q 744 199 740 77 q 747 382 747 321 q 732 412 747 408 q 497 418 711 418 q 262 412 283 418 q 248 382 248 408 q 251 202 248 322 q 254 22 254 82 q 237 0 254 0 q 199 2 224 0 q 160 4 173 4 q 124 2 148 4 q 87 0 100 0 q 71 16 71 0 q 78 240 71 90 q 85 464 85 389 q 78 700 85 543 q 71 937 71 858 q 87 951 71 951 q 125 949 100 951 q 163 947 150 947 q 201 949 175 947 q 239 951 227 951 q 254 939 254 951 q 249 764 254 881 q 244 589 244 647 q 258 566 244 570 q 497 559 275 559 q 734 566 714 559 q 750 595 750 570 q 746 766 750 652 q 743 938 743 881 q 758 951 743 951 q 796 949 771 951 q 833 947 821 947 q 870 949 846 947 q 907 951 895 951 q 924 937 924 951 q 918 700 924 858 q 911 464 911 543 q 918 240 911 389 q 926 16 926 90 z "
  	},
  	I: {
  		ha: 329,
  		x_min: 71,
  		x_max: 257,
  		o: "m 257 14 q 237 0 257 0 q 200 2 225 0 q 163 4 175 4 q 125 2 150 4 q 87 0 100 0 q 71 16 71 0 q 78 249 71 93 q 85 482 85 404 q 78 708 85 557 q 71 935 71 859 q 86 951 71 951 q 125 949 99 951 q 165 947 152 947 q 202 949 178 947 q 239 951 227 951 q 256 938 256 951 q 251 710 256 862 q 245 482 245 558 q 251 248 245 404 q 257 14 257 92 z "
  	},
  	J: {
  		ha: 371,
  		x_min: 5,
  		x_max: 302,
  		o: "m 302 937 q 297 737 302 870 q 292 537 292 604 q 292 441 292 505 q 293 345 293 377 q 266 104 293 197 q 135 -96 229 -20 q 117 -106 122 -106 q 106 -98 112 -106 q 11 -1 58 -44 q 5 9 5 4 q 12 21 5 14 q 75 81 58 61 q 113 160 100 113 q 130 417 130 222 l 129 519 q 121 725 129 583 q 113 930 113 861 q 132 950 113 950 q 171 948 145 950 q 210 946 197 946 q 248 948 222 946 q 285 950 273 950 q 302 937 302 950 z "
  	},
  	K: {
  		ha: 828,
  		x_min: 71,
  		x_max: 821,
  		o: "m 821 32 q 802 0 821 0 l 646 0 q 543 144 626 0 q 450 321 473 267 q 424 379 427 373 q 376 415 404 413 q 331 416 368 416 q 245 395 245 416 q 250 208 245 332 q 254 22 254 84 q 237 0 254 0 q 199 2 224 0 q 160 4 173 4 q 124 2 148 4 q 87 0 100 0 q 71 16 71 0 q 78 240 71 90 q 85 464 85 389 q 78 700 85 543 q 71 937 71 858 q 87 951 71 951 q 125 949 100 951 q 163 947 150 947 q 199 949 175 947 q 236 951 224 951 q 252 939 252 951 q 248 766 252 882 q 244 591 244 650 q 248 558 244 565 q 275 546 253 546 q 468 595 407 546 q 567 754 520 638 q 635 936 601 845 q 656 951 640 947 q 728 954 667 954 q 802 933 802 954 q 771 823 802 921 q 676 623 734 709 q 574 504 637 564 q 557 478 557 490 q 612 357 557 466 q 699 205 660 262 q 818 45 741 153 q 821 32 821 39 z "
  	},
  	L: {
  		ha: 718,
  		x_min: 71,
  		x_max: 710,
  		o: "m 710 147 q 700 12 710 52 q 676 -7 695 -7 q 526 -2 626 -7 q 375 4 425 4 q 233 2 328 4 q 92 0 139 0 q 75 17 75 0 q 80 240 75 91 q 85 464 85 389 q 78 700 85 543 q 71 935 71 857 q 87 950 71 950 q 125 948 100 950 q 163 946 150 946 q 201 948 175 946 q 239 950 227 950 q 255 937 255 950 q 250 721 255 865 q 244 504 244 576 q 244 397 244 469 q 243 290 243 325 q 256 139 243 139 q 633 151 506 139 q 665 156 640 152 q 696 160 685 160 q 710 147 710 160 z "
  	},
  	M: {
  		ha: 1097,
  		x_min: 71,
  		x_max: 1024,
  		o: "m 1024 17 q 1007 0 1024 0 q 970 2 995 0 q 933 4 945 4 q 896 2 921 4 q 859 0 871 0 q 842 22 842 0 q 847 281 842 109 q 852 539 852 453 q 847 552 852 552 q 838 545 841 552 q 674 150 803 471 q 614 -4 653 88 q 565 -13 609 -13 q 494 -1 501 -13 q 429 153 471 54 q 256 553 372 287 q 247 562 254 557 q 241 547 241 558 q 244 285 241 460 q 248 22 248 110 q 231 0 248 0 q 195 2 219 0 q 160 4 172 4 q 124 2 148 4 q 87 0 100 0 q 71 13 71 0 q 78 238 71 88 q 85 464 85 389 q 78 698 85 542 q 71 932 71 854 q 86 947 71 945 q 225 960 178 960 q 244 932 232 960 q 526 288 408 571 q 559 221 554 221 q 589 275 566 221 q 844 928 681 495 q 867 954 854 954 q 936 951 890 954 q 1006 949 983 949 q 1023 932 1023 949 q 1018 698 1023 854 q 1013 464 1013 542 q 1018 240 1013 389 q 1024 17 1024 91 z "
  	},
  	N: {
  		ha: 997,
  		x_min: 71,
  		x_max: 924,
  		o: "m 924 937 q 918 701 924 859 q 913 465 913 544 q 914 244 913 391 q 916 22 916 96 q 899 0 916 0 q 868 2 888 0 q 838 4 848 4 q 804 2 827 4 q 771 0 782 0 q 742 22 759 0 q 298 611 595 220 q 244 677 252 671 q 237 650 237 677 q 241 336 237 545 q 244 22 244 127 q 231 0 244 0 q 195 2 219 0 q 160 4 172 4 q 124 2 148 4 q 87 0 100 0 q 71 14 71 0 q 78 238 71 88 q 85 464 85 389 q 79 760 85 546 q 72 926 77 815 l 71 935 q 87 946 71 945 q 157 949 132 947 q 193 954 166 949 q 228 958 215 958 q 249 939 234 958 q 726 301 405 724 q 753 271 741 283 q 758 401 758 299 q 751 665 758 489 q 745 929 745 842 q 758 951 745 951 q 795 949 770 951 q 832 947 820 947 q 871 949 845 947 q 909 951 897 951 q 924 937 924 951 z "
  	},
  	O: {
  		ha: 1007,
  		x_min: 41,
  		x_max: 966,
  		o: "m 966 476 q 838 130 966 275 q 504 -21 703 -21 q 170 129 304 -21 q 41 476 41 273 q 172 823 41 677 q 504 974 306 974 q 837 823 703 974 q 966 476 966 677 m 803 478 q 720 709 803 611 q 503 814 633 814 q 287 708 373 814 q 205 476 205 609 q 287 245 205 344 q 503 139 373 139 q 721 245 634 139 q 803 478 803 344 z "
  	},
  	P: {
  		ha: 867,
  		x_min: 68,
  		x_max: 839,
  		o: "m 839 600 q 753 345 839 441 q 507 247 664 247 q 390 250 468 247 q 272 253 311 253 q 250 225 250 253 q 255 117 250 189 q 259 9 259 45 q 246 -2 259 -2 q 203 1 232 -2 q 160 4 174 4 q 124 2 148 4 q 89 0 100 0 q 72 21 72 0 q 78 244 72 95 q 85 468 85 393 q 69 922 85 680 l 68 932 q 86 947 68 947 q 196 947 123 947 q 307 946 270 946 q 403 949 339 946 q 498 951 467 951 q 745 850 648 951 q 839 600 839 750 m 668 590 q 613 753 668 692 q 456 817 556 817 q 345 811 425 817 q 250 800 253 806 q 245 567 245 792 q 247 481 245 538 q 249 396 249 425 q 264 387 249 390 q 471 379 301 379 q 618 438 566 379 q 668 590 668 494 z "
  	},
  	Q: {
  		ha: 1007,
  		x_min: 41,
  		x_max: 966,
  		o: "m 966 478 q 859 159 966 298 q 571 -8 745 14 q 660 -144 596 -83 q 664 -153 664 -149 q 618 -175 664 -172 q 557 -175 618 -175 q 463 -172 475 -175 q 424 -7 428 -164 q 145 165 251 27 q 41 478 41 300 q 172 823 41 677 q 504 974 307 974 q 836 823 701 974 q 966 478 966 677 m 804 478 q 721 709 804 611 q 503 811 633 811 q 286 707 374 811 q 204 476 204 608 q 286 245 204 345 q 503 140 373 140 q 722 245 634 140 q 804 478 804 344 z "
  	},
  	R: {
  		ha: 825,
  		x_min: 68,
  		x_max: 804,
  		o: "m 804 5 q 793 0 804 0 q 753 2 780 0 q 714 4 727 4 q 672 2 700 4 q 629 0 644 0 q 606 17 614 0 q 482 302 584 63 q 433 332 472 327 q 371 333 424 333 q 260 330 277 333 q 245 296 245 328 q 250 154 245 248 q 254 12 254 59 q 241 -2 254 -2 q 200 1 227 -2 q 158 4 172 4 q 123 2 146 4 q 87 0 99 0 q 71 16 71 0 q 78 242 71 91 q 85 468 85 393 q 69 925 85 682 l 68 936 q 97 949 68 949 q 272 952 155 949 q 446 956 388 956 q 687 884 596 956 q 787 659 787 804 q 760 500 787 558 q 654 385 732 439 q 642 368 642 376 q 723 187 642 358 q 804 5 804 16 m 618 621 q 547 785 618 743 q 359 815 495 815 q 248 798 250 815 q 243 602 243 761 l 243 472 q 252 469 245 471 q 292 466 264 468 q 431 463 356 463 q 618 621 618 463 z "
  	},
  	S: {
  		ha: 648,
  		x_min: 75,
  		x_max: 614,
  		o: "m 614 883 q 576 815 600 861 q 550 755 569 794 q 539 749 546 749 q 474 773 540 749 q 365 798 408 798 q 240 688 240 798 q 328 581 240 627 q 490 493 475 505 q 578 304 578 423 q 458 65 578 153 q 193 -14 350 -14 q 114 3 119 -14 q 102 78 111 28 q 85 139 96 98 q 83 151 83 145 q 93 160 83 160 q 143 157 109 160 q 193 153 176 153 q 404 289 404 153 q 319 404 404 355 q 161 496 164 492 q 75 682 75 565 q 158 884 75 808 q 367 957 239 957 q 492 939 421 957 q 607 892 568 920 q 614 883 610 889 z "
  	},
  	T: {
  		ha: 713,
  		x_min: 9,
  		x_max: 701,
  		o: "m 701 823 q 689 806 701 806 q 449 814 670 806 q 443 482 443 607 q 449 248 443 404 q 454 14 454 92 q 435 0 454 0 q 397 2 422 0 q 359 4 372 4 q 322 2 347 4 q 285 0 297 0 q 268 17 268 0 q 274 249 268 94 q 281 482 281 404 q 273 814 281 603 q 17 803 98 803 q 9 810 9 803 q 15 845 9 822 q 24 880 22 875 q 33 946 25 904 q 45 955 37 955 l 53 954 q 370 940 293 940 q 591 950 437 940 q 679 957 696 957 q 699 945 696 957 q 697 879 697 952 q 699 851 697 870 q 701 823 701 833 z "
  	},
  	U: {
  		ha: 917,
  		x_min: 68,
  		x_max: 848,
  		o: "m 848 937 q 841 701 848 858 q 835 465 835 544 q 836 388 835 439 q 836 312 836 337 q 810 115 836 170 q 652 1 769 31 q 449 -17 580 -17 q 138 62 212 -17 q 81 306 81 123 q 81 381 81 328 q 82 465 82 435 q 75 760 82 545 q 69 926 75 816 q 68 937 68 935 q 86 951 68 951 q 161 951 114 951 q 236 950 216 950 q 252 938 252 950 q 247 628 252 835 q 243 318 243 421 q 295 160 243 201 q 460 123 340 123 q 615 153 569 123 q 673 293 673 191 q 670 615 673 400 q 667 937 667 829 q 686 950 667 947 q 727 950 701 952 q 757 947 758 947 q 794 949 769 947 q 831 951 819 951 q 848 937 848 951 z "
  	},
  	V: {
  		ha: 860,
  		x_min: 41,
  		x_max: 818,
  		o: "m 818 612 q 685 333 818 584 q 517 20 601 176 q 494 0 507 0 l 358 0 q 339 20 349 0 q 178 323 337 24 q 41 604 41 581 q 45 765 41 658 q 49 926 49 873 q 65 951 49 951 q 103 949 78 951 q 140 947 127 947 q 178 949 153 947 q 215 951 203 951 q 231 939 231 951 q 223 773 231 884 q 216 607 216 663 q 427 196 216 561 q 547 414 482 291 q 642 623 642 591 q 638 781 642 675 q 635 938 635 886 q 650 951 635 951 q 688 949 663 951 q 725 947 713 947 q 762 949 737 947 q 799 951 787 951 q 816 939 814 951 q 815 913 815 943 q 817 763 815 863 q 818 612 818 663 z "
  	},
  	W: {
  		ha: 1239,
  		x_min: 41,
  		x_max: 1198,
  		o: "m 1198 604 q 1063 314 1198 599 q 924 18 1017 215 q 905 0 915 0 l 783 0 q 762 18 770 0 q 618 390 712 136 q 472 18 571 265 q 452 0 465 0 l 330 0 q 311 18 320 0 q 171 314 264 117 q 41 604 41 584 q 45 772 41 660 q 48 939 48 884 q 65 951 48 951 q 102 949 77 951 q 139 947 127 947 q 174 949 151 947 q 208 950 197 950 q 222 940 222 950 q 216 774 222 885 q 210 608 210 663 q 347 295 210 574 q 396 203 392 203 q 399 208 397 203 q 434 294 408 223 q 534 595 483 427 q 536 702 536 612 q 534 822 536 742 q 532 941 532 901 q 546 951 532 951 q 585 949 559 951 q 624 947 610 947 q 659 949 635 947 q 693 951 682 951 q 709 941 709 951 q 706 812 709 898 q 703 684 703 726 q 704 599 703 614 q 806 301 706 565 q 842 216 817 271 q 844 211 842 213 q 892 301 848 211 q 1026 610 1026 574 q 1020 776 1026 665 q 1014 941 1014 886 q 1019 951 1014 951 q 1060 949 1033 951 q 1100 947 1086 947 q 1137 949 1112 947 q 1175 951 1162 951 q 1192 943 1190 951 q 1192 924 1192 944 q 1195 764 1192 871 q 1198 604 1198 658 z "
  	},
  	X: {
  		ha: 796,
  		x_min: 39,
  		x_max: 761,
  		o: "m 761 8 q 746 0 761 0 l 637 -1 q 628 0 629 -1 q 511 169 618 3 q 401 335 404 334 q 281 161 389 326 q 167 0 177 0 l 54 0 q 39 11 39 0 l 39 109 q 166 291 39 121 q 294 473 294 460 q 167 659 294 488 q 40 840 40 830 l 40 945 q 58 954 40 954 q 115 953 77 954 q 172 951 153 951 q 197 920 176 951 q 390 621 261 820 q 401 610 393 616 q 519 785 411 615 q 635 951 625 951 l 742 951 q 760 942 760 951 l 760 838 q 633 652 760 821 q 507 475 507 484 q 634 291 507 465 q 761 106 761 118 l 761 8 z "
  	},
  	Y: {
  		ha: 815,
  		x_min: 24,
  		x_max: 794,
  		o: "m 794 696 q 673 491 794 657 q 514 283 593 387 q 494 231 494 258 q 498 121 494 194 q 502 12 502 48 q 485 0 502 0 l 323 0 q 310 20 310 0 q 315 125 310 54 q 319 231 319 195 q 302 285 319 261 q 157 475 254 348 q 37 647 74 588 q 25 686 25 667 q 24 933 24 772 q 40 951 24 951 q 74 949 52 951 q 109 947 97 947 q 149 949 122 947 q 191 951 176 951 q 203 941 203 951 q 199 827 203 903 q 195 713 195 751 q 410 427 195 672 q 526 570 460 484 q 618 711 618 688 q 612 822 618 748 q 607 933 607 897 q 623 951 607 951 q 660 949 635 951 q 697 947 685 947 q 736 949 710 947 q 775 951 762 951 q 791 929 791 951 q 793 812 791 890 q 794 696 794 734 z "
  	},
  	Z: {
  		ha: 701,
  		x_min: 26,
  		x_max: 662,
  		o: "m 662 155 q 653 83 662 132 q 644 9 644 34 q 628 -5 644 -5 q 507 -3 587 -5 q 386 0 427 0 l 64 0 q 41 14 45 0 q 26 127 26 90 q 233 459 26 134 q 439 800 439 783 q 422 807 439 807 l 61 807 q 47 821 47 807 q 57 882 47 826 q 70 948 67 939 q 85 957 72 957 q 164 952 112 957 q 241 947 216 947 l 623 947 q 637 936 635 947 q 648 835 648 895 q 433 494 648 831 q 218 146 218 157 q 231 142 221 142 q 532 150 427 142 q 593 157 545 151 q 653 163 631 163 q 662 155 662 163 z "
  	},
  	"[": {
  		ha: 498,
  		x_min: 86,
  		x_max: 481,
  		o: "m 481 -118 q 479 -161 481 -132 q 478 -203 478 -190 q 464 -216 478 -216 q 370 -214 433 -216 q 277 -211 308 -211 q 193 -213 249 -211 q 110 -215 138 -215 q 90 -189 90 -215 q 97 73 90 -102 q 103 336 103 248 q 95 635 103 435 q 86 934 86 834 q 107 960 86 960 q 192 958 135 960 q 277 956 248 956 q 370 958 308 956 q 464 960 433 960 q 479 946 479 960 q 480 906 479 932 q 481 865 481 879 q 467 850 481 850 q 382 854 439 850 q 296 859 325 859 q 281 859 285 859 q 261 835 263 856 q 254 637 259 811 q 249 336 249 404 q 252 64 249 230 q 258 -93 253 12 q 269 -115 260 -111 q 294 -117 273 -117 q 381 -112 323 -117 q 467 -107 438 -107 q 481 -118 481 -107 z "
  	},
  	"\\": {
  		ha: 397,
  		x_min: 26,
  		x_max: 370,
  		o: "m 370 -22 q 331 -56 370 -35 q 281 -75 295 -75 l 273 -75 q 221 97 258 -42 q 103 564 206 153 q 26 895 74 674 q 68 929 34 907 q 115 950 102 951 l 122 950 q 256 454 144 891 q 370 -22 370 14 z "
  	},
  	"]": {
  		ha: 498,
  		x_min: 18,
  		x_max: 412,
  		o: "m 412 934 q 404 635 412 834 q 396 336 396 435 q 402 73 396 248 q 408 -189 408 -102 q 389 -215 408 -215 q 306 -213 361 -215 q 222 -211 250 -211 q 129 -214 191 -211 q 35 -216 66 -216 q 21 -203 21 -216 q 20 -161 21 -190 q 18 -118 18 -132 q 32 -107 18 -107 q 118 -112 60 -107 q 205 -117 176 -117 q 221 -117 217 -117 q 240 -93 238 -114 q 246 64 243 -66 q 250 336 250 230 q 244 637 250 404 q 237 835 244 703 q 227 857 236 852 q 202 859 223 859 q 117 854 174 859 q 32 850 60 850 q 18 865 18 850 q 19 906 18 879 q 20 946 20 932 q 35 960 20 960 q 129 958 66 960 q 222 956 191 956 q 307 958 250 956 q 392 960 363 960 q 412 934 412 960 z "
  	},
  	"^": {
  		ha: 648,
  		x_min: 26,
  		x_max: 618,
  		o: "m 618 246 q 570 218 616 240 q 541 201 566 216 q 517 187 519 187 q 317 450 494 187 q 224 313 312 445 q 125 193 144 193 q 72 225 129 193 q 26 252 26 250 q 174 478 94 353 q 257 675 214 550 q 266 688 261 688 l 373 688 q 382 675 378 688 q 463 485 404 591 q 618 246 474 464 z "
  	},
  	_: {
  		ha: 604,
  		x_min: -14,
  		x_max: 609,
  		o: "m 609 -159 q 604 -271 609 -246 q 587 -282 602 -282 q 431 -279 535 -282 q 273 -275 326 -275 q 139 -279 229 -275 q 4 -282 49 -282 q -14 -267 -14 -282 q -7 -160 -14 -211 q 4 -147 -5 -147 q 151 -151 53 -147 q 298 -154 250 -154 q 449 -152 349 -154 q 599 -150 549 -150 q 609 -159 609 -150 z "
  	},
  	"`": {
  		ha: 485,
  		x_min: 36,
  		x_max: 392,
  		o: "m 391 809 q 381 774 391 803 q 368 745 372 745 q 357 744 353 745 q 43 907 119 855 q 36 915 40 909 q 76 957 42 927 q 120 987 109 987 q 245 918 136 987 q 387 822 345 855 q 391 809 392 818 z "
  	},
  	a: {
  		ha: 770,
  		x_min: 29,
  		x_max: 728,
  		o: "m 728 614 q 726 602 728 611 q 700 334 700 446 q 717 29 700 327 l 718 20 q 700 0 718 0 q 643 -4 681 0 q 587 -9 606 -9 q 568 39 574 -9 q 555 86 561 86 q 518 60 551 86 q 444 10 478 27 q 336 -17 390 -17 q 115 88 205 -17 q 29 322 29 189 q 115 571 29 473 q 353 673 205 673 q 534 602 456 673 q 570 562 545 588 q 574 560 572 560 q 585 603 578 560 q 604 646 593 646 q 673 635 623 646 q 728 614 728 623 m 555 330 q 506 473 555 414 q 372 538 454 538 q 237 474 291 538 q 184 330 184 413 q 237 188 184 248 q 372 125 291 125 q 505 189 452 125 q 555 330 555 250 z "
  	},
  	b: {
  		ha: 770,
  		x_min: 50,
  		x_max: 742,
  		o: "m 742 328 q 659 94 742 193 q 437 -12 570 -12 q 282 33 349 -12 q 228 78 255 56 q 218 37 220 76 q 207 -1 216 -1 l 64 -1 q 56 7 56 -1 q 57 20 56 7 q 68 435 68 128 q 57 803 68 560 q 50 939 50 958 q 68 958 50 956 q 140 961 92 959 q 179 966 150 962 q 218 970 203 970 q 229 954 229 970 q 226 884 229 931 q 222 812 222 836 q 219 706 222 777 q 216 600 216 635 q 226 574 216 574 q 236 582 231 574 q 433 675 311 675 q 661 570 574 675 q 742 328 742 471 m 589 334 q 538 476 589 414 q 404 542 484 542 q 269 477 323 542 q 216 334 216 416 q 269 189 216 250 q 406 125 323 125 q 539 191 486 125 q 589 334 589 252 z "
  	},
  	c: {
  		ha: 558,
  		x_min: 26,
  		x_max: 543,
  		o: "m 543 615 q 527 549 543 600 q 505 497 511 497 q 444 524 475 511 q 376 538 413 538 q 237 476 293 538 q 182 330 182 414 q 237 187 182 248 q 376 125 294 125 q 466 147 422 125 q 505 170 510 170 q 524 113 513 170 q 534 41 534 61 q 455 0 534 20 q 357 -17 389 -17 q 121 87 217 -17 q 26 330 26 189 q 119 574 26 474 q 355 677 214 677 q 529 629 450 677 q 543 615 543 621 z "
  	},
  	d: {
  		ha: 772,
  		x_min: 28,
  		x_max: 721,
  		o: "m 721 946 q 713 684 721 859 q 705 422 705 509 q 717 17 705 155 l 718 8 q 699 -1 718 1 q 663 -1 686 -2 q 636 1 634 1 q 606 -1 626 1 q 576 -3 587 -3 q 565 44 567 -3 q 560 92 564 92 q 550 83 556 90 q 336 -17 457 -17 q 111 87 199 -17 q 28 325 28 186 q 112 568 28 469 q 342 671 200 671 q 491 621 427 671 q 549 570 520 595 q 554 579 554 572 l 554 799 q 552 867 554 821 q 550 935 550 912 q 561 951 550 951 q 635 956 586 951 q 709 960 685 960 q 721 946 721 960 m 551 329 q 501 472 551 410 q 368 538 448 538 q 231 473 285 538 q 179 326 179 412 q 233 184 179 245 q 368 121 288 121 q 503 185 450 121 q 551 329 551 245 z "
  	},
  	e: {
  		ha: 669,
  		x_min: 26,
  		x_max: 644,
  		o: "m 644 364 q 600 297 644 314 q 180 257 571 286 q 246 155 189 197 q 363 115 300 115 q 559 184 470 115 q 581 202 570 193 q 588 201 587 202 q 614 154 590 199 q 637 104 637 108 q 627 89 637 100 q 371 -17 527 -17 q 120 77 214 -17 q 26 328 26 171 q 116 571 26 467 q 347 679 210 679 q 560 585 475 679 q 644 364 644 494 m 482 406 q 438 505 482 462 q 338 549 393 549 q 227 498 275 549 q 178 386 178 448 q 203 372 178 372 q 443 392 303 372 q 482 406 482 397 z "
  	},
  	f: {
  		ha: 408,
  		x_min: 12,
  		x_max: 419,
  		o: "m 419 869 q 407 860 419 861 q 341 854 374 857 q 282 827 302 848 q 249 644 249 791 q 319 643 271 644 q 392 642 368 642 q 408 629 408 642 q 410 573 408 610 q 411 517 411 535 q 397 504 411 504 q 326 506 374 504 q 254 509 277 509 l 254 306 q 258 162 254 258 q 261 18 261 66 q 248 0 261 0 l 123 0 q 106 21 106 0 l 106 488 q 64 505 106 506 q 17 509 20 505 q 15 534 15 511 q 14 578 15 549 q 12 623 12 608 q 98 642 12 637 q 96 712 96 685 q 139 888 96 832 q 250 966 177 938 q 387 992 316 992 q 396 985 393 992 q 408 927 397 983 q 419 869 419 871 z "
  	},
  	g: {
  		ha: 722,
  		x_min: 26,
  		x_max: 667,
  		o: "m 667 632 q 665 388 667 551 q 664 143 664 224 q 595 -95 664 -18 q 363 -176 522 -176 q 114 -118 209 -176 q 99 -102 99 -109 q 119 -1 99 -109 q 129 10 121 10 q 138 7 132 10 q 342 -52 239 -52 q 453 -22 409 -52 q 504 77 504 12 q 501 140 504 91 q 310 49 426 49 q 104 139 184 49 q 26 353 26 226 q 101 572 26 481 q 307 668 180 668 q 485 582 419 668 q 500 568 496 568 q 506 580 506 568 q 505 608 506 589 q 503 637 503 627 q 511 677 503 677 q 585 665 518 677 q 657 650 651 652 q 667 632 667 646 m 504 353 q 463 481 504 429 q 343 539 417 539 q 224 481 270 539 q 183 353 183 428 q 225 225 183 279 q 343 167 271 167 q 461 225 415 167 q 504 353 504 279 z "
  	},
  	h: {
  		ha: 722,
  		x_min: 47,
  		x_max: 661,
  		o: "m 661 24 q 647 -1 661 -1 q 583 -1 626 -1 q 519 0 541 0 q 503 22 503 0 q 505 121 503 55 q 507 220 507 186 q 505 314 507 251 q 503 410 503 378 q 387 532 503 532 q 290 494 350 532 q 225 421 225 454 l 225 18 q 211 -1 225 -1 q 148 -1 190 -1 q 85 0 106 0 q 69 18 69 0 l 69 346 q 60 686 69 426 q 49 925 59 767 q 47 936 47 933 q 56 950 47 947 q 132 954 67 954 q 175 959 146 954 q 216 964 203 964 q 225 951 225 964 q 220 760 225 888 q 215 568 215 632 q 220 552 215 553 q 310 623 255 581 q 450 664 376 664 q 626 588 578 664 q 661 412 661 532 q 660 347 661 391 q 659 282 659 303 q 660 153 659 239 q 661 24 661 66 z "
  	},
  	i: {
  		ha: 306,
  		x_min: 58,
  		x_max: 245,
  		o: "m 245 811 q 153 728 245 728 q 58 811 58 728 q 87 873 58 848 q 153 896 115 896 q 218 872 191 896 q 245 811 245 848 m 241 627 q 234 470 241 575 q 228 311 228 364 q 230 163 228 262 q 232 16 232 64 q 220 1 232 1 l 87 1 q 73 29 73 1 q 76 170 73 76 q 78 311 78 264 q 70 470 78 364 q 62 629 62 576 q 77 640 62 640 q 114 637 89 640 q 153 633 140 633 q 191 637 165 633 q 229 640 216 640 q 241 627 241 640 z "
  	},
  	j: {
  		ha: 307,
  		x_min: -31,
  		x_max: 250,
  		o: "m 250 812 q 155 730 250 730 q 90 751 115 730 q 61 812 61 773 q 90 875 61 850 q 155 897 117 897 q 221 875 194 897 q 250 812 250 850 m 241 629 q 237 495 241 585 q 233 359 233 405 q 235 211 233 310 q 236 61 236 111 q 60 -185 236 -134 q -14 -200 9 -200 q -27 -186 -24 -200 q -28 -157 -30 -176 q -26 -135 -26 -132 q -29 -108 -26 -126 q -31 -82 -31 -90 q -22 -68 -31 -70 q 64 -37 45 -56 q 87 54 87 -14 q 85 200 87 103 q 82 346 82 297 q 66 615 82 442 l 66 623 q 78 635 66 632 q 152 642 82 636 q 231 647 222 647 q 241 629 241 647 z "
  	},
  	k: {
  		ha: 760,
  		x_min: 68,
  		x_max: 736,
  		o: "m 736 465 q 572 229 736 289 q 640 104 572 195 q 708 14 708 14 q 640 0 708 3 q 573 -2 595 -2 q 513 18 525 -2 q 412 176 481 73 q 265 186 404 189 l 239 186 l 239 18 q 224 -3 239 -3 q 160 -2 202 -3 q 96 -1 117 -1 q 81 25 81 -1 l 81 447 q 74 694 81 530 q 68 942 68 859 q 81 956 68 954 q 149 958 103 956 q 189 963 158 959 q 228 966 213 966 q 237 950 237 966 q 234 841 237 913 q 231 732 231 768 l 231 557 q 237 543 231 543 q 286 583 253 556 q 503 671 399 671 q 667 619 603 671 q 736 465 736 563 m 572 433 q 447 530 572 530 q 236 406 353 530 l 236 304 q 369 294 291 294 q 503 324 448 294 q 572 433 572 361 z "
  	},
  	l: {
  		ha: 306,
  		x_min: 66,
  		x_max: 241,
  		o: "m 241 941 l 240 932 q 225 498 225 680 q 228 257 225 418 q 231 16 231 96 q 220 0 231 0 l 90 0 q 78 16 78 0 q 79 257 78 96 q 81 498 81 418 q 74 719 81 572 q 66 938 66 865 q 81 951 66 951 q 117 949 93 951 q 154 947 142 947 q 192 949 167 947 q 229 951 217 951 q 241 941 241 951 z "
  	},
  	m: {
  		ha: 1165,
  		x_min: 47,
  		x_max: 1100,
  		o: "m 1100 25 q 1084 -1 1100 -1 q 1054 1 1074 -1 q 1022 3 1033 3 q 987 1 1010 3 q 953 0 964 0 q 939 32 939 0 q 941 125 939 63 q 943 218 943 187 q 942 410 943 390 q 913 506 937 479 q 819 534 887 534 q 723 494 777 534 q 665 410 667 451 q 663 216 663 357 q 665 117 663 183 q 668 17 668 50 q 656 -1 668 -1 q 620 1 644 -1 q 585 3 597 3 q 553 1 574 3 q 521 0 532 0 q 507 20 507 0 q 509 118 507 52 q 511 216 511 183 l 511 379 q 493 488 511 456 q 395 534 467 534 q 293 498 352 534 q 228 419 228 459 l 228 221 q 229 120 228 187 q 229 20 229 53 q 214 0 229 0 l 87 0 q 74 18 74 0 q 75 183 74 73 q 75 349 75 294 q 49 596 75 473 q 47 610 47 605 q 53 621 47 619 q 126 631 78 623 q 193 646 149 637 l 199 646 q 214 598 207 646 q 227 551 221 551 q 260 581 227 551 q 340 635 300 615 q 456 665 398 665 q 654 538 612 665 q 759 627 696 592 q 890 665 825 665 q 1064 592 1016 665 q 1099 420 1099 538 q 1097 351 1099 398 q 1096 282 1096 304 q 1098 154 1096 239 q 1100 25 1100 68 z "
  	},
  	n: {
  		ha: 726,
  		x_min: 43,
  		x_max: 667,
  		o: "m 667 14 q 653 -1 667 -1 q 586 -1 631 -1 q 519 0 542 0 q 507 20 507 0 q 509 121 507 53 q 511 222 511 189 q 511 303 511 250 q 510 385 510 357 q 488 494 510 462 q 387 532 460 532 q 293 494 353 532 q 229 422 229 454 l 229 16 q 216 -1 229 -1 q 151 -1 195 -1 q 86 0 108 0 q 72 16 72 0 q 74 176 72 69 q 75 338 75 283 q 45 604 75 482 q 43 613 43 610 q 52 623 43 620 q 129 635 56 623 q 205 647 202 647 q 211 636 210 647 q 227 551 214 594 q 319 621 262 579 q 457 664 391 664 q 631 590 585 664 q 666 414 666 536 q 665 350 666 393 q 664 285 664 307 q 665 149 664 239 q 667 14 667 59 z "
  	},
  	o: {
  		ha: 710,
  		x_min: 26,
  		x_max: 684,
  		o: "m 684 330 q 591 88 684 189 q 355 -16 496 -16 q 119 87 214 -16 q 26 329 26 187 q 119 570 26 471 q 355 672 215 672 q 590 570 495 672 q 684 330 684 471 m 541 329 q 490 470 541 412 q 355 532 437 532 q 220 471 274 532 q 170 329 170 412 q 221 188 170 248 q 355 125 275 125 q 490 188 436 125 q 541 329 541 248 z "
  	},
  	p: {
  		ha: 783,
  		x_min: 50,
  		x_max: 747,
  		o: "m 747 326 q 661 88 747 189 q 435 -18 570 -18 q 288 34 351 -18 q 231 87 259 60 q 225 77 227 85 q 224 1 224 73 l 224 -191 q 208 -212 224 -212 q 85 -210 104 -212 q 69 -192 69 -208 q 71 68 69 -105 q 72 329 72 242 q 52 628 72 488 q 50 639 50 636 q 57 648 50 646 q 132 656 83 650 q 207 668 199 668 q 222 627 218 668 q 225 574 224 600 q 229 563 225 568 q 240 572 234 566 q 432 669 335 669 q 659 564 566 669 q 747 326 747 463 m 589 329 q 538 472 589 410 q 404 538 484 538 q 275 470 326 538 q 229 328 229 409 q 277 184 229 245 q 410 118 329 118 q 540 186 487 118 q 589 329 589 250 z "
  	},
  	q: {
  		ha: 778,
  		x_min: 37,
  		x_max: 728,
  		o: "m 728 642 q 726 629 728 640 q 701 241 701 500 q 706 27 701 170 q 710 -187 710 -116 q 696 -204 710 -204 q 629 -207 673 -204 q 563 -209 585 -209 q 555 -193 555 -209 l 555 75 q 551 86 555 86 q 538 75 545 83 q 340 -17 460 -17 q 121 92 210 -17 q 37 326 37 193 q 118 566 37 466 q 340 673 204 673 q 502 624 437 673 q 555 572 528 598 q 559 663 559 574 q 571 669 559 669 q 720 652 626 669 q 728 642 728 650 m 557 330 q 510 477 557 417 q 375 542 459 542 q 241 477 294 542 q 191 334 191 416 q 242 189 191 249 q 379 125 296 125 q 513 186 464 125 q 557 330 557 243 z "
  	},
  	r: {
  		ha: 463,
  		x_min: 41,
  		x_max: 457,
  		o: "m 457 637 q 447 501 457 562 q 433 486 445 486 q 390 489 419 486 q 347 492 361 492 q 237 444 261 492 q 223 322 223 414 l 223 248 q 226 132 223 210 q 229 17 229 55 q 214 -1 229 -1 q 150 -1 193 -1 q 86 0 107 0 q 71 17 71 0 q 72 182 71 72 q 74 349 74 293 q 43 618 74 516 q 41 626 41 623 q 50 637 41 634 q 121 646 75 640 q 189 659 194 659 q 203 619 199 659 q 215 579 206 579 q 218 581 216 579 q 274 616 246 598 q 336 643 304 634 q 404 651 363 651 q 457 637 457 651 z "
  	},
  	s: {
  		ha: 415,
  		x_min: 31,
  		x_max: 387,
  		o: "m 387 209 q 306 47 387 108 q 127 -9 233 -9 q 81 -7 87 -9 q 70 26 70 -1 q 66 71 70 41 q 62 115 62 101 q 75 127 62 124 q 100 127 83 129 q 120 125 121 125 q 248 203 248 125 q 192 272 248 241 q 87 334 100 322 q 31 460 31 382 q 107 618 31 562 q 282 669 176 669 q 296 661 292 669 q 313 606 300 652 q 326 550 326 559 q 313 541 326 543 q 225 529 269 534 q 173 472 173 515 q 228 410 173 441 q 331 345 309 365 q 387 209 387 292 z "
  	},
  	t: {
  		ha: 475,
  		x_min: 5,
  		x_max: 447,
  		o: "m 447 125 q 444 84 447 110 q 440 43 441 52 q 438 28 439 31 q 425 18 435 23 q 250 -8 370 -8 q 92 136 92 -8 q 94 309 92 193 q 97 482 97 425 q 69 512 97 510 q 20 513 44 512 q 5 568 5 516 q 8 610 5 588 q 30 629 10 626 q 63 630 47 629 q 94 658 94 631 q 93 741 94 685 q 91 824 91 796 q 110 873 91 873 q 237 852 116 873 q 253 838 253 850 q 249 748 253 808 q 244 659 244 688 q 262 639 244 639 l 425 639 q 437 631 437 639 q 434 605 437 623 q 432 578 432 587 q 433 547 432 568 q 433 515 433 526 q 414 503 433 503 q 332 506 387 503 q 250 510 277 510 q 242 471 245 510 q 239 336 239 423 l 239 235 q 250 154 239 177 q 317 119 266 119 q 378 128 338 119 q 439 137 419 137 q 447 125 447 137 z "
  	},
  	u: {
  		ha: 766,
  		x_min: 65,
  		x_max: 697,
  		o: "m 697 615 q 693 466 697 566 q 689 315 689 366 q 692 167 689 266 q 695 19 695 68 q 682 1 695 5 q 545 0 677 0 q 535 51 536 0 q 527 102 533 102 q 517 96 524 102 q 293 -3 404 -3 q 95 106 143 -3 q 65 347 65 173 q 90 614 65 505 q 113 640 96 640 q 172 640 132 640 q 231 639 211 639 q 244 624 244 639 q 235 536 244 597 q 225 443 226 470 q 223 353 223 402 q 240 194 223 235 q 370 121 269 121 q 471 163 412 121 q 534 248 532 207 q 538 606 538 298 q 566 639 538 639 l 677 639 q 697 615 697 639 z "
  	},
  	v: {
  		ha: 703,
  		x_min: 45,
  		x_max: 654,
  		o: "m 654 449 q 648 338 654 353 q 538 159 638 307 q 416 0 436 8 q 359 -4 407 -4 q 300 0 314 -4 q 176 153 281 6 q 61 328 73 296 q 45 460 45 370 q 46 543 45 488 q 47 627 47 599 q 62 642 47 642 q 129 640 85 642 q 196 637 174 637 q 208 624 208 637 q 205 560 208 602 q 203 496 203 517 q 210 382 203 433 q 278 256 213 356 q 359 155 344 155 q 433 254 374 155 q 496 375 492 350 q 501 492 501 409 q 497 559 501 514 q 492 626 492 604 q 503 636 492 636 q 568 638 525 636 q 633 641 612 641 q 654 449 654 641 z "
  	},
  	w: {
  		ha: 1013,
  		x_min: 35,
  		x_max: 979,
  		o: "m 979 486 q 965 326 979 359 q 865 148 946 281 q 758 -1 777 3 q 704 -3 753 -3 q 665 -1 671 -3 q 504 232 644 4 q 426 104 465 168 q 345 -1 362 3 q 300 -3 339 -3 q 254 -1 260 -3 q 148 146 233 3 q 50 326 67 281 q 35 486 35 367 q 41 623 35 586 q 58 637 45 637 q 119 636 79 637 q 180 635 160 635 q 193 614 193 635 q 192 569 193 599 q 191 524 191 538 q 197 357 191 406 q 304 178 203 314 q 318 161 316 161 q 330 176 320 161 q 431 351 418 304 q 439 497 439 384 q 436 566 439 520 q 433 633 433 611 q 446 648 433 648 l 575 648 q 586 631 586 648 q 584 565 586 609 q 582 500 582 522 q 586 361 582 380 q 650 255 590 342 q 718 167 709 167 q 730 183 720 167 q 823 358 817 314 q 829 482 829 395 q 825 556 829 508 q 821 626 821 605 q 835 636 821 636 q 895 637 855 636 q 956 639 935 639 q 974 625 970 639 q 979 486 979 599 z "
  	},
  	x: {
  		ha: 603,
  		x_min: 26,
  		x_max: 578,
  		o: "m 578 12 q 564 -1 578 3 q 534 -1 553 -3 q 510 0 507 0 q 446 12 456 0 q 319 193 404 74 q 301 215 303 215 q 225 111 295 215 q 139 3 154 5 q 43 0 124 0 q 26 12 26 0 l 26 86 q 117 203 26 94 q 207 323 207 312 q 117 441 207 333 q 26 561 26 550 l 26 633 q 43 647 26 647 q 94 644 60 647 q 144 642 127 642 q 161 632 154 642 q 283 450 201 570 q 301 428 300 428 q 316 446 303 428 q 446 635 355 499 q 461 644 452 644 q 511 646 478 644 q 561 647 545 647 q 578 633 578 647 l 578 562 q 487 441 578 550 q 397 322 397 333 q 487 206 397 315 q 578 85 578 97 l 578 12 z "
  	},
  	y: {
  		ha: 661,
  		x_min: 24,
  		x_max: 640,
  		o: "m 640 472 q 633 334 640 357 q 466 67 625 303 q 277 -196 307 -168 q 102 -220 250 -220 q 79 -217 84 -220 q 56 -168 74 -213 q 38 -113 38 -122 q 74 -98 38 -98 q 186 -77 150 -98 q 223 -30 198 -69 q 248 23 248 9 q 149 166 248 41 q 33 334 45 298 q 24 467 24 361 q 24 544 24 492 q 25 623 25 596 q 41 637 25 637 q 105 635 63 637 q 170 632 148 632 q 180 618 180 632 q 178 561 180 599 q 176 504 176 523 q 182 380 176 421 q 256 252 186 355 q 342 150 326 150 q 415 251 353 150 q 481 375 477 351 q 486 498 486 409 q 482 556 486 518 q 478 614 478 595 q 489 631 478 631 q 554 634 511 631 q 620 637 598 637 q 640 472 640 637 z "
  	},
  	z: {
  		ha: 585,
  		x_min: 21,
  		x_max: 572,
  		o: "m 572 129 q 562 81 572 125 q 550 21 551 33 q 538 -3 547 -3 q 474 0 514 -3 q 411 4 429 3 q 281 5 366 5 q 135 0 215 5 q 49 -7 35 -7 q 31 5 35 -7 q 21 81 21 38 q 22 99 21 87 q 22 115 22 110 q 37 138 22 125 q 182 292 52 151 q 368 503 248 360 l 69 503 q 58 517 58 503 q 67 575 58 536 q 75 633 75 614 q 94 642 75 642 q 208 638 132 642 q 321 635 283 635 q 530 632 507 635 q 547 618 547 630 q 539 503 547 515 q 422 369 532 493 q 207 129 351 288 q 557 135 433 135 q 572 129 572 135 z "
  	},
  	"{": {
  		ha: 473,
  		x_min: 33,
  		x_max: 457,
  		o: "m 457 -204 q 447 -210 457 -207 q 336 -221 410 -221 q 179 -198 231 -221 q 102 -71 102 -163 q 123 31 102 -37 q 151 136 148 105 q 155 201 155 174 q 114 298 155 276 q 46 315 83 315 q 33 329 33 315 q 36 351 33 336 q 39 372 39 365 q 36 393 39 379 q 33 414 33 407 q 62 431 33 425 q 114 444 102 437 q 155 544 155 469 q 128 681 155 591 q 102 814 102 770 q 179 941 102 906 q 336 964 231 964 q 447 954 422 964 q 457 940 457 950 q 454 894 457 926 q 450 846 450 863 q 437 833 450 833 q 383 840 425 833 q 318 847 341 847 q 258 791 258 847 q 277 685 258 755 q 297 579 297 615 q 263 438 297 492 q 140 372 222 372 q 297 174 297 372 q 277 57 297 135 q 257 -56 257 -22 q 326 -111 257 -111 q 437 -93 376 -111 q 444 -92 441 -92 q 452 -106 450 -92 q 453 -135 454 -117 q 452 -157 452 -159 q 454 -180 452 -165 q 457 -204 457 -196 z "
  	},
  	"|": {
  		ha: 340,
  		x_min: 107,
  		x_max: 232,
  		o: "m 232 -64 q 224 -79 232 -77 q 119 -95 150 -95 q 114 -82 114 -95 l 114 439 q 111 685 114 521 q 107 930 107 849 q 181 963 107 965 l 211 962 q 225 945 224 962 q 225 873 227 918 q 223 802 223 813 l 224 456 q 228 196 224 380 q 232 -64 232 25 z "
  	},
  	"}": {
  		ha: 473,
  		x_min: 21,
  		x_max: 444,
  		o: "m 444 329 q 432 315 444 315 q 364 298 394 315 q 323 201 323 276 q 326 136 323 174 q 354 31 330 105 q 376 -71 376 -37 q 298 -198 376 -163 q 142 -221 247 -221 q 31 -210 68 -221 q 21 -204 21 -207 q 24 -180 21 -196 q 26 -157 26 -165 q 26 -131 26 -148 q 25 -104 25 -113 q 34 -92 25 -92 q 40 -93 35 -92 q 151 -111 117 -111 q 220 -56 220 -111 q 200 57 220 -22 q 180 174 180 135 q 338 372 180 372 q 215 438 256 372 q 180 579 180 492 q 200 685 180 615 q 220 791 220 755 q 160 847 220 847 q 95 840 137 847 q 40 833 54 833 q 28 846 28 833 q 24 894 28 863 q 21 940 21 926 q 31 954 21 950 q 142 964 56 964 q 298 941 246 964 q 376 814 376 906 q 350 681 376 770 q 323 544 323 591 q 364 444 323 469 q 415 431 376 437 q 444 414 444 425 q 441 393 444 407 q 439 372 439 379 q 441 351 439 365 q 444 329 444 336 z "
  	},
  	"~": {
  		ha: 676,
  		x_min: 22,
  		x_max: 665,
  		o: "m 665 419 q 570 350 665 405 q 440 309 496 309 q 342 334 398 309 q 258 359 286 359 q 177 325 232 359 q 119 290 123 290 q 77 336 115 290 q 27 390 33 385 q 22 399 22 395 q 125 472 22 411 q 246 515 197 515 q 334 488 284 515 q 416 461 384 461 q 515 498 454 461 q 576 535 576 535 q 624 480 582 535 q 665 419 665 426 z "
  	},
  	"Ä": {
  		ha: 916,
  		x_min: 6,
  		x_max: 909,
  		o: "m 909 8 q 893 0 909 0 q 856 2 880 0 q 818 4 831 4 q 779 2 805 4 q 741 0 753 0 q 692 103 722 0 q 632 207 663 205 q 501 208 607 208 l 394 208 q 267 207 282 208 q 215 102 242 205 q 172 0 187 0 l 20 0 q 6 9 6 0 q 16 40 6 16 l 182 494 q 309 811 203 549 q 361 942 328 854 q 378 968 369 968 q 416 964 391 968 q 454 961 441 961 q 491 965 467 961 q 528 968 516 968 q 545 943 534 968 q 705 534 561 905 q 909 8 909 13 m 593 382 q 532 559 593 402 q 449 758 473 711 q 309 383 309 400 q 360 356 309 360 q 427 355 363 355 l 496 355 q 593 382 593 355 m 668 1017 q 644 1005 668 1005 q 583 1004 623 1005 q 524 1004 543 1004 q 507 1023 507 1004 l 506 1161 q 519 1178 506 1178 q 555 1176 531 1178 q 591 1174 579 1174 q 621 1175 602 1174 q 650 1175 641 1175 q 667 1164 667 1175 q 664 1126 667 1152 q 661 1088 661 1101 q 665 1052 661 1076 q 668 1017 668 1028 m 391 1013 q 371 1004 391 1006 q 332 1004 357 1002 q 304 1006 302 1006 q 273 1004 294 1006 q 242 1003 252 1003 q 229 1016 229 1003 q 231 1048 229 1027 q 232 1080 232 1069 q 230 1121 232 1093 q 228 1162 228 1148 q 244 1177 228 1177 q 306 1176 264 1177 q 369 1175 348 1175 q 389 1161 389 1175 q 387 1124 389 1149 q 385 1086 385 1099 q 388 1050 385 1074 q 391 1013 391 1025 z "
  	},
  	"Å": {
  		ha: 916,
  		x_min: 6,
  		x_max: 909,
  		o: "m 909 8 q 893 0 909 0 q 856 2 880 0 q 818 4 831 4 q 779 2 805 4 q 741 0 753 0 q 692 103 721 0 q 632 207 663 205 q 493 208 608 208 l 399 208 q 267 207 282 208 q 215 102 242 205 q 172 0 187 0 l 20 0 q 6 9 6 0 q 16 40 6 16 l 182 494 q 310 819 231 606 q 267 930 267 873 q 320 1058 267 1006 q 449 1111 373 1111 q 577 1058 524 1111 q 631 930 631 1006 q 590 827 631 879 q 766 382 635 716 q 909 8 909 15 m 522 930 q 501 986 522 963 q 449 1010 480 1010 q 396 986 417 1010 q 375 930 375 963 q 397 879 375 901 q 447 857 418 857 q 500 878 478 857 q 522 930 522 899 m 593 382 q 532 559 593 402 q 449 758 473 711 q 309 383 309 400 q 360 356 309 360 q 427 355 363 355 l 496 355 q 593 382 593 355 z "
  	},
  	"Ç": {
  		ha: 823,
  		x_min: 39,
  		x_max: 819,
  		o: "m 819 157 q 806 134 819 149 q 478 -20 673 -20 q 153 129 275 -20 q 39 475 39 267 q 155 822 39 682 q 481 972 278 972 q 799 833 686 972 q 810 810 810 819 q 774 742 810 798 q 730 685 738 685 q 689 718 722 685 q 614 779 649 759 q 485 812 555 812 q 276 710 351 812 q 210 479 210 618 q 275 247 210 340 q 484 142 350 142 q 612 175 550 142 q 694 237 652 197 q 733 270 730 270 q 778 216 737 270 q 819 157 819 162 m 565 -77 q 516 -219 565 -165 q 377 -275 465 -275 q 309 -254 352 -275 q 264 -213 264 -233 q 298 -170 264 -211 q 336 -128 333 -128 q 338 -129 337 -128 q 399 -158 368 -158 q 443 -138 424 -158 q 461 -93 461 -117 q 430 -18 461 -52 l 522 -20 q 565 -77 536 -38 z "
  	},
  	"É": {
  		ha: 747,
  		x_min: 68,
  		x_max: 713,
  		o: "m 713 136 q 707 105 713 125 q 700 74 701 79 q 690 3 698 50 q 673 -9 687 -9 q 647 -7 666 -9 q 389 5 564 5 q 239 3 339 5 q 90 0 140 0 q 68 20 68 0 q 76 248 68 96 q 85 476 85 400 q 77 764 85 553 q 69 926 75 819 l 68 936 q 86 951 68 951 q 229 949 134 951 q 371 946 323 946 q 507 949 416 946 q 643 951 597 951 q 677 932 675 951 q 692 821 692 842 q 677 805 692 805 q 502 811 619 805 q 326 818 385 818 q 256 803 271 818 q 241 729 241 788 l 241 628 q 243 580 241 587 q 279 559 250 559 q 302 559 287 559 q 325 559 317 559 q 564 564 458 559 q 661 571 605 566 q 675 559 675 572 q 670 492 675 537 q 665 425 665 448 q 645 413 665 413 q 585 418 637 413 q 414 422 547 422 q 272 419 302 422 q 241 391 245 417 q 241 338 241 395 l 241 238 q 263 150 241 168 q 348 136 280 136 l 422 136 q 689 153 470 136 l 699 153 q 713 136 713 155 m 584 1151 q 434 1048 574 1123 q 265 974 298 974 q 244 1008 253 974 q 237 1053 237 1034 q 250 1065 237 1059 q 482 1213 362 1121 q 492 1219 485 1215 q 501 1213 496 1217 q 576 1160 530 1188 q 584 1151 580 1158 z "
  	},
  	"Ñ": {
  		ha: 997,
  		x_min: 71,
  		x_max: 924,
  		o: "m 924 937 q 918 701 924 859 q 913 465 913 544 q 914 244 913 391 q 916 22 916 96 q 899 0 916 0 q 868 2 888 0 q 838 4 848 4 q 804 2 827 4 q 771 0 782 0 q 742 22 759 0 q 298 611 595 220 q 244 677 252 671 q 237 650 237 677 q 241 336 237 545 q 244 22 244 127 q 231 0 244 0 q 195 2 219 0 q 160 4 172 4 q 124 2 148 4 q 87 0 100 0 q 71 14 71 0 q 78 238 71 88 q 85 464 85 389 q 79 760 85 546 q 72 926 77 815 l 71 935 q 87 946 71 945 q 157 949 132 947 q 193 954 166 949 q 228 958 215 958 q 249 939 234 958 q 726 301 405 724 q 753 271 741 283 q 758 401 758 299 q 751 665 758 489 q 745 929 745 842 q 758 951 745 951 q 795 949 770 951 q 832 947 820 947 q 871 949 845 947 q 909 951 897 951 q 924 937 924 951 m 725 1037 q 667 989 725 1021 q 581 957 608 957 q 500 981 541 957 q 439 1004 459 1004 q 391 982 416 1004 q 362 960 366 960 q 349 966 354 960 q 289 1024 289 1025 q 290 1029 289 1026 q 348 1084 300 1057 q 425 1109 393 1109 q 508 1086 458 1109 q 579 1064 558 1064 q 627 1088 592 1064 q 668 1112 663 1112 l 675 1109 q 725 1037 725 1058 z "
  	},
  	"Ö": {
  		ha: 1007,
  		x_min: 41,
  		x_max: 966,
  		o: "m 966 476 q 838 130 966 275 q 504 -21 703 -21 q 170 129 304 -21 q 41 476 41 273 q 172 823 41 677 q 504 974 306 974 q 837 823 703 974 q 966 476 966 677 m 803 478 q 720 709 803 611 q 503 814 633 814 q 287 708 373 814 q 205 476 205 609 q 287 245 205 344 q 503 139 373 139 q 721 245 634 139 q 803 478 803 344 m 713 1032 q 688 1021 713 1021 q 628 1020 668 1021 q 568 1019 588 1019 q 551 1038 551 1019 l 551 1177 q 564 1194 551 1194 q 600 1192 576 1194 q 636 1190 624 1190 q 666 1190 646 1190 q 695 1191 686 1191 q 711 1180 711 1191 q 709 1142 711 1167 q 706 1103 706 1116 q 709 1067 706 1091 q 713 1032 713 1044 m 435 1029 q 416 1019 435 1021 q 376 1019 401 1018 q 349 1021 347 1021 q 318 1020 338 1021 q 287 1019 297 1019 q 274 1031 274 1019 q 275 1063 274 1042 q 277 1095 277 1084 q 275 1136 277 1109 q 273 1177 273 1164 q 289 1192 273 1192 q 351 1192 309 1192 q 413 1191 393 1191 q 434 1177 434 1191 q 432 1139 434 1164 q 429 1102 429 1114 q 432 1065 429 1090 q 435 1029 435 1041 z "
  	},
  	"Ü": {
  		ha: 917,
  		x_min: 68,
  		x_max: 848,
  		o: "m 848 937 q 841 701 848 858 q 835 465 835 544 q 836 388 835 439 q 836 312 836 337 q 810 115 836 170 q 652 1 769 31 q 449 -17 580 -17 q 138 62 212 -17 q 81 306 81 123 q 81 381 81 328 q 82 465 82 435 q 75 760 82 545 q 69 926 75 816 q 68 937 68 935 q 86 951 68 951 q 161 951 114 951 q 236 950 216 950 q 252 938 252 950 q 247 628 252 835 q 243 318 243 421 q 295 160 243 201 q 460 123 340 123 q 615 153 569 123 q 673 293 673 191 q 670 615 673 400 q 667 937 667 829 q 686 950 667 947 q 727 950 701 952 q 757 947 758 947 q 794 949 769 947 q 831 951 819 951 q 848 937 848 951 m 675 1032 q 650 1021 675 1021 q 590 1020 630 1021 q 530 1019 550 1019 q 513 1038 513 1019 l 513 1177 q 526 1194 513 1194 q 562 1192 538 1194 q 598 1190 586 1190 q 628 1190 608 1190 q 657 1191 648 1191 q 673 1180 673 1191 q 671 1142 673 1167 q 668 1103 668 1116 q 671 1067 668 1091 q 675 1032 675 1044 m 397 1029 q 378 1019 397 1021 q 338 1019 363 1018 q 311 1021 309 1021 q 280 1020 300 1021 q 249 1019 259 1019 q 236 1031 236 1019 q 237 1063 236 1042 q 239 1095 239 1084 q 237 1136 239 1109 q 235 1177 235 1164 q 251 1192 235 1192 q 313 1192 271 1192 q 375 1191 355 1191 q 396 1177 396 1191 q 394 1139 396 1164 q 391 1102 391 1114 q 394 1065 391 1090 q 397 1029 397 1041 z "
  	},
  	"á": {
  		ha: 770,
  		x_min: 29,
  		x_max: 728,
  		o: "m 728 614 q 726 602 728 611 q 700 334 700 446 q 717 29 700 327 l 718 20 q 700 0 718 0 q 643 -4 681 0 q 587 -9 606 -9 q 568 39 574 -9 q 555 86 561 86 q 518 60 551 86 q 444 10 478 27 q 336 -17 390 -17 q 115 88 205 -17 q 29 322 29 189 q 115 571 29 473 q 353 673 205 673 q 534 602 456 673 q 570 562 545 588 q 574 560 572 560 q 585 603 578 560 q 604 646 593 646 q 673 635 623 646 q 728 614 728 623 m 555 330 q 506 473 555 414 q 372 538 454 538 q 237 474 291 538 q 184 330 184 413 q 237 188 184 248 q 372 125 291 125 q 505 189 452 125 q 555 330 555 250 m 608 897 q 458 793 597 869 q 289 720 321 720 q 268 753 277 720 q 261 798 261 780 q 274 811 261 805 q 506 958 386 867 q 516 964 509 961 q 525 958 519 963 q 600 905 554 934 q 608 897 604 903 z "
  	},
  	"à": {
  		ha: 770,
  		x_min: 29,
  		x_max: 728,
  		o: "m 728 614 q 726 602 728 611 q 700 334 700 446 q 717 29 700 327 l 718 20 q 700 0 718 0 q 643 -4 681 0 q 587 -9 606 -9 q 568 39 574 -9 q 555 86 561 86 q 518 60 551 86 q 444 10 478 27 q 336 -17 390 -17 q 115 88 205 -17 q 29 322 29 189 q 115 571 29 473 q 353 673 205 673 q 534 602 456 673 q 570 562 545 588 q 574 560 572 560 q 585 603 578 560 q 604 646 593 646 q 673 635 623 646 q 728 614 728 623 m 555 330 q 506 473 555 414 q 372 538 454 538 q 237 474 291 538 q 184 330 184 413 q 237 188 184 248 q 372 125 291 125 q 505 189 452 125 q 555 330 555 250 m 532 797 q 523 762 532 791 q 510 733 513 733 q 498 732 495 733 q 184 895 261 843 q 178 903 182 897 q 217 945 184 915 q 262 975 251 975 q 387 906 278 975 q 528 810 486 843 q 532 797 534 806 z "
  	},
  	"â": {
  		ha: 770,
  		x_min: 29,
  		x_max: 728,
  		o: "m 728 614 q 726 602 728 611 q 700 334 700 446 q 717 29 700 327 l 718 20 q 700 0 718 0 q 643 -4 681 0 q 587 -9 606 -9 q 568 39 574 -9 q 555 86 561 86 q 518 60 551 86 q 444 10 478 27 q 336 -17 390 -17 q 115 88 205 -17 q 29 322 29 189 q 115 571 29 473 q 353 673 205 673 q 534 602 456 673 q 570 562 545 588 q 574 560 572 560 q 585 603 578 560 q 604 646 593 646 q 673 635 623 646 q 728 614 728 623 m 555 330 q 506 473 555 414 q 372 538 454 538 q 237 474 291 538 q 184 330 184 413 q 237 188 184 248 q 372 125 291 125 q 505 189 452 125 q 555 330 555 250 m 568 768 q 533 749 566 765 q 495 733 501 733 q 368 844 475 733 q 311 783 361 840 q 250 734 269 734 q 211 750 244 734 q 177 769 177 767 q 268 878 215 812 q 322 970 307 936 q 337 981 327 981 l 408 981 q 420 970 417 981 q 473 878 431 935 q 568 768 520 824 z "
  	},
  	"ä": {
  		ha: 770,
  		x_min: 29,
  		x_max: 728,
  		o: "m 728 614 q 726 602 728 611 q 700 334 700 446 q 717 29 700 327 l 718 20 q 700 0 718 0 q 643 -4 681 0 q 587 -9 606 -9 q 568 39 574 -9 q 555 86 561 86 q 518 60 551 86 q 444 10 478 27 q 336 -17 390 -17 q 115 88 205 -17 q 29 322 29 189 q 115 571 29 473 q 353 673 205 673 q 534 602 456 673 q 570 562 545 588 q 574 560 572 560 q 585 603 578 560 q 604 646 593 646 q 673 635 623 646 q 728 614 728 623 m 555 330 q 506 473 555 414 q 372 538 454 538 q 237 474 291 538 q 184 330 184 413 q 237 188 184 248 q 372 125 291 125 q 505 189 452 125 q 555 330 555 250 m 581 747 q 556 735 581 735 q 496 734 536 735 q 436 734 456 734 q 419 753 419 734 l 418 891 q 432 908 418 908 q 468 906 444 908 q 504 904 492 904 q 534 905 514 904 q 563 905 553 905 q 579 895 579 905 q 576 856 579 882 q 574 818 574 831 q 577 782 574 806 q 581 747 581 758 m 303 743 q 283 734 303 736 q 244 734 269 732 q 216 736 214 736 q 185 734 206 736 q 155 733 165 733 q 142 746 142 733 q 143 778 142 757 q 144 810 144 799 q 142 851 144 823 q 140 892 140 878 q 157 907 140 907 q 219 906 177 907 q 281 905 260 905 q 302 891 302 905 q 299 854 302 879 q 297 817 297 829 q 300 780 297 804 q 303 743 303 755 z "
  	},
  	"ã": {
  		ha: 770,
  		x_min: 29,
  		x_max: 728,
  		o: "m 728 614 q 726 602 728 611 q 700 334 700 446 q 717 29 700 327 l 718 20 q 700 0 718 0 q 643 -4 681 0 q 587 -9 606 -9 q 568 39 574 -9 q 555 86 561 86 q 518 60 551 86 q 444 10 478 27 q 336 -17 390 -17 q 115 88 205 -17 q 29 322 29 189 q 115 571 29 473 q 353 673 205 673 q 534 602 456 673 q 570 562 545 588 q 574 560 572 560 q 585 603 578 560 q 604 646 593 646 q 673 635 623 646 q 728 614 728 623 m 555 330 q 506 473 555 414 q 372 538 454 538 q 237 474 291 538 q 184 330 184 413 q 237 188 184 248 q 372 125 291 125 q 505 189 452 125 q 555 330 555 250 m 590 817 q 532 769 590 801 q 446 737 473 737 q 365 761 406 737 q 304 785 324 785 q 256 762 281 785 q 227 740 231 740 q 214 746 219 740 q 154 804 154 806 q 155 810 154 806 q 213 864 165 838 q 290 889 258 889 q 373 867 323 889 q 444 844 423 844 q 492 868 457 844 q 533 892 528 892 l 540 889 q 590 817 590 838 z "
  	},
  	"å": {
  		ha: 770,
  		x_min: 29,
  		x_max: 728,
  		o: "m 728 614 q 726 602 728 611 q 700 334 700 446 q 717 29 700 327 l 718 20 q 700 0 718 0 q 643 -4 681 0 q 587 -9 606 -9 q 568 39 574 -9 q 555 86 561 86 q 518 60 551 86 q 444 10 478 27 q 336 -17 390 -17 q 115 88 205 -17 q 29 322 29 189 q 115 571 29 473 q 353 673 205 673 q 534 602 456 673 q 570 562 545 588 q 574 560 572 560 q 585 603 578 560 q 604 646 593 646 q 673 635 623 646 q 728 614 728 623 m 555 330 q 506 473 555 414 q 372 538 454 538 q 237 474 291 538 q 184 330 184 413 q 237 188 184 248 q 372 125 291 125 q 505 189 452 125 q 555 330 555 250 m 542 884 q 494 771 542 818 q 379 725 446 725 q 266 771 313 725 q 218 884 218 818 q 265 998 218 951 q 379 1046 312 1046 q 494 998 447 1046 q 542 884 542 951 m 461 884 q 438 945 461 920 q 379 971 415 971 q 320 945 344 971 q 297 884 297 920 q 321 826 297 851 q 378 802 346 802 q 436 826 412 802 q 461 884 461 850 z "
  	},
  	"ç": {
  		ha: 558,
  		x_min: 26,
  		x_max: 543,
  		o: "m 543 615 q 527 549 543 600 q 505 497 511 497 q 444 524 475 511 q 376 538 413 538 q 237 476 293 538 q 182 330 182 414 q 237 187 182 248 q 376 125 294 125 q 466 147 422 125 q 505 170 510 170 q 524 113 513 170 q 534 41 534 61 q 455 0 534 20 q 357 -17 389 -17 q 121 87 217 -17 q 26 330 26 189 q 119 574 26 474 q 355 677 214 677 q 529 629 450 677 q 543 615 543 621 m 427 -68 q 378 -211 427 -157 q 239 -267 327 -267 q 171 -246 214 -267 q 125 -205 125 -224 q 160 -161 125 -203 q 198 -120 195 -120 q 200 -121 199 -120 q 261 -150 230 -150 q 304 -130 286 -150 q 323 -85 323 -109 q 292 -10 323 -44 l 383 -12 q 427 -68 398 -30 z "
  	},
  	"é": {
  		ha: 669,
  		x_min: 26,
  		x_max: 644,
  		o: "m 644 364 q 600 297 644 314 q 180 257 571 286 q 246 155 189 197 q 363 115 300 115 q 559 184 470 115 q 581 202 570 193 q 588 201 587 202 q 614 154 590 199 q 637 104 637 108 q 627 89 637 100 q 371 -17 527 -17 q 120 77 214 -17 q 26 328 26 171 q 116 571 26 467 q 347 679 210 679 q 560 585 475 679 q 644 364 644 494 m 482 406 q 438 505 482 462 q 338 549 393 549 q 227 498 275 549 q 178 386 178 448 q 203 372 178 372 q 443 392 303 372 q 482 406 482 397 m 548 897 q 398 793 538 869 q 229 720 262 720 q 208 753 217 720 q 201 798 201 780 q 214 811 201 805 q 446 958 326 867 q 456 964 449 961 q 465 958 460 963 q 541 905 494 934 q 548 897 544 903 z "
  	},
  	"è": {
  		ha: 669,
  		x_min: 26,
  		x_max: 644,
  		o: "m 644 364 q 600 297 644 314 q 180 257 571 286 q 246 155 189 197 q 363 115 300 115 q 559 184 470 115 q 581 202 570 193 q 588 201 587 202 q 614 154 590 199 q 637 104 637 108 q 627 89 637 100 q 371 -17 527 -17 q 120 77 214 -17 q 26 328 26 171 q 116 571 26 467 q 347 679 210 679 q 560 585 475 679 q 644 364 644 494 m 482 406 q 438 505 482 462 q 338 549 393 549 q 227 498 275 549 q 178 386 178 448 q 203 372 178 372 q 443 392 303 372 q 482 406 482 397 m 496 797 q 487 762 496 791 q 474 733 477 733 q 463 732 459 733 q 149 895 225 843 q 142 903 146 897 q 181 945 148 915 q 226 975 215 975 q 351 906 242 975 q 492 810 450 843 q 496 797 498 806 z "
  	},
  	"ê": {
  		ha: 669,
  		x_min: 26,
  		x_max: 644,
  		o: "m 644 364 q 600 297 644 314 q 180 257 571 286 q 246 155 189 197 q 363 115 300 115 q 559 184 470 115 q 581 202 570 193 q 588 201 587 202 q 614 154 590 199 q 637 104 637 108 q 627 89 637 100 q 371 -17 527 -17 q 120 77 214 -17 q 26 328 26 171 q 116 571 26 467 q 347 679 210 679 q 560 585 475 679 q 644 364 644 494 m 482 406 q 438 505 482 462 q 338 549 393 549 q 227 498 275 549 q 178 386 178 448 q 203 372 178 372 q 443 392 303 372 q 482 406 482 397 m 528 768 q 493 749 526 765 q 455 733 461 733 q 328 844 435 733 q 271 783 321 840 q 210 734 229 734 q 171 750 204 734 q 137 769 137 767 q 228 878 175 812 q 282 970 267 936 q 297 981 287 981 l 368 981 q 380 970 377 981 q 433 878 391 935 q 528 768 480 824 z "
  	},
  	"ë": {
  		ha: 669,
  		x_min: 26,
  		x_max: 644,
  		o: "m 644 364 q 600 297 644 314 q 180 257 571 286 q 246 155 189 197 q 363 115 300 115 q 559 184 470 115 q 581 202 570 193 q 588 201 587 202 q 614 154 590 199 q 637 104 637 108 q 627 89 637 100 q 371 -17 527 -17 q 120 77 214 -17 q 26 328 26 171 q 116 571 26 467 q 347 679 210 679 q 560 585 475 679 q 644 364 644 494 m 482 406 q 438 505 482 462 q 338 549 393 549 q 227 498 275 549 q 178 386 178 448 q 203 372 178 372 q 443 392 303 372 q 482 406 482 397 m 558 747 q 534 735 558 735 q 473 734 513 735 q 414 734 433 734 q 397 753 397 734 l 396 891 q 410 908 396 908 q 445 906 421 908 q 481 904 469 904 q 511 905 492 904 q 541 905 531 905 q 557 895 557 905 q 554 856 557 882 q 551 818 551 831 q 555 782 551 806 q 558 747 558 758 m 281 743 q 261 734 281 736 q 222 734 247 732 q 194 736 192 736 q 163 734 184 736 q 132 733 142 733 q 119 746 119 733 q 121 778 119 757 q 122 810 122 799 q 120 851 122 823 q 118 892 118 878 q 134 907 118 907 q 196 906 155 907 q 259 905 238 905 q 279 891 279 905 q 277 854 279 879 q 275 817 275 829 q 278 780 275 804 q 281 743 281 755 z "
  	},
  	"í": {
  		ha: 306,
  		x_min: 15,
  		x_max: 361,
  		o: "m 241 627 q 234 470 241 575 q 228 311 228 364 q 230 163 228 262 q 232 16 232 64 q 220 1 232 1 l 87 1 q 73 29 73 1 q 76 170 73 76 q 78 311 78 264 q 70 470 78 364 q 62 629 62 576 q 77 640 62 640 q 114 637 89 640 q 153 633 140 633 q 191 637 165 633 q 229 640 216 640 q 241 627 241 640 m 361 897 q 212 793 351 869 q 43 720 75 720 q 22 753 31 720 q 15 798 15 780 q 28 811 15 805 q 260 958 140 867 q 270 964 262 961 q 279 958 273 963 q 354 905 308 934 q 361 897 357 903 z "
  	},
  	"ì": {
  		ha: 306,
  		x_min: -66,
  		x_max: 290,
  		o: "m 241 627 q 234 470 241 575 q 228 311 228 364 q 230 163 228 262 q 232 16 232 64 q 220 1 232 1 l 87 1 q 73 29 73 1 q 76 170 73 76 q 78 311 78 264 q 70 470 78 364 q 62 629 62 576 q 77 640 62 640 q 114 637 89 640 q 153 633 140 633 q 191 637 165 633 q 229 640 216 640 q 241 627 241 640 m 289 797 q 279 762 289 791 q 267 733 270 733 q 255 732 252 733 q -59 895 18 843 q -66 903 -62 897 q -26 945 -60 915 q 18 975 7 975 q 143 906 35 975 q 285 810 243 843 q 289 797 290 806 z "
  	},
  	"î": {
  		ha: 306,
  		x_min: -45,
  		x_max: 346,
  		o: "m 241 627 q 234 470 241 575 q 228 311 228 364 q 230 163 228 262 q 232 16 232 64 q 220 1 232 1 l 87 1 q 73 29 73 1 q 76 170 73 76 q 78 311 78 264 q 70 470 78 364 q 62 629 62 576 q 77 640 62 640 q 114 637 89 640 q 153 633 140 633 q 191 637 165 633 q 229 640 216 640 q 241 627 241 640 m 346 764 q 312 745 344 761 q 273 729 279 729 q 146 840 254 729 q 90 779 140 836 q 28 730 47 730 q -11 746 22 730 q -45 765 -45 763 q 46 873 -7 808 q 100 966 85 932 q 115 977 105 977 l 186 977 q 199 966 195 977 q 252 873 210 931 q 346 764 298 820 z "
  	},
  	"ï": {
  		ha: 306,
  		x_min: -71,
  		x_max: 370,
  		o: "m 241 627 q 234 470 241 575 q 228 311 228 364 q 230 163 228 262 q 232 16 232 64 q 220 1 232 1 l 87 1 q 73 29 73 1 q 76 170 73 76 q 78 311 78 264 q 70 470 78 364 q 62 629 62 576 q 77 640 62 640 q 114 637 89 640 q 153 633 140 633 q 191 637 165 633 q 229 640 216 640 q 241 627 241 640 m 370 760 q 345 748 370 748 q 285 747 325 748 q 225 747 245 747 q 208 766 208 747 l 208 904 q 221 921 208 921 q 257 919 233 921 q 293 917 281 917 q 323 918 303 917 q 352 918 342 918 q 368 907 368 918 q 366 869 368 895 q 363 831 363 844 q 366 795 363 819 q 370 760 370 771 m 92 756 q 73 747 92 749 q 33 747 58 745 q 5 749 3 749 q -25 747 -5 749 q -56 746 -46 746 q -69 759 -69 746 q -68 791 -69 770 q -66 823 -66 812 q -68 864 -66 836 q -71 905 -71 891 q -54 920 -71 920 q 8 919 -34 920 q 70 918 50 918 q 91 904 91 918 q 89 867 91 892 q 86 829 86 842 q 89 793 86 817 q 92 756 92 768 z "
  	},
  	"ñ": {
  		ha: 726,
  		x_min: 43,
  		x_max: 667,
  		o: "m 667 14 q 653 -1 667 -1 q 586 -1 631 -1 q 519 0 542 0 q 507 20 507 0 q 509 121 507 53 q 511 222 511 189 q 511 303 511 250 q 510 385 510 357 q 488 494 510 462 q 387 532 460 532 q 293 494 353 532 q 229 422 229 454 l 229 16 q 216 -1 229 -1 q 151 -1 195 -1 q 86 0 108 0 q 72 16 72 0 q 74 176 72 69 q 75 338 75 283 q 45 604 75 482 q 43 613 43 610 q 52 623 43 620 q 129 635 56 623 q 205 647 202 647 q 211 636 210 647 q 227 551 214 594 q 319 621 262 579 q 457 664 391 664 q 631 590 585 664 q 666 414 666 536 q 665 350 666 393 q 664 285 664 307 q 665 149 664 239 q 667 14 667 59 m 581 810 q 522 762 581 794 q 436 730 464 730 q 355 754 396 730 q 294 778 315 778 q 246 755 271 778 q 218 733 221 733 q 204 739 210 733 q 144 798 144 799 q 146 803 144 800 q 203 857 156 831 q 281 882 249 882 q 364 860 314 882 q 435 838 414 838 q 483 861 448 838 q 524 885 518 885 l 530 882 q 581 810 581 831 z "
  	},
  	"ó": {
  		ha: 710,
  		x_min: 26,
  		x_max: 684,
  		o: "m 684 330 q 591 88 684 189 q 355 -16 496 -16 q 119 87 214 -16 q 26 329 26 187 q 119 570 26 471 q 355 672 215 672 q 590 570 495 672 q 684 330 684 471 m 541 329 q 490 470 541 412 q 355 532 437 532 q 220 471 274 532 q 170 329 170 412 q 221 188 170 248 q 355 125 275 125 q 490 188 436 125 q 541 329 541 248 m 562 897 q 412 793 551 869 q 243 720 275 720 q 222 753 231 720 q 215 798 215 780 q 228 811 215 805 q 460 958 340 867 q 470 964 463 961 q 479 958 473 963 q 554 905 508 934 q 562 897 557 903 z "
  	},
  	"ò": {
  		ha: 710,
  		x_min: 26,
  		x_max: 684,
  		o: "m 684 330 q 591 88 684 189 q 355 -16 496 -16 q 119 87 214 -16 q 26 329 26 187 q 119 570 26 471 q 355 672 215 672 q 590 570 495 672 q 684 330 684 471 m 541 329 q 490 470 541 412 q 355 532 437 532 q 220 471 274 532 q 170 329 170 412 q 221 188 170 248 q 355 125 275 125 q 490 188 436 125 q 541 329 541 248 m 471 797 q 462 762 471 791 q 449 733 452 733 q 437 732 434 733 q 123 895 200 843 q 117 903 121 897 q 156 945 123 915 q 201 975 190 975 q 326 906 217 975 q 467 810 425 843 q 471 797 473 806 z "
  	},
  	"ô": {
  		ha: 710,
  		x_min: 26,
  		x_max: 684,
  		o: "m 684 330 q 591 88 684 189 q 355 -16 496 -16 q 119 87 214 -16 q 26 329 26 187 q 119 570 26 471 q 355 672 215 672 q 590 570 495 672 q 684 330 684 471 m 541 329 q 490 470 541 412 q 355 532 437 532 q 220 471 274 532 q 170 329 170 412 q 221 188 170 248 q 355 125 275 125 q 490 188 436 125 q 541 329 541 248 m 547 768 q 513 749 545 765 q 475 733 481 733 q 348 844 455 733 q 291 783 341 840 q 229 734 248 734 q 190 750 224 734 q 157 769 157 767 q 248 878 195 812 q 302 970 286 936 q 317 981 307 981 l 388 981 q 400 970 397 981 q 453 878 411 935 q 547 768 500 824 z "
  	},
  	"ö": {
  		ha: 710,
  		x_min: 26,
  		x_max: 684,
  		o: "m 684 330 q 591 88 684 189 q 355 -16 496 -16 q 119 87 214 -16 q 26 329 26 187 q 119 570 26 471 q 355 672 215 672 q 590 570 495 672 q 684 330 684 471 m 541 329 q 490 470 541 412 q 355 532 437 532 q 220 471 274 532 q 170 329 170 412 q 221 188 170 248 q 355 125 275 125 q 490 188 436 125 q 541 329 541 248 m 574 747 q 549 735 574 735 q 489 734 529 735 q 429 734 449 734 q 412 753 412 734 l 412 891 q 425 908 412 908 q 461 906 437 908 q 497 904 485 904 q 527 905 507 904 q 556 905 547 905 q 572 895 572 905 q 570 856 572 882 q 567 818 567 831 q 570 782 567 806 q 574 747 574 758 m 296 743 q 277 734 296 736 q 237 734 262 732 q 210 736 208 736 q 179 734 199 736 q 148 733 158 733 q 135 746 135 733 q 136 778 135 757 q 138 810 138 799 q 136 851 138 823 q 134 892 134 878 q 150 907 134 907 q 212 906 170 907 q 274 905 254 905 q 295 891 295 905 q 293 854 295 879 q 290 817 290 829 q 293 780 290 804 q 296 743 296 755 z "
  	},
  	"õ": {
  		ha: 710,
  		x_min: 26,
  		x_max: 684,
  		o: "m 684 330 q 591 88 684 189 q 355 -16 496 -16 q 119 87 214 -16 q 26 329 26 187 q 119 570 26 471 q 355 672 215 672 q 590 570 495 672 q 684 330 684 471 m 541 329 q 490 470 541 412 q 355 532 437 532 q 220 471 274 532 q 170 329 170 412 q 221 188 170 248 q 355 125 275 125 q 490 188 436 125 q 541 329 541 248 m 571 817 q 513 769 571 801 q 427 737 454 737 q 346 761 387 737 q 285 785 305 785 q 237 762 262 785 q 208 740 212 740 q 195 746 200 740 q 135 804 135 806 q 136 810 135 806 q 194 864 146 838 q 271 889 239 889 q 354 867 304 889 q 425 844 404 844 q 473 868 438 844 q 514 892 509 892 l 521 889 q 571 817 571 838 z "
  	},
  	"ú": {
  		ha: 766,
  		x_min: 65,
  		x_max: 697,
  		o: "m 697 615 q 693 466 697 566 q 689 315 689 366 q 692 167 689 266 q 695 19 695 68 q 682 1 695 5 q 545 0 677 0 q 535 51 536 0 q 527 102 533 102 q 517 96 524 102 q 293 -3 404 -3 q 95 106 143 -3 q 65 347 65 173 q 90 614 65 505 q 113 640 96 640 q 172 640 132 640 q 231 639 211 639 q 244 624 244 639 q 235 536 244 597 q 225 443 226 470 q 223 353 223 402 q 240 194 223 235 q 370 121 269 121 q 471 163 412 121 q 534 248 532 207 q 538 606 538 298 q 566 639 538 639 l 677 639 q 697 615 697 639 m 604 897 q 454 793 593 869 q 285 720 317 720 q 264 753 273 720 q 257 798 257 780 q 270 811 257 805 q 502 958 382 867 q 512 964 505 961 q 521 958 515 963 q 596 905 550 934 q 604 897 600 903 z "
  	},
  	"ù": {
  		ha: 766,
  		x_min: 65,
  		x_max: 697,
  		o: "m 697 615 q 693 466 697 566 q 689 315 689 366 q 692 167 689 266 q 695 19 695 68 q 682 1 695 5 q 545 0 677 0 q 535 51 536 0 q 527 102 533 102 q 517 96 524 102 q 293 -3 404 -3 q 95 106 143 -3 q 65 347 65 173 q 90 614 65 505 q 113 640 96 640 q 172 640 132 640 q 231 639 211 639 q 244 624 244 639 q 235 536 244 597 q 225 443 226 470 q 223 353 223 402 q 240 194 223 235 q 370 121 269 121 q 471 163 412 121 q 534 248 532 207 q 538 606 538 298 q 566 639 538 639 l 677 639 q 697 615 697 639 m 526 797 q 516 762 526 791 q 503 733 507 733 q 492 732 488 733 q 178 895 254 843 q 171 903 175 897 q 211 945 177 915 q 255 975 244 975 q 380 906 271 975 q 522 810 479 843 q 526 797 527 806 z "
  	},
  	"û": {
  		ha: 766,
  		x_min: 65,
  		x_max: 697,
  		o: "m 697 615 q 693 466 697 566 q 689 315 689 366 q 692 167 689 266 q 695 19 695 68 q 682 1 695 5 q 545 0 677 0 q 535 51 536 0 q 527 102 533 102 q 517 96 524 102 q 293 -3 404 -3 q 95 106 143 -3 q 65 347 65 173 q 90 614 65 505 q 113 640 96 640 q 172 640 132 640 q 231 639 211 639 q 244 624 244 639 q 235 536 244 597 q 225 443 226 470 q 223 353 223 402 q 240 194 223 235 q 370 121 269 121 q 471 163 412 121 q 534 248 532 207 q 538 606 538 298 q 566 639 538 639 l 677 639 q 697 615 697 639 m 587 768 q 553 749 585 765 q 515 733 521 733 q 388 844 495 733 q 331 783 381 840 q 269 734 288 734 q 230 750 264 734 q 197 769 197 767 q 288 878 235 812 q 342 970 326 936 q 357 981 347 981 l 428 981 q 440 970 437 981 q 493 878 451 935 q 587 768 540 824 z "
  	},
  	"ü": {
  		ha: 766,
  		x_min: 65,
  		x_max: 697,
  		o: "m 697 615 q 693 466 697 566 q 689 315 689 366 q 692 167 689 266 q 695 19 695 68 q 682 1 695 5 q 545 0 677 0 q 535 51 536 0 q 527 102 533 102 q 517 96 524 102 q 293 -3 404 -3 q 95 106 143 -3 q 65 347 65 173 q 90 614 65 505 q 113 640 96 640 q 172 640 132 640 q 231 639 211 639 q 244 624 244 639 q 235 536 244 597 q 225 443 226 470 q 223 353 223 402 q 240 194 223 235 q 370 121 269 121 q 471 163 412 121 q 534 248 532 207 q 538 606 538 298 q 566 639 538 639 l 677 639 q 697 615 697 639 m 612 747 q 588 735 612 735 q 528 734 568 735 q 468 734 488 734 q 451 753 451 734 l 450 891 q 464 908 450 908 q 499 906 475 908 q 536 904 524 904 q 566 905 546 904 q 595 905 585 905 q 611 895 611 905 q 608 856 611 882 q 606 818 606 831 q 609 782 606 806 q 612 747 612 758 m 335 743 q 315 734 335 736 q 276 734 301 732 q 248 736 246 736 q 217 734 238 736 q 186 733 197 733 q 174 746 174 733 q 175 778 174 757 q 176 810 176 799 q 174 851 176 823 q 172 892 172 878 q 189 907 172 907 q 251 906 209 907 q 313 905 292 905 q 334 891 334 905 q 331 854 334 879 q 329 817 329 829 q 332 780 329 804 q 335 743 335 755 z "
  	},
  	"†": {
  		ha: 581,
  		x_min: 25,
  		x_max: 557,
  		o: "m 557 637 q 556 579 557 618 q 555 521 555 541 q 534 504 555 504 q 364 513 533 504 q 363 455 364 494 q 363 397 363 416 q 364 164 363 319 q 366 -68 366 9 q 351 -127 366 -127 l 227 -127 q 210 -118 212 -127 q 210 -96 210 -117 q 213 147 210 -15 q 216 389 216 309 l 216 511 q 132 507 203 511 q 46 504 79 504 q 26 519 26 504 q 26 578 26 539 q 25 636 25 616 q 39 652 25 652 q 125 650 71 652 q 211 647 190 648 l 208 946 q 224 971 208 971 l 359 971 q 372 949 372 971 q 368 647 372 810 q 454 650 389 648 q 539 652 507 652 q 557 637 557 652 z "
  	},
  	"°": {
  		ha: 545,
  		x_min: 50,
  		x_max: 492,
  		o: "m 492 713 q 431 542 492 614 q 271 465 367 465 q 111 543 175 465 q 50 713 50 615 q 111 883 50 810 q 271 960 175 960 q 431 883 368 960 q 492 713 492 811 m 396 713 q 366 817 396 775 q 271 864 332 864 q 177 817 212 864 q 146 713 146 774 q 179 611 146 654 q 271 562 215 562 q 365 609 330 562 q 396 713 396 651 z "
  	},
  	"¢": {
  		ha: 481,
  		x_min: 37,
  		x_max: 450,
  		o: "m 450 661 q 428 570 450 646 q 422 562 425 562 q 415 566 419 562 q 339 597 375 594 q 289 271 322 488 q 318 267 302 267 q 389 285 355 267 q 419 303 404 294 q 436 255 427 299 q 444 199 444 216 q 382 167 444 179 q 287 157 335 157 q 271 158 276 157 q 252 11 260 60 q 245 -1 249 -1 q 225 2 239 -1 q 203 5 211 5 q 191 13 191 5 q 216 172 191 25 q 85 272 133 203 q 37 432 37 342 q 110 628 37 549 q 300 710 184 710 q 317 818 304 746 q 322 831 319 831 l 372 811 q 374 802 374 808 q 364 752 374 787 q 357 704 355 720 q 409 689 378 701 q 450 661 450 674 m 282 593 q 199 534 230 582 q 171 434 171 490 q 235 294 171 344 q 282 593 241 333 z "
  	},
  	"£": {
  		ha: 648,
  		x_min: 35,
  		x_max: 671,
  		o: "m 671 132 q 668 121 671 130 q 650 14 668 121 q 631 0 648 0 q 466 2 576 0 q 302 5 357 5 q 146 -3 178 5 q 75 -16 87 -16 q 61 -4 64 -16 q 35 117 35 85 q 60 132 35 132 q 172 168 115 132 q 235 261 235 209 q 222 315 235 286 q 114 312 195 312 q 62 313 65 312 q 52 360 52 319 q 79 454 52 454 q 110 454 90 454 q 140 453 130 453 q 80 618 80 558 q 176 783 80 724 q 369 833 257 833 q 501 810 420 833 q 600 749 600 783 q 591 701 600 745 q 579 643 581 654 q 571 618 578 631 q 566 617 569 617 q 494 656 572 617 q 354 694 416 694 q 274 676 307 694 q 233 610 233 654 q 264 526 233 579 q 313 447 288 486 q 513 444 372 444 q 526 432 523 444 q 527 406 528 423 q 525 385 525 383 q 527 352 525 374 q 530 319 530 330 q 517 313 530 313 q 382 315 391 313 q 391 262 391 288 q 335 138 391 193 q 493 139 387 138 q 653 140 600 140 q 671 132 671 140 z "
  	},
  	"§": {
  		ha: 564,
  		x_min: 40,
  		x_max: 518,
  		o: "m 518 123 q 439 -35 518 24 q 264 -89 367 -89 q 52 -7 125 -89 q 40 11 40 5 q 92 106 40 8 q 99 111 94 111 q 152 68 96 111 q 254 25 208 25 q 332 46 302 25 q 368 115 368 71 q 286 205 368 161 q 134 286 134 285 q 52 421 52 342 q 86 534 52 483 q 121 587 121 586 q 102 617 121 594 q 66 671 77 646 q 46 760 46 711 q 115 913 46 859 q 281 962 178 962 q 461 897 404 962 q 470 880 470 887 l 425 791 q 419 787 422 787 q 373 821 420 787 q 282 856 326 856 q 186 782 186 856 q 216 707 186 738 q 286 660 234 690 q 425 575 402 592 q 511 450 511 511 q 472 343 511 397 q 432 292 432 290 q 454 266 432 285 q 496 219 482 243 q 518 123 518 180 m 371 409 q 319 494 371 448 q 229 541 267 541 q 199 512 215 541 q 184 471 184 486 q 239 389 184 433 q 326 349 290 349 q 355 373 339 349 q 371 409 371 395 z "
  	},
  	"•": {
  		ha: 627,
  		x_min: 52,
  		x_max: 572,
  		o: "m 572 403 q 503 202 572 283 q 311 118 429 118 q 121 203 193 118 q 52 403 52 283 q 121 602 52 522 q 311 686 193 686 q 503 602 429 686 q 572 403 572 522 z "
  	},
  	"¶": {
  		ha: 754,
  		x_min: 52,
  		x_max: 677,
  		o: "m 677 890 q 677 697 677 826 q 676 504 676 568 q 397 7 676 121 q 192 -34 298 -34 q 168 -21 174 -34 q 153 32 153 12 q 170 45 153 43 q 272 52 221 48 q 372 77 330 57 q 557 292 511 140 q 587 585 587 387 q 585 793 587 732 q 509 819 568 819 q 520 568 520 755 q 494 333 520 418 q 355 149 457 208 q 184 105 281 105 q 130 132 144 105 q 119 197 119 151 q 132 216 119 216 q 182 207 142 216 q 248 197 223 197 q 376 256 327 197 q 422 394 422 312 q 418 413 422 413 q 368 392 421 413 q 275 371 314 371 q 111 446 174 371 q 52 619 52 517 q 143 866 52 773 q 389 960 235 960 q 642 922 494 960 q 668 914 665 916 q 677 890 677 908 m 440 578 q 439 700 440 618 q 437 822 437 781 q 401 836 437 836 q 229 629 229 836 q 336 470 229 470 q 435 501 391 470 q 440 578 440 529 z "
  	},
  	"ß": {
  		ha: 694,
  		x_min: 77,
  		x_max: 659,
  		o: "m 659 330 q 389 -4 659 111 q 371 -9 377 -9 q 334 36 362 -9 q 307 93 307 82 q 326 107 307 98 q 504 318 504 191 q 464 427 504 385 q 357 469 423 469 q 320 461 343 469 q 288 454 296 454 q 273 561 273 454 q 288 574 273 568 q 415 729 415 628 q 336 832 415 832 q 252 787 283 832 q 224 693 224 748 q 232 353 224 580 q 240 12 240 126 q 228 -3 240 -3 q 192 0 216 -3 q 155 3 168 3 q 125 1 145 3 q 94 0 104 0 q 77 21 77 0 q 80 202 77 81 q 83 383 83 323 q 80 528 83 431 q 77 672 77 624 q 146 869 77 787 q 334 954 220 954 q 486 903 426 954 q 549 757 549 848 q 526 669 549 713 q 486 607 511 639 q 463 580 463 581 q 489 562 463 572 q 659 330 659 503 z "
  	},
  	"®": {
  		ha: 859,
  		x_min: 52,
  		x_max: 807,
  		o: "m 807 528 q 703 237 807 361 q 429 107 593 107 q 156 238 267 107 q 52 528 52 362 q 155 819 52 695 q 429 949 265 949 q 703 819 593 949 q 807 528 807 695 m 742 528 q 657 773 742 669 q 429 885 568 885 q 331 867 393 885 q 255 817 256 844 l 258 812 q 435 821 330 821 q 654 643 654 821 q 633 536 654 581 q 593 482 619 508 q 571 454 571 461 q 652 278 571 448 q 742 528 742 377 m 526 621 q 393 733 526 733 q 335 725 366 733 q 332 631 332 694 l 332 555 q 433 550 389 550 q 526 621 526 550 m 623 249 q 581 247 608 249 q 539 245 553 245 q 525 254 529 245 q 497 343 515 275 q 465 429 481 404 q 406 439 459 439 q 367 439 357 439 q 340 422 340 437 q 350 337 340 394 q 359 253 359 281 q 273 250 359 250 q 236 249 245 250 q 429 174 317 174 q 623 249 538 174 m 227 492 q 218 635 227 537 q 197 771 208 747 q 117 528 117 655 q 199 288 117 385 q 211 282 203 282 q 220 289 218 282 q 227 492 227 333 z "
  	},
  	"©": {
  		ha: 859,
  		x_min: 53,
  		x_max: 808,
  		o: "m 808 528 q 704 237 808 361 q 431 107 594 107 q 157 237 267 107 q 53 528 53 361 q 156 819 53 696 q 431 949 264 949 q 705 819 595 949 q 808 528 808 695 m 736 529 q 652 768 736 665 q 431 878 563 878 q 207 769 295 878 q 125 529 125 668 q 208 290 125 391 q 431 180 296 180 q 653 290 564 180 q 736 529 736 393 m 603 753 q 582 713 603 749 q 557 670 559 675 q 553 659 555 665 q 550 661 552 659 q 456 694 504 694 q 328 533 328 694 q 464 372 328 372 q 520 385 492 372 q 549 399 534 392 l 554 392 q 577 350 559 385 q 596 310 596 314 q 534 273 596 288 q 454 260 486 260 q 266 337 338 260 q 193 532 193 414 q 264 726 193 648 q 453 806 338 806 q 538 793 486 806 q 603 753 603 776 z "
  	},
  	"™": {
  		ha: 871,
  		x_min: 5,
  		x_max: 837,
  		o: "m 836 542 q 833 533 837 533 l 730 533 q 722 545 722 533 q 724 638 722 576 q 725 730 725 700 q 722 739 725 739 q 692 645 711 734 q 664 536 672 549 q 651 534 663 534 l 578 534 q 564 536 570 534 q 537 635 551 567 q 510 734 523 704 q 506 739 509 737 q 503 730 503 737 q 505 637 503 699 q 507 545 507 576 q 497 533 507 533 q 474 535 490 533 q 452 536 459 536 q 424 535 442 536 q 395 533 405 533 q 392 542 392 533 q 395 640 392 574 q 397 739 397 706 q 395 842 397 773 q 393 945 393 910 q 401 954 393 954 q 455 957 419 954 q 507 960 490 960 q 555 889 517 960 q 597 804 590 825 q 615 761 604 783 q 666 871 640 816 q 726 959 709 959 q 776 957 742 959 q 827 956 810 956 q 835 952 835 956 q 833 846 835 917 q 832 739 832 774 q 834 640 832 706 q 836 542 836 574 m 359 914 q 347 824 359 824 q 299 823 334 823 q 252 822 269 822 q 250 750 250 798 l 250 699 q 253 620 250 672 q 256 542 256 568 q 245 533 256 533 l 112 533 q 109 536 110 534 q 112 620 109 564 q 115 703 115 675 l 115 818 q 9 812 45 812 q 5 816 5 812 q 9 879 5 827 q 17 939 15 934 q 32 944 19 944 q 187 949 83 944 q 342 954 290 954 q 359 914 359 954 z "
  	},
  	"´": {
  		ha: 485,
  		x_min: 32,
  		x_max: 378,
  		o: "m 378 918 q 229 814 368 890 q 60 741 92 741 q 39 774 47 741 q 32 819 32 801 q 45 832 32 826 q 277 979 157 888 q 287 985 279 982 q 296 979 290 984 q 371 926 325 955 q 378 918 374 924 z "
  	},
  	"¨": {
  		ha: 485,
  		x_min: 24,
  		x_max: 464,
  		o: "m 464 825 q 439 813 464 813 q 379 812 419 813 q 319 812 339 812 q 302 831 302 812 l 302 969 q 315 986 302 986 q 351 984 327 986 q 387 982 375 982 q 417 983 397 982 q 446 983 437 983 q 463 972 463 983 q 460 934 463 960 q 457 896 457 909 q 460 860 457 884 q 464 825 464 836 m 186 821 q 167 812 186 814 q 127 812 153 810 q 100 814 98 814 q 69 812 90 814 q 38 811 48 811 q 25 824 25 811 q 26 856 25 835 q 28 888 28 877 q 26 929 28 901 q 24 970 24 956 q 40 985 24 985 q 102 984 60 985 q 164 983 144 983 q 185 969 185 983 q 183 932 185 957 q 180 895 180 907 q 183 858 180 882 q 186 821 186 833 z "
  	},
  	"≠": {
  		ha: 612,
  		x_min: 69,
  		x_max: 543,
  		o: "m 543 265 l 308 265 l 254 47 l 174 66 l 223 265 l 69 265 l 69 346 l 243 346 l 285 513 l 69 513 l 69 595 l 305 595 l 359 812 l 438 792 l 389 595 l 543 595 l 543 513 l 369 513 l 328 346 l 543 346 l 543 265 z "
  	},
  	"Æ": {
  		ha: 1149,
  		x_min: 43,
  		x_max: 1112,
  		o: "m 1112 143 q 1100 77 1112 122 q 1089 9 1089 32 q 1072 -2 1089 -2 q 928 2 1024 -2 q 783 5 831 5 q 674 3 747 5 q 566 0 602 0 q 545 20 545 0 q 546 117 545 56 q 549 214 548 191 q 467 218 513 218 q 298 212 348 218 q 273 196 281 210 q 229 87 252 142 q 183 0 193 0 l 61 0 q 45 9 49 0 q 44 28 43 15 q 46 47 46 47 q 45 66 46 54 q 45 86 45 79 q 65 132 45 87 q 232 488 123 250 q 424 916 340 747 q 431 932 427 924 q 446 942 435 940 q 641 953 502 953 q 784 956 688 953 q 926 960 879 960 q 989 962 947 960 q 1053 965 1031 965 q 1082 946 1078 965 q 1097 831 1097 873 q 1061 821 1097 821 q 770 814 930 821 q 728 810 754 814 q 701 696 701 802 l 701 667 q 703 589 701 597 q 758 553 713 553 q 1060 566 855 553 l 1066 566 q 1079 554 1079 566 q 1074 492 1079 535 q 1068 428 1068 450 q 1055 417 1068 417 q 1028 421 1050 417 q 810 429 979 429 q 716 416 731 429 q 701 331 701 404 l 701 289 q 702 210 701 217 q 730 141 707 152 q 787 135 744 135 q 1088 153 929 135 q 1099 154 1095 154 q 1112 143 1112 154 m 549 395 q 548 530 549 440 q 546 666 546 621 q 545 751 546 733 q 536 783 542 783 q 513 749 529 783 q 340 352 340 387 q 364 338 340 338 q 549 350 487 338 q 549 395 549 367 z "
  	},
  	"Ø": {
  		ha: 1007,
  		x_min: 41,
  		x_max: 966,
  		o: "m 893 876 q 880 852 893 867 q 498 429 871 841 q 107 -4 370 282 q 94 -13 98 -13 q 70 14 87 -13 q 52 49 56 38 q 417 458 56 59 q 842 929 819 904 q 854 939 846 934 q 878 910 863 934 q 893 876 893 886 m 966 476 q 838 130 966 275 q 504 -21 703 -21 q 170 129 304 -21 q 41 476 41 273 q 172 823 41 677 q 504 974 306 974 q 837 823 703 974 q 966 476 966 677 m 803 478 q 720 709 803 611 q 503 814 633 814 q 287 708 373 814 q 205 476 205 609 q 287 245 205 344 q 503 139 373 139 q 721 245 634 139 q 803 478 803 344 z "
  	},
  	"∞": {
  		ha: 861,
  		x_min: 24,
  		x_max: 838,
  		o: "m 838 171 q 762 94 838 94 l 591 94 q 498 171 548 94 l 431 273 l 364 170 q 321 113 336 125 q 273 94 302 95 l 101 94 q 24 171 24 94 l 24 515 q 101 592 24 592 l 273 592 q 366 515 317 591 l 432 413 l 498 515 q 591 592 548 592 l 762 592 q 838 515 838 592 l 838 171 m 747 174 l 747 513 l 586 513 l 477 344 l 587 174 l 747 174 m 386 342 l 274 513 l 115 513 l 115 174 l 277 174 l 386 342 z "
  	},
  	"±": {
  		ha: 568,
  		x_min: 46,
  		x_max: 524,
  		o: "m 521 441 l 325 441 l 325 269 l 244 269 l 244 441 l 47 441 l 47 518 l 244 518 l 244 697 l 325 697 l 325 518 l 521 518 l 521 441 m 524 129 l 46 129 l 46 212 l 524 212 l 524 129 z "
  	},
  	"≤": {
  		ha: 473,
  		x_min: 52,
  		x_max: 396,
  		o: "m 396 205 l 392 205 l 52 439 l 52 488 l 396 725 l 396 631 l 144 465 l 396 299 l 396 205 m 396 98 l 52 98 l 52 179 l 396 179 l 396 98 z "
  	},
  	"≥": {
  		ha: 473,
  		x_min: 65,
  		x_max: 410,
  		o: "m 410 439 l 65 205 l 65 299 l 316 465 l 65 631 l 65 725 l 69 725 l 410 488 l 410 439 m 409 98 l 65 98 l 65 179 l 409 179 l 409 98 z "
  	},
  	"¥": {
  		ha: 914,
  		x_min: 9,
  		x_max: 889,
  		o: "m 889 646 q 888 593 889 628 q 886 541 886 558 q 834 530 886 530 q 771 533 802 532 q 643 361 732 472 q 742 370 665 362 q 840 375 804 375 q 852 366 852 375 l 852 306 q 855 286 852 299 q 858 264 858 272 q 840 243 858 246 q 764 241 839 243 q 545 237 645 239 q 536 12 536 222 q 528 0 536 0 q 487 1 514 0 q 447 3 460 3 q 410 1 435 3 q 372 0 385 0 q 358 20 359 0 q 359 117 357 56 q 361 214 361 189 q 357 239 361 224 q 60 243 57 243 q 40 294 40 243 q 42 366 40 357 q 56 375 43 375 q 258 361 44 375 q 131 532 214 416 q 29 530 94 530 q 11 568 11 530 q 9 621 11 679 q 25 656 9 656 q 90 652 32 656 q 87 739 90 669 q 86 825 86 791 q 102 840 86 840 q 174 837 125 840 q 248 833 223 833 q 258 827 258 833 q 257 736 258 797 q 256 644 256 675 q 447 642 374 642 q 644 644 523 642 q 641 731 644 665 q 639 818 639 785 q 653 833 639 831 q 803 840 700 840 q 819 821 819 840 q 818 736 819 789 q 815 652 816 671 q 876 656 871 656 q 889 646 889 656 m 603 538 q 490 539 555 539 l 437 539 q 371 538 416 539 q 306 538 327 538 q 463 361 399 426 q 603 538 524 425 z "
  	},
  	"µ": {
  		ha: 532,
  		x_min: 74,
  		x_max: 458,
  		o: "m 458 0 l 370 0 l 370 19 q 245 -1 323 -1 q 163 26 181 -1 l 163 -250 l 74 -250 l 74 660 l 163 660 l 163 172 q 256 77 163 77 q 369 88 321 77 l 369 660 l 458 660 l 458 0 z "
  	},
  	"∂": {
  		ha: 589,
  		x_min: 84,
  		x_max: 505,
  		o: "m 505 583 l 505 75 q 484 21 505 42 q 430 0 463 0 l 159 0 q 105 21 126 0 q 84 75 84 42 l 84 510 q 105 564 84 543 q 159 585 126 585 l 401 585 l 180 1061 l 282 1061 l 505 583 m 410 83 l 410 503 l 178 503 l 178 83 l 410 83 z "
  	},
  	"∑": {
  		ha: 496,
  		x_min: 58,
  		x_max: 440,
  		o: "m 440 0 l 58 0 l 58 73 l 317 540 l 58 977 l 58 1061 l 436 1061 l 436 978 l 151 978 l 393 580 l 393 499 l 152 83 l 440 83 l 440 0 z "
  	},
  	"∏": {
  		ha: 545,
  		x_min: 26,
  		x_max: 518,
  		o: "m 518 978 l 418 978 l 418 0 l 326 0 l 326 978 l 216 978 l 216 0 l 124 0 l 124 978 l 26 978 l 26 1061 l 518 1061 l 518 978 z "
  	},
  	"π": {
  		ha: 545,
  		x_min: 26,
  		x_max: 518,
  		o: "m 518 522 l 418 522 l 418 0 l 326 0 l 326 522 l 216 522 l 216 0 l 124 0 l 124 522 l 26 522 l 26 606 l 518 606 l 518 522 z "
  	},
  	"∫": {
  		ha: 330,
  		x_min: -22,
  		x_max: 323,
  		o: "m 323 982 l 196 982 l 196 -196 q 178 -247 196 -226 q 123 -271 158 -271 l -22 -272 l -22 -193 l 106 -193 l 107 985 q 183 1061 107 1061 l 323 1061 l 323 982 z "
  	},
  	"ª": {
  		ha: 639,
  		x_min: 35,
  		x_max: 594,
  		o: "m 594 922 q 593 911 594 920 q 572 681 572 775 q 580 494 572 604 q 586 412 586 397 q 574 395 586 395 q 521 392 556 395 q 468 390 486 390 q 453 432 457 390 q 446 475 450 473 q 432 463 440 471 q 269 382 357 382 q 96 477 163 382 q 35 672 35 562 q 101 872 35 791 q 289 958 172 958 q 382 929 334 958 q 456 861 431 901 q 462 878 459 859 q 468 922 464 892 q 479 950 469 935 q 543 941 503 949 q 594 922 594 932 m 587 318 q 579 218 587 310 q 571 211 577 210 l 564 211 q 302 218 428 218 q 192 215 266 218 q 81 211 117 211 q 68 221 68 211 q 74 321 68 297 q 86 330 76 330 q 205 328 126 330 q 325 325 285 325 q 451 327 367 325 q 576 329 534 329 q 587 318 587 329 m 436 679 q 404 788 436 740 q 310 843 368 843 q 208 789 247 843 q 174 675 174 741 q 206 555 174 603 q 313 501 243 501 q 407 564 372 501 q 436 679 436 614 z "
  	},
  	"º": {
  		ha: 639,
  		x_min: 57,
  		x_max: 575,
  		o: "m 575 676 q 504 475 575 562 q 317 383 429 383 q 128 475 204 383 q 57 676 57 562 q 129 877 57 791 q 317 968 205 968 q 504 876 428 968 q 575 676 575 790 m 552 318 q 547 265 552 307 q 545 218 548 248 q 536 211 542 210 l 529 211 q 310 218 393 218 q 205 215 275 218 q 102 211 136 211 q 89 221 89 211 q 94 321 89 298 q 107 330 97 330 q 219 328 144 330 q 332 325 294 325 q 437 327 367 325 q 542 329 507 329 q 552 318 552 329 m 449 676 q 417 791 449 741 q 319 848 380 848 q 218 791 258 848 q 183 676 183 741 q 216 558 183 607 q 319 503 253 503 q 418 561 382 503 q 449 676 449 610 z "
  	},
  	"Ω": {
  		ha: 716,
  		x_min: 40,
  		x_max: 678,
  		o: "m 678 -1 l 415 -1 l 415 332 l 540 332 l 540 978 l 180 977 l 179 332 l 304 332 l 304 -1 l 40 -1 l 40 87 l 224 87 l 224 248 l 160 248 q 106 269 127 248 q 85 323 85 290 l 85 986 q 106 1040 85 1019 q 160 1061 127 1061 l 557 1061 q 612 1040 590 1061 q 634 986 634 1019 l 634 323 q 613 269 634 290 q 559 248 592 248 l 494 248 l 494 87 l 678 87 l 678 -1 z "
  	},
  	"æ": {
  		ha: 1192,
  		x_min: 29,
  		x_max: 1168,
  		o: "m 1168 362 q 1157 322 1168 341 q 1125 297 1144 300 q 986 283 1078 292 l 711 256 q 785 152 720 193 q 911 115 844 115 q 1015 138 966 115 q 1080 180 1048 153 q 1107 203 1107 203 q 1112 201 1110 203 q 1137 146 1123 178 q 1162 104 1162 103 q 1152 89 1162 100 q 895 -9 1061 -9 q 705 69 753 -9 q 709 22 709 49 q 708 1 709 10 q 626 -5 671 -5 q 575 0 598 -5 q 572 89 572 33 q 571 113 572 105 q 470 18 517 46 q 335 -16 413 -16 q 111 87 197 -16 q 29 323 29 184 q 115 571 29 473 q 351 673 205 673 q 581 553 465 673 q 604 646 586 585 l 607 646 q 721 623 616 646 q 868 672 786 672 q 1083 583 998 672 q 1168 362 1168 494 m 1008 411 q 962 506 1008 463 q 863 549 915 549 q 753 504 799 549 q 708 395 708 458 q 726 372 708 372 q 970 390 768 372 q 1008 411 1008 394 m 558 330 q 509 475 558 415 q 374 539 456 539 q 234 475 286 539 q 186 326 186 416 q 236 183 186 241 q 372 121 289 121 q 509 185 455 121 q 558 330 558 245 z "
  	},
  	"ø": {
  		ha: 710,
  		x_min: 26,
  		x_max: 684,
  		o: "m 684 330 q 591 88 684 189 q 355 -16 496 -16 q 119 87 214 -16 q 26 329 26 187 q 119 570 26 471 q 355 672 215 672 q 590 570 495 672 q 684 330 684 471 m 541 329 q 490 470 541 412 q 355 532 437 532 q 220 471 274 532 q 170 329 170 412 q 221 188 170 248 q 355 125 275 125 q 490 188 436 125 q 541 329 541 248 m 650 650 q 640 631 650 642 q 302 238 527 500 q 96 -3 234 157 q 82 -14 92 -8 q 61 11 77 -12 q 46 39 46 34 q 302 345 46 44 q 602 692 548 632 q 613 701 605 696 q 633 676 617 699 q 650 650 650 653 z "
  	},
  	"¿": {
  		ha: 553,
  		x_min: 31,
  		x_max: 536,
  		o: "m 399 860 q 374 794 399 821 q 311 766 349 766 q 249 794 273 766 q 224 860 224 822 q 249 926 224 897 q 311 954 274 954 q 374 926 349 954 q 399 860 399 898 m 536 111 q 534 86 536 92 q 426 18 528 52 q 290 -11 337 -11 q 103 60 176 -11 q 31 244 31 130 q 70 387 31 316 q 167 500 107 454 q 269 648 264 574 q 271 680 270 664 q 290 696 274 696 q 327 699 302 696 q 362 703 351 703 q 379 668 379 703 q 335 517 379 586 q 253 412 294 465 q 208 286 208 350 q 245 185 208 224 q 345 146 282 146 q 464 182 406 146 q 515 218 522 218 q 536 111 536 218 z "
  	},
  	"¡": {
  		ha: 322,
  		x_min: 79,
  		x_max: 256,
  		o: "m 256 857 q 231 789 256 817 q 167 762 206 762 q 103 789 127 762 q 79 857 79 817 q 103 926 79 897 q 167 954 127 954 q 231 926 207 954 q 256 857 256 898 m 253 157 q 252 83 253 132 q 252 9 252 35 q 243 -17 252 -17 q 205 -13 231 -17 q 167 -9 180 -9 q 129 -13 154 -9 q 92 -17 104 -17 q 83 9 83 -17 l 83 415 q 125 675 83 467 q 129 688 127 684 q 139 696 132 696 l 191 696 q 201 672 198 696 q 228 511 207 631 q 253 157 253 369 z "
  	},
  	"¬": {
  		ha: 639,
  		x_min: 81,
  		x_max: 558,
  		o: "m 558 225 l 474 225 l 474 423 l 81 423 l 81 507 l 558 507 l 558 225 z "
  	},
  	"√": {
  		ha: 1320,
  		x_min: 107,
  		x_max: 1310,
  		o: "m 1305 920 q 1310 896 1310 903 q 1297 883 1310 886 q 1253 875 1256 876 q 1137 802 1213 864 q 1013 682 1060 741 q 833 395 923 571 q 708 69 736 205 q 692 -52 707 60 q 668 -118 684 -111 q 583 -143 612 -143 q 568 -117 572 -143 q 553 -50 560 -70 q 343 243 495 110 q 235 326 271 306 q 132 366 216 336 q 107 399 107 375 q 116 420 107 412 q 188 507 138 448 q 246 566 218 542 q 272 578 261 578 q 302 568 279 578 q 458 456 375 532 q 570 316 541 380 q 602 277 588 277 q 642 335 618 277 q 755 527 664 390 q 908 734 847 664 q 1225 1047 1124 984 q 1244 1054 1236 1054 q 1278 1013 1261 1054 q 1305 920 1287 989 z "
  	},
  	"ƒ": {
  		ha: 530,
  		x_min: 50,
  		x_max: 492,
  		o: "m 492 781 q 469 689 492 785 q 458 670 465 670 q 411 686 455 670 q 342 701 367 701 q 290 678 302 701 q 283 616 283 663 q 286 547 283 589 q 452 534 398 547 q 465 524 465 532 q 457 461 465 511 q 446 404 450 408 q 370 401 418 399 q 293 404 290 404 q 323 73 323 197 q 192 -142 323 -88 q 182 -144 186 -144 q 172 -134 178 -144 q 111 -26 140 -67 q 104 -16 108 -22 q 142 21 123 3 q 171 103 171 51 q 144 403 171 282 q 77 399 115 399 q 62 407 65 399 q 50 536 50 530 q 61 546 50 546 q 98 545 73 546 q 135 545 123 545 q 127 653 127 673 q 177 791 127 736 q 309 846 227 846 q 412 829 347 846 q 492 781 492 807 z "
  	},
  	"≈": {
  		ha: 701,
  		x_min: 115,
  		x_max: 586,
  		o: "m 586 545 q 530 487 586 487 q 460 500 496 487 l 204 598 l 204 491 l 115 491 l 115 633 q 171 691 115 691 q 241 677 205 691 l 497 580 l 497 687 l 586 687 l 586 545 m 586 277 q 530 219 586 219 q 460 233 496 219 l 204 330 l 204 223 l 115 223 l 115 365 q 171 423 115 423 q 241 409 205 423 l 497 312 l 497 419 l 586 419 l 586 277 z "
  	},
  	"Δ": {
  		ha: 555,
  		x_min: 31,
  		x_max: 526,
  		o: "m 526 0 l 31 0 l 31 83 l 232 1064 l 325 1064 q 431 547 332 1025 q 526 80 526 81 l 526 0 m 432 90 l 277 895 l 122 90 l 432 90 z "
  	},
  	"«": {
  		ha: 699,
  		x_min: 36,
  		x_max: 663,
  		o: "m 663 528 q 585 456 663 509 q 485 396 517 410 q 473 388 479 394 q 570 327 473 388 q 661 248 661 270 q 659 241 661 246 q 618 149 645 216 q 610 139 615 139 q 473 243 553 184 q 349 317 408 286 q 336 338 336 323 q 336 387 336 354 q 335 436 335 420 q 347 457 335 450 q 484 536 418 494 q 552 589 490 541 q 612 634 611 634 q 619 625 617 634 q 663 528 621 619 m 364 527 q 270 447 364 508 q 175 387 222 417 q 273 327 176 387 q 362 249 362 271 q 359 241 362 247 q 319 149 345 212 q 312 139 316 139 q 174 244 253 185 q 50 317 118 281 q 37 338 37 323 q 37 387 37 354 q 36 436 36 420 q 49 457 36 450 q 186 536 134 503 q 254 589 193 541 q 314 634 312 634 q 322 626 319 634 q 364 527 324 618 z "
  	},
  	"»": {
  		ha: 699,
  		x_min: 40,
  		x_max: 667,
  		o: "m 667 436 q 666 387 667 420 q 665 339 665 354 q 653 317 665 323 q 406 149 498 235 q 391 139 401 144 q 383 149 387 142 q 343 241 372 180 q 340 249 340 246 q 418 319 340 267 q 517 379 486 366 q 528 387 522 381 q 431 447 479 417 q 338 528 338 506 q 382 625 358 568 q 389 634 385 634 q 449 589 391 634 q 518 536 511 541 q 654 457 583 494 q 667 436 667 450 m 368 338 q 355 317 368 323 q 107 149 186 227 q 94 140 103 144 q 86 149 89 142 q 45 241 73 180 q 43 248 43 245 q 57 269 43 256 q 220 379 138 347 q 231 387 224 380 q 134 447 182 417 q 40 528 40 506 q 45 538 40 530 q 83 625 73 593 q 91 634 86 634 q 220 536 149 590 q 355 457 281 496 q 368 436 368 450 l 368 338 z "
  	},
  	"…": {
  		ha: 896,
  		x_min: 46,
  		x_max: 850,
  		o: "m 850 100 q 820 21 850 55 q 746 -12 790 -12 q 671 22 702 -12 q 643 100 643 55 q 672 177 643 145 q 746 210 701 210 q 820 177 790 210 q 850 100 850 144 m 551 100 q 522 21 551 55 q 447 -12 492 -12 q 373 22 403 -12 q 345 100 345 55 q 374 177 345 145 q 447 210 403 210 q 522 177 492 210 q 551 100 551 144 m 253 100 q 223 21 253 55 q 149 -12 193 -12 q 75 22 104 -12 q 46 100 46 55 q 75 177 46 145 q 149 210 104 210 q 223 177 193 210 q 253 100 253 144 z "
  	},
  	" ": {
  		ha: 174,
  		x_min: 0,
  		x_max: 0,
  		o: ""
  	},
  	"À": {
  		ha: 916,
  		x_min: 6,
  		x_max: 909,
  		o: "m 909 8 q 893 0 909 0 q 856 2 880 0 q 818 4 831 4 q 779 2 805 4 q 741 0 753 0 q 692 103 722 0 q 632 207 663 205 q 501 208 607 208 l 394 208 q 267 207 282 208 q 215 102 242 205 q 172 0 187 0 l 20 0 q 6 9 6 0 q 16 40 6 16 l 182 494 q 309 811 203 549 q 361 942 328 854 q 378 968 369 968 q 416 964 391 968 q 454 961 441 961 q 491 965 467 961 q 528 968 516 968 q 545 943 534 968 q 705 534 561 905 q 909 8 909 13 m 593 382 q 532 559 593 402 q 449 758 473 711 q 309 383 309 400 q 360 356 309 360 q 427 355 363 355 l 496 355 q 593 382 593 355 m 578 1058 q 568 1023 578 1052 q 555 994 559 994 q 544 993 541 994 q 230 1156 307 1104 q 223 1164 227 1158 q 263 1206 229 1176 q 307 1236 296 1236 q 432 1167 323 1236 q 574 1071 532 1104 q 578 1058 579 1067 z "
  	},
  	"Ã": {
  		ha: 916,
  		x_min: 6,
  		x_max: 909,
  		o: "m 909 8 q 893 0 909 0 q 856 2 880 0 q 818 4 831 4 q 779 2 805 4 q 741 0 753 0 q 692 103 722 0 q 632 207 663 205 q 501 208 607 208 l 394 208 q 267 207 282 208 q 215 102 242 205 q 172 0 187 0 l 20 0 q 6 9 6 0 q 16 40 6 16 l 182 494 q 309 811 203 549 q 361 942 328 854 q 378 968 369 968 q 416 964 391 968 q 454 961 441 961 q 491 965 467 961 q 528 968 516 968 q 545 943 534 968 q 705 534 561 905 q 909 8 909 13 m 593 382 q 532 559 593 402 q 449 758 473 711 q 309 383 309 400 q 360 356 309 360 q 427 355 363 355 l 496 355 q 593 382 593 355 m 661 1101 q 603 1053 661 1084 q 517 1021 545 1021 q 436 1044 477 1021 q 375 1068 395 1068 q 327 1046 352 1068 q 298 1023 302 1023 q 285 1029 290 1023 q 225 1088 225 1089 q 227 1093 225 1090 q 284 1147 237 1121 q 361 1173 330 1173 q 445 1150 395 1173 q 515 1128 494 1128 q 564 1152 528 1128 q 604 1175 599 1175 l 611 1173 q 661 1101 661 1122 z "
  	},
  	"Õ": {
  		ha: 1007,
  		x_min: 41,
  		x_max: 966,
  		o: "m 966 476 q 838 130 966 275 q 504 -21 703 -21 q 170 129 304 -21 q 41 476 41 273 q 172 823 41 677 q 504 974 306 974 q 837 823 703 974 q 966 476 966 677 m 803 478 q 720 709 803 611 q 503 814 633 814 q 287 708 373 814 q 205 476 205 609 q 287 245 205 344 q 503 139 373 139 q 721 245 634 139 q 803 478 803 344 m 711 1094 q 653 1046 711 1078 q 567 1014 595 1014 q 486 1038 527 1014 q 425 1061 446 1061 q 377 1039 402 1061 q 349 1017 352 1017 q 335 1023 340 1017 q 275 1081 275 1082 q 277 1086 275 1083 q 334 1141 287 1114 q 412 1166 380 1166 q 495 1143 445 1166 q 566 1121 545 1121 q 614 1145 578 1121 q 654 1168 649 1168 l 661 1166 q 711 1094 711 1115 z "
  	},
  	"Œ": {
  		ha: 1303,
  		x_min: 40,
  		x_max: 1259,
  		o: "m 1259 136 q 1249 75 1259 119 q 1238 7 1238 30 q 1224 -5 1238 -5 l 1211 -4 q 875 1 1196 -3 q 822 2 848 2 q 791 35 791 7 q 795 88 791 54 q 799 142 798 126 q 671 26 753 70 q 503 -17 589 -17 q 171 132 307 -17 q 40 475 40 277 q 170 819 40 675 q 503 966 304 966 q 673 924 591 966 q 807 809 754 881 q 811 803 811 803 q 813 830 813 803 l 813 885 q 818 951 812 949 q 831 951 819 952 q 906 949 856 951 q 981 947 956 947 q 1099 949 1020 947 q 1217 951 1177 951 q 1240 932 1236 951 q 1255 817 1255 857 q 1240 807 1255 807 q 1120 811 1200 807 q 1000 815 1040 815 q 949 762 958 815 q 947 673 947 753 q 946 648 947 665 q 945 622 945 630 q 1000 553 945 553 q 1115 556 1038 553 q 1231 559 1192 559 q 1249 543 1249 559 q 1247 510 1249 532 q 1246 477 1246 488 q 1247 456 1246 470 q 1249 435 1249 441 q 1240 421 1249 421 q 1155 424 1212 421 q 1070 427 1099 427 q 958 405 974 427 q 949 281 949 390 q 958 168 949 186 q 1053 135 975 135 q 1152 141 1086 135 q 1249 146 1217 146 q 1259 136 1259 146 m 804 475 q 719 709 804 609 q 497 815 629 815 q 282 707 371 815 q 199 475 199 604 q 283 245 199 347 q 497 136 372 136 q 720 240 631 136 q 804 475 804 340 z "
  	},
  	"œ": {
  		ha: 1196,
  		x_min: 26,
  		x_max: 1173,
  		o: "m 1173 357 q 1129 294 1173 304 q 1000 283 1126 294 l 714 257 q 779 156 722 198 q 893 117 831 117 q 1089 182 1015 117 q 1109 200 1109 200 q 1117 199 1116 200 q 1141 143 1127 175 q 1166 102 1166 100 q 1156 86 1166 98 q 900 -16 1061 -16 q 736 23 816 -16 q 614 135 650 66 q 505 27 583 69 q 355 -12 432 -12 q 117 88 211 -12 q 26 332 26 186 q 118 575 26 477 q 355 676 212 676 q 603 547 513 676 l 615 529 q 725 637 652 596 q 873 678 796 678 q 1091 584 1007 678 q 1173 357 1173 493 m 1013 411 q 966 505 1013 463 q 867 546 920 546 q 753 500 802 546 q 705 390 705 455 q 734 372 705 372 q 974 390 774 372 q 1013 411 1013 394 m 543 332 q 493 476 543 418 q 355 538 440 538 q 218 477 271 538 q 170 332 170 419 q 219 188 170 245 q 355 126 271 126 q 493 188 440 126 q 543 332 543 245 z "
  	},
  	"–": {
  		ha: 785,
  		x_min: 32,
  		x_max: 753,
  		o: "m 753 467 q 747 400 753 465 q 741 334 741 336 q 728 325 739 325 q 565 326 674 325 q 401 328 456 328 q 225 323 342 328 q 50 319 109 319 q 32 338 32 319 q 45 401 32 356 q 53 465 45 425 q 74 476 57 476 q 220 474 123 476 q 367 472 318 472 q 553 476 429 472 q 739 479 677 479 q 753 467 753 479 z "
  	},
  	"—": {
  		ha: 1104,
  		x_min: 39,
  		x_max: 1069,
  		o: "m 1069 466 q 1061 401 1069 464 q 1053 334 1054 338 q 1039 325 1051 325 q 806 326 961 325 q 572 328 650 328 q 315 323 486 328 q 58 319 144 319 q 39 338 39 319 q 61 465 39 339 q 83 476 66 476 q 310 474 159 476 q 536 472 460 472 q 794 476 622 472 q 1051 479 966 479 q 1069 466 1069 479 z "
  	},
  	"“": {
  		ha: 526,
  		x_min: 47,
  		x_max: 486,
  		o: "m 486 629 q 439 577 486 621 q 385 533 392 533 q 370 543 379 533 q 287 713 287 627 q 317 846 287 776 q 392 961 347 916 q 408 972 402 972 q 415 966 411 972 q 465 916 465 911 q 435 869 465 922 q 406 774 406 817 q 446 674 406 719 q 486 629 486 629 m 243 646 q 196 595 243 639 q 145 551 149 551 q 74 627 127 551 q 47 730 47 664 q 158 991 47 876 q 174 1002 168 1002 q 202 977 176 1002 q 229 949 229 953 q 197 901 229 957 q 165 793 165 844 q 185 716 165 751 q 223 671 198 695 q 243 646 243 652 z "
  	},
  	"”": {
  		ha: 526,
  		x_min: 39,
  		x_max: 478,
  		o: "m 478 817 q 367 555 478 672 q 352 546 357 546 q 323 570 350 546 q 297 598 297 595 q 328 647 297 591 q 359 754 359 703 q 340 831 359 797 q 302 876 328 852 q 282 901 282 895 q 329 952 282 909 q 380 996 376 996 q 452 921 398 996 q 478 817 478 883 m 238 779 q 208 646 238 715 q 134 530 178 576 q 117 520 123 520 q 110 525 114 520 q 60 576 60 581 q 90 623 60 570 q 119 718 119 675 q 79 818 119 773 q 39 863 39 863 q 86 915 39 871 q 140 958 133 958 q 155 949 146 958 q 238 779 238 865 z "
  	},
  	"‘": {
  		ha: 288,
  		x_min: 54,
  		x_max: 254,
  		o: "m 254 633 q 205 582 254 627 q 153 538 157 538 q 138 546 146 538 q 54 718 54 618 q 87 859 54 782 q 165 979 119 936 q 181 987 174 987 q 210 963 184 987 q 237 936 237 939 q 233 929 237 933 q 180 779 180 861 q 217 677 180 722 q 254 633 254 633 z "
  	},
  	"’": {
  		ha: 288,
  		x_min: 32,
  		x_max: 233,
  		o: "m 233 803 q 121 542 233 661 q 106 532 111 532 q 97 538 103 532 q 50 583 50 583 q 54 591 50 586 q 103 741 103 659 q 84 820 103 785 q 50 865 73 842 q 32 887 32 883 q 72 926 32 889 q 121 974 115 964 q 133 983 127 983 q 150 974 139 983 q 233 803 233 900 z "
  	},
  	"÷": {
  		ha: 568,
  		x_min: 47,
  		x_max: 521,
  		o: "m 355 640 q 334 589 355 610 q 283 568 313 568 q 234 589 254 568 q 213 640 213 610 q 234 691 213 670 q 283 712 254 712 q 334 691 313 712 q 355 640 355 670 m 521 424 l 47 424 l 47 509 l 521 509 l 521 424 m 355 292 q 334 241 355 262 q 283 220 313 220 q 234 241 254 220 q 213 292 213 262 q 234 343 213 321 q 283 364 254 364 q 334 343 313 364 q 355 292 355 321 z "
  	},
  	"◊": {
  		ha: 560,
  		x_min: 20,
  		x_max: 541,
  		o: "m 541 389 l 306 45 l 257 45 l 20 389 l 257 734 l 306 734 l 541 389 m 447 389 l 281 641 l 115 389 l 281 138 l 447 389 z "
  	},
  	"ÿ": {
  		ha: 661,
  		x_min: 24,
  		x_max: 640,
  		o: "m 640 472 q 633 334 640 357 q 466 67 625 303 q 277 -196 307 -168 q 102 -220 250 -220 q 79 -217 84 -220 q 56 -168 74 -213 q 38 -113 38 -122 q 74 -98 38 -98 q 186 -77 150 -98 q 223 -30 198 -69 q 248 23 248 9 q 149 166 248 41 q 33 334 45 298 q 24 467 24 361 q 24 544 24 492 q 25 623 25 596 q 41 637 25 637 q 105 635 63 637 q 170 632 148 632 q 180 618 180 632 q 178 561 180 599 q 176 504 176 523 q 182 380 176 421 q 256 252 186 355 q 342 150 326 150 q 415 251 353 150 q 481 375 477 351 q 486 498 486 409 q 482 556 486 518 q 478 614 478 595 q 489 631 478 631 q 554 634 511 631 q 620 637 598 637 q 640 472 640 637 m 558 697 q 534 686 558 686 q 473 685 513 686 q 414 684 433 684 q 397 703 397 684 l 396 842 q 410 859 396 859 q 445 857 421 859 q 481 854 469 854 q 511 855 492 854 q 541 856 531 856 q 557 845 557 856 q 554 807 557 832 q 551 768 551 781 q 555 732 551 756 q 558 697 558 709 m 281 694 q 261 684 281 686 q 222 684 247 683 q 194 686 192 686 q 163 685 184 686 q 132 684 142 684 q 119 696 119 684 q 121 728 119 707 q 122 760 122 749 q 120 801 122 774 q 118 842 118 829 q 134 857 118 857 q 196 857 155 857 q 259 856 238 856 q 279 842 279 856 q 277 804 279 829 q 275 767 275 779 q 278 730 275 755 q 281 694 281 706 z "
  	},
  	"Ÿ": {
  		ha: 815,
  		x_min: 24,
  		x_max: 794,
  		o: "m 794 696 q 673 491 794 657 q 514 283 593 387 q 494 231 494 258 q 498 121 494 194 q 502 12 502 48 q 485 0 502 0 l 323 0 q 310 20 310 0 q 315 125 310 54 q 319 231 319 195 q 302 285 319 261 q 157 475 254 348 q 37 647 74 588 q 25 686 25 667 q 24 933 24 772 q 40 951 24 951 q 74 949 52 951 q 109 947 97 947 q 149 949 122 947 q 191 951 176 951 q 203 941 203 951 q 199 827 203 903 q 195 713 195 751 q 410 427 195 672 q 526 570 460 484 q 618 711 618 688 q 612 822 618 748 q 607 933 607 897 q 623 951 607 951 q 660 949 635 951 q 697 947 685 947 q 736 949 710 947 q 775 951 762 951 q 791 929 791 951 q 793 812 791 890 q 794 696 794 734 m 638 1000 q 614 988 638 988 q 553 987 593 988 q 494 987 513 987 q 477 1006 477 987 l 476 1144 q 490 1161 476 1161 q 525 1159 501 1161 q 562 1157 549 1157 q 591 1158 572 1157 q 621 1158 611 1158 q 637 1147 637 1158 q 634 1109 637 1135 q 631 1071 631 1084 q 635 1035 631 1059 q 638 1000 638 1011 m 361 996 q 341 987 361 989 q 302 987 327 985 q 274 989 272 989 q 243 987 264 989 q 212 986 222 986 q 199 999 199 986 q 201 1031 199 1010 q 202 1063 202 1052 q 200 1104 202 1076 q 198 1145 198 1131 q 214 1160 198 1160 q 276 1159 235 1160 q 339 1158 318 1158 q 359 1144 359 1158 q 357 1107 359 1132 q 355 1069 355 1082 q 358 1033 355 1057 q 361 996 361 1008 z "
  	},
  	"⁄": {
  		ha: 424,
  		x_min: -61,
  		x_max: 495,
  		o: "m 495 789 q 490 777 495 786 q 264 380 413 646 q 44 -41 193 238 q 32 -53 37 -53 q -16 -18 28 -53 q -61 22 -61 18 q -58 32 -61 26 q 395 851 231 525 q 404 860 399 860 q 455 829 414 860 q 495 789 495 798 z "
  	},
  	"¤": {
  		ha: 828,
  		x_min: 96,
  		x_max: 743,
  		o: "m 743 745 l 623 625 l 623 357 l 743 237 l 663 157 l 531 288 l 307 288 l 176 157 l 96 237 l 216 357 l 216 625 l 96 745 l 176 825 l 308 694 l 532 694 l 663 825 l 743 745 m 511 389 l 511 594 l 328 594 l 328 389 l 511 389 z "
  	},
  	"‹": {
  		ha: 406,
  		x_min: 36,
  		x_max: 380,
  		o: "m 380 524 q 207 388 380 500 q 296 330 208 386 q 374 256 374 281 q 355 205 374 252 q 332 149 334 155 q 325 139 331 144 q 191 239 268 182 q 50 317 155 262 q 37 338 37 323 q 37 387 37 354 q 36 436 36 420 q 49 457 36 450 q 315 628 182 528 q 328 634 319 631 q 335 625 332 632 q 376 534 347 595 q 380 524 380 528 z "
  	},
  	"›": {
  		ha: 406,
  		x_min: 24,
  		x_max: 370,
  		o: "m 370 338 q 357 317 370 323 q 96 149 194 231 q 81 139 91 144 q 74 149 77 142 q 29 245 60 181 q 26 252 26 250 q 104 324 26 274 q 203 379 170 367 q 213 387 208 380 q 117 446 165 416 q 24 524 24 503 q 47 569 24 525 q 72 625 69 613 q 79 634 75 634 q 92 628 83 634 q 214 538 132 597 q 357 457 264 505 q 370 436 370 450 l 370 338 z "
  	},
  	"": {
  		ha: 705,
  		x_min: 12,
  		x_max: 644,
  		o: "m 644 630 q 637 471 644 577 q 631 311 631 364 q 634 164 631 262 q 637 17 637 66 q 625 1 637 1 l 496 1 q 479 24 479 1 q 482 143 479 64 q 485 261 485 222 q 484 372 485 298 q 484 484 484 446 q 463 505 484 504 q 250 510 391 505 q 255 265 250 429 q 260 18 260 100 q 245 0 260 0 l 123 0 q 106 21 106 0 l 106 489 q 92 504 106 500 q 65 505 83 507 q 43 503 41 503 q 17 510 18 503 q 12 619 12 525 q 50 635 12 630 q 98 637 75 636 q 96 715 96 689 q 369 983 96 983 q 555 940 463 983 q 566 929 566 936 q 555 863 566 910 q 533 807 544 807 q 472 831 528 807 q 385 854 416 854 q 269 809 301 854 q 243 684 243 772 q 244 640 243 664 q 365 638 281 640 q 485 636 444 636 q 557 637 533 636 q 595 642 567 638 q 633 645 620 645 q 644 630 644 645 z "
  	},
  	"": {
  		ha: 721,
  		x_min: 16,
  		x_max: 669,
  		o: "m 669 934 q 665 922 669 930 q 649 683 650 892 q 650 436 650 852 q 652 232 650 368 q 654 28 654 96 q 643 0 654 0 l 513 0 q 500 16 500 0 q 502 226 500 85 q 504 436 504 366 l 504 521 q 252 514 420 521 q 257 266 252 433 q 262 18 262 101 q 249 0 262 0 l 126 0 q 109 21 109 0 l 109 492 q 95 507 109 503 q 68 508 86 509 q 45 505 43 505 q 20 513 22 505 q 16 621 16 524 q 54 636 16 632 q 102 639 77 637 q 96 705 96 671 q 173 916 96 840 q 387 992 251 992 q 652 949 517 992 q 669 934 669 943 m 509 852 q 376 867 422 867 q 273 810 311 867 q 240 692 240 760 q 244 643 240 668 l 503 643 q 509 852 503 805 z "
  	},
  	"‡": {
  		ha: 607,
  		x_min: 35,
  		x_max: 570,
  		o: "m 570 637 q 569 582 570 619 q 568 527 568 545 q 549 509 568 509 q 372 517 541 509 q 370 446 372 494 q 368 374 368 397 q 371 235 368 393 q 550 240 532 240 q 567 226 563 240 q 569 196 570 216 q 567 171 567 167 q 569 144 567 174 q 568 113 570 123 q 549 98 563 98 q 375 104 536 98 q 378 -45 376 62 q 380 -195 380 -140 q 367 -227 380 -227 l 236 -227 q 220 -220 223 -227 q 219 -201 219 -217 q 222 -48 219 -142 q 227 104 226 76 q 142 101 203 104 q 57 98 88 98 q 38 113 43 98 q 37 144 35 123 q 39 171 39 173 q 37 196 39 168 q 38 226 36 216 q 52 240 41 240 q 142 237 83 240 q 232 233 205 234 q 233 298 232 245 q 235 361 235 337 l 235 515 q 147 511 221 515 q 60 509 94 509 q 39 524 39 509 q 38 580 39 543 q 37 636 37 617 q 52 652 37 652 q 139 650 84 652 q 227 647 205 648 q 223 797 226 684 q 221 946 221 890 q 236 971 221 971 l 372 971 q 385 956 385 971 q 379 647 385 865 q 466 650 400 648 q 553 652 520 652 q 570 637 570 652 z "
  	},
  	"·": {
  		ha: 298,
  		x_min: 46,
  		x_max: 253,
  		o: "m 253 501 q 223 423 253 456 q 149 390 193 390 q 75 423 104 390 q 46 501 46 456 q 75 579 46 547 q 149 611 104 611 q 223 578 193 611 q 253 501 253 546 z "
  	},
  	"‚": {
  		ha: 288,
  		x_min: 33,
  		x_max: 232,
  		o: "m 232 48 q 198 -85 232 -11 q 121 -201 165 -160 q 105 -210 112 -210 q 77 -186 103 -210 q 51 -159 51 -161 q 82 -110 51 -167 q 114 -1 114 -52 q 73 98 114 52 q 33 143 33 144 q 83 196 33 151 q 135 240 131 240 q 150 232 140 240 q 232 48 232 158 z "
  	},
  	"„": {
  		ha: 526,
  		x_min: 28,
  		x_max: 448,
  		o: "m 448 113 q 336 -149 448 -33 q 321 -159 327 -159 q 293 -134 319 -159 q 267 -106 267 -110 q 298 -58 267 -114 q 329 50 329 -1 q 309 127 329 93 q 271 172 297 148 q 252 197 252 191 q 298 248 252 204 q 349 292 345 292 q 421 216 368 292 q 448 113 448 179 m 227 59 q 197 -75 227 -5 q 121 -189 168 -141 q 105 -199 111 -199 q 97 -195 102 -199 q 50 -143 50 -140 q 79 -97 50 -150 q 109 -1 109 -44 q 68 99 109 54 q 28 144 28 144 q 75 195 28 151 q 129 239 122 239 q 144 229 135 239 q 227 59 227 146 z "
  	},
  	"‰": {
  		ha: 1522,
  		x_min: 32,
  		x_max: 1491,
  		o: "m 1491 253 q 1433 76 1491 153 q 1274 -8 1371 -8 q 1114 76 1177 -8 q 1055 253 1055 153 q 1114 431 1055 353 q 1274 515 1177 515 q 1433 431 1371 515 q 1491 253 1491 353 m 990 253 q 933 76 990 153 q 774 -8 871 -8 q 613 76 676 -8 q 555 253 555 153 q 613 431 555 353 q 774 515 677 515 q 933 431 871 515 q 990 253 990 353 m 718 812 q 713 796 718 806 q 533 412 652 669 q 370 -1 479 292 q 356 -20 362 -20 q 321 -4 347 -20 q 296 20 296 12 q 302 40 296 27 q 397 233 342 113 q 489 428 469 388 q 572 627 524 498 q 648 833 610 730 q 662 850 655 850 q 694 836 671 850 q 718 812 718 821 m 467 583 q 410 406 467 483 q 250 322 347 322 q 90 406 153 322 q 32 583 32 483 q 90 761 32 684 q 250 846 153 846 q 410 761 347 846 q 467 583 467 684 m 1378 253 q 1354 351 1378 308 q 1274 403 1324 403 q 1193 351 1223 403 q 1168 253 1168 308 q 1194 157 1168 201 q 1274 104 1225 104 q 1354 155 1324 104 q 1378 253 1378 198 m 878 253 q 854 351 878 308 q 774 403 825 403 q 693 351 722 403 q 668 253 668 308 q 694 157 668 201 q 774 104 725 104 q 853 155 824 104 q 878 253 878 198 m 354 583 q 330 682 354 638 q 250 733 301 733 q 170 681 199 733 q 144 583 144 637 q 171 487 144 532 q 250 435 202 435 q 330 486 300 435 q 354 583 354 529 z "
  	},
  	"Â": {
  		ha: 916,
  		x_min: 6,
  		x_max: 909,
  		o: "m 909 8 q 893 0 909 0 q 856 2 880 0 q 818 4 831 4 q 779 2 805 4 q 741 0 753 0 q 692 103 722 0 q 632 207 663 205 q 501 208 607 208 l 394 208 q 267 207 282 208 q 215 102 242 205 q 172 0 187 0 l 20 0 q 6 9 6 0 q 16 40 6 16 l 182 494 q 309 811 203 549 q 361 942 328 854 q 378 968 369 968 q 416 964 391 968 q 454 961 441 961 q 491 965 467 961 q 528 968 516 968 q 545 943 534 968 q 705 534 561 905 q 909 8 909 13 m 593 382 q 532 559 593 402 q 449 758 473 711 q 309 383 309 400 q 360 356 309 360 q 427 355 363 355 l 496 355 q 593 382 593 355 m 644 1020 q 610 1001 642 1017 q 572 985 578 985 q 445 1096 552 985 q 388 1034 438 1092 q 326 985 345 985 q 287 1002 321 985 q 254 1021 254 1019 q 345 1129 292 1064 q 399 1221 383 1187 q 414 1232 404 1232 l 485 1232 q 497 1221 494 1232 q 550 1129 508 1187 q 644 1020 597 1076 z "
  	},
  	"Ê": {
  		ha: 747,
  		x_min: 68,
  		x_max: 713,
  		o: "m 713 136 q 707 105 713 125 q 700 74 701 79 q 690 3 698 50 q 673 -9 687 -9 q 647 -7 666 -9 q 389 5 564 5 q 239 3 339 5 q 90 0 140 0 q 68 20 68 0 q 76 248 68 96 q 85 476 85 400 q 77 764 85 553 q 69 926 75 819 l 68 936 q 86 951 68 951 q 229 949 134 951 q 371 946 323 946 q 507 949 416 946 q 643 951 597 951 q 677 932 675 951 q 692 821 692 842 q 677 805 692 805 q 502 811 619 805 q 326 818 385 818 q 256 803 271 818 q 241 729 241 788 l 241 628 q 243 580 241 587 q 279 559 250 559 q 302 559 287 559 q 325 559 317 559 q 564 564 458 559 q 661 571 605 566 q 675 559 675 572 q 670 492 675 537 q 665 425 665 448 q 645 413 665 413 q 585 418 637 413 q 414 422 547 422 q 272 419 302 422 q 241 391 245 417 q 241 338 241 395 l 241 238 q 263 150 241 168 q 348 136 280 136 l 422 136 q 689 153 470 136 l 699 153 q 713 136 713 155 m 576 1025 q 542 1006 574 1022 q 504 990 510 990 q 377 1101 484 990 q 320 1040 370 1097 q 258 991 277 991 q 219 1007 253 991 q 186 1026 186 1024 q 277 1135 224 1069 q 331 1227 315 1193 q 346 1238 336 1238 l 417 1238 q 429 1227 426 1238 q 482 1135 440 1192 q 576 1025 529 1081 z "
  	},
  	"Á": {
  		ha: 916,
  		x_min: 6,
  		x_max: 909,
  		o: "m 909 8 q 893 0 909 0 q 856 2 880 0 q 818 4 831 4 q 779 2 805 4 q 741 0 753 0 q 692 103 722 0 q 632 207 663 205 q 501 208 607 208 l 394 208 q 267 207 282 208 q 215 102 242 205 q 172 0 187 0 l 20 0 q 6 9 6 0 q 16 40 6 16 l 182 494 q 309 811 203 549 q 361 942 328 854 q 378 968 369 968 q 416 964 391 968 q 454 961 441 961 q 491 965 467 961 q 528 968 516 968 q 545 943 534 968 q 705 534 561 905 q 909 8 909 13 m 593 382 q 532 559 593 402 q 449 758 473 711 q 309 383 309 400 q 360 356 309 360 q 427 355 363 355 l 496 355 q 593 382 593 355 m 642 1166 q 492 1063 632 1139 q 323 989 356 989 q 302 1023 311 989 q 296 1068 296 1050 q 309 1081 296 1075 q 541 1228 420 1137 q 551 1234 543 1231 q 559 1228 554 1233 q 635 1175 589 1204 q 642 1166 638 1173 z "
  	},
  	"Ë": {
  		ha: 747,
  		x_min: 68,
  		x_max: 713,
  		o: "m 713 136 q 707 105 713 125 q 700 74 701 79 q 690 3 698 50 q 673 -9 687 -9 q 647 -7 666 -9 q 389 5 564 5 q 239 3 339 5 q 90 0 140 0 q 68 20 68 0 q 76 248 68 96 q 85 476 85 400 q 77 764 85 553 q 69 926 75 819 l 68 936 q 86 951 68 951 q 229 949 134 951 q 371 946 323 946 q 507 949 416 946 q 643 951 597 951 q 677 932 675 951 q 692 821 692 842 q 677 805 692 805 q 502 811 619 805 q 326 818 385 818 q 256 803 271 818 q 241 729 241 788 l 241 628 q 243 580 241 587 q 279 559 250 559 q 302 559 287 559 q 325 559 317 559 q 564 564 458 559 q 661 571 605 566 q 675 559 675 572 q 670 492 675 537 q 665 425 665 448 q 645 413 665 413 q 585 418 637 413 q 414 422 547 422 q 272 419 302 422 q 241 391 245 417 q 241 338 241 395 l 241 238 q 263 150 241 168 q 348 136 280 136 l 422 136 q 689 153 470 136 l 699 153 q 713 136 713 155 m 595 1008 q 570 996 595 996 q 510 996 550 996 q 450 995 470 995 q 433 1014 433 995 l 433 1152 q 446 1169 433 1169 q 482 1167 458 1169 q 518 1165 506 1165 q 548 1166 528 1165 q 577 1166 568 1166 q 593 1156 593 1166 q 591 1117 593 1143 q 588 1079 588 1092 q 591 1043 588 1067 q 595 1008 595 1019 m 317 1004 q 298 995 317 997 q 258 995 283 994 q 231 997 229 997 q 200 996 220 997 q 169 994 179 994 q 156 1007 156 994 q 157 1039 156 1018 q 159 1071 159 1060 q 157 1112 159 1084 q 155 1153 155 1139 q 171 1168 155 1168 q 233 1167 191 1168 q 295 1166 275 1166 q 316 1152 316 1166 q 314 1115 316 1140 q 311 1078 311 1090 q 314 1041 311 1065 q 317 1004 317 1017 z "
  	},
  	"È": {
  		ha: 747,
  		x_min: 68,
  		x_max: 713,
  		o: "m 713 136 q 707 105 713 125 q 700 74 701 79 q 690 3 698 50 q 673 -9 687 -9 q 647 -7 666 -9 q 389 5 564 5 q 239 3 339 5 q 90 0 140 0 q 68 20 68 0 q 76 248 68 96 q 85 476 85 400 q 77 764 85 553 q 69 926 75 819 l 68 936 q 86 951 68 951 q 229 949 134 951 q 371 946 323 946 q 507 949 416 946 q 643 951 597 951 q 677 932 675 951 q 692 821 692 842 q 677 805 692 805 q 502 811 619 805 q 326 818 385 818 q 256 803 271 818 q 241 729 241 788 l 241 628 q 243 580 241 587 q 279 559 250 559 q 302 559 287 559 q 325 559 317 559 q 564 564 458 559 q 661 571 605 566 q 675 559 675 572 q 670 492 675 537 q 665 425 665 448 q 645 413 665 413 q 585 418 637 413 q 414 422 547 422 q 272 419 302 422 q 241 391 245 417 q 241 338 241 395 l 241 238 q 263 150 241 168 q 348 136 280 136 l 422 136 q 689 153 470 136 l 699 153 q 713 136 713 155 m 559 1046 q 549 1011 559 1040 q 536 983 540 983 q 525 981 522 983 q 211 1144 288 1093 q 204 1152 208 1146 q 244 1195 210 1164 q 288 1225 277 1225 q 413 1156 304 1225 q 555 1059 513 1093 q 559 1046 560 1055 z "
  	},
  	"Í": {
  		ha: 329,
  		x_min: 21,
  		x_max: 368,
  		o: "m 257 14 q 237 0 257 0 q 200 2 225 0 q 163 4 175 4 q 125 2 150 4 q 87 0 100 0 q 71 16 71 0 q 78 249 71 93 q 85 482 85 404 q 78 708 85 557 q 71 935 71 859 q 86 951 71 951 q 125 949 99 951 q 165 947 152 947 q 202 949 178 947 q 239 951 227 951 q 256 938 256 951 q 251 710 256 862 q 245 482 245 558 q 251 248 245 404 q 257 14 257 92 m 368 1149 q 218 1046 357 1122 q 49 972 81 972 q 28 1006 37 972 q 21 1051 21 1033 q 34 1064 21 1058 q 266 1211 146 1120 q 276 1217 269 1214 q 285 1211 279 1216 q 360 1158 314 1187 q 368 1149 363 1156 z "
  	},
  	"Î": {
  		ha: 329,
  		x_min: -30,
  		x_max: 361,
  		o: "m 257 14 q 237 0 257 0 q 200 2 225 0 q 163 4 175 4 q 125 2 150 4 q 87 0 100 0 q 71 16 71 0 q 78 249 71 93 q 85 482 85 404 q 78 708 85 557 q 71 935 71 859 q 86 951 71 951 q 125 949 99 951 q 165 947 152 947 q 202 949 178 947 q 239 951 227 951 q 256 938 256 951 q 251 710 256 862 q 245 482 245 558 q 251 248 245 404 q 257 14 257 92 m 361 1027 q 327 1007 359 1023 q 288 991 294 991 q 161 1103 269 991 q 104 1041 155 1099 q 43 992 62 992 q 4 1009 37 992 q -30 1027 -30 1025 q 61 1136 8 1071 q 115 1228 100 1194 q 130 1239 120 1239 l 201 1239 q 214 1228 210 1239 q 267 1136 224 1194 q 361 1027 313 1082 z "
  	},
  	"Ï": {
  		ha: 329,
  		x_min: -62,
  		x_max: 378,
  		o: "m 257 14 q 237 0 257 0 q 200 2 225 0 q 163 4 175 4 q 125 2 150 4 q 87 0 100 0 q 71 16 71 0 q 78 249 71 93 q 85 482 85 404 q 78 708 85 557 q 71 935 71 859 q 86 951 71 951 q 125 949 99 951 q 165 947 152 947 q 202 949 178 947 q 239 951 227 951 q 256 938 256 951 q 251 710 256 862 q 245 482 245 558 q 251 248 245 404 q 257 14 257 92 m 378 1005 q 353 994 378 994 q 293 993 333 994 q 233 992 253 992 q 216 1011 216 992 l 216 1149 q 229 1166 216 1166 q 265 1164 241 1166 q 301 1162 289 1162 q 331 1163 311 1162 q 360 1164 351 1164 q 376 1153 376 1164 q 374 1115 376 1140 q 371 1076 371 1089 q 374 1040 371 1064 q 378 1005 378 1017 m 100 1002 q 81 992 100 994 q 41 992 66 991 q 14 994 12 994 q -17 993 3 994 q -48 991 -38 991 q -61 1004 -61 991 q -60 1036 -61 1015 q -58 1068 -58 1057 q -60 1109 -58 1082 q -62 1150 -62 1137 q -46 1165 -62 1165 q 16 1164 -26 1165 q 78 1164 58 1164 q 99 1149 99 1164 q 97 1112 99 1137 q 94 1075 94 1087 q 97 1038 94 1063 q 100 1002 100 1014 z "
  	},
  	"Ì": {
  		ha: 329,
  		x_min: -16,
  		x_max: 340,
  		o: "m 257 14 q 237 0 257 0 q 200 2 225 0 q 163 4 175 4 q 125 2 150 4 q 87 0 100 0 q 71 16 71 0 q 78 249 71 93 q 85 482 85 404 q 78 708 85 557 q 71 935 71 859 q 86 951 71 951 q 125 949 99 951 q 165 947 152 947 q 202 949 178 947 q 239 951 227 951 q 256 938 256 951 q 251 710 256 862 q 245 482 245 558 q 251 248 245 404 q 257 14 257 92 m 339 1037 q 330 1002 339 1031 q 317 973 320 973 q 305 972 302 973 q -9 1135 68 1083 q -16 1143 -12 1137 q 24 1185 -9 1155 q 68 1215 58 1215 q 193 1146 85 1215 q 335 1050 293 1083 q 339 1037 340 1046 z "
  	},
  	"Ó": {
  		ha: 1007,
  		x_min: 41,
  		x_max: 966,
  		o: "m 966 476 q 838 130 966 275 q 504 -21 703 -21 q 170 129 304 -21 q 41 476 41 273 q 172 823 41 677 q 504 974 306 974 q 837 823 703 974 q 966 476 966 677 m 803 478 q 720 709 803 611 q 503 814 633 814 q 287 708 373 814 q 205 476 205 609 q 287 245 205 344 q 503 139 373 139 q 721 245 634 139 q 803 478 803 344 m 701 1159 q 551 1056 690 1131 q 382 982 414 982 q 361 1016 370 982 q 354 1061 354 1042 q 367 1074 354 1067 q 599 1221 479 1129 q 609 1227 602 1223 q 618 1221 612 1225 q 693 1168 647 1196 q 701 1159 696 1166 z "
  	},
  	"Ô": {
  		ha: 1007,
  		x_min: 41,
  		x_max: 966,
  		o: "m 966 476 q 838 130 966 275 q 504 -21 703 -21 q 170 129 304 -21 q 41 476 41 273 q 172 823 41 677 q 504 974 306 974 q 837 823 703 974 q 966 476 966 677 m 803 478 q 720 709 803 611 q 503 814 633 814 q 287 708 373 814 q 205 476 205 609 q 287 245 205 344 q 503 139 373 139 q 721 245 634 139 q 803 478 803 344 m 693 1024 q 659 1005 691 1021 q 621 989 627 989 q 494 1100 601 989 q 437 1038 487 1096 q 375 989 394 989 q 336 1006 370 989 q 302 1025 302 1023 q 393 1133 340 1068 q 448 1225 432 1192 q 463 1236 452 1236 l 534 1236 q 546 1225 543 1236 q 599 1133 557 1191 q 693 1024 646 1080 z "
  	},
  	"Ò": {
  		ha: 1007,
  		x_min: 41,
  		x_max: 966,
  		o: "m 966 476 q 838 130 966 275 q 504 -21 703 -21 q 170 129 304 -21 q 41 476 41 273 q 172 823 41 677 q 504 974 306 974 q 837 823 703 974 q 966 476 966 677 m 803 478 q 720 709 803 611 q 503 814 633 814 q 287 708 373 814 q 205 476 205 609 q 287 245 205 344 q 503 139 373 139 q 721 245 634 139 q 803 478 803 344 m 678 1048 q 669 1013 678 1042 q 656 984 659 984 q 644 983 641 984 q 330 1145 407 1094 q 323 1154 328 1147 q 363 1196 330 1166 q 408 1226 397 1226 q 532 1157 424 1226 q 674 1061 632 1094 q 678 1048 680 1057 z "
  	},
  	"Ú": {
  		ha: 917,
  		x_min: 68,
  		x_max: 848,
  		o: "m 848 937 q 841 701 848 858 q 835 465 835 544 q 836 388 835 439 q 836 312 836 337 q 810 115 836 170 q 652 1 769 31 q 449 -17 580 -17 q 138 62 212 -17 q 81 306 81 123 q 81 381 81 328 q 82 465 82 435 q 75 760 82 545 q 69 926 75 816 q 68 937 68 935 q 86 951 68 951 q 161 951 114 951 q 236 950 216 950 q 252 938 252 950 q 247 628 252 835 q 243 318 243 421 q 295 160 243 201 q 460 123 340 123 q 615 153 569 123 q 673 293 673 191 q 670 615 673 400 q 667 937 667 829 q 686 950 667 947 q 727 950 701 952 q 757 947 758 947 q 794 949 769 947 q 831 951 819 951 q 848 937 848 951 m 703 1136 q 553 1033 693 1108 q 385 959 417 959 q 363 993 372 959 q 357 1038 357 1019 q 370 1050 357 1044 q 602 1198 481 1106 q 612 1204 604 1200 q 621 1198 615 1202 q 696 1145 650 1173 q 703 1136 699 1143 z "
  	},
  	"Û": {
  		ha: 917,
  		x_min: 68,
  		x_max: 848,
  		o: "m 848 937 q 841 701 848 858 q 835 465 835 544 q 836 388 835 439 q 836 312 836 337 q 810 115 836 170 q 652 1 769 31 q 449 -17 580 -17 q 138 62 212 -17 q 81 306 81 123 q 81 381 81 328 q 82 465 82 435 q 75 760 82 545 q 69 926 75 816 q 68 937 68 935 q 86 951 68 951 q 161 951 114 951 q 236 950 216 950 q 252 938 252 950 q 247 628 252 835 q 243 318 243 421 q 295 160 243 201 q 460 123 340 123 q 615 153 569 123 q 673 293 673 191 q 670 615 673 400 q 667 937 667 829 q 686 950 667 947 q 727 950 701 952 q 757 947 758 947 q 794 949 769 947 q 831 951 819 951 q 848 937 848 951 m 664 1019 q 630 999 662 1015 q 591 983 597 983 q 465 1095 572 983 q 408 1033 458 1090 q 346 984 365 984 q 307 1001 340 984 q 273 1019 273 1017 q 364 1128 311 1063 q 418 1220 403 1186 q 433 1231 423 1231 l 505 1231 q 517 1220 513 1231 q 570 1128 528 1185 q 664 1019 616 1074 z "
  	},
  	"Ù": {
  		ha: 917,
  		x_min: 68,
  		x_max: 848,
  		o: "m 848 937 q 841 701 848 858 q 835 465 835 544 q 836 388 835 439 q 836 312 836 337 q 810 115 836 170 q 652 1 769 31 q 449 -17 580 -17 q 138 62 212 -17 q 81 306 81 123 q 81 381 81 328 q 82 465 82 435 q 75 760 82 545 q 69 926 75 816 q 68 937 68 935 q 86 951 68 951 q 161 951 114 951 q 236 950 216 950 q 252 938 252 950 q 247 628 252 835 q 243 318 243 421 q 295 160 243 201 q 460 123 340 123 q 615 153 569 123 q 673 293 673 191 q 670 615 673 400 q 667 937 667 829 q 686 950 667 947 q 727 950 701 952 q 757 947 758 947 q 794 949 769 947 q 831 951 819 951 q 848 937 848 951 m 613 1038 q 604 1003 613 1032 q 591 975 594 975 q 579 973 576 975 q 265 1136 342 1084 q 258 1144 262 1138 q 298 1186 264 1156 q 342 1217 332 1217 q 467 1147 359 1217 q 609 1051 567 1084 q 613 1038 614 1047 z "
  	},
  	"ı": {
  		ha: 306,
  		x_min: 62,
  		x_max: 241,
  		o: "m 241 627 q 234 470 241 575 q 228 311 228 364 q 230 163 228 262 q 232 16 232 64 q 220 1 232 1 l 87 1 q 73 29 73 1 q 76 170 73 76 q 78 311 78 264 q 70 470 78 364 q 62 629 62 576 q 77 640 62 640 q 114 637 89 640 q 153 633 140 633 q 191 637 165 633 q 229 640 216 640 q 241 627 241 640 z "
  	},
  	"ˆ": {
  		ha: 485,
  		x_min: 48,
  		x_max: 439,
  		o: "m 439 771 q 405 752 437 768 q 366 736 372 736 q 239 847 347 736 q 182 785 233 843 q 121 736 140 736 q 82 753 115 736 q 48 772 48 770 q 139 880 86 815 q 193 972 178 939 q 208 983 198 983 l 279 983 q 292 972 288 983 q 345 880 302 938 q 439 771 391 827 z "
  	},
  	"˜": {
  		ha: 485,
  		x_min: 25,
  		x_max: 461,
  		o: "m 461 842 q 403 794 461 826 q 317 762 345 762 q 236 786 277 762 q 175 810 195 810 q 127 787 152 810 q 98 765 102 765 q 85 771 90 765 q 25 829 25 831 q 26 835 25 831 q 84 889 37 863 q 161 914 130 914 q 244 892 195 914 q 315 869 294 869 q 363 893 328 869 q 404 917 399 917 l 411 914 q 461 842 461 863 z "
  	},
  	"¯": {
  		ha: 485,
  		x_min: 25,
  		x_max: 472,
  		o: "m 472 893 q 460 840 472 890 q 450 785 456 814 q 410 777 447 778 q 341 777 385 776 q 292 779 290 779 q 168 774 250 779 q 45 768 85 768 q 25 787 25 768 q 45 851 25 803 q 75 899 64 899 q 144 895 98 899 q 214 892 191 892 q 337 897 255 892 q 460 901 419 901 q 472 893 472 901 z "
  	},
  	"˘": {
  		ha: 485,
  		x_min: 32,
  		x_max: 444,
  		o: "m 444 940 q 390 784 444 844 q 239 721 334 721 q 86 783 143 721 q 32 940 32 844 q 52 951 32 951 q 121 939 119 951 q 130 903 124 927 q 239 823 157 823 q 347 901 319 823 q 355 939 349 914 q 382 949 359 949 q 444 940 444 949 z "
  	},
  	"˙": {
  		ha: 485,
  		x_min: 141,
  		x_max: 320,
  		o: "m 320 783 q 294 764 320 764 l 168 764 q 142 802 142 764 q 142 862 142 822 q 141 922 141 903 q 153 947 141 943 q 168 949 158 949 q 222 948 186 949 q 275 947 258 947 q 309 943 302 947 q 317 912 317 937 q 317 882 317 902 q 317 852 317 863 q 318 818 317 841 q 320 783 320 794 z "
  	},
  	"˚": {
  		ha: 485,
  		x_min: 78,
  		x_max: 401,
  		o: "m 401 832 q 353 720 401 766 q 239 673 305 673 q 125 720 173 673 q 78 832 78 766 q 125 947 78 899 q 239 994 172 994 q 354 947 307 994 q 401 832 401 899 m 321 832 q 298 894 321 868 q 239 920 275 920 q 180 894 203 920 q 157 832 157 868 q 181 775 157 800 q 237 750 205 750 q 296 774 271 750 q 321 832 321 798 z "
  	},
  	"¸": {
  		ha: 485,
  		x_min: 39,
  		x_max: 340,
  		o: "m 340 -77 q 292 -219 340 -165 q 153 -275 241 -275 q 85 -254 127 -275 q 39 -213 39 -233 q 74 -170 39 -211 q 112 -128 109 -128 q 114 -129 113 -128 q 175 -158 144 -158 q 218 -138 199 -158 q 237 -93 237 -117 q 205 -18 237 -52 l 297 -20 q 340 -77 312 -38 z "
  	},
  	"˝": {
  		ha: 485,
  		x_min: 14,
  		x_max: 515,
  		o: "m 515 941 q 504 926 515 936 q 347 829 446 876 q 174 766 255 786 q 162 765 166 765 q 140 799 146 765 q 25 748 63 748 q 14 758 14 748 q 16 773 14 763 q 18 789 18 784 q 17 806 18 795 q 15 822 15 817 q 26 835 15 830 q 279 986 109 869 q 294 995 284 990 q 324 968 302 991 q 354 945 347 945 q 393 973 362 945 q 430 1002 424 1002 q 475 973 435 1002 q 515 941 515 945 z "
  	},
  	"˛": {
  		ha: 485,
  		x_min: 110,
  		x_max: 398,
  		o: "m 398 -162 q 334 -224 378 -199 q 246 -248 290 -248 q 148 -211 186 -248 q 110 -115 110 -174 q 113 -82 110 -100 q 159 -36 124 -66 q 210 -3 197 -3 l 301 -3 q 214 -111 214 -60 q 260 -152 214 -152 q 319 -133 292 -152 q 348 -113 347 -113 q 376 -135 354 -113 q 398 -162 398 -157 z "
  	},
  	"ˇ": {
  		ha: 485,
  		x_min: 45,
  		x_max: 435,
  		o: "m 435 953 q 345 844 397 910 q 290 753 306 787 q 275 742 285 742 l 204 742 q 192 753 195 742 q 139 844 180 787 q 45 954 92 898 q 79 974 46 958 q 117 989 111 989 q 244 878 137 989 q 301 940 251 882 q 362 988 344 988 q 401 972 368 988 q 435 953 435 956 z "
  	},
  	"Ł": {
  		ha: 718,
  		x_min: -1,
  		x_max: 710,
  		o: "m 710 147 q 700 12 710 52 q 676 -7 695 -7 q 526 -2 626 -7 q 375 4 425 4 q 233 2 328 4 q 92 0 139 0 q 75 17 75 0 q 80 240 75 91 q 85 464 85 389 q 78 700 85 543 q 71 935 71 857 q 87 950 71 950 q 125 948 100 950 q 163 946 150 946 q 201 948 175 946 q 239 950 227 950 q 255 937 255 950 q 250 721 255 865 q 244 504 244 576 q 244 397 244 469 q 243 290 243 325 q 256 139 243 139 q 633 151 506 139 q 665 156 640 152 q 696 160 685 160 q 710 147 710 160 m 492 519 q 479 507 492 513 q 309 438 422 484 q 22 322 214 399 q 16 321 19 321 q 1 335 7 321 l -1 444 q 12 458 -1 452 q 465 640 463 640 q 475 628 473 640 q 492 519 492 536 z "
  	},
  	"ł": {
  		ha: 306,
  		x_min: -28,
  		x_max: 399,
  		o: "m 274 941 l 273 932 q 258 498 258 680 q 261 257 258 418 q 264 16 264 96 q 253 0 264 0 l 123 0 q 111 16 111 0 q 113 257 111 96 q 114 498 114 418 q 107 719 114 572 q 100 938 100 865 q 114 951 100 951 q 151 949 126 951 q 187 947 175 947 q 225 949 200 947 q 262 951 250 951 q 274 941 275 951 m 399 495 q 386 488 399 493 q -9 332 251 432 q -25 346 -19 332 l -28 456 q -14 469 -28 464 q 372 621 360 621 q 382 608 380 621 q 399 495 399 518 z "
  	},
  	"Š": {
  		ha: 648,
  		x_min: 75,
  		x_max: 614,
  		o: "m 614 883 q 576 815 600 861 q 550 755 569 794 q 539 749 546 749 q 474 773 540 749 q 365 798 408 798 q 240 688 240 798 q 328 581 240 627 q 490 493 475 505 q 578 304 578 423 q 458 65 578 153 q 193 -14 350 -14 q 114 3 119 -14 q 102 78 111 28 q 85 139 96 98 q 83 151 83 145 q 93 160 83 160 q 143 157 109 160 q 193 153 176 153 q 404 289 404 153 q 319 404 404 355 q 161 496 164 492 q 75 682 75 565 q 158 884 75 808 q 367 957 239 957 q 492 939 421 957 q 607 892 568 920 q 614 883 610 889 m 560 1197 q 469 1088 522 1154 q 415 997 431 1031 q 400 986 410 986 l 329 986 q 317 997 320 986 q 264 1088 305 1031 q 170 1198 216 1142 q 203 1218 171 1202 q 241 1234 236 1234 q 369 1122 262 1234 q 426 1184 376 1126 q 487 1232 469 1232 q 526 1216 493 1232 q 560 1197 559 1200 z "
  	},
  	"š": {
  		ha: 415,
  		x_min: 14,
  		x_max: 405,
  		o: "m 387 209 q 306 47 387 108 q 127 -9 233 -9 q 81 -7 87 -9 q 70 26 70 -1 q 66 71 70 41 q 62 115 62 101 q 75 127 62 124 q 100 127 83 129 q 120 125 121 125 q 248 203 248 125 q 192 272 248 241 q 87 334 100 322 q 31 460 31 382 q 107 618 31 562 q 282 669 176 669 q 296 661 292 669 q 313 606 300 652 q 326 550 326 559 q 313 541 326 543 q 225 529 269 534 q 173 472 173 515 q 228 410 173 441 q 331 345 309 365 q 387 209 387 292 m 405 911 q 314 803 367 869 q 260 711 275 745 q 245 701 254 701 l 174 701 q 161 711 165 701 q 109 803 150 745 q 14 912 61 857 q 48 932 16 916 q 86 948 81 948 q 214 836 106 948 q 271 899 220 841 q 332 947 313 947 q 371 930 338 947 q 405 911 404 914 z "
  	},
  	"Ž": {
  		ha: 701,
  		x_min: 26,
  		x_max: 662,
  		o: "m 662 155 q 653 83 662 132 q 644 9 644 34 q 628 -5 644 -5 q 507 -3 587 -5 q 386 0 427 0 l 64 0 q 41 14 45 0 q 26 127 26 90 q 233 459 26 134 q 439 800 439 783 q 422 807 439 807 l 61 807 q 47 821 47 807 q 57 882 47 826 q 70 948 67 939 q 85 957 72 957 q 164 952 112 957 q 241 947 216 947 l 623 947 q 637 936 635 947 q 648 835 648 895 q 433 494 648 831 q 218 146 218 157 q 231 142 221 142 q 532 150 427 142 q 593 157 545 151 q 653 163 631 163 q 662 155 662 163 m 549 1189 q 458 1080 511 1146 q 404 989 420 1023 q 389 978 399 978 l 318 978 q 306 989 309 978 q 253 1080 294 1023 q 159 1190 205 1134 q 193 1210 160 1194 q 231 1225 225 1225 q 358 1114 251 1225 q 415 1176 365 1118 q 476 1224 458 1224 q 515 1208 482 1224 q 549 1189 549 1192 z "
  	},
  	"ž": {
  		ha: 585,
  		x_min: 21,
  		x_max: 572,
  		o: "m 572 129 q 562 81 572 125 q 550 21 551 33 q 538 -3 547 -3 q 474 0 514 -3 q 411 4 429 3 q 281 5 366 5 q 135 0 215 5 q 49 -7 35 -7 q 31 5 35 -7 q 21 81 21 38 q 22 99 21 87 q 22 115 22 110 q 37 138 22 125 q 182 292 52 151 q 368 503 248 360 l 69 503 q 58 517 58 503 q 67 575 58 536 q 75 633 75 614 q 94 642 75 642 q 208 638 132 642 q 321 635 283 635 q 530 632 507 635 q 547 618 547 630 q 539 503 547 515 q 422 369 532 493 q 207 129 351 288 q 557 135 433 135 q 572 129 572 135 m 503 895 q 412 786 465 852 q 358 694 374 728 q 343 684 353 684 l 272 684 q 260 694 263 684 q 207 786 248 728 q 113 895 159 840 q 146 915 114 899 q 184 931 179 931 q 312 819 205 931 q 369 882 319 824 q 430 930 412 930 q 469 913 436 930 q 503 895 503 897 z "
  	},
  	"¦": {
  		ha: 340,
  		x_min: 107,
  		x_max: 232,
  		o: "m 232 481 q 224 473 232 474 q 119 464 163 464 q 114 471 114 464 l 114 761 q 111 896 114 806 q 107 1031 107 986 q 181 1052 107 1052 q 225 1042 224 1052 q 223 961 223 1057 l 224 770 q 228 625 224 723 q 232 481 232 530 m 232 -220 q 224 -229 232 -228 q 119 -238 163 -238 q 114 -231 114 -238 l 114 59 q 111 194 114 104 q 107 329 107 284 q 181 351 107 351 q 225 340 224 351 q 223 259 223 355 l 224 68 q 228 -77 224 22 q 232 -220 232 -172 z "
  	},
  	"Ð": {
  		ha: 945,
  		x_min: -18,
  		x_max: 905,
  		o: "m 905 481 q 797 151 905 290 q 494 0 679 0 q 388 3 459 0 q 282 5 317 5 q 186 3 250 5 q 90 0 122 0 q 73 17 73 0 q 79 240 73 91 q 85 464 85 389 q 79 701 85 543 q 74 937 74 859 q 92 951 74 951 q 166 951 117 951 q 241 950 216 950 q 312 951 264 950 q 384 951 359 951 q 734 863 619 951 q 863 691 817 799 q 905 481 905 591 m 739 481 q 656 720 739 627 q 424 815 569 815 q 327 817 304 815 q 248 787 248 812 q 245 631 248 735 q 243 475 243 527 q 245 320 243 423 q 248 165 248 217 q 329 136 248 140 q 428 136 318 136 q 552 153 506 136 q 654 228 609 173 q 739 481 739 331 m 443 530 q 427 468 443 541 q 418 410 425 448 q 401 403 416 403 q 299 404 368 403 q 197 406 231 406 q 98 401 164 406 q 0 396 33 396 q -18 416 -18 396 q 21 532 -18 439 q 40 542 25 542 q 429 547 83 542 q 443 530 443 541 z "
  	},
  	"ð": {
  		ha: 772,
  		x_min: 28,
  		x_max: 806,
  		o: "m 721 946 q 713 684 721 859 q 705 422 705 509 q 717 17 705 155 l 718 8 q 699 -1 718 1 q 663 -1 686 -2 q 636 1 634 1 q 606 -1 626 1 q 576 -3 587 -3 q 565 44 567 -3 q 560 92 564 92 q 550 83 556 90 q 336 -17 457 -17 q 111 87 199 -17 q 28 325 28 186 q 112 568 28 469 q 342 671 200 671 q 491 621 427 671 q 549 570 520 595 q 554 579 554 572 l 554 799 q 552 867 554 821 q 550 935 550 912 q 561 951 550 951 q 635 956 586 951 q 709 960 685 960 q 721 946 721 960 m 551 329 q 501 472 551 410 q 368 538 448 538 q 231 473 285 538 q 179 326 179 412 q 233 184 179 245 q 368 121 288 121 q 503 185 450 121 q 551 329 551 245 m 806 852 q 791 787 806 857 q 783 736 789 764 q 407 724 777 724 q 392 742 392 724 q 427 846 392 775 q 444 854 431 854 q 619 857 503 854 q 793 860 735 860 q 806 852 806 860 z "
  	},
  	"Ý": {
  		ha: 815,
  		x_min: 24,
  		x_max: 794,
  		o: "m 794 696 q 673 491 794 657 q 514 283 593 387 q 494 231 494 258 q 498 121 494 194 q 502 12 502 48 q 485 0 502 0 l 323 0 q 310 20 310 0 q 315 125 310 54 q 319 231 319 195 q 302 285 319 261 q 157 475 254 348 q 37 647 74 588 q 25 686 25 667 q 24 933 24 772 q 40 951 24 951 q 74 949 52 951 q 109 947 97 947 q 149 949 122 947 q 191 951 176 951 q 203 941 203 951 q 199 827 203 903 q 195 713 195 751 q 410 427 195 672 q 526 570 460 484 q 618 711 618 688 q 612 822 618 748 q 607 933 607 897 q 623 951 607 951 q 660 949 635 951 q 697 947 685 947 q 736 949 710 947 q 775 951 762 951 q 791 929 791 951 q 793 812 791 890 q 794 696 794 734 m 623 1151 q 473 1048 612 1123 q 304 974 336 974 q 283 1008 292 974 q 276 1053 276 1034 q 289 1065 276 1059 q 521 1213 401 1121 q 531 1219 524 1215 q 540 1213 534 1217 q 615 1160 569 1188 q 623 1151 618 1158 z "
  	},
  	"Þ": {
  		ha: 867,
  		x_min: 68,
  		x_max: 839,
  		o: "m 839 517 q 751 268 839 358 q 507 178 664 178 q 390 180 468 178 q 272 183 311 183 q 250 155 250 183 q 255 82 250 131 q 259 9 259 34 q 246 -2 259 -2 q 203 1 232 -2 q 160 4 174 4 q 124 2 148 4 q 89 0 100 0 q 72 21 72 0 q 78 244 72 95 q 85 468 85 393 q 69 922 85 645 l 69 930 q 92 951 68 951 q 129 949 104 951 q 165 947 153 947 q 202 949 178 947 q 239 951 227 951 q 256 938 256 951 q 250 847 256 923 q 296 846 273 846 q 398 850 330 846 q 498 854 465 854 q 744 761 648 854 q 839 517 839 667 m 668 507 q 612 663 668 606 q 456 720 555 720 q 345 714 425 720 q 250 703 253 708 q 245 484 245 695 q 247 405 245 457 q 249 326 249 353 q 264 317 249 320 q 471 310 301 310 q 668 507 668 310 z "
  	},
  	"þ": {
  		ha: 798,
  		x_min: 71,
  		x_max: 761,
  		o: "m 761 326 q 675 88 761 189 q 449 -18 583 -18 q 300 37 369 -18 q 243 92 272 64 q 237 -191 237 85 q 222 -212 237 -212 q 98 -210 117 -212 q 83 -192 83 -208 q 85 68 83 -105 q 86 329 86 242 q 78 634 86 431 q 71 939 71 838 q 89 958 71 956 q 161 961 113 959 q 200 966 171 962 q 239 970 224 970 q 250 954 250 970 q 247 884 250 931 q 243 812 243 836 q 241 701 243 775 q 239 589 239 627 q 243 563 239 563 q 254 572 248 566 q 446 669 349 669 q 673 564 581 669 q 761 326 761 463 m 603 329 q 552 472 603 410 q 418 538 498 538 q 289 470 339 538 q 243 328 243 409 q 291 184 243 245 q 424 118 342 118 q 554 186 500 118 q 603 329 603 250 z "
  	},
  	"­": {
  		ha: 561,
  		x_min: 23,
  		x_max: 532,
  		o: "m 532 471 q 522 350 532 462 q 513 345 520 345 q 390 347 472 345 q 267 349 308 349 q 35 345 267 349 q 23 354 23 345 q 29 412 23 362 q 32 475 29 441 q 47 482 37 482 q 160 478 85 482 q 272 473 235 473 q 396 476 313 473 q 519 479 478 479 q 532 471 532 479 z "
  	},
  	"¹": {
  		ha: 335,
  		x_min: 27,
  		x_max: 277,
  		o: "m 277 814 l 275 806 q 264 532 264 689 q 265 410 264 491 q 266 287 266 328 q 248 269 266 269 q 188 268 228 269 q 128 267 149 267 q 113 277 113 267 q 117 464 113 339 q 122 652 122 589 q 117 663 122 663 q 78 655 104 663 q 39 648 52 648 q 27 654 27 648 q 27 740 27 738 q 39 750 27 746 q 102 788 69 762 q 130 815 104 789 q 157 838 154 838 q 269 823 208 838 q 277 814 277 821 z "
  	},
  	"²": {
  		ha: 532,
  		x_min: 18,
  		x_max: 503,
  		o: "m 503 268 q 486 258 503 258 q 381 261 451 258 q 276 265 311 265 q 168 264 240 265 q 58 262 95 262 q 44 272 47 262 q 31 370 31 312 q 43 384 31 382 q 114 404 66 387 q 311 637 311 517 q 210 703 311 703 q 104 671 167 703 q 50 640 42 640 q 44 641 46 640 q 30 697 42 642 q 18 761 18 753 q 125 811 29 786 q 250 833 208 833 q 399 798 340 833 q 471 671 471 755 q 243 385 471 519 l 264 385 q 486 396 353 383 l 492 396 q 500 385 500 396 q 499 354 500 374 q 498 323 498 333 q 500 296 498 314 q 503 268 503 277 z "
  	},
  	"³": {
  		ha: 525,
  		x_min: 27,
  		x_max: 478,
  		o: "m 478 423 q 404 290 478 334 q 248 254 343 254 q 37 292 135 254 q 27 300 27 296 q 28 306 27 302 q 41 339 33 317 q 52 393 44 357 q 61 404 55 404 q 68 401 64 403 q 212 366 153 366 q 294 376 270 366 q 332 440 332 393 q 206 517 332 517 q 162 515 190 517 q 124 514 134 514 q 94 525 94 514 q 110 616 94 616 q 176 611 132 616 q 241 607 220 607 q 302 661 302 607 q 199 722 302 722 q 99 708 139 722 q 70 695 89 703 q 63 694 67 694 q 57 705 59 694 q 52 787 52 731 q 134 822 52 810 q 239 831 191 831 q 382 799 319 831 q 462 686 462 759 q 393 562 462 593 q 478 423 478 520 z "
  	},
  	"½": {
  		ha: 1086,
  		x_min: 27,
  		x_max: 998,
  		o: "m 277 814 l 275 806 q 264 532 264 689 q 265 410 264 491 q 266 287 266 328 q 248 269 266 269 q 188 268 228 269 q 128 267 149 267 q 113 277 113 267 q 117 464 113 339 q 122 652 122 589 q 117 663 122 663 q 78 655 104 663 q 39 648 52 648 q 27 654 27 648 q 27 740 27 738 q 39 750 27 746 q 102 788 69 762 q 130 815 104 789 q 157 838 154 838 q 269 823 208 838 q 277 814 277 821 m 703 789 q 699 777 703 786 q 472 380 621 646 q 252 -41 401 238 q 240 -53 245 -53 q 192 -18 237 -53 q 147 22 147 18 q 151 32 147 26 q 603 851 439 525 q 612 860 608 860 q 663 829 623 860 q 703 789 703 798 m 998 7 q 981 -3 998 -3 q 876 0 945 -3 q 770 4 806 4 q 662 3 734 4 q 553 1 589 1 q 538 11 541 1 q 526 109 526 51 q 537 123 526 121 q 608 142 561 126 q 805 376 805 256 q 705 441 805 441 q 599 410 661 441 q 544 379 536 379 q 538 380 541 379 q 525 436 536 381 q 513 500 513 492 q 619 550 524 525 q 744 572 703 572 q 894 537 835 572 q 966 410 966 494 q 738 124 966 258 l 758 124 q 980 135 848 122 l 987 135 q 995 123 995 135 q 994 93 995 113 q 992 62 992 72 q 995 35 992 53 q 998 7 998 16 z "
  	},
  	"¼": {
  		ha: 1086,
  		x_min: 27,
  		x_max: 987,
  		o: "m 277 814 l 275 806 q 264 532 264 689 q 265 410 264 491 q 266 287 266 328 q 248 269 266 269 q 188 268 228 269 q 128 267 149 267 q 113 277 113 267 q 117 464 113 339 q 122 652 122 589 q 117 663 122 663 q 78 655 104 663 q 39 648 52 648 q 27 654 27 648 q 27 740 27 738 q 39 750 27 746 q 102 788 69 762 q 130 815 104 789 q 157 838 154 838 q 269 823 208 838 q 277 814 277 821 m 731 789 q 726 777 731 786 q 500 380 649 646 q 280 -41 429 238 q 268 -53 273 -53 q 220 -18 264 -53 q 175 22 175 18 q 178 32 175 26 q 631 851 467 525 q 640 860 635 860 q 691 829 650 860 q 731 789 731 798 m 987 107 q 928 100 987 100 q 911 85 911 100 q 913 44 911 72 q 916 2 916 16 q 837 -13 916 -13 q 751 -3 751 -13 q 757 43 751 12 q 762 90 762 74 q 754 100 762 100 q 636 97 715 100 q 517 95 557 95 q 489 121 494 95 q 487 165 487 129 q 496 221 487 211 q 632 387 557 288 q 758 559 695 473 q 774 570 766 570 q 902 545 828 570 q 918 528 918 541 q 915 457 918 505 q 911 387 911 410 q 910 317 911 366 q 909 248 909 273 l 909 212 q 944 214 921 212 q 978 216 967 216 q 987 208 987 216 q 987 157 987 191 q 987 107 987 124 m 779 429 l 779 432 q 685 307 764 406 q 610 212 648 260 q 653 208 613 208 q 767 210 724 208 q 774 302 768 238 q 780 395 780 362 q 779 429 780 413 z "
  	},
  	"¾": {
  		ha: 1086,
  		x_min: -4,
  		x_max: 1059,
  		o: "m 876 789 q 871 777 876 786 q 644 380 793 646 q 425 -41 574 238 q 412 -53 418 -53 q 364 -18 409 -53 q 319 22 319 18 q 323 32 319 26 q 775 851 612 525 q 785 860 780 860 q 835 829 795 860 q 876 789 876 798 m 1059 107 q 1000 100 1059 100 q 983 85 983 100 q 985 44 983 72 q 988 2 988 16 q 909 -13 988 -13 q 823 -3 823 -13 q 829 43 823 12 q 834 90 834 74 q 826 100 834 100 q 708 97 787 100 q 589 95 629 95 q 561 121 566 95 q 559 165 559 129 q 568 221 559 211 q 704 387 629 288 q 830 559 767 473 q 846 570 838 570 q 974 545 900 570 q 990 528 990 541 q 986 457 990 505 q 983 387 983 410 q 982 317 983 366 q 981 248 981 273 l 981 212 q 1016 214 993 212 q 1050 216 1039 216 q 1059 208 1059 216 q 1059 157 1059 191 q 1059 107 1059 124 m 850 429 l 850 432 q 757 307 836 406 q 682 212 720 260 q 725 208 685 208 q 839 210 795 208 q 846 302 840 238 q 852 395 852 362 q 850 429 852 413 m 447 423 q 373 290 447 334 q 217 254 312 254 q 6 292 104 254 q -4 300 -4 296 q -3 306 -4 302 q 10 339 2 317 q 20 393 13 357 q 30 404 24 404 q 37 401 33 403 q 181 366 122 366 q 263 376 239 366 q 301 440 301 393 q 175 517 301 517 q 131 515 159 517 q 93 514 102 514 q 63 525 63 514 q 79 616 63 616 q 144 611 100 616 q 210 607 189 607 q 271 661 271 607 q 168 722 271 722 q 68 708 108 722 q 39 695 58 703 q 32 694 36 694 q 26 705 28 694 q 20 787 20 731 q 103 822 20 810 q 208 831 159 831 q 351 799 288 831 q 431 686 431 759 q 362 562 431 593 q 447 423 447 520 z "
  	},
  	"ý": {
  		ha: 661,
  		x_min: 24,
  		x_max: 640,
  		o: "m 640 472 q 633 334 640 357 q 466 67 625 303 q 277 -196 307 -168 q 102 -220 250 -220 q 79 -217 84 -220 q 56 -168 74 -213 q 38 -113 38 -122 q 74 -98 38 -98 q 186 -77 150 -98 q 223 -30 198 -69 q 248 23 248 9 q 149 166 248 41 q 33 334 45 298 q 24 467 24 361 q 24 544 24 492 q 25 623 25 596 q 41 637 25 637 q 105 635 63 637 q 170 632 148 632 q 180 618 180 632 q 178 561 180 599 q 176 504 176 523 q 182 380 176 421 q 256 252 186 355 q 342 150 326 150 q 415 251 353 150 q 481 375 477 351 q 486 498 486 409 q 482 556 486 518 q 478 614 478 595 q 489 631 478 631 q 554 634 511 631 q 620 637 598 637 q 640 472 640 637 m 534 892 q 384 789 524 865 q 215 715 248 715 q 194 749 203 715 q 187 794 187 776 q 200 807 187 801 q 432 954 312 863 q 442 960 435 957 q 451 954 446 959 q 526 901 480 930 q 534 892 530 899 z "
  	},
  	"×": {
  		ha: 561,
  		x_min: 42,
  		x_max: 503,
  		o: "m 503 553 q 491 530 503 541 l 363 401 l 490 274 q 502 250 502 262 q 472 201 502 232 q 423 171 441 171 q 401 182 412 171 l 272 311 l 144 183 q 122 172 134 172 q 73 202 103 172 q 42 250 42 231 q 53 273 42 261 l 182 401 l 54 529 q 43 551 43 540 q 73 601 43 571 q 121 631 102 631 q 144 621 132 631 l 272 492 l 400 619 q 423 631 412 631 q 472 601 441 631 q 503 553 503 571 z "
  	},
  	"⁴": {
  		ha: 552,
  		x_min: 26,
  		x_max: 526,
  		o: "m 526 379 q 467 372 526 372 q 450 357 450 372 q 452 316 450 344 q 455 274 455 288 q 376 259 455 259 q 290 269 290 259 q 296 315 290 284 q 301 361 301 346 q 293 372 301 372 q 175 369 254 372 q 56 367 96 367 q 28 393 33 367 q 26 437 26 401 q 35 493 26 483 q 171 659 96 559 q 297 831 234 745 q 313 842 304 842 q 441 817 367 842 q 457 800 457 812 q 453 729 457 777 q 450 659 450 682 q 449 589 450 638 q 448 520 448 545 l 448 484 q 483 486 460 484 q 517 488 506 488 q 526 480 526 488 q 526 429 526 463 q 526 379 526 396 m 317 701 l 317 704 q 224 578 302 678 q 149 484 186 532 q 192 479 152 479 q 306 481 262 479 q 313 574 307 510 q 319 667 319 634 q 317 701 319 685 z "
  	},
  	"€": {
  		ha: 642,
  		x_min: 43,
  		x_max: 595,
  		o: "m 595 4 q 583 -15 595 -11 q 521 -22 561 -22 q 283 51 387 -22 q 135 251 178 124 q 57 249 89 249 q 44 259 44 249 q 50 359 44 334 q 62 368 52 368 q 111 368 85 368 q 110 409 110 388 q 112 452 110 431 q 57 452 81 452 q 43 466 43 452 q 50 566 43 538 q 64 576 52 576 q 140 575 96 576 q 292 766 186 695 q 523 836 396 836 q 576 831 549 836 q 588 820 588 828 q 587 797 588 820 q 585 758 585 773 q 586 725 585 748 q 587 700 587 703 q 574 688 587 686 q 523 694 528 694 q 302 570 375 694 q 426 572 343 570 q 550 574 509 574 q 562 562 562 574 q 554 458 562 509 q 547 450 553 450 q 414 453 503 450 q 279 457 325 457 l 264 457 q 261 409 261 433 q 264 363 261 385 q 301 363 284 363 q 427 365 343 363 q 553 367 511 367 q 563 356 563 367 q 555 256 563 347 q 547 248 553 248 l 541 249 q 296 256 411 256 q 529 118 369 118 q 587 124 562 118 q 595 115 595 126 q 594 89 595 111 q 593 60 593 68 q 594 32 593 54 q 595 4 595 10 z "
  	}
  };
  var familyName = "Berlin Sans FB";
  var ascender = 1244;
  var descender = -282;
  var underlinePosition = -176;
  var underlineThickness = 69;
  var boundingBox = {
  	yMin: -282,
  	xMin: -71,
  	yMax: 1244,
  	xMax: 1492
  };
  var resolution = 1000;
  var original_font_information = {
  	format: 0,
  	copyright: "Copyright (c) 1997 The Font Bureau, Inc. All rights reserved. Designed by David Berlow.",
  	fontFamily: "Berlin Sans FB",
  	fontSubfamily: "Regular",
  	uniqueID: "FB Berlin Sans FB Regular",
  	fullName: "Berlin Sans FB",
  	version: "Version 1.00",
  	postScriptName: "BerlinSansFB-Reg",
  	trademark: "Copyright (c) 1985, 1987, 1988, 1989 The Font Bureau, Inc. All rights reserved. Berlin Sans is a trademark of The Font Bureau, Inc.",
  	manufacturer: "The Font Bureau, Inc.",
  	designer: "David Berlow",
  	description: "Berlin Sans is based on a brilliant alphabet from the late twenties, the first sans that Lucian Bernhard ever designed, imaginative and little-known. Assisted by Matthew Butterick, David Berlow expanded the single font into a series of four weights, all four complete with Expert character sets, plus one dingbat font.",
  	manufacturerURL: "http://www.fontbureau.com",
  	designerURL: "http://www.fontbureau.com/designers/"
  };
  var cssFontWeight = "normal";
  var cssFontStyle = "normal";
  var RobotoRegular = {
  	glyphs: glyphs,
  	familyName: familyName,
  	ascender: ascender,
  	descender: descender,
  	underlinePosition: underlinePosition,
  	underlineThickness: underlineThickness,
  	boundingBox: boundingBox,
  	resolution: resolution,
  	original_font_information: original_font_information,
  	cssFontWeight: cssFontWeight,
  	cssFontStyle: cssFontStyle
  };

  /**
   * https://opentype.js.org v1.3.4 | (c) Frederik De Bleser and other contributors | MIT License | Uses tiny-inflate by Devon Govett and string.prototype.codepointat polyfill by Mathias Bynens
   */

  /*! https://mths.be/codepointat v0.2.0 by @mathias */
  if (!String.prototype.codePointAt) {
  	(function() {
  		var defineProperty = (function() {
  			// IE 8 only supports `Object.defineProperty` on DOM elements
  			try {
  				var object = {};
  				var $defineProperty = Object.defineProperty;
  				var result = $defineProperty(object, object, object) && $defineProperty;
  			} catch(error) {}
  			return result;
  		}());
  		var codePointAt = function(position) {
  			if (this == null) {
  				throw TypeError();
  			}
  			var string = String(this);
  			var size = string.length;
  			// `ToInteger`
  			var index = position ? Number(position) : 0;
  			if (index != index) { // better `isNaN`
  				index = 0;
  			}
  			// Account for out-of-bounds indices:
  			if (index < 0 || index >= size) {
  				return undefined;
  			}
  			// Get the first code unit
  			var first = string.charCodeAt(index);
  			var second;
  			if ( // check if it’s the start of a surrogate pair
  				first >= 0xD800 && first <= 0xDBFF && // high surrogate
  				size > index + 1 // there is a next code unit
  			) {
  				second = string.charCodeAt(index + 1);
  				if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
  					// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
  					return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
  				}
  			}
  			return first;
  		};
  		if (defineProperty) {
  			defineProperty(String.prototype, 'codePointAt', {
  				'value': codePointAt,
  				'configurable': true,
  				'writable': true
  			});
  		} else {
  			String.prototype.codePointAt = codePointAt;
  		}
  	}());
  }

  var TINF_OK = 0;
  var TINF_DATA_ERROR = -3;

  function Tree() {
    this.table = new Uint16Array(16);   /* table of code length counts */
    this.trans = new Uint16Array(288);  /* code -> symbol translation table */
  }

  function Data(source, dest) {
    this.source = source;
    this.sourceIndex = 0;
    this.tag = 0;
    this.bitcount = 0;
    
    this.dest = dest;
    this.destLen = 0;
    
    this.ltree = new Tree();  /* dynamic length/symbol tree */
    this.dtree = new Tree();  /* dynamic distance tree */
  }

  /* --------------------------------------------------- *
   * -- uninitialized global data (static structures) -- *
   * --------------------------------------------------- */

  var sltree = new Tree();
  var sdtree = new Tree();

  /* extra bits and base tables for length codes */
  var length_bits = new Uint8Array(30);
  var length_base = new Uint16Array(30);

  /* extra bits and base tables for distance codes */
  var dist_bits = new Uint8Array(30);
  var dist_base = new Uint16Array(30);

  /* special ordering of code length codes */
  var clcidx = new Uint8Array([
    16, 17, 18, 0, 8, 7, 9, 6,
    10, 5, 11, 4, 12, 3, 13, 2,
    14, 1, 15
  ]);

  /* used by tinf_decode_trees, avoids allocations every call */
  var code_tree = new Tree();
  var lengths = new Uint8Array(288 + 32);

  /* ----------------------- *
   * -- utility functions -- *
   * ----------------------- */

  /* build extra bits and base tables */
  function tinf_build_bits_base(bits, base, delta, first) {
    var i, sum;

    /* build bits table */
    for (i = 0; i < delta; ++i) { bits[i] = 0; }
    for (i = 0; i < 30 - delta; ++i) { bits[i + delta] = i / delta | 0; }

    /* build base table */
    for (sum = first, i = 0; i < 30; ++i) {
      base[i] = sum;
      sum += 1 << bits[i];
    }
  }

  /* build the fixed huffman trees */
  function tinf_build_fixed_trees(lt, dt) {
    var i;

    /* build fixed length tree */
    for (i = 0; i < 7; ++i) { lt.table[i] = 0; }

    lt.table[7] = 24;
    lt.table[8] = 152;
    lt.table[9] = 112;

    for (i = 0; i < 24; ++i) { lt.trans[i] = 256 + i; }
    for (i = 0; i < 144; ++i) { lt.trans[24 + i] = i; }
    for (i = 0; i < 8; ++i) { lt.trans[24 + 144 + i] = 280 + i; }
    for (i = 0; i < 112; ++i) { lt.trans[24 + 144 + 8 + i] = 144 + i; }

    /* build fixed distance tree */
    for (i = 0; i < 5; ++i) { dt.table[i] = 0; }

    dt.table[5] = 32;

    for (i = 0; i < 32; ++i) { dt.trans[i] = i; }
  }

  /* given an array of code lengths, build a tree */
  var offs = new Uint16Array(16);

  function tinf_build_tree(t, lengths, off, num) {
    var i, sum;

    /* clear code length count table */
    for (i = 0; i < 16; ++i) { t.table[i] = 0; }

    /* scan symbol lengths, and sum code length counts */
    for (i = 0; i < num; ++i) { t.table[lengths[off + i]]++; }

    t.table[0] = 0;

    /* compute offset table for distribution sort */
    for (sum = 0, i = 0; i < 16; ++i) {
      offs[i] = sum;
      sum += t.table[i];
    }

    /* create code->symbol translation table (symbols sorted by code) */
    for (i = 0; i < num; ++i) {
      if (lengths[off + i]) { t.trans[offs[lengths[off + i]]++] = i; }
    }
  }

  /* ---------------------- *
   * -- decode functions -- *
   * ---------------------- */

  /* get one bit from source stream */
  function tinf_getbit(d) {
    /* check if tag is empty */
    if (!d.bitcount--) {
      /* load next tag */
      d.tag = d.source[d.sourceIndex++];
      d.bitcount = 7;
    }

    /* shift bit out of tag */
    var bit = d.tag & 1;
    d.tag >>>= 1;

    return bit;
  }

  /* read a num bit value from a stream and add base */
  function tinf_read_bits(d, num, base) {
    if (!num)
      { return base; }

    while (d.bitcount < 24) {
      d.tag |= d.source[d.sourceIndex++] << d.bitcount;
      d.bitcount += 8;
    }

    var val = d.tag & (0xffff >>> (16 - num));
    d.tag >>>= num;
    d.bitcount -= num;
    return val + base;
  }

  /* given a data stream and a tree, decode a symbol */
  function tinf_decode_symbol(d, t) {
    while (d.bitcount < 24) {
      d.tag |= d.source[d.sourceIndex++] << d.bitcount;
      d.bitcount += 8;
    }
    
    var sum = 0, cur = 0, len = 0;
    var tag = d.tag;

    /* get more bits while code value is above sum */
    do {
      cur = 2 * cur + (tag & 1);
      tag >>>= 1;
      ++len;

      sum += t.table[len];
      cur -= t.table[len];
    } while (cur >= 0);
    
    d.tag = tag;
    d.bitcount -= len;

    return t.trans[sum + cur];
  }

  /* given a data stream, decode dynamic trees from it */
  function tinf_decode_trees(d, lt, dt) {
    var hlit, hdist, hclen;
    var i, num, length;

    /* get 5 bits HLIT (257-286) */
    hlit = tinf_read_bits(d, 5, 257);

    /* get 5 bits HDIST (1-32) */
    hdist = tinf_read_bits(d, 5, 1);

    /* get 4 bits HCLEN (4-19) */
    hclen = tinf_read_bits(d, 4, 4);

    for (i = 0; i < 19; ++i) { lengths[i] = 0; }

    /* read code lengths for code length alphabet */
    for (i = 0; i < hclen; ++i) {
      /* get 3 bits code length (0-7) */
      var clen = tinf_read_bits(d, 3, 0);
      lengths[clcidx[i]] = clen;
    }

    /* build code length tree */
    tinf_build_tree(code_tree, lengths, 0, 19);

    /* decode code lengths for the dynamic trees */
    for (num = 0; num < hlit + hdist;) {
      var sym = tinf_decode_symbol(d, code_tree);

      switch (sym) {
        case 16:
          /* copy previous code length 3-6 times (read 2 bits) */
          var prev = lengths[num - 1];
          for (length = tinf_read_bits(d, 2, 3); length; --length) {
            lengths[num++] = prev;
          }
          break;
        case 17:
          /* repeat code length 0 for 3-10 times (read 3 bits) */
          for (length = tinf_read_bits(d, 3, 3); length; --length) {
            lengths[num++] = 0;
          }
          break;
        case 18:
          /* repeat code length 0 for 11-138 times (read 7 bits) */
          for (length = tinf_read_bits(d, 7, 11); length; --length) {
            lengths[num++] = 0;
          }
          break;
        default:
          /* values 0-15 represent the actual code lengths */
          lengths[num++] = sym;
          break;
      }
    }

    /* build dynamic trees */
    tinf_build_tree(lt, lengths, 0, hlit);
    tinf_build_tree(dt, lengths, hlit, hdist);
  }

  /* ----------------------------- *
   * -- block inflate functions -- *
   * ----------------------------- */

  /* given a stream and two trees, inflate a block of data */
  function tinf_inflate_block_data(d, lt, dt) {
    while (1) {
      var sym = tinf_decode_symbol(d, lt);

      /* check for end of block */
      if (sym === 256) {
        return TINF_OK;
      }

      if (sym < 256) {
        d.dest[d.destLen++] = sym;
      } else {
        var length, dist, offs;
        var i;

        sym -= 257;

        /* possibly get more bits from length code */
        length = tinf_read_bits(d, length_bits[sym], length_base[sym]);

        dist = tinf_decode_symbol(d, dt);

        /* possibly get more bits from distance code */
        offs = d.destLen - tinf_read_bits(d, dist_bits[dist], dist_base[dist]);

        /* copy match */
        for (i = offs; i < offs + length; ++i) {
          d.dest[d.destLen++] = d.dest[i];
        }
      }
    }
  }

  /* inflate an uncompressed block of data */
  function tinf_inflate_uncompressed_block(d) {
    var length, invlength;
    var i;
    
    /* unread from bitbuffer */
    while (d.bitcount > 8) {
      d.sourceIndex--;
      d.bitcount -= 8;
    }

    /* get length */
    length = d.source[d.sourceIndex + 1];
    length = 256 * length + d.source[d.sourceIndex];

    /* get one's complement of length */
    invlength = d.source[d.sourceIndex + 3];
    invlength = 256 * invlength + d.source[d.sourceIndex + 2];

    /* check length */
    if (length !== (~invlength & 0x0000ffff))
      { return TINF_DATA_ERROR; }

    d.sourceIndex += 4;

    /* copy block */
    for (i = length; i; --i)
      { d.dest[d.destLen++] = d.source[d.sourceIndex++]; }

    /* make sure we start next block on a byte boundary */
    d.bitcount = 0;

    return TINF_OK;
  }

  /* inflate stream from source to dest */
  function tinf_uncompress(source, dest) {
    var d = new Data(source, dest);
    var bfinal, btype, res;

    do {
      /* read final block flag */
      bfinal = tinf_getbit(d);

      /* read block type (2 bits) */
      btype = tinf_read_bits(d, 2, 0);

      /* decompress block */
      switch (btype) {
        case 0:
          /* decompress uncompressed block */
          res = tinf_inflate_uncompressed_block(d);
          break;
        case 1:
          /* decompress block with fixed huffman trees */
          res = tinf_inflate_block_data(d, sltree, sdtree);
          break;
        case 2:
          /* decompress block with dynamic huffman trees */
          tinf_decode_trees(d, d.ltree, d.dtree);
          res = tinf_inflate_block_data(d, d.ltree, d.dtree);
          break;
        default:
          res = TINF_DATA_ERROR;
      }

      if (res !== TINF_OK)
        { throw new Error('Data error'); }

    } while (!bfinal);

    if (d.destLen < d.dest.length) {
      if (typeof d.dest.slice === 'function')
        { return d.dest.slice(0, d.destLen); }
      else
        { return d.dest.subarray(0, d.destLen); }
    }
    
    return d.dest;
  }

  /* -------------------- *
   * -- initialization -- *
   * -------------------- */

  /* build fixed huffman trees */
  tinf_build_fixed_trees(sltree, sdtree);

  /* build extra bits and base tables */
  tinf_build_bits_base(length_bits, length_base, 4, 3);
  tinf_build_bits_base(dist_bits, dist_base, 2, 1);

  /* fix a special case */
  length_bits[28] = 0;
  length_base[28] = 258;

  var tinyInflate = tinf_uncompress;

  // The Bounding Box object

  function derive(v0, v1, v2, v3, t) {
      return Math.pow(1 - t, 3) * v0 +
          3 * Math.pow(1 - t, 2) * t * v1 +
          3 * (1 - t) * Math.pow(t, 2) * v2 +
          Math.pow(t, 3) * v3;
  }
  /**
   * A bounding box is an enclosing box that describes the smallest measure within which all the points lie.
   * It is used to calculate the bounding box of a glyph or text path.
   *
   * On initialization, x1/y1/x2/y2 will be NaN. Check if the bounding box is empty using `isEmpty()`.
   *
   * @exports opentype.BoundingBox
   * @class
   * @constructor
   */
  function BoundingBox() {
      this.x1 = Number.NaN;
      this.y1 = Number.NaN;
      this.x2 = Number.NaN;
      this.y2 = Number.NaN;
  }

  /**
   * Returns true if the bounding box is empty, that is, no points have been added to the box yet.
   */
  BoundingBox.prototype.isEmpty = function() {
      return isNaN(this.x1) || isNaN(this.y1) || isNaN(this.x2) || isNaN(this.y2);
  };

  /**
   * Add the point to the bounding box.
   * The x1/y1/x2/y2 coordinates of the bounding box will now encompass the given point.
   * @param {number} x - The X coordinate of the point.
   * @param {number} y - The Y coordinate of the point.
   */
  BoundingBox.prototype.addPoint = function(x, y) {
      if (typeof x === 'number') {
          if (isNaN(this.x1) || isNaN(this.x2)) {
              this.x1 = x;
              this.x2 = x;
          }
          if (x < this.x1) {
              this.x1 = x;
          }
          if (x > this.x2) {
              this.x2 = x;
          }
      }
      if (typeof y === 'number') {
          if (isNaN(this.y1) || isNaN(this.y2)) {
              this.y1 = y;
              this.y2 = y;
          }
          if (y < this.y1) {
              this.y1 = y;
          }
          if (y > this.y2) {
              this.y2 = y;
          }
      }
  };

  /**
   * Add a X coordinate to the bounding box.
   * This extends the bounding box to include the X coordinate.
   * This function is used internally inside of addBezier.
   * @param {number} x - The X coordinate of the point.
   */
  BoundingBox.prototype.addX = function(x) {
      this.addPoint(x, null);
  };

  /**
   * Add a Y coordinate to the bounding box.
   * This extends the bounding box to include the Y coordinate.
   * This function is used internally inside of addBezier.
   * @param {number} y - The Y coordinate of the point.
   */
  BoundingBox.prototype.addY = function(y) {
      this.addPoint(null, y);
  };

  /**
   * Add a Bézier curve to the bounding box.
   * This extends the bounding box to include the entire Bézier.
   * @param {number} x0 - The starting X coordinate.
   * @param {number} y0 - The starting Y coordinate.
   * @param {number} x1 - The X coordinate of the first control point.
   * @param {number} y1 - The Y coordinate of the first control point.
   * @param {number} x2 - The X coordinate of the second control point.
   * @param {number} y2 - The Y coordinate of the second control point.
   * @param {number} x - The ending X coordinate.
   * @param {number} y - The ending Y coordinate.
   */
  BoundingBox.prototype.addBezier = function(x0, y0, x1, y1, x2, y2, x, y) {
      // This code is based on http://nishiohirokazu.blogspot.com/2009/06/how-to-calculate-bezier-curves-bounding.html
      // and https://github.com/icons8/svg-path-bounding-box

      var p0 = [x0, y0];
      var p1 = [x1, y1];
      var p2 = [x2, y2];
      var p3 = [x, y];

      this.addPoint(x0, y0);
      this.addPoint(x, y);

      for (var i = 0; i <= 1; i++) {
          var b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
          var a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
          var c = 3 * p1[i] - 3 * p0[i];

          if (a === 0) {
              if (b === 0) { continue; }
              var t = -c / b;
              if (0 < t && t < 1) {
                  if (i === 0) { this.addX(derive(p0[i], p1[i], p2[i], p3[i], t)); }
                  if (i === 1) { this.addY(derive(p0[i], p1[i], p2[i], p3[i], t)); }
              }
              continue;
          }

          var b2ac = Math.pow(b, 2) - 4 * c * a;
          if (b2ac < 0) { continue; }
          var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
          if (0 < t1 && t1 < 1) {
              if (i === 0) { this.addX(derive(p0[i], p1[i], p2[i], p3[i], t1)); }
              if (i === 1) { this.addY(derive(p0[i], p1[i], p2[i], p3[i], t1)); }
          }
          var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
          if (0 < t2 && t2 < 1) {
              if (i === 0) { this.addX(derive(p0[i], p1[i], p2[i], p3[i], t2)); }
              if (i === 1) { this.addY(derive(p0[i], p1[i], p2[i], p3[i], t2)); }
          }
      }
  };

  /**
   * Add a quadratic curve to the bounding box.
   * This extends the bounding box to include the entire quadratic curve.
   * @param {number} x0 - The starting X coordinate.
   * @param {number} y0 - The starting Y coordinate.
   * @param {number} x1 - The X coordinate of the control point.
   * @param {number} y1 - The Y coordinate of the control point.
   * @param {number} x - The ending X coordinate.
   * @param {number} y - The ending Y coordinate.
   */
  BoundingBox.prototype.addQuad = function(x0, y0, x1, y1, x, y) {
      var cp1x = x0 + 2 / 3 * (x1 - x0);
      var cp1y = y0 + 2 / 3 * (y1 - y0);
      var cp2x = cp1x + 1 / 3 * (x - x0);
      var cp2y = cp1y + 1 / 3 * (y - y0);
      this.addBezier(x0, y0, cp1x, cp1y, cp2x, cp2y, x, y);
  };

  // Geometric objects

  /**
   * A bézier path containing a set of path commands similar to a SVG path.
   * Paths can be drawn on a context using `draw`.
   * @exports opentype.Path
   * @class
   * @constructor
   */
  function Path() {
      this.commands = [];
      this.fill = 'black';
      this.stroke = null;
      this.strokeWidth = 1;
  }

  /**
   * @param  {number} x
   * @param  {number} y
   */
  Path.prototype.moveTo = function(x, y) {
      this.commands.push({
          type: 'M',
          x: x,
          y: y
      });
  };

  /**
   * @param  {number} x
   * @param  {number} y
   */
  Path.prototype.lineTo = function(x, y) {
      this.commands.push({
          type: 'L',
          x: x,
          y: y
      });
  };

  /**
   * Draws cubic curve
   * @function
   * curveTo
   * @memberof opentype.Path.prototype
   * @param  {number} x1 - x of control 1
   * @param  {number} y1 - y of control 1
   * @param  {number} x2 - x of control 2
   * @param  {number} y2 - y of control 2
   * @param  {number} x - x of path point
   * @param  {number} y - y of path point
   */

  /**
   * Draws cubic curve
   * @function
   * bezierCurveTo
   * @memberof opentype.Path.prototype
   * @param  {number} x1 - x of control 1
   * @param  {number} y1 - y of control 1
   * @param  {number} x2 - x of control 2
   * @param  {number} y2 - y of control 2
   * @param  {number} x - x of path point
   * @param  {number} y - y of path point
   * @see curveTo
   */
  Path.prototype.curveTo = Path.prototype.bezierCurveTo = function(x1, y1, x2, y2, x, y) {
      this.commands.push({
          type: 'C',
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          x: x,
          y: y
      });
  };

  /**
   * Draws quadratic curve
   * @function
   * quadraticCurveTo
   * @memberof opentype.Path.prototype
   * @param  {number} x1 - x of control
   * @param  {number} y1 - y of control
   * @param  {number} x - x of path point
   * @param  {number} y - y of path point
   */

  /**
   * Draws quadratic curve
   * @function
   * quadTo
   * @memberof opentype.Path.prototype
   * @param  {number} x1 - x of control
   * @param  {number} y1 - y of control
   * @param  {number} x - x of path point
   * @param  {number} y - y of path point
   */
  Path.prototype.quadTo = Path.prototype.quadraticCurveTo = function(x1, y1, x, y) {
      this.commands.push({
          type: 'Q',
          x1: x1,
          y1: y1,
          x: x,
          y: y
      });
  };

  /**
   * Closes the path
   * @function closePath
   * @memberof opentype.Path.prototype
   */

  /**
   * Close the path
   * @function close
   * @memberof opentype.Path.prototype
   */
  Path.prototype.close = Path.prototype.closePath = function() {
      this.commands.push({
          type: 'Z'
      });
  };

  /**
   * Add the given path or list of commands to the commands of this path.
   * @param  {Array} pathOrCommands - another opentype.Path, an opentype.BoundingBox, or an array of commands.
   */
  Path.prototype.extend = function(pathOrCommands) {
      if (pathOrCommands.commands) {
          pathOrCommands = pathOrCommands.commands;
      } else if (pathOrCommands instanceof BoundingBox) {
          var box = pathOrCommands;
          this.moveTo(box.x1, box.y1);
          this.lineTo(box.x2, box.y1);
          this.lineTo(box.x2, box.y2);
          this.lineTo(box.x1, box.y2);
          this.close();
          return;
      }

      Array.prototype.push.apply(this.commands, pathOrCommands);
  };

  /**
   * Calculate the bounding box of the path.
   * @returns {opentype.BoundingBox}
   */
  Path.prototype.getBoundingBox = function() {
      var box = new BoundingBox();

      var startX = 0;
      var startY = 0;
      var prevX = 0;
      var prevY = 0;
      for (var i = 0; i < this.commands.length; i++) {
          var cmd = this.commands[i];
          switch (cmd.type) {
              case 'M':
                  box.addPoint(cmd.x, cmd.y);
                  startX = prevX = cmd.x;
                  startY = prevY = cmd.y;
                  break;
              case 'L':
                  box.addPoint(cmd.x, cmd.y);
                  prevX = cmd.x;
                  prevY = cmd.y;
                  break;
              case 'Q':
                  box.addQuad(prevX, prevY, cmd.x1, cmd.y1, cmd.x, cmd.y);
                  prevX = cmd.x;
                  prevY = cmd.y;
                  break;
              case 'C':
                  box.addBezier(prevX, prevY, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
                  prevX = cmd.x;
                  prevY = cmd.y;
                  break;
              case 'Z':
                  prevX = startX;
                  prevY = startY;
                  break;
              default:
                  throw new Error('Unexpected path command ' + cmd.type);
          }
      }
      if (box.isEmpty()) {
          box.addPoint(0, 0);
      }
      return box;
  };

  /**
   * Draw the path to a 2D context.
   * @param {CanvasRenderingContext2D} ctx - A 2D drawing context.
   */
  Path.prototype.draw = function(ctx) {
      ctx.beginPath();
      for (var i = 0; i < this.commands.length; i += 1) {
          var cmd = this.commands[i];
          if (cmd.type === 'M') {
              ctx.moveTo(cmd.x, cmd.y);
          } else if (cmd.type === 'L') {
              ctx.lineTo(cmd.x, cmd.y);
          } else if (cmd.type === 'C') {
              ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
          } else if (cmd.type === 'Q') {
              ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
          } else if (cmd.type === 'Z') {
              ctx.closePath();
          }
      }

      if (this.fill) {
          ctx.fillStyle = this.fill;
          ctx.fill();
      }

      if (this.stroke) {
          ctx.strokeStyle = this.stroke;
          ctx.lineWidth = this.strokeWidth;
          ctx.stroke();
      }
  };

  /**
   * Convert the Path to a string of path data instructions
   * See http://www.w3.org/TR/SVG/paths.html#PathData
   * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
   * @return {string}
   */
  Path.prototype.toPathData = function(decimalPlaces) {
      decimalPlaces = decimalPlaces !== undefined ? decimalPlaces : 2;

      function floatToString(v) {
          if (Math.round(v) === v) {
              return '' + Math.round(v);
          } else {
              return v.toFixed(decimalPlaces);
          }
      }

      function packValues() {
          var arguments$1 = arguments;

          var s = '';
          for (var i = 0; i < arguments.length; i += 1) {
              var v = arguments$1[i];
              if (v >= 0 && i > 0) {
                  s += ' ';
              }

              s += floatToString(v);
          }

          return s;
      }

      var d = '';
      for (var i = 0; i < this.commands.length; i += 1) {
          var cmd = this.commands[i];
          if (cmd.type === 'M') {
              d += 'M' + packValues(cmd.x, cmd.y);
          } else if (cmd.type === 'L') {
              d += 'L' + packValues(cmd.x, cmd.y);
          } else if (cmd.type === 'C') {
              d += 'C' + packValues(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
          } else if (cmd.type === 'Q') {
              d += 'Q' + packValues(cmd.x1, cmd.y1, cmd.x, cmd.y);
          } else if (cmd.type === 'Z') {
              d += 'Z';
          }
      }

      return d;
  };

  /**
   * Convert the path to an SVG <path> element, as a string.
   * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
   * @return {string}
   */
  Path.prototype.toSVG = function(decimalPlaces) {
      var svg = '<path d="';
      svg += this.toPathData(decimalPlaces);
      svg += '"';
      if (this.fill && this.fill !== 'black') {
          if (this.fill === null) {
              svg += ' fill="none"';
          } else {
              svg += ' fill="' + this.fill + '"';
          }
      }

      if (this.stroke) {
          svg += ' stroke="' + this.stroke + '" stroke-width="' + this.strokeWidth + '"';
      }

      svg += '/>';
      return svg;
  };

  /**
   * Convert the path to a DOM element.
   * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
   * @return {SVGPathElement}
   */
  Path.prototype.toDOMElement = function(decimalPlaces) {
      var temporaryPath = this.toPathData(decimalPlaces);
      var newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      newPath.setAttribute('d', temporaryPath);

      return newPath;
  };

  // Run-time checking of preconditions.

  function fail(message) {
      throw new Error(message);
  }

  // Precondition function that checks if the given predicate is true.
  // If not, it will throw an error.
  function argument(predicate, message) {
      if (!predicate) {
          fail(message);
      }
  }
  var check = { fail: fail, argument: argument, assert: argument };

  // Data types used in the OpenType font file.

  var LIMIT16 = 32768; // The limit at which a 16-bit number switches signs == 2^15
  var LIMIT32 = 2147483648; // The limit at which a 32-bit number switches signs == 2 ^ 31

  /**
   * @exports opentype.decode
   * @class
   */
  var decode = {};
  /**
   * @exports opentype.encode
   * @class
   */
  var encode = {};
  /**
   * @exports opentype.sizeOf
   * @class
   */
  var sizeOf = {};

  // Return a function that always returns the same value.
  function constant(v) {
      return function() {
          return v;
      };
  }

  // OpenType data types //////////////////////////////////////////////////////

  /**
   * Convert an 8-bit unsigned integer to a list of 1 byte.
   * @param {number}
   * @returns {Array}
   */
  encode.BYTE = function(v) {
      check.argument(v >= 0 && v <= 255, 'Byte value should be between 0 and 255.');
      return [v];
  };
  /**
   * @constant
   * @type {number}
   */
  sizeOf.BYTE = constant(1);

  /**
   * Convert a 8-bit signed integer to a list of 1 byte.
   * @param {string}
   * @returns {Array}
   */
  encode.CHAR = function(v) {
      return [v.charCodeAt(0)];
  };

  /**
   * @constant
   * @type {number}
   */
  sizeOf.CHAR = constant(1);

  /**
   * Convert an ASCII string to a list of bytes.
   * @param {string}
   * @returns {Array}
   */
  encode.CHARARRAY = function(v) {
      if (typeof v === 'undefined') {
          v = '';
          console.warn('Undefined CHARARRAY encountered and treated as an empty string. This is probably caused by a missing glyph name.');
      }
      var b = [];
      for (var i = 0; i < v.length; i += 1) {
          b[i] = v.charCodeAt(i);
      }

      return b;
  };

  /**
   * @param {Array}
   * @returns {number}
   */
  sizeOf.CHARARRAY = function(v) {
      if (typeof v === 'undefined') {
          return 0;
      }
      return v.length;
  };

  /**
   * Convert a 16-bit unsigned integer to a list of 2 bytes.
   * @param {number}
   * @returns {Array}
   */
  encode.USHORT = function(v) {
      return [(v >> 8) & 0xFF, v & 0xFF];
  };

  /**
   * @constant
   * @type {number}
   */
  sizeOf.USHORT = constant(2);

  /**
   * Convert a 16-bit signed integer to a list of 2 bytes.
   * @param {number}
   * @returns {Array}
   */
  encode.SHORT = function(v) {
      // Two's complement
      if (v >= LIMIT16) {
          v = -(2 * LIMIT16 - v);
      }

      return [(v >> 8) & 0xFF, v & 0xFF];
  };

  /**
   * @constant
   * @type {number}
   */
  sizeOf.SHORT = constant(2);

  /**
   * Convert a 24-bit unsigned integer to a list of 3 bytes.
   * @param {number}
   * @returns {Array}
   */
  encode.UINT24 = function(v) {
      return [(v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
  };

  /**
   * @constant
   * @type {number}
   */
  sizeOf.UINT24 = constant(3);

  /**
   * Convert a 32-bit unsigned integer to a list of 4 bytes.
   * @param {number}
   * @returns {Array}
   */
  encode.ULONG = function(v) {
      return [(v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
  };

  /**
   * @constant
   * @type {number}
   */
  sizeOf.ULONG = constant(4);

  /**
   * Convert a 32-bit unsigned integer to a list of 4 bytes.
   * @param {number}
   * @returns {Array}
   */
  encode.LONG = function(v) {
      // Two's complement
      if (v >= LIMIT32) {
          v = -(2 * LIMIT32 - v);
      }

      return [(v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
  };

  /**
   * @constant
   * @type {number}
   */
  sizeOf.LONG = constant(4);

  encode.FIXED = encode.ULONG;
  sizeOf.FIXED = sizeOf.ULONG;

  encode.FWORD = encode.SHORT;
  sizeOf.FWORD = sizeOf.SHORT;

  encode.UFWORD = encode.USHORT;
  sizeOf.UFWORD = sizeOf.USHORT;

  /**
   * Convert a 32-bit Apple Mac timestamp integer to a list of 8 bytes, 64-bit timestamp.
   * @param {number}
   * @returns {Array}
   */
  encode.LONGDATETIME = function(v) {
      return [0, 0, 0, 0, (v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
  };

  /**
   * @constant
   * @type {number}
   */
  sizeOf.LONGDATETIME = constant(8);

  /**
   * Convert a 4-char tag to a list of 4 bytes.
   * @param {string}
   * @returns {Array}
   */
  encode.TAG = function(v) {
      check.argument(v.length === 4, 'Tag should be exactly 4 ASCII characters.');
      return [v.charCodeAt(0),
              v.charCodeAt(1),
              v.charCodeAt(2),
              v.charCodeAt(3)];
  };

  /**
   * @constant
   * @type {number}
   */
  sizeOf.TAG = constant(4);

  // CFF data types ///////////////////////////////////////////////////////////

  encode.Card8 = encode.BYTE;
  sizeOf.Card8 = sizeOf.BYTE;

  encode.Card16 = encode.USHORT;
  sizeOf.Card16 = sizeOf.USHORT;

  encode.OffSize = encode.BYTE;
  sizeOf.OffSize = sizeOf.BYTE;

  encode.SID = encode.USHORT;
  sizeOf.SID = sizeOf.USHORT;

  // Convert a numeric operand or charstring number to a variable-size list of bytes.
  /**
   * Convert a numeric operand or charstring number to a variable-size list of bytes.
   * @param {number}
   * @returns {Array}
   */
  encode.NUMBER = function(v) {
      if (v >= -107 && v <= 107) {
          return [v + 139];
      } else if (v >= 108 && v <= 1131) {
          v = v - 108;
          return [(v >> 8) + 247, v & 0xFF];
      } else if (v >= -1131 && v <= -108) {
          v = -v - 108;
          return [(v >> 8) + 251, v & 0xFF];
      } else if (v >= -32768 && v <= 32767) {
          return encode.NUMBER16(v);
      } else {
          return encode.NUMBER32(v);
      }
  };

  /**
   * @param {number}
   * @returns {number}
   */
  sizeOf.NUMBER = function(v) {
      return encode.NUMBER(v).length;
  };

  /**
   * Convert a signed number between -32768 and +32767 to a three-byte value.
   * This ensures we always use three bytes, but is not the most compact format.
   * @param {number}
   * @returns {Array}
   */
  encode.NUMBER16 = function(v) {
      return [28, (v >> 8) & 0xFF, v & 0xFF];
  };

  /**
   * @constant
   * @type {number}
   */
  sizeOf.NUMBER16 = constant(3);

  /**
   * Convert a signed number between -(2^31) and +(2^31-1) to a five-byte value.
   * This is useful if you want to be sure you always use four bytes,
   * at the expense of wasting a few bytes for smaller numbers.
   * @param {number}
   * @returns {Array}
   */
  encode.NUMBER32 = function(v) {
      return [29, (v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
  };

  /**
   * @constant
   * @type {number}
   */
  sizeOf.NUMBER32 = constant(5);

  /**
   * @param {number}
   * @returns {Array}
   */
  encode.REAL = function(v) {
      var value = v.toString();

      // Some numbers use an epsilon to encode the value. (e.g. JavaScript will store 0.0000001 as 1e-7)
      // This code converts it back to a number without the epsilon.
      var m = /\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(value);
      if (m) {
          var epsilon = parseFloat('1e' + ((m[2] ? +m[2] : 0) + m[1].length));
          value = (Math.round(v * epsilon) / epsilon).toString();
      }

      var nibbles = '';
      for (var i = 0, ii = value.length; i < ii; i += 1) {
          var c = value[i];
          if (c === 'e') {
              nibbles += value[++i] === '-' ? 'c' : 'b';
          } else if (c === '.') {
              nibbles += 'a';
          } else if (c === '-') {
              nibbles += 'e';
          } else {
              nibbles += c;
          }
      }

      nibbles += (nibbles.length & 1) ? 'f' : 'ff';
      var out = [30];
      for (var i$1 = 0, ii$1 = nibbles.length; i$1 < ii$1; i$1 += 2) {
          out.push(parseInt(nibbles.substr(i$1, 2), 16));
      }

      return out;
  };

  /**
   * @param {number}
   * @returns {number}
   */
  sizeOf.REAL = function(v) {
      return encode.REAL(v).length;
  };

  encode.NAME = encode.CHARARRAY;
  sizeOf.NAME = sizeOf.CHARARRAY;

  encode.STRING = encode.CHARARRAY;
  sizeOf.STRING = sizeOf.CHARARRAY;

  /**
   * @param {DataView} data
   * @param {number} offset
   * @param {number} numBytes
   * @returns {string}
   */
  decode.UTF8 = function(data, offset, numBytes) {
      var codePoints = [];
      var numChars = numBytes;
      for (var j = 0; j < numChars; j++, offset += 1) {
          codePoints[j] = data.getUint8(offset);
      }

      return String.fromCharCode.apply(null, codePoints);
  };

  /**
   * @param {DataView} data
   * @param {number} offset
   * @param {number} numBytes
   * @returns {string}
   */
  decode.UTF16 = function(data, offset, numBytes) {
      var codePoints = [];
      var numChars = numBytes / 2;
      for (var j = 0; j < numChars; j++, offset += 2) {
          codePoints[j] = data.getUint16(offset);
      }

      return String.fromCharCode.apply(null, codePoints);
  };

  /**
   * Convert a JavaScript string to UTF16-BE.
   * @param {string}
   * @returns {Array}
   */
  encode.UTF16 = function(v) {
      var b = [];
      for (var i = 0; i < v.length; i += 1) {
          var codepoint = v.charCodeAt(i);
          b[b.length] = (codepoint >> 8) & 0xFF;
          b[b.length] = codepoint & 0xFF;
      }

      return b;
  };

  /**
   * @param {string}
   * @returns {number}
   */
  sizeOf.UTF16 = function(v) {
      return v.length * 2;
  };

  // Data for converting old eight-bit Macintosh encodings to Unicode.
  // This representation is optimized for decoding; encoding is slower
  // and needs more memory. The assumption is that all opentype.js users
  // want to open fonts, but saving a font will be comparatively rare
  // so it can be more expensive. Keyed by IANA character set name.
  //
  // Python script for generating these strings:
  //
  //     s = u''.join([chr(c).decode('mac_greek') for c in range(128, 256)])
  //     print(s.encode('utf-8'))
  /**
   * @private
   */
  var eightBitMacEncodings = {
      'x-mac-croatian':  // Python: 'mac_croatian'
      'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø' +
      '¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊©⁄€‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ',
      'x-mac-cyrillic':  // Python: 'mac_cyrillic'
      'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњ' +
      'јЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю',
      'x-mac-gaelic': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/GAELIC.TXT
      'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØḂ±≤≥ḃĊċḊḋḞḟĠġṀæø' +
      'ṁṖṗɼƒſṠ«»… ÀÃÕŒœ–—“”‘’ṡẛÿŸṪ€‹›Ŷŷṫ·Ỳỳ⁊ÂÊÁËÈÍÎÏÌÓÔ♣ÒÚÛÙıÝýŴŵẄẅẀẁẂẃ',
      'x-mac-greek':  // Python: 'mac_greek'
      'Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦€ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩ' +
      'άΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ\u00AD',
      'x-mac-icelandic':  // Python: 'mac_iceland'
      'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
      '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
      'x-mac-inuit': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/INUIT.TXT
      'ᐃᐄᐅᐆᐊᐋᐱᐲᐳᐴᐸᐹᑉᑎᑏᑐᑑᑕᑖᑦᑭᑮᑯᑰᑲᑳᒃᒋᒌᒍᒎᒐᒑ°ᒡᒥᒦ•¶ᒧ®©™ᒨᒪᒫᒻᓂᓃᓄᓅᓇᓈᓐᓯᓰᓱᓲᓴᓵᔅᓕᓖᓗ' +
      'ᓘᓚᓛᓪᔨᔩᔪᔫᔭ… ᔮᔾᕕᕖᕗ–—“”‘’ᕘᕙᕚᕝᕆᕇᕈᕉᕋᕌᕐᕿᖀᖁᖂᖃᖄᖅᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖠᖡᖢᖣᖤᖥᖦᕼŁł',
      'x-mac-ce':  // Python: 'mac_latin2'
      'ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅ' +
      'ņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ',
      macintosh:  // Python: 'mac_roman'
      'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
      '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
      'x-mac-romanian':  // Python: 'mac_romanian'
      'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂȘ∞±≤≥¥µ∂∑∏π∫ªºΩăș' +
      '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›Țț‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
      'x-mac-turkish':  // Python: 'mac_turkish'
      'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
      '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙˆ˜¯˘˙˚¸˝˛ˇ'
  };

  /**
   * Decodes an old-style Macintosh string. Returns either a Unicode JavaScript
   * string, or 'undefined' if the encoding is unsupported. For example, we do
   * not support Chinese, Japanese or Korean because these would need large
   * mapping tables.
   * @param {DataView} dataView
   * @param {number} offset
   * @param {number} dataLength
   * @param {string} encoding
   * @returns {string}
   */
  decode.MACSTRING = function(dataView, offset, dataLength, encoding) {
      var table = eightBitMacEncodings[encoding];
      if (table === undefined) {
          return undefined;
      }

      var result = '';
      for (var i = 0; i < dataLength; i++) {
          var c = dataView.getUint8(offset + i);
          // In all eight-bit Mac encodings, the characters 0x00..0x7F are
          // mapped to U+0000..U+007F; we only need to look up the others.
          if (c <= 0x7F) {
              result += String.fromCharCode(c);
          } else {
              result += table[c & 0x7F];
          }
      }

      return result;
  };

  // Helper function for encode.MACSTRING. Returns a dictionary for mapping
  // Unicode character codes to their 8-bit MacOS equivalent. This table
  // is not exactly a super cheap data structure, but we do not care because
  // encoding Macintosh strings is only rarely needed in typical applications.
  var macEncodingTableCache = typeof WeakMap === 'function' && new WeakMap();
  var macEncodingCacheKeys;
  var getMacEncodingTable = function (encoding) {
      // Since we use encoding as a cache key for WeakMap, it has to be
      // a String object and not a literal. And at least on NodeJS 2.10.1,
      // WeakMap requires that the same String instance is passed for cache hits.
      if (!macEncodingCacheKeys) {
          macEncodingCacheKeys = {};
          for (var e in eightBitMacEncodings) {
              /*jshint -W053 */  // Suppress "Do not use String as a constructor."
              macEncodingCacheKeys[e] = new String(e);
          }
      }

      var cacheKey = macEncodingCacheKeys[encoding];
      if (cacheKey === undefined) {
          return undefined;
      }

      // We can't do "if (cache.has(key)) {return cache.get(key)}" here:
      // since garbage collection may run at any time, it could also kick in
      // between the calls to cache.has() and cache.get(). In that case,
      // we would return 'undefined' even though we do support the encoding.
      if (macEncodingTableCache) {
          var cachedTable = macEncodingTableCache.get(cacheKey);
          if (cachedTable !== undefined) {
              return cachedTable;
          }
      }

      var decodingTable = eightBitMacEncodings[encoding];
      if (decodingTable === undefined) {
          return undefined;
      }

      var encodingTable = {};
      for (var i = 0; i < decodingTable.length; i++) {
          encodingTable[decodingTable.charCodeAt(i)] = i + 0x80;
      }

      if (macEncodingTableCache) {
          macEncodingTableCache.set(cacheKey, encodingTable);
      }

      return encodingTable;
  };

  /**
   * Encodes an old-style Macintosh string. Returns a byte array upon success.
   * If the requested encoding is unsupported, or if the input string contains
   * a character that cannot be expressed in the encoding, the function returns
   * 'undefined'.
   * @param {string} str
   * @param {string} encoding
   * @returns {Array}
   */
  encode.MACSTRING = function(str, encoding) {
      var table = getMacEncodingTable(encoding);
      if (table === undefined) {
          return undefined;
      }

      var result = [];
      for (var i = 0; i < str.length; i++) {
          var c = str.charCodeAt(i);

          // In all eight-bit Mac encodings, the characters 0x00..0x7F are
          // mapped to U+0000..U+007F; we only need to look up the others.
          if (c >= 0x80) {
              c = table[c];
              if (c === undefined) {
                  // str contains a Unicode character that cannot be encoded
                  // in the requested encoding.
                  return undefined;
              }
          }
          result[i] = c;
          // result.push(c);
      }

      return result;
  };

  /**
   * @param {string} str
   * @param {string} encoding
   * @returns {number}
   */
  sizeOf.MACSTRING = function(str, encoding) {
      var b = encode.MACSTRING(str, encoding);
      if (b !== undefined) {
          return b.length;
      } else {
          return 0;
      }
  };

  // Helper for encode.VARDELTAS
  function isByteEncodable(value) {
      return value >= -128 && value <= 127;
  }

  // Helper for encode.VARDELTAS
  function encodeVarDeltaRunAsZeroes(deltas, pos, result) {
      var runLength = 0;
      var numDeltas = deltas.length;
      while (pos < numDeltas && runLength < 64 && deltas[pos] === 0) {
          ++pos;
          ++runLength;
      }
      result.push(0x80 | (runLength - 1));
      return pos;
  }

  // Helper for encode.VARDELTAS
  function encodeVarDeltaRunAsBytes(deltas, offset, result) {
      var runLength = 0;
      var numDeltas = deltas.length;
      var pos = offset;
      while (pos < numDeltas && runLength < 64) {
          var value = deltas[pos];
          if (!isByteEncodable(value)) {
              break;
          }

          // Within a byte-encoded run of deltas, a single zero is best
          // stored literally as 0x00 value. However, if we have two or
          // more zeroes in a sequence, it is better to start a new run.
          // Fore example, the sequence of deltas [15, 15, 0, 15, 15]
          // becomes 6 bytes (04 0F 0F 00 0F 0F) when storing the zero
          // within the current run, but 7 bytes (01 0F 0F 80 01 0F 0F)
          // when starting a new run.
          if (value === 0 && pos + 1 < numDeltas && deltas[pos + 1] === 0) {
              break;
          }

          ++pos;
          ++runLength;
      }
      result.push(runLength - 1);
      for (var i = offset; i < pos; ++i) {
          result.push((deltas[i] + 256) & 0xff);
      }
      return pos;
  }

  // Helper for encode.VARDELTAS
  function encodeVarDeltaRunAsWords(deltas, offset, result) {
      var runLength = 0;
      var numDeltas = deltas.length;
      var pos = offset;
      while (pos < numDeltas && runLength < 64) {
          var value = deltas[pos];

          // Within a word-encoded run of deltas, it is easiest to start
          // a new run (with a different encoding) whenever we encounter
          // a zero value. For example, the sequence [0x6666, 0, 0x7777]
          // needs 7 bytes when storing the zero inside the current run
          // (42 66 66 00 00 77 77), and equally 7 bytes when starting a
          // new run (40 66 66 80 40 77 77).
          if (value === 0) {
              break;
          }

          // Within a word-encoded run of deltas, a single value in the
          // range (-128..127) should be encoded within the current run
          // because it is more compact. For example, the sequence
          // [0x6666, 2, 0x7777] becomes 7 bytes when storing the value
          // literally (42 66 66 00 02 77 77), but 8 bytes when starting
          // a new run (40 66 66 00 02 40 77 77).
          if (isByteEncodable(value) && pos + 1 < numDeltas && isByteEncodable(deltas[pos + 1])) {
              break;
          }

          ++pos;
          ++runLength;
      }
      result.push(0x40 | (runLength - 1));
      for (var i = offset; i < pos; ++i) {
          var val = deltas[i];
          result.push(((val + 0x10000) >> 8) & 0xff, (val + 0x100) & 0xff);
      }
      return pos;
  }

  /**
   * Encode a list of variation adjustment deltas.
   *
   * Variation adjustment deltas are used in ‘gvar’ and ‘cvar’ tables.
   * They indicate how points (in ‘gvar’) or values (in ‘cvar’) get adjusted
   * when generating instances of variation fonts.
   *
   * @see https://www.microsoft.com/typography/otspec/gvar.htm
   * @see https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6gvar.html
   * @param {Array}
   * @return {Array}
   */
  encode.VARDELTAS = function(deltas) {
      var pos = 0;
      var result = [];
      while (pos < deltas.length) {
          var value = deltas[pos];
          if (value === 0) {
              pos = encodeVarDeltaRunAsZeroes(deltas, pos, result);
          } else if (value >= -128 && value <= 127) {
              pos = encodeVarDeltaRunAsBytes(deltas, pos, result);
          } else {
              pos = encodeVarDeltaRunAsWords(deltas, pos, result);
          }
      }
      return result;
  };

  // Convert a list of values to a CFF INDEX structure.
  // The values should be objects containing name / type / value.
  /**
   * @param {Array} l
   * @returns {Array}
   */
  encode.INDEX = function(l) {
      //var offset, offsets, offsetEncoder, encodedOffsets, encodedOffset, data,
      //    i, v;
      // Because we have to know which data type to use to encode the offsets,
      // we have to go through the values twice: once to encode the data and
      // calculate the offsets, then again to encode the offsets using the fitting data type.
      var offset = 1; // First offset is always 1.
      var offsets = [offset];
      var data = [];
      for (var i = 0; i < l.length; i += 1) {
          var v = encode.OBJECT(l[i]);
          Array.prototype.push.apply(data, v);
          offset += v.length;
          offsets.push(offset);
      }

      if (data.length === 0) {
          return [0, 0];
      }

      var encodedOffsets = [];
      var offSize = (1 + Math.floor(Math.log(offset) / Math.log(2)) / 8) | 0;
      var offsetEncoder = [undefined, encode.BYTE, encode.USHORT, encode.UINT24, encode.ULONG][offSize];
      for (var i$1 = 0; i$1 < offsets.length; i$1 += 1) {
          var encodedOffset = offsetEncoder(offsets[i$1]);
          Array.prototype.push.apply(encodedOffsets, encodedOffset);
      }

      return Array.prototype.concat(encode.Card16(l.length),
                             encode.OffSize(offSize),
                             encodedOffsets,
                             data);
  };

  /**
   * @param {Array}
   * @returns {number}
   */
  sizeOf.INDEX = function(v) {
      return encode.INDEX(v).length;
  };

  /**
   * Convert an object to a CFF DICT structure.
   * The keys should be numeric.
   * The values should be objects containing name / type / value.
   * @param {Object} m
   * @returns {Array}
   */
  encode.DICT = function(m) {
      var d = [];
      var keys = Object.keys(m);
      var length = keys.length;

      for (var i = 0; i < length; i += 1) {
          // Object.keys() return string keys, but our keys are always numeric.
          var k = parseInt(keys[i], 0);
          var v = m[k];
          // Value comes before the key.
          d = d.concat(encode.OPERAND(v.value, v.type));
          d = d.concat(encode.OPERATOR(k));
      }

      return d;
  };

  /**
   * @param {Object}
   * @returns {number}
   */
  sizeOf.DICT = function(m) {
      return encode.DICT(m).length;
  };

  /**
   * @param {number}
   * @returns {Array}
   */
  encode.OPERATOR = function(v) {
      if (v < 1200) {
          return [v];
      } else {
          return [12, v - 1200];
      }
  };

  /**
   * @param {Array} v
   * @param {string}
   * @returns {Array}
   */
  encode.OPERAND = function(v, type) {
      var d = [];
      if (Array.isArray(type)) {
          for (var i = 0; i < type.length; i += 1) {
              check.argument(v.length === type.length, 'Not enough arguments given for type' + type);
              d = d.concat(encode.OPERAND(v[i], type[i]));
          }
      } else {
          if (type === 'SID') {
              d = d.concat(encode.NUMBER(v));
          } else if (type === 'offset') {
              // We make it easy for ourselves and always encode offsets as
              // 4 bytes. This makes offset calculation for the top dict easier.
              d = d.concat(encode.NUMBER32(v));
          } else if (type === 'number') {
              d = d.concat(encode.NUMBER(v));
          } else if (type === 'real') {
              d = d.concat(encode.REAL(v));
          } else {
              throw new Error('Unknown operand type ' + type);
              // FIXME Add support for booleans
          }
      }

      return d;
  };

  encode.OP = encode.BYTE;
  sizeOf.OP = sizeOf.BYTE;

  // memoize charstring encoding using WeakMap if available
  var wmm = typeof WeakMap === 'function' && new WeakMap();

  /**
   * Convert a list of CharString operations to bytes.
   * @param {Array}
   * @returns {Array}
   */
  encode.CHARSTRING = function(ops) {
      // See encode.MACSTRING for why we don't do "if (wmm && wmm.has(ops))".
      if (wmm) {
          var cachedValue = wmm.get(ops);
          if (cachedValue !== undefined) {
              return cachedValue;
          }
      }

      var d = [];
      var length = ops.length;

      for (var i = 0; i < length; i += 1) {
          var op = ops[i];
          d = d.concat(encode[op.type](op.value));
      }

      if (wmm) {
          wmm.set(ops, d);
      }

      return d;
  };

  /**
   * @param {Array}
   * @returns {number}
   */
  sizeOf.CHARSTRING = function(ops) {
      return encode.CHARSTRING(ops).length;
  };

  // Utility functions ////////////////////////////////////////////////////////

  /**
   * Convert an object containing name / type / value to bytes.
   * @param {Object}
   * @returns {Array}
   */
  encode.OBJECT = function(v) {
      var encodingFunction = encode[v.type];
      check.argument(encodingFunction !== undefined, 'No encoding function for type ' + v.type);
      return encodingFunction(v.value);
  };

  /**
   * @param {Object}
   * @returns {number}
   */
  sizeOf.OBJECT = function(v) {
      var sizeOfFunction = sizeOf[v.type];
      check.argument(sizeOfFunction !== undefined, 'No sizeOf function for type ' + v.type);
      return sizeOfFunction(v.value);
  };

  /**
   * Convert a table object to bytes.
   * A table contains a list of fields containing the metadata (name, type and default value).
   * The table itself has the field values set as attributes.
   * @param {opentype.Table}
   * @returns {Array}
   */
  encode.TABLE = function(table) {
      var d = [];
      var length = table.fields.length;
      var subtables = [];
      var subtableOffsets = [];

      for (var i = 0; i < length; i += 1) {
          var field = table.fields[i];
          var encodingFunction = encode[field.type];
          check.argument(encodingFunction !== undefined, 'No encoding function for field type ' + field.type + ' (' + field.name + ')');
          var value = table[field.name];
          if (value === undefined) {
              value = field.value;
          }

          var bytes = encodingFunction(value);

          if (field.type === 'TABLE') {
              subtableOffsets.push(d.length);
              d = d.concat([0, 0]);
              subtables.push(bytes);
          } else {
              d = d.concat(bytes);
          }
      }

      for (var i$1 = 0; i$1 < subtables.length; i$1 += 1) {
          var o = subtableOffsets[i$1];
          var offset = d.length;
          check.argument(offset < 65536, 'Table ' + table.tableName + ' too big.');
          d[o] = offset >> 8;
          d[o + 1] = offset & 0xff;
          d = d.concat(subtables[i$1]);
      }

      return d;
  };

  /**
   * @param {opentype.Table}
   * @returns {number}
   */
  sizeOf.TABLE = function(table) {
      var numBytes = 0;
      var length = table.fields.length;

      for (var i = 0; i < length; i += 1) {
          var field = table.fields[i];
          var sizeOfFunction = sizeOf[field.type];
          check.argument(sizeOfFunction !== undefined, 'No sizeOf function for field type ' + field.type + ' (' + field.name + ')');
          var value = table[field.name];
          if (value === undefined) {
              value = field.value;
          }

          numBytes += sizeOfFunction(value);

          // Subtables take 2 more bytes for offsets.
          if (field.type === 'TABLE') {
              numBytes += 2;
          }
      }

      return numBytes;
  };

  encode.RECORD = encode.TABLE;
  sizeOf.RECORD = sizeOf.TABLE;

  // Merge in a list of bytes.
  encode.LITERAL = function(v) {
      return v;
  };

  sizeOf.LITERAL = function(v) {
      return v.length;
  };

  // Table metadata

  /**
   * @exports opentype.Table
   * @class
   * @param {string} tableName
   * @param {Array} fields
   * @param {Object} options
   * @constructor
   */
  function Table(tableName, fields, options) {
      // For coverage tables with coverage format 2, we do not want to add the coverage data directly to the table object,
      // as this will result in wrong encoding order of the coverage data on serialization to bytes.
      // The fallback of using the field values directly when not present on the table is handled in types.encode.TABLE() already.
      if (fields.length && (fields[0].name !== 'coverageFormat' || fields[0].value === 1)) {
          for (var i = 0; i < fields.length; i += 1) {
              var field = fields[i];
              this[field.name] = field.value;
          }
      }

      this.tableName = tableName;
      this.fields = fields;
      if (options) {
          var optionKeys = Object.keys(options);
          for (var i$1 = 0; i$1 < optionKeys.length; i$1 += 1) {
              var k = optionKeys[i$1];
              var v = options[k];
              if (this[k] !== undefined) {
                  this[k] = v;
              }
          }
      }
  }

  /**
   * Encodes the table and returns an array of bytes
   * @return {Array}
   */
  Table.prototype.encode = function() {
      return encode.TABLE(this);
  };

  /**
   * Get the size of the table.
   * @return {number}
   */
  Table.prototype.sizeOf = function() {
      return sizeOf.TABLE(this);
  };

  /**
   * @private
   */
  function ushortList(itemName, list, count) {
      if (count === undefined) {
          count = list.length;
      }
      var fields = new Array(list.length + 1);
      fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
      for (var i = 0; i < list.length; i++) {
          fields[i + 1] = {name: itemName + i, type: 'USHORT', value: list[i]};
      }
      return fields;
  }

  /**
   * @private
   */
  function tableList(itemName, records, itemCallback) {
      var count = records.length;
      var fields = new Array(count + 1);
      fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
      for (var i = 0; i < count; i++) {
          fields[i + 1] = {name: itemName + i, type: 'TABLE', value: itemCallback(records[i], i)};
      }
      return fields;
  }

  /**
   * @private
   */
  function recordList(itemName, records, itemCallback) {
      var count = records.length;
      var fields = [];
      fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
      for (var i = 0; i < count; i++) {
          fields = fields.concat(itemCallback(records[i], i));
      }
      return fields;
  }

  // Common Layout Tables

  /**
   * @exports opentype.Coverage
   * @class
   * @param {opentype.Table}
   * @constructor
   * @extends opentype.Table
   */
  function Coverage(coverageTable) {
      if (coverageTable.format === 1) {
          Table.call(this, 'coverageTable',
              [{name: 'coverageFormat', type: 'USHORT', value: 1}]
              .concat(ushortList('glyph', coverageTable.glyphs))
          );
      } else if (coverageTable.format === 2) {
          Table.call(this, 'coverageTable',
              [{name: 'coverageFormat', type: 'USHORT', value: 2}]
              .concat(recordList('rangeRecord', coverageTable.ranges, function(RangeRecord) {
                  return [
                      {name: 'startGlyphID', type: 'USHORT', value: RangeRecord.start},
                      {name: 'endGlyphID', type: 'USHORT', value: RangeRecord.end},
                      {name: 'startCoverageIndex', type: 'USHORT', value: RangeRecord.index} ];
              }))
          );
      } else {
          check.assert(false, 'Coverage format must be 1 or 2.');
      }
  }
  Coverage.prototype = Object.create(Table.prototype);
  Coverage.prototype.constructor = Coverage;

  function ScriptList(scriptListTable) {
      Table.call(this, 'scriptListTable',
          recordList('scriptRecord', scriptListTable, function(scriptRecord, i) {
              var script = scriptRecord.script;
              var defaultLangSys = script.defaultLangSys;
              check.assert(!!defaultLangSys, 'Unable to write GSUB: script ' + scriptRecord.tag + ' has no default language system.');
              return [
                  {name: 'scriptTag' + i, type: 'TAG', value: scriptRecord.tag},
                  {name: 'script' + i, type: 'TABLE', value: new Table('scriptTable', [
                      {name: 'defaultLangSys', type: 'TABLE', value: new Table('defaultLangSys', [
                          {name: 'lookupOrder', type: 'USHORT', value: 0},
                          {name: 'reqFeatureIndex', type: 'USHORT', value: defaultLangSys.reqFeatureIndex}]
                          .concat(ushortList('featureIndex', defaultLangSys.featureIndexes)))}
                      ].concat(recordList('langSys', script.langSysRecords, function(langSysRecord, i) {
                          var langSys = langSysRecord.langSys;
                          return [
                              {name: 'langSysTag' + i, type: 'TAG', value: langSysRecord.tag},
                              {name: 'langSys' + i, type: 'TABLE', value: new Table('langSys', [
                                  {name: 'lookupOrder', type: 'USHORT', value: 0},
                                  {name: 'reqFeatureIndex', type: 'USHORT', value: langSys.reqFeatureIndex}
                                  ].concat(ushortList('featureIndex', langSys.featureIndexes)))}
                          ];
                      })))}
              ];
          })
      );
  }
  ScriptList.prototype = Object.create(Table.prototype);
  ScriptList.prototype.constructor = ScriptList;

  /**
   * @exports opentype.FeatureList
   * @class
   * @param {opentype.Table}
   * @constructor
   * @extends opentype.Table
   */
  function FeatureList(featureListTable) {
      Table.call(this, 'featureListTable',
          recordList('featureRecord', featureListTable, function(featureRecord, i) {
              var feature = featureRecord.feature;
              return [
                  {name: 'featureTag' + i, type: 'TAG', value: featureRecord.tag},
                  {name: 'feature' + i, type: 'TABLE', value: new Table('featureTable', [
                      {name: 'featureParams', type: 'USHORT', value: feature.featureParams} ].concat(ushortList('lookupListIndex', feature.lookupListIndexes)))}
              ];
          })
      );
  }
  FeatureList.prototype = Object.create(Table.prototype);
  FeatureList.prototype.constructor = FeatureList;

  /**
   * @exports opentype.LookupList
   * @class
   * @param {opentype.Table}
   * @param {Object}
   * @constructor
   * @extends opentype.Table
   */
  function LookupList(lookupListTable, subtableMakers) {
      Table.call(this, 'lookupListTable', tableList('lookup', lookupListTable, function(lookupTable) {
          var subtableCallback = subtableMakers[lookupTable.lookupType];
          check.assert(!!subtableCallback, 'Unable to write GSUB lookup type ' + lookupTable.lookupType + ' tables.');
          return new Table('lookupTable', [
              {name: 'lookupType', type: 'USHORT', value: lookupTable.lookupType},
              {name: 'lookupFlag', type: 'USHORT', value: lookupTable.lookupFlag}
          ].concat(tableList('subtable', lookupTable.subtables, subtableCallback)));
      }));
  }
  LookupList.prototype = Object.create(Table.prototype);
  LookupList.prototype.constructor = LookupList;

  // Record = same as Table, but inlined (a Table has an offset and its data is further in the stream)
  // Don't use offsets inside Records (probable bug), only in Tables.
  var table = {
      Table: Table,
      Record: Table,
      Coverage: Coverage,
      ScriptList: ScriptList,
      FeatureList: FeatureList,
      LookupList: LookupList,
      ushortList: ushortList,
      tableList: tableList,
      recordList: recordList,
  };

  // Parsing utility functions

  // Retrieve an unsigned byte from the DataView.
  function getByte(dataView, offset) {
      return dataView.getUint8(offset);
  }

  // Retrieve an unsigned 16-bit short from the DataView.
  // The value is stored in big endian.
  function getUShort(dataView, offset) {
      return dataView.getUint16(offset, false);
  }

  // Retrieve a signed 16-bit short from the DataView.
  // The value is stored in big endian.
  function getShort(dataView, offset) {
      return dataView.getInt16(offset, false);
  }

  // Retrieve an unsigned 32-bit long from the DataView.
  // The value is stored in big endian.
  function getULong(dataView, offset) {
      return dataView.getUint32(offset, false);
  }

  // Retrieve a 32-bit signed fixed-point number (16.16) from the DataView.
  // The value is stored in big endian.
  function getFixed(dataView, offset) {
      var decimal = dataView.getInt16(offset, false);
      var fraction = dataView.getUint16(offset + 2, false);
      return decimal + fraction / 65535;
  }

  // Retrieve a 4-character tag from the DataView.
  // Tags are used to identify tables.
  function getTag(dataView, offset) {
      var tag = '';
      for (var i = offset; i < offset + 4; i += 1) {
          tag += String.fromCharCode(dataView.getInt8(i));
      }

      return tag;
  }

  // Retrieve an offset from the DataView.
  // Offsets are 1 to 4 bytes in length, depending on the offSize argument.
  function getOffset(dataView, offset, offSize) {
      var v = 0;
      for (var i = 0; i < offSize; i += 1) {
          v <<= 8;
          v += dataView.getUint8(offset + i);
      }

      return v;
  }

  // Retrieve a number of bytes from start offset to the end offset from the DataView.
  function getBytes(dataView, startOffset, endOffset) {
      var bytes = [];
      for (var i = startOffset; i < endOffset; i += 1) {
          bytes.push(dataView.getUint8(i));
      }

      return bytes;
  }

  // Convert the list of bytes to a string.
  function bytesToString(bytes) {
      var s = '';
      for (var i = 0; i < bytes.length; i += 1) {
          s += String.fromCharCode(bytes[i]);
      }

      return s;
  }

  var typeOffsets = {
      byte: 1,
      uShort: 2,
      short: 2,
      uLong: 4,
      fixed: 4,
      longDateTime: 8,
      tag: 4
  };

  // A stateful parser that changes the offset whenever a value is retrieved.
  // The data is a DataView.
  function Parser$1(data, offset) {
      this.data = data;
      this.offset = offset;
      this.relativeOffset = 0;
  }

  Parser$1.prototype.parseByte = function() {
      var v = this.data.getUint8(this.offset + this.relativeOffset);
      this.relativeOffset += 1;
      return v;
  };

  Parser$1.prototype.parseChar = function() {
      var v = this.data.getInt8(this.offset + this.relativeOffset);
      this.relativeOffset += 1;
      return v;
  };

  Parser$1.prototype.parseCard8 = Parser$1.prototype.parseByte;

  Parser$1.prototype.parseUShort = function() {
      var v = this.data.getUint16(this.offset + this.relativeOffset);
      this.relativeOffset += 2;
      return v;
  };

  Parser$1.prototype.parseCard16 = Parser$1.prototype.parseUShort;
  Parser$1.prototype.parseSID = Parser$1.prototype.parseUShort;
  Parser$1.prototype.parseOffset16 = Parser$1.prototype.parseUShort;

  Parser$1.prototype.parseShort = function() {
      var v = this.data.getInt16(this.offset + this.relativeOffset);
      this.relativeOffset += 2;
      return v;
  };

  Parser$1.prototype.parseF2Dot14 = function() {
      var v = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
      this.relativeOffset += 2;
      return v;
  };

  Parser$1.prototype.parseULong = function() {
      var v = getULong(this.data, this.offset + this.relativeOffset);
      this.relativeOffset += 4;
      return v;
  };

  Parser$1.prototype.parseOffset32 = Parser$1.prototype.parseULong;

  Parser$1.prototype.parseFixed = function() {
      var v = getFixed(this.data, this.offset + this.relativeOffset);
      this.relativeOffset += 4;
      return v;
  };

  Parser$1.prototype.parseString = function(length) {
      var dataView = this.data;
      var offset = this.offset + this.relativeOffset;
      var string = '';
      this.relativeOffset += length;
      for (var i = 0; i < length; i++) {
          string += String.fromCharCode(dataView.getUint8(offset + i));
      }

      return string;
  };

  Parser$1.prototype.parseTag = function() {
      return this.parseString(4);
  };

  // LONGDATETIME is a 64-bit integer.
  // JavaScript and unix timestamps traditionally use 32 bits, so we
  // only take the last 32 bits.
  // + Since until 2038 those bits will be filled by zeros we can ignore them.
  Parser$1.prototype.parseLongDateTime = function() {
      var v = getULong(this.data, this.offset + this.relativeOffset + 4);
      // Subtract seconds between 01/01/1904 and 01/01/1970
      // to convert Apple Mac timestamp to Standard Unix timestamp
      v -= 2082844800;
      this.relativeOffset += 8;
      return v;
  };

  Parser$1.prototype.parseVersion = function(minorBase) {
      var major = getUShort(this.data, this.offset + this.relativeOffset);

      // How to interpret the minor version is very vague in the spec. 0x5000 is 5, 0x1000 is 1
      // Default returns the correct number if minor = 0xN000 where N is 0-9
      // Set minorBase to 1 for tables that use minor = N where N is 0-9
      var minor = getUShort(this.data, this.offset + this.relativeOffset + 2);
      this.relativeOffset += 4;
      if (minorBase === undefined) { minorBase = 0x1000; }
      return major + minor / minorBase / 10;
  };

  Parser$1.prototype.skip = function(type, amount) {
      if (amount === undefined) {
          amount = 1;
      }

      this.relativeOffset += typeOffsets[type] * amount;
  };

  ///// Parsing lists and records ///////////////////////////////

  // Parse a list of 32 bit unsigned integers.
  Parser$1.prototype.parseULongList = function(count) {
      if (count === undefined) { count = this.parseULong(); }
      var offsets = new Array(count);
      var dataView = this.data;
      var offset = this.offset + this.relativeOffset;
      for (var i = 0; i < count; i++) {
          offsets[i] = dataView.getUint32(offset);
          offset += 4;
      }

      this.relativeOffset += count * 4;
      return offsets;
  };

  // Parse a list of 16 bit unsigned integers. The length of the list can be read on the stream
  // or provided as an argument.
  Parser$1.prototype.parseOffset16List =
  Parser$1.prototype.parseUShortList = function(count) {
      if (count === undefined) { count = this.parseUShort(); }
      var offsets = new Array(count);
      var dataView = this.data;
      var offset = this.offset + this.relativeOffset;
      for (var i = 0; i < count; i++) {
          offsets[i] = dataView.getUint16(offset);
          offset += 2;
      }

      this.relativeOffset += count * 2;
      return offsets;
  };

  // Parses a list of 16 bit signed integers.
  Parser$1.prototype.parseShortList = function(count) {
      var list = new Array(count);
      var dataView = this.data;
      var offset = this.offset + this.relativeOffset;
      for (var i = 0; i < count; i++) {
          list[i] = dataView.getInt16(offset);
          offset += 2;
      }

      this.relativeOffset += count * 2;
      return list;
  };

  // Parses a list of bytes.
  Parser$1.prototype.parseByteList = function(count) {
      var list = new Array(count);
      var dataView = this.data;
      var offset = this.offset + this.relativeOffset;
      for (var i = 0; i < count; i++) {
          list[i] = dataView.getUint8(offset++);
      }

      this.relativeOffset += count;
      return list;
  };

  /**
   * Parse a list of items.
   * Record count is optional, if omitted it is read from the stream.
   * itemCallback is one of the Parser methods.
   */
  Parser$1.prototype.parseList = function(count, itemCallback) {
      if (!itemCallback) {
          itemCallback = count;
          count = this.parseUShort();
      }
      var list = new Array(count);
      for (var i = 0; i < count; i++) {
          list[i] = itemCallback.call(this);
      }
      return list;
  };

  Parser$1.prototype.parseList32 = function(count, itemCallback) {
      if (!itemCallback) {
          itemCallback = count;
          count = this.parseULong();
      }
      var list = new Array(count);
      for (var i = 0; i < count; i++) {
          list[i] = itemCallback.call(this);
      }
      return list;
  };

  /**
   * Parse a list of records.
   * Record count is optional, if omitted it is read from the stream.
   * Example of recordDescription: { sequenceIndex: Parser.uShort, lookupListIndex: Parser.uShort }
   */
  Parser$1.prototype.parseRecordList = function(count, recordDescription) {
      // If the count argument is absent, read it in the stream.
      if (!recordDescription) {
          recordDescription = count;
          count = this.parseUShort();
      }
      var records = new Array(count);
      var fields = Object.keys(recordDescription);
      for (var i = 0; i < count; i++) {
          var rec = {};
          for (var j = 0; j < fields.length; j++) {
              var fieldName = fields[j];
              var fieldType = recordDescription[fieldName];
              rec[fieldName] = fieldType.call(this);
          }
          records[i] = rec;
      }
      return records;
  };

  Parser$1.prototype.parseRecordList32 = function(count, recordDescription) {
      // If the count argument is absent, read it in the stream.
      if (!recordDescription) {
          recordDescription = count;
          count = this.parseULong();
      }
      var records = new Array(count);
      var fields = Object.keys(recordDescription);
      for (var i = 0; i < count; i++) {
          var rec = {};
          for (var j = 0; j < fields.length; j++) {
              var fieldName = fields[j];
              var fieldType = recordDescription[fieldName];
              rec[fieldName] = fieldType.call(this);
          }
          records[i] = rec;
      }
      return records;
  };

  // Parse a data structure into an object
  // Example of description: { sequenceIndex: Parser.uShort, lookupListIndex: Parser.uShort }
  Parser$1.prototype.parseStruct = function(description) {
      if (typeof description === 'function') {
          return description.call(this);
      } else {
          var fields = Object.keys(description);
          var struct = {};
          for (var j = 0; j < fields.length; j++) {
              var fieldName = fields[j];
              var fieldType = description[fieldName];
              struct[fieldName] = fieldType.call(this);
          }
          return struct;
      }
  };

  /**
   * Parse a GPOS valueRecord
   * https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#value-record
   * valueFormat is optional, if omitted it is read from the stream.
   */
  Parser$1.prototype.parseValueRecord = function(valueFormat) {
      if (valueFormat === undefined) {
          valueFormat = this.parseUShort();
      }
      if (valueFormat === 0) {
          // valueFormat2 in kerning pairs is most often 0
          // in this case return undefined instead of an empty object, to save space
          return;
      }
      var valueRecord = {};

      if (valueFormat & 0x0001) { valueRecord.xPlacement = this.parseShort(); }
      if (valueFormat & 0x0002) { valueRecord.yPlacement = this.parseShort(); }
      if (valueFormat & 0x0004) { valueRecord.xAdvance = this.parseShort(); }
      if (valueFormat & 0x0008) { valueRecord.yAdvance = this.parseShort(); }

      // Device table (non-variable font) / VariationIndex table (variable font) not supported
      // https://docs.microsoft.com/fr-fr/typography/opentype/spec/chapter2#devVarIdxTbls
      if (valueFormat & 0x0010) { valueRecord.xPlaDevice = undefined; this.parseShort(); }
      if (valueFormat & 0x0020) { valueRecord.yPlaDevice = undefined; this.parseShort(); }
      if (valueFormat & 0x0040) { valueRecord.xAdvDevice = undefined; this.parseShort(); }
      if (valueFormat & 0x0080) { valueRecord.yAdvDevice = undefined; this.parseShort(); }

      return valueRecord;
  };

  /**
   * Parse a list of GPOS valueRecords
   * https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#value-record
   * valueFormat and valueCount are read from the stream.
   */
  Parser$1.prototype.parseValueRecordList = function() {
      var valueFormat = this.parseUShort();
      var valueCount = this.parseUShort();
      var values = new Array(valueCount);
      for (var i = 0; i < valueCount; i++) {
          values[i] = this.parseValueRecord(valueFormat);
      }
      return values;
  };

  Parser$1.prototype.parsePointer = function(description) {
      var structOffset = this.parseOffset16();
      if (structOffset > 0) {
          // NULL offset => return undefined
          return new Parser$1(this.data, this.offset + structOffset).parseStruct(description);
      }
      return undefined;
  };

  Parser$1.prototype.parsePointer32 = function(description) {
      var structOffset = this.parseOffset32();
      if (structOffset > 0) {
          // NULL offset => return undefined
          return new Parser$1(this.data, this.offset + structOffset).parseStruct(description);
      }
      return undefined;
  };

  /**
   * Parse a list of offsets to lists of 16-bit integers,
   * or a list of offsets to lists of offsets to any kind of items.
   * If itemCallback is not provided, a list of list of UShort is assumed.
   * If provided, itemCallback is called on each item and must parse the item.
   * See examples in tables/gsub.js
   */
  Parser$1.prototype.parseListOfLists = function(itemCallback) {
      var offsets = this.parseOffset16List();
      var count = offsets.length;
      var relativeOffset = this.relativeOffset;
      var list = new Array(count);
      for (var i = 0; i < count; i++) {
          var start = offsets[i];
          if (start === 0) {
              // NULL offset
              // Add i as owned property to list. Convenient with assert.
              list[i] = undefined;
              continue;
          }
          this.relativeOffset = start;
          if (itemCallback) {
              var subOffsets = this.parseOffset16List();
              var subList = new Array(subOffsets.length);
              for (var j = 0; j < subOffsets.length; j++) {
                  this.relativeOffset = start + subOffsets[j];
                  subList[j] = itemCallback.call(this);
              }
              list[i] = subList;
          } else {
              list[i] = this.parseUShortList();
          }
      }
      this.relativeOffset = relativeOffset;
      return list;
  };

  ///// Complex tables parsing //////////////////////////////////

  // Parse a coverage table in a GSUB, GPOS or GDEF table.
  // https://www.microsoft.com/typography/OTSPEC/chapter2.htm
  // parser.offset must point to the start of the table containing the coverage.
  Parser$1.prototype.parseCoverage = function() {
      var startOffset = this.offset + this.relativeOffset;
      var format = this.parseUShort();
      var count = this.parseUShort();
      if (format === 1) {
          return {
              format: 1,
              glyphs: this.parseUShortList(count)
          };
      } else if (format === 2) {
          var ranges = new Array(count);
          for (var i = 0; i < count; i++) {
              ranges[i] = {
                  start: this.parseUShort(),
                  end: this.parseUShort(),
                  index: this.parseUShort()
              };
          }
          return {
              format: 2,
              ranges: ranges
          };
      }
      throw new Error('0x' + startOffset.toString(16) + ': Coverage format must be 1 or 2.');
  };

  // Parse a Class Definition Table in a GSUB, GPOS or GDEF table.
  // https://www.microsoft.com/typography/OTSPEC/chapter2.htm
  Parser$1.prototype.parseClassDef = function() {
      var startOffset = this.offset + this.relativeOffset;
      var format = this.parseUShort();
      if (format === 1) {
          return {
              format: 1,
              startGlyph: this.parseUShort(),
              classes: this.parseUShortList()
          };
      } else if (format === 2) {
          return {
              format: 2,
              ranges: this.parseRecordList({
                  start: Parser$1.uShort,
                  end: Parser$1.uShort,
                  classId: Parser$1.uShort
              })
          };
      }
      throw new Error('0x' + startOffset.toString(16) + ': ClassDef format must be 1 or 2.');
  };

  ///// Static methods ///////////////////////////////////
  // These convenience methods can be used as callbacks and should be called with "this" context set to a Parser instance.

  Parser$1.list = function(count, itemCallback) {
      return function() {
          return this.parseList(count, itemCallback);
      };
  };

  Parser$1.list32 = function(count, itemCallback) {
      return function() {
          return this.parseList32(count, itemCallback);
      };
  };

  Parser$1.recordList = function(count, recordDescription) {
      return function() {
          return this.parseRecordList(count, recordDescription);
      };
  };

  Parser$1.recordList32 = function(count, recordDescription) {
      return function() {
          return this.parseRecordList32(count, recordDescription);
      };
  };

  Parser$1.pointer = function(description) {
      return function() {
          return this.parsePointer(description);
      };
  };

  Parser$1.pointer32 = function(description) {
      return function() {
          return this.parsePointer32(description);
      };
  };

  Parser$1.tag = Parser$1.prototype.parseTag;
  Parser$1.byte = Parser$1.prototype.parseByte;
  Parser$1.uShort = Parser$1.offset16 = Parser$1.prototype.parseUShort;
  Parser$1.uShortList = Parser$1.prototype.parseUShortList;
  Parser$1.uLong = Parser$1.offset32 = Parser$1.prototype.parseULong;
  Parser$1.uLongList = Parser$1.prototype.parseULongList;
  Parser$1.struct = Parser$1.prototype.parseStruct;
  Parser$1.coverage = Parser$1.prototype.parseCoverage;
  Parser$1.classDef = Parser$1.prototype.parseClassDef;

  ///// Script, Feature, Lookup lists ///////////////////////////////////////////////
  // https://www.microsoft.com/typography/OTSPEC/chapter2.htm

  var langSysTable = {
      reserved: Parser$1.uShort,
      reqFeatureIndex: Parser$1.uShort,
      featureIndexes: Parser$1.uShortList
  };

  Parser$1.prototype.parseScriptList = function() {
      return this.parsePointer(Parser$1.recordList({
          tag: Parser$1.tag,
          script: Parser$1.pointer({
              defaultLangSys: Parser$1.pointer(langSysTable),
              langSysRecords: Parser$1.recordList({
                  tag: Parser$1.tag,
                  langSys: Parser$1.pointer(langSysTable)
              })
          })
      })) || [];
  };

  Parser$1.prototype.parseFeatureList = function() {
      return this.parsePointer(Parser$1.recordList({
          tag: Parser$1.tag,
          feature: Parser$1.pointer({
              featureParams: Parser$1.offset16,
              lookupListIndexes: Parser$1.uShortList
          })
      })) || [];
  };

  Parser$1.prototype.parseLookupList = function(lookupTableParsers) {
      return this.parsePointer(Parser$1.list(Parser$1.pointer(function() {
          var lookupType = this.parseUShort();
          check.argument(1 <= lookupType && lookupType <= 9, 'GPOS/GSUB lookup type ' + lookupType + ' unknown.');
          var lookupFlag = this.parseUShort();
          var useMarkFilteringSet = lookupFlag & 0x10;
          return {
              lookupType: lookupType,
              lookupFlag: lookupFlag,
              subtables: this.parseList(Parser$1.pointer(lookupTableParsers[lookupType])),
              markFilteringSet: useMarkFilteringSet ? this.parseUShort() : undefined
          };
      }))) || [];
  };

  Parser$1.prototype.parseFeatureVariationsList = function() {
      return this.parsePointer32(function() {
          var majorVersion = this.parseUShort();
          var minorVersion = this.parseUShort();
          check.argument(majorVersion === 1 && minorVersion < 1, 'GPOS/GSUB feature variations table unknown.');
          var featureVariations = this.parseRecordList32({
              conditionSetOffset: Parser$1.offset32,
              featureTableSubstitutionOffset: Parser$1.offset32
          });
          return featureVariations;
      }) || [];
  };

  var parse = {
      getByte: getByte,
      getCard8: getByte,
      getUShort: getUShort,
      getCard16: getUShort,
      getShort: getShort,
      getULong: getULong,
      getFixed: getFixed,
      getTag: getTag,
      getOffset: getOffset,
      getBytes: getBytes,
      bytesToString: bytesToString,
      Parser: Parser$1,
  };

  // The `cmap` table stores the mappings from characters to glyphs.

  function parseCmapTableFormat12(cmap, p) {
      //Skip reserved.
      p.parseUShort();

      // Length in bytes of the sub-tables.
      cmap.length = p.parseULong();
      cmap.language = p.parseULong();

      var groupCount;
      cmap.groupCount = groupCount = p.parseULong();
      cmap.glyphIndexMap = {};

      for (var i = 0; i < groupCount; i += 1) {
          var startCharCode = p.parseULong();
          var endCharCode = p.parseULong();
          var startGlyphId = p.parseULong();

          for (var c = startCharCode; c <= endCharCode; c += 1) {
              cmap.glyphIndexMap[c] = startGlyphId;
              startGlyphId++;
          }
      }
  }

  function parseCmapTableFormat4(cmap, p, data, start, offset) {
      // Length in bytes of the sub-tables.
      cmap.length = p.parseUShort();
      cmap.language = p.parseUShort();

      // segCount is stored x 2.
      var segCount;
      cmap.segCount = segCount = p.parseUShort() >> 1;

      // Skip searchRange, entrySelector, rangeShift.
      p.skip('uShort', 3);

      // The "unrolled" mapping from character codes to glyph indices.
      cmap.glyphIndexMap = {};
      var endCountParser = new parse.Parser(data, start + offset + 14);
      var startCountParser = new parse.Parser(data, start + offset + 16 + segCount * 2);
      var idDeltaParser = new parse.Parser(data, start + offset + 16 + segCount * 4);
      var idRangeOffsetParser = new parse.Parser(data, start + offset + 16 + segCount * 6);
      var glyphIndexOffset = start + offset + 16 + segCount * 8;
      for (var i = 0; i < segCount - 1; i += 1) {
          var glyphIndex = (void 0);
          var endCount = endCountParser.parseUShort();
          var startCount = startCountParser.parseUShort();
          var idDelta = idDeltaParser.parseShort();
          var idRangeOffset = idRangeOffsetParser.parseUShort();
          for (var c = startCount; c <= endCount; c += 1) {
              if (idRangeOffset !== 0) {
                  // The idRangeOffset is relative to the current position in the idRangeOffset array.
                  // Take the current offset in the idRangeOffset array.
                  glyphIndexOffset = (idRangeOffsetParser.offset + idRangeOffsetParser.relativeOffset - 2);

                  // Add the value of the idRangeOffset, which will move us into the glyphIndex array.
                  glyphIndexOffset += idRangeOffset;

                  // Then add the character index of the current segment, multiplied by 2 for USHORTs.
                  glyphIndexOffset += (c - startCount) * 2;
                  glyphIndex = parse.getUShort(data, glyphIndexOffset);
                  if (glyphIndex !== 0) {
                      glyphIndex = (glyphIndex + idDelta) & 0xFFFF;
                  }
              } else {
                  glyphIndex = (c + idDelta) & 0xFFFF;
              }

              cmap.glyphIndexMap[c] = glyphIndex;
          }
      }
  }

  // Parse the `cmap` table. This table stores the mappings from characters to glyphs.
  // There are many available formats, but we only support the Windows format 4 and 12.
  // This function returns a `CmapEncoding` object or null if no supported format could be found.
  function parseCmapTable(data, start) {
      var cmap = {};
      cmap.version = parse.getUShort(data, start);
      check.argument(cmap.version === 0, 'cmap table version should be 0.');

      // The cmap table can contain many sub-tables, each with their own format.
      // We're only interested in a "platform 0" (Unicode format) and "platform 3" (Windows format) table.
      cmap.numTables = parse.getUShort(data, start + 2);
      var offset = -1;
      for (var i = cmap.numTables - 1; i >= 0; i -= 1) {
          var platformId = parse.getUShort(data, start + 4 + (i * 8));
          var encodingId = parse.getUShort(data, start + 4 + (i * 8) + 2);
          if ((platformId === 3 && (encodingId === 0 || encodingId === 1 || encodingId === 10)) ||
              (platformId === 0 && (encodingId === 0 || encodingId === 1 || encodingId === 2 || encodingId === 3 || encodingId === 4))) {
              offset = parse.getULong(data, start + 4 + (i * 8) + 4);
              break;
          }
      }

      if (offset === -1) {
          // There is no cmap table in the font that we support.
          throw new Error('No valid cmap sub-tables found.');
      }

      var p = new parse.Parser(data, start + offset);
      cmap.format = p.parseUShort();

      if (cmap.format === 12) {
          parseCmapTableFormat12(cmap, p);
      } else if (cmap.format === 4) {
          parseCmapTableFormat4(cmap, p, data, start, offset);
      } else {
          throw new Error('Only format 4 and 12 cmap tables are supported (found format ' + cmap.format + ').');
      }

      return cmap;
  }

  function addSegment(t, code, glyphIndex) {
      t.segments.push({
          end: code,
          start: code,
          delta: -(code - glyphIndex),
          offset: 0,
          glyphIndex: glyphIndex
      });
  }

  function addTerminatorSegment(t) {
      t.segments.push({
          end: 0xFFFF,
          start: 0xFFFF,
          delta: 1,
          offset: 0
      });
  }

  // Make cmap table, format 4 by default, 12 if needed only
  function makeCmapTable(glyphs) {
      // Plan 0 is the base Unicode Plan but emojis, for example are on another plan, and needs cmap 12 format (with 32bit)
      var isPlan0Only = true;
      var i;

      // Check if we need to add cmap format 12 or if format 4 only is fine
      for (i = glyphs.length - 1; i > 0; i -= 1) {
          var g = glyphs.get(i);
          if (g.unicode > 65535) {
              console.log('Adding CMAP format 12 (needed!)');
              isPlan0Only = false;
              break;
          }
      }

      var cmapTable = [
          {name: 'version', type: 'USHORT', value: 0},
          {name: 'numTables', type: 'USHORT', value: isPlan0Only ? 1 : 2},

          // CMAP 4 header
          {name: 'platformID', type: 'USHORT', value: 3},
          {name: 'encodingID', type: 'USHORT', value: 1},
          {name: 'offset', type: 'ULONG', value: isPlan0Only ? 12 : (12 + 8)}
      ];

      if (!isPlan0Only)
          { cmapTable = cmapTable.concat([
              // CMAP 12 header
              {name: 'cmap12PlatformID', type: 'USHORT', value: 3}, // We encode only for PlatformID = 3 (Windows) because it is supported everywhere
              {name: 'cmap12EncodingID', type: 'USHORT', value: 10},
              {name: 'cmap12Offset', type: 'ULONG', value: 0}
          ]); }

      cmapTable = cmapTable.concat([
          // CMAP 4 Subtable
          {name: 'format', type: 'USHORT', value: 4},
          {name: 'cmap4Length', type: 'USHORT', value: 0},
          {name: 'language', type: 'USHORT', value: 0},
          {name: 'segCountX2', type: 'USHORT', value: 0},
          {name: 'searchRange', type: 'USHORT', value: 0},
          {name: 'entrySelector', type: 'USHORT', value: 0},
          {name: 'rangeShift', type: 'USHORT', value: 0}
      ]);

      var t = new table.Table('cmap', cmapTable);

      t.segments = [];
      for (i = 0; i < glyphs.length; i += 1) {
          var glyph = glyphs.get(i);
          for (var j = 0; j < glyph.unicodes.length; j += 1) {
              addSegment(t, glyph.unicodes[j], i);
          }

          t.segments = t.segments.sort(function (a, b) {
              return a.start - b.start;
          });
      }

      addTerminatorSegment(t);

      var segCount = t.segments.length;
      var segCountToRemove = 0;

      // CMAP 4
      // Set up parallel segment arrays.
      var endCounts = [];
      var startCounts = [];
      var idDeltas = [];
      var idRangeOffsets = [];
      var glyphIds = [];

      // CMAP 12
      var cmap12Groups = [];

      // Reminder this loop is not following the specification at 100%
      // The specification -> find suites of characters and make a group
      // Here we're doing one group for each letter
      // Doing as the spec can save 8 times (or more) space
      for (i = 0; i < segCount; i += 1) {
          var segment = t.segments[i];

          // CMAP 4
          if (segment.end <= 65535 && segment.start <= 65535) {
              endCounts = endCounts.concat({name: 'end_' + i, type: 'USHORT', value: segment.end});
              startCounts = startCounts.concat({name: 'start_' + i, type: 'USHORT', value: segment.start});
              idDeltas = idDeltas.concat({name: 'idDelta_' + i, type: 'SHORT', value: segment.delta});
              idRangeOffsets = idRangeOffsets.concat({name: 'idRangeOffset_' + i, type: 'USHORT', value: segment.offset});
              if (segment.glyphId !== undefined) {
                  glyphIds = glyphIds.concat({name: 'glyph_' + i, type: 'USHORT', value: segment.glyphId});
              }
          } else {
              // Skip Unicode > 65535 (16bit unsigned max) for CMAP 4, will be added in CMAP 12
              segCountToRemove += 1;
          }

          // CMAP 12
          // Skip Terminator Segment
          if (!isPlan0Only && segment.glyphIndex !== undefined) {
              cmap12Groups = cmap12Groups.concat({name: 'cmap12Start_' + i, type: 'ULONG', value: segment.start});
              cmap12Groups = cmap12Groups.concat({name: 'cmap12End_' + i, type: 'ULONG', value: segment.end});
              cmap12Groups = cmap12Groups.concat({name: 'cmap12Glyph_' + i, type: 'ULONG', value: segment.glyphIndex});
          }
      }

      // CMAP 4 Subtable
      t.segCountX2 = (segCount - segCountToRemove) * 2;
      t.searchRange = Math.pow(2, Math.floor(Math.log((segCount - segCountToRemove)) / Math.log(2))) * 2;
      t.entrySelector = Math.log(t.searchRange / 2) / Math.log(2);
      t.rangeShift = t.segCountX2 - t.searchRange;

      t.fields = t.fields.concat(endCounts);
      t.fields.push({name: 'reservedPad', type: 'USHORT', value: 0});
      t.fields = t.fields.concat(startCounts);
      t.fields = t.fields.concat(idDeltas);
      t.fields = t.fields.concat(idRangeOffsets);
      t.fields = t.fields.concat(glyphIds);

      t.cmap4Length = 14 + // Subtable header
          endCounts.length * 2 +
          2 + // reservedPad
          startCounts.length * 2 +
          idDeltas.length * 2 +
          idRangeOffsets.length * 2 +
          glyphIds.length * 2;

      if (!isPlan0Only) {
          // CMAP 12 Subtable
          var cmap12Length = 16 + // Subtable header
              cmap12Groups.length * 4;

          t.cmap12Offset = 12 + (2 * 2) + 4 + t.cmap4Length;
          t.fields = t.fields.concat([
              {name: 'cmap12Format', type: 'USHORT', value: 12},
              {name: 'cmap12Reserved', type: 'USHORT', value: 0},
              {name: 'cmap12Length', type: 'ULONG', value: cmap12Length},
              {name: 'cmap12Language', type: 'ULONG', value: 0},
              {name: 'cmap12nGroups', type: 'ULONG', value: cmap12Groups.length / 3}
          ]);

          t.fields = t.fields.concat(cmap12Groups);
      }

      return t;
  }

  var cmap = { parse: parseCmapTable, make: makeCmapTable };

  // Glyph encoding

  var cffStandardStrings = [
      '.notdef', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright',
      'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two',
      'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater',
      'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
      'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore',
      'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
      'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', 'exclamdown', 'cent', 'sterling',
      'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle', 'quotedblleft', 'guillemotleft',
      'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'endash', 'dagger', 'daggerdbl', 'periodcentered', 'paragraph',
      'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright', 'guillemotright', 'ellipsis', 'perthousand',
      'questiondown', 'grave', 'acute', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'dieresis', 'ring',
      'cedilla', 'hungarumlaut', 'ogonek', 'caron', 'emdash', 'AE', 'ordfeminine', 'Lslash', 'Oslash', 'OE',
      'ordmasculine', 'ae', 'dotlessi', 'lslash', 'oslash', 'oe', 'germandbls', 'onesuperior', 'logicalnot', 'mu',
      'trademark', 'Eth', 'onehalf', 'plusminus', 'Thorn', 'onequarter', 'divide', 'brokenbar', 'degree', 'thorn',
      'threequarters', 'twosuperior', 'registered', 'minus', 'eth', 'multiply', 'threesuperior', 'copyright',
      'Aacute', 'Acircumflex', 'Adieresis', 'Agrave', 'Aring', 'Atilde', 'Ccedilla', 'Eacute', 'Ecircumflex',
      'Edieresis', 'Egrave', 'Iacute', 'Icircumflex', 'Idieresis', 'Igrave', 'Ntilde', 'Oacute', 'Ocircumflex',
      'Odieresis', 'Ograve', 'Otilde', 'Scaron', 'Uacute', 'Ucircumflex', 'Udieresis', 'Ugrave', 'Yacute',
      'Ydieresis', 'Zcaron', 'aacute', 'acircumflex', 'adieresis', 'agrave', 'aring', 'atilde', 'ccedilla', 'eacute',
      'ecircumflex', 'edieresis', 'egrave', 'iacute', 'icircumflex', 'idieresis', 'igrave', 'ntilde', 'oacute',
      'ocircumflex', 'odieresis', 'ograve', 'otilde', 'scaron', 'uacute', 'ucircumflex', 'udieresis', 'ugrave',
      'yacute', 'ydieresis', 'zcaron', 'exclamsmall', 'Hungarumlautsmall', 'dollaroldstyle', 'dollarsuperior',
      'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', '266 ff', 'onedotenleader',
      'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle', 'fouroldstyle', 'fiveoldstyle', 'sixoldstyle',
      'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'commasuperior', 'threequartersemdash', 'periodsuperior',
      'questionsmall', 'asuperior', 'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', 'isuperior', 'lsuperior',
      'msuperior', 'nsuperior', 'osuperior', 'rsuperior', 'ssuperior', 'tsuperior', 'ff', 'ffi', 'ffl',
      'parenleftinferior', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall',
      'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall',
      'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall',
      'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', 'exclamdownsmall',
      'centoldstyle', 'Lslashsmall', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall', 'Brevesmall', 'Caronsmall',
      'Dotaccentsmall', 'Macronsmall', 'figuredash', 'hypheninferior', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall',
      'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds',
      'zerosuperior', 'foursuperior', 'fivesuperior', 'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior',
      'zeroinferior', 'oneinferior', 'twoinferior', 'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior',
      'seveninferior', 'eightinferior', 'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior',
      'commainferior', 'Agravesmall', 'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall',
      'Aringsmall', 'AEsmall', 'Ccedillasmall', 'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall',
      'Igravesmall', 'Iacutesmall', 'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall',
      'Oacutesmall', 'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall',
      'Uacutesmall', 'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall', '001.000',
      '001.001', '001.002', '001.003', 'Black', 'Bold', 'Book', 'Light', 'Medium', 'Regular', 'Roman', 'Semibold'];

  var cffStandardEncoding = [
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      '', '', '', '', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright',
      'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two',
      'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater',
      'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
      'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore',
      'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
      'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      'exclamdown', 'cent', 'sterling', 'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle',
      'quotedblleft', 'guillemotleft', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', '', 'endash', 'dagger',
      'daggerdbl', 'periodcentered', '', 'paragraph', 'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright',
      'guillemotright', 'ellipsis', 'perthousand', '', 'questiondown', '', 'grave', 'acute', 'circumflex', 'tilde',
      'macron', 'breve', 'dotaccent', 'dieresis', '', 'ring', 'cedilla', '', 'hungarumlaut', 'ogonek', 'caron',
      'emdash', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'AE', '', 'ordfeminine', '', '', '',
      '', 'Lslash', 'Oslash', 'OE', 'ordmasculine', '', '', '', '', '', 'ae', '', '', '', 'dotlessi', '', '',
      'lslash', 'oslash', 'oe', 'germandbls'];

  var cffExpertEncoding = [
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      '', '', '', '', 'space', 'exclamsmall', 'Hungarumlautsmall', '', 'dollaroldstyle', 'dollarsuperior',
      'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', 'twodotenleader', 'onedotenleader',
      'comma', 'hyphen', 'period', 'fraction', 'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle',
      'fouroldstyle', 'fiveoldstyle', 'sixoldstyle', 'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'colon',
      'semicolon', 'commasuperior', 'threequartersemdash', 'periodsuperior', 'questionsmall', '', 'asuperior',
      'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', '', '', 'isuperior', '', '', 'lsuperior', 'msuperior',
      'nsuperior', 'osuperior', '', '', 'rsuperior', 'ssuperior', 'tsuperior', '', 'ff', 'fi', 'fl', 'ffi', 'ffl',
      'parenleftinferior', '', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall',
      'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall',
      'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall',
      'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      'exclamdownsmall', 'centoldstyle', 'Lslashsmall', '', '', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall',
      'Brevesmall', 'Caronsmall', '', 'Dotaccentsmall', '', '', 'Macronsmall', '', '', 'figuredash', 'hypheninferior',
      '', '', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall', '', '', '', 'onequarter', 'onehalf', 'threequarters',
      'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds', '',
      '', 'zerosuperior', 'onesuperior', 'twosuperior', 'threesuperior', 'foursuperior', 'fivesuperior',
      'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior', 'zeroinferior', 'oneinferior', 'twoinferior',
      'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior', 'seveninferior', 'eightinferior',
      'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior', 'commainferior', 'Agravesmall',
      'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall', 'Aringsmall', 'AEsmall', 'Ccedillasmall',
      'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall', 'Igravesmall', 'Iacutesmall',
      'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall', 'Oacutesmall',
      'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall', 'Uacutesmall',
      'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall'];

  var standardNames = [
      '.notdef', '.null', 'nonmarkingreturn', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent',
      'ampersand', 'quotesingle', 'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash',
      'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less',
      'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
      'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright',
      'asciicircum', 'underscore', 'grave', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
      'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde',
      'Adieresis', 'Aring', 'Ccedilla', 'Eacute', 'Ntilde', 'Odieresis', 'Udieresis', 'aacute', 'agrave',
      'acircumflex', 'adieresis', 'atilde', 'aring', 'ccedilla', 'eacute', 'egrave', 'ecircumflex', 'edieresis',
      'iacute', 'igrave', 'icircumflex', 'idieresis', 'ntilde', 'oacute', 'ograve', 'ocircumflex', 'odieresis',
      'otilde', 'uacute', 'ugrave', 'ucircumflex', 'udieresis', 'dagger', 'degree', 'cent', 'sterling', 'section',
      'bullet', 'paragraph', 'germandbls', 'registered', 'copyright', 'trademark', 'acute', 'dieresis', 'notequal',
      'AE', 'Oslash', 'infinity', 'plusminus', 'lessequal', 'greaterequal', 'yen', 'mu', 'partialdiff', 'summation',
      'product', 'pi', 'integral', 'ordfeminine', 'ordmasculine', 'Omega', 'ae', 'oslash', 'questiondown',
      'exclamdown', 'logicalnot', 'radical', 'florin', 'approxequal', 'Delta', 'guillemotleft', 'guillemotright',
      'ellipsis', 'nonbreakingspace', 'Agrave', 'Atilde', 'Otilde', 'OE', 'oe', 'endash', 'emdash', 'quotedblleft',
      'quotedblright', 'quoteleft', 'quoteright', 'divide', 'lozenge', 'ydieresis', 'Ydieresis', 'fraction',
      'currency', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'daggerdbl', 'periodcentered', 'quotesinglbase',
      'quotedblbase', 'perthousand', 'Acircumflex', 'Ecircumflex', 'Aacute', 'Edieresis', 'Egrave', 'Iacute',
      'Icircumflex', 'Idieresis', 'Igrave', 'Oacute', 'Ocircumflex', 'apple', 'Ograve', 'Uacute', 'Ucircumflex',
      'Ugrave', 'dotlessi', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'ring', 'cedilla', 'hungarumlaut',
      'ogonek', 'caron', 'Lslash', 'lslash', 'Scaron', 'scaron', 'Zcaron', 'zcaron', 'brokenbar', 'Eth', 'eth',
      'Yacute', 'yacute', 'Thorn', 'thorn', 'minus', 'multiply', 'onesuperior', 'twosuperior', 'threesuperior',
      'onehalf', 'onequarter', 'threequarters', 'franc', 'Gbreve', 'gbreve', 'Idotaccent', 'Scedilla', 'scedilla',
      'Cacute', 'cacute', 'Ccaron', 'ccaron', 'dcroat'];

  /**
   * This is the encoding used for fonts created from scratch.
   * It loops through all glyphs and finds the appropriate unicode value.
   * Since it's linear time, other encodings will be faster.
   * @exports opentype.DefaultEncoding
   * @class
   * @constructor
   * @param {opentype.Font}
   */
  function DefaultEncoding(font) {
      this.font = font;
  }

  DefaultEncoding.prototype.charToGlyphIndex = function(c) {
      var code = c.codePointAt(0);
      var glyphs = this.font.glyphs;
      if (glyphs) {
          for (var i = 0; i < glyphs.length; i += 1) {
              var glyph = glyphs.get(i);
              for (var j = 0; j < glyph.unicodes.length; j += 1) {
                  if (glyph.unicodes[j] === code) {
                      return i;
                  }
              }
          }
      }
      return null;
  };

  /**
   * @exports opentype.CmapEncoding
   * @class
   * @constructor
   * @param {Object} cmap - a object with the cmap encoded data
   */
  function CmapEncoding(cmap) {
      this.cmap = cmap;
  }

  /**
   * @param  {string} c - the character
   * @return {number} The glyph index.
   */
  CmapEncoding.prototype.charToGlyphIndex = function(c) {
      return this.cmap.glyphIndexMap[c.codePointAt(0)] || 0;
  };

  /**
   * @exports opentype.CffEncoding
   * @class
   * @constructor
   * @param {string} encoding - The encoding
   * @param {Array} charset - The character set.
   */
  function CffEncoding(encoding, charset) {
      this.encoding = encoding;
      this.charset = charset;
  }

  /**
   * @param  {string} s - The character
   * @return {number} The index.
   */
  CffEncoding.prototype.charToGlyphIndex = function(s) {
      var code = s.codePointAt(0);
      var charName = this.encoding[code];
      return this.charset.indexOf(charName);
  };

  /**
   * @exports opentype.GlyphNames
   * @class
   * @constructor
   * @param {Object} post
   */
  function GlyphNames(post) {
      switch (post.version) {
          case 1:
              this.names = standardNames.slice();
              break;
          case 2:
              this.names = new Array(post.numberOfGlyphs);
              for (var i = 0; i < post.numberOfGlyphs; i++) {
                  if (post.glyphNameIndex[i] < standardNames.length) {
                      this.names[i] = standardNames[post.glyphNameIndex[i]];
                  } else {
                      this.names[i] = post.names[post.glyphNameIndex[i] - standardNames.length];
                  }
              }

              break;
          case 2.5:
              this.names = new Array(post.numberOfGlyphs);
              for (var i$1 = 0; i$1 < post.numberOfGlyphs; i$1++) {
                  this.names[i$1] = standardNames[i$1 + post.glyphNameIndex[i$1]];
              }

              break;
          case 3:
              this.names = [];
              break;
          default:
              this.names = [];
              break;
      }
  }

  /**
   * Gets the index of a glyph by name.
   * @param  {string} name - The glyph name
   * @return {number} The index
   */
  GlyphNames.prototype.nameToGlyphIndex = function(name) {
      return this.names.indexOf(name);
  };

  /**
   * @param  {number} gid
   * @return {string}
   */
  GlyphNames.prototype.glyphIndexToName = function(gid) {
      return this.names[gid];
  };

  function addGlyphNamesAll(font) {
      var glyph;
      var glyphIndexMap = font.tables.cmap.glyphIndexMap;
      var charCodes = Object.keys(glyphIndexMap);

      for (var i = 0; i < charCodes.length; i += 1) {
          var c = charCodes[i];
          var glyphIndex = glyphIndexMap[c];
          glyph = font.glyphs.get(glyphIndex);
          glyph.addUnicode(parseInt(c));
      }

      for (var i$1 = 0; i$1 < font.glyphs.length; i$1 += 1) {
          glyph = font.glyphs.get(i$1);
          if (font.cffEncoding) {
              if (font.isCIDFont) {
                  glyph.name = 'gid' + i$1;
              } else {
                  glyph.name = font.cffEncoding.charset[i$1];
              }
          } else if (font.glyphNames.names) {
              glyph.name = font.glyphNames.glyphIndexToName(i$1);
          }
      }
  }

  function addGlyphNamesToUnicodeMap(font) {
      font._IndexToUnicodeMap = {};

      var glyphIndexMap = font.tables.cmap.glyphIndexMap;
      var charCodes = Object.keys(glyphIndexMap);

      for (var i = 0; i < charCodes.length; i += 1) {
          var c = charCodes[i];
          var glyphIndex = glyphIndexMap[c];
          if (font._IndexToUnicodeMap[glyphIndex] === undefined) {
              font._IndexToUnicodeMap[glyphIndex] = {
                  unicodes: [parseInt(c)]
              };
          } else {
              font._IndexToUnicodeMap[glyphIndex].unicodes.push(parseInt(c));
          }
      }
  }

  /**
   * @alias opentype.addGlyphNames
   * @param {opentype.Font}
   * @param {Object}
   */
  function addGlyphNames(font, opt) {
      if (opt.lowMemory) {
          addGlyphNamesToUnicodeMap(font);
      } else {
          addGlyphNamesAll(font);
      }
  }

  // Drawing utility functions.

  // Draw a line on the given context from point `x1,y1` to point `x2,y2`.
  function line(ctx, x1, y1, x2, y2) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
  }

  var draw = { line: line };

  // The Glyph object
  // import glyf from './tables/glyf' Can't be imported here, because it's a circular dependency

  function getPathDefinition(glyph, path) {
      var _path = path || new Path();
      return {
          configurable: true,

          get: function() {
              if (typeof _path === 'function') {
                  _path = _path();
              }

              return _path;
          },

          set: function(p) {
              _path = p;
          }
      };
  }
  /**
   * @typedef GlyphOptions
   * @type Object
   * @property {string} [name] - The glyph name
   * @property {number} [unicode]
   * @property {Array} [unicodes]
   * @property {number} [xMin]
   * @property {number} [yMin]
   * @property {number} [xMax]
   * @property {number} [yMax]
   * @property {number} [advanceWidth]
   */

  // A Glyph is an individual mark that often corresponds to a character.
  // Some glyphs, such as ligatures, are a combination of many characters.
  // Glyphs are the basic building blocks of a font.
  //
  // The `Glyph` class contains utility methods for drawing the path and its points.
  /**
   * @exports opentype.Glyph
   * @class
   * @param {GlyphOptions}
   * @constructor
   */
  function Glyph(options) {
      // By putting all the code on a prototype function (which is only declared once)
      // we reduce the memory requirements for larger fonts by some 2%
      this.bindConstructorValues(options);
  }

  /**
   * @param  {GlyphOptions}
   */
  Glyph.prototype.bindConstructorValues = function(options) {
      this.index = options.index || 0;

      // These three values cannot be deferred for memory optimization:
      this.name = options.name || null;
      this.unicode = options.unicode || undefined;
      this.unicodes = options.unicodes || options.unicode !== undefined ? [options.unicode] : [];

      // But by binding these values only when necessary, we reduce can
      // the memory requirements by almost 3% for larger fonts.
      if ('xMin' in options) {
          this.xMin = options.xMin;
      }

      if ('yMin' in options) {
          this.yMin = options.yMin;
      }

      if ('xMax' in options) {
          this.xMax = options.xMax;
      }

      if ('yMax' in options) {
          this.yMax = options.yMax;
      }

      if ('advanceWidth' in options) {
          this.advanceWidth = options.advanceWidth;
      }

      // The path for a glyph is the most memory intensive, and is bound as a value
      // with a getter/setter to ensure we actually do path parsing only once the
      // path is actually needed by anything.
      Object.defineProperty(this, 'path', getPathDefinition(this, options.path));
  };

  /**
   * @param {number}
   */
  Glyph.prototype.addUnicode = function(unicode) {
      if (this.unicodes.length === 0) {
          this.unicode = unicode;
      }

      this.unicodes.push(unicode);
  };

  /**
   * Calculate the minimum bounding box for this glyph.
   * @return {opentype.BoundingBox}
   */
  Glyph.prototype.getBoundingBox = function() {
      return this.path.getBoundingBox();
  };

  /**
   * Convert the glyph to a Path we can draw on a drawing context.
   * @param  {number} [x=0] - Horizontal position of the beginning of the text.
   * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
   * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
   * @param  {Object=} options - xScale, yScale to stretch the glyph.
   * @param  {opentype.Font} if hinting is to be used, the font
   * @return {opentype.Path}
   */
  Glyph.prototype.getPath = function(x, y, fontSize, options, font) {
      x = x !== undefined ? x : 0;
      y = y !== undefined ? y : 0;
      fontSize = fontSize !== undefined ? fontSize : 72;
      var commands;
      var hPoints;
      if (!options) { options = { }; }
      var xScale = options.xScale;
      var yScale = options.yScale;

      if (options.hinting && font && font.hinting) {
          // in case of hinting, the hinting engine takes care
          // of scaling the points (not the path) before hinting.
          hPoints = this.path && font.hinting.exec(this, fontSize);
          // in case the hinting engine failed hPoints is undefined
          // and thus reverts to plain rending
      }

      if (hPoints) {
          // Call font.hinting.getCommands instead of `glyf.getPath(hPoints).commands` to avoid a circular dependency
          commands = font.hinting.getCommands(hPoints);
          x = Math.round(x);
          y = Math.round(y);
          // TODO in case of hinting xyScaling is not yet supported
          xScale = yScale = 1;
      } else {
          commands = this.path.commands;
          var scale = 1 / (this.path.unitsPerEm || 1000) * fontSize;
          if (xScale === undefined) { xScale = scale; }
          if (yScale === undefined) { yScale = scale; }
      }

      var p = new Path();
      for (var i = 0; i < commands.length; i += 1) {
          var cmd = commands[i];
          if (cmd.type === 'M') {
              p.moveTo(x + (cmd.x * xScale), y + (-cmd.y * yScale));
          } else if (cmd.type === 'L') {
              p.lineTo(x + (cmd.x * xScale), y + (-cmd.y * yScale));
          } else if (cmd.type === 'Q') {
              p.quadraticCurveTo(x + (cmd.x1 * xScale), y + (-cmd.y1 * yScale),
                                 x + (cmd.x * xScale), y + (-cmd.y * yScale));
          } else if (cmd.type === 'C') {
              p.curveTo(x + (cmd.x1 * xScale), y + (-cmd.y1 * yScale),
                        x + (cmd.x2 * xScale), y + (-cmd.y2 * yScale),
                        x + (cmd.x * xScale), y + (-cmd.y * yScale));
          } else if (cmd.type === 'Z') {
              p.closePath();
          }
      }

      return p;
  };

  /**
   * Split the glyph into contours.
   * This function is here for backwards compatibility, and to
   * provide raw access to the TrueType glyph outlines.
   * @return {Array}
   */
  Glyph.prototype.getContours = function() {
      if (this.points === undefined) {
          return [];
      }

      var contours = [];
      var currentContour = [];
      for (var i = 0; i < this.points.length; i += 1) {
          var pt = this.points[i];
          currentContour.push(pt);
          if (pt.lastPointOfContour) {
              contours.push(currentContour);
              currentContour = [];
          }
      }

      check.argument(currentContour.length === 0, 'There are still points left in the current contour.');
      return contours;
  };

  /**
   * Calculate the xMin/yMin/xMax/yMax/lsb/rsb for a Glyph.
   * @return {Object}
   */
  Glyph.prototype.getMetrics = function() {
      var commands = this.path.commands;
      var xCoords = [];
      var yCoords = [];
      for (var i = 0; i < commands.length; i += 1) {
          var cmd = commands[i];
          if (cmd.type !== 'Z') {
              xCoords.push(cmd.x);
              yCoords.push(cmd.y);
          }

          if (cmd.type === 'Q' || cmd.type === 'C') {
              xCoords.push(cmd.x1);
              yCoords.push(cmd.y1);
          }

          if (cmd.type === 'C') {
              xCoords.push(cmd.x2);
              yCoords.push(cmd.y2);
          }
      }

      var metrics = {
          xMin: Math.min.apply(null, xCoords),
          yMin: Math.min.apply(null, yCoords),
          xMax: Math.max.apply(null, xCoords),
          yMax: Math.max.apply(null, yCoords),
          leftSideBearing: this.leftSideBearing
      };

      if (!isFinite(metrics.xMin)) {
          metrics.xMin = 0;
      }

      if (!isFinite(metrics.xMax)) {
          metrics.xMax = this.advanceWidth;
      }

      if (!isFinite(metrics.yMin)) {
          metrics.yMin = 0;
      }

      if (!isFinite(metrics.yMax)) {
          metrics.yMax = 0;
      }

      metrics.rightSideBearing = this.advanceWidth - metrics.leftSideBearing - (metrics.xMax - metrics.xMin);
      return metrics;
  };

  /**
   * Draw the glyph on the given context.
   * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
   * @param  {number} [x=0] - Horizontal position of the beginning of the text.
   * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
   * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
   * @param  {Object=} options - xScale, yScale to stretch the glyph.
   */
  Glyph.prototype.draw = function(ctx, x, y, fontSize, options) {
      this.getPath(x, y, fontSize, options).draw(ctx);
  };

  /**
   * Draw the points of the glyph.
   * On-curve points will be drawn in blue, off-curve points will be drawn in red.
   * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
   * @param  {number} [x=0] - Horizontal position of the beginning of the text.
   * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
   * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
   */
  Glyph.prototype.drawPoints = function(ctx, x, y, fontSize) {
      function drawCircles(l, x, y, scale) {
          ctx.beginPath();
          for (var j = 0; j < l.length; j += 1) {
              ctx.moveTo(x + (l[j].x * scale), y + (l[j].y * scale));
              ctx.arc(x + (l[j].x * scale), y + (l[j].y * scale), 2, 0, Math.PI * 2, false);
          }

          ctx.closePath();
          ctx.fill();
      }

      x = x !== undefined ? x : 0;
      y = y !== undefined ? y : 0;
      fontSize = fontSize !== undefined ? fontSize : 24;
      var scale = 1 / this.path.unitsPerEm * fontSize;

      var blueCircles = [];
      var redCircles = [];
      var path = this.path;
      for (var i = 0; i < path.commands.length; i += 1) {
          var cmd = path.commands[i];
          if (cmd.x !== undefined) {
              blueCircles.push({x: cmd.x, y: -cmd.y});
          }

          if (cmd.x1 !== undefined) {
              redCircles.push({x: cmd.x1, y: -cmd.y1});
          }

          if (cmd.x2 !== undefined) {
              redCircles.push({x: cmd.x2, y: -cmd.y2});
          }
      }

      ctx.fillStyle = 'blue';
      drawCircles(blueCircles, x, y, scale);
      ctx.fillStyle = 'red';
      drawCircles(redCircles, x, y, scale);
  };

  /**
   * Draw lines indicating important font measurements.
   * Black lines indicate the origin of the coordinate system (point 0,0).
   * Blue lines indicate the glyph bounding box.
   * Green line indicates the advance width of the glyph.
   * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
   * @param  {number} [x=0] - Horizontal position of the beginning of the text.
   * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
   * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
   */
  Glyph.prototype.drawMetrics = function(ctx, x, y, fontSize) {
      var scale;
      x = x !== undefined ? x : 0;
      y = y !== undefined ? y : 0;
      fontSize = fontSize !== undefined ? fontSize : 24;
      scale = 1 / this.path.unitsPerEm * fontSize;
      ctx.lineWidth = 1;

      // Draw the origin
      ctx.strokeStyle = 'black';
      draw.line(ctx, x, -10000, x, 10000);
      draw.line(ctx, -10000, y, 10000, y);

      // This code is here due to memory optimization: by not using
      // defaults in the constructor, we save a notable amount of memory.
      var xMin = this.xMin || 0;
      var yMin = this.yMin || 0;
      var xMax = this.xMax || 0;
      var yMax = this.yMax || 0;
      var advanceWidth = this.advanceWidth || 0;

      // Draw the glyph box
      ctx.strokeStyle = 'blue';
      draw.line(ctx, x + (xMin * scale), -10000, x + (xMin * scale), 10000);
      draw.line(ctx, x + (xMax * scale), -10000, x + (xMax * scale), 10000);
      draw.line(ctx, -10000, y + (-yMin * scale), 10000, y + (-yMin * scale));
      draw.line(ctx, -10000, y + (-yMax * scale), 10000, y + (-yMax * scale));

      // Draw the advance width
      ctx.strokeStyle = 'green';
      draw.line(ctx, x + (advanceWidth * scale), -10000, x + (advanceWidth * scale), 10000);
  };

  // The GlyphSet object

  // Define a property on the glyph that depends on the path being loaded.
  function defineDependentProperty(glyph, externalName, internalName) {
      Object.defineProperty(glyph, externalName, {
          get: function() {
              // Request the path property to make sure the path is loaded.
              glyph.path; // jshint ignore:line
              return glyph[internalName];
          },
          set: function(newValue) {
              glyph[internalName] = newValue;
          },
          enumerable: true,
          configurable: true
      });
  }

  /**
   * A GlyphSet represents all glyphs available in the font, but modelled using
   * a deferred glyph loader, for retrieving glyphs only once they are absolutely
   * necessary, to keep the memory footprint down.
   * @exports opentype.GlyphSet
   * @class
   * @param {opentype.Font}
   * @param {Array}
   */
  function GlyphSet(font, glyphs) {
      this.font = font;
      this.glyphs = {};
      if (Array.isArray(glyphs)) {
          for (var i = 0; i < glyphs.length; i++) {
              var glyph = glyphs[i];
              glyph.path.unitsPerEm = font.unitsPerEm;
              this.glyphs[i] = glyph;
          }
      }

      this.length = (glyphs && glyphs.length) || 0;
  }

  /**
   * @param  {number} index
   * @return {opentype.Glyph}
   */
  GlyphSet.prototype.get = function(index) {
      // this.glyphs[index] is 'undefined' when low memory mode is on. glyph is pushed on request only.
      if (this.glyphs[index] === undefined) {
          this.font._push(index);
          if (typeof this.glyphs[index] === 'function') {
              this.glyphs[index] = this.glyphs[index]();
          }

          var glyph = this.glyphs[index];
          var unicodeObj = this.font._IndexToUnicodeMap[index];

          if (unicodeObj) {
              for (var j = 0; j < unicodeObj.unicodes.length; j++)
                  { glyph.addUnicode(unicodeObj.unicodes[j]); }
          }

          if (this.font.cffEncoding) {
              if (this.font.isCIDFont) {
                  glyph.name = 'gid' + index;
              } else {
                  glyph.name = this.font.cffEncoding.charset[index];
              }
          } else if (this.font.glyphNames.names) {
              glyph.name = this.font.glyphNames.glyphIndexToName(index);
          }

          this.glyphs[index].advanceWidth = this.font._hmtxTableData[index].advanceWidth;
          this.glyphs[index].leftSideBearing = this.font._hmtxTableData[index].leftSideBearing;
      } else {
          if (typeof this.glyphs[index] === 'function') {
              this.glyphs[index] = this.glyphs[index]();
          }
      }

      return this.glyphs[index];
  };

  /**
   * @param  {number} index
   * @param  {Object}
   */
  GlyphSet.prototype.push = function(index, loader) {
      this.glyphs[index] = loader;
      this.length++;
  };

  /**
   * @alias opentype.glyphLoader
   * @param  {opentype.Font} font
   * @param  {number} index
   * @return {opentype.Glyph}
   */
  function glyphLoader(font, index) {
      return new Glyph({index: index, font: font});
  }

  /**
   * Generate a stub glyph that can be filled with all metadata *except*
   * the "points" and "path" properties, which must be loaded only once
   * the glyph's path is actually requested for text shaping.
   * @alias opentype.ttfGlyphLoader
   * @param  {opentype.Font} font
   * @param  {number} index
   * @param  {Function} parseGlyph
   * @param  {Object} data
   * @param  {number} position
   * @param  {Function} buildPath
   * @return {opentype.Glyph}
   */
  function ttfGlyphLoader(font, index, parseGlyph, data, position, buildPath) {
      return function() {
          var glyph = new Glyph({index: index, font: font});

          glyph.path = function() {
              parseGlyph(glyph, data, position);
              var path = buildPath(font.glyphs, glyph);
              path.unitsPerEm = font.unitsPerEm;
              return path;
          };

          defineDependentProperty(glyph, 'xMin', '_xMin');
          defineDependentProperty(glyph, 'xMax', '_xMax');
          defineDependentProperty(glyph, 'yMin', '_yMin');
          defineDependentProperty(glyph, 'yMax', '_yMax');

          return glyph;
      };
  }
  /**
   * @alias opentype.cffGlyphLoader
   * @param  {opentype.Font} font
   * @param  {number} index
   * @param  {Function} parseCFFCharstring
   * @param  {string} charstring
   * @return {opentype.Glyph}
   */
  function cffGlyphLoader(font, index, parseCFFCharstring, charstring) {
      return function() {
          var glyph = new Glyph({index: index, font: font});

          glyph.path = function() {
              var path = parseCFFCharstring(font, glyph, charstring);
              path.unitsPerEm = font.unitsPerEm;
              return path;
          };

          return glyph;
      };
  }

  var glyphset = { GlyphSet: GlyphSet, glyphLoader: glyphLoader, ttfGlyphLoader: ttfGlyphLoader, cffGlyphLoader: cffGlyphLoader };

  // The `CFF` table contains the glyph outlines in PostScript format.

  // Custom equals function that can also check lists.
  function equals(a, b) {
      if (a === b) {
          return true;
      } else if (Array.isArray(a) && Array.isArray(b)) {
          if (a.length !== b.length) {
              return false;
          }

          for (var i = 0; i < a.length; i += 1) {
              if (!equals(a[i], b[i])) {
                  return false;
              }
          }

          return true;
      } else {
          return false;
      }
  }

  // Subroutines are encoded using the negative half of the number space.
  // See type 2 chapter 4.7 "Subroutine operators".
  function calcCFFSubroutineBias(subrs) {
      var bias;
      if (subrs.length < 1240) {
          bias = 107;
      } else if (subrs.length < 33900) {
          bias = 1131;
      } else {
          bias = 32768;
      }

      return bias;
  }

  // Parse a `CFF` INDEX array.
  // An index array consists of a list of offsets, then a list of objects at those offsets.
  function parseCFFIndex(data, start, conversionFn) {
      var offsets = [];
      var objects = [];
      var count = parse.getCard16(data, start);
      var objectOffset;
      var endOffset;
      if (count !== 0) {
          var offsetSize = parse.getByte(data, start + 2);
          objectOffset = start + ((count + 1) * offsetSize) + 2;
          var pos = start + 3;
          for (var i = 0; i < count + 1; i += 1) {
              offsets.push(parse.getOffset(data, pos, offsetSize));
              pos += offsetSize;
          }

          // The total size of the index array is 4 header bytes + the value of the last offset.
          endOffset = objectOffset + offsets[count];
      } else {
          endOffset = start + 2;
      }

      for (var i$1 = 0; i$1 < offsets.length - 1; i$1 += 1) {
          var value = parse.getBytes(data, objectOffset + offsets[i$1], objectOffset + offsets[i$1 + 1]);
          if (conversionFn) {
              value = conversionFn(value);
          }

          objects.push(value);
      }

      return {objects: objects, startOffset: start, endOffset: endOffset};
  }

  function parseCFFIndexLowMemory(data, start) {
      var offsets = [];
      var count = parse.getCard16(data, start);
      var objectOffset;
      var endOffset;
      if (count !== 0) {
          var offsetSize = parse.getByte(data, start + 2);
          objectOffset = start + ((count + 1) * offsetSize) + 2;
          var pos = start + 3;
          for (var i = 0; i < count + 1; i += 1) {
              offsets.push(parse.getOffset(data, pos, offsetSize));
              pos += offsetSize;
          }

          // The total size of the index array is 4 header bytes + the value of the last offset.
          endOffset = objectOffset + offsets[count];
      } else {
          endOffset = start + 2;
      }

      return {offsets: offsets, startOffset: start, endOffset: endOffset};
  }
  function getCffIndexObject(i, offsets, data, start, conversionFn) {
      var count = parse.getCard16(data, start);
      var objectOffset = 0;
      if (count !== 0) {
          var offsetSize = parse.getByte(data, start + 2);
          objectOffset = start + ((count + 1) * offsetSize) + 2;
      }

      var value = parse.getBytes(data, objectOffset + offsets[i], objectOffset + offsets[i + 1]);
      if (conversionFn) {
          value = conversionFn(value);
      }
      return value;
  }

  // Parse a `CFF` DICT real value.
  function parseFloatOperand(parser) {
      var s = '';
      var eof = 15;
      var lookup = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'E', 'E-', null, '-'];
      while (true) {
          var b = parser.parseByte();
          var n1 = b >> 4;
          var n2 = b & 15;

          if (n1 === eof) {
              break;
          }

          s += lookup[n1];

          if (n2 === eof) {
              break;
          }

          s += lookup[n2];
      }

      return parseFloat(s);
  }

  // Parse a `CFF` DICT operand.
  function parseOperand(parser, b0) {
      var b1;
      var b2;
      var b3;
      var b4;
      if (b0 === 28) {
          b1 = parser.parseByte();
          b2 = parser.parseByte();
          return b1 << 8 | b2;
      }

      if (b0 === 29) {
          b1 = parser.parseByte();
          b2 = parser.parseByte();
          b3 = parser.parseByte();
          b4 = parser.parseByte();
          return b1 << 24 | b2 << 16 | b3 << 8 | b4;
      }

      if (b0 === 30) {
          return parseFloatOperand(parser);
      }

      if (b0 >= 32 && b0 <= 246) {
          return b0 - 139;
      }

      if (b0 >= 247 && b0 <= 250) {
          b1 = parser.parseByte();
          return (b0 - 247) * 256 + b1 + 108;
      }

      if (b0 >= 251 && b0 <= 254) {
          b1 = parser.parseByte();
          return -(b0 - 251) * 256 - b1 - 108;
      }

      throw new Error('Invalid b0 ' + b0);
  }

  // Convert the entries returned by `parseDict` to a proper dictionary.
  // If a value is a list of one, it is unpacked.
  function entriesToObject(entries) {
      var o = {};
      for (var i = 0; i < entries.length; i += 1) {
          var key = entries[i][0];
          var values = entries[i][1];
          var value = (void 0);
          if (values.length === 1) {
              value = values[0];
          } else {
              value = values;
          }

          if (o.hasOwnProperty(key) && !isNaN(o[key])) {
              throw new Error('Object ' + o + ' already has key ' + key);
          }

          o[key] = value;
      }

      return o;
  }

  // Parse a `CFF` DICT object.
  // A dictionary contains key-value pairs in a compact tokenized format.
  function parseCFFDict(data, start, size) {
      start = start !== undefined ? start : 0;
      var parser = new parse.Parser(data, start);
      var entries = [];
      var operands = [];
      size = size !== undefined ? size : data.length;

      while (parser.relativeOffset < size) {
          var op = parser.parseByte();

          // The first byte for each dict item distinguishes between operator (key) and operand (value).
          // Values <= 21 are operators.
          if (op <= 21) {
              // Two-byte operators have an initial escape byte of 12.
              if (op === 12) {
                  op = 1200 + parser.parseByte();
              }

              entries.push([op, operands]);
              operands = [];
          } else {
              // Since the operands (values) come before the operators (keys), we store all operands in a list
              // until we encounter an operator.
              operands.push(parseOperand(parser, op));
          }
      }

      return entriesToObject(entries);
  }

  // Given a String Index (SID), return the value of the string.
  // Strings below index 392 are standard CFF strings and are not encoded in the font.
  function getCFFString(strings, index) {
      if (index <= 390) {
          index = cffStandardStrings[index];
      } else {
          index = strings[index - 391];
      }

      return index;
  }

  // Interpret a dictionary and return a new dictionary with readable keys and values for missing entries.
  // This function takes `meta` which is a list of objects containing `operand`, `name` and `default`.
  function interpretDict(dict, meta, strings) {
      var newDict = {};
      var value;

      // Because we also want to include missing values, we start out from the meta list
      // and lookup values in the dict.
      for (var i = 0; i < meta.length; i += 1) {
          var m = meta[i];

          if (Array.isArray(m.type)) {
              var values = [];
              values.length = m.type.length;
              for (var j = 0; j < m.type.length; j++) {
                  value = dict[m.op] !== undefined ? dict[m.op][j] : undefined;
                  if (value === undefined) {
                      value = m.value !== undefined && m.value[j] !== undefined ? m.value[j] : null;
                  }
                  if (m.type[j] === 'SID') {
                      value = getCFFString(strings, value);
                  }
                  values[j] = value;
              }
              newDict[m.name] = values;
          } else {
              value = dict[m.op];
              if (value === undefined) {
                  value = m.value !== undefined ? m.value : null;
              }

              if (m.type === 'SID') {
                  value = getCFFString(strings, value);
              }
              newDict[m.name] = value;
          }
      }

      return newDict;
  }

  // Parse the CFF header.
  function parseCFFHeader(data, start) {
      var header = {};
      header.formatMajor = parse.getCard8(data, start);
      header.formatMinor = parse.getCard8(data, start + 1);
      header.size = parse.getCard8(data, start + 2);
      header.offsetSize = parse.getCard8(data, start + 3);
      header.startOffset = start;
      header.endOffset = start + 4;
      return header;
  }

  var TOP_DICT_META = [
      {name: 'version', op: 0, type: 'SID'},
      {name: 'notice', op: 1, type: 'SID'},
      {name: 'copyright', op: 1200, type: 'SID'},
      {name: 'fullName', op: 2, type: 'SID'},
      {name: 'familyName', op: 3, type: 'SID'},
      {name: 'weight', op: 4, type: 'SID'},
      {name: 'isFixedPitch', op: 1201, type: 'number', value: 0},
      {name: 'italicAngle', op: 1202, type: 'number', value: 0},
      {name: 'underlinePosition', op: 1203, type: 'number', value: -100},
      {name: 'underlineThickness', op: 1204, type: 'number', value: 50},
      {name: 'paintType', op: 1205, type: 'number', value: 0},
      {name: 'charstringType', op: 1206, type: 'number', value: 2},
      {
          name: 'fontMatrix',
          op: 1207,
          type: ['real', 'real', 'real', 'real', 'real', 'real'],
          value: [0.001, 0, 0, 0.001, 0, 0]
      },
      {name: 'uniqueId', op: 13, type: 'number'},
      {name: 'fontBBox', op: 5, type: ['number', 'number', 'number', 'number'], value: [0, 0, 0, 0]},
      {name: 'strokeWidth', op: 1208, type: 'number', value: 0},
      {name: 'xuid', op: 14, type: [], value: null},
      {name: 'charset', op: 15, type: 'offset', value: 0},
      {name: 'encoding', op: 16, type: 'offset', value: 0},
      {name: 'charStrings', op: 17, type: 'offset', value: 0},
      {name: 'private', op: 18, type: ['number', 'offset'], value: [0, 0]},
      {name: 'ros', op: 1230, type: ['SID', 'SID', 'number']},
      {name: 'cidFontVersion', op: 1231, type: 'number', value: 0},
      {name: 'cidFontRevision', op: 1232, type: 'number', value: 0},
      {name: 'cidFontType', op: 1233, type: 'number', value: 0},
      {name: 'cidCount', op: 1234, type: 'number', value: 8720},
      {name: 'uidBase', op: 1235, type: 'number'},
      {name: 'fdArray', op: 1236, type: 'offset'},
      {name: 'fdSelect', op: 1237, type: 'offset'},
      {name: 'fontName', op: 1238, type: 'SID'}
  ];

  var PRIVATE_DICT_META = [
      {name: 'subrs', op: 19, type: 'offset', value: 0},
      {name: 'defaultWidthX', op: 20, type: 'number', value: 0},
      {name: 'nominalWidthX', op: 21, type: 'number', value: 0}
  ];

  // Parse the CFF top dictionary. A CFF table can contain multiple fonts, each with their own top dictionary.
  // The top dictionary contains the essential metadata for the font, together with the private dictionary.
  function parseCFFTopDict(data, strings) {
      var dict = parseCFFDict(data, 0, data.byteLength);
      return interpretDict(dict, TOP_DICT_META, strings);
  }

  // Parse the CFF private dictionary. We don't fully parse out all the values, only the ones we need.
  function parseCFFPrivateDict(data, start, size, strings) {
      var dict = parseCFFDict(data, start, size);
      return interpretDict(dict, PRIVATE_DICT_META, strings);
  }

  // Returns a list of "Top DICT"s found using an INDEX list.
  // Used to read both the usual high-level Top DICTs and also the FDArray
  // discovered inside CID-keyed fonts.  When a Top DICT has a reference to
  // a Private DICT that is read and saved into the Top DICT.
  //
  // In addition to the expected/optional values as outlined in TOP_DICT_META
  // the following values might be saved into the Top DICT.
  //
  //    _subrs []        array of local CFF subroutines from Private DICT
  //    _subrsBias       bias value computed from number of subroutines
  //                      (see calcCFFSubroutineBias() and parseCFFCharstring())
  //    _defaultWidthX   default widths for CFF characters
  //    _nominalWidthX   bias added to width embedded within glyph description
  //
  //    _privateDict     saved copy of parsed Private DICT from Top DICT
  function gatherCFFTopDicts(data, start, cffIndex, strings) {
      var topDictArray = [];
      for (var iTopDict = 0; iTopDict < cffIndex.length; iTopDict += 1) {
          var topDictData = new DataView(new Uint8Array(cffIndex[iTopDict]).buffer);
          var topDict = parseCFFTopDict(topDictData, strings);
          topDict._subrs = [];
          topDict._subrsBias = 0;
          topDict._defaultWidthX = 0;
          topDict._nominalWidthX = 0;
          var privateSize = topDict.private[0];
          var privateOffset = topDict.private[1];
          if (privateSize !== 0 && privateOffset !== 0) {
              var privateDict = parseCFFPrivateDict(data, privateOffset + start, privateSize, strings);
              topDict._defaultWidthX = privateDict.defaultWidthX;
              topDict._nominalWidthX = privateDict.nominalWidthX;
              if (privateDict.subrs !== 0) {
                  var subrOffset = privateOffset + privateDict.subrs;
                  var subrIndex = parseCFFIndex(data, subrOffset + start);
                  topDict._subrs = subrIndex.objects;
                  topDict._subrsBias = calcCFFSubroutineBias(topDict._subrs);
              }
              topDict._privateDict = privateDict;
          }
          topDictArray.push(topDict);
      }
      return topDictArray;
  }

  // Parse the CFF charset table, which contains internal names for all the glyphs.
  // This function will return a list of glyph names.
  // See Adobe TN #5176 chapter 13, "Charsets".
  function parseCFFCharset(data, start, nGlyphs, strings) {
      var sid;
      var count;
      var parser = new parse.Parser(data, start);

      // The .notdef glyph is not included, so subtract 1.
      nGlyphs -= 1;
      var charset = ['.notdef'];

      var format = parser.parseCard8();
      if (format === 0) {
          for (var i = 0; i < nGlyphs; i += 1) {
              sid = parser.parseSID();
              charset.push(getCFFString(strings, sid));
          }
      } else if (format === 1) {
          while (charset.length <= nGlyphs) {
              sid = parser.parseSID();
              count = parser.parseCard8();
              for (var i$1 = 0; i$1 <= count; i$1 += 1) {
                  charset.push(getCFFString(strings, sid));
                  sid += 1;
              }
          }
      } else if (format === 2) {
          while (charset.length <= nGlyphs) {
              sid = parser.parseSID();
              count = parser.parseCard16();
              for (var i$2 = 0; i$2 <= count; i$2 += 1) {
                  charset.push(getCFFString(strings, sid));
                  sid += 1;
              }
          }
      } else {
          throw new Error('Unknown charset format ' + format);
      }

      return charset;
  }

  // Parse the CFF encoding data. Only one encoding can be specified per font.
  // See Adobe TN #5176 chapter 12, "Encodings".
  function parseCFFEncoding(data, start, charset) {
      var code;
      var enc = {};
      var parser = new parse.Parser(data, start);
      var format = parser.parseCard8();
      if (format === 0) {
          var nCodes = parser.parseCard8();
          for (var i = 0; i < nCodes; i += 1) {
              code = parser.parseCard8();
              enc[code] = i;
          }
      } else if (format === 1) {
          var nRanges = parser.parseCard8();
          code = 1;
          for (var i$1 = 0; i$1 < nRanges; i$1 += 1) {
              var first = parser.parseCard8();
              var nLeft = parser.parseCard8();
              for (var j = first; j <= first + nLeft; j += 1) {
                  enc[j] = code;
                  code += 1;
              }
          }
      } else {
          throw new Error('Unknown encoding format ' + format);
      }

      return new CffEncoding(enc, charset);
  }

  // Take in charstring code and return a Glyph object.
  // The encoding is described in the Type 2 Charstring Format
  // https://www.microsoft.com/typography/OTSPEC/charstr2.htm
  function parseCFFCharstring(font, glyph, code) {
      var c1x;
      var c1y;
      var c2x;
      var c2y;
      var p = new Path();
      var stack = [];
      var nStems = 0;
      var haveWidth = false;
      var open = false;
      var x = 0;
      var y = 0;
      var subrs;
      var subrsBias;
      var defaultWidthX;
      var nominalWidthX;
      if (font.isCIDFont) {
          var fdIndex = font.tables.cff.topDict._fdSelect[glyph.index];
          var fdDict = font.tables.cff.topDict._fdArray[fdIndex];
          subrs = fdDict._subrs;
          subrsBias = fdDict._subrsBias;
          defaultWidthX = fdDict._defaultWidthX;
          nominalWidthX = fdDict._nominalWidthX;
      } else {
          subrs = font.tables.cff.topDict._subrs;
          subrsBias = font.tables.cff.topDict._subrsBias;
          defaultWidthX = font.tables.cff.topDict._defaultWidthX;
          nominalWidthX = font.tables.cff.topDict._nominalWidthX;
      }
      var width = defaultWidthX;

      function newContour(x, y) {
          if (open) {
              p.closePath();
          }

          p.moveTo(x, y);
          open = true;
      }

      function parseStems() {
          var hasWidthArg;

          // The number of stem operators on the stack is always even.
          // If the value is uneven, that means a width is specified.
          hasWidthArg = stack.length % 2 !== 0;
          if (hasWidthArg && !haveWidth) {
              width = stack.shift() + nominalWidthX;
          }

          nStems += stack.length >> 1;
          stack.length = 0;
          haveWidth = true;
      }

      function parse(code) {
          var b1;
          var b2;
          var b3;
          var b4;
          var codeIndex;
          var subrCode;
          var jpx;
          var jpy;
          var c3x;
          var c3y;
          var c4x;
          var c4y;

          var i = 0;
          while (i < code.length) {
              var v = code[i];
              i += 1;
              switch (v) {
                  case 1: // hstem
                      parseStems();
                      break;
                  case 3: // vstem
                      parseStems();
                      break;
                  case 4: // vmoveto
                      if (stack.length > 1 && !haveWidth) {
                          width = stack.shift() + nominalWidthX;
                          haveWidth = true;
                      }

                      y += stack.pop();
                      newContour(x, y);
                      break;
                  case 5: // rlineto
                      while (stack.length > 0) {
                          x += stack.shift();
                          y += stack.shift();
                          p.lineTo(x, y);
                      }

                      break;
                  case 6: // hlineto
                      while (stack.length > 0) {
                          x += stack.shift();
                          p.lineTo(x, y);
                          if (stack.length === 0) {
                              break;
                          }

                          y += stack.shift();
                          p.lineTo(x, y);
                      }

                      break;
                  case 7: // vlineto
                      while (stack.length > 0) {
                          y += stack.shift();
                          p.lineTo(x, y);
                          if (stack.length === 0) {
                              break;
                          }

                          x += stack.shift();
                          p.lineTo(x, y);
                      }

                      break;
                  case 8: // rrcurveto
                      while (stack.length > 0) {
                          c1x = x + stack.shift();
                          c1y = y + stack.shift();
                          c2x = c1x + stack.shift();
                          c2y = c1y + stack.shift();
                          x = c2x + stack.shift();
                          y = c2y + stack.shift();
                          p.curveTo(c1x, c1y, c2x, c2y, x, y);
                      }

                      break;
                  case 10: // callsubr
                      codeIndex = stack.pop() + subrsBias;
                      subrCode = subrs[codeIndex];
                      if (subrCode) {
                          parse(subrCode);
                      }

                      break;
                  case 11: // return
                      return;
                  case 12: // flex operators
                      v = code[i];
                      i += 1;
                      switch (v) {
                          case 35: // flex
                              // |- dx1 dy1 dx2 dy2 dx3 dy3 dx4 dy4 dx5 dy5 dx6 dy6 fd flex (12 35) |-
                              c1x = x   + stack.shift();    // dx1
                              c1y = y   + stack.shift();    // dy1
                              c2x = c1x + stack.shift();    // dx2
                              c2y = c1y + stack.shift();    // dy2
                              jpx = c2x + stack.shift();    // dx3
                              jpy = c2y + stack.shift();    // dy3
                              c3x = jpx + stack.shift();    // dx4
                              c3y = jpy + stack.shift();    // dy4
                              c4x = c3x + stack.shift();    // dx5
                              c4y = c3y + stack.shift();    // dy5
                              x = c4x   + stack.shift();    // dx6
                              y = c4y   + stack.shift();    // dy6
                              stack.shift();                // flex depth
                              p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                              p.curveTo(c3x, c3y, c4x, c4y, x, y);
                              break;
                          case 34: // hflex
                              // |- dx1 dx2 dy2 dx3 dx4 dx5 dx6 hflex (12 34) |-
                              c1x = x   + stack.shift();    // dx1
                              c1y = y;                      // dy1
                              c2x = c1x + stack.shift();    // dx2
                              c2y = c1y + stack.shift();    // dy2
                              jpx = c2x + stack.shift();    // dx3
                              jpy = c2y;                    // dy3
                              c3x = jpx + stack.shift();    // dx4
                              c3y = c2y;                    // dy4
                              c4x = c3x + stack.shift();    // dx5
                              c4y = y;                      // dy5
                              x = c4x + stack.shift();      // dx6
                              p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                              p.curveTo(c3x, c3y, c4x, c4y, x, y);
                              break;
                          case 36: // hflex1
                              // |- dx1 dy1 dx2 dy2 dx3 dx4 dx5 dy5 dx6 hflex1 (12 36) |-
                              c1x = x   + stack.shift();    // dx1
                              c1y = y   + stack.shift();    // dy1
                              c2x = c1x + stack.shift();    // dx2
                              c2y = c1y + stack.shift();    // dy2
                              jpx = c2x + stack.shift();    // dx3
                              jpy = c2y;                    // dy3
                              c3x = jpx + stack.shift();    // dx4
                              c3y = c2y;                    // dy4
                              c4x = c3x + stack.shift();    // dx5
                              c4y = c3y + stack.shift();    // dy5
                              x = c4x + stack.shift();      // dx6
                              p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                              p.curveTo(c3x, c3y, c4x, c4y, x, y);
                              break;
                          case 37: // flex1
                              // |- dx1 dy1 dx2 dy2 dx3 dy3 dx4 dy4 dx5 dy5 d6 flex1 (12 37) |-
                              c1x = x   + stack.shift();    // dx1
                              c1y = y   + stack.shift();    // dy1
                              c2x = c1x + stack.shift();    // dx2
                              c2y = c1y + stack.shift();    // dy2
                              jpx = c2x + stack.shift();    // dx3
                              jpy = c2y + stack.shift();    // dy3
                              c3x = jpx + stack.shift();    // dx4
                              c3y = jpy + stack.shift();    // dy4
                              c4x = c3x + stack.shift();    // dx5
                              c4y = c3y + stack.shift();    // dy5
                              if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
                                  x = c4x + stack.shift();
                              } else {
                                  y = c4y + stack.shift();
                              }

                              p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                              p.curveTo(c3x, c3y, c4x, c4y, x, y);
                              break;
                          default:
                              console.log('Glyph ' + glyph.index + ': unknown operator ' + 1200 + v);
                              stack.length = 0;
                      }
                      break;
                  case 14: // endchar
                      if (stack.length > 0 && !haveWidth) {
                          width = stack.shift() + nominalWidthX;
                          haveWidth = true;
                      }

                      if (open) {
                          p.closePath();
                          open = false;
                      }

                      break;
                  case 18: // hstemhm
                      parseStems();
                      break;
                  case 19: // hintmask
                  case 20: // cntrmask
                      parseStems();
                      i += (nStems + 7) >> 3;
                      break;
                  case 21: // rmoveto
                      if (stack.length > 2 && !haveWidth) {
                          width = stack.shift() + nominalWidthX;
                          haveWidth = true;
                      }

                      y += stack.pop();
                      x += stack.pop();
                      newContour(x, y);
                      break;
                  case 22: // hmoveto
                      if (stack.length > 1 && !haveWidth) {
                          width = stack.shift() + nominalWidthX;
                          haveWidth = true;
                      }

                      x += stack.pop();
                      newContour(x, y);
                      break;
                  case 23: // vstemhm
                      parseStems();
                      break;
                  case 24: // rcurveline
                      while (stack.length > 2) {
                          c1x = x + stack.shift();
                          c1y = y + stack.shift();
                          c2x = c1x + stack.shift();
                          c2y = c1y + stack.shift();
                          x = c2x + stack.shift();
                          y = c2y + stack.shift();
                          p.curveTo(c1x, c1y, c2x, c2y, x, y);
                      }

                      x += stack.shift();
                      y += stack.shift();
                      p.lineTo(x, y);
                      break;
                  case 25: // rlinecurve
                      while (stack.length > 6) {
                          x += stack.shift();
                          y += stack.shift();
                          p.lineTo(x, y);
                      }

                      c1x = x + stack.shift();
                      c1y = y + stack.shift();
                      c2x = c1x + stack.shift();
                      c2y = c1y + stack.shift();
                      x = c2x + stack.shift();
                      y = c2y + stack.shift();
                      p.curveTo(c1x, c1y, c2x, c2y, x, y);
                      break;
                  case 26: // vvcurveto
                      if (stack.length % 2) {
                          x += stack.shift();
                      }

                      while (stack.length > 0) {
                          c1x = x;
                          c1y = y + stack.shift();
                          c2x = c1x + stack.shift();
                          c2y = c1y + stack.shift();
                          x = c2x;
                          y = c2y + stack.shift();
                          p.curveTo(c1x, c1y, c2x, c2y, x, y);
                      }

                      break;
                  case 27: // hhcurveto
                      if (stack.length % 2) {
                          y += stack.shift();
                      }

                      while (stack.length > 0) {
                          c1x = x + stack.shift();
                          c1y = y;
                          c2x = c1x + stack.shift();
                          c2y = c1y + stack.shift();
                          x = c2x + stack.shift();
                          y = c2y;
                          p.curveTo(c1x, c1y, c2x, c2y, x, y);
                      }

                      break;
                  case 28: // shortint
                      b1 = code[i];
                      b2 = code[i + 1];
                      stack.push(((b1 << 24) | (b2 << 16)) >> 16);
                      i += 2;
                      break;
                  case 29: // callgsubr
                      codeIndex = stack.pop() + font.gsubrsBias;
                      subrCode = font.gsubrs[codeIndex];
                      if (subrCode) {
                          parse(subrCode);
                      }

                      break;
                  case 30: // vhcurveto
                      while (stack.length > 0) {
                          c1x = x;
                          c1y = y + stack.shift();
                          c2x = c1x + stack.shift();
                          c2y = c1y + stack.shift();
                          x = c2x + stack.shift();
                          y = c2y + (stack.length === 1 ? stack.shift() : 0);
                          p.curveTo(c1x, c1y, c2x, c2y, x, y);
                          if (stack.length === 0) {
                              break;
                          }

                          c1x = x + stack.shift();
                          c1y = y;
                          c2x = c1x + stack.shift();
                          c2y = c1y + stack.shift();
                          y = c2y + stack.shift();
                          x = c2x + (stack.length === 1 ? stack.shift() : 0);
                          p.curveTo(c1x, c1y, c2x, c2y, x, y);
                      }

                      break;
                  case 31: // hvcurveto
                      while (stack.length > 0) {
                          c1x = x + stack.shift();
                          c1y = y;
                          c2x = c1x + stack.shift();
                          c2y = c1y + stack.shift();
                          y = c2y + stack.shift();
                          x = c2x + (stack.length === 1 ? stack.shift() : 0);
                          p.curveTo(c1x, c1y, c2x, c2y, x, y);
                          if (stack.length === 0) {
                              break;
                          }

                          c1x = x;
                          c1y = y + stack.shift();
                          c2x = c1x + stack.shift();
                          c2y = c1y + stack.shift();
                          x = c2x + stack.shift();
                          y = c2y + (stack.length === 1 ? stack.shift() : 0);
                          p.curveTo(c1x, c1y, c2x, c2y, x, y);
                      }

                      break;
                  default:
                      if (v < 32) {
                          console.log('Glyph ' + glyph.index + ': unknown operator ' + v);
                      } else if (v < 247) {
                          stack.push(v - 139);
                      } else if (v < 251) {
                          b1 = code[i];
                          i += 1;
                          stack.push((v - 247) * 256 + b1 + 108);
                      } else if (v < 255) {
                          b1 = code[i];
                          i += 1;
                          stack.push(-(v - 251) * 256 - b1 - 108);
                      } else {
                          b1 = code[i];
                          b2 = code[i + 1];
                          b3 = code[i + 2];
                          b4 = code[i + 3];
                          i += 4;
                          stack.push(((b1 << 24) | (b2 << 16) | (b3 << 8) | b4) / 65536);
                      }
              }
          }
      }

      parse(code);

      glyph.advanceWidth = width;
      return p;
  }

  function parseCFFFDSelect(data, start, nGlyphs, fdArrayCount) {
      var fdSelect = [];
      var fdIndex;
      var parser = new parse.Parser(data, start);
      var format = parser.parseCard8();
      if (format === 0) {
          // Simple list of nGlyphs elements
          for (var iGid = 0; iGid < nGlyphs; iGid++) {
              fdIndex = parser.parseCard8();
              if (fdIndex >= fdArrayCount) {
                  throw new Error('CFF table CID Font FDSelect has bad FD index value ' + fdIndex + ' (FD count ' + fdArrayCount + ')');
              }
              fdSelect.push(fdIndex);
          }
      } else if (format === 3) {
          // Ranges
          var nRanges = parser.parseCard16();
          var first = parser.parseCard16();
          if (first !== 0) {
              throw new Error('CFF Table CID Font FDSelect format 3 range has bad initial GID ' + first);
          }
          var next;
          for (var iRange = 0; iRange < nRanges; iRange++) {
              fdIndex = parser.parseCard8();
              next = parser.parseCard16();
              if (fdIndex >= fdArrayCount) {
                  throw new Error('CFF table CID Font FDSelect has bad FD index value ' + fdIndex + ' (FD count ' + fdArrayCount + ')');
              }
              if (next > nGlyphs) {
                  throw new Error('CFF Table CID Font FDSelect format 3 range has bad GID ' + next);
              }
              for (; first < next; first++) {
                  fdSelect.push(fdIndex);
              }
              first = next;
          }
          if (next !== nGlyphs) {
              throw new Error('CFF Table CID Font FDSelect format 3 range has bad final GID ' + next);
          }
      } else {
          throw new Error('CFF Table CID Font FDSelect table has unsupported format ' + format);
      }
      return fdSelect;
  }

  // Parse the `CFF` table, which contains the glyph outlines in PostScript format.
  function parseCFFTable(data, start, font, opt) {
      font.tables.cff = {};
      var header = parseCFFHeader(data, start);
      var nameIndex = parseCFFIndex(data, header.endOffset, parse.bytesToString);
      var topDictIndex = parseCFFIndex(data, nameIndex.endOffset);
      var stringIndex = parseCFFIndex(data, topDictIndex.endOffset, parse.bytesToString);
      var globalSubrIndex = parseCFFIndex(data, stringIndex.endOffset);
      font.gsubrs = globalSubrIndex.objects;
      font.gsubrsBias = calcCFFSubroutineBias(font.gsubrs);

      var topDictArray = gatherCFFTopDicts(data, start, topDictIndex.objects, stringIndex.objects);
      if (topDictArray.length !== 1) {
          throw new Error('CFF table has too many fonts in \'FontSet\' - count of fonts NameIndex.length = ' + topDictArray.length);
      }

      var topDict = topDictArray[0];
      font.tables.cff.topDict = topDict;

      if (topDict._privateDict) {
          font.defaultWidthX = topDict._privateDict.defaultWidthX;
          font.nominalWidthX = topDict._privateDict.nominalWidthX;
      }

      if (topDict.ros[0] !== undefined && topDict.ros[1] !== undefined) {
          font.isCIDFont = true;
      }

      if (font.isCIDFont) {
          var fdArrayOffset = topDict.fdArray;
          var fdSelectOffset = topDict.fdSelect;
          if (fdArrayOffset === 0 || fdSelectOffset === 0) {
              throw new Error('Font is marked as a CID font, but FDArray and/or FDSelect information is missing');
          }
          fdArrayOffset += start;
          var fdArrayIndex = parseCFFIndex(data, fdArrayOffset);
          var fdArray = gatherCFFTopDicts(data, start, fdArrayIndex.objects, stringIndex.objects);
          topDict._fdArray = fdArray;
          fdSelectOffset += start;
          topDict._fdSelect = parseCFFFDSelect(data, fdSelectOffset, font.numGlyphs, fdArray.length);
      }

      var privateDictOffset = start + topDict.private[1];
      var privateDict = parseCFFPrivateDict(data, privateDictOffset, topDict.private[0], stringIndex.objects);
      font.defaultWidthX = privateDict.defaultWidthX;
      font.nominalWidthX = privateDict.nominalWidthX;

      if (privateDict.subrs !== 0) {
          var subrOffset = privateDictOffset + privateDict.subrs;
          var subrIndex = parseCFFIndex(data, subrOffset);
          font.subrs = subrIndex.objects;
          font.subrsBias = calcCFFSubroutineBias(font.subrs);
      } else {
          font.subrs = [];
          font.subrsBias = 0;
      }

      // Offsets in the top dict are relative to the beginning of the CFF data, so add the CFF start offset.
      var charStringsIndex;
      if (opt.lowMemory) {
          charStringsIndex = parseCFFIndexLowMemory(data, start + topDict.charStrings);
          font.nGlyphs = charStringsIndex.offsets.length;
      } else {
          charStringsIndex = parseCFFIndex(data, start + topDict.charStrings);
          font.nGlyphs = charStringsIndex.objects.length;
      }

      var charset = parseCFFCharset(data, start + topDict.charset, font.nGlyphs, stringIndex.objects);
      if (topDict.encoding === 0) {
          // Standard encoding
          font.cffEncoding = new CffEncoding(cffStandardEncoding, charset);
      } else if (topDict.encoding === 1) {
          // Expert encoding
          font.cffEncoding = new CffEncoding(cffExpertEncoding, charset);
      } else {
          font.cffEncoding = parseCFFEncoding(data, start + topDict.encoding, charset);
      }

      // Prefer the CMAP encoding to the CFF encoding.
      font.encoding = font.encoding || font.cffEncoding;

      font.glyphs = new glyphset.GlyphSet(font);
      if (opt.lowMemory) {
          font._push = function(i) {
              var charString = getCffIndexObject(i, charStringsIndex.offsets, data, start + topDict.charStrings);
              font.glyphs.push(i, glyphset.cffGlyphLoader(font, i, parseCFFCharstring, charString));
          };
      } else {
          for (var i = 0; i < font.nGlyphs; i += 1) {
              var charString = charStringsIndex.objects[i];
              font.glyphs.push(i, glyphset.cffGlyphLoader(font, i, parseCFFCharstring, charString));
          }
      }
  }

  // Convert a string to a String ID (SID).
  // The list of strings is modified in place.
  function encodeString(s, strings) {
      var sid;

      // Is the string in the CFF standard strings?
      var i = cffStandardStrings.indexOf(s);
      if (i >= 0) {
          sid = i;
      }

      // Is the string already in the string index?
      i = strings.indexOf(s);
      if (i >= 0) {
          sid = i + cffStandardStrings.length;
      } else {
          sid = cffStandardStrings.length + strings.length;
          strings.push(s);
      }

      return sid;
  }

  function makeHeader() {
      return new table.Record('Header', [
          {name: 'major', type: 'Card8', value: 1},
          {name: 'minor', type: 'Card8', value: 0},
          {name: 'hdrSize', type: 'Card8', value: 4},
          {name: 'major', type: 'Card8', value: 1}
      ]);
  }

  function makeNameIndex(fontNames) {
      var t = new table.Record('Name INDEX', [
          {name: 'names', type: 'INDEX', value: []}
      ]);
      t.names = [];
      for (var i = 0; i < fontNames.length; i += 1) {
          t.names.push({name: 'name_' + i, type: 'NAME', value: fontNames[i]});
      }

      return t;
  }

  // Given a dictionary's metadata, create a DICT structure.
  function makeDict(meta, attrs, strings) {
      var m = {};
      for (var i = 0; i < meta.length; i += 1) {
          var entry = meta[i];
          var value = attrs[entry.name];
          if (value !== undefined && !equals(value, entry.value)) {
              if (entry.type === 'SID') {
                  value = encodeString(value, strings);
              }

              m[entry.op] = {name: entry.name, type: entry.type, value: value};
          }
      }

      return m;
  }

  // The Top DICT houses the global font attributes.
  function makeTopDict(attrs, strings) {
      var t = new table.Record('Top DICT', [
          {name: 'dict', type: 'DICT', value: {}}
      ]);
      t.dict = makeDict(TOP_DICT_META, attrs, strings);
      return t;
  }

  function makeTopDictIndex(topDict) {
      var t = new table.Record('Top DICT INDEX', [
          {name: 'topDicts', type: 'INDEX', value: []}
      ]);
      t.topDicts = [{name: 'topDict_0', type: 'TABLE', value: topDict}];
      return t;
  }

  function makeStringIndex(strings) {
      var t = new table.Record('String INDEX', [
          {name: 'strings', type: 'INDEX', value: []}
      ]);
      t.strings = [];
      for (var i = 0; i < strings.length; i += 1) {
          t.strings.push({name: 'string_' + i, type: 'STRING', value: strings[i]});
      }

      return t;
  }

  function makeGlobalSubrIndex() {
      // Currently we don't use subroutines.
      return new table.Record('Global Subr INDEX', [
          {name: 'subrs', type: 'INDEX', value: []}
      ]);
  }

  function makeCharsets(glyphNames, strings) {
      var t = new table.Record('Charsets', [
          {name: 'format', type: 'Card8', value: 0}
      ]);
      for (var i = 0; i < glyphNames.length; i += 1) {
          var glyphName = glyphNames[i];
          var glyphSID = encodeString(glyphName, strings);
          t.fields.push({name: 'glyph_' + i, type: 'SID', value: glyphSID});
      }

      return t;
  }

  function glyphToOps(glyph) {
      var ops = [];
      var path = glyph.path;
      ops.push({name: 'width', type: 'NUMBER', value: glyph.advanceWidth});
      var x = 0;
      var y = 0;
      for (var i = 0; i < path.commands.length; i += 1) {
          var dx = (void 0);
          var dy = (void 0);
          var cmd = path.commands[i];
          if (cmd.type === 'Q') {
              // CFF only supports bézier curves, so convert the quad to a bézier.
              var _13 = 1 / 3;
              var _23 = 2 / 3;

              // We're going to create a new command so we don't change the original path.
              // Since all coordinates are relative, we round() them ASAP to avoid propagating errors.
              cmd = {
                  type: 'C',
                  x: cmd.x,
                  y: cmd.y,
                  x1: Math.round(_13 * x + _23 * cmd.x1),
                  y1: Math.round(_13 * y + _23 * cmd.y1),
                  x2: Math.round(_13 * cmd.x + _23 * cmd.x1),
                  y2: Math.round(_13 * cmd.y + _23 * cmd.y1)
              };
          }

          if (cmd.type === 'M') {
              dx = Math.round(cmd.x - x);
              dy = Math.round(cmd.y - y);
              ops.push({name: 'dx', type: 'NUMBER', value: dx});
              ops.push({name: 'dy', type: 'NUMBER', value: dy});
              ops.push({name: 'rmoveto', type: 'OP', value: 21});
              x = Math.round(cmd.x);
              y = Math.round(cmd.y);
          } else if (cmd.type === 'L') {
              dx = Math.round(cmd.x - x);
              dy = Math.round(cmd.y - y);
              ops.push({name: 'dx', type: 'NUMBER', value: dx});
              ops.push({name: 'dy', type: 'NUMBER', value: dy});
              ops.push({name: 'rlineto', type: 'OP', value: 5});
              x = Math.round(cmd.x);
              y = Math.round(cmd.y);
          } else if (cmd.type === 'C') {
              var dx1 = Math.round(cmd.x1 - x);
              var dy1 = Math.round(cmd.y1 - y);
              var dx2 = Math.round(cmd.x2 - cmd.x1);
              var dy2 = Math.round(cmd.y2 - cmd.y1);
              dx = Math.round(cmd.x - cmd.x2);
              dy = Math.round(cmd.y - cmd.y2);
              ops.push({name: 'dx1', type: 'NUMBER', value: dx1});
              ops.push({name: 'dy1', type: 'NUMBER', value: dy1});
              ops.push({name: 'dx2', type: 'NUMBER', value: dx2});
              ops.push({name: 'dy2', type: 'NUMBER', value: dy2});
              ops.push({name: 'dx', type: 'NUMBER', value: dx});
              ops.push({name: 'dy', type: 'NUMBER', value: dy});
              ops.push({name: 'rrcurveto', type: 'OP', value: 8});
              x = Math.round(cmd.x);
              y = Math.round(cmd.y);
          }

          // Contours are closed automatically.
      }

      ops.push({name: 'endchar', type: 'OP', value: 14});
      return ops;
  }

  function makeCharStringsIndex(glyphs) {
      var t = new table.Record('CharStrings INDEX', [
          {name: 'charStrings', type: 'INDEX', value: []}
      ]);

      for (var i = 0; i < glyphs.length; i += 1) {
          var glyph = glyphs.get(i);
          var ops = glyphToOps(glyph);
          t.charStrings.push({name: glyph.name, type: 'CHARSTRING', value: ops});
      }

      return t;
  }

  function makePrivateDict(attrs, strings) {
      var t = new table.Record('Private DICT', [
          {name: 'dict', type: 'DICT', value: {}}
      ]);
      t.dict = makeDict(PRIVATE_DICT_META, attrs, strings);
      return t;
  }

  function makeCFFTable(glyphs, options) {
      var t = new table.Table('CFF ', [
          {name: 'header', type: 'RECORD'},
          {name: 'nameIndex', type: 'RECORD'},
          {name: 'topDictIndex', type: 'RECORD'},
          {name: 'stringIndex', type: 'RECORD'},
          {name: 'globalSubrIndex', type: 'RECORD'},
          {name: 'charsets', type: 'RECORD'},
          {name: 'charStringsIndex', type: 'RECORD'},
          {name: 'privateDict', type: 'RECORD'}
      ]);

      var fontScale = 1 / options.unitsPerEm;
      // We use non-zero values for the offsets so that the DICT encodes them.
      // This is important because the size of the Top DICT plays a role in offset calculation,
      // and the size shouldn't change after we've written correct offsets.
      var attrs = {
          version: options.version,
          fullName: options.fullName,
          familyName: options.familyName,
          weight: options.weightName,
          fontBBox: options.fontBBox || [0, 0, 0, 0],
          fontMatrix: [fontScale, 0, 0, fontScale, 0, 0],
          charset: 999,
          encoding: 0,
          charStrings: 999,
          private: [0, 999]
      };

      var privateAttrs = {};

      var glyphNames = [];
      var glyph;

      // Skip first glyph (.notdef)
      for (var i = 1; i < glyphs.length; i += 1) {
          glyph = glyphs.get(i);
          glyphNames.push(glyph.name);
      }

      var strings = [];

      t.header = makeHeader();
      t.nameIndex = makeNameIndex([options.postScriptName]);
      var topDict = makeTopDict(attrs, strings);
      t.topDictIndex = makeTopDictIndex(topDict);
      t.globalSubrIndex = makeGlobalSubrIndex();
      t.charsets = makeCharsets(glyphNames, strings);
      t.charStringsIndex = makeCharStringsIndex(glyphs);
      t.privateDict = makePrivateDict(privateAttrs, strings);

      // Needs to come at the end, to encode all custom strings used in the font.
      t.stringIndex = makeStringIndex(strings);

      var startOffset = t.header.sizeOf() +
          t.nameIndex.sizeOf() +
          t.topDictIndex.sizeOf() +
          t.stringIndex.sizeOf() +
          t.globalSubrIndex.sizeOf();
      attrs.charset = startOffset;

      // We use the CFF standard encoding; proper encoding will be handled in cmap.
      attrs.encoding = 0;
      attrs.charStrings = attrs.charset + t.charsets.sizeOf();
      attrs.private[1] = attrs.charStrings + t.charStringsIndex.sizeOf();

      // Recreate the Top DICT INDEX with the correct offsets.
      topDict = makeTopDict(attrs, strings);
      t.topDictIndex = makeTopDictIndex(topDict);

      return t;
  }

  var cff = { parse: parseCFFTable, make: makeCFFTable };

  // The `head` table contains global information about the font.

  // Parse the header `head` table
  function parseHeadTable(data, start) {
      var head = {};
      var p = new parse.Parser(data, start);
      head.version = p.parseVersion();
      head.fontRevision = Math.round(p.parseFixed() * 1000) / 1000;
      head.checkSumAdjustment = p.parseULong();
      head.magicNumber = p.parseULong();
      check.argument(head.magicNumber === 0x5F0F3CF5, 'Font header has wrong magic number.');
      head.flags = p.parseUShort();
      head.unitsPerEm = p.parseUShort();
      head.created = p.parseLongDateTime();
      head.modified = p.parseLongDateTime();
      head.xMin = p.parseShort();
      head.yMin = p.parseShort();
      head.xMax = p.parseShort();
      head.yMax = p.parseShort();
      head.macStyle = p.parseUShort();
      head.lowestRecPPEM = p.parseUShort();
      head.fontDirectionHint = p.parseShort();
      head.indexToLocFormat = p.parseShort();
      head.glyphDataFormat = p.parseShort();
      return head;
  }

  function makeHeadTable(options) {
      // Apple Mac timestamp epoch is 01/01/1904 not 01/01/1970
      var timestamp = Math.round(new Date().getTime() / 1000) + 2082844800;
      var createdTimestamp = timestamp;

      if (options.createdTimestamp) {
          createdTimestamp = options.createdTimestamp + 2082844800;
      }

      return new table.Table('head', [
          {name: 'version', type: 'FIXED', value: 0x00010000},
          {name: 'fontRevision', type: 'FIXED', value: 0x00010000},
          {name: 'checkSumAdjustment', type: 'ULONG', value: 0},
          {name: 'magicNumber', type: 'ULONG', value: 0x5F0F3CF5},
          {name: 'flags', type: 'USHORT', value: 0},
          {name: 'unitsPerEm', type: 'USHORT', value: 1000},
          {name: 'created', type: 'LONGDATETIME', value: createdTimestamp},
          {name: 'modified', type: 'LONGDATETIME', value: timestamp},
          {name: 'xMin', type: 'SHORT', value: 0},
          {name: 'yMin', type: 'SHORT', value: 0},
          {name: 'xMax', type: 'SHORT', value: 0},
          {name: 'yMax', type: 'SHORT', value: 0},
          {name: 'macStyle', type: 'USHORT', value: 0},
          {name: 'lowestRecPPEM', type: 'USHORT', value: 0},
          {name: 'fontDirectionHint', type: 'SHORT', value: 2},
          {name: 'indexToLocFormat', type: 'SHORT', value: 0},
          {name: 'glyphDataFormat', type: 'SHORT', value: 0}
      ], options);
  }

  var head = { parse: parseHeadTable, make: makeHeadTable };

  // The `hhea` table contains information for horizontal layout.

  // Parse the horizontal header `hhea` table
  function parseHheaTable(data, start) {
      var hhea = {};
      var p = new parse.Parser(data, start);
      hhea.version = p.parseVersion();
      hhea.ascender = p.parseShort();
      hhea.descender = p.parseShort();
      hhea.lineGap = p.parseShort();
      hhea.advanceWidthMax = p.parseUShort();
      hhea.minLeftSideBearing = p.parseShort();
      hhea.minRightSideBearing = p.parseShort();
      hhea.xMaxExtent = p.parseShort();
      hhea.caretSlopeRise = p.parseShort();
      hhea.caretSlopeRun = p.parseShort();
      hhea.caretOffset = p.parseShort();
      p.relativeOffset += 8;
      hhea.metricDataFormat = p.parseShort();
      hhea.numberOfHMetrics = p.parseUShort();
      return hhea;
  }

  function makeHheaTable(options) {
      return new table.Table('hhea', [
          {name: 'version', type: 'FIXED', value: 0x00010000},
          {name: 'ascender', type: 'FWORD', value: 0},
          {name: 'descender', type: 'FWORD', value: 0},
          {name: 'lineGap', type: 'FWORD', value: 0},
          {name: 'advanceWidthMax', type: 'UFWORD', value: 0},
          {name: 'minLeftSideBearing', type: 'FWORD', value: 0},
          {name: 'minRightSideBearing', type: 'FWORD', value: 0},
          {name: 'xMaxExtent', type: 'FWORD', value: 0},
          {name: 'caretSlopeRise', type: 'SHORT', value: 1},
          {name: 'caretSlopeRun', type: 'SHORT', value: 0},
          {name: 'caretOffset', type: 'SHORT', value: 0},
          {name: 'reserved1', type: 'SHORT', value: 0},
          {name: 'reserved2', type: 'SHORT', value: 0},
          {name: 'reserved3', type: 'SHORT', value: 0},
          {name: 'reserved4', type: 'SHORT', value: 0},
          {name: 'metricDataFormat', type: 'SHORT', value: 0},
          {name: 'numberOfHMetrics', type: 'USHORT', value: 0}
      ], options);
  }

  var hhea = { parse: parseHheaTable, make: makeHheaTable };

  // The `hmtx` table contains the horizontal metrics for all glyphs.

  function parseHmtxTableAll(data, start, numMetrics, numGlyphs, glyphs) {
      var advanceWidth;
      var leftSideBearing;
      var p = new parse.Parser(data, start);
      for (var i = 0; i < numGlyphs; i += 1) {
          // If the font is monospaced, only one entry is needed. This last entry applies to all subsequent glyphs.
          if (i < numMetrics) {
              advanceWidth = p.parseUShort();
              leftSideBearing = p.parseShort();
          }

          var glyph = glyphs.get(i);
          glyph.advanceWidth = advanceWidth;
          glyph.leftSideBearing = leftSideBearing;
      }
  }

  function parseHmtxTableOnLowMemory(font, data, start, numMetrics, numGlyphs) {
      font._hmtxTableData = {};

      var advanceWidth;
      var leftSideBearing;
      var p = new parse.Parser(data, start);
      for (var i = 0; i < numGlyphs; i += 1) {
          // If the font is monospaced, only one entry is needed. This last entry applies to all subsequent glyphs.
          if (i < numMetrics) {
              advanceWidth = p.parseUShort();
              leftSideBearing = p.parseShort();
          }

          font._hmtxTableData[i] = {
              advanceWidth: advanceWidth,
              leftSideBearing: leftSideBearing
          };
      }
  }

  // Parse the `hmtx` table, which contains the horizontal metrics for all glyphs.
  // This function augments the glyph array, adding the advanceWidth and leftSideBearing to each glyph.
  function parseHmtxTable(font, data, start, numMetrics, numGlyphs, glyphs, opt) {
      if (opt.lowMemory)
          { parseHmtxTableOnLowMemory(font, data, start, numMetrics, numGlyphs); }
      else
          { parseHmtxTableAll(data, start, numMetrics, numGlyphs, glyphs); }
  }

  function makeHmtxTable(glyphs) {
      var t = new table.Table('hmtx', []);
      for (var i = 0; i < glyphs.length; i += 1) {
          var glyph = glyphs.get(i);
          var advanceWidth = glyph.advanceWidth || 0;
          var leftSideBearing = glyph.leftSideBearing || 0;
          t.fields.push({name: 'advanceWidth_' + i, type: 'USHORT', value: advanceWidth});
          t.fields.push({name: 'leftSideBearing_' + i, type: 'SHORT', value: leftSideBearing});
      }

      return t;
  }

  var hmtx = { parse: parseHmtxTable, make: makeHmtxTable };

  // The `ltag` table stores IETF BCP-47 language tags. It allows supporting

  function makeLtagTable(tags) {
      var result = new table.Table('ltag', [
          {name: 'version', type: 'ULONG', value: 1},
          {name: 'flags', type: 'ULONG', value: 0},
          {name: 'numTags', type: 'ULONG', value: tags.length}
      ]);

      var stringPool = '';
      var stringPoolOffset = 12 + tags.length * 4;
      for (var i = 0; i < tags.length; ++i) {
          var pos = stringPool.indexOf(tags[i]);
          if (pos < 0) {
              pos = stringPool.length;
              stringPool += tags[i];
          }

          result.fields.push({name: 'offset ' + i, type: 'USHORT', value: stringPoolOffset + pos});
          result.fields.push({name: 'length ' + i, type: 'USHORT', value: tags[i].length});
      }

      result.fields.push({name: 'stringPool', type: 'CHARARRAY', value: stringPool});
      return result;
  }

  function parseLtagTable(data, start) {
      var p = new parse.Parser(data, start);
      var tableVersion = p.parseULong();
      check.argument(tableVersion === 1, 'Unsupported ltag table version.');
      // The 'ltag' specification does not define any flags; skip the field.
      p.skip('uLong', 1);
      var numTags = p.parseULong();

      var tags = [];
      for (var i = 0; i < numTags; i++) {
          var tag = '';
          var offset = start + p.parseUShort();
          var length = p.parseUShort();
          for (var j = offset; j < offset + length; ++j) {
              tag += String.fromCharCode(data.getInt8(j));
          }

          tags.push(tag);
      }

      return tags;
  }

  var ltag = { make: makeLtagTable, parse: parseLtagTable };

  // The `maxp` table establishes the memory requirements for the font.

  // Parse the maximum profile `maxp` table.
  function parseMaxpTable(data, start) {
      var maxp = {};
      var p = new parse.Parser(data, start);
      maxp.version = p.parseVersion();
      maxp.numGlyphs = p.parseUShort();
      if (maxp.version === 1.0) {
          maxp.maxPoints = p.parseUShort();
          maxp.maxContours = p.parseUShort();
          maxp.maxCompositePoints = p.parseUShort();
          maxp.maxCompositeContours = p.parseUShort();
          maxp.maxZones = p.parseUShort();
          maxp.maxTwilightPoints = p.parseUShort();
          maxp.maxStorage = p.parseUShort();
          maxp.maxFunctionDefs = p.parseUShort();
          maxp.maxInstructionDefs = p.parseUShort();
          maxp.maxStackElements = p.parseUShort();
          maxp.maxSizeOfInstructions = p.parseUShort();
          maxp.maxComponentElements = p.parseUShort();
          maxp.maxComponentDepth = p.parseUShort();
      }

      return maxp;
  }

  function makeMaxpTable(numGlyphs) {
      return new table.Table('maxp', [
          {name: 'version', type: 'FIXED', value: 0x00005000},
          {name: 'numGlyphs', type: 'USHORT', value: numGlyphs}
      ]);
  }

  var maxp = { parse: parseMaxpTable, make: makeMaxpTable };

  // The `name` naming table.

  // NameIDs for the name table.
  var nameTableNames = [
      'copyright',              // 0
      'fontFamily',             // 1
      'fontSubfamily',          // 2
      'uniqueID',               // 3
      'fullName',               // 4
      'version',                // 5
      'postScriptName',         // 6
      'trademark',              // 7
      'manufacturer',           // 8
      'designer',               // 9
      'description',            // 10
      'manufacturerURL',        // 11
      'designerURL',            // 12
      'license',                // 13
      'licenseURL',             // 14
      'reserved',               // 15
      'preferredFamily',        // 16
      'preferredSubfamily',     // 17
      'compatibleFullName',     // 18
      'sampleText',             // 19
      'postScriptFindFontName', // 20
      'wwsFamily',              // 21
      'wwsSubfamily'            // 22
  ];

  var macLanguages = {
      0: 'en',
      1: 'fr',
      2: 'de',
      3: 'it',
      4: 'nl',
      5: 'sv',
      6: 'es',
      7: 'da',
      8: 'pt',
      9: 'no',
      10: 'he',
      11: 'ja',
      12: 'ar',
      13: 'fi',
      14: 'el',
      15: 'is',
      16: 'mt',
      17: 'tr',
      18: 'hr',
      19: 'zh-Hant',
      20: 'ur',
      21: 'hi',
      22: 'th',
      23: 'ko',
      24: 'lt',
      25: 'pl',
      26: 'hu',
      27: 'es',
      28: 'lv',
      29: 'se',
      30: 'fo',
      31: 'fa',
      32: 'ru',
      33: 'zh',
      34: 'nl-BE',
      35: 'ga',
      36: 'sq',
      37: 'ro',
      38: 'cz',
      39: 'sk',
      40: 'si',
      41: 'yi',
      42: 'sr',
      43: 'mk',
      44: 'bg',
      45: 'uk',
      46: 'be',
      47: 'uz',
      48: 'kk',
      49: 'az-Cyrl',
      50: 'az-Arab',
      51: 'hy',
      52: 'ka',
      53: 'mo',
      54: 'ky',
      55: 'tg',
      56: 'tk',
      57: 'mn-CN',
      58: 'mn',
      59: 'ps',
      60: 'ks',
      61: 'ku',
      62: 'sd',
      63: 'bo',
      64: 'ne',
      65: 'sa',
      66: 'mr',
      67: 'bn',
      68: 'as',
      69: 'gu',
      70: 'pa',
      71: 'or',
      72: 'ml',
      73: 'kn',
      74: 'ta',
      75: 'te',
      76: 'si',
      77: 'my',
      78: 'km',
      79: 'lo',
      80: 'vi',
      81: 'id',
      82: 'tl',
      83: 'ms',
      84: 'ms-Arab',
      85: 'am',
      86: 'ti',
      87: 'om',
      88: 'so',
      89: 'sw',
      90: 'rw',
      91: 'rn',
      92: 'ny',
      93: 'mg',
      94: 'eo',
      128: 'cy',
      129: 'eu',
      130: 'ca',
      131: 'la',
      132: 'qu',
      133: 'gn',
      134: 'ay',
      135: 'tt',
      136: 'ug',
      137: 'dz',
      138: 'jv',
      139: 'su',
      140: 'gl',
      141: 'af',
      142: 'br',
      143: 'iu',
      144: 'gd',
      145: 'gv',
      146: 'ga',
      147: 'to',
      148: 'el-polyton',
      149: 'kl',
      150: 'az',
      151: 'nn'
  };

  // MacOS language ID → MacOS script ID
  //
  // Note that the script ID is not sufficient to determine what encoding
  // to use in TrueType files. For some languages, MacOS used a modification
  // of a mainstream script. For example, an Icelandic name would be stored
  // with smRoman in the TrueType naming table, but the actual encoding
  // is a special Icelandic version of the normal Macintosh Roman encoding.
  // As another example, Inuktitut uses an 8-bit encoding for Canadian Aboriginal
  // Syllables but MacOS had run out of available script codes, so this was
  // done as a (pretty radical) "modification" of Ethiopic.
  //
  // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/Readme.txt
  var macLanguageToScript = {
      0: 0,  // langEnglish → smRoman
      1: 0,  // langFrench → smRoman
      2: 0,  // langGerman → smRoman
      3: 0,  // langItalian → smRoman
      4: 0,  // langDutch → smRoman
      5: 0,  // langSwedish → smRoman
      6: 0,  // langSpanish → smRoman
      7: 0,  // langDanish → smRoman
      8: 0,  // langPortuguese → smRoman
      9: 0,  // langNorwegian → smRoman
      10: 5,  // langHebrew → smHebrew
      11: 1,  // langJapanese → smJapanese
      12: 4,  // langArabic → smArabic
      13: 0,  // langFinnish → smRoman
      14: 6,  // langGreek → smGreek
      15: 0,  // langIcelandic → smRoman (modified)
      16: 0,  // langMaltese → smRoman
      17: 0,  // langTurkish → smRoman (modified)
      18: 0,  // langCroatian → smRoman (modified)
      19: 2,  // langTradChinese → smTradChinese
      20: 4,  // langUrdu → smArabic
      21: 9,  // langHindi → smDevanagari
      22: 21,  // langThai → smThai
      23: 3,  // langKorean → smKorean
      24: 29,  // langLithuanian → smCentralEuroRoman
      25: 29,  // langPolish → smCentralEuroRoman
      26: 29,  // langHungarian → smCentralEuroRoman
      27: 29,  // langEstonian → smCentralEuroRoman
      28: 29,  // langLatvian → smCentralEuroRoman
      29: 0,  // langSami → smRoman
      30: 0,  // langFaroese → smRoman (modified)
      31: 4,  // langFarsi → smArabic (modified)
      32: 7,  // langRussian → smCyrillic
      33: 25,  // langSimpChinese → smSimpChinese
      34: 0,  // langFlemish → smRoman
      35: 0,  // langIrishGaelic → smRoman (modified)
      36: 0,  // langAlbanian → smRoman
      37: 0,  // langRomanian → smRoman (modified)
      38: 29,  // langCzech → smCentralEuroRoman
      39: 29,  // langSlovak → smCentralEuroRoman
      40: 0,  // langSlovenian → smRoman (modified)
      41: 5,  // langYiddish → smHebrew
      42: 7,  // langSerbian → smCyrillic
      43: 7,  // langMacedonian → smCyrillic
      44: 7,  // langBulgarian → smCyrillic
      45: 7,  // langUkrainian → smCyrillic (modified)
      46: 7,  // langByelorussian → smCyrillic
      47: 7,  // langUzbek → smCyrillic
      48: 7,  // langKazakh → smCyrillic
      49: 7,  // langAzerbaijani → smCyrillic
      50: 4,  // langAzerbaijanAr → smArabic
      51: 24,  // langArmenian → smArmenian
      52: 23,  // langGeorgian → smGeorgian
      53: 7,  // langMoldavian → smCyrillic
      54: 7,  // langKirghiz → smCyrillic
      55: 7,  // langTajiki → smCyrillic
      56: 7,  // langTurkmen → smCyrillic
      57: 27,  // langMongolian → smMongolian
      58: 7,  // langMongolianCyr → smCyrillic
      59: 4,  // langPashto → smArabic
      60: 4,  // langKurdish → smArabic
      61: 4,  // langKashmiri → smArabic
      62: 4,  // langSindhi → smArabic
      63: 26,  // langTibetan → smTibetan
      64: 9,  // langNepali → smDevanagari
      65: 9,  // langSanskrit → smDevanagari
      66: 9,  // langMarathi → smDevanagari
      67: 13,  // langBengali → smBengali
      68: 13,  // langAssamese → smBengali
      69: 11,  // langGujarati → smGujarati
      70: 10,  // langPunjabi → smGurmukhi
      71: 12,  // langOriya → smOriya
      72: 17,  // langMalayalam → smMalayalam
      73: 16,  // langKannada → smKannada
      74: 14,  // langTamil → smTamil
      75: 15,  // langTelugu → smTelugu
      76: 18,  // langSinhalese → smSinhalese
      77: 19,  // langBurmese → smBurmese
      78: 20,  // langKhmer → smKhmer
      79: 22,  // langLao → smLao
      80: 30,  // langVietnamese → smVietnamese
      81: 0,  // langIndonesian → smRoman
      82: 0,  // langTagalog → smRoman
      83: 0,  // langMalayRoman → smRoman
      84: 4,  // langMalayArabic → smArabic
      85: 28,  // langAmharic → smEthiopic
      86: 28,  // langTigrinya → smEthiopic
      87: 28,  // langOromo → smEthiopic
      88: 0,  // langSomali → smRoman
      89: 0,  // langSwahili → smRoman
      90: 0,  // langKinyarwanda → smRoman
      91: 0,  // langRundi → smRoman
      92: 0,  // langNyanja → smRoman
      93: 0,  // langMalagasy → smRoman
      94: 0,  // langEsperanto → smRoman
      128: 0,  // langWelsh → smRoman (modified)
      129: 0,  // langBasque → smRoman
      130: 0,  // langCatalan → smRoman
      131: 0,  // langLatin → smRoman
      132: 0,  // langQuechua → smRoman
      133: 0,  // langGuarani → smRoman
      134: 0,  // langAymara → smRoman
      135: 7,  // langTatar → smCyrillic
      136: 4,  // langUighur → smArabic
      137: 26,  // langDzongkha → smTibetan
      138: 0,  // langJavaneseRom → smRoman
      139: 0,  // langSundaneseRom → smRoman
      140: 0,  // langGalician → smRoman
      141: 0,  // langAfrikaans → smRoman
      142: 0,  // langBreton → smRoman (modified)
      143: 28,  // langInuktitut → smEthiopic (modified)
      144: 0,  // langScottishGaelic → smRoman (modified)
      145: 0,  // langManxGaelic → smRoman (modified)
      146: 0,  // langIrishGaelicScript → smRoman (modified)
      147: 0,  // langTongan → smRoman
      148: 6,  // langGreekAncient → smRoman
      149: 0,  // langGreenlandic → smRoman
      150: 0,  // langAzerbaijanRoman → smRoman
      151: 0   // langNynorsk → smRoman
  };

  // While Microsoft indicates a region/country for all its language
  // IDs, we omit the region code if it's equal to the "most likely
  // region subtag" according to Unicode CLDR. For scripts, we omit
  // the subtag if it is equal to the Suppress-Script entry in the
  // IANA language subtag registry for IETF BCP 47.
  //
  // For example, Microsoft states that its language code 0x041A is
  // Croatian in Croatia. We transform this to the BCP 47 language code 'hr'
  // and not 'hr-HR' because Croatia is the default country for Croatian,
  // according to Unicode CLDR. As another example, Microsoft states
  // that 0x101A is Croatian (Latin) in Bosnia-Herzegovina. We transform
  // this to 'hr-BA' and not 'hr-Latn-BA' because Latin is the default script
  // for the Croatian language, according to IANA.
  //
  // http://www.unicode.org/cldr/charts/latest/supplemental/likely_subtags.html
  // http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
  var windowsLanguages = {
      0x0436: 'af',
      0x041C: 'sq',
      0x0484: 'gsw',
      0x045E: 'am',
      0x1401: 'ar-DZ',
      0x3C01: 'ar-BH',
      0x0C01: 'ar',
      0x0801: 'ar-IQ',
      0x2C01: 'ar-JO',
      0x3401: 'ar-KW',
      0x3001: 'ar-LB',
      0x1001: 'ar-LY',
      0x1801: 'ary',
      0x2001: 'ar-OM',
      0x4001: 'ar-QA',
      0x0401: 'ar-SA',
      0x2801: 'ar-SY',
      0x1C01: 'aeb',
      0x3801: 'ar-AE',
      0x2401: 'ar-YE',
      0x042B: 'hy',
      0x044D: 'as',
      0x082C: 'az-Cyrl',
      0x042C: 'az',
      0x046D: 'ba',
      0x042D: 'eu',
      0x0423: 'be',
      0x0845: 'bn',
      0x0445: 'bn-IN',
      0x201A: 'bs-Cyrl',
      0x141A: 'bs',
      0x047E: 'br',
      0x0402: 'bg',
      0x0403: 'ca',
      0x0C04: 'zh-HK',
      0x1404: 'zh-MO',
      0x0804: 'zh',
      0x1004: 'zh-SG',
      0x0404: 'zh-TW',
      0x0483: 'co',
      0x041A: 'hr',
      0x101A: 'hr-BA',
      0x0405: 'cs',
      0x0406: 'da',
      0x048C: 'prs',
      0x0465: 'dv',
      0x0813: 'nl-BE',
      0x0413: 'nl',
      0x0C09: 'en-AU',
      0x2809: 'en-BZ',
      0x1009: 'en-CA',
      0x2409: 'en-029',
      0x4009: 'en-IN',
      0x1809: 'en-IE',
      0x2009: 'en-JM',
      0x4409: 'en-MY',
      0x1409: 'en-NZ',
      0x3409: 'en-PH',
      0x4809: 'en-SG',
      0x1C09: 'en-ZA',
      0x2C09: 'en-TT',
      0x0809: 'en-GB',
      0x0409: 'en',
      0x3009: 'en-ZW',
      0x0425: 'et',
      0x0438: 'fo',
      0x0464: 'fil',
      0x040B: 'fi',
      0x080C: 'fr-BE',
      0x0C0C: 'fr-CA',
      0x040C: 'fr',
      0x140C: 'fr-LU',
      0x180C: 'fr-MC',
      0x100C: 'fr-CH',
      0x0462: 'fy',
      0x0456: 'gl',
      0x0437: 'ka',
      0x0C07: 'de-AT',
      0x0407: 'de',
      0x1407: 'de-LI',
      0x1007: 'de-LU',
      0x0807: 'de-CH',
      0x0408: 'el',
      0x046F: 'kl',
      0x0447: 'gu',
      0x0468: 'ha',
      0x040D: 'he',
      0x0439: 'hi',
      0x040E: 'hu',
      0x040F: 'is',
      0x0470: 'ig',
      0x0421: 'id',
      0x045D: 'iu',
      0x085D: 'iu-Latn',
      0x083C: 'ga',
      0x0434: 'xh',
      0x0435: 'zu',
      0x0410: 'it',
      0x0810: 'it-CH',
      0x0411: 'ja',
      0x044B: 'kn',
      0x043F: 'kk',
      0x0453: 'km',
      0x0486: 'quc',
      0x0487: 'rw',
      0x0441: 'sw',
      0x0457: 'kok',
      0x0412: 'ko',
      0x0440: 'ky',
      0x0454: 'lo',
      0x0426: 'lv',
      0x0427: 'lt',
      0x082E: 'dsb',
      0x046E: 'lb',
      0x042F: 'mk',
      0x083E: 'ms-BN',
      0x043E: 'ms',
      0x044C: 'ml',
      0x043A: 'mt',
      0x0481: 'mi',
      0x047A: 'arn',
      0x044E: 'mr',
      0x047C: 'moh',
      0x0450: 'mn',
      0x0850: 'mn-CN',
      0x0461: 'ne',
      0x0414: 'nb',
      0x0814: 'nn',
      0x0482: 'oc',
      0x0448: 'or',
      0x0463: 'ps',
      0x0415: 'pl',
      0x0416: 'pt',
      0x0816: 'pt-PT',
      0x0446: 'pa',
      0x046B: 'qu-BO',
      0x086B: 'qu-EC',
      0x0C6B: 'qu',
      0x0418: 'ro',
      0x0417: 'rm',
      0x0419: 'ru',
      0x243B: 'smn',
      0x103B: 'smj-NO',
      0x143B: 'smj',
      0x0C3B: 'se-FI',
      0x043B: 'se',
      0x083B: 'se-SE',
      0x203B: 'sms',
      0x183B: 'sma-NO',
      0x1C3B: 'sms',
      0x044F: 'sa',
      0x1C1A: 'sr-Cyrl-BA',
      0x0C1A: 'sr',
      0x181A: 'sr-Latn-BA',
      0x081A: 'sr-Latn',
      0x046C: 'nso',
      0x0432: 'tn',
      0x045B: 'si',
      0x041B: 'sk',
      0x0424: 'sl',
      0x2C0A: 'es-AR',
      0x400A: 'es-BO',
      0x340A: 'es-CL',
      0x240A: 'es-CO',
      0x140A: 'es-CR',
      0x1C0A: 'es-DO',
      0x300A: 'es-EC',
      0x440A: 'es-SV',
      0x100A: 'es-GT',
      0x480A: 'es-HN',
      0x080A: 'es-MX',
      0x4C0A: 'es-NI',
      0x180A: 'es-PA',
      0x3C0A: 'es-PY',
      0x280A: 'es-PE',
      0x500A: 'es-PR',

      // Microsoft has defined two different language codes for
      // “Spanish with modern sorting” and “Spanish with traditional
      // sorting”. This makes sense for collation APIs, and it would be
      // possible to express this in BCP 47 language tags via Unicode
      // extensions (eg., es-u-co-trad is Spanish with traditional
      // sorting). However, for storing names in fonts, the distinction
      // does not make sense, so we give “es” in both cases.
      0x0C0A: 'es',
      0x040A: 'es',

      0x540A: 'es-US',
      0x380A: 'es-UY',
      0x200A: 'es-VE',
      0x081D: 'sv-FI',
      0x041D: 'sv',
      0x045A: 'syr',
      0x0428: 'tg',
      0x085F: 'tzm',
      0x0449: 'ta',
      0x0444: 'tt',
      0x044A: 'te',
      0x041E: 'th',
      0x0451: 'bo',
      0x041F: 'tr',
      0x0442: 'tk',
      0x0480: 'ug',
      0x0422: 'uk',
      0x042E: 'hsb',
      0x0420: 'ur',
      0x0843: 'uz-Cyrl',
      0x0443: 'uz',
      0x042A: 'vi',
      0x0452: 'cy',
      0x0488: 'wo',
      0x0485: 'sah',
      0x0478: 'ii',
      0x046A: 'yo'
  };

  // Returns a IETF BCP 47 language code, for example 'zh-Hant'
  // for 'Chinese in the traditional script'.
  function getLanguageCode(platformID, languageID, ltag) {
      switch (platformID) {
          case 0:  // Unicode
              if (languageID === 0xFFFF) {
                  return 'und';
              } else if (ltag) {
                  return ltag[languageID];
              }

              break;

          case 1:  // Macintosh
              return macLanguages[languageID];

          case 3:  // Windows
              return windowsLanguages[languageID];
      }

      return undefined;
  }

  var utf16 = 'utf-16';

  // MacOS script ID → encoding. This table stores the default case,
  // which can be overridden by macLanguageEncodings.
  var macScriptEncodings = {
      0: 'macintosh',           // smRoman
      1: 'x-mac-japanese',      // smJapanese
      2: 'x-mac-chinesetrad',   // smTradChinese
      3: 'x-mac-korean',        // smKorean
      6: 'x-mac-greek',         // smGreek
      7: 'x-mac-cyrillic',      // smCyrillic
      9: 'x-mac-devanagai',     // smDevanagari
      10: 'x-mac-gurmukhi',     // smGurmukhi
      11: 'x-mac-gujarati',     // smGujarati
      12: 'x-mac-oriya',        // smOriya
      13: 'x-mac-bengali',      // smBengali
      14: 'x-mac-tamil',        // smTamil
      15: 'x-mac-telugu',       // smTelugu
      16: 'x-mac-kannada',      // smKannada
      17: 'x-mac-malayalam',    // smMalayalam
      18: 'x-mac-sinhalese',    // smSinhalese
      19: 'x-mac-burmese',      // smBurmese
      20: 'x-mac-khmer',        // smKhmer
      21: 'x-mac-thai',         // smThai
      22: 'x-mac-lao',          // smLao
      23: 'x-mac-georgian',     // smGeorgian
      24: 'x-mac-armenian',     // smArmenian
      25: 'x-mac-chinesesimp',  // smSimpChinese
      26: 'x-mac-tibetan',      // smTibetan
      27: 'x-mac-mongolian',    // smMongolian
      28: 'x-mac-ethiopic',     // smEthiopic
      29: 'x-mac-ce',           // smCentralEuroRoman
      30: 'x-mac-vietnamese',   // smVietnamese
      31: 'x-mac-extarabic'     // smExtArabic
  };

  // MacOS language ID → encoding. This table stores the exceptional
  // cases, which override macScriptEncodings. For writing MacOS naming
  // tables, we need to emit a MacOS script ID. Therefore, we cannot
  // merge macScriptEncodings into macLanguageEncodings.
  //
  // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/Readme.txt
  var macLanguageEncodings = {
      15: 'x-mac-icelandic',    // langIcelandic
      17: 'x-mac-turkish',      // langTurkish
      18: 'x-mac-croatian',     // langCroatian
      24: 'x-mac-ce',           // langLithuanian
      25: 'x-mac-ce',           // langPolish
      26: 'x-mac-ce',           // langHungarian
      27: 'x-mac-ce',           // langEstonian
      28: 'x-mac-ce',           // langLatvian
      30: 'x-mac-icelandic',    // langFaroese
      37: 'x-mac-romanian',     // langRomanian
      38: 'x-mac-ce',           // langCzech
      39: 'x-mac-ce',           // langSlovak
      40: 'x-mac-ce',           // langSlovenian
      143: 'x-mac-inuit',       // langInuktitut
      146: 'x-mac-gaelic'       // langIrishGaelicScript
  };

  function getEncoding(platformID, encodingID, languageID) {
      switch (platformID) {
          case 0:  // Unicode
              return utf16;

          case 1:  // Apple Macintosh
              return macLanguageEncodings[languageID] || macScriptEncodings[encodingID];

          case 3:  // Microsoft Windows
              if (encodingID === 1 || encodingID === 10) {
                  return utf16;
              }

              break;
      }

      return undefined;
  }

  // Parse the naming `name` table.
  // FIXME: Format 1 additional fields are not supported yet.
  // ltag is the content of the `ltag' table, such as ['en', 'zh-Hans', 'de-CH-1904'].
  function parseNameTable(data, start, ltag) {
      var name = {};
      var p = new parse.Parser(data, start);
      var format = p.parseUShort();
      var count = p.parseUShort();
      var stringOffset = p.offset + p.parseUShort();
      for (var i = 0; i < count; i++) {
          var platformID = p.parseUShort();
          var encodingID = p.parseUShort();
          var languageID = p.parseUShort();
          var nameID = p.parseUShort();
          var property = nameTableNames[nameID] || nameID;
          var byteLength = p.parseUShort();
          var offset = p.parseUShort();
          var language = getLanguageCode(platformID, languageID, ltag);
          var encoding = getEncoding(platformID, encodingID, languageID);
          if (encoding !== undefined && language !== undefined) {
              var text = (void 0);
              if (encoding === utf16) {
                  text = decode.UTF16(data, stringOffset + offset, byteLength);
              } else {
                  text = decode.MACSTRING(data, stringOffset + offset, byteLength, encoding);
              }

              if (text) {
                  var translations = name[property];
                  if (translations === undefined) {
                      translations = name[property] = {};
                  }

                  translations[language] = text;
              }
          }
      }
      if (format === 1) {
          // FIXME: Also handle Microsoft's 'name' table 1.
          p.parseUShort();
      }

      return name;
  }

  // {23: 'foo'} → {'foo': 23}
  // ['bar', 'baz'] → {'bar': 0, 'baz': 1}
  function reverseDict(dict) {
      var result = {};
      for (var key in dict) {
          result[dict[key]] = parseInt(key);
      }

      return result;
  }

  function makeNameRecord(platformID, encodingID, languageID, nameID, length, offset) {
      return new table.Record('NameRecord', [
          {name: 'platformID', type: 'USHORT', value: platformID},
          {name: 'encodingID', type: 'USHORT', value: encodingID},
          {name: 'languageID', type: 'USHORT', value: languageID},
          {name: 'nameID', type: 'USHORT', value: nameID},
          {name: 'length', type: 'USHORT', value: length},
          {name: 'offset', type: 'USHORT', value: offset}
      ]);
  }

  // Finds the position of needle in haystack, or -1 if not there.
  // Like String.indexOf(), but for arrays.
  function findSubArray(needle, haystack) {
      var needleLength = needle.length;
      var limit = haystack.length - needleLength + 1;

      loop:
      for (var pos = 0; pos < limit; pos++) {
          for (; pos < limit; pos++) {
              for (var k = 0; k < needleLength; k++) {
                  if (haystack[pos + k] !== needle[k]) {
                      continue loop;
                  }
              }

              return pos;
          }
      }

      return -1;
  }

  function addStringToPool(s, pool) {
      var offset = findSubArray(s, pool);
      if (offset < 0) {
          offset = pool.length;
          var i = 0;
          var len = s.length;
          for (; i < len; ++i) {
              pool.push(s[i]);
          }

      }

      return offset;
  }

  function makeNameTable(names, ltag) {
      var nameID;
      var nameIDs = [];

      var namesWithNumericKeys = {};
      var nameTableIds = reverseDict(nameTableNames);
      for (var key in names) {
          var id = nameTableIds[key];
          if (id === undefined) {
              id = key;
          }

          nameID = parseInt(id);

          if (isNaN(nameID)) {
              throw new Error('Name table entry "' + key + '" does not exist, see nameTableNames for complete list.');
          }

          namesWithNumericKeys[nameID] = names[key];
          nameIDs.push(nameID);
      }

      var macLanguageIds = reverseDict(macLanguages);
      var windowsLanguageIds = reverseDict(windowsLanguages);

      var nameRecords = [];
      var stringPool = [];

      for (var i = 0; i < nameIDs.length; i++) {
          nameID = nameIDs[i];
          var translations = namesWithNumericKeys[nameID];
          for (var lang in translations) {
              var text = translations[lang];

              // For MacOS, we try to emit the name in the form that was introduced
              // in the initial version of the TrueType spec (in the late 1980s).
              // However, this can fail for various reasons: the requested BCP 47
              // language code might not have an old-style Mac equivalent;
              // we might not have a codec for the needed character encoding;
              // or the name might contain characters that cannot be expressed
              // in the old-style Macintosh encoding. In case of failure, we emit
              // the name in a more modern fashion (Unicode encoding with BCP 47
              // language tags) that is recognized by MacOS 10.5, released in 2009.
              // If fonts were only read by operating systems, we could simply
              // emit all names in the modern form; this would be much easier.
              // However, there are many applications and libraries that read
              // 'name' tables directly, and these will usually only recognize
              // the ancient form (silently skipping the unrecognized names).
              var macPlatform = 1;  // Macintosh
              var macLanguage = macLanguageIds[lang];
              var macScript = macLanguageToScript[macLanguage];
              var macEncoding = getEncoding(macPlatform, macScript, macLanguage);
              var macName = encode.MACSTRING(text, macEncoding);
              if (macName === undefined) {
                  macPlatform = 0;  // Unicode
                  macLanguage = ltag.indexOf(lang);
                  if (macLanguage < 0) {
                      macLanguage = ltag.length;
                      ltag.push(lang);
                  }

                  macScript = 4;  // Unicode 2.0 and later
                  macName = encode.UTF16(text);
              }

              var macNameOffset = addStringToPool(macName, stringPool);
              nameRecords.push(makeNameRecord(macPlatform, macScript, macLanguage,
                                              nameID, macName.length, macNameOffset));

              var winLanguage = windowsLanguageIds[lang];
              if (winLanguage !== undefined) {
                  var winName = encode.UTF16(text);
                  var winNameOffset = addStringToPool(winName, stringPool);
                  nameRecords.push(makeNameRecord(3, 1, winLanguage,
                                                  nameID, winName.length, winNameOffset));
              }
          }
      }

      nameRecords.sort(function(a, b) {
          return ((a.platformID - b.platformID) ||
                  (a.encodingID - b.encodingID) ||
                  (a.languageID - b.languageID) ||
                  (a.nameID - b.nameID));
      });

      var t = new table.Table('name', [
          {name: 'format', type: 'USHORT', value: 0},
          {name: 'count', type: 'USHORT', value: nameRecords.length},
          {name: 'stringOffset', type: 'USHORT', value: 6 + nameRecords.length * 12}
      ]);

      for (var r = 0; r < nameRecords.length; r++) {
          t.fields.push({name: 'record_' + r, type: 'RECORD', value: nameRecords[r]});
      }

      t.fields.push({name: 'strings', type: 'LITERAL', value: stringPool});
      return t;
  }

  var _name = { parse: parseNameTable, make: makeNameTable };

  // The `OS/2` table contains metrics required in OpenType fonts.

  var unicodeRanges = [
      {begin: 0x0000, end: 0x007F}, // Basic Latin
      {begin: 0x0080, end: 0x00FF}, // Latin-1 Supplement
      {begin: 0x0100, end: 0x017F}, // Latin Extended-A
      {begin: 0x0180, end: 0x024F}, // Latin Extended-B
      {begin: 0x0250, end: 0x02AF}, // IPA Extensions
      {begin: 0x02B0, end: 0x02FF}, // Spacing Modifier Letters
      {begin: 0x0300, end: 0x036F}, // Combining Diacritical Marks
      {begin: 0x0370, end: 0x03FF}, // Greek and Coptic
      {begin: 0x2C80, end: 0x2CFF}, // Coptic
      {begin: 0x0400, end: 0x04FF}, // Cyrillic
      {begin: 0x0530, end: 0x058F}, // Armenian
      {begin: 0x0590, end: 0x05FF}, // Hebrew
      {begin: 0xA500, end: 0xA63F}, // Vai
      {begin: 0x0600, end: 0x06FF}, // Arabic
      {begin: 0x07C0, end: 0x07FF}, // NKo
      {begin: 0x0900, end: 0x097F}, // Devanagari
      {begin: 0x0980, end: 0x09FF}, // Bengali
      {begin: 0x0A00, end: 0x0A7F}, // Gurmukhi
      {begin: 0x0A80, end: 0x0AFF}, // Gujarati
      {begin: 0x0B00, end: 0x0B7F}, // Oriya
      {begin: 0x0B80, end: 0x0BFF}, // Tamil
      {begin: 0x0C00, end: 0x0C7F}, // Telugu
      {begin: 0x0C80, end: 0x0CFF}, // Kannada
      {begin: 0x0D00, end: 0x0D7F}, // Malayalam
      {begin: 0x0E00, end: 0x0E7F}, // Thai
      {begin: 0x0E80, end: 0x0EFF}, // Lao
      {begin: 0x10A0, end: 0x10FF}, // Georgian
      {begin: 0x1B00, end: 0x1B7F}, // Balinese
      {begin: 0x1100, end: 0x11FF}, // Hangul Jamo
      {begin: 0x1E00, end: 0x1EFF}, // Latin Extended Additional
      {begin: 0x1F00, end: 0x1FFF}, // Greek Extended
      {begin: 0x2000, end: 0x206F}, // General Punctuation
      {begin: 0x2070, end: 0x209F}, // Superscripts And Subscripts
      {begin: 0x20A0, end: 0x20CF}, // Currency Symbol
      {begin: 0x20D0, end: 0x20FF}, // Combining Diacritical Marks For Symbols
      {begin: 0x2100, end: 0x214F}, // Letterlike Symbols
      {begin: 0x2150, end: 0x218F}, // Number Forms
      {begin: 0x2190, end: 0x21FF}, // Arrows
      {begin: 0x2200, end: 0x22FF}, // Mathematical Operators
      {begin: 0x2300, end: 0x23FF}, // Miscellaneous Technical
      {begin: 0x2400, end: 0x243F}, // Control Pictures
      {begin: 0x2440, end: 0x245F}, // Optical Character Recognition
      {begin: 0x2460, end: 0x24FF}, // Enclosed Alphanumerics
      {begin: 0x2500, end: 0x257F}, // Box Drawing
      {begin: 0x2580, end: 0x259F}, // Block Elements
      {begin: 0x25A0, end: 0x25FF}, // Geometric Shapes
      {begin: 0x2600, end: 0x26FF}, // Miscellaneous Symbols
      {begin: 0x2700, end: 0x27BF}, // Dingbats
      {begin: 0x3000, end: 0x303F}, // CJK Symbols And Punctuation
      {begin: 0x3040, end: 0x309F}, // Hiragana
      {begin: 0x30A0, end: 0x30FF}, // Katakana
      {begin: 0x3100, end: 0x312F}, // Bopomofo
      {begin: 0x3130, end: 0x318F}, // Hangul Compatibility Jamo
      {begin: 0xA840, end: 0xA87F}, // Phags-pa
      {begin: 0x3200, end: 0x32FF}, // Enclosed CJK Letters And Months
      {begin: 0x3300, end: 0x33FF}, // CJK Compatibility
      {begin: 0xAC00, end: 0xD7AF}, // Hangul Syllables
      {begin: 0xD800, end: 0xDFFF}, // Non-Plane 0 *
      {begin: 0x10900, end: 0x1091F}, // Phoenicia
      {begin: 0x4E00, end: 0x9FFF}, // CJK Unified Ideographs
      {begin: 0xE000, end: 0xF8FF}, // Private Use Area (plane 0)
      {begin: 0x31C0, end: 0x31EF}, // CJK Strokes
      {begin: 0xFB00, end: 0xFB4F}, // Alphabetic Presentation Forms
      {begin: 0xFB50, end: 0xFDFF}, // Arabic Presentation Forms-A
      {begin: 0xFE20, end: 0xFE2F}, // Combining Half Marks
      {begin: 0xFE10, end: 0xFE1F}, // Vertical Forms
      {begin: 0xFE50, end: 0xFE6F}, // Small Form Variants
      {begin: 0xFE70, end: 0xFEFF}, // Arabic Presentation Forms-B
      {begin: 0xFF00, end: 0xFFEF}, // Halfwidth And Fullwidth Forms
      {begin: 0xFFF0, end: 0xFFFF}, // Specials
      {begin: 0x0F00, end: 0x0FFF}, // Tibetan
      {begin: 0x0700, end: 0x074F}, // Syriac
      {begin: 0x0780, end: 0x07BF}, // Thaana
      {begin: 0x0D80, end: 0x0DFF}, // Sinhala
      {begin: 0x1000, end: 0x109F}, // Myanmar
      {begin: 0x1200, end: 0x137F}, // Ethiopic
      {begin: 0x13A0, end: 0x13FF}, // Cherokee
      {begin: 0x1400, end: 0x167F}, // Unified Canadian Aboriginal Syllabics
      {begin: 0x1680, end: 0x169F}, // Ogham
      {begin: 0x16A0, end: 0x16FF}, // Runic
      {begin: 0x1780, end: 0x17FF}, // Khmer
      {begin: 0x1800, end: 0x18AF}, // Mongolian
      {begin: 0x2800, end: 0x28FF}, // Braille Patterns
      {begin: 0xA000, end: 0xA48F}, // Yi Syllables
      {begin: 0x1700, end: 0x171F}, // Tagalog
      {begin: 0x10300, end: 0x1032F}, // Old Italic
      {begin: 0x10330, end: 0x1034F}, // Gothic
      {begin: 0x10400, end: 0x1044F}, // Deseret
      {begin: 0x1D000, end: 0x1D0FF}, // Byzantine Musical Symbols
      {begin: 0x1D400, end: 0x1D7FF}, // Mathematical Alphanumeric Symbols
      {begin: 0xFF000, end: 0xFFFFD}, // Private Use (plane 15)
      {begin: 0xFE00, end: 0xFE0F}, // Variation Selectors
      {begin: 0xE0000, end: 0xE007F}, // Tags
      {begin: 0x1900, end: 0x194F}, // Limbu
      {begin: 0x1950, end: 0x197F}, // Tai Le
      {begin: 0x1980, end: 0x19DF}, // New Tai Lue
      {begin: 0x1A00, end: 0x1A1F}, // Buginese
      {begin: 0x2C00, end: 0x2C5F}, // Glagolitic
      {begin: 0x2D30, end: 0x2D7F}, // Tifinagh
      {begin: 0x4DC0, end: 0x4DFF}, // Yijing Hexagram Symbols
      {begin: 0xA800, end: 0xA82F}, // Syloti Nagri
      {begin: 0x10000, end: 0x1007F}, // Linear B Syllabary
      {begin: 0x10140, end: 0x1018F}, // Ancient Greek Numbers
      {begin: 0x10380, end: 0x1039F}, // Ugaritic
      {begin: 0x103A0, end: 0x103DF}, // Old Persian
      {begin: 0x10450, end: 0x1047F}, // Shavian
      {begin: 0x10480, end: 0x104AF}, // Osmanya
      {begin: 0x10800, end: 0x1083F}, // Cypriot Syllabary
      {begin: 0x10A00, end: 0x10A5F}, // Kharoshthi
      {begin: 0x1D300, end: 0x1D35F}, // Tai Xuan Jing Symbols
      {begin: 0x12000, end: 0x123FF}, // Cuneiform
      {begin: 0x1D360, end: 0x1D37F}, // Counting Rod Numerals
      {begin: 0x1B80, end: 0x1BBF}, // Sundanese
      {begin: 0x1C00, end: 0x1C4F}, // Lepcha
      {begin: 0x1C50, end: 0x1C7F}, // Ol Chiki
      {begin: 0xA880, end: 0xA8DF}, // Saurashtra
      {begin: 0xA900, end: 0xA92F}, // Kayah Li
      {begin: 0xA930, end: 0xA95F}, // Rejang
      {begin: 0xAA00, end: 0xAA5F}, // Cham
      {begin: 0x10190, end: 0x101CF}, // Ancient Symbols
      {begin: 0x101D0, end: 0x101FF}, // Phaistos Disc
      {begin: 0x102A0, end: 0x102DF}, // Carian
      {begin: 0x1F030, end: 0x1F09F}  // Domino Tiles
  ];

  function getUnicodeRange(unicode) {
      for (var i = 0; i < unicodeRanges.length; i += 1) {
          var range = unicodeRanges[i];
          if (unicode >= range.begin && unicode < range.end) {
              return i;
          }
      }

      return -1;
  }

  // Parse the OS/2 and Windows metrics `OS/2` table
  function parseOS2Table(data, start) {
      var os2 = {};
      var p = new parse.Parser(data, start);
      os2.version = p.parseUShort();
      os2.xAvgCharWidth = p.parseShort();
      os2.usWeightClass = p.parseUShort();
      os2.usWidthClass = p.parseUShort();
      os2.fsType = p.parseUShort();
      os2.ySubscriptXSize = p.parseShort();
      os2.ySubscriptYSize = p.parseShort();
      os2.ySubscriptXOffset = p.parseShort();
      os2.ySubscriptYOffset = p.parseShort();
      os2.ySuperscriptXSize = p.parseShort();
      os2.ySuperscriptYSize = p.parseShort();
      os2.ySuperscriptXOffset = p.parseShort();
      os2.ySuperscriptYOffset = p.parseShort();
      os2.yStrikeoutSize = p.parseShort();
      os2.yStrikeoutPosition = p.parseShort();
      os2.sFamilyClass = p.parseShort();
      os2.panose = [];
      for (var i = 0; i < 10; i++) {
          os2.panose[i] = p.parseByte();
      }

      os2.ulUnicodeRange1 = p.parseULong();
      os2.ulUnicodeRange2 = p.parseULong();
      os2.ulUnicodeRange3 = p.parseULong();
      os2.ulUnicodeRange4 = p.parseULong();
      os2.achVendID = String.fromCharCode(p.parseByte(), p.parseByte(), p.parseByte(), p.parseByte());
      os2.fsSelection = p.parseUShort();
      os2.usFirstCharIndex = p.parseUShort();
      os2.usLastCharIndex = p.parseUShort();
      os2.sTypoAscender = p.parseShort();
      os2.sTypoDescender = p.parseShort();
      os2.sTypoLineGap = p.parseShort();
      os2.usWinAscent = p.parseUShort();
      os2.usWinDescent = p.parseUShort();
      if (os2.version >= 1) {
          os2.ulCodePageRange1 = p.parseULong();
          os2.ulCodePageRange2 = p.parseULong();
      }

      if (os2.version >= 2) {
          os2.sxHeight = p.parseShort();
          os2.sCapHeight = p.parseShort();
          os2.usDefaultChar = p.parseUShort();
          os2.usBreakChar = p.parseUShort();
          os2.usMaxContent = p.parseUShort();
      }

      return os2;
  }

  function makeOS2Table(options) {
      return new table.Table('OS/2', [
          {name: 'version', type: 'USHORT', value: 0x0003},
          {name: 'xAvgCharWidth', type: 'SHORT', value: 0},
          {name: 'usWeightClass', type: 'USHORT', value: 0},
          {name: 'usWidthClass', type: 'USHORT', value: 0},
          {name: 'fsType', type: 'USHORT', value: 0},
          {name: 'ySubscriptXSize', type: 'SHORT', value: 650},
          {name: 'ySubscriptYSize', type: 'SHORT', value: 699},
          {name: 'ySubscriptXOffset', type: 'SHORT', value: 0},
          {name: 'ySubscriptYOffset', type: 'SHORT', value: 140},
          {name: 'ySuperscriptXSize', type: 'SHORT', value: 650},
          {name: 'ySuperscriptYSize', type: 'SHORT', value: 699},
          {name: 'ySuperscriptXOffset', type: 'SHORT', value: 0},
          {name: 'ySuperscriptYOffset', type: 'SHORT', value: 479},
          {name: 'yStrikeoutSize', type: 'SHORT', value: 49},
          {name: 'yStrikeoutPosition', type: 'SHORT', value: 258},
          {name: 'sFamilyClass', type: 'SHORT', value: 0},
          {name: 'bFamilyType', type: 'BYTE', value: 0},
          {name: 'bSerifStyle', type: 'BYTE', value: 0},
          {name: 'bWeight', type: 'BYTE', value: 0},
          {name: 'bProportion', type: 'BYTE', value: 0},
          {name: 'bContrast', type: 'BYTE', value: 0},
          {name: 'bStrokeVariation', type: 'BYTE', value: 0},
          {name: 'bArmStyle', type: 'BYTE', value: 0},
          {name: 'bLetterform', type: 'BYTE', value: 0},
          {name: 'bMidline', type: 'BYTE', value: 0},
          {name: 'bXHeight', type: 'BYTE', value: 0},
          {name: 'ulUnicodeRange1', type: 'ULONG', value: 0},
          {name: 'ulUnicodeRange2', type: 'ULONG', value: 0},
          {name: 'ulUnicodeRange3', type: 'ULONG', value: 0},
          {name: 'ulUnicodeRange4', type: 'ULONG', value: 0},
          {name: 'achVendID', type: 'CHARARRAY', value: 'XXXX'},
          {name: 'fsSelection', type: 'USHORT', value: 0},
          {name: 'usFirstCharIndex', type: 'USHORT', value: 0},
          {name: 'usLastCharIndex', type: 'USHORT', value: 0},
          {name: 'sTypoAscender', type: 'SHORT', value: 0},
          {name: 'sTypoDescender', type: 'SHORT', value: 0},
          {name: 'sTypoLineGap', type: 'SHORT', value: 0},
          {name: 'usWinAscent', type: 'USHORT', value: 0},
          {name: 'usWinDescent', type: 'USHORT', value: 0},
          {name: 'ulCodePageRange1', type: 'ULONG', value: 0},
          {name: 'ulCodePageRange2', type: 'ULONG', value: 0},
          {name: 'sxHeight', type: 'SHORT', value: 0},
          {name: 'sCapHeight', type: 'SHORT', value: 0},
          {name: 'usDefaultChar', type: 'USHORT', value: 0},
          {name: 'usBreakChar', type: 'USHORT', value: 0},
          {name: 'usMaxContext', type: 'USHORT', value: 0}
      ], options);
  }

  var os2 = { parse: parseOS2Table, make: makeOS2Table, unicodeRanges: unicodeRanges, getUnicodeRange: getUnicodeRange };

  // The `post` table stores additional PostScript information, such as glyph names.

  // Parse the PostScript `post` table
  function parsePostTable(data, start) {
      var post = {};
      var p = new parse.Parser(data, start);
      post.version = p.parseVersion();
      post.italicAngle = p.parseFixed();
      post.underlinePosition = p.parseShort();
      post.underlineThickness = p.parseShort();
      post.isFixedPitch = p.parseULong();
      post.minMemType42 = p.parseULong();
      post.maxMemType42 = p.parseULong();
      post.minMemType1 = p.parseULong();
      post.maxMemType1 = p.parseULong();
      switch (post.version) {
          case 1:
              post.names = standardNames.slice();
              break;
          case 2:
              post.numberOfGlyphs = p.parseUShort();
              post.glyphNameIndex = new Array(post.numberOfGlyphs);
              for (var i = 0; i < post.numberOfGlyphs; i++) {
                  post.glyphNameIndex[i] = p.parseUShort();
              }

              post.names = [];
              for (var i$1 = 0; i$1 < post.numberOfGlyphs; i$1++) {
                  if (post.glyphNameIndex[i$1] >= standardNames.length) {
                      var nameLength = p.parseChar();
                      post.names.push(p.parseString(nameLength));
                  }
              }

              break;
          case 2.5:
              post.numberOfGlyphs = p.parseUShort();
              post.offset = new Array(post.numberOfGlyphs);
              for (var i$2 = 0; i$2 < post.numberOfGlyphs; i$2++) {
                  post.offset[i$2] = p.parseChar();
              }

              break;
      }
      return post;
  }

  function makePostTable() {
      return new table.Table('post', [
          {name: 'version', type: 'FIXED', value: 0x00030000},
          {name: 'italicAngle', type: 'FIXED', value: 0},
          {name: 'underlinePosition', type: 'FWORD', value: 0},
          {name: 'underlineThickness', type: 'FWORD', value: 0},
          {name: 'isFixedPitch', type: 'ULONG', value: 0},
          {name: 'minMemType42', type: 'ULONG', value: 0},
          {name: 'maxMemType42', type: 'ULONG', value: 0},
          {name: 'minMemType1', type: 'ULONG', value: 0},
          {name: 'maxMemType1', type: 'ULONG', value: 0}
      ]);
  }

  var post = { parse: parsePostTable, make: makePostTable };

  // The `GSUB` table contains ligatures, among other things.

  var subtableParsers = new Array(9);         // subtableParsers[0] is unused

  // https://www.microsoft.com/typography/OTSPEC/GSUB.htm#SS
  subtableParsers[1] = function parseLookup1() {
      var start = this.offset + this.relativeOffset;
      var substFormat = this.parseUShort();
      if (substFormat === 1) {
          return {
              substFormat: 1,
              coverage: this.parsePointer(Parser$1.coverage),
              deltaGlyphId: this.parseUShort()
          };
      } else if (substFormat === 2) {
          return {
              substFormat: 2,
              coverage: this.parsePointer(Parser$1.coverage),
              substitute: this.parseOffset16List()
          };
      }
      check.assert(false, '0x' + start.toString(16) + ': lookup type 1 format must be 1 or 2.');
  };

  // https://www.microsoft.com/typography/OTSPEC/GSUB.htm#MS
  subtableParsers[2] = function parseLookup2() {
      var substFormat = this.parseUShort();
      check.argument(substFormat === 1, 'GSUB Multiple Substitution Subtable identifier-format must be 1');
      return {
          substFormat: substFormat,
          coverage: this.parsePointer(Parser$1.coverage),
          sequences: this.parseListOfLists()
      };
  };

  // https://www.microsoft.com/typography/OTSPEC/GSUB.htm#AS
  subtableParsers[3] = function parseLookup3() {
      var substFormat = this.parseUShort();
      check.argument(substFormat === 1, 'GSUB Alternate Substitution Subtable identifier-format must be 1');
      return {
          substFormat: substFormat,
          coverage: this.parsePointer(Parser$1.coverage),
          alternateSets: this.parseListOfLists()
      };
  };

  // https://www.microsoft.com/typography/OTSPEC/GSUB.htm#LS
  subtableParsers[4] = function parseLookup4() {
      var substFormat = this.parseUShort();
      check.argument(substFormat === 1, 'GSUB ligature table identifier-format must be 1');
      return {
          substFormat: substFormat,
          coverage: this.parsePointer(Parser$1.coverage),
          ligatureSets: this.parseListOfLists(function() {
              return {
                  ligGlyph: this.parseUShort(),
                  components: this.parseUShortList(this.parseUShort() - 1)
              };
          })
      };
  };

  var lookupRecordDesc = {
      sequenceIndex: Parser$1.uShort,
      lookupListIndex: Parser$1.uShort
  };

  // https://www.microsoft.com/typography/OTSPEC/GSUB.htm#CSF
  subtableParsers[5] = function parseLookup5() {
      var start = this.offset + this.relativeOffset;
      var substFormat = this.parseUShort();

      if (substFormat === 1) {
          return {
              substFormat: substFormat,
              coverage: this.parsePointer(Parser$1.coverage),
              ruleSets: this.parseListOfLists(function() {
                  var glyphCount = this.parseUShort();
                  var substCount = this.parseUShort();
                  return {
                      input: this.parseUShortList(glyphCount - 1),
                      lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
                  };
              })
          };
      } else if (substFormat === 2) {
          return {
              substFormat: substFormat,
              coverage: this.parsePointer(Parser$1.coverage),
              classDef: this.parsePointer(Parser$1.classDef),
              classSets: this.parseListOfLists(function() {
                  var glyphCount = this.parseUShort();
                  var substCount = this.parseUShort();
                  return {
                      classes: this.parseUShortList(glyphCount - 1),
                      lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
                  };
              })
          };
      } else if (substFormat === 3) {
          var glyphCount = this.parseUShort();
          var substCount = this.parseUShort();
          return {
              substFormat: substFormat,
              coverages: this.parseList(glyphCount, Parser$1.pointer(Parser$1.coverage)),
              lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
          };
      }
      check.assert(false, '0x' + start.toString(16) + ': lookup type 5 format must be 1, 2 or 3.');
  };

  // https://www.microsoft.com/typography/OTSPEC/GSUB.htm#CC
  subtableParsers[6] = function parseLookup6() {
      var start = this.offset + this.relativeOffset;
      var substFormat = this.parseUShort();
      if (substFormat === 1) {
          return {
              substFormat: 1,
              coverage: this.parsePointer(Parser$1.coverage),
              chainRuleSets: this.parseListOfLists(function() {
                  return {
                      backtrack: this.parseUShortList(),
                      input: this.parseUShortList(this.parseShort() - 1),
                      lookahead: this.parseUShortList(),
                      lookupRecords: this.parseRecordList(lookupRecordDesc)
                  };
              })
          };
      } else if (substFormat === 2) {
          return {
              substFormat: 2,
              coverage: this.parsePointer(Parser$1.coverage),
              backtrackClassDef: this.parsePointer(Parser$1.classDef),
              inputClassDef: this.parsePointer(Parser$1.classDef),
              lookaheadClassDef: this.parsePointer(Parser$1.classDef),
              chainClassSet: this.parseListOfLists(function() {
                  return {
                      backtrack: this.parseUShortList(),
                      input: this.parseUShortList(this.parseShort() - 1),
                      lookahead: this.parseUShortList(),
                      lookupRecords: this.parseRecordList(lookupRecordDesc)
                  };
              })
          };
      } else if (substFormat === 3) {
          return {
              substFormat: 3,
              backtrackCoverage: this.parseList(Parser$1.pointer(Parser$1.coverage)),
              inputCoverage: this.parseList(Parser$1.pointer(Parser$1.coverage)),
              lookaheadCoverage: this.parseList(Parser$1.pointer(Parser$1.coverage)),
              lookupRecords: this.parseRecordList(lookupRecordDesc)
          };
      }
      check.assert(false, '0x' + start.toString(16) + ': lookup type 6 format must be 1, 2 or 3.');
  };

  // https://www.microsoft.com/typography/OTSPEC/GSUB.htm#ES
  subtableParsers[7] = function parseLookup7() {
      // Extension Substitution subtable
      var substFormat = this.parseUShort();
      check.argument(substFormat === 1, 'GSUB Extension Substitution subtable identifier-format must be 1');
      var extensionLookupType = this.parseUShort();
      var extensionParser = new Parser$1(this.data, this.offset + this.parseULong());
      return {
          substFormat: 1,
          lookupType: extensionLookupType,
          extension: subtableParsers[extensionLookupType].call(extensionParser)
      };
  };

  // https://www.microsoft.com/typography/OTSPEC/GSUB.htm#RCCS
  subtableParsers[8] = function parseLookup8() {
      var substFormat = this.parseUShort();
      check.argument(substFormat === 1, 'GSUB Reverse Chaining Contextual Single Substitution Subtable identifier-format must be 1');
      return {
          substFormat: substFormat,
          coverage: this.parsePointer(Parser$1.coverage),
          backtrackCoverage: this.parseList(Parser$1.pointer(Parser$1.coverage)),
          lookaheadCoverage: this.parseList(Parser$1.pointer(Parser$1.coverage)),
          substitutes: this.parseUShortList()
      };
  };

  // https://www.microsoft.com/typography/OTSPEC/gsub.htm
  function parseGsubTable(data, start) {
      start = start || 0;
      var p = new Parser$1(data, start);
      var tableVersion = p.parseVersion(1);
      check.argument(tableVersion === 1 || tableVersion === 1.1, 'Unsupported GSUB table version.');
      if (tableVersion === 1) {
          return {
              version: tableVersion,
              scripts: p.parseScriptList(),
              features: p.parseFeatureList(),
              lookups: p.parseLookupList(subtableParsers)
          };
      } else {
          return {
              version: tableVersion,
              scripts: p.parseScriptList(),
              features: p.parseFeatureList(),
              lookups: p.parseLookupList(subtableParsers),
              variations: p.parseFeatureVariationsList()
          };
      }

  }

  // GSUB Writing //////////////////////////////////////////////
  var subtableMakers = new Array(9);

  subtableMakers[1] = function makeLookup1(subtable) {
      if (subtable.substFormat === 1) {
          return new table.Table('substitutionTable', [
              {name: 'substFormat', type: 'USHORT', value: 1},
              {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)},
              {name: 'deltaGlyphID', type: 'USHORT', value: subtable.deltaGlyphId}
          ]);
      } else {
          return new table.Table('substitutionTable', [
              {name: 'substFormat', type: 'USHORT', value: 2},
              {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)}
          ].concat(table.ushortList('substitute', subtable.substitute)));
      }
  };

  subtableMakers[2] = function makeLookup2(subtable) {
      check.assert(subtable.substFormat === 1, 'Lookup type 2 substFormat must be 1.');
      return new table.Table('substitutionTable', [
          {name: 'substFormat', type: 'USHORT', value: 1},
          {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)}
      ].concat(table.tableList('seqSet', subtable.sequences, function(sequenceSet) {
          return new table.Table('sequenceSetTable', table.ushortList('sequence', sequenceSet));
      })));
  };

  subtableMakers[3] = function makeLookup3(subtable) {
      check.assert(subtable.substFormat === 1, 'Lookup type 3 substFormat must be 1.');
      return new table.Table('substitutionTable', [
          {name: 'substFormat', type: 'USHORT', value: 1},
          {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)}
      ].concat(table.tableList('altSet', subtable.alternateSets, function(alternateSet) {
          return new table.Table('alternateSetTable', table.ushortList('alternate', alternateSet));
      })));
  };

  subtableMakers[4] = function makeLookup4(subtable) {
      check.assert(subtable.substFormat === 1, 'Lookup type 4 substFormat must be 1.');
      return new table.Table('substitutionTable', [
          {name: 'substFormat', type: 'USHORT', value: 1},
          {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)}
      ].concat(table.tableList('ligSet', subtable.ligatureSets, function(ligatureSet) {
          return new table.Table('ligatureSetTable', table.tableList('ligature', ligatureSet, function(ligature) {
              return new table.Table('ligatureTable',
                  [{name: 'ligGlyph', type: 'USHORT', value: ligature.ligGlyph}]
                  .concat(table.ushortList('component', ligature.components, ligature.components.length + 1))
              );
          }));
      })));
  };

  subtableMakers[6] = function makeLookup6(subtable) {
      if (subtable.substFormat === 1) {
          var returnTable = new table.Table('chainContextTable', [
              {name: 'substFormat', type: 'USHORT', value: subtable.substFormat},
              {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)}
          ].concat(table.tableList('chainRuleSet', subtable.chainRuleSets, function(chainRuleSet) {
              return new table.Table('chainRuleSetTable', table.tableList('chainRule', chainRuleSet, function(chainRule) {
                  var tableData = table.ushortList('backtrackGlyph', chainRule.backtrack, chainRule.backtrack.length)
                      .concat(table.ushortList('inputGlyph', chainRule.input, chainRule.input.length + 1))
                      .concat(table.ushortList('lookaheadGlyph', chainRule.lookahead, chainRule.lookahead.length))
                      .concat(table.ushortList('substitution', [], chainRule.lookupRecords.length));

                  chainRule.lookupRecords.forEach(function (record, i) {
                      tableData = tableData
                          .concat({name: 'sequenceIndex' + i, type: 'USHORT', value: record.sequenceIndex})
                          .concat({name: 'lookupListIndex' + i, type: 'USHORT', value: record.lookupListIndex});
                  });
                  return new table.Table('chainRuleTable', tableData);
              }));
          })));
          return returnTable;
      } else if (subtable.substFormat === 2) {
          check.assert(false, 'lookup type 6 format 2 is not yet supported.');
      } else if (subtable.substFormat === 3) {
          var tableData = [
              {name: 'substFormat', type: 'USHORT', value: subtable.substFormat} ];

          tableData.push({name: 'backtrackGlyphCount', type: 'USHORT', value: subtable.backtrackCoverage.length});
          subtable.backtrackCoverage.forEach(function (coverage, i) {
              tableData.push({name: 'backtrackCoverage' + i, type: 'TABLE', value: new table.Coverage(coverage)});
          });
          tableData.push({name: 'inputGlyphCount', type: 'USHORT', value: subtable.inputCoverage.length});
          subtable.inputCoverage.forEach(function (coverage, i) {
              tableData.push({name: 'inputCoverage' + i, type: 'TABLE', value: new table.Coverage(coverage)});
          });
          tableData.push({name: 'lookaheadGlyphCount', type: 'USHORT', value: subtable.lookaheadCoverage.length});
          subtable.lookaheadCoverage.forEach(function (coverage, i) {
              tableData.push({name: 'lookaheadCoverage' + i, type: 'TABLE', value: new table.Coverage(coverage)});
          });

          tableData.push({name: 'substitutionCount', type: 'USHORT', value: subtable.lookupRecords.length});
          subtable.lookupRecords.forEach(function (record, i) {
              tableData = tableData
                  .concat({name: 'sequenceIndex' + i, type: 'USHORT', value: record.sequenceIndex})
                  .concat({name: 'lookupListIndex' + i, type: 'USHORT', value: record.lookupListIndex});
          });

          var returnTable$1 = new table.Table('chainContextTable', tableData);

          return returnTable$1;
      }

      check.assert(false, 'lookup type 6 format must be 1, 2 or 3.');
  };

  function makeGsubTable(gsub) {
      return new table.Table('GSUB', [
          {name: 'version', type: 'ULONG', value: 0x10000},
          {name: 'scripts', type: 'TABLE', value: new table.ScriptList(gsub.scripts)},
          {name: 'features', type: 'TABLE', value: new table.FeatureList(gsub.features)},
          {name: 'lookups', type: 'TABLE', value: new table.LookupList(gsub.lookups, subtableMakers)}
      ]);
  }

  var gsub = { parse: parseGsubTable, make: makeGsubTable };

  // The `GPOS` table contains kerning pairs, among other things.

  // Parse the metadata `meta` table.
  // https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6meta.html
  function parseMetaTable(data, start) {
      var p = new parse.Parser(data, start);
      var tableVersion = p.parseULong();
      check.argument(tableVersion === 1, 'Unsupported META table version.');
      p.parseULong(); // flags - currently unused and set to 0
      p.parseULong(); // tableOffset
      var numDataMaps = p.parseULong();

      var tags = {};
      for (var i = 0; i < numDataMaps; i++) {
          var tag = p.parseTag();
          var dataOffset = p.parseULong();
          var dataLength = p.parseULong();
          var text = decode.UTF8(data, start + dataOffset, dataLength);

          tags[tag] = text;
      }
      return tags;
  }

  function makeMetaTable(tags) {
      var numTags = Object.keys(tags).length;
      var stringPool = '';
      var stringPoolOffset = 16 + numTags * 12;

      var result = new table.Table('meta', [
          {name: 'version', type: 'ULONG', value: 1},
          {name: 'flags', type: 'ULONG', value: 0},
          {name: 'offset', type: 'ULONG', value: stringPoolOffset},
          {name: 'numTags', type: 'ULONG', value: numTags}
      ]);

      for (var tag in tags) {
          var pos = stringPool.length;
          stringPool += tags[tag];

          result.fields.push({name: 'tag ' + tag, type: 'TAG', value: tag});
          result.fields.push({name: 'offset ' + tag, type: 'ULONG', value: stringPoolOffset + pos});
          result.fields.push({name: 'length ' + tag, type: 'ULONG', value: tags[tag].length});
      }

      result.fields.push({name: 'stringPool', type: 'CHARARRAY', value: stringPool});

      return result;
  }

  var meta = { parse: parseMetaTable, make: makeMetaTable };

  // The `sfnt` wrapper provides organization for the tables in the font.

  function log2$1(v) {
      return Math.log(v) / Math.log(2) | 0;
  }

  function computeCheckSum(bytes) {
      while (bytes.length % 4 !== 0) {
          bytes.push(0);
      }

      var sum = 0;
      for (var i = 0; i < bytes.length; i += 4) {
          sum += (bytes[i] << 24) +
              (bytes[i + 1] << 16) +
              (bytes[i + 2] << 8) +
              (bytes[i + 3]);
      }

      sum %= Math.pow(2, 32);
      return sum;
  }

  function makeTableRecord(tag, checkSum, offset, length) {
      return new table.Record('Table Record', [
          {name: 'tag', type: 'TAG', value: tag !== undefined ? tag : ''},
          {name: 'checkSum', type: 'ULONG', value: checkSum !== undefined ? checkSum : 0},
          {name: 'offset', type: 'ULONG', value: offset !== undefined ? offset : 0},
          {name: 'length', type: 'ULONG', value: length !== undefined ? length : 0}
      ]);
  }

  function makeSfntTable(tables) {
      var sfnt = new table.Table('sfnt', [
          {name: 'version', type: 'TAG', value: 'OTTO'},
          {name: 'numTables', type: 'USHORT', value: 0},
          {name: 'searchRange', type: 'USHORT', value: 0},
          {name: 'entrySelector', type: 'USHORT', value: 0},
          {name: 'rangeShift', type: 'USHORT', value: 0}
      ]);
      sfnt.tables = tables;
      sfnt.numTables = tables.length;
      var highestPowerOf2 = Math.pow(2, log2$1(sfnt.numTables));
      sfnt.searchRange = 16 * highestPowerOf2;
      sfnt.entrySelector = log2$1(highestPowerOf2);
      sfnt.rangeShift = sfnt.numTables * 16 - sfnt.searchRange;

      var recordFields = [];
      var tableFields = [];

      var offset = sfnt.sizeOf() + (makeTableRecord().sizeOf() * sfnt.numTables);
      while (offset % 4 !== 0) {
          offset += 1;
          tableFields.push({name: 'padding', type: 'BYTE', value: 0});
      }

      for (var i = 0; i < tables.length; i += 1) {
          var t = tables[i];
          check.argument(t.tableName.length === 4, 'Table name' + t.tableName + ' is invalid.');
          var tableLength = t.sizeOf();
          var tableRecord = makeTableRecord(t.tableName, computeCheckSum(t.encode()), offset, tableLength);
          recordFields.push({name: tableRecord.tag + ' Table Record', type: 'RECORD', value: tableRecord});
          tableFields.push({name: t.tableName + ' table', type: 'RECORD', value: t});
          offset += tableLength;
          check.argument(!isNaN(offset), 'Something went wrong calculating the offset.');
          while (offset % 4 !== 0) {
              offset += 1;
              tableFields.push({name: 'padding', type: 'BYTE', value: 0});
          }
      }

      // Table records need to be sorted alphabetically.
      recordFields.sort(function(r1, r2) {
          if (r1.value.tag > r2.value.tag) {
              return 1;
          } else {
              return -1;
          }
      });

      sfnt.fields = sfnt.fields.concat(recordFields);
      sfnt.fields = sfnt.fields.concat(tableFields);
      return sfnt;
  }

  // Get the metrics for a character. If the string has more than one character
  // this function returns metrics for the first available character.
  // You can provide optional fallback metrics if no characters are available.
  function metricsForChar(font, chars, notFoundMetrics) {
      for (var i = 0; i < chars.length; i += 1) {
          var glyphIndex = font.charToGlyphIndex(chars[i]);
          if (glyphIndex > 0) {
              var glyph = font.glyphs.get(glyphIndex);
              return glyph.getMetrics();
          }
      }

      return notFoundMetrics;
  }

  function average(vs) {
      var sum = 0;
      for (var i = 0; i < vs.length; i += 1) {
          sum += vs[i];
      }

      return sum / vs.length;
  }

  // Convert the font object to a SFNT data structure.
  // This structure contains all the necessary tables and metadata to create a binary OTF file.
  function fontToSfntTable(font) {
      var xMins = [];
      var yMins = [];
      var xMaxs = [];
      var yMaxs = [];
      var advanceWidths = [];
      var leftSideBearings = [];
      var rightSideBearings = [];
      var firstCharIndex;
      var lastCharIndex = 0;
      var ulUnicodeRange1 = 0;
      var ulUnicodeRange2 = 0;
      var ulUnicodeRange3 = 0;
      var ulUnicodeRange4 = 0;

      for (var i = 0; i < font.glyphs.length; i += 1) {
          var glyph = font.glyphs.get(i);
          var unicode = glyph.unicode | 0;

          if (isNaN(glyph.advanceWidth)) {
              throw new Error('Glyph ' + glyph.name + ' (' + i + '): advanceWidth is not a number.');
          }

          if (firstCharIndex > unicode || firstCharIndex === undefined) {
              // ignore .notdef char
              if (unicode > 0) {
                  firstCharIndex = unicode;
              }
          }

          if (lastCharIndex < unicode) {
              lastCharIndex = unicode;
          }

          var position = os2.getUnicodeRange(unicode);
          if (position < 32) {
              ulUnicodeRange1 |= 1 << position;
          } else if (position < 64) {
              ulUnicodeRange2 |= 1 << position - 32;
          } else if (position < 96) {
              ulUnicodeRange3 |= 1 << position - 64;
          } else if (position < 123) {
              ulUnicodeRange4 |= 1 << position - 96;
          } else {
              throw new Error('Unicode ranges bits > 123 are reserved for internal usage');
          }
          // Skip non-important characters.
          if (glyph.name === '.notdef') { continue; }
          var metrics = glyph.getMetrics();
          xMins.push(metrics.xMin);
          yMins.push(metrics.yMin);
          xMaxs.push(metrics.xMax);
          yMaxs.push(metrics.yMax);
          leftSideBearings.push(metrics.leftSideBearing);
          rightSideBearings.push(metrics.rightSideBearing);
          advanceWidths.push(glyph.advanceWidth);
      }

      var globals = {
          xMin: Math.min.apply(null, xMins),
          yMin: Math.min.apply(null, yMins),
          xMax: Math.max.apply(null, xMaxs),
          yMax: Math.max.apply(null, yMaxs),
          advanceWidthMax: Math.max.apply(null, advanceWidths),
          advanceWidthAvg: average(advanceWidths),
          minLeftSideBearing: Math.min.apply(null, leftSideBearings),
          maxLeftSideBearing: Math.max.apply(null, leftSideBearings),
          minRightSideBearing: Math.min.apply(null, rightSideBearings)
      };
      globals.ascender = font.ascender;
      globals.descender = font.descender;

      var headTable = head.make({
          flags: 3, // 00000011 (baseline for font at y=0; left sidebearing point at x=0)
          unitsPerEm: font.unitsPerEm,
          xMin: globals.xMin,
          yMin: globals.yMin,
          xMax: globals.xMax,
          yMax: globals.yMax,
          lowestRecPPEM: 3,
          createdTimestamp: font.createdTimestamp
      });

      var hheaTable = hhea.make({
          ascender: globals.ascender,
          descender: globals.descender,
          advanceWidthMax: globals.advanceWidthMax,
          minLeftSideBearing: globals.minLeftSideBearing,
          minRightSideBearing: globals.minRightSideBearing,
          xMaxExtent: globals.maxLeftSideBearing + (globals.xMax - globals.xMin),
          numberOfHMetrics: font.glyphs.length
      });

      var maxpTable = maxp.make(font.glyphs.length);

      var os2Table = os2.make(Object.assign({
          xAvgCharWidth: Math.round(globals.advanceWidthAvg),
          usFirstCharIndex: firstCharIndex,
          usLastCharIndex: lastCharIndex,
          ulUnicodeRange1: ulUnicodeRange1,
          ulUnicodeRange2: ulUnicodeRange2,
          ulUnicodeRange3: ulUnicodeRange3,
          ulUnicodeRange4: ulUnicodeRange4,
          // See http://typophile.com/node/13081 for more info on vertical metrics.
          // We get metrics for typical characters (such as "x" for xHeight).
          // We provide some fallback characters if characters are unavailable: their
          // ordering was chosen experimentally.
          sTypoAscender: globals.ascender,
          sTypoDescender: globals.descender,
          sTypoLineGap: 0,
          usWinAscent: globals.yMax,
          usWinDescent: Math.abs(globals.yMin),
          ulCodePageRange1: 1, // FIXME: hard-code Latin 1 support for now
          sxHeight: metricsForChar(font, 'xyvw', {yMax: Math.round(globals.ascender / 2)}).yMax,
          sCapHeight: metricsForChar(font, 'HIKLEFJMNTZBDPRAGOQSUVWXY', globals).yMax,
          usDefaultChar: font.hasChar(' ') ? 32 : 0, // Use space as the default character, if available.
          usBreakChar: font.hasChar(' ') ? 32 : 0, // Use space as the break character, if available.
      }, font.tables.os2));

      var hmtxTable = hmtx.make(font.glyphs);
      var cmapTable = cmap.make(font.glyphs);

      var englishFamilyName = font.getEnglishName('fontFamily');
      var englishStyleName = font.getEnglishName('fontSubfamily');
      var englishFullName = englishFamilyName + ' ' + englishStyleName;
      var postScriptName = font.getEnglishName('postScriptName');
      if (!postScriptName) {
          postScriptName = englishFamilyName.replace(/\s/g, '') + '-' + englishStyleName;
      }

      var names = {};
      for (var n in font.names) {
          names[n] = font.names[n];
      }

      if (!names.uniqueID) {
          names.uniqueID = {en: font.getEnglishName('manufacturer') + ':' + englishFullName};
      }

      if (!names.postScriptName) {
          names.postScriptName = {en: postScriptName};
      }

      if (!names.preferredFamily) {
          names.preferredFamily = font.names.fontFamily;
      }

      if (!names.preferredSubfamily) {
          names.preferredSubfamily = font.names.fontSubfamily;
      }

      var languageTags = [];
      var nameTable = _name.make(names, languageTags);
      var ltagTable = (languageTags.length > 0 ? ltag.make(languageTags) : undefined);

      var postTable = post.make();
      var cffTable = cff.make(font.glyphs, {
          version: font.getEnglishName('version'),
          fullName: englishFullName,
          familyName: englishFamilyName,
          weightName: englishStyleName,
          postScriptName: postScriptName,
          unitsPerEm: font.unitsPerEm,
          fontBBox: [0, globals.yMin, globals.ascender, globals.advanceWidthMax]
      });

      var metaTable = (font.metas && Object.keys(font.metas).length > 0) ? meta.make(font.metas) : undefined;

      // The order does not matter because makeSfntTable() will sort them.
      var tables = [headTable, hheaTable, maxpTable, os2Table, nameTable, cmapTable, postTable, cffTable, hmtxTable];
      if (ltagTable) {
          tables.push(ltagTable);
      }
      // Optional tables
      if (font.tables.gsub) {
          tables.push(gsub.make(font.tables.gsub));
      }
      if (metaTable) {
          tables.push(metaTable);
      }

      var sfntTable = makeSfntTable(tables);

      // Compute the font's checkSum and store it in head.checkSumAdjustment.
      var bytes = sfntTable.encode();
      var checkSum = computeCheckSum(bytes);
      var tableFields = sfntTable.fields;
      var checkSumAdjusted = false;
      for (var i$1 = 0; i$1 < tableFields.length; i$1 += 1) {
          if (tableFields[i$1].name === 'head table') {
              tableFields[i$1].value.checkSumAdjustment = 0xB1B0AFBA - checkSum;
              checkSumAdjusted = true;
              break;
          }
      }

      if (!checkSumAdjusted) {
          throw new Error('Could not find head table with checkSum to adjust.');
      }

      return sfntTable;
  }

  var sfnt = { make: makeSfntTable, fontToTable: fontToSfntTable, computeCheckSum: computeCheckSum };

  // The Layout object is the prototype of Substitution objects, and provides

  function searchTag(arr, tag) {
      /* jshint bitwise: false */
      var imin = 0;
      var imax = arr.length - 1;
      while (imin <= imax) {
          var imid = (imin + imax) >>> 1;
          var val = arr[imid].tag;
          if (val === tag) {
              return imid;
          } else if (val < tag) {
              imin = imid + 1;
          } else { imax = imid - 1; }
      }
      // Not found: return -1-insertion point
      return -imin - 1;
  }

  function binSearch(arr, value) {
      /* jshint bitwise: false */
      var imin = 0;
      var imax = arr.length - 1;
      while (imin <= imax) {
          var imid = (imin + imax) >>> 1;
          var val = arr[imid];
          if (val === value) {
              return imid;
          } else if (val < value) {
              imin = imid + 1;
          } else { imax = imid - 1; }
      }
      // Not found: return -1-insertion point
      return -imin - 1;
  }

  // binary search in a list of ranges (coverage, class definition)
  function searchRange(ranges, value) {
      // jshint bitwise: false
      var range;
      var imin = 0;
      var imax = ranges.length - 1;
      while (imin <= imax) {
          var imid = (imin + imax) >>> 1;
          range = ranges[imid];
          var start = range.start;
          if (start === value) {
              return range;
          } else if (start < value) {
              imin = imid + 1;
          } else { imax = imid - 1; }
      }
      if (imin > 0) {
          range = ranges[imin - 1];
          if (value > range.end) { return 0; }
          return range;
      }
  }

  /**
   * @exports opentype.Layout
   * @class
   */
  function Layout(font, tableName) {
      this.font = font;
      this.tableName = tableName;
  }

  Layout.prototype = {

      /**
       * Binary search an object by "tag" property
       * @instance
       * @function searchTag
       * @memberof opentype.Layout
       * @param  {Array} arr
       * @param  {string} tag
       * @return {number}
       */
      searchTag: searchTag,

      /**
       * Binary search in a list of numbers
       * @instance
       * @function binSearch
       * @memberof opentype.Layout
       * @param  {Array} arr
       * @param  {number} value
       * @return {number}
       */
      binSearch: binSearch,

      /**
       * Get or create the Layout table (GSUB, GPOS etc).
       * @param  {boolean} create - Whether to create a new one.
       * @return {Object} The GSUB or GPOS table.
       */
      getTable: function(create) {
          var layout = this.font.tables[this.tableName];
          if (!layout && create) {
              layout = this.font.tables[this.tableName] = this.createDefaultTable();
          }
          return layout;
      },

      /**
       * Returns all scripts in the substitution table.
       * @instance
       * @return {Array}
       */
      getScriptNames: function() {
          var layout = this.getTable();
          if (!layout) { return []; }
          return layout.scripts.map(function(script) {
              return script.tag;
          });
      },

      /**
       * Returns the best bet for a script name.
       * Returns 'DFLT' if it exists.
       * If not, returns 'latn' if it exists.
       * If neither exist, returns undefined.
       */
      getDefaultScriptName: function() {
          var layout = this.getTable();
          if (!layout) { return; }
          var hasLatn = false;
          for (var i = 0; i < layout.scripts.length; i++) {
              var name = layout.scripts[i].tag;
              if (name === 'DFLT') { return name; }
              if (name === 'latn') { hasLatn = true; }
          }
          if (hasLatn) { return 'latn'; }
      },

      /**
       * Returns all LangSysRecords in the given script.
       * @instance
       * @param {string} [script='DFLT']
       * @param {boolean} create - forces the creation of this script table if it doesn't exist.
       * @return {Object} An object with tag and script properties.
       */
      getScriptTable: function(script, create) {
          var layout = this.getTable(create);
          if (layout) {
              script = script || 'DFLT';
              var scripts = layout.scripts;
              var pos = searchTag(layout.scripts, script);
              if (pos >= 0) {
                  return scripts[pos].script;
              } else if (create) {
                  var scr = {
                      tag: script,
                      script: {
                          defaultLangSys: {reserved: 0, reqFeatureIndex: 0xffff, featureIndexes: []},
                          langSysRecords: []
                      }
                  };
                  scripts.splice(-1 - pos, 0, scr);
                  return scr.script;
              }
          }
      },

      /**
       * Returns a language system table
       * @instance
       * @param {string} [script='DFLT']
       * @param {string} [language='dlft']
       * @param {boolean} create - forces the creation of this langSysTable if it doesn't exist.
       * @return {Object}
       */
      getLangSysTable: function(script, language, create) {
          var scriptTable = this.getScriptTable(script, create);
          if (scriptTable) {
              if (!language || language === 'dflt' || language === 'DFLT') {
                  return scriptTable.defaultLangSys;
              }
              var pos = searchTag(scriptTable.langSysRecords, language);
              if (pos >= 0) {
                  return scriptTable.langSysRecords[pos].langSys;
              } else if (create) {
                  var langSysRecord = {
                      tag: language,
                      langSys: {reserved: 0, reqFeatureIndex: 0xffff, featureIndexes: []}
                  };
                  scriptTable.langSysRecords.splice(-1 - pos, 0, langSysRecord);
                  return langSysRecord.langSys;
              }
          }
      },

      /**
       * Get a specific feature table.
       * @instance
       * @param {string} [script='DFLT']
       * @param {string} [language='dlft']
       * @param {string} feature - One of the codes listed at https://www.microsoft.com/typography/OTSPEC/featurelist.htm
       * @param {boolean} create - forces the creation of the feature table if it doesn't exist.
       * @return {Object}
       */
      getFeatureTable: function(script, language, feature, create) {
          var langSysTable = this.getLangSysTable(script, language, create);
          if (langSysTable) {
              var featureRecord;
              var featIndexes = langSysTable.featureIndexes;
              var allFeatures = this.font.tables[this.tableName].features;
              // The FeatureIndex array of indices is in arbitrary order,
              // even if allFeatures is sorted alphabetically by feature tag.
              for (var i = 0; i < featIndexes.length; i++) {
                  featureRecord = allFeatures[featIndexes[i]];
                  if (featureRecord.tag === feature) {
                      return featureRecord.feature;
                  }
              }
              if (create) {
                  var index = allFeatures.length;
                  // Automatic ordering of features would require to shift feature indexes in the script list.
                  check.assert(index === 0 || feature >= allFeatures[index - 1].tag, 'Features must be added in alphabetical order.');
                  featureRecord = {
                      tag: feature,
                      feature: { params: 0, lookupListIndexes: [] }
                  };
                  allFeatures.push(featureRecord);
                  featIndexes.push(index);
                  return featureRecord.feature;
              }
          }
      },

      /**
       * Get the lookup tables of a given type for a script/language/feature.
       * @instance
       * @param {string} [script='DFLT']
       * @param {string} [language='dlft']
       * @param {string} feature - 4-letter feature code
       * @param {number} lookupType - 1 to 9
       * @param {boolean} create - forces the creation of the lookup table if it doesn't exist, with no subtables.
       * @return {Object[]}
       */
      getLookupTables: function(script, language, feature, lookupType, create) {
          var featureTable = this.getFeatureTable(script, language, feature, create);
          var tables = [];
          if (featureTable) {
              var lookupTable;
              var lookupListIndexes = featureTable.lookupListIndexes;
              var allLookups = this.font.tables[this.tableName].lookups;
              // lookupListIndexes are in no particular order, so use naive search.
              for (var i = 0; i < lookupListIndexes.length; i++) {
                  lookupTable = allLookups[lookupListIndexes[i]];
                  if (lookupTable.lookupType === lookupType) {
                      tables.push(lookupTable);
                  }
              }
              if (tables.length === 0 && create) {
                  lookupTable = {
                      lookupType: lookupType,
                      lookupFlag: 0,
                      subtables: [],
                      markFilteringSet: undefined
                  };
                  var index = allLookups.length;
                  allLookups.push(lookupTable);
                  lookupListIndexes.push(index);
                  return [lookupTable];
              }
          }
          return tables;
      },

      /**
       * Find a glyph in a class definition table
       * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#class-definition-table
       * @param {object} classDefTable - an OpenType Layout class definition table
       * @param {number} glyphIndex - the index of the glyph to find
       * @returns {number} -1 if not found
       */
      getGlyphClass: function(classDefTable, glyphIndex) {
          switch (classDefTable.format) {
              case 1:
                  if (classDefTable.startGlyph <= glyphIndex && glyphIndex < classDefTable.startGlyph + classDefTable.classes.length) {
                      return classDefTable.classes[glyphIndex - classDefTable.startGlyph];
                  }
                  return 0;
              case 2:
                  var range = searchRange(classDefTable.ranges, glyphIndex);
                  return range ? range.classId : 0;
          }
      },

      /**
       * Find a glyph in a coverage table
       * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#coverage-table
       * @param {object} coverageTable - an OpenType Layout coverage table
       * @param {number} glyphIndex - the index of the glyph to find
       * @returns {number} -1 if not found
       */
      getCoverageIndex: function(coverageTable, glyphIndex) {
          switch (coverageTable.format) {
              case 1:
                  var index = binSearch(coverageTable.glyphs, glyphIndex);
                  return index >= 0 ? index : -1;
              case 2:
                  var range = searchRange(coverageTable.ranges, glyphIndex);
                  return range ? range.index + glyphIndex - range.start : -1;
          }
      },

      /**
       * Returns the list of glyph indexes of a coverage table.
       * Format 1: the list is stored raw
       * Format 2: compact list as range records.
       * @instance
       * @param  {Object} coverageTable
       * @return {Array}
       */
      expandCoverage: function(coverageTable) {
          if (coverageTable.format === 1) {
              return coverageTable.glyphs;
          } else {
              var glyphs = [];
              var ranges = coverageTable.ranges;
              for (var i = 0; i < ranges.length; i++) {
                  var range = ranges[i];
                  var start = range.start;
                  var end = range.end;
                  for (var j = start; j <= end; j++) {
                      glyphs.push(j);
                  }
              }
              return glyphs;
          }
      }

  };

  // The Position object provides utility methods to manipulate

  /**
   * @exports opentype.Position
   * @class
   * @extends opentype.Layout
   * @param {opentype.Font}
   * @constructor
   */
  function Position(font) {
      Layout.call(this, font, 'gpos');
  }

  Position.prototype = Layout.prototype;

  /**
   * Init some data for faster and easier access later.
   */
  Position.prototype.init = function() {
      var script = this.getDefaultScriptName();
      this.defaultKerningTables = this.getKerningTables(script);
  };

  /**
   * Find a glyph pair in a list of lookup tables of type 2 and retrieve the xAdvance kerning value.
   *
   * @param {integer} leftIndex - left glyph index
   * @param {integer} rightIndex - right glyph index
   * @returns {integer}
   */
  Position.prototype.getKerningValue = function(kerningLookups, leftIndex, rightIndex) {
      for (var i = 0; i < kerningLookups.length; i++) {
          var subtables = kerningLookups[i].subtables;
          for (var j = 0; j < subtables.length; j++) {
              var subtable = subtables[j];
              var covIndex = this.getCoverageIndex(subtable.coverage, leftIndex);
              if (covIndex < 0) { continue; }
              switch (subtable.posFormat) {
                  case 1:
                      // Search Pair Adjustment Positioning Format 1
                      var pairSet = subtable.pairSets[covIndex];
                      for (var k = 0; k < pairSet.length; k++) {
                          var pair = pairSet[k];
                          if (pair.secondGlyph === rightIndex) {
                              return pair.value1 && pair.value1.xAdvance || 0;
                          }
                      }
                      break;      // left glyph found, not right glyph - try next subtable
                  case 2:
                      // Search Pair Adjustment Positioning Format 2
                      var class1 = this.getGlyphClass(subtable.classDef1, leftIndex);
                      var class2 = this.getGlyphClass(subtable.classDef2, rightIndex);
                      var pair$1 = subtable.classRecords[class1][class2];
                      return pair$1.value1 && pair$1.value1.xAdvance || 0;
              }
          }
      }
      return 0;
  };

  /**
   * List all kerning lookup tables.
   *
   * @param {string} [script='DFLT'] - use font.position.getDefaultScriptName() for a better default value
   * @param {string} [language='dflt']
   * @return {object[]} The list of kerning lookup tables (may be empty), or undefined if there is no GPOS table (and we should use the kern table)
   */
  Position.prototype.getKerningTables = function(script, language) {
      if (this.font.tables.gpos) {
          return this.getLookupTables(script, language, 'kern', 2);
      }
  };

  // The Substitution object provides utility methods to manipulate

  /**
   * @exports opentype.Substitution
   * @class
   * @extends opentype.Layout
   * @param {opentype.Font}
   * @constructor
   */
  function Substitution(font) {
      Layout.call(this, font, 'gsub');
  }

  // Check if 2 arrays of primitives are equal.
  function arraysEqual(ar1, ar2) {
      var n = ar1.length;
      if (n !== ar2.length) { return false; }
      for (var i = 0; i < n; i++) {
          if (ar1[i] !== ar2[i]) { return false; }
      }
      return true;
  }

  // Find the first subtable of a lookup table in a particular format.
  function getSubstFormat(lookupTable, format, defaultSubtable) {
      var subtables = lookupTable.subtables;
      for (var i = 0; i < subtables.length; i++) {
          var subtable = subtables[i];
          if (subtable.substFormat === format) {
              return subtable;
          }
      }
      if (defaultSubtable) {
          subtables.push(defaultSubtable);
          return defaultSubtable;
      }
      return undefined;
  }

  Substitution.prototype = Layout.prototype;

  /**
   * Create a default GSUB table.
   * @return {Object} gsub - The GSUB table.
   */
  Substitution.prototype.createDefaultTable = function() {
      // Generate a default empty GSUB table with just a DFLT script and dflt lang sys.
      return {
          version: 1,
          scripts: [{
              tag: 'DFLT',
              script: {
                  defaultLangSys: { reserved: 0, reqFeatureIndex: 0xffff, featureIndexes: [] },
                  langSysRecords: []
              }
          }],
          features: [],
          lookups: []
      };
  };

  /**
   * List all single substitutions (lookup type 1) for a given script, language, and feature.
   * @param {string} [script='DFLT']
   * @param {string} [language='dflt']
   * @param {string} feature - 4-character feature name ('aalt', 'salt', 'ss01'...)
   * @return {Array} substitutions - The list of substitutions.
   */
  Substitution.prototype.getSingle = function(feature, script, language) {
      var substitutions = [];
      var lookupTables = this.getLookupTables(script, language, feature, 1);
      for (var idx = 0; idx < lookupTables.length; idx++) {
          var subtables = lookupTables[idx].subtables;
          for (var i = 0; i < subtables.length; i++) {
              var subtable = subtables[i];
              var glyphs = this.expandCoverage(subtable.coverage);
              var j = (void 0);
              if (subtable.substFormat === 1) {
                  var delta = subtable.deltaGlyphId;
                  for (j = 0; j < glyphs.length; j++) {
                      var glyph = glyphs[j];
                      substitutions.push({ sub: glyph, by: glyph + delta });
                  }
              } else {
                  var substitute = subtable.substitute;
                  for (j = 0; j < glyphs.length; j++) {
                      substitutions.push({ sub: glyphs[j], by: substitute[j] });
                  }
              }
          }
      }
      return substitutions;
  };

  /**
   * List all multiple substitutions (lookup type 2) for a given script, language, and feature.
   * @param {string} [script='DFLT']
   * @param {string} [language='dflt']
   * @param {string} feature - 4-character feature name ('ccmp', 'stch')
   * @return {Array} substitutions - The list of substitutions.
   */
  Substitution.prototype.getMultiple = function(feature, script, language) {
      var substitutions = [];
      var lookupTables = this.getLookupTables(script, language, feature, 2);
      for (var idx = 0; idx < lookupTables.length; idx++) {
          var subtables = lookupTables[idx].subtables;
          for (var i = 0; i < subtables.length; i++) {
              var subtable = subtables[i];
              var glyphs = this.expandCoverage(subtable.coverage);
              var j = (void 0);

              for (j = 0; j < glyphs.length; j++) {
                  var glyph = glyphs[j];
                  var replacements = subtable.sequences[j];
                  substitutions.push({ sub: glyph, by: replacements });
              }
          }
      }
      return substitutions;
  };

  /**
   * List all alternates (lookup type 3) for a given script, language, and feature.
   * @param {string} [script='DFLT']
   * @param {string} [language='dflt']
   * @param {string} feature - 4-character feature name ('aalt', 'salt'...)
   * @return {Array} alternates - The list of alternates
   */
  Substitution.prototype.getAlternates = function(feature, script, language) {
      var alternates = [];
      var lookupTables = this.getLookupTables(script, language, feature, 3);
      for (var idx = 0; idx < lookupTables.length; idx++) {
          var subtables = lookupTables[idx].subtables;
          for (var i = 0; i < subtables.length; i++) {
              var subtable = subtables[i];
              var glyphs = this.expandCoverage(subtable.coverage);
              var alternateSets = subtable.alternateSets;
              for (var j = 0; j < glyphs.length; j++) {
                  alternates.push({ sub: glyphs[j], by: alternateSets[j] });
              }
          }
      }
      return alternates;
  };

  /**
   * List all ligatures (lookup type 4) for a given script, language, and feature.
   * The result is an array of ligature objects like { sub: [ids], by: id }
   * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
   * @param {string} [script='DFLT']
   * @param {string} [language='dflt']
   * @return {Array} ligatures - The list of ligatures.
   */
  Substitution.prototype.getLigatures = function(feature, script, language) {
      var ligatures = [];
      var lookupTables = this.getLookupTables(script, language, feature, 4);
      for (var idx = 0; idx < lookupTables.length; idx++) {
          var subtables = lookupTables[idx].subtables;
          for (var i = 0; i < subtables.length; i++) {
              var subtable = subtables[i];
              var glyphs = this.expandCoverage(subtable.coverage);
              var ligatureSets = subtable.ligatureSets;
              for (var j = 0; j < glyphs.length; j++) {
                  var startGlyph = glyphs[j];
                  var ligSet = ligatureSets[j];
                  for (var k = 0; k < ligSet.length; k++) {
                      var lig = ligSet[k];
                      ligatures.push({
                          sub: [startGlyph].concat(lig.components),
                          by: lig.ligGlyph
                      });
                  }
              }
          }
      }
      return ligatures;
  };

  /**
   * Add or modify a single substitution (lookup type 1)
   * Format 2, more flexible, is always used.
   * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
   * @param {Object} substitution - { sub: id, by: id } (format 1 is not supported)
   * @param {string} [script='DFLT']
   * @param {string} [language='dflt']
   */
  Substitution.prototype.addSingle = function(feature, substitution, script, language) {
      var lookupTable = this.getLookupTables(script, language, feature, 1, true)[0];
      var subtable = getSubstFormat(lookupTable, 2, {                // lookup type 1 subtable, format 2, coverage format 1
          substFormat: 2,
          coverage: {format: 1, glyphs: []},
          substitute: []
      });
      check.assert(subtable.coverage.format === 1, 'Single: unable to modify coverage table format ' + subtable.coverage.format);
      var coverageGlyph = substitution.sub;
      var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
      if (pos < 0) {
          pos = -1 - pos;
          subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
          subtable.substitute.splice(pos, 0, 0);
      }
      subtable.substitute[pos] = substitution.by;
  };

  /**
   * Add or modify a multiple substitution (lookup type 2)
   * @param {string} feature - 4-letter feature name ('ccmp', 'stch')
   * @param {Object} substitution - { sub: id, by: [id] } for format 2.
   * @param {string} [script='DFLT']
   * @param {string} [language='dflt']
   */
  Substitution.prototype.addMultiple = function(feature, substitution, script, language) {
      check.assert(substitution.by instanceof Array && substitution.by.length > 1, 'Multiple: "by" must be an array of two or more ids');
      var lookupTable = this.getLookupTables(script, language, feature, 2, true)[0];
      var subtable = getSubstFormat(lookupTable, 1, {                // lookup type 2 subtable, format 1, coverage format 1
          substFormat: 1,
          coverage: {format: 1, glyphs: []},
          sequences: []
      });
      check.assert(subtable.coverage.format === 1, 'Multiple: unable to modify coverage table format ' + subtable.coverage.format);
      var coverageGlyph = substitution.sub;
      var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
      if (pos < 0) {
          pos = -1 - pos;
          subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
          subtable.sequences.splice(pos, 0, 0);
      }
      subtable.sequences[pos] = substitution.by;
  };

  /**
   * Add or modify an alternate substitution (lookup type 3)
   * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
   * @param {Object} substitution - { sub: id, by: [ids] }
   * @param {string} [script='DFLT']
   * @param {string} [language='dflt']
   */
  Substitution.prototype.addAlternate = function(feature, substitution, script, language) {
      var lookupTable = this.getLookupTables(script, language, feature, 3, true)[0];
      var subtable = getSubstFormat(lookupTable, 1, {                // lookup type 3 subtable, format 1, coverage format 1
          substFormat: 1,
          coverage: {format: 1, glyphs: []},
          alternateSets: []
      });
      check.assert(subtable.coverage.format === 1, 'Alternate: unable to modify coverage table format ' + subtable.coverage.format);
      var coverageGlyph = substitution.sub;
      var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
      if (pos < 0) {
          pos = -1 - pos;
          subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
          subtable.alternateSets.splice(pos, 0, 0);
      }
      subtable.alternateSets[pos] = substitution.by;
  };

  /**
   * Add a ligature (lookup type 4)
   * Ligatures with more components must be stored ahead of those with fewer components in order to be found
   * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
   * @param {Object} ligature - { sub: [ids], by: id }
   * @param {string} [script='DFLT']
   * @param {string} [language='dflt']
   */
  Substitution.prototype.addLigature = function(feature, ligature, script, language) {
      var lookupTable = this.getLookupTables(script, language, feature, 4, true)[0];
      var subtable = lookupTable.subtables[0];
      if (!subtable) {
          subtable = {                // lookup type 4 subtable, format 1, coverage format 1
              substFormat: 1,
              coverage: { format: 1, glyphs: [] },
              ligatureSets: []
          };
          lookupTable.subtables[0] = subtable;
      }
      check.assert(subtable.coverage.format === 1, 'Ligature: unable to modify coverage table format ' + subtable.coverage.format);
      var coverageGlyph = ligature.sub[0];
      var ligComponents = ligature.sub.slice(1);
      var ligatureTable = {
          ligGlyph: ligature.by,
          components: ligComponents
      };
      var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
      if (pos >= 0) {
          // ligatureSet already exists
          var ligatureSet = subtable.ligatureSets[pos];
          for (var i = 0; i < ligatureSet.length; i++) {
              // If ligature already exists, return.
              if (arraysEqual(ligatureSet[i].components, ligComponents)) {
                  return;
              }
          }
          // ligature does not exist: add it.
          ligatureSet.push(ligatureTable);
      } else {
          // Create a new ligatureSet and add coverage for the first glyph.
          pos = -1 - pos;
          subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
          subtable.ligatureSets.splice(pos, 0, [ligatureTable]);
      }
  };

  /**
   * List all feature data for a given script and language.
   * @param {string} feature - 4-letter feature name
   * @param {string} [script='DFLT']
   * @param {string} [language='dflt']
   * @return {Array} substitutions - The list of substitutions.
   */
  Substitution.prototype.getFeature = function(feature, script, language) {
      if (/ss\d\d/.test(feature)) {
          // ss01 - ss20
          return this.getSingle(feature, script, language);
      }
      switch (feature) {
          case 'aalt':
          case 'salt':
              return this.getSingle(feature, script, language)
                      .concat(this.getAlternates(feature, script, language));
          case 'dlig':
          case 'liga':
          case 'rlig':
              return this.getLigatures(feature, script, language);
          case 'ccmp':
              return this.getMultiple(feature, script, language)
                  .concat(this.getLigatures(feature, script, language));
          case 'stch':
              return this.getMultiple(feature, script, language);
      }
      return undefined;
  };

  /**
   * Add a substitution to a feature for a given script and language.
   * @param {string} feature - 4-letter feature name
   * @param {Object} sub - the substitution to add (an object like { sub: id or [ids], by: id or [ids] })
   * @param {string} [script='DFLT']
   * @param {string} [language='dflt']
   */
  Substitution.prototype.add = function(feature, sub, script, language) {
      if (/ss\d\d/.test(feature)) {
          // ss01 - ss20
          return this.addSingle(feature, sub, script, language);
      }
      switch (feature) {
          case 'aalt':
          case 'salt':
              if (typeof sub.by === 'number') {
                  return this.addSingle(feature, sub, script, language);
              }
              return this.addAlternate(feature, sub, script, language);
          case 'dlig':
          case 'liga':
          case 'rlig':
              return this.addLigature(feature, sub, script, language);
          case 'ccmp':
              if (sub.by instanceof Array) {
                  return this.addMultiple(feature, sub, script, language);
              }
              return this.addLigature(feature, sub, script, language);
      }
      return undefined;
  };

  function isBrowser() {
      return typeof window !== 'undefined';
  }

  function nodeBufferToArrayBuffer(buffer) {
      var ab = new ArrayBuffer(buffer.length);
      var view = new Uint8Array(ab);
      for (var i = 0; i < buffer.length; ++i) {
          view[i] = buffer[i];
      }

      return ab;
  }

  function arrayBufferToNodeBuffer(ab) {
      var buffer = new Buffer(ab.byteLength);
      var view = new Uint8Array(ab);
      for (var i = 0; i < buffer.length; ++i) {
          buffer[i] = view[i];
      }

      return buffer;
  }

  function checkArgument(expression, message) {
      if (!expression) {
          throw message;
      }
  }

  // The `glyf` table describes the glyphs in TrueType outline format.

  // Parse the coordinate data for a glyph.
  function parseGlyphCoordinate(p, flag, previousValue, shortVectorBitMask, sameBitMask) {
      var v;
      if ((flag & shortVectorBitMask) > 0) {
          // The coordinate is 1 byte long.
          v = p.parseByte();
          // The `same` bit is re-used for short values to signify the sign of the value.
          if ((flag & sameBitMask) === 0) {
              v = -v;
          }

          v = previousValue + v;
      } else {
          //  The coordinate is 2 bytes long.
          // If the `same` bit is set, the coordinate is the same as the previous coordinate.
          if ((flag & sameBitMask) > 0) {
              v = previousValue;
          } else {
              // Parse the coordinate as a signed 16-bit delta value.
              v = previousValue + p.parseShort();
          }
      }

      return v;
  }

  // Parse a TrueType glyph.
  function parseGlyph(glyph, data, start) {
      var p = new parse.Parser(data, start);
      glyph.numberOfContours = p.parseShort();
      glyph._xMin = p.parseShort();
      glyph._yMin = p.parseShort();
      glyph._xMax = p.parseShort();
      glyph._yMax = p.parseShort();
      var flags;
      var flag;

      if (glyph.numberOfContours > 0) {
          // This glyph is not a composite.
          var endPointIndices = glyph.endPointIndices = [];
          for (var i = 0; i < glyph.numberOfContours; i += 1) {
              endPointIndices.push(p.parseUShort());
          }

          glyph.instructionLength = p.parseUShort();
          glyph.instructions = [];
          for (var i$1 = 0; i$1 < glyph.instructionLength; i$1 += 1) {
              glyph.instructions.push(p.parseByte());
          }

          var numberOfCoordinates = endPointIndices[endPointIndices.length - 1] + 1;
          flags = [];
          for (var i$2 = 0; i$2 < numberOfCoordinates; i$2 += 1) {
              flag = p.parseByte();
              flags.push(flag);
              // If bit 3 is set, we repeat this flag n times, where n is the next byte.
              if ((flag & 8) > 0) {
                  var repeatCount = p.parseByte();
                  for (var j = 0; j < repeatCount; j += 1) {
                      flags.push(flag);
                      i$2 += 1;
                  }
              }
          }

          check.argument(flags.length === numberOfCoordinates, 'Bad flags.');

          if (endPointIndices.length > 0) {
              var points = [];
              var point;
              // X/Y coordinates are relative to the previous point, except for the first point which is relative to 0,0.
              if (numberOfCoordinates > 0) {
                  for (var i$3 = 0; i$3 < numberOfCoordinates; i$3 += 1) {
                      flag = flags[i$3];
                      point = {};
                      point.onCurve = !!(flag & 1);
                      point.lastPointOfContour = endPointIndices.indexOf(i$3) >= 0;
                      points.push(point);
                  }

                  var px = 0;
                  for (var i$4 = 0; i$4 < numberOfCoordinates; i$4 += 1) {
                      flag = flags[i$4];
                      point = points[i$4];
                      point.x = parseGlyphCoordinate(p, flag, px, 2, 16);
                      px = point.x;
                  }

                  var py = 0;
                  for (var i$5 = 0; i$5 < numberOfCoordinates; i$5 += 1) {
                      flag = flags[i$5];
                      point = points[i$5];
                      point.y = parseGlyphCoordinate(p, flag, py, 4, 32);
                      py = point.y;
                  }
              }

              glyph.points = points;
          } else {
              glyph.points = [];
          }
      } else if (glyph.numberOfContours === 0) {
          glyph.points = [];
      } else {
          glyph.isComposite = true;
          glyph.points = [];
          glyph.components = [];
          var moreComponents = true;
          while (moreComponents) {
              flags = p.parseUShort();
              var component = {
                  glyphIndex: p.parseUShort(),
                  xScale: 1,
                  scale01: 0,
                  scale10: 0,
                  yScale: 1,
                  dx: 0,
                  dy: 0
              };
              if ((flags & 1) > 0) {
                  // The arguments are words
                  if ((flags & 2) > 0) {
                      // values are offset
                      component.dx = p.parseShort();
                      component.dy = p.parseShort();
                  } else {
                      // values are matched points
                      component.matchedPoints = [p.parseUShort(), p.parseUShort()];
                  }

              } else {
                  // The arguments are bytes
                  if ((flags & 2) > 0) {
                      // values are offset
                      component.dx = p.parseChar();
                      component.dy = p.parseChar();
                  } else {
                      // values are matched points
                      component.matchedPoints = [p.parseByte(), p.parseByte()];
                  }
              }

              if ((flags & 8) > 0) {
                  // We have a scale
                  component.xScale = component.yScale = p.parseF2Dot14();
              } else if ((flags & 64) > 0) {
                  // We have an X / Y scale
                  component.xScale = p.parseF2Dot14();
                  component.yScale = p.parseF2Dot14();
              } else if ((flags & 128) > 0) {
                  // We have a 2x2 transformation
                  component.xScale = p.parseF2Dot14();
                  component.scale01 = p.parseF2Dot14();
                  component.scale10 = p.parseF2Dot14();
                  component.yScale = p.parseF2Dot14();
              }

              glyph.components.push(component);
              moreComponents = !!(flags & 32);
          }
          if (flags & 0x100) {
              // We have instructions
              glyph.instructionLength = p.parseUShort();
              glyph.instructions = [];
              for (var i$6 = 0; i$6 < glyph.instructionLength; i$6 += 1) {
                  glyph.instructions.push(p.parseByte());
              }
          }
      }
  }

  // Transform an array of points and return a new array.
  function transformPoints(points, transform) {
      var newPoints = [];
      for (var i = 0; i < points.length; i += 1) {
          var pt = points[i];
          var newPt = {
              x: transform.xScale * pt.x + transform.scale01 * pt.y + transform.dx,
              y: transform.scale10 * pt.x + transform.yScale * pt.y + transform.dy,
              onCurve: pt.onCurve,
              lastPointOfContour: pt.lastPointOfContour
          };
          newPoints.push(newPt);
      }

      return newPoints;
  }

  function getContours(points) {
      var contours = [];
      var currentContour = [];
      for (var i = 0; i < points.length; i += 1) {
          var pt = points[i];
          currentContour.push(pt);
          if (pt.lastPointOfContour) {
              contours.push(currentContour);
              currentContour = [];
          }
      }

      check.argument(currentContour.length === 0, 'There are still points left in the current contour.');
      return contours;
  }

  // Convert the TrueType glyph outline to a Path.
  function getPath(points) {
      var p = new Path();
      if (!points) {
          return p;
      }

      var contours = getContours(points);

      for (var contourIndex = 0; contourIndex < contours.length; ++contourIndex) {
          var contour = contours[contourIndex];

          var prev = null;
          var curr = contour[contour.length - 1];
          var next = contour[0];

          if (curr.onCurve) {
              p.moveTo(curr.x, curr.y);
          } else {
              if (next.onCurve) {
                  p.moveTo(next.x, next.y);
              } else {
                  // If both first and last points are off-curve, start at their middle.
                  var start = {x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5};
                  p.moveTo(start.x, start.y);
              }
          }

          for (var i = 0; i < contour.length; ++i) {
              prev = curr;
              curr = next;
              next = contour[(i + 1) % contour.length];

              if (curr.onCurve) {
                  // This is a straight line.
                  p.lineTo(curr.x, curr.y);
              } else {
                  var next2 = next;

                  if (!prev.onCurve) {
                      ({ x: (curr.x + prev.x) * 0.5, y: (curr.y + prev.y) * 0.5 });
                  }

                  if (!next.onCurve) {
                      next2 = { x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5 };
                  }

                  p.quadraticCurveTo(curr.x, curr.y, next2.x, next2.y);
              }
          }

          p.closePath();
      }
      return p;
  }

  function buildPath(glyphs, glyph) {
      if (glyph.isComposite) {
          for (var j = 0; j < glyph.components.length; j += 1) {
              var component = glyph.components[j];
              var componentGlyph = glyphs.get(component.glyphIndex);
              // Force the ttfGlyphLoader to parse the glyph.
              componentGlyph.getPath();
              if (componentGlyph.points) {
                  var transformedPoints = (void 0);
                  if (component.matchedPoints === undefined) {
                      // component positioned by offset
                      transformedPoints = transformPoints(componentGlyph.points, component);
                  } else {
                      // component positioned by matched points
                      if ((component.matchedPoints[0] > glyph.points.length - 1) ||
                          (component.matchedPoints[1] > componentGlyph.points.length - 1)) {
                          throw Error('Matched points out of range in ' + glyph.name);
                      }
                      var firstPt = glyph.points[component.matchedPoints[0]];
                      var secondPt = componentGlyph.points[component.matchedPoints[1]];
                      var transform = {
                          xScale: component.xScale, scale01: component.scale01,
                          scale10: component.scale10, yScale: component.yScale,
                          dx: 0, dy: 0
                      };
                      secondPt = transformPoints([secondPt], transform)[0];
                      transform.dx = firstPt.x - secondPt.x;
                      transform.dy = firstPt.y - secondPt.y;
                      transformedPoints = transformPoints(componentGlyph.points, transform);
                  }
                  glyph.points = glyph.points.concat(transformedPoints);
              }
          }
      }

      return getPath(glyph.points);
  }

  function parseGlyfTableAll(data, start, loca, font) {
      var glyphs = new glyphset.GlyphSet(font);

      // The last element of the loca table is invalid.
      for (var i = 0; i < loca.length - 1; i += 1) {
          var offset = loca[i];
          var nextOffset = loca[i + 1];
          if (offset !== nextOffset) {
              glyphs.push(i, glyphset.ttfGlyphLoader(font, i, parseGlyph, data, start + offset, buildPath));
          } else {
              glyphs.push(i, glyphset.glyphLoader(font, i));
          }
      }

      return glyphs;
  }

  function parseGlyfTableOnLowMemory(data, start, loca, font) {
      var glyphs = new glyphset.GlyphSet(font);

      font._push = function(i) {
          var offset = loca[i];
          var nextOffset = loca[i + 1];
          if (offset !== nextOffset) {
              glyphs.push(i, glyphset.ttfGlyphLoader(font, i, parseGlyph, data, start + offset, buildPath));
          } else {
              glyphs.push(i, glyphset.glyphLoader(font, i));
          }
      };

      return glyphs;
  }

  // Parse all the glyphs according to the offsets from the `loca` table.
  function parseGlyfTable(data, start, loca, font, opt) {
      if (opt.lowMemory)
          { return parseGlyfTableOnLowMemory(data, start, loca, font); }
      else
          { return parseGlyfTableAll(data, start, loca, font); }
  }

  var glyf = { getPath: getPath, parse: parseGlyfTable};

  /* A TrueType font hinting interpreter.
  *
  * (c) 2017 Axel Kittenberger
  *
  * This interpreter has been implemented according to this documentation:
  * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM05/Chap5.html
  *
  * According to the documentation F24DOT6 values are used for pixels.
  * That means calculation is 1/64 pixel accurate and uses integer operations.
  * However, Javascript has floating point operations by default and only
  * those are available. One could make a case to simulate the 1/64 accuracy
  * exactly by truncating after every division operation
  * (for example with << 0) to get pixel exactly results as other TrueType
  * implementations. It may make sense since some fonts are pixel optimized
  * by hand using DELTAP instructions. The current implementation doesn't
  * and rather uses full floating point precision.
  *
  * xScale, yScale and rotation is currently ignored.
  *
  * A few non-trivial instructions are missing as I didn't encounter yet
  * a font that used them to test a possible implementation.
  *
  * Some fonts seem to use undocumented features regarding the twilight zone.
  * Only some of them are implemented as they were encountered.
  *
  * The exports.DEBUG statements are removed on the minified distribution file.
  */

  var instructionTable;
  var exec;
  var execGlyph;
  var execComponent;

  /*
  * Creates a hinting object.
  *
  * There ought to be exactly one
  * for each truetype font that is used for hinting.
  */
  function Hinting(font) {
      // the font this hinting object is for
      this.font = font;

      this.getCommands = function (hPoints) {
          return glyf.getPath(hPoints).commands;
      };

      // cached states
      this._fpgmState  =
      this._prepState  =
          undefined;

      // errorState
      // 0 ... all okay
      // 1 ... had an error in a glyf,
      //       continue working but stop spamming
      //       the console
      // 2 ... error at prep, stop hinting at this ppem
      // 3 ... error at fpeg, stop hinting for this font at all
      this._errorState = 0;
  }

  /*
  * Not rounding.
  */
  function roundOff(v) {
      return v;
  }

  /*
  * Rounding to grid.
  */
  function roundToGrid(v) {
      //Rounding in TT is supposed to "symmetrical around zero"
      return Math.sign(v) * Math.round(Math.abs(v));
  }

  /*
  * Rounding to double grid.
  */
  function roundToDoubleGrid(v) {
      return Math.sign(v) * Math.round(Math.abs(v * 2)) / 2;
  }

  /*
  * Rounding to half grid.
  */
  function roundToHalfGrid(v) {
      return Math.sign(v) * (Math.round(Math.abs(v) + 0.5) - 0.5);
  }

  /*
  * Rounding to up to grid.
  */
  function roundUpToGrid(v) {
      return Math.sign(v) * Math.ceil(Math.abs(v));
  }

  /*
  * Rounding to down to grid.
  */
  function roundDownToGrid(v) {
      return Math.sign(v) * Math.floor(Math.abs(v));
  }

  /*
  * Super rounding.
  */
  var roundSuper = function (v) {
      var period = this.srPeriod;
      var phase = this.srPhase;
      var threshold = this.srThreshold;
      var sign = 1;

      if (v < 0) {
          v = -v;
          sign = -1;
      }

      v += threshold - phase;

      v = Math.trunc(v / period) * period;

      v += phase;

      // according to http://xgridfit.sourceforge.net/round.html
      if (v < 0) { return phase * sign; }

      return v * sign;
  };

  /*
  * Unit vector of x-axis.
  */
  var xUnitVector = {
      x: 1,

      y: 0,

      axis: 'x',

      // Gets the projected distance between two points.
      // o1/o2 ... if true, respective original position is used.
      distance: function (p1, p2, o1, o2) {
          return (o1 ? p1.xo : p1.x) - (o2 ? p2.xo : p2.x);
      },

      // Moves point p so the moved position has the same relative
      // position to the moved positions of rp1 and rp2 than the
      // original positions had.
      //
      // See APPENDIX on INTERPOLATE at the bottom of this file.
      interpolate: function (p, rp1, rp2, pv) {
          var do1;
          var do2;
          var doa1;
          var doa2;
          var dm1;
          var dm2;
          var dt;

          if (!pv || pv === this) {
              do1 = p.xo - rp1.xo;
              do2 = p.xo - rp2.xo;
              dm1 = rp1.x - rp1.xo;
              dm2 = rp2.x - rp2.xo;
              doa1 = Math.abs(do1);
              doa2 = Math.abs(do2);
              dt = doa1 + doa2;

              if (dt === 0) {
                  p.x = p.xo + (dm1 + dm2) / 2;
                  return;
              }

              p.x = p.xo + (dm1 * doa2 + dm2 * doa1) / dt;
              return;
          }

          do1 = pv.distance(p, rp1, true, true);
          do2 = pv.distance(p, rp2, true, true);
          dm1 = pv.distance(rp1, rp1, false, true);
          dm2 = pv.distance(rp2, rp2, false, true);
          doa1 = Math.abs(do1);
          doa2 = Math.abs(do2);
          dt = doa1 + doa2;

          if (dt === 0) {
              xUnitVector.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
              return;
          }

          xUnitVector.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
      },

      // Slope of line normal to this
      normalSlope: Number.NEGATIVE_INFINITY,

      // Sets the point 'p' relative to point 'rp'
      // by the distance 'd'.
      //
      // See APPENDIX on SETRELATIVE at the bottom of this file.
      //
      // p   ... point to set
      // rp  ... reference point
      // d   ... distance on projection vector
      // pv  ... projection vector (undefined = this)
      // org ... if true, uses the original position of rp as reference.
      setRelative: function (p, rp, d, pv, org) {
          if (!pv || pv === this) {
              p.x = (org ? rp.xo : rp.x) + d;
              return;
          }

          var rpx = org ? rp.xo : rp.x;
          var rpy = org ? rp.yo : rp.y;
          var rpdx = rpx + d * pv.x;
          var rpdy = rpy + d * pv.y;

          p.x = rpdx + (p.y - rpdy) / pv.normalSlope;
      },

      // Slope of vector line.
      slope: 0,

      // Touches the point p.
      touch: function (p) {
          p.xTouched = true;
      },

      // Tests if a point p is touched.
      touched: function (p) {
          return p.xTouched;
      },

      // Untouches the point p.
      untouch: function (p) {
          p.xTouched = false;
      }
  };

  /*
  * Unit vector of y-axis.
  */
  var yUnitVector = {
      x: 0,

      y: 1,

      axis: 'y',

      // Gets the projected distance between two points.
      // o1/o2 ... if true, respective original position is used.
      distance: function (p1, p2, o1, o2) {
          return (o1 ? p1.yo : p1.y) - (o2 ? p2.yo : p2.y);
      },

      // Moves point p so the moved position has the same relative
      // position to the moved positions of rp1 and rp2 than the
      // original positions had.
      //
      // See APPENDIX on INTERPOLATE at the bottom of this file.
      interpolate: function (p, rp1, rp2, pv) {
          var do1;
          var do2;
          var doa1;
          var doa2;
          var dm1;
          var dm2;
          var dt;

          if (!pv || pv === this) {
              do1 = p.yo - rp1.yo;
              do2 = p.yo - rp2.yo;
              dm1 = rp1.y - rp1.yo;
              dm2 = rp2.y - rp2.yo;
              doa1 = Math.abs(do1);
              doa2 = Math.abs(do2);
              dt = doa1 + doa2;

              if (dt === 0) {
                  p.y = p.yo + (dm1 + dm2) / 2;
                  return;
              }

              p.y = p.yo + (dm1 * doa2 + dm2 * doa1) / dt;
              return;
          }

          do1 = pv.distance(p, rp1, true, true);
          do2 = pv.distance(p, rp2, true, true);
          dm1 = pv.distance(rp1, rp1, false, true);
          dm2 = pv.distance(rp2, rp2, false, true);
          doa1 = Math.abs(do1);
          doa2 = Math.abs(do2);
          dt = doa1 + doa2;

          if (dt === 0) {
              yUnitVector.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
              return;
          }

          yUnitVector.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
      },

      // Slope of line normal to this.
      normalSlope: 0,

      // Sets the point 'p' relative to point 'rp'
      // by the distance 'd'
      //
      // See APPENDIX on SETRELATIVE at the bottom of this file.
      //
      // p   ... point to set
      // rp  ... reference point
      // d   ... distance on projection vector
      // pv  ... projection vector (undefined = this)
      // org ... if true, uses the original position of rp as reference.
      setRelative: function (p, rp, d, pv, org) {
          if (!pv || pv === this) {
              p.y = (org ? rp.yo : rp.y) + d;
              return;
          }

          var rpx = org ? rp.xo : rp.x;
          var rpy = org ? rp.yo : rp.y;
          var rpdx = rpx + d * pv.x;
          var rpdy = rpy + d * pv.y;

          p.y = rpdy + pv.normalSlope * (p.x - rpdx);
      },

      // Slope of vector line.
      slope: Number.POSITIVE_INFINITY,

      // Touches the point p.
      touch: function (p) {
          p.yTouched = true;
      },

      // Tests if a point p is touched.
      touched: function (p) {
          return p.yTouched;
      },

      // Untouches the point p.
      untouch: function (p) {
          p.yTouched = false;
      }
  };

  Object.freeze(xUnitVector);
  Object.freeze(yUnitVector);

  /*
  * Creates a unit vector that is not x- or y-axis.
  */
  function UnitVector(x, y) {
      this.x = x;
      this.y = y;
      this.axis = undefined;
      this.slope = y / x;
      this.normalSlope = -x / y;
      Object.freeze(this);
  }

  /*
  * Gets the projected distance between two points.
  * o1/o2 ... if true, respective original position is used.
  */
  UnitVector.prototype.distance = function(p1, p2, o1, o2) {
      return (
          this.x * xUnitVector.distance(p1, p2, o1, o2) +
          this.y * yUnitVector.distance(p1, p2, o1, o2)
      );
  };

  /*
  * Moves point p so the moved position has the same relative
  * position to the moved positions of rp1 and rp2 than the
  * original positions had.
  *
  * See APPENDIX on INTERPOLATE at the bottom of this file.
  */
  UnitVector.prototype.interpolate = function(p, rp1, rp2, pv) {
      var dm1;
      var dm2;
      var do1;
      var do2;
      var doa1;
      var doa2;
      var dt;

      do1 = pv.distance(p, rp1, true, true);
      do2 = pv.distance(p, rp2, true, true);
      dm1 = pv.distance(rp1, rp1, false, true);
      dm2 = pv.distance(rp2, rp2, false, true);
      doa1 = Math.abs(do1);
      doa2 = Math.abs(do2);
      dt = doa1 + doa2;

      if (dt === 0) {
          this.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
          return;
      }

      this.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
  };

  /*
  * Sets the point 'p' relative to point 'rp'
  * by the distance 'd'
  *
  * See APPENDIX on SETRELATIVE at the bottom of this file.
  *
  * p   ...  point to set
  * rp  ... reference point
  * d   ... distance on projection vector
  * pv  ... projection vector (undefined = this)
  * org ... if true, uses the original position of rp as reference.
  */
  UnitVector.prototype.setRelative = function(p, rp, d, pv, org) {
      pv = pv || this;

      var rpx = org ? rp.xo : rp.x;
      var rpy = org ? rp.yo : rp.y;
      var rpdx = rpx + d * pv.x;
      var rpdy = rpy + d * pv.y;

      var pvns = pv.normalSlope;
      var fvs = this.slope;

      var px = p.x;
      var py = p.y;

      p.x = (fvs * px - pvns * rpdx + rpdy - py) / (fvs - pvns);
      p.y = fvs * (p.x - px) + py;
  };

  /*
  * Touches the point p.
  */
  UnitVector.prototype.touch = function(p) {
      p.xTouched = true;
      p.yTouched = true;
  };

  /*
  * Returns a unit vector with x/y coordinates.
  */
  function getUnitVector(x, y) {
      var d = Math.sqrt(x * x + y * y);

      x /= d;
      y /= d;

      if (x === 1 && y === 0) { return xUnitVector; }
      else if (x === 0 && y === 1) { return yUnitVector; }
      else { return new UnitVector(x, y); }
  }

  /*
  * Creates a point in the hinting engine.
  */
  function HPoint(
      x,
      y,
      lastPointOfContour,
      onCurve
  ) {
      this.x = this.xo = Math.round(x * 64) / 64; // hinted x value and original x-value
      this.y = this.yo = Math.round(y * 64) / 64; // hinted y value and original y-value

      this.lastPointOfContour = lastPointOfContour;
      this.onCurve = onCurve;
      this.prevPointOnContour = undefined;
      this.nextPointOnContour = undefined;
      this.xTouched = false;
      this.yTouched = false;

      Object.preventExtensions(this);
  }

  /*
  * Returns the next touched point on the contour.
  *
  * v  ... unit vector to test touch axis.
  */
  HPoint.prototype.nextTouched = function(v) {
      var p = this.nextPointOnContour;

      while (!v.touched(p) && p !== this) { p = p.nextPointOnContour; }

      return p;
  };

  /*
  * Returns the previous touched point on the contour
  *
  * v  ... unit vector to test touch axis.
  */
  HPoint.prototype.prevTouched = function(v) {
      var p = this.prevPointOnContour;

      while (!v.touched(p) && p !== this) { p = p.prevPointOnContour; }

      return p;
  };

  /*
  * The zero point.
  */
  var HPZero = Object.freeze(new HPoint(0, 0));

  /*
  * The default state of the interpreter.
  *
  * Note: Freezing the defaultState and then deriving from it
  * makes the V8 Javascript engine going awkward,
  * so this is avoided, albeit the defaultState shouldn't
  * ever change.
  */
  var defaultState = {
      cvCutIn: 17 / 16,    // control value cut in
      deltaBase: 9,
      deltaShift: 0.125,
      loop: 1,             // loops some instructions
      minDis: 1,           // minimum distance
      autoFlip: true
  };

  /*
  * The current state of the interpreter.
  *
  * env  ... 'fpgm' or 'prep' or 'glyf'
  * prog ... the program
  */
  function State(env, prog) {
      this.env = env;
      this.stack = [];
      this.prog = prog;

      switch (env) {
          case 'glyf' :
              this.zp0 = this.zp1 = this.zp2 = 1;
              this.rp0 = this.rp1 = this.rp2 = 0;
              /* fall through */
          case 'prep' :
              this.fv = this.pv = this.dpv = xUnitVector;
              this.round = roundToGrid;
      }
  }

  /*
  * Executes a glyph program.
  *
  * This does the hinting for each glyph.
  *
  * Returns an array of moved points.
  *
  * glyph: the glyph to hint
  * ppem: the size the glyph is rendered for
  */
  Hinting.prototype.exec = function(glyph, ppem) {
      if (typeof ppem !== 'number') {
          throw new Error('Point size is not a number!');
      }

      // Received a fatal error, don't do any hinting anymore.
      if (this._errorState > 2) { return; }

      var font = this.font;
      var prepState = this._prepState;

      if (!prepState || prepState.ppem !== ppem) {
          var fpgmState = this._fpgmState;

          if (!fpgmState) {
              // Executes the fpgm state.
              // This is used by fonts to define functions.
              State.prototype = defaultState;

              fpgmState =
              this._fpgmState =
                  new State('fpgm', font.tables.fpgm);

              fpgmState.funcs = [ ];
              fpgmState.font = font;

              if (exports.DEBUG) {
                  console.log('---EXEC FPGM---');
                  fpgmState.step = -1;
              }

              try {
                  exec(fpgmState);
              } catch (e) {
                  console.log('Hinting error in FPGM:' + e);
                  this._errorState = 3;
                  return;
              }
          }

          // Executes the prep program for this ppem setting.
          // This is used by fonts to set cvt values
          // depending on to be rendered font size.

          State.prototype = fpgmState;
          prepState =
          this._prepState =
              new State('prep', font.tables.prep);

          prepState.ppem = ppem;

          // Creates a copy of the cvt table
          // and scales it to the current ppem setting.
          var oCvt = font.tables.cvt;
          if (oCvt) {
              var cvt = prepState.cvt = new Array(oCvt.length);
              var scale = ppem / font.unitsPerEm;
              for (var c = 0; c < oCvt.length; c++) {
                  cvt[c] = oCvt[c] * scale;
              }
          } else {
              prepState.cvt = [];
          }

          if (exports.DEBUG) {
              console.log('---EXEC PREP---');
              prepState.step = -1;
          }

          try {
              exec(prepState);
          } catch (e) {
              if (this._errorState < 2) {
                  console.log('Hinting error in PREP:' + e);
              }
              this._errorState = 2;
          }
      }

      if (this._errorState > 1) { return; }

      try {
          return execGlyph(glyph, prepState);
      } catch (e) {
          if (this._errorState < 1) {
              console.log('Hinting error:' + e);
              console.log('Note: further hinting errors are silenced');
          }
          this._errorState = 1;
          return undefined;
      }
  };

  /*
  * Executes the hinting program for a glyph.
  */
  execGlyph = function(glyph, prepState) {
      // original point positions
      var xScale = prepState.ppem / prepState.font.unitsPerEm;
      var yScale = xScale;
      var components = glyph.components;
      var contours;
      var gZone;
      var state;

      State.prototype = prepState;
      if (!components) {
          state = new State('glyf', glyph.instructions);
          if (exports.DEBUG) {
              console.log('---EXEC GLYPH---');
              state.step = -1;
          }
          execComponent(glyph, state, xScale, yScale);
          gZone = state.gZone;
      } else {
          var font = prepState.font;
          gZone = [];
          contours = [];
          for (var i = 0; i < components.length; i++) {
              var c = components[i];
              var cg = font.glyphs.get(c.glyphIndex);

              state = new State('glyf', cg.instructions);

              if (exports.DEBUG) {
                  console.log('---EXEC COMP ' + i + '---');
                  state.step = -1;
              }

              execComponent(cg, state, xScale, yScale);
              // appends the computed points to the result array
              // post processes the component points
              var dx = Math.round(c.dx * xScale);
              var dy = Math.round(c.dy * yScale);
              var gz = state.gZone;
              var cc = state.contours;
              for (var pi = 0; pi < gz.length; pi++) {
                  var p = gz[pi];
                  p.xTouched = p.yTouched = false;
                  p.xo = p.x = p.x + dx;
                  p.yo = p.y = p.y + dy;
              }

              var gLen = gZone.length;
              gZone.push.apply(gZone, gz);
              for (var j = 0; j < cc.length; j++) {
                  contours.push(cc[j] + gLen);
              }
          }

          if (glyph.instructions && !state.inhibitGridFit) {
              // the composite has instructions on its own
              state = new State('glyf', glyph.instructions);

              state.gZone = state.z0 = state.z1 = state.z2 = gZone;

              state.contours = contours;

              // note: HPZero cannot be used here, since
              //       the point might be modified
              gZone.push(
                  new HPoint(0, 0),
                  new HPoint(Math.round(glyph.advanceWidth * xScale), 0)
              );

              if (exports.DEBUG) {
                  console.log('---EXEC COMPOSITE---');
                  state.step = -1;
              }

              exec(state);

              gZone.length -= 2;
          }
      }

      return gZone;
  };

  /*
  * Executes the hinting program for a component of a multi-component glyph
  * or of the glyph itself for a non-component glyph.
  */
  execComponent = function(glyph, state, xScale, yScale)
  {
      var points = glyph.points || [];
      var pLen = points.length;
      var gZone = state.gZone = state.z0 = state.z1 = state.z2 = [];
      var contours = state.contours = [];

      // Scales the original points and
      // makes copies for the hinted points.
      var cp; // current point
      for (var i = 0; i < pLen; i++) {
          cp = points[i];

          gZone[i] = new HPoint(
              cp.x * xScale,
              cp.y * yScale,
              cp.lastPointOfContour,
              cp.onCurve
          );
      }

      // Chain links the contours.
      var sp; // start point
      var np; // next point

      for (var i$1 = 0; i$1 < pLen; i$1++) {
          cp = gZone[i$1];

          if (!sp) {
              sp = cp;
              contours.push(i$1);
          }

          if (cp.lastPointOfContour) {
              cp.nextPointOnContour = sp;
              sp.prevPointOnContour = cp;
              sp = undefined;
          } else {
              np = gZone[i$1 + 1];
              cp.nextPointOnContour = np;
              np.prevPointOnContour = cp;
          }
      }

      if (state.inhibitGridFit) { return; }

      if (exports.DEBUG) {
          console.log('PROCESSING GLYPH', state.stack);
          for (var i$2 = 0; i$2 < pLen; i$2++) {
              console.log(i$2, gZone[i$2].x, gZone[i$2].y);
          }
      }

      gZone.push(
          new HPoint(0, 0),
          new HPoint(Math.round(glyph.advanceWidth * xScale), 0)
      );

      exec(state);

      // Removes the extra points.
      gZone.length -= 2;

      if (exports.DEBUG) {
          console.log('FINISHED GLYPH', state.stack);
          for (var i$3 = 0; i$3 < pLen; i$3++) {
              console.log(i$3, gZone[i$3].x, gZone[i$3].y);
          }
      }
  };

  /*
  * Executes the program loaded in state.
  */
  exec = function(state) {
      var prog = state.prog;

      if (!prog) { return; }

      var pLen = prog.length;
      var ins;

      for (state.ip = 0; state.ip < pLen; state.ip++) {
          if (exports.DEBUG) { state.step++; }
          ins = instructionTable[prog[state.ip]];

          if (!ins) {
              throw new Error(
                  'unknown instruction: 0x' +
                  Number(prog[state.ip]).toString(16)
              );
          }

          ins(state);

          // very extensive debugging for each step
          /*
          if (exports.DEBUG) {
              var da;
              if (state.gZone) {
                  da = [];
                  for (let i = 0; i < state.gZone.length; i++)
                  {
                      da.push(i + ' ' +
                          state.gZone[i].x * 64 + ' ' +
                          state.gZone[i].y * 64 + ' ' +
                          (state.gZone[i].xTouched ? 'x' : '') +
                          (state.gZone[i].yTouched ? 'y' : '')
                      );
                  }
                  console.log('GZ', da);
              }

              if (state.tZone) {
                  da = [];
                  for (let i = 0; i < state.tZone.length; i++) {
                      da.push(i + ' ' +
                          state.tZone[i].x * 64 + ' ' +
                          state.tZone[i].y * 64 + ' ' +
                          (state.tZone[i].xTouched ? 'x' : '') +
                          (state.tZone[i].yTouched ? 'y' : '')
                      );
                  }
                  console.log('TZ', da);
              }

              if (state.stack.length > 10) {
                  console.log(
                      state.stack.length,
                      '...', state.stack.slice(state.stack.length - 10)
                  );
              } else {
                  console.log(state.stack.length, state.stack);
              }
          }
          */
      }
  };

  /*
  * Initializes the twilight zone.
  *
  * This is only done if a SZPx instruction
  * refers to the twilight zone.
  */
  function initTZone(state)
  {
      var tZone = state.tZone = new Array(state.gZone.length);

      // no idea if this is actually correct...
      for (var i = 0; i < tZone.length; i++)
      {
          tZone[i] = new HPoint(0, 0);
      }
  }

  /*
  * Skips the instruction pointer ahead over an IF/ELSE block.
  * handleElse .. if true breaks on matching ELSE
  */
  function skip(state, handleElse)
  {
      var prog = state.prog;
      var ip = state.ip;
      var nesting = 1;
      var ins;

      do {
          ins = prog[++ip];
          if (ins === 0x58) // IF
              { nesting++; }
          else if (ins === 0x59) // EIF
              { nesting--; }
          else if (ins === 0x40) // NPUSHB
              { ip += prog[ip + 1] + 1; }
          else if (ins === 0x41) // NPUSHW
              { ip += 2 * prog[ip + 1] + 1; }
          else if (ins >= 0xB0 && ins <= 0xB7) // PUSHB
              { ip += ins - 0xB0 + 1; }
          else if (ins >= 0xB8 && ins <= 0xBF) // PUSHW
              { ip += (ins - 0xB8 + 1) * 2; }
          else if (handleElse && nesting === 1 && ins === 0x1B) // ELSE
              { break; }
      } while (nesting > 0);

      state.ip = ip;
  }

  /*----------------------------------------------------------*
  *          And then a lot of instructions...                *
  *----------------------------------------------------------*/

  // SVTCA[a] Set freedom and projection Vectors To Coordinate Axis
  // 0x00-0x01
  function SVTCA(v, state) {
      if (exports.DEBUG) { console.log(state.step, 'SVTCA[' + v.axis + ']'); }

      state.fv = state.pv = state.dpv = v;
  }

  // SPVTCA[a] Set Projection Vector to Coordinate Axis
  // 0x02-0x03
  function SPVTCA(v, state) {
      if (exports.DEBUG) { console.log(state.step, 'SPVTCA[' + v.axis + ']'); }

      state.pv = state.dpv = v;
  }

  // SFVTCA[a] Set Freedom Vector to Coordinate Axis
  // 0x04-0x05
  function SFVTCA(v, state) {
      if (exports.DEBUG) { console.log(state.step, 'SFVTCA[' + v.axis + ']'); }

      state.fv = v;
  }

  // SPVTL[a] Set Projection Vector To Line
  // 0x06-0x07
  function SPVTL(a, state) {
      var stack = state.stack;
      var p2i = stack.pop();
      var p1i = stack.pop();
      var p2 = state.z2[p2i];
      var p1 = state.z1[p1i];

      if (exports.DEBUG) { console.log('SPVTL[' + a + ']', p2i, p1i); }

      var dx;
      var dy;

      if (!a) {
          dx = p1.x - p2.x;
          dy = p1.y - p2.y;
      } else {
          dx = p2.y - p1.y;
          dy = p1.x - p2.x;
      }

      state.pv = state.dpv = getUnitVector(dx, dy);
  }

  // SFVTL[a] Set Freedom Vector To Line
  // 0x08-0x09
  function SFVTL(a, state) {
      var stack = state.stack;
      var p2i = stack.pop();
      var p1i = stack.pop();
      var p2 = state.z2[p2i];
      var p1 = state.z1[p1i];

      if (exports.DEBUG) { console.log('SFVTL[' + a + ']', p2i, p1i); }

      var dx;
      var dy;

      if (!a) {
          dx = p1.x - p2.x;
          dy = p1.y - p2.y;
      } else {
          dx = p2.y - p1.y;
          dy = p1.x - p2.x;
      }

      state.fv = getUnitVector(dx, dy);
  }

  // SPVFS[] Set Projection Vector From Stack
  // 0x0A
  function SPVFS(state) {
      var stack = state.stack;
      var y = stack.pop();
      var x = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SPVFS[]', y, x); }

      state.pv = state.dpv = getUnitVector(x, y);
  }

  // SFVFS[] Set Freedom Vector From Stack
  // 0x0B
  function SFVFS(state) {
      var stack = state.stack;
      var y = stack.pop();
      var x = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SPVFS[]', y, x); }

      state.fv = getUnitVector(x, y);
  }

  // GPV[] Get Projection Vector
  // 0x0C
  function GPV(state) {
      var stack = state.stack;
      var pv = state.pv;

      if (exports.DEBUG) { console.log(state.step, 'GPV[]'); }

      stack.push(pv.x * 0x4000);
      stack.push(pv.y * 0x4000);
  }

  // GFV[] Get Freedom Vector
  // 0x0C
  function GFV(state) {
      var stack = state.stack;
      var fv = state.fv;

      if (exports.DEBUG) { console.log(state.step, 'GFV[]'); }

      stack.push(fv.x * 0x4000);
      stack.push(fv.y * 0x4000);
  }

  // SFVTPV[] Set Freedom Vector To Projection Vector
  // 0x0E
  function SFVTPV(state) {
      state.fv = state.pv;

      if (exports.DEBUG) { console.log(state.step, 'SFVTPV[]'); }
  }

  // ISECT[] moves point p to the InterSECTion of two lines
  // 0x0F
  function ISECT(state)
  {
      var stack = state.stack;
      var pa0i = stack.pop();
      var pa1i = stack.pop();
      var pb0i = stack.pop();
      var pb1i = stack.pop();
      var pi = stack.pop();
      var z0 = state.z0;
      var z1 = state.z1;
      var pa0 = z0[pa0i];
      var pa1 = z0[pa1i];
      var pb0 = z1[pb0i];
      var pb1 = z1[pb1i];
      var p = state.z2[pi];

      if (exports.DEBUG) { console.log('ISECT[], ', pa0i, pa1i, pb0i, pb1i, pi); }

      // math from
      // en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line

      var x1 = pa0.x;
      var y1 = pa0.y;
      var x2 = pa1.x;
      var y2 = pa1.y;
      var x3 = pb0.x;
      var y3 = pb0.y;
      var x4 = pb1.x;
      var y4 = pb1.y;

      var div = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
      var f1 = x1 * y2 - y1 * x2;
      var f2 = x3 * y4 - y3 * x4;

      p.x = (f1 * (x3 - x4) - f2 * (x1 - x2)) / div;
      p.y = (f1 * (y3 - y4) - f2 * (y1 - y2)) / div;
  }

  // SRP0[] Set Reference Point 0
  // 0x10
  function SRP0(state) {
      state.rp0 = state.stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SRP0[]', state.rp0); }
  }

  // SRP1[] Set Reference Point 1
  // 0x11
  function SRP1(state) {
      state.rp1 = state.stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SRP1[]', state.rp1); }
  }

  // SRP1[] Set Reference Point 2
  // 0x12
  function SRP2(state) {
      state.rp2 = state.stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SRP2[]', state.rp2); }
  }

  // SZP0[] Set Zone Pointer 0
  // 0x13
  function SZP0(state) {
      var n = state.stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SZP0[]', n); }

      state.zp0 = n;

      switch (n) {
          case 0:
              if (!state.tZone) { initTZone(state); }
              state.z0 = state.tZone;
              break;
          case 1 :
              state.z0 = state.gZone;
              break;
          default :
              throw new Error('Invalid zone pointer');
      }
  }

  // SZP1[] Set Zone Pointer 1
  // 0x14
  function SZP1(state) {
      var n = state.stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SZP1[]', n); }

      state.zp1 = n;

      switch (n) {
          case 0:
              if (!state.tZone) { initTZone(state); }
              state.z1 = state.tZone;
              break;
          case 1 :
              state.z1 = state.gZone;
              break;
          default :
              throw new Error('Invalid zone pointer');
      }
  }

  // SZP2[] Set Zone Pointer 2
  // 0x15
  function SZP2(state) {
      var n = state.stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SZP2[]', n); }

      state.zp2 = n;

      switch (n) {
          case 0:
              if (!state.tZone) { initTZone(state); }
              state.z2 = state.tZone;
              break;
          case 1 :
              state.z2 = state.gZone;
              break;
          default :
              throw new Error('Invalid zone pointer');
      }
  }

  // SZPS[] Set Zone PointerS
  // 0x16
  function SZPS(state) {
      var n = state.stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SZPS[]', n); }

      state.zp0 = state.zp1 = state.zp2 = n;

      switch (n) {
          case 0:
              if (!state.tZone) { initTZone(state); }
              state.z0 = state.z1 = state.z2 = state.tZone;
              break;
          case 1 :
              state.z0 = state.z1 = state.z2 = state.gZone;
              break;
          default :
              throw new Error('Invalid zone pointer');
      }
  }

  // SLOOP[] Set LOOP variable
  // 0x17
  function SLOOP(state) {
      state.loop = state.stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SLOOP[]', state.loop); }
  }

  // RTG[] Round To Grid
  // 0x18
  function RTG(state) {
      if (exports.DEBUG) { console.log(state.step, 'RTG[]'); }

      state.round = roundToGrid;
  }

  // RTHG[] Round To Half Grid
  // 0x19
  function RTHG(state) {
      if (exports.DEBUG) { console.log(state.step, 'RTHG[]'); }

      state.round = roundToHalfGrid;
  }

  // SMD[] Set Minimum Distance
  // 0x1A
  function SMD(state) {
      var d = state.stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SMD[]', d); }

      state.minDis = d / 0x40;
  }

  // ELSE[] ELSE clause
  // 0x1B
  function ELSE(state) {
      // This instruction has been reached by executing a then branch
      // so it just skips ahead until matching EIF.
      //
      // In case the IF was negative the IF[] instruction already
      // skipped forward over the ELSE[]

      if (exports.DEBUG) { console.log(state.step, 'ELSE[]'); }

      skip(state, false);
  }

  // JMPR[] JuMP Relative
  // 0x1C
  function JMPR(state) {
      var o = state.stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'JMPR[]', o); }

      // A jump by 1 would do nothing.
      state.ip += o - 1;
  }

  // SCVTCI[] Set Control Value Table Cut-In
  // 0x1D
  function SCVTCI(state) {
      var n = state.stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SCVTCI[]', n); }

      state.cvCutIn = n / 0x40;
  }

  // DUP[] DUPlicate top stack element
  // 0x20
  function DUP(state) {
      var stack = state.stack;

      if (exports.DEBUG) { console.log(state.step, 'DUP[]'); }

      stack.push(stack[stack.length - 1]);
  }

  // POP[] POP top stack element
  // 0x21
  function POP(state) {
      if (exports.DEBUG) { console.log(state.step, 'POP[]'); }

      state.stack.pop();
  }

  // CLEAR[] CLEAR the stack
  // 0x22
  function CLEAR(state) {
      if (exports.DEBUG) { console.log(state.step, 'CLEAR[]'); }

      state.stack.length = 0;
  }

  // SWAP[] SWAP the top two elements on the stack
  // 0x23
  function SWAP(state) {
      var stack = state.stack;

      var a = stack.pop();
      var b = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SWAP[]'); }

      stack.push(a);
      stack.push(b);
  }

  // DEPTH[] DEPTH of the stack
  // 0x24
  function DEPTH(state) {
      var stack = state.stack;

      if (exports.DEBUG) { console.log(state.step, 'DEPTH[]'); }

      stack.push(stack.length);
  }

  // LOOPCALL[] LOOPCALL function
  // 0x2A
  function LOOPCALL(state) {
      var stack = state.stack;
      var fn = stack.pop();
      var c = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'LOOPCALL[]', fn, c); }

      // saves callers program
      var cip = state.ip;
      var cprog = state.prog;

      state.prog = state.funcs[fn];

      // executes the function
      for (var i = 0; i < c; i++) {
          exec(state);

          if (exports.DEBUG) { console.log(
              ++state.step,
              i + 1 < c ? 'next loopcall' : 'done loopcall',
              i
          ); }
      }

      // restores the callers program
      state.ip = cip;
      state.prog = cprog;
  }

  // CALL[] CALL function
  // 0x2B
  function CALL(state) {
      var fn = state.stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'CALL[]', fn); }

      // saves callers program
      var cip = state.ip;
      var cprog = state.prog;

      state.prog = state.funcs[fn];

      // executes the function
      exec(state);

      // restores the callers program
      state.ip = cip;
      state.prog = cprog;

      if (exports.DEBUG) { console.log(++state.step, 'returning from', fn); }
  }

  // CINDEX[] Copy the INDEXed element to the top of the stack
  // 0x25
  function CINDEX(state) {
      var stack = state.stack;
      var k = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'CINDEX[]', k); }

      // In case of k == 1, it copies the last element after popping
      // thus stack.length - k.
      stack.push(stack[stack.length - k]);
  }

  // MINDEX[] Move the INDEXed element to the top of the stack
  // 0x26
  function MINDEX(state) {
      var stack = state.stack;
      var k = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'MINDEX[]', k); }

      stack.push(stack.splice(stack.length - k, 1)[0]);
  }

  // FDEF[] Function DEFinition
  // 0x2C
  function FDEF(state) {
      if (state.env !== 'fpgm') { throw new Error('FDEF not allowed here'); }
      var stack = state.stack;
      var prog = state.prog;
      var ip = state.ip;

      var fn = stack.pop();
      var ipBegin = ip;

      if (exports.DEBUG) { console.log(state.step, 'FDEF[]', fn); }

      while (prog[++ip] !== 0x2D){ }

      state.ip = ip;
      state.funcs[fn] = prog.slice(ipBegin + 1, ip);
  }

  // MDAP[a] Move Direct Absolute Point
  // 0x2E-0x2F
  function MDAP(round, state) {
      var pi = state.stack.pop();
      var p = state.z0[pi];
      var fv = state.fv;
      var pv = state.pv;

      if (exports.DEBUG) { console.log(state.step, 'MDAP[' + round + ']', pi); }

      var d = pv.distance(p, HPZero);

      if (round) { d = state.round(d); }

      fv.setRelative(p, HPZero, d, pv);
      fv.touch(p);

      state.rp0 = state.rp1 = pi;
  }

  // IUP[a] Interpolate Untouched Points through the outline
  // 0x30
  function IUP(v, state) {
      var z2 = state.z2;
      var pLen = z2.length - 2;
      var cp;
      var pp;
      var np;

      if (exports.DEBUG) { console.log(state.step, 'IUP[' + v.axis + ']'); }

      for (var i = 0; i < pLen; i++) {
          cp = z2[i]; // current point

          // if this point has been touched go on
          if (v.touched(cp)) { continue; }

          pp = cp.prevTouched(v);

          // no point on the contour has been touched?
          if (pp === cp) { continue; }

          np = cp.nextTouched(v);

          if (pp === np) {
              // only one point on the contour has been touched
              // so simply moves the point like that

              v.setRelative(cp, cp, v.distance(pp, pp, false, true), v, true);
          }

          v.interpolate(cp, pp, np, v);
      }
  }

  // SHP[] SHift Point using reference point
  // 0x32-0x33
  function SHP(a, state) {
      var stack = state.stack;
      var rpi = a ? state.rp1 : state.rp2;
      var rp = (a ? state.z0 : state.z1)[rpi];
      var fv = state.fv;
      var pv = state.pv;
      var loop = state.loop;
      var z2 = state.z2;

      while (loop--)
      {
          var pi = stack.pop();
          var p = z2[pi];

          var d = pv.distance(rp, rp, false, true);
          fv.setRelative(p, p, d, pv);
          fv.touch(p);

          if (exports.DEBUG) {
              console.log(
                  state.step,
                  (state.loop > 1 ?
                     'loop ' + (state.loop - loop) + ': ' :
                     ''
                  ) +
                  'SHP[' + (a ? 'rp1' : 'rp2') + ']', pi
              );
          }
      }

      state.loop = 1;
  }

  // SHC[] SHift Contour using reference point
  // 0x36-0x37
  function SHC(a, state) {
      var stack = state.stack;
      var rpi = a ? state.rp1 : state.rp2;
      var rp = (a ? state.z0 : state.z1)[rpi];
      var fv = state.fv;
      var pv = state.pv;
      var ci = stack.pop();
      var sp = state.z2[state.contours[ci]];
      var p = sp;

      if (exports.DEBUG) { console.log(state.step, 'SHC[' + a + ']', ci); }

      var d = pv.distance(rp, rp, false, true);

      do {
          if (p !== rp) { fv.setRelative(p, p, d, pv); }
          p = p.nextPointOnContour;
      } while (p !== sp);
  }

  // SHZ[] SHift Zone using reference point
  // 0x36-0x37
  function SHZ(a, state) {
      var stack = state.stack;
      var rpi = a ? state.rp1 : state.rp2;
      var rp = (a ? state.z0 : state.z1)[rpi];
      var fv = state.fv;
      var pv = state.pv;

      var e = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SHZ[' + a + ']', e); }

      var z;
      switch (e) {
          case 0 : z = state.tZone; break;
          case 1 : z = state.gZone; break;
          default : throw new Error('Invalid zone');
      }

      var p;
      var d = pv.distance(rp, rp, false, true);
      var pLen = z.length - 2;
      for (var i = 0; i < pLen; i++)
      {
          p = z[i];
          fv.setRelative(p, p, d, pv);
          //if (p !== rp) fv.setRelative(p, p, d, pv);
      }
  }

  // SHPIX[] SHift point by a PIXel amount
  // 0x38
  function SHPIX(state) {
      var stack = state.stack;
      var loop = state.loop;
      var fv = state.fv;
      var d = stack.pop() / 0x40;
      var z2 = state.z2;

      while (loop--) {
          var pi = stack.pop();
          var p = z2[pi];

          if (exports.DEBUG) {
              console.log(
                  state.step,
                  (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') +
                  'SHPIX[]', pi, d
              );
          }

          fv.setRelative(p, p, d);
          fv.touch(p);
      }

      state.loop = 1;
  }

  // IP[] Interpolate Point
  // 0x39
  function IP(state) {
      var stack = state.stack;
      var rp1i = state.rp1;
      var rp2i = state.rp2;
      var loop = state.loop;
      var rp1 = state.z0[rp1i];
      var rp2 = state.z1[rp2i];
      var fv = state.fv;
      var pv = state.dpv;
      var z2 = state.z2;

      while (loop--) {
          var pi = stack.pop();
          var p = z2[pi];

          if (exports.DEBUG) {
              console.log(
                  state.step,
                  (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') +
                  'IP[]', pi, rp1i, '<->', rp2i
              );
          }

          fv.interpolate(p, rp1, rp2, pv);

          fv.touch(p);
      }

      state.loop = 1;
  }

  // MSIRP[a] Move Stack Indirect Relative Point
  // 0x3A-0x3B
  function MSIRP(a, state) {
      var stack = state.stack;
      var d = stack.pop() / 64;
      var pi = stack.pop();
      var p = state.z1[pi];
      var rp0 = state.z0[state.rp0];
      var fv = state.fv;
      var pv = state.pv;

      fv.setRelative(p, rp0, d, pv);
      fv.touch(p);

      if (exports.DEBUG) { console.log(state.step, 'MSIRP[' + a + ']', d, pi); }

      state.rp1 = state.rp0;
      state.rp2 = pi;
      if (a) { state.rp0 = pi; }
  }

  // ALIGNRP[] Align to reference point.
  // 0x3C
  function ALIGNRP(state) {
      var stack = state.stack;
      var rp0i = state.rp0;
      var rp0 = state.z0[rp0i];
      var loop = state.loop;
      var fv = state.fv;
      var pv = state.pv;
      var z1 = state.z1;

      while (loop--) {
          var pi = stack.pop();
          var p = z1[pi];

          if (exports.DEBUG) {
              console.log(
                  state.step,
                  (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') +
                  'ALIGNRP[]', pi
              );
          }

          fv.setRelative(p, rp0, 0, pv);
          fv.touch(p);
      }

      state.loop = 1;
  }

  // RTG[] Round To Double Grid
  // 0x3D
  function RTDG(state) {
      if (exports.DEBUG) { console.log(state.step, 'RTDG[]'); }

      state.round = roundToDoubleGrid;
  }

  // MIAP[a] Move Indirect Absolute Point
  // 0x3E-0x3F
  function MIAP(round, state) {
      var stack = state.stack;
      var n = stack.pop();
      var pi = stack.pop();
      var p = state.z0[pi];
      var fv = state.fv;
      var pv = state.pv;
      var cv = state.cvt[n];

      if (exports.DEBUG) {
          console.log(
              state.step,
              'MIAP[' + round + ']',
              n, '(', cv, ')', pi
          );
      }

      var d = pv.distance(p, HPZero);

      if (round) {
          if (Math.abs(d - cv) < state.cvCutIn) { d = cv; }

          d = state.round(d);
      }

      fv.setRelative(p, HPZero, d, pv);

      if (state.zp0 === 0) {
          p.xo = p.x;
          p.yo = p.y;
      }

      fv.touch(p);

      state.rp0 = state.rp1 = pi;
  }

  // NPUSB[] PUSH N Bytes
  // 0x40
  function NPUSHB(state) {
      var prog = state.prog;
      var ip = state.ip;
      var stack = state.stack;

      var n = prog[++ip];

      if (exports.DEBUG) { console.log(state.step, 'NPUSHB[]', n); }

      for (var i = 0; i < n; i++) { stack.push(prog[++ip]); }

      state.ip = ip;
  }

  // NPUSHW[] PUSH N Words
  // 0x41
  function NPUSHW(state) {
      var ip = state.ip;
      var prog = state.prog;
      var stack = state.stack;
      var n = prog[++ip];

      if (exports.DEBUG) { console.log(state.step, 'NPUSHW[]', n); }

      for (var i = 0; i < n; i++) {
          var w = (prog[++ip] << 8) | prog[++ip];
          if (w & 0x8000) { w = -((w ^ 0xffff) + 1); }
          stack.push(w);
      }

      state.ip = ip;
  }

  // WS[] Write Store
  // 0x42
  function WS(state) {
      var stack = state.stack;
      var store = state.store;

      if (!store) { store = state.store = []; }

      var v = stack.pop();
      var l = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'WS', v, l); }

      store[l] = v;
  }

  // RS[] Read Store
  // 0x43
  function RS(state) {
      var stack = state.stack;
      var store = state.store;

      var l = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'RS', l); }

      var v = (store && store[l]) || 0;

      stack.push(v);
  }

  // WCVTP[] Write Control Value Table in Pixel units
  // 0x44
  function WCVTP(state) {
      var stack = state.stack;

      var v = stack.pop();
      var l = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'WCVTP', v, l); }

      state.cvt[l] = v / 0x40;
  }

  // RCVT[] Read Control Value Table entry
  // 0x45
  function RCVT(state) {
      var stack = state.stack;
      var cvte = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'RCVT', cvte); }

      stack.push(state.cvt[cvte] * 0x40);
  }

  // GC[] Get Coordinate projected onto the projection vector
  // 0x46-0x47
  function GC(a, state) {
      var stack = state.stack;
      var pi = stack.pop();
      var p = state.z2[pi];

      if (exports.DEBUG) { console.log(state.step, 'GC[' + a + ']', pi); }

      stack.push(state.dpv.distance(p, HPZero, a, false) * 0x40);
  }

  // MD[a] Measure Distance
  // 0x49-0x4A
  function MD(a, state) {
      var stack = state.stack;
      var pi2 = stack.pop();
      var pi1 = stack.pop();
      var p2 = state.z1[pi2];
      var p1 = state.z0[pi1];
      var d = state.dpv.distance(p1, p2, a, a);

      if (exports.DEBUG) { console.log(state.step, 'MD[' + a + ']', pi2, pi1, '->', d); }

      state.stack.push(Math.round(d * 64));
  }

  // MPPEM[] Measure Pixels Per EM
  // 0x4B
  function MPPEM(state) {
      if (exports.DEBUG) { console.log(state.step, 'MPPEM[]'); }
      state.stack.push(state.ppem);
  }

  // FLIPON[] set the auto FLIP Boolean to ON
  // 0x4D
  function FLIPON(state) {
      if (exports.DEBUG) { console.log(state.step, 'FLIPON[]'); }
      state.autoFlip = true;
  }

  // LT[] Less Than
  // 0x50
  function LT(state) {
      var stack = state.stack;
      var e2 = stack.pop();
      var e1 = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'LT[]', e2, e1); }

      stack.push(e1 < e2 ? 1 : 0);
  }

  // LTEQ[] Less Than or EQual
  // 0x53
  function LTEQ(state) {
      var stack = state.stack;
      var e2 = stack.pop();
      var e1 = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'LTEQ[]', e2, e1); }

      stack.push(e1 <= e2 ? 1 : 0);
  }

  // GTEQ[] Greater Than
  // 0x52
  function GT(state) {
      var stack = state.stack;
      var e2 = stack.pop();
      var e1 = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'GT[]', e2, e1); }

      stack.push(e1 > e2 ? 1 : 0);
  }

  // GTEQ[] Greater Than or EQual
  // 0x53
  function GTEQ(state) {
      var stack = state.stack;
      var e2 = stack.pop();
      var e1 = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'GTEQ[]', e2, e1); }

      stack.push(e1 >= e2 ? 1 : 0);
  }

  // EQ[] EQual
  // 0x54
  function EQ(state) {
      var stack = state.stack;
      var e2 = stack.pop();
      var e1 = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'EQ[]', e2, e1); }

      stack.push(e2 === e1 ? 1 : 0);
  }

  // NEQ[] Not EQual
  // 0x55
  function NEQ(state) {
      var stack = state.stack;
      var e2 = stack.pop();
      var e1 = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'NEQ[]', e2, e1); }

      stack.push(e2 !== e1 ? 1 : 0);
  }

  // ODD[] ODD
  // 0x56
  function ODD(state) {
      var stack = state.stack;
      var n = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'ODD[]', n); }

      stack.push(Math.trunc(n) % 2 ? 1 : 0);
  }

  // EVEN[] EVEN
  // 0x57
  function EVEN(state) {
      var stack = state.stack;
      var n = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'EVEN[]', n); }

      stack.push(Math.trunc(n) % 2 ? 0 : 1);
  }

  // IF[] IF test
  // 0x58
  function IF(state) {
      var test = state.stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'IF[]', test); }

      // if test is true it just continues
      // if not the ip is skipped until matching ELSE or EIF
      if (!test) {
          skip(state, true);

          if (exports.DEBUG) { console.log(state.step,  'EIF[]'); }
      }
  }

  // EIF[] End IF
  // 0x59
  function EIF(state) {
      // this can be reached normally when
      // executing an else branch.
      // -> just ignore it

      if (exports.DEBUG) { console.log(state.step, 'EIF[]'); }
  }

  // AND[] logical AND
  // 0x5A
  function AND(state) {
      var stack = state.stack;
      var e2 = stack.pop();
      var e1 = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'AND[]', e2, e1); }

      stack.push(e2 && e1 ? 1 : 0);
  }

  // OR[] logical OR
  // 0x5B
  function OR(state) {
      var stack = state.stack;
      var e2 = stack.pop();
      var e1 = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'OR[]', e2, e1); }

      stack.push(e2 || e1 ? 1 : 0);
  }

  // NOT[] logical NOT
  // 0x5C
  function NOT(state) {
      var stack = state.stack;
      var e = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'NOT[]', e); }

      stack.push(e ? 0 : 1);
  }

  // DELTAP1[] DELTA exception P1
  // DELTAP2[] DELTA exception P2
  // DELTAP3[] DELTA exception P3
  // 0x5D, 0x71, 0x72
  function DELTAP123(b, state) {
      var stack = state.stack;
      var n = stack.pop();
      var fv = state.fv;
      var pv = state.pv;
      var ppem = state.ppem;
      var base = state.deltaBase + (b - 1) * 16;
      var ds = state.deltaShift;
      var z0 = state.z0;

      if (exports.DEBUG) { console.log(state.step, 'DELTAP[' + b + ']', n, stack); }

      for (var i = 0; i < n; i++) {
          var pi = stack.pop();
          var arg = stack.pop();
          var appem = base + ((arg & 0xF0) >> 4);
          if (appem !== ppem) { continue; }

          var mag = (arg & 0x0F) - 8;
          if (mag >= 0) { mag++; }
          if (exports.DEBUG) { console.log(state.step, 'DELTAPFIX', pi, 'by', mag * ds); }

          var p = z0[pi];
          fv.setRelative(p, p, mag * ds, pv);
      }
  }

  // SDB[] Set Delta Base in the graphics state
  // 0x5E
  function SDB(state) {
      var stack = state.stack;
      var n = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SDB[]', n); }

      state.deltaBase = n;
  }

  // SDS[] Set Delta Shift in the graphics state
  // 0x5F
  function SDS(state) {
      var stack = state.stack;
      var n = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SDS[]', n); }

      state.deltaShift = Math.pow(0.5, n);
  }

  // ADD[] ADD
  // 0x60
  function ADD(state) {
      var stack = state.stack;
      var n2 = stack.pop();
      var n1 = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'ADD[]', n2, n1); }

      stack.push(n1 + n2);
  }

  // SUB[] SUB
  // 0x61
  function SUB(state) {
      var stack = state.stack;
      var n2 = stack.pop();
      var n1 = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SUB[]', n2, n1); }

      stack.push(n1 - n2);
  }

  // DIV[] DIV
  // 0x62
  function DIV(state) {
      var stack = state.stack;
      var n2 = stack.pop();
      var n1 = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'DIV[]', n2, n1); }

      stack.push(n1 * 64 / n2);
  }

  // MUL[] MUL
  // 0x63
  function MUL(state) {
      var stack = state.stack;
      var n2 = stack.pop();
      var n1 = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'MUL[]', n2, n1); }

      stack.push(n1 * n2 / 64);
  }

  // ABS[] ABSolute value
  // 0x64
  function ABS(state) {
      var stack = state.stack;
      var n = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'ABS[]', n); }

      stack.push(Math.abs(n));
  }

  // NEG[] NEGate
  // 0x65
  function NEG(state) {
      var stack = state.stack;
      var n = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'NEG[]', n); }

      stack.push(-n);
  }

  // FLOOR[] FLOOR
  // 0x66
  function FLOOR(state) {
      var stack = state.stack;
      var n = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'FLOOR[]', n); }

      stack.push(Math.floor(n / 0x40) * 0x40);
  }

  // CEILING[] CEILING
  // 0x67
  function CEILING(state) {
      var stack = state.stack;
      var n = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'CEILING[]', n); }

      stack.push(Math.ceil(n / 0x40) * 0x40);
  }

  // ROUND[ab] ROUND value
  // 0x68-0x6B
  function ROUND(dt, state) {
      var stack = state.stack;
      var n = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'ROUND[]'); }

      stack.push(state.round(n / 0x40) * 0x40);
  }

  // WCVTF[] Write Control Value Table in Funits
  // 0x70
  function WCVTF(state) {
      var stack = state.stack;
      var v = stack.pop();
      var l = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'WCVTF[]', v, l); }

      state.cvt[l] = v * state.ppem / state.font.unitsPerEm;
  }

  // DELTAC1[] DELTA exception C1
  // DELTAC2[] DELTA exception C2
  // DELTAC3[] DELTA exception C3
  // 0x73, 0x74, 0x75
  function DELTAC123(b, state) {
      var stack = state.stack;
      var n = stack.pop();
      var ppem = state.ppem;
      var base = state.deltaBase + (b - 1) * 16;
      var ds = state.deltaShift;

      if (exports.DEBUG) { console.log(state.step, 'DELTAC[' + b + ']', n, stack); }

      for (var i = 0; i < n; i++) {
          var c = stack.pop();
          var arg = stack.pop();
          var appem = base + ((arg & 0xF0) >> 4);
          if (appem !== ppem) { continue; }

          var mag = (arg & 0x0F) - 8;
          if (mag >= 0) { mag++; }

          var delta = mag * ds;

          if (exports.DEBUG) { console.log(state.step, 'DELTACFIX', c, 'by', delta); }

          state.cvt[c] += delta;
      }
  }

  // SROUND[] Super ROUND
  // 0x76
  function SROUND(state) {
      var n = state.stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'SROUND[]', n); }

      state.round = roundSuper;

      var period;

      switch (n & 0xC0) {
          case 0x00:
              period = 0.5;
              break;
          case 0x40:
              period = 1;
              break;
          case 0x80:
              period = 2;
              break;
          default:
              throw new Error('invalid SROUND value');
      }

      state.srPeriod = period;

      switch (n & 0x30) {
          case 0x00:
              state.srPhase = 0;
              break;
          case 0x10:
              state.srPhase = 0.25 * period;
              break;
          case 0x20:
              state.srPhase = 0.5  * period;
              break;
          case 0x30:
              state.srPhase = 0.75 * period;
              break;
          default: throw new Error('invalid SROUND value');
      }

      n &= 0x0F;

      if (n === 0) { state.srThreshold = 0; }
      else { state.srThreshold = (n / 8 - 0.5) * period; }
  }

  // S45ROUND[] Super ROUND 45 degrees
  // 0x77
  function S45ROUND(state) {
      var n = state.stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'S45ROUND[]', n); }

      state.round = roundSuper;

      var period;

      switch (n & 0xC0) {
          case 0x00:
              period = Math.sqrt(2) / 2;
              break;
          case 0x40:
              period = Math.sqrt(2);
              break;
          case 0x80:
              period = 2 * Math.sqrt(2);
              break;
          default:
              throw new Error('invalid S45ROUND value');
      }

      state.srPeriod = period;

      switch (n & 0x30) {
          case 0x00:
              state.srPhase = 0;
              break;
          case 0x10:
              state.srPhase = 0.25 * period;
              break;
          case 0x20:
              state.srPhase = 0.5  * period;
              break;
          case 0x30:
              state.srPhase = 0.75 * period;
              break;
          default:
              throw new Error('invalid S45ROUND value');
      }

      n &= 0x0F;

      if (n === 0) { state.srThreshold = 0; }
      else { state.srThreshold = (n / 8 - 0.5) * period; }
  }

  // ROFF[] Round Off
  // 0x7A
  function ROFF(state) {
      if (exports.DEBUG) { console.log(state.step, 'ROFF[]'); }

      state.round = roundOff;
  }

  // RUTG[] Round Up To Grid
  // 0x7C
  function RUTG(state) {
      if (exports.DEBUG) { console.log(state.step, 'RUTG[]'); }

      state.round = roundUpToGrid;
  }

  // RDTG[] Round Down To Grid
  // 0x7D
  function RDTG(state) {
      if (exports.DEBUG) { console.log(state.step, 'RDTG[]'); }

      state.round = roundDownToGrid;
  }

  // SCANCTRL[] SCAN conversion ConTRoL
  // 0x85
  function SCANCTRL(state) {
      var n = state.stack.pop();

      // ignored by opentype.js

      if (exports.DEBUG) { console.log(state.step, 'SCANCTRL[]', n); }
  }

  // SDPVTL[a] Set Dual Projection Vector To Line
  // 0x86-0x87
  function SDPVTL(a, state) {
      var stack = state.stack;
      var p2i = stack.pop();
      var p1i = stack.pop();
      var p2 = state.z2[p2i];
      var p1 = state.z1[p1i];

      if (exports.DEBUG) { console.log(state.step, 'SDPVTL[' + a + ']', p2i, p1i); }

      var dx;
      var dy;

      if (!a) {
          dx = p1.x - p2.x;
          dy = p1.y - p2.y;
      } else {
          dx = p2.y - p1.y;
          dy = p1.x - p2.x;
      }

      state.dpv = getUnitVector(dx, dy);
  }

  // GETINFO[] GET INFOrmation
  // 0x88
  function GETINFO(state) {
      var stack = state.stack;
      var sel = stack.pop();
      var r = 0;

      if (exports.DEBUG) { console.log(state.step, 'GETINFO[]', sel); }

      // v35 as in no subpixel hinting
      if (sel & 0x01) { r = 35; }

      // TODO rotation and stretch currently not supported
      // and thus those GETINFO are always 0.

      // opentype.js is always gray scaling
      if (sel & 0x20) { r |= 0x1000; }

      stack.push(r);
  }

  // ROLL[] ROLL the top three stack elements
  // 0x8A
  function ROLL(state) {
      var stack = state.stack;
      var a = stack.pop();
      var b = stack.pop();
      var c = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'ROLL[]'); }

      stack.push(b);
      stack.push(a);
      stack.push(c);
  }

  // MAX[] MAXimum of top two stack elements
  // 0x8B
  function MAX(state) {
      var stack = state.stack;
      var e2 = stack.pop();
      var e1 = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'MAX[]', e2, e1); }

      stack.push(Math.max(e1, e2));
  }

  // MIN[] MINimum of top two stack elements
  // 0x8C
  function MIN(state) {
      var stack = state.stack;
      var e2 = stack.pop();
      var e1 = stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'MIN[]', e2, e1); }

      stack.push(Math.min(e1, e2));
  }

  // SCANTYPE[] SCANTYPE
  // 0x8D
  function SCANTYPE(state) {
      var n = state.stack.pop();
      // ignored by opentype.js
      if (exports.DEBUG) { console.log(state.step, 'SCANTYPE[]', n); }
  }

  // INSTCTRL[] INSTCTRL
  // 0x8D
  function INSTCTRL(state) {
      var s = state.stack.pop();
      var v = state.stack.pop();

      if (exports.DEBUG) { console.log(state.step, 'INSTCTRL[]', s, v); }

      switch (s) {
          case 1 : state.inhibitGridFit = !!v; return;
          case 2 : state.ignoreCvt = !!v; return;
          default: throw new Error('invalid INSTCTRL[] selector');
      }
  }

  // PUSHB[abc] PUSH Bytes
  // 0xB0-0xB7
  function PUSHB(n, state) {
      var stack = state.stack;
      var prog = state.prog;
      var ip = state.ip;

      if (exports.DEBUG) { console.log(state.step, 'PUSHB[' + n + ']'); }

      for (var i = 0; i < n; i++) { stack.push(prog[++ip]); }

      state.ip = ip;
  }

  // PUSHW[abc] PUSH Words
  // 0xB8-0xBF
  function PUSHW(n, state) {
      var ip = state.ip;
      var prog = state.prog;
      var stack = state.stack;

      if (exports.DEBUG) { console.log(state.ip, 'PUSHW[' + n + ']'); }

      for (var i = 0; i < n; i++) {
          var w = (prog[++ip] << 8) | prog[++ip];
          if (w & 0x8000) { w = -((w ^ 0xffff) + 1); }
          stack.push(w);
      }

      state.ip = ip;
  }

  // MDRP[abcde] Move Direct Relative Point
  // 0xD0-0xEF
  // (if indirect is 0)
  //
  // and
  //
  // MIRP[abcde] Move Indirect Relative Point
  // 0xE0-0xFF
  // (if indirect is 1)

  function MDRP_MIRP(indirect, setRp0, keepD, ro, dt, state) {
      var stack = state.stack;
      var cvte = indirect && stack.pop();
      var pi = stack.pop();
      var rp0i = state.rp0;
      var rp = state.z0[rp0i];
      var p = state.z1[pi];

      var md = state.minDis;
      var fv = state.fv;
      var pv = state.dpv;
      var od; // original distance
      var d; // moving distance
      var sign; // sign of distance
      var cv;

      d = od = pv.distance(p, rp, true, true);
      sign = d >= 0 ? 1 : -1; // Math.sign would be 0 in case of 0

      // TODO consider autoFlip
      d = Math.abs(d);

      if (indirect) {
          cv = state.cvt[cvte];

          if (ro && Math.abs(d - cv) < state.cvCutIn) { d = cv; }
      }

      if (keepD && d < md) { d = md; }

      if (ro) { d = state.round(d); }

      fv.setRelative(p, rp, sign * d, pv);
      fv.touch(p);

      if (exports.DEBUG) {
          console.log(
              state.step,
              (indirect ? 'MIRP[' : 'MDRP[') +
              (setRp0 ? 'M' : 'm') +
              (keepD ? '>' : '_') +
              (ro ? 'R' : '_') +
              (dt === 0 ? 'Gr' : (dt === 1 ? 'Bl' : (dt === 2 ? 'Wh' : ''))) +
              ']',
              indirect ?
                  cvte + '(' + state.cvt[cvte] + ',' +  cv + ')' :
                  '',
              pi,
              '(d =', od, '->', sign * d, ')'
          );
      }

      state.rp1 = state.rp0;
      state.rp2 = pi;
      if (setRp0) { state.rp0 = pi; }
  }

  /*
  * The instruction table.
  */
  instructionTable = [
      /* 0x00 */ SVTCA.bind(undefined, yUnitVector),
      /* 0x01 */ SVTCA.bind(undefined, xUnitVector),
      /* 0x02 */ SPVTCA.bind(undefined, yUnitVector),
      /* 0x03 */ SPVTCA.bind(undefined, xUnitVector),
      /* 0x04 */ SFVTCA.bind(undefined, yUnitVector),
      /* 0x05 */ SFVTCA.bind(undefined, xUnitVector),
      /* 0x06 */ SPVTL.bind(undefined, 0),
      /* 0x07 */ SPVTL.bind(undefined, 1),
      /* 0x08 */ SFVTL.bind(undefined, 0),
      /* 0x09 */ SFVTL.bind(undefined, 1),
      /* 0x0A */ SPVFS,
      /* 0x0B */ SFVFS,
      /* 0x0C */ GPV,
      /* 0x0D */ GFV,
      /* 0x0E */ SFVTPV,
      /* 0x0F */ ISECT,
      /* 0x10 */ SRP0,
      /* 0x11 */ SRP1,
      /* 0x12 */ SRP2,
      /* 0x13 */ SZP0,
      /* 0x14 */ SZP1,
      /* 0x15 */ SZP2,
      /* 0x16 */ SZPS,
      /* 0x17 */ SLOOP,
      /* 0x18 */ RTG,
      /* 0x19 */ RTHG,
      /* 0x1A */ SMD,
      /* 0x1B */ ELSE,
      /* 0x1C */ JMPR,
      /* 0x1D */ SCVTCI,
      /* 0x1E */ undefined,   // TODO SSWCI
      /* 0x1F */ undefined,   // TODO SSW
      /* 0x20 */ DUP,
      /* 0x21 */ POP,
      /* 0x22 */ CLEAR,
      /* 0x23 */ SWAP,
      /* 0x24 */ DEPTH,
      /* 0x25 */ CINDEX,
      /* 0x26 */ MINDEX,
      /* 0x27 */ undefined,   // TODO ALIGNPTS
      /* 0x28 */ undefined,
      /* 0x29 */ undefined,   // TODO UTP
      /* 0x2A */ LOOPCALL,
      /* 0x2B */ CALL,
      /* 0x2C */ FDEF,
      /* 0x2D */ undefined,   // ENDF (eaten by FDEF)
      /* 0x2E */ MDAP.bind(undefined, 0),
      /* 0x2F */ MDAP.bind(undefined, 1),
      /* 0x30 */ IUP.bind(undefined, yUnitVector),
      /* 0x31 */ IUP.bind(undefined, xUnitVector),
      /* 0x32 */ SHP.bind(undefined, 0),
      /* 0x33 */ SHP.bind(undefined, 1),
      /* 0x34 */ SHC.bind(undefined, 0),
      /* 0x35 */ SHC.bind(undefined, 1),
      /* 0x36 */ SHZ.bind(undefined, 0),
      /* 0x37 */ SHZ.bind(undefined, 1),
      /* 0x38 */ SHPIX,
      /* 0x39 */ IP,
      /* 0x3A */ MSIRP.bind(undefined, 0),
      /* 0x3B */ MSIRP.bind(undefined, 1),
      /* 0x3C */ ALIGNRP,
      /* 0x3D */ RTDG,
      /* 0x3E */ MIAP.bind(undefined, 0),
      /* 0x3F */ MIAP.bind(undefined, 1),
      /* 0x40 */ NPUSHB,
      /* 0x41 */ NPUSHW,
      /* 0x42 */ WS,
      /* 0x43 */ RS,
      /* 0x44 */ WCVTP,
      /* 0x45 */ RCVT,
      /* 0x46 */ GC.bind(undefined, 0),
      /* 0x47 */ GC.bind(undefined, 1),
      /* 0x48 */ undefined,   // TODO SCFS
      /* 0x49 */ MD.bind(undefined, 0),
      /* 0x4A */ MD.bind(undefined, 1),
      /* 0x4B */ MPPEM,
      /* 0x4C */ undefined,   // TODO MPS
      /* 0x4D */ FLIPON,
      /* 0x4E */ undefined,   // TODO FLIPOFF
      /* 0x4F */ undefined,   // TODO DEBUG
      /* 0x50 */ LT,
      /* 0x51 */ LTEQ,
      /* 0x52 */ GT,
      /* 0x53 */ GTEQ,
      /* 0x54 */ EQ,
      /* 0x55 */ NEQ,
      /* 0x56 */ ODD,
      /* 0x57 */ EVEN,
      /* 0x58 */ IF,
      /* 0x59 */ EIF,
      /* 0x5A */ AND,
      /* 0x5B */ OR,
      /* 0x5C */ NOT,
      /* 0x5D */ DELTAP123.bind(undefined, 1),
      /* 0x5E */ SDB,
      /* 0x5F */ SDS,
      /* 0x60 */ ADD,
      /* 0x61 */ SUB,
      /* 0x62 */ DIV,
      /* 0x63 */ MUL,
      /* 0x64 */ ABS,
      /* 0x65 */ NEG,
      /* 0x66 */ FLOOR,
      /* 0x67 */ CEILING,
      /* 0x68 */ ROUND.bind(undefined, 0),
      /* 0x69 */ ROUND.bind(undefined, 1),
      /* 0x6A */ ROUND.bind(undefined, 2),
      /* 0x6B */ ROUND.bind(undefined, 3),
      /* 0x6C */ undefined,   // TODO NROUND[ab]
      /* 0x6D */ undefined,   // TODO NROUND[ab]
      /* 0x6E */ undefined,   // TODO NROUND[ab]
      /* 0x6F */ undefined,   // TODO NROUND[ab]
      /* 0x70 */ WCVTF,
      /* 0x71 */ DELTAP123.bind(undefined, 2),
      /* 0x72 */ DELTAP123.bind(undefined, 3),
      /* 0x73 */ DELTAC123.bind(undefined, 1),
      /* 0x74 */ DELTAC123.bind(undefined, 2),
      /* 0x75 */ DELTAC123.bind(undefined, 3),
      /* 0x76 */ SROUND,
      /* 0x77 */ S45ROUND,
      /* 0x78 */ undefined,   // TODO JROT[]
      /* 0x79 */ undefined,   // TODO JROF[]
      /* 0x7A */ ROFF,
      /* 0x7B */ undefined,
      /* 0x7C */ RUTG,
      /* 0x7D */ RDTG,
      /* 0x7E */ POP, // actually SANGW, supposed to do only a pop though
      /* 0x7F */ POP, // actually AA, supposed to do only a pop though
      /* 0x80 */ undefined,   // TODO FLIPPT
      /* 0x81 */ undefined,   // TODO FLIPRGON
      /* 0x82 */ undefined,   // TODO FLIPRGOFF
      /* 0x83 */ undefined,
      /* 0x84 */ undefined,
      /* 0x85 */ SCANCTRL,
      /* 0x86 */ SDPVTL.bind(undefined, 0),
      /* 0x87 */ SDPVTL.bind(undefined, 1),
      /* 0x88 */ GETINFO,
      /* 0x89 */ undefined,   // TODO IDEF
      /* 0x8A */ ROLL,
      /* 0x8B */ MAX,
      /* 0x8C */ MIN,
      /* 0x8D */ SCANTYPE,
      /* 0x8E */ INSTCTRL,
      /* 0x8F */ undefined,
      /* 0x90 */ undefined,
      /* 0x91 */ undefined,
      /* 0x92 */ undefined,
      /* 0x93 */ undefined,
      /* 0x94 */ undefined,
      /* 0x95 */ undefined,
      /* 0x96 */ undefined,
      /* 0x97 */ undefined,
      /* 0x98 */ undefined,
      /* 0x99 */ undefined,
      /* 0x9A */ undefined,
      /* 0x9B */ undefined,
      /* 0x9C */ undefined,
      /* 0x9D */ undefined,
      /* 0x9E */ undefined,
      /* 0x9F */ undefined,
      /* 0xA0 */ undefined,
      /* 0xA1 */ undefined,
      /* 0xA2 */ undefined,
      /* 0xA3 */ undefined,
      /* 0xA4 */ undefined,
      /* 0xA5 */ undefined,
      /* 0xA6 */ undefined,
      /* 0xA7 */ undefined,
      /* 0xA8 */ undefined,
      /* 0xA9 */ undefined,
      /* 0xAA */ undefined,
      /* 0xAB */ undefined,
      /* 0xAC */ undefined,
      /* 0xAD */ undefined,
      /* 0xAE */ undefined,
      /* 0xAF */ undefined,
      /* 0xB0 */ PUSHB.bind(undefined, 1),
      /* 0xB1 */ PUSHB.bind(undefined, 2),
      /* 0xB2 */ PUSHB.bind(undefined, 3),
      /* 0xB3 */ PUSHB.bind(undefined, 4),
      /* 0xB4 */ PUSHB.bind(undefined, 5),
      /* 0xB5 */ PUSHB.bind(undefined, 6),
      /* 0xB6 */ PUSHB.bind(undefined, 7),
      /* 0xB7 */ PUSHB.bind(undefined, 8),
      /* 0xB8 */ PUSHW.bind(undefined, 1),
      /* 0xB9 */ PUSHW.bind(undefined, 2),
      /* 0xBA */ PUSHW.bind(undefined, 3),
      /* 0xBB */ PUSHW.bind(undefined, 4),
      /* 0xBC */ PUSHW.bind(undefined, 5),
      /* 0xBD */ PUSHW.bind(undefined, 6),
      /* 0xBE */ PUSHW.bind(undefined, 7),
      /* 0xBF */ PUSHW.bind(undefined, 8),
      /* 0xC0 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 0),
      /* 0xC1 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 1),
      /* 0xC2 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 2),
      /* 0xC3 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 3),
      /* 0xC4 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 0),
      /* 0xC5 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 1),
      /* 0xC6 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 2),
      /* 0xC7 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 3),
      /* 0xC8 */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 0),
      /* 0xC9 */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 1),
      /* 0xCA */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 2),
      /* 0xCB */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 3),
      /* 0xCC */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 0),
      /* 0xCD */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 1),
      /* 0xCE */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 2),
      /* 0xCF */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 3),
      /* 0xD0 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 0),
      /* 0xD1 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 1),
      /* 0xD2 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 2),
      /* 0xD3 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 3),
      /* 0xD4 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 0),
      /* 0xD5 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 1),
      /* 0xD6 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 2),
      /* 0xD7 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 3),
      /* 0xD8 */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 0),
      /* 0xD9 */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 1),
      /* 0xDA */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 2),
      /* 0xDB */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 3),
      /* 0xDC */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 0),
      /* 0xDD */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 1),
      /* 0xDE */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 2),
      /* 0xDF */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 3),
      /* 0xE0 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 0),
      /* 0xE1 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 1),
      /* 0xE2 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 2),
      /* 0xE3 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 3),
      /* 0xE4 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 0),
      /* 0xE5 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 1),
      /* 0xE6 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 2),
      /* 0xE7 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 3),
      /* 0xE8 */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 0),
      /* 0xE9 */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 1),
      /* 0xEA */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 2),
      /* 0xEB */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 3),
      /* 0xEC */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 0),
      /* 0xED */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 1),
      /* 0xEE */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 2),
      /* 0xEF */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 3),
      /* 0xF0 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 0),
      /* 0xF1 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 1),
      /* 0xF2 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 2),
      /* 0xF3 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 3),
      /* 0xF4 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 0),
      /* 0xF5 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 1),
      /* 0xF6 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 2),
      /* 0xF7 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 3),
      /* 0xF8 */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 0),
      /* 0xF9 */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 1),
      /* 0xFA */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 2),
      /* 0xFB */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 3),
      /* 0xFC */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 0),
      /* 0xFD */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 1),
      /* 0xFE */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 2),
      /* 0xFF */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 3)
  ];

  /*****************************
    Mathematical Considerations
  ******************************

  fv ... refers to freedom vector
  pv ... refers to projection vector
  rp ... refers to reference point
  p  ... refers to to point being operated on
  d  ... refers to distance

  SETRELATIVE:
  ============

  case freedom vector == x-axis:
  ------------------------------

                          (pv)
                       .-'
                rpd .-'
                 .-*
            d .-'90°'
           .-'       '
        .-'           '
     *-'               ' b
    rp                  '
                         '
                          '
              p *----------*-------------- (fv)
                            pm

    rpdx = rpx + d * pv.x
    rpdy = rpy + d * pv.y

    equation of line b

     y - rpdy = pvns * (x- rpdx)

     y = p.y

     x = rpdx + ( p.y - rpdy ) / pvns


  case freedom vector == y-axis:
  ------------------------------

      * pm
      |\
      | \
      |  \
      |   \
      |    \
      |     \
      |      \
      |       \
      |        \
      |         \ b
      |          \
      |           \
      |            \    .-' (pv)
      |         90° \.-'
      |           .-'* rpd
      |        .-'
      *     *-'  d
      p     rp

    rpdx = rpx + d * pv.x
    rpdy = rpy + d * pv.y

    equation of line b:
             pvns ... normal slope to pv

     y - rpdy = pvns * (x - rpdx)

     x = p.x

     y = rpdy +  pvns * (p.x - rpdx)



  generic case:
  -------------


                                .'(fv)
                              .'
                            .* pm
                          .' !
                        .'    .
                      .'      !
                    .'         . b
                  .'           !
                 *              .
                p               !
                           90°   .    ... (pv)
                             ...-*-'''
                    ...---'''    rpd
           ...---'''   d
     *--'''
    rp

      rpdx = rpx + d * pv.x
      rpdy = rpy + d * pv.y

   equation of line b:
      pvns... normal slope to pv

      y - rpdy = pvns * (x - rpdx)

   equation of freedom vector line:
      fvs ... slope of freedom vector (=fy/fx)

      y - py = fvs * (x - px)


    on pm both equations are true for same x/y

      y - rpdy = pvns * (x - rpdx)

      y - py = fvs * (x - px)

    form to y and set equal:

      pvns * (x - rpdx) + rpdy = fvs * (x - px) + py

    expand:

      pvns * x - pvns * rpdx + rpdy = fvs * x - fvs * px + py

    switch:

      fvs * x - fvs * px + py = pvns * x - pvns * rpdx + rpdy

    solve for x:

      fvs * x - pvns * x = fvs * px - pvns * rpdx - py + rpdy



            fvs * px - pvns * rpdx + rpdy - py
      x =  -----------------------------------
                   fvs - pvns

    and:

      y = fvs * (x - px) + py



  INTERPOLATE:
  ============

  Examples of point interpolation.

  The weight of the movement of the reference point gets bigger
  the further the other reference point is away, thus the safest
  option (that is avoiding 0/0 divisions) is to weight the
  original distance of the other point by the sum of both distances.

  If the sum of both distances is 0, then move the point by the
  arithmetic average of the movement of both reference points.




             (+6)
      rp1o *---->*rp1
           .     .                          (+12)
           .     .                  rp2o *---------->* rp2
           .     .                       .           .
           .     .                       .           .
           .    10          20           .           .
           |.........|...................|           .
                 .   .                               .
                 .   . (+8)                          .
                  po *------>*p                      .
                 .           .                       .
                 .    12     .          24           .
                 |...........|.......................|
                                    36


  -------



             (+10)
      rp1o *-------->*rp1
           .         .                      (-10)
           .         .              rp2 *<---------* rpo2
           .         .                   .         .
           .         .                   .         .
           .    10   .          30       .         .
           |.........|.............................|
                     .                   .
                     . (+5)              .
                  po *--->* p            .
                     .    .              .
                     .    .   20         .
                     |....|..............|
                       5        15


  -------


             (+10)
      rp1o *-------->*rp1
           .         .
           .         .
      rp2o *-------->*rp2


                                 (+10)
                            po *-------->* p

  -------


             (+10)
      rp1o *-------->*rp1
           .         .
           .         .(+30)
      rp2o *---------------------------->*rp2


                                          (+25)
                            po *----------------------->* p



  vim: set ts=4 sw=4 expandtab:
  *****/

  /**
   * Converts a string into a list of tokens.
   */

  /**
   * Create a new token
   * @param {string} char a single char
   */
  function Token$1(char) {
      this.char = char;
      this.state = {};
      this.activeState = null;
  }

  /**
   * Create a new context range
   * @param {number} startIndex range start index
   * @param {number} endOffset range end index offset
   * @param {string} contextName owner context name
   */
  function ContextRange(startIndex, endOffset, contextName) {
      this.contextName = contextName;
      this.startIndex = startIndex;
      this.endOffset = endOffset;
  }

  /**
   * Check context start and end
   * @param {string} contextName a unique context name
   * @param {function} checkStart a predicate function the indicates a context's start
   * @param {function} checkEnd a predicate function the indicates a context's end
   */
  function ContextChecker(contextName, checkStart, checkEnd) {
      this.contextName = contextName;
      this.openRange = null;
      this.ranges = [];
      this.checkStart = checkStart;
      this.checkEnd = checkEnd;
  }

  /**
   * @typedef ContextParams
   * @type Object
   * @property {array} context context items
   * @property {number} currentIndex current item index
   */

  /**
   * Create a context params
   * @param {array} context a list of items
   * @param {number} currentIndex current item index
   */
  function ContextParams(context, currentIndex) {
      this.context = context;
      this.index = currentIndex;
      this.length = context.length;
      this.current = context[currentIndex];
      this.backtrack = context.slice(0, currentIndex);
      this.lookahead = context.slice(currentIndex + 1);
  }

  /**
   * Create an event instance
   * @param {string} eventId event unique id
   */
  function Event(eventId) {
      this.eventId = eventId;
      this.subscribers = [];
  }

  /**
   * Initialize a core events and auto subscribe required event handlers
   * @param {any} events an object that enlists core events handlers
   */
  function initializeCoreEvents(events) {
      var this$1$1 = this;

      var coreEvents = [
          'start', 'end', 'next', 'newToken', 'contextStart',
          'contextEnd', 'insertToken', 'removeToken', 'removeRange',
          'replaceToken', 'replaceRange', 'composeRUD', 'updateContextsRanges'
      ];

      coreEvents.forEach(function (eventId) {
          Object.defineProperty(this$1$1.events, eventId, {
              value: new Event(eventId)
          });
      });

      if (!!events) {
          coreEvents.forEach(function (eventId) {
              var event = events[eventId];
              if (typeof event === 'function') {
                  this$1$1.events[eventId].subscribe(event);
              }
          });
      }
      var requiresContextUpdate = [
          'insertToken', 'removeToken', 'removeRange',
          'replaceToken', 'replaceRange', 'composeRUD'
      ];
      requiresContextUpdate.forEach(function (eventId) {
          this$1$1.events[eventId].subscribe(
              this$1$1.updateContextsRanges
          );
      });
  }

  /**
   * Converts a string into a list of tokens
   * @param {any} events tokenizer core events
   */
  function Tokenizer(events) {
      this.tokens = [];
      this.registeredContexts = {};
      this.contextCheckers = [];
      this.events = {};
      this.registeredModifiers = [];

      initializeCoreEvents.call(this, events);
  }

  /**
   * Sets the state of a token, usually called by a state modifier.
   * @param {string} key state item key
   * @param {any} value state item value
   */
  Token$1.prototype.setState = function(key, value) {
      this.state[key] = value;
      this.activeState = { key: key, value: this.state[key] };
      return this.activeState;
  };

  Token$1.prototype.getState = function (stateId) {
      return this.state[stateId] || null;
  };

  /**
   * Checks if an index exists in the tokens list.
   * @param {number} index token index
   */
  Tokenizer.prototype.inboundIndex = function(index) {
      return index >= 0 && index < this.tokens.length;
  };

  /**
   * Compose and apply a list of operations (replace, update, delete)
   * @param {array} RUDs replace, update and delete operations
   * TODO: Perf. Optimization (lengthBefore === lengthAfter ? dispatch once)
   */
  Tokenizer.prototype.composeRUD = function (RUDs) {
      var this$1$1 = this;

      var silent = true;
      var state = RUDs.map(function (RUD) { return (
          this$1$1[RUD[0]].apply(this$1$1, RUD.slice(1).concat(silent))
      ); });
      var hasFAILObject = function (obj) { return (
          typeof obj === 'object' &&
          obj.hasOwnProperty('FAIL')
      ); };
      if (state.every(hasFAILObject)) {
          return {
              FAIL: "composeRUD: one or more operations hasn't completed successfully",
              report: state.filter(hasFAILObject)
          };
      }
      this.dispatch('composeRUD', [state.filter(function (op) { return !hasFAILObject(op); })]);
  };

  /**
   * Replace a range of tokens with a list of tokens
   * @param {number} startIndex range start index
   * @param {number} offset range offset
   * @param {token} tokens a list of tokens to replace
   * @param {boolean} silent dispatch events and update context ranges
   */
  Tokenizer.prototype.replaceRange = function (startIndex, offset, tokens, silent) {
      offset = offset !== null ? offset : this.tokens.length;
      var isTokenType = tokens.every(function (token) { return token instanceof Token$1; });
      if (!isNaN(startIndex) && this.inboundIndex(startIndex) && isTokenType) {
          var replaced = this.tokens.splice.apply(
              this.tokens, [startIndex, offset].concat(tokens)
          );
          if (!silent) { this.dispatch('replaceToken', [startIndex, offset, tokens]); }
          return [replaced, tokens];
      } else {
          return { FAIL: 'replaceRange: invalid tokens or startIndex.' };
      }
  };

  /**
   * Replace a token with another token
   * @param {number} index token index
   * @param {token} token a token to replace
   * @param {boolean} silent dispatch events and update context ranges
   */
  Tokenizer.prototype.replaceToken = function (index, token, silent) {
      if (!isNaN(index) && this.inboundIndex(index) && token instanceof Token$1) {
          var replaced = this.tokens.splice(index, 1, token);
          if (!silent) { this.dispatch('replaceToken', [index, token]); }
          return [replaced[0], token];
      } else {
          return { FAIL: 'replaceToken: invalid token or index.' };
      }
  };

  /**
   * Removes a range of tokens
   * @param {number} startIndex range start index
   * @param {number} offset range offset
   * @param {boolean} silent dispatch events and update context ranges
   */
  Tokenizer.prototype.removeRange = function(startIndex, offset, silent) {
      offset = !isNaN(offset) ? offset : this.tokens.length;
      var tokens = this.tokens.splice(startIndex, offset);
      if (!silent) { this.dispatch('removeRange', [tokens, startIndex, offset]); }
      return tokens;
  };

  /**
   * Remove a token at a certain index
   * @param {number} index token index
   * @param {boolean} silent dispatch events and update context ranges
   */
  Tokenizer.prototype.removeToken = function(index, silent) {
      if (!isNaN(index) && this.inboundIndex(index)) {
          var token = this.tokens.splice(index, 1);
          if (!silent) { this.dispatch('removeToken', [token, index]); }
          return token;
      } else {
          return { FAIL: 'removeToken: invalid token index.' };
      }
  };

  /**
   * Insert a list of tokens at a certain index
   * @param {array} tokens a list of tokens to insert
   * @param {number} index insert the list of tokens at index
   * @param {boolean} silent dispatch events and update context ranges
   */
  Tokenizer.prototype.insertToken = function (tokens, index, silent) {
      var tokenType = tokens.every(
          function (token) { return token instanceof Token$1; }
      );
      if (tokenType) {
          this.tokens.splice.apply(
              this.tokens, [index, 0].concat(tokens)
          );
          if (!silent) { this.dispatch('insertToken', [tokens, index]); }
          return tokens;
      } else {
          return { FAIL: 'insertToken: invalid token(s).' };
      }
  };

  /**
   * A state modifier that is called on 'newToken' event
   * @param {string} modifierId state modifier id
   * @param {function} condition a predicate function that returns true or false
   * @param {function} modifier a function to update token state
   */
  Tokenizer.prototype.registerModifier = function(modifierId, condition, modifier) {
      this.events.newToken.subscribe(function(token, contextParams) {
          var conditionParams = [token, contextParams];
          var canApplyModifier = (
              condition === null ||
              condition.apply(this, conditionParams) === true
          );
          var modifierParams = [token, contextParams];
          if (canApplyModifier) {
              var newStateValue = modifier.apply(this, modifierParams);
              token.setState(modifierId, newStateValue);
          }
      });
      this.registeredModifiers.push(modifierId);
  };

  /**
   * Subscribe a handler to an event
   * @param {function} eventHandler an event handler function
   */
  Event.prototype.subscribe = function (eventHandler) {
      if (typeof eventHandler === 'function') {
          return ((this.subscribers.push(eventHandler)) - 1);
      } else {
          return { FAIL: ("invalid '" + (this.eventId) + "' event handler")};
      }
  };

  /**
   * Unsubscribe an event handler
   * @param {string} subsId subscription id
   */
  Event.prototype.unsubscribe = function (subsId) {
      this.subscribers.splice(subsId, 1);
  };

  /**
   * Sets context params current value index
   * @param {number} index context params current value index
   */
  ContextParams.prototype.setCurrentIndex = function(index) {
      this.index = index;
      this.current = this.context[index];
      this.backtrack = this.context.slice(0, index);
      this.lookahead = this.context.slice(index + 1);
  };

  /**
   * Get an item at an offset from the current value
   * example (current value is 3):
   *  1    2   [3]   4    5   |   items values
   * -2   -1    0    1    2   |   offset values
   * @param {number} offset an offset from current value index
   */
  ContextParams.prototype.get = function (offset) {
      switch (true) {
          case (offset === 0):
              return this.current;
          case (offset < 0 && Math.abs(offset) <= this.backtrack.length):
              return this.backtrack.slice(offset)[0];
          case (offset > 0 && offset <= this.lookahead.length):
              return this.lookahead[offset - 1];
          default:
              return null;
      }
  };

  /**
   * Converts a context range into a string value
   * @param {contextRange} range a context range
   */
  Tokenizer.prototype.rangeToText = function (range) {
      if (range instanceof ContextRange) {
          return (
              this.getRangeTokens(range)
                  .map(function (token) { return token.char; }).join('')
          );
      }
  };

  /**
   * Converts all tokens into a string
   */
  Tokenizer.prototype.getText = function () {
      return this.tokens.map(function (token) { return token.char; }).join('');
  };

  /**
   * Get a context by name
   * @param {string} contextName context name to get
   */
  Tokenizer.prototype.getContext = function (contextName) {
      var context = this.registeredContexts[contextName];
      return !!context ? context : null;
  };

  /**
   * Subscribes a new event handler to an event
   * @param {string} eventName event name to subscribe to
   * @param {function} eventHandler a function to be invoked on event
   */
  Tokenizer.prototype.on = function(eventName, eventHandler) {
      var event = this.events[eventName];
      if (!!event) {
          return event.subscribe(eventHandler);
      } else {
          return null;
      }
  };

  /**
   * Dispatches an event
   * @param {string} eventName event name
   * @param {any} args event handler arguments
   */
  Tokenizer.prototype.dispatch = function(eventName, args) {
      var this$1$1 = this;

      var event = this.events[eventName];
      if (event instanceof Event) {
          event.subscribers.forEach(function (subscriber) {
              subscriber.apply(this$1$1, args || []);
          });
      }
  };

  /**
   * Register a new context checker
   * @param {string} contextName a unique context name
   * @param {function} contextStartCheck a predicate function that returns true on context start
   * @param {function} contextEndCheck  a predicate function that returns true on context end
   * TODO: call tokenize on registration to update context ranges with the new context.
   */
  Tokenizer.prototype.registerContextChecker = function(contextName, contextStartCheck, contextEndCheck) {
      if (!!this.getContext(contextName)) { return {
          FAIL:
          ("context name '" + contextName + "' is already registered.")
      }; }
      if (typeof contextStartCheck !== 'function') { return {
          FAIL:
          "missing context start check."
      }; }
      if (typeof contextEndCheck !== 'function') { return {
          FAIL:
          "missing context end check."
      }; }
      var contextCheckers = new ContextChecker(
          contextName, contextStartCheck, contextEndCheck
      );
      this.registeredContexts[contextName] = contextCheckers;
      this.contextCheckers.push(contextCheckers);
      return contextCheckers;
  };

  /**
   * Gets a context range tokens
   * @param {contextRange} range a context range
   */
  Tokenizer.prototype.getRangeTokens = function(range) {
      var endIndex = range.startIndex + range.endOffset;
      return [].concat(
          this.tokens
              .slice(range.startIndex, endIndex)
      );
  };

  /**
   * Gets the ranges of a context
   * @param {string} contextName context name
   */
  Tokenizer.prototype.getContextRanges = function(contextName) {
      var context = this.getContext(contextName);
      if (!!context) {
          return context.ranges;
      } else {
          return { FAIL: ("context checker '" + contextName + "' is not registered.") };
      }
  };

  /**
   * Resets context ranges to run context update
   */
  Tokenizer.prototype.resetContextsRanges = function () {
      var registeredContexts = this.registeredContexts;
      for (var contextName in registeredContexts) {
          if (registeredContexts.hasOwnProperty(contextName)) {
              var context = registeredContexts[contextName];
              context.ranges = [];
          }
      }
  };

  /**
   * Updates context ranges
   */
  Tokenizer.prototype.updateContextsRanges = function () {
      this.resetContextsRanges();
      var chars = this.tokens.map(function (token) { return token.char; });
      for (var i = 0; i < chars.length; i++) {
          var contextParams = new ContextParams(chars, i);
          this.runContextCheck(contextParams);
      }
      this.dispatch('updateContextsRanges', [this.registeredContexts]);
  };

  /**
   * Sets the end offset of an open range
   * @param {number} offset range end offset
   * @param {string} contextName context name
   */
  Tokenizer.prototype.setEndOffset = function (offset, contextName) {
      var startIndex = this.getContext(contextName).openRange.startIndex;
      var range = new ContextRange(startIndex, offset, contextName);
      var ranges = this.getContext(contextName).ranges;
      range.rangeId = contextName + "." + (ranges.length);
      ranges.push(range);
      this.getContext(contextName).openRange = null;
      return range;
  };

  /**
   * Runs a context check on the current context
   * @param {contextParams} contextParams current context params
   */
  Tokenizer.prototype.runContextCheck = function(contextParams) {
      var this$1$1 = this;

      var index = contextParams.index;
      this.contextCheckers.forEach(function (contextChecker) {
          var contextName = contextChecker.contextName;
          var openRange = this$1$1.getContext(contextName).openRange;
          if (!openRange && contextChecker.checkStart(contextParams)) {
              openRange = new ContextRange(index, null, contextName);
              this$1$1.getContext(contextName).openRange = openRange;
              this$1$1.dispatch('contextStart', [contextName, index]);
          }
          if (!!openRange && contextChecker.checkEnd(contextParams)) {
              var offset = (index - openRange.startIndex) + 1;
              var range = this$1$1.setEndOffset(offset, contextName);
              this$1$1.dispatch('contextEnd', [contextName, range]);
          }
      });
  };

  /**
   * Converts a text into a list of tokens
   * @param {string} text a text to tokenize
   */
  Tokenizer.prototype.tokenize = function (text) {
      this.tokens = [];
      this.resetContextsRanges();
      var chars = Array.from(text);
      this.dispatch('start');
      for (var i = 0; i < chars.length; i++) {
          var char = chars[i];
          var contextParams = new ContextParams(chars, i);
          this.dispatch('next', [contextParams]);
          this.runContextCheck(contextParams);
          var token = new Token$1(char);
          this.tokens.push(token);
          this.dispatch('newToken', [token, contextParams]);
      }
      this.dispatch('end', [this.tokens]);
      return this.tokens;
  };

  // ╭─┄┄┄────────────────────────┄─────────────────────────────────────────────╮
  // ┊ Character Class Assertions ┊ Checks if a char belongs to a certain class ┊
  // ╰─╾──────────────────────────┄─────────────────────────────────────────────╯
  // jscs:disable maximumLineLength
  /**
   * Check if a char is Arabic
   * @param {string} c a single char
   */
  function isArabicChar(c) {
      return /[\u0600-\u065F\u066A-\u06D2\u06FA-\u06FF]/.test(c);
  }

  /**
   * Check if a char is an isolated arabic char
   * @param {string} c a single char
   */
  function isIsolatedArabicChar(char) {
      return /[\u0630\u0690\u0621\u0631\u0661\u0671\u0622\u0632\u0672\u0692\u06C2\u0623\u0673\u0693\u06C3\u0624\u0694\u06C4\u0625\u0675\u0695\u06C5\u06E5\u0676\u0696\u06C6\u0627\u0677\u0697\u06C7\u0648\u0688\u0698\u06C8\u0689\u0699\u06C9\u068A\u06CA\u066B\u068B\u06CB\u068C\u068D\u06CD\u06FD\u068E\u06EE\u06FE\u062F\u068F\u06CF\u06EF]/.test(char);
  }

  /**
   * Check if a char is an Arabic Tashkeel char
   * @param {string} c a single char
   */
  function isTashkeelArabicChar(char) {
      return /[\u0600-\u0605\u060C-\u060E\u0610-\u061B\u061E\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/.test(char);
  }

  /**
   * Check if a char is Latin
   * @param {string} c a single char
   */
  function isLatinChar(c) {
      return /[A-z]/.test(c);
  }

  /**
   * Check if a char is whitespace char
   * @param {string} c a single char
   */
  function isWhiteSpace(c) {
      return /\s/.test(c);
  }

  /**
   * Query a feature by some of it's properties to lookup a glyph substitution.
   */

  /**
   * Create feature query instance
   * @param {Font} font opentype font instance
   */
  function FeatureQuery(font) {
      this.font = font;
      this.features = {};
  }

  /**
   * @typedef SubstitutionAction
   * @type Object
   * @property {number} id substitution type
   * @property {string} tag feature tag
   * @property {any} substitution substitution value(s)
   */

  /**
   * Create a substitution action instance
   * @param {SubstitutionAction} action
   */
  function SubstitutionAction(action) {
      this.id = action.id;
      this.tag = action.tag;
      this.substitution = action.substitution;
  }

  /**
   * Lookup a coverage table
   * @param {number} glyphIndex glyph index
   * @param {CoverageTable} coverage coverage table
   */
  function lookupCoverage(glyphIndex, coverage) {
      if (!glyphIndex) { return -1; }
      switch (coverage.format) {
          case 1:
              return coverage.glyphs.indexOf(glyphIndex);

          case 2:
              var ranges = coverage.ranges;
              for (var i = 0; i < ranges.length; i++) {
                  var range = ranges[i];
                  if (glyphIndex >= range.start && glyphIndex <= range.end) {
                      var offset = glyphIndex - range.start;
                      return range.index + offset;
                  }
              }
              break;
          default:
              return -1; // not found
      }
      return -1;
  }

  /**
   * Handle a single substitution - format 1
   * @param {ContextParams} contextParams context params to lookup
   */
  function singleSubstitutionFormat1(glyphIndex, subtable) {
      var substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
      if (substituteIndex === -1) { return null; }
      return glyphIndex + subtable.deltaGlyphId;
  }

  /**
   * Handle a single substitution - format 2
   * @param {ContextParams} contextParams context params to lookup
   */
  function singleSubstitutionFormat2(glyphIndex, subtable) {
      var substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
      if (substituteIndex === -1) { return null; }
      return subtable.substitute[substituteIndex];
  }

  /**
   * Lookup a list of coverage tables
   * @param {any} coverageList a list of coverage tables
   * @param {ContextParams} contextParams context params to lookup
   */
  function lookupCoverageList(coverageList, contextParams) {
      var lookupList = [];
      for (var i = 0; i < coverageList.length; i++) {
          var coverage = coverageList[i];
          var glyphIndex = contextParams.current;
          glyphIndex = Array.isArray(glyphIndex) ? glyphIndex[0] : glyphIndex;
          var lookupIndex = lookupCoverage(glyphIndex, coverage);
          if (lookupIndex !== -1) {
              lookupList.push(lookupIndex);
          }
      }
      if (lookupList.length !== coverageList.length) { return -1; }
      return lookupList;
  }

  /**
   * Handle chaining context substitution - format 3
   * @param {ContextParams} contextParams context params to lookup
   */
  function chainingSubstitutionFormat3(contextParams, subtable) {
      var lookupsCount = (
          subtable.inputCoverage.length +
          subtable.lookaheadCoverage.length +
          subtable.backtrackCoverage.length
      );
      if (contextParams.context.length < lookupsCount) { return []; }
      // INPUT LOOKUP //
      var inputLookups = lookupCoverageList(
          subtable.inputCoverage, contextParams
      );
      if (inputLookups === -1) { return []; }
      // LOOKAHEAD LOOKUP //
      var lookaheadOffset = subtable.inputCoverage.length - 1;
      if (contextParams.lookahead.length < subtable.lookaheadCoverage.length) { return []; }
      var lookaheadContext = contextParams.lookahead.slice(lookaheadOffset);
      while (lookaheadContext.length && isTashkeelArabicChar(lookaheadContext[0].char)) {
          lookaheadContext.shift();
      }
      var lookaheadParams = new ContextParams(lookaheadContext, 0);
      var lookaheadLookups = lookupCoverageList(
          subtable.lookaheadCoverage, lookaheadParams
      );
      // BACKTRACK LOOKUP //
      var backtrackContext = [].concat(contextParams.backtrack);
      backtrackContext.reverse();
      while (backtrackContext.length && isTashkeelArabicChar(backtrackContext[0].char)) {
          backtrackContext.shift();
      }
      if (backtrackContext.length < subtable.backtrackCoverage.length) { return []; }
      var backtrackParams = new ContextParams(backtrackContext, 0);
      var backtrackLookups = lookupCoverageList(
          subtable.backtrackCoverage, backtrackParams
      );
      var contextRulesMatch = (
          inputLookups.length === subtable.inputCoverage.length &&
          lookaheadLookups.length === subtable.lookaheadCoverage.length &&
          backtrackLookups.length === subtable.backtrackCoverage.length
      );
      var substitutions = [];
      if (contextRulesMatch) {
          for (var i = 0; i < subtable.lookupRecords.length; i++) {
              var lookupRecord = subtable.lookupRecords[i];
              var lookupListIndex = lookupRecord.lookupListIndex;
              var lookupTable = this.getLookupByIndex(lookupListIndex);
              for (var s = 0; s < lookupTable.subtables.length; s++) {
                  var subtable$1 = lookupTable.subtables[s];
                  var lookup = this.getLookupMethod(lookupTable, subtable$1);
                  var substitutionType = this.getSubstitutionType(lookupTable, subtable$1);
                  if (substitutionType === '12') {
                      for (var n = 0; n < inputLookups.length; n++) {
                          var glyphIndex = contextParams.get(n);
                          var substitution = lookup(glyphIndex);
                          if (substitution) { substitutions.push(substitution); }
                      }
                  }
              }
          }
      }
      return substitutions;
  }

  /**
   * Handle ligature substitution - format 1
   * @param {ContextParams} contextParams context params to lookup
   */
  function ligatureSubstitutionFormat1(contextParams, subtable) {
      // COVERAGE LOOKUP //
      var glyphIndex = contextParams.current;
      var ligSetIndex = lookupCoverage(glyphIndex, subtable.coverage);
      if (ligSetIndex === -1) { return null; }
      // COMPONENTS LOOKUP
      // (!) note, components are ordered in the written direction.
      var ligature;
      var ligatureSet = subtable.ligatureSets[ligSetIndex];
      for (var s = 0; s < ligatureSet.length; s++) {
          ligature = ligatureSet[s];
          for (var l = 0; l < ligature.components.length; l++) {
              var lookaheadItem = contextParams.lookahead[l];
              var component = ligature.components[l];
              if (lookaheadItem !== component) { break; }
              if (l === ligature.components.length - 1) { return ligature; }
          }
      }
      return null;
  }

  /**
   * Handle decomposition substitution - format 1
   * @param {number} glyphIndex glyph index
   * @param {any} subtable subtable
   */
  function decompositionSubstitutionFormat1(glyphIndex, subtable) {
      var substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
      if (substituteIndex === -1) { return null; }
      return subtable.sequences[substituteIndex];
  }

  /**
   * Get default script features indexes
   */
  FeatureQuery.prototype.getDefaultScriptFeaturesIndexes = function () {
      var scripts = this.font.tables.gsub.scripts;
      for (var s = 0; s < scripts.length; s++) {
          var script = scripts[s];
          if (script.tag === 'DFLT') { return (
              script.script.defaultLangSys.featureIndexes
          ); }
      }
      return [];
  };

  /**
   * Get feature indexes of a specific script
   * @param {string} scriptTag script tag
   */
  FeatureQuery.prototype.getScriptFeaturesIndexes = function(scriptTag) {
      var tables = this.font.tables;
      if (!tables.gsub) { return []; }
      if (!scriptTag) { return this.getDefaultScriptFeaturesIndexes(); }
      var scripts = this.font.tables.gsub.scripts;
      for (var i = 0; i < scripts.length; i++) {
          var script = scripts[i];
          if (script.tag === scriptTag && script.script.defaultLangSys) {
              return script.script.defaultLangSys.featureIndexes;
          } else {
              var langSysRecords = script.langSysRecords;
              if (!!langSysRecords) {
                  for (var j = 0; j < langSysRecords.length; j++) {
                      var langSysRecord = langSysRecords[j];
                      if (langSysRecord.tag === scriptTag) {
                          var langSys = langSysRecord.langSys;
                          return langSys.featureIndexes;
                      }
                  }
              }
          }
      }
      return this.getDefaultScriptFeaturesIndexes();
  };

  /**
   * Map a feature tag to a gsub feature
   * @param {any} features gsub features
   * @param {string} scriptTag script tag
   */
  FeatureQuery.prototype.mapTagsToFeatures = function (features, scriptTag) {
      var tags = {};
      for (var i = 0; i < features.length; i++) {
          var tag = features[i].tag;
          var feature = features[i].feature;
          tags[tag] = feature;
      }
      this.features[scriptTag].tags = tags;
  };

  /**
   * Get features of a specific script
   * @param {string} scriptTag script tag
   */
  FeatureQuery.prototype.getScriptFeatures = function (scriptTag) {
      var features = this.features[scriptTag];
      if (this.features.hasOwnProperty(scriptTag)) { return features; }
      var featuresIndexes = this.getScriptFeaturesIndexes(scriptTag);
      if (!featuresIndexes) { return null; }
      var gsub = this.font.tables.gsub;
      features = featuresIndexes.map(function (index) { return gsub.features[index]; });
      this.features[scriptTag] = features;
      this.mapTagsToFeatures(features, scriptTag);
      return features;
  };

  /**
   * Get substitution type
   * @param {any} lookupTable lookup table
   * @param {any} subtable subtable
   */
  FeatureQuery.prototype.getSubstitutionType = function(lookupTable, subtable) {
      var lookupType = lookupTable.lookupType.toString();
      var substFormat = subtable.substFormat.toString();
      return lookupType + substFormat;
  };

  /**
   * Get lookup method
   * @param {any} lookupTable lookup table
   * @param {any} subtable subtable
   */
  FeatureQuery.prototype.getLookupMethod = function(lookupTable, subtable) {
      var this$1$1 = this;

      var substitutionType = this.getSubstitutionType(lookupTable, subtable);
      switch (substitutionType) {
          case '11':
              return function (glyphIndex) { return singleSubstitutionFormat1.apply(
                  this$1$1, [glyphIndex, subtable]
              ); };
          case '12':
              return function (glyphIndex) { return singleSubstitutionFormat2.apply(
                  this$1$1, [glyphIndex, subtable]
              ); };
          case '63':
              return function (contextParams) { return chainingSubstitutionFormat3.apply(
                  this$1$1, [contextParams, subtable]
              ); };
          case '41':
              return function (contextParams) { return ligatureSubstitutionFormat1.apply(
                  this$1$1, [contextParams, subtable]
              ); };
          case '21':
              return function (glyphIndex) { return decompositionSubstitutionFormat1.apply(
                  this$1$1, [glyphIndex, subtable]
              ); };
          default:
              throw new Error(
                  "lookupType: " + (lookupTable.lookupType) + " - " +
                  "substFormat: " + (subtable.substFormat) + " " +
                  "is not yet supported"
              );
      }
  };

  /**
   * [ LOOKUP TYPES ]
   * -------------------------------
   * Single                        1;
   * Multiple                      2;
   * Alternate                     3;
   * Ligature                      4;
   * Context                       5;
   * ChainingContext               6;
   * ExtensionSubstitution         7;
   * ReverseChainingContext        8;
   * -------------------------------
   *
   */

  /**
   * @typedef FQuery
   * @type Object
   * @param {string} tag feature tag
   * @param {string} script feature script
   * @param {ContextParams} contextParams context params
   */

  /**
   * Lookup a feature using a query parameters
   * @param {FQuery} query feature query
   */
  FeatureQuery.prototype.lookupFeature = function (query) {
      var contextParams = query.contextParams;
      var currentIndex = contextParams.index;
      var feature = this.getFeature({
          tag: query.tag, script: query.script
      });
      if (!feature) { return new Error(
          "font '" + (this.font.names.fullName.en) + "' " +
          "doesn't support feature '" + (query.tag) + "' " +
          "for script '" + (query.script) + "'."
      ); }
      var lookups = this.getFeatureLookups(feature);
      var substitutions = [].concat(contextParams.context);
      for (var l = 0; l < lookups.length; l++) {
          var lookupTable = lookups[l];
          var subtables = this.getLookupSubtables(lookupTable);
          for (var s = 0; s < subtables.length; s++) {
              var subtable = subtables[s];
              var substType = this.getSubstitutionType(lookupTable, subtable);
              var lookup = this.getLookupMethod(lookupTable, subtable);
              var substitution = (void 0);
              switch (substType) {
                  case '11':
                      substitution = lookup(contextParams.current);
                      if (substitution) {
                          substitutions.splice(currentIndex, 1, new SubstitutionAction({
                              id: 11, tag: query.tag, substitution: substitution
                          }));
                      }
                      break;
                  case '12':
                      substitution = lookup(contextParams.current);
                      if (substitution) {
                          substitutions.splice(currentIndex, 1, new SubstitutionAction({
                              id: 12, tag: query.tag, substitution: substitution
                          }));
                      }
                      break;
                  case '63':
                      substitution = lookup(contextParams);
                      if (Array.isArray(substitution) && substitution.length) {
                          substitutions.splice(currentIndex, 1, new SubstitutionAction({
                              id: 63, tag: query.tag, substitution: substitution
                          }));
                      }
                      break;
                  case '41':
                      substitution = lookup(contextParams);
                      if (substitution) {
                          substitutions.splice(currentIndex, 1, new SubstitutionAction({
                              id: 41, tag: query.tag, substitution: substitution
                          }));
                      }
                      break;
                  case '21':
                      substitution = lookup(contextParams.current);
                      if (substitution) {
                          substitutions.splice(currentIndex, 1, new SubstitutionAction({
                              id: 21, tag: query.tag, substitution: substitution
                          }));
                      }
                      break;
              }
              contextParams = new ContextParams(substitutions, currentIndex);
              if (Array.isArray(substitution) && !substitution.length) { continue; }
              substitution = null;
          }
      }
      return substitutions.length ? substitutions : null;
  };

  /**
   * Checks if a font supports a specific features
   * @param {FQuery} query feature query object
   */
  FeatureQuery.prototype.supports = function (query) {
      if (!query.script) { return false; }
      this.getScriptFeatures(query.script);
      var supportedScript = this.features.hasOwnProperty(query.script);
      if (!query.tag) { return supportedScript; }
      var supportedFeature = (
          this.features[query.script].some(function (feature) { return feature.tag === query.tag; })
      );
      return supportedScript && supportedFeature;
  };

  /**
   * Get lookup table subtables
   * @param {any} lookupTable lookup table
   */
  FeatureQuery.prototype.getLookupSubtables = function (lookupTable) {
      return lookupTable.subtables || null;
  };

  /**
   * Get lookup table by index
   * @param {number} index lookup table index
   */
  FeatureQuery.prototype.getLookupByIndex = function (index) {
      var lookups = this.font.tables.gsub.lookups;
      return lookups[index] || null;
  };

  /**
   * Get lookup tables for a feature
   * @param {string} feature
   */
  FeatureQuery.prototype.getFeatureLookups = function (feature) {
      // TODO: memoize
      return feature.lookupListIndexes.map(this.getLookupByIndex.bind(this));
  };

  /**
   * Query a feature by it's properties
   * @param {any} query an object that describes the properties of a query
   */
  FeatureQuery.prototype.getFeature = function getFeature(query) {
      if (!this.font) { return { FAIL: "No font was found"}; }
      if (!this.features.hasOwnProperty(query.script)) {
          this.getScriptFeatures(query.script);
      }
      var scriptFeatures = this.features[query.script];
      if (!scriptFeatures) { return (
          { FAIL: ("No feature for script " + (query.script))}
      ); }
      if (!scriptFeatures.tags[query.tag]) { return null; }
      return this.features[query.script].tags[query.tag];
  };

  /**
   * Arabic word context checkers
   */

  function arabicWordStartCheck(contextParams) {
      var char = contextParams.current;
      var prevChar = contextParams.get(-1);
      return (
          // ? arabic first char
          (prevChar === null && isArabicChar(char)) ||
          // ? arabic char preceded with a non arabic char
          (!isArabicChar(prevChar) && isArabicChar(char))
      );
  }

  function arabicWordEndCheck(contextParams) {
      var nextChar = contextParams.get(1);
      return (
          // ? last arabic char
          (nextChar === null) ||
          // ? next char is not arabic
          (!isArabicChar(nextChar))
      );
  }

  var arabicWordCheck = {
      startCheck: arabicWordStartCheck,
      endCheck: arabicWordEndCheck
  };

  /**
   * Arabic sentence context checkers
   */

  function arabicSentenceStartCheck(contextParams) {
      var char = contextParams.current;
      var prevChar = contextParams.get(-1);
      return (
          // ? an arabic char preceded with a non arabic char
          (isArabicChar(char) || isTashkeelArabicChar(char)) &&
          !isArabicChar(prevChar)
      );
  }

  function arabicSentenceEndCheck(contextParams) {
      var nextChar = contextParams.get(1);
      switch (true) {
          case nextChar === null:
              return true;
          case (!isArabicChar(nextChar) && !isTashkeelArabicChar(nextChar)):
              var nextIsWhitespace = isWhiteSpace(nextChar);
              if (!nextIsWhitespace) { return true; }
              if (nextIsWhitespace) {
                  var arabicCharAhead = false;
                  arabicCharAhead = (
                      contextParams.lookahead.some(
                          function (c) { return isArabicChar(c) || isTashkeelArabicChar(c); }
                      )
                  );
                  if (!arabicCharAhead) { return true; }
              }
              break;
          default:
              return false;
      }
  }

  var arabicSentenceCheck = {
      startCheck: arabicSentenceStartCheck,
      endCheck: arabicSentenceEndCheck
  };

  /**
   * Apply single substitution format 1
   * @param {Array} substitutions substitutions
   * @param {any} tokens a list of tokens
   * @param {number} index token index
   */
  function singleSubstitutionFormat1$1(action, tokens, index) {
      tokens[index].setState(action.tag, action.substitution);
  }

  /**
   * Apply single substitution format 2
   * @param {Array} substitutions substitutions
   * @param {any} tokens a list of tokens
   * @param {number} index token index
   */
  function singleSubstitutionFormat2$1(action, tokens, index) {
      tokens[index].setState(action.tag, action.substitution);
  }

  /**
   * Apply chaining context substitution format 3
   * @param {Array} substitutions substitutions
   * @param {any} tokens a list of tokens
   * @param {number} index token index
   */
  function chainingSubstitutionFormat3$1(action, tokens, index) {
      action.substitution.forEach(function (subst, offset) {
          var token = tokens[index + offset];
          token.setState(action.tag, subst);
      });
  }

  /**
   * Apply ligature substitution format 1
   * @param {Array} substitutions substitutions
   * @param {any} tokens a list of tokens
   * @param {number} index token index
   */
  function ligatureSubstitutionFormat1$1(action, tokens, index) {
      var token = tokens[index];
      token.setState(action.tag, action.substitution.ligGlyph);
      var compsCount = action.substitution.components.length;
      for (var i = 0; i < compsCount; i++) {
          token = tokens[index + i + 1];
          token.setState('deleted', true);
      }
  }

  /**
   * Supported substitutions
   */
  var SUBSTITUTIONS = {
      11: singleSubstitutionFormat1$1,
      12: singleSubstitutionFormat2$1,
      63: chainingSubstitutionFormat3$1,
      41: ligatureSubstitutionFormat1$1
  };

  /**
   * Apply substitutions to a list of tokens
   * @param {Array} substitutions substitutions
   * @param {any} tokens a list of tokens
   * @param {number} index token index
   */
  function applySubstitution(action, tokens, index) {
      if (action instanceof SubstitutionAction && SUBSTITUTIONS[action.id]) {
          SUBSTITUTIONS[action.id](action, tokens, index);
      }
  }

  /**
   * Apply Arabic presentation forms to a range of tokens
   */

  /**
   * Check if a char can be connected to it's preceding char
   * @param {ContextParams} charContextParams context params of a char
   */
  function willConnectPrev(charContextParams) {
      var backtrack = [].concat(charContextParams.backtrack);
      for (var i = backtrack.length - 1; i >= 0; i--) {
          var prevChar = backtrack[i];
          var isolated = isIsolatedArabicChar(prevChar);
          var tashkeel = isTashkeelArabicChar(prevChar);
          if (!isolated && !tashkeel) { return true; }
          if (isolated) { return false; }
      }
      return false;
  }

  /**
   * Check if a char can be connected to it's proceeding char
   * @param {ContextParams} charContextParams context params of a char
   */
  function willConnectNext(charContextParams) {
      if (isIsolatedArabicChar(charContextParams.current)) { return false; }
      for (var i = 0; i < charContextParams.lookahead.length; i++) {
          var nextChar = charContextParams.lookahead[i];
          var tashkeel = isTashkeelArabicChar(nextChar);
          if (!tashkeel) { return true; }
      }
      return false;
  }

  /**
   * Apply arabic presentation forms to a list of tokens
   * @param {ContextRange} range a range of tokens
   */
  function arabicPresentationForms(range) {
      var this$1$1 = this;

      var script = 'arab';
      var tags = this.featuresTags[script];
      var tokens = this.tokenizer.getRangeTokens(range);
      if (tokens.length === 1) { return; }
      var contextParams = new ContextParams(
          tokens.map(function (token) { return token.getState('glyphIndex'); }
      ), 0);
      var charContextParams = new ContextParams(
          tokens.map(function (token) { return token.char; }
      ), 0);
      tokens.forEach(function (token, index) {
          if (isTashkeelArabicChar(token.char)) { return; }
          contextParams.setCurrentIndex(index);
          charContextParams.setCurrentIndex(index);
          var CONNECT = 0; // 2 bits 00 (10: can connect next) (01: can connect prev)
          if (willConnectPrev(charContextParams)) { CONNECT |= 1; }
          if (willConnectNext(charContextParams)) { CONNECT |= 2; }
          var tag;
          switch (CONNECT) {
              case 1: (tag = 'fina'); break;
              case 2: (tag = 'init'); break;
              case 3: (tag = 'medi'); break;
          }
          if (tags.indexOf(tag) === -1) { return; }
          var substitutions = this$1$1.query.lookupFeature({
              tag: tag, script: script, contextParams: contextParams
          });
          if (substitutions instanceof Error) { return console.info(substitutions.message); }
          substitutions.forEach(function (action, index) {
              if (action instanceof SubstitutionAction) {
                  applySubstitution(action, tokens, index);
                  contextParams.context[index] = action.substitution;
              }
          });
      });
  }

  /**
   * Apply Arabic required ligatures feature to a range of tokens
   */

  /**
   * Update context params
   * @param {any} tokens a list of tokens
   * @param {number} index current item index
   */
  function getContextParams(tokens, index) {
      var context = tokens.map(function (token) { return token.activeState.value; });
      return new ContextParams(context, index || 0);
  }

  /**
   * Apply Arabic required ligatures to a context range
   * @param {ContextRange} range a range of tokens
   */
  function arabicRequiredLigatures(range) {
      var this$1$1 = this;

      var script = 'arab';
      var tokens = this.tokenizer.getRangeTokens(range);
      var contextParams = getContextParams(tokens);
      contextParams.context.forEach(function (glyphIndex, index) {
          contextParams.setCurrentIndex(index);
          var substitutions = this$1$1.query.lookupFeature({
              tag: 'rlig', script: script, contextParams: contextParams
          });
          if (substitutions.length) {
              substitutions.forEach(
                  function (action) { return applySubstitution(action, tokens, index); }
              );
              contextParams = getContextParams(tokens);
          }
      });
  }

  /**
   * Latin word context checkers
   */

  function latinWordStartCheck(contextParams) {
      var char = contextParams.current;
      var prevChar = contextParams.get(-1);
      return (
          // ? latin first char
          (prevChar === null && isLatinChar(char)) ||
          // ? latin char preceded with a non latin char
          (!isLatinChar(prevChar) && isLatinChar(char))
      );
  }

  function latinWordEndCheck(contextParams) {
      var nextChar = contextParams.get(1);
      return (
          // ? last latin char
          (nextChar === null) ||
          // ? next char is not latin
          (!isLatinChar(nextChar))
      );
  }

  var latinWordCheck = {
      startCheck: latinWordStartCheck,
      endCheck: latinWordEndCheck
  };

  /**
   * Apply Latin ligature feature to a range of tokens
   */

  /**
   * Update context params
   * @param {any} tokens a list of tokens
   * @param {number} index current item index
   */
  function getContextParams$1(tokens, index) {
      var context = tokens.map(function (token) { return token.activeState.value; });
      return new ContextParams(context, index || 0);
  }

  /**
   * Apply Arabic required ligatures to a context range
   * @param {ContextRange} range a range of tokens
   */
  function latinLigature(range) {
      var this$1$1 = this;

      var script = 'latn';
      var tokens = this.tokenizer.getRangeTokens(range);
      var contextParams = getContextParams$1(tokens);
      contextParams.context.forEach(function (glyphIndex, index) {
          contextParams.setCurrentIndex(index);
          var substitutions = this$1$1.query.lookupFeature({
              tag: 'liga', script: script, contextParams: contextParams
          });
          if (substitutions.length) {
              substitutions.forEach(
                  function (action) { return applySubstitution(action, tokens, index); }
              );
              contextParams = getContextParams$1(tokens);
          }
      });
  }

  /**
   * Infer bidirectional properties for a given text and apply
   * the corresponding layout rules.
   */

  /**
   * Create Bidi. features
   * @param {string} baseDir text base direction. value either 'ltr' or 'rtl'
   */
  function Bidi(baseDir) {
      this.baseDir = baseDir || 'ltr';
      this.tokenizer = new Tokenizer();
      this.featuresTags = {};
  }

  /**
   * Sets Bidi text
   * @param {string} text a text input
   */
  Bidi.prototype.setText = function (text) {
      this.text = text;
  };

  /**
   * Store essential context checks:
   * arabic word check for applying gsub features
   * arabic sentence check for adjusting arabic layout
   */
  Bidi.prototype.contextChecks = ({
      latinWordCheck: latinWordCheck,
      arabicWordCheck: arabicWordCheck,
      arabicSentenceCheck: arabicSentenceCheck
  });

  /**
   * Register arabic word check
   */
  function registerContextChecker(checkId) {
      var check = this.contextChecks[(checkId + "Check")];
      return this.tokenizer.registerContextChecker(
          checkId, check.startCheck, check.endCheck
      );
  }

  /**
   * Perform pre tokenization procedure then
   * tokenize text input
   */
  function tokenizeText() {
      registerContextChecker.call(this, 'latinWord');
      registerContextChecker.call(this, 'arabicWord');
      registerContextChecker.call(this, 'arabicSentence');
      return this.tokenizer.tokenize(this.text);
  }

  /**
   * Reverse arabic sentence layout
   * TODO: check base dir before applying adjustments - priority low
   */
  function reverseArabicSentences() {
      var this$1$1 = this;

      var ranges = this.tokenizer.getContextRanges('arabicSentence');
      ranges.forEach(function (range) {
          var rangeTokens = this$1$1.tokenizer.getRangeTokens(range);
          this$1$1.tokenizer.replaceRange(
              range.startIndex,
              range.endOffset,
              rangeTokens.reverse()
          );
      });
  }

  /**
   * Register supported features tags
   * @param {script} script script tag
   * @param {Array} tags features tags list
   */
  Bidi.prototype.registerFeatures = function (script, tags) {
      var this$1$1 = this;

      var supportedTags = tags.filter(
          function (tag) { return this$1$1.query.supports({script: script, tag: tag}); }
      );
      if (!this.featuresTags.hasOwnProperty(script)) {
          this.featuresTags[script] = supportedTags;
      } else {
          this.featuresTags[script] =
          this.featuresTags[script].concat(supportedTags);
      }
  };

  /**
   * Apply GSUB features
   * @param {Array} tagsList a list of features tags
   * @param {string} script a script tag
   * @param {Font} font opentype font instance
   */
  Bidi.prototype.applyFeatures = function (font, features) {
      if (!font) { throw new Error(
          'No valid font was provided to apply features'
      ); }
      if (!this.query) { this.query = new FeatureQuery(font); }
      for (var f = 0; f < features.length; f++) {
          var feature = features[f];
          if (!this.query.supports({script: feature.script})) { continue; }
          this.registerFeatures(feature.script, feature.tags);
      }
  };

  /**
   * Register a state modifier
   * @param {string} modifierId state modifier id
   * @param {function} condition a predicate function that returns true or false
   * @param {function} modifier a modifier function to set token state
   */
  Bidi.prototype.registerModifier = function (modifierId, condition, modifier) {
      this.tokenizer.registerModifier(modifierId, condition, modifier);
  };

  /**
   * Check if 'glyphIndex' is registered
   */
  function checkGlyphIndexStatus() {
      if (this.tokenizer.registeredModifiers.indexOf('glyphIndex') === -1) {
          throw new Error(
              'glyphIndex modifier is required to apply ' +
              'arabic presentation features.'
          );
      }
  }

  /**
   * Apply arabic presentation forms features
   */
  function applyArabicPresentationForms() {
      var this$1$1 = this;

      var script = 'arab';
      if (!this.featuresTags.hasOwnProperty(script)) { return; }
      checkGlyphIndexStatus.call(this);
      var ranges = this.tokenizer.getContextRanges('arabicWord');
      ranges.forEach(function (range) {
          arabicPresentationForms.call(this$1$1, range);
      });
  }

  /**
   * Apply required arabic ligatures
   */
  function applyArabicRequireLigatures() {
      var this$1$1 = this;

      var script = 'arab';
      if (!this.featuresTags.hasOwnProperty(script)) { return; }
      var tags = this.featuresTags[script];
      if (tags.indexOf('rlig') === -1) { return; }
      checkGlyphIndexStatus.call(this);
      var ranges = this.tokenizer.getContextRanges('arabicWord');
      ranges.forEach(function (range) {
          arabicRequiredLigatures.call(this$1$1, range);
      });
  }

  /**
   * Apply required arabic ligatures
   */
  function applyLatinLigatures() {
      var this$1$1 = this;

      var script = 'latn';
      if (!this.featuresTags.hasOwnProperty(script)) { return; }
      var tags = this.featuresTags[script];
      if (tags.indexOf('liga') === -1) { return; }
      checkGlyphIndexStatus.call(this);
      var ranges = this.tokenizer.getContextRanges('latinWord');
      ranges.forEach(function (range) {
          latinLigature.call(this$1$1, range);
      });
  }

  /**
   * Check if a context is registered
   * @param {string} contextId context id
   */
  Bidi.prototype.checkContextReady = function (contextId) {
      return !!this.tokenizer.getContext(contextId);
  };

  /**
   * Apply features to registered contexts
   */
  Bidi.prototype.applyFeaturesToContexts = function () {
      if (this.checkContextReady('arabicWord')) {
          applyArabicPresentationForms.call(this);
          applyArabicRequireLigatures.call(this);
      }
      if (this.checkContextReady('latinWord')) {
          applyLatinLigatures.call(this);
      }
      if (this.checkContextReady('arabicSentence')) {
          reverseArabicSentences.call(this);
      }
  };

  /**
   * process text input
   * @param {string} text an input text
   */
  Bidi.prototype.processText = function(text) {
      if (!this.text || this.text !== text) {
          this.setText(text);
          tokenizeText.call(this);
          this.applyFeaturesToContexts();
      }
  };

  /**
   * Process a string of text to identify and adjust
   * bidirectional text entities.
   * @param {string} text input text
   */
  Bidi.prototype.getBidiText = function (text) {
      this.processText(text);
      return this.tokenizer.getText();
  };

  /**
   * Get the current state index of each token
   * @param {text} text an input text
   */
  Bidi.prototype.getTextGlyphs = function (text) {
      this.processText(text);
      var indexes = [];
      for (var i = 0; i < this.tokenizer.tokens.length; i++) {
          var token = this.tokenizer.tokens[i];
          if (token.state.deleted) { continue; }
          var index = token.activeState.value;
          indexes.push(Array.isArray(index) ? index[0] : index);
      }
      return indexes;
  };

  // The Font object

  /**
   * @typedef FontOptions
   * @type Object
   * @property {Boolean} empty - whether to create a new empty font
   * @property {string} familyName
   * @property {string} styleName
   * @property {string=} fullName
   * @property {string=} postScriptName
   * @property {string=} designer
   * @property {string=} designerURL
   * @property {string=} manufacturer
   * @property {string=} manufacturerURL
   * @property {string=} license
   * @property {string=} licenseURL
   * @property {string=} version
   * @property {string=} description
   * @property {string=} copyright
   * @property {string=} trademark
   * @property {Number} unitsPerEm
   * @property {Number} ascender
   * @property {Number} descender
   * @property {Number} createdTimestamp
   * @property {string=} weightClass
   * @property {string=} widthClass
   * @property {string=} fsSelection
   */

  /**
   * A Font represents a loaded OpenType font file.
   * It contains a set of glyphs and methods to draw text on a drawing context,
   * or to get a path representing the text.
   * @exports opentype.Font
   * @class
   * @param {FontOptions}
   * @constructor
   */
  function Font(options) {
      options = options || {};
      options.tables = options.tables || {};

      if (!options.empty) {
          // Check that we've provided the minimum set of names.
          checkArgument(options.familyName, 'When creating a new Font object, familyName is required.');
          checkArgument(options.styleName, 'When creating a new Font object, styleName is required.');
          checkArgument(options.unitsPerEm, 'When creating a new Font object, unitsPerEm is required.');
          checkArgument(options.ascender, 'When creating a new Font object, ascender is required.');
          checkArgument(options.descender <= 0, 'When creating a new Font object, negative descender value is required.');

          // OS X will complain if the names are empty, so we put a single space everywhere by default.
          this.names = {
              fontFamily: {en: options.familyName || ' '},
              fontSubfamily: {en: options.styleName || ' '},
              fullName: {en: options.fullName || options.familyName + ' ' + options.styleName},
              // postScriptName may not contain any whitespace
              postScriptName: {en: options.postScriptName || (options.familyName + options.styleName).replace(/\s/g, '')},
              designer: {en: options.designer || ' '},
              designerURL: {en: options.designerURL || ' '},
              manufacturer: {en: options.manufacturer || ' '},
              manufacturerURL: {en: options.manufacturerURL || ' '},
              license: {en: options.license || ' '},
              licenseURL: {en: options.licenseURL || ' '},
              version: {en: options.version || 'Version 0.1'},
              description: {en: options.description || ' '},
              copyright: {en: options.copyright || ' '},
              trademark: {en: options.trademark || ' '}
          };
          this.unitsPerEm = options.unitsPerEm || 1000;
          this.ascender = options.ascender;
          this.descender = options.descender;
          this.createdTimestamp = options.createdTimestamp;
          this.tables = Object.assign(options.tables, {
              os2: Object.assign({
                  usWeightClass: options.weightClass || this.usWeightClasses.MEDIUM,
                  usWidthClass: options.widthClass || this.usWidthClasses.MEDIUM,
                  fsSelection: options.fsSelection || this.fsSelectionValues.REGULAR,
              }, options.tables.os2)
          });
      }

      this.supported = true; // Deprecated: parseBuffer will throw an error if font is not supported.
      this.glyphs = new glyphset.GlyphSet(this, options.glyphs || []);
      this.encoding = new DefaultEncoding(this);
      this.position = new Position(this);
      this.substitution = new Substitution(this);
      this.tables = this.tables || {};

      // needed for low memory mode only.
      this._push = null;
      this._hmtxTableData = {};

      Object.defineProperty(this, 'hinting', {
          get: function() {
              if (this._hinting) { return this._hinting; }
              if (this.outlinesFormat === 'truetype') {
                  return (this._hinting = new Hinting(this));
              }
          }
      });
  }

  /**
   * Check if the font has a glyph for the given character.
   * @param  {string}
   * @return {Boolean}
   */
  Font.prototype.hasChar = function(c) {
      return this.encoding.charToGlyphIndex(c) !== null;
  };

  /**
   * Convert the given character to a single glyph index.
   * Note that this function assumes that there is a one-to-one mapping between
   * the given character and a glyph; for complex scripts this might not be the case.
   * @param  {string}
   * @return {Number}
   */
  Font.prototype.charToGlyphIndex = function(s) {
      return this.encoding.charToGlyphIndex(s);
  };

  /**
   * Convert the given character to a single Glyph object.
   * Note that this function assumes that there is a one-to-one mapping between
   * the given character and a glyph; for complex scripts this might not be the case.
   * @param  {string}
   * @return {opentype.Glyph}
   */
  Font.prototype.charToGlyph = function(c) {
      var glyphIndex = this.charToGlyphIndex(c);
      var glyph = this.glyphs.get(glyphIndex);
      if (!glyph) {
          // .notdef
          glyph = this.glyphs.get(0);
      }

      return glyph;
  };

  /**
   * Update features
   * @param {any} options features options
   */
  Font.prototype.updateFeatures = function (options) {
      // TODO: update all features options not only 'latn'.
      return this.defaultRenderOptions.features.map(function (feature) {
          if (feature.script === 'latn') {
              return {
                  script: 'latn',
                  tags: feature.tags.filter(function (tag) { return options[tag]; })
              };
          } else {
              return feature;
          }
      });
  };

  /**
   * Convert the given text to a list of Glyph objects.
   * Note that there is no strict one-to-one mapping between characters and
   * glyphs, so the list of returned glyphs can be larger or smaller than the
   * length of the given string.
   * @param  {string}
   * @param  {GlyphRenderOptions} [options]
   * @return {opentype.Glyph[]}
   */
  Font.prototype.stringToGlyphs = function(s, options) {
      var this$1$1 = this;


      var bidi = new Bidi();

      // Create and register 'glyphIndex' state modifier
      var charToGlyphIndexMod = function (token) { return this$1$1.charToGlyphIndex(token.char); };
      bidi.registerModifier('glyphIndex', null, charToGlyphIndexMod);

      // roll-back to default features
      var features = options ?
      this.updateFeatures(options.features) :
      this.defaultRenderOptions.features;

      bidi.applyFeatures(this, features);

      var indexes = bidi.getTextGlyphs(s);

      var length = indexes.length;

      // convert glyph indexes to glyph objects
      var glyphs = new Array(length);
      var notdef = this.glyphs.get(0);
      for (var i = 0; i < length; i += 1) {
          glyphs[i] = this.glyphs.get(indexes[i]) || notdef;
      }
      return glyphs;
  };

  /**
   * @param  {string}
   * @return {Number}
   */
  Font.prototype.nameToGlyphIndex = function(name) {
      return this.glyphNames.nameToGlyphIndex(name);
  };

  /**
   * @param  {string}
   * @return {opentype.Glyph}
   */
  Font.prototype.nameToGlyph = function(name) {
      var glyphIndex = this.nameToGlyphIndex(name);
      var glyph = this.glyphs.get(glyphIndex);
      if (!glyph) {
          // .notdef
          glyph = this.glyphs.get(0);
      }

      return glyph;
  };

  /**
   * @param  {Number}
   * @return {String}
   */
  Font.prototype.glyphIndexToName = function(gid) {
      if (!this.glyphNames.glyphIndexToName) {
          return '';
      }

      return this.glyphNames.glyphIndexToName(gid);
  };

  /**
   * Retrieve the value of the kerning pair between the left glyph (or its index)
   * and the right glyph (or its index). If no kerning pair is found, return 0.
   * The kerning value gets added to the advance width when calculating the spacing
   * between glyphs.
   * For GPOS kerning, this method uses the default script and language, which covers
   * most use cases. To have greater control, use font.position.getKerningValue .
   * @param  {opentype.Glyph} leftGlyph
   * @param  {opentype.Glyph} rightGlyph
   * @return {Number}
   */
  Font.prototype.getKerningValue = function(leftGlyph, rightGlyph) {
      leftGlyph = leftGlyph.index || leftGlyph;
      rightGlyph = rightGlyph.index || rightGlyph;
      var gposKerning = this.position.defaultKerningTables;
      if (gposKerning) {
          return this.position.getKerningValue(gposKerning, leftGlyph, rightGlyph);
      }
      // "kern" table
      return this.kerningPairs[leftGlyph + ',' + rightGlyph] || 0;
  };

  /**
   * @typedef GlyphRenderOptions
   * @type Object
   * @property {string} [script] - script used to determine which features to apply. By default, 'DFLT' or 'latn' is used.
   *                               See https://www.microsoft.com/typography/otspec/scripttags.htm
   * @property {string} [language='dflt'] - language system used to determine which features to apply.
   *                                        See https://www.microsoft.com/typography/developers/opentype/languagetags.aspx
   * @property {boolean} [kerning=true] - whether to include kerning values
   * @property {object} [features] - OpenType Layout feature tags. Used to enable or disable the features of the given script/language system.
   *                                 See https://www.microsoft.com/typography/otspec/featuretags.htm
   */
  Font.prototype.defaultRenderOptions = {
      kerning: true,
      features: [
          /**
           * these 4 features are required to render Arabic text properly
           * and shouldn't be turned off when rendering arabic text.
           */
          { script: 'arab', tags: ['init', 'medi', 'fina', 'rlig'] },
          { script: 'latn', tags: ['liga', 'rlig'] }
      ]
  };

  /**
   * Helper function that invokes the given callback for each glyph in the given text.
   * The callback gets `(glyph, x, y, fontSize, options)`.* @param  {string} text
   * @param {string} text - The text to apply.
   * @param  {number} [x=0] - Horizontal position of the beginning of the text.
   * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
   * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
   * @param  {GlyphRenderOptions=} options
   * @param  {Function} callback
   */
  Font.prototype.forEachGlyph = function(text, x, y, fontSize, options, callback) {
      x = x !== undefined ? x : 0;
      y = y !== undefined ? y : 0;
      fontSize = fontSize !== undefined ? fontSize : 72;
      options = Object.assign({}, this.defaultRenderOptions, options);
      var fontScale = 1 / this.unitsPerEm * fontSize;
      var glyphs = this.stringToGlyphs(text, options);
      var kerningLookups;
      if (options.kerning) {
          var script = options.script || this.position.getDefaultScriptName();
          kerningLookups = this.position.getKerningTables(script, options.language);
      }
      for (var i = 0; i < glyphs.length; i += 1) {
          var glyph = glyphs[i];
          callback.call(this, glyph, x, y, fontSize, options);
          if (glyph.advanceWidth) {
              x += glyph.advanceWidth * fontScale;
          }

          if (options.kerning && i < glyphs.length - 1) {
              // We should apply position adjustment lookups in a more generic way.
              // Here we only use the xAdvance value.
              var kerningValue = kerningLookups ?
                    this.position.getKerningValue(kerningLookups, glyph.index, glyphs[i + 1].index) :
                    this.getKerningValue(glyph, glyphs[i + 1]);
              x += kerningValue * fontScale;
          }

          if (options.letterSpacing) {
              x += options.letterSpacing * fontSize;
          } else if (options.tracking) {
              x += (options.tracking / 1000) * fontSize;
          }
      }
      return x;
  };

  /**
   * Create a Path object that represents the given text.
   * @param  {string} text - The text to create.
   * @param  {number} [x=0] - Horizontal position of the beginning of the text.
   * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
   * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
   * @param  {GlyphRenderOptions=} options
   * @return {opentype.Path}
   */
  Font.prototype.getPath = function(text, x, y, fontSize, options) {
      var fullPath = new Path();
      this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
          var glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
          fullPath.extend(glyphPath);
      });
      return fullPath;
  };

  /**
   * Create an array of Path objects that represent the glyphs of a given text.
   * @param  {string} text - The text to create.
   * @param  {number} [x=0] - Horizontal position of the beginning of the text.
   * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
   * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
   * @param  {GlyphRenderOptions=} options
   * @return {opentype.Path[]}
   */
  Font.prototype.getPaths = function(text, x, y, fontSize, options) {
      var glyphPaths = [];
      this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
          var glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
          glyphPaths.push(glyphPath);
      });

      return glyphPaths;
  };

  /**
   * Returns the advance width of a text.
   *
   * This is something different than Path.getBoundingBox() as for example a
   * suffixed whitespace increases the advanceWidth but not the bounding box
   * or an overhanging letter like a calligraphic 'f' might have a quite larger
   * bounding box than its advance width.
   *
   * This corresponds to canvas2dContext.measureText(text).width
   *
   * @param  {string} text - The text to create.
   * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
   * @param  {GlyphRenderOptions=} options
   * @return advance width
   */
  Font.prototype.getAdvanceWidth = function(text, fontSize, options) {
      return this.forEachGlyph(text, 0, 0, fontSize, options, function() {});
  };

  /**
   * Draw the text on the given drawing context.
   * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
   * @param  {string} text - The text to create.
   * @param  {number} [x=0] - Horizontal position of the beginning of the text.
   * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
   * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
   * @param  {GlyphRenderOptions=} options
   */
  Font.prototype.draw = function(ctx, text, x, y, fontSize, options) {
      this.getPath(text, x, y, fontSize, options).draw(ctx);
  };

  /**
   * Draw the points of all glyphs in the text.
   * On-curve points will be drawn in blue, off-curve points will be drawn in red.
   * @param {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
   * @param {string} text - The text to create.
   * @param {number} [x=0] - Horizontal position of the beginning of the text.
   * @param {number} [y=0] - Vertical position of the *baseline* of the text.
   * @param {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
   * @param {GlyphRenderOptions=} options
   */
  Font.prototype.drawPoints = function(ctx, text, x, y, fontSize, options) {
      this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
          glyph.drawPoints(ctx, gX, gY, gFontSize);
      });
  };

  /**
   * Draw lines indicating important font measurements for all glyphs in the text.
   * Black lines indicate the origin of the coordinate system (point 0,0).
   * Blue lines indicate the glyph bounding box.
   * Green line indicates the advance width of the glyph.
   * @param {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
   * @param {string} text - The text to create.
   * @param {number} [x=0] - Horizontal position of the beginning of the text.
   * @param {number} [y=0] - Vertical position of the *baseline* of the text.
   * @param {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
   * @param {GlyphRenderOptions=} options
   */
  Font.prototype.drawMetrics = function(ctx, text, x, y, fontSize, options) {
      this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
          glyph.drawMetrics(ctx, gX, gY, gFontSize);
      });
  };

  /**
   * @param  {string}
   * @return {string}
   */
  Font.prototype.getEnglishName = function(name) {
      var translations = this.names[name];
      if (translations) {
          return translations.en;
      }
  };

  /**
   * Validate
   */
  Font.prototype.validate = function() {
      var _this = this;

      function assert(predicate, message) {
      }

      function assertNamePresent(name) {
          var englishName = _this.getEnglishName(name);
          assert(englishName && englishName.trim().length > 0);
      }

      // Identification information
      assertNamePresent('fontFamily');
      assertNamePresent('weightName');
      assertNamePresent('manufacturer');
      assertNamePresent('copyright');
      assertNamePresent('version');

      // Dimension information
      assert(this.unitsPerEm > 0);
  };

  /**
   * Convert the font object to a SFNT data structure.
   * This structure contains all the necessary tables and metadata to create a binary OTF file.
   * @return {opentype.Table}
   */
  Font.prototype.toTables = function() {
      return sfnt.fontToTable(this);
  };
  /**
   * @deprecated Font.toBuffer is deprecated. Use Font.toArrayBuffer instead.
   */
  Font.prototype.toBuffer = function() {
      console.warn('Font.toBuffer is deprecated. Use Font.toArrayBuffer instead.');
      return this.toArrayBuffer();
  };
  /**
   * Converts a `opentype.Font` into an `ArrayBuffer`
   * @return {ArrayBuffer}
   */
  Font.prototype.toArrayBuffer = function() {
      var sfntTable = this.toTables();
      var bytes = sfntTable.encode();
      var buffer = new ArrayBuffer(bytes.length);
      var intArray = new Uint8Array(buffer);
      for (var i = 0; i < bytes.length; i++) {
          intArray[i] = bytes[i];
      }

      return buffer;
  };

  /**
   * Initiate a download of the OpenType font.
   */
  Font.prototype.download = function(fileName) {
      var familyName = this.getEnglishName('fontFamily');
      var styleName = this.getEnglishName('fontSubfamily');
      fileName = fileName || familyName.replace(/\s/g, '') + '-' + styleName + '.otf';
      var arrayBuffer = this.toArrayBuffer();

      if (isBrowser()) {
          window.URL = window.URL || window.webkitURL;

          if (window.URL) {
              var dataView = new DataView(arrayBuffer);
              var blob = new Blob([dataView], {type: 'font/opentype'});

              var link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = fileName;

              var event = document.createEvent('MouseEvents');
              event.initEvent('click', true, false);
              link.dispatchEvent(event);
          } else {
              console.warn('Font file could not be downloaded. Try using a different browser.');
          }
      } else {
          var fs = require('fs');
          var buffer = arrayBufferToNodeBuffer(arrayBuffer);
          fs.writeFileSync(fileName, buffer);
      }
  };
  /**
   * @private
   */
  Font.prototype.fsSelectionValues = {
      ITALIC:              0x001, //1
      UNDERSCORE:          0x002, //2
      NEGATIVE:            0x004, //4
      OUTLINED:            0x008, //8
      STRIKEOUT:           0x010, //16
      BOLD:                0x020, //32
      REGULAR:             0x040, //64
      USER_TYPO_METRICS:   0x080, //128
      WWS:                 0x100, //256
      OBLIQUE:             0x200  //512
  };

  /**
   * @private
   */
  Font.prototype.usWidthClasses = {
      ULTRA_CONDENSED: 1,
      EXTRA_CONDENSED: 2,
      CONDENSED: 3,
      SEMI_CONDENSED: 4,
      MEDIUM: 5,
      SEMI_EXPANDED: 6,
      EXPANDED: 7,
      EXTRA_EXPANDED: 8,
      ULTRA_EXPANDED: 9
  };

  /**
   * @private
   */
  Font.prototype.usWeightClasses = {
      THIN: 100,
      EXTRA_LIGHT: 200,
      LIGHT: 300,
      NORMAL: 400,
      MEDIUM: 500,
      SEMI_BOLD: 600,
      BOLD: 700,
      EXTRA_BOLD: 800,
      BLACK:    900
  };

  // The `fvar` table stores font variation axes and instances.

  function addName(name, names) {
      var nameString = JSON.stringify(name);
      var nameID = 256;
      for (var nameKey in names) {
          var n = parseInt(nameKey);
          if (!n || n < 256) {
              continue;
          }

          if (JSON.stringify(names[nameKey]) === nameString) {
              return n;
          }

          if (nameID <= n) {
              nameID = n + 1;
          }
      }

      names[nameID] = name;
      return nameID;
  }

  function makeFvarAxis(n, axis, names) {
      var nameID = addName(axis.name, names);
      return [
          {name: 'tag_' + n, type: 'TAG', value: axis.tag},
          {name: 'minValue_' + n, type: 'FIXED', value: axis.minValue << 16},
          {name: 'defaultValue_' + n, type: 'FIXED', value: axis.defaultValue << 16},
          {name: 'maxValue_' + n, type: 'FIXED', value: axis.maxValue << 16},
          {name: 'flags_' + n, type: 'USHORT', value: 0},
          {name: 'nameID_' + n, type: 'USHORT', value: nameID}
      ];
  }

  function parseFvarAxis(data, start, names) {
      var axis = {};
      var p = new parse.Parser(data, start);
      axis.tag = p.parseTag();
      axis.minValue = p.parseFixed();
      axis.defaultValue = p.parseFixed();
      axis.maxValue = p.parseFixed();
      p.skip('uShort', 1);  // reserved for flags; no values defined
      axis.name = names[p.parseUShort()] || {};
      return axis;
  }

  function makeFvarInstance(n, inst, axes, names) {
      var nameID = addName(inst.name, names);
      var fields = [
          {name: 'nameID_' + n, type: 'USHORT', value: nameID},
          {name: 'flags_' + n, type: 'USHORT', value: 0}
      ];

      for (var i = 0; i < axes.length; ++i) {
          var axisTag = axes[i].tag;
          fields.push({
              name: 'axis_' + n + ' ' + axisTag,
              type: 'FIXED',
              value: inst.coordinates[axisTag] << 16
          });
      }

      return fields;
  }

  function parseFvarInstance(data, start, axes, names) {
      var inst = {};
      var p = new parse.Parser(data, start);
      inst.name = names[p.parseUShort()] || {};
      p.skip('uShort', 1);  // reserved for flags; no values defined

      inst.coordinates = {};
      for (var i = 0; i < axes.length; ++i) {
          inst.coordinates[axes[i].tag] = p.parseFixed();
      }

      return inst;
  }

  function makeFvarTable(fvar, names) {
      var result = new table.Table('fvar', [
          {name: 'version', type: 'ULONG', value: 0x10000},
          {name: 'offsetToData', type: 'USHORT', value: 0},
          {name: 'countSizePairs', type: 'USHORT', value: 2},
          {name: 'axisCount', type: 'USHORT', value: fvar.axes.length},
          {name: 'axisSize', type: 'USHORT', value: 20},
          {name: 'instanceCount', type: 'USHORT', value: fvar.instances.length},
          {name: 'instanceSize', type: 'USHORT', value: 4 + fvar.axes.length * 4}
      ]);
      result.offsetToData = result.sizeOf();

      for (var i = 0; i < fvar.axes.length; i++) {
          result.fields = result.fields.concat(makeFvarAxis(i, fvar.axes[i], names));
      }

      for (var j = 0; j < fvar.instances.length; j++) {
          result.fields = result.fields.concat(makeFvarInstance(j, fvar.instances[j], fvar.axes, names));
      }

      return result;
  }

  function parseFvarTable(data, start, names) {
      var p = new parse.Parser(data, start);
      var tableVersion = p.parseULong();
      check.argument(tableVersion === 0x00010000, 'Unsupported fvar table version.');
      var offsetToData = p.parseOffset16();
      // Skip countSizePairs.
      p.skip('uShort', 1);
      var axisCount = p.parseUShort();
      var axisSize = p.parseUShort();
      var instanceCount = p.parseUShort();
      var instanceSize = p.parseUShort();

      var axes = [];
      for (var i = 0; i < axisCount; i++) {
          axes.push(parseFvarAxis(data, start + offsetToData + i * axisSize, names));
      }

      var instances = [];
      var instanceStart = start + offsetToData + axisCount * axisSize;
      for (var j = 0; j < instanceCount; j++) {
          instances.push(parseFvarInstance(data, instanceStart + j * instanceSize, axes, names));
      }

      return {axes: axes, instances: instances};
  }

  var fvar = { make: makeFvarTable, parse: parseFvarTable };

  // The `GDEF` table contains various glyph properties

  var attachList = function() {
      return {
          coverage: this.parsePointer(Parser$1.coverage),
          attachPoints: this.parseList(Parser$1.pointer(Parser$1.uShortList))
      };
  };

  var caretValue = function() {
      var format = this.parseUShort();
      check.argument(format === 1 || format === 2 || format === 3,
          'Unsupported CaretValue table version.');
      if (format === 1) {
          return { coordinate: this.parseShort() };
      } else if (format === 2) {
          return { pointindex: this.parseShort() };
      } else if (format === 3) {
          // Device / Variation Index tables unsupported
          return { coordinate: this.parseShort() };
      }
  };

  var ligGlyph = function() {
      return this.parseList(Parser$1.pointer(caretValue));
  };

  var ligCaretList = function() {
      return {
          coverage: this.parsePointer(Parser$1.coverage),
          ligGlyphs: this.parseList(Parser$1.pointer(ligGlyph))
      };
  };

  var markGlyphSets = function() {
      this.parseUShort(); // Version
      return this.parseList(Parser$1.pointer(Parser$1.coverage));
  };

  function parseGDEFTable(data, start) {
      start = start || 0;
      var p = new Parser$1(data, start);
      var tableVersion = p.parseVersion(1);
      check.argument(tableVersion === 1 || tableVersion === 1.2 || tableVersion === 1.3,
          'Unsupported GDEF table version.');
      var gdef = {
          version: tableVersion,
          classDef: p.parsePointer(Parser$1.classDef),
          attachList: p.parsePointer(attachList),
          ligCaretList: p.parsePointer(ligCaretList),
          markAttachClassDef: p.parsePointer(Parser$1.classDef)
      };
      if (tableVersion >= 1.2) {
          gdef.markGlyphSets = p.parsePointer(markGlyphSets);
      }
      return gdef;
  }
  var gdef = { parse: parseGDEFTable };

  // The `GPOS` table contains kerning pairs, among other things.

  var subtableParsers$1 = new Array(10);         // subtableParsers[0] is unused

  // https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#lookup-type-1-single-adjustment-positioning-subtable
  // this = Parser instance
  subtableParsers$1[1] = function parseLookup1() {
      var start = this.offset + this.relativeOffset;
      var posformat = this.parseUShort();
      if (posformat === 1) {
          return {
              posFormat: 1,
              coverage: this.parsePointer(Parser$1.coverage),
              value: this.parseValueRecord()
          };
      } else if (posformat === 2) {
          return {
              posFormat: 2,
              coverage: this.parsePointer(Parser$1.coverage),
              values: this.parseValueRecordList()
          };
      }
      check.assert(false, '0x' + start.toString(16) + ': GPOS lookup type 1 format must be 1 or 2.');
  };

  // https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#lookup-type-2-pair-adjustment-positioning-subtable
  subtableParsers$1[2] = function parseLookup2() {
      var start = this.offset + this.relativeOffset;
      var posFormat = this.parseUShort();
      check.assert(posFormat === 1 || posFormat === 2, '0x' + start.toString(16) + ': GPOS lookup type 2 format must be 1 or 2.');
      var coverage = this.parsePointer(Parser$1.coverage);
      var valueFormat1 = this.parseUShort();
      var valueFormat2 = this.parseUShort();
      if (posFormat === 1) {
          // Adjustments for Glyph Pairs
          return {
              posFormat: posFormat,
              coverage: coverage,
              valueFormat1: valueFormat1,
              valueFormat2: valueFormat2,
              pairSets: this.parseList(Parser$1.pointer(Parser$1.list(function() {
                  return {        // pairValueRecord
                      secondGlyph: this.parseUShort(),
                      value1: this.parseValueRecord(valueFormat1),
                      value2: this.parseValueRecord(valueFormat2)
                  };
              })))
          };
      } else if (posFormat === 2) {
          var classDef1 = this.parsePointer(Parser$1.classDef);
          var classDef2 = this.parsePointer(Parser$1.classDef);
          var class1Count = this.parseUShort();
          var class2Count = this.parseUShort();
          return {
              // Class Pair Adjustment
              posFormat: posFormat,
              coverage: coverage,
              valueFormat1: valueFormat1,
              valueFormat2: valueFormat2,
              classDef1: classDef1,
              classDef2: classDef2,
              class1Count: class1Count,
              class2Count: class2Count,
              classRecords: this.parseList(class1Count, Parser$1.list(class2Count, function() {
                  return {
                      value1: this.parseValueRecord(valueFormat1),
                      value2: this.parseValueRecord(valueFormat2)
                  };
              }))
          };
      }
  };

  subtableParsers$1[3] = function parseLookup3() { return { error: 'GPOS Lookup 3 not supported' }; };
  subtableParsers$1[4] = function parseLookup4() { return { error: 'GPOS Lookup 4 not supported' }; };
  subtableParsers$1[5] = function parseLookup5() { return { error: 'GPOS Lookup 5 not supported' }; };
  subtableParsers$1[6] = function parseLookup6() { return { error: 'GPOS Lookup 6 not supported' }; };
  subtableParsers$1[7] = function parseLookup7() { return { error: 'GPOS Lookup 7 not supported' }; };
  subtableParsers$1[8] = function parseLookup8() { return { error: 'GPOS Lookup 8 not supported' }; };
  subtableParsers$1[9] = function parseLookup9() { return { error: 'GPOS Lookup 9 not supported' }; };

  // https://docs.microsoft.com/en-us/typography/opentype/spec/gpos
  function parseGposTable(data, start) {
      start = start || 0;
      var p = new Parser$1(data, start);
      var tableVersion = p.parseVersion(1);
      check.argument(tableVersion === 1 || tableVersion === 1.1, 'Unsupported GPOS table version ' + tableVersion);

      if (tableVersion === 1) {
          return {
              version: tableVersion,
              scripts: p.parseScriptList(),
              features: p.parseFeatureList(),
              lookups: p.parseLookupList(subtableParsers$1)
          };
      } else {
          return {
              version: tableVersion,
              scripts: p.parseScriptList(),
              features: p.parseFeatureList(),
              lookups: p.parseLookupList(subtableParsers$1),
              variations: p.parseFeatureVariationsList()
          };
      }

  }

  // GPOS Writing //////////////////////////////////////////////
  // NOT SUPPORTED
  var subtableMakers$1 = new Array(10);

  function makeGposTable(gpos) {
      return new table.Table('GPOS', [
          {name: 'version', type: 'ULONG', value: 0x10000},
          {name: 'scripts', type: 'TABLE', value: new table.ScriptList(gpos.scripts)},
          {name: 'features', type: 'TABLE', value: new table.FeatureList(gpos.features)},
          {name: 'lookups', type: 'TABLE', value: new table.LookupList(gpos.lookups, subtableMakers$1)}
      ]);
  }

  var gpos = { parse: parseGposTable, make: makeGposTable };

  // The `kern` table contains kerning pairs.

  function parseWindowsKernTable(p) {
      var pairs = {};
      // Skip nTables.
      p.skip('uShort');
      var subtableVersion = p.parseUShort();
      check.argument(subtableVersion === 0, 'Unsupported kern sub-table version.');
      // Skip subtableLength, subtableCoverage
      p.skip('uShort', 2);
      var nPairs = p.parseUShort();
      // Skip searchRange, entrySelector, rangeShift.
      p.skip('uShort', 3);
      for (var i = 0; i < nPairs; i += 1) {
          var leftIndex = p.parseUShort();
          var rightIndex = p.parseUShort();
          var value = p.parseShort();
          pairs[leftIndex + ',' + rightIndex] = value;
      }
      return pairs;
  }

  function parseMacKernTable(p) {
      var pairs = {};
      // The Mac kern table stores the version as a fixed (32 bits) but we only loaded the first 16 bits.
      // Skip the rest.
      p.skip('uShort');
      var nTables = p.parseULong();
      //check.argument(nTables === 1, 'Only 1 subtable is supported (got ' + nTables + ').');
      if (nTables > 1) {
          console.warn('Only the first kern subtable is supported.');
      }
      p.skip('uLong');
      var coverage = p.parseUShort();
      var subtableVersion = coverage & 0xFF;
      p.skip('uShort');
      if (subtableVersion === 0) {
          var nPairs = p.parseUShort();
          // Skip searchRange, entrySelector, rangeShift.
          p.skip('uShort', 3);
          for (var i = 0; i < nPairs; i += 1) {
              var leftIndex = p.parseUShort();
              var rightIndex = p.parseUShort();
              var value = p.parseShort();
              pairs[leftIndex + ',' + rightIndex] = value;
          }
      }
      return pairs;
  }

  // Parse the `kern` table which contains kerning pairs.
  function parseKernTable(data, start) {
      var p = new parse.Parser(data, start);
      var tableVersion = p.parseUShort();
      if (tableVersion === 0) {
          return parseWindowsKernTable(p);
      } else if (tableVersion === 1) {
          return parseMacKernTable(p);
      } else {
          throw new Error('Unsupported kern table version (' + tableVersion + ').');
      }
  }

  var kern = { parse: parseKernTable };

  // The `loca` table stores the offsets to the locations of the glyphs in the font.

  // Parse the `loca` table. This table stores the offsets to the locations of the glyphs in the font,
  // relative to the beginning of the glyphData table.
  // The number of glyphs stored in the `loca` table is specified in the `maxp` table (under numGlyphs)
  // The loca table has two versions: a short version where offsets are stored as uShorts, and a long
  // version where offsets are stored as uLongs. The `head` table specifies which version to use
  // (under indexToLocFormat).
  function parseLocaTable(data, start, numGlyphs, shortVersion) {
      var p = new parse.Parser(data, start);
      var parseFn = shortVersion ? p.parseUShort : p.parseULong;
      // There is an extra entry after the last index element to compute the length of the last glyph.
      // That's why we use numGlyphs + 1.
      var glyphOffsets = [];
      for (var i = 0; i < numGlyphs + 1; i += 1) {
          var glyphOffset = parseFn.call(p);
          if (shortVersion) {
              // The short table version stores the actual offset divided by 2.
              glyphOffset *= 2;
          }

          glyphOffsets.push(glyphOffset);
      }

      return glyphOffsets;
  }

  var loca = { parse: parseLocaTable };

  // opentype.js

  /**
   * The opentype library.
   * @namespace opentype
   */

  // File loaders /////////////////////////////////////////////////////////
  /**
   * Loads a font from a file. The callback throws an error message as the first parameter if it fails
   * and the font as an ArrayBuffer in the second parameter if it succeeds.
   * @param  {string} path - The path of the file
   * @param  {Function} callback - The function to call when the font load completes
   */
  function loadFromFile(path, callback) {
      var fs = require('fs');
      fs.readFile(path, function(err, buffer) {
          if (err) {
              return callback(err.message);
          }

          callback(null, nodeBufferToArrayBuffer(buffer));
      });
  }
  /**
   * Loads a font from a URL. The callback throws an error message as the first parameter if it fails
   * and the font as an ArrayBuffer in the second parameter if it succeeds.
   * @param  {string} url - The URL of the font file.
   * @param  {Function} callback - The function to call when the font load completes
   */
  function loadFromUrl(url, callback) {
      var request = new XMLHttpRequest();
      request.open('get', url, true);
      request.responseType = 'arraybuffer';
      request.onload = function() {
          if (request.response) {
              return callback(null, request.response);
          } else {
              return callback('Font could not be loaded: ' + request.statusText);
          }
      };

      request.onerror = function () {
          callback('Font could not be loaded');
      };

      request.send();
  }

  // Table Directory Entries //////////////////////////////////////////////
  /**
   * Parses OpenType table entries.
   * @param  {DataView}
   * @param  {Number}
   * @return {Object[]}
   */
  function parseOpenTypeTableEntries(data, numTables) {
      var tableEntries = [];
      var p = 12;
      for (var i = 0; i < numTables; i += 1) {
          var tag = parse.getTag(data, p);
          var checksum = parse.getULong(data, p + 4);
          var offset = parse.getULong(data, p + 8);
          var length = parse.getULong(data, p + 12);
          tableEntries.push({tag: tag, checksum: checksum, offset: offset, length: length, compression: false});
          p += 16;
      }

      return tableEntries;
  }

  /**
   * Parses WOFF table entries.
   * @param  {DataView}
   * @param  {Number}
   * @return {Object[]}
   */
  function parseWOFFTableEntries(data, numTables) {
      var tableEntries = [];
      var p = 44; // offset to the first table directory entry.
      for (var i = 0; i < numTables; i += 1) {
          var tag = parse.getTag(data, p);
          var offset = parse.getULong(data, p + 4);
          var compLength = parse.getULong(data, p + 8);
          var origLength = parse.getULong(data, p + 12);
          var compression = (void 0);
          if (compLength < origLength) {
              compression = 'WOFF';
          } else {
              compression = false;
          }

          tableEntries.push({tag: tag, offset: offset, compression: compression,
              compressedLength: compLength, length: origLength});
          p += 20;
      }

      return tableEntries;
  }

  /**
   * @typedef TableData
   * @type Object
   * @property {DataView} data - The DataView
   * @property {number} offset - The data offset.
   */

  /**
   * @param  {DataView}
   * @param  {Object}
   * @return {TableData}
   */
  function uncompressTable(data, tableEntry) {
      if (tableEntry.compression === 'WOFF') {
          var inBuffer = new Uint8Array(data.buffer, tableEntry.offset + 2, tableEntry.compressedLength - 2);
          var outBuffer = new Uint8Array(tableEntry.length);
          tinyInflate(inBuffer, outBuffer);
          if (outBuffer.byteLength !== tableEntry.length) {
              throw new Error('Decompression error: ' + tableEntry.tag + ' decompressed length doesn\'t match recorded length');
          }

          var view = new DataView(outBuffer.buffer, 0);
          return {data: view, offset: 0};
      } else {
          return {data: data, offset: tableEntry.offset};
      }
  }

  // Public API ///////////////////////////////////////////////////////////

  /**
   * Parse the OpenType file data (as an ArrayBuffer) and return a Font object.
   * Throws an error if the font could not be parsed.
   * @param  {ArrayBuffer}
   * @param  {Object} opt - options for parsing
   * @return {opentype.Font}
   */
  function parseBuffer(buffer, opt) {
      opt = (opt === undefined || opt === null) ?  {} : opt;

      var indexToLocFormat;
      var ltagTable;

      // Since the constructor can also be called to create new fonts from scratch, we indicate this
      // should be an empty font that we'll fill with our own data.
      var font = new Font({empty: true});

      // OpenType fonts use big endian byte ordering.
      // We can't rely on typed array view types, because they operate with the endianness of the host computer.
      // Instead we use DataViews where we can specify endianness.
      var data = new DataView(buffer, 0);
      var numTables;
      var tableEntries = [];
      var signature = parse.getTag(data, 0);
      if (signature === String.fromCharCode(0, 1, 0, 0) || signature === 'true' || signature === 'typ1') {
          font.outlinesFormat = 'truetype';
          numTables = parse.getUShort(data, 4);
          tableEntries = parseOpenTypeTableEntries(data, numTables);
      } else if (signature === 'OTTO') {
          font.outlinesFormat = 'cff';
          numTables = parse.getUShort(data, 4);
          tableEntries = parseOpenTypeTableEntries(data, numTables);
      } else if (signature === 'wOFF') {
          var flavor = parse.getTag(data, 4);
          if (flavor === String.fromCharCode(0, 1, 0, 0)) {
              font.outlinesFormat = 'truetype';
          } else if (flavor === 'OTTO') {
              font.outlinesFormat = 'cff';
          } else {
              throw new Error('Unsupported OpenType flavor ' + signature);
          }

          numTables = parse.getUShort(data, 12);
          tableEntries = parseWOFFTableEntries(data, numTables);
      } else {
          throw new Error('Unsupported OpenType signature ' + signature);
      }

      var cffTableEntry;
      var fvarTableEntry;
      var glyfTableEntry;
      var gdefTableEntry;
      var gposTableEntry;
      var gsubTableEntry;
      var hmtxTableEntry;
      var kernTableEntry;
      var locaTableEntry;
      var nameTableEntry;
      var metaTableEntry;
      var p;

      for (var i = 0; i < numTables; i += 1) {
          var tableEntry = tableEntries[i];
          var table = (void 0);
          switch (tableEntry.tag) {
              case 'cmap':
                  table = uncompressTable(data, tableEntry);
                  font.tables.cmap = cmap.parse(table.data, table.offset);
                  font.encoding = new CmapEncoding(font.tables.cmap);
                  break;
              case 'cvt ' :
                  table = uncompressTable(data, tableEntry);
                  p = new parse.Parser(table.data, table.offset);
                  font.tables.cvt = p.parseShortList(tableEntry.length / 2);
                  break;
              case 'fvar':
                  fvarTableEntry = tableEntry;
                  break;
              case 'fpgm' :
                  table = uncompressTable(data, tableEntry);
                  p = new parse.Parser(table.data, table.offset);
                  font.tables.fpgm = p.parseByteList(tableEntry.length);
                  break;
              case 'head':
                  table = uncompressTable(data, tableEntry);
                  font.tables.head = head.parse(table.data, table.offset);
                  font.unitsPerEm = font.tables.head.unitsPerEm;
                  indexToLocFormat = font.tables.head.indexToLocFormat;
                  break;
              case 'hhea':
                  table = uncompressTable(data, tableEntry);
                  font.tables.hhea = hhea.parse(table.data, table.offset);
                  font.ascender = font.tables.hhea.ascender;
                  font.descender = font.tables.hhea.descender;
                  font.numberOfHMetrics = font.tables.hhea.numberOfHMetrics;
                  break;
              case 'hmtx':
                  hmtxTableEntry = tableEntry;
                  break;
              case 'ltag':
                  table = uncompressTable(data, tableEntry);
                  ltagTable = ltag.parse(table.data, table.offset);
                  break;
              case 'maxp':
                  table = uncompressTable(data, tableEntry);
                  font.tables.maxp = maxp.parse(table.data, table.offset);
                  font.numGlyphs = font.tables.maxp.numGlyphs;
                  break;
              case 'name':
                  nameTableEntry = tableEntry;
                  break;
              case 'OS/2':
                  table = uncompressTable(data, tableEntry);
                  font.tables.os2 = os2.parse(table.data, table.offset);
                  break;
              case 'post':
                  table = uncompressTable(data, tableEntry);
                  font.tables.post = post.parse(table.data, table.offset);
                  font.glyphNames = new GlyphNames(font.tables.post);
                  break;
              case 'prep' :
                  table = uncompressTable(data, tableEntry);
                  p = new parse.Parser(table.data, table.offset);
                  font.tables.prep = p.parseByteList(tableEntry.length);
                  break;
              case 'glyf':
                  glyfTableEntry = tableEntry;
                  break;
              case 'loca':
                  locaTableEntry = tableEntry;
                  break;
              case 'CFF ':
                  cffTableEntry = tableEntry;
                  break;
              case 'kern':
                  kernTableEntry = tableEntry;
                  break;
              case 'GDEF':
                  gdefTableEntry = tableEntry;
                  break;
              case 'GPOS':
                  gposTableEntry = tableEntry;
                  break;
              case 'GSUB':
                  gsubTableEntry = tableEntry;
                  break;
              case 'meta':
                  metaTableEntry = tableEntry;
                  break;
          }
      }

      var nameTable = uncompressTable(data, nameTableEntry);
      font.tables.name = _name.parse(nameTable.data, nameTable.offset, ltagTable);
      font.names = font.tables.name;

      if (glyfTableEntry && locaTableEntry) {
          var shortVersion = indexToLocFormat === 0;
          var locaTable = uncompressTable(data, locaTableEntry);
          var locaOffsets = loca.parse(locaTable.data, locaTable.offset, font.numGlyphs, shortVersion);
          var glyfTable = uncompressTable(data, glyfTableEntry);
          font.glyphs = glyf.parse(glyfTable.data, glyfTable.offset, locaOffsets, font, opt);
      } else if (cffTableEntry) {
          var cffTable = uncompressTable(data, cffTableEntry);
          cff.parse(cffTable.data, cffTable.offset, font, opt);
      } else {
          throw new Error('Font doesn\'t contain TrueType or CFF outlines.');
      }

      var hmtxTable = uncompressTable(data, hmtxTableEntry);
      hmtx.parse(font, hmtxTable.data, hmtxTable.offset, font.numberOfHMetrics, font.numGlyphs, font.glyphs, opt);
      addGlyphNames(font, opt);

      if (kernTableEntry) {
          var kernTable = uncompressTable(data, kernTableEntry);
          font.kerningPairs = kern.parse(kernTable.data, kernTable.offset);
      } else {
          font.kerningPairs = {};
      }

      if (gdefTableEntry) {
          var gdefTable = uncompressTable(data, gdefTableEntry);
          font.tables.gdef = gdef.parse(gdefTable.data, gdefTable.offset);
      }

      if (gposTableEntry) {
          var gposTable = uncompressTable(data, gposTableEntry);
          font.tables.gpos = gpos.parse(gposTable.data, gposTable.offset);
          font.position.init();
      }

      if (gsubTableEntry) {
          var gsubTable = uncompressTable(data, gsubTableEntry);
          font.tables.gsub = gsub.parse(gsubTable.data, gsubTable.offset);
      }

      if (fvarTableEntry) {
          var fvarTable = uncompressTable(data, fvarTableEntry);
          font.tables.fvar = fvar.parse(fvarTable.data, fvarTable.offset, font.names);
      }

      if (metaTableEntry) {
          var metaTable = uncompressTable(data, metaTableEntry);
          font.tables.meta = meta.parse(metaTable.data, metaTable.offset);
          font.metas = font.tables.meta;
      }

      return font;
  }

  /**
   * Asynchronously load the font from a URL or a filesystem. When done, call the callback
   * with two arguments `(err, font)`. The `err` will be null on success,
   * the `font` is a Font object.
   * We use the node.js callback convention so that
   * opentype.js can integrate with frameworks like async.js.
   * @alias opentype.load
   * @param  {string} url - The URL of the font to load.
   * @param  {Function} callback - The callback.
   */
  function load(url, callback, opt) {
      opt = (opt === undefined || opt === null) ?  {} : opt;
      var isNode = typeof window === 'undefined';
      var loadFn = isNode && !opt.isUrl ? loadFromFile : loadFromUrl;

      return new Promise(function (resolve, reject) {
          loadFn(url, function(err, arrayBuffer) {
              if (err) {
                  if (callback) {
                      return callback(err);
                  } else {
                      reject(err);
                  }
              }
              var font;
              try {
                  font = parseBuffer(arrayBuffer, opt);
              } catch (e) {
                  if (callback) {
                      return callback(e, null);
                  } else {
                      reject(e);
                  }
              }
              if (callback) {
                  return callback(null, font);
              } else {
                  resolve(font);
              }
          });
      });
  }

  /**
   * Synchronously load the font from a URL or file.
   * When done, returns the font object or throws an error.
   * @alias opentype.loadSync
   * @param  {string} url - The URL of the font to load.
   * @param  {Object} opt - opt.lowMemory
   * @return {opentype.Font}
   */
  function loadSync(url, opt) {
      var fs = require('fs');
      var buffer = fs.readFileSync(url);
      return parseBuffer(nodeBufferToArrayBuffer(buffer), opt);
  }

  var opentype = /*#__PURE__*/Object.freeze({
  	__proto__: null,
  	Font: Font,
  	Glyph: Glyph,
  	Path: Path,
  	BoundingBox: BoundingBox,
  	_parse: parse,
  	parse: parseBuffer,
  	load: load,
  	loadSync: loadSync
  });

  // Credits to https://github.com/gero3/facetype.js/blob/gh-pages/javascripts/main.js
  // (Modified)

  function convertOpenTypeBufferToThreeJS(buffer) {
    return convertOpenTypeToThreeJS(opentype.parse(buffer));
  }
  function convertOpenTypeToThreeJS(font) {
    const scale = (1000 * 100) / ((font.unitsPerEm || 2048) * 72);
    const result = {};
    result.glyphs = {};

    for (const key in font.glyphs.glyphs) {
  	const glyph = font.glyphs.glyphs[key];

      const unicodes = [];
      if (glyph.unicode !== undefined) {
        unicodes.push(glyph.unicode);
      }
      for (const unicode of glyph.unicodes) {
        if (unicodes.indexOf(unicode) == -1) {
          unicodes.push(unicode);
        }
      }

      for (const unicode of unicodes) {
        var token = {};
        token.ha = Math.round(glyph.advanceWidth * scale);

        const { x1: xMin, y1: xMax } = glyph.getPath().getBoundingBox();
        token.x_min = Math.round(xMin * scale);
        token.x_max = Math.round(xMax * scale);
        token.o = "";
        glyph.path.commands.forEach(function (command, i) {
          if (command.type.toLowerCase() === "c") {
            command.type = "b";
          }
          token.o += command.type.toLowerCase();
          token.o += " ";
          if (command.x !== undefined && command.y !== undefined) {
            token.o += Math.round(command.x * scale);
            token.o += " ";
            token.o += Math.round(command.y * scale);
            token.o += " ";
          }
          if (command.x1 !== undefined && command.y1 !== undefined) {
            token.o += Math.round(command.x1 * scale);
            token.o += " ";
            token.o += Math.round(command.y1 * scale);
            token.o += " ";
          }
          if (command.x2 !== undefined && command.y2 !== undefined) {
            token.o += Math.round(command.x2 * scale);
            token.o += " ";
            token.o += Math.round(command.y2 * scale);
            token.o += " ";
          }
        });
        result.glyphs[String.fromCharCode(unicode)] = token;
      }
    }

    result.familyName = font.familyName;
    result.ascender = Math.round(font.ascender * scale);
    result.descender = Math.round(font.descender * scale);
    result.underlinePosition = Math.round(
      font.tables.post.underlinePosition * scale
    );
    result.underlineThickness = Math.round(
      font.tables.post.underlineThickness * scale
    );
    result.boundingBox = {
      yMin: Math.round(font.tables.head.yMin * scale),
      xMin: Math.round(font.tables.head.xMin * scale),
      yMax: Math.round(font.tables.head.yMax * scale),
      xMax: Math.round(font.tables.head.xMax * scale),
    };
    result.resolution = 1000;
    result.original_font_information = font.tables.name;

    if (font.styleName?.toLowerCase().indexOf("bold") > -1) {
      result.cssFontWeight = "bold";
    } else {
      result.cssFontWeight = "normal";
    }

    if (font.styleName?.toLowerCase().indexOf("italic") > -1) {
      result.cssFontStyle = "italic";
    } else {
      result.cssFontStyle = "normal";
    }

    return result;
  }

  function nonIndexed(geometry) {
    const mesh = new Mesh({ vertices: {} });

    const vertices = geometry.getAttribute("position");
    const vertexLength = vertices.count;

    const newVertices = [];
    const positions = {}; // remove duplicate vertices on the go
    for (let i = 0; i < vertexLength; i++) {
      let v = [vertices.getX(i), vertices.getY(i), vertices.getZ(i)];
      if (positions[v]) {
        newVertices.push(positions[v].key);
      } else {
        newVertices.push(mesh.addVertices(v)[0]);
        positions[v] = { v, key: newVertices.last() };
      }
    }
    for (let i = 0; i < vertexLength; i += 3) {
      let face = new MeshFace(mesh, {
        vertices: [newVertices[i + 0], newVertices[i + 1], newVertices[i + 2]],
      });
      mesh.addFaces(face);
    }
    return mesh;
  }
  function indexed(geometry, quadCompatible) {
    const mesh = new Mesh({ vertices: {} });

    const vertices = geometry.getAttribute("position");
    let indices = geometry.getIndex();
    const vertexLength = vertices.count;
    const faceLength = indices.count;
    indices = indices.array;

    const newVertices = [];
    for (let i = 0; i < vertexLength; i++) {
      const v = [vertices.getX(i), vertices.getY(i), vertices.getZ(i)];
      newVertices.push(mesh.addVertices(v)[0]);
    }
    if (quadCompatible) {
      for (let i = 0; i < faceLength; i += 6) {
        const face = new MeshFace(mesh, {
          vertices: [
            newVertices[indices[i + 0]],
            newVertices[indices[i + 1]],
            newVertices[indices[i + 4]],
            newVertices[indices[i + 2]],
          ],
        });
        mesh.addFaces(face);
      }
    } else {
      for (let i = 0; i < faceLength; i += 3) {
        const face = new MeshFace(mesh, {
          vertices: [
            newVertices[indices[i + 0]],
            newVertices[indices[i + 1]],
            newVertices[indices[i + 2]],
          ],
        });
        mesh.addFaces(face);
      }
    }
    return mesh;
  }

  function runEdit$2(text, font, s, amended = false) {
    let elements = [];
    Undo.initEdit({ elements, selection: true }, amended);
    let geometry;
    try {
      geometry = new THREE.TextGeometry(text, {
        font: font,
        size: s.size,
        height: s.height,
        curveSegments: s.curveSegments,
        bevelEnabled: s.bevelThickness > 0,
        bevelThickness: s.bevelThickness / 16,
        bevelSize: s.bevelSize / 16,
        bevelOffset: s.bevelOffset / 16,
        bevelSegments: s.bevelSegments,
      });
    } catch (error) {
      Blockbench.showQuickMessage("Invalid OpenType font!");
      throw error;
    }
    let mesh = nonIndexed(geometry);

    mesh.init();
    elements.push(mesh);
    mesh.select();
    Undo.finishEdit("MTools: Generate Mesh");
  }
  const dialog$2 = new Dialog({
    title: "Generate Text",
    form: {
      text: { label: "Text", type: "textarea", value: "Hello, World!" },
      file: {
        label: "OpenType Font (Optional)",
        type: "file",
        extensions: ["ttf", "otf", "woff", "woff2"],
        placeholder: "Roboto Regular",
        filetype: "Font",
        readtype: "buffer",
      },
      size: { label: "Size", type: "number", value: 8, min: 0 },
      height: { label: "Thickness", type: "number", value: 2, min: 0 },
      curveSegments: {
        label: "Resolution",
        type: "number",
        value: 1,
        min: 1,
      },
      _: "_",
      bevelThickness: {
        label: "Bevel Thickness",
        type: "number",
        value: 0,
        min: 0,
      },
      bevelSize: { label: "Bevel Size", type: "number", value: 8, min: 0 },
      bevelOffset: {
        label: "Bevel Offset",
        type: "number",
        value: 0,
        min: 0,
      },
      bevelSegments: {
        label: "Bevel Segments",
        type: "number",
        value: 1,
        min: 0,
      },
    },
    onConfirm(out) {
      let content;
      if (!out.file) {
        content = RobotoRegular;
      } else {
        try {
          content = convertOpenTypeBufferToThreeJS(this.form.file.content);
        } catch (err) {
          Blockbench.showQuickMessage("Invalid OpenType font!");
          throw err;
        }
      }
      for (const char of out.text) {
        if (char != '\n' && !(char in content.glyphs)) {
          throwQuickMessage(
            `Character "${char}" doesn't exist on the provided font!`,
            2000
          );
        }
      }
      const font = new THREE.Font(content);
      runEdit$2(out.text, font, out);

      Undo.amendEdit(
        {
          size: {
            label: "Size",
            type: "number",
            value: out.size,
            min: 0,
          },
          height: {
            label: "Thickness",
            type: "number",
            value: out.height,
            min: 0,
          },
          curveSegments: {
            label: "Resolution",
            type: "number",
            value: out.curveSegments,
            min: 1,
          },
          bevelThickness: {
            label: "Bevel Thickness",
            type: "number",
            value: out.bevelThickness,
            min: 0,
          },
          bevelSize: {
            label: "Bevel Size",
            type: "number",
            value: out.bevelSize,
            min: 0,
          },
          bevelOffset: {
            label: "Bevel Offset",
            type: "number",
            value: out.bevelOffset,
            min: 0,
          },
          bevelSegments: {
            label: "Bevel Segments",
            type: "number",
            value: out.bevelSegments,
            min: 0,
          },
        },
        (form) => {
          runEdit$2(out.text, font, form, true);
        }
      );
    },
  });
  action("textmesh", () => {
    dialog$2.show();
  });

  var TwistedTorus = {
  	x: "-cos(u)*(6-(5/4 + sin(3*v))*sin(v-3*u))",
  	y: "-(6-(5/4 + sin(3*v))*sin(v-3*u))*sin(u)",
  	z: "cos(v-3*u)*(5/4+sin(3*v))",
  	scale: 1,
  	uRange: [
  		0,
  		6.2831854820251465
  	],
  	uDivs: 32,
  	uWrap: true,
  	vRange: [
  		0,
  		6.2831854820251465
  	],
  	vDivs: 16,
  	vWrap: true,
  	vClose: true
  };
  var Bonbon = {
  	x: "(u-3.3379)",
  	y: "cos(u)*sin(v)",
  	z: "cos(u)*cos(v)",
  	scale: 2,
  	uRange: [
  		0,
  		6.2831854820251465
  	],
  	uDivs: 16,
  	uWrap: false,
  	vRange: [
  		0,
  		6.2831854820251465
  	],
  	vDivs: 16,
  	vWrap: false,
  	vClose: false
  };
  var Boy = {
  	x: "(sq2 * cos(2*u)*pow(cos(v),2) + cos(u)*sin(2*v)) / (2 - alpha *sq2*sin(3*u)*sin(2*v))",
  	y: "(sq2 * sin(2*u)*pow(cos(v),2) - sin(u)*sin(2*v)) / (2 - alpha *sq2*sin(3*u)*sin(2*v))",
  	z: "(3*pow(cos(v),2)) / (2 - alpha*sq2*sin(3*u)*sin(2*v))",
  	scale: 4,
  	uRange: [
  		-1.5707963705062866,
  		1.5707963705062866
  	],
  	uDivs: 16,
  	uWrap: false,
  	vRange: [
  		0,
  		3.1415927410125732
  	],
  	vDivs: 32,
  	vWrap: false,
  	vClose: false,
  	variables: "alpha=1"
  };
  var Hexahedron = {
  	x: "pow(cos(v),3)*pow(cos(u),3)",
  	y: "pow(sin(u),3)",
  	z: "pow(sin(v),3)*pow(cos(u),3)",
  	scale: 8,
  	uRange: [
  		-1.2999999523162842,
  		1.2999999523162842
  	],
  	uDivs: 16,
  	uWrap: false,
  	vRange: [
  		0,
  		6.2831854820251465
  	],
  	vDivs: 16,
  	vWrap: false,
  	vClose: false
  };
  var Klein = {
  	x: "(3*(1+sin(v)) + 2*(1-cos(v)/2)*cos(u))*cos(v)",
  	y: "(4+2*(1-cos(v)/2)*cos(u))*sin(v)",
  	z: "-2*(1-cos(v)/2)*sin(u)",
  	scale: 1,
  	uRange: [
  		0,
  		6.2831854820251465
  	],
  	uDivs: 16,
  	uWrap: true,
  	vRange: [
  		0,
  		6.2831854820251465
  	],
  	vDivs: 16,
  	vWrap: false,
  	vClose: false
  };
  var Moebius = {
  	x: "(cos(v)+u*cos(v/2)*cos(v))",
  	y: "(u*sin(v/2))",
  	z: "(sin(v)+u*cos(v/2)*sin(v))",
  	scale: 4,
  	uRange: [
  		-0.4000000059604645,
  		0.4000000059604645
  	],
  	uDivs: 4,
  	uWrap: false,
  	vRange: [
  		0,
  		6.2831854820251465
  	],
  	vDivs: 16,
  	vWrap: false,
  	vClose: false
  };
  var Breather = {
  	x: "-u + (2*rr*cosh(alpha*u)*sinh(alpha*u))/denom",
  	y: "(2*ww*cosh(alpha*u)*(-(ww*cos(v)*cos(ww*v)) - sin(v)*sin(ww*v)))/denom",
  	z: "(2*ww*cosh(alpha*u)*(-(ww*sin(v)*cos(ww*v)) + cos(v)*sin(ww*v)))/denom",
  	scale: 2,
  	uRange: [
  		-13.2,
  		13.2
  	],
  	uDivs: 16,
  	uWrap: false,
  	vRange: [
  		-37.4,
  		37.4
  	],
  	vDivs: 32,
  	vWrap: false,
  	vClose: false,
  	variables: "alpha = 0.4\nrr= 1 - pow(alpha,2)\nww = sqrt(rr)\ndenom = alpha*( pow(ww*cosh(alpha*u),2) + pow(alpha*sin(ww*v),2) )"
  };
  var RidgedTorus = {
  	x: "outer_radius*cos(u)+(ridge_power*sin(numofridges*u)+inner_radius)*cos(u)*cos(v)",
  	y: "outer_radius*sin(u)+(ridge_power*sin(numofridges*u)+inner_radius)*sin(u)*cos(v)",
  	z: "(ridge_power*sin(numofridges*u)+inner_radius)*sin(v)",
  	scale: 1,
  	uRange: [
  		0,
  		6.2831854820251465
  	],
  	uDivs: 32,
  	uWrap: false,
  	vRange: [
  		0,
  		6.2831854820251465
  	],
  	vDivs: 8,
  	vWrap: false,
  	vClose: false,
  	variables: "outer_radius = 5\nridge_power = 0.6\ninner_radius = 2\nnumofridges = 10"
  };
  var CliffordTorus = {
  	x: "cos(u+v)/(sq2+cos(v-u))",
  	y: "sin(v-u)/(sq2+cos(v-u))",
  	z: "sin(u+v)/(sq2+cos(v-u))",
  	scale: 4,
  	uRange: [
  		0,
  		3.1415927410125732
  	],
  	uDivs: 8,
  	uWrap: false,
  	vRange: [
  		0,
  		6.2831854820251465
  	],
  	vDivs: 32,
  	vWrap: false,
  	vClose: false,
  	variables: "sq2 = 1.4142135623730951"
  };
  var Cyclide = {
  	x: "(thickness*(center_offset - aspect_ratio*cos(u)*cos(v) ) + radius*radius*cos(u)) / denom",
  	y: "(radius*sin(u)*(aspect_ratio-thickness*cos(v) ) )/denom",
  	z: "(radius*sin(v)*(center_offset*cos(u)-thickness ) )/denom",
  	scale: 4,
  	uRange: [
  		0,
  		6.2831854820251465
  	],
  	uDivs: 16,
  	uWrap: false,
  	vRange: [
  		0,
  		6.2831854820251465
  	],
  	vDivs: 8,
  	vWrap: false,
  	vClose: false,
  	variables: "aspect_ratio = 1\nradius = 0.98\ncenter_offset = 0.199\nthickness  = 0.3\ndenom = (aspect_ratio-center_offset*cos(u)*cos(v))"
  };
  var Shell = {
  	x: "(cos(v)*(1+cos(u))*sin(v/8))",
  	y: "(sin(u)*sin(v/8)+cos(v/8)*1.5)",
  	z: "(sin(v)*(1+cos(u))*sin(v/8))",
  	scale: 4,
  	uRange: [
  		0,
  		6.2831854820251465
  	],
  	uDivs: 8,
  	uWrap: true,
  	vRange: [
  		0,
  		12.566370964050293
  	],
  	vDivs: 32,
  	vWrap: false,
  	vClose: false
  };
  var Catalan = {
  	x: "u-sin(u)*cosh(v)",
  	y: "4*sin(1/2*u)*sinh(v/2)",
  	z: "1-cos(u)*cosh(v)",
  	scale: 1,
  	uRange: [
  		-3.1415927410125732,
  		9.42477798461914
  	],
  	uDivs: 24,
  	uWrap: false,
  	vRange: [
  		-2,
  		2
  	],
  	vDivs: 8,
  	vWrap: false,
  	vClose: false
  };
  var Dini = {
  	x: "radius*cos(u)*sin(v)",
  	y: "2*(((cos(v)+ln(tan(v/2)+1E-2)) + twist_rotation*u)+3.4985)",
  	z: "radius*sin(u)*sin(v)",
  	scale: 1,
  	uRange: [
  		0,
  		12.566370614359172
  	],
  	uDivs: 16,
  	uWrap: false,
  	vRange: [
  		0,
  		2
  	],
  	vDivs: 8,
  	vWrap: false,
  	vClose: false,
  	variables: "radius = 4\ntwist_rotation=0.2"
  };
  var Catenoid = {
  	x: "2*cosh(v/2)*cos(u)",
  	y: "v",
  	z: "2*cosh(v/2)*sin(u)",
  	scale: 1,
  	uRange: [
  		-3.1415927410125732,
  		3.1415927410125732
  	],
  	uDivs: 24,
  	uWrap: true,
  	vRange: [
  		-3.1415927410125732,
  		3.1415927410125732
  	],
  	vDivs: 8,
  	vWrap: false,
  	vClose: false
  };
  var Cochlea = {
  	x: "v*cos(u)",
  	y: "v*sin(u)",
  	z: "(0.4*u-2.5383)",
  	scale: 4,
  	uRange: [
  		0,
  		12.566370964050293
  	],
  	uDivs: 16,
  	uWrap: false,
  	vRange: [
  		0,
  		2
  	],
  	vDivs: 16,
  	vWrap: false,
  	vClose: false
  };
  var Cosinus = {
  	x: "u",
  	y: "sin(pi* ( pow(u,2) + pow(v,2) ) )/2",
  	z: "v",
  	scale: 8,
  	uRange: [
  		-1,
  		1
  	],
  	uDivs: 16,
  	uWrap: false,
  	vRange: [
  		-1,
  		1
  	],
  	vDivs: 16,
  	vWrap: false,
  	vClose: false
  };
  var Enneper = {
  	x: "u -pow(u,3)/3  + u*pow(v,2)",
  	y: "pow(u,2) - pow(v,2)",
  	z: "v -pow(v,3)/3  + v*pow(u,2)",
  	scale: 1,
  	uRange: [
  		-2,
  		2
  	],
  	uDivs: 8,
  	uWrap: false,
  	vRange: [
  		-2,
  		2
  	],
  	vDivs: 8,
  	vWrap: false,
  	vClose: false
  };
  var Helicoidal = {
  	x: "sinh(v)*sin(u)",
  	y: "3*u",
  	z: "-sinh(v)*cos(u)",
  	scale: 1,
  	uRange: [
  		-3.1415927410125732,
  		3.1415927410125732
  	],
  	uDivs: 16,
  	uWrap: false,
  	vRange: [
  		-3.1415927410125732,
  		3.1415927410125732
  	],
  	vDivs: 8,
  	vWrap: false,
  	vClose: false
  };
  var Helix = {
  	x: "(1-0.1*cos(v))*cos(u)/0.1",
  	y: "0.1*(sin(v) + u/1.7 -10)/0.1 + 5",
  	z: "(1-0.1*cos(v))*sin(u)/0.1",
  	scale: 1,
  	uRange: [
  		0,
  		12.566370964050293
  	],
  	uDivs: 32,
  	uWrap: false,
  	vRange: [
  		0,
  		6.2831854820251465
  	],
  	vDivs: 8,
  	vWrap: false,
  	vClose: false
  };
  var Hyperhelicoidal = {
  	x: "(sinh(v)*cos(3*u))/(1+cosh(u)*cosh(v))",
  	y: "(cosh(v)*sinh(u))/(1+cosh(u)*cosh(v))",
  	z: "(sinh(v)*sin(3*u))/(1+cosh(u)*cosh(v))",
  	scale: 8,
  	uRange: [
  		-3.1415927410125732,
  		3.1415927410125732
  	],
  	uDivs: 32,
  	uWrap: false,
  	vRange: [
  		-3.1415927410125732,
  		3.1415927410125732
  	],
  	vDivs: 8,
  	vWrap: false,
  	vClose: false
  };
  var PseudoCatenoid = {
  	x: "2.2*(2*cosh(v/2)*cos(u))",
  	y: "1.51166 * (2*cosh(v/2)*sin(u) * sin((2.2*(2*cosh(v/2)*cos(u)) - -11.0404)*2*pi*1/22.0513) + 1.8*(v) * cos((2.2*(2*cosh(v/2)*cos(u)) - -11.0404)*2*pi*1/22.0513))",
  	z: "1.51166 * (2*cosh(v/2)*sin(u) * cos((2.2*(2*cosh(v/2)*cos(u)) - -11.0404)*2*pi*1/22.0513) - 1.8*(v) * sin((2.2*(2*cosh(v/2)*cos(u)) - -11.0404)*2*pi*1/22.0513))",
  	scale: 1,
  	uRange: [
  		-3.1415927410125732,
  		3.1415927410125732
  	],
  	uDivs: 32,
  	uWrap: false,
  	vRange: [
  		-3.1415927410125732,
  		3.1415927410125732
  	],
  	vDivs: 14,
  	vWrap: false,
  	vClose: false
  };
  var PseudoSphere = {
  	x: "cos(u)*cos(v)+sin((sin(u)+1)*2*pi)",
  	y: "4*sin(u)",
  	z: "cos(u)*sin(v)+cos((sin(u)+1)*2*pi)",
  	scale: 2,
  	uRange: [
  		-1.5707963705062866,
  		1.5707963705062866
  	],
  	uDivs: 32,
  	uWrap: false,
  	vRange: [
  		0,
  		6.2831854820251465
  	],
  	vDivs: 8,
  	vWrap: false,
  	vClose: false
  };
  var Sine = {
  	x: "sin(u)",
  	y: "sin(v)",
  	z: "sin(u+v)",
  	scale: 8,
  	uRange: [
  		0,
  		6.2831854820251465
  	],
  	uDivs: 16,
  	uWrap: true,
  	vRange: [
  		0,
  		6.2831854820251465
  	],
  	vDivs: 16,
  	vWrap: true,
  	vClose: true
  };
  var Snake = {
  	x: "1.2*(1 -v/(2*pi))*cos(3*v)*(1 + cos(u)) + 3*cos(3*v)",
  	y: "9*v/(2*pi) + 1.2*(1 - v/(2*pi))*sin(u)",
  	z: "1.2*(1 -v/(2*pi))*sin(3*v)*(1 + cos(u)) + 3*sin(3*v)",
  	scale: 1,
  	uRange: [
  		0,
  		6.2831854820251465
  	],
  	uDivs: 7,
  	uWrap: false,
  	vRange: [
  		0,
  		6.2831854820251465
  	],
  	vDivs: 42,
  	vWrap: false,
  	vClose: false
  };
  var SteroSphere = {
  	x: "(2*u/(u*u+v*v+1))",
  	y: "((u*u+v*v-1)/(u*u+v*v+1))",
  	z: "(2*v/(u*u+v*v+1))",
  	scale: 8,
  	uRange: [
  		-2,
  		2
  	],
  	uDivs: 16,
  	uWrap: false,
  	vRange: [
  		-2,
  		2
  	],
  	vDivs: 16,
  	vWrap: false,
  	vClose: false
  };
  var Torus = {
  	x: "(1+0.5*cos(u))*cos(v)",
  	y: "0.5*sin(u)",
  	z: "(1+0.5*cos(u))*sin(v)",
  	scale: 6,
  	uRange: [
  		0,
  		6.2831854820251465
  	],
  	uDivs: 8,
  	uWrap: false,
  	vRange: [
  		0,
  		6.2831854820251465
  	],
  	vDivs: 12,
  	vWrap: false,
  	vClose: false
  };
  var xyzpresets = {
  	TwistedTorus: TwistedTorus,
  	Bonbon: Bonbon,
  	Boy: Boy,
  	Hexahedron: Hexahedron,
  	Klein: Klein,
  	Moebius: Moebius,
  	Breather: Breather,
  	RidgedTorus: RidgedTorus,
  	CliffordTorus: CliffordTorus,
  	Cyclide: Cyclide,
  	Shell: Shell,
  	Catalan: Catalan,
  	Dini: Dini,
  	Catenoid: Catenoid,
  	Cochlea: Cochlea,
  	Cosinus: Cosinus,
  	Enneper: Enneper,
  	Helicoidal: Helicoidal,
  	Helix: Helix,
  	Hyperhelicoidal: Hyperhelicoidal,
  	PseudoCatenoid: PseudoCatenoid,
  	PseudoSphere: PseudoSphere,
  	Sine: Sine,
  	Snake: Snake,
  	SteroSphere: SteroSphere,
  	Torus: Torus
  };

  var INUMBER = 'INUMBER';
  var IOP1 = 'IOP1';
  var IOP2 = 'IOP2';
  var IOP3 = 'IOP3';
  var IVAR = 'IVAR';
  var IVARNAME = 'IVARNAME';
  var IFUNCALL = 'IFUNCALL';
  var IFUNDEF = 'IFUNDEF';
  var IEXPR = 'IEXPR';
  var IEXPREVAL = 'IEXPREVAL';
  var IMEMBER = 'IMEMBER';
  var IENDSTATEMENT = 'IENDSTATEMENT';
  var IARRAY = 'IARRAY';

  function Instruction(type, value) {
    this.type = type;
    this.value = (value !== undefined && value !== null) ? value : 0;
  }

  Instruction.prototype.toString = function () {
    switch (this.type) {
      case INUMBER:
      case IOP1:
      case IOP2:
      case IOP3:
      case IVAR:
      case IVARNAME:
      case IENDSTATEMENT:
        return this.value;
      case IFUNCALL:
        return 'CALL ' + this.value;
      case IFUNDEF:
        return 'DEF ' + this.value;
      case IARRAY:
        return 'ARRAY ' + this.value;
      case IMEMBER:
        return '.' + this.value;
      default:
        return 'Invalid Instruction';
    }
  };

  function unaryInstruction(value) {
    return new Instruction(IOP1, value);
  }

  function binaryInstruction(value) {
    return new Instruction(IOP2, value);
  }

  function ternaryInstruction(value) {
    return new Instruction(IOP3, value);
  }

  function simplify(tokens, unaryOps, binaryOps, ternaryOps, values) {
    var nstack = [];
    var newexpression = [];
    var n1, n2, n3;
    var f;
    for (var i = 0; i < tokens.length; i++) {
      var item = tokens[i];
      var type = item.type;
      if (type === INUMBER || type === IVARNAME) {
        if (Array.isArray(item.value)) {
          nstack.push.apply(nstack, simplify(item.value.map(function (x) {
            return new Instruction(INUMBER, x);
          }).concat(new Instruction(IARRAY, item.value.length)), unaryOps, binaryOps, ternaryOps, values));
        } else {
          nstack.push(item);
        }
      } else if (type === IVAR && values.hasOwnProperty(item.value)) {
        item = new Instruction(INUMBER, values[item.value]);
        nstack.push(item);
      } else if (type === IOP2 && nstack.length > 1) {
        n2 = nstack.pop();
        n1 = nstack.pop();
        f = binaryOps[item.value];
        item = new Instruction(INUMBER, f(n1.value, n2.value));
        nstack.push(item);
      } else if (type === IOP3 && nstack.length > 2) {
        n3 = nstack.pop();
        n2 = nstack.pop();
        n1 = nstack.pop();
        if (item.value === '?') {
          nstack.push(n1.value ? n2.value : n3.value);
        } else {
          f = ternaryOps[item.value];
          item = new Instruction(INUMBER, f(n1.value, n2.value, n3.value));
          nstack.push(item);
        }
      } else if (type === IOP1 && nstack.length > 0) {
        n1 = nstack.pop();
        f = unaryOps[item.value];
        item = new Instruction(INUMBER, f(n1.value));
        nstack.push(item);
      } else if (type === IEXPR) {
        while (nstack.length > 0) {
          newexpression.push(nstack.shift());
        }
        newexpression.push(new Instruction(IEXPR, simplify(item.value, unaryOps, binaryOps, ternaryOps, values)));
      } else if (type === IMEMBER && nstack.length > 0) {
        n1 = nstack.pop();
        nstack.push(new Instruction(INUMBER, n1.value[item.value]));
      } /* else if (type === IARRAY && nstack.length >= item.value) {
        var length = item.value;
        while (length-- > 0) {
          newexpression.push(nstack.pop());
        }
        newexpression.push(new Instruction(IARRAY, item.value));
      } */ else {
        while (nstack.length > 0) {
          newexpression.push(nstack.shift());
        }
        newexpression.push(item);
      }
    }
    while (nstack.length > 0) {
      newexpression.push(nstack.shift());
    }
    return newexpression;
  }

  function substitute(tokens, variable, expr) {
    var newexpression = [];
    for (var i = 0; i < tokens.length; i++) {
      var item = tokens[i];
      var type = item.type;
      if (type === IVAR && item.value === variable) {
        for (var j = 0; j < expr.tokens.length; j++) {
          var expritem = expr.tokens[j];
          var replitem;
          if (expritem.type === IOP1) {
            replitem = unaryInstruction(expritem.value);
          } else if (expritem.type === IOP2) {
            replitem = binaryInstruction(expritem.value);
          } else if (expritem.type === IOP3) {
            replitem = ternaryInstruction(expritem.value);
          } else {
            replitem = new Instruction(expritem.type, expritem.value);
          }
          newexpression.push(replitem);
        }
      } else if (type === IEXPR) {
        newexpression.push(new Instruction(IEXPR, substitute(item.value, variable, expr)));
      } else {
        newexpression.push(item);
      }
    }
    return newexpression;
  }

  function evaluate(tokens, expr, values) {
    var nstack = [];
    var n1, n2, n3;
    var f, args, argCount;

    if (isExpressionEvaluator(tokens)) {
      return resolveExpression(tokens, values);
    }

    var numTokens = tokens.length;

    for (var i = 0; i < numTokens; i++) {
      var item = tokens[i];
      var type = item.type;
      if (type === INUMBER || type === IVARNAME) {
        nstack.push(item.value);
      } else if (type === IOP2) {
        n2 = nstack.pop();
        n1 = nstack.pop();
        if (item.value === 'and') {
          nstack.push(n1 ? !!evaluate(n2, expr, values) : false);
        } else if (item.value === 'or') {
          nstack.push(n1 ? true : !!evaluate(n2, expr, values));
        } else if (item.value === '=') {
          f = expr.binaryOps[item.value];
          nstack.push(f(n1, evaluate(n2, expr, values), values));
        } else {
          f = expr.binaryOps[item.value];
          nstack.push(f(resolveExpression(n1, values), resolveExpression(n2, values)));
        }
      } else if (type === IOP3) {
        n3 = nstack.pop();
        n2 = nstack.pop();
        n1 = nstack.pop();
        if (item.value === '?') {
          nstack.push(evaluate(n1 ? n2 : n3, expr, values));
        } else {
          f = expr.ternaryOps[item.value];
          nstack.push(f(resolveExpression(n1, values), resolveExpression(n2, values), resolveExpression(n3, values)));
        }
      } else if (type === IVAR) {
        if (item.value in expr.functions) {
          nstack.push(expr.functions[item.value]);
        } else if (item.value in expr.unaryOps && expr.parser.isOperatorEnabled(item.value)) {
          nstack.push(expr.unaryOps[item.value]);
        } else {
          var v = values[item.value];
          if (v !== undefined) {
            nstack.push(v);
          } else {
            throw new Error('undefined variable: ' + item.value);
          }
        }
      } else if (type === IOP1) {
        n1 = nstack.pop();
        f = expr.unaryOps[item.value];
        nstack.push(f(resolveExpression(n1, values)));
      } else if (type === IFUNCALL) {
        argCount = item.value;
        args = [];
        while (argCount-- > 0) {
          args.unshift(resolveExpression(nstack.pop(), values));
        }
        f = nstack.pop();
        if (f.apply && f.call) {
          nstack.push(f.apply(undefined, args));
        } else {
          throw new Error(f + ' is not a function');
        }
      } else if (type === IFUNDEF) {
        // Create closure to keep references to arguments and expression
        nstack.push((function () {
          var n2 = nstack.pop();
          var args = [];
          var argCount = item.value;
          while (argCount-- > 0) {
            args.unshift(nstack.pop());
          }
          var n1 = nstack.pop();
          var f = function () {
            var scope = Object.assign({}, values);
            for (var i = 0, len = args.length; i < len; i++) {
              scope[args[i]] = arguments[i];
            }
            return evaluate(n2, expr, scope);
          };
          // f.name = n1
          Object.defineProperty(f, 'name', {
            value: n1,
            writable: false
          });
          values[n1] = f;
          return f;
        })());
      } else if (type === IEXPR) {
        nstack.push(createExpressionEvaluator(item, expr));
      } else if (type === IEXPREVAL) {
        nstack.push(item);
      } else if (type === IMEMBER) {
        n1 = nstack.pop();
        nstack.push(n1[item.value]);
      } else if (type === IENDSTATEMENT) {
        nstack.pop();
      } else if (type === IARRAY) {
        argCount = item.value;
        args = [];
        while (argCount-- > 0) {
          args.unshift(nstack.pop());
        }
        nstack.push(args);
      } else {
        throw new Error('invalid Expression');
      }
    }
    if (nstack.length > 1) {
      throw new Error('invalid Expression (parity)');
    }
    // Explicitly return zero to avoid test issues caused by -0
    return nstack[0] === 0 ? 0 : resolveExpression(nstack[0], values);
  }

  function createExpressionEvaluator(token, expr, values) {
    if (isExpressionEvaluator(token)) return token;
    return {
      type: IEXPREVAL,
      value: function (scope) {
        return evaluate(token.value, expr, scope);
      }
    };
  }

  function isExpressionEvaluator(n) {
    return n && n.type === IEXPREVAL;
  }

  function resolveExpression(n, values) {
    return isExpressionEvaluator(n) ? n.value(values) : n;
  }

  function expressionToString(tokens, toJS) {
    var nstack = [];
    var n1, n2, n3;
    var f, args, argCount;
    for (var i = 0; i < tokens.length; i++) {
      var item = tokens[i];
      var type = item.type;
      if (type === INUMBER) {
        if (typeof item.value === 'number' && item.value < 0) {
          nstack.push('(' + item.value + ')');
        } else if (Array.isArray(item.value)) {
          nstack.push('[' + item.value.map(escapeValue).join(', ') + ']');
        } else {
          nstack.push(escapeValue(item.value));
        }
      } else if (type === IOP2) {
        n2 = nstack.pop();
        n1 = nstack.pop();
        f = item.value;
        if (toJS) {
          if (f === '^') {
            nstack.push('Math.pow(' + n1 + ', ' + n2 + ')');
          } else if (f === 'and') {
            nstack.push('(!!' + n1 + ' && !!' + n2 + ')');
          } else if (f === 'or') {
            nstack.push('(!!' + n1 + ' || !!' + n2 + ')');
          } else if (f === '||') {
            nstack.push('(function(a,b){ return Array.isArray(a) && Array.isArray(b) ? a.concat(b) : String(a) + String(b); }((' + n1 + '),(' + n2 + ')))');
          } else if (f === '==') {
            nstack.push('(' + n1 + ' === ' + n2 + ')');
          } else if (f === '!=') {
            nstack.push('(' + n1 + ' !== ' + n2 + ')');
          } else if (f === '[') {
            nstack.push(n1 + '[(' + n2 + ') | 0]');
          } else {
            nstack.push('(' + n1 + ' ' + f + ' ' + n2 + ')');
          }
        } else {
          if (f === '[') {
            nstack.push(n1 + '[' + n2 + ']');
          } else {
            nstack.push('(' + n1 + ' ' + f + ' ' + n2 + ')');
          }
        }
      } else if (type === IOP3) {
        n3 = nstack.pop();
        n2 = nstack.pop();
        n1 = nstack.pop();
        f = item.value;
        if (f === '?') {
          nstack.push('(' + n1 + ' ? ' + n2 + ' : ' + n3 + ')');
        } else {
          throw new Error('invalid Expression');
        }
      } else if (type === IVAR || type === IVARNAME) {
        nstack.push(item.value);
      } else if (type === IOP1) {
        n1 = nstack.pop();
        f = item.value;
        if (f === '-' || f === '+') {
          nstack.push('(' + f + n1 + ')');
        } else if (toJS) {
          if (f === 'not') {
            nstack.push('(' + '!' + n1 + ')');
          } else if (f === '!') {
            nstack.push('fac(' + n1 + ')');
          } else {
            nstack.push(f + '(' + n1 + ')');
          }
        } else if (f === '!') {
          nstack.push('(' + n1 + '!)');
        } else {
          nstack.push('(' + f + ' ' + n1 + ')');
        }
      } else if (type === IFUNCALL) {
        argCount = item.value;
        args = [];
        while (argCount-- > 0) {
          args.unshift(nstack.pop());
        }
        f = nstack.pop();
        nstack.push(f + '(' + args.join(', ') + ')');
      } else if (type === IFUNDEF) {
        n2 = nstack.pop();
        argCount = item.value;
        args = [];
        while (argCount-- > 0) {
          args.unshift(nstack.pop());
        }
        n1 = nstack.pop();
        if (toJS) {
          nstack.push('(' + n1 + ' = function(' + args.join(', ') + ') { return ' + n2 + ' })');
        } else {
          nstack.push('(' + n1 + '(' + args.join(', ') + ') = ' + n2 + ')');
        }
      } else if (type === IMEMBER) {
        n1 = nstack.pop();
        nstack.push(n1 + '.' + item.value);
      } else if (type === IARRAY) {
        argCount = item.value;
        args = [];
        while (argCount-- > 0) {
          args.unshift(nstack.pop());
        }
        nstack.push('[' + args.join(', ') + ']');
      } else if (type === IEXPR) {
        nstack.push('(' + expressionToString(item.value, toJS) + ')');
      } else if (type === IENDSTATEMENT) ; else {
        throw new Error('invalid Expression');
      }
    }
    if (nstack.length > 1) {
      if (toJS) {
        nstack = [ nstack.join(',') ];
      } else {
        nstack = [ nstack.join(';') ];
      }
    }
    return String(nstack[0]);
  }

  function escapeValue(v) {
    if (typeof v === 'string') {
      return JSON.stringify(v).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
    }
    return v;
  }

  function contains(array, obj) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === obj) {
        return true;
      }
    }
    return false;
  }

  function getSymbols(tokens, symbols, options) {
    options = options || {};
    var withMembers = !!options.withMembers;
    var prevVar = null;

    for (var i = 0; i < tokens.length; i++) {
      var item = tokens[i];
      if (item.type === IVAR || item.type === IVARNAME) {
        if (!withMembers && !contains(symbols, item.value)) {
          symbols.push(item.value);
        } else if (prevVar !== null) {
          if (!contains(symbols, prevVar)) {
            symbols.push(prevVar);
          }
          prevVar = item.value;
        } else {
          prevVar = item.value;
        }
      } else if (item.type === IMEMBER && withMembers && prevVar !== null) {
        prevVar += '.' + item.value;
      } else if (item.type === IEXPR) {
        getSymbols(item.value, symbols, options);
      } else if (prevVar !== null) {
        if (!contains(symbols, prevVar)) {
          symbols.push(prevVar);
        }
        prevVar = null;
      }
    }

    if (prevVar !== null && !contains(symbols, prevVar)) {
      symbols.push(prevVar);
    }
  }

  function Expression(tokens, parser) {
    this.tokens = tokens;
    this.parser = parser;
    this.unaryOps = parser.unaryOps;
    this.binaryOps = parser.binaryOps;
    this.ternaryOps = parser.ternaryOps;
    this.functions = parser.functions;
  }

  Expression.prototype.simplify = function (values) {
    values = values || {};
    return new Expression(simplify(this.tokens, this.unaryOps, this.binaryOps, this.ternaryOps, values), this.parser);
  };

  Expression.prototype.substitute = function (variable, expr) {
    if (!(expr instanceof Expression)) {
      expr = this.parser.parse(String(expr));
    }

    return new Expression(substitute(this.tokens, variable, expr), this.parser);
  };

  Expression.prototype.evaluate = function (values) {
    values = values || {};
    return evaluate(this.tokens, this, values);
  };

  Expression.prototype.toString = function () {
    return expressionToString(this.tokens, false);
  };

  Expression.prototype.symbols = function (options) {
    options = options || {};
    var vars = [];
    getSymbols(this.tokens, vars, options);
    return vars;
  };

  Expression.prototype.variables = function (options) {
    options = options || {};
    var vars = [];
    getSymbols(this.tokens, vars, options);
    var functions = this.functions;
    return vars.filter(function (name) {
      return !(name in functions);
    });
  };

  Expression.prototype.toJSFunction = function (param, variables) {
    var expr = this;
    var f = new Function(param, 'with(this.functions) with (this.ternaryOps) with (this.binaryOps) with (this.unaryOps) { return ' + expressionToString(this.simplify(variables).tokens, true) + '; }'); // eslint-disable-line no-new-func
    return function () {
      return f.apply(expr, arguments);
    };
  };

  var TEOF = 'TEOF';
  var TOP = 'TOP';
  var TNUMBER = 'TNUMBER';
  var TSTRING = 'TSTRING';
  var TPAREN = 'TPAREN';
  var TBRACKET = 'TBRACKET';
  var TCOMMA = 'TCOMMA';
  var TNAME = 'TNAME';
  var TSEMICOLON = 'TSEMICOLON';

  function Token(type, value, index) {
    this.type = type;
    this.value = value;
    this.index = index;
  }

  Token.prototype.toString = function () {
    return this.type + ': ' + this.value;
  };

  function TokenStream(parser, expression) {
    this.pos = 0;
    this.current = null;
    this.unaryOps = parser.unaryOps;
    this.binaryOps = parser.binaryOps;
    this.ternaryOps = parser.ternaryOps;
    this.consts = parser.consts;
    this.expression = expression;
    this.savedPosition = 0;
    this.savedCurrent = null;
    this.options = parser.options;
    this.parser = parser;
  }

  TokenStream.prototype.newToken = function (type, value, pos) {
    return new Token(type, value, pos != null ? pos : this.pos);
  };

  TokenStream.prototype.save = function () {
    this.savedPosition = this.pos;
    this.savedCurrent = this.current;
  };

  TokenStream.prototype.restore = function () {
    this.pos = this.savedPosition;
    this.current = this.savedCurrent;
  };

  TokenStream.prototype.next = function () {
    if (this.pos >= this.expression.length) {
      return this.newToken(TEOF, 'EOF');
    }

    if (this.isWhitespace() || this.isComment()) {
      return this.next();
    } else if (this.isRadixInteger() ||
        this.isNumber() ||
        this.isOperator() ||
        this.isString() ||
        this.isParen() ||
        this.isBracket() ||
        this.isComma() ||
        this.isSemicolon() ||
        this.isNamedOp() ||
        this.isConst() ||
        this.isName()) {
      return this.current;
    } else {
      this.parseError('Unknown character "' + this.expression.charAt(this.pos) + '"');
    }
  };

  TokenStream.prototype.isString = function () {
    var r = false;
    var startPos = this.pos;
    var quote = this.expression.charAt(startPos);

    if (quote === '\'' || quote === '"') {
      var index = this.expression.indexOf(quote, startPos + 1);
      while (index >= 0 && this.pos < this.expression.length) {
        this.pos = index + 1;
        if (this.expression.charAt(index - 1) !== '\\') {
          var rawString = this.expression.substring(startPos + 1, index);
          this.current = this.newToken(TSTRING, this.unescape(rawString), startPos);
          r = true;
          break;
        }
        index = this.expression.indexOf(quote, index + 1);
      }
    }
    return r;
  };

  TokenStream.prototype.isParen = function () {
    var c = this.expression.charAt(this.pos);
    if (c === '(' || c === ')') {
      this.current = this.newToken(TPAREN, c);
      this.pos++;
      return true;
    }
    return false;
  };

  TokenStream.prototype.isBracket = function () {
    var c = this.expression.charAt(this.pos);
    if ((c === '[' || c === ']') && this.isOperatorEnabled('[')) {
      this.current = this.newToken(TBRACKET, c);
      this.pos++;
      return true;
    }
    return false;
  };

  TokenStream.prototype.isComma = function () {
    var c = this.expression.charAt(this.pos);
    if (c === ',') {
      this.current = this.newToken(TCOMMA, ',');
      this.pos++;
      return true;
    }
    return false;
  };

  TokenStream.prototype.isSemicolon = function () {
    var c = this.expression.charAt(this.pos);
    if (c === ';') {
      this.current = this.newToken(TSEMICOLON, ';');
      this.pos++;
      return true;
    }
    return false;
  };

  TokenStream.prototype.isConst = function () {
    var startPos = this.pos;
    var i = startPos;
    for (; i < this.expression.length; i++) {
      var c = this.expression.charAt(i);
      if (c.toUpperCase() === c.toLowerCase()) {
        if (i === this.pos || (c !== '_' && c !== '.' && (c < '0' || c > '9'))) {
          break;
        }
      }
    }
    if (i > startPos) {
      var str = this.expression.substring(startPos, i);
      if (str in this.consts) {
        this.current = this.newToken(TNUMBER, this.consts[str]);
        this.pos += str.length;
        return true;
      }
    }
    return false;
  };

  TokenStream.prototype.isNamedOp = function () {
    var startPos = this.pos;
    var i = startPos;
    for (; i < this.expression.length; i++) {
      var c = this.expression.charAt(i);
      if (c.toUpperCase() === c.toLowerCase()) {
        if (i === this.pos || (c !== '_' && (c < '0' || c > '9'))) {
          break;
        }
      }
    }
    if (i > startPos) {
      var str = this.expression.substring(startPos, i);
      if (this.isOperatorEnabled(str) && (str in this.binaryOps || str in this.unaryOps || str in this.ternaryOps)) {
        this.current = this.newToken(TOP, str);
        this.pos += str.length;
        return true;
      }
    }
    return false;
  };

  TokenStream.prototype.isName = function () {
    var startPos = this.pos;
    var i = startPos;
    var hasLetter = false;
    for (; i < this.expression.length; i++) {
      var c = this.expression.charAt(i);
      if (c.toUpperCase() === c.toLowerCase()) {
        if (i === this.pos && (c === '$' || c === '_')) {
          if (c === '_') {
            hasLetter = true;
          }
          continue;
        } else if (i === this.pos || !hasLetter || (c !== '_' && (c < '0' || c > '9'))) {
          break;
        }
      } else {
        hasLetter = true;
      }
    }
    if (hasLetter) {
      var str = this.expression.substring(startPos, i);
      this.current = this.newToken(TNAME, str);
      this.pos += str.length;
      return true;
    }
    return false;
  };

  TokenStream.prototype.isWhitespace = function () {
    var r = false;
    var c = this.expression.charAt(this.pos);
    while (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      r = true;
      this.pos++;
      if (this.pos >= this.expression.length) {
        break;
      }
      c = this.expression.charAt(this.pos);
    }
    return r;
  };

  var codePointPattern = /^[0-9a-f]{4}$/i;

  TokenStream.prototype.unescape = function (v) {
    var index = v.indexOf('\\');
    if (index < 0) {
      return v;
    }

    var buffer = v.substring(0, index);
    while (index >= 0) {
      var c = v.charAt(++index);
      switch (c) {
        case '\'':
          buffer += '\'';
          break;
        case '"':
          buffer += '"';
          break;
        case '\\':
          buffer += '\\';
          break;
        case '/':
          buffer += '/';
          break;
        case 'b':
          buffer += '\b';
          break;
        case 'f':
          buffer += '\f';
          break;
        case 'n':
          buffer += '\n';
          break;
        case 'r':
          buffer += '\r';
          break;
        case 't':
          buffer += '\t';
          break;
        case 'u':
          // interpret the following 4 characters as the hex of the unicode code point
          var codePoint = v.substring(index + 1, index + 5);
          if (!codePointPattern.test(codePoint)) {
            this.parseError('Illegal escape sequence: \\u' + codePoint);
          }
          buffer += String.fromCharCode(parseInt(codePoint, 16));
          index += 4;
          break;
        default:
          throw this.parseError('Illegal escape sequence: "\\' + c + '"');
      }
      ++index;
      var backslash = v.indexOf('\\', index);
      buffer += v.substring(index, backslash < 0 ? v.length : backslash);
      index = backslash;
    }

    return buffer;
  };

  TokenStream.prototype.isComment = function () {
    var c = this.expression.charAt(this.pos);
    if (c === '/' && this.expression.charAt(this.pos + 1) === '*') {
      this.pos = this.expression.indexOf('*/', this.pos) + 2;
      if (this.pos === 1) {
        this.pos = this.expression.length;
      }
      return true;
    }
    return false;
  };

  TokenStream.prototype.isRadixInteger = function () {
    var pos = this.pos;

    if (pos >= this.expression.length - 2 || this.expression.charAt(pos) !== '0') {
      return false;
    }
    ++pos;

    var radix;
    var validDigit;
    if (this.expression.charAt(pos) === 'x') {
      radix = 16;
      validDigit = /^[0-9a-f]$/i;
      ++pos;
    } else if (this.expression.charAt(pos) === 'b') {
      radix = 2;
      validDigit = /^[01]$/i;
      ++pos;
    } else {
      return false;
    }

    var valid = false;
    var startPos = pos;

    while (pos < this.expression.length) {
      var c = this.expression.charAt(pos);
      if (validDigit.test(c)) {
        pos++;
        valid = true;
      } else {
        break;
      }
    }

    if (valid) {
      this.current = this.newToken(TNUMBER, parseInt(this.expression.substring(startPos, pos), radix));
      this.pos = pos;
    }
    return valid;
  };

  TokenStream.prototype.isNumber = function () {
    var valid = false;
    var pos = this.pos;
    var startPos = pos;
    var resetPos = pos;
    var foundDot = false;
    var foundDigits = false;
    var c;

    while (pos < this.expression.length) {
      c = this.expression.charAt(pos);
      if ((c >= '0' && c <= '9') || (!foundDot && c === '.')) {
        if (c === '.') {
          foundDot = true;
        } else {
          foundDigits = true;
        }
        pos++;
        valid = foundDigits;
      } else {
        break;
      }
    }

    if (valid) {
      resetPos = pos;
    }

    if (c === 'e' || c === 'E') {
      pos++;
      var acceptSign = true;
      var validExponent = false;
      while (pos < this.expression.length) {
        c = this.expression.charAt(pos);
        if (acceptSign && (c === '+' || c === '-')) {
          acceptSign = false;
        } else if (c >= '0' && c <= '9') {
          validExponent = true;
          acceptSign = false;
        } else {
          break;
        }
        pos++;
      }

      if (!validExponent) {
        pos = resetPos;
      }
    }

    if (valid) {
      this.current = this.newToken(TNUMBER, parseFloat(this.expression.substring(startPos, pos)));
      this.pos = pos;
    } else {
      this.pos = resetPos;
    }
    return valid;
  };

  TokenStream.prototype.isOperator = function () {
    var startPos = this.pos;
    var c = this.expression.charAt(this.pos);

    if (c === '+' || c === '-' || c === '*' || c === '/' || c === '%' || c === '^' || c === '?' || c === ':' || c === '.') {
      this.current = this.newToken(TOP, c);
    } else if (c === '∙' || c === '•') {
      this.current = this.newToken(TOP, '*');
    } else if (c === '>') {
      if (this.expression.charAt(this.pos + 1) === '=') {
        this.current = this.newToken(TOP, '>=');
        this.pos++;
      } else {
        this.current = this.newToken(TOP, '>');
      }
    } else if (c === '<') {
      if (this.expression.charAt(this.pos + 1) === '=') {
        this.current = this.newToken(TOP, '<=');
        this.pos++;
      } else {
        this.current = this.newToken(TOP, '<');
      }
    } else if (c === '|') {
      if (this.expression.charAt(this.pos + 1) === '|') {
        this.current = this.newToken(TOP, '||');
        this.pos++;
      } else {
        return false;
      }
    } else if (c === '=') {
      if (this.expression.charAt(this.pos + 1) === '=') {
        this.current = this.newToken(TOP, '==');
        this.pos++;
      } else {
        this.current = this.newToken(TOP, c);
      }
    } else if (c === '!') {
      if (this.expression.charAt(this.pos + 1) === '=') {
        this.current = this.newToken(TOP, '!=');
        this.pos++;
      } else {
        this.current = this.newToken(TOP, c);
      }
    } else {
      return false;
    }
    this.pos++;

    if (this.isOperatorEnabled(this.current.value)) {
      return true;
    } else {
      this.pos = startPos;
      return false;
    }
  };

  TokenStream.prototype.isOperatorEnabled = function (op) {
    return this.parser.isOperatorEnabled(op);
  };

  TokenStream.prototype.getCoordinates = function () {
    var line = 0;
    var column;
    var newline = -1;
    do {
      line++;
      column = this.pos - newline;
      newline = this.expression.indexOf('\n', newline + 1);
    } while (newline >= 0 && newline < this.pos);

    return {
      line: line,
      column: column
    };
  };

  TokenStream.prototype.parseError = function (msg) {
    var coords = this.getCoordinates();
    throw new Error('parse error [' + coords.line + ':' + coords.column + ']: ' + msg);
  };

  function ParserState(parser, tokenStream, options) {
    this.parser = parser;
    this.tokens = tokenStream;
    this.current = null;
    this.nextToken = null;
    this.next();
    this.savedCurrent = null;
    this.savedNextToken = null;
    this.allowMemberAccess = options.allowMemberAccess !== false;
  }

  ParserState.prototype.next = function () {
    this.current = this.nextToken;
    return (this.nextToken = this.tokens.next());
  };

  ParserState.prototype.tokenMatches = function (token, value) {
    if (typeof value === 'undefined') {
      return true;
    } else if (Array.isArray(value)) {
      return contains(value, token.value);
    } else if (typeof value === 'function') {
      return value(token);
    } else {
      return token.value === value;
    }
  };

  ParserState.prototype.save = function () {
    this.savedCurrent = this.current;
    this.savedNextToken = this.nextToken;
    this.tokens.save();
  };

  ParserState.prototype.restore = function () {
    this.tokens.restore();
    this.current = this.savedCurrent;
    this.nextToken = this.savedNextToken;
  };

  ParserState.prototype.accept = function (type, value) {
    if (this.nextToken.type === type && this.tokenMatches(this.nextToken, value)) {
      this.next();
      return true;
    }
    return false;
  };

  ParserState.prototype.expect = function (type, value) {
    if (!this.accept(type, value)) {
      var coords = this.tokens.getCoordinates();
      throw new Error('parse error [' + coords.line + ':' + coords.column + ']: Expected ' + (value || type));
    }
  };

  ParserState.prototype.parseAtom = function (instr) {
    var unaryOps = this.tokens.unaryOps;
    function isPrefixOperator(token) {
      return token.value in unaryOps;
    }

    if (this.accept(TNAME) || this.accept(TOP, isPrefixOperator)) {
      instr.push(new Instruction(IVAR, this.current.value));
    } else if (this.accept(TNUMBER)) {
      instr.push(new Instruction(INUMBER, this.current.value));
    } else if (this.accept(TSTRING)) {
      instr.push(new Instruction(INUMBER, this.current.value));
    } else if (this.accept(TPAREN, '(')) {
      this.parseExpression(instr);
      this.expect(TPAREN, ')');
    } else if (this.accept(TBRACKET, '[')) {
      if (this.accept(TBRACKET, ']')) {
        instr.push(new Instruction(IARRAY, 0));
      } else {
        var argCount = this.parseArrayList(instr);
        instr.push(new Instruction(IARRAY, argCount));
      }
    } else {
      throw new Error('unexpected ' + this.nextToken);
    }
  };

  ParserState.prototype.parseExpression = function (instr) {
    var exprInstr = [];
    if (this.parseUntilEndStatement(instr, exprInstr)) {
      return;
    }
    this.parseVariableAssignmentExpression(exprInstr);
    if (this.parseUntilEndStatement(instr, exprInstr)) {
      return;
    }
    this.pushExpression(instr, exprInstr);
  };

  ParserState.prototype.pushExpression = function (instr, exprInstr) {
    for (var i = 0, len = exprInstr.length; i < len; i++) {
      instr.push(exprInstr[i]);
    }
  };

  ParserState.prototype.parseUntilEndStatement = function (instr, exprInstr) {
    if (!this.accept(TSEMICOLON)) return false;
    if (this.nextToken && this.nextToken.type !== TEOF && !(this.nextToken.type === TPAREN && this.nextToken.value === ')')) {
      exprInstr.push(new Instruction(IENDSTATEMENT));
    }
    if (this.nextToken.type !== TEOF) {
      this.parseExpression(exprInstr);
    }
    instr.push(new Instruction(IEXPR, exprInstr));
    return true;
  };

  ParserState.prototype.parseArrayList = function (instr) {
    var argCount = 0;

    while (!this.accept(TBRACKET, ']')) {
      this.parseExpression(instr);
      ++argCount;
      while (this.accept(TCOMMA)) {
        this.parseExpression(instr);
        ++argCount;
      }
    }

    return argCount;
  };

  ParserState.prototype.parseVariableAssignmentExpression = function (instr) {
    this.parseConditionalExpression(instr);
    while (this.accept(TOP, '=')) {
      var varName = instr.pop();
      var varValue = [];
      var lastInstrIndex = instr.length - 1;
      if (varName.type === IFUNCALL) {
        if (!this.tokens.isOperatorEnabled('()=')) {
          throw new Error('function definition is not permitted');
        }
        for (var i = 0, len = varName.value + 1; i < len; i++) {
          var index = lastInstrIndex - i;
          if (instr[index].type === IVAR) {
            instr[index] = new Instruction(IVARNAME, instr[index].value);
          }
        }
        this.parseVariableAssignmentExpression(varValue);
        instr.push(new Instruction(IEXPR, varValue));
        instr.push(new Instruction(IFUNDEF, varName.value));
        continue;
      }
      if (varName.type !== IVAR && varName.type !== IMEMBER) {
        throw new Error('expected variable for assignment');
      }
      this.parseVariableAssignmentExpression(varValue);
      instr.push(new Instruction(IVARNAME, varName.value));
      instr.push(new Instruction(IEXPR, varValue));
      instr.push(binaryInstruction('='));
    }
  };

  ParserState.prototype.parseConditionalExpression = function (instr) {
    this.parseOrExpression(instr);
    while (this.accept(TOP, '?')) {
      var trueBranch = [];
      var falseBranch = [];
      this.parseConditionalExpression(trueBranch);
      this.expect(TOP, ':');
      this.parseConditionalExpression(falseBranch);
      instr.push(new Instruction(IEXPR, trueBranch));
      instr.push(new Instruction(IEXPR, falseBranch));
      instr.push(ternaryInstruction('?'));
    }
  };

  ParserState.prototype.parseOrExpression = function (instr) {
    this.parseAndExpression(instr);
    while (this.accept(TOP, 'or')) {
      var falseBranch = [];
      this.parseAndExpression(falseBranch);
      instr.push(new Instruction(IEXPR, falseBranch));
      instr.push(binaryInstruction('or'));
    }
  };

  ParserState.prototype.parseAndExpression = function (instr) {
    this.parseComparison(instr);
    while (this.accept(TOP, 'and')) {
      var trueBranch = [];
      this.parseComparison(trueBranch);
      instr.push(new Instruction(IEXPR, trueBranch));
      instr.push(binaryInstruction('and'));
    }
  };

  var COMPARISON_OPERATORS = ['==', '!=', '<', '<=', '>=', '>', 'in'];

  ParserState.prototype.parseComparison = function (instr) {
    this.parseAddSub(instr);
    while (this.accept(TOP, COMPARISON_OPERATORS)) {
      var op = this.current;
      this.parseAddSub(instr);
      instr.push(binaryInstruction(op.value));
    }
  };

  var ADD_SUB_OPERATORS = ['+', '-', '||'];

  ParserState.prototype.parseAddSub = function (instr) {
    this.parseTerm(instr);
    while (this.accept(TOP, ADD_SUB_OPERATORS)) {
      var op = this.current;
      this.parseTerm(instr);
      instr.push(binaryInstruction(op.value));
    }
  };

  var TERM_OPERATORS = ['*', '/', '%'];

  ParserState.prototype.parseTerm = function (instr) {
    this.parseFactor(instr);
    while (this.accept(TOP, TERM_OPERATORS)) {
      var op = this.current;
      this.parseFactor(instr);
      instr.push(binaryInstruction(op.value));
    }
  };

  ParserState.prototype.parseFactor = function (instr) {
    var unaryOps = this.tokens.unaryOps;
    function isPrefixOperator(token) {
      return token.value in unaryOps;
    }

    this.save();
    if (this.accept(TOP, isPrefixOperator)) {
      if (this.current.value !== '-' && this.current.value !== '+') {
        if (this.nextToken.type === TPAREN && this.nextToken.value === '(') {
          this.restore();
          this.parseExponential(instr);
          return;
        } else if (this.nextToken.type === TSEMICOLON || this.nextToken.type === TCOMMA || this.nextToken.type === TEOF || (this.nextToken.type === TPAREN && this.nextToken.value === ')')) {
          this.restore();
          this.parseAtom(instr);
          return;
        }
      }

      var op = this.current;
      this.parseFactor(instr);
      instr.push(unaryInstruction(op.value));
    } else {
      this.parseExponential(instr);
    }
  };

  ParserState.prototype.parseExponential = function (instr) {
    this.parsePostfixExpression(instr);
    while (this.accept(TOP, '^')) {
      this.parseFactor(instr);
      instr.push(binaryInstruction('^'));
    }
  };

  ParserState.prototype.parsePostfixExpression = function (instr) {
    this.parseFunctionCall(instr);
    while (this.accept(TOP, '!')) {
      instr.push(unaryInstruction('!'));
    }
  };

  ParserState.prototype.parseFunctionCall = function (instr) {
    var unaryOps = this.tokens.unaryOps;
    function isPrefixOperator(token) {
      return token.value in unaryOps;
    }

    if (this.accept(TOP, isPrefixOperator)) {
      var op = this.current;
      this.parseAtom(instr);
      instr.push(unaryInstruction(op.value));
    } else {
      this.parseMemberExpression(instr);
      while (this.accept(TPAREN, '(')) {
        if (this.accept(TPAREN, ')')) {
          instr.push(new Instruction(IFUNCALL, 0));
        } else {
          var argCount = this.parseArgumentList(instr);
          instr.push(new Instruction(IFUNCALL, argCount));
        }
      }
    }
  };

  ParserState.prototype.parseArgumentList = function (instr) {
    var argCount = 0;

    while (!this.accept(TPAREN, ')')) {
      this.parseExpression(instr);
      ++argCount;
      while (this.accept(TCOMMA)) {
        this.parseExpression(instr);
        ++argCount;
      }
    }

    return argCount;
  };

  ParserState.prototype.parseMemberExpression = function (instr) {
    this.parseAtom(instr);
    while (this.accept(TOP, '.') || this.accept(TBRACKET, '[')) {
      var op = this.current;

      if (op.value === '.') {
        if (!this.allowMemberAccess) {
          throw new Error('unexpected ".", member access is not permitted');
        }

        this.expect(TNAME);
        instr.push(new Instruction(IMEMBER, this.current.value));
      } else if (op.value === '[') {
        if (!this.tokens.isOperatorEnabled('[')) {
          throw new Error('unexpected "[]", arrays are disabled');
        }

        this.parseExpression(instr);
        this.expect(TBRACKET, ']');
        instr.push(binaryInstruction('['));
      } else {
        throw new Error('unexpected symbol: ' + op.value);
      }
    }
  };

  function add(a, b) {
    return Number(a) + Number(b);
  }

  function sub(a, b) {
    return a - b;
  }

  function mul(a, b) {
    return a * b;
  }

  function div(a, b) {
    return a / b;
  }

  function mod(a, b) {
    return a % b;
  }

  function concat(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.concat(b);
    }
    return '' + a + b;
  }

  function equal(a, b) {
    return a === b;
  }

  function notEqual(a, b) {
    return a !== b;
  }

  function greaterThan(a, b) {
    return a > b;
  }

  function lessThan(a, b) {
    return a < b;
  }

  function greaterThanEqual(a, b) {
    return a >= b;
  }

  function lessThanEqual(a, b) {
    return a <= b;
  }

  function andOperator(a, b) {
    return Boolean(a && b);
  }

  function orOperator(a, b) {
    return Boolean(a || b);
  }

  function inOperator(a, b) {
    return contains(b, a);
  }

  function sinh(a) {
    return ((Math.exp(a) - Math.exp(-a)) / 2);
  }

  function cosh(a) {
    return ((Math.exp(a) + Math.exp(-a)) / 2);
  }

  function tanh(a) {
    if (a === Infinity) return 1;
    if (a === -Infinity) return -1;
    return (Math.exp(a) - Math.exp(-a)) / (Math.exp(a) + Math.exp(-a));
  }

  function asinh(a) {
    if (a === -Infinity) return a;
    return Math.log(a + Math.sqrt((a * a) + 1));
  }

  function acosh(a) {
    return Math.log(a + Math.sqrt((a * a) - 1));
  }

  function atanh(a) {
    return (Math.log((1 + a) / (1 - a)) / 2);
  }

  function log10(a) {
    return Math.log(a) * Math.LOG10E;
  }

  function neg(a) {
    return -a;
  }

  function not(a) {
    return !a;
  }

  function trunc(a) {
    return a < 0 ? Math.ceil(a) : Math.floor(a);
  }

  function random(a) {
    return Math.random() * (a || 1);
  }

  function factorial(a) { // a!
    return gamma(a + 1);
  }

  function isInteger(value) {
    return isFinite(value) && (value === Math.round(value));
  }

  var GAMMA_G = 4.7421875;
  var GAMMA_P = [
    0.99999999999999709182,
    57.156235665862923517, -59.597960355475491248,
    14.136097974741747174, -0.49191381609762019978,
    0.33994649984811888699e-4,
    0.46523628927048575665e-4, -0.98374475304879564677e-4,
    0.15808870322491248884e-3, -0.21026444172410488319e-3,
    0.21743961811521264320e-3, -0.16431810653676389022e-3,
    0.84418223983852743293e-4, -0.26190838401581408670e-4,
    0.36899182659531622704e-5
  ];

  // Gamma function from math.js
  function gamma(n) {
    var t, x;

    if (isInteger(n)) {
      if (n <= 0) {
        return isFinite(n) ? Infinity : NaN;
      }

      if (n > 171) {
        return Infinity; // Will overflow
      }

      var value = n - 2;
      var res = n - 1;
      while (value > 1) {
        res *= value;
        value--;
      }

      if (res === 0) {
        res = 1; // 0! is per definition 1
      }

      return res;
    }

    if (n < 0.5) {
      return Math.PI / (Math.sin(Math.PI * n) * gamma(1 - n));
    }

    if (n >= 171.35) {
      return Infinity; // will overflow
    }

    if (n > 85.0) { // Extended Stirling Approx
      var twoN = n * n;
      var threeN = twoN * n;
      var fourN = threeN * n;
      var fiveN = fourN * n;
      return Math.sqrt(2 * Math.PI / n) * Math.pow((n / Math.E), n) *
        (1 + (1 / (12 * n)) + (1 / (288 * twoN)) - (139 / (51840 * threeN)) -
        (571 / (2488320 * fourN)) + (163879 / (209018880 * fiveN)) +
        (5246819 / (75246796800 * fiveN * n)));
    }

    --n;
    x = GAMMA_P[0];
    for (var i = 1; i < GAMMA_P.length; ++i) {
      x += GAMMA_P[i] / (n + i);
    }

    t = n + GAMMA_G + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x;
  }

  function stringOrArrayLength(s) {
    if (Array.isArray(s)) {
      return s.length;
    }
    return String(s).length;
  }

  function hypot() {
    var sum = 0;
    var larg = 0;
    for (var i = 0; i < arguments.length; i++) {
      var arg = Math.abs(arguments[i]);
      var div;
      if (larg < arg) {
        div = larg / arg;
        sum = (sum * div * div) + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else {
        sum += arg;
      }
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }

  function condition(cond, yep, nope) {
    return cond ? yep : nope;
  }

  /**
  * Decimal adjustment of a number.
  * From @escopecz.
  *
  * @param {Number} value The number.
  * @param {Integer} exp  The exponent (the 10 logarithm of the adjustment base).
  * @return {Number} The adjusted value.
  */
  function roundTo(value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math.round(value);
    }
    value = +value;
    exp = -(+exp);
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  function setVar(name, value, variables) {
    if (variables) variables[name] = value;
    return value;
  }

  function arrayIndex(array, index) {
    return array[index | 0];
  }

  function max(array) {
    if (arguments.length === 1 && Array.isArray(array)) {
      return Math.max.apply(Math, array);
    } else {
      return Math.max.apply(Math, arguments);
    }
  }

  function min(array) {
    if (arguments.length === 1 && Array.isArray(array)) {
      return Math.min.apply(Math, array);
    } else {
      return Math.min.apply(Math, arguments);
    }
  }

  function arrayMap(f, a) {
    if (typeof f !== 'function') {
      throw new Error('First argument to map is not a function');
    }
    if (!Array.isArray(a)) {
      throw new Error('Second argument to map is not an array');
    }
    return a.map(function (x, i) {
      return f(x, i);
    });
  }

  function arrayFold(f, init, a) {
    if (typeof f !== 'function') {
      throw new Error('First argument to fold is not a function');
    }
    if (!Array.isArray(a)) {
      throw new Error('Second argument to fold is not an array');
    }
    return a.reduce(function (acc, x, i) {
      return f(acc, x, i);
    }, init);
  }

  function arrayFilter(f, a) {
    if (typeof f !== 'function') {
      throw new Error('First argument to filter is not a function');
    }
    if (!Array.isArray(a)) {
      throw new Error('Second argument to filter is not an array');
    }
    return a.filter(function (x, i) {
      return f(x, i);
    });
  }

  function stringOrArrayIndexOf(target, s) {
    if (!(Array.isArray(s) || typeof s === 'string')) {
      throw new Error('Second argument to indexOf is not a string or array');
    }

    return s.indexOf(target);
  }

  function arrayJoin(sep, a) {
    if (!Array.isArray(a)) {
      throw new Error('Second argument to join is not an array');
    }

    return a.join(sep);
  }

  function sign(x) {
    return ((x > 0) - (x < 0)) || +x;
  }

  var ONE_THIRD = 1/3;
  function cbrt(x) {
    return x < 0 ? -Math.pow(-x, ONE_THIRD) : Math.pow(x, ONE_THIRD);
  }

  function expm1(x) {
    return Math.exp(x) - 1;
  }

  function log1p(x) {
    return Math.log(1 + x);
  }

  function log2(x) {
    return Math.log(x) / Math.LN2;
  }

  function Parser(options) {
    this.options = options || {};
    this.unaryOps = {
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      asin: Math.asin,
      acos: Math.acos,
      atan: Math.atan,
      sinh: Math.sinh || sinh,
      cosh: Math.cosh || cosh,
      tanh: Math.tanh || tanh,
      asinh: Math.asinh || asinh,
      acosh: Math.acosh || acosh,
      atanh: Math.atanh || atanh,
      sqrt: Math.sqrt,
      cbrt: Math.cbrt || cbrt,
      log: Math.log,
      log2: Math.log2 || log2,
      ln: Math.log,
      lg: Math.log10 || log10,
      log10: Math.log10 || log10,
      expm1: Math.expm1 || expm1,
      log1p: Math.log1p || log1p,
      abs: Math.abs,
      ceil: Math.ceil,
      floor: Math.floor,
      round: Math.round,
      trunc: Math.trunc || trunc,
      '-': neg,
      '+': Number,
      exp: Math.exp,
      not: not,
      length: stringOrArrayLength,
      '!': factorial,
      sign: Math.sign || sign
    };

    this.binaryOps = {
      '+': add,
      '-': sub,
      '*': mul,
      '/': div,
      '%': mod,
      '^': Math.pow,
      '||': concat,
      '==': equal,
      '!=': notEqual,
      '>': greaterThan,
      '<': lessThan,
      '>=': greaterThanEqual,
      '<=': lessThanEqual,
      and: andOperator,
      or: orOperator,
      'in': inOperator,
      '=': setVar,
      '[': arrayIndex
    };

    this.ternaryOps = {
      '?': condition
    };

    this.functions = {
      random: random,
      fac: factorial,
      min: min,
      max: max,
      hypot: Math.hypot || hypot,
      pyt: Math.hypot || hypot, // backward compat
      pow: Math.pow,
      atan2: Math.atan2,
      'if': condition,
      gamma: gamma,
      roundTo: roundTo,
      map: arrayMap,
      fold: arrayFold,
      filter: arrayFilter,
      indexOf: stringOrArrayIndexOf,
      join: arrayJoin
    };

    this.consts = {
      E: Math.E,
      PI: Math.PI,
      'true': true,
      'false': false
    };
  }

  Parser.prototype.parse = function (expr) {
    var instr = [];
    var parserState = new ParserState(
      this,
      new TokenStream(this, expr),
      { allowMemberAccess: this.options.allowMemberAccess }
    );

    parserState.parseExpression(instr);
    parserState.expect(TEOF, 'EOF');

    return new Expression(instr, this);
  };

  Parser.prototype.evaluate = function (expr, variables) {
    return this.parse(expr).evaluate(variables);
  };

  var sharedParser = new Parser();

  Parser.parse = function (expr) {
    return sharedParser.parse(expr);
  };

  Parser.evaluate = function (expr, variables) {
    return sharedParser.parse(expr).evaluate(variables);
  };

  var optionNameMap = {
    '+': 'add',
    '-': 'subtract',
    '*': 'multiply',
    '/': 'divide',
    '%': 'remainder',
    '^': 'power',
    '!': 'factorial',
    '<': 'comparison',
    '>': 'comparison',
    '<=': 'comparison',
    '>=': 'comparison',
    '==': 'comparison',
    '!=': 'comparison',
    '||': 'concatenate',
    'and': 'logical',
    'or': 'logical',
    'not': 'logical',
    '?': 'conditional',
    ':': 'conditional',
    '=': 'assignment',
    '[': 'array',
    '()=': 'fndef'
  };

  function getOptionName(op) {
    return optionNameMap.hasOwnProperty(op) ? optionNameMap[op] : op;
  }

  Parser.prototype.isOperatorEnabled = function (op) {
    var optionName = getOptionName(op);
    var operators = this.options.operators || {};

    return !(optionName in operators) || !!operators[optionName];
  };

  const mathParser = new Parser({
    allowMemberAccess: true,
  });
  mathParser.consts = {
    E: Math.E,
    e: Math.E,
    PI: Math.PI,
    pi: Math.PI,
    sq2: Math.SQRT2
  };

  action("xyzmathsurfacefunction", () => {
    let options = {};
    for (const key in xyzpresets) {
      options[key] = key;
    }
    let msettings = localStorage.getItem("mt_xyzSettings");
    let presetBeforeUpdate;
    if (msettings != null) {
      msettings = JSON.parse(msettings);
      presetBeforeUpdate = msettings.preset;
    } else {
      msettings = xyzpresets.TwistedTorus;
      presetBeforeUpdate = "TwistedTorus";
    }
    let justOpened = true;
    let dial = new Dialog({
      title: "XYZ Math Surface Function",
      part_order: ["form", "lines"],
      buttons: ["Save Settings To Memory", "Confirm", "Cancel"],
      cancelIndex: 2,
      confirmIndex: 1,
      width: 650,
      onFormChange(data) {
        if (justOpened) {
          // this just for skipping loading saved settings
          justOpened = false;
          return;
        }
        if (data.preset == presetBeforeUpdate) return; // stop call stack
        presetBeforeUpdate = data.preset;

        this.setFormValues(xyzpresets[data.preset]);
      },
      form: {
        preset: { label: "Preset", type: "select", options: () => options },
        x: {
          label: "X",
          type: "text",
          value: xyzpresets["TwistedTorus"].x,
        },
        y: {
          label: "Y",
          type: "text",
          value: xyzpresets["TwistedTorus"].y,
        },
        z: {
          label: "Z",
          type: "text",
          value: xyzpresets["TwistedTorus"].z,
        },
        scale: { label: "Scale", type: "number", value: 1 },
        _: "_",
        uRange: {
          label: "U Range",
          type: "vector",
          dimensions: 2,
          value: [0, 6.2831854820251465],
        },
        uDivs: { label: "U Divisions", type: "number", min: 2, value: 32 },
        uWrap: { label: "U Wrap", type: "checkbox", value: true },
        vRange: {
          label: "V Range",
          type: "vector",
          dimensions: 2,
          value: [0, 6.2831854820251465],
        },
        vDivs: { label: "V Divisions", type: "number", min: 2, value: 16 },
        vWrap: { label: "V Wrap", type: "checkbox", value: true },
        vClose: { label: "V Close", type: "checkbox", value: true },
        __: "_",
        variables: {
          label: "Variables",
          type: "textarea",
          placeholder: "List the variables you want to use via name = value",
        },
      },
      onConfirm(out) {
        const declarations = out.variables.split(`\n`);

        /**
         * @type {{[P in string]: Expression }}
         */
        const declarationsMap = {};
        for (const declaration of declarations) {
          let [key, val] = declaration.split(/=(.+)/);
          key = key.replace(/[\s;]/g, "");

          if (val !== undefined) {
            val = val.trim();
            declarationsMap[key] = mathParser.parse(val);
          }
        }
        /**
         * Declarations that do not depend on other variable declarations.
         * Examples of static declarations:
         * ```
         * a = 2; 
         * b = 2 * pi;
         * c = a * pi; // non static declaration
         * ```
         */
        const staticDeclarations = [];
        for (const key in declarationsMap) {
          const variables = declarationsMap[key].variables();
          if (variables.length == 0) {
            staticDeclarations.push(key);
          }
        }

        function runEdit(s, overrideVariables = {}, amended = false) {
          const declarationValues = {};

          let elements = [];
          Undo.initEdit({ elements, selection: true }, amended);
          let mesh = new Mesh({ vertices: {} });

          let [umin, umax] = out.uRange;
          let usteps = s.uDivs;
          let uinc = (umax - umin) / usteps;

          let [vmin, vmax] = out.vRange;
          let vsteps = s.vDivs;
          let vinc = (vmax - vmin) / vsteps;

          let uRange = usteps + 1;
          let vRange = vsteps + 1;
          if (out.uWrap) uRange -= 1;
          if (out.vWrap) vRange -= 1;

          let vertices = [];
          let uvPositions = [];
          for (let j = 0; j < vRange; j++) {
            let v = vmin + j * vinc;
            for (let i = 0; i < uRange; i++) {
              let u = umin + i * uinc;

              const context = {
                u,
                v,
                /**
                 * Backwards compatibility for p.u and p.v
                 */
                p: { u, v },
              };
              // Disable overwriting
              freezeProperty(context, "u");
              freezeProperty(context, "v");
              freezeProperty(context, "p");
              freezeProperty(context.p, "u");
              freezeProperty(context.p, "v");

              for (const key in declarationsMap) {
                if (key in overrideVariables) {
                  declarationValues[key] = context[key] = overrideVariables[key];
                  continue;
                }
                const expression = declarationsMap[key];
                declarationValues[key] = context[key] = expression.evaluate(context);
              }

              let x = +mathParser.evaluate(out.x, context) * out.scale;
              let y = +mathParser.evaluate(out.y, context) * out.scale;
              let z = +mathParser.evaluate(out.z, context) * out.scale;
              if (isNaN(x) || Math.abs(x) === Infinity) {
                x = 0;
              }
              if (isNaN(y) || Math.abs(y) === Infinity) {
                y = 0;
              }
              if (isNaN(z) || Math.abs(z) === Infinity) {
                z = 0;
              }

              vertices.push(mesh.addVertices([x, y, z])[0]);
              uvPositions.push([i, j]);
            }
          }
          for (let y = 0; y < vsteps; y++) {
            for (let x = 0; x < usteps; x++) {
              let yNext = y + 1;
              let xNext = x + 1;

              if (out.vWrap && yNext >= vRange) yNext = 0;
              if (out.uWrap && xNext >= uRange) xNext = 0;

              let vertexIndices = [
                yNext * uRange + xNext,
                yNext * uRange + x,
                y * uRange + x,
                y * uRange + xNext,
              ];
              let face = new MeshFace(mesh, {
                vertices: [
                  vertices[vertexIndices[0]],
                  vertices[vertexIndices[1]],
                  vertices[vertexIndices[2]],
                  vertices[vertexIndices[3]],
                ],
              });
              let uv = [
                uvPositions[vertexIndices[0]]
                  .slice()
                  .V3_divide(uRange - 1, vRange - 1)
                  .V3_multiply(Project._texture_width, Project._texture_height),
                uvPositions[vertexIndices[1]]
                  .slice()
                  .V3_divide(uRange - 1, vRange - 1)
                  .V3_multiply(Project._texture_width, Project._texture_height),
                uvPositions[vertexIndices[2]]
                  .slice()
                  .V3_divide(uRange - 1, vRange - 1)
                  .V3_multiply(Project._texture_width, Project._texture_height),
                uvPositions[vertexIndices[3]]
                  .slice()
                  .V3_divide(uRange - 1, vRange - 1)
                  .V3_multiply(Project._texture_width, Project._texture_height),
              ];
              face.uv[face.vertices[0]] = [uv[0][0], uv[0][1]];
              face.uv[face.vertices[1]] = [uv[1][0], uv[1][1]];
              face.uv[face.vertices[2]] = [uv[2][0], uv[2][1]];
              face.uv[face.vertices[3]] = [uv[3][0], uv[3][1]];
              mesh.addFaces(face);
            }
          }
          // fills end caps
          if (out.vClose && out.uWrap && !out.vWrap) {
            for (let x = 1; x < usteps - 1; x++) {
              let face1 = new MeshFace(mesh, {
                vertices: [
                  vertices[usteps - 1],
                  vertices[usteps - 1 - x],
                  vertices[usteps - 2 - x],
                ],
              });
              let face2 = new MeshFace(mesh, {
                vertices: [
                  vertices[vsteps * uRange],
                  vertices[vsteps * uRange + x],
                  vertices[vsteps * uRange + x + 1],
                ],
              });
              mesh.addFaces(face1, face2);
            }
          }
          mesh.init();
          elements.push(mesh);
          mesh.select();
          Undo.finishEdit("MTools: Generate Mesh");

          return declarationValues;
        }
        const declarationValues = runEdit(out);
        Undo.amendEdit(
          {
            uDivs: { label: "U divisions", value: out.uDivs, min: 2 },
            vDivs: { label: "V divisions", value: out.vDivs, min: 2 },

            ...Object.fromEntries(staticDeclarations.map(key => ['@value/' +key, {
              label: snakeToPascal(key),
              value: declarationValues[key],
              step: 0.1
            }])),
          },
          (form) => {
            const variables = {};
            for (const key in form) {
              if (key.startsWith('@value/')) {
                variables[key.substring('@value/'.length)] = form[key];
              }
            }
            runEdit(form, variables, true);
          }
        );
      },
    });
    dial.show();
    if (msettings != null) {
      dial.setFormValues(msettings);
    }

    let saveBtn = $(`button:contains("Save Settings To Memory")`);
    saveBtn.off("click");
    saveBtn.on("click", function () {
      let mmsettings = dial.getFormResult();
      localStorage.setItem("mt_xyzSettings", JSON.stringify(mmsettings));
    });
  });

  function runEdit$1(selected, s, amended = false) {
    let elements = [];
    Undo.initEdit({ elements, selection: true }, amended);
    const geometry = new THREE[selected + "BufferGeometry"](
      s.radius,
      s.detail - 1
    );
    let mesh = nonIndexed(geometry);

    mesh.init();
    elements.push(mesh);
    mesh.select();
    UVEditor.setAutoSize(null, true, Object.keys(mesh.faces));
    Undo.finishEdit("MTools: Generate Mesh");
  }
  const dialog$1 = new Dialog({
    title: "Quick Primitive [ Polyhedron ]",
    form: {
      select: {
        label: "Hedron",
        type: "select",
        options: {
          Icosahedron: "Icosahedron",
          Dodecahedron: "Dodecahedron",
          Octahedron: "Octahedron",
          Tetrahedron: "Tetrahedron",
        },
      },
      radius: { label: "Radius", value: 8, type: "number" },
      detail: {
        label: "Detail",
        value: 2,
        min: 1,
        max: 6,
        type: "number",
      },
    },
    onConfirm(out) {
      runEdit$1(out.select, out);
      Undo.amendEdit(
        {
          radius: { label: "Radius", value: out.radius },
          detail: { label: "Detail", value: out.detail, min: 1, max: 6 },
        },
        (form) => {
          runEdit$1(out.select, form, true);
        }
      );
    },
  });
  action("polyhedron", () => {
    dialog$1.show();
  });

  action("quickprimitives");

  function runEdit(s, amended = false) {
    let elements = [];
    Undo.initEdit({ elements, selection: true }, amended);
    const geometry = new THREE.TorusKnotBufferGeometry(
      s.r,
      s.t,
      s.ts,
      s.rs,
      s.p,
      s.q
    );
    let mesh = indexed(geometry, true);

    mesh.init();
    elements.push(mesh);
    mesh.select();
    UVEditor.setAutoSize(null, true, Object.keys(mesh.faces));
    Undo.finishEdit("MTools: Generate Mesh");
  }
  const dialog = new Dialog({
    title: "Quick Primitive [ Torus Knot ]",
    lines: [
      `<p class="small_text subtle" style="display: inline;">P and Q should be coprime integers meaning non should be divisible by the other.</p>`,
    ],
    form: {
      r: { label: "Torus Radius", type: "number", value: 8 },
      t: { label: "Tube Radius", type: "number", value: 3.4, step: 0.2 },
      ts: { label: "Tubular Segments", type: "number", value: 25 },
      rs: { label: "Radial Segments", type: "number", value: 5 },
      p: { label: "P", type: "number", value: 2 },
      q: { label: "Q", type: "number", value: 3 },
    },
    onConfirm(out) {
      runEdit(out);
      let s = out;

      Undo.amendEdit(
        {
          r: { label: "Torus Radius", type: "number", value: s.r },
          t: {
            label: "Tube Radius",
            type: "number",
            value: s.t,
            step: 0.2,
          },
          ts: { label: "Tubular Segments", type: "number", value: s.ts },
          rs: { label: "Radial Segments", type: "number", value: s.rs },
          p: { label: "P", type: "number", value: s.p },
          q: { label: "Q", type: "number", value: s.q },
        },
        (form) => {
          runEdit(form, true);
        }
      );
    },
  });
  action("torusknot", () => {
    dialog.show();
  });

  action("generators");

  const deletables = [];
  /**
   * @type {Array<THREE.Object3D>}
   */
  const meshToolTips = [];
  BBPlugin.register(PLUGIN_ID, {
    new_repository_format: true,
    title: "MTools",
    author: "Malik12tree",
    icon: "icon.png",
    description: "Adds powerful mesh modeling tools, operators and generators!",
    version: "2.0.2",
    min_version: "4.9.4",
    variant: "both",
    creation_date: "2022-04-09",
    has_changelog: true,
    tags: ["Format: Generic Model", "Mesh", "Tool"],
    onload() {

      Mesh.prototype.menu.structure.unshift(qualifyName("tools"));
      Mesh.prototype.menu.structure.unshift(qualifyName("operators"));
      MenuBar.addAction(qualifyName("generators"), "filter");
    },
    onuninstall() {
      storage.clear();
    },
    onunload() {
      for (const deletable of deletables) {
        deletable.delete();
      }
      for (const object of meshToolTips) {
        scene.remove(object);
      }

      for (const actionId in ACTIONS) {
        const id = qualifyName(actionId);
        BarItems[id]?.delete();
      }
    },
  });

})();
