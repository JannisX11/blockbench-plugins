(function () {
  'use strict';

  const MESH_CONDITION = {
    modes: ["edit"],
    features: ["meshes"],
  };
  const OBJECT_MODE_CONDITION = Object.assign(
    {
      method: () =>
        Mesh.selected.length && BarItems["selection_mode"].value == "object",
    },
    MESH_CONDITION
  );
  const NON_OBJECT_MODE_CONDITION = Object.assign(
    {
      method: () =>
        Mesh.selected.length && BarItems["selection_mode"].value != "object",
    },
    MESH_CONDITION
  );
  const FACE_MODE_CONDITION = Object.assign(
    {
      method: () =>
        Mesh.selected.length && BarItems["selection_mode"].value == "face",
    },
    MESH_CONDITION
  );
  const VERTEX_MODE_CONDITION = Object.assign(
    {
      method: () =>
        Mesh.selected.length && BarItems["selection_mode"].value == "vertex",
    },
    MESH_CONDITION
  );

  const ACTIONS = /** @type {const}  */ ({
    laplacian_smooth: {
      name: "Laplacian Smooth",
      icon: "blur_on",
      description:
        "Smoothes selected vertices by averaging the position of neighboring vertices",
      condition: NON_OBJECT_MODE_CONDITION,
    },
    to_sphere: {
      name: "To Sphere",
      icon: "change_circle",
      description: "Casts selected vertices into a sphere based on an influence",
      condition: NON_OBJECT_MODE_CONDITION,
    },
    poke: {
      name: "Poke Faces",
      description: "Creates a fan out of a face",
      icon: "control_camera",
      condition: FACE_MODE_CONDITION,
    },
    tris_to_quad: {
      name: "Triangles To Quad",
      description: "Tries to dissolve adjacent triangles into a quad",
      icon: `fas.fa-external-link-square-alt`,
      condition: FACE_MODE_CONDITION,
    },
    triangulate: {
      name: "Triangulate Faces",
      description: "Cuttes a face into triangles",
      icon: "pie_chart_outline",
      condition: FACE_MODE_CONDITION,
    },
    uv_project_view: {
      name: "Project From View",
      description: "Projects the selected faces to the UV map from the camera",
      icon: "view_in_ar",
    },
    uv_turnaround_projection: {
      name: "Cubic Projection",
      description: "Unwraps the UV map from the 6 sides of a cube",
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
      keybind: new Keybind({ key: "l", ctrl: true }),
      condition: VERTEX_MODE_CONDITION,
    },
    shrink_selection: {
      name: "Shrink Selection",
      icon: "unfold_less_double",
      keybind: new Keybind({ key: "k", ctrl: true }),
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
        "Splits and duplicates edges within a mesh, breaking 'links' between faces around those split edges",
      condition: OBJECT_MODE_CONDITION,
    },
    scatter: {
      name: "Scatter",
      description: "scatters selected meshes on the active mesh",
      icon: "scatter_plot",
      condition: OBJECT_MODE_CONDITION,
    },
    array_elements: {
      name: "Array",
      icon: "fas.fa-layer-group",
      description:
        "Creates an array of copies of the base object, with each copy being offset from the previous one",
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
        "Generates Terrains procedurally with fully customized settings",
      icon: "terrain",
    },
    terrainse: {
      name: "Terrain Style Editor",
      description:
        "Configure the values of the style `Custom` for the Terrain Generator",
      icon: "draw",
    },
    textmesh: {
      name: "Text Mesh",
      icon: "format_size",
    },
    xyzmathsurfacefunction: {
      name: "XYZ Math Surface",
      icon: "fas.fa-brain",
      description:
        "Creates an xyz surface based on given inputs. Also contains already-made 23 presets!",
    },
    quickprimitives: {
      name: "Quick Primitives",
      icon: "fas.fa-shapes",
      children: ["polyhedron", "torusknot"],
    },
    polyhedron: {
      name: "Polyhedron",
      icon: "offline_bolt",
    },
    torusknot: {
      name: "Torus Knot",
      icon: "offline_bolt",
    },
  });

  const qualifyName = (id) => (id == "" ? "meshtools" : `@meshtools/${id}`);

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
    return new Action(qualifyName(id), options);
  }

  /**
   *
   * @param {THREE.Vector3} offset _
   */
  function runEdit$a(selected, offset = [1, 0, 0], count = 1, amend = false) {
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
    runEdit$a(selected);
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
        runEdit$a(selected, [form.x, form.y, form.z], form.count, true);
      }
    );
  });

  const gradient256 = {};
  for (let x = 0; x < 256; x++) gradient256[[x, 0]] = x / 255;

  const _m_ = new THREE.Mesh();
  function rotationFromDir(vector) {
    _m_.lookAt(vector);
    return _m_.rotation;
  }
  function normalOfTri(A, B, C) {
    const { vec1, vec2, vec3, vec4 } = Reusable;
    vec1.set(A.x, A.y, A.z);
    vec2.set(B.x, B.y, B.z);
    vec3.set(C.x, C.y, C.z);
    return vec4.crossVectors(vec2.sub(vec1), vec3.sub(vec1)).clone();
  }
  function compileRGB(s) {
    let string = "";
    for (let i = 4; i < s.length - 1; i++) {
      string += s[i];
    }
    string = string.split(",");
    return new THREE.Color(string[0] / 255, string[1] / 255, string[2] / 255);
  }
  function fixedVec(vec) {
    return vec.map((e) => Math.roundTo(e, 5));
  }
  function areVectorsCollinear(v1, v2) {
    v1 = fixedVec(v1);
    v2 = fixedVec(v2);

    const cross = Reusable.vec1.fromArray(v1).cross(Reusable.vec2.fromArray(v2));
    for (let i = 0; i < 3; i++) {
      if (!Math.isBetween(cross[getAxisLetter(i)], -0.005, 0.005)) {
        return false;
      }
    }
    return true;
  }

  const perlin = {
    reusablevec3: new THREE.Vector3(),
    perlinVectorSeed: new THREE.Vector3(12.9898, 78.233, 190.124),

    randomAt(x, y, z) {
      const vec = this.reusablevec3.set(x, y, z);
      return (Math.sin(this.perlinVectorSeed.dot(vec)) * 43758.5453) % 1;
    },
    interpolate(a0, a1, w) {
      if (0.0 >= w) return a0;
      if (1.0 <= w) return a1;
      return (a1 - a0) * (3.0 - w * 2.0) * w * w + a0;
    },
    grad(ix, iy, iz) {
      const rand = this.randomAt(ix, iy, iz) * Math.PI * 2.0;

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
      x = (x + 128.0) % 128.0;
      y = (y + 128.0) % 128.0;
      z = (z + 128.0) % 128.0;

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

  function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  }

  /** @param {Mesh} mesh */
  function computeVertexNeighborhood(mesh) {
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

  function getAdjacentVertices(arr, index) {
    return [
      arr[(index + 1 + arr.length) % arr.length],
      arr[index],
      arr[(index - 1 + arr.length) % arr.length],
    ];
  }
  function sign(p1, p2, p3) {
    return (p1[0] - p3[0]) * (p2[2] - p3[2]) - (p2[0] - p3[0]) * (p1[2] - p3[2]);
  }
  function PointInTri(point, triangle) {
    let d1, d2, d3, has_neg, has_pos;
    d1 = sign(point, triangle[0], triangle[1]);
    d2 = sign(point, triangle[1], triangle[2]);
    d3 = sign(point, triangle[2], triangle[0]);
    has_neg = d1 < 0 || d2 < 0 || d3 < 0;
    has_pos = d1 > 0 || d2 > 0 || d3 > 0;
    return !(has_neg && has_pos);
  }

  function cross(pointA, pointB) {
    return pointA[0] * pointB[1] - pointA[1] * pointB[0];
  }

  // Earcut algorithm
  function Triangulate(polygon, normal) {
    /* found out that BB only supports quads/tris
      polygons. but im gonna keep it just incase one day it does*/
    const vertices = polygon;
    const indexs = [];
    const triangles = [];

    for (let i = 0; i < vertices.length; i++) indexs.push(i);
    let si = 0;

    // comute coplanar position
    const plane = new THREE.Plane();
    plane.setFromCoplanarPoints(
      polygon[0].V3_toThree(),
      polygon[1].V3_toThree(),
      polygon[2].V3_toThree()
    );

    const rotation = cameraTargetToRotation([0, 0, 0], normal);
    const e = new THREE.Euler(
      Math.degToRad(-rotation[1] - 90),
      Math.degToRad(rotation[0]),
      0
    );

    for (let i = 0; i < vertices.length; i++) {
      vertices[i] = plane
        .projectPoint(vertices[i].V3_toThree(), Reusable.vec1)
        .applyEuler(e)
        .toArray();
      vertices[i][1] = 0;
    }

    // 1000 is a safety limit
    while (indexs.length > 3 && si <= 1000) {
      for (let i = 0; i < indexs.length; i++) {
        const earlyIndexes = getAdjacentVertices(indexs, i);
        const CurrentTri = [
          vertices[earlyIndexes[0]],
          vertices[earlyIndexes[1]],
          vertices[earlyIndexes[2]],
        ];

        // CHECK 1: if angle BAC (where "A" is the current vertex) is convex (< 180deg)
        const pointA = CurrentTri[2].V2_subtract(CurrentTri[1]);
        const pointB = CurrentTri[1].V2_subtract(CurrentTri[1]);

        const crossProductBetweenPoints = cross(pointA, pointB);
        if (crossProductBetweenPoints <= 0) {
          // CHECK 2: if any of the vertices isnt inside the current triangle
          let inTri = false;
          for (let j = 0; j < vertices.length; j++) {
            if (
              earlyIndexes[0] == j ||
              earlyIndexes[1] == j ||
              earlyIndexes[2] == j
            )
              continue;
            if (PointInTri(vertices[j], CurrentTri)) {
              inTri = true;
              break;
            }
          }
          if (!inTri) {
            // Accepted; remove the current vertex and add the ear to the array
            triangles.push(earlyIndexes.sort((a, b) => b - a));
            indexs.splice(i, 1);
            break;
          }
        }
      }
      si++;
    }
    triangles.push(indexs.slice().sort((a, b) => b - a));
    return triangles;
  }

  function worldToScreen(p, camera, width, height) {
    // https://stackoverflow.com/a/27448966/16079500
    var vector = p.project(camera);

    vector.x = ((vector.x + 1) / 2) * width;
    vector.y = (-(vector.y - 1) / 2) * height;

    return vector;
  }

  function getEqualRes() {
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

  // https://base64.guru/developers/javascript/examples/unicode-strings
  // fix stupid bug with unicodes
  function utoa(data) {
    return btoa(unescape(encodeURIComponent(data)));
  }

  action("expand_selection", () => {
    Mesh.selected.forEach((mesh) => {
      const neighborMap = computeVertexNeighborhood(mesh);

      const vertices = mesh.getSelectedVertices().slice();

      for (let vertexKey of vertices) {
        const neighbors = neighborMap[vertexKey];
        Project.mesh_selection[mesh.uuid].vertices.safePush(...neighbors);
      }
    });
    Canvas.updateView({ elements: Mesh.selected, selection: true });
  });

  function runEdit$9(amend = false, influence = 1, iterations = 1) {
    Undo.initEdit({ elements: Mesh.selected, selection: true }, amend);

    Mesh.selected.forEach((mesh) => {
      if (!influence || !iterations) return; //

      const { vertices } = mesh;
      const neighborMap = computeVertexNeighborhood(mesh);

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
    runEdit$9();
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
      (form) => runEdit$9(true, form.influence / 100, form.iterations)
    );
  });

  function runEdit$8(amended, depth = 0) {
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
    runEdit$8(false);
    Undo.amendEdit(
      {
        depth: { type: "number", value: 0, label: "Depth" },
      },
      (form) => {
        runEdit$8(true, form.depth);
      }
    );
  });

  function runEdit$7(mesh, group, density, amend = false) {
    const meshes = [];
    Undo.initEdit({ elements: meshes, selection: true, group }, amend);

    const tmesh = mesh.mesh; // threejs mesh

    const faces = tmesh.geometry.getIndex();
    const vertices = tmesh.geometry.getAttribute("position");
    const l = faces.count;

    let selected = Mesh.selected;
    for (let d = 0; d < density; d++) {
      const i = Math.round((Math.random() * l) / 3) * 3; // random face index
      const t0 = new THREE.Vector3(
        vertices.getX(faces.getX(i)),
        vertices.getY(faces.getX(i)),
        vertices.getZ(faces.getX(i))
      );
      const t1 = new THREE.Vector3(
        vertices.getX(faces.getY(i)),
        vertices.getY(faces.getY(i)),
        vertices.getZ(faces.getY(i))
      );
      const t2 = new THREE.Vector3(
        vertices.getX(faces.getZ(i)),
        vertices.getY(faces.getZ(i)),
        vertices.getZ(faces.getZ(i))
      );

      tmesh.localToWorld(t0);
      tmesh.localToWorld(t1);
      tmesh.localToWorld(t2);

      // f*ed up midpoint theroem
      const pointA = new THREE.Vector3().lerpVectors(t0, t1, Math.random());
      const pointB = new THREE.Vector3().lerpVectors(t0, t2, Math.random());
      const pointF = new THREE.Vector3().lerpVectors(
        pointA,
        pointB,
        Math.random()
      );

      // scatter on points
      const otherMesh =
        selected[Math.floor(selected.length * Math.random())].duplicate();

      otherMesh.removeFromParent();
      otherMesh.parent = "root";
      Outliner.root.push(otherMesh);

      const normal = normalOfTri(t0, t1, t2);

      const rotation = rotationFromDir(normal);
      otherMesh.rotation[0] = Math.radToDeg(rotation.x);
      otherMesh.rotation[1] = Math.radToDeg(rotation.y);
      otherMesh.rotation[2] = Math.radToDeg(rotation.z);

      otherMesh.origin = pointF.toArray();

      otherMesh.addTo(group);
      meshes.push(otherMesh);
    }
    Undo.finishEdit("MTools: Scatter meshes");
    Canvas.updatePositions();
  }
  action("scatter", function () {
    if (Mesh.selected.length < 2) {
      Blockbench.showQuickMessage("At least two meshes must be selected");
      return;
    }

    const mesh = Mesh.selected.last();
    mesh.unselect();

    const group = new Group({ name: "instances_on_" + mesh.name });
    group.init();

    runEdit$7(mesh, group, 3);

    Undo.amendEdit(
      {
        density: {
          type: "number",
          value: 3,
          label: "Density",
          min: 0,
          max: 100,
        },
      },
      (form) => {
        runEdit$7(mesh, group, form.density, true);
      }
    );
  });

  action("shrink_selection", () => {
    Mesh.selected.forEach((mesh) => {
      const neighborMap = computeVertexNeighborhood(mesh);

      const vertices = mesh.getSelectedVertices().slice();

      for (let vertexKey of vertices) {
        const neighbors = neighborMap[vertexKey];
        let atleastOneNeighborIsNotSelected = false;

        for (const neigbor of neighbors) {
          atleastOneNeighborIsNotSelected = !vertices.includes(neigbor);

          if (atleastOneNeighborIsNotSelected) break;
        }

        if (atleastOneNeighborIsNotSelected) {
          Project.mesh_selection[mesh.uuid].vertices.remove(vertexKey);
        }
      }
    });
    Canvas.updateView({ elements: Mesh.selected, selection: true });
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

  function runEdit$6(angle = 30, amend = false) {
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
    runEdit$6(180);
    Undo.amendEdit(
      {
        angle: { label: "Angle", value: 180, min: 0, max: 180 },
      },
      (form) => {
        runEdit$6(form.angle, true);
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

  function runEdit$5(amend, influence = 100) {
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
    runEdit$5(false, 100);
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
        runEdit$5(true, form.influence);
      }
    );
  });

  action("triangulate", () => {
    Undo.initEdit({ elements: Mesh.selected, selection: true });
    /* selected meshes */
    Mesh.selected.forEach((mesh) => {
      /* selected faces */
      mesh.getSelectedFaces().forEach((key) => {
        let face = mesh.faces[key];
        let SortedV = face.getSortedVertices();
        if (!(SortedV.length <= 3)) {
          let triangles = Triangulate(
            SortedV.map((a) => {
              return mesh.vertices[a];
            }),
            face.getNormal(true)
          );
          // create faces
          for (let i = 0; i < triangles.length; i++) {
            let new_face = new MeshFace(mesh, face).extend({
              vertices: [
                SortedV[triangles[i][0]],
                SortedV[triangles[i][2]],
                SortedV[triangles[i][1]],
              ],
            });
            mesh.addFaces(new_face);
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

  action("tris_to_quad", () => {
    Undo.initEdit({ elements: Mesh.selected, selection: true });
    /* selected meshes */
    Mesh.selected.forEach((mesh) =>
      /* selected faces */
      mesh.getSelectedFaces().forEach((_face) => {
        const face = mesh.faces[_face];

        if (!face || face.vertices.length != 3) return;

        const adjacentFaces = [];
        const vertices = face.getSortedVertices();
        const faceNormal = face.getNormal();

        for (let i = 0; i < 3; i++) {
          const currentAjcFaceData = face.getAdjacentFace(i);
          if (!currentAjcFaceData) continue;

          const currentAjcFaceKey = currentAjcFaceData.key;
          const currentAjcFace = currentAjcFaceData.face;

          adjacentFaces.push(currentAjcFaceKey);

          if (currentAjcFace?.vertices?.length != 3) continue;
          if (i != 0 && adjacentFaces.last() == adjacentFaces[i]) break;

          // Check Normals
          if (
            !currentAjcFace.isSelected() ||
            !areVectorsCollinear(currentAjcFace.getNormal(), faceNormal)
          )
            continue;

          const currentVertices = currentAjcFace.getSortedVertices();
          const uniqueVertex = vertices.find(
            (key) => !currentVertices.includes(key)
          );
          const uniqueUvKey = currentVertices.find(
            (key) => !vertices.includes(key)
          );
          currentVertices.push(uniqueVertex);

          const new_quad = new MeshFace(mesh, {
            vertices: currentVertices,
          });

          if (!areVectorsCollinear(new_quad.getNormal(), faceNormal)) continue;

          new_quad.uv = face.uv;
          new_quad.uv[uniqueUvKey] = currentAjcFace.uv[uniqueUvKey];
          new_quad.texture = face.texture;
          mesh.addFaces(new_quad);
          delete mesh.faces[currentAjcFaceKey];
          delete mesh.faces[_face];
          break;
        }
      })
    );
    Undo.finishEdit("MTools: Convert selected Triangles to Quads");
    Canvas.updateView({
      elements: Mesh.selected,
      element_aspects: { geometry: true, uv: true, faces: true },
      selection: true,
    });
  });

  action("uv_mapping");

  function runEdit$4(preview, preseveAspect, amend) {
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

    const aspect = preseveAspect
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
    runEdit$4(preview, true, false);

    Undo.amendEdit(
      {
        preserve_aspect: {
          type: "number",
          value: 1,
          label: "Preserve Aspect",
          min: 0,
          max: 1,
        },
      },
      (form) => runEdit$4(preview, form.preserve_aspect, true)
    );
  });

  function runEdit$3(margin, split, amend) {
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
        let S_res = getEqualRes();
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
    runEdit$3(0.1, true, false);
    Undo.amendEdit(
      {
        margin: {
          type: "number",
          value: 0,
          label: "margin",
          min: 0,
          max: 100,
        },
        split: { type: "number", label: "Split", value: 1, min: 0, max: 1 },
      },
      (form) => {
        runEdit$3(form.margin, form.split, true);
      }
    );
  });

  action("");

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

  new TerrainGen({
    name: "Open Terrain",
    settings: {
      time: { label: "Time", type: "number", min: 0, value: 0, step: 1 },
      scale: { label: "Scale", type: "number", min: 0, value: 25 },
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
      scale: { label: "Scale", type: "number", min: 0, value: 25 },
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
      scale: { label: "Scale", type: "number", min: 0, value: 25 },
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
      scale: { label: "Scale", type: "number", min: 0, value: 25 },
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
      label: "Width",
      type: "number",
      value: 32,
      min: 1,
      max: 255,
    },
    height: {
      label: "Length",
      type: "number",
      value: 32,
      min: 1,
      max: 255,
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
          customStyle.forEach((h) => (h.color = compileRGB(h.col)));
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
              let x = i + topLeftX;
              let y = j + topLeftY;
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
          color: compileRGB(currentColor),
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
  var _RobotoRegular = {
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

  // TODO FIXME
  var RobotoRegular = JSON.stringify(_RobotoRegular);

  function runEdit$2(text, font, s, amended = false) {
    let elements = [];
    Undo.initEdit({ elements, selection: true }, amended);
    const geometry = new THREE.TextGeometry(text, {
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
    let mesh = nonIndexed(geometry);

    mesh.init();
    elements.push(mesh);
    mesh.select();
    Undo.finishEdit("MTools: Generate Mesh");
  }
  const dialog$2 = new Dialog({
    title: "Generate Text",
    lines: [
      `<style>
            #mt_typeface {
              display: flex;
              left: 20px;
              right: 0;
              gap: 5px;
              cursor: pointer;
            }
            #mt_typeface:hover {
              color: var(--color-light);
            }
            </style>`,
      //<i class="material-icons">spellcheck</i>
      `<a id="mt_typeface" class=""><span style="text-decoration: underline;">Go to TypeFace converter</span></a>`,
      `<p class="small_text subtle" style="display: inline;">when converting a font into a typeface font using the link above, make sure to disable "Reverse font direction".</p>`,
    ],
    form: {
      text: { label: "Text", type: "textarea", value: "Hello, World!" },
      file: {
        label: "OpenType Font (Optional)",
        type: "file",
        extensions: ["json"],
        filetype: "JSON",
        readtype: "text",
      },
      size: { label: "Size", type: "number", value: 8, min: 0 },
      height: { label: "Thickness", type: "number", value: 2, min: 0 },
      curveSegments: {
        label: "Resoultion",
        type: "number",
        value: 1,
        min: 0,
      },
      _: "_",
      bevelThickness: {
        label: "bevelThickness",
        type: "number",
        value: 0,
        min: 0,
      },
      bevelSize: { label: "bevelSize", type: "number", value: 8, min: 0 },
      bevelOffset: {
        label: "bevelOffset",
        type: "number",
        value: 0,
        min: 0,
      },
      bevelSegments: {
        label: "bevelSegments",
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
        content = this.form.file.content;
        if (!content.includes(`"glyphs"`)) {
          Blockbench.showQuickMessage("Not a valid OpenType font");
          throw new Error("Not a valid OpenType font");
        }
      }

      let base64 = "data:text/plain;base64," + utoa(content);
      const loader = new THREE.FontLoader();

      loader.load(base64, function (font) {
        runEdit$2(out.text, font, out);

        let s = out; // lazyness moment
        Undo.amendEdit(
          {
            size: {
              label: "Size",
              type: "number",
              value: s.size,
              min: 0,
            },
            height: {
              label: "Thickness",
              type: "number",
              value: s.height,
              min: 0,
            },
            curveSegments: {
              label: "Resoultion",
              type: "number",
              value: s.curveSegments,
              min: 0,
            },
            bevelThickness: {
              label: "bevelThickness",
              type: "number",
              value: s.bevelThickness,
              min: 0,
            },
            bevelSize: {
              label: "bevelSize",
              type: "number",
              value: s.bevelSize,
              min: 0,
            },
            bevelOffset: {
              label: "bevelOffset",
              type: "number",
              value: s.bevelOffset,
              min: 0,
            },
            bevelSegments: {
              label: "bevelSegments",
              type: "number",
              value: s.bevelSegments,
              min: 0,
            },
          },
          (form) => {
            runEdit$2(out.text, font, form, true);
          }
        );
      });
    },
  });
  action("textmesh", () => {
    dialog$2.show();
    $("#mt_typeface")[0].onclick = function () {
      Blockbench.openLink("http://gero3.github.io/facetype.js/");
    };
  });

  var TwistedTorus = {
  	x: "-cos(p.u)*(6-(5/4 + sin(3*p.v))*sin(p.v-3*p.u))",
  	y: "-(6-(5/4 + sin(3*p.v))*sin(p.v-3*p.u))*sin(p.u)",
  	z: "cos(p.v-3*p.u)*(5/4+sin(3*p.v))",
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
  	x: "(p.u-3.3379)",
  	y: "cos(p.u)*sin(p.v)",
  	z: "cos(p.u)*cos(p.v)",
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
  	x: "(sq2 * cos(2*p.u)*pow(cos(p.v),2) + cos(p.u)*sin(2*p.v)) / (2 - alpha *sq2*sin(3*p.u)*sin(2*p.v))",
  	y: "(sq2 * sin(2*p.u)*pow(cos(p.v),2) - sin(p.u)*sin(2*p.v)) / (2 - alpha *sq2*sin(3*p.u)*sin(2*p.v))",
  	z: "(3*pow(cos(p.v),2)) / (2 - alpha*sq2*sin(3*p.u)*sin(2*p.v))",
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
  	variables: "sq2 = 1.4142135623730951\nalpha=1"
  };
  var Hexahedron = {
  	x: "pow(cos(p.v),3)*pow(cos(p.u),3)",
  	y: "pow(sin(p.u),3)",
  	z: "pow(sin(p.v),3)*pow(cos(p.u),3)",
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
  	x: "(3*(1+sin(p.v)) + 2*(1-cos(p.v)/2)*cos(p.u))*cos(p.v)",
  	y: "(4+2*(1-cos(p.v)/2)*cos(p.u))*sin(p.v)",
  	z: "-2*(1-cos(p.v)/2)*sin(p.u)",
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
  	x: "(cos(p.v)+p.u*cos(p.v/2)*cos(p.v))",
  	y: "(p.u*sin(p.v/2))",
  	z: "(sin(p.v)+p.u*cos(p.v/2)*sin(p.v))",
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
  	x: "-p.u + (2*rr*cosh(alpha*p.u)*sinh(alpha*p.u))/denom",
  	y: "(2*ww*cosh(alpha*p.u)*(-(ww*cos(p.v)*cos(ww*p.v)) - sin(p.v)*sin(ww*p.v)))/denom",
  	z: "(2*ww*cosh(alpha*p.u)*(-(ww*sin(p.v)*cos(ww*p.v)) + cos(p.v)*sin(ww*p.v)))/denom",
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
  	variables: "alpha = 0.4\nrr= 1 - pow(alpha,2)\nww = sqrt(rr)\ndenom = alpha*( pow(ww*cosh(alpha*p.u),2) + pow(alpha*sin(ww*p.v),2) )"
  };
  var RidgedTorus = {
  	x: "outerradius*cos(p.u)+(ridgepower*sin(numofridges*p.u)+innerradius)*cos(p.u)*cos(p.v)",
  	y: "outerradius*sin(p.u)+(ridgepower*sin(numofridges*p.u)+innerradius)*sin(p.u)*cos(p.v)",
  	z: "(ridgepower*sin(numofridges*p.u)+innerradius)*sin(p.v)",
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
  	variables: "outerradius = 5\nridgepower = 0.6\ninnerradius = 2\nnumofridges = 10"
  };
  var CliffordTorus = {
  	x: "cos(p.u+p.v)/(sq2+cos(p.v-p.u))",
  	y: "sin(p.v-p.u)/(sq2+cos(p.v-p.u))",
  	z: "sin(p.u+p.v)/(sq2+cos(p.v-p.u))",
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
  	x: "(dd*(cc - aa*cos(p.u)*cos(p.v) ) + bb*bb*cos(p.u)) / denom",
  	y: "(bb*sin(p.u)*(aa-dd*cos(p.v) ) )/denom",
  	z: "(bb*sin(p.v)*(cc*cos(p.u)-dd ) )/denom",
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
  	variables: "aa = 1\nbb = 0.98\ncc = 0.199\ndd  = 0.3\ndenom = (aa-cc*cos(p.u)*cos(p.v))"
  };
  var Shell = {
  	x: "(cos(p.v)*(1+cos(p.u))*sin(p.v/8))",
  	y: "(sin(p.u)*sin(p.v/8)+cos(p.v/8)*1.5)",
  	z: "(sin(p.v)*(1+cos(p.u))*sin(p.v/8))",
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
  	x: "p.u-sin(p.u)*cosh(p.v)",
  	y: "4*sin(1/2*p.u)*sinh(p.v/2)",
  	z: "1-cos(p.u)*cosh(p.v)",
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
  	x: "radius*cos(p.u)*sin(p.v)",
  	y: "2*(((cos(p.v)+ln(tan(p.v/2)+1E-2)) + twistrot*p.u)+3.4985)",
  	z: "radius*sin(p.u)*sin(p.v)",
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
  	variables: "radius = 4\ntwistrot=0.2"
  };
  var Catenoid = {
  	x: "2*cosh(p.v/2)*cos(p.u)",
  	y: "p.v",
  	z: "2*cosh(p.v/2)*sin(p.u)",
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
  	x: "p.v*cos(p.u)",
  	y: "p.v*sin(p.u)",
  	z: "(0.4*p.u-2.5383)",
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
  	x: "p.u",
  	y: "sin(pi* ( pow(p.u,2) + pow(p.v,2) ) )/2",
  	z: "p.v",
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
  	x: "p.u -pow(p.u,3)/3  + p.u*pow(p.v,2)",
  	y: "pow(p.u,2) - pow(p.v,2)",
  	z: "p.v -pow(p.v,3)/3  + p.v*pow(p.u,2)",
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
  	x: "sinh(p.v)*sin(p.u)",
  	y: "3*p.u",
  	z: "-sinh(p.v)*cos(p.u)",
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
  	x: "(1-0.1*cos(p.v))*cos(p.u)/0.1",
  	y: "0.1*(sin(p.v) + p.u/1.7 -10)/0.1 + 5",
  	z: "(1-0.1*cos(p.v))*sin(p.u)/0.1",
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
  	x: "(sinh(p.v)*cos(3*p.u))/(1+cosh(p.u)*cosh(p.v))",
  	y: "(cosh(p.v)*sinh(p.u))/(1+cosh(p.u)*cosh(p.v))",
  	z: "(sinh(p.v)*sin(3*p.u))/(1+cosh(p.u)*cosh(p.v))",
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
  	x: "2.2*(2*cosh(p.v/2)*cos(p.u))",
  	y: "1.51166 * (2*cosh(p.v/2)*sin(p.u) * sin((2.2*(2*cosh(p.v/2)*cos(p.u)) - -11.0404)*2*pi*1/22.0513) + 1.8*(p.v) * cos((2.2*(2*cosh(p.v/2)*cos(p.u)) - -11.0404)*2*pi*1/22.0513))",
  	z: "1.51166 * (2*cosh(p.v/2)*sin(p.u) * cos((2.2*(2*cosh(p.v/2)*cos(p.u)) - -11.0404)*2*pi*1/22.0513) - 1.8*(p.v) * sin((2.2*(2*cosh(p.v/2)*cos(p.u)) - -11.0404)*2*pi*1/22.0513))",
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
  	x: "cos(p.u)*cos(p.v)+sin((sin(p.u)+1)*2*pi)",
  	y: "4*sin(p.u)",
  	z: "cos(p.u)*sin(p.v)+cos((sin(p.u)+1)*2*pi)",
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
  	x: "sin(p.u)",
  	y: "sin(p.v)",
  	z: "sin(p.u+p.v)",
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
  	x: "1.2*(1 -p.v/(2*pi))*cos(3*p.v)*(1 + cos(p.u)) + 3*cos(3*p.v)",
  	y: "9*p.v/(2*pi) + 1.2*(1 - p.v/(2*pi))*sin(p.u)",
  	z: "1.2*(1 -p.v/(2*pi))*sin(3*p.v)*(1 + cos(p.u)) + 3*sin(3*p.v)",
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
  	x: "(2*p.u/(p.u*p.u+p.v*p.v+1))",
  	y: "((p.u*p.u+p.v*p.v-1)/(p.u*p.u+p.v*p.v+1))",
  	z: "(2*p.v/(p.u*p.u+p.v*p.v+1))",
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
  	x: "(1+0.5*cos(p.u))*cos(p.v)",
  	y: "0.5*sin(p.u)",
  	z: "(1+0.5*cos(p.u))*sin(p.v)",
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

  let mtMolangParser;
  let currentMTVariablesTextContent = "";
  let molangScript = $('script[src="lib/molang.umd.js"]')[0];
  //https://stackoverflow.com/questions/148441/how-can-i-get-the-content-of-the-file-specified-as-the-src-of-a-script-tag
  function printScriptTextContent(script, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", script.src);
    xhr.onreadystatechange = (_) => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
        cb(xhr.responseText);
    };
    xhr.send();
  }
  // this is so stupid
  // just an add-in of more functions
  printScriptTextContent(molangScript, function (f) {
    eval(
      f
        .replace("Molang", "_Molang_")
        .replace(
          `case"random_integer":return new u(125,s[0],s[1],s[2])`,
          `case"random_integer":return new u(125,s[0],s[1],s[2]);case 'acosh':return new u(126, s[0]);case 'asinh':return new u(127, s[0]);case 'atanh':return new u(128, s[0]);case 'cosh':return new u(129, s[0]);case 'sinh':return new u(130, s[0]);case 'tan':return new u(131, s[0]);case'tanh':return new u(132, s[0])`
        )
        .replace(
          "case 125:return r.randomInt(v(n.a),v(n.b))",
          "case 125:return r.randomInt(v(n.a),v(n.b));case 126:return Math.acosh(v(n.a));case 127:return Math.asinh(v(n.a));case 128:return Math.atanh(v(n.a));case 129:return Math.cosh(v(n.a));case 130:return Math.sinh(v(n.a));case 131:return Math.tan(v(n.a));case 132:return Math.tanh(v(n.a))"
        )
    );
    mtMolangParser = new _Molang_();
    mtMolangParser.use_radians = true;

    // stolen from Animator.MolangParser.variableHandler;
    mtMolangParser.variableHandler = function (variable) {
      var inputs = currentMTVariablesTextContent.split(`\n`);
      var i = 0;
      while (i < inputs.length) {
        let key, val;
        [key, val] = inputs[i].split(/=(.+)/);
        key = key.replace(/[\s;]/g, "");
        if (key === variable && val !== undefined) {
          val = val.trim();
          return val[0] == `'` ? val : mtMolangParser.parse(val);
        }
        i++;
      }
    };
  });
  const mathFuncs = [
    "abs",
    "acos",
    "asin",
    "atan",
    "atan2",
    "ceil",
    "clamp",
    "cos",
    "die_roll",
    "die_roll_integer",
    "exp",
    "floor",
    "hermite_blend",
    "lerp",
    "lerprotate",
    "ln",
    "max",
    "min",
    "min_angle",
    "mod",
    "pi",
    "pow",
    "random",
    "random_integer",
    "round",
    "sin",
    "sqrt",
    "trunc",
    "acosh",
    "asinh",
    "atanh",
    "cosh",
    "sinh",
    "tan",
    "tanh",
  ];
  function mtParse(string) {
    mathFuncs.forEach((f) => {
      if (f == "pi") string = string.replaceAll(f, "math." + f);
      else string = string.replaceAll(f + "(", "math." + f + "(");
    });
    return string.replaceAll("amath.", "a");
  }

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
        out.x = mtParse(out.x);
        out.y = mtParse(out.y);
        out.z = mtParse(out.z);
        currentMTVariablesTextContent = mtParse(out.variables);
        function runEdit(s, amended = false) {
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

              mtMolangParser.global_variables = { "p.u": u, "p.v": v };

              let x = mtMolangParser.parse(out.x) * out.scale;
              let y = mtMolangParser.parse(out.y) * out.scale;
              let z = mtMolangParser.parse(out.z) * out.scale;
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
        }
        runEdit(out);
        Undo.amendEdit(
          {
            uDivs: { label: "U divisions", value: out.uDivs, min: 2 },
            vDivs: { label: "V divisions", value: out.vDivs, min: 2 },
          },
          (form) => {
            runEdit(form, true);
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

  function runEdit$1(s, amended = false) {
    let elements = [];
    Undo.initEdit({ elements, selection: true }, amended);
    const geometry = new THREE[out.select + "BufferGeometry"](
      s.radius,
      s.detail - 1
    );
    let mesh = nonIndexed(geometry);

    mesh.init();
    elements.push(mesh);
    mesh.select();
    UVEditor.setAutoSize(null, true, Object.keys(mesh.faces));
    UVEditor.selected_faces.empty();
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
      runEdit$1(out);
      Undo.amendEdit(
        {
          radius: { label: "Radius", value: out.radius },
          detail: { label: "Detail", value: out.detail, min: 1, max: 6 },
        },
        (form) => {
          runEdit$1(form, true);
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
    UVEditor.selected_faces.empty();
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

  BBPlugin.register("mesh_tools", {
    new_repository_format: true,
    title: "MTools",
    icon: "fas.fa-vector-square",
    author: "Malik12tree",
    description: "Adds helpful Mesh Modeling Tools, Operators and Generators!",
    version: "1.1.0",
    minVersion: "4.7.0",
    variant: "both",
    tags: ["Format: Generic Model", "Edit"],
    onload() {
      Mesh.prototype.menu.structure.unshift("meshtools");
      MenuBar.addAction("@meshtools/generators", "filter");
    },
    onunload() {
      const forceRemove = (id, array) => {
        if (!array) return;

        let action = array.find((e) => e.id == id);
        while (action) {
          array.remove(action);
          action = array.find((e) => e.id == id);
        }
      };

      BarItems["quickprimitives"]?.children?.forEach?.((e) => BarItems[e]?.delete());
      BarItems["@meshtools/uv_mapping"]?.children?.forEach?.((e) =>
        BarItems[e]?.delete()
      );
      BarItems["meshtools"]?.children?.forEach?.((e) => BarItems[e]?.delete());
      BarItems["@meshtools/generators"]?.children?.forEach?.((e) => BarItems[e]?.delete());

      forceRemove("@meshtools/generators", MenuBar.menues.tools.structure);
      forceRemove("meshtools", Mesh.prototype.menu.structure);
    },
  });

})();
