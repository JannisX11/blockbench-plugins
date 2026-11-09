/**
 * Hytale node count - the one count every part of Myrlin's Tools shows.
 *
 * Hytale limits a model to 255 nodes. A node is what the .blockymodel file
 * holds, so the count here is the number of nodes the official Hytale Models
 * plugin (JannisX11 and Kanno, 0.11.0) writes in its codec's compile():
 *   - every exported group is one node;
 *   - a group's first exported cube without its own rotation becomes the
 *     group's shape and is free;
 *   - every other exported cube is its own node (also cubes at the root);
 *   - a hidden (export off) group drops with everything inside it;
 *   - elements inside a blockymodel attachment collection are written to the
 *     attachment's own file, not this one.
 * On ordinary models this equals the plugin's own getNodeCount() (the teapot:
 * 149 / 255). Where the two differ (a group with export off, where
 * getNodeCount() stops early and shows "undefined"), this follows the file.
 *
 * countHytaleNodesInJson() applies the same rule to saved model JSON
 * (.bbmodel outliner + elements, or a .blockymodel node tree).
 */

export const HYTALE_MAX_NODES = 255;
export const HYTALE_WARN_NODES = 200;

export interface HytaleNodeBreakdown {
    /** Total nodes Hytale will load */
    nodes: number;
    /** Exported groups (one node each) */
    groups: number;
    /** Exported cubes, wherever they are */
    cubes: number;
    /** Cubes that ride free as their group's shape */
    freeCubes: number;
    /** Exported cubes directly at the root (one node each) */
    rootCubes: number;
}

function isCube(node: any): boolean {
    // @ts-ignore - Cube is a global from Blockbench
    return typeof Cube !== 'undefined' && node instanceof Cube;
}

function isGroup(node: any): boolean {
    // @ts-ignore - Group is a global from Blockbench
    return typeof Group !== 'undefined' && node instanceof Group;
}

// Elements to count as removed (estimateSavings: the boxes Optimize would merge away)
let excludedNodes: Set<any> | null = null;

function isExported(node: any): boolean {
    if (!node || node.export === false) return false;
    return !(excludedNodes && excludedNodes.has(node));
}

function hasNoRotation(node: any): boolean {
    const r = node && node.rotation;
    if (!r) return true;
    return (r[0] || 0) === 0 && (r[1] || 0) === 0 && (r[2] || 0) === 0;
}

/** True when the element is written to a blockymodel attachment file instead. */
function inAttachmentCollection(node: any): boolean {
    // @ts-ignore - Collection is a global from Blockbench 4.10+
    if (typeof Collection === 'undefined' || !Collection.all || !Collection.all.length) return false;
    try {
        // @ts-ignore
        const collection = Collection.all.find((c: any) => typeof c.contains === 'function' && c.contains(node));
        return !!collection && collection.export_codec === 'blockymodel';
    } catch {
        return false;
    }
}

/**
 * Nodes one element writes, itself included (0 when it is not written).
 * Mirrors compileNode() in the official codec.
 */
function countElement(node: any, tally: HytaleNodeBreakdown): number {
    if (!isExported(node)) return 0;
    if (inAttachmentCollection(node)) return 0;
    if (isCube(node)) {
        tally.cubes++;
        return 1;
    }
    if (!isGroup(node)) return 0;

    tally.groups++;
    let count = 1;
    let shapeTaken = false;
    for (const child of node.children || []) {
        if (!isExported(child)) continue;
        if (!shapeTaken && isCube(child) && hasNoRotation(child)) {
            // The group's own shape: written into the group's node, no extra node
            shapeTaken = true;
            tally.cubes++;
            tally.freeCubes++;
            continue;
        }
        if (isCube(child) || isGroup(child)) {
            count += countElement(child, tally);
        }
    }
    return count;
}

function emptyTally(): HytaleNodeBreakdown {
    return { nodes: 0, groups: 0, cubes: 0, freeCubes: 0, rootCubes: 0 };
}

/**
 * Count the open model's Hytale nodes, with the parts that make up the number.
 *
 * @param without - elements to count as if they were already removed
 */
export function hytaleNodeBreakdown(without?: Set<any>): HytaleNodeBreakdown {
    const tally = emptyTally();
    // @ts-ignore - Outliner is a global from Blockbench
    const root: any[] = (typeof Outliner !== 'undefined' && Outliner.root) ? Outliner.root : [];
    excludedNodes = without && without.size ? without : null;
    try {
        for (const node of root) {
            if (!isCube(node) && !isGroup(node)) continue;
            const before = tally.cubes;
            tally.nodes += countElement(node, tally);
            if (isCube(node) && tally.cubes > before) tally.rootCubes++;
        }
    } finally {
        excludedNodes = null;
    }
    return tally;
}

/**
 * The open model's Hytale node count (the number the status bar, the panel,
 * the validator and the export dialogs all show).
 */
export function countHytaleNodes(): number {
    return hytaleNodeBreakdown().nodes;
}

/**
 * Nodes written for one outliner element and everything inside it
 * (used for the per-bone budget, so its rows add up to the total).
 */
export function countSubtreeNodes(node: any): number {
    return countElement(node, emptyTally());
}

// =========================================
// Saved model JSON
// =========================================

/**
 * Count nodes in a .blockymodel node tree: every node in the file is a node.
 */
function countBlockyNodes(nodes: any[]): number {
    let count = 0;
    for (const node of nodes) {
        if (!node || typeof node !== 'object') continue;
        count++;
        if (Array.isArray(node.children)) count += countBlockyNodes(node.children);
    }
    return count;
}

/**
 * Count Hytale nodes in saved model JSON.
 *
 * - .blockymodel ({ nodes: [...] }): every node in the tree, nested ones too.
 * - .bbmodel ({ elements, outliner }): the same rule as the open model, using
 *   the outliner tree (group objects with children; element uuids as strings).
 *
 * @returns the count, or null when the JSON is neither shape
 */
export function countHytaleNodesInJson(modelData: Record<string, unknown> | null | undefined): number | null {
    if (!modelData || typeof modelData !== 'object') return null;
    const nodes = (modelData as any).nodes;
    const elements = (modelData as any).elements;
    const outliner = (modelData as any).outliner;

    if (Array.isArray(nodes) && !Array.isArray(elements)) {
        return countBlockyNodes(nodes);
    }
    if (!Array.isArray(elements)) return null;

    const byUuid = new Map<string, any>();
    for (const el of elements) {
        if (el && typeof el === 'object' && el.uuid) byUuid.set(el.uuid, el);
    }
    const jsonIsCube = (el: any) => !!el && (el.type === undefined || el.type === 'cube');

    // Elements and groups inside blockymodel attachment collections are not in this file
    const skipped = new Set<string>();
    const collections = (modelData as any).collections;
    if (Array.isArray(collections)) {
        for (const c of collections) {
            if (c && c.export_codec === 'blockymodel' && Array.isArray(c.children)) {
                for (const uuid of c.children) skipped.add(uuid);
            }
        }
    }

    function countGroupJson(group: any): number {
        if (!group || group.export === false || skipped.has(group.uuid)) return 0;
        let count = 1;
        let shapeTaken = false;
        for (const child of group.children || []) {
            if (typeof child === 'string') {
                const el = byUuid.get(child);
                if (!jsonIsCube(el) || el.export === false || skipped.has(child)) continue;
                if (!shapeTaken && hasNoRotation(el)) {
                    shapeTaken = true;
                    continue;
                }
                count++;
            } else if (child && typeof child === 'object') {
                count += countGroupJson(child);
            }
        }
        return count;
    }

    // No outliner: every exported cube sits at the root
    if (!Array.isArray(outliner)) {
        return elements.filter((el: any) => jsonIsCube(el) && el.export !== false).length;
    }

    let total = 0;
    for (const entry of outliner) {
        if (typeof entry === 'string') {
            const el = byUuid.get(entry);
            if (jsonIsCube(el) && el.export !== false && !skipped.has(entry)) total++;
        } else if (entry && typeof entry === 'object') {
            total += countGroupJson(entry);
        }
    }
    return total;
}
