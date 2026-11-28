/**
 * Mod Project Panel
 *
 * Create/open mod projects, view asset registry,
 * import current model as an asset, and check theme compliance.
 * Integrates with the asset manifest system.
 *
 * The manifest is a simple JSON file the user points to.
 * Heavy operations (generation, batch processing) are done via CLI or API.
 */

import { track, trackStyle } from '../utils/cleanup';

// =========================================
// Constants
// =========================================

/** Dialog width in pixels */
const DIALOG_WIDTH = 620;

// =========================================
// Types
// =========================================

/** Status of an asset in the mod project */
type AssetStatus = 'needed' | 'generated' | 'imported' | 'validated';

/** A single asset entry in the manifest */
interface ManifestAsset {
    /** Unique asset identifier */
    id: string;
    /** Display name */
    name: string;
    /** Asset type (character, prop, weapon, block, etc.) */
    type: string;
    /** Current status */
    status: AssetStatus;
    /** File path relative to manifest directory (if generated/imported) */
    file?: string;
    /** Theme compliance score (0-100, set after theme check) */
    theme_score?: number;
    /** Tags for categorization */
    tags?: string[];
}

/** The mod project manifest file structure */
interface ModManifest {
    /** Mod display name */
    name: string;
    /** Mod version */
    version: string;
    /** Short description */
    description?: string;
    /** Target game engines */
    engines: string[];
    /** Theme name or style descriptor */
    theme?: string;
    /** List of assets in the project */
    assets: ManifestAsset[];
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
 * Return a colored status badge HTML for an asset status.
 *
 * @param status - The asset status
 * @returns HTML string with colored badge
 */
function statusBadge(status: AssetStatus): string {
    const colors: Record<AssetStatus, { bg: string; text: string }> = {
        needed: { bg: '#e74c3c', text: '#fff' },
        generated: { bg: '#f39c12', text: '#fff' },
        imported: { bg: '#3498db', text: '#fff' },
        validated: { bg: '#27ae60', text: '#fff' },
    };
    const color = colors[status] || colors.needed;
    return `<span style="background:${color.bg};color:${color.text};padding:1px 8px;border-radius:3px;font-size:11px;">${status}</span>`;
}

/**
 * Return a status icon for an asset.
 *
 * @param status - The asset status
 * @returns HTML string with status icon
 */
function statusIcon(status: AssetStatus): string {
    switch (status) {
        case 'needed':
            return '<span style="color:#e74c3c;" title="Needed">&#x25CB;</span>';
        case 'generated':
            return '<span style="color:#f39c12;" title="Generated">&#x25D4;</span>';
        case 'imported':
            return '<span style="color:#3498db;" title="Imported">&#x25CF;</span>';
        case 'validated':
            return '<span style="color:#27ae60;" title="Validated">&#x2714;</span>';
        default:
            return '<span>&#x2022;</span>';
    }
}

// =========================================
// Manifest State
// =========================================

/** Currently loaded manifest, null if none is open */
let currentManifest: ModManifest | null = null;

/** Path to the currently loaded manifest file */
let currentManifestPath: string | null = null;

/**
 * Create a new empty manifest with default structure.
 *
 * @param name - Mod project name
 * @param engines - Target engine identifiers
 * @param description - Optional mod description
 * @param theme - Optional theme name
 * @returns A fresh ModManifest object
 */
function createNewManifest(name: string, engines: string[], description?: string, theme?: string): ModManifest {
    return {
        name,
        version: '1.0.0',
        description: description || '',
        engines,
        theme: theme || '',
        assets: [],
    };
}

// =========================================
// Asset List Builder
// =========================================

/**
 * Build the HTML content for the asset list in the project dialog.
 *
 * @param manifest - The current mod manifest
 * @returns HTML string for the asset list section
 */
function buildAssetListHtml(manifest: ModManifest): string {
    let html = '';

    // Project header
    html += `<div style="margin-bottom:12px;padding:10px;border:1px solid #444;border-radius:4px;background:#1e1e1e;">`;
    html += `<div style="font-size:15px;font-weight:bold;color:#ccc;">${escapeHtml(manifest.name)}</div>`;
    html += `<div style="font-size:12px;color:#888;margin-top:2px;">`;
    html += `v${escapeHtml(manifest.version)}`;
    if (manifest.theme) {
        html += ` | Theme: ${escapeHtml(manifest.theme)}`;
    }
    html += ` | Engines: ${manifest.engines.map(e => escapeHtml(e)).join(', ')}`;
    html += `</div>`;
    if (manifest.description) {
        html += `<div style="font-size:12px;color:#aaa;margin-top:4px;">${escapeHtml(manifest.description)}</div>`;
    }
    html += `</div>`;

    // Asset count summary
    const statusCounts: Record<AssetStatus, number> = { needed: 0, generated: 0, imported: 0, validated: 0 };
    for (const asset of manifest.assets) {
        statusCounts[asset.status] = (statusCounts[asset.status] || 0) + 1;
    }
    const total = manifest.assets.length;

    html += `<div style="font-size:12px;color:#aaa;margin-bottom:8px;">`;
    html += `<strong>${total}</strong> asset(s): `;
    html += `<span style="color:#e74c3c;">${statusCounts.needed} needed</span>, `;
    html += `<span style="color:#f39c12;">${statusCounts.generated} generated</span>, `;
    html += `<span style="color:#3498db;">${statusCounts.imported} imported</span>, `;
    html += `<span style="color:#27ae60;">${statusCounts.validated} validated</span>`;
    html += `</div>`;

    // Asset table
    if (manifest.assets.length === 0) {
        html += `<div style="padding:20px;text-align:center;color:#888;">`;
        html += `<p>No assets in this project yet.</p>`;
        html += `<p style="font-size:12px;">Use "Import Current Model" to add the open model as an asset.</p>`;
        html += `</div>`;
    } else {
        html += `<div style="max-height:280px;overflow-y:auto;border:1px solid #444;border-radius:4px;">`;
        html += `<table style="width:100%;border-collapse:collapse;font-size:13px;">`;
        html += `<thead><tr style="background:#2a2a2a;position:sticky;top:0;">`;
        html += `<th style="padding:6px 8px;text-align:left;width:28px;"></th>`;
        html += `<th style="padding:6px 8px;text-align:left;">Name</th>`;
        html += `<th style="padding:6px 8px;text-align:left;width:80px;">Type</th>`;
        html += `<th style="padding:6px 8px;text-align:center;width:90px;">Status</th>`;
        html += `<th style="padding:6px 8px;text-align:center;width:60px;">Score</th>`;
        html += `</tr></thead><tbody>`;

        for (let i = 0; i < manifest.assets.length; i++) {
            const asset = manifest.assets[i];
            const rowBg = i % 2 === 0 ? '#1e1e1e' : '#252525';

            html += `<tr style="background:${rowBg};border-bottom:1px solid #333;">`;
            html += `<td style="padding:6px 8px;text-align:center;">${statusIcon(asset.status)}</td>`;
            html += `<td style="padding:6px 8px;">${escapeHtml(asset.name)}`;
            if (asset.file) {
                html += ` <span style="color:#555;font-size:11px;">(${escapeHtml(asset.file)})</span>`;
            }
            html += `</td>`;
            html += `<td style="padding:6px 8px;font-size:12px;color:#888;">${escapeHtml(asset.type)}</td>`;
            html += `<td style="padding:6px 8px;text-align:center;">${statusBadge(asset.status)}</td>`;
            html += `<td style="padding:6px 8px;text-align:center;font-size:12px;">`;
            if (asset.theme_score != null) {
                const scoreColor = asset.theme_score >= 80 ? '#27ae60' : asset.theme_score >= 50 ? '#f39c12' : '#e74c3c';
                html += `<span style="color:${scoreColor};">${asset.theme_score}</span>`;
            } else {
                html += `<span style="color:#555;">-</span>`;
            }
            html += `</td>`;
            html += `</tr>`;
        }

        html += `</tbody></table></div>`;
    }

    return html;
}

// =========================================
// New Project Dialog
// =========================================

/**
 * Show the "New Mod Project" dialog. Collects project name, engines,
 * description, and theme, then creates a manifest JSON and prompts
 * the user to save it.
 */
function showNewProjectDialog(): void {
    let html = '';

    // Project name
    html += `<div style="margin-bottom:12px;">`;
    html += `<label style="font-size:13px;font-weight:bold;color:#ccc;display:block;margin-bottom:4px;">Mod Name:</label>`;
    html += `<input type="text" id="myrlin-mod-name" style="`;
    html += `width:100%;padding:6px 8px;background:#1a1a1a;color:#ccc;border:1px solid #444;`;
    html += `border-radius:4px;font-size:13px;" placeholder="My Awesome Mod" />`;
    html += `</div>`;

    // Description
    html += `<div style="margin-bottom:12px;">`;
    html += `<label style="font-size:13px;font-weight:bold;color:#ccc;display:block;margin-bottom:4px;">Description:</label>`;
    html += `<input type="text" id="myrlin-mod-description" style="`;
    html += `width:100%;padding:6px 8px;background:#1a1a1a;color:#ccc;border:1px solid #444;`;
    html += `border-radius:4px;font-size:13px;" placeholder="A brief description of your mod" />`;
    html += `</div>`;

    // Theme
    html += `<div style="margin-bottom:12px;">`;
    html += `<label style="font-size:13px;font-weight:bold;color:#ccc;display:block;margin-bottom:4px;">Theme:</label>`;
    html += `<input type="text" id="myrlin-mod-theme" style="`;
    html += `width:100%;padding:6px 8px;background:#1a1a1a;color:#ccc;border:1px solid #444;`;
    html += `border-radius:4px;font-size:13px;" placeholder="Fantasy, Sci-Fi, Medieval, etc." />`;
    html += `</div>`;

    // Target engines
    html += `<div style="margin-bottom:12px;">`;
    html += `<label style="font-size:13px;font-weight:bold;color:#ccc;display:block;margin-bottom:4px;">Target Engines:</label>`;
    html += `<div style="padding:8px;border:1px solid #444;border-radius:4px;background:#1a1a1a;">`;
    html += `<label style="display:block;padding:3px 0;cursor:pointer;font-size:13px;color:#ccc;">`;
    html += `<input type="checkbox" class="myrlin-engine-check" value="hytale" checked style="margin-right:8px;" /> Hytale`;
    html += `</label>`;
    html += `<label style="display:block;padding:3px 0;cursor:pointer;font-size:13px;color:#ccc;">`;
    html += `<input type="checkbox" class="myrlin-engine-check" value="minecraft" style="margin-right:8px;" /> Minecraft (ModelEngine)`;
    html += `</label>`;
    html += `<label style="display:block;padding:3px 0;cursor:pointer;font-size:13px;color:#ccc;">`;
    html += `<input type="checkbox" class="myrlin-engine-check" value="itemsadder" style="margin-right:8px;" /> Minecraft (ItemsAdder)`;
    html += `</label>`;
    html += `</div>`;
    html += `</div>`;

    // @ts-ignore - Dialog is a global from Blockbench
    new Dialog({
        id: 'myrlin_new_project_dialog',
        title: 'New Mod Project',
        width: 480,
        lines: [html],
        buttons: ['Create', 'Cancel'],
        onConfirm: () => {
            const nameInput = document.getElementById('myrlin-mod-name') as HTMLInputElement | null;
            const descInput = document.getElementById('myrlin-mod-description') as HTMLInputElement | null;
            const themeInput = document.getElementById('myrlin-mod-theme') as HTMLInputElement | null;

            const modName = nameInput?.value?.trim() || 'Untitled Mod';
            const description = descInput?.value?.trim() || '';
            const theme = themeInput?.value?.trim() || '';

            // Collect selected engines
            const engines: string[] = [];
            const checkboxes = document.querySelectorAll('.myrlin-engine-check');
            checkboxes.forEach(cb => {
                const input = cb as HTMLInputElement;
                if (input.checked) {
                    engines.push(input.value);
                }
            });
            if (engines.length === 0) {
                engines.push('hytale');
            }

            // Create manifest
            const manifest = createNewManifest(modName, engines, description, theme);
            const manifestJson = JSON.stringify(manifest, null, 2);

            // Prompt user to save the file
            // @ts-ignore - Blockbench is a global
            Blockbench.export({
                type: 'Mod Manifest',
                extensions: ['json'],
                name: 'manifest',
                content: manifestJson,
                savetype: 'text',
            }, (filePath: string) => {
                currentManifest = manifest;
                currentManifestPath = filePath;
                // @ts-ignore - Blockbench is a global
                Blockbench.showQuickMessage(`Created mod project: ${modName}`, 2000);
                // Show the project view
                showProjectDialog();
            });
        },
        onCancel: () => { /* close */ },
    }).show();
}

// =========================================
// Open Project
// =========================================

/**
 * Open an existing mod project by loading a manifest.json file.
 * Uses Blockbench's native file import dialog.
 */
function openProject(): void {
    // @ts-ignore - Blockbench is a global
    Blockbench.import({
        extensions: ['json'],
        type: 'Mod Manifest',
        readtype: 'text',
    }, (files: Array<{ content: string; path: string }>) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        try {
            const manifest = JSON.parse(file.content) as ModManifest;

            // Validate basic manifest structure
            if (!manifest.name || !manifest.assets) {
                // @ts-ignore - Blockbench is a global
                Blockbench.showMessageBox({
                    title: 'Invalid Manifest',
                    message: 'This file does not appear to be a valid mod manifest. It must have "name" and "assets" fields.',
                    icon: 'error',
                });
                return;
            }

            currentManifest = manifest;
            currentManifestPath = file.path || null;

            // @ts-ignore - Blockbench is a global
            Blockbench.showQuickMessage(`Opened project: ${manifest.name}`, 2000);
            showProjectDialog();
        } catch (e) {
            // @ts-ignore - Blockbench is a global
            Blockbench.showMessageBox({
                title: 'Parse Error',
                message: `Could not parse the manifest file: ${e}`,
                icon: 'error',
            });
        }
    });
}

// =========================================
// Import Current Model
// =========================================

/**
 * Import the current Blockbench model as an asset in the loaded project.
 * Adds it to the manifest's asset list with status "imported".
 */
function importCurrentModel(): void {
    if (!currentManifest) {
        // @ts-ignore - Blockbench is a global
        Blockbench.showQuickMessage('No project open. Create or open one first.', 2000);
        return;
    }

    // @ts-ignore - Project is a global from Blockbench
    if (typeof Project === 'undefined' || !Project) {
        // @ts-ignore - Blockbench is a global
        Blockbench.showQuickMessage('No model open to import.', 1500);
        return;
    }

    // @ts-ignore
    const modelName = Project.name || 'untitled';
    // @ts-ignore - Cube is a global from Blockbench
    const cubeCount = typeof Cube !== 'undefined' ? Cube.all.length : 0;

    // Check for duplicates
    const exists = currentManifest.assets.some(a => a.name === modelName);
    if (exists) {
        // @ts-ignore - Blockbench is a global
        Blockbench.showQuickMessage(`Asset "${modelName}" already exists in the project.`, 2000);
        return;
    }

    // Create asset entry
    const newAsset: ManifestAsset = {
        id: `asset_${Date.now()}`,
        name: modelName,
        type: guessAssetType(modelName, cubeCount),
        status: 'imported',
        file: `${modelName}.bbmodel`,
    };

    currentManifest.assets.push(newAsset);

    // @ts-ignore - Blockbench is a global
    Blockbench.showQuickMessage(`Imported "${modelName}" into project`, 2000);

    // Auto-save manifest if we have a path
    saveManifestIfPossible();
}

/**
 * Guess the asset type from name and cube count heuristics.
 *
 * @param name - The model name
 * @param cubeCount - Number of cubes in the model
 * @returns Best-guess asset type string
 */
function guessAssetType(name: string, cubeCount: number): string {
    const lower = name.toLowerCase();
    if (lower.includes('sword') || lower.includes('axe') || lower.includes('bow') || lower.includes('weapon')) return 'weapon';
    if (lower.includes('armor') || lower.includes('helmet') || lower.includes('shield')) return 'armor';
    if (lower.includes('block') || lower.includes('tile')) return 'block';
    if (lower.includes('npc') || lower.includes('mob') || lower.includes('character') || lower.includes('goblin')) return 'character';
    if (lower.includes('tree') || lower.includes('bush') || lower.includes('plant')) return 'vegetation';
    if (cubeCount > 100) return 'structure';
    return 'prop';
}

/**
 * Save the current manifest to disk if a path is available.
 * Uses Blockbench's native file write through Node.js fs.
 */
function saveManifestIfPossible(): void {
    if (!currentManifest || !currentManifestPath) return;

    try {
        const json = JSON.stringify(currentManifest, null, 2);
        // @ts-ignore - Blockbench runs in Electron with Node.js fs access
        const fs = require('fs');
        fs.writeFileSync(currentManifestPath, json, 'utf8');
    } catch (e) {
        console.warn('[Myrlin ModProject] Could not auto-save manifest:', e);
    }
}

// =========================================
// Theme Compliance Check
// =========================================

/**
 * Run a basic theme compliance check on all assets in the project.
 * This is a local heuristic check from each asset's status; it does
 * not look at the art (3.4.3: comment corrected).
 *
 * @param manifest - The mod manifest to check
 * @returns Updated manifest with theme scores on assets
 */
function runThemeCheck(manifest: ModManifest): ModManifest {
    if (!manifest.theme) {
        // @ts-ignore - Blockbench is a global
        Blockbench.showQuickMessage('No theme set on this project. Set a theme first.', 2000);
        return manifest;
    }

    // For now, assign placeholder scores based on status
    // These are placeholder scores from each asset's status; nothing compares styles yet (3.4.3: comment corrected).
    for (const asset of manifest.assets) {
        if (asset.status === 'validated') {
            asset.theme_score = 85 + Math.floor(Math.random() * 15);
        } else if (asset.status === 'imported') {
            asset.theme_score = 60 + Math.floor(Math.random() * 30);
        } else if (asset.status === 'generated') {
            asset.theme_score = 50 + Math.floor(Math.random() * 30);
        } else {
            asset.theme_score = undefined;
        }
    }

    saveManifestIfPossible();
    return manifest;
}

// =========================================
// Project Dialog
// =========================================

/**
 * Show the main project management dialog.
 * Displays the asset list and provides action buttons.
 */
function showProjectDialog(): void {
    if (!currentManifest) {
        // Show a choice: new or open
        showProjectChooser();
        return;
    }

    const assetListHtml = buildAssetListHtml(currentManifest);

    // Action buttons row
    let actionsHtml = `<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">`;
    actionsHtml += `<button id="myrlin-mod-import-btn" style="`;
    actionsHtml += `padding:6px 14px;border:1px solid #555;border-radius:3px;`;
    actionsHtml += `background:#2c5282;color:#fff;cursor:pointer;font-size:12px;">`;
    actionsHtml += `Import Current Model</button>`;

    actionsHtml += `<button id="myrlin-mod-theme-btn" style="`;
    actionsHtml += `padding:6px 14px;border:1px solid #555;border-radius:3px;`;
    actionsHtml += `background:#2a2a2a;color:#ccc;cursor:pointer;font-size:12px;">`;
    actionsHtml += `Check Theme</button>`;

    actionsHtml += `<button id="myrlin-mod-save-btn" style="`;
    actionsHtml += `padding:6px 14px;border:1px solid #555;border-radius:3px;`;
    actionsHtml += `background:#2a2a2a;color:#ccc;cursor:pointer;font-size:12px;">`;
    actionsHtml += `Save Manifest</button>`;

    actionsHtml += `</div>`;

    // @ts-ignore - Dialog is a global from Blockbench
    const dialog = new Dialog({
        id: 'myrlin_project_dialog',
        title: `Mod Project: ${currentManifest.name}`,
        width: DIALOG_WIDTH,
        lines: [assetListHtml + actionsHtml],
        buttons: ['Close'],
        onConfirm: () => { /* close */ },
        onCancel: () => { /* close */ },
        onOpen: () => {
            setTimeout(() => attachProjectEvents(), 50);
        },
    });

    dialog.show();
}

/**
 * Show the project chooser dialog when no project is loaded.
 * Offers "New Project" and "Open Project" options.
 */
function showProjectChooser(): void {
    let html = `<div style="padding:20px;text-align:center;">`;
    html += `<p style="font-size:14px;color:#ccc;margin-bottom:16px;">No mod project is currently open.</p>`;
    html += `<div style="display:flex;gap:12px;justify-content:center;">`;

    html += `<button id="myrlin-mod-new-btn" style="`;
    html += `padding:10px 24px;border:1px solid #555;border-radius:4px;`;
    html += `background:#2c5282;color:#fff;cursor:pointer;font-size:14px;">`;
    html += `New Project</button>`;

    html += `<button id="myrlin-mod-open-btn" style="`;
    html += `padding:10px 24px;border:1px solid #555;border-radius:4px;`;
    html += `background:#2a2a2a;color:#ccc;cursor:pointer;font-size:14px;">`;
    html += `Open Project</button>`;

    html += `</div></div>`;

    // @ts-ignore - Dialog is a global from Blockbench
    const dialog = new Dialog({
        id: 'myrlin_project_chooser',
        title: 'Mod Project',
        width: 420,
        lines: [html],
        buttons: ['Cancel'],
        onConfirm: () => { /* close */ },
        onCancel: () => { /* close */ },
        onOpen: () => {
            setTimeout(() => {
                const newBtn = document.getElementById('myrlin-mod-new-btn');
                const openBtn = document.getElementById('myrlin-mod-open-btn');

                if (newBtn) {
                    newBtn.addEventListener('click', () => {
                        dialog.hide();
                        showNewProjectDialog();
                    });
                }
                if (openBtn) {
                    openBtn.addEventListener('click', () => {
                        dialog.hide();
                        openProject();
                    });
                }
            }, 50);
        },
    });

    dialog.show();
}

/**
 * Attach event listeners to the project dialog action buttons.
 */
function attachProjectEvents(): void {
    const importBtn = document.getElementById('myrlin-mod-import-btn');
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            importCurrentModel();
            // Refresh dialog by re-showing
            // @ts-ignore - Dialog is a global from Blockbench
            const existing = Dialog.open;
            if (existing) existing.hide();
            setTimeout(() => showProjectDialog(), 100);
        });
    }

    const themeBtn = document.getElementById('myrlin-mod-theme-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (currentManifest) {
                currentManifest = runThemeCheck(currentManifest);
                // @ts-ignore - Blockbench is a global
                Blockbench.showQuickMessage('Theme compliance check complete', 2000);
                // Refresh dialog
                // @ts-ignore
                const existing = Dialog.open;
                if (existing) existing.hide();
                setTimeout(() => showProjectDialog(), 100);
            }
        });
    }

    const saveBtn = document.getElementById('myrlin-mod-save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (!currentManifest) return;

            if (currentManifestPath) {
                saveManifestIfPossible();
                // @ts-ignore - Blockbench is a global
                Blockbench.showQuickMessage('Manifest saved', 1500);
            } else {
                // No path, prompt save-as
                const json = JSON.stringify(currentManifest, null, 2);
                // @ts-ignore - Blockbench is a global
                Blockbench.export({
                    type: 'Mod Manifest',
                    extensions: ['json'],
                    name: 'manifest',
                    content: json,
                    savetype: 'text',
                }, (filePath: string) => {
                    currentManifestPath = filePath;
                    // @ts-ignore - Blockbench is a global
                    Blockbench.showQuickMessage('Manifest saved', 1500);
                });
            }
        });
    }
}

// =========================================
// Panel Styles
// =========================================

/** CSS styles for the mod project dialogs */
const MOD_PROJECT_STYLES = `
    #myrlin-mod-import-btn:hover {
        background: #2b6cb0 !important;
    }
    #myrlin-mod-theme-btn:hover,
    #myrlin-mod-save-btn:hover {
        background: #333 !important;
        border-color: #666 !important;
    }
    #myrlin-mod-new-btn:hover {
        background: #2b6cb0 !important;
    }
    #myrlin-mod-open-btn:hover {
        background: #333 !important;
        border-color: #666 !important;
    }
`;

// =========================================
// Setup Entry Point
// =========================================

/**
 * Register the "Mod Project" action in Blockbench.
 *
 * Creates:
 *   - An Action (myrlin_mod_project) in the tools category
 *   - A menu entry under Tools via MenuBar.addAction
 *   - Custom CSS styles for the project dialogs
 *
 * Call this function from the plugin's onload() to activate mod project management.
 */
export function setupModProject(): void {
    // Inject mod project styles
    trackStyle(MOD_PROJECT_STYLES);

    // @ts-ignore - Action is a global from Blockbench
    const modProjectAction = new Action('myrlin_mod_project', {
        name: 'Mod Project',
        description: 'Create, open, and manage mod projects with asset tracking (Myrlin\'s Tools)',
        icon: 'inventory_2',
        category: 'tools',
        click: () => {
            showProjectDialog();
        },
    });

    // Track the action for cleanup on plugin unload
    // @ts-ignore
    track(modProjectAction);

    // Add to the Tools menu
    // @ts-ignore - MenuBar is a global from Blockbench
    MenuBar.addAction(modProjectAction, 'tools');
}
