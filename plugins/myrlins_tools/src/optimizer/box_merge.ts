/**
 * Box Optimizer - Greedy merge algorithm to reduce box count
 *
 * This is the killer feature that solves the 255-box limit pain point.
 * Uses spatial hashing for O(n) performance on large models.
 */

import {
    getCubeBounds,
    getVolume,
    combineBounds,
    sharesCompleteFace,
    canMergeToBox,
    BoundingBox
} from '../utils/geometry';
import { clearPaintCache, getCubePaint, paintCoversMerge, samePaint } from './paint';
import { hytaleNodeBreakdown } from '../utils/hytale_nodes';

interface MergeResult {
    originalCount: number;
    optimizedCount: number;
    mergeCount: number;
    success: boolean;
    message: string;
}

/**
 * Spatial hash grid for fast neighbor lookups
 * Reduces O(n²) to O(n) for neighbor searches
 */
class SpatialHashGrid {
    private cellSize: number;
    private grid: Map<string, Set<any>>;
    private cubeKeys: Map<any, string[]>;

    constructor(cellSize: number = 16) {
        this.cellSize = cellSize;
        this.grid = new Map();
        this.cubeKeys = new Map();
    }

    private getKey(x: number, y: number, z: number): string {
        const cx = Math.floor(x / this.cellSize);
        const cy = Math.floor(y / this.cellSize);
        const cz = Math.floor(z / this.cellSize);
        return `${cx},${cy},${cz}`;
    }

    private getCellsForBounds(bounds: BoundingBox): string[] {
        const keys: string[] = [];
        const minCx = Math.floor(bounds.min.x / this.cellSize);
        const minCy = Math.floor(bounds.min.y / this.cellSize);
        const minCz = Math.floor(bounds.min.z / this.cellSize);
        const maxCx = Math.floor(bounds.max.x / this.cellSize);
        const maxCy = Math.floor(bounds.max.y / this.cellSize);
        const maxCz = Math.floor(bounds.max.z / this.cellSize);

        for (let cx = minCx; cx <= maxCx; cx++) {
            for (let cy = minCy; cy <= maxCy; cy++) {
                for (let cz = minCz; cz <= maxCz; cz++) {
                    keys.push(`${cx},${cy},${cz}`);
                }
            }
        }
        return keys;
    }

    insert(cube: any, bounds: BoundingBox): void {
        const keys = this.getCellsForBounds(bounds);
        this.cubeKeys.set(cube, keys);

        for (const key of keys) {
            if (!this.grid.has(key)) {
                this.grid.set(key, new Set());
            }
            this.grid.get(key)!.add(cube);
        }
    }

    remove(cube: any): void {
        const keys = this.cubeKeys.get(cube);
        if (!keys) return;

        for (const key of keys) {
            const cell = this.grid.get(key);
            if (cell) {
                cell.delete(cube);
                if (cell.size === 0) {
                    this.grid.delete(key);
                }
            }
        }
        this.cubeKeys.delete(cube);
    }

    update(cube: any, bounds: BoundingBox): void {
        this.remove(cube);
        this.insert(cube, bounds);
    }

    getNearby(bounds: BoundingBox): Set<any> {
        const nearby = new Set<any>();
        const keys = this.getCellsForBounds(bounds);

        for (const key of keys) {
            const cell = this.grid.get(key);
            if (cell) {
                for (const cube of cell) {
                    nearby.add(cube);
                }
            }
        }
        return nearby;
    }

    clear(): void {
        this.grid.clear();
        this.cubeKeys.clear();
    }
}

/**
 * Get a color signature for a cube based on its face textures/colors
 */
function getCubeColorSignature(cube: any): string {
    // For cubes with the same texture/UV, we can merge them
    // We create a signature based on texture and face assignments
    const faces = cube.faces || {};
    const parts: string[] = [];

    for (const face of ['north', 'south', 'east', 'west', 'up', 'down']) {
        const faceData = faces[face];
        if (faceData) {
            // Include texture and UV info in signature
            parts.push(`${face}:${faceData.texture || 'none'}`);
        }
    }

    // Also include the cube's color if set
    if (cube.color !== undefined) {
        parts.push(`color:${cube.color}`);
    }

    return parts.join('|');
}

/**
 * Check if two cubes can be merged based on their visual properties
 */
function cubesCanMerge(a: any, b: any): boolean {
    // Plan records (see MergeRecord) carry the real cube in .cube
    a = unwrapCube(a);
    b = unwrapCube(b);

    // Must be same type (both Cube)
    // @ts-ignore
    if (!(a instanceof Cube) || !(b instanceof Cube)) {
        return false;
    }

    // Must not be in different groups (bones)
    if (a.parent !== b.parent) {
        return false;
    }

    // One box keeps one rotation: both must turn the same way around the same pivot
    if (!sameRotation(a, b)) {
        return false;
    }

    // Hytale draws a stretched box scaled about its center, so merging stretched boxes changes their shape
    // (3.4.1 merged them; forge-verifier-plugin F2). Only boxes with stretch 1, 1, 1 merge.
    if (!isUnstretched(a) || !isUnstretched(b)) {
        return false;
    }

    // Anything else that changes how one box is drawn must match too
    if (!sameDrawing(a, b)) {
        return false;
    }

    // For simple merging, we check if cubes share the same color/texture
    // More advanced: could check if UVs align perfectly
    const sigA = getCubeColorSignature(a);
    const sigB = getCubeColorSignature(b);

    if (sigA !== sigB) {
        return false;
    }

    // Painted boxes only when every face is one flat color, the same on both
    // (3.4.0 merged any boxes sharing a texture and moved their paint)
    return samePaint(a, b);
}

function unwrapCube(x: any): any {
    return x && x.cube ? x.cube : x;
}

/** True when the box has no stretch (absent, or 1 on every axis). */
export function isUnstretched(cube: any): boolean {
    const s = cube && cube.stretch;
    if (!s) return true;
    for (let i = 0; i < 3; i++) {
        const v = s[i] === undefined || s[i] === null ? 1 : Number(s[i]);
        if (!(Math.abs(v - 1) <= 1e-6)) return false;
    }
    return true;
}

/** True when both boxes are drawn the same way apart from their size (inflate, visibility, sides, shading). */
function sameDrawing(a: any, b: any): boolean {
    const same = (x: any, y: any) => (x === undefined ? null : x) === (y === undefined ? null : y);
    if (Math.abs((a.inflate || 0) - (b.inflate || 0)) > 1e-6) return false;
    if (!same(a.visibility, b.visibility)) return false;
    if (!same(a.double_sided, b.double_sided)) return false;
    if (!same(a.shading_mode, b.shading_mode)) return false;
    return true;
}

function sameRotation(a: any, b: any): boolean {
    const ra = a.rotation || [0, 0, 0];
    const rb = b.rotation || [0, 0, 0];
    const tol = 0.0001;
    for (let i = 0; i < 3; i++) {
        if (Math.abs((ra[i] || 0) - (rb[i] || 0)) > tol) return false;
    }
    const rotated = ra.some((v: number) => Math.abs(v || 0) > tol);
    if (!rotated) return true;
    const oa = a.origin || [0, 0, 0];
    const ob = b.origin || [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        if (Math.abs((oa[i] || 0) - (ob[i] || 0)) > tol) return false;
    }
    return true;
}

/**
 * True when merging other into keep leaves keep's paint covering the result.
 * keep and other are plan records (or plain cubes, then nothing has grown yet).
 */
function mergeKeepsPaint(keep: any, other: any): boolean {
    const cube = unwrapCube(keep);
    const from0 = keep.from0 || cube.from;
    const to0 = keep.to0 || cube.to;
    const combined = combineBounds(getCubeBounds(keep), getCubeBounds(other));
    return paintCoversMerge(cube, from0, to0,
        [combined.min.x, combined.min.y, combined.min.z],
        [combined.max.x, combined.max.y, combined.max.z]);
}

/**
 * Find a mergeable neighbor for a given cube using spatial hash
 */
function findMergeableNeighbor(cube: any, spatialGrid: SpatialHashGrid): any | null {
    const bounds = getCubeBounds(cube);

    // Expand bounds slightly to catch adjacent cubes
    const searchBounds: BoundingBox = {
        min: { x: bounds.min.x - 1, y: bounds.min.y - 1, z: bounds.min.z - 1 },
        max: { x: bounds.max.x + 1, y: bounds.max.y + 1, z: bounds.max.z + 1 }
    };

    const nearby = spatialGrid.getNearby(searchBounds);

    for (const other of nearby) {
        if (other === cube) continue;
        if (other._markedForRemoval) continue;

        // Check if they can visually merge
        if (!cubesCanMerge(cube, other)) continue;

        const otherBounds = getCubeBounds(other);

        // Check if they share a complete face
        if (!sharesCompleteFace(bounds, otherBounds)) continue;

        // Check if merging creates a valid box
        if (!canMergeToBox(bounds, otherBounds)) continue;

        // The kept box's paint must still cover the merged box
        if (!mergeKeepsPaint(cube, other)) continue;

        return other;
    }

    return null;
}

/**
 * Find a mergeable neighbor (legacy O(n) scan for small models)
 */
function findMergeableNeighborLegacy(cube: any, cubes: any[]): any | null {
    const bounds = getCubeBounds(cube);

    for (const other of cubes) {
        if (other === cube) continue;
        if (other._markedForRemoval) continue;

        // Check if they can visually merge
        if (!cubesCanMerge(cube, other)) continue;

        const otherBounds = getCubeBounds(other);

        // Check if they share a complete face
        if (!sharesCompleteFace(bounds, otherBounds)) continue;

        // Check if merging creates a valid box
        if (!canMergeToBox(bounds, otherBounds)) continue;

        // The kept box's paint must still cover the merged box
        if (!mergeKeepsPaint(cube, other)) continue;

        return other;
    }

    return null;
}

/**
 * Merge two cubes into one
 */
function mergeCubes(a: any, b: any): void {
    const boundsA = getCubeBounds(a);
    const boundsB = getCubeBounds(b);
    const combined = combineBounds(boundsA, boundsB);

    // Update cube A to be the combined size
    a.from[0] = combined.min.x;
    a.from[1] = combined.min.y;
    a.from[2] = combined.min.z;
    a.to[0] = combined.max.x;
    a.to[1] = combined.max.y;
    a.to[2] = combined.max.z;

    // Mark cube B for removal
    b._markedForRemoval = true;
}

// Threshold for using spatial hashing vs linear scan
const SPATIAL_HASH_THRESHOLD = 500;

type MergeAxis = 'x' | 'y' | 'z';

/**
 * Find a mergeable neighbor strictly along one axis.
 * Both cubes must be adjacent on the specified axis AND share
 * identical bounds on the other two axes (within tolerance).
 */
function findMergeableNeighborOnAxis(
    cube: any,
    axis: MergeAxis,
    spatialGrid: SpatialHashGrid | null,
    allCubes: any[]
): any | null {
    const bounds = getCubeBounds(cube);
    const tolerance = 0.001;

    // Get candidates from spatial hash or fall back to full list
    let candidates: Iterable<any>;
    if (spatialGrid) {
        const searchBounds: BoundingBox = {
            min: { x: bounds.min.x - 1, y: bounds.min.y - 1, z: bounds.min.z - 1 },
            max: { x: bounds.max.x + 1, y: bounds.max.y + 1, z: bounds.max.z + 1 }
        };
        candidates = spatialGrid.getNearby(searchBounds);
    } else {
        candidates = allCubes;
    }

    for (const other of candidates) {
        if (other === cube) continue;
        if (other._markedForRemoval) continue;
        if (!cubesCanMerge(cube, other)) continue;

        const otherBounds = getCubeBounds(other);

        // Must be adjacent on the sweep axis, and match exactly on the other two
        if (axis === 'x') {
            // Adjacent on X?
            const adjacentX = Math.abs(bounds.max.x - otherBounds.min.x) < tolerance
                           || Math.abs(otherBounds.max.x - bounds.min.x) < tolerance;
            if (!adjacentX) continue;
            // Matching Y and Z bounds?
            if (Math.abs(bounds.min.y - otherBounds.min.y) > tolerance) continue;
            if (Math.abs(bounds.max.y - otherBounds.max.y) > tolerance) continue;
            if (Math.abs(bounds.min.z - otherBounds.min.z) > tolerance) continue;
            if (Math.abs(bounds.max.z - otherBounds.max.z) > tolerance) continue;
        } else if (axis === 'y') {
            const adjacentY = Math.abs(bounds.max.y - otherBounds.min.y) < tolerance
                           || Math.abs(otherBounds.max.y - bounds.min.y) < tolerance;
            if (!adjacentY) continue;
            if (Math.abs(bounds.min.x - otherBounds.min.x) > tolerance) continue;
            if (Math.abs(bounds.max.x - otherBounds.max.x) > tolerance) continue;
            if (Math.abs(bounds.min.z - otherBounds.min.z) > tolerance) continue;
            if (Math.abs(bounds.max.z - otherBounds.max.z) > tolerance) continue;
        } else { // z
            const adjacentZ = Math.abs(bounds.max.z - otherBounds.min.z) < tolerance
                           || Math.abs(otherBounds.max.z - bounds.min.z) < tolerance;
            if (!adjacentZ) continue;
            if (Math.abs(bounds.min.x - otherBounds.min.x) > tolerance) continue;
            if (Math.abs(bounds.max.x - otherBounds.max.x) > tolerance) continue;
            if (Math.abs(bounds.min.y - otherBounds.min.y) > tolerance) continue;
            if (Math.abs(bounds.max.y - otherBounds.max.y) > tolerance) continue;
        }

        // The kept box's paint must still cover the merged box
        if (!mergeKeepsPaint(cube, other)) continue;

        return other;
    }

    return null;
}

/**
 * A box during planning: copies of its bounds, so a dry run never touches the
 * model. from0/to0 keep the size the box had before the run (its UVs still
 * belong to that size).
 */
interface MergeRecord {
    cube: any;
    uuid: string;
    from: number[];
    to: number[];
    from0: number[];
    to0: number[];
    parent: any;
    _markedForRemoval?: boolean;
}

export interface MergePlan {
    records: MergeRecord[];
    /** Merges the run makes (each removes one box) */
    mergeCount: number;
    /** Boxes whose paint is more than one flat color: never merged */
    paintedSkipped: number;
    /** Exported boxes considered */
    boxCount: number;
    /** Groups (or the root) holding two or more boxes: the only places a merge can happen */
    sharedGroups: number;
    /** Boxes with stretch other than 1, 1, 1: never merged */
    stretchedSkipped: number;
}

/**
 * The merge passes of Optimize Boxes (axis sweep, then greedy), run on plan
 * records. Shared by optimizeBoxes() and estimateSavings(), so the estimate is
 * exactly what Optimize does.
 *
 * @returns number of merges made
 */
function runMergePasses(allCubes: MergeRecord[]): number {
    const originalCount = allCubes.length;
    let mergeCount = 0;
    let iterations = 0;
    const maxIterations = originalCount * 2; // Scale with model size

    // Use spatial hashing for large models
    const useSpatialHash = originalCount >= SPATIAL_HASH_THRESHOLD;
    let spatialGrid: SpatialHashGrid | null = null;

    if (useSpatialHash) {
        // Determine optimal cell size based on average cube size
        let totalSize = 0;
        for (const cube of allCubes) {
            const bounds = getCubeBounds(cube);
            totalSize += Math.max(
                bounds.max.x - bounds.min.x,
                bounds.max.y - bounds.min.y,
                bounds.max.z - bounds.min.z
            );
        }
        const avgSize = totalSize / originalCount;
        const cellSize = Math.max(4, Math.ceil(avgSize * 2));

        spatialGrid = new SpatialHashGrid(cellSize);

        // Build initial spatial index
        for (const cube of allCubes) {
            spatialGrid.insert(cube, getCubeBounds(cube));
        }
    }

    // Work list of active cubes (not yet fully processed)
    const activeCubes = new Set(allCubes);

    // ── Phase 1: Multi-pass axis sweep ──────────────────────────────
    // Merge along each axis sequentially. This produces better results
    // than greedy because it systematically reduces cubes into strips,
    // then slabs, then blocks (like 3D run-length encoding).
    const axisOrder: MergeAxis[] = ['x', 'y', 'z'];

    for (const axis of axisOrder) {
        let passChanged = true;
        let passIterations = 0;
        const passMaxIterations = activeCubes.size;

        while (passChanged && passIterations < passMaxIterations) {
            passChanged = false;
            passIterations++;

            for (const cube of activeCubes) {
                if (cube._markedForRemoval) {
                    activeCubes.delete(cube);
                    continue;
                }

                const neighbor = findMergeableNeighborOnAxis(
                    cube, axis, spatialGrid, allCubes
                );

                if (neighbor) {
                    if (spatialGrid) spatialGrid.remove(neighbor);
                    mergeCubes(cube, neighbor);
                    mergeCount++;
                    if (spatialGrid) spatialGrid.update(cube, getCubeBounds(cube));
                    activeCubes.delete(neighbor);
                    passChanged = true;
                    iterations++;
                }
            }
        }
    }

    // ── Phase 2: Greedy fallback ────────────────────────────────────
    // Catch any remaining merge opportunities the axis sweep missed
    // (e.g. diagonal arrangements or non-axis-aligned merges).
    let changed = true;

    while (changed && iterations < maxIterations) {
        changed = false;
        iterations++;

        for (const cube of activeCubes) {
            if (cube._markedForRemoval) {
                activeCubes.delete(cube);
                continue;
            }

            const neighbor = useSpatialHash && spatialGrid
                ? findMergeableNeighbor(cube, spatialGrid)
                : findMergeableNeighborLegacy(cube, allCubes);

            if (neighbor) {
                if (spatialGrid) {
                    spatialGrid.remove(neighbor);
                }

                mergeCubes(cube, neighbor);
                mergeCount++;

                if (spatialGrid) {
                    spatialGrid.update(cube, getCubeBounds(cube));
                }

                activeCubes.delete(neighbor);
                changed = true;
            }
        }
    }

    // Cleanup spatial grid
    if (spatialGrid) {
        spatialGrid.clear();
    }

    return mergeCount;
}

/**
 * Plan Optimize Boxes without touching the model.
 */
export function planMerges(): MergePlan {
    clearPaintCache();
    try {
        // @ts-ignore - Cube is a global from Blockbench
        const allCubes = Cube.all.filter((c: any) => c.export !== false);
        const records: MergeRecord[] = allCubes.map((c: any) => ({
            cube: c,
            uuid: c.uuid,
            from: c.from.slice(),
            to: c.to.slice(),
            from0: c.from.slice(),
            to0: c.to.slice(),
            parent: c.parent
        }));
        const paintedSkipped = allCubes.filter((c: any) => {
            const paint = getCubePaint(c);
            return paint.painted && !paint.flat;
        }).length;
        const perParent = new Map<any, number>();
        for (const c of allCubes) perParent.set(c.parent, (perParent.get(c.parent) || 0) + 1);
        const sharedGroups = [...perParent.values()].filter(n => n >= 2).length;
        const stretchedSkipped = allCubes.filter((c: any) => !isUnstretched(c)).length;
        const mergeCount = records.length > 1 ? runMergePasses(records) : 0;
        return { records, mergeCount, paintedSkipped, boxCount: allCubes.length, sharedGroups, stretchedSkipped };
    } finally {
        clearPaintCache();
    }
}

/**
 * Why a plan has nothing to merge, in plain words.
 */
export function nothingToMergeReason(plan: { paintedSkipped: number; boxCount: number; sharedGroups?: number; stretchedSkipped?: number }): string {
    if (plan.boxCount > 0 && plan.sharedGroups === 0) {
        return 'Every box sits in its own group, and boxes only merge inside one group. Each group with its box is one Hytale node either way.';
    }
    if (plan.boxCount > 0 && plan.stretchedSkipped === plan.boxCount) {
        return 'Every box is stretched. Hytale draws a stretched box scaled about its center, so merging would change its shape; Optimize leaves stretched boxes alone.';
    }
    if (plan.boxCount > 0 && plan.paintedSkipped === plan.boxCount) {
        return 'Every box is painted with its own texture area. Merging boxes would move their paint, so Optimize leaves them alone.';
    }
    if (plan.paintedSkipped > 0) {
        return `No two boxes in the same group share a full face, rotation and flat color. ${plan.paintedSkipped} painted box(es) are left alone so their paint stays where it is.`;
    }
    return 'No two boxes in the same group share a full face, rotation and texture.';
}

/**
 * Run the greedy box merge optimization
 * Uses spatial hashing for O(n) performance on large models
 */
/**
 * NOTE: merged boxes keep the first box's UVs, so only unpainted boxes and
 * boxes whose faces are one flat color (that still covers the merged face)
 * are merged; painted boxes are left alone (optimizer/paint.ts). Stretched
 * boxes (stretch other than 1, 1, 1) are never merged (3.4.2).
 */
export function optimizeBoxes(): MergeResult {
    // @ts-ignore - Cube is a global from Blockbench
    const allCubes = Cube.all.filter((c: any) => c.export !== false);
    const originalCount = allCubes.length;

    if (originalCount === 0) {
        return {
            originalCount: 0,
            optimizedCount: 0,
            mergeCount: 0,
            success: false,
            message: 'No cubes found in the model.'
        };
    }

    const plan = planMerges();
    if (plan.mergeCount === 0) {
        return {
            originalCount,
            optimizedCount: originalCount,
            mergeCount: 0,
            success: true,
            message: `Nothing to merge. ${nothingToMergeReason(plan)}`
        };
    }

    const nodesBefore = hytaleNodeBreakdown().nodes;

    // @ts-ignore - Undo is a global from Blockbench
    Undo.initEdit({ elements: allCubes, outliner: true });

    // Grow the kept boxes, then remove the merged-away ones
    for (const rec of plan.records) {
        if (rec._markedForRemoval) continue;
        for (let i = 0; i < 3; i++) {
            rec.cube.from[i] = rec.from[i];
            rec.cube.to[i] = rec.to[i];
        }
    }
    for (const rec of plan.records) {
        if (rec._markedForRemoval) rec.cube.remove();
    }

    // @ts-ignore
    Undo.finishEdit("Optimize Boxes (Myrlin's Tools)");

    // @ts-ignore - Canvas is a global from Blockbench
    Canvas.updateAll();

    const mergeCount = plan.mergeCount;
    const optimizedCount = originalCount - mergeCount;
    const reduction = originalCount > 0 ? Math.round((mergeCount / originalCount) * 100) : 0;
    const nodesAfter = hytaleNodeBreakdown().nodes;

    return {
        originalCount,
        optimizedCount,
        mergeCount,
        success: true,
        message: `Optimized: ${originalCount} → ${optimizedCount} boxes (${reduction}% reduction), ${nodesBefore} → ${nodesAfter} Hytale nodes`
    };
}

/**
 * The 3.4.0 optimizer, kept for reference (not called): it mutated the model
 * as it planned and merged boxes with any shared texture, moving their paint.
 */
/**
 * Run the greedy box merge optimization
 * Uses spatial hashing for O(n) performance on large models
 */
/**
 * NOTE: UV preservation is not currently supported. Merging cubes
 * will invalidate per-face UVs on the merged result. This is acceptable
 * for solid-color voxel models but not for per-face textured models.
 */
function optimizeBoxes_3_4_0(): MergeResult {
    // @ts-ignore - Cube is a global from Blockbench
    const allCubes = Cube.all.filter((c: any) => c.export !== false);
    const originalCount = allCubes.length;

    if (originalCount === 0) {
        return {
            originalCount: 0,
            optimizedCount: 0,
            mergeCount: 0,
            success: false,
            message: 'No cubes found in the model.'
        };
    }

    // @ts-ignore - Undo is a global from Blockbench
    Undo.initEdit({ elements: allCubes });

    let mergeCount = 0;
    let iterations = 0;
    const maxIterations = originalCount * 2; // Scale with model size

    // Use spatial hashing for large models
    const useSpatialHash = originalCount >= SPATIAL_HASH_THRESHOLD;
    let spatialGrid: SpatialHashGrid | null = null;

    if (useSpatialHash) {
        // Determine optimal cell size based on average cube size
        let totalSize = 0;
        for (const cube of allCubes) {
            const bounds = getCubeBounds(cube);
            totalSize += Math.max(
                bounds.max.x - bounds.min.x,
                bounds.max.y - bounds.min.y,
                bounds.max.z - bounds.min.z
            );
        }
        const avgSize = totalSize / originalCount;
        const cellSize = Math.max(4, Math.ceil(avgSize * 2));

        spatialGrid = new SpatialHashGrid(cellSize);

        // Build initial spatial index
        for (const cube of allCubes) {
            spatialGrid.insert(cube, getCubeBounds(cube));
        }
    }

    // Work list of active cubes (not yet fully processed)
    const activeCubes = new Set(allCubes);

    // ── Phase 1: Multi-pass axis sweep ──────────────────────────────
    // Merge along each axis sequentially. This produces better results
    // than greedy because it systematically reduces cubes into strips,
    // then slabs, then blocks (like 3D run-length encoding).
    const axisOrder: MergeAxis[] = ['x', 'y', 'z'];

    for (const axis of axisOrder) {
        let passChanged = true;
        let passIterations = 0;
        const passMaxIterations = activeCubes.size;

        while (passChanged && passIterations < passMaxIterations) {
            passChanged = false;
            passIterations++;

            for (const cube of activeCubes) {
                if (cube._markedForRemoval) {
                    activeCubes.delete(cube);
                    continue;
                }

                const neighbor = findMergeableNeighborOnAxis(
                    cube, axis, spatialGrid, allCubes
                );

                if (neighbor) {
                    if (spatialGrid) spatialGrid.remove(neighbor);
                    mergeCubes(cube, neighbor);
                    mergeCount++;
                    if (spatialGrid) spatialGrid.update(cube, getCubeBounds(cube));
                    activeCubes.delete(neighbor);
                    passChanged = true;
                    iterations++;
                }
            }
        }
    }

    // ── Phase 2: Greedy fallback ────────────────────────────────────
    // Catch any remaining merge opportunities the axis sweep missed
    // (e.g. diagonal arrangements or non-axis-aligned merges).
    let changed = true;

    while (changed && iterations < maxIterations) {
        changed = false;
        iterations++;

        for (const cube of activeCubes) {
            if (cube._markedForRemoval) {
                activeCubes.delete(cube);
                continue;
            }

            const neighbor = useSpatialHash && spatialGrid
                ? findMergeableNeighbor(cube, spatialGrid)
                : findMergeableNeighborLegacy(cube, allCubes);

            if (neighbor) {
                if (spatialGrid) {
                    spatialGrid.remove(neighbor);
                }

                mergeCubes(cube, neighbor);
                mergeCount++;

                if (spatialGrid) {
                    spatialGrid.update(cube, getCubeBounds(cube));
                }

                activeCubes.delete(neighbor);
                changed = true;
            }
        }
    }

    // Cleanup spatial grid
    if (spatialGrid) {
        spatialGrid.clear();
    }

    // Remove marked cubes
    const toRemove = allCubes.filter((c: any) => c._markedForRemoval);
    for (const cube of toRemove) {
        delete cube._markedForRemoval;
        cube.remove();
    }

    // Update remaining cubes
    const remaining = allCubes.filter((c: any) => !c._markedForRemoval);
    for (const cube of remaining) {
        delete cube._markedForRemoval;
    }

    // @ts-ignore
    Undo.finishEdit('Optimize Boxes (Myrlin\'s Tools)');

    // @ts-ignore - Canvas is a global from Blockbench
    Canvas.updateAll();

    const optimizedCount = originalCount - mergeCount;
    const reduction = originalCount > 0 ? Math.round((mergeCount / originalCount) * 100) : 0;

    return {
        originalCount,
        optimizedCount,
        mergeCount,
        success: true,
        message: `Optimized: ${originalCount} → ${optimizedCount} boxes (${reduction}% reduction)`
    };
}

export interface SavingsEstimate {
    /** Boxes now */
    current: number;
    /** Boxes after Optimize */
    potential: number;
    /** Boxes Optimize removes */
    savings: number;
    /** Hytale nodes now and after Optimize, and the difference */
    nodesBefore: number;
    nodesAfter: number;
    nodeSavings: number;
    /** Boxes left alone because their paint is not one flat color */
    paintedSkipped: number;
    /** Groups (or the root) holding two or more boxes */
    sharedGroups: number;
    /** Boxes left alone because they are stretched */
    stretchedSkipped: number;
}

/**
 * What Optimize Boxes will do, without modifying the model: a dry run of the
 * same merge passes (until 3.4.1 this counted adjacent pairs, which did not
 * match what Optimize did).
 */
export function estimateSavings(): SavingsEstimate {
    // @ts-ignore
    const current = Cube.all.filter((c: any) => c.export !== false).length;
    const nodesBefore = hytaleNodeBreakdown().nodes;
    if (current === 0) {
        return { current: 0, potential: 0, savings: 0, nodesBefore, nodesAfter: nodesBefore, nodeSavings: 0, paintedSkipped: 0, sharedGroups: 0, stretchedSkipped: 0 };
    }
    const plan = planMerges();
    const removed = new Set(plan.records.filter(r => r._markedForRemoval).map(r => r.cube));
    const nodesAfter = removed.size > 0 ? hytaleNodeBreakdown(removed).nodes : nodesBefore;
    return {
        current,
        potential: current - plan.mergeCount,
        savings: plan.mergeCount,
        nodesBefore,
        nodesAfter,
        nodeSavings: nodesBefore - nodesAfter,
        paintedSkipped: plan.paintedSkipped,
        sharedGroups: plan.sharedGroups,
        stretchedSkipped: plan.stretchedSkipped
    };
}

/**
 * The 3.4.0 estimate, kept for reference (not called): it counted adjacent
 * same-texture pairs, capped at half the boxes, so it did not match Optimize.
 */
/**
 * Estimate potential savings without modifying the model
 * Uses spatial hashing for O(n) performance on large models
 */
function estimateSavingsPairs_3_4_0(): { current: number; potential: number; savings: number } {
    // @ts-ignore
    const allCubes = Cube.all.filter((c: any) => c.export !== false);
    const current = allCubes.length;

    if (current === 0) {
        return { current: 0, potential: 0, savings: 0 };
    }

    // Quick estimate: count adjacent same-material pairs
    let potentialMerges = 0;

    // Use spatial hashing for large models
    if (current >= SPATIAL_HASH_THRESHOLD) {
        const spatialGrid = new SpatialHashGrid(16);

        // Build spatial index
        for (const cube of allCubes) {
            spatialGrid.insert(cube, getCubeBounds(cube));
        }

        // Check each cube against nearby cubes only
        const checked = new Set<string>();
        for (const cube of allCubes) {
            const bounds = getCubeBounds(cube);
            const searchBounds: BoundingBox = {
                min: { x: bounds.min.x - 1, y: bounds.min.y - 1, z: bounds.min.z - 1 },
                max: { x: bounds.max.x + 1, y: bounds.max.y + 1, z: bounds.max.z + 1 }
            };

            const nearby = spatialGrid.getNearby(searchBounds);

            for (const other of nearby) {
                if (other === cube) continue;

                // Create unique pair key to avoid double counting
                const pairKey = cube.uuid < other.uuid
                    ? `${cube.uuid}-${other.uuid}`
                    : `${other.uuid}-${cube.uuid}`;

                if (checked.has(pairKey)) continue;
                checked.add(pairKey);

                if (!cubesCanMerge(cube, other)) continue;

                const otherBounds = getCubeBounds(other);

                if (sharesCompleteFace(bounds, otherBounds) && canMergeToBox(bounds, otherBounds)) {
                    potentialMerges++;
                }
            }
        }

        spatialGrid.clear();
    } else {
        // Original O(n²) for small models
        for (let i = 0; i < allCubes.length; i++) {
            for (let j = i + 1; j < allCubes.length; j++) {
                const a = allCubes[i];
                const b = allCubes[j];

                if (!cubesCanMerge(a, b)) continue;

                const boundsA = getCubeBounds(a);
                const boundsB = getCubeBounds(b);

                if (sharesCompleteFace(boundsA, boundsB) && canMergeToBox(boundsA, boundsB)) {
                    potentialMerges++;
                }
            }
        }
    }

    // Rough estimate (actual savings may differ due to iterative merging)
    const estimatedSavings = Math.min(potentialMerges, Math.floor(current * 0.5));

    return {
        current,
        potential: current - estimatedSavings,
        savings: estimatedSavings
    };
}
