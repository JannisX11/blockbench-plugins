/**
 * Power Tools - Interactive model editing and optimization tools
 *
 * 8 tools for fast model cleanup, optimization, and construction:
 * 1. Smart Merge (Strict) - merge cubes sharing exact faces
 * 2. Smart Merge (Fuzzy) - merge nearby cubes with relaxed alignment (non-voxel imports)
 * 3. Convert to Quad - flatten thin cuboids into zero-depth quads
 * 4. Auto-Group - cluster cubes by spatial proximity with adaptive threshold
 * 5. Hierarchy Builder - structure flat cubes into humanoid skeleton
 * 6. Smart Rename - auto-name by spatial position (asset-type agnostic)
 * 7. Smart Optimize - full model restructuring with user-controlled detail level
 * 8. Merge Brush - click-drag over cubes to paint-select and merge into one cuboid
 *
 * @module power_tools
 */

import { track } from '../utils/cleanup';
import {
    getCubeBounds,
    combineBounds,
    sharesCompleteFace,
    canMergeToBox,
    areNearby,
    mergeFillRatio,
    getVolume,
    getDimensions,
    BoundingBox,
    Vec3,
} from '../utils/geometry';

// ─── Tool 1: Smart Merge ────────────────────────────────────────────

/** Minimum fill ratio for fuzzy merge: combined box must be >= 70% filled */
const FUZZY_FILL_THRESHOLD = 0.70;
/** Default gap tolerance for fuzzy mode (units) */
const FUZZY_GAP = 0.5;

/**
 * Merge selected cubes into larger cuboids. Two modes:
 *
 * Strict (default): cubes must share a complete aligned face and produce an exact box.
 * Fuzzy (shift+click or via menu): cubes within 0.5 unit gap are merged if the resulting
 * bounding box is >= 70% filled. Ignores color differences. Good for non-voxel imports.
 *
 * @param fuzzy - When true, use relaxed adjacency and fill-ratio check
 */
function smartMerge(fuzzy: boolean = false): void {
    // @ts-ignore - Cube is a Blockbench global
    const selected: any[] = [...Cube.selected];
    if (selected.length < 2) {
        // @ts-ignore - Blockbench global
        Blockbench.showQuickMessage('Select 2+ cubes to merge', 2000);
        return;
    }

    // @ts-ignore - Undo is a Blockbench global
    Undo.initEdit({ elements: selected });

    const active = new Set<any>(selected);
    let mergeCount = 0;
    let changed = true;
    let iterations = 0;
    const maxIterations = selected.length * 3;

    while (changed && iterations < maxIterations) {
        changed = false;
        iterations++;

        for (const cube of active) {
            if (cube._ptRemoved) continue;
            const boundsA = getCubeBounds(cube);

            // Sort candidates by distance so we merge the closest first
            const candidates: Array<{ other: any; boundsB: BoundingBox }> = [];
            for (const other of active) {
                if (other === cube || other._ptRemoved) continue;
                // In strict mode require same parent; fuzzy mode relaxes this
                if (!fuzzy && cube.parent !== other.parent) continue;
                candidates.push({ other, boundsB: getCubeBounds(other) });
            }

            for (const { other, boundsB } of candidates) {
                let canMerge = false;

                if (fuzzy) {
                    // Fuzzy: boxes within gap distance and fill ratio is acceptable
                    if (areNearby(boundsA, boundsB, FUZZY_GAP)) {
                        const ratio = mergeFillRatio(boundsA, boundsB);
                        canMerge = ratio >= FUZZY_FILL_THRESHOLD;
                    }
                } else {
                    // Strict: exact face sharing + valid box
                    canMerge = sharesCompleteFace(boundsA, boundsB) && canMergeToBox(boundsA, boundsB);
                }

                if (!canMerge) continue;

                // Merge other into cube
                const combined = combineBounds(boundsA, boundsB);
                cube.from[0] = combined.min.x;
                cube.from[1] = combined.min.y;
                cube.from[2] = combined.min.z;
                cube.to[0] = combined.max.x;
                cube.to[1] = combined.max.y;
                cube.to[2] = combined.max.z;

                other._ptRemoved = true;
                mergeCount++;
                changed = true;
                break;
            }
        }
    }

    // Remove merged-away cubes
    for (const cube of active) {
        if (cube._ptRemoved) {
            delete cube._ptRemoved;
            cube.remove();
        } else {
            delete cube._ptRemoved;
        }
    }

    // @ts-ignore - Undo is a Blockbench global
    Undo.finishEdit('Smart Merge (Power Tools)');

    // @ts-ignore - Canvas is a Blockbench global
    Canvas.updateAll();

    const mode = fuzzy ? 'fuzzy' : 'strict';
    const finalCount = selected.length - mergeCount;
    // @ts-ignore - Blockbench global
    Blockbench.showQuickMessage(
        `[${mode}] Merged ${selected.length} cubes into ${finalCount} cuboids (saved ${mergeCount})`,
        3000
    );
    console.log(`[Power Tools] Smart Merge (${mode}): ${selected.length} -> ${finalCount}`);
}

// ─── Tool 2: Convert to Quad ────────────────────────────────────────

/**
 * Flatten thin cuboids into quads (zero-depth planes).
 * A cube is considered "thin" when its smallest dimension is less than
 * 1 unit or less than 10% of its largest dimension.
 * Useful for eyes, eyelids, hair strands, leaves, and flat decorations.
 */
function convertToQuad(): void {
    // @ts-ignore - Cube is a Blockbench global
    const selected: any[] = [...Cube.selected];
    if (selected.length === 0) {
        // @ts-ignore - Blockbench global
        Blockbench.showQuickMessage('Select cubes to convert to quads', 2000);
        return;
    }

    // @ts-ignore - Undo is a Blockbench global
    Undo.initEdit({ elements: selected });

    let convertedCount = 0;

    for (const cube of selected) {
        const dx = Math.abs(cube.to[0] - cube.from[0]);
        const dy = Math.abs(cube.to[1] - cube.from[1]);
        const dz = Math.abs(cube.to[2] - cube.from[2]);
        const dims = [dx, dy, dz];
        const maxDim = Math.max(...dims);
        const minDim = Math.min(...dims);
        const minAxis = dims.indexOf(minDim);

        // Thin if smallest dim < 1 or < 10% of largest
        if (minDim >= 1 && (maxDim === 0 || minDim / maxDim >= 0.1)) {
            continue;
        }

        // Collapse the thin axis to zero
        if (minAxis === 0) {
            cube.to[0] = cube.from[0];
        } else if (minAxis === 1) {
            cube.to[1] = cube.from[1];
        } else {
            cube.to[2] = cube.from[2];
        }
        convertedCount++;
    }

    // @ts-ignore - Undo is a Blockbench global
    Undo.finishEdit('Convert to Quad (Power Tools)');

    // @ts-ignore - Canvas is a Blockbench global
    Canvas.updateAll();

    // @ts-ignore - Blockbench global
    Blockbench.showQuickMessage(`Converted ${convertedCount} cuboids to quads`, 2000);
    console.log(`[Power Tools] Convert to Quad: ${convertedCount}/${selected.length}`);
}

// ─── Tool 2b: Flatten Selected Face to Quad ────────────────────────

/**
 * Flatten a selected cuboid on a chosen axis to create a quad.
 * Shows a dialog letting the user pick which axis to collapse (X, Y, or Z).
 * The cuboid keeps its position and the other two dimensions, but one axis
 * becomes zero. This is how blade edges, hair, eyelids, and flat decorations
 * are made in Hytale models.
 *
 * If multiple cubes are selected, all are flattened on the same axis.
 */
function flattenToQuad(): void {
    // @ts-ignore - Cube is a Blockbench global
    const selected: any[] = [...Cube.selected];
    if (selected.length === 0) {
        // @ts-ignore - Blockbench global
        Blockbench.showQuickMessage('Select cubes to flatten into quads', 2000);
        return;
    }

    // Determine which axis is thinnest across all selected for the default
    let totalDims = [0, 0, 0];
    for (const cube of selected) {
        totalDims[0] += Math.abs(cube.to[0] - cube.from[0]);
        totalDims[1] += Math.abs(cube.to[1] - cube.from[1]);
        totalDims[2] += Math.abs(cube.to[2] - cube.from[2]);
    }
    const defaultAxis = totalDims.indexOf(Math.min(...totalDims));
    const axisNames = ['X (left/right)', 'Y (up/down)', 'Z (front/back)'];

    // @ts-ignore - Blockbench global
    const dialog = new Dialog({
        id: 'myrlin_flatten_quad_dialog',
        title: 'Flatten to Quad',
        form: {
            info: {
                type: 'info',
                text: `Collapse **${selected.length}** cuboid(s) into flat quads. Pick which axis to flatten.`,
            },
            axis: {
                label: 'Flatten Axis',
                type: 'select',
                value: String(defaultAxis),
                options: { '0': axisNames[0], '1': axisNames[1], '2': axisNames[2] },
                description: 'The axis that becomes zero-depth',
            },
        },
        onConfirm(formData: Record<string, any>) {
            const axis = parseInt(formData.axis as string, 10);

            // @ts-ignore - Undo is a Blockbench global
            Undo.initEdit({ elements: selected });

            let converted = 0;
            for (const cube of selected) {
                const mid = (cube.from[axis] + cube.to[axis]) / 2;
                cube.from[axis] = mid;
                cube.to[axis] = mid;
                cube.name = cube.name.replace(/_Body$/, '_Quad');
                if (!cube.name.includes('Quad')) cube.name += '_Quad';
                converted++;
            }

            // @ts-ignore - Undo is a Blockbench global
            Undo.finishEdit('Flatten to Quad (Power Tools)');
            // @ts-ignore - Canvas is a Blockbench global
            Canvas.updateAll();

            // @ts-ignore - Blockbench global
            Blockbench.showQuickMessage(`Flattened ${converted} cuboids to quads on ${axisNames[axis]}`, 3000);
            console.log(`[Power Tools] Flatten to Quad: ${converted} cubes on axis ${axis}`);
        },
    });
    dialog.show();
}

// ─── Tool 3: Auto-Group ─────────────────────────────────────────────

/**
 * Compute the centroid (center point) of a cube element.
 * @param cube - Blockbench Cube with from/to arrays
 * @returns [x, y, z] centroid coordinates
 */
function getCentroid(cube: any): [number, number, number] {
    return [
        (cube.from[0] + cube.to[0]) / 2,
        (cube.from[1] + cube.to[1]) / 2,
        (cube.from[2] + cube.to[2]) / 2,
    ];
}

/**
 * Euclidean distance between two 3D points.
 * @param a - First point [x, y, z]
 * @param b - Second point [x, y, z]
 * @returns Distance
 */
function dist3(a: [number, number, number], b: [number, number, number]): number {
    return Math.sqrt(
        (a[0] - b[0]) ** 2 +
        (a[1] - b[1]) ** 2 +
        (a[2] - b[2]) ** 2
    );
}

/**
 * Find the optimal clustering threshold by looking for the largest relative
 * gap in nearest-neighbor distances. Each cube's nearest neighbor distance
 * is computed, sorted, and we look for the biggest jump. This is more robust
 * than pairwise distances because it focuses on local connectivity.
 *
 * Target: 3-8 clusters for typical models. Falls back to modelDiag / 4.
 *
 * @param centroids - Array of [x,y,z] centroid positions
 * @param modelDiag - Diagonal of the full model bounding box
 * @returns Adaptive distance threshold
 */
function findAdaptiveThreshold(centroids: [number, number, number][], modelDiag: number): number {
    const n = centroids.length;
    if (n <= 2) return modelDiag;

    // Compute each point's nearest-neighbor distance
    const nnDists: number[] = [];
    for (let i = 0; i < n; i++) {
        let minD = Infinity;
        for (let j = 0; j < n; j++) {
            if (i === j) continue;
            const d = dist3(centroids[i], centroids[j]);
            if (d < minD) minD = d;
        }
        nnDists.push(minD);
    }
    nnDists.sort((a, b) => a - b);

    // The "elbow" in sorted NN distances indicates where clusters separate.
    // Look for the biggest ratio jump in the upper half of NN distances.
    // (Lower half is intra-cluster distances, upper half transitions to inter-cluster)
    const startIdx = Math.floor(n * 0.4);
    let bestRatio = 0;
    let bestIdx = startIdx;
    for (let i = startIdx; i < n - 1; i++) {
        if (nnDists[i] === 0) continue;
        const ratio = nnDists[i + 1] / nnDists[i];
        if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIdx = i;
        }
    }

    // Use the NN distance at the elbow, with a multiplier so the threshold
    // captures cubes that are "connected" (within ~3x the typical NN distance)
    const elbowThreshold = nnDists[bestIdx] * 3.0;
    const fallback = modelDiag / 4;

    // Only trust the elbow if the jump is dramatic (> 2x) AND the resulting
    // threshold would create a reasonable number of groups (not too many)
    // The elbow threshold must also be at least 15% of the model diagonal
    // to avoid over-splitting
    if (bestRatio > 2.0 && elbowThreshold > modelDiag * 0.15) {
        return elbowThreshold;
    }

    return fallback;
}

/**
 * Group selected cubes by spatial proximity using hierarchical agglomerative
 * clustering with automatic target group count.
 * Targets 3-8 groups depending on model complexity. Uses centroid linkage
 * so elongated models (swords, staffs) get properly segmented.
 */
function autoGroup(): void {
    // @ts-ignore - Cube is a Blockbench global
    const selected: any[] = [...Cube.selected];
    if (selected.length < 2) {
        // @ts-ignore - Blockbench global
        Blockbench.showQuickMessage('Select 2+ cubes to auto-group', 2000);
        return;
    }

    const centroids: [number, number, number][] = selected.map(getCentroid);

    // Target group count: scale with cube count, clamped to 3-8
    const targetGroups = Math.max(3, Math.min(8, Math.round(Math.sqrt(selected.length))));

    // Use hierarchical clustering and find threshold that gives target groups.
    // Binary search for the threshold that yields closest to targetGroups clusters.
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (const [cx, cy, cz] of centroids) {
        minX = Math.min(minX, cx); maxX = Math.max(maxX, cx);
        minY = Math.min(minY, cy); maxY = Math.max(maxY, cy);
        minZ = Math.min(minZ, cz); maxZ = Math.max(maxZ, cz);
    }
    const modelDiag = Math.sqrt(
        (maxX - minX) ** 2 + (maxY - minY) ** 2 + (maxZ - minZ) ** 2
    );

    // Binary search for threshold that gives ~targetGroups clusters
    let lo = 0, hi = modelDiag;
    let bestThreshold = modelDiag / 4;
    let bestDiff = Infinity;

    for (let iter = 0; iter < 20; iter++) {
        const mid = (lo + hi) / 2;
        const ids = hierarchicalCluster(centroids, mid);
        const numClusters = new Set(ids).size;
        const diff = Math.abs(numClusters - targetGroups);

        if (diff < bestDiff || (diff === bestDiff && numClusters >= targetGroups)) {
            bestDiff = diff;
            bestThreshold = mid;
        }

        if (numClusters > targetGroups) {
            lo = mid; // threshold too small, merge more
        } else if (numClusters < targetGroups) {
            hi = mid; // threshold too large, split more
        } else {
            break; // exact match
        }
    }

    const clusterIds = hierarchicalCluster(centroids, bestThreshold);
    const clusters = new Map<number, number[]>();
    for (let i = 0; i < selected.length; i++) {
        const cid = clusterIds[i];
        if (!clusters.has(cid)) clusters.set(cid, []);
        clusters.get(cid)!.push(i);
    }

    console.log(`[Power Tools] Auto-Group: target=${targetGroups}, got ${clusters.size} groups (threshold=${bestThreshold.toFixed(1)})`);

    if (clusters.size <= 1) {
        // @ts-ignore - Blockbench global
        Blockbench.showQuickMessage('All cubes form a single region, no distinct groups found', 2000);
        return;
    }

    // @ts-ignore - Undo is a Blockbench global
    Undo.initEdit({ elements: selected });

    // Sort clusters by average Y position (bottom to top)
    const sortedClusters = [...clusters.entries()].sort((a, b) => {
        const avgYA = a[1].reduce((s, i) => s + centroids[i][1], 0) / a[1].length;
        const avgYB = b[1].reduce((s, i) => s + centroids[i][1], 0) / b[1].length;
        return avgYA - avgYB;
    });

    let groupIndex = 1;
    for (const [, indices] of sortedClusters) {
        // @ts-ignore - Group is a Blockbench global
        const group = new Group({
            name: `Region_${groupIndex}`,
            origin: [0, 0, 0],
        }).init();
        track(group);

        for (const idx of indices) {
            selected[idx].addTo(group);
        }
        groupIndex++;
    }

    // @ts-ignore - Undo is a Blockbench global
    Undo.finishEdit('Auto-Group (Power Tools)');

    // @ts-ignore - Canvas is a Blockbench global
    Canvas.updateAll();

    // @ts-ignore - Blockbench global
    Blockbench.showQuickMessage(
        `Created ${clusters.size} groups from ${selected.length} cubes`,
        3000
    );
    console.log(`[Power Tools] Auto-Group: ${clusters.size} groups from ${selected.length} cubes`);
}

// ─── Tool 4: Hierarchy Builder ──────────────────────────────────────

/**
 * Structure flat cubes into a Hytale-standard humanoid skeleton.
 * Analyzes spatial positions to assign cubes to body regions:
 * Head (top 20%), Body (center), Arms (left/right sides), Legs (bottom).
 * Creates the standard Origin > Body > {Head, L-Arm, R-Arm, L-Leg, R-Leg} hierarchy.
 */
function buildHierarchy(): void {
    // @ts-ignore - Cube is a Blockbench global
    const selected: any[] = [...Cube.selected];
    if (selected.length < 2) {
        // @ts-ignore - Blockbench global
        Blockbench.showQuickMessage('Select 2+ cubes to build hierarchy', 2000);
        return;
    }

    // Compute bounding box of entire selection
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    const centroids: [number, number, number][] = [];

    for (const cube of selected) {
        const c = getCentroid(cube);
        centroids.push(c);
        minX = Math.min(minX, c[0]); maxX = Math.max(maxX, c[0]);
        minY = Math.min(minY, c[1]); maxY = Math.max(maxY, c[1]);
        minZ = Math.min(minZ, c[2]); maxZ = Math.max(maxZ, c[2]);
    }

    const height = maxY - minY;
    const centerX = (minX + maxX) / 2;

    // @ts-ignore - Undo is a Blockbench global
    Undo.initEdit({ elements: selected });

    // Create Hytale-standard group hierarchy
    // @ts-ignore - Group is a Blockbench global
    const originGroup = new Group({ name: 'Origin', origin: [0, 0, 0] }).init();
    // @ts-ignore - Group is a Blockbench global
    const bodyGroup = new Group({ name: 'Body', origin: [0, 0, 0] }).init();
    bodyGroup.addTo(originGroup);

    const regionNames = ['Head', 'L_Arm', 'R_Arm', 'L_Leg', 'R_Leg', 'Torso'];
    const regionGroups: Record<string, any> = {};
    for (const name of regionNames) {
        // @ts-ignore - Group is a Blockbench global
        const g = new Group({ name, origin: [0, 0, 0] }).init();
        g.addTo(bodyGroup);
        regionGroups[name] = g;
    }

    // Assign each cube to a region based on centroid position
    const regionCounts: Record<string, number> = {};
    for (let i = 0; i < selected.length; i++) {
        const [cx, cy] = centroids[i];
        const normalizedY = height > 0 ? (cy - minY) / height : 0.5;
        const isLeft = cx < centerX - (maxX - minX) * 0.15;
        const isRight = cx > centerX + (maxX - minX) * 0.15;

        let region: string;
        if (normalizedY > 0.8) {
            region = 'Head';
        } else if (normalizedY < 0.4) {
            region = isLeft ? 'L_Leg' : isRight ? 'R_Leg' : 'L_Leg';
        } else if (isLeft) {
            region = 'L_Arm';
        } else if (isRight) {
            region = 'R_Arm';
        } else {
            region = 'Torso';
        }

        selected[i].addTo(regionGroups[region]);
        regionCounts[region] = (regionCounts[region] || 0) + 1;
    }

    // Track all groups for cleanup
    track(originGroup);

    // @ts-ignore - Undo is a Blockbench global
    Undo.finishEdit('Build Hierarchy (Power Tools)');

    // @ts-ignore - Canvas is a Blockbench global
    Canvas.updateAll();

    const regionSummary = Object.entries(regionCounts)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');

    // @ts-ignore - Blockbench global
    Blockbench.showQuickMessage(
        `Built hierarchy: ${Object.keys(regionCounts).length} regions from ${selected.length} elements`,
        3000
    );
    console.log(`[Power Tools] Hierarchy: ${regionSummary}`);
}

// ─── Tool 5: Smart Rename ───────────────────────────────────────────

/**
 * Auto-rename selected cubes/groups based on spatial position.
 * Asset-type agnostic: uses positional names (Top, Upper, Mid, Lower, Base)
 * with L/R prefixes for laterality and Front/Back for depth.
 * Small cubes get "Detail" suffix. Works on any model type.
 */
function smartRename(): void {
    // @ts-ignore - Cube is a Blockbench global
    const selected: any[] = [...Cube.selected];
    if (selected.length === 0) {
        // @ts-ignore - Blockbench global
        Blockbench.showQuickMessage('Select cubes to rename', 2000);
        return;
    }

    // Compute full selection bounding box in all 3 axes
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    const cubeData: Array<{
        cube: any;
        centroid: [number, number, number];
        volume: number;
    }> = [];

    for (const cube of selected) {
        const c = getCentroid(cube);
        const dx = Math.abs(cube.to[0] - cube.from[0]);
        const dy = Math.abs(cube.to[1] - cube.from[1]);
        const dz = Math.abs(cube.to[2] - cube.from[2]);
        cubeData.push({ cube, centroid: c, volume: dx * dy * dz });
        minX = Math.min(minX, c[0]); maxX = Math.max(maxX, c[0]);
        minY = Math.min(minY, c[1]); maxY = Math.max(maxY, c[1]);
        minZ = Math.min(minZ, c[2]); maxZ = Math.max(maxZ, c[2]);
    }

    const centerX = (minX + maxX) / 2;
    const centerZ = (minZ + maxZ) / 2;
    const spanX = maxX - minX;
    const spanY = maxY - minY;
    const spanZ = maxZ - minZ;
    const avgVolume = cubeData.reduce((s, d) => s + d.volume, 0) / cubeData.length;

    // @ts-ignore - Undo is a Blockbench global
    Undo.initEdit({ elements: selected });

    const nameUsage: Record<string, number> = {};

    for (const { cube, centroid, volume } of cubeData) {
        const [cx, cy, cz] = centroid;
        const normalizedY = spanY > 0 ? (cy - minY) / spanY : 0.5;
        const isSmall = volume < avgVolume * 0.25;

        // Vertical region (5 bands)
        let vertName: string;
        if (normalizedY > 0.8) vertName = 'Top';
        else if (normalizedY > 0.6) vertName = 'Upper';
        else if (normalizedY > 0.4) vertName = 'Mid';
        else if (normalizedY > 0.2) vertName = 'Lower';
        else vertName = 'Base';

        // Lateral prefix (only if model has meaningful X span)
        let prefix = '';
        if (spanX > 1) {
            const offCenter = (cx - centerX) / (spanX * 0.5);
            if (offCenter < -0.3) prefix = 'L-';
            else if (offCenter > 0.3) prefix = 'R-';
        }

        // Depth suffix (only if model has meaningful Z span)
        let depthSuffix = '';
        if (spanZ > 1) {
            const offDepth = (cz - centerZ) / (spanZ * 0.5);
            if (offDepth < -0.4) depthSuffix = '-Front';
            else if (offDepth > 0.4) depthSuffix = '-Back';
        }

        // Small cubes are details
        const sizeSuffix = isSmall ? '-Detail' : '';

        let finalName = `${prefix}${vertName}${depthSuffix}${sizeSuffix}`;

        // Numeric suffix for duplicates
        nameUsage[finalName] = (nameUsage[finalName] || 0) + 1;
        if (nameUsage[finalName] > 1) {
            finalName = `${finalName}${nameUsage[finalName]}`;
        }

        cube.name = finalName;
    }

    // @ts-ignore - Undo is a Blockbench global
    Undo.finishEdit('Smart Rename (Power Tools)');

    // @ts-ignore - Canvas is a Blockbench global
    Canvas.updateAll();

    // @ts-ignore - Blockbench global
    Blockbench.showQuickMessage(`Renamed ${selected.length} elements`, 2000);
    console.log(`[Power Tools] Smart Rename: ${selected.length} elements`);
}

// ─── Tool 6: Smart Optimize ─────────────────────────────────────────

/**
 * Hierarchical agglomerative clustering on cube centroids.
 * Merges the two closest clusters at each step until all inter-cluster
 * distances exceed the threshold. Returns cluster assignments.
 *
 * @param centroids - Array of [x,y,z] positions
 * @param threshold - Maximum linkage distance for merging clusters
 * @returns Array mapping each index to its cluster ID
 */
function hierarchicalCluster(
    centroids: [number, number, number][],
    threshold: number
): number[] {
    const n = centroids.length;
    // Each element starts as its own cluster
    const clusterOf = Array.from({ length: n }, (_, i) => i);
    // Track active cluster members
    const members = new Map<number, number[]>();
    for (let i = 0; i < n; i++) members.set(i, [i]);

    // Compute cluster centroid (average of all member centroids)
    function clusterCenter(ids: number[]): [number, number, number] {
        let sx = 0, sy = 0, sz = 0;
        for (const id of ids) {
            sx += centroids[id][0];
            sy += centroids[id][1];
            sz += centroids[id][2];
        }
        return [sx / ids.length, sy / ids.length, sz / ids.length];
    }

    // Agglomerative: merge closest pair until threshold exceeded
    let nextId = n;
    while (members.size > 1) {
        let bestDist = Infinity;
        let bestA = -1, bestB = -1;

        const keys = [...members.keys()];
        for (let i = 0; i < keys.length; i++) {
            const centerA = clusterCenter(members.get(keys[i])!);
            for (let j = i + 1; j < keys.length; j++) {
                const centerB = clusterCenter(members.get(keys[j])!);
                const d = dist3(centerA, centerB);
                if (d < bestDist) {
                    bestDist = d;
                    bestA = keys[i];
                    bestB = keys[j];
                }
            }
        }

        if (bestDist > threshold) break;

        // Merge bestB into bestA under a new cluster ID
        const merged = [...members.get(bestA)!, ...members.get(bestB)!];
        members.delete(bestA);
        members.delete(bestB);
        members.set(nextId, merged);
        for (const idx of merged) clusterOf[idx] = nextId;
        nextId++;
    }

    // Normalize cluster IDs to 0..K-1
    const idMap = new Map<number, number>();
    let nextNorm = 0;
    const result: number[] = [];
    for (let i = 0; i < n; i++) {
        const cid = clusterOf[i];
        // Find the final cluster this belongs to
        let finalCid = cid;
        for (const [k, v] of members) {
            if (v.includes(i)) { finalCid = k; break; }
        }
        if (!idMap.has(finalCid)) idMap.set(finalCid, nextNorm++);
        result.push(idMap.get(finalCid)!);
    }
    return result;
}

/**
 * Smart Optimize: restructure an unoptimized model into clean cuboids + quads
 * with a proper hierarchy.
 *
 * Shows a dialog letting the user control:
 * - Target regions (3-20, default sqrt(cubeCount) clamped)
 * - Quad threshold: max thickness for auto-converting regions to quads
 *
 * Algorithm (asset-type agnostic):
 * 1. Binary search for hierarchical clustering threshold that yields target regions
 * 2. Per cluster: compute bounding box, replace cubes with one cuboid
 * 3. Thin regions (smallest dim < quad threshold) become quads
 * 4. Wrap each cluster in a named group
 *
 * Works on any model shape.
 */
function smartOptimize(): void {
    // @ts-ignore - Cube is a Blockbench global
    const allCubes: any[] = [...Cube.all];
    if (allCubes.length < 3) {
        // @ts-ignore - Blockbench global
        Blockbench.showQuickMessage('Need 3+ cubes to optimize', 2000);
        return;
    }

    const originalCount = allCubes.length;
    // Min regions = 3, max = half the cube count
    const maxRegions = Math.min(Math.floor(originalCount / 2), 50);
    const defaultDetail = 30; // 30% detail = moderate optimization

    // Show dialog for user control
    // @ts-ignore - Blockbench global
    const dialog = new Dialog({
        id: 'myrlin_smart_optimize_dialog',
        title: 'Smart Optimize',
        form: {
            info: {
                type: 'info',
                text: `Model has **${originalCount} cubes**. Drag the slider to control how much detail to keep. Use Merge Brush after for fine-tuning.`,
            },
            detail_level: {
                label: 'Detail Level',
                type: 'range',
                value: defaultDetail,
                min: 5,
                max: 80,
                step: 5,
                description: 'Low = fewer regions (aggressive), High = more regions (conservative)',
            },
            quad_threshold: {
                label: 'Quad Threshold',
                type: 'number',
                value: 2.0,
                min: 0.5,
                max: 10.0,
                step: 0.5,
                description: 'Regions thinner than this become flat quads',
            },
        },
        onConfirm(formData: Record<string, any>) {
            // Map detail level (5-80) to region count
            const detail = formData.detail_level as number;
            const targetRegions = Math.max(3, Math.round((detail / 100) * maxRegions));
            const quadThreshold = formData.quad_threshold as number;
            console.log(`[Power Tools] Smart Optimize: detail=${detail}% -> ${targetRegions} regions`);
            runOptimize(allCubes, targetRegions, quadThreshold);
        },
    });
    dialog.show();
}

/**
 * Execute the optimization with given parameters.
 * Uses greedy merge within each cluster instead of bounding-box replacement
 * to avoid overlap and preserve silhouette detail.
 *
 * @param allCubes - All cubes in the model
 * @param targetRegions - How many regions to split into
 * @param quadThreshold - Max thin-axis size to convert to quad
 */
function runOptimize(allCubes: any[], targetRegions: number, quadThreshold: number): void {
    const originalCount = allCubes.length;
    console.log(`[Power Tools] Smart Optimize: ${originalCount} cubes, target=${targetRegions} regions, quadThreshold=${quadThreshold}`);

    // Step 0: Compute model bounding box and centroids
    const centroids: [number, number, number][] = allCubes.map(getCentroid);
    let modelMin: [number, number, number] = [Infinity, Infinity, Infinity];
    let modelMax: [number, number, number] = [-Infinity, -Infinity, -Infinity];
    for (const [cx, cy, cz] of centroids) {
        modelMin = [Math.min(modelMin[0], cx), Math.min(modelMin[1], cy), Math.min(modelMin[2], cz)];
        modelMax = [Math.max(modelMax[0], cx), Math.max(modelMax[1], cy), Math.max(modelMax[2], cz)];
    }
    const modelDiag = dist3(modelMin, modelMax);

    // Step 1: Binary search for clustering threshold
    let lo = 0, hi = modelDiag;
    let bestThreshold = modelDiag / 4;
    let bestDiff = Infinity;

    for (let iter = 0; iter < 25; iter++) {
        const mid = (lo + hi) / 2;
        const ids = hierarchicalCluster(centroids, mid);
        const numClusters = new Set(ids).size;
        const diff = Math.abs(numClusters - targetRegions);

        if (diff < bestDiff || (diff === bestDiff && numClusters >= targetRegions)) {
            bestDiff = diff;
            bestThreshold = mid;
        }

        if (numClusters > targetRegions) {
            lo = mid;
        } else if (numClusters < targetRegions) {
            hi = mid;
        } else {
            break;
        }
    }

    const finalClusterIds = hierarchicalCluster(centroids, bestThreshold);

    // Group cubes by cluster
    const clusters = new Map<number, number[]>();
    for (let i = 0; i < allCubes.length; i++) {
        const cid = finalClusterIds[i];
        if (!clusters.has(cid)) clusters.set(cid, []);
        clusters.get(cid)!.push(i);
    }

    console.log(`[Power Tools] Smart Optimize: got ${clusters.size} clusters (threshold=${bestThreshold.toFixed(1)})`);

    // @ts-ignore - Undo is a Blockbench global
    Undo.initEdit({ elements: allCubes });

    // Step 2: Per cluster, use greedy merge to combine cubes without creating overlap.
    // Instead of one bounding box (which fills concave spaces), we iteratively merge
    // pairs of cubes that share faces or are nearby AND whose combined bounding box
    // doesn't waste much space (fill ratio >= 60%).
    const sortedClusters = [...clusters.entries()].sort((a, b) => {
        const avgYA = a[1].reduce((s, i) => s + centroids[i][1], 0) / a[1].length;
        const avgYB = b[1].reduce((s, i) => s + centroids[i][1], 0) / b[1].length;
        return avgYA - avgYB;
    });

    let totalKept = 0;
    let quadCount = 0;
    let regionIdx = 1;

    for (const [, indices] of sortedClusters) {
        // Create group for this cluster
        const clusterCubes = indices.map(i => allCubes[i]);

        // Compute cluster bounding box for group origin
        let cMinX = Infinity, cMinY = Infinity, cMinZ = Infinity;
        let cMaxX = -Infinity, cMaxY = -Infinity, cMaxZ = -Infinity;
        for (const cube of clusterCubes) {
            cMinX = Math.min(cMinX, cube.from[0], cube.to[0]);
            cMinY = Math.min(cMinY, cube.from[1], cube.to[1]);
            cMinZ = Math.min(cMinZ, cube.from[2], cube.to[2]);
            cMaxX = Math.max(cMaxX, cube.from[0], cube.to[0]);
            cMaxY = Math.max(cMaxY, cube.from[1], cube.to[1]);
            cMaxZ = Math.max(cMaxZ, cube.from[2], cube.to[2]);
        }

        // @ts-ignore - Group is a Blockbench global
        const group = new Group({
            name: `Region_${regionIdx}`,
            origin: [(cMinX + cMaxX) / 2, cMinY, (cMinZ + cMaxZ) / 2],
        }).init();
        track(group);

        // Greedy merge within this cluster: merge pairs with high fill ratio
        const active = new Set<any>(clusterCubes);
        let merged = true;
        let passes = 0;
        const maxPasses = clusterCubes.length * 2;

        while (merged && passes < maxPasses) {
            merged = false;
            passes++;

            for (const cube of active) {
                if ((cube as any)._removed) continue;
                const boundsA = getCubeBounds(cube);

                // Find best merge candidate: nearby + high fill ratio
                let bestOther: any = null;
                let bestFill = 0;

                for (const other of active) {
                    if (other === cube || (other as any)._removed) continue;
                    const boundsB = getCubeBounds(other);

                    // Must be nearby (within gap tolerance)
                    if (!areNearby(boundsA, boundsB, 1.0)) continue;

                    const fill = mergeFillRatio(boundsA, boundsB);
                    if (fill >= 0.6 && fill > bestFill) {
                        bestFill = fill;
                        bestOther = other;
                    }
                }

                if (bestOther) {
                    // Merge bestOther into cube
                    const boundsB = getCubeBounds(bestOther);
                    const combined = combineBounds(boundsA, boundsB);
                    cube.from[0] = combined.min.x; cube.from[1] = combined.min.y; cube.from[2] = combined.min.z;
                    cube.to[0] = combined.max.x; cube.to[1] = combined.max.y; cube.to[2] = combined.max.z;
                    (bestOther as any)._removed = true;
                    merged = true;
                    break; // restart scan
                }
            }
        }

        // Move surviving cubes into the group, check for quads
        for (const cube of active) {
            if ((cube as any)._removed) {
                delete (cube as any)._removed;
                cube.remove();
                continue;
            }
            delete (cube as any)._removed;

            // Check if this cube should be a quad
            const dx = Math.abs(cube.to[0] - cube.from[0]);
            const dy = Math.abs(cube.to[1] - cube.from[1]);
            const dz = Math.abs(cube.to[2] - cube.from[2]);
            const dims = [dx, dy, dz].sort((a, b) => a - b);
            if (dims[0] < quadThreshold && dims[1] > dims[0] * 3) {
                // Collapse thin axis to midpoint
                const minAxis = [dx, dy, dz].indexOf(dims[0]);
                const mid = (cube.from[minAxis] + cube.to[minAxis]) / 2;
                cube.from[minAxis] = mid;
                cube.to[minAxis] = mid;
                cube.name = `Region_${regionIdx}_Quad`;
                quadCount++;
            } else {
                cube.name = `Region_${regionIdx}_Body`;
            }

            cube.addTo(group);
            totalKept++;
        }

        regionIdx++;
    }

    // @ts-ignore - Undo is a Blockbench global
    Undo.finishEdit('Smart Optimize (Power Tools)');

    // @ts-ignore - Canvas is a Blockbench global
    Canvas.updateAll();

    const saved = originalCount - totalKept;
    const ratio = ((saved / originalCount) * 100).toFixed(0);

    // @ts-ignore - Blockbench global
    Blockbench.showQuickMessage(
        `Optimized: ${originalCount} -> ${totalKept} elements (${ratio}% reduction, ${quadCount} quads, ${clusters.size} groups)`,
        4000
    );
    console.log(`[Power Tools] Smart Optimize: ${originalCount} -> ${totalKept} (${quadCount} quads, ${clusters.size} groups)`);
}

// ─── Tool 8: Merge Brush ────────────────────────────────────────────

/** Set of cubes collected during a brush stroke */
let brushSelection: Set<any> = new Set();
/** Whether a brush stroke is currently active */
let brushActive = false;

// ─── Tool 9: Quad Brush ────────────────────────────────────────────

/** 3D points collected during a quad brush stroke */
let quadBrushPoints: Array<[number, number, number]> = [];
/** Whether a quad brush stroke is active */
let quadBrushActive = false;
/** The face normal detected on first click (determines which plane the quad lies on) */
let quadBrushPlane: number = -1; // 0=YZ (X normal), 1=XZ (Y normal), 2=XY (Z normal)

/**
 * Start a quad brush stroke. The first face hit determines the plane.
 * Subsequent points are projected onto that plane.
 *
 * @param data - Blockbench tool event data with raycast info
 */
function onQuadBrushStart(data: any): void {
    quadBrushPoints = [];
    quadBrushActive = true;
    quadBrushPlane = -1;

    const hit = getHitPoint(data);
    if (hit) {
        quadBrushPlane = hit.plane;
        quadBrushPoints.push(hit.point);
    }
    updateQuadBrushStatus();
}

/**
 * Continue a quad brush stroke. Collects 3D points along the path.
 *
 * @param data - Blockbench tool event data
 */
function onQuadBrushMove(data: any): void {
    if (!quadBrushActive || quadBrushPlane < 0) return;

    const hit = getHitPoint(data);
    if (hit) {
        quadBrushPoints.push(hit.point);
    }
    updateQuadBrushStatus();
}

/**
 * End a quad brush stroke. Creates a quad spanning the bounding rectangle
 * of all collected points, projected onto the detected plane.
 */
function onQuadBrushEnd(): void {
    quadBrushActive = false;

    if (quadBrushPoints.length < 2) {
        quadBrushPoints = [];
        // @ts-ignore - Blockbench global
        Blockbench.setCursorTooltip();
        return;
    }

    // Compute bounding rect on the plane
    const pts = quadBrushPoints;
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (const [px, py, pz] of pts) {
        minX = Math.min(minX, px); maxX = Math.max(maxX, px);
        minY = Math.min(minY, py); maxY = Math.max(maxY, py);
        minZ = Math.min(minZ, pz); maxZ = Math.max(maxZ, pz);
    }

    // The flat axis is determined by quadBrushPlane
    const from = [minX, minY, minZ];
    const to = [maxX, maxY, maxZ];
    const mid = (from[quadBrushPlane] + to[quadBrushPlane]) / 2;
    from[quadBrushPlane] = mid;
    to[quadBrushPlane] = mid;

    // @ts-ignore - Undo is a Blockbench global
    Undo.initEdit({ elements: [] });

    // @ts-ignore - Cube constructor is a Blockbench global
    const quad = new Cube({
        name: `Quad_${Math.round(mid)}`,
        from: from,
        to: to,
    }).init();

    // @ts-ignore - Undo is a Blockbench global
    Undo.finishEdit('Quad Brush (Power Tools)');
    // @ts-ignore - Canvas is a Blockbench global
    Canvas.updateAll();

    const axisNames = ['X', 'Y', 'Z'];
    const w = to[(quadBrushPlane + 1) % 3] - from[(quadBrushPlane + 1) % 3];
    const h = to[(quadBrushPlane + 2) % 3] - from[(quadBrushPlane + 2) % 3];
    // @ts-ignore - Blockbench global
    Blockbench.showQuickMessage(
        `Created quad on ${axisNames[quadBrushPlane]} plane (${Math.round(w)}x${Math.round(h)})`,
        3000
    );
    console.log(`[Power Tools] Quad Brush: plane=${axisNames[quadBrushPlane]}, size=${w.toFixed(0)}x${h.toFixed(0)}, from ${pts.length} points`);

    quadBrushPoints = [];
    // @ts-ignore - Blockbench global
    Blockbench.setCursorTooltip();
}

/**
 * Extract the 3D hit point and face normal from a tool event.
 * Uses raycast intersection data to determine which plane was hit.
 *
 * @param data - Blockbench tool event data
 * @returns Hit point and plane index, or null
 */
function getHitPoint(data: any): { point: [number, number, number]; plane: number } | null {
    if (!data || !data.event) return null;

    // Try to get intersection from raycast
    // @ts-ignore - Preview is a Blockbench global
    const preview = Preview.selected;
    if (!preview) return null;

    const result = preview.raycast(data.event);
    if (!result) return null;

    // Get the 3D intersection point
    let point: [number, number, number] | null = null;

    if (result.intersects && result.intersects.length > 0) {
        const p = result.intersects[0].point;
        point = [p.x, p.y, p.z];
    } else if (result.cube) {
        // Fallback: use cube center
        const c = result.cube;
        point = [(c.from[0] + c.to[0]) / 2, (c.from[1] + c.to[1]) / 2, (c.from[2] + c.to[2]) / 2];
    }

    if (!point) return null;

    // Determine plane from face name
    let plane = 0; // default: YZ plane (X normal)
    if (result.face) {
        const f = result.face.toLowerCase();
        if (f === 'north' || f === 'south') plane = 2; // XY plane (Z normal)
        else if (f === 'up' || f === 'down') plane = 1; // XZ plane (Y normal)
        else plane = 0; // YZ plane (X normal)
    }

    // Use the plane from the first click if already set
    if (quadBrushPlane >= 0) plane = quadBrushPlane;

    return { point, plane };
}

/**
 * Update cursor tooltip with quad brush state.
 */
function updateQuadBrushStatus(): void {
    if (quadBrushPoints.length > 0) {
        const axisNames = ['X', 'Y', 'Z'];
        // @ts-ignore - Blockbench global
        Blockbench.setCursorTooltip(`Quad: ${quadBrushPoints.length} pts (${axisNames[quadBrushPlane]} plane)`);
    }
}

/**
 * Handle brush stroke start: begin collecting cubes under the cursor.
 * Called when the user clicks with the Merge Brush tool active.
 *
 * @param data - Blockbench tool event data with raycast info
 */
function onBrushStart(data: any): void {
    brushSelection.clear();
    brushActive = true;

    const hit = hitCubeUnderCursor(data);
    if (hit) {
        brushSelection.add(hit);
        hit.select({ shiftKey: true });
    }

    updateBrushStatus();
}

/**
 * Handle brush stroke move: add cubes under cursor to selection.
 * Called as the user drags with the Merge Brush.
 *
 * @param data - Blockbench tool event data with raycast info
 */
function onBrushMove(data: any): void {
    if (!brushActive) return;

    const hit = hitCubeUnderCursor(data);
    if (hit && !brushSelection.has(hit)) {
        brushSelection.add(hit);
        hit.select({ shiftKey: true });
    }

    updateBrushStatus();
}

/**
 * Handle brush stroke end: merge all collected cubes into one cuboid.
 * Creates an undo point so the merge can be reverted.
 */
function onBrushEnd(): void {
    brushActive = false;

    if (brushSelection.size < 2) {
        brushSelection.clear();
        // @ts-ignore - Blockbench global
        Blockbench.setCursorTooltip();
        return;
    }

    const cubes = [...brushSelection];
    brushSelection.clear();

    // @ts-ignore - Undo is a Blockbench global
    Undo.initEdit({ elements: cubes });

    // Compute bounding box of all brushed cubes
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (const cube of cubes) {
        minX = Math.min(minX, cube.from[0], cube.to[0]);
        minY = Math.min(minY, cube.from[1], cube.to[1]);
        minZ = Math.min(minZ, cube.from[2], cube.to[2]);
        maxX = Math.max(maxX, cube.from[0], cube.to[0]);
        maxY = Math.max(maxY, cube.from[1], cube.to[1]);
        maxZ = Math.max(maxZ, cube.from[2], cube.to[2]);
    }

    // Keep the first cube and resize it to the bounding box
    const keeper = cubes[0];
    keeper.from[0] = minX; keeper.from[1] = minY; keeper.from[2] = minZ;
    keeper.to[0] = maxX; keeper.to[1] = maxY; keeper.to[2] = maxZ;
    keeper.name = `Merged_${cubes.length}`;

    // Remove the rest
    for (let i = 1; i < cubes.length; i++) {
        cubes[i].remove();
    }

    // @ts-ignore - Undo is a Blockbench global
    Undo.finishEdit('Merge Brush (Power Tools)');

    // @ts-ignore - Canvas is a Blockbench global
    Canvas.updateAll();

    // @ts-ignore - Blockbench global
    Blockbench.showQuickMessage(
        `Merged ${cubes.length} cubes into 1 cuboid`,
        2000
    );
    console.log(`[Power Tools] Merge Brush: ${cubes.length} cubes -> 1`);

    // @ts-ignore - Blockbench global
    Blockbench.setCursorTooltip();
}

/**
 * Raycast from cursor position to find the cube under the mouse.
 * Uses Blockbench's Preview raycast system.
 *
 * @param data - Event data from tool callback
 * @returns The Cube under the cursor, or null
 */
function hitCubeUnderCursor(data: any): any | null {
    if (!data || !data.event) return null;

    // Try to get cube from raycast result
    if (data.cube) return data.cube;
    if (data.element && data.element.type === 'cube') return data.element;

    // Fallback: try Preview raycast
    // @ts-ignore - Preview is a Blockbench global
    const preview = Preview.selected;
    if (preview && data.event) {
        const result = preview.raycast(data.event);
        if (result && result.cube) return result.cube;
        if (result && result.element && result.element.type === 'cube') return result.element;
    }

    return null;
}

/**
 * Update the cursor tooltip with current brush selection count.
 */
function updateBrushStatus(): void {
    if (brushSelection.size > 0) {
        // @ts-ignore - Blockbench global
        Blockbench.setCursorTooltip(`Merge: ${brushSelection.size} cubes`);
    }
}

// ─── Registration ───────────────────────────────────────────────────

/**
 * Register all 8 Power Tools as Blockbench Actions/Tools.
 * Includes the Merge Brush (a proper Tool with click-drag interaction).
 * Each action is tracked for cleanup on plugin unload.
 */
export function setupPowerTools(): void {
    // ── Merge Brush Tool (interactive, click-drag) ──
    // @ts-ignore - Tool is a Blockbench global
    const mergeBrushTool = track(new Tool('myrlin_merge_brush', {
        name: 'Merge Brush',
        description: 'Click and drag over cubes to merge them into one cuboid',
        icon: 'brush',
        category: 'tools',
        selectElements: true,
        cursor: 'crosshair',
        // @ts-ignore - Blockbench Tool callback
        onCanvasClick(data: any) {
            onBrushStart(data);
        },
        // @ts-ignore - Blockbench Tool callback
        onCanvasMouseMove(data: any) {
            if (brushActive) onBrushMove(data);
        },
    }));

    // Register mouseup globally for stroke end (Tool API doesn't have onCanvasMouseUp)
    const canvasEl = document.getElementById('preview');
    if (canvasEl) {
        const mouseUpHandler = () => {
            // @ts-ignore - Toolbox is a Blockbench global
            if (brushActive && Toolbox && Toolbox.selected && Toolbox.selected.id === 'myrlin_merge_brush') {
                onBrushEnd();
            }
        };
        canvasEl.addEventListener('mouseup', mouseUpHandler);
        // Track for cleanup
        track({ delete: () => canvasEl.removeEventListener('mouseup', mouseUpHandler) });
    }

    // @ts-ignore - MenuBar is a Blockbench global
    MenuBar.addAction(mergeBrushTool, 'tools');

    // ── Quad Brush Tool (interactive, paint-to-place-quad) ──
    // @ts-ignore - Tool is a Blockbench global
    const quadBrushTool = track(new Tool('myrlin_quad_brush', {
        name: 'Quad Brush',
        description: 'Paint along edges to place a flat quad. Click a face to set the plane, drag to define the area.',
        icon: 'square_foot',
        category: 'tools',
        selectElements: true,
        cursor: 'crosshair',
        // @ts-ignore - Blockbench Tool callback
        onCanvasClick(data: any) {
            onQuadBrushStart(data);
        },
        // @ts-ignore - Blockbench Tool callback
        onCanvasMouseMove(data: any) {
            if (quadBrushActive) onQuadBrushMove(data);
        },
    }));

    // Register mouseup for quad brush end
    const canvasEl2 = document.getElementById('preview');
    if (canvasEl2) {
        const quadMouseUpHandler = () => {
            // @ts-ignore - Toolbox is a Blockbench global
            if (quadBrushActive && Toolbox && Toolbox.selected && Toolbox.selected.id === 'myrlin_quad_brush') {
                onQuadBrushEnd();
            }
        };
        canvasEl2.addEventListener('mouseup', quadMouseUpHandler);
        track({ delete: () => canvasEl2.removeEventListener('mouseup', quadMouseUpHandler) });
    }

    // @ts-ignore - MenuBar is a Blockbench global
    MenuBar.addAction(quadBrushTool, 'tools');

    // ── Standard Actions ──
    // @ts-ignore - Action is a Blockbench global
    const mergeStrictAction = track(new Action('myrlin_smart_merge', {
        name: 'Smart Merge (Strict)',
        description: 'Merge cubes sharing exact faces into larger cuboids',
        icon: 'merge',
        category: 'tools',
        // @ts-ignore - Cube is a Blockbench global
        condition: () => Cube.selected.length >= 2,
        click: () => smartMerge(false),
    }));

    // @ts-ignore - Action is a Blockbench global
    const mergeFuzzyAction = track(new Action('myrlin_smart_merge_fuzzy', {
        name: 'Smart Merge (Fuzzy)',
        description: 'Merge nearby cubes with relaxed alignment. Good for non-voxel imports.',
        icon: 'merge_type',
        category: 'tools',
        // @ts-ignore - Cube is a Blockbench global
        condition: () => Cube.selected.length >= 2,
        click: () => smartMerge(true),
    }));

    // @ts-ignore - Action is a Blockbench global
    const quadAction = track(new Action('myrlin_convert_quad', {
        name: 'Convert to Quad (Selection)',
        description: 'Flatten selected thin cuboids into zero-depth quads',
        icon: 'crop_square',
        category: 'tools',
        // @ts-ignore - Cube is a Blockbench global
        condition: () => Cube.selected.length >= 1,
        click: convertToQuad,
    }));

    // @ts-ignore - Action is a Blockbench global
    const flattenAction = track(new Action('myrlin_flatten_quad', {
        name: 'Flatten to Quad',
        description: 'Collapse selected cuboids into flat quads on a chosen axis (blade edges, hair, eyelids)',
        icon: 'layers',
        category: 'tools',
        // @ts-ignore - Cube is a Blockbench global
        condition: () => Cube.selected.length >= 1,
        click: flattenToQuad,
    }));

    // @ts-ignore - Action is a Blockbench global
    const groupAction = track(new Action('myrlin_auto_group', {
        name: 'Auto-Group by Proximity',
        description: 'Cluster cubes into spatial groups using adaptive threshold',
        icon: 'workspaces',
        category: 'tools',
        // @ts-ignore - Cube is a Blockbench global
        condition: () => Cube.selected.length >= 2,
        click: autoGroup,
    }));

    // @ts-ignore - Action is a Blockbench global
    const hierarchyAction = track(new Action('myrlin_build_hierarchy', {
        name: 'Build Hierarchy',
        description: 'Structure flat cubes into humanoid skeleton (creature models)',
        icon: 'account_tree',
        category: 'tools',
        // @ts-ignore - Cube is a Blockbench global
        condition: () => Cube.selected.length >= 2,
        click: buildHierarchy,
    }));

    // @ts-ignore - Action is a Blockbench global
    const renameAction = track(new Action('myrlin_smart_rename', {
        name: 'Smart Rename',
        description: 'Auto-name cubes by spatial position (Top/Mid/Base, L/R)',
        icon: 'label',
        category: 'tools',
        // @ts-ignore - Cube is a Blockbench global
        condition: () => Cube.selected.length >= 1,
        click: smartRename,
    }));

    // @ts-ignore - Action is a Blockbench global
    const optimizeAction = track(new Action('myrlin_smart_optimize', {
        name: 'Smart Optimize (Full Model)',
        description: 'Restructure entire model: cluster regions, replace with cuboids + quads, build hierarchy',
        icon: 'auto_fix_high',
        category: 'tools',
        // @ts-ignore - Cube is a Blockbench global
        condition: () => Cube.all.length >= 3,
        click: smartOptimize,
    }));

    // Register under a "Power Tools" submenu in Tools
    // @ts-ignore - MenuBar is a Blockbench global
    MenuBar.addAction(optimizeAction, 'tools');
    // @ts-ignore - MenuBar is a Blockbench global
    MenuBar.addAction(mergeStrictAction, 'tools');
    // @ts-ignore - MenuBar is a Blockbench global
    MenuBar.addAction(mergeFuzzyAction, 'tools');
    // @ts-ignore - MenuBar is a Blockbench global
    MenuBar.addAction(quadAction, 'tools');
    // @ts-ignore - MenuBar is a Blockbench global
    MenuBar.addAction(flattenAction, 'tools');
    // @ts-ignore - MenuBar is a Blockbench global
    MenuBar.addAction(groupAction, 'tools');
    // @ts-ignore - MenuBar is a Blockbench global
    MenuBar.addAction(hierarchyAction, 'tools');
    // @ts-ignore - MenuBar is a Blockbench global
    MenuBar.addAction(renameAction, 'tools');

    console.log('[Power Tools] 8 tools registered: Merge Brush, Smart Optimize, Smart Merge (Strict/Fuzzy), Convert to Quad, Auto-Group, Build Hierarchy, Smart Rename');
}
