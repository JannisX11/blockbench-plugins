/**
 * SB Worn Display Editor — Custom Display Reference Editor for Blockbench
 *
 * Display パネル内、Reference Model の下に "Custom Slot" 行を追加し、
 * 本体の Slot 行と同じ見た目 (panel_toolbar_label + tabs_small icon_bar +
 * label.tool + material-icons) でカスタム display key を選択・編集できる
 * ようにする。スライダーは本体の Display パネルそのままを流用。
 *
 * カスタム display key:
 *   - sophisticatedbackpacks:worn       (SB の Curios back 装備時)
 *   - the_four_primitives_and_weapons:back  (MAW saya の Curios back 装備時)
 *   - the_four_primitives_and_weapons:belt  (MAW saya の Curios belt 装備時)
 *
 * 仕組み:
 *   1. displayReferenceObjects.slots (= DisplayMode.slots) に key を push
 *      → JSON 保存/読込で必須
 *   2. Display パネルの DOM に Blockbench 標準書式の "Custom Slot" 行を注入
 *      ─ label の class / icon_bar 構造は本体と同一なので追加 CSS 不要
 *      ─ Reference Model の下に出るので折り返しに埋もれない
 *   3. ボタン click 時は DisplayMode.loadHead() を踏み台にカメラ/Reference
 *      バーをセットアップ、その後 DisplayMode.slot をカスタムキーに上書き
 *   4. MutationObserver で Vue 再レンダ時も自動再注入
 *
 * Author: hrmcngs
 * Source: https://github.com/hrmcngs/sb-worn-display-blockbench
 * License: MIT
 */
(function () {
    const PLUGIN_ID = 'sb_worn_display';

    const TARGETS = [
        {
            key: 'sophisticatedbackpacks:worn',
            tooltip: 'SB Worn (背中・SB) — sophisticatedbackpacks:worn',
            icon: 'backpack',
        },
        {
            key: 'the_four_primitives_and_weapons:back',
            tooltip: 'MAW Saya Back (背中・MAW鞘) — the_four_primitives_and_weapons:back',
            icon: 'straighten',
        },
        {
            key: 'the_four_primitives_and_weapons:belt',
            tooltip: 'MAW Saya Belt (ベルト・MAW鞘) — the_four_primitives_and_weapons:belt',
            icon: 'linear_scale',
        },
    ];

    const REF_BAR_ID = 'display_ref_bar';
    const CUSTOM_BAR_ID = 'sb_custom_display_bar';
    const CUSTOM_LABEL_ID = 'sb_custom_display_label';
    const INJECTED_ATTR = 'data-sb-custom-slot';

    const actions = [];
    let observer = null;
    let modeListener = null;

    function safeId(key) {
        return 'sbcd_' + key.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }

    function getProject() {
        return (typeof Project !== 'undefined') ? Project : null;
    }

    // ─── custom slot loader ────────────────────────────────────────────
    // DisplayMode.loadHead() を踏み台にカメラ/Reference バーを設定し
    // その後 slot をカスタムキーに差し替える。
    function loadCustomSlot(target, options) {
        // options.silent     : true なら通知メッセージを出さない
        // options.autoEnterDisplay : false なら Display モードへの自動切替を抑止
        // options.skipCameraReset  : true なら DisplayMode.loadHead() をスキップ
        //                             (タブ切替時に視点が暴れるのを防ぐ)
        const opts = options || {};
        const p = getProject();
        if (!p) {
            if (!opts.silent) Blockbench.showQuickMessage('モデルを開いてください', 1500);
            return;
        }
        if (typeof DisplayMode === 'undefined' || !DisplayMode.loadHead) {
            if (!opts.silent) Blockbench.showQuickMessage('DisplayMode が利用できません', 1500);
            return;
        }

        if (!p.display_settings) p.display_settings = {};
        if (!p.display_settings[target.key]) {
            p.display_settings[target.key] = new DisplaySlot(target.key);
        }

        if (opts.autoEnterDisplay !== false) {
            try {
                if (typeof Modes !== 'undefined' && Modes.options && Modes.options.display && !Modes.display) {
                    Modes.options.display.select();
                }
            } catch (e) { }
        }

        if (!opts.skipCameraReset) {
            try {
                DisplayMode.loadHead();
            } catch (e) {
                console.warn('[' + PLUGIN_ID + '] loadHead failed', e);
            }
        }

        DisplayMode.display_slot = target.key;
        DisplayMode.slot = p.display_settings[target.key];
        if (DisplayMode.vue && DisplayMode.vue._data) {
            DisplayMode.vue._data.slot = p.display_settings[target.key];
        }

        try { DisplayMode.updateDisplayBase(); } catch (e) { }
        try { if (DisplayMode.vue && DisplayMode.vue.$forceUpdate) DisplayMode.vue.$forceUpdate(); } catch (e) { }

        // radio の checked 状態を同期 (Blockbench 本体の :checked ハイライトに乗る)
        const radio = document.getElementById(safeId(target.key));
        if (radio) radio.checked = true;
    }

    // タブ切替 (select_project) 用: 旧プロジェクトの slot オブジェクトを
    // 参照したまま残ると updateDisplayBase が古い値を読みに行き、モデルが
    // 変な位置に飛ぶ。新プロジェクトの display_settings に再バインドする。
    //
    // 過去版 (v4.2.2) では loadHead をスキップしてカメラリセット回避をして
    // いたが、loadHead は同時に Reference Model バーの再ポピュレートも
    // やるため、スキップすると人型モデル (player 等) が消える副作用が出た。
    // 現実装: loadHead は呼ぶが、その前後でカメラ位置を save/restore して
    // ユーザーの視点だけは維持する。
    function rebindActiveCustomSlot() {
        if (typeof DisplayMode === 'undefined') return;
        if (typeof Modes === 'undefined' || !Modes.display) return;
        const target = TARGETS.find((t) => t.key === DisplayMode.display_slot);
        if (!target) return;

        // カメラ状態を一時退避
        let savedPos = null, savedTarget = null;
        try {
            if (typeof display_preview !== 'undefined'
                && display_preview.camPers && display_preview.controls) {
                savedPos = display_preview.camPers.position.toArray();
                savedTarget = display_preview.controls.target.toArray();
            }
        } catch (e) { }

        // フル再セットアップ (slot + Vue + Reference Model バー)
        loadCustomSlot(target, {
            silent: true,
            autoEnterDisplay: false,
            skipCameraReset: false,
        });

        // カメラ視点だけ復元
        try {
            if (savedPos && savedTarget
                && typeof display_preview !== 'undefined'
                && display_preview.camPers && display_preview.controls) {
                display_preview.camPers.position.fromArray(savedPos);
                display_preview.controls.target.fromArray(savedTarget);
                if (display_preview.controls.update) display_preview.controls.update();
                if (display_preview.render) display_preview.render();
            }
        } catch (e) { }
    }

    // ─── DOM injection: standard Blockbench slot-row format ────────────
    // 本体の Display パネル DisplayModePanel.vue と同じ書式:
    //   <p class="panel_toolbar_label">…</p>
    //   <div class="bar tabs_small icon_bar">
    //     <input class="hidden" type="radio" name="display" id="…">
    //     <label class="tool" for="…">
    //       <div class="tooltip">…</div>
    //       <i class="material-icons">…</i>
    //     </label>
    //     …
    //   </div>

    function buildCustomBar() {
        const label = document.createElement('p');
        label.id = CUSTOM_LABEL_ID;
        label.className = 'panel_toolbar_label';
        label.setAttribute(INJECTED_ATTR, 'label');
        label.textContent = 'Custom Slot';

        const bar = document.createElement('div');
        bar.id = CUSTOM_BAR_ID;
        bar.className = 'bar tabs_small icon_bar';
        bar.setAttribute(INJECTED_ATTR, 'bar');

        TARGETS.forEach((target) => {
            const id = safeId(target.key);

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'display';
            input.id = id;
            input.className = 'hidden';
            input.setAttribute(INJECTED_ATTR, target.key);

            const tool = document.createElement('label');
            tool.className = 'tool';
            tool.htmlFor = id;
            tool.setAttribute(INJECTED_ATTR, target.key);

            const tip = document.createElement('div');
            tip.className = 'tooltip';
            tip.textContent = target.tooltip;
            tool.appendChild(tip);

            const icon = document.createElement('i');
            icon.className = 'material-icons';
            icon.textContent = target.icon;
            tool.appendChild(icon);

            tool.addEventListener('click', () => loadCustomSlot(target));

            bar.appendChild(input);
            bar.appendChild(tool);
        });

        return { label, bar };
    }

    function injectCustomBar() {
        if (document.getElementById(CUSTOM_BAR_ID)) return;
        const refBar = document.getElementById(REF_BAR_ID);
        if (!refBar || !refBar.parentNode) return;
        const { label, bar } = buildCustomBar();
        // Reference Model の直後に label → bar の順で挿入
        refBar.parentNode.insertBefore(label, refBar.nextSibling);
        label.parentNode.insertBefore(bar, label.nextSibling);
        // 現在の display_slot がカスタムキーなら radio を checked に
        try {
            if (typeof DisplayMode !== 'undefined' && DisplayMode.display_slot) {
                const radio = document.getElementById(safeId(DisplayMode.display_slot));
                if (radio) radio.checked = true;
            }
        } catch (e) { }
    }

    function removeInjected() {
        document.querySelectorAll('[' + INJECTED_ATTR + ']').forEach((el) => el.remove());
    }

    function setupObserver() {
        if (observer) return;
        observer = new MutationObserver(() => {
            if (!document.getElementById(REF_BAR_ID)) return;
            if (!document.getElementById(CUSTOM_BAR_ID)) injectCustomBar();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function teardownObserver() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    // ─── Edit dialog (Tools menu, numeric direct entry) ────────────────

    function getSlotValues(key) {
        const p = getProject();
        const def = { rotation: [0, 0, 0], translation: [0, 0, 0], scale: [1, 1, 1] };
        if (!p || !p.display_settings) return def;
        const s = p.display_settings[key];
        if (!s) return def;
        return {
            rotation: (s.rotation || [0, 0, 0]).slice(),
            translation: (s.translation || [0, 0, 0]).slice(),
            scale: (s.scale || [1, 1, 1]).slice(),
        };
    }

    function setSlotValues(key, v) {
        const p = getProject();
        if (!p) {
            Blockbench.showQuickMessage('モデルを開いてください', 1500);
            return false;
        }
        if (!p.display_settings) p.display_settings = {};
        if (!p.display_settings[key]) p.display_settings[key] = new DisplaySlot(key);
        const slot = p.display_settings[key];
        slot.rotation = v.rotation.slice();
        slot.translation = v.translation.slice();
        slot.scale = v.scale.slice();
        if (p.saved !== undefined) p.saved = false;
        try { DisplayMode.updateDisplayBase(); } catch (e) { }
        return true;
    }

    function openEditDialog(target) {
        const cur = getSlotValues(target.key);
        const dlg = new Dialog({
            id: 'edit_' + safeId(target.key),
            title: 'Edit: ' + target.tooltip,
            width: 480,
            form: {
                _info: { type: 'info', text: target.tooltip + '\n\n' + target.key },
                _div1: '_',
                rotX: { label: 'Rotation X', type: 'number', value: cur.rotation[0], step: 1 },
                rotY: { label: 'Rotation Y', type: 'number', value: cur.rotation[1], step: 1 },
                rotZ: { label: 'Rotation Z', type: 'number', value: cur.rotation[2], step: 1 },
                _div2: '_',
                transX: { label: 'Translation X', type: 'number', value: cur.translation[0], step: 0.1 },
                transY: { label: 'Translation Y', type: 'number', value: cur.translation[1], step: 0.1 },
                transZ: { label: 'Translation Z', type: 'number', value: cur.translation[2], step: 0.1 },
                _div3: '_',
                scaleX: { label: 'Scale X', type: 'number', value: cur.scale[0], step: 0.05 },
                scaleY: { label: 'Scale Y', type: 'number', value: cur.scale[1], step: 0.05 },
                scaleZ: { label: 'Scale Z', type: 'number', value: cur.scale[2], step: 0.05 },
            },
            buttons: ['dialog.confirm', 'dialog.cancel'],
            onConfirm(result) {
                setSlotValues(target.key, {
                    rotation: [result.rotX, result.rotY, result.rotZ],
                    translation: [result.transX, result.transY, result.transZ],
                    scale: [result.scaleX, result.scaleY, result.scaleZ],
                });
                Blockbench.showQuickMessage(target.tooltip.split(' — ')[0] + ' を更新しました (Ctrl+S で保存)', 2000);
                dlg.hide();
            },
        });
        dlg.show();
    }

    // ─── Import display values from another model file ────────────────
    // 別のモデルファイル (.json / .bbmodel) を開き、その display 値を
    // 現在のプロジェクトのカスタムスロットに取り込む。
    // ダイアログで「ソーススロット」「ターゲットスロット」「Rotation/
    // Translation/Scale のどれを取り込むか」を選択できるので、部分置換可。

    function formatSlotPreview(slot) {
        if (!slot) return '(empty)';
        const fmt = (a, def) => {
            const arr = Array.isArray(a) ? a : def;
            return '[' + arr.map((n) => {
                const num = Number(n);
                return isFinite(num) ? Number(num.toFixed(3)) : 0;
            }).join(', ') + ']';
        };
        return [
            'rotation:    ' + fmt(slot.rotation, [0, 0, 0]),
            'translation: ' + fmt(slot.translation, [0, 0, 0]),
            'scale:       ' + fmt(slot.scale, [1, 1, 1]),
        ].join('\n');
    }

    function applyImport(sourceDisplay, result) {
        const p = getProject();
        if (!p) {
            Blockbench.showQuickMessage('モデルを開いてください', 1500);
            return;
        }
        const src = sourceDisplay[result.sourceKey];
        if (!src) {
            Blockbench.showQuickMessage('ソースに対象キー無し: ' + result.sourceKey, 1800);
            return;
        }
        if (!p.display_settings) p.display_settings = {};
        if (!p.display_settings[result.targetKey]) {
            p.display_settings[result.targetKey] = new DisplaySlot(result.targetKey);
        }
        const dst = p.display_settings[result.targetKey];
        const applied = [];
        if (result.useRotation && Array.isArray(src.rotation)) {
            dst.rotation = src.rotation.slice();
            applied.push('rotation');
        }
        if (result.useTranslation && Array.isArray(src.translation)) {
            dst.translation = src.translation.slice();
            applied.push('translation');
        }
        if (result.useScale && Array.isArray(src.scale)) {
            dst.scale = src.scale.slice();
            applied.push('scale');
        }
        if (applied.length === 0) {
            Blockbench.showQuickMessage('何もチェックされていません', 1500);
            return;
        }
        if (p.saved !== undefined) p.saved = false;
        try { DisplayMode.updateDisplayBase(); } catch (e) { }
        try { if (DisplayMode.vue && DisplayMode.vue.$forceUpdate) DisplayMode.vue.$forceUpdate(); } catch (e) { }
        Blockbench.showQuickMessage(
            result.targetKey + ' ← ' + result.sourceKey + ' (' + applied.join(' + ') + ')',
            2800);
    }

    function openImportDialog(sourceDisplay, sourceFileName) {
        const sourceKeys = Object.keys(sourceDisplay);
        const customKeys = TARGETS.map((t) => t.key);

        // Default target = 現在 Display パネルで選択中のカスタムキー (あれば)
        let defaultTarget = customKeys[0];
        if (typeof DisplayMode !== 'undefined'
            && customKeys.includes(DisplayMode.display_slot)) {
            defaultTarget = DisplayMode.display_slot;
        }
        // Default source = ターゲットと同名キーがあればそれ、無ければ先頭
        let defaultSource = sourceKeys.includes(defaultTarget) ? defaultTarget : sourceKeys[0];

        const sourceOptions = {};
        sourceKeys.forEach((k) => { sourceOptions[k] = k; });
        const targetOptions = {};
        customKeys.forEach((k) => { targetOptions[k] = k; });

        const dlg = new Dialog({
            id: 'sb_import_display_dialog',
            title: 'Import display values from ' + sourceFileName,
            width: 560,
            form: {
                _src_info: {
                    type: 'info',
                    text: 'Source file: ' + sourceFileName
                        + '\nKeys with display data: ' + sourceKeys.join(', '),
                },
                sourceKey: {
                    label: 'Source slot',
                    type: 'select',
                    options: sourceOptions,
                    value: defaultSource,
                },
                targetKey: {
                    label: 'Target slot',
                    type: 'select',
                    options: targetOptions,
                    value: defaultTarget,
                },
                _div1: '_',
                _fields_label: {
                    type: 'info',
                    text: 'Replace which fields (checked fields will overwrite):',
                },
                useRotation: { label: 'Rotation (X / Y / Z)', type: 'checkbox', value: true },
                useTranslation: { label: 'Translation (X / Y / Z)', type: 'checkbox', value: true },
                useScale: { label: 'Scale (X / Y / Z)', type: 'checkbox', value: true },
                _div2: '_',
                _preview: {
                    type: 'info',
                    text: 'Source values preview (' + defaultSource + '):\n'
                        + formatSlotPreview(sourceDisplay[defaultSource]),
                },
            },
            buttons: ['dialog.confirm', 'dialog.cancel'],
            onConfirm(result) {
                applyImport(sourceDisplay, result);
                dlg.hide();
            },
        });
        dlg.show();
    }

    function importDisplayFromFile() {
        if (typeof Blockbench === 'undefined' || !Blockbench.import) {
            Blockbench.showQuickMessage('Blockbench.import が利用できません', 1500);
            return;
        }
        Blockbench.import({
            resource_id: 'sb_import_display',
            extensions: ['json', 'bbmodel'],
            type: 'JSON / Blockbench model',
            readtype: 'text',
        }, function (files) {
            if (!files || !files[0] || !files[0].content) return;
            const file = files[0];
            let parsed;
            try { parsed = JSON.parse(file.content); }
            catch (e) {
                Blockbench.showMessageBox({
                    title: 'JSON parse error',
                    message: 'Failed to parse file:\n' + (e && e.message ? e.message : e),
                });
                return;
            }
            const displayData = parsed.display || parsed.display_settings;
            if (!displayData || typeof displayData !== 'object'
                || Object.keys(displayData).length === 0) {
                Blockbench.showMessageBox({
                    title: 'No display data',
                    message: 'This file has no `display` section.',
                });
                return;
            }
            openImportDialog(displayData, file.name || 'unknown');
        });
    }

    // ─── DisplayMode.slots registration ────────────────────────────────
    // 保存/読込時に DisplayMode.slots に含まれる key だけが処理されるので
    // ここで push しておかないと開き直したとき値が消える。

    function registerSlotsInDisplayMode() {
        if (typeof DisplayMode === 'undefined' || !Array.isArray(DisplayMode.slots)) return;
        TARGETS.forEach((t) => {
            if (!DisplayMode.slots.includes(t.key)) DisplayMode.slots.push(t.key);
        });
    }

    function unregisterSlotsFromDisplayMode() {
        if (typeof DisplayMode === 'undefined' || !Array.isArray(DisplayMode.slots)) return;
        TARGETS.forEach((t) => {
            const i = DisplayMode.slots.indexOf(t.key);
            if (i >= 0) DisplayMode.slots.splice(i, 1);
        });
    }

    // ─── plugin registration ───────────────────────────────────────────

    Plugin.register(PLUGIN_ID, {
        title: 'SB Worn Display Editor',
        author: 'hrmcngs',
        icon: 'backpack',
        description: 'Adds a Custom Slot row to the Display panel so you can edit custom item display keys (Sophisticated Backpacks worn, MAW saya back/belt) visually in the 3D viewport, using the same sliders as the vanilla slots.',
        tags: ['Minecraft: Java Edition', 'Modeling'],
        version: '4.3.0',
        min_version: '4.8.0',
        variant: 'both',
        website: 'https://github.com/hrmcngs/sb-worn-display-blockbench',
        repository: 'https://github.com/hrmcngs/sb-worn-display-blockbench',
        bug_tracker: 'https://github.com/hrmcngs/sb-worn-display-blockbench/issues',
        creation_date: '2026-05-31',

        onload() {
            registerSlotsInDisplayMode();

            // Tools メニューに Edit ダイアログ (fallback / 数値入力用)
            TARGETS.forEach((target, idx) => {
                const aEdit = new Action('custom_disp_edit_' + safeId(target.key), {
                    name: '[' + (idx + 1) + '] Edit (numbers): ' + target.tooltip.split(' — ')[0],
                    description: 'ダイアログで ' + target.key + ' を数値編集',
                    icon: 'tune',
                    category: 'edit',
                    click() { openEditDialog(target); },
                });
                try { MenuBar.addAction(aEdit, 'tools'); } catch (e) { }
                actions.push(aEdit);
            });

            // Tools メニューに Import アクション (別モデルから display 値を取り込み)
            const aImport = new Action('custom_disp_import', {
                name: 'Import display values from another model…',
                description: '別の .json / .bbmodel ファイルを開いて display 値 '
                    + '(Rotation / Translation / Scale) を取り込む。'
                    + 'ソース/ターゲットのスロットと取り込む項目をダイアログで選択。',
                icon: 'file_download',
                category: 'edit',
                click() { importDisplayFromFile(); },
            });
            try { MenuBar.addAction(aImport, 'tools'); } catch (e) { }
            actions.push(aImport);

            setupObserver();
            injectCustomBar();

            try {
                modeListener = () => setTimeout(() => {
                    injectCustomBar();
                    rebindActiveCustomSlot();
                }, 50);
                Blockbench.on('select_mode', modeListener);
                Blockbench.on('select_project', modeListener);
            } catch (e) { }

            console.log('[' + PLUGIN_ID + '] v4.3.0 loaded — '
                + TARGETS.length + ' custom display slots available');
        },

        onunload() {
            teardownObserver();
            removeInjected();
            unregisterSlotsFromDisplayMode();
            try {
                if (modeListener) {
                    Blockbench.removeListener('select_mode', modeListener);
                    Blockbench.removeListener('select_project', modeListener);
                }
            } catch (e) { }
            modeListener = null;
            actions.forEach((a) => { try { a.delete(); } catch (e) { } });
            actions.length = 0;
        },
    });
})();
