/**
 * Multi-Engine Export Dialog
 *
 * Exports the current model to different engine formats:
 * - .bbmodel (Blockbench/Minecraft)
 * - .blockymodel (Hytale native)
 * - ModelEngine blueprint (YAML)
 *
 * Uses the Myrlin API for server-side format conversion.
 */

import { track, trackStyle } from '../utils/cleanup';
import { parseCompiled } from '../utils/project_json';
import { getApiClient } from '../api-client';
import { validateModel, ValidationSeverity } from './validator';

// =========================================
// Types
// =========================================

/** Supported export format identifiers */
type ExportFormat = 'bbmodel' | 'blockymodel' | 'modelengine';

/** Metadata for each export format option */
interface FormatInfo {
    /** Machine identifier for API calls */
    id: ExportFormat;
    /** Display name shown in the dialog */
    label: string;
    /** File extension including the dot */
    extension: string;
    /** Target game engine or tool */
    engine: string;
    /** Brief description of the format */
    description: string;
    /** Key constraints or limits for this format */
    constraints: string;
}

// =========================================
// Constants
// =========================================

/** Dialog width in pixels */
const DIALOG_WIDTH = 560;

/** Available export format definitions */
const FORMAT_OPTIONS: FormatInfo[] = [
    {
        id: 'bbmodel',
        label: 'Blockbench (.bbmodel)',
        extension: '.bbmodel',
        engine: 'Minecraft / Blockbench',
        description: 'Standard Blockbench project format. Compatible with Minecraft Java and Bedrock resource packs.',
        constraints: 'Max 256 elements per model. Textures must be 16x16 or multiples thereof.',
    },
    {
        id: 'blockymodel',
        label: 'Hytale (.blockymodel)',
        extension: '.blockymodel',
        engine: 'Hytale',
        description: 'Native Hytale model format with node hierarchy, axis-aligned boxes, and per-face UVs.',
        constraints: 'Max 255 nodes: every group is a node, its first unrotated cube is free, every other cube is a node. Power-of-2 textures required.',
    },
    {
        id: 'modelengine',
        label: 'ModelEngine (YAML)',
        extension: '.yml',
        engine: 'ModelEngine (Minecraft plugin)',
        description: 'ModelEngine blueprint format for custom entity models in Minecraft servers.',
        constraints: 'Bones must follow ModelEngine naming conventions. Hitbox and mount points defined separately.',
    },
];

/** Default format selection */
const DEFAULT_FORMAT: ExportFormat = 'blockymodel';

// =========================================
// Helper Utilities
// =========================================

/**
 * Escape HTML special characters to prevent injection in dialog content.
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
 * Get the FormatInfo object for a given format identifier.
 *
 * @param formatId - The format identifier to look up
 * @returns The matching FormatInfo, or the first format as fallback
 */
function getFormatInfo(formatId: ExportFormat): FormatInfo {
    return FORMAT_OPTIONS.find(f => f.id === formatId) || FORMAT_OPTIONS[0];
}

/**
 * Extract the current Blockbench model as a plain JSON object
 * suitable for sending to the Myrlin API.
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

        // Fallback: build from globals
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
        console.warn('[Myrlin Export] Failed to extract model data:', e);
        return null;
    }
}

// =========================================
// Validation Integration
// =========================================

/**
 * Run local validation and return an HTML summary of the results.
 * Used for the inline "validate before export" display.
 *
 * @returns Object with html string and the overall severity
 */
function runInlineValidation(): { html: string; severity: ValidationSeverity } {
    const report = validateModel();

    const passCount = report.results.filter(r => r.severity === 'pass').length;
    const warnCount = report.results.filter(r => r.severity === 'warn').length;
    const failCount = report.results.filter(r => r.severity === 'fail').length;

    let statusColor = '#27ae60';
    let statusText = 'All checks passed';
    if (report.overallSeverity === 'fail') {
        statusColor = '#e74c3c';
        statusText = `${failCount} check(s) failed`;
    } else if (report.overallSeverity === 'warn') {
        statusColor = '#f39c12';
        statusText = `${warnCount} warning(s)`;
    }

    let html = `<div id="myrlin-export-validation" style="margin-top:12px;padding:10px;border:1px solid #444;border-radius:4px;background:#1e1e1e;">`;
    html += `<div style="font-size:13px;font-weight:bold;color:${statusColor};margin-bottom:8px;">`;
    html += `Validation: ${statusText}`;
    html += `</div>`;

    html += `<div style="font-size:12px;color:#aaa;margin-bottom:6px;">`;
    html += `${passCount} passed, ${warnCount} warning(s), ${failCount} failed`;
    html += `</div>`;

    // Show individual results
    html += `<table style="width:100%;border-collapse:collapse;font-size:12px;">`;
    for (const result of report.results) {
        let icon = '<span style="color:#27ae60;">&#x2705;</span>';
        if (result.severity === 'fail') {
            icon = '<span style="color:#e74c3c;">&#x274C;</span>';
        } else if (result.severity === 'warn') {
            icon = '<span style="color:#f39c12;">&#x26A0;</span>';
        }

        html += `<tr style="border-bottom:1px solid #333;">`;
        html += `<td style="padding:3px 6px;width:24px;">${icon}</td>`;
        html += `<td style="padding:3px 6px;font-weight:bold;">${escapeHtml(result.name)}</td>`;
        html += `<td style="padding:3px 6px;color:#ccc;">${escapeHtml(result.message)}</td>`;
        html += `</tr>`;
    }
    html += `</table>`;
    html += `</div>`;

    return { html, severity: report.overallSeverity };
}

// =========================================
// Dialog Content Builders
// =========================================

/**
 * Build the format info preview panel HTML for the currently selected format.
 *
 * @param format - The format to show info for
 * @returns HTML string with format details
 */
function buildFormatPreviewHtml(format: FormatInfo): string {
    return `
        <div id="myrlin-format-preview" style="margin-top:12px;padding:10px;border:1px solid #444;border-radius:4px;background:#1e1e1e;">
            <div style="font-size:14px;font-weight:bold;color:#ccc;margin-bottom:6px;">
                ${escapeHtml(format.label)}
            </div>
            <table style="font-size:12px;color:#aaa;border-collapse:collapse;width:100%;">
                <tr>
                    <td style="padding:2px 8px 2px 0;font-weight:bold;color:#888;width:100px;">Extension:</td>
                    <td style="padding:2px 0;font-family:monospace;">${escapeHtml(format.extension)}</td>
                </tr>
                <tr>
                    <td style="padding:2px 8px 2px 0;font-weight:bold;color:#888;">Engine:</td>
                    <td style="padding:2px 0;">${escapeHtml(format.engine)}</td>
                </tr>
                <tr>
                    <td style="padding:2px 8px 2px 0;font-weight:bold;color:#888;">Description:</td>
                    <td style="padding:2px 0;">${escapeHtml(format.description)}</td>
                </tr>
                <tr>
                    <td style="padding:2px 8px 2px 0;font-weight:bold;color:#888;">Constraints:</td>
                    <td style="padding:2px 0;color:#f39c12;">${escapeHtml(format.constraints)}</td>
                </tr>
            </table>
        </div>
    `;
}

/**
 * Build the complete dialog body HTML with format selector,
 * preview section, and validation toggle.
 *
 * @returns HTML string for the full dialog content
 */
function buildDialogHtml(): string {
    let html = '';

    // Header
    html += `<div style="margin-bottom:12px;">`;
    html += `<p style="font-size:13px;color:#aaa;">`;
    html += `Export your model to a specific game engine format. `;
    html += `The Myrlin API handles server-side format conversion.`;
    html += `</p>`;
    html += `</div>`;

    // Format selector with radio buttons
    html += `<div style="margin-bottom:4px;font-size:13px;font-weight:bold;color:#ccc;">Select Format:</div>`;
    html += `<div id="myrlin-format-selector" style="padding:8px;border:1px solid #444;border-radius:4px;background:#1a1a1a;">`;

    for (const fmt of FORMAT_OPTIONS) {
        const checked = fmt.id === DEFAULT_FORMAT ? 'checked' : '';
        html += `<label style="display:flex;align-items:center;padding:6px 4px;cursor:pointer;border-radius:3px;" class="myrlin-format-radio-label">`;
        html += `<input type="radio" name="myrlin_export_format" value="${fmt.id}" ${checked} `;
        html += `class="myrlin-format-radio" style="margin-right:10px;cursor:pointer;" />`;
        html += `<div>`;
        html += `<span style="font-size:13px;font-weight:bold;color:#ccc;">${escapeHtml(fmt.label)}</span>`;
        html += `<br/><span style="font-size:11px;color:#888;">${escapeHtml(fmt.engine)}</span>`;
        html += `</div>`;
        html += `</label>`;
    }

    html += `</div>`;

    // Format preview (shows default format initially)
    const defaultInfo = getFormatInfo(DEFAULT_FORMAT);
    html += buildFormatPreviewHtml(defaultInfo);

    // Validate first checkbox
    html += `<div style="margin-top:12px;padding:8px;border:1px solid #444;border-radius:4px;background:#1a1a1a;">`;
    html += `<label style="display:flex;align-items:center;cursor:pointer;">`;
    html += `<input type="checkbox" id="myrlin-validate-first" checked style="margin-right:10px;cursor:pointer;" />`;
    html += `<div>`;
    html += `<span style="font-size:13px;color:#ccc;">Validate before export</span>`;
    html += `<br/><span style="font-size:11px;color:#888;">Run validation checks to catch issues before exporting</span>`;
    html += `</div>`;
    html += `</label>`;
    html += `</div>`;

    // Run Validation button (inline results area)
    html += `<div style="margin-top:8px;text-align:right;">`;
    html += `<button id="myrlin-run-validation-btn" style="`;
    html += `padding:5px 14px;border:1px solid #555;border-radius:3px;`;
    html += `background:#2a2a2a;color:#ccc;cursor:pointer;font-size:12px;">`;
    html += `Run Validation</button>`;
    html += `</div>`;

    // Validation results placeholder
    html += `<div id="myrlin-validation-results"></div>`;

    return html;
}

// =========================================
// Export Workflow
// =========================================

/**
 * Get the file extension string (without dot) for a given format.
 *
 * @param formatId - Format identifier
 * @returns File extension array for Blockbench.export
 */
function getExtensions(formatId: ExportFormat): string[] {
    switch (formatId) {
        case 'bbmodel': return ['bbmodel'];
        case 'blockymodel': return ['blockymodel'];
        case 'modelengine': return ['yml'];
        default: return ['bbmodel'];
    }
}

/**
 * Get the currently selected format from the dialog DOM.
 *
 * @returns The selected ExportFormat identifier
 */
function getSelectedFormat(): ExportFormat {
    const selected = document.querySelector('input[name="myrlin_export_format"]:checked') as HTMLInputElement | null;
    if (selected) {
        return selected.value as ExportFormat;
    }
    return DEFAULT_FORMAT;
}

/**
 * Check whether the "Validate First" checkbox is checked.
 *
 * @returns true if validation should run before export
 */
function isValidateFirstChecked(): boolean {
    const cb = document.getElementById('myrlin-validate-first') as HTMLInputElement | null;
    return cb ? cb.checked : true;
}

/**
 * Execute the full export workflow:
 * 1. Extract model data
 * 2. Optionally validate
 * 3. Call API for format conversion
 * 4. Trigger file download via Blockbench
 */
async function performExport(): Promise<void> {
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

    const formatId = getSelectedFormat();
    const formatInfo = getFormatInfo(formatId);

    // Validate first if checkbox is checked
    if (isValidateFirstChecked()) {
        const report = validateModel();
        if (report.overallSeverity === 'fail') {
            // @ts-ignore - Blockbench is a global
            Blockbench.showMessageBox({
                title: 'Validation Failed',
                message: 'Your model has validation errors that should be fixed before exporting. ' +
                    'Run the validator for details, or uncheck "Validate before export" to skip.',
                icon: 'error',
            });
            return;
        }
    }

    // Show progress
    // @ts-ignore - Blockbench is a global
    Blockbench.showQuickMessage(`Exporting as ${formatInfo.label}...`, 2000);

    // For bbmodel, we can export directly without the API
    if (formatId === 'bbmodel') {
        const content = JSON.stringify(modelData, null, 2);
        // @ts-ignore - Blockbench is a global
        Blockbench.export({
            type: 'Export Model',
            extensions: getExtensions(formatId),
            // @ts-ignore - Project is a global from Blockbench
            name: (typeof Project !== 'undefined' && Project.name) ? Project.name : 'model',
            content,
        });

        // @ts-ignore - Blockbench is a global
        Blockbench.showQuickMessage('Exported as .bbmodel successfully', 2000);
        return;
    }

    // For other formats, call the API
    const client = getApiClient();
    await client.checkConnection();

    const result = await client.export(modelData, formatId);

    if (result.success && result.data) {
        // @ts-ignore - Blockbench is a global
        Blockbench.export({
            type: 'Export Model',
            extensions: getExtensions(formatId),
            // @ts-ignore - Project is a global from Blockbench
            name: (typeof Project !== 'undefined' && Project.name) ? Project.name : 'model',
            content: result.data,
        });

        // @ts-ignore - Blockbench is a global
        Blockbench.showQuickMessage(`Exported as ${formatInfo.extension} successfully`, 2000);
    } else {
        // @ts-ignore - Blockbench is a global
        Blockbench.showMessageBox({
            title: 'Export Failed',
            message: result.message || 'The export could not be completed.',
            icon: 'error',
        });
    }
}

// =========================================
// Dialog Event Setup
// =========================================

/**
 * Attach event listeners to the dialog DOM after it is shown.
 * Handles format radio button changes and the Run Validation button.
 */
function attachDialogEvents(): void {
    // Format radio change: update preview panel
    const radios = document.querySelectorAll('.myrlin-format-radio');
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            const formatId = (radio as HTMLInputElement).value as ExportFormat;
            const info = getFormatInfo(formatId);
            const previewEl = document.getElementById('myrlin-format-preview');
            if (previewEl) {
                previewEl.outerHTML = buildFormatPreviewHtml(info);
            }
        });
    });

    // Run Validation button
    const validateBtn = document.getElementById('myrlin-run-validation-btn');
    if (validateBtn) {
        validateBtn.addEventListener('click', () => {
            const resultsEl = document.getElementById('myrlin-validation-results');
            if (resultsEl) {
                const validation = runInlineValidation();
                resultsEl.innerHTML = validation.html;
            }
        });
    }
}

// =========================================
// Dialog Styles
// =========================================

/** CSS styles for the export dialog */
const EXPORT_STYLES = `
    .myrlin-format-radio-label:hover {
        background: #2a2a2a !important;
    }
    #myrlin-format-selector input[type="radio"] {
        accent-color: #3498db;
    }
    #myrlin-run-validation-btn:hover {
        background: #333 !important;
        border-color: #666 !important;
    }
`;

// =========================================
// Setup Entry Point
// =========================================

/**
 * Register the "Export for Engine" action in Blockbench.
 *
 * Creates:
 *   - An Action (myrlin_export_dialog) in the tools category
 *   - A Dialog with format selector, preview, and validation toggle
 *   - A menu entry under Tools via MenuBar.addAction
 *   - Custom CSS styles for the dialog
 *
 * Call this function from the plugin's onload() to activate the export dialog.
 */
export function setupExportDialog(): void {
    // Inject export dialog styles
    trackStyle(EXPORT_STYLES);

    // @ts-ignore - Action is a global from Blockbench
    const exportAction = new Action('myrlin_export_dialog', {
        name: 'Export for Engine',
        description: 'Export model to Hytale, ModelEngine, or Blockbench format (Myrlin\'s Tools)',
        icon: 'file_download',
        category: 'tools',
        click: () => {
            const dialogHtml = buildDialogHtml();

            // @ts-ignore - Dialog is a global from Blockbench
            const dialog = new Dialog({
                id: 'myrlin_export_dialog_ui',
                title: 'Export for Engine',
                width: DIALOG_WIDTH,
                lines: [dialogHtml],
                buttons: ['Export', 'Cancel'],
                onConfirm: () => {
                    performExport();
                },
                onCancel: () => {
                    // Close quietly
                },
                onOpen: () => {
                    // Attach interactive event listeners after the dialog DOM is ready
                    setTimeout(() => attachDialogEvents(), 50);
                },
            });

            dialog.show();
        },
    });

    // Track the action for cleanup on plugin unload
    // @ts-ignore
    track(exportAction);

    // Add to the Tools menu
    // @ts-ignore - MenuBar is a global from Blockbench
    MenuBar.addAction(exportAction, 'tools');
}
