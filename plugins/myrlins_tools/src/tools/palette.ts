/**
 * Palette Converter - Remap colors to target palettes
 */

import {
    RGB,
    findNearestColor,
    extractDominantColors,
    HYTALE_PALETTES
} from '../utils/color';

export type PaletteType = 'official' | 'warm' | 'cool' | 'nature' | 'custom';

interface PaletteConvertResult {
    success: boolean;
    colorsChanged: number;
    message: string;
}

/**
 * Get palette by name
 */
export function getPalette(name: PaletteType): RGB[] {
    switch (name) {
        case 'official':
            return HYTALE_PALETTES.official;
        case 'warm':
            return HYTALE_PALETTES.warm;
        case 'cool':
            return HYTALE_PALETTES.cool;
        case 'nature':
            return HYTALE_PALETTES.nature;
        default:
            return HYTALE_PALETTES.official;
    }
}

/**
 * Convert texture colors to match a target palette
 */
export function convertToPalette(paletteName: PaletteType = 'official'): PaletteConvertResult {
    // @ts-ignore - Texture is a global from Blockbench
    const texture = Texture.all[0];

    if (!texture) {
        return {
            success: false,
            colorsChanged: 0,
            message: 'No texture found in the model.'
        };
    }

    const palette = getPalette(paletteName);
    const canvas = texture.canvas;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return {
            success: false,
            colorsChanged: 0,
            message: 'Could not get canvas context.'
        };
    }

    // @ts-ignore - Undo is a global from Blockbench
    Undo.initEdit({ textures: [texture] });

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let colorsChanged = 0;

    // Process each pixel
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Skip transparent pixels
        if (a < 10) continue;

        const original: RGB = { r, g, b };
        const nearest = findNearestColor(original, palette);

        // Check if color changed
        if (nearest.r !== r || nearest.g !== g || nearest.b !== b) {
            data[i] = nearest.r;
            data[i + 1] = nearest.g;
            data[i + 2] = nearest.b;
            colorsChanged++;
        }
    }

    ctx.putImageData(imageData, 0, 0);
    texture.updateSource(canvas.toDataURL());

    // @ts-ignore
    Undo.finishEdit('Convert to Palette (Myrlin\'s Tools)');

    return {
        success: true,
        colorsChanged,
        message: `Converted ${colorsChanged} pixels to ${paletteName} palette.`
    };
}

/**
 * Quantize texture colors to reduce unique color count
 */
export function quantizeColors(targetCount: number = 8): PaletteConvertResult {
    // @ts-ignore - Texture is a global from Blockbench
    const texture = Texture.all[0];

    if (!texture) {
        return {
            success: false,
            colorsChanged: 0,
            message: 'No texture found in the model.'
        };
    }

    const canvas = texture.canvas;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return {
            success: false,
            colorsChanged: 0,
            message: 'Could not get canvas context.'
        };
    }

    // @ts-ignore
    Undo.initEdit({ textures: [texture] });

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Extract all colors
    const colors: RGB[] = [];
    for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a >= 10) { // Skip transparent
            colors.push({
                r: data[i],
                g: data[i + 1],
                b: data[i + 2]
            });
        }
    }

    // Get dominant colors using k-means
    const palette = extractDominantColors(colors, targetCount);

    // Remap all colors to the reduced palette
    let colorsChanged = 0;
    for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a < 10) continue;

        const original: RGB = {
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

    // @ts-ignore
    Undo.finishEdit('Quantize Colors (Myrlin\'s Tools)');

    return {
        success: true,
        colorsChanged,
        message: `Reduced to ${targetCount} colors (${colorsChanged} pixels changed).`
    };
}

/**
 * Analyze current texture colors
 */
export function analyzeColors(): { uniqueColors: number; dominantColors: RGB[] } {
    // @ts-ignore - Texture is a global from Blockbench
    const texture = Texture.all[0];

    if (!texture) {
        return { uniqueColors: 0, dominantColors: [] };
    }

    const canvas = texture.canvas;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return { uniqueColors: 0, dominantColors: [] };
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Count unique colors
    const colorSet = new Set<string>();
    const colors: RGB[] = [];

    for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a < 10) continue;

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const key = `${r},${g},${b}`;

        if (!colorSet.has(key)) {
            colorSet.add(key);
            colors.push({ r, g, b });
        }
    }

    const dominantColors = extractDominantColors(colors, 8);

    return {
        uniqueColors: colorSet.size,
        dominantColors
    };
}
