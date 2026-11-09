/**
 * Geometry utilities for box manipulation
 */

export interface Vec3 {
    x: number;
    y: number;
    z: number;
}

export interface BoundingBox {
    min: Vec3;
    max: Vec3;
}

export interface CubeData {
    uuid: string;
    from: [number, number, number];
    to: [number, number, number];
    faces: Record<string, any>;
    color?: number;
}

/**
 * Get the bounding box of a cube element
 */
export function getCubeBounds(cube: any): BoundingBox {
    return {
        min: { x: cube.from[0], y: cube.from[1], z: cube.from[2] },
        max: { x: cube.to[0], y: cube.to[1], z: cube.to[2] }
    };
}

/**
 * Calculate volume of a bounding box
 */
export function getVolume(bounds: BoundingBox): number {
    return (bounds.max.x - bounds.min.x) *
           (bounds.max.y - bounds.min.y) *
           (bounds.max.z - bounds.min.z);
}

/**
 * Get combined bounding box of two boxes
 */
export function combineBounds(a: BoundingBox, b: BoundingBox): BoundingBox {
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

/**
 * Check if two boxes share a complete face (are adjacent and aligned).
 * In strict mode (tolerance ~0.001), boxes must have identical dimensions on the shared face.
 * In fuzzy mode (tolerance ~0.5+), boxes with slightly different sizes/offsets can match.
 *
 * @param a - First bounding box
 * @param b - Second bounding box
 * @param tolerance - Edge snap tolerance (default 0.001 for exact, use 0.5 for fuzzy)
 */
export function sharesCompleteFace(a: BoundingBox, b: BoundingBox, tolerance: number = 0.001): boolean {
    // Check each axis for adjacency
    // X-axis adjacency (left/right faces)
    if (Math.abs(a.max.x - b.min.x) < tolerance || Math.abs(b.max.x - a.min.x) < tolerance) {
        const yOverlap = Math.min(a.max.y, b.max.y) - Math.max(a.min.y, b.min.y);
        const zOverlap = Math.min(a.max.z, b.max.z) - Math.max(a.min.z, b.min.z);
        const aYSize = a.max.y - a.min.y;
        const aZSize = a.max.z - a.min.z;
        const bYSize = b.max.y - b.min.y;
        const bZSize = b.max.z - b.min.z;

        if (Math.abs(aYSize - bYSize) < tolerance && Math.abs(aZSize - bZSize) < tolerance &&
            Math.abs(yOverlap - aYSize) < tolerance && Math.abs(zOverlap - aZSize) < tolerance) {
            return true;
        }
    }

    // Y-axis adjacency (top/bottom faces)
    if (Math.abs(a.max.y - b.min.y) < tolerance || Math.abs(b.max.y - a.min.y) < tolerance) {
        const xOverlap = Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x);
        const zOverlap = Math.min(a.max.z, b.max.z) - Math.max(a.min.z, b.min.z);
        const aXSize = a.max.x - a.min.x;
        const aZSize = a.max.z - a.min.z;
        const bXSize = b.max.x - b.min.x;
        const bZSize = b.max.z - b.min.z;

        if (Math.abs(aXSize - bXSize) < tolerance && Math.abs(aZSize - bZSize) < tolerance &&
            Math.abs(xOverlap - aXSize) < tolerance && Math.abs(zOverlap - aZSize) < tolerance) {
            return true;
        }
    }

    // Z-axis adjacency (front/back faces)
    if (Math.abs(a.max.z - b.min.z) < tolerance || Math.abs(b.max.z - a.min.z) < tolerance) {
        const xOverlap = Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x);
        const yOverlap = Math.min(a.max.y, b.max.y) - Math.max(a.min.y, b.min.y);
        const aXSize = a.max.x - a.min.x;
        const aYSize = a.max.y - a.min.y;
        const bXSize = b.max.x - b.min.x;
        const bYSize = b.max.y - b.min.y;

        if (Math.abs(aXSize - bXSize) < tolerance && Math.abs(aYSize - bYSize) < tolerance &&
            Math.abs(xOverlap - aXSize) < tolerance && Math.abs(yOverlap - aYSize) < tolerance) {
            return true;
        }
    }

    return false;
}

/**
 * Check if two boxes overlap or are within a tolerance distance on any axis.
 * More permissive than sharesCompleteFace: boxes don't need identical face sizes.
 * Used by fuzzy merge to find candidates that can be combined.
 *
 * @param a - First bounding box
 * @param b - Second bounding box
 * @param gap - Maximum gap between boxes to still consider adjacent (default 0.5)
 */
export function areNearby(a: BoundingBox, b: BoundingBox, gap: number = 0.5): boolean {
    // Check if boxes overlap or are within gap distance on ALL three axes
    const xSep = Math.max(a.min.x - b.max.x, b.min.x - a.max.x, 0);
    const ySep = Math.max(a.min.y - b.max.y, b.min.y - a.max.y, 0);
    const zSep = Math.max(a.min.z - b.max.z, b.min.z - a.max.z, 0);
    return xSep <= gap && ySep <= gap && zSep <= gap;
}

/**
 * Check if two boxes overlap in 3D space (share any interior volume).
 *
 * @param a - First bounding box
 * @param b - Second bounding box
 */
export function boxesOverlap(a: BoundingBox, b: BoundingBox): boolean {
    return a.min.x < b.max.x && a.max.x > b.min.x &&
           a.min.y < b.max.y && a.max.y > b.min.y &&
           a.min.z < b.max.z && a.max.z > b.min.z;
}

/**
 * Compute fill ratio: how much of the combined bounding box is filled by the two input boxes.
 * A ratio close to 1.0 means the merge wastes little empty space.
 *
 * @param a - First bounding box
 * @param b - Second bounding box
 * @returns Fill ratio between 0 and 1
 */
export function mergeFillRatio(a: BoundingBox, b: BoundingBox): number {
    const combined = combineBounds(a, b);
    const combinedVol = getVolume(combined);
    if (combinedVol <= 0) return 0;
    const volA = getVolume(a);
    const volB = getVolume(b);
    return (volA + volB) / combinedVol;
}

/**
 * Check if merging two boxes would result in a valid rectangular box
 */
export function canMergeToBox(a: BoundingBox, b: BoundingBox): boolean {
    const combined = combineBounds(a, b);
    const combinedVolume = getVolume(combined);
    const volumeA = getVolume(a);
    const volumeB = getVolume(b);

    // If combined volume equals sum of parts, merge creates valid box
    const tolerance = 0.001;
    return Math.abs(combinedVolume - (volumeA + volumeB)) < tolerance;
}

/**
 * Get the 6 neighbor positions for a unit cube at position
 */
export function getNeighborPositions(pos: Vec3): Vec3[] {
    return [
        { x: pos.x + 1, y: pos.y, z: pos.z },
        { x: pos.x - 1, y: pos.y, z: pos.z },
        { x: pos.x, y: pos.y + 1, z: pos.z },
        { x: pos.x, y: pos.y - 1, z: pos.z },
        { x: pos.x, y: pos.y, z: pos.z + 1 },
        { x: pos.x, y: pos.y, z: pos.z - 1 }
    ];
}

/**
 * Check if a point is inside a bounding box
 */
export function pointInBounds(point: Vec3, bounds: BoundingBox): boolean {
    return point.x >= bounds.min.x && point.x < bounds.max.x &&
           point.y >= bounds.min.y && point.y < bounds.max.y &&
           point.z >= bounds.min.z && point.z < bounds.max.z;
}

/**
 * Get dimensions of a bounding box
 */
export function getDimensions(bounds: BoundingBox): Vec3 {
    return {
        x: bounds.max.x - bounds.min.x,
        y: bounds.max.y - bounds.min.y,
        z: bounds.max.z - bounds.min.z
    };
}
