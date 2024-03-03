export const gradient256 = {};
for (let x = 0; x < 256; x++) gradient256[[x, 0]] = x / 255;

const _m_ = new THREE.Mesh();
export function rotationFromDir(vector) {
  _m_.lookAt(vector);
  return _m_.rotation;
}
export function normalOfTri(A, B, C) {
  const { vec1, vec2, vec3, vec4 } = Reusable;
  vec1.set(A.x, A.y, A.z);
  vec2.set(B.x, B.y, B.z);
  vec3.set(C.x, C.y, C.z);
  return vec4.crossVectors(vec2.sub(vec1), vec3.sub(vec1)).clone();
}
export function compileRGB(s) {
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
export function fixedVec(vec) {
  return vec.map((e) => Math.roundTo(e, 5));
}
export function areVectorsCollinear(v1, v2) {
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

export const perlin = {
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

export function getAdjacentVertices(arr, index) {
  return [
    arr[(index + 1 + arr.length) % arr.length],
    arr[index],
    arr[(index - 1 + arr.length) % arr.length],
  ];
}
export function sign(p1, p2, p3) {
  return (p1[0] - p3[0]) * (p2[2] - p3[2]) - (p2[0] - p3[0]) * (p1[2] - p3[2]);
}
export function PointInTri(point, triangle) {
  let d1, d2, d3, has_neg, has_pos;
  d1 = sign(point, triangle[0], triangle[1]);
  d2 = sign(point, triangle[1], triangle[2]);
  d3 = sign(point, triangle[2], triangle[0]);
  has_neg = d1 < 0 || d2 < 0 || d3 < 0;
  has_pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(has_neg && has_pos);
}

export function cross(pointA, pointB) {
  return pointA[0] * pointB[1] - pointA[1] * pointB[0];
}

// Earcut algorithm
export function Triangulate(polygon, normal) {
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

export function worldToScreen(p, camera, width, height) {
  // https://stackoverflow.com/a/27448966/16079500
  var vector = p.project(camera);

  vector.x = ((vector.x + 1) / 2) * width;
  vector.y = (-(vector.y - 1) / 2) * height;

  return vector;
}

export function getEqualRes() {
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

// https://base64.guru/developers/javascript/examples/unicode-strings
// fix stupid bug with unicodes
export function utoa(data) {
  return btoa(unescape(encodeURIComponent(data)));
}

export function freezeProperty(object, key) {
  Object.defineProperty(object, key, { configurable: false, writable: false });
  return object;
}
export function snakeToPascal(subject) {
  return subject.split(/[_\s]+/g)
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}