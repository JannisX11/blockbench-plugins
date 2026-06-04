/**
 * SB Worn Display Editor — Custom Display Reference Editor for Blockbench
 *
 * Display パネル内、Reference Model の下に "Custom Slot" 行を追加し、
 * 本体の Slot 行と同じ見た目 (panel_toolbar_label + tabs_small icon_bar +
 * label.tool + material-icons) でカスタム display key を選択・編集できる
 * ようにする。スライダーは本体の Display パネルそのままを流用。
 *
 * カスタム display key:
 *   - sophisticatedbackpacks:worn          (SB の Curios back 装備時)
 *   - the_four_primitives_and_weapons:back (MAW saya の Curios back 装備時)
 *   - the_four_primitives_and_weapons:belt (MAW saya の Curios belt 装備時)
 *   - backpack_arsenal:chestplate          (Backpack-Arsenal の胸甲スタイル装着時)
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

    // anchorY: Display プレビューで co (display_area) を置く Y 座標。
    //   loadHead() のデフォルトは y=28 (顔の中心) だが、custom slot ごとに
    //   別のリファレンス点に動かしたい場合 anchorY で上書きする。
    //   プレイヤーリファレンス (32px tall Steve) の基準:
    //     y=28: 顔の中心
    //     y=24: 首・頭の付け根 (head bone pivot)
    //     y=18: 胸・腕の中心
    //     y=12: 腰・ベルト位置 (body bone pivot in Minecraft)
    //     y= 8: 太もも
    //     y= 0: 足元
    // syncGroup: 同じ値 (rotation / translation / scale) を共有させたいスロット
    //   を同じ文字列でグルーピングする。例えば 'back' を付けた slot は、
    //   どれかが編集されると 200ms 以内に他の同 group メンバーに値が伝播する。
    //   背中装着の SB worn と MAW back saya は同じ位置なので同期させる。
    const TARGETS = [
        {
            key: 'sophisticatedbackpacks:worn',
            tooltip: 'SB Worn (背中・SB) — sophisticatedbackpacks:worn',
            icon: 'backpack',
            anchorY: 18, // 胸 (バックパック装着位置)
            syncGroup: 'back',
        },
        {
            key: 'the_four_primitives_and_weapons:back',
            tooltip: 'MAW Saya Back (背中・MAW鞘) — the_four_primitives_and_weapons:back',
            icon: 'straighten',
            anchorY: 18, // 胸〜背中の中心
            syncGroup: 'back',
        },
        {
            key: 'the_four_primitives_and_weapons:belt',
            tooltip: 'MAW Saya Belt (ベルト・MAW鞘) — the_four_primitives_and_weapons:belt',
            icon: 'linear_scale',
            anchorY: 12, // 腰・ベルト位置
            // (belt は独立)
        },
        {
            // Backpack-Arsenal のカスタムバックパックを「胸甲 (chestplate) スタイル」で
            // 装着・描画する用の display context。mod 側で
            //   ItemDisplayContext.create("backpack_arsenal:chestplate", ...)
            // を登録し、armor / curios chest スロット描画時にこの context を指定して
            // baked model の applyTransform を呼べば、ここで編集した値が反映される。
            // syncGroup='back' にしてあるので、sb worn / MAW back と同じ値を共有する
            // (背中側の rotation/translation/scale を流用するため)。
            key: 'backpack_arsenal:chestplate',
            tooltip: 'Backpack Arsenal Chestplate (胸甲・カスタムバックパック) — backpack_arsenal:chestplate',
            icon: 'shield',
            anchorY: 18, // 胸 — 体幹中央
            syncGroup: 'back',
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

    // ─── syncGroup: cross-slot value mirroring ─────────────────────────
    // 同じ syncGroup を持つ TARGETS は rotation/translation/scale を共有する。
    // 編集中スロットを 200ms 周期で polling、変更があれば peer slot にコピー。
    // 切替時には「非デフォルトの値を持つ peer」を canonical として採用し、
    // 全 group メンバーに伝播してから polling 開始。

    let syncTimer = null;
    let syncLastSnap = null;
    let syncActiveKey = null;

    function snapshotSlotData(slot) {
        if (!slot) return '';
        return JSON.stringify({
            r: (slot.rotation || []).slice(),
            t: (slot.translation || []).slice(),
            s: (slot.scale || []).slice(),
        });
    }

    function isDefaultSlot(slot) {
        if (!slot) return true;
        const eq = (a, def) => Array.isArray(a) && a.length === def.length
            && a.every((v, i) => v === def[i]);
        return eq(slot.rotation, [0, 0, 0])
            && eq(slot.translation, [0, 0, 0])
            && eq(slot.scale, [1, 1, 1]);
    }

    function applySlotDataTo(key, source) {
        if (!source) return;
        const p = getProject();
        if (!p) return;
        if (!p.display_settings) p.display_settings = {};
        if (!p.display_settings[key]) {
            p.display_settings[key] = new DisplaySlot(key);
        }
        const dst = p.display_settings[key];
        if (Array.isArray(source.rotation)) dst.rotation = source.rotation.slice();
        if (Array.isArray(source.translation)) dst.translation = source.translation.slice();
        if (Array.isArray(source.scale)) dst.scale = source.scale.slice();
    }

    function propagateToSyncPeers(target) {
        if (!target || !target.syncGroup) return;
        const p = getProject();
        if (!p || !p.display_settings) return;
        const src = p.display_settings[target.key];
        if (!src) return;
        TARGETS
            .filter((t) => t.syncGroup === target.syncGroup && t.key !== target.key)
            .forEach((peer) => applySlotDataTo(peer.key, src));
    }

    // syncGroup 内で「canonical」(基準にすべき) slot を選ぶ:
    //   1. 引数 preferKey の slot が非デフォルト値を持つならそれ
    //   2. 同 group の他 peer のうち非デフォルト値を持つ最初のもの
    //   3. 全部デフォルトなら preferKey
    function pickCanonicalInGroup(syncGroup, preferKey) {
        const p = getProject();
        if (!p || !p.display_settings) return preferKey;
        const peers = TARGETS.filter((t) => t.syncGroup === syncGroup);
        const preferred = peers.find((t) => t.key === preferKey);
        if (preferred) {
            const d = p.display_settings[preferred.key];
            if (d && !isDefaultSlot(d)) return preferred.key;
        }
        for (const t of peers) {
            const d = p.display_settings[t.key];
            if (d && !isDefaultSlot(d)) return t.key;
        }
        return preferKey;
    }

    function stopSync() {
        if (syncTimer) {
            clearInterval(syncTimer);
            syncTimer = null;
        }
        syncLastSnap = null;
        syncActiveKey = null;
    }

    function startSyncFor(target) {
        stopSync();
        if (!target || !target.syncGroup) return;
        const peers = TARGETS.filter((t) => t.syncGroup === target.syncGroup && t.key !== target.key);
        if (peers.length === 0) return;
        syncActiveKey = target.key;
        const p = getProject();
        if (!p || !p.display_settings) return;
        syncLastSnap = snapshotSlotData(p.display_settings[target.key]);

        syncTimer = setInterval(() => {
            try {
                // アクティブな slot が他に切り替わってたら polling 終了
                if (typeof DisplayMode === 'undefined'
                    || DisplayMode.display_slot !== syncActiveKey) {
                    stopSync();
                    return;
                }
                const cp = getProject();
                if (!cp || !cp.display_settings) return;
                const cur = cp.display_settings[syncActiveKey];
                if (!cur) return;
                const snap = snapshotSlotData(cur);
                if (snap === syncLastSnap) return;
                syncLastSnap = snap;
                propagateToSyncPeers(target);
            } catch (e) {
                console.warn('[' + PLUGIN_ID + '] sync poll failed', e);
            }
        }, 200);
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

        // custom slot 固有の anchor Y を適用 (loadHead は y=24+ で「顔」基準に
        // 置くが、ベルトや背中の slot ならもっと下の腰・胸あたりが基準として
        // 自然なので、ここで display_area (= モデルが乗ってる Three.js Object3D)
        // の Y を上書きする)。
        //
        // 同時に da.rotation.z = π (180°) を入れる。Minecraft の
        // LivingEntityRenderer は entity 描画時に scale(-1, -1, 1) で X+Y を
        // 反転させており、Blockbench はそれを適用していないため display 値が
        // 同じでも見え方が点対称になる (= roll 180° ずれる)。Z軸 180° 回転は
        // (x,y,z) → (-x,-y,z) の変換になり scale(-1,-1,1) と等価で、これで
        // Blockbench プレビューが in-game と一致する。
        if (typeof target.anchorY === 'number') {
            const da = (typeof display_area !== 'undefined') ? display_area
                : (DisplayMode.display_area || DisplayMode.display_base || null);
            if (da && da.position) {
                try {
                    da.position.y = target.anchorY;
                    if (da.rotation) {
                        da.rotation.z = Math.PI; // = 180° (Minecraft の scale(-1,-1,1) 相殺)
                    }
                    if (typeof da.updateMatrixWorld === 'function') da.updateMatrixWorld();
                    if (typeof Transformer !== 'undefined' && Transformer.center) Transformer.center();
                } catch (e) {
                    console.warn('[' + PLUGIN_ID + '] anchorY/rotation apply failed', e);
                }
            }
        }

        // syncGroup 設定があれば、まず canonical を pick して値を揃え、
        // その後 polling 開始 (アクティブ slot の編集が peer に伝播する)。
        if (target.syncGroup) {
            const canonicalKey = pickCanonicalInGroup(target.syncGroup, target.key);
            if (canonicalKey && canonicalKey !== target.key && p.display_settings[canonicalKey]) {
                applySlotDataTo(target.key, p.display_settings[canonicalKey]);
                DisplayMode.slot = p.display_settings[target.key];
                if (DisplayMode.vue && DisplayMode.vue._data) {
                    DisplayMode.vue._data.slot = p.display_settings[target.key];
                }
                try { DisplayMode.updateDisplayBase(); } catch (e) { }
            }
            propagateToSyncPeers(target);
            startSyncFor(target);
        } else {
            stopSync();
        }

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
        // 本体の "Rotation" 横にある reset アイコン (.tool.head_right) と同じ
        // パターン: <div class="bar display_slot_section_bar"> で
        // panel_toolbar_label と head_right ボタンを横並びにする。
        const label = document.createElement('div');
        label.id = CUSTOM_LABEL_ID;
        label.className = 'bar display_slot_section_bar';
        label.setAttribute(INJECTED_ATTR, 'label');

        const labelText = document.createElement('p');
        labelText.className = 'panel_toolbar_label';
        labelText.textContent = 'Custom Slot';
        label.appendChild(labelText);

        // 別モデルから値をインポート (Tools メニューと同じ動線・ダイアログ)
        const importBtn = document.createElement('div');
        importBtn.className = 'tool head_right';
        importBtn.setAttribute(INJECTED_ATTR, 'import-btn');
        const importTip = document.createElement('div');
        importTip.className = 'tooltip';
        importTip.textContent = '別モデルから display 値を一括 import';
        importBtn.appendChild(importTip);
        const importIcon = document.createElement('i');
        importIcon.className = 'material-icons';
        importIcon.textContent = 'file_download';
        importBtn.appendChild(importIcon);
        importBtn.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            importDisplayFromFile();
        });
        label.appendChild(importBtn);

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

    // ソースに存在する全 display キー (vanilla = gui/head/ground/firstperson_*/
    // thirdperson_*/fixed/on_shelf/embedded + custom = TARGETS の key) を
    // チェック候補とし、チェック済み slot × チェック済み 9 軸を一括置換。
    // 編集中スロットが置換対象だった場合は Vue を再バインドして slider にも反映。
    function applyBulkImport(sourceDisplay, result) {
        const p = getProject();
        if (!p) {
            Blockbench.showQuickMessage('モデルを開いてください', 1500);
            return;
        }
        if (!p.display_settings) p.display_settings = {};

        // チャンネル × 軸の chosen フラグ
        const channelAxisFlags = {
            rotation:    [!!result.useRotX,   !!result.useRotY,   !!result.useRotZ],
            translation: [!!result.useTransX, !!result.useTransY, !!result.useTransZ],
            scale:       [!!result.useScaleX, !!result.useScaleY, !!result.useScaleZ],
        };
        const anyAxisChecked = Object.values(channelAxisFlags)
            .some((arr) => arr.some(Boolean));
        if (!anyAxisChecked) {
            Blockbench.showQuickMessage('置換する軸が1つも選択されていません', 1800);
            return;
        }
        const channelDefaults = {
            rotation: [0, 0, 0], translation: [0, 0, 0], scale: [1, 1, 1],
        };
        const axisLetters = ['X', 'Y', 'Z'];

        const detail = [];
        const replacedKeys = [];

        Object.keys(sourceDisplay).forEach((key) => {
            const flag = result['slot_' + safeId(key)];
            if (!flag) return;
            const src = sourceDisplay[key];
            if (!src || typeof src !== 'object') return;
            if (!p.display_settings[key]) {
                p.display_settings[key] = new DisplaySlot(key);
            }
            const dst = p.display_settings[key];
            const channelSummary = [];

            Object.keys(channelAxisFlags).forEach((channel) => {
                const axisFlags = channelAxisFlags[channel];
                if (!axisFlags.some(Boolean)) return;          // この channel 全 OFF
                if (!Array.isArray(src[channel])) return;       // source に値なし
                if (!Array.isArray(dst[channel])) {
                    dst[channel] = channelDefaults[channel].slice();
                }
                const next = dst[channel].slice();
                const writtenAxes = [];
                for (let i = 0; i < 3; i++) {
                    if (axisFlags[i] && typeof src[channel][i] === 'number') {
                        next[i] = src[channel][i];
                        writtenAxes.push(axisLetters[i]);
                    }
                }
                if (writtenAxes.length > 0) {
                    dst[channel] = next;                        // 配列差替で Vue 反応
                    channelSummary.push(channel + '.' + writtenAxes.join(''));
                }
            });

            if (channelSummary.length > 0) {
                detail.push(key + ' ← ' + channelSummary.join(' + '));
                replacedKeys.push(key);
            }
        });

        if (replacedKeys.length === 0) {
            Blockbench.showQuickMessage('置換対象がありませんでした (ソースに該当キーが無いか、何もチェックされていない)', 2500);
            return;
        }

        if (p.saved !== undefined) p.saved = false;

        // 編集中スロットが置換対象だった場合、Vue 側の slot 参照も同じオブジェクト
        // に張り直して slider 値を即時更新する。
        try {
            if (typeof DisplayMode !== 'undefined' && DisplayMode.display_slot
                && replacedKeys.includes(DisplayMode.display_slot)) {
                const active = p.display_settings[DisplayMode.display_slot];
                DisplayMode.slot = active;
                if (DisplayMode.vue && DisplayMode.vue._data) {
                    DisplayMode.vue._data.slot = active;
                }
                if (DisplayMode.vue && DisplayMode.vue.$forceUpdate) DisplayMode.vue.$forceUpdate();
            }
        } catch (e) { }
        try { DisplayMode.updateDisplayBase(); } catch (e) { }

        Blockbench.showQuickMessage(
            replacedKeys.length + ' slot 置換完了: ' + detail.join(' / '),
            3500);
    }

    function openImportDialog(sourceDisplay, sourceFileName) {
        const sourceKeys = Object.keys(sourceDisplay);

        // vanilla を先 (Blockbench の Slot 行と同じ順序)、その後 custom (TARGETS)、
        // その他 (未知の名前空間など) は末尾。ソース内のキーすべてが対象候補。
        const VANILLA_ORDER = [
            'thirdperson_righthand', 'thirdperson_lefthand',
            'firstperson_righthand', 'firstperson_lefthand',
            'head', 'gui', 'ground', 'fixed', 'on_shelf', 'embedded',
        ];
        const customKeys = TARGETS.map((t) => t.key);
        const orderedKeys = [];
        VANILLA_ORDER.forEach((k) => { if (sourceKeys.includes(k)) orderedKeys.push(k); });
        customKeys.forEach((k) => { if (sourceKeys.includes(k) && !orderedKeys.includes(k)) orderedKeys.push(k); });
        sourceKeys.forEach((k) => { if (!orderedKeys.includes(k)) orderedKeys.push(k); });

        // 各キーのチェックボックスを生成。デフォルト ON で「全部置換」をワンクリック化。
        const slotFields = {};
        const slotInfoLines = [];
        orderedKeys.forEach((key) => {
            const id = 'slot_' + safeId(key);
            const isCustom = customKeys.includes(key);
            const isVanilla = VANILLA_ORDER.includes(key);
            const tag = isVanilla ? '(vanilla)' : (isCustom ? '(custom)' : '(other)');
            slotFields[id] = {
                label: key + ' ' + tag,
                type: 'checkbox',
                value: true,
            };
            slotInfoLines.push('✓ ' + key + ' ' + tag
                + ' — ' + formatSlotPreview(sourceDisplay[key]).split('\n').map((s) => s.trim()).join(' / '));
        });

        // 9 軸チェックボックス (Rotation/Translation/Scale × X/Y/Z) で部分置換可
        const formDef = {
            _src_info: {
                type: 'info',
                text: 'Source: ' + sourceFileName + '\n\n'
                    + 'カスタムキー対応状況:\n  ' + slotInfoLines.join('\n  '),
            },
            _div0: '_',
            _rot_label: { type: 'info', text: '【Rotation】 取り込む軸:' },
            useRotX: { label: 'Rotation X', type: 'checkbox', value: true },
            useRotY: { label: 'Rotation Y', type: 'checkbox', value: true },
            useRotZ: { label: 'Rotation Z', type: 'checkbox', value: true },
            _trans_label: { type: 'info', text: '【Translation】 取り込む軸:' },
            useTransX: { label: 'Translation X', type: 'checkbox', value: true },
            useTransY: { label: 'Translation Y', type: 'checkbox', value: true },
            useTransZ: { label: 'Translation Z', type: 'checkbox', value: true },
            _scale_label: { type: 'info', text: '【Scale】 取り込む軸:' },
            useScaleX: { label: 'Scale X', type: 'checkbox', value: true },
            useScaleY: { label: 'Scale Y', type: 'checkbox', value: true },
            useScaleZ: { label: 'Scale Z', type: 'checkbox', value: true },
            _div1: '_',
            _slots_label: {
                type: 'info',
                text: '置換するターゲットスロット (ソースに存在する vanilla + custom 全部):',
            },
        };
        Object.assign(formDef, slotFields);

        const dlg = new Dialog({
            id: 'sb_import_display_dialog',
            title: 'Bulk import display values from ' + sourceFileName,
            width: 600,
            form: formDef,
            buttons: ['dialog.confirm', 'dialog.cancel'],
            onConfirm(result) {
                applyBulkImport(sourceDisplay, result);
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

    // ─── Center model at origin ───────────────────────────────────────
    // 全要素の bounding box 中心を (0,0,0) に揃える。Display モードの
    // 回転はワールド原点を軸に回るので、モデルが原点に居る = 回転が
    // モデル中心軸で行われる (= 実質的にピボットが中心になる)。
    //
    // 対応する要素タイプ:
    //   - Cube         : from / to / origin
    //   - Mesh         : vertices (record) / origin
    //   - Locator/Null : position
    //   - Group        : origin (グループ全体のピボット)

    function computeModelBBox() {
        if (!Array.isArray(Project.elements) || Project.elements.length === 0) return null;
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
        let any = false;
        const expand = (x, y, z) => {
            if (!isFinite(x) || !isFinite(y) || !isFinite(z)) return;
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
            if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
            any = true;
        };
        Project.elements.forEach((el) => {
            if (Array.isArray(el.from) && Array.isArray(el.to)) {
                expand(el.from[0], el.from[1], el.from[2]);
                expand(el.to[0], el.to[1], el.to[2]);
            }
            if (el.vertices && typeof el.vertices === 'object') {
                Object.values(el.vertices).forEach((v) => {
                    if (Array.isArray(v) && v.length >= 3) expand(v[0], v[1], v[2]);
                });
            }
            if (Array.isArray(el.position)
                && !Array.isArray(el.from) && !el.vertices) {
                expand(el.position[0], el.position[1], el.position[2]);
            }
        });
        if (!any) return null;
        return {
            min: [minX, minY, minZ],
            max: [maxX, maxY, maxZ],
            center: [(minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2],
            size: [maxX - minX, maxY - minY, maxZ - minZ],
        };
    }

    function applyCenterModel(cx, cy, cz) {
        const elements = Project.elements || [];
        const groups = (typeof Group !== 'undefined' && Group.all) ? Group.all : [];

        // Undo: outliner: true でグループ origin の差分まで含めて snapshot を取る。
        // (v4.4.0 では group: groups 渡しで Undo が効かなかったので修正)
        try {
            if (typeof Undo !== 'undefined' && Undo.initEdit) {
                Undo.initEdit({ elements: elements, outliner: true });
            }
        } catch (e) {
            console.warn('[' + PLUGIN_ID + '] Undo.initEdit failed', e);
        }

        const sub = (a) => [a[0] - cx, a[1] - cy, a[2] - cz];

        elements.forEach((el) => {
            if (Array.isArray(el.from)) el.from = sub(el.from);
            if (Array.isArray(el.to)) el.to = sub(el.to);
            if (Array.isArray(el.origin)) el.origin = sub(el.origin);
            if (Array.isArray(el.position)) el.position = sub(el.position);
            if (el.vertices && typeof el.vertices === 'object') {
                Object.keys(el.vertices).forEach((k) => {
                    const v = el.vertices[k];
                    if (Array.isArray(v) && v.length >= 3) {
                        el.vertices[k] = [v[0] - cx, v[1] - cy, v[2] - cz];
                    }
                });
            }
            try { if (el.preview_controller && el.preview_controller.updateGeometry) el.preview_controller.updateGeometry(el); } catch (e) { }
        });

        groups.forEach((g) => {
            if (Array.isArray(g.origin)) g.origin = sub(g.origin);
        });

        try { Canvas.updateAll(); } catch (e) { }
        try { if (typeof Canvas !== 'undefined' && Canvas.updateAllPositions) Canvas.updateAllPositions(); } catch (e) { }

        try {
            if (typeof Undo !== 'undefined' && Undo.finishEdit) {
                Undo.finishEdit('Center model at origin');
            }
        } catch (e) {
            console.warn('[' + PLUGIN_ID + '] Undo.finishEdit failed', e);
        }

        if (Project && Project.saved !== undefined) Project.saved = false;
    }

    // ─── BBox helpers (shared by Center Model + Center Pivot) ────────

    function computeBBoxOf(elements) {
        if (!Array.isArray(elements) || elements.length === 0) return null;
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
        let any = false;
        const expand = (x, y, z) => {
            if (!isFinite(x) || !isFinite(y) || !isFinite(z)) return;
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
            if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
            any = true;
        };
        elements.forEach((el) => {
            if (Array.isArray(el.from) && Array.isArray(el.to)) {
                expand(el.from[0], el.from[1], el.from[2]);
                expand(el.to[0], el.to[1], el.to[2]);
            } else if (el.vertices && typeof el.vertices === 'object') {
                Object.values(el.vertices).forEach((v) => {
                    if (Array.isArray(v) && v.length >= 3) expand(v[0], v[1], v[2]);
                });
            } else if (Array.isArray(el.position)) {
                expand(el.position[0], el.position[1], el.position[2]);
            }
        });
        if (!any) return null;
        return {
            center: [(minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2],
            size: [maxX - minX, maxY - minY, maxZ - minZ],
        };
    }

    // ─── Center pivot of groups (non-destructive) ─────────────────────
    // 各グループの origin (ピボット) を、その子要素の bbox 中心に設定する。
    // モデル自体のジオメトリは移動しない。Blockbench 標準の "Center Pivot"
    // と同じだが、Tools / outliner ctx menu からまとめて呼べるようにする。

    function applyCenterPivots(targetGroups) {
        if (!Array.isArray(targetGroups) || targetGroups.length === 0) return 0;
        try { Undo.initEdit({ outliner: true, group: targetGroups }); } catch (e) { }
        let count = 0;
        targetGroups.forEach((g) => {
            if (!g || !Array.isArray(g.children)) return;
            const bbox = computeBBoxOf(g.children);
            if (!bbox) return;
            g.origin = bbox.center.slice();
            count++;
        });
        try { Canvas.updateAll(); } catch (e) { }
        try { Undo.finishEdit('Center pivot of groups'); } catch (e) { }
        if (Project && Project.saved !== undefined && count > 0) Project.saved = false;
        return count;
    }

    function centerPivotOfGroups() {
        const p = getProject();
        if (!p) {
            Blockbench.showQuickMessage('モデルを開いてください', 1500);
            return;
        }
        if (typeof Group === 'undefined') {
            Blockbench.showQuickMessage('Group API が利用できません', 1500);
            return;
        }
        // 選択中グループあればそれ、無ければ全グループ
        let targets = [];
        if (Group.selected) {
            targets = [Group.selected];
        } else if (Array.isArray(Group.all)) {
            targets = Group.all.slice();
        }
        if (targets.length === 0) {
            Blockbench.showQuickMessage('対象グループがありません', 1500);
            return;
        }
        const count = applyCenterPivots(targets);
        Blockbench.showQuickMessage(
            count + ' グループのピボットを子 bbox 中心に設定しました', 2200);
    }

    function centerModelAtOrigin() {
        const p = getProject();
        if (!p) {
            Blockbench.showQuickMessage('モデルを開いてください', 1500);
            return;
        }
        const bbox = computeModelBBox();
        if (!bbox) {
            Blockbench.showQuickMessage('要素が見つかりません', 1500);
            return;
        }
        const [cx, cy, cz] = bbox.center;
        if (Math.abs(cx) < 0.001 && Math.abs(cy) < 0.001 && Math.abs(cz) < 0.001) {
            Blockbench.showQuickMessage('既に原点中心です', 1500);
            return;
        }
        const fmt = (n) => (n >= 0 ? '+' : '') + n.toFixed(3);
        Blockbench.showMessageBox({
            title: 'Center Model at Origin',
            message: 'BBox 中心: [' + cx.toFixed(3) + ', ' + cy.toFixed(3) + ', ' + cz.toFixed(3) + ']\n'
                + 'BBox サイズ: [' + bbox.size[0].toFixed(3) + ', ' + bbox.size[1].toFixed(3) + ', ' + bbox.size[2].toFixed(3) + ']\n\n'
                + '全要素 (cube / mesh / locator) とグループ origin を以下だけ平行移動します:\n'
                + '  [' + fmt(-cx) + ', ' + fmt(-cy) + ', ' + fmt(-cz) + ']\n\n'
                + 'これでモデル中心が (0,0,0) に揃い、Display モードの Rotation が\n'
                + 'モデル中心軸を中心に回るようになります。\n\n'
                + '(ジオメトリを直接書き換えます。Ctrl+Z で取り消し可能)',
            buttons: ['Apply', 'Cancel'],
        }, function (btn) {
            if (btn !== 0) return;
            applyCenterModel(cx, cy, cz);
            Blockbench.showQuickMessage(
                'モデル中心化完了: [' + fmt(-cx) + ', ' + fmt(-cy) + ', ' + fmt(-cz) + ']', 2500);
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
        description: 'Adds a Custom Slot row to the Display panel so you can edit custom item display keys (Sophisticated Backpacks worn, MAW saya back/belt, Backpack-Arsenal chestplate) visually in the 3D viewport, using the same sliders as the vanilla slots.',
        tags: ['Minecraft: Java Edition', 'Modeling'],
        version: '4.11.0',
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
                name: 'Bulk import display values from another model…',
                description: '別の .json / .bbmodel ファイルを開き、ソース内の '
                    + '全 display スロット (vanilla: head/gui/ground/firstperson_*/'
                    + 'thirdperson_*/fixed/on_shelf/embedded + custom: SB Worn / '
                    + 'MAW Back / MAW Belt 等) を一括置換する。スロット × 9 軸 '
                    + '(Rotation/Translation/Scale 各 X/Y/Z) を個別にチェック可能。',
                icon: 'file_download',
                category: 'edit',
                click() { importDisplayFromFile(); },
            });
            try { MenuBar.addAction(aImport, 'tools'); } catch (e) { }
            actions.push(aImport);

            // Center Model アクション (ジオメトリを動かす破壊的操作・Undo 可)
            const aCenter = new Action('custom_disp_center_model', {
                name: 'Center Model at Origin',
                description: 'モデル全要素 (cube / mesh / locator) の bounding box '
                    + '中心を (0,0,0) に揃え、Display モードの Rotation がモデル '
                    + '中心を軸に回るようにする。Ctrl+Z で取り消し可能。',
                icon: 'center_focus_strong',
                category: 'edit',
                click() { centerModelAtOrigin(); },
            });
            try { MenuBar.addAction(aCenter, 'tools'); } catch (e) { }
            actions.push(aCenter);

            // Center Pivot of Groups アクション (各グループの origin を子 bbox 中心に・非破壊)
            const aCenterPivot = new Action('custom_disp_center_pivots', {
                name: 'Center Pivot of Groups',
                description: '選択中のグループ (無ければ全グループ) の origin '
                    + 'を子要素の bbox 中心に設定。モデルジオメトリは動かさず、'
                    + '回転ピボットだけモデル中心へ移す。Ctrl+Z で取り消し可能。',
                icon: 'gps_fixed',
                category: 'edit',
                click() { centerPivotOfGroups(); },
            });
            try { MenuBar.addAction(aCenterPivot, 'tools'); } catch (e) { }
            actions.push(aCenterPivot);

            // Outliner コンテキストメニュー (Cube / Group / Mesh の右クリック) にも追加。
            // Center View は Blockbench 本体の "focus_on_selection" (= 'センタービュー')
            // をそのまま参照するので自前実装はしない。
            const ctxMenuTargets = [];
            try { if (typeof Cube !== 'undefined' && Cube.prototype && Cube.prototype.menu) ctxMenuTargets.push(Cube.prototype.menu); } catch (e) { }
            try { if (typeof Group !== 'undefined' && Group.prototype && Group.prototype.menu) ctxMenuTargets.push(Group.prototype.menu); } catch (e) { }
            try { if (typeof Mesh !== 'undefined' && Mesh.prototype && Mesh.prototype.menu) ctxMenuTargets.push(Mesh.prototype.menu); } catch (e) { }

            const builtInCenterView = (typeof BarItems !== 'undefined') ? BarItems.focus_on_selection : null;

            ctxMenuTargets.forEach((menu) => {
                if (!menu || typeof menu.addAction !== 'function') return;
                if (builtInCenterView) {
                    try { menu.addAction(builtInCenterView); } catch (e) { }
                }
                try { menu.addAction(aCenter); } catch (e) { }
                try { menu.addAction(aCenterPivot); } catch (e) { }
            });

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

            console.log('[' + PLUGIN_ID + '] v4.9.0 loaded — '
                + '(bulk import + Center Model + Center Pivot + built-in Center View) — '
                + TARGETS.length + ' custom display slots available');
        },

        onunload() {
            stopSync();
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
