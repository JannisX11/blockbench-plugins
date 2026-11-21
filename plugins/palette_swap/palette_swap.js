/*
 * Palette Swap — Cmetanochka Creations
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

    // --- плавающая панель (без затемнения) --------------------------------

    const PANEL_CSS = `
    .vs-panel { position:fixed; top:64px; right:16px; width:420px; max-height:86vh; overflow-y:auto; background:var(--color-ui); border:1px solid var(--color-border); border-radius:6px; box-shadow:0 6px 30px rgba(0,0,0,.55); z-index:19; }
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

    function activeColor() {
        try { if (typeof ColorPanel !== 'undefined' && ColorPanel.get) return ColorPanel.get(); } catch (e) {}
        return null;
    }

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
        if (t < 0) t += 1; if (t > 1) t -= 1;
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
            r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
    function toHex(r, g, b) { return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }
    function hexToRgb(hex) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
    }
    function hueDist(a, b) { let d = Math.abs(a - b) % 1; return d > 0.5 ? 1 - d : d; }

    // --- пиксели ----------------------------------------------------------

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
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
            let v = 0; try { v = access(x, y); } catch (e) { return null; }
            if (v) { mask[y * w + x] = 1; count++; }
        }
        if (count === 0 || count === w * h) return null;
        return { mask, count };
    }

    // собирает уникальные непрозрачные цвета с частотой
    function scanUnique(img, mask) {
        const data = img.data;
        const map = new Map();
        for (let i = 0, px = 0; i < data.length; i += 4, px++) {
            if (data[i + 3] === 0) continue;
            if (mask && !mask[px]) continue;
            const key = data[i] + ',' + data[i + 1] + ',' + data[i + 2];
            const e = map.get(key);
            if (e) e.count++;
            else map.set(key, { r: data[i], g: data[i + 1], b: data[i + 2], count: 1 });
        }
        const out = [];
        map.forEach(e => {
            const [h, s, l] = rgbToHsl(e.r, e.g, e.b);
            out.push({ r: e.r, g: e.g, b: e.b, count: e.count, h: h, s: s, l: l, hex: toHex(e.r, e.g, e.b) });
        });
        return out;
    }

    // группирует цвета в семьи по тону; серые (низкая насыщ.) — отдельная семья
    function clusterGroups(uniques, tolDeg) {
        const tol = tolDeg / 360;
        const sorted = uniques.slice().sort((a, b) => b.count - a.count);
        const groups = [];
        const neutral = { members: [], neutral: true, hue: 0 };
        for (const c of sorted) {
            if (c.s < 0.12) { neutral.members.push(c); continue; }
            let best = null, bd = 1e9;
            for (const g of groups) { const d = hueDist(c.h, g.hue); if (d < bd) { bd = d; best = g; } }
            if (best && bd <= tol) best.members.push(c);
            else groups.push({ members: [c], hue: c.h, neutral: false });
        }
        if (neutral.members.length) groups.push(neutral);

        // финализация: представитель = самый частый член (members[0], т.к. отсортированы)
        return groups.map((g, i) => {
            const rep = g.members[0];
            // оттенки семьи в порядке тёмный→светлый — с ними 1:1 сопоставляются ячейки «после»
            const sorted = g.members.slice().sort((a, b) => a.l - b.l);
            return {
                id: i,
                neutral: !!g.neutral,
                members: g.members,        // {r,g,b,h,s,l,hex,count}
                sorted: sorted,            // тот же набор, отсортированный по яркости
                rep: rep.hex,
                slots: sorted.map(m => ({ hex: m.hex })),   // редактируемые цвета «после» (по умолч. = исходные)
                genOpen: false,            // раскрыт ли встроенный Generate Gradient Palette
                gen: {                     // параметры генератора (как в Gradient Palette)
                    base: rep.hex,
                    count: sorted.length,
                    hueAngle: 75,
                    brightnessRange: 0.685,
                    offset: 0,
                    smaller: false
                },
                totalCount: g.members.reduce((n, m) => n + m.count, 0)
            };
        });
    }

    // Generate Gradient Palette: из параметров gen — массив hex (движок как в gradient_palette.js)
    function generateRampColors(gen) {
        const base = tinycolor(gen.base).toHsv();
        const n = Math.max(2, Math.round(gen.count));
        const bRange = gen.smaller ? gen.brightnessRange * 0.5 : gen.brightnessRange;
        const hAngle = gen.smaller ? gen.hueAngle * 0.5 : gen.hueAngle;
        const out = [];
        for (let i = 0; i < n; i++) {
            const t = n === 1 ? 0 : i / (n - 1);
            const pos = (t - 0.5) + gen.offset;
            let h = base.h + pos * hAngle;
            h = ((h % 360) + 360) % 360;
            const s = Math.min(1, Math.max(0, base.s));
            const v = Math.min(1, Math.max(0, base.v + pos * bRange));
            out.push(tinycolor({ h: h, s: s, v: v }).toHexString());
        }
        return out;
    }
    // разложить сгенерированные цвета по ячейкам семьи (тёмн→светл, равномерная выборка)
    function fillSlotsFromColors(group, colors) {
        if (!colors.length) return;
        const pal = colors.slice().sort((a, b) => lightnessOf(a) - lightnessOf(b));
        const n = group.slots.length;
        for (let i = 0; i < n; i++) {
            const t = n === 1 ? 0 : i / (n - 1);
            const idx = Math.round(t * (pal.length - 1));
            group.slots[i].hex = pal[idx];
        }
    }

    // заполнить ячейки «после» текущей палитрой Blockbench (тёмн→светл, равномерно)
    function fillSlotsFromPalette(group, palette) {
        if (!palette.length) return false;
        const pal = palette.slice().sort((a, b) => lightnessOf(a) - lightnessOf(b));
        const n = group.slots.length;
        for (let i = 0; i < n; i++) {
            const t = n === 1 ? 0 : i / (n - 1);
            const idx = Math.round(t * (pal.length - 1));
            group.slots[i].hex = pal[idx];
        }
        return true;
    }

    // текущая палитра Blockbench: массив валидных hex
    function getPalette() {
        try {
            if (typeof ColorPanel === 'undefined' || !ColorPanel.palette) return [];
            const seen = {}, out = [];
            for (const c of ColorPanel.palette) {
                const hex = ('' + c).toLowerCase();
                if (/^#[0-9a-f]{6}$/.test(hex) && !seen[hex]) { seen[hex] = 1; out.push(hex); }
            }
            return out;
        } catch (e) { return []; }
    }
    function lightnessOf(hex) { const [r, g, b] = hexToRgb(hex); return rgbToHsl(r, g, b)[2]; }

    // строит таблицу замен "r,g,b" -> [r,g,b]: оттенок семьи[i] (тёмн→светл) -> slots[i]
    function buildLookup(groups) {
        const lut = new Map();
        for (const g of groups) {
            const sorted = g.sorted, slots = g.slots;
            for (let i = 0; i < sorted.length; i++) {
                const m = sorted[i];
                const hex = slots[i] && slots[i].hex;
                if (!hex || hex.toLowerCase() === m.hex.toLowerCase()) continue; // без изменений
                lut.set(m.r + ',' + m.g + ',' + m.b, hexToRgb(hex));
            }
        }
        return lut;
    }

    function remapInto(out, orig, lut, mask) {
        const data = orig.data;
        for (let i = 0, px = 0; i < data.length; i += 4, px++) {
            out[i] = data[i]; out[i + 1] = data[i + 1]; out[i + 2] = data[i + 2]; out[i + 3] = data[i + 3];
            if (data[i + 3] === 0) continue;
            if (mask && !mask[px]) continue;
            const m = lut.get(data[i] + ',' + data[i + 1] + ',' + data[i + 2]);
            if (m) { out[i] = m[0]; out[i + 1] = m[1]; out[i + 2] = m[2]; }
        }
    }
    function computeRemapped(orig, lut, mask) {
        const out = new Uint8ClampedArray(orig.data.length);
        remapInto(out, orig, lut, mask);
        return out;
    }
    function paintFromData(tex, dataArray, w, h) {
        tex.edit(function (canvas) {
            const ctx = canvas.getContext('2d');
            const id = new ImageData(new Uint8ClampedArray(dataArray), w, h);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.putImageData(id, 0, 0);
        }, { no_undo: true });
    }
    function restoreOriginal(tex, orig) { paintFromData(tex, orig.data, orig.width, orig.height); }

    function dataUrlFrom(orig, lut, mask) {
        const c = document.createElement('canvas');
        c.width = orig.width; c.height = orig.height;
        const ctx = c.getContext('2d');
        const id = ctx.createImageData(orig.width, orig.height);
        remapInto(id.data, orig, lut, mask);
        ctx.putImageData(id, 0, 0);
        return c.toDataURL();
    }

    // --- стили ------------------------------------------------------------

    const CSS = `
    .psw-wrap { padding: 2px; }
    .psw-hint { font-size:12px; color: var(--color-subtle_text); margin: 0 0 8px; display:flex; align-items:flex-start; gap:6px; }
    .psw-scope { font-size:12px; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
    .psw-scope.sel { color: var(--color-accent); } .psw-scope.all { color: var(--color-subtle_text); }
    .psw-preview { display:flex; justify-content:center; align-items:center; height:110px; margin-bottom:12px;
        border:1px solid var(--color-border);
        background-image:linear-gradient(45deg,#888 25%,transparent 25%),linear-gradient(-45deg,#888 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#888 75%),linear-gradient(-45deg,transparent 75%,#888 75%);
        background-size:16px 16px; background-position:0 0,0 8px,8px -8px,-8px 0; }
    .psw-preview img { max-width:100%; max-height:100%; image-rendering:pixelated; }
    .psw-tol { margin-bottom:14px; }
    .psw-tol .psw-tolhead { display:flex; align-items:center; justify-content:space-between; }
    .psw-label { font-size:13px; color: var(--color-text); }
    .psw-tol input[type=range] { width:100%; accent-color: var(--color-accent); margin-top:4px; }
    .psw-groups { display:flex; flex-direction:column; gap:12px; }
    .psw-group { border:1px solid var(--color-border); border-radius:5px; padding:8px; background:var(--color-back); cursor:pointer; }
    .psw-group.active { border-color:var(--color-accent); box-shadow:0 0 0 1px var(--color-accent) inset; }
    .psw-grouptop { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
    .psw-gname { font-size:12px; color: var(--color-subtle_text); }
    .psw-chips { display:flex; flex-wrap:wrap; gap:3px; margin-bottom:8px; }
    .psw-chip { width:16px; height:16px; border-radius:2px; border:1px solid rgba(0,0,0,.35); }
    .psw-target { width:34px; height:26px; padding:0; border:1px solid var(--color-border); background:var(--color-back); cursor:pointer; flex:none; }
    .psw-genbtn { background:var(--color-accent); color:#fff; border:none; border-radius:3px; padding:6px 12px; cursor:pointer; font-size:12px; }
    .psw-genbtn:hover { filter:brightness(1.1); }
    .psw-genbtn.wide { display:flex; align-items:center; justify-content:center; gap:6px; width:100%; margin-bottom:8px; }
    .psw-gen { border:1px solid var(--color-border); border-radius:5px; padding:14px; margin-bottom:10px; background:rgba(0,0,0,.12); }
    .psg-row { margin-bottom:18px; }
    .psg-row:last-child { margin-bottom:0; }
    .psg-head { display:flex; align-items:center; justify-content:space-between; }
    .psg-title { font-size:18px; font-weight:300; color:var(--color-text); line-height:1.2; }
    .psg-reset { cursor:pointer; opacity:.6; font-size:16px; color:var(--color-text); }
    .psg-reset:hover { opacity:1; color:var(--color-accent); }
    .psg-desc { font-size:11px; color:var(--color-subtle_text); margin:3px 0 8px; }
    .psg-ctl { display:flex; align-items:center; gap:10px; }
    .psg-ctl input[type=range] { flex:1; min-width:0; accent-color:var(--color-accent); }
    .psg-val { width:52px; background:transparent; border:none; color:var(--color-text); text-align:right; font-size:14px; outline:none; }
    .psg-colorrow { display:flex; align-items:center; gap:8px; margin-top:4px; }
    .psg-color { flex:1; height:30px; padding:0; border:1px solid var(--color-border); background:var(--color-back); cursor:pointer; }
    .psg-preview { display:flex; height:64px; border:1px solid var(--color-border); overflow:hidden; border-radius:3px; margin-top:4px; }
    .psg-preview > div { flex:1; }
    .psg-preview > div.sel { box-shadow: inset 0 -4px 0 var(--color-accent); }
    .psg-chk { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--color-text); cursor:pointer; margin-top:10px; }
    .psw-slotlbl { font-size:11px; color:var(--color-subtle_text); margin-bottom:4px; margin-top:2px; }
    .psw-slots { display:flex; flex-wrap:wrap; gap:4px; }
    .psw-slotc { width:26px; height:26px; padding:0; border:1px solid var(--color-border); border-radius:3px; background:var(--color-back); cursor:pointer; }
    .psw-ic { cursor:pointer; opacity:.85; font-size:18px; padding:3px; border:1px solid var(--color-border); border-radius:3px; color:var(--color-text); flex:none; }
    .psw-ic:hover { opacity:1; color:var(--color-accent); border-color:var(--color-accent); }
    .psw-ic.drop { color:var(--color-accent); }
    .psw-palette { margin-top:14px; border-top:1px solid var(--color-border); padding-top:10px; }
    .psw-palhead { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
    .psw-palgrid { display:flex; flex-wrap:wrap; gap:4px; }
    .psw-pchip { width:20px; height:20px; border-radius:3px; border:1px solid rgba(0,0,0,.4); cursor:pointer; }
    .psw-pchip:hover { outline:2px solid var(--color-accent); outline-offset:1px; }
    .psw-palempty { font-size:12px; color: var(--color-subtle_text); }
    `;

    // --- компонент --------------------------------------------------------

    function buildComponent(tex, orig, sel) {
        const mask = sel ? sel.mask : null;
        const uniques = scanUnique(orig, mask);
        const initialTol = 20;

        const scopeText = sel ? L('Только в выделении (' + sel.count + ' px)', 'Selection only (' + sel.count + ' px)') : L('Вся текстура', 'Whole texture');
        const scopeClass = sel ? 'sel' : 'all';
        const scopeIcon = sel ? 'select_all' : 'crop_free';

        let rafPending = false;
        function scheduleLive(vue) {
            if (rafPending) return;
            rafPending = true;
            requestAnimationFrame(function () {
                rafPending = false;
                paintFromData(tex, computeRemapped(orig, buildLookup(vue.groups), mask), orig.width, orig.height);
            });
        }

        const initGroups = clusterGroups(uniques, initialTol);

        const component = {
            data() {
                return {
                    tolerance: initialTol,
                    groups: initGroups,
                    uniqueCount: uniques.length,
                    activeId: initGroups.length ? initGroups[0].id : null,
                    paletteVersion: 0,
                    scopeText: scopeText, scopeClass: scopeClass, scopeIcon: scopeIcon
                };
            },
            computed: {
                previewUrl() { return dataUrlFrom(orig, buildLookup(this.groups), mask); },
                palette() { this.paletteVersion; return getPalette(); }
            },
            watch: {
                tolerance() { this.regroup(); },
                groups: { handler() { this.live(); }, deep: true }
            },
            methods: {
                L,
                regroup() {
                    this.groups = clusterGroups(uniques, this.tolerance);
                    this.activeId = this.groups.length ? this.groups[0].id : null;
                },
                live() { scheduleLive(this); },
                setActive(g) { this.activeId = g.id; },
                // раскрыть/свернуть встроенный Generate Gradient Palette; при открытии — сразу сгенерить
                toggleGen(g) {
                    this.activeId = g.id;
                    g.genOpen = !g.genOpen;
                    if (g.genOpen) this.applyGen(g);
                },
                // сгенерировать палитру из gen и заменить ею оттенки семьи (вживую)
                applyGen(g) { fillSlotsFromColors(g, generateRampColors(g.gen)); this.touch(g); },
                genPreview(g) { return generateRampColors(g.gen); },
                // индекс «выбранного» цвета в предпросмотре (где сидит базовый цвет) — для подчёркивания
                selIndex(g) {
                    const n = Math.max(2, Math.round(g.gen.count));
                    let idx = Math.round((0.5 - g.gen.offset) * (n - 1));
                    return idx < 0 ? 0 : idx > n - 1 ? n - 1 : idx;
                },
                // экранная пипетка для базового цвета генератора
                pickGenBase(g) {
                    const self = this;
                    if (typeof EyeDropper !== 'undefined') {
                        try {
                            new EyeDropper().open().then(function (res) {
                                if (res && res.sRGBHex) { g.gen.base = res.sRGBHex; self.applyGen(g); }
                            }).catch(function () {});
                            return;
                        } catch (e) {}
                    }
                    const c = activeColor();
                    if (c) { g.gen.base = c; this.applyGen(g); }
                    else Blockbench.showQuickMessage(L('Пипетка недоступна', 'Eyedropper is unavailable'), 2000);
                },
                // точечная пипетка для одной ячейки «после» (клик по модели)
                pickSlot(g, i) {
                    const self = this;
                    if (typeof EyeDropper !== 'undefined') {
                        try {
                            new EyeDropper().open().then(function (res) {
                                if (res && res.sRGBHex) { g.slots[i].hex = res.sRGBHex; self.touch(g); }
                            }).catch(function () {});
                            return;
                        } catch (e) {}
                    }
                    const c = activeColor();
                    if (c) { g.slots[i].hex = c; this.touch(g); }
                    else Blockbench.showQuickMessage(L('Пипетка недоступна', 'Eyedropper is unavailable'), 2000);
                },
                // заменить ячейки «после» текущей палитрой Blockbench 1:1
                applyRampToGroup(g) {
                    const pal = this.palette;
                    if (!fillSlotsFromPalette(g, pal)) { Blockbench.showQuickMessage(L('Палитра пуста — сгенерируй её', 'Palette is empty — generate it first'), 2000); return; }
                    this.touch(g);
                    Blockbench.showQuickMessage(L('Оттенки заменены палитрой (' + g.slots.length + ')', 'Shades replaced from palette (' + g.slots.length + ')'), 1500);
                },
                pickPalette(hex) {
                    const g = this.groups.find(x => x.id === this.activeId);
                    if (!g) { Blockbench.showQuickMessage(L('Выбери семью', 'Select a family'), 1800); return; }
                    g.gen.base = hex;           // клик по палитре = базовый цвет генератора активной семьи
                    g.genOpen = true;
                    this.applyGen(g);
                },
                refreshPalette() { this.paletteVersion++; },
                // собрать палитру Blockbench из оттенков семьи (тёмн→светл)
                paletteFromGroup(g, replace) {
                    try {
                        const cols = g.sorted.map(m => m.hex);
                        if (replace) ColorPanel.palette.splice(0, ColorPanel.palette.length, ...cols);
                        else cols.forEach(c => { if (!ColorPanel.palette.includes(c)) ColorPanel.palette.push(c); });
                        this.paletteVersion++;
                        Blockbench.showQuickMessage(replace ? L('Палитра заменена (' + cols.length + ')', 'Palette replaced (' + cols.length + ')') : L('Добавлено в палитру (' + cols.length + ')', 'Added to palette (' + cols.length + ')'), 1500);
                    } catch (e) { Blockbench.showQuickMessage(L('Не удалось записать палитру', 'Failed to write palette'), 1500); console.error(e); }
                },
                // пнуть реактивность (slots меняем по индексу — заменяем массив, чтобы watch увидел)
                touch(g) { g.slots = g.slots.slice(); },
                resetGroup(g) {
                    g.slots = g.sorted.map(m => ({ hex: m.hex }));
                    g.gen.base = g.rep; g.gen.count = g.sorted.length;
                    g.gen.hueAngle = 75; g.gen.brightnessRange = 0.685; g.gen.offset = 0; g.gen.smaller = false;
                },
                resetAll() { this.groups.forEach(g => this.resetGroup(g)); },
                gname(g, i) { return g.neutral ? L('Серые / нейтральные', 'Grays / neutrals') : L('Семья ' + (i + 1), 'Family ' + (i + 1)); }
            },
            template: `
            <div class="psw-wrap">

                <div class="psw-hint">
                    <i class="material-icons" style="font-size:16px;">palette</i>
                    <span>{{ L('У семьи жми ', 'For a family click ') }}<b>Generate Gradient Palette</b>{{ L(' — откроется генератор, палитра заменит оттенки семьи. Каждый оттенок ещё правится ', ' — the generator opens and the palette replaces the family shades. Each shade can also be edited ') }}<b>{{ L('точечно', 'individually') }}</b>{{ L(': клик по ячейке (ПКМ = пипетка по модели).', ': click a cell (RMB = eyedropper on the model).') }}</span>
                </div>

                <div class="psw-scope" :class="scopeClass">
                    <i class="material-icons" style="font-size:16px;">{{ scopeIcon }}</i>
                    {{ scopeText }} · {{ L('цветов:', 'colors:') }} {{ uniqueCount }}
                </div>

                <div class="psw-preview"><img :src="previewUrl"></div>

                <div class="psw-tol">
                    <div class="psw-tolhead">
                        <span class="psw-label">{{ L('Сила группировки:', 'Grouping strength:') }} {{ tolerance }}°</span>
                        <i class="material-icons psw-ic" @click="resetAll()" :title="L('Сбросить все цвета', 'Reset all colors')">restart_alt</i>
                    </div>
                    <input type="range" min="4" max="60" step="1" v-model.number="tolerance">
                </div>

                <div class="psw-groups">
                    <div class="psw-group" v-for="(g, i) in groups" :key="g.id"
                         :class="{ active: g.id === activeId }" @click="setActive(g)">
                        <div class="psw-grouptop">
                            <span class="psw-gname">{{ gname(g, i) }} · {{ g.members.length }} {{ L('оттенк.', 'shades') }}</span>
                            <span>
                                <i class="material-icons psw-ic" @click.stop="paletteFromGroup(g, $event.shiftKey)" :title="L('Собрать палитру из оттенков семьи (добавить). Shift+клик — заменить палитру', 'Build palette from family shades (add). Shift+click — replace palette')" style="font-size:15px;">library_add</i>
                                <i class="material-icons psw-ic" @click.stop="applyRampToGroup(g)" :title="L('Заполнить оттенки текущей палитрой 1:1', 'Fill shades from current palette 1:1')" style="font-size:15px;">view_week</i>
                                <i class="material-icons psw-ic" @click.stop="resetGroup(g)" :title="L('Вернуть исходные цвета', 'Restore original colors')" style="font-size:15px;">replay</i>
                            </span>
                        </div>

                        <div class="psw-chips">
                            <span class="psw-chip" v-for="m in g.sorted" :style="{ background: m.hex }" :title="L('исходный ', 'original ') + m.hex"></span>
                        </div>

                        <button class="psw-genbtn wide" @click.stop="toggleGen(g)">
                            <i class="material-icons" style="font-size:15px;vertical-align:-3px;">gradient</i>
                            Generate Gradient Palette
                            <i class="material-icons" style="font-size:15px;vertical-align:-3px;">{{ g.genOpen ? 'expand_less' : 'expand_more' }}</i>
                        </button>

                        <div v-if="g.genOpen" class="psw-gen" @click.stop>

                            <div class="psg-row">
                                <div class="psg-head"><div class="psg-title">{{ L('Цвет', 'Color') }}</div></div>
                                <div class="psg-colorrow">
                                    <input type="color" class="psg-color" v-model="g.gen.base" @input="applyGen(g)" :title="L('Базовый цвет', 'Base color')">
                                    <i class="material-icons psw-ic drop" @click="pickGenBase(g)" :title="L('Пипетка — клик по модели', 'Eyedropper — click the model')">colorize</i>
                                </div>
                            </div>

                            <div class="psg-row">
                                <div class="psg-head"><div class="psg-title">{{ L('Количество цветов', 'Number of colors') }}</div>
                                    <i class="material-icons psg-reset" @click="g.gen.count = g.sorted.length; applyGen(g)">replay</i></div>
                                <div class="psg-desc">{{ L('Сколько цветов будет в градиенте', 'How many colors the gradient will have') }}</div>
                                <div class="psg-ctl">
                                    <input type="range" min="2" max="32" step="1" v-model.number="g.gen.count" @input="applyGen(g)">
                                    <input class="psg-val" type="number" v-model.number="g.gen.count" @input="applyGen(g)">
                                </div>
                            </div>

                            <div class="psg-row">
                                <div class="psg-head"><div class="psg-title">{{ L('Угол сдвига тона', 'Hue shift angle') }}</div>
                                    <i class="material-icons psg-reset" @click="g.gen.hueAngle = 75; applyGen(g)">replay</i></div>
                                <div class="psg-desc">{{ L('На сколько градусов поворачивается тон вдоль градиента', 'How many degrees the hue rotates along the gradient') }}</div>
                                <div class="psg-ctl">
                                    <input type="range" min="0" max="360" step="1" v-model.number="g.gen.hueAngle" @input="applyGen(g)">
                                    <input class="psg-val" type="number" v-model.number="g.gen.hueAngle" @input="applyGen(g)">
                                </div>
                            </div>

                            <div class="psg-row">
                                <div class="psg-head"><div class="psg-title">{{ L('Диапазон яркости', 'Brightness range') }}</div>
                                    <i class="material-icons psg-reset" @click="g.gen.brightnessRange = 0.685; applyGen(g)">replay</i></div>
                                <div class="psg-desc">{{ L('Насколько меняется яркость в градиенте', 'How much the brightness varies across the gradient') }}</div>
                                <div class="psg-ctl">
                                    <input type="range" min="0" max="1" step="0.005" v-model.number="g.gen.brightnessRange" @input="applyGen(g)">
                                    <input class="psg-val" type="number" step="0.005" v-model.number="g.gen.brightnessRange" @input="applyGen(g)">
                                </div>
                            </div>

                            <div class="psg-row">
                                <div class="psg-head"><div class="psg-title">{{ L('Смещение цвета', 'Color offset') }}</div>
                                    <i class="material-icons psg-reset" @click="g.gen.offset = 0; applyGen(g)">replay</i></div>
                                <div class="psg-desc">{{ L('Положение базового цвета в спектре градиента', 'Position of the base color within the gradient spectrum') }}</div>
                                <div class="psg-ctl">
                                    <input type="range" min="-0.5" max="0.5" step="0.01" v-model.number="g.gen.offset" @input="applyGen(g)">
                                    <input class="psg-val" type="number" step="0.01" v-model.number="g.gen.offset" @input="applyGen(g)">
                                </div>
                            </div>

                            <div class="psg-preview">
                                <div v-for="(c, ci) in genPreview(g)" :key="ci" :class="{ sel: ci === selIndex(g) }" :style="{ background: c }"></div>
                            </div>

                            <label class="psg-chk"><input type="checkbox" v-model="g.gen.smaller" @change="applyGen(g)"> {{ L('Меньшие диапазоны', 'Smaller ranges') }}</label>
                        </div>

                        <div class="psw-slotlbl">{{ L('Оттенки семьи (клик — правка, ПКМ — пипетка):', 'Family shades (click — edit, RMB — eyedropper):') }}</div>
                        <div class="psw-slots">
                            <input type="color" class="psw-slotc" v-for="(s, si) in g.slots" :key="si"
                                   v-model="s.hex" @input="touch(g)" @click.stop
                                   @contextmenu.prevent.stop="pickSlot(g, si)"
                                   :title="s.hex + L(' · клик — выбрать, ПКМ — пипетка по модели', ' · click — pick, RMB — eyedropper on the model')">
                        </div>
                    </div>
                </div>

                <div class="psw-palette">
                    <div class="psw-palhead">
                        <span class="psw-label">{{ L('Твоя палитра · клик = базовый цвет активной семьи + Generate', 'Your palette · click = base color of the active family + Generate') }}</span>
                        <i class="material-icons psw-ic" @click="refreshPalette()" :title="L('Обновить из ColorPanel', 'Refresh from ColorPanel')" style="font-size:15px;">refresh</i>
                    </div>
                    <div v-if="palette.length" class="psw-palgrid">
                        <span class="psw-pchip" v-for="c in palette" :key="c" :style="{ background: c }" :title="c" @click="pickPalette(c)"></span>
                    </div>
                    <div v-else class="psw-palempty">{{ L('Палитра пуста — сгенерируй её (Gradient Palette / 2-Color Ramp) и нажми refresh.', 'Palette is empty — generate it (Gradient Palette / 2-Color Ramp) and hit refresh.') }}</div>
                </div>

            </div>
            `
        };

        return { component, mask, uniques };
    }

    function openPanel() {
        if (panelEl) { closePanel(); return; }
        const tex = Texture.selected || (Texture.all && Texture.all[0]);
        if (!tex) { Blockbench.showQuickMessage(L('Сначала выбери текстуру', 'Select a texture first'), 2000); return; }
        if (!tex.img || !tex.img.naturalWidth) { Blockbench.showQuickMessage(L('Текстура ещё не загружена', 'Texture is not loaded yet'), 2000); return; }
        if (typeof tex.edit !== 'function') { Blockbench.showQuickMessage(L('Эта версия Blockbench не поддерживает live-превью', 'This Blockbench version does not support live preview'), 2500); }

        const orig = getImageData(tex);
        const sel = getSelectionMask(tex, orig.width, orig.height);
        const built = buildComponent(tex, orig, sel);

        if (!built.uniques.length) { Blockbench.showQuickMessage(L('Нет непрозрачных пикселей', 'No opaque pixels'), 2000); return; }

        let applied = false;
        function doApply() {
            applied = true;
            restoreOriginal(tex, orig);
            Undo.initEdit({ textures: [tex], bitmap: true });
            const lut = buildLookup(vm.groups);
            paintFromData(tex, computeRemapped(orig, lut, built.mask), orig.width, orig.height);
            Undo.finishEdit('Palette Swap');
            Blockbench.showQuickMessage(L('Палитра заменена', 'Palette replaced'), 1500);
            closePanel();
        }
        function doCancel() { if (!applied) restoreOriginal(tex, orig); closePanel(); }

        makePanel('Palette Swap — ' + (tex.name || L('текстура', 'texture')), built.component,
            [{ label: L('Применить', 'Apply'), primary: true, cb: doApply }, { label: L('Отмена', 'Cancel'), cb: doCancel }], doCancel);
    }

    // --- регистрация ------------------------------------------------------

    Plugin.register('palette_swap', {
        title: 'Palette Swap',
        author: 'Cmetanochkaa (Cmetanochka Creations)', website: 'https://discord.gg/Xjp4ApB2qg',
        icon: 'icon.png',
        description: L('Быстрая смена палитры: цвета текстуры группируются в семьи по тону, и вся семья оттенков одним движением перекрашивается в новый цвет с сохранением светотени. Живой предпросмотр на модели, учёт выделения, Undo.', 'Fast palette swap: texture colors are grouped into families by hue, and a whole family of shades is recolored to a new color in one move while preserving light and shadow. Live preview on the model, selection-aware, Undo.'),
        version: '2.2.0',
        variant: 'both',
        min_version: '4.8.0',
        tags: ['Color', 'Texture', 'Palette'],

        onload() {
            styleNode = Blockbench.addCSS(CSS);
            panelStyle = Blockbench.addCSS(PANEL_CSS);

            action = new Action('open_palette_swap', {
                name: L('Замена палитры', 'Palette Swap'),
                description: L('Быстро заменить семью цветов в текстуре', 'Quickly swap a family of colors in a texture'),
                icon: 'palette',
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
