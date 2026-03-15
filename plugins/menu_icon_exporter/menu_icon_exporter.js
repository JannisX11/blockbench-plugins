// =========================
// Plugin state
// =========================
let iconExporterAction;
const PLUGIN_BROWSER_ICON = 'icon.svg';
const ACTION_ICON = 'photo_camera';
const ACTION_ICON_16 = 'photo_size_select_small';
const ACTION_ICON_64 = 'photo_size_select_large';
let activeResetButton = null;
let cachedToolbarIconDataUrl = null;
const WORLD_UP = new THREE.Vector3(0, 1, 0);
let dialogCameraRestoreState = null;
let dialogDefaultFramedCameraState = null;
let isolatedDialogPreview = null;
const EXPORT_PREFS_KEY = 'menu_icon_exporter_export_prefs_v1';
const DEFAULT_EXPORT_PREFS = Object.freeze({
    save_mode: 'ask_dialog',
    output_folder: ''
});
let cachedExportPrefsText = '';
const PLUGIN_REPOSITORY = 'https://github.com/HMC-Studios/Menu-Icon-Exporter';
const PLUGIN_BUG_TRACKER = 'https://github.com/HMC-Studios/Menu-Icon-Exporter/issues';
const PLUGIN_ABOUT = `Export Blockbench models as PNG icons with stable camera framing and fast export actions.

![Menu Icon Exporter Preview](https://raw.githubusercontent.com/HMC-Studios/Menu-Icon-Exporter/main/images/plugin_example.png)

### Highlights
- Auto-frame model with stable reset behavior
- Manual camera controls (zoom, pan, rotate X/Y/Z)
- Live preview while adjusting controls
- 16/32/48/64/128 presets plus custom size
- Transparent, solid, or custom background color
- Export quality multipliers (4x, 8x, 16x)
- Save mode options (ask each time or auto-save folder)

PNG output works across Blockbench formats and platforms.
Platform-specific size, naming, and folder rules still apply.`;

// =========================
// Export preferences
// =========================
function canUseAppFileSystem() {
    return typeof require === 'function' || typeof requireNativeModule === 'function';
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
    let saveMode = source && source.save_mode === 'auto_folder' ? 'auto_folder' : 'ask_dialog';
    let outputFolder = source && typeof source.output_folder === 'string' ? source.output_folder.trim() : '';
    if (!canUseAppFileSystem()) {
        saveMode = 'ask_dialog';
        outputFolder = '';
    }
    return {
        save_mode: saveMode,
        output_folder: outputFolder
    };
}

function loadExportPrefs() {
    try {
        let raw = localStorage.getItem(EXPORT_PREFS_KEY);
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
        localStorage.setItem(EXPORT_PREFS_KEY, serialized);
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
            keybind: new Keybind({key: 'i', ctrl: true, shift: true}),
            condition: () => Project && Project.elements && Project.elements.length > 0,
            click: openIconExporterDialog
        });
 
        this.quickExport16Action = new Action('quick_export_16', {
            name: 'Quick Export 16×16 Icon',
            description: 'Instantly export a 16×16 icon with default settings',
            icon: ACTION_ICON_16,
            category: 'file',
            condition: () => Project && Project.elements && Project.elements.length > 0,
            click: () => quickExportIcon(16)
        });

        this.quickExport64Action = new Action('quick_export_64', {
            name: 'Quick Export 64×64 Icon',
            description: 'Instantly export a 64×64 icon with default settings',
            icon: ACTION_ICON_64,
            category: 'file',
            condition: () => Project && Project.elements && Project.elements.length > 0,
            click: () => quickExportIcon(64)
        });

        MenuBar.addAction(this.iconExporterAction, 'file.export');
        MenuBar.addAction(this.quickExport16Action, 'file.export');
        MenuBar.addAction(this.quickExport64Action, 'file.export');

        let toolbarIconDataUrl = getToolbarIconDataUrl();
        if (toolbarIconDataUrl) {
            this.iconExporterAction.setIcon(toolbarIconDataUrl);
        } else {
            let runtimeIconPath = getPluginRuntimeIconPath();
            if (runtimeIconPath) {
                this.iconExporterAction.setIcon(runtimeIconPath);
            }
        }
    },
    
    onunload() {
        stopCameraWatcher();
        activeResetButton = null;
        restoreDialogCameraState();
        disposeIsolatedDialogPreview();
        clearDialogCameraState();
        this.iconExporterAction?.delete();
        this.quickExport16Action?.delete();
        this.quickExport64Action?.delete();
    }
});

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
                value: getRecommendedSize(),
                onChange(formResult) {
                    updateLivePreview(dialog, formResult);
                }
            },
            
            custom_size: {
                label: 'Custom Size (pixels)',
                type: 'number',
                value: 48,
                min: 8,
                max: 512,
                condition: (form) => form.icon_size === 'custom',
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
                value: 'transparent',
                description: 'Background color for the exported icon',
                onChange(formResult) {
                    updateLivePreview(dialog, formResult);
                }
            },
            
            custom_color: {
                label: 'Custom Background Color',
                type: 'color',
                value: '#ff0000',
                description: 'Pick any color from the gradient spectrum',
                condition: (formResult) => formResult.background === 'custom'
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
                value: 'high',
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
            let resolvedFormData = resolveFormData(dialog, dialog.getFormResult());
            saveExportPrefs(resolvedFormData);
            applyDialogBottomLayout(dialog, bottomMetaSection);
            handleFormCameraChange(dialog, resolvedFormData);
            requestAnimationFrame(() => {
                normalizeIconExporterDialog(dialog);
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
                    display: grid !important;
                    grid-template-columns: minmax(0, var(--max_label_width, 180px)) minmax(0, 1fr) auto auto !important;
                    align-items: center !important;
                    column-gap: 10px !important;
                }
                #icon_exporter_dialog .export_bottom_section .form_bar_output_folder > .name_space_left {
                    grid-column: 1 !important;
                    min-width: 0 !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                }
                #icon_exporter_dialog .export_bottom_section .form_bar_output_folder > .input_wrapper {
                    grid-column: 2 !important;
                    width: 100% !important;
                    min-width: 0 !important;
                    box-sizing: border-box !important;
                }
                #icon_exporter_dialog .export_bottom_section .form_bar_output_folder > .dialog_form_description {
                    grid-column: 4 !important;
                    justify-self: start !important;
                    margin-left: 4px !important;
                }
                #icon_exporter_dialog .export_bottom_section .form_bar_output_folder > i:not(.dialog_form_description),
                #icon_exporter_dialog .export_bottom_section .form_bar_output_folder > .material-icons:not(.dialog_form_description) {
                    grid-column: 3 !important;
                    justify-self: center !important;
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
                if (preLayoutHideStyle && preLayoutHideStyle.parentNode) {
                    preLayoutHideStyle.parentNode.removeChild(preLayoutHideStyle);
                }
                if (dialog.object) {
                    dialog.object.style.opacity = '1';
                }
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

function getPreviewSourceCanvas() {
    if (isolatedDialogPreview && isolatedDialogPreview.canvas) {
        if (typeof isolatedDialogPreview.render === 'function') {
            isolatedDialogPreview.render();
        }
        return isolatedDialogPreview.canvas;
    }
    if (typeof Preview !== 'undefined' && Preview.selected && Preview.selected.canvas) {
        return Preview.selected.canvas;
    }
    let sourceCanvas = document.querySelector('#preview canvas');
    if (!sourceCanvas) {
        sourceCanvas = document.querySelector('.preview canvas');
    }
    return sourceCanvas;
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

function generateLivePreview(canvas, formData) {
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
    
    let sourceCanvas = getPreviewSourceCanvas();
    
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
                        message: `${iconSize}×${iconSize} icon exported successfully.\n\nSaved to:\n${savedPath}`,
                        icon: 'check'
                    });
                    return;
                } catch (error) {
                    Blockbench.showQuickMessage('Auto-save failed, opening save dialog');
                }
            }
            
            Blockbench.export({
                type: 'PNG Image',
                extensions: ['png'],
                name: baseName,
                content: dataURL,
                savetype: 'image',
                startpath: preferredFolder || undefined
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

// =========================
// Quick export entrypoint
// =========================
async function quickExportIcon(size) {
    if (!Format || !Project || !Project.elements || Project.elements.length === 0) {
        Blockbench.showMessageBox({
            title: 'No Model',
            message: 'Please load a model first before exporting an icon.',
            icon: 'warning'
        });
        return;
    }

    Blockbench.setStatusBarText('Preparing quick export...');
    Blockbench.setProgress(0.1);
    let restoreState = captureCameraState();
    flattenCameraUp();
    baseCameraPosition = null;
    baseCameraTarget = null;
    baseCameraUp = null;
    let outputPrefs = loadExportPrefs();
    
    let formData = {
        icon_size: size.toString(),
        background: 'transparent',
        auto_frame: true,
        quality: 'high',
        save_mode: outputPrefs.save_mode,
        output_folder: outputPrefs.output_folder,
        filename: function() {
            let name = Project.name || 'model';
            name = name.replace(/\.geo\.json$/i, '').replace(/\.geo$/i, '');
            name = name.replace(/\.[^.]+$/, '');
            name = name.replace(/[^a-zA-Z0-9_-]/g, '_');
            return name + '_icon_' + size;
        }()
    };
    
    await generateIcon(formData, restoreState);
}