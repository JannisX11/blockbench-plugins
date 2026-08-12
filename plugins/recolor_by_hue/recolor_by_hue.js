/*
 * Recolor by Hue — Cmetanochka Creations
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
    let action;
    let styleNode, panelStyle;
    let panelEl = null, vm = null;

    const PANEL_CSS = `
    .vs-panel { position:fixed; top:64px; right:16px; width:380px; max-height:84vh; overflow-y:auto; background:var(--color-ui); border:1px solid var(--color-border); border-radius:6px; box-shadow:0 6px 30px rgba(0,0,0,.55); z-index:19; }
    .vs-panel-head { position:sticky; top:0; display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--color-frame); color:var(--color-text); cursor:move; user-select:none; font-size:14px; z-index:2; }
    .vs-panel-close { cursor:pointer; opacity:.7; font-size:18px; } .vs-panel-close:hover { opacity:1; color:var(--color-accent); }
    .vs-panel-body { padding:12px; }
    .vs-panel-foot { display:flex; gap:8px; justify-content:flex-end; padding:10px 12px; border-top:1px solid var(--color-border); position:sticky; bottom:0; background:var(--color-ui); }
    .vs-pbtn { background:var(--color-button); color:var(--color-text); border:1px solid var(--color-border); padding:5px 14px; cursor:pointer; border-radius:3px; }
    .vs-pbtn:hover { background:var(--color-accent); color:#fff; }
    .vs-pbtn.primary { background:var(--color-accent); color:#fff; }
    `;

    function closePanel() {
        if (panelEl && panelEl.__cleanup) panelEl.__cleanup();
        if (vm) { try { vm.$destroy(); } catch (e) {} vm = null; }
        if (panelEl) { panelEl.remove(); panelEl = null; }
    }
    function makeDraggable(el, handle) {
        let sx, sy, ox, oy, drag = false;
        function down(e) { if (e.target.classList.contains('vs-panel-close')) return; drag = true; const r = el.getBoundingClientRect(); el.style.left = r.left + 'px'; el.style.top = r.top + 'px'; el.style.right = 'auto'; sx = e.clientX; sy = e.clientY; ox = r.left; oy = r.top; e.preventDefault(); }
        function move(e) { if (!drag) return; el.style.left = (ox + e.clientX - sx) + 'px'; el.style.top = (oy + e.clientY - sy) + 'px'; }
        function up() { drag = false; }
        handle.addEventListener('mousedown', down);
        window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
        el.__cleanup = function () { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    }
    // создаёт плавающую панель: title, vue-опции, кнопки [{label,primary,cb}], onClose
    function makePanel(title, compOptions, buttons, onClose) {
        if (typeof Vue === 'undefined') { Blockbench.showQuickMessage(L('Vue недоступен', 'Vue is unavailable'), 2000); return; }
        panelEl = document.createElement('div'); panelEl.className = 'vs-panel';
        const head = document.createElement('div'); head.className = 'vs-panel-head';
        const t = document.createElement('span'); t.textContent = title; head.appendChild(t);
        const x = document.createElement('i'); x.className = 'material-icons vs-panel-close'; x.textContent = 'close'; x.onclick = function () { if (onClose) onClose(); else closePanel(); }; head.appendChild(x);
        const body = document.createElement('div'); body.className = 'vs-panel-body'; const mount = document.createElement('div'); body.appendChild(mount);
        panelEl.appendChild(head); panelEl.appendChild(body);
        if (buttons && buttons.length) {
            const foot = document.createElement('div'); foot.className = 'vs-panel-foot';
            buttons.forEach(b => { const btn = document.createElement('button'); btn.className = 'vs-pbtn' + (b.primary ? ' primary' : ''); btn.textContent = b.label; btn.onclick = b.cb; foot.appendChild(btn); });
            panelEl.appendChild(foot);
        }
        document.body.appendChild(panelEl);
        vm = new Vue(compOptions); vm.$mount(mount);
        makeDraggable(panelEl, head);
    }

    const DEFAULTS = { hue: 0, sat: 0, light: 0, contrast: 0, preserveGray: false };

    // --- цветовая математика ----------------------------------------------

    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) { h = s = 0; }
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                default: h = (r - g) / d + 4;
            }
            h /= 6;
        }
        return [h, s, l];
    }

    function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    function hslToRgb(h, s, l) {
        let r, g, b;
        if (s === 0) { r = g = b = l; }
        else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

    // mask: Uint8Array (1 = менять пиксель) или null (вся текстура)
    function adjustInPlace(data, p, mask) {
        const hueShift = (p.hue % 360) / 360;
        const satF = 1 + p.sat / 100;
        const lAdd = p.light / 100;
        const cF = 1 + p.contrast / 100;
        for (let i = 0, px = 0; i < data.length; i += 4, px++) {
            if (data[i + 3] === 0) continue;
            if (mask && !mask[px]) continue;
            let [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
            if (p.preserveGray && s < 0.04) continue;
            h = (h + hueShift) % 1; if (h < 0) h += 1;
            s = clamp01(s * satF);
            l = clamp01(l + lAdd);
            l = clamp01((l - 0.5) * cF + 0.5);
            const [r, g, b] = hslToRgb(h, s, l);
            data[i] = r; data[i + 1] = g; data[i + 2] = b;
        }
    }

    // --- работа с пикселями текстуры --------------------------------------

    function getImageData(tex) {
        const w = tex.img.naturalWidth || tex.width;
        const h = tex.img.naturalHeight || tex.height;
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tex.img, 0, 0, w, h);
        return ctx.getImageData(0, 0, w, h);
    }

    // считывает активное выделение текстуры в маску; null = выделения нет
    function getSelectionMask(tex, w, h) {
        const sel = tex && tex.selection;
        let access = null;
        if (sel) {
            if (typeof sel.get === 'function') access = (x, y) => sel.get(x, y);
            else if (typeof sel.is === 'function') access = (x, y) => (sel.is(x, y) ? 1 : 0);
        }
        if (!access) return null;

        const mask = new Uint8Array(w * h);
        let count = 0;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let v = 0;
                try { v = access(x, y); } catch (e) { return null; }
                if (v) { mask[y * w + x] = 1; count++; }
            }
        }
        // нет выделения, либо выделено всё — считаем как «вся текстура»
        if (count === 0 || count === w * h) return null;
        return { mask, count };
    }

    function renderAdjusted(src, params, mask) {
        const c = document.createElement('canvas');
        c.width = src.width; c.height = src.height;
        const ctx = c.getContext('2d');
        const id = ctx.createImageData(src.width, src.height);
        id.data.set(src.data);
        adjustInPlace(id.data, params, mask);
        ctx.putImageData(id, 0, 0);
        return c.toDataURL();
    }

    function paintFromData(tex, dataArray, w, h) {
        tex.edit(function (canvas) {
            const ctx = canvas.getContext('2d');
            const id = new ImageData(new Uint8ClampedArray(dataArray), w, h);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.putImageData(id, 0, 0);
        }, { no_undo: true });
    }

    function computeAdjusted(orig, params, mask) {
        const out = new Uint8ClampedArray(orig.data);
        adjustInPlace(out, params, mask);
        return out;
    }

    function livePreview(tex, orig, params, mask) {
        paintFromData(tex, computeAdjusted(orig, params, mask), orig.width, orig.height);
    }

    function restoreOriginal(tex, orig) {
        paintFromData(tex, orig.data, orig.width, orig.height);
    }

    // --- стили -------------------------------------------------------------

    const CSS = `
    .rbh-wrap { padding: 4px 2px; }
    .rbh-row { margin-bottom: 18px; }
    .rbh-head { display:flex; align-items:center; justify-content:space-between; }
    .rbh-title { font-size: 22px; font-weight: 300; color: var(--color-text); line-height:1.2; }
    .rbh-reset { cursor:pointer; opacity:0.6; font-size:16px; }
    .rbh-reset:hover { opacity:1; color: var(--color-accent); }
    .rbh-desc { font-size:12px; color: var(--color-subtle_text); margin: 2px 0 8px; }
    .rbh-control { display:flex; align-items:center; gap:10px; }
    .rbh-control input[type=range] { flex:1; accent-color: var(--color-accent); }
    .rbh-val { width:64px; background:transparent; border:none; color:var(--color-text);
               text-align:right; font-size:14px; outline:none; }
    .rbh-hint { font-size:12px; margin-bottom:6px; display:flex; align-items:center; gap:6px;
                color: var(--color-subtle_text); }
    .rbh-scope { font-size:12px; margin-bottom:12px; display:flex; align-items:center; gap:6px; }
    .rbh-scope.sel { color: var(--color-accent); }
    .rbh-scope.all { color: var(--color-subtle_text); }
    .rbh-preview { display:flex; justify-content:center; align-items:center; height:120px;
        border:1px solid var(--color-border);
        background-image:
          linear-gradient(45deg, #888 25%, transparent 25%),
          linear-gradient(-45deg, #888 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #888 75%),
          linear-gradient(-45deg, transparent 75%, #888 75%);
        background-size:16px 16px; background-position:0 0,0 8px,8px -8px,-8px 0; }
    .rbh-preview img { max-width:100%; max-height:100%; image-rendering:pixelated; }
    .rbh-checks { margin-top:10px; }
    .rbh-checks label { display:flex; align-items:center; gap:8px; cursor:pointer; color:var(--color-text); }
    `;

    // --- компонент ---------------------------------------------------------

    function buildComponent(tex, orig, sel) {
        const data = Object.assign({}, DEFAULTS);
        const mask = sel ? sel.mask : null;

        const scopeText = sel
            ? L('Применяется только к выделению (' + sel.count + ' px)', 'Applies to the selection only (' + sel.count + ' px)')
            : L('Применяется ко всей текстуре', 'Applies to the entire texture');
        const scopeIcon = sel ? 'select_all' : 'crop_free';
        const scopeClass = sel ? 'sel' : 'all';

        let rafPending = false;
        function scheduleLive() {
            if (rafPending) return;
            rafPending = true;
            requestAnimationFrame(function () {
                rafPending = false;
                livePreview(tex, orig, data, mask);
            });
        }

        const component = {
            data() { return data; },
            computed: {
                previewUrl() { return renderAdjusted(orig, this.$data, mask); }
            },
            watch: {
                hue: 'live', sat: 'live', light: 'live',
                contrast: 'live', preserveGray: 'live'
            },
            methods: {
                reset(key) { this[key] = DEFAULTS[key]; },
                live() { scheduleLive(); },
                L(ru, en) { return L(ru, en); }
            },
            template: `
            <div class="rbh-wrap">

                <div class="rbh-hint">
                    <i class="material-icons" style="font-size:16px;">visibility</i>
                    {{ L('Изменения видно сразу на модели. «Отмена» вернёт оригинал.', 'Changes appear on the model instantly. "Cancel" restores the original.') }}
                </div>
                <div class="rbh-scope ${scopeClass}">
                    <i class="material-icons" style="font-size:16px;">${scopeIcon}</i>
                    ${scopeText}
                </div>

                <div class="rbh-preview"><img :src="previewUrl"></div>

                <div class="rbh-row" style="margin-top:16px;">
                    <div class="rbh-head">
                        <div class="rbh-title">{{ L('Сдвиг тона', 'Hue shift') }}</div>
                        <i class="material-icons rbh-reset" @click="reset('hue')">replay</i>
                    </div>
                    <div class="rbh-desc">{{ L('Поворот цветового круга, °', 'Rotate the color wheel, °') }}</div>
                    <div class="rbh-control">
                        <input type="range" min="-180" max="180" step="1" v-model.number="hue">
                        <input class="rbh-val" type="number" v-model.number="hue">
                    </div>
                </div>

                <div class="rbh-row">
                    <div class="rbh-head">
                        <div class="rbh-title">{{ L('Насыщенность', 'Saturation') }}</div>
                        <i class="material-icons rbh-reset" @click="reset('sat')">replay</i>
                    </div>
                    <div class="rbh-desc">{{ L('-100 — обесцветить, +100 — усилить', '-100 desaturates, +100 boosts') }}</div>
                    <div class="rbh-control">
                        <input type="range" min="-100" max="100" step="1" v-model.number="sat">
                        <input class="rbh-val" type="number" v-model.number="sat">
                    </div>
                </div>

                <div class="rbh-row">
                    <div class="rbh-head">
                        <div class="rbh-title">{{ L('Яркость', 'Lightness') }}</div>
                        <i class="material-icons rbh-reset" @click="reset('light')">replay</i>
                    </div>
                    <div class="rbh-control">
                        <input type="range" min="-100" max="100" step="1" v-model.number="light">
                        <input class="rbh-val" type="number" v-model.number="light">
                    </div>
                </div>

                <div class="rbh-row">
                    <div class="rbh-head">
                        <div class="rbh-title">{{ L('Контраст', 'Contrast') }}</div>
                        <i class="material-icons rbh-reset" @click="reset('contrast')">replay</i>
                    </div>
                    <div class="rbh-control">
                        <input type="range" min="-100" max="100" step="1" v-model.number="contrast">
                        <input class="rbh-val" type="number" v-model.number="contrast">
                    </div>
                </div>

                <div class="rbh-checks">
                    <label><input type="checkbox" v-model="preserveGray"> {{ L('Не трогать серые/нейтральные пиксели', 'Leave gray/neutral pixels untouched') }}</label>
                </div>

            </div>
            `
        };
        return { data, component, mask };
    }

    function openPanel() {
        if (panelEl) { closePanel(); return; }
        const tex = Texture.selected || (Texture.all && Texture.all[0]);
        if (!tex) { Blockbench.showQuickMessage(L('Сначала выбери текстуру', 'Select a texture first'), 2000); return; }
        if (!tex.img || !tex.img.naturalWidth) { Blockbench.showQuickMessage(L('Текстура ещё не загружена', 'The texture has not loaded yet'), 2000); return; }
        if (typeof tex.edit !== 'function') { Blockbench.showQuickMessage(L('Эта версия Blockbench не поддерживает live-превью', 'This version of Blockbench does not support live preview'), 2500); }

        const orig = getImageData(tex);
        const sel = getSelectionMask(tex, orig.width, orig.height);
        const built = buildComponent(tex, orig, sel);
        let applied = false;

        function doApply() {
            applied = true;
            restoreOriginal(tex, orig);
            Undo.initEdit({ textures: [tex], bitmap: true });
            paintFromData(tex, computeAdjusted(orig, built.data, built.mask), orig.width, orig.height);
            Undo.finishEdit('Recolor by Hue');
            Blockbench.showQuickMessage(L('Текстура перекрашена', 'Texture recolored'), 1500);
            applied = true; closePanel();
        }
        function doCancel() { if (!applied) restoreOriginal(tex, orig); closePanel(); }

        makePanel('Recolor by Hue — ' + (tex.name || 'texture'), built.component,
            [{ label: L('Применить', 'Apply'), primary: true, cb: doApply }, { label: L('Отмена', 'Cancel'), cb: doCancel }], doCancel);
    }

    // --- регистрация -------------------------------------------------------

    Plugin.register('recolor_by_hue', {
        title: 'Recolor by Hue',
        author: 'Cmetanochkaa (Cmetanochka Creations)', website: 'https://discord.gg/Xjp4ApB2qg',
        icon: 'tune',
        description: L('Сдвиг тона / насыщенности / яркости / контраста текстуры или выделения. Живой предпросмотр на модели.', 'Shift hue / saturation / lightness / contrast of a texture or selection. Live preview on the model.'),
        version: '1.2.0',
        variant: 'both',
        min_version: '4.8.0',
        tags: ['Color', 'Texture'],

        onload() {
            styleNode = Blockbench.addCSS(CSS);
            panelStyle = Blockbench.addCSS(PANEL_CSS);

            action = new Action('open_recolor_by_hue', {
                name: L('Перекрас по тону', 'Recolor by Hue'),
                description: L('Перекрасить текстуру/выделение (тон/насыщенность/яркость)', 'Recolor a texture/selection (hue/saturation/lightness)'),
                icon: 'tune',
                click: openPanel
            });

            MenuBar.addAction(action, 'tools');

            const targets = ['palette', 'color_picker', 'main_tools', 'tools'];
            for (const id of targets) {
                try {
                    if (Toolbars[id] && !Toolbars[id].children.includes(action)) {
                        Toolbars[id].add(action, -1);
                        break;
                    }
                } catch (e) { /* следующий */ }
            }
        },

        onunload() {
            closePanel();
            if (action) action.delete();
            if (styleNode) styleNode.delete();
            if (panelStyle) panelStyle.delete();
        }
    });
})();
