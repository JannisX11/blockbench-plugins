(function() {
    let tool;
    let overlay = null;
    let rectEl = null;
    let panel = null;
    let preview = null;
    let active = false;
    let dragging = false;
    let start = {x: 0, y: 0};
    let last = {x: 0, y: 0};
    let mode = 'replace'; // replace, add, toggle
    let toolAction = null;
    let addAction = null;
    let toggleAction = null;
    let clearAction = null;

    const plugin_id = 'region_select_3d_mobile';
    const plugin_version = '1.3.1';

    function getPreview() {
        if (typeof Preview !== 'undefined' && Preview.selected) return Preview.selected;
        if (typeof main_preview !== 'undefined') return main_preview;
        return null;
    }

    function getCanvas() {
        const p = getPreview();
        return p && p.canvas ? p.canvas : null;
    }

    function getCanvasRect() {
        const canvas = getCanvas();
        return canvas ? canvas.getBoundingClientRect() : null;
    }

    function projectedBounds(cube, p, canvasRect) {
        if (!cube || !cube.mesh || !p || !p.camera || typeof THREE === 'undefined') return null;
        const box = new THREE.Box3().setFromObject(cube.mesh);
        if (!isFinite(box.min.x) || !isFinite(box.max.x)) return null;
        const corners = [
            new THREE.Vector3(box.min.x, box.min.y, box.min.z),
            new THREE.Vector3(box.min.x, box.min.y, box.max.z),
            new THREE.Vector3(box.min.x, box.max.y, box.min.z),
            new THREE.Vector3(box.min.x, box.max.y, box.max.z),
            new THREE.Vector3(box.max.x, box.min.y, box.min.z),
            new THREE.Vector3(box.max.x, box.min.y, box.max.z),
            new THREE.Vector3(box.max.x, box.max.y, box.min.z),
            new THREE.Vector3(box.max.x, box.max.y, box.max.z)
        ];
        let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
        for (const v of corners) {
            v.project(p.camera);
            const x = (v.x + 1) * 0.5 * canvasRect.width;
            const y = (1 - v.y) * 0.5 * canvasRect.height;
            left = Math.min(left, x);
            right = Math.max(right, x);
            top = Math.min(top, y);
            bottom = Math.max(bottom, y);
        }
        return {left, right, top, bottom};
    }

    function centerInside(a, b) {
        const cx = (a.left + a.right) * 0.5;
        const cy = (a.top + a.bottom) * 0.5;
        return cx >= b.left && cx <= b.right && cy >= b.top && cy <= b.bottom;
    }

    function applySelection(hits) {
        const cubes = (typeof Cube !== 'undefined' && Cube.all) ? Cube.all : [];
        if (mode === 'replace') {
            cubes.forEach(c => c.selected = false);
            hits.forEach(c => c.selected = true);
        } else if (mode === 'add') {
            hits.forEach(c => c.selected = true);
        } else if (mode === 'toggle') {
            hits.forEach(c => c.selected = !c.selected);
        }
        Canvas.updateView({selection: true});
    }

    function selectRegion(x1, y1, x2, y2) {
        const p = getPreview();
        const cr = getCanvasRect();
        if (!p || !cr) return;
        const region = {
            left: Math.min(x1, x2),
            right: Math.max(x1, x2),
            top: Math.min(y1, y2),
            bottom: Math.max(y1, y2)
        };
        const hits = [];
        const cubes = (typeof Cube !== 'undefined' && Cube.all) ? Cube.all : [];
        for (const cube of cubes) {
            if (!cube || cube.visibility === false || cube.locked) continue;
            const b = projectedBounds(cube, p, cr);
            if (b && centerInside(b, region)) hits.push(cube);
        }
        if (typeof Undo !== 'undefined' && Undo.initSelection) Undo.initSelection();
        applySelection(hits);
        if (typeof Undo !== 'undefined' && Undo.finishSelection) Undo.finishSelection('3D region selection');
        updateStatus(hits.length);
    }

    function updateStatus(count) {
        if (!panel) return;
        const status = panel.querySelector('.bb-rs-status');
        if (status) status.textContent = count + (count === 1 ? ' cube' : ' cubes');
    }

    function setMode(next) {
        mode = next;
        if (!panel) return;
        panel.querySelectorAll('[data-mode]').forEach(btn => {
            btn.style.opacity = btn.dataset.mode === mode ? '1' : '0.55';
        });
    }

    function clearSelection() {
        const cubes = (typeof Cube !== 'undefined' && Cube.all) ? Cube.all : [];
        if (typeof Undo !== 'undefined' && Undo.initSelection) Undo.initSelection();
        cubes.forEach(c => c.selected = false);
        Canvas.updateView({selection: true});
        if (typeof Undo !== 'undefined' && Undo.finishSelection) Undo.finishSelection('Clear 3D region selection');
        updateStatus(0);
    }

    function makeButton(label, modeName, title) {
        const b = document.createElement('button');
        b.textContent = label;
        b.dataset.mode = modeName;
        b.title = title;
        Object.assign(b.style, {
            border: '1px solid rgba(255,255,255,.25)',
            borderRadius: '8px',
            background: '#30343b',
            color: '#fff',
            padding: '7px 9px',
            fontSize: '12px',
            minWidth: '48px',
            touchAction: 'manipulation'
        });
        b.addEventListener('pointerdown', e => e.stopPropagation());
        b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); setMode(modeName); });
        return b;
    }

    function ensurePanel() {
        if (panel) return;
        panel = document.createElement('div');
        panel.id = 'bb-3d-region-select-mobile-panel';
        Object.assign(panel.style, {
            position: 'fixed',
            left: '50%',
            bottom: '12px',
            transform: 'translateX(-50%)',
            zIndex: '2147483646',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px',
            borderRadius: '10px',
            background: 'rgba(28,30,34,.94)',
            boxShadow: '0 3px 14px rgba(0,0,0,.4)',
            fontFamily: 'sans-serif',
            touchAction: 'manipulation'
        });
        panel.appendChild(makeButton('New', 'replace', 'Replace the current selection'));
        panel.appendChild(makeButton('+ Add', 'add', 'Add the region to the selection'));
        panel.appendChild(makeButton('± Toggle', 'toggle', 'Toggle selection of cubes in the region'));
        const clear = makeButton('×', 'clear', 'Clear the selection');
        clear.dataset.mode = 'clear';
        clear.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); clearSelection(); });
        panel.appendChild(clear);
        const status = document.createElement('span');
        status.className = 'bb-rs-status';
        status.textContent = '0 cubes';
        Object.assign(status.style, {
            color: '#ddd',
            fontSize: '11px',
            padding: '0 4px',
            whiteSpace: 'nowrap'
        });
        panel.appendChild(status);
        document.body.appendChild(panel);
        setMode(mode);
    }

    function removePanel() {
        if (panel) panel.remove();
        panel = null;
    }

    function ensureOverlay() {
        const canvas = getCanvas();
        if (!canvas) return false;
        if (overlay) return true;

        overlay = document.createElement('div');
        overlay.id = 'bb-3d-region-select-mobile-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            zIndex: '2147483645',
            cursor: 'crosshair',
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            background: 'transparent',
            pointerEvents: 'auto'
        });

        rectEl = document.createElement('div');
        Object.assign(rectEl.style, {
            position: 'absolute',
            display: 'none',
            border: '2px solid rgba(74,163,255,.95)',
            background: 'rgba(74,163,255,.16)',
            pointerEvents: 'none',
            boxSizing: 'border-box',
            borderRadius: '2px'
        });

        overlay.appendChild(rectEl);
        document.body.appendChild(overlay);

        overlay.addEventListener('pointerdown', onDown, {passive: false});
        overlay.addEventListener('pointermove', onMove, {passive: false});
        overlay.addEventListener('pointerup', onUp, {passive: false});
        overlay.addEventListener('pointercancel', onCancel, {passive: false});
        overlay.addEventListener('contextmenu', e => {
            e.preventDefault();
            e.stopPropagation();
        });

        return true;
    }

    function resizeOverlay() {
        const cr = getCanvasRect();
        if (!overlay || !cr) return;
        overlay.style.left = cr.left + 'px';
        overlay.style.top = cr.top + 'px';
        overlay.style.width = cr.width + 'px';
        overlay.style.height = cr.height + 'px';
    }

    function removeOverlay() {
        if (overlay) overlay.remove();
        overlay = null;
        rectEl = null;
        dragging = false;
    }

    function onDown(e) {
        if (!active) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        e.preventDefault();
        e.stopPropagation();

        overlay.setPointerCapture?.(e.pointerId);

        const r = overlay.getBoundingClientRect();

        start = {
            x: e.clientX - r.left,
            y: e.clientY - r.top
        };

        last = {...start};
        dragging = true;

        rectEl.style.display = 'block';
        rectEl.style.left = start.x + 'px';
        rectEl.style.top = start.y + 'px';
        rectEl.style.width = '0px';
        rectEl.style.height = '0px';
    }

    function onMove(e) {
        if (!dragging) return;

        e.preventDefault();
        e.stopPropagation();

        const r = overlay.getBoundingClientRect();

        last = {
            x: e.clientX - r.left,
            y: e.clientY - r.top
        };

        const left = Math.min(start.x, last.x);
        const top = Math.min(start.y, last.y);

        rectEl.style.left = left + 'px';
        rectEl.style.top = top + 'px';
        rectEl.style.width = Math.abs(last.x - start.x) + 'px';
        rectEl.style.height = Math.abs(last.y - start.y) + 'px';
    }

    function onUp(e) {
        if (!dragging) return;

        e.preventDefault();
        e.stopPropagation();

        dragging = false;

        try {
            overlay.releasePointerCapture?.(e.pointerId);
        } catch (_) {}

        const dx = Math.abs(last.x - start.x);
        const dy = Math.abs(last.y - start.y);

        if (dx >= 6 || dy >= 6) {
            selectRegion(start.x, start.y, last.x, last.y);
        }

        rectEl.style.display = 'none';
    }

    function onCancel(e) {
        dragging = false;

        try {
            overlay.releasePointerCapture?.(e.pointerId);
        } catch (_) {}

        if (rectEl) {
            rectEl.style.display = 'none';
        }
    }

    Plugin.register(plugin_id, {
        title: '3D Region Select Mobile',
        author: 'HorrorGirl',
        description: 'Mobile 3D box selection for Blockbench with a dedicated Tools menu entry. Cubes are selected when their projected center is inside the selection frame. UV selection is not used.',
        icon: 'icon.svg',
        version: plugin_version,
        variant: 'both',
        min_version: '4.8.0',
        tags: ['Minecraft: Bedrock Edition'],

        onload() {
            tool = new Tool('region_select_3d_mobile_tool', {
                name: '3D Region Select Mobile',
                description: 'Drag a rectangle directly over the 3D viewport to select cubes.',
                icon: 'select_all',
                selectElements: true,
                transformerMode: 'hidden',

                onSelect() {
                    active = true;
                    ensureOverlay();
                    ensurePanel();
                    resizeOverlay();

                    Blockbench.showQuickMessage(
                        '3D region selection: drag directly over the cubes'
                    );
                },

                onUnselect() {
                    active = false;
                    removeOverlay();
                    removePanel();
                }
            });

            tool.plugin = plugin_id;

            if (typeof BarItems !== 'undefined' && BarItems.element_tool) {
                tool.toElement(BarItems.element_tool);
            }

            toolAction = new Action('region_select_3d_mobile_activate', {
                name: '3D Region Select Mobile',
                description: 'Activate the mobile 3D region selection tool.',
                icon: 'select_all',

                click() {
                    if (tool) tool.select();
                }
            });

            addAction = new Action('region_select_3d_mobile_add_mode', {
                name: '3D Region Select: Add Mode',
                description: 'Activate the selector and add selected cubes to the current selection.',
                icon: 'add',

                click() {
                    if (tool) tool.select();
                    setMode('add');
                }
            });

            toggleAction = new Action('region_select_3d_mobile_toggle_mode', {
                name: '3D Region Select: Toggle Mode',
                description: 'Activate the selector and toggle selected cubes.',
                icon: 'swap_horiz',

                click() {
                    if (tool) tool.select();
                    setMode('toggle');
                }
            });

            clearAction = new Action('region_select_3d_mobile_clear', {
                name: 'Clear 3D Region Selection',
                description: 'Clear all selected cubes.',
                icon: 'clear',

                click: clearSelection
            });

            [toolAction, addAction, toggleAction, clearAction].forEach(
                action => action.plugin = plugin_id
            );

            if (
                typeof MenuBar !== 'undefined' &&
                MenuBar.menus &&
                MenuBar.menus.tools
            ) {
                MenuBar.menus.tools.addAction(toolAction);
                MenuBar.menus.tools.addAction(addAction);
                MenuBar.menus.tools.addAction(toggleAction);
                MenuBar.menus.tools.addAction(clearAction);
            }

            Blockbench.on('update_selection', resizeOverlay);

            window.addEventListener('resize', resizeOverlay);
            window.addEventListener('scroll', resizeOverlay, true);
        },

        onunload() {
            active = false;

            removeOverlay();
            removePanel();

            window.removeEventListener('resize', resizeOverlay);
            window.removeEventListener('scroll', resizeOverlay, true);

            if (toolAction) toolAction.delete();
            if (addAction) addAction.delete();
            if (toggleAction) toggleAction.delete();
            if (clearAction) clearAction.delete();

            if (tool) tool.delete();

            toolAction = null;
            addAction = null;
            toggleAction = null;
            clearAction = null;
            tool = null;
        }
    });
})();