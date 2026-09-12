// Plugin Blockbench: Noise & Composite
// Version 1.0.0

(function () {
  'use strict';

  let noiseCompositeAction;
  let pluginStyleTag = null;

  // ===================== LOCALIZATION =====================
  const isRu = () => (typeof Language !== 'undefined' && Language.code === 'ru');

  const i18n = {
    title: () => isRu() ? 'Шум и Композит' : 'Noise & Composite',
    noise_tab: () => isRu() ? 'Настройки шума' : 'Noise Setup',
    composite_tab: () => isRu() ? 'Режим наложения' : 'Composite Blend',
    monochrome: () => isRu() ? 'Монохромный шум' : 'Monochrome Noise',
    random_values: () => isRu() ? 'Случайные значения' : 'Random Values',
    blend_opacity: () => isRu() ? 'Сила наложения' : 'Blend Opacity',
    target_texture: () => isRu() ? 'Целевая текстура' : 'Target Texture',
    swap_order: () => isRu() ? 'Поменять порядок слоёв' : 'Swap Operation Order',
    swap_hint: () => isRu() ? 'Влияет на режимы, зависящие от порядка' : 'Affects order-dependent modes',
    noise_only: () => isRu() ? 'Только шум' : 'Noise Only',
    noise_only_hint: () => isRu() ? 'Генерировать чистый шум (можно накладывать режимы)' : 'Generate pure noise (blend modes still work)',
    respect_alpha: () => isRu() ? 'Учитывать прозрачность' : 'Respect Alpha',
    respect_alpha_hint: () => isRu() ? 'Не заполнять пустые (прозрачные) области' : 'Keep transparent areas empty',
    custom_size: () => isRu() ? 'Свой размер' : 'Custom size',
    save_variant: () => isRu() ? 'Сохранить как новую текстуру' : 'Save as New Texture',
    presets: () => isRu() ? 'Пресеты' : 'Presets',
    save_preset: () => isRu() ? 'Сохранить пресет' : 'Save Preset',
    load_preset: () => isRu() ? 'Загрузить' : 'Load',
    delete_preset: () => isRu() ? 'Удалить' : 'Delete',
    preset_name: () => isRu() ? 'Имя пресета' : 'Preset name',
    no_texture: () => isRu() ? 'Текстура не выбрана' : 'No texture selected',
    applied: () => isRu() ? 'Шум применён' : 'Noise applied',
    variant_saved: () => isRu() ? 'Вариант сохранён' : 'Variant saved',
    preset_saved: () => isRu() ? 'Пресет сохранён' : 'Preset saved',
    preset_deleted: () => isRu() ? 'Пресет удалён' : 'Preset deleted',
    large_texture: () => isRu() ? 'Текстура очень большая. Продолжить?' : 'Texture is very large. Continue?',
    confirm: () => isRu() ? 'Применить' : 'Confirm',
    cancel: () => isRu() ? 'Отмена' : 'Cancel',
    seed: () => 'Seed',
    period: () => 'Period',
    harmonics: () => 'Harmonics',
    harmonic_spread: () => 'Harmonic Spread',
    harmonic_gain: () => 'Harmonic Gain',
    exponent: () => 'Exponent',
    amplitude: () => 'Amplitude',
    offset: () => 'Offset',
    coord_scale: () => isRu() ? 'Масштаб координат' : 'Coordinate Scale',
    coord_translate: () => isRu() ? 'Смещение координат' : 'Coordinate Translate',
  };

  // ===================== CSS =====================
  const CSS_STYLES = `
    .tdnc-layout-wrapper {
      display: flex;
      flex-direction: row;
      gap: 20px;
      height: 540px;
      width: 100%;
      box-sizing: border-box;
      color: var(--color-text, #e0e0e0);
    }
    .tdnc-left-pane {
      flex: 0 0 45%;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .tdnc-right-pane {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      padding-right: 8px;
    }
    .tdnc-right-pane::-webkit-scrollbar { width: 6px; }
    .tdnc-right-pane::-webkit-scrollbar-track { background: #14171c; border-radius: 3px; }
    .tdnc-right-pane::-webkit-scrollbar-thumb { background: #282f38; border-radius: 3px; }
    .tdnc-right-pane::-webkit-scrollbar-thumb:hover { background: var(--color-accent, #38e68b); }

    .tdnc-preview-box {
      width: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #1a1e24;
      background-image: 
        linear-gradient(45deg, #13171b 25%, transparent 25%), 
        linear-gradient(-45deg, #13171b 25%, transparent 25%), 
        linear-gradient(45deg, transparent 75%, #13171b 75%), 
        linear-gradient(-45deg, transparent 75%, #13171b 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
      border: 1px solid #111417;
      border-radius: 4px;
      box-shadow: inset 0 2px 8px rgba(0,0,0,0.5);
      overflow: hidden;
      position: relative;
      user-select: none;
    }
    .tdnc-preview-box canvas {
      image-rendering: pixelated !important;
      image-rendering: crisp-edges !important;
    }
    .tdnc-nav {
      display: flex;
      border-bottom: 2px solid #282d34;
      margin-bottom: 16px;
      flex-shrink: 0;
    }
    .tdnc-nav-btn {
      flex: 1;
      text-align: center;
      padding: 10px 0;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      color: #8a929a;
      user-select: none;
      transition: all 0.15s ease;
    }
    .tdnc-nav-btn:hover { color: #ffffff; }
    .tdnc-nav-btn.active {
      color: #ffffff;
      border-bottom: 3px solid var(--color-accent, #38e68b);
      margin-bottom: -2px;
    }
    .tdnc-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px 32px;
      margin-bottom: 12px;
    }
    .tdnc-card {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .tdnc-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .tdnc-title {
      font-size: 14px;
      font-weight: 500;
      color: #dbe0e6;
    }
    .tdnc-reset {
      background: none;
      border: none;
      color: #666f7a;
      cursor: pointer;
      font-size: 14px;
      padding: 2px 4px;
    }
    .tdnc-reset:hover { color: var(--color-accent, #38e68b); }
    .tdnc-random-btn, .tdnc-action-btn {
      background: #14171c;
      border: 1px solid #282f38;
      border-radius: 3px;
      color: #dbe0e6;
      cursor: pointer;
      font-size: 13px;
      padding: 6px 10px;
      transition: all 0.15s ease;
    }
    .tdnc-random-btn:hover, .tdnc-action-btn:hover {
      border-color: var(--color-accent, #38e68b);
      color: #ffffff;
    }
    .tdnc-noise-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      grid-column: 1 / -1;
      gap: 12px;
      margin-bottom: 2px;
      flex-wrap: wrap;
    }
    .tdnc-subtitle {
      font-size: 11px;
      color: #727a85;
    }
    .tdnc-controls-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 2px;
    }
    .tdnc-controls-row input[type="range"] {
      flex: 1;
      height: 20px;
      cursor: pointer;
      accent-color: var(--color-accent, #38e68b);
    }
    .tdnc-num-box {
      display: flex;
      align-items: center;
      background: #14171c;
      border: 1px solid #282f38;
      border-radius: 3px;
      padding: 2px 6px;
      height: 26px;
      box-sizing: border-box;
    }
    .tdnc-num-box input[type="number"] {
      width: 48px;
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 14px;
      font-weight: 500;
      text-align: right;
      padding: 0;
      outline: none;
      -moz-appearance: textfield;
    }
    .tdnc-num-box input[type="number"]::-webkit-inner-spin-button,
    .tdnc-num-box input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .tdnc-arrows {
      font-size: 10px;
      color: #666f7a;
      margin-left: 4px;
      user-select: none;
      letter-spacing: -2px;
    }
    .tdnc-select {
      width: 100%;
      height: 32px;
      background: #14171c;
      color: #ffffff;
      border: 1px solid #282f38;
      border-radius: 3px;
      font-size: 14px;
      padding: 4px 8px;
      outline: none;
    }
    .tdnc-bottom-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #22272e;
      padding-top: 12px;
      margin-top: 6px;
      gap: 10px;
      flex-wrap: wrap;
      flex-shrink: 0;
    }
    .tdnc-checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      cursor: pointer;
      user-select: none;
    }
    .tdnc-checkbox input {
      width: 16px;
      height: 16px;
      accent-color: var(--color-accent, #38e68b);
    }
    .tdnc-vector-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-top: 4px;
    }
    .tdnc-vector-row label {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #727a85;
      font-size: 12px;
    }
    .tdnc-vector-row input {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      background: #14171c;
      border: 1px solid #282f38;
      border-radius: 3px;
      color: #fff;
      padding: 5px;
    }
    .tdnc-preset-row {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-top: 6px;
    }
    .tdnc-preset-row input[type="text"] {
      flex: 1;
      background: #14171c;
      border: 1px solid #282f38;
      border-radius: 3px;
      color: #fff;
      padding: 6px 8px;
      font-size: 13px;
    }
  `;

  // ===================== NOISE =====================
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seedToUint32(seed) {
    const value = Number.isFinite(Number(seed)) ? Number(seed) : 1;
    const text = String(value);
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function createSimplex3D(seed) {
    const rand = mulberry32(seedToUint32(seed));
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
    }
    const perm = new Uint8Array(512);
    const permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
      perm[i] = p[i & 255];
      permMod12[i] = perm[i] % 12;
    }
    const grad3 = [
      [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
      [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
      [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ];

    return function (xin, yin, zin) {
      let n0, n1, n2, n3;
      const F3 = 1.0 / 3.0;
      const s = (xin + yin + zin) * F3;
      const i = Math.floor(xin + s);
      const j = Math.floor(yin + s);
      const k = Math.floor(zin + s);
      const G3 = 1.0 / 6.0;
      const t = (i + j + k) * G3;
      const x0 = xin - (i - t);
      const y0 = yin - (j - t);
      const z0 = zin - (k - t);

      let i1, j1, k1, i2, j2, k2;
      if (x0 >= y0) {
        if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
        else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
        else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
      } else {
        if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
        else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
        else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      }

      const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
      const x2 = x0 - i2 + 2.0 * G3, y2 = y0 - j2 + 2.0 * G3, z2 = z0 - k2 + 2.0 * G3;
      const x3 = x0 - 1.0 + 3.0 * G3, y3 = y0 - 1.0 + 3.0 * G3, z3 = z0 - 1.0 + 3.0 * G3;

      const ii = i & 255, jj = j & 255, kk = k & 255;
      const gi0 = permMod12[ii + perm[jj + perm[kk]]];
      const gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]];
      const gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]];
      const gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]];

      let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
      if (t0 < 0) n0 = 0.0; else { t0 *= t0; n0 = t0 * t0 * (grad3[gi0][0] * x0 + grad3[gi0][1] * y0 + grad3[gi0][2] * z0); }
      let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
      if (t1 < 0) n1 = 0.0; else { t1 *= t1; n1 = t1 * t1 * (grad3[gi1][0] * x1 + grad3[gi1][1] * y1 + grad3[gi1][2] * z1); }
      let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
      if (t2 < 0) n2 = 0.0; else { t2 *= t2; n2 = t2 * t2 * (grad3[gi2][0] * x2 + grad3[gi2][1] * y2 + grad3[gi2][2] * z2); }
      let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
      if (t3 < 0) n3 = 0.0; else { t3 *= t3; n3 = t3 * t3 * (grad3[gi3][0] * x3 + grad3[gi3][1] * y3 + grad3[gi3][2] * z3); }

      return 32.0 * (n0 + n1 + n2 + n3);
    };
  }

  function fbm3D(simplex3, x, y, z, period, harmonics, spread, gain, exponent) {
    const baseFreq = 1 / Math.max(period, 0.0001);
    let freq = baseFreq;
    let amp = 1;
    let sum = 0;
    let maxAmp = 0;
    const octaves = Math.max(0, Math.floor(harmonics)) + 1;
    for (let o = 0; o < octaves; o++) {
      sum += simplex3(x * freq, y * freq, z * freq) * amp;
      maxAmp += amp;
      freq *= Math.max(spread, 0.0001);
      amp *= gain;
    }
    let n = maxAmp > 0 ? sum / maxAmp : 0;
    const sign = n < 0 ? -1 : 1;
    return sign * Math.pow(Math.abs(n), Math.max(exponent, 0.0001));
  }

  function safeClamp01(v) {
    if (!Number.isFinite(v) || Number.isNaN(v)) return 0;
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  const simplexCache = {
    seed: null,
    monochrome: null,
    r: null,
    g: null,
    b: null
  };

  function generateNoiseImageData(baseImageData, params, noiseOnly = false, respectAlpha = false) {
    const width = baseImageData.width;
    const height = baseImageData.height;
    const outData = new ImageData(width, height);

    if (simplexCache.seed !== params.seed || simplexCache.monochrome !== params.monochrome) {
      simplexCache.seed = params.seed;
      simplexCache.monochrome = params.monochrome;
      simplexCache.r = createSimplex3D(params.seed);
      simplexCache.g = params.monochrome ? simplexCache.r : createSimplex3D(params.seed + 1000);
      simplexCache.b = params.monochrome ? simplexCache.r : createSimplex3D(params.seed + 2000);
    }

    const simplexR = simplexCache.r;
    const simplexG = simplexCache.g;
    const simplexB = simplexCache.b;

    const checkAlpha = !noiseOnly || respectAlpha;
    const invWidth = 1 / width;
    const invHeight = 1 / height;
    const inv255 = 1.0 / 255.0; 

    let px = 0;
    let py = 0;

    for (let i = 0; i < baseImageData.data.length; i += 4) {
      const srcAlpha = baseImageData.data[i + 3];

      if (checkAlpha && srcAlpha === 0) {
        outData.data[i + 3] = 0;
        if (++px === width) { px = 0; py++; }
        continue;
      }

      let x, y, z;
      if (noiseOnly) {
        x = px * invWidth * params.scale_x + params.translate_x;
        y = py * invHeight * params.scale_y + params.translate_y;
        z = params.translate_z;
      } else {
        x = (baseImageData.data[i] * inv255) * params.scale_x + params.translate_x;
        y = (baseImageData.data[i + 1] * inv255) * params.scale_y + params.translate_y;
        z = (baseImageData.data[i + 2] * inv255) * params.scale_z + params.translate_z;
      }

      const r_noise = fbm3D(simplexR, x, y, z, params.period, params.harmonics, params.harmonic_spread, params.harmonic_gain, params.exponent);

      let finalR, finalG, finalB;
      if (params.monochrome) {
        finalR = finalG = finalB = safeClamp01(r_noise * params.amplitude + params.offset);
      } else {
        const g_noise = fbm3D(simplexG, x, y, z, params.period, params.harmonics, params.harmonic_spread, params.harmonic_gain, params.exponent);
        const b_noise = fbm3D(simplexB, x, y, z, params.period, params.harmonics, params.harmonic_spread, params.harmonic_gain, params.exponent);
        finalR = safeClamp01(r_noise * params.amplitude + params.offset);
        finalG = safeClamp01(g_noise * params.amplitude + params.offset);
        finalB = safeClamp01(b_noise * params.amplitude + params.offset);
      }

      outData.data[i] = finalR * 255;
      outData.data[i + 1] = finalG * 255;
      outData.data[i + 2] = finalB * 255;
      outData.data[i + 3] = noiseOnly ? 255 : srcAlpha;

      if (++px === width) { px = 0; py++; }
    }
    return outData;
  }

  // ===================== BLEND =====================
  const NATIVE_BLEND_MODES = Object.freeze({
    over: true, add: true, multiply: true, screen: true, overlay: true,
    color_dodge: true, color_burn: true, hard_light: true, soft_light: true,
    difference: true, exclusion: true, hue: true, color: true, luminosity: true, saturation: true
  });

  function vividLightChannel(A, B) {
    if (B < 0.5) {
      const denominator = 2 * B;
      return denominator === 0 ? 0 : 1 - (1 - A) / denominator;
    }
    const denominator = 2 * (1 - B);
    return denominator === 0 ? (A === 0 ? 0 : 1) : A / denominator;
  }

  const CUSTOM_CHANNEL_FORMULAS = {
    atop: (A, B, Aa, Ba) => A * Ba + B * (1 - Aa),
    average: (A, B) => (A + B) / 2,
    brightest: (A, B) => Math.max(A, B),
    dimmest: (A, B) => Math.min(A, B),
    divide: (A, B) => (B === 0 ? (A === 0 ? 0 : 1) : A / B),
    subtract: (A, B) => A - B,
    subtractive: (A, B) => A + B - 1,
    pinlight: (A, B) => (B < 0.5 ? Math.min(A, 2 * B) : Math.max(A, 2 * B - 1)),
    vivid_light: vividLightChannel,
    linear_light: (A, B) => A + 2 * B - 1,
    hard_mix: (A, B) => (A + B < 1 ? 0 : 1),
    glow: (A, B) => {
      const denominator = 1 - A;
      return denominator === 0 ? (B === 0 ? 0 : 1) : (B * B) / denominator;
    },
    freeze: (A, B) => {
      if (B === 0) return 0;
      const inverseA = 1 - A;
      return 1 - (inverseA * inverseA) / B;
    },
    heat: (A, B) => {
      if (A === 0) return 0;
      const inverseB = 1 - B;
      return 1 - (inverseB * inverseB) / A;
    },
    reflect: (A, B) => {
      const denominator = 1 - B;
      return denominator === 0 ? (A === 0 ? 0 : 1) : (A * A) / denominator;
    },
    negate: (A, B) => 1 - Math.abs(1 - A - B),
    maximum: (A, B) => Math.max(A, B),
    minimum: (A, B) => Math.min(A, B),
    inside: (A, B, Aa, Ba) => A * Ba,
    outside: (A, B, Aa, Ba) => A * (1 - Ba)
  };

  function clampColor(color) {
    return [safeClamp01(color[0]), safeClamp01(color[1]), safeClamp01(color[2])];
  }

  function getBlendLuminance(color) {
    return 0.3 * color[0] + 0.59 * color[1] + 0.11 * color[2];
  }

  function clipColor(color) {
    const result = color.slice();
    const luminance = getBlendLuminance(result);
    const minimum = Math.min(result[0], result[1], result[2]);
    const maximum = Math.max(result[0], result[1], result[2]);
    if (minimum < 0) {
      const denominator = luminance - minimum;
      if (denominator !== 0) {
        for (let i = 0; i < 3; i++) {
          result[i] = luminance + (result[i] - luminance) * luminance / denominator;
        }
      }
    }
    if (maximum > 1) {
      const denominator = maximum - luminance;
      if (denominator !== 0) {
        for (let i = 0; i < 3; i++) {
          result[i] = luminance + (result[i] - luminance) * (1 - luminance) / denominator;
        }
      }
    }
    return clampColor(result);
  }

  function setLum(color, luminance) {
    const delta = luminance - getBlendLuminance(color);
    return clipColor(color.map(channel => channel + delta));
  }

  function getSaturation(color) {
    return Math.max(color[0], color[1], color[2]) - Math.min(color[0], color[1], color[2]);
  }

  function setSat(color, saturation) {
    const order = [0, 1, 2].sort((a, b) => color[a] - color[b]);
    const minimumIndex = order[0];
    const middleIndex = order[1];
    const maximumIndex = order[2];
    const minimum = color[minimumIndex];
    const maximum = color[maximumIndex];
    const result = [0, 0, 0];
    if (maximum > minimum) {
      result[middleIndex] = (color[middleIndex] - minimum) * saturation / (maximum - minimum);
      result[maximumIndex] = saturation;
    }
    return clampColor(result);
  }

  function blendSoftLight(backdrop, source) {
    if (source <= 0.5) {
      return backdrop - (1 - 2 * source) * backdrop * (1 - backdrop);
    }
    const d = backdrop <= 0.25
      ? ((16 * backdrop - 12) * backdrop + 4) * backdrop
      : Math.sqrt(backdrop);
    return backdrop + (2 * source - 1) * (d - backdrop);
  }

  function blendNativeColor(backdrop, source, operation) {
    if (operation === 'hue') {
      return setLum(setSat(source, getSaturation(backdrop)), getBlendLuminance(backdrop));
    }
    if (operation === 'saturation') {
      return setLum(setSat(backdrop, getSaturation(source)), getBlendLuminance(backdrop));
    }
    if (operation === 'color') {
      return setLum(source, getBlendLuminance(backdrop));
    }
    if (operation === 'luminosity') {
      return setLum(backdrop, getBlendLuminance(source));
    }

    const result = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      const Cb = backdrop[i];
      const Cs = source[i];
      switch (operation) {
        case 'over': result[i] = Cs; break;
        case 'add': result[i] = Cb + Cs; break;
        case 'multiply': result[i] = Cb * Cs; break;
        case 'screen': result[i] = Cb + Cs - Cb * Cs; break;
        case 'overlay': result[i] = Cb <= 0.5 ? 2 * Cb * Cs : 1 - 2 * (1 - Cb) * (1 - Cs); break;
        case 'color_dodge': result[i] = Cs >= 1 ? 1 : Math.min(1, Cb / (1 - Cs)); break;
        case 'color_burn': result[i] = Cs <= 0 ? 0 : 1 - Math.min(1, (1 - Cb) / Cs); break;
        case 'hard_light': result[i] = Cs <= 0.5 ? 2 * Cb * Cs : 1 - 2 * (1 - Cb) * (1 - Cs); break;
        case 'soft_light': result[i] = blendSoftLight(Cb, Cs); break;
        case 'difference': result[i] = Math.abs(Cb - Cs); break;
        case 'exclusion': result[i] = Cb + Cs - 2 * Cb * Cs; break;
        default: result[i] = Cb;
      }
    }
    return clampColor(result);
  }

  function compositeNativePixel(backdrop, source, backdropAlpha, sourceAlpha, operation) {
    const blended = blendNativeColor(backdrop, source, operation);
    const outputAlpha = sourceAlpha + backdropAlpha * (1 - sourceAlpha);
    if (outputAlpha === 0) return [0, 0, 0];
    const result = [];
    for (let i = 0; i < 3; i++) {
      const premultiplied = sourceAlpha * (1 - backdropAlpha) * source[i]
        + sourceAlpha * backdropAlpha * blended[i]
        + (1 - sourceAlpha) * backdropAlpha * backdrop[i];
      result[i] = premultiplied / outputAlpha;
    }
    return clampColor(result);
  }

  function blendImageData(baseImageData, topImageData, operation, swap, opacity = 1.0) {
    const width = baseImageData.width;
    const height = baseImageData.height;

    if (operation === 'none') return topImageData;

    let layerA = baseImageData;
    let layerB = topImageData;
    if (swap) {
      layerA = topImageData;
      layerB = baseImageData;
    }

    const aData = layerA.data;
    const bData = layerB.data;
    const origAlphaData = swap ? bData : aData;
    const outImageData = new ImageData(width, height);
    const out = outImageData.data;

    const customFormula = CUSTOM_CHANNEL_FORMULAS[operation];
    const inv255 = 1.0 / 255.0; 

    const A = [0, 0, 0];
    const B = [0, 0, 0];

    for (let i = 0; i < aData.length; i += 4) {
      const originalAlpha = origAlphaData[i + 3];
      if (originalAlpha === 0) {
        out[i + 3] = 0;
        continue;
      }

      A[0] = aData[i] * inv255;
      A[1] = aData[i + 1] * inv255;
      A[2] = aData[i + 2] * inv255;
      const Aa = aData[i + 3] * inv255;

      B[0] = bData[i] * inv255;
      B[1] = bData[i + 1] * inv255;
      B[2] = bData[i + 2] * inv255;
      const Ba = bData[i + 3] * inv255;

      const origColor = swap ? B : A;
      const noiseColor = swap ? A : B;

      let result;

      if (operation === 'none') {
        result = [noiseColor[0], noiseColor[1], noiseColor[2]];
      } else if (NATIVE_BLEND_MODES[operation]) {
        result = compositeNativePixel(A, B, Aa, Ba, operation);
      } else if (operation === 'stencil_luminance') {
        const lumB = getBlendLuminance(B);
        result = [A[0] * lumB, A[1] * lumB, A[2] * lumB];
      } else if (operation === 'lighter_color' || operation === 'darker_color') {
        const lumA = getBlendLuminance(A);
        const lumB = getBlendLuminance(B);
        const takeA = operation === 'lighter_color' ? lumA > lumB : lumA < lumB;
        const src = takeA ? A : B;
        result = [src[0], src[1], src[2]];
      } else if (customFormula) {
        result = [
          customFormula(A[0], B[0], Aa, Ba),
          customFormula(A[1], B[1], Aa, Ba),
          customFormula(A[2], B[2], Aa, Ba)
        ];
      } else {
        result = [A[0], A[1], A[2]]; 
      }

      if (opacity !== 1.0) {
        result[0] = origColor[0] * (1 - opacity) + result[0] * opacity;
        result[1] = origColor[1] * (1 - opacity) + result[1] * opacity;
        result[2] = origColor[2] * (1 - opacity) + result[2] * opacity;
      }

      out[i] = Math.round(safeClamp01(result[0]) * 255);
      out[i + 1] = Math.round(safeClamp01(result[1]) * 255);
      out[i + 2] = Math.round(safeClamp01(result[2]) * 255);
      out[i + 3] = originalAlpha;
    }

    return outImageData;
  }

  // ===================== PRESETS =====================
  const PRESETS_KEY = 'noise_composite_presets_v2';

  function loadPresets() {
    try {
      const raw = localStorage.getItem(PRESETS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function savePresets(list) {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(list));
  }

  // ===================== UI =====================
  function sanitizeNumber(raw, defaultValue, isInt, allowNegative) {
    let n = parseFloat(raw);
    if (isNaN(n)) n = defaultValue;
    if (!allowNegative && n < 0) n = 0;
    if (isInt) n = Math.round(n);
    return n;
  }

  const DialogComponent = {
    data() {
      return {
        activeTab: 'noise',
        seed: 1,
        period: 1.0,
        harmonics: 2,
        harmonic_spread: 2.0,
        harmonic_gain: 0.7,
        exponent: 1.0,
        amplitude: 0.5,
        offset: 0.5,
        scale_x: 1.0,
        scale_y: 1.0,
        scale_z: 1.0,
        translate_x: 0.0,
        translate_y: 0.0,
        translate_z: 0.0,
        monochrome: true,
        operation: 'none',
        swap_order: false,
        blend_opacity: 1.0,
        noise_only: false,
        respect_alpha: false,
        custom_size: false,
        custom_width: 512,
        custom_height: 512,
        size_warning_accepted: false,
        textures: [],
        selectedTextureUuid: null,
        texWidth: 64,
        texHeight: 64,
        presets: loadPresets(),
        newPresetName: '',
        previewZoom: 1.0,
        panX: 0,
        panY: 0,
        isPanning: false,
        lastMouseX: 0,
        lastMouseY: 0
      };
    },
    created() {
      // Initializing the flag for Throttling renderer
      this._renderPending = false;
      this._debounceTimer = null;
      this._baseCache = { key: null, imageData: null };
    },
    beforeDestroy() {
      if (this._debounceTimer) clearTimeout(this._debounceTimer);
    },
    computed: {
      noiseParams() {
        return {
          seed: this.seed,
          period: this.period,
          harmonics: this.harmonics,
          harmonic_spread: this.harmonic_spread,
          harmonic_gain: this.harmonic_gain,
          exponent: this.exponent,
          amplitude: this.amplitude,
          offset: this.offset,
          scale_x: this.scale_x,
          scale_y: this.scale_y,
          scale_z: this.scale_z,
          translate_x: this.translate_x,
          translate_y: this.translate_y,
          translate_z: this.translate_z,
          monochrome: this.monochrome
        };
      },
      t() { return i18n; },
      // ===== Frame for texture size =====
      previewCanvasStyle() {
        const size = this.getOutputSize();
        const maxSize = 400;

        let displayW, displayH;
        if (size.width >= size.height) {
          displayW = maxSize;
          displayH = Math.round(maxSize * (size.height / size.width));
        } else {
          displayH = maxSize;
          displayW = Math.round(maxSize * (size.width / size.height));
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
          border: '1px solid rgba(255,255,255,0.06)'
        };
      }
    },
    watch: {
      noiseParams: { deep: true, handler() { this.queueRender(); } },
      operation() { this.queueRender(); },
      swap_order() { this.queueRender(); },
      blend_opacity() { this.queueRender(); },
      noise_only() { this.queueRender(); },
      respect_alpha() { this.queueRender(); },
      custom_size() { this.queueRender(); },
      custom_width(newVal, oldVal) { this.checkCustomSizeLimit(newVal, oldVal, 'custom_width'); },
      custom_height(newVal, oldVal) { this.checkCustomSizeLimit(newVal, oldVal, 'custom_height'); },
      selectedTextureUuid() { this.updateTextureDims(); this.queueRender(); }
    },
    methods: {
      checkCustomSizeLimit(newVal, oldVal, field) {
        if (this.custom_width <= 2000 && this.custom_height <= 2000) {
          this.size_warning_accepted = false;
        }
        
        if (newVal > 2000 && !this.size_warning_accepted) {
          const msg = (typeof Language !== 'undefined' && Language.code === 'ru') 
            ? 'Внимание! Разрешение больше 2000px может вызвать зависание программы. Вы уверены, что хотите отрендерить такой размер?' 
            : 'Warning! Resolution above 2000px may freeze the program. Are you sure you want to render this size?';
          
          if (confirm(msg)) {
            this.size_warning_accepted = true;
            this.queueRender();
          } else {
            this[field] = (oldVal && oldVal <= 2000) ? oldVal : 2000;
          }
        } else {
          this.queueRender();
        }
      },

      onNumberChange(field, defaultValue, isInt, event, allowNegative) {
        this[field] = sanitizeNumber(event.target.value, defaultValue, isInt, allowNegative);
      },
      randomizeNoise() {
        const random = (min, max) => min + Math.random() * (max - min);
        const randomInt = (min, max) => Math.floor(random(min, max + 1));
        this.seed = randomInt(0, 99999);
        this.period = 1 / random(0.5, 8.0);
        this.harmonics = randomInt(0, 5);
        this.harmonic_spread = random(1.5, 3.0);
        this.harmonic_gain = random(0.3, 0.8);
        this.exponent = random(0.5, 3.0);
        this.amplitude = random(0.25, 1.0);
        this.offset = random(0.0, 1.0);
        this.scale_x = random(0.5, 8.0);
        this.scale_y = random(0.5, 8.0);
        this.scale_z = random(0.5, 8.0);
        this.translate_x = random(-1.0, 1.0);
        this.translate_y = random(-1.0, 1.0);
        this.translate_z = random(-1.0, 1.0);
        this.$nextTick(() => this.queueRender());
      },
      resetField(field, value) {
        this[field] = value;
      },
      getSelectedTexture() {
        return Texture.all.find(t => t.uuid === this.selectedTextureUuid) || null;
      },
      updateTextureDims() {
        const tex = this.getSelectedTexture();
        if (tex && tex.img && tex.img.naturalWidth) {
          this.texWidth = tex.img.naturalWidth;
          this.texHeight = tex.img.naturalHeight;
        } else if (tex) {
          this.texWidth = tex.width || 64;
          this.texHeight = tex.height || 64;
        } else {
          this.texWidth = 64;
          this.texHeight = 64;
        }
      },
      getOutputSize() {
        if (this.noise_only && this.custom_size) {
          return {
            width: Math.max(1, Math.min(4096, Math.round(this.custom_width) || 512)),
            height: Math.max(1, Math.min(4096, Math.round(this.custom_height) || 512))
          };
        }
        return {
          width: this.texWidth || 64,
          height: this.texHeight || 64
        };
      },
      zoomIn() {
        this.previewZoom = Math.min(6, +(this.previewZoom + 0.25).toFixed(2));
      },
      zoomOut() {
        this.previewZoom = Math.max(0.25, +(this.previewZoom - 0.25).toFixed(2));
      },
      zoomReset() {
        this.previewZoom = 1.0;
        this.panX = 0;
        this.panY = 0;
      },
      onPreviewMouseDown(e) {
        if (this.previewZoom <= 1) return;
        this.isPanning = true;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        e.preventDefault();
      },
      onPreviewMouseMove(e) {
        if (!this.isPanning) return;
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        this.panX += dx;
        this.panY += dy;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      },
      onPreviewMouseUp() {
        this.isPanning = false;
      },
      onPreviewWheel(e) {
        if (!e.ctrlKey) return;
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY > 0 ? -0.25 : 0.25;
        const next = +(this.previewZoom + delta).toFixed(2);
        this.previewZoom = Math.max(0.25, Math.min(6, next));
      },

      getBaseImageData(tex, hasTexImg, width, height) {
        const key = `${tex ? tex.uuid : 'none'}_${width}x${height}_${this.noise_only}_${this.respect_alpha}`;
        const cache = this._baseCache;
        if (cache.key === key && cache.imageData) return cache.imageData;

        const baseCanvas = document.createElement('canvas');
        baseCanvas.width = width;
        baseCanvas.height = height;
        const baseCtx = baseCanvas.getContext('2d');
        baseCtx.imageSmoothingEnabled = false;

        // ===== Respect Alpha =====
        if (hasTexImg && (!this.noise_only || this.respect_alpha)) {
          baseCtx.drawImage(tex.img, 0, 0, width, height);
        } else if (this.noise_only) {
          baseCtx.fillStyle = '#808080';
          baseCtx.fillRect(0, 0, width, height);
        }

        const imageData = baseCtx.getImageData(0, 0, width, height);
        cache.key = key;
        cache.imageData = imageData;
        return imageData;
      },

      buildComposite(width, height, options = {}) {
        const skipConfirm = !!options.skipConfirm;
        const MAX_SAFE_PIXELS = 1024 * 1024;
        if (!skipConfirm && width * height > MAX_SAFE_PIXELS) {
          if (!confirm(i18n.large_texture() + ` (${width}×${height})`)) {
            return null;
          }
        }

        const tex = this.getSelectedTexture();
        const hasTexImg = !!(tex && tex.img);
        const baseImageData = this.getBaseImageData(tex, hasTexImg, width, height);

        const noiseImageData = generateNoiseImageData(
          baseImageData,
          this.noiseParams,
          this.noise_only,
          this.respect_alpha
        );

        let safeOpacity = this.blend_opacity;
        if (this.operation !== 'none' && safeOpacity === 0) {
          safeOpacity = 0.0001;
        }

        const resultImageData = this.operation === 'none'
          ? noiseImageData
          : blendImageData(baseImageData, noiseImageData, this.operation, this.swap_order, safeOpacity);

        const outCanvas = document.createElement('canvas');
        outCanvas.width = width;
        outCanvas.height = height;
        outCanvas.getContext('2d').putImageData(resultImageData, 0, 0);
        return outCanvas;
      },


      queueRender() {
        if (!this._renderPending) {
          this._renderPending = true;
          requestAnimationFrame(() => {
            this._renderPending = false;
            this.performRender(false);
          });
        }

        if (this._debounceTimer) clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
          this.performRender(true);
        }, 150);
      },

      performRender(highQuality) {
        const canvas = this.$refs.previewCanvas;
        if (!canvas) return;

        this.updateTextureDims();
        const size = this.getOutputSize();

        if (canvas.width !== size.width || canvas.height !== size.height) {
          canvas.width = size.width;
          canvas.height = size.height;
        }

        const PREVIEW_MAX_DIM = 128;
        let renderW = size.width;
        let renderH = size.height;
        if (!highQuality && (size.width > PREVIEW_MAX_DIM || size.height > PREVIEW_MAX_DIM)) {
          const scale = PREVIEW_MAX_DIM / Math.max(size.width, size.height);
          renderW = Math.max(1, Math.round(size.width * scale));
          renderH = Math.max(1, Math.round(size.height * scale));
        }

        const result = this.buildComposite(renderW, renderH, { skipConfirm: true });
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(result, 0, 0, renderW, renderH, 0, 0, size.width, size.height);
      },
      applyToTexture() {
        try {
          if (this.noise_only && this.operation === 'none') {
            this.saveAsNewTexture();
            if (this.dialog) this.dialog.hide();
            return;
          }

          const tex = this.getSelectedTexture();
          if (!tex) {
            Blockbench.showQuickMessage(i18n.no_texture(), 2000);
            return;
          }

          const width = tex.img ? (tex.img.naturalWidth || tex.width) : this.texWidth;
          const height = tex.img ? (tex.img.naturalHeight || tex.height) : this.texHeight;
          const resultCanvas = this.buildComposite(width, height);
          if (!resultCanvas) return; 

          if (typeof tex.edit === 'function') {
            tex.edit((canvas) => {
              const ctx = canvas.getContext('2d');
              if (canvas.width !== resultCanvas.width || canvas.height !== resultCanvas.height) {
                canvas.width = resultCanvas.width;
                canvas.height = resultCanvas.height;
              }
              ctx.imageSmoothingEnabled = false;
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(resultCanvas, 0, 0);
            }, {
              edit_name: 'TD Noise & Composite'
            });
          } else {
            Undo.initEdit({ textures: [tex], bitmap: true });
            if (typeof tex.fromCanvas === 'function') {
              tex.fromCanvas(resultCanvas);
            } else if (typeof tex.updateSource === 'function') {
              tex.updateSource(resultCanvas.toDataURL());
            } else if (typeof tex.fromDataURL === 'function') {
              tex.fromDataURL(resultCanvas.toDataURL());
            }
            if (typeof tex.updateChangesAfterEdit === 'function') {
              tex.updateChangesAfterEdit();
            }
            Undo.finishEdit('TD Noise & Composite', { textures: [tex], bitmap: true });
          }

          if (typeof Canvas !== 'undefined') {
            if (typeof Canvas.forceUpdate === 'function') Canvas.forceUpdate();
            else if (typeof Canvas.updateAllMaterials === 'function') Canvas.updateAllMaterials();
          }

          Blockbench.showQuickMessage(i18n.applied(), 2000);
          if (this.dialog) this.dialog.hide();
        } catch (err) {
          if (Undo && typeof Undo.cancelEdit === 'function') {
            try { Undo.cancelEdit(); } catch (e) { }
          }
          alert('Error: ' + err.message);
        }
      },
      saveAsNewTexture() {
        try {
          const size = this.getOutputSize();
          const resultCanvas = this.buildComposite(size.width, size.height);
          if (!resultCanvas) return; 

          const name = this.noise_only
            ? `noise_${this.seed}`
            : `variant_${Date.now().toString().slice(-6)}`;

          Undo.initEdit({ textures: [], selected_texture: true });

          const texture = new Texture({
            name: name,
            width: size.width,
            height: size.height
          });

          texture.fromDataURL(resultCanvas.toDataURL()).add(false).select();

          Undo.finishEdit('TD Noise & Composite (new texture)', {
            textures: [texture],
            selected_texture: true
          });

          Blockbench.showQuickMessage(i18n.variant_saved(), 2000);
        } catch (err) {
          if (Undo && typeof Undo.cancelEdit === 'function') {
            try { Undo.cancelEdit(); } catch (e) { }
          }
          alert('Error: ' + err.message);
        }
      },
      saveCurrentPreset() {
        const name = (this.newPresetName || '').trim();
        if (!name) {
          Blockbench.showQuickMessage(isRu() ? 'Введите имя пресета' : 'Enter preset name', 2000);
          return;
        }

        const preset = {
          name,
          data: {
            seed: this.seed,
            period: this.period,
            harmonics: this.harmonics,
            harmonic_spread: this.harmonic_spread,
            harmonic_gain: this.harmonic_gain,
            exponent: this.exponent,
            amplitude: this.amplitude,
            offset: this.offset,
            scale_x: this.scale_x,
            scale_y: this.scale_y,
            scale_z: this.scale_z,
            translate_x: this.translate_x,
            translate_y: this.translate_y,
            translate_z: this.translate_z,
            monochrome: this.monochrome,
            operation: this.operation,
            swap_order: this.swap_order,
            blend_opacity: this.blend_opacity,
            noise_only: this.noise_only,
            respect_alpha: this.respect_alpha,
            custom_size: this.custom_size,
            custom_width: this.custom_width,
            custom_height: this.custom_height
          }
        };

        const list = loadPresets();
        const existing = list.findIndex(p => p.name === name);
        if (existing >= 0) list[existing] = preset;
        else list.push(preset);

        savePresets(list);
        this.presets = list;
        this.newPresetName = '';
        Blockbench.showQuickMessage(i18n.preset_saved(), 2000);
      },
      loadPreset(preset) {
        const d = preset.data;
        Object.keys(d).forEach(key => {
          if (this.hasOwnProperty(key)) this[key] = d[key];
        });
        this.$nextTick(() => this.queueRender());
      },
      deletePreset(name) {
        const list = loadPresets().filter(p => p.name !== name);
        savePresets(list);
        this.presets = list;
        Blockbench.showQuickMessage(i18n.preset_deleted(), 2000);
      }
    },
    mounted() {
      this.textures = Texture.all.map(t => ({ uuid: t.uuid, name: t.name }));
      const selected = Texture.selected;
      this.selectedTextureUuid = selected ? selected.uuid : (this.textures[0] && this.textures[0].uuid) || null;
      this.updateTextureDims();
      this.$nextTick(() => this.performRender(true));
    },
    template: `
      <div class="tdnc-layout-wrapper">
        <!-- ЛЕВАЯ ПАНЕЛЬ: Превью -->
        <div class="tdnc-left-pane">
          <div class="tdnc-preview-box"
               @mousedown="onPreviewMouseDown"
               @mousemove="onPreviewMouseMove"
               @mouseup="onPreviewMouseUp"
               @mouseleave="onPreviewMouseUp"
               @wheel="onPreviewWheel">
            <canvas 
              ref="previewCanvas"
              :style="previewCanvasStyle"
            ></canvas>
          </div>
          <div style="display: flex; justify-content: center; gap: 8px;">
            <button class="tdnc-action-btn" @click="zoomOut">−</button>
            <button class="tdnc-action-btn" @click="zoomReset">
              {{ Math.round(previewZoom * 100) }}%
            </button>
            <button class="tdnc-action-btn" @click="zoomIn">+</button>
          </div>
        </div>

        <!-- ПРАВАЯ ПАНЕЛЬ -->
        <div class="tdnc-right-pane">
          <div class="tdnc-nav">
            <div class="tdnc-nav-btn" :class="{active: activeTab==='noise'}" @click="activeTab='noise'">
              {{ t.noise_tab() }}
            </div>
            <div class="tdnc-nav-btn" :class="{active: activeTab==='composite'}" @click="activeTab='composite'">
              {{ t.composite_tab() }}
            </div>
          </div>

          <!-- NOISE TAB -->
          <div v-show="activeTab==='noise'" class="tdnc-grid" style="grid-template-columns: 1fr;">
            <div class="tdnc-noise-actions">
              <button type="button" class="tdnc-random-btn" @click="randomizeNoise">🎲 {{ t.random_values() }}</button>
              <label class="tdnc-checkbox">
                <input type="checkbox" v-model="monochrome">
                <span>{{ t.monochrome() }}</span>
              </label>
            </div>

            <div class="tdnc-card">
              <label class="tdnc-checkbox">
                <input type="checkbox" v-model="noise_only">
                <span>{{ t.noise_only() }}</span>
              </label>
              <div class="tdnc-subtitle">{{ t.noise_only_hint() }}</div>

              <div v-if="noise_only" style="margin-top: 12px; display: flex; flex-direction: column; gap: 10px;">
                <label class="tdnc-checkbox">
                  <input type="checkbox" v-model="respect_alpha">
                  <span>{{ t.respect_alpha() }}</span>
                </label>
                <div class="tdnc-subtitle">{{ t.respect_alpha_hint() }}</div>

                <label class="tdnc-checkbox">
                  <input type="checkbox" v-model="custom_size">
                  <span>{{ t.custom_size() }}</span>
                </label>

                <div v-if="custom_size" class="tdnc-vector-row">
                  <label>W <input type="number" min="1" max="4096" v-model.number="custom_width"></label>
                  <label>H <input type="number" min="1" max="4096" v-model.number="custom_height"></label>
                </div>
              </div>
            </div>

            <div class="tdnc-card">
              <div class="tdnc-card-header">
                <span class="tdnc-title">{{ t.seed() }}</span>
                <button class="tdnc-reset" @click="resetField('seed', 1)">↺</button>
              </div>
              <div class="tdnc-controls-row">
                <input type="range" min="0" max="99999" step="1" v-model.number="seed">
                <div class="tdnc-num-box">
                  <input type="number" min="0" step="1" v-model.number="seed" @change="onNumberChange('seed', 1, true, $event)">
                  <span class="tdnc-arrows">&lt;&gt;</span>
                </div>
              </div>
            </div>

            <div class="tdnc-card">
              <div class="tdnc-card-header">
                <span class="tdnc-title">{{ t.period() }}</span>
                <button class="tdnc-reset" @click="resetField('period', 1.0)">↺</button>
              </div>
              <div class="tdnc-controls-row">
                <input type="range" min="0" max="2" step="0.01" v-model.number="period">
                <div class="tdnc-num-box">
                  <input type="number" min="0" step="0.01" v-model.number="period" @change="onNumberChange('period', 1.0, false, $event)">
                  <span class="tdnc-arrows">&lt;&gt;</span>
                </div>
              </div>
            </div>

            <div class="tdnc-card">
              <div class="tdnc-card-header">
                <span class="tdnc-title">{{ t.harmonics() }}</span>
                <button class="tdnc-reset" @click="resetField('harmonics', 2)">↺</button>
              </div>
              <div class="tdnc-controls-row">
                <input type="range" min="0" max="10" step="1" v-model.number="harmonics">
                <div class="tdnc-num-box">
                  <input type="number" min="0" step="1" v-model.number="harmonics" @change="onNumberChange('harmonics', 2, true, $event)">
                  <span class="tdnc-arrows">&lt;&gt;</span>
                </div>
              </div>
            </div>

            <div class="tdnc-card">
              <div class="tdnc-card-header">
                <span class="tdnc-title">{{ t.harmonic_spread() }}</span>
                <button class="tdnc-reset" @click="resetField('harmonic_spread', 2.0)">↺</button>
              </div>
              <div class="tdnc-controls-row">
                <input type="range" min="0" max="20" step="0.1" v-model.number="harmonic_spread">
                <div class="tdnc-num-box">
                  <input type="number" min="0" step="0.1" v-model.number="harmonic_spread" @change="onNumberChange('harmonic_spread', 2.0, false, $event)">
                  <span class="tdnc-arrows">&lt;&gt;</span>
                </div>
              </div>
            </div>

            <div class="tdnc-card">
              <div class="tdnc-card-header">
                <span class="tdnc-title">{{ t.harmonic_gain() }}</span>
                <button class="tdnc-reset" @click="resetField('harmonic_gain', 0.7)">↺</button>
              </div>
              <div class="tdnc-controls-row">
                <input type="range" min="0" max="2" step="0.01" v-model.number="harmonic_gain">
                <div class="tdnc-num-box">
                  <input type="number" min="0" step="0.01" v-model.number="harmonic_gain" @change="onNumberChange('harmonic_gain', 0.7, false, $event)">
                  <span class="tdnc-arrows">&lt;&gt;</span>
                </div>
              </div>
            </div>

            <div class="tdnc-card">
              <div class="tdnc-card-header">
                <span class="tdnc-title">{{ t.exponent() }}</span>
                <button class="tdnc-reset" @click="resetField('exponent', 1.0)">↺</button>
              </div>
              <div class="tdnc-controls-row">
                <input type="range" min="0" max="4" step="0.01" v-model.number="exponent">
                <div class="tdnc-num-box">
                  <input type="number" min="0" step="0.01" v-model.number="exponent" @change="onNumberChange('exponent', 1.0, false, $event)">
                  <span class="tdnc-arrows">&lt;&gt;</span>
                </div>
              </div>
            </div>

            <div class="tdnc-card">
              <div class="tdnc-card-header">
                <span class="tdnc-title">{{ t.amplitude() }}</span>
                <button class="tdnc-reset" @click="resetField('amplitude', 0.5)">↺</button>
              </div>
              <div class="tdnc-controls-row">
                <input type="range" min="0" max="2" step="0.01" v-model.number="amplitude">
                <div class="tdnc-num-box">
                  <input type="number" min="0" step="0.01" v-model.number="amplitude" @change="onNumberChange('amplitude', 0.5, false, $event)">
                  <span class="tdnc-arrows">&lt;&gt;</span>
                </div>
              </div>
            </div>

            <div class="tdnc-card">
              <div class="tdnc-card-header">
                <span class="tdnc-title">{{ t.offset() }}</span>
                <button class="tdnc-reset" @click="resetField('offset', 0.5)">↺</button>
              </div>
              <div class="tdnc-controls-row">
                <input type="range" min="0" max="1" step="0.01" v-model.number="offset">
                <div class="tdnc-num-box">
                  <input type="number" min="0" step="0.01" v-model.number="offset" @change="onNumberChange('offset', 0.5, false, $event)">
                  <span class="tdnc-arrows">&lt;&gt;</span>
                </div>
              </div>
            </div>

            <div class="tdnc-card">
              <div class="tdnc-card-header">
                <span class="tdnc-title">{{ t.coord_scale() }}</span>
                <button class="tdnc-reset" @click="scale_x=scale_y=scale_z=1">↺</button>
              </div>
              <div class="tdnc-vector-row">
                <label>X <input type="number" step="0.01" v-model.number="scale_x" @change="onNumberChange('scale_x', 1, false, $event, true)"></label>
                <label>Y <input type="number" step="0.01" v-model.number="scale_y" @change="onNumberChange('scale_y', 1, false, $event, true)"></label>
                <label>Z <input type="number" step="0.01" v-model.number="scale_z" @change="onNumberChange('scale_z', 1, false, $event, true)"></label>
              </div>
            </div>

            <div class="tdnc-card">
              <div class="tdnc-card-header">
                <span class="tdnc-title">{{ t.coord_translate() }}</span>
                <button class="tdnc-reset" @click="translate_x=translate_y=translate_z=0">↺</button>
              </div>
              <div class="tdnc-vector-row">
                <label>X <input type="number" step="0.01" v-model.number="translate_x" @change="onNumberChange('translate_x', 0, false, $event, true)"></label>
                <label>Y <input type="number" step="0.01" v-model.number="translate_y" @change="onNumberChange('translate_y', 0, false, $event, true)"></label>
                <label>Z <input type="number" step="0.01" v-model.number="translate_z" @change="onNumberChange('translate_z', 0, false, $event, true)"></label>
              </div>
            </div>
          </div>

          <!-- COMPOSITE TAB -->
          <div v-show="activeTab==='composite'" class="tdnc-grid">
            <div class="tdnc-card">
              <div class="tdnc-card-header">
                <span class="tdnc-title">Blend Operation</span>
              </div>
              <select v-model="operation" class="tdnc-select">
                <optgroup label="No Operation">
                  <option value="none">None (Noise Only)</option>
                </optgroup>
                <optgroup label="Native Operations">
                  <option value="over">Over</option>
                  <option value="add">Add</option>
                  <option value="multiply">Multiply</option>
                  <option value="screen">Screen</option>
                  <option value="overlay">Overlay</option>
                  <option value="color_dodge">Color Dodge</option>
                  <option value="color_burn">Color Burn</option>
                  <option value="hard_light">Hard Light</option>
                  <option value="soft_light">Soft Light</option>
                  <option value="difference">Difference</option>
                  <option value="exclusion">Exclusion</option>
                  <option value="hue">Hue</option>
                  <option value="color">Color</option>
                  <option value="luminosity">Luminosity</option>
                  <option value="saturation">Saturation</option>
                </optgroup>
                <optgroup label="Custom Operations">
                  <option value="atop">Atop</option>
                  <option value="average">Average</option>
                  <option value="brightest">Brightest</option>
                  <option value="dimmest">Dimmest</option>
                  <option value="divide">Divide</option>
                  <option value="subtract">Subtract</option>
                  <option value="subtractive">Subtractive</option>
                  <option value="pinlight">Pin Light</option>
                  <option value="vivid_light">Vivid Light</option>
                  <option value="linear_light">Linear Light</option>
                  <option value="hard_mix">Hard Mix</option>
                  <option value="glow">Glow</option>
                  <option value="freeze">Freeze</option>
                  <option value="heat">Heat</option>
                  <option value="reflect">Reflect</option>
                  <option value="negate">Negate</option>
                  <option value="maximum">Maximum</option>
                  <option value="minimum">Minimum</option>
                  <option value="inside">Inside</option>
                  <option value="outside">Outside</option>
                  <option value="stencil_luminance">Stencil Luminance</option>
                  <option value="lighter_color">Lighter Color</option>
                  <option value="darker_color">Darker Color</option>
                </optgroup>
              </select>
            </div>

            <div class="tdnc-card">
              <div class="tdnc-card-header">
                <span class="tdnc-title">{{ t.blend_opacity() }}</span>
                <button class="tdnc-reset" @click="resetField('blend_opacity', 1.0)">↺</button>
              </div>
              <div class="tdnc-controls-row">
                <input type="range" min="0" max="1" step="0.01" v-model.number="blend_opacity">
                <div class="tdnc-num-box">
                  <input type="number" min="0" max="1" step="0.01" v-model.number="blend_opacity" @change="onNumberChange('blend_opacity', 1.0, false, $event, false)">
                  <span class="tdnc-arrows">&lt;&gt;</span>
                </div>
              </div>
            </div>

            <div class="tdnc-card">
              <div class="tdnc-card-header">
                <span class="tdnc-title">{{ t.target_texture() }}</span>
              </div>
              <select v-model="selectedTextureUuid" class="tdnc-select">
                <option v-for="tex in textures" :key="tex.uuid" :value="tex.uuid">{{ tex.name }}</option>
              </select>
            </div>

            <div class="tdnc-card">
              <label class="tdnc-checkbox">
                <input type="checkbox" v-model="swap_order">
                <span>{{ t.swap_order() }}</span>
              </label>
              <div class="tdnc-subtitle">{{ t.swap_hint() }}</div>
            </div>

            <div class="tdnc-card" style="grid-column: 1 / -1;">
              <div class="tdnc-card-header">
                <span class="tdnc-title">{{ t.presets() }}</span>
              </div>
              <div class="tdnc-preset-row">
                <input type="text" v-model="newPresetName" :placeholder="t.preset_name()">
                <button class="tdnc-action-btn" @click="saveCurrentPreset">{{ t.save_preset() }}</button>
              </div>
              <div v-for="p in presets" :key="p.name" class="tdnc-preset-row">
                <span style="flex:1; color:#dbe0e6;">{{ p.name }}</span>
                <button class="tdnc-action-btn" @click="loadPreset(p)">{{ t.load_preset() }}</button>
                <button class="tdnc-action-btn" @click="deletePreset(p.name)">{{ t.delete_preset() }}</button>
              </div>
            </div>
          </div>

          <div class="tdnc-bottom-bar" style="margin-top: auto; padding-top: 16px;">
            <span style="font-size: 13px; color: #727a85;">
              {{ getOutputSize().width }}×{{ getOutputSize().height }} px
            </span>
            <button class="tdnc-action-btn" @click="saveAsNewTexture">
              {{ t.save_variant() }}
            </button>
          </div>
        </div>
      </div>
    `
  };

  function openNoiseCompositeDialog() {
    const dialog = new Dialog({
      id: 'noise_composite_dialog',
      title: i18n.title(),
      width: 960,
      buttons: [i18n.confirm(), i18n.cancel()],
      component: DialogComponent,
      onConfirm() {
        if (dialog.content_vue) {
          dialog.content_vue.applyToTexture();
        }
      }
    });

    dialog.show();
    if (dialog.content_vue) dialog.content_vue.dialog = dialog;
  }

  Plugin.register('noise_composite', {
    title: 'Noise & Composite',
    author: 'the0dll',
    icon: 'icon.png',
    description: 'Advanced procedural noise generator and texture compositor with custom blend modes, alpha masking, and presets.',
    "about": "Procedural noise generator and texture compositor for Blockbench.\n\nCreate simplex/FBM noise, blend it onto existing textures with a wide range of composite modes, respect transparency, save presets, or export a new texture variant — with live preview and full Undo/Redo support.\n\n## Features\n\n- **Procedural noise** — seed, period, harmonics, spread, gain, exponent, amplitude, offset\n- **Coordinate controls** — scale and translate on X / Y / Z\n- **Monochrome or RGB** noise\n- **Noise Only** mode — pure noise (optional custom size up to 4096²)\n- **Respect Alpha** — keep transparent areas empty\n- **Composite blend** — Over, Multiply, Screen, Overlay, Dodge/Burn, Light modes, Difference, and many custom ops\n- **Blend opacity** and **swap layer order**\n- **Presets** — save / load / delete setups\n- **Live preview** — zoom buttons, Ctrl + mouse wheel, pan when zoomed\n- **Undo / Redo** for both “apply to texture” and “save as new”\n\n## How to use\n\n1. Select a texture (or enable **Noise Only**).\n2. Open **Tools → Noise & Composite**.\n3. On **Noise Setup**, tweak seed and noise parameters. Use **Random Values** for a quick start.\n4. On **Composite Blend**, choose a blend operation and opacity (or leave **None** for noise only).\n5. Press **Confirm** to apply to the selected texture, or **Save as New Texture** to create a separate variant.\n6. In the preview: **+ / −** to zoom, **Ctrl + scroll** to zoom, drag to pan when zoomed in.\n\n## Tips\n\n- **Noise Only + custom size** is useful for generating standalone noise maps.\n- **Respect Alpha** is handy when you only want noise on painted areas of a skin or texture.\n- Order-dependent modes change when you enable **Swap Operation Order**.\n- Large textures show a confirmation before full-resolution apply; the live preview stays light for smooth sliders.",
    version: '1.0.0',
    variant: 'both',
    tags: ['Texture', 'Paint', 'Tool'],
    creation_date: '2026-09-12',
    
    onload() {
      if (typeof Blockbench !== 'undefined' && Blockbench.addCSS) {
        pluginStyleTag = Blockbench.addCSS(CSS_STYLES);
      } else {
        pluginStyleTag = document.createElement('style');
        pluginStyleTag.textContent = CSS_STYLES;
        document.head.appendChild(pluginStyleTag);
      }

      noiseCompositeAction = new Action('noise_composite_action', {
        name: 'Noise & Composite',
        description: 'Open Noise & Composite dialog',
        icon: 'blur_on', 
        click: openNoiseCompositeDialog
      });
      MenuBar.addAction(noiseCompositeAction, 'tools');
    },
    onunload() {
      if (pluginStyleTag) {
        if (typeof pluginStyleTag.delete === 'function') pluginStyleTag.delete();
        else if (pluginStyleTag.parentNode) pluginStyleTag.parentNode.removeChild(pluginStyleTag);
      }
      pluginStyleTag = null;

      if (noiseCompositeAction) noiseCompositeAction.delete();
      noiseCompositeAction = null;

      simplexCache.seed = null;
      simplexCache.monochrome = null;
      simplexCache.r = null;
      simplexCache.g = null;
      simplexCache.b = null;
    }
  });
})();