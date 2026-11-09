// =========================
// Plugin state
// =========================
let iconExporterAction;
let iconExporterPanel = null;
let iconExporterPanelVue = null;
let iconExporterPanelRequestedMode = 'panel';
const PLUGIN_BROWSER_ICON = 'icon.svg';
const ACTION_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAI4ElEQVR42oWXa4xdVRXHf2vvfR535s7ceTIVGgMhEGgBEaSAhEewaoQIBI0h9RFMiIkhETAhhIgGjZoASgwxBgSV+AE/GEnkCyIWLDESE3lL20BLO7XQx9B27tw795579ssP58ydaYF4vtxzs0/2Xuu//uv/X1saTROtc7iCj34UIED4iPVYr8f6/9r3D3sEdAJGq57xPvKpiy7k4osuxTsLAkXZBSKJyQFhceko5aAgy3KU1ghCCJFIQIBGPkJpByitUUrhnUNrQySgRGF0BkAIHqU0y70lXnrpFd7esQdT9j2f2/x5fviDn9DuLqC1YnH5IEorRtIWRTHgvYPzLCwcZmZmlgiEEMiyDJEq1anJGTrdJdIsJU1SiqJPmiaEEDDGkJpRiEKvv0ya5Ox6ZzvtBxbZ8fo7GIBBMeBY5yBbtz2Nd54INEebhBA4dPgAU5PTtJfaLHW6tBcXKcqSuZPmaDQalGUJcTeiBOccxhiUKJzzKCUgwqDoV8gWA0ZHG7z11i7m5/+LaKoAfHRoo3DW8/fnn0eJ1NlBiKGCPFZwxhiJRN6k2pw4/DmxzKsLAkoJc+vm2LBxA1maokRBrANwvqQYdAjB0+/3efEfr1IUJaLkA9wCIcaICGgt+AAxxLUf1MSM+LoExKr+9//8XmZnZ9i5YyciQqQOoApWoZRCRHH06CJGl6SJIsQ1G9fviRYGJRxc9Ey1FFkqOB+HaIQQGBkZZWb6JOb37UbrhCNHLRMTk+R5jveeGmAUgFYJWTpaMTdGjDGMjSZMjCdMtBImWymT4ymz0zkzkxlLfaE3MFxyzgyFTVjqCVOtlNnpjKmJnNEGfPK8s/jubd+hkQWmpxokqQYU8QQ81cqrcyVF0avKFmNda0FQpMaQZwlH25Gdex0bT53gt3dt4Il7zubh28/k3I+P89a8Y+FYJMsyusvLbNp0GdddfxNTUzMMBgWJSQjBYa3Fh3CcxKCURokhxHAcixKjyfOETi/yn10FDaO5d8t6Hr/zTK74xAS9MnLJhhYP33E6999yGq008Orr+9mw4QK2bLmFNB/lttu+h7WW9w8fAxQjjRGM1kMkzArTlRYaeQOqUqJECFF495Al0Zq7tpzKly+bpNU0DIKw2C0xWhGUEJThqvNGueLSG9irPstVm79Aa7xBcF2++rVvceWVm3n0sd8x1hwjhIhSashsU/MapajVq1bdCLv2DZhuZTz50/O44Iwm7+zvUQQIztPrWZJUkxiBGFlcdozllus/nUPT1cQWiI4DB95lsd2m2+0gpvEBlSfgKQZdlpe7rLRvaQNjDY2KkRvufo0HnpjHKGgkVf9rJRQ9y1JnQOk869ePk7jd3HP3rWy6+Cp2796D6DF+89gvufFLV/PQQ7/CuhLnLP1+f6gzVQDBMbAF1tlh1/sQGckU9998MldvHOX7v97NtXe/wQtvtBkf1UxMZqQjCXmmyTVse/koN/9sPw8+5em9+yYvPvUInc4xHn3sF0xPTTE9M8HYWIsYqzZdCcBUmhGBiFZmWBsBnAej4NvXznDNRS0e+8sCX//xdq48v8Wt163j3NOb7HrP8dCT77L134ucMSt885Kchp5g75sv8qc//oGFhSNMT09g3RLBByZa4zSbzWEJzKpwhTU9uuqz/cJz8EikmQp33jDLZzY2+P22Nt+4bxeXnzPGv3Z2ycXzlQsTTpkQUJHSpczv28dTrz2CNinB+6GchxiwzhLqVjQr+SrRH+rzg8KRKEXXRkTBmetzfnRTyjOvdHn0uUU2n2U4f32KC5EyCISItZGyLHlnz15mZw0hVon1ix7uSO84DpgV0oUYaxSGUo4oyEcMItWaIDgRkkxz7mk5k80u6yc1AShdTecQSYyQJgqTrB4OoEShtRr6yZCEKxyQE9wsRnA+ko4YRsYSEHAukOYGnZnKiJQQIwysx9pAmijSVGF9raax2igSybMRpianaDTyob8oAKNT8nSUGI+PQAS88/QKh4+RNNegpBaTagdrA84HlAhaC9oIIUIIsU4iVijUe690gBa1tgs8IbpKodYgMLCR5X5gsqnoFIEQqoXShuqAOkgRIUmEPNOECDE4nAfrV5EUEYpBj4bTeB+GfqBWpDjEal5bqX9iBBcD9/35KM+8vEx0ASOBonAsL1t6PVtnVM0FSaIorWe5b9n+Hjz3dkRpWKO6aG1QIsfx3KyQQ1BYZ4c+jcBJ00K743j8hTbbdvS55vwRzj7FgPcURZWB9ZEQIiEKexY8bxwQjhWB8dHIeLZaqhgjWZJhtGFYa1ljRiH4D0SXGM30BLSakSNLloe3tjlrXcqNF48y3UqIEYyKLHTglf2R/Usw0gism65QUaJIak5UXV0pzUoLDkeyWAuEUroiiNYopdFKI6qC9+QsUJaB+UXPg08vsXF9Tp4Z3jgAh7sRTORjM4IxlZMmiRqiKT5ijMa6Eu9NTfA1OqCVIdEJzjmsdbTbbdygREvlXEoJIgrrPGNpoDcI/HNHm+ih3RFaTchUpOhXB2sllIOI96FGW1hcLDAqxWiD976aK9dKMSIkacK6dXN88bprSIwlzxVKBKPS2qoj3jtKZyGCDwqtqjYTgTRR9SQdEVaHyRACR485JqdalL6HrAiRDKdiR2lLxppjXLTpQm6/43ICntJaRIRmPkFiMoiC9X0GdhkQtFb44FCicd6ila4ZXx0udd2tteR5xnK3x975Q+h6IhoiIEoIIVAM+pTlgK3P/Y3xsTHyRoNOp1P1cFFgtMYYQzEomJ6ewXsPsZpwFttter0ejTwnz3P6RUG30wFgbm4OUYpDhw4xOTmBMYbgazMSDfPz8zz712fZvuOtYcskxqCUxtX3xeArBVNK4UMgTZKhnscI1paEEFBKobXGh4CzlVbs2bMPYzRlOUBE4YMnyzNCBKMT4fVX3+T9hSMsLXWrVpS6RjGutszaK4oIsVayKobqO5FVk0Fk6C0hBLTWaK0orSVLMxYOHUFrQbKGjs57vAd1wgXkI596/f999pG3+Ahag9a69z98lIGbzt5ybgAAAABJRU5ErkJggg==';
let activeResetButton = null;
let cachedToolbarIconDataUrl = null;
let toolbarIconDataUrlPromise = null;
const WORLD_UP = new THREE.Vector3(0, 1, 0);
let dialogCameraRestoreState = null;
let dialogDefaultFramedCameraState = null;
let isolatedDialogPreview = null;
const EXPORT_PREFS_KEY = 'menu_icon_exporter_export_prefs_v2';
const DEFAULT_EXPORT_PREFS = Object.freeze({
    save_mode: 'ask_dialog',
    output_folder: '',
    icon_size: '',
    custom_size: 48,
    background: 'transparent',
    custom_color: '#ff0000',
    quality: 'high'
});
let cachedExportPrefsText = '';
const EXPORT_PREFS_LAST_WORKSPACE_KEY = 'menu_icon_exporter_last_workspace_v1';
const EXPORT_PREFS_WORKSPACES_SNAPSHOT_KEY = 'menu_icon_exporter_workspaces_snapshot_v1';

function getWorkspaceState() {
    if (typeof localStorage === 'undefined') return null;
    try {
        let raw = localStorage.getItem('workspaces');
        if (!raw) return [];
        let parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed
            .map((workspace, index) => {
                let name = workspace && typeof workspace.name === 'string' ? workspace.name.trim() : '';
                let projects = workspace && Array.isArray(workspace.projects) ? workspace.projects : [];
                let projectSignature = '[]';
                try {
                    projectSignature = JSON.stringify(projects);
                } catch (error) {
                    projectSignature = '[]';
                }
                return {
                    name: name,
                    active: workspace && workspace.active === true,
                    index: index,
                    projectSignature: projectSignature
                };
            })
            .filter(workspace => !!workspace.name);
    } catch (error) {
        return [];
    }
}

function getActiveWorkspaceName(workspaceState = null) {
    let state = Array.isArray(workspaceState) ? workspaceState : getWorkspaceState();
    if (!Array.isArray(state) || !state.length) return null;
    let activeWorkspace = state.find(workspace => workspace.active === true);
    if (!activeWorkspace) return null;
    if (activeWorkspace.name === 'Default') return null;
    return activeWorkspace.name;
}

function loadWorkspaceSnapshot() {
    if (typeof localStorage === 'undefined') return [];
    try {
        let raw = localStorage.getItem(EXPORT_PREFS_WORKSPACES_SNAPSHOT_KEY);
        if (!raw) return [];
        let parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed
            .filter(workspace => workspace && typeof workspace.name === 'string' && typeof workspace.index === 'number')
            .map(workspace => ({
                name: workspace.name,
                index: workspace.index,
                projectSignature: typeof workspace.projectSignature === 'string' ? workspace.projectSignature : '[]'
            }));
    } catch (error) {
        return [];
    }
}

function saveWorkspaceSnapshot(workspaceState = []) {
    if (typeof localStorage === 'undefined') return;
    try {
        let snapshot = workspaceState.map(workspace => ({
            name: workspace.name,
            index: workspace.index,
            projectSignature: workspace.projectSignature
        }));
        localStorage.setItem(EXPORT_PREFS_WORKSPACES_SNAPSHOT_KEY, JSON.stringify(snapshot));
    } catch (error) {
    }
}

function migrateWorkspacePrefsOnRename(workspaceState = []) {
    if (typeof localStorage === 'undefined') return;
    if (!Array.isArray(workspaceState) || !workspaceState.length) return;

    let previousState = loadWorkspaceSnapshot();
    if (!previousState.length) return;

    let currentNames = new Set(workspaceState.map(workspace => workspace.name));
    let previousNames = new Set(previousState.map(workspace => workspace.name));

    let removed = previousState.filter(workspace => workspace.name !== 'Default' && !currentNames.has(workspace.name));
    let added = workspaceState.filter(workspace => workspace.name !== 'Default' && !previousNames.has(workspace.name));

    if (removed.length !== 1 || added.length !== 1) return;

    let previousWorkspace = removed[0];
    let currentWorkspace = added[0];

    if (previousWorkspace.index !== currentWorkspace.index) return;
    if (previousWorkspace.projectSignature !== currentWorkspace.projectSignature) return;

    let previousKey = `${EXPORT_PREFS_KEY}::${previousWorkspace.name}`;
    let currentKey = `${EXPORT_PREFS_KEY}::${currentWorkspace.name}`;
    if (localStorage.getItem(currentKey) !== null) return;

    let previousValue = localStorage.getItem(previousKey);
    if (typeof previousValue === 'string') {
        localStorage.setItem(currentKey, previousValue);
    }
}

function getExportPrefsKey() {
    let workspaceState = getWorkspaceState();
    let workspaceName = getActiveWorkspaceName(workspaceState);

    if (typeof localStorage !== 'undefined') {
        try {
            migrateWorkspacePrefsOnRename(workspaceState);
            let previousActiveWorkspace = localStorage.getItem(EXPORT_PREFS_LAST_WORKSPACE_KEY) || '';
            if (workspaceName && previousActiveWorkspace && workspaceName !== previousActiveWorkspace) {
                let previousStillExists = Array.isArray(workspaceState) && workspaceState.some(workspace => workspace.name === previousActiveWorkspace);
                if (!previousStillExists) {
                    let previousKey = `${EXPORT_PREFS_KEY}::${previousActiveWorkspace}`;
                    let currentKey = `${EXPORT_PREFS_KEY}::${workspaceName}`;
                    if (localStorage.getItem(currentKey) === null) {
                        let previousValue = localStorage.getItem(previousKey);
                        if (typeof previousValue === 'string') {
                            localStorage.setItem(currentKey, previousValue);
                        }
                    }
                }
            }
            localStorage.setItem(EXPORT_PREFS_LAST_WORKSPACE_KEY, workspaceName || '');
            saveWorkspaceSnapshot(Array.isArray(workspaceState) ? workspaceState : []);
        } catch (error) {
        }
    }

    if (!workspaceName) return EXPORT_PREFS_KEY;
    return `${EXPORT_PREFS_KEY}::${workspaceName}`;
}
const PLUGIN_REPOSITORY = 'https://github.com/HMC-Studios/Menu-Icon-Exporter';
const PLUGIN_BUG_TRACKER = 'https://github.com/HMC-Studios/Menu-Icon-Exporter/issues';
const PLUGIN_ABOUT = `Export Blockbench models as PNG icons with stable camera framing.

![Menu Icon Exporter Preview](https://raw.githubusercontent.com/HMC-Studios/Menu-Icon-Exporter/main/images/plugin_example.png)

### Highlights
- Auto-frame model with stable reset behavior
- Manual camera controls (zoom, pan, rotate X/Y/Z)
- Live preview while adjusting controls
- 16/32/48/64/128 presets plus custom size
- Transparent, solid, or custom background color
- Export quality multipliers (4x, 8x, 16x)
- Save mode options (ask each time or auto-save folder)
- Two view modes: Float (dialog), Panel (sidebar)

PNG output works across Blockbench formats and platforms.
Platform-specific size, naming, and folder rules still apply.`;

// =========================
// Export preferences
// =========================
function canUseAppFileSystem() {
    return typeof require === 'function' || typeof requireNativeModule === 'function';
}

let _pluginDialog = null;
function _getDialog() {
    if (_pluginDialog) return _pluginDialog;
    try { _pluginDialog = require('dialog'); } catch (e) {}
    return _pluginDialog;
}

function isBlockbench5OrNewer() {
    return typeof Blockbench !== 'undefined' &&
        typeof Blockbench.isNewerThan === 'function' &&
        Blockbench.isNewerThan('4.99');
}

function getNativeModule(moduleName, options = null) {
    let moduleRef = null;

    if (typeof requireNativeModule === 'function') {
        try {
            moduleRef = options ? requireNativeModule(moduleName, options) : requireNativeModule(moduleName);
        } catch (error) {
        }
    }

    if (!moduleRef && typeof require === 'function') {
        try {
            moduleRef = require(moduleName);
        } catch (error) {
        }
    }

    return moduleRef;
}

function normalizeExportPrefs(source = {}) {
    let s = source || {};
    let saveMode = s.save_mode === 'auto_folder' ? 'auto_folder' : 'ask_dialog';
    let outputFolder = typeof s.output_folder === 'string' ? s.output_folder.trim() : '';
    if (!canUseAppFileSystem()) {
        saveMode = 'ask_dialog';
        outputFolder = '';
    }
    let validSizes = ['16', '32', '48', '64', '128', 'custom'];
    let iconSize = validSizes.includes(String(s.icon_size)) ? String(s.icon_size) : '';
    let customSize = (typeof s.custom_size === 'number' && s.custom_size >= 8 && s.custom_size <= 512) ? s.custom_size : 48;
    let validBgs = ['transparent', 'white', 'black', 'gray', 'custom'];
    let background = validBgs.includes(s.background) ? s.background : 'transparent';
    let customColor = (typeof s.custom_color === 'string' && /^#[0-9a-fA-F]{6}$/.test(s.custom_color)) ? s.custom_color : '#ff0000';
    let validQualities = ['standard', 'high', 'ultra'];
    let quality = validQualities.includes(s.quality) ? s.quality : 'high';
    return {
        save_mode: saveMode,
        output_folder: outputFolder,
        icon_size: iconSize,
        custom_size: customSize,
        background: background,
        custom_color: customColor,
        quality: quality
    };
}

function loadExportPrefs() {
    try {
        let prefsKey = getExportPrefsKey();
        let raw = localStorage.getItem(prefsKey);
        let normalized = normalizeExportPrefs(raw ? JSON.parse(raw) : DEFAULT_EXPORT_PREFS);
        cachedExportPrefsText = JSON.stringify(normalized);
        return normalized;
    } catch (error) {
        let normalized = normalizeExportPrefs(DEFAULT_EXPORT_PREFS);
        cachedExportPrefsText = JSON.stringify(normalized);
        return normalized;
    }
}

function saveExportPrefs(source = {}) {
    let normalized = normalizeExportPrefs(source);
    let serialized = JSON.stringify(normalized);
    if (serialized === cachedExportPrefsText) return;
    cachedExportPrefsText = serialized;
    try {
        let prefsKey = getExportPrefsKey();
        localStorage.setItem(prefsKey, serialized);
    } catch (error) {
    }
}

// =========================
// Plugin registration
// =========================
Plugin.register('menu_icon_exporter', {
    title: 'Menu Icon Exporter',
    author: 'NET',
    description: 'Export perfect menu/item icons with advanced camera controls',
    icon: PLUGIN_BROWSER_ICON,
    about: PLUGIN_ABOUT,
    repository: PLUGIN_REPOSITORY,
    bug_tracker: PLUGIN_BUG_TRACKER,
    version: '1.0.0',
    min_version: '4.8.0',
    variant: 'both',
    tags: ['Minecraft', 'Utility', 'Export'],
    
    onload() {
        this.iconExporterAction = new Action('export_menu_icon', {
            name: 'Export Menu Icon',
            description: 'Export model as a menu/item icon with automatic framing',
            icon: ACTION_ICON,
            category: 'file',
            click: openIconExporterDialog
        });

        this.openPanelAction = new Action('open_icon_exporter_panel', {
            name: 'Icon Exporter Panel',
            description: 'Open the icon exporter as a sidebar panel',
            icon: ACTION_ICON,
            category: 'file',
            click: () => switchToPanel()
        });

        MenuBar.addAction(this.iconExporterAction, 'file.export');
        MenuBar.addAction(this.openPanelAction, 'file.export');

        applyToolbarActionIcon(this.iconExporterAction);
    },
    
    onunload() {
        stopCameraWatcher();
        activeResetButton = null;
        restoreDialogCameraState();
        disposeIsolatedDialogPreview();
        clearDialogCameraState();
        this.iconExporterAction?.delete();
        this.openPanelAction?.delete();
        destroyIconExporterPanel();
    }
});

// =========================
// Panel helpers
// =========================
function getIconExporterPanel() {
    if (iconExporterPanel) return iconExporterPanel;
    if (Interface && Interface.Panels && Interface.Panels.menu_icon_exporter_panel) {
        return Interface.Panels.menu_icon_exporter_panel;
    }
    return null;
}

function panelIsFloating(panel) {
    if (!panel) return false;
    try {
        if (typeof panel.isInSidebar === 'function') return !panel.isInSidebar();
    } catch (e) {}
    try {
        if (panel.position_data && panel.position_data.slot) {
            return String(panel.position_data.slot).toLowerCase().includes('float');
        }
    } catch (e) {}
    return false;
}

function refreshPanelLayout() {
    try {
        if (typeof Interface.updateSidebars === 'function') {
            Interface.updateSidebars();
        } else if (typeof updateInterfacePanels === 'function') {
            updateInterfacePanels();
        }
    } catch (e) {}
    applyResponsivePanelFill();
    setTimeout(applyResponsivePanelFill, 0);
}

let miePanelResizeObserver = null;
let miePanelObservedNode = null;
let isApplyingMiePanelFill = false;

function disconnectMiePanelResizeObserver() {
    if (miePanelResizeObserver) {
        try { miePanelResizeObserver.disconnect(); } catch (e) {}
    }
    miePanelResizeObserver = null;
    miePanelObservedNode = null;
}

function ensureMiePanelResizeObserver(panel) {
    if (typeof ResizeObserver !== 'function' || !panel || !panel.node) return;
    if (miePanelObservedNode === panel.node && miePanelResizeObserver) return;
    disconnectMiePanelResizeObserver();
    try {
        miePanelObservedNode = panel.node;
        miePanelResizeObserver = new ResizeObserver(() => {
            if (typeof requestAnimationFrame === 'function') {
                requestAnimationFrame(applyResponsivePanelFill);
            } else {
                applyResponsivePanelFill();
            }
        });
        miePanelResizeObserver.observe(panel.node);
    } catch (e) {}
}

function applyResponsivePanelFill() {
    if (isApplyingMiePanelFill) return;
    isApplyingMiePanelFill = true;
    let panel = getIconExporterPanel();
    if (!panel) { isApplyingMiePanelFill = false; return; }

    try {
        ensureMiePanelResizeObserver(panel);

        let panelNode = panel.node;
        if (!panelNode) return;

        let bodyNode = panelNode.querySelector('.mie_panel_body');
        if (!bodyNode) return;

        let panelRect = panelNode.getBoundingClientRect();
        let bodyRect = bodyNode.getBoundingClientRect();
        if (!panelRect || !bodyRect) return;

        let topOffset = Math.max(0, bodyRect.top - panelRect.top);
        let availableHeight = Math.floor(panelRect.height - topOffset - 2);

        if (Number.isFinite(availableHeight) && availableHeight > 80) {
            bodyNode.style.height = availableHeight + 'px';
            bodyNode.style.maxHeight = availableHeight + 'px';
            bodyNode.style.overflowY = 'auto';
            bodyNode.style.overflowX = 'hidden';
        }
    } catch (e) {
    } finally {
        isApplyingMiePanelFill = false;
    }
}

function movePanelToSlot(targetSlot) {
    let panel = getIconExporterPanel();
    if (!panel) return false;

    let slotNames = [targetSlot];
    if (targetSlot === 'right_bar') slotNames.push('right');
    if (targetSlot === 'left_bar') slotNames.push('left');
    if (targetSlot === 'float') slotNames.push('floating');

    let done = false;

    for (let slot of slotNames) {
        if (done) break;
        try {
            if (typeof panel.moveTo === 'function') {
                panel.moveTo(slot);
                done = true;
            }
        } catch (e) {}
    }

    if (!done) {
        for (let slot of slotNames) {
            if (done) break;
            try {
                if (typeof panel.customizePosition === 'function') {
                    let opts = { slot: slot, folded: false };
                    if (slot === 'float' || slot === 'floating') {
                        opts.float_position = [120, 80];
                        opts.float_size = [400, 700];
                    }
                    panel.customizePosition(opts);
                    done = true;
                }
            } catch (e) {}
        }
    }

    try { if (typeof panel.setupFloatHandles === 'function') panel.setupFloatHandles(); } catch (e) {}
    try {
        if (typeof panel.updateSlot === 'function') panel.updateSlot();
        if (typeof panel.update === 'function') panel.update();
    } catch (e) {}
    try {
        if (typeof panel.show === 'function') panel.show();
        if (typeof panel.select === 'function') panel.select();
        else if (typeof panel.selectTab === 'function') panel.selectTab(panel);
    } catch (e) {}
    refreshPanelLayout();
    return done;
}

function destroyIconExporterPanel() {
    disconnectMiePanelResizeObserver();
    if (iconExporterPanelVue) {
        iconExporterPanelVue = null;
    }
    let panel = getIconExporterPanel();
    if (panel) {
        try { if (typeof panel.delete === 'function') panel.delete(); } catch (e) {}
    }
    iconExporterPanel = null;
}

function collectCurrentFormState() {
    let prefs = loadExportPrefs();
    return {
        auto_frame: true,
        zoom_level: 1.0,
        rotate_x: 0, rotate_y: 0, rotate_z: 0,
        pan_x: 0, pan_y: 0,
        icon_size: prefs.icon_size || getRecommendedSize(),
        custom_size: prefs.custom_size,
        background: prefs.background,
        custom_color: prefs.custom_color,
        quality: prefs.quality,
        save_mode: prefs.save_mode,
        output_folder: prefs.output_folder,
        filename: getDefaultFilename()
    };
}

function getDefaultFilename() {
    if (!Project || !Project.name) return 'icon';
    let name = Project.name;
    name = name.replace(/\.geo\.json$/i, '').replace(/\.geo$/i, '');
    name = name.replace(/\.[^.]+$/, '');
    name = name.replace(/[^a-zA-Z0-9_-]/g, '_');
    return name + '_icon';
}

function switchToFloat() {
    destroyIconExporterPanel();
    openIconExporterDialog();
}

function switchToPanel() {
    createIconExporterPanel('panel');
}

function getSlotForMode(mode) {
    return 'right_bar';
}

function createIconExporterPanel(mode) {
    iconExporterPanelRequestedMode = mode;
    let targetSlot = getSlotForMode(mode);

    if (iconExporterPanel) {
        let panel = getIconExporterPanel();
        if (panel) {
            movePanelToSlot(targetSlot);
            if (iconExporterPanelVue) {
                iconExporterPanelVue.currentMode = mode;
            }
            return;
        }
    }

    let panelStyle = document.getElementById('menu_icon_exporter_panel_style');
    if (panelStyle) panelStyle.remove();
    panelStyle = document.createElement('style');
    panelStyle.id = 'menu_icon_exporter_panel_style';
    panelStyle.textContent = `
        .mie_panel_body { padding: 4px 6px; font-size: 12px; width: 100%; box-sizing: border-box; overflow-y: auto !important; overflow-x: hidden !important; }
        .mie_section_header { display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; cursor: pointer; background: rgba(255,255,255,0.03); user-select: none; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; margin-bottom: 2px; }
        .mie_section_header:hover { background: rgba(255,255,255,0.06); }
        .mie_section_header h4 { margin: 0; font-size: 12px; font-weight: 600; }
        .mie_section_body { padding: 4px 6px 6px; width: 100%; box-sizing: border-box; }
        .mie_row { display: flex; align-items: center; min-height: 28px; margin-bottom: 4px; gap: 6px; width: 100%; box-sizing: border-box; }
        .mie_row label { flex: 0 0 auto; min-width: 55px; font-size: 11px; color: var(--color-subtle_text); white-space: nowrap; line-height: 28px; }
        .mie_row select, .mie_row input[type="text"], .mie_row input[type="number"] { flex: 1 1 0; min-width: 0; width: 0; background: var(--color-back); border: 1px solid var(--color-border); color: var(--color-text); padding: 5px 6px; border-radius: 5px; font-size: 11px; box-sizing: border-box; height: 28px; }
        .mie_row input[type="checkbox"] { flex: 0 0 auto; width: 16px; height: 16px; margin: 0; }
        .mie_row input[type="range"] { flex: 1 1 0; min-width: 0; width: 0; height: 18px; }
        .mie_row .mie_range_val { flex: 0 0 24px; text-align: right; font-size: 11px; font-variant-numeric: tabular-nums; line-height: 28px; }
        .mie_preview_canvas { display: block; width: 128px; height: 128px; border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; image-rendering: pixelated; margin: 0 auto 4px; box-sizing: border-box; }
        .mie_btn { display: block; width: 100%; padding: 6px 8px; border: 1px solid rgba(255,255,255,0.14); border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600; text-align: center; background: var(--color-button); color: var(--color-text); box-sizing: border-box; margin-bottom: 2px; }
        .mie_btn:hover { background: var(--color-accent); color: #fff; }
        .mie_btn_primary { background: linear-gradient(180deg, #4f95f7, #3e7ad6); color: #fff; }
        .mie_btn_primary:hover { background: linear-gradient(180deg, #5fa3ff, #4a88e8); }
        .mie_mode_bar { display: flex; gap: 3px; margin-bottom: 4px; width: 100%; box-sizing: border-box; }
        .mie_mode_btn { flex: 1 1 0; padding: 4px 3px; border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; cursor: pointer; font-size: 10px; font-weight: 600; text-align: center; background: rgba(255,255,255,0.04); color: var(--color-subtle_text); min-width: 0; }
        .mie_mode_btn:hover { background: rgba(255,255,255,0.08); color: var(--color-text); }
        .mie_mode_btn.active { background: var(--color-accent); color: #fff; border-color: var(--color-accent); }
        .mie_arrow { transition: transform 0.15s; font-size: 14px; }
        .mie_arrow.collapsed { transform: rotate(-90deg); }
        .mie_folder_row { display: flex; align-items: center; min-height: 28px; gap: 6px; margin-bottom: 4px; width: 100%; box-sizing: border-box; }
        .mie_folder_row label { flex: 0 0 auto; min-width: 55px; font-size: 11px; color: var(--color-subtle_text); white-space: nowrap; line-height: 28px; }
        .mie_folder_row input { flex: 1 1 0; min-width: 0; width: 0; background: var(--color-back); border: 1px solid var(--color-border); color: var(--color-text); padding: 5px 6px; border-radius: 5px; font-size: 11px; box-sizing: border-box; height: 28px; }
        .mie_folder_row i { flex: 0 0 auto; cursor: pointer; font-size: 18px; opacity: 0.7; line-height: 28px; padding: 4px; pointer-events: auto; position: relative; z-index: 2; }
        .mie_folder_row i:hover { opacity: 1; }
    `;
    document.head.appendChild(panelStyle);

    iconExporterPanel = new Panel({
        id: 'menu_icon_exporter_panel',
        name: 'Icon Exporter',
        icon: 'photo_camera',
        default_side: 'right',
        expand_button: true,
        folded: false,
        resizable: true,
        growable: true,
        min_height: 300,
        onResize() {
            applyResponsivePanelFill();
            if (iconExporterPanelVue) {
                if (typeof iconExporterPanelVue.layoutPanel === 'function') iconExporterPanelVue.layoutPanel();
                else if (typeof iconExporterPanelVue.refreshPreview === 'function') iconExporterPanelVue.refreshPreview();
            }
        },
        onFold() {
            applyResponsivePanelFill();
        },
        component: {
            name: 'icon-exporter-panel',
            template: `
                <div class="mie_panel_body" style="overflow-y:auto !important; overflow-x:hidden !important; width:100%; box-sizing:border-box;">
                    <div class="mie_mode_bar">
                        <div class="mie_mode_btn" @click="switchToFloat" title="Floating window">Float</div>
                        <div class="mie_mode_btn" :class="{ active: currentMode === 'panel' }" @click="switchToPanel" title="Sidebar panel">Panel</div>
                    </div>

                    <div class="mie_section_header" @click="sections.preview = !sections.preview; $nextTick(() => layoutPanel())">
                        <h4>Preview</h4>
                        <i class="material-icons mie_arrow" :class="{ collapsed: !sections.preview }">expand_more</i>
                    </div>
                    <div class="mie_section_body" v-if="sections.preview">
                        <canvas ref="panelPreviewCanvas" class="mie_preview_canvas" width="256" height="256"></canvas>
                        <div style="text-align:center;font-size:11px;color:var(--color-subtle_text);margin-bottom:4px;">{{ previewSizeText }}</div>
                        <button class="mie_btn mie_btn_primary" @click="resetCamera" :disabled="!hasManualAdjustments" :style="{ opacity: hasManualAdjustments ? 1 : 0.5 }">Reset Camera to Auto-Frame</button>
                    </div>

                    <div class="mie_section_header" @click="sections.camera = !sections.camera; $nextTick(() => layoutPanel())">
                        <h4>Camera Controls</h4>
                        <i class="material-icons mie_arrow" :class="{ collapsed: !sections.camera }">expand_more</i>
                    </div>
                    <div class="mie_section_body" v-if="sections.camera">
                        <div class="mie_row"><label>Auto-frame</label><input type="checkbox" v-model="auto_frame" @change="onCameraChange"></div>
                        <div class="mie_row"><label>Zoom</label><input type="range" min="0.5" max="3.0" step="0.1" v-model.number="zoom_level" @input="onCameraChange"><span class="mie_range_val">{{ formatVal(zoom_level) }}</span></div>
                        <div class="mie_row"><label>Rotate X</label><input type="range" min="-180" max="180" step="5" v-model.number="rotate_x" @input="onCameraChange"><span class="mie_range_val">{{ rotate_x }}</span></div>
                        <div class="mie_row"><label>Rotate Y</label><input type="range" min="-180" max="180" step="5" v-model.number="rotate_y" @input="onCameraChange"><span class="mie_range_val">{{ rotate_y }}</span></div>
                        <div class="mie_row"><label>Rotate Z</label><input type="range" min="-180" max="180" step="5" v-model.number="rotate_z" @input="onCameraChange"><span class="mie_range_val">{{ rotate_z }}</span></div>
                        <div class="mie_row"><label>Pan X</label><input type="range" min="-50" max="50" step="1" v-model.number="pan_x" @input="onCameraChange"><span class="mie_range_val">{{ pan_x }}</span></div>
                        <div class="mie_row"><label>Pan Y</label><input type="range" min="-50" max="50" step="1" v-model.number="pan_y" @input="onCameraChange"><span class="mie_range_val">{{ pan_y }}</span></div>
                    </div>

                    <div class="mie_section_header" @click="sections.export = !sections.export; $nextTick(() => layoutPanel())">
                        <h4>Export Settings</h4>
                        <i class="material-icons mie_arrow" :class="{ collapsed: !sections.export }">expand_more</i>
                    </div>
                    <div class="mie_section_body" v-if="sections.export">
                        <div class="mie_row"><label>Icon Size</label><select v-model="icon_size" @change="onSettingChange"><option value="16">16×16 - Tiny</option><option value="32">32×32 - Small</option><option value="48">48×48 - Medium</option><option value="64">64×64 - Large</option><option value="128">128×128 - XL</option><option value="custom">Custom...</option></select></div>
                        <div class="mie_row" v-if="icon_size === 'custom'"><label>Custom Size</label><input type="number" min="8" max="512" v-model.number="custom_size" @input="onSettingChange"></div>
                        <div class="mie_row"><label>Background</label><select v-model="background" @change="onSettingChange"><option value="transparent">Transparent</option><option value="white">White</option><option value="black">Black</option><option value="gray">Gray</option><option value="custom">Custom Color</option></select></div>
                        <div class="mie_row" v-if="background === 'custom'"><label>Color</label><input type="color" v-model="custom_color" @input="onSettingChange"></div>
                        <div class="mie_row"><label>Quality</label><select v-model="quality" @change="onSettingChange"><option value="standard">Standard (4x)</option><option value="high">High (8x)</option><option value="ultra">Ultra (16x)</option></select></div>
                        <div class="mie_row"><label>Save Mode</label><select v-model="save_mode" @change="onSaveModeChange"><option value="ask_dialog">Ask every export</option><option v-if="canAutoSave" value="auto_folder">Auto-save to folder</option></select></div>
                        <div class="mie_folder_row" v-if="save_mode === 'auto_folder'"><label>Folder</label><input type="text" :value="output_folder" readonly><i class="material-icons" @click.stop.prevent="browseFolder" title="Browse" role="button">folder</i><i class="material-icons" @click.stop.prevent="output_folder = ''" title="Clear" role="button">clear</i></div>
                        <div class="mie_row"><label>Filename</label><input type="text" v-model="filename"></div>
                        <button class="mie_btn mie_btn_primary" @click="doExport" style="margin-top:4px;">Export Icon</button>
                    </div>
                </div>
            `,
            data() {
                let state = collectCurrentFormState();
                return {
                    sections: { preview: true, camera: true, export: true },
                    currentMode: iconExporterPanelRequestedMode || 'panel',
                    auto_frame: state.auto_frame,
                    zoom_level: state.zoom_level,
                    rotate_x: state.rotate_x,
                    rotate_y: state.rotate_y,
                    rotate_z: state.rotate_z,
                    pan_x: state.pan_x,
                    pan_y: state.pan_y,
                    icon_size: state.icon_size,
                    custom_size: state.custom_size,
                    background: state.background,
                    custom_color: state.custom_color,
                    quality: state.quality,
                    save_mode: state.save_mode,
                    output_folder: state.output_folder,
                    filename: state.filename,
                    panelPreviewIsolated: null,
                    panelBaseCameraPosition: null,
                    panelBaseCameraTarget: null,
                    panelBaseCameraUp: null,
                    panelDefaultFramedState: null
                };
            },
            computed: {
                previewSizeText() {
                    let s = this.icon_size === 'custom' ? this.custom_size : parseInt(this.icon_size);
                    return s + '×' + s + ' pixels';
                },
                hasManualAdjustments() {
                    return this.zoom_level !== 1.0 || this.rotate_x !== 0 || this.rotate_y !== 0 || this.rotate_z !== 0 || this.pan_x !== 0 || this.pan_y !== 0;
                },
                canAutoSave() {
                    return canUseAppFileSystem();
                }
            },
            methods: {
                formatVal(v) {
                    let n = Number(v);
                    if (Math.abs(n - Math.round(n)) < 0.0001) return String(Math.round(n));
                    return String(Math.round(n * 100) / 100);
                },
                switchToFloat() { switchToFloat(); },
                switchToPanel() {
                    this.currentMode = 'panel';
                    movePanelToSlot(getSlotForMode('panel'));
                },
                getFormData() {
                    return {
                        icon_size: this.icon_size,
                        custom_size: this.custom_size,
                        background: this.background,
                        custom_color: this.custom_color,
                        auto_frame: this.auto_frame,
                        zoom_level: this.zoom_level,
                        rotate_x: this.rotate_x,
                        rotate_y: this.rotate_y,
                        rotate_z: this.rotate_z,
                        pan_x: this.pan_x,
                        pan_y: this.pan_y,
                        quality: this.quality,
                        save_mode: this.save_mode,
                        output_folder: this.output_folder,
                        filename: this.filename
                    };
                },
                onCameraChange() {
                    this.applyCameraFromState();
                    this.refreshPreview();
                },
                onSettingChange() {
                    saveExportPrefs(this.getFormData());
                    this.refreshPreview();
                },
                onSaveModeChange() {
                    saveExportPrefs(this.getFormData());
                },
                applyCameraFromState() {
                    let preview = this.panelPreviewIsolated || getSelectedPreview();
                    if (!preview || !preview.camera) return;

                    if (!this.panelBaseCameraPosition || !this.panelBaseCameraTarget || !this.panelBaseCameraUp) {
                        this.captureBaseCamera();
                    }

                    let camera = preview.camera;
                    let values = {
                        zoom_level: this.zoom_level,
                        rotate_x: this.rotate_x,
                        rotate_y: this.rotate_y,
                        rotate_z: this.rotate_z,
                        pan_x: this.pan_x,
                        pan_y: this.pan_y
                    };

                    let newTarget = this.panelBaseCameraTarget.clone();
                    let baseOffset = this.panelBaseCameraPosition.clone().sub(this.panelBaseCameraTarget);
                    let baseUpNormal = this.panelBaseCameraUp.clone().normalize();
                    let forward = this.panelBaseCameraTarget.clone().sub(this.panelBaseCameraPosition).normalize();
                    let right = forward.clone().cross(baseUpNormal);
                    if (right.lengthSq() === 0) right.set(1, 0, 0); else right.normalize();
                    newTarget.add(right.multiplyScalar(values.pan_x * 2.0));
                    newTarget.add(baseUpNormal.clone().multiplyScalar(values.pan_y * 2.0));

                    let rotatedOffset = baseOffset.clone();
                    let rotY = THREE.MathUtils.degToRad(values.rotate_y);
                    let rotX = THREE.MathUtils.degToRad(values.rotate_x);
                    let rotZ = THREE.MathUtils.degToRad(values.rotate_z);
                    if (rotY !== 0) rotatedOffset.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(baseUpNormal, rotY));
                    if (rotX !== 0) {
                        let pitchAxis = baseUpNormal.clone().cross(rotatedOffset).normalize();
                        if (pitchAxis.lengthSq() > 0) rotatedOffset.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(pitchAxis, rotX));
                    }
                    rotatedOffset.multiplyScalar(values.zoom_level);

                    let newPos = newTarget.clone().add(rotatedOffset);
                    camera.position.copy(newPos);
                    let upVec = baseUpNormal.clone();
                    if (rotZ !== 0) {
                        let fwdAxis = newTarget.clone().sub(newPos).normalize();
                        if (fwdAxis.lengthSq() > 0) upVec.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(fwdAxis, rotZ));
                    }
                    camera.up.copy(upVec);
                    if (preview.controls && preview.controls.target) preview.controls.target.copy(newTarget);
                    camera.lookAt(newTarget);
                    if (camera.updateProjectionMatrix) camera.updateProjectionMatrix();
                    if (preview.controls && preview.controls.update) preview.controls.update();
                    if (typeof preview.render === 'function') preview.render();
                },
                captureBaseCamera() {
                    let preview = this.panelPreviewIsolated || getSelectedPreview();
                    if (!preview || !preview.camera) return;
                    let camera = preview.camera;
                    this.panelBaseCameraPosition = camera.position.clone();
                    this.panelBaseCameraTarget = getCurrentPreviewTarget(camera, preview);
                    camera.up.copy(WORLD_UP);
                    if (preview.controls && preview.controls.target) preview.controls.target.copy(this.panelBaseCameraTarget);
                    camera.lookAt(this.panelBaseCameraTarget);
                    if (camera.updateProjectionMatrix) camera.updateProjectionMatrix();
                    if (preview.controls && preview.controls.update) preview.controls.update();
                    if (typeof preview.render === 'function') preview.render();
                    this.panelBaseCameraUp = WORLD_UP.clone();
                },
                resetCamera() {
                    this.zoom_level = 1.0;
                    this.rotate_x = 0;
                    this.rotate_y = 0;
                    this.rotate_z = 0;
                    this.pan_x = 0;
                    this.pan_y = 0;
                    this.auto_frame = true;
                    this.panelBaseCameraPosition = null;
                    this.panelBaseCameraTarget = null;
                    this.panelBaseCameraUp = null;

                    let preview = this.panelPreviewIsolated || getSelectedPreview();
                    let mainPreview = Preview.selected || getSelectedPreview();
                    if (mainPreview && preview && mainPreview !== preview) {
                        let freshState = captureCameraState(mainPreview);
                        if (freshState) applyCameraState(freshState, preview);
                    }
                    frameModelForIcon(this.getFormData()).then(() => {
                        this.panelDefaultFramedState = captureCameraState(preview);
                        this.captureBaseCamera();
                        this.refreshPreview();
                    });
                },
                refreshPreview() {
                    this.$nextTick(() => {
                        let canvas = this.$refs.panelPreviewCanvas;
                        if (!canvas) return;
                        let formData = this.getFormData();
                        generateLivePreview(canvas, formData, this.panelPreviewIsolated);
                    });
                },
                layoutPanel() {
                    this.$nextTick(() => {
                        let canvas = this.$refs.panelPreviewCanvas;
                        if (!canvas || !this.sections.preview) {
                            return;
                        }
                        let body = this.$el;
                        if (!body) return;
                        let bodyHeight = body.clientHeight;
                        let bodyWidth = body.clientWidth;
                        if (!bodyHeight || !bodyWidth) return;

                        let otherHeight = 0;
                        let children = body.children;
                        for (let i = 0; i < children.length; i++) {
                            let child = children[i];
                            if (child === canvas) continue;
                            if (child.contains && child.contains(canvas)) {
                                continue;
                            }
                            otherHeight += child.offsetHeight + 2;
                        }

                        let previewTextAndBtn = 0;
                        let canvasParent = canvas.parentElement;
                        if (canvasParent) {
                            let siblings = canvasParent.children;
                            for (let i = 0; i < siblings.length; i++) {
                                if (siblings[i] !== canvas) {
                                    previewTextAndBtn += siblings[i].offsetHeight + 2;
                                }
                            }
                        }

                        let available = bodyHeight - otherHeight - previewTextAndBtn - 16;
                        let maxByWidth = bodyWidth - 24;
                        let size = Math.max(64, Math.min(available, maxByWidth, 400));
                        canvas.style.width = size + 'px';
                        canvas.style.height = size + 'px';
                        this.refreshPreview();
                    });
                },
                browseFolder() {
                    if (!isApp) return;
                    let dlg = _getDialog();
                    if (!dlg) return;
                    let result = dlg.showOpenDialogSync({ properties: ['openDirectory'], title: 'Select Output Folder' });
                    if (result && result[0]) {
                        this.output_folder = result[0];
                        saveExportPrefs(this.getFormData());
                    }
                },
                doExport() {
                    if (!Format || !Project || !Project.elements || Project.elements.length === 0) {
                        Blockbench.showMessageBox({ title: 'No Model', message: 'Please load a model first before exporting an icon.', icon: 'warning' });
                        return;
                    }
                    let formData = this.getFormData();
                    saveExportPrefs(formData);
                    generateIcon(formData, null, false);
                },
                initPreview() {
                    let mainPreview = Preview.selected;
                    if (!mainPreview) return;

                    try {
                        this.panelPreviewIsolated = new Preview({
                            id: 'menu_icon_exporter_panel_live_' + Date.now(),
                            antialias: true,
                            offscreen: true
                        });
                    } catch (e) {
                        this.panelPreviewIsolated = null;
                        return;
                    }

                    if (Preview.selected !== mainPreview) {
                        mainPreview.select();
                    }

                    if (typeof this.panelPreviewIsolated.resize === 'function') {
                        this.panelPreviewIsolated.resize(1024, 1024);
                    } else if (this.panelPreviewIsolated.canvas) {
                        this.panelPreviewIsolated.canvas.width = 1024;
                        this.panelPreviewIsolated.canvas.height = 1024;
                    }

                    if (typeof this.panelPreviewIsolated.setProjectionMode === 'function' && typeof mainPreview.isOrtho === 'boolean') {
                        this.panelPreviewIsolated.setProjectionMode(mainPreview.isOrtho);
                    }
                    if (mainPreview.camera && typeof this.panelPreviewIsolated.setFOV === 'function' && mainPreview.camera.fov) {
                        this.panelPreviewIsolated.setFOV(mainPreview.camera.fov);
                    }
                    if (this.panelPreviewIsolated.camera && this.panelPreviewIsolated.camera.isPerspectiveCamera) {
                        this.panelPreviewIsolated.camera.aspect = 1;
                        if (this.panelPreviewIsolated.camera.updateProjectionMatrix) this.panelPreviewIsolated.camera.updateProjectionMatrix();
                    }

                    let initialState = captureCameraState(mainPreview);
                    if (initialState) applyCameraState(initialState, this.panelPreviewIsolated);
                    if (typeof this.panelPreviewIsolated.render === 'function') this.panelPreviewIsolated.render();

                    this.captureBaseCamera();
                    this.panelDefaultFramedState = captureCameraState(this.panelPreviewIsolated);
                    this.applyCameraFromState();
                    this.refreshPreview();
                },
                disposePreview() {
                    if (this.panelPreviewIsolated) {
                        try { this.panelPreviewIsolated.delete(); } catch (e) {}
                        this.panelPreviewIsolated = null;
                    }
                }
            },
            mounted() {
                iconExporterPanelVue = this;
                this._mieResizeHandler = () => {
                    applyResponsivePanelFill();
                    if (iconExporterPanelVue) iconExporterPanelVue.layoutPanel();
                };
                window.addEventListener('resize', this._mieResizeHandler, true);
                this.$nextTick(() => {
                    this.initPreview();
                    applyResponsivePanelFill();
                    setTimeout(() => { applyResponsivePanelFill(); this.layoutPanel(); }, 50);
                    setTimeout(() => { applyResponsivePanelFill(); this.layoutPanel(); }, 200);
                    setTimeout(() => this.layoutPanel(), 500);
                });
            },
            beforeDestroy() {
                if (this._mieResizeHandler) {
                    window.removeEventListener('resize', this._mieResizeHandler, true);
                    this._mieResizeHandler = null;
                }
                this.disposePreview();
                iconExporterPanelVue = null;
            }
        }
    });

    setTimeout(() => {
        let panel = getIconExporterPanel();
        if (panel) {
            if (panel.folded !== undefined) panel.folded = false;
            movePanelToSlot(targetSlot);
            applyResponsivePanelFill();
        }
    }, 100);
    setTimeout(() => {
        movePanelToSlot(targetSlot);
        applyResponsivePanelFill();
    }, 300);
    setTimeout(applyResponsivePanelFill, 500);
}

// =========================
// Preview and camera utilities
// =========================
function getToolbarIconDataUrl() {
    if (cachedToolbarIconDataUrl) {
        return cachedToolbarIconDataUrl;
    }

    if (isBlockbench5OrNewer()) {
        return null;
    }

    let iconPath = getPluginRuntimeIconPath();
    if (!iconPath || typeof iconPath !== 'string' || iconPath.startsWith('http')) {
        return null;
    }

    let cleanPath = iconPath.split('?')[0];
    let fsModule = getNativeModule('fs');
    if (!fsModule || !fsModule.existsSync(cleanPath)) {
        return null;
    }

    let mimeType = cleanPath.toLowerCase().endsWith('.svg') ? 'image/svg+xml' : 'image/png';
    let encoded = fsModule.readFileSync(cleanPath).toString('base64');
    cachedToolbarIconDataUrl = `data:${mimeType};base64,${encoded}`;
    return cachedToolbarIconDataUrl;
}

function readBlobAsDataUrl(blob) {
    return new Promise((resolve) => {
        if (typeof FileReader === 'undefined' || !blob) {
            resolve(null);
            return;
        }
        let reader = new FileReader();
        reader.onload = function() {
            resolve(typeof reader.result === 'string' ? reader.result : null);
        };
        reader.onerror = function() {
            resolve(null);
        };
        try {
            reader.readAsDataURL(blob);
        } catch (error) {
            resolve(null);
        }
    });
}

function getToolbarIconDataUrlAsync() {
    if (cachedToolbarIconDataUrl) {
        return Promise.resolve(cachedToolbarIconDataUrl);
    }
    if (toolbarIconDataUrlPromise) {
        return toolbarIconDataUrlPromise;
    }

    let syncIcon = getToolbarIconDataUrl();
    if (syncIcon) {
        return Promise.resolve(syncIcon);
    }

    let iconPath = getPluginRuntimeIconPath();
    if (!iconPath || typeof iconPath !== 'string' || !/^https?:\/\//i.test(iconPath) || typeof fetch !== 'function') {
        return Promise.resolve(null);
    }

    toolbarIconDataUrlPromise = fetch(iconPath, {cache: 'no-store'})
        .then(response => {
            if (!response || !response.ok || typeof response.blob !== 'function') {
                return null;
            }
            return response.blob();
        })
        .then(blob => readBlobAsDataUrl(blob))
        .then(dataUrl => {
            if (typeof dataUrl === 'string' && dataUrl.startsWith('data:image/')) {
                cachedToolbarIconDataUrl = dataUrl;
                return dataUrl;
            }
            return null;
        })
        .catch(() => null)
        .finally(() => {
            toolbarIconDataUrlPromise = null;
        });

    return toolbarIconDataUrlPromise;
}

function applyToolbarActionIcon(action) {
    if (!action || typeof action.setIcon !== 'function') {
        return;
    }

    let syncIcon = getToolbarIconDataUrl();
    if (syncIcon) {
        action.setIcon(syncIcon);
        return;
    }

    getToolbarIconDataUrlAsync().then(dataUrl => {
        if (dataUrl) {
            action.setIcon(dataUrl);
        }
    });
}

function getPluginRuntimeIconPath() {
    if (typeof Plugins === 'undefined' || !Plugins || !Array.isArray(Plugins.all)) {
        return null;
    }

    let pluginInstance = Plugins.all.find(plugin => plugin && plugin.id === 'menu_icon_exporter');
    if (!pluginInstance || typeof pluginInstance.getIcon !== 'function') {
        return null;
    }

    let iconPath = pluginInstance.getIcon();
    if (!iconPath || typeof iconPath !== 'string') {
        return null;
    }

    if (!/^https?:\/\//i.test(iconPath) && typeof pluginInstance.path === 'string' && /^https?:\/\//i.test(pluginInstance.path)) {
        try {
            iconPath = new URL(iconPath, pluginInstance.path).toString();
        } catch (error) {
        }
    }

    return iconPath;
}

function getSelectedPreview() {
    if (typeof Preview === 'undefined') return null;
    return Preview.selected || null;
}

function getActiveCameraPreview() {
    return isolatedDialogPreview || getSelectedPreview();
}

function disposeIsolatedDialogPreview() {
    if (!isolatedDialogPreview) return;
    try {
        isolatedDialogPreview.delete();
    } catch (error) {
    }
    isolatedDialogPreview = null;
}

function getCurrentPreviewTarget(camera, previewRef = null) {
    let preview = previewRef || getSelectedPreview();
    if (preview && preview.controls && preview.controls.target) {
        return preview.controls.target.clone();
    }
    let direction = new THREE.Vector3(0, 0, -1);
    if (typeof camera.getWorldDirection === 'function') {
        camera.getWorldDirection(direction);
    }
    return camera.position.clone().add(direction.multiplyScalar(16));
}

function captureCameraState(previewRef = null) {
    let preview = previewRef || getSelectedPreview();
    if (!preview || !preview.camera) {
        return null;
    }
    let camera = preview.camera;
    return {
        position: camera.position.clone(),
        target: getCurrentPreviewTarget(camera, preview),
        up: WORLD_UP.clone()
    };
}

function cloneCameraState(state) {
    if (!state) return null;
    return {
        position: state.position.clone(),
        target: state.target.clone(),
        up: state.up.clone()
    };
}

function applyCameraState(state, previewRef = null) {
    let preview = previewRef || getSelectedPreview();
    if (!state || !preview || !preview.camera) {
        return;
    }
    let camera = preview.camera;
    camera.position.copy(state.position);
    camera.up.copy(state.up);
    if (preview.controls && preview.controls.target) {
        preview.controls.target.copy(state.target);
    }
    camera.lookAt(state.target);
    if (camera.updateProjectionMatrix) {
        camera.updateProjectionMatrix();
    }
    if (preview.controls && preview.controls.update) {
        preview.controls.update();
    }
    if (typeof preview.render === 'function') {
        preview.render();
    }
}

function flattenCameraUp(previewRef = null) {
    let preview = previewRef || getSelectedPreview();
    if (!preview || !preview.camera) {
        return;
    }
    let camera = preview.camera;
    let target = getCurrentPreviewTarget(camera, preview);
    camera.up.copy(WORLD_UP);
    if (preview.controls && preview.controls.target) {
        preview.controls.target.copy(target);
    }
    camera.lookAt(target);
    if (camera.updateProjectionMatrix) {
        camera.updateProjectionMatrix();
    }
    if (preview.controls && preview.controls.update) {
        preview.controls.update();
    }
    if (typeof preview.render === 'function') {
        preview.render();
    }
}

function createIsolatedDialogPreview() {
    disposeIsolatedDialogPreview();
    let selectedPreview = getSelectedPreview();
    if (!selectedPreview) return null;
    try {
        isolatedDialogPreview = new Preview({
            id: `menu_icon_exporter_live_${Date.now()}`,
            antialias: true,
            offscreen: true
        });
    } catch (error) {
        isolatedDialogPreview = null;
        return null;
    }

    if (typeof isolatedDialogPreview.resize === 'function') {
        isolatedDialogPreview.resize(1024, 1024);
    } else if (isolatedDialogPreview.canvas) {
        isolatedDialogPreview.canvas.width = 1024;
        isolatedDialogPreview.canvas.height = 1024;
    }

    if (typeof isolatedDialogPreview.setProjectionMode === 'function' && typeof selectedPreview.isOrtho === 'boolean') {
        isolatedDialogPreview.setProjectionMode(selectedPreview.isOrtho);
    }

    if (selectedPreview.camera && typeof isolatedDialogPreview.setFOV === 'function' && selectedPreview.camera.fov) {
        isolatedDialogPreview.setFOV(selectedPreview.camera.fov);
    }

    if (isolatedDialogPreview.camera && isolatedDialogPreview.camera.isPerspectiveCamera) {
        isolatedDialogPreview.camera.aspect = 1;
        if (isolatedDialogPreview.camera.updateProjectionMatrix) {
            isolatedDialogPreview.camera.updateProjectionMatrix();
        }
    }

    let initialState = captureCameraState(selectedPreview);
    if (initialState) {
        applyCameraState(initialState, isolatedDialogPreview);
    }
    if (typeof isolatedDialogPreview.render === 'function') {
        isolatedDialogPreview.render();
    }
    return isolatedDialogPreview;
}

function clearDialogCameraState() {
    dialogCameraRestoreState = null;
    dialogDefaultFramedCameraState = null;
}

function restoreDialogCameraState() {
    if (!dialogCameraRestoreState) return;
    applyCameraState(dialogCameraRestoreState);
    dialogCameraRestoreState = null;
}

// =========================
// Dialog geometry helpers
// =========================
function clampNumber(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function getDialogElement(dialog) {
    if (!dialog) return null;
    return dialog.object || null;
}

function getDialogReferenceBox(dialogEl) {
    if (!dialogEl) return null;
    return dialogEl.querySelector('.dialog_content') || dialogEl;
}

function getElementRectSafe(element) {
    if (!element || !element.isConnected) return null;
    return element.getBoundingClientRect();
}

function getNumericStyleValue(element, propertyName) {
    if (!element) return 0;
    let computed = window.getComputedStyle(element);
    let value = parseFloat(computed.getPropertyValue(propertyName));
    return Number.isFinite(value) ? value : 0;
}

function getDialogViewportBox(dialogEl) {
    if (!dialogEl) return null;

    let content = dialogEl.querySelector('.dialog_content') || dialogEl;
    let rect = getElementRectSafe(content);
    if (!rect) return null;

    let paddingTop = getNumericStyleValue(content, 'padding-top');
    let paddingRight = getNumericStyleValue(content, 'padding-right');
    let paddingBottom = getNumericStyleValue(content, 'padding-bottom');
    let paddingLeft = getNumericStyleValue(content, 'padding-left');

    return {
        element: content,
        rect,
        innerTop: rect.top + paddingTop,
        innerRight: rect.right - paddingRight,
        innerBottom: rect.bottom - paddingBottom,
        innerLeft: rect.left + paddingLeft,
        innerWidth: Math.max(0, rect.width - paddingLeft - paddingRight),
        innerHeight: Math.max(0, rect.height - paddingTop - paddingBottom)
    };
}


// =========================
// Dialog normalization
// =========================
function normalizeDialogInnerWidth(dialog, selector, options = {}) {
    let dialogEl = getDialogElement(dialog);
    if (!dialogEl) return;

    let target = dialogEl.querySelector(selector);
    if (!target) return;

    let {
        minWidth = 200,
        maxPasses = 4,
        tolerance = 1,
        mode = 'balance',
        debug = false
    } = options;

    let pass = 0;

    function log(...args) {
        if (debug) {
            console.log('[normalizeDialogInnerWidth]', ...args);
        }
    }

    function measureAndApply() {
        let refBox = getDialogReferenceBox(dialogEl);
        if (!refBox || !target.isConnected) return;

        let refRect = refBox.getBoundingClientRect();
        let targetRect = target.getBoundingClientRect();

        let leftGap = targetRect.left - refRect.left;
        let rightGap = refRect.right - targetRect.right;

        log('pass', pass + 1, {
            leftGap,
            rightGap,
            targetWidth: targetRect.width,
            refWidth: refRect.width
        });

        let shrinkAmount = 0;

        if (mode === 'balance') {
            shrinkAmount = leftGap - rightGap;
        } else if (mode === 'contain') {
            if (targetRect.right > refRect.right) {
                shrinkAmount = targetRect.right - refRect.right;
            }
        } else if (typeof mode === 'function') {
            shrinkAmount = Number(mode({
                dialog,
                dialogEl,
                target,
                refRect,
                targetRect,
                leftGap,
                rightGap
            })) || 0;
        }

        if (shrinkAmount > tolerance) {
            let newWidth = clampNumber(targetRect.width - shrinkAmount, minWidth, refRect.width);
            target.style.setProperty('width', `${newWidth}px`, 'important');
            target.style.setProperty('max-width', `${newWidth}px`, 'important');
            log('applied width', newWidth);

            pass++;
            if (pass < maxPasses) {
                requestAnimationFrame(measureAndApply);
            }
        } else {
            log('no adjustment needed');
        }
    }

    requestAnimationFrame(measureAndApply);
}

function clearNormalizedDialogInnerWidth(dialog, selector) {
    let dialogEl = getDialogElement(dialog);
    if (!dialogEl) return;

    let target = dialogEl.querySelector(selector);
    if (!target) return;

    target.style.removeProperty('width');
    target.style.removeProperty('max-width');
}

function normalizeDialogInnerHeight(dialog, selector, options = {}) {
    let dialogEl = getDialogElement(dialog);
    if (!dialogEl) return;

    let target = dialogEl.querySelector(selector);
    if (!target) return;

    let {
        minHeight = 120,
        maxPasses = 4,
        tolerance = 1,
        mode = 'contain',
        debug = false
    } = options;

    let pass = 0;

    function log(...args) {
        if (debug) {
            console.log('[normalizeDialogInnerHeight]', ...args);
        }
    }

    function measureAndApply() {
        if (!target.isConnected) return;

        let viewport = getDialogViewportBox(dialogEl);
        let targetRect = getElementRectSafe(target);
        if (!viewport || !targetRect) return;

        let topGap = targetRect.top - viewport.innerTop;
        let bottomGap = viewport.innerBottom - targetRect.bottom;

        log('pass', pass + 1, {
            topGap,
            bottomGap,
            targetHeight: targetRect.height,
            viewportHeight: viewport.innerHeight
        });

        let shrinkAmount = 0;

        if (mode === 'balance') {
            shrinkAmount = topGap - bottomGap;
        } else if (mode === 'contain') {
            if (targetRect.bottom > viewport.innerBottom) {
                shrinkAmount = targetRect.bottom - viewport.innerBottom;
            }
        } else if (typeof mode === 'function') {
            shrinkAmount = Number(mode({
                dialog,
                dialogEl,
                target,
                viewport,
                targetRect,
                topGap,
                bottomGap
            })) || 0;
        }

        if (shrinkAmount > tolerance) {
            let newHeight = clampNumber(targetRect.height - shrinkAmount, minHeight, viewport.innerHeight);
            target.style.setProperty('height', `${newHeight}px`, 'important');
            target.style.setProperty('max-height', `${newHeight}px`, 'important');
            target.style.setProperty('overflow', 'auto', 'important');
            log('applied height', newHeight);

            pass++;
            if (pass < maxPasses) {
                requestAnimationFrame(measureAndApply);
            }
        } else {
            log('no adjustment needed');
        }
    }

    requestAnimationFrame(measureAndApply);
}

function clearNormalizedDialogInnerHeight(dialog, selector) {
    let dialogEl = getDialogElement(dialog);
    if (!dialogEl) return;

    let target = dialogEl.querySelector(selector);
    if (!target) return;

    target.style.removeProperty('height');
    target.style.removeProperty('max-height');
    target.style.removeProperty('overflow');
}

function normalizeDialogInnerSize(dialog, selector, options = {}) {
    let {
        width = null,
        height = null
    } = options;

    if (width) {
        normalizeDialogInnerWidth(dialog, selector, width);
    }
    if (height) {
        normalizeDialogInnerHeight(dialog, selector, height);
    }
}

function clearNormalizedDialogInnerSize(dialog, selector) {
    clearNormalizedDialogInnerWidth(dialog, selector);
    clearNormalizedDialogInnerHeight(dialog, selector);
}


function syncConditionalBars(dialog) {
    if (!dialog || !dialog.object) return;
    let formResult = {};
    try { formResult = dialog.getFormResult(); } catch (e) { return; }
    let csBar = dialog.object.querySelector('.form_bar_custom_size');
    if (csBar) csBar.classList.toggle('mie_show', formResult.icon_size === 'custom');
    let ccBar = dialog.object.querySelector('.form_bar_custom_color');
    if (ccBar) ccBar.classList.toggle('mie_show', formResult.background === 'custom');
}

function alignAutoFrameWithZoom(dialog) {
    if (!dialog || !dialog.object) return;
    let zoomInput = dialog.object.querySelector('.form_bar_zoom_level input[type="range"]');
    let autoBar = dialog.object.querySelector('.form_bar_auto_frame');
    let autoCheckbox = dialog.object.querySelector('.form_bar_auto_frame input[type="checkbox"]');
    if (!zoomInput || !autoBar || !autoCheckbox) return;
    autoCheckbox.style.removeProperty('transform');
    let zoomRect = zoomInput.getBoundingClientRect();
    let autoBarRect = autoBar.getBoundingClientRect();
    let checkRect = autoCheckbox.getBoundingClientRect();
    let deltaX = zoomRect.left - checkRect.left;
    let zoomCenterY = autoBarRect.top + autoBarRect.height / 2;
    let checkCenterY = checkRect.top + checkRect.height / 2;
    let deltaY = (zoomCenterY - checkCenterY) - 14;
    if (!isFinite(deltaX) || !isFinite(deltaY)) return;
    deltaX = clampNumber(Math.round(deltaX), -120, 120);
    deltaY = clampNumber(Math.round(deltaY), -24, 24);
    autoCheckbox.style.setProperty('transform', `translate(${deltaX}px, ${deltaY}px)`);
}

// =========================
// Plugin-specific wrappers
// =========================
function normalizeIconExporterDialog(dialog) {
    normalizeDialogInnerSize(dialog, '.icon_exporter_layout_container', {
        width: {
            minWidth: 320,
            maxPasses: 5,
            tolerance: 1,
            mode: 'balance'
        },
        height: {
            minHeight: 220,
            maxPasses: 4,
            tolerance: 1,
            mode: 'contain'
        }
    });
}

function clearNormalizedIconExporterDialog(dialog) {
    clearNormalizedDialogInnerSize(dialog, '.icon_exporter_layout_container');
}

// =========================
// Dialog layout and lifecycle
// =========================
function applyDialogBottomLayout(dialog, bottomContainer = null) {
    if (!dialog || !dialog.object) return;
    let targetContainer = bottomContainer || dialog.object.querySelector('.export_bottom_section');
    if (!targetContainer) return;
    function moveToBottomSection(settingKey) {
        let formNode = dialog.object.querySelector(`.form_bar_${settingKey}`);
        if (!formNode) {
            let settingNode = dialog.object.querySelector(`[data-setting="${settingKey}"]`);
            if (settingNode) {
                formNode = settingNode.closest('.form_element') || settingNode.closest('.form_bar') || settingNode.closest('.form_group') || settingNode;
            }
        }
        if (!formNode || !formNode.parentNode) return;
        if (formNode.parentNode !== targetContainer) {
            targetContainer.appendChild(formNode);
        }
    }
    moveToBottomSection('icon_size');
    moveToBottomSection('custom_size');
    moveToBottomSection('background');
    moveToBottomSection('custom_color');
    moveToBottomSection('quality');
    moveToBottomSection('save_mode');
    moveToBottomSection('output_folder');
    moveToBottomSection('filename');
}

function openIconExporterDialog() {
    if (!Format || !Project || !Project.elements || Project.elements.length === 0) {
        Blockbench.showMessageBox({
            title: 'No Model',
            message: 'Please load a model first before exporting an icon.',
            icon: 'warning'
        });
        return;
    }

    dialogCameraRestoreState = captureCameraState();
    dialogDefaultFramedCameraState = null;
    createIsolatedDialogPreview();
    if (isolatedDialogPreview) {
        dialogDefaultFramedCameraState = captureCameraState(isolatedDialogPreview);
    }
    let previewSize = 256;
    activeResetButton = null;
    baseCameraPosition = null;
    baseCameraTarget = null;
    baseCameraUp = null;
    lastAutoFrameState = true;
    lastCameraValues = { zoom_level: 1.0, rotate_x: 0, rotate_y: 0, rotate_z: 0, pan_x: 0, pan_y: 0 };
    let outputPrefs = loadExportPrefs();
    let bottomMetaSection = null;
    let previewCanvas = document.createElement('canvas');
    previewCanvas.id = 'live_icon_preview_canvas';
    previewCanvas.width = previewSize;
    previewCanvas.height = previewSize;
    previewCanvas.style.display = 'block';
    previewCanvas.style.border = '1px solid rgba(255, 255, 255, 0.12)';
    previewCanvas.style.borderRadius = '10px';

    let previewSection = Interface.createElement('div', {
        class: 'preview_section',
        style: 'text-align: center;'
    }, [
        Interface.createElement('h3', {
            class: 'preview_title',
            style: 'margin: 0 0 12px 0; color: var(--color-text);'
        }, 'Live Preview'),
        previewCanvas,
        Interface.createElement('div', {
            id: 'preview_info_text',
            style: 'margin-top: 10px; color: var(--color-subtle_text); font-size: 12px; letter-spacing: 0.2px;'
        }, '64×64 pixels')
    ]);

    let dialog = new Dialog({
        id: 'icon_exporter_dialog',
        title: 'Menu Icon Exporter',
        width: 1120,
        form: {
            layout_wrapper: {
                type: 'info',
                text: ''
            },
            
            settings_column: {
                type: 'info',
                text: getFormatSpecificInfo()
            },
            
            icon_size: {
                label: 'Icon Size',
                type: 'select',
                options: {
                    '16': '16×16 - Tiny (UI elements)',
                    '32': '32×32 - Small (inventory icons)',
                    '48': '48×48 - Medium (item icons)',
                    '64': '64×64 - Large (block icons)',
                    '128': '128×128 - Extra Large (detailed icons)',
                    'custom': 'Custom Size...'
                },
                value: outputPrefs.icon_size || getRecommendedSize(),
                onChange(formResult) {
                    updateLivePreview(dialog, formResult);
                }
            },
            
            custom_size: {
                label: 'Custom Size (pixels)',
                type: 'number',
                value: outputPrefs.custom_size,
                min: 8,
                max: 512,
                onChange(formResult) {
                    updateLivePreview(dialog, formResult);
                }
            },
            
            background: {
                label: 'Background',
                type: 'select',
                options: {
                    'transparent': 'Transparent',
                    'white': 'White (#FFFFFF)',
                    'black': 'Black (#000000)',
                    'gray': 'Gray (#808080)',
                    'custom': 'Custom Color'
                },
                value: outputPrefs.background,
                description: 'Background color for the exported icon',
                onChange(formResult) {
                    updateLivePreview(dialog, formResult);
                }
            },
            
            custom_color: {
                label: 'Custom Background Color',
                type: 'color',
                value: outputPrefs.custom_color,
                description: 'Pick any color from the gradient spectrum'
            },
            

            
            auto_frame: {
                label: 'Auto-frame Model',
                type: 'checkbox',
                value: true,
                description: 'Automatically center and zoom to fit the model perfectly'
            },
            
            zoom_level: {
                label: 'Zoom Level',
                type: 'range',
                min: 0.5,
                max: 3.0,
                step: 0.1,
                value: 1.0,
                description: 'Manually adjust zoom (0.5 = close, 3.0 = far)'
            },
            
                        rotate_x: {
                label: 'X-Axis Rotation',
                type: 'range',
                min: -180,
                max: 180,
                step: 5,
                value: 0,
                description: 'Rotate model around X-axis'
            },
            
            rotate_y: {
                label: 'Y-Axis Rotation',
                type: 'range',
                min: -180,
                max: 180,
                step: 5,
                value: 0,
                description: 'Rotate model around Y-axis'
            },
            
            rotate_z: {
                label: 'Z-Axis Rotation',
                type: 'range',
                min: -180,
                max: 180,
                step: 5,
                value: 0,
                description: 'Rotate model around Z-axis'
            },
            
            pan_x: {
                label: 'Pan Left/Right',
                type: 'range',
                min: -50,
                max: 50,
                step: 1,
                value: 0,
                description: 'Pan view horizontally in orthographic mode'
            },
            
            pan_y: {
                label: 'Pan Up/Down',
                type: 'range',
                min: -50,
                max: 50,
                step: 1,
                value: 0,
                description: 'Pan view vertically in orthographic mode'
            },
            

            
            quality: {
                label: 'Export Quality',
                type: 'select',
                options: {
                    'standard': 'Standard (4x render)',
                    'high': 'High Quality (8x render)',
                    'ultra': 'Ultra Quality (16x render)'
                },
                value: outputPrefs.quality,
                description: 'Higher quality takes longer but produces sharper icons'
            },

            save_mode: {
                label: 'Save Mode',
                type: 'select',
                options: canUseAppFileSystem() ? {
                    'ask_dialog': 'Ask every export',
                    'auto_folder': 'Auto-save to folder'
                } : {
                    'ask_dialog': 'Ask every export'
                },
                value: outputPrefs.save_mode,
                description: 'Choose whether to use the save dialog or save directly'
            },

            output_folder: {
                label: 'Output Folder',
                type: 'folder',
                value: outputPrefs.output_folder,
                condition: (formResult) => formResult.save_mode === 'auto_folder',
                description: 'Used when Save Mode is set to Auto-save to folder'
            },
            
            filename: {
                label: 'Filename (without .png)',
                type: 'text',
                value: function() {
                    let name = Project.name || 'model';
                    name = name.replace(/\.geo\.json$/i, '').replace(/\.geo$/i, '');
                    name = name.replace(/\.[^.]+$/, '');
                    name = name.replace(/[^a-zA-Z0-9_-]/g, '_');
                    return name + '_icon';
                }()
            }
        },
        
        buttons: ['dialog.confirm', 'dialog.cancel'],
        
        onConfirm(formData) {
            stopCameraWatcher();
            activeResetButton = null;
            clearNormalizedIconExporterDialog(dialog);
            let resolvedFormData = resolveFormData(dialog, formData);
            saveExportPrefs(resolvedFormData);
            let restoreState = cloneCameraState(dialogCameraRestoreState);
            generateIcon(resolvedFormData, restoreState, true);
            return true;
        },
        
        onCancel() {
            stopCameraWatcher();
            activeResetButton = null;
            clearNormalizedIconExporterDialog(dialog);
            restoreDialogCameraState();
            disposeIsolatedDialogPreview();
            clearDialogCameraState();
            return true;
        },

        onFormChange(formData) {
            syncConditionalBars(dialog);
            let resolvedFormData = resolveFormData(dialog, dialog.getFormResult());
            saveExportPrefs(resolvedFormData);
            applyDialogBottomLayout(dialog, bottomMetaSection);
            handleFormCameraChange(dialog, resolvedFormData);
            requestAnimationFrame(() => {
                normalizeIconExporterDialog(dialog);
                requestAnimationFrame(() => {
                    alignAutoFrameWithZoom(dialog);
                });
            });
        }
    });

    let preLayoutHideStyle = document.getElementById('menu_icon_exporter_dialog_prehide');
    if (preLayoutHideStyle) {
        preLayoutHideStyle.remove();
    }
    preLayoutHideStyle = document.createElement('style');
    preLayoutHideStyle.id = 'menu_icon_exporter_dialog_prehide';
    preLayoutHideStyle.textContent = '#icon_exporter_dialog { opacity: 0 !important; }';
    document.head.appendChild(preLayoutHideStyle);

    dialog.show();

    setTimeout(() => {
        try {
            let existingStyle = document.getElementById('menu_icon_exporter_dialog_style');
            if (existingStyle) {
                existingStyle.remove();
            }
            let style = document.createElement('style');
            style.id = 'menu_icon_exporter_dialog_style';
            style.textContent = `
                #icon_exporter_dialog .form_bar.form_bar_custom_size:not(.mie_show) { display: none !important; }
                #icon_exporter_dialog .export_bottom_section .form_bar.form_bar_custom_size:not(.mie_show) { display: none !important; }
                #icon_exporter_dialog .form_bar.form_bar_custom_color:not(.mie_show) { display: none !important; }
                #icon_exporter_dialog .export_bottom_section .form_bar.form_bar_custom_color:not(.mie_show) { display: none !important; }
                #icon_exporter_dialog,
                #icon_exporter_dialog .dialog_content,
                #icon_exporter_dialog .form_wrapper,
                #icon_exporter_dialog .form {
                    box-sizing: border-box !important;
                    max-width: 100% !important;
                }
                #icon_exporter_dialog .dialog_content {
                    padding: 10px 12px !important;
                    box-sizing: border-box !important;
                }
                #icon_exporter_dialog .icon_exporter_layout_container {
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 10px !important;
                    box-sizing: border-box !important;
                    padding: 0 !important;
                    overflow: hidden !important;
                }
                #icon_exporter_dialog .icon_exporter_top_section {
                    display: flex !important;
                    flex-direction: row !important;
                    align-items: flex-start !important;
                    gap: 14px !important;
                    width: 100% !important;
                    min-width: 0 !important;
                    box-sizing: border-box !important;
                }
                #icon_exporter_dialog .icon_exporter_left_column {
                    flex: 1 1 0 !important;
                    min-width: 0 !important;
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 4px !important;
                    box-sizing: border-box !important;
                    overflow: hidden !important;
                }
                #icon_exporter_dialog .form_part,
                #icon_exporter_dialog .form_element:not(.preview_section),
                #icon_exporter_dialog .form_bar:not(.preview_section),
                #icon_exporter_dialog .form_group:not(.preview_section) {
                    box-sizing: border-box !important;
                    border-radius: 10px !important;
                    background: rgba(255, 255, 255, 0.02) !important;
                    border: 1px solid rgba(255, 255, 255, 0.06) !important;
                    padding: 5px 9px !important;
                    margin: 0 !important;
                    width: 100% !important;
                    min-width: 0 !important;
                }
                #icon_exporter_dialog .icon_exporter_left_column .form_bar.form_bar_auto_frame {
                    display: flex !important;
                    flex-flow: row nowrap !important;
                    align-items: center !important;
                }
                #icon_exporter_dialog .icon_exporter_left_column .form_bar.form_bar_auto_frame > label.name_space_left {
                    float: none !important;
                    flex: 0 0 auto !important;
                    width: var(--max_label_width, 180px) !important;
                    box-sizing: content-box !important;
                }
                #icon_exporter_dialog .icon_exporter_left_column .form_bar.form_bar_auto_frame > input[type="checkbox"] {
                    flex: 0 0 auto !important;
                }
                #icon_exporter_dialog .icon_exporter_left_column .form_bar.form_bar_auto_frame > .dialog_form_description {
                    flex: 0 0 auto !important;
                    margin-left: auto !important;
                    padding-top: 0 !important;
                    height: auto !important;
                    align-self: center !important;
                }
                #icon_exporter_dialog .preview_section {
                    flex: 0 0 300px !important;
                    width: 300px !important;
                    box-sizing: border-box !important;
                    background: rgba(255, 255, 255, 0.02) !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    border-radius: 12px !important;
                    padding: 10px !important;
                    margin: 0 !important;
                }
                #icon_exporter_dialog .preview_section canvas,
                #icon_exporter_dialog #live_icon_preview_canvas {
                    display: block !important;
                    width: 100% !important;
                    height: auto !important;
                    margin: 0 auto !important;
                    box-sizing: border-box !important;
                }
                #icon_exporter_dialog .export_bottom_section {
                    width: 100% !important;
                    min-width: 0 !important;
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 4px !important;
                    box-sizing: border-box !important;
                    margin: 0 !important;
                    overflow: hidden !important;
                }
                #icon_exporter_dialog .export_bottom_section .form_part,
                #icon_exporter_dialog .export_bottom_section .form_element,
                #icon_exporter_dialog .export_bottom_section .form_bar,
                #icon_exporter_dialog .export_bottom_section .form_group {
                    margin: 0 !important;
                    width: 100% !important;
                    min-width: 0 !important;
                    box-sizing: border-box !important;
                }
                #icon_exporter_dialog .export_bottom_section .form_bar:not(.form_bar_output_folder) {
                    display: grid !important;
                    grid-template-columns: minmax(0, var(--max_label_width, 180px)) minmax(0, 1fr) auto !important;
                    align-items: center !important;
                    column-gap: 10px !important;
                }
                #icon_exporter_dialog .export_bottom_section .form_bar:not(.form_bar_output_folder) > .name_space_left {
                    grid-column: 1 !important;
                    min-width: 0 !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                }
                #icon_exporter_dialog .export_bottom_section .form_bar:not(.form_bar_output_folder) > .dialog_form_description {
                    grid-column: 3 !important;
                    justify-self: start !important;
                    margin-left: 4px !important;
                }
                #icon_exporter_dialog .export_bottom_section .form_bar:not(.form_bar_output_folder) select,
                #icon_exporter_dialog .export_bottom_section .form_bar:not(.form_bar_output_folder) input[type="text"],
                #icon_exporter_dialog .export_bottom_section .form_bar:not(.form_bar_output_folder) input[type="number"],
                #icon_exporter_dialog .export_bottom_section .form_bar:not(.form_bar_output_folder) .dark_bordered {
                    grid-column: 2 !important;
                    width: 100% !important;
                    min-width: 0 !important;
                    box-sizing: border-box !important;
                }
                
                #icon_exporter_dialog .export_bottom_section .form_bar_output_folder {
                    display: flex !important;
                    align-items: center !important;
                    gap: 6px !important;
                    min-width: 0 !important;
                }
                #icon_exporter_dialog .export_bottom_section .form_bar_output_folder > * {
                    flex: 0 0 auto !important;
                    align-self: center !important;
                    margin: 0 !important;
                }
                #icon_exporter_dialog .export_bottom_section .form_bar_output_folder > .name_space_left {
                    flex: 0 0 var(--max_label_width, 180px) !important;
                    min-width: 0 !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                }
                #icon_exporter_dialog .export_bottom_section .form_bar_output_folder > input,
                #icon_exporter_dialog .export_bottom_section .form_bar_output_folder > .input_wrapper {
                    flex: 1 1 0 !important;
                    min-width: 0 !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                }
                #icon_exporter_dialog .export_bottom_section .form_bar_output_folder input[type="text"],
                #icon_exporter_dialog .export_bottom_section .form_bar_output_folder .dark_bordered {
                    width: 100% !important;
                    min-width: 0 !important;
                    box-sizing: border-box !important;
                }
                #icon_exporter_dialog .dialog_form_description {
                    flex: 0 0 auto !important;
                    margin-right: 0 !important;
                }
                #icon_exporter_dialog .form_bar_layout_wrapper {
                    display: none !important;
                }
                #icon_exporter_dialog .preview_title {
                    font-size: 18px !important;
                    font-weight: 600 !important;
                    letter-spacing: 0.2px !important;
                }
                #icon_exporter_dialog .range_input_label {
                    min-width: 34px !important;
                    text-align: right !important;
                    font-variant-numeric: tabular-nums !important;
                    opacity: 0.9 !important;
                }
                #icon_exporter_dialog .form_element input[type="text"],
                #icon_exporter_dialog .form_element input[type="number"],
                #icon_exporter_dialog .form_element .dark_bordered,
                #icon_exporter_dialog .form_element select {
                    border-radius: 10px !important;
                }
                @media (max-width: 980px) {
                    #icon_exporter_dialog .icon_exporter_top_section {
                        flex-direction: column !important;
                    }
                    #icon_exporter_dialog .preview_section {
                        flex: 0 1 auto !important;
                        max-width: 100% !important;
                        min-width: 0 !important;
                    }
                }
            `;
            document.head.appendChild(style);

            let formContainer = dialog.object.querySelector('.form_wrapper') || 
                               dialog.object.querySelector('.dialog_content') ||
                               dialog.object.querySelector('form') ||
                               dialog.object.querySelector('.dialog_wrapper');

            if (formContainer) {
                formContainer.classList.add('icon_exporter_layout_container');

                let modeBar = document.createElement('div');
                modeBar.className = 'mie_dialog_mode_bar';
                modeBar.style.cssText = 'display:flex;gap:4px;margin-bottom:8px;';
                let floatBtn = document.createElement('div');
                floatBtn.textContent = 'Float';
                floatBtn.className = 'mie_mode_btn active';
                floatBtn.style.cssText = 'flex:1;padding:5px 4px;border:1px solid rgba(255,255,255,0.1);border-radius:6px;cursor:pointer;font-size:10px;font-weight:600;text-align:center;background:var(--color-accent);color:#fff;border-color:var(--color-accent);';
                let panelBtn = document.createElement('div');
                panelBtn.textContent = 'Panel';
                panelBtn.className = 'mie_mode_btn';
                panelBtn.style.cssText = 'flex:1;padding:5px 4px;border:1px solid rgba(255,255,255,0.1);border-radius:6px;cursor:pointer;font-size:10px;font-weight:600;text-align:center;background:rgba(255,255,255,0.04);color:var(--color-subtle_text);';
                panelBtn.addEventListener('click', () => { dialog.cancel(); switchToPanel(); });
                modeBar.appendChild(floatBtn);
                modeBar.appendChild(panelBtn);
                formContainer.appendChild(modeBar);

                let topSection = Interface.createElement('div', {
                    class: 'icon_exporter_top_section'
                });
                let leftColumn = Interface.createElement('div', {
                    class: 'icon_exporter_left_column'
                });
                previewSection.className = 'preview_section';

                let formElements = Array.from(
                    formContainer.querySelectorAll('.form_element, .form_bar, .form_group')
                );
                formElements.forEach(element => {
                    if (!element.classList.contains('preview_section')) {
                        element.classList.add('form_part');
                        leftColumn.appendChild(element);
                    }
                });

                topSection.appendChild(leftColumn);
                topSection.appendChild(previewSection);
                formContainer.appendChild(topSection);

                bottomMetaSection = Interface.createElement('div', {
                    class: 'export_bottom_section'
                });
                formContainer.appendChild(bottomMetaSection);
                applyDialogBottomLayout(dialog, bottomMetaSection);
                normalizeIconExporterDialog(dialog);
            } else {
                let dialogContent = dialog.object.querySelector('.dialog_content');
                if (dialogContent) {
                    dialogContent.classList.add('icon_exporter_layout_container');

                    let modeBar2 = document.createElement('div');
                    modeBar2.className = 'mie_dialog_mode_bar';
                    modeBar2.style.cssText = 'display:flex;gap:4px;margin-bottom:8px;';
                    let floatBtn2 = document.createElement('div');
                    floatBtn2.textContent = 'Float';
                    floatBtn2.style.cssText = 'flex:1;padding:5px 4px;border:1px solid rgba(255,255,255,0.1);border-radius:6px;cursor:pointer;font-size:10px;font-weight:600;text-align:center;background:var(--color-accent);color:#fff;border-color:var(--color-accent);';
                    let panelBtn2 = document.createElement('div');
                    panelBtn2.textContent = 'Panel';
                    panelBtn2.style.cssText = 'flex:1;padding:5px 4px;border:1px solid rgba(255,255,255,0.1);border-radius:6px;cursor:pointer;font-size:10px;font-weight:600;text-align:center;background:rgba(255,255,255,0.04);color:var(--color-subtle_text);';
                    panelBtn2.addEventListener('click', () => { dialog.cancel(); switchToPanel(); });
                    modeBar2.appendChild(floatBtn2);
                    modeBar2.appendChild(panelBtn2);
                    dialogContent.appendChild(modeBar2);

                    let topSection = Interface.createElement('div', {
                        class: 'icon_exporter_top_section'
                    });
                    let leftColumn = Interface.createElement('div', {
                        class: 'icon_exporter_left_column'
                    });
                    previewSection.className = 'preview_section';
                    let formElements = Array.from(
                        dialogContent.querySelectorAll('.form_element, .form_bar, .form_group')
                    );
                    formElements.forEach(element => {
                        if (!element.classList.contains('preview_section')) {
                            element.classList.add('form_part');
                            leftColumn.appendChild(element);
                        }
                    });
                    topSection.appendChild(leftColumn);
                    topSection.appendChild(previewSection);
                    dialogContent.appendChild(topSection);
                    bottomMetaSection = Interface.createElement('div', {
                        class: 'export_bottom_section'
                    });
                    dialogContent.appendChild(bottomMetaSection);
                    applyDialogBottomLayout(dialog, bottomMetaSection);
                    normalizeIconExporterDialog(dialog);
                }
            }

            (function fixFolderBrowseButton() {
                let folderBar = dialog.object.querySelector('.form_bar_output_folder');
                if (!folderBar) return;
                let inputWrapper = folderBar.querySelector('.input_wrapper');
                if (!inputWrapper) return;
                let folderIcon = inputWrapper.querySelector('i.material-icons');
                if (!folderIcon) return;
                folderBar.insertBefore(folderIcon, inputWrapper.nextSibling);
                folderIcon.style.cursor = 'pointer';
                folderIcon.addEventListener('click', function(e) {
                    e.stopPropagation();
                    inputWrapper.click();
                });
            })();

            let resetButton = document.createElement('button');
            resetButton.type = 'button';
            resetButton.textContent = 'Reset Camera to Auto-Frame';
            resetButton.style.cssText = 'margin: 8px 0 12px 0; padding: 8px 14px; background: linear-gradient(180deg, #4f95f7, #3e7ad6); color: white; border: 1px solid rgba(255,255,255,0.14); border-radius: 999px; font-size: 12px; font-weight: 600; letter-spacing: 0.2px; cursor: pointer;';
            resetButton.disabled = true;
            resetButton.style.opacity = '0.5';
            resetButton.style.cursor = 'not-allowed';
            activeResetButton = resetButton;
            resetButton.onclick = function(event) {
                if (event && typeof event.preventDefault === 'function') {
                    event.preventDefault();
                }
                if (event && typeof event.stopPropagation === 'function') {
                    event.stopPropagation();
                }
                stopCameraWatcher();
                let formData = resolveFormData(dialog, dialog.getFormResult());
                let resetValues = {
                    ...formData,
                    auto_frame: true,
                    zoom_level: 1.0,
                    rotate_x: 0,
                    rotate_y: 0,
                    rotate_z: 0,
                    pan_x: 0,
                    pan_y: 0
                };
                dialog.setFormValues(resetValues, false);
                syncRangeLabels(dialog, resetValues);
                let appliedValues = resolveFormData(dialog, resetValues);
                baseCameraPosition = null;
                baseCameraTarget = null;
                baseCameraUp = null;
                lastAutoFrameState = appliedValues.auto_frame;

                function finalizeReset() {
                    adjustCameraManually(appliedValues);
                    lastCameraValues = getCameraValues(appliedValues);
                    updateResetButtonState(appliedValues);
                    updateLivePreview(dialog, appliedValues);
                }

                if (dialogDefaultFramedCameraState) {
                    applyCameraState(cloneCameraState(dialogDefaultFramedCameraState), getActiveCameraPreview());
                    captureBaseCameraState();
                    finalizeReset();
                } else {
                    frameModelForIcon(appliedValues).then(() => {
                        dialogDefaultFramedCameraState = captureCameraState(getActiveCameraPreview());
                        finalizeReset();
                    });
                }
            };

            let panUpBar = dialog.object.querySelector('.form_bar_pan_y');
            let leftColumnContainer = panUpBar && panUpBar.parentNode ? panUpBar.parentNode : (
                dialog.object.querySelector('.form') || formContainer
            );
            if (leftColumnContainer) {
                let buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = 'margin: 15px 0; text-align: center;';
                buttonContainer.appendChild(resetButton);

                if (panUpBar) {
                    if (panUpBar.parentNode === leftColumnContainer && panUpBar.nextSibling) {
                        leftColumnContainer.insertBefore(buttonContainer, panUpBar.nextSibling);
                    } else {
                        leftColumnContainer.appendChild(buttonContainer);
                    }
                } else {
                    leftColumnContainer.appendChild(buttonContainer);
                }
            }
        } finally {
            requestAnimationFrame(() => {
                normalizeIconExporterDialog(dialog);
                syncConditionalBars(dialog);
                requestAnimationFrame(() => {
                    alignAutoFrameWithZoom(dialog);
                    if (preLayoutHideStyle && preLayoutHideStyle.parentNode) {
                        preLayoutHideStyle.parentNode.removeChild(preLayoutHideStyle);
                    }
                    if (dialog.object) {
                        dialog.object.style.opacity = '1';
                    }
                });
            });
        }

        (async () => {
            let formData = resolveFormData(dialog, dialog.getFormResult());
            if (formData.auto_frame) {
                if (isolatedDialogPreview && dialogDefaultFramedCameraState) {
                    applyCameraState(cloneCameraState(dialogDefaultFramedCameraState), isolatedDialogPreview);
                    captureBaseCameraState();
                } else {
                    await frameModelForIcon(formData);
                    dialogDefaultFramedCameraState = captureCameraState(getActiveCameraPreview());
                }
            }
            adjustCameraManually(formData);
            if (!dialogDefaultFramedCameraState) {
                dialogDefaultFramedCameraState = captureCameraState(getActiveCameraPreview());
            }
            lastCameraValues = getCameraValues(formData);
            updateResetButtonState(formData);
            await updateLivePreview(dialog, formData);
            syncConditionalBars(dialog);
            requestAnimationFrame(() => {
                alignAutoFrameWithZoom(dialog);
            });
        })();
    }, 0);
}

// =========================
// Dialog form and preview helpers
// =========================
function getFormatSpecificInfo() {
    if (!Format) return 'Compatible with all model formats';
    
    switch(Format.id) {
        case 'bedrock':
        case 'bedrock_block':
            return '💡 Perfect for Bedrock item textures (16×16 recommended for game compatibility)';
        case 'java_block':
            return '💡 Ideal for Java item models (16×16 standard, 32×32 for detailed items)';
        case 'skin':
            return '💡 Great for skin previews (64×64 recommended for face icons)';
        case 'free':
            return '💡 Generic model export (any size works, 64×64+ recommended)';
        default:
            return '💡 Compatible with all model formats (choose size based on intended use)';
    }
}

function getRecommendedSize() {
    if (!Format) return '48';
    
    switch(Format.id) {
        case 'bedrock':
        case 'bedrock_block':
        case 'java_block':
            return '16';
        case 'skin':
            return '64';
        default:
            return '48';
    }
}

function resolveFormData(dialog, formData = {}) {
    let fromDialog = {};
    if (dialog && typeof dialog.getFormResult === 'function') {
        try {
            fromDialog = dialog.getFormResult() || {};
        } catch (error) {
            fromDialog = {};
        }
    }
    function value(key, fallback) {
        if (Object.prototype.hasOwnProperty.call(formData, key) && formData[key] !== undefined) {
            return formData[key];
        }
        if (Object.prototype.hasOwnProperty.call(fromDialog, key) && fromDialog[key] !== undefined) {
            return fromDialog[key];
        }
        return fallback;
    }
    return {
        icon_size: value('icon_size', getRecommendedSize()),
        custom_size: value('custom_size', 48),
        background: value('background', 'transparent'),
        custom_color: value('custom_color', '#ff0000'),
        auto_frame: value('auto_frame', true),
        zoom_level: value('zoom_level', 1.0),
        rotate_x: value('rotate_x', 0),
        rotate_y: value('rotate_y', 0),
        rotate_z: value('rotate_z', 0),
        pan_x: value('pan_x', 0),
        pan_y: value('pan_y', 0),
        quality: value('quality', 'high'),
        save_mode: value('save_mode', 'ask_dialog'),
        output_folder: value('output_folder', ''),
        filename: value('filename', 'icon')
    };
}

function formatRangeDisplayValue(value) {
    let number = Number(value);
    if (!Number.isFinite(number)) return '0';
    if (Math.abs(number - Math.round(number)) < 0.000001) {
        return String(Math.round(number));
    }
    return String(Math.round(number * 100) / 100);
}

function syncRangeLabels(dialog, values) {
    if (!dialog || !dialog.object) return;
    let rangeKeys = ['zoom_level', 'rotate_x', 'rotate_y', 'rotate_z', 'pan_x', 'pan_y'];
    rangeKeys.forEach(key => {
        let container = dialog.object.querySelector(`.form_bar_${key}`);
        if (!container) {
            let settingNode = dialog.object.querySelector(`[data-setting="${key}"]`);
            if (!settingNode) return;
            container = settingNode.closest('.form_element') || settingNode.closest('.form_bar') || settingNode;
        }
        let labelNode = container.querySelector('.range_input_label');
        if (labelNode) {
            labelNode.textContent = formatRangeDisplayValue(values[key]);
        }
    });
}

async function updateLivePreview(dialog, formData) {
    let resolvedFormData = resolveFormData(dialog, formData);
    let iconSize = resolvedFormData.icon_size === 'custom' ? 
        parseInt(resolvedFormData.custom_size) : 
        parseInt(resolvedFormData.icon_size);
    if (!Number.isFinite(iconSize) || iconSize <= 0) {
        iconSize = 48;
    }
        
    let infoElement = document.getElementById('preview_info_text');
    if (infoElement) {
        infoElement.textContent = `${iconSize}×${iconSize} pixels`;
    }
    
    let canvas = document.getElementById('live_icon_preview_canvas');
    if (canvas) {
        generateLivePreview(canvas, resolvedFormData);
    }
}

function hideSceneHelpers() {
    let hidden = {};
    if (typeof three_grid !== 'undefined' && three_grid) {
        hidden.gridWasVisible = three_grid.visible;
        three_grid.visible = false;
    }
    if (typeof Transformer !== 'undefined' && Transformer) {
        hidden.transformerWasVisible = Transformer.visible;
        Transformer.visible = false;
    }
    if (typeof Canvas !== 'undefined' && Canvas.outlines) {
        hidden.outlinesWasVisible = Canvas.outlines.visible;
        Canvas.outlines.visible = false;
    }
    return hidden;
}

function restoreSceneHelpers(hidden) {
    if (!hidden) return;
    if (hidden.gridWasVisible !== undefined && typeof three_grid !== 'undefined' && three_grid) {
        three_grid.visible = hidden.gridWasVisible;
    }
    if (hidden.transformerWasVisible !== undefined && typeof Transformer !== 'undefined' && Transformer) {
        Transformer.visible = hidden.transformerWasVisible;
    }
    if (hidden.outlinesWasVisible !== undefined && typeof Canvas !== 'undefined' && Canvas.outlines) {
        Canvas.outlines.visible = hidden.outlinesWasVisible;
    }
}

function getPreviewSourceCanvas(overridePreview) {
    let hidden = hideSceneHelpers();
    try {
        if (overridePreview && overridePreview.canvas) {
            if (typeof overridePreview.render === 'function') overridePreview.render();
            return overridePreview.canvas;
        }
        if (isolatedDialogPreview && isolatedDialogPreview.canvas) {
            if (typeof isolatedDialogPreview.render === 'function') {
                isolatedDialogPreview.render();
            }
            return isolatedDialogPreview.canvas;
        }
        if (typeof Preview !== 'undefined' && Preview.selected) {
            if (typeof Preview.selected.render === 'function') {
                Preview.selected.render();
            }
            return Preview.selected.canvas;
        }
        let sourceCanvas = document.querySelector('#preview canvas');
        if (!sourceCanvas) {
            sourceCanvas = document.querySelector('.preview canvas');
        }
        return sourceCanvas;
    } finally {
        restoreSceneHelpers(hidden);
    }
}

function getBackgroundStyle(background) {
    switch(background) {
        case 'white': return '#FFFFFF';
        case 'black': return '#000000';
        case 'gray': return '#808080';
        case 'transparent': 
        default: 
            return 'repeating-conic-gradient(#CCC 0% 25%, #FFF 0% 50%) 50% / 10px 10px';
    }
}

function generateLivePreview(canvas, formData, overridePreview) {
    if (!canvas) return;
    
    let ctx = canvas.getContext('2d');
    let previewSize = canvas.width;
    
    let iconSize = formData.icon_size === 'custom' ? 
        parseInt(formData.custom_size) : 
        parseInt(formData.icon_size);
    if (!Number.isFinite(iconSize) || iconSize <= 0) {
        iconSize = 48;
    }
    
    let qualityMultiplier;
    switch(formData.quality) {
        case 'standard': qualityMultiplier = 4; break;
        case 'high': qualityMultiplier = 8; break;
        case 'ultra': qualityMultiplier = 16; break;
        default: qualityMultiplier = 8;
    }
    


    
    ctx.clearRect(0, 0, previewSize, previewSize);
    
    if (formData.background === 'transparent') {
        let checkerSize = Math.max(8, iconSize / 8);
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, previewSize, previewSize);
        ctx.fillStyle = '#e0e0e0';
        for (let x = 0; x < previewSize; x += checkerSize) {
            for (let y = 0; y < previewSize; y += checkerSize) {
                if ((x / checkerSize + y / checkerSize) % 2) {
                    ctx.fillRect(x, y, checkerSize, checkerSize);
                }
            }
        }
    } else if (formData.background === 'custom') {
        ctx.fillStyle = formData.custom_color || '#ff0000';
        ctx.fillRect(0, 0, previewSize, previewSize);
    } else {
        ctx.fillStyle = getBackgroundColor(formData.background);
        ctx.fillRect(0, 0, previewSize, previewSize);
    }
    
    let sourceCanvas = getPreviewSourceCanvas(overridePreview);
    
    if (sourceCanvas) {
        let tempCanvas = document.createElement('canvas');
        let tempCtx = tempCanvas.getContext('2d');
        
        let renderSize = Math.max(1, Math.floor(iconSize * qualityMultiplier));
        tempCanvas.width = renderSize;
        tempCanvas.height = renderSize;
        
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = formData.quality === 'ultra' ? 'high' : 'medium';
        
        let sourceWidth = sourceCanvas.width;
        let sourceHeight = sourceCanvas.height;
        let sourceSize = Math.min(sourceWidth, sourceHeight);
        let sourceX = (sourceWidth - sourceSize) / 2;
        let sourceY = (sourceHeight - sourceSize) / 2;
        
        try {
            tempCtx.drawImage(sourceCanvas, sourceX, sourceY, sourceSize, sourceSize, 0, 0, renderSize, renderSize);
            
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(tempCanvas, 0, 0, previewSize, previewSize);
        } catch (error) {
            ctx.fillStyle = '#333';
            ctx.fillRect(0, 0, previewSize, previewSize);
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Error rendering preview', previewSize/2, previewSize/2 - 10);
            ctx.fillText(error.message, previewSize/2, previewSize/2 + 10);
        }
    } else {
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, previewSize, previewSize);
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No preview available', previewSize/2, previewSize/2 - 10);
        ctx.font = '10px Arial';
        ctx.fillText('Make sure model is visible', previewSize/2, previewSize/2 + 10);
    }
}

// =========================
// Icon generation orchestration
// =========================
async function generateIcon(formData, restoreState = null, cleanupDialogPreview = false) {
    try {
        let iconSize = formData.icon_size === 'custom' ? 
            parseInt(formData.custom_size) : 
            parseInt(formData.icon_size);
        let filename = formData.filename || 'icon';

        if (!filename.endsWith('.png')) {
            filename += '.png';
        }

        Blockbench.setStatusBarText('Preparing camera view...');
        Blockbench.setProgress(0.1);

        if (formData.auto_frame) {
            await frameModelForIcon(formData);
        }
        
        Blockbench.setStatusBarText('Adjusting camera settings...');
        Blockbench.setProgress(0.3);
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        Blockbench.setStatusBarText('Capturing high-quality screenshot...');
        Blockbench.setProgress(0.5);
        
        await captureIcon(formData, iconSize, filename);
        
        Blockbench.setStatusBarText('Export complete!');
        Blockbench.setProgress(1);
        
        setTimeout(() => {
            Blockbench.setProgress();
            Blockbench.setStatusBarText();
        }, 1000);

    } catch (error) {
        Blockbench.setProgress();
        Blockbench.setStatusBarText();

        Blockbench.showMessageBox({
            title: 'Export Failed',
            message: 'Failed to generate icon: ' + error.message,
            icon: 'error'
        });
    } finally {
        if (restoreState) {
            applyCameraState(restoreState);
        }
        if (cleanupDialogPreview) {
            disposeIsolatedDialogPreview();
            clearDialogCameraState();
        }
    }
}

// =========================
// Camera interaction controls
// =========================
let baseCameraPosition = null;
let baseCameraTarget = null;
let baseCameraUp = null;
let lastAutoFrameState = true;
let lastCameraValues = { zoom_level: 1.0, rotate_x: 0, rotate_y: 0, rotate_z: 0, pan_x: 0, pan_y: 0 };
let cameraWatchInterval = null;

function getCameraValues(cameraData) {
    return {
        zoom_level: parseFloat(cameraData.zoom_level) || 1.0,
        rotate_x: parseFloat(cameraData.rotate_x) || 0,
        rotate_y: parseFloat(cameraData.rotate_y) || 0,
        rotate_z: parseFloat(cameraData.rotate_z) || 0,
        pan_x: parseFloat(cameraData.pan_x) || 0,
        pan_y: parseFloat(cameraData.pan_y) || 0
    };
}

function cameraValuesChanged(a, b) {
    return a.zoom_level !== b.zoom_level ||
        a.rotate_x !== b.rotate_x ||
        a.rotate_y !== b.rotate_y ||
        a.rotate_z !== b.rotate_z ||
        a.pan_x !== b.pan_x ||
        a.pan_y !== b.pan_y;
}

function hasManualCameraAdjustments(values) {
    return values.zoom_level !== 1.0 ||
        values.rotate_x !== 0 ||
        values.rotate_y !== 0 ||
        values.rotate_z !== 0 ||
        values.pan_x !== 0 ||
        values.pan_y !== 0;
}

function updateResetButtonState(cameraData) {
    if (!activeResetButton) return;
    let values = getCameraValues(cameraData);
    let isActive = hasManualCameraAdjustments(values);
    activeResetButton.disabled = !isActive;
    activeResetButton.style.opacity = isActive ? '1' : '0.5';
    activeResetButton.style.cursor = isActive ? 'pointer' : 'not-allowed';
}

function captureBaseCameraState() {
    let preview = getActiveCameraPreview();
    if (!preview || !preview.camera) {
        return false;
    }
    let camera = preview.camera;
    baseCameraPosition = camera.position.clone();
    baseCameraTarget = getCurrentPreviewTarget(camera, preview);
    camera.up.copy(WORLD_UP);
    if (preview.controls && preview.controls.target) {
        preview.controls.target.copy(baseCameraTarget);
    }
    camera.lookAt(baseCameraTarget);
    if (camera.updateProjectionMatrix) {
        camera.updateProjectionMatrix();
    }
    if (preview.controls && preview.controls.update) {
        preview.controls.update();
    }
    if (typeof preview.render === 'function') {
        preview.render();
    }
    baseCameraUp = WORLD_UP.clone();
    return true;
}

function handleFormCameraChange(dialog, formData) {
    let resolvedFormData = resolveFormData(dialog, formData);
    let currentValues = getCameraValues(resolvedFormData);
    let autoFrameChanged = resolvedFormData.auto_frame !== lastAutoFrameState;
    lastAutoFrameState = resolvedFormData.auto_frame;

    if (autoFrameChanged && resolvedFormData.auto_frame) {
        let activePreview = getActiveCameraPreview();
        function applyAutoFramedState() {
            baseCameraPosition = null;
            baseCameraTarget = null;
            baseCameraUp = null;
            captureBaseCameraState();
            adjustCameraManually(currentValues);
            lastCameraValues = currentValues;
            updateResetButtonState(currentValues);
            updateLivePreview(dialog, resolvedFormData);
        }

        if (dialogDefaultFramedCameraState) {
            applyCameraState(cloneCameraState(dialogDefaultFramedCameraState), activePreview);
            applyAutoFramedState();
        } else if (isolatedDialogPreview) {
            dialogDefaultFramedCameraState = captureCameraState(activePreview);
            applyAutoFramedState();
        } else {
            frameModelForIcon(resolvedFormData).then(() => {
                dialogDefaultFramedCameraState = captureCameraState(activePreview);
                applyAutoFramedState();
            });
        }
        return;
    }

    if (cameraValuesChanged(currentValues, lastCameraValues)) {
        adjustCameraManually(currentValues);
        lastCameraValues = currentValues;
    }
    updateResetButtonState(currentValues);
    updateLivePreview(dialog, resolvedFormData);
}

function startCameraWatcher() {
    if (cameraWatchInterval) {
        clearInterval(cameraWatchInterval);
        cameraWatchInterval = null;
    }
}

function stopCameraWatcher() {
    if (cameraWatchInterval) {
        clearInterval(cameraWatchInterval);
        cameraWatchInterval = null;
    }
}

function adjustCameraManually(cameraData) {
    let preview = getActiveCameraPreview();
    if (preview && preview.camera) {
        let camera = preview.camera;
        if (!baseCameraPosition || !baseCameraTarget || !baseCameraUp) {
            if (!captureBaseCameraState()) {
                return;
            }
        }
        
        let values = getCameraValues(cameraData);
        let zoomLevel = values.zoom_level;
        let rotateX = THREE.MathUtils.degToRad(values.rotate_x);
        let rotateY = THREE.MathUtils.degToRad(values.rotate_y);
        let rotateZ = THREE.MathUtils.degToRad(values.rotate_z);

        let newTarget = baseCameraTarget.clone();
        let baseOffset = baseCameraPosition.clone().sub(baseCameraTarget);
        let baseUpNormal = baseCameraUp.clone().normalize();
        let forward = baseCameraTarget.clone().sub(baseCameraPosition).normalize();
        let right = forward.clone().cross(baseUpNormal);
        if (right.lengthSq() === 0) {
            right.set(1, 0, 0);
        } else {
            right.normalize();
        }
        let panScale = 2.0;
        newTarget.add(right.multiplyScalar(values.pan_x * panScale));
        newTarget.add(baseUpNormal.clone().multiplyScalar(values.pan_y * panScale));

        let rotatedOffset = baseOffset.clone();
        if (rotateY !== 0) {
            let yawQuaternion = new THREE.Quaternion().setFromAxisAngle(baseUpNormal, rotateY);
            rotatedOffset.applyQuaternion(yawQuaternion);
        }
        if (rotateX !== 0) {
            let pitchAxis = baseUpNormal.clone().cross(rotatedOffset).normalize();
            if (pitchAxis.lengthSq() > 0) {
                let pitchQuaternion = new THREE.Quaternion().setFromAxisAngle(pitchAxis, rotateX);
                rotatedOffset.applyQuaternion(pitchQuaternion);
            }
        }
        rotatedOffset.multiplyScalar(zoomLevel);

        let newPosition = newTarget.clone().add(rotatedOffset);
        camera.position.copy(newPosition);

        let upVector = baseUpNormal.clone();
        if (rotateZ !== 0) {
            let forwardAxis = newTarget.clone().sub(newPosition).normalize();
            if (forwardAxis.lengthSq() > 0) {
                let rollQuaternion = new THREE.Quaternion().setFromAxisAngle(forwardAxis, rotateZ);
                upVector.applyQuaternion(rollQuaternion);
            }
        }
        camera.up.copy(upVector);
        
        if (preview.controls && preview.controls.target) {
            preview.controls.target.copy(newTarget);
        }
        camera.lookAt(newTarget);
        
        if (camera.updateProjectionMatrix) {
            camera.updateProjectionMatrix();
        }
        
        
        if (preview.controls && preview.controls.update) {
            preview.controls.update();
        }
        
        if (typeof preview.render === 'function') {
            preview.render();
            
            setTimeout(() => {
                let canvas = document.getElementById('live_icon_preview_canvas');
                if (canvas) {
                    generateLivePreview(canvas, cameraData);
                }
            }, 100);
        }
    } else {

    }
}

function frameModelForIcon(formData = {}, skipZoom = false) {
    return new Promise((resolve) => {
        if (isolatedDialogPreview) {
            baseCameraPosition = null;
            baseCameraTarget = null;
            baseCameraUp = null;
            captureBaseCameraState();
            if (typeof isolatedDialogPreview.render === 'function') {
                isolatedDialogPreview.render();
            }
            resolve();
            return;
        }
        let originalSelection = null;
        try {
            let allElements = Project.elements.filter(element => element.visibility !== false);
            
            if (allElements.length === 0) {
                resolve();
                return;
            }

            if (typeof Outliner !== 'undefined' && Outliner.selected) {
                originalSelection = Outliner.selected.slice();
                Outliner.selected.splice(0);
                allElements.forEach(element => {
                    Outliner.selected.push(element);
                });
            }
            
            if (typeof BarItems !== 'undefined' && BarItems.focus_on_selection) {
                let mockEvent = { ctrlKey: false, type: 'click' };
                if (typeof BarItems.focus_on_selection.click === 'function') {
                    BarItems.focus_on_selection.click(mockEvent);
                }
            }
            
            setTimeout(() => {
                if (getSelectedPreview() && getSelectedPreview().camera) {
                    captureBaseCameraState();
                    
                    if (typeof getSelectedPreview().render === 'function') {
                        getSelectedPreview().render();
                    }
                }
                
                if (originalSelection && typeof Outliner !== 'undefined' && Outliner.selected) {
                    Outliner.selected.splice(0);
                    originalSelection.forEach(element => {
                        Outliner.selected.push(element);
                    });
                }
                resolve();
            }, 200);

        } catch (error) {
            if (originalSelection && typeof Outliner !== 'undefined' && Outliner.selected) {
                Outliner.selected.splice(0);
                originalSelection.forEach(element => {
                    Outliner.selected.push(element);
                });
            }
            resolve();
        }
    });
}

// =========================
// Capture and export pipeline
// =========================
function getBackgroundColor(background) {
    switch(background) {
        case 'white': return '#FFFFFF';
        case 'black': return '#000000';
        case 'gray': return '#808080';
        case 'transparent': 
        default: 
            return null;
    }
}

async function captureIcon(formData, iconSize, filename) {
    return new Promise((resolve, reject) => {
        try {
            let multiplier;
            switch(formData.quality) {
                case 'standard': multiplier = 4; break;
                case 'high': multiplier = 8; break;
                case 'ultra': multiplier = 16; break;
                default: multiplier = 8;
            }
            
            let captureSize = iconSize * multiplier;
            let captureCompleted = false;
            let fallbackTimer = null;
            
            if (isolatedDialogPreview) {
                captureFromCanvas(formData, iconSize, filename);
                resolve();
                return;
            }
        
            function finishCapture(fn) {
                if (captureCompleted) return;
                captureCompleted = true;
                if (fallbackTimer) {
                    clearTimeout(fallbackTimer);
                }
                fn();
                resolve();
            }
        
        if (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.capture === 'function') {
                fallbackTimer = setTimeout(() => {
                    finishCapture(() => {
                        captureFromCanvas(formData, iconSize, filename);
                    });
                }, 3000);

                MediaRecorder.capture({
                    type: 'image',
                    width: captureSize,
                    height: captureSize,
                    callback: function(blob) {
                        if (blob && blob.size > 0) {
                            finishCapture(() => {
                                processImageBlob(blob, formData, iconSize, filename);
                            });
                        } else {
                            finishCapture(() => {
                                captureFromCanvas(formData, iconSize, filename);
                            });
                        }
                    }
                });

            } else {
                captureFromCanvas(formData, iconSize, filename);
                resolve();
            }

        } catch (error) {
            reject(error);
        }
    });
}

function captureFromCanvas(formData, iconSize, filename) {
    try {
        let sourceCanvas = getPreviewSourceCanvas();
        
        if (!sourceCanvas) {
            throw new Error('Could not find preview canvas');
        }
        
        let multiplier;
        switch(formData.quality) {
            case 'standard': multiplier = 4; break;
            case 'high': multiplier = 8; break;
            case 'ultra': multiplier = 16; break;
            default: multiplier = 8;
        }
        
        let captureSize = iconSize * multiplier;
            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = captureSize;
            tempCanvas.height = captureSize;
            let ctx = tempCanvas.getContext('2d');
        
        if (formData.background === 'custom') {
            ctx.fillStyle = formData.custom_color || '#ff0000';
            ctx.fillRect(0, 0, captureSize, captureSize);
        } else {
            let bgColor = getBackgroundColor(formData.background);
            if (bgColor) {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, captureSize, captureSize);
            }
        }
            
            ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = formData.quality === 'ultra' ? 'high' : 'medium';
            
        let sourceWidth = sourceCanvas.width;
        let sourceHeight = sourceCanvas.height;
        let sourceSize = Math.min(sourceWidth, sourceHeight);
        let sourceX = (sourceWidth - sourceSize) / 2;
        let sourceY = (sourceHeight - sourceSize) / 2;
        
            ctx.drawImage(sourceCanvas, sourceX, sourceY, sourceSize, sourceSize, 0, 0, captureSize, captureSize);
            
        resizeAndExport(tempCanvas, iconSize, filename, formData);
        
    } catch (error) {

        Blockbench.showMessageBox({
            title: 'Capture Failed',
            message: 'Could not capture the model view. Please ensure a model is loaded and visible.',
            icon: 'error'
        });
    }
}

function processImageBlob(blob, formData, iconSize, filename) {
    let img = new Image();
    img.onload = function() {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext('2d');
        
        if (formData.background === 'custom') {
            ctx.fillStyle = formData.custom_color || '#ff0000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            let bgColor = getBackgroundColor(formData.background);
            if (bgColor) {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
        
        ctx.drawImage(img, 0, 0);
        resizeAndExport(canvas, iconSize, filename, formData);
        
        URL.revokeObjectURL(img.src);
    };
    img.onerror = function() {

        captureFromCanvas(formData, iconSize, filename);
    };
    img.src = URL.createObjectURL(blob);
}

function resizeAndExport(sourceCanvas, targetSize, filename, formData = {}) {
    try {
        let currentCanvas = sourceCanvas;
        let currentSize = Math.max(sourceCanvas.width, sourceCanvas.height);
        
        while (currentSize > targetSize * 2) {
            let nextSize = Math.max(Math.floor(currentSize * 0.5), targetSize);
            let stepCanvas = document.createElement('canvas');
            stepCanvas.width = nextSize;
            stepCanvas.height = nextSize;
            let stepCtx = stepCanvas.getContext('2d');
            
            stepCtx.imageSmoothingEnabled = true;
            stepCtx.imageSmoothingQuality = 'high';
            stepCtx.drawImage(currentCanvas, 0, 0, nextSize, nextSize);
            
            currentCanvas = stepCanvas;
            currentSize = nextSize;
        }
        
        let finalCanvas = document.createElement('canvas');
        finalCanvas.width = targetSize;
        finalCanvas.height = targetSize;
        let ctx = finalCanvas.getContext('2d');
        
        if (targetSize <= 32) {
            ctx.imageSmoothingEnabled = false;
        } else {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
        }
        
        ctx.drawImage(currentCanvas, 0, 0, targetSize, targetSize);
        
        finalCanvas.toBlob(function(blob) {
            exportFinalImage(blob, filename, targetSize, formData);
        }, 'image/png');
        
    } catch (error) {

        Blockbench.showMessageBox({
            title: 'Resize Error',
            message: 'Failed to resize image: ' + error.message,
            icon: 'error'
        });
    }
}

function getNormalizedExportName(filename) {
    let name = typeof filename === 'string' ? filename.trim() : 'icon';
    if (!name) {
        name = 'icon';
    }
    name = name.replace(/[/\\:*?"<>|]/g, '_');
    if (!name.toLowerCase().endsWith('.png')) {
        name += '.png';
    }
    return name;
}

function writeDataUrlToOutputFolder(dataURL, outputFolder, filename) {
    if (!canUseAppFileSystem()) {
        throw new Error('Auto-save is only available in the desktop app');
    }

    let folderPath = typeof outputFolder === 'string' ? outputFolder.trim() : '';
    if (!folderPath) {
        throw new Error('No output folder selected');
    }
    let fsModule = getNativeModule('fs', {
        scope: folderPath,
        message: 'This permission is required to save exported icons to your selected output folder.'
    });
    let pathModule = getNativeModule('path');
    if (!fsModule) {
        throw new Error('File system permission was denied');
    }
    if (!pathModule) {
        throw new Error('Path module is unavailable');
    }
    if (!fsModule.existsSync(folderPath)) {
        throw new Error('Selected output folder does not exist');
    }

    let folderStats = fsModule.statSync(folderPath);
    if (!folderStats || !folderStats.isDirectory()) {
        throw new Error('Selected output path is not a folder');
    }

    let fileName = getNormalizedExportName(filename);
    let fullPath = pathModule.join(folderPath, fileName);
    let commaIndex = typeof dataURL === 'string' ? dataURL.indexOf(',') : -1;
    if (commaIndex === -1) {
        throw new Error('Invalid image data');
    }

    let base64Data = dataURL.slice(commaIndex + 1);
    fsModule.writeFileSync(fullPath, base64Data, 'base64');
    return fullPath;
}

function exportFinalImage(blob, filename, iconSize, formData = {}) {
    try {
        if (!blob) {
            throw new Error('No image data generated');
        }

        let reader = new FileReader();
        reader.onload = function() {
            let dataURL = reader.result;
            let exportPrefs = normalizeExportPrefs(formData);
            let fileNameWithExtension = getNormalizedExportName(filename);
            let baseName = fileNameWithExtension.replace(/\.png$/i, '');
            let preferredFolder = exportPrefs.output_folder;
            let shouldAutoSave = exportPrefs.save_mode === 'auto_folder' && !!preferredFolder;

            if (shouldAutoSave) {
                try {
                    let savedPath = writeDataUrlToOutputFolder(dataURL, preferredFolder, fileNameWithExtension);
                    Blockbench.showMessageBox({
                        title: 'Export Complete',
                        message: `${iconSize}×${iconSize} icon exported successfully.`,
                        icon: 'check'
                    });
                    Blockbench.showQuickMessage('Saved to: ' + savedPath, 3000);
                    return;
                } catch (error) {
                    Blockbench.showQuickMessage('Auto-save failed, opening save dialog');
                }
            }
            
            let startPath = undefined;
            if (preferredFolder) {
                let sep = preferredFolder.includes('\\') ? '\\' : '/';
                startPath = preferredFolder + sep + fileNameWithExtension;
            }
            Blockbench.export({
                type: 'PNG Image',
                extensions: ['png'],
                name: baseName,
                content: dataURL,
                savetype: 'image',
                startpath: startPath
            }, function(path) {
                if (path) {
                    Blockbench.showMessageBox({
                        title: 'Export Complete',
                        message: `${iconSize}×${iconSize} icon exported successfully.`,
                        icon: 'check'
                    });
                } else {
                    Blockbench.showQuickMessage('Export cancelled');
                }
            });
        };
        reader.onerror = function() {
            throw new Error('Failed to read image data');
        };
        reader.readAsDataURL(blob);

    } catch (error) {

        Blockbench.showMessageBox({
            title: 'Export Error',
            message: 'Failed to export icon: ' + error.message,
            icon: 'error'
        });
    }
}
