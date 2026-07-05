(function () {
  "use strict";

  // â”€â”€â”€ CSS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const CSS = `
.igp-root {
  display:flex; flex-direction:column; height:100%;
  padding:8px; box-sizing:border-box; gap:6px;
}
.igp-search {
  width:100%; box-sizing:border-box;
  background:var(--color-back); border:1px solid var(--color-border);
  border-radius:6px; padding:6px 10px;
  color:var(--color-text); font-size:12px; outline:none;
  transition:border-color .15s;
}
.igp-search:focus { border-color:var(--color-accent); }
.igp-search:disabled { opacity:0.55; cursor:wait; }
.igp-search::placeholder { color:var(--color-subtle_text,#888); }
.igp-tabs { display:flex; gap:4px; }
.igp-tab {
  flex:1; padding:4px 0; text-align:center;
  font-size:11px; font-weight:700; letter-spacing:.4px;
  border-radius:5px; border:1px solid var(--color-border);
  background:transparent; color:var(--color-subtle_text,#888); cursor:pointer;
  transition:background .12s, color .12s;
}
.igp-tab:hover:not(:disabled) { background:var(--color-button); color:var(--color-text); }
.igp-tab:disabled { opacity:0.55; cursor:wait; }
.igp-tab.active { background:var(--color-accent); color:#fff; border-color:var(--color-accent); }
.igp-grid {
  flex:1; overflow-y:auto; min-height:0;
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(72px,1fr));
  gap:6px; align-content:start;
}
.igp-slot {
  display:flex; flex-direction:column; align-items:center;
  padding:6px 4px 5px; border-radius:6px;
  border:1px solid var(--color-border);
  background:var(--color-back);
  cursor:pointer; user-select:none;
  transition:border-color .12s, background .12s;
}
.igp-slot:hover { border-color:var(--color-accent); background:var(--color-button); }
.igp-slot:active { transform:scale(0.95); }
.igp-icon { display:block; image-rendering:pixelated; }
.igp-slot-name {
  font-size:9px; color:var(--color-text); text-align:center;
  margin-top:4px; line-height:1.2; max-width:68px;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
}
.igp-empty {
  text-align:center; color:var(--color-subtle_text,#888);
  font-size:11px; padding:20px 0; margin:0; grid-column:1/-1;
}
.igp-loading {
  flex:1; display:flex; flex-direction:column; align-items:center;
  justify-content:center; gap:8px; color:var(--color-subtle_text,#888);
  font-size:11px; text-align:center; padding:16px;
}
.igp-loading-spinner {
  width:22px; height:22px; border:2px solid var(--color-border);
  border-top-color:var(--color-accent); border-radius:50%;
  animation:igp-spin .7s linear infinite;
}
@keyframes igp-spin { to { transform:rotate(360deg); } }
.igp-footer {
  font-size:9px; color:var(--color-subtle_text,#888);
  text-align:center; padding-top:2px; flex-shrink:0;
}
`;

  // â”€â”€â”€ MCAsset Loader â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  var MANIFEST_URL = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json";
  var MCASSET_CDN = "https://assets.mcasset.cloud";
  var MCASSET_RAW = "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets";
  var FALLBACK_VERSION = "26.1.2";
  var LS_VERSION_KEY = "igp_mc_version";

  var CATALOG = { blocks: [], items: [] };
  var mcVersion = FALLBACK_VERSION;
  var catalogReady = false;
  var catalogError = null;

  function textureUrl(version, category, filename) {
    return MCASSET_CDN + "/" + version + "/assets/minecraft/textures/"
      + category + "/" + filename;
  }

  function listJsonUrl(version, category) {
    return MCASSET_RAW + "/" + version + "/assets/minecraft/textures/"
      + category + "/_list.json";
  }

  function formatDisplayName(id) {
    return id.replace(/_/g, " ").replace(/\b\w/g, function (c) {
      return c.toUpperCase();
    });
  }

  function buildEntry(version, category, filename) {
    var id = filename.replace(/\.png$/i, "");
    return {
      id: id,
      name: formatDisplayName(id),
      file: filename,
      category: category,
      version: version,
      url: textureUrl(version, category, filename),
      tags: id.split("_"),
    };
  }

  // â”€â”€â”€ Block Face Grouping â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  var FACE_SUFFIXES = ["top", "bottom", "north", "south", "east", "west", "side", "front", "back"];
  var FACE_TO_BB = {
    top: "up", bottom: "down", north: "north", south: "south",
    east: "east", west: "west", side: "side", front: "north", back: "south",
  };

  function isFaceVariantSuffix(suffix) {
    if (!suffix) return false;
    var part = suffix.split("_")[0];
    return FACE_SUFFIXES.indexOf(part) !== -1;
  }

  function parseBlockTexture(id, allIds) {
    var faceMatch = id.match(/^(.+)_(top|bottom|north|south|east|west|side|front|back)(?:_(.+))?$/);
    if (faceMatch && !/_stage\d/.test(id)) {
      return { base: faceMatch[1], face: faceMatch[2], state: faceMatch[3] || null };
    }
    var prefix = id + "_";
    var hasFaceVariants = false;
    allIds.forEach(function (other) {
      if (other.indexOf(prefix) !== 0) return;
      if (isFaceVariantSuffix(other.slice(prefix.length))) hasFaceVariants = true;
    });
    if (hasFaceVariants) return { base: id, face: "side", state: null };
    return { base: id, face: null, state: null };
  }

  function statePriority(state) {
    if (!state) return 0;
    if (/inactive|off/.test(state)) return 1;
    if (/active|on|lit/.test(state)) return 2;
    return 10;
  }

  function pickDefaultFaces(textures) {
    var buckets = { up: [], down: [], north: [], south: [], east: [], west: [], side: [] };
    var uniformUrl = null;

    textures.forEach(function (t) {
      if (!t.face) {
        uniformUrl = t.entry.url;
        return;
      }
      var bbFace = FACE_TO_BB[t.face] || t.face;
      if (!buckets[bbFace]) buckets[bbFace] = [];
      buckets[bbFace].push({ url: t.entry.url, state: t.state });
    });

    if (uniformUrl) {
      return {
        up: uniformUrl, down: uniformUrl,
        north: uniformUrl, south: uniformUrl,
        east: uniformUrl, west: uniformUrl,
      };
    }

    function best(candidates) {
      if (!candidates || !candidates.length) return null;
      candidates.sort(function (a, b) { return statePriority(a.state) - statePriority(b.state); });
      return candidates[0].url;
    }

    var faces = {
      up: best(buckets.up),
      down: best(buckets.down),
      north: best(buckets.north),
      south: best(buckets.south),
      east: best(buckets.east),
      west: best(buckets.west),
    };
    var sideUrl = best(buckets.side);
    if (sideUrl) {
      ["north", "south", "east", "west"].forEach(function (f) {
        if (!faces[f]) faces[f] = sideUrl;
      });
    }
    var fallback = sideUrl || faces.up || faces.north || faces.down
      || (textures[0] && textures[0].entry.url);
    ["up", "down", "north", "south", "east", "west"].forEach(function (f) {
      if (!faces[f]) faces[f] = fallback;
    });
    return faces;
  }

  function groupBlockEntries(version, filenames) {
    var entries = filenames
      .filter(function (f) { return /\.png$/i.test(f) && !/\.mcmeta$/i.test(f); })
      .map(function (f) { return buildEntry(version, "block", f); });

    // Beds: show only _head variants renamed to base name; hide _foot and _up entries
    entries = entries
      .filter(function (e) { return !/_bed_(foot|up)/.test(e.id) && !/_bed_foot$/.test(e.id); })
      .map(function (e) {
        if (/_bed_head$/.test(e.id)) {
          var baseId = e.id.replace(/_head$/, '');
          return Object.assign({}, e, { id: baseId, name: formatDisplayName(baseId) });
        }
        return e;
      });

    var allIds = new Set(entries.map(function (e) { return e.id; }));
    var groups = {};

    entries.forEach(function (entry) {
      var parsed = parseBlockTexture(entry.id, allIds);
      var base = parsed.base;
      if (!groups[base]) groups[base] = [];
      groups[base].push({
        entry: entry,
        face: parsed.face,
        state: parsed.state,
      });
    });

    return Object.keys(groups).map(function (base) {
      var textures = groups[base];
      var faces = pickDefaultFaces(textures);
      var multiFace = textures.length > 1;
      var previewUrl = faces.up || faces.side || faces.north || textures[0].entry.url;
      return {
        id: base,
        name: formatDisplayName(base),
        category: "block",
        version: version,
        url: previewUrl,
        faces: faces,
        multiFace: multiFace,
        tags: base.split("_"),
      };
    }).sort(function (a, b) { return a.name.localeCompare(b.name); });
  }

  function fetchListJson(version, category) {
    return fetch(listJsonUrl(version, category))
      .then(function (res) {
        if (!res.ok) return null;
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.files || !data.files.length) return null;
        return data;
      })
      .catch(function () { return null; });
  }

  function resolveVersion() {
    return fetch(MANIFEST_URL)
      .then(function (res) { return res.json(); })
      .then(function (manifest) {
        var candidates = [];
        if (manifest.latest && manifest.latest.release) {
          candidates.push(manifest.latest.release);
        }
        if (manifest.versions) {
          manifest.versions
            .filter(function (v) { return v.type === "release"; })
            .slice(0, 20)
            .forEach(function (v) {
              if (candidates.indexOf(v.id) === -1) candidates.push(v.id);
            });
        }
        if (candidates.indexOf(FALLBACK_VERSION) === -1) {
          candidates.push(FALLBACK_VERSION);
        }
        return tryVersionCandidates(candidates, 0);
      })
      .catch(function () {
        return tryVersionCandidates([FALLBACK_VERSION], 0);
      });
  }

  function tryVersionCandidates(candidates, index) {
    if (index >= candidates.length) return Promise.resolve(FALLBACK_VERSION);
    var version = candidates[index];
    return fetchListJson(version, "block").then(function (blockList) {
      if (blockList) return version;
      return tryVersionCandidates(candidates, index + 1);
    });
  }

  function buildCatalog(version) {
    return Promise.all([
      fetchListJson(version, "block"),
      fetchListJson(version, "item"),
    ]).then(function (results) {
      var blockList = results[0];
      var itemList = results[1];
      if (!blockList && !itemList) {
        throw new Error("Could not load texture catalog for MC " + version);
      }
      CATALOG.blocks = groupBlockEntries(version, blockList ? blockList.files : []);
      CATALOG.items = (itemList ? itemList.files : [])
        .filter(function (f) { return /\.png$/i.test(f) && !/\.mcmeta$/i.test(f); })
        .map(function (f) { return buildEntry(version, "item", f); })
        .sort(function (a, b) { return a.name.localeCompare(b.name); });
      mcVersion = version;
      catalogReady = true;
      try {
        localStorage.setItem(LS_VERSION_KEY, version);
      } catch (e) { /* ignore */ }
      return version;
    });
  }

  var McAssetLoader = {
    init: function () {
      catalogReady = false;
      catalogError = null;
      CATALOG.blocks = [];
      CATALOG.items = [];
      return resolveVersion()
        .then(function (version) { return buildCatalog(version); })
        .catch(function (err) {
          catalogError = err.message || String(err);
          console.warn("[IGP] Catalog load failed:", catalogError);
          return buildCatalog(FALLBACK_VERSION).catch(function () {
            catalogReady = true;
            throw err;
          });
        });
    },
    getVersion: function () { return mcVersion; },
    isReady: function () { return catalogReady; },
    getError: function () { return catalogError; },
  };

  // â”€â”€â”€ Texture Cache & Resolver â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  var textureCache = new Map();
  var textureCacheOrder = [];
  var TEXTURE_CACHE_MAX = 200;

  function cacheTexture(url, dataUrl) {
    if (textureCache.has(url)) {
      var existing = textureCacheOrder.indexOf(url);
      if (existing >= 0) textureCacheOrder.splice(existing, 1);
    } else if (textureCacheOrder.length >= TEXTURE_CACHE_MAX) {
      var old = textureCacheOrder.shift();
      textureCache.delete(old);
    }
    textureCache.set(url, dataUrl);
    textureCacheOrder.push(url);
  }

  function blobToDataURL(blob) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onloadend = function () { resolve(reader.result); };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function resolveTexture(url) {
    if (textureCache.has(url)) {
      return Promise.resolve(textureCache.get(url));
    }
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.blob();
      })
      .then(blobToDataURL)
      .then(function (dataUrl) {
        cacheTexture(url, dataUrl);
        return dataUrl;
      });
  }

  function clearTextureCache() {
    textureCache.clear();
    textureCacheOrder.length = 0;
  }

  // â”€â”€â”€ Texture Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  function createAndApplyTexture(cubes, name, hexColor) {
    try {
      if (typeof Texture === "undefined") return;
      var tc = document.createElement("canvas");
      tc.width = 16;
      tc.height = 16;
      var tctx = tc.getContext("2d");
      tctx.fillStyle = hexColor;
      tctx.fillRect(0, 0, 16, 16);
      var noisePixels = [
        [1,2],[4,1],[7,3],[10,0],[13,2],[15,4],
        [0,5],[3,7],[6,5],[9,8],[12,6],[14,8],
        [2,10],[5,12],[8,10],[11,13],[1,14],[4,15],
        [7,12],[10,14],[13,11],[15,15],[0,12],[6,14],
      ];
      tctx.fillStyle = "rgba(0,0,0,0.13)";
      noisePixels.forEach(function (p) { tctx.fillRect(p[0], p[1], 1, 1); });
      var tex = new Texture({ name: name.replace(/\s+/g, "_") + "_tex" });
      tex.fromDataURL(tc.toDataURL("image/png"));
      tex.add(false, false);
      applyTextureToCubes(cubes, tex.uuid);
    } catch (e) {
      console.warn("[IGP] Fallback texture error:", e.message);
    }
  }

  function applyTextureToCubes(cubes, uuid) {
    cubes.forEach(function (cube) {
      if (!cube || !cube.faces) return;
      Object.keys(cube.faces).forEach(function (face) {
        if (cube.faces[face]) {
          cube.faces[face].uv = [0, 0, 16, 16];
          cube.faces[face].texture = uuid;
        }
      });
    });
  }

  function applyVanillaTexture(cubes, name, url, fallbackHex) {
    fallbackHex = fallbackHex || "#9B9B9B";
    return resolveTexture(url)
      .then(function (dataUrl) {
        if (typeof Texture === "undefined") return;
        var tex = new Texture({ name: name.replace(/\s+/g, "_") + "_tex" });
        tex.fromDataURL(dataUrl);
        tex.add(false, false);
        applyTextureToCubes(cubes, tex.uuid);
      })
      .catch(function (e) {
        console.warn("[IGP] Vanilla texture failed, using fallback:", e.message);
        Blockbench.showQuickMessage("Texture unavailable â€” using placeholder", 2000);
        createAndApplyTexture(cubes, name, fallbackHex);
      });
  }

  function applyFaceTextures(cube, faces, name) {
    var bbFaces = ["north", "south", "east", "west", "up", "down"];
    var promises = bbFaces.map(function (face) {
      var url = faces[face];
      if (!url || !cube.faces[face]) return Promise.resolve();
      return resolveTexture(url).then(function (dataUrl) {
        if (typeof Texture === "undefined") return;
        var tex = new Texture({ name: name.replace(/\s+/g, "_") + "_" + face });
        tex.fromDataURL(dataUrl);
        tex.add(false, false);
        cube.faces[face].uv = [0, 0, 16, 16];
        cube.faces[face].texture = tex.uuid;
      });
    });
    return Promise.all(promises);
  }

  function applyTexturesToCubes(cubes, label, entry) {
    if (entry.multiFace && entry.faces) {
      return Promise.all(cubes.map(function (cube) {
        return applyFaceTextures(cube, entry.faces, label);
      })).catch(function (e) {
        console.warn("[IGP] Multi-face texture failed, using fallback:", e.message);
        Blockbench.showQuickMessage("Texture unavailable â€” using placeholder", 2000);
        createAndApplyTexture(cubes, label, "#9B9B9B");
      });
    }
    return applyVanillaTexture(cubes, label, entry.url);
  }

  function drawTextureIcon(canvas, url) {
    resolveTexture(url).then(function (dataUrl) {
      var img = new Image();
      img.onload = function () {
        var ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = dataUrl;
    }).catch(function () {
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#555";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
  }

  // â”€â”€â”€ Spawn Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  var SPAWN_PIVOT = [-8, 0, -8];

  function getGridOffset() {
    return { ox: -8, oz: -8 };
  }

  function makeGroup(name, pivot) {
    return new Group({ name: name, pivot: pivot.slice() }).init();
  }

  function makeCube(name, from, to, pivot) {
    return new Cube({ name: name, from: from, to: to, pivot: pivot || [8, 8, 8] }).init();
  }

  function autoUV(cube) {
    var sx = cube.to[0] - cube.from[0];
    var sy = cube.to[1] - cube.from[1];
    var sz = cube.to[2] - cube.from[2];
    var uvs = {
      north: [sz, sz, sz + sx, sz + sy],
      south: [sz + sx + sz, sz, sz + sx + sz + sx, sz + sy],
      east:  [0, sz, sz, sz + sy],
      west:  [sz + sx, sz, sz + sx + sz, sz + sy],
      up:    [sz, 0, sz + sx, sz],
      down:  [sz + sx, 0, sz + sx + sx, sz],
    };
    Object.entries(uvs).forEach(function (e) {
      if (cube.faces[e[0]]) { cube.faces[e[0]].uv = e[1]; cube.faces[e[0]].texture = null; }
    });
  }

  function finishSpawn(cubes, label, entry, editName) {
    return applyTexturesToCubes(cubes, label, entry).then(function () {
      Canvas.updateAll();
      Undo.finishEdit(editName || ("Spawned " + label));
    });
  }

  // â”€â”€â”€ Block Spawns â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  function spawnStandardBlock(label, entry) {
    label = label || "Block";
    var p = getGridOffset(); var ox = p.ox, oz = p.oz;
    Undo.initEdit({ elements: [], outliner: true });
    var c = makeCube(label, [ox, 0, oz], [ox+16, 16, oz+16], [ox+8, 8, oz+8]);
    autoUV(c);
    return finishSpawn([c], label, entry);
  }

  function spawnSlab(label, entry) {
    label = label || "Slab";
    var p = getGridOffset(); var ox = p.ox, oz = p.oz;
    Undo.initEdit({ elements: [], outliner: true });
    var c = makeCube(label, [ox, 0, oz], [ox+16, 8, oz+16], [ox+8, 4, oz+8]);
    autoUV(c);
    return finishSpawn([c], label, entry);
  }

  function spawnStairs(label, entry) {
    label = label || "Stairs";
    var p = getGridOffset(); var ox = p.ox, oz = p.oz;
    Undo.initEdit({ elements: [], outliner: true });
    var g = makeGroup(label, SPAWN_PIVOT);
    var bot = makeCube("bottom",   [ox, 0, oz], [ox+16, 8,  oz+16], [ox+8, 4,  oz+8]);
    var top = makeCube("top_step", [ox, 8, oz], [ox+16, 16, oz+8],  [ox+8, 12, oz+4]);
    autoUV(bot); autoUV(top);
    bot.addTo(g); top.addTo(g);
    return finishSpawn([bot, top], label, entry);
  }

  function spawnWall(label, entry) {
    label = label || "Wall";
    var p = getGridOffset(); var ox = p.ox, oz = p.oz;
    Undo.initEdit({ elements: [], outliner: true });
    var c = makeCube(label, [ox+4, 0, oz+4], [ox+12, 16, oz+12], [ox+8, 8, oz+8]);
    autoUV(c);
    return finishSpawn([c], label, entry);
  }

  function spawnFence(label, entry) {
    label = label || "Fence";
    var p = getGridOffset(); var ox = p.ox, oz = p.oz;
    Undo.initEdit({ elements: [], outliner: true });
    var g = makeGroup(label, SPAWN_PIVOT);
    var cubes = [
      makeCube("post",     [ox+6, 0,  oz+6],  [ox+10, 16, oz+10], [ox+8, 8,  oz+8]),
      makeCube("plank_tn", [ox+7, 9,  oz],    [ox+9,  13, oz+6],  [ox+8, 11, oz+3]),
      makeCube("plank_ts", [ox+7, 9,  oz+10], [ox+9,  13, oz+16], [ox+8, 11, oz+13]),
      makeCube("plank_bn", [ox+7, 3,  oz],    [ox+9,  7,  oz+6],  [ox+8, 5,  oz+3]),
      makeCube("plank_bs", [ox+7, 3,  oz+10], [ox+9,  7,  oz+16], [ox+8, 5,  oz+13]),
    ];
    cubes.forEach(function (c) { autoUV(c); c.addTo(g); });
    return finishSpawn(cubes, label, entry);
  }

  function spawnTrapdoor(label, entry) {
    label = label || "Trapdoor";
    var p = getGridOffset(); var ox = p.ox, oz = p.oz;
    Undo.initEdit({ elements: [], outliner: true });
    var c = makeCube(label, [ox, 0, oz], [ox+16, 3, oz+16], [ox+8, 1.5, oz+8]);
    autoUV(c);
    return finishSpawn([c], label, entry);
  }

  function spawnHeavyCore(label, entry) {
    label = label || "Heavy Core";
    var p = getGridOffset(); var ox = p.ox, oz = p.oz;
    Undo.initEdit({ elements: [], outliner: true });
    var c = makeCube(label, [ox+3, 3, oz+3], [ox+13, 13, oz+13], [ox+8, 8, oz+8]);
    autoUV(c);
    return finishSpawn([c], label, entry);
  }

  // â”€â”€â”€ Item Spawns â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  function spawnExtrudedItem(label, entry) {
    label = label || "Item";
    var p = getGridOffset(); var ox = p.ox, oz = p.oz;

    return resolveTexture(entry.url).then(function (dataUrl) {
      return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () { resolve({ img: img, dataUrl: dataUrl }); };
        img.onerror = reject;
        img.src = dataUrl;
      });
    }).then(function (result) {
      var img = result.img;
      var W = img.width;
      var H = img.height;

      var offscreen = document.createElement("canvas");
      offscreen.width = W; offscreen.height = H;
      var ctx = offscreen.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var data = ctx.getImageData(0, 0, W, H).data;

      Undo.initEdit({ elements: [], outliner: true });

      var tex = new Texture({ name: label.replace(/\s+/g, "_") + "_tex" });
      tex.fromDataURL(result.dataUrl);
      tex.add(false, false);

      var g = makeGroup(label, SPAWN_PIVOT);
      var cubes = [];

      for (var iy = 0; iy < H; iy++) {
        for (var ix = 0; ix < W; ix++) {
          var a = data[(iy * W + ix) * 4 + 3];
          if (a < 10) continue;

          var worldY = H - 1 - iy;
          var c = makeCube("cube",
            [ox + ix, worldY,     oz],
            [ox + ix + 1, worldY + 1, oz + 1],
            [ox + ix + 0.5, worldY + 0.5, oz + 0.5]
          );
          var u0 = ix, v0 = iy, u1 = ix+1, v1 = iy+1;
          Object.keys(c.faces).forEach(function (f) {
            c.faces[f].uv = [u0, v0, u1, v1];
            c.faces[f].texture = tex.uuid;
          });
          if (c.faces.south) c.faces.south.uv = [u1, v0, u0, v1];
          c.addTo(g);
          cubes.push(c);
        }
      }

      Canvas.updateAll();
      Undo.finishEdit("Spawned " + label);
      return cubes;
    }).catch(function (e) {
      console.warn("[IGP] Extrude failed:", e);
      Undo.initEdit({ elements: [], outliner: true });
      var c = makeCube(label, [ox, 0, oz], [ox+16, 16, oz+1], [ox+8, 8, oz+0.5]);
      createAndApplyTexture([c], label, "#9B9B9B");
      Canvas.updateAll();
      Undo.finishEdit("Spawned " + label);
    });
  }

  function spawnFlatItem(label, entry) { return spawnExtrudedItem(label, entry); }

  function spawnHandheldItem(label, entry) {
    label = label || "Handheld Item";
    var p = getGridOffset(); var ox = p.ox, oz = p.oz;

    return resolveTexture(entry.url).then(function (dataUrl) {
      return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () { resolve({ img: img, dataUrl: dataUrl }); };
        img.onerror = reject;
        img.src = dataUrl;
      });
    }).then(function (result) {
      var img = result.img;
      var W = img.width;
      var H = img.height;

      var offscreen = document.createElement("canvas");
      offscreen.width = W; offscreen.height = H;
      var ctx = offscreen.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var data = ctx.getImageData(0, 0, W, H).data;

      Undo.initEdit({ elements: [], outliner: true });

      var tex = new Texture({ name: label.replace(/\s+/g, "_") + "_tex" });
      tex.fromDataURL(result.dataUrl);
      tex.add(false, false);

      var g = makeGroup(label, SPAWN_PIVOT);
      var cubes = [];

      [0, 1].forEach(function (zi) {
        for (var iy = 0; iy < H; iy++) {
          for (var ix = 0; ix < W; ix++) {
            var a = data[(iy * W + ix) * 4 + 3];
            if (a < 10) continue;
            var worldY = H - 1 - iy;
            var c = makeCube("cube",
              [ox+ix, worldY,   oz+zi],
              [ox+ix+1, worldY+1, oz+zi+1],
              [ox+ix+0.5, worldY+0.5, oz+zi+0.5]
            );
            var u0 = ix, v0 = iy, u1 = ix+1, v1 = iy+1;
            Object.keys(c.faces).forEach(function (f) {
              c.faces[f].uv = [u0, v0, u1, v1];
              c.faces[f].texture = tex.uuid;
            });
            if (c.faces.south) c.faces.south.uv = [u1, v0, u0, v1];
            c.addTo(g);
            cubes.push(c);
          }
        }
      });

      Canvas.updateAll();
      Undo.finishEdit("Spawned " + label);
      return cubes;
    }).catch(function (e) {
      console.warn("[IGP] Handheld extrude failed:", e);
      Undo.initEdit({ elements: [], outliner: true });
      var c = makeCube(label, [ox, 0, oz], [ox+16, 16, oz+2], [ox+8, 8, oz+1]);
      createAndApplyTexture([c], label, "#9B9B9B");
      Canvas.updateAll();
      Undo.finishEdit("Spawned " + label);
    });
  }

  function spawnMace(label, entry) {
    label = label || "Mace";
    var p = getGridOffset(); var ox = p.ox, oz = p.oz;
    Undo.initEdit({ elements: [], outliner: true });
    var g = makeGroup(label, SPAWN_PIVOT);
    var head  = makeCube("mace_head", [ox+4, 9,   oz], [ox+12, 16, oz+2], [ox+8, 12, oz+1]);
    var shaft = makeCube("shaft",     [ox+6, 0,   oz], [ox+10, 9,  oz+2], [ox+8, 4.5, oz+1]);
    autoUV(head); autoUV(shaft);
    head.addTo(g); shaft.addTo(g);
    return finishSpawn([head, shaft], label, entry);
  }

  // â”€â”€â”€ Model JSON Loader â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  var modelCache = new Map();

  function fetchJson(url) {
    return fetch(url)
      .then(function (res) { return res.ok ? res.json() : null; })
      .catch(function () { return null; });
  }

  function mergeModel(parent, child) {
    return {
      parent:   child.parent,
      textures: Object.assign({}, parent.textures || {}, child.textures || {}),
      elements: child.elements || parent.elements,
    };
  }

  function resolveModelChain(version, modelRef, depth) {
    depth = depth || 0;
    if (depth > 10) return Promise.resolve({});
    if (modelCache.has(modelRef)) return Promise.resolve(modelCache.get(modelRef));

    var path = modelRef.replace(/^minecraft:/, '');
    var url = MCASSET_RAW + "/" + version + "/assets/minecraft/models/" + path + ".json";

    return fetchJson(url).then(function (model) {
      if (!model) return {};
      if (!model.parent || model.parent.startsWith('builtin/')) {
        modelCache.set(modelRef, model);
        return model;
      }
      return resolveModelChain(version, model.parent, depth + 1).then(function (parent) {
        var merged = mergeModel(parent, model);
        modelCache.set(modelRef, merged);
        return merged;
      });
    });
  }

  function resolveTexRef(textures, ref) {
    if (!ref) return null;
    var seen = new Set();
    while (ref && ref.startsWith('#')) {
      var key = ref.slice(1);
      if (seen.has(key) || !textures[key]) return null;
      seen.add(key);
      ref = textures[key];
    }
    return ref;
  }

  function texRefToUrl(version, ref) {
    if (!ref) return null;
    return MCASSET_CDN + "/" + version + "/assets/minecraft/textures/" + ref.replace(/^minecraft:/, '') + ".png";
  }

  // â”€â”€â”€ Model-Based Spawner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  function spawnFromModelJson(label, model, version, fallbackEntry) {
    var textures = model.textures || {};
    var elements = model.elements;
    var parent   = model.parent || '';

    // Flat/handheld items (no elements, uses layer0 texture)
    if (!elements) {
      var isHandheld = /handheld/.test(parent);
      var layer0ref  = resolveTexRef(textures, '#layer0');
      var texUrl     = layer0ref ? texRefToUrl(version, layer0ref) : fallbackEntry.url;
      var fakeEntry  = Object.assign({}, fallbackEntry, { url: texUrl });
      return isHandheld ? spawnHandheldItem(label, fakeEntry) : spawnExtrudedItem(label, fakeEntry);
    }

    // Collect all unique texture refs used in elements
    var texRefs = {};
    elements.forEach(function (el) {
      Object.keys(el.faces || {}).forEach(function (f) {
        var resolved = resolveTexRef(textures, el.faces[f].texture);
        if (resolved) texRefs[resolved] = texRefToUrl(version, resolved);
      });
    });

    // Load textures in parallel
    var loadPromises = Object.keys(texRefs).map(function (ref) {
      return resolveTexture(texRefs[ref])
        .then(function (dataUrl) { return { ref: ref, dataUrl: dataUrl }; })
        .catch(function () { return { ref: ref, dataUrl: null }; });
    });

    return Promise.all(loadPromises).then(function (results) {
      var p = getGridOffset(); var ox = p.ox, oz = p.oz;
      Undo.initEdit({ elements: [], outliner: true });

      // Create one BB Texture per unique texture
      var bbTexMap = {};
      results.forEach(function (r) {
        if (!r.dataUrl) return;
        var tex = new Texture({ name: r.ref.replace(/[:/]/g, '_') });
        tex.fromDataURL(r.dataUrl);
        tex.add(false, false);
        bbTexMap[r.ref] = tex.uuid;
      });

      var g = elements.length > 1 ? makeGroup(label, SPAWN_PIVOT) : null;
      var cubes = [];

      elements.forEach(function (el) {
        var from  = [el.from[0] + ox, el.from[1], el.from[2] + oz];
        var to    = [el.to[0]   + ox, el.to[1],   el.to[2]   + oz];
        var pivot = [(from[0]+to[0])/2, (from[1]+to[1])/2, (from[2]+to[2])/2];

        var c = makeCube("cube", from, to, pivot);

        // Element rotation
        if (el.rotation) {
          var r = el.rotation;
          c.rotation = [
            r.axis === 'x' ? -r.angle : 0,
            r.axis === 'y' ? -r.angle : 0,
            r.axis === 'z' ? -r.angle : 0,
          ];
          c.origin = r.origin
            ? [r.origin[0] + ox, r.origin[1], r.origin[2] + oz]
            : pivot;
        }

        // Thin element detection (cross model, flowers, etc.)
        var thickX = Math.abs(el.to[0] - el.from[0]);
        var thickZ = Math.abs(el.to[2] - el.from[2]);

        // Faces
        Object.keys(c.faces).forEach(function (f) {
          var modelFace = (el.faces || {})[f];
          if (!modelFace) {
            c.faces[f].texture = null;
            c.faces[f].uv = [0, 0, 0, 0];
            return;
          }
          var resolved = resolveTexRef(textures, modelFace.texture);
          c.faces[f].texture = resolved ? (bbTexMap[resolved] || null) : null;
          var uv = modelFace.uv ? modelFace.uv.slice() : [0, 0, 16, 16];
          // Flip UV horizontally on the opposite face of thin elements (mirror correction)
          if (thickZ < 2 && f === 'south') uv = [uv[2], uv[1], uv[0], uv[3]];
          if (thickX < 2 && f === 'east')  uv = [uv[2], uv[1], uv[0], uv[3]];
          c.faces[f].uv = uv;
          if (modelFace.rotation) c.faces[f].rotation = modelFace.rotation;
        });

        if (g) c.addTo(g);
        cubes.push(c);
      });

      Canvas.updateAll();
      Undo.finishEdit("Spawned " + label);
      return cubes;
    });
  }

  // --- Bed Spawner (head + foot as one group, 32x16) ---

  function mirrorModelZ(model) {
    if (!model.elements) return model;
    return Object.assign({}, model, {
      elements: model.elements.map(function (el) {
        var e = Object.assign({}, el);
        e.from = [el.from[0], el.from[1], 16 - el.to[2]];
        e.to   = [el.to[0],   el.to[1],   16 - el.from[2]];
        if (el.faces) {
          e.faces = Object.assign({}, el.faces);
          var origNorth = el.faces.north;
          var origSouth = el.faces.south;
          if (origSouth) e.faces.north = origSouth; else delete e.faces.north;
          if (origNorth) e.faces.south = origNorth; else delete e.faces.south;
        }
        if (el.rotation && el.rotation.origin) {
          e.rotation = Object.assign({}, el.rotation);
          e.rotation.origin = [el.rotation.origin[0], el.rotation.origin[1], 16 - el.rotation.origin[2]];
          if (el.rotation.axis === 'z') e.rotation.angle = -el.rotation.angle;
        }
        return e;
      })
    });
  }

  function applyModelElementsToCubes(modelParts, ox, oz, g, bbTexMap) {
    modelParts.forEach(function (pt) {
      var textures = pt.model.textures || {};
      (pt.model.elements || []).forEach(function (el) {
        var from  = [el.from[0] + ox, el.from[1], el.from[2] + oz + pt.zOff];
        var to    = [el.to[0]   + ox, el.to[1],   el.to[2]   + oz + pt.zOff];
        var pivot = [(from[0]+to[0])/2, (from[1]+to[1])/2, (from[2]+to[2])/2];
        var c = makeCube("cube", from, to, pivot);
        var thickX = Math.abs(el.to[0] - el.from[0]);
        var thickZ = Math.abs(el.to[2] - el.from[2]);

        Object.keys(c.faces).forEach(function (f) {
          var mf = (el.faces || {})[f];
          if (!mf) { c.faces[f].texture = null; c.faces[f].uv = [0,0,0,0]; return; }
          var resolved = resolveTexRef(textures, mf.texture);
          c.faces[f].texture = resolved ? (bbTexMap[resolved] || null) : null;
          var uv = mf.uv ? mf.uv.slice() : [0, 0, 16, 16];
          if (thickZ < 2 && f === 'south') uv = [uv[2], uv[1], uv[0], uv[3]];
          if (thickX < 2 && f === 'east')  uv = [uv[2], uv[1], uv[0], uv[3]];
          c.faces[f].uv = uv;
          if (mf.rotation) c.faces[f].rotation = mf.rotation;
        });

        if (el.rotation) {
          var r = el.rotation;
          c.rotation = [r.axis==='x'?-r.angle:0, r.axis==='y'?-r.angle:0, r.axis==='z'?-r.angle:0];
          c.origin   = r.origin ? [r.origin[0]+ox, r.origin[1], r.origin[2]+oz+pt.zOff] : pivot;
        }
        c.addTo(g);
      });
    });
  }

  function collectTexRefs(modelParts, version) {
    var allTexRefs = {};
    modelParts.forEach(function (pt) {
      var textures = pt.model.textures || {};
      (pt.model.elements || []).forEach(function (el) {
        Object.keys(el.faces || {}).forEach(function (f) {
          var resolved = resolveTexRef(textures, el.faces[f].texture);
          if (resolved) allTexRefs[resolved] = texRefToUrl(version, resolved);
        });
      });
    });
    return allTexRefs;
  }

  function loadTexMapFromRefs(allTexRefs) {
    return Promise.all(Object.keys(allTexRefs).map(function (ref) {
      return resolveTexture(allTexRefs[ref])
        .then(function (d) { return { ref: ref, dataUrl: d }; })
        .catch(function () { return { ref: ref, dataUrl: null }; });
    })).then(function (results) {
      var bbTexMap = {};
      results.forEach(function (r) {
        if (!r.dataUrl) return;
        var tex = new Texture({ name: r.ref.replace(/[:/]/g, '_') });
        tex.fromDataURL(r.dataUrl);
        tex.add(false, false);
        bbTexMap[r.ref] = tex.uuid;
      });
      return bbTexMap;
    });
  }

  // Fetch the model path for a specific blockstate variant
  function fetchBedModelPaths(version, id) {
    var bsUrl = MCASSET_RAW + "/" + version + "/assets/minecraft/blockstates/" + id + ".json";
    return fetchJson(bsUrl).then(function (bs) {
      if (!bs || !bs.variants) return { foot: null, head: null };
      var footPath = null, headPath = null;
      Object.keys(bs.variants).forEach(function (key) {
        var m = bs.variants[key];
        var modelRef = (Array.isArray(m) ? m[0] : m).model || '';
        modelRef = modelRef.replace(/^minecraft:/, '');
        if (/part=foot/.test(key) && /facing=north/.test(key)) footPath = modelRef;
        if (/part=head/.test(key) && /facing=north/.test(key)) headPath = modelRef;
      });
      // Fallback: any facing or first match
      if (!footPath || !headPath) {
        Object.keys(bs.variants).forEach(function (key) {
          var m = bs.variants[key];
          var modelRef = (Array.isArray(m) ? m[0] : m).model || '';
          modelRef = modelRef.replace(/^minecraft:/, '');
          if (!footPath && /part=foot/.test(key)) footPath = modelRef;
          if (!headPath && /part=head/.test(key)) headPath = modelRef;
        });
      }
      return { foot: footPath, head: headPath };
    }).catch(function () { return { foot: null, head: null }; });
  }

  function spawnBed(label, entry) {
    var version = entry.version || mcVersion;
    var id      = entry.id;
    var p = getGridOffset(); var ox = p.ox, oz = p.oz;

    return fetchBedModelPaths(version, id).then(function (paths) {
      var footRef = paths.foot || ('block/' + id);
      var headRef = paths.head || ('block/' + id);

      return Promise.all([
        resolveModelChain(version, footRef).catch(function () { return {}; }),
        resolveModelChain(version, headRef).catch(function () { return {}; }),
      ]).then(function (models) {
        var footModel = models[0];
        var headModel = models[1];
        var hasElements = (footModel.elements && footModel.elements.length) ||
                          (headModel.elements && headModel.elements.length);

        if (!hasElements) {
          // No elements in model JSON — fall back to two simple cubes
          return resolveTexture(entry.url).then(function (dataUrl) {
            Undo.initEdit({ elements: [], outliner: true });
            var tex = new Texture({ name: label.replace(/\s+/g, '_') + '_tex' });
            tex.fromDataURL(dataUrl);
            tex.add(false, false);
            var g = makeGroup(label, SPAWN_PIVOT);
            var foot = makeCube("foot", [ox,  0, oz],    [ox+16, 9, oz+16], [ox+8, 4.5, oz+8]);
            var head = makeCube("head", [ox,  0, oz+16], [ox+16, 9, oz+32], [ox+8, 4.5, oz+24]);
            [foot, head].forEach(function (c) {
              Object.keys(c.faces).forEach(function (f) {
                c.faces[f].uv = [0, 0, 16, 16];
                c.faces[f].texture = tex.uuid;
              });
              c.addTo(g);
            });
            Canvas.updateAll();
            Undo.finishEdit("Spawned " + label);
          });
        }

        var modelParts = [
          { model: headModel, zOff: 0  },
          { model: footModel, zOff: 16 },
        ];

        var allTexRefs = collectTexRefs(modelParts, version);
        return loadTexMapFromRefs(allTexRefs).then(function (bbTexMap) {
          Undo.initEdit({ elements: [], outliner: true });
          var g = makeGroup(label, SPAWN_PIVOT);
          applyModelElementsToCubes(modelParts, ox, oz, g, bbTexMap);
          Canvas.updateAll();
          Undo.finishEdit("Spawned " + label);
        });
      });
    });
  }

  // â”€â”€â”€ Spawn Router â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  function spawnFromEntry(entry) {
    var label   = entry.name;
    var version = entry.version || mcVersion;
    var id      = entry.id;

    // Beds: merge head/foot/base variants into a single group
    var bedBase = id.replace(/_(head|foot)$/, '');
    if (entry.category === 'block' && /_bed$/.test(bedBase)) {
      var bedEntry = Object.assign({}, entry, { id: bedBase, name: formatDisplayName(bedBase) });
      return spawnBed(formatDisplayName(bedBase), bedEntry);
    }

    return resolveModelChain(version, entry.category + "/" + id)
      .then(function (model) {
        if (model && (model.elements || model.textures)) {
          return spawnFromModelJson(label, model, version, entry);
        }
        return spawnFromEntry_fallback(entry);
      })
      .catch(function () { return spawnFromEntry_fallback(entry); });
  }

  function spawnFromEntry_fallback(entry) {
    var label = entry.name;
    var id    = entry.id;
    var cat   = entry.category;
    if (cat === "item")          return spawnExtrudedItem(label, entry);
    if (/heavy_core/.test(id))   return spawnHeavyCore(label, entry);
    if (/trapdoor/.test(id))     return spawnTrapdoor(label, entry);
    if (/fence/.test(id) && !/gate/.test(id)) return spawnFence(label, entry);
    if (/slab/.test(id))         return spawnSlab(label, entry);
    if (/stairs/.test(id))       return spawnStairs(label, entry);
    if (/_wall$|^wall$|_wall_/.test(id)) return spawnWall(label, entry);
    return spawnStandardBlock(label, entry);
  }

  // â”€â”€â”€ Lazy Icon Observer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  var iconObserver = null;

  function setupIconObserver(grid) {
    if (!grid || typeof IntersectionObserver === "undefined") {
      grid.querySelectorAll("canvas.igp-icon").forEach(function (canvas) {
        var url = canvas.getAttribute("data-url");
        if (url) drawTextureIcon(canvas, url);
      });
      return;
    }
    if (iconObserver) iconObserver.disconnect();
    iconObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (ent) {
        if (!ent.isIntersecting) return;
        var canvas = ent.target;
        var url = canvas.getAttribute("data-url");
        if (!url || canvas.dataset.loaded) return;
        canvas.dataset.loaded = "1";
        drawTextureIcon(canvas, url);
        iconObserver.unobserve(canvas);
      });
    }, { root: grid, rootMargin: "100px" });
    grid.querySelectorAll("canvas.igp-icon").forEach(function (canvas) {
      canvas.dataset.loaded = "";
      if (canvas.getAttribute("data-url")) iconObserver.observe(canvas);
    });
  }

  // â”€â”€â”€ Plugin â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  var styleEl = null;
  var igpPanel = null;
  var queryDebounceTimer = null;

  function createPanel() {
    igpPanel = new Panel("item_generator", {
      name: "Item Generator",
      icon: "fas.fa-cube",
      default_position: { slot: "right_bar" },
      growable: true,
      resizable: true,
      component: {
        template: [
          '<div class="igp-root">',
          '  <div v-if="!ready" class="igp-loading">',
          '    <div class="igp-loading-spinner"></div>',
          '    <span>{{ loadingText }}</span>',
          '  </div>',
          '  <template v-else>',
          '    <input class="igp-search" type="text" v-model="queryInput"',
          '      placeholder="Search blocks & itemsâ€¦" />',
          '    <div class="igp-tabs">',
          '      <button class="igp-tab" v-for="t in tabList" :key="t.id"',
          '        :class="{active: cat === t.id}" @click="setCat(t.id)">',
          '        {{ t.label }}',
          '      </button>',
          '    </div>',
          '    <div class="igp-grid" ref="grid">',
          '      <div class="igp-slot" v-for="entry in filtered" :key="entry.id + entry.category"',
          '        @click="doSpawn(entry)"',
          '        :title="entry.name + \' (MC \' + entry.version + \')\'"',
          '      >',
          '        <canvas class="igp-icon" width="56" height="56"',
          '          :data-url="entry.url"></canvas>',
          '        <div class="igp-slot-name">{{ entry.name }}</div>',
          '      </div>',
          '      <p v-if="filtered.length === 0" class="igp-empty">No textures found.</p>',
          '    </div>',
          '    <div class="igp-footer">{{ footerText }}</div>',
          '  </template>',
          '</div>',
        ].join("\n"),

        data: function () {
          return {
            ready: catalogReady,
            loadingText: "Loading Minecraft texturesâ€¦",
            queryInput: "",
            query: "",
            cat: "blocks",
          };
        },

        computed: {
          tabList: function () {
            return [
              { id: "blocks", label: "BLOCKS (" + CATALOG.blocks.length + ")" },
              { id: "items",  label: "ITEMS (" + CATALOG.items.length + ")" },
            ];
          },
          filtered: function () {
            var q = this.query.toLowerCase().trim();
            var items = CATALOG[this.cat] || [];
            if (!q) return items;
            return items.filter(function (entry) {
              if (entry.name.toLowerCase().indexOf(q) !== -1) return true;
              if (entry.id.indexOf(q) !== -1) return true;
              return entry.tags.some(function (tag) { return tag.indexOf(q) !== -1; });
            });
          },
          footerText: function () {
            var text = "MC " + mcVersion + " Â· mcasset.cloud";
            if (McAssetLoader.getError()) text += " Â· " + McAssetLoader.getError();
            return text;
          },
        },

        mounted: function () {
          var self = this;
          self.ready = catalogReady;
          self.$nextTick(function () { self.observeIcons(); });
        },

        watch: {
          cat: function () {
            var self = this;
            self.$nextTick(function () { self.observeIcons(); });
          },
          query: function () {
            var self = this;
            self.$nextTick(function () { self.observeIcons(); });
          },
          queryInput: function (val) {
            var self = this;
            if (queryDebounceTimer) clearTimeout(queryDebounceTimer);
            queryDebounceTimer = setTimeout(function () {
              self.query = val;
            }, 150);
          },
        },

        methods: {
          setCat: function (id) { this.cat = id; },

          observeIcons: function () {
            setupIconObserver(this.$refs.grid);
          },

          doSpawn: function (entry) {
            var self = this;
            spawnFromEntry(entry)
              .then(function () {
                Blockbench.showQuickMessage("âœ“ " + entry.name + " spawned", 1500);
              })
              .catch(function (e) {
                Blockbench.showQuickMessage("âœ— " + e.message, 2500);
                console.error("[IGP]", e);
              });
          },
        },
      },
    });
  }

  BBPlugin.register("item_generator", {
    title: "Item Generator",
    author: "Speaway",
    description: "Minecraft block & item generator with live vanilla textures from mcasset.cloud.",
    icon: "fas.fa-cube",
    version: "2.1.0",
    min_version: "4.10.0",
    variant: "desktop",
    await_loading: true,

    onload: function () {
      styleEl = document.createElement("style");
      styleEl.id = "igp_style";
      styleEl.textContent = CSS;
      document.head.appendChild(styleEl);

      var cached = null;
      try { cached = localStorage.getItem(LS_VERSION_KEY); } catch (e) { /* ignore */ }
      if (cached && cached !== mcVersion) clearTextureCache();

      return McAssetLoader.init().then(function (version) {
        console.log("[IGP] Catalog ready â€” MC " + version
          + " (" + CATALOG.blocks.length + " blocks, " + CATALOG.items.length + " items)");
        createPanel();
      }).catch(function (err) {
        console.error("[IGP] Init failed:", err);
        catalogReady = true;
        createPanel();
        Blockbench.showQuickMessage("IGP: catalog load failed â€” search may be empty", 3000);
      });
    },

    onunload: function () {
      if (iconObserver) { iconObserver.disconnect(); iconObserver = null; }
      if (queryDebounceTimer) clearTimeout(queryDebounceTimer);
      if (igpPanel) { igpPanel.delete(); igpPanel = null; }
      if (styleEl)  { styleEl.remove();  styleEl = null; }
    },
  });
})();
