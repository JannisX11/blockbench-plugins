(function () {
  const PLUGIN_ID = "animated_platforms";
  const PLUGIN_VERSION = "1.0.0";

  // Settings storage key for this standalone plugin.
  const SETTINGS_KEY = "animated_platforms_settings";

  // Legacy IDs/keys (migration)
  const LEGACY_PLUGIN_ID = "moving_ground_plane";
  const LEGACY_SETTINGS_KEY = "moving_ground_plane_settings";
  const LEGACY_PRESET_PREFIX = "cazfps_mgp_anim_presets::";
  const PRESET_PREFIX = "cazfps_animated_platforms_anim_presets::";

  // ============================================================
  // Singleton guard (prevents duplicate timers if this file is loaded twice)
  // ============================================================

  const INSTANCE_KEY = "__cazfps_animated_platforms_instance__";
  const LEGACY_INSTANCE_KEY = "__cazfps_moving_ground_plane_instance__";
  try {
    const prev1 = globalThis?.[INSTANCE_KEY];
    if (prev1 && typeof prev1.cleanup === "function") prev1.cleanup();
    const prev0 = globalThis?.[LEGACY_INSTANCE_KEY];
    if (prev0 && typeof prev0.cleanup === "function") prev0.cleanup();
  } catch (e) {}
  try {
    globalThis[INSTANCE_KEY] = {
      cleanup() {},
    };
  } catch (e) {}

  // ============================================================
  // UI: Make this dialog non-modal (no blackout)
  // ============================================================

  // Dialog UX hack (opt-in): disables the modal overlay/blur while this plugin's dialogs are open.
  // This mutates global DOM/CSS and must always be reverted on dialog close and on unload.

  // This hack mutates global DOM/CSS and can cause persistent FPS drops on some
  // systems/GPUs after opening a dialog. Keep it off by default.
  const ENABLE_NO_OVERLAY_HACK = true;

  // ============================================================
  // Plugin asset URL helpers (works for store/web + file installs)
  // ============================================================

  function getAnimatedPlatformsAssetUrl(filename) {
    const f = String(filename || "").trim();
    if (!f) return "";
    try {
      const all = Plugins?.all;
      const p = Array.isArray(all) ? all.find((x) => x && x.id === PLUGIN_ID) : null;
      const source = String(p?.source || "");
      const path = String(p?.path || "");

      // File/URL installs: resolve relative to the plugin JS path.
      if ((source === "file" || source === "url") && path) {
        return path.replace(/[^\\/]+\.js(\?.*)?$/, f);
      }
    } catch (e) {}

    // Store / web: resolve from plugin CDN path.
    try {
      if (typeof Plugins !== "undefined" && Plugins?.api_path) {
        return `${Plugins.api_path}/${PLUGIN_ID}/${encodeURIComponent(f)}`;
      }
    } catch (e) {}
    return f;
  }

  // NOTE: We avoid rewriting the Plugins window DOM.
  // The about.md provides its own icon markup, so no cross-plugin DOM hooks are needed.

  const NO_OVERLAY_CLASS = "animated_platforms_no_overlay";
  const NO_OVERLAY_STYLE_ID = "animated_platforms_no_overlay_style";

  // Some Blockbench builds apply blur/filters to the preview when dialogs are open.
  // On some GPUs/drivers this tanks FPS while the dialog is visible.
  // We disable ONLY the blur/filter while this plugin's dialog is open.
  const NO_BLUR_CLASS = "animated_platforms_no_blur";
  const NO_BLUR_STYLE_ID = "animated_platforms_no_blur_style";

  // Dialog CSS injection (Dialog.lines HTML is deprecated)
  const PANEL_STYLE_ID = "animated_platforms_panel_style";
  const ABOUT_STYLE_ID = "animated_platforms_about_style";

  function ensureStyleTag(id, cssText) {
    try {
      if (!document?.head) return;
      if (!id) return;
      if (document.getElementById(id)) return;
      const style = document.createElement("style");
      style.id = id;
      style.textContent = String(cssText || "");
      document.head.appendChild(style);
    } catch (e) {}
  }

  function ensurePanelStyle() {
    ensureStyleTag(
      PANEL_STYLE_ID,
      `
      #animated_platforms_panel .dialog_content { margin: 0; }
      #animated_platforms_panel #mgp-panel { padding: 14px 16px 12px; }
      #animated_platforms_panel .mgp-section { margin-bottom: 14px; }
      #animated_platforms_panel .mgp-section-title { font-weight: 700; margin: 10px 0 8px; }
      #animated_platforms_panel .mgp-row { display: flex; align-items: center; gap: 10px; margin: 6px 0; }
      #animated_platforms_panel .mgp-row label { flex: 1; opacity: 0.95; }
      #animated_platforms_panel .mgp-row .mgp-right { display: flex; align-items: center; gap: 8px; }
      #animated_platforms_panel .mgp-row .mgp-right > * { flex: initial; }
      #animated_platforms_panel .mgp-checkbox { display: flex; align-items: center; gap: 8px; }
      #animated_platforms_panel .mgp-checkbox input { margin: 0; }
      #animated_platforms_panel .mgp-select { min-width: 150px; }
      #animated_platforms_panel .mgp-footer { display: flex; align-items: center; gap: 10px; padding-top: 10px; border-top: 1px solid var(--color-border); margin-top: 10px; }
      #animated_platforms_panel .mgp-author { opacity: 0.8; font-size: 0.95em; }
      #animated_platforms_panel .mgp-spacer { flex: 1; }
      #animated_platforms_panel .mgp-button-row { display: flex; gap: 8px; flex-wrap: wrap; }
      #animated_platforms_panel .mgp-button-row > button.tool { flex: 1; min-width: 170px; }
      #animated_platforms_panel button.tool { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-height: 34px; }
      #animated_platforms_panel button.tool > * { pointer-events: none; }
      #animated_platforms_panel .mgp-subtle { opacity: 0.8; }
      #animated_platforms_panel numeric-input { width: 140px; }

      #animated_platforms_textures #mgp-texture-library { padding: 12px 14px; }
      #animated_platforms_textures .mgp-texture-library-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
      #animated_platforms_textures .mgp-empty { opacity: 0.8; padding: 12px 0; }
      #animated_platforms_textures .mgp-texture-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
      #animated_platforms_textures .mgp-texture-card { background: var(--color-back); border: 1px solid var(--color-border); padding: 8px; display: flex; flex-direction: column; gap: 8px; }
      #animated_platforms_textures .mgp-thumb { background: var(--color-dark); aspect-ratio: 1 / 1; overflow: hidden; display: flex; align-items: center; justify-content: center; }
      #animated_platforms_textures .mgp-thumb img { width: 100%; height: 100%; object-fit: cover; image-rendering: pixelated; display: block; }
      #animated_platforms_textures .mgp-texture-actions { display: flex; gap: 8px; flex-wrap: wrap; }
      #animated_platforms_textures .mgp-texture-actions > button.tool { flex: 1 1 0; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      #animated_platforms_textures .mgp-footer { display: flex; align-items: center; gap: 10px; padding-top: 10px; border-top: 1px solid var(--color-border); margin-top: 10px; }
      #animated_platforms_textures .spacer { flex: 1; }
      `.trim()
    );
  }

  function ensureAboutStyle() {
    ensureStyleTag(
      ABOUT_STYLE_ID,
      `
      dialog#mgp_about .dialog_title {
        padding-left: 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      dialog#mgp_about .dialog_content {
        text-align: left !important;
        margin: 0 !important;
      }
      dialog#mgp_about #mgp_banner {
        background-color: var(--color-accent);
        color: var(--color-accent_text);
        width: 100%;
        padding: 0 8px;
      }
      dialog#mgp_about #mgp_content {
        margin: 24px;
      }
      dialog#mgp_about .mgp-socials {
        display: flex;
        gap: 22px;
        justify-content: center;
        margin-top: 22px;
      }
      dialog#mgp_about .mgp-socials a {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        color: var(--color-text);
        min-width: 160px;
        padding: 10px;
      }
      dialog#mgp_about .mgp-socials a:hover {
        background-color: var(--color-selected);
        color: var(--color-light);
      }
      dialog#mgp_about .mgp-socials i {
        font-size: 32px;
      }
      dialog#mgp_about .mgp-socials img.mgp-site-icon {
        width: 32px;
        height: 32px;
        object-fit: contain;
      }
      dialog#mgp_about .mgp-socials label {
        cursor: pointer;
        text-decoration: underline;
      }
      `.trim()
    );
  }

  function migrateLegacyStorageOnce() {
    try {
      // Copy legacy settings if the new key is empty.
      const cur = localStorage.getItem(SETTINGS_KEY);
      const old = localStorage.getItem(LEGACY_SETTINGS_KEY);
      if ((!cur || !cur.trim()) && old && old.trim()) {
        localStorage.setItem(SETTINGS_KEY, old);
      }

      // Copy legacy per-project preset buckets (prefix rename).
      // This keeps per-animation presets working after the plugin id rename.
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) keys.push(k);
      }
      keys.forEach((k) => {
        if (!k.startsWith(LEGACY_PRESET_PREFIX)) return;
        const newKey = PRESET_PREFIX + k.slice(LEGACY_PRESET_PREFIX.length);
        const hasNew = localStorage.getItem(newKey);
        if (hasNew) return;
        const v = localStorage.getItem(k);
        if (v !== null && v !== undefined) localStorage.setItem(newKey, v);
      });
    } catch (e) {}
  }

  const NO_OVERLAY_SELECTORS = [
    ".dialog_background",
    ".dialog_backdrop",
    ".dialog_barrier",
    ".dialog_overlay",
    "#dialog_background",
    "#dialog_backdrop",
    "#blackout",
    ".blackout",
    ".modal-backdrop",
    ".modal_backdrop",
    ".overlay",
    ".overlay_background",
    ".dark_overlay",
  ];

  function ensureNoOverlayStyle() {
    if (document.getElementById(NO_OVERLAY_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = NO_OVERLAY_STYLE_ID;
    style.textContent = `
      /* Remove any blur/filters applied when a dialog is open */
      body.${NO_OVERLAY_CLASS} #page_wrapper,
      body.${NO_OVERLAY_CLASS} #work_screen,
      body.${NO_OVERLAY_CLASS} #center,
      body.${NO_OVERLAY_CLASS} .preview,
      body.${NO_OVERLAY_CLASS} canvas.preview,
      body.${NO_OVERLAY_CLASS} .preview canvas,
      body.${NO_OVERLAY_CLASS} .preview_panel,
      body.${NO_OVERLAY_CLASS} .preview_background {
        filter: none !important;
        backdrop-filter: none !important;
        opacity: 1 !important;
      }

      /* Remove the dim overlay behind dialogs and make it click-through */
      body.${NO_OVERLAY_CLASS} .dialog_background,
      body.${NO_OVERLAY_CLASS} .dialog_backdrop,
      body.${NO_OVERLAY_CLASS} .dialog_barrier,
      body.${NO_OVERLAY_CLASS} .dialog_overlay,
      body.${NO_OVERLAY_CLASS} #dialog_background,
      body.${NO_OVERLAY_CLASS} #dialog_backdrop,
      body.${NO_OVERLAY_CLASS} #blackout,
      body.${NO_OVERLAY_CLASS} .blackout,
      body.${NO_OVERLAY_CLASS} .modal-backdrop,
      body.${NO_OVERLAY_CLASS} .modal_backdrop,
      body.${NO_OVERLAY_CLASS} .overlay,
      body.${NO_OVERLAY_CLASS} .overlay_background,
      body.${NO_OVERLAY_CLASS} .dark_overlay {
        background: transparent !important;
        background-color: transparent !important;
        backdrop-filter: none !important;
        opacity: 1 !important;
        pointer-events: none !important;
      }

      /* Fallback for versions that use inline styles for the dimmer */
      body.${NO_OVERLAY_CLASS} div[style*="rgba(0,0,0"],
      body.${NO_OVERLAY_CLASS} div[style*="rgb(0, 0, 0"],
      body.${NO_OVERLAY_CLASS} div[style*="background: rgba(0,0,0"],
      body.${NO_OVERLAY_CLASS} div[style*="background-color: rgba(0,0,0"] {
        background: transparent !important;
        background-color: transparent !important;
        backdrop-filter: none !important;
        opacity: 1 !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureNoBlurStyle() {
    if (document.getElementById(NO_BLUR_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = NO_BLUR_STYLE_ID;
    style.textContent = `
      body.${NO_BLUR_CLASS} #page_wrapper,
      body.${NO_BLUR_CLASS} #work_screen,
      body.${NO_BLUR_CLASS} #center,
      body.${NO_BLUR_CLASS} .preview,
      body.${NO_BLUR_CLASS} canvas.preview,
      body.${NO_BLUR_CLASS} .preview canvas,
      body.${NO_BLUR_CLASS} .preview_panel,
      body.${NO_BLUR_CLASS} .preview_background {
        filter: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function setNoBlurEnabled(enabled) {
    if (!document?.body) return;
    if (enabled) {
      ensureNoBlurStyle();
      document.body.classList.add(NO_BLUR_CLASS);
    } else {
      document.body.classList.remove(NO_BLUR_CLASS);
    }
  }

  function setDialogOverlayTransparent(enabled) {
    try {
      const nodes = [];
      for (const sel of NO_OVERLAY_SELECTORS) {
        document.querySelectorAll(sel).forEach((n) => nodes.push(n));
      }

      for (const el of nodes) {
        if (!(el instanceof HTMLElement)) continue;

        if (enabled) {
          if (!el.dataset.mgpPrevBg) {
            el.dataset.mgpPrevBg = el.style.background || "";
            el.dataset.mgpPrevBgc = el.style.backgroundColor || "";
            el.dataset.mgpPrevOpacity = el.style.opacity || "";
            el.dataset.mgpPrevFilter = el.style.backdropFilter || "";
            el.dataset.mgpPrevPointerEvents = el.style.pointerEvents || "";
          }
          el.style.background = "transparent";
          el.style.backgroundColor = "transparent";
          el.style.backdropFilter = "none";
          el.style.opacity = "1";
          el.style.pointerEvents = "none";
        } else if (el.dataset.mgpPrevBg !== undefined) {
          el.style.background = el.dataset.mgpPrevBg;
          el.style.backgroundColor = el.dataset.mgpPrevBgc;
          el.style.opacity = el.dataset.mgpPrevOpacity;
          el.style.backdropFilter = el.dataset.mgpPrevFilter;
          el.style.pointerEvents = el.dataset.mgpPrevPointerEvents;

          delete el.dataset.mgpPrevBg;
          delete el.dataset.mgpPrevBgc;
          delete el.dataset.mgpPrevOpacity;
          delete el.dataset.mgpPrevFilter;
          delete el.dataset.mgpPrevPointerEvents;
        }
      }
    } catch (e) {}
  }

  function setNoOverlayEnabled(enabled) {
    if (!ENABLE_NO_OVERLAY_HACK) return;
    if (!document?.body) return;
    if (enabled) {
      ensureNoOverlayStyle();
      document.body.classList.add(NO_OVERLAY_CLASS);
      setDialogOverlayTransparent(true);
      // Some overlays are created slightly after dialog open.
      setTimeout(() => setDialogOverlayTransparent(true), 0);
      setTimeout(() => setDialogOverlayTransparent(true), 50);
    } else {
      setDialogOverlayTransparent(false);
      document.body.classList.remove(NO_OVERLAY_CLASS);
    }
  }

  // ============================================================
  // Settings
  // ============================================================

  const Settings = {
    enabled: false,
    autoSaveToAnimation: false,
    edgeFadeEnabled: true,
    edgeFadeWidthUv: 0.08,
    speedBlocksPerSec: 2.0,
    widthBlocks: 256,
    lengthBlocks: 256,
    yBlocks: 0,
    xBlocks: 0,
    zBlocks: 0,
    yaw: 0,
    tilt: 0,
    opacity: 1.0,

    gridBlocksPerTile: 16, // 16 blocks per texture tile => 1 block squares
    textureResolutionPx: 512,
    gridColor: "#ffffff",
    backgroundColor: "#2b2b2b",
    gridMinorOpacity: 1.0,
    gridMajorOpacity: 1.0,
    backgroundOpacity: 1.0,
    lineThicknessMult: 1.0,

    useCustomTexture: false,
    customTextureDataUrl: "",

    // Custom texture transforms
    customTextureRotation90: 0, // 0..3
    customTextureFlipX: false,
    customTextureFlipY: false,

    // Saved texture library (data URLs)
    savedTextures: [],

    load() {
      try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) return;
        const obj = JSON.parse(raw);
        if (!obj || typeof obj !== "object") return;
        Object.assign(this, obj);

        // Normalize numeric values
        this.enabled = !!this.enabled;
        this.autoSaveToAnimation = !!this.autoSaveToAnimation;
        this.edgeFadeEnabled = this.edgeFadeEnabled !== false;
        this.edgeFadeWidthUv = Math.max(
          0.001,
          Math.min(0.5, Number(this.edgeFadeWidthUv ?? 0.08))
        );
        this.speedBlocksPerSec = Number(this.speedBlocksPerSec ?? 2.0);

        // Backward compatibility: older versions stored a single sizeBlocks.
        const legacySize = Number(this.sizeBlocks);
        const legacy = Number.isFinite(legacySize) ? legacySize : null;
        this.widthBlocks = Math.max(
          3,
          Number(this.widthBlocks ?? legacy ?? 256)
        );
        this.lengthBlocks = Math.max(
          3,
          Number(this.lengthBlocks ?? legacy ?? 256)
        );

        this.yBlocks = Number(this.yBlocks ?? 0);
        this.xBlocks = Number(this.xBlocks ?? 0);
        this.zBlocks = Number(this.zBlocks ?? 0);
        this.yaw = Number(this.yaw ?? 0);
        this.tilt = Number(this.tilt ?? 0);
        this.opacity = Math.max(0, Math.min(1, Number(this.opacity ?? 1.0)));

        this.gridBlocksPerTile = Math.max(
          0.25,
          Math.min(1024, Number(this.gridBlocksPerTile ?? 16))
        );
        this.textureResolutionPx = Math.max(
          64,
          Math.min(2048, Math.floor(Number(this.textureResolutionPx ?? 512)))
        );

        this.gridColor = normalizeColorToHex(this.gridColor, "#ffffff");
        this.backgroundColor = normalizeColorToHex(
          this.backgroundColor,
          "#2b2b2b"
        );
        this.gridMinorOpacity = Math.max(
          0,
          Math.min(1, Number(this.gridMinorOpacity ?? 1.0))
        );
        this.gridMajorOpacity = Math.max(
          0,
          Math.min(1, Number(this.gridMajorOpacity ?? 1.0))
        );
        this.backgroundOpacity = Math.max(
          0,
          Math.min(1, Number(this.backgroundOpacity ?? 1.0))
        );
        this.lineThicknessMult = Math.max(
          0.25,
          Math.min(6, Number(this.lineThicknessMult ?? 1.0))
        );

        this.useCustomTexture = !!this.useCustomTexture;
        this.customTextureDataUrl = String(this.customTextureDataUrl || "");
        if (!this.customTextureDataUrl) this.useCustomTexture = false;

        this.customTextureRotation90 = Math.max(
          0,
          Math.min(3, Math.floor(Number(this.customTextureRotation90 ?? 0)))
        );
        this.customTextureFlipX = !!this.customTextureFlipX;
        this.customTextureFlipY = !!this.customTextureFlipY;

        if (!Array.isArray(this.savedTextures)) this.savedTextures = [];
        // Ensure the library only contains valid strings
        this.savedTextures = this.savedTextures
          .filter((e) => typeof e === "string" && e.trim())
          .slice(0, 64);
      } catch (e) {}
    },

    _lastSaveError: "",

    save() {
      try {
        this._lastSaveError = "";
        localStorage.setItem(
          SETTINGS_KEY,
          JSON.stringify({
            enabled: !!this.enabled,
            autoSaveToAnimation: !!this.autoSaveToAnimation,
            edgeFadeEnabled: this.edgeFadeEnabled !== false,
            edgeFadeWidthUv: Number(this.edgeFadeWidthUv ?? 0.08),
            speedBlocksPerSec: Number(this.speedBlocksPerSec ?? 0),
            widthBlocks: Number(this.widthBlocks ?? 256),
            lengthBlocks: Number(this.lengthBlocks ?? 256),
            yBlocks: Number(this.yBlocks ?? 0),
            xBlocks: Number(this.xBlocks ?? 0),
            zBlocks: Number(this.zBlocks ?? 0),
            yaw: Number(this.yaw ?? 0),
            tilt: Number(this.tilt ?? 0),
            opacity: Number(this.opacity ?? 1.0),

            gridBlocksPerTile: Number(this.gridBlocksPerTile ?? 16),
            textureResolutionPx: Number(this.textureResolutionPx ?? 512),
            gridColor: normalizeColorToHex(this.gridColor, "#ffffff"),
            backgroundColor: normalizeColorToHex(
              this.backgroundColor,
              "#2b2b2b"
            ),
            gridMinorOpacity: Number(this.gridMinorOpacity ?? 1.0),
            gridMajorOpacity: Number(this.gridMajorOpacity ?? 1.0),
            backgroundOpacity: Number(this.backgroundOpacity ?? 1.0),
            lineThicknessMult: Number(this.lineThicknessMult ?? 1.0),

            useCustomTexture: !!this.useCustomTexture,
            customTextureDataUrl: String(this.customTextureDataUrl || ""),

            customTextureRotation90: Number(this.customTextureRotation90 ?? 0),
            customTextureFlipX: !!this.customTextureFlipX,
            customTextureFlipY: !!this.customTextureFlipY,

            savedTextures: Array.isArray(this.savedTextures)
              ? this.savedTextures.slice(0, 64)
              : [],
          })
        );
        return true;
      } catch (e) {}
      try {
        this._lastSaveError = String(e?.message || e || "");
      } catch (_) {}
      return false;
    },
  };

  function normalizeTextureDataUrlForStorage(dataUrl, maxDim = 512) {
    return new Promise((resolve) => {
      const url = String(dataUrl || "");
      if (!url) return resolve("");
      try {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          try {
            const w = Math.max(1, img.naturalWidth || img.width || 1);
            const h = Math.max(1, img.naturalHeight || img.height || 1);
            const max = Math.max(w, h);
            const md = Math.max(32, Math.min(2048, Math.floor(Number(maxDim) || 512)));
            const scale = max > md ? md / max : 1;
            const outW = Math.max(1, Math.floor(w * scale));
            const outH = Math.max(1, Math.floor(h * scale));

            // If already small enough, keep original
            if (scale === 1) return resolve(url);

            const canvas = document.createElement("canvas");
            canvas.width = outW;
            canvas.height = outH;
            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(url);

            // Keep pixel-art crisp
            ctx.imageSmoothingEnabled = false;
            ctx.clearRect(0, 0, outW, outH);
            ctx.drawImage(img, 0, 0, outW, outH);
            try {
              return resolve(canvas.toDataURL("image/png"));
            } catch (e) {
              return resolve(url);
            }
          } catch (e) {
            return resolve(url);
          }
        };
        img.onerror = () => resolve(url);
        img.src = url;
      } catch (e) {
        return resolve(url);
      }
    });
  }

  function hexToRgbaCss(hex, alpha = 1.0) {
    const a = Math.max(0, Math.min(1, Number(alpha ?? 1)));
    const rgb =
      parseHexColorToRgb255(hex) ||
      parseHexColorToRgb255("#000000") || { r: 0, g: 0, b: 0 };
    return `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;
  }

  // ============================================================
  // Color helpers (Blockbench color fields can return many shapes)
  // ============================================================

  function parseHexColorToRgb255(hex) {
    const s = String(hex || "").trim();
    const m = /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(s);
    if (!m) return null;
    let h = m[1];
    if (h.length === 3 || h.length === 4) {
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (h.length === 8) h = h.slice(0, 6);
    const n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function rgb255ToHex(rgb) {
    const r = Math.max(0, Math.min(255, Math.round(Number(rgb?.r ?? 0))));
    const g = Math.max(0, Math.min(255, Math.round(Number(rgb?.g ?? 0))));
    const b = Math.max(0, Math.min(255, Math.round(Number(rgb?.b ?? 0))));
    const to2 = (n) => n.toString(16).padStart(2, "0");
    return `#${to2(r)}${to2(g)}${to2(b)}`;
  }

  function parseCssRgbToRgb255(input) {
    const s = String(input || "").trim();
    const m =
      /^rgba?\(\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)(?:\s*,\s*([0-9.]+%?)\s*)?\)$/i.exec(
        s
      );
    if (!m) return null;

    const parseChan = (v) => {
      const t = String(v || "").trim();
      if (t.endsWith("%")) {
        const p = Number.parseFloat(t.slice(0, -1));
        if (!Number.isFinite(p)) return null;
        return (p / 100) * 255;
      }
      const n = Number.parseFloat(t);
      if (!Number.isFinite(n)) return null;
      return n;
    };

    const r = parseChan(m[1]);
    const g = parseChan(m[2]);
    const b = parseChan(m[3]);
    if (![r, g, b].every((n) => Number.isFinite(n))) return null;

    return {
      r: Math.max(0, Math.min(255, r)),
      g: Math.max(0, Math.min(255, g)),
      b: Math.max(0, Math.min(255, b)),
    };
  }

  function normalizeColorToHex(value, fallbackHex) {
    const fallback = String(fallbackHex || "#ffffff");
    try {
      if (typeof value === "string") {
        const s = value.trim();
        if (parseHexColorToRgb255(s)) return s.startsWith("#") ? s : `#${s}`;
        const rgb = parseCssRgbToRgb255(s);
        if (rgb) return rgb255ToHex(rgb);
        return fallback;
      }

      if (typeof value === "number" && Number.isFinite(value)) {
        const n = Math.max(0, Math.min(0xffffff, Math.floor(value)));
        return `#${n.toString(16).padStart(6, "0")}`;
      }

      if (value && typeof value === "object") {
        if (typeof value.hex === "string")
          return normalizeColorToHex(value.hex, fallback);
        if (typeof value.value === "string")
          return normalizeColorToHex(value.value, fallback);
        if (value.rgb && typeof value.rgb === "object")
          return normalizeColorToHex(value.rgb, fallback);

        if (
          Number.isFinite(Number(value.red)) &&
          Number.isFinite(Number(value.green)) &&
          Number.isFinite(Number(value.blue))
        ) {
          return normalizeColorToHex(
            { r: value.red, g: value.green, b: value.blue },
            fallback
          );
        }
        if (
          Number.isFinite(Number(value._r)) &&
          Number.isFinite(Number(value._g)) &&
          Number.isFinite(Number(value._b))
        ) {
          return normalizeColorToHex(
            { r: value._r, g: value._g, b: value._b },
            fallback
          );
        }

        if (typeof value.getHexString === "function") {
          const h = String(value.getHexString() || "").trim();
          if (h) return normalizeColorToHex(`#${h}`, fallback);
        }

        if (Array.isArray(value) && value.length >= 3) {
          const r = Number(value[0]);
          const g = Number(value[1]);
          const b = Number(value[2]);
          if ([r, g, b].every((n) => Number.isFinite(n))) {
            const is01 = r <= 1 && g <= 1 && b <= 1;
            return rgb255ToHex({
              r: is01 ? r * 255 : r,
              g: is01 ? g * 255 : g,
              b: is01 ? b * 255 : b,
            });
          }
        }

        if (Array.isArray(value.value) && value.value.length >= 3) {
          return normalizeColorToHex(value.value, fallback);
        }

        if (
          Number.isFinite(Number(value.r)) &&
          Number.isFinite(Number(value.g)) &&
          Number.isFinite(Number(value.b))
        ) {
          const r = Number(value.r);
          const g = Number(value.g);
          const b = Number(value.b);
          const is01 = r <= 1 && g <= 1 && b <= 1;
          return rgb255ToHex({
            r: is01 ? r * 255 : r,
            g: is01 ? g * 255 : g,
            b: is01 ? b * 255 : b,
          });
        }
      }
    } catch (e) {}
    return fallback;
  }

  // ============================================================
  // Timeline helpers
  // ============================================================

  function isBlockbenchAnimationPlaying() {
    try {
      if (typeof Animator !== "undefined" && Animator) {
        if (typeof Animator.isPlaying === "function")
          return !!Animator.isPlaying();
        if (typeof Animator.playing !== "undefined") return !!Animator.playing;
        if (typeof Animator.playback !== "undefined")
          return !!Animator.playback;
      }

      if (typeof Timeline !== "undefined" && Timeline) {
        if (typeof Timeline.isPlaying === "function")
          return !!Timeline.isPlaying();
        if (typeof Timeline.playing !== "undefined") return !!Timeline.playing;
      }

      if (typeof Animation !== "undefined" && Animation?.selected) {
        const a = Animation.selected;
        if (typeof a.playing !== "undefined") return !!a.playing;
      }

      if (typeof BarItems !== "undefined" && BarItems?.play_animation) {
        const b = BarItems.play_animation;
        if (typeof b.active !== "undefined") return !!b.active;
        if (typeof b.pressed !== "undefined") return !!b.pressed;
        if (typeof b.value !== "undefined") return !!b.value;
      }
    } catch (e) {}
    return false;
  }

  function getBlockbenchTimelineTimeSeconds() {
    try {
      const normalize = (v) => {
        if (!Number.isFinite(v)) return null;
        const n = Number(v);
        // Some builds expose ms; most expose seconds.
        return n > 10000 ? n / 1000 : n;
      };

      if (typeof Timeline !== "undefined" && Timeline) {
        const t =
          normalize(Timeline.time) ??
          normalize(Timeline.currentTime) ??
          normalize(Timeline.cursor_time) ??
          normalize(Timeline.playhead) ??
          normalize(Timeline.position);
        if (t !== null) return t;
      }

      if (typeof Animator !== "undefined" && Animator) {
        const t =
          normalize(Animator.time) ??
          normalize(Animator.currentTime) ??
          normalize(Animator.playhead);
        if (t !== null) return t;
      }

      if (typeof Animation !== "undefined" && Animation?.selected) {
        const a = Animation.selected;
        const t =
          normalize(a?.time) ?? normalize(a?.currentTime) ?? normalize(a?.playhead);
        if (t !== null) return t;
      }
    } catch (e) {}
    return null;
  }

  function parsePlaybackSpeedMult(v) {
    try {
      if (v === null || v === undefined) return null;

      if (typeof v === "string") {
        const s0 = v.trim();
        if (!s0) return null;
        const isPct = s0.endsWith("%");
        const hasX = /x/i.test(s0);
        const s = s0.replace(/[%x]/gi, "").trim();
        const n = Number.parseFloat(s);
        if (!Number.isFinite(n)) return null;
        if (isPct) return n / 100;
        // Heuristic: Blockbench commonly stores playback speed as percent integers
        // (e.g. 100 = 100%, 10 = 10%). Only treat as a raw multiplier when explicitly marked with 'x'.
        if (!hasX) {
          if (Number.isFinite(n) && Math.abs(n - Math.round(n)) < 1e-6) {
            if (n > 0 && n <= 1000) return n / 100;
          }
          if (n > 10 && n <= 1000) return n / 100;
        }
        return n;
      }

      if (typeof v === "number" && Number.isFinite(v)) {
        // Same heuristic as the string path: small integer values usually mean percent.
        if (Math.abs(v - Math.round(v)) < 1e-6) {
          if (v > 0 && v <= 1000) return v / 100;
        }
        if (v > 10 && v <= 1000) return v / 100;
        return v;
      }

      if (typeof v === "object") {
        if (Number.isFinite(Number(v.value)))
          return parsePlaybackSpeedMult(v.value);
        if (Number.isFinite(Number(v.current)))
          return parsePlaybackSpeedMult(v.current);
      }
    } catch (e) {}
    return null;
  }

  function getBlockbenchPlaybackSpeedMult() {
    try {
      const clamp = (mult) => Math.max(0.01, Math.min(10, mult));
      const tryParse = (v) => {
        const mult = parsePlaybackSpeedMult(v);
        return Number.isFinite(mult) ? clamp(mult) : null;
      };

      if (typeof Timeline !== "undefined" && Timeline) {
        const v =
          tryParse(Timeline.playback_speed) ??
          tryParse(Timeline.playbackSpeed) ??
          tryParse(Timeline.playback_rate) ??
          tryParse(Timeline.playbackRate) ??
          tryParse(Timeline.speed) ??
          tryParse(Timeline.timescale) ??
          tryParse(Timeline.time_scale);
        if (v !== null) return v;
      }

      if (typeof Animator !== "undefined" && Animator) {
        const v =
          tryParse(Animator.playback_speed) ??
          tryParse(Animator.playbackSpeed) ??
          tryParse(Animator.playback_rate) ??
          tryParse(Animator.playbackRate) ??
          tryParse(Animator.speed) ??
          tryParse(Animator.timescale) ??
          tryParse(Animator.time_scale);
        if (v !== null) return v;
      }

      if (typeof Animation !== "undefined" && Animation?.selected) {
        const a = Animation.selected;
        const v =
          tryParse(a?.playback_speed) ??
          tryParse(a?.playbackSpeed) ??
          tryParse(a?.speed) ??
          tryParse(a?.timescale) ??
          tryParse(a?.time_scale);
        if (v !== null) return v;
      }

      if (typeof BarItems !== "undefined" && BarItems) {
        const v =
          tryParse(BarItems.playback_speed?.value) ??
          tryParse(BarItems.playback_speed) ??
          tryParse(BarItems.animation_speed?.value) ??
          tryParse(BarItems.animation_speed);
        if (v !== null) return v;
      }
    } catch (e) {}
    return 1.0;
  }

  // ============================================================
  // Textures
  // ============================================================

  function createMovingGroundGridTexture(
    sizePx,
    minorAlpha = 1.0,
    majorAlpha = 1.0,
    backgroundColor = "#2b2b2b",
    gridColor = "#ffffff",
    lineThicknessMult = 1.0
  ) {
    const s = Math.max(64, Math.min(2048, Math.floor(sizePx || 512)));
    const canvas = document.createElement("canvas");
    canvas.width = s;
    canvas.height = s;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = String(backgroundColor || "#2b2b2b");
    ctx.fillRect(0, 0, s, s);

    const rgb = parseHexColorToRgb255(gridColor) ||
      parseHexColorToRgb255("#ffffff") || { r: 255, g: 255, b: 255 };

    const minor = Math.max(8, Math.floor(s / 16));
    const major = minor * 4;

    const mult = Math.max(0.25, Math.min(6, Number(lineThicknessMult) || 1));
    const baseLineW = Math.max(0.25, Math.min(10, (s / 512) * mult));
    const majorLineW = Math.max(baseLineW, Math.min(14, baseLineW * 1.75));

    // Minor grid
    ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${Math.max(
      0,
      Math.min(1, minorAlpha)
    )})`;
    ctx.lineWidth = baseLineW;
    for (let i = 0; i <= s; i += minor) {
      ctx.beginPath();
      ctx.moveTo(i + 0.5, 0);
      ctx.lineTo(i + 0.5, s);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i + 0.5);
      ctx.lineTo(s, i + 0.5);
      ctx.stroke();
    }

    // Major grid
    ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${Math.max(
      0,
      Math.min(1, majorAlpha)
    )})`;
    ctx.lineWidth = majorLineW;
    for (let i = 0; i <= s; i += major) {
      ctx.beginPath();
      ctx.moveTo(i + 0.5, 0);
      ctx.lineTo(i + 0.5, s);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i + 0.5);
      ctx.lineTo(s, i + 0.5);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    try {
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestMipmapNearestFilter;
      tex.generateMipmaps = true;
      tex.anisotropy = 1;
      tex.matrixAutoUpdate = true;
    } catch (e) {}
    tex.needsUpdate = true;
    return tex;
  }

  function createMovingGroundCustomTextureFromDataUrl(dataUrl) {
    const url = String(dataUrl || "");
    if (!url) return null;
    try {
      const img = new Image();
      img.src = url;
      const tex = new THREE.Texture(img);
      img.onload = () => {
        try {
          tex.magFilter = THREE.NearestFilter;
          tex.minFilter = THREE.NearestFilter;
          tex.generateMipmaps = false;
          tex.anisotropy = 1;
          tex.needsUpdate = true;
        } catch (e) {}
      };

      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      try {
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        tex.generateMipmaps = false;
        tex.anisotropy = 1;
        tex.matrixAutoUpdate = true;
      } catch (e) {}

      tex.needsUpdate = true;
      return tex;
    } catch (e) {}
    return null;
  }

  // ============================================================
  // Material helpers
  // ============================================================

  function isGifRecordingActive() {
    try {
      const el = document.getElementById("gif_recording_frame");
      return !!el && el.classList?.contains?.("recording");
    } catch (e) {}
    return false;
  }

  // Shader patch: edge fade (plane borders)
  // - UV-space alpha fade so edges softly disappear (no texture regeneration)
  // - Chains other onBeforeCompile hooks and self-heals if the material is recompiled
  function enableEdgeFadeOnMaterial(material, fadeWidthUv = 0.08, ditherForGif = false) {
    try {
      if (!material) return;
      const w = Math.max(0.001, Math.min(0.5, Number(fadeWidthUv) || 0.08));
      const d = ditherForGif ? 1 : 0;

      material.userData = material.userData || {};

      // If already enabled, just update width (no shader recompile)
      if (material.userData.__mgpEdgeFadeEnabled) {
        const prevW = Number(material.userData.__mgpEdgeFadeWidthUv ?? 0);
        const prevD = Number(material.userData.__mgpEdgeFadeDither ?? 0);
        material.userData.__mgpEdgeFadeWidthUv = w;
        material.userData.__mgpEdgeFadeDither = d;
        try {
          if (material.userData.__mgpEdgeFadeUniform?.value !== undefined) {
            material.userData.__mgpEdgeFadeUniform.value = w;
          }
        } catch (e) {}
        try {
          if (material.userData.__mgpEdgeFadeDitherUniform?.value !== undefined) {
            material.userData.__mgpEdgeFadeDitherUniform.value = d;
          }
        } catch (e) {}

        // If the uniform handles are missing (e.g. a different renderer compiled the material),
        // request a recompile so onBeforeCompile can re-bind uniforms.
        try {
          if (!material.userData.__mgpEdgeFadeUniform || !material.userData.__mgpEdgeFadeDitherUniform) {
            material.needsUpdate = true;
          }
        } catch (e) {}

        // If another system replaced onBeforeCompile, recompile so our hook runs again.
        try {
          if (
            material.userData.__mgpEdgeFadeOnBeforeCompileRef &&
            material.onBeforeCompile !== material.userData.__mgpEdgeFadeOnBeforeCompileRef
          ) {
            material.needsUpdate = true;
          }
        } catch (e) {}

        // Safety: occasionally Blockbench/Three can end up with stale shader state.
        // Debounce a recompile after the user stops scrubbing to guarantee the new value sticks.
        try {
          const changed = Math.abs(prevW - w) > 1e-6 || prevD !== d;
          if (changed) {
            if (material.userData.__mgpEdgeFadeRecompileTimer) {
              clearTimeout(material.userData.__mgpEdgeFadeRecompileTimer);
            }
            material.userData.__mgpEdgeFadeRecompileTimer = setTimeout(() => {
              try {
                material.needsUpdate = true;
              } catch (e) {}
            }, 120);
          }
        } catch (e) {}
        return;
      }

      material.userData.__mgpEdgeFadeEnabled = true;
      material.userData.__mgpEdgeFadeWidthUv = w;
      material.userData.__mgpEdgeFadeDither = d;
      if (material.userData.__mgpPrevOnBeforeCompile === undefined) {
        material.userData.__mgpPrevOnBeforeCompile = material.onBeforeCompile || null;
      }

      // Needs blending for fade.
      material.transparent = true;
      material.depthWrite = false;

      material.onBeforeCompile = (shader) => {
        try {
          // Preserve any previous shader modifications from Blockbench/other plugins
          try {
            const prev = material?.userData?.__mgpPrevOnBeforeCompile;
            if (typeof prev === "function") prev(shader);
          } catch (e) {}

          const curW = Math.max(
            0.001,
            Math.min(0.5, Number(material?.userData?.__mgpEdgeFadeWidthUv ?? 0.08) || 0.08)
          );
          const curD = Number(material?.userData?.__mgpEdgeFadeDither) ? 1 : 0;
          shader.uniforms.mgpEdgeFadeWidthUv = { value: curW };
          shader.uniforms.mgpEdgeFadeDither = { value: curD };
          try {
            material.userData.__mgpEdgeFadeUniform = shader.uniforms.mgpEdgeFadeWidthUv;
            material.userData.__mgpEdgeFadeDitherUniform = shader.uniforms.mgpEdgeFadeDither;
          } catch (e) {}

          // IMPORTANT: vUv in MeshBasicMaterial is usually the *transformed* UV (repeat/offset/matrix).
          // We want the plane-edge fade to stay glued to the geometry, not scroll with the texture.
          // So we pass through the raw geometry UV as mgpUv0.
          shader.vertexShader = `varying vec2 mgpUv0;\n` + shader.vertexShader;
          shader.fragmentShader =
            `uniform float mgpEdgeFadeWidthUv;\n` +
            `uniform float mgpEdgeFadeDither;\n` +
            `varying vec2 mgpUv0;\n` +
            `float mgpBayer4(vec2 p) {\n` +
            `  vec2 fp = floor(mod(p, 4.0));\n` +
            `  int x = int(fp.x);\n` +
            `  int y = int(fp.y);\n` +
            `  int i = x + y * 4;\n` +
            `  float b = 0.0;\n` +
            `  if (i == 0) b = 0.0; else if (i == 1) b = 8.0; else if (i == 2) b = 2.0; else if (i == 3) b = 10.0;\n` +
            `  else if (i == 4) b = 12.0; else if (i == 5) b = 4.0; else if (i == 6) b = 14.0; else if (i == 7) b = 6.0;\n` +
            `  else if (i == 8) b = 3.0; else if (i == 9) b = 11.0; else if (i == 10) b = 1.0; else if (i == 11) b = 9.0;\n` +
            `  else if (i == 12) b = 15.0; else if (i == 13) b = 7.0; else if (i == 14) b = 13.0; else if (i == 15) b = 5.0;\n` +
            `  return (b + 0.5) / 16.0;\n` +
            `}\n` +
            shader.fragmentShader;

          const uvInject = `mgpUv0 = uv;\n#include <uv_vertex>`;
          const vsBefore = shader.vertexShader;
          let vsAfter = shader.vertexShader.replace(/#include <uv_vertex>/g, uvInject);
          if (vsAfter === vsBefore) {
            // Fallback: insert right after main() starts.
            vsAfter = shader.vertexShader.replace(
              /void\s+main\s*\(\s*\)\s*\{/,
              (m) => `${m}\n  mgpUv0 = uv;`
            );
          }
          shader.vertexShader = vsAfter;

          const inject = `
            vec2 mgpEdgeUv = clamp(mgpUv0, 0.0, 1.0);
            float mgpEdgeDist = min(min(mgpEdgeUv.x, 1.0 - mgpEdgeUv.x), min(mgpEdgeUv.y, 1.0 - mgpEdgeUv.y));
            float mgpEdgeFade = smoothstep(0.0, mgpEdgeFadeWidthUv, mgpEdgeDist);
            float mgpB = mgpBayer4(gl_FragCoord.xy);
            float mgpEdgeFadeMask = mix(mgpEdgeFade, step(mgpB, mgpEdgeFade), clamp(mgpEdgeFadeDither, 0.0, 1.0));
            diffuseColor.a *= mgpEdgeFadeMask;
          `;

          // Preferred path: modify alpha then run normal output chunk.
          const before = shader.fragmentShader;
          let after = shader.fragmentShader.replace(
            /#include <output_fragment>/g,
            `${inject}\n#include <output_fragment>`
          );

          // Fallback: if output chunk is inlined, patch common assignments.
          if (after === before) {
            after = after.replace(
              /gl_FragColor\s*=\s*vec4\s*\(\s*outgoingLight\s*,\s*diffuseColor\.a\s*\)\s*;/g,
              `${inject}\n  gl_FragColor = vec4(outgoingLight, diffuseColor.a);`
            );
          }
          shader.fragmentShader = after;
        } catch (e) {}
      };

      try {
        material.userData.__mgpEdgeFadeOnBeforeCompileRef = material.onBeforeCompile;
      } catch (e) {}

      material.needsUpdate = true;
    } catch (e) {}
  }

  function disableEdgeFadeOnMaterial(material) {
    try {
      if (!material?.userData?.__mgpEdgeFadeEnabled) return;
      material.userData.__mgpEdgeFadeEnabled = false;
      try {
        delete material.userData.__mgpEdgeFadeUniform;
        delete material.userData.__mgpEdgeFadeDitherUniform;
        delete material.userData.__mgpEdgeFadeOnBeforeCompileRef;
        if (material.userData.__mgpEdgeFadeRecompileTimer) {
          clearTimeout(material.userData.__mgpEdgeFadeRecompileTimer);
        }
        delete material.userData.__mgpEdgeFadeRecompileTimer;
      } catch (e) {}
      const prev = material.userData.__mgpPrevOnBeforeCompile;
      material.onBeforeCompile = typeof prev === "function" ? prev : null;
      material.needsUpdate = true;
    } catch (e) {}
  }

  // ============================================================
  // Moving Ground Rig
  // ============================================================

  class MovingGroundRig {
    constructor() {
      this.group = null;
      this.plane = null;
      this.depth_plane = null;
      this.side_helper = null;
      this.texture = null;
      this._raf = null;
      this._lastMs = 0;

      this._gridBlocksPerTile = null;
      this._texResPx = null;
      this._gridColor = null;
      this._bgColor = null;
      this._gridMinorOpacity = null;
      this._gridMajorOpacity = null;
      this._bgOpacity = null;
      this._lineThicknessMult = null;
      this._useCustomTexture = null;
      this._customTextureDataUrl = null;
      this._customRot90 = null;
      this._customFlipX = null;
      this._customFlipY = null;

      // Effective rotation applied to the texture (0..3). Used to keep scroll direction stable.
      this._effectiveScrollRot90 = 0;

      // Timeline-anchored scrolling
      this._timelineAnchorTime = null;
      this._timelineAnchorOffsetX = 0;
      this._timelineAnchorOffsetY = 0;
      this._timelineAnchorSpeed = null;
      this._timelineAnchorTileBlocks = null;

      // Cached timeline/playback values to avoid heavy polling each frame
      this._cachePlaying = false;
      this._cachePlayingMs = 0;
      this._cacheTimelineSec = null;
      this._cacheTimelineMs = 0;
      this._cachePlaybackMult = 1.0;
      this._cachePlaybackMs = 0;
    }

    ensure() {
      if (this.group) return;
      if (!Canvas?.scene) return;

      const g = new THREE.Group();
      g.name = "cazfps_animated_platforms";

      const geom = new THREE.PlaneGeometry(1, 1, 1, 1);
      const tex = createMovingGroundGridTexture(512);

      // Depth-only prepass mesh: makes the plane behave as a solid occluder.
      // It writes to the depth buffer but does not draw color.
      const depthMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: false,
        opacity: 1,
        side: THREE.DoubleSide,
        depthTest: true,
        depthWrite: true,
        colorWrite: false,
      });

      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
        depthTest: true,
        depthWrite: false,
      });

      if (Settings.edgeFadeEnabled !== false) {
        enableEdgeFadeOnMaterial(
          mat,
          Math.max(0.001, Math.min(0.5, Number(Settings.edgeFadeWidthUv ?? 0.08))),
          false
        );
      }

      const depthPlane = new THREE.Mesh(geom, depthMat);
      depthPlane.name = "cazfps_animated_platforms_depth";
      depthPlane.rotation.x = -Math.PI / 2;
      depthPlane.renderOrder = -60;
      depthPlane.frustumCulled = false;

      const plane = new THREE.Mesh(geom, mat);
      plane.name = "cazfps_animated_platforms_mesh";
      plane.rotation.x = -Math.PI / 2;
      plane.renderOrder = -50;
      plane.frustumCulled = false;

      // Side-view helper: a thin line that stays visible in *exact* orthographic side views
      // so the user can still reference the ground height when the plane is edge-on.
      const helperGeom = new THREE.BufferGeometry();
      helperGeom.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(6), 3)
      );
      const helperMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        depthTest: false,
      });
      const sideHelper = new THREE.Line(helperGeom, helperMat);
      sideHelper.name = "cazfps_animated_platforms_side_helper";
      sideHelper.renderOrder = 10_000;
      sideHelper.frustumCulled = false;
      sideHelper.visible = false;

      g.add(depthPlane);
      g.add(plane);
      g.add(sideHelper);
      Canvas.scene.add(g);

      this.group = g;
      this.plane = plane;
      this.depth_plane = depthPlane;
      this.side_helper = sideHelper;
      this.texture = tex;
    }

    start() {
      if (this._raf) return;
      this._lastMs =
        typeof performance !== "undefined" && performance.now
          ? performance.now()
          : Date.now();

      const loop = () => {
        // If we were stopped/disposed while a frame was queued.
        if (!this._raf) return;

        try {
          this.tick();
        } catch (e) {}

        // Only keep the loop alive while enabled + visible.
        if (Settings?.enabled && this.group?.visible) {
          this._raf = requestAnimationFrame(loop);
        } else {
          this._raf = null;
        }
      };

      this._raf = requestAnimationFrame(loop);
    }

    stop() {
      if (!this._raf) return;
      try {
        cancelAnimationFrame(this._raf);
      } catch (e) {}
      this._raf = null;
    }

    dispose() {
      this.stop();
      try {
        if (this.plane) {
          this.plane.geometry?.dispose?.();
          this.plane.material?.dispose?.();
        }
        if (this.depth_plane) {
          this.depth_plane.material?.dispose?.();
        }
        if (this.side_helper) {
          this.side_helper.geometry?.dispose?.();
          this.side_helper.material?.dispose?.();
        }
      } catch (e) {}
      try {
        this.texture?.dispose?.();
      } catch (e) {}
      try {
        Canvas?.scene?.remove(this.group);
      } catch (e) {}

      this.group = null;
      this.plane = null;
      this.depth_plane = null;
      this.side_helper = null;
      this.texture = null;
    }

    _updateOrthoSideHelper() {
      const helper = this.side_helper;
      if (!helper?.geometry) return;
      try {
        helper.visible = false;
        const cam = Canvas?.camera;
        if (!cam) return;
        if (!cam.isOrthographicCamera) return;
        if (!this.group) return;

        // Camera direction in world space
        const dir = new THREE.Vector3();
        cam.getWorldDirection(dir);

        // Convert camera direction into the platform's local space (respect yaw/tilt)
        const invQ = this.group.getWorldQuaternion(new THREE.Quaternion()).invert();
        dir.applyQuaternion(invQ).normalize();

        // Only show when it's truly side-on: almost perfectly horizontal, and nearly aligned to ±X or ±Z.
        const epsY = 0.01; // ~0.57°
        const epsAxis = 0.001; // extremely strict axis alignment
        if (Math.abs(dir.y) > epsY) return;

        const ax = Math.abs(dir.x);
        const az = Math.abs(dir.z);
        const alignedX = ax > 1 - epsAxis;
        const alignedZ = az > 1 - epsAxis;
        if (!alignedX && !alignedZ) return;

        const blockSize = 16;
        const widthBlocks = Math.max(3, Number(Settings.widthBlocks || 256));
        const lengthBlocks = Math.max(3, Number(Settings.lengthBlocks || 256));
        const halfW = (widthBlocks * blockSize) / 2;
        const halfL = (lengthBlocks * blockSize) / 2;

        const pos = helper.geometry.attributes.position;
        if (!pos || pos.count < 2) return;

        if (alignedX) {
          // Looking along local ±X: show a line across local Z at y=0.
          pos.setXYZ(0, 0, 0, -halfL);
          pos.setXYZ(1, 0, 0, halfL);
        } else {
          // Looking along local ±Z: show a line across local X at y=0.
          pos.setXYZ(0, -halfW, 0, 0);
          pos.setXYZ(1, halfW, 0, 0);
        }
        pos.needsUpdate = true;

        try {
          // Tint like the grid color, and use the major opacity as intensity.
          helper.material.color = new THREE.Color(
            normalizeColorToHex(Settings.gridColor, "#ffffff")
          );
          helper.material.opacity = Math.max(
            0.15,
            Math.min(1, Number(Settings.gridMajorOpacity ?? 1.0))
          );
          helper.material.needsUpdate = false;
        } catch (e) {}

        helper.visible = true;
      } catch (e) {}
    }

    setEnabled(enabled) {
      this.ensure();
      if (!this.group || !this.plane) return;
      const on = !!enabled;
      this.group.visible = on;
      if (on) this.start();
      else this.stop();
    }

    rebuildTexture(
      blocksPerTile,
      resPx,
      backgroundColor,
      backgroundOpacity,
      gridColor,
      minorAlpha,
      majorAlpha,
      lineThicknessMult,
      useCustomTexture,
      customTextureDataUrl
    ) {
      if (!this.plane) return;

      const bpt = Math.max(0.25, Math.min(1024, Number(blocksPerTile) || 16));
      const res = Math.max(64, Math.min(2048, Math.floor(resPx || 512)));
      const bg = normalizeColorToHex(backgroundColor, "#2b2b2b");
      const bgA = Math.max(0, Math.min(1, Number(backgroundOpacity ?? 1.0)));
      const gc = normalizeColorToHex(gridColor, "#ffffff");
      const minorA = Math.max(0, Math.min(1, Number(minorAlpha ?? 1.0)));
      const majorA = Math.max(0, Math.min(1, Number(majorAlpha ?? 1.0)));
      const thickness = Math.max(
        0.25,
        Math.min(6, Number(lineThicknessMult) || 1)
      );
      const dataUrl = String(customTextureDataUrl || "");
      const useCustom = !!useCustomTexture && !!dataUrl;

      const oldTex = this.texture;
      const prevOffsetX = oldTex?.offset?.x || 0;
      const prevOffsetY = oldTex?.offset?.y || 0;

      const newTex = useCustom
        ? createMovingGroundCustomTextureFromDataUrl(dataUrl)
        : createMovingGroundGridTexture(
            res,
            minorA,
            majorA,
            hexToRgbaCss(bg, bgA),
            gc,
            thickness
          );

      if (!newTex) return;

      try {
        newTex.offset.set(prevOffsetX, prevOffsetY);
      } catch (e) {}

      this.texture = newTex;
      const mat = this.plane.material;
      if (mat && mat.map !== newTex) {
        mat.map = newTex;
        mat.needsUpdate = true;
      }
      try {
        oldTex?.dispose?.();
      } catch (e) {}

      this._gridBlocksPerTile = bpt;
      this._texResPx = res;
      this._bgColor = bg;
      this._bgOpacity = bgA;
      this._gridColor = gc;
      this._gridMinorOpacity = minorA;
      this._gridMajorOpacity = majorA;
      this._lineThicknessMult = thickness;
      this._useCustomTexture = useCustom;
      this._customTextureDataUrl = dataUrl;
    }

    refresh() {
      this.ensure();
      if (!this.group || !this.plane) return;

      const blockSize = 16;
      const widthBlocks = Math.max(3, Number(Settings.widthBlocks || 256));
      const lengthBlocks = Math.max(3, Number(Settings.lengthBlocks || 256));
      const width = widthBlocks * blockSize;
      const length = lengthBlocks * blockSize;

      const opacity = Math.max(0, Math.min(1, Number(Settings.opacity ?? 1)));
      const yBlocks = Number(Settings.yBlocks || 0);
      const xBlocks = Number(Settings.xBlocks || 0);
      const zBlocks = Number(Settings.zBlocks || 0);
      const yaw = Number(Settings.yaw || 0);
      const tilt = Number(Settings.tilt || 0);

      const gridBlocksPerTile = Math.max(
        0.25,
        Math.min(1024, Number(Settings.gridBlocksPerTile || 16))
      );
      const texResPx = Math.max(
        64,
        Math.min(2048, Math.floor(Number(Settings.textureResolutionPx || 512)))
      );

      const bgColor = normalizeColorToHex(Settings.backgroundColor, "#2b2b2b");
      const bgOpacity = Math.max(0, Math.min(1, Number(Settings.backgroundOpacity ?? 1.0)));
      const gridColor = normalizeColorToHex(Settings.gridColor, "#ffffff");
      const minorAlpha = Math.max(0, Math.min(1, Number(Settings.gridMinorOpacity ?? 1.0)));
      const majorAlpha = Math.max(0, Math.min(1, Number(Settings.gridMajorOpacity ?? 1.0)));
      const lineThicknessMult = Math.max(
        0.25,
        Math.min(6, Number(Settings.lineThicknessMult || 1))
      );
      const useCustomTexture = !!Settings.useCustomTexture;
      const customTextureDataUrl = String(Settings.customTextureDataUrl || "");
      const effectiveUseCustomTexture =
        useCustomTexture && !!customTextureDataUrl;

      const rot90 = Math.max(
        0,
        Math.min(3, Math.floor(Number(Settings.customTextureRotation90 ?? 0)))
      );
      const flipX = !!Settings.customTextureFlipX;
      const flipY = !!Settings.customTextureFlipY;

      this.plane.scale.set(width, length, 1);
      if (this.depth_plane) this.depth_plane.scale.set(width, length, 1);

      this.group.position.set(
        xBlocks * blockSize,
        yBlocks * blockSize,
        zBlocks * blockSize
      );
      this.group.rotation.set(
        THREE.MathUtils.degToRad(tilt),
        THREE.MathUtils.degToRad(yaw),
        0
      );

      if (
        this._gridBlocksPerTile !== gridBlocksPerTile ||
        this._texResPx !== texResPx ||
        this._bgColor !== bgColor ||
        this._bgOpacity !== bgOpacity ||
        this._gridColor !== gridColor ||
        this._gridMinorOpacity !== minorAlpha ||
        this._gridMajorOpacity !== majorAlpha ||
        this._lineThicknessMult !== lineThicknessMult ||
        this._useCustomTexture !== effectiveUseCustomTexture ||
        this._customTextureDataUrl !== customTextureDataUrl
      ) {
        this.rebuildTexture(
          gridBlocksPerTile,
          texResPx,
          bgColor,
          bgOpacity,
          gridColor,
          minorAlpha,
          majorAlpha,
          lineThicknessMult,
          effectiveUseCustomTexture,
          customTextureDataUrl
        );
      }

      if (this.texture) {
        const denom = Math.max(0.25, gridBlocksPerTile);
        const repX = widthBlocks / denom;
        const repY = lengthBlocks / denom;
        // Apply custom texture transforms without regenerating textures.
        // These controls only apply to custom textures.
        const tRot = effectiveUseCustomTexture ? rot90 : 0;
        const tFlipX = effectiveUseCustomTexture ? flipX : false;
        const tFlipY = effectiveUseCustomTexture ? flipY : false;

        // Cache the effective rotation so the tick() can compensate scrolling.
        this._effectiveScrollRot90 = tRot;

        // Note: rotation swaps repeat axes.
        const oddRot = tRot % 2 === 1;
        const baseRepU = oddRot ? repY : repX;
        const baseRepV = oddRot ? repX : repY;

        const repU = baseRepU * (tFlipX ? -1 : 1);
        const repV = baseRepV * (tFlipY ? -1 : 1);

        this.texture.repeat.set(repU, repV);
        try {
          this.texture.center.set(0.5, 0.5);
          // Keep U anchored; compensate for negative repeat so tiling stays aligned.
          this.texture.offset.x = repU < 0 ? 1 : 0;
        } catch (e) {}
        try {
          this.texture.rotation = (Math.PI / 2) * tRot;
        } catch (e) {}
        this.texture.matrixAutoUpdate = true;
        try {
          this.texture.updateMatrix?.();
        } catch (e) {}
        // Changing offset/repeat/transform matrix does not require a texture re-upload.
      }

      // Track whether the visible plane is treated as transparent in Three's renderer.
      // If it is, we must not keep the depth-only occluder enabled; otherwise it blocks
      // objects behind the plane (e.g. the model above when viewing from below).
      let nextTransparent = opacity < 0.999;

      try {
        const mat = this.plane.material;
        if (mat) {
          // Edge fade toggle
          try {
            if (Settings.edgeFadeEnabled !== false) {
              const w = Math.max(
                0.001,
                Math.min(0.5, Number(Settings.edgeFadeWidthUv ?? 0.08))
              );
              enableEdgeFadeOnMaterial(mat, w, isGifRecordingActive());
            } else {
              disableEdgeFadeOnMaterial(mat);
            }
          } catch (e) {}

          const edgeFadeActive = !!mat.userData?.__mgpEdgeFadeEnabled;
          nextTransparent = edgeFadeActive || opacity < 0.999;
          const nextDepthWrite = !nextTransparent;
          const prevTransparent = !!mat.transparent;
          const prevDepthWrite = !!mat.depthWrite;

          // Transparency blending needs the plane to render after opaque meshes.
          // The mesh is created with a negative renderOrder (so it sits "under" the scene),
          // but that makes semi-transparent opacity ineffective when viewing from below.
          try {
            const desiredOrder = nextTransparent ? 50 : -50;
            if (this.plane && this.plane.renderOrder !== desiredOrder) {
              this.plane.renderOrder = desiredOrder;
            }
          } catch (e) {}

          mat.opacity = opacity;
          mat.transparent = nextTransparent;
          mat.depthWrite = nextDepthWrite;

          if (prevTransparent !== nextTransparent || prevDepthWrite !== nextDepthWrite) {
            mat.needsUpdate = true;
          }
        }
      } catch (e) {}

      // Control whether the occluder is active.
      // The occluder exists to make the platform behave like a solid ground plane.
      // Only enable it when the user actually wants an opaque plane (opacity ~ 1).
      // If opacity is lowered, the occluder would block models behind the plane.
      try {
        if (this.depth_plane) {
          const maxTexAlpha = effectiveUseCustomTexture
            ? 1
            : Math.max(bgOpacity, minorAlpha, majorAlpha);
          const effectiveAlpha = opacity * maxTexAlpha;
          const wantsOpaqueOccluder = opacity >= 0.999;
          this.depth_plane.visible = wantsOpaqueOccluder && effectiveAlpha > 1e-4;
        }
      } catch (e) {}

      // Cache custom texture transform settings
      this._customRot90 = rot90;
      this._customFlipX = flipX;
      this._customFlipY = flipY;

      this.setEnabled(!!Settings.enabled);
    }

    tick() {
      // Safety: if the user disabled the plane but something left the timer running,
      // stop it immediately to avoid persistent lag.
      if (!Settings?.enabled) {
        try {
          if (this.group) this.group.visible = false;
        } catch (e) {}
        this.stop();
        return;
      }

      if (!this.group?.visible) return;

      // Keep the orthographic side helper reactive to camera changes.
      // This is very cheap (a few vector ops) and makes side views usable.
      this._updateOrthoSideHelper();

      if (!this.texture) return;

      const wrap01 = (v) => {
        let x = Number(v || 0);
        x = x % 1;
        if (x < 0) x += 1;
        return x;
      };

      // Rotating the texture should not rotate the *movement direction*.
      // Compensate by scrolling along a different UV axis depending on rotation.
      const rot90 = Number(this._effectiveScrollRot90 || 0) & 3;
      const scrollDeltaToUv = (deltaUv) => {
        switch (rot90) {
          case 1:
            return { du: deltaUv, dv: 0 };
          case 2:
            return { du: 0, dv: -deltaUv };
          case 3:
            return { du: -deltaUv, dv: 0 };
          default:
            return { du: 0, dv: deltaUv };
        }
      };

      const now =
        typeof performance !== "undefined" && performance.now
          ? performance.now()
          : Date.now();

      const speed = Number(Settings.speedBlocksPerSec || 0);
      const gridBlocksPerTile = Math.max(
        0.25,
        Math.min(1024, Number(Settings.gridBlocksPerTile || 16))
      );
      const effectiveTileBlocks = Math.max(0.25, gridBlocksPerTile);

      // Fast-path: nothing to animate.
      if (!speed) {
        this._lastMs = now;
        return;
      }

      // Cache play state (and playback speed) to reduce per-tick overhead.
      let playing = this._cachePlaying;
      // Keep this responsive: when the user hits pause/stop, the ground should stop immediately.
      // We still keep a tiny cache window to avoid redundant checks multiple times within the same ms.
      if (!this._cachePlayingMs || now - this._cachePlayingMs > 16) {
        const prevPlaying = this._cachePlaying;
        playing = isBlockbenchAnimationPlaying();
        this._cachePlaying = playing;
        this._cachePlayingMs = now;

        // If we just transitioned from playing -> paused, avoid any extra "drift".
        if (prevPlaying && !playing) {
          this._lastMs = now;
          this._timelineAnchorTime = null;
          this._timelineAnchorSpeed = null;
          this._timelineAnchorTileBlocks = null;
        }
      }

      if (!playing) {
        let timelineSec = this._cacheTimelineSec;
        if (!this._cacheTimelineMs || now - this._cacheTimelineMs > 60) {
          timelineSec = getBlockbenchTimelineTimeSeconds();
          this._cacheTimelineSec = timelineSec;
          this._cacheTimelineMs = now;
        }
        if (Number.isFinite(timelineSec)) {
          const t = Number(timelineSec);

          if (
            this._timelineAnchorTime === null ||
            this._timelineAnchorSpeed !== speed ||
            this._timelineAnchorTileBlocks !== effectiveTileBlocks
          ) {
            this._timelineAnchorTime = t;
            this._timelineAnchorOffsetX = this.texture.offset?.x || 0;
            this._timelineAnchorOffsetY = this.texture.offset?.y || 0;
            this._timelineAnchorSpeed = speed;
            this._timelineAnchorTileBlocks = effectiveTileBlocks;
          }

          const deltaUv =
            ((t - this._timelineAnchorTime) * speed) / effectiveTileBlocks;
          const { du, dv } = scrollDeltaToUv(deltaUv);
          const nextX = wrap01(this._timelineAnchorOffsetX + du);
          const nextY = wrap01(this._timelineAnchorOffsetY + dv);
          const curX = Number(this.texture.offset?.x || 0);
          const curY = Number(this.texture.offset?.y || 0);
          if (Math.abs(nextX - curX) > 1e-6) this.texture.offset.x = nextX;
          if (Math.abs(nextY - curY) > 1e-6) this.texture.offset.y = nextY;
          this._lastMs = now;
          return;
        }

        this._lastMs = now;
        return;
      }

      this._timelineAnchorTime = null;
      this._timelineAnchorSpeed = null;
      this._timelineAnchorTileBlocks = null;

      const dt = Math.max(0, Math.min(0.2, (now - this._lastMs) / 1000));
      this._lastMs = now;

      let playbackMult = this._cachePlaybackMult;
      if (!this._cachePlaybackMs || now - this._cachePlaybackMs > 250) {
        playbackMult = getBlockbenchPlaybackSpeedMult();
        this._cachePlaybackMult = playbackMult;
        this._cachePlaybackMs = now;
      }
      const effectiveSpeed = speed * playbackMult;

      const deltaUv = (effectiveSpeed * dt) / effectiveTileBlocks;
      const { du, dv } = scrollDeltaToUv(deltaUv);
      const nextX = wrap01((this.texture.offset?.x || 0) + du);
      const nextY = wrap01((this.texture.offset?.y || 0) + dv);
      const curX = Number(this.texture.offset?.x || 0);
      const curY = Number(this.texture.offset?.y || 0);
      if (Math.abs(nextX - curX) > 1e-6) this.texture.offset.x = nextX;
      if (Math.abs(nextY - curY) > 1e-6) this.texture.offset.y = nextY;
    }
  }

  const rig = new MovingGroundRig();

  // ============================================================
  // Animation presets (per-project + per-animation)
  // ============================================================

  function getSelectedAnimationSafe() {
    try {
      if (typeof Animation !== "undefined" && Animation?.selected) return Animation.selected;
      if (typeof Animator !== "undefined" && Animator?.animation) return Animator.animation;
    } catch (e) {}
    return null;
  }

  function getSelectedAnimationKey() {
    const a = getSelectedAnimationSafe();
    if (!a) return null;

    // Prefer stable UUID when available.
    const uuid = String(a?.uuid || a?._uuid || "").trim();
    if (uuid) return `uuid:${uuid}`;

    const name = String(a?.name || "").trim();
    if (name) return `name:${name}`;

    const id = String(a?.id || "").trim();
    if (id) return `id:${id}`;

    return null;
  }

  function getSelectedAnimationName() {
    const a = getSelectedAnimationSafe();
    const name = String(a?.name || "").trim();
    return name || "(Unnamed Animation)";
  }

  function sanitizeStorageKeyPart(value) {
    return String(value || "global")
      .trim()
      .replace(/[^a-z0-9._-]+/gi, "_")
      .slice(0, 200);
  }

  function hashStringFNV1a(str) {
    // Small, fast, stable hash for namespacing keys.
    // Returns 8-hex chars (32-bit).
    let h = 0x811c9dc5;
    const s = String(str || "");
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      // h *= 16777619 (but keep 32-bit)
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return ("00000000" + h.toString(16)).slice(-8);
  }

  function getProjectSafe() {
    try {
      // Accessing an undeclared global (Project) can throw a ReferenceError.
      if (typeof Project !== "undefined") return Project;
    } catch (e) {}
    return null;
  }

  function getProjectFilePathLike(p) {
    // Blockbench has used different field names across builds.
    // Prefer the real on-disk identity when available.
    try {
      const candidates = [
        p?.save_path,
        p?.savePath,
        p?.path,
        p?.file_path,
        p?.filePath,
        p?.model_path,
        p?.modelPath,
        p?.export_path,
        p?.exportPath,
      ]
        .map((v) => String(v || "").trim())
        .filter(Boolean);
      if (candidates.length) return candidates[0];
    } catch (e) {}
    return "";
  }

  function getAnimPresetPrimaryStorageKey() {
    try {
      const p = getProjectSafe();
      const filePath = getProjectFilePathLike(p);
      const uuid = String(p?.uuid || p?._uuid || p?.id || "").trim();
      const name = String(p?.name || "").trim();

      const ident = filePath
        ? `file:${filePath}`
        : uuid
          ? `uuid:${uuid}`
          : name
            ? `name:${name}`
            : "global";

      const hash = hashStringFNV1a(ident);
      const hint = sanitizeStorageKeyPart(ident).slice(0, 32);
      return `${PRESET_PREFIX}${hash}_${hint}`;
    } catch (e) {}
    return `${PRESET_PREFIX}global`;
  }

  const _mgpProjectInstanceIds = new WeakMap();
  function getOrCreateProjectInstanceId(p) {
    try {
      if (!p || typeof p !== "object") return "no_project";
      const existing = _mgpProjectInstanceIds.get(p);
      if (existing) return existing;
      const id =
        "inst_" +
        Date.now().toString(36) +
        "_" +
        Math.random().toString(36).slice(2, 10);
      _mgpProjectInstanceIds.set(p, id);
      return id;
    } catch (e) {}
    return "no_project";
  }

  function getProjectIdentityKey() {
    // Each save must be unique to the bbmodel.
    // Prefer a stable on-disk identity (path). If unsaved, prefer a session-unique
    // Project uuid/id over Project name (names collide a lot across models).
    try {
      const p = getProjectSafe();
      const filePath = getProjectFilePathLike(p);
      if (filePath) return `file:${filePath}`;

      const candidates = [
        p?.uuid,
        p?._uuid,
        p?.id,
        // Some builds attach a per-project UUID under different names
        p?.project_uuid,
        p?.projectUUID,
      ]
        .map((v) => String(v || "").trim())
        .filter(Boolean);
      if (candidates.length) return `uuid:${candidates[0]}`;

      const name = String(p?.name || "").trim();
      if (name) return `name:${name}`;

      // Absolute last resort: per-project-instance identity.
      // Ensures different open models don't collide even if Blockbench doesn't expose
      // a path/uuid for them.
      return `inst:${getOrCreateProjectInstanceId(p)}`;
    } catch (e) {}
    return "global";
  }

  function getProjectNamespace() {
    // Use a hash to avoid collisions from sanitization/truncation.
    const ident = getProjectIdentityKey();
    const hash = hashStringFNV1a(ident);
    // Keep a short readable hint for debugging, but don't rely on it.
    const hint = sanitizeStorageKeyPart(ident).slice(0, 32);
    return `p_${hash}_${hint}`;
  }

  function getAnimPresetStorageKeys() {
    return [getAnimPresetPrimaryStorageKey()];
  }

  function getGlobalAnimPresetStorageKey() {
    return `${PRESET_PREFIX}global`;
  }

  function loadAnimPresetMap() {
    try {
      const keys = getAnimPresetStorageKeys();
      const merged = {};

      for (const key of keys) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const obj = JSON.parse(raw);
        if (obj && typeof obj === "object") Object.assign(merged, obj);
      }

      return merged;
    } catch (e) {}
    return {};
  }

  // Cache presets in-memory to avoid JSON parse churn while animating.
  let _presetCacheKeySig = null;
  let _presetCacheMap = null;

  function getPresetCacheKeySig() {
    try {
      const keys = [...getAnimPresetStorageKeys()];
      return keys.join("|");
    } catch (e) {}
    return "__preset_cache_sig__";
  }

  function loadAnimPresetMapCached() {
    const sig = getPresetCacheKeySig();
    if (_presetCacheMap && _presetCacheKeySig === sig) return _presetCacheMap;
    _presetCacheKeySig = sig;
    _presetCacheMap = loadAnimPresetMap();
    return _presetCacheMap;
  }

  function saveAnimPresetMap(map) {
    try {
      const keys = getAnimPresetStorageKeys();
      const primary = keys[0] || getGlobalAnimPresetStorageKey();
      localStorage.setItem(primary, JSON.stringify(map || {}));

      // Refresh cache immediately after saving.
      _presetCacheKeySig = null;
      _presetCacheMap = null;
    } catch (e) {}
  }

  function capturePreset() {
    return {
      enabled: !!Settings.enabled,
      edgeFadeEnabled: Settings.edgeFadeEnabled !== false,
      speedBlocksPerSec: Number(Settings.speedBlocksPerSec || 0),
      widthBlocks: Number(Settings.widthBlocks || 256),
      lengthBlocks: Number(Settings.lengthBlocks || 256),
      yBlocks: Number(Settings.yBlocks || 0),
      yaw: Number(Settings.yaw || 0),
      tilt: Number(Settings.tilt || 0),
      opacity: Number(Settings.opacity ?? 1.0),

      gridBlocksPerTile: Number(Settings.gridBlocksPerTile || 16),
      textureResolutionPx: Number(Settings.textureResolutionPx || 512),
      gridColor: normalizeColorToHex(Settings.gridColor, "#ffffff"),
      backgroundColor: normalizeColorToHex(Settings.backgroundColor, "#2b2b2b"),
      lineThicknessMult: Number(Settings.lineThicknessMult || 1.0),

      useCustomTexture: !!Settings.useCustomTexture,
      customTextureDataUrl: String(Settings.customTextureDataUrl || ""),
    };
  }

  function applyPreset(preset, options = {}) {
    if (!preset || typeof preset !== "object") return;

    const persist = options.persist !== false;
    const updateDialog = options.updateDialog !== false;

    Settings.enabled = !!preset.enabled;
    Settings.edgeFadeEnabled = preset.edgeFadeEnabled !== false;
    Settings.speedBlocksPerSec = Number(preset.speedBlocksPerSec || 0);

    // Backward compatibility: older presets stored sizeBlocks.
    const legacySize = Number(preset.sizeBlocks);
    const legacy = Number.isFinite(legacySize) ? legacySize : null;

    Settings.widthBlocks = Math.max(
      3,
      Number(preset.widthBlocks ?? legacy ?? 256)
    );
    Settings.lengthBlocks = Math.max(
      3,
      Number(preset.lengthBlocks ?? legacy ?? 256)
    );

    Settings.yBlocks = Number(preset.yBlocks || 0);
    Settings.yaw = Number(preset.yaw || 0);
    Settings.tilt = Number(preset.tilt || 0);
    Settings.opacity = Math.max(0, Math.min(1, Number(preset.opacity ?? 1.0)));

    Settings.gridBlocksPerTile = Math.max(
      0.25,
      Math.min(1024, Number(preset.gridBlocksPerTile || 16))
    );
    Settings.textureResolutionPx = Math.max(
      64,
      Math.min(2048, Math.floor(Number(preset.textureResolutionPx || 512)))
    );
    Settings.gridColor = normalizeColorToHex(preset.gridColor, "#ffffff");
    Settings.backgroundColor = normalizeColorToHex(
      preset.backgroundColor,
      "#2b2b2b"
    );
    Settings.lineThicknessMult = Math.max(
      0.25,
      Math.min(6, Number(preset.lineThicknessMult || 1.0))
    );

    Settings.useCustomTexture = !!preset.useCustomTexture;
    Settings.customTextureDataUrl = String(preset.customTextureDataUrl || "");

    if (persist) {
      Settings.save();
    }
    rig.refresh();
    if (updateDialog) refreshDialogFromSettings();
  }

  function getPresetSavedForLabel() {
    const key = getSelectedAnimationKey();
    if (!key) return "No animation selected";
    const map = loadAnimPresetMapCached();

    const a = getSelectedAnimationSafe();
    const legacyKeys = [];
    try {
      const name = String(a?.name || "").trim();
      if (name) {
        legacyKeys.push(name);
        legacyKeys.push(`name:${name}`);
      }
      const uuid = String(a?.uuid || a?._uuid || "").trim();
      if (uuid) {
        legacyKeys.push(uuid);
        legacyKeys.push(`uuid:${uuid}`);
        legacyKeys.push(`id:${uuid}`);
      }
      const id = String(a?.id || "").trim();
      if (id) {
        legacyKeys.push(id);
        legacyKeys.push(`id:${id}`);
      }
    } catch (e) {}

    if (map && (map[key] || legacyKeys.some((k) => map[k]))) {
      return `Saved for: ${getSelectedAnimationName()}`;
    }
    return "Not saved for this animation";
  }

  function savePresetForSelectedAnimation() {
    return savePresetForSelectedAnimationImpl({ silent: false });
  }

  function savePresetForAnimationKey(animKey, animName, options = {}) {
    const key = String(animKey || "");
    if (!key) return;
    const name = String(animName || "").trim() || "(Unnamed Animation)";
    const map = loadAnimPresetMapCached();
    map[key] = {
      name,
      savedAt: Date.now(),
      preset: capturePreset(),
    };
    saveAnimPresetMap(map);
  }

  function savePresetForSelectedAnimationImpl(options = {}) {
    const key = getSelectedAnimationKey();
    if (!key) {
      if (!options.silent) Blockbench.showQuickMessage("No animation selected");
      return;
    }

    savePresetForAnimationKey(key, getSelectedAnimationName(), options);

    if (!options.silent) {
      Blockbench.showQuickMessage(`Saved for ${getSelectedAnimationName()}`);
      refreshDialogFromSettings();
    }
  }

  function maybeApplyPresetForSelectedAnimation() {
    const key = getSelectedAnimationKey();
    if (!key) return;
    const map = loadAnimPresetMapCached();
    let entry = map?.[key];

    // Backward compatibility for older saved keys.
    if (!entry?.preset) {
      try {
        const a = getSelectedAnimationSafe();
        const name = String(a?.name || "").trim();
        const uuid = String(a?.uuid || a?._uuid || "").trim();
        const id = String(a?.id || "").trim();

        const candidates = [
          name,
          name ? `name:${name}` : "",
          uuid,
          uuid ? `uuid:${uuid}` : "",
          uuid ? `id:${uuid}` : "",
          id,
          id ? `id:${id}` : "",
        ]
          .map((v) => String(v || "").trim())
          .filter(Boolean);
        for (const k of candidates) {
          const e = map?.[k];
          if (e?.preset) {
            entry = e;
            break;
          }
        }
      } catch (e) {}
    }

    if (!entry?.preset) return;
    // Apply instantly without persisting settings to storage (fast + avoids stutter).
    applyPreset(entry.preset, { persist: false, updateDialog: true });
  }

  // ============================================================
  // UI
  // ============================================================

  let dialog = null;
  let action = null;
  let timelineToggleAction = null;
  let timelinePanelAction = null;
  let aboutAction = null;

  function deleteBarItemIfExists(id) {
    try {
      if (!id) return;
      if (typeof BarItems !== "undefined" && BarItems && BarItems[id]) {
        BarItems[id]?.delete?.();
      }
    } catch (e) {}
  }

  function tryAddActionToToolbar(toolbar, actionToAdd) {
    try {
      if (!toolbar || typeof toolbar.add !== "function" || !actionToAdd) return false;
      // Avoid duplicates if Blockbench already placed it.
      try {
        const id = String(actionToAdd?.id || "");
        const candidates = [
          toolbar?.children,
          toolbar?.items,
          toolbar?.actions,
          toolbar?.buttons,
          toolbar?.content,
        ].filter(Array.isArray);
        for (const arr of candidates) {
          if (arr.some((it) => it === actionToAdd || String(it?.id || it) === id)) {
            return true;
          }
        }
      } catch (e) {}
      // Some toolbars accept (item, index)
      try {
        toolbar.add(actionToAdd);
        return true;
      } catch (e) {
        try {
          toolbar.add(actionToAdd, 0);
          return true;
        } catch (e2) {}
      }
    } catch (e) {}
    return false;
  }

  function tryAttachTimelineToolbarActionsOnce() {
    try {
      if (!timelineToggleAction || !timelinePanelAction) return false;
      if (typeof Toolbars === "undefined" || !Toolbars) return false;

      // Prefer the canonical toolbar if present.
      const candidates = [];
      try {
        if (Toolbars.timeline) candidates.push(Toolbars.timeline);
      } catch (e) {}

      // Best-effort discovery across versions.
      try {
        for (const [key, bar] of Object.entries(Toolbars)) {
          const k = String(key || "").toLowerCase();
          if (!k.includes("timeline")) continue;
          if (bar && !candidates.includes(bar)) candidates.push(bar);
        }
      } catch (e) {}

      let any = false;
      for (const bar of candidates) {
        any = tryAddActionToToolbar(bar, timelineToggleAction) || any;
        any = tryAddActionToToolbar(bar, timelinePanelAction) || any;

        // Some builds expose addAction instead of add
        if (!any) {
          try {
            if (typeof bar?.addAction === "function") {
              bar.addAction(timelineToggleAction);
              bar.addAction(timelinePanelAction);
              any = true;
            }
          } catch (e) {}
        }
      }
      return any;
    } catch (e) {}
    return false;
  }

  function waitForTimelineToolbarAndAttach() {
    // Toolbars often initialize after plugins; wait a bit and attach once.
    try {
      let tries = 0;
      const maxTries = 60; // ~15s at 250ms
      const intervalMs = 250;
      const timer = setInterval(() => {
        tries++;
        let done = false;
        try {
          done = !!tryAttachTimelineToolbarActionsOnce();
        } catch (e) {}
        if (done || tries >= maxTries) {
          try {
            clearInterval(timer);
          } catch (e) {}
        }
      }, intervalMs);
    } catch (e) {}
  }

  function attachTimelineToolbarActions() {
    try {
      if (!timelineToggleAction || !timelinePanelAction) return;
      if (typeof Toolbars === "undefined" || !Toolbars) return;

      // Best-effort: find a toolbar that looks like the timeline toolbar.
      const candidates = [];
      try {
        for (const [key, bar] of Object.entries(Toolbars)) {
          if (!key) continue;
          const k = String(key).toLowerCase();
          if (!k.includes("timeline")) continue;
          candidates.push(bar);
        }
      } catch (e) {}

      // Also try common names if present.
      try {
        if (Toolbars.timeline) candidates.unshift(Toolbars.timeline);
      } catch (e) {}

      let any = false;
      for (const bar of candidates) {
        any = tryAddActionToToolbar(bar, timelineToggleAction) || any;
        any = tryAddActionToToolbar(bar, timelinePanelAction) || any;
      }

      // If no timeline toolbar is discoverable, we still keep the actions registered
      // so they appear in Blockbench's action lists.
      return any;
    } catch (e) {}
    return false;
  }

  // ============================================================
  // Persistent Timeline toolbar actions
  // ============================================================

  // IMPORTANT:
  // These actions are created at script-evaluation time (outside `onload`).
  // Blockbench restores custom toolbar layouts early during startup.
  // If actions are only created in `onload`, they may not exist yet when the
  // timeline toolbar layout is restored, causing the items to be dropped.
  //
  // By registering them immediately with stable IDs, Blockbench can resolve
  // them and they persist across restarts.

  function ensureTimelineActionsRegistered() {
    try {
      // Avoid duplicates on hot-reload or duplicate script injections.
      deleteBarItemIfExists("animated_platforms_toggle");
      deleteBarItemIfExists("animated_platforms_panel_timeline");

      timelineToggleAction = new Action("animated_platforms_toggle", {
        name: "Toggle ground plane",
        description: "Toggle Animated Platforms on/off",
        icon: "check_box",
        click() {
          Settings.enabled = !Settings.enabled;
          Settings.save();
          scheduleRigRefresh();
          try {
            refreshDialogFromSettings();
          } catch (e) {}
          Blockbench.showQuickMessage(
            Settings.enabled
              ? "Animated Platforms enabled"
              : "Animated Platforms disabled"
          );
        },
      });

      timelinePanelAction = new Action("animated_platforms_panel_timeline", {
        name: "Animated Platforms",
        description: "Open Animated Platforms controls",
        icon: "grid_on",
        click: showPanel,
      });
    } catch (e) {
      console.error("[AnimatedPlatforms] Failed to register timeline actions", e);
    }
  }

  function showAbout(banner = true) {
    const name = "Animated Platforms";
    const icon = "grid_on";
    const links = {
      discord: "https://discord.gg/KDd2rcAPqA",
      twitter: "https://x.com/cazfps1",
      website: "https://www.cazfps.com/links",
    };
    const websiteLogoUrl = getAnimatedPlatformsAssetUrl("cazfps.png");

    ensureAboutStyle();

    new Dialog({
      id: "mgp_about",
      title: name,
      width: 780,
      buttons: [],
      lines: [],
      component: {
        data() {
          return {
            banner: !!banner,
            name,
            links,
            websiteLogoUrl,
          };
        },
        template: `
          <div>
            <div v-if="banner" id="mgp_banner">
              This window can be reopened at any time from <strong>Help &gt; About Plugins &gt; {{name}}</strong>
            </div>

            <div id="mgp_content">
              <h1 style="margin-top:-10px">{{name}}</h1>
              <p>An animated ground plane for easier walk cycles and vehicle motion previews.</p>

              <h4>How to use</h4>
              <p>
                Open the panel from <b>View &gt; Animated Platforms</b> (or add the buttons to the Timeline toolbar).
                Enable it, then play/pause the animation to preview foot contact and motion against the scrolling ground.
              </p>

              <h4>Tips</h4>
              <p>- Hold <b>Shift</b> while adjusting values for finer steps.</p>
              <p>- Use <b>Texture Library</b> to quickly reuse previous custom textures.</p>
              <p>- Use <b>Save</b> to store a preset for the selected animation.</p>

              <div class="mgp-socials">
                <a :href="links.twitter" class="open-in-browser">
                  <i class="fa-brands fa-twitter" style="color:#00acee"></i>
                  <label>X / Twitter</label>
                </a>
                <a :href="links.website" class="open-in-browser">
                  <img class="mgp-site-icon" :src="websiteLogoUrl" alt="Website" />
                  <label>Website</label>
                </a>
                <a :href="links.discord" class="open-in-browser">
                  <i class="fa-brands fa-discord" style="color:#5865F2"></i>
                  <label>Discord</label>
                </a>
              </div>
            </div>
          </div>
        `,
      },
    }).show();

    try {
      $("dialog#mgp_about .dialog_title").html(`
        <i class="icon material-icons">${icon}</i>
        ${name}
      `);
    } catch (e) {}
  }

  function addAboutButton() {
    try {
      let about = MenuBar.menus.help.structure.find((e) => e.id === "about_plugins");
      if (!about) {
        about = new Action("about_plugins", {
          name: "About Plugins...",
          icon: "info",
          children: [],
        });
        MenuBar.addAction(about, "help");
      }
      aboutAction = new Action(`about_${PLUGIN_ID}`, {
        name: "About Animated Platforms...",
        icon: "info",
        click: () => showAbout(true),
      });
      about.children.push(aboutAction);
    } catch (e) {}
  }
  let toggle_action = null;

  // Watchers
  let presetWatcher = null;
  let lastAnimKey = null;
  let dialogLabelWatcher = null;

  // Track last dialog values so we can tell whether the slider or number field changed.
  // (Removed) slider+number pairing; we now use Blockbench's numeric-input widget.

  // Pointer-lock for numeric scrubbing (prevents cursor hitting screen edges)
  let numericScrubPointerLockCleanup = null;

  function installNumericScrubPointerLock() {
    try {
      // Idempotent
      if (typeof numericScrubPointerLockCleanup === "function") return;

      const getDialogRoot = () => {
        // Blockbench dialog roots vary by version; try a few selectors.
        return (
          document.getElementById("animated_platforms_panel") ||
          document.querySelector(".dialog#animated_platforms_panel") ||
          document.querySelector('.dialog[dialog_id="animated_platforms_panel"]') ||
          document.querySelector('.dialog[dialog-id="animated_platforms_panel"]') ||
          null
        );
      };

      const getPointerLockTarget = () => {
        try {
          const dom = Canvas?.renderer?.domElement;
          if (dom && typeof dom.requestPointerLock === "function") return dom;
        } catch (e) {}
        try {
          const c = document.querySelector("canvas.preview") || document.querySelector(".preview canvas");
          if (c && typeof c.requestPointerLock === "function") return c;
        } catch (e) {}
        try {
          if (document.body && typeof document.body.requestPointerLock === "function") return document.body;
        } catch (e) {}
        return null;
      };

      const parseNum = (v, fallback = 0) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
      };
      const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
      const getStep = (input) => {
        const s = parseNum(input?.step, 0);
        return s > 0 ? s : 1;
      };
      const dispatch = (el, type) => {
        try {
          el?.dispatchEvent?.(new Event(type, { bubbles: true }));
        } catch (e) {}
      };

      let active = null;

      const startScrub = (input, e) => {
        try {
          if (!input) return false;

          // Request pointer lock in the *down* event (required on some builds).
          try {
            // Prefer the interacted element (most consistent with Electron gesture gating)
            const t = e?.target;
            if (t && typeof t.requestPointerLock === "function") {
              t.requestPointerLock();
            } else if (input && typeof input.requestPointerLock === "function") {
              input.requestPointerLock();
            } else {
              const root = getDialogRoot();
              if (root && typeof root.requestPointerLock === "function") root.requestPointerLock();
              else {
                const lockTarget = getPointerLockTarget();
                lockTarget?.requestPointerLock?.();
              }
            }
          } catch (e) {}

          const step = getStep(input);
          const min = input?.min !== undefined ? parseNum(input.min, -Infinity) : -Infinity;
          const max = input?.max !== undefined ? parseNum(input.max, Infinity) : Infinity;
          const base = parseNum(input.value, 0);

          active = {
            input,
            base,
            value: base,
            step,
            min,
            max,
          };

          // Prevent the native drag from fighting our movement-based scrub.
          try {
            e?.preventDefault?.();
            e?.stopPropagation?.();
          } catch (e) {}

          return true;
        } catch (e) {}
        return false;
      };

      const stopScrub = () => {
        try {
          if (active?.input) {
            dispatch(active.input, "change");
          }
        } catch (e) {}
        active = null;
        try {
          if (document.pointerLockElement) document.exitPointerLock?.();
        } catch (e) {}
      };

      const pickScrubbableInput = (target, root) => {
        try {
          // Range sliders: scrub the range itself.
          const range = target.closest('input[type="range"]');
          if (range && root.contains(range)) return range;

          // Number inputs: only scrub when the user is NOT clicking into the input text.
          const numDirect = target.closest('input[type="number"]');
          if (numDirect && root.contains(numDirect)) {
            // If the click is on the arrow/stepper area (usually the right edge), allow scrub.
            try {
              const r = numDirect.getBoundingClientRect();
              const x = Number(target.ownerDocument?.defaultView?.event?.clientX ?? NaN);
              // We can't reliably access the event here; fallback to always allow on modifiers.
            } catch (e) {}
            return null;
          }

          const row = target.closest(
            ".form_bar,.form_line,.form_row,.form-row,.form_group,.form-group"
          );
          if (!row || !root.contains(row)) return null;
          const num = row.querySelector('input[type="number"]');
          if (num) return num;
        } catch (e) {}
        return null;
      };

      const onDownCapture = (e) => {
        try {
          if (!e) return;
          if (typeof e.button === "number" && e.button !== 0) return;
          const root = getDialogRoot();
          if (!root) return;
          const target = e.target;
          if (!(target instanceof HTMLElement)) return;
          if (!root.contains(target)) return;

          // Never scrub text inputs directly.
          if (target.matches('textarea,select,[contenteditable="true"]')) return;

          // Special-case: number input arrow area drag
          let input = pickScrubbableInput(target, root);
          if (!input) {
            const num = target.closest('input[type="number"]');
            if (num && root.contains(num)) {
              // If user is dragging (or intends to drag) the stepper area at the right edge,
              // start scrubbing instead of focusing for typing.
              const rect = num.getBoundingClientRect?.();
              const x = Number(e.clientX ?? 0);
              const y = Number(e.clientY ?? 0);
              const inRect = rect && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
              const inStepper = inRect && rect && x >= rect.right - 24;
              if (inStepper) input = num;
            }
          }
          if (!input) return;

          startScrub(input, e);
        } catch (e) {}
      };

      const onMoveCapture = (e) => {
        try {
          if (!active?.input) return;
          if (!e) return;

          const buttons = typeof e.buttons === "number" ? e.buttons : 1;
          if ((buttons & 1) === 0) return;

          // movementX works best with pointer lock; fall back to clientX diff.
          const dx = Number.isFinite(e.movementX) ? e.movementX : 0;

          const step = active.step;
          // Shift = finer changes (smaller delta)
          const multShift = e.shiftKey ? 0.2 : 1;
          const multCtrl = e.ctrlKey || e.metaKey ? 0.2 : 1;
          const scale = 0.2; // ~5px per step

          const delta = dx * step * scale * multShift * multCtrl;
          if (!delta) return;

          let next = active.value + delta;
          next = clamp(next, active.min, active.max);

          // Keep reasonable precision for fractional steps.
          const stepStr = String(active.input.step || "");
          const decimals = (stepStr.split(".")[1] || "").length;
          if (decimals > 0) {
            const p = Math.pow(10, Math.min(8, decimals));
            next = Math.round(next * p) / p;
          } else {
            next = Math.round(next);
          }

          active.value = next;
          active.input.value = String(next);
          dispatch(active.input, "input");
        } catch (e) {}
      };

      const onUp = () => stopScrub();
      const onKeyDown = (e) => {
        // Escape reliably exits pointer lock.
        try {
          if (e?.key === "Escape") stopScrub();
        } catch (e) {}
      };
      const onPointerLockChange = () => {
        try {
          // If pointer lock was denied/exited externally, keep scrubbing (without lock)
          // until mouseup, but don't force-stop mid-drag.
        } catch (e) {}
      };

      document.addEventListener("mousedown", onDownCapture, true);
      document.addEventListener("pointerdown", onDownCapture, true);
      document.addEventListener("mousemove", onMoveCapture, true);
      document.addEventListener("pointermove", onMoveCapture, true);
      document.addEventListener("mouseup", onUp, true);
      document.addEventListener("pointerup", onUp, true);
      document.addEventListener("keydown", onKeyDown, true);
      document.addEventListener("pointerlockchange", onPointerLockChange, false);

      numericScrubPointerLockCleanup = () => {
        try {
          document.removeEventListener("mousedown", onDownCapture, true);
          document.removeEventListener("pointerdown", onDownCapture, true);
          document.removeEventListener("mousemove", onMoveCapture, true);
          document.removeEventListener("pointermove", onMoveCapture, true);
          document.removeEventListener("mouseup", onUp, true);
          document.removeEventListener("pointerup", onUp, true);
          document.removeEventListener("keydown", onKeyDown, true);
          document.removeEventListener(
            "pointerlockchange",
            onPointerLockChange,
            false
          );
        } catch (e) {}
        stopScrub();
        numericScrubPointerLockCleanup = null;
      };
    } catch (e) {
      numericScrubPointerLockCleanup = null;
    }
  }

  // Debounce refresh to avoid hammering the renderer while dragging sliders.
  let refreshDebounceTimer = null;
  function scheduleRigRefresh() {
    try {
      if (refreshDebounceTimer) clearTimeout(refreshDebounceTimer);
    } catch (e) {}
    refreshDebounceTimer = null;
    try {
      refreshDebounceTimer = setTimeout(() => {
        try {
          rig.refresh();
        } catch (e) {}
      }, 16);
    } catch (e) {}
  }

  // Debounced auto-save of the current settings as the selected animation's preset.
  let autoSaveDebounceTimer = null;
  function scheduleAutoSaveToSelectedAnimation() {
    // Capture the current target key at schedule time.
    // Otherwise, if the user switches animations/models during the debounce window,
    // the save would apply to the *new* selection and overwrite other presets.
    let targetKey = null;
    let targetName = "";
    try {
      if (!Settings?.autoSaveToAnimation) return;
      targetKey = getSelectedAnimationKey();
      if (!targetKey) return;
      targetName = getSelectedAnimationName();
    } catch (e) {
      return;
    }

    try {
      if (autoSaveDebounceTimer) clearTimeout(autoSaveDebounceTimer);
    } catch (e) {}
    autoSaveDebounceTimer = null;

    try {
      autoSaveDebounceTimer = setTimeout(() => {
        try {
          if (!Settings?.autoSaveToAnimation) return;
          savePresetForAnimationKey(targetKey, targetName, { silent: true });
        } catch (e) {}
      }, 150);
    } catch (e) {}
  }

  function wrapDialogHideToRestoreOverlay(dlg) {
    try {
      if (!dlg) return;
      if (dlg.__mgpHideWrapped) return;
      const originalHide = dlg.hide?.bind(dlg);
      if (typeof originalHide !== "function") return;

      dlg.hide = (...args) => {
        try {
          setNoOverlayEnabled(false);
        } catch (e) {}
        try {
          setNoBlurEnabled(false);
        } catch (e) {}
        try {
          numericScrubPointerLockCleanup?.();
        } catch (e) {}
        numericScrubPointerLockCleanup = null;
        return originalHide(...args);
      };
      dlg.__mgpHideWrapped = true;
    } catch (e) {}
  }

  // Cleanup: revert global side-effects + timers + UI handles.
  // Safe to call multiple times; used both for defensive double-load and on actual unload.
  function forceCleanup() {
    try {
      if (presetWatcher) clearInterval(presetWatcher);
    } catch (e) {}
    presetWatcher = null;
    lastAnimKey = null;

    try {
      if (dialogLabelWatcher) clearInterval(dialogLabelWatcher);
    } catch (e) {}
    dialogLabelWatcher = null;

    try {
      setNoOverlayEnabled(false);
    } catch (e) {}
    try {
      setNoBlurEnabled(false);
    } catch (e) {}
    try {
      document.getElementById(NO_OVERLAY_STYLE_ID)?.remove?.();
    } catch (e) {}
    try {
      document.getElementById(NO_BLUR_STYLE_ID)?.remove?.();
    } catch (e) {}

    try {
      document.getElementById(PANEL_STYLE_ID)?.remove?.();
    } catch (e) {}
    try {
      document.getElementById(ABOUT_STYLE_ID)?.remove?.();
    } catch (e) {}

    try {
      dialog?.hide?.();
    } catch (e) {}
    dialog = null;

    try {
      textureLibraryDialog?.hide?.();
    } catch (e) {}
    textureLibraryDialog = null;

    try {
      numericScrubPointerLockCleanup?.();
    } catch (e) {}
    numericScrubPointerLockCleanup = null;

    try {
      rig.dispose();
    } catch (e) {}

    try {
      if (refreshDebounceTimer) clearTimeout(refreshDebounceTimer);
    } catch (e) {}
    refreshDebounceTimer = null;

    try {
      if (autoSaveDebounceTimer) clearTimeout(autoSaveDebounceTimer);
    } catch (e) {}
    autoSaveDebounceTimer = null;

    try {
      if (action && typeof Preview !== "undefined" && Preview.prototype.menu) {
        Preview.prototype.menu.removeAction(action);
      }
    } catch (e) {}
    try {
      if (action && typeof Blockbench !== "undefined" && Blockbench.menus?.preview) {
        Blockbench.menus.preview.removeAction(action);
      }
    } catch (e) {}

    try {
      action?.delete?.();
    } catch (e) {}
    action = null;

    try {
      timelineToggleAction?.delete?.();
    } catch (e) {}
    timelineToggleAction = null;

    try {
      timelinePanelAction?.delete?.();
    } catch (e) {}
    timelinePanelAction = null;

    try {
      MenuBar.removeAction(`help.about_plugins.about_${PLUGIN_ID}`);
    } catch (e) {}
    try {
      aboutAction?.delete?.();
    } catch (e) {}
    aboutAction = null;

  }

  try {
    if (globalThis?.[INSTANCE_KEY]) {
      globalThis[INSTANCE_KEY].cleanup = forceCleanup;
    }
  } catch (e) {}

  function trySetDialogFormValues(dlg, values) {
    try {
      if (!dlg) return;
      if (typeof dlg.setFormValues === "function") {
        dlg.setFormValues(values);
      } else if (typeof dlg.setFormValue === "function") {
        for (const [k, v] of Object.entries(values || {})) {
          dlg.setFormValue(k, v);
        }
      }
    } catch (e) {}
  }

  function pickCustomTextureDataUrl(onDone) {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        const file = input.files && input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            onDone?.(String(reader.result || ""));
          } catch (e) {}
        };
        reader.readAsDataURL(file);
      };
      input.click();
    } catch (e) {}
  }

  function refreshDialogFromSettings() {
    try {
      const vm = dialog?.content_vue;
      if (!vm) return;
      if (typeof vm.syncFromSettings === "function") vm.syncFromSettings();
    } catch (e) {}
  }

  function rememberCustomTexture(dataUrl) {
    const url = String(dataUrl || "").trim();
    if (!url) return;
    try {
      if (!Array.isArray(Settings.savedTextures)) Settings.savedTextures = [];
      // Move to front if it already exists
      const idx = Settings.savedTextures.indexOf(url);
      if (idx !== -1) Settings.savedTextures.splice(idx, 1);
      Settings.savedTextures.unshift(url);
      Settings.savedTextures = Settings.savedTextures.slice(0, 64);
      const ok = Settings.save();
      if (!ok) {
        try {
          Blockbench.showQuickMessage(
            "Couldn't save texture library (storage full). Try smaller textures or delete some.",
            4000
          );
        } catch (e) {}
      }
    } catch (e) {}
  }

  let textureLibraryDialog = null;
  function showTextureLibraryDialog() {
    try {
      if (textureLibraryDialog) {
        textureLibraryDialog.show();
        try {
          textureLibraryDialog.content_vue?.refresh?.();
        } catch (e) {}
        return;
      }
    } catch (e) {
      textureLibraryDialog = null;
    }

    textureLibraryDialog = new Dialog({
      id: "animated_platforms_textures",
      title: "🖼️ Animated Platforms textures",
      width: 520,
      buttons: [],
      component: {
        data() {
          return {
            textures: Array.isArray(Settings.savedTextures)
              ? Settings.savedTextures.slice()
              : [],
          };
        },
        methods: {
          refresh() {
            this.textures = Array.isArray(Settings.savedTextures)
              ? Settings.savedTextures.slice()
              : [];
          },
          useTexture(url) {
            const u = String(url || "");
            if (!u) return;
            Settings.customTextureDataUrl = u;
            Settings.useCustomTexture = true;
            rememberCustomTexture(u);
            Settings.save();
            scheduleRigRefresh();
            scheduleAutoSaveToSelectedAnimation();
            try {
              refreshDialogFromSettings();
            } catch (e) {}
          },
          deleteTexture(url) {
            const u = String(url || "");
            if (!u) return;
            try {
              const arr = Array.isArray(Settings.savedTextures)
                ? Settings.savedTextures
                : [];
              const i = arr.indexOf(u);
              if (i !== -1) arr.splice(i, 1);

              if (Settings.customTextureDataUrl === u) {
                Settings.customTextureDataUrl = "";
                Settings.useCustomTexture = false;
              }
              Settings.save();
              scheduleRigRefresh();
              scheduleAutoSaveToSelectedAnimation();
            } catch (e) {}
            this.refresh();
          },
          clearAll() {
            try {
              Settings.savedTextures = [];
              if (Settings.useCustomTexture) {
                Settings.useCustomTexture = false;
                Settings.customTextureDataUrl = "";
              }
              Settings.save();
              scheduleRigRefresh();
              scheduleAutoSaveToSelectedAnimation();
            } catch (e) {}
            this.refresh();
          },
          close() {
            try {
              textureLibraryDialog.hide();
            } catch (e) {}
          },
        },
        mounted() {
          this.refresh();
        },
        template: `
          <div id="mgp-texture-library">
            <div class="mgp-texture-library-header">
              <div class="mgp-subtle">Previously used custom textures</div>
              <div class="spacer"></div>
              <button class="tool" @click="clearAll" :disabled="!textures.length">Clear All</button>
            </div>

            <div v-if="!textures.length" class="mgp-empty">
              No textures saved yet. Use “Choose Texture” in the main panel.
            </div>

            <div v-else class="mgp-texture-grid">
              <div v-for="(t, idx) in textures" :key="idx" class="mgp-texture-card">
                <div class="mgp-thumb">
                  <img :src="t" />
                </div>
                <div class="mgp-texture-actions">
                  <button class="tool" @click="useTexture(t)">Use</button>
                  <button class="tool" @click="deleteTexture(t)">Delete</button>
                </div>
              </div>
            </div>

            <div class="mgp-footer">
              <div class="spacer"></div>
              <button class="tool" @click="close">Close</button>
            </div>
          </div>
        `,
      },
    });

    textureLibraryDialog.show();
  }

  function showPanel() {
    // Avoid deprecated HTML strings in Dialog.lines
    ensurePanelStyle();
    rig.refresh();

    const startDialogLabelWatcher = () => {
      try {
        if (dialogLabelWatcher) clearInterval(dialogLabelWatcher);
      } catch (e) {}
      dialogLabelWatcher = null;

      // Only needed while the dialog exists; keep it light.
      try {
        dialogLabelWatcher = setInterval(() => {
          try {
            if (!dialog) return;
            const vm = dialog?.content_vue;
            if (vm && typeof vm === "object") {
              vm.presetSavedFor = getPresetSavedForLabel();
            }
          } catch (e) {}
        }, 250);
      } catch (e) {}
    };

    const stopDialogLabelWatcher = () => {
      try {
        if (dialogLabelWatcher) clearInterval(dialogLabelWatcher);
      } catch (e) {}
      dialogLabelWatcher = null;
    };

    if (dialog) {
      try {
        wrapDialogHideToRestoreOverlay(dialog);
        // Make this dialog a hovering menu (no blackout overlay).
        setNoOverlayEnabled(true);
        setNoBlurEnabled(true);
        dialog.show();
        refreshDialogFromSettings();
        startDialogLabelWatcher();
        return;
      } catch (e) {}
    }

    dialog = new Dialog({
      id: "animated_platforms_panel",
      title: "🛝 Animated Platforms",
      width: 460,
      buttons: [],
      lines: [],
      component: {
        data() {
          return {
            _suppress: false,
            shiftDown: false,

            presetSavedFor: getPresetSavedForLabel(),

            // Quick presets
            sizePreset: "",
            speedPreset: "",

            form: {
              enabled: !!Settings.enabled,
              autoSaveToAnimation: !!Settings.autoSaveToAnimation,

              opacity: Number(Settings.opacity ?? 1.0),

              edgeFadeEnabled: Settings.edgeFadeEnabled !== false,
              edgeFadeWidthUv: Number(Settings.edgeFadeWidthUv ?? 0.08),

              speedBlocksPerSec: Number(Settings.speedBlocksPerSec || 0),

              widthBlocks: Number(Settings.widthBlocks || 256),
              lengthBlocks: Number(Settings.lengthBlocks || 256),
              yBlocks: Number(Settings.yBlocks || 0),
              xBlocks: Number(Settings.xBlocks || 0),
              zBlocks: Number(Settings.zBlocks || 0),
              yaw: Number(Settings.yaw || 0),
              tilt: Number(Settings.tilt || 0),

              gridSquareBlocks: (Number(Settings.gridBlocksPerTile || 16) || 16) / 16,
              textureResolutionPx: Number(Settings.textureResolutionPx || 512),
              lineThicknessMult: Number(Settings.lineThicknessMult || 1.0),

              gridMinorOpacity: Number(Settings.gridMinorOpacity ?? 1.0),
              gridMajorOpacity: Number(Settings.gridMajorOpacity ?? 1.0),
              backgroundOpacity: Number(Settings.backgroundOpacity ?? 1.0),
              backgroundColor: String(Settings.backgroundColor || "#2b2b2b"),
              gridColor: String(Settings.gridColor || "#ffffff"),

              useCustomTexture: !!Settings.useCustomTexture,
              customTextureRotation90: Number(Settings.customTextureRotation90 ?? 0),
              customTextureFlipX: !!Settings.customTextureFlipX,
              customTextureFlipY: !!Settings.customTextureFlipY,
            },
          };
        },
        methods: {
          syncFromSettings() {
            try {
              this._suppress = true;
              this.presetSavedFor = getPresetSavedForLabel();

              this.form.enabled = !!Settings.enabled;
              this.form.autoSaveToAnimation = !!Settings.autoSaveToAnimation;
              this.form.opacity = Number(Settings.opacity ?? 1.0);

              this.form.edgeFadeEnabled = Settings.edgeFadeEnabled !== false;
              this.form.edgeFadeWidthUv = Number(Settings.edgeFadeWidthUv ?? 0.08);

              this.form.speedBlocksPerSec = Number(Settings.speedBlocksPerSec || 0);

              this.form.widthBlocks = Number(Settings.widthBlocks || 256);
              this.form.lengthBlocks = Number(Settings.lengthBlocks || 256);
              this.form.yBlocks = Number(Settings.yBlocks || 0);
              this.form.xBlocks = Number(Settings.xBlocks || 0);
              this.form.zBlocks = Number(Settings.zBlocks || 0);
              this.form.yaw = Number(Settings.yaw || 0);
              this.form.tilt = Number(Settings.tilt || 0);

              this.form.gridSquareBlocks =
                (Number(Settings.gridBlocksPerTile || 16) || 16) / 16;
              this.form.textureResolutionPx = Number(Settings.textureResolutionPx || 512);
              this.form.lineThicknessMult = Number(Settings.lineThicknessMult || 1.0);

              this.form.gridMinorOpacity = Number(Settings.gridMinorOpacity ?? 1.0);
              this.form.gridMajorOpacity = Number(Settings.gridMajorOpacity ?? 1.0);
              this.form.backgroundOpacity = Number(Settings.backgroundOpacity ?? 1.0);
              this.form.backgroundColor = String(Settings.backgroundColor || "#2b2b2b");
              this.form.gridColor = String(Settings.gridColor || "#ffffff");

              this.form.useCustomTexture = !!Settings.useCustomTexture;
              this.form.customTextureRotation90 = Number(Settings.customTextureRotation90 ?? 0);
              this.form.customTextureFlipX = !!Settings.customTextureFlipX;
              this.form.customTextureFlipY = !!Settings.customTextureFlipY;
            } catch (e) {}
            try {
              this._suppress = false;
            } catch (e) {}
          },
          apply() {
            if (this._suppress) return;

            Settings.enabled = !!this.form.enabled;
            Settings.autoSaveToAnimation = !!this.form.autoSaveToAnimation;

            Settings.opacity = Math.max(0, Math.min(1, Number(this.form.opacity ?? 1.0)));

            Settings.edgeFadeEnabled = this.form.edgeFadeEnabled !== false;
            Settings.edgeFadeWidthUv = Math.max(
              0.001,
              Math.min(0.5, Number(this.form.edgeFadeWidthUv ?? 0.08))
            );

            Settings.speedBlocksPerSec = Number(this.form.speedBlocksPerSec || 0);

            Settings.widthBlocks = Math.max(3, Number(this.form.widthBlocks || 256));
            Settings.lengthBlocks = Math.max(3, Number(this.form.lengthBlocks || 256));
            Settings.yBlocks = Number(this.form.yBlocks || 0);
            Settings.xBlocks = Number(this.form.xBlocks || 0);
            Settings.zBlocks = Number(this.form.zBlocks || 0);
            Settings.yaw = Number(this.form.yaw || 0);
            Settings.tilt = Number(this.form.tilt || 0);

            const sq = Number(this.form.gridSquareBlocks);
            if (Number.isFinite(sq)) {
              Settings.gridBlocksPerTile = Math.max(0.25, Math.min(1024, sq * 16));
            }
            Settings.textureResolutionPx = Math.max(
              64,
              Math.min(2048, Math.floor(Number(this.form.textureResolutionPx || 512)))
            );
            Settings.lineThicknessMult = Math.max(
              0.25,
              Math.min(6, Number(this.form.lineThicknessMult || 1.0))
            );

            Settings.gridMinorOpacity = Math.max(0, Math.min(1, Number(this.form.gridMinorOpacity ?? 1.0)));
            Settings.gridMajorOpacity = Math.max(0, Math.min(1, Number(this.form.gridMajorOpacity ?? 1.0)));
            Settings.backgroundOpacity = Math.max(0, Math.min(1, Number(this.form.backgroundOpacity ?? 1.0)));

            Settings.backgroundColor = normalizeColorToHex(this.form.backgroundColor, "#2b2b2b");
            Settings.gridColor = normalizeColorToHex(this.form.gridColor, "#ffffff");

            Settings.useCustomTexture = !!this.form.useCustomTexture;
            Settings.customTextureRotation90 = Math.max(
              0,
              Math.min(3, Math.floor(Number(this.form.customTextureRotation90 ?? 0)))
            );
            Settings.customTextureFlipX = !!this.form.customTextureFlipX;
            Settings.customTextureFlipY = !!this.form.customTextureFlipY;

            Settings.save();
            scheduleRigRefresh();
            scheduleAutoSaveToSelectedAnimation();
          },
          chooseTexture() {
            pickCustomTextureDataUrl((dataUrl) => {
              (async () => {
                const url0 = String(dataUrl || "");
                if (!url0) return;
                // Normalize to avoid localStorage quota issues (keeps pixel-art crisp)
                const url = await normalizeTextureDataUrlForStorage(url0, 512);
                if (!url) return;
                Settings.customTextureDataUrl = url;
                Settings.useCustomTexture = true;
                rememberCustomTexture(url);
                const ok = Settings.save();
                if (!ok) {
                  try {
                    Blockbench.showQuickMessage(
                      "Couldn't save texture settings (storage full).",
                      4000
                    );
                  } catch (e) {}
                }
                scheduleRigRefresh();
                scheduleAutoSaveToSelectedAnimation();
                this.syncFromSettings();
                Blockbench.showQuickMessage("Custom texture set");
              })();
            });
          },
          openTextureLibrary() {
            showTextureLibraryDialog();
          },
          clearTexture() {
            Settings.customTextureDataUrl = "";
            Settings.useCustomTexture = false;
            Settings.save();
            scheduleRigRefresh();
            scheduleAutoSaveToSelectedAnimation();
            this.syncFromSettings();
            Blockbench.showQuickMessage("Custom texture cleared");
          },
          savePreset() {
            savePresetForSelectedAnimationImpl({ silent: false });
            this.presetSavedFor = getPresetSavedForLabel();
          },
          resetAll() {
            Object.assign(Settings, {
              enabled: Settings.enabled,
              autoSaveToAnimation: Settings.autoSaveToAnimation,
              edgeFadeEnabled: true,
              edgeFadeWidthUv: 0.08,
              speedBlocksPerSec: 2.0,
              widthBlocks: 256,
              lengthBlocks: 256,
              yBlocks: 0,
              xBlocks: 0,
              zBlocks: 0,
              yaw: 0,
              tilt: 0,
              opacity: 1.0,
              gridBlocksPerTile: 16,
              textureResolutionPx: 512,
              gridColor: "#ffffff",
              backgroundColor: "#2b2b2b",
              gridMinorOpacity: 1.0,
              gridMajorOpacity: 1.0,
              backgroundOpacity: 1.0,
              lineThicknessMult: 1.0,
              useCustomTexture: false,
              customTextureDataUrl: "",
              customTextureRotation90: 0,
              customTextureFlipX: false,
              customTextureFlipY: false,
            });
            Settings.save();
            scheduleRigRefresh();
            scheduleAutoSaveToSelectedAnimation();
            this.syncFromSettings();
          },
          resetGrid() {
            Object.assign(Settings, {
              gridBlocksPerTile: 16,
              textureResolutionPx: 512,
              gridColor: "#ffffff",
              backgroundColor: "#2b2b2b",
              gridMinorOpacity: 1.0,
              gridMajorOpacity: 1.0,
              backgroundOpacity: 1.0,
              lineThicknessMult: 1.0,
            });
            Settings.save();
            scheduleRigRefresh();
            scheduleAutoSaveToSelectedAnimation();
            this.syncFromSettings();
          },
          resetMotion() {
            Object.assign(Settings, {
              speedBlocksPerSec: 2.0,
              yaw: 0,
              tilt: 0,
            });
            Settings.save();
            scheduleRigRefresh();
            scheduleAutoSaveToSelectedAnimation();
            this.syncFromSettings();
          },
          resetTexture() {
            Object.assign(Settings, {
              useCustomTexture: false,
              customTextureDataUrl: "",
              customTextureRotation90: 0,
              customTextureFlipX: false,
              customTextureFlipY: false,
            });
            Settings.save();
            scheduleRigRefresh();
            scheduleAutoSaveToSelectedAnimation();
            this.syncFromSettings();
          },
          applySizePreset() {
            const v = String(this.sizePreset || "");
            if (!v) return;
            if (v === "small") {
              this.form.widthBlocks = 16;
              this.form.lengthBlocks = 16;
            } else if (v === "medium") {
              this.form.widthBlocks = 64;
              this.form.lengthBlocks = 64;
            } else if (v === "large") {
              this.form.widthBlocks = 256;
              this.form.lengthBlocks = 256;
            }
            this.sizePreset = "";
          },
          applySpeedPreset() {
            const v = String(this.speedPreset || "");
            if (!v) return;
            if (v === "walk") this.form.speedBlocksPerSec = 4.0;
            else if (v === "run") this.form.speedBlocksPerSec = 8.0;
            this.speedPreset = "";
          },
          close() {
            try {
              dialog.hide();
            } catch (e) {}
          },
        },
        watch: {
          form: {
            handler() {
              this.apply();
            },
            deep: true,
          },
        },
        mounted() {
          this.syncFromSettings();
          const onDown = (e) => {
            if (e?.key === "Shift") this.shiftDown = true;
          };
          const onUp = (e) => {
            if (e?.key === "Shift") this.shiftDown = false;
          };
          window.addEventListener("keydown", onDown);
          window.addEventListener("keyup", onUp);
          this.$once("hook:beforeDestroy", () => {
            window.removeEventListener("keydown", onDown);
            window.removeEventListener("keyup", onUp);
          });
        },
        template: `
          <div id="mgp-panel">
            <div class="mgp-section">
              <div class="mgp-section-title">General</div>
              <div class="mgp-row">
                <label>Enable</label>
                <div class="mgp-right mgp-checkbox"><input type="checkbox" v-model="form.enabled" /></div>
              </div>
              <div class="mgp-row">
                <label>Opacity</label>
                <div class="mgp-right">
                  <numeric-input v-model.number="form.opacity" :min="0" :max="1" :step="shiftDown ? 0.01 : 0.05" />
                </div>
              </div>
              <div class="mgp-row">
                <label>Edge Fade</label>
                <div class="mgp-right" style="gap: 12px;">
                  <div class="mgp-checkbox"><input type="checkbox" v-model="form.edgeFadeEnabled" /></div>
                  <numeric-input v-model.number="form.edgeFadeWidthUv" :min="0.001" :max="0.5" :step="shiftDown ? 0.002 : 0.01" />
                </div>
              </div>
            </div>

            <div class="mgp-section">
              <div class="mgp-section-title">Presets</div>
              <div class="mgp-row">
                <label>Auto-save to this animation</label>
                <div class="mgp-right mgp-checkbox"><input type="checkbox" v-model="form.autoSaveToAnimation" /></div>
              </div>
              <div class="mgp-row">
                <label>Animation preset</label>
                <div class="mgp-right"><span class="mgp-subtle">Saved for: {{ presetSavedFor }}</span></div>
              </div>
            </div>

            <div class="mgp-section">
              <div class="mgp-section-title">Quick Presets</div>
              <div class="mgp-row">
                <label>Size</label>
                <div class="mgp-right">
                  <select class="mgp-select" v-model="sizePreset" @change="applySizePreset">
                    <option value="">Select…</option>
                    <option value="small">Small (16×16)</option>
                    <option value="medium">Medium (64×64)</option>
                    <option value="large">Large (256×256)</option>
                  </select>
                </div>
              </div>
              <div class="mgp-row">
                <label>Speed</label>
                <div class="mgp-right">
                  <select class="mgp-select" v-model="speedPreset" @change="applySpeedPreset">
                    <option value="">Select…</option>
                    <option value="walk">Walk (4)</option>
                    <option value="run">Run (8)</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="mgp-section">
              <div class="mgp-section-title">Placement</div>
              <div class="mgp-row">
                <label>Width (blocks)</label>
                <div class="mgp-right"><numeric-input v-model.number="form.widthBlocks" :min="3" :max="4096" :step="1" /></div>
              </div>
              <div class="mgp-row">
                <label>Length (blocks)</label>
                <div class="mgp-right"><numeric-input v-model.number="form.lengthBlocks" :min="3" :max="4096" :step="1" /></div>
              </div>
              <div class="mgp-row">
                <label>Height (blocks)</label>
                <div class="mgp-right"><numeric-input v-model.number="form.yBlocks" :min="-4096" :max="4096" :step="1" /></div>
              </div>
              <div class="mgp-row">
                <label>Offset X (blocks)</label>
                <div class="mgp-right"><numeric-input v-model.number="form.xBlocks" :min="-4096" :max="4096" :step="shiftDown ? 0.1 : 1" /></div>
              </div>
              <div class="mgp-row">
                <label>Offset Z (blocks)</label>
                <div class="mgp-right"><numeric-input v-model.number="form.zBlocks" :min="-4096" :max="4096" :step="shiftDown ? 0.1 : 1" /></div>
              </div>
              <div class="mgp-row">
                <label>Rotation Y°</label>
                <div class="mgp-right"><numeric-input v-model.number="form.yaw" :min="-180" :max="180" :step="shiftDown ? 1 : 5" /></div>
              </div>
              <div class="mgp-row">
                <label>Tilt X°</label>
                <div class="mgp-right"><numeric-input v-model.number="form.tilt" :min="-89" :max="89" :step="shiftDown ? 0.25 : 1" /></div>
              </div>
            </div>

            <div class="mgp-section">
              <div class="mgp-section-title">Motion</div>
              <div class="mgp-row">
                <label>Speed (blocks/sec)</label>
                <div class="mgp-right"><numeric-input v-model.number="form.speedBlocksPerSec" :min="-50" :max="50" :step="shiftDown ? 0.02 : 0.1" /></div>
              </div>
            </div>

            <div class="mgp-section">
              <div class="mgp-section-title">Grid</div>
              <div class="mgp-row">
                <label>Grid square size (blocks)</label>
                <div class="mgp-right"><numeric-input v-model.number="form.gridSquareBlocks" :min="0.0625" :max="64" :step="shiftDown ? 0.015625 : 0.0625" /></div>
              </div>
              <div class="mgp-row">
                <label>Texture resolution (px)</label>
                <div class="mgp-right"><numeric-input v-model.number="form.textureResolutionPx" :min="64" :max="2048" :step="64" /></div>
              </div>
              <div class="mgp-row">
                <label>Grid line thickness</label>
                <div class="mgp-right"><numeric-input v-model.number="form.lineThicknessMult" :min="0.25" :max="6" :step="shiftDown ? 0.01 : 0.05" /></div>
              </div>
              <div class="mgp-row">
                <label>Grid minor opacity</label>
                <div class="mgp-right"><numeric-input v-model.number="form.gridMinorOpacity" :min="0" :max="1" :step="shiftDown ? 0.01 : 0.05" /></div>
              </div>
              <div class="mgp-row">
                <label>Grid major opacity</label>
                <div class="mgp-right"><numeric-input v-model.number="form.gridMajorOpacity" :min="0" :max="1" :step="shiftDown ? 0.01 : 0.05" /></div>
              </div>
              <div class="mgp-row">
                <label>Background opacity</label>
                <div class="mgp-right"><numeric-input v-model.number="form.backgroundOpacity" :min="0" :max="1" :step="shiftDown ? 0.01 : 0.05" /></div>
              </div>
              <div class="mgp-row">
                <label>Background color</label>
                <div class="mgp-right"><input class="tool" type="color" v-model="form.backgroundColor" /></div>
              </div>
              <div class="mgp-row">
                <label>Grid color</label>
                <div class="mgp-right"><input class="tool" type="color" v-model="form.gridColor" /></div>
              </div>
            </div>

            <div class="mgp-section">
              <div class="mgp-section-title">Custom Texture</div>
              <div class="mgp-row">
                <label>Use custom texture</label>
                <div class="mgp-right mgp-checkbox"><input type="checkbox" v-model="form.useCustomTexture" /></div>
              </div>
              <div class="mgp-button-row">
                <button class="tool" @click="chooseTexture">Choose Texture</button>
                <button class="tool" @click="openTextureLibrary">Texture Library…</button>
                <button class="tool" @click="clearTexture">Clear</button>
              </div>
              <div class="mgp-row" style="margin-top: 10px;">
                <label>Rotate</label>
                <div class="mgp-right">
                  <select class="mgp-select" v-model.number="form.customTextureRotation90">
                    <option :value="0">0°</option>
                    <option :value="1">90°</option>
                    <option :value="2">180°</option>
                    <option :value="3">270°</option>
                  </select>
                </div>
              </div>
              <div class="mgp-row">
                <label>Flip</label>
                <div class="mgp-right" style="gap: 12px;">
                  <div class="mgp-checkbox"><input type="checkbox" v-model="form.customTextureFlipX" /><span class="mgp-subtle">X</span></div>
                  <div class="mgp-checkbox"><input type="checkbox" v-model="form.customTextureFlipY" /><span class="mgp-subtle">Y</span></div>
                </div>
              </div>
            </div>

            <div class="mgp-section">
              <div class="mgp-section-title">Resets</div>
              <div class="mgp-button-row">
                <button class="tool" @click="resetAll">Reset all</button>
                <button class="tool" @click="resetGrid">Reset grid</button>
                <button class="tool" @click="resetMotion">Reset motion</button>
                <button class="tool" @click="resetTexture">Reset texture</button>
              </div>
            </div>

            <div class="mgp-footer">
              <div class="mgp-author">By Cazfps</div>
              <div class="mgp-spacer"></div>
              <button class="tool" @click="savePreset">Save</button>
              <button class="tool" @click="close">Close</button>
            </div>
          </div>
        `,
      },
    });

    wrapDialogHideToRestoreOverlay(dialog);

    // Also stop the label watcher when the dialog is hidden via X/Esc.
    try {
      const originalHide = dialog.hide?.bind(dialog);
      if (typeof originalHide === "function") {
        dialog.hide = (...args) => {
          stopDialogLabelWatcher();
          return originalHide(...args);
        };
      }
    } catch (e) {}

    // Make this dialog a hovering menu (no blackout overlay).
    setNoOverlayEnabled(true);
    setNoBlurEnabled(true);

    dialog.show();
    refreshDialogFromSettings();
    startDialogLabelWatcher();
  }

  // ============================================================
  // Plugin lifecycle
  // - onload calls forceCleanup() defensively in case Blockbench loads the file twice
  // - onunload is the authoritative teardown for store/uninstall/disable
  // ============================================================

  const registerPlugin =
    (typeof Plugin !== "undefined" && typeof Plugin.register === "function"
      ? Plugin.register.bind(Plugin)
      : null) ||
    (typeof BBPlugin !== "undefined" && typeof BBPlugin.register === "function"
      ? BBPlugin.register.bind(BBPlugin)
      : null);

  if (!registerPlugin) {
    console.error(
      `[AnimatedPlatforms] Failed to register: Plugin API not found (id=${PLUGIN_ID})`
    );
    return;
  }

  // Register persistent toolbar actions as early as possible.
  ensureTimelineActionsRegistered();

  registerPlugin(PLUGIN_ID, {
    title: "Animated Platforms",
    author: "Cazfps",
    description:
      "An animated ground plane that makes it easier to animate moving entities (walk cycles, vehicles, etc.). " +
      "It offers customization for size, rotation, speed, opacity, textures, and per-animation presets so you can tune it to your workflow.",
    icon: "icon.png",
    version: PLUGIN_VERSION,
    min_version: "4.8.0",
    variant: "both",
    new_repository_format: true,
    website: "https://www.cazfps.com/links",
    tags: ["Minecraft", "Animation", "Tools"],

    onload() {
      try {
        // If this script was loaded twice without a proper unload, clean up first.
        forceCleanup();

        // Migrate settings/presets from the legacy plugin id.
        migrateLegacyStorageOnce();

        Settings.load();
        rig.refresh();

        // Help > About Plugins entry
        addAboutButton();

        // Timeline-placeable actions (users can add them via the Timeline toolbar menu)
        // Ensure the two timeline actions exist (should already be created during script eval).
        if (!timelineToggleAction || !timelinePanelAction) {
          ensureTimelineActionsRegistered();
        }

        // Blockbench may prune unknown toolbar items before plugins load.
        // To make the user's Timeline toolbar setup effectively persistent, re-attach
        // our actions once the timeline toolbar has initialized.
        waitForTimelineToolbarAndAttach();

        action = new Action("animated_platforms_panel", {
          name: "Animated Platforms",
          description: "Open Animated Platforms controls",
          icon: "grid_on",
          click: showPanel,
        });

        MenuBar.addAction(action, "view");

        if (typeof Preview !== "undefined" && Preview.prototype.menu) {
          Preview.prototype.menu.addAction(action);
        }
        if (typeof Blockbench !== "undefined" && Blockbench.menus?.preview) {
          Blockbench.menus.preview.addAction(action);
        }

        // Watch animation selection changes and apply presets.
        // Important: never touch dialog form values from here (can cause persistent UI reflow lag).
        try {
          if (presetWatcher) clearInterval(presetWatcher);
        } catch (e) {}
        presetWatcher = null;
        lastAnimKey = null;

        try {
          presetWatcher = setInterval(() => {
            try {
              if (!Settings?.enabled) return;
              const key = getSelectedAnimationKey();
              if (!key) return;
              const scopedKey = `${getAnimPresetStorageKeys()[0]}|${key}`;

              if (scopedKey !== lastAnimKey) {
                lastAnimKey = scopedKey;
                maybeApplyPresetForSelectedAnimation();
              }
            } catch (e) {}
          }, 50);
        } catch (e) {}

        console.log(`[AnimatedPlatforms] v${PLUGIN_VERSION} loaded`);
      } catch (e) {
        console.error("[AnimatedPlatforms] Failed to load", e);
      }
    },

    onunload() {
      try {
        if (presetWatcher) clearInterval(presetWatcher);
      } catch (e) {}
      presetWatcher = null;
      lastAnimKey = null;

      try {
        if (dialogLabelWatcher) clearInterval(dialogLabelWatcher);
      } catch (e) {}
      dialogLabelWatcher = null;

      // Reset overlay changes if the plugin is unloaded mid-dialog.
      try {
        setNoOverlayEnabled(false);
      } catch (e) {}

      try {
        document.getElementById(NO_OVERLAY_STYLE_ID)?.remove?.();
      } catch (e) {}

      try {
        dialog?.hide?.();
      } catch (e) {}
      dialog = null;

      try {
        textureLibraryDialog?.hide?.();
      } catch (e) {}
      textureLibraryDialog = null;

      try {
        rig.dispose();
      } catch (e) {}

      if (action && typeof Preview !== "undefined" && Preview.prototype.menu) {
        Preview.prototype.menu.removeAction(action);
      }
      if (action && typeof Blockbench !== "undefined" && Blockbench.menus?.preview) {
        Blockbench.menus.preview.removeAction(action);
      }

      action?.delete?.();
      action = null;

      try {
        timelineToggleAction?.delete?.();
      } catch (e) {}
      timelineToggleAction = null;

      try {
        timelinePanelAction?.delete?.();
      } catch (e) {}
      timelinePanelAction = null;

      try {
        MenuBar.removeAction(`help.about_plugins.about_${PLUGIN_ID}`);
      } catch (e) {}
      try {
        aboutAction?.delete?.();
      } catch (e) {}
      aboutAction = null;

      console.log("[AnimatedPlatforms] Unloaded");
    },
  });
})();
