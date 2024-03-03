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
  const { vec1, vec2, vec3, vec4 } = Reusable;
  vec1.set(A.x, A.y, A.z);
  vec2.set(B.x, B.y, B.z);
  vec3.set(C.x, C.y, C.z);
  return vec4.crossVectors(vec2.sub(vec1), vec3.sub(vec1)).clone();
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

  const cross = Reusable.vec1.fromArray(v1).cross(Reusable.vec2.fromArray(v2));
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
 * @param {THREE.Vector3} p
 * @param {THREE.Vector3} p1
 * @param {THREE.Vector3} p2
 * @returns {-1 | 0 | 1} 1 if the point is on the left side, -1 if on the right side, and 0 if on the line.
 */
function lineSide(p, p1, p2) {
  return Math.sign((p.x - p2.x) * (p1.z - p2.z) - (p1.x - p2.x) * (p.z - p2.z));
}

/**
 *
 * @param {THREE.Vector3} point
 * @param {THREE.Vector3} point1
 * @param {THREE.Vector3} point2
 * @param {THREE.Vector3} point3
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
 * Triangulates a polygon into a set of triangles.
 *
 * @param {ArrayVector3[]} polygon
 * @param {ArrayVector3} normal The normal vector of the polygon.
 * @returns {Array<[number, number, number]>} An array of triangles. Each triangle is represented
 *   as an array of three
 */
export function triangulate(polygon, normal) {
  const vertices = polygon.map((v) => v.V3_toThree());
  const indices = Array.from(Array(vertices.length).keys());
  const triangles = [];

  const plane = new THREE.Plane();
  plane.setFromCoplanarPoints(vertices[0], vertices[1], vertices[2]);

  const euler = rotationFromDirection(normal.V3_toThree(), Reusable.euler1);
  for (let i = 0; i < vertices.length; i++) {
    const coplanarVertex = vertices[i].clone().applyEuler(euler);
    vertices[i].copy(coplanarVertex);
    vertices[i].y = 0;
  }

  const SAFETY_LIMIT = 1000;
  let safetyIndex = 0;
  while (indices.length > 3 && safetyIndex <= SAFETY_LIMIT) {
    for (let i = 0; i < indices.length; i++) {
      const [a, b, c] = getAdjacentElements(indices, i);

      const pointA = vertices[c].clone().sub(vertices[a]);
      const pointB = vertices[b].clone().sub(vertices[a]);

      const dot = pointA.x * pointB.x + pointA.z * pointB.z;
      const isConcave = dot < 0;
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
