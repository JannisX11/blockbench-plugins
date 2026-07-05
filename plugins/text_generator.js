(function() {
    // ============================================
    // Text Generator
    // Custom fonts, size, depth, colors, preview, presets
    // ============================================

    let action, dialog, aboutAction, presetMenu;
    let previewGroup = null;
    let previewCubes = [];
    let pluginBrowserTabSyncHandler = null;
    let pendingEditContext = null;
    let outlinerDblClickHandler = null;
    let outlinerDblClickPanel = null;
    let groupBehaviorOverride = null;
    let editTextGroupAction = null;

    const PLUGIN_ID = 'text_generator';
    const PLUGIN_NAME = 'Text Generator';
    const PLUGIN_AUTHOR = 'Speaway';
    const PLUGIN_VERSION = '2.4.1';
    const PLUGIN_DESCRIPTION = 'Create stunning 3D block-style text for Minecraft models in Blockbench. Default Minecraft-style letters plus curated block fonts (auto-loaded) or optional custom .ttf/.otf upload, adjustable size and depth, outlines, presets, and full Unicode/emoji support -- perfect for resource packs, maps, and Bedrock/Java block models.';
    const DEFAULT_TEXT_COLOR = 0x55FF55;
    const TGP_TEXT_ROOT_PREFIX = 'Text: ';
    const TGP_META_KEY = 'tgp_text_settings';
    const PLUGIN_ICON = 'text_fields';
    const PLUGIN_WEBSITE = 'https://speaway.com';

    // ============================================
    // PRESET MANAGEMENT
    // ============================================
    const DEFAULT_PRESETS = {
        'minecraft_classic': {
            font: 'default',
            fontSize: 16,
            depth: 1,
            outlineColor: '#000000',
            outlineEnabled: false,
            letterSpacing: 1,
            lineSpacing: 3,
            wordSpacing: 2,
            alignment: 'left',
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false
        },
        'pixel_art': {
            font: 'karmatic_arcade',
            fontSize: 12,
            depth: 2,
            outlineColor: '#2C3E50',
            outlineEnabled: true,
            letterSpacing: 0,
            lineSpacing: 1,
            wordSpacing: 1,
            alignment: 'center',
            bold: true,
            italic: false,
            underline: false,
            strikethrough: false
        },
        'modern_3d': {
            font: 'minecrafter',
            fontSize: 24,
            depth: 2,
            outlineColor: '#FFFFFF',
            outlineEnabled: true,
            letterSpacing: 2,
            lineSpacing: 4,
            wordSpacing: 4,
            alignment: 'center',
            optimizeGeometry: true,
            bold: true,
            italic: false,
            underline: true,
            strikethrough: false
        },
        'retro_neon': {
            font: 'karmatic_arcade',
            fontSize: 20,
            depth: 1,
            outlineColor: '#FFFFFF',
            outlineEnabled: true,
            letterSpacing: 1,
            lineSpacing: 2,
            wordSpacing: 2,
            alignment: 'center',
            bold: false,
            italic: false,
            underline: false,
            strikethrough: false
        }
    };

    let userPresets = {};

    function loadPresets() {
        try {
            let saved = localStorage.getItem('tgp_presets');
            if (!saved) {
                saved = localStorage.getItem('amctg_presets');
                if (saved) localStorage.setItem('tgp_presets', saved);
            }
            if (saved) userPresets = JSON.parse(saved);
        } catch(e) { userPresets = {}; }
    }

    function savePresets() {
        try {
            localStorage.setItem('tgp_presets', JSON.stringify(userPresets));
        } catch(e) {}
    }

    // ============================================
    // FONT MANAGEMENT
    // ============================================
    const CURATED_FONT_ORDER = [
        'default', 'upheaval', 'karmatic_arcade',
        'minecrafter', 'minecraft_pe', 'minercraftory', 'dimitri', 'inversionz', 'inversionz_italic'
    ];

    const CURATED_FONTS = {
        default: { label: 'Default (Minecraft-style)', source: 'charmap' },
        upheaval: { label: 'Upheaval', source: 'cdnfonts', cssSlug: 'upheaval', family: 'Upheaval TT (BRK)' },
        karmatic_arcade: { label: 'Karmatic Arcade', source: 'cdnfonts', cssSlug: 'karmatic-arcade', family: 'Karmatic Arcade' },
        minecrafter: { label: 'MineCrafter', source: 'cdnfonts', cssSlug: 'minecrafter', family: 'minecrafter', fontWeight: '500' },
        minecraft_pe: { label: 'Minecraft PE', source: 'cdnfonts', cssSlug: 'minecraft-pe', family: 'MINECRAFT PE' },
        minercraftory: { label: 'Minercraftory', source: 'cdnfonts', cssSlug: 'minercraftory', family: 'Minercraftory' },
        dimitri: { label: 'Dimitri', source: 'cdnfonts', cssSlug: 'dimitri', family: 'Dimitri' },
        inversionz: { label: 'Inversionz', source: 'cdnfonts', cssSlug: 'inversionz', family: 'Inversionz', invertedCell: true },
        inversionz_italic: { label: 'Inversionz Italic', source: 'cdnfonts', cssSlug: 'inversionz', family: 'Inversionz', fontStyle: 'italic', invertedCell: true }
    };

    let loadedFonts = new Set();
    let customFonts = {};

    function snapCoord(n) {
        return Math.round(n);
    }

    function resolveRenderDepth(depth) {
        if (depth == null) return 1;
        return Math.max(0, depth);
    }

    function isDefaultFont(fontId) {
        return fontId === 'default';
    }

    function isCustomFont(fontId) {
        return !!customFonts[fontId];
    }

    function isInversionFont(fontId) {
        const def = CURATED_FONTS[normalizeFontId(fontId)];
        return !!(def && def.invertedCell);
    }

    function drawInversionGlyphCell(ctx, char, cellX, cellY, cellSize, fontStyle) {
        ctx.save();
        ctx.font = fontStyle;
        ctx.fillStyle = '#000000';
        ctx.fillRect(cellX, cellY, cellSize, cellSize);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(char, cellX + cellSize / 2, cellY + cellSize / 2);
        ctx.restore();
    }

    function normalizeFontId(fontId) {
        if (!fontId) return 'default';
        if (CURATED_FONTS[fontId] || customFonts[fontId]) return fontId;
        return 'default';
    }

    function normalizePresetFontFields(preset) {
        if (!preset) return preset;
        preset.font = normalizeFontId(preset.font);
        if (preset.font === 'inversionz' && preset.italic) {
            preset.font = 'inversionz_italic';
            preset.italic = false;
        }
        return preset;
    }

    function normalizeFormFontFields(formData) {
        if (!formData) return formData;
        formData.font = normalizeFontId(formData.font);
        if (formData.font === 'inversionz' && formData.italic) {
            formData.font = 'inversionz_italic';
            formData.italic = false;
        }
        return formData;
    }

    function resolveFontFamily(fontId) {
        fontId = normalizeFontId(fontId);
        if (isDefaultFont(fontId)) return null;
        if (CURATED_FONTS[fontId]) return CURATED_FONTS[fontId].family;
        return fontId;
    }

    function injectStylesheet(id, href) {
        if (document.getElementById(id)) return Promise.resolve(true);
        return new Promise((resolve) => {
            const link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = () => resolve(true);
            link.onerror = () => resolve(false);
            document.head.appendChild(link);
        });
    }

    function loadCuratedFont(fontId) {
        fontId = normalizeFontId(fontId);
        if (isDefaultFont(fontId)) return Promise.resolve(true);
        if (isCustomFont(fontId)) return Promise.resolve(true);
        if (loadedFonts.has(fontId)) return Promise.resolve(true);

        const def = CURATED_FONTS[fontId];
        if (!def) return Promise.resolve(false);

        let cssPromise;
        const cssKey = 'tgp_font_' + (def.cssSlug || fontId);
        if (def.source === 'google') {
            cssPromise = injectStylesheet(cssKey, 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(def.family.replace(/ /g, '+')) + '&display=swap');
        } else if (def.source === 'cdnfonts') {
            cssPromise = injectStylesheet(cssKey, 'https://fonts.cdnfonts.com/css/' + def.cssSlug);
        } else {
            return Promise.resolve(false);
        }

        return cssPromise.then((ok) => {
            if (!ok) return false;
            const style = def.fontStyle || 'normal';
            const weight = def.fontWeight || '400';
            const spec = style + ' ' + weight + ' 16px "' + def.family + '"';
            return document.fonts.load(spec).then(() => {
                loadedFonts.add(fontId);
                return true;
            }).catch(() => false);
        });
    }

    function loadCustomFont(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const fontData = e.target.result;
            const fontFace = new FontFace('custom_' + Date.now(), fontData);
            fontFace.load().then((loadedFace) => {
                document.fonts.add(loadedFace);
                const fontName = loadedFace.family;
                customFonts[fontName] = fontData;
                loadedFonts.add(fontName);
                callback(fontName);
            }).catch(() => {
                Blockbench.showMessageBox({
                    title: 'Font Error',
                    message: 'Failed to load custom font. Please try another file.',
                    buttons: ['OK']
                });
            });
        };
        reader.readAsArrayBuffer(file);
    }

    function getFontOptions() {
        const options = {};
        CURATED_FONT_ORDER.forEach(id => {
            options[id] = CURATED_FONTS[id].label;
        });
        Object.keys(customFonts).forEach(name => {
            options[name] = name + ' (Custom)';
        });
        return options;
    }

    function buildCanvasFontStyle(fontId, fontSize, bold, italic) {
        const family = resolveFontFamily(fontId);
        const def = CURATED_FONTS[normalizeFontId(fontId)];
        const useItalic = !!italic || (def && def.fontStyle === 'italic');
        const useBold = bold || (def && def.fontWeight && parseInt(def.fontWeight, 10) >= 500);
        return (useItalic ? 'italic ' : '') + (useBold ? 'bold ' : '') + fontSize + 'px "' + family + '"';
    }

    function isInversionFontEntry(fontId) {
        fontId = normalizeFontId(fontId);
        return fontId === 'inversionz' || fontId === 'inversionz_italic';
    }

    function buildDefaultCharMap(depth, wordSpace) {
        return {
                                    a: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [2, 6, 0, 3, 8, depth],
                                            [3, 0, 0, 5, 8, depth],
                                            [2, 3, 0, 3, 5, depth]
                                        ]
                                    },
                                    b: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [2, 6, 0, 3, 8, depth],
                                            [2, 0, 0, 3, 2, depth],
                                            [2, 3, 0, 3, 5, depth],
                                            [3, 3.5, 0, 4, 4.5, depth],
                                            [3, 0, 0, 5, 3.5, depth],
                                            [3, 4.5, 0, 5, 8, depth],
                                        ]
                                    },
                                    c: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [2, 6, 0, 5, 8, depth],
                                            [2, 0, 0, 5, 2, depth]
                                        ]
                                    },
                                    d: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [2, 0, 0, 4, 2, depth],
                                            [2, 6, 0, 4, 8, depth],
                                            [3, 2, 0, 4, 6, depth],
                                            [4, 1, 0, 5, 7, depth],
                                        ]
                                    },
                                    e: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [2, 6, 0, 5, 8, depth],
                                            [2, 3, 0, 4, 5, depth],
                                            [2, 0, 0, 5, 2, depth]
                                        ]
                                    },
                                    f: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [2, 6, 0, 5, 8, depth],
                                            [2, 3, 0, 4, 5, depth]
                                        ]
                                    },
                                    g: {
                                        width: 5,
                                        cubes: [
                                            [0, 2, 0, 2, 8, depth],
                                            [0, 0, 0, 5, 2, depth],
                                            [3, 2, 0, 5, 4, depth],
                                            [2, 6, 0, 5, 8, depth],
                                        ]
                                    },
                                    h: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [3, 0, 0, 5, 8, depth],
                                            [2, 3, 0, 3, 5, depth]
                                        ]
                                    },
                                    i: {
                                        width: 2,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth]
                                        ]
                                    },
                                    j: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 5, 2, depth],
                                            [3, 2, 0, 5, 8, depth],
                                            [1, 6, 0, 3, 8, depth]
                                        ]
                                    },
                                    k: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [2, 2.5, 0, 3, 5.5, depth],
                                            [3, 0, 0, 4, 8, depth],
                                            [4, 5, 0, 5, 8, depth],
                                            [4, 0, 0, 5, 3, depth],
                                        ]
                                    },
                                    l: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [2, 0, 0, 5, 2, depth]
                                        ]
                                    },
                                    m: {
                                        width: 7,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [2, 3, 0, 3, 7, depth],
                                            [3, 2, 0, 4, 6, depth],
                                            [4, 3, 0, 5, 7, depth],
                                            [5, 0, 0, 7, 8, depth],
                                        ]
                                    },
                                    n: {
                                        width: 6,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [4, 0, 0, 6, 8, depth],
                                            [2, 3, 0, 3, 6, depth],
                                            [3, 2, 0, 4, 5, depth],
                                        ]
                                    },
                                    o: {
                                        width: 6,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [2, 6, 0, 4, 8, depth],
                                            [4, 0, 0, 6, 8, depth],
                                            [2, 0, 0, 4, 2, depth]
                                        ]
                                    },
                                    p: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [3, 3, 0, 5, 8, depth],
                                            [2, 6, 0, 3, 8, depth],
                                            [2, 3, 0, 3, 5, depth]
                                        ]
                                    },
                                    q: {
                                        width: 5.5,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [2, 6, 0, 3, 8, depth],
                                            [3, 0, 0, 5, 8, depth],
                                            [2, 0, 0, 3, 2, depth],
                                            [3.5, -0.5, 0, 5.5, 3.5, depth]
                                        ]
                                    },
                                    r: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [2, 6, 0, 3, 8, depth],
                                            [2, 3, 0, 3, 5, depth],
                                            [3, 4, 0, 5, 8, depth],
                                            [3, 0, 0, 5, 3, depth],
                                            [3, 3, 0, 4, 4, depth],
                                        ]
                                    },
                                    s: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 5, 2, depth],
                                            [0, 3, 0, 5, 5, depth],
                                            [0, 6, 0, 5, 8, depth],
                                            [3, 2, 0, 5, 3, depth],
                                            [0, 5, 0, 2, 6, depth],
                                        ]
                                    },
                                    "$": {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 5, 2, depth],
                                            [0, 3, 0, 5, 5, depth],
                                            [0, 6, 0, 5, 8, depth],
                                            [1.5, 8, 0, 3.5, 9, depth],
                                            [1.5, -1, 0, 3.5, 0, depth],
                                            [3, 2, 0, 5, 3, depth],
                                            [0, 5, 0, 2, 6, depth],
                                        ]
                                    },
                                    t: {
                                        width: 5,
                                        cubes: [
                                            [1.5, 0, 0, 3.5, 6, depth],
                                            [0, 6, 0, 5, 8, depth],
                                        ]
                                    },
                                    u: {
                                        width: 6,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [4, 0, 0, 6, 8, depth],
                                            [2, 0, 0, 4, 2, depth]
                                        ]
                                    },
                                    v: {
                                        width: 5.75,
                                        cubes: [
                                            [0, 4, 0, 2, 8, depth],
                                            [3.75, 4, 0, 5.75, 8, depth],
                                            [0.75, 2, 0, 5, 4, depth],
                                            [1.75, 0, 0, 3.75, 2, depth],
                                        ]
                                    },
                                    w: {
                                        width: 6.5,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [4.5, 0, 0, 6.5, 8, depth],
                                            [2, 1, 0, 2.5, 4, depth],
                                            [4, 1, 0, 4.5, 4, depth],
                                            [2.5, 2, 0, 4, 6, depth],
                                        ]
                                    },
                                    x: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 2, 2.75, depth],
                                            [0, 5.25, 0, 2, 8, depth],
                                            [3, 5.25, 0, 5, 8, depth],
                                            [3, 0, 0, 5, 2.75, depth],
                                            [1.25, 2.25, 0, 3.75, 5.75, depth],
                                        ]
                                    },
                                    y: {
                                        width: 5,
                                        cubes: [
                                            [0, 4, 0, 2, 8, depth],
                                            [3, 4, 0, 5, 8, depth],
                                            [1.25, 0, 0, 3.75, 5, depth],
                                        ]
                                    },
                                    z: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 5, 2, depth],
                                            [0, 6, 0, 5, 8, depth],
                                            [0, 2, 0, 2, 3, depth],
                                            [1, 3, 0, 3, 4, depth],
                                            [2, 4, 0, 4, 5, depth],
                                            [3, 5, 0, 5, 6, depth],
                                        ]
                                    },
                                    0: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [2, 6, 0, 3, 8, depth],
                                            [3, 0, 0, 5, 8, depth],
                                            [2, 0, 0, 3, 2, depth]
                                        ]
                                    },
                                    1: {
                                        width: 3,
                                        cubes: [
                                            [0, 5, 0, 1, 7, depth],
                                            [1, 0, 0, 3, 8, depth],
                                        ]
                                    },
                                    2: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 5, 2, depth],
                                            [0, 3, 0, 5, 5, depth],
                                            [0, 6, 0, 5, 8, depth],
                                            [0, 2, 0, 2, 3, depth],
                                            [3, 5, 0, 5, 6, depth],
                                        ]
                                    },
                                    3: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 5, 2, depth],
                                            [0, 3, 0, 5, 5, depth],
                                            [0, 6, 0, 5, 8, depth],
                                            [3, 2, 0, 5, 3, depth],
                                            [3, 5, 0, 5, 6, depth],
                                        ]
                                    },
                                    4: {
                                        width: 5,
                                        cubes: [
                                            [0, 3, 0, 2, 8, depth],
                                            [2, 3, 0, 3, 5, depth],
                                            [3, 0, 0, 5, 8, depth],
                                        ]
                                    },
                                    5: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 4.25, 2, depth],
                                            [0, 3, 0, 4.25, 5, depth],
                                            [0, 6, 0, 5, 8, depth],
                                            [3, 2, 0, 4.25, 3, depth],
                                            [0, 5, 0, 2, 6, depth],
                                            [4.25, 0.5, 0, 5, 4.5, depth],
                                        ]
                                    },
                                    6: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 5, 2, depth],
                                            [0, 3, 0, 5, 5, depth],
                                            [0, 6, 0, 5, 8, depth],
                                            [3, 2, 0, 5, 3, depth],
                                            [0, 2, 0, 2, 3, depth],
                                            [0, 5, 0, 2, 6, depth],
                                        ]
                                    },
                                    7: {
                                        width: 5,
                                        cubes: [
                                            [0, 6, 0, 5, 8, depth],
                                            [3, 0, 0, 5, 6, depth],
                                        ]
                                    },
                                    8: {
                                        width: 5,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [3, 0, 0, 5, 8, depth],
                                            [2, 6, 0, 3, 8, depth],
                                            [2, 0, 0, 3, 2, depth],
                                            [2, 3, 0, 3, 5, depth],
                                        ]
                                    },
                                    9: {
                                        width: 5,
                                        cubes: [
                                            [0, 6, 0, 5, 8, depth],
                                            [0, 3, 0, 3, 5, depth],
                                            [0, 0, 0, 3, 2, depth],
                                            [0, 5, 0, 2, 6, depth],
                                            [3, 0, 0, 5, 6, depth],
                                        ]
                                    },
                                    ".": {
                                        width: 3,
                                        cubes: [
                                            [0, 0, 0, 2, 2, depth]
                                        ]
                                    },
                                    "!": {
                                        width: 2,
                                        cubes: [
                                            [0, 0, 0, 2, 2, depth],
                                            [0, 4, 0, 2, 8, depth]
                                        ]
                                    },
                                    "-": {
                                        width: 4,
                                        cubes: [
                                            [0, 3, 0, 4, 5, depth]
                                        ]
                                    },
                                    "+": {
                                        width: 4,
                                        cubes: [
                                            [0, 3.25, 0, 4, 4.75, depth],
                                            [1.25, 2, 0, 2.75, 6, depth]
                                        ]
                                    },
                                    ":": {
                                        width: 2,
                                        cubes: [
                                            [0, 0, 0, 2, 2, depth],
                                            [0, 4, 0, 2, 6, depth]
                                        ]
                                    },
                                    ";": {
                                        width: 2,
                                        cubes: [
                                            [0, 4, 0, 2, 6, depth],
                                            [0, -1, 0, 2, 2, depth]
                                        ]
                                    },
                                    ",": {
                                        width: 2,
                                        cubes: [
                                            [0, -1, 0, 2, 2, depth]
                                        ]
                                    },
                                    "'": {
                                        width: 2,
                                        cubes: [
                                            [0, 6, 0, 2, 9, depth]
                                        ]
                                    },
                                    "?": {
                                        width: 4,
                                        cubes: [
                                            [1, 0, 0, 3, 2, depth],
                                            [1, 3, 0, 3, 5, depth],
                                            [0, 6, 0, 4, 8, depth],
                                            [2, 5, 0, 4, 6, depth]
                                        ]
                                    },
                                    "[": {
                                        width: 3,
                                        cubes: [
                                            [0, 0, 0, 2, 8, depth],
                                            [2, 6, 0, 3, 8, depth],
                                            [2, 0, 0, 3, 2, depth]
                                        ]
                                    },
                                    "(": {
                                        width: 3,
                                        cubes: [
                                            [0, 1, 0, 2, 7, depth],
                                            [1, 6, 0, 3, 8, depth],
                                            [1, 0, 0, 3, 2, depth]
                                        ]
                                    },
                                    "]": {
                                        width: 3,
                                        cubes: [
                                            [1, 0, 0, 3, 8, depth],
                                            [0, 6, 0, 1, 8, depth],
                                            [0, 0, 0, 1, 2, depth]
                                        ]
                                    },
                                    ")": {
                                        width: 3,
                                        cubes: [
                                            [1, 1, 0, 3, 7, depth],
                                            [0, 6, 0, 2, 8, depth],
                                            [0, 0, 0, 2, 2, depth]
                                        ]
                                    },
                                    "/": {
                                        width: 6,
                                        cubes: [
                                            [0, 0, 0, 3, 2, depth],
                                            [1, 2, 0, 4, 4, depth],
                                            [2, 4, 0, 5, 6, depth],
                                            [3, 6, 0, 6, 8, depth],
                                        ]
                                    },
                                    " ": {
                                        width: wordSpace,
                                        cubes: []
                                    }
                                }
    }


    function prepareDefaultText(text) {
        return String(text).replace(/\r\n/g, '\n').replace(/\n/g, '\\').toLowerCase();
    }

    function splitDefaultLines(text) {
        const normalized = prepareDefaultText(text);
        const lines = [];
        let current = '';
        for (let i = 0; i < normalized.length; i++) {
            const char = normalized[i];
            if (char === '\\') {
                lines.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        lines.push(current);
        return lines;
    }

    function measureDefaultLineWidth(line, charMap, letterSpace) {
        if (!line.length) return 0;
        let width = 0;
        for (const char of line) {
            if (!charMap[char]) continue;
            width += charMap[char].width + letterSpace;
        }
        return Math.max(0, width - letterSpace);
    }

    function estimateDefaultElementCount(text, depth, letterSpacing, wordSpacing) {
        const letterSpace = letterSpacing || 0;
        const wordSpace = wordSpacing || 0;
        const renderDepth = resolveRenderDepth(depth);
        const charMap = buildDefaultCharMap(renderDepth, wordSpace);
        let count = 0;
        for (const line of splitDefaultLines(text)) {
            for (const char of line) {
                if (charMap[char]) count += charMap[char].cubes.length;
            }
        }
        return count;
    }

    function centerTextGroup(group) {
        if (!group) return;
        const elements = [];
        group.forEachChild(c => {
            if (c instanceof Cube) elements.push(c);
        }, Cube, true);
        if (!elements.length) return;
        for (const axis of [0, 1, 2]) {
            let min = Infinity, max = -Infinity;
            for (const el of elements) {
                min = Math.min(min, el.from[axis], el.to[axis]);
                max = Math.max(max, el.from[axis], el.to[axis]);
            }
            const offset = -Math.round((min + max) / 2);
            for (const el of elements) {
                el.from[axis] += offset;
                el.to[axis] += offset;
            }
        }
    }

    function extractFormSettings(formData) {
        return {
            text: formData.text,
            font: formData.font,
            fontSize: formData.fontSize,
            depth: formData.depth,
            outlineColor: formData.outlineColor,
            outlineEnabled: formData.outlineEnabled,
            letterSpacing: formData.letterSpacing,
            lineSpacing: formData.lineSpacing,
            wordSpacing: formData.wordSpacing,
            alignment: formData.alignment,
            optimizeGeometry: formData.optimizeGeometry,
            bold: formData.bold,
            italic: formData.italic,
            underline: formData.underline,
            strikethrough: formData.strikethrough,
            pluginVersion: PLUGIN_VERSION
        };
    }

    function attachTextGroupMetadata(group, text, options) {
        const settings = extractFormSettings({ ...options, text: text });
        if (typeof group.extend === 'function') {
            group.extend({ [TGP_META_KEY]: settings });
        } else {
            group[TGP_META_KEY] = settings;
        }
    }

    function isTextRootGroup(group) {
        return group instanceof Group && (
            !!group[TGP_META_KEY] ||
            (typeof group.name === 'string' && group.name.startsWith(TGP_TEXT_ROOT_PREFIX))
        );
    }

    function findTextRootGroup(node) {
        if (!node) return null;
        let current = node;
        while (current && current !== 'root') {
            if (isTextRootGroup(current)) return current;
            current = current.parent;
        }
        return null;
    }

    function getTextFromGroupName(group) {
        if (group && group.name && group.name.startsWith(TGP_TEXT_ROOT_PREFIX)) {
            return group.name.slice(TGP_TEXT_ROOT_PREFIX.length);
        }
        return '';
    }

    function getGroupElementsCenter(group) {
        let min = [Infinity, Infinity, Infinity];
        let max = [-Infinity, -Infinity, -Infinity];
        let found = false;
        group.forEachChild(c => {
            if (!(c instanceof Cube)) return;
            found = true;
            for (const axis of [0, 1, 2]) {
                min[axis] = Math.min(min[axis], c.from[axis], c.to[axis]);
                max[axis] = Math.max(max[axis], c.from[axis], c.to[axis]);
            }
        }, Cube, true);
        if (!found) return null;
        return [
            Math.round((min[0] + max[0]) / 2),
            Math.round((min[1] + max[1]) / 2),
            Math.round((min[2] + max[2]) / 2)
        ];
    }

    function alignGroupToCenter(group, targetCenter) {
        if (!group || !targetCenter) return;
        const currentCenter = getGroupElementsCenter(group);
        if (!currentCenter) return;
        const delta = [
            targetCenter[0] - currentCenter[0],
            targetCenter[1] - currentCenter[1],
            targetCenter[2] - currentCenter[2]
        ];
        group.forEachChild(c => {
            if (!(c instanceof Cube)) return;
            for (const axis of [0, 1, 2]) {
                c.from[axis] += delta[axis];
                c.to[axis] += delta[axis];
            }
        }, Cube, true);
    }

    function openTextEditorForGroup(rootGroup) {
        if (!rootGroup) return;
        const now = Date.now();
        if (openTextEditorForGroup._lastOpen && now - openTextEditorForGroup._lastOpen < 400) return;
        openTextEditorForGroup._lastOpen = now;

        pendingEditContext = {
            group: rootGroup,
            center: getGroupElementsCenter(rootGroup)
        };
        dialog = createDialog(true);
        dialog.show();
        setTimeout(() => {
            const settings = rootGroup[TGP_META_KEY];
            if (settings) {
                const values = Object.assign({}, settings);
                normalizeFormFontFields(values);
                dialog.setFormValues(values, false);
            } else {
                dialog.setFormValues({
                    text: getTextFromGroupName(rootGroup)
                }, false);
            }
        }, 50);
    }

    function getSelectedOutlinerGroup() {
        if (Group.first_selected) return Group.first_selected;
        if (Group.selected && Group.selected.length) return Group.selected[0];
        if (typeof Outliner !== 'undefined' && Outliner.selected && Outliner.selected.length) {
            const node = Outliner.selected[0];
            if (node instanceof Group) return node;
            return findTextRootGroup(node);
        }
        return null;
    }

    function setupOutlinerDoubleClickEdit() {
        if (typeof Group !== 'undefined' && Group.addBehaviorOverride) {
            groupBehaviorOverride = Group.addBehaviorOverride({
                condition: (group) => !!findTextRootGroup(group),
                priority: 20,
                behavior: {
                    dblclick(event, group) {
                        const root = findTextRootGroup(group);
                        if (!root) return;
                        if (event && event.preventDefault) event.preventDefault();
                        if (event && event.stopPropagation) event.stopPropagation();
                        openTextEditorForGroup(root);
                        return false;
                    }
                }
            });
        }

        outlinerDblClickHandler = (event) => {
            if (event.target.closest('input, textarea, .name_editor, .rename')) return;
            setTimeout(() => {
                const selected = getSelectedOutlinerGroup();
                const root = findTextRootGroup(selected);
                if (!root) return;
                openTextEditorForGroup(root);
            }, 0);
        };

        outlinerDblClickPanel = document.querySelector('#outliner')
            || document.querySelector('#panel_outliner')
            || document.querySelector('.outliner_node_list');
        if (outlinerDblClickPanel) {
            outlinerDblClickPanel.addEventListener('dblclick', outlinerDblClickHandler, true);
        }
    }

    function teardownOutlinerDoubleClickEdit() {
        if (groupBehaviorOverride && groupBehaviorOverride.delete) {
            groupBehaviorOverride.delete();
            groupBehaviorOverride = null;
        }
        if (outlinerDblClickPanel && outlinerDblClickHandler) {
            outlinerDblClickPanel.removeEventListener('dblclick', outlinerDblClickHandler, true);
        }
        outlinerDblClickPanel = null;
        outlinerDblClickHandler = null;
        pendingEditContext = null;
    }

    function sanitizeGroupCharName(char) {
        if (char === ' ') return '_space';
        if (char === '\n') return '_newline';
        return char.replace(/[^\w\-]/g, '_') || '_char';
    }

    function makeLetterGroupName(char, usedNames) {
        const base = sanitizeGroupCharName(char);
        if (!usedNames[base]) {
            usedNames[base] = 1;
            return base;
        }
        usedNames[base]++;
        return base + '_' + usedNames[base];
    }

    function getOrCreateLetterGroup(mainGroup, letterGroups, index, char, usedNames) {
        if (letterGroups[index]) return letterGroups[index];
        const name = makeLetterGroupName(char, usedNames);
        const group = new Group({ name: name, origin: [0, 0, 0] }).init();
        group.addTo(mainGroup);
        letterGroups[index] = group;
        return group;
    }

    function buildFillCellCharMap(fillPositions) {
        const map = new Map();
        for (const pos of fillPositions) {
            const x1 = snapCoord(Math.min(pos.from[0], pos.to[0]));
            const x2 = snapCoord(Math.max(pos.from[0], pos.to[0]));
            const y1 = snapCoord(Math.min(pos.from[1], pos.to[1]));
            const y2 = snapCoord(Math.max(pos.from[1], pos.to[1]));
            for (let x = x1; x < x2; x++) {
                for (let y = y1; y < y2; y++) {
                    map.set(x + ',' + y, pos.charIndex);
                }
            }
        }
        return map;
    }

    function findLetterIndexAdjacentToCell(x, y, cellMap) {
        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [dx, dy] of dirs) {
            const key = (x + dx) + ',' + (y + dy);
            if (cellMap.has(key)) return cellMap.get(key);
        }
        return -1;
    }

    function findLetterIndexAdjacentToOutline(px, py, pixels, width, height, characters) {
        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [dx, dy] of dirs) {
            const nx = px + dx;
            const ny = py + dy;
            if (nx >= 0 && ny >= 0 && nx < width && ny < height && pixels[ny][nx] === 1) {
                return findCharacterAt(nx, ny, characters);
            }
        }
        return 0;
    }

    function collectOutlinePositionsFromPixels(pixels, width, height) {
        const fillSet = new Set();
        const outlineSet = new Set();
        for (let py = 0; py < height; py++) {
            for (let px = 0; px < width; px++) {
                if (pixels[py][px] === 1) fillSet.add(px + ',' + py);
            }
        }
        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const key of fillSet) {
            const [px, py] = key.split(',').map(Number);
            for (const [dx, dy] of dirs) {
                const nx = px + dx;
                const ny = py + dy;
                const nkey = nx + ',' + ny;
                if (nx >= 0 && ny >= 0 && nx < width && ny < height && !fillSet.has(nkey)) {
                    outlineSet.add(nkey);
                }
            }
        }
        return outlineSet;
    }

    function collectOutlinePositionsFromCubes(cubes) {
        const fillSet = new Set();
        for (const cube of cubes) {
            const x1 = snapCoord(Math.min(cube.from[0], cube.to[0]));
            const x2 = snapCoord(Math.max(cube.from[0], cube.to[0]));
            const y1 = snapCoord(Math.min(cube.from[1], cube.to[1]));
            const y2 = snapCoord(Math.max(cube.from[1], cube.to[1]));
            for (let x = x1; x < x2; x++) {
                for (let y = y1; y < y2; y++) {
                    fillSet.add(x + ',' + y);
                }
            }
        }
        const outlineSet = new Set();
        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const key of fillSet) {
            const [x, y] = key.split(',').map(Number);
            for (const [dx, dy] of dirs) {
                const nkey = (x + dx) + ',' + (y + dy);
                if (!fillSet.has(nkey)) outlineSet.add(nkey);
            }
        }
        return outlineSet;
    }

    function generateDefaultText3D(text, options) {
        prepareFormColors(options);
        const renderDepth = resolveRenderDepth(options.depth);
        const letterSpace = options.letterSpacing || 0;
        const wordSpace = options.wordSpacing || 0;
        const charMap = buildDefaultCharMap(renderDepth, wordSpace);
        const lines = splitDefaultLines(text);
        const displayText = String(text).substring(0, 20);
        const outlineColorInt = hexToInt(normalizeColor(options.outlineColor));

        Undo.initEdit({ outliner: true, elements: [], textures: [] });

        const mainGroup = new Group({ name: 'Text: ' + displayText, origin: [0, 0, 0] }).init();
        mainGroup.addTo();
        attachTextGroupMetadata(mainGroup, text, options);

        const allCubes = [];
        const fillPositions = [];
        const letterGroups = [];
        const usedNames = {};
        let invalidCount = 0;
        let charIndex = 0;
        const lineWidths = lines.map(line => measureDefaultLineWidth(line, charMap, letterSpace));
        let yOffset = 0;
        const lineStep = 10 + (options.lineSpacing ?? 0);

        lines.forEach((line, lineIndex) => {
            let offset = 0;
            const lineWidth = lineWidths[lineIndex];
            if (options.alignment === 'center') offset -= Math.round(lineWidth / 2);
            else if (options.alignment === 'right') offset -= Math.round(lineWidth);

            for (const char of line) {
                if (!charMap.hasOwnProperty(char)) {
                    invalidCount++;
                    continue;
                }

                if (char !== ' ') {
                    const letterGroup = getOrCreateLetterGroup(mainGroup, letterGroups, charIndex, char, usedNames);

                    for (const cubeDef of charMap[char].cubes) {
                        fillPositions.push({
                            from: [
                                snapCoord(cubeDef[0] + offset),
                                snapCoord(cubeDef[1] - yOffset),
                                snapCoord(cubeDef[2])
                            ],
                            to: [
                                snapCoord(cubeDef[3] + offset),
                                snapCoord(cubeDef[4] - yOffset),
                                snapCoord(cubeDef[5])
                            ],
                            targetGroup: letterGroup,
                            charIndex: charIndex
                        });
                    }
                    charIndex++;
                }

                offset += charMap[char].width + letterSpace;
            }

            yOffset += lineStep;
        });

        if (options.outlineEnabled) {
            const fillCellMap = buildFillCellCharMap(fillPositions);
            const tempCubes = fillPositions.map(p => ({ from: p.from, to: p.to }));
            const outlinePositions = collectOutlinePositionsFromCubes(tempCubes);
            for (const key of outlinePositions) {
                const [x, y] = key.split(',').map(Number);
                const adjCharIndex = findLetterIndexAdjacentToCell(x, y, fillCellMap);
                const outlineGroup = adjCharIndex >= 0 && letterGroups[adjCharIndex]
                    ? letterGroups[adjCharIndex]
                    : mainGroup;
                const outlineCube = new Cube({
                    name: 'outline',
                    from: [x, y, 0],
                    to: [x + 1, y + 1, renderDepth],
                    box_uv: true,
                    color: outlineColorInt
                }).init();
                outlineCube.flip(0, 2.0, true);
                outlineCube.addTo(outlineGroup);
                allCubes.push(outlineCube);
            }
        }

        fillPositions.forEach((pos) => {
            const textCube = new Cube({
                name: 'cube',
                from: pos.from.slice(),
                to: pos.to.slice(),
                box_uv: true,
                color: DEFAULT_TEXT_COLOR
            }).init();
            textCube.flip(0, 2.0, true);
            textCube.addTo(pos.targetGroup);
            allCubes.push(textCube);
        });

        centerTextGroup(mainGroup);
        Undo.finishEdit('Text Generator', { elements: allCubes, textures: [], outliner: true });
        refreshTextScene();

        let message = 'Generated ' + allCubes.length + ' element' + (allCubes.length === 1 ? '' : 's');
        if (invalidCount > 0) message += '. Skipped invalid character(s).';
        Blockbench.showQuickMessage(message);

        return { cubeCount: allCubes.length, group: mainGroup, letterGroups: letterGroups };
    }


    // ============================================
    // COLOR MANAGEMENT
    // ============================================
    function normalizeColor(value) {
        if (value == null || value === '') return '#ffffff';
        if (typeof value === 'string') {
            const hex = value.trim();
            if (/^#[0-9a-fA-F]{3,8}$/i.test(hex)) return hex.length === 4 ? expandShortHex(hex) : hex.slice(0, 7);
            if (/^[0-9a-fA-F]{3,8}$/i.test(hex)) return normalizeColor('#' + hex);
            return hex;
        }
        if (typeof value.toHexString === 'function') return value.toHexString();
        if (typeof value.toHex === 'function') return value.toHex();
        if (value._r != null) return rgbToHex(value._r, value._g, value._b);
        return '#ffffff';
    }

    function expandShortHex(hex) {
        if (hex.length !== 4) return hex;
        return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }

    function hexToRgb(hex) {
        const normalized = normalizeColor(hex);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    }

    function hexToInt(hex) {
        const rgb = hexToRgb(hex);
        return (rgb.r << 16) + (rgb.g << 8) + rgb.b;
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function findCharacterAt(px, py, characters) {
        for (let i = 0; i < characters.length; i++) {
            const c = characters[i];
            if (px >= c.x && px < c.x + c.w && py >= c.y && py < c.y + c.h) return i;
        }
        return 0;
    }

    function refreshTextScene() {
        Canvas.updateAll();
    }

    // ============================================
    // CANVAS RENDER & PIXEL ANALYSIS
    // ============================================
    function splitTextLines(text) {
        return String(text).replace(/\\n/g, '\n').split(/\r?\n/);
    }

    function measureCanvasLineWidth(line, ctx, inversionMode, cellStep, letterSpacing, wordSpacing) {
        if (inversionMode) {
            let width = 0;
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (/\s/.test(char)) {
                    width += Math.max(cellStep, wordSpacing || 0);
                } else {
                    width += cellStep;
                }
            }
            return width;
        }

        let width = 0;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const charWidth = ctx.measureText(char).width;
            if (/\s/.test(char)) {
                width += charWidth + (wordSpacing || 0);
            } else {
                width += charWidth;
                if (i < line.length - 1) {
                    width += letterSpacing || 0;
                }
            }
        }
        return width;
    }

    function getLineStartX(lineWidth, maxWidth, alignment, padding) {
        if (alignment === 'center') return padding + Math.round((maxWidth - lineWidth) / 2);
        if (alignment === 'right') return padding + Math.round(maxWidth - lineWidth);
        return padding;
    }

    function getPixelData(text, fontId, fontSize, bold, italic, underline, strikethrough, lineSpacing, letterSpacing, wordSpacing, alignment) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const inversionMode = isInversionFont(fontId);

        const fontStyle = buildCanvasFontStyle(fontId, fontSize, bold, italic);
        ctx.font = fontStyle;

        const lines = splitTextLines(text);
        let maxWidth = 0;
        const lineMetrics = [];
        const lineHeight = fontSize + (lineSpacing || 0);
        const cellStep = fontSize + (letterSpacing || 0);

        lines.forEach(line => {
            const lineWidth = measureCanvasLineWidth(line, ctx, inversionMode, cellStep, letterSpacing, wordSpacing);
            maxWidth = Math.max(maxWidth, lineWidth);
            lineMetrics.push({ width: lineWidth });
        });

        const totalHeight = lines.length * lineHeight - (lines.length > 0 ? (lineSpacing || 0) : 0);

        const padding = 4;
        canvas.width = Math.ceil(maxWidth) + padding * 2;
        canvas.height = Math.ceil(totalHeight) + padding * 2;

        ctx.font = fontStyle;
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#000000';

        let y = padding;
        const characters = [];
        const words = [];
        lines.forEach((line, i) => {
            const metrics = lineMetrics[i];
            const lineStartX = getLineStartX(metrics.width, maxWidth, alignment || 'left', padding);
            let charX = lineStartX;
            let wordStart = lineStartX;
            let inWord = false;

            if (inversionMode) {
                for (const char of line) {
                    const isSpace = /\s/.test(char);

                    if (!isSpace) {
                        if (!inWord) {
                            wordStart = charX;
                            inWord = true;
                        }
                        drawInversionGlyphCell(ctx, char, charX, y, fontSize, fontStyle);
                        characters.push({
                            x: charX,
                            y: y,
                            w: fontSize,
                            h: fontSize,
                            char: char,
                            lineIndex: i
                        });
                        charX += cellStep;
                    } else {
                        if (inWord) {
                            words.push({
                                x: wordStart,
                                y: y,
                                w: charX - wordStart,
                                h: fontSize,
                                lineIndex: i
                            });
                            inWord = false;
                        }
                        charX += Math.max(cellStep, wordSpacing || 0);
                    }
                }
            } else {
                for (let ci = 0; ci < line.length; ci++) {
                    const char = line[ci];
                    const charWidth = ctx.measureText(char).width;
                    const isSpace = /\s/.test(char);

                    if (!isSpace) {
                        if (!inWord) {
                            wordStart = charX;
                            inWord = true;
                        }
                        ctx.fillText(char, charX, y);
                        characters.push({
                            x: charX,
                            y: y,
                            w: Math.ceil(charWidth),
                            h: fontSize,
                            char: char,
                            lineIndex: i
                        });
                        charX += charWidth;
                        if (ci < line.length - 1) {
                            charX += letterSpacing || 0;
                        }
                    } else {
                        if (inWord) {
                            words.push({
                                x: wordStart,
                                y: y,
                                w: charX - wordStart,
                                h: fontSize,
                                lineIndex: i
                            });
                            inWord = false;
                        }
                        charX += charWidth + (wordSpacing || 0);
                    }
                }
            }

            if (inWord) {
                words.push({
                    x: wordStart,
                    y: y,
                    w: charX - wordStart,
                    h: fontSize,
                    lineIndex: i
                });
            }

            if (underline) {
                ctx.fillRect(lineStartX, y + fontSize - 2, metrics.width, 2);
            }
            if (strikethrough) {
                ctx.fillRect(lineStartX, y + Math.round(fontSize / 2) - 1, metrics.width, 2);
            }

            y += lineHeight;
        });

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = [];
        const alphaThreshold = inversionMode ? 64 : 128;

        for (let py = 0; py < canvas.height; py++) {
            const row = [];
            for (let px = 0; px < canvas.width; px++) {
                const idx = (py * canvas.width + px) * 4;
                const alpha = imageData.data[idx + 3];
                row.push(alpha > alphaThreshold ? 1 : 0);
            }
            pixels.push(row);
        }

        return {
            pixels: pixels,
            width: canvas.width,
            height: canvas.height,
            lineCount: lines.length,
            characters: characters,
            words: words
        };
    }

    // ============================================
    // 3D CUBE GENERATION
    // ============================================
    function countFilledPixels(pixels, width, height) {
        let count = 0;
        for (let py = 0; py < height; py++) {
            for (let px = 0; px < width; px++) {
                if (pixels[py][px] === 1) count++;
            }
        }
        return count;
    }

    function estimateElementCount(pixels, width, height, depth, optimizeGeometry, outlineEnabled) {
        const filled = countFilledPixels(pixels, width, height);
        const renderDepth = resolveRenderDepth(depth);
        let count;
        if (optimizeGeometry !== false) {
            count = filled;
        } else if (renderDepth === 0) {
            count = filled;
        } else {
            count = filled * renderDepth;
        }
        if (outlineEnabled) {
            count += collectOutlinePositionsFromPixels(pixels, width, height).size;
        }
        return count;
    }

    function createTextColumn(fromX, fromY, renderDepth, fillColor, group, index) {
        const cube = new Cube({
            name: 'text_col_' + index,
            from: [snapCoord(fromX), snapCoord(fromY), 0],
            to: [snapCoord(fromX) + 1, snapCoord(fromY) + 1, snapCoord(renderDepth)],
            box_uv: true,
            color: fillColor
        }).init();

        cube.flip(0, 2.0, true);
        cube.addTo(group);
        return cube;
    }

    function createTextCube(x, y, z, fillColor, group) {
        const cube = new Cube({
            name: 'text_pixel_' + x + '_' + y + '_' + z,
            from: [snapCoord(x), snapCoord(y), snapCoord(z)],
            to: [snapCoord(x) + 1, snapCoord(y) + 1, snapCoord(z) + 1],
            box_uv: true,
            color: fillColor
        }).init();

        cube.flip(0, 2.0, true);
        cube.addTo(group);
        return cube;
    }

    function updateCanvasElements(elements, options = {}) {
        refreshTextScene();
    }

    function resolveLetterGroup(px, py, mainGroup, letterGroups, characters, usedNames) {
        const letterIndex = findCharacterAt(px, py, characters);
        const char = characters[letterIndex]?.char || '_';
        return getOrCreateLetterGroup(mainGroup, letterGroups, letterIndex, char, usedNames);
    }

    function generateText3D(text, options, precomputedPixelData) {
        const {
            font, fontSize, depth,
            outlineColor, outlineEnabled,
            letterSpacing, lineSpacing, wordSpacing, alignment,
            bold, italic, underline, strikethrough,
            optimizeGeometry
        } = options;

        const useOptimizedGeometry = optimizeGeometry !== false;
        const renderDepth = resolveRenderDepth(depth);
        const outlineColorInt = hexToInt(normalizeColor(outlineColor));

        const pixelData = precomputedPixelData || getPixelData(
            text, font, fontSize, bold, italic, underline, strikethrough,
            lineSpacing, letterSpacing, wordSpacing, alignment
        );
        const pixels = pixelData.pixels;
        const width = pixelData.width;
        const height = pixelData.height;
        const characters = pixelData.characters || [];

        Undo.initEdit({ outliner: true, elements: [], textures: [] });

        const mainGroup = new Group({
            name: 'Text: ' + text.substring(0, 20),
            origin: [0, 0, 0]
        }).init();
        mainGroup.addTo();
        attachTextGroupMetadata(mainGroup, text, options);

        const allCubes = [];
        const letterGroups = [];
        const usedNames = {};

        if (outlineEnabled) {
            const outlinePositions = collectOutlinePositionsFromPixels(pixels, width, height);
            for (const key of outlinePositions) {
                const [px, py] = key.split(',').map(Number);
                const letterIndex = findLetterIndexAdjacentToOutline(px, py, pixels, width, height, characters);
                const char = characters[letterIndex]?.char || '_';
                const outlineGroup = getOrCreateLetterGroup(mainGroup, letterGroups, letterIndex, char, usedNames);
                const fromX = px;
                const fromY = height - py;
                const outlineCube = createTextColumn(
                    fromX, fromY, renderDepth, outlineColorInt, outlineGroup, 'outline'
                );
                outlineCube.name = 'outline';
                allCubes.push(outlineCube);
            }
        }

        if (useOptimizedGeometry) {
            let colIndex = 0;
            for (let py = 0; py < height; py++) {
                for (let px = 0; px < width; px++) {
                    if (pixels[py][px] !== 1) continue;

                    const fromX = px;
                    const fromY = height - py;
                    const targetGroup = resolveLetterGroup(
                        px, py, mainGroup, letterGroups, characters, usedNames
                    );

                    const cube = createTextColumn(
                        fromX, fromY, renderDepth, DEFAULT_TEXT_COLOR, targetGroup, colIndex
                    );
                    cube.name = 'cube';
                    allCubes.push(cube);
                    colIndex++;
                }
            }
        } else {
            for (let py = 0; py < height; py++) {
                for (let px = 0; px < width; px++) {
                    if (pixels[py][px] !== 1) continue;

                    const x = px;
                    const y = height - py;
                    const targetGroup = resolveLetterGroup(
                        px, py, mainGroup, letterGroups, characters, usedNames
                    );

                    if (renderDepth === 0) {
                        const cube = createTextColumn(
                            x, y, 0, DEFAULT_TEXT_COLOR, targetGroup, 'flat_' + px + '_' + py
                        );
                        cube.name = 'cube';
                        allCubes.push(cube);
                    } else {
                        for (let d = 0; d < renderDepth; d++) {
                            const cube = createTextCube(x, y, d, DEFAULT_TEXT_COLOR, targetGroup);
                            cube.name = 'cube';
                            allCubes.push(cube);
                        }
                    }
                }
            }
        }

        centerTextGroup(mainGroup);
        Undo.finishEdit('Text Generator', { elements: allCubes, textures: [], outliner: true });
        updateCanvasElements(allCubes, { outliner: true, fullRefresh: true });

        Blockbench.showQuickMessage('Generated ' + allCubes.length + ' element' + (allCubes.length === 1 ? '' : 's'));

        return {
            cubeCount: allCubes.length,
            group: mainGroup,
            letterGroups: letterGroups
        };
    }

    function prepareTextOptions(formData) {
        prepareFormColors(formData);
        return formData;
    }

    function runTextGeneration(formData, precomputedPixelData, editContext) {
        let result;
        if (isDefaultFont(formData.font)) {
            result = generateDefaultText3D(formData.text, formData);
        } else {
            result = generateText3D(formData.text, formData, precomputedPixelData);
        }
        if (editContext && editContext.center && result && result.group) {
            alignGroupToCenter(result.group, editContext.center);
        }
        return result;
    }

    function executeTextGeneration(formData, precomputedPixelData, editContext) {
        if (editContext && editContext.group) {
            editContext.group.remove(true);
        }
        return runTextGeneration(formData, precomputedPixelData, editContext);
    }

    function confirmTextGeneration(formData, editContext) {
        prepareTextOptions(formData);
        normalizeFormFontFields(formData);

        if (isDefaultFont(formData.font)) {
            const estimate = estimateDefaultElementCount(
                formData.text, formData.depth, formData.letterSpacing, formData.wordSpacing
            );
            const generate = () => executeTextGeneration(formData, null, editContext);
            if (estimate > 3000) {
                Blockbench.showMessageBox({
                    title: 'Performance Warning',
                    message: 'This text will create approximately ' + estimate + ' elements, which may reduce Blockbench FPS.\n\nContinue generating?',
                    buttons: ['Generate', 'Cancel'],
                    confirm: 0,
                    cancel: 1
                }, (result) => {
                    if (result === 0) generate();
                });
            } else {
                generate();
            }
            return;
        }

        const pixelData = getPixelData(
            formData.text,
            formData.font,
            formData.fontSize,
            formData.bold,
            formData.italic,
            formData.underline,
            formData.strikethrough,
            formData.lineSpacing,
            formData.letterSpacing,
            formData.wordSpacing,
            formData.alignment
        );

        const estimate = estimateElementCount(
            pixelData.pixels,
            pixelData.width,
            pixelData.height,
            formData.depth,
            formData.optimizeGeometry !== false,
            formData.outlineEnabled
        );

        const generate = () => executeTextGeneration(formData, pixelData, editContext);

        if (estimate > 3000) {
            Blockbench.showMessageBox({
                title: 'Performance Warning',
                message: 'This text will create approximately ' + estimate + ' elements, which may reduce Blockbench FPS. Large outlines also affect performance.\n\nContinue generating?',
                buttons: ['Generate', 'Cancel'],
                confirm: 0,
                cancel: 1
            }, (result) => {
                if (result === 0) generate();
            });
        } else {
            generate();
        }
    }

    // ============================================
    // LIVE PREVIEW
    // ============================================
    function clearPreview() {
        if (previewGroup) {
            previewGroup.remove();
            previewGroup = null;
        }
        previewCubes.forEach(c => c.remove());
        previewCubes = [];
        updateCanvasElements([], { outliner: true });
    }

    function updatePreview(formData) {
        clearPreview();

        if (!formData.text || formData.text.trim() === '') return;

        // Lightweight version for preview
        const previewOptions = {
            font: formData.font,
            fontSize: Math.min(formData.fontSize, 16),
            depth: Math.min(formData.depth, 2),
            outlineColor: formData.outlineColor || '#000000',
            outlineEnabled: formData.outlineEnabled,
            letterSpacing: formData.letterSpacing,
            lineSpacing: formData.lineSpacing,
            wordSpacing: formData.wordSpacing,
            alignment: formData.alignment,
            optimizeGeometry: true,
            bold: formData.bold,
            italic: formData.italic,
            underline: formData.underline,
            strikethrough: formData.strikethrough
        };

        try {
            normalizeFormFontFields(previewOptions);
            const result = isDefaultFont(previewOptions.font)
                ? generateDefaultText3D(formData.text, previewOptions)
                : generateText3D(formData.text, previewOptions);
            previewGroup = result.group;
            if (previewGroup) {
                previewCubes = previewGroup.children.filter(c => c instanceof Cube);
            }
        } catch(e) {
            console.error('Preview error:', e);
        }
    }

    // ============================================
    // DIALOG FORM
    // ============================================
    function prepareFormColors(formData) {
        formData.outlineColor = normalizeColor(formData.outlineColor);
        return formData;
    }

    function cleanupOrphanColorPickers() {
        document.querySelectorAll('body > .sp-container').forEach(el => el.remove());
    }

    function attachColorPickerHexFix(dialogInstance) {
        const fixHexConfirm = (event) => {
            const chooseBtn = event.target.closest?.('.sp-choose');
            if (!chooseBtn || !dialogInstance.object?.isConnected) return;

            const container = chooseBtn.closest('.sp-container');
            const hexInput = container?.querySelector('input.sp-input');
            if (!hexInput?.value) return;

            let hex = hexInput.value.trim();
            if (!hex.startsWith('#')) hex = '#' + hex;
            if (!/^#[0-9a-fA-F]{3,8}$/i.test(hex)) return;

            const formData = dialogInstance.form?.form_data;
            if (!formData) return;

            for (const key of ['outlineColor']) {
                const picker = formData[key]?.colorpicker;
                if (!picker?.jq?.length) continue;

                try {
                    if (picker.jq.spectrum('container')?.[0] !== container) continue;
                    picker.set(hex);
                    return;
                } catch (e) {
                    continue;
                }
            }
        };

        document.addEventListener('click', fixHexConfirm, true);
        return fixHexConfirm;
    }

    function detachColorPickerHexFix(handler) {
        if (handler) document.removeEventListener('click', handler, true);
    }

    function createDialog(isEditMode) {
        // Remove leftover Spectrum popups from a previous session before building new pickers.
        cleanupOrphanColorPickers();
        const fontOptions = getFontOptions();

        return new Dialog({
            id: 'text_generator',
            title: isEditMode ? PLUGIN_NAME + ' -- Edit Text' : PLUGIN_NAME,
            width: 720,
            cancel_on_click_outside: false,
            lines: [`
                <style>
                    #text_generator .dialog_form {
                        max-height: 600px;
                        overflow-x: hidden;
                    }
                    #text_generator .form_row {
                        display: flex;
                        gap: 10px;
                        margin-bottom: 10px;
                    }
                    #text_generator .form_row > * {
                        flex: 1;
                    }
                    #text_generator .section_title {
                        font-weight: bold;
                        margin-top: 15px;
                        margin-bottom: 5px;
                        color: var(--color-accent);
                    }
                    #text_generator .preview_area {
                        background: var(--color-back);
                        border: 1px solid var(--color-border);
                        border-radius: 4px;
                        padding: 10px;
                        margin-top: 10px;
                        min-height: 60px;
                        text-align: center;
                        font-size: 24px;
                    }
                    #text_generator .color_preview {
                        width: 20px;
                        height: 20px;
                        border-radius: 3px;
                        display: inline-block;
                        border: 1px solid var(--color-border);
                        vertical-align: middle;
                        margin-left: 5px;
                    }
                    body > .sp-container:not(.sp-flat) {
                        z-index: 100000 !important;
                    }
                </style>
            `],
            form: {
                edit_info: {
                    type: 'info',
                    text: '<small>Double-click opened this editor. Confirm to replace the existing text group at the same position.</small>',
                    condition: () => !!isEditMode
                },

                // === TEXT INPUT ===
                text: {
                    label: 'Text',
                    type: 'textarea',
                    value: 'Hello World',
                    placeholder: 'Enter your text here... Press Enter for new lines'
                },

                // === FONT ===
                font_section: { type: 'info', text: '<div class="section_title">📝 Font Settings</div>' },
                font: {
                    label: 'Font Family',
                    type: 'select',
                    options: fontOptions,
                    value: 'default'
                },
                fontSize: {
                    label: 'Font Size (px)',
                    type: 'number',
                    value: 16,
                    min: 4,
                    max: 128,
                    step: 1,
                    condition: (form) => form.font !== 'default'
                },
                customFont: {
                    label: 'Upload Custom Font (.ttf/.otf)',
                    type: 'file',
                    extensions: ['ttf', 'otf', 'woff', 'woff2'],
                    readtype: 'arraybuffer',
                    condition: () => true
                },

                // === STYLE ===
                style_section: { type: 'info', text: '<div class="section_title">✨ Text Style</div>' },
                bold: {
                    label: 'Bold',
                    type: 'checkbox',
                    value: false,
                    condition: (form) => form.font !== 'default'
                },
                italic: {
                    label: 'Italic',
                    type: 'checkbox',
                    value: false,
                    condition: (form) => form.font !== 'default' && !isInversionFontEntry(form.font)
                },
                underline: {
                    label: 'Underline',
                    type: 'checkbox',
                    value: false,
                    condition: (form) => form.font !== 'default'
                },
                strikethrough: {
                    label: 'Strikethrough',
                    type: 'checkbox',
                    value: false,
                    condition: (form) => form.font !== 'default'
                },

                // === 3D SETTINGS ===
                depth_section: { type: 'info', text: '<div class="section_title">🔲 3D Settings</div>' },
                depth: {
                    label: 'Depth (Z size, 0 = flat)',
                    type: 'number',
                    value: 1,
                    min: 0,
                    max: 16,
                    step: 1
                },
                outlineEnabled: {
                    label: 'Enable Outline',
                    type: 'checkbox',
                    value: false
                },
                outlineColor: {
                    label: 'Outline Color',
                    type: 'color',
                    value: '#000000',
                    condition: (form) => form.outlineEnabled
                },
                outline_perf_info: {
                    type: 'info',
                    text: '<small>Outline adds a colored border around each letter pixel.</small>',
                    condition: (form) => form.outlineEnabled
                },
                optimizeGeometry: {
                    label: 'Optimize Geometry (recommended)',
                    type: 'checkbox',
                    value: true
                },
                optimizeGeometry_info: {
                    type: 'info',
                    text: '<small>Extrudes depth into one column per pixel (same colors as before, ~depth× fewer cubes).</small>',
                    condition: (form) => form.optimizeGeometry
                },

                // === LAYOUT ===
                layout_section: { type: 'info', text: '<div class="section_title">📐 Layout</div>' },
                letterSpacing: {
                    label: 'Letter Spacing',
                    type: 'number',
                    value: 1,
                    min: -5,
                    max: 20,
                    step: 1
                },
                lineSpacing: {
                    label: 'Line Spacing',
                    type: 'number',
                    value: 3,
                    min: -5,
                    max: 20,
                    step: 1
                },
                wordSpacing: {
                    label: 'Word Spacing',
                    type: 'number',
                    value: 2,
                    min: -5,
                    max: 20,
                    step: 1
                },
                alignment: {
                    label: 'Alignment',
                    type: 'select',
                    options: {
                        left: 'Left',
                        center: 'Center',
                        right: 'Right'
                    },
                    value: 'left'
                },

                // === PRESETS ===
                preset_section: { type: 'info', text: '<div class="section_title">💾 Presets</div>' },
                preset: {
                    label: 'Load Preset',
                    type: 'select',
                    options: {
                        '': '-- Select Preset --',
                        ...Object.keys(DEFAULT_PRESETS).reduce((acc, k) => {
                            acc[k] = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            return acc;
                        }, {}),
                        ...Object.keys(userPresets).reduce((acc, k) => {
                            acc[k] = k + ' (Custom)';
                            return acc;
                        }, {})
                    },
                    value: ''
                },
                savePresetName: {
                    label: 'Save Current as Preset',
                    type: 'text',
                    value: '',
                    placeholder: 'Enter preset name...'
                }
            },

            onFormChange(formData) {
                if (formData.preset && formData.preset !== '') {
                    const preset = DEFAULT_PRESETS[formData.preset] || userPresets[formData.preset];
                    if (preset) {
                        normalizePresetFontFields(preset);
                        this.setFormValues(preset, false);
                        this.form.preset.value = '';
                    }
                }

                if (formData.customFont && formData.customFont.length > 0) {
                    loadCustomFont(formData.customFont[0], (fontName) => {
                        const newOptions = getFontOptions();
                        this.form.font.options = newOptions;
                        this.form.font.value = fontName;
                        Blockbench.showQuickMessage('Custom font loaded: ' + fontName);
                    });
                }
            },

            onOpen() {
                this._colorPickerFixHandler = attachColorPickerHexFix(this);
            },

            onConfirm(formData) {
                if (formData.savePresetName && formData.savePresetName.trim() !== '') {
                    prepareFormColors(formData);
                    const presetData = {
                        font: formData.font,
                        fontSize: formData.fontSize,
                        depth: formData.depth,
                        outlineColor: formData.outlineColor,
                        outlineEnabled: formData.outlineEnabled,
                        letterSpacing: formData.letterSpacing,
                        lineSpacing: formData.lineSpacing,
                        wordSpacing: formData.wordSpacing,
                        alignment: formData.alignment,
                        optimizeGeometry: formData.optimizeGeometry,
                        bold: formData.bold,
                        italic: formData.italic,
                        underline: formData.underline,
                        strikethrough: formData.strikethrough
                    };
                    userPresets[formData.savePresetName] = presetData;
                    savePresets();
                    Blockbench.showQuickMessage('Preset saved: ' + formData.savePresetName);
                }

                normalizeFormFontFields(formData);
                const editContext = pendingEditContext;
                pendingEditContext = null;
                if (isDefaultFont(formData.font) || isCustomFont(formData.font)) {
                    confirmTextGeneration(formData, editContext);
                } else {
                    loadCuratedFont(formData.font).then((ok) => {
                        if (!ok) {
                            Blockbench.showMessageBox({
                                title: 'Font Load Error',
                                message: 'Could not load the selected font from the internet. Check your connection or choose Default / upload a custom font.',
                                buttons: ['OK']
                            });
                            return;
                        }
                        setTimeout(() => confirmTextGeneration(formData, editContext), 100);
                    });
                }

                detachColorPickerHexFix(this._colorPickerFixHandler);
                cleanupOrphanColorPickers();
                this.hide();
            },

            onCancel() {
                detachColorPickerHexFix(this._colorPickerFixHandler);
                cleanupOrphanColorPickers();
                pendingEditContext = null;
                clearPreview();
                this.hide();
            }
        });
    }

    // ============================================
    // ABOUT DIALOG
    // ============================================
    function addAboutButton() {
        let about = MenuBar.menus.help.structure.find(e => e.id === 'about_plugins');

        if (!about) {
            about = new Action('about_plugins', {
                name: 'About Plugins...',
                icon: 'info',
                children: []
            });
            MenuBar.addAction(about, 'help');
        }

        aboutAction = new Action('about_' + PLUGIN_ID, {
            name: 'About ' + PLUGIN_NAME + '...',
            icon: PLUGIN_ICON,
            click: function() {
                showAbout();
            }
        });

        about.children.push(aboutAction);
    }

    function showAbout() {
        new Dialog({
            id: 'tgp_about',
            title: 'About ' + PLUGIN_NAME,
            width: 600,
            lines: [`
                <div style="text-align: center; padding: 20px;">
                    <h2 style="color: var(--color-accent);">${PLUGIN_NAME}</h2>
                    <p style="font-size: 16px; margin: 10px 0;">
                        Professional 3D text generator for Minecraft models in Blockbench
                    </p>
                    <p style="color: var(--color-subtle_text);">
                        Version ${PLUGIN_VERSION} | by <a href="${PLUGIN_WEBSITE}" target="_blank">${PLUGIN_AUTHOR}</a>
                    </p>
                    <hr style="margin: 15px 0; border-color: var(--color-border);">
                    <h3>Features</h3>
                    <ul style="text-align: left; display: inline-block;">
                        <li><b>Fonts:</b> Default Minecraft-style, curated block fonts, or custom upload</li>
                        <li><b>Font Size:</b> 4px to 128px adjustable</li>
                        <li><b>3D Depth:</b> 0 (paper-thin) to 16 cubes deep</li>
                        <li><b>Outline:</b> Colored border around text pixels</li>
                        <li><b>Text Styles:</b> Bold, Italic, Underline, Strikethrough</li>
                        <li><b>Layout:</b> Spacing and alignment controls</li>
                        <li><b>Outliner:</b> Text -> Letter -> Cube hierarchy</li>
                        <li><b>Edit:</b> Double-click a Text group to reopen settings</li>
                        <li><b>Unicode:</b> Full emoji and special character support</li>
                        <li><b>Live Preview:</b> Real-time 3D preview</li>
                        <li><b>Presets:</b> Save and load your favorite settings</li>
                    </ul>
                    <hr style="margin: 15px 0; border-color: var(--color-border);">
                    <p style="font-size: 14px;">
                        Visit <a href="${PLUGIN_WEBSITE}" target="_blank">speaway.com</a> for more tools and resources.
                    </p>
                </div>
            `],
            buttons: ['Close']
        }).show();
    }

    // ============================================
    // PLUGIN BROWSER -- hide empty Settings tab
    // Blockbench shows Settings for all installed plugins; we have none.
    // ============================================
    function syncPluginBrowserSettingsTab() {
        const tabBar = document.querySelector('#plugin_browser_page_tab_bar');
        if (!tabBar) return;

        const settingsTab = Array.from(tabBar.children).find(
            li => li.textContent.trim() === 'Settings'
        );
        if (!settingsTab) return;

        const hideSettings = typeof Plugin !== 'undefined' && Plugin.selected?.id === PLUGIN_ID;

        settingsTab.style.display = hideSettings ? 'none' : '';

        if (hideSettings && settingsTab.classList.contains('selected')) {
            const aboutTab = Array.from(tabBar.children).find(
                li => li.textContent.trim() === 'About'
            );
            aboutTab?.click();
        }
    }

    function startPluginBrowserTabSync() {
        syncPluginBrowserSettingsTab();
        if (pluginBrowserTabSyncHandler) return;

        pluginBrowserTabSyncHandler = () => {
            requestAnimationFrame(syncPluginBrowserSettingsTab);
        };
        document.addEventListener('click', pluginBrowserTabSyncHandler, true);
    }

    function stopPluginBrowserTabSync() {
        if (pluginBrowserTabSyncHandler) {
            document.removeEventListener('click', pluginBrowserTabSyncHandler, true);
            pluginBrowserTabSyncHandler = null;
        }

        const tabBar = document.querySelector('#plugin_browser_page_tab_bar');
        const settingsTab = tabBar && Array.from(tabBar.children).find(
            li => li.textContent.trim() === 'Settings'
        );
        if (settingsTab) settingsTab.style.display = '';
    }

    // ============================================
    // PLUGIN REGISTRATION
    // ============================================
    Plugin.register(PLUGIN_ID, {
        title: PLUGIN_NAME,
        author: PLUGIN_AUTHOR,
        description: PLUGIN_DESCRIPTION,
        about: '**Text Generator** by [Speaway](https://speaway.com) turns any text into Minecraft-style 3D cube geometry.\n\n## Features\n- Default Minecraft-style + curated block fonts + custom upload\n- Size, depth (0 = paper-thin), spacing, alignment\n- Colored outline border\n- Bold, italic, underline, strikethrough\n- Saveable presets\n- Unicode and emoji support\n- Double-click a Text group in the outliner to edit and regenerate\n\n## How to use\nGo to **Tools -> Text Generator**, enter your text, adjust settings, and click Generate.',
        icon: PLUGIN_ICON,
        version: PLUGIN_VERSION,
        variant: 'both',
        min_version: '4.8.0',
        tags: ['Minecraft: Java Edition', 'Minecraft: Bedrock Edition', 'Font'],

        onload() {
            loadPresets();

            action = new Action('text_generator', {
                name: 'Text Generator',
                description: 'Create 3D Minecraft-style text with custom fonts and advanced styling',
                icon: PLUGIN_ICON,
                category: 'tools',
                condition: () => Format.id !== 'image',
                click: function() {
                    dialog = createDialog();
                    dialog.show();
                }
            });

            MenuBar.addAction(action, 'tools');
            addAboutButton();

            // Preset menu
            presetMenu = new Menu([
                {
                    name: 'Minecraft Classic',
                    icon: 'grass_block',
                    click: () => {
                        dialog = createDialog();
                        dialog.show();
                        setTimeout(() => {
                            dialog.form.preset.value = 'minecraft_classic';
                            dialog.updateFormValues();
                        }, 100);
                    }
                },
                {
                    name: 'Pixel Art Style',
                    icon: 'auto_fix_high',
                    click: () => {
                        dialog = createDialog();
                        dialog.show();
                        setTimeout(() => {
                            dialog.form.preset.value = 'pixel_art';
                            dialog.updateFormValues();
                        }, 100);
                    }
                },
                {
                    name: 'Modern 3D',
                    icon: 'view_in_ar',
                    click: () => {
                        dialog = createDialog();
                        dialog.show();
                        setTimeout(() => {
                            dialog.form.preset.value = 'modern_3d';
                            dialog.updateFormValues();
                        }, 100);
                    }
                },
                '_',
                {
                    name: 'Custom Presets...',
                    icon: 'save',
                    click: () => {
                        dialog = createDialog();
                        dialog.show();
                    }
                }
            ]);
            startPluginBrowserTabSync();
            setupOutlinerDoubleClickEdit();

            editTextGroupAction = new Action('tgp_edit_text_group', {
                name: 'Edit with Text Generator',
                description: 'Reopen text with saved settings to regenerate',
                icon: 'text_fields',
                condition: () => {
                    const sel = getSelectedOutlinerGroup();
                    return !!findTextRootGroup(sel);
                },
                click: () => {
                    const root = findTextRootGroup(getSelectedOutlinerGroup());
                    if (root) openTextEditorForGroup(root);
                }
            });
            if (typeof Outliner !== 'undefined' && Outliner.control_menu_group) {
                Outliner.control_menu_group.splice(0, 0, editTextGroupAction);
            }
        },

        onunload() {
            stopPluginBrowserTabSync();
            teardownOutlinerDoubleClickEdit();
            if (editTextGroupAction) {
                if (typeof Outliner !== 'undefined' && Outliner.control_menu_group) {
                    const idx = Outliner.control_menu_group.indexOf(editTextGroupAction);
                    if (idx !== -1) Outliner.control_menu_group.splice(idx, 1);
                }
                editTextGroupAction.delete();
                editTextGroupAction = null;
            }
            MenuBar.removeAction('tools.text_generator');
            MenuBar.removeAction('help.about_plugins.about_' + PLUGIN_ID);
            action.delete();
            if (aboutAction) aboutAction.delete();
            clearPreview();
        }
    });

})();
