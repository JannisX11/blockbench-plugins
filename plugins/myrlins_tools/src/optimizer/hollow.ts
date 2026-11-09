/**
 * Hollow Interior - Remove boxes that aren't visible from outside
 *
 * SWITCHED OFF in 3.4.2 (HOLLOW_ENABLED = false): the 3.4.1 check judged cover from the raw from/to, but Hytale draws
 * a stretched box scaled about its center (166 of 168 gallery models use stretch), it sampled faces on a half-unit
 * grid and it counted hidden, faceless or transparent walls as cover, so it still removed visible boxes on 99 of 168
 * gallery models (forge-verifier-plugin, 2026-10-27 23:35Z). Until a rebuilt check (3.5.0) passes that harness,
 * hollowInterior() refuses and countInteriorCubes() reports 0. The 3.4.1 code below is kept, unreachable.
 */

import { getCubeBounds, BoundingBox, Vec3 } from '../utils/geometry';

/** Off until Hollow judges drawn (stretched) bounds and exact face cover; nothing can switch it on at runtime. */
export const HOLLOW_ENABLED = false;

/** What the plugin says instead of hollowing while it is off. */
export const HOLLOW_OFF_MESSAGE = 'Hollow Interior is switched off in this version and is coming back soon. No boxes were changed.';

interface HollowResult {
    originalCount: number;
    removedCount: number;
    finalCount: number;
    success: boolean;
    message: string;
}

/**
 * Build a 3D occupancy grid from cubes
 */
function buildOccupancyGrid(cubes: any[]): Map<string, any> {
    const grid = new Map<string, any>();

    for (const cube of cubes) {
        const bounds = getCubeBounds(cube);

        // For each unit cell the cube occupies
        for (let x = Math.floor(bounds.min.x); x < Math.ceil(bounds.max.x); x++) {
            for (let y = Math.floor(bounds.min.y); y < Math.ceil(bounds.max.y); y++) {
                for (let z = Math.floor(bounds.min.z); z < Math.ceil(bounds.max.z); z++) {
                    const key = `${x},${y},${z}`;
                    if (!grid.has(key)) {
                        grid.set(key, []);
                    }
                    grid.get(key)!.push(cube);
                }
            }
        }
    }

    return grid;
}

function hasRotation(node: any): boolean {
    const r = node && node.rotation;
    return !!r && (Math.abs(r[0] || 0) > 0.0001 || Math.abs(r[1] || 0) > 0.0001 || Math.abs(r[2] || 0) > 0.0001);
}

/**
 * True when the box or any group above it is rotated: its from/to bounds are
 * then not where it is drawn (Forge models rotate most groups).
 */
function isRotated(cube: any): boolean {
    let node = cube;
    for (let depth = 0; node && node !== 'root' && depth < 64; depth++) {
        if (hasRotation(node)) return true;
        node = node.parent;
    }
    return false;
}

/**
 * True when some other unrotated box contains the point.
 */
function pointCoveredByOther(cube: any, point: Vec3, grid: Map<string, any>, tolerance: number): boolean {
    const neighbors = grid.get(`${Math.floor(point.x)},${Math.floor(point.y)},${Math.floor(point.z)}`);
    if (!neighbors) return false;
    for (const neighbor of neighbors) {
        if (neighbor === cube || isRotated(neighbor)) continue;
        const nBounds = getCubeBounds(neighbor);
        if (point.x >= nBounds.min.x - tolerance && point.x <= nBounds.max.x + tolerance &&
            point.y >= nBounds.min.y - tolerance && point.y <= nBounds.max.y + tolerance &&
            point.z >= nBounds.min.z - tolerance && point.z <= nBounds.max.z + tolerance) {
            return true;
        }
    }
    return false;
}

/**
 * Check if a cube is completely interior (all faces covered)
 *
 * Samples each face on a half-unit grid, just outside the face, and needs every
 * sample inside another (unrotated) box. Rotated boxes are never removed and
 * never count as cover. 3.4.0 walked the face's own thickness (zero), so every
 * face looked covered and visible boxes were reported as hidden.
 */
function isInterior(cube: any, grid: Map<string, any>): boolean {
    if (isRotated(cube)) return false;
    const bounds = getCubeBounds(cube);
    const min = [bounds.min.x, bounds.min.y, bounds.min.z];
    const max = [bounds.max.x, bounds.max.y, bounds.max.z];
    const OUTSIDE = 0.01;
    const STEP = 0.5;

    for (let axis = 0; axis < 3; axis++) {
        const [a, b] = [0, 1, 2].filter(i => i !== axis);
        const spanA = max[a] - min[a];
        const spanB = max[b] - min[b];
        const nA = Math.max(1, Math.ceil(spanA / STEP));
        const nB = Math.max(1, Math.ceil(spanB / STEP));
        for (const dir of [-1, 1]) {
            const plane = dir > 0 ? max[axis] + OUTSIDE : min[axis] - OUTSIDE;
            for (let i = 0; i < nA; i++) {
                for (let j = 0; j < nB; j++) {
                    const coords = [0, 0, 0];
                    coords[axis] = plane;
                    coords[a] = min[a] + (i + 0.5) * spanA / nA;
                    coords[b] = min[b] + (j + 0.5) * spanB / nB;
                    if (!pointCoveredByOther(cube, { x: coords[0], y: coords[1], z: coords[2] }, grid, 0.001)) {
                        return false; // this face shows
                    }
                }
            }
        }
    }
    return true; // All faces are covered
}

/**
 * The 3.4.0 check, kept for reference (not called): its loops ran over the
 * face's own zero thickness, so every face counted as covered.
 */
function isInterior_3_4_0(cube: any, grid: Map<string, any>): boolean {
    const bounds = getCubeBounds(cube);
    const tolerance = 0.001;

    // Check each face direction
    const faces = [
        { dir: { x: 1, y: 0, z: 0 }, face: 'right' },   // +X
        { dir: { x: -1, y: 0, z: 0 }, face: 'left' },   // -X
        { dir: { x: 0, y: 1, z: 0 }, face: 'up' },      // +Y
        { dir: { x: 0, y: -1, z: 0 }, face: 'down' },   // -Y
        { dir: { x: 0, y: 0, z: 1 }, face: 'front' },   // +Z
        { dir: { x: 0, y: 0, z: -1 }, face: 'back' }    // -Z
    ];

    for (const { dir, face } of faces) {
        // Check if this face is covered by another cube
        let faceCovered = true;

        // Sample points on the face
        const faceMin: Vec3 = { x: 0, y: 0, z: 0 };
        const faceMax: Vec3 = { x: 0, y: 0, z: 0 };

        if (dir.x !== 0) {
            faceMin.x = faceMax.x = dir.x > 0 ? bounds.max.x : bounds.min.x;
            faceMin.y = bounds.min.y;
            faceMax.y = bounds.max.y;
            faceMin.z = bounds.min.z;
            faceMax.z = bounds.max.z;
        } else if (dir.y !== 0) {
            faceMin.y = faceMax.y = dir.y > 0 ? bounds.max.y : bounds.min.y;
            faceMin.x = bounds.min.x;
            faceMax.x = bounds.max.x;
            faceMin.z = bounds.min.z;
            faceMax.z = bounds.max.z;
        } else {
            faceMin.z = faceMax.z = dir.z > 0 ? bounds.max.z : bounds.min.z;
            faceMin.x = bounds.min.x;
            faceMax.x = bounds.max.x;
            faceMin.y = bounds.min.y;
            faceMax.y = bounds.max.y;
        }

        // Check if the adjacent space has cubes
        const checkX = Math.floor(faceMin.x + dir.x * 0.5);
        const checkY = Math.floor(faceMin.y + dir.y * 0.5);
        const checkZ = Math.floor(faceMin.z + dir.z * 0.5);

        // For each unit cell on the face, check if there's a neighbor
        for (let x = Math.floor(faceMin.x); x < Math.ceil(faceMax.x); x++) {
            for (let y = Math.floor(faceMin.y); y < Math.ceil(faceMax.y); y++) {
                for (let z = Math.floor(faceMin.z); z < Math.ceil(faceMax.z); z++) {
                    const neighborKey = `${x + dir.x},${y + dir.y},${z + dir.z}`;
                    const neighbors = grid.get(neighborKey);

                    if (!neighbors || neighbors.length === 0) {
                        faceCovered = false;
                        break;
                    }

                    // Check if any neighbor actually covers this point
                    const point = {
                        x: x + 0.5 + dir.x,
                        y: y + 0.5 + dir.y,
                        z: z + 0.5 + dir.z
                    };

                    let covered = false;
                    for (const neighbor of neighbors) {
                        if (neighbor === cube) continue;
                        const nBounds = getCubeBounds(neighbor);
                        if (point.x >= nBounds.min.x - tolerance && point.x <= nBounds.max.x + tolerance &&
                            point.y >= nBounds.min.y - tolerance && point.y <= nBounds.max.y + tolerance &&
                            point.z >= nBounds.min.z - tolerance && point.z <= nBounds.max.z + tolerance) {
                            covered = true;
                            break;
                        }
                    }

                    if (!covered) {
                        faceCovered = false;
                        break;
                    }
                }
                if (!faceCovered) break;
            }
            if (!faceCovered) break;
        }

        if (!faceCovered) {
            return false; // At least one face is exposed
        }
    }

    return true; // All faces are covered
}

/**
 * Run the hollow interior optimization
 */
export function hollowInterior(preserveShell: boolean = true): HollowResult {
    // @ts-ignore - Cube is a global from Blockbench
    const allCubes = Cube.all.filter((c: any) => c.export !== false);
    const originalCount = allCubes.length;

    if (!HOLLOW_ENABLED) {
        return {
            originalCount,
            removedCount: 0,
            finalCount: originalCount,
            success: false,
            message: HOLLOW_OFF_MESSAGE
        };
    }

    if (originalCount === 0) {
        return {
            originalCount: 0,
            removedCount: 0,
            finalCount: 0,
            success: false,
            message: 'No cubes found in the model.'
        };
    }

    // Build occupancy grid
    const grid = buildOccupancyGrid(allCubes);

    // Find interior cubes
    const interiorCubes: any[] = [];
    for (const cube of allCubes) {
        if (isInterior(cube, grid)) {
            interiorCubes.push(cube);
        }
    }

    if (interiorCubes.length === 0) {
        return {
            originalCount,
            removedCount: 0,
            finalCount: originalCount,
            success: true,
            message: 'No interior cubes found - model is already hollow.'
        };
    }

    // @ts-ignore - Undo is a global from Blockbench
    Undo.initEdit({ elements: interiorCubes, outliner: true });

    // Remove interior cubes
    for (const cube of interiorCubes) {
        cube.remove();
    }

    // @ts-ignore
    Undo.finishEdit('Hollow Interior (Myrlin\'s Tools)');

    // @ts-ignore - Canvas is a global from Blockbench
    Canvas.updateAll();

    const removedCount = interiorCubes.length;
    const finalCount = originalCount - removedCount;
    const reduction = Math.round((removedCount / originalCount) * 100);

    return {
        originalCount,
        removedCount,
        finalCount,
        success: true,
        message: `Hollowed: ${originalCount} → ${finalCount} boxes (removed ${removedCount}, ${reduction}% reduction)`
    };
}

/**
 * Count potential interior cubes without modifying the model
 */
export function countInteriorCubes(): number {
    // Off: report nothing, so no panel line or button invites a removal
    if (!HOLLOW_ENABLED) return 0;

    // @ts-ignore
    const allCubes = Cube.all.filter((c: any) => c.export !== false);

    if (allCubes.length === 0) return 0;

    const grid = buildOccupancyGrid(allCubes);

    let count = 0;
    for (const cube of allCubes) {
        if (isInterior(cube, grid)) {
            count++;
        }
    }

    return count;
}
