/*
 * Onion Skin — Cmetanochka Creations
 * Discord: https://discord.gg/Xjp4ApB2qg
 *
 * Свободно для использования с указанием авторства (Cmetanochka Creations).
 * Нельзя перезаливать или продавать как своё. Правки — только для личного пользования.
 *
 * Free to use with attribution (Cmetanochka Creations).
 * Do not reupload or sell as your own. Edits for personal use only.
 *
 * © Cmetanochka Creations. Provided "as is", without warranty.
 */
(function () {
    function L(ru, en) { try { return (typeof Language !== 'undefined' && Language.code === 'ru') ? ru : en; } catch (e) { return en; } }
    let act_toggle, act_settings;
    let enabled = false;
    let ghosts = [];
    let pastMat = null, futureMat = null;
    let building = false, dirty = false;
    let lastBuiltTime = null;
    const cfg = { prev: 1, next: 1, opacity: 0.28 };
    const OS_DEFAULTS = { prev: 1, next: 1, opacity: 0.28 };

    const onFrame = () => tick();
    const markDirty = () => { dirty = true; };

    function scene() { return (typeof Canvas !== 'undefined' && Canvas.scene) ? Canvas.scene : (typeof window !== 'undefined' ? window.scene : null); }

    function makeMats() {
        if (typeof THREE === 'undefined') return;
        pastMat = new THREE.MeshBasicMaterial({ color: 0xff4d4d, transparent: true, opacity: cfg.opacity, depthWrite: false, side: THREE.DoubleSide });
        futureMat = new THREE.MeshBasicMaterial({ color: 0x4dff88, transparent: true, opacity: cfg.opacity, depthWrite: false, side: THREE.DoubleSide });
    }

    function tint(root, past) {
        const mat = past ? pastMat : futureMat;
        root.traverse(o => {
            if (o.isMesh) {
                o.material = mat;
                o.castShadow = false;
                o.receiveShadow = false;
                o.raycast = function () {};   // призраки не ловят клики
            } else if (o.isLine || o.isPoints) {
                o.visible = false;
            }
        });
    }

    function clearGhosts() {
        ghosts.forEach(g => { if (g.parent) g.parent.remove(g); });
        ghosts = [];
    }

    function collectTimes(anim) {
        const set = new Set();
        for (const id in anim.animators) {
            const an = anim.animators[id];
            if (an && an.keyframes) an.keyframes.forEach(kf => set.add(Math.round(kf.time * 1000) / 1000));
        }
        return [...set].sort((a, b) => a - b);
    }

    function rebuild() {
        if (building) return;
        clearGhosts();
        if (!enabled) return;
        if (typeof Modes !== 'undefined' && !Modes.animate) return;
        if (typeof Animation === 'undefined' || !Animation.selected) return;
        if (typeof Timeline !== 'undefined' && Timeline.playing) return;
        if (typeof Project === 'undefined' || !Project || !Project.model_3d) return;
        const sc = scene(); if (!sc) return;

        const anim = Animation.selected;
        const now = Timeline.time;
        const sorted = collectTimes(anim);
        const prevs = sorted.filter(t => t < now - 1e-4).slice(-cfg.prev);
        const nexts = sorted.filter(t => t > now + 1e-4).slice(0, cfg.next);

        lastBuiltTime = now;
        if (!prevs.length && !nexts.length) return;

        building = true;
        const parent = Project.model_3d.parent || sc;
        const saved = Timeline.time;
        const jobs = [];
        prevs.forEach(t => jobs.push([t, true]));
        nexts.forEach(t => jobs.push([t, false]));

        jobs.forEach(([t, past]) => {
            Timeline.time = t;
            try { Animator.preview(); } catch (e) {}
            let clone = null;
            try { clone = Project.model_3d.clone(true); } catch (e) { clone = null; }
            if (clone) { tint(clone, past); parent.add(clone); ghosts.push(clone); }
        });

        Timeline.time = saved;
        try { Animator.preview(); } catch (e) {}
        lastBuiltTime = saved;
        building = false;
    }

    function tick() {
        if (!enabled || building) return;
        if (typeof Timeline === 'undefined') return;
        if (Timeline.playing) return;   // при проигрывании призраки замирают, но остаются видимыми
        if (dirty || Timeline.time !== lastBuiltTime) { dirty = false; rebuild(); }
    }

    function setEnabled(on) {
        enabled = on;
        if (enabled) {
            lastBuiltTime = null; dirty = true;
            rebuild();
            Blockbench.showQuickMessage(L('Onion Skin: вкл','Onion Skin: on'), 1200);
        } else {
            clearGhosts();
            Blockbench.showQuickMessage(L('Onion Skin: выкл','Onion Skin: off'), 1200);
        }
    }

    function settingsDialog() {
        let dlg;
        function applyCfgToMats() {
            if (pastMat) pastMat.opacity = cfg.opacity;
            if (futureMat) futureMat.opacity = cfg.opacity;
            if (enabled) { dirty = true; rebuild(); }
        }
        dlg = new Dialog({
            id: 'onion_skin_settings',
            title: L('Onion Skin — настройки','Onion Skin — settings'),
            darken: false,
            buttons: [L('Сбросить','Reset'), L('Готово','Done')],
            confirmIndex: 1,
            cancelIndex: 1,
            form: {
                prev: { label: L('Кадров назад','Frames back'), type: 'number', value: cfg.prev, min: 0, max: 5, step: 1 },
                next: { label: L('Кадров вперёд','Frames ahead'), type: 'number', value: cfg.next, min: 0, max: 5, step: 1 },
                opacity: { label: L('Прозрачность','Opacity'), type: 'range', value: cfg.opacity, min: 0.05, max: 0.7, step: 0.01, editable_range_label: true, full_width: true },
                info: { type: 'info', text: L('Красные призраки — предыдущие ключевые кадры, зелёные — следующие. Показываются относительно позиции ползунка. Работают в режиме анимации.', 'Red ghosts are the previous keyframes, green ones are the next. They are shown relative to the playhead position. Works in animation mode.') }
            },
            onFormChange(r) {
                cfg.prev = Math.round(r.prev); cfg.next = Math.round(r.next); cfg.opacity = r.opacity;
                applyCfgToMats();
            },
            onButton(index) {
                if (index === 0) {   // «Сбросить» — вернуть значения по умолчанию, окно не закрывать
                    cfg.prev = OS_DEFAULTS.prev; cfg.next = OS_DEFAULTS.next; cfg.opacity = OS_DEFAULTS.opacity;
                    dlg.setFormValues({ prev: cfg.prev, next: cfg.next, opacity: cfg.opacity });
                    applyCfgToMats();
                    return false;
                }
            }
        });
        dlg.show();
    }

    Plugin.register('onion_skin', {
        title: 'Onion Skin',
        author: 'Cmetanochkaa (Cmetanochka Creations)',
        website: 'https://discord.gg/Xjp4ApB2qg',
        icon: 'icon.png',
        description: L('Полупрозрачные «призраки» модели на соседних ключевых кадрах — помогает выверять дуги движения. Красные = предыдущие кадры, зелёные = следующие.', 'Semi-transparent "ghosts" of the model on neighboring keyframes — helps you refine motion arcs. Red = previous keyframes, green = next.'),
        version: '1.0.0',
        variant: 'both',
        min_version: '4.8.0',
        tags: ['Animation', 'Timeline'],

        onload() {
            makeMats();

            act_toggle = new Action('onion_skin_toggle', {
                name: L('Onion Skin (вкл/выкл)','Onion Skin (on/off)'),
                description: L('Показать призраков соседних ключевых кадров','Show ghosts of neighboring keyframes'),
                icon: 'auto_awesome_motion',
                category: 'animation',
                condition: { modes: ['animate'] },
                click: () => setEnabled(!enabled)
            });
            act_settings = new Action('onion_skin_settings', {
                name: L('Onion Skin — настройки','Onion Skin — settings'),
                description: L('Сколько кадров до/после и прозрачность призраков','How many frames before/after and ghost opacity'),
                icon: 'tune',
                category: 'animation',
                condition: { modes: ['animate'] },
                click: settingsDialog
            });

            try { MenuBar.addAction(act_toggle, 'animation'); } catch (e) {}
            try { MenuBar.addAction(act_settings, 'animation'); } catch (e) {}
            for (const a of [act_toggle, act_settings]) {
                for (const id of ['timeline', 'main_tools', 'tools']) {
                    try { if (Toolbars[id] && !Toolbars[id].children.includes(a)) { Toolbars[id].add(a, -1); break; } } catch (e) {}
                }
            }

            Blockbench.on('render_frame', onFrame);
            Blockbench.on('update_keyframe_selection', markDirty);
            Blockbench.on('select_animation', markDirty);
            Blockbench.on('timeline_pause', markDirty);
        },

        onunload() {
            setEnabled(false);
            try { Blockbench.removeListener('render_frame', onFrame); } catch (e) {}
            try { Blockbench.removeListener('update_keyframe_selection', markDirty); } catch (e) {}
            try { Blockbench.removeListener('select_animation', markDirty); } catch (e) {}
            try { Blockbench.removeListener('timeline_pause', markDirty); } catch (e) {}
            if (pastMat) pastMat.dispose();
            if (futureMat) futureMat.dispose();
            if (act_toggle) act_toggle.delete();
            if (act_settings) act_settings.delete();
        }
    });
})();
