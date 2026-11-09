/**
 * Panel - Side panel UI showing model stats, node budget, and tool buttons
 *
 * Performance: Quick stats (node count, texture) update instantly.
 * Expensive stats (interior count, merge savings) are debounced (500ms)
 * and marked stale while recalculating.
 */

import { track } from '../utils/cleanup';
import { estimateSavings } from '../optimizer/box_merge';
import { countInteriorCubes, HOLLOW_ENABLED } from '../optimizer/hollow';
import { debounce } from '../utils/debounce';
import { calculateNodeBudget, getTotalNodeCount, countRootCubeNodes, BoneNodeInfo } from '../features/node_budget';
import { HYTALE_MAX_NODES } from '../utils/hytale_nodes';

// What the Nodes number means (shown on hover); the same count as Hytale and the Hytale Models plugin
const NODE_RULE_HINT = 'Hytale nodes: every group is one node, its first unrotated cube is free, every other cube is one node. Same count as Hytale and the Hytale Models plugin.';

/**
 * Quick stats that are cheap to compute (run on every event)
 */
function getQuickStats(): {
    nodeCount: number;
    maxNodes: number;
    textureSize: string;
    isValid: boolean;
} {
    const nodeCount = getTotalNodeCount();

    // @ts-ignore - Texture is a global from Blockbench
    const texture = Texture.all[0];
    const textureSize = texture ? `${texture.width}x${texture.height}` : 'No texture';

    return {
        nodeCount,
        maxNodes: HYTALE_MAX_NODES,
        textureSize,
        isValid: nodeCount <= HYTALE_MAX_NODES
    };
}

/**
 * Expensive stats that should be debounced (500ms after last event)
 */
function getExpensiveStats(): {
    interiorCount: number;
    potentialSavings: number;
} {
    const estimate = estimateSavings();
    const interiorCount = countInteriorCubes();

    return {
        interiorCount,
        // Nodes Optimize Boxes would actually remove (a dry run of the same merge)
        potentialSavings: estimate.nodeSavings
    };
}

export function setupPanel(): void {
    // @ts-ignore - Panel is a global from Blockbench
    const panel = new Panel('myrlins_tools_panel', {
        name: "Myrlin's Tools",
        id: 'myrlins_tools_panel',
        icon: 'auto_fix_high',
        growable: true,
        condition: {
            modes: ['edit'],
            method: () => true
        },
        default_position: {
            slot: 'right_bar',
            float_position: [0, 0],
            float_size: [300, 500],
            height: 500
        },
        component: {
            template: `
                <div class="myrlin-panel">
                    <div class="myrlin-section">
                        <h4 class="myrlin-section-title">Model Status</h4>
                        <div class="myrlin-stats">
                            <div class="myrlin-stat-row" :class="{ 'myrlin-stat-error': !quickStats.isValid }" :title="nodeRuleHint">
                                <span class="myrlin-stat-icon">{{ quickStats.isValid ? '✅' : '❌' }}</span>
                                <span class="myrlin-stat-label">Nodes:</span>
                                <span class="myrlin-stat-value">{{ quickStats.nodeCount }} / {{ quickStats.maxNodes }}</span>
                            </div>
                            <div class="myrlin-stat-row">
                                <span class="myrlin-stat-icon">🎨</span>
                                <span class="myrlin-stat-label">Texture:</span>
                                <span class="myrlin-stat-value">{{ quickStats.textureSize }}</span>
                            </div>
                            <div class="myrlin-stat-row" v-if="expensiveStats.interiorCount > 0">
                                <span class="myrlin-stat-icon">{{ expensiveStale ? '⏳' : '⚠️' }}</span>
                                <span class="myrlin-stat-label">Hidden interior:</span>
                                <span class="myrlin-stat-value" :class="{ 'myrlin-stale': expensiveStale }">{{ expensiveStats.interiorCount }} boxes</span>
                            </div>
                            <div class="myrlin-stat-row" v-if="expensiveStats.potentialSavings > 0">
                                <span class="myrlin-stat-icon">{{ expensiveStale ? '⏳' : '💡' }}</span>
                                <span class="myrlin-stat-label">Optimize Boxes saves:</span>
                                <span class="myrlin-stat-value" :class="{ 'myrlin-stale': expensiveStale }">{{ expensiveStats.potentialSavings }} {{ expensiveStats.potentialSavings === 1 ? 'node' : 'nodes' }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="myrlin-section" v-if="nodeBudget.length > 0">
                        <h4 class="myrlin-section-title">
                            Node Budget
                            <span class="myrlin-section-badge">{{ quickStats.nodeCount }}/{{ quickStats.maxNodes }}</span>
                        </h4>
                        <div class="myrlin-budget-tree">
                            <div v-for="bone in nodeBudget" :key="bone.uuid" class="myrlin-budget-bone">
                                <div
                                    class="myrlin-budget-row"
                                    :class="getBudgetClass(bone)"
                                    @click="selectBone(bone.uuid)"
                                >
                                    <span class="myrlin-budget-name" @click.stop="toggleBone(bone.uuid)">
                                        {{ expandedBones[bone.uuid] ? '▼' : '▶' }} {{ bone.name }}
                                    </span>
                                    <span class="myrlin-budget-count">{{ bone.nodes }}</span>
                                </div>
                                <div v-if="expandedBones[bone.uuid] && bone.children.length > 0" class="myrlin-budget-children">
                                    <div
                                        v-for="child in bone.children"
                                        :key="child.uuid"
                                        class="myrlin-budget-row myrlin-budget-child"
                                        @click="selectBone(child.uuid)"
                                    >
                                        <span class="myrlin-budget-name">{{ child.name }}</span>
                                        <span class="myrlin-budget-count">{{ child.nodes }}</span>
                                    </div>
                                </div>
                            </div>
                            <div v-if="rootCubeNodes > 0" class="myrlin-budget-bone">
                                <div class="myrlin-budget-row" title="Cubes outside any group: one node each">
                                    <span class="myrlin-budget-name">Cubes outside groups</span>
                                    <span class="myrlin-budget-count">{{ rootCubeNodes }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="myrlin-section">
                        <h4 class="myrlin-section-title">Tools</h4>
                        <div class="myrlin-buttons">
                            <button class="myrlin-btn" @click="runAction('myrlin_optimize_boxes')" :disabled="quickStats.nodeCount === 0">
                                <span class="myrlin-btn-icon">📦</span>
                                <span class="myrlin-btn-text">Optimize Boxes</span>
                            </button>
                            <button v-if="hollowEnabled" class="myrlin-btn" @click="runAction('myrlin_hollow_interior')" :disabled="expensiveStats.interiorCount === 0">
                                <span class="myrlin-btn-icon">🕳️</span>
                                <span class="myrlin-btn-text">Hollow Interior</span>
                            </button>
                            <div v-else class="myrlin-tool-note">Hollow Interior is coming back soon.</div>
                            <button class="myrlin-btn" @click="runAction('myrlin_palette_converter')">
                                <span class="myrlin-btn-icon">🎨</span>
                                <span class="myrlin-btn-text">Palette Converter</span>
                            </button>
                            <button class="myrlin-btn" @click="runAction('myrlin_validate')">
                                <span class="myrlin-btn-icon material-icons">check_circle</span>
                                <span class="myrlin-btn-text">Validate Model</span>
                            </button>
                        </div>
                    </div>

                    ${/* 3.4.3: no Model Browser in the store edition (src/edition.d.ts), so its Import section is not in the template. */ ''}${(typeof MYRLIN_STORE_EDITION !== 'undefined' && MYRLIN_STORE_EDITION === true) ? '' : `<div class="myrlin-section">
                        <h4 class="myrlin-section-title">Import</h4>
                        <div class="myrlin-buttons">
                            <button class="myrlin-btn" @click="runAction('myrlin_model_browser')">
                                <span class="myrlin-btn-icon">🗂️</span>
                                <span class="myrlin-btn-text">Browse Models</span>
                            </button>
                        </div>
                    </div>`}
                </div>
            `,
            data() {
                return {
                    quickStats: getQuickStats(),
                    expensiveStats: { interiorCount: 0, potentialSavings: 0 },
                    hollowEnabled: HOLLOW_ENABLED,
                    expensiveStale: true,
                    nodeBudget: [] as BoneNodeInfo[],
                    rootCubeNodes: 0,
                    nodeRuleHint: NODE_RULE_HINT,
                    expandedBones: {} as Record<string, boolean>,
                    debouncedExpensiveUpdate: null as any
                };
            },
            methods: {
                updateQuickStats() {
                    this.quickStats = getQuickStats();
                    this.expensiveStale = true;
                    this.nodeBudget = calculateNodeBudget();
                    this.rootCubeNodes = countRootCubeNodes();
                    if (this.debouncedExpensiveUpdate) {
                        this.debouncedExpensiveUpdate();
                    }
                },
                updateExpensiveStats() {
                    this.expensiveStats = getExpensiveStats();
                    this.expensiveStale = false;
                },
                runAction(actionId: string) {
                    // @ts-ignore - BarItems is a global from Blockbench
                    if (BarItems[actionId]) {
                        // @ts-ignore
                        BarItems[actionId].click();
                    }
                },
                selectBone(uuid: string) {
                    // @ts-ignore - Group is a global from Blockbench
                    const group = Group.all.find((g: any) => g.uuid === uuid);
                    if (group) {
                        group.select();
                    }
                },
                toggleBone(uuid: string) {
                    this.$set(this.expandedBones, uuid, !this.expandedBones[uuid]);
                },
                getBudgetClass(bone: BoneNodeInfo) {
                    const fairShare = Math.floor(HYTALE_MAX_NODES / Math.max(this.nodeBudget.length, 1));
                    if (bone.nodes > fairShare) return 'myrlin-budget-red';
                    if (bone.nodes > fairShare * 0.5) return 'myrlin-budget-yellow';
                    return 'myrlin-budget-green';
                }
            },
            mounted() {
                // Create debounced expensive stats updater (500ms delay)
                this.debouncedExpensiveUpdate = debounce(() => {
                    this.updateExpensiveStats();
                }, 500);

                // Initial expensive stats load
                this.updateExpensiveStats();
                this.nodeBudget = calculateNodeBudget();
                this.rootCubeNodes = countRootCubeNodes();

                // Listen for model changes - quick stats update instantly
                // @ts-ignore
                this._updateListener = Blockbench.on('update_selection', () => {
                    this.updateQuickStats();
                });
                // @ts-ignore
                this._undoListener = Blockbench.on('undo', () => {
                    this.updateQuickStats();
                });
                // @ts-ignore
                this._redoListener = Blockbench.on('redo', () => {
                    this.updateQuickStats();
                });
            },
            beforeDestroy() {
                // @ts-ignore
                if (this._updateListener) this._updateListener.delete();
                // @ts-ignore
                if (this._undoListener) this._undoListener.delete();
                // @ts-ignore
                if (this._redoListener) this._redoListener.delete();
            }
        }
    });

    track(panel);

    // Inject panel CSS once, tracked for cleanup on unload
    // @ts-ignore - Blockbench is a global
    const panelCSS = Blockbench.addCSS(PANEL_CSS);
    track({ delete: () => panelCSS.delete() });
}

// Panel CSS - injected once in setupPanel(), tracked for cleanup
const PANEL_CSS = `
    .myrlin-panel {
        padding: 8px;
        font-size: 12px;
    }

    .myrlin-section {
        margin-bottom: 16px;
    }

    .myrlin-section-title {
        margin: 0 0 8px 0;
        padding: 4px 0;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--color-subtle_text);
        border-bottom: 1px solid var(--color-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .myrlin-section-badge {
        font-size: 10px;
        font-weight: 400;
        padding: 1px 6px;
        border-radius: 8px;
        background: var(--color-back);
    }

    .myrlin-stats {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .myrlin-stat-row {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 6px;
        background: var(--color-back);
        border-radius: 4px;
    }

    .myrlin-stat-row.myrlin-stat-error {
        background: rgba(255, 100, 100, 0.2);
    }

    .myrlin-stat-icon {
        font-size: 14px;
        width: 20px;
        text-align: center;
    }

    .myrlin-stat-label {
        color: var(--color-subtle_text);
    }

    .myrlin-stat-value {
        margin-left: auto;
        font-weight: 500;
    }

    .myrlin-stale {
        opacity: 0.5;
        font-style: italic;
    }

    /* Node Budget Tree */
    .myrlin-budget-tree {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .myrlin-budget-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 3px 6px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 11px;
    }

    .myrlin-budget-row:hover {
        background: var(--color-button);
    }

    .myrlin-budget-name {
        cursor: pointer;
        user-select: none;
    }

    .myrlin-budget-count {
        font-weight: 500;
        font-variant-numeric: tabular-nums;
    }

    .myrlin-budget-children {
        padding-left: 16px;
    }

    .myrlin-budget-child {
        font-size: 10px;
        color: var(--color-subtle_text);
    }

    .myrlin-budget-green .myrlin-budget-count { color: #4ade80; }
    .myrlin-budget-yellow .myrlin-budget-count { color: #facc15; }
    .myrlin-budget-red .myrlin-budget-count { color: #f87171; }

    /* Buttons */
    .myrlin-buttons {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .myrlin-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: var(--color-button);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        color: var(--color-text);
        transition: background 0.15s;
    }

    .myrlin-btn:hover:not(:disabled) {
        background: var(--color-accent);
    }

    .myrlin-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .myrlin-btn-icon {
        font-size: 16px;
    }

    .myrlin-btn-text {
        flex: 1;
    }

    .myrlin-tool-note {
        padding: 2px 12px;
        font-size: 11px;
        color: var(--color-subtle_text);
    }
`;
