/**
 * Auto-Repair Panel - Diagnose and fix model issues via Myrlin API
 *
 * Provides a workflow that validates the current model against Hytale
 * requirements, presents found issues in a selectable list, and sends
 * selected issues to the API for automated repair. The repaired model
 * is applied back to Blockbench with an undo snapshot.
 */

import { track, trackStyle } from '../utils/cleanup';
import { getApiClient, ValidationIssue, Severity } from '../api-client';

// =========================================
// Constants
// =========================================

/** Dialog width in pixels */
const DIALOG_WIDTH = 640;

/** Maximum issues to display before truncating */
const MAX_DISPLAY_ISSUES = 50;

// =========================================
// Severity Helpers
// =========================================

/**
 * Return an HTML-safe icon span for a given issue severity.
 *
 * @param severity - The issue severity level
 * @returns HTML string with colored icon
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
 * Return a short label for the auto-fixable badge.
 *
 * @param fixable - Whether the issue can be auto-fixed
 * @returns HTML badge string
 */
function fixableBadge(fixable: boolean): string {
    if (fixable) {
        return '<span style="background:#27ae60;color:#fff;padding:1px 6px;border-radius:3px;font-size:11px;">auto-fix</span>';
    }
    return '<span style="background:#7f8c8d;color:#fff;padding:1px 6px;border-radius:3px;font-size:11px;">manual</span>';
}

// =========================================
// Model Data Extraction
// =========================================

/**
 * Extract the current Blockbench model as a plain JSON object
 * suitable for sending to the Myrlin API.
 *
 * Uses Blockbench's Codecs.project.compile() when available,
 * otherwise falls back to Project.export() or manual construction.
 *
 * @returns Model data object, or null if no model is open
 */
function extractModelData(): Record<string, unknown> | null {
    try {
        // @ts-ignore - Project is a global from Blockbench
        if (typeof Project === 'undefined' || !Project) {
            return null;
        }

        // Try 1: Use the current format's codec (works for Hytale, bbmodel, etc.)
        // @ts-ignore - Format is a global from Blockbench
        if (typeof Format !== 'undefined' && Format.codec && typeof Format.codec.compile === 'function') {
            try {
                // @ts-ignore
                const compiled = Format.codec.compile();
                if (compiled && typeof compiled === 'object') {
                    console.log('[Myrlin Repair] Extracted via Format.codec.compile()', Object.keys(compiled));
                    return compiled;
                }
            } catch (e2) {
                console.warn('[Myrlin Repair] Format.codec.compile() failed:', e2);
            }
        }

        // Try 2: Use Codecs.project (generic bbmodel codec)
        // @ts-ignore - Codecs is a global from Blockbench
        if (typeof Codecs !== 'undefined' && Codecs.project && typeof Codecs.project.compile === 'function') {
            try {
                // @ts-ignore
                const compiled = Codecs.project.compile();
                if (compiled && typeof compiled === 'object') {
                    console.log('[Myrlin Repair] Extracted via Codecs.project.compile()', Object.keys(compiled));
                    return compiled;
                }
            } catch (e2) {
                console.warn('[Myrlin Repair] Codecs.project.compile() failed:', e2);
            }
        }

        // Try 3: Build from Blockbench's internal state (Cube.all + outliner)
        // @ts-ignore - Cube is a global from Blockbench
        const cubes = typeof Cube !== 'undefined' ? Cube.all : [];
        // @ts-ignore - Group is a global from Blockbench
        const groups = typeof Group !== 'undefined' ? Group.all : [];
        // @ts-ignore - Outliner is a global from Blockbench
        const outlinerRoot = typeof Outliner !== 'undefined' ? Outliner.root : [];

        if (cubes.length === 0 && groups.length === 0) {
            return null;
        }

        console.log('[Myrlin Repair] Building from Blockbench state:', cubes.length, 'cubes,', groups.length, 'groups');

        // Build bbmodel-style elements array from Cube.all
        const elements: Record<string, unknown>[] = [];
        for (const cube of cubes) {
            elements.push({
                name: cube.name || 'cube',
                uuid: cube.uuid || '',
                from: cube.from ? [...cube.from] : [0, 0, 0],
                to: cube.to ? [...cube.to] : [1, 1, 1],
                origin: cube.origin ? [...cube.origin] : [0, 0, 0],
                rotation: cube.rotation ? [...cube.rotation] : [0, 0, 0],
                color: cube.color || 0,
            });
        }

        // Build outliner from Outliner.root
        function buildOutliner(entries: any[]): any[] {
            const result: any[] = [];
            for (const entry of entries) {
                if (typeof entry === 'string') {
                    result.push(entry);
                } else if (entry && entry.uuid) {
                    if (entry.children && entry.children.length > 0) {
                        result.push({
                            name: entry.name || 'group',
                            uuid: entry.uuid,
                            origin: entry.origin ? [...entry.origin] : [0, 0, 0],
                            children: buildOutliner(entry.children),
                        });
                    } else {
                        result.push(entry.uuid);
                    }
                }
            }
            return result;
        }

        const outliner = outlinerRoot.length > 0 ? buildOutliner(outlinerRoot) : elements.map((e: any) => e.uuid);

        return {
            // @ts-ignore
            name: Project.name || 'untitled',
            elements,
            outliner,
            meta: {
                format_version: '4.5',
                model_format: 'free',
            },
        };
    } catch (e) {
        console.warn('[Myrlin Repair] Failed to extract model data:', e);
        return null;
    }
}

// =========================================
// Issue List Dialog
// =========================================

/**
 * Build the HTML content for the issue list inside the repair dialog.
 * Each issue gets a row with severity icon, code, message, fixable badge,
 * and a checkbox. Errors and warnings are checked by default; info items
 * are unchecked.
 *
 * @param issues - Array of validation issues from the API
 * @returns HTML string for the dialog body
 */
function buildIssueListHtml(issues: ValidationIssue[]): string {
    if (issues.length === 0) {
        return `
            <div style="padding:20px;text-align:center;color:#27ae60;">
                <p style="font-size:16px;font-weight:bold;">No issues found</p>
                <p style="color:#888;">Your model passes all validation checks.</p>
            </div>
        `;
    }

    // Sort by severity: errors first, then warnings, then info
    const sorted = [...issues].sort((a, b) => severityPriority(a.severity) - severityPriority(b.severity));

    // Truncate if needed
    const displayed = sorted.slice(0, MAX_DISPLAY_ISSUES);
    const truncated = sorted.length - displayed.length;

    let html = '<div id="myrlin-repair-list" style="max-height:360px;overflow-y:auto;border:1px solid #444;border-radius:4px;user-select:text;-webkit-user-select:text;">';
    html += '<table style="width:100%;border-collapse:collapse;font-size:13px;">';
    html += '<thead><tr style="background:#2a2a2a;position:sticky;top:0;">';
    html += '<th style="padding:6px 8px;text-align:left;width:28px;"></th>';
    html += '<th style="padding:6px 8px;text-align:left;width:100px;">Code</th>';
    html += '<th style="padding:6px 8px;text-align:left;">Message</th>';
    html += '<th style="padding:6px 8px;text-align:center;width:60px;">Type</th>';
    html += '<th style="padding:6px 8px;text-align:center;width:40px;">Fix</th>';
    html += '</tr></thead><tbody>';

    for (let i = 0; i < displayed.length; i++) {
        const issue = displayed[i];
        const isChecked = issue.severity !== 'info';
        const rowBg = i % 2 === 0 ? '#1e1e1e' : '#252525';
        const disabledAttr = issue.auto_fixable ? '' : 'disabled';
        const checkedAttr = (isChecked && issue.auto_fixable) ? 'checked' : '';

        html += `<tr style="background:${rowBg};border-bottom:1px solid #333;">`;
        html += `<td style="padding:6px 8px;text-align:center;">${severityIconHtml(issue.severity)}</td>`;
        html += `<td style="padding:6px 8px;font-family:monospace;font-size:11px;">${escapeHtml(issue.code)}</td>`;
        html += `<td style="padding:6px 8px;">${escapeHtml(issue.message)}`;
        if (issue.location) {
            html += ` <span style="color:#888;font-size:11px;">(${escapeHtml(issue.location)})</span>`;
        }
        html += '</td>';
        html += `<td style="padding:6px 8px;text-align:center;">${fixableBadge(issue.auto_fixable)}</td>`;
        html += `<td style="padding:6px 8px;text-align:center;">`;
        html += `<input type="checkbox" class="myrlin-repair-check" data-index="${i}" ${checkedAttr} ${disabledAttr} />`;
        html += '</td>';
        html += '</tr>';
    }

    html += '</tbody></table></div>';

    if (truncated > 0) {
        html += `<p style="color:#888;font-size:12px;margin-top:4px;">...and ${truncated} more issue(s) not shown.</p>`;
    }

    // Summary footer
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warnCount = issues.filter(i => i.severity === 'warning').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;
    const fixableCount = issues.filter(i => i.auto_fixable).length;

    html += '<div style="margin-top:8px;padding:8px 0;border-top:1px solid #444;font-size:12px;color:#aaa;">';
    html += `Found: <span style="color:#e74c3c;">${errorCount} error(s)</span>, `;
    html += `<span style="color:#f39c12;">${warnCount} warning(s)</span>, `;
    html += `<span style="color:#3498db;">${infoCount} info</span>`;
    html += ` | <span style="color:#27ae60;">${fixableCount} auto-fixable</span>`;
    html += '</div>';

    return html;
}

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
// Repair Workflow
// =========================================

/**
 * Collect the codes of all checked (selected) issues from the dialog DOM.
 * Reads checkbox state from the rendered issue list.
 *
 * @param issues - The sorted/displayed issue array (same order as DOM rows)
 * @returns Array of issue codes selected for repair
 */
function getSelectedRepairCodes(issues: ValidationIssue[]): string[] {
    const sorted = [...issues].sort((a, b) => severityPriority(a.severity) - severityPriority(b.severity));
    const displayed = sorted.slice(0, MAX_DISPLAY_ISSUES);
    const codes: string[] = [];

    const checkboxes = document.querySelectorAll('.myrlin-repair-check');
    checkboxes.forEach((cb) => {
        const input = cb as HTMLInputElement;
        if (input.checked && !input.disabled) {
            const idx = parseInt(input.getAttribute('data-index') || '-1', 10);
            if (idx >= 0 && idx < displayed.length) {
                codes.push(displayed[idx].code);
            }
        }
    });

    return codes;
}

/**
 * Apply a repaired model back into Blockbench.
 * Creates an undo snapshot so the user can revert the repair.
 *
 * @param modelData - The repaired model data from the API
 * @param repairsApplied - List of repair codes that were applied
 */
function applyRepairedModel(modelData: Record<string, unknown>, repairsApplied: string[]): void {
    try {
        // @ts-ignore - Undo is a global from Blockbench
        if (typeof Undo !== 'undefined' && Undo.initEdit) {
            // @ts-ignore
            Undo.initEdit({ elements: Cube.all, outliner: true });
        }

        // Apply the repaired model via Codec
        // @ts-ignore - Codecs is a global from Blockbench
        if (typeof Codecs !== 'undefined' && Codecs.project && typeof Codecs.project.parse === 'function') {
            // @ts-ignore
            Codecs.project.parse(modelData);
        }

        // Finalize undo entry
        // @ts-ignore
        if (typeof Undo !== 'undefined' && Undo.finishEdit) {
            // @ts-ignore
            Undo.finishEdit(`Myrlin Auto-Repair (${repairsApplied.length} fix${repairsApplied.length !== 1 ? 'es' : ''})`);
        }

        // @ts-ignore - Canvas is a global from Blockbench
        if (typeof Canvas !== 'undefined' && Canvas.updateAll) {
            // @ts-ignore
            Canvas.updateAll();
        }
    } catch (e) {
        console.error('[Myrlin Repair] Failed to apply repaired model:', e);
        // @ts-ignore - Blockbench is a global
        Blockbench.showMessageBox({
            title: 'Repair Apply Failed',
            message: `Could not apply the repaired model. Error: ${e}`,
            icon: 'error',
        });
    }
}

/**
 * Show a confirmation dialog summarizing what repairs were applied,
 * then apply the repaired model on user confirmation.
 *
 * @param modelData - The repaired model data from the API
 * @param repairsApplied - List of repair codes that were applied
 * @param message - Summary message from the API
 */
function showRepairConfirmation(
    modelData: Record<string, unknown>,
    repairsApplied: string[],
    message: string
): void {
    let listHtml = '<ul style="margin:8px 0;padding-left:20px;font-size:13px;">';
    for (const code of repairsApplied) {
        listHtml += `<li style="margin:2px 0;font-family:monospace;">${escapeHtml(code)}</li>`;
    }
    listHtml += '</ul>';

    const bodyHtml = `
        <div style="padding:8px 0;">
            <p style="font-size:14px;color:#27ae60;font-weight:bold;">
                Repair completed successfully
            </p>
            <p style="font-size:13px;color:#ccc;">${escapeHtml(message)}</p>
            <p style="font-size:13px;margin-top:8px;">
                <strong>${repairsApplied.length}</strong> repair(s) applied:
            </p>
            ${listHtml}
            <p style="font-size:12px;color:#888;margin-top:8px;">
                An undo snapshot will be created so you can revert these changes.
            </p>
        </div>
    `;

    // @ts-ignore - Dialog is a global from Blockbench
    new Dialog({
        id: 'myrlin_repair_confirm',
        title: 'Apply Repairs?',
        lines: [bodyHtml],
        width: 460,
        buttons: ['Apply', 'Cancel'],
        onConfirm: () => {
            applyRepairedModel(modelData, repairsApplied);
            // @ts-ignore - Blockbench is a global
            Blockbench.showQuickMessage(
                `Applied ${repairsApplied.length} repair(s) successfully`,
                2000
            );
        },
        onCancel: () => {
            // @ts-ignore - Blockbench is a global
            Blockbench.showQuickMessage('Repair cancelled', 1500);
        },
    }).show();
}

// =========================================
// Main Dialog
// =========================================

/**
 * Show the main repair dialog.
 * Validates the current model, presents issues, and lets the user
 * select which ones to send for auto-repair.
 */
async function showRepairDialog(): Promise<void> {
    // Check that a model is open
    const modelData = extractModelData();
    if (!modelData) {
        // @ts-ignore - Blockbench is a global
        Blockbench.showMessageBox({
            title: 'No Model Open',
            message: 'Please open a model before running auto-repair.',
            icon: 'warning',
        });
        return;
    }

    // Show a loading indicator
    // @ts-ignore - Blockbench is a global
    Blockbench.showQuickMessage('Validating model...', 1500);

    // Check API connection first
    const client = getApiClient();
    await client.checkConnection();

    // Validate
    const report = await client.validate(modelData);
    const issues = report.issues || [];

    // Build the dialog HTML
    const issueHtml = buildIssueListHtml(issues);
    const hasFixable = issues.some(i => i.auto_fixable);

    // Build plain text summary for copy
    const plainTextSummary = issues.map(i => {
        const sev = i.severity.toUpperCase();
        const loc = i.location ? ` (${i.location})` : '';
        const fix = i.auto_fixable ? ' [auto-fixable]' : '';
        return `[${sev}] ${i.code}: ${i.message}${loc}${fix}`;
    }).join('\n');

    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warnCount = issues.filter(i => i.severity === 'warning').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;
    const summaryLine = `${errorCount} errors, ${warnCount} warnings, ${infoCount} info`;

    const headerHtml = `
        <div style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
            <p style="font-size:13px;color:#aaa;margin:0;">
                ${summaryLine}. Select issues to auto-repair.
            </p>
            <button id="myrlin-copy-results" style="padding:4px 10px;font-size:11px;background:#444;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;" title="Copy all issues as text">
                Copy Results
            </button>
        </div>
    `;

    // @ts-ignore - Dialog is a global from Blockbench
    const dialog = new Dialog({
        id: 'myrlin_repair_dialog',
        title: 'Auto-Repair Model',
        width: DIALOG_WIDTH,
        lines: [headerHtml + issueHtml],
        buttons: hasFixable ? ['Apply Selected', 'Cancel'] : ['Close'],
        onConfirm: async () => {
            if (!hasFixable) return;

            // Collect selected codes
            const selectedCodes = getSelectedRepairCodes(issues);

            if (selectedCodes.length === 0) {
                // @ts-ignore - Blockbench is a global
                Blockbench.showQuickMessage('No issues selected for repair', 1500);
                return;
            }

            // @ts-ignore - Blockbench is a global
            Blockbench.showQuickMessage(`Repairing ${selectedCodes.length} issue(s)...`, 2000);

            // Send repair request
            const currentModel = extractModelData();
            if (!currentModel) {
                // @ts-ignore - Blockbench is a global
                Blockbench.showQuickMessage('Model no longer available', 1500);
                return;
            }

            const repairResult = await client.repair(currentModel, selectedCodes);

            if (repairResult.success && repairResult.model_data) {
                showRepairConfirmation(
                    repairResult.model_data,
                    repairResult.repairs_applied,
                    repairResult.message
                );
            } else {
                // @ts-ignore - Blockbench is a global
                Blockbench.showMessageBox({
                    title: 'Repair Failed',
                    message: repairResult.message || 'The repair request could not be completed.',
                    icon: 'error',
                });
            }
        },
        onCancel: () => {
            // Close quietly
        },
    });

    dialog.show();

    // Wire copy button after dialog is shown
    setTimeout(() => {
        const copyBtn = document.getElementById('myrlin-copy-results');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const fullText = `Myrlin's Tools - Validation Report\n${summaryLine}\n\n${plainTextSummary}`;
                navigator.clipboard.writeText(fullText).then(() => {
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => { copyBtn.textContent = 'Copy Results'; }, 1500);
                }).catch(() => {
                    // Fallback
                    const ta = document.createElement('textarea');
                    ta.value = fullText;
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => { copyBtn.textContent = 'Copy Results'; }, 1500);
                });
            });
        }
    }, 100);
}

// =========================================
// Panel Styles
// =========================================

/** CSS styles for the repair dialog components */
const REPAIR_STYLES = `
    #myrlin-repair-list table tr:hover {
        background: #333 !important;
    }
    #myrlin-repair-list input[type="checkbox"] {
        cursor: pointer;
        width: 16px;
        height: 16px;
    }
    #myrlin-repair-list input[type="checkbox"]:disabled {
        cursor: not-allowed;
        opacity: 0.4;
    }
`;

// =========================================
// Setup Entry Point
// =========================================

/**
 * Register the Auto-Repair action in Blockbench.
 *
 * Creates:
 *   - An Action (myrlin_auto_repair) in the tools category
 *   - A menu entry under Tools via MenuBar.addAction
 *   - Custom CSS styles for the repair dialog
 *
 * Call this function from the plugin's onload() to activate auto-repair.
 */
export function setupRepairPanel(): void {
    // Inject repair dialog styles
    trackStyle(REPAIR_STYLES);

    // @ts-ignore - Action is a global from Blockbench
    const repairAction = new Action('myrlin_auto_repair', {
        name: 'Auto-Repair Model',
        description: 'Validate and auto-repair model issues for Hytale compatibility (Myrlin\'s Tools)',
        icon: 'build',
        category: 'tools',
        click: () => {
            showRepairDialog();
        },
    });

    // Track the action for cleanup on plugin unload
    // @ts-ignore
    track(repairAction);

    // Add to the Tools menu
    // @ts-ignore - MenuBar is a global from Blockbench
    MenuBar.addAction(repairAction, 'tools');
}
