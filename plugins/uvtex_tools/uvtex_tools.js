(function() {
  "use strict";
  function getTextureUVScale(texture) {
    return {
      scaleW: texture.width / texture.getUVWidth(),
      scaleH: texture.height / texture.getUVHeight()
    };
  }
  function getFacePixelRegion(face, texture) {
    const { scaleW, scaleH } = getTextureUVScale(texture);
    const [x1, y1, x2, y2] = face.uv;
    const pxW = Math.round(Math.abs((x2 - x1) * scaleW));
    const pxH = Math.round(Math.abs((y2 - y1) * scaleH));
    if (!pxW || !pxH) return null;
    return {
      x: Math.round(Math.min(x1, x2) * scaleW),
      y: Math.round(Math.min(y1, y2) * scaleH),
      w: pxW,
      h: pxH
    };
  }
  function getPixelRegionKey(region) {
    return `${region.x};${region.y};${region.w};${region.h}`;
  }
  function getUVSign(uv) {
    const [x1, y1, x2, y2] = uv;
    return {
      x: Math.sign(x2 - x1) || 1,
      y: Math.sign(y2 - y1) || 1
    };
  }
  function normalizeUVRegion(uv) {
    const [x1, y1, x2, y2] = uv;
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const maxX = Math.max(x1, x2);
    const maxY = Math.max(y1, y2);
    return [minX, minY, maxX, maxY].map(normalizeUVNumber).join(";");
  }
  function normalizeUVNumber(value) {
    return Number(value.toFixed(9)).toString();
  }
  function normalizeRotation(value) {
    return (value % 360 + 360) % 360;
  }
  function isCube(element) {
    return typeof element === "object" && element !== null && "type" in element && element.type === "cube";
  }
  function cubeHasTexture(cube, textureUUID) {
    return Object.values(cube.faces).some((face) => face.texture === textureUUID);
  }
  function getAllCubes() {
    return Project.elements.filter(isCube);
  }
  function getSelectedCubes() {
    return Outliner.selected.filter(isCube);
  }
  function getCubesForTexture(cubes, textureUUID) {
    return cubes.filter(
      (el) => Object.values(el.faces).some((face) => face.texture === textureUUID)
    );
  }
  function getCubeRegionSet(cube, textureUUID) {
    const regions = [];
    for (const face of Object.values(cube.faces)) {
      if (face.texture !== textureUUID) continue;
      regions.push(normalizeUVRegion(face.uv));
    }
    return [...new Set(regions)].sort();
  }
  function getUntexturedFaces(cubes) {
    const result = [];
    cubes.forEach((el) => {
      Object.entries(el.faces).forEach(([faceKey, face]) => {
        if (face.texture === false) {
          result.push({ face, faceKey, element: el });
        }
      });
    });
    return result;
  }
  function getTexturedFaces(cubes) {
    const result = [];
    cubes.forEach((el) => {
      Object.entries(el.faces).forEach(([faceKey, face]) => {
        if (typeof face.texture === "string") {
          result.push({ face, faceKey, element: el });
        }
      });
    });
    return result;
  }
  function setAsSelected(cubes) {
    Outliner.selected.splice(0);
    cubes.forEach((el) => {
      el.visibility = true;
      Outliner.selected.push(el);
    });
  }
  function showError(message, title = "Error") {
    Blockbench.showMessageBox({ title, message, icon: "error" });
  }
  function resolveSingleTextureProject(onDebug) {
    if (!Format.single_texture) return null;
    if (Project.selected_texture instanceof Texture) {
      onDebug?.({
        type: "single-texture-resolved",
        source: "project-selected",
        textureName: Project.selected_texture.name,
        textureUUID: Project.selected_texture.uuid
      });
      return Project.selected_texture;
    }
    if (Texture.all.length === 1) {
      const texture = Texture.all[0] ?? null;
      if (texture) {
        onDebug?.({
          type: "single-texture-resolved",
          source: "only-texture",
          textureName: texture.name,
          textureUUID: texture.uuid
        });
      }
      return texture;
    }
    if (Texture.all.length === 0) {
      onDebug?.({ type: "reject", reason: "no-textures" });
      showError("No textures found.", "No Texture");
      return null;
    }
    onDebug?.({
      type: "reject",
      reason: "single-texture-active-required",
      textureCount: Texture.all.length
    });
    showError(
      "Single texture project has multiple textures. Please select the active project texture before running this command.",
      "Active Texture Required"
    );
    return null;
  }
  function syncSingleTextureFaces(texture) {
    Project.selected_texture = texture;
    let syncedFaces = 0;
    getAllCubes().forEach((el) => {
      Object.values(el.faces).forEach((face) => {
        if (face.texture !== null) {
          face.texture = texture.uuid;
          syncedFaces++;
        }
      });
    });
    return syncedFaces;
  }
  function resolveAndSyncSingleTextureProject(onDebug) {
    const texture = resolveSingleTextureProject(onDebug);
    if (!texture) return null;
    const syncedFaces = syncSingleTextureFaces(texture);
    onDebug?.({
      type: "single-texture-sync",
      textureName: texture.name,
      textureUUID: texture.uuid,
      syncedFaces
    });
    return texture;
  }
  function resolveTextureUUID(cubes, messageContext, onDebug) {
    const textureUUIDs = [
      ...new Set(
        getTexturedFaces(cubes).map(({ face }) => face.texture).filter((texture) => typeof texture === "string")
      )
    ];
    if (textureUUIDs.length === 0) {
      onDebug?.({
        type: "reject",
        reason: "no-textured-faces",
        messageContext
      });
      Blockbench.showQuickMessage(
        `No textured faces found ${messageContext} - nothing to do.`,
        3e3
      );
      return null;
    }
    if (textureUUIDs.length > 1) {
      const names = textureUUIDs.map((id) => Texture.all.find((tex) => tex.uuid === id)?.name ?? id).join(", ");
      onDebug?.({
        type: "reject",
        reason: "multi-texture-selection",
        messageContext,
        textureUUIDs,
        textureNames: names
      });
      showError(
        `${messageContext} use ${textureUUIDs.length} different textures: ${names}. Select cubes that share one texture.`,
        "Multiple Textures"
      );
      return null;
    }
    onDebug?.({
      type: "texture-uuid-resolved",
      messageContext,
      textureUUID: textureUUIDs[0]
    });
    return textureUUIDs[0] ?? null;
  }
  function findTextureByUUID(textureUUID) {
    const texture = Texture.all.find((tex) => tex.uuid === textureUUID);
    if (!texture) {
      showError("Could not resolve texture. It may have been removed.", "Texture Not Found");
      return null;
    }
    return texture;
  }
  function rejectAnimatedTexture(texture) {
    const frameCount = texture.frameCount;
    if (frameCount === void 0) return false;
    showError(
      `Texture "${texture.name}" is animated (${frameCount} frames). This plugin does not support animated textures.`,
      "Animated Texture Not Supported"
    );
    return true;
  }
  function validateTexture(texture) {
    if (!texture) return null;
    if (rejectAnimatedTexture(texture)) return null;
    return texture;
  }
  function ensureProjectHasCubes() {
    if (!Project?.elements?.length) {
      showError("No active elements.");
      return false;
    }
    if (getAllCubes().length === 0) {
      showError("No cube elements found.", "No Cubes");
      return false;
    }
    return true;
  }
  function rejectBoxUVCubes(cubes) {
    const boxUVCubes = cubes.filter((cube) => cube.box_uv);
    if (boxUVCubes.length > 0) {
      setAsSelected(boxUVCubes);
      Canvas.updateAll();
      showError(
        `${boxUVCubes.length} selected cube(s) use Box UV and are now selected. This command only supports per-face UV.`,
        "Box UV Not Supported"
      );
      return true;
    }
    return false;
  }
  function resolveWorkingSetTexture(allCubes, selectedCubes, onDebug) {
    if (Format.single_texture) {
      return validateTexture(resolveAndSyncSingleTextureProject(onDebug));
    }
    const hintCubes = selectedCubes.length > 0 ? selectedCubes : allCubes;
    const textureUUID = resolveTextureUUID(
      hintCubes,
      selectedCubes.length > 0 ? "in selection" : "in project",
      onDebug
    );
    if (!textureUUID) return null;
    const texture = findTextureByUUID(textureUUID);
    if (!texture) return null;
    return validateTexture(texture);
  }
  function validateWorkingSetProject({
    expandByTexture,
    requireSelection = false,
    rejectUntexturedFaces = true,
    onDebug
  }) {
    if (!ensureProjectHasCubes()) return null;
    const allCubes = getAllCubes();
    const selectedCubes = getSelectedCubes();
    onDebug?.({
      type: "validation-start",
      validator: "working-set",
      selectedCubes: selectedCubes.length,
      allCubes: allCubes.length,
      expandByTexture
    });
    if (requireSelection && selectedCubes.length === 0) {
      onDebug?.({ type: "reject", reason: "no-selection" });
      showError("Select at least one cube before running this command.", "No Cubes Selected");
      return null;
    }
    const texture = resolveWorkingSetTexture(allCubes, selectedCubes, onDebug);
    if (!texture) return null;
    const cubes = expandByTexture ? getCubesForTexture(allCubes, texture.uuid) : selectedCubes;
    onDebug?.({
      type: "texture-resolved",
      textureName: texture.name,
      textureUUID: texture.uuid
    });
    onDebug?.({
      type: "working-set-resolved",
      cubes: cubes.length,
      selectedCubes: selectedCubes.length,
      expanded: expandByTexture
    });
    const boxUVCubes = cubes.filter((cube) => cube.box_uv);
    if (boxUVCubes.length > 0) {
      onDebug?.({
        type: "reject",
        reason: "box-uv",
        cubes: boxUVCubes.length
      });
      if (rejectBoxUVCubes(cubes)) return null;
    }
    if (rejectUntexturedFaces) {
      const untexturedFaces = getUntexturedFaces(cubes);
      if (untexturedFaces.length) {
        onDebug?.({
          type: "reject",
          reason: "untextured-faces",
          faces: untexturedFaces.length,
          cubes: new Set(untexturedFaces.map(({ element }) => element)).size
        });
        const untexturedCubes = [...new Set(untexturedFaces.map(({ element }) => element))];
        setAsSelected(untexturedCubes);
        Canvas.updateAll();
        showError(
          `${untexturedFaces.length} face(s) have UV coordinates but no assigned texture and are now selected. Please assign a texture to them or disable them before running.`,
          "Faces Without Texture"
        );
        return null;
      }
    }
    return { cubes, texture };
  }
  function validateSelectionTextureProject(options = {}) {
    if (!ensureProjectHasCubes()) return null;
    const { onDebug } = options;
    const selectedCubes = getSelectedCubes();
    onDebug?.({
      type: "validation-start",
      validator: "selection-texture",
      selectedCubes: selectedCubes.length,
      allCubes: getAllCubes().length
    });
    if (selectedCubes.length === 0) {
      onDebug?.({ type: "reject", reason: "no-selection" });
      showError(
        "Select at least one cube before searching for matching UVs.",
        "No Cubes Selected"
      );
      return null;
    }
    let texture;
    if (Format.single_texture) {
      texture = resolveAndSyncSingleTextureProject(onDebug);
    } else {
      const textureUUID = resolveTextureUUID(selectedCubes, "in selection", onDebug);
      if (!textureUUID) return null;
      texture = findTextureByUUID(textureUUID);
    }
    if (!texture) return null;
    if (rejectAnimatedTexture(texture)) return null;
    onDebug?.({
      type: "texture-resolved",
      textureName: texture.name,
      textureUUID: texture.uuid
    });
    return { selectedCubes, texture, textureUUID: texture.uuid };
  }
  function analyzeTextureUsage$1(cubes, texture) {
    const textureCubes = /* @__PURE__ */ new Set();
    const regionsByKey = /* @__PURE__ */ new Map();
    let textureFaces = 0;
    let disabledFaces = 0;
    let validUVRegions = 0;
    let faceUVArea = 0;
    cubes.forEach((cube) => {
      let cubeUsesTexture = false;
      Object.values(cube.faces).forEach((face) => {
        if (face.texture === null) {
          disabledFaces++;
          return;
        }
        if (face.texture !== texture.uuid) return;
        textureFaces++;
        cubeUsesTexture = true;
        const region = getFacePixelRegion(face, texture);
        if (!region) return;
        validUVRegions++;
        const area = region.w * region.h;
        faceUVArea += area;
        const key = getPixelRegionKey(region);
        const stats = regionsByKey.get(key);
        if (stats) {
          stats.count++;
        } else {
          regionsByKey.set(key, { region, count: 1, area });
        }
      });
      if (cubeUsesTexture) textureCubes.add(cube);
    });
    const distinctRegions = [...regionsByKey.values()];
    const coverage = computeCoverage(
      distinctRegions.map(({ region }) => region),
      texture
    );
    const textureArea = texture.width * texture.height;
    const distinctUVRegions = distinctRegions.length;
    const singleUseUVRegions = distinctRegions.filter(({ count }) => count === 1).length;
    const sharedUVRegions = distinctRegions.filter(({ count }) => count > 1).length;
    const sharedUVRegionRefs = distinctRegions.reduce(
      (sum, { count }) => sum + (count > 1 ? count : 0),
      0
    );
    const usedBounds = coverage.usedBounds;
    const boundsSquareness = usedBounds ? Math.min(usedBounds.w, usedBounds.h) / Math.max(usedBounds.w, usedBounds.h) : 0;
    return {
      overview: {
        textureName: texture.name,
        textureUUID: texture.uuid,
        textureSize: `${texture.width}x${texture.height}`,
        textureArea,
        textureCubes: textureCubes.size,
        textureFaces,
        disabledFaces,
        validUVRegions,
        distinctUVRegions,
        singleUseUVRegions,
        sharedUVRegions,
        uvReuse: safeRatio(sharedUVRegionRefs, validUVRegions)
      },
      pixelUsage: {
        individualFaceUVArea: faceUVArea,
        usedPixelArea: coverage.coveredTextureArea,
        textureCoverage: safeRatio(coverage.coveredTextureArea, textureArea)
      },
      packingScore: {
        bounds: usedBounds,
        boundsArea: coverage.boundsArea,
        boundsFill: safeRatio(coverage.coveredTextureArea, coverage.boundsArea),
        compactness: 1 - safeRatio(coverage.boundsArea, textureArea),
        boundsSquareness,
        unusedAreaInsideBounds: coverage.boundsArea - coverage.coveredTextureArea
      }
    };
  }
  function computeCoverage(regions, texture) {
    if (texture.width <= 0 || texture.height <= 0) {
      return { coveredTextureArea: 0, usedBounds: null, boundsArea: 0 };
    }
    const used = new Uint8Array(texture.width * texture.height);
    let coveredTextureArea = 0;
    let minX = texture.width;
    let minY = texture.height;
    let maxX = -1;
    let maxY = -1;
    regions.forEach((region) => {
      const startX = clamp(region.x, 0, texture.width);
      const startY = clamp(region.y, 0, texture.height);
      const endX = clamp(region.x + region.w, 0, texture.width);
      const endY = clamp(region.y + region.h, 0, texture.height);
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const index = y * texture.width + x;
          if (used[index]) continue;
          used[index] = 1;
          coveredTextureArea++;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    });
    if (coveredTextureArea === 0) {
      return { coveredTextureArea, usedBounds: null, boundsArea: 0 };
    }
    const usedBounds = {
      x: minX,
      y: minY,
      w: maxX - minX + 1,
      h: maxY - minY + 1
    };
    return {
      coveredTextureArea,
      usedBounds,
      boundsArea: usedBounds.w * usedBounds.h
    };
  }
  function safeRatio(value, total) {
    return total > 0 ? value / total : 0;
  }
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  function formatNumber(value) {
    return Math.round(value).toLocaleString();
  }
  function formatPixels(value) {
    return `${formatNumber(value)} px`;
  }
  function formatPercent(value) {
    return `${(value * 100).toFixed(1)}%`;
  }
  function formatBounds(bounds) {
    if (!bounds) return "none";
    return `[${bounds.x}; ${bounds.y}] ${bounds.w}x${bounds.h}`;
  }
  function buildTextureHeader(report) {
    const header = document.createElement("div");
    header.style.display = "grid";
    header.style.gap = "2px";
    header.style.borderBottom = "1px solid var(--color-border)";
    header.style.paddingBottom = "10px";
    const topLine = document.createElement("div");
    topLine.style.display = "grid";
    topLine.style.gridTemplateColumns = "minmax(0, 1fr) auto";
    topLine.style.alignItems = "baseline";
    topLine.style.gap = "12px";
    const name = document.createElement("div");
    name.textContent = report.overview.textureName;
    name.title = report.overview.textureName;
    name.style.fontSize = "32px";
    name.style.fontWeight = "800";
    name.style.overflow = "hidden";
    name.style.overflowWrap = "anywhere";
    name.style.lineHeight = "1.1";
    name.style.minWidth = "0";
    const size = document.createElement("div");
    size.textContent = report.overview.textureSize;
    size.style.color = "var(--color-subtle_text)";
    size.style.fontVariantNumeric = "tabular-nums";
    size.style.whiteSpace = "nowrap";
    const scope = document.createElement("div");
    scope.textContent = `Used by ${formatNumber(report.overview.textureCubes)} cube(s) / ${formatNumber(report.overview.textureFaces)} face(s)`;
    scope.style.color = "var(--color-subtle_text)";
    scope.style.fontSize = "12px";
    topLine.append(name, size);
    header.append(topLine, scope);
    return header;
  }
  function buildSummaryCards(cards) {
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(3, minmax(0, 1fr))";
    grid.style.gap = "8px";
    cards.forEach(({ label, value, detail }) => {
      grid.append(buildSummaryCard(label, value, detail));
    });
    return grid;
  }
  function buildSummaryCard(label, value, detail) {
    const card = document.createElement("div");
    card.style.border = "1px solid var(--color-border)";
    card.style.borderRadius = "6px";
    card.style.padding = "10px";
    card.style.display = "grid";
    card.style.gap = "4px";
    card.style.minWidth = "0";
    const labelNode = document.createElement("div");
    labelNode.textContent = label;
    labelNode.style.fontSize = "16px";
    const valueNode = document.createElement("div");
    valueNode.textContent = value;
    valueNode.style.fontSize = "24px";
    valueNode.style.fontWeight = "700";
    valueNode.style.fontVariantNumeric = "tabular-nums";
    const detailNode = document.createElement("div");
    detailNode.textContent = detail;
    detailNode.style.color = "var(--color-subtle_text)";
    detailNode.style.opacity = "0.75";
    detailNode.style.fontSize = "14px";
    detailNode.style.lineHeight = "1.25";
    card.append(labelNode, valueNode, detailNode);
    return card;
  }
  function showTextureUsageReport(report) {
    new Dialog({
      id: "analyze_texture_usage_dialog",
      title: "Analyze Texture Usage",
      icon: "fa-chart-pie",
      width: 760,
      singleButton: true,
      lines: [buildReportNode(report)]
    }).show();
  }
  function buildReportNode(report) {
    const root = document.createElement("div");
    root.style.display = "grid";
    root.style.gap = "14px";
    root.style.boxSizing = "border-box";
    root.style.margin = "4px";
    root.style.padding = "8px";
    root.append(
      buildTextureHeader(report),
      buildSummaryCards(buildSummaryRows(report)),
      buildSection("Usage", buildUsageRows(report)),
      buildSection("UV", buildUVRows(report)),
      buildSection("Texture", buildTextureRows(report)),
      buildSection("Packing Score", buildPackingRows(report))
    );
    return root;
  }
  function buildSummaryRows(report) {
    return [
      {
        label: "Texture Utilization",
        value: formatPercent(report.pixelUsage.textureCoverage),
        detail: `${formatNumber(report.pixelUsage.usedPixelArea)} / ${formatNumber(report.overview.textureArea)} px covered`
      },
      {
        label: "UV Reuse",
        value: formatPercent(report.overview.uvReuse),
        detail: `${formatNumber(report.overview.sharedUVRegions)} shared / ${formatNumber(report.overview.distinctUVRegions)} distinct rects`
      },
      {
        label: "Bounds Fill",
        value: formatPercent(report.packingScore.boundsFill),
        detail: "pixels covered inside bounds"
      }
    ];
  }
  function buildUsageRows(report) {
    return [
      {
        label: "Cubes using texture",
        value: formatNumber(report.overview.textureCubes)
      },
      {
        label: "Faces using texture",
        value: formatNumber(report.overview.textureFaces)
      },
      {
        label: "Disabled faces",
        value: formatNumber(report.overview.disabledFaces)
      }
    ];
  }
  function buildUVRows(report) {
    return [
      {
        label: "Valid UV regions",
        value: formatNumber(report.overview.validUVRegions),
        description: "non-zero face UV rects"
      },
      {
        label: "Individual Face UV Area",
        value: formatPixels(report.pixelUsage.individualFaceUVArea),
        description: "summed face UV area, with overlaps counted"
      },
      {
        label: "Distinct UV regions",
        value: formatNumber(report.overview.distinctUVRegions),
        description: "different exact UV rects"
      },
      {
        label: "Single-use UV regions",
        value: formatNumber(report.overview.singleUseUVRegions),
        description: "distinct UV rects used once"
      },
      {
        label: "Shared UV regions",
        value: formatNumber(report.overview.sharedUVRegions),
        description: "distinct UV rects used more than once"
      },
      {
        label: "UV reuse",
        value: formatPercent(report.overview.uvReuse),
        description: "face UV refs pointing to shared regions"
      }
    ];
  }
  function buildTextureRows(report) {
    return [
      {
        label: "Covered texture pixels",
        value: formatPixels(report.pixelUsage.usedPixelArea),
        description: "union area of all valid UV rects"
      },
      {
        label: "Texture coverage",
        value: formatPercent(report.pixelUsage.textureCoverage),
        description: "covered pixels / texture area"
      }
    ];
  }
  function buildPackingRows(report) {
    return [
      {
        label: "Bounds",
        value: formatBounds(report.packingScore.bounds),
        description: "AABB of covered pixels"
      },
      {
        label: "Bounds area",
        value: formatPixels(report.packingScore.boundsArea),
        description: "area of used AABB"
      },
      {
        label: "Unused Area Inside Bounds",
        value: formatPixels(report.packingScore.unusedAreaInsideBounds),
        description: "empty pixels inside used AABB"
      },
      {
        label: "Compactness",
        value: formatPercent(report.packingScore.compactness),
        description: "unused texture area outside bounds"
      },
      {
        label: "Bounds fill",
        value: formatPercent(report.packingScore.boundsFill),
        description: "covered pixels / bounds area"
      },
      {
        label: "Bounds squareness",
        value: formatPercent(report.packingScore.boundsSquareness),
        description: "used bounds aspect balance"
      }
    ];
  }
  function buildSection(title, rows) {
    const section = document.createElement("section");
    section.style.display = "grid";
    section.style.gap = "8px";
    const heading = document.createElement("h3");
    heading.textContent = title;
    heading.style.margin = "0";
    heading.style.fontSize = "16px";
    heading.style.fontWeight = "700";
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "minmax(0, 1fr) minmax(max-content, 160px)";
    grid.style.columnGap = "18px";
    grid.style.rowGap = "6px";
    rows.forEach(({ label, value, description }) => {
      const labelWrap = document.createElement("div");
      labelWrap.style.display = "grid";
      labelWrap.style.gap = "1px";
      labelWrap.style.minWidth = "0";
      const labelNode = document.createElement("div");
      labelNode.textContent = label;
      labelNode.style.overflowWrap = "anywhere";
      labelWrap.append(labelNode);
      if (description) {
        const descriptionNode = document.createElement("div");
        descriptionNode.textContent = description;
        descriptionNode.style.color = "var(--color-subtle_text)";
        descriptionNode.style.fontSize = "12px";
        descriptionNode.style.opacity = "0.75";
        labelWrap.append(descriptionNode);
      }
      const valueNode = document.createElement("div");
      valueNode.textContent = value;
      valueNode.style.fontVariantNumeric = "tabular-nums";
      valueNode.style.fontWeight = "600";
      valueNode.style.textAlign = "right";
      valueNode.style.overflowWrap = "anywhere";
      grid.append(labelWrap, valueNode);
    });
    section.append(heading, grid);
    return section;
  }
  const EPSILON = 1e-6;
  const PLUGIN_ID = "uvtex_tools";
  const PLUGIN_VERSION = "1.0.0";
  const MIN_ATLAS_SIZE = 2;
  const MAX_ATLAS_SIZE = 4096;
  const DEBUG_STORAGE_KEY = `${PLUGIN_ID}.debug`;
  function prefix(scope, message) {
    return `[${PLUGIN_ID}] [${scope}] ${message}`;
  }
  function isDebugEnabled() {
    return localStorage.getItem(DEBUG_STORAGE_KEY) === "1";
  }
  function debugLog(scope, message, data) {
    if (!isDebugEnabled()) return;
    if (data === void 0) {
      console.debug(prefix(scope, message));
      return;
    }
    console.debug(prefix(scope, message), data);
  }
  function debugTable(scope, label, rows) {
    if (!isDebugEnabled()) return;
    console.debug(prefix(scope, label));
    console.table(rows);
  }
  function debugError(scope, message, error) {
    console.error(prefix(scope, message), error);
  }
  function installDebugControls() {
    globalThis.UVTexToolsDebug = {
      enable() {
        localStorage.setItem(DEBUG_STORAGE_KEY, "1");
        console.info(prefix("debug", "Debug logs enabled"));
        return true;
      },
      disable() {
        localStorage.removeItem(DEBUG_STORAGE_KEY);
        console.info(prefix("debug", "Debug logs disabled"));
        return false;
      },
      status() {
        const enabled = isDebugEnabled();
        console.info(prefix("debug", `Debug logs ${enabled ? "enabled" : "disabled"}`));
        return enabled;
      }
    };
  }
  function uninstallDebugControls() {
    globalThis.UVTexToolsDebug = void 0;
  }
  function analyzeTextureUsage() {
    const project = validateWorkingSetProject({
      expandByTexture: true,
      requireSelection: false,
      rejectUntexturedFaces: false,
      onDebug: (event) => debugLog("analyze_texture_usage", "Validation", event)
    });
    if (!project) return;
    const report = analyzeTextureUsage$1(project.cubes, project.texture);
    debugLog("analyze_texture_usage", "Summary", report);
    showTextureUsageReport(report);
  }
  const CANVAS_BUF = document.createElement("canvas");
  const canvasContext = CANVAS_BUF.getContext("2d", {
    willReadFrequently: true
  });
  if (!canvasContext) {
    throw new Error("Could not create a 2D canvas context.");
  }
  const CANVAS_CTX_BUF = canvasContext;
  CANVAS_CTX_BUF.imageSmoothingEnabled = false;
  const FLAT_FACE_PAIRS = {
    x: ["east", "west"],
    y: ["up", "down"],
    z: ["north", "south"]
  };
  function collectFacesForTexture(cubes, texture) {
    const faces = [];
    cubes.forEach((cube) => {
      Object.values(cube.faces).forEach((face) => {
        if (face.texture === null) return;
        if (face.texture === false || face.texture === void 0) {
          throw new Error(`Invalid texture value for cube ${cube.name}`);
        }
        if (face.texture !== texture.uuid) {
          throw new Error(
            `Face texture "${face.texture}" does not match texture "${texture.uuid}" for cube ${cube.name}`
          );
        }
        const sample = sampleFacePixels(face, texture);
        faces.push({
          element: cube,
          face,
          meta: sample ?? { width: 0, height: 0, textureData: null }
        });
      });
    });
    return faces;
  }
  function sampleFacePixels(face, tex) {
    const region = getFacePixelRegion(face, tex);
    if (!region) return null;
    CANVAS_BUF.width = region.w;
    CANVAS_BUF.height = region.h;
    CANVAS_CTX_BUF.drawImage(
      tex.img,
      region.x,
      region.y,
      region.w,
      region.h,
      0,
      0,
      region.w,
      region.h
    );
    const { data: textureData } = CANVAS_CTX_BUF.getImageData(0, 0, region.w, region.h);
    return { width: region.w, height: region.h, textureData };
  }
  function getActiveTextureUUID(face) {
    return typeof face.texture === "string" ? face.texture : null;
  }
  function getFlatAxes(cube) {
    const axes = [];
    if (Math.abs(cube.to[0] - cube.from[0]) <= EPSILON) axes.push("x");
    if (Math.abs(cube.to[1] - cube.from[1]) <= EPSILON) axes.push("y");
    if (Math.abs(cube.to[2] - cube.from[2]) <= EPSILON) axes.push("z");
    return axes;
  }
  function collectDisableFaces(cubes, texture) {
    const faces = [];
    cubes.forEach((cube) => {
      Object.values(cube.faces).forEach((face) => {
        if (isBlankFace(face)) {
          faces.push({
            element: cube,
            face,
            meta: { width: 0, height: 0, textureData: null }
          });
          return;
        }
        if (face.texture === null) return;
        if (face.texture !== texture.uuid) return;
        faces.push({
          element: cube,
          face,
          meta: sampleFacePixels(face, texture) ?? {
            width: 0,
            height: 0,
            textureData: null
          }
        });
      });
    });
    return faces;
  }
  function getBlankFaceEntries(faces) {
    return faces.filter(({ face }) => isBlankFace(face));
  }
  function isBlankFace(face) {
    const texture = face.texture;
    return texture === false || texture === void 0;
  }
  function buildPixelTransforms() {
    const rotations = [0, 180, 90, 270];
    const flips = [
      { flipX: false, flipY: false },
      { flipX: true, flipY: false },
      { flipX: false, flipY: true },
      { flipX: true, flipY: true }
    ];
    const transforms = [];
    rotations.forEach((rotation) => {
      flips.forEach(({ flipX, flipY }) => {
        transforms.push({ rotation, flipX, flipY });
      });
    });
    return transforms;
  }
  function newIdentityTransform() {
    return { rotation: 0, flipX: false, flipY: false };
  }
  function comparePixels(a, b) {
    for (const transform of buildPixelTransforms()) {
      if (arePixelsEqual(a, b, transform)) {
        return { similar: true, transform };
      }
    }
    return { similar: false };
  }
  function arePixelsEqual(a, b, transform) {
    const size = getTransformedSize(b.width, b.height, transform.rotation);
    if (a.width !== size.width || a.height !== size.height) return false;
    if (!a.textureData || !b.textureData) return false;
    for (let y = 0; y < a.height; y++) {
      for (let x = 0; x < a.width; x++) {
        const src = mapTransformedPixelToSource(x, y, b.width, b.height, transform);
        const i = (y * a.width + x) * 4;
        const j = (src.y * b.width + src.x) * 4;
        if (!rgbaEquals(a.textureData, i, b.textureData, j)) {
          return false;
        }
      }
    }
    return true;
  }
  function rgbaEquals(a, aIndex, b, bIndex) {
    return a[aIndex] === b[bIndex] && a[aIndex + 1] === b[bIndex + 1] && a[aIndex + 2] === b[bIndex + 2] && a[aIndex + 3] === b[bIndex + 3];
  }
  function isFullyTransparent(textureData) {
    if (textureData.length === 0) return true;
    for (let i = 3; i < textureData.length; i += 4) {
      if (textureData[i] !== 0) return false;
    }
    return true;
  }
  function getSolidRGBA(textureData) {
    if (textureData.length < 4) return null;
    for (let i = 4; i < textureData.length; i += 4) {
      if (!rgbaEquals(textureData, 0, textureData, i)) return null;
    }
    return readRGBA(textureData, 0);
  }
  function readRGBA(textureData, index) {
    return [
      textureData[index] ?? 0,
      textureData[index + 1] ?? 0,
      textureData[index + 2] ?? 0,
      textureData[index + 3] ?? 0
    ];
  }
  function copyRGBA(source, sourceIndex, target, targetIndex) {
    target[targetIndex] = source[sourceIndex] ?? 0;
    target[targetIndex + 1] = source[sourceIndex + 1] ?? 0;
    target[targetIndex + 2] = source[sourceIndex + 2] ?? 0;
    target[targetIndex + 3] = source[sourceIndex + 3] ?? 0;
  }
  function getRGBAKey(textureData, index) {
    return `${textureData[index] ?? 0},${textureData[index + 1] ?? 0},${textureData[index + 2] ?? 0},${textureData[index + 3] ?? 0}`;
  }
  function getTransformedSize(width, height, rotation) {
    return rotation === 90 || rotation === 270 ? { width: height, height: width } : { width, height };
  }
  function mapTransformedPixelToSource(pxX, pxY, sourceW, sourceH, transform) {
    const outSize = getTransformedSize(sourceW, sourceH, transform.rotation);
    const tx = transform.flipX ? outSize.width - 1 - pxX : pxX;
    const ty = transform.flipY ? outSize.height - 1 - pxY : pxY;
    switch (transform.rotation) {
      case 90:
        return { x: ty, y: sourceH - 1 - tx };
      case 180:
        return { x: sourceW - 1 - tx, y: sourceH - 1 - ty };
      case 270:
        return { x: sourceW - 1 - ty, y: tx };
      default:
        return { x: tx, y: ty };
    }
  }
  function processEmptyFaces(faces, options) {
    let zeroSized = 0;
    let transparent = 0;
    let blank = 0;
    const affectedElements = /* @__PURE__ */ new Set();
    const fullyEmptyElements = /* @__PURE__ */ new Set();
    const facesByElement = groupFacesByElement(faces);
    facesByElement.forEach((elementFaces, element) => {
      let activeFacesLeft = 0;
      elementFaces.forEach(({ face, meta }) => {
        let wasDisabled = false;
        if (isBlankFace(face)) {
          if (options.blank) {
            disableFace(face);
            blank++;
            wasDisabled = true;
          }
        } else if (!meta.textureData) {
          if (options.zero_sized) {
            disableFace(face);
            zeroSized++;
            wasDisabled = true;
          }
        } else if (options.transparent && isFullyTransparent(meta.textureData)) {
          disableFace(face);
          transparent++;
          wasDisabled = true;
        }
        if (!wasDisabled && face.texture !== null) {
          activeFacesLeft++;
        }
        if (wasDisabled) {
          affectedElements.add(element);
        }
      });
      if (activeFacesLeft === 0) {
        fullyEmptyElements.add(element);
      }
    });
    return {
      stats: {
        total: zeroSized + transparent + blank,
        zeroSized,
        transparent,
        blank
      },
      affectedElements,
      fullyEmptyElements
    };
  }
  function groupFacesByElement(faces) {
    const facesByElement = /* @__PURE__ */ new Map();
    faces.forEach((item) => {
      const elementFaces = facesByElement.get(item.element) ?? [];
      elementFaces.push(item);
      facesByElement.set(item.element, elementFaces);
    });
    return facesByElement;
  }
  function disableFace(face) {
    face.texture = null;
  }
  function disableEmptyFaces(expandWorkingSet2 = true) {
    const project = validateWorkingSetProject({
      expandByTexture: expandWorkingSet2,
      requireSelection: !expandWorkingSet2,
      rejectUntexturedFaces: false,
      onDebug: (event) => debugLog("disable_empty_faces", "Validation", event)
    });
    if (!project) return;
    const { cubes, texture } = project;
    const dialog = new Dialog({
      id: "disable_empty_faces_dialog",
      title: "Disable Empty Faces",
      form: {
        zero_sized: { label: "Zero-sized faces", type: "checkbox", value: true },
        transparent: {
          label: "Fully transparent faces",
          type: "checkbox",
          value: true
        },
        blank: { label: "Blank faces", type: "checkbox", value: true }
      },
      onConfirm: (formData) => {
        executeDisableEmptyFaces(cubes, texture, formData);
      }
    });
    dialog.show();
  }
  function executeDisableEmptyFaces(cubes, texture, formData) {
    try {
      const faces = collectDisableFaces(cubes, texture);
      if (rejectBlankFacesIfNeeded(faces, formData)) return;
      Undo.initEdit({ selection: true, elements: cubes });
      try {
        const result = processEmptyFaces(faces, formData);
        debugLog("disable_empty_faces", "Summary", {
          cubes: cubes.length,
          sampledFaces: faces.length,
          zeroSized: result.stats.zeroSized,
          transparent: result.stats.transparent,
          blank: result.stats.blank,
          affectedCubes: result.affectedElements.size,
          fullyEmptyCubes: result.fullyEmptyElements.size
        });
        if (result.affectedElements.size !== 0) {
          setAsSelected(result.affectedElements);
          Canvas.updateAll();
        }
        showDisableResultMessage(result);
        if (result.fullyEmptyElements.size > 0) {
          confirmDeleteEmptyCubes(result.fullyEmptyElements);
        }
      } finally {
        Undo.finishEdit("disable empty uv faces");
      }
    } catch (e) {
      debugError("disable_empty_faces", "Failed to disable empty faces", e);
      showError(`Failed to disable empty faces: ${e}`);
    }
  }
  function rejectBlankFacesIfNeeded(faces, options) {
    const blankFaces = getBlankFaceEntries(faces);
    if (blankFaces.length === 0 || options.blank) return false;
    const blankCubes = new Set(blankFaces.map(({ element }) => element));
    setAsSelected(blankCubes);
    Canvas.updateAll();
    showError(
      `${blankFaces.length} blank face(s) have no assigned texture and are now selected. Enable Blank faces to disable them.`,
      "Blank Faces"
    );
    return true;
  }
  function confirmDeleteEmptyCubes(emptyCubes) {
    const dialog = new Dialog({
      id: "delete_empty_cubes_confirm",
      title: "Delete Empty Cubes?",
      lines: [
        `<p><strong>${emptyCubes.size}</strong> cube(s) currently have no active faces.</p><p>Do you want to delete them?</p>`
      ],
      buttons: ["Delete", "Keep"],
      onButton: (index) => {
        if (index === 0) {
          executeDeleteEmptyCubes(emptyCubes);
        } else {
          setAsSelected(emptyCubes);
        }
      }
    });
    dialog.show();
  }
  function executeDeleteEmptyCubes(emptyCubes) {
    Undo.initEdit({ selection: true, elements: Project.elements });
    try {
      const toRemove = Array.from(emptyCubes);
      toRemove.forEach((cube) => {
        cube.remove();
      });
      Canvas.updateAll();
      Blockbench.showQuickMessage(`Deleted ${toRemove.length} empty cube(s)`, 3e3);
    } catch (e) {
      debugError("disable_empty_faces", "Failed to delete empty cubes", e);
      showError(`Failed to delete empty cubes: ${e}`);
    } finally {
      Undo.finishEdit("delete empty cubes");
    }
  }
  function showDisableResultMessage(result) {
    const { stats, fullyEmptyElements } = result;
    const { total, zeroSized, transparent } = stats;
    if (total === 0) {
      Blockbench.showQuickMessage("No empty faces found", 3e3);
      return;
    }
    const parts = [];
    if (zeroSized > 0) parts.push(`${zeroSized} zero-sized`);
    if (transparent > 0) parts.push(`${transparent} transparent`);
    if (stats.blank > 0) parts.push(`${stats.blank} blank`);
    let msg = `Disabled ${parts.join(", ")} face(s)`;
    if (fullyEmptyElements.size > 0) {
      msg += `
${fullyEmptyElements.size} cube(s) have no active faces`;
    }
    Blockbench.showQuickMessage(msg, 5e3);
  }
  const FACE_ORIENTATIONS = {
    north: {
      horizontal: 0,
      horizontalInverted: true,
      vertical: 1,
      verticalInverted: true,
      normal: 2,
      normalDirection: -1
    },
    south: {
      horizontal: 0,
      horizontalInverted: false,
      vertical: 1,
      verticalInverted: true,
      normal: 2,
      normalDirection: 1
    },
    west: {
      horizontal: 2,
      horizontalInverted: false,
      vertical: 1,
      verticalInverted: true,
      normal: 0,
      normalDirection: -1
    },
    east: {
      horizontal: 2,
      horizontalInverted: true,
      vertical: 1,
      verticalInverted: true,
      normal: 0,
      normalDirection: 1
    },
    up: {
      horizontal: 0,
      horizontalInverted: false,
      vertical: 2,
      verticalInverted: false,
      normal: 1,
      normalDirection: 1
    },
    down: {
      horizontal: 0,
      horizontalInverted: false,
      vertical: 2,
      verticalInverted: true,
      normal: 1,
      normalDirection: -1
    }
  };
  function getVisualFaceSize(rawWidth, rawHeight, face) {
    const rotation = normalizeRotation(face.rotation ?? 0);
    return rotation === 90 || rotation === 270 ? { width: rawHeight, height: rawWidth } : { width: rawWidth, height: rawHeight };
  }
  function mapVisualPixelToRawPixel(face, rawWidth, rawHeight, x, y) {
    const rotation = normalizeRotation(face.rotation ?? 0);
    const raw = mapTransformedPixelToSource(x, y, rawWidth, rawHeight, {
      rotation,
      flipX: false,
      flipY: false
    });
    const sign = getUVSign(face.uv);
    return {
      x: sign.x < 0 ? rawWidth - 1 - raw.x : raw.x,
      y: sign.y < 0 ? rawHeight - 1 - raw.y : raw.y
    };
  }
  function getFaceUVForVisualRegion(face, texture, visualRegion) {
    const region = getRawUVRegionForVisualRegion(face, texture, visualRegion);
    return [region.x, region.y, region.x + region.w, region.y + region.h];
  }
  function getRawUVRegionForVisualRegion(face, texture, visualRegion) {
    const raw = sampleFacePixels(face, texture);
    if (!raw) return { x: 0, y: 0, w: 0, h: 0 };
    const rawBBox = mapVisualBBoxToRawBBox(face, visualRegion, raw.width, raw.height);
    const [x1, y1, x2, y2] = face.uv;
    const signX = x2 >= x1 ? 1 : -1;
    const signY = y2 >= y1 ? 1 : -1;
    const minU = Math.min(x1, x2);
    const minV = Math.min(y1, y2);
    const uvPerPixelX = Math.abs(x2 - x1) / raw.width;
    const uvPerPixelY = Math.abs(y2 - y1) / raw.height;
    const nextMinU = minU + rawBBox.x * uvPerPixelX;
    const nextMaxU = minU + (rawBBox.x + rawBBox.w) * uvPerPixelX;
    const nextMinV = minV + rawBBox.y * uvPerPixelY;
    const nextMaxV = minV + (rawBBox.y + rawBBox.h) * uvPerPixelY;
    return {
      x: signX > 0 ? nextMinU : nextMaxU,
      y: signY > 0 ? nextMinV : nextMaxV,
      w: signX > 0 ? nextMaxU - nextMinU : nextMinU - nextMaxU,
      h: signY > 0 ? nextMaxV - nextMinV : nextMinV - nextMaxV
    };
  }
  function mapVisualBBoxToRawBBox(face, bbox, rawWidth, rawHeight) {
    const corners = [
      [bbox.x, bbox.y],
      [bbox.x + bbox.w - 1, bbox.y],
      [bbox.x, bbox.y + bbox.h - 1],
      [bbox.x + bbox.w - 1, bbox.y + bbox.h - 1]
    ];
    const rawCorners = corners.map(
      ([x, y]) => mapVisualPixelToRawPixel(face, rawWidth, rawHeight, x, y)
    );
    const minX = Math.min(...rawCorners.map(({ x }) => x));
    const minY = Math.min(...rawCorners.map(({ y }) => y));
    const maxX = Math.max(...rawCorners.map(({ x }) => x));
    const maxY = Math.max(...rawCorners.map(({ y }) => y));
    return {
      x: minX,
      y: minY,
      w: maxX - minX + 1,
      h: maxY - minY + 1
    };
  }
  const OPPOSITE_FACES = {
    north: "south",
    south: "north",
    east: "west",
    west: "east",
    up: "down",
    down: "up"
  };
  const FACE_BY_AXIS_DIRECTION = {
    0: { 1: "east", "-1": "west" },
    1: { 1: "up", "-1": "down" },
    2: { 1: "south", "-1": "north" }
  };
  function buildExtrudedCubes(plane, texture, rects, depth) {
    return rects.map((rect, index) => buildExtrudedCube(plane, texture, rect, depth, index));
  }
  function buildExtrudedCube(plane, texture, rect, depth, index) {
    const from = [...plane.cube.from];
    const to = [...plane.cube.to];
    const orientation = FACE_ORIENTATIONS[plane.faceKey];
    setAxisRange(
      from,
      to,
      orientation.horizontal,
      getPlaneAxisRange(
        plane.cube,
        orientation.horizontal,
        rect.x,
        rect.w,
        plane.sample.width,
        orientation.horizontalInverted
      )
    );
    setAxisRange(
      from,
      to,
      orientation.vertical,
      getPlaneAxisRange(
        plane.cube,
        orientation.vertical,
        rect.y,
        rect.h,
        plane.sample.height,
        orientation.verticalInverted
      )
    );
    setDepthRange(
      from,
      to,
      orientation.normal,
      orientation.normalDirection,
      plane.planeValue,
      depth
    );
    return new Cube({
      name: `${plane.cube.name}_${index + 1}`,
      from,
      to,
      rotation: [...plane.cube.rotation],
      origin: [...plane.cube.origin],
      shade: plane.cube.shade,
      color: plane.cube.color,
      faces: buildFaces(plane, texture, rect)
    }).init();
  }
  function buildFaces(plane, texture, rect) {
    const rawRegion = getRawUVRegionForVisualRegion(plane.face, texture, rect);
    const frontUV = buildUV(rawRegion, false);
    const backUV = buildUV(rawRegion, true);
    const sideUVs = getSideUVs(plane, texture, rect);
    const faces = {};
    faces[plane.faceKey] = buildFace(texture, frontUV, plane.face.tint);
    faces[OPPOSITE_FACES[plane.faceKey]] = buildFace(texture, backUV, plane.face.tint);
    sideUVs.forEach(({ faceKey, uv, rotation }) => {
      faces[faceKey] = buildFace(texture, uv, plane.face.tint, rotation);
    });
    return faces;
  }
  function buildFace(texture, uv, tint, rotation = 0) {
    return {
      texture: texture.uuid,
      uv,
      rotation,
      cullface: "",
      tint
    };
  }
  function getPlaneAxisRange(cube, axis, pixelStart, pixelSize, totalPixels, inverted) {
    const from = cube.from[axis] ?? 0;
    const to = cube.to[axis] ?? 0;
    const size = to - from;
    const start = pixelStart / totalPixels;
    const end = (pixelStart + pixelSize) / totalPixels;
    return inverted ? { from: from + size * (1 - end), to: from + size * (1 - start) } : { from: from + size * start, to: from + size * end };
  }
  function setAxisRange(from, to, axis, range) {
    from[axis] = range.from;
    to[axis] = range.to;
  }
  function setDepthRange(from, to, axis, normalDirection, planeValue, depth) {
    if (normalDirection > 0) {
      from[axis] = planeValue - depth;
      to[axis] = planeValue;
    } else {
      from[axis] = planeValue;
      to[axis] = planeValue + depth;
    }
  }
  function buildUV(region, flipX, flipY) {
    const x1 = region.x;
    const y1 = region.y;
    const x2 = region.x + region.w;
    const y2 = region.y + region.h;
    return [flipX ? x2 : x1, y1, flipX ? x1 : x2, y2];
  }
  function getSideUVs(plane, texture, rect) {
    const orientation = FACE_ORIENTATIONS[plane.faceKey];
    const horizontalNegative = getFaceByAxisDirection(
      orientation.horizontal,
      orientation.horizontalInverted ? 1 : -1
    );
    const horizontalPositive = getFaceByAxisDirection(
      orientation.horizontal,
      orientation.horizontalInverted ? -1 : 1
    );
    const verticalNegative = getFaceByAxisDirection(
      orientation.vertical,
      orientation.verticalInverted ? 1 : -1
    );
    const verticalPositive = getFaceByAxisDirection(
      orientation.vertical,
      orientation.verticalInverted ? -1 : 1
    );
    const left = getRawUVRegionForVisualRegion(plane.face, texture, {
      x: rect.x,
      y: rect.y,
      w: 1,
      h: rect.h
    });
    const right = getRawUVRegionForVisualRegion(plane.face, texture, {
      x: rect.x + rect.w - 1,
      y: rect.y,
      w: 1,
      h: rect.h
    });
    const top = getRawUVRegionForVisualRegion(plane.face, texture, {
      x: rect.x,
      y: rect.y,
      w: rect.w,
      h: 1
    });
    const bottom = getRawUVRegionForVisualRegion(plane.face, texture, {
      x: rect.x,
      y: rect.y + rect.h - 1,
      w: rect.w,
      h: 1
    });
    return [
      {
        faceKey: horizontalNegative,
        uv: buildUV(left, false),
        rotation: 270
      },
      {
        faceKey: horizontalPositive,
        uv: buildUV(right, false),
        rotation: 90
      },
      {
        faceKey: verticalNegative,
        uv: buildUV(top, true)
      },
      {
        faceKey: verticalPositive,
        uv: buildUV(bottom, false)
      }
    ];
  }
  function getFaceByAxisDirection(axis, direction) {
    return FACE_BY_AXIS_DIRECTION[axis]?.[direction] ?? "north";
  }
  function sampleVisualFace(face, texture) {
    const raw = sampleFacePixels(face, texture);
    const sourceData = raw?.textureData;
    if (!raw || !sourceData) return null;
    const size = getVisualFaceSize(raw.width, raw.height, face);
    const textureData = new Uint8ClampedArray(size.width * size.height * 4);
    for (let y = 0; y < size.height; y++) {
      for (let x = 0; x < size.width; x++) {
        copyVisualPixel({
          raw,
          sourceData,
          target: textureData,
          targetWidth: size.width,
          face,
          x,
          y
        });
      }
    }
    return { width: size.width, height: size.height, textureData };
  }
  function copyVisualPixel(input) {
    const source = mapVisualPixelToRawPixel(
      input.face,
      input.raw.width,
      input.raw.height,
      input.x,
      input.y
    );
    const targetIndex = (input.y * input.targetWidth + input.x) * 4;
    const sourceIndex = (source.y * input.raw.width + source.x) * 4;
    copyRGBA(input.sourceData, sourceIndex, input.target, targetIndex);
  }
  const FACE_KEYS = ["north", "south", "east", "west", "up", "down"];
  function collectExtrudeFlatPlanes(cubes, texture) {
    const planes = [];
    const problematic = [];
    cubes.forEach((cube) => {
      const activeFaces = getActiveFaces(cube);
      if (activeFaces.length === 0) {
        problematic.push({ cube, reason: "no-active-face" });
        return;
      }
      if (activeFaces.length > 1) {
        problematic.push({ cube, reason: "multiple-active-faces" });
        return;
      }
      const active = activeFaces[0];
      if (!active) return;
      if (getActiveTextureUUID(active.face) !== texture.uuid) {
        problematic.push({ cube, reason: "wrong-texture" });
        return;
      }
      const sample = sampleVisualFace(active.face, texture);
      if (!sample) {
        problematic.push({ cube, reason: "missing-texture-data" });
        return;
      }
      planes.push({
        cube,
        faceKey: active.faceKey,
        face: active.face,
        sample,
        planeValue: getFacePlaneValue(cube, active.faceKey),
        sourceUV: [...active.face.uv]
      });
    });
    return { planes, problematic };
  }
  function getActiveFaces(cube) {
    const faces = [];
    FACE_KEYS.forEach((faceKey) => {
      const face = cube.faces[faceKey];
      if (face && getActiveTextureUUID(face)) {
        faces.push({ faceKey, face });
      }
    });
    return faces;
  }
  function getFacePlaneValue(cube, faceKey) {
    const orientation = FACE_ORIENTATIONS[faceKey];
    return orientation.normalDirection > 0 ? cube.to[orientation.normal] ?? 0 : cube.from[orientation.normal] ?? 0;
  }
  function scanOpaqueAreas(textureData, width, height) {
    const done = new Uint8Array(width * height);
    const rects = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (isDoneOrTransparent(textureData, done, width, x, y)) continue;
        const rect = growOpaqueRect(textureData, done, width, height, x, y);
        markDone(done, width, rect);
        rects.push(rect);
      }
    }
    return rects;
  }
  function growOpaqueRect(textureData, done, width, height, startX, startY) {
    let rectW = 1;
    let rectH = 1;
    while (startX + rectW < width && isOpaqueColumn(textureData, done, width, startX + rectW, startY, rectH)) {
      rectW++;
    }
    while (startY + rectH < height && isOpaqueRow(textureData, done, width, startX, startY + rectH, rectW)) {
      rectH++;
    }
    return { x: startX, y: startY, w: rectW, h: rectH };
  }
  function isOpaqueColumn(textureData, done, width, x, y, h) {
    for (let offset = 0; offset < h; offset++) {
      if (isDoneOrTransparent(textureData, done, width, x, y + offset)) return false;
    }
    return true;
  }
  function isOpaqueRow(textureData, done, width, x, y, w) {
    for (let offset = 0; offset < w; offset++) {
      if (isDoneOrTransparent(textureData, done, width, x + offset, y)) return false;
    }
    return true;
  }
  function markDone(done, width, rect) {
    for (let y = rect.y; y < rect.y + rect.h; y++) {
      for (let x = rect.x; x < rect.x + rect.w; x++) {
        done[y * width + x] = 1;
      }
    }
  }
  function isDoneOrTransparent(textureData, done, width, x, y) {
    return done[y * width + x] === 1 || (textureData[(y * width + x) * 4 + 3] ?? 0) <= 0;
  }
  function executeExtrudeFlat(cubes, texture, depth) {
    const { planes, problematic } = collectExtrudeFlatPlanes(cubes, texture);
    const createdCubes = [];
    const replacedCubes = [];
    let emptyPlanes = 0;
    planes.forEach((plane) => {
      const rects = scanOpaqueAreas(
        plane.sample.textureData,
        plane.sample.width,
        plane.sample.height
      );
      if (rects.length === 0) {
        emptyPlanes++;
        problematic.push({ cube: plane.cube, reason: "fully-transparent" });
        return;
      }
      const extruded = buildExtrudedCubes(plane, texture, rects, depth);
      createdCubes.push(...extruded);
      replacedCubes.push(plane.cube);
    });
    replacedCubes.forEach((cube) => cube.remove());
    return {
      checkedCubes: cubes.length,
      validPlanes: planes.length,
      createdCubes,
      replacedCubes,
      emptyPlanes,
      problematic
    };
  }
  function extrudeFlat() {
    const project = validateWorkingSetProject({
      expandByTexture: false,
      requireSelection: true,
      rejectUntexturedFaces: false,
      onDebug: (event) => debugLog("extrude_flat", "Validation", event)
    });
    if (!project) return;
    const dialog = new Dialog({
      id: "extrude_flat_dialog",
      title: "Extrude Flat",
      form: {
        depth: {
          label: "Depth",
          type: "number",
          value: 1,
          min: 0.01
        }
      },
      onConfirm: (formData) => {
        executeExtrudeFlatCommand(
          project.cubes,
          project.texture,
          normalizeDepth(formData.depth)
        );
      }
    });
    dialog.show();
  }
  function executeExtrudeFlatCommand(cubes, texture, depth) {
    Undo.initEdit({ selection: true, elements: Project.elements, outliner: true });
    try {
      const result = executeExtrudeFlat(cubes, texture, depth);
      Undo.finishEdit("extrude flat");
      debugLog("extrude_flat", "Summary", {
        textureName: texture.name,
        textureUUID: texture.uuid,
        depth,
        checkedCubes: result.checkedCubes,
        validPlanes: result.validPlanes,
        replacedCubes: result.replacedCubes.length,
        createdCubes: result.createdCubes.length,
        emptyPlanes: result.emptyPlanes,
        problematic: result.problematic.length,
        problemReasons: countProblemReasons$1(result.problematic)
      });
      if (result.createdCubes.length > 0) {
        setAsSelected(new Set(result.createdCubes));
        Canvas.updateAll();
      }
      showResultMessage(result.createdCubes.length, result.problematic);
    } catch (e) {
      Undo.cancelEdit();
      debugError("extrude_flat", "Failed to extrude flat planes", e);
      showError(`Failed to extrude flat planes: ${e}`);
    }
  }
  function normalizeDepth(value) {
    return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 1;
  }
  function showResultMessage(created, problematic) {
    const reasonSummary = formatProblemReasons(countProblemReasons$1(problematic));
    if (created === 0) {
      Blockbench.showQuickMessage(
        reasonSummary ? `No flat planes extruded: ${reasonSummary}` : "No flat planes extruded",
        4e3
      );
      return;
    }
    Blockbench.showQuickMessage(
      `Extrude Flat: created ${created} cube(s), skipped ${problematic.length}${reasonSummary ? ` (${reasonSummary})` : ""}`,
      5e3
    );
  }
  function countProblemReasons$1(problematic) {
    const counts = {};
    problematic.forEach(({ reason }) => {
      counts[reason] = (counts[reason] ?? 0) + 1;
    });
    return counts;
  }
  function formatProblemReasons(counts) {
    return Object.entries(counts).map(([reason, count]) => `${formatProblemReason(reason)} ${count}`).join(", ");
  }
  function formatProblemReason(reason) {
    const labels = {
      "multiple-active-faces": "multiple active faces",
      "no-active-face": "no active face",
      "wrong-texture": "wrong texture",
      "missing-texture-data": "missing texture data",
      "fully-transparent": "fully transparent"
    };
    return labels[reason] ?? reason;
  }
  const TEMPLATE_COLORS = [
    [255, 248, 153, 255],
    [255, 167, 164, 255],
    [110, 120, 140, 255],
    [123, 212, 255, 255],
    [123, 255, 163, 255],
    [236, 248, 253, 255],
    [83, 97, 116, 255],
    [67, 232, 141, 255],
    [180, 212, 225, 255],
    [91, 188, 244, 255],
    [248, 221, 114, 255],
    [244, 134, 134, 255]
  ];
  const TEMPLATE_COLOR_KEYS = new Set(TEMPLATE_COLORS.map(getStaticRGBAKey));
  function findDisableCandidates(expandWorkingSet2 = true) {
    const project = validateWorkingSetProject({
      expandByTexture: expandWorkingSet2,
      requireSelection: !expandWorkingSet2,
      rejectUntexturedFaces: false,
      onDebug: (event) => debugLog("find_disable_candidates", "Validation", event)
    });
    if (!project) return;
    const dialog = new Dialog({
      id: "find_disable_candidates_dialog",
      title: "Find Disable Candidates",
      form: {
        solidColor: {
          label: "Solid color",
          type: "checkbox",
          value: true
        },
        fullyTransparent: {
          label: "Fully transparent",
          type: "checkbox",
          value: true
        },
        templateColors: {
          label: "Template colors",
          type: "checkbox",
          value: true
        }
      },
      onConfirm: (formData) => {
        executeFindDisableCandidates(project.cubes, project.texture, {
          solidColor: formData.solidColor === true,
          fullyTransparent: formData.fullyTransparent === true,
          templateColors: formData.templateColors === true
        });
      }
    });
    dialog.show();
  }
  function executeFindDisableCandidates(cubes, texture, options) {
    const { candidates, scannedFaces } = findCandidateFaces(cubes, texture, options);
    const candidateCubes = new Set(candidates.map(({ cube }) => cube));
    debugLog("find_disable_candidates", "Summary", {
      textureName: texture.name,
      textureUUID: texture.uuid,
      cubes: cubes.length,
      options,
      scannedFaces,
      candidates: candidates.length,
      candidateCubes: candidateCubes.size,
      candidateFaces: candidates.map(toDebugEntry$1)
    });
    if (candidates.length === 0) {
      Blockbench.showQuickMessage("No disable candidates found", 3e3);
      return;
    }
    setAsSelected(candidateCubes);
    Canvas.updateAll();
    Blockbench.showQuickMessage(
      `Found ${candidates.length} disable candidate face(s) on ${candidateCubes.size} cube(s)`,
      5e3
    );
  }
  function findCandidateFaces(cubes, texture, options) {
    const candidates = [];
    let scannedFaces = 0;
    cubes.forEach((cube) => {
      Object.entries(cube.faces).forEach(([faceKey, face]) => {
        if (face.texture !== texture.uuid) return;
        scannedFaces++;
        const sample = sampleFacePixels(face, texture);
        if (!sample?.textureData) return;
        const rgba = getSolidRGBA(sample.textureData);
        const reasons = getCandidateReasons(sample.textureData, rgba, options);
        if (reasons.length === 0) return;
        candidates.push({
          cube,
          face,
          faceKey,
          width: sample.width,
          height: sample.height,
          reasons,
          rgba
        });
      });
    });
    return { candidates, scannedFaces };
  }
  function toDebugEntry$1(candidate) {
    return {
      cube: candidate.cube.name,
      face: candidate.faceKey,
      uv: candidate.face.uv,
      size: `${candidate.width}x${candidate.height}`,
      reasons: candidate.reasons,
      rgba: candidate.rgba
    };
  }
  function getCandidateReasons(textureData, rgba, options) {
    const reasons = [];
    const fullyTransparent = isFullyTransparent(textureData);
    if (options.fullyTransparent && fullyTransparent) {
      reasons.push("fully_transparent");
    }
    if (options.solidColor && rgba && !fullyTransparent) {
      reasons.push("solid_color");
    }
    if (options.templateColors && !fullyTransparent && hasOnlyTemplateColors(textureData)) {
      reasons.push("template_colors");
    }
    return reasons;
  }
  function hasOnlyTemplateColors(textureData) {
    let hasOpaquePixel = false;
    for (let index = 0; index < textureData.length; index += 4) {
      const alpha = textureData[index + 3] ?? 0;
      if (alpha === 0) continue;
      hasOpaquePixel = true;
      if (!TEMPLATE_COLOR_KEYS.has(getRGBAKey(textureData, index))) {
        return false;
      }
    }
    return hasOpaquePixel;
  }
  function getStaticRGBAKey(rgba) {
    return getRGBAKey(Uint8ClampedArray.from(rgba), 0);
  }
  function buildAtlasCanvas(placements, tex, size) {
    CANVAS_BUF.width = size;
    CANVAS_BUF.height = size;
    placements.forEach(({ island, x, y }) => {
      CANVAS_CTX_BUF.drawImage(
        tex.img,
        island.x,
        island.y,
        island.w,
        island.h,
        x,
        y,
        island.w,
        island.h
      );
    });
    return CANVAS_BUF;
  }
  function remapFaceUVs(faces, faceIslandMap, packedIslands, atlasSize, tex) {
    const scaleW = tex.width / tex.getUVWidth();
    const scaleH = tex.height / tex.getUVHeight();
    const uvW = atlasSize / scaleW;
    const uvH = atlasSize / scaleH;
    const placementById = new Map(packedIslands.map((p) => [p.island.id, p]));
    faces.forEach(({ face, meta }) => {
      if (!meta.textureData) {
        face.uv = [0, 0, 0, 0];
        return;
      }
      const island = faceIslandMap.get(face);
      if (!island) return;
      const placement = placementById.get(island.id);
      if (!placement) return;
      const [ox1, oy1, ox2, oy2] = face.uv;
      const signX = Math.sign(ox2 - ox1) || 1;
      const signY = Math.sign(oy2 - oy1) || 1;
      const nu1 = placement.x / atlasSize * uvW;
      const nv1 = placement.y / atlasSize * uvH;
      const nu2 = (placement.x + island.w) / atlasSize * uvW;
      const nv2 = (placement.y + island.h) / atlasSize * uvH;
      face.uv = [
        signX > 0 ? nu1 : nu2,
        signY > 0 ? nv1 : nv2,
        signX > 0 ? nu2 : nu1,
        signY > 0 ? nv2 : nv1
      ];
    });
  }
  function commitNewTexture(canvas, name, atlasSize, oldTex, faces) {
    const dataURL = canvas.toDataURL("image/png");
    const scaleW = oldTex.width / oldTex.getUVWidth();
    const scaleH = oldTex.height / oldTex.getUVHeight();
    const newUvWidth = atlasSize / scaleW;
    const newUvHeight = atlasSize / scaleH;
    const newTex = new Texture({
      name,
      folder: oldTex.folder,
      width: atlasSize,
      height: atlasSize,
      uv_width: newUvWidth,
      uv_height: newUvHeight
    }).fromDataURL(dataURL).add();
    faces.forEach(({ face }) => {
      face.texture = newTex.uuid;
    });
    return newTex;
  }
  function tryPackFFDS(islands, size, padding) {
    const grid = new Uint8Array(size * size);
    function check(x, y) {
      return grid[y * size + x] === 1;
    }
    function occupy(x, y) {
      grid[y * size + x] = 1;
    }
    function place(x, y, w, h) {
      if (x + w > size || y + h > size) return false;
      for (let dx = 0; dx < w; dx++) {
        for (let dy = 0; dy < h; dy++) {
          if (check(x + dx, y + dy)) return false;
        }
      }
      for (let dx = 0; dx < w; dx++) {
        for (let dy = 0; dy < h; dy++) {
          occupy(x + dx, y + dy);
        }
      }
      return true;
    }
    const placements = [];
    for (const island of islands) {
      const w = island.w + padding;
      const h = island.h + padding;
      if (w > size || h > size) return null;
      let placed = false;
      outer: for (let line = 0; line < size; line++) {
        for (let space = 0; space <= line; space++) {
          if (place(space, line, w, h)) {
            placements.push({ island, x: space, y: line });
            placed = true;
            break outer;
          }
          if (space === line) continue;
          if (place(line, space, w, h)) {
            placements.push({ island, x: line, y: space });
            placed = true;
            break outer;
          }
        }
      }
      if (!placed) return null;
    }
    return placements;
  }
  function tryPackMaxRect(islands, size, padding, finder) {
    let freeRects = [{ x: 0, y: 0, w: size, h: size }];
    const placements = [];
    for (const island of islands) {
      const w = island.w + padding;
      const h = island.h + padding;
      const best = finder(freeRects, w, h);
      if (!best) return null;
      placements.push({ island, x: best.x, y: best.y });
      freeRects = splitFreeRects(freeRects, best.x, best.y, w, h);
    }
    return placements;
  }
  const mrBSSF = (freeRects, w, h) => {
    let best = null;
    let bestShort = Infinity;
    let bestLong = Infinity;
    for (const rect of freeRects) {
      if (rect.w < w || rect.h < h) continue;
      const shortSide = Math.min(rect.w - w, rect.h - h);
      const longSide = Math.max(rect.w - w, rect.h - h);
      if (shortSide < bestShort || shortSide === bestShort && longSide < bestLong) {
        bestShort = shortSide;
        bestLong = longSide;
        best = { rect, x: rect.x, y: rect.y };
      }
    }
    return best;
  };
  const mrBLSF = (freeRects, w, h) => {
    let best = null;
    let bestLong = Infinity;
    let bestShort = Infinity;
    for (const rect of freeRects) {
      if (rect.w < w || rect.h < h) continue;
      const shortSide = Math.min(rect.w - w, rect.h - h);
      const longSide = Math.max(rect.w - w, rect.h - h);
      if (longSide < bestLong || longSide === bestLong && shortSide < bestShort) {
        bestLong = longSide;
        bestShort = shortSide;
        best = { rect, x: rect.x, y: rect.y };
      }
    }
    return best;
  };
  const mrBAF = (freeRects, w, h) => {
    let best = null;
    let bestArea = Infinity;
    let bestShort = Infinity;
    for (const rect of freeRects) {
      if (rect.w < w || rect.h < h) continue;
      const area = rect.w * rect.h;
      const shortSide = Math.min(rect.w - w, rect.h - h);
      if (area < bestArea || area === bestArea && shortSide < bestShort) {
        bestArea = area;
        bestShort = shortSide;
        best = { rect, x: rect.x, y: rect.y };
      }
    }
    return best;
  };
  const mrWAF = (freeRects, w, h) => {
    let best = null;
    let worstArea = -Infinity;
    for (const rect of freeRects) {
      if (rect.w < w || rect.h < h) continue;
      const area = rect.w * rect.h;
      if (area > worstArea) {
        worstArea = area;
        best = { rect, x: rect.x, y: rect.y };
      }
    }
    return best;
  };
  const mrBL = (freeRects, w, h) => {
    let best = null;
    let bestY = Infinity;
    let bestX = Infinity;
    for (const rect of freeRects) {
      if (rect.w < w || rect.h < h) continue;
      if (rect.y < bestY || rect.y === bestY && rect.x < bestX) {
        bestY = rect.y;
        bestX = rect.x;
        best = { rect, x: rect.x, y: rect.y };
      }
    }
    return best;
  };
  function splitFreeRects(freeRects, px, py, pw, ph) {
    const next = [];
    for (const r of freeRects) {
      if (!rectsOverlap(r, px, py, pw, ph)) {
        next.push(r);
        continue;
      }
      next.push(...splitAroundPlacement(r, px, py, pw, ph));
    }
    return removeContainedRects(next);
  }
  function rectsOverlap(rect, px, py, pw, ph) {
    return px < rect.x + rect.w && px + pw > rect.x && py < rect.y + rect.h && py + ph > rect.y;
  }
  function splitAroundPlacement(rect, px, py, pw, ph) {
    const result = [];
    const right = px + pw;
    const bottom = py + ph;
    const rectRight = rect.x + rect.w;
    const rectBottom = rect.y + rect.h;
    if (px > rect.x) result.push({ x: rect.x, y: rect.y, w: px - rect.x, h: rect.h });
    if (right < rectRight) {
      result.push({ x: right, y: rect.y, w: rectRight - right, h: rect.h });
    }
    if (py > rect.y) result.push({ x: rect.x, y: rect.y, w: rect.w, h: py - rect.y });
    if (bottom < rectBottom) {
      result.push({ x: rect.x, y: bottom, w: rect.w, h: rectBottom - bottom });
    }
    return result;
  }
  function removeContainedRects(rects) {
    return rects.filter(
      (rect, index) => !rects.some((other, otherIndex) => otherIndex !== index && containsRect(other, rect))
    );
  }
  function containsRect(container, rect) {
    return container.x <= rect.x && container.y <= rect.y && container.x + container.w >= rect.x + rect.w && container.y + container.h >= rect.y + rect.h;
  }
  function computePackingScore(placements, size) {
    let maxX = 0;
    let maxY = 0;
    for (const { island, x, y } of placements) {
      maxX = Math.max(maxX, x + island.w);
      maxY = Math.max(maxY, y + island.h);
    }
    const bboxArea = maxX * maxY;
    const atlasArea = size * size;
    const usedArea = placements.reduce((sum, { island }) => sum + island.w * island.h, 0);
    const compactness = 1 - bboxArea / atlasArea;
    const coverage = usedArea / bboxArea;
    const squareness = Math.min(maxX, maxY) / Math.max(maxX, maxY);
    return (compactness + coverage + squareness) / 3;
  }
  const ISLANDS_SORTER = [
    {
      label: "longest_side_first",
      fn: (a, b) => Math.max(b.w, b.h) - Math.max(a.w, a.h)
    },
    {
      label: "most_square_first",
      fn: (a, b) => getAspectRatio(a) - getAspectRatio(b)
    },
    {
      label: "most_elongated_first",
      fn: (a, b) => getAspectRatio(b) - getAspectRatio(a)
    },
    {
      label: "largest_area_first",
      fn: (a, b) => b.w * b.h - a.w * a.h
    },
    {
      label: "largest_perimeter_first",
      fn: (a, b) => b.w + b.h - (a.w + a.h)
    },
    {
      label: "tallest_first",
      fn: (a, b) => b.h - a.h
    },
    {
      label: "widest_first",
      fn: (a, b) => b.w - a.w
    }
  ];
  const MAXRECT_FINDERS = [mrBSSF, mrBLSF, mrBAF, mrWAF, mrBL];
  function buildPackingStrategies(islands, padding) {
    const sortedVariants = buildSortedVariants(islands);
    const mrStrategies = ISLANDS_SORTER.flatMap(
      ({ label }) => MAXRECT_FINDERS.map((finder) => ({
        label: `${finder.name}:${label}`,
        run: (size) => tryPackMaxRect(getSortedVariant(sortedVariants, label), size, padding, finder)
      }))
    );
    const ffdsStrategies = ISLANDS_SORTER.map(({ label }) => ({
      label: `ffds:${label}`,
      run: (size) => tryPackFFDS(getSortedVariant(sortedVariants, label), size, padding)
    }));
    return [...mrStrategies, ...ffdsStrategies];
  }
  async function runStrategiesForSize(strategies, size, callbacks) {
    let best = null;
    const t0 = performance.now();
    const results = [];
    for (const [i, strategy] of strategies.entries()) {
      await callbacks.setProgress?.(
        i / strategies.length,
        `${size}x${size} - ${i}/${strategies.length} ${strategy.label}`
      );
      if (callbacks.isCancelled?.()) break;
      const result = runStrategy(strategy, size);
      results.push(result.summary);
      if (result.score !== null && (!best || result.score > best.score)) {
        best = {
          placements: result.placements,
          label: strategy.label,
          score: result.score
        };
      }
    }
    callbacks.reportStrategies?.(results);
    callbacks.onDebug?.({
      type: "size-result",
      size,
      best: best?.label ?? null,
      score: best?.score ?? null,
      ms: Number((performance.now() - t0).toFixed(1))
    });
    return best;
  }
  function buildSortedVariants(islands) {
    return Object.fromEntries(
      ISLANDS_SORTER.map(({ label, fn }) => [label, [...islands].sort(fn)])
    );
  }
  function getSortedVariant(sortedVariants, label) {
    const variant = sortedVariants[label];
    if (!variant) {
      throw new Error(`Missing packing sort variant: ${label}`);
    }
    return variant;
  }
  function runStrategy(strategy, size) {
    const t0 = performance.now();
    const placements = strategy.run(size);
    const ms = performance.now() - t0;
    const score = placements ? computePackingScore(placements, size) : null;
    return {
      placements: placements ?? [],
      score,
      summary: {
        strategy: strategy.label,
        ok: !!placements,
        score: score !== null ? Number(score.toFixed(4)) : -1,
        ms: Number(ms.toFixed(1))
      }
    };
  }
  function getAspectRatio(island) {
    return Math.max(island.w, island.h) / Math.min(island.w, island.h);
  }
  async function packIslands(islands, initialSize, padding, callbacks = {}) {
    const strategies = buildPackingStrategies(islands, padding);
    let lastResult = null;
    let size = initialSize;
    const t0 = performance.now();
    callbacks.onDebug?.({
      type: "start",
      islands: islands.length,
      initialSize,
      padding,
      strategies: strategies.length
    });
    while (size <= MAX_ATLAS_SIZE && !callbacks.isCancelled?.()) {
      callbacks.onDebug?.({
        type: "size-start",
        size,
        strategies: strategies.length
      });
      const best = await runStrategiesForSize(strategies, size, callbacks);
      if (best) {
        lastResult = { ...best, atlasSize: size };
      }
      if (!callbacks.isCancelled?.() && best) {
        await callbacks.setProgress?.(0);
        const totalMs2 = Number((performance.now() - t0).toFixed(1));
        callbacks.onDebug?.({
          type: "success",
          atlasSize: size,
          best: best.label,
          score: best.score,
          totalMs: totalMs2
        });
        return {
          placements: best.placements,
          atlasSize: size,
          cancelled: false,
          status: "success"
        };
      }
      size *= 2;
    }
    await callbacks.setProgress?.(0);
    const totalMs = Number((performance.now() - t0).toFixed(1));
    if (callbacks.isCancelled?.()) {
      if (lastResult) {
        callbacks.onDebug?.({
          type: "cancelled",
          atlasSize: lastResult.atlasSize,
          best: lastResult.label,
          score: lastResult.score,
          totalMs
        });
        return {
          placements: lastResult.placements,
          atlasSize: lastResult.atlasSize,
          cancelled: true,
          status: "cancelled"
        };
      }
      callbacks.onDebug?.({
        type: "cancelled",
        atlasSize: null,
        best: null,
        score: null,
        totalMs
      });
      return {
        placements: null,
        atlasSize: null,
        cancelled: true,
        status: "cancelled"
      };
    }
    callbacks.onDebug?.({ type: "failed", totalMs });
    return {
      placements: null,
      atlasSize: null,
      cancelled: false,
      status: "failed"
    };
  }
  function createProgressDialog({
    id,
    title,
    statusId,
    onCancel
  }) {
    const statusLine = Interface.createElement(
      "p",
      {
        id: statusId,
        style: "text-align:center; opacity:0.8;"
      },
      ""
    );
    const clearProgress = Blockbench.setProgress;
    const dialog = new Dialog(id, {
      title,
      cancel_on_click_outside: false,
      lines: [statusLine],
      progress_bar: {},
      buttons: ["dialog.cancel"],
      onCancel() {
        onCancel();
        clearProgress();
      }
    });
    async function setProgress(progress, msg) {
      dialog.progress_bar?.setProgress(progress);
      Blockbench.setProgress(progress);
      if (msg !== void 0) statusLine.innerText = msg;
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
    return { dialog, setProgress, clearProgress };
  }
  async function packWithProgress(islands, atlasSize, padding) {
    let packingCancelled = false;
    const {
      dialog: progressDialog,
      setProgress,
      clearProgress
    } = createProgressDialog({
      id: "pack_islands_progress",
      title: "Packing Islands",
      statusId: "pack_islands_progress_status",
      onCancel() {
        packingCancelled = true;
      }
    });
    progressDialog.show();
    try {
      return await packIslands(islands, atlasSize, padding, {
        setProgress,
        isCancelled: () => packingCancelled,
        onDebug: logPackingDebugEvent,
        reportStrategies: (results) => debugTable("repack_uv", "Packing strategies", results)
      });
    } finally {
      progressDialog.close();
      clearProgress();
    }
  }
  function logPackingDebugEvent(event) {
    if (event.type === "size-result") {
      debugLog("repack_uv", "Packing size result", {
        size: event.size,
        best: event.best,
        score: event.score,
        ms: event.ms
      });
      return;
    }
    debugLog("repack_uv", `Packing ${event.type}`, event);
  }
  function stackExactFaces(faces) {
    const groups = groupByPixelSimilarity(faces);
    const stackedCount = applyStackedUVs(groups);
    return {
      faces,
      groups,
      stackedCount,
      summary: getStackDebugSummary(faces, groups, stackedCount)
    };
  }
  function getStackDebugSummary(faces, groups, changedFaces) {
    const transformDistribution = {
      identity: 0,
      flips: 0,
      rotate90: 0,
      rotate180: 0,
      rotate270: 0
    };
    groups.forEach((group) => {
      group.slice(1).forEach(({ transform }) => {
        if (transform.flipX || transform.flipY) {
          transformDistribution.flips++;
          return;
        }
        if (transform.rotation === 90) transformDistribution.rotate90++;
        else if (transform.rotation === 180) transformDistribution.rotate180++;
        else if (transform.rotation === 270) transformDistribution.rotate270++;
        else transformDistribution.identity++;
      });
    });
    return {
      cubes: new Set(faces.map(({ element }) => element)).size,
      faces: faces.length,
      zeroSizedFaces: faces.filter(({ meta }) => !meta.textureData).length,
      pixelGroups: groups.length,
      duplicateGroups: groups.filter((group) => group.length > 1).length,
      changedFaces,
      transformDistribution
    };
  }
  function groupByPixelSimilarity(faces) {
    const groups = [];
    faces.forEach((face) => {
      if (!face.meta.textureData) {
        groups.push([{ ...face, transform: newIdentityTransform() }]);
        return;
      }
      for (const group of groups) {
        const ref = group[0];
        if (!ref) continue;
        const result = comparePixels(face.meta, ref.meta);
        if (result.similar) {
          group.push({ ...face, transform: result.transform });
          return;
        }
      }
      groups.push([{ ...face, transform: newIdentityTransform() }]);
    });
    return groups;
  }
  function applyStackedUVs(groups) {
    let stackedCount = 0;
    groups.forEach((group) => {
      const [ref, ...duplicates] = group;
      if (!ref) return;
      const [rx1, ry1, rx2, ry2] = ref.face.uv;
      duplicates.forEach((dup) => {
        const [dx1, dy1, dx2, dy2] = dup.face.uv;
        const rotation = normalizeRotation((dup.face.rotation || 0) + dup.transform.rotation);
        const dupSign = getUVSign([dx1, dy1, dx2, dy2]);
        const refSign = getUVSign([rx1, ry1, rx2, ry2]);
        let [nx1, nx2] = [rx1, rx2];
        let [ny1, ny2] = [ry1, ry2];
        if (dupSign.x !== refSign.x) [nx1, nx2] = [nx2, nx1];
        if (dupSign.y !== refSign.y) [ny1, ny2] = [ny2, ny1];
        if (dup.transform.flipX) [nx1, nx2] = [nx2, nx1];
        if (dup.transform.flipY) [ny1, ny2] = [ny2, ny1];
        const newUV = [nx1, ny1, nx2, ny2];
        if (newUV.some((v, i) => v !== dup.face.uv[i]) || rotation !== (dup.face.rotation || 0)) {
          stackedCount++;
        }
        dup.face.uv = newUV;
        dup.face.rotation = rotation;
      });
    });
    return stackedCount;
  }
  function extractIslands(faces, texture) {
    const islandByKey = /* @__PURE__ */ new Map();
    const faceIslandMap = /* @__PURE__ */ new Map();
    const islands = [];
    faces.forEach(({ face, meta }) => {
      if (!meta.textureData) return;
      const region = getFacePixelRegion(face, texture);
      if (!region) return;
      const key = getPixelRegionKey(region);
      let island = islandByKey.get(key);
      if (!island) {
        island = {
          id: islands.length,
          x: region.x,
          y: region.y,
          w: region.w,
          h: region.h
        };
        islandByKey.set(key, island);
        islands.push(island);
      }
      faceIslandMap.set(face, island);
    });
    return { islands, faceIslandMap };
  }
  function prepareRepack(cubes, texture, padding, stackExactFirst, onStackExact, onSummary) {
    let faces = collectFacesForTexture(cubes, texture);
    let preStackedFaces = 0;
    if (stackExactFirst) {
      const stackResult = stackExactFaces(faces);
      preStackedFaces = stackResult.stackedCount;
      onStackExact(stackResult.summary);
      faces = collectFacesForTexture(cubes, texture);
    }
    const { islands, faceIslandMap } = extractIslands(faces, texture);
    const atlasSize = computeAtlasSize(islands, padding);
    onSummary({
      textureName: texture.name,
      textureUUID: texture.uuid,
      cubes: cubes.length,
      faces: faces.length,
      islands: islands.length,
      duplicateUVRegions: faces.filter(({ meta }) => meta.textureData).length - islands.length,
      initialAtlasSize: atlasSize,
      padding,
      stackExactFirst,
      preStackedFaces
    });
    return { faces, islands, faceIslandMap, atlasSize };
  }
  function computeAtlasSize(islands, padding) {
    const totalArea = islands.reduce(
      (sum, island) => sum + (island.w + padding) * (island.h + padding),
      0
    );
    let size = MIN_ATLAS_SIZE;
    while (size * size < totalArea) size *= 2;
    return size;
  }
  function repackUV(_expandWorkingSet = true) {
    const project = validateWorkingSetProject({
      expandByTexture: true,
      requireSelection: false,
      rejectUntexturedFaces: true,
      onDebug: (event) => debugLog("repack_uv", "Validation", event)
    });
    if (!project) return;
    const dialog = new Dialog({
      id: "repack_uv_dialog",
      title: "Repack UVs",
      form: {
        textureName: {
          label: "Texture Name",
          type: "text",
          value: project.texture.name
        },
        padding: {
          label: "Padding",
          type: "number",
          value: 0,
          min: 0,
          max: 16,
          step: 1
        },
        stackExact: {
          label: "Use Stack Exact First",
          type: "checkbox",
          value: false
        }
      },
      onConfirm(formData) {
        const textureName = (formData.textureName || "texture").trim();
        const padding = Math.max(0, Math.round(formData.padding ?? 0));
        executeRepack(project, textureName, padding, formData.stackExact).then(() => {
        });
      }
    });
    dialog.show();
  }
  async function executeRepack({ cubes, texture }, textureName, padding, stackExactFirst) {
    setAsSelected(cubes);
    Undo.initEdit({
      selection: true,
      elements: cubes,
      textures: Texture.all,
      selected_texture: true
    });
    let afterUndoFinish = () => {
    };
    try {
      const prepared = prepareRepack(
        cubes,
        texture,
        padding,
        stackExactFirst,
        (summary) => debugLog("repack_uv", "Stack Exact before packing", summary),
        (summary) => debugLog("repack_uv", "Summary before packing", summary)
      );
      const packedIslands = await packWithProgress(prepared.islands, prepared.atlasSize, padding);
      const placements = resolvePackingResult(packedIslands);
      if (!placements) return;
      const oldWidth = texture.width;
      const oldHeight = texture.height;
      const sizeChanged = placements.atlasSize !== oldWidth || placements.atlasSize !== oldHeight;
      const newTexture = applyPackedTexture(
        prepared,
        texture,
        textureName,
        placements.placements,
        placements.atlasSize
      );
      debugLog("repack_uv", "Texture remap", {
        oldTextureName: texture.name,
        oldTextureUUID: texture.uuid,
        newTextureName: newTexture.name,
        newTextureUUID: newTexture.uuid,
        finalAtlasSize: placements.atlasSize,
        status: packedIslands.status
      });
      Project.selected_texture = newTexture;
      afterUndoFinish = () => {
        if (!Format.per_texture_uv_size && sizeChanged) {
          const sizedTexture = newTexture;
          UVSizeUtil.adjustProjectResolution(sizedTexture.uv_width, sizedTexture.uv_height);
        }
      };
      Canvas.updateAll();
      Blockbench.showQuickMessage(
        `Packed ${prepared.islands.length} islands into ${placements.atlasSize}x${placements.atlasSize} texture`,
        sizeChanged ? 5e3 : 3e3
      );
      showTextureSizeChangedMessage(oldWidth, oldHeight, placements.atlasSize);
    } catch (e) {
      debugError("repack_uv", "UV repack failed", e);
      showError(`UV Repack failed: ${e}`);
    } finally {
      Undo.finishEdit("repack uv islands");
      afterUndoFinish();
    }
  }
  function resolvePackingResult(result) {
    if (result.status === "failed") {
      showError(
        "Islands do not fit even at the maximum supported atlas size (4096x4096). Try reducing padding or running Stack UVs first.",
        "Pack Failed"
      );
      return null;
    }
    if (!result.placements || result.atlasSize === null) return null;
    return { placements: result.placements, atlasSize: result.atlasSize };
  }
  function applyPackedTexture(prepared, texture, textureName, placements, atlasSize) {
    const newCanvas = buildAtlasCanvas(placements, texture, atlasSize);
    remapFaceUVs(prepared.faces, prepared.faceIslandMap, placements, atlasSize, texture);
    return commitNewTexture(newCanvas, textureName, atlasSize, texture, prepared.faces);
  }
  function showTextureSizeChangedMessage(oldWidth, oldHeight, atlasSize) {
    if (atlasSize === oldWidth && atlasSize === oldHeight) return;
    Blockbench.showMessageBox({
      title: "Texture Size Changed",
      message: `Texture resized from ${oldWidth}x${oldHeight} to ${atlasSize}x${atlasSize}.`,
      icon: "info"
    });
  }
  const MATCH_SAME_REGION_SET = "same_region_set";
  const MATCH_ANY_SHARED_REGION = "any_shared_region";
  function selectMatchingUV() {
    const project = validateSelectionTextureProject({
      onDebug: (event) => debugLog("select_matching_uvs", "Validation", event)
    });
    if (!project) return;
    const { selectedCubes, textureUUID } = project;
    const dialog = new Dialog({
      id: "select_matching_uvs_dialog",
      title: "Select Matching UVs",
      form: {
        mode: {
          label: "Match Mode",
          type: "select",
          value: MATCH_SAME_REGION_SET,
          options: {
            [MATCH_SAME_REGION_SET]: "Same region set",
            [MATCH_ANY_SHARED_REGION]: "Any shared region"
          }
        }
      },
      onConfirm: (formData) => {
        executeSelectMatchingUVs(
          selectedCubes,
          textureUUID,
          formData.mode || MATCH_SAME_REGION_SET
        );
      }
    });
    dialog.show();
  }
  function executeSelectMatchingUVs(selectedCubes, textureUUID, mode) {
    const allCubes = getAllCubes();
    const selectedSet = new Set(selectedCubes);
    const candidateCubes = allCubes.filter(
      (cube) => !selectedSet.has(cube) && cubeHasTexture(cube, textureUUID)
    );
    const selectedRegionSets = selectedCubes.map((cube) => getCubeRegionSet(cube, textureUUID)).filter((regions) => regions.length > 0);
    if (selectedRegionSets.length === 0) {
      Blockbench.showQuickMessage(
        "Selected cubes have no active UV regions - nothing to match",
        3e3
      );
      return;
    }
    const selectedRegions = new Set(selectedRegionSets.flat());
    const matchingCubes = candidateCubes.filter((cube) => {
      const candidateRegions = getCubeRegionSet(cube, textureUUID);
      if (candidateRegions.length === 0) return false;
      if (mode === MATCH_ANY_SHARED_REGION) {
        return candidateRegions.some((region) => selectedRegions.has(region));
      }
      return selectedRegionSets.some(
        (selectedRegionsForCube) => areRegionSetsEqual(candidateRegions, selectedRegionsForCube)
      );
    });
    debugLog("select_matching_uvs", "Summary", {
      textureUUID,
      mode,
      selectedCubes: selectedCubes.length,
      candidateCubes: candidateCubes.length,
      matchedCubes: matchingCubes.length,
      selectedRegionSetSizes: selectedRegionSets.map((regions) => regions.length)
    });
    setAsSelected([...selectedCubes, ...matchingCubes]);
    Canvas.updateAll();
    Blockbench.showQuickMessage(`Selected ${matchingCubes.length} matching cube(s)`, 3e3);
  }
  function areRegionSetsEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((region, index) => region === b[index]);
  }
  function stackUV(expandWorkingSet2 = true) {
    const project = validateWorkingSetProject({
      expandByTexture: expandWorkingSet2,
      requireSelection: !expandWorkingSet2,
      rejectUntexturedFaces: true,
      onDebug: (event) => debugLog("stack_uv", "Validation", event)
    });
    if (!project) return;
    executeStackUV(project);
  }
  function executeStackUV({ cubes, texture }) {
    setAsSelected(cubes);
    Undo.initEdit({ selection: true, elements: cubes, uv_only: true });
    try {
      const faces = collectFacesForTexture(cubes, texture);
      const result = stackExactFaces(faces);
      debugLog("stack_uv", "Summary", result.summary);
      if (result.stackedCount === 0) {
        Blockbench.showQuickMessage("No duplicate UVs found - nothing to stack", 3e3);
      } else {
        Canvas.updateAll();
        Blockbench.showToastNotification({
          text: `UVs stacked (${result.stackedCount}/${result.groups.length}/${faces.length}) - 
                    ${result.stackedCount} dupliacte(s) across ${result.groups.length} unique island(s) among ${faces.length} face(s)`,
          icon: "fa-check",
          expire: 7e3
        });
      }
    } catch (e) {
      debugError("stack_uv", "UV stacking failed", e);
      showError(`UVs Stacking failed: ${e}`);
    } finally {
      Undo.finishEdit("stack uv islands");
    }
  }
  function applyTransparentPaddingTrim(cubes, texture, candidates) {
    const fixed = [];
    const unchanged = [];
    const problematic = candidates.filter(({ status }) => status === "problematic");
    candidates.forEach((candidate) => {
      if (candidate.status === "problematic") return;
      const changed = applyCandidate(candidate, texture);
      if (changed) {
        candidate.status = "fixed";
        fixed.push(candidate);
      } else {
        candidate.status = "unchanged";
        unchanged.push(candidate);
      }
    });
    return {
      checkedCubes: cubes.length,
      candidates,
      fixed,
      unchanged,
      problematic
    };
  }
  function applyCandidate(candidate, texture) {
    const reference = candidate.sides[0];
    if (!reference) return false;
    const oldFrom = [...candidate.cube.from];
    const oldTo = [...candidate.cube.to];
    applyCubeTrim(
      candidate.cube,
      reference.faceKey,
      reference.bbox,
      reference.width,
      reference.height
    );
    candidate.sides.forEach((side) => {
      side.face.uv = getFaceUVForVisualRegion(side.face, texture, side.bbox);
    });
    return !arraysEqual(oldFrom, candidate.cube.from) || !arraysEqual(oldTo, candidate.cube.to);
  }
  function applyCubeTrim(cube, faceKey, bbox, width, height) {
    const mapping = FACE_ORIENTATIONS[faceKey];
    trimCoordinateRange(
      cube,
      mapping.horizontal,
      bbox.x / width,
      (width - bbox.x - bbox.w) / width,
      mapping.horizontalInverted
    );
    trimCoordinateRange(
      cube,
      mapping.vertical,
      bbox.y / height,
      (height - bbox.y - bbox.h) / height,
      mapping.verticalInverted
    );
  }
  function trimCoordinateRange(cube, axis, startTrim, endTrim, inverted) {
    const from = cube.from[axis] ?? 0;
    const to = cube.to[axis] ?? 0;
    const size = to - from;
    if (inverted) {
      cube.from[axis] = from + size * endTrim;
      cube.to[axis] = to - size * startTrim;
    } else {
      cube.from[axis] = from + size * startTrim;
      cube.to[axis] = to - size * endTrim;
    }
  }
  function arraysEqual(a, b) {
    return a.length === b.length && a.every((value, index) => value === b[index]);
  }
  const VISUAL_EQUIVALENCE_TRANSFORMS = buildVisualEquivalenceTransforms();
  function sampleSizesMatch(a, b) {
    return a.width === b.width && a.height === b.height;
  }
  function areVisualSamplesEquivalent(a, b) {
    return VISUAL_EQUIVALENCE_TRANSFORMS.some(
      (transform) => areVisualSamplesEqual(a, b, transform)
    );
  }
  function buildVisualEquivalenceTransforms() {
    const rotations = [0];
    const flips = [
      { flipX: false, flipY: false },
      { flipX: true, flipY: false },
      { flipX: false, flipY: true },
      { flipX: true, flipY: true }
    ];
    return rotations.flatMap(
      (rotation) => flips.map(({ flipX, flipY }) => ({ rotation, flipX, flipY }))
    );
  }
  function areVisualSamplesEqual(a, b, transform) {
    const size = getTransformedSize(b.width, b.height, transform.rotation);
    if (a.width !== size.width || a.height !== size.height) return false;
    for (let y = 0; y < a.height; y++) {
      for (let x = 0; x < a.width; x++) {
        const aIndex = (y * a.width + x) * 4;
        const source = mapTransformedPixelToSource(x, y, b.width, b.height, transform);
        const bIndex = (source.y * b.width + source.x) * 4;
        if (!rgbaEquals(a.textureData, aIndex, b.textureData, bIndex)) {
          return false;
        }
      }
    }
    return true;
  }
  function findTransparentPaddingCandidates(cubes, texture) {
    const candidates = [];
    cubes.forEach((cube) => {
      getFlatAxes(cube).forEach((axis) => {
        const candidate = analyzeFlatPair(cube, axis, texture);
        if (candidate) candidates.push(candidate);
      });
    });
    return candidates;
  }
  function analyzeFlatPair(cube, axis, texture) {
    const sides = collectFlatPairSides(cube, axis, texture);
    if (!sides) return null;
    const [activeSides, aTexture, bTexture, hasMissingSample] = sides;
    if (activeSides.length === 0) return null;
    if (hasMissingSample) {
      return buildProblem(cube, axis, activeSides, "missing-texture-data");
    }
    if (hasDifferentTexture(aTexture, bTexture, texture.uuid)) {
      return buildProblem(cube, axis, activeSides, "different-textures");
    }
    return activeSides.length === 1 ? buildSingleSideCandidate(cube, axis, activeSides[0]) : buildTwoSideCandidate(cube, axis, activeSides);
  }
  function collectFlatPairSides(cube, axis, texture) {
    const pair = FLAT_FACE_PAIRS[axis];
    const aKey = pair[0];
    const bKey = pair[1];
    const a = cube.faces[aKey];
    const b = cube.faces[bKey];
    if (!a || !b) return null;
    const aTexture = getActiveTextureUUID(a);
    const bTexture = getActiveTextureUUID(b);
    const active = [];
    const aSide = buildActiveSide(aKey, a, aTexture, texture);
    const bSide = buildActiveSide(bKey, b, bTexture, texture);
    if (aSide) active.push(aSide);
    if (bSide) active.push(bSide);
    const expectedActive = Number(aTexture === texture.uuid) + Number(bTexture === texture.uuid);
    return [active, aTexture, bTexture, active.length < expectedActive];
  }
  function buildActiveSide(faceKey, face, textureUUID, texture) {
    if (textureUUID !== texture.uuid) return null;
    const sample = sampleVisualFace(face, texture);
    if (!sample) return null;
    const bbox = getOpaqueBBox(sample.textureData, sample.width, sample.height);
    if (!bbox) return null;
    return {
      faceKey,
      face,
      bbox,
      width: sample.width,
      height: sample.height,
      sample,
      oldUV: [...face.uv]
    };
  }
  function hasDifferentTexture(aTexture, bTexture, textureUUID) {
    return aTexture !== null && aTexture !== textureUUID || bTexture !== null && bTexture !== textureUUID || aTexture !== null && bTexture !== null && aTexture !== bTexture;
  }
  function buildSingleSideCandidate(cube, axis, side) {
    if (!side || !hasTransparentPadding(side)) return null;
    return { cube, axis, status: "fixable", sides: [side] };
  }
  function buildTwoSideCandidate(cube, axis, sides) {
    const [aSide, bSide] = sides;
    if (!aSide || !bSide) return null;
    if (!sampleSizesMatch(aSide.sample, bSide.sample)) {
      return buildProblem(cube, axis, sides, "different-sizes");
    }
    if (!areVisualSamplesEquivalent(aSide.sample, bSide.sample)) {
      return buildProblem(cube, axis, sides, "not-equivalent");
    }
    if (aSide.bbox.w !== bSide.bbox.w || aSide.bbox.h !== bSide.bbox.h) {
      return buildProblem(cube, axis, sides, "bbox-size-mismatch");
    }
    if (!sides.some(hasTransparentPadding)) return null;
    return { cube, axis, status: "fixable", sides };
  }
  function buildProblem(cube, axis, sides, problemReason) {
    if (!sides.some(hasTransparentPadding)) return null;
    return { cube, axis, status: "problematic", sides, problemReason };
  }
  function hasTransparentPadding(side) {
    return side.bbox.x > 0 || side.bbox.y > 0 || side.bbox.w < side.width || side.bbox.h < side.height;
  }
  function getOpaqueBBox(textureData, width, height) {
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = textureData[(y * width + x) * 4 + 3] ?? 0;
        if (alpha <= 0) continue;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
    if (maxX < minX || maxY < minY) return null;
    return {
      x: minX,
      y: minY,
      w: maxX - minX + 1,
      h: maxY - minY + 1
    };
  }
  function trimTransparentPadding(expandWorkingSet2 = true) {
    const project = validateWorkingSetProject({
      expandByTexture: expandWorkingSet2,
      requireSelection: !expandWorkingSet2,
      rejectUntexturedFaces: false,
      onDebug: (event) => debugLog("trim_transparent_padding", "Validation", event)
    });
    if (!project) return;
    executeTrimTransparentPadding(project.cubes, project.texture);
  }
  function executeTrimTransparentPadding(cubes, texture) {
    try {
      const candidates = findTransparentPaddingCandidates(cubes, texture);
      const result = hasFixableCandidates(candidates) ? executeFix(cubes, texture, candidates) : buildNoFixResult(cubes, candidates);
      const candidateCubes = new Set(result.candidates.map(({ cube }) => cube));
      debugLog("trim_transparent_padding", "Summary", {
        textureName: texture.name,
        textureUUID: texture.uuid,
        checkedCubes: result.checkedCubes,
        candidates: result.candidates.length,
        fixed: result.fixed.length,
        problematic: result.problematic.length,
        unchanged: result.unchanged.length,
        fixable: result.candidates.length - result.problematic.length,
        problemReasons: countProblemReasons(result.problematic)
      });
      if (candidateCubes.size > 0) {
        setAsSelected(candidateCubes);
        Canvas.updateAll();
      }
      showTrimResultMessage(result);
    } catch (e) {
      debugError("trim_transparent_padding", "Failed to trim transparent padding", e);
      showError(`Failed to trim transparent padding: ${e}`);
    }
  }
  function executeFix(cubes, texture, candidates) {
    Undo.initEdit({ selection: true, elements: cubes });
    try {
      const result = applyTransparentPaddingTrim(cubes, texture, candidates);
      Undo.finishEdit("trim transparent padding");
      return result;
    } catch (e) {
      Undo.cancelEdit();
      throw e;
    }
  }
  function hasFixableCandidates(candidates) {
    return candidates.some(({ status }) => status !== "problematic");
  }
  function buildNoFixResult(cubes, candidates) {
    const problematic = candidates.filter(({ status }) => status === "problematic");
    return {
      checkedCubes: cubes.length,
      candidates,
      fixed: [],
      unchanged: [],
      problematic
    };
  }
  function showTrimResultMessage(result) {
    if (result.candidates.length === 0) {
      Blockbench.showQuickMessage("No candidates found", 3e3);
      return;
    }
    Blockbench.showToastNotification({
      text: `Trim Transparent Padding: changed ${result.fixed.length}, problematic ${result.problematic.length}, unchanged ${result.unchanged.length}`,
      expire: 5e3
    });
  }
  function countProblemReasons(problematic) {
    const counts = {};
    problematic.forEach(({ problemReason }) => {
      const key = problemReason ?? "unknown";
      counts[key] = (counts[key] ?? 0) + 1;
    });
    return counts;
  }
  function checkFlatFaceMismatches(cubes, texture) {
    const mismatches = [];
    let checkedFlatPairs = 0;
    cubes.forEach((cube) => {
      getFlatAxes(cube).forEach((axis) => {
        const faces = FLAT_FACE_PAIRS[axis];
        const mismatch = checkFlatPair(cube, axis, faces, texture);
        if (mismatch === "not-flat") return;
        checkedFlatPairs++;
        if (mismatch) mismatches.push(mismatch);
      });
    });
    return {
      checkedCubes: cubes.length,
      checkedFlatPairs,
      mismatches
    };
  }
  function checkFlatPair(cube, axis, faces, texture) {
    const [aKey, bKey] = faces;
    const a = cube.faces[aKey];
    const b = cube.faces[bKey];
    if (!a || !b) return "not-flat";
    const textureCheck = checkFlatPairTextures(a, b, texture.uuid);
    if (textureCheck.status === "skip") return null;
    if (textureCheck.status === "mismatch") {
      return buildMismatch(cube, axis, faces, textureCheck.reason);
    }
    const aSample = sampleVisualFace(a, texture);
    const bSample = sampleVisualFace(b, texture);
    if (!aSample || !bSample)
      return buildMismatch(cube, axis, faces, "zero-sized-or-missing-texture-data");
    if (!sampleSizesMatch(aSample, bSample))
      return buildMismatch(cube, axis, faces, "different-sizes");
    if (!areVisualSamplesEquivalent(aSample, bSample))
      return buildMismatch(cube, axis, faces, "not-equivalent");
    return null;
  }
  function checkFlatPairTextures(a, b, textureUUID) {
    const aTexture = getActiveTextureUUID(a);
    const bTexture = getActiveTextureUUID(b);
    if (!aTexture && !bTexture) return { status: "skip" };
    if (!aTexture || !bTexture) return { status: "skip" };
    if (aTexture !== bTexture || aTexture !== textureUUID) {
      return { status: "mismatch", reason: "different-textures" };
    }
    return { status: "compare" };
  }
  function buildMismatch(cube, axis, faces, reason) {
    return { cube, axis, faces, reason };
  }
  function verifyFlatFaces(expandWorkingSet2 = true) {
    const project = validateWorkingSetProject({
      expandByTexture: expandWorkingSet2,
      requireSelection: !expandWorkingSet2,
      rejectUntexturedFaces: false,
      onDebug: (event) => debugLog("verify_flat_faces", "Validation", event)
    });
    if (!project) return;
    const { cubes, texture } = project;
    const result = checkFlatFaceMismatches(cubes, texture);
    const mismatchCubes = new Set(result.mismatches.map(({ cube }) => cube));
    debugLog("verify_flat_faces", "Summary", {
      textureName: texture.name,
      textureUUID: texture.uuid,
      checkedCubes: result.checkedCubes,
      checkedFlatPairs: result.checkedFlatPairs,
      mismatches: result.mismatches.length,
      mismatchCubes: mismatchCubes.size,
      mismatchDetails: result.mismatches.map(toDebugEntry)
    });
    if (result.mismatches.length === 0) {
      Blockbench.showQuickMessage("No flat face mismatches found", 3e3);
      return;
    }
    setAsSelected(mismatchCubes);
    Canvas.updateAll();
    Blockbench.showQuickMessage(
      `Found ${result.mismatches.length} flat face mismatch(es) on ${mismatchCubes.size} cube(s)`,
      5e3
    );
  }
  function toDebugEntry(mismatch) {
    return {
      cube: mismatch.cube.name,
      axis: mismatch.axis,
      faces: mismatch.faces.join("/"),
      reason: mismatch.reason
    };
  }
  let optimizeUVsMenu;
  let buttonStackExact;
  let buttonRepack;
  let buttonDisableEmptyFaces;
  let buttonFindDisableCandidates;
  let buttonVerifyFlatFaces;
  let buttonTrimTransparentPadding;
  let buttonExtrudeFlat;
  let buttonAnalyzeTextureUsage;
  let disableFacesMenu;
  let analyzeMenu;
  let flatFacesMenu;
  let selectMenu;
  let buttonSelectMatching;
  let toggleExpandWorkingSet;
  let menu;
  let expandWorkingSet = true;
  function getExpandWorkingSet() {
    return expandWorkingSet;
  }
  const plugin = {
    title: "UV-Tex Tools",
    description: "Tools for UV cleanup, texture analysis, and flat textured geometry",
    author: "QMakar",
    version: PLUGIN_VERSION,
    variant: "both",
    min_version: "5.0.0",
    icon: "icon.png",
    repository: "https://github.com/CoMakar/blockbench-uv-tex-tools",
    tags: ["UV", "Texture", "Cube"],
    onload() {
      installDebugControls();
      buttonStackExact = new Action("stack_uv", {
        name: "Stack Exact",
        icon: "fa-layer-group",
        category: "edit",
        click: () => stackUV(getExpandWorkingSet())
      });
      buttonRepack = new Action("repack_uv", {
        name: "Repack UVs",
        icon: "fa-cubes-stacked",
        category: "edit",
        click: () => repackUV(getExpandWorkingSet())
      });
      buttonSelectMatching = new Action("select_matching_uv", {
        name: "Matching UVs",
        icon: "fa-object-group",
        category: "select",
        click: selectMatchingUV
      });
      buttonDisableEmptyFaces = new Action("disable_empty_faces", {
        name: "Disable Empty Faces",
        icon: "fa-ban",
        category: "edit",
        click: () => disableEmptyFaces(getExpandWorkingSet())
      });
      buttonFindDisableCandidates = new Action("find_disable_candidates", {
        name: "Find Disable Candidates",
        icon: "fa-magnifying-glass",
        category: "select",
        click: () => findDisableCandidates(getExpandWorkingSet())
      });
      buttonVerifyFlatFaces = new Action("verify_flat_faces", {
        name: "Verify Flat Faces",
        icon: "fa-clone",
        category: "select",
        click: () => verifyFlatFaces(getExpandWorkingSet())
      });
      buttonTrimTransparentPadding = new Action("trim_transparent_padding", {
        name: "Trim Transparent Padding",
        icon: "fa-crop-simple",
        category: "edit",
        click: () => trimTransparentPadding(getExpandWorkingSet())
      });
      buttonExtrudeFlat = new Action("extrude_flat", {
        name: "Extrude",
        icon: "fa-eject",
        category: "edit",
        click: extrudeFlat
      });
      buttonAnalyzeTextureUsage = new Action("analyze_texture_usage", {
        name: "Texture Usage",
        icon: "fa-chart-pie",
        category: "analyze",
        click: analyzeTextureUsage
      });
      optimizeUVsMenu = new Action("optimize_uvs_menu", {
        name: "Optimize UVs",
        icon: "fa-cubes-stacked",
        click: () => {
        },
        children: [buttonStackExact, buttonRepack]
      });
      disableFacesMenu = new Action("disable_faces_menu", {
        name: "Disable",
        icon: "fa-ban",
        click: () => {
        },
        children: [buttonDisableEmptyFaces, buttonFindDisableCandidates]
      });
      analyzeMenu = new Action("analyze_uvtex_menu", {
        name: "Analyze",
        icon: "fa-chart-pie",
        click: () => {
        },
        children: [buttonAnalyzeTextureUsage]
      });
      flatFacesMenu = new Action("flat_faces_menu", {
        name: "Flat Faces",
        icon: "fa-clone",
        click: () => {
        },
        children: [buttonVerifyFlatFaces, buttonTrimTransparentPadding, buttonExtrudeFlat]
      });
      selectMenu = new Action("select_uvtex_menu", {
        name: "Select",
        icon: "fa-object-group",
        click: () => {
        },
        children: [buttonSelectMatching]
      });
      toggleExpandWorkingSet = new Toggle("expand_working_set", {
        name: "Expand Working Set",
        icon: "fa-up-right-and-down-left-from-center",
        category: "edit",
        default: expandWorkingSet,
        onChange(value) {
          expandWorkingSet = value;
        }
      });
      menu = new Action("uvtex_menu", {
        name: "UV-Tex Tools",
        icon: "fa-layer-group",
        click: () => {
        },
        children: [
          toggleExpandWorkingSet,
          optimizeUVsMenu,
          disableFacesMenu,
          analyzeMenu,
          flatFacesMenu,
          selectMenu
        ]
      });
      MenuBar.addAction(menu, "tools");
    },
    onunload() {
      uninstallDebugControls();
      buttonStackExact?.delete();
      optimizeUVsMenu?.delete();
      buttonRepack?.delete();
      buttonDisableEmptyFaces?.delete();
      buttonFindDisableCandidates?.delete();
      buttonVerifyFlatFaces?.delete();
      buttonTrimTransparentPadding?.delete();
      buttonExtrudeFlat?.delete();
      buttonAnalyzeTextureUsage?.delete();
      disableFacesMenu?.delete();
      analyzeMenu?.delete();
      flatFacesMenu?.delete();
      selectMenu?.delete();
      buttonSelectMatching?.delete();
      toggleExpandWorkingSet?.delete();
      menu?.delete();
    }
  };
  BBPlugin.register(PLUGIN_ID, plugin);
})();
