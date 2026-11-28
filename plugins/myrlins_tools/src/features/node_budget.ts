/**
 * Per-Bone Node Budget Calculator
 *
 * Walks the Blockbench outliner tree and returns node counts
 * (cubes and groups) per root-level bone group. Useful for
 * checking per-bone complexity limits before export.
 */

import { countHytaleNodes, countSubtreeNodes } from '../utils/hytale_nodes';

export interface BoneNodeInfo {
    name: string;
    uuid: string;
    cubeCount: number;
    groupCount: number;
    totalDescendants: number;
    /** Hytale nodes this bone writes, itself included (same rule as the total) */
    nodes: number;
    children: BoneNodeInfo[];
}

/**
 * Recursively count cubes and groups within a single group.
 */
function countGroup(group: any): BoneNodeInfo {
    let cubeCount = 0;
    let groupCount = 0;
    const children: BoneNodeInfo[] = [];

    for (const child of group.children) {
        // @ts-ignore - Cube is a global from Blockbench
        if (child instanceof Cube) {
            cubeCount++;
        // @ts-ignore - Group is a global from Blockbench
        } else if (child instanceof Group) {
            groupCount++;
            children.push(countGroup(child));
        }
    }

    const childDescendants = children.reduce((sum, c) => sum + c.totalDescendants, 0);
    const totalDescendants = cubeCount + groupCount + childDescendants;

    return {
        name: group.name,
        uuid: group.uuid,
        cubeCount,
        groupCount,
        totalDescendants,
        nodes: countSubtreeNodes(group),
        children
    };
}

/**
 * Walk the outliner tree and return node counts per root-level group.
 *
 * Each entry in the returned array corresponds to a top-level bone
 * (Group) in the outliner. Loose cubes at the root level are ignored
 * since they do not belong to any bone hierarchy.
 */
export function calculateNodeBudget(): BoneNodeInfo[] {
    const roots: BoneNodeInfo[] = [];

    // @ts-ignore - Outliner is a global from Blockbench
    for (const item of Outliner.root) {
        // @ts-ignore - Group is a global from Blockbench
        if (item instanceof Group) {
            roots.push(countGroup(item));
        }
    }

    return roots;
}

/**
 * Nodes written by exported cubes that sit directly at the root (one each).
 * Shown as their own budget row so the rows add up to the total.
 */
export function countRootCubeNodes(): number {
    // @ts-ignore - Outliner is a global from Blockbench
    const root: any[] = (typeof Outliner !== 'undefined' && Outliner.root) ? Outliner.root : [];
    // @ts-ignore - Cube is a global from Blockbench
    return root.filter((n: any) => n instanceof Cube).reduce((sum: number, n: any) => sum + countSubtreeNodes(n), 0);
}

/**
 * The model's Hytale node count.
 *
 * Until 3.4.1 this added every cube and every group (293 on the teapot where
 * Hytale counts 149). It now uses the one shared count in utils/hytale_nodes.
 */
export function getTotalNodeCount(): number {
    return countHytaleNodes();
}

/**
 * The 3.4.0 raw sum of exportable cubes and groups, kept for reference only;
 * Hytale does not count this way (see getTotalNodeCount).
 */
export function getRawCubeAndGroupCount(): number {
    // @ts-ignore - Cube is a global from Blockbench
    const cubes = Cube.all.filter((c: any) => c.export !== false).length;
    // @ts-ignore - Group is a global from Blockbench
    const groups = Group.all.filter((g: any) => g.export !== false).length;
    return cubes + groups;
}
