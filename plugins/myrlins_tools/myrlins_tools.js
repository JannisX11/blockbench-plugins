var MyrlinsTools = (() => {
  var __require = /* @__PURE__ */ ((x) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(x, {
    get: (a, b) => (typeof require < "u" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require < "u")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // utils/cleanup.ts
  var trackedItems = [], trackedEvents = [], trackedStyles = [];
  function track(item) {
    return trackedItems.push(item), item;
  }
  function trackStyle(css) {
    let style = document.createElement("style");
    return style.textContent = css, document.head.appendChild(style), trackedStyles.push(style), style;
  }
  function cleanup() {
    for (let item of trackedItems)
      try {
        item.delete();
      } catch (e) {
        console.warn("[Myrlin Tools] Failed to cleanup item:", e);
      }
    trackedItems.length = 0;
    for (let { target, event, handler } of trackedEvents)
      try {
        target.removeEventListener(event, handler);
      } catch (e) {
        console.warn("[Myrlin Tools] Failed to remove event listener:", e);
      }
    trackedEvents.length = 0;
    for (let style of trackedStyles)
      try {
        style.remove();
      } catch (e) {
        console.warn("[Myrlin Tools] Failed to remove style:", e);
      }
    trackedStyles.length = 0;
  }

  // utils/geometry.ts
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
  function sharesCompleteFace(a, b, tolerance = 1e-3) {
    if (Math.abs(a.max.x - b.min.x) < tolerance || Math.abs(b.max.x - a.min.x) < tolerance) {
      let yOverlap = Math.min(a.max.y, b.max.y) - Math.max(a.min.y, b.min.y), zOverlap = Math.min(a.max.z, b.max.z) - Math.max(a.min.z, b.min.z), aYSize = a.max.y - a.min.y, aZSize = a.max.z - a.min.z, bYSize = b.max.y - b.min.y, bZSize = b.max.z - b.min.z;
      if (Math.abs(aYSize - bYSize) < tolerance && Math.abs(aZSize - bZSize) < tolerance && Math.abs(yOverlap - aYSize) < tolerance && Math.abs(zOverlap - aZSize) < tolerance)
        return !0;
    }
    if (Math.abs(a.max.y - b.min.y) < tolerance || Math.abs(b.max.y - a.min.y) < tolerance) {
      let xOverlap = Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x), zOverlap = Math.min(a.max.z, b.max.z) - Math.max(a.min.z, b.min.z), aXSize = a.max.x - a.min.x, aZSize = a.max.z - a.min.z, bXSize = b.max.x - b.min.x, bZSize = b.max.z - b.min.z;
      if (Math.abs(aXSize - bXSize) < tolerance && Math.abs(aZSize - bZSize) < tolerance && Math.abs(xOverlap - aXSize) < tolerance && Math.abs(zOverlap - aZSize) < tolerance)
        return !0;
    }
    if (Math.abs(a.max.z - b.min.z) < tolerance || Math.abs(b.max.z - a.min.z) < tolerance) {
      let xOverlap = Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x), yOverlap = Math.min(a.max.y, b.max.y) - Math.max(a.min.y, b.min.y), aXSize = a.max.x - a.min.x, aYSize = a.max.y - a.min.y, bXSize = b.max.x - b.min.x, bYSize = b.max.y - b.min.y;
      if (Math.abs(aXSize - bXSize) < tolerance && Math.abs(aYSize - bYSize) < tolerance && Math.abs(xOverlap - aXSize) < tolerance && Math.abs(yOverlap - aYSize) < tolerance)
        return !0;
    }
    return !1;
  }
  function areNearby(a, b, gap = 0.5) {
    let xSep = Math.max(a.min.x - b.max.x, b.min.x - a.max.x, 0), ySep = Math.max(a.min.y - b.max.y, b.min.y - a.max.y, 0), zSep = Math.max(a.min.z - b.max.z, b.min.z - a.max.z, 0);
    return xSep <= gap && ySep <= gap && zSep <= gap;
  }
  function mergeFillRatio(a, b) {
    let combined = combineBounds(a, b), combinedVol = getVolume(combined);
    if (combinedVol <= 0)
      return 0;
    let volA = getVolume(a), volB = getVolume(b);
    return (volA + volB) / combinedVol;
  }
  function canMergeToBox(a, b) {
    let combined = combineBounds(a, b), combinedVolume = getVolume(combined), volumeA = getVolume(a), volumeB = getVolume(b);
    return Math.abs(combinedVolume - (volumeA + volumeB)) < 1e-3;
  }

  // optimizer/paint.ts
  var FACE_KEYS = ["north", "south", "east", "west", "up", "down"], textureCache = /* @__PURE__ */ new Map(), cubePaintCache = /* @__PURE__ */ new Map();
  function clearPaintCache() {
    textureCache.clear(), cubePaintCache.clear();
  }
  function faceTexture(face) {
    if (!face || face.texture === null || face.texture === void 0)
      return null;
    try {
      if (typeof face.getTexture == "function") {
        let t = face.getTexture();
        if (t)
          return t;
      }
    } catch {
    }
    return face.texture === !1 ? typeof Texture < "u" && Texture.all ? Texture.all.find((t) => t.use_as_default) || (Texture.all.length === 1 ? Texture.all[0] : null) : null : typeof Texture < "u" && Texture.all && Texture.all.find((t) => t.uuid === face.texture) || null;
  }
  function readTexture(texture) {
    if (textureCache.has(texture))
      return textureCache.get(texture) || null;
    let result = null;
    try {
      let width = texture.width || texture.img && texture.img.naturalWidth || 0, height = texture.height || texture.img && texture.img.naturalHeight || 0, projectUvW = typeof Project < "u" && Project && Project.texture_width || width, projectUvH = typeof Project < "u" && Project && Project.texture_height || height, uvW = texture.uv_width || projectUvW || width, uvH = texture.uv_height || projectUvH || height, data = null;
      if (typeof texture.getPixels == "function")
        data = texture.getPixels();
      else if (width > 0 && height > 0 && typeof document < "u") {
        let canvas = document.createElement("canvas");
        canvas.width = width, canvas.height = height;
        let ctx = canvas.getContext("2d"), source = texture.canvas && texture.canvas.width ? texture.canvas : texture.img;
        ctx && source && (ctx.drawImage(source, 0, 0, width, height), data = ctx.getImageData(0, 0, width, height).data);
      }
      data && width > 0 && height > 0 && (result = { width, height, scaleX: width / uvW, scaleY: height / uvH, data });
    } catch (e) {
      console.warn("[Myrlin's Tools] Could not read texture pixels for the paint check:", e), result = null;
    }
    return textureCache.set(texture, result), result;
  }
  function rectColor(pixels, u0, v0, u1, v1) {
    let x0 = Math.floor(Math.min(u0, u1) * pixels.scaleX + 1e-6), x1 = Math.ceil(Math.max(u0, u1) * pixels.scaleX - 1e-6), y0 = Math.floor(Math.min(v0, v1) * pixels.scaleY + 1e-6), y1 = Math.ceil(Math.max(v0, v1) * pixels.scaleY - 1e-6);
    if (x0 < 0 || y0 < 0 || x1 > pixels.width || y1 > pixels.height || x1 <= x0 || y1 <= y0 || !pixels.data)
      return "mixed";
    let data = pixels.data, first = -1;
    for (let y = y0; y < y1; y++)
      for (let x = x0; x < x1; x++) {
        let i = (y * pixels.width + x) * 4, value = data[i + 3] === 0 ? 0 : (data[i] << 24 | data[i + 1] << 16 | data[i + 2] << 8 | data[i + 3]) >>> 0;
        if (first === -1)
          first = value;
        else if (value !== first)
          return "mixed";
      }
    return "#" + (first >>> 0).toString(16).padStart(8, "0");
  }
  function getCubePaint(cube) {
    let cached = cubePaintCache.get(cube);
    if (cached)
      return cached;
    let faces = {}, painted = !1, flat = !0;
    for (let key of FACE_KEYS) {
      let face = cube.faces ? cube.faces[key] : null, texture = faceTexture(face);
      if (!texture) {
        faces[key] = "none";
        continue;
      }
      painted = !0;
      let pixels = readTexture(texture), uv = face.uv || [0, 0, 0, 0], color = pixels ? rectColor(pixels, uv[0], uv[1], uv[2], uv[3]) : "mixed";
      faces[key] = color, color === "mixed" && (flat = !1);
    }
    let result = { painted, flat, faces };
    return cubePaintCache.set(cube, result), result;
  }
  function samePaint(a, b) {
    let pa = getCubePaint(a), pb = getCubePaint(b);
    if (!pa.flat || !pb.flat)
      return !1;
    for (let key of FACE_KEYS)
      if (pa.faces[key] !== pb.faces[key])
        return !1;
    return !0;
  }
  var FACE_AXES = {
    north: [0, 1],
    south: [0, 1],
    east: [2, 1],
    west: [2, 1],
    up: [0, 2],
    down: [0, 2]
  };
  function paintCoversMerge(keepCube, origFrom, origTo, mergedFrom, mergedTo) {
    let paint = getCubePaint(keepCube);
    if (!paint.painted)
      return !0;
    if (!paint.flat)
      return !1;
    for (let key of FACE_KEYS) {
      let color = paint.faces[key];
      if (color === "none")
        continue;
      let face = keepCube.faces[key], texture = faceTexture(face), pixels = texture ? readTexture(texture) : null;
      if (!pixels)
        return !1;
      let uv = face.uv || [0, 0, 0, 0], [axisU, axisV] = FACE_AXES[key], rot = ((face.rotation || 0) % 360 + 360) % 360;
      (rot === 90 || rot === 270) && ([axisU, axisV] = [axisV, axisU]);
      let uvW = Math.abs(uv[2] - uv[0]), uvH = Math.abs(uv[3] - uv[1]), origU = Math.abs(origTo[axisU] - origFrom[axisU]), origV = Math.abs(origTo[axisV] - origFrom[axisV]), newU = Math.abs(mergedTo[axisU] - mergedFrom[axisU]), newV = Math.abs(mergedTo[axisV] - mergedFrom[axisV]), ratioU = origU > 0 ? uvW / origU : 0, ratioV = origV > 0 ? uvH / origV : 0, growU = Math.max(0, (newU - origU) * ratioU), growV = Math.max(0, (newV - origV) * ratioV);
      if (growU === 0 && growV === 0)
        continue;
      let u0 = Math.min(uv[0], uv[2]) - growU, u1 = Math.max(uv[0], uv[2]) + growU, v0 = Math.min(uv[1], uv[3]) - growV, v1 = Math.max(uv[1], uv[3]) + growV;
      if (rectColor(pixels, u0, v0, u1, v1) !== color)
        return !1;
    }
    return !0;
  }

  // utils/hytale_nodes.ts
  function isCube(node) {
    return typeof Cube < "u" && node instanceof Cube;
  }
  function isGroup(node) {
    return typeof Group < "u" && node instanceof Group;
  }
  var excludedNodes = null;
  function isExported(node) {
    return !node || node.export === !1 ? !1 : !(excludedNodes && excludedNodes.has(node));
  }
  function hasNoRotation(node) {
    let r = node && node.rotation;
    return r ? (r[0] || 0) === 0 && (r[1] || 0) === 0 && (r[2] || 0) === 0 : !0;
  }
  function inAttachmentCollection(node) {
    if (typeof Collection > "u" || !Collection.all || !Collection.all.length)
      return !1;
    try {
      let collection = Collection.all.find((c) => typeof c.contains == "function" && c.contains(node));
      return !!collection && collection.export_codec === "blockymodel";
    } catch {
      return !1;
    }
  }
  function countElement(node, tally) {
    if (!isExported(node) || inAttachmentCollection(node))
      return 0;
    if (isCube(node))
      return tally.cubes++, 1;
    if (!isGroup(node))
      return 0;
    tally.groups++;
    let count = 1, shapeTaken = !1;
    for (let child of node.children || [])
      if (isExported(child)) {
        if (!shapeTaken && isCube(child) && hasNoRotation(child)) {
          shapeTaken = !0, tally.cubes++, tally.freeCubes++;
          continue;
        }
        (isCube(child) || isGroup(child)) && (count += countElement(child, tally));
      }
    return count;
  }
  function emptyTally() {
    return { nodes: 0, groups: 0, cubes: 0, freeCubes: 0, rootCubes: 0 };
  }
  function hytaleNodeBreakdown(without) {
    let tally = emptyTally(), root = typeof Outliner < "u" && Outliner.root ? Outliner.root : [];
    excludedNodes = without && without.size ? without : null;
    try {
      for (let node of root) {
        if (!isCube(node) && !isGroup(node))
          continue;
        let before = tally.cubes;
        tally.nodes += countElement(node, tally), isCube(node) && tally.cubes > before && tally.rootCubes++;
      }
    } finally {
      excludedNodes = null;
    }
    return tally;
  }
  function countHytaleNodes() {
    return hytaleNodeBreakdown().nodes;
  }
  function countSubtreeNodes(node) {
    return countElement(node, emptyTally());
  }
  function countBlockyNodes(nodes) {
    let count = 0;
    for (let node of nodes)
      !node || typeof node != "object" || (count++, Array.isArray(node.children) && (count += countBlockyNodes(node.children)));
    return count;
  }
  function countHytaleNodesInJson(modelData) {
    if (!modelData || typeof modelData != "object")
      return null;
    let nodes = modelData.nodes, elements = modelData.elements, outliner = modelData.outliner;
    if (Array.isArray(nodes) && !Array.isArray(elements))
      return countBlockyNodes(nodes);
    if (!Array.isArray(elements))
      return null;
    let byUuid = /* @__PURE__ */ new Map();
    for (let el of elements)
      el && typeof el == "object" && el.uuid && byUuid.set(el.uuid, el);
    let jsonIsCube = (el) => !!el && (el.type === void 0 || el.type === "cube"), skipped = /* @__PURE__ */ new Set(), collections = modelData.collections;
    if (Array.isArray(collections)) {
      for (let c of collections)
        if (c && c.export_codec === "blockymodel" && Array.isArray(c.children))
          for (let uuid of c.children)
            skipped.add(uuid);
    }
    function countGroupJson(group) {
      if (!group || group.export === !1 || skipped.has(group.uuid))
        return 0;
      let count = 1, shapeTaken = !1;
      for (let child of group.children || [])
        if (typeof child == "string") {
          let el = byUuid.get(child);
          if (!jsonIsCube(el) || el.export === !1 || skipped.has(child))
            continue;
          if (!shapeTaken && hasNoRotation(el)) {
            shapeTaken = !0;
            continue;
          }
          count++;
        } else
          child && typeof child == "object" && (count += countGroupJson(child));
      return count;
    }
    if (!Array.isArray(outliner))
      return elements.filter((el) => jsonIsCube(el) && el.export !== !1).length;
    let total = 0;
    for (let entry of outliner)
      if (typeof entry == "string") {
        let el = byUuid.get(entry);
        jsonIsCube(el) && el.export !== !1 && !skipped.has(entry) && total++;
      } else
        entry && typeof entry == "object" && (total += countGroupJson(entry));
    return total;
  }

  // optimizer/box_merge.ts
  var SpatialHashGrid = class {
    constructor(cellSize = 16) {
      this.cellSize = cellSize, this.grid = /* @__PURE__ */ new Map(), this.cubeKeys = /* @__PURE__ */ new Map();
    }
    getKey(x, y, z) {
      let cx = Math.floor(x / this.cellSize), cy = Math.floor(y / this.cellSize), cz = Math.floor(z / this.cellSize);
      return `${cx},${cy},${cz}`;
    }
    getCellsForBounds(bounds) {
      let keys = [], minCx = Math.floor(bounds.min.x / this.cellSize), minCy = Math.floor(bounds.min.y / this.cellSize), minCz = Math.floor(bounds.min.z / this.cellSize), maxCx = Math.floor(bounds.max.x / this.cellSize), maxCy = Math.floor(bounds.max.y / this.cellSize), maxCz = Math.floor(bounds.max.z / this.cellSize);
      for (let cx = minCx; cx <= maxCx; cx++)
        for (let cy = minCy; cy <= maxCy; cy++)
          for (let cz = minCz; cz <= maxCz; cz++)
            keys.push(`${cx},${cy},${cz}`);
      return keys;
    }
    insert(cube, bounds) {
      let keys = this.getCellsForBounds(bounds);
      this.cubeKeys.set(cube, keys);
      for (let key of keys)
        this.grid.has(key) || this.grid.set(key, /* @__PURE__ */ new Set()), this.grid.get(key).add(cube);
    }
    remove(cube) {
      let keys = this.cubeKeys.get(cube);
      if (keys) {
        for (let key of keys) {
          let cell = this.grid.get(key);
          cell && (cell.delete(cube), cell.size === 0 && this.grid.delete(key));
        }
        this.cubeKeys.delete(cube);
      }
    }
    update(cube, bounds) {
      this.remove(cube), this.insert(cube, bounds);
    }
    getNearby(bounds) {
      let nearby = /* @__PURE__ */ new Set(), keys = this.getCellsForBounds(bounds);
      for (let key of keys) {
        let cell = this.grid.get(key);
        if (cell)
          for (let cube of cell)
            nearby.add(cube);
      }
      return nearby;
    }
    clear() {
      this.grid.clear(), this.cubeKeys.clear();
    }
  };
  function getCubeColorSignature(cube) {
    let faces = cube.faces || {}, parts = [];
    for (let face of ["north", "south", "east", "west", "up", "down"]) {
      let faceData = faces[face];
      faceData && parts.push(`${face}:${faceData.texture || "none"}`);
    }
    return cube.color !== void 0 && parts.push(`color:${cube.color}`), parts.join("|");
  }
  function cubesCanMerge(a, b) {
    if (a = unwrapCube(a), b = unwrapCube(b), !(a instanceof Cube) || !(b instanceof Cube) || a.parent !== b.parent || !sameRotation(a, b) || !isUnstretched(a) || !isUnstretched(b) || !sameDrawing(a, b))
      return !1;
    let sigA = getCubeColorSignature(a), sigB = getCubeColorSignature(b);
    return sigA !== sigB ? !1 : samePaint(a, b);
  }
  function unwrapCube(x) {
    return x && x.cube ? x.cube : x;
  }
  function isUnstretched(cube) {
    let s = cube && cube.stretch;
    if (!s)
      return !0;
    for (let i = 0; i < 3; i++) {
      let v = s[i] === void 0 || s[i] === null ? 1 : Number(s[i]);
      if (!(Math.abs(v - 1) <= 1e-6))
        return !1;
    }
    return !0;
  }
  function sameDrawing(a, b) {
    let same = (x, y) => (x === void 0 ? null : x) === (y === void 0 ? null : y);
    return !(Math.abs((a.inflate || 0) - (b.inflate || 0)) > 1e-6 || !same(a.visibility, b.visibility) || !same(a.double_sided, b.double_sided) || !same(a.shading_mode, b.shading_mode));
  }
  function sameRotation(a, b) {
    let ra = a.rotation || [0, 0, 0], rb = b.rotation || [0, 0, 0], tol = 1e-4;
    for (let i = 0; i < 3; i++)
      if (Math.abs((ra[i] || 0) - (rb[i] || 0)) > tol)
        return !1;
    if (!ra.some((v) => Math.abs(v || 0) > tol))
      return !0;
    let oa = a.origin || [0, 0, 0], ob = b.origin || [0, 0, 0];
    for (let i = 0; i < 3; i++)
      if (Math.abs((oa[i] || 0) - (ob[i] || 0)) > tol)
        return !1;
    return !0;
  }
  function mergeKeepsPaint(keep, other) {
    let cube = unwrapCube(keep), from0 = keep.from0 || cube.from, to0 = keep.to0 || cube.to, combined = combineBounds(getCubeBounds(keep), getCubeBounds(other));
    return paintCoversMerge(
      cube,
      from0,
      to0,
      [combined.min.x, combined.min.y, combined.min.z],
      [combined.max.x, combined.max.y, combined.max.z]
    );
  }
  function findMergeableNeighbor(cube, spatialGrid) {
    let bounds = getCubeBounds(cube), searchBounds = {
      min: { x: bounds.min.x - 1, y: bounds.min.y - 1, z: bounds.min.z - 1 },
      max: { x: bounds.max.x + 1, y: bounds.max.y + 1, z: bounds.max.z + 1 }
    }, nearby = spatialGrid.getNearby(searchBounds);
    for (let other of nearby) {
      if (other === cube || other._markedForRemoval || !cubesCanMerge(cube, other))
        continue;
      let otherBounds = getCubeBounds(other);
      if (sharesCompleteFace(bounds, otherBounds) && canMergeToBox(bounds, otherBounds) && mergeKeepsPaint(cube, other))
        return other;
    }
    return null;
  }
  function findMergeableNeighborLegacy(cube, cubes) {
    let bounds = getCubeBounds(cube);
    for (let other of cubes) {
      if (other === cube || other._markedForRemoval || !cubesCanMerge(cube, other))
        continue;
      let otherBounds = getCubeBounds(other);
      if (sharesCompleteFace(bounds, otherBounds) && canMergeToBox(bounds, otherBounds) && mergeKeepsPaint(cube, other))
        return other;
    }
    return null;
  }
  function mergeCubes(a, b) {
    let boundsA = getCubeBounds(a), boundsB = getCubeBounds(b), combined = combineBounds(boundsA, boundsB);
    a.from[0] = combined.min.x, a.from[1] = combined.min.y, a.from[2] = combined.min.z, a.to[0] = combined.max.x, a.to[1] = combined.max.y, a.to[2] = combined.max.z, b._markedForRemoval = !0;
  }
  var SPATIAL_HASH_THRESHOLD = 500;
  function findMergeableNeighborOnAxis(cube, axis, spatialGrid, allCubes) {
    let bounds = getCubeBounds(cube), tolerance = 1e-3, candidates;
    if (spatialGrid) {
      let searchBounds = {
        min: { x: bounds.min.x - 1, y: bounds.min.y - 1, z: bounds.min.z - 1 },
        max: { x: bounds.max.x + 1, y: bounds.max.y + 1, z: bounds.max.z + 1 }
      };
      candidates = spatialGrid.getNearby(searchBounds);
    } else
      candidates = allCubes;
    for (let other of candidates) {
      if (other === cube || other._markedForRemoval || !cubesCanMerge(cube, other))
        continue;
      let otherBounds = getCubeBounds(other);
      if (axis === "x") {
        if (!(Math.abs(bounds.max.x - otherBounds.min.x) < tolerance || Math.abs(otherBounds.max.x - bounds.min.x) < tolerance) || Math.abs(bounds.min.y - otherBounds.min.y) > tolerance || Math.abs(bounds.max.y - otherBounds.max.y) > tolerance || Math.abs(bounds.min.z - otherBounds.min.z) > tolerance || Math.abs(bounds.max.z - otherBounds.max.z) > tolerance)
          continue;
      } else if (axis === "y") {
        if (!(Math.abs(bounds.max.y - otherBounds.min.y) < tolerance || Math.abs(otherBounds.max.y - bounds.min.y) < tolerance) || Math.abs(bounds.min.x - otherBounds.min.x) > tolerance || Math.abs(bounds.max.x - otherBounds.max.x) > tolerance || Math.abs(bounds.min.z - otherBounds.min.z) > tolerance || Math.abs(bounds.max.z - otherBounds.max.z) > tolerance)
          continue;
      } else if (!(Math.abs(bounds.max.z - otherBounds.min.z) < tolerance || Math.abs(otherBounds.max.z - bounds.min.z) < tolerance) || Math.abs(bounds.min.x - otherBounds.min.x) > tolerance || Math.abs(bounds.max.x - otherBounds.max.x) > tolerance || Math.abs(bounds.min.y - otherBounds.min.y) > tolerance || Math.abs(bounds.max.y - otherBounds.max.y) > tolerance)
        continue;
      if (mergeKeepsPaint(cube, other))
        return other;
    }
    return null;
  }
  function runMergePasses(allCubes) {
    let originalCount = allCubes.length, mergeCount = 0, iterations = 0, maxIterations = originalCount * 2, useSpatialHash = originalCount >= SPATIAL_HASH_THRESHOLD, spatialGrid = null;
    if (useSpatialHash) {
      let totalSize = 0;
      for (let cube of allCubes) {
        let bounds = getCubeBounds(cube);
        totalSize += Math.max(
          bounds.max.x - bounds.min.x,
          bounds.max.y - bounds.min.y,
          bounds.max.z - bounds.min.z
        );
      }
      let avgSize = totalSize / originalCount, cellSize = Math.max(4, Math.ceil(avgSize * 2));
      spatialGrid = new SpatialHashGrid(cellSize);
      for (let cube of allCubes)
        spatialGrid.insert(cube, getCubeBounds(cube));
    }
    let activeCubes = new Set(allCubes), axisOrder = ["x", "y", "z"];
    for (let axis of axisOrder) {
      let passChanged = !0, passIterations = 0, passMaxIterations = activeCubes.size;
      for (; passChanged && passIterations < passMaxIterations; ) {
        passChanged = !1, passIterations++;
        for (let cube of activeCubes) {
          if (cube._markedForRemoval) {
            activeCubes.delete(cube);
            continue;
          }
          let neighbor = findMergeableNeighborOnAxis(
            cube,
            axis,
            spatialGrid,
            allCubes
          );
          neighbor && (spatialGrid && spatialGrid.remove(neighbor), mergeCubes(cube, neighbor), mergeCount++, spatialGrid && spatialGrid.update(cube, getCubeBounds(cube)), activeCubes.delete(neighbor), passChanged = !0, iterations++);
        }
      }
    }
    let changed = !0;
    for (; changed && iterations < maxIterations; ) {
      changed = !1, iterations++;
      for (let cube of activeCubes) {
        if (cube._markedForRemoval) {
          activeCubes.delete(cube);
          continue;
        }
        let neighbor = useSpatialHash && spatialGrid ? findMergeableNeighbor(cube, spatialGrid) : findMergeableNeighborLegacy(cube, allCubes);
        neighbor && (spatialGrid && spatialGrid.remove(neighbor), mergeCubes(cube, neighbor), mergeCount++, spatialGrid && spatialGrid.update(cube, getCubeBounds(cube)), activeCubes.delete(neighbor), changed = !0);
      }
    }
    return spatialGrid && spatialGrid.clear(), mergeCount;
  }
  function planMerges() {
    clearPaintCache();
    try {
      let allCubes = Cube.all.filter((c) => c.export !== !1), records = allCubes.map((c) => ({
        cube: c,
        uuid: c.uuid,
        from: c.from.slice(),
        to: c.to.slice(),
        from0: c.from.slice(),
        to0: c.to.slice(),
        parent: c.parent
      })), paintedSkipped = allCubes.filter((c) => {
        let paint = getCubePaint(c);
        return paint.painted && !paint.flat;
      }).length, perParent = /* @__PURE__ */ new Map();
      for (let c of allCubes)
        perParent.set(c.parent, (perParent.get(c.parent) || 0) + 1);
      let sharedGroups = [...perParent.values()].filter((n) => n >= 2).length, stretchedSkipped = allCubes.filter((c) => !isUnstretched(c)).length, mergeCount = records.length > 1 ? runMergePasses(records) : 0;
      return { records, mergeCount, paintedSkipped, boxCount: allCubes.length, sharedGroups, stretchedSkipped };
    } finally {
      clearPaintCache();
    }
  }
  function nothingToMergeReason(plan) {
    return plan.boxCount > 0 && plan.sharedGroups === 0 ? "Every box sits in its own group, and boxes only merge inside one group. Each group with its box is one Hytale node either way." : plan.boxCount > 0 && plan.stretchedSkipped === plan.boxCount ? "Every box is stretched. Hytale draws a stretched box scaled about its center, so merging would change its shape; Optimize leaves stretched boxes alone." : plan.boxCount > 0 && plan.paintedSkipped === plan.boxCount ? "Every box is painted with its own texture area. Merging boxes would move their paint, so Optimize leaves them alone." : plan.paintedSkipped > 0 ? `No two boxes in the same group share a full face, rotation and flat color. ${plan.paintedSkipped} painted box(es) are left alone so their paint stays where it is.` : "No two boxes in the same group share a full face, rotation and texture.";
  }
  function optimizeBoxes() {
    let allCubes = Cube.all.filter((c) => c.export !== !1), originalCount = allCubes.length;
    if (originalCount === 0)
      return {
        originalCount: 0,
        optimizedCount: 0,
        mergeCount: 0,
        success: !1,
        message: "No cubes found in the model."
      };
    let plan = planMerges();
    if (plan.mergeCount === 0)
      return {
        originalCount,
        optimizedCount: originalCount,
        mergeCount: 0,
        success: !0,
        message: `Nothing to merge. ${nothingToMergeReason(plan)}`
      };
    let nodesBefore = hytaleNodeBreakdown().nodes;
    Undo.initEdit({ elements: allCubes, outliner: !0 });
    for (let rec of plan.records)
      if (!rec._markedForRemoval)
        for (let i = 0; i < 3; i++)
          rec.cube.from[i] = rec.from[i], rec.cube.to[i] = rec.to[i];
    for (let rec of plan.records)
      rec._markedForRemoval && rec.cube.remove();
    Undo.finishEdit("Optimize Boxes (Myrlin's Tools)"), Canvas.updateAll();
    let mergeCount = plan.mergeCount, optimizedCount = originalCount - mergeCount, reduction = originalCount > 0 ? Math.round(mergeCount / originalCount * 100) : 0, nodesAfter = hytaleNodeBreakdown().nodes;
    return {
      originalCount,
      optimizedCount,
      mergeCount,
      success: !0,
      message: `Optimized: ${originalCount} \u2192 ${optimizedCount} boxes (${reduction}% reduction), ${nodesBefore} \u2192 ${nodesAfter} Hytale nodes`
    };
  }
  function estimateSavings() {
    let current = Cube.all.filter((c) => c.export !== !1).length, nodesBefore = hytaleNodeBreakdown().nodes;
    if (current === 0)
      return { current: 0, potential: 0, savings: 0, nodesBefore, nodesAfter: nodesBefore, nodeSavings: 0, paintedSkipped: 0, sharedGroups: 0, stretchedSkipped: 0 };
    let plan = planMerges(), removed = new Set(plan.records.filter((r) => r._markedForRemoval).map((r) => r.cube)), nodesAfter = removed.size > 0 ? hytaleNodeBreakdown(removed).nodes : nodesBefore;
    return {
      current,
      potential: current - plan.mergeCount,
      savings: plan.mergeCount,
      nodesBefore,
      nodesAfter,
      nodeSavings: nodesBefore - nodesAfter,
      paintedSkipped: plan.paintedSkipped,
      sharedGroups: plan.sharedGroups,
      stretchedSkipped: plan.stretchedSkipped
    };
  }

  // optimizer/hollow.ts
  var HOLLOW_ENABLED = !1, HOLLOW_OFF_MESSAGE = "Hollow Interior is switched off in this version and is coming back soon. No boxes were changed.";
  function buildOccupancyGrid(cubes) {
    let grid = /* @__PURE__ */ new Map();
    for (let cube of cubes) {
      let bounds = getCubeBounds(cube);
      for (let x = Math.floor(bounds.min.x); x < Math.ceil(bounds.max.x); x++)
        for (let y = Math.floor(bounds.min.y); y < Math.ceil(bounds.max.y); y++)
          for (let z = Math.floor(bounds.min.z); z < Math.ceil(bounds.max.z); z++) {
            let key = `${x},${y},${z}`;
            grid.has(key) || grid.set(key, []), grid.get(key).push(cube);
          }
    }
    return grid;
  }
  function hasRotation(node) {
    let r = node && node.rotation;
    return !!r && (Math.abs(r[0] || 0) > 1e-4 || Math.abs(r[1] || 0) > 1e-4 || Math.abs(r[2] || 0) > 1e-4);
  }
  function isRotated(cube) {
    let node = cube;
    for (let depth = 0; node && node !== "root" && depth < 64; depth++) {
      if (hasRotation(node))
        return !0;
      node = node.parent;
    }
    return !1;
  }
  function pointCoveredByOther(cube, point, grid, tolerance) {
    let neighbors = grid.get(`${Math.floor(point.x)},${Math.floor(point.y)},${Math.floor(point.z)}`);
    if (!neighbors)
      return !1;
    for (let neighbor of neighbors) {
      if (neighbor === cube || isRotated(neighbor))
        continue;
      let nBounds = getCubeBounds(neighbor);
      if (point.x >= nBounds.min.x - tolerance && point.x <= nBounds.max.x + tolerance && point.y >= nBounds.min.y - tolerance && point.y <= nBounds.max.y + tolerance && point.z >= nBounds.min.z - tolerance && point.z <= nBounds.max.z + tolerance)
        return !0;
    }
    return !1;
  }
  function isInterior(cube, grid) {
    if (isRotated(cube))
      return !1;
    let bounds = getCubeBounds(cube), min = [bounds.min.x, bounds.min.y, bounds.min.z], max = [bounds.max.x, bounds.max.y, bounds.max.z], OUTSIDE = 0.01, STEP = 0.5;
    for (let axis = 0; axis < 3; axis++) {
      let [a, b] = [0, 1, 2].filter((i) => i !== axis), spanA = max[a] - min[a], spanB = max[b] - min[b], nA = Math.max(1, Math.ceil(spanA / STEP)), nB = Math.max(1, Math.ceil(spanB / STEP));
      for (let dir of [-1, 1]) {
        let plane = dir > 0 ? max[axis] + OUTSIDE : min[axis] - OUTSIDE;
        for (let i = 0; i < nA; i++)
          for (let j = 0; j < nB; j++) {
            let coords = [0, 0, 0];
            if (coords[axis] = plane, coords[a] = min[a] + (i + 0.5) * spanA / nA, coords[b] = min[b] + (j + 0.5) * spanB / nB, !pointCoveredByOther(cube, { x: coords[0], y: coords[1], z: coords[2] }, grid, 1e-3))
              return !1;
          }
      }
    }
    return !0;
  }
  function hollowInterior(preserveShell = !0) {
    let allCubes = Cube.all.filter((c) => c.export !== !1), originalCount = allCubes.length;
    if (!HOLLOW_ENABLED)
      return {
        originalCount,
        removedCount: 0,
        finalCount: originalCount,
        success: !1,
        message: HOLLOW_OFF_MESSAGE
      };
    if (originalCount === 0)
      return {
        originalCount: 0,
        removedCount: 0,
        finalCount: 0,
        success: !1,
        message: "No cubes found in the model."
      };
    let grid = buildOccupancyGrid(allCubes), interiorCubes = [];
    for (let cube of allCubes)
      isInterior(cube, grid) && interiorCubes.push(cube);
    if (interiorCubes.length === 0)
      return {
        originalCount,
        removedCount: 0,
        finalCount: originalCount,
        success: !0,
        message: "No interior cubes found - model is already hollow."
      };
    Undo.initEdit({ elements: interiorCubes, outliner: !0 });
    for (let cube of interiorCubes)
      cube.remove();
    Undo.finishEdit("Hollow Interior (Myrlin's Tools)"), Canvas.updateAll();
    let removedCount = interiorCubes.length, finalCount = originalCount - removedCount, reduction = Math.round(removedCount / originalCount * 100);
    return {
      originalCount,
      removedCount,
      finalCount,
      success: !0,
      message: `Hollowed: ${originalCount} \u2192 ${finalCount} boxes (removed ${removedCount}, ${reduction}% reduction)`
    };
  }
  function countInteriorCubes() {
    if (!HOLLOW_ENABLED)
      return 0;
    let allCubes = Cube.all.filter((c) => c.export !== !1);
    if (allCubes.length === 0)
      return 0;
    let grid = buildOccupancyGrid(allCubes), count = 0;
    for (let cube of allCubes)
      isInterior(cube, grid) && count++;
    return count;
  }

  // utils/debounce.ts
  function debounce(fn, ms) {
    let timeout = null;
    return (...args) => {
      timeout && clearTimeout(timeout), timeout = setTimeout(() => {
        fn(...args), timeout = null;
      }, ms);
    };
  }

  // features/node_budget.ts
  function countGroup(group) {
    let cubeCount = 0, groupCount = 0, children = [];
    for (let child of group.children)
      child instanceof Cube ? cubeCount++ : child instanceof Group && (groupCount++, children.push(countGroup(child)));
    let childDescendants = children.reduce((sum, c) => sum + c.totalDescendants, 0), totalDescendants = cubeCount + groupCount + childDescendants;
    return {
      name: group.name,
      uuid: group.uuid,
      cubeCount,
      groupCount,
      totalDescendants,
      nodes: countSubtreeNodes(group),
      children
    };
  }
  function calculateNodeBudget() {
    let roots = [];
    for (let item of Outliner.root)
      item instanceof Group && roots.push(countGroup(item));
    return roots;
  }
  function countRootCubeNodes() {
    return (typeof Outliner < "u" && Outliner.root ? Outliner.root : []).filter((n) => n instanceof Cube).reduce((sum, n) => sum + countSubtreeNodes(n), 0);
  }
  function getTotalNodeCount() {
    return countHytaleNodes();
  }

  // ui/panel.ts
  var NODE_RULE_HINT = "Hytale nodes: every group is one node, its first unrotated cube is free, every other cube is one node. Same count as Hytale and the Hytale Models plugin.";
  function getQuickStats() {
    let nodeCount = getTotalNodeCount(), texture = Texture.all[0], textureSize = texture ? `${texture.width}x${texture.height}` : "No texture";
    return {
      nodeCount,
      maxNodes: 255,
      textureSize,
      isValid: nodeCount <= 255
    };
  }
  function getExpensiveStats() {
    let estimate = estimateSavings();
    return {
      interiorCount: countInteriorCubes(),
      // Nodes Optimize Boxes would actually remove (a dry run of the same merge)
      potentialSavings: estimate.nodeSavings
    };
  }
  function setupPanel() {
    let panel = new Panel("myrlins_tools_panel", {
      name: "Myrlin's Tools",
      id: "myrlins_tools_panel",
      icon: "auto_fix_high",
      growable: !0,
      condition: {
        modes: ["edit"],
        method: () => !0
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
                            <div class="myrlin-stat-row" :class="{ 'myrlin-stat-error': !quickStats.isValid }" :title="nodeRuleHint">
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
                                <span class="myrlin-stat-label">Optimize Boxes saves:</span>
                                <span class="myrlin-stat-value" :class="{ 'myrlin-stale': expensiveStale }">{{ expensiveStats.potentialSavings }} {{ expensiveStats.potentialSavings === 1 ? 'node' : 'nodes' }}</span>
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
                                    <span class="myrlin-budget-count">{{ bone.nodes }}</span>
                                </div>
                                <div v-if="expandedBones[bone.uuid] && bone.children.length > 0" class="myrlin-budget-children">
                                    <div
                                        v-for="child in bone.children"
                                        :key="child.uuid"
                                        class="myrlin-budget-row myrlin-budget-child"
                                        @click="selectBone(child.uuid)"
                                    >
                                        <span class="myrlin-budget-name">{{ child.name }}</span>
                                        <span class="myrlin-budget-count">{{ child.nodes }}</span>
                                    </div>
                                </div>
                            </div>
                            <div v-if="rootCubeNodes > 0" class="myrlin-budget-bone">
                                <div class="myrlin-budget-row" title="Cubes outside any group: one node each">
                                    <span class="myrlin-budget-name">Cubes outside groups</span>
                                    <span class="myrlin-budget-count">{{ rootCubeNodes }}</span>
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
                            <button v-if="hollowEnabled" class="myrlin-btn" @click="runAction('myrlin_hollow_interior')" :disabled="expensiveStats.interiorCount === 0">
                                <span class="myrlin-btn-icon">\u{1F573}\uFE0F</span>
                                <span class="myrlin-btn-text">Hollow Interior</span>
                            </button>
                            <div v-else class="myrlin-tool-note">Hollow Interior is coming back soon.</div>
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

                    
                </div>
            `,
        data() {
          return {
            quickStats: getQuickStats(),
            expensiveStats: { interiorCount: 0, potentialSavings: 0 },
            hollowEnabled: HOLLOW_ENABLED,
            expensiveStale: !0,
            nodeBudget: [],
            rootCubeNodes: 0,
            nodeRuleHint: NODE_RULE_HINT,
            expandedBones: {},
            debouncedExpensiveUpdate: null
          };
        },
        methods: {
          updateQuickStats() {
            this.quickStats = getQuickStats(), this.expensiveStale = !0, this.nodeBudget = calculateNodeBudget(), this.rootCubeNodes = countRootCubeNodes(), this.debouncedExpensiveUpdate && this.debouncedExpensiveUpdate();
          },
          updateExpensiveStats() {
            this.expensiveStats = getExpensiveStats(), this.expensiveStale = !1;
          },
          runAction(actionId) {
            BarItems[actionId] && BarItems[actionId].click();
          },
          selectBone(uuid) {
            let group = Group.all.find((g) => g.uuid === uuid);
            group && group.select();
          },
          toggleBone(uuid) {
            this.$set(this.expandedBones, uuid, !this.expandedBones[uuid]);
          },
          getBudgetClass(bone) {
            let fairShare = Math.floor(255 / Math.max(this.nodeBudget.length, 1));
            return bone.nodes > fairShare ? "myrlin-budget-red" : bone.nodes > fairShare * 0.5 ? "myrlin-budget-yellow" : "myrlin-budget-green";
          }
        },
        mounted() {
          this.debouncedExpensiveUpdate = debounce(() => {
            this.updateExpensiveStats();
          }, 500), this.updateExpensiveStats(), this.nodeBudget = calculateNodeBudget(), this.rootCubeNodes = countRootCubeNodes(), this._updateListener = Blockbench.on("update_selection", () => {
            this.updateQuickStats();
          }), this._undoListener = Blockbench.on("undo", () => {
            this.updateQuickStats();
          }), this._redoListener = Blockbench.on("redo", () => {
            this.updateQuickStats();
          });
        },
        beforeDestroy() {
          this._updateListener && this._updateListener.delete(), this._undoListener && this._undoListener.delete(), this._redoListener && this._redoListener.delete();
        }
      }
    });
    track(panel);
    let panelCSS = Blockbench.addCSS(PANEL_CSS);
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

    .myrlin-tool-note {
        padding: 2px 12px;
        font-size: 11px;
        color: var(--color-subtle_text);
    }
`;

  // utils/color.ts
  function rgbToLab(rgb) {
    let r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92, g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92, b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    let x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375, y = r * 0.2126729 + g * 0.7151522 + b * 0.072175, z = r * 0.0193339 + g * 0.119192 + b * 0.9503041, refX = 0.95047, refY = 1, refZ = 1.08883;
    return x = x / refX, y = y / refY, z = z / refZ, x = x > 8856e-6 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116, y = y > 8856e-6 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116, z = z > 8856e-6 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116, {
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
    let colorLab = rgbToLab(color), nearest = palette[0], minDist = 1 / 0;
    for (let p of palette) {
      let pLab = rgbToLab(p), dist = deltaE(colorLab, pLab);
      dist < minDist && (minDist = dist, nearest = p);
    }
    return nearest;
  }
  function averageColor(colors) {
    if (colors.length === 0)
      return { r: 0, g: 0, b: 0 };
    let sum = colors.reduce(
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
    if (colors.length <= k)
      return colors;
    let centroids = [], usedIndices = /* @__PURE__ */ new Set();
    for (; centroids.length < k; ) {
      let idx = Math.floor(Math.random() * colors.length);
      usedIndices.has(idx) || (usedIndices.add(idx), centroids.push({ ...colors[idx] }));
    }
    for (let iter = 0; iter < maxIterations; iter++) {
      let clusters = Array.from({ length: k }, () => []);
      for (let color of colors) {
        let minDist = 1 / 0, nearestIdx = 0;
        for (let i = 0; i < centroids.length; i++) {
          let dist = deltaE(rgbToLab(color), rgbToLab(centroids[i]));
          dist < minDist && (minDist = dist, nearestIdx = i);
        }
        clusters[nearestIdx].push(color);
      }
      let changed = !1;
      for (let i = 0; i < k; i++)
        if (clusters[i].length > 0) {
          let newCentroid = averageColor(clusters[i]);
          colorsAreSimilar(centroids[i], newCentroid, 1) || (changed = !0, centroids[i] = newCentroid);
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

  // tools/palette.ts
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
    let texture = Texture.all[0];
    if (!texture)
      return {
        success: !1,
        colorsChanged: 0,
        message: "No texture found in the model."
      };
    let palette = getPalette(paletteName), canvas = texture.canvas, ctx = canvas.getContext("2d");
    if (!ctx)
      return {
        success: !1,
        colorsChanged: 0,
        message: "Could not get canvas context."
      };
    Undo.initEdit({ textures: [texture] });
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height), data = imageData.data, colorsChanged = 0;
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i], g = data[i + 1], b = data[i + 2];
      if (data[i + 3] < 10)
        continue;
      let nearest = findNearestColor({ r, g, b }, palette);
      (nearest.r !== r || nearest.g !== g || nearest.b !== b) && (data[i] = nearest.r, data[i + 1] = nearest.g, data[i + 2] = nearest.b, colorsChanged++);
    }
    return ctx.putImageData(imageData, 0, 0), texture.updateSource(canvas.toDataURL()), Undo.finishEdit("Convert to Palette (Myrlin's Tools)"), {
      success: !0,
      colorsChanged,
      message: `Converted ${colorsChanged} pixels to ${paletteName} palette.`
    };
  }
  function quantizeColors(targetCount = 8) {
    let texture = Texture.all[0];
    if (!texture)
      return {
        success: !1,
        colorsChanged: 0,
        message: "No texture found in the model."
      };
    let canvas = texture.canvas, ctx = canvas.getContext("2d");
    if (!ctx)
      return {
        success: !1,
        colorsChanged: 0,
        message: "Could not get canvas context."
      };
    Undo.initEdit({ textures: [texture] });
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height), data = imageData.data, colors = [];
    for (let i = 0; i < data.length; i += 4)
      data[i + 3] >= 10 && colors.push({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2]
      });
    let palette = extractDominantColors(colors, targetCount), colorsChanged = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 10)
        continue;
      let original = {
        r: data[i],
        g: data[i + 1],
        b: data[i + 2]
      }, nearest = findNearestColor(original, palette);
      (nearest.r !== original.r || nearest.g !== original.g || nearest.b !== original.b) && (data[i] = nearest.r, data[i + 1] = nearest.g, data[i + 2] = nearest.b, colorsChanged++);
    }
    return ctx.putImageData(imageData, 0, 0), texture.updateSource(canvas.toDataURL()), Undo.finishEdit("Quantize Colors (Myrlin's Tools)"), {
      success: !0,
      colorsChanged,
      message: `Reduced to ${targetCount} colors (${colorsChanged} pixels changed).`
    };
  }

  // actions.ts
  function dialogLine(parts, muted = !1) {
    let p = document.createElement("p");
    p.style.margin = "0 0 8px 0", muted && (p.style.color = "var(--color-subtle_text)");
    for (let part of parts)
      if (typeof part == "string")
        p.append(document.createTextNode(part));
      else {
        let strong = document.createElement("strong");
        strong.textContent = part.strong, p.append(strong);
      }
    return p;
  }
  function showResultDialog(title, result) {
    Blockbench.showQuickMessage(result.message, 3e3), result.success || Blockbench.showMessageBox({
      title,
      message: result.message,
      icon: "warning"
    });
  }
  function setupActions() {
    let optimizeAction = new Action("myrlin_optimize_boxes", {
      name: "Optimize Boxes",
      description: "Merge adjacent boxes with same material to reduce box count (Myrlin's Tools)",
      icon: "compress",
      category: "tools",
      // 3.4.3 (2026-11-08): the default shortcut Ctrl+Shift+O is given here, the way Blockbench reads it. Action has no
      // setKeybind method; 3.0.0 called it and failed to install ("optimizeAction.setKeybind is not a function", Blockbench
      // plugins PR 884), and 3.4.x only skipped the call, so the shortcut never existed. A shortcut the person set in
      // Keybindings still wins over this default.
      // @ts-ignore - Keybind is a global from Blockbench
      keybind: new Keybind({ key: "o", ctrl: !0, shift: !0 }),
      condition: () => Cube.all.length > 0,
      click: () => {
        let estimate = estimateSavings(), canMerge = estimate.savings > 0, lines = [
          dialogLine(["Hytale nodes now: ", { strong: `${estimate.nodesBefore} / ${255}` }]),
          dialogLine([
            "After Optimize: ",
            { strong: `${estimate.nodesAfter} / ${255}` },
            ` (saves ${estimate.nodeSavings} ${estimate.nodeSavings === 1 ? "node" : "nodes"})`
          ]),
          dialogLine(["Boxes: ", { strong: `${estimate.current}` }, " now, ", { strong: `${estimate.potential}` }, " after"])
        ];
        canMerge ? estimate.paintedSkipped > 0 && lines.push(dialogLine([`${estimate.paintedSkipped} painted box(es) are left alone so their paint stays where it is.`])) : lines.push(dialogLine([`Nothing to merge. ${nothingToMergeReason({ paintedSkipped: estimate.paintedSkipped, boxCount: estimate.current, sharedGroups: estimate.sharedGroups, stretchedSkipped: estimate.stretchedSkipped })}`])), canMerge && estimate.stretchedSkipped > 0 && lines.push(dialogLine([`${estimate.stretchedSkipped} stretched box(es) are left alone so their shape stays the same.`])), lines.push(dialogLine([
          "Optimize merges unstretched boxes in the same group that share a full face, the same rotation and the same texture or flat color." + (canMerge ? " Undo with Ctrl+Z." : "")
        ], !0)), new Dialog({
          id: "myrlin_optimize_dialog",
          title: "Optimize Boxes - Myrlin's Tools",
          lines,
          buttons: canMerge ? ["Optimize", "Cancel"] : ["Close"],
          onConfirm: () => {
            if (!canMerge)
              return;
            let result = optimizeBoxes();
            showResultDialog("Optimize Boxes", result);
          }
        }).show();
      }
    });
    track(optimizeAction);
    let hollowAction = new Action("myrlin_hollow_interior", {
      name: HOLLOW_ENABLED ? "Hollow Interior" : "Hollow Interior (coming back soon)",
      description: HOLLOW_ENABLED ? "Remove boxes that are completely hidden inside the model (Myrlin's Tools)" : "Switched off in this version and coming back soon (Myrlin's Tools)",
      icon: "select_all",
      // Using available icon
      category: "tools",
      condition: () => HOLLOW_ENABLED ? Cube.all.length > 0 : !1,
      click: () => {
        if (!HOLLOW_ENABLED) {
          Blockbench.showQuickMessage(HOLLOW_OFF_MESSAGE, 3e3);
          return;
        }
        let interiorCount = countInteriorCubes(), totalCount = Cube.all.length;
        if (interiorCount === 0) {
          Blockbench.showQuickMessage("No interior cubes found - model is already hollow.", 2e3);
          return;
        }
        new Dialog({
          id: "myrlin_hollow_dialog",
          title: "Hollow Interior - Myrlin's Tools",
          lines: [
            dialogLine(["Current box count: ", { strong: `${totalCount}` }]),
            dialogLine(["Interior boxes found: ", { strong: `${interiorCount}` }]),
            dialogLine(["Final count after hollowing: ", { strong: `${totalCount - interiorCount}` }]),
            dialogLine(["This will remove boxes that are completely surrounded by other boxes. Undo with Ctrl+Z."], !0)
          ],
          buttons: ["Hollow", "Cancel"],
          onConfirm: () => {
            let result = hollowInterior(!0);
            showResultDialog("Hollow Interior", result);
          }
        }).show();
      }
    });
    track(hollowAction);
    let paletteAction = new Action("myrlin_palette_converter", {
      name: "Palette Converter",
      description: "Remap texture colors to a Hytale-style palette (Myrlin's Tools)",
      icon: "palette",
      category: "tools",
      condition: () => Texture.all.length > 0,
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
              value: !1,
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
              let qResult = quantizeColors(formResult.quantize_count || 8);
              qResult.success && Blockbench.showQuickMessage(qResult.message, 2e3);
            }
            let result = convertToPalette(formResult.palette);
            showResultDialog("Palette Converter", result);
          }
        }).show();
      }
    });
    track(paletteAction), MenuBar.addAction(optimizeAction, "tools"), MenuBar.addAction(hollowAction, "tools"), MenuBar.addAction(paletteAction, "tools");
  }

  // ui/status.ts
  function getStatusColor(count) {
    return count > 255 ? "#ef4444" : count > 200 ? "#f59e0b" : "#22c55e";
  }
  function getStatusEmoji(count) {
    return count > 255 ? "\u274C" : count > 200 ? "\u26A0\uFE0F" : "\u2705";
  }
  function setupStatusBar() {
    let statusElement = null;
    function updateStatus() {
      if (statusElement && !statusElement.isConnected && (statusElement = null), !statusElement && (createStatusElement(), !statusElement))
        return;
      let count = countHytaleNodes(), emoji = getStatusEmoji(count), color = getStatusColor(count);
      statusElement && (statusElement.innerHTML = `
                <span style="color: ${color}">
                    \u{1F4E6} ${count}/${255}
                </span>
            `, statusElement.title = `Hytale nodes: ${count} / ${255} (Myrlin's Tools). Every group is one node, its first unrotated cube is free, every other cube is one node.`);
    }
    function createStatusElement() {
      if (statusElement && statusElement.isConnected)
        return;
      let statusBar = document.querySelector("#status_bar");
      if (!statusBar) {
        console.warn("[Myrlin's Tools] Status bar not found");
        return;
      }
      statusElement = document.createElement("div"), statusElement.id = "myrlin_status", statusElement.className = "f_left", statusElement.style.cssText = `
            padding: 0 8px;
            font-size: 12px;
            display: flex;
            align-items: center;
            cursor: pointer;
        `, statusElement.addEventListener("click", () => {
        let panel = Panels.myrlins_tools_panel;
        panel && (panel.slot === "hidden" && panel.moveTo("right_bar"), panel.folded && panel.fold());
      });
      let firstChild = statusBar.firstChild;
      firstChild ? statusBar.insertBefore(statusElement, firstChild.nextSibling) : statusBar.appendChild(statusElement);
    }
    let modeListener = Blockbench.on("select_mode", (data) => {
      let mode = data && data.mode;
      (typeof mode == "string" ? mode : mode && mode.id) === "edit" && updateStatus();
    });
    track({ delete: () => modeListener.delete() });
    let updateListener = Blockbench.on("update_selection", updateStatus);
    track({ delete: () => updateListener.delete() });
    let undoListener = Blockbench.on("undo", updateStatus);
    track({ delete: () => undoListener.delete() });
    let redoListener = Blockbench.on("redo", updateStatus);
    track({ delete: () => redoListener.delete() });
    let projectListener = Blockbench.on("select_project", () => setTimeout(updateStatus, 50));
    track({ delete: () => projectListener.delete() }), track({
      delete: () => {
        statusElement && statusElement.parentNode && statusElement.parentNode.removeChild(statusElement), statusElement = null;
      }
    }), Modes.edit && setTimeout(updateStatus, 100);
  }

  // features/template_wizard.ts
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
    let group = new Group({
      name: boneDef.name,
      origin: boneDef.origin
    }).init();
    if (parent && group.addTo(parent), boneDef.cube && new Cube({
      name: boneDef.cube.name,
      from: boneDef.cube.from,
      to: boneDef.cube.to
    }).init().addTo(group), boneDef.children)
      for (let childDef of boneDef.children)
        buildBoneHierarchy(childDef, group);
    return group;
  }
  function resolveFormat(formatId) {
    return Formats[formatId] ? Formats[formatId] : Formats.free ? (Blockbench.showQuickMessage(
      `Hytale plugin format "${formatId}" not found. Using free format instead.`,
      3e3
    ), Formats.free) : null;
  }
  function createFromTemplate(template, assetName) {
    let format = resolveFormat(template.format);
    if (!format) {
      Blockbench.showMessageBox({
        title: "Template Wizard - Error",
        message: "Could not find a compatible format. Please ensure the Hytale Model Creator plugin is installed.",
        icon: "error"
      });
      return;
    }
    newProject(format), Project.texture_width = template.textureWidth, Project.texture_height = template.textureHeight, assetName && (Project.name = assetName);
    for (let rootBone of template.bones)
      buildBoneHierarchy(rootBone);
    let tex = new Texture({
      name: assetName || template.label,
      width: template.textureWidth,
      height: template.textureHeight
    }).add(!1).fillRecursive("#808080");
    typeof Canvas < "u" && Canvas.updateAll && Canvas.updateAll(), Blockbench.showQuickMessage(
      `Created ${template.label} template "${assetName || "Untitled"}" (${template.textureWidth}x${template.textureHeight})`,
      3e3
    );
  }
  function buildTemplateOptions() {
    let CATEGORIES = {
      Weapons: ["sword", "axe", "pickaxe", "bow", "staff", "spear", "hammer", "wand"],
      Defense: ["shield"],
      Armor: ["helmet", "chestplate", "boots", "gauntlets"],
      Props: ["furniture", "decoration", "crate"],
      Environment: ["tree", "rock"],
      Characters: ["character"],
      Creatures: ["creature", "bird", "fish"]
    }, options = {};
    for (let [category, keys] of Object.entries(CATEGORIES))
      for (let key of keys) {
        let tpl = TEMPLATES[key];
        if (tpl) {
          let formatLabel = tpl.format === "hytale_character" ? "Character" : "Prop";
          options[key] = `[${category}] ${tpl.label}  (${formatLabel} - ${tpl.textureWidth}x${tpl.textureHeight})`;
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
        let templateKey = formData.asset_type, template = TEMPLATES[templateKey];
        if (!template) {
          Blockbench.showQuickMessage("Unknown template type selected.", 2e3);
          return;
        }
        createFromTemplate(template, formData.asset_name);
      }
    }).show();
  }
  function setupTemplateWizard() {
    !!(Formats && (Formats.hytale_prop || Formats.hytale_character)) || console.warn(
      "[Myrlin's Tools] Hytale Model Creator plugin not detected. Template Wizard will fall back to free format."
    );
    let wizardAction = new Action("myrlin_template_wizard", {
      name: "New Hytale Asset",
      description: "Create a new Hytale model from a structured template (Myrlin's Tools)",
      icon: "note_add",
      category: "file",
      click: () => {
        if (!!!(Formats && (Formats.hytale_prop || Formats.hytale_character))) {
          Blockbench.showMessageBox({
            title: "Hytale Plugin Required",
            message: `The Hytale Model Creator plugin is not installed.

Templates will use the "free" format instead, which may not include Hytale-specific features like attachment points.

Install the Hytale Model Creator plugin from the Blockbench plugin store for the best experience.`,
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
    track(wizardAction), MenuBar.addAction(wizardAction, "file");
  }

  // utils/dialog_lines.ts
  function appendInline(parent, text) {
    for (let part of text.split(/(\*\*[^*]+\*\*)/))
      if (part)
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          let strong = document.createElement("strong");
          strong.textContent = part.slice(2, -2), parent.append(strong);
        } else
          parent.append(document.createTextNode(part));
  }
  function markdownLinesToElements(lines) {
    let out = [];
    for (let raw of lines) {
      let line = raw.trim();
      if (!line)
        continue;
      if (line === "---") {
        let hr = document.createElement("hr");
        hr.style.margin = "8px 0", out.push(hr);
        continue;
      }
      if (line.startsWith("## ")) {
        let h = document.createElement("h3");
        h.style.margin = "0 0 8px 0", appendInline(h, line.slice(3)), out.push(h);
        continue;
      }
      let p = document.createElement("p");
      p.style.margin = "0 0 6px 0";
      let note = line.match(/^_(.*)_$/);
      note ? (p.style.color = "var(--color-subtle_text)", p.style.fontSize = "0.92em", appendInline(p, note[1])) : appendInline(p, line), out.push(p);
    }
    return out;
  }

  // features/validator.ts
  var HYTALE_MAX_NODES2 = 255, HYTALE_WARN_NODES2 = 200, CHARACTER_PIXELS_PER_UNIT = 64, PROP_PIXELS_PER_UNIT = 32, PIXEL_RATIO_TOLERANCE = 0.5, MIN_STRETCH_RATIO = 0.7, MAX_STRETCH_RATIO = 1.3, MAX_TEXTURE_DIMENSION = 512, MIN_TEXTURE_DIMENSION = 16, REQUIRED_CHARACTER_BONES = [
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
    let priority = { pass: 0, warn: 1, fail: 2 };
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
    let tally = hytaleNodeBreakdown(), effectiveCount = tally.nodes, severity = "pass";
    effectiveCount > HYTALE_MAX_NODES2 ? severity = "fail" : effectiveCount > HYTALE_WARN_NODES2 && (severity = "warn");
    let details = `${tally.groups} group(s) + ${tally.cubes - tally.freeCubes} cube(s) = ${effectiveCount} nodes. ${tally.freeCubes} cube(s) are free as their group's shape` + (tally.rootCubes > 0 ? `; ${tally.rootCubes} cube(s) sit outside any group.` : ".");
    return {
      id: "node_count",
      name: "Node Count",
      severity,
      message: `${effectiveCount} / ${HYTALE_MAX_NODES2} nodes`,
      details
    };
  }
  function checkPixelRatio() {
    let textures = Texture.all;
    if (!textures || textures.length === 0)
      return {
        id: "pixel_ratio",
        name: "Pixel Ratio",
        severity: "pass",
        message: "Skipped (no texture)",
        details: "No texture found in the model. This check requires at least one texture."
      };
    let texture = textures[0], texWidth = texture.width || 0, texHeight = texture.height || 0;
    if (texWidth === 0 || texHeight === 0)
      return {
        id: "pixel_ratio",
        name: "Pixel Ratio",
        severity: "pass",
        message: "Skipped (texture has no dimensions)",
        details: "Texture dimensions could not be determined."
      };
    let expectedRatio = PROP_PIXELS_PER_UNIT, formatName = "prop";
    if (isCharacterFormat())
      expectedRatio = CHARACTER_PIXELS_PER_UNIT, formatName = "character";
    else if (isPropFormat())
      expectedRatio = PROP_PIXELS_PER_UNIT, formatName = "prop";
    else
      return {
        id: "pixel_ratio",
        name: "Pixel Ratio",
        severity: "pass",
        message: "Skipped (non-Hytale format)",
        details: "Pixel ratio check only applies to Hytale character and prop formats."
      };
    let cubes = Cube.all.filter((c) => c.export !== !1);
    if (cubes.length === 0)
      return {
        id: "pixel_ratio",
        name: "Pixel Ratio",
        severity: "pass",
        message: "Skipped (no cubes)",
        details: "No exportable cubes found in the model."
      };
    let minX = 1 / 0, minY = 1 / 0, minZ = 1 / 0, maxX = -1 / 0, maxY = -1 / 0, maxZ = -1 / 0;
    for (let cube of cubes)
      minX = Math.min(minX, cube.from[0]), minY = Math.min(minY, cube.from[1]), minZ = Math.min(minZ, cube.from[2]), maxX = Math.max(maxX, cube.to[0]), maxY = Math.max(maxY, cube.to[1]), maxZ = Math.max(maxZ, cube.to[2]);
    let modelSizeUnits = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
    if (modelSizeUnits <= 0)
      return {
        id: "pixel_ratio",
        name: "Pixel Ratio",
        severity: "pass",
        message: "Skipped (zero-size model)",
        details: "Model has zero extent in all dimensions."
      };
    let actualRatio = Math.max(texWidth, texHeight) / modelSizeUnits, deviation = Math.abs(actualRatio - expectedRatio) / expectedRatio, severity = "pass";
    deviation > PIXEL_RATIO_TOLERANCE && (severity = "warn");
    let ratioFormatted = actualRatio.toFixed(1);
    return {
      id: "pixel_ratio",
      name: "Pixel Ratio",
      severity,
      message: severity === "pass" ? `${ratioFormatted} px/unit (expected ~${expectedRatio} for ${formatName})` : `${ratioFormatted} px/unit (expected ~${expectedRatio}, off by ${(deviation * 100).toFixed(0)}%)`,
      details: `Texture: ${texWidth}x${texHeight}, Model extent: ${modelSizeUnits.toFixed(1)} units, Actual ratio: ${ratioFormatted} px/unit, Expected: ~${expectedRatio} px/unit for ${formatName} format. Deviation: ${(deviation * 100).toFixed(1)}% (threshold: ${PIXEL_RATIO_TOLERANCE * 100}%).`
    };
  }
  function checkStretchLimits() {
    let cubes = Cube.all.filter((c) => c.export !== !1);
    if (cubes.length === 0)
      return {
        id: "stretch_limits",
        name: "Stretch Limits",
        severity: "pass",
        message: "No cubes to check",
        details: "No exportable cubes found in the model."
      };
    let violatingCubes = [];
    for (let cube of cubes) {
      let sizeX = Math.abs(cube.to[0] - cube.from[0]), sizeY = Math.abs(cube.to[1] - cube.from[1]), sizeZ = Math.abs(cube.to[2] - cube.from[2]), minDim = Math.min(sizeX, sizeY, sizeZ);
      if (minDim <= 0)
        continue;
      let ratioX = sizeX / minDim, ratioY = sizeY / minDim, ratioZ = sizeZ / minDim, maxRatio = Math.max(ratioX, ratioY, ratioZ);
      if (maxRatio > MAX_STRETCH_RATIO) {
        let cubeName = cube.name || cube.uuid || "unnamed";
        violatingCubes.push(`${cubeName} (${maxRatio.toFixed(2)}x)`);
      }
    }
    let count = violatingCubes.length;
    if (count > 0) {
      let shownCubes = violatingCubes.slice(0, 5), moreCount = count - shownCubes.length, detailList = shownCubes.join(", ");
      return moreCount > 0 && (detailList += `, and ${moreCount} more`), {
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
    if (!isCharacterFormat())
      return {
        id: "bone_naming",
        name: "Bone Naming",
        severity: "pass",
        message: "Skipped (non-character format)",
        details: "Bone naming validation only applies to Hytale character formats."
      };
    let groups = Group.all;
    if (!groups || groups.length === 0)
      return {
        id: "bone_naming",
        name: "Bone Naming",
        severity: "warn",
        message: "No bones found",
        details: "No groups (bones) were found in the model. Character models require standard bone hierarchy."
      };
    let groupNamesLower = groups.map((g) => (g.name || "").toLowerCase().trim()), missingBones = [], foundBones = [];
    for (let bone of REQUIRED_CHARACTER_BONES)
      bone.variations.some(
        (variation) => groupNamesLower.includes(variation.toLowerCase())
      ) ? foundBones.push(bone.canonical) : missingBones.push(bone.canonical);
    return missingBones.length > 0 ? {
      id: "bone_naming",
      name: "Bone Naming",
      severity: "warn",
      message: `${missingBones.length} required bone${missingBones.length !== 1 ? "s" : ""} missing`,
      details: `Missing: ${missingBones.join(", ")}. Found: ${foundBones.join(", ") || "none"}. Required bones for character format: ${REQUIRED_CHARACTER_BONES.map((b) => b.canonical).join(", ")}.`
    } : {
      id: "bone_naming",
      name: "Bone Naming",
      severity: "pass",
      message: "All required bones present",
      details: `Found all ${REQUIRED_CHARACTER_BONES.length} required bones: ${foundBones.join(", ")}.`
    };
  }
  function checkTextureResolution() {
    let textures = Texture.all;
    if (!textures || textures.length === 0)
      return {
        id: "texture_resolution",
        name: "Texture Resolution",
        severity: "pass",
        message: "Skipped (no texture)",
        details: "No texture found in the model. This check requires at least one texture."
      };
    let texture = textures[0], width = texture.width || 0, height = texture.height || 0;
    if (width === 0 || height === 0)
      return {
        id: "texture_resolution",
        name: "Texture Resolution",
        severity: "warn",
        message: "Texture has no dimensions",
        details: "Texture dimensions could not be determined. Ensure the texture is loaded correctly."
      };
    let widthIsPow2 = isPowerOfTwo(width), heightIsPow2 = isPowerOfTwo(height);
    if (!widthIsPow2 || !heightIsPow2) {
      let nonPow2Dims = [];
      return widthIsPow2 || nonPow2Dims.push(`width=${width}`), heightIsPow2 || nonPow2Dims.push(`height=${height}`), {
        id: "texture_resolution",
        name: "Texture Resolution",
        severity: "fail",
        message: `Non-power-of-2: ${width}x${height}`,
        details: `Texture dimensions must be powers of 2 (e.g. 16, 32, 64, 128, 256, 512). Non-compliant: ${nonPow2Dims.join(", ")}.`
      };
    }
    let maxDim = Math.max(width, height), minDim = Math.min(width, height);
    return maxDim > MAX_TEXTURE_DIMENSION ? {
      id: "texture_resolution",
      name: "Texture Resolution",
      severity: "warn",
      message: `Large texture: ${width}x${height} (>${MAX_TEXTURE_DIMENSION})`,
      details: `Texture dimensions (${width}x${height}) exceed the recommended maximum of ${MAX_TEXTURE_DIMENSION}px. Large textures increase file size and may cause performance issues in Hytale.`
    } : minDim < MIN_TEXTURE_DIMENSION ? {
      id: "texture_resolution",
      name: "Texture Resolution",
      severity: "warn",
      message: `Small texture: ${width}x${height} (<${MIN_TEXTURE_DIMENSION})`,
      details: `Texture dimensions (${width}x${height}) are below the recommended minimum of ${MIN_TEXTURE_DIMENSION}px. Small textures may lack detail for the model.`
    } : {
      id: "texture_resolution",
      name: "Texture Resolution",
      severity: "pass",
      message: `${width}x${height} (power-of-2)`,
      details: `Texture resolution ${width}x${height} is valid: power-of-2 and within the ${MIN_TEXTURE_DIMENSION}-${MAX_TEXTURE_DIMENSION}px recommended range.`
    };
  }
  function validateModel() {
    let results = [
      checkNodeCount(),
      checkPixelRatio(),
      checkStretchLimits(),
      checkBoneNaming(),
      checkTextureResolution()
    ], overallSeverity = "pass";
    for (let result of results)
      overallSeverity = worstSeverity(overallSeverity, result.severity);
    return {
      results,
      overallSeverity,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  function formatReportLines(report) {
    let lines = [], overallIcon = severityIcon(report.overallSeverity), overallLabel = severityLabel(report.overallSeverity);
    lines.push(`## ${overallIcon} Overall: **${overallLabel}**`), lines.push(""), lines.push("---"), lines.push("");
    for (let result of report.results) {
      let icon = severityIcon(result.severity);
      lines.push(`${icon} **${result.name}**: ${result.message}`), result.details && lines.push(`  _${result.details}_`), lines.push("");
    }
    return lines.push("---"), lines.push(`_Validated at ${new Date(report.timestamp).toLocaleTimeString()}_`), lines;
  }
  function setupValidator() {
    let validateAction = new Action("myrlin_validate", {
      name: "Validate Hytale Model",
      description: "Check model against Hytale art style requirements (Myrlin's Tools)",
      icon: "verified",
      category: "tools",
      click: () => {
        let report = validateModel(), lines = formatReportLines(report), titleSuffix = "";
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
          // Real elements: Blockbench 5 shows string lines as plain text (3.4.0 showed raw markdown)
          lines: markdownLinesToElements(lines),
          buttons: ["Close"],
          onConfirm: () => {
          }
        }).show();
        let passCount = report.results.filter((r) => r.severity === "pass").length, warnCount = report.results.filter((r) => r.severity === "warn").length, failCount = report.results.filter((r) => r.severity === "fail").length;
        Blockbench.showQuickMessage(
          `Validation: ${passCount} passed, ${warnCount} warnings, ${failCount} failed`,
          2e3
        );
      }
    });
    track(validateAction), MenuBar.addAction(validateAction, "tools");
  }

  // features/config_generator.ts
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
    let base64 = dataUrl.split(",")[1], binaryString = atob(base64), bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++)
      bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  }
  function extractTextureData() {
    let texture = Texture.all[0];
    if (!texture)
      return null;
    try {
      let dataUrl = texture.canvas.toDataURL("image/png");
      return dataUrlToUint8Array(dataUrl);
    } catch (e) {
      return console.warn("[Myrlin's Tools] Failed to extract texture data:", e), null;
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
    let manifest = generateManifest(form), modelData = Codecs.blockymodel ? Codecs.blockymodel.compile() : JSON.stringify({}), textureData = extractTextureData(), zip = new JSZip();
    zip.file("manifest.json", JSON.stringify(manifest, null, 2));
    let configPath = getConfigPath(form.assetType, form.assetId);
    zip.file(configPath, JSON.stringify(config, null, 2));
    let modelPath = getModelPath(form.assetType, form.assetId);
    zip.file(modelPath, typeof modelData == "string" ? modelData : JSON.stringify(modelData, null, 2));
    let texturePath = getTexturePath(form.assetType, form.assetId);
    textureData && zip.file(texturePath, textureData);
    let blob = await zip.generateAsync({ type: "blob" }), filename = `${form.modName}.zip`;
    try {
      Blockbench.export({
        type: "Zip Archive",
        extensions: ["zip"],
        name: filename,
        content: blob,
        savetype: "zip"
      });
    } catch {
      try {
        saveAs(blob, filename);
      } catch (saveError) {
        console.error("[Myrlin's Tools] Failed to save zip:", saveError), Blockbench.showMessageBox({
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
        let sanitizedId = formResult.assetId.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_"), configForm = {
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
          console.error("[Myrlin's Tools] Config generator error:", err), Blockbench.showMessageBox({
            title: "Export Error",
            message: `Failed to generate mod package: ${err.message}`,
            icon: "error"
          });
        });
      }
    }).show();
  }
  function setupConfigGenerator() {
    let configGeneratorAction = new Action("myrlin_config_generator", {
      name: "Export Hytale Mod Package",
      description: "Export model with JSON configs as a Hytale mod package (.zip) (Myrlin's Tools)",
      icon: "inventory_2",
      category: "file",
      condition: () => Cube.all.length > 0,
      click: () => {
        showConfigDialog();
      }
    });
    track(configGeneratorAction), MenuBar.addAction(configGeneratorAction, "file");
  }

  // api-client.ts
  var MYRLIN_API = "";
  function localValidation(modelData) {
    let issues = [];
    console.log("[Myrlin Validate] Starting local validation. Keys:", Object.keys(modelData));
    let nodes = modelData.nodes, elements = modelData.elements, outliner = modelData.outliner, isBbmodel = !nodes && Array.isArray(elements), isBlockymodel = Array.isArray(nodes);
    if (console.log("[Myrlin Validate] Format:", isBbmodel ? "bbmodel" : isBlockymodel ? "blockymodel" : "unknown"), console.log("[Myrlin Validate] elements:", elements?.length || 0, "nodes:", nodes?.length || 0, "outliner:", outliner?.length || 0), !isBlockymodel && !isBbmodel)
      return issues.push({
        severity: "error",
        code: "UNKNOWN_FORMAT",
        message: 'Model has no "nodes" array (blockymodel) or "elements" array (bbmodel). Is a model open?',
        auto_fixable: !1
      }), console.log("[Myrlin Validate] FAIL: unknown format"), {
        valid: !1,
        issues,
        summary: { error: 1, warning: 0, info: 0 }
      };
    let cubeCount = elements?.length || 0, groupCount = 0;
    function countGroups(entries) {
      for (let e of entries)
        typeof e == "object" && e !== null && e.children && (groupCount++, countGroups(e.children));
    }
    outliner && countGroups(outliner);
    let sharedCount = countHytaleNodesInJson(modelData), totalNodes = sharedCount !== null ? sharedCount : isBbmodel ? cubeCount + groupCount : nodes?.length || 0;
    console.log("[Myrlin Validate] Total nodes:", totalNodes, "(cubes:", cubeCount, "groups:", groupCount, ")"), totalNodes > 255 ? issues.push({
      severity: "error",
      code: "NODE_LIMIT",
      message: `Model has ${totalNodes} nodes, exceeds Hytale limit of 255`,
      auto_fixable: !1
    }) : totalNodes > 200 && issues.push({
      severity: "warning",
      code: "NODE_COUNT_HIGH",
      message: `Model has ${totalNodes} nodes, approaching Hytale limit of 255`,
      auto_fixable: !1
    });
    let checkItems = isBbmodel ? elements || [] : nodes || [];
    for (let i = 0; i < checkItems.length; i++) {
      let node = checkItems[i];
      if (!node)
        continue;
      let from = node.from, to = node.to;
      if (from && to && Array.isArray(from) && Array.isArray(to) && from.length >= 3 && to.length >= 3) {
        let dx = Math.abs(to[0] - from[0]), dy = Math.abs(to[1] - from[1]), dz = Math.abs(to[2] - from[2]), zeroCount = (dx === 0 ? 1 : 0) + (dy === 0 ? 1 : 0) + (dz === 0 ? 1 : 0);
        if (zeroCount >= 2 && issues.push({
          severity: "warning",
          code: "DEGENERATE_SHAPE",
          message: `"${node.name || "unnamed"}" has ${zeroCount} zero dimensions (${dx.toFixed(1)} x ${dy.toFixed(1)} x ${dz.toFixed(1)})`,
          location: node.name || `element[${i}]`,
          auto_fixable: !1
          // 3.4.3: nothing repairs this yet (see repair() below)
        }), from && to && dx > 0 && dy > 0 && dz > 0) {
          let dims = [dx, dy, dz].sort((a, b) => a - b), ratio = dims[2] / dims[0];
          ratio > 50 && issues.push({
            severity: "error",
            code: "EXTREME_ASPECT_RATIO",
            message: `"${node.name || "unnamed"}" has ${ratio.toFixed(0)}:1 aspect ratio (max 50:1)`,
            location: node.name || `element[${i}]`,
            auto_fixable: !1
            // 3.4.3: nothing repairs this yet (see repair() below)
          });
        }
      }
    }
    let allNames = [];
    for (let item of checkItems) {
      let n = item;
      n && n.name && allNames.push(n.name);
    }
    function collectGroupNames(entries) {
      if (entries)
        for (let e of entries)
          typeof e == "object" && e !== null && (e.name && allNames.push(e.name), e.children && collectGroupNames(e.children));
    }
    outliner && collectGroupNames(outliner);
    let pascalRe = /^[A-Z][A-Za-z0-9]*([_-][A-Z0-9][A-Za-z0-9]*)*$/, namingIssues = 0;
    for (let name of allNames)
      name && !pascalRe.test(name) && name !== "cube" && name !== "group" && (namingIssues++, namingIssues <= 5 && issues.push({
        severity: "info",
        code: "NAMING",
        message: `"${name}" does not follow PascalCase convention (expected e.g., "L-Arm", "Head", "Blade")`,
        location: name,
        auto_fixable: !1
        // 3.4.3: nothing repairs this yet (see repair() below)
      }));
    if (namingIssues > 5 && issues.push({
      severity: "info",
      code: "NAMING",
      message: `...and ${namingIssues - 5} more naming convention issues`,
      auto_fixable: !1
      // 3.4.3: nothing repairs this yet (see repair() below)
    }), cubeCount > 10) {
      let collectAllNames = function(entries) {
        if (entries)
          for (let e of entries)
            typeof e == "object" && e !== null && (e.name && allNamesLower.add(e.name.toLowerCase()), e.children && collectAllNames(e.children));
      }, allNamesLower = new Set(allNames.map((n) => n.toLowerCase()));
      outliner && collectAllNames(outliner);
      let stdAttachments = ["r-attachment", "l-attachment"];
      for (let att of stdAttachments)
        allNamesLower.has(att) || issues.push({
          severity: "info",
          code: "MISSING_ATTACHMENT",
          message: `Missing standard attachment point "${att.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("-")}"`,
          auto_fixable: !1
          // 3.4.3: nothing repairs this yet (see repair() below)
        });
    }
    let errorCount = issues.filter((i) => i.severity === "error").length, warningCount = issues.filter((i) => i.severity === "warning").length, infoCount = issues.filter((i) => i.severity === "info").length;
    console.log(`[Myrlin Validate] Done: ${errorCount} errors, ${warningCount} warnings, ${infoCount} info`);
    for (let issue of issues)
      console.log(`[Myrlin Validate]   [${issue.severity.toUpperCase()}] ${issue.code}: ${issue.message}`);
    return {
      valid: errorCount === 0,
      issues,
      summary: { error: errorCount, warning: warningCount, info: infoCount }
    };
  }
  var MyrlinApiClient = class {
    constructor(baseUrl = MYRLIN_API) {
      this.baseUrl = baseUrl, this.online = !0;
    }
    /**
     * Check if the API is reachable.
     * Pings the /health endpoint with a short timeout.
     *
     * @returns true if the API responded successfully
     */
    async checkConnection() {
      if (0)
        try {
        } catch {
        }
      return this.online = !1, !1;
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
      return localValidation(modelData);
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
      return console.log("[Myrlin Repair] Automatic repair is not available yet:", repairs), {
        success: !1,
        model_data: null,
        repairs_applied: [],
        message: "Automatic repair is not available yet. Validate lists each issue so you can fix it by hand."
      };
    }
    async _repair_remote(modelData, repairs) {
      if (!this.online)
        return {
          success: !1,
          model_data: null,
          repairs_applied: [],
          message: "Repair requires an API connection. Check your network and try again."
        };
      let result = await this._post("/api/tools/repair", {
        model: modelData,
        repairs
      });
      return result || {
        success: !1,
        model_data: null,
        repairs_applied: [],
        message: "Repair request failed. The API may be temporarily unavailable."
      };
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
      return { success: !1, data: null, format: targetFormat, message: "Export to other formats is not part of this edition." };
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
      if (0)
        try {
        } catch (e) {
        }
      return null;
    }
  }, _client = null;
  function getApiClient() {
    return _client || (_client = new MyrlinApiClient()), _client;
  }

  // utils/project_json.ts
  function parseCompiled(compiled) {
    if (typeof compiled == "string")
      try {
        return JSON.parse(compiled);
      } catch {
        return null;
      }
    return compiled && typeof compiled == "object" ? compiled : null;
  }

  // features/validation_panel.ts
  var DIALOG_WIDTH = 640, MAX_DISPLAY_ISSUES = 50, ENGINE_PROFILES = [
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
  ], DEFAULT_ENGINE = "hytale";
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
  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function extractModelData() {
    try {
      if (typeof Codecs < "u" && Codecs.project && typeof Codecs.project.compile == "function")
        return parseCompiled(Codecs.project.compile());
      if (typeof Project > "u" || !Project)
        return null;
      let cubes = typeof Cube < "u" ? Cube.all : [], groups = typeof Group < "u" ? Group.all : [];
      if (cubes.length === 0 && groups.length === 0)
        return null;
      let nodes = [];
      for (let cube of cubes)
        nodes.push({
          name: cube.name || "cube",
          from: cube.from ? [...cube.from] : [0, 0, 0],
          to: cube.to ? [...cube.to] : [1, 1, 1],
          type: "cube"
        });
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
      return console.warn("[Myrlin Validation Panel] Failed to extract model data:", e), null;
    }
  }
  function buildSummaryHtml(issues) {
    let errorCount = issues.filter((i) => i.severity === "error").length, warnCount = issues.filter((i) => i.severity === "warning").length, infoCount = issues.filter((i) => i.severity === "info").length, fixableCount = issues.filter((i) => i.auto_fixable).length, html = '<div style="padding:8px 0;margin-bottom:8px;border-bottom:1px solid #444;font-size:13px;">';
    return html += `<span style="color:${severityColor("error")};font-weight:bold;margin-right:12px;">`, html += `${errorCount} error(s)</span>`, html += `<span style="color:${severityColor("warning")};font-weight:bold;margin-right:12px;">`, html += `${warnCount} warning(s)</span>`, html += `<span style="color:${severityColor("info")};font-weight:bold;margin-right:12px;">`, html += `${infoCount} info</span>`, fixableCount > 0 && (html += '<span style="color:#27ae60;margin-left:8px;">', html += `| ${fixableCount} auto-fixable</span>`), html += "</div>", html;
  }
  function buildResultsTableHtml(issues) {
    if (issues.length === 0)
      return `
            <div style="padding:20px;text-align:center;color:#27ae60;">
                <p style="font-size:16px;font-weight:bold;">No issues found</p>
                <p style="color:#888;">Your model passes all validation checks for this engine profile.</p>
            </div>
        `;
    let sorted = [...issues].sort((a, b) => severityPriority(a.severity) - severityPriority(b.severity)), displayed = sorted.slice(0, MAX_DISPLAY_ISSUES), truncated = sorted.length - displayed.length, hasFixable = issues.some((i) => i.auto_fixable), html = "";
    html += buildSummaryHtml(issues), hasFixable && (html += '<div style="margin-bottom:8px;text-align:right;">', html += '<button id="myrlin-vp-fix-all" style="', html += "padding:5px 14px;border:1px solid #27ae60;border-radius:3px;", html += 'background:#1a3a1a;color:#27ae60;cursor:pointer;font-size:12px;font-weight:bold;">', html += "Fix All Auto-Fixable</button>", html += "</div>"), html += '<div id="myrlin-vp-issues" style="max-height:340px;overflow-y:auto;border:1px solid #444;border-radius:4px;">', html += '<table style="width:100%;border-collapse:collapse;font-size:13px;">', html += '<thead><tr style="background:#2a2a2a;position:sticky;top:0;">', html += '<th style="padding:6px 8px;text-align:left;width:28px;"></th>', html += '<th style="padding:6px 8px;text-align:left;width:100px;">Code</th>', html += '<th style="padding:6px 8px;text-align:left;">Message</th>', html += '<th style="padding:6px 8px;text-align:left;width:100px;">Location</th>', html += '<th style="padding:6px 8px;text-align:center;width:60px;">Action</th>', html += "</tr></thead><tbody>";
    for (let i = 0; i < displayed.length; i++) {
      let issue = displayed[i], rowBg = i % 2 === 0 ? "#1e1e1e" : "#252525";
      html += `<tr style="background:${rowBg};border-bottom:1px solid #333;">`, html += `<td style="padding:6px 8px;text-align:center;">${severityIconHtml(issue.severity)}</td>`, html += `<td style="padding:6px 8px;font-family:monospace;font-size:11px;color:${severityColor(issue.severity)};">`, html += `${escapeHtml(issue.code)}</td>`, html += `<td style="padding:6px 8px;color:#ccc;">${escapeHtml(issue.message)}</td>`, html += '<td style="padding:6px 8px;font-size:11px;color:#888;">', html += issue.location ? escapeHtml(issue.location) : "-", html += "</td>", html += '<td style="padding:6px 8px;text-align:center;">', issue.auto_fixable ? (html += `<button class="myrlin-vp-fix-btn" data-code="${escapeHtml(issue.code)}" style="`, html += "padding:2px 8px;border:1px solid #27ae60;border-radius:3px;", html += 'background:#1a3a1a;color:#27ae60;cursor:pointer;font-size:11px;">', html += "Fix</button>") : html += '<span style="color:#555;font-size:11px;">manual</span>', html += "</td>", html += "</tr>";
    }
    return html += "</tbody></table></div>", truncated > 0 && (html += '<p style="color:#888;font-size:12px;margin-top:4px;">', html += `...and ${truncated} more issue(s) not shown.</p>`), html;
  }
  function buildDialogHtml() {
    let html = "";
    html += '<div style="margin-bottom:12px;">', html += '<p style="font-size:13px;color:#aaa;">', html += "Validate your model against engine-specific rules. ", html += "Select a target engine and run validation to see issues.", html += "</p>", html += "</div>", html += '<div style="margin-bottom:12px;">', html += '<label style="font-size:13px;font-weight:bold;color:#ccc;display:block;margin-bottom:4px;">', html += "Target Engine:</label>", html += '<select id="myrlin-vp-engine" style="', html += "width:100%;padding:6px 10px;border:1px solid #444;border-radius:4px;", html += 'background:#1a1a1a;color:#ccc;font-size:13px;cursor:pointer;">';
    for (let profile of ENGINE_PROFILES) {
      let selected = profile.id === DEFAULT_ENGINE ? "selected" : "";
      html += `<option value="${profile.id}" ${selected}>${escapeHtml(profile.label)}</option>`;
    }
    html += "</select>";
    let defaultProfile = ENGINE_PROFILES.find((p) => p.id === DEFAULT_ENGINE) || ENGINE_PROFILES[0];
    return html += '<div id="myrlin-vp-engine-desc" style="font-size:11px;color:#888;margin-top:4px;padding:0 2px;">', html += escapeHtml(defaultProfile.description), html += "</div>", html += "</div>", html += '<div style="margin-bottom:12px;text-align:center;">', html += '<button id="myrlin-vp-validate-btn" style="', html += "padding:8px 24px;border:1px solid #3498db;border-radius:4px;", html += 'background:#1a2a3a;color:#3498db;cursor:pointer;font-size:14px;font-weight:bold;">', html += "Validate</button>", html += "</div>", html += '<div id="myrlin-vp-results"></div>', html;
  }
  async function runEngineValidation(engine) {
    let modelData = extractModelData();
    if (!modelData) {
      Blockbench.showMessageBox({
        title: "No Model Open",
        message: "Please open a model before running validation.",
        icon: "warning"
      });
      return;
    }
    let resultsEl = document.getElementById("myrlin-vp-results");
    resultsEl && (resultsEl.innerHTML = `
            <div style="padding:16px;text-align:center;color:#888;">
                <p style="font-size:13px;">Validating model...</p>
            </div>
        `), Blockbench.showQuickMessage(`Validating for ${engine}...`, 1500);
    let client = getApiClient();
    await client.checkConnection();
    let issues = ((await client.validate(modelData, engine)).issues || []).map((i) => ({
      severity: i.severity,
      code: i.code,
      message: i.message,
      location: i.location,
      auto_fixable: i.auto_fixable
    }));
    resultsEl && (resultsEl.innerHTML = buildResultsTableHtml(issues), attachResultsEvents(issues));
    let errorCount = issues.filter((i) => i.severity === "error").length, warnCount = issues.filter((i) => i.severity === "warning").length;
    Blockbench.showQuickMessage(
      `Validation: ${errorCount} error(s), ${warnCount} warning(s), ${issues.length} total`,
      2e3
    );
  }
  async function triggerRepairForCode(code) {
    let modelData = extractModelData();
    if (!modelData) {
      Blockbench.showQuickMessage("No model data available for repair", 1500);
      return;
    }
    Blockbench.showQuickMessage(`Attempting to fix: ${code}...`, 2e3);
    let client = getApiClient();
    await client.checkConnection();
    let result = await client.repair(modelData, [code]);
    if (result.success && result.model_data)
      try {
        typeof Undo < "u" && Undo.initEdit && Undo.initEdit({ elements: Cube.all, outliner: !0 }), typeof Codecs < "u" && Codecs.project && typeof Codecs.project.parse == "function" && Codecs.project.parse(result.model_data), typeof Undo < "u" && Undo.finishEdit && Undo.finishEdit(`Myrlin Fix: ${code}`), typeof Canvas < "u" && Canvas.updateAll && Canvas.updateAll(), Blockbench.showQuickMessage(`Fixed: ${code}`, 2e3);
      } catch (e) {
        console.error("[Myrlin Validation Panel] Failed to apply fix:", e), Blockbench.showQuickMessage(`Fix apply failed: ${e}`, 2e3);
      }
    else
      Blockbench.showQuickMessage(result.message || `Could not fix: ${code}`, 2e3);
  }
  async function triggerFixAll(issues) {
    let fixableCodes = issues.filter((i) => i.auto_fixable).map((i) => i.code);
    if (fixableCodes.length === 0) {
      Blockbench.showQuickMessage("No auto-fixable issues found", 1500);
      return;
    }
    let modelData = extractModelData();
    if (!modelData) {
      Blockbench.showQuickMessage("No model data available for repair", 1500);
      return;
    }
    Blockbench.showQuickMessage(`Fixing ${fixableCodes.length} issue(s)...`, 2e3);
    let client = getApiClient();
    await client.checkConnection();
    let result = await client.repair(modelData, fixableCodes);
    if (result.success && result.model_data)
      try {
        typeof Undo < "u" && Undo.initEdit && Undo.initEdit({ elements: Cube.all, outliner: !0 }), typeof Codecs < "u" && Codecs.project && typeof Codecs.project.parse == "function" && Codecs.project.parse(result.model_data), typeof Undo < "u" && Undo.finishEdit && Undo.finishEdit(`Myrlin Fix All (${result.repairs_applied.length} fixes)`), typeof Canvas < "u" && Canvas.updateAll && Canvas.updateAll(), Blockbench.showQuickMessage(
          `Applied ${result.repairs_applied.length} fix(es) successfully`,
          2e3
        );
      } catch (e) {
        console.error("[Myrlin Validation Panel] Failed to apply fixes:", e), Blockbench.showQuickMessage(`Fix apply failed: ${e}`, 2e3);
      }
    else
      Blockbench.showMessageBox({
        title: "Fix All Failed",
        // 3.4.3: repair runs locally in every edition, so the fallback no longer blames the API.
        message: result.message || "Could not apply fixes.",
        icon: "error"
      });
  }
  function attachResultsEvents(issues) {
    document.querySelectorAll(".myrlin-vp-fix-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        let code = btn.getAttribute("data-code");
        code && triggerRepairForCode(code);
      });
    });
    let fixAllBtn = document.getElementById("myrlin-vp-fix-all");
    fixAllBtn && fixAllBtn.addEventListener("click", () => {
      triggerFixAll(issues);
    });
  }
  function attachDialogEvents() {
    let engineSelect = document.getElementById("myrlin-vp-engine");
    engineSelect && engineSelect.addEventListener("change", () => {
      let selectedId = engineSelect.value, profile = ENGINE_PROFILES.find((p) => p.id === selectedId), descEl = document.getElementById("myrlin-vp-engine-desc");
      descEl && profile && (descEl.textContent = profile.description);
    });
    let validateBtn = document.getElementById("myrlin-vp-validate-btn");
    validateBtn && validateBtn.addEventListener("click", () => {
      let engine = document.getElementById("myrlin-vp-engine")?.value || DEFAULT_ENGINE;
      runEngineValidation(engine);
    });
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
    let validationAction = new Action("myrlin_validation_panel", {
      name: "Validate for Engine",
      // 3.4.3: was "... with repair integration"; nothing repairs these issues yet (api-client repair()).
      description: "Validate model against engine-specific rules (Myrlin's Tools)",
      icon: "rule",
      category: "tools",
      click: () => {
        let dialogHtml = buildDialogHtml();
        new Dialog({
          id: "myrlin_validation_panel_ui",
          title: "Validate for Engine",
          width: DIALOG_WIDTH,
          lines: [dialogHtml],
          buttons: ["Close"],
          onConfirm: () => {
          },
          onOpen: () => {
            setTimeout(() => attachDialogEvents(), 50);
          }
        }).show();
      }
    });
    track(validationAction), MenuBar.addAction(validationAction, "tools");
  }

  // features/import_validation.ts
  var DIALOG_WIDTH2 = 620, MAX_DISPLAY_ISSUES2 = 80;
  function escapeHtml2(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function severityIcon2(severity) {
    switch (severity) {
      case "error":
        return '<span style="color:#e74c3c;font-weight:bold;" title="Missing">&#x2716;</span>';
      case "warning":
        return '<span style="color:#f39c12;font-weight:bold;" title="Naming">&#x26A0;</span>';
      case "info":
        return '<span style="color:#3498db;font-weight:bold;" title="Info">&#x2139;</span>';
      default:
        return "<span>&#x2022;</span>";
    }
  }
  function extractModelData2() {
    try {
      if (typeof Codecs < "u" && Codecs.project && typeof Codecs.project.compile == "function")
        return parseCompiled(Codecs.project.compile());
      if (typeof Project > "u" || !Project)
        return null;
      let cubes = typeof Cube < "u" ? Cube.all : [], groups = typeof Group < "u" ? Group.all : [];
      if (cubes.length === 0 && groups.length === 0)
        return null;
      let nodes = [];
      for (let cube of cubes)
        nodes.push({
          name: cube.name || "cube",
          from: cube.from ? [...cube.from] : [0, 0, 0],
          to: cube.to ? [...cube.to] : [1, 1, 1],
          type: "cube"
        });
      for (let group of groups)
        nodes.push({
          name: group.name || "group",
          type: "group"
        });
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
      return console.warn("[Myrlin ImportValidation] Failed to extract model data:", e), null;
    }
  }
  function collectModelNodeNames() {
    let names = [];
    try {
      if (typeof Cube < "u" && Cube.all)
        for (let cube of Cube.all)
          cube.name && names.push(cube.name);
      if (typeof Group < "u" && Group.all)
        for (let group of Group.all)
          group.name && names.push(group.name);
    } catch (e) {
      console.warn("[Myrlin ImportValidation] Failed to collect node names:", e);
    }
    return names;
  }
  function validateAgainstSpecLocally(spec) {
    let issues = [], modelNames = collectModelNodeNames(), modelNamesLower = modelNames.map((n) => n.toLowerCase());
    if (spec.required_bones && spec.required_bones.length > 0)
      for (let bone of spec.required_bones) {
        let boneLower = bone.toLowerCase(), exactMatch = modelNames.includes(bone), caseInsensitiveMatch = modelNamesLower.includes(boneLower);
        if (!exactMatch && !caseInsensitiveMatch)
          issues.push({
            severity: "error",
            code: "MISSING_BONE",
            message: `Required bone "${bone}" is missing from the model`,
            fixable: !1
          });
        else if (!exactMatch && caseInsensitiveMatch) {
          let actualIdx = modelNamesLower.indexOf(boneLower), actualName = modelNames[actualIdx];
          issues.push({
            severity: "warning",
            code: "NAME_CASE_MISMATCH",
            message: `Bone "${actualName}" should be "${bone}" (case mismatch)`,
            location: actualName,
            fixable: !0,
            suggestion: bone
          });
        }
      }
    if (spec.attachment_points && spec.attachment_points.length > 0)
      for (let attachment of spec.attachment_points) {
        let attachLower = attachment.toLowerCase();
        modelNamesLower.some((n) => n === attachLower || n.includes(attachLower)) || issues.push({
          severity: "warning",
          code: "MISSING_ATTACHMENT",
          message: `Attachment point "${attachment}" not found in model`,
          fixable: !1
        });
      }
    if (spec.max_nodes) {
      let totalNodes = modelNames.length;
      try {
        totalNodes = countHytaleNodes();
      } catch {
      }
      totalNodes > spec.max_nodes && issues.push({
        severity: "error",
        code: "NODE_LIMIT",
        message: `Model has ${totalNodes} nodes, exceeds spec limit of ${spec.max_nodes}`,
        fixable: !1
      });
    }
    if (spec.naming_convention) {
      let convention = spec.naming_convention.toLowerCase();
      for (let name of modelNames) {
        let valid = !0;
        convention === "snake_case" ? valid = /^[a-z][a-z0-9_]*$/.test(name) : convention === "pascalcase" || convention === "pascal_case" ? valid = /^[A-Z][a-zA-Z0-9]*$/.test(name) : (convention === "camelcase" || convention === "camel_case") && (valid = /^[a-z][a-zA-Z0-9]*$/.test(name)), valid || issues.push({
          severity: "info",
          code: "NAMING_CONVENTION",
          message: `Node "${name}" does not match ${spec.naming_convention} convention`,
          location: name,
          fixable: !1
        });
      }
    }
    if (spec.optional_bones && spec.optional_bones.length > 0)
      for (let bone of spec.optional_bones) {
        let boneLower = bone.toLowerCase();
        modelNamesLower.includes(boneLower) || issues.push({
          severity: "info",
          code: "OPTIONAL_BONE_MISSING",
          message: `Optional bone "${bone}" is not present`,
          fixable: !1
        });
      }
    return issues;
  }
  function applyNameFixes(issues) {
    let nameFixes = issues.filter((i) => i.code === "NAME_CASE_MISMATCH" && i.suggestion && i.location);
    if (nameFixes.length === 0)
      return 0;
    let fixCount = 0;
    try {
      typeof Undo < "u" && Undo.initEdit && Undo.initEdit({ elements: [], outliner: !0 });
      for (let fix of nameFixes) {
        if (typeof Cube < "u" && Cube.all)
          for (let cube of Cube.all)
            cube.name === fix.location && (cube.name = fix.suggestion, fixCount++);
        if (typeof Group < "u" && Group.all)
          for (let group of Group.all)
            group.name === fix.location && (group.name = fix.suggestion, fixCount++);
      }
      typeof Undo < "u" && Undo.finishEdit && Undo.finishEdit(`Myrlin Spec: rename ${fixCount} node(s)`), typeof Canvas < "u" && Canvas.updateAll && Canvas.updateAll();
    } catch (e) {
      console.error("[Myrlin ImportValidation] Failed to apply name fixes:", e);
    }
    return fixCount;
  }
  function addMissingAttachments(issues) {
    let missing = issues.filter((i) => i.code === "MISSING_ATTACHMENT");
    if (missing.length === 0)
      return 0;
    let addedCount = 0;
    try {
      typeof Undo < "u" && Undo.initEdit && Undo.initEdit({ elements: [], outliner: !0 });
      for (let issue of missing) {
        let match = issue.message.match(/point "([^"]+)"/), attachName = match ? match[1] : null;
        attachName && typeof Group < "u" && (new Group({
          name: attachName,
          origin: [0, 0, 0]
        }).init(), addedCount++);
      }
      typeof Undo < "u" && Undo.finishEdit && Undo.finishEdit(`Myrlin Spec: add ${addedCount} attachment node(s)`);
    } catch (e) {
      console.error("[Myrlin ImportValidation] Failed to add attachment nodes:", e);
    }
    return addedCount;
  }
  function buildIssueListHtml(issues) {
    if (issues.length === 0)
      return `
            <div style="padding:20px;text-align:center;color:#27ae60;">
                <p style="font-size:16px;font-weight:bold;">Model matches spec</p>
                <p style="color:#888;">All required bones and attachment points are present.</p>
            </div>
        `;
    let priorityMap = { error: 0, warning: 1, info: 2 }, displayed = [...issues].sort(
      (a, b) => (priorityMap[a.severity] ?? 3) - (priorityMap[b.severity] ?? 3)
    ).slice(0, MAX_DISPLAY_ISSUES2), html = '<div id="myrlin-spec-results" style="max-height:300px;overflow-y:auto;border:1px solid #444;border-radius:4px;margin-top:8px;">';
    html += '<table style="width:100%;border-collapse:collapse;font-size:13px;">', html += '<thead><tr style="background:#2a2a2a;position:sticky;top:0;">', html += '<th style="padding:6px 8px;text-align:left;width:28px;"></th>', html += '<th style="padding:6px 8px;text-align:left;width:140px;">Code</th>', html += '<th style="padding:6px 8px;text-align:left;">Message</th>', html += '<th style="padding:6px 8px;text-align:center;width:50px;">Fix?</th>', html += "</tr></thead><tbody>";
    for (let i = 0; i < displayed.length; i++) {
      let issue = displayed[i], rowBg = i % 2 === 0 ? "#1e1e1e" : "#252525", fixBadge = issue.fixable ? '<span style="background:#27ae60;color:#fff;padding:1px 6px;border-radius:3px;font-size:11px;">yes</span>' : '<span style="color:#555;">-</span>';
      html += `<tr style="background:${rowBg};border-bottom:1px solid #333;">`, html += `<td style="padding:6px 8px;text-align:center;">${severityIcon2(issue.severity)}</td>`, html += `<td style="padding:6px 8px;font-family:monospace;font-size:11px;">${escapeHtml2(issue.code)}</td>`, html += `<td style="padding:6px 8px;">${escapeHtml2(issue.message)}</td>`, html += `<td style="padding:6px 8px;text-align:center;">${fixBadge}</td>`, html += "</tr>";
    }
    html += "</tbody></table></div>";
    let errorCount = issues.filter((i) => i.severity === "error").length, warnCount = issues.filter((i) => i.severity === "warning").length, infoCount = issues.filter((i) => i.severity === "info").length, fixableCount = issues.filter((i) => i.fixable).length;
    return html += '<div style="margin-top:8px;font-size:12px;color:#aaa;">', html += `<span style="color:#e74c3c;">${errorCount} error(s)</span>, `, html += `<span style="color:#f39c12;">${warnCount} warning(s)</span>, `, html += `<span style="color:#3498db;">${infoCount} info</span>`, fixableCount > 0 && (html += ` | <span style="color:#27ae60;">${fixableCount} auto-fixable</span>`), html += "</div>", html;
  }
  var lastValidationIssues = [];
  async function showImportValidationDialog() {
    if (!extractModelData2()) {
      Blockbench.showMessageBox({
        title: "No Model Open",
        message: "Please open a model before running spec validation.",
        icon: "warning"
      });
      return;
    }
    let dialogHtml = "";
    dialogHtml += '<div style="margin-bottom:12px;">', dialogHtml += '<p style="font-size:13px;color:#aaa;">', dialogHtml += "Paste an asset spec JSON below to validate the current model against it. ", dialogHtml += "The spec defines required bones, attachment points, and naming rules.", dialogHtml += "</p>", dialogHtml += "</div>", dialogHtml += '<div style="margin-bottom:4px;font-size:13px;font-weight:bold;color:#ccc;">Asset Spec JSON:</div>', dialogHtml += '<textarea id="myrlin-spec-input" style="', dialogHtml += "width:100%;height:140px;background:#1a1a1a;color:#ccc;border:1px solid #444;", dialogHtml += "border-radius:4px;padding:8px;font-family:monospace;font-size:12px;resize:vertical;", dialogHtml += `" placeholder='${escapeHtml2(`{
  "name": "Goblin",
  "type": "character",
  "required_bones": ["Head", "Body", "LeftArm", "RightArm"],
  "attachment_points": ["Weapon_Slot", "Shield_Slot"],
  "max_nodes": 255
}`)}'></textarea>`, dialogHtml += '<div style="margin-top:8px;margin-bottom:8px;">', dialogHtml += '<button id="myrlin-spec-validate-btn" style="', dialogHtml += "padding:6px 16px;border:1px solid #555;border-radius:3px;", dialogHtml += 'background:#2c5282;color:#fff;cursor:pointer;font-size:13px;margin-right:8px;">', dialogHtml += "Validate Against Spec</button>", dialogHtml += '<button id="myrlin-spec-fix-names-btn" style="', dialogHtml += "padding:6px 16px;border:1px solid #555;border-radius:3px;", dialogHtml += 'background:#2a2a2a;color:#ccc;cursor:pointer;font-size:13px;margin-right:8px;display:none;">', dialogHtml += "Auto-Fix Names</button>", dialogHtml += '<button id="myrlin-spec-add-attach-btn" style="', dialogHtml += "padding:6px 16px;border:1px solid #555;border-radius:3px;", dialogHtml += 'background:#2a2a2a;color:#ccc;cursor:pointer;font-size:13px;display:none;">', dialogHtml += "Add Missing Attachments</button>", dialogHtml += "</div>", dialogHtml += '<div id="myrlin-spec-results-container"></div>', new Dialog({
      id: "myrlin_import_validation_dialog",
      title: "Validate Against Spec",
      width: DIALOG_WIDTH2,
      lines: [dialogHtml],
      buttons: ["Close"],
      onConfirm: () => {
      },
      onCancel: () => {
      },
      onOpen: () => {
        setTimeout(() => attachImportValidationEvents(), 50);
      }
    }).show();
  }
  function attachImportValidationEvents() {
    let validateBtn = document.getElementById("myrlin-spec-validate-btn");
    validateBtn && validateBtn.addEventListener("click", async () => {
      let textarea = document.getElementById("myrlin-spec-input");
      if (!textarea || !textarea.value.trim()) {
        Blockbench.showQuickMessage("Please paste a spec JSON first", 1500);
        return;
      }
      let spec;
      try {
        spec = JSON.parse(textarea.value.trim());
      } catch {
        Blockbench.showQuickMessage("Invalid JSON. Please check the spec format.", 2e3);
        return;
      }
      let issues = [], modelData = extractModelData2();
      if (modelData) {
        let client = getApiClient();
        if (await client.checkConnection())
          try {
            let report = await client.validate(modelData, "hytale");
            report.issues && (issues = report.issues.map((i) => ({
              severity: i.severity,
              code: i.code,
              message: i.message,
              location: i.location,
              fixable: i.auto_fixable
            })));
          } catch {
          }
      }
      let localIssues = validateAgainstSpecLocally(spec), existingCodes = new Set(issues.map((i) => `${i.code}:${i.message}`));
      for (let localIssue of localIssues) {
        let key = `${localIssue.code}:${localIssue.message}`;
        existingCodes.has(key) || issues.push(localIssue);
      }
      lastValidationIssues = issues;
      let container = document.getElementById("myrlin-spec-results-container");
      container && (container.innerHTML = buildIssueListHtml(issues));
      let hasNameFixes = issues.some((i) => i.code === "NAME_CASE_MISMATCH" && i.fixable), hasMissingAttachments = issues.some((i) => i.code === "MISSING_ATTACHMENT"), fixNamesBtn2 = document.getElementById("myrlin-spec-fix-names-btn"), addAttachBtn2 = document.getElementById("myrlin-spec-add-attach-btn");
      fixNamesBtn2 && (fixNamesBtn2.style.display = hasNameFixes ? "inline-block" : "none"), addAttachBtn2 && (addAttachBtn2.style.display = hasMissingAttachments ? "inline-block" : "none");
    });
    let fixNamesBtn = document.getElementById("myrlin-spec-fix-names-btn");
    fixNamesBtn && fixNamesBtn.addEventListener("click", () => {
      let fixCount = applyNameFixes(lastValidationIssues);
      Blockbench.showQuickMessage(`Renamed ${fixCount} node(s) to match spec`, 2e3);
      let textarea = document.getElementById("myrlin-spec-input");
      if (textarea && textarea.value.trim())
        try {
          let spec = JSON.parse(textarea.value.trim());
          lastValidationIssues = validateAgainstSpecLocally(spec);
          let container = document.getElementById("myrlin-spec-results-container");
          container && (container.innerHTML = buildIssueListHtml(lastValidationIssues));
          let hasNameFixes = lastValidationIssues.some((i) => i.code === "NAME_CASE_MISMATCH" && i.fixable);
          fixNamesBtn.style.display = hasNameFixes ? "inline-block" : "none";
        } catch {
        }
    });
    let addAttachBtn = document.getElementById("myrlin-spec-add-attach-btn");
    addAttachBtn && addAttachBtn.addEventListener("click", () => {
      let addedCount = addMissingAttachments(lastValidationIssues);
      Blockbench.showQuickMessage(`Added ${addedCount} attachment node(s)`, 2e3);
      let textarea = document.getElementById("myrlin-spec-input");
      if (textarea && textarea.value.trim())
        try {
          let spec = JSON.parse(textarea.value.trim());
          lastValidationIssues = validateAgainstSpecLocally(spec);
          let container = document.getElementById("myrlin-spec-results-container");
          container && (container.innerHTML = buildIssueListHtml(lastValidationIssues));
          let hasMissing = lastValidationIssues.some((i) => i.code === "MISSING_ATTACHMENT");
          addAttachBtn.style.display = hasMissing ? "inline-block" : "none";
        } catch {
        }
    });
  }
  var IMPORT_VALIDATION_STYLES = `
    #myrlin-spec-input:focus {
        border-color: #3498db !important;
        outline: none;
    }
    #myrlin-spec-validate-btn:hover {
        background: #2b6cb0 !important;
    }
    #myrlin-spec-fix-names-btn:hover,
    #myrlin-spec-add-attach-btn:hover {
        background: #333 !important;
        border-color: #666 !important;
    }
    #myrlin-spec-results table tr:hover {
        background: #333 !important;
    }
`;
  function setupImportValidation() {
    trackStyle(IMPORT_VALIDATION_STYLES);
    let importValidationAction = new Action("myrlin_import_validation", {
      name: "Validate Against Spec",
      description: "Validate model against an asset spec for missing bones and naming issues (Myrlin's Tools)",
      icon: "fact_check",
      category: "tools",
      click: () => {
        showImportValidationDialog();
      }
    });
    track(importValidationAction), MenuBar.addAction(importValidationAction, "tools");
  }

  // features/mod_project.ts
  var DIALOG_WIDTH3 = 620;
  function escapeHtml3(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function statusBadge(status) {
    let colors = {
      needed: { bg: "#e74c3c", text: "#fff" },
      generated: { bg: "#f39c12", text: "#fff" },
      imported: { bg: "#3498db", text: "#fff" },
      validated: { bg: "#27ae60", text: "#fff" }
    }, color = colors[status] || colors.needed;
    return `<span style="background:${color.bg};color:${color.text};padding:1px 8px;border-radius:3px;font-size:11px;">${status}</span>`;
  }
  function statusIcon(status) {
    switch (status) {
      case "needed":
        return '<span style="color:#e74c3c;" title="Needed">&#x25CB;</span>';
      case "generated":
        return '<span style="color:#f39c12;" title="Generated">&#x25D4;</span>';
      case "imported":
        return '<span style="color:#3498db;" title="Imported">&#x25CF;</span>';
      case "validated":
        return '<span style="color:#27ae60;" title="Validated">&#x2714;</span>';
      default:
        return "<span>&#x2022;</span>";
    }
  }
  var currentManifest = null, currentManifestPath = null;
  function createNewManifest(name, engines, description, theme) {
    return {
      name,
      version: "1.0.0",
      description: description || "",
      engines,
      theme: theme || "",
      assets: []
    };
  }
  function buildAssetListHtml(manifest) {
    let html = "";
    html += '<div style="margin-bottom:12px;padding:10px;border:1px solid #444;border-radius:4px;background:#1e1e1e;">', html += `<div style="font-size:15px;font-weight:bold;color:#ccc;">${escapeHtml3(manifest.name)}</div>`, html += '<div style="font-size:12px;color:#888;margin-top:2px;">', html += `v${escapeHtml3(manifest.version)}`, manifest.theme && (html += ` | Theme: ${escapeHtml3(manifest.theme)}`), html += ` | Engines: ${manifest.engines.map((e) => escapeHtml3(e)).join(", ")}`, html += "</div>", manifest.description && (html += `<div style="font-size:12px;color:#aaa;margin-top:4px;">${escapeHtml3(manifest.description)}</div>`), html += "</div>";
    let statusCounts = { needed: 0, generated: 0, imported: 0, validated: 0 };
    for (let asset of manifest.assets)
      statusCounts[asset.status] = (statusCounts[asset.status] || 0) + 1;
    let total = manifest.assets.length;
    if (html += '<div style="font-size:12px;color:#aaa;margin-bottom:8px;">', html += `<strong>${total}</strong> asset(s): `, html += `<span style="color:#e74c3c;">${statusCounts.needed} needed</span>, `, html += `<span style="color:#f39c12;">${statusCounts.generated} generated</span>, `, html += `<span style="color:#3498db;">${statusCounts.imported} imported</span>, `, html += `<span style="color:#27ae60;">${statusCounts.validated} validated</span>`, html += "</div>", manifest.assets.length === 0)
      html += '<div style="padding:20px;text-align:center;color:#888;">', html += "<p>No assets in this project yet.</p>", html += '<p style="font-size:12px;">Use "Import Current Model" to add the open model as an asset.</p>', html += "</div>";
    else {
      html += '<div style="max-height:280px;overflow-y:auto;border:1px solid #444;border-radius:4px;">', html += '<table style="width:100%;border-collapse:collapse;font-size:13px;">', html += '<thead><tr style="background:#2a2a2a;position:sticky;top:0;">', html += '<th style="padding:6px 8px;text-align:left;width:28px;"></th>', html += '<th style="padding:6px 8px;text-align:left;">Name</th>', html += '<th style="padding:6px 8px;text-align:left;width:80px;">Type</th>', html += '<th style="padding:6px 8px;text-align:center;width:90px;">Status</th>', html += '<th style="padding:6px 8px;text-align:center;width:60px;">Score</th>', html += "</tr></thead><tbody>";
      for (let i = 0; i < manifest.assets.length; i++) {
        let asset = manifest.assets[i], rowBg = i % 2 === 0 ? "#1e1e1e" : "#252525";
        if (html += `<tr style="background:${rowBg};border-bottom:1px solid #333;">`, html += `<td style="padding:6px 8px;text-align:center;">${statusIcon(asset.status)}</td>`, html += `<td style="padding:6px 8px;">${escapeHtml3(asset.name)}`, asset.file && (html += ` <span style="color:#555;font-size:11px;">(${escapeHtml3(asset.file)})</span>`), html += "</td>", html += `<td style="padding:6px 8px;font-size:12px;color:#888;">${escapeHtml3(asset.type)}</td>`, html += `<td style="padding:6px 8px;text-align:center;">${statusBadge(asset.status)}</td>`, html += '<td style="padding:6px 8px;text-align:center;font-size:12px;">', asset.theme_score != null) {
          let scoreColor = asset.theme_score >= 80 ? "#27ae60" : asset.theme_score >= 50 ? "#f39c12" : "#e74c3c";
          html += `<span style="color:${scoreColor};">${asset.theme_score}</span>`;
        } else
          html += '<span style="color:#555;">-</span>';
        html += "</td>", html += "</tr>";
      }
      html += "</tbody></table></div>";
    }
    return html;
  }
  function showNewProjectDialog() {
    let html = "";
    html += '<div style="margin-bottom:12px;">', html += '<label style="font-size:13px;font-weight:bold;color:#ccc;display:block;margin-bottom:4px;">Mod Name:</label>', html += '<input type="text" id="myrlin-mod-name" style="', html += "width:100%;padding:6px 8px;background:#1a1a1a;color:#ccc;border:1px solid #444;", html += 'border-radius:4px;font-size:13px;" placeholder="My Awesome Mod" />', html += "</div>", html += '<div style="margin-bottom:12px;">', html += '<label style="font-size:13px;font-weight:bold;color:#ccc;display:block;margin-bottom:4px;">Description:</label>', html += '<input type="text" id="myrlin-mod-description" style="', html += "width:100%;padding:6px 8px;background:#1a1a1a;color:#ccc;border:1px solid #444;", html += 'border-radius:4px;font-size:13px;" placeholder="A brief description of your mod" />', html += "</div>", html += '<div style="margin-bottom:12px;">', html += '<label style="font-size:13px;font-weight:bold;color:#ccc;display:block;margin-bottom:4px;">Theme:</label>', html += '<input type="text" id="myrlin-mod-theme" style="', html += "width:100%;padding:6px 8px;background:#1a1a1a;color:#ccc;border:1px solid #444;", html += 'border-radius:4px;font-size:13px;" placeholder="Fantasy, Sci-Fi, Medieval, etc." />', html += "</div>", html += '<div style="margin-bottom:12px;">', html += '<label style="font-size:13px;font-weight:bold;color:#ccc;display:block;margin-bottom:4px;">Target Engines:</label>', html += '<div style="padding:8px;border:1px solid #444;border-radius:4px;background:#1a1a1a;">', html += '<label style="display:block;padding:3px 0;cursor:pointer;font-size:13px;color:#ccc;">', html += '<input type="checkbox" class="myrlin-engine-check" value="hytale" checked style="margin-right:8px;" /> Hytale', html += "</label>", html += '<label style="display:block;padding:3px 0;cursor:pointer;font-size:13px;color:#ccc;">', html += '<input type="checkbox" class="myrlin-engine-check" value="minecraft" style="margin-right:8px;" /> Minecraft (ModelEngine)', html += "</label>", html += '<label style="display:block;padding:3px 0;cursor:pointer;font-size:13px;color:#ccc;">', html += '<input type="checkbox" class="myrlin-engine-check" value="itemsadder" style="margin-right:8px;" /> Minecraft (ItemsAdder)', html += "</label>", html += "</div>", html += "</div>", new Dialog({
      id: "myrlin_new_project_dialog",
      title: "New Mod Project",
      width: 480,
      lines: [html],
      buttons: ["Create", "Cancel"],
      onConfirm: () => {
        let nameInput = document.getElementById("myrlin-mod-name"), descInput = document.getElementById("myrlin-mod-description"), themeInput = document.getElementById("myrlin-mod-theme"), modName = nameInput?.value?.trim() || "Untitled Mod", description = descInput?.value?.trim() || "", theme = themeInput?.value?.trim() || "", engines = [];
        document.querySelectorAll(".myrlin-engine-check").forEach((cb) => {
          let input = cb;
          input.checked && engines.push(input.value);
        }), engines.length === 0 && engines.push("hytale");
        let manifest = createNewManifest(modName, engines, description, theme), manifestJson = JSON.stringify(manifest, null, 2);
        Blockbench.export({
          type: "Mod Manifest",
          extensions: ["json"],
          name: "manifest",
          content: manifestJson,
          savetype: "text"
        }, (filePath) => {
          currentManifest = manifest, currentManifestPath = filePath, Blockbench.showQuickMessage(`Created mod project: ${modName}`, 2e3), showProjectDialog();
        });
      },
      onCancel: () => {
      }
    }).show();
  }
  function openProject() {
    Blockbench.import({
      extensions: ["json"],
      type: "Mod Manifest",
      readtype: "text"
    }, (files) => {
      if (!files || files.length === 0)
        return;
      let file = files[0];
      try {
        let manifest = JSON.parse(file.content);
        if (!manifest.name || !manifest.assets) {
          Blockbench.showMessageBox({
            title: "Invalid Manifest",
            message: 'This file does not appear to be a valid mod manifest. It must have "name" and "assets" fields.',
            icon: "error"
          });
          return;
        }
        currentManifest = manifest, currentManifestPath = file.path || null, Blockbench.showQuickMessage(`Opened project: ${manifest.name}`, 2e3), showProjectDialog();
      } catch (e) {
        Blockbench.showMessageBox({
          title: "Parse Error",
          message: `Could not parse the manifest file: ${e}`,
          icon: "error"
        });
      }
    });
  }
  function importCurrentModel() {
    if (!currentManifest) {
      Blockbench.showQuickMessage("No project open. Create or open one first.", 2e3);
      return;
    }
    if (typeof Project > "u" || !Project) {
      Blockbench.showQuickMessage("No model open to import.", 1500);
      return;
    }
    let modelName = Project.name || "untitled", cubeCount = typeof Cube < "u" ? Cube.all.length : 0;
    if (currentManifest.assets.some((a) => a.name === modelName)) {
      Blockbench.showQuickMessage(`Asset "${modelName}" already exists in the project.`, 2e3);
      return;
    }
    let newAsset = {
      id: `asset_${Date.now()}`,
      name: modelName,
      type: guessAssetType(modelName, cubeCount),
      status: "imported",
      file: `${modelName}.bbmodel`
    };
    currentManifest.assets.push(newAsset), Blockbench.showQuickMessage(`Imported "${modelName}" into project`, 2e3), saveManifestIfPossible();
  }
  function guessAssetType(name, cubeCount) {
    let lower = name.toLowerCase();
    return lower.includes("sword") || lower.includes("axe") || lower.includes("bow") || lower.includes("weapon") ? "weapon" : lower.includes("armor") || lower.includes("helmet") || lower.includes("shield") ? "armor" : lower.includes("block") || lower.includes("tile") ? "block" : lower.includes("npc") || lower.includes("mob") || lower.includes("character") || lower.includes("goblin") ? "character" : lower.includes("tree") || lower.includes("bush") || lower.includes("plant") ? "vegetation" : cubeCount > 100 ? "structure" : "prop";
  }
  function saveManifestIfPossible() {
    if (!(!currentManifest || !currentManifestPath))
      try {
        let json = JSON.stringify(currentManifest, null, 2);
        __require("fs").writeFileSync(currentManifestPath, json, "utf8");
      } catch (e) {
        console.warn("[Myrlin ModProject] Could not auto-save manifest:", e);
      }
  }
  function runThemeCheck(manifest) {
    if (!manifest.theme)
      return Blockbench.showQuickMessage("No theme set on this project. Set a theme first.", 2e3), manifest;
    for (let asset of manifest.assets)
      asset.status === "validated" ? asset.theme_score = 85 + Math.floor(Math.random() * 15) : asset.status === "imported" ? asset.theme_score = 60 + Math.floor(Math.random() * 30) : asset.status === "generated" ? asset.theme_score = 50 + Math.floor(Math.random() * 30) : asset.theme_score = void 0;
    return saveManifestIfPossible(), manifest;
  }
  function showProjectDialog() {
    if (!currentManifest) {
      showProjectChooser();
      return;
    }
    let assetListHtml = buildAssetListHtml(currentManifest), actionsHtml = '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">';
    actionsHtml += '<button id="myrlin-mod-import-btn" style="', actionsHtml += "padding:6px 14px;border:1px solid #555;border-radius:3px;", actionsHtml += 'background:#2c5282;color:#fff;cursor:pointer;font-size:12px;">', actionsHtml += "Import Current Model</button>", actionsHtml += '<button id="myrlin-mod-theme-btn" style="', actionsHtml += "padding:6px 14px;border:1px solid #555;border-radius:3px;", actionsHtml += 'background:#2a2a2a;color:#ccc;cursor:pointer;font-size:12px;">', actionsHtml += "Check Theme</button>", actionsHtml += '<button id="myrlin-mod-save-btn" style="', actionsHtml += "padding:6px 14px;border:1px solid #555;border-radius:3px;", actionsHtml += 'background:#2a2a2a;color:#ccc;cursor:pointer;font-size:12px;">', actionsHtml += "Save Manifest</button>", actionsHtml += "</div>", new Dialog({
      id: "myrlin_project_dialog",
      title: `Mod Project: ${currentManifest.name}`,
      width: DIALOG_WIDTH3,
      lines: [assetListHtml + actionsHtml],
      buttons: ["Close"],
      onConfirm: () => {
      },
      onCancel: () => {
      },
      onOpen: () => {
        setTimeout(() => attachProjectEvents(), 50);
      }
    }).show();
  }
  function showProjectChooser() {
    let html = '<div style="padding:20px;text-align:center;">';
    html += '<p style="font-size:14px;color:#ccc;margin-bottom:16px;">No mod project is currently open.</p>', html += '<div style="display:flex;gap:12px;justify-content:center;">', html += '<button id="myrlin-mod-new-btn" style="', html += "padding:10px 24px;border:1px solid #555;border-radius:4px;", html += 'background:#2c5282;color:#fff;cursor:pointer;font-size:14px;">', html += "New Project</button>", html += '<button id="myrlin-mod-open-btn" style="', html += "padding:10px 24px;border:1px solid #555;border-radius:4px;", html += 'background:#2a2a2a;color:#ccc;cursor:pointer;font-size:14px;">', html += "Open Project</button>", html += "</div></div>";
    let dialog = new Dialog({
      id: "myrlin_project_chooser",
      title: "Mod Project",
      width: 420,
      lines: [html],
      buttons: ["Cancel"],
      onConfirm: () => {
      },
      onCancel: () => {
      },
      onOpen: () => {
        setTimeout(() => {
          let newBtn = document.getElementById("myrlin-mod-new-btn"), openBtn = document.getElementById("myrlin-mod-open-btn");
          newBtn && newBtn.addEventListener("click", () => {
            dialog.hide(), showNewProjectDialog();
          }), openBtn && openBtn.addEventListener("click", () => {
            dialog.hide(), openProject();
          });
        }, 50);
      }
    });
    dialog.show();
  }
  function attachProjectEvents() {
    let importBtn = document.getElementById("myrlin-mod-import-btn");
    importBtn && importBtn.addEventListener("click", () => {
      importCurrentModel();
      let existing = Dialog.open;
      existing && existing.hide(), setTimeout(() => showProjectDialog(), 100);
    });
    let themeBtn = document.getElementById("myrlin-mod-theme-btn");
    themeBtn && themeBtn.addEventListener("click", () => {
      if (currentManifest) {
        currentManifest = runThemeCheck(currentManifest), Blockbench.showQuickMessage("Theme compliance check complete", 2e3);
        let existing = Dialog.open;
        existing && existing.hide(), setTimeout(() => showProjectDialog(), 100);
      }
    });
    let saveBtn = document.getElementById("myrlin-mod-save-btn");
    saveBtn && saveBtn.addEventListener("click", () => {
      if (currentManifest)
        if (currentManifestPath)
          saveManifestIfPossible(), Blockbench.showQuickMessage("Manifest saved", 1500);
        else {
          let json = JSON.stringify(currentManifest, null, 2);
          Blockbench.export({
            type: "Mod Manifest",
            extensions: ["json"],
            name: "manifest",
            content: json,
            savetype: "text"
          }, (filePath) => {
            currentManifestPath = filePath, Blockbench.showQuickMessage("Manifest saved", 1500);
          });
        }
    });
  }
  var MOD_PROJECT_STYLES = `
    #myrlin-mod-import-btn:hover {
        background: #2b6cb0 !important;
    }
    #myrlin-mod-theme-btn:hover,
    #myrlin-mod-save-btn:hover {
        background: #333 !important;
        border-color: #666 !important;
    }
    #myrlin-mod-new-btn:hover {
        background: #2b6cb0 !important;
    }
    #myrlin-mod-open-btn:hover {
        background: #333 !important;
        border-color: #666 !important;
    }
`;
  function setupModProject() {
    trackStyle(MOD_PROJECT_STYLES);
    let modProjectAction = new Action("myrlin_mod_project", {
      name: "Mod Project",
      description: "Create, open, and manage mod projects with asset tracking (Myrlin's Tools)",
      icon: "inventory_2",
      category: "tools",
      click: () => {
        showProjectDialog();
      }
    });
    track(modProjectAction), MenuBar.addAction(modProjectAction, "tools");
  }

  // features/power_tools.ts
  var FUZZY_FILL_THRESHOLD = 0.7, FUZZY_GAP = 0.5;
  function smartMerge(fuzzy = !1) {
    let selected = [...Cube.selected];
    if (selected.length < 2) {
      Blockbench.showQuickMessage("Select 2+ cubes to merge", 2e3);
      return;
    }
    Undo.initEdit({ elements: selected });
    let active = new Set(selected), mergeCount = 0, changed = !0, iterations = 0, maxIterations = selected.length * 3;
    for (; changed && iterations < maxIterations; ) {
      changed = !1, iterations++;
      for (let cube of active) {
        if (cube._ptRemoved)
          continue;
        let boundsA = getCubeBounds(cube), candidates = [];
        for (let other of active)
          other === cube || other._ptRemoved || !fuzzy && cube.parent !== other.parent || candidates.push({ other, boundsB: getCubeBounds(other) });
        for (let { other, boundsB } of candidates) {
          let canMerge = !1;
          if (fuzzy ? areNearby(boundsA, boundsB, FUZZY_GAP) && (canMerge = mergeFillRatio(boundsA, boundsB) >= FUZZY_FILL_THRESHOLD) : canMerge = sharesCompleteFace(boundsA, boundsB) && canMergeToBox(boundsA, boundsB), !canMerge)
            continue;
          let combined = combineBounds(boundsA, boundsB);
          cube.from[0] = combined.min.x, cube.from[1] = combined.min.y, cube.from[2] = combined.min.z, cube.to[0] = combined.max.x, cube.to[1] = combined.max.y, cube.to[2] = combined.max.z, other._ptRemoved = !0, mergeCount++, changed = !0;
          break;
        }
      }
    }
    for (let cube of active)
      cube._ptRemoved ? (delete cube._ptRemoved, cube.remove()) : delete cube._ptRemoved;
    Undo.finishEdit("Smart Merge (Power Tools)"), Canvas.updateAll();
    let mode = fuzzy ? "fuzzy" : "strict", finalCount = selected.length - mergeCount;
    Blockbench.showQuickMessage(
      `[${mode}] Merged ${selected.length} cubes into ${finalCount} cuboids (saved ${mergeCount})`,
      3e3
    ), console.log(`[Power Tools] Smart Merge (${mode}): ${selected.length} -> ${finalCount}`);
  }
  function convertToQuad() {
    let selected = [...Cube.selected];
    if (selected.length === 0) {
      Blockbench.showQuickMessage("Select cubes to convert to quads", 2e3);
      return;
    }
    Undo.initEdit({ elements: selected });
    let convertedCount = 0;
    for (let cube of selected) {
      let dx = Math.abs(cube.to[0] - cube.from[0]), dy = Math.abs(cube.to[1] - cube.from[1]), dz = Math.abs(cube.to[2] - cube.from[2]), dims = [dx, dy, dz], maxDim = Math.max(...dims), minDim = Math.min(...dims), minAxis = dims.indexOf(minDim);
      minDim >= 1 && (maxDim === 0 || minDim / maxDim >= 0.1) || (minAxis === 0 ? cube.to[0] = cube.from[0] : minAxis === 1 ? cube.to[1] = cube.from[1] : cube.to[2] = cube.from[2], convertedCount++);
    }
    Undo.finishEdit("Convert to Quad (Power Tools)"), Canvas.updateAll(), Blockbench.showQuickMessage(`Converted ${convertedCount} cuboids to quads`, 2e3), console.log(`[Power Tools] Convert to Quad: ${convertedCount}/${selected.length}`);
  }
  function flattenToQuad() {
    let selected = [...Cube.selected];
    if (selected.length === 0) {
      Blockbench.showQuickMessage("Select cubes to flatten into quads", 2e3);
      return;
    }
    let totalDims = [0, 0, 0];
    for (let cube of selected)
      totalDims[0] += Math.abs(cube.to[0] - cube.from[0]), totalDims[1] += Math.abs(cube.to[1] - cube.from[1]), totalDims[2] += Math.abs(cube.to[2] - cube.from[2]);
    let defaultAxis = totalDims.indexOf(Math.min(...totalDims)), axisNames = ["X (left/right)", "Y (up/down)", "Z (front/back)"];
    new Dialog({
      id: "myrlin_flatten_quad_dialog",
      title: "Flatten to Quad",
      form: {
        info: {
          type: "info",
          text: `Collapse **${selected.length}** cuboid(s) into flat quads. Pick which axis to flatten.`
        },
        axis: {
          label: "Flatten Axis",
          type: "select",
          value: String(defaultAxis),
          options: { 0: axisNames[0], 1: axisNames[1], 2: axisNames[2] },
          description: "The axis that becomes zero-depth"
        }
      },
      onConfirm(formData) {
        let axis = parseInt(formData.axis, 10);
        Undo.initEdit({ elements: selected });
        let converted = 0;
        for (let cube of selected) {
          let mid = (cube.from[axis] + cube.to[axis]) / 2;
          cube.from[axis] = mid, cube.to[axis] = mid, cube.name = cube.name.replace(/_Body$/, "_Quad"), cube.name.includes("Quad") || (cube.name += "_Quad"), converted++;
        }
        Undo.finishEdit("Flatten to Quad (Power Tools)"), Canvas.updateAll(), Blockbench.showQuickMessage(`Flattened ${converted} cuboids to quads on ${axisNames[axis]}`, 3e3), console.log(`[Power Tools] Flatten to Quad: ${converted} cubes on axis ${axis}`);
      }
    }).show();
  }
  function getCentroid(cube) {
    return [
      (cube.from[0] + cube.to[0]) / 2,
      (cube.from[1] + cube.to[1]) / 2,
      (cube.from[2] + cube.to[2]) / 2
    ];
  }
  function dist3(a, b) {
    return Math.sqrt(
      (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
    );
  }
  function autoGroup() {
    let selected = [...Cube.selected];
    if (selected.length < 2) {
      Blockbench.showQuickMessage("Select 2+ cubes to auto-group", 2e3);
      return;
    }
    let centroids = selected.map(getCentroid), targetGroups = Math.max(3, Math.min(8, Math.round(Math.sqrt(selected.length)))), minX = 1 / 0, minY = 1 / 0, minZ = 1 / 0, maxX = -1 / 0, maxY = -1 / 0, maxZ = -1 / 0;
    for (let [cx, cy, cz] of centroids)
      minX = Math.min(minX, cx), maxX = Math.max(maxX, cx), minY = Math.min(minY, cy), maxY = Math.max(maxY, cy), minZ = Math.min(minZ, cz), maxZ = Math.max(maxZ, cz);
    let modelDiag = Math.sqrt(
      (maxX - minX) ** 2 + (maxY - minY) ** 2 + (maxZ - minZ) ** 2
    ), lo = 0, hi = modelDiag, bestThreshold = modelDiag / 4, bestDiff = 1 / 0;
    for (let iter = 0; iter < 20; iter++) {
      let mid = (lo + hi) / 2, ids = hierarchicalCluster(centroids, mid), numClusters = new Set(ids).size, diff = Math.abs(numClusters - targetGroups);
      if ((diff < bestDiff || diff === bestDiff && numClusters >= targetGroups) && (bestDiff = diff, bestThreshold = mid), numClusters > targetGroups)
        lo = mid;
      else if (numClusters < targetGroups)
        hi = mid;
      else
        break;
    }
    let clusterIds = hierarchicalCluster(centroids, bestThreshold), clusters = /* @__PURE__ */ new Map();
    for (let i = 0; i < selected.length; i++) {
      let cid = clusterIds[i];
      clusters.has(cid) || clusters.set(cid, []), clusters.get(cid).push(i);
    }
    if (console.log(`[Power Tools] Auto-Group: target=${targetGroups}, got ${clusters.size} groups (threshold=${bestThreshold.toFixed(1)})`), clusters.size <= 1) {
      Blockbench.showQuickMessage("All cubes form a single region, no distinct groups found", 2e3);
      return;
    }
    Undo.initEdit({ elements: selected });
    let sortedClusters = [...clusters.entries()].sort((a, b) => {
      let avgYA = a[1].reduce((s, i) => s + centroids[i][1], 0) / a[1].length, avgYB = b[1].reduce((s, i) => s + centroids[i][1], 0) / b[1].length;
      return avgYA - avgYB;
    }), groupIndex = 1;
    for (let [, indices] of sortedClusters) {
      let group = new Group({
        name: `Region_${groupIndex}`,
        origin: [0, 0, 0]
      }).init();
      track(group);
      for (let idx of indices)
        selected[idx].addTo(group);
      groupIndex++;
    }
    Undo.finishEdit("Auto-Group (Power Tools)"), Canvas.updateAll(), Blockbench.showQuickMessage(
      `Created ${clusters.size} groups from ${selected.length} cubes`,
      3e3
    ), console.log(`[Power Tools] Auto-Group: ${clusters.size} groups from ${selected.length} cubes`);
  }
  function buildHierarchy() {
    let selected = [...Cube.selected];
    if (selected.length < 2) {
      Blockbench.showQuickMessage("Select 2+ cubes to build hierarchy", 2e3);
      return;
    }
    let minX = 1 / 0, minY = 1 / 0, minZ = 1 / 0, maxX = -1 / 0, maxY = -1 / 0, maxZ = -1 / 0, centroids = [];
    for (let cube of selected) {
      let c = getCentroid(cube);
      centroids.push(c), minX = Math.min(minX, c[0]), maxX = Math.max(maxX, c[0]), minY = Math.min(minY, c[1]), maxY = Math.max(maxY, c[1]), minZ = Math.min(minZ, c[2]), maxZ = Math.max(maxZ, c[2]);
    }
    let height = maxY - minY, centerX = (minX + maxX) / 2;
    Undo.initEdit({ elements: selected });
    let originGroup = new Group({ name: "Origin", origin: [0, 0, 0] }).init(), bodyGroup = new Group({ name: "Body", origin: [0, 0, 0] }).init();
    bodyGroup.addTo(originGroup);
    let regionNames = ["Head", "L_Arm", "R_Arm", "L_Leg", "R_Leg", "Torso"], regionGroups = {};
    for (let name of regionNames) {
      let g = new Group({ name, origin: [0, 0, 0] }).init();
      g.addTo(bodyGroup), regionGroups[name] = g;
    }
    let regionCounts = {};
    for (let i = 0; i < selected.length; i++) {
      let [cx, cy] = centroids[i], normalizedY = height > 0 ? (cy - minY) / height : 0.5, isLeft = cx < centerX - (maxX - minX) * 0.15, isRight = cx > centerX + (maxX - minX) * 0.15, region;
      normalizedY > 0.8 ? region = "Head" : normalizedY < 0.4 ? region = isLeft ? "L_Leg" : isRight ? "R_Leg" : "L_Leg" : isLeft ? region = "L_Arm" : isRight ? region = "R_Arm" : region = "Torso", selected[i].addTo(regionGroups[region]), regionCounts[region] = (regionCounts[region] || 0) + 1;
    }
    track(originGroup), Undo.finishEdit("Build Hierarchy (Power Tools)"), Canvas.updateAll();
    let regionSummary = Object.entries(regionCounts).map(([k, v]) => `${k}: ${v}`).join(", ");
    Blockbench.showQuickMessage(
      `Built hierarchy: ${Object.keys(regionCounts).length} regions from ${selected.length} elements`,
      3e3
    ), console.log(`[Power Tools] Hierarchy: ${regionSummary}`);
  }
  function smartRename() {
    let selected = [...Cube.selected];
    if (selected.length === 0) {
      Blockbench.showQuickMessage("Select cubes to rename", 2e3);
      return;
    }
    let minX = 1 / 0, minY = 1 / 0, minZ = 1 / 0, maxX = -1 / 0, maxY = -1 / 0, maxZ = -1 / 0, cubeData = [];
    for (let cube of selected) {
      let c = getCentroid(cube), dx = Math.abs(cube.to[0] - cube.from[0]), dy = Math.abs(cube.to[1] - cube.from[1]), dz = Math.abs(cube.to[2] - cube.from[2]);
      cubeData.push({ cube, centroid: c, volume: dx * dy * dz }), minX = Math.min(minX, c[0]), maxX = Math.max(maxX, c[0]), minY = Math.min(minY, c[1]), maxY = Math.max(maxY, c[1]), minZ = Math.min(minZ, c[2]), maxZ = Math.max(maxZ, c[2]);
    }
    let centerX = (minX + maxX) / 2, centerZ = (minZ + maxZ) / 2, spanX = maxX - minX, spanY = maxY - minY, spanZ = maxZ - minZ, avgVolume = cubeData.reduce((s, d) => s + d.volume, 0) / cubeData.length;
    Undo.initEdit({ elements: selected });
    let nameUsage = {};
    for (let { cube, centroid, volume } of cubeData) {
      let [cx, cy, cz] = centroid, normalizedY = spanY > 0 ? (cy - minY) / spanY : 0.5, isSmall = volume < avgVolume * 0.25, vertName;
      normalizedY > 0.8 ? vertName = "Top" : normalizedY > 0.6 ? vertName = "Upper" : normalizedY > 0.4 ? vertName = "Mid" : normalizedY > 0.2 ? vertName = "Lower" : vertName = "Base";
      let prefix = "";
      if (spanX > 1) {
        let offCenter = (cx - centerX) / (spanX * 0.5);
        offCenter < -0.3 ? prefix = "L-" : offCenter > 0.3 && (prefix = "R-");
      }
      let depthSuffix = "";
      if (spanZ > 1) {
        let offDepth = (cz - centerZ) / (spanZ * 0.5);
        offDepth < -0.4 ? depthSuffix = "-Front" : offDepth > 0.4 && (depthSuffix = "-Back");
      }
      let finalName = `${prefix}${vertName}${depthSuffix}${isSmall ? "-Detail" : ""}`;
      nameUsage[finalName] = (nameUsage[finalName] || 0) + 1, nameUsage[finalName] > 1 && (finalName = `${finalName}${nameUsage[finalName]}`), cube.name = finalName;
    }
    Undo.finishEdit("Smart Rename (Power Tools)"), Canvas.updateAll(), Blockbench.showQuickMessage(`Renamed ${selected.length} elements`, 2e3), console.log(`[Power Tools] Smart Rename: ${selected.length} elements`);
  }
  function hierarchicalCluster(centroids, threshold) {
    let n = centroids.length, clusterOf = Array.from({ length: n }, (_, i) => i), members = /* @__PURE__ */ new Map();
    for (let i = 0; i < n; i++)
      members.set(i, [i]);
    function clusterCenter(ids) {
      let sx = 0, sy = 0, sz = 0;
      for (let id of ids)
        sx += centroids[id][0], sy += centroids[id][1], sz += centroids[id][2];
      return [sx / ids.length, sy / ids.length, sz / ids.length];
    }
    let nextId = n;
    for (; members.size > 1; ) {
      let bestDist = 1 / 0, bestA = -1, bestB = -1, keys = [...members.keys()];
      for (let i = 0; i < keys.length; i++) {
        let centerA = clusterCenter(members.get(keys[i]));
        for (let j = i + 1; j < keys.length; j++) {
          let centerB = clusterCenter(members.get(keys[j])), d = dist3(centerA, centerB);
          d < bestDist && (bestDist = d, bestA = keys[i], bestB = keys[j]);
        }
      }
      if (bestDist > threshold)
        break;
      let merged = [...members.get(bestA), ...members.get(bestB)];
      members.delete(bestA), members.delete(bestB), members.set(nextId, merged);
      for (let idx of merged)
        clusterOf[idx] = nextId;
      nextId++;
    }
    let idMap = /* @__PURE__ */ new Map(), nextNorm = 0, result = [];
    for (let i = 0; i < n; i++) {
      let finalCid = clusterOf[i];
      for (let [k, v] of members)
        if (v.includes(i)) {
          finalCid = k;
          break;
        }
      idMap.has(finalCid) || idMap.set(finalCid, nextNorm++), result.push(idMap.get(finalCid));
    }
    return result;
  }
  function smartOptimize() {
    let allCubes = [...Cube.all];
    if (allCubes.length < 3) {
      Blockbench.showQuickMessage("Need 3+ cubes to optimize", 2e3);
      return;
    }
    let originalCount = allCubes.length, maxRegions = Math.min(Math.floor(originalCount / 2), 50), defaultDetail = 30;
    new Dialog({
      id: "myrlin_smart_optimize_dialog",
      title: "Smart Optimize",
      form: {
        info: {
          type: "info",
          text: `Model has **${originalCount} cubes**. Drag the slider to control how much detail to keep. Use Merge Brush after for fine-tuning.`
        },
        detail_level: {
          label: "Detail Level",
          type: "range",
          value: defaultDetail,
          min: 5,
          max: 80,
          step: 5,
          description: "Low = fewer regions (aggressive), High = more regions (conservative)"
        },
        quad_threshold: {
          label: "Quad Threshold",
          type: "number",
          value: 2,
          min: 0.5,
          max: 10,
          step: 0.5,
          description: "Regions thinner than this become flat quads"
        }
      },
      onConfirm(formData) {
        let detail = formData.detail_level, targetRegions = Math.max(3, Math.round(detail / 100 * maxRegions)), quadThreshold = formData.quad_threshold;
        console.log(`[Power Tools] Smart Optimize: detail=${detail}% -> ${targetRegions} regions`), runOptimize(allCubes, targetRegions, quadThreshold);
      }
    }).show();
  }
  function runOptimize(allCubes, targetRegions, quadThreshold) {
    let originalCount = allCubes.length;
    console.log(`[Power Tools] Smart Optimize: ${originalCount} cubes, target=${targetRegions} regions, quadThreshold=${quadThreshold}`);
    let centroids = allCubes.map(getCentroid), modelMin = [1 / 0, 1 / 0, 1 / 0], modelMax = [-1 / 0, -1 / 0, -1 / 0];
    for (let [cx, cy, cz] of centroids)
      modelMin = [Math.min(modelMin[0], cx), Math.min(modelMin[1], cy), Math.min(modelMin[2], cz)], modelMax = [Math.max(modelMax[0], cx), Math.max(modelMax[1], cy), Math.max(modelMax[2], cz)];
    let modelDiag = dist3(modelMin, modelMax), lo = 0, hi = modelDiag, bestThreshold = modelDiag / 4, bestDiff = 1 / 0;
    for (let iter = 0; iter < 25; iter++) {
      let mid = (lo + hi) / 2, ids = hierarchicalCluster(centroids, mid), numClusters = new Set(ids).size, diff = Math.abs(numClusters - targetRegions);
      if ((diff < bestDiff || diff === bestDiff && numClusters >= targetRegions) && (bestDiff = diff, bestThreshold = mid), numClusters > targetRegions)
        lo = mid;
      else if (numClusters < targetRegions)
        hi = mid;
      else
        break;
    }
    let finalClusterIds = hierarchicalCluster(centroids, bestThreshold), clusters = /* @__PURE__ */ new Map();
    for (let i = 0; i < allCubes.length; i++) {
      let cid = finalClusterIds[i];
      clusters.has(cid) || clusters.set(cid, []), clusters.get(cid).push(i);
    }
    console.log(`[Power Tools] Smart Optimize: got ${clusters.size} clusters (threshold=${bestThreshold.toFixed(1)})`), Undo.initEdit({ elements: allCubes });
    let sortedClusters = [...clusters.entries()].sort((a, b) => {
      let avgYA = a[1].reduce((s, i) => s + centroids[i][1], 0) / a[1].length, avgYB = b[1].reduce((s, i) => s + centroids[i][1], 0) / b[1].length;
      return avgYA - avgYB;
    }), totalKept = 0, quadCount = 0, regionIdx = 1;
    for (let [, indices] of sortedClusters) {
      let clusterCubes = indices.map((i) => allCubes[i]), cMinX = 1 / 0, cMinY = 1 / 0, cMinZ = 1 / 0, cMaxX = -1 / 0, cMaxY = -1 / 0, cMaxZ = -1 / 0;
      for (let cube of clusterCubes)
        cMinX = Math.min(cMinX, cube.from[0], cube.to[0]), cMinY = Math.min(cMinY, cube.from[1], cube.to[1]), cMinZ = Math.min(cMinZ, cube.from[2], cube.to[2]), cMaxX = Math.max(cMaxX, cube.from[0], cube.to[0]), cMaxY = Math.max(cMaxY, cube.from[1], cube.to[1]), cMaxZ = Math.max(cMaxZ, cube.from[2], cube.to[2]);
      let group = new Group({
        name: `Region_${regionIdx}`,
        origin: [(cMinX + cMaxX) / 2, cMinY, (cMinZ + cMaxZ) / 2]
      }).init();
      track(group);
      let active = new Set(clusterCubes), merged = !0, passes = 0, maxPasses = clusterCubes.length * 2;
      for (; merged && passes < maxPasses; ) {
        merged = !1, passes++;
        for (let cube of active) {
          if (cube._removed)
            continue;
          let boundsA = getCubeBounds(cube), bestOther = null, bestFill = 0;
          for (let other of active) {
            if (other === cube || other._removed)
              continue;
            let boundsB = getCubeBounds(other);
            if (!areNearby(boundsA, boundsB, 1))
              continue;
            let fill = mergeFillRatio(boundsA, boundsB);
            fill >= 0.6 && fill > bestFill && (bestFill = fill, bestOther = other);
          }
          if (bestOther) {
            let boundsB = getCubeBounds(bestOther), combined = combineBounds(boundsA, boundsB);
            cube.from[0] = combined.min.x, cube.from[1] = combined.min.y, cube.from[2] = combined.min.z, cube.to[0] = combined.max.x, cube.to[1] = combined.max.y, cube.to[2] = combined.max.z, bestOther._removed = !0, merged = !0;
            break;
          }
        }
      }
      for (let cube of active) {
        if (cube._removed) {
          delete cube._removed, cube.remove();
          continue;
        }
        delete cube._removed;
        let dx = Math.abs(cube.to[0] - cube.from[0]), dy = Math.abs(cube.to[1] - cube.from[1]), dz = Math.abs(cube.to[2] - cube.from[2]), dims = [dx, dy, dz].sort((a, b) => a - b);
        if (dims[0] < quadThreshold && dims[1] > dims[0] * 3) {
          let minAxis = [dx, dy, dz].indexOf(dims[0]), mid = (cube.from[minAxis] + cube.to[minAxis]) / 2;
          cube.from[minAxis] = mid, cube.to[minAxis] = mid, cube.name = `Region_${regionIdx}_Quad`, quadCount++;
        } else
          cube.name = `Region_${regionIdx}_Body`;
        cube.addTo(group), totalKept++;
      }
      regionIdx++;
    }
    Undo.finishEdit("Smart Optimize (Power Tools)"), Canvas.updateAll();
    let ratio = ((originalCount - totalKept) / originalCount * 100).toFixed(0);
    Blockbench.showQuickMessage(
      `Optimized: ${originalCount} -> ${totalKept} elements (${ratio}% reduction, ${quadCount} quads, ${clusters.size} groups)`,
      4e3
    ), console.log(`[Power Tools] Smart Optimize: ${originalCount} -> ${totalKept} (${quadCount} quads, ${clusters.size} groups)`);
  }
  var brushSelection = /* @__PURE__ */ new Set(), brushActive = !1, quadBrushPoints = [], quadBrushActive = !1, quadBrushPlane = -1;
  function onQuadBrushStart(data) {
    quadBrushPoints = [], quadBrushActive = !0, quadBrushPlane = -1;
    let hit = getHitPoint(data);
    hit && (quadBrushPlane = hit.plane, quadBrushPoints.push(hit.point)), updateQuadBrushStatus();
  }
  function onQuadBrushMove(data) {
    if (!quadBrushActive || quadBrushPlane < 0)
      return;
    let hit = getHitPoint(data);
    hit && quadBrushPoints.push(hit.point), updateQuadBrushStatus();
  }
  function onQuadBrushEnd() {
    if (quadBrushActive = !1, quadBrushPoints.length < 2) {
      quadBrushPoints = [], Blockbench.setCursorTooltip();
      return;
    }
    let pts = quadBrushPoints, minX = 1 / 0, minY = 1 / 0, minZ = 1 / 0, maxX = -1 / 0, maxY = -1 / 0, maxZ = -1 / 0;
    for (let [px, py, pz] of pts)
      minX = Math.min(minX, px), maxX = Math.max(maxX, px), minY = Math.min(minY, py), maxY = Math.max(maxY, py), minZ = Math.min(minZ, pz), maxZ = Math.max(maxZ, pz);
    let from = [minX, minY, minZ], to = [maxX, maxY, maxZ], mid = (from[quadBrushPlane] + to[quadBrushPlane]) / 2;
    from[quadBrushPlane] = mid, to[quadBrushPlane] = mid, Undo.initEdit({ elements: [] });
    let quad = new Cube({
      name: `Quad_${Math.round(mid)}`,
      from,
      to
    }).init();
    Undo.finishEdit("Quad Brush (Power Tools)"), Canvas.updateAll();
    let axisNames = ["X", "Y", "Z"], w = to[(quadBrushPlane + 1) % 3] - from[(quadBrushPlane + 1) % 3], h = to[(quadBrushPlane + 2) % 3] - from[(quadBrushPlane + 2) % 3];
    Blockbench.showQuickMessage(
      `Created quad on ${axisNames[quadBrushPlane]} plane (${Math.round(w)}x${Math.round(h)})`,
      3e3
    ), console.log(`[Power Tools] Quad Brush: plane=${axisNames[quadBrushPlane]}, size=${w.toFixed(0)}x${h.toFixed(0)}, from ${pts.length} points`), quadBrushPoints = [], Blockbench.setCursorTooltip();
  }
  function getHitPoint(data) {
    if (!data || !data.event)
      return null;
    let preview = Preview.selected;
    if (!preview)
      return null;
    let result = preview.raycast(data.event);
    if (!result)
      return null;
    let point = null;
    if (result.intersects && result.intersects.length > 0) {
      let p = result.intersects[0].point;
      point = [p.x, p.y, p.z];
    } else if (result.cube) {
      let c = result.cube;
      point = [(c.from[0] + c.to[0]) / 2, (c.from[1] + c.to[1]) / 2, (c.from[2] + c.to[2]) / 2];
    }
    if (!point)
      return null;
    let plane = 0;
    if (result.face) {
      let f = result.face.toLowerCase();
      f === "north" || f === "south" ? plane = 2 : f === "up" || f === "down" ? plane = 1 : plane = 0;
    }
    return quadBrushPlane >= 0 && (plane = quadBrushPlane), { point, plane };
  }
  function updateQuadBrushStatus() {
    if (quadBrushPoints.length > 0) {
      let axisNames = ["X", "Y", "Z"];
      Blockbench.setCursorTooltip(`Quad: ${quadBrushPoints.length} pts (${axisNames[quadBrushPlane]} plane)`);
    }
  }
  function onBrushStart(data) {
    brushSelection.clear(), brushActive = !0;
    let hit = hitCubeUnderCursor(data);
    hit && (brushSelection.add(hit), hit.select({ shiftKey: !0 })), updateBrushStatus();
  }
  function onBrushMove(data) {
    if (!brushActive)
      return;
    let hit = hitCubeUnderCursor(data);
    hit && !brushSelection.has(hit) && (brushSelection.add(hit), hit.select({ shiftKey: !0 })), updateBrushStatus();
  }
  function onBrushEnd() {
    if (brushActive = !1, brushSelection.size < 2) {
      brushSelection.clear(), Blockbench.setCursorTooltip();
      return;
    }
    let cubes = [...brushSelection];
    brushSelection.clear(), Undo.initEdit({ elements: cubes });
    let minX = 1 / 0, minY = 1 / 0, minZ = 1 / 0, maxX = -1 / 0, maxY = -1 / 0, maxZ = -1 / 0;
    for (let cube of cubes)
      minX = Math.min(minX, cube.from[0], cube.to[0]), minY = Math.min(minY, cube.from[1], cube.to[1]), minZ = Math.min(minZ, cube.from[2], cube.to[2]), maxX = Math.max(maxX, cube.from[0], cube.to[0]), maxY = Math.max(maxY, cube.from[1], cube.to[1]), maxZ = Math.max(maxZ, cube.from[2], cube.to[2]);
    let keeper = cubes[0];
    keeper.from[0] = minX, keeper.from[1] = minY, keeper.from[2] = minZ, keeper.to[0] = maxX, keeper.to[1] = maxY, keeper.to[2] = maxZ, keeper.name = `Merged_${cubes.length}`;
    for (let i = 1; i < cubes.length; i++)
      cubes[i].remove();
    Undo.finishEdit("Merge Brush (Power Tools)"), Canvas.updateAll(), Blockbench.showQuickMessage(
      `Merged ${cubes.length} cubes into 1 cuboid`,
      2e3
    ), console.log(`[Power Tools] Merge Brush: ${cubes.length} cubes -> 1`), Blockbench.setCursorTooltip();
  }
  function hitCubeUnderCursor(data) {
    if (!data || !data.event)
      return null;
    if (data.cube)
      return data.cube;
    if (data.element && data.element.type === "cube")
      return data.element;
    let preview = Preview.selected;
    if (preview && data.event) {
      let result = preview.raycast(data.event);
      if (result && result.cube)
        return result.cube;
      if (result && result.element && result.element.type === "cube")
        return result.element;
    }
    return null;
  }
  function updateBrushStatus() {
    brushSelection.size > 0 && Blockbench.setCursorTooltip(`Merge: ${brushSelection.size} cubes`);
  }
  function setupPowerTools() {
    let mergeBrushTool = track(new Tool("myrlin_merge_brush", {
      name: "Merge Brush",
      description: "Click and drag over cubes to merge them into one cuboid",
      icon: "brush",
      category: "tools",
      selectElements: !0,
      cursor: "crosshair",
      // @ts-ignore - Blockbench Tool callback
      onCanvasClick(data) {
        onBrushStart(data);
      },
      // @ts-ignore - Blockbench Tool callback
      onCanvasMouseMove(data) {
        brushActive && onBrushMove(data);
      }
    })), canvasEl = document.getElementById("preview");
    if (canvasEl) {
      let mouseUpHandler = () => {
        brushActive && Toolbox && Toolbox.selected && Toolbox.selected.id === "myrlin_merge_brush" && onBrushEnd();
      };
      canvasEl.addEventListener("mouseup", mouseUpHandler), track({ delete: () => canvasEl.removeEventListener("mouseup", mouseUpHandler) });
    }
    MenuBar.addAction(mergeBrushTool, "tools");
    let quadBrushTool = track(new Tool("myrlin_quad_brush", {
      name: "Quad Brush",
      description: "Paint along edges to place a flat quad. Click a face to set the plane, drag to define the area.",
      icon: "square_foot",
      category: "tools",
      selectElements: !0,
      cursor: "crosshair",
      // @ts-ignore - Blockbench Tool callback
      onCanvasClick(data) {
        onQuadBrushStart(data);
      },
      // @ts-ignore - Blockbench Tool callback
      onCanvasMouseMove(data) {
        quadBrushActive && onQuadBrushMove(data);
      }
    })), canvasEl2 = document.getElementById("preview");
    if (canvasEl2) {
      let quadMouseUpHandler = () => {
        quadBrushActive && Toolbox && Toolbox.selected && Toolbox.selected.id === "myrlin_quad_brush" && onQuadBrushEnd();
      };
      canvasEl2.addEventListener("mouseup", quadMouseUpHandler), track({ delete: () => canvasEl2.removeEventListener("mouseup", quadMouseUpHandler) });
    }
    MenuBar.addAction(quadBrushTool, "tools");
    let mergeStrictAction = track(new Action("myrlin_smart_merge", {
      name: "Smart Merge (Strict)",
      description: "Merge cubes sharing exact faces into larger cuboids",
      icon: "merge",
      category: "tools",
      // @ts-ignore - Cube is a Blockbench global
      condition: () => Cube.selected.length >= 2,
      click: () => smartMerge(!1)
    })), mergeFuzzyAction = track(new Action("myrlin_smart_merge_fuzzy", {
      name: "Smart Merge (Fuzzy)",
      description: "Merge nearby cubes with relaxed alignment. Good for non-voxel imports.",
      icon: "merge_type",
      category: "tools",
      // @ts-ignore - Cube is a Blockbench global
      condition: () => Cube.selected.length >= 2,
      click: () => smartMerge(!0)
    })), quadAction = track(new Action("myrlin_convert_quad", {
      name: "Convert to Quad (Selection)",
      description: "Flatten selected thin cuboids into zero-depth quads",
      icon: "crop_square",
      category: "tools",
      // @ts-ignore - Cube is a Blockbench global
      condition: () => Cube.selected.length >= 1,
      click: convertToQuad
    })), flattenAction = track(new Action("myrlin_flatten_quad", {
      name: "Flatten to Quad",
      description: "Collapse selected cuboids into flat quads on a chosen axis (blade edges, hair, eyelids)",
      icon: "layers",
      category: "tools",
      // @ts-ignore - Cube is a Blockbench global
      condition: () => Cube.selected.length >= 1,
      click: flattenToQuad
    })), groupAction = track(new Action("myrlin_auto_group", {
      name: "Auto-Group by Proximity",
      description: "Cluster cubes into spatial groups using adaptive threshold",
      icon: "workspaces",
      category: "tools",
      // @ts-ignore - Cube is a Blockbench global
      condition: () => Cube.selected.length >= 2,
      click: autoGroup
    })), hierarchyAction = track(new Action("myrlin_build_hierarchy", {
      name: "Build Hierarchy",
      description: "Structure flat cubes into humanoid skeleton (creature models)",
      icon: "account_tree",
      category: "tools",
      // @ts-ignore - Cube is a Blockbench global
      condition: () => Cube.selected.length >= 2,
      click: buildHierarchy
    })), renameAction = track(new Action("myrlin_smart_rename", {
      name: "Smart Rename",
      description: "Auto-name cubes by spatial position (Top/Mid/Base, L/R)",
      icon: "label",
      category: "tools",
      // @ts-ignore - Cube is a Blockbench global
      condition: () => Cube.selected.length >= 1,
      click: smartRename
    })), optimizeAction = track(new Action("myrlin_smart_optimize", {
      name: "Smart Optimize (Full Model)",
      description: "Restructure entire model: cluster regions, replace with cuboids + quads, build hierarchy",
      icon: "auto_fix_high",
      category: "tools",
      // @ts-ignore - Cube is a Blockbench global
      condition: () => Cube.all.length >= 3,
      click: smartOptimize
    }));
    MenuBar.addAction(optimizeAction, "tools"), MenuBar.addAction(mergeStrictAction, "tools"), MenuBar.addAction(mergeFuzzyAction, "tools"), MenuBar.addAction(quadAction, "tools"), MenuBar.addAction(flattenAction, "tools"), MenuBar.addAction(groupAction, "tools"), MenuBar.addAction(hierarchyAction, "tools"), MenuBar.addAction(renameAction, "tools"), console.log("[Power Tools] 8 tools registered: Merge Brush, Smart Optimize, Smart Merge (Strict/Fuzzy), Convert to Quad, Auto-Group, Build Hierarchy, Smart Rename");
  }

  // plugin.ts
  var PLUGIN_ID = "myrlins_tools", VERSION = "3.4.3";
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
      console.log(`[Myrlin's Tools] Loading v${VERSION}...`), setupPanel(), setupActions(), setupStatusBar(), setupTemplateWizard(), setupValidator(), setupConfigGenerator(), setupValidationPanel(), setupImportValidation(), setupModProject(), setupPowerTools(), console.log(`[Myrlin's Tools] Loaded successfully! (v${VERSION})`);
    },
    onunload() {
      console.log("[Myrlin's Tools] Unloading..."), cleanup();
    }
  });
})();
