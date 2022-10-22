export function createIncrementalArray(size: number) {
  return [...[...Array(size)].keys()];
}

export function cutAndSwapArray<T>(
  array: Array<T>,
  cutIndex: number
): Array<T> {
  return [...array.slice(cutIndex, array.length), ...array.slice(0, cutIndex)];
}
