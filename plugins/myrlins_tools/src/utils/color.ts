/**
 * Color utilities for palette conversion and color space operations
 */

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface LAB {
    l: number;
    a: number;
    b: number;
}

/**
 * Convert RGB to LAB color space for perceptual color comparison
 */
export function rgbToLab(rgb: RGB): LAB {
    // First convert to XYZ
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;

    // sRGB to linear RGB
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    // Linear RGB to XYZ (D65 illuminant)
    let x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
    let y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
    let z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;

    // XYZ to LAB
    const refX = 0.95047;
    const refY = 1.00000;
    const refZ = 1.08883;

    x = x / refX;
    y = y / refY;
    z = z / refZ;

    x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
    y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
    z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

    return {
        l: (116 * y) - 16,
        a: 500 * (x - y),
        b: 200 * (y - z)
    };
}

/**
 * Calculate CIE76 Delta E (color difference)
 */
export function deltaE(lab1: LAB, lab2: LAB): number {
    return Math.sqrt(
        Math.pow(lab2.l - lab1.l, 2) +
        Math.pow(lab2.a - lab1.a, 2) +
        Math.pow(lab2.b - lab1.b, 2)
    );
}

/**
 * Find nearest color in a palette using LAB color space
 */
export function findNearestColor(color: RGB, palette: RGB[]): RGB {
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

/**
 * Convert hex color string to RGB
 */
export function hexToRgb(hex: string): RGB {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        return { r: 0, g: 0, b: 0 };
    }
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    };
}

/**
 * Convert RGB to hex color string
 */
export function rgbToHex(rgb: RGB): string {
    return '#' + [rgb.r, rgb.g, rgb.b]
        .map(x => Math.round(x).toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Get average color of multiple RGB colors
 */
export function averageColor(colors: RGB[]): RGB {
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

/**
 * Check if two colors are similar within a threshold
 */
export function colorsAreSimilar(a: RGB, b: RGB, threshold: number = 10): boolean {
    return deltaE(rgbToLab(a), rgbToLab(b)) < threshold;
}

/**
 * Extract dominant colors from an array using k-means clustering
 */
export function extractDominantColors(colors: RGB[], k: number = 8, maxIterations: number = 50): RGB[] {
    if (colors.length <= k) {
        return colors;
    }

    // Initialize centroids randomly
    let centroids: RGB[] = [];
    const usedIndices = new Set<number>();
    while (centroids.length < k) {
        const idx = Math.floor(Math.random() * colors.length);
        if (!usedIndices.has(idx)) {
            usedIndices.add(idx);
            centroids.push({ ...colors[idx] });
        }
    }

    for (let iter = 0; iter < maxIterations; iter++) {
        // Assign colors to nearest centroid
        const clusters: RGB[][] = Array.from({ length: k }, () => []);

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

        // Update centroids
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

        if (!changed) break;
    }

    return centroids;
}

// Built-in Hytale-style palettes
export const HYTALE_PALETTES = {
    official: [
        { r: 74, g: 63, b: 50 },    // Dark brown
        { r: 139, g: 119, b: 92 },  // Medium brown
        { r: 194, g: 178, b: 152 }, // Light brown
        { r: 67, g: 87, b: 58 },    // Dark green
        { r: 109, g: 143, b: 92 },  // Medium green
        { r: 162, g: 194, b: 133 }, // Light green
        { r: 58, g: 68, b: 92 },    // Dark blue
        { r: 92, g: 117, b: 150 },  // Medium blue
        { r: 147, g: 175, b: 207 }, // Light blue
        { r: 194, g: 152, b: 108 }, // Tan
        { r: 150, g: 92, b: 68 },   // Rust
        { r: 207, g: 175, b: 147 }  // Cream
    ],
    warm: [
        { r: 139, g: 69, b: 50 },   // Dark rust
        { r: 178, g: 92, b: 68 },   // Rust
        { r: 207, g: 133, b: 92 },  // Orange
        { r: 225, g: 175, b: 133 }, // Peach
        { r: 109, g: 74, b: 58 },   // Dark brown
        { r: 150, g: 109, b: 74 },  // Brown
        { r: 194, g: 152, b: 108 }, // Tan
        { r: 225, g: 207, b: 175 }  // Cream
    ],
    cool: [
        { r: 50, g: 58, b: 92 },    // Dark navy
        { r: 68, g: 92, b: 139 },   // Navy
        { r: 92, g: 133, b: 178 },  // Blue
        { r: 147, g: 175, b: 207 }, // Light blue
        { r: 58, g: 50, b: 74 },    // Dark purple
        { r: 92, g: 74, b: 109 },   // Purple
        { r: 139, g: 119, b: 150 }, // Lavender
        { r: 178, g: 162, b: 194 }  // Light lavender
    ],
    nature: [
        { r: 50, g: 58, b: 42 },    // Dark forest
        { r: 74, g: 92, b: 58 },    // Forest
        { r: 109, g: 139, b: 92 },  // Green
        { r: 150, g: 178, b: 133 }, // Light green
        { r: 74, g: 63, b: 50 },    // Dark bark
        { r: 109, g: 92, b: 74 },   // Bark
        { r: 150, g: 133, b: 109 }, // Light bark
        { r: 194, g: 178, b: 152 }  // Sand
    ]
};
