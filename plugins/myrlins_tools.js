var MyrlinsTools = (() => {
  // src/utils/cleanup.ts
  var trackedItems = [];
  var trackedEvents = [];
  var trackedStyles = [];
  function track(item) {
    trackedItems.push(item);
    return item;
  }
  function trackStyle(css) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    trackedStyles.push(style);
    return style;
  }
  function cleanup() {
    for (const item of trackedItems) {
      try {
        item.delete();
      } catch (e) {
        console.warn("[Myrlin Tools] Failed to cleanup item:", e);
      }
    }
    trackedItems.length = 0;
    for (const { target, event, handler } of trackedEvents) {
      try {
        target.removeEventListener(event, handler);
      } catch (e) {
        console.warn("[Myrlin Tools] Failed to remove event listener:", e);
      }
    }
    trackedEvents.length = 0;
    for (const style of trackedStyles) {
      try {
        style.remove();
      } catch (e) {
        console.warn("[Myrlin Tools] Failed to remove style:", e);
      }
    }
    trackedStyles.length = 0;
  }

  // src/utils/geometry.ts
  function getCubeBounds(cube) {
    return {
      min: { x: cube.from[0], y: cube.from[1], z: cube.from[2] },
      max: { x: cube.to[0], y: cube.to[1], z: cube.to[2] }
    };
  }
  function getVolume(bounds) {
    return (bounds.max.x - bounds.min.x) * (bounds.max.y - bounds.min.y) * (bounds.max.z - bounds.min.z);
  }
  function combineBounds(a, b) {
    return {
      min: {
        x: Math.min(a.min.x, b.min.x),
        y: Math.min(a.min.y, b.min.y),
        z: Math.min(a.min.z, b.min.z)
      },
      max: {
        x: Math.max(a.max.x, b.max.x),
        y: Math.max(a.max.y, b.max.y),
        z: Math.max(a.max.z, b.max.z)
      }
    };
  }
  function sharesCompleteFace(a, b) {
    const tolerance = 1e-3;
    if (Math.abs(a.max.x - b.min.x) < tolerance || Math.abs(b.max.x - a.min.x) < tolerance) {
      const yOverlap = Math.min(a.max.y, b.max.y) - Math.max(a.min.y, b.min.y);
      const zOverlap = Math.min(a.max.z, b.max.z) - Math.max(a.min.z, b.min.z);
      const aYSize = a.max.y - a.min.y;
      const aZSize = a.max.z - a.min.z;
      const bYSize = b.max.y - b.min.y;
      const bZSize = b.max.z - b.min.z;
      if (Math.abs(aYSize - bYSize) < tolerance && Math.abs(aZSize - bZSize) < tolerance && Math.abs(yOverlap - aYSize) < tolerance && Math.abs(zOverlap - aZSize) < tolerance) {
        return true;
      }
    }
    if (Math.abs(a.max.y - b.min.y) < tolerance || Math.abs(b.max.y - a.min.y) < tolerance) {
      const xOverlap = Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x);
      const zOverlap = Math.min(a.max.z, b.max.z) - Math.max(a.min.z, b.min.z);
      const aXSize = a.max.x - a.min.x;
      const aZSize = a.max.z - a.min.z;
      const bXSize = b.max.x - b.min.x;
      const bZSize = b.max.z - b.min.z;
      if (Math.abs(aXSize - bXSize) < tolerance && Math.abs(aZSize - bZSize) < tolerance && Math.abs(xOverlap - aXSize) < tolerance && Math.abs(zOverlap - aZSize) < tolerance) {
        return true;
      }
    }
    if (Math.abs(a.max.z - b.min.z) < tolerance || Math.abs(b.max.z - a.min.z) < tolerance) {
      const xOverlap = Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x);
      const yOverlap = Math.min(a.max.y, b.max.y) - Math.max(a.min.y, b.min.y);
      const aXSize = a.max.x - a.min.x;
      const aYSize = a.max.y - a.min.y;
      const bXSize = b.max.x - b.min.x;
      const bYSize = b.max.y - b.min.y;
      if (Math.abs(aXSize - bXSize) < tolerance && Math.abs(aYSize - bYSize) < tolerance && Math.abs(xOverlap - aXSize) < tolerance && Math.abs(yOverlap - aYSize) < tolerance) {
        return true;
      }
    }
    return false;
  }
  function canMergeToBox(a, b) {
    const combined = combineBounds(a, b);
    const combinedVolume = getVolume(combined);
    const volumeA = getVolume(a);
    const volumeB = getVolume(b);
    const tolerance = 1e-3;
    return Math.abs(combinedVolume - (volumeA + volumeB)) < tolerance;
  }

  // src/optimizer/box_merge.ts
  var SpatialHashGrid = class {
    constructor(cellSize = 16) {
      this.cellSize = cellSize;
      this.grid = /* @__PURE__ */ new Map();
      this.cubeKeys = /* @__PURE__ */ new Map();
    }
    getKey(x, y, z) {
      const cx = Math.floor(x / this.cellSize);
      const cy = Math.floor(y / this.cellSize);
      const cz = Math.floor(z / this.cellSize);
      return `${cx},${cy},${cz}`;
    }
    getCellsForBounds(bounds) {
      const keys = [];
      const minCx = Math.floor(bounds.min.x / this.cellSize);
      const minCy = Math.floor(bounds.min.y / this.cellSize);
      const minCz = Math.floor(bounds.min.z / this.cellSize);
      const maxCx = Math.floor(bounds.max.x / this.cellSize);
      const maxCy = Math.floor(bounds.max.y / this.cellSize);
      const maxCz = Math.floor(bounds.max.z / this.cellSize);
      for (let cx = minCx; cx <= maxCx; cx++) {
        for (let cy = minCy; cy <= maxCy; cy++) {
          for (let cz = minCz; cz <= maxCz; cz++) {
            keys.push(`${cx},${cy},${cz}`);
          }
        }
      }
      return keys;
    }
    insert(cube, bounds) {
      const keys = this.getCellsForBounds(bounds);
      this.cubeKeys.set(cube, keys);
      for (const key of keys) {
        if (!this.grid.has(key)) {
          this.grid.set(key, /* @__PURE__ */ new Set());
        }
        this.grid.get(key).add(cube);
      }
    }
    remove(cube) {
      const keys = this.cubeKeys.get(cube);
      if (!keys)
        return;
      for (const key of keys) {
        const cell = this.grid.get(key);
        if (cell) {
          cell.delete(cube);
          if (cell.size === 0) {
            this.grid.delete(key);
          }
        }
      }
      this.cubeKeys.delete(cube);
    }
    update(cube, bounds) {
      this.remove(cube);
      this.insert(cube, bounds);
    }
    getNearby(bounds) {
      const nearby = /* @__PURE__ */ new Set();
      const keys = this.getCellsForBounds(bounds);
      for (const key of keys) {
        const cell = this.grid.get(key);
        if (cell) {
          for (const cube of cell) {
            nearby.add(cube);
          }
        }
      }
      return nearby;
    }
    clear() {
      this.grid.clear();
      this.cubeKeys.clear();
    }
  };
  function getCubeColorSignature(cube) {
    const faces = cube.faces || {};
    const parts = [];
    for (const face of ["north", "south", "east", "west", "up", "down"]) {
      const faceData = faces[face];
      if (faceData) {
        parts.push(`${face}:${faceData.texture || "none"}`);
      }
    }
    if (cube.color !== void 0) {
      parts.push(`color:${cube.color}`);
    }
    return parts.join("|");
  }
  function cubesCanMerge(a, b) {
    if (!(a instanceof Cube) || !(b instanceof Cube)) {
      return false;
    }
    if (a.parent !== b.parent) {
      return false;
    }
    const sigA = getCubeColorSignature(a);
    const sigB = getCubeColorSignature(b);
    return sigA === sigB;
  }
  function findMergeableNeighbor(cube, spatialGrid) {
    const bounds = getCubeBounds(cube);
    const searchBounds = {
      min: { x: bounds.min.x - 1, y: bounds.min.y - 1, z: bounds.min.z - 1 },
      max: { x: bounds.max.x + 1, y: bounds.max.y + 1, z: bounds.max.z + 1 }
    };
    const nearby = spatialGrid.getNearby(searchBounds);
    for (const other of nearby) {
      if (other === cube)
        continue;
      if (other._markedForRemoval)
        continue;
      if (!cubesCanMerge(cube, other))
        continue;
      const otherBounds = getCubeBounds(other);
      if (!sharesCompleteFace(bounds, otherBounds))
        continue;
      if (!canMergeToBox(bounds, otherBounds))
        continue;
      return other;
    }
    return null;
  }
  function findMergeableNeighborLegacy(cube, cubes) {
    const bounds = getCubeBounds(cube);
    for (const other of cubes) {
      if (other === cube)
        continue;
      if (other._markedForRemoval)
        continue;
      if (!cubesCanMerge(cube, other))
        continue;
      const otherBounds = getCubeBounds(other);
      if (!sharesCompleteFace(bounds, otherBounds))
        continue;
      if (!canMergeToBox(bounds, otherBounds))
        continue;
      return other;
    }
    return null;
  }
  function mergeCubes(a, b) {
    const boundsA = getCubeBounds(a);
    const boundsB = getCubeBounds(b);
    const combined = combineBounds(boundsA, boundsB);
    a.from[0] = combined.min.x;
    a.from[1] = combined.min.y;
    a.from[2] = combined.min.z;
    a.to[0] = combined.max.x;
    a.to[1] = combined.max.y;
    a.to[2] = combined.max.z;
    b._markedForRemoval = true;
  }
  var SPATIAL_HASH_THRESHOLD = 500;
  function findMergeableNeighborOnAxis(cube, axis, spatialGrid, allCubes) {
    const bounds = getCubeBounds(cube);
    const tolerance = 1e-3;
    let candidates;
    if (spatialGrid) {
      const searchBounds = {
        min: { x: bounds.min.x - 1, y: bounds.min.y - 1, z: bounds.min.z - 1 },
        max: { x: bounds.max.x + 1, y: bounds.max.y + 1, z: bounds.max.z + 1 }
      };
      candidates = spatialGrid.getNearby(searchBounds);
    } else {
      candidates = allCubes;
    }
    for (const other of candidates) {
      if (other === cube)
        continue;
      if (other._markedForRemoval)
        continue;
      if (!cubesCanMerge(cube, other))
        continue;
      const otherBounds = getCubeBounds(other);
      if (axis === "x") {
        const adjacentX = Math.abs(bounds.max.x - otherBounds.min.x) < tolerance || Math.abs(otherBounds.max.x - bounds.min.x) < tolerance;
        if (!adjacentX)
          continue;
        if (Math.abs(bounds.min.y - otherBounds.min.y) > tolerance)
          continue;
        if (Math.abs(bounds.max.y - otherBounds.max.y) > tolerance)
          continue;
        if (Math.abs(bounds.min.z - otherBounds.min.z) > tolerance)
          continue;
        if (Math.abs(bounds.max.z - otherBounds.max.z) > tolerance)
          continue;
      } else if (axis === "y") {
        const adjacentY = Math.abs(bounds.max.y - otherBounds.min.y) < tolerance || Math.abs(otherBounds.max.y - bounds.min.y) < tolerance;
        if (!adjacentY)
          continue;
        if (Math.abs(bounds.min.x - otherBounds.min.x) > tolerance)
          continue;
        if (Math.abs(bounds.max.x - otherBounds.max.x) > tolerance)
          continue;
        if (Math.abs(bounds.min.z - otherBounds.min.z) > tolerance)
          continue;
        if (Math.abs(bounds.max.z - otherBounds.max.z) > tolerance)
          continue;
      } else {
        const adjacentZ = Math.abs(bounds.max.z - otherBounds.min.z) < tolerance || Math.abs(otherBounds.max.z - bounds.min.z) < tolerance;
        if (!adjacentZ)
          continue;
        if (Math.abs(bounds.min.x - otherBounds.min.x) > tolerance)
          continue;
        if (Math.abs(bounds.max.x - otherBounds.max.x) > tolerance)
          continue;
        if (Math.abs(bounds.min.y - otherBounds.min.y) > tolerance)
          continue;
        if (Math.abs(bounds.max.y - otherBounds.max.y) > tolerance)
          continue;
      }
      return other;
    }
    return null;
  }
  function optimizeBoxes() {
    const allCubes = Cube.all.filter((c) => c.export !== false);
    const originalCount = allCubes.length;
    if (originalCount === 0) {
      return {
        originalCount: 0,
        optimizedCount: 0,
        mergeCount: 0,
        success: false,
        message: "No cubes found in the model."
      };
    }
    Undo.initEdit({ elements: allCubes });
    let mergeCount = 0;
    let iterations = 0;
    const maxIterations = originalCount * 2;
    const useSpatialHash = originalCount >= SPATIAL_HASH_THRESHOLD;
    let spatialGrid = null;
    if (useSpatialHash) {
      let totalSize = 0;
      for (const cube of allCubes) {
        const bounds = getCubeBounds(cube);
        totalSize += Math.max(
          bounds.max.x - bounds.min.x,
          bounds.max.y - bounds.min.y,
          bounds.max.z - bounds.min.z
        );
      }
      const avgSize = totalSize / originalCount;
      const cellSize = Math.max(4, Math.ceil(avgSize * 2));
      spatialGrid = new SpatialHashGrid(cellSize);
      for (const cube of allCubes) {
        spatialGrid.insert(cube, getCubeBounds(cube));
      }
    }
    const activeCubes = new Set(allCubes);
    const axisOrder = ["x", "y", "z"];
    for (const axis of axisOrder) {
      let passChanged = true;
      let passIterations = 0;
      const passMaxIterations = activeCubes.size;
      while (passChanged && passIterations < passMaxIterations) {
        passChanged = false;
        passIterations++;
        for (const cube of activeCubes) {
          if (cube._markedForRemoval) {
            activeCubes.delete(cube);
            continue;
          }
          const neighbor = findMergeableNeighborOnAxis(
            cube,
            axis,
            spatialGrid,
            allCubes
          );
          if (neighbor) {
            if (spatialGrid)
              spatialGrid.remove(neighbor);
            mergeCubes(cube, neighbor);
            mergeCount++;
            if (spatialGrid)
              spatialGrid.update(cube, getCubeBounds(cube));
            activeCubes.delete(neighbor);
            passChanged = true;
            iterations++;
          }
        }
      }
    }
    let changed = true;
    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;
      for (const cube of activeCubes) {
        if (cube._markedForRemoval) {
          activeCubes.delete(cube);
          continue;
        }
        const neighbor = useSpatialHash && spatialGrid ? findMergeableNeighbor(cube, spatialGrid) : findMergeableNeighborLegacy(cube, allCubes);
        if (neighbor) {
          if (spatialGrid) {
            spatialGrid.remove(neighbor);
          }
          mergeCubes(cube, neighbor);
          mergeCount++;
          if (spatialGrid) {
            spatialGrid.update(cube, getCubeBounds(cube));
          }
          activeCubes.delete(neighbor);
          changed = true;
        }
      }
    }
    if (spatialGrid) {
      spatialGrid.clear();
    }
    const toRemove = allCubes.filter((c) => c._markedForRemoval);
    for (const cube of toRemove) {
      delete cube._markedForRemoval;
      cube.remove();
    }
    const remaining = allCubes.filter((c) => !c._markedForRemoval);
    for (const cube of remaining) {
      delete cube._markedForRemoval;
    }
    Undo.finishEdit("Optimize Boxes (Myrlin's Tools)");
    Canvas.updateAll();
    const optimizedCount = originalCount - mergeCount;
    const reduction = originalCount > 0 ? Math.round(mergeCount / originalCount * 100) : 0;
    return {
      originalCount,
      optimizedCount,
      mergeCount,
      success: true,
      message: `Optimized: ${originalCount} \u2192 ${optimizedCount} boxes (${reduction}% reduction)`
    };
  }
  function estimateSavings() {
    const allCubes = Cube.all.filter((c) => c.export !== false);
    const current = allCubes.length;
    if (current === 0) {
      return { current: 0, potential: 0, savings: 0 };
    }
    let potentialMerges = 0;
    if (current >= SPATIAL_HASH_THRESHOLD) {
      const spatialGrid = new SpatialHashGrid(16);
      for (const cube of allCubes) {
        spatialGrid.insert(cube, getCubeBounds(cube));
      }
      const checked = /* @__PURE__ */ new Set();
      for (const cube of allCubes) {
        const bounds = getCubeBounds(cube);
        const searchBounds = {
          min: { x: bounds.min.x - 1, y: bounds.min.y - 1, z: bounds.min.z - 1 },
          max: { x: bounds.max.x + 1, y: bounds.max.y + 1, z: bounds.max.z + 1 }
        };
        const nearby = spatialGrid.getNearby(searchBounds);
        for (const other of nearby) {
          if (other === cube)
            continue;
          const pairKey = cube.uuid < other.uuid ? `${cube.uuid}-${other.uuid}` : `${other.uuid}-${cube.uuid}`;
          if (checked.has(pairKey))
            continue;
          checked.add(pairKey);
          if (!cubesCanMerge(cube, other))
            continue;
          const otherBounds = getCubeBounds(other);
          if (sharesCompleteFace(bounds, otherBounds) && canMergeToBox(bounds, otherBounds)) {
            potentialMerges++;
          }
        }
      }
      spatialGrid.clear();
    } else {
      for (let i = 0; i < allCubes.length; i++) {
        for (let j = i + 1; j < allCubes.length; j++) {
          const a = allCubes[i];
          const b = allCubes[j];
          if (!cubesCanMerge(a, b))
            continue;
          const boundsA = getCubeBounds(a);
          const boundsB = getCubeBounds(b);
          if (sharesCompleteFace(boundsA, boundsB) && canMergeToBox(boundsA, boundsB)) {
            potentialMerges++;
          }
        }
      }
    }
    const estimatedSavings = Math.min(potentialMerges, Math.floor(current * 0.5));
    return {
      current,
      potential: current - estimatedSavings,
      savings: estimatedSavings
    };
  }

  // src/optimizer/hollow.ts
  function buildOccupancyGrid(cubes) {
    const grid = /* @__PURE__ */ new Map();
    for (const cube of cubes) {
      const bounds = getCubeBounds(cube);
      for (let x = Math.floor(bounds.min.x); x < Math.ceil(bounds.max.x); x++) {
        for (let y = Math.floor(bounds.min.y); y < Math.ceil(bounds.max.y); y++) {
          for (let z = Math.floor(bounds.min.z); z < Math.ceil(bounds.max.z); z++) {
            const key = `${x},${y},${z}`;
            if (!grid.has(key)) {
              grid.set(key, []);
            }
            grid.get(key).push(cube);
          }
        }
      }
    }
    return grid;
  }
  function isInterior(cube, grid) {
    const bounds = getCubeBounds(cube);
    const tolerance = 1e-3;
    const faces = [
      { dir: { x: 1, y: 0, z: 0 }, face: "right" },
      // +X
      { dir: { x: -1, y: 0, z: 0 }, face: "left" },
      // -X
      { dir: { x: 0, y: 1, z: 0 }, face: "up" },
      // +Y
      { dir: { x: 0, y: -1, z: 0 }, face: "down" },
      // -Y
      { dir: { x: 0, y: 0, z: 1 }, face: "front" },
      // +Z
      { dir: { x: 0, y: 0, z: -1 }, face: "back" }
      // -Z
    ];
    for (const { dir, face } of faces) {
      let faceCovered = true;
      const faceMin = { x: 0, y: 0, z: 0 };
      const faceMax = { x: 0, y: 0, z: 0 };
      if (dir.x !== 0) {
        faceMin.x = faceMax.x = dir.x > 0 ? bounds.max.x : bounds.min.x;
        faceMin.y = bounds.min.y;
        faceMax.y = bounds.max.y;
        faceMin.z = bounds.min.z;
        faceMax.z = bounds.max.z;
      } else if (dir.y !== 0) {
        faceMin.y = faceMax.y = dir.y > 0 ? bounds.max.y : bounds.min.y;
        faceMin.x = bounds.min.x;
        faceMax.x = bounds.max.x;
        faceMin.z = bounds.min.z;
        faceMax.z = bounds.max.z;
      } else {
        faceMin.z = faceMax.z = dir.z > 0 ? bounds.max.z : bounds.min.z;
        faceMin.x = bounds.min.x;
        faceMax.x = bounds.max.x;
        faceMin.y = bounds.min.y;
        faceMax.y = bounds.max.y;
      }
      const checkX = Math.floor(faceMin.x + dir.x * 0.5);
      const checkY = Math.floor(faceMin.y + dir.y * 0.5);
      const checkZ = Math.floor(faceMin.z + dir.z * 0.5);
      for (let x = Math.floor(faceMin.x); x < Math.ceil(faceMax.x); x++) {
        for (let y = Math.floor(faceMin.y); y < Math.ceil(faceMax.y); y++) {
          for (let z = Math.floor(faceMin.z); z < Math.ceil(faceMax.z); z++) {
            const neighborKey = `${x + dir.x},${y + dir.y},${z + dir.z}`;
            const neighbors = grid.get(neighborKey);
            if (!neighbors || neighbors.length === 0) {
              faceCovered = false;
              break;
            }
            const point = {
              x: x + 0.5 + dir.x,
              y: y + 0.5 + dir.y,
              z: z + 0.5 + dir.z
            };
            let covered = false;
            for (const neighbor of neighbors) {
              if (neighbor === cube)
                continue;
              const nBounds = getCubeBounds(neighbor);
              if (point.x >= nBounds.min.x - tolerance && point.x <= nBounds.max.x + tolerance && point.y >= nBounds.min.y - tolerance && point.y <= nBounds.max.y + tolerance && point.z >= nBounds.min.z - tolerance && point.z <= nBounds.max.z + tolerance) {
                covered = true;
                break;
              }
            }
            if (!covered) {
              faceCovered = false;
              break;
            }
          }
          if (!faceCovered)
            break;
        }
        if (!faceCovered)
          break;
      }
      if (!faceCovered) {
        return false;
      }
    }
    return true;
  }
  function hollowInterior(preserveShell = true) {
    const allCubes = Cube.all.filter((c) => c.export !== false);
    const originalCount = allCubes.length;
    if (originalCount === 0) {
      return {
        originalCount: 0,
        removedCount: 0,
        finalCount: 0,
        success: false,
        message: "No cubes found in the model."
      };
    }
    const grid = buildOccupancyGrid(allCubes);
    const interiorCubes = [];
    for (const cube of allCubes) {
      if (isInterior(cube, grid)) {
        interiorCubes.push(cube);
      }
    }
    if (interiorCubes.length === 0) {
      return {
        originalCount,
        removedCount: 0,
        finalCount: originalCount,
        success: true,
        message: "No interior cubes found - model is already hollow."
      };
    }
    Undo.initEdit({ elements: interiorCubes });
    for (const cube of interiorCubes) {
      cube.remove();
    }
    Undo.finishEdit("Hollow Interior (Myrlin's Tools)");
    Canvas.updateAll();
    const removedCount = interiorCubes.length;
    const finalCount = originalCount - removedCount;
    const reduction = Math.round(removedCount / originalCount * 100);
    return {
      originalCount,
      removedCount,
      finalCount,
      success: true,
      message: `Hollowed: ${originalCount} \u2192 ${finalCount} boxes (removed ${removedCount}, ${reduction}% reduction)`
    };
  }
  function countInteriorCubes() {
    const allCubes = Cube.all.filter((c) => c.export !== false);
    if (allCubes.length === 0)
      return 0;
    const grid = buildOccupancyGrid(allCubes);
    let count = 0;
    for (const cube of allCubes) {
      if (isInterior(cube, grid)) {
        count++;
      }
    }
    return count;
  }

  // src/utils/debounce.ts
  function debounce(fn, ms) {
    let timeout = null;
    return (...args) => {
      if (timeout)
        clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn(...args);
        timeout = null;
      }, ms);
    };
  }

  // src/features/node_budget.ts
  function countGroup(group) {
    let cubeCount = 0;
    let groupCount = 0;
    const children = [];
    for (const child of group.children) {
      if (child instanceof Cube) {
        cubeCount++;
      } else if (child instanceof Group) {
        groupCount++;
        children.push(countGroup(child));
      }
    }
    const childDescendants = children.reduce((sum, c) => sum + c.totalDescendants, 0);
    const totalDescendants = cubeCount + groupCount + childDescendants;
    return {
      name: group.name,
      uuid: group.uuid,
      cubeCount,
      groupCount,
      totalDescendants,
      children
    };
  }
  function calculateNodeBudget() {
    const roots = [];
    for (const item of Outliner.root) {
      if (item instanceof Group) {
        roots.push(countGroup(item));
      }
    }
    return roots;
  }
  function getTotalNodeCount() {
    const cubes = Cube.all.filter((c) => c.export !== false).length;
    const groups = Group.all.filter((g) => g.export !== false).length;
    return cubes + groups;
  }

  // src/ui/panel.ts
  var HYTALE_MAX_NODES = 255;
  function getQuickStats() {
    const nodeCount = getTotalNodeCount();
    const texture = Texture.all[0];
    const textureSize = texture ? `${texture.width}x${texture.height}` : "No texture";
    return {
      nodeCount,
      maxNodes: HYTALE_MAX_NODES,
      textureSize,
      isValid: nodeCount <= HYTALE_MAX_NODES
    };
  }
  function getExpensiveStats() {
    const estimate = estimateSavings();
    const interiorCount = countInteriorCubes();
    return {
      interiorCount,
      potentialSavings: estimate.savings
    };
  }
  function setupPanel() {
    const panel = new Panel("myrlins_tools_panel", {
      name: "Myrlin's Tools",
      id: "myrlins_tools_panel",
      icon: "auto_fix_high",
      growable: true,
      condition: {
        modes: ["edit"],
        method: () => true
      },
      default_position: {
        slot: "right_bar",
        float_position: [0, 0],
        float_size: [300, 500],
        height: 500
      },
      component: {
        template: `
                <div class="myrlin-panel">
                    <div class="myrlin-section">
                        <h4 class="myrlin-section-title">Model Status</h4>
                        <div class="myrlin-stats">
                            <div class="myrlin-stat-row" :class="{ 'myrlin-stat-error': !quickStats.isValid }">
                                <span class="myrlin-stat-icon">{{ quickStats.isValid ? '\u2705' : '\u274C' }}</span>
                                <span class="myrlin-stat-label">Nodes:</span>
                                <span class="myrlin-stat-value">{{ quickStats.nodeCount }} / {{ quickStats.maxNodes }}</span>
                            </div>
                            <div class="myrlin-stat-row">
                                <span class="myrlin-stat-icon">\u{1F3A8}</span>
                                <span class="myrlin-stat-label">Texture:</span>
                                <span class="myrlin-stat-value">{{ quickStats.textureSize }}</span>
                            </div>
                            <div class="myrlin-stat-row" v-if="expensiveStats.interiorCount > 0">
                                <span class="myrlin-stat-icon">{{ expensiveStale ? '\u23F3' : '\u26A0\uFE0F' }}</span>
                                <span class="myrlin-stat-label">Hidden interior:</span>
                                <span class="myrlin-stat-value" :class="{ 'myrlin-stale': expensiveStale }">{{ expensiveStats.interiorCount }} boxes</span>
                            </div>
                            <div class="myrlin-stat-row" v-if="expensiveStats.potentialSavings > 0">
                                <span class="myrlin-stat-icon">{{ expensiveStale ? '\u23F3' : '\u{1F4A1}' }}</span>
                                <span class="myrlin-stat-label">Potential savings:</span>
                                <span class="myrlin-stat-value" :class="{ 'myrlin-stale': expensiveStale }">~{{ expensiveStats.potentialSavings }} boxes</span>
                            </div>
                        </div>
                    </div>

                    <div class="myrlin-section" v-if="nodeBudget.length > 0">
                        <h4 class="myrlin-section-title">
                            Node Budget
                            <span class="myrlin-section-badge">{{ quickStats.nodeCount }}/{{ quickStats.maxNodes }}</span>
                        </h4>
                        <div class="myrlin-budget-tree">
                            <div v-for="bone in nodeBudget" :key="bone.uuid" class="myrlin-budget-bone">
                                <div
                                    class="myrlin-budget-row"
                                    :class="getBudgetClass(bone)"
                                    @click="selectBone(bone.uuid)"
                                >
                                    <span class="myrlin-budget-name" @click.stop="toggleBone(bone.uuid)">
                                        {{ expandedBones[bone.uuid] ? '\u25BC' : '\u25B6' }} {{ bone.name }}
                                    </span>
                                    <span class="myrlin-budget-count">{{ bone.totalDescendants }}</span>
                                </div>
                                <div v-if="expandedBones[bone.uuid] && bone.children.length > 0" class="myrlin-budget-children">
                                    <div
                                        v-for="child in bone.children"
                                        :key="child.uuid"
                                        class="myrlin-budget-row myrlin-budget-child"
                                        @click="selectBone(child.uuid)"
                                    >
                                        <span class="myrlin-budget-name">{{ child.name }}</span>
                                        <span class="myrlin-budget-count">{{ child.totalDescendants }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="myrlin-section">
                        <h4 class="myrlin-section-title">Tools</h4>
                        <div class="myrlin-buttons">
                            <button class="myrlin-btn" @click="runAction('myrlin_optimize_boxes')" :disabled="quickStats.nodeCount === 0">
                                <span class="myrlin-btn-icon">\u{1F4E6}</span>
                                <span class="myrlin-btn-text">Optimize Boxes</span>
                            </button>
                            <button class="myrlin-btn" @click="runAction('myrlin_hollow_interior')" :disabled="expensiveStats.interiorCount === 0">
                                <span class="myrlin-btn-icon">\u{1F573}\uFE0F</span>
                                <span class="myrlin-btn-text">Hollow Interior</span>
                            </button>
                            <button class="myrlin-btn" @click="runAction('myrlin_palette_converter')">
                                <span class="myrlin-btn-icon">\u{1F3A8}</span>
                                <span class="myrlin-btn-text">Palette Converter</span>
                            </button>
                            <button class="myrlin-btn" @click="runAction('myrlin_validate')">
                                <span class="myrlin-btn-icon material-icons">check_circle</span>
                                <span class="myrlin-btn-text">Validate Model</span>
                            </button>
                        </div>
                    </div>

                    <div class="myrlin-section">
                        <h4 class="myrlin-section-title">Import</h4>
                        <div class="myrlin-buttons">
                            <button class="myrlin-btn" @click="runAction('myrlin_model_browser')">
                                <span class="myrlin-btn-icon">\u{1F5C2}\uFE0F</span>
                                <span class="myrlin-btn-text">Browse Models</span>
                            </button>
                        </div>
                    </div>
                </div>
            `,
        data() {
          return {
            quickStats: getQuickStats(),
            expensiveStats: { interiorCount: 0, potentialSavings: 0 },
            expensiveStale: true,
            nodeBudget: [],
            expandedBones: {},
            debouncedExpensiveUpdate: null
          };
        },
        methods: {
          updateQuickStats() {
            this.quickStats = getQuickStats();
            this.expensiveStale = true;
            this.nodeBudget = calculateNodeBudget();
            if (this.debouncedExpensiveUpdate) {
              this.debouncedExpensiveUpdate();
            }
          },
          updateExpensiveStats() {
            this.expensiveStats = getExpensiveStats();
            this.expensiveStale = false;
          },
          runAction(actionId) {
            if (BarItems[actionId]) {
              BarItems[actionId].click();
            }
          },
          selectBone(uuid) {
            const group = Group.all.find((g) => g.uuid === uuid);
            if (group) {
              group.select();
            }
          },
          toggleBone(uuid) {
            this.$set(this.expandedBones, uuid, !this.expandedBones[uuid]);
          },
          getBudgetClass(bone) {
            const fairShare = Math.floor(HYTALE_MAX_NODES / Math.max(this.nodeBudget.length, 1));
            if (bone.totalDescendants > fairShare)
              return "myrlin-budget-red";
            if (bone.totalDescendants > fairShare * 0.5)
              return "myrlin-budget-yellow";
            return "myrlin-budget-green";
          }
        },
        mounted() {
          this.debouncedExpensiveUpdate = debounce(() => {
            this.updateExpensiveStats();
          }, 500);
          this.updateExpensiveStats();
          this.nodeBudget = calculateNodeBudget();
          this._updateListener = Blockbench.on("update_selection", () => {
            this.updateQuickStats();
          });
          this._undoListener = Blockbench.on("undo", () => {
            this.updateQuickStats();
          });
          this._redoListener = Blockbench.on("redo", () => {
            this.updateQuickStats();
          });
        },
        beforeDestroy() {
          if (this._updateListener)
            this._updateListener.delete();
          if (this._undoListener)
            this._undoListener.delete();
          if (this._redoListener)
            this._redoListener.delete();
        }
      }
    });
    track(panel);
    const panelCSS = Blockbench.addCSS(PANEL_CSS);
    track({ delete: () => panelCSS.delete() });
  }
  var PANEL_CSS = `
    .myrlin-panel {
        padding: 8px;
        font-size: 12px;
    }

    .myrlin-section {
        margin-bottom: 16px;
    }

    .myrlin-section-title {
        margin: 0 0 8px 0;
        padding: 4px 0;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--color-subtle_text);
        border-bottom: 1px solid var(--color-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .myrlin-section-badge {
        font-size: 10px;
        font-weight: 400;
        padding: 1px 6px;
        border-radius: 8px;
        background: var(--color-back);
    }

    .myrlin-stats {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .myrlin-stat-row {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 6px;
        background: var(--color-back);
        border-radius: 4px;
    }

    .myrlin-stat-row.myrlin-stat-error {
        background: rgba(255, 100, 100, 0.2);
    }

    .myrlin-stat-icon {
        font-size: 14px;
        width: 20px;
        text-align: center;
    }

    .myrlin-stat-label {
        color: var(--color-subtle_text);
    }

    .myrlin-stat-value {
        margin-left: auto;
        font-weight: 500;
    }

    .myrlin-stale {
        opacity: 0.5;
        font-style: italic;
    }

    /* Node Budget Tree */
    .myrlin-budget-tree {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .myrlin-budget-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 3px 6px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 11px;
    }

    .myrlin-budget-row:hover {
        background: var(--color-button);
    }

    .myrlin-budget-name {
        cursor: pointer;
        user-select: none;
    }

    .myrlin-budget-count {
        font-weight: 500;
        font-variant-numeric: tabular-nums;
    }

    .myrlin-budget-children {
        padding-left: 16px;
    }

    .myrlin-budget-child {
        font-size: 10px;
        color: var(--color-subtle_text);
    }

    .myrlin-budget-green .myrlin-budget-count { color: #4ade80; }
    .myrlin-budget-yellow .myrlin-budget-count { color: #facc15; }
    .myrlin-budget-red .myrlin-budget-count { color: #f87171; }

    /* Buttons */
    .myrlin-buttons {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .myrlin-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: var(--color-button);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        color: var(--color-text);
        transition: background 0.15s;
    }

    .myrlin-btn:hover:not(:disabled) {
        background: var(--color-accent);
    }

    .myrlin-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .myrlin-btn-icon {
        font-size: 16px;
    }

    .myrlin-btn-text {
        flex: 1;
    }
`;

  // src/utils/color.ts
  function rgbToLab(rgb) {
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    let x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
    let y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
    let z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
    const refX = 0.95047;
    const refY = 1;
    const refZ = 1.08883;
    x = x / refX;
    y = y / refY;
    z = z / refZ;
    x = x > 8856e-6 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 8856e-6 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 8856e-6 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
    return {
      l: 116 * y - 16,
      a: 500 * (x - y),
      b: 200 * (y - z)
    };
  }
  function deltaE(lab1, lab2) {
    return Math.sqrt(
      Math.pow(lab2.l - lab1.l, 2) + Math.pow(lab2.a - lab1.a, 2) + Math.pow(lab2.b - lab1.b, 2)
    );
  }
  function findNearestColor(color, palette) {
    const colorLab = rgbToLab(color);
    let nearest = palette[0];
    let minDist = Infinity;
    for (const p of palette) {
      const pLab = rgbToLab(p);
      const dist = deltaE(colorLab, pLab);
      if (dist < minDist) {
        minDist = dist;
        nearest = p;
      }
    }
    return nearest;
  }
  function averageColor(colors) {
    if (colors.length === 0) {
      return { r: 0, g: 0, b: 0 };
    }
    const sum = colors.reduce(
      (acc, c) => ({ r: acc.r + c.r, g: acc.g + c.g, b: acc.b + c.b }),
      { r: 0, g: 0, b: 0 }
    );
    return {
      r: Math.round(sum.r / colors.length),
      g: Math.round(sum.g / colors.length),
      b: Math.round(sum.b / colors.length)
    };
  }
  function colorsAreSimilar(a, b, threshold = 10) {
    return deltaE(rgbToLab(a), rgbToLab(b)) < threshold;
  }
  function extractDominantColors(colors, k = 8, maxIterations = 50) {
    if (colors.length <= k) {
      return colors;
    }
    let centroids = [];
    const usedIndices = /* @__PURE__ */ new Set();
    while (centroids.length < k) {
      const idx = Math.floor(Math.random() * colors.length);
      if (!usedIndices.has(idx)) {
        usedIndices.add(idx);
        centroids.push({ ...colors[idx] });
      }
    }
    for (let iter = 0; iter < maxIterations; iter++) {
      const clusters = Array.from({ length: k }, () => []);
      for (const color of colors) {
        let minDist = Infinity;
        let nearestIdx = 0;
        for (let i = 0; i < centroids.length; i++) {
          const dist = deltaE(rgbToLab(color), rgbToLab(centroids[i]));
          if (dist < minDist) {
            minDist = dist;
            nearestIdx = i;
          }
        }
        clusters[nearestIdx].push(color);
      }
      let changed = false;
      for (let i = 0; i < k; i++) {
        if (clusters[i].length > 0) {
          const newCentroid = averageColor(clusters[i]);
          if (!colorsAreSimilar(centroids[i], newCentroid, 1)) {
            changed = true;
            centroids[i] = newCentroid;
          }
        }
      }
      if (!changed)
        break;
    }
    return centroids;
  }
  var HYTALE_PALETTES = {
    official: [
      { r: 74, g: 63, b: 50 },
      // Dark brown
      { r: 139, g: 119, b: 92 },
      // Medium brown
      { r: 194, g: 178, b: 152 },
      // Light brown
      { r: 67, g: 87, b: 58 },
      // Dark green
      { r: 109, g: 143, b: 92 },
      // Medium green
      { r: 162, g: 194, b: 133 },
      // Light green
      { r: 58, g: 68, b: 92 },
      // Dark blue
      { r: 92, g: 117, b: 150 },
      // Medium blue
      { r: 147, g: 175, b: 207 },
      // Light blue
      { r: 194, g: 152, b: 108 },
      // Tan
      { r: 150, g: 92, b: 68 },
      // Rust
      { r: 207, g: 175, b: 147 }
      // Cream
    ],
    warm: [
      { r: 139, g: 69, b: 50 },
      // Dark rust
      { r: 178, g: 92, b: 68 },
      // Rust
      { r: 207, g: 133, b: 92 },
      // Orange
      { r: 225, g: 175, b: 133 },
      // Peach
      { r: 109, g: 74, b: 58 },
      // Dark brown
      { r: 150, g: 109, b: 74 },
      // Brown
      { r: 194, g: 152, b: 108 },
      // Tan
      { r: 225, g: 207, b: 175 }
      // Cream
    ],
    cool: [
      { r: 50, g: 58, b: 92 },
      // Dark navy
      { r: 68, g: 92, b: 139 },
      // Navy
      { r: 92, g: 133, b: 178 },
      // Blue
      { r: 147, g: 175, b: 207 },
      // Light blue
      { r: 58, g: 50, b: 74 },
      // Dark purple
      { r: 92, g: 74, b: 109 },
      // Purple
      { r: 139, g: 119, b: 150 },
      // Lavender
      { r: 178, g: 162, b: 194 }
      // Light lavender
    ],
    nature: [
      { r: 50, g: 58, b: 42 },
      // Dark forest
      { r: 74, g: 92, b: 58 },
      // Forest
      { r: 109, g: 139, b: 92 },
      // Green
      { r: 150, g: 178, b: 133 },
      // Light green
      { r: 74, g: 63, b: 50 },
      // Dark bark
      { r: 109, g: 92, b: 74 },
      // Bark
      { r: 150, g: 133, b: 109 },
      // Light bark
      { r: 194, g: 178, b: 152 }
      // Sand
    ]
  };

  // src/tools/palette.ts
  function getPalette(name) {
    switch (name) {
      case "official":
        return HYTALE_PALETTES.official;
      case "warm":
        return HYTALE_PALETTES.warm;
      case "cool":
        return HYTALE_PALETTES.cool;
      case "nature":
        return HYTALE_PALETTES.nature;
      default:
        return HYTALE_PALETTES.official;
    }
  }
  function convertToPalette(paletteName = "official") {
    const texture = Texture.all[0];
    if (!texture) {
      return {
        success: false,
        colorsChanged: 0,
        message: "No texture found in the model."
      };
    }
    const palette = getPalette(paletteName);
    const canvas = texture.canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return {
        success: false,
        colorsChanged: 0,
        message: "Could not get canvas context."
      };
    }
    Undo.initEdit({ textures: [texture] });
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let colorsChanged = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 10)
        continue;
      const original = { r, g, b };
      const nearest = findNearestColor(original, palette);
      if (nearest.r !== r || nearest.g !== g || nearest.b !== b) {
        data[i] = nearest.r;
        data[i + 1] = nearest.g;
        data[i + 2] = nearest.b;
        colorsChanged++;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    texture.updateSource(canvas.toDataURL());
    Undo.finishEdit("Convert to Palette (Myrlin's Tools)");
    return {
      success: true,
      colorsChanged,
      message: `Converted ${colorsChanged} pixels to ${paletteName} palette.`
    };
  }
  function quantizeColors(targetCount = 8) {
    const texture = Texture.all[0];
    if (!texture) {
      return {
        success: false,
        colorsChanged: 0,
        message: "No texture found in the model."
      };
    }
    const canvas = texture.canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return {
        success: false,
        colorsChanged: 0,
        message: "Could not get canvas context."
      };
    }
    Undo.initEdit({ textures: [texture] });
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const colors = [];
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a >= 10) {
        colors.push({
          r: data[i],
          g: data[i + 1],
          b: data[i + 2]
        });
      }
    }
    const palette = extractDominantColors(colors, targetCount);
    let colorsChanged = 0;
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 10)
        continue;
      const original = {
        r: data[i],
        g: data[i + 1],
        b: data[i + 2]
      };
      const nearest = findNearestColor(original, palette);
      if (nearest.r !== original.r || nearest.g !== original.g || nearest.b !== original.b) {
        data[i] = nearest.r;
        data[i + 1] = nearest.g;
        data[i + 2] = nearest.b;
        colorsChanged++;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    texture.updateSource(canvas.toDataURL());
    Undo.finishEdit("Quantize Colors (Myrlin's Tools)");
    return {
      success: true,
      colorsChanged,
      message: `Reduced to ${targetCount} colors (${colorsChanged} pixels changed).`
    };
  }

  // src/actions.ts
  function showResultDialog(title, result) {
    Blockbench.showQuickMessage(result.message, 3e3);
    if (!result.success) {
      Blockbench.showMessageBox({
        title,
        message: result.message,
        icon: "warning"
      });
    }
  }
  function setupActions() {
    const optimizeAction = new Action("myrlin_optimize_boxes", {
      name: "Optimize Boxes",
      description: "Merge adjacent boxes with same material to reduce box count (Myrlin's Tools)",
      icon: "compress",
      category: "tools",
      condition: () => {
        return Cube.all.length > 0;
      },
      click: () => {
        const estimate = estimateSavings();
        new Dialog({
          id: "myrlin_optimize_dialog",
          title: "Optimize Boxes - Myrlin's Tools",
          lines: [
            `Current box count: **${estimate.current}**`,
            `Estimated after optimization: **~${estimate.potential}**`,
            `Potential savings: **~${estimate.savings} boxes**`,
            "",
            "This will merge adjacent boxes that share the same material/color.",
            "The operation can be undone with Ctrl+Z."
          ],
          buttons: ["Optimize", "Cancel"],
          onConfirm: () => {
            const result = optimizeBoxes();
            showResultDialog("Optimize Boxes", result);
          }
        }).show();
      }
    });
    track(optimizeAction);
    const hollowAction = new Action("myrlin_hollow_interior", {
      name: "Hollow Interior",
      description: "Remove boxes that are completely hidden inside the model (Myrlin's Tools)",
      icon: "select_all",
      // Using available icon
      category: "tools",
      condition: () => {
        return Cube.all.length > 0;
      },
      click: () => {
        const interiorCount = countInteriorCubes();
        const totalCount = Cube.all.length;
        if (interiorCount === 0) {
          Blockbench.showQuickMessage("No interior cubes found - model is already hollow.", 2e3);
          return;
        }
        new Dialog({
          id: "myrlin_hollow_dialog",
          title: "Hollow Interior - Myrlin's Tools",
          lines: [
            `Current box count: **${totalCount}**`,
            `Interior boxes found: **${interiorCount}**`,
            `Final count after hollowing: **${totalCount - interiorCount}**`,
            "",
            "This will remove boxes that are completely surrounded by other boxes.",
            "The operation can be undone with Ctrl+Z."
          ],
          buttons: ["Hollow", "Cancel"],
          onConfirm: () => {
            const result = hollowInterior(true);
            showResultDialog("Hollow Interior", result);
          }
        }).show();
      }
    });
    track(hollowAction);
    const paletteAction = new Action("myrlin_palette_converter", {
      name: "Palette Converter",
      description: "Remap texture colors to a Hytale-style palette (Myrlin's Tools)",
      icon: "palette",
      category: "tools",
      condition: () => {
        return Texture.all.length > 0;
      },
      click: () => {
        new Dialog({
          id: "myrlin_palette_dialog",
          title: "Palette Converter - Myrlin's Tools",
          form: {
            palette: {
              label: "Target Palette",
              type: "select",
              options: {
                official: "Hytale Official",
                warm: "Warm Tones",
                cool: "Cool Tones",
                nature: "Nature"
              },
              value: "official"
            },
            quantize: {
              label: "Quantize Colors",
              type: "checkbox",
              value: false,
              description: "Reduce unique color count before palette conversion"
            },
            quantize_count: {
              label: "Target Color Count",
              type: "number",
              value: 8,
              min: 2,
              max: 64
            }
          },
          onConfirm: (formResult) => {
            if (formResult.quantize) {
              const qResult = quantizeColors(formResult.quantize_count || 8);
              if (qResult.success) {
                Blockbench.showQuickMessage(qResult.message, 2e3);
              }
            }
            const result = convertToPalette(formResult.palette);
            showResultDialog("Palette Converter", result);
          }
        }).show();
      }
    });
    track(paletteAction);
    MenuBar.addAction(optimizeAction, "tools");
    MenuBar.addAction(hollowAction, "tools");
    MenuBar.addAction(paletteAction, "tools");
    const optimizeKeybind = new Keybind({
      key: "o",
      ctrl: true,
      shift: true
    });
    optimizeAction.setKeybind(optimizeKeybind);
  }

  // src/ui/status.ts
  var HYTALE_MAX_NODES2 = 255;
  function getStatusColor(count) {
    if (count > HYTALE_MAX_NODES2)
      return "#ef4444";
    if (count > 200)
      return "#f59e0b";
    return "#22c55e";
  }
  function getStatusEmoji(count) {
    if (count > HYTALE_MAX_NODES2)
      return "\u274C";
    if (count > 200)
      return "\u26A0\uFE0F";
    return "\u2705";
  }
  function setupStatusBar() {
    let statusElement = null;
    function updateStatus() {
      const count = Cube.all.filter((c) => c.export !== false).length;
      const emoji = getStatusEmoji(count);
      const color = getStatusColor(count);
      if (statusElement) {
        statusElement.innerHTML = `
                <span style="color: ${color}">
                    \u{1F4E6} ${count}/${HYTALE_MAX_NODES2}
                </span>
            `;
        statusElement.title = `Hytale Node Count: ${count} / ${HYTALE_MAX_NODES2} (Myrlin's Tools)`;
      }
    }
    function createStatusElement() {
      const statusBar = document.querySelector("#status_bar");
      if (!statusBar) {
        console.warn("[Myrlin's Tools] Status bar not found");
        return;
      }
      statusElement = document.createElement("div");
      statusElement.id = "myrlin_status";
      statusElement.className = "f_left";
      statusElement.style.cssText = `
            padding: 0 8px;
            font-size: 12px;
            display: flex;
            align-items: center;
            cursor: pointer;
        `;
      statusElement.addEventListener("click", () => {
        const panel = Panels.myrlins_tools_panel;
        if (panel) {
          if (panel.slot === "hidden") {
            panel.moveTo("right_bar");
          }
          if (panel.folded) {
            panel.fold();
          }
        }
      });
      const firstChild = statusBar.firstChild;
      if (firstChild) {
        statusBar.insertBefore(statusElement, firstChild.nextSibling);
      } else {
        statusBar.appendChild(statusElement);
      }
      updateStatus();
    }
    const modeListener = Blockbench.on("select_mode", (data) => {
      if (data && data.mode === "edit") {
        if (!statusElement) {
          createStatusElement();
        }
        updateStatus();
      }
    });
    track({ delete: () => modeListener.delete() });
    const updateListener = Blockbench.on("update_selection", updateStatus);
    track({ delete: () => updateListener.delete() });
    const undoListener = Blockbench.on("undo", updateStatus);
    track({ delete: () => undoListener.delete() });
    const redoListener = Blockbench.on("redo", updateStatus);
    track({ delete: () => redoListener.delete() });
    track({
      delete: () => {
        if (statusElement && statusElement.parentNode) {
          statusElement.parentNode.removeChild(statusElement);
        }
        statusElement = null;
      }
    });
    if (Modes.edit) {
      setTimeout(createStatusElement, 100);
    }
  }

  // src/ui/browser.ts
  var MYRLIN_API = "https://api.myrlin.io";
  var MYRLIN_GALLERY = "https://forge.myrlin.io/gallery";
  async function fetchGalleryItems(category, search, limit = 20) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...category && { category },
        ...search && { search }
      });
      const response = await fetch(`${MYRLIN_API}/api/gallery?${params}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error("[Myrlin Browser] Failed to fetch gallery:", error);
      return [];
    }
  }
  async function importBlockyModel(url, name, autoOptimize = false) {
    try {
      Blockbench.showQuickMessage(`Downloading ${name}...`, 2e3);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }
      const data = await response.json();
      if (!Formats.hytale_character && !Formats.hytale_prop) {
        Blockbench.showMessageBox({
          title: "Hytale Plugin Required",
          message: "Please install the official Hytale plugin to import .blockymodel files.",
          icon: "warning"
        });
        return false;
      }
      newProject(Formats.hytale_character);
      Codecs.blockymodel?.load(data, { path: `${name}.blockymodel` });
      if (autoOptimize) {
        Blockbench.showQuickMessage("Optimizing model...", 1500);
        setTimeout(() => {
          const result = optimizeBoxes();
          if (result.mergeCount > 0) {
            Blockbench.showQuickMessage(
              `Optimized: ${result.originalCount} \u2192 ${result.optimizedCount} boxes`,
              3e3
            );
          }
        }, 500);
      }
      Blockbench.showQuickMessage(`Imported: ${name}`, 2e3);
      return true;
    } catch (error) {
      console.error("[Myrlin Browser] Import failed:", error);
      Blockbench.showMessageBox({
        title: "Import Failed",
        message: `Could not import model: ${error.message}`,
        icon: "error"
      });
      return false;
    }
  }
  function showModelBrowser() {
    const dialog = new Dialog({
      id: "myrlin_model_browser",
      title: "Myrlin Model Browser",
      width: 800,
      singleButton: false,
      component: {
        template: `
                <div class="myrlin-browser">
                    <div class="myrlin-browser-header">
                        <div class="myrlin-browser-search">
                            <input
                                type="text"
                                v-model="searchQuery"
                                placeholder="Search models..."
                                @input="debouncedSearch"
                            />
                        </div>
                        <div class="myrlin-browser-filters">
                            <select v-model="selectedCategory" @change="loadItems">
                                <option value="">All Categories</option>
                                <option value="weapon">Weapons</option>
                                <option value="character">Characters</option>
                                <option value="prop">Props</option>
                                <option value="creature">Creatures</option>
                                <option value="building">Buildings</option>
                            </select>
                        </div>
                        <label class="myrlin-browser-option">
                            <input type="checkbox" v-model="autoOptimize" />
                            Auto-optimize on import
                        </label>
                    </div>

                    <div class="myrlin-browser-content">
                        <div v-if="loading" class="myrlin-browser-loading">
                            Loading models...
                        </div>

                        <div v-else-if="items.length === 0" class="myrlin-browser-empty">
                            <p>No models found.</p>
                            <p>Browse the full gallery at <a href="${MYRLIN_GALLERY}" target="_blank">forge.myrlin.io</a></p>
                        </div>

                        <div v-else class="myrlin-browser-grid">
                            <div
                                v-for="item in items"
                                :key="item.id"
                                class="myrlin-browser-item"
                                :class="{ selected: selectedItem?.id === item.id }"
                                @click="selectItem(item)"
                                @dblclick="importItem(item)"
                            >
                                <div class="myrlin-browser-thumbnail">
                                    <img :src="item.thumbnailUrl" :alt="item.name" />
                                </div>
                                <div class="myrlin-browser-item-info">
                                    <div class="myrlin-browser-item-name">{{ item.name }}</div>
                                    <div class="myrlin-browser-item-meta">
                                        <span class="myrlin-browser-item-boxes">{{ item.boxCount }} boxes</span>
                                        <span class="myrlin-browser-item-category">{{ item.category }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="myrlin-browser-footer">
                        <div class="myrlin-browser-selected" v-if="selectedItem">
                            Selected: <strong>{{ selectedItem.name }}</strong>
                            ({{ selectedItem.boxCount }} boxes)
                        </div>
                        <div class="myrlin-browser-actions">
                            <button @click="openGallery" class="myrlin-btn-link">
                                Browse Full Gallery
                            </button>
                            <button
                                @click="importSelected"
                                :disabled="!selectedItem"
                                class="myrlin-btn-primary"
                            >
                                Import Model
                            </button>
                        </div>
                    </div>
                </div>
            `,
        data() {
          return {
            items: [],
            selectedItem: null,
            selectedCategory: "",
            searchQuery: "",
            autoOptimize: true,
            loading: false,
            searchTimeout: null
          };
        },
        methods: {
          async loadItems() {
            this.loading = true;
            this.items = await fetchGalleryItems(
              this.selectedCategory || void 0,
              this.searchQuery || void 0
            );
            this.loading = false;
          },
          selectItem(item) {
            this.selectedItem = item;
          },
          async importItem(item) {
            if (item.blockymodelUrl) {
              const success = await importBlockyModel(
                item.blockymodelUrl,
                item.name,
                this.autoOptimize
              );
              if (success) {
                dialog.close();
              }
            }
          },
          importSelected() {
            if (this.selectedItem) {
              this.importItem(this.selectedItem);
            }
          },
          openGallery() {
            Blockbench.openLink(MYRLIN_GALLERY);
          },
          debouncedSearch() {
            if (this.searchTimeout) {
              clearTimeout(this.searchTimeout);
            }
            this.searchTimeout = setTimeout(() => {
              this.loadItems();
            }, 300);
          }
        },
        mounted() {
          this.loadItems();
        }
      }
    });
    dialog.show();
  }
  var BROWSER_CSS = `
        .myrlin-browser {
            display: flex;
            flex-direction: column;
            height: 500px;
            gap: 12px;
        }

        .myrlin-browser-header {
            display: flex;
            gap: 12px;
            align-items: center;
            flex-wrap: wrap;
        }

        .myrlin-browser-search {
            flex: 1;
            min-width: 200px;
        }

        .myrlin-browser-search input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--color-border);
            border-radius: 4px;
            background: var(--color-back);
            color: var(--color-text);
        }

        .myrlin-browser-filters select {
            padding: 8px 12px;
            border: 1px solid var(--color-border);
            border-radius: 4px;
            background: var(--color-back);
            color: var(--color-text);
        }

        .myrlin-browser-option {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: var(--color-subtle_text);
        }

        .myrlin-browser-content {
            flex: 1;
            overflow-y: auto;
            border: 1px solid var(--color-border);
            border-radius: 4px;
            background: var(--color-back);
        }

        .myrlin-browser-loading,
        .myrlin-browser-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: var(--color-subtle_text);
        }

        .myrlin-browser-empty a {
            color: var(--color-accent);
        }

        .myrlin-browser-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 12px;
            padding: 12px;
        }

        .myrlin-browser-item {
            border: 2px solid transparent;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: border-color 0.15s, transform 0.15s;
            background: var(--color-button);
        }

        .myrlin-browser-item:hover {
            border-color: var(--color-border);
            transform: translateY(-2px);
        }

        .myrlin-browser-item.selected {
            border-color: var(--color-accent);
        }

        .myrlin-browser-thumbnail {
            aspect-ratio: 1;
            background: var(--color-back);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .myrlin-browser-thumbnail img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        .myrlin-browser-item-info {
            padding: 8px;
        }

        .myrlin-browser-item-name {
            font-weight: 500;
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .myrlin-browser-item-meta {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: var(--color-subtle_text);
            margin-top: 4px;
        }

        .myrlin-browser-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
        }

        .myrlin-browser-selected {
            font-size: 12px;
            color: var(--color-subtle_text);
        }

        .myrlin-browser-actions {
            display: flex;
            gap: 8px;
        }

        .myrlin-btn-link {
            background: transparent;
            border: 1px solid var(--color-border);
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            color: var(--color-text);
        }

        .myrlin-btn-link:hover {
            border-color: var(--color-accent);
            color: var(--color-accent);
        }

        .myrlin-btn-primary {
            background: var(--color-accent);
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            color: white;
            font-weight: 500;
        }

        .myrlin-btn-primary:hover:not(:disabled) {
            filter: brightness(1.1);
        }

        .myrlin-btn-primary:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
`;
  function setupBrowser() {
    const browserCSS = Blockbench.addCSS(BROWSER_CSS);
    track({ delete: () => browserCSS.delete() });
    const browserAction = new Action("myrlin_model_browser", {
      name: "Model Browser",
      description: "Browse and import models from Myrlin gallery (Myrlin's Tools)",
      icon: "view_module",
      category: "tools",
      click: () => {
        showModelBrowser();
      }
    });
    track(browserAction);
    MenuBar.addAction(browserAction, "tools");
  }

  // src/features/template_wizard.ts
  function cubeDef(name, posX, posY, posZ, sizeX, sizeY, sizeZ) {
    return {
      name,
      from: [
        posX - sizeX / 2,
        posY - sizeY / 2,
        posZ - sizeZ / 2
      ],
      to: [
        posX + sizeX / 2,
        posY + sizeY / 2,
        posZ + sizeZ / 2
      ]
    };
  }
  var TEMPLATES = {
    sword: {
      label: "Sword",
      format: "hytale_prop",
      textureWidth: 64,
      textureHeight: 64,
      bones: [
        {
          name: "R-Attachment",
          origin: [0, 0, 0],
          children: [
            {
              name: "Handle",
              origin: [0, 6, 0],
              cube: cubeDef("Handle", 0, 6, 0, 4, 3, 3),
              children: [
                {
                  name: "Blade",
                  origin: [0, 20, 0],
                  cube: cubeDef("Blade", 0, 20, 0, 3, 20, 3)
                }
              ]
            }
          ]
        }
      ]
    },
    axe: {
      label: "Axe",
      format: "hytale_prop",
      textureWidth: 64,
      textureHeight: 64,
      bones: [
        {
          name: "R-Attachment",
          origin: [0, 0, 0],
          children: [
            {
              name: "Handle",
              origin: [0, 12, 0],
              cube: cubeDef("Handle", 0, 12, 0, 3, 24, 3),
              children: [
                {
                  name: "Head",
                  origin: [0, 22, 0],
                  cube: cubeDef("Head", 0, 22, 0, 8, 8, 4)
                }
              ]
            }
          ]
        }
      ]
    },
    pickaxe: {
      label: "Pickaxe",
      format: "hytale_prop",
      textureWidth: 64,
      textureHeight: 64,
      bones: [
        {
          name: "R-Attachment",
          origin: [0, 0, 0],
          children: [
            {
              name: "Handle",
              origin: [0, 12, 0],
              cube: cubeDef("Handle", 0, 12, 0, 3, 24, 3),
              children: [
                {
                  name: "Head",
                  origin: [0, 24, 0],
                  cube: cubeDef("Head", 0, 24, 0, 12, 6, 4)
                }
              ]
            }
          ]
        }
      ]
    },
    bow: {
      label: "Bow",
      format: "hytale_prop",
      textureWidth: 64,
      textureHeight: 64,
      bones: [
        {
          name: "R-Attachment",
          origin: [0, 0, 0],
          children: [
            {
              name: "Body",
              origin: [0, 0, 0],
              cube: cubeDef("Body", 0, 12, 0, 2, 24, 2),
              children: [
                {
                  name: "TopLimb",
                  origin: [0, 24, 0],
                  cube: cubeDef("TopLimb", 0, 30, 0, 2, 12, 2)
                },
                {
                  name: "BottomLimb",
                  origin: [0, 0, 0],
                  cube: cubeDef("BottomLimb", 0, -6, 0, 2, 12, 2)
                }
              ]
            }
          ]
        }
      ]
    },
    shield: {
      label: "Shield",
      format: "hytale_prop",
      textureWidth: 64,
      textureHeight: 64,
      bones: [
        {
          name: "L-Attachment",
          origin: [0, 0, 0],
          children: [
            {
              name: "Body",
              origin: [0, 8, 0],
              cube: cubeDef("Body", 0, 8, 0, 12, 16, 3),
              children: [
                {
                  name: "Handle",
                  origin: [0, 8, -1.5],
                  cube: cubeDef("Handle", 0, 8, -1.5, 3, 6, 2)
                }
              ]
            }
          ]
        }
      ]
    },
    furniture: {
      label: "Furniture",
      format: "hytale_prop",
      textureWidth: 64,
      textureHeight: 64,
      bones: [
        {
          name: "Root",
          origin: [0, 0, 0],
          children: [
            {
              name: "Body",
              origin: [0, 8, 0],
              cube: cubeDef("Body", 0, 8, 0, 16, 16, 16)
            }
          ]
        }
      ]
    },
    decoration: {
      label: "Decoration",
      format: "hytale_prop",
      textureWidth: 32,
      textureHeight: 32,
      bones: [
        {
          name: "Root",
          origin: [0, 0, 0],
          children: [
            {
              name: "Body",
              origin: [0, 4, 0],
              cube: cubeDef("Body", 0, 4, 0, 8, 8, 8)
            }
          ]
        }
      ]
    },
    character: {
      label: "Character",
      format: "hytale_character",
      textureWidth: 256,
      textureHeight: 256,
      bones: [
        {
          name: "Root",
          origin: [0, 0, 0],
          children: [
            {
              name: "Body",
              origin: [0, 12, 0],
              children: [
                {
                  name: "Head",
                  origin: [0, 28, 0],
                  cube: cubeDef("Head", 0, 28, 0, 8, 8, 8)
                },
                {
                  name: "Chest",
                  origin: [0, 18, 0],
                  cube: cubeDef("Chest", 0, 18, 0, 8, 12, 4)
                },
                {
                  name: "Pelvis",
                  origin: [0, 12, 0],
                  cube: cubeDef("Pelvis", 0, 12, 0, 8, 4, 4)
                },
                {
                  name: "Arm_Right",
                  origin: [8, 18, 0],
                  cube: cubeDef("Arm_Right", 8, 18, 0, 4, 12, 4)
                },
                {
                  name: "Arm_Left",
                  origin: [-8, 18, 0],
                  cube: cubeDef("Arm_Left", -8, 18, 0, 4, 12, 4)
                },
                {
                  name: "Leg_Right",
                  origin: [2, 6, 0],
                  cube: cubeDef("Leg_Right", 2, 6, 0, 4, 12, 4)
                },
                {
                  name: "Leg_Left",
                  origin: [-2, 6, 0],
                  cube: cubeDef("Leg_Left", -2, 6, 0, 4, 12, 4)
                }
              ]
            }
          ]
        }
      ]
    },
    creature: {
      label: "Creature",
      format: "hytale_character",
      textureWidth: 128,
      textureHeight: 128,
      bones: [
        {
          name: "Root",
          origin: [0, 0, 0],
          children: [
            {
              name: "Body",
              origin: [0, 8, 0],
              cube: cubeDef("Body", 0, 8, 0, 10, 8, 6)
            },
            {
              name: "Head",
              origin: [0, 14, 0],
              cube: cubeDef("Head", 0, 14, 4, 8, 8, 8)
            },
            {
              name: "Leg_Front_Right",
              origin: [3, 4, 3],
              cube: cubeDef("Leg_Front_Right", 3, 3, 3, 3, 6, 3)
            },
            {
              name: "Leg_Front_Left",
              origin: [-3, 4, 3],
              cube: cubeDef("Leg_Front_Left", -3, 3, 3, 3, 6, 3)
            },
            {
              name: "Leg_Back_Right",
              origin: [3, 4, -3],
              cube: cubeDef("Leg_Back_Right", 3, 3, -3, 3, 6, 3)
            },
            {
              name: "Leg_Back_Left",
              origin: [-3, 4, -3],
              cube: cubeDef("Leg_Back_Left", -3, 3, -3, 3, 6, 3)
            }
          ]
        }
      ]
    },
    helmet: {
      label: "Helmet",
      format: "hytale_character",
      textureWidth: 64,
      textureHeight: 64,
      bones: [{
        name: "Head-Attachment",
        origin: [0, 0, 0],
        children: [{
          name: "Helmet",
          origin: [0, 28, 0],
          cube: cubeDef("Helmet", 0, 28, 0, 10, 10, 10)
        }]
      }]
    },
    chestplate: {
      label: "Chestplate",
      format: "hytale_character",
      textureWidth: 128,
      textureHeight: 128,
      bones: [{
        name: "Body-Attachment",
        origin: [0, 0, 0],
        children: [
          {
            name: "Torso",
            origin: [0, 18, 0],
            cube: cubeDef("Torso", 0, 18, 0, 10, 12, 6)
          },
          {
            name: "Shoulder_Right",
            origin: [7, 24, 0],
            cube: cubeDef("Shoulder_Right", 7, 24, 0, 6, 4, 6)
          },
          {
            name: "Shoulder_Left",
            origin: [-7, 24, 0],
            cube: cubeDef("Shoulder_Left", -7, 24, 0, 6, 4, 6)
          }
        ]
      }]
    },
    boots: {
      label: "Boots",
      format: "hytale_character",
      textureWidth: 64,
      textureHeight: 64,
      bones: [{
        name: "Feet-Attachment",
        origin: [0, 0, 0],
        children: [
          {
            name: "Boot_Right",
            origin: [2, 2, 0],
            cube: cubeDef("Boot_Right", 2, 2, 0, 6, 4, 6)
          },
          {
            name: "Boot_Left",
            origin: [-2, 2, 0],
            cube: cubeDef("Boot_Left", -2, 2, 0, 6, 4, 6)
          }
        ]
      }]
    },
    gauntlets: {
      label: "Gauntlets",
      format: "hytale_character",
      textureWidth: 64,
      textureHeight: 64,
      bones: [{
        name: "Hands-Attachment",
        origin: [0, 0, 0],
        children: [
          {
            name: "Gauntlet_Right",
            origin: [8, 12, 0],
            cube: cubeDef("Gauntlet_Right", 8, 12, 0, 6, 6, 6)
          },
          {
            name: "Gauntlet_Left",
            origin: [-8, 12, 0],
            cube: cubeDef("Gauntlet_Left", -8, 12, 0, 6, 6, 6)
          }
        ]
      }]
    },
    staff: {
      label: "Staff",
      format: "hytale_prop",
      textureWidth: 64,
      textureHeight: 64,
      bones: [{
        name: "R-Attachment",
        origin: [0, 0, 0],
        children: [{
          name: "Shaft",
          origin: [0, 16, 0],
          cube: cubeDef("Shaft", 0, 16, 0, 2, 32, 2),
          children: [{
            name: "Orb",
            origin: [0, 34, 0],
            cube: cubeDef("Orb", 0, 34, 0, 6, 6, 6)
          }]
        }]
      }]
    },
    spear: {
      label: "Spear",
      format: "hytale_prop",
      textureWidth: 64,
      textureHeight: 64,
      bones: [{
        name: "R-Attachment",
        origin: [0, 0, 0],
        children: [{
          name: "Shaft",
          origin: [0, 18, 0],
          cube: cubeDef("Shaft", 0, 18, 0, 2, 36, 2),
          children: [{
            name: "Tip",
            origin: [0, 38, 0],
            cube: cubeDef("Tip", 0, 38, 0, 4, 6, 2)
          }]
        }]
      }]
    },
    hammer: {
      label: "Hammer",
      format: "hytale_prop",
      textureWidth: 64,
      textureHeight: 64,
      bones: [{
        name: "R-Attachment",
        origin: [0, 0, 0],
        children: [{
          name: "Handle",
          origin: [0, 12, 0],
          cube: cubeDef("Handle", 0, 12, 0, 3, 24, 3),
          children: [{
            name: "Head",
            origin: [0, 24, 0],
            cube: cubeDef("Head", 0, 24, 0, 10, 6, 8)
          }]
        }]
      }]
    },
    wand: {
      label: "Wand",
      format: "hytale_prop",
      textureWidth: 32,
      textureHeight: 32,
      bones: [{
        name: "R-Attachment",
        origin: [0, 0, 0],
        children: [{
          name: "Stick",
          origin: [0, 8, 0],
          cube: cubeDef("Stick", 0, 8, 0, 2, 16, 2),
          children: [{
            name: "Crystal",
            origin: [0, 17, 0],
            cube: cubeDef("Crystal", 0, 17, 0, 3, 3, 3)
          }]
        }]
      }]
    },
    tree: {
      label: "Tree",
      format: "hytale_prop",
      textureWidth: 128,
      textureHeight: 128,
      bones: [{
        name: "Root",
        origin: [0, 0, 0],
        children: [
          {
            name: "Trunk",
            origin: [0, 12, 0],
            cube: cubeDef("Trunk", 0, 12, 0, 6, 24, 6)
          },
          {
            name: "Canopy",
            origin: [0, 28, 0],
            cube: cubeDef("Canopy", 0, 28, 0, 16, 14, 16)
          }
        ]
      }]
    },
    rock: {
      label: "Rock",
      format: "hytale_prop",
      textureWidth: 32,
      textureHeight: 32,
      bones: [{
        name: "Root",
        origin: [0, 0, 0],
        children: [{
          name: "Body",
          origin: [0, 4, 0],
          cube: cubeDef("Body", 0, 4, 0, 10, 8, 10)
        }]
      }]
    },
    crate: {
      label: "Crate",
      format: "hytale_prop",
      textureWidth: 64,
      textureHeight: 64,
      bones: [{
        name: "Root",
        origin: [0, 0, 0],
        children: [
          {
            name: "Body",
            origin: [0, 6, 0],
            cube: cubeDef("Body", 0, 6, 0, 12, 12, 12)
          },
          {
            name: "Lid",
            origin: [0, 13, 0],
            cube: cubeDef("Lid", 0, 13, 0, 14, 2, 14)
          }
        ]
      }]
    },
    bird: {
      label: "Bird",
      format: "hytale_character",
      textureWidth: 64,
      textureHeight: 64,
      bones: [{
        name: "Root",
        origin: [0, 0, 0],
        children: [
          {
            name: "Body",
            origin: [0, 6, 0],
            cube: cubeDef("Body", 0, 6, 0, 6, 5, 8)
          },
          {
            name: "Head",
            origin: [0, 10, 5],
            cube: cubeDef("Head", 0, 10, 5, 5, 5, 5)
          },
          {
            name: "Wing_Right",
            origin: [4, 8, 0],
            cube: cubeDef("Wing_Right", 6, 7, 0, 6, 2, 6)
          },
          {
            name: "Wing_Left",
            origin: [-4, 8, 0],
            cube: cubeDef("Wing_Left", -6, 7, 0, 6, 2, 6)
          },
          {
            name: "Tail",
            origin: [0, 6, -4],
            cube: cubeDef("Tail", 0, 7, -6, 4, 2, 4)
          }
        ]
      }]
    },
    fish: {
      label: "Fish",
      format: "hytale_character",
      textureWidth: 64,
      textureHeight: 64,
      bones: [{
        name: "Root",
        origin: [0, 0, 0],
        children: [
          {
            name: "Body",
            origin: [0, 4, 0],
            cube: cubeDef("Body", 0, 4, 0, 4, 6, 12)
          },
          {
            name: "Head",
            origin: [0, 5, 8],
            cube: cubeDef("Head", 0, 5, 8, 5, 5, 4)
          },
          {
            name: "Tail",
            origin: [0, 5, -8],
            cube: cubeDef("Tail", 0, 5, -8, 2, 6, 4)
          },
          {
            name: "Fin_Top",
            origin: [0, 9, 0],
            cube: cubeDef("Fin_Top", 0, 9, 0, 1, 3, 4)
          }
        ]
      }]
    }
  };
  function buildBoneHierarchy(boneDef, parent) {
    const group = new Group({
      name: boneDef.name,
      origin: boneDef.origin
    }).init();
    if (parent) {
      group.addTo(parent);
    }
    if (boneDef.cube) {
      new Cube({
        name: boneDef.cube.name,
        from: boneDef.cube.from,
        to: boneDef.cube.to
      }).init().addTo(group);
    }
    if (boneDef.children) {
      for (const childDef of boneDef.children) {
        buildBoneHierarchy(childDef, group);
      }
    }
    return group;
  }
  function resolveFormat(formatId) {
    if (Formats[formatId]) {
      return Formats[formatId];
    }
    if (Formats.free) {
      Blockbench.showQuickMessage(
        `Hytale plugin format "${formatId}" not found. Using free format instead.`,
        3e3
      );
      return Formats.free;
    }
    return null;
  }
  function createFromTemplate(template, assetName) {
    const format = resolveFormat(template.format);
    if (!format) {
      Blockbench.showMessageBox({
        title: "Template Wizard - Error",
        message: "Could not find a compatible format. Please ensure the Hytale Model Creator plugin is installed.",
        icon: "error"
      });
      return;
    }
    newProject(format);
    Project.texture_width = template.textureWidth;
    Project.texture_height = template.textureHeight;
    if (assetName) {
      Project.name = assetName;
    }
    for (const rootBone of template.bones) {
      buildBoneHierarchy(rootBone);
    }
    const tex = new Texture({
      name: assetName || template.label,
      width: template.textureWidth,
      height: template.textureHeight
    }).add(false).fillRecursive("#808080");
    if (typeof Canvas !== "undefined" && Canvas.updateAll) {
      Canvas.updateAll();
    }
    Blockbench.showQuickMessage(
      `Created ${template.label} template "${assetName || "Untitled"}" (${template.textureWidth}x${template.textureHeight})`,
      3e3
    );
  }
  function buildTemplateOptions() {
    const CATEGORIES = {
      "Weapons": ["sword", "axe", "pickaxe", "bow", "staff", "spear", "hammer", "wand"],
      "Defense": ["shield"],
      "Armor": ["helmet", "chestplate", "boots", "gauntlets"],
      "Props": ["furniture", "decoration", "crate"],
      "Environment": ["tree", "rock"],
      "Characters": ["character"],
      "Creatures": ["creature", "bird", "fish"]
    };
    const options = {};
    for (const [category, keys] of Object.entries(CATEGORIES)) {
      for (const key of keys) {
        const tpl = TEMPLATES[key];
        if (tpl) {
          const formatLabel = tpl.format === "hytale_character" ? "Character" : "Prop";
          options[key] = `[${category}] ${tpl.label}  (${formatLabel} - ${tpl.textureWidth}x${tpl.textureHeight})`;
        }
      }
    }
    return options;
  }
  function showTemplateWizardDialog() {
    new Dialog({
      id: "myrlin_template_wizard_dialog",
      title: "New Hytale Asset - Myrlin's Tools",
      form: {
        asset_type: {
          label: "Asset Type",
          type: "select",
          options: buildTemplateOptions(),
          value: "sword"
        },
        asset_name: {
          label: "Asset Name",
          type: "text",
          value: "",
          placeholder: "e.g. Diamond Sword"
        }
      },
      onConfirm(formData) {
        const templateKey = formData.asset_type;
        const template = TEMPLATES[templateKey];
        if (!template) {
          Blockbench.showQuickMessage("Unknown template type selected.", 2e3);
          return;
        }
        createFromTemplate(template, formData.asset_name);
      }
    }).show();
  }
  function setupTemplateWizard() {
    const hytaleAvailable = !!(Formats && (Formats.hytale_prop || Formats.hytale_character));
    if (!hytaleAvailable) {
      console.warn(
        "[Myrlin's Tools] Hytale Model Creator plugin not detected. Template Wizard will fall back to free format."
      );
    }
    const wizardAction = new Action("myrlin_template_wizard", {
      name: "New Hytale Asset",
      description: "Create a new Hytale model from a structured template (Myrlin's Tools)",
      icon: "note_add",
      category: "file",
      click: () => {
        const hytaleReady = !!(Formats && (Formats.hytale_prop || Formats.hytale_character));
        if (!hytaleReady) {
          Blockbench.showMessageBox({
            title: "Hytale Plugin Required",
            message: 'The Hytale Model Creator plugin is not installed.\n\nTemplates will use the "free" format instead, which may not include Hytale-specific features like attachment points.\n\nInstall the Hytale Model Creator plugin from the Blockbench plugin store for the best experience.',
            icon: "warning",
            buttons: ["Continue Anyway", "Cancel"],
            confirm: 0,
            cancel: 1,
            // @ts-ignore
            onConfirm: () => {
              showTemplateWizardDialog();
            }
          });
          return;
        }
        showTemplateWizardDialog();
      }
    });
    track(wizardAction);
    MenuBar.addAction(wizardAction, "file");
  }

  // src/features/validator.ts
  var HYTALE_MAX_NODES3 = 255;
  var HYTALE_WARN_NODES = 200;
  var CHARACTER_PIXELS_PER_UNIT = 64;
  var PROP_PIXELS_PER_UNIT = 32;
  var PIXEL_RATIO_TOLERANCE = 0.5;
  var MIN_STRETCH_RATIO = 0.7;
  var MAX_STRETCH_RATIO = 1.3;
  var MAX_TEXTURE_DIMENSION = 512;
  var MIN_TEXTURE_DIMENSION = 16;
  var REQUIRED_CHARACTER_BONES = [
    {
      canonical: "Head",
      variations: ["head"]
    },
    {
      canonical: "Body",
      variations: ["body", "torso", "chest"]
    },
    {
      canonical: "Arm_Right",
      variations: ["arm_right", "armright", "arm right", "right_arm", "rightarm", "right arm"]
    },
    {
      canonical: "Arm_Left",
      variations: ["arm_left", "armleft", "arm left", "left_arm", "leftarm", "left arm"]
    },
    {
      canonical: "Leg_Right",
      variations: ["leg_right", "legright", "leg right", "right_leg", "rightleg", "right leg"]
    },
    {
      canonical: "Leg_Left",
      variations: ["leg_left", "legleft", "leg left", "left_leg", "leftleg", "left leg"]
    }
  ];
  function worstSeverity(a, b) {
    const priority = { pass: 0, warn: 1, fail: 2 };
    return priority[a] >= priority[b] ? a : b;
  }
  function isCharacterFormat() {
    return Format && Format.id && Format.id.toLowerCase().includes("character");
  }
  function isPropFormat() {
    return Format && Format.id && Format.id.toLowerCase().includes("prop");
  }
  function isPowerOfTwo(n) {
    return n > 0 && (n & n - 1) === 0;
  }
  function severityIcon(severity) {
    switch (severity) {
      case "pass":
        return "\u2705";
      case "warn":
        return "\u26A0\uFE0F";
      case "fail":
        return "\u274C";
    }
  }
  function severityLabel(severity) {
    switch (severity) {
      case "pass":
        return "PASS";
      case "warn":
        return "WARN";
      case "fail":
        return "FAIL";
    }
  }
  function checkNodeCount() {
    const exportableCubes = Cube.all.filter((c) => c.export !== false);
    const exportableGroups = Group.all.filter((g) => g.export !== false);
    let freeSlots = 0;
    for (const group of exportableGroups) {
      const groupHasCube = exportableCubes.some((cube) => {
        let parent = cube.parent;
        while (parent) {
          if (parent === group)
            return true;
          parent = parent.parent;
        }
        return false;
      });
      if (groupHasCube) {
        freeSlots++;
      }
    }
    const rawCount = exportableCubes.length + exportableGroups.length;
    const effectiveCount = rawCount - freeSlots;
    let severity = "pass";
    if (effectiveCount > HYTALE_MAX_NODES3) {
      severity = "fail";
    } else if (effectiveCount > HYTALE_WARN_NODES) {
      severity = "warn";
    }
    const details = freeSlots > 0 ? `${exportableCubes.length} cubes + ${exportableGroups.length} groups = ${rawCount} raw nodes. ${freeSlots} free slot(s) from first-cube-in-group rule. Effective: ${effectiveCount}.` : `${exportableCubes.length} cubes + ${exportableGroups.length} groups = ${effectiveCount} nodes.`;
    return {
      id: "node_count",
      name: "Node Count",
      severity,
      message: `${effectiveCount} / ${HYTALE_MAX_NODES3} nodes`,
      details
    };
  }
  function checkPixelRatio() {
    const textures = Texture.all;
    if (!textures || textures.length === 0) {
      return {
        id: "pixel_ratio",
        name: "Pixel Ratio",
        severity: "pass",
        message: "Skipped (no texture)",
        details: "No texture found in the model. This check requires at least one texture."
      };
    }
    const texture = textures[0];
    const texWidth = texture.width || 0;
    const texHeight = texture.height || 0;
    if (texWidth === 0 || texHeight === 0) {
      return {
        id: "pixel_ratio",
        name: "Pixel Ratio",
        severity: "pass",
        message: "Skipped (texture has no dimensions)",
        details: "Texture dimensions could not be determined."
      };
    }
    let expectedRatio = PROP_PIXELS_PER_UNIT;
    let formatName = "prop";
    if (isCharacterFormat()) {
      expectedRatio = CHARACTER_PIXELS_PER_UNIT;
      formatName = "character";
    } else if (isPropFormat()) {
      expectedRatio = PROP_PIXELS_PER_UNIT;
      formatName = "prop";
    } else {
      return {
        id: "pixel_ratio",
        name: "Pixel Ratio",
        severity: "pass",
        message: "Skipped (non-Hytale format)",
        details: "Pixel ratio check only applies to Hytale character and prop formats."
      };
    }
    const cubes = Cube.all.filter((c) => c.export !== false);
    if (cubes.length === 0) {
      return {
        id: "pixel_ratio",
        name: "Pixel Ratio",
        severity: "pass",
        message: "Skipped (no cubes)",
        details: "No exportable cubes found in the model."
      };
    }
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (const cube of cubes) {
      minX = Math.min(minX, cube.from[0]);
      minY = Math.min(minY, cube.from[1]);
      minZ = Math.min(minZ, cube.from[2]);
      maxX = Math.max(maxX, cube.to[0]);
      maxY = Math.max(maxY, cube.to[1]);
      maxZ = Math.max(maxZ, cube.to[2]);
    }
    const modelSizeUnits = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
    if (modelSizeUnits <= 0) {
      return {
        id: "pixel_ratio",
        name: "Pixel Ratio",
        severity: "pass",
        message: "Skipped (zero-size model)",
        details: "Model has zero extent in all dimensions."
      };
    }
    const maxTexDim = Math.max(texWidth, texHeight);
    const actualRatio = maxTexDim / modelSizeUnits;
    const deviation = Math.abs(actualRatio - expectedRatio) / expectedRatio;
    let severity = "pass";
    if (deviation > PIXEL_RATIO_TOLERANCE) {
      severity = "warn";
    }
    const ratioFormatted = actualRatio.toFixed(1);
    return {
      id: "pixel_ratio",
      name: "Pixel Ratio",
      severity,
      message: severity === "pass" ? `${ratioFormatted} px/unit (expected ~${expectedRatio} for ${formatName})` : `${ratioFormatted} px/unit (expected ~${expectedRatio}, off by ${(deviation * 100).toFixed(0)}%)`,
      details: `Texture: ${texWidth}x${texHeight}, Model extent: ${modelSizeUnits.toFixed(1)} units, Actual ratio: ${ratioFormatted} px/unit, Expected: ~${expectedRatio} px/unit for ${formatName} format. Deviation: ${(deviation * 100).toFixed(1)}% (threshold: ${PIXEL_RATIO_TOLERANCE * 100}%).`
    };
  }
  function checkStretchLimits() {
    const cubes = Cube.all.filter((c) => c.export !== false);
    if (cubes.length === 0) {
      return {
        id: "stretch_limits",
        name: "Stretch Limits",
        severity: "pass",
        message: "No cubes to check",
        details: "No exportable cubes found in the model."
      };
    }
    const violatingCubes = [];
    for (const cube of cubes) {
      const sizeX = Math.abs(cube.to[0] - cube.from[0]);
      const sizeY = Math.abs(cube.to[1] - cube.from[1]);
      const sizeZ = Math.abs(cube.to[2] - cube.from[2]);
      const minDim = Math.min(sizeX, sizeY, sizeZ);
      if (minDim <= 0)
        continue;
      const ratioX = sizeX / minDim;
      const ratioY = sizeY / minDim;
      const ratioZ = sizeZ / minDim;
      const maxRatio = Math.max(ratioX, ratioY, ratioZ);
      if (maxRatio > MAX_STRETCH_RATIO) {
        const cubeName = cube.name || cube.uuid || "unnamed";
        violatingCubes.push(`${cubeName} (${maxRatio.toFixed(2)}x)`);
      }
    }
    const count = violatingCubes.length;
    if (count > 0) {
      const shownCubes = violatingCubes.slice(0, 5);
      const moreCount = count - shownCubes.length;
      let detailList = shownCubes.join(", ");
      if (moreCount > 0) {
        detailList += `, and ${moreCount} more`;
      }
      return {
        id: "stretch_limits",
        name: "Stretch Limits",
        severity: "fail",
        message: `${count} cube${count !== 1 ? "s" : ""} exceed stretch limits`,
        details: `Cubes with stretch ratio > ${MAX_STRETCH_RATIO}x (allowed range: ${MIN_STRETCH_RATIO}x - ${MAX_STRETCH_RATIO}x): ${detailList}. The stretch ratio is the largest dimension divided by the smallest dimension of each cube.`
      };
    }
    return {
      id: "stretch_limits",
      name: "Stretch Limits",
      severity: "pass",
      message: "All cubes within stretch limits",
      details: `All ${cubes.length} exportable cubes have stretch ratios within the ${MIN_STRETCH_RATIO}x - ${MAX_STRETCH_RATIO}x range.`
    };
  }
  function checkBoneNaming() {
    if (!isCharacterFormat()) {
      return {
        id: "bone_naming",
        name: "Bone Naming",
        severity: "pass",
        message: "Skipped (non-character format)",
        details: "Bone naming validation only applies to Hytale character formats."
      };
    }
    const groups = Group.all;
    if (!groups || groups.length === 0) {
      return {
        id: "bone_naming",
        name: "Bone Naming",
        severity: "warn",
        message: "No bones found",
        details: "No groups (bones) were found in the model. Character models require standard bone hierarchy."
      };
    }
    const groupNamesLower = groups.map((g) => (g.name || "").toLowerCase().trim());
    const missingBones = [];
    const foundBones = [];
    for (const bone of REQUIRED_CHARACTER_BONES) {
      const found = bone.variations.some(
        (variation) => groupNamesLower.includes(variation.toLowerCase())
      );
      if (found) {
        foundBones.push(bone.canonical);
      } else {
        missingBones.push(bone.canonical);
      }
    }
    if (missingBones.length > 0) {
      return {
        id: "bone_naming",
        name: "Bone Naming",
        severity: "warn",
        message: `${missingBones.length} required bone${missingBones.length !== 1 ? "s" : ""} missing`,
        details: `Missing: ${missingBones.join(", ")}. Found: ${foundBones.join(", ") || "none"}. Required bones for character format: ${REQUIRED_CHARACTER_BONES.map((b) => b.canonical).join(", ")}.`
      };
    }
    return {
      id: "bone_naming",
      name: "Bone Naming",
      severity: "pass",
      message: "All required bones present",
      details: `Found all ${REQUIRED_CHARACTER_BONES.length} required bones: ${foundBones.join(", ")}.`
    };
  }
  function checkTextureResolution() {
    const textures = Texture.all;
    if (!textures || textures.length === 0) {
      return {
        id: "texture_resolution",
        name: "Texture Resolution",
        severity: "pass",
        message: "Skipped (no texture)",
        details: "No texture found in the model. This check requires at least one texture."
      };
    }
    const texture = textures[0];
    const width = texture.width || 0;
    const height = texture.height || 0;
    if (width === 0 || height === 0) {
      return {
        id: "texture_resolution",
        name: "Texture Resolution",
        severity: "warn",
        message: "Texture has no dimensions",
        details: "Texture dimensions could not be determined. Ensure the texture is loaded correctly."
      };
    }
    const widthIsPow2 = isPowerOfTwo(width);
    const heightIsPow2 = isPowerOfTwo(height);
    if (!widthIsPow2 || !heightIsPow2) {
      const nonPow2Dims = [];
      if (!widthIsPow2)
        nonPow2Dims.push(`width=${width}`);
      if (!heightIsPow2)
        nonPow2Dims.push(`height=${height}`);
      return {
        id: "texture_resolution",
        name: "Texture Resolution",
        severity: "fail",
        message: `Non-power-of-2: ${width}x${height}`,
        details: `Texture dimensions must be powers of 2 (e.g. 16, 32, 64, 128, 256, 512). Non-compliant: ${nonPow2Dims.join(", ")}.`
      };
    }
    const maxDim = Math.max(width, height);
    const minDim = Math.min(width, height);
    if (maxDim > MAX_TEXTURE_DIMENSION) {
      return {
        id: "texture_resolution",
        name: "Texture Resolution",
        severity: "warn",
        message: `Large texture: ${width}x${height} (>${MAX_TEXTURE_DIMENSION})`,
        details: `Texture dimensions (${width}x${height}) exceed the recommended maximum of ${MAX_TEXTURE_DIMENSION}px. Large textures increase file size and may cause performance issues in Hytale.`
      };
    }
    if (minDim < MIN_TEXTURE_DIMENSION) {
      return {
        id: "texture_resolution",
        name: "Texture Resolution",
        severity: "warn",
        message: `Small texture: ${width}x${height} (<${MIN_TEXTURE_DIMENSION})`,
        details: `Texture dimensions (${width}x${height}) are below the recommended minimum of ${MIN_TEXTURE_DIMENSION}px. Small textures may lack detail for the model.`
      };
    }
    return {
      id: "texture_resolution",
      name: "Texture Resolution",
      severity: "pass",
      message: `${width}x${height} (power-of-2)`,
      details: `Texture resolution ${width}x${height} is valid: power-of-2 and within the ${MIN_TEXTURE_DIMENSION}-${MAX_TEXTURE_DIMENSION}px recommended range.`
    };
  }
  function validateModel() {
    const results = [
      checkNodeCount(),
      checkPixelRatio(),
      checkStretchLimits(),
      checkBoneNaming(),
      checkTextureResolution()
    ];
    let overallSeverity = "pass";
    for (const result of results) {
      overallSeverity = worstSeverity(overallSeverity, result.severity);
    }
    return {
      results,
      overallSeverity,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  function formatReportLines(report) {
    const lines = [];
    const overallIcon = severityIcon(report.overallSeverity);
    const overallLabel = severityLabel(report.overallSeverity);
    lines.push(`## ${overallIcon} Overall: **${overallLabel}**`);
    lines.push("");
    lines.push("---");
    lines.push("");
    for (const result of report.results) {
      const icon = severityIcon(result.severity);
      lines.push(`${icon} **${result.name}**: ${result.message}`);
      if (result.details) {
        lines.push(`  _${result.details}_`);
      }
      lines.push("");
    }
    lines.push("---");
    lines.push(`_Validated at ${new Date(report.timestamp).toLocaleTimeString()}_`);
    return lines;
  }
  function setupValidator() {
    const validateAction = new Action("myrlin_validate", {
      name: "Validate Hytale Model",
      description: "Check model against Hytale art style requirements (Myrlin's Tools)",
      icon: "verified",
      category: "tools",
      click: () => {
        const report = validateModel();
        const lines = formatReportLines(report);
        let titleSuffix = "";
        switch (report.overallSeverity) {
          case "pass":
            titleSuffix = " - All Checks Passed";
            break;
          case "warn":
            titleSuffix = " - Warnings Found";
            break;
          case "fail":
            titleSuffix = " - Issues Found";
            break;
        }
        new Dialog({
          id: "myrlin_validate_dialog",
          title: `Validate Hytale Model${titleSuffix}`,
          lines,
          buttons: ["Close"],
          onConfirm: () => {
          }
        }).show();
        const passCount = report.results.filter((r) => r.severity === "pass").length;
        const warnCount = report.results.filter((r) => r.severity === "warn").length;
        const failCount = report.results.filter((r) => r.severity === "fail").length;
        Blockbench.showQuickMessage(
          `Validation: ${passCount} passed, ${warnCount} warnings, ${failCount} failed`,
          2e3
        );
      }
    });
    track(validateAction);
    MenuBar.addAction(validateAction, "tools");
  }

  // src/features/config_generator.ts
  function generateItemConfig(form) {
    return {
      TranslationProperties: {
        Name: `server.items.${form.assetId}.name`
      },
      Categories: [`Items.${form.category}`],
      Scale: 1,
      Model: `Models/Items/${form.assetId}/${form.assetId}.blockymodel`,
      Texture: `Textures/Items/${form.assetId}/${form.assetId}.png`,
      Icon: `Icons/Items/${form.assetId}.png`,
      Quality: form.quality,
      Tags: {
        Type: [form.category]
      }
    };
  }
  function generateBlockConfig(form) {
    return {
      Id: `${form.modName}:${form.assetId}`,
      DisplayName: {
        en: form.displayName
      },
      BlockType: {
        Material: "Solid",
        DrawType: "Cube",
        Textures: [
          { All: `Textures/Blocks/${form.assetId}.png` }
        ],
        BlockSoundSetId: "stone"
      }
    };
  }
  function generateEntityConfig(form) {
    return {
      Id: `${form.modName}:${form.assetId}`,
      DisplayName: {
        en: form.displayName
      },
      ModelId: `Models/Creatures/${form.assetId}/${form.assetId}.blockymodel`,
      TextureId: `Textures/Creatures/${form.assetId}/${form.assetId}.png`,
      Stats: {
        Health: 20,
        Speed: 0.25
      },
      Behavior: {
        Type: "Creature"
      }
    };
  }
  function generateManifest(form) {
    return {
      name: form.modName,
      version: "1.0.0",
      description: `Mod package containing ${form.displayName} (${form.assetType})`,
      author: "Myrlin Forge",
      assets: [
        {
          type: form.assetType.toLowerCase(),
          id: form.assetId,
          displayName: form.displayName
        }
      ]
    };
  }
  function getModelPath(assetType, assetId) {
    switch (assetType) {
      case "Item":
        return `Common/Models/Items/${assetId}/${assetId}.blockymodel`;
      case "Block":
        return `Common/Models/Blocks/${assetId}/${assetId}.blockymodel`;
      case "Entity":
        return `Common/Models/Creatures/${assetId}/${assetId}.blockymodel`;
      default:
        return `Common/Models/${assetId}/${assetId}.blockymodel`;
    }
  }
  function getTexturePath(assetType, assetId) {
    switch (assetType) {
      case "Item":
        return `Common/Textures/Items/${assetId}/${assetId}.png`;
      case "Block":
        return `Common/Textures/Blocks/${assetId}.png`;
      case "Entity":
        return `Common/Textures/Creatures/${assetId}/${assetId}.png`;
      default:
        return `Common/Textures/${assetId}/${assetId}.png`;
    }
  }
  function getConfigPath(assetType, assetId) {
    switch (assetType) {
      case "Item":
        return `Server/Item/Items/${assetId}.json`;
      case "Block":
        return `Server/Block/Blocks/${assetId}.json`;
      case "Entity":
        return `Server/Entity/Entities/${assetId}.json`;
      default:
        return `Server/${assetId}.json`;
    }
  }
  function dataUrlToUint8Array(dataUrl) {
    const base64 = dataUrl.split(",")[1];
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
  function extractTextureData() {
    const texture = Texture.all[0];
    if (!texture) {
      return null;
    }
    try {
      const dataUrl = texture.canvas.toDataURL("image/png");
      return dataUrlToUint8Array(dataUrl);
    } catch (e) {
      console.warn("[Myrlin's Tools] Failed to extract texture data:", e);
      return null;
    }
  }
  async function generateModPackage(form) {
    let config;
    switch (form.assetType) {
      case "Item":
        config = generateItemConfig(form);
        break;
      case "Block":
        config = generateBlockConfig(form);
        break;
      case "Entity":
        config = generateEntityConfig(form);
        break;
      default:
        config = generateItemConfig(form);
    }
    const manifest = generateManifest(form);
    const modelData = Codecs.blockymodel ? Codecs.blockymodel.compile() : JSON.stringify({});
    const textureData = extractTextureData();
    const zip = new JSZip();
    zip.file("manifest.json", JSON.stringify(manifest, null, 2));
    const configPath = getConfigPath(form.assetType, form.assetId);
    zip.file(configPath, JSON.stringify(config, null, 2));
    const modelPath = getModelPath(form.assetType, form.assetId);
    zip.file(modelPath, typeof modelData === "string" ? modelData : JSON.stringify(modelData, null, 2));
    const texturePath = getTexturePath(form.assetType, form.assetId);
    if (textureData) {
      zip.file(texturePath, textureData);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const filename = `${form.modName}.zip`;
    try {
      Blockbench.export({
        type: "Zip Archive",
        extensions: ["zip"],
        name: filename,
        content: blob,
        savetype: "zip"
      });
    } catch (_exportError) {
      try {
        saveAs(blob, filename);
      } catch (saveError) {
        console.error("[Myrlin's Tools] Failed to save zip:", saveError);
        Blockbench.showMessageBox({
          title: "Export Failed",
          message: `Failed to save the mod package. Error: ${saveError}`,
          icon: "error"
        });
      }
    }
  }
  function showConfigDialog() {
    new Dialog({
      id: "myrlin_config_generator_dialog",
      title: "Export Hytale Mod Package - Myrlin's Tools",
      form: {
        assetType: {
          label: "Asset Type",
          type: "select",
          options: {
            Item: "Item",
            Block: "Block",
            Entity: "Entity"
          },
          value: "Item"
        },
        assetId: {
          label: "Asset ID",
          type: "text",
          placeholder: "e.g., crystal_sword",
          value: ""
        },
        displayName: {
          label: "Display Name",
          type: "text",
          placeholder: "e.g., Crystal Sword",
          value: ""
        },
        modName: {
          label: "Mod Name",
          type: "text",
          placeholder: "e.g., my_weapons_mod",
          value: ""
        },
        quality: {
          label: "Quality (Items only)",
          type: "select",
          options: {
            Common: "Common",
            Uncommon: "Uncommon",
            Rare: "Rare",
            Epic: "Epic",
            Legendary: "Legendary"
          },
          value: "Common"
        },
        category: {
          label: "Category (Items only)",
          type: "select",
          options: {
            Sword: "Sword",
            Axe: "Axe",
            Pickaxe: "Pickaxe",
            Bow: "Bow",
            Shield: "Shield",
            Tool: "Tool",
            Misc: "Misc"
          },
          value: "Sword"
        }
      },
      onConfirm: (formResult) => {
        if (!formResult.assetId || formResult.assetId.trim() === "") {
          Blockbench.showQuickMessage("Asset ID is required.", 2e3);
          return;
        }
        if (!formResult.displayName || formResult.displayName.trim() === "") {
          Blockbench.showQuickMessage("Display Name is required.", 2e3);
          return;
        }
        if (!formResult.modName || formResult.modName.trim() === "") {
          Blockbench.showQuickMessage("Mod Name is required.", 2e3);
          return;
        }
        const sanitizedId = formResult.assetId.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
        const configForm = {
          assetType: formResult.assetType,
          assetId: sanitizedId,
          displayName: formResult.displayName.trim(),
          modName: formResult.modName.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_"),
          quality: formResult.quality,
          category: formResult.category
        };
        generateModPackage(configForm).then(() => {
          Blockbench.showQuickMessage(
            `Mod package "${configForm.modName}.zip" exported successfully!`,
            3e3
          );
        }).catch((err) => {
          console.error("[Myrlin's Tools] Config generator error:", err);
          Blockbench.showMessageBox({
            title: "Export Error",
            message: `Failed to generate mod package: ${err.message}`,
            icon: "error"
          });
        });
      }
    }).show();
  }
  function setupConfigGenerator() {
    const configGeneratorAction = new Action("myrlin_config_generator", {
      name: "Export Hytale Mod Package",
      description: "Export model with JSON configs as a Hytale mod package (.zip) (Myrlin's Tools)",
      icon: "inventory_2",
      category: "file",
      condition: () => {
        return Cube.all.length > 0;
      },
      click: () => {
        showConfigDialog();
      }
    });
    track(configGeneratorAction);
    MenuBar.addAction(configGeneratorAction, "file");
  }

  // src/api-client.ts
  var MYRLIN_API2 = "https://api.myrlin.io";
  var API_TIMEOUT = 1e4;
  var HEALTH_TIMEOUT = 3e3;
  function localValidation(modelData) {
    const issues = [];
    const nodes = modelData.nodes;
    if (!nodes || !Array.isArray(nodes)) {
      issues.push({
        severity: "error",
        code: "NO_NODES",
        message: "Model has no nodes array",
        auto_fixable: false
      });
      return {
        valid: false,
        issues,
        summary: { error: 1, warning: 0, info: 0 }
      };
    }
    if (nodes.length > 255) {
      issues.push({
        severity: "error",
        code: "NODE_LIMIT",
        message: `Node count ${nodes.length} exceeds Hytale limit of 255`,
        auto_fixable: false
      });
    }
    let zeroSizeCount = 0;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!node)
        continue;
      const from = node.from;
      const to = node.to;
      if (from && to && Array.isArray(from) && Array.isArray(to) && from.length >= 3 && to.length >= 3) {
        const dx = Math.abs(to[0] - from[0]);
        const dy = Math.abs(to[1] - from[1]);
        const dz = Math.abs(to[2] - from[2]);
        if (dx === 0 || dy === 0 || dz === 0) {
          zeroSizeCount++;
          issues.push({
            severity: "warning",
            code: "ZERO_SIZE",
            message: `Node at index ${i} has zero size on one or more axes`,
            location: `nodes[${i}]`,
            auto_fixable: true
          });
        }
      }
    }
    const errorCount = issues.filter((i) => i.severity === "error").length;
    const warningCount = issues.filter((i) => i.severity === "warning").length;
    const infoCount = issues.filter((i) => i.severity === "info").length;
    return {
      valid: errorCount === 0,
      issues,
      summary: { error: errorCount, warning: warningCount, info: infoCount }
    };
  }
  var MyrlinApiClient = class {
    constructor(baseUrl = MYRLIN_API2) {
      this.baseUrl = baseUrl;
      this.online = true;
    }
    /**
     * Check if the API is reachable.
     * Pings the /health endpoint with a short timeout.
     *
     * @returns true if the API responded successfully
     */
    async checkConnection() {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), HEALTH_TIMEOUT);
        const resp = await fetch(`${this.baseUrl}/health`, {
          method: "GET",
          signal: controller.signal
        });
        clearTimeout(timer);
        this.online = resp.ok;
      } catch {
        this.online = false;
      }
      return this.online;
    }
    /**
     * Validate a model against engine-specific rules.
     * Falls back to local validation when the API is unreachable.
     *
     * @param modelData - The model data object to validate
     * @param engine - Target engine for validation rules (default: 'hytale')
     * @returns Validation report with issues and summary
     */
    async validate(modelData, engine = "hytale") {
      if (!this.online) {
        return localValidation(modelData);
      }
      const result = await this._post("/api/tools/validate", {
        model: modelData,
        engine
      });
      if (!result) {
        return localValidation(modelData);
      }
      return result;
    }
    /**
     * Request repairs on a model (Phase 28 endpoint).
     * Returns a not-available message when offline.
     *
     * @param modelData - The model data object to repair
     * @param repairs - List of repair operation identifiers to apply
     * @returns Repair result with applied changes
     */
    async repair(modelData, repairs) {
      if (!this.online) {
        return {
          success: false,
          model_data: null,
          repairs_applied: [],
          message: "Repair requires an API connection. Check your network and try again."
        };
      }
      const result = await this._post("/api/tools/repair", {
        model: modelData,
        repairs
      });
      if (!result) {
        return {
          success: false,
          model_data: null,
          repairs_applied: [],
          message: "Repair request failed. The API may be temporarily unavailable."
        };
      }
      return result;
    }
    /**
     * Export model to a different format (Phase 29 endpoint).
     * Returns a not-available message when offline.
     *
     * @param modelData - The model data object to export
     * @param targetFormat - Target format identifier (e.g. 'blockymodel', 'gltf')
     * @returns Export result with encoded data
     */
    async export(modelData, targetFormat) {
      if (!this.online) {
        return {
          success: false,
          data: null,
          format: targetFormat,
          message: "Export requires an API connection. Check your network and try again."
        };
      }
      const result = await this._post("/api/tools/export", {
        model: modelData,
        format: targetFormat
      });
      if (!result) {
        return {
          success: false,
          data: null,
          format: targetFormat,
          message: "Export request failed. The API may be temporarily unavailable."
        };
      }
      return result;
    }
    /**
     * Internal fetch wrapper with timeout and error handling.
     * Sets Content-Type to JSON and uses AbortController for timeout.
     *
     * @param path - API path to POST to (e.g. '/api/tools/validate')
     * @param body - Request body to send as JSON
     * @returns Parsed response or null on failure
     */
    async _post(path, body) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), API_TIMEOUT);
        const resp = await fetch(`${this.baseUrl}${path}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal
        });
        clearTimeout(timer);
        if (!resp.ok) {
          console.warn(`[Myrlin API] ${path} returned ${resp.status}`);
          return null;
        }
        const data = await resp.json();
        return data;
      } catch (e) {
        console.warn(`[Myrlin API] Request to ${path} failed:`, e);
        return null;
      }
    }
  };
  var _client = null;
  function getApiClient() {
    if (!_client) {
      _client = new MyrlinApiClient();
    }
    return _client;
  }

  // src/features/repair_panel.ts
  var DIALOG_WIDTH = 640;
  var MAX_DISPLAY_ISSUES = 50;
  function severityIconHtml(severity) {
    switch (severity) {
      case "error":
        return '<span style="color:#e74c3c;font-weight:bold;" title="Error">&#x2716;</span>';
      case "warning":
        return '<span style="color:#f39c12;font-weight:bold;" title="Warning">&#x26A0;</span>';
      case "info":
        return '<span style="color:#3498db;font-weight:bold;" title="Info">&#x2139;</span>';
      default:
        return "<span>&#x2022;</span>";
    }
  }
  function severityPriority(severity) {
    switch (severity) {
      case "error":
        return 0;
      case "warning":
        return 1;
      case "info":
        return 2;
      default:
        return 3;
    }
  }
  function fixableBadge(fixable) {
    if (fixable) {
      return '<span style="background:#27ae60;color:#fff;padding:1px 6px;border-radius:3px;font-size:11px;">auto-fix</span>';
    }
    return '<span style="background:#7f8c8d;color:#fff;padding:1px 6px;border-radius:3px;font-size:11px;">manual</span>';
  }
  function extractModelData() {
    try {
      if (typeof Codecs !== "undefined" && Codecs.project && typeof Codecs.project.compile === "function") {
        return Codecs.project.compile();
      }
      if (typeof Project === "undefined" || !Project) {
        return null;
      }
      const cubes = typeof Cube !== "undefined" ? Cube.all : [];
      const groups = typeof Group !== "undefined" ? Group.all : [];
      if (cubes.length === 0 && groups.length === 0) {
        return null;
      }
      const nodes = [];
      for (const cube of cubes) {
        nodes.push({
          name: cube.name || "cube",
          from: cube.from ? [...cube.from] : [0, 0, 0],
          to: cube.to ? [...cube.to] : [1, 1, 1],
          type: "cube"
        });
      }
      return {
        // @ts-ignore
        name: Project.name || "untitled",
        nodes,
        meta: {
          group_count: groups.length,
          cube_count: cubes.length
        }
      };
    } catch (e) {
      console.warn("[Myrlin Repair] Failed to extract model data:", e);
      return null;
    }
  }
  function buildIssueListHtml(issues) {
    if (issues.length === 0) {
      return `
            <div style="padding:20px;text-align:center;color:#27ae60;">
                <p style="font-size:16px;font-weight:bold;">No issues found</p>
                <p style="color:#888;">Your model passes all validation checks.</p>
            </div>
        `;
    }
    const sorted = [...issues].sort((a, b) => severityPriority(a.severity) - severityPriority(b.severity));
    const displayed = sorted.slice(0, MAX_DISPLAY_ISSUES);
    const truncated = sorted.length - displayed.length;
    let html = '<div id="myrlin-repair-list" style="max-height:360px;overflow-y:auto;border:1px solid #444;border-radius:4px;">';
    html += '<table style="width:100%;border-collapse:collapse;font-size:13px;">';
    html += '<thead><tr style="background:#2a2a2a;position:sticky;top:0;">';
    html += '<th style="padding:6px 8px;text-align:left;width:28px;"></th>';
    html += '<th style="padding:6px 8px;text-align:left;width:100px;">Code</th>';
    html += '<th style="padding:6px 8px;text-align:left;">Message</th>';
    html += '<th style="padding:6px 8px;text-align:center;width:60px;">Type</th>';
    html += '<th style="padding:6px 8px;text-align:center;width:40px;">Fix</th>';
    html += "</tr></thead><tbody>";
    for (let i = 0; i < displayed.length; i++) {
      const issue = displayed[i];
      const isChecked = issue.severity !== "info";
      const rowBg = i % 2 === 0 ? "#1e1e1e" : "#252525";
      const disabledAttr = issue.auto_fixable ? "" : "disabled";
      const checkedAttr = isChecked && issue.auto_fixable ? "checked" : "";
      html += `<tr style="background:${rowBg};border-bottom:1px solid #333;">`;
      html += `<td style="padding:6px 8px;text-align:center;">${severityIconHtml(issue.severity)}</td>`;
      html += `<td style="padding:6px 8px;font-family:monospace;font-size:11px;">${escapeHtml(issue.code)}</td>`;
      html += `<td style="padding:6px 8px;">${escapeHtml(issue.message)}`;
      if (issue.location) {
        html += ` <span style="color:#888;font-size:11px;">(${escapeHtml(issue.location)})</span>`;
      }
      html += "</td>";
      html += `<td style="padding:6px 8px;text-align:center;">${fixableBadge(issue.auto_fixable)}</td>`;
      html += `<td style="padding:6px 8px;text-align:center;">`;
      html += `<input type="checkbox" class="myrlin-repair-check" data-index="${i}" ${checkedAttr} ${disabledAttr} />`;
      html += "</td>";
      html += "</tr>";
    }
    html += "</tbody></table></div>";
    if (truncated > 0) {
      html += `<p style="color:#888;font-size:12px;margin-top:4px;">...and ${truncated} more issue(s) not shown.</p>`;
    }
    const errorCount = issues.filter((i) => i.severity === "error").length;
    const warnCount = issues.filter((i) => i.severity === "warning").length;
    const infoCount = issues.filter((i) => i.severity === "info").length;
    const fixableCount = issues.filter((i) => i.auto_fixable).length;
    html += '<div style="margin-top:8px;padding:8px 0;border-top:1px solid #444;font-size:12px;color:#aaa;">';
    html += `Found: <span style="color:#e74c3c;">${errorCount} error(s)</span>, `;
    html += `<span style="color:#f39c12;">${warnCount} warning(s)</span>, `;
    html += `<span style="color:#3498db;">${infoCount} info</span>`;
    html += ` | <span style="color:#27ae60;">${fixableCount} auto-fixable</span>`;
    html += "</div>";
    return html;
  }
  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function getSelectedRepairCodes(issues) {
    const sorted = [...issues].sort((a, b) => severityPriority(a.severity) - severityPriority(b.severity));
    const displayed = sorted.slice(0, MAX_DISPLAY_ISSUES);
    const codes = [];
    const checkboxes = document.querySelectorAll(".myrlin-repair-check");
    checkboxes.forEach((cb) => {
      const input = cb;
      if (input.checked && !input.disabled) {
        const idx = parseInt(input.getAttribute("data-index") || "-1", 10);
        if (idx >= 0 && idx < displayed.length) {
          codes.push(displayed[idx].code);
        }
      }
    });
    return codes;
  }
  function applyRepairedModel(modelData, repairsApplied) {
    try {
      if (typeof Undo !== "undefined" && Undo.initEdit) {
        Undo.initEdit({ elements: Cube.all, outliner: true });
      }
      if (typeof Codecs !== "undefined" && Codecs.project && typeof Codecs.project.parse === "function") {
        Codecs.project.parse(modelData);
      }
      if (typeof Undo !== "undefined" && Undo.finishEdit) {
        Undo.finishEdit(`Myrlin Auto-Repair (${repairsApplied.length} fix${repairsApplied.length !== 1 ? "es" : ""})`);
      }
      if (typeof Canvas !== "undefined" && Canvas.updateAll) {
        Canvas.updateAll();
      }
    } catch (e) {
      console.error("[Myrlin Repair] Failed to apply repaired model:", e);
      Blockbench.showMessageBox({
        title: "Repair Apply Failed",
        message: `Could not apply the repaired model. Error: ${e}`,
        icon: "error"
      });
    }
  }
  function showRepairConfirmation(modelData, repairsApplied, message) {
    let listHtml = '<ul style="margin:8px 0;padding-left:20px;font-size:13px;">';
    for (const code of repairsApplied) {
      listHtml += `<li style="margin:2px 0;font-family:monospace;">${escapeHtml(code)}</li>`;
    }
    listHtml += "</ul>";
    const bodyHtml = `
        <div style="padding:8px 0;">
            <p style="font-size:14px;color:#27ae60;font-weight:bold;">
                Repair completed successfully
            </p>
            <p style="font-size:13px;color:#ccc;">${escapeHtml(message)}</p>
            <p style="font-size:13px;margin-top:8px;">
                <strong>${repairsApplied.length}</strong> repair(s) applied:
            </p>
            ${listHtml}
            <p style="font-size:12px;color:#888;margin-top:8px;">
                An undo snapshot will be created so you can revert these changes.
            </p>
        </div>
    `;
    new Dialog({
      id: "myrlin_repair_confirm",
      title: "Apply Repairs?",
      lines: [bodyHtml],
      width: 460,
      buttons: ["Apply", "Cancel"],
      onConfirm: () => {
        applyRepairedModel(modelData, repairsApplied);
        Blockbench.showQuickMessage(
          `Applied ${repairsApplied.length} repair(s) successfully`,
          2e3
        );
      },
      onCancel: () => {
        Blockbench.showQuickMessage("Repair cancelled", 1500);
      }
    }).show();
  }
  async function showRepairDialog() {
    const modelData = extractModelData();
    if (!modelData) {
      Blockbench.showMessageBox({
        title: "No Model Open",
        message: "Please open a model before running auto-repair.",
        icon: "warning"
      });
      return;
    }
    Blockbench.showQuickMessage("Validating model...", 1500);
    const client = getApiClient();
    await client.checkConnection();
    const report = await client.validate(modelData);
    const issues = report.issues || [];
    const issueHtml = buildIssueListHtml(issues);
    const hasFixable = issues.some((i) => i.auto_fixable);
    const headerHtml = `
        <div style="margin-bottom:8px;">
            <p style="font-size:13px;color:#aaa;">
                Scanned your model for Hytale compatibility issues.
                Select which issues to auto-repair below.
            </p>
        </div>
    `;
    const dialog = new Dialog({
      id: "myrlin_repair_dialog",
      title: "Auto-Repair Model",
      width: DIALOG_WIDTH,
      lines: [headerHtml + issueHtml],
      buttons: hasFixable ? ["Apply Selected", "Cancel"] : ["Close"],
      onConfirm: async () => {
        if (!hasFixable)
          return;
        const selectedCodes = getSelectedRepairCodes(issues);
        if (selectedCodes.length === 0) {
          Blockbench.showQuickMessage("No issues selected for repair", 1500);
          return;
        }
        Blockbench.showQuickMessage(`Repairing ${selectedCodes.length} issue(s)...`, 2e3);
        const currentModel = extractModelData();
        if (!currentModel) {
          Blockbench.showQuickMessage("Model no longer available", 1500);
          return;
        }
        const repairResult = await client.repair(currentModel, selectedCodes);
        if (repairResult.success && repairResult.model_data) {
          showRepairConfirmation(
            repairResult.model_data,
            repairResult.repairs_applied,
            repairResult.message
          );
        } else {
          Blockbench.showMessageBox({
            title: "Repair Failed",
            message: repairResult.message || "The repair request could not be completed.",
            icon: "error"
          });
        }
      },
      onCancel: () => {
      }
    });
    dialog.show();
  }
  var REPAIR_STYLES = `
    #myrlin-repair-list table tr:hover {
        background: #333 !important;
    }
    #myrlin-repair-list input[type="checkbox"] {
        cursor: pointer;
        width: 16px;
        height: 16px;
    }
    #myrlin-repair-list input[type="checkbox"]:disabled {
        cursor: not-allowed;
        opacity: 0.4;
    }
`;
  function setupRepairPanel() {
    trackStyle(REPAIR_STYLES);
    const repairAction = new Action("myrlin_auto_repair", {
      name: "Auto-Repair Model",
      description: "Validate and auto-repair model issues for Hytale compatibility (Myrlin's Tools)",
      icon: "build",
      category: "tools",
      click: () => {
        showRepairDialog();
      }
    });
    track(repairAction);
    MenuBar.addAction(repairAction, "tools");
  }

  // src/features/export_dialog.ts
  var DIALOG_WIDTH2 = 560;
  var FORMAT_OPTIONS = [
    {
      id: "bbmodel",
      label: "Blockbench (.bbmodel)",
      extension: ".bbmodel",
      engine: "Minecraft / Blockbench",
      description: "Standard Blockbench project format. Compatible with Minecraft Java and Bedrock resource packs.",
      constraints: "Max 256 elements per model. Textures must be 16x16 or multiples thereof."
    },
    {
      id: "blockymodel",
      label: "Hytale (.blockymodel)",
      extension: ".blockymodel",
      engine: "Hytale",
      description: "Native Hytale model format with node hierarchy, axis-aligned boxes, and per-face UVs.",
      constraints: "Max 255 nodes (cubes + groups). First cube per group is free. Power-of-2 textures required."
    },
    {
      id: "modelengine",
      label: "ModelEngine (YAML)",
      extension: ".yml",
      engine: "ModelEngine (Minecraft plugin)",
      description: "ModelEngine blueprint format for custom entity models in Minecraft servers.",
      constraints: "Bones must follow ModelEngine naming conventions. Hitbox and mount points defined separately."
    }
  ];
  var DEFAULT_FORMAT = "blockymodel";
  function escapeHtml2(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function getFormatInfo(formatId) {
    return FORMAT_OPTIONS.find((f) => f.id === formatId) || FORMAT_OPTIONS[0];
  }
  function extractModelData2() {
    try {
      if (typeof Codecs !== "undefined" && Codecs.project && typeof Codecs.project.compile === "function") {
        return Codecs.project.compile();
      }
      if (typeof Project === "undefined" || !Project) {
        return null;
      }
      const cubes = typeof Cube !== "undefined" ? Cube.all : [];
      const groups = typeof Group !== "undefined" ? Group.all : [];
      if (cubes.length === 0 && groups.length === 0) {
        return null;
      }
      const nodes = [];
      for (const cube of cubes) {
        nodes.push({
          name: cube.name || "cube",
          from: cube.from ? [...cube.from] : [0, 0, 0],
          to: cube.to ? [...cube.to] : [1, 1, 1],
          type: "cube"
        });
      }
      return {
        // @ts-ignore
        name: Project.name || "untitled",
        nodes,
        meta: {
          group_count: groups.length,
          cube_count: cubes.length
        }
      };
    } catch (e) {
      console.warn("[Myrlin Export] Failed to extract model data:", e);
      return null;
    }
  }
  function runInlineValidation() {
    const report = validateModel();
    const passCount = report.results.filter((r) => r.severity === "pass").length;
    const warnCount = report.results.filter((r) => r.severity === "warn").length;
    const failCount = report.results.filter((r) => r.severity === "fail").length;
    let statusColor = "#27ae60";
    let statusText = "All checks passed";
    if (report.overallSeverity === "fail") {
      statusColor = "#e74c3c";
      statusText = `${failCount} check(s) failed`;
    } else if (report.overallSeverity === "warn") {
      statusColor = "#f39c12";
      statusText = `${warnCount} warning(s)`;
    }
    let html = `<div id="myrlin-export-validation" style="margin-top:12px;padding:10px;border:1px solid #444;border-radius:4px;background:#1e1e1e;">`;
    html += `<div style="font-size:13px;font-weight:bold;color:${statusColor};margin-bottom:8px;">`;
    html += `Validation: ${statusText}`;
    html += `</div>`;
    html += `<div style="font-size:12px;color:#aaa;margin-bottom:6px;">`;
    html += `${passCount} passed, ${warnCount} warning(s), ${failCount} failed`;
    html += `</div>`;
    html += `<table style="width:100%;border-collapse:collapse;font-size:12px;">`;
    for (const result of report.results) {
      let icon = '<span style="color:#27ae60;">&#x2705;</span>';
      if (result.severity === "fail") {
        icon = '<span style="color:#e74c3c;">&#x274C;</span>';
      } else if (result.severity === "warn") {
        icon = '<span style="color:#f39c12;">&#x26A0;</span>';
      }
      html += `<tr style="border-bottom:1px solid #333;">`;
      html += `<td style="padding:3px 6px;width:24px;">${icon}</td>`;
      html += `<td style="padding:3px 6px;font-weight:bold;">${escapeHtml2(result.name)}</td>`;
      html += `<td style="padding:3px 6px;color:#ccc;">${escapeHtml2(result.message)}</td>`;
      html += `</tr>`;
    }
    html += `</table>`;
    html += `</div>`;
    return { html, severity: report.overallSeverity };
  }
  function buildFormatPreviewHtml(format) {
    return `
        <div id="myrlin-format-preview" style="margin-top:12px;padding:10px;border:1px solid #444;border-radius:4px;background:#1e1e1e;">
            <div style="font-size:14px;font-weight:bold;color:#ccc;margin-bottom:6px;">
                ${escapeHtml2(format.label)}
            </div>
            <table style="font-size:12px;color:#aaa;border-collapse:collapse;width:100%;">
                <tr>
                    <td style="padding:2px 8px 2px 0;font-weight:bold;color:#888;width:100px;">Extension:</td>
                    <td style="padding:2px 0;font-family:monospace;">${escapeHtml2(format.extension)}</td>
                </tr>
                <tr>
                    <td style="padding:2px 8px 2px 0;font-weight:bold;color:#888;">Engine:</td>
                    <td style="padding:2px 0;">${escapeHtml2(format.engine)}</td>
                </tr>
                <tr>
                    <td style="padding:2px 8px 2px 0;font-weight:bold;color:#888;">Description:</td>
                    <td style="padding:2px 0;">${escapeHtml2(format.description)}</td>
                </tr>
                <tr>
                    <td style="padding:2px 8px 2px 0;font-weight:bold;color:#888;">Constraints:</td>
                    <td style="padding:2px 0;color:#f39c12;">${escapeHtml2(format.constraints)}</td>
                </tr>
            </table>
        </div>
    `;
  }
  function buildDialogHtml() {
    let html = "";
    html += `<div style="margin-bottom:12px;">`;
    html += `<p style="font-size:13px;color:#aaa;">`;
    html += `Export your model to a specific game engine format. `;
    html += `The Myrlin API handles server-side format conversion.`;
    html += `</p>`;
    html += `</div>`;
    html += `<div style="margin-bottom:4px;font-size:13px;font-weight:bold;color:#ccc;">Select Format:</div>`;
    html += `<div id="myrlin-format-selector" style="padding:8px;border:1px solid #444;border-radius:4px;background:#1a1a1a;">`;
    for (const fmt of FORMAT_OPTIONS) {
      const checked = fmt.id === DEFAULT_FORMAT ? "checked" : "";
      html += `<label style="display:flex;align-items:center;padding:6px 4px;cursor:pointer;border-radius:3px;" class="myrlin-format-radio-label">`;
      html += `<input type="radio" name="myrlin_export_format" value="${fmt.id}" ${checked} `;
      html += `class="myrlin-format-radio" style="margin-right:10px;cursor:pointer;" />`;
      html += `<div>`;
      html += `<span style="font-size:13px;font-weight:bold;color:#ccc;">${escapeHtml2(fmt.label)}</span>`;
      html += `<br/><span style="font-size:11px;color:#888;">${escapeHtml2(fmt.engine)}</span>`;
      html += `</div>`;
      html += `</label>`;
    }
    html += `</div>`;
    const defaultInfo = getFormatInfo(DEFAULT_FORMAT);
    html += buildFormatPreviewHtml(defaultInfo);
    html += `<div style="margin-top:12px;padding:8px;border:1px solid #444;border-radius:4px;background:#1a1a1a;">`;
    html += `<label style="display:flex;align-items:center;cursor:pointer;">`;
    html += `<input type="checkbox" id="myrlin-validate-first" checked style="margin-right:10px;cursor:pointer;" />`;
    html += `<div>`;
    html += `<span style="font-size:13px;color:#ccc;">Validate before export</span>`;
    html += `<br/><span style="font-size:11px;color:#888;">Run validation checks to catch issues before exporting</span>`;
    html += `</div>`;
    html += `</label>`;
    html += `</div>`;
    html += `<div style="margin-top:8px;text-align:right;">`;
    html += `<button id="myrlin-run-validation-btn" style="`;
    html += `padding:5px 14px;border:1px solid #555;border-radius:3px;`;
    html += `background:#2a2a2a;color:#ccc;cursor:pointer;font-size:12px;">`;
    html += `Run Validation</button>`;
    html += `</div>`;
    html += `<div id="myrlin-validation-results"></div>`;
    return html;
  }
  function getExtensions(formatId) {
    switch (formatId) {
      case "bbmodel":
        return ["bbmodel"];
      case "blockymodel":
        return ["blockymodel"];
      case "modelengine":
        return ["yml"];
      default:
        return ["bbmodel"];
    }
  }
  function getSelectedFormat() {
    const selected = document.querySelector('input[name="myrlin_export_format"]:checked');
    if (selected) {
      return selected.value;
    }
    return DEFAULT_FORMAT;
  }
  function isValidateFirstChecked() {
    const cb = document.getElementById("myrlin-validate-first");
    return cb ? cb.checked : true;
  }
  async function performExport() {
    const modelData = extractModelData2();
    if (!modelData) {
      Blockbench.showMessageBox({
        title: "No Model Open",
        message: "Please open a model before exporting.",
        icon: "warning"
      });
      return;
    }
    const formatId = getSelectedFormat();
    const formatInfo = getFormatInfo(formatId);
    if (isValidateFirstChecked()) {
      const report = validateModel();
      if (report.overallSeverity === "fail") {
        Blockbench.showMessageBox({
          title: "Validation Failed",
          message: 'Your model has validation errors that should be fixed before exporting. Run the validator for details, or uncheck "Validate before export" to skip.',
          icon: "error"
        });
        return;
      }
    }
    Blockbench.showQuickMessage(`Exporting as ${formatInfo.label}...`, 2e3);
    if (formatId === "bbmodel") {
      const content = JSON.stringify(modelData, null, 2);
      Blockbench.export({
        type: "Export Model",
        extensions: getExtensions(formatId),
        // @ts-ignore - Project is a global from Blockbench
        name: typeof Project !== "undefined" && Project.name ? Project.name : "model",
        content
      });
      Blockbench.showQuickMessage("Exported as .bbmodel successfully", 2e3);
      return;
    }
    const client = getApiClient();
    await client.checkConnection();
    const result = await client.export(modelData, formatId);
    if (result.success && result.data) {
      Blockbench.export({
        type: "Export Model",
        extensions: getExtensions(formatId),
        // @ts-ignore - Project is a global from Blockbench
        name: typeof Project !== "undefined" && Project.name ? Project.name : "model",
        content: result.data
      });
      Blockbench.showQuickMessage(`Exported as ${formatInfo.extension} successfully`, 2e3);
    } else {
      Blockbench.showMessageBox({
        title: "Export Failed",
        message: result.message || "The export could not be completed.",
        icon: "error"
      });
    }
  }
  function attachDialogEvents() {
    const radios = document.querySelectorAll(".myrlin-format-radio");
    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        const formatId = radio.value;
        const info = getFormatInfo(formatId);
        const previewEl = document.getElementById("myrlin-format-preview");
        if (previewEl) {
          previewEl.outerHTML = buildFormatPreviewHtml(info);
        }
      });
    });
    const validateBtn = document.getElementById("myrlin-run-validation-btn");
    if (validateBtn) {
      validateBtn.addEventListener("click", () => {
        const resultsEl = document.getElementById("myrlin-validation-results");
        if (resultsEl) {
          const validation = runInlineValidation();
          resultsEl.innerHTML = validation.html;
        }
      });
    }
  }
  var EXPORT_STYLES = `
    .myrlin-format-radio-label:hover {
        background: #2a2a2a !important;
    }
    #myrlin-format-selector input[type="radio"] {
        accent-color: #3498db;
    }
    #myrlin-run-validation-btn:hover {
        background: #333 !important;
        border-color: #666 !important;
    }
`;
  function setupExportDialog() {
    trackStyle(EXPORT_STYLES);
    const exportAction = new Action("myrlin_export_dialog", {
      name: "Export for Engine",
      description: "Export model to Hytale, ModelEngine, or Blockbench format (Myrlin's Tools)",
      icon: "file_download",
      category: "tools",
      click: () => {
        const dialogHtml = buildDialogHtml();
        const dialog = new Dialog({
          id: "myrlin_export_dialog_ui",
          title: "Export for Engine",
          width: DIALOG_WIDTH2,
          lines: [dialogHtml],
          buttons: ["Export", "Cancel"],
          onConfirm: () => {
            performExport();
          },
          onCancel: () => {
          },
          onOpen: () => {
            setTimeout(() => attachDialogEvents(), 50);
          }
        });
        dialog.show();
      }
    });
    track(exportAction);
    MenuBar.addAction(exportAction, "tools");
  }

  // src/features/validation_panel.ts
  var DIALOG_WIDTH3 = 640;
  var MAX_DISPLAY_ISSUES2 = 50;
  var ENGINE_PROFILES = [
    {
      id: "hytale",
      label: "Hytale",
      description: "Validate against Hytale modding requirements (255 node limit, naming conventions, texture rules)"
    },
    {
      id: "modelengine",
      label: "ModelEngine",
      description: "Validate against ModelEngine blueprint rules (bone naming, hitbox, mount points)"
    },
    {
      id: "freemc",
      label: "FreeMinecraftModels",
      description: "Validate against FreeMinecraftModels constraints (element limits, rotation rules)"
    }
  ];
  var DEFAULT_ENGINE = "hytale";
  function severityIconHtml2(severity) {
    switch (severity) {
      case "error":
        return '<span style="color:#e74c3c;font-weight:bold;" title="Error">&#x2716;</span>';
      case "warning":
        return '<span style="color:#f39c12;font-weight:bold;" title="Warning">&#x26A0;</span>';
      case "info":
        return '<span style="color:#3498db;font-weight:bold;" title="Info">&#x2139;</span>';
      default:
        return "<span>&#x2022;</span>";
    }
  }
  function severityColor(severity) {
    switch (severity) {
      case "error":
        return "#e74c3c";
      case "warning":
        return "#f39c12";
      case "info":
        return "#3498db";
      default:
        return "#888";
    }
  }
  function severityPriority2(severity) {
    switch (severity) {
      case "error":
        return 0;
      case "warning":
        return 1;
      case "info":
        return 2;
      default:
        return 3;
    }
  }
  function escapeHtml3(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function extractModelData3() {
    try {
      if (typeof Codecs !== "undefined" && Codecs.project && typeof Codecs.project.compile === "function") {
        return Codecs.project.compile();
      }
      if (typeof Project === "undefined" || !Project) {
        return null;
      }
      const cubes = typeof Cube !== "undefined" ? Cube.all : [];
      const groups = typeof Group !== "undefined" ? Group.all : [];
      if (cubes.length === 0 && groups.length === 0) {
        return null;
      }
      const nodes = [];
      for (const cube of cubes) {
        nodes.push({
          name: cube.name || "cube",
          from: cube.from ? [...cube.from] : [0, 0, 0],
          to: cube.to ? [...cube.to] : [1, 1, 1],
          type: "cube"
        });
      }
      return {
        // @ts-ignore
        name: Project.name || "untitled",
        nodes,
        meta: {
          group_count: groups.length,
          cube_count: cubes.length
        }
      };
    } catch (e) {
      console.warn("[Myrlin Validation Panel] Failed to extract model data:", e);
      return null;
    }
  }
  function buildSummaryHtml(issues) {
    const errorCount = issues.filter((i) => i.severity === "error").length;
    const warnCount = issues.filter((i) => i.severity === "warning").length;
    const infoCount = issues.filter((i) => i.severity === "info").length;
    const fixableCount = issues.filter((i) => i.auto_fixable).length;
    let html = `<div style="padding:8px 0;margin-bottom:8px;border-bottom:1px solid #444;font-size:13px;">`;
    html += `<span style="color:${severityColor("error")};font-weight:bold;margin-right:12px;">`;
    html += `${errorCount} error(s)</span>`;
    html += `<span style="color:${severityColor("warning")};font-weight:bold;margin-right:12px;">`;
    html += `${warnCount} warning(s)</span>`;
    html += `<span style="color:${severityColor("info")};font-weight:bold;margin-right:12px;">`;
    html += `${infoCount} info</span>`;
    if (fixableCount > 0) {
      html += `<span style="color:#27ae60;margin-left:8px;">`;
      html += `| ${fixableCount} auto-fixable</span>`;
    }
    html += `</div>`;
    return html;
  }
  function buildResultsTableHtml(issues) {
    if (issues.length === 0) {
      return `
            <div style="padding:20px;text-align:center;color:#27ae60;">
                <p style="font-size:16px;font-weight:bold;">No issues found</p>
                <p style="color:#888;">Your model passes all validation checks for this engine profile.</p>
            </div>
        `;
    }
    const sorted = [...issues].sort((a, b) => severityPriority2(a.severity) - severityPriority2(b.severity));
    const displayed = sorted.slice(0, MAX_DISPLAY_ISSUES2);
    const truncated = sorted.length - displayed.length;
    const hasFixable = issues.some((i) => i.auto_fixable);
    let html = "";
    html += buildSummaryHtml(issues);
    if (hasFixable) {
      html += `<div style="margin-bottom:8px;text-align:right;">`;
      html += `<button id="myrlin-vp-fix-all" style="`;
      html += `padding:5px 14px;border:1px solid #27ae60;border-radius:3px;`;
      html += `background:#1a3a1a;color:#27ae60;cursor:pointer;font-size:12px;font-weight:bold;">`;
      html += `Fix All Auto-Fixable</button>`;
      html += `</div>`;
    }
    html += `<div id="myrlin-vp-issues" style="max-height:340px;overflow-y:auto;border:1px solid #444;border-radius:4px;">`;
    html += `<table style="width:100%;border-collapse:collapse;font-size:13px;">`;
    html += `<thead><tr style="background:#2a2a2a;position:sticky;top:0;">`;
    html += `<th style="padding:6px 8px;text-align:left;width:28px;"></th>`;
    html += `<th style="padding:6px 8px;text-align:left;width:100px;">Code</th>`;
    html += `<th style="padding:6px 8px;text-align:left;">Message</th>`;
    html += `<th style="padding:6px 8px;text-align:left;width:100px;">Location</th>`;
    html += `<th style="padding:6px 8px;text-align:center;width:60px;">Action</th>`;
    html += `</tr></thead><tbody>`;
    for (let i = 0; i < displayed.length; i++) {
      const issue = displayed[i];
      const rowBg = i % 2 === 0 ? "#1e1e1e" : "#252525";
      html += `<tr style="background:${rowBg};border-bottom:1px solid #333;">`;
      html += `<td style="padding:6px 8px;text-align:center;">${severityIconHtml2(issue.severity)}</td>`;
      html += `<td style="padding:6px 8px;font-family:monospace;font-size:11px;color:${severityColor(issue.severity)};">`;
      html += `${escapeHtml3(issue.code)}</td>`;
      html += `<td style="padding:6px 8px;color:#ccc;">${escapeHtml3(issue.message)}</td>`;
      html += `<td style="padding:6px 8px;font-size:11px;color:#888;">`;
      html += issue.location ? escapeHtml3(issue.location) : "-";
      html += `</td>`;
      html += `<td style="padding:6px 8px;text-align:center;">`;
      if (issue.auto_fixable) {
        html += `<button class="myrlin-vp-fix-btn" data-code="${escapeHtml3(issue.code)}" style="`;
        html += `padding:2px 8px;border:1px solid #27ae60;border-radius:3px;`;
        html += `background:#1a3a1a;color:#27ae60;cursor:pointer;font-size:11px;">`;
        html += `Fix</button>`;
      } else {
        html += `<span style="color:#555;font-size:11px;">manual</span>`;
      }
      html += `</td>`;
      html += `</tr>`;
    }
    html += `</tbody></table></div>`;
    if (truncated > 0) {
      html += `<p style="color:#888;font-size:12px;margin-top:4px;">`;
      html += `...and ${truncated} more issue(s) not shown.</p>`;
    }
    return html;
  }
  function buildDialogHtml2() {
    let html = "";
    html += `<div style="margin-bottom:12px;">`;
    html += `<p style="font-size:13px;color:#aaa;">`;
    html += `Validate your model against engine-specific rules. `;
    html += `Select a target engine and run validation to see issues.`;
    html += `</p>`;
    html += `</div>`;
    html += `<div style="margin-bottom:12px;">`;
    html += `<label style="font-size:13px;font-weight:bold;color:#ccc;display:block;margin-bottom:4px;">`;
    html += `Target Engine:</label>`;
    html += `<select id="myrlin-vp-engine" style="`;
    html += `width:100%;padding:6px 10px;border:1px solid #444;border-radius:4px;`;
    html += `background:#1a1a1a;color:#ccc;font-size:13px;cursor:pointer;">`;
    for (const profile of ENGINE_PROFILES) {
      const selected = profile.id === DEFAULT_ENGINE ? "selected" : "";
      html += `<option value="${profile.id}" ${selected}>${escapeHtml3(profile.label)}</option>`;
    }
    html += `</select>`;
    const defaultProfile = ENGINE_PROFILES.find((p) => p.id === DEFAULT_ENGINE) || ENGINE_PROFILES[0];
    html += `<div id="myrlin-vp-engine-desc" style="font-size:11px;color:#888;margin-top:4px;padding:0 2px;">`;
    html += escapeHtml3(defaultProfile.description);
    html += `</div>`;
    html += `</div>`;
    html += `<div style="margin-bottom:12px;text-align:center;">`;
    html += `<button id="myrlin-vp-validate-btn" style="`;
    html += `padding:8px 24px;border:1px solid #3498db;border-radius:4px;`;
    html += `background:#1a2a3a;color:#3498db;cursor:pointer;font-size:14px;font-weight:bold;">`;
    html += `Validate</button>`;
    html += `</div>`;
    html += `<div id="myrlin-vp-results"></div>`;
    return html;
  }
  async function runEngineValidation(engine) {
    const modelData = extractModelData3();
    if (!modelData) {
      Blockbench.showMessageBox({
        title: "No Model Open",
        message: "Please open a model before running validation.",
        icon: "warning"
      });
      return;
    }
    const resultsEl = document.getElementById("myrlin-vp-results");
    if (resultsEl) {
      resultsEl.innerHTML = `
            <div style="padding:16px;text-align:center;color:#888;">
                <p style="font-size:13px;">Validating model...</p>
            </div>
        `;
    }
    Blockbench.showQuickMessage(`Validating for ${engine}...`, 1500);
    const client = getApiClient();
    await client.checkConnection();
    const report = await client.validate(modelData, engine);
    const issues = (report.issues || []).map((i) => ({
      severity: i.severity,
      code: i.code,
      message: i.message,
      location: i.location,
      auto_fixable: i.auto_fixable
    }));
    if (resultsEl) {
      resultsEl.innerHTML = buildResultsTableHtml(issues);
      attachResultsEvents(issues);
    }
    const errorCount = issues.filter((i) => i.severity === "error").length;
    const warnCount = issues.filter((i) => i.severity === "warning").length;
    Blockbench.showQuickMessage(
      `Validation: ${errorCount} error(s), ${warnCount} warning(s), ${issues.length} total`,
      2e3
    );
  }
  async function triggerRepairForCode(code) {
    const modelData = extractModelData3();
    if (!modelData) {
      Blockbench.showQuickMessage("No model data available for repair", 1500);
      return;
    }
    Blockbench.showQuickMessage(`Attempting to fix: ${code}...`, 2e3);
    const client = getApiClient();
    await client.checkConnection();
    const result = await client.repair(modelData, [code]);
    if (result.success && result.model_data) {
      try {
        if (typeof Undo !== "undefined" && Undo.initEdit) {
          Undo.initEdit({ elements: Cube.all, outliner: true });
        }
        if (typeof Codecs !== "undefined" && Codecs.project && typeof Codecs.project.parse === "function") {
          Codecs.project.parse(result.model_data);
        }
        if (typeof Undo !== "undefined" && Undo.finishEdit) {
          Undo.finishEdit(`Myrlin Fix: ${code}`);
        }
        if (typeof Canvas !== "undefined" && Canvas.updateAll) {
          Canvas.updateAll();
        }
        Blockbench.showQuickMessage(`Fixed: ${code}`, 2e3);
      } catch (e) {
        console.error("[Myrlin Validation Panel] Failed to apply fix:", e);
        Blockbench.showQuickMessage(`Fix apply failed: ${e}`, 2e3);
      }
    } else {
      Blockbench.showQuickMessage(result.message || `Could not fix: ${code}`, 2e3);
    }
  }
  async function triggerFixAll(issues) {
    const fixableCodes = issues.filter((i) => i.auto_fixable).map((i) => i.code);
    if (fixableCodes.length === 0) {
      Blockbench.showQuickMessage("No auto-fixable issues found", 1500);
      return;
    }
    const modelData = extractModelData3();
    if (!modelData) {
      Blockbench.showQuickMessage("No model data available for repair", 1500);
      return;
    }
    Blockbench.showQuickMessage(`Fixing ${fixableCodes.length} issue(s)...`, 2e3);
    const client = getApiClient();
    await client.checkConnection();
    const result = await client.repair(modelData, fixableCodes);
    if (result.success && result.model_data) {
      try {
        if (typeof Undo !== "undefined" && Undo.initEdit) {
          Undo.initEdit({ elements: Cube.all, outliner: true });
        }
        if (typeof Codecs !== "undefined" && Codecs.project && typeof Codecs.project.parse === "function") {
          Codecs.project.parse(result.model_data);
        }
        if (typeof Undo !== "undefined" && Undo.finishEdit) {
          Undo.finishEdit(`Myrlin Fix All (${result.repairs_applied.length} fixes)`);
        }
        if (typeof Canvas !== "undefined" && Canvas.updateAll) {
          Canvas.updateAll();
        }
        Blockbench.showQuickMessage(
          `Applied ${result.repairs_applied.length} fix(es) successfully`,
          2e3
        );
      } catch (e) {
        console.error("[Myrlin Validation Panel] Failed to apply fixes:", e);
        Blockbench.showQuickMessage(`Fix apply failed: ${e}`, 2e3);
      }
    } else {
      Blockbench.showMessageBox({
        title: "Fix All Failed",
        message: result.message || "Could not apply fixes. The API may be temporarily unavailable.",
        icon: "error"
      });
    }
  }
  function attachResultsEvents(issues) {
    const fixBtns = document.querySelectorAll(".myrlin-vp-fix-btn");
    fixBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const code = btn.getAttribute("data-code");
        if (code) {
          triggerRepairForCode(code);
        }
      });
    });
    const fixAllBtn = document.getElementById("myrlin-vp-fix-all");
    if (fixAllBtn) {
      fixAllBtn.addEventListener("click", () => {
        triggerFixAll(issues);
      });
    }
  }
  function attachDialogEvents2() {
    const engineSelect = document.getElementById("myrlin-vp-engine");
    if (engineSelect) {
      engineSelect.addEventListener("change", () => {
        const selectedId = engineSelect.value;
        const profile = ENGINE_PROFILES.find((p) => p.id === selectedId);
        const descEl = document.getElementById("myrlin-vp-engine-desc");
        if (descEl && profile) {
          descEl.textContent = profile.description;
        }
      });
    }
    const validateBtn = document.getElementById("myrlin-vp-validate-btn");
    if (validateBtn) {
      validateBtn.addEventListener("click", () => {
        const engine = document.getElementById("myrlin-vp-engine")?.value || DEFAULT_ENGINE;
        runEngineValidation(engine);
      });
    }
  }
  var VALIDATION_PANEL_STYLES = `
    #myrlin-vp-issues table tr:hover {
        background: #333 !important;
    }
    .myrlin-vp-fix-btn:hover {
        background: #27ae60 !important;
        color: #fff !important;
    }
    #myrlin-vp-fix-all:hover {
        background: #27ae60 !important;
        color: #fff !important;
    }
    #myrlin-vp-engine:focus {
        border-color: #3498db !important;
        outline: none;
    }
    #myrlin-vp-validate-btn:hover {
        background: #3498db !important;
        color: #fff !important;
    }
`;
  function setupValidationPanel() {
    trackStyle(VALIDATION_PANEL_STYLES);
    const validationAction = new Action("myrlin_validation_panel", {
      name: "Validate for Engine",
      description: "Validate model against engine-specific rules with repair integration (Myrlin's Tools)",
      icon: "rule",
      category: "tools",
      click: () => {
        const dialogHtml = buildDialogHtml2();
        const dialog = new Dialog({
          id: "myrlin_validation_panel_ui",
          title: "Validate for Engine",
          width: DIALOG_WIDTH3,
          lines: [dialogHtml],
          buttons: ["Close"],
          onConfirm: () => {
          },
          onOpen: () => {
            setTimeout(() => attachDialogEvents2(), 50);
          }
        });
        dialog.show();
      }
    });
    track(validationAction);
    MenuBar.addAction(validationAction, "tools");
  }

  // src/plugin.ts
  var PLUGIN_ID = "myrlins_tools";
  var VERSION = "3.0.0";
  BBPlugin.register(PLUGIN_ID, {
    title: "Myrlin's Tools",
    author: "Myrlin (forge.myrlin.io)",
    icon: "auto_fix_high",
    version: VERSION,
    description: "Hytale modding toolkit - Box optimizer, art style validator, template wizard, config generator, and more.",
    tags: ["Hytale", "Optimization", "Validation"],
    variant: "both",
    min_version: "4.8.0",
    onload() {
      console.log(`[Myrlin's Tools] Loading v${VERSION}...`);
      setupPanel();
      setupActions();
      setupStatusBar();
      setupBrowser();
      setupTemplateWizard();
      setupValidator();
      setupConfigGenerator();
      setupRepairPanel();
      setupExportDialog();
      setupValidationPanel();
      console.log(`[Myrlin's Tools] Loaded successfully! (v${VERSION})`);
    },
    onunload() {
      console.log(`[Myrlin's Tools] Unloading...`);
      cleanup();
    }
  });
})();
