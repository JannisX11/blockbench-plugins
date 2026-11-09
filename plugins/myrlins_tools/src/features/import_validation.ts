/**
 * Import Validation Panel
 *
 * Validates the current model against an asset spec entry.
 * Shows missing bones, naming issues, rigging problems.
 * Offers auto-fix for naming mismatches.
 *
 * Supports both API-based validation (via /api/tools/validate with spec)
 * and local offline validation against a pasted spec JSON.
 */

import { track, trackStyle } from '../utils/cleanup';
import { parseCompiled } from '../utils/project_json';
import { getApiClient } from '../api-client';
import { countHytaleNodes } from '../utils/hytale_nodes';

// =========================================
// Constants
// =========================================

/** Dialog width in pixels */
const DIALOG_WIDTH = 620;

/** Maximum spec issues to display */
const MAX_DISPLAY_ISSUES = 80;

// =========================================
// Types
// =========================================

/** An asset spec entry from the manifest */
interface AssetSpec {
    /** Display name of the asset */
    name?: string;
    /** Asset type (character, prop, weapon, etc.) */
    type?: string;
    /** Required bones/nodes that must exist */
    required_bones?: string[];
    /** Optional bones that are recommended */
    optional_bones?: string[];
    /** Required attachment point names */
    attachment_points?: string[];
    /** Maximum node count for this asset type */
    max_nodes?: number;
    /** Naming convention pattern (e.g. "snake_case", "PascalCase") */
    naming_convention?: string;
    /** Additional validation rules */
    rules?: Record<string, unknown>;
}

/** A single spec validation result */
interface SpecIssue {
    /** Severity: error, warning, or info */
    severity: 'error' | 'warning' | 'info';
    /** Short machine-readable code */
    code: string;
    /** Human-readable description */
    message: string;
    /** Where in the model (node name or path) */
    location?: string;
    /** Whether auto-fix is available */
    fixable: boolean;
    /** Suggested fix value (e.g. corrected name) */
    suggestion?: string;
}

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
 * Return an HTML icon span for a given severity.
 *
 * @param severity - The issue severity level
 * @returns HTML string with colored icon
 */
function severityIcon(severity: string): string {
    switch (severity) {
        case 'error':
            return '<span style="color:#e74c3c;font-weight:bold;" title="Missing">&#x2716;</span>';
        case 'warning':
            return '<span style="color:#f39c12;font-weight:bold;" title="Naming">&#x26A0;</span>';
        case 'info':
            return '<span style="color:#3498db;font-weight:bold;" title="Info">&#x2139;</span>';
        default:
            return '<span>&#x2022;</span>';
    }
}

// =========================================
// Model Data Extraction
// =========================================

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
        for (const group of groups) {
            nodes.push({
                name: group.name || 'group',
                type: 'group',
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
        console.warn('[Myrlin ImportValidation] Failed to extract model data:', e);
        return null;
    }
}

/**
 * Collect all node names from the current Blockbench model.
 *
 * @returns Array of node names (cubes and groups)
 */
function collectModelNodeNames(): string[] {
    const names: string[] = [];
    try {
        // @ts-ignore - Cube is a global from Blockbench
        if (typeof Cube !== 'undefined' && Cube.all) {
            // @ts-ignore
            for (const cube of Cube.all) {
                if (cube.name) names.push(cube.name);
            }
        }
        // @ts-ignore - Group is a global from Blockbench
        if (typeof Group !== 'undefined' && Group.all) {
            // @ts-ignore
            for (const group of Group.all) {
                if (group.name) names.push(group.name);
            }
        }
    } catch (e) {
        console.warn('[Myrlin ImportValidation] Failed to collect node names:', e);
    }
    return names;
}

// =========================================
// Local Spec Validation
// =========================================

/**
 * Validate the current model against an asset spec locally (no API required).
 * Checks required bones, attachment points, naming convention, and node limits.
 *
 * @param spec - The asset spec to validate against
 * @returns Array of spec issues found
 */
function validateAgainstSpecLocally(spec: AssetSpec): SpecIssue[] {
    const issues: SpecIssue[] = [];
    const modelNames = collectModelNodeNames();
    const modelNamesLower = modelNames.map(n => n.toLowerCase());

    // Check required bones
    if (spec.required_bones && spec.required_bones.length > 0) {
        for (const bone of spec.required_bones) {
            const boneLower = bone.toLowerCase();
            const exactMatch = modelNames.includes(bone);
            const caseInsensitiveMatch = modelNamesLower.includes(boneLower);

            if (!exactMatch && !caseInsensitiveMatch) {
                // Completely missing
                issues.push({
                    severity: 'error',
                    code: 'MISSING_BONE',
                    message: `Required bone "${bone}" is missing from the model`,
                    fixable: false,
                });
            } else if (!exactMatch && caseInsensitiveMatch) {
                // Name exists but wrong case
                const actualIdx = modelNamesLower.indexOf(boneLower);
                const actualName = modelNames[actualIdx];
                issues.push({
                    severity: 'warning',
                    code: 'NAME_CASE_MISMATCH',
                    message: `Bone "${actualName}" should be "${bone}" (case mismatch)`,
                    location: actualName,
                    fixable: true,
                    suggestion: bone,
                });
            }
        }
    }

    // Check attachment points
    if (spec.attachment_points && spec.attachment_points.length > 0) {
        for (const attachment of spec.attachment_points) {
            const attachLower = attachment.toLowerCase();
            const found = modelNamesLower.some(n => n === attachLower || n.includes(attachLower));

            if (!found) {
                issues.push({
                    severity: 'warning',
                    code: 'MISSING_ATTACHMENT',
                    message: `Attachment point "${attachment}" not found in model`,
                    fixable: false,
                });
            }
        }
    }

    // Check node count limit
    if (spec.max_nodes) {
        // Hytale nodes (the shared count), not the number of named cubes and groups
        let totalNodes = modelNames.length;
        try {
            totalNodes = countHytaleNodes();
        } catch {
            // outside Blockbench: keep the name count
        }
        if (totalNodes > spec.max_nodes) {
            issues.push({
                severity: 'error',
                code: 'NODE_LIMIT',
                message: `Model has ${totalNodes} nodes, exceeds spec limit of ${spec.max_nodes}`,
                fixable: false,
            });
        }
    }

    // Check naming convention if specified
    if (spec.naming_convention) {
        const convention = spec.naming_convention.toLowerCase();
        for (const name of modelNames) {
            let valid = true;
            if (convention === 'snake_case') {
                valid = /^[a-z][a-z0-9_]*$/.test(name);
            } else if (convention === 'pascalcase' || convention === 'pascal_case') {
                valid = /^[A-Z][a-zA-Z0-9]*$/.test(name);
            } else if (convention === 'camelcase' || convention === 'camel_case') {
                valid = /^[a-z][a-zA-Z0-9]*$/.test(name);
            }

            if (!valid) {
                issues.push({
                    severity: 'info',
                    code: 'NAMING_CONVENTION',
                    message: `Node "${name}" does not match ${spec.naming_convention} convention`,
                    location: name,
                    fixable: false,
                });
            }
        }
    }

    // Optional bones (informational only)
    if (spec.optional_bones && spec.optional_bones.length > 0) {
        for (const bone of spec.optional_bones) {
            const boneLower = bone.toLowerCase();
            if (!modelNamesLower.includes(boneLower)) {
                issues.push({
                    severity: 'info',
                    code: 'OPTIONAL_BONE_MISSING',
                    message: `Optional bone "${bone}" is not present`,
                    fixable: false,
                });
            }
        }
    }

    return issues;
}

// =========================================
// Auto-Fix Functions
// =========================================

/**
 * Apply naming fixes to the current model. Renames nodes that have
 * case mismatches with the spec.
 *
 * @param issues - The list of spec issues (only NAME_CASE_MISMATCH are applied)
 * @returns Number of fixes applied
 */
function applyNameFixes(issues: SpecIssue[]): number {
    const nameFixes = issues.filter(i => i.code === 'NAME_CASE_MISMATCH' && i.suggestion && i.location);
    if (nameFixes.length === 0) return 0;

    let fixCount = 0;

    try {
        // Create undo snapshot
        // @ts-ignore - Undo is a global from Blockbench
        if (typeof Undo !== 'undefined' && Undo.initEdit) {
            // @ts-ignore
            Undo.initEdit({ elements: [], outliner: true });
        }

        for (const fix of nameFixes) {
            // Search cubes
            // @ts-ignore - Cube is a global from Blockbench
            if (typeof Cube !== 'undefined' && Cube.all) {
                // @ts-ignore
                for (const cube of Cube.all) {
                    if (cube.name === fix.location) {
                        cube.name = fix.suggestion!;
                        fixCount++;
                    }
                }
            }

            // Search groups
            // @ts-ignore - Group is a global from Blockbench
            if (typeof Group !== 'undefined' && Group.all) {
                // @ts-ignore
                for (const group of Group.all) {
                    if (group.name === fix.location) {
                        group.name = fix.suggestion!;
                        fixCount++;
                    }
                }
            }
        }

        // Finalize undo
        // @ts-ignore
        if (typeof Undo !== 'undefined' && Undo.finishEdit) {
            // @ts-ignore
            Undo.finishEdit(`Myrlin Spec: rename ${fixCount} node(s)`);
        }

        // Refresh canvas
        // @ts-ignore - Canvas is a global from Blockbench
        if (typeof Canvas !== 'undefined' && Canvas.updateAll) {
            // @ts-ignore
            Canvas.updateAll();
        }
    } catch (e) {
        console.error('[Myrlin ImportValidation] Failed to apply name fixes:', e);
    }

    return fixCount;
}

/**
 * Add missing attachment folder nodes to the model. Creates empty
 * groups for each missing attachment point from the spec.
 *
 * @param issues - The list of spec issues (only MISSING_ATTACHMENT are processed)
 * @returns Number of attachment nodes added
 */
function addMissingAttachments(issues: SpecIssue[]): number {
    const missing = issues.filter(i => i.code === 'MISSING_ATTACHMENT');
    if (missing.length === 0) return 0;

    let addedCount = 0;

    try {
        // Create undo snapshot
        // @ts-ignore - Undo is a global from Blockbench
        if (typeof Undo !== 'undefined' && Undo.initEdit) {
            // @ts-ignore
            Undo.initEdit({ elements: [], outliner: true });
        }

        for (const issue of missing) {
            // Extract attachment name from the message
            const match = issue.message.match(/point "([^"]+)"/);
            const attachName = match ? match[1] : null;
            if (!attachName) continue;

            // @ts-ignore - Group is a global from Blockbench
            if (typeof Group !== 'undefined') {
                // @ts-ignore
                const newGroup = new Group({
                    name: attachName,
                    origin: [0, 0, 0],
                });
                // @ts-ignore
                newGroup.init();
                addedCount++;
            }
        }

        // Finalize undo
        // @ts-ignore
        if (typeof Undo !== 'undefined' && Undo.finishEdit) {
            // @ts-ignore
            Undo.finishEdit(`Myrlin Spec: add ${addedCount} attachment node(s)`);
        }
    } catch (e) {
        console.error('[Myrlin ImportValidation] Failed to add attachment nodes:', e);
    }

    return addedCount;
}

// =========================================
// Issue List Builder
// =========================================

/**
 * Build the HTML content for the spec validation results.
 *
 * @param issues - Array of spec issues
 * @returns HTML string for the results section
 */
function buildIssueListHtml(issues: SpecIssue[]): string {
    if (issues.length === 0) {
        return `
            <div style="padding:20px;text-align:center;color:#27ae60;">
                <p style="font-size:16px;font-weight:bold;">Model matches spec</p>
                <p style="color:#888;">All required bones and attachment points are present.</p>
            </div>
        `;
    }

    // Sort: errors first, then warnings, then info
    const priorityMap: Record<string, number> = { error: 0, warning: 1, info: 2 };
    const sorted = [...issues].sort((a, b) =>
        (priorityMap[a.severity] ?? 3) - (priorityMap[b.severity] ?? 3)
    );
    const displayed = sorted.slice(0, MAX_DISPLAY_ISSUES);

    let html = '<div id="myrlin-spec-results" style="max-height:300px;overflow-y:auto;border:1px solid #444;border-radius:4px;margin-top:8px;">';
    html += '<table style="width:100%;border-collapse:collapse;font-size:13px;">';
    html += '<thead><tr style="background:#2a2a2a;position:sticky;top:0;">';
    html += '<th style="padding:6px 8px;text-align:left;width:28px;"></th>';
    html += '<th style="padding:6px 8px;text-align:left;width:140px;">Code</th>';
    html += '<th style="padding:6px 8px;text-align:left;">Message</th>';
    html += '<th style="padding:6px 8px;text-align:center;width:50px;">Fix?</th>';
    html += '</tr></thead><tbody>';

    for (let i = 0; i < displayed.length; i++) {
        const issue = displayed[i];
        const rowBg = i % 2 === 0 ? '#1e1e1e' : '#252525';
        const fixBadge = issue.fixable
            ? '<span style="background:#27ae60;color:#fff;padding:1px 6px;border-radius:3px;font-size:11px;">yes</span>'
            : '<span style="color:#555;">-</span>';

        html += `<tr style="background:${rowBg};border-bottom:1px solid #333;">`;
        html += `<td style="padding:6px 8px;text-align:center;">${severityIcon(issue.severity)}</td>`;
        html += `<td style="padding:6px 8px;font-family:monospace;font-size:11px;">${escapeHtml(issue.code)}</td>`;
        html += `<td style="padding:6px 8px;">${escapeHtml(issue.message)}</td>`;
        html += `<td style="padding:6px 8px;text-align:center;">${fixBadge}</td>`;
        html += '</tr>';
    }

    html += '</tbody></table></div>';

    // Summary
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warnCount = issues.filter(i => i.severity === 'warning').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;
    const fixableCount = issues.filter(i => i.fixable).length;

    html += '<div style="margin-top:8px;font-size:12px;color:#aaa;">';
    html += `<span style="color:#e74c3c;">${errorCount} error(s)</span>, `;
    html += `<span style="color:#f39c12;">${warnCount} warning(s)</span>, `;
    html += `<span style="color:#3498db;">${infoCount} info</span>`;
    if (fixableCount > 0) {
        html += ` | <span style="color:#27ae60;">${fixableCount} auto-fixable</span>`;
    }
    html += '</div>';

    return html;
}

// =========================================
// Main Dialog
// =========================================

/** Cached issues from the last validation run, used by action buttons */
let lastValidationIssues: SpecIssue[] = [];

/**
 * Show the import validation dialog.
 * Lets the user paste a spec JSON and validates the current model against it.
 */
async function showImportValidationDialog(): Promise<void> {
    // Check that a model is open
    const modelData = extractModelData();
    if (!modelData) {
        // @ts-ignore - Blockbench is a global
        Blockbench.showMessageBox({
            title: 'No Model Open',
            message: 'Please open a model before running spec validation.',
            icon: 'warning',
        });
        return;
    }

    // Build dialog HTML
    let dialogHtml = '';

    // Header
    dialogHtml += `<div style="margin-bottom:12px;">`;
    dialogHtml += `<p style="font-size:13px;color:#aaa;">`;
    dialogHtml += `Paste an asset spec JSON below to validate the current model against it. `;
    dialogHtml += `The spec defines required bones, attachment points, and naming rules.`;
    dialogHtml += `</p>`;
    dialogHtml += `</div>`;

    // Spec JSON textarea
    dialogHtml += `<div style="margin-bottom:4px;font-size:13px;font-weight:bold;color:#ccc;">Asset Spec JSON:</div>`;
    dialogHtml += `<textarea id="myrlin-spec-input" style="`;
    dialogHtml += `width:100%;height:140px;background:#1a1a1a;color:#ccc;border:1px solid #444;`;
    dialogHtml += `border-radius:4px;padding:8px;font-family:monospace;font-size:12px;resize:vertical;`;
    dialogHtml += `" placeholder='${escapeHtml('{\n  "name": "Goblin",\n  "type": "character",\n  "required_bones": ["Head", "Body", "LeftArm", "RightArm"],\n  "attachment_points": ["Weapon_Slot", "Shield_Slot"],\n  "max_nodes": 255\n}')}'></textarea>`;

    // Validate button
    dialogHtml += `<div style="margin-top:8px;margin-bottom:8px;">`;
    dialogHtml += `<button id="myrlin-spec-validate-btn" style="`;
    dialogHtml += `padding:6px 16px;border:1px solid #555;border-radius:3px;`;
    dialogHtml += `background:#2c5282;color:#fff;cursor:pointer;font-size:13px;margin-right:8px;">`;
    dialogHtml += `Validate Against Spec</button>`;
    dialogHtml += `<button id="myrlin-spec-fix-names-btn" style="`;
    dialogHtml += `padding:6px 16px;border:1px solid #555;border-radius:3px;`;
    dialogHtml += `background:#2a2a2a;color:#ccc;cursor:pointer;font-size:13px;margin-right:8px;display:none;">`;
    dialogHtml += `Auto-Fix Names</button>`;
    dialogHtml += `<button id="myrlin-spec-add-attach-btn" style="`;
    dialogHtml += `padding:6px 16px;border:1px solid #555;border-radius:3px;`;
    dialogHtml += `background:#2a2a2a;color:#ccc;cursor:pointer;font-size:13px;display:none;">`;
    dialogHtml += `Add Missing Attachments</button>`;
    dialogHtml += `</div>`;

    // Results placeholder
    dialogHtml += `<div id="myrlin-spec-results-container"></div>`;

    // @ts-ignore - Dialog is a global from Blockbench
    const dialog = new Dialog({
        id: 'myrlin_import_validation_dialog',
        title: 'Validate Against Spec',
        width: DIALOG_WIDTH,
        lines: [dialogHtml],
        buttons: ['Close'],
        onConfirm: () => { /* close */ },
        onCancel: () => { /* close */ },
        onOpen: () => {
            setTimeout(() => attachImportValidationEvents(), 50);
        },
    });

    dialog.show();
}

/**
 * Attach event listeners to the import validation dialog DOM elements.
 * Handles the validate, auto-fix names, and add attachments buttons.
 */
function attachImportValidationEvents(): void {
    // Validate button
    const validateBtn = document.getElementById('myrlin-spec-validate-btn');
    if (validateBtn) {
        validateBtn.addEventListener('click', async () => {
            const textarea = document.getElementById('myrlin-spec-input') as HTMLTextAreaElement | null;
            if (!textarea || !textarea.value.trim()) {
                // @ts-ignore - Blockbench is a global
                Blockbench.showQuickMessage('Please paste a spec JSON first', 1500);
                return;
            }

            let spec: AssetSpec;
            try {
                spec = JSON.parse(textarea.value.trim());
            } catch (e) {
                // @ts-ignore - Blockbench is a global
                Blockbench.showQuickMessage('Invalid JSON. Please check the spec format.', 2000);
                return;
            }

            // Try API validation first, fall back to local
            let issues: SpecIssue[] = [];
            const modelData = extractModelData();

            if (modelData) {
                const client = getApiClient();
                const isOnline = await client.checkConnection();

                if (isOnline) {
                    try {
                        const report = await client.validate(modelData, 'hytale');
                        // Convert API issues to SpecIssue format
                        if (report.issues) {
                            issues = report.issues.map(i => ({
                                severity: i.severity,
                                code: i.code,
                                message: i.message,
                                location: i.location,
                                fixable: i.auto_fixable,
                            }));
                        }
                    } catch {
                        // Fall through to local validation
                    }
                }
            }

            // Always run local spec validation (supplements API results)
            const localIssues = validateAgainstSpecLocally(spec);

            // Merge: add local issues that are not already covered by API
            const existingCodes = new Set(issues.map(i => `${i.code}:${i.message}`));
            for (const localIssue of localIssues) {
                const key = `${localIssue.code}:${localIssue.message}`;
                if (!existingCodes.has(key)) {
                    issues.push(localIssue);
                }
            }

            // Cache issues for action buttons
            lastValidationIssues = issues;

            // Render results
            const container = document.getElementById('myrlin-spec-results-container');
            if (container) {
                container.innerHTML = buildIssueListHtml(issues);
            }

            // Show/hide action buttons based on available fixes
            const hasNameFixes = issues.some(i => i.code === 'NAME_CASE_MISMATCH' && i.fixable);
            const hasMissingAttachments = issues.some(i => i.code === 'MISSING_ATTACHMENT');

            const fixNamesBtn = document.getElementById('myrlin-spec-fix-names-btn');
            const addAttachBtn = document.getElementById('myrlin-spec-add-attach-btn');

            if (fixNamesBtn) {
                fixNamesBtn.style.display = hasNameFixes ? 'inline-block' : 'none';
            }
            if (addAttachBtn) {
                addAttachBtn.style.display = hasMissingAttachments ? 'inline-block' : 'none';
            }
        });
    }

    // Auto-Fix Names button
    const fixNamesBtn = document.getElementById('myrlin-spec-fix-names-btn');
    if (fixNamesBtn) {
        fixNamesBtn.addEventListener('click', () => {
            const fixCount = applyNameFixes(lastValidationIssues);
            // @ts-ignore - Blockbench is a global
            Blockbench.showQuickMessage(`Renamed ${fixCount} node(s) to match spec`, 2000);

            // Re-validate after fix
            const textarea = document.getElementById('myrlin-spec-input') as HTMLTextAreaElement | null;
            if (textarea && textarea.value.trim()) {
                try {
                    const spec = JSON.parse(textarea.value.trim());
                    lastValidationIssues = validateAgainstSpecLocally(spec);
                    const container = document.getElementById('myrlin-spec-results-container');
                    if (container) {
                        container.innerHTML = buildIssueListHtml(lastValidationIssues);
                    }
                    // Hide the fix names button if no more name fixes
                    const hasNameFixes = lastValidationIssues.some(i => i.code === 'NAME_CASE_MISMATCH' && i.fixable);
                    fixNamesBtn.style.display = hasNameFixes ? 'inline-block' : 'none';
                } catch {
                    // Spec parse failed, skip re-validate
                }
            }
        });
    }

    // Add Missing Attachments button
    const addAttachBtn = document.getElementById('myrlin-spec-add-attach-btn');
    if (addAttachBtn) {
        addAttachBtn.addEventListener('click', () => {
            const addedCount = addMissingAttachments(lastValidationIssues);
            // @ts-ignore - Blockbench is a global
            Blockbench.showQuickMessage(`Added ${addedCount} attachment node(s)`, 2000);

            // Re-validate after adding
            const textarea = document.getElementById('myrlin-spec-input') as HTMLTextAreaElement | null;
            if (textarea && textarea.value.trim()) {
                try {
                    const spec = JSON.parse(textarea.value.trim());
                    lastValidationIssues = validateAgainstSpecLocally(spec);
                    const container = document.getElementById('myrlin-spec-results-container');
                    if (container) {
                        container.innerHTML = buildIssueListHtml(lastValidationIssues);
                    }
                    // Hide the add attachments button if no more missing
                    const hasMissing = lastValidationIssues.some(i => i.code === 'MISSING_ATTACHMENT');
                    addAttachBtn.style.display = hasMissing ? 'inline-block' : 'none';
                } catch {
                    // Spec parse failed, skip re-validate
                }
            }
        });
    }
}

// =========================================
// Panel Styles
// =========================================

/** CSS styles for the import validation dialog */
const IMPORT_VALIDATION_STYLES = `
    #myrlin-spec-input:focus {
        border-color: #3498db !important;
        outline: none;
    }
    #myrlin-spec-validate-btn:hover {
        background: #2b6cb0 !important;
    }
    #myrlin-spec-fix-names-btn:hover,
    #myrlin-spec-add-attach-btn:hover {
        background: #333 !important;
        border-color: #666 !important;
    }
    #myrlin-spec-results table tr:hover {
        background: #333 !important;
    }
`;

// =========================================
// Setup Entry Point
// =========================================

/**
 * Register the "Validate Against Spec" action in Blockbench.
 *
 * Creates:
 *   - An Action (myrlin_import_validation) in the tools category
 *   - A menu entry under Tools via MenuBar.addAction
 *   - Custom CSS styles for the dialog
 *
 * Call this function from the plugin's onload() to activate import validation.
 */
export function setupImportValidation(): void {
    // Inject dialog styles
    trackStyle(IMPORT_VALIDATION_STYLES);

    // @ts-ignore - Action is a global from Blockbench
    const importValidationAction = new Action('myrlin_import_validation', {
        name: 'Validate Against Spec',
        description: 'Validate model against an asset spec for missing bones and naming issues (Myrlin\'s Tools)',
        icon: 'fact_check',
        category: 'tools',
        click: () => {
            showImportValidationDialog();
        },
    });

    // Track the action for cleanup on plugin unload
    // @ts-ignore
    track(importValidationAction);

    // Add to the Tools menu
    // @ts-ignore - MenuBar is a global from Blockbench
    MenuBar.addAction(importValidationAction, 'tools');
}
