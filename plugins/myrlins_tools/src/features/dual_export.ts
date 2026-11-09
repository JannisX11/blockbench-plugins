/**
 * Dual-Market Export
 *
 * Export the current model in both Hytale (.blockymodel) and
 * Minecraft (.bbmodel for ModelEngine) formats simultaneously.
 * Optionally also exports ItemsAdder format (MC resource pack JSON).
 *
 * Uses the Myrlin API for server-side format conversion where available,
 * falls back to local bbmodel save when offline.
 */

import { track, trackStyle } from '../utils/cleanup';
import { parseCompiled } from '../utils/project_json';
import { getApiClient } from '../api-client';
import { countHytaleNodes } from '../utils/hytale_nodes';

// =========================================
// Constants
// =========================================

/** Dialog width in pixels */
const DIALOG_WIDTH = 520;

// =========================================
// Types
// =========================================

/** A target format for dual export */
interface ExportTarget {
    /** Machine identifier */
    id: string;
    /** Display label */
    label: string;
    /** File extension (without dot) */
    extension: string;
    /** Whether this target is selected by default */
    defaultChecked: boolean;
    /** Whether this target requires the API */
    requiresApi: boolean;
}

// =========================================
// Export Target Definitions
// =========================================

/** Available export targets */
const EXPORT_TARGETS: ExportTarget[] = [
    {
        id: 'blockymodel',
        label: 'Hytale (.blockymodel)',
        extension: 'blockymodel',
        defaultChecked: true,
        requiresApi: true,
    },
    {
        id: 'modelengine',
        label: 'ModelEngine (.bbmodel)',
        extension: 'bbmodel',
        defaultChecked: true,
        requiresApi: true,
    },
    {
        id: 'itemsadder',
        label: 'ItemsAdder (MC JSON)',
        extension: 'json',
        defaultChecked: false,
        requiresApi: true,
    },
];

// =========================================
// ModelEngine Bone Prefix Mapping
// =========================================

/**
 * Hytale-to-ModelEngine bone name prefix mapping.
 * ModelEngine expects specific prefixes for entity behavior.
 */
const BONE_PREFIX_MAP: Record<string, string> = {
    'Head': 'head',
    'Body': 'body',
    'LeftArm': 'left_arm',
    'RightArm': 'right_arm',
    'LeftLeg': 'left_leg',
    'RightLeg': 'right_leg',
    'Hitbox': 'hitbox',
    'Mount': 'mount',
    'Nametag': 'tag_name',
};

// =========================================
// Helper Utilities
// =========================================

/**
 * Escape HTML special characters to prevent injection.
 *
 * @param str - Raw string to escape
 * @returns HTML-safe string
 */
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * Extract the current Blockbench model as a plain JSON object.
 *
 * @returns Model data object, or null if no model is open
 */
function extractModelData(): Record<string, unknown> | null {
    try {
        // @ts-ignore - Codecs is a global from Blockbench
        if (typeof Codecs !== 'undefined' && Codecs.project && typeof Codecs.project.compile === 'function') {
            // @ts-ignore
            return parseCompiled(Codecs.project.compile());
        }

        // @ts-ignore - Project is a global from Blockbench
        if (typeof Project === 'undefined' || !Project) {
            return null;
        }

        // @ts-ignore - Cube is a global from Blockbench
        const cubes = typeof Cube !== 'undefined' ? Cube.all : [];
        // @ts-ignore - Group is a global from Blockbench
        const groups = typeof Group !== 'undefined' ? Group.all : [];

        if (cubes.length === 0 && groups.length === 0) {
            return null;
        }

        const nodes: Record<string, unknown>[] = [];
        for (const cube of cubes) {
            nodes.push({
                name: cube.name || 'cube',
                from: cube.from ? [...cube.from] : [0, 0, 0],
                to: cube.to ? [...cube.to] : [1, 1, 1],
                type: 'cube',
            });
        }

        return {
            // @ts-ignore
            name: Project.name || 'untitled',
            nodes,
            meta: {
                group_count: groups.length,
                cube_count: cubes.length,
            },
        };
    } catch (e) {
        console.warn('[Myrlin DualExport] Failed to extract model data:', e);
        return null;
    }
}

/**
 * Get the current model name from the Blockbench project.
 *
 * @returns Model name string
 */
function getModelName(): string {
    try {
        // @ts-ignore - Project is a global from Blockbench
        if (typeof Project !== 'undefined' && Project && Project.name) {
            // @ts-ignore
            return Project.name;
        }
    } catch {
        // ignore
    }
    return 'model';
}

/**
 * Get the total node count of the current model.
 *
 * @returns Hytale nodes (utils/hytale_nodes, the count every panel shows);
 *          until 3.4.1 this was every cube plus every group
 */
function getNodeCount(): number {
    try {
        return countHytaleNodes();
    } catch {
        return 0;
    }
}

// =========================================
// Export Logic
// =========================================

/**
 * Apply ModelEngine bone prefix mapping to model data.
 * Creates a deep copy and renames nodes that match the prefix map.
 *
 * @param modelData - Original model data
 * @returns New model data with ModelEngine-compatible bone names
 */
function applyModelEnginePrefixes(modelData: Record<string, unknown>): Record<string, unknown> {
    const copy = JSON.parse(JSON.stringify(modelData));
    const nodes = copy.nodes as Array<Record<string, unknown>> | undefined;

    if (nodes && Array.isArray(nodes)) {
        for (const node of nodes) {
            const name = node.name as string;
            if (name && BONE_PREFIX_MAP[name]) {
                node.name = BONE_PREFIX_MAP[name];
            }
        }
    }

    return copy;
}

/**
 * Perform the dual export operation. Exports to all selected formats,
 * using the API where available and falling back to local save.
 *
 * @param selectedIds - Array of selected export target IDs
 */
async function performDualExport(selectedIds: string[]): Promise<void> {
    const modelData = extractModelData();
    if (!modelData) {
        // @ts-ignore - Blockbench is a global
        Blockbench.showMessageBox({
            title: 'No Model Open',
            message: 'Please open a model before exporting.',
            icon: 'warning',
        });
        return;
    }

    const modelName = getModelName();
    const client = getApiClient();
    const isOnline = await client.checkConnection();

    const results: string[] = [];
    const errors: string[] = [];

    for (const targetId of selectedIds) {
        const target = EXPORT_TARGETS.find(t => t.id === targetId);
        if (!target) continue;

        try {
            if (target.requiresApi && isOnline) {
                // Use API for server-side conversion
                let dataToExport = modelData;

                // Apply ModelEngine prefix mapping before exporting
                if (targetId === 'modelengine') {
                    dataToExport = applyModelEnginePrefixes(modelData);
                }

                const result = await client.export(dataToExport, targetId);

                if (result.success && result.data) {
                    // Trigger file save
                    // @ts-ignore - Blockbench is a global
                    Blockbench.export({
                        type: `Export ${target.label}`,
                        extensions: [target.extension],
                        name: modelName,
                        content: result.data,
                        savetype: 'text',
                    });
                    results.push(target.label);
                } else {
                    errors.push(`${target.label}: ${result.message || 'Export failed'}`);
                }
            } else if (target.requiresApi && !isOnline) {
                // Offline fallback: save as bbmodel with a note
                if (targetId === 'modelengine') {
                    // For ModelEngine, save bbmodel with renamed bones
                    const meData = applyModelEnginePrefixes(modelData);
                    const content = JSON.stringify(meData, null, 2);
                    // @ts-ignore - Blockbench is a global
                    Blockbench.export({
                        type: `Export ${target.label}`,
                        extensions: ['bbmodel'],
                        name: `${modelName}_modelengine`,
                        content,
                        savetype: 'text',
                    });
                    results.push(`${target.label} (local bbmodel, API offline)`);
                } else {
                    errors.push(`${target.label}: requires API connection (offline)`);
                }
            }
        } catch (e) {
            errors.push(`${target.label}: ${e}`);
        }
    }

    // Show results summary
    showExportResults(results, errors);
}

/**
 * Show a summary dialog after dual export completes.
 *
 * @param successes - List of successfully exported format labels
 * @param failures - List of error messages for failed exports
 */
function showExportResults(successes: string[], failures: string[]): void {
    let html = '<div style="padding:8px 0;">';

    if (successes.length > 0) {
        html += `<div style="color:#27ae60;font-weight:bold;margin-bottom:8px;">Exported successfully:</div>`;
        html += '<ul style="margin:4px 0 12px 20px;font-size:13px;color:#ccc;">';
        for (const s of successes) {
            html += `<li>${escapeHtml(s)}</li>`;
        }
        html += '</ul>';
    }

    if (failures.length > 0) {
        html += `<div style="color:#e74c3c;font-weight:bold;margin-bottom:8px;">Failed:</div>`;
        html += '<ul style="margin:4px 0 12px 20px;font-size:13px;color:#ccc;">';
        for (const f of failures) {
            html += `<li>${escapeHtml(f)}</li>`;
        }
        html += '</ul>';
    }

    if (successes.length === 0 && failures.length === 0) {
        html += `<p style="color:#888;">No formats were selected for export.</p>`;
    }

    html += '</div>';

    // @ts-ignore - Dialog is a global from Blockbench
    new Dialog({
        id: 'myrlin_dual_export_results',
        title: 'Export Results',
        width: 400,
        lines: [html],
        buttons: ['OK'],
        onConfirm: () => { /* close */ },
    }).show();
}

// =========================================
// Main Dialog
// =========================================

/**
 * Show the dual-market export dialog.
 * Displays model info, format checkboxes, and export button.
 */
function showDualExportDialog(): void {
    const modelName = getModelName();
    const nodeCount = getNodeCount();

    if (nodeCount === 0) {
        // @ts-ignore - Blockbench is a global
        Blockbench.showMessageBox({
            title: 'No Model Open',
            message: 'Please open a model before exporting.',
            icon: 'warning',
        });
        return;
    }

    let html = '';

    // Model info header
    html += `<div style="margin-bottom:16px;padding:10px;border:1px solid #444;border-radius:4px;background:#1e1e1e;">`;
    html += `<div style="font-size:14px;font-weight:bold;color:#ccc;">${escapeHtml(modelName)}</div>`;
    html += `<div style="font-size:12px;color:#888;margin-top:4px;">${nodeCount} node(s)</div>`;
    html += `</div>`;

    // Format checkboxes
    html += `<div style="margin-bottom:4px;font-size:13px;font-weight:bold;color:#ccc;">Export Formats:</div>`;
    html += `<div style="padding:8px;border:1px solid #444;border-radius:4px;background:#1a1a1a;">`;

    for (const target of EXPORT_TARGETS) {
        const checked = target.defaultChecked ? 'checked' : '';
        html += `<label style="display:flex;align-items:center;padding:6px 4px;cursor:pointer;border-radius:3px;" class="myrlin-dual-export-label">`;
        html += `<input type="checkbox" class="myrlin-dual-export-check" value="${target.id}" ${checked} `;
        html += `style="margin-right:10px;cursor:pointer;" />`;
        html += `<div>`;
        html += `<span style="font-size:13px;color:#ccc;">${escapeHtml(target.label)}</span>`;
        if (target.requiresApi) {
            html += ` <span style="font-size:10px;color:#555;">(API)</span>`;
        }
        html += `</div>`;
        html += `</label>`;
    }

    html += `</div>`;

    // ModelEngine note
    html += `<div style="margin-top:12px;padding:8px;border:1px solid #444;border-radius:4px;background:#1a1a1a;font-size:12px;color:#888;">`;
    html += `<strong style="color:#aaa;">ModelEngine note:</strong> Bone names will be auto-mapped `;
    html += `(Head &rarr; head, Body &rarr; body, LeftArm &rarr; left_arm, etc.) `;
    html += `to match ModelEngine naming conventions.`;
    html += `</div>`;

    // @ts-ignore - Dialog is a global from Blockbench
    const dialog = new Dialog({
        id: 'myrlin_dual_export_dialog',
        title: 'Export for Both Markets',
        width: DIALOG_WIDTH,
        lines: [html],
        buttons: ['Export', 'Cancel'],
        onConfirm: () => {
            // Collect selected format IDs
            const selectedIds: string[] = [];
            const checkboxes = document.querySelectorAll('.myrlin-dual-export-check');
            checkboxes.forEach(cb => {
                const input = cb as HTMLInputElement;
                if (input.checked) {
                    selectedIds.push(input.value);
                }
            });

            if (selectedIds.length === 0) {
                // @ts-ignore - Blockbench is a global
                Blockbench.showQuickMessage('No formats selected for export', 1500);
                return;
            }

            // @ts-ignore - Blockbench is a global
            Blockbench.showQuickMessage(`Exporting to ${selectedIds.length} format(s)...`, 2000);
            performDualExport(selectedIds);
        },
        onCancel: () => { /* close */ },
    });

    dialog.show();
}

// =========================================
// Panel Styles
// =========================================

/** CSS styles for the dual export dialog */
const DUAL_EXPORT_STYLES = `
    .myrlin-dual-export-label:hover {
        background: #2a2a2a !important;
    }
    .myrlin-dual-export-check {
        accent-color: #3498db;
    }
`;

// =========================================
// Setup Entry Point
// =========================================

/**
 * Register the "Export for Both Markets" action in Blockbench.
 *
 * Creates:
 *   - An Action (myrlin_dual_export) in the tools category
 *   - A menu entry under Tools via MenuBar.addAction
 *   - Custom CSS styles for the dialog
 *
 * Call this function from the plugin's onload() to activate dual-market export.
 */
export function setupDualExport(): void {
    // Inject dual export styles
    trackStyle(DUAL_EXPORT_STYLES);

    // @ts-ignore - Action is a global from Blockbench
    const dualExportAction = new Action('myrlin_dual_export', {
        name: 'Export for Both Markets',
        description: 'Export model to Hytale and Minecraft formats simultaneously (Myrlin\'s Tools)',
        icon: 'compare_arrows',
        category: 'tools',
        click: () => {
            showDualExportDialog();
        },
    });

    // Track the action for cleanup on plugin unload
    // @ts-ignore
    track(dualExportAction);

    // Add to the Tools menu
    // @ts-ignore - MenuBar is a global from Blockbench
    MenuBar.addAction(dualExportAction, 'tools');
}
