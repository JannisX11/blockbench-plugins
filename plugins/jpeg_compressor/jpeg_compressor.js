// Plugin Blockbench: JPEG Compressor
// Version 1.0.0
// Soft / Standard / Deep-fry JPEG compression with live 2D + 3D preview.

(function () {
  'use strict';

  let jpegAction;
  let pluginStyleTag = null;

  const isRu = () => (typeof Language !== 'undefined' && Language.code === 'ru');
  const tr = (en, ru) => (isRu() ? ru : en);

  // ===================== CONSTANTS =====================
  const LEVEL_MIN = 1;
  const LEVEL_MAX = 100;
  const LEVEL_DEFAULT = 20;

  const i18n = {
    title: () => tr('JPEG Compressor', 'JPEG Компрессор'),
    strength: () => tr('JPEG Strength', 'Сила JPEG'),
    strength_tooltip: () => tr(
      `Compression strength: ${LEVEL_MIN} (lightest) – ${LEVEL_MAX} (most destroyed)`,
      `Сила сжатия: ${LEVEL_MIN} (минимум) – ${LEVEL_MAX} (максимум)`),
    strength_hint: () => tr(
      `${LEVEL_MIN} — light · ${LEVEL_MAX} — maximum deep-fried`,
      `${LEVEL_MIN} — лёгкое сжатие · ${LEVEL_MAX} — максимальный мемный эффект`),
    level_name: (lvl) => {
      if (lvl <= 20) return tr('light', 'лёгкое');
      if (lvl <= 45) return tr('medium', 'среднее');
      if (lvl <= 70) return tr('heavy', 'сильное');
      if (lvl <= 90) return tr('deep-fried', 'прожарка');
      return tr('extreme', 'экстремальное');
    },
    target_texture: () => tr('Target Texture', 'Текстура'),
    apply: () => tr('Apply', 'Применить'),
    save_as_new: () => tr('Save as New', 'Сохранить как новую'),
    cancel: () => tr('Cancel', 'Отмена'),
    no_texture: () => tr('No texture selected', 'Текстура не выбрана'),
    applied: () => tr('JPEG applied', 'JPEG применён'),
    variant_saved: () => tr('Variant saved', 'Вариант сохранён'),
    preview_2d: () => tr('2D Texture (Ctrl+Wheel to zoom)', '2D Текстура (Ctrl+колёсико — зум)'),
    preview_3d: () => tr(
      '3D Model (LMB rotate, RMB pan, Wheel zoom)',
      '3D модель (ЛКМ — поворот, ПКМ — сдвиг, колёсико — зум)'),
    shading: () => tr('Shading', 'Затенение'),
    reset_view: () => tr('Reset view', 'Сбросить вид'),
    model_empty: () => tr('No displayable model geometry in this project', 'В проекте нет геометрии для показа'),
    show_original: () => tr('Show original', 'Показать оригинал'),
    processing: () => tr('processing…', 'обработка…'),
    variant: () => tr('Compression', 'Сжатие'),
    variant_v1: () => tr('Soft', 'Мягкое'),
    variant_v2: () => tr('Standard', 'Стандартное'),
    variant_fry: () => tr('Deep-fry', 'Прожарка'),
    variant_hint: (v) => ({
      v1: tr('Soft compression: full colour (4:4:4), no colour bleeding. Closest to Telegram / high-quality messengers.',
        'Мягкое сжатие: полный цвет (4:4:4), без растекания цвета. Ближе всего к Telegram и качественным мессенджерам.'),
      v2: tr('Standard JPEG: colours are averaged in 2×2 blocks (4:2:0). Stronger artefacts, classic look.',
        'Стандартный JPEG: цвета усредняются по блокам 2×2 (4:2:0). Сильнее артефакты, классический вид.'),
      fry: tr('Deep-fry: repeated JPEG passes at the selected quality; artefacts accumulate. Strong meme look.',
        'Прожарка: многократное JPEG-пересжатие с выбранным качеством; артефакты накапливаются. Сильный мемный эффект.')
    })[v],
    matte: () => tr('Transparent areas', 'Прозрачные области'),
    matte_white: () => tr('White background', 'Белый фон'),
    matte_black: () => tr('Black background', 'Чёрный фон'),
    keep_alpha: () => tr('Keep transparency in result', 'Сохранить прозрачность в результате'),
    quality_info: (q, p) => tr(
      `≈ JPEG quality ${q}, ${p} pass${p === '1' ? '' : 'es'}`,
      `≈ качество JPEG ${q}, проходов: ${p}`),

    w_no_webgl: () => tr('3D preview unavailable: WebGL / three.js could not be initialised.',
      '3D-превью недоступно: не удалось инициализировать WebGL / three.js.'),
    w_no_textures: () => tr('The project has no textures.', 'В проекте нет текстур.'),
    w_no_geometry: () => tr('The project has no displayable geometry, so there is no model to preview.',
      'В проекте нет отображаемой геометрии, превью модели невозможно.'),
    w_unresolved: () => tr(
      'Could not read the model\'s materials from the viewport (is Wireframe/Solid view active?). Switch to the textured view and reopen the dialog.',
      'Не удалось получить материалы модели из вьюпорта (включён каркас/солид?). Включите текстурный режим и откройте окно заново.'),
    w_unused: () => tr(
      'The selected texture is not assigned to any face of the model. The 3D model will not change when you adjust compression.',
      'Выбранная текстура не назначена ни одной грани модели. 3D-модель не изменится при смене силы сжатия.'),
    w_degenerate: (n) => tr(
      `${n} face(s) using this texture have no usable UV mapping (zero-area UVs). They will render as a single colour.`,
      `Граней с этой текстурой без корректной UV-развёртки (нулевая площадь): ${n}. Они будут одним цветом.`),
    w_no_uv: (n) => tr(
      `${n} mesh(es) have no UV coordinates. They cannot be textured correctly in the preview.`,
      `Мешей без UV-координат: ${n}. Они не могут быть корректно показаны с текстурой.`),
    w_animated: () => tr('Animated texture: the 3D preview shows the first frame.',
      'Анимированная текстура: в 3D показан первый кадр.'),
    w_skipped: (n) => tr(`${n} element(s) could not be displayed in the preview (unsupported type).`,
      `Элементов, которые не удалось показать в превью (неподдерживаемый тип): ${n}.`),
    w_channel: () => tr(
      'This texture is a non-colour channel (normal/height/MER). It is shown as a colour map and is not what the model\'s colour material uses.',
      'Это не цветовой канал (normal/height/MER). Он показан как цветовая карта и не используется цветовым материалом модели.'),
  };

  const CSS_STYLES = `
    .jpegf-layout {
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 700px;
      width: 100%;
      color: var(--color-text, #e0e0e0);
      box-sizing: border-box;
    }
    .jpegf-top-controls {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex-shrink: 0;
    }
    .jpegf-slider-row {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .jpegf-slider-row input[type="range"] {
      flex: 1;
      height: 22px;
      accent-color: var(--color-accent, #38e68b);
      cursor: pointer;
    }
    .jpegf-level-input {
      width: 64px;
      height: 32px;
      text-align: center;
      background: #14171c;
      border: 1px solid #282f38;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 700;
      color: var(--color-accent, #38e68b);
      outline: none;
    }
    .jpegf-level-input:focus { border-color: var(--color-accent, #38e68b); }
    .jpegf-hint {
      font-size: 12px;
      color: #727a85;
      margin-top: -4px;
    }
    .jpegf-options {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px 16px;
      font-size: 12px;
    }
    .jpegf-options label { display: inline-flex; align-items: center; gap: 6px; }
    .jpegf-select-sm {
      height: 28px;
      background: #14171c;
      color: #fff;
      border: 1px solid #282f38;
      border-radius: 4px;
      font-size: 12px;
      padding: 2px 8px;
      outline: none;
    }
    .jpegf-busy { color: var(--color-accent, #38e68b); margin-left: 8px; }
    .jpegf-previews {
      display: flex;
      gap: 16px;
      flex: 1;
      min-height: 0;
    }
    .jpegf-preview-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }
    .jpegf-preview-label {
      font-size: 13px;
      font-weight: 600;
      color: #dbe0e6;
      text-align: center;
    }
    .jpegf-preview-box {
      flex: 1;
      background-color: #1a1e24;
      background-image:
        linear-gradient(45deg, #13171b 25%, transparent 25%),
        linear-gradient(-45deg, #13171b 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #13171b 75%),
        linear-gradient(-45deg, transparent 75%, #13171b 75%);
      background-size: 18px 18px;
      background-position: 0 0, 0 9px, 9px -9px, -9px 0px;
      border: 1px solid #111417;
      border-radius: 6px;
      box-shadow: inset 0 2px 10px rgba(0,0,0,0.55);
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    }
    .jpegf-preview-box canvas { image-rendering: pixelated; }
    .jpegf-stack { position: relative; }
    .jpegf-stack canvas {
      position: absolute;
      left: 0; top: 0;
      width: 100%; height: 100%;
    }
    .jpegf-empty {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;
      color: #9aa3ae;
      font-size: 13px;
      pointer-events: none;
    }
    .jpegf-warnings {
      max-height: 86px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .jpegf-warning {
      font-size: 12px;
      line-height: 1.35;
      padding: 5px 8px;
      border-radius: 4px;
      background: rgba(255, 183, 0, 0.12);
      border: 1px solid rgba(255, 183, 0, 0.45);
      color: #ffd470;
    }
    .jpegf-zoom-bar {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 2px;
      font-size: 12px;
    }
    .jpegf-check { display: inline-flex; align-items: center; gap: 5px; cursor: pointer; }
    .jpegf-select {
      width: 100%;
      height: 34px;
      background: #14171c;
      color: #fff;
      border: 1px solid #282f38;
      border-radius: 4px;
      font-size: 14px;
      padding: 4px 10px;
      outline: none;
    }
    .jpegf-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding-top: 10px;
      border-top: 1px solid #22272e;
      flex-shrink: 0;
    }
    .jpegf-btn {
      background: #14171c;
      border: 1px solid #282f38;
      border-radius: 4px;
      color: #dbe0e6;
      cursor: pointer;
      font-size: 13px;
      padding: 8px 14px;
      transition: all 0.15s ease;
    }
    .jpegf-btn:hover {
      border-color: var(--color-accent, #38e68b);
      color: #fff;
    }
    .jpegf-btn.primary {
      background: var(--color-accent, #38e68b);
      border-color: var(--color-accent, #38e68b);
      color: #111;
      font-weight: 600;
    }
    .jpegf-btn.primary:hover { filter: brightness(1.1); }

    /* ---- Mobile / narrow screens ---- */
    @media screen and (max-width: 820px) {
      .jpegf-layout {
        height: auto;
        max-height: 78vh;
        overflow-y: auto;
        overflow-x: hidden;
        gap: 10px;
        padding-bottom: 4px;
      }
      .jpegf-previews {
        flex-direction: column;
        flex: none;
        gap: 12px;
      }
      .jpegf-preview-col {
        flex: none;
      }
      .jpegf-preview-box {
        height: 220px;
        flex: none;
        min-height: 180px;
      }
      .jpegf-top-controls {
        gap: 6px;
      }
      .jpegf-slider-row {
        gap: 10px;
      }
      .jpegf-slider-row input[type="range"] {
        height: 28px;
      }
      .jpegf-level-input {
        width: 56px;
        height: 36px;
        font-size: 15px;
      }
      .jpegf-options {
        gap: 8px 12px;
        font-size: 13px;
      }
      .jpegf-select-sm {
        height: 32px;
        font-size: 13px;
        max-width: 100%;
      }
      .jpegf-select {
        height: 38px;
        font-size: 14px;
      }
      .jpegf-hint {
        font-size: 11px;
        line-height: 1.35;
      }
      .jpegf-preview-label {
        font-size: 12px;
      }
      .jpegf-warnings {
        max-height: 64px;
      }
      .jpegf-warning {
        font-size: 11px;
        padding: 4px 6px;
      }
      .jpegf-zoom-bar {
        gap: 6px;
      }
      .jpegf-btn {
        padding: 10px 12px;
        font-size: 13px;
        min-height: 40px;
      }
      .jpegf-bottom {
        position: sticky;
        bottom: 0;
        background: var(--color-ui, #21252b);
        padding: 10px 0 6px;
        margin-top: 4px;
        z-index: 10;
        flex-wrap: wrap;
        gap: 8px;
      }
      .jpegf-bottom > div {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
    }

    @media screen and (max-width: 480px) {
      .jpegf-layout {
        max-height: 82vh;
        gap: 8px;
      }
      .jpegf-preview-box {
        height: 180px;
        min-height: 150px;
      }
      .jpegf-options {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      .jpegf-options label {
        width: 100%;
      }
      .jpegf-select-sm {
        flex: 1;
        width: auto;
        min-width: 0;
      }
      .jpegf-slider-row span {
        min-width: 70px !important;
        font-size: 13px;
      }
      .jpegf-bottom {
        flex-direction: column;
        align-items: stretch;
      }
      .jpegf-bottom > div {
        width: 100%;
        justify-content: stretch;
      }
      .jpegf-bottom .jpegf-btn {
        flex: 1;
      }
    }
  `;

  // ===================== JPEG CORE (own implementation of the JPEG lossy stage) =====================
  // Entropy coding (Huffman) is lossless, so it is skipped; only the lossy stage is reproduced.
  // Pipeline: RGB→YCbCr → optional 4:2:0 → DCT → quantise → IDCT → RGB. Yields between chunks.
  const STD_LUMA_Q = [
    16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55,
    14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62,
    18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92,
    49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99];
  const STD_CHROMA_Q = [
    17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99,
    24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99, 99, 99,
    99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99,
    99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99];

  function scaledQTable(base, quality) {
    quality = Math.max(1, Math.min(100, Math.round(quality)));
    const scale = quality < 50 ? 5000 / quality : 200 - quality * 2;
    const out = new Float32Array(64);
    for (let i = 0; i < 64; i++) {
      out[i] = Math.max(1, Math.min(255, Math.floor((base[i] * scale + 50) / 100)));
    }
    return out;
  }

  const DCT_C = (() => {
    const c = new Float32Array(64); // c[u*8+x] = 0.5 * a(u) * cos((2x+1)uπ/16)
    for (let u = 0; u < 8; u++) {
      for (let x = 0; x < 8; x++) {
        c[u * 8 + x] = 0.5 * (u === 0 ? Math.SQRT1_2 : 1) * Math.cos(((2 * x + 1) * u * Math.PI) / 16);
      }
    }
    return c;
  })();

  // Hot DCT loop kept sync to avoid per-block await overhead; outer loop still chunks for UI.
  function quantizeBlockRange(plane, pw, ph, qt, bw, startBlock, endBlock, blk, tmp) {
    for (let blockIndex = startBlock; blockIndex < endBlock; blockIndex++) {
      const by = Math.floor(blockIndex / bw), bx = blockIndex - by * bw;
      for (let y = 0; y < 8; y++) {
        const sy = Math.min(by * 8 + y, ph - 1);
        for (let x = 0; x < 8; x++) {
          blk[y * 8 + x] = plane[sy * pw + Math.min(bx * 8 + x, pw - 1)] - 128;
        }
      }
      for (let y = 0; y < 8; y++) {
        for (let u = 0; u < 8; u++) {
          let sum = 0;
          for (let x = 0; x < 8; x++) sum += blk[y * 8 + x] * DCT_C[u * 8 + x];
          tmp[y * 8 + u] = sum;
        }
      }
      for (let u = 0; u < 8; u++) {
        for (let v = 0; v < 8; v++) {
          let sum = 0;
          for (let y = 0; y < 8; y++) sum += tmp[y * 8 + u] * DCT_C[v * 8 + y];
          const k = v * 8 + u;
          const q = qt[k];
          const r = sum / q;
          blk[k] = (r < 0 ? -Math.floor(-r + 0.5) : Math.floor(r + 0.5)) * q;
        }
      }
      for (let v = 0; v < 8; v++) {
        for (let x = 0; x < 8; x++) {
          let sum = 0;
          for (let u = 0; u < 8; u++) sum += blk[v * 8 + u] * DCT_C[u * 8 + x];
          tmp[v * 8 + x] = sum;
        }
      }
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          const px = bx * 8 + x, py = by * 8 + y;
          if (px < pw && py < ph) {
            let sum = 0;
            for (let v = 0; v < 8; v++) sum += tmp[v * 8 + x] * DCT_C[v * 8 + y];
            const val = Math.round(sum + 128);
            plane[py * pw + px] = val < 0 ? 0 : (val > 255 ? 255 : val);
          }
        }
      }
    }
  }

  async function quantizePlane(plane, pw, ph, qt, cancelled) {
    const bw = Math.ceil(pw / 8), bh = Math.ceil(ph / 8);
    const totalBlocks = bw * bh, BLOCK_CHUNK = 256;
    const blk = new Float32Array(64), tmp = new Float32Array(64);
    for (let start = 0; start < totalBlocks; start += BLOCK_CHUNK) {
      if (cancelled && cancelled()) return false;
      quantizeBlockRange(plane, pw, ph, qt, bw, start, Math.min(totalBlocks, start + BLOCK_CHUNK), blk, tmp);
      if (start + BLOCK_CHUNK < totalBlocks) await yieldToUI();
    }
    return !(cancelled && cancelled());
  }

  /** One JPEG-style encode→decode round trip on RGB data (alpha ignored, output alpha = 255). */
  async function jpegRoundTrip(rgba, w, h, quality, chroma420, cancelled) {
    const n = w * h;
    const Y = new Float32Array(n);
    let Cb = new Float32Array(n), Cr = new Float32Array(n);
    const CHUNK = 65536;
    for (let start = 0; start < n; start += CHUNK) {
      if (cancelled && cancelled()) return null;
      const stop = Math.min(n, start + CHUNK);
      for (let i = start, p = start * 4; i < stop; i++, p += 4) {
        const r = rgba[p], g = rgba[p + 1], b = rgba[p + 2];
        Y[i] = 0.299 * r + 0.587 * g + 0.114 * b;
        Cb[i] = -0.168736 * r - 0.331264 * g + 0.5 * b + 128;
        Cr[i] = 0.5 * r - 0.418688 * g - 0.081312 * b + 128;
      }
      await yieldToUI();
    }
    const qL = scaledQTable(STD_LUMA_Q, quality);
    const qC = scaledQTable(STD_CHROMA_Q, quality);
    if (!await quantizePlane(Y, w, h, qL, cancelled)) return null;

    let cw = w, ch = h;
    if (chroma420) {
      cw = Math.ceil(w / 2); ch = Math.ceil(h / 2);
      const sb = new Float32Array(cw * ch), sr = new Float32Array(cw * ch);
      for (let y = 0; y < ch; y++) {
        if (y > 0 && (y & 63) === 0) {
          if (cancelled && cancelled()) return null;
          await yieldToUI();
        }
        const y0 = Math.min(y * 2, h - 1), y1 = Math.min(y * 2 + 1, h - 1);
        for (let x = 0; x < cw; x++) {
          const x0 = Math.min(x * 2, w - 1), x1 = Math.min(x * 2 + 1, w - 1);
          const a = y0 * w + x0, b = y0 * w + x1, c = y1 * w + x0, d = y1 * w + x1;
          sb[y * cw + x] = (Cb[a] + Cb[b] + Cb[c] + Cb[d]) / 4;
          sr[y * cw + x] = (Cr[a] + Cr[b] + Cr[c] + Cr[d]) / 4;
        }
      }
      Cb = sb; Cr = sr;
    }
    if (!await quantizePlane(Cb, cw, ch, qC, cancelled)) return null;
    if (!await quantizePlane(Cr, cw, ch, qC, cancelled)) return null;

    const out = new Uint8ClampedArray(n * 4);
    for (let start = 0; start < n; start += CHUNK) {
      if (cancelled && cancelled()) return null;
      const stop = Math.min(n, start + CHUNK);
      for (let i = start; i < stop; i++) {
        const x = i % w, y = Math.floor(i / w);
        let cb, cr;
        if (chroma420) {
          const x0 = x >> 1, y0 = y >> 1;
          const x1 = Math.max(0, Math.min(cw - 1, (x & 1) ? x0 + 1 : x0 - 1));
          const y1 = Math.max(0, Math.min(ch - 1, (y & 1) ? y0 + 1 : y0 - 1));
          const a = y0 * cw + x0, b = y0 * cw + x1, c = y1 * cw + x0, d = y1 * cw + x1;
          cb = (9 * Cb[a] + 3 * Cb[b] + 3 * Cb[c] + Cb[d]) / 16;
          cr = (9 * Cr[a] + 3 * Cr[b] + 3 * Cr[c] + Cr[d]) / 16;
        } else {
          cb = Cb[i]; cr = Cr[i];
        }
        const yy = Y[i], o = i * 4;
        out[o] = Math.round(yy + 1.402 * (cr - 128));
        out[o + 1] = Math.round(yy - 0.344136 * (cb - 128) - 0.714136 * (cr - 128));
        out[o + 2] = Math.round(yy + 1.772 * (cb - 128));
        out[o + 3] = 255;
      }
      await yieldToUI();
    }
    return out;
  }

  // Fractional quality is an interpolation of adjacent integer-quality results.
  async function jpegRoundTripQ(rgba, w, h, quality, chroma420, cancelled) {
    const lo = Math.floor(quality), hi = Math.ceil(quality);
    const a = await jpegRoundTrip(rgba, w, h, lo, chroma420, cancelled);
    if (!a) return null;
    const f = quality - lo;
    if (hi === lo || f < 0.02) return a;
    const b = await jpegRoundTrip(rgba, w, h, hi, chroma420, cancelled);
    if (!b) return null;
    const CHUNK = 65536;
    for (let start = 0; start < a.length; start += CHUNK * 4) {
      if (cancelled && cancelled()) return null;
      const stop = Math.min(a.length, start + CHUNK * 4);
      for (let p = start; p < stop; p += 4) {
        a[p] = Math.round(a[p] + (b[p] - a[p]) * f);
        a[p + 1] = Math.round(a[p + 1] + (b[p + 1] - a[p + 1]) * f);
        a[p + 2] = Math.round(a[p + 2] + (b[p + 2] - a[p + 2]) * f);
      }
      await yieldToUI();
    }
    return a;
  }

  // ---------- strength → JPEG parameters ----------
  // Strength 1–100 maps to JPEG params:
  //   single (v1/v2): one encode; quality from exponential quantisation scale (≈q97.5 → q2).
  //   fry: multi-pass at quality 78→7; passes = 1 + 11·t² (fractional last pass blended).
  const SINGLE_SCALE_MIN = 5;
  const SINGLE_SCALE_MAX = 2500;
  const Q_START = 0.78;
  const Q_END = 0.07;
  const Q_CURVE = 1.15;
  const PASSES_EXTRA = 11;
  const PASS_CURVE = 2;
  const BLEND_EPSILON = 0.02;

  function clampLevel(v) {
    v = Math.round(Number(v));
    if (!isFinite(v)) return LEVEL_DEFAULT;
    return Math.max(LEVEL_MIN, Math.min(LEVEL_MAX, v));
  }

  // Soft (v1): full chroma 4:4:4 (Telegram-like). Standard (v2): classic 4:2:0. Deep-fry: multi-pass.
  const VARIANTS = {
    v1: { chroma420: false, multiPass: false },
    v2: { chroma420: true, multiPass: false },
    fry: { chroma420: true, multiPass: true }
  };

  function getJpegParams(level, variant) {
    level = clampLevel(level);
    const t = (level - LEVEL_MIN) / (LEVEL_MAX - LEVEL_MIN);
    let quality, passes;
    if (variant === 'fry') {
      quality = Math.round(100 * Q_START * Math.pow(Q_END / Q_START, Math.pow(t, Q_CURVE)));
      passes = 1 + PASSES_EXTRA * Math.pow(t, PASS_CURVE);
    } else {
      const scale = SINGLE_SCALE_MIN * Math.pow(SINGLE_SCALE_MAX / SINGLE_SCALE_MIN, t);
      quality = scale <= 100 ? (200 - scale) / 2 : 5000 / scale; // inverse of libjpeg's quality→scale rule
      passes = 1;
    }
    quality = Math.max(1, Math.min(100, quality)); // may be fractional in 'single' mode
    const fullPasses = Math.floor(passes + 1e-9);
    const blend = Math.max(0, passes - fullPasses);
    return { level, t, variant: VARIANTS[variant] ? variant : 'v1', quality, passes, fullPasses, blend };
  }

  function makeCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }

  const yieldToUI = () => new Promise(r => setTimeout(r, 0));

  /**
   * settings: { level, variant: 'v1'|'v2'|'fry', matte: 'white'|'black', keepAlpha: boolean }
   * matte – flatten transparency before JPEG (no alpha); keepAlpha restores original alpha after.
   * keepAlpha is cosmetic: with false the result is what a real PNG→JPG→PNG round trip gives.
   * Returns null if cancelled (preview superseded or dialog destroyed).
   */
  async function processTexture(tex, settings, isCancelled) {
    const s = Object.assign({ level: LEVEL_DEFAULT, variant: 'v1', matte: 'white', keepAlpha: true }, settings);
    const variantDef = VARIANTS[s.variant] || VARIANTS.v1;
    const cancelled = () => !!(isCancelled && isCancelled());

    const w = Number(tex.width || (tex.img && tex.img.naturalWidth) || 64);
    const h = Number(tex.height || (tex.img && tex.img.naturalHeight) || 64);
    const pixelCount = w * h;
    // Bound peak allocations: the CPU JPEG pipeline holds several full-size planes.
    const MAX_DIMENSION = 8192;
    const MAX_PIXELS = 5500000;
    if (!Number.isSafeInteger(w) || !Number.isSafeInteger(h) || w < 1 || h < 1 ||
        w > MAX_DIMENSION || h > MAX_DIMENSION || !Number.isSafeInteger(pixelCount) || pixelCount > MAX_PIXELS) {
      throw new Error('Texture dimensions exceed the supported processing limit (8192 px per side, 5.5 MP total).');
    }
    if (cancelled()) return null;

    const src = makeCanvas(w, h);
    const sctx = src.getContext('2d');
    if (!sctx) throw new Error('Could not create a 2D canvas context.');
    sctx.imageSmoothingEnabled = false;
    if (tex.canvas) sctx.drawImage(tex.canvas, 0, 0);
    else if (tex.img) sctx.drawImage(tex.img, 0, 0);
    const srcData = sctx.getImageData(0, 0, w, h).data;

    let cur = new Uint8ClampedArray(srcData);
    {
      const bg = s.matte === 'black' ? 0 : 255;
      const CHUNK_BYTES = 262144;
      for (let start = 0; start < cur.length; start += CHUNK_BYTES) {
        if (cancelled()) return null;
        const stop = Math.min(cur.length, start + CHUNK_BYTES);
        for (let p = start; p < stop; p += 4) {
          const a = cur[p + 3] / 255;
          cur[p] = Math.round(cur[p] * a + bg * (1 - a));
          cur[p + 1] = Math.round(cur[p + 1] * a + bg * (1 - a));
          cur[p + 2] = Math.round(cur[p + 2] * a + bg * (1 - a));
          cur[p + 3] = 255;
        }
        await yieldToUI();
      }
    }

    const { quality, fullPasses, blend } = getJpegParams(s.level, s.variant);
    for (let i = 0; i < fullPasses; i++) {
      if (cancelled()) return null;
      cur = await jpegRoundTripQ(cur, w, h, quality, variantDef.chroma420, cancelled);
      if (!cur) return null;
    }
    if (blend > BLEND_EPSILON) {
      if (cancelled()) return null;
      const extra = await jpegRoundTripQ(cur, w, h, quality, variantDef.chroma420, cancelled);
      if (!extra) return null;
      const mixed = new Uint8ClampedArray(cur.length);
      const CHUNK_BYTES = 262144;
      for (let start = 0; start < cur.length; start += CHUNK_BYTES) {
        if (cancelled()) return null;
        const stop = Math.min(cur.length, start + CHUNK_BYTES);
        for (let p = start; p < stop; p += 4) {
          mixed[p] = Math.round(cur[p] + (extra[p] - cur[p]) * blend);
          mixed[p + 1] = Math.round(cur[p + 1] + (extra[p + 1] - cur[p + 1]) * blend);
          mixed[p + 2] = Math.round(cur[p + 2] + (extra[p + 2] - cur[p + 2]) * blend);
          mixed[p + 3] = 255;
        }
        await yieldToUI();
      }
      cur = mixed;
    }

    if (s.keepAlpha) {
      const CHUNK_BYTES = 262144;
      for (let start = 3; start < cur.length; start += CHUNK_BYTES) {
        if (cancelled()) return null;
        const stop = Math.min(cur.length, start + CHUNK_BYTES);
        for (let p = start; p < stop; p += 4) cur[p] = srcData[p];
        await yieldToUI();
      }
    }

    const result = makeCanvas(w, h);
    const resultContext = result.getContext('2d');
    if (!resultContext) throw new Error('Could not create the result canvas context.');
    resultContext.putImageData(new ImageData(cur, w, h), 0, 0);
    return result;
  }

  // ===================== MODEL HELPERS (universal, UV-faithful) =====================
  function getTextureMaterial(tex) {
    try {
      if (typeof tex.getMaterial === 'function') {
        const m = tex.getMaterial();
        if (m) return m;
      }
    } catch (e) { /* fall through */ }
    return (typeof Project !== 'undefined' && Project.materials && Project.materials[tex.uuid]) || null;
  }

  function getMaterialMap(mat) {
    if (!mat) return null;
    if (mat.map) return mat.map;
    if (mat.uniforms && mat.uniforms.map && mat.uniforms.map.value) return mat.uniforms.map.value;
    return null;
  }

  function isChainVisible(obj) {
    while (obj) {
      if (obj.visible === false) return false;
      obj = obj.parent;
    }
    return true;
  }

  const NON_GEOMETRY_TYPES = ['locator', 'null_object'];

  // Collects Blockbench's own THREE meshes (cubes, meshes, …) that are currently visible.
  function collectSourceMeshes() {
    const out = { meshes: [], skipped: 0 };
    const elements = (typeof Outliner !== 'undefined' && Outliner.elements) || [];
    elements.forEach(el => {
      if (NON_GEOMETRY_TYPES.indexOf(el.type) !== -1) return;
      const mesh = el.mesh;
      if (!mesh || !mesh.isMesh || !mesh.geometry || !mesh.geometry.attributes || !mesh.geometry.attributes.position) {
        out.skipped++;
        return;
      }
      if (!isChainVisible(mesh)) return;
      out.meshes.push(mesh);
    });
    return out;
  }

  /**
   * Inspects one geometry's UVs for faces that use `selTex`.
   * `resolveTex(material)` maps a source material to a Blockbench Texture (or null).
   */
  function analyzeUV(geo, srcMats, resolveTex, selTex) {
    const res = { usesSel: false, tris: 0, degenerate: 0, hasUV: !!geo.attributes.uv };
    const uv = geo.attributes.uv;
    const pos = geo.attributes.position;
    const index = geo.index;
    const total = index ? index.count : pos.count;
    const groups = (geo.groups && geo.groups.length)
      ? geo.groups
      : [{ start: 0, count: total, materialIndex: 0 }];

    groups.forEach(g => {
      const sm = srcMats[g.materialIndex] !== undefined ? srcMats[g.materialIndex] : srcMats[0];
      const tex = resolveTex(sm);
      if (!tex || !selTex || tex.uuid !== selTex.uuid) return;
      res.usesSel = true;
      if (!uv) return;
      const end = Math.min(g.start + g.count, total);
      for (let i = g.start; i + 2 < end; i += 3) {
        const a = index ? index.getX(i) : i;
        const b = index ? index.getX(i + 1) : i + 1;
        const c = index ? index.getX(i + 2) : i + 2;
        const ax = uv.getX(a), ay = uv.getY(a);
        const bx = uv.getX(b), by = uv.getY(b);
        const cx = uv.getX(c), cy = uv.getY(c);
        const area = Math.abs((bx - ax) * (cy - ay) - (cx - ax) * (by - ay)) / 2;
        res.tris++;
        if (area < 1e-9) res.degenerate++;
      }
    });
    return res;
  }

  // ===================== VUE =====================
  const DialogComponent = {
    data() {
      return {
        level: LEVEL_DEFAULT,
        textures: [],
        selectedUuid: null,
        texW: 64,
        texH: 64,

        previewZoom: 1.0,
        panX: 0,
        panY: 0,
        isPanning: false,
        lastMouseX: 0,
        lastMouseY: 0,

        variant: 'v1',
        matte: 'white',
        keepAlpha: true,

        busy: false,
        actionBusy: false,
        shaded: true,
        warnings: [],
        modelEmpty: false,
      };
    },
    computed: {
      t() { return i18n; },
      levelName() { return i18n.level_name(this.level); },
      qualityInfo() {
        const p = getJpegParams(this.level, this.variant);
        const passes = p.blend > BLEND_EPSILON ? p.passes.toFixed(1) : String(p.fullPasses);
        const q = Math.abs(p.quality - Math.round(p.quality)) < 0.05 ? String(Math.round(p.quality)) : p.quality.toFixed(1);
        return i18n.quality_info(q, passes);
      },
      previewCanvasStyle() {
        const w = window.innerWidth || 800;
        const maxSize = w <= 480 ? 160 : (w <= 768 ? 200 : 380);
        let displayW, displayH;
        if (this.texW >= this.texH) {
          displayW = maxSize;
          displayH = Math.round(maxSize * (this.texH / this.texW));
        } else {
          displayH = maxSize;
          displayW = Math.round(maxSize * (this.texW / this.texH));
        }
        return {
          width: displayW + 'px',
          height: displayH + 'px',
          transform: `translate(${this.panX}px, ${this.panY}px) scale(${this.previewZoom})`,
          transformOrigin: 'center center',
          transition: this.isPanning ? 'none' : 'transform 0.08s ease',
          cursor: this.previewZoom > 1 ? (this.isPanning ? 'grabbing' : 'grab') : 'default',
          imageRendering: 'pixelated',
          boxShadow: '0 6px 18px rgba(0,0,0,0.6)',
        };
      }
    },
    watch: {
      level() { this.queuePreview(); },
      variant() { this.queuePreview(); },
      matte() { this.queuePreview(); },
      keepAlpha() { this.queuePreview(); },
      selectedUuid() {
        this.updateTexSize();
        this.queuePreview(); // model is rebuilt for the new texture; the camera is NOT touched
      },
      shaded() {
        this._modelBuilt = false; // rebuild materials only; camera is preserved
        this.queuePreview();
      }
    },
    created() {
      // Non-reactive state (THREE objects must stay out of Vue's reactivity system)
      this._three = null;
      this._view = null;
      this._framed = false;
      this._modelBuilt = false;
      this._modelUuid = null;
      this._previewMap = null;
      this._previewCanvas = null;
      this._dirty = false;
      this._running = false;
      this._destroyed = false;
      this._needsRender = false;
      this._animId = null;
      this._renderRafId = null;
      this._ro = null;
      this._warningsTimer = null;
      this._disposables = { textures: [], materials: [], geometries: [] };
      this._shownWarnings = new Set();
    },
    mounted() {
      this.refreshTextureList();
      const sel = Texture.selected;
      this.selectedUuid = sel ? sel.uuid : (this.textures[0] && this.textures[0].uuid) || null;
      this.updateTexSize();

      // Keep in sync if the project changes while the dialog is open
      this._bbHandler = () => {
        this.refreshTextureList();
        this._modelBuilt = false;
        this.queuePreview();
      };
      if (typeof Blockbench !== 'undefined' && Blockbench.on) {
        ['finished_edit', 'undo', 'redo'].forEach(ev => Blockbench.on(ev, this._bbHandler));
      }

      this.$nextTick(() => {
        try { this.init3D(); } catch (e) { this.reportError('3D', e); }
        this.queuePreview();
      });
    },
    beforeDestroy() {
      this._destroyed = true;
      this._dirty = false;
      if (this._bbHandler && typeof Blockbench !== 'undefined' && Blockbench.removeListener) {
        ['finished_edit', 'undo', 'redo'].forEach(ev => Blockbench.removeListener(ev, this._bbHandler));
      }
      if (this._animId) cancelAnimationFrame(this._animId);
      if (this._renderRafId) cancelAnimationFrame(this._renderRafId);
      this._renderRafId = null;
      if (this._ro) { try { this._ro.disconnect(); } catch (e) {} }
      if (this._warningsTimer) { clearTimeout(this._warningsTimer); this._warningsTimer = null; }
      this.disposeModel();
      const T = this._three;
      if (T && T.renderer) {
        try { T.renderer.dispose(); } catch (e) { console.warn('[JPEG Compressor] renderer.dispose failed:', e); }
        try { T.renderer.forceContextLoss(); } catch (e) { /* WebGL context may already be lost */ }
      }
      this._three = null;
    },
    methods: {
      // ---------- helpers ----------
      currentTexture() {
        return Texture.all.find(t => t.uuid === this.selectedUuid) || null;
      },

      // Temporary warnings: show for a few seconds, then auto-hide
      setWarnings(list) {
        if (this._warningsTimer) {
          clearTimeout(this._warningsTimer);
          this._warningsTimer = null;
        }

        const newWarnings = Array.from(new Set(list || [])).filter(w => !this._shownWarnings.has(w));
        
        newWarnings.forEach(w => this._shownWarnings.add(w));

        this.warnings = newWarnings;
        
        if (this.warnings.length) {
          this._warningsTimer = setTimeout(() => {
            if (!this._destroyed) this.warnings = [];
            this._warningsTimer = null;
          }, 2500);
        }
      },

      refreshTextureList() {
        this.textures = Texture.all.map(t => ({ uuid: t.uuid, name: t.name }));
        if (this.selectedUuid && !this.textures.some(t => t.uuid === this.selectedUuid)) {
          this.selectedUuid = this.textures[0] ? this.textures[0].uuid : null;
        }
      },

      updateTexSize() {
        const tex = this.currentTexture();
        if (tex) {
          this.texW = tex.width || (tex.img && tex.img.naturalWidth) || 64;
          this.texH = tex.height || (tex.img && tex.img.naturalHeight) || 64;
        }
      },

      // ---------- strength input ----------
      onLevelInput(e) {
        const raw = parseFloat(e.target.value);
        if (isFinite(raw)) this.level = clampLevel(raw);
      },
      commitLevelInput(e) {
        this.level = clampLevel(e.target.value);
        e.target.value = this.level;
      },

      // ---------- 2D preview ----------
      zoomIn() { this.previewZoom = Math.min(8, +(this.previewZoom + 0.25).toFixed(2)); },
      zoomOut() { this.previewZoom = Math.max(0.25, +(this.previewZoom - 0.25).toFixed(2)); },
      zoomReset() { this.previewZoom = 1.0; this.panX = 0; this.panY = 0; },

      onPreviewMouseDown(e) {
        if (this.previewZoom <= 1) return;
        this.isPanning = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        e.preventDefault();
      },
      onPreviewMouseMove(e) {
        if (!this.isPanning) return;
        this.panX += e.clientX - this.lastMouseX;
        this.panY += e.clientY - this.lastMouseY;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      },
      onPreviewMouseUp() { this.isPanning = false; },
      onPreviewWheel(e) {
        if (!e.ctrlKey) return;
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY > 0 ? -0.25 : 0.25;
        this.previewZoom = Math.max(0.25, Math.min(8, +(this.previewZoom + delta).toFixed(2)));
      },

      draw2D(result) {
        const canvas2d = this.$refs.preview2d;
        if (!canvas2d) return;
        canvas2d.width = result.width;
        canvas2d.height = result.height;
        const ctx = canvas2d.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);
        ctx.drawImage(result, 0, 0);
      },

      // ---------- preview pipeline (single source of truth for 2D + 3D) ----------
      // Newest preview request always wins; no debounce so the slider feels live.
      queuePreview() {
        this._dirty = true;
        if (!this._running) this.runPreviewLoop();
      },

      async runPreviewLoop() {
        this._running = true;
        try {
          while (this._dirty && !this._destroyed) {
            this._dirty = false;
            await this.updatePreview();
            if (this._destroyed) break;
            await new Promise(r => requestAnimationFrame(r));
          }
        } finally {
          this._running = false;
        }
      },

      getSettings() {
        return { level: this.level, variant: this.variant, matte: this.matte, keepAlpha: this.keepAlpha };
      },

      async updatePreview() {
        const tex = this.currentTexture();
        if (!tex) {
          this.setWarnings([i18n.no_texture()]);
          return;
        }
        this.busy = (tex.width || 64) * (tex.height || 64) > 262144;
        try {
          const result = await processTexture(tex, this.getSettings(), () => this._destroyed || this._dirty);
          if (!result) return; // superseded by a newer request
          this._previewCanvas = result;
          this.texW = result.width;
          this.texH = result.height;

          this.draw2D(result);
          this.sync3D(tex, result);
        } catch (e) {
          console.error('[JPEG Compressor]', e);
        } finally {
          if (!this._dirty) this.busy = false;
        }
      },

      reportError(where, e) {
        console.error('[JPEG Compressor] ' + where + ' failed:', e);
        const msg = '[' + where + '] ' + (e && e.message ? e.message : String(e));
        this.setWarnings(this.warnings.concat([msg]));
      },

      sync3D(tex, canvas) {
        if (!this._three) return;
        try { this.sync3DUnsafe(tex, canvas); } catch (e) { this.reportError('3D', e); }
      },

      sync3DUnsafe(tex, canvas) {
        const needBuild = !this._modelBuilt || this._modelUuid !== tex.uuid;
        if (needBuild) {
          try {
            this.buildModel(tex, canvas);
          } catch (e) {
            this.disposeModel();
            this._modelBuilt = false;
            this._modelUuid = null;
            throw e;
          }
        } else if (this._previewMap) {
          const img = this._previewMap.image;
          if (img && (img.width !== canvas.width || img.height !== canvas.height)) {
            try {
              this.buildModel(tex, canvas);
            } catch (e) {
              this.disposeModel();
              this._modelBuilt = false;
              this._modelUuid = null;
              throw e;
            }
          } else {
            this._previewMap.image = canvas;
            this._previewMap.needsUpdate = true;
            this.requestRender();
          }
        }
      },

      // ---------- 3D ----------
      requestRender() {
        this._needsRender = true;
        if (this._destroyed || !this._three || this._renderRafId !== null) return;
        this._renderRafId = requestAnimationFrame(() => {
          this._renderRafId = null;
          if (this._destroyed || !this._three || !this._needsRender) return;
          this._needsRender = false;
          this._three.renderer.render(this._three.scene, this._three.camera);
        });
      },

      init3D() {
        const container = this.$refs.preview3dBox;
        if (!container) return;
        if (typeof THREE === 'undefined') {
          this.setWarnings([i18n.w_no_webgl()]);
          return;
        }

        const width = container.clientWidth || 300;
        const height = container.clientHeight || 300;

        let renderer;
        try {
          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        } catch (e) {
          console.error('[JPEG Compressor] WebGL init failed', e);
          this.setWarnings([i18n.w_no_webgl()]);
          return;
        }
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(32, width / height, 0.01, 10000);
        scene.add(camera);

        // Headlight attached to the camera, so every angle stays readable
        scene.add(new THREE.AmbientLight(0xffffff, 0.85));
        const dir = new THREE.DirectionalLight(0xffffff, 0.45);
        dir.position.set(0.4, 0.8, 1);
        dir.target.position.set(0, 0, -1);
        camera.add(dir);
        camera.add(dir.target);

        const modelGroup = new THREE.Group();
        scene.add(modelGroup);

        this._three = { renderer, scene, camera, modelGroup };
        this._view = {
          target: new THREE.Vector3(0, 0, 0),
          quat: new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.25, Math.PI + 0.6, 0, 'YXZ')),
          dist: 5,
          radius: 1
        };
        this.applyView();

        // ---- controls: LMB rotate, RMB / MMB / Shift+LMB pan, wheel zoom ----
        const dom = renderer.domElement;
        dom.style.cursor = 'grab';
        dom.style.touchAction = 'none';
        let mode = null, px = 0, py = 0;

        dom.addEventListener('pointerdown', (e) => {
          if (e.button === 0 && !e.shiftKey) mode = 'rotate';
          else if (e.button === 2 || e.button === 1 || (e.button === 0 && e.shiftKey)) mode = 'pan';
          else return;
          px = e.clientX; py = e.clientY;
          try { dom.setPointerCapture(e.pointerId); } catch (err) {}
          dom.style.cursor = mode === 'pan' ? 'move' : 'grabbing';
          e.preventDefault();
        });

        dom.addEventListener('pointermove', (e) => {
          if (!mode) return;
          const dx = e.clientX - px;
          const dy = e.clientY - py;
          px = e.clientX; py = e.clientY;
          const v = this._view;

          if (mode === 'rotate') {
            // Unrestricted turntable rotation (no pitch clamp) – the model can be inspected from any side.
            const qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -dx * 0.008);
            const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -dy * 0.008);
            v.quat.premultiply(qYaw).multiply(qPitch).normalize();
          } else {
            const h = renderer.domElement.clientHeight || 1;
            const worldPerPx = (2 * v.dist * Math.tan((camera.fov * Math.PI / 180) / 2)) / h;
            const right = new THREE.Vector3(1, 0, 0).applyQuaternion(v.quat);
            const up = new THREE.Vector3(0, 1, 0).applyQuaternion(v.quat);
            v.target.addScaledVector(right, -dx * worldPerPx);
            v.target.addScaledVector(up, dy * worldPerPx);
          }
          this.applyView();
        });

        const endDrag = (e) => {
          mode = null;
          dom.style.cursor = 'grab';
          try { dom.releasePointerCapture(e.pointerId); } catch (err) {}
        };
        dom.addEventListener('pointerup', endDrag);
        dom.addEventListener('pointercancel', endDrag);
        dom.addEventListener('contextmenu', e => e.preventDefault());

        dom.addEventListener('wheel', (e) => {
          e.preventDefault();
          const v = this._view;
          const factor = e.deltaY > 0 ? 1.12 : 0.89;
          v.dist = Math.max(v.radius * 0.15, Math.min(v.radius * 25, v.dist * factor));
          this.applyView();
        }, { passive: false });

        // Render only after an explicit invalidation; do not keep a permanent RAF alive.
        this.requestRender();

        if (typeof ResizeObserver !== 'undefined') {
          this._ro = new ResizeObserver(() => {
            if (!this._three) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            if (w < 10 || h < 10) return;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            this.requestRender();
          });
          this._ro.observe(container);
        }
      },

      applyView() {
        const T = this._three;
        if (!T) return;
        const v = this._view;
        const offset = new THREE.Vector3(0, 0, v.dist).applyQuaternion(v.quat);
        T.camera.position.copy(v.target).add(offset);
        T.camera.quaternion.copy(v.quat);
        T.camera.near = Math.max(v.radius * 0.01, 0.0005);
        T.camera.far = Math.max(v.radius * 300, 10);
        T.camera.updateProjectionMatrix();
        this.requestRender();
      },

      // Frames the whole model. Called once on first build and by "Reset view" only.
      frameModel() {
        const T = this._three;
        if (!T) return false;
        T.modelGroup.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(T.modelGroup);
        if (box.isEmpty()) return false;
        const center = box.getCenter(new THREE.Vector3());
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        const radius = Math.max(sphere.radius, 0.001);
        const v = this._view;
        v.target.copy(center);
        v.radius = radius;
        v.dist = (radius / Math.sin((T.camera.fov * Math.PI / 180) / 2)) * 1.1;
        v.quat.setFromEuler(new THREE.Euler(-0.25, Math.PI + 0.6, 0, 'YXZ'));
        this.applyView();
        this._framed = true;
        return true;
      },

      resetView() { this.frameModel(); },

      disposeModel() {
        const T = this._three;
        if (T && T.modelGroup) {
          while (T.modelGroup.children.length) T.modelGroup.remove(T.modelGroup.children[0]);
        }
        const d = this._disposables;
        d.geometries.forEach(g => g.dispose());
        d.materials.forEach(m => m.dispose());
        d.textures.forEach(t => t.dispose());
        this._disposables = { textures: [], materials: [], geometries: [] };
        this._previewMap = null;
      },

      /**
       * Clones Blockbench's actual meshes (world transform + original geometry + original UVs
       * + original material slots) into the preview scene. Nothing is re-mapped or reshaped;
       * only the texture images behind the materials are swapped for preview versions.
       */
      buildModel(selTex, previewCanvas) {
        const T = this._three;
        if (!T) return;
        this.disposeModel();

        const warnings = [];
        const D = this._disposables;

        const textures = Texture.all;
        if (!textures.length) warnings.push(i18n.w_no_textures());

        // Material → Texture lookup (by material identity and by its map)
        const matToTex = new Map();
        textures.forEach(tx => {
          const m = getTextureMaterial(tx);
          if (m) {
            matToTex.set(m, tx);
            const map = getMaterialMap(m);
            if (map) matToTex.set(map, tx);
          }
        });
        const resolveTex = (sm) => {
          if (!sm) return null;
          if (matToTex.has(sm)) return matToTex.get(sm);
          const map = getMaterialMap(sm);
          return (map && matToTex.get(map)) || null;
        };

        // Preview material per texture (selected texture uses the compressed canvas)
        const entries = {};
        const makeMaterial = (map) => {
          const opts = { map, transparent: true, alphaTest: 0.05, side: THREE.DoubleSide };
          return this.shaded ? new THREE.MeshLambertMaterial(opts) : new THREE.MeshBasicMaterial(opts);
        };
        const getEntry = (tx) => {
          if (entries[tx.uuid]) return entries[tx.uuid];
          const isSel = selTex && tx.uuid === selTex.uuid;
          const image = isSel ? previewCanvas : (tx.canvas || tx.img);
          if (!image) return null;

          const ref = getMaterialMap(getTextureMaterial(tx)); // inherit Blockbench's own sampling setup
          const map = new THREE.Texture(image);
          map.magFilter = THREE.NearestFilter;
          map.minFilter = THREE.NearestFilter;
          map.generateMipmaps = false;
          map.wrapS = ref && ref.wrapS ? ref.wrapS : THREE.RepeatWrapping;
          map.wrapT = ref && ref.wrapT ? ref.wrapT : THREE.RepeatWrapping;
          if (ref && typeof ref.flipY === 'boolean') map.flipY = ref.flipY;
          if (THREE.SRGBColorSpace) map.colorSpace = THREE.SRGBColorSpace;

          const frames = tx.frameCount || 1;
          if (ref && frames <= 1) {
            if (ref.offset && map.offset && map.offset.copy) map.offset.copy(ref.offset);
            if (ref.repeat && map.repeat && map.repeat.copy) map.repeat.copy(ref.repeat);
            if (ref.center && map.center && map.center.copy) map.center.copy(ref.center);
            if (typeof ref.rotation === 'number') map.rotation = ref.rotation;
          }
          if (frames > 1) {
            map.repeat.set(1, 1 / frames);
            map.offset.set(0, map.flipY ? 1 - 1 / frames : 0);
            if (isSel) warnings.push(i18n.w_animated());
          }
          map.needsUpdate = true;

          const material = makeMaterial(map);
          D.textures.push(map);
          D.materials.push(material);
          const entry = { map, material, flipY: map.flipY };
          entries[tx.uuid] = entry;
          if (isSel) {
            this._previewMap = map;
          }
          return entry;
        };

        let hiddenMat = null, placeholderMat = null;
        const getHidden = () => {
          if (!hiddenMat) { hiddenMat = new THREE.MeshBasicMaterial({ visible: false }); D.materials.push(hiddenMat); }
          return hiddenMat;
        };
        const getPlaceholder = () => {
          if (!placeholderMat) {
            placeholderMat = new THREE.MeshLambertMaterial({ color: 0x8a919b, side: THREE.DoubleSide });
            D.materials.push(placeholderMat);
          }
          return placeholderMat;
        };

        if (selTex && selTex.channel && selTex.channel !== 'color') warnings.push(i18n.w_channel());

        // ---- clone the real model ----
        const { meshes, skipped } = collectSourceMeshes();
        let resolvedAny = false;
        let usesSelAny = false;
        let degenerateFaces = 0;
        let noUvMeshes = 0;
        const builtMeshes = []; // keep refs so we can force-apply texture later

        meshes.forEach(src => {
          try { src.updateWorldMatrix(true, false); } catch (e) { src.updateMatrixWorld(true); }

          const geo = src.geometry.clone();
          if (!geo.attributes.normal) geo.computeVertexNormals();
          D.geometries.push(geo);

          const srcMats = Array.isArray(src.material) ? src.material : [src.material];
          const outMats = srcMats.map(sm => {
            const tx = resolveTex(sm);
            if (tx) {
              const entry = getEntry(tx);
              if (entry) { resolvedAny = true; return entry.material; }
            }
            if (typeof Canvas !== 'undefined' && sm && sm === Canvas.transparentMaterial) return getHidden();
            return getPlaceholder();
          });

          const a = analyzeUV(geo, srcMats, resolveTex, selTex);
          if (!a.hasUV) noUvMeshes++;
          if (a.usesSel) usesSelAny = true;
          degenerateFaces += a.degenerate;

          const useArray = Array.isArray(src.material) && geo.groups && geo.groups.length > 0;
          const out = new THREE.Mesh(geo, useArray ? outMats : outMats[0]);
          out.matrixAutoUpdate = false;
          out.matrix.copy(src.matrixWorld);
          out.matrixWorldNeedsUpdate = true;
          T.modelGroup.add(out);
          builtMeshes.push(out);
        });

        // If the selected texture is not assigned to any face, still force it onto
        // the whole preview model so the user can see the compression result in 3D.
        if (selTex && previewCanvas && !usesSelAny && builtMeshes.length) {
          const forceEntry = getEntry(selTex);
          if (forceEntry) {
            builtMeshes.forEach(mesh => {
              const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              const newMats = mats.map(m => {
                if (!m || m.visible === false) return m; // keep hidden materials
                return forceEntry.material;
              });
              mesh.material = Array.isArray(mesh.material) ? newMats : newMats[0];
            });
            usesSelAny = true;
            resolvedAny = true;
          }
        }

        // ---- warnings (temporary) ----
        this.modelEmpty = meshes.length === 0;
        if (this.modelEmpty) {
          warnings.push(i18n.w_no_geometry());
        } else {
          if (!resolvedAny) warnings.push(i18n.w_unresolved());
          if (noUvMeshes > 0) warnings.push(i18n.w_no_uv(noUvMeshes));
          if (degenerateFaces > 0) warnings.push(i18n.w_degenerate(degenerateFaces));
        }
        if (skipped > 0) warnings.push(i18n.w_skipped(skipped));
        this.setWarnings(warnings);

        this._modelBuilt = true;
        this._modelUuid = selTex ? selTex.uuid : null;

        // Camera: frame the model only the very first time. Afterwards it is never touched.
        T.modelGroup.updateMatrixWorld(true);
        if (!this._framed && meshes.length) this.frameModel();
        this.requestRender();

      },

      // ---------- actions ----------
      async apply() {
        if (this.actionBusy) return;
        const tex = this.currentTexture();
        if (!tex) {
          Blockbench.showQuickMessage(i18n.no_texture(), 2000);
          return;
        }
        this.actionBusy = true;
        try {
          const result = await processTexture(tex, this.getSettings(), () => this._destroyed);
          if (!result || this._destroyed) return;
          if (!Texture.all.includes(tex) || this.currentTexture() !== tex) {
            throw new Error('The selected texture changed while processing. Please run Apply again.');
          }

          if (typeof tex.edit === 'function') {
            tex.edit((canvas) => {
              const ctx = canvas.getContext('2d');
              if (!ctx) throw new Error('Could not access the texture canvas.');
              if (canvas.width !== result.width || canvas.height !== result.height) {
                canvas.width = result.width;
                canvas.height = result.height;
              }
              ctx.imageSmoothingEnabled = false;
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(result, 0, 0);
            }, { edit_name: 'JPEG Compressor' });
          } else {
            let editStarted = false;
            try {
              Undo.initEdit({ textures: [tex], bitmap: true });
              editStarted = true;
              const dataUrl = result.toDataURL();
              if (typeof tex.fromDataURL === 'function') tex.fromDataURL(dataUrl);
              else if (typeof tex.updateSource === 'function') tex.updateSource(dataUrl);
              else throw new Error('This Blockbench version does not expose a supported texture update API.');
              if (typeof tex.updateChangesAfterEdit === 'function') tex.updateChangesAfterEdit();
            } finally {
              if (editStarted) Undo.finishEdit('JPEG Compressor', { textures: [tex], bitmap: true });
            }
          }
          if (typeof Canvas !== 'undefined') {
            if (Canvas.updateAllFaces) Canvas.updateAllFaces(tex);
            if (Canvas.updateView) Canvas.updateView({ elements: Outliner.elements, element_aspects: { faces: true } });
          }
          Blockbench.showQuickMessage(i18n.applied(), 1800);
          if (this.dialog) this.dialog.hide();
        } catch (err) {
          console.error('[JPEG Compressor] Apply failed:', err);
          if (!this._destroyed) Blockbench.showQuickMessage('Error: ' + (err.message || String(err)), 3500);
        } finally {
          this.actionBusy = false;
        }
      },

      async saveAsNew() {
        if (this.actionBusy) return;
        const tex = this.currentTexture();
        if (!tex) {
          Blockbench.showQuickMessage(i18n.no_texture(), 2000);
          return;
        }
        this.actionBusy = true;
        try {
          const result = await processTexture(tex, this.getSettings(), () => this._destroyed);
          if (!result || this._destroyed) return;
          if (!Texture.all.includes(tex) || this.currentTexture() !== tex) {
            throw new Error('The selected texture changed while processing. Please run Save as new again.');
          }
          const name = `jpeg_${this.level}_${Date.now().toString().slice(-5)}`;
          let editStarted = false;
          let texture = null;
          try {
            Undo.initEdit({ textures: [], selected_texture: true });
            editStarted = true;
            texture = new Texture({ name, width: result.width, height: result.height });
            texture.fromDataURL(result.toDataURL()).add(false).select();
          } finally {
            if (editStarted) Undo.finishEdit('JPEG Compressor (new)', { textures: texture ? [texture] : [], selected_texture: true });
          }
          Blockbench.showQuickMessage(i18n.variant_saved(), 1800);
        } catch (err) {
          console.error('[JPEG Compressor] Save as new failed:', err);
          if (!this._destroyed) Blockbench.showQuickMessage('Error: ' + (err.message || String(err)), 3500);
        } finally {
          this.actionBusy = false;
        }
      }

    },
    template: `
      <div class="jpegf-layout">
        <div class="jpegf-top-controls">
          <div class="jpegf-slider-row">
            <span style="font-weight:600; min-width:90px;">{{ t.strength() }}</span>
            <input type="range" min="1" max="100" step="1" v-model.number="level" :title="t.strength_tooltip()">
            <input type="number" class="jpegf-level-input" min="1" max="100" step="1"
                   :value="level" :title="t.strength_tooltip()"
                   @input="onLevelInput" @change="commitLevelInput">
          </div>
          <div class="jpegf-hint">
            {{ t.strength_hint() }} · <b>{{ levelName }}</b> · {{ qualityInfo }}
            <span class="jpegf-busy" v-show="busy">{{ t.processing() }}</span>
          </div>
          <div class="jpegf-options">
            <label>{{ t.variant() }}
              <select class="jpegf-select-sm" v-model="variant">
                <option value="v1">{{ t.variant_v1() }}</option>
                <option value="v2">{{ t.variant_v2() }}</option>
                <option value="fry">{{ t.variant_fry() }}</option>
              </select>
            </label>
            <label>{{ t.matte() }}
              <select class="jpegf-select-sm" v-model="matte">
                <option value="white">{{ t.matte_white() }}</option>
                <option value="black">{{ t.matte_black() }}</option>
              </select>
            </label>
            <label class="jpegf-check"><input type="checkbox" v-model="keepAlpha"> {{ t.keep_alpha() }}</label>
          </div>
          <div class="jpegf-hint">{{ t.variant_hint(variant) }}</div>
          <select class="jpegf-select" v-model="selectedUuid" :title="t.target_texture()">
            <option v-for="tex in textures" :key="tex.uuid" :value="tex.uuid">{{ tex.name }}</option>
          </select>
        </div>

        <div class="jpegf-previews">
          <div class="jpegf-preview-col">
            <div class="jpegf-preview-label">{{ t.preview_2d() }}</div>
            <div class="jpegf-preview-box"
                 @mousedown="onPreviewMouseDown"
                 @mousemove="onPreviewMouseMove"
                 @mouseup="onPreviewMouseUp"
                 @mouseleave="onPreviewMouseUp"
                 @wheel="onPreviewWheel">
              <div class="jpegf-stack" :style="previewCanvasStyle">
                <canvas ref="preview2d"></canvas>
              </div>
            </div>
            <div class="jpegf-zoom-bar">
              <button class="jpegf-btn" @click="zoomOut">−</button>
              <button class="jpegf-btn" @click="zoomReset">{{ Math.round(previewZoom * 100) }}%</button>
              <button class="jpegf-btn" @click="zoomIn">+</button>
            </div>
          </div>

          <div class="jpegf-preview-col">
            <div class="jpegf-preview-label">{{ t.preview_3d() }}</div>
            <div class="jpegf-warnings" v-show="warnings.length">
              <div class="jpegf-warning" v-for="(w, i) in warnings" :key="i">⚠ {{ w }}</div>
            </div>
            <div class="jpegf-preview-box" ref="preview3dBox">
              <div class="jpegf-empty" v-show="modelEmpty">{{ t.model_empty() }}</div>
            </div>
            <div class="jpegf-zoom-bar">
              <button class="jpegf-btn" @click="resetView">{{ t.reset_view() }}</button>
              <label class="jpegf-check"><input type="checkbox" v-model="shaded"> {{ t.shading() }}</label>
            </div>
          </div>
        </div>

        <div class="jpegf-bottom">
          <button class="jpegf-btn" :disabled="actionBusy" @click="saveAsNew">{{ t.save_as_new() }}</button>
          <div style="display:flex; gap:10px;">
            <button class="jpegf-btn" @click="dialog && dialog.hide()">{{ t.cancel() }}</button>
            <button class="jpegf-btn primary" :disabled="actionBusy" @click="apply">{{ t.apply() }}</button>
          </div>
        </div>
      </div>
    `
  };

  function openJpegDialog() {
    const isNarrow = (typeof window !== 'undefined' && window.innerWidth <= 820);
    const dialog = new Dialog({
      id: PLUGIN_ID + '_dialog',
      title: i18n.title(),
      width: isNarrow ? Math.min(420, (window.innerWidth || 400) - 24) : 920,
      buttons: [],
      component: DialogComponent,
      onConfirm() {}
    });
    dialog.show();
    if (dialog.content_vue) dialog.content_vue.dialog = dialog;
  }

  const PLUGIN_ID = 'jpeg_compressor';

  function reportFailure(where, e) {
    console.error('[JPEG Compressor] ' + where + ' failed:', e);
    try {
      Blockbench.showMessageBox({
        title: 'JPEG Compressor',
        message: where + ': ' + (e && e.message ? e.message : String(e))
      });
    } catch (e2) {}
  }

  function openDialogSafe() {
    try { openJpegDialog(); } catch (e) { reportFailure('open dialog', e); }
  }

  Plugin.register(PLUGIN_ID, {
    title: 'JPEG Compressor',
    author: 'the0dll',
    icon: 'icon.png',
    description: 'JPEG compression (Soft / Standard / Deep-fry) with 2D preview and 3D model preview.',
    version: '1.0.0',
    min_version: '4.8.0',
    creation_date: '2026-10-31',
    variant: 'both',
    tags: ['Texture', 'Paint', 'Tool'],

    onload() {
      if (typeof Blockbench !== 'undefined' && Blockbench.addCSS) {
        pluginStyleTag = Blockbench.addCSS(CSS_STYLES);
      } else {
        pluginStyleTag = document.createElement('style');
        pluginStyleTag.textContent = CSS_STYLES;
        document.head.appendChild(pluginStyleTag);
      }

      jpegAction = new Action(PLUGIN_ID + '_action', {
        name: 'JPEG Compressor',
        description: 'Open JPEG Compressor',
        icon: 'photo_filter',
        click: openDialogSafe
      });
      MenuBar.addAction(jpegAction, 'tools');
      console.log('[JPEG Compressor] loaded');
    },

    onunload() {
      if (pluginStyleTag) {
        if (typeof pluginStyleTag.delete === 'function') pluginStyleTag.delete();
        else if (pluginStyleTag.parentNode) pluginStyleTag.parentNode.removeChild(pluginStyleTag);
      }
      pluginStyleTag = null;

      if (jpegAction) jpegAction.delete();
      jpegAction = null;
    }
  });
})();
