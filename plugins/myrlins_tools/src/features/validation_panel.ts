/**
 * Enhanced Validation Panel
 *
 * Validates models against engine-specific rules with severity grading.
 * Supports Hytale, ModelEngine, and FreeMinecraftModels profiles.
 * Shows results with one-click repair triggers.
 */

import { track, trackStyle } from '../utils/cleanup';
import { parseCompiled } from '../utils/project_json';
import { getApiClient, Severity } from '../api-client';

// =========================================
// Types
// =========================================

/** Supported engine profiles for validation */
type EngineProfile = 'hytale' | 'modelengine' | 'freemc';

/** Engine profile metadata for the selector dropdown */
interface EngineProfileInfo {
    /** Machine identifier for API calls */
    id: EngineProfile;
    /** Display name in the dropdown */
    label: string;
    /** Brief description of the engine */
    description: string;
}

/** A single validation issue with engine-specific context */
interface EngineValidationIssue {
    /** Severity level of the issue */
    severity: Severity;
    /** Machine-readable issue code (e.g. 'NODE_LIMIT', 'NAMING_CONVENTION') */
    code: string;
    /** Human-readable description of the issue */
    message: string;
    /** Optional location in the model (e.g. node name or path) */
    location?: string;
    /** Whether the issue can be auto-fixed via the repair panel */
    auto_fixable: boolean;
}

/** Full validation result from engine-specific checks */
interface EngineValidationReport {
    /** Whether the model is valid for the target engine */
    valid: boolean;
    /** Array of issues found during validation */
    issues: EngineValidationIssue[];
    /** Count summary by severity */
    summary: Record<string, number>;
}

// =========================================
// Constants
// =========================================

/** Dialog width in pixels */
const DIALOG_WIDTH = 640;

/** Maximum issues to display before truncating */
const MAX_DISPLAY_ISSUES = 50;

/** Available engine profiles */
const ENGINE_PROFILES: EngineProfileInfo[] = [
    {
        id: 'hytale',
        label: 'Hytale',
        description: 'Validate against Hytale modding requirements (255 node limit, naming conventions, texture rules)',
    },
    {
        id: 'modelengine',
        label: 'ModelEngine',
        description: 'Validate against ModelEngine blueprint rules (bone naming, hitbox, mount points)',
    },
    {
        id: 'freemc',
        label: 'FreeMinecraftModels',
        description: 'Validate against FreeMinecraftModels constraints (element limits, rotation rules)',
    },
];

/** Default engine profile */
const DEFAULT_ENGINE: EngineProfile = 'hytale';

// =========================================
// Severity Helpers
// =========================================

/**
 * Return an HTML-safe colored icon span for a given severity.
 *
 * @param severity - The issue severity level
 * @returns HTML string with styled icon
 */
function severityIconHtml(severity: Severity): string {
    switch (severity) {
        case 'error':
            return '<span style="color:#e74c3c;font-weight:bold;" title="Error">&#x2716;</span>';
        case 'warning':
            return '<span style="color:#f39c12;font-weight:bold;" title="Warning">&#x26A0;</span>';
        case 'info':
            return '<span style="color:#3498db;font-weight:bold;" title="Info">&#x2139;</span>';
        default:
            return '<span>&#x2022;</span>';
    }
}

/**
 * Return a CSS color string for a given severity.
 *
 * @param severity - The issue severity level
 * @returns CSS hex color string
 */
function severityColor(severity: Severity): string {
    switch (severity) {
        case 'error': return '#e74c3c';
        case 'warning': return '#f39c12';
        case 'info': return '#3498db';
        default: return '#888';
    }
}

/**
 * Return the sort priority for a severity level.
 * Lower numbers sort first (errors on top).
 *
 * @param severity - The issue severity level
 * @returns Numeric priority (0 = highest)
 */
function severityPriority(severity: Severity): number {
    switch (severity) {
        case 'error': return 0;
        case 'warning': return 1;
        case 'info': return 2;
        default: return 3;
    }
}

/**
 * Return a severity label string for display.
 *
 * @param severity - The issue severity level
 * @returns Uppercase label string
 */
function severityLabel(severity: Severity): string {
    switch (severity) {
        case 'error': return 'ERROR';
        case 'warning': return 'WARNING';
        case 'info': return 'INFO';
        default: return 'UNKNOWN';
    }
}

// =========================================
// HTML Helpers
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

// =========================================
// Model Data Extraction
// =========================================

/**
 * Extract the current Blockbench model as a plain JSON object
 * suitable for sending to the Myrlin API for validation.
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
        console.warn('[Myrlin Validation Panel] Failed to extract model data:', e);
        return null;
    }
}

// =========================================
// Results Display
// =========================================

/**
 * Build the HTML for the issue count summary bar at the top of results.
 *
 * @param issues - Array of validation issues
 * @returns HTML string with colored count badges
 */
function buildSummaryHtml(issues: EngineValidationIssue[]): string {
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warnCount = issues.filter(i => i.severity === 'warning').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;
    const fixableCount = issues.filter(i => i.auto_fixable).length;

    let html = `<div style="padding:8px 0;margin-bottom:8px;border-bottom:1px solid #444;font-size:13px;">`;

    html += `<span style="color:${severityColor('error')};font-weight:bold;margin-right:12px;">`;
    html += `${errorCount} error(s)</span>`;

    html += `<span style="color:${severityColor('warning')};font-weight:bold;margin-right:12px;">`;
    html += `${warnCount} warning(s)</span>`;

    html += `<span style="color:${severityColor('info')};font-weight:bold;margin-right:12px;">`;
    html += `${infoCount} info</span>`;

    if (fixableCount > 0) {
        html += `<span style="color:#27ae60;margin-left:8px;">`;
        html += `| ${fixableCount} auto-fixable</span>`;
    }

    html += `</div>`;
    return html;
}

/**
 * Build the HTML table showing all issues grouped by severity.
 * Each fixable issue gets a "Fix" button that triggers the repair panel.
 * A "Fix All" button appears when there are fixable issues.
 *
 * @param issues - Array of validation issues to display
 * @returns HTML string with the complete results table
 */
function buildResultsTableHtml(issues: EngineValidationIssue[]): string {
    if (issues.length === 0) {
        return `
            <div style="padding:20px;text-align:center;color:#27ae60;">
                <p style="font-size:16px;font-weight:bold;">No issues found</p>
                <p style="color:#888;">Your model passes all validation checks for this engine profile.</p>
            </div>
        `;
    }

    // Sort by severity: errors first, then warnings, then info
    const sorted = [...issues].sort((a, b) => severityPriority(a.severity) - severityPriority(b.severity));
    const displayed = sorted.slice(0, MAX_DISPLAY_ISSUES);
    const truncated = sorted.length - displayed.length;
    const hasFixable = issues.some(i => i.auto_fixable);

    let html = '';

    // Summary bar
    html += buildSummaryHtml(issues);

    // Fix All button (only if there are fixable issues)
    if (hasFixable) {
        html += `<div style="margin-bottom:8px;text-align:right;">`;
        html += `<button id="myrlin-vp-fix-all" style="`;
        html += `padding:5px 14px;border:1px solid #27ae60;border-radius:3px;`;
        html += `background:#1a3a1a;color:#27ae60;cursor:pointer;font-size:12px;font-weight:bold;">`;
        html += `Fix All Auto-Fixable</button>`;
        html += `</div>`;
    }

    // Issues table
    html += `<div id="myrlin-vp-issues" style="max-height:340px;overflow-y:auto;border:1px solid #444;border-radius:4px;">`;
    html += `<table style="width:100%;border-collapse:collapse;font-size:13px;">`;
    html += `<thead><tr style="background:#2a2a2a;position:sticky;top:0;">`;
    html += `<th style="padding:6px 8px;text-align:left;width:28px;"></th>`;
    html += `<th style="padding:6px 8px;text-align:left;width:100px;">Code</th>`;
    html += `<th style="padding:6px 8px;text-align:left;">Message</th>`;
    html += `<th style="padding:6px 8px;text-align:left;width:100px;">Location</th>`;
    html += `<th style="padding:6px 8px;text-align:center;width:60px;">Action</th>`;
    html += `</tr></thead><tbody>`;

    for (let i = 0; i < displayed.length; i++) {
        const issue = displayed[i];
        const rowBg = i % 2 === 0 ? '#1e1e1e' : '#252525';

        html += `<tr style="background:${rowBg};border-bottom:1px solid #333;">`;

        // Severity icon
        html += `<td style="padding:6px 8px;text-align:center;">${severityIconHtml(issue.severity)}</td>`;

        // Code (monospace)
        html += `<td style="padding:6px 8px;font-family:monospace;font-size:11px;color:${severityColor(issue.severity)};">`;
        html += `${escapeHtml(issue.code)}</td>`;

        // Message
        html += `<td style="padding:6px 8px;color:#ccc;">${escapeHtml(issue.message)}</td>`;

        // Location
        html += `<td style="padding:6px 8px;font-size:11px;color:#888;">`;
        html += issue.location ? escapeHtml(issue.location) : '-';
        html += `</td>`;

        // Fix button
        html += `<td style="padding:6px 8px;text-align:center;">`;
        if (issue.auto_fixable) {
            html += `<button class="myrlin-vp-fix-btn" data-code="${escapeHtml(issue.code)}" style="`;
            html += `padding:2px 8px;border:1px solid #27ae60;border-radius:3px;`;
            html += `background:#1a3a1a;color:#27ae60;cursor:pointer;font-size:11px;">`;
            html += `Fix</button>`;
        } else {
            html += `<span style="color:#555;font-size:11px;">manual</span>`;
        }
        html += `</td>`;

        html += `</tr>`;
    }

    html += `</tbody></table></div>`;

    if (truncated > 0) {
        html += `<p style="color:#888;font-size:12px;margin-top:4px;">`;
        html += `...and ${truncated} more issue(s) not shown.</p>`;
    }

    return html;
}

// =========================================
// Dialog Content
// =========================================

/**
 * Build the initial dialog HTML with engine selector and validate button.
 * Results are shown inline after the user clicks "Validate".
 *
 * @returns HTML string for the dialog body
 */
function buildDialogHtml(): string {
    let html = '';

    // Header
    html += `<div style="margin-bottom:12px;">`;
    html += `<p style="font-size:13px;color:#aaa;">`;
    html += `Validate your model against engine-specific rules. `;
    html += `Select a target engine and run validation to see issues.`;
    html += `</p>`;
    html += `</div>`;

    // Engine selector dropdown
    html += `<div style="margin-bottom:12px;">`;
    html += `<label style="font-size:13px;font-weight:bold;color:#ccc;display:block;margin-bottom:4px;">`;
    html += `Target Engine:</label>`;
    html += `<select id="myrlin-vp-engine" style="`;
    html += `width:100%;padding:6px 10px;border:1px solid #444;border-radius:4px;`;
    html += `background:#1a1a1a;color:#ccc;font-size:13px;cursor:pointer;">`;

    for (const profile of ENGINE_PROFILES) {
        const selected = profile.id === DEFAULT_ENGINE ? 'selected' : '';
        html += `<option value="${profile.id}" ${selected}>${escapeHtml(profile.label)}</option>`;
    }

    html += `</select>`;

    // Engine description area
    const defaultProfile = ENGINE_PROFILES.find(p => p.id === DEFAULT_ENGINE) || ENGINE_PROFILES[0];
    html += `<div id="myrlin-vp-engine-desc" style="font-size:11px;color:#888;margin-top:4px;padding:0 2px;">`;
    html += escapeHtml(defaultProfile.description);
    html += `</div>`;
    html += `</div>`;

    // Validate button
    html += `<div style="margin-bottom:12px;text-align:center;">`;
    html += `<button id="myrlin-vp-validate-btn" style="`;
    html += `padding:8px 24px;border:1px solid #3498db;border-radius:4px;`;
    html += `background:#1a2a3a;color:#3498db;cursor:pointer;font-size:14px;font-weight:bold;">`;
    html += `Validate</button>`;
    html += `</div>`;

    // Results placeholder
    html += `<div id="myrlin-vp-results"></div>`;

    return html;
}

// =========================================
// Validation Workflow
// =========================================

/**
 * Run engine-specific validation via the API and display results.
 * Falls back to local validation when the API is unreachable.
 *
 * @param engine - The engine profile to validate against
 */
async function runEngineValidation(engine: EngineProfile): Promise<void> {
    const modelData = extractModelData();
    if (!modelData) {
        // @ts-ignore - Blockbench is a global
        Blockbench.showMessageBox({
            title: 'No Model Open',
            message: 'Please open a model before running validation.',
            icon: 'warning',
        });
        return;
    }

    // Show loading state in results area
    const resultsEl = document.getElementById('myrlin-vp-results');
    if (resultsEl) {
        resultsEl.innerHTML = `
            <div style="padding:16px;text-align:center;color:#888;">
                <p style="font-size:13px;">Validating model...</p>
            </div>
        `;
    }

    // @ts-ignore - Blockbench is a global
    Blockbench.showQuickMessage(`Validating for ${engine}...`, 1500);

    // Call API with engine parameter
    const client = getApiClient();
    await client.checkConnection();
    const report = await client.validate(modelData, engine);

    // Convert API issues to our typed format
    const issues: EngineValidationIssue[] = (report.issues || []).map(i => ({
        severity: i.severity,
        code: i.code,
        message: i.message,
        location: i.location,
        auto_fixable: i.auto_fixable,
    }));

    // Render results
    if (resultsEl) {
        resultsEl.innerHTML = buildResultsTableHtml(issues);
        attachResultsEvents(issues);
    }

    // Show summary message
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warnCount = issues.filter(i => i.severity === 'warning').length;

    // @ts-ignore - Blockbench is a global
    Blockbench.showQuickMessage(
        `Validation: ${errorCount} error(s), ${warnCount} warning(s), ${issues.length} total`,
        2000
    );
}

// =========================================
// Fix / Repair Integration
// =========================================

/**
 * Trigger the repair panel for a specific issue code.
 * Opens the auto-repair dialog with the issue pre-selected.
 *
 * @param code - The issue code to repair
 */
async function triggerRepairForCode(code: string): Promise<void> {
    const modelData = extractModelData();
    if (!modelData) {
        // @ts-ignore - Blockbench is a global
        Blockbench.showQuickMessage('No model data available for repair', 1500);
        return;
    }

    // @ts-ignore - Blockbench is a global
    Blockbench.showQuickMessage(`Attempting to fix: ${code}...`, 2000);

    const client = getApiClient();
    await client.checkConnection();

    const result = await client.repair(modelData, [code]);

    if (result.success && result.model_data) {
        // Apply the fix via Codec with undo support
        try {
            // @ts-ignore - Undo is a global from Blockbench
            if (typeof Undo !== 'undefined' && Undo.initEdit) {
                // @ts-ignore - Cube is a global from Blockbench
                Undo.initEdit({ elements: Cube.all, outliner: true });
            }

            // @ts-ignore - Codecs is a global from Blockbench
            if (typeof Codecs !== 'undefined' && Codecs.project && typeof Codecs.project.parse === 'function') {
                // @ts-ignore
                Codecs.project.parse(result.model_data);
            }

            // @ts-ignore - Undo is a global from Blockbench
            if (typeof Undo !== 'undefined' && Undo.finishEdit) {
                // @ts-ignore
                Undo.finishEdit(`Myrlin Fix: ${code}`);
            }

            // @ts-ignore - Canvas is a global from Blockbench
            if (typeof Canvas !== 'undefined' && Canvas.updateAll) {
                // @ts-ignore
                Canvas.updateAll();
            }

            // @ts-ignore - Blockbench is a global
            Blockbench.showQuickMessage(`Fixed: ${code}`, 2000);
        } catch (e) {
            console.error('[Myrlin Validation Panel] Failed to apply fix:', e);
            // @ts-ignore - Blockbench is a global
            Blockbench.showQuickMessage(`Fix apply failed: ${e}`, 2000);
        }
    } else {
        // @ts-ignore - Blockbench is a global
        Blockbench.showQuickMessage(result.message || `Could not fix: ${code}`, 2000);
    }
}

/**
 * Trigger repair for all auto-fixable issues at once.
 *
 * @param issues - Array of all validation issues (only fixable ones will be sent)
 */
async function triggerFixAll(issues: EngineValidationIssue[]): Promise<void> {
    const fixableCodes = issues.filter(i => i.auto_fixable).map(i => i.code);
    if (fixableCodes.length === 0) {
        // @ts-ignore - Blockbench is a global
        Blockbench.showQuickMessage('No auto-fixable issues found', 1500);
        return;
    }

    const modelData = extractModelData();
    if (!modelData) {
        // @ts-ignore - Blockbench is a global
        Blockbench.showQuickMessage('No model data available for repair', 1500);
        return;
    }

    // @ts-ignore - Blockbench is a global
    Blockbench.showQuickMessage(`Fixing ${fixableCodes.length} issue(s)...`, 2000);

    const client = getApiClient();
    await client.checkConnection();

    const result = await client.repair(modelData, fixableCodes);

    if (result.success && result.model_data) {
        try {
            // @ts-ignore - Undo is a global from Blockbench
            if (typeof Undo !== 'undefined' && Undo.initEdit) {
                // @ts-ignore - Cube is a global from Blockbench
                Undo.initEdit({ elements: Cube.all, outliner: true });
            }

            // @ts-ignore - Codecs is a global from Blockbench
            if (typeof Codecs !== 'undefined' && Codecs.project && typeof Codecs.project.parse === 'function') {
                // @ts-ignore
                Codecs.project.parse(result.model_data);
            }

            // @ts-ignore - Undo is a global from Blockbench
            if (typeof Undo !== 'undefined' && Undo.finishEdit) {
                // @ts-ignore
                Undo.finishEdit(`Myrlin Fix All (${result.repairs_applied.length} fixes)`);
            }

            // @ts-ignore - Canvas is a global from Blockbench
            if (typeof Canvas !== 'undefined' && Canvas.updateAll) {
                // @ts-ignore
                Canvas.updateAll();
            }

            // @ts-ignore - Blockbench is a global
            Blockbench.showQuickMessage(
                `Applied ${result.repairs_applied.length} fix(es) successfully`,
                2000
            );
        } catch (e) {
            console.error('[Myrlin Validation Panel] Failed to apply fixes:', e);
            // @ts-ignore - Blockbench is a global
            Blockbench.showQuickMessage(`Fix apply failed: ${e}`, 2000);
        }
    } else {
        // @ts-ignore - Blockbench is a global
        Blockbench.showMessageBox({
            title: 'Fix All Failed',
            // 3.4.3: repair runs locally in every edition, so the fallback no longer blames the API.
            message: result.message || 'Could not apply fixes.',
            icon: 'error',
        });
    }
}

// =========================================
// Event Handlers
// =========================================

/**
 * Attach event listeners to the results table after it is rendered.
 * Handles individual Fix buttons and the Fix All button.
 *
 * @param issues - The validated issues array (for Fix All context)
 */
function attachResultsEvents(issues: EngineValidationIssue[]): void {
    // Individual Fix buttons
    const fixBtns = document.querySelectorAll('.myrlin-vp-fix-btn');
    fixBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const code = (btn as HTMLElement).getAttribute('data-code');
            if (code) {
                triggerRepairForCode(code);
            }
        });
    });

    // Fix All button
    const fixAllBtn = document.getElementById('myrlin-vp-fix-all');
    if (fixAllBtn) {
        fixAllBtn.addEventListener('click', () => {
            triggerFixAll(issues);
        });
    }
}

/**
 * Attach event listeners to the main dialog elements.
 * Handles engine dropdown changes and the Validate button.
 */
function attachDialogEvents(): void {
    // Engine selector: update description on change
    const engineSelect = document.getElementById('myrlin-vp-engine') as HTMLSelectElement | null;
    if (engineSelect) {
        engineSelect.addEventListener('change', () => {
            const selectedId = engineSelect.value as EngineProfile;
            const profile = ENGINE_PROFILES.find(p => p.id === selectedId);
            const descEl = document.getElementById('myrlin-vp-engine-desc');
            if (descEl && profile) {
                descEl.textContent = profile.description;
            }
        });
    }

    // Validate button
    const validateBtn = document.getElementById('myrlin-vp-validate-btn');
    if (validateBtn) {
        validateBtn.addEventListener('click', () => {
            const engine = (document.getElementById('myrlin-vp-engine') as HTMLSelectElement | null)?.value as EngineProfile || DEFAULT_ENGINE;
            runEngineValidation(engine);
        });
    }
}

// =========================================
// Panel Styles
// =========================================

/** CSS styles for the validation panel components */
const VALIDATION_PANEL_STYLES = `
    #myrlin-vp-issues table tr:hover {
        background: #333 !important;
    }
    .myrlin-vp-fix-btn:hover {
        background: #27ae60 !important;
        color: #fff !important;
    }
    #myrlin-vp-fix-all:hover {
        background: #27ae60 !important;
        color: #fff !important;
    }
    #myrlin-vp-engine:focus {
        border-color: #3498db !important;
        outline: none;
    }
    #myrlin-vp-validate-btn:hover {
        background: #3498db !important;
        color: #fff !important;
    }
`;

// =========================================
// Setup Entry Point
// =========================================

/**
 * Register the "Validate for Engine" action in Blockbench.
 *
 * Creates:
 *   - An Action (myrlin_validation_panel) in the tools category
 *   - A Dialog with engine selector, validate button, and results area
 *   - A menu entry under Tools via MenuBar.addAction
 *   - Custom CSS styles for the validation panel
 *
 * Call this function from the plugin's onload() to activate the validation panel.
 */
export function setupValidationPanel(): void {
    // Inject panel styles
    trackStyle(VALIDATION_PANEL_STYLES);

    // @ts-ignore - Action is a global from Blockbench
    const validationAction = new Action('myrlin_validation_panel', {
        name: 'Validate for Engine',
        // 3.4.3: was "... with repair integration"; nothing repairs these issues yet (api-client repair()).
        description: 'Validate model against engine-specific rules (Myrlin\'s Tools)',
        icon: 'rule',
        category: 'tools',
        click: () => {
            const dialogHtml = buildDialogHtml();

            // @ts-ignore - Dialog is a global from Blockbench
            const dialog = new Dialog({
                id: 'myrlin_validation_panel_ui',
                title: 'Validate for Engine',
                width: DIALOG_WIDTH,
                lines: [dialogHtml],
                buttons: ['Close'],
                onConfirm: () => {
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
    track(validationAction);

    // Add to the Tools menu
    // @ts-ignore - MenuBar is a global from Blockbench
    MenuBar.addAction(validationAction, 'tools');
}
