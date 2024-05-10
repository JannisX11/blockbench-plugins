/**
 * @template {V}
 * @template {K}
 * @param {V[]} arr
 * @param {(value: V, currentIndex: number, array: V[]) => K[]} callback
 * @returns {{[k: K]: V[]}}
 */
export function groupMultipleBy(arr, callback) {
  return arr.reduce((acc, ...args) => {
    const keys = callback(...args);
    for (const key of keys) {
      acc[key] ??= [];
      acc[key].push(args[0]);
    }
    return acc;
  }, {});
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
export function findMin(array, map = (x) => x) {
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

export function offsetArray(array, offset) {
  while (offset < 0) offset += array.length;
  while (offset >= array.length) offset -= array.length;

  const newArr = [];
  for (let i = 0; i < array.length; i++) {
    newArr[(i + offset) % array.length] = array[i];
  }

  array.splice(0, Infinity, ...newArr);
}
export function deepIncludes(array, value) {
  for (const item of array) {
    if (item === value) {
      return true;
    }
    if (item instanceof Array && deepIncludes(item, value)) {
      return true;
    }
  }
  return false;
}

/**
 * @template {T}
 * @param {T[]} array
 * @returns {T[]}
 */
export function distinguishArray(array) {
  const distinctArray = [];
  for (const element of array) {
    if (distinctArray.includes(element)) continue;

    distinctArray.push(element);
  }
  return distinctArray;
}

export function distinctlyMergeArrays(...arrays) {
  const distinctArray = [];
  for (const array of arrays) {
    for (const element of array) {
      if (distinctArray.includes(element)) continue;

      distinctArray.push(element);
    }
  }
  return distinctArray;
}
