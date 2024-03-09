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

export function getX(obj) {
  return obj[xKey(obj)];
}
export function getY(obj) {
  return obj[yKey(obj)];
}
export function getZ(obj) {
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
export function addVectors(target, source) {
  target[xKey(target)] += source[xKey(source)];
  target[yKey(target)] += source[yKey(source)];
  target[zKey(target)] += source[zKey(source)];
  return target;
}
/**
 * @template T
 * @param {Vector3} a
 * @param {Vector3} b
 * @param {T} three
 * @returns {T extends true ? THREE.Vector3: ArrayVector3}
 */
export function addedVectors(a, b, three = true) {
  const x = a[xKey(a)] + b[xKey(b)];
  const y = a[yKey(a)] + b[yKey(b)];
  const z = a[zKey(a)] + b[zKey(b)];
  if (three) {
    return new THREE.Vector3(x, y, z);
  }
  return [x, y, z];
}
/**
 * @param {Vector3} a
 * @param {Vector3} b
 */
export function distanceBetween(a, b) {
  return Math.hypot(getX(a) - getX(b), getY(a) - getY(b), getZ(a) - getZ(b));
}
