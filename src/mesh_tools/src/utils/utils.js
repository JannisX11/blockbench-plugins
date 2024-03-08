const reusableEuler1 = new THREE.Euler();
const reusableQuat1 = new THREE.Quaternion();
const reusableVec1 = new THREE.Vector3();
const reusableVec2 = new THREE.Vector3();
const reusableVec3 = new THREE.Vector3();
const reusableVec4 = new THREE.Vector3();
const reusable2dVec1 = new THREE.Vector2();
const Normal2dX = new THREE.Vector2(1, 0);

export const gradient256 = {};
for (let x = 0; x < 256; x++) gradient256[[x, 0]] = x / 255;

/**
 *
 * @param {THREE.Vector3} vector
 * @param {THREE.Euler} targetEuler
 * @returns {THREE.Euler}
 */
const reusableObject = new THREE.Object3D();
reusableObject.rotation.order = "XYZ";
export function rotationFromDirection(target, targetEuler = new THREE.Euler()) {
  reusableObject.lookAt(target);
  reusableObject.rotateX(Math.degToRad(90));

  targetEuler.copy(reusableObject.rotation);
  return targetEuler;
}
export function computeTriangleNormal(A, B, C) {
  reusableVec1.set(A.x, A.y, A.z);
  reusableVec2.set(B.x, B.y, B.z);
  reusableVec3.set(C.x, C.y, C.z);
  return reusableVec4
    .crossVectors(
      reusableVec2.sub(reusableVec1),
      reusableVec3.sub(reusableVec1)
    )
    .clone();
}
export function parseRGB(s) {
  let string = "";
  for (let i = 4; i < s.length - 1; i++) {
    string += s[i];
  }
  string = string.split(",");
  return new THREE.Color(string[0] / 255, string[1] / 255, string[2] / 255);
}

export function sm(v) {
  let a = 3;
  let b = 2.7;
  return Math.pow(v, a) / (Math.pow(v, a) + Math.pow(b - b * v, a));
}
export function falloffMap(i, j, width, height, v) {
  let x = (i / width) * 2 - 1;
  let y = (j / height) * 2 - 1;
  return sm(Math.max(Math.abs(x), Math.abs(y)));
}
export function roundVector(vec) {
  return vec.map((e) => Math.roundTo(e, 5));
}
export function areVectorsCollinear(v1, v2) {
  v1 = roundVector(v1);
  v2 = roundVector(v2);

  const cross = reusableVec1.fromArray(v1).cross(reusableVec2.fromArray(v2));
  for (let i = 0; i < 3; i++) {
    if (!Math.isBetween(cross[getAxisLetter(i)], -0.005, 0.005)) {
      return false;
    }
  }
  return true;
}

export function easeInOutSine(x) {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

/** @param {Mesh} mesh */
export function computeVertexNeighborhood(mesh) {
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

export function getAdjacentElements(arr, index) {
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
export function isPointInTriangle(point, point1, point2, point3) {
  const d1 = lineSide(point, point1, point2);
  const d2 = lineSide(point, point2, point3);
  const d3 = lineSide(point, point3, point1);
  const hasNegative = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPositive = d1 > 0 || d2 > 0 || d3 > 0;

  return !(hasNegative && hasPositive);
}
/**
 * Note: If the polygon length is less than 3, true is returned.
 * @param {ArrayVector3[]} polygon
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
    sum += (vertexB.x - vertexA.x) * (vertexB.y - vertexA.y);
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

  const euler = rotationFromDirection(plane.normal, reusableEuler1);
  const quat = reusableQuat1.setFromEuler(euler);
  quat.invert();
  return polygon.map((e) => {
    e.applyQuaternion(quat);
    return new THREE.Vector2(e.x, e.z);
  });
}

/**
 * Triangulates a polygon into a set of triangles.
 *
 * @param {ArrayVector3[]} polygon
 * @returns {Array<ArrayVector3>} An array of triangles. Each triangle is represented
 *   as an ArrayVector3
 */
export function triangulate(polygon) {
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

        // console.log(vertices[j], vertices[a], vertices[b], vertices[c]);
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

export function worldToScreen(p, camera, width, height) {
  // https://stackoverflow.com/a/27448966/16079500
  const vector = p.project(camera);

  vector.x = ((vector.x + 1) / 2) * width;
  vector.y = (-(vector.y - 1) / 2) * height;

  return vector;
}

export function getMinProjectTextureSize() {
  return Math.min(Project._texture_width, Project._texture_height);
}

export function v3Tov2(v3) {
  return [v3[0], v3[1]];
}
export function getFaceUVCenter(face) {
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

export function freezeProperty(object, key) {
  Object.defineProperty(object, key, { configurable: false, writable: false });
  return object;
}
export function snakeToPascal(subject) {
  return subject
    .split(/[_\s]+/g)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function minIndex(array) {
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
/**
 *
 * @param {ArrayVector3[]} points
 * @returns {boolean}
 */
export function isValidQuad(points) {
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
export function getSelectedFacesAndEdgesByVertices(mesh, vertexSet) {
  const selectedFaces = [];
  const selectedEdges = [];

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
    for (let i = 0; i < sortedVertices.length; i += 2) {
      const vertexA = sortedVertices[i];
      const vertexB = sortedVertices[(i + 1) % sortedVertices.length];
      if (vertexSet.has(vertexB) && vertexSet.has(vertexB)) {
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
export function selectFacesAndEdgesByVertices(mesh, vertexSet) {
  if (!Project) {
    throw new Error(
      "selectFacesAndEdgesByVertices(): An open project is required before calling!"
    );
  }
  const { edges, faces } = getSelectedFacesAndEdgesByVertices(mesh, vertexSet);
  const vertices = Array.from(vertexSet);

  mesh.getSelectedVertices().splice(0, Infinity, ...vertices);
  mesh.getSelectedEdges().splice(0, Infinity, ...edges);
  mesh.getSelectedFaces().splice(0, Infinity, ...faces);
}

function gatherConnectedVertices(
  vertex,
  { neighborhoodCondition, processedVertices, neighborhood, mesh } = {}
) {
  if (!neighborhood && !mesh) {
    throw new Error(
      `gatherConnectedVertices(): Must call with either a neighborhood map or a mesh.`
    );
  }
  if (!neighborhood) {
    neighborhood = computeVertexNeighborhood(mesh);
  }

  const connected = new Set([vertex]);
  if (!neighborhood[vertex]) {
    return connected;
  }

  for (const currentConnected of connected) {
    processedVertices && processedVertices.add(currentConnected);
    for (const neighbor of neighborhood[currentConnected]) {
      if (connected.has(neighbor)) {
        continue;
      }
      if (neighborhoodCondition && neighborhoodCondition(neighbor)) {
        connected.add(neighbor);
      }
    }
  }
  return connected;
}
function sortVerticesByAngle(mesh, vertexKeys) {
  const vertices = vertexKeys.map((e) => mesh.vertices[e].V3_toThree());
  const vertices2d = projectIntoOwnPlane(vertices);

  const centroid = new THREE.Vector2();
  for (const vertex of vertices2d) {
    centroid.add(vertex);
  }
  centroid.divideScalar(vertices2d.length);

  const sorted = vertices2d
    .map((e, i) => {
      const dir = reusable2dVec1.subVectors(e, centroid);

      let angle = dir.angle();
      if (angle < 0) {
        angle += 2 * Math.PI;
      }

      return [angle, vertexKeys[i]];
    })
    .sort(([a], [b]) => a - b)
    .map(([, e]) => e);
  return {
    sorted,
    centroid,
  };
}
/**
 * @param {Mesh} mesh
 */
export function gatherSelectedEdgeLoops(mesh) {
  const groups = groupConnectedSelectedVertices(mesh);
  const edgeLoops = [];
  for (const group of groups) {
    const { sorted: sortedLoop, centroid } = sortVerticesByAngle(
      mesh,
      Array.from(group)
    );

    edgeLoops.push({ edges: groupElementsCollided(sortedLoop, 2), centroid });
  }

  return edgeLoops;
}
export function groupConnectedSelectedVertices(mesh) {
  const selectedVerticesSet = new Set(mesh.getSelectedVertices());
  const neighborhood = computeVertexNeighborhood(mesh);
  const processedVertices = new Set();
  const edgeLoops = [];

  for (const current of mesh.getSelectedEdges()) {
    const [a, _b] = current;
    if (!processedVertices.has(a)) {
      edgeLoops.push(
        gatherConnectedVertices(a, {
          neighborhood,
          processedVertices,
          neighborhoodCondition: (neighbor) =>
            selectedVerticesSet.has(neighbor),
        })
      );
    }
  }
  return edgeLoops;
}

export function createTextMesh(text, options = {}) {
  const defaults = {
    fontSize: 50,
    fontFamily: "Arial",
    fillStyle: "red",
    textAlign: "center",
  };
  const mergedOptions = Object.assign({}, defaults, options);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const font = `${mergedOptions.fontSize}px ${mergedOptions.fontFamily}`;
  const fontSize = mergedOptions.fontSize;
  context.font = font;
  canvas.width = context.measureText(text).width + fontSize * 0.2;
  canvas.height = fontSize * 1.5;

  context.font = font;
  context.fillStyle = mergedOptions.fillStyle;
  context.textAlign = mergedOptions.textAlign;
  context.fillText(text, canvas.width / 2, canvas.height / 2 + fontSize / 3);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(canvas.width / 100, canvas.height / 100, 1);

  return sprite;
}
/**
 *
 * @param {Mesh} mesh
 * @param {string} vertexKey
 * @returns {MeshFace[]}
 */
export function getVertexConnectedFaces(mesh, vertexKey) {
  const faces = [];
  for (const faceKey in mesh.faces) {
    const face = mesh.faces[faceKey];
    if (face.vertices.includes(vertexKey)) {
      faces.push(face);
    }
  }
  return faces;
}
/**
 *
 * @param {Mesh} mesh
 * @param {string} vertexKey
 */
export function vertexNormal(mesh, vertexKey) {
  const faces = getVertexConnectedFaces(mesh, vertexKey);
  if (faces.length == 0) return null;

  const avgNormal = new THREE.Vector3();
  for (const face of faces) {
    const normal = face.getNormal(true);
    avgNormal.x += normal[0];
    avgNormal.y += normal[1];
    avgNormal.z += normal[2];
  }
  avgNormal.divideScalar(faces.length);
  return avgNormal;
}

export function lerp3(a, b, t) {
  return a.map((e, i) => Math.lerp(e, b[i], t));
}

export function groupElementsCollided(array, every = 2) {
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
