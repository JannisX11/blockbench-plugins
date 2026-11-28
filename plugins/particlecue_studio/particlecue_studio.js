/* SPDX-License-Identifier: LGPL-3.0-or-later */
(function(requireNativeModuleArg, requireArg) {
"use strict";
const __pcRequireNative = typeof requireNativeModuleArg === "function" ? requireNativeModuleArg : (typeof requireNativeModule === "function" ? requireNativeModule : undefined);
const __pcRequire = typeof requireArg === "function" ? requireArg : (typeof require === "function" ? require : undefined);
/* === src/core/locale.js === */
const Locale = (() => {
    const STRINGS = {
        en: {
            plugin_title: 'ParticleCue Studio',
            plugin_desc: 'Unified Blockbench particle authoring for Snowstorm/Bedrock, LumenFX JSON, Unity/Niagara overrides, Photon .fx, and KBR 3D particles with portable project sharing and AnimCue/PAL integration.',
            menu_root: 'ParticleCue Studio',
            menu_new_effect: 'New Particle Effect (Snowstorm / LumenFX / Photon / KBR 3D)...',
            menu_import_effect: 'Import Particle File (.json / .fx)...',
            menu_relink: 'Relink Missing Particle Assets...',
            menu_export_zip: 'Export Portable Project (ZIP)...',
            menu_import_zip: 'Import Portable Project (ZIP)...',
            menu_save_embedded: 'Save Self-Contained .bbmodel...',
            menu_inspect_assets: 'Inspect / Edit Raw Particle Assets...',
            menu_kilagraph: 'Open KilaGraph Shader Node Editor...',
            menu_export_pal_emote: 'Export PAL .emote.json (with Particle Events)...',
            menu_toggle_preview: 'Use ParticleCue Unified Preview',
            menu_rescan: 'Rescan Project Particle Assets',
            panel_title: 'ParticleCue Studio',
            panel_tool_new: 'New',
            panel_tool_import: 'Import Effect / ZIP',
            panel_tool_kilagraph: 'KilaGraph Shader Editor',
            panel_tool_share: 'Share',
            tab_effects: 'Effects',
            tab_emitters: 'Emitters',
            tab_materials: 'Materials',
            panel_bindings_heading: 'Particle Keyframes',
            panel_missing_hint: 'Click to pick a new asset root folder and batch relink',
            panel_select_effect_hint: 'Select an effect from the Effects tab or create a new one to edit.',
            panel_mat_lumenfx_hint: 'Select a LumenFX effect to edit materials, KilaMaterial modules, KilaGraph shaders, and lights/volumes/decals.',
            panel_btn_open_kilagraph: 'Open KilaGraph Node Editor',
            panel_ctx_edit_emitters: 'Edit Emitters & Modules',
            panel_ctx_edit_materials: 'Edit Materials & Shaders',
            panel_ctx_open_kilagraph: 'Open KilaGraph Node Editor',
            panel_ctx_edit_keyframe: 'Edit Keyframe Time / Locator / Script...',
            panel_ctx_raw_json: 'Inspect Raw JSON / NBT...',
            panel_ctx_more: 'More Actions',
            panel_status_ok: 'All particle assets resolved',
            panel_status_missing: '{count} missing particle asset(s)',
            panel_status_embedded: 'Self-contained mode ({count} embedded)',
            panel_no_particles: 'No particle keyframes in the active project.',
            panel_preview_enhanced: 'Preview: ParticleCue Unified',
            panel_preview_native: 'Preview: Blockbench Native',
            panel_btn_new: 'New Effect',
            panel_btn_relink: 'Batch Relink',
            panel_btn_export_zip: 'Export ZIP',
            panel_btn_import_zip: 'Import ZIP',
            panel_btn_save_embedded: 'Save Self-Contained',
            panel_btn_inspect: 'Inspect / Edit',
            panel_btn_rescan: 'Rescan',
            dialog_new_title: 'Create New Particle Effect',
            dialog_relink_title: 'Relink Missing Particle Assets',
            dialog_relink_pick_root: 'Choose Asset Root Folder',
            dialog_relink_apply: 'Apply Relink',
            dialog_relink_none_missing: 'No missing particle assets were found in this project.',
            dialog_relink_ambiguous: 'Multiple matching files found — choose explicitly',
            dialog_relink_no_match: 'No match found under selected root',
            dialog_relink_matched: 'Matched',
            dialog_relink_applied: 'Relinked {count} particle binding(s).',
            dialog_relink_need_choice: 'Please select a concrete file for every ambiguous binding or skip it before applying.',
            dialog_zip_export_title: 'Export Portable Project (ZIP)',
            dialog_zip_export_ok: 'Exported portable ZIP: {path}',
            dialog_zip_import_title: 'Import Portable Project (ZIP)',
            dialog_zip_import_ok: 'Imported portable ZIP project: {name}',
            dialog_embedded_title: 'Save Self-Contained .bbmodel',
            dialog_embedded_ok: 'Saved self-contained .bbmodel: {path}',
            dialog_embedded_missing_warn: 'External dependencies are missing and cannot be silently skipped:\n{details}',
            dialog_inspect_title: 'Particle Assets & Multi-Format Editor',
            dialog_inspect_save: 'Apply Changes',
            dialog_inspect_export_particle: 'Export Asset...',
            msg_missing_toast: 'ParticleCue: {count} missing particle file(s). Open Batch Relink to restore.',
            msg_embedded_restored: 'ParticleCue: Restored {count} embedded particle asset(s).',
            msg_zip_invalid: 'Invalid or unsafe ZIP archive: {reason}',
            msg_desktop_required: 'This operation requires Blockbench Desktop with filesystem access.',
            col_effect: 'Effect',
            col_missing_file: 'Missing File',
            col_keyframes: 'Affected Keyframes',
            col_candidate: 'Candidate Resolution'
        },
        zh: {
            plugin_title: 'ParticleCue Studio',
            plugin_desc: '独立的 Blockbench 桌面多格式粒子创作插件，覆盖 Snowstorm/Bedrock、LumenFX JSON、Unity/Niagara 导入覆盖、Photon .fx 与 KBR 3D 粒子，支持工程可携带分享及 AnimCue/PAL 联动。',
            menu_root: 'ParticleCue Studio',
            menu_new_effect: '新建粒子特效 (Snowstorm / LumenFX / Photon / KBR 3D)...',
            menu_import_effect: '导入粒子文件 (.json / .fx)...',
            menu_relink: '批量重连缺失粒子素材...',
            menu_export_zip: '导出可携带工程 (普通 ZIP)...',
            menu_import_zip: '直接导入工程 ZIP...',
            menu_save_embedded: '另存为自包含 .bbmodel...',
            menu_inspect_assets: '查看 / 编辑原始粒子资产...',
            menu_kilagraph: '打开 KilaGraph 节点着色器编辑器...',
            menu_export_pal_emote: '导出 PAL .emote.json（含粒子关键帧）...',
            menu_toggle_preview: '启用 ParticleCue 多格式统一预览',
            menu_rescan: '重新扫描工程粒子资源',
            panel_title: 'ParticleCue Studio',
            panel_tool_new: '新建',
            panel_tool_import: '导入特效 / ZIP',
            panel_tool_kilagraph: 'KilaGraph 节点着色器',
            panel_tool_share: '分享',
            tab_effects: '特效',
            tab_emitters: '发射器',
            tab_materials: '材质/场景',
            panel_bindings_heading: '粒子关键帧绑定',
            panel_missing_hint: '点击选择新素材根目录并一键批量重连',
            panel_select_effect_hint: '请在“特效”页选中一个特效，或点击上方新建后即可实时编辑。',
            panel_mat_lumenfx_hint: '选中 LumenFX 特效后可编辑材质状态、KilaMaterial 模块、KilaGraph 节点图与光源/体积雾/贴花。',
            panel_btn_open_kilagraph: '打开 KilaGraph 节点编辑器',
            panel_ctx_edit_emitters: '编辑发射器与模块',
            panel_ctx_edit_materials: '编辑材质与着色器',
            panel_ctx_open_kilagraph: '打开 KilaGraph 节点图',
            panel_ctx_edit_keyframe: '编辑关键帧时刻 / 定位点 / 脚本...',
            panel_ctx_raw_json: '查看原始 JSON / NBT...',
            panel_ctx_more: '更多操作',
            panel_status_ok: '全部粒子资源已就绪',
            panel_status_missing: '缺失 {count} 项粒子资源',
            panel_status_embedded: '自包含模式（已内嵌 {count} 项粒子）',
            panel_no_particles: '当前工程尚无粒子关键帧。',
            panel_preview_enhanced: '预览引擎：ParticleCue 统一多格式',
            panel_preview_native: '预览引擎：Blockbench 原生',
            panel_btn_new: '新建特效',
            panel_btn_relink: '批量重连',
            panel_btn_export_zip: '导出 ZIP',
            panel_btn_import_zip: '导入 ZIP',
            panel_btn_save_embedded: '自包含另存',
            panel_btn_inspect: '查看/编辑',
            panel_btn_rescan: '重扫资源',
            dialog_new_title: '新建粒子特效',
            dialog_relink_title: '批量重连缺失粒子素材',
            dialog_relink_pick_root: '选择资源根目录',
            dialog_relink_apply: '应用批量重连',
            dialog_relink_none_missing: '当前工程没有缺失的粒子素材。',
            dialog_relink_ambiguous: '存在多个同名候选，请手动选择',
            dialog_relink_no_match: '所选根目录下未找到匹配文件',
            dialog_relink_matched: '已匹配',
            dialog_relink_applied: '已重连 {count} 处粒子关键帧绑定。',
            dialog_relink_need_choice: '存在未明确选择的歧义项，请先指定目标文件或选择跳过。',
            dialog_zip_export_title: '导出可携带工程 (普通 ZIP)',
            dialog_zip_export_ok: '已导出普通 ZIP 工程：{path}',
            dialog_zip_import_title: '直接导入工程 ZIP',
            dialog_zip_import_ok: '已导入 ZIP 工程：{name}',
            dialog_embedded_title: '另存为自包含 .bbmodel',
            dialog_embedded_ok: '已保存自包含 .bbmodel：{path}',
            dialog_embedded_missing_warn: '检测到缺失的外部依赖，未静默跳过：\n{details}',
            dialog_inspect_title: '工程粒子资产与多格式编辑',
            dialog_inspect_save: '应用修改',
            dialog_inspect_export_particle: '导出粒子文件...',
            msg_missing_toast: 'ParticleCue：检测到 {count} 项缺失粒子资源，可点击“批量重连”恢复。',
            msg_embedded_restored: 'ParticleCue：已从自包含工程恢复 {count} 项内嵌粒子资产。',
            msg_zip_invalid: 'ZIP 归档校验失败：{reason}',
            msg_desktop_required: '该功能需要 Blockbench 桌面端及文件系统访问权限。',
            col_effect: '效果名',
            col_missing_file: '原缺失路径',
            col_keyframes: '受影响关键帧',
            col_candidate: '重连候选'
        }
    };

    function code() {
        const lang = (typeof Language !== 'undefined' && Language?.code)
            ? String(Language.code).toLowerCase()
            : (typeof settings !== 'undefined' && settings?.language?.value ? String(settings.language.value).toLowerCase() : 'en');
        return lang.startsWith('zh') ? 'zh' : 'en';
    }

    function t(key, vars) {
        const lang = code();
        const table = STRINGS[lang] || STRINGS.en;
        let text = table[key] ?? STRINGS.en[key] ?? key;
        if (vars && typeof vars === 'object') {
            for (const [k, v] of Object.entries(vars)) {
                text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
            }
        }
        return text;
    }

    return {code, t};
})();


/* === src/core/platform.js === */
const Platform = (() => {
    let cachedPath = null;
    let cachedCrypto = null;
    let cachedFullFs = null;
    const scopedFsCache = new Map();

    function getNative(moduleName, options) {
        const req = __pcRequireNative || __pcRequire;
        if (typeof req !== 'function') return null;
        try {
            return req(moduleName, options);
        } catch (_err) {
            return null;
        }
    }

    function pathMod() {
        if (cachedPath) return cachedPath;
        if (typeof PathModule !== 'undefined' && PathModule) {
            cachedPath = PathModule;
            return cachedPath;
        }
        cachedPath = getNative('path');
        return cachedPath;
    }

    function cryptoMod() {
        if (cachedCrypto) return cachedCrypto;
        cachedCrypto = getNative('crypto');
        return cachedCrypto;
    }

    function getFs(scope, message) {
        if (typeof isApp !== 'undefined' && !isApp) return null;
        const normalizedScope = scope ? normalizeFsPath(scope) : '';
        if (cachedFullFs) return cachedFullFs;
        if (normalizedScope && scopedFsCache.has(normalizedScope)) {
            return scopedFsCache.get(normalizedScope);
        }
        const opts = {};
        if (normalizedScope) opts.scope = normalizedScope;
        if (message) opts.message = message;
        const mod = getNative('fs', opts);
        if (mod) {
            if (normalizedScope) scopedFsCache.set(normalizedScope, mod);
            else cachedFullFs = mod;
            return mod;
        }
        // Fallback when full fs is already granted or global fs exists in older hosts
        if (!normalizedScope && typeof fs !== 'undefined' && fs && typeof fs.readFileSync === 'function') {
            cachedFullFs = fs;
            return cachedFullFs;
        }
        return null;
    }

    function normalizeFsPath(inputPath) {
        if (!inputPath || typeof inputPath !== 'string') return '';
        const pm = pathMod();
        const trimmed = inputPath.trim();
        if (!trimmed) return '';
        if (pm && typeof pm.normalize === 'function') {
            return pm.normalize(trimmed);
        }
        return trimmed;
    }

    function toPosixPath(inputPath) {
        if (!inputPath || typeof inputPath !== 'string') return '';
        return inputPath.replace(/\\/g, '/').replace(/\/+/g, '/');
    }

    function isAbsolutePath(inputPath) {
        if (!inputPath || typeof inputPath !== 'string') return false;
        const trimmed = inputPath.trim();
        if (/^[a-zA-Z]:[\\/]/.test(trimmed) || trimmed.startsWith('\\\\') || trimmed.startsWith('/')) {
            return true;
        }
        const pm = pathMod();
        return Boolean(pm && pm.isAbsolute(trimmed));
    }

    function isVirtualPath(inputPath) {
        return typeof inputPath === 'string' && inputPath.startsWith('particlecue://');
    }

    function dirname(filePath) {
        if (!filePath || typeof filePath !== 'string') return '';
        const pm = pathMod();
        if (pm) return pm.dirname(filePath);
        const norm = toPosixPath(filePath);
        const idx = norm.lastIndexOf('/');
        return idx >= 0 ? norm.slice(0, idx) : '';
    }

    function basename(filePath) {
        if (!filePath || typeof filePath !== 'string') return '';
        const norm = toPosixPath(filePath);
        const parts = norm.split('/').filter(Boolean);
        return parts.length ? parts[parts.length - 1] : '';
    }

    function extname(filePath) {
        const base = basename(filePath);
        const idx = base.lastIndexOf('.');
        return idx > 0 ? base.slice(idx).toLowerCase() : '';
    }

    function joinPath(...segments) {
        const clean = segments.filter(s => typeof s === 'string' && s.length > 0);
        if (!clean.length) return '';
        const pm = pathMod();
        if (pm) return pm.join(...clean);
        return toPosixPath(clean.join('/'));
    }

    function resolvePath(baseDir, targetPath) {
        if (!targetPath || typeof targetPath !== 'string') return '';
        if (isVirtualPath(targetPath) || isAbsolutePath(targetPath)) {
            return isVirtualPath(targetPath) ? targetPath : normalizeFsPath(targetPath);
        }
        if (!baseDir) return normalizeFsPath(targetPath);
        const pm = pathMod();
        if (pm) return pm.resolve(baseDir, targetPath);
        return toPosixPath(`${baseDir}/${targetPath}`);
    }

    function relativePath(fromDir, toTarget) {
        if (!fromDir || !toTarget) return '';
        const pm = pathMod();
        if (!pm) return '';
        try {
            const rel = pm.relative(fromDir, toTarget);
            if (!rel || isAbsolutePath(rel)) return '';
            return toPosixPath(rel);
        } catch (_err) {
            return '';
        }
    }

    function pathKey(inputPath) {
        if (!inputPath || typeof inputPath !== 'string') return '';
        if (isVirtualPath(inputPath)) return inputPath;
        const norm = toPosixPath(normalizeFsPath(inputPath));
        const isWin = typeof SystemInfo !== 'undefined' && SystemInfo?.platform === 'win32';
        return isWin ? norm.toLowerCase() : norm;
    }

    function fileExists(filePath, scopeHint) {
        if (!filePath || isVirtualPath(filePath)) return false;
        const fsMod = getFs(scopeHint || dirname(filePath), 'Check whether linked particle assets exist on disk.');
        if (!fsMod) return false;
        try {
            return fsMod.existsSync(filePath) && fsMod.statSync(filePath).isFile();
        } catch (_err) {
            return false;
        }
    }

    function readTextFile(filePath, scopeHint) {
        if (!filePath || isVirtualPath(filePath)) return null;
        const fsMod = getFs(scopeHint || dirname(filePath), 'Read particle definitions referenced by the project.');
        if (fsMod) {
            try {
                if (!fsMod.existsSync(filePath)) return null;
                return fsMod.readFileSync(filePath, 'utf8');
            } catch (_err) {
                return null;
            }
        }
        return null;
    }

    function readBinaryFile(filePath, scopeHint) {
        if (!filePath || isVirtualPath(filePath)) return null;
        const fsMod = getFs(scopeHint || dirname(filePath), 'Read particle textures or binary dependencies referenced by the project.');
        if (fsMod) {
            try {
                if (!fsMod.existsSync(filePath)) return null;
                return fsMod.readFileSync(filePath);
            } catch (_err) {
                return null;
            }
        }
        return null;
    }

    function writeBinaryFile(filePath, data, scopeHint) {
        const dir = dirname(filePath);
        const fsMod = getFs(scopeHint || dir, 'Write exported project archive or extracted assets.');
        if (fsMod) {
            fsMod.mkdirSync(dir, {recursive: true});
            fsMod.writeFileSync(filePath, data);
            return true;
        }
        if (typeof Blockbench !== 'undefined' && typeof Blockbench.writeFile === 'function') {
            Blockbench.writeFile(filePath, {content: data, savetype: typeof data === 'string' ? 'text' : 'binary'});
            return true;
        }
        throw new Error(Locale.t('msg_desktop_required'));
    }

    function writeTextFile(filePath, content, scopeHint) {
        return writeBinaryFile(filePath, String(content ?? ''), scopeHint);
    }

    function readTextFileAsync(filePath) {
        return new Promise((resolve) => {
            const sync = readTextFile(filePath);
            if (sync !== null) {
                resolve(sync);
                return;
            }
            if (typeof Blockbench !== 'undefined' && typeof Blockbench.read === 'function') {
                try {
                    Blockbench.read([filePath], {errorbox: false}, (files) => {
                        if (files && files[0] && typeof files[0].content === 'string') {
                            resolve(files[0].content);
                        } else {
                            resolve(null);
                        }
                    });
                    return;
                } catch (_err) {}
            }
            resolve(null);
        });
    }

    function listFilesRecursive(rootDir, options = {}) {
        const fsMod = getFs(rootDir, 'Scan the chosen asset root folder to locate missing particle definitions and textures.');
        if (!fsMod) {
            throw new Error(Locale.t('msg_desktop_required'));
        }
        const maxFiles = options.maxFiles || 25000;
        const filterExt = Array.isArray(options.extensions)
            ? new Set(options.extensions.map(e => e.toLowerCase()))
            : null;
        const results = [];
        const stack = [normalizeFsPath(rootDir)];

        while (stack.length && results.length < maxFiles) {
            const current = stack.pop();
            let entries;
            try {
                entries = fsMod.readdirSync(current, {withFileTypes: true});
            } catch (_err) {
                continue;
            }
            for (const entry of entries) {
                if (results.length >= maxFiles) break;
                const full = joinPath(current, entry.name);
                if (entry.isDirectory()) {
                    if (entry.name === '.git' || entry.name === 'node_modules') continue;
                    stack.push(full);
                } else if (entry.isFile()) {
                    const lowerName = entry.name.toLowerCase();
                    if (filterExt) {
                        const ext = extname(lowerName);
                        if (!filterExt.has(ext)) continue;
                    }
                    results.push({
                        fullPath: full,
                        relPath: relativePath(rootDir, full) || entry.name,
                        name: entry.name,
                        lowerName
                    });
                }
            }
        }
        return results;
    }

    function sha256(data) {
        const c = cryptoMod();
        if (c && typeof c.createHash === 'function') {
            const h = c.createHash('sha256');
            if (typeof data === 'string') h.update(data, 'utf8');
            else h.update(data);
            return h.digest('hex');
        }
        // Pure-JS FNV-1a 64-bit fallback for web/restricted environments
        const str = typeof data === 'string'
            ? data
            : (data instanceof Uint8Array ? Array.from(data).join(',') : String(data));
        let h1 = 0x811c9dc5;
        let h2 = 0x9e3779b9;
        for (let i = 0; i < str.length; i++) {
            const ch = str.charCodeAt(i);
            h1 ^= ch;
            h1 = Math.imul(h1, 0x01000193);
            h2 ^= (ch + i);
            h2 = Math.imul(h2, 0x01000193);
        }
        return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
    }

    function bytesToBase64(bytes) {
        if (typeof Buffer !== 'undefined') {
            return Buffer.from(bytes).toString('base64');
        }
        let binary = '';
        const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
        for (let i = 0; i < arr.length; i++) binary += String.fromCharCode(arr[i]);
        return btoa(binary);
    }

    function base64ToUint8Array(b64) {
        if (typeof Buffer !== 'undefined') {
            const buf = Buffer.from(b64, 'base64');
            return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
        }
        const binary = atob(b64);
        const arr = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
        return arr;
    }

    function toFileUrl(filePath) {
        if (!filePath || typeof filePath !== 'string') return '';
        if (filePath.startsWith('data:') || filePath.startsWith('file://') || filePath.startsWith('blob:')) {
            return filePath;
        }
        const posix = toPosixPath(normalizeFsPath(filePath));
        const encoded = posix.split('/').map((seg, idx) => {
            if (idx === 0 && /^[a-zA-Z]:$/.test(seg)) return seg;
            return encodeURIComponent(seg);
        }).join('/');
        return encoded.startsWith('/') ? `file://${encoded}` : `file:///${encoded}`;
    }

    function guessMimeType(filePath) {
        const ext = extname(filePath);
        switch (ext) {
            case '.png': return 'image/png';
            case '.jpg':
            case '.jpeg': return 'image/jpeg';
            case '.webp': return 'image/webp';
            case '.tga': return 'image/x-tga';
            case '.json': return 'application/json';
            default: return 'application/octet-stream';
        }
    }

    function binaryToDataUrl(bytes, mime) {
        return `data:${mime || 'application/octet-stream'};base64,${bytesToBase64(bytes)}`;
    }

    function dataUrlToBinary(dataUrl) {
        if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return null;
        const comma = dataUrl.indexOf(',');
        if (comma < 0) return null;
        const meta = dataUrl.slice(5, comma);
        const payload = dataUrl.slice(comma + 1);
        const mime = meta.split(';')[0] || 'application/octet-stream';
        const isBase64 = meta.includes(';base64');
        const bytes = isBase64
            ? base64ToUint8Array(payload)
            : new TextEncoder().encode(decodeURIComponent(payload));
        return {mime, bytes};
    }

    function validateArchiveEntryPath(rawName) {
        if (typeof rawName !== 'string' || !rawName.length) {
            return {ok: false, reason: 'Empty archive entry path'};
        }
        if (rawName.includes('\0')) {
            return {ok: false, reason: `Null byte in entry path: ${rawName}`};
        }
        if (rawName.includes('\\')) {
            return {ok: false, reason: `Backslash path separator not allowed in portable ZIP: ${rawName}`};
        }
        if (rawName.startsWith('/') || /^[a-zA-Z]:/.test(rawName)) {
            return {ok: false, reason: `Absolute or drive-prefixed entry path not allowed: ${rawName}`};
        }
        const trimmed = rawName.endsWith('/') ? rawName.slice(0, -1) : rawName;
        const segments = trimmed.split('/');
        for (const seg of segments) {
            if (!seg || seg === '.' || seg === '..') {
                return {ok: false, reason: `Invalid or traversal segment in entry path: ${rawName}`};
            }
            if (/[<>:"|?*]/.test(seg)) {
                return {ok: false, reason: `Illegal filename character in entry path: ${rawName}`};
            }
            if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i.test(seg)) {
                return {ok: false, reason: `Reserved Windows device name in entry path: ${rawName}`};
            }
        }
        return {ok: true, normalized: trimmed};
    }

    function sanitizeFilename(name) {
        const cleaned = String(name || 'asset')
            .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
            .replace(/\s+/g, '_')
            .replace(/^\.+/, '');
        return cleaned || 'asset';
    }

    function pickDirectory(options = {}) {
        if (typeof Blockbench !== 'undefined' && typeof Blockbench.pickDirectory === 'function') {
            return Blockbench.pickDirectory(options);
        }
        if (typeof Filesystem !== 'undefined' && typeof Filesystem.pickDirectory === 'function') {
            return Filesystem.pickDirectory(options);
        }
        return null;
    }

    function readPngDimensions(bytes) {
        if (!bytes || bytes.length < 24) return null;
        if (bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4E || bytes[3] !== 0x47) return null;
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        const width = view.getUint32(16, false);
        const height = view.getUint32(20, false);
        if (width > 0 && height > 0) return {width, height};
        return null;
    }

    return {
        getNative,
        getFs,
        pathMod,
        normalizeFsPath,
        toPosixPath,
        isAbsolutePath,
        isVirtualPath,
        dirname,
        basename,
        extname,
        joinPath,
        resolvePath,
        relativePath,
        pathKey,
        fileExists,
        readTextFile,
        readTextFileAsync,
        readBinaryFile,
        writeTextFile,
        writeBinaryFile,
        listFilesRecursive,
        sha256,
        bytesToBase64,
        base64ToUint8Array,
        toFileUrl,
        guessMimeType,
        binaryToDataUrl,
        dataUrlToBinary,
        validateArchiveEntryPath,
        sanitizeFilename,
        pickDirectory,
        readPngDimensions
    };
})();


/* === src/core/format_registry.js === */
const FormatRegistry = (() => {
    const adapters = new Map();

    function register(adapter) {
        if (!adapter || !adapter.id) {
            throw new Error('ParticleCue format adapter requires an id');
        }
        adapters.set(adapter.id, adapter);
        return adapter;
    }

    function unregister(id) {
        adapters.delete(id);
    }

    function get(id) {
        return adapters.get(id) || null;
    }

    function list() {
        return Array.from(adapters.values());
    }

    function detect(rawText, filePath) {
        for (const adapter of adapters.values()) {
            try {
                if (typeof adapter.canParse === 'function' && adapter.canParse(rawText, filePath)) {
                    return adapter;
                }
            } catch (_err) {}
        }
        return null;
    }

    return {register, unregister, get, list, detect};
})();


/* === src/bedrock/snowstorm_parser.js === */
const SnowstormParser = (() => {
    const BUILTIN_TEXTURES = new Set([
        'textures/particle/particles',
        'textures/particle/campfire_smoke',
        'textures/particle/soul',
        'textures/particle/generic_0',
        'textures/particle/generic_1',
        'textures/particle/generic_2',
        'textures/particle/generic_3',
        'textures/particle/generic_4',
        'textures/particle/generic_5',
        'textures/particle/generic_6',
        'textures/particle/generic_7'
    ]);

    function safeParseJson(rawText) {
        if (typeof rawText === 'object' && rawText !== null) return rawText;
        if (typeof rawText !== 'string' || !rawText.trim()) return null;
        if (typeof autoParseJSON === 'function') {
            const parsed = autoParseJSON(rawText, false);
            if (parsed && typeof parsed === 'object') return parsed;
        }
        try {
            return JSON.parse(rawText);
        } catch (_err) {
            // Allow // and /* */ comments commonly used in Bedrock particle JSON
            try {
                const stripped = rawText
                    .replace(/\/\*[\s\S]*?\*\//g, '')
                    .replace(/^\s*\/\/.*$/gm, '');
                return JSON.parse(stripped);
            } catch (_err2) {
                return null;
            }
        }
    }

    function canParse(rawText, filePath) {
        const json = safeParseJson(rawText);
        if (json && typeof json === 'object' && json.particle_effect && typeof json.particle_effect === 'object') {
            return true;
        }
        if (typeof filePath === 'string' && /\.particle\.json$/i.test(filePath) && json && json.particle_effect) {
            return true;
        }
        return false;
    }

    function normalizeComponentKey(key) {
        return String(key || '').replace(/^minecraft:/i, '');
    }

    function getComponent(components, shortName) {
        if (!components || typeof components !== 'object') return undefined;
        if (components[`minecraft:${shortName}`] !== undefined) return components[`minecraft:${shortName}`];
        if (components[shortName] !== undefined) return components[shortName];
        for (const [k, v] of Object.entries(components)) {
            if (normalizeComponentKey(k) === shortName) return v;
        }
        return undefined;
    }

    function inspect(rawText, filePath) {
        const json = safeParseJson(rawText);
        if (!json || !json.particle_effect) return null;

        const pe = json.particle_effect;
        const desc = pe.description || {};
        const renderParams = desc.basic_render_parameters || {};
        const components = pe.components || {};
        const localSpace = getComponent(components, 'emitter_local_space') || {};
        const billboard = getComponent(components, 'particle_appearance_billboard') || {};
        const tinting = getComponent(components, 'particle_appearance_tinting') || {};
        const rateSteady = getComponent(components, 'emitter_rate_steady');
        const rateInstant = getComponent(components, 'emitter_rate_instant');
        const lifeLoop = getComponent(components, 'emitter_lifetime_looping');
        const lifeOnce = getComponent(components, 'emitter_lifetime_once');
        const lifeExpr = getComponent(components, 'emitter_lifetime_expression');
        const events = pe.events || {};

        const childIdentifiers = [];
        for (const ev of Object.values(events)) {
            if (ev && ev.particle_effect && typeof ev.particle_effect.effect === 'string') {
                childIdentifiers.push(ev.particle_effect.effect);
            }
        }

        const textureRef = typeof renderParams.texture === 'string' ? renderParams.texture.trim() : '';
        const material = typeof renderParams.material === 'string' ? renderParams.material.trim() : 'particles_alpha';

        return {
            format: 'bedrock_snowstorm',
            formatVersion: json.format_version || '1.10.0',
            identifier: typeof desc.identifier === 'string' ? desc.identifier : '',
            material,
            textureRef,
            isBuiltinTexture: isBuiltinTextureRef(textureRef),
            localSpace: {
                position: Boolean(localSpace.position),
                rotation: Boolean(localSpace.rotation),
                velocity: Boolean(localSpace.velocity)
            },
            facingCameraMode: billboard.facing_camera_mode || 'rotate_xyz',
            uv: billboard.uv || null,
            hasFlipbook: Boolean(billboard.uv && billboard.uv.flipbook),
            hasTint: Boolean(tinting && tinting.color !== undefined),
            rateMode: rateInstant ? 'instant' : (rateSteady ? 'steady' : 'manual'),
            lifetimeMode: lifeOnce ? 'once' : (lifeExpr ? 'expression' : 'looping'),
            activeTime: lifeOnce?.active_time ?? lifeLoop?.active_time ?? 1,
            sleepTime: lifeLoop?.sleep_time ?? 0,
            childIdentifiers,
            json,
            rawText: typeof rawText === 'string' ? rawText : JSON.stringify(json, null, '\t'),
            filePath: filePath || ''
        };
    }

    function isBuiltinTextureRef(textureRef) {
        if (!textureRef) return false;
        const clean = Platform.toPosixPath(textureRef).replace(/\.png$/i, '');
        return BUILTIN_TEXTURES.has(clean);
    }

    function parseTextureReference(textureRef) {
        const clean = Platform.toPosixPath(String(textureRef || '').trim()).replace(/\.png$/i, '');
        if (!clean) {
            return {raw: '', namespace: '', path: '', stem: '', isNamespaced: false};
        }
        const colon = clean.indexOf(':');
        if (colon > 0 && !/^[a-zA-Z]:\//.test(clean)) {
            const namespace = clean.slice(0, colon);
            const rel = clean.slice(colon + 1).replace(/^\/+/, '');
            const stem = rel.split('/').pop() || rel;
            return {raw: clean, namespace, path: rel, stem, isNamespaced: true};
        }
        const rel = clean.replace(/^\/+/, '');
        const stem = rel.split('/').pop() || rel;
        return {raw: clean, namespace: '', path: rel, stem, isNamespaced: false};
    }

    function buildTextureCandidatePaths(textureRef, particleFilePath, extraRoots = []) {
        const ref = parseTextureReference(textureRef);
        if (!ref.raw) return [];

        const candidates = [];
        const seen = new Set();
        const add = (p) => {
            if (!p) return;
            const norm = Platform.normalizeFsPath(p);
            const key = Platform.pathKey(norm);
            if (!seen.has(key)) {
                seen.add(key);
                candidates.push(norm);
            }
        };

        // Direct absolute path if someone stored one
        if (Platform.isAbsolutePath(textureRef)) {
            add(textureRef.endsWith('.png') ? textureRef : `${textureRef}.png`);
        }

        const searchRoots = [];
        const addRoot = (r) => {
            if (!r || Platform.isVirtualPath(r)) return;
            const norm = Platform.normalizeFsPath(r);
            if (!searchRoots.includes(norm)) searchRoots.push(norm);
        };

        if (particleFilePath && !Platform.isVirtualPath(particleFilePath)) {
            const dir = Platform.dirname(particleFilePath);
            addRoot(dir);
            const posix = Platform.toPosixPath(particleFilePath);
            const segments = posix.split('/');
            // Check Bedrock `particles/` root and Java `particle_definitions/` & `assets/<ns>/` roots
            const markers = ['particles', 'particle_definitions', 'assets'];
            for (const marker of markers) {
                const idx = segments.lastIndexOf(marker);
                if (idx > 0) {
                    const parentBeforeMarker = segments.slice(0, idx).join('/');
                    addRoot(parentBeforeMarker);
                    if (marker === 'assets' && segments[idx + 1]) {
                        addRoot(segments.slice(0, idx + 2).join('/'));
                    }
                }
            }
            // Walk up to 4 ancestor directories to cover custom pack layouts
            let cur = dir;
            for (let depth = 0; depth < 4; depth++) {
                const parent = Platform.dirname(cur);
                if (!parent || parent === cur) break;
                addRoot(parent);
                cur = parent;
            }
        }

        for (const r of extraRoots) addRoot(r);

        const relPatterns = [];
        const addRel = (r) => {
            if (r && !relPatterns.includes(r)) relPatterns.push(r);
        };

        if (ref.isNamespaced) {
            const ns = ref.namespace;
            const p = ref.path;
            const hasTexturesPrefix = p.startsWith('textures/');
            const withPng = p.endsWith('.png') ? p : `${p}.png`;
            if (hasTexturesPrefix) {
                addRel(`assets/${ns}/${withPng}`);
                addRel(withPng);
            } else {
                addRel(`assets/${ns}/textures/particle/${withPng}`);
                addRel(`assets/${ns}/textures/${withPng}`);
                addRel(`textures/particle/${withPng}`);
                addRel(`textures/${withPng}`);
                addRel(withPng);
            }
            addRel(`textures/particle/${ref.stem}.png`);
            addRel(`textures/${ref.stem}.png`);
            addRel(`${ref.stem}.png`);
        } else {
            const p = ref.path;
            const withPng = p.endsWith('.png') ? p : `${p}.png`;
            addRel(withPng);
            if (!p.startsWith('textures/')) {
                addRel(`textures/particle/${withPng}`);
                addRel(`textures/${withPng}`);
            }
            addRel(`textures/particle/${ref.stem}.png`);
            addRel(`textures/${ref.stem}.png`);
            addRel(`${ref.stem}.png`);
        }

        for (const root of searchRoots) {
            for (const rel of relPatterns) {
                add(Platform.joinPath(root, rel));
            }
        }

        return candidates;
    }

    function resolveTextureOnDisk(textureRef, particleFilePath, extraRoots = []) {
        if (!textureRef) return null;
        const candidates = buildTextureCandidatePaths(textureRef, particleFilePath, extraRoots);
        for (const candidate of candidates) {
            if (Platform.fileExists(candidate, Platform.dirname(candidate))) {
                return candidate;
            }
        }
        return null;
    }

    function registerFormat() {
        return FormatRegistry.register({
            id: 'bedrock_snowstorm',
            label: 'Snowstorm / Bedrock Particle',
            extensions: ['.particle.json', '.json'],
            canParse,
            inspect,
            resolveTextureOnDisk,
            isBuiltinTextureRef
        });
    }

    return {
        BUILTIN_TEXTURES,
        safeParseJson,
        canParse,
        inspect,
        getComponent,
        isBuiltinTextureRef,
        parseTextureReference,
        buildTextureCandidatePaths,
        resolveTextureOnDisk,
        registerFormat
    };
})();


/* === src/bedrock/snowstorm_editor.js === */
const SnowstormEditor = (() => {
    const MATERIALS = ['particles_alpha', 'particles_opaque', 'particles_blend', 'particles_add'];
    const FACING_MODES = [
        'rotate_xyz',
        'rotate_y',
        'lookat_xyz',
        'lookat_y',
        'direction_x',
        'direction_y',
        'direction_z',
        'lookat_direction',
        'emitter_transform_xy',
        'emitter_transform_xz',
        'emitter_transform_yz'
    ];

    function extractEditableParams(rawText) {
        const meta = SnowstormParser.inspect(rawText);
        if (!meta || !meta.json?.particle_effect) return null;
        const pe = meta.json.particle_effect;
        const desc = pe.description || {};
        const render = desc.basic_render_parameters || {};
        const comps = pe.components || {};
        const localSpace = comps['minecraft:emitter_local_space'] || {};
        const steady = comps['minecraft:emitter_rate_steady'];
        const instant = comps['minecraft:emitter_rate_instant'];
        const lifeLoop = comps['minecraft:emitter_lifetime_looping'];
        const lifeOnce = comps['minecraft:emitter_lifetime_once'];
        const billboard = comps['minecraft:particle_appearance_billboard'] || {};
        const uv = billboard.uv || {};
        const flipbook = uv.flipbook || null;
        const pLife = comps['minecraft:particle_lifetime_expression'] || {};

        return {
            identifier: String(desc.identifier || ''),
            material: String(render.material || 'particles_alpha'),
            texture: String(render.texture || ''),
            rateMode: instant ? 'instant' : 'steady',
            spawnRate: Number(steady?.spawn_rate ?? instant?.num_particles ?? 12),
            maxParticles: Number(steady?.max_particles ?? 64),
            lifetimeMode: lifeOnce ? 'once' : 'looping',
            activeTime: Number(lifeLoop?.active_time ?? lifeOnce?.active_time ?? 2.0),
            maxLifetime: Number(pLife.max_lifetime ?? 1.0),
            localPosition: Boolean(localSpace.position),
            localRotation: Boolean(localSpace.rotation),
            facingCameraMode: String(billboard.facing_camera_mode || 'rotate_xyz'),
            size: Array.isArray(billboard.size) ? billboard.size.slice(0, 2) : [0.25, 0.25],
            flipbookEnabled: Boolean(flipbook),
            flipbookFps: Number(flipbook?.frames_per_second ?? 8),
            flipbookMaxFrame: Number(flipbook?.max_frame ?? 4),
            flipbookStretch: Boolean(flipbook?.stretch_to_lifetime),
            flipbookLoop: flipbook ? (flipbook.loop !== false) : true
        };
    }

    /**
     * Apply structured parameter edits back to Snowstorm JSON while preserving
     * all untouched components, curves, events, and unknown fields losslessly.
     */
    function applyEditsLossless(rawText, edits = {}) {
        const meta = SnowstormParser.inspect(rawText);
        if (!meta || !meta.json?.particle_effect) {
            throw new Error('Invalid Snowstorm particle JSON');
        }
        const doc = JSON.parse(JSON.stringify(meta.json));
        const pe = doc.particle_effect;
        if (!pe.description) pe.description = {};
        if (!pe.description.basic_render_parameters) pe.description.basic_render_parameters = {};
        if (!pe.components) pe.components = {};

        if (typeof edits.identifier === 'string' && edits.identifier.trim()) {
            pe.description.identifier = edits.identifier.trim();
        }
        if (typeof edits.material === 'string' && MATERIALS.includes(edits.material)) {
            pe.description.basic_render_parameters.material = edits.material;
        }
        if (typeof edits.texture === 'string') {
            pe.description.basic_render_parameters.texture = edits.texture.trim();
        }

        const comps = pe.components;
        if (typeof edits.localPosition === 'boolean' || typeof edits.localRotation === 'boolean') {
            const cur = comps['minecraft:emitter_local_space'] || {};
            comps['minecraft:emitter_local_space'] = {
                ...cur,
                position: edits.localPosition !== undefined ? Boolean(edits.localPosition) : Boolean(cur.position),
                rotation: edits.localRotation !== undefined ? Boolean(edits.localRotation) : Boolean(cur.rotation)
            };
        }

        if (edits.rateMode === 'instant') {
            delete comps['minecraft:emitter_rate_steady'];
            comps['minecraft:emitter_rate_instant'] = {
                ...(comps['minecraft:emitter_rate_instant'] || {}),
                num_particles: Math.max(1, Math.round(Number(edits.spawnRate) || 8))
            };
        } else if (edits.rateMode === 'steady' || edits.spawnRate !== undefined || edits.maxParticles !== undefined) {
            if (comps['minecraft:emitter_rate_instant'] && edits.rateMode !== 'steady') {
                if (edits.spawnRate !== undefined) {
                    comps['minecraft:emitter_rate_instant'].num_particles = Math.max(1, Math.round(Number(edits.spawnRate) || 8));
                }
            } else {
                delete comps['minecraft:emitter_rate_instant'];
                const cur = comps['minecraft:emitter_rate_steady'] || {};
                comps['minecraft:emitter_rate_steady'] = {
                    ...cur,
                    spawn_rate: edits.spawnRate !== undefined ? Math.max(0, Number(edits.spawnRate) || 0) : (cur.spawn_rate ?? 12),
                    max_particles: edits.maxParticles !== undefined ? Math.max(1, Math.round(Number(edits.maxParticles) || 64)) : (cur.max_particles ?? 64)
                };
            }
        }

        if (edits.lifetimeMode === 'once') {
            delete comps['minecraft:emitter_lifetime_looping'];
            comps['minecraft:emitter_lifetime_once'] = {
                ...(comps['minecraft:emitter_lifetime_once'] || {}),
                active_time: Math.max(0.05, Number(edits.activeTime ?? 1.5))
            };
        } else if (edits.lifetimeMode === 'looping' || edits.activeTime !== undefined) {
            if (comps['minecraft:emitter_lifetime_once'] && edits.lifetimeMode !== 'looping') {
                comps['minecraft:emitter_lifetime_once'].active_time = Math.max(0.05, Number(edits.activeTime));
            } else {
                delete comps['minecraft:emitter_lifetime_once'];
                comps['minecraft:emitter_lifetime_looping'] = {
                    ...(comps['minecraft:emitter_lifetime_looping'] || {}),
                    active_time: Math.max(0.05, Number(edits.activeTime ?? 2.0))
                };
            }
        }

        if (edits.maxLifetime !== undefined) {
            comps['minecraft:particle_lifetime_expression'] = {
                ...(comps['minecraft:particle_lifetime_expression'] || {}),
                max_lifetime: Math.max(0.05, Number(edits.maxLifetime) || 1.0)
            };
        }

        const bb = comps['minecraft:particle_appearance_billboard'] || {};
        if (typeof edits.facingCameraMode === 'string' && FACING_MODES.includes(edits.facingCameraMode)) {
            bb.facing_camera_mode = edits.facingCameraMode;
        }
        if (Array.isArray(edits.size) && edits.size.length >= 2) {
            bb.size = [edits.size[0], edits.size[1]];
        }
        if (edits.flipbookEnabled !== undefined) {
            if (!bb.uv) bb.uv = {};
            if (edits.flipbookEnabled) {
                bb.uv.flipbook = {
                    ...(bb.uv.flipbook || {base_UV: [0, 0], size_UV: [16, 16], step_UV: [16, 0]}),
                    frames_per_second: Math.max(0.1, Number(edits.flipbookFps ?? 8)),
                    max_frame: Math.max(1, Math.round(Number(edits.flipbookMaxFrame ?? 4))),
                    stretch_to_lifetime: Boolean(edits.flipbookStretch),
                    loop: edits.flipbookLoop !== false
                };
            } else {
                delete bb.uv.flipbook;
            }
        }
        comps['minecraft:particle_appearance_billboard'] = bb;

        return JSON.stringify(doc, null, 2);
    }

    function createPreset(options = {}) {
        const id = String(options.identifier || 'particlecue:snowstorm_spark').trim();
        const material = MATERIALS.includes(options.material) ? options.material : 'particles_add';
        const facing = FACING_MODES.includes(options.facingCameraMode) ? options.facingCameraMode : 'rotate_xyz';
        const doc = {
            format_version: '1.10.0',
            particle_effect: {
                description: {
                    identifier: id,
                    basic_render_parameters: {
                        material,
                        texture: options.texture || 'textures/particle/particles'
                    }
                },
                components: {
                    'minecraft:emitter_local_space': {
                        position: Boolean(options.localPosition),
                        rotation: Boolean(options.localRotation)
                    },
                    'minecraft:emitter_rate_steady': {
                        spawn_rate: Number(options.spawnRate ?? 18),
                        max_particles: Number(options.maxParticles ?? 64)
                    },
                    'minecraft:emitter_lifetime_looping': {
                        active_time: Number(options.activeTime ?? 2.0)
                    },
                    'minecraft:emitter_shape_point': {},
                    'minecraft:particle_lifetime_expression': {
                        max_lifetime: Number(options.maxLifetime ?? 1.0)
                    },
                    'minecraft:particle_initial_speed': Number(options.initialSpeed ?? 2.0),
                    'minecraft:particle_motion_dynamic': {
                        linear_acceleration: [0, 1.2, 0]
                    },
                    'minecraft:particle_appearance_billboard': {
                        size: [0.22, 0.22],
                        facing_camera_mode: facing,
                        uv: {
                            texture_width: 128,
                            texture_height: 128,
                            uv: [0, 0],
                            uv_size: [8, 8]
                        }
                    },
                    'minecraft:particle_appearance_tinting': {
                        color: {
                            interpolant: 'variable.particle_age / variable.particle_lifetime',
                            gradient: {
                                '0.0': '#FFFFFFFF',
                                '0.5': '#FFFFC857',
                                '1.0': '#00FF5522'
                            }
                        }
                    }
                }
            }
        };
        return JSON.stringify(doc, null, 2);
    }

    return {
        MATERIALS,
        FACING_MODES,
        extractEditableParams,
        applyEditsLossless,
        createPreset
    };
})();


/* === src/bedrock/snowstorm_preview.js === */
const SnowstormPreview = (() => {
    const MATERIAL_TYPES = ['particles_alpha', 'particles_opaque', 'particles_blend', 'particles_add'];
    const ENHANCED_FRAGMENT_SHADER = [
        'varying vec2 vUv;',
        'varying vec4 vColor;',
        'uniform sampler2D map;',
        'uniform int materialType;',
        'void main(void) {',
        '    vec4 tColor = texture2D(map, vUv);',
        '    if (materialType == 0) {',
        '        float alpha = tColor.a * vColor.a;',
        '        if (alpha < 0.5) discard;',
        '        gl_FragColor = vec4(tColor.rgb * vColor.rgb, 1.0);',
        '    } else if (materialType == 1) {',
        '        gl_FragColor = vec4(tColor.rgb * vColor.rgb, 1.0);',
        '    } else {',
        '        float alpha = tColor.a * vColor.a;',
        '        if (alpha <= 0.001) discard;',
        '        gl_FragColor = vec4(tColor.rgb * vColor.rgb, alpha);',
        '    }',
        '}'
    ].join('\n');

    let enhancedEnabled = true;
    let installed = false;
    let pcScene = null;
    const projectStates = new Map();
    const originals = {};
    const eventCleanups = [];

    // Scratch math objects to avoid per-frame allocations
    const _camPos = () => new THREE.Vector3();
    const _camQuat = () => new THREE.Quaternion();
    const _parentQuat = () => new THREE.Quaternion();
    const _vecA = () => new THREE.Vector3();
    const _vecB = () => new THREE.Vector3();
    const _quatA = () => new THREE.Quaternion();
    const _objTmp = () => new THREE.Object3D();

    let vCamPos, qCamQuat, qParentInv, vWorkA, vWorkB, qWorkA, oTmp;

    function ensureScratch() {
        if (!vCamPos && typeof THREE !== 'undefined') {
            vCamPos = _camPos();
            qCamQuat = _camQuat();
            qParentInv = _parentQuat();
            vWorkA = _vecA();
            vWorkB = _vecB();
            qWorkA = _quatA();
            oTmp = _objTmp();
        }
    }

    function getProjectId(project) {
        const p = project || (typeof Project !== 'undefined' ? Project : null);
        return p ? (p.uuid || '__default__') : '__none__';
    }

    function getProjectState(project, create = true) {
        const id = getProjectId(project);
        if (projectStates.has(id)) return projectStates.get(id);
        if (!create) return null;
        const state = {
            projectId: id,
            assets: new Map(),      // assetKey -> { config, meta, rawText, hash, textureSource, textureExplicitSize, emitters: Map }
            activeEmitterKeys: new Set()
        };
        projectStates.set(id, state);
        return state;
    }

    function ensureScene() {
        if (pcScene) return pcScene;
        if (typeof Wintersky === 'undefined') return null;
        ensureScratch();
        pcScene = new Wintersky.Scene({
            fetchTexture(config) {
                if (config.__pc_texture_override) {
                    return config.__pc_texture_override;
                }
                if (config.preview_texture) {
                    return config.preview_texture;
                }
                if (config.__pc_asset_texture_data_url) {
                    return config.__pc_asset_texture_data_url;
                }
                if (config.__pc_asset_texture_path && Platform.fileExists(config.__pc_asset_texture_path)) {
                    return Platform.toFileUrl(config.__pc_asset_texture_path);
                }
                if (config.file_path && config.particle_texture_path) {
                    const extraRoots = [];
                    if (typeof Project !== 'undefined' && Project?.save_path) {
                        extraRoots.push(Platform.dirname(Project.save_path));
                    }
                    const found = SnowstormParser.resolveTextureOnDisk(
                        config.particle_texture_path,
                        config.file_path,
                        extraRoots
                    );
                    if (found) {
                        config.__pc_asset_texture_path = found;
                        return Platform.toFileUrl(found);
                    }
                }
                return undefined;
            },
            async fetchParticleFile(identifier, config) {
                if (!identifier || !config.file_path) return undefined;
                const state = getProjectState(null, false);
                if (state) {
                    for (const entry of state.assets.values()) {
                        if (entry.meta && entry.meta.identifier === identifier && entry.meta.json) {
                            return {json: entry.meta.json, file_path: entry.filePath || config.file_path};
                        }
                    }
                }
                if (typeof WinterskyScene !== 'undefined' && typeof WinterskyScene._fetchParticleFile === 'function') {
                    return WinterskyScene._fetchParticleFile(identifier, config);
                }
                return undefined;
            }
        });
        pcScene.global_options.scale = 16;
        pcScene.global_options.loop_mode = 'auto';
        pcScene.global_options.parent_mode = 'entity';
        pcScene.space.name = 'particlecue_snowstorm_space';
        pcScene.space.no_export = true;
        return pcScene;
    }

    function attachSceneToCanvas() {
        const scene = ensureScene();
        if (!scene || typeof Canvas === 'undefined' || !Canvas?.scene) return;
        if (typeof settings !== 'undefined' && settings?.particle_tick_rate?.value) {
            scene.global_options.tick_rate = settings.particle_tick_rate.value;
        }
        if (enhancedEnabled && typeof Animator !== 'undefined' && Animator.open) {
            if (!scene.space.parent) {
                Canvas.scene.add(scene.space);
            }
        } else if (scene.space.parent) {
            scene.space.parent.remove(scene.space);
        }
    }

    function normalizeConfigAfterLoad(config, meta, assetInfo) {
        if (!config) return;
        config.__pc_explicit_uv_size = Boolean(meta?.uv && (meta.uv.texture_width || meta.uv.texture_height));
        if (assetInfo?.textureDataUrl) {
            config.__pc_asset_texture_data_url = assetInfo.textureDataUrl;
        } else {
            delete config.__pc_asset_texture_data_url;
        }
        if (assetInfo?.texturePath) {
            config.__pc_asset_texture_path = assetInfo.texturePath;
        } else {
            delete config.__pc_asset_texture_path;
        }

        // Fix unsorted gradient stops in Wintersky
        if (Array.isArray(config.particle_color_gradient) && config.particle_color_gradient.length > 1) {
            config.particle_color_gradient.sort((a, b) => (Number(a.percent) || 0) - (Number(b.percent) || 0));
        }

        // Preserve pixel-art sharpness and sync natural texture dimensions when UV width/height are omitted
        if (config.texture) {
            config.texture.magFilter = THREE.NearestFilter;
            config.texture.minFilter = THREE.NearestFilter;
            config.texture.generateMipmaps = false;
            const prevOnLoad = config.texture.image.onload;
            config.texture.image.onload = () => {
                const img = config.texture.image;
                if (!config.__pc_explicit_uv_size && img && img.naturalWidth > 0 && img.naturalHeight > 0) {
                    config.particle_texture_size = [img.naturalWidth, img.naturalHeight];
                }
                config.texture.needsUpdate = true;
                if (typeof prevOnLoad === 'function') {
                    try { prevOnLoad(); } catch (_err) {}
                }
                if (typeof config.__pc_on_texture_ready === 'function') {
                    config.__pc_on_texture_ready();
                }
            };
        }
        config.updateTexture();
    }

    function patchEmitterInstance(emitter, animUuid, kfUuid, dpIndex, assetRecord) {
        ensureScratch();
        const scene = ensureScene();

        // 1. Patch fragment shader and material blend/depthWrite state
        if (emitter.material) {
            emitter.material.fragmentShader = ENHANCED_FRAGMENT_SHADER;
            emitter.material.needsUpdate = true;
        }

        emitter.updateMaterial = function () {
            if (!this.material) return;
            const matName = String(this.config.particle_appearance_material || 'particles_alpha').trim();
            const matIdx = MATERIAL_TYPES.indexOf(matName);
            const resolvedIdx = matIdx >= 0 ? matIdx : 2;
            this.material.uniforms.materialType.value = resolvedIdx;
            this.material.side = THREE.DoubleSide;
            if (resolvedIdx === 3) {
                // particles_add
                this.material.blending = THREE.AdditiveBlending;
                this.material.transparent = true;
                this.material.depthWrite = false;
            } else if (resolvedIdx === 2) {
                // particles_blend
                this.material.blending = THREE.NormalBlending;
                this.material.transparent = true;
                this.material.depthWrite = false;
            } else {
                // particles_alpha / particles_opaque
                this.material.blending = THREE.NormalBlending;
                this.material.transparent = false;
                this.material.depthWrite = true;
            }
            this.material.needsUpdate = true;
        };
        emitter.updateMaterial();

        // 2. Patch Molang curve evaluation (clamp input to [0, 1]) + query.anim_time/life_time + Animator variables
        const rawVarHandler = emitter.Molang.variableHandler;
        emitter.Molang.variableHandler = (key, params) => {
            const k = String(key || '');
            if (k === 'query.anim_time' || k === 'q.anim_time') {
                return emitter.__pc_anim_time || 0;
            }
            if (k === 'query.life_time' || k === 'q.life_time') {
                return emitter.__pc_anim_time || 0;
            }
            if (emitter.config.curves && emitter.config.curves[k]) {
                return evaluateClampedCurve(emitter, emitter.config.curves[k], k, params);
            }
            if (typeof rawVarHandler === 'function') {
                const res = rawVarHandler.call(emitter, k, params);
                if (res !== undefined && !Number.isNaN(res)) return res;
            }
            if (typeof Animator !== 'undefined' && Animator.MolangParser?.variableHandler) {
                return Animator.MolangParser.variableHandler(k);
            }
            return undefined;
        };

        // Deterministic per-emitter, per-tick PRNG so paused scrubbing and replay produce bit-for-bit identical particle positions
        const hashString32 = (str) => {
            let h = 0x811c9dc5;
            const s = String(str || '');
            for (let i = 0; i < s.length; i++) {
                h ^= s.charCodeAt(i);
                h = Math.imul(h, 0x01000193);
            }
            return h >>> 0;
        };
        const mixSeed32 = (base, step) => {
            let x = ((base >>> 0) ^ Math.imul((step | 0) + 0x9e3779b9, 0x85ebca6b)) >>> 0;
            x ^= x >>> 16;
            x = Math.imul(x, 0x7feb352d) >>> 0;
            x ^= x >>> 15;
            x = Math.imul(x, 0x846ca68b) >>> 0;
            x ^= x >>> 16;
            return x >>> 0;
        };
        const makeMulberry32 = (seed) => {
            let state = seed >>> 0;
            return function () {
                state = (state + 0x6D2B79F5) | 0;
                let t = Math.imul(state ^ (state >>> 15), 1 | state);
                t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
                return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
            };
        };
        const withSeededRandom = (seed, fn) => {
            const origRandom = Math.random;
            Math.random = makeMulberry32(seed);
            try {
                return fn();
            } finally {
                Math.random = origRandom;
            }
        };
        emitter.__pc_rng_seed = hashString32(`${animUuid}::${kfUuid}::${dpIndex}::${assetRecord.assetKey}`);

        // 3. Patch start() so pre_effect_script runs BEFORE creation_vars and active_time, using deterministic per-emitter PRNG
        const origStart = emitter.start.bind(emitter);
        emitter.start = function () {
            return withSeededRandom(mixSeed32(this.__pc_rng_seed, 0), () => {
                const animation = typeof Animation !== 'undefined'
                    ? Animation.all.find(a => a.uuid === animUuid)
                    : null;
                const kfNow = animation?.animators?.effects?.particle?.find(k => k.uuid === kfUuid);
                const dpNow = kfNow && kfNow.data_points[dpIndex];
                const script = dpNow && dpNow.script ? String(dpNow.script).trim() : '';

                this.age = 0;
                this.view_age = 0;
                this.enabled = true;
                this.initialized = true;
                if (this.scene && this.scene.space && !this.global_space.parent) {
                    this.scene.space.add(this.global_space);
                }
                this.Molang.resetVariables();
                const baseParams = this.params();
                // Run pre_effect_script BEFORE creation_vars and active_time so emitter expressions see its variables
                if (script) {
                    try {
                        this.Molang.parse(script, baseParams);
                    } catch (_err) {}
                }
                this.random_vars = [Math.random(), Math.random(), Math.random(), Math.random()];
                this.creation_values = {};
                const paramsAfterRandom = this.params();
                if (script) {
                    try {
                        this.Molang.parse(script, paramsAfterRandom);
                    } catch (_err) {}
                }
                for (const expr of (this.config.variables_creation_vars || [])) {
                    this.Molang.parse(expr, paramsAfterRandom);
                }
                this.active_time = Math.max(0, Number(this.calculate(this.config.emitter_lifetime_active_time, paramsAfterRandom)) || 0);
                this.sleep_time = Math.max(0, Number(this.calculate(this.config.emitter_lifetime_sleep_time, paramsAfterRandom)) || 0);
                this.dispatchEvent('start', {params: paramsAfterRandom});
                this.updateMaterial();
                for (const ev of (this.config.emitter_events_creation || [])) {
                    this.runEvent(ev);
                }
                if (this.config.emitter_rate_mode === 'instant') {
                    const count = Math.max(0, Math.round(Number(this.calculate(this.config.emitter_rate_amount, paramsAfterRandom)) || 0));
                    this.spawnParticles(count);
                } else if (this.config.emitter_rate_mode === 'manual') {
                    this.spawnParticles(1);
                }
                return this;
            });
        };
        emitter.__pc_orig_start = origStart;

        // 3b. Patch tick() so every simulation tick uses a deterministic PRNG seeded by (emitterSeed, tickIndex)
        const origTick = emitter.tick.bind(emitter);
        emitter.tick = function (skipVisual) {
            const tr = Math.max(1, Number(this.scene?.global_options?.tick_rate) || 30);
            const stepTick = Math.round((Number(this.view_age) || 0) * tr) + 1;
            return withSeededRandom(mixSeed32(this.__pc_rng_seed, stepTick), () => origTick(skipVisual));
        };
        emitter.__pc_orig_tick = origTick;

        // 4. Patch spawnParticles so every spawned particle gets patched flipbook, gradient clamp, renderOrder, and world-space spawn orientation
        const origSpawn = emitter.spawnParticles.bind(emitter);
        emitter.spawnParticles = function (count) {
            const beforeLen = this.particles.length;
            const spawned = origSpawn(count);
            const matName = String(this.config.particle_appearance_material || 'particles_alpha').trim();
            const renderOrder = matName === 'particles_add' ? 3 : (matName === 'particles_blend' ? 2 : 0);

            for (let idx = beforeLen; idx < this.particles.length; idx++) {
                const p = this.particles[idx];
                if (!p) continue;
                patchParticleInstance(p, this);
                p.mesh.renderOrder = renderOrder;
                // Record world orientation at spawn time for world-space emitter_transform_* modes
                if (!this.config.space_local_position && this.__pc_locator_world_quat) {
                    p.__pc_spawn_world_quat = this.__pc_locator_world_quat.clone();
                } else {
                    p.__pc_spawn_world_quat = null;
                }
                // Fix local_position=true + local_rotation=false: velocity should not double-flip
                p.__pc_apply_flipbook_and_color();
            }
            return spawned;
        };

        // 5. Patch getActiveSpace to cleanly honor local_position & local_rotation
        emitter.getActiveSpace = function () {
            if (this.config.space_local_position && this.local_space.parent) {
                return this.local_space;
            }
            return this.global_space;
        };

        // 6. Patch updateFacingRotation for world camera quaternion/position, consistent local Z spin across ALL modes, and zero-speed direction fallback
        emitter.updateFacingRotation = function (camera) {
            if (!camera || !this.particles || this.particles.length === 0) return;
            ensureScratch();
            const mode = this.config.particle_appearance_facing_camera_mode || 'rotate_xyz';
            const parent = this.particles[0].mesh.parent;
            if (!parent) return;

            camera.updateMatrixWorld();
            parent.updateMatrixWorld();
            camera.getWorldPosition(vCamPos);
            camera.getWorldQuaternion(qCamQuat);
            parent.getWorldQuaternion(qParentInv).invert();

            for (const p of this.particles) {
                const mesh = p.mesh;
                if (!mesh) continue;
                mesh.rotation.order = 'XYZ';

                if (mode === 'lookat_xyz') {
                    mesh.lookAt(vCamPos);
                } else if (mode === 'lookat_y') {
                    vWorkA.copy(vCamPos);
                    vWorkB.set(0, 0, 0);
                    mesh.localToWorld(vWorkB);
                    vWorkA.y = vWorkB.y;
                    mesh.lookAt(vWorkA);
                } else if (mode === 'rotate_xyz') {
                    mesh.quaternion.copy(qCamQuat).premultiply(qParentInv);
                } else if (mode === 'rotate_y') {
                    const eul = new THREE.Euler().setFromQuaternion(qCamQuat, 'YXZ');
                    eul.x = 0;
                    eul.z = 0;
                    mesh.quaternion.setFromEuler(eul).premultiply(qParentInv);
                } else if (mode === 'direction_x' || mode === 'direction_y' || mode === 'direction_z') {
                    mesh.rotation.order = 'YXZ';
                    vWorkA.copy(p.facing_direction);
                    if (vWorkA.lengthSq() < 1e-8) {
                        vWorkA.set(0, 0, 1);
                    } else {
                        vWorkA.normalize();
                    }
                    if (Math.abs(vWorkA.y - 1) < 1e-6) {
                        vWorkA.y = -1;
                    } else if (Math.abs(vWorkA.y + 1) < 1e-6) {
                        vWorkA.y = 1;
                        vWorkA.z = -1e-5;
                    }
                    const yaw = Math.atan2(vWorkA.x, vWorkA.z);
                    const pitch = Math.atan2(vWorkA.y, Math.sqrt(vWorkA.x * vWorkA.x + vWorkA.z * vWorkA.z));
                    if (mode === 'direction_x') {
                        mesh.rotation.set(0, yaw - Math.PI / 2, pitch);
                    } else if (mode === 'direction_y') {
                        mesh.rotation.set(pitch - Math.PI / 2, yaw - Math.PI, 0);
                    } else {
                        mesh.rotation.set(-pitch, yaw, 0);
                    }
                } else if (mode === 'lookat_direction') {
                    vWorkA.copy(p.facing_direction);
                    if (vWorkA.lengthSq() < 1e-8) vWorkA.set(1, 0, 0);
                    else vWorkA.normalize();
                    oTmp.position.copy(mesh.position);
                    oTmp.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), vWorkA);
                    parent.add(oTmp);
                    oTmp.updateMatrixWorld();
                    vWorkB.copy(vCamPos);
                    oTmp.worldToLocal(vWorkB);
                    parent.remove(oTmp);
                    mesh.rotation.set(Math.atan2(-vWorkB.y, vWorkB.z), 0, 0, 'XYZ');
                    mesh.quaternion.premultiply(oTmp.quaternion);
                } else if (mode === 'emitter_transform_xy') {
                    mesh.rotation.set(0, 0, 0);
                    if (p.__pc_spawn_world_quat) {
                        mesh.quaternion.premultiply(p.__pc_spawn_world_quat).premultiply(qParentInv);
                    }
                } else if (mode === 'emitter_transform_xz') {
                    mesh.rotation.set(-Math.PI / 2, 0, 0);
                    if (p.__pc_spawn_world_quat) {
                        mesh.quaternion.premultiply(p.__pc_spawn_world_quat).premultiply(qParentInv);
                    }
                } else if (mode === 'emitter_transform_yz') {
                    mesh.rotation.set(0, Math.PI / 2, 0);
                    if (p.__pc_spawn_world_quat) {
                        mesh.quaternion.premultiply(p.__pc_spawn_world_quat).premultiply(qParentInv);
                    }
                } else {
                    mesh.quaternion.copy(qCamQuat).premultiply(qParentInv);
                }

                // Apply local Z billboard spin consistently for ALL modes
                if (p.rotation) {
                    mesh.rotateZ(p.rotation);
                }
            }
        };

        const resetEmitterForReplay = (em) => {
            em.stop(true);
            if (Array.isArray(em.dead_particles) && em.dead_particles.length) {
                for (const dp of em.dead_particles.slice()) {
                    try {
                        if (typeof dp.delete === 'function') {
                            dp.delete();
                        } else {
                            if (dp.mesh?.parent) dp.mesh.parent.remove(dp.mesh);
                            if (dp.mesh?.geometry && dp.mesh.geometry !== em.geometry) {
                                dp.mesh.geometry.dispose();
                            }
                        }
                    } catch (_err) {}
                }
                em.dead_particles.length = 0;
            }
            if (Array.isArray(em.child_emitters) && em.child_emitters.length) {
                for (const child of em.child_emitters.slice()) {
                    try { child.delete(); } catch (_err) {}
                }
                em.child_emitters.length = 0;
            }
            em._cached_curves = {};
            em.age = 0;
            em.view_age = 0;
            em.enabled = false;
            em.initialized = false;
            if (typeof em.tick_count === 'number') em.tick_count = 0;
            if (typeof em.loop_count === 'number') em.loop_count = 0;
            if (typeof em.spawn_remainder === 'number') em.spawn_remainder = 0;
            if (typeof em.spawn_count === 'number') em.spawn_count = 0;
            em.__pc_rendered_zero = false;
        };
        emitter.__pc_reset_for_replay = () => resetEmitterForReplay(emitter);

        // 7. Patch jumpTo to fix t=0 uninitialized skip, active_time*tick_rate<=1 modulo-by-0, loop wrap, and backwards/post-stop scrubbing
        emitter.jumpTo = function (targetTime) {
            const tickRate = Math.max(1, Number(this.scene.global_options.tick_rate) || 30);
            const isLooping = this.loop_mode === 'looping' || (this.loop_mode === 'auto' && this.config.emitter_lifetime_mode === 'looping');
            let targetTicks = Math.max(0, Math.round(targetTime * tickRate));

            // Always cleanly restart if uninitialized, previously stopped (e.g. scrubbed before keyframe time), or reset
            if (!this.initialized || !this.enabled || !this.__pc_rendered_zero) {
                resetEmitterForReplay(this);
                this.start();
            }

            if (isLooping) {
                const cycleSeconds = Math.max(0, (Number(this.active_time) || 0) + (Number(this.sleep_time) || 0));
                const cycleTicks = Math.round(cycleSeconds * tickRate);
                if (cycleTicks > 0 && targetTicks >= cycleTicks) {
                    targetTicks = targetTicks % cycleTicks;
                }
            }

            const currentTicks = Math.round(this.view_age * tickRate);

            // Handle initial t=0 frame (newly started emitter at view_age=0)
            if (targetTicks === 0 && currentTicks === 0) {
                if (!this.__pc_rendered_zero) {
                    this.__pc_rendered_zero = true;
                    this.updateMaterial();
                    for (const p of this.particles) {
                        if (typeof p.__pc_apply_flipbook_and_color === 'function') {
                            p.__pc_apply_flipbook_and_color();
                        }
                    }
                }
                return this;
            }

            if (currentTicks === targetTicks && this.__pc_rendered_zero) {
                return this;
            }

            if (targetTicks < currentTicks) {
                resetEmitterForReplay(this);
                this.start();
            }

            this.__pc_rendered_zero = true;
            let guard = 0;
            const maxSteps = Math.max(targetTicks + 4, 600);
            while (Math.round(this.view_age * tickRate) < targetTicks - 1 && guard < maxSteps) {
                const prevViewAge = this.view_age;
                this.tick(true);
                guard++;
                if (!this.material || this.view_age <= prevViewAge) break;
            }
            if (Math.round(this.view_age * tickRate) < targetTicks && this.material) {
                this.tick(false);
            } else {
                this.updateMaterial();
                for (const p of this.particles) {
                    if (typeof p.__pc_apply_flipbook_and_color === 'function') {
                        p.__pc_apply_flipbook_and_color();
                    }
                }
            }

            if (this.material && Array.isArray(this.child_emitters)) {
                for (const child of this.child_emitters.slice()) {
                    if (child.creation_time > targetTime) {
                        child.delete();
                        const idx = this.child_emitters.indexOf(child);
                        if (idx >= 0) this.child_emitters.splice(idx, 1);
                    }
                }
            }
            return this;
        };

        // Ensure texture onload refreshes UVs on live particles of this emitter
        const prevReady = assetRecord.config.__pc_on_texture_ready;
        assetRecord.config.__pc_on_texture_ready = () => {
            if (typeof prevReady === 'function') prevReady();
            for (const em of assetRecord.emitters.values()) {
                for (const p of (em.particles || [])) {
                    if (typeof p.__pc_apply_flipbook_and_color === 'function') {
                        p.__pc_apply_flipbook_and_color();
                    }
                }
            }
        };

        emitter.__pc_last_diff = -1;
        emitter.__pc_anim_time = 0;
        emitter.__pc_rendered_zero = false;
        emitter.__pc_locator_world_quat = null;
        return emitter;
    }

    function patchParticleInstance(particle, emitter) {
        if (particle.__pc_patched) return;
        particle.__pc_patched = true;

        particle.__pc_apply_flipbook_and_color = function () {
            const cfg = this.emitter.config;
            const params = this.params();
            // 1. Sync texture dimensions if omitted in JSON
            const img = cfg.texture?.image;
            if (!cfg.__pc_explicit_uv_size && img && img.naturalWidth > 0 && img.naturalHeight > 0) {
                cfg.particle_texture_size = [img.naturalWidth, img.naturalHeight];
            }

            // 2. Exact flipbook frame calculation (no loop drift, clamped at max_frame - 1)
            if (cfg.particle_texture_mode === 'animated') {
                const rawMax = Number(this.emitter.calculate(cfg.particle_texture_max_frame, params)) || 0;
                const maxFrames = Math.max(0, Math.floor(rawMax));
                let frame = 0;
                if (cfg.particle_texture_stretch_to_lifetime && maxFrames > 0) {
                    const life = Math.max(1e-5, Number(this.lifetime) || 1);
                    const progress = Math.max(0, Math.min(0.999999, this.age / life));
                    frame = Math.floor(progress * maxFrames);
                    if (cfg.particle_texture_loop) frame = frame % maxFrames;
                    else frame = Math.min(frame, maxFrames - 1);
                } else {
                    const fps = Math.max(0, Number(this.emitter.calculate(cfg.particle_texture_frames_per_second, params)) || 0);
                    const rawFrame = Math.floor(Math.max(0, this.age) * fps);
                    if (maxFrames > 0) {
                        frame = cfg.particle_texture_loop
                            ? ((rawFrame % maxFrames) + maxFrames) % maxFrames
                            : Math.min(rawFrame, maxFrames - 1);
                    } else {
                        frame = rawFrame;
                    }
                }
                this.current_frame = frame;
                this.setFrame(frame);
            } else {
                this.setFrame(0);
            }

            // 3. Clamped gradient / expression tinting
            if (cfg.particle_color_mode === 'gradient' && Array.isArray(cfg.particle_color_gradient) && cfg.particle_color_gradient.length) {
                const interp = Number(this.emitter.calculate(cfg.particle_color_interpolant, params));
                const range = Number(this.emitter.calculate(cfg.particle_color_range, params)) || 1;
                const norm = Number.isFinite(interp) && range !== 0
                    ? Math.max(0, Math.min(1, interp / range))
                    : 0;
                const rgba = sampleGradient(cfg.particle_color_gradient, norm * 100);
                this.setColor(rgba.r, rgba.g, rgba.b, rgba.a);
            } else if (cfg.particle_color_mode === 'expression') {
                const arr = this.emitter.calculate(cfg.particle_color_expression, params, 'array') || [];
                const r = clamp01(arr[0], 1);
                const g = clamp01(arr[1], 1);
                const b = clamp01(arr[2], 1);
                const a = clamp01(arr[3], 1);
                this.setColor(r, g, b, a);
            }
        };

        const origTick = particle.tick.bind(particle);
        particle.tick = function (skipVisual) {
            const res = origTick(skipVisual);
            if (!skipVisual) {
                this.__pc_apply_flipbook_and_color();
            }
            return res;
        };
    }

    function clamp01(val, fallback) {
        const n = Number(val);
        if (!Number.isFinite(n)) return fallback;
        return Math.max(0, Math.min(1, n));
    }

    function parseHexRgba(colorStr) {
        const s = String(colorStr || '#ffffffff').trim();
        if (s.startsWith('#')) {
            const hex = s.slice(1);
            if (hex.length === 8) {
                // Wintersky stores normalized #RRGGBBAA after its internal w() conversion
                return {
                    r: parseInt(hex.slice(0, 2), 16) / 255,
                    g: parseInt(hex.slice(2, 4), 16) / 255,
                    b: parseInt(hex.slice(4, 6), 16) / 255,
                    a: parseInt(hex.slice(6, 8), 16) / 255
                };
            }
            if (hex.length === 6) {
                return {
                    r: parseInt(hex.slice(0, 2), 16) / 255,
                    g: parseInt(hex.slice(2, 4), 16) / 255,
                    b: parseInt(hex.slice(4, 6), 16) / 255,
                    a: 1
                };
            }
        }
        return {r: 1, g: 1, b: 1, a: 1};
    }

    function sampleGradient(stops, percent) {
        const sorted = stops.slice().sort((a, b) => (Number(a.percent) || 0) - (Number(b.percent) || 0));
        if (!sorted.length) return {r: 1, g: 1, b: 1, a: 1};
        if (percent <= sorted[0].percent) return parseHexRgba(sorted[0].color);
        const last = sorted[sorted.length - 1];
        if (percent >= last.percent) return parseHexRgba(last.color);
        for (let i = 0; i < sorted.length - 1; i++) {
            const a = sorted[i];
            const b = sorted[i + 1];
            if (percent >= a.percent && percent <= b.percent) {
                const span = b.percent - a.percent;
                const t = span > 1e-6 ? Math.max(0, Math.min(1, (percent - a.percent) / span)) : 0;
                const ca = parseHexRgba(a.color);
                const cb = parseHexRgba(b.color);
                return {
                    r: ca.r + (cb.r - ca.r) * t,
                    g: ca.g + (cb.g - ca.g) * t,
                    b: ca.b + (cb.b - ca.b) * t,
                    a: ca.a + (cb.a - ca.a) * t
                };
            }
        }
        return parseHexRgba(last.color);
    }

    function evaluateClampedCurve(emitter, curve, curveName, params) {
        if (!curve || !Array.isArray(curve.nodes) || !curve.nodes.length) return 0;
        const inputVal = Number(emitter.Molang.parse(curve.input, params));
        let rangeVal = curve.mode === 'bezier_chain' ? 1 : Number(emitter.Molang.parse(curve.range, params));
        if (!Number.isFinite(rangeVal) || rangeVal === 0) rangeVal = 1;
        let t = Number.isFinite(inputVal) ? (inputVal / rangeVal) : 0;
        if (!Number.isFinite(t)) t = 0;
        t = Math.max(0, Math.min(1, t));

        if (curve.mode === 'linear') {
            if (curve.nodes.length === 1) return Number(curve.nodes[0]) || 0;
            const scaled = t * (curve.nodes.length - 1);
            const idx = Math.min(curve.nodes.length - 2, Math.max(0, Math.floor(scaled)));
            const frac = scaled - idx;
            const a = Number(curve.nodes[idx]) || 0;
            const b = Number(curve.nodes[idx + 1]) || 0;
            return a + (b - a) * frac;
        }
        if (curve.mode === 'catmull_rom') {
            if (curve.nodes.length < 4) return Number(curve.nodes[0]) || 0;
            let spline = emitter._cached_curves[curveName];
            if (!spline) {
                const pts = curve.nodes.map((val, i) => new THREE.Vector2(i - 1, Number(val) || 0));
                spline = emitter._cached_curves[curveName] = new THREE.SplineCurve(pts);
            }
            const segs = curve.nodes.length - 3;
            const p = Math.max(0, Math.min(1, (1 + t * segs) / (segs + 2)));
            return spline.getPoint(p).y;
        }
        if (curve.mode === 'bezier') {
            if (curve.nodes.length < 4) return Number(curve.nodes[0]) || 0;
            let bez = emitter._cached_curves[curveName];
            if (!bez) {
                const pts = curve.nodes.slice(0, 4).map((val, i) => new THREE.Vector2(i / 3, Number(val) || 0));
                bez = emitter._cached_curves[curveName] = new THREE.CubicBezierCurve(...pts);
            }
            return bez.getPoint(t).y;
        }
        if (curve.mode === 'bezier_chain') {
            const nodes = curve.nodes.slice().sort((a, b) => (a.time || 0) - (b.time || 0));
            let i = 0;
            while (i < nodes.length && nodes[i].time <= t) i++;
            const left = nodes[i - 1] || {time: 0, right_value: 0, right_slope: 0};
            const right = nodes[i] || {time: 1, left_value: left.right_value || 0, left_slope: 0};
            const span = right.time - left.time;
            if (span <= 1e-6) return Number(left.right_value) || 0;
            const localT = Math.max(0, Math.min(1, (t - left.time) / span));
            const bez = new THREE.CubicBezierCurve(
                new THREE.Vector2(left.time, left.right_value || 0),
                new THREE.Vector2(left.time + span / 3, (left.right_value || 0) + (left.right_slope || 0) / 3),
                new THREE.Vector2(left.time + (2 * span) / 3, (right.left_value || 0) - (right.left_slope || 0) / 3),
                new THREE.Vector2(right.time, right.left_value || 0)
            );
            return bez.getPoint(localT).y;
        }
        return 0;
    }

    function registerOrUpdateAsset(project, assetKey, rawText, assetInfo = {}) {
        const scene = ensureScene();
        if (!scene) return null;
        const meta = SnowstormParser.inspect(rawText, assetInfo.filePath || assetKey);
        if (!meta) return null;

        const state = getProjectState(project, true);
        const hash = Platform.sha256(meta.rawText);
        const existing = state.assets.get(assetKey);

        if (existing) {
            const nextFilePath = assetInfo.filePath || existing.filePath || '';
            const nextTexPath = assetInfo.texturePath || existing.texturePath || '';
            const nextTexData = assetInfo.textureDataUrl || existing.textureDataUrl || '';
            if (existing.hash === hash
                && existing.filePath === nextFilePath
                && existing.texturePath === nextTexPath
                && existing.textureDataUrl === nextTexData) {
                return existing;
            }
            existing.meta = meta;
            existing.rawText = meta.rawText;
            existing.hash = hash;
            existing.filePath = nextFilePath;
            existing.texturePath = nextTexPath;
            existing.textureDataUrl = nextTexData;
            existing.config.reset();
            existing.config.set('file_path', existing.filePath || assetKey);
            existing.config.setFromJSON(meta.json, {path: existing.filePath || assetKey});
            normalizeConfigAfterLoad(existing.config, meta, existing);
            for (const em of existing.emitters.values()) {
                em.updateConfig();
                em.updateMaterial();
                em.stop(true);
                em.__pc_rendered_zero = false;
            }
            return existing;
        }

        const config = new Wintersky.Config(scene, meta.json, {path: assetInfo.filePath || assetKey});
        const record = {
            assetKey,
            filePath: assetInfo.filePath || '',
            texturePath: assetInfo.texturePath || '',
            textureDataUrl: assetInfo.textureDataUrl || '',
            meta,
            rawText: meta.rawText,
            hash,
            config,
            emitters: new Map()
        };
        normalizeConfigAfterLoad(config, meta, record);
        state.assets.set(assetKey, record);
        return record;
    }

    function updateAssetTexture(project, assetKey, texturePathOrDataUrl) {
        const state = getProjectState(project, false);
        if (!state) return false;
        const record = state.assets.get(assetKey);
        if (!record) return false;
        if (typeof texturePathOrDataUrl === 'string' && texturePathOrDataUrl.startsWith('data:')) {
            record.textureDataUrl = texturePathOrDataUrl;
            record.config.__pc_asset_texture_data_url = texturePathOrDataUrl;
            record.config.__pc_texture_override = texturePathOrDataUrl;
        } else if (typeof texturePathOrDataUrl === 'string' && texturePathOrDataUrl) {
            record.texturePath = texturePathOrDataUrl;
            record.config.__pc_asset_texture_path = texturePathOrDataUrl;
            record.config.__pc_texture_override = Platform.toFileUrl(texturePathOrDataUrl);
        }
        record.config.updateTexture();
        return true;
    }

    function computeAnimationTime(animation) {
        if (!animation) return typeof Timeline !== 'undefined' ? (Timeline.time || 0) : 0;
        const rawTime = typeof animation.time === 'number' && Number.isFinite(animation.time)
            ? animation.time
            : (typeof Timeline !== 'undefined' ? (Timeline.time || 0) : 0);
        const len = Number(animation.length) || 0;
        if (animation.loop === 'loop' && len > 0) {
            const wrapped = rawTime % len;
            return wrapped < 0 ? wrapped + len : wrapped;
        }
        if (animation.loop === 'hold' && len > 0 && rawTime > len) {
            return len;
        }
        return Math.max(0, rawTime);
    }

    function positionEmitterForPose(emitter, pose) {
        ensureScratch();
        const scene = ensureScene();
        if (!scene) return;

        const wantLocalPos = Boolean(emitter.config.space_local_position);
        const wantLocalRot = Boolean(emitter.config.space_local_rotation);

        if (!emitter.global_space.parent) {
            scene.space.add(emitter.global_space);
        }

        const anchorMesh = pose?.locator?.mesh || pose?.boneGroup?.mesh || null;
        if (anchorMesh) {
            anchorMesh.updateMatrixWorld(true);
            anchorMesh.getWorldPosition(vWorkA);
            anchorMesh.getWorldQuaternion(qWorkA);
            emitter.__pc_locator_world_quat = qWorkA.clone();

            if (wantLocalPos && wantLocalRot) {
                if (emitter.local_space.parent !== anchorMesh) {
                    if (emitter.local_space.parent) emitter.local_space.parent.remove(emitter.local_space);
                    anchorMesh.add(emitter.local_space);
                }
                emitter.local_space.position.set(0, 0, 0);
                emitter.local_space.rotation.set(0, 0, 0);
                emitter.local_space.quaternion.identity();
                emitter.parent_mode = 'locator';
            } else if (wantLocalPos && !wantLocalRot) {
                if (emitter.local_space.parent !== scene.space) {
                    if (emitter.local_space.parent) emitter.local_space.parent.remove(emitter.local_space);
                    scene.space.add(emitter.local_space);
                }
                emitter.local_space.position.copy(vWorkA);
                emitter.local_space.quaternion.identity();
                emitter.local_space.updateMatrixWorld(true);
                emitter.parent_mode = 'entity';
            } else {
                if (emitter.local_space.parent !== anchorMesh) {
                    if (emitter.local_space.parent) emitter.local_space.parent.remove(emitter.local_space);
                    anchorMesh.add(emitter.local_space);
                }
                emitter.local_space.position.set(0, 0, 0);
                emitter.local_space.quaternion.identity();
                emitter.local_space.updateMatrixWorld(true);
                emitter.parent_mode = 'locator';
            }
        } else {
            emitter.__pc_locator_world_quat = null;
            if (emitter.local_space.parent !== scene.space) {
                if (emitter.local_space.parent) emitter.local_space.parent.remove(emitter.local_space);
                scene.space.add(emitter.local_space);
            }
            emitter.local_space.position.set(0, 0, 0);
            emitter.local_space.quaternion.identity();
            emitter.local_space.updateMatrixWorld(true);
            emitter.parent_mode = 'entity';
        }
    }

    function displayEffectAnimator(effectAnimator, _inLoop) {
        if (!enhancedEnabled) return;
        const scene = ensureScene();
        if (!scene || !effectAnimator || !effectAnimator.animation) return;
        attachSceneToCanvas();

        const project = typeof Project !== 'undefined' ? Project : null;
        const state = getProjectState(project, true);
        const animation = effectAnimator.animation;
        const animTime = computeAnimationTime(animation);

        if (typeof Canvas !== 'undefined' && Canvas?.scene) {
            Canvas.scene.updateMatrixWorld(true);
        }

        const touchedSnowstormKeys = new Set();
        const touchedLumenKeys = new Set();
        const touchedKbrKeys = new Set();

        if (!effectAnimator.muted?.particle) {
            const keyframes = Array.isArray(effectAnimator.particle) ? effectAnimator.particle : [];
            for (const kf of keyframes) {
                const diff = animTime - (Number(kf.time) || 0);
                const points = Array.isArray(kf.data_points) ? kf.data_points : [];
                for (let dpIdx = 0; dpIdx < points.length; dpIdx++) {
                    const dp = points[dpIdx];
                    const assetKey = KeyframeStore.resolveAssetKeyForDataPoint(project, kf, dpIdx, dp);
                    if (!assetKey) continue;
                    const ksAsset = KeyframeStore.getAssetById(project, assetKey);
                    const bindingMeta = KeyframeStore.getBindingMeta(project, animation.uuid, kf.uuid, dpIdx);
                    const pose = typeof PalBridge !== 'undefined'
                        ? PalBridge.resolveWorldPose(dp, bindingMeta)
                        : {
                            locator: dp.locator && typeof Locator !== 'undefined'
                                ? Locator.all.find(l => l.name === dp.locator) || null
                                : null,
                            boneGroup: null,
                            position: new THREE.Vector3(),
                            quaternion: new THREE.Quaternion(),
                            role: 'primary',
                            viaPalBend: false
                        };

                    const emitterKey = `${animation.uuid}::${kf.uuid}::${dpIdx}`;

                    // Route strictly by owning format so every keyframe instance plays ONCE
                    if (ksAsset && (ksAsset.format === 'lumenfx_json' || ksAsset.format === 'photon_fx') && typeof LumenFxPreview !== 'undefined') {
                        touchedLumenKeys.add(emitterKey);
                        const directives = typeof LumenFxSchema !== 'undefined'
                            ? LumenFxSchema.parsePreEffectScript(dp.script || '')
                            : {};
                        const lumenPose = {
                            ...pose,
                            resolveLocatorWorldPos(targetName) {
                                if (!targetName) return null;
                                if (typeof PalBridge !== 'undefined') {
                                    const targetPose = PalBridge.resolveWorldPose(
                                        {locator: targetName},
                                        {participantRole: pose.role || 'primary'}
                                    );
                                    return targetPose?.position || null;
                                }
                                return null;
                            }
                        };
                        LumenFxPreview.renderInstanceAtTime(project, emitterKey, assetKey, diff, lumenPose, directives);
                        continue;
                    }
                    if (ksAsset && ksAsset.format === 'kbr_3d_particle' && typeof Kbr3dPreview !== 'undefined') {
                        touchedKbrKeys.add(emitterKey);
                        Kbr3dPreview.renderInstanceAtTime(project, emitterKey, assetKey, diff, pose, dp.script || '');
                        continue;
                    }

                    // Default: Snowstorm / Bedrock Wintersky enhanced renderer
                    const assetRecord = state.assets.get(assetKey);
                    if (!assetRecord) continue;

                    touchedSnowstormKeys.add(emitterKey);
                    let emitter = assetRecord.emitters.get(emitterKey);
                    if (diff >= 0) {
                        if (!emitter) {
                            emitter = new Wintersky.Emitter(scene, assetRecord.config);
                            patchEmitterInstance(emitter, animation.uuid, kf.uuid, dpIdx, assetRecord);
                            assetRecord.emitters.set(emitterKey, emitter);
                        }
                        emitter.__pc_anim_time = animTime;
                        emitter.__pc_participant_role = pose.role || 'primary';
                        emitter.__pc_via_pal_bend = Boolean(pose.viaPalBend);
                        positionEmitterForPose(emitter, pose);
                        emitter.jumpTo(diff);
                        emitter.__pc_last_diff = diff;
                    } else if (emitter) {
                        if (emitter.enabled || emitter.particles.length > 0 || emitter.__pc_rendered_zero || emitter.initialized || emitter.view_age > 0 || emitter.age > 0) {
                            if (typeof emitter.__pc_reset_for_replay === 'function') {
                                emitter.__pc_reset_for_replay();
                            } else {
                                emitter.stop(true);
                                emitter.age = 0;
                                emitter.view_age = 0;
                                emitter.initialized = false;
                                emitter.__pc_rendered_zero = false;
                            }
                        }
                        emitter.__pc_last_diff = diff;
                    }
                }
            }
        }

        // Reconcile emitters belonging to this animation across all renderers
        const animPrefix = `${animation.uuid}::`;
        for (const record of state.assets.values()) {
            for (const [emKey, em] of record.emitters.entries()) {
                if (emKey.startsWith(animPrefix) && !touchedSnowstormKeys.has(emKey)) {
                    disposeEmitter(em);
                    record.emitters.delete(emKey);
                }
            }
        }
        if (typeof LumenFxPreview !== 'undefined') {
            LumenFxPreview.reconcileAnimationInstances(project, animation.uuid, touchedLumenKeys);
        }
        if (typeof Kbr3dPreview !== 'undefined') {
            Kbr3dPreview.reconcileAnimationInstances(project, animation.uuid, touchedKbrKeys);
        }

        if (typeof Preview !== 'undefined' && Preview.selected?.camera) {
            updateFacingRotation(Preview.selected.camera);
        }
    }

    function reconcileActiveAnimations() {
        const project = typeof Project !== 'undefined' ? Project : null;
        const state = getProjectState(project, false);
        const playingAnims = new Set(
            (typeof Animation !== 'undefined' && Array.isArray(Animation.all))
                ? Animation.all.filter(a => a.playing).map(a => a.uuid)
                : []
        );
        if (state) {
            for (const record of state.assets.values()) {
                for (const [emKey, em] of record.emitters.entries()) {
                    const animUuid = emKey.split('::')[0];
                    if (!playingAnims.has(animUuid)) {
                        if (em.enabled || em.particles.length > 0 || em.initialized || em.view_age > 0) {
                            if (typeof em.__pc_reset_for_replay === 'function') {
                                em.__pc_reset_for_replay();
                            } else {
                                em.stop(true);
                                em.age = 0;
                                em.view_age = 0;
                                em.initialized = false;
                                em.__pc_rendered_zero = false;
                            }
                        }
                        if (em.local_space.parent) em.local_space.parent.remove(em.local_space);
                        if (em.global_space.parent) em.global_space.parent.remove(em.global_space);
                    }
                }
            }
        }
        if (!playingAnims.size) {
            if (typeof LumenFxPreview !== 'undefined') LumenFxPreview.detachProjectVisuals(project);
            if (typeof Kbr3dPreview !== 'undefined') Kbr3dPreview.detachProjectVisuals(project);
        }
    }

    function detachProjectVisuals(project) {
        const state = getProjectState(project, false);
        if (state) {
            for (const record of state.assets.values()) {
                for (const em of record.emitters.values()) {
                    if (em.tick_interval !== undefined) {
                        clearInterval(em.tick_interval);
                        delete em.tick_interval;
                    }
                    if (em.local_space?.parent) em.local_space.parent.remove(em.local_space);
                    if (em.global_space?.parent) em.global_space.parent.remove(em.global_space);
                }
            }
        }
        if (typeof LumenFxPreview !== 'undefined') LumenFxPreview.detachProjectVisuals(project);
        if (typeof Kbr3dPreview !== 'undefined') Kbr3dPreview.detachProjectVisuals(project);
    }

    function disposeEmitter(em) {
        if (!em) return;
        try {
            if (em.tick_interval !== undefined) {
                clearInterval(em.tick_interval);
                delete em.tick_interval;
            }
            em.stop(true);
            em.delete();
        } catch (_err) {}
    }

    function disposeProjectState(project) {
        const id = getProjectId(project);
        const state = projectStates.get(id);
        if (state) {
            for (const record of state.assets.values()) {
                for (const em of record.emitters.values()) {
                    disposeEmitter(em);
                }
                record.emitters.clear();
                try {
                    if (record.config?.texture) record.config.texture.dispose();
                } catch (_err) {}
            }
            state.assets.clear();
            projectStates.delete(id);
        }
        if (typeof LumenFxPreview !== 'undefined') LumenFxPreview.disposeProjectState(project);
        if (typeof Kbr3dPreview !== 'undefined') Kbr3dPreview.disposeProjectState(project);
    }

    function disposeAll() {
        for (const id of Array.from(projectStates.keys())) {
            disposeProjectState({uuid: id});
        }
        if (pcScene) {
            if (pcScene.space?.parent) pcScene.space.parent.remove(pcScene.space);
            for (const em of (pcScene.emitters || []).slice()) {
                disposeEmitter(em);
            }
            pcScene.emitters = [];
            pcScene = null;
        }
        if (typeof Canvas !== 'undefined' && Array.isArray(Canvas?.scene?.children)) {
            for (const child of Canvas.scene.children.slice()) {
                if (child && child.name === 'particlecue_snowstorm_space') {
                    Canvas.scene.remove(child);
                }
            }
        }
        if (typeof LumenFxPreview !== 'undefined') LumenFxPreview.disposeAll();
        if (typeof Kbr3dPreview !== 'undefined') Kbr3dPreview.disposeAll();
    }

    function updateFacingRotation(camera) {
        if (!enhancedEnabled || !pcScene || !camera) return;
        const state = getProjectState(null, false);
        if (!state) return;
        for (const record of state.assets.values()) {
            for (const em of record.emitters.values()) {
                if (em.particles && em.particles.length > 0) {
                    em.updateFacingRotation(camera);
                }
            }
        }
    }

    function setEnhancedEnabled(enabled) {
        const next = Boolean(enabled);
        if (enhancedEnabled === next) return;
        enhancedEnabled = next;
        if (!next) {
            detachProjectVisuals(typeof Project !== 'undefined' ? Project : null);
            if (pcScene?.space?.parent) pcScene.space.parent.remove(pcScene.space);
        } else {
            // Stop any native emitters before taking over
            if (typeof Animator !== 'undefined' && typeof Animator.resetParticles === 'function') {
                Animator.resetParticles(true);
            }
            attachSceneToCanvas();
        }
        if (typeof Animator !== 'undefined' && Animator.open && typeof Animator.preview === 'function') {
            Animator.preview();
        }
        if (typeof ParticleCuePanel !== 'undefined' && typeof ParticleCuePanel.refresh === 'function') {
            ParticleCuePanel.refresh();
        }
    }

    function isEnhancedEnabled() {
        return enhancedEnabled;
    }

    function getDiagnostics(project) {
        const state = getProjectState(project, false);
        let assetCount = 0;
        let emitterCount = 0;
        let liveParticleCount = 0;
        const details = [];
        if (state) {
            assetCount = state.assets.size;
            for (const [key, rec] of state.assets.entries()) {
                emitterCount += rec.emitters.size;
                let particles = 0;
                const emitterInfo = [];
                for (const [emKey, em] of rec.emitters.entries()) {
                    const count = em.particles ? em.particles.length : 0;
                    particles += count;
                    emitterInfo.push({
                        key: emKey,
                        enabled: Boolean(em.enabled),
                        initialized: Boolean(em.initialized),
                        age: Number(em.age || 0),
                        viewAge: Number(em.view_age || 0),
                        particles: count,
                        material: em.config.particle_appearance_material,
                        depthWrite: Boolean(em.material?.depthWrite),
                        transparent: Boolean(em.material?.transparent),
                        blending: em.material?.blending,
                        facingMode: em.config.particle_appearance_facing_camera_mode,
                        localPosition: Boolean(em.config.space_local_position),
                        localRotation: Boolean(em.config.space_local_rotation),
                        parentMode: em.parent_mode,
                        textureCategory: em.config.texture_source_category,
                        textureSize: Array.isArray(em.config.particle_texture_size) ? em.config.particle_texture_size.slice() : null,
                        currentFrames: (em.particles || []).slice(0, 4).map(p => p.current_frame)
                    });
                }
                liveParticleCount += particles;
                details.push({
                    assetKey: key,
                    identifier: rec.meta?.identifier || '',
                    textureRef: rec.meta?.textureRef || '',
                    textureCategory: rec.config?.texture_source_category || 'placeholder',
                    texturePath: rec.texturePath || '',
                    hasEmbeddedTexture: Boolean(rec.textureDataUrl),
                    emitters: emitterInfo
                });
            }
        }
        return {
            enhancedEnabled,
            assetCount,
            emitterCount,
            liveParticleCount,
            totalTrackedProjects: projectStates.size,
            sceneEmitterCount: pcScene ? pcScene.emitters.length : 0,
            details
        };
    }

    function installHooks() {
        if (installed) return;
        installed = true;

        // Hook EffectAnimator.prototype.displayFrame to own particle channel when enhanced mode is active
        if (typeof EffectAnimator !== 'undefined' && EffectAnimator.prototype?.displayFrame) {
            originals.displayFrame = EffectAnimator.prototype.displayFrame;
            EffectAnimator.prototype.displayFrame = function (in_loop) {
                if (!enhancedEnabled) {
                    return originals.displayFrame.call(this, in_loop);
                }
                const prevMuted = this.muted ? this.muted.particle : false;
                if (this.muted) this.muted.particle = true;
                try {
                    originals.displayFrame.call(this, in_loop);
                } finally {
                    if (this.muted) this.muted.particle = prevMuted;
                }
                displayEffectAnimator(this, in_loop);
            };
        }

        // Hook Animator.preview to reconcile stopped/inactive animations cleanly
        if (typeof Animator !== 'undefined' && typeof Animator.preview === 'function') {
            originals.animatorPreview = Animator.preview;
            Animator.preview = function (in_loop) {
                const res = originals.animatorPreview.call(this, in_loop);
                if (enhancedEnabled) {
                    reconcileActiveAnimations();
                }
                return res;
            };
        }

        // Hook Animator.resetParticles so leaving Animate mode also detaches ParticleCue visuals
        if (typeof Animator !== 'undefined' && typeof Animator.resetParticles === 'function') {
            originals.resetParticles = Animator.resetParticles;
            Animator.resetParticles = function (optimized) {
                const res = originals.resetParticles.call(this, optimized);
                detachProjectVisuals(typeof Project !== 'undefined' ? Project : null);
                if (pcScene?.space?.parent && (!Animator.open || !enhancedEnabled)) {
                    pcScene.space.parent.remove(pcScene.space);
                }
                return res;
            };
        }

        // Hook WinterskyScene.updateFacingRotation so every camera move rotates ParticleCue billboards too
        if (typeof WinterskyScene !== 'undefined' && typeof WinterskyScene.updateFacingRotation === 'function') {
            originals.updateFacingRotation = WinterskyScene.updateFacingRotation;
            WinterskyScene.updateFacingRotation = function (camera) {
                const res = originals.updateFacingRotation.call(this, camera);
                updateFacingRotation(camera);
                return res;
            };
        }

        // Hook project switch and close events to prevent cross-project leaks
        const onUnselect = ({project}) => {
            detachProjectVisuals(project);
        };
        const onSelect = () => {
            attachSceneToCanvas();
            if (typeof Animator !== 'undefined' && Animator.open && typeof Animator.preview === 'function') {
                Animator.preview();
            }
        };
        const onClose = ({project}) => {
            disposeProjectState(project);
        };

        Blockbench.on('unselect_project', onUnselect);
        Blockbench.on('select_project', onSelect);
        Blockbench.on('close_project', onClose);
        eventCleanups.push(
            () => Blockbench.removeListener('unselect_project', onUnselect),
            () => Blockbench.removeListener('select_project', onSelect),
            () => Blockbench.removeListener('close_project', onClose)
        );
    }

    function uninstallHooks() {
        if (!installed) return;
        installed = false;

        if (originals.displayFrame && typeof EffectAnimator !== 'undefined') {
            EffectAnimator.prototype.displayFrame = originals.displayFrame;
        }
        if (originals.animatorPreview && typeof Animator !== 'undefined') {
            Animator.preview = originals.animatorPreview;
        }
        if (originals.resetParticles && typeof Animator !== 'undefined') {
            Animator.resetParticles = originals.resetParticles;
        }
        if (originals.updateFacingRotation && typeof WinterskyScene !== 'undefined') {
            WinterskyScene.updateFacingRotation = originals.updateFacingRotation;
        }
        while (eventCleanups.length) {
            try { eventCleanups.pop()(); } catch (_err) {}
        }
        disposeAll();
    }

    return {
        installHooks,
        uninstallHooks,
        registerOrUpdateAsset,
        updateAssetTexture,
        displayEffectAnimator,
        detachProjectVisuals,
        disposeProjectState,
        disposeAll,
        setEnhancedEnabled,
        isEnhancedEnabled,
        getDiagnostics,
        getProjectState
    };
})();


/* === src/lumenfx/lumenfx_schema.js === */
const LumenFxSchema = (() => {
    const LFMH_MAGIC = 0x484d464c; // "LFMH" little-endian

    function safeParseJson(rawText) {
        if (typeof rawText === 'object' && rawText !== null) return rawText;
        if (typeof rawText !== 'string' || !rawText.trim()) return null;
        try {
            return JSON.parse(rawText);
        } catch (_err) {
            try {
                const stripped = rawText
                    .replace(/\/\*[\s\S]*?\*\//g, '')
                    .replace(/^\s*\/\/.*$/gm, '');
                return JSON.parse(stripped);
            } catch (_err2) {
                return null;
            }
        }
    }

    function canParse(rawText, filePath) {
        const json = safeParseJson(rawText);
        if (!json || typeof json !== 'object') return false;
        if (json.particle_effect) return false; // Snowstorm or KBR
        const hasFormatV1 = Number(json.format_version) === 1 || json.format_version === '1';
        const hasLumenFields = Boolean(
            Array.isArray(json.emitters)
            || (json.materials && typeof json.materials === 'object')
            || (json.niagara && typeof json.niagara === 'object')
            || Array.isArray(json.lights)
            || Array.isArray(json.volumes)
            || Array.isArray(json.decals)
        );
        if (hasFormatV1 && hasLumenFields) return true;
        if (typeof filePath === 'string' && /lumenfx[\\/].*\.json$/i.test(filePath) && hasLumenFields) return true;
        return false;
    }

    function detectOriginKind(json) {
        if (!json || typeof json !== 'object') return 'lumenfx_native';
        if (json.niagara && typeof json.niagara === 'object') return 'ue_niagara';
        const emitters = Array.isArray(json.emitters) ? json.emitters : [];
        for (const em of emitters) {
            if (!em || typeof em !== 'object') continue;
            if (em.sim_cache || em.gpu_program || em.spawn_program || em.update_program || em.integrator === 'niagara') {
                return 'ue_niagara';
            }
            if (em.shape?.unity || em.unity) {
                return 'unity_shuriken';
            }
        }
        return 'lumenfx_native';
    }

    function parseNamespacedResourcePath(resId, defaultSubdir, defaultExt) {
        const clean = String(resId || '').trim();
        if (!clean) return null;
        const colon = clean.indexOf(':');
        const ns = colon > 0 ? clean.slice(0, colon) : 'minecraft';
        let p = colon > 0 ? clean.slice(colon + 1) : clean;
        p = Platform.toPosixPath(p).replace(/^\/+/, '');
        if (defaultSubdir && !p.startsWith(`${defaultSubdir}/`) && !p.startsWith('textures/') && !p.startsWith('shaders/') && !p.startsWith('lumenfx/')) {
            p = `${defaultSubdir}/${p}`;
        }
        if (defaultExt && !p.toLowerCase().endsWith(defaultExt.toLowerCase())) {
            p += defaultExt;
        }
        return {namespace: ns, relativeInNamespace: p, packPath: `assets/${ns}/${p}`};
    }

    function resolveResourceOnDisk(resId, sourceFilePath, defaultSubdir, defaultExt, extraRoots = []) {
        const parsed = parseNamespacedResourcePath(resId, defaultSubdir, defaultExt);
        if (!parsed) return null;

        const roots = [];
        const addRoot = (r) => {
            if (!r || Platform.isVirtualPath(r)) return;
            const norm = Platform.normalizeFsPath(r);
            if (!roots.includes(norm)) roots.push(norm);
        };

        if (sourceFilePath && !Platform.isVirtualPath(sourceFilePath)) {
            const posix = Platform.toPosixPath(sourceFilePath);
            const segs = posix.split('/');
            const assetsIdx = segs.lastIndexOf('assets');
            if (assetsIdx > 0) {
                addRoot(segs.slice(0, assetsIdx).join('/'));
            }
            let cur = Platform.dirname(sourceFilePath);
            for (let i = 0; i < 6; i++) {
                addRoot(cur);
                const parent = Platform.dirname(cur);
                if (!parent || parent === cur) break;
                cur = parent;
            }
        }
        for (const r of extraRoots) addRoot(r);

        for (const root of roots) {
            const fullPack = Platform.joinPath(root, parsed.packPath);
            if (Platform.fileExists(fullPack)) return fullPack;
            const directRel = Platform.joinPath(root, parsed.relativeInNamespace);
            if (Platform.fileExists(directRel)) return directRel;
            const baseOnly = Platform.joinPath(root, Platform.basename(parsed.relativeInNamespace));
            if (Platform.fileExists(baseOnly)) return baseOnly;
        }
        return null;
    }

    function extractDependencies(json, filePath, extraRoots = []) {
        const deps = {
            textures: [],
            shaders: [],
            meshes: [],
            simCaches: [],
            vectorFields: [],
            missing: []
        };
        if (!json || typeof json !== 'object') return deps;

        const seenTex = new Set();
        const seenShader = new Set();
        const seenMesh = new Set();

        const addTex = (ref) => {
            if (!ref || typeof ref !== 'string' || seenTex.has(ref)) return;
            seenTex.add(ref);
            const resolved = resolveResourceOnDisk(ref, filePath, 'textures', '.png', extraRoots);
            deps.textures.push({ref, resolvedPath: resolved || ''});
            if (!resolved && !ref.startsWith('lumenfx:core/') && !ref.startsWith('minecraft:')) {
                deps.missing.push({type: 'texture', ref});
            }
        };

        const addShader = (ref, hasInlineGlsl = false) => {
            if (!ref || typeof ref !== 'string' || seenShader.has(ref)) return;
            seenShader.add(ref);
            if (ref === 'lumenfx:core/effect' || ref === 'lumenfx:core/color') return;
            const resolved = resolveResourceOnDisk(ref, filePath, 'shaders', '.fsh', extraRoots);
            deps.shaders.push({ref, resolvedPath: resolved || ''});
            if (!resolved && !hasInlineGlsl) {
                deps.missing.push({type: 'shader', ref});
            }
        };

        const addMesh = (ref) => {
            if (!ref || typeof ref !== 'string' || seenMesh.has(ref)) return;
            seenMesh.add(ref);
            const resolvedLf = resolveResourceOnDisk(ref, filePath, 'lumenfx/meshes', '.lfmesh', extraRoots);
            const resolvedManifest = resolveResourceOnDisk(ref, filePath, 'lumenfx/meshes', '.json', extraRoots);
            deps.meshes.push({ref, lfmeshPath: resolvedLf || '', manifestPath: resolvedManifest || ''});
            if (!resolvedLf && !resolvedManifest) {
                deps.missing.push({type: 'mesh', ref});
            }
        };

        if (json.materials && typeof json.materials === 'object') {
            for (const mat of Object.values(json.materials)) {
                if (!mat || typeof mat !== 'object') continue;
                const hasInlineGlsl = typeof mat.custom_glsl_fragment === 'string' && mat.custom_glsl_fragment.trim().length > 0;
                if (typeof mat.fragment_shader === 'string') addShader(mat.fragment_shader, hasInlineGlsl);
                if (typeof mat.vertex_material === 'string') addShader(mat.vertex_material, false);
                if (mat.textures && typeof mat.textures === 'object') {
                    for (const texRef of Object.values(mat.textures)) {
                        addTex(texRef);
                    }
                }
            }
        }
        if (Array.isArray(json.decals)) {
            for (const dec of json.decals) {
                if (dec && typeof dec.texture === 'string') addTex(dec.texture);
            }
        }
        if (Array.isArray(json.emitters)) {
            for (const em of json.emitters) {
                if (!em || typeof em !== 'object') continue;
                if (Array.isArray(em.mesh?.entries)) {
                    for (const ent of em.mesh.entries) {
                        if (ent && typeof ent.asset === 'string') addMesh(ent.asset);
                    }
                }
                if (typeof em.sim_cache === 'string') {
                    deps.simCaches.push({ref: em.sim_cache, resolvedPath: resolveResourceOnDisk(em.sim_cache, filePath, 'lumenfx/sim_caches', '.lfsc', extraRoots) || ''});
                }
                if (typeof em.vector_field === 'string') {
                    deps.vectorFields.push({ref: em.vector_field, resolvedPath: resolveResourceOnDisk(em.vector_field, filePath, 'lumenfx/vector_fields', '.lfvf', extraRoots) || ''});
                }
            }
        }
        if (json.niagara && Array.isArray(json.niagara.emitters)) {
            for (const ne of json.niagara.emitters) {
                if (typeof ne?.sim_cache === 'string') {
                    deps.simCaches.push({ref: ne.sim_cache, resolvedPath: resolveResourceOnDisk(ne.sim_cache, filePath, 'lumenfx/sim_caches', '.lfsc', extraRoots) || ''});
                }
                if (Array.isArray(ne?.renderers)) {
                    for (const r of ne.renderers) {
                        if (typeof r?.mesh_asset === 'string') addMesh(r.mesh_asset);
                    }
                }
            }
        }
        return deps;
    }

    function inspect(rawText, filePath, extraRoots = []) {
        const json = safeParseJson(rawText);
        if (!json || !canParse(json, filePath)) return null;
        const originKind = detectOriginKind(json);
        const deps = extractDependencies(json, filePath, extraRoots);
        const emitters = Array.isArray(json.emitters) ? json.emitters : [];
        const renderers = Array.from(new Set(emitters.map(e => String(e?.renderer || 'sprite').toLowerCase())));
        const stem = Platform.basename(filePath || 'lumenfx_effect.json').replace(/\.json$/i, '');

        return {
            format: 'lumenfx_json',
            formatVersion: json.format_version ?? 1,
            originKind,
            identifier: json.id || stem,
            renderers,
            emitterCount: emitters.length,
            materialCount: json.materials ? Object.keys(json.materials).length : 0,
            lightCount: Array.isArray(json.lights) ? json.lights.length : 0,
            volumeCount: Array.isArray(json.volumes) ? json.volumes.length : 0,
            decalCount: Array.isArray(json.decals) ? json.decals.length : 0,
            hasNiagara: Boolean(json.niagara),
            dependencies: deps,
            textureRef: deps.textures[0]?.ref || '',
            isBuiltinTexture: deps.textures.length === 0,
            json,
            rawText: typeof rawText === 'string' ? rawText : JSON.stringify(json, null, 2),
            filePath: filePath || ''
        };
    }

    // ---- Scalar / Color Curve Evaluators (100% aligned with LumenFX Effect-Format-Reference) ----

    function hashUnit(seed) {
        let x = (seed | 0) ^ 0x9e3779b9;
        x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
        x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
        return ((x ^ (x >>> 16)) >>> 0) / 4294967295;
    }

    function evalScalarCurve(spec, t, seed = 1, fallback = 0) {
        if (spec === undefined || spec === null) return fallback;
        if (typeof spec === 'number') return Number.isFinite(spec) ? spec : fallback;
        if (typeof spec === 'string') {
            const n = Number(spec);
            return Number.isFinite(n) ? n : fallback;
        }
        if (typeof spec !== 'object') return fallback;

        if (typeof spec.value === 'number' && !spec.keys && !spec.multiply && !spec.add) {
            return spec.value;
        }
        if (typeof spec.min === 'number' || typeof spec.max === 'number') {
            const mn = Number.isFinite(spec.min) ? spec.min : fallback;
            const mx = Number.isFinite(spec.max) ? spec.max : mn;
            return mn + (mx - mn) * hashUnit(seed);
        }
        if (Array.isArray(spec.multiply)) {
            let acc = 1;
            const items = spec.multiply.slice(0, 5);
            for (let i = 0; i < items.length; i++) {
                acc *= evalScalarCurve(items[i], t, seed + i * 17, 1);
            }
            return acc;
        }
        if (Array.isArray(spec.add)) {
            let acc = 0;
            for (let i = 0; i < spec.add.length; i++) {
                acc += evalScalarCurve(spec.add[i], t, seed + i * 31, 0);
            }
            return acc;
        }
        if (Array.isArray(spec.keys) && spec.keys.length) {
            const keys = spec.keys.slice().sort((a, b) => (Number(a.time) || 0) - (Number(b.time) || 0));
            const ct = Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0));
            if (ct <= (Number(keys[0].time) || 0)) return Number(keys[0].value) || 0;
            const last = keys[keys.length - 1];
            if (ct >= (Number(last.time) || 0)) return Number(last.value) || 0;
            for (let i = 0; i < keys.length - 1; i++) {
                const k0 = keys[i];
                const k1 = keys[i + 1];
                const t0 = Number(k0.time) || 0;
                const t1 = Number(k1.time) || 0;
                if (ct >= t0 && ct <= t1) {
                    const v0 = Number(k0.value) || 0;
                    const v1 = Number(k1.value) || 0;
                    const mode = String(k0.interpolation || 'linear').toLowerCase();
                    if (mode === 'constant') return v0;
                    const dt = t1 - t0;
                    if (dt <= 1e-6) return v0;
                    const u = (ct - t0) / dt;
                    if (mode === 'cubic') {
                        const m0 = (Number(k0.leave) || 0) * dt;
                        const m1 = (Number(k1.arrive) || 0) * dt;
                        const u2 = u * u;
                        const u3 = u2 * u;
                        return (2 * u3 - 3 * u2 + 1) * v0
                            + (u3 - 2 * u2 + u) * m0
                            + (-2 * u3 + 3 * u2) * v1
                            + (u3 - u2) * m1;
                    }
                    return v0 + (v1 - v0) * u;
                }
            }
            return Number(last.value) || 0;
        }
        return fallback;
    }

    function evalVec3Curve(spec, t, seed = 1, fallback = [0, 0, 0]) {
        if (!Array.isArray(spec)) return fallback.slice();
        return [
            evalScalarCurve(spec[0], t, seed + 1, fallback[0]),
            evalScalarCurve(spec[1], t, seed + 2, fallback[1]),
            evalScalarCurve(spec[2], t, seed + 3, fallback[2])
        ];
    }

    function evalColorStopsList(rawStops, t) {
        const parsed = [];
        for (const s of rawStops) {
            if (Array.isArray(s) && s.length >= 4) {
                // LumenFX 0.3.2 compact array stop: [time, r, g, b, a?]
                parsed.push({
                    time: Number(s[0]) || 0,
                    color: [
                        Number(s[1]) || 0,
                        Number(s[2]) || 0,
                        Number(s[3]) || 0,
                        s.length >= 5 ? (Number(s[4]) || 0) : 1
                    ]
                });
            } else if (s && typeof s === 'object') {
                const c = Array.isArray(s.color)
                    ? [Number(s.color[0]) || 0, Number(s.color[1]) || 0, Number(s.color[2]) || 0, s.color[3] !== undefined ? Number(s.color[3]) : 1]
                    : [Number(s.r) || 0, Number(s.g) || 0, Number(s.b) || 0, s.a !== undefined ? Number(s.a) : 1];
                parsed.push({time: Number(s.time) || 0, color: c});
            }
        }
        if (!parsed.length) return [1, 1, 1, 1];
        parsed.sort((a, b) => a.time - b.time);
        const ct = Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0));
        if (ct <= parsed[0].time) return parsed[0].color.slice();
        const last = parsed[parsed.length - 1];
        if (ct >= last.time) return last.color.slice();
        for (let i = 0; i < parsed.length - 1; i++) {
            const a = parsed[i];
            const b = parsed[i + 1];
            if (ct >= a.time && ct <= b.time) {
                const u = (b.time - a.time) > 1e-6 ? (ct - a.time) / (b.time - a.time) : 0;
                return [
                    a.color[0] + (b.color[0] - a.color[0]) * u,
                    a.color[1] + (b.color[1] - a.color[1]) * u,
                    a.color[2] + (b.color[2] - a.color[2]) * u,
                    a.color[3] + (b.color[3] - a.color[3]) * u
                ];
            }
        }
        return last.color.slice();
    }

    function evalColorCurve(spec, t, seed = 1) {
        if (!spec) return [1, 1, 1, 1];
        if (Array.isArray(spec)) {
            if (!spec.length) return [1, 1, 1, 1];
            // LumenFX 0.3.2 ColorCurve.java: top-level array of compact [t,r,g,b,a] or {time, color} stops
            const first = spec[0];
            if (Array.isArray(first) || (first && typeof first === 'object' && !first.keys && first.min === undefined && first.max === undefined && !first.multiply && !first.add && first.value === undefined)) {
                return evalColorStopsList(spec, t);
            }
            return [
                Math.max(0, evalScalarCurve(spec[0], t, seed + 11, 1)),
                Math.max(0, evalScalarCurve(spec[1], t, seed + 12, 1)),
                Math.max(0, evalScalarCurve(spec[2], t, seed + 13, 1)),
                Math.max(0, Math.min(1, evalScalarCurve(spec[3], t, seed + 14, 1)))
            ];
        }
        if (typeof spec === 'object' && Array.isArray(spec.stops) && spec.stops.length) {
            return evalColorStopsList(spec.stops, t);
        }
        return [1, 1, 1, 1];
    }

    // ---- LumenFX 0.3.3 KeyframeEffectParams & LumenFxKeyframeBridge.parseEffectId ----

    function parseBoolDirective(val, fallback) {
        const lower = String(val || '').trim().toLowerCase();
        if (lower === 'true' || lower === '1' || lower === 'yes' || lower === 'on') return true;
        if (lower === 'false' || lower === '0' || lower === 'no' || lower === 'off') return false;
        return fallback;
    }

    function parseEffectId(rawEffect) {
        if (typeof rawEffect !== 'string') return null;
        let trimmed = rawEffect.trim();
        if (!trimmed) return null;
        let explicitLumenFx = false;
        const lower = trimmed.toLowerCase();
        if (lower.startsWith('lumenfx:')) {
            explicitLumenFx = true;
            const rest = trimmed.slice('lumenfx:'.length);
            if (rest.indexOf(':') > 0) {
                trimmed = rest;
            }
        } else if (lower.startsWith('lumenfx/')) {
            const rest = trimmed.slice('lumenfx/'.length);
            if (rest.length) {
                explicitLumenFx = true;
                trimmed = rest;
            }
        }
        let canonicalId = trimmed.toLowerCase();
        if (!canonicalId.includes(':')) {
            canonicalId = `lumenfx:${canonicalId}`;
        }
        return {canonicalId, explicitLumenFx};
    }

    function parsePreEffectScript(scriptStr) {
        const out = {
            follow: null,
            rotate: null,
            scale: 1.0,
            color: null,
            offset: [0, 0, 0],
            beamEnd: '',
            stop: false,
            restart: false,
            seed: null
        };
        if (typeof scriptStr !== 'string' || !scriptStr.trim()) return out;
        const parts = scriptStr.split(/[;\r\n]+/);
        for (const rawPart of parts) {
            const trimmed = rawPart.trim();
            if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) continue;
            const eq = trimmed.indexOf('=');
            if (eq <= 0) {
                const flag = trimmed.toLowerCase();
                if (flag === 'stop') out.stop = true;
                else if (flag === 'restart') out.restart = true;
                else if (flag === 'follow') out.follow = true;
                else if (flag === 'detach' || flag === 'unfollow') out.follow = false;
                continue;
            }
            let key = trimmed.slice(0, eq).trim().toLowerCase();
            if (key.startsWith('v.')) key = key.slice(2);
            else if (key.startsWith('variable.')) key = key.slice(9);
            if (key.startsWith('lumenfx_')) key = key.slice(8);
            else if (key.startsWith('lumenfx.')) key = key.slice(8);

            let val = trimmed.slice(eq + 1).trim();
            if (val.length >= 2 && ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"')))) {
                val = val.slice(1, -1).trim();
            }

            if (key === 'follow' || key === 'bind' || key === 'bind_to_actor' || key === 'attach') {
                out.follow = parseBoolDirective(val, out.follow);
            } else if (key === 'rotate' || key === 'inherit_rotation' || key === 'rot') {
                out.rotate = parseBoolDirective(val, out.rotate);
            } else if (key === 'scale' || key === 'size') {
                const n = Number(val);
                if (Number.isFinite(n) && n > 0) out.scale = n;
            } else if (key === 'color' || key === 'tint') {
                out.color = parseScriptColor(val);
            } else if (key === 'offset' || key === 'pos') {
                const nums = val.split(/[,\s]+/).filter(Boolean).map(Number);
                if (nums.length >= 3 && nums.slice(0, 3).every(Number.isFinite)) {
                    out.offset = [nums[0], nums[1], nums[2]];
                }
            } else if (key === 'beam_end' || key === 'beam_target' || key === 'target_locator') {
                if (val) out.beamEnd = val;
            } else if (key === 'stop' || key === 'close' || key === 'end') {
                out.stop = parseBoolDirective(val, true);
            } else if (key === 'restart' || key === 'respawn') {
                out.restart = parseBoolDirective(val, true);
            } else if (key === 'seed') {
                const n = parseInt(val, 10);
                if (Number.isFinite(n)) out.seed = n;
            }
        }
        return out;
    }

    function parseScriptColor(val) {
        if (!val) return null;
        if (val.startsWith('#')) {
            const hex = val.slice(1);
            if (hex.length === 6) {
                return [
                    parseInt(hex.slice(0, 2), 16) / 255,
                    parseInt(hex.slice(2, 4), 16) / 255,
                    parseInt(hex.slice(4, 6), 16) / 255,
                    1
                ];
            }
            if (hex.length === 8) {
                return [
                    parseInt(hex.slice(0, 2), 16) / 255,
                    parseInt(hex.slice(2, 4), 16) / 255,
                    parseInt(hex.slice(4, 6), 16) / 255,
                    parseInt(hex.slice(6, 8), 16) / 255
                ];
            }
            return null;
        }
        const nums = val.split(/[,\s]+/).filter(Boolean).map(Number);
        if (nums.length >= 3 && nums.slice(0, 3).every(Number.isFinite)) {
            let r = nums[0];
            let g = nums[1];
            let b = nums[2];
            let a = nums.length >= 4 && Number.isFinite(nums[3]) ? nums[3] : 1.0;
            if (r > 1.0 || g > 1.0 || b > 1.0 || a > 1.0) {
                r /= 255.0;
                g /= 255.0;
                b /= 255.0;
                if (nums.length >= 4 && a > 1.0) a /= 255.0;
            }
            return [r, g, b, a];
        }
        return null;
    }

    // ---- Exact Binary .lfmesh Decoder & Encoder (matches StaticMeshModel.java:88-146) ----

    function decodeLfMesh(bytes) {
        if (!bytes || bytes.length < 24) return null;
        const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
        const dv = new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
        let off = 0;
        const readI32 = () => { const v = dv.getInt32(off, true); off += 4; return v; };
        const readF32 = () => { const v = dv.getFloat32(off, true); off += 4; return v; };

        const magic = dv.getUint32(off, true); off += 4;
        if (magic !== LFMH_MAGIC) return null;
        const version = readI32();
        if (version < 1 || version > 3) return null;
        if (version >= 2) readI32(); // vertexIdKind
        const vertices = readI32();
        const indexCount = readI32();
        const uvCount = readI32();
        const sectionCount = readI32();
        if (vertices <= 0 || indexCount <= 0 || indexCount % 3 !== 0 || uvCount < 0 || uvCount > 128) return null;

        const uvWidths = [];
        for (let c = 0; c < uvCount; c++) {
            uvWidths.push(version >= 3 ? readI32() : 2);
        }
        off += vertices * 4; // instanceIds
        const positions = new Float32Array(vertices * 3);
        for (let i = 0; i < positions.length; i++) positions[i] = readF32();
        const normals = new Float32Array(vertices * 3);
        for (let i = 0; i < normals.length; i++) normals[i] = readF32();
        off += vertices * 3 * 4; // tangents
        off += vertices * 4;     // binormalSigns
        const colors = new Float32Array(vertices * 4);
        for (let i = 0; i < colors.length; i++) colors[i] = readF32();
        const uv0 = new Float32Array(vertices * 2);
        for (let c = 0; c < uvCount; c++) {
            const w = uvWidths[c];
            for (let v = 0; v < vertices; v++) {
                const u = readF32();
                const vv = w >= 2 ? readF32() : 0;
                if (w > 2) off += (w - 2) * 4;
                if (c === 0) {
                    uv0[v * 2] = u;
                    uv0[v * 2 + 1] = vv;
                }
            }
        }
        const indices = new Uint32Array(indexCount);
        for (let i = 0; i < indexCount; i++) indices[i] = readI32();

        let maxCoord = 0;
        for (let i = 0; i < positions.length; i++) maxCoord = Math.max(maxCoord, Math.abs(positions[i]));
        const unitScale = maxCoord > 10.0 ? 0.01 : 1.0;

        return {version, vertices, indexCount, positions, normals, colors, uv0, indices, unitScale};
    }

    function encodeLfMesh(meshData) {
        const positions = meshData.positions;
        const vertices = positions.length / 3;
        const normals = meshData.normals || new Float32Array(vertices * 3);
        const colors = meshData.colors || new Float32Array(vertices * 4).fill(1);
        const uv0 = meshData.uv0 || new Float32Array(vertices * 2);
        const indices = meshData.indices;
        const indexCount = indices.length;
        const slotBytes = new TextEncoder().encode('particle');

        // v1 layout: 6 header ints + instanceIds + pos + norm + tang + binormSign + col + uv0 + indices + 1 section
        const totalBytes = 24
            + vertices * 4
            + vertices * 3 * 4
            + vertices * 3 * 4
            + vertices * 3 * 4
            + vertices * 4
            + vertices * 4 * 4
            + vertices * 2 * 4
            + indexCount * 4
            + 4 + 4 + slotBytes.length + 4 + 4;

        const out = new Uint8Array(totalBytes);
        const dv = new DataView(out.buffer);
        let off = 0;
        const writeI32 = (v) => { dv.setInt32(off, v, true); off += 4; };
        const writeF32 = (v) => { dv.setFloat32(off, v, true); off += 4; };

        dv.setUint32(off, LFMH_MAGIC, true); off += 4;
        writeI32(1); // version 1
        writeI32(vertices);
        writeI32(indexCount);
        writeI32(1); // uvCount
        writeI32(1); // sectionCount
        for (let i = 0; i < vertices; i++) writeI32(i);
        for (let i = 0; i < positions.length; i++) writeF32(positions[i]);
        for (let i = 0; i < normals.length; i++) writeF32(normals[i]);
        for (let i = 0; i < vertices * 3; i++) writeF32(0); // tangents
        for (let i = 0; i < vertices; i++) writeF32(1);     // binormalSigns
        for (let i = 0; i < colors.length; i++) writeF32(colors[i]);
        for (let i = 0; i < uv0.length; i++) writeF32(uv0[i]);
        for (let i = 0; i < indexCount; i++) writeI32(indices[i]);
        writeI32(0); // section group
        writeI32(slotBytes.length);
        out.set(slotBytes, off); off += slotBytes.length;
        writeI32(0); // firstIndex
        writeI32(indexCount);
        return out;
    }

    // ---- Preset Builders ----

    function createPreset(presetId = 'sprite_burst', effectId = 'my_mod:lumen_effect') {
        if (presetId === 'ribbon_stream') {
            return {
                format_version: 1,
                materials: {
                    ribbon_mat: {
                        fragment_shader: 'lumenfx:core/color',
                        blend: 'additive',
                        depth_test: true,
                        depth_write: false,
                        cull: false,
                        hdr: true,
                        emissive_scale: 1.25,
                        bloom_intensity: 0.45
                    }
                },
                emitters: [
                    {
                        name: 'arcane_ribbon',
                        renderer: 'ribbon',
                        material: 'ribbon_mat',
                        local_space: false,
                        delay: 0.0,
                        duration: 2.0,
                        loop: true,
                        max_particles: 64,
                        rate: 30.0,
                        lifetime: 0.65,
                        width: 0.35,
                        height: 0.35,
                        start_speed: 2.2,
                        start_direction: [0.0, 1.0, 0.0],
                        uv_mode: 'stretch',
                        subdivisions: 2,
                        attach_head: true,
                        movement_threshold: 4.0,
                        shape: {type: 'sphere', size: [0.2, 0.2, 0.2], surface: true},
                        size_over_life: {
                            keys: [
                                {time: 0.0, value: 0.3, interpolation: 'linear'},
                                {time: 0.25, value: 1.0, interpolation: 'linear'},
                                {time: 1.0, value: 0.0, interpolation: 'linear'}
                            ]
                        },
                        color: {
                            stops: [
                                {time: 0.0, color: [0.35, 0.88, 1.0, 0.95]},
                                {time: 0.6, color: [0.68, 0.38, 1.0, 0.75]},
                                {time: 1.0, color: [0.95, 0.25, 0.75, 0.0]}
                            ]
                        }
                    }
                ]
            };
        }
        if (presetId === 'beam_arc') {
            return {
                format_version: 1,
                materials: {
                    beam_mat: {
                        fragment_shader: 'lumenfx:core/color',
                        blend: 'additive',
                        depth_test: true,
                        depth_write: false,
                        cull: false,
                        hdr: true,
                        emissive_scale: 1.4,
                        bloom_intensity: 0.55
                    }
                },
                lights: [
                    {position: [0, 0.5, 0], color: [0.25, 0.85, 1.0], radius: 8.0, intensity: 0.65, type: 'point'}
                ],
                emitters: [
                    {
                        name: 'energy_beam',
                        renderer: 'beam',
                        material: 'beam_mat',
                        local_space: true,
                        delay: 0.0,
                        duration: 2.0,
                        loop: true,
                        max_particles: 1,
                        rate: 0.0,
                        bursts: [{time: 0.0, min: 1, max: 1, cycles: 1}],
                        lifetime: 2.0,
                        width: 0.32,
                        height: 3.0,
                        beam_length: 3.0,
                        beam_segments: 12,
                        beam_noise: 0.14,
                        color: {
                            stops: [
                                {time: 0.0, color: [0.6, 0.95, 1.0, 0.95]},
                                {time: 1.0, color: [0.2, 0.55, 1.0, 0.85]}
                            ]
                        }
                    }
                ]
            };
        }
        if (presetId === 'mesh_crystal') {
            return {
                format_version: 1,
                materials: {
                    crystal_mat: {
                        fragment_shader: 'lumenfx:core/color',
                        blend: 'alpha',
                        depth_test: true,
                        depth_write: false,
                        cull: false,
                        hdr: true,
                        emissive_scale: 1.15,
                        bloom_intensity: 0.35
                    }
                },
                emitters: [
                    {
                        name: 'crystal_shards',
                        renderer: 'mesh',
                        material: 'crystal_mat',
                        local_space: false,
                        delay: 0.0,
                        duration: 1.5,
                        loop: true,
                        max_particles: 16,
                        rate: 0.0,
                        bursts: [{time: 0.0, min: 8, max: 8, cycles: 1}],
                        lifetime: {min: 0.8, max: 1.2},
                        width: 0.35,
                        height: 0.55,
                        start_speed: {min: 1.2, max: 2.4},
                        angular_velocity: 2.4,
                        shape: {type: 'cone', size: [0.35, 0.5, 0.35], surface: false},
                        force_over_life: [0.0, -3.5, 0.0],
                        collision: {enabled: true, bounce: 0.5, dampen: 0.25, lifetime_loss: 0.0},
                        mesh: {entries: [{asset: `${effectId.split(':')[0] || 'my_mod'}:crystal_shard`}]},
                        color: {
                            stops: [
                                {time: 0.0, color: [0.45, 0.92, 1.0, 0.95]},
                                {time: 1.0, color: [0.2, 0.5, 0.95, 0.0]}
                            ]
                        }
                    }
                ]
            };
        }
        // Default: sprite_burst with dynamic light & collision
        return {
            format_version: 1,
            materials: {
                glow: {
                    fragment_shader: 'lumenfx:core/color',
                    blend: 'additive',
                    depth_test: true,
                    depth_write: false,
                    cull: false,
                    hdr: true,
                    emissive_scale: 1.2,
                    bloom_intensity: 0.45,
                    parameters: [1.0, 0.0, 0.0, 0.0]
                }
            },
            lights: [
                {position: [0.0, 0.5, 0.0], color: [1.0, 0.72, 0.25], radius: 6.0, intensity: 0.55, type: 'point'}
            ],
            emitters: [
                {
                    name: 'embers',
                    renderer: 'sprite',
                    material: 'glow',
                    local_space: false,
                    delay: 0.0,
                    duration: 2.0,
                    loop: true,
                    max_particles: 128,
                    rate: 36.0,
                    lifetime: {min: 0.5, max: 1.0},
                    width: 0.28,
                    height: 0.28,
                    start_speed: {min: 1.4, max: 2.8},
                    shape: {type: 'sphere', size: [0.25, 0.25, 0.25], surface: false},
                    force_over_life: [0.0, -4.0, 0.0],
                    collision: {enabled: true, bounce: 0.45, dampen: 0.2, lifetime_loss: 0.0},
                    size_over_life: {
                        keys: [
                            {time: 0.0, value: 0.4, interpolation: 'linear'},
                            {time: 0.3, value: 1.0, interpolation: 'linear'},
                            {time: 1.0, value: 0.0, interpolation: 'linear'}
                        ]
                    },
                    color: [
                        1.0,
                        {keys: [{time: 0.0, value: 0.85}, {time: 1.0, value: 0.25}]},
                        0.15,
                        {keys: [{time: 0.0, value: 1.0}, {time: 1.0, value: 0.0}]}
                    ]
                }
            ]
        };
    }

    function registerFormat() {
        return FormatRegistry.register({
            id: 'lumenfx_json',
            label: 'LumenFX JSON (v1 / Unity / Niagara)',
            extensions: ['.json'],
            canParse,
            inspect,
            createPreset
        });
    }

    return {
        LFMH_MAGIC,
        safeParseJson,
        canParse,
        detectOriginKind,
        parseNamespacedResourcePath,
        resolveResourceOnDisk,
        extractDependencies,
        inspect,
        hashUnit,
        evalScalarCurve,
        evalVec3Curve,
        evalColorCurve,
        parseEffectId,
        parsePreEffectScript,
        decodeLfMesh,
        encodeLfMesh,
        createPreset,
        registerFormat
    };
})();


/* === src/lumenfx/lumenfx_preview.js === */
const LumenFxPreview = (() => {
    const SCALE = 16; // 1 Minecraft block = 16 Blockbench units
    const INV_SCALE = 1 / SCALE;
    const projectStates = new Map(); // projectId -> { assets: Map<assetKey, AssetState>, instances: Map<instKey, InstanceState> }
    let rootGroup = null;
    let whiteFallbackTex = null;
    const shaderCompileVerdicts = new Map(); // cacheKey -> { ok: boolean, error?: string }

    function getProjectId(project) {
        const p = project || (typeof Project !== 'undefined' ? Project : null);
        return p ? (p.uuid || '__default__') : '__none__';
    }

    function ensureRoot() {
        if (typeof THREE === 'undefined' || typeof Canvas === 'undefined' || !Canvas?.scene) return null;
        if (!rootGroup) {
            rootGroup = new THREE.Group();
            rootGroup.name = 'particlecue_lumenfx_space';
            rootGroup.no_export = true;
        }
        if (typeof Animator !== 'undefined' && Animator.open) {
            if (!rootGroup.parent) Canvas.scene.add(rootGroup);
        } else if (rootGroup.parent) {
            rootGroup.parent.remove(rootGroup);
        }
        return rootGroup;
    }

    function getWhiteTexture() {
        if (typeof THREE === 'undefined') return null;
        if (!whiteFallbackTex) {
            const data = new Uint8Array([255, 255, 255, 255]);
            whiteFallbackTex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
            whiteFallbackTex.flipY = false;
            whiteFallbackTex.needsUpdate = true;
        }
        return whiteFallbackTex;
    }

    function getProjectState(project, create = true) {
        const id = getProjectId(project);
        if (projectStates.has(id)) return projectStates.get(id);
        if (!create) return null;
        const st = {
            projectId: id,
            assets: new Map(),     // assetKey -> { json, hash, meta, textures, meshes, shaders, compiledShaders, shaderErrors }
            instances: new Map()   // instanceKey -> { group, assetKey, lastTime, particleCount }
        };
        projectStates.set(id, st);
        return st;
    }

    function createThreeTexture(srcUrl) {
        if (typeof THREE === 'undefined' || !srcUrl) return null;
        const img = new Image();
        const tex = new THREE.Texture(img);
        // Align with OpenGL / Minecraft DirectGlTextureCache: row 0 (image top) is v = 0
        tex.flipY = false;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.magFilter = THREE.LinearFilter;
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        img.onload = () => {
            tex.needsUpdate = true;
        };
        img.src = srcUrl;
        return tex;
    }

    function buildGeometryFromLfMesh(decoded) {
        if (!decoded || typeof THREE === 'undefined') return null;
        const geo = new THREE.BufferGeometry();
        const scaledPos = new Float32Array(decoded.positions.length);
        for (let i = 0; i < decoded.positions.length; i++) {
            scaledPos[i] = decoded.positions[i] * decoded.unitScale;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(scaledPos, 3));
        if (decoded.normals && decoded.normals.length === scaledPos.length) {
            geo.setAttribute('normal', new THREE.BufferAttribute(decoded.normals, 3));
        }
        if (decoded.uv0 && decoded.uv0.length === decoded.vertices * 2) {
            geo.setAttribute('uv', new THREE.BufferAttribute(decoded.uv0, 2));
        }
        geo.setIndex(new THREE.BufferAttribute(decoded.indices, 1));
        if (!decoded.normals || decoded.normals.every(v => v === 0)) {
            geo.computeVertexNormals();
        }
        return geo;
    }

    function buildFallbackCrystalGeometry() {
        if (typeof THREE === 'undefined') return null;
        return new THREE.OctahedronGeometry(0.45, 0);
    }

    // ---- WebGL2 GLSL3 Shader Compilation & Preprocessing (DirectGlCustomMaterialCompiler parity) ----

    const COMMON_VERTEX_SHADER = `
uniform vec4 uTint;
uniform float uTime;
uniform vec4 uParams;
out vec2 vUv;
out vec4 vColor;
out vec3 vWorldPos;
out vec2 effectUV;
out vec2 effectUV1;
out vec2 effectNextUV;
out vec2 effectUnflippedUV;
out vec2 effectNextUnflippedUV;
out float effectSubImageLerp;
out vec4 effectColor;
out vec4 effectParticle;
out vec4 effectCustom;
out vec3 effectPosition;

void main() {
    vec4 bbWorld = modelMatrix * vec4(position, 1.0);
    vec3 mcWorld = bbWorld.xyz * ${INV_SCALE.toFixed(6)};
    vUv = uv;
    vColor = uTint;
    vWorldPos = mcWorld;
    effectUV = uv;
    effectUV1 = uv;
    effectNextUV = uv;
    effectUnflippedUV = uv;
    effectNextUnflippedUV = uv;
    effectSubImageLerp = 0.0;
    effectColor = uTint;
    effectParticle = vec4(0.0, 0.0, 1.0, 0.0);
    effectCustom = uParams;
    effectPosition = mcWorld;
    gl_Position = projectionMatrix * viewMatrix * bbWorld;
}
`;

    const DEFAULT_PARTICLE_FRAGMENT_SHADER = `
in vec2 vUv;
in vec4 vColor;
uniform sampler2D uTex;
uniform float uHdr;
uniform float uUseTex;
out vec4 fragColor;

void main() {
    vec4 sampled = uUseTex > 0.5 ? texture(uTex, vUv) : vec4(1.0);
    vec4 outCol = sampled * vColor;
    outCol.rgb *= clamp(uHdr, 1.0, 2.0);
    if (outCol.a <= 0.002) discard;
    fragColor = outCol;
}
`;

    function preprocessCustomFragmentShader(rawSource, matSpec) {
        let src = String(rawSource || '').replace(/\r\n/g, '\n');
        // Strip desktop GLSL #version directives (Three.js injects `#version 300 es` for GLSL3)
        src = src.replace(/^\s*#version[^\n]*\n?/gm, '');
        // Strip legacy layout(location = 0) on fragColor if present, keep valid GLSL ES 3.00
        src = src.replace(/^\s*#extension[^\n]*\n?/gm, '');

        const hasDecl = (regex) => regex.test(src);
        const header = [];

        if (!hasDecl(/\bin\s+vec2\s+vUv\b/)) header.push('in vec2 vUv;');
        if (!hasDecl(/\bin\s+vec4\s+vColor\b/)) header.push('in vec4 vColor;');
        if (!hasDecl(/\bin\s+vec3\s+vWorldPos\b/)) header.push('in vec3 vWorldPos;');
        if (!hasDecl(/\bin\s+vec2\s+effectUV\b/)) header.push('in vec2 effectUV;');
        if (!hasDecl(/\bin\s+vec2\s+effectUV1\b/)) header.push('in vec2 effectUV1;');
        if (!hasDecl(/\bin\s+vec2\s+effectNextUV\b/)) header.push('in vec2 effectNextUV;');
        if (!hasDecl(/\bin\s+vec2\s+effectUnflippedUV\b/)) header.push('in vec2 effectUnflippedUV;');
        if (!hasDecl(/\bin\s+vec2\s+effectNextUnflippedUV\b/)) header.push('in vec2 effectNextUnflippedUV;');
        if (!hasDecl(/\bin\s+float\s+effectSubImageLerp\b/)) header.push('in float effectSubImageLerp;');
        if (!hasDecl(/\bin\s+vec4\s+effectColor\b/)) header.push('in vec4 effectColor;');
        if (!hasDecl(/\bin\s+vec4\s+effectParticle\b/)) header.push('in vec4 effectParticle;');
        if (!hasDecl(/\bin\s+vec4\s+effectCustom\b/)) header.push('in vec4 effectCustom;');
        if (!hasDecl(/\bin\s+vec3\s+effectPosition\b/)) header.push('in vec3 effectPosition;');

        if (!hasDecl(/\buniform\s+sampler2D\s+uTex\b/)) header.push('uniform sampler2D uTex;');
        if (!hasDecl(/\buniform\s+sampler2D\s+uTex1\b/)) header.push('uniform sampler2D uTex1;');
        if (!hasDecl(/\buniform\s+sampler2D\s+uSceneDepth\b/)) header.push('uniform sampler2D uSceneDepth;');
        if (!hasDecl(/\buniform\s+sampler2D\s+uSceneColor\b/)) header.push('uniform sampler2D uSceneColor;');
        if (!hasDecl(/\buniform\s+float\s+uTime\b/)) header.push('uniform float uTime;');
        if (!hasDecl(/\buniform\s+float\s+uHdr\b/)) header.push('uniform float uHdr;');
        if (!hasDecl(/\buniform\s+float\s+uSoftFade\b/)) header.push('uniform float uSoftFade;');
        if (!hasDecl(/\buniform\s+vec2\s+uNearFar\b/)) header.push('uniform vec2 uNearFar;');
        if (!hasDecl(/\buniform\s+vec2\s+uInvViewport\b/)) header.push('uniform vec2 uInvViewport;');
        if (!hasDecl(/\buniform\s+vec4\s+uParams\b/)) header.push('uniform vec4 uParams;');
        if (!hasDecl(/\buniform\s+vec4\s+uTint\b/)) header.push('uniform vec4 uTint;');

        if (hasDecl(/\bSampler0\b/) && !hasDecl(/\buniform\s+sampler2D\s+Sampler0\b/)) {
            header.push('uniform sampler2D Sampler0;');
        }
        if (hasDecl(/\bSampler1\b/) && !hasDecl(/\buniform\s+sampler2D\s+Sampler1\b/)) {
            header.push('uniform sampler2D Sampler1;');
        }
        if (matSpec?.textures && typeof matSpec.textures === 'object') {
            for (const key of Object.keys(matSpec.textures)) {
                if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)
                    && key !== 'Sampler0' && key !== 'Sampler1' && key !== 'uTex' && key !== 'uTex1') {
                    const re = new RegExp(`\\buniform\\s+sampler2D\\s+${key}\\b`);
                    if (!hasDecl(re)) {
                        header.push(`uniform sampler2D ${key};`);
                    }
                }
            }
        }

        // Support 26.2-style EffectFrame UBO fields without requiring a WebGL UBO block
        if (hasDecl(/\blayout\s*\([^)]*\)\s*uniform\s+EffectFrame\b/) || hasDecl(/\buniform\s+EffectFrame\b/)) {
            src = src.replace(/(?:layout\s*\([^)]*\)\s*)?uniform\s+EffectFrame\s*\{[\s\S]*?\}\s*;/g, '');
        }
        if (hasDecl(/\bEffectClock\b/) && !hasDecl(/\b#define\s+EffectClock\b/)) {
            header.push('#define EffectClock vec4(uTime, 0.0, 0.0, 0.0)');
        }
        if (hasDecl(/\bMaterialParameters\b/) && !hasDecl(/\b#define\s+MaterialParameters\b/)) {
            header.push('#define MaterialParameters uParams');
        }

        if (!hasDecl(/\bout\s+vec4\s+fragColor\b/)) {
            header.push('out vec4 fragColor;');
        }
        if (!hasDecl(/\bfloat\s+lfx_linear_depth\s*\(/)) {
            header.push(`float lfx_linear_depth(float d) {
    float z = d * 2.0 - 1.0;
    return (2.0 * uNearFar.x * uNearFar.y) / max(uNearFar.y + uNearFar.x - z * (uNearFar.y - uNearFar.x), 0.0001);
}`);
        }
        if (!hasDecl(/\bfloat\s+lfx_soft_particle_alpha\s*\(/)) {
            header.push(`float lfx_soft_particle_alpha() {
    return 1.0;
}`);
        }

        return `${header.join('\n')}\n${src}`;
    }

    function getActiveRenderer() {
        if (typeof Preview !== 'undefined') {
            if (Preview.selected?.renderer) return Preview.selected.renderer;
            if (Array.isArray(Preview.all)) {
                for (const pv of Preview.all) {
                    if (pv?.renderer) return pv.renderer;
                }
            }
        }
        if (typeof Canvas !== 'undefined' && Canvas?.renderer) return Canvas.renderer;
        return null;
    }

    function probeWebGL2ShaderCompile(cacheKey, fragBody) {
        if (shaderCompileVerdicts.has(cacheKey)) {
            return shaderCompileVerdicts.get(cacheKey);
        }
        const renderer = getActiveRenderer();
        const gl = renderer && typeof renderer.getContext === 'function' ? renderer.getContext() : null;
        if (!gl || typeof WebGL2RenderingContext === 'undefined' || !(gl instanceof WebGL2RenderingContext)) {
            const fallback = {ok: false, error: 'WebGL2 context unavailable'};
            shaderCompileVerdicts.set(cacheKey, fallback);
            return fallback;
        }
        const fullFrag = `#version 300 es\nprecision highp float;\nprecision highp int;\n${fragBody}`;
        const shader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!shader) {
            const res = {ok: false, error: 'gl.createShader returned null'};
            shaderCompileVerdicts.set(cacheKey, res);
            return res;
        }
        gl.shaderSource(shader, fullFrag);
        gl.compileShader(shader);
        const ok = Boolean(gl.getShaderParameter(shader, gl.COMPILE_STATUS));
        const infoLog = ok ? '' : String(gl.getShaderInfoLog(shader) || 'Unknown GLSL compile error');
        gl.deleteShader(shader);
        const verdict = ok ? {ok: true} : {ok: false, error: infoLog.trim()};
        shaderCompileVerdicts.set(cacheKey, verdict);
        return verdict;
    }

    function applyBlendAndDepthState(mat, matSpec) {
        const blend = String(matSpec?.blend || 'alpha').toLowerCase();
        const isAdd = blend === 'additive' || blend === 'add';
        const isOpaque = blend === 'opaque';
        const isMultiply = blend === 'multiply' || blend === 'modulate';
        const isPremult = blend === 'premultiplied';
        const isSubtract = blend === 'subtract';
        const isRevSub = blend === 'reverse_subtract';

        mat.transparent = !isOpaque;
        mat.depthWrite = matSpec?.depth_write !== undefined ? Boolean(matSpec.depth_write) : isOpaque;
        mat.depthTest = matSpec?.depth_test !== undefined ? Boolean(matSpec.depth_test) : true;
        mat.side = matSpec?.cull ? THREE.FrontSide : THREE.DoubleSide;

        if (isOpaque) {
            mat.blending = THREE.NoBlending;
        } else if (isAdd) {
            mat.blending = THREE.AdditiveBlending;
        } else if (isMultiply) {
            mat.blending = THREE.MultiplyBlending;
        } else if (isPremult) {
            mat.blending = THREE.CustomBlending;
            mat.blendEquation = THREE.AddEquation;
            mat.blendSrc = THREE.OneFactor;
            mat.blendDst = THREE.OneMinusSrcAlphaFactor;
        } else if (isSubtract || isRevSub) {
            mat.blending = THREE.CustomBlending;
            mat.blendEquation = isRevSub ? THREE.ReverseSubtractEquation : THREE.SubtractEquation;
            mat.blendSrc = THREE.SrcAlphaFactor;
            mat.blendDst = THREE.OneFactor;
        } else {
            mat.blending = THREE.NormalBlending;
        }
        mat.userData.isAdd = isAdd;
        mat.userData.blend = blend;
        mat.userData.emissiveScale = Number(matSpec?.emissive_scale) || 1.0;
    }

    function resolveMaterialTextures(matSpec, record) {
        const white = getWhiteTexture();
        let tex0 = null;
        let tex1 = null;
        const extras = {};
        if (matSpec?.textures && typeof matSpec.textures === 'object') {
            const entries = Object.entries(matSpec.textures);
            if (matSpec.textures.Sampler0 && record.textures.has(matSpec.textures.Sampler0)) {
                tex0 = record.textures.get(matSpec.textures.Sampler0);
            } else if (entries.length > 0 && record.textures.has(entries[0][1])) {
                tex0 = record.textures.get(entries[0][1]);
            }
            if (matSpec.textures.Sampler1 && record.textures.has(matSpec.textures.Sampler1)) {
                tex1 = record.textures.get(matSpec.textures.Sampler1);
            } else if (entries.length > 1 && record.textures.has(entries[1][1])) {
                tex1 = record.textures.get(entries[1][1]);
            }
            for (const [k, ref] of entries) {
                extras[k] = (ref && record.textures.has(ref)) ? record.textures.get(ref) : white;
            }
        }
        return {
            tex0: tex0 || white,
            tex1: tex1 || white,
            hasTex0: Boolean(tex0),
            extras
        };
    }

    function createMaterialForSpec(matSpec, record, diffSec) {
        const white = getWhiteTexture();
        const {tex0, tex1, hasTex0, extras} = resolveMaterialTextures(matSpec, record);
        const shaderId = String(matSpec?.fragment_shader || 'lumenfx:core/effect').trim();
        const isCoreColor = shaderId === 'lumenfx:core/color';
        const isBuiltin = !shaderId || shaderId === 'lumenfx:core/effect' || isCoreColor;
        const inlineFrag = typeof matSpec?.custom_glsl_fragment === 'string' && matSpec.custom_glsl_fragment.trim()
            ? matSpec.custom_glsl_fragment
            : '';
        const customFragRaw = inlineFrag || (!isBuiltin ? (record.shaders.get(shaderId) || '') : '');
        const hdrScale = matSpec?.hdr ? Math.max(1.5, Number(matSpec?.emissive_scale) || 1.5) : 1.0;
        const pArr = Array.isArray(matSpec?.parameters) ? matSpec.parameters : [0, 0, 0, 0];
        const paramsVec = new THREE.Vector4(
            Number(pArr[0]) || 0,
            Number(pArr[1]) || 0,
            Number(pArr[2]) || 0,
            Number(pArr[3]) || 0
        );
        const glsl3 = THREE.GLSL3 || '300 es';

        const renderer = getActiveRenderer();
        const isWebGL2 = Boolean(renderer?.capabilities?.isWebGL2);

        if (isWebGL2 && customFragRaw) {
            const fragBody = preprocessCustomFragmentShader(customFragRaw, matSpec);
            const cacheKey = `${shaderId}::${Platform.sha256(fragBody)}`;
            const verdict = probeWebGL2ShaderCompile(cacheKey, fragBody);
            if (verdict.ok) {
                record.compiledShaders.add(shaderId || 'inline');
                const uniforms = {
                    uTex: {value: tex0},
                    uTex1: {value: tex1},
                    uSceneDepth: {value: white},
                    uSceneColor: {value: white},
                    Sampler0: {value: tex0},
                    Sampler1: {value: tex1},
                    uTime: {value: Number(diffSec) || 0},
                    uHdr: {value: hdrScale},
                    uSoftFade: {value: matSpec?.soft_particles ? (Number(matSpec?.soft_fade_distance) || 0.5) : 0},
                    uNearFar: {value: new THREE.Vector2(0.1, 1000.0)},
                    uInvViewport: {value: new THREE.Vector2(1 / 1280, 1 / 720)},
                    uParams: {value: paramsVec},
                    uTint: {value: new THREE.Vector4(1, 1, 1, 1)}
                };
                for (const [k, texVal] of Object.entries(extras)) {
                    if (!uniforms[k]) uniforms[k] = {value: texVal};
                }
                const mat = new THREE.ShaderMaterial({
                    glslVersion: glsl3,
                    vertexShader: COMMON_VERTEX_SHADER,
                    fragmentShader: fragBody,
                    uniforms
                });
                applyBlendAndDepthState(mat, matSpec);
                mat.userData.isShader = true;
                mat.userData.shaderId = shaderId || 'inline';
                return mat;
            }
            const errMsg = `${shaderId || 'inline'}: ${verdict.error || 'compile failed'}`;
            if (!record.shaderErrors.includes(errMsg)) {
                record.shaderErrors.push(errMsg);
            }
        }

        if (isWebGL2) {
            const mat = new THREE.ShaderMaterial({
                glslVersion: glsl3,
                vertexShader: COMMON_VERTEX_SHADER,
                fragmentShader: DEFAULT_PARTICLE_FRAGMENT_SHADER,
                uniforms: {
                    uTex: {value: isCoreColor ? white : tex0},
                    uUseTex: {value: (!isCoreColor && hasTex0) ? 1.0 : 0.0},
                    uTime: {value: Number(diffSec) || 0},
                    uHdr: {value: hdrScale},
                    uParams: {value: paramsVec},
                    uTint: {value: new THREE.Vector4(1, 1, 1, 1)}
                }
            });
            applyBlendAndDepthState(mat, matSpec);
            mat.userData.isShader = true;
            return mat;
        }

        // Legacy WebGL1 fallback
        const mat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: (!isCoreColor && hasTex0) ? tex0 : null,
            vertexColors: false
        });
        applyBlendAndDepthState(mat, matSpec);
        mat.userData.isShader = false;
        return mat;
    }

    function setMaterialTint(mat, r, g, b, a) {
        const clampedA = Math.max(0, Math.min(1, a));
        if (mat.userData?.isShader && mat.uniforms?.uTint) {
            mat.uniforms.uTint.value.set(r, g, b, clampedA);
        } else if (mat.color) {
            mat.color.setRGB(r, g, b);
            mat.opacity = clampedA;
        }
    }

    // ---- Soft Volumetric & Light Halo Shaders (eliminating hard primitive spheres/boxes) ----

    const LIGHT_HALO_VERT = `
out vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

    const LIGHT_HALO_FRAG = `
in vec2 vUv;
uniform vec4 uTint;
out vec4 fragColor;
void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r2 = dot(p, p);
    if (r2 > 1.0) discard;
    float core = exp(-r2 * 10.0) * 0.85;
    float halo = exp(-r2 * 3.2) * 0.45 * smoothstep(1.0, 0.25, sqrt(r2));
    float intensity = (core + halo) * uTint.a;
    if (intensity < 0.005) discard;
    fragColor = vec4(uTint.rgb * intensity, clamp(intensity, 0.0, 1.0));
}
`;

    const VOLUME_FOG_VERT = `
out vec3 vLocalNorm;
void main() {
    vLocalNorm = position * 2.0; // BoxGeometry(1,1,1) -> [-1, 1]
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

    const VOLUME_FOG_FRAG = `
in vec3 vLocalNorm;
uniform vec4 uTint;
uniform float uTime;
out vec4 fragColor;
void main() {
    vec3 d = abs(vLocalNorm);
    float edgeFade = smoothstep(1.0, 0.35, max(d.x, max(d.y, d.z)));
    float radial = exp(-dot(vLocalNorm, vLocalNorm) * 1.45);
    float pulse = 0.88 + 0.12 * sin(vLocalNorm.y * 4.0 - uTime * 1.6);
    float alpha = clamp(edgeFade * radial * pulse * uTint.a, 0.0, 0.35);
    if (alpha < 0.004) discard;
    fragColor = vec4(uTint.rgb, alpha);
}
`;

    function registerOrUpdateAsset(project, assetKey, rawText, assetInfo = {}) {
        const meta = LumenFxSchema.inspect(rawText, assetInfo.filePath || assetKey, assetInfo.extraRoots || []);
        if (!meta) return null;
        const state = getProjectState(project, true);
        const hash = Platform.sha256(meta.rawText);
        const existing = state.assets.get(assetKey);
        if (existing && existing.hash === hash && existing.filePath === (assetInfo.filePath || existing.filePath || '')) {
            return existing;
        }

        if (existing) {
            disposeAssetRecord(state, assetKey);
        }

        const textures = new Map();
        const meshes = new Map();
        const shaders = new Map();
        const embeddedTextures = assetInfo.embeddedTextures || {};
        const embeddedMeshes = assetInfo.embeddedMeshes || {};
        const embeddedShaders = assetInfo.embeddedShaders || {};

        for (const t of meta.dependencies.textures) {
            const dataUrl = embeddedTextures[t.ref] || '';
            const src = dataUrl || (t.resolvedPath ? Platform.toFileUrl(t.resolvedPath) : '');
            if (src) {
                const tex = createThreeTexture(src);
                if (tex) textures.set(t.ref, tex);
            }
        }
        if (assetInfo.textureDataUrl && meta.textureRef && !textures.has(meta.textureRef)) {
            const tex = createThreeTexture(assetInfo.textureDataUrl);
            if (tex) textures.set(meta.textureRef, tex);
        }

        for (const s of meta.dependencies.shaders) {
            let shaderSrc = typeof embeddedShaders[s.ref] === 'string' ? embeddedShaders[s.ref] : '';
            if (!shaderSrc && s.resolvedPath && Platform.fileExists(s.resolvedPath)) {
                shaderSrc = Platform.readTextFile(s.resolvedPath) || '';
            }
            if (shaderSrc) {
                shaders.set(s.ref, shaderSrc);
            }
        }

        for (const m of meta.dependencies.meshes) {
            let bytes = null;
            if (embeddedMeshes[m.ref]) {
                bytes = Platform.base64ToUint8Array(embeddedMeshes[m.ref]);
            } else if (m.lfmeshPath && Platform.fileExists(m.lfmeshPath)) {
                bytes = Platform.readBinaryFile(m.lfmeshPath);
            } else if (m.manifestPath && Platform.fileExists(m.manifestPath)) {
                const mText = Platform.readTextFile(m.manifestPath);
                const mJson = LumenFxSchema.safeParseJson(mText);
                const geomRef = mJson?.lods?.[0]?.geometry;
                if (geomRef) {
                    const lfPath = LumenFxSchema.resolveResourceOnDisk(geomRef, m.manifestPath, 'lumenfx/meshes', '.lfmesh');
                    if (lfPath) bytes = Platform.readBinaryFile(lfPath);
                }
            }
            if (bytes) {
                const decoded = LumenFxSchema.decodeLfMesh(bytes);
                const geo = buildGeometryFromLfMesh(decoded);
                if (geo) meshes.set(m.ref, geo);
            }
        }

        const record = {
            assetKey,
            filePath: assetInfo.filePath || '',
            meta,
            json: meta.json,
            rawText: meta.rawText,
            hash,
            textures,
            meshes,
            shaders,
            compiledShaders: new Set(),
            shaderErrors: []
        };
        state.assets.set(assetKey, record);
        return record;
    }

    // ---- Unity/LumenFX Emitter Shape + Quaternion Transform & Step-Wise Motion Integration ----

    function parseUnityQuat(shape) {
        const q = shape?.unity?.rotation;
        if (!Array.isArray(q) || q.length < 4) return null;
        const qx = Number(q[0]) || 0;
        const qy = Number(q[1]) || 0;
        const qz = Number(q[2]) || 0;
        const qw = Number(q[3]);
        const safeW = Number.isFinite(qw) ? qw : 1;
        if (Math.abs(qx) < 1e-6 && Math.abs(qy) < 1e-6 && Math.abs(qz) < 1e-6 && Math.abs(safeW - 1) < 1e-6) {
            return null;
        }
        return new THREE.Quaternion(qx, qy, qz, safeW).normalize();
    }

    function rotateVecByQuat(vec, quat) {
        if (!quat) return vec;
        const v = new THREE.Vector3(vec[0], vec[1], vec[2]).applyQuaternion(quat);
        return [v.x, v.y, v.z];
    }

    function sampleEmitterShapeAndDir(shape, seed) {
        const type = String(shape?.type || 'point').toLowerCase();
        const sz = Array.isArray(shape?.size) ? shape.size : [0.2, 0.2, 0.2];
        const rx = LumenFxSchema.hashUnit(seed * 7 + 1) * 2 - 1;
        const ry = LumenFxSchema.hashUnit(seed * 13 + 3) * 2 - 1;
        const rz = LumenFxSchema.hashUnit(seed * 19 + 5) * 2 - 1;
        let ox = 0, oy = 0, oz = 0;
        let dx = 0, dy = 1, dz = 0;

        if (type === 'box') {
            ox = rx * (Number(sz[0]) || 0) * 0.5;
            oy = ry * (Number(sz[1]) || 0) * 0.5;
            oz = rz * (Number(sz[2]) || 0) * 0.5;
            const len = Math.hypot(ox, oy, oz);
            if (len > 1e-5) { dx = ox / len; dy = oy / len; dz = oz / len; }
        } else if (type === 'sphere' || type === 'hemisphere') {
            const sy = type === 'hemisphere' ? Math.abs(ry) : ry;
            const len = Math.hypot(rx, sy, rz) || 1;
            const radius = Number(shape?.radius) || Number(sz[0]) || 0.2;
            const r = shape?.surface ? 1 : Math.cbrt(LumenFxSchema.hashUnit(seed * 29 + 7));
            dx = rx / len; dy = sy / len; dz = rz / len;
            ox = dx * r * radius;
            oy = dy * r * (Number(sz[1]) || radius);
            oz = dz * r * (Number(sz[2]) || radius);
        } else if (type === 'circle' || type === 'ring' || type === 'donut') {
            const angle = LumenFxSchema.hashUnit(seed * 37 + 9) * Math.PI * 2;
            const radius = Number(shape?.radius) || Number(sz[0]) || 0.5;
            const r = shape?.surface ? radius : Math.sqrt(LumenFxSchema.hashUnit(seed * 41 + 11)) * radius;
            dx = Math.cos(angle); dy = 0; dz = Math.sin(angle);
            ox = dx * r;
            oy = 0;
            oz = dz * r;
        } else if (type === 'cylinder') {
            const angle = LumenFxSchema.hashUnit(seed * 37 + 9) * Math.PI * 2;
            const radius = Number(shape?.radius) || Number(sz[0]) || 0.3;
            const r = shape?.surface ? radius : Math.sqrt(LumenFxSchema.hashUnit(seed * 41 + 11)) * radius;
            dx = Math.cos(angle); dy = 0; dz = Math.sin(angle);
            ox = dx * r;
            oy = ry * (Number(sz[1]) || 0.3) * 0.5;
            oz = dz * r;
        } else if (type === 'cone') {
            const angle = LumenFxSchema.hashUnit(seed * 37 + 9) * Math.PI * 2;
            const radius = Number(shape?.radius) || Number(sz[0]) || 0.3;
            const r = Math.sqrt(LumenFxSchema.hashUnit(seed * 41 + 11)) * radius;
            const coneAngleRad = ((Number(shape?.angle) || 25) * Math.PI) / 180;
            ox = Math.cos(angle) * r;
            oy = LumenFxSchema.hashUnit(seed * 43 + 13) * (Number(sz[1]) || 0.2);
            oz = Math.sin(angle) * r;
            const sinA = Math.sin(coneAngleRad);
            dx = Math.cos(angle) * sinA;
            dy = Math.cos(coneAngleRad);
            dz = Math.sin(angle) * sinA;
        } else {
            const len = Math.hypot(rx, ry, rz) || 1;
            dx = rx / len; dy = ry / len; dz = rz / len;
        }

        const shapeQuat = parseUnityQuat(shape);
        let offset = rotateVecByQuat([ox, oy, oz], shapeQuat);
        let dir = rotateVecByQuat([dx, dy, dz], shapeQuat);

        if (Array.isArray(shape?.unity?.position)) {
            offset[0] += Number(shape.unity.position[0]) || 0;
            offset[1] += Number(shape.unity.position[1]) || 0;
            offset[2] += Number(shape.unity.position[2]) || 0;
        }
        return {offset, dir, shapeQuat};
    }

    function buildDeterministicParticles(emSpec, diffSec, baseSeed) {
        const delay = Math.max(0, Number(emSpec.delay) || 0);
        const simSpeed = Number(emSpec.simulation_speed) > 0 ? Number(emSpec.simulation_speed) : 1.0;
        const t = (diffSec - delay) * simSpeed;
        if (t < 0) return [];
        const duration = Math.max(0.05, Number(emSpec.duration) || 2.0);
        const loop = emSpec.loop !== false;
        const maxParticles = Math.min(256, Math.max(1, Number(emSpec.max_particles) || 64));
        const cycleNorm = loop ? ((t % duration) / duration) : Math.min(1, t / duration);
        const rate = Math.max(0, LumenFxSchema.evalScalarCurve(emSpec.rate, cycleNorm, baseSeed + 1, 0));

        // Estimate max lifetime window so looping bursts only generate relevant cycles
        const estLifeMax = Math.max(0.5, LumenFxSchema.evalScalarCurve(emSpec.lifetime, 1, baseSeed + 2, 2.0) * 1.5);
        const minSpawnTime = Math.max(0, t - estLifeMax);

        const spawns = [];
        // Bursts (now properly repeating across loop cycles, matching UnityEmitterRuntime!)
        if (Array.isArray(emSpec.bursts)) {
            const firstLoop = loop ? Math.max(0, Math.floor(minSpawnTime / duration)) : 0;
            const lastLoop = loop ? Math.floor(t / duration) : 0;
            emSpec.bursts.forEach((b, bi) => {
                const bt = Math.max(0, Number(b.time) || 0);
                const cycles = Math.max(1, Number(b.cycles) || 1);
                const interval = Math.max(0.05, Number(b.interval) || duration);
                for (let loopIdx = firstLoop; loopIdx <= lastLoop; loopIdx++) {
                    const loopBase = loopIdx * duration;
                    const count = Math.max(0, Math.round(LumenFxSchema.evalScalarCurve(
                        {min: b.min ?? b.count ?? 1, max: b.max ?? b.count ?? 1},
                        0,
                        baseSeed + bi * 53 + loopIdx * 197,
                        1
                    )));
                    for (let c = 0; c < cycles; c++) {
                        const spawnTime = loopBase + bt + c * interval;
                        if (spawnTime <= t && spawnTime >= minSpawnTime - 0.001) {
                            for (let k = 0; k < count; k++) {
                                spawns.push({
                                    spawnTime,
                                    seed: baseSeed + bi * 1009 + loopIdx * 4099 + c * 131 + k * 17
                                });
                            }
                        }
                    }
                }
            });
        }

        // Continuous rate
        if (rate > 0) {
            const activeSpan = loop ? t : Math.min(t, duration);
            const dt = 1 / rate;
            const startIdx = Math.max(0, Math.floor(minSpawnTime * rate));
            const endIdx = Math.floor(activeSpan * rate);
            const cappedStart = Math.max(startIdx, endIdx - maxParticles * 3);
            for (let i = cappedStart; i <= endIdx; i++) {
                const spawnTime = i * dt;
                if (spawnTime <= activeSpan) {
                    spawns.push({spawnTime, seed: baseSeed + 5003 + i * 29});
                }
            }
        }

        // Niagara fallback when explicit rate/bursts are encoded in compiled program
        if (!spawns.length && emSpec.renderer !== 'beam' && t >= 0) {
            const fallbackCount = Math.min(12, maxParticles);
            for (let i = 0; i < fallbackCount; i++) {
                spawns.push({spawnTime: (i / fallbackCount) * Math.min(t, 0.5), seed: baseSeed + 9001 + i * 31});
            }
        }

        const hasForceOverLife = Array.isArray(emSpec.force_over_life);
        const hasVelOverLife = Array.isArray(emSpec.velocity_over_life);
        const baseAcc = Array.isArray(emSpec.acceleration) ? emSpec.acceleration.map(n => Number(n) || 0) : [0, 0, 0];
        const noiseStr = Array.isArray(emSpec.noise_strength) ? emSpec.noise_strength.map(n => Number(n) || 0) : [0, 0, 0];
        const hasNoise = noiseStr[0] !== 0 || noiseStr[1] !== 0 || noiseStr[2] !== 0;
        const noiseFreq = Number(emSpec.noise_frequency) || 1.0;

        const alive = [];
        for (const sp of spawns) {
            const spawnCycleNorm = loop ? ((sp.spawnTime % duration) / duration) : Math.min(1, sp.spawnTime / duration);
            const life = Math.max(0.02, LumenFxSchema.evalScalarCurve(emSpec.lifetime, spawnCycleNorm, sp.seed + 3, 1.0));
            const age = t - sp.spawnTime;
            if (age < 0 || age > life) continue;
            const normAge = Math.max(0, Math.min(1, age / life));
            const sampled = sampleEmitterShapeAndDir(emSpec.shape, sp.seed);

            // Initial velocity (matching UnityEmitterRuntime: worldDir * speed + randVel)
            const speed = LumenFxSchema.evalScalarCurve(emSpec.start_speed, spawnCycleNorm, sp.seed + 14, 0);
            let dir = sampled.dir;
            if (Array.isArray(emSpec.start_direction)) {
                const dx = Number(emSpec.start_direction[0]) || 0;
                const dy = Number(emSpec.start_direction[1]) || 0;
                const dz = Number(emSpec.start_direction[2]) || 0;
                const l = Math.hypot(dx, dy, dz) || 1;
                dir = rotateVecByQuat([dx / l, dy / l, dz / l], sampled.shapeQuat);
            }
            let vx = dir[0] * speed;
            let vy = dir[1] * speed;
            let vz = dir[2] * speed;
            if (Array.isArray(emSpec.velocity_min) && Array.isArray(emSpec.velocity_max)) {
                vx += LumenFxSchema.evalScalarCurve({min: emSpec.velocity_min[0], max: emSpec.velocity_max[0]}, 0, sp.seed + 11, 0);
                vy += LumenFxSchema.evalScalarCurve({min: emSpec.velocity_min[1], max: emSpec.velocity_max[1]}, 0, sp.seed + 12, 0);
                vz += LumenFxSchema.evalScalarCurve({min: emSpec.velocity_min[2], max: emSpec.velocity_max[2]}, 0, sp.seed + 13, 0);
            }

            // Step-wise deterministic Euler integration (matching UnityEmitterRuntime.step!)
            let px = sampled.offset[0];
            let py = sampled.offset[1];
            let pz = sampled.offset[2];
            let instVx = vx;
            let instVy = vy;
            let instVz = vz;

            if (age > 1e-5) {
                const steps = (hasForceOverLife || hasVelOverLife || hasNoise || emSpec.drag !== undefined)
                    ? Math.min(28, Math.max(6, Math.ceil(age * 20)))
                    : 1;
                const stepDt = age / steps;
                for (let s = 0; s < steps; s++) {
                    const u = (s + 0.5) / steps * normAge;
                    const fol = hasForceOverLife ? LumenFxSchema.evalVec3Curve(emSpec.force_over_life, u, sp.seed + 21) : [0, 0, 0];
                    let fx = baseAcc[0] + fol[0];
                    let fy = baseAcc[1] + fol[1];
                    let fz = baseAcc[2] + fol[2];
                    if (hasNoise) {
                        const phase = (sp.spawnTime + (s + 0.5) * stepDt) * noiseFreq;
                        fx += Math.sin(py * noiseFreq + phase) * noiseStr[0];
                        fy += Math.cos(pz * noiseFreq + phase * 1.13) * noiseStr[1];
                        fz += Math.sin(px * noiseFreq - phase * 0.91) * noiseStr[2];
                    }
                    vx += fx * stepDt;
                    vy += fy * stepDt;
                    vz += fz * stepDt;
                    const dragVal = Math.max(0, LumenFxSchema.evalScalarCurve(emSpec.drag, u, sp.seed + 29, 0));
                    if (dragVal > 0) {
                        const damp = Math.max(0, 1 - dragVal * stepDt);
                        vx *= damp;
                        vy *= damp;
                        vz *= damp;
                    }
                    const addVel = hasVelOverLife ? LumenFxSchema.evalVec3Curve(emSpec.velocity_over_life, u, sp.seed + 25) : [0, 0, 0];
                    instVx = vx + addVel[0];
                    instVy = vy + addVel[1];
                    instVz = vz + addVel[2];
                    px += instVx * stepDt;
                    py += instVy * stepDt;
                    pz += instVz * stepDt;
                    if (emSpec.collision?.enabled && py < 0) {
                        const bounce = Math.max(0, Math.min(1, Number(emSpec.collision.bounce) || 0.5));
                        const damp = Math.max(0, 1 - (Number(emSpec.collision.dampen) || 0));
                        py = 0;
                        vy = Math.abs(vy) * bounce;
                        vx *= damp;
                        vz *= damp;
                    }
                }
            }

            const sizeMul = LumenFxSchema.evalScalarCurve(emSpec.size_over_life, normAge, sp.seed + 31, 1);
            const startW = LumenFxSchema.evalScalarCurve(emSpec.width, spawnCycleNorm, sp.seed + 32, 0.25);
            const startH = LumenFxSchema.evalScalarCurve(emSpec.height, spawnCycleNorm, sp.seed + 33, startW);
            const width = Math.max(0.005, startW * sizeMul);
            const height = Math.max(0.005, startH * sizeMul);
            const baseRot = LumenFxSchema.evalScalarCurve(emSpec.rotation, spawnCycleNorm, sp.seed + 34, 0);
            const angVel = LumenFxSchema.evalScalarCurve(emSpec.angular_velocity, spawnCycleNorm, sp.seed + 35, 0);

            const colorSpec = emSpec.color_over_life !== undefined ? emSpec.color_over_life : emSpec.color;
            const colOverLife = LumenFxSchema.evalColorCurve(colorSpec, normAge, sp.seed + 36);
            const startCol = emSpec.start_color !== undefined
                ? LumenFxSchema.evalColorCurve(emSpec.start_color, spawnCycleNorm, sp.seed + 37)
                : [1, 1, 1, 1];
            const emTint = Array.isArray(emSpec.tint) ? emSpec.tint : [1, 1, 1, 1];
            const color = [
                colOverLife[0] * startCol[0] * (Number(emTint[0]) ?? 1),
                colOverLife[1] * startCol[1] * (Number(emTint[1]) ?? 1),
                colOverLife[2] * startCol[2] * (Number(emTint[2]) ?? 1),
                colOverLife[3] * startCol[3] * (Number(emTint[3]) ?? 1)
            ];

            alive.push({
                age, life, normAge,
                px, py, pz,
                vx: instVx, vy: instVy, vz: instVz,
                width, height,
                rotation: baseRot + angVel * age,
                color,
                seed: sp.seed
            });
            if (alive.length >= maxParticles) break;
        }
        return alive;
    }

    function disposeInstance(inst) {
        if (!inst) return;
        if (inst.group?.parent) inst.group.parent.remove(inst.group);
        inst.group?.traverse?.(obj => {
            if (obj.geometry && !obj.userData?.sharedGeometry) {
                try { obj.geometry.dispose(); } catch (_err) {}
            }
            if (obj.material) {
                const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
                for (const m of mats) {
                    try { m.dispose(); } catch (_err) {}
                }
            }
        });
    }

    function disposeAssetRecord(state, assetKey) {
        const rec = state.assets.get(assetKey);
        if (!rec) return;
        for (const [instKey, inst] of state.instances.entries()) {
            if (inst.assetKey === assetKey) {
                disposeInstance(inst);
                state.instances.delete(instKey);
            }
        }
        for (const tex of rec.textures.values()) {
            try { tex.dispose(); } catch (_err) {}
        }
        for (const geo of rec.meshes.values()) {
            try { geo.dispose(); } catch (_err) {}
        }
        state.assets.delete(assetKey);
    }

    function setOpenGlPlaneUvs(geo, u0 = 0, v0 = 0, u1 = 1, v1 = 1) {
        // Three.js PlaneGeometry vertices: 0=top-left, 1=top-right, 2=bottom-left, 3=bottom-right.
        // OpenGL / LumenFX convention (tex.flipY = false): v = v0 at top, v = v1 at bottom.
        const uvAttr = geo.getAttribute('uv');
        if (uvAttr && uvAttr.array.length >= 8) {
            uvAttr.array[0] = u0; uvAttr.array[1] = v0;
            uvAttr.array[2] = u1; uvAttr.array[3] = v0;
            uvAttr.array[4] = u0; uvAttr.array[5] = v1;
            uvAttr.array[6] = u1; uvAttr.array[7] = v1;
            uvAttr.needsUpdate = true;
        }
    }

    function renderInstanceAtTime(project, instanceKey, assetKey, diffSec, hostPose, scriptDirectives) {
        const root = ensureRoot();
        if (!root || typeof THREE === 'undefined') return 0;
        const state = getProjectState(project, false);
        if (!state) return 0;
        const record = state.assets.get(assetKey);
        if (!record) return 0;

        // Clean rebuild of instance meshes at deterministic diffSec (zero scrub-back drift, zero leak)
        const prev = state.instances.get(instanceKey);
        if (prev) {
            disposeInstance(prev);
            state.instances.delete(instanceKey);
        }

        if (diffSec < 0 || scriptDirectives?.stop) return 0;

        const group = new THREE.Group();
        group.name = `lumenfx_${instanceKey}`;
        group.position.copy(hostPose.position);
        if (scriptDirectives?.offset) {
            group.position.x += (scriptDirectives.offset[0] || 0) * SCALE;
            group.position.y += (scriptDirectives.offset[1] || 0) * SCALE;
            group.position.z += (scriptDirectives.offset[2] || 0) * SCALE;
        }
        if (scriptDirectives?.rotate !== false && hostPose.quaternion) {
            group.quaternion.copy(hostPose.quaternion);
        }
        const uniformScale = (scriptDirectives?.scale || 1.0) * SCALE;
        group.scale.set(uniformScale, uniformScale, uniformScale);

        const json = record.json;
        const materials = json.materials || {};
        const emitters = Array.isArray(json.emitters) ? json.emitters : [];
        const tint = scriptDirectives?.color || [1, 1, 1, 1];
        const baseSeed = scriptDirectives?.seed ?? 1337;
        const camera = typeof Preview !== 'undefined' ? Preview.selected?.camera : null;
        const camQuat = camera ? camera.getWorldQuaternion(new THREE.Quaternion()) : new THREE.Quaternion();
        const invGroupQuat = group.quaternion.clone().invert();
        const camForwardLocal = new THREE.Vector3(0, 0, -1).applyQuaternion(camQuat).applyQuaternion(invGroupQuat).normalize();
        const camRightLocal = new THREE.Vector3(1, 0, 0).applyQuaternion(camQuat).applyQuaternion(invGroupQuat).normalize();
        const glsl3 = THREE.GLSL3 || '300 es';
        const isWebGL2 = Boolean(getActiveRenderer()?.capabilities?.isWebGL2);

        let totalParticles = 0;

        // Render emitters (sprite, ribbon, beam, mesh)
        emitters.forEach((emSpec, emIdx) => {
            if (!emSpec || typeof emSpec !== 'object') return;
            const rendererType = String(emSpec.renderer || 'sprite').toLowerCase();
            const matSpec = materials[emSpec.material] || {};
            const baseMat = createMaterialForSpec(matSpec, record, diffSec);
            const sortOffset = Number.isFinite(Number(emSpec.sort_order)) ? Number(emSpec.sort_order) : 0;
            const particles = buildDeterministicParticles(emSpec, diffSec, baseSeed + emIdx * 7919);

            if (rendererType === 'beam') {
                const beamLen = Number(emSpec.beam_length || emSpec.height || 3.0);
                const segs = Math.max(2, Math.min(32, Number(emSpec.beam_segments) || 10));
                const noise = Number(emSpec.beam_noise) || 0.08;
                const width = Math.max(0.05, LumenFxSchema.evalScalarCurve(emSpec.width, 0, baseSeed + emIdx, 0.25));
                const beamColorSpec = emSpec.color_over_life !== undefined ? emSpec.color_over_life : emSpec.color;
                const col = LumenFxSchema.evalColorCurve(beamColorSpec, Math.min(1, diffSec / Math.max(0.1, Number(emSpec.duration) || 1)), baseSeed + emIdx);

                // Resolve end target from beam_end locator if provided
                const endLocal = new THREE.Vector3(0, beamLen, 0);
                if (scriptDirectives?.beamEnd && hostPose.resolveLocatorWorldPos) {
                    const targetWorld = hostPose.resolveLocatorWorldPos(scriptDirectives.beamEnd);
                    if (targetWorld) {
                        endLocal.copy(targetWorld).sub(group.position).applyQuaternion(invGroupQuat).divideScalar(uniformScale);
                    }
                }

                const positions = [];
                const uvs = [];
                const indices = [];
                const dir = endLocal.clone().normalize();
                const side = camForwardLocal.clone().cross(dir);
                if (side.lengthSq() < 1e-4) side.copy(camRightLocal);
                side.normalize().multiplyScalar(width * 0.5);

                for (let s = 0; s <= segs; s++) {
                    const u = s / segs;
                    const pt = endLocal.clone().multiplyScalar(u);
                    if (s > 0 && s < segs && noise > 0) {
                        pt.x += Math.sin(u * 12 + diffSec * 14) * noise;
                        pt.z += Math.cos(u * 10 + diffSec * 11) * noise;
                    }
                    positions.push(pt.x - side.x, pt.y - side.y, pt.z - side.z);
                    positions.push(pt.x + side.x, pt.y + side.y, pt.z + side.z);
                    uvs.push(0, u, 1, u);
                    if (s < segs) {
                        const b = s * 2;
                        indices.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
                    }
                }
                const geo = new THREE.BufferGeometry();
                geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
                geo.setIndex(indices);
                setMaterialTint(baseMat, col[0] * tint[0], col[1] * tint[1], col[2] * tint[2], col[3] * tint[3]);
                const mesh = new THREE.Mesh(geo, baseMat);
                mesh.renderOrder = (baseMat.userData.isAdd ? 4 : 2) + sortOffset;
                group.add(mesh);
                totalParticles += 1;
                return;
            }

            if (rendererType === 'ribbon' && particles.length >= 2) {
                particles.sort((a, b) => a.age - b.age);
                const positions = [];
                const uvs = [];
                const indices = [];
                const moveThresh = Number(emSpec.movement_threshold) || 8.0;
                const n = particles.length;
                for (let i = 0; i < n; i++) {
                    const p = particles[i];
                    const pPrev = particles[Math.max(0, i - 1)];
                    const pNext = particles[Math.min(n - 1, i + 1)];
                    const tangent = new THREE.Vector3(pNext.px - pPrev.px, pNext.py - pPrev.py, pNext.pz - pPrev.pz);
                    const side = camForwardLocal.clone().cross(tangent);
                    if (side.lengthSq() < 1e-6) side.copy(camRightLocal);
                    side.normalize().multiplyScalar(p.width * 0.5);

                    const u = i / (n - 1);
                    positions.push(p.px - side.x, p.py - side.y, p.pz - side.z);
                    positions.push(p.px + side.x, p.py + side.y, p.pz + side.z);
                    uvs.push(u, 0, u, 1);
                    if (i < n - 1) {
                        const nxt = particles[i + 1];
                        const dist = Math.hypot(nxt.px - p.px, nxt.py - p.py, nxt.pz - p.pz);
                        if (dist <= moveThresh) {
                            const b = i * 2;
                            indices.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
                        }
                    }
                }
                if (indices.length > 0) {
                    const geo = new THREE.BufferGeometry();
                    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
                    geo.setIndex(indices);
                    const midCol = particles[Math.floor(n * 0.5)].color;
                    setMaterialTint(baseMat, midCol[0] * tint[0], midCol[1] * tint[1], midCol[2] * tint[2], Math.max(0.15, midCol[3] * tint[3]));
                    const mesh = new THREE.Mesh(geo, baseMat);
                    mesh.renderOrder = (baseMat.userData.isAdd ? 4 : 2) + sortOffset;
                    group.add(mesh);
                    totalParticles += particles.length;
                } else {
                    baseMat.dispose();
                }
                return;
            }

            if (rendererType === 'mesh') {
                const assetRef = emSpec.mesh?.entries?.[0]?.asset || '';
                const sharedGeo = (assetRef && record.meshes.get(assetRef)) || null;
                const invOwner = (emSpec.scale_size_with_owner === false && scriptDirectives?.scale > 0)
                    ? (1 / scriptDirectives.scale)
                    : 1;
                for (const p of particles) {
                    const geo = sharedGeo || buildFallbackCrystalGeometry();
                    const mat = baseMat.clone();
                    setMaterialTint(mat, p.color[0] * tint[0], p.color[1] * tint[1], p.color[2] * tint[2], p.color[3] * tint[3]);
                    const mesh = new THREE.Mesh(geo, mat);
                    if (sharedGeo) mesh.userData.sharedGeometry = true;
                    mesh.position.set(p.px, p.py, p.pz);
                    // DirectGlEffectRenderer.meshParticleTransform: rotateZ(angle) then scale(sx, sy, sx)
                    mesh.scale.set(p.width * invOwner, p.height * invOwner, p.width * invOwner);
                    mesh.rotation.set(0, 0, p.rotation);
                    mesh.renderOrder = (baseMat.userData.isAdd ? 4 : 2) + sortOffset;
                    group.add(mesh);
                    totalParticles++;
                }
                baseMat.dispose();
                return;
            }

            // Default: sprite billboards (including stretched_billboard!)
            const cols = Math.max(1, Number(emSpec.atlas_columns) || 1);
            const rows = Math.max(1, Number(emSpec.atlas_rows) || 1);
            const stretched = Boolean(emSpec.stretched_billboard);
            const invOwnerSprite = (emSpec.scale_size_with_owner === false && scriptDirectives?.scale > 0)
                ? (1 / scriptDirectives.scale)
                : 1;
            const billboardQuat = camQuat.clone().premultiply(invGroupQuat);

            for (const p of particles) {
                let quadW = p.width * invOwnerSprite;
                let quadH = p.height * invOwnerSprite;
                let useStretchedBasis = false;
                let stretchMatrix = null;

                if (stretched) {
                    const spd = Math.hypot(p.vx, p.vy, p.vz);
                    if (spd > 1e-4) {
                        const upAxis = new THREE.Vector3(p.vx / spd, p.vy / spd, p.vz / spd);
                        const rightAxis = upAxis.clone().cross(camForwardLocal);
                        if (rightAxis.lengthSq() < 1e-6) rightAxis.copy(camRightLocal);
                        else rightAxis.normalize();
                        const fwdAxis = rightAxis.clone().cross(upAxis).normalize();
                        stretchMatrix = new THREE.Matrix4().makeBasis(rightAxis, upAxis, fwdAxis);
                        quadH = Math.max(quadH, spd * 0.15 * invOwnerSprite);
                        useStretchedBasis = true;
                    }
                }

                const geo = new THREE.PlaneGeometry(quadW, quadH);
                if (cols > 1 || rows > 1) {
                    const totalFrames = cols * rows;
                    const frame = Math.min(totalFrames - 1, Math.max(0, Math.floor(
                        LumenFxSchema.evalScalarCurve(emSpec.atlas_frame, p.normAge, p.seed + 51, p.normAge * totalFrames)
                    )));
                    const colIdx = frame % cols;
                    const rowIdx = emSpec.atlas_row !== undefined ? Number(emSpec.atlas_row) : Math.floor(frame / cols);
                    setOpenGlPlaneUvs(geo, colIdx / cols, rowIdx / rows, (colIdx + 1) / cols, (rowIdx + 1) / rows);
                } else {
                    setOpenGlPlaneUvs(geo, 0, 0, 1, 1);
                }

                const mat = baseMat.clone();
                setMaterialTint(mat, p.color[0] * tint[0], p.color[1] * tint[1], p.color[2] * tint[2], p.color[3] * tint[3]);
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.set(p.px, p.py, p.pz);
                if (useStretchedBasis && stretchMatrix) {
                    mesh.quaternion.setFromRotationMatrix(stretchMatrix);
                } else {
                    mesh.quaternion.copy(billboardQuat);
                    if (p.rotation) mesh.rotateZ(p.rotation);
                }
                mesh.renderOrder = (baseMat.userData.isAdd ? 4 : 2) + sortOffset;
                group.add(mesh);
                totalParticles++;
            }
            baseMat.dispose();
        });

        // Visual attachments: soft radial light halos, edge-faded volumes, decals
        const billboardQuat = camQuat.clone().premultiply(invGroupQuat);
        if (Array.isArray(json.lights)) {
            for (const lt of json.lights) {
                const pos = Array.isArray(lt.position) ? lt.position : [0, 0, 0];
                const col = Array.isArray(lt.color) ? lt.color : [1, 0.9, 0.6];
                const intensity = Math.min(0.85, Math.max(0.15, (Number(lt.intensity) || 0.5) * 0.55));
                const haloSize = Math.min(4.0, Math.max(0.6, (Number(lt.radius) || 4.0) * 0.22));
                const geo = new THREE.PlaneGeometry(haloSize, haloSize);
                let mat;
                if (isWebGL2) {
                    mat = new THREE.ShaderMaterial({
                        glslVersion: glsl3,
                        vertexShader: LIGHT_HALO_VERT,
                        fragmentShader: LIGHT_HALO_FRAG,
                        uniforms: {
                            uTint: {value: new THREE.Vector4(col[0] ?? 1, col[1] ?? 0.9, col[2] ?? 0.6, intensity)}
                        },
                        transparent: true,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false,
                        side: THREE.DoubleSide
                    });
                } else {
                    mat = new THREE.MeshBasicMaterial({
                        color: new THREE.Color(col[0] ?? 1, col[1] ?? 0.9, col[2] ?? 0.6),
                        transparent: true,
                        opacity: intensity * 0.4,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false
                    });
                }
                const halo = new THREE.Mesh(geo, mat);
                halo.position.set(pos[0] || 0, pos[1] || 0, pos[2] || 0);
                halo.quaternion.copy(billboardQuat);
                halo.renderOrder = 3;
                group.add(halo);
            }
        }
        if (Array.isArray(json.volumes)) {
            for (const vol of json.volumes) {
                const pos = Array.isArray(vol.position) ? vol.position : [0, 0, 0];
                const sz = Array.isArray(vol.size) ? vol.size : [1, 1, 1];
                const col = Array.isArray(vol.color) ? vol.color : [0.4, 0.8, 1];
                const density = Math.min(0.32, Math.max(0.04, Number(vol.density) || 0.14));
                const geo = new THREE.BoxGeometry(1, 1, 1);
                let mat;
                if (isWebGL2) {
                    mat = new THREE.ShaderMaterial({
                        glslVersion: glsl3,
                        vertexShader: VOLUME_FOG_VERT,
                        fragmentShader: VOLUME_FOG_FRAG,
                        uniforms: {
                            uTint: {value: new THREE.Vector4(col[0] ?? 0.4, col[1] ?? 0.8, col[2] ?? 1, density)},
                            uTime: {value: Number(diffSec) || 0}
                        },
                        transparent: true,
                        blending: THREE.AdditiveBlending,
                        depthWrite: false,
                        side: THREE.FrontSide
                    });
                } else {
                    mat = new THREE.MeshBasicMaterial({
                        color: new THREE.Color(col[0] ?? 0.4, col[1] ?? 0.8, col[2] ?? 1),
                        transparent: true,
                        opacity: density * 0.5,
                        depthWrite: false
                    });
                }
                const box = new THREE.Mesh(geo, mat);
                box.scale.set(sz[0] || 1, sz[1] || 1, sz[2] || 1);
                box.position.set(pos[0] || 0, pos[1] || 0, pos[2] || 0);
                box.renderOrder = 1;
                group.add(box);
            }
        }
        if (Array.isArray(json.decals)) {
            for (const dec of json.decals) {
                const pos = Array.isArray(dec.position) ? dec.position : [0, 0.02, 0];
                const sz = Array.isArray(dec.size) ? dec.size : [1, 1, 1];
                const col = Array.isArray(dec.color) ? dec.color : [1, 1, 1, 0.7];
                const geo = new THREE.PlaneGeometry(sz[0] || 1, sz[2] || 1);
                setOpenGlPlaneUvs(geo, 0, 0, 1, 1);
                const tex = dec.texture ? record.textures.get(dec.texture) : null;
                const mat = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(col[0] ?? 1, col[1] ?? 1, col[2] ?? 1),
                    map: tex || null,
                    transparent: true,
                    opacity: Math.min(1, col[3] ?? 0.7),
                    depthWrite: false,
                    polygonOffset: true,
                    polygonOffsetFactor: -1,
                    side: THREE.DoubleSide
                });
                const quad = new THREE.Mesh(geo, mat);
                quad.rotation.x = -Math.PI / 2;
                quad.position.set(pos[0] || 0, Math.max(0.015, pos[1] || 0.02), pos[2] || 0);
                quad.renderOrder = 1;
                group.add(quad);
            }
        }

        root.add(group);
        state.instances.set(instanceKey, {group, assetKey, lastTime: diffSec, particleCount: totalParticles});
        return totalParticles;
    }

    function reconcileAnimationInstances(project, animUuid, touchedKeys) {
        const state = getProjectState(project, false);
        if (!state) return;
        const prefix = `${animUuid}::`;
        for (const [k, inst] of state.instances.entries()) {
            if (k.startsWith(prefix) && !touchedKeys.has(k)) {
                disposeInstance(inst);
                state.instances.delete(k);
            }
        }
    }

    function detachProjectVisuals(project) {
        const state = getProjectState(project, false);
        if (!state) return;
        for (const inst of state.instances.values()) {
            if (inst.group?.parent) inst.group.parent.remove(inst.group);
        }
    }

    function disposeProjectState(project) {
        const id = getProjectId(project);
        const state = projectStates.get(id);
        if (!state) return;
        for (const inst of state.instances.values()) disposeInstance(inst);
        state.instances.clear();
        for (const assetKey of Array.from(state.assets.keys())) {
            disposeAssetRecord(state, assetKey);
        }
        projectStates.delete(id);
    }

    function disposeAll() {
        for (const id of Array.from(projectStates.keys())) {
            disposeProjectState({uuid: id});
        }
        shaderCompileVerdicts.clear();
        if (whiteFallbackTex) {
            try { whiteFallbackTex.dispose(); } catch (_err) {}
            whiteFallbackTex = null;
        }
        if (rootGroup) {
            if (rootGroup.parent) rootGroup.parent.remove(rootGroup);
            rootGroup = null;
        }
        if (typeof Canvas !== 'undefined' && Array.isArray(Canvas?.scene?.children)) {
            for (const child of Canvas.scene.children.slice()) {
                if (child && child.name === 'particlecue_lumenfx_space') {
                    Canvas.scene.remove(child);
                }
            }
        }
    }

    function getDiagnostics(project) {
        const state = getProjectState(project, false);
        let liveParticles = 0;
        let instanceCount = 0;
        let totalCompiledShaders = 0;
        const allShaderErrors = [];
        const assets = [];
        if (state) {
            instanceCount = state.instances.size;
            for (const inst of state.instances.values()) liveParticles += inst.particleCount || 0;
            for (const rec of state.assets.values()) {
                totalCompiledShaders += rec.compiledShaders.size;
                for (const err of rec.shaderErrors) allShaderErrors.push(`${rec.assetKey}: ${err}`);
                assets.push({
                    assetKey: rec.assetKey,
                    originKind: rec.meta.originKind,
                    renderers: rec.meta.renderers,
                    decodedMeshCount: rec.meshes.size,
                    loadedTextureCount: rec.textures.size,
                    loadedShaderCount: rec.shaders.size,
                    compiledShaderCount: rec.compiledShaders.size,
                    shaderErrors: rec.shaderErrors.slice()
                });
            }
        }
        return {
            assetCount: assets.length,
            instanceCount,
            liveParticles,
            compiledShaderCount: totalCompiledShaders,
            shaderErrors: allShaderErrors,
            totalTrackedProjects: projectStates.size,
            assets
        };
    }

    return {
        registerOrUpdateAsset,
        renderInstanceAtTime,
        reconcileAnimationInstances,
        detachProjectVisuals,
        disposeProjectState,
        disposeAll,
        getDiagnostics
    };
})();


/* === src/lumenfx/engine_override.js === */
const EngineOverride = (() => {
    /**
     * Lossless importer/override editor for LumenFX assets exported from Unity Shuriken UPM
     * or Unreal Engine 5 Niagara exporter / offline compiler.
     *
     * Preserves all unknown fields, compiled VectorVM bytecode (`spawn_program` / `update_program`),
     * SPIR-V compute shaders (`gpu_program`), SimCache bindings (`sim_cache` / `.lfsc`), and `.lfvf` references.
     */
    function inspectExportedAsset(rawText, filePath) {
        const meta = LumenFxSchema.inspect(rawText, filePath);
        if (!meta) return null;
        const json = meta.json;
        const emitters = Array.isArray(json.emitters) ? json.emitters : [];
        const niagaraEmitters = Array.isArray(json.niagara?.emitters) ? json.niagara.emitters : [];

        const preservedCompiledBlobs = [];
        if (json.niagara) {
            if (json.niagara.system_spawn) preservedCompiledBlobs.push('niagara.system_spawn');
            if (json.niagara.system_update) preservedCompiledBlobs.push('niagara.system_update');
            niagaraEmitters.forEach((ne, i) => {
                if (ne.spawn_program) preservedCompiledBlobs.push(`niagara.emitters[${i}].spawn_program`);
                if (ne.update_program) preservedCompiledBlobs.push(`niagara.emitters[${i}].update_program`);
                if (ne.gpu_program) preservedCompiledBlobs.push(`niagara.emitters[${i}].gpu_program`);
                if (ne.sim_cache) preservedCompiledBlobs.push(`niagara.emitters[${i}].sim_cache (${ne.sim_cache})`);
            });
        }
        emitters.forEach((em, i) => {
            if (em.sim_cache) preservedCompiledBlobs.push(`emitters[${i}].sim_cache (${em.sim_cache})`);
            if (em.gpu_program) preservedCompiledBlobs.push(`emitters[${i}].gpu_program`);
            if (em.shape?.unity) preservedCompiledBlobs.push(`emitters[${i}].shape.unity`);
        });

        return {
            originKind: meta.originKind,
            emitterCount: emitters.length + niagaraEmitters.length,
            materialCount: meta.materialCount,
            preservedCompiledBlobs,
            dependencies: meta.dependencies,
            editableOverrides: extractEditableSummary(json)
        };
    }

    function extractEditableSummary(json) {
        const firstEm = Array.isArray(json.emitters) ? json.emitters[0] : null;
        const firstMatName = json.materials ? Object.keys(json.materials)[0] : '';
        const firstMat = firstMatName ? json.materials[firstMatName] : null;
        const scaleVal = firstEm && typeof firstEm.width === 'number' ? firstEm.width : 1.0;
        const rateVal = firstEm && typeof firstEm.rate === 'number' ? firstEm.rate : (json.niagara?.emitters?.[0]?.explicit_spawn_rate ?? 0);
        return {
            primaryEmitterName: firstEm?.name || json.niagara?.emitters?.[0]?.name || '',
            primaryMaterialName: firstMatName,
            width: scaleVal,
            rate: rateVal,
            localSpace: firstEm ? Boolean(firstEm.local_space) : Boolean(json.niagara?.emitters?.[0]?.local_space),
            blend: firstMat?.blend || 'alpha',
            emissiveScale: Number(firstMat?.emissive_scale ?? 1.0),
            bloomIntensity: Number(firstMat?.bloom_intensity ?? 0.0),
            offset: Array.isArray(firstEm?.shape?.unity?.position) ? firstEm.shape.unity.position.slice() : [0, 0, 0]
        };
    }

    function applyOverridesLossless(rawText, overrides = {}) {
        const parsed = LumenFxSchema.safeParseJson(rawText);
        if (!parsed || typeof parsed !== 'object') {
            throw new Error('Invalid LumenFX JSON document for override write-back');
        }
        // Deep clone preserves EVERY unknown field, compiled VectorVM bytecode, SPIR-V ref, and .lfsc reference untouched!
        const doc = JSON.parse(JSON.stringify(parsed));

        // 1. Scale / rate / local_space / offset overrides on emitters
        if (Array.isArray(doc.emitters) && doc.emitters.length) {
            const targetIdx = typeof overrides.emitterIndex === 'number' ? overrides.emitterIndex : 0;
            const em = doc.emitters[targetIdx] || doc.emitters[0];
            if (em) {
                if (typeof overrides.scaleMultiplier === 'number' && Number.isFinite(overrides.scaleMultiplier) && overrides.scaleMultiplier > 0) {
                    if (typeof em.width === 'number') em.width = Number((em.width * overrides.scaleMultiplier).toFixed(4));
                    else if (em.width && typeof em.width === 'object') {
                        if (typeof em.width.min === 'number') em.width.min = Number((em.width.min * overrides.scaleMultiplier).toFixed(4));
                        if (typeof em.width.max === 'number') em.width.max = Number((em.width.max * overrides.scaleMultiplier).toFixed(4));
                    }
                    if (typeof em.height === 'number') em.height = Number((em.height * overrides.scaleMultiplier).toFixed(4));
                    else if (em.height && typeof em.height === 'object') {
                        if (typeof em.height.min === 'number') em.height.min = Number((em.height.min * overrides.scaleMultiplier).toFixed(4));
                        if (typeof em.height.max === 'number') em.height.max = Number((em.height.max * overrides.scaleMultiplier).toFixed(4));
                    }
                }
                if (typeof overrides.rate === 'number' && Number.isFinite(overrides.rate) && overrides.rate >= 0) {
                    em.rate = overrides.rate;
                }
                if (typeof overrides.localSpace === 'boolean') {
                    em.local_space = overrides.localSpace;
                }
                if (Array.isArray(overrides.offset) && overrides.offset.length === 3) {
                    if (!em.shape) em.shape = {type: 'point'};
                    if (em.shape.unity) {
                        em.shape.unity.position = overrides.offset.map(Number);
                    } else {
                        em.shape.offset = overrides.offset.map(Number);
                    }
                }
                if (Array.isArray(overrides.colorTint) && overrides.colorTint.length === 4) {
                    em.start_color = overrides.colorTint.map(Number);
                }
            }
        }

        // 2. Niagara emitter-level safe parameter overrides (preserves spawn_program, update_program, gpu_program, sim_cache)
        if (doc.niagara && Array.isArray(doc.niagara.emitters) && doc.niagara.emitters.length) {
            const targetIdx = typeof overrides.emitterIndex === 'number' ? overrides.emitterIndex : 0;
            const ne = doc.niagara.emitters[targetIdx] || doc.niagara.emitters[0];
            if (ne) {
                if (typeof overrides.rate === 'number' && Number.isFinite(overrides.rate) && overrides.rate >= 0) {
                    ne.explicit_spawn_rate = overrides.rate;
                }
                if (typeof overrides.localSpace === 'boolean') {
                    ne.local_space = overrides.localSpace;
                }
            }
        }

        // 3. Material overrides (blend, emissive_scale, bloom_intensity, parameters)
        if (doc.materials && typeof doc.materials === 'object') {
            const matKey = overrides.materialName || Object.keys(doc.materials)[0];
            const mat = matKey && doc.materials[matKey];
            if (mat && typeof mat === 'object') {
                if (typeof overrides.blend === 'string' && overrides.blend) mat.blend = overrides.blend;
                if (typeof overrides.emissiveScale === 'number' && Number.isFinite(overrides.emissiveScale)) {
                    mat.emissive_scale = overrides.emissiveScale;
                }
                if (typeof overrides.bloomIntensity === 'number' && Number.isFinite(overrides.bloomIntensity)) {
                    mat.bloom_intensity = overrides.bloomIntensity;
                }
                if (Array.isArray(overrides.materialParameters) && overrides.materialParameters.length === 4) {
                    mat.parameters = overrides.materialParameters.map(Number);
                }
            }
        }

        return JSON.stringify(doc, null, 2);
    }

    return {
        inspectExportedAsset,
        applyOverridesLossless
    };
})();


/* === src/lumenfx/photon_fx_adapter.js === */
const PhotonFxAdapter = (() => {
    // Minecraft NBT Tag IDs
    const TAG = {
        END: 0,
        BYTE: 1,
        SHORT: 2,
        INT: 3,
        LONG: 4,
        FLOAT: 5,
        DOUBLE: 6,
        BYTE_ARRAY: 7,
        STRING: 8,
        LIST: 9,
        COMPOUND: 10,
        INT_ARRAY: 11,
        LONG_ARRAY: 12
    };

    let cachedZlib = null;

    function zlibMod() {
        if (cachedZlib) return cachedZlib;
        cachedZlib = Platform.getNative('zlib');
        return cachedZlib;
    }

    function toUint8Array(input) {
        if (!input) return null;
        if (input instanceof Uint8Array) return input;
        if (input instanceof ArrayBuffer) return new Uint8Array(input);
        if (typeof Buffer !== 'undefined' && Buffer.isBuffer(input)) {
            return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
        }
        if (typeof input === 'string' && input.startsWith('PHOTON_FX_B64:')) {
            return Platform.base64ToUint8Array(input.slice('PHOTON_FX_B64:'.length));
        }
        return null;
    }

    function encodeBinaryString(bytes) {
        return `PHOTON_FX_B64:${Platform.bytesToBase64(bytes)}`;
    }

    function isGzip(bytes) {
        return bytes && bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
    }

    function gunzipIfNeeded(bytes) {
        const arr = toUint8Array(bytes);
        if (!arr || arr.length < 3) return null;
        if (!isGzip(arr)) return arr;
        const z = zlibMod();
        if (!z || typeof z.gunzipSync !== 'function') {
            throw new Error('Node zlib module is unavailable for Photon .fx decompression');
        }
        const buf = z.gunzipSync(Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength));
        return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
    }

    function gzipBytes(bytes) {
        const z = zlibMod();
        if (!z || typeof z.gzipSync !== 'function') {
            throw new Error('Node zlib module is unavailable for Photon .fx compression');
        }
        const buf = z.gzipSync(Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength));
        return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
    }

    // Lossless NBT AST Reader (preserves exact tag types & key order)
    function readNbt(rawBytes) {
        const bytes = gunzipIfNeeded(rawBytes);
        if (!bytes || bytes.length < 3) return null;
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        const decoder = new TextDecoder('utf-8');
        let offset = 0;

        const readByte = () => view.getInt8(offset++);
        const readUShort = () => { const v = view.getUint16(offset, false); offset += 2; return v; };
        const readShort = () => { const v = view.getInt16(offset, false); offset += 2; return v; };
        const readInt = () => { const v = view.getInt32(offset, false); offset += 4; return v; };
        const readFloat = () => { const v = view.getFloat32(offset, false); offset += 4; return v; };
        const readDouble = () => { const v = view.getFloat64(offset, false); offset += 8; return v; };
        const readLong = () => {
            const hi = view.getInt32(offset, false);
            const lo = view.getUint32(offset + 4, false);
            offset += 8;
            return {hi, lo};
        };
        const readString = () => {
            const len = readUShort();
            const slice = bytes.subarray(offset, offset + len);
            offset += len;
            return decoder.decode(slice);
        };

        const readPayload = (type) => {
            switch (type) {
                case TAG.BYTE: return {type, value: readByte()};
                case TAG.SHORT: return {type, value: readShort()};
                case TAG.INT: return {type, value: readInt()};
                case TAG.LONG: return {type, value: readLong()};
                case TAG.FLOAT: return {type, value: readFloat()};
                case TAG.DOUBLE: return {type, value: readDouble()};
                case TAG.STRING: return {type, value: readString()};
                case TAG.BYTE_ARRAY: {
                    const len = readInt();
                    const arr = new Int8Array(len);
                    for (let i = 0; i < len; i++) arr[i] = readByte();
                    return {type, value: Array.from(arr)};
                }
                case TAG.INT_ARRAY: {
                    const len = readInt();
                    const arr = [];
                    for (let i = 0; i < len; i++) arr.push(readInt());
                    return {type, value: arr};
                }
                case TAG.LONG_ARRAY: {
                    const len = readInt();
                    const arr = [];
                    for (let i = 0; i < len; i++) arr.push(readLong());
                    return {type, value: arr};
                }
                case TAG.LIST: {
                    const elemType = readByte();
                    const len = readInt();
                    const items = [];
                    for (let i = 0; i < len; i++) items.push(readPayload(elemType));
                    return {type, elemType, value: items};
                }
                case TAG.COMPOUND: {
                    const entries = {};
                    while (offset < bytes.length) {
                        const childType = readByte();
                        if (childType === TAG.END) break;
                        const name = readString();
                        entries[name] = readPayload(childType);
                    }
                    return {type, value: entries};
                }
                default:
                    throw new Error(`Unsupported NBT tag type: ${type}`);
            }
        };

        const rootType = readByte();
        if (rootType !== TAG.COMPOUND) return null;
        const rootName = readString();
        const rootValue = readPayload(TAG.COMPOUND);
        return {name: rootName, root: rootValue};
    }

    // Lossless NBT AST Writer (GZIP-compressed Minecraft NBT)
    function writeNbt(nbtDoc, compress = true) {
        const chunks = [];
        const encoder = new TextEncoder();

        const pushBytes = (arr) => chunks.push(arr);
        const pushByte = (v) => { const b = new Uint8Array(1); new DataView(b.buffer).setInt8(0, v); pushBytes(b); };
        const pushUShort = (v) => { const b = new Uint8Array(2); new DataView(b.buffer).setUint16(0, v, false); pushBytes(b); };
        const pushShort = (v) => { const b = new Uint8Array(2); new DataView(b.buffer).setInt16(0, v, false); pushBytes(b); };
        const pushInt = (v) => { const b = new Uint8Array(4); new DataView(b.buffer).setInt32(0, v, false); pushBytes(b); };
        const pushFloat = (v) => { const b = new Uint8Array(4); new DataView(b.buffer).setFloat32(0, v, false); pushBytes(b); };
        const pushDouble = (v) => { const b = new Uint8Array(8); new DataView(b.buffer).setFloat64(0, v, false); pushBytes(b); };
        const pushLong = (v) => {
            const b = new Uint8Array(8);
            const dv = new DataView(b.buffer);
            dv.setInt32(0, v?.hi || 0, false);
            dv.setUint32(4, v?.lo || 0, false);
            pushBytes(b);
        };
        const pushString = (s) => {
            const enc = encoder.encode(String(s ?? ''));
            pushUShort(enc.length);
            pushBytes(enc);
        };

        const writePayload = (node) => {
            switch (node.type) {
                case TAG.BYTE: pushByte(node.value); break;
                case TAG.SHORT: pushShort(node.value); break;
                case TAG.INT: pushInt(node.value); break;
                case TAG.LONG: pushLong(node.value); break;
                case TAG.FLOAT: pushFloat(node.value); break;
                case TAG.DOUBLE: pushDouble(node.value); break;
                case TAG.STRING: pushString(node.value); break;
                case TAG.BYTE_ARRAY:
                    pushInt(node.value.length);
                    for (const v of node.value) pushByte(v);
                    break;
                case TAG.INT_ARRAY:
                    pushInt(node.value.length);
                    for (const v of node.value) pushInt(v);
                    break;
                case TAG.LONG_ARRAY:
                    pushInt(node.value.length);
                    for (const v of node.value) pushLong(v);
                    break;
                case TAG.LIST:
                    pushByte(node.elemType ?? (node.value[0]?.type ?? TAG.END));
                    pushInt(node.value.length);
                    for (const item of node.value) writePayload(item);
                    break;
                case TAG.COMPOUND:
                    for (const [k, child] of Object.entries(node.value || {})) {
                        pushByte(child.type);
                        pushString(k);
                        writePayload(child);
                    }
                    pushByte(TAG.END);
                    break;
                default:
                    throw new Error(`Cannot write NBT tag type: ${node.type}`);
            }
        };

        pushByte(TAG.COMPOUND);
        pushString(nbtDoc.name || '');
        writePayload(nbtDoc.root);

        let total = 0;
        for (const c of chunks) total += c.length;
        const out = new Uint8Array(total);
        let pos = 0;
        for (const c of chunks) {
            out.set(c, pos);
            pos += c.length;
        }
        return compress ? gzipBytes(out) : out;
    }

    // Convenience AST constructors
    const nByte = (v) => ({type: TAG.BYTE, value: Number(v) ? 1 : 0});
    const nInt = (v) => ({type: TAG.INT, value: Math.round(Number(v) || 0)});
    const nFloat = (v) => ({type: TAG.FLOAT, value: Number(v) || 0});
    const nStr = (v) => ({type: TAG.STRING, value: String(v ?? '')});
    const nComp = (obj) => ({type: TAG.COMPOUND, value: obj || {}});
    const nList = (elemType, arr) => ({type: TAG.LIST, elemType, value: arr || []});

    function getVal(compNode, key, fallback) {
        const entry = compNode?.value?.[key];
        if (!entry) return fallback;
        return entry.value;
    }

    function isNumericTag(node) {
        return Boolean(node && (
            node.type === TAG.FLOAT
            || node.type === TAG.DOUBLE
            || node.type === TAG.INT
            || node.type === TAG.SHORT
            || node.type === TAG.BYTE
        ));
    }

    function unwrapNbtList(node) {
        if (!node) return null;
        if (node.type === TAG.LIST && Array.isArray(node.value)) return node.value;
        if (node.type === TAG.COMPOUND && node.value) {
            const p = node.value.payload || node.value.value || node.value.data || node.value.curves;
            if (p && p.type === TAG.LIST && Array.isArray(p.value)) return p.value;
        }
        return null;
    }

    function parsePhotonBezierSegments(curvesNode) {
        const list = unwrapNbtList(curvesNode);
        if (!list || !list.length) return [];
        const out = [];
        for (const item of list) {
            let pts = null;
            if (item?.type === TAG.LIST && Array.isArray(item.value)) {
                pts = item.value;
            } else if (item?.type === TAG.COMPOUND && item.value) {
                const cand = item.value.coords || item.value.data || item.value.points;
                if (cand?.type === TAG.LIST && Array.isArray(cand.value)) pts = cand.value;
            }
            if (pts && pts.length >= 8) {
                const f = (idx) => (isNumericTag(pts[idx]) ? Number(pts[idx].value) : 0);
                out.push({
                    p0x: f(0), p0y: f(1), c0x: f(2), c0y: f(3),
                    c1x: f(4), c1y: f(5), p1x: f(6), p1y: f(7)
                });
            }
        }
        return out;
    }

    function evalPhotonCurvesY(segments, x) {
        if (!segments.length) return 0;
        if (x < segments[0].p0x) return segments[0].p0y;
        for (const seg of segments) {
            if (x >= seg.p0x && x <= seg.p1x) {
                const dx = seg.p1x - seg.p0x;
                if (dx <= 0) return seg.p1y;
                const s = (x - seg.p0x) / dx;
                const u = 1 - s;
                return (u * u * u) * seg.p0y
                    + (3 * u * u * s) * seg.c0y
                    + (3 * u * s * s) * seg.c1y
                    + (s * s * s) * seg.p1y;
            }
        }
        return segments[segments.length - 1].p1y;
    }

    /**
     * Exact parity with LumenFX 0.3.2 `PhotonNumberFunction.java`:
     * supports `constant`, `random_constant` (`a`/`b` or `number1`/`number2`),
     * `curve` (`ECBCurves` 8-float cubic Bezier segments + `lower`/`upper`),
     * and `random_curve` (`curves0` + `curves1`).
     */
    function evaluateNumberFunction(node, t = 0, rand = 0.5, fallback = 0) {
        if (!node) return fallback;
        if (isNumericTag(node)) return Number(node.value);
        if (node.type !== TAG.COMPOUND || !node.value) return fallback;

        const m = node.value;
        if (isNumericTag(m.number)) return Number(m.number.value);

        const rawType = m.type?.type === TAG.STRING ? String(m.type.value).toLowerCase() : '';
        const d = (m.data?.type === TAG.COMPOUND && m.data.value) ? m.data.value : m;
        const ct = Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0));
        const cr = Math.max(0, Math.min(1, Number.isFinite(rand) ? rand : 0.5));

        if (isNumericTag(d.number) && !rawType.includes('curve') && !rawType.includes('random')) {
            return Number(d.number.value);
        }
        if (isNumericTag(d.a) && isNumericTag(d.b)) {
            const lo = Math.min(Number(d.a.value), Number(d.b.value));
            const hi = Math.max(Number(d.a.value), Number(d.b.value));
            return lo === hi ? hi : (lo + cr * (hi - lo));
        }
        if (isNumericTag(d.number1) && isNumericTag(d.number2)) {
            const lo = Math.min(Number(d.number1.value), Number(d.number2.value));
            const hi = Math.max(Number(d.number1.value), Number(d.number2.value));
            return lo === hi ? hi : (lo + cr * (hi - lo));
        }
        const hasCurves0 = Boolean(d.curves || d.curves0);
        const hasCurves1 = Boolean(d.curves1);
        if (hasCurves0 || hasCurves1) {
            const minVal = isNumericTag(d.min) ? Number(d.min.value) : 0;
            const maxVal = isNumericTag(d.max) ? Number(d.max.value) : 1;
            const lower = isNumericTag(d.lower) ? Number(d.lower.value) : minVal;
            const upper = isNumericTag(d.upper) ? Number(d.upper.value) : maxVal;
            const c0 = parsePhotonBezierSegments(d.curves0 || d.curves);
            const c1 = hasCurves1 ? parsePhotonBezierSegments(d.curves1) : [];
            if (c0.length && c1.length) {
                const y0 = evalPhotonCurvesY(c0, ct);
                const y1 = evalPhotonCurvesY(c1, ct);
                const y = y0 === y1 ? y0 : (Math.min(y0, y1) + cr * Math.abs(y0 - y1));
                return lower + (upper - lower) * y;
            }
            if (c0.length) return lower + (upper - lower) * evalPhotonCurvesY(c0, ct);
            if (c1.length) return lower + (upper - lower) * evalPhotonCurvesY(c1, ct);
            return 0.5 * (lower + upper);
        }
        if (isNumericTag(d.number)) return Number(d.number.value);
        if (isNumericTag(d.min) && isNumericTag(d.max)) {
            const lo = Math.min(Number(d.min.value), Number(d.max.value));
            const hi = Math.max(Number(d.min.value), Number(d.max.value));
            return lo === hi ? hi : (lo + cr * (hi - lo));
        }
        if (m.constant) return evaluateNumberFunction(m.constant, ct, cr, fallback);
        if (m.value) return evaluateNumberFunction(m.value, ct, cr, fallback);
        if (m.min) return evaluateNumberFunction(m.min, ct, cr, fallback);
        return fallback;
    }

    function readNumOrConst(node, fallback) {
        return evaluateNumberFunction(node, 0, 0.5, fallback);
    }

    function readColorRgba(node, fallback = [1, 1, 1, 1]) {
        const argb = Math.trunc(readNumOrConst(node, 0xFFFFFFFF));
        const a = ((argb >>> 24) & 0xFF) / 255;
        const r = ((argb >>> 16) & 0xFF) / 255;
        const g = ((argb >>> 8) & 0xFF) / 255;
        const b = (argb & 0xFF) / 255;
        return [r, g, b, a > 0 ? a : (fallback[3] ?? 1)];
    }

    function rgbaToArgbInt(rgba) {
        const a = Math.max(0, Math.min(255, Math.round((rgba[3] ?? 1) * 255)));
        const r = Math.max(0, Math.min(255, Math.round((rgba[0] ?? 1) * 255)));
        const g = Math.max(0, Math.min(255, Math.round((rgba[1] ?? 1) * 255)));
        const b = Math.max(0, Math.min(255, Math.round((rgba[2] ?? 1) * 255)));
        return ((a << 24) | (r << 16) | (g << 8) | b) | 0;
    }

    function canParse(rawInput, filePath) {
        if (typeof rawInput === 'string' && rawInput.startsWith('PHOTON_FX_B64:')) return true;
        if (typeof filePath === 'string' && filePath.toLowerCase().endsWith('.fx')) {
            if (rawInput instanceof Uint8Array || rawInput instanceof ArrayBuffer || (typeof Buffer !== 'undefined' && Buffer.isBuffer(rawInput))) {
                return true;
            }
            if (typeof rawInput === 'string' && rawInput.startsWith('PHOTON_FX_B64:')) return true;
        }
        const bytes = toUint8Array(rawInput);
        if (!bytes || bytes.length < 4) return false;
        try {
            const doc = readNbt(bytes);
            if (!doc?.root?.value) return false;
            return Boolean(doc.root.value.fxData || doc.root.value.fxObjects || doc.root.value.emitters);
        } catch (_err) {
            return false;
        }
    }

    function summarizeFxObjects(nbtDoc) {
        const rootMap = nbtDoc?.root?.value || {};
        const container = rootMap.fxData?.type === TAG.COMPOUND ? rootMap.fxData : nbtDoc.root;
        const listNode = container.value.fxObjects || container.value.emitters;
        const list = listNode?.type === TAG.LIST ? listNode.value : [];
        const objects = [];

        list.forEach((entry, idx) => {
            if (entry.type !== TAG.COMPOUND) return;
            const rawType = String(getVal(entry, 'type', getVal(entry, '_type', 'particle')) || 'particle').toLowerCase();
            const data = entry.value.data?.type === TAG.COMPOUND ? entry.value.data : entry;
            const config = data.value.config?.type === TAG.COMPOUND ? data.value.config : data;
            const name = String(getVal(data, 'name', `photon_${idx}`));
            const emission = config.value.emission?.type === TAG.COMPOUND ? config.value.emission : null;
            const emissionRatePerSec = emission
                ? readNumOrConst(emission.value.emissionRate, 0.5) * 20
                : readNumOrConst(config.value.emissionRate, 10);
            const durationSec = Math.max(0.05, readNumOrConst(config.value.duration, 100) / 20);
            const lifeSec = Math.max(0.05, readNumOrConst(config.value.startLifetime, 40) / 20);
            const startSpeed = readNumOrConst(config.value.startSpeed, 0.5);
            const startSize = Math.max(0.05, readNumOrConst(config.value.startSize, 0.6));
            const color = readColorRgba(config.value.startColor);
            const localSpace = String(getVal(config, 'simulationSpace', 'Local')).toLowerCase() !== 'world';
            const looping = Boolean(getVal(config, 'isLooping', getVal(config, 'looping', 1)));

            let texture = '';
            let blend = 'alpha';
            let modelLocation = '';
            const renderer = config.value.renderer?.type === TAG.COMPOUND ? config.value.renderer : null;
            if (renderer) {
                const matsPayload = renderer.value.materials?.value?.payload?.value;
                if (Array.isArray(matsPayload) && matsPayload[0]?.type === TAG.COMPOUND) {
                    const m0 = matsPayload[0];
                    const texVal = m0.value.material?.value?.data?.value?.texture?.value;
                    if (typeof texVal === 'string') texture = texVal;
                    const bm = m0.value.blendMode;
                    if (bm?.type === TAG.COMPOUND) {
                        const en = Boolean(getVal(bm, 'enableBlend', 1));
                        const dst = String(getVal(bm, 'dstColorFactor', 'ONE_MINUS_SRC_ALPHA')).toUpperCase();
                        if (!en) blend = 'opaque';
                        else if (dst === 'ONE') blend = 'additive';
                        else blend = 'alpha';
                    }
                }
                const mLoc = renderer.value.model?.value?.source?.value?.data?.value?.modelLocation?.value;
                if (typeof mLoc === 'string') modelLocation = mLoc;
            }

            const subEmittersList = config.value.subEmitters?.value?.payload?.value
                || config.value.subEmitters?.value
                || [];
            const subEmitters = Array.isArray(subEmittersList)
                ? subEmittersList
                    .filter(s => s?.type === TAG.COMPOUND)
                    .map(s => ({
                        trigger: String(getVal(s, 'trigger', 'birth')),
                        targetName: String(getVal(s, 'target', getVal(s, 'targetName', ''))),
                        spawnCount: Math.max(1, Math.round(readNumOrConst(s.value.count, 1)))
                    }))
                : [];

            objects.push({
                index: idx,
                name,
                type: rawType,
                localSpace,
                durationSec,
                looping,
                emissionRatePerSec,
                lifeSec,
                startSpeed,
                startSize,
                color,
                texture,
                blend,
                modelLocation,
                subEmitters,
                beamLength: readNumOrConst(config.value.beamLength, 4.0),
                beamSegments: Math.max(2, Math.round(readNumOrConst(config.value.beamSegments, 12)))
            });
        });

        return objects;
    }

    /**
     * Convert parsed Photon .fx objects into a LumenFX v1 JSON preview representation
     * so Blockbench viewport renders Photon particles, trails, beams, and meshes live!
     */
    function toLumenFxPreviewJson(nbtDoc, identifier) {
        const objs = summarizeFxObjects(nbtDoc);
        const materials = {};
        const emitters = [];

        objs.forEach((o, i) => {
            if (o.type === 'empty') return;
            const matKey = `photon_mat_${i}`;
            materials[matKey] = {
                fragment_shader: 'lumenfx:core/effect',
                blend: o.blend || 'alpha',
                depth_test: true,
                depth_write: o.blend === 'opaque',
                textures: o.texture ? {Sampler0: o.texture} : {}
            };

            const renderer = o.type === 'trail' ? 'ribbon'
                : (o.type === 'beam' ? 'beam' : (o.type === 'mesh' || o.modelLocation ? 'mesh' : 'sprite'));

            const em = {
                name: o.name,
                renderer,
                material: matKey,
                local_space: o.localSpace,
                duration: o.durationSec,
                loop: o.looping,
                rate: renderer === 'beam' ? 0 : Math.max(1, o.emissionRatePerSec),
                life: o.lifeSec,
                speed: o.startSpeed,
                width: o.startSize,
                height: o.startSize,
                start_color: o.color,
                shape: {type: 'sphere', radius: 0.25}
            };
            if (renderer === 'beam') {
                em.beam = {
                    start: [0, 0, 0],
                    end: [0, 0, o.beamLength || 4.0],
                    width: Math.max(0.1, o.startSize * 0.5),
                    segments: o.beamSegments || 12
                };
            }
            if (renderer === 'ribbon') {
                em.ribbon = {max_points: 16, min_segment_distance: 0.12};
            }
            emitters.push(em);
        });

        return {
            format_version: 1,
            name: identifier || 'photon_fx',
            materials,
            emitters
        };
    }

    function createPresetNbt(options = {}) {
        const name = String(options.name || 'photon_spark');
        const type = String(options.type || 'particle').toLowerCase();
        const ratePerTick = Number(options.emissionRatePerSec ?? 24) / 20;
        const lifeTicks = Math.round(Number(options.lifeSec ?? 1.2) * 20);
        const durationTicks = Math.round(Number(options.durationSec ?? 3.0) * 20);
        const colorInt = rgbaToArgbInt(Array.isArray(options.color) ? options.color : [0.35, 0.85, 1.0, 1.0]);
        const texture = String(options.texture || 'minecraft:textures/particle/glow.png');
        const blend = String(options.blend || 'additive').toLowerCase();
        const subTarget = options.subEmitterTarget || '';

        const configMap = {
            simulationSpace: nStr(options.localSpace === false ? 'World' : 'Local'),
            duration: nFloat(durationTicks),
            isLooping: nByte(options.looping !== false ? 1 : 0),
            startDelay: nFloat(0),
            maxParticles: nInt(512),
            emission: nComp({
                emissionRate: nFloat(ratePerTick),
                bursts: nComp({
                    payload: nList(TAG.COMPOUND, [])
                })
            }),
            startLifetime: nFloat(lifeTicks),
            startSpeed: nFloat(options.startSpeed ?? 2.4),
            startSize: nFloat(options.startSize ?? 0.45),
            startRotation: nFloat(0),
            startColor: nInt(colorInt),
            gravityModifier: nFloat(options.gravity ?? 0.0),
            drag: nFloat(options.drag ?? 0.15),
            hdr: nByte(blend === 'additive' ? 1 : 0),
            beamLength: nFloat(options.beamLength ?? 4.0),
            beamSegments: nInt(options.beamSegments ?? 12),
            renderer: nComp({
                renderMode: nStr(type === 'mesh' ? 'Model' : 'Billboard'),
                bloomEffect: nByte(blend === 'additive' ? 1 : 0),
                materials: nComp({
                    payload: nList(TAG.COMPOUND, [
                        nComp({
                            depthTest: nByte(1),
                            depthMask: nByte(blend === 'opaque' ? 1 : 0),
                            cull: nByte(0),
                            bloom: nByte(blend === 'additive' ? 1 : 0),
                            material: nComp({
                                data: nComp({
                                    texture: nStr(texture)
                                })
                            }),
                            blendMode: nComp({
                                enableBlend: nByte(blend === 'opaque' ? 0 : 1),
                                dstColorFactor: nStr(blend === 'additive' ? 'ONE' : 'ONE_MINUS_SRC_ALPHA')
                            })
                        })
                    ])
                })
            })
        };

        if (subTarget) {
            configMap.subEmitters = nComp({
                payload: nList(TAG.COMPOUND, [
                    nComp({
                        trigger: nStr('death'),
                        target: nStr(subTarget),
                        count: nInt(4)
                    })
                ])
            });
        }

        const fxObjects = [
            nComp({
                type: nStr(type),
                data: nComp({
                    name: nStr(name),
                    transform: nComp({
                        id: nStr(`${name}_root`),
                        position: nList(TAG.FLOAT, [nFloat(0), nFloat(0), nFloat(0)]),
                        scale: nList(TAG.FLOAT, [nFloat(1), nFloat(1), nFloat(1)])
                    }),
                    config: nComp(configMap)
                })
            })
        ];

        if (subTarget) {
            fxObjects.push(nComp({
                type: nStr('particle'),
                data: nComp({
                    name: nStr(subTarget),
                    config: nComp({
                        simulationSpace: nStr('World'),
                        duration: nFloat(40),
                        isLooping: nByte(0),
                        startLifetime: nFloat(16),
                        startSpeed: nFloat(1.6),
                        startSize: nFloat(0.25),
                        startColor: nInt(rgbaToArgbInt([1.0, 0.75, 0.25, 1.0])),
                        emission: nComp({emissionRate: nFloat(0.6)})
                    })
                })
            }));
        }

        return {
            name: '',
            root: nComp({
                fxData: nComp({
                    fxObjects: nList(TAG.COMPOUND, fxObjects)
                })
            })
        };
    }

    /**
     * Losslessly edit supported emitter parameters inside an existing Photon `.fx` NBT AST,
     * keeping all untouched/unknown NBT tags intact!
     */
    function applyEditsLossless(rawBytesOrEncoded, objectIndex, edits = {}) {
        const bytes = toUint8Array(rawBytesOrEncoded);
        const doc = readNbt(bytes);
        if (!doc) throw new Error('Invalid Photon .fx binary NBT payload');

        const rootMap = doc.root.value;
        const container = rootMap.fxData?.type === TAG.COMPOUND ? rootMap.fxData : doc.root;
        const listNode = container.value.fxObjects || container.value.emitters;
        if (!listNode || listNode.type !== TAG.LIST || !listNode.value[objectIndex]) {
            throw new Error(`Photon .fx object index out of range: ${objectIndex}`);
        }

        const entry = listNode.value[objectIndex];
        const data = entry.value.data?.type === TAG.COMPOUND ? entry.value.data : entry;
        const config = data.value.config?.type === TAG.COMPOUND ? data.value.config : data;

        if (typeof edits.name === 'string' && edits.name.trim()) {
            data.value.name = nStr(edits.name.trim());
        }
        if (typeof edits.emissionRatePerSec === 'number' && Number.isFinite(edits.emissionRatePerSec)) {
            if (config.value.emission?.type === TAG.COMPOUND) {
                config.value.emission.value.emissionRate = nFloat(edits.emissionRatePerSec / 20);
            } else {
                config.value.emissionRate = nFloat(edits.emissionRatePerSec);
            }
        }
        if (typeof edits.lifeSec === 'number' && Number.isFinite(edits.lifeSec)) {
            config.value.startLifetime = nFloat(edits.lifeSec * 20);
        }
        if (typeof edits.durationSec === 'number' && Number.isFinite(edits.durationSec)) {
            config.value.duration = nFloat(edits.durationSec * 20);
        }
        if (typeof edits.startSpeed === 'number' && Number.isFinite(edits.startSpeed)) {
            config.value.startSpeed = nFloat(edits.startSpeed);
        }
        if (typeof edits.startSize === 'number' && Number.isFinite(edits.startSize)) {
            config.value.startSize = nFloat(edits.startSize);
        }
        if (typeof edits.localSpace === 'boolean') {
            config.value.simulationSpace = nStr(edits.localSpace ? 'Local' : 'World');
        }
        if (typeof edits.looping === 'boolean') {
            config.value.isLooping = nByte(edits.looping ? 1 : 0);
        }
        if (Array.isArray(edits.color) && edits.color.length >= 3) {
            config.value.startColor = nInt(rgbaToArgbInt(edits.color));
        }
        if (typeof edits.texture === 'string' && edits.texture.trim()) {
            const payload = config.value.renderer?.value?.materials?.value?.payload?.value;
            if (Array.isArray(payload) && payload[0]?.value?.material?.value?.data?.type === TAG.COMPOUND) {
                payload[0].value.material.value.data.value.texture = nStr(edits.texture.trim());
            }
        }
        if (typeof edits.blend === 'string' && edits.blend) {
            const payload = config.value.renderer?.value?.materials?.value?.payload?.value;
            if (Array.isArray(payload) && payload[0]?.type === TAG.COMPOUND) {
                const b = edits.blend.toLowerCase();
                payload[0].value.blendMode = nComp({
                    enableBlend: nByte(b === 'opaque' ? 0 : 1),
                    dstColorFactor: nStr(b === 'additive' ? 'ONE' : 'ONE_MINUS_SRC_ALPHA')
                });
            }
        }
        if (edits.addSubEmitter && typeof edits.addSubEmitter === 'object') {
            if (!config.value.subEmitters) {
                config.value.subEmitters = nComp({payload: nList(TAG.COMPOUND, [])});
            }
            const subList = config.value.subEmitters.value?.payload;
            if (subList && subList.type === TAG.LIST) {
                subList.value.push(nComp({
                    trigger: nStr(edits.addSubEmitter.trigger || 'death'),
                    target: nStr(edits.addSubEmitter.targetName || 'sub_burst'),
                    count: nInt(edits.addSubEmitter.spawnCount || 4)
                }));
            }
        }

        const outBytes = writeNbt(doc, true);
        return {
            bytes: outBytes,
            encoded: encodeBinaryString(outBytes),
            nbtDoc: doc
        };
    }

    function inspect(rawInput, filePath) {
        const bytes = toUint8Array(rawInput);
        if (!bytes) return null;
        let doc;
        try {
            doc = readNbt(bytes);
        } catch (_err) {
            return null;
        }
        if (!doc) return null;

        const identifier = Platform.basename(filePath || 'effect.fx').replace(/\.fx$/i, '');
        const objects = summarizeFxObjects(doc);
        const previewLumenFx = toLumenFxPreviewJson(doc, identifier);
        const primaryTexture = objects.find(o => o.texture)?.texture || '';

        return {
            format: 'photon_fx',
            identifier,
            objects,
            objectCount: objects.length,
            textureRef: primaryTexture,
            isBuiltinTexture: !primaryTexture || primaryTexture.startsWith('minecraft:'),
            nbtDoc: doc,
            previewLumenFx,
            rawText: encodeBinaryString(bytes),
            rawBytes: bytes
        };
    }

    function registerFormat() {
        FormatRegistry.register({
            id: 'photon_fx',
            label: 'Photon .fx (GZIP NBT)',
            extensions: ['.fx'],
            canParse,
            inspect
        });
    }

    return {
        TAG,
        toUint8Array,
        encodeBinaryString,
        readNbt,
        writeNbt,
        evaluateNumberFunction,
        canParse,
        inspect,
        summarizeFxObjects,
        toLumenFxPreviewJson,
        createPresetNbt,
        applyEditsLossless,
        registerFormat
    };
})();


/* === src/kbr/kbr_model_schema.js === */
const KbrModelSchema = (() => {
    const MODEL_PARTICLE_TYPE = 'kltyton_bedrock_runtime:model_particle';
    const MODEL_APPEARANCE_KEYS = [
        'kltyton_bedrock_runtime:model_appearance',
        'thr_dim_particle:appearance'
    ];
    const VALID_VARIANTS = ['geometry', 'geckolib', 'poly_mesh', 'hardcode'];
    const VALID_MATERIALS = ['solid', 'cutout', 'cutout_mipped', 'translucent'];

    function safeParseJson(rawText) {
        if (typeof rawText === 'object' && rawText !== null) return rawText;
        if (typeof rawText !== 'string' || !rawText.trim()) return null;
        try {
            return JSON.parse(rawText);
        } catch (_err) {
            try {
                const stripped = rawText
                    .replace(/\/\*[\s\S]*?\*\//g, '')
                    .replace(/^\s*\/\/.*$/gm, '');
                return JSON.parse(stripped);
            } catch (_err2) {
                return null;
            }
        }
    }

    function getModelAppearance(json) {
        const comps = json?.particle_effect?.components;
        if (!comps || typeof comps !== 'object') return null;
        for (const key of MODEL_APPEARANCE_KEYS) {
            if (comps[key] && typeof comps[key] === 'object') {
                return {key, value: comps[key]};
            }
        }
        return null;
    }

    function canParse(rawText, filePath) {
        const json = safeParseJson(rawText);
        if (!json || typeof json !== 'object') return false;
        const pe = json.particle_effect;
        if (!pe || typeof pe !== 'object') return false;
        const descType = String(pe.description?.type || '').trim().toLowerCase();
        if (descType === MODEL_PARTICLE_TYPE) return true;
        if (getModelAppearance(json)) return true;
        if (typeof filePath === 'string' && /particle_definitions[\\/]/i.test(filePath) && descType.includes('model_particle')) {
            return true;
        }
        return false;
    }

    function normalizeVariant(raw) {
        const v = String(raw || 'geometry').trim().toLowerCase();
        if (v === 'hardcode' || v === 'hardcoded' || v === 'modelpart') return 'hardcode';
        if (v === 'geckolib' || v === 'gecko') return 'geckolib';
        if (v === 'poly_mesh' || v === 'polymesh' || v === 'mesh') return 'poly_mesh';
        return 'geometry';
    }

    function normalizeMaterial(raw) {
        const m = String(raw || 'solid').trim().toLowerCase();
        if (VALID_MATERIALS.includes(m)) return m;
        if (m === 'alpha' || m === 'blend') return 'translucent';
        return 'solid';
    }

    function parseDescriptor(rawTextOrObj) {
        const json = safeParseJson(rawTextOrObj);
        if (!json || typeof json !== 'object') return null;
        const modelId = String(json.model_id || '').trim();
        if (!modelId) return null;
        return {
            variant: normalizeVariant(json.variant),
            model_id: modelId,
            texture: String(json.texture || '').trim(),
            material: normalizeMaterial(json.material),
            double_sided: Boolean(json.double_sided),
            raw: json
        };
    }

    function parseNamespacedId(id, defaultNs = 'minecraft') {
        const clean = String(id || '').trim();
        if (!clean) return null;
        const idx = clean.indexOf(':');
        return {
            namespace: idx > 0 ? clean.slice(0, idx) : defaultNs,
            path: (idx > 0 ? clean.slice(idx + 1) : clean).replace(/^\/+/, '')
        };
    }

    function collectCandidateRoots(sourceFilePath, extraRoots = []) {
        const roots = [];
        const add = (r) => {
            if (!r || Platform.isVirtualPath(r)) return;
            const norm = Platform.normalizeFsPath(r);
            if (!roots.includes(norm)) roots.push(norm);
        };
        if (sourceFilePath && !Platform.isVirtualPath(sourceFilePath)) {
            const posix = Platform.toPosixPath(sourceFilePath);
            const segs = posix.split('/');
            const assetsIdx = segs.lastIndexOf('assets');
            if (assetsIdx > 0) add(segs.slice(0, assetsIdx).join('/'));
            let cur = Platform.dirname(sourceFilePath);
            for (let i = 0; i < 6; i++) {
                add(cur);
                const parent = Platform.dirname(cur);
                if (!parent || parent === cur) break;
                cur = parent;
            }
        }
        for (const r of extraRoots) add(r);
        return roots;
    }

    function resolveDescriptorOnDisk(modelRef, sourceFilePath, extraRoots = []) {
        const parsed = parseNamespacedId(modelRef, 'kltyton_bedrock_runtime');
        if (!parsed) return null;
        const subPath = parsed.path.endsWith('.json') ? parsed.path : `${parsed.path}.json`;
        const roots = collectCandidateRoots(sourceFilePath, extraRoots);
        for (const root of roots) {
            const packPath = Platform.joinPath(root, 'assets', parsed.namespace, 'particle_models', subPath);
            if (Platform.fileExists(packPath)) return packPath;
            const flatPath = Platform.joinPath(root, 'particle_models', subPath);
            if (Platform.fileExists(flatPath)) return flatPath;
            const baseOnly = Platform.joinPath(root, Platform.basename(subPath));
            if (Platform.fileExists(baseOnly)) return baseOnly;
        }
        return null;
    }

    function resolveGeometryFileOnDisk(descriptor, descriptorOrDefPath, extraRoots = []) {
        if (!descriptor || descriptor.variant === 'hardcode') return null;
        const parsed = parseNamespacedId(descriptor.model_id, 'minecraft');
        if (!parsed) return null;
        const roots = collectCandidateRoots(descriptorOrDefPath, extraRoots);
        const rawPath = parsed.path;

        const candidatesRel = [];
        if (descriptor.variant === 'geometry') {
            const stripped = rawPath.replace(/^models\//, '').replace(/\.json$/i, '');
            candidatesRel.push(`assets/${parsed.namespace}/models/${stripped}.json`);
            candidatesRel.push(`models/${stripped}.json`);
        } else {
            // geckolib or poly_mesh
            const withGeo = rawPath.endsWith('.json') ? rawPath : `${rawPath}.geo.json`;
            const withJson = rawPath.endsWith('.json') ? rawPath : `${rawPath}.json`;
            candidatesRel.push(`assets/${parsed.namespace}/${withGeo}`);
            candidatesRel.push(`assets/${parsed.namespace}/geo/${withGeo}`);
            candidatesRel.push(`assets/${parsed.namespace}/models/${withGeo}`);
            candidatesRel.push(`assets/${parsed.namespace}/${withJson}`);
            candidatesRel.push(`geo/${withGeo}`);
            candidatesRel.push(`models/${withGeo}`);
        }
        for (const root of roots) {
            for (const rel of candidatesRel) {
                const full = Platform.joinPath(root, rel);
                if (Platform.fileExists(full)) return full;
            }
            const base = Platform.joinPath(root, Platform.basename(candidatesRel[0]));
            if (Platform.fileExists(base)) return base;
        }
        return null;
    }

    function resolveTextureOnDisk(textureRef, sourceFilePath, extraRoots = []) {
        if (!textureRef) return null;
        const parsed = parseNamespacedId(textureRef, 'minecraft');
        if (!parsed) return null;
        let p = parsed.path;
        if (!p.startsWith('textures/')) p = `textures/${p}`;
        if (!/\.(png|jpg|jpeg|webp|tga)$/i.test(p)) p += '.png';
        const roots = collectCandidateRoots(sourceFilePath, extraRoots);
        for (const root of roots) {
            const packPath = Platform.joinPath(root, 'assets', parsed.namespace, p);
            if (Platform.fileExists(packPath)) return packPath;
            const relPath = Platform.joinPath(root, p);
            if (Platform.fileExists(relPath)) return relPath;
            const baseOnly = Platform.joinPath(root, Platform.basename(p));
            if (Platform.fileExists(baseOnly)) return baseOnly;
        }
        return null;
    }

    function collectReferencedModels(appearance) {
        const refs = [];
        const add = (m) => {
            if (typeof m === 'string' && m.trim() && !refs.includes(m.trim())) {
                refs.push(m.trim());
            }
        };
        if (!appearance || typeof appearance !== 'object') return refs;
        add(appearance.model);
        const frames = appearance.model_animation?.type_frames;
        const walkFrame = (entry) => {
            if (typeof entry === 'string') {
                add(entry);
            } else if (Array.isArray(entry)) {
                entry.forEach(walkFrame);
            } else if (entry && typeof entry === 'object') {
                add(entry.model_type || entry.model || entry.model_id);
            }
        };
        if (frames !== undefined) walkFrame(frames);
        return refs;
    }

    function inspect(rawText, filePath, extraRoots = []) {
        const json = safeParseJson(rawText);
        if (!canParse(json, filePath)) return null;
        const pe = json.particle_effect;
        const desc = pe.description || {};
        const appearanceEntry = getModelAppearance(json);
        const appearance = appearanceEntry?.value || {};
        const modelRefs = collectReferencedModels(appearance);

        const descriptors = [];
        const missingDependencies = [];
        let primaryTextureRef = desc.basic_render_parameters?.texture || '';
        let primaryTexturePath = '';

        for (const mRef of modelRefs) {
            const descPath = resolveDescriptorOnDisk(mRef, filePath, extraRoots);
            let parsedDesc = null;
            let rawDescText = '';
            let geomPath = '';
            let texPath = '';

            if (descPath) {
                rawDescText = Platform.readTextFile(descPath) || '';
                parsedDesc = parseDescriptor(rawDescText);
            }
            if (parsedDesc) {
                if (parsedDesc.variant !== 'hardcode') {
                    geomPath = resolveGeometryFileOnDisk(parsedDesc, descPath || filePath, extraRoots) || '';
                    if (!geomPath) {
                        missingDependencies.push({type: 'kbr_geometry', ref: parsedDesc.model_id, owner: mRef});
                    }
                }
                if (parsedDesc.texture) {
                    texPath = resolveTextureOnDisk(parsedDesc.texture, descPath || filePath, extraRoots) || '';
                    if (!primaryTextureRef) {
                        primaryTextureRef = parsedDesc.texture;
                        primaryTexturePath = texPath;
                    }
                    if (!texPath && !parsedDesc.texture.startsWith('minecraft:')) {
                        missingDependencies.push({type: 'texture', ref: parsedDesc.texture, owner: mRef});
                    }
                }
            } else {
                missingDependencies.push({type: 'kbr_model_descriptor', ref: mRef});
            }

            descriptors.push({
                ref: mRef,
                descriptorPath: descPath || '',
                descriptorRawText: rawDescText,
                descriptor: parsedDesc,
                geometryPath: geomPath,
                texturePath: texPath,
                isHardcode: Boolean(parsedDesc && parsedDesc.variant === 'hardcode')
            });
        }

        const isBuiltinTex = !primaryTextureRef || primaryTextureRef.startsWith('minecraft:') || primaryTextureRef.startsWith('textures/particle/particles');

        return {
            format: 'kbr_3d_particle',
            identifier: String(desc.identifier || '').trim() || Platform.basename(filePath || 'kbr_particle').replace(/\.json$/i, ''),
            particleType: String(desc.type || MODEL_PARTICLE_TYPE),
            appearanceKey: appearanceEntry?.key || MODEL_APPEARANCE_KEYS[0],
            appearance,
            modelRefs,
            descriptors,
            textureRef: primaryTextureRef,
            texturePath: primaryTexturePath,
            isBuiltinTexture: isBuiltinTex,
            missingDependencies,
            json,
            rawText: typeof rawText === 'string' ? rawText : JSON.stringify(json, null, 2)
        };
    }

    function validateModelJsonForVariant(modelJson, variant) {
        const v = normalizeVariant(variant || 'geckolib');
        if (v === 'hardcode') {
            return {ok: true, reason: ''};
        }
        if (!modelJson || typeof modelJson !== 'object') {
            return {ok: false, reason: `Variant "${v}" has no companion model JSON loaded.`};
        }
        const hasElements = Array.isArray(modelJson.elements) && modelJson.elements.length > 0;
        const geos = Array.isArray(modelJson['minecraft:geometry']) ? modelJson['minecraft:geometry'] : [];
        let hasCubes = false;
        let hasPolyMesh = false;
        for (const g of geos) {
            for (const b of (Array.isArray(g?.bones) ? g.bones : [])) {
                if (Array.isArray(b?.cubes) && b.cubes.length > 0) hasCubes = true;
                if (b?.poly_mesh && Array.isArray(b.poly_mesh.positions) && Array.isArray(b.poly_mesh.polys) && b.poly_mesh.polys.length > 0) {
                    hasPolyMesh = true;
                }
            }
        }

        if (v === 'geometry') {
            if (hasElements) return {ok: true, reason: ''};
            if (geos.length) {
                return {ok: false, reason: 'Model format mismatch: variant "geometry" expects vanilla Minecraft elements[], but model contains Bedrock/GeckoLib "minecraft:geometry".'};
            }
            return {ok: false, reason: 'Model format mismatch: variant "geometry" requires non-empty vanilla Minecraft elements[].'};
        }
        if (v === 'geckolib') {
            if (hasCubes) return {ok: true, reason: ''};
            if (hasElements) {
                return {ok: false, reason: 'Model format mismatch: variant "geckolib" expects "minecraft:geometry" bones[].cubes[], but model contains vanilla elements[].'};
            }
            if (hasPolyMesh) {
                return {ok: false, reason: 'Model format mismatch: variant "geckolib" expects cube geometry, but model contains poly_mesh data.'};
            }
            return {ok: false, reason: 'Model format mismatch: variant "geckolib" requires "minecraft:geometry" with cubes[].'};
        }
        if (v === 'poly_mesh') {
            if (hasPolyMesh) return {ok: true, reason: ''};
            if (hasCubes) {
                return {ok: false, reason: 'Model format mismatch: variant "poly_mesh" expects bones[].poly_mesh, but model contains GeckoLib cubes[].'};
            }
            if (hasElements) {
                return {ok: false, reason: 'Model format mismatch: variant "poly_mesh" expects bones[].poly_mesh, but model contains vanilla elements[].'};
            }
            return {ok: false, reason: 'Model format mismatch: variant "poly_mesh" requires "minecraft:geometry" with poly_mesh.'};
        }
        return {ok: true, reason: ''};
    }

    /**
     * Build a Three.js BufferGeometry from either:
     * - Minecraft vanilla block/item model JSON (`elements[]`) -> KBR variant `geometry`
     * - Bedrock / GeckoLib `.geo.json` (`minecraft:geometry[].bones[].cubes[]` or `poly_mesh`) -> KBR variants `geckolib` / `poly_mesh`
     */
    function buildGeometryFromModelJson(modelJson, variant) {
        if (!modelJson || typeof modelJson !== 'object' || typeof THREE === 'undefined') return null;
        const normVariant = variant ? normalizeVariant(variant) : '';
        if (normVariant === 'hardcode') return null;
        const positions = [];
        const normals = [];
        const uvs = [];
        const indices = [];

        const pushQuad = (v0, v1, v2, v3, n, uv0, uv1, uv2, uv3) => {
            const base = positions.length / 3;
            positions.push(...v0, ...v1, ...v2, ...v3);
            normals.push(...n, ...n, ...n, ...n);
            uvs.push(...uv0, ...uv1, ...uv2, ...uv3);
            indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
        };

        const pushBox = (x0, y0, z0, x1, y1, z1, texW = 16, texH = 16, uvOrigin = [0, 0]) => {
            const u0 = (uvOrigin[0] || 0) / Math.max(1, texW);
            const v0 = 1 - (uvOrigin[1] || 0) / Math.max(1, texH);
            const u1 = Math.min(1, u0 + Math.abs(x1 - x0) * 16 / Math.max(1, texW));
            const v1 = Math.max(0, v0 - Math.abs(y1 - y0) * 16 / Math.max(1, texH));
            // +Z front
            pushQuad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1], [u0, v1], [u1, v1], [u1, v0], [u0, v0]);
            // -Z back
            pushQuad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [0, 0, -1], [u0, v1], [u1, v1], [u1, v0], [u0, v0]);
            // +Y top
            pushQuad([x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0], [0, 1, 0], [u0, v1], [u1, v1], [u1, v0], [u0, v0]);
            // -Y bottom
            pushQuad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], [0, -1, 0], [u0, v1], [u1, v1], [u1, v0], [u0, v0]);
            // +X right
            pushQuad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [1, 0, 0], [u0, v1], [u1, v1], [u1, v0], [u0, v0]);
            // -X left
            pushQuad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [-1, 0, 0], [u0, v1], [u1, v1], [u1, v0], [u0, v0]);
        };

        // 1. Minecraft vanilla JSON model (`elements`) -> strictly for `geometry` (or unspecified variant)
        if ((!normVariant || normVariant === 'geometry') && Array.isArray(modelJson.elements) && modelJson.elements.length) {
            const texSize = Array.isArray(modelJson.texture_size) ? modelJson.texture_size : [16, 16];
            for (const el of modelJson.elements) {
                if (!Array.isArray(el.from) || !Array.isArray(el.to)) continue;
                // Center around block center (8, 8, 8) and convert to blocks (/16)
                const x0 = (el.from[0] - 8) / 16;
                const y0 = (el.from[1] - 8) / 16;
                const z0 = (el.from[2] - 8) / 16;
                const x1 = (el.to[0] - 8) / 16;
                const y1 = (el.to[1] - 8) / 16;
                const z1 = (el.to[2] - 8) / 16;
                pushBox(x0, y0, z0, x1, y1, z1, texSize[0], texSize[1], [0, 0]);
            }
        }

        // 2. Bedrock / GeckoLib .geo.json (`minecraft:geometry`) -> strictly for `geckolib` or `poly_mesh` (or unspecified)
        const geos = Array.isArray(modelJson['minecraft:geometry']) ? modelJson['minecraft:geometry'] : [];
        if (geos.length && (!normVariant || normVariant === 'geckolib' || normVariant === 'poly_mesh')) {
            const g0 = geos[0];
            const texW = Number(g0.description?.texture_width) || 16;
            const texH = Number(g0.description?.texture_height) || 16;
            const bones = Array.isArray(g0.bones) ? g0.bones : [];
            for (const bone of bones) {
                if ((!normVariant || normVariant === 'geckolib') && Array.isArray(bone.cubes)) {
                    for (const cube of bone.cubes) {
                        const o = Array.isArray(cube.origin) ? cube.origin : [0, 0, 0];
                        const s = Array.isArray(cube.size) ? cube.size : [1, 1, 1];
                        const inf = Number(cube.inflate) || 0;
                        const x0 = (o[0] - inf) / 16;
                        const y0 = (o[1] - inf) / 16;
                        const z0 = (o[2] - inf) / 16;
                        const x1 = (o[0] + s[0] + inf) / 16;
                        const y1 = (o[1] + s[1] + inf) / 16;
                        const z1 = (o[2] + s[2] + inf) / 16;
                        const uvOrig = Array.isArray(cube.uv) ? cube.uv : [0, 0];
                        pushBox(x0, y0, z0, x1, y1, z1, texW, texH, uvOrig);
                    }
                }
                if ((!normVariant || normVariant === 'poly_mesh') && bone.poly_mesh && Array.isArray(bone.poly_mesh.positions) && Array.isArray(bone.poly_mesh.polys)) {
                    const pm = bone.poly_mesh;
                    const pmPos = pm.positions;
                    const pmNorm = Array.isArray(pm.normals) ? pm.normals : [];
                    const pmUv = Array.isArray(pm.uvs) ? pm.uvs : [];
                    const normUv = Boolean(pm.normalized_uvs);
                    const scale = 1 / 16;
                    for (const poly of pm.polys) {
                        if (!Array.isArray(poly) || poly.length < 3) continue;
                        const base = positions.length / 3;
                        for (const vert of poly) {
                            const pi = Array.isArray(vert) ? vert[0] : 0;
                            const ni = Array.isArray(vert) ? vert[1] : 0;
                            const ui = Array.isArray(vert) ? vert[2] : 0;
                            const p = pmPos[pi] || [0, 0, 0];
                            const n = pmNorm[ni] || [0, 1, 0];
                            const uv = pmUv[ui] || [0, 0];
                            positions.push(p[0] * scale, p[1] * scale, p[2] * scale);
                            normals.push(n[0], n[1], n[2]);
                            uvs.push(normUv ? uv[0] : uv[0] / texW, normUv ? uv[1] : uv[1] / texH);
                        }
                        for (let i = 1; i + 1 < poly.length; i++) {
                            indices.push(base, base + i, base + i + 1);
                        }
                    }
                }
            }
        }

        if (!positions.length) return null;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geo.setIndex(indices);
        geo.computeBoundingSphere();
        return geo;
    }

    /**
     * Build a KBR 3D particle preset pair:
     * - particleDefinition: `assets/<ns>/particle_definitions/<id>.json`
     * - modelDescriptor: `assets/<ns>/particle_models/<modelName>.json`
     * - geometryJson: optional companion model json (for geometry/geckolib/poly_mesh)
     */
    function createPreset(options = {}) {
        const ns = Platform.sanitizeFilename(options.namespace || 'particlecue').toLowerCase();
        const id = Platform.sanitizeFilename(options.id || 'crystal_shard').toLowerCase();
        const variant = normalizeVariant(options.variant || 'geckolib');
        const material = normalizeMaterial(options.material || 'cutout');
        const doubleSided = Boolean(options.double_sided);
        const modelDescriptorId = `${ns}:${id}_model`;
        const textureId = options.texture || `${ns}:particle/${id}`;

        let modelId = `${ns}:geo/${id}.geo.json`;
        if (variant === 'geometry') modelId = `${ns}:particle/${id}`;
        else if (variant === 'hardcode') modelId = `${ns}:builtin_${id}`;

        const modelDescriptor = {
            variant,
            model_id: modelId,
            texture: textureId,
            material,
            double_sided: doubleSided
        };

        const particleDefinition = {
            format_version: '1.10.0',
            particle_effect: {
                description: {
                    identifier: `${ns}:${id}`,
                    type: MODEL_PARTICLE_TYPE,
                    basic_render_parameters: {
                        material: material === 'translucent' ? 'particles_blend' : 'particles_alpha',
                        texture: textureId
                    }
                },
                components: {
                    'minecraft:emitter_local_space': {
                        position: Boolean(options.localPosition),
                        rotation: Boolean(options.localRotation)
                    },
                    'minecraft:emitter_rate_steady': {
                        spawn_rate: Number(options.spawnRate ?? 14),
                        max_particles: Number(options.maxParticles ?? 64)
                    },
                    'minecraft:emitter_lifetime_looping': {
                        active_time: Number(options.activeTime ?? 2.0)
                    },
                    'minecraft:emitter_shape_sphere': {
                        radius: Number(options.radius ?? 0.35),
                        direction: 'outwards'
                    },
                    'minecraft:particle_lifetime_expression': {
                        max_lifetime: Number(options.maxLifetime ?? 1.4)
                    },
                    'minecraft:particle_initial_speed': Number(options.initialSpeed ?? 2.6),
                    'minecraft:particle_motion_dynamic': {
                        linear_acceleration: [0, Number(options.gravity ?? -4.5), 0],
                        linear_drag_coefficient: Number(options.drag ?? 0.35),
                        rotation_acceleration: Number(options.rotationAccel ?? 45)
                    },
                    'minecraft:particle_initial_spin': {
                        rotation: 0,
                        rotation_rate: Number(options.spinRate ?? 120)
                    },
                    'minecraft:particle_motion_collision': {
                        enabled: Boolean(options.collision),
                        collision_drag: 0.25,
                        coefficient_of_restitution: 0.45,
                        collision_radius: 0.12
                    },
                    'kltyton_bedrock_runtime:model_appearance': {
                        size: Array.isArray(options.size) ? options.size : [0.55, 0.55, 0.55],
                        face_camera_mode: options.faceCameraMode || 'direction_z',
                        direction: {
                            mode: 'derive_from_velocity',
                            min_speed_threshold: 0.05
                        },
                        model: modelDescriptorId,
                        model_animation: {
                            type_frames: [modelDescriptorId],
                            frames_per_second: 8,
                            stretch_to_lifetime: false,
                            loop: true
                        }
                    },
                    'minecraft:particle_appearance_tinting': {
                        color: [1.0, 0.85, 0.45, 1.0]
                    }
                }
            }
        };

        let geometryJson = null;
        if (variant === 'geometry') {
            geometryJson = {
                texture_size: [16, 16],
                textures: {
                    '0': textureId,
                    particle: textureId
                },
                elements: [
                    {
                        from: [5, 2, 5],
                        to: [11, 14, 11],
                        faces: {
                            north: {uv: [0, 0, 16, 16], texture: '#0'},
                            east: {uv: [0, 0, 16, 16], texture: '#0'},
                            south: {uv: [0, 0, 16, 16], texture: '#0'},
                            west: {uv: [0, 0, 16, 16], texture: '#0'},
                            up: {uv: [0, 0, 16, 16], texture: '#0'},
                            down: {uv: [0, 0, 16, 16], texture: '#0'}
                        }
                    }
                ]
            };
        } else if (variant === 'geckolib') {
            geometryJson = {
                format_version: '1.12.0',
                'minecraft:geometry': [
                    {
                        description: {
                            identifier: `geometry.${id}`,
                            texture_width: 16,
                            texture_height: 16
                        },
                        bones: [
                            {
                                name: 'shard',
                                pivot: [0, 0, 0],
                                cubes: [
                                    {origin: [-3, -5, -3], size: [6, 10, 6], uv: [0, 0]}
                                ]
                            }
                        ]
                    }
                ]
            };
        } else if (variant === 'poly_mesh') {
            geometryJson = {
                format_version: '1.12.0',
                'minecraft:geometry': [
                    {
                        description: {
                            identifier: `geometry.${id}`,
                            texture_width: 16,
                            texture_height: 16
                        },
                        bones: [
                            {
                                name: 'crystal',
                                pivot: [0, 0, 0],
                                poly_mesh: {
                                    normalized_uvs: true,
                                    positions: [
                                        [0, 8, 0],
                                        [-5, 0, 5],
                                        [5, 0, 5],
                                        [5, 0, -5],
                                        [-5, 0, -5],
                                        [0, -8, 0]
                                    ],
                                    normals: [
                                        [0, 1, 0],
                                        [0, 0, 1],
                                        [1, 0, 0],
                                        [0, 0, -1],
                                        [-1, 0, 0],
                                        [0, -1, 0]
                                    ],
                                    uvs: [
                                        [0.5, 1.0],
                                        [0.0, 0.5],
                                        [1.0, 0.5],
                                        [0.5, 0.0]
                                    ],
                                    polys: [
                                        [[0, 0, 0], [1, 1, 1], [2, 1, 2]],
                                        [[0, 0, 0], [2, 2, 1], [3, 2, 2]],
                                        [[0, 0, 0], [3, 3, 1], [4, 3, 2]],
                                        [[0, 0, 0], [4, 4, 1], [1, 4, 2]],
                                        [[5, 5, 3], [2, 1, 2], [1, 1, 1]],
                                        [[5, 5, 3], [3, 2, 2], [2, 2, 1]],
                                        [[5, 5, 3], [4, 3, 2], [3, 3, 1]],
                                        [[5, 5, 3], [1, 4, 2], [4, 4, 1]]
                                    ]
                                }
                            }
                        ]
                    }
                ]
            };
        }

        return {
            namespace: ns,
            id,
            modelDescriptorId,
            particleDefinition,
            modelDescriptor,
            geometryJson
        };
    }

    /**
     * Export a complete KBR 3D particle resource-pack structure into `outputRootDir`:
     * - `assets/<ns>/particle_definitions/<id>.json`
     * - `assets/<ns>/particle_models/<model>.json`
     * - companion geometry file (when variant != hardcode)
     * - companion texture file (when bytes/dataUrl/path available)
     */
    function exportResourcePackBundle(outputRootDir, bundle) {
        const ns = Platform.sanitizeFilename(bundle.namespace || 'particlecue').toLowerCase();
        const id = Platform.sanitizeFilename(bundle.id || 'particle').toLowerCase();
        const defPath = Platform.joinPath(outputRootDir, 'assets', ns, 'particle_definitions', `${id}.json`);
        Platform.writeTextFile(defPath, JSON.stringify(bundle.particleDefinition, null, 2), outputRootDir);

        const descParsed = parseNamespacedId(bundle.modelDescriptorId || `${ns}:${id}_model`, ns);
        const descPath = Platform.joinPath(
            outputRootDir,
            'assets',
            descParsed.namespace,
            'particle_models',
            `${descParsed.path.replace(/\.json$/i, '')}.json`
        );
        Platform.writeTextFile(descPath, JSON.stringify(bundle.modelDescriptor, null, 2), outputRootDir);

        let geometryPath = '';
        if (bundle.geometryJson && bundle.modelDescriptor?.variant !== 'hardcode') {
            const mParsed = parseNamespacedId(bundle.modelDescriptor.model_id, ns);
            if (bundle.modelDescriptor.variant === 'geometry') {
                const stripped = mParsed.path.replace(/^models\//, '').replace(/\.json$/i, '');
                geometryPath = Platform.joinPath(outputRootDir, 'assets', mParsed.namespace, 'models', `${stripped}.json`);
            } else {
                const p = mParsed.path.endsWith('.json') ? mParsed.path : `${mParsed.path}.geo.json`;
                geometryPath = Platform.joinPath(outputRootDir, 'assets', mParsed.namespace, p);
            }
            Platform.writeTextFile(geometryPath, JSON.stringify(bundle.geometryJson, null, 2), outputRootDir);
        }

        let texturePath = '';
        if (bundle.textureBytes && bundle.modelDescriptor?.texture) {
            const tParsed = parseNamespacedId(bundle.modelDescriptor.texture, ns);
            let tp = tParsed.path;
            if (!tp.startsWith('textures/')) tp = `textures/${tp}`;
            if (!tp.endsWith('.png')) tp += '.png';
            texturePath = Platform.joinPath(outputRootDir, 'assets', tParsed.namespace, tp);
            Platform.writeBinaryFile(texturePath, bundle.textureBytes, outputRootDir);
        }

        return {
            definitionPath: defPath,
            descriptorPath: descPath,
            geometryPath,
            texturePath
        };
    }

    function registerFormat() {
        FormatRegistry.register({
            id: 'kbr_3d_particle',
            label: 'KBR 3D Particle (KltytonBedrockRuntime)',
            extensions: ['.json'],
            canParse,
            inspect
        });
    }

    return {
        MODEL_PARTICLE_TYPE,
        MODEL_APPEARANCE_KEYS,
        VALID_VARIANTS,
        VALID_MATERIALS,
        safeParseJson,
        canParse,
        normalizeVariant,
        normalizeMaterial,
        parseDescriptor,
        parseNamespacedId,
        resolveDescriptorOnDisk,
        resolveGeometryFileOnDisk,
        resolveTextureOnDisk,
        inspect,
        validateModelJsonForVariant,
        buildGeometryFromModelJson,
        createPreset,
        exportResourcePackBundle,
        registerFormat
    };
})();


/* === src/kbr/kbr_3d_preview.js === */
const Kbr3dPreview = (() => {
    const SCALE = 16; // 1 block = 16 Blockbench units
    const projectStates = new Map();
    let rootGroup = null;

    function getProjectId(project) {
        const p = project || (typeof Project !== 'undefined' ? Project : null);
        return p ? (p.uuid || '__default__') : '__none__';
    }

    function ensureRoot() {
        if (typeof THREE === 'undefined' || typeof Canvas === 'undefined' || !Canvas?.scene) return null;
        if (!rootGroup) {
            rootGroup = new THREE.Group();
            rootGroup.name = 'particlecue_kbr3d_space';
            rootGroup.no_export = true;
        }
        if (typeof Animator !== 'undefined' && Animator.open) {
            if (!rootGroup.parent) Canvas.scene.add(rootGroup);
        } else if (rootGroup.parent) {
            rootGroup.parent.remove(rootGroup);
        }
        return rootGroup;
    }

    function getProjectState(project, create = true) {
        const id = getProjectId(project);
        if (projectStates.has(id)) return projectStates.get(id);
        if (!create) return null;
        const st = {
            projectId: id,
            assets: new Map(),    // assetKey -> { meta, hash, modelVisuals: Map<ref, { geometry, texture, descriptor, isHardcodePlaceholder }> }
            instances: new Map()  // instanceKey -> { group, assetKey, lastTime, particleCount }
        };
        projectStates.set(id, st);
        return st;
    }

    function createTexture(srcUrl) {
        if (!srcUrl || typeof THREE === 'undefined') return null;
        const img = new Image();
        const tex = new THREE.Texture(img);
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        tex.generateMipmaps = false;
        img.onload = () => {
            tex.needsUpdate = true;
        };
        img.src = srcUrl;
        return tex;
    }

    function buildHardcodePlaceholderGeometry() {
        // Distinct faceted crystal wireframe+solid indicator for runtime-registered hardcode models
        return new THREE.IcosahedronGeometry(0.42, 0);
    }

    function buildFallbackCubeGeometry() {
        return new THREE.BoxGeometry(0.5, 0.5, 0.5);
    }

    function disposeAssetRecord(state, assetKey) {
        for (const [instKey, inst] of Array.from(state.instances.entries())) {
            if (inst.assetKey === assetKey) {
                disposeInstance(inst);
                state.instances.delete(instKey);
            }
        }
        const rec = state.assets.get(assetKey);
        if (!rec) return;
        for (const vis of rec.modelVisuals.values()) {
            try { if (vis.geometry) vis.geometry.dispose(); } catch (_err) {}
            try { if (vis.texture) vis.texture.dispose(); } catch (_err) {}
        }
        rec.modelVisuals.clear();
        state.assets.delete(assetKey);
    }

    function serializeEmbeddedModelsForHash(embeddedModels) {
        if (!embeddedModels || typeof embeddedModels !== 'object') return '';
        const keys = Object.keys(embeddedModels).sort();
        const out = [];
        for (const k of keys) {
            const entry = embeddedModels[k];
            const desc = entry?.descriptor || null;
            out.push([
                k,
                desc ? {
                    variant: desc.variant || '',
                    model_id: desc.model_id || '',
                    texture: desc.texture || '',
                    material: desc.material || '',
                    double_sided: Boolean(desc.double_sided)
                } : null,
                entry?.geometryJson || null
            ]);
        }
        return JSON.stringify(out);
    }

    function serializeEmbeddedTexturesForHash(embeddedTextures) {
        if (!embeddedTextures || typeof embeddedTextures !== 'object') return '';
        const keys = Object.keys(embeddedTextures).sort();
        return JSON.stringify(keys.map(k => [k, String(embeddedTextures[k] || '').length, String(embeddedTextures[k] || '').slice(0, 64)]));
    }

    function disposeInstance(inst) {
        if (!inst) return;
        if (inst.group) {
            inst.group.traverse(obj => {
                if (obj.material) {
                    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
                    mats.forEach(m => { try { m.dispose(); } catch (_err) {} });
                }
            });
            if (inst.group.parent) inst.group.parent.remove(inst.group);
        }
    }

    function registerOrUpdateAsset(project, assetKey, rawText, assetInfo = {}) {
        const meta = KbrModelSchema.inspect(rawText, assetInfo.filePath || assetKey, assetInfo.extraRoots || []);
        if (!meta) return null;

        const state = getProjectState(project, true);
        const embeddedModels = assetInfo.embeddedModels || {};
        const embeddedTextures = assetInfo.embeddedTextures || {};
        const hash = Platform.sha256(
            meta.rawText
            + '|' + serializeEmbeddedModelsForHash(embeddedModels)
            + '|' + serializeEmbeddedTexturesForHash(embeddedTextures)
            + '|' + (assetInfo.textureDataUrl || '')
        );
        const existing = state.assets.get(assetKey);
        if (existing && existing.hash === hash && existing.filePath === (assetInfo.filePath || existing.filePath || '')) {
            return existing;
        }
        if (existing) disposeAssetRecord(state, assetKey);

        const modelVisuals = new Map();
        for (const dEntry of meta.descriptors) {
            let desc = dEntry.descriptor;
            let geomJson = null;

            // Embedded KBR descriptor takes precedence over stale disk descriptor on live edits
            const emb = embeddedModels[dEntry.ref];
            if (emb?.descriptor) {
                desc = KbrModelSchema.parseDescriptor(emb.descriptor);
            }
            if (emb?.geometryJson) {
                geomJson = KbrModelSchema.safeParseJson(emb.geometryJson);
            } else if (dEntry.geometryPath && Platform.fileExists(dEntry.geometryPath)) {
                geomJson = KbrModelSchema.safeParseJson(Platform.readTextFile(dEntry.geometryPath));
            }

            let geometry = null;
            let isHardcodePlaceholder = false;
            let isFormatMismatch = false;
            let mismatchReason = '';
            const activeVariant = desc?.variant || 'geckolib';

            if (activeVariant === 'hardcode') {
                geometry = buildHardcodePlaceholderGeometry();
                isHardcodePlaceholder = true;
            } else {
                const validation = typeof KbrModelSchema.validateModelJsonForVariant === 'function'
                    ? KbrModelSchema.validateModelJsonForVariant(geomJson, activeVariant)
                    : {ok: Boolean(geomJson), reason: geomJson ? '' : 'Missing model geometry JSON.'};
                if (!validation.ok) {
                    isFormatMismatch = true;
                    mismatchReason = validation.reason;
                } else if (geomJson) {
                    geometry = KbrModelSchema.buildGeometryFromModelJson(geomJson, activeVariant);
                    if (!geometry) {
                        isFormatMismatch = true;
                        mismatchReason = `Unable to build mesh for variant "${activeVariant}" from model JSON.`;
                    }
                }
            }
            if (!geometry) {
                geometry = buildFallbackCubeGeometry();
            }

            const texSrc = embeddedTextures[desc?.texture || dEntry.ref]
                || assetInfo.textureDataUrl
                || (dEntry.texturePath ? Platform.toFileUrl(dEntry.texturePath) : '');
            const texture = texSrc ? createTexture(texSrc) : null;

            modelVisuals.set(dEntry.ref, {
                ref: dEntry.ref,
                descriptor: desc || {variant: 'geometry', model_id: dEntry.ref, texture: '', material: 'solid', double_sided: false},
                geometry,
                texture,
                isHardcodePlaceholder,
                isFormatMismatch,
                mismatchReason
            });
        }

        if (!modelVisuals.size) {
            modelVisuals.set('__fallback__', {
                ref: '__fallback__',
                descriptor: {variant: 'geometry', model_id: '__fallback__', texture: '', material: 'solid', double_sided: false},
                geometry: buildFallbackCubeGeometry(),
                texture: assetInfo.textureDataUrl ? createTexture(assetInfo.textureDataUrl) : null,
                isHardcodePlaceholder: false,
                isFormatMismatch: false,
                mismatchReason: ''
            });
        }

        const record = {
            assetKey,
            filePath: assetInfo.filePath || '',
            meta,
            hash,
            modelVisuals
        };
        state.assets.set(assetKey, record);
        return record;
    }

    function hashSeed(seed) {
        let x = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) >>> 0;
        x ^= x >>> 13;
        x = Math.imul(x, 0xc2b2ae35) >>> 0;
        return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
    }

    function evalSimpleMolang(expr, ctx, fallback = 0) {
        if (typeof expr === 'number') return Number.isFinite(expr) ? expr : fallback;
        if (typeof expr !== 'string') return fallback;
        const s = expr.trim();
        if (!s) return fallback;
        const num = Number(s);
        if (Number.isFinite(num)) return num;
        if (typeof Animator !== 'undefined' && Animator.MolangParser?.parse) {
            try {
                const v = Number(Animator.MolangParser.parse(s, ctx));
                if (Number.isFinite(v)) return v;
            } catch (_err) {}
        }
        return fallback;
    }

    function createMaterialForDescriptor(desc, texture, tintRgb, alpha, isHardcode) {
        const matType = desc?.material || 'solid';
        const doubleSided = Boolean(desc?.double_sided);
        const isTranslucent = matType === 'translucent';
        const isCutout = matType === 'cutout' || matType === 'cutout_mipped';
        const color = new THREE.Color(tintRgb[0], tintRgb[1], tintRgb[2]);

        const mat = new THREE.MeshStandardMaterial({
            color,
            map: texture || null,
            roughness: isHardcode ? 0.35 : 0.65,
            metalness: isHardcode ? 0.25 : 0.05,
            wireframe: false,
            transparent: isTranslucent || alpha < 0.99,
            opacity: Math.max(0.05, Math.min(1, alpha)),
            alphaTest: isCutout ? 0.5 : 0,
            depthWrite: !isTranslucent,
            side: doubleSided ? THREE.DoubleSide : THREE.FrontSide
        });
        return mat;
    }

    function selectFrameModelRef(appearance, ageSec, lifeSec, rand4) {
        const anim = appearance?.model_animation;
        const frames = Array.isArray(anim?.type_frames) ? anim.type_frames : [];
        if (!frames.length) return appearance?.model || '__fallback__';

        const frameCount = frames.length;
        let idx = 0;
        if (anim.stretch_to_lifetime) {
            const prog = Math.max(0, Math.min(0.999999, ageSec / Math.max(1e-4, lifeSec)));
            idx = Math.floor(prog * frameCount);
        } else {
            const fps = Math.max(0.01, Number(anim.frames_per_second) || 1);
            idx = Math.floor(Math.max(0, ageSec) * fps);
        }
        if (anim.loop) idx = ((idx % frameCount) + frameCount) % frameCount;
        else idx = Math.min(idx, frameCount - 1);

        const frameEntry = frames[idx];
        if (typeof frameEntry === 'string') return frameEntry;
        if (Array.isArray(frameEntry) && frameEntry.length) {
            const pick = frameEntry[Math.min(frameEntry.length - 1, Math.floor(rand4 * frameEntry.length))];
            return typeof pick === 'string' ? pick : (pick?.model_type || pick?.model || pick?.model_id || appearance.model || '__fallback__');
        }
        if (frameEntry && typeof frameEntry === 'object') {
            return frameEntry.model_type || frameEntry.model || frameEntry.model_id || appearance.model || '__fallback__';
        }
        return appearance?.model || '__fallback__';
    }

    function renderInstanceAtTime(project, instanceKey, assetKey, diffSec, locatorPose, _script) {
        const root = ensureRoot();
        const state = getProjectState(project, false);
        if (!root || !state) return 0;

        const prev = state.instances.get(instanceKey);
        if (prev) {
            disposeInstance(prev);
            state.instances.delete(instanceKey);
        }
        if (diffSec < 0) return 0;

        const record = state.assets.get(assetKey);
        if (!record) return 0;

        const comps = record.meta.json?.particle_effect?.components || {};
        const appearance = record.meta.appearance || {};
        const localSpaceComp = comps['minecraft:emitter_local_space'] || {};
        const localPos = Boolean(localSpaceComp.position);
        const localRot = Boolean(localSpaceComp.rotation);

        const rateSteady = comps['minecraft:emitter_rate_steady'];
        const rateInstant = comps['minecraft:emitter_rate_instant'];
        const lifeLoop = comps['minecraft:emitter_lifetime_looping'];
        const lifeOnce = comps['minecraft:emitter_lifetime_once'];
        const activeTime = Number(lifeLoop?.active_time ?? lifeOnce?.active_time ?? 2.0) || 2.0;
        const isLoop = Boolean(lifeLoop);
        const simTime = isLoop && activeTime > 0 ? (diffSec % activeTime) : Math.min(diffSec, activeTime + 2.0);

        const maxLife = Math.max(0.05, Number(comps['minecraft:particle_lifetime_expression']?.max_lifetime) || 1.2);
        const initSpeed = Number(comps['minecraft:particle_initial_speed'] ?? 2.0);
        const dyn = comps['minecraft:particle_motion_dynamic'] || {};
        const accel = Array.isArray(dyn.linear_acceleration) ? dyn.linear_acceleration.map(v => Number(v) || 0) : [0, 0, 0];
        const drag = Math.max(0, Number(dyn.linear_drag_coefficient) || 0);
        const rotAccel = Number(dyn.rotation_acceleration) || 0;
        const spinComp = comps['minecraft:particle_initial_spin'] || {};
        const initSpin = Number(spinComp.rotation) || 0;
        const spinRate = Number(spinComp.rotation_rate) || 0;
        const collision = comps['minecraft:particle_motion_collision'] || {};
        const collisionEnabled = Boolean(collision.enabled);
        const restitution = Number(collision.coefficient_of_restitution ?? 0.4);

        const sphere = comps['minecraft:emitter_shape_sphere'];
        const box = comps['minecraft:emitter_shape_box'];
        const radius = Number(sphere?.radius ?? 0.25);

        const tintRaw = comps['minecraft:particle_appearance_tinting']?.color;
        let tintRgb = [1, 1, 1];
        let tintAlpha = 1;
        if (Array.isArray(tintRaw) && tintRaw.length >= 3) {
            tintRgb = [Number(tintRaw[0]) || 1, Number(tintRaw[1]) || 1, Number(tintRaw[2]) || 1];
            tintAlpha = tintRaw.length >= 4 ? Number(tintRaw[3]) : 1;
        }

        const spawnTimes = [];
        if (rateInstant) {
            const cnt = Math.min(64, Math.max(1, Math.round(Number(rateInstant.num_particles) || 8)));
            for (let i = 0; i < cnt; i++) spawnTimes.push(0);
        } else {
            const rate = Math.max(1, Math.min(48, Number(rateSteady?.spawn_rate) || 12));
            const maxP = Math.min(64, Math.max(1, Number(rateSteady?.max_particles) || 48));
            const count = Math.min(maxP, Math.floor(Math.min(simTime, activeTime) * rate) + 1);
            for (let i = 0; i < count; i++) {
                const st = i / rate;
                if (simTime - st >= 0 && simTime - st <= maxLife) {
                    spawnTimes.push(st);
                }
            }
        }

        const group = new THREE.Group();
        group.name = `kbr3d_${instanceKey}`;
        group.scale.set(SCALE, SCALE, SCALE);
        if (locatorPose?.position) {
            group.position.copy(locatorPose.position);
        }
        if ((localPos && localRot) && locatorPose?.quaternion) {
            group.quaternion.copy(locatorPose.quaternion);
        }

        let liveCount = 0;
        const firstVisual = record.modelVisuals.values().next().value;

        for (let i = 0; i < spawnTimes.length; i++) {
            const age = simTime - spawnTimes[i];
            if (age < 0 || age > maxLife) continue;

            const r1 = hashSeed(i * 7919 + 11);
            const r2 = hashSeed(i * 7919 + 29);
            const r3 = hashSeed(i * 7919 + 53);
            const r4 = hashSeed(i * 7919 + 97);

            const theta = r1 * Math.PI * 2;
            const phi = Math.acos(2 * r2 - 1);
            const dirX = Math.sin(phi) * Math.cos(theta);
            const dirY = Math.cos(phi);
            const dirZ = Math.sin(phi) * Math.sin(theta);

            let ox = 0, oy = 0, oz = 0;
            if (box && Array.isArray(box.half_dimensions)) {
                ox = (r1 * 2 - 1) * (Number(box.half_dimensions[0]) || 0.5);
                oy = (r2 * 2 - 1) * (Number(box.half_dimensions[1]) || 0.5);
                oz = (r3 * 2 - 1) * (Number(box.half_dimensions[2]) || 0.5);
            } else {
                ox = dirX * radius * r3;
                oy = dirY * radius * r3;
                oz = dirZ * radius * r3;
            }

            const damp = drag > 0 ? (1 - Math.exp(-drag * age)) / Math.max(drag, 1e-4) : age;
            let px = ox + dirX * initSpeed * damp + 0.5 * accel[0] * age * age;
            let py = oy + dirY * initSpeed * damp + 0.5 * accel[1] * age * age;
            let pz = oz + dirZ * initSpeed * damp + 0.5 * accel[2] * age * age;
            if (collisionEnabled && py < 0) {
                py = Math.abs(py) * restitution;
            }

            const molangCtx = {
                'variable.particle_age': age,
                'variable.particle_lifetime': maxLife,
                'variable.particle_random_1': r1,
                'variable.particle_random_2': r2,
                'variable.particle_random_3': r3,
                'variable.particle_random_4': r4
            };
            const rawSize = Array.isArray(appearance.size) ? appearance.size : [0.5, 0.5, 0.5];
            const sx = Math.max(0.05, evalSimpleMolang(rawSize[0], molangCtx, 0.5));
            const sy = Math.max(0.05, evalSimpleMolang(rawSize[1] ?? rawSize[0], molangCtx, sx));
            const sz = Math.max(0.05, evalSimpleMolang(rawSize[2] ?? sx, molangCtx, sx));

            const modelRef = selectFrameModelRef(appearance, age, maxLife, r4);
            const vis = record.modelVisuals.get(modelRef) || firstVisual;
            if (!vis) continue;

            const mat = createMaterialForDescriptor(vis.descriptor, vis.texture, tintRgb, tintAlpha, vis.isHardcodePlaceholder);
            const mesh = new THREE.Mesh(vis.geometry, mat);
            mesh.position.set(px, py, pz);
            mesh.scale.set(sx, sy, sz);

            const spinRad = (initSpin + spinRate * age + 0.5 * rotAccel * age * age) * (Math.PI / 180);
            mesh.rotation.set(
                spinRad * 0.45 + r1 * 1.2,
                spinRad * 0.85 + r2 * 2.4,
                spinRad * 0.35
            );
            group.add(mesh);
            liveCount++;
        }

        root.add(group);
        state.instances.set(instanceKey, {group, assetKey, lastTime: diffSec, particleCount: liveCount});
        return liveCount;
    }

    function reconcileAnimationInstances(project, animUuid, touchedKeys) {
        const state = getProjectState(project, false);
        if (!state) return;
        const prefix = `${animUuid}::`;
        for (const [k, inst] of state.instances.entries()) {
            if (k.startsWith(prefix) && !touchedKeys.has(k)) {
                disposeInstance(inst);
                state.instances.delete(k);
            }
        }
    }

    function detachProjectVisuals(project) {
        const state = getProjectState(project, false);
        if (!state) return;
        for (const inst of state.instances.values()) {
            if (inst.group?.parent) inst.group.parent.remove(inst.group);
        }
    }

    function disposeProjectState(project) {
        const id = getProjectId(project);
        const state = projectStates.get(id);
        if (!state) return;
        for (const inst of state.instances.values()) disposeInstance(inst);
        state.instances.clear();
        for (const assetKey of Array.from(state.assets.keys())) {
            disposeAssetRecord(state, assetKey);
        }
        projectStates.delete(id);
    }

    function disposeAll() {
        for (const id of Array.from(projectStates.keys())) {
            disposeProjectState({uuid: id});
        }
        if (rootGroup) {
            if (rootGroup.parent) rootGroup.parent.remove(rootGroup);
            rootGroup = null;
        }
        if (typeof Canvas !== 'undefined' && Array.isArray(Canvas?.scene?.children)) {
            for (const child of Canvas.scene.children.slice()) {
                if (child && child.name === 'particlecue_kbr3d_space') {
                    Canvas.scene.remove(child);
                }
            }
        }
    }

    function getDiagnostics(project) {
        const state = getProjectState(project, false);
        let liveParticles = 0;
        let instanceCount = 0;
        let mismatchCount = 0;
        const assets = [];
        if (state) {
            instanceCount = state.instances.size;
            for (const inst of state.instances.values()) liveParticles += inst.particleCount || 0;
            for (const rec of state.assets.values()) {
                const variants = Array.from(rec.modelVisuals.values()).map(v => {
                    if (v.isFormatMismatch) mismatchCount++;
                    return {
                        ref: v.ref,
                        variant: v.descriptor.variant,
                        material: v.descriptor.material,
                        doubleSided: v.descriptor.double_sided,
                        hardcodePlaceholder: v.isHardcodePlaceholder,
                        isFormatMismatch: Boolean(v.isFormatMismatch),
                        mismatchReason: v.mismatchReason || '',
                        vertexCount: v.geometry?.attributes?.position?.count || 0
                    };
                });
                assets.push({
                    assetKey: rec.assetKey,
                    identifier: rec.meta.identifier,
                    modelCount: rec.modelVisuals.size,
                    variants
                });
            }
        }
        return {
            assetCount: assets.length,
            instanceCount,
            liveParticles,
            mismatchCount,
            totalTrackedProjects: projectStates.size,
            assets
        };
    }

    return {
        registerOrUpdateAsset,
        renderInstanceAtTime,
        reconcileAnimationInstances,
        detachProjectVisuals,
        disposeProjectState,
        disposeAll,
        getDiagnostics
    };
})();


/* === src/compat/animcue_bridge.js === */
const AnimCueBridge = (() => {
    const SLOT_KEY = 'animcue_participant';
    const BONE_KEY = 'animcue_bone_name';
    const CAMERA_KEY = 'animcue_camera';

    function isAvailable() {
        if (typeof Plugins !== 'undefined') {
            const list = Array.isArray(Plugins.all) ? Plugins.all : (Array.isArray(Plugins.installed) ? Plugins.installed : []);
            const p = list.find(item => item && item.id === 'animcue_studio');
            if (p && !p.disabled && p.installed !== false) return true;
        }
        return getParticipantRoots().length > 0;
    }

    function getParticipantRoots() {
        if (typeof Outliner === 'undefined' || !Array.isArray(Outliner.root)) return [];
        if (typeof Group === 'undefined') return [];
        return Outliner.root.filter(node => node instanceof Group && Boolean(node[SLOT_KEY]?.role));
    }

    function getParticipantOfNode(node) {
        let cur = node;
        while (cur && cur !== 'root') {
            if (typeof Group !== 'undefined' && cur instanceof Group && cur.parent === 'root' && cur[SLOT_KEY]?.role) {
                return cur;
            }
            cur = cur.parent;
        }
        return null;
    }

    function getRoleOfNode(node) {
        const root = getParticipantOfNode(node);
        return root ? String(root[SLOT_KEY].role) : 'primary';
    }

    function isCameraNode(node) {
        let cur = node;
        while (cur && cur !== 'root') {
            if (cur && cur[CAMERA_KEY]) return true;
            cur = cur.parent;
        }
        return false;
    }

    function listParticipants() {
        const list = [{role: 'primary', type: 'primary', id: 'primary', rigMode: 'auto', group: null}];
        for (const root of getParticipantRoots()) {
            const slot = root[SLOT_KEY];
            list.push({
                role: String(slot.role),
                type: String(slot.type || 'model'),
                id: String(slot.id || ''),
                rigMode: String(slot.rigMode || 'auto'),
                group: root
            });
        }
        return list;
    }

    /**
     * Collect every Locator in the project tagged with its owning AnimCue participant role.
     * Supports disambiguating identically named locators (e.g. two participants both having `right_hand`).
     */
    function listParticipantLocators() {
        if (typeof Locator === 'undefined' || !Array.isArray(Locator.all)) return [];
        const entries = [];
        for (const loc of Locator.all) {
            if (!loc || isCameraNode(loc)) continue;
            const participantGroup = getParticipantOfNode(loc);
            const role = participantGroup ? String(participantGroup[SLOT_KEY].role) : 'primary';
            entries.push({
                uuid: loc.uuid,
                name: loc.name,
                role,
                participantGroup,
                locator: loc,
                qualifiedName: role === 'primary' ? loc.name : `${role}::${loc.name}`
            });
        }
        return entries;
    }

    /**
     * Resolve a particle data_point's target Locator (and optional owning bone Group)
     * honoring explicit participant ownership (`participantRole` / `locatorUuid`) stored in KeyframeStore
     * or `role::locator` notation while preserving native `dp.locator` string compatibility.
     */
    function resolveLocatorForBinding(dp, bindingMeta) {
        if (!dp) return {locator: null, role: 'primary', participantGroup: null, boneGroup: null};
        const rawLoc = typeof dp.locator === 'string' ? dp.locator.trim() : '';
        let wantedRole = bindingMeta?.participantRole ? String(bindingMeta.participantRole).trim() : '';
        let wantedUuid = bindingMeta?.locatorUuid ? String(bindingMeta.locatorUuid).trim() : '';
        let wantedName = rawLoc;

        // Also support inline `role::locator` shorthand if authored directly
        if (rawLoc.includes('::')) {
            const parts = rawLoc.split('::');
            if (parts.length === 2 && parts[0] && parts[1]) {
                if (!wantedRole) wantedRole = parts[0].trim();
                wantedName = parts[1].trim();
            }
        }

        const allLocs = listParticipantLocators();

        // 1. Exact UUID match (survives renames and duplicate locator names across participants)
        if (wantedUuid) {
            const byUuid = allLocs.find(e => e.uuid === wantedUuid);
            if (byUuid && (!wantedName || byUuid.name === wantedName)) {
                return {
                    locator: byUuid.locator,
                    role: byUuid.role,
                    participantGroup: byUuid.participantGroup,
                    boneGroup: byUuid.locator.parent instanceof Group ? byUuid.locator.parent : null
                };
            }
        }

        // 2. Role + name match
        if (wantedRole && wantedName) {
            const byRoleAndName = allLocs.find(e => e.role === wantedRole && e.name === wantedName);
            if (byRoleAndName) {
                return {
                    locator: byRoleAndName.locator,
                    role: byRoleAndName.role,
                    participantGroup: byRoleAndName.participantGroup,
                    boneGroup: byRoleAndName.locator.parent instanceof Group ? byRoleAndName.locator.parent : null
                };
            }
            // Fallback: find a bone in that participant with matching animcue_bone_name or name
            const partRoot = wantedRole === 'primary'
                ? null
                : getParticipantRoots().find(g => g[SLOT_KEY]?.role === wantedRole);
            if (typeof Group !== 'undefined' && Array.isArray(Group.all)) {
                const matchingBone = Group.all.find(g => {
                    if (!g || isCameraNode(g)) return false;
                    const gRole = getRoleOfNode(g);
                    if (gRole !== wantedRole) return false;
                    const rawBone = g[BONE_KEY] || g.name;
                    return rawBone === wantedName || g.name === wantedName;
                });
                if (matchingBone) {
                    return {
                        locator: null,
                        role: wantedRole,
                        participantGroup: partRoot || null,
                        boneGroup: matchingBone
                    };
                }
            }
        }

        // 3. Plain name lookup (prefer primary participant first when unattributed)
        if (wantedName) {
            const primaryMatch = allLocs.find(e => e.role === 'primary' && e.name === wantedName);
            const anyMatch = primaryMatch || allLocs.find(e => e.name === wantedName);
            if (anyMatch) {
                return {
                    locator: anyMatch.locator,
                    role: anyMatch.role,
                    participantGroup: anyMatch.participantGroup,
                    boneGroup: anyMatch.locator.parent instanceof Group ? anyMatch.locator.parent : null
                };
            }
        }

        return {locator: null, role: wantedRole || 'primary', participantGroup: null, boneGroup: null};
    }

    /**
     * Detect whether two or more participants share identically named locators.
     */
    function findAmbiguousLocatorNames() {
        const byName = new Map();
        for (const entry of listParticipantLocators()) {
            if (!byName.has(entry.name)) byName.set(entry.name, []);
            byName.get(entry.name).push(entry);
        }
        const collisions = [];
        for (const [name, entries] of byName.entries()) {
            if (entries.length > 1) {
                collisions.push({name, entries});
            }
        }
        return collisions;
    }

    /**
     * Snapshot & restore helper for AnimCue scene roundtrip:
     * AnimCue's `importSceneDocument` currently restores bone tracks & timeline scripts
     * without restoring `particle_effects`. This helper exports/re-imports particle_effects
     * plus participant locator ownership cleanly onto an AnimCue scene JSON document.
     */
    function exportParticleTracksForScene(project, animation) {
        const anim = animation || (typeof Animation !== 'undefined' ? Animation.selected : null);
        if (!anim?.animators?.effects) return null;
        const kfs = Array.isArray(anim.animators.effects.particle) ? anim.animators.effects.particle : [];
        if (!kfs.length) return null;

        const state = typeof KeyframeStore !== 'undefined' ? KeyframeStore.getState(project, false) : null;
        const track = {};
        const participantBindings = {};

        for (const kf of kfs.slice().sort((a, b) => (Number(a.time) || 0) - (Number(b.time) || 0))) {
            const timeKey = String(Number((Number(kf.time) || 0).toFixed(4)));
            const points = (kf.data_points || []).map((dp, dpIdx) => {
                const bKey = KeyframeStore.makeBindingKey(anim.uuid, kf.uuid, dpIdx);
                const meta = state?.bindingMeta?.get(bKey);
                const out = {
                    effect: dp.effect || '',
                    locator: dp.locator || '',
                    pre_effect_script: dp.script || '',
                    file: dp.file || ''
                };
                if (meta?.participantRole && meta.participantRole !== 'primary') {
                    out.participant_role = meta.participantRole;
                    participantBindings[`${timeKey}#${dpIdx}`] = {
                        participantRole: meta.participantRole,
                        locatorUuid: meta.locatorUuid || ''
                    };
                }
                return out;
            });
            if (points.length) {
                if (!track[timeKey]) {
                    track[timeKey] = points.length === 1 ? points[0] : points;
                } else {
                    const existing = Array.isArray(track[timeKey]) ? track[timeKey] : [track[timeKey]];
                    track[timeKey] = existing.concat(points);
                }
            }
        }
        return {
            particle_effects: track,
            participant_bindings: participantBindings
        };
    }

    function importParticleTracksIntoAnimation(project, animation, particleEffectsTrack) {
        if (!animation || !particleEffectsTrack || typeof particleEffectsTrack !== 'object') return 0;
        if (!animation.animators) animation.animators = {};
        if (!animation.animators.effects && typeof EffectAnimator !== 'undefined') {
            animation.animators.effects = new EffectAnimator(animation);
        }
        const effects = animation.animators?.effects;
        if (!effects || typeof effects.addKeyframe !== 'function') return 0;

        let count = 0;
        for (const [timeKey, payload] of Object.entries(particleEffectsTrack)) {
            const time = Number(timeKey);
            if (!Number.isFinite(time)) continue;
            const list = Array.isArray(payload) ? payload : [payload];
            const dataPoints = [];
            const roles = [];
            for (const item of list) {
                if (!item || typeof item !== 'object') continue;
                dataPoints.push({
                    effect: item.effect || '',
                    locator: item.locator || '',
                    script: item.pre_effect_script ?? item.script ?? '',
                    file: item.file || ''
                });
                roles.push(item.participant_role || '');
            }
            if (!dataPoints.length) continue;
            const kf = effects.addKeyframe({
                channel: 'particle',
                time,
                data_points: dataPoints
            });
            if (kf && typeof KeyframeStore !== 'undefined') {
                roles.forEach((role, dpIdx) => {
                    if (role) {
                        const resolved = resolveLocatorForBinding(dataPoints[dpIdx], {participantRole: role});
                        KeyframeStore.setBindingMeta(project, animation.uuid, kf.uuid, dpIdx, {
                            participantRole: role,
                            locatorUuid: resolved.locator?.uuid || ''
                        });
                    }
                });
            }
            count += dataPoints.length;
        }
        return count;
    }

    function getStatus() {
        const participants = listParticipants();
        const collisions = findAmbiguousLocatorNames();
        return {
            available: isAvailable(),
            participantCount: Math.max(0, participants.length - 1),
            participants: participants.map(p => ({role: p.role, type: p.type, id: p.id, rigMode: p.rigMode})),
            ambiguousLocatorNames: collisions.map(c => c.name)
        };
    }

    return {
        SLOT_KEY,
        BONE_KEY,
        isAvailable,
        getParticipantRoots,
        getParticipantOfNode,
        getRoleOfNode,
        listParticipants,
        listParticipantLocators,
        resolveLocatorForBinding,
        findAmbiguousLocatorNames,
        exportParticleTracksForScene,
        importParticleTracksIntoAnimation,
        getStatus
    };
})();


/* === src/compat/pal_bridge.js === */
const PalBridge = (() => {
    const FALLBACK_BEND_HELPERS = {
        torso: 'torso_bend',
        right_arm: 'right_arm_bend',
        left_arm: 'left_arm_bend',
        right_leg: 'right_leg_bend',
        left_leg: 'left_leg_bend'
    };
    const FALLBACK_DRAGONCORE_MAP = {
        torso: 'Body_Upper',
        torso_bend: 'Body_Lower',
        right_arm: 'Right_Arm_Upper',
        right_arm_bend: 'Right_Arm_Lower',
        left_arm: 'Left_Arm_Upper',
        left_arm_bend: 'Left_Arm_Lower',
        right_leg: 'Right_Leg_Upper',
        right_leg_bend: 'Right_Leg_Lower',
        left_leg: 'Left_Leg_Upper',
        left_leg_bend: 'Left_Leg_Lower'
    };

    let palApi = null;
    let listenersInstalled = false;
    const cleanups = [];

    function syncApiFromGlobal() {
        const api = globalThis.PalBendPlayerToolsAPI;
        if (api && typeof api === 'object' && Number(api.apiVersion) >= 1) {
            palApi = api;
            return palApi;
        }
        palApi = null;
        return null;
    }

    function installListeners() {
        if (listenersInstalled) return;
        listenersInstalled = true;
        syncApiFromGlobal();

        const onReady = (ev) => {
            if (ev?.api && Number(ev.api.apiVersion) >= 1) {
                palApi = ev.api;
            } else {
                syncApiFromGlobal();
            }
            if (typeof ParticleCuePanel !== 'undefined' && typeof ParticleCuePanel.refresh === 'function') {
                ParticleCuePanel.refresh();
            }
        };
        const onUnloaded = () => {
            palApi = null;
            if (typeof ParticleCuePanel !== 'undefined' && typeof ParticleCuePanel.refresh === 'function') {
                ParticleCuePanel.refresh();
            }
        };

        if (typeof Blockbench !== 'undefined' && typeof Blockbench.on === 'function') {
            Blockbench.on('pal_bend_player_tools_ready', onReady);
            Blockbench.on('pal_bend_player_tools_unloaded', onUnloaded);
            cleanups.push(
                () => Blockbench.removeListener('pal_bend_player_tools_ready', onReady),
                () => Blockbench.removeListener('pal_bend_player_tools_unloaded', onUnloaded)
            );
        }
    }

    function uninstallListeners() {
        if (!listenersInstalled) return;
        listenersInstalled = false;
        while (cleanups.length) {
            try { cleanups.pop()(); } catch (_err) {}
        }
        palApi = null;
    }

    function getApi() {
        return palApi || syncApiFromGlobal();
    }

    function isAvailable() {
        return Boolean(getApi());
    }

    function normalizeBoneName(name) {
        const api = getApi();
        if (api && typeof api.normalizeBoneName === 'function') {
            try {
                return api.normalizeBoneName(name) || String(name || '');
            } catch (_err) {}
        }
        const raw = String(name || '').trim();
        for (const [canonical, dcName] of Object.entries(FALLBACK_DRAGONCORE_MAP)) {
            if (dcName.toLowerCase() === raw.toLowerCase()) return canonical;
        }
        return raw.toLowerCase();
    }

    function getBendHelperMap() {
        const api = getApi();
        return (api && api.bendHelperBones && typeof api.bendHelperBones === 'object')
            ? api.bendHelperBones
            : FALLBACK_BEND_HELPERS;
    }

    function detectProjectPalRig(scopeGroup) {
        if (typeof Group === 'undefined' || !Array.isArray(Group.all)) {
            return {isPalRig: false, preset: 'none', bendBones: {}};
        }
        const groups = scopeGroup
            ? Group.all.filter(g => g && typeof g.isChildOf === 'function' && g.isChildOf(scopeGroup))
            : Group.all;
        const helperNames = new Set(Object.values(getBendHelperMap()));
        const bendBones = {};
        let isDragoncore = false;

        for (const g of groups) {
            const raw = g.animcue_bone_name || g.name || '';
            const norm = normalizeBoneName(raw);
            if (helperNames.has(norm)) {
                bendBones[norm] = g;
            }
            if (Object.values(FALLBACK_DRAGONCORE_MAP).some(dc => dc.toLowerCase() === raw.toLowerCase())) {
                isDragoncore = true;
            }
        }

        const isPalRig = Object.keys(bendBones).length > 0
            || Boolean(typeof Project !== 'undefined' && Project?.pal_bend_player_tools_rig);
        const preset = !isPalRig
            ? 'none'
            : (isDragoncore || Project?.pal_bend_player_tools_rig === 'dragoncore' ? 'dragoncore' : 'player');

        return {isPalRig, preset, bendBones};
    }

    /**
     * Resolve exact world position and world quaternion for a particle keyframe binding,
     * coordinating both AnimCue multi-participant locator ownership and PAL bent bone hierarchy!
     *
     * When a locator sits under a PAL bend helper bone (e.g. `right_arm_bend` / `Right_Arm_Lower`)
     * or when a keyframe targets a PAL bone name directly, this ensures world matrix updates are
     * propagated down the full bent hierarchy before sampling world position & quaternion.
     */
    function resolveWorldPose(dp, bindingMeta) {
        if (typeof THREE === 'undefined') {
            return {locator: null, boneGroup: null, position: null, quaternion: null, role: 'primary', viaPalBend: false};
        }

        const resolved = typeof AnimCueBridge !== 'undefined'
            ? AnimCueBridge.resolveLocatorForBinding(dp, bindingMeta)
            : {
                locator: dp?.locator && typeof Locator !== 'undefined'
                    ? Locator.all.find(l => l.name === dp.locator) || null
                    : null,
                role: 'primary',
                participantGroup: null,
                boneGroup: null
            };

        let targetObj3D = resolved.locator?.mesh || null;
        let boneGroup = resolved.boneGroup || null;
        let viaPalBend = false;

        // Check if locator's ancestor is a PAL bend helper bone
        if (resolved.locator) {
            let cur = resolved.locator.parent;
            const helpers = new Set(Object.values(getBendHelperMap()));
            while (cur && cur !== 'root') {
                const raw = cur.animcue_bone_name || cur.name || '';
                if (helpers.has(normalizeBoneName(raw))) {
                    viaPalBend = true;
                    break;
                }
                cur = cur.parent;
            }
        }

        // If no Locator matched by name, check whether dp.locator names a PAL bend bone or canonical player bone
        if (!targetObj3D && dp?.locator) {
            const rawLoc = String(dp.locator).includes('::')
                ? String(dp.locator).split('::').pop().trim()
                : String(dp.locator).trim();
            const normTarget = normalizeBoneName(rawLoc);
            const rigInfo = detectProjectPalRig(resolved.participantGroup || null);

            if (rigInfo.bendBones[normTarget]?.mesh) {
                boneGroup = rigInfo.bendBones[normTarget];
                targetObj3D = boneGroup.mesh;
                viaPalBend = true;
            } else if (rigInfo.bendBones[getBendHelperMap()[normTarget]]?.mesh) {
                // If targeting e.g. `right_arm` on a bent rig without explicit locator, follow bend helper when bent
                const helperGroup = rigInfo.bendBones[getBendHelperMap()[normTarget]];
                boneGroup = helperGroup;
                targetObj3D = helperGroup.mesh;
                viaPalBend = true;
            } else if (boneGroup?.mesh) {
                targetObj3D = boneGroup.mesh;
            }
        }

        if (!targetObj3D) {
            return {
                locator: resolved.locator,
                boneGroup,
                position: new THREE.Vector3(0, 0, 0),
                quaternion: new THREE.Quaternion(),
                role: resolved.role,
                viaPalBend: false
            };
        }

        // Force world matrix sync along the ancestor chain (critical for PAL bend helper transforms)
        if (typeof Canvas !== 'undefined' && Canvas?.scene) {
            Canvas.scene.updateMatrixWorld(true);
        }
        targetObj3D.updateMatrixWorld(true);

        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        targetObj3D.getWorldPosition(position);
        targetObj3D.getWorldQuaternion(quaternion);

        return {
            locator: resolved.locator,
            boneGroup,
            position,
            quaternion,
            role: resolved.role,
            viaPalBend
        };
    }

    /**
     * Compile & validate a PAL / Emotecraft `.emote.json`-compatible `particle_effects` track
     * matching `pal_bend_player_tools.js:2845` and `LumenFX/PalKeyframeBridge.java`.
     */
    function buildEmoteParticleEffects(animation) {
        const anim = animation || (typeof Animation !== 'undefined' ? Animation.selected : null);
        if (!anim?.animators?.effects) return {};
        const kfs = Array.isArray(anim.animators.effects.particle) ? anim.animators.effects.particle : [];
        const sorted = kfs.slice().sort((a, b) => (Number(a.time) || 0) - (Number(b.time) || 0));
        const track = {};

        for (const kf of sorted) {
            const timeSec = Math.max(0, Number(kf.time) || 0);
            const timeKey = String(Number(timeSec.toFixed(4)));
            const entries = (kf.data_points || []).map(dp => {
                const entry = {
                    effect: String(dp.effect || '').trim()
                };
                if (dp.locator && String(dp.locator).trim()) {
                    entry.locator = String(dp.locator).trim();
                }
                if (dp.script && String(dp.script).trim()) {
                    entry.pre_effect_script = String(dp.script).trim();
                }
                return entry;
            }).filter(e => e.effect);

            if (!entries.length) continue;
            if (!track[timeKey]) {
                track[timeKey] = entries.length === 1 ? entries[0] : entries;
            } else {
                const existing = Array.isArray(track[timeKey]) ? track[timeKey] : [track[timeKey]];
                track[timeKey] = existing.concat(entries);
            }
        }
        return track;
    }

    function exportEmoteJsonWithParticles(animation, outputPath) {
        const anim = animation || (typeof Animation !== 'undefined' ? Animation.selected : null);
        if (!anim) throw new Error('No active animation selected for .emote.json export');

        const api = getApi();
        const rig = detectProjectPalRig(null);
        const particleEffects = buildEmoteParticleEffects(anim);

        // Compile standard Bedrock/PAL animation structure with bones + particle_effects
        let bonesPayload = {};
        if (api && typeof api.exportBoneTracks === 'function') {
            try {
                const exported = api.exportBoneTracks(anim.name, null, {preset: rig.preset !== 'none' ? rig.preset : 'player'});
                if (exported && typeof exported === 'object') {
                    bonesPayload = exported.bones || exported;
                }
            } catch (_err) {}
        }

        if (!Object.keys(bonesPayload).length && typeof anim.compileBedrockAnimation === 'function') {
            const compiled = anim.compileBedrockAnimation();
            bonesPayload = compiled?.bones || {};
        }

        const animObj = {
            loop: anim.loop === 'loop' ? true : (anim.loop === 'hold' ? 'hold_on_last_frame' : false),
            animation_length: Number(anim.length) || 0,
            bones: bonesPayload
        };
        if (Object.keys(particleEffects).length) {
            animObj.particle_effects = particleEffects;
        }

        const doc = {
            format_version: '1.8.0',
            animations: {
                [anim.name || 'emote']: animObj
            }
        };
        const text = JSON.stringify(doc, null, 2);
        if (outputPath) {
            Platform.writeTextFile(outputPath, text, Platform.dirname(outputPath));
        }
        return {
            doc,
            text,
            outputPath: outputPath || '',
            particleEventCount: Object.values(particleEffects).reduce((acc, v) => acc + (Array.isArray(v) ? v.length : 1), 0)
        };
    }

    function getStatus() {
        const api = getApi();
        const rig = detectProjectPalRig(null);
        return {
            available: Boolean(api),
            apiVersion: api?.apiVersion || 0,
            pluginVersion: api?.version || '',
            presets: Array.isArray(api?.presets) ? api.presets.slice() : [],
            isPalRig: rig.isPalRig,
            detectedRigPreset: rig.preset,
            bendBoneCount: Object.keys(rig.bendBones).length
        };
    }

    return {
        installListeners,
        uninstallListeners,
        getApi,
        isAvailable,
        normalizeBoneName,
        detectProjectPalRig,
        resolveWorldPose,
        buildEmoteParticleEffects,
        exportEmoteJsonWithParticles,
        getStatus
    };
})();


/* === src/project/keyframe_store.js === */
const KeyframeStore = (() => {
    const SCHEMA_VERSION = 2;
    const states = new Map(); // projectUuid -> state
    let hooksInstalled = false;
    const originals = {};
    const cleanups = [];

    function projectId(project) {
        const p = project || (typeof Project !== 'undefined' ? Project : null);
        return p ? (p.uuid || '__default__') : '__none__';
    }

    function getState(project, create = true) {
        const id = projectId(project);
        if (states.has(id)) return states.get(id);
        if (!create) return null;
        const p = project || (typeof Project !== 'undefined' ? Project : null);
        const state = {
            projectId: id,
            mode: 'linked', // 'linked' | 'embedded' | 'portable_zip'
            projectDir: p?.save_path ? Platform.dirname(p.save_path) : '',
            assets: new Map(),       // assetId -> AssetRecord
            bindings: new Map(),     // bindingKey -> assetId
            bindingMeta: new Map(),  // bindingKey -> { participantRole, locatorUuid }
            pathIndex: new Map(),    // normalizedPathKey -> assetId
            pendingMeta: null,
            lastDiagnostics: null
        };
        states.set(id, state);
        return state;
    }

    function makeBindingKey(animUuid, kfUuid, dpIndex) {
        return `${animUuid || ''}::${kfUuid || ''}::${Number(dpIndex) || 0}`;
    }

    function makeAssetId(fileName, contentHash) {
        const stem = Platform.sanitizeFilename(fileName || 'particle')
            .replace(/\.(particle\.json|json|fx)$/i, '')
            .slice(0, 32);
        const shortHash = String(contentHash || '00000000').slice(0, 12);
        return `pc_${stem}_${shortHash}`;
    }

    function makeVirtualPath(assetId, fileName) {
        const safeName = Platform.sanitizeFilename(fileName || 'particle.json');
        return `particlecue://asset/${assetId}/${safeName}`;
    }

    /**
     * Detect & inspect any supported particle asset format:
     * Priority order: Photon .fx -> KBR 3D Particle -> LumenFX JSON (incl. Unity/Niagara) -> Snowstorm/Bedrock
     */
    function inspectAnyAsset(rawInput, filePath, extraRoots = []) {
        if (rawInput === null || rawInput === undefined) return null;
        if (typeof PhotonFxAdapter !== 'undefined' && PhotonFxAdapter.canParse(rawInput, filePath)) {
            const m = PhotonFxAdapter.inspect(rawInput, filePath);
            if (m) return m;
        }
        if (typeof rawInput === 'string') {
            if (typeof KbrModelSchema !== 'undefined' && KbrModelSchema.canParse(rawInput, filePath)) {
                const m = KbrModelSchema.inspect(rawInput, filePath, extraRoots);
                if (m) return m;
            }
            if (typeof LumenFxSchema !== 'undefined' && LumenFxSchema.canParse(rawInput, filePath)) {
                const m = LumenFxSchema.inspect(rawInput, filePath, extraRoots);
                if (m) return m;
            }
            if (typeof SnowstormParser !== 'undefined' && SnowstormParser.canParse(rawInput, filePath)) {
                const m = SnowstormParser.inspect(rawInput, filePath);
                if (m) return m;
            }
        }
        return null;
    }

    function readFileForInspection(filePath, scopeHint) {
        if (!filePath || Platform.isVirtualPath(filePath)) return null;
        if (filePath.toLowerCase().endsWith('.fx')) {
            const bytes = Platform.readBinaryFile(filePath, scopeHint);
            return bytes ? PhotonFxAdapter.encodeBinaryString(bytes) : null;
        }
        return Platform.readTextFile(filePath, scopeHint);
    }

    function collectParticleDataPoints(project) {
        const p = project || (typeof Project !== 'undefined' ? Project : null);
        if (!p) return [];
        const anims = (p === (typeof Project !== 'undefined' ? Project : null) && typeof Animation !== 'undefined' && Array.isArray(Animation.all))
            ? Animation.all
            : (Array.isArray(p.animations) ? p.animations : []);

        const list = [];
        for (const anim of anims) {
            const effects = anim?.animators?.effects;
            const kfs = Array.isArray(effects?.particle) ? effects.particle : [];
            for (const kf of kfs) {
                const points = Array.isArray(kf.data_points) ? kf.data_points : [];
                for (let dpIdx = 0; dpIdx < points.length; dpIdx++) {
                    const dp = points[dpIdx];
                    list.push({
                        animation: anim,
                        animationUuid: anim.uuid,
                        animationName: anim.name || 'animation',
                        keyframe: kf,
                        keyframeUuid: kf.uuid,
                        time: Number(kf.time) || 0,
                        dataPointIndex: dpIdx,
                        dataPoint: dp,
                        bindingKey: makeBindingKey(anim.uuid, kf.uuid, dpIdx)
                    });
                }
            }
        }
        return list;
    }

    function syncPreviewForRecord(project, record, extraRoots = []) {
        if (!record || !record.rawText) return;
        const filePath = record.resolvedPath || record.originalPath || record.virtualPath;
        if (record.format === 'bedrock_snowstorm') {
            SnowstormPreview.registerOrUpdateAsset(project, record.id, record.rawText, {
                filePath,
                texturePath: record.texturePath,
                textureDataUrl: record.textureDataUrl
            });
        } else if (record.format === 'lumenfx_json' && typeof LumenFxPreview !== 'undefined') {
            LumenFxPreview.registerOrUpdateAsset(project, record.id, record.rawText, {
                filePath,
                extraRoots,
                textureDataUrl: record.textureDataUrl,
                embeddedTextures: record.embeddedTextures,
                embeddedMeshes: record.embeddedMeshes,
                embeddedShaders: record.embeddedShaders
            });
        } else if (record.format === 'photon_fx' && typeof LumenFxPreview !== 'undefined' && typeof PhotonFxAdapter !== 'undefined') {
            const meta = PhotonFxAdapter.inspect(record.rawText, filePath);
            if (meta?.previewLumenFx) {
                LumenFxPreview.registerOrUpdateAsset(project, record.id, JSON.stringify(meta.previewLumenFx), {
                    filePath,
                    extraRoots,
                    textureDataUrl: record.textureDataUrl,
                    embeddedTextures: record.embeddedTextures
                });
            }
        } else if (record.format === 'kbr_3d_particle' && typeof Kbr3dPreview !== 'undefined') {
            Kbr3dPreview.registerOrUpdateAsset(project, record.id, record.rawText, {
                filePath,
                extraRoots,
                textureDataUrl: record.textureDataUrl,
                embeddedModels: record.embeddedModels,
                embeddedTextures: record.embeddedTextures
            });
        }
    }

    function upsertAsset(project, info) {
        const state = getState(project, true);
        const rawText = typeof info.rawText === 'string' ? info.rawText : '';
        const hash = info.hash || (rawText ? Platform.sha256(rawText) : '');
        const fileName = info.fileName || Platform.basename(info.resolvedPath || info.originalPath || info.relativePath || 'particle.json') || 'particle.json';
        const id = info.id || makeAssetId(fileName, hash || Platform.sha256(info.originalPath || fileName));

        const existing = state.assets.get(id) || {};
        const record = {
            id,
            format: info.format || existing.format || 'bedrock_snowstorm',
            originKind: info.originKind ?? existing.originKind ?? '',
            fileName,
            originalPath: info.originalPath ?? existing.originalPath ?? '',
            relativePath: info.relativePath ?? existing.relativePath ?? '',
            resolvedPath: info.resolvedPath ?? existing.resolvedPath ?? '',
            virtualPath: info.virtualPath || existing.virtualPath || makeVirtualPath(id, fileName),
            rawText: rawText || existing.rawText || '',
            hash: hash || existing.hash || '',
            identifier: info.identifier ?? existing.identifier ?? '',
            textureRef: info.textureRef ?? existing.textureRef ?? '',
            isBuiltinTexture: info.isBuiltinTexture ?? existing.isBuiltinTexture ?? false,
            texturePath: info.texturePath ?? existing.texturePath ?? '',
            textureRelativePath: info.textureRelativePath ?? existing.textureRelativePath ?? '',
            textureDataUrl: info.textureDataUrl ?? existing.textureDataUrl ?? '',
            textureHash: info.textureHash ?? existing.textureHash ?? '',
            textureDimensions: info.textureDimensions ?? existing.textureDimensions ?? null,
            embeddedTextures: Object.assign({}, existing.embeddedTextures || {}, info.embeddedTextures || {}),
            embeddedMeshes: Object.assign({}, existing.embeddedMeshes || {}, info.embeddedMeshes || {}),
            embeddedShaders: Object.assign({}, existing.embeddedShaders || {}, info.embeddedShaders || {}),
            embeddedModels: Object.assign({}, existing.embeddedModels || {}, info.embeddedModels || {}),
            extraDeps: info.extraDeps ?? existing.extraDeps ?? null,
            models: Array.isArray(info.models) ? info.models.slice() : (existing.models || []),
            status: info.status || existing.status || (rawText ? 'resolved' : 'missing'),
            missingDependencies: Array.isArray(info.missingDependencies) ? info.missingDependencies.slice() : (existing.missingDependencies || [])
        };

        state.assets.set(id, record);
        indexAssetPaths(state, record);
        syncPreviewForRecord(project, record, state.projectDir ? [state.projectDir] : []);
        return record;
    }

    function indexAssetPaths(state, record) {
        const keys = [record.resolvedPath, record.originalPath, record.relativePath, record.virtualPath];
        for (const p of keys) {
            if (!p) continue;
            state.pathIndex.set(Platform.pathKey(p), record.id);
        }
    }

    function bindDataPoint(project, animUuid, kfUuid, dpIndex, assetId) {
        const state = getState(project, true);
        const key = makeBindingKey(animUuid, kfUuid, dpIndex);
        state.bindings.set(key, assetId);
    }

    function setBindingMeta(project, animUuid, kfUuid, dpIndex, meta) {
        const state = getState(project, true);
        const key = makeBindingKey(animUuid, kfUuid, dpIndex);
        if (!meta) {
            state.bindingMeta.delete(key);
        } else {
            state.bindingMeta.set(key, {
                participantRole: meta.participantRole || 'primary',
                locatorUuid: meta.locatorUuid || ''
            });
        }
    }

    function getBindingMeta(project, animUuid, kfUuid, dpIndex) {
        const state = getState(project, false);
        if (!state) return null;
        return state.bindingMeta.get(makeBindingKey(animUuid, kfUuid, dpIndex)) || null;
    }

    function resolveAssetKeyForDataPoint(project, kf, dpIndex, dp) {
        const state = getState(project, false);
        if (!state) return null;
        const animUuid = kf?.animator?.animation?.uuid || '';
        const bKey = makeBindingKey(animUuid, kf?.uuid, dpIndex);
        const boundId = state.bindings.get(bKey);
        if (boundId && state.assets.has(boundId)) {
            return boundId;
        }
        if (dp?.file) {
            const pKey = Platform.pathKey(dp.file);
            const byPath = state.pathIndex.get(pKey);
            if (byPath && state.assets.has(byPath)) return byPath;
            for (const rec of state.assets.values()) {
                if (rec.virtualPath === dp.file || Platform.pathKey(rec.resolvedPath) === pKey || Platform.pathKey(rec.originalPath) === pKey) {
                    return rec.id;
                }
            }
        }
        return null;
    }

    function getAssetById(project, assetId) {
        const state = getState(project, false);
        return state ? (state.assets.get(assetId) || null) : null;
    }

    function updateAssetContent(project, assetId, newRawInput, newTexturePathOrDataUrl) {
        const state = getState(project, false);
        if (!state) return null;
        const existing = state.assets.get(assetId);
        if (!existing) return null;
        const extraRoots = state.projectDir ? [state.projectDir] : [];
        const meta = inspectAnyAsset(newRawInput, existing.resolvedPath || existing.virtualPath, extraRoots);
        if (!meta) {
            throw new Error(`Invalid particle content for asset ${existing.fileName}`);
        }
        existing.format = meta.format;
        existing.originKind = meta.originKind || existing.originKind || '';
        existing.rawText = meta.rawText;
        existing.hash = Platform.sha256(meta.rawText);
        existing.identifier = meta.identifier;
        existing.textureRef = meta.textureRef ?? existing.textureRef;
        existing.isBuiltinTexture = meta.isBuiltinTexture ?? existing.isBuiltinTexture;

        if (typeof newTexturePathOrDataUrl === 'string' && newTexturePathOrDataUrl.length) {
            if (newTexturePathOrDataUrl.startsWith('data:')) {
                existing.textureDataUrl = newTexturePathOrDataUrl;
                const decoded = Platform.dataUrlToBinary(newTexturePathOrDataUrl);
                if (decoded) {
                    existing.textureHash = Platform.sha256(decoded.bytes);
                    existing.textureDimensions = Platform.readPngDimensions(decoded.bytes);
                }
            } else {
                existing.texturePath = newTexturePathOrDataUrl;
                const bytes = Platform.readBinaryFile(newTexturePathOrDataUrl);
                if (bytes) {
                    existing.textureHash = Platform.sha256(bytes);
                    existing.textureDimensions = Platform.readPngDimensions(bytes);
                    if (state.mode === 'embedded') {
                        existing.textureDataUrl = Platform.binaryToDataUrl(bytes, Platform.guessMimeType(newTexturePathOrDataUrl));
                    }
                }
            }
        }

        syncPreviewForRecord(project, existing, extraRoots);
        if (typeof Project !== 'undefined' && Project) {
            Project.saved = false;
        }
        if (typeof Animator !== 'undefined' && Animator.open && typeof Animator.preview === 'function') {
            Animator.preview();
        }
        return existing;
    }

    function registerUploadedFile(project, filePath, content) {
        const state = getState(project, true);
        const extraRoots = [];
        if (state.projectDir) extraRoots.push(state.projectDir);

        let rawInput = content;
        if ((rawInput === undefined || rawInput === null || (typeof filePath === 'string' && filePath.toLowerCase().endsWith('.fx') && typeof rawInput === 'string' && !rawInput.startsWith('PHOTON_FX_B64:'))) && filePath) {
            rawInput = readFileForInspection(filePath, Platform.dirname(filePath));
        }

        const meta = inspectAnyAsset(rawInput, filePath, extraRoots);
        if (!meta) return null;

        let texPath = '';
        let texDataUrl = '';
        let texHash = '';
        let texDims = null;
        const missingDependencies = [];
        const embeddedModels = {};
        const embeddedTextures = {};
        const embeddedMeshes = {};
        const embeddedShaders = {};

        if (meta.format === 'bedrock_snowstorm') {
            texPath = meta.textureRef && !meta.isBuiltinTexture
                ? (SnowstormParser.resolveTextureOnDisk(meta.textureRef, filePath, extraRoots) || '')
                : '';
            if (texPath) {
                const bytes = Platform.readBinaryFile(texPath);
                if (bytes) {
                    texHash = Platform.sha256(bytes);
                    texDims = Platform.readPngDimensions(bytes);
                    if (state.mode === 'embedded') {
                        texDataUrl = Platform.binaryToDataUrl(bytes, Platform.guessMimeType(texPath));
                    }
                }
            }
            if (meta.textureRef && !meta.isBuiltinTexture && !texPath && !texDataUrl) {
                missingDependencies.push({type: 'texture', ref: meta.textureRef});
            }
        } else if (meta.format === 'lumenfx_json') {
            for (const t of (meta.dependencies?.textures || [])) {
                if (t.resolvedPath) {
                    if (!texPath) texPath = t.resolvedPath;
                    if (state.mode === 'embedded') {
                        const bytes = Platform.readBinaryFile(t.resolvedPath);
                        if (bytes) embeddedTextures[t.ref] = Platform.binaryToDataUrl(bytes, Platform.guessMimeType(t.resolvedPath));
                    }
                }
            }
            for (const s of (meta.dependencies?.shaders || [])) {
                if (s.resolvedPath && state.mode === 'embedded') {
                    const txt = Platform.readTextFile(s.resolvedPath);
                    if (txt) embeddedShaders[s.ref] = txt;
                }
            }
            for (const m of (meta.dependencies?.meshes || [])) {
                if (m.lfmeshPath && state.mode === 'embedded') {
                    const bytes = Platform.readBinaryFile(m.lfmeshPath);
                    if (bytes) embeddedMeshes[m.ref] = Platform.bytesToBase64(bytes);
                }
            }
            for (const miss of (meta.dependencies?.missing || [])) {
                missingDependencies.push(miss);
            }
        } else if (meta.format === 'kbr_3d_particle') {
            texPath = meta.texturePath || '';
            for (const d of (meta.descriptors || [])) {
                if (d.descriptor) {
                    const geomText = d.geometryPath ? Platform.readTextFile(d.geometryPath) : '';
                    embeddedModels[d.ref] = {
                        descriptor: d.descriptor.raw || d.descriptor,
                        geometryJson: geomText ? KbrModelSchema.safeParseJson(geomText) : null
                    };
                }
                if (d.texturePath) {
                    if (!texPath) texPath = d.texturePath;
                    const bytes = Platform.readBinaryFile(d.texturePath);
                    if (bytes && state.mode === 'embedded') {
                        embeddedTextures[d.descriptor?.texture || d.ref] = Platform.binaryToDataUrl(bytes, Platform.guessMimeType(d.texturePath));
                    }
                }
            }
            for (const miss of (meta.missingDependencies || [])) {
                missingDependencies.push(miss);
            }
        }

        const relPath = state.projectDir && filePath && !Platform.isVirtualPath(filePath)
            ? Platform.relativePath(state.projectDir, filePath)
            : '';
        const contentHash = Platform.sha256(meta.rawText);

        let existingId = filePath
            ? (state.pathIndex.get(Platform.pathKey(filePath)) || (relPath ? state.pathIndex.get(Platform.pathKey(relPath)) : undefined))
            : undefined;
        if (!existingId) {
            for (const rec of state.assets.values()) {
                if (rec.hash && rec.hash === contentHash && (!rec.resolvedPath || !filePath || Platform.pathKey(rec.resolvedPath) === Platform.pathKey(filePath))) {
                    existingId = rec.id;
                    break;
                }
            }
        }

        const defaultExt = meta.format === 'photon_fx' ? '.fx' : (meta.format === 'bedrock_snowstorm' ? '.particle.json' : '.json');
        const record = upsertAsset(project, {
            id: existingId,
            format: meta.format,
            originKind: meta.originKind || '',
            fileName: Platform.basename(filePath || '') || `${Platform.sanitizeFilename(meta.identifier || 'particle')}${defaultExt}`,
            originalPath: filePath || '',
            relativePath: relPath,
            resolvedPath: filePath || '',
            rawText: meta.rawText,
            hash: contentHash,
            identifier: meta.identifier,
            textureRef: meta.textureRef || '',
            isBuiltinTexture: Boolean(meta.isBuiltinTexture),
            texturePath: texPath || '',
            textureDataUrl: texDataUrl,
            textureHash: texHash,
            textureDimensions: texDims,
            embeddedTextures,
            embeddedMeshes,
            embeddedShaders,
            embeddedModels,
            status: state.mode === 'embedded' ? 'embedded' : 'resolved',
            missingDependencies
        });

        if (filePath) {
            const pKey = Platform.pathKey(filePath);
            for (const entry of collectParticleDataPoints(project)) {
                if (entry.dataPoint?.file && Platform.pathKey(entry.dataPoint.file) === pKey) {
                    bindDataPoint(project, entry.animationUuid, entry.keyframeUuid, entry.dataPointIndex, record.id);
                }
            }
        }
        return record;
    }

    /**
     * Create a new in-project or on-disk particle asset and bind it to a particle keyframe
     * on the active (or specified) animation at the given time.
     */
    function createAndBindEffect(project, options = {}) {
        const p = project || (typeof Project !== 'undefined' ? Project : null);
        if (!p) throw new Error('No active Blockbench project');
        let anim = options.animation || (typeof Animation !== 'undefined' ? Animation.selected : null);
        if (!anim && typeof Animation !== 'undefined' && Array.isArray(Animation.all) && Animation.all.length) {
            anim = Animation.all[0];
        }
        if (!anim) throw new Error('No animation found in current project');
        if (!anim.animators?.effects && typeof anim.getBoneAnimator === 'function') {
            anim.animators.effects = new EffectAnimator(anim);
        }
        const effects = anim.animators?.effects;
        if (!effects) throw new Error('Effects animator unavailable on animation');

        const state = getState(p, true);
        const rawText = options.rawText || '';
        const filePath = options.filePath || '';
        const meta = inspectAnyAsset(rawText, filePath || options.fileName, state.projectDir ? [state.projectDir] : []);
        if (!meta) throw new Error('Unable to parse created particle content');

        const hash = Platform.sha256(meta.rawText);
        const defaultExt = meta.format === 'photon_fx' ? '.fx' : '.json';
        const fileName = options.fileName || Platform.basename(filePath) || `${Platform.sanitizeFilename(meta.identifier || 'effect')}${defaultExt}`;
        const assetId = makeAssetId(fileName, hash);
        const virtualPath = makeVirtualPath(assetId, fileName);

        const record = upsertAsset(p, {
            id: assetId,
            format: meta.format,
            originKind: meta.originKind || '',
            fileName,
            originalPath: filePath || virtualPath,
            resolvedPath: filePath || '',
            virtualPath,
            rawText: meta.rawText,
            hash,
            identifier: meta.identifier,
            textureRef: meta.textureRef || '',
            isBuiltinTexture: Boolean(meta.isBuiltinTexture),
            texturePath: options.texturePath || meta.texturePath || '',
            textureDataUrl: options.textureDataUrl || '',
            embeddedModels: options.embeddedModels || {},
            embeddedTextures: options.embeddedTextures || {},
            embeddedMeshes: options.embeddedMeshes || {},
            status: filePath ? 'resolved' : 'embedded'
        });

        const time = Number.isFinite(Number(options.time))
            ? Number(options.time)
            : (typeof Timeline !== 'undefined' ? (Number(Timeline.time) || 0) : 0);
        const dp = {
            effect: options.effectName || record.identifier || fileName,
            locator: options.locator || '',
            script: options.script || '',
            file: filePath || record.virtualPath
        };
        const kf = effects.addKeyframe({
            channel: 'particle',
            time,
            data_points: [dp]
        });
        const dpIdx = Math.max(0, (kf.data_points?.length || 1) - 1);
        bindDataPoint(p, anim.uuid, kf.uuid, dpIdx, record.id);
        if (options.participantRole || options.locatorUuid) {
            setBindingMeta(p, anim.uuid, kf.uuid, dpIdx, {
                participantRole: options.participantRole || 'primary',
                locatorUuid: options.locatorUuid || ''
            });
        }

        if (typeof AssetResolver !== 'undefined' && typeof AssetResolver.scanProject === 'function') {
            AssetResolver.scanProject(p, {notify: false});
        }
        if (typeof Animator !== 'undefined' && Animator.open && typeof Animator.preview === 'function') {
            Animator.preview();
        }
        if (typeof ParticleCuePanel !== 'undefined' && typeof ParticleCuePanel.refresh === 'function') {
            ParticleCuePanel.refresh();
        }
        return {record, keyframe: kf, dataPointIndex: dpIdx};
    }

    function serializeProjectMetadata(project, options = {}) {
        const state = getState(project, false);
        const entries = collectParticleDataPoints(project);
        if (!state || (!entries.length && !state.assets.size)) return null;

        const embed = options.embed !== undefined ? Boolean(options.embed) : (state.mode === 'embedded');
        const usedAssetIds = new Set();
        const bindings = {};
        const bindingMetaOut = {};

        for (const item of entries) {
            const assetId = resolveAssetKeyForDataPoint(project, item.keyframe, item.dataPointIndex, item.dataPoint);
            if (assetId) {
                usedAssetIds.add(assetId);
                bindings[item.bindingKey] = assetId;
            }
            const bm = state.bindingMeta.get(item.bindingKey);
            if (bm && (bm.participantRole || bm.locatorUuid)) {
                bindingMetaOut[item.bindingKey] = {
                    participantRole: bm.participantRole || 'primary',
                    locatorUuid: bm.locatorUuid || ''
                };
            }
        }

        const assetsOut = {};
        const projDir = options.projectDir || (project?.save_path ? Platform.dirname(project.save_path) : state.projectDir);

        for (const assetId of usedAssetIds) {
            const rec = state.assets.get(assetId);
            if (!rec) continue;
            const relFromSave = (!embed && projDir && rec.resolvedPath && !Platform.isVirtualPath(rec.resolvedPath))
                ? Platform.relativePath(projDir, rec.resolvedPath)
                : rec.relativePath;
            const texRelFromSave = (!embed && projDir && rec.texturePath && !Platform.isVirtualPath(rec.texturePath))
                ? Platform.relativePath(projDir, rec.texturePath)
                : rec.textureRelativePath;

            const serialized = {
                id: rec.id,
                format: rec.format,
                originKind: rec.originKind || undefined,
                fileName: rec.fileName,
                identifier: rec.identifier,
                hash: rec.hash,
                textureRef: rec.textureRef,
                isBuiltinTexture: rec.isBuiltinTexture,
                textureHash: rec.textureHash,
                textureDimensions: rec.textureDimensions || undefined,
                relativePath: !embed ? (relFromSave || undefined) : undefined,
                textureRelativePath: !embed ? (texRelFromSave || undefined) : undefined,
                originalPathHint: !embed ? (rec.originalPath || undefined) : undefined,
                virtualPath: embed ? rec.virtualPath : undefined
            };

            if (embed || !rec.resolvedPath) {
                serialized.rawText = rec.rawText;
                if (rec.textureDataUrl) {
                    serialized.textureDataUrl = rec.textureDataUrl;
                } else if (rec.texturePath && Platform.fileExists(rec.texturePath)) {
                    const bytes = Platform.readBinaryFile(rec.texturePath);
                    if (bytes) {
                        serialized.textureDataUrl = Platform.binaryToDataUrl(bytes, Platform.guessMimeType(rec.texturePath));
                        serialized.textureHash = Platform.sha256(bytes);
                        serialized.textureDimensions = Platform.readPngDimensions(bytes) || undefined;
                    }
                }
                if (rec.embeddedTextures && Object.keys(rec.embeddedTextures).length) {
                    serialized.embeddedTextures = rec.embeddedTextures;
                }
                if (rec.embeddedMeshes && Object.keys(rec.embeddedMeshes).length) {
                    serialized.embeddedMeshes = rec.embeddedMeshes;
                }
                const embeddedShadersOut = Object.assign({}, rec.embeddedShaders || {});
                if (rec.format === 'lumenfx_json' && typeof LumenFxSchema !== 'undefined' && rec.rawText) {
                    const lm = LumenFxSchema.inspect(rec.rawText, rec.resolvedPath || rec.originalPath || '', projDir ? [projDir] : []);
                    if (lm?.dependencies?.shaders) {
                        for (const s of lm.dependencies.shaders) {
                            if (!embeddedShadersOut[s.ref] && s.resolvedPath && Platform.fileExists(s.resolvedPath)) {
                                const txt = Platform.readTextFile(s.resolvedPath);
                                if (txt) embeddedShadersOut[s.ref] = txt;
                            }
                        }
                    }
                }
                if (Object.keys(embeddedShadersOut).length) {
                    serialized.embeddedShaders = embeddedShadersOut;
                }
                if (rec.embeddedModels && Object.keys(rec.embeddedModels).length) {
                    serialized.embeddedModels = rec.embeddedModels;
                }
                if (Array.isArray(rec.models) && rec.models.length) {
                    serialized.models = rec.models;
                }
            }
            assetsOut[assetId] = serialized;
        }

        if (!Object.keys(assetsOut).length && !Object.keys(bindings).length && !Object.keys(bindingMetaOut).length) {
            return null;
        }

        return {
            schemaVersion: SCHEMA_VERSION,
            mode: embed ? 'embedded' : (options.mode || state.mode || 'linked'),
            assets: assetsOut,
            bindings,
            bindingMeta: Object.keys(bindingMetaOut).length ? bindingMetaOut : undefined
        };
    }

    function hydrateFromMetadata(project, meta, projectPath) {
        const state = getState(project, true);
        if (projectPath && !Platform.isVirtualPath(projectPath)) {
            state.projectDir = Platform.dirname(projectPath);
        }
        if (!meta || typeof meta !== 'object') return;

        state.mode = meta.mode || 'linked';
        if (meta.bindings && typeof meta.bindings === 'object') {
            for (const [bKey, assetId] of Object.entries(meta.bindings)) {
                if (typeof assetId === 'string') {
                    state.bindings.set(bKey, assetId);
                }
            }
        }
        if (meta.bindingMeta && typeof meta.bindingMeta === 'object') {
            for (const [bKey, bm] of Object.entries(meta.bindingMeta)) {
                if (bm && typeof bm === 'object') {
                    state.bindingMeta.set(bKey, {
                        participantRole: bm.participantRole || 'primary',
                        locatorUuid: bm.locatorUuid || ''
                    });
                }
            }
        }
        if (meta.assets && typeof meta.assets === 'object') {
            for (const [assetId, info] of Object.entries(meta.assets)) {
                if (!info || typeof info !== 'object') continue;
                const resolvedFromRel = (state.projectDir && info.relativePath)
                    ? Platform.resolvePath(state.projectDir, info.relativePath)
                    : '';
                const resolvedTexFromRel = (state.projectDir && info.textureRelativePath)
                    ? Platform.resolvePath(state.projectDir, info.textureRelativePath)
                    : '';

                let rawText = typeof info.rawText === 'string' ? info.rawText : '';
                let resolvedPath = '';
                if (!rawText && resolvedFromRel && Platform.fileExists(resolvedFromRel)) {
                    rawText = readFileForInspection(resolvedFromRel) || '';
                    resolvedPath = resolvedFromRel;
                }
                const texturePath = (resolvedTexFromRel && Platform.fileExists(resolvedTexFromRel))
                    ? resolvedTexFromRel
                    : '';

                const hydratedShaders = Object.assign({}, info.embeddedShaders || {});
                if (state.projectDir && info.shaderRelativePaths && typeof info.shaderRelativePaths === 'object') {
                    for (const [sRef, sRel] of Object.entries(info.shaderRelativePaths)) {
                        if (!hydratedShaders[sRef] && typeof sRel === 'string') {
                            const fullSh = Platform.resolvePath(state.projectDir, sRel);
                            if (Platform.fileExists(fullSh)) {
                                const sTxt = Platform.readTextFile(fullSh);
                                if (sTxt) hydratedShaders[sRef] = sTxt;
                            }
                        }
                    }
                }

                const hydratedTextures = Object.assign({}, info.embeddedTextures || {});
                if (state.projectDir && info.extraTextureRelativePaths && typeof info.extraTextureRelativePaths === 'object') {
                    for (const [tRef, tRel] of Object.entries(info.extraTextureRelativePaths)) {
                        if (!hydratedTextures[tRef] && typeof tRel === 'string') {
                            const fullTx = Platform.resolvePath(state.projectDir, tRel);
                            if (Platform.fileExists(fullTx)) {
                                const tBytes = Platform.readBinaryFile(fullTx);
                                if (tBytes) hydratedTextures[tRef] = Platform.binaryToDataUrl(tBytes, Platform.guessMimeType(fullTx));
                            }
                        }
                    }
                }

                const hydratedMeshes = Object.assign({}, info.embeddedMeshes || {});
                if (state.projectDir && info.meshRelativePaths && typeof info.meshRelativePaths === 'object') {
                    for (const [mRef, mRel] of Object.entries(info.meshRelativePaths)) {
                        if (!hydratedMeshes[mRef] && typeof mRel === 'string') {
                            const fullMesh = Platform.resolvePath(state.projectDir, mRel);
                            if (Platform.fileExists(fullMesh)) {
                                const mBytes = Platform.readBinaryFile(fullMesh);
                                if (mBytes) hydratedMeshes[mRef] = Platform.bytesToBase64(mBytes);
                            }
                        }
                    }
                }

                const hydratedModels = Object.assign({}, info.embeddedModels || {});
                if (state.projectDir && info.modelRelativePaths && typeof info.modelRelativePaths === 'object') {
                    for (const [mRef, mPaths] of Object.entries(info.modelRelativePaths)) {
                        const entryObj = Object.assign({}, hydratedModels[mRef] || {});
                        if (mPaths?.descriptorPath && !entryObj.descriptor) {
                            const fullDesc = Platform.resolvePath(state.projectDir, mPaths.descriptorPath);
                            if (Platform.fileExists(fullDesc)) {
                                try { entryObj.descriptor = JSON.parse(Platform.readTextFile(fullDesc)); } catch (_e) {}
                            }
                        }
                        if (mPaths?.geometryPath && !entryObj.geometryJson) {
                            const fullGeo = Platform.resolvePath(state.projectDir, mPaths.geometryPath);
                            if (Platform.fileExists(fullGeo)) {
                                try { entryObj.geometryJson = JSON.parse(Platform.readTextFile(fullGeo)); } catch (_e) {}
                            }
                        }
                        if (entryObj.descriptor || entryObj.geometryJson) {
                            hydratedModels[mRef] = entryObj;
                        }
                    }
                }

                upsertAsset(project, {
                    id: info.id || assetId,
                    format: info.format || 'bedrock_snowstorm',
                    originKind: info.originKind || '',
                    fileName: info.fileName || 'particle.json',
                    originalPath: info.originalPathHint || '',
                    relativePath: info.relativePath || '',
                    resolvedPath,
                    virtualPath: info.virtualPath || makeVirtualPath(info.id || assetId, info.fileName),
                    rawText,
                    hash: info.hash || (rawText ? Platform.sha256(rawText) : ''),
                    identifier: info.identifier || '',
                    textureRef: info.textureRef || '',
                    isBuiltinTexture: Boolean(info.isBuiltinTexture),
                    texturePath,
                    textureRelativePath: info.textureRelativePath || '',
                    textureDataUrl: info.textureDataUrl || '',
                    textureHash: info.textureHash || '',
                    textureDimensions: info.textureDimensions || null,
                    embeddedTextures: hydratedTextures,
                    embeddedMeshes: hydratedMeshes,
                    embeddedShaders: hydratedShaders,
                    embeddedModels: hydratedModels,
                    models: Array.isArray(info.models) ? info.models : [],
                    status: rawText ? (state.mode === 'embedded' ? 'embedded' : 'resolved') : 'missing'
                });
            }
        }
    }

    function disposeProject(project) {
        const id = projectId(project);
        states.delete(id);
    }

    function installHooks() {
        if (hooksInstalled) return;
        hooksInstalled = true;

        // 0. Wrap KeyframeDataPoint.prototype.extend so virtual particlecue:// paths, non-Snowstorm files (.fx/LumenFX/KBR),
        //    and missing legacy paths are preserved without spamming native Blockbench ENOENT/JSON errors.
        if (typeof KeyframeDataPoint !== 'undefined' && KeyframeDataPoint.prototype?.extend) {
            originals.dpExtend = KeyframeDataPoint.prototype.extend;
            KeyframeDataPoint.prototype.extend = function (data) {
                if (this.keyframe?.channel === 'particle' && data && typeof data.file === 'string' && data.file.trim()) {
                    const rawFile = data.file.trim();
                    if (Platform.isVirtualPath(rawFile) || rawFile.toLowerCase().endsWith('.fx')) {
                        const cloned = Object.assign({}, data, {file: ''});
                        const res = originals.dpExtend.call(this, cloned);
                        this.file = rawFile;
                        return res;
                    }
                    const projDir = (typeof Project !== 'undefined' && Project?.save_path) ? Platform.dirname(Project.save_path) : '';
                    const candidate = (!Platform.isAbsolutePath(rawFile) && projDir)
                        ? Platform.resolvePath(projDir, rawFile)
                        : rawFile;
                    if (typeof isApp !== 'undefined' && isApp && !Platform.fileExists(candidate)) {
                        const cloned = Object.assign({}, data, {file: ''});
                        const res = originals.dpExtend.call(this, cloned);
                        this.file = rawFile;
                        return res;
                    }
                }
                return originals.dpExtend.call(this, data);
            };
        }

        // 1. Wrap Animator.loadParticleEmitter to support Snowstorm + LumenFX + KBR 3D + Photon .fx
        if (typeof Animator !== 'undefined' && typeof Animator.loadParticleEmitter === 'function') {
            originals.loadParticleEmitter = Animator.loadParticleEmitter;
            Animator.loadParticleEmitter = function (filePath, content) {
                const project = typeof Project !== 'undefined' ? Project : null;
                const record = registerUploadedFile(project, filePath, content);

                // For non-Snowstorm formats, bypass native Wintersky parser (which only understands Snowstorm)
                if (record && record.format !== 'bedrock_snowstorm') {
                    if (typeof ParticleCuePanel !== 'undefined' && typeof ParticleCuePanel.refresh === 'function') {
                        ParticleCuePanel.refresh();
                    }
                    return null;
                }

                const result = originals.loadParticleEmitter.call(this, filePath, content);
                if (result?.config && record) {
                    const resolvedTex = record.textureDataUrl || (record.texturePath ? Platform.toFileUrl(record.texturePath) : '');
                    if (resolvedTex && (!result.config.texture_source_category || result.config.texture_source_category === 'placeholder')) {
                        result.config.preview_texture = record.texturePath || record.textureDataUrl;
                        result.config.updateTexture();
                    }
                    const origUpdateTex = result.config.updateTexture.bind(result.config);
                    result.config.updateTexture = function () {
                        const out = origUpdateTex();
                        if (this.preview_texture && project) {
                            const texVal = this.preview_texture;
                            if (typeof texVal === 'string' && texVal.length) {
                                if (texVal.startsWith('data:')) {
                                    record.textureDataUrl = texVal;
                                } else {
                                    record.texturePath = texVal;
                                }
                                SnowstormPreview.updateAssetTexture(project, record.id, texVal);
                            }
                        }
                        return out;
                    };
                }
                if (typeof ParticleCuePanel !== 'undefined' && typeof ParticleCuePanel.refresh === 'function') {
                    ParticleCuePanel.refresh();
                }
                return result;
            };
        }

        // 2. Hook load_project (runs BEFORE animations parse in bbmodel.js:444)
        const onLoadProject = ({model, path}) => {
            const project = typeof Project !== 'undefined' ? Project : null;
            if (!project) return;
            const state = getState(project, true);
            if (path && !Platform.isVirtualPath(path)) {
                state.projectDir = Platform.dirname(path);
            }
            if (model && model.particlecue_studio) {
                state.pendingMeta = model.particlecue_studio;
                hydrateFromMetadata(project, model.particlecue_studio, path || project.save_path);
            } else {
                state.pendingMeta = null;
            }
        };

        // 3. Hook Codecs.project parsed (runs AFTER animations/locators are fully built)
        const onParsed = ({model}) => {
            const project = typeof Project !== 'undefined' ? Project : null;
            if (!project) return;
            const state = getState(project, true);
            if (project.save_path && !Platform.isVirtualPath(project.save_path)) {
                state.projectDir = Platform.dirname(project.save_path);
            }
            if (model?.particlecue_studio && !state.assets.size) {
                hydrateFromMetadata(project, model.particlecue_studio, project.save_path);
            }
            const report = AssetResolver.scanProject(project, {notify: true});
            state.lastDiagnostics = report;
            if (typeof Animator !== 'undefined' && Animator.open && typeof Animator.preview === 'function') {
                Animator.preview();
            }
            if (typeof ParticleCuePanel !== 'undefined' && typeof ParticleCuePanel.refresh === 'function') {
                ParticleCuePanel.refresh();
            }
        };

        // 4. Hook save_project (bbmodel.js:397)
        const onSaveProject = ({model, options}) => {
            if (!model || options?.backup) return;
            const project = typeof Project !== 'undefined' ? Project : null;
            if (!project) return;
            const state = getState(project, false);
            if (!state) return;

            const isEmbedded = state.mode === 'embedded';
            const payload = serializeProjectMetadata(project, {embed: isEmbedded});
            if (payload) {
                model.particlecue_studio = payload;
                if (isEmbedded && Array.isArray(model.animations)) {
                    for (const anim of model.animations) {
                        const kfs = anim?.animators?.effects?.keyframes;
                        if (!Array.isArray(kfs)) continue;
                        for (const kf of kfs) {
                            if (kf.channel !== 'particle' || !Array.isArray(kf.data_points)) continue;
                            kf.data_points.forEach((dp, dpIdx) => {
                                const bKey = makeBindingKey(anim.uuid, kf.uuid, dpIdx);
                                const assetId = payload.bindings[bKey];
                                const asset = assetId && payload.assets[assetId];
                                if (asset && asset.virtualPath) {
                                    dp.file = asset.virtualPath;
                                }
                            });
                        }
                    }
                }
            }
        };

        const onCloseProject = ({project}) => {
            disposeProject(project);
        };

        Blockbench.on('load_project', onLoadProject);
        Blockbench.on('save_project', onSaveProject);
        Blockbench.on('close_project', onCloseProject);
        if (typeof Codecs !== 'undefined' && Codecs.project && typeof Codecs.project.on === 'function') {
            Codecs.project.on('parsed', onParsed);
            cleanups.push(() => Codecs.project.removeListener('parsed', onParsed));
        }
        cleanups.push(
            () => Blockbench.removeListener('load_project', onLoadProject),
            () => Blockbench.removeListener('save_project', onSaveProject),
            () => Blockbench.removeListener('close_project', onCloseProject)
        );
    }

    function uninstallHooks() {
        if (!hooksInstalled) return;
        hooksInstalled = false;
        if (originals.dpExtend && typeof KeyframeDataPoint !== 'undefined') {
            KeyframeDataPoint.prototype.extend = originals.dpExtend;
        }
        if (originals.loadParticleEmitter && typeof Animator !== 'undefined') {
            Animator.loadParticleEmitter = originals.loadParticleEmitter;
        }
        while (cleanups.length) {
            try { cleanups.pop()(); } catch (_err) {}
        }
        states.clear();
    }

    return {
        SCHEMA_VERSION,
        getState,
        makeBindingKey,
        makeAssetId,
        makeVirtualPath,
        inspectAnyAsset,
        readFileForInspection,
        collectParticleDataPoints,
        syncPreviewForRecord,
        upsertAsset,
        bindDataPoint,
        setBindingMeta,
        getBindingMeta,
        resolveAssetKeyForDataPoint,
        getAssetById,
        updateAssetContent,
        registerUploadedFile,
        createAndBindEffect,
        serializeProjectMetadata,
        hydrateFromMetadata,
        disposeProject,
        installHooks,
        uninstallHooks
    };
})();


/* === src/project/asset_resolver.js === */
const AssetResolver = (() => {
    function scanProject(project, options = {}) {
        const p = project || (typeof Project !== 'undefined' ? Project : null);
        if (!p) {
            return {totalBindings: 0, resolvedCount: 0, embeddedCount: 0, missingCount: 0, items: [], missingItems: []};
        }

        const state = KeyframeStore.getState(p, true);
        if (p.save_path && !Platform.isVirtualPath(p.save_path)) {
            state.projectDir = Platform.dirname(p.save_path);
        }

        const dataPoints = KeyframeStore.collectParticleDataPoints(p);
        const items = [];
        const missingItems = [];
        let resolvedCount = 0;
        let embeddedCount = 0;

        for (const entry of dataPoints) {
            const dp = entry.dataPoint;
            const rawFile = typeof dp.file === 'string' ? dp.file.trim() : '';
            const boundAssetId = KeyframeStore.resolveAssetKeyForDataPoint(p, entry.keyframe, entry.dataPointIndex, dp);
            let record = boundAssetId ? state.assets.get(boundAssetId) : null;

            // 1. Embedded asset already hydrated in memory
            if (record && record.rawText && (state.mode === 'embedded' || Platform.isVirtualPath(rawFile) || (!record.resolvedPath && record.status === 'embedded'))) {
                KeyframeStore.syncPreviewForRecord(p, record, state.projectDir ? [state.projectDir] : []);
                KeyframeStore.bindDataPoint(p, entry.animationUuid, entry.keyframeUuid, entry.dataPointIndex, record.id);
                embeddedCount++;
                const texResolved = record.format === 'photon_fx'
                    ? true
                    : Boolean(
                        record.isBuiltinTexture
                        || record.textureDataUrl
                        || record.texturePath
                        || (record.embeddedTextures && Object.keys(record.embeddedTextures).length > 0)
                    );
                const embeddedModels = record?.embeddedModels || {};
                const embeddedTextures = record?.embeddedTextures || {};
                const embeddedMeshes = record?.embeddedMeshes || {};
                const embeddedShaders = record?.embeddedShaders || {};
                let embMissing = Array.isArray(record.missingDependencies) ? record.missingDependencies.slice() : [];
                if (record.format === 'lumenfx_json' && typeof LumenFxSchema !== 'undefined') {
                    const lmEmb = LumenFxSchema.inspect(record.rawText, record.resolvedPath || record.virtualPath || '', state.projectDir ? [state.projectDir] : []);
                    if (lmEmb?.dependencies?.missing) {
                        embMissing = lmEmb.dependencies.missing.filter(m => {
                            if (m.type === 'shader' && embeddedShaders[m.ref]) return false;
                            if (m.type === 'texture' && embeddedTextures[m.ref]) return false;
                            if (m.type === 'mesh' && embeddedMeshes[m.ref]) return false;
                            return true;
                        });
                    }
                    record.missingDependencies = embMissing;
                }
                items.push({
                    ...entry,
                    effect: dp.effect || '',
                    locator: dp.locator || '',
                    assetId: record.id,
                    format: record.format,
                    originKind: record.originKind || '',
                    status: 'embedded',
                    file: rawFile || record.virtualPath,
                    identifier: record.identifier,
                    textureRef: record.textureRef,
                    textureResolved: texResolved,
                    missingDependencies: embMissing
                });
                continue;
            }

            // 2. Resolve from disk: project-relative hint -> direct rawFile -> record.resolvedPath
            const candidatePaths = [];
            if (record?.relativePath && state.projectDir) {
                candidatePaths.push(Platform.resolvePath(state.projectDir, record.relativePath));
            }
            if (rawFile && !Platform.isVirtualPath(rawFile)) {
                if (!Platform.isAbsolutePath(rawFile) && state.projectDir) {
                    candidatePaths.push(Platform.resolvePath(state.projectDir, rawFile));
                }
                candidatePaths.push(Platform.normalizeFsPath(rawFile));
            }
            if (record?.resolvedPath && !Platform.isVirtualPath(record.resolvedPath)) {
                candidatePaths.push(Platform.normalizeFsPath(record.resolvedPath));
            }

            let foundPath = '';
            for (const cPath of candidatePaths) {
                if (cPath && Platform.fileExists(cPath)) {
                    foundPath = cPath;
                    break;
                }
            }

            if (foundPath) {
                const rawPayload = KeyframeStore.readFileForInspection(foundPath);
                const extraRoots = state.projectDir ? [state.projectDir] : [];
                const meta = rawPayload ? KeyframeStore.inspectAnyAsset(rawPayload, foundPath, extraRoots) : null;
                if (meta) {
                    let texPath = '';
                    let texHash = record?.textureHash || '';
                    let texDims = record?.textureDimensions || null;
                    const missingDependencies = [];
                    const embeddedModels = record?.embeddedModels || {};
                    const embeddedTextures = record?.embeddedTextures || {};
                    const embeddedMeshes = record?.embeddedMeshes || {};
                    const embeddedShaders = record?.embeddedShaders || {};

                    if (meta.format === 'bedrock_snowstorm') {
                        if (record?.textureRelativePath && state.projectDir) {
                            const relTex = Platform.resolvePath(state.projectDir, record.textureRelativePath);
                            if (Platform.fileExists(relTex)) texPath = relTex;
                        }
                        if (!texPath && record?.texturePath && Platform.fileExists(record.texturePath)) {
                            texPath = record.texturePath;
                        }
                        if (!texPath && meta.textureRef && !meta.isBuiltinTexture) {
                            texPath = SnowstormParser.resolveTextureOnDisk(meta.textureRef, foundPath, extraRoots) || '';
                        }
                        if (texPath) {
                            const bytes = Platform.readBinaryFile(texPath);
                            if (bytes) {
                                texHash = Platform.sha256(bytes);
                                texDims = Platform.readPngDimensions(bytes);
                            }
                        }
                        if (meta.textureRef && !meta.isBuiltinTexture && !texPath && !record?.textureDataUrl) {
                            missingDependencies.push({type: 'texture', ref: meta.textureRef});
                        }
                    } else if (meta.format === 'lumenfx_json') {
                        for (const t of (meta.dependencies?.textures || [])) {
                            if (t.resolvedPath && !texPath) texPath = t.resolvedPath;
                        }
                        for (const miss of (meta.dependencies?.missing || [])) {
                            if (miss.type === 'shader' && embeddedShaders[miss.ref]) continue;
                            if (miss.type === 'texture' && embeddedTextures[miss.ref]) continue;
                            if (miss.type === 'mesh' && embeddedMeshes[miss.ref]) continue;
                            missingDependencies.push(miss);
                        }
                    } else if (meta.format === 'kbr_3d_particle') {
                        texPath = meta.texturePath || '';
                        for (const d of (meta.descriptors || [])) {
                            if (d.descriptor && !embeddedModels[d.ref]) {
                                const geomText = d.geometryPath ? Platform.readTextFile(d.geometryPath) : '';
                                embeddedModels[d.ref] = {
                                    descriptor: d.descriptor.raw || d.descriptor,
                                    geometryJson: geomText ? KbrModelSchema.safeParseJson(geomText) : null
                                };
                            }
                            if (d.texturePath && !texPath) texPath = d.texturePath;
                        }
                        for (const miss of (meta.missingDependencies || [])) {
                            missingDependencies.push(miss);
                        }
                    }

                    record = KeyframeStore.upsertAsset(p, {
                        id: record?.id,
                        format: meta.format,
                        originKind: meta.originKind || '',
                        fileName: Platform.basename(foundPath),
                        originalPath: record?.originalPath || rawFile || foundPath,
                        relativePath: state.projectDir ? Platform.relativePath(state.projectDir, foundPath) : (record?.relativePath || ''),
                        resolvedPath: foundPath,
                        rawText: meta.rawText,
                        hash: Platform.sha256(meta.rawText),
                        identifier: meta.identifier,
                        textureRef: meta.textureRef || '',
                        isBuiltinTexture: Boolean(meta.isBuiltinTexture),
                        texturePath: texPath,
                        textureRelativePath: (texPath && state.projectDir) ? Platform.relativePath(state.projectDir, texPath) : (record?.textureRelativePath || ''),
                        textureDataUrl: record?.textureDataUrl || '',
                        textureHash: texHash,
                        textureDimensions: texDims,
                        embeddedModels,
                        embeddedTextures,
                        embeddedMeshes,
                        embeddedShaders,
                        status: 'resolved',
                        missingDependencies
                    });
                    KeyframeStore.bindDataPoint(p, entry.animationUuid, entry.keyframeUuid, entry.dataPointIndex, record.id);

                    if (rawFile && !Platform.isAbsolutePath(rawFile) && !Platform.isVirtualPath(rawFile)) {
                        dp.file = foundPath;
                    }

                    const texResolved = record.format === 'photon_fx'
                        ? true
                        : Boolean(record.isBuiltinTexture || record.textureDataUrl || record.texturePath || !missingDependencies.some(m => m.type === 'texture'));

                    resolvedCount++;
                    items.push({
                        ...entry,
                        effect: dp.effect || '',
                        locator: dp.locator || '',
                        assetId: record.id,
                        format: record.format,
                        originKind: record.originKind || '',
                        status: 'resolved',
                        file: foundPath,
                        identifier: record.identifier,
                        textureRef: record.textureRef,
                        textureResolved: texResolved,
                        missingDependencies
                    });
                    continue;
                }
            }

            // 3. Missing file (e.g., Q:\ drive path not present on receiver machine)
            if (rawFile || record) {
                const missingPath = rawFile || record?.originalPath || record?.relativePath || '';
                const missingItem = {
                    ...entry,
                    assetId: record?.id || '',
                    status: 'missing',
                    file: missingPath,
                    fileName: Platform.basename(missingPath) || record?.fileName || '',
                    expectedHash: record?.hash || '',
                    expectedIdentifier: record?.identifier || '',
                    effect: dp.effect || '',
                    locator: dp.locator || '',
                    missingDependencies: [{type: 'particle', ref: missingPath}]
                };
                missingItems.push(missingItem);
                items.push(missingItem);
            }
        }

        const report = {
            totalBindings: items.length,
            resolvedCount,
            embeddedCount,
            missingCount: missingItems.length,
            items,
            missingItems
        };
        state.lastDiagnostics = report;

        if (options.notify && typeof Blockbench !== 'undefined' && typeof Blockbench.showQuickMessage === 'function') {
            if (missingItems.length > 0) {
                Blockbench.showQuickMessage(Locale.t('msg_missing_toast', {count: missingItems.length}), 5000);
            } else if (embeddedCount > 0 && state.mode === 'embedded') {
                Blockbench.showQuickMessage(Locale.t('msg_embedded_restored', {count: embeddedCount}), 3500);
            }
        }
        return report;
    }

    function countCommonSuffixSegments(pathA, pathB) {
        const segA = Platform.toPosixPath(pathA || '').toLowerCase().split('/').filter(Boolean);
        const segB = Platform.toPosixPath(pathB || '').toLowerCase().split('/').filter(Boolean);
        let matches = 0;
        let i = segA.length - 1;
        let j = segB.length - 1;
        while (i >= 0 && j >= 0 && segA[i] === segB[j]) {
            matches++;
            i--;
            j--;
        }
        return matches;
    }

    function planRelinkFromRoot(project, rootDir) {
        const p = project || (typeof Project !== 'undefined' ? Project : null);
        const report = scanProject(p, {notify: false});
        const cleanRoot = Platform.normalizeFsPath(rootDir);

        // Scan once recursively for JSON / .fx particle files and image textures
        const allFiles = Platform.listFilesRecursive(cleanRoot, {
            extensions: ['.json', '.fx', '.png', '.jpg', '.jpeg', '.webp', '.tga']
        });
        const jsonFiles = allFiles.filter(f => f.lowerName.endsWith('.json') || f.lowerName.endsWith('.fx'));
        const imageFiles = allFiles.filter(f => !f.lowerName.endsWith('.json') && !f.lowerName.endsWith('.fx'));

        // Lazy cache for parsed particle candidate metadata + SHA-256 hash
        const candidateCache = new Map();
        const inspectCandidate = (fileEntry) => {
            if (candidateCache.has(fileEntry.fullPath)) return candidateCache.get(fileEntry.fullPath);
            const rawPayload = KeyframeStore.readFileForInspection(fileEntry.fullPath, cleanRoot);
            if (!rawPayload) {
                candidateCache.set(fileEntry.fullPath, null);
                return null;
            }
            const meta = KeyframeStore.inspectAnyAsset(rawPayload, fileEntry.fullPath, [cleanRoot]);
            if (!meta) {
                candidateCache.set(fileEntry.fullPath, null);
                return null;
            }
            const info = {
                fullPath: fileEntry.fullPath,
                relPath: fileEntry.relPath,
                name: fileEntry.name,
                lowerName: fileEntry.lowerName,
                format: meta.format,
                hash: Platform.sha256(meta.rawText),
                identifier: meta.identifier,
                textureRef: meta.textureRef || '',
                isBuiltinTexture: Boolean(meta.isBuiltinTexture),
                rawText: meta.rawText
            };
            candidateCache.set(fileEntry.fullPath, info);
            return info;
        };

        // Group missing bindings by distinct missing source key so same-named different paths remain independent!
        const groupsMap = new Map();
        for (const m of report.missingItems) {
            const groupKey = m.assetId ? `id:${m.assetId}` : `path:${Platform.pathKey(m.file)}::effect:${m.effect}`;
            if (!groupsMap.has(groupKey)) {
                groupsMap.set(groupKey, {
                    groupKey,
                    assetId: m.assetId,
                    originalFile: m.file,
                    fileName: m.fileName || Platform.basename(m.file),
                    expectedHash: m.expectedHash || '',
                    expectedIdentifier: m.expectedIdentifier || '',
                    effects: new Set(),
                    keyframes: []
                });
            }
            const g = groupsMap.get(groupKey);
            if (m.effect) g.effects.add(m.effect);
            g.keyframes.push({
                animationUuid: m.animationUuid,
                animationName: m.animationName,
                keyframeUuid: m.keyframeUuid,
                time: m.time,
                dataPointIndex: m.dataPointIndex,
                effect: m.effect,
                locator: m.locator
            });
        }

        const groups = [];
        for (const g of groupsMap.values()) {
            const targetLowerName = (g.fileName || '').toLowerCase();
            const scored = [];

            for (const f of jsonFiles) {
                const nameMatches = targetLowerName && f.lowerName === targetLowerName;
                // Only inspect files that match filename OR if we have an expected hash/identifier to match by content
                if (!nameMatches && !g.expectedHash && !g.expectedIdentifier) continue;

                const cand = inspectCandidate(f);
                if (!cand) continue;

                const hashExact = Boolean(g.expectedHash && cand.hash === g.expectedHash);
                const idExact = Boolean(g.expectedIdentifier && cand.identifier && cand.identifier === g.expectedIdentifier);
                const effectExact = Boolean(
                    cand.identifier &&
                    Array.from(g.effects).some(eff => eff === cand.identifier || cand.identifier.endsWith(`:${eff}`))
                );

                if (!nameMatches && !hashExact && !idExact && !effectExact) continue;

                const suffixDepth = countCommonSuffixSegments(g.originalFile, cand.fullPath);
                let score = 0;
                const reasons = [];
                if (hashExact) { score += 1000; reasons.push('exact_hash'); }
                if (suffixDepth >= 2) { score += 300 + suffixDepth * 25; reasons.push(`path_suffix(${suffixDepth})`); }
                if (idExact) { score += 250; reasons.push('identifier'); }
                if (effectExact) { score += 120; reasons.push('effect'); }
                if (nameMatches) { score += 100; reasons.push('filename'); }

                scored.push({
                    fullPath: cand.fullPath,
                    relPath: cand.relPath,
                    name: cand.name,
                    hash: cand.hash,
                    identifier: cand.identifier,
                    textureRef: cand.textureRef,
                    score,
                    reasons
                });
            }

            scored.sort((a, b) => b.score - a.score || a.relPath.localeCompare(b.relPath));

            let status = 'unmatched';
            let selectedPath = '';
            if (scored.length === 1) {
                status = 'matched';
                selectedPath = scored[0].fullPath;
            } else if (scored.length > 1) {
                const top = scored[0];
                const second = scored[1];
                // Unambiguous ONLY if top wins by exact content hash or unique directory path suffix
                const topHasStrongKey = top.reasons.includes('exact_hash')
                    || top.reasons.some(r => r.startsWith('path_suffix'));
                if (top.score > second.score && topHasStrongKey) {
                    status = 'matched';
                    selectedPath = top.fullPath;
                } else {
                    // Ambiguous: artist MUST explicitly choose
                    status = 'ambiguous';
                    selectedPath = '';
                }
            }

            groups.push({
                groupKey: g.groupKey,
                assetId: g.assetId,
                originalFile: g.originalFile,
                fileName: g.fileName,
                expectedHash: g.expectedHash,
                expectedIdentifier: g.expectedIdentifier,
                effects: Array.from(g.effects),
                keyframes: g.keyframes,
                candidates: scored,
                status,
                selectedPath
            });
        }

        return {
            rootDir: cleanRoot,
            scannedJsonCount: jsonFiles.length,
            scannedImageCount: imageFiles.length,
            groups,
            imageFiles
        };
    }

    function applyRelinkPlan(project, plan, userChoices = {}) {
        const p = project || (typeof Project !== 'undefined' ? Project : null);
        if (!p || !plan || !Array.isArray(plan.groups)) {
            return {relinkedBindings: 0, skippedGroups: 0, unresolvedAmbiguous: []};
        }

        const unresolvedAmbiguous = [];
        const resolvedSelections = new Map();

        for (const group of plan.groups) {
            const hasExplicitChoice = Object.prototype.hasOwnProperty.call(userChoices, group.groupKey);
            const chosen = hasExplicitChoice ? userChoices[group.groupKey] : group.selectedPath;
            if (chosen === '__skip__') {
                continue;
            }
            if (!chosen) {
                if (group.status === 'ambiguous') {
                    unresolvedAmbiguous.push(group);
                }
                continue;
            }
            resolvedSelections.set(group.groupKey, chosen);
        }

        if (unresolvedAmbiguous.length > 0) {
            return {relinkedBindings: 0, skippedGroups: 0, unresolvedAmbiguous};
        }

        const dataPoints = KeyframeStore.collectParticleDataPoints(p);
        const affectedKeyframes = [];
        const updates = [];

        for (const group of plan.groups) {
            const targetPath = resolvedSelections.get(group.groupKey);
            if (!targetPath) continue;
            for (const kfRef of group.keyframes) {
                const match = dataPoints.find(d =>
                    d.animationUuid === kfRef.animationUuid &&
                    d.keyframeUuid === kfRef.keyframeUuid &&
                    d.dataPointIndex === kfRef.dataPointIndex
                );
                if (match) {
                    if (!affectedKeyframes.includes(match.keyframe)) {
                        affectedKeyframes.push(match.keyframe);
                    }
                    updates.push({group, match, targetPath});
                }
            }
        }

        if (!updates.length) {
            return {relinkedBindings: 0, skippedGroups: plan.groups.length, unresolvedAmbiguous: []};
        }

        const state = KeyframeStore.getState(p, true);
        if (typeof Undo !== 'undefined' && typeof Undo.initEdit === 'function') {
            Undo.initEdit({keyframes: affectedKeyframes});
        }

        const extraRoots = [plan.rootDir];
        if (state.projectDir) extraRoots.push(state.projectDir);

        for (const item of updates) {
            const {match, targetPath} = item;
            const rawPayload = KeyframeStore.readFileForInspection(targetPath, plan.rootDir);
            if (!rawPayload) continue;
            const meta = KeyframeStore.inspectAnyAsset(rawPayload, targetPath, extraRoots);
            if (!meta) continue;

            // Preserve native effect, locator, script, time, order — update ONLY data_point.file!
            match.dataPoint.file = targetPath;

            let texPath = '';
            if (meta.format === 'bedrock_snowstorm' && meta.textureRef && !meta.isBuiltinTexture) {
                texPath = SnowstormParser.resolveTextureOnDisk(meta.textureRef, targetPath, extraRoots) || '';
                if (!texPath && Array.isArray(plan.imageFiles)) {
                    const ref = SnowstormParser.parseTextureReference(meta.textureRef);
                    const targetTexName = `${ref.stem}.png`.toLowerCase();
                    const texMatches = plan.imageFiles.filter(img => img.lowerName === targetTexName);
                    if (texMatches.length === 1) {
                        texPath = texMatches[0].fullPath;
                    } else if (texMatches.length > 1) {
                        const pDir = Platform.toPosixPath(Platform.dirname(targetPath)).toLowerCase();
                        texMatches.sort((a, b) => {
                            const commonA = commonPrefixLength(pDir, Platform.toPosixPath(a.fullPath).toLowerCase());
                            const commonB = commonPrefixLength(pDir, Platform.toPosixPath(b.fullPath).toLowerCase());
                            return commonB - commonA;
                        });
                        texPath = texMatches[0].fullPath;
                    }
                }
            } else if (meta.format === 'kbr_3d_particle') {
                texPath = meta.texturePath || '';
            } else if (meta.format === 'lumenfx_json') {
                texPath = meta.dependencies?.textures?.find(t => t.resolvedPath)?.resolvedPath || '';
            }

            let texHash = '';
            let texDims = null;
            if (texPath) {
                const bytes = Platform.readBinaryFile(texPath, plan.rootDir);
                if (bytes) {
                    texHash = Platform.sha256(bytes);
                    texDims = Platform.readPngDimensions(bytes);
                }
            }

            const missingDependencies = [];
            if (meta.format === 'bedrock_snowstorm' && meta.textureRef && !meta.isBuiltinTexture && !texPath) {
                missingDependencies.push({type: 'texture', ref: meta.textureRef});
            }

            const assetRecord = KeyframeStore.upsertAsset(p, {
                format: meta.format,
                originKind: meta.originKind || '',
                fileName: Platform.basename(targetPath),
                originalPath: targetPath,
                relativePath: state.projectDir ? Platform.relativePath(state.projectDir, targetPath) : '',
                resolvedPath: targetPath,
                rawText: meta.rawText,
                hash: Platform.sha256(meta.rawText),
                identifier: meta.identifier,
                textureRef: meta.textureRef || '',
                isBuiltinTexture: Boolean(meta.isBuiltinTexture),
                texturePath: texPath,
                textureRelativePath: (texPath && state.projectDir) ? Platform.relativePath(state.projectDir, texPath) : '',
                textureHash: texHash,
                textureDimensions: texDims,
                status: 'resolved',
                missingDependencies
            });
            KeyframeStore.bindDataPoint(p, match.animationUuid, match.keyframeUuid, match.dataPointIndex, assetRecord.id);

            if (meta.format === 'bedrock_snowstorm' && typeof Animator !== 'undefined' && typeof Animator.loadParticleEmitter === 'function') {
                try {
                    Animator.loadParticleEmitter(targetPath, rawPayload);
                } catch (_err) {}
            }
        }

        if (typeof Undo !== 'undefined' && typeof Undo.finishEdit === 'function') {
            Undo.finishEdit('ParticleCue: Batch relink particle assets');
        }

        const refreshed = scanProject(p, {notify: false});
        if (typeof Animator !== 'undefined' && Animator.open && typeof Animator.preview === 'function') {
            Animator.preview();
        }
        if (typeof ParticleCuePanel !== 'undefined' && typeof ParticleCuePanel.refresh === 'function') {
            ParticleCuePanel.refresh();
        }

        return {
            relinkedBindings: updates.length,
            skippedGroups: plan.groups.length - resolvedSelections.size,
            unresolvedAmbiguous: [],
            report: refreshed
        };
    }

    function commonPrefixLength(a, b) {
        const len = Math.min(a.length, b.length);
        let i = 0;
        while (i < len && a[i] === b[i]) i++;
        return i;
    }

    return {
        scanProject,
        planRelinkFromRoot,
        applyRelinkPlan
    };
})();


/* === src/project/portable_zip.js === */
const PortableZip = (() => {
    const MANIFEST_NAME = 'particlecue_manifest.json';

    async function exportPortableZip(project, zipOutputPath, options = {}) {
        const p = project || (typeof Project !== 'undefined' ? Project : null);
        if (!p) throw new Error('No active Blockbench project');
        if (typeof JSZip === 'undefined') throw new Error('JSZip is unavailable in this host');

        const scan = AssetResolver.scanProject(p, {notify: false});
        const state = KeyframeStore.getState(p, true);

        // Check for missing particles or missing non-builtin textures
        const missingErrors = [];
        for (const item of scan.items) {
            if (item.status === 'missing') {
                missingErrors.push(`Particle: ${item.file || item.effect} (${item.animationName} @ ${item.time}s)`);
            } else if (!item.textureResolved && item.textureRef) {
                missingErrors.push(`Texture: ${item.textureRef} (for ${item.identifier || item.file})`);
            }
        }
        if (missingErrors.length > 0 && !options.allowMissing) {
            throw new Error(Locale.t('dialog_embedded_missing_warn', {details: missingErrors.join('\n')}));
        }

        // Compile a fresh snapshot WITHOUT mutating the active open project or its save_path!
        const snapshot = Codecs.project.compile({raw: true, bitmaps: true, absolute_paths: true});
        const archive = new JSZip();
        const usedArchivePaths = new Set();

        const reserveUniqueEntry = (folder, hash, rawName) => {
            const safeBase = Platform.sanitizeFilename(rawName || 'asset');
            const prefix = String(hash || '00000000').slice(0, 8);
            let candidate = `${folder}/${prefix}_${safeBase}`;
            let counter = 1;
            while (usedArchivePaths.has(candidate.toLowerCase())) {
                candidate = `${folder}/${prefix}_${counter}_${safeBase}`;
                counter++;
            }
            usedArchivePaths.add(candidate.toLowerCase());
            return candidate;
        };

        const dataPoints = KeyframeStore.collectParticleDataPoints(p);
        const bindings = {};
        const assetsMeta = {};
        const manifestAssets = [];

        // Deduplicate by assetId so identical content shares one entry, while same-named distinct content gets distinct entries!
        const processedAssetIds = new Set();
        const assetArchivePathMap = new Map();

        for (const item of dataPoints) {
            const assetId = KeyframeStore.resolveAssetKeyForDataPoint(p, item.keyframe, item.dataPointIndex, item.dataPoint);
            if (!assetId) continue;
            const rec = state.assets.get(assetId);
            if (!rec || !rec.rawText) continue;

            bindings[item.bindingKey] = assetId;
            if (processedAssetIds.has(assetId)) continue;
            processedAssetIds.add(assetId);

            const particleHash = rec.hash || Platform.sha256(rec.rawText);
            const particleEntryPath = reserveUniqueEntry('particlecue_assets/particles', particleHash, rec.fileName || 'particle.json');
            if (rec.format === 'photon_fx' && typeof PhotonFxAdapter !== 'undefined') {
                const fxBytes = PhotonFxAdapter.toUint8Array(rec.rawText);
                archive.file(particleEntryPath, fxBytes || rec.rawText);
            } else {
                archive.file(particleEntryPath, rec.rawText);
            }
            assetArchivePathMap.set(assetId, particleEntryPath);

            let texEntryPath = '';
            let texHash = rec.textureHash || '';
            let texDims = rec.textureDimensions || null;

            if (!rec.isBuiltinTexture) {
                let texBytes = null;
                let texName = '';
                if (rec.texturePath && Platform.fileExists(rec.texturePath)) {
                    texBytes = Platform.readBinaryFile(rec.texturePath);
                    texName = Platform.basename(rec.texturePath);
                } else if (rec.textureDataUrl) {
                    const decoded = Platform.dataUrlToBinary(rec.textureDataUrl);
                    if (decoded) {
                        texBytes = decoded.bytes;
                        const refParsed = SnowstormParser.parseTextureReference(rec.textureRef);
                        texName = `${refParsed.stem || 'texture'}.png`;
                    }
                }
                if (texBytes) {
                    texHash = Platform.sha256(texBytes);
                    texDims = Platform.readPngDimensions(texBytes) || texDims;
                    texEntryPath = reserveUniqueEntry('particlecue_assets/textures', texHash, texName || 'texture.png');
                    archive.file(texEntryPath, texBytes);
                }
            }

            const shaderRelativePaths = {};
            const extraTextureRelativePaths = {};
            const meshRelativePaths = {};
            const modelRelativePaths = {};

            const projDir = (p.save_path && !Platform.isVirtualPath(p.save_path))
                ? Platform.dirname(p.save_path)
                : (state.projectDir || '');

            if (rec.format === 'lumenfx_json' && typeof LumenFxSchema !== 'undefined') {
                const lm = LumenFxSchema.inspect(
                    rec.rawText,
                    rec.resolvedPath || rec.originalPath || '',
                    projDir ? [projDir] : []
                );
                // 1. Archive all external & embedded .fsh shaders
                const shaderTexts = Object.assign({}, rec.embeddedShaders || {});
                if (lm?.dependencies?.shaders) {
                    for (const s of lm.dependencies.shaders) {
                        if (!shaderTexts[s.ref] && s.resolvedPath && Platform.fileExists(s.resolvedPath)) {
                            const txt = Platform.readTextFile(s.resolvedPath);
                            if (txt) shaderTexts[s.ref] = txt;
                        }
                    }
                }
                for (const [sRef, sText] of Object.entries(shaderTexts)) {
                    if (typeof sText !== 'string' || !sText.length) continue;
                    const sHash = Platform.sha256(sText);
                    const rawName = String(sRef).split(':').pop().split('/').pop() || 'shader';
                    const sFile = rawName.toLowerCase().endsWith('.fsh') ? rawName : `${rawName}.fsh`;
                    const sEntryPath = reserveUniqueEntry('particlecue_assets/shaders', sHash, sFile);
                    archive.file(sEntryPath, sText);
                    shaderRelativePaths[sRef] = sEntryPath;
                }

                // 2. Archive all multi-textures / decals referenced by LumenFX
                const texSources = new Map();
                if (rec.embeddedTextures) {
                    for (const [tRef, tDataUrl] of Object.entries(rec.embeddedTextures)) {
                        if (typeof tDataUrl === 'string' && tDataUrl.startsWith('data:')) {
                            const dec = Platform.dataUrlToBinary(tDataUrl);
                            if (dec?.bytes) texSources.set(tRef, {bytes: dec.bytes, name: `${String(tRef).split(':').pop().split('/').pop() || 'texture'}.png`});
                        }
                    }
                }
                if (lm?.dependencies?.textures) {
                    for (const t of lm.dependencies.textures) {
                        if (!texSources.has(t.ref) && t.resolvedPath && Platform.fileExists(t.resolvedPath)) {
                            const tBytes = Platform.readBinaryFile(t.resolvedPath);
                            if (tBytes) texSources.set(t.ref, {bytes: tBytes, name: Platform.basename(t.resolvedPath)});
                        }
                    }
                }
                for (const [tRef, tObj] of texSources.entries()) {
                    const tHash = Platform.sha256(tObj.bytes);
                    const tPath = reserveUniqueEntry('particlecue_assets/textures', tHash, tObj.name || 'texture.png');
                    archive.file(tPath, tObj.bytes);
                    extraTextureRelativePaths[tRef] = tPath;
                }

                // 3. Archive all .lfmesh binary meshes
                const meshSources = new Map();
                if (rec.embeddedMeshes) {
                    for (const [mRef, mB64] of Object.entries(rec.embeddedMeshes)) {
                        if (typeof mB64 === 'string' && mB64.length) {
                            const mBytes = Platform.base64ToUint8Array(mB64);
                            if (mBytes) meshSources.set(mRef, {bytes: mBytes, name: `${String(mRef).split(':').pop().split('/').pop() || 'mesh'}.lfmesh`});
                        }
                    }
                }
                if (lm?.dependencies?.meshes) {
                    for (const m of lm.dependencies.meshes) {
                        if (!meshSources.has(m.ref) && m.lfmeshPath && Platform.fileExists(m.lfmeshPath)) {
                            const mBytes = Platform.readBinaryFile(m.lfmeshPath);
                            if (mBytes) meshSources.set(m.ref, {bytes: mBytes, name: Platform.basename(m.lfmeshPath)});
                        }
                    }
                }
                for (const [mRef, mObj] of meshSources.entries()) {
                    const mHash = Platform.sha256(mObj.bytes);
                    const mPath = reserveUniqueEntry('particlecue_assets/meshes', mHash, mObj.name || 'mesh.lfmesh');
                    archive.file(mPath, mObj.bytes);
                    meshRelativePaths[mRef] = mPath;
                }
            } else if (rec.format === 'kbr_3d_particle') {
                if (rec.embeddedModels && typeof rec.embeddedModels === 'object') {
                    for (const [mRef, mVal] of Object.entries(rec.embeddedModels)) {
                        if (!mVal || typeof mVal !== 'object') continue;
                        const stem = Platform.sanitizeFilename(String(mRef).split(':').pop().split('/').pop() || 'model');
                        const entryInfo = {};
                        if (mVal.descriptor) {
                            const dText = typeof mVal.descriptor === 'string' ? mVal.descriptor : JSON.stringify(mVal.descriptor, null, 2);
                            const dPath = reserveUniqueEntry('particlecue_assets/models', Platform.sha256(dText), `${stem}.desc.json`);
                            archive.file(dPath, dText);
                            entryInfo.descriptorPath = dPath;
                        }
                        if (mVal.geometryJson) {
                            const gText = typeof mVal.geometryJson === 'string' ? mVal.geometryJson : JSON.stringify(mVal.geometryJson, null, 2);
                            const gPath = reserveUniqueEntry('particlecue_assets/models', Platform.sha256(gText), `${stem}.geo.json`);
                            archive.file(gPath, gText);
                            entryInfo.geometryPath = gPath;
                        }
                        if (entryInfo.descriptorPath || entryInfo.geometryPath) {
                            modelRelativePaths[mRef] = entryInfo;
                        }
                    }
                }
                if (rec.embeddedTextures && typeof rec.embeddedTextures === 'object') {
                    for (const [tRef, tDataUrl] of Object.entries(rec.embeddedTextures)) {
                        if (typeof tDataUrl === 'string' && tDataUrl.startsWith('data:')) {
                            const dec = Platform.dataUrlToBinary(tDataUrl);
                            if (dec?.bytes) {
                                const tPath = reserveUniqueEntry('particlecue_assets/textures', Platform.sha256(dec.bytes), `${Platform.sanitizeFilename(String(tRef).split(':').pop().split('/').pop() || 'texture')}.png`);
                                archive.file(tPath, dec.bytes);
                                extraTextureRelativePaths[tRef] = tPath;
                            }
                        }
                    }
                }
            }

            assetsMeta[assetId] = {
                id: assetId,
                format: rec.format,
                fileName: rec.fileName,
                identifier: rec.identifier,
                hash: particleHash,
                textureRef: rec.textureRef,
                isBuiltinTexture: rec.isBuiltinTexture,
                relativePath: particleEntryPath,
                textureRelativePath: texEntryPath || undefined,
                textureHash: texHash || undefined,
                textureDimensions: texDims || undefined,
                shaderRelativePaths: Object.keys(shaderRelativePaths).length ? shaderRelativePaths : undefined,
                extraTextureRelativePaths: Object.keys(extraTextureRelativePaths).length ? extraTextureRelativePaths : undefined,
                meshRelativePaths: Object.keys(meshRelativePaths).length ? meshRelativePaths : undefined,
                modelRelativePaths: Object.keys(modelRelativePaths).length ? modelRelativePaths : undefined
            };
            manifestAssets.push(assetsMeta[assetId]);
        }

        // Rewrite ONLY the snapshot .bbmodel's animation particle data_point.file to clean archive-relative paths
        if (Array.isArray(snapshot.animations)) {
            for (const anim of snapshot.animations) {
                const kfs = anim?.animators?.effects?.keyframes;
                if (!Array.isArray(kfs)) continue;
                for (const kf of kfs) {
                    if (kf.channel !== 'particle' || !Array.isArray(kf.data_points)) continue;
                    kf.data_points.forEach((dp, dpIdx) => {
                        const bKey = KeyframeStore.makeBindingKey(anim.uuid, kf.uuid, dpIdx);
                        const assetId = bindings[bKey];
                        const relEntry = assetId && assetArchivePathMap.get(assetId);
                        if (relEntry) {
                            dp.file = relEntry;
                        }
                    });
                }
            }
        }

        // Strip machine-specific absolute paths from snapshot textures/animations while preserving embedded bitmaps
        if (Array.isArray(snapshot.textures)) {
            for (const tex of snapshot.textures) {
                delete tex.path;
                delete tex.relative_path;
            }
        }
        if (Array.isArray(snapshot.animations)) {
            for (const anim of snapshot.animations) {
                delete anim.path;
            }
        }

        const bindingMetaOut = {};
        for (const item of dataPoints) {
            const bm = state.bindingMeta?.get(item.bindingKey);
            if (bm && (bm.participantRole || bm.locatorUuid)) {
                bindingMetaOut[item.bindingKey] = {
                    participantRole: bm.participantRole || 'primary',
                    locatorUuid: bm.locatorUuid || ''
                };
            }
        }

        snapshot.particlecue_studio = {
            schemaVersion: KeyframeStore.SCHEMA_VERSION,
            mode: 'portable_zip',
            assets: assetsMeta,
            bindings,
            bindingMeta: Object.keys(bindingMetaOut).length ? bindingMetaOut : undefined
        };

        const projectFileName = `${Platform.sanitizeFilename(p.name || 'project')}.bbmodel`;
        usedArchivePaths.add(projectFileName.toLowerCase());
        archive.file(projectFileName, JSON.stringify(snapshot, null, '\t'));

        const manifest = {
            schemaVersion: KeyframeStore.SCHEMA_VERSION,
            generator: 'particlecue_studio',
            bbmodel: projectFileName,
            projectName: p.name || 'project',
            assets: manifestAssets
        };
        archive.file(MANIFEST_NAME, JSON.stringify(manifest, null, '\t'));

        const zipBuffer = await archive.generateAsync({
            type: 'uint8array',
            compression: 'DEFLATE',
            compressionOptions: {level: 6}
        });

        Platform.writeBinaryFile(zipOutputPath, zipBuffer, Platform.dirname(zipOutputPath));
        return {
            zipPath: zipOutputPath,
            bbmodelEntry: projectFileName,
            assetCount: manifestAssets.length,
            manifest
        };
    }

    async function validateZipArchive(zipBytes) {
        if (typeof JSZip === 'undefined') {
            return {ok: false, reason: 'JSZip is unavailable in this host'};
        }
        let zip;
        try {
            zip = await JSZip.loadAsync(zipBytes);
        } catch (err) {
            return {ok: false, reason: `Corrupt or unreadable ZIP: ${err.message || err}`};
        }

        const seenLower = new Map();
        const fileEntries = new Map();
        const bbmodelCandidates = [];

        for (const [rawName, entry] of Object.entries(zip.files)) {
            const check = Platform.validateArchiveEntryPath(rawName);
            if (!check.ok) {
                return {ok: false, reason: check.reason};
            }
            const lower = check.normalized.toLowerCase();
            if (!entry.dir) {
                if (seenLower.has(lower)) {
                    return {ok: false, reason: `Case-insensitive entry path collision: "${seenLower.get(lower)}" vs "${rawName}"`};
                }
                seenLower.set(lower, rawName);
                fileEntries.set(check.normalized, entry);
                if (lower.endsWith('.bbmodel')) {
                    bbmodelCandidates.push(check.normalized);
                }
            }
        }

        let manifest = null;
        if (fileEntries.has(MANIFEST_NAME)) {
            try {
                const manifestText = await fileEntries.get(MANIFEST_NAME).async('string');
                manifest = JSON.parse(manifestText);
            } catch (err) {
                return {ok: false, reason: `Invalid ${MANIFEST_NAME}: ${err.message || err}`};
            }
        }

        let bbmodelEntryName = '';
        if (manifest && typeof manifest.bbmodel === 'string') {
            const check = Platform.validateArchiveEntryPath(manifest.bbmodel);
            if (!check.ok || !fileEntries.has(check.normalized)) {
                return {ok: false, reason: `Manifest bbmodel entry missing or unsafe: ${manifest.bbmodel}`};
            }
            bbmodelEntryName = check.normalized;
        } else if (bbmodelCandidates.length === 1) {
            bbmodelEntryName = bbmodelCandidates[0];
        } else if (bbmodelCandidates.length === 0) {
            return {ok: false, reason: 'No .bbmodel project file found inside ZIP archive'};
        } else {
            return {ok: false, reason: `Multiple .bbmodel files found without manifest: ${bbmodelCandidates.join(', ')}`};
        }

        let modelJson;
        try {
            const modelText = await fileEntries.get(bbmodelEntryName).async('string');
            modelJson = JSON.parse(modelText);
        } catch (err) {
            return {ok: false, reason: `Failed to parse ${bbmodelEntryName}: ${err.message || err}`};
        }

        if (!modelJson || typeof modelJson !== 'object' || !modelJson.meta) {
            return {ok: false, reason: `Invalid Blockbench model structure in ${bbmodelEntryName}`};
        }

        const bbmodelDir = bbmodelEntryName.includes('/')
            ? bbmodelEntryName.slice(0, bbmodelEntryName.lastIndexOf('/'))
            : '';

        const resolveZipRel = (rel) => {
            if (!rel || typeof rel !== 'string') return '';
            const norm = Platform.toPosixPath(rel).replace(/^\.\//, '');
            const combined = bbmodelDir ? `${bbmodelDir}/${norm}` : norm;
            const check = Platform.validateArchiveEntryPath(combined);
            return check.ok ? check.normalized : '';
        };

        // Validate every declared asset dependency exists inside the ZIP
        const missingDeps = [];
        const pcMeta = modelJson.particlecue_studio;
        if (pcMeta && pcMeta.assets && typeof pcMeta.assets === 'object') {
            for (const [assetId, asset] of Object.entries(pcMeta.assets)) {
                if (asset.relativePath) {
                    const target = resolveZipRel(asset.relativePath);
                    if (!target || !fileEntries.has(target)) {
                        missingDeps.push(`Particle (${assetId}): ${asset.relativePath}`);
                    }
                }
                if (asset.textureRelativePath) {
                    const targetTex = resolveZipRel(asset.textureRelativePath);
                    if (!targetTex || !fileEntries.has(targetTex)) {
                        missingDeps.push(`Texture (${assetId}): ${asset.textureRelativePath}`);
                    }
                }
                if (asset.shaderRelativePaths && typeof asset.shaderRelativePaths === 'object') {
                    for (const [sRef, sRel] of Object.entries(asset.shaderRelativePaths)) {
                        const targetSh = resolveZipRel(sRel);
                        if (!targetSh || !fileEntries.has(targetSh)) {
                            missingDeps.push(`Shader (${assetId}/${sRef}): ${sRel}`);
                        }
                    }
                }
                if (asset.extraTextureRelativePaths && typeof asset.extraTextureRelativePaths === 'object') {
                    for (const [tRef, tRel] of Object.entries(asset.extraTextureRelativePaths)) {
                        const targetExTex = resolveZipRel(tRel);
                        if (!targetExTex || !fileEntries.has(targetExTex)) {
                            missingDeps.push(`Extra Texture (${assetId}/${tRef}): ${tRel}`);
                        }
                    }
                }
                if (asset.meshRelativePaths && typeof asset.meshRelativePaths === 'object') {
                    for (const [mRef, mRel] of Object.entries(asset.meshRelativePaths)) {
                        const targetMesh = resolveZipRel(mRel);
                        if (!targetMesh || !fileEntries.has(targetMesh)) {
                            missingDeps.push(`Mesh (${assetId}/${mRef}): ${mRel}`);
                        }
                    }
                }
                if (asset.modelRelativePaths && typeof asset.modelRelativePaths === 'object') {
                    for (const [mRef, mPaths] of Object.entries(asset.modelRelativePaths)) {
                        if (mPaths?.descriptorPath) {
                            const td = resolveZipRel(mPaths.descriptorPath);
                            if (!td || !fileEntries.has(td)) {
                                missingDeps.push(`Model Descriptor (${assetId}/${mRef}): ${mPaths.descriptorPath}`);
                            }
                        }
                        if (mPaths?.geometryPath) {
                            const tg = resolveZipRel(mPaths.geometryPath);
                            if (!tg || !fileEntries.has(tg)) {
                                missingDeps.push(`Model Geometry (${assetId}/${mRef}): ${mPaths.geometryPath}`);
                            }
                        }
                    }
                }
            }
        }
        // Also check raw particle keyframe file references for plain ZIPs created outside ParticleCue
        if (Array.isArray(modelJson.animations)) {
            for (const anim of modelJson.animations) {
                const kfs = anim?.animators?.effects?.keyframes;
                if (!Array.isArray(kfs)) continue;
                for (const kf of kfs) {
                    if (kf.channel !== 'particle' || !Array.isArray(kf.data_points)) continue;
                    for (const dp of kf.data_points) {
                        if (dp.file && !Platform.isAbsolutePath(dp.file) && !Platform.isVirtualPath(dp.file)) {
                            const target = resolveZipRel(dp.file);
                            if (!target || !fileEntries.has(target)) {
                                missingDeps.push(`Keyframe particle file: ${dp.file}`);
                            }
                        }
                    }
                }
            }
        }

        if (missingDeps.length > 0) {
            return {ok: false, reason: `Missing archive dependencies:\n${missingDeps.join('\n')}`};
        }

        return {
            ok: true,
            zip,
            fileEntries,
            manifest,
            bbmodelEntryName,
            bbmodelDir,
            modelJson,
            resolveZipRel
        };
    }

    async function importPortableZip(zipPath, options = {}) {
        const bytes = options.zipBytes || Platform.readBinaryFile(zipPath, Platform.dirname(zipPath));
        if (!bytes) {
            throw new Error(`Unable to read ZIP archive: ${zipPath}`);
        }

        const validation = await validateZipArchive(bytes);
        if (!validation.ok) {
            throw new Error(Locale.t('msg_zip_invalid', {reason: validation.reason}));
        }

        const {fileEntries, bbmodelEntryName, modelJson, resolveZipRel} = validation;

        // Hydrate particle definitions and textures directly from the validated ZIP entries
        const hydratedAssets = {};
        const bindings = Object.assign({}, modelJson.particlecue_studio?.bindings || {});

        // 1. Hydrate declared particlecue_studio assets
        if (modelJson.particlecue_studio?.assets) {
            for (const [assetId, info] of Object.entries(modelJson.particlecue_studio.assets)) {
                const pEntryName = info.relativePath ? resolveZipRel(info.relativePath) : '';
                const pEntry = pEntryName ? fileEntries.get(pEntryName) : null;
                let rawText = info.rawText || '';
                if (pEntry) {
                    if (info.format === 'photon_fx' || pEntryName.toLowerCase().endsWith('.fx')) {
                        const fxBytes = await pEntry.async('uint8array');
                        rawText = PhotonFxAdapter.encodeBinaryString(fxBytes);
                    } else {
                        rawText = await pEntry.async('string');
                    }
                }
                const meta = rawText ? KeyframeStore.inspectAnyAsset(rawText, pEntryName) : null;

                let textureDataUrl = info.textureDataUrl || '';
                let textureHash = info.textureHash || '';
                let textureDims = info.textureDimensions || null;

                if (!textureDataUrl && info.textureRelativePath) {
                    const tEntryName = resolveZipRel(info.textureRelativePath);
                    const tEntry = tEntryName ? fileEntries.get(tEntryName) : null;
                    if (tEntry) {
                        const tBytes = await tEntry.async('uint8array');
                        textureHash = Platform.sha256(tBytes);
                        textureDims = Platform.readPngDimensions(tBytes);
                        textureDataUrl = Platform.binaryToDataUrl(tBytes, Platform.guessMimeType(tEntryName));
                    }
                }

                // Fallback texture search inside ZIP if not explicitly declared
                if (!textureDataUrl && meta && meta.textureRef && !meta.isBuiltinTexture) {
                    const ref = SnowstormParser.parseTextureReference(meta.textureRef);
                    const wanted = `${ref.stem}.png`.toLowerCase();
                    for (const [entryPath, entry] of fileEntries.entries()) {
                        if (Platform.basename(entryPath).toLowerCase() === wanted) {
                            const tBytes = await entry.async('uint8array');
                            textureHash = Platform.sha256(tBytes);
                            textureDims = Platform.readPngDimensions(tBytes);
                            textureDataUrl = Platform.binaryToDataUrl(tBytes, Platform.guessMimeType(entryPath));
                            break;
                        }
                    }
                }

                const embeddedShaders = Object.assign({}, info.embeddedShaders || {});
                if (info.shaderRelativePaths && typeof info.shaderRelativePaths === 'object') {
                    for (const [sRef, sRel] of Object.entries(info.shaderRelativePaths)) {
                        const sEntryName = resolveZipRel(sRel);
                        const sEntry = sEntryName ? fileEntries.get(sEntryName) : null;
                        if (sEntry) {
                            embeddedShaders[sRef] = await sEntry.async('string');
                        }
                    }
                }

                const embeddedTextures = Object.assign({}, info.embeddedTextures || {});
                if (info.extraTextureRelativePaths && typeof info.extraTextureRelativePaths === 'object') {
                    for (const [tRef, tRel] of Object.entries(info.extraTextureRelativePaths)) {
                        const exEntryName = resolveZipRel(tRel);
                        const exEntry = exEntryName ? fileEntries.get(exEntryName) : null;
                        if (exEntry) {
                            const exBytes = await exEntry.async('uint8array');
                            embeddedTextures[tRef] = Platform.binaryToDataUrl(exBytes, Platform.guessMimeType(exEntryName));
                        }
                    }
                }

                const embeddedMeshes = Object.assign({}, info.embeddedMeshes || {});
                if (info.meshRelativePaths && typeof info.meshRelativePaths === 'object') {
                    for (const [mRef, mRel] of Object.entries(info.meshRelativePaths)) {
                        const mEntryName = resolveZipRel(mRel);
                        const mEntry = mEntryName ? fileEntries.get(mEntryName) : null;
                        if (mEntry) {
                            const mBytes = await mEntry.async('uint8array');
                            embeddedMeshes[mRef] = Platform.bytesToBase64(mBytes);
                        }
                    }
                }

                const embeddedModels = Object.assign({}, info.embeddedModels || {});
                if (info.modelRelativePaths && typeof info.modelRelativePaths === 'object') {
                    for (const [mRef, mPaths] of Object.entries(info.modelRelativePaths)) {
                        const itemModel = Object.assign({}, embeddedModels[mRef] || {});
                        if (mPaths?.descriptorPath) {
                            const dName = resolveZipRel(mPaths.descriptorPath);
                            const dEntry = dName ? fileEntries.get(dName) : null;
                            if (dEntry) {
                                try { itemModel.descriptor = JSON.parse(await dEntry.async('string')); } catch (_e) {}
                            }
                        }
                        if (mPaths?.geometryPath) {
                            const gName = resolveZipRel(mPaths.geometryPath);
                            const gEntry = gName ? fileEntries.get(gName) : null;
                            if (gEntry) {
                                try { itemModel.geometryJson = JSON.parse(await gEntry.async('string')); } catch (_e) {}
                            }
                        }
                        if (itemModel.descriptor || itemModel.geometryJson) {
                            embeddedModels[mRef] = itemModel;
                        }
                    }
                }

                const hash = rawText ? Platform.sha256(rawText) : (info.hash || '');
                hydratedAssets[assetId] = {
                    ...info,
                    id: assetId,
                    rawText,
                    hash,
                    identifier: meta?.identifier || info.identifier || '',
                    textureRef: meta?.textureRef || info.textureRef || '',
                    isBuiltinTexture: meta ? meta.isBuiltinTexture : Boolean(info.isBuiltinTexture),
                    textureDataUrl,
                    textureHash,
                    textureDimensions: textureDims,
                    embeddedShaders,
                    embeddedTextures,
                    embeddedMeshes,
                    embeddedModels,
                    virtualPath: KeyframeStore.makeVirtualPath(assetId, info.fileName || Platform.basename(pEntryName))
                };
            }
        }

        // 2. Also handle plain ZIPs without particlecue_studio metadata
        if (Array.isArray(modelJson.animations)) {
            for (const anim of modelJson.animations) {
                const kfs = anim?.animators?.effects?.keyframes;
                if (!Array.isArray(kfs)) continue;
                for (const kf of kfs) {
                    if (kf.channel !== 'particle' || !Array.isArray(kf.data_points)) continue;
                    for (let dpIdx = 0; dpIdx < kf.data_points.length; dpIdx++) {
                        const dp = kf.data_points[dpIdx];
                        const bKey = KeyframeStore.makeBindingKey(anim.uuid, kf.uuid, dpIdx);
                        if (bindings[bKey] && hydratedAssets[bindings[bKey]]) {
                            dp.file = hydratedAssets[bindings[bKey]].virtualPath;
                            continue;
                        }
                        if (dp.file && !Platform.isAbsolutePath(dp.file) && !Platform.isVirtualPath(dp.file)) {
                            const entryPath = resolveZipRel(dp.file);
                            const entry = entryPath ? fileEntries.get(entryPath) : null;
                            if (!entry) continue;
                            const rawText = await entry.async('string');
                            const meta = SnowstormParser.inspect(rawText, entryPath);
                            if (!meta) continue;
                            const hash = Platform.sha256(meta.rawText);
                            const fileName = Platform.basename(entryPath);
                            const assetId = KeyframeStore.makeAssetId(fileName, hash);
                            if (!hydratedAssets[assetId]) {
                                let textureDataUrl = '';
                                let textureHash = '';
                                let textureDims = null;
                                if (meta.textureRef && !meta.isBuiltinTexture) {
                                    const ref = SnowstormParser.parseTextureReference(meta.textureRef);
                                    const wanted = `${ref.stem}.png`.toLowerCase();
                                    for (const [ePath, eObj] of fileEntries.entries()) {
                                        if (Platform.basename(ePath).toLowerCase() === wanted) {
                                            const tBytes = await eObj.async('uint8array');
                                            textureHash = Platform.sha256(tBytes);
                                            textureDims = Platform.readPngDimensions(tBytes);
                                            textureDataUrl = Platform.binaryToDataUrl(tBytes, Platform.guessMimeType(ePath));
                                            break;
                                        }
                                    }
                                }
                                hydratedAssets[assetId] = {
                                    id: assetId,
                                    format: meta.format,
                                    fileName,
                                    relativePath: dp.file,
                                    rawText: meta.rawText,
                                    hash,
                                    identifier: meta.identifier,
                                    textureRef: meta.textureRef,
                                    isBuiltinTexture: meta.isBuiltinTexture,
                                    textureDataUrl,
                                    textureHash,
                                    textureDimensions: textureDims,
                                    virtualPath: KeyframeStore.makeVirtualPath(assetId, fileName)
                                };
                            }
                            bindings[bKey] = assetId;
                            dp.file = hydratedAssets[assetId].virtualPath;
                        }
                    }
                }
            }
        }

        // Attach hydrated embedded payload to the clone passed into Codecs.project.load
        const loadModel = Object.assign({}, modelJson, {
            particlecue_studio: {
                schemaVersion: KeyframeStore.SCHEMA_VERSION,
                mode: 'embedded',
                assets: hydratedAssets,
                bindings,
                bindingMeta: modelJson.particlecue_studio?.bindingMeta || undefined
            }
        });

        // Open in a new project tab without touching existing open projects or writing over source files
        Codecs.project.load(loadModel, {
            path: bbmodelEntryName,
            name: Platform.basename(bbmodelEntryName),
            no_file: true
        });

        const openedProject = typeof Project !== 'undefined' ? Project : null;
        if (openedProject) {
            openedProject.saved = false;
            AssetResolver.scanProject(openedProject, {notify: false});
            if (typeof Animator !== 'undefined' && Animator.open && typeof Animator.preview === 'function') {
                Animator.preview();
            }
            if (typeof ParticleCuePanel !== 'undefined' && typeof ParticleCuePanel.refresh === 'function') {
                ParticleCuePanel.refresh();
            }
        }

        return {
            project: openedProject,
            bbmodelEntry: bbmodelEntryName,
            assetCount: Object.keys(hydratedAssets).length,
            bindingsCount: Object.keys(bindings).length
        };
    }

    return {
        MANIFEST_NAME,
        exportPortableZip,
        validateZipArchive,
        importPortableZip
    };
})();


/* === src/project/self_contained.js === */
const SelfContainedProject = (() => {
    function inspectExternalDependencies(project) {
        const p = project || (typeof Project !== 'undefined' ? Project : null);
        const scan = AssetResolver.scanProject(p, {notify: false});
        const state = KeyframeStore.getState(p, true);

        const missing = [];
        const embeddedSummary = [];
        const seenAssets = new Set();

        for (const item of scan.items) {
            if (item.status === 'missing') {
                missing.push({
                    type: 'particle',
                    ref: item.file || item.effect,
                    animation: item.animationName,
                    time: item.time
                });
                continue;
            }
            const rec = state.assets.get(item.assetId);
            if (!rec || seenAssets.has(rec.id)) continue;
            seenAssets.add(rec.id);

            const hasParticleContent = Boolean(rec.rawText);
            if (!hasParticleContent) {
                missing.push({
                    type: 'particle',
                    ref: rec.originalPath || rec.fileName,
                    animation: item.animationName,
                    time: item.time
                });
                continue;
            }

            let texReady = Boolean(rec.isBuiltinTexture || rec.textureDataUrl);
            if (!texReady && rec.texturePath && Platform.fileExists(rec.texturePath)) {
                texReady = true;
            }
            if (!texReady && rec.textureRef) {
                missing.push({
                    type: 'texture',
                    ref: rec.textureRef,
                    particle: rec.identifier || rec.fileName
                });
            }

            embeddedSummary.push({
                id: rec.id,
                fileName: rec.fileName,
                identifier: rec.identifier,
                hash: rec.hash,
                hasTexture: Boolean(!rec.isBuiltinTexture && texReady),
                isBuiltinTexture: Boolean(rec.isBuiltinTexture)
            });
        }

        return {missing, embeddedSummary, scan};
    }

    function saveSelfContainedBbmodel(project, outputPath, options = {}) {
        const p = project || (typeof Project !== 'undefined' ? Project : null);
        if (!p) throw new Error('No active Blockbench project');

        const check = inspectExternalDependencies(p);
        if (check.missing.length > 0 && !options.allowMissing) {
            const lines = check.missing.map(m =>
                m.type === 'particle'
                    ? `- Particle missing: ${m.ref} (${m.animation} @ ${m.time}s)`
                    : `- Texture missing: ${m.ref} (required by ${m.particle})`
            );
            throw new Error(Locale.t('dialog_embedded_missing_warn', {details: lines.join('\n')}));
        }

        const state = KeyframeStore.getState(p, true);

        // Materialize all resolved on-disk textures into base64 data URLs before serializing
        for (const rec of state.assets.values()) {
            if (!rec.textureDataUrl && rec.texturePath && Platform.fileExists(rec.texturePath)) {
                const bytes = Platform.readBinaryFile(rec.texturePath);
                if (bytes) {
                    rec.textureDataUrl = Platform.binaryToDataUrl(bytes, Platform.guessMimeType(rec.texturePath));
                    rec.textureHash = Platform.sha256(bytes);
                    rec.textureDimensions = Platform.readPngDimensions(bytes);
                }
            }
        }

        const prevMode = state.mode;
        // Compile a standard Blockbench .bbmodel with model textures embedded too (`bitmaps: true`)
        const model = Codecs.project.compile({raw: true, bitmaps: true, absolute_paths: false});
        const embeddedPayload = KeyframeStore.serializeProjectMetadata(p, {embed: true});

        if (embeddedPayload) {
            model.particlecue_studio = embeddedPayload;
            // Rewrite particle data_point.file to portable virtual references while preserving native effect/locator/script/time/order
            if (Array.isArray(model.animations)) {
                for (const anim of model.animations) {
                    delete anim.path;
                    const kfs = anim?.animators?.effects?.keyframes;
                    if (!Array.isArray(kfs)) continue;
                    for (const kf of kfs) {
                        if (kf.channel !== 'particle' || !Array.isArray(kf.data_points)) continue;
                        kf.data_points.forEach((dp, dpIdx) => {
                            const bKey = KeyframeStore.makeBindingKey(anim.uuid, kf.uuid, dpIdx);
                            const assetId = embeddedPayload.bindings[bKey];
                            const asset = assetId && embeddedPayload.assets[assetId];
                            if (asset && asset.virtualPath) {
                                dp.file = asset.virtualPath;
                            }
                        });
                    }
                }
            }
        }

        // Remove machine-specific paths from model textures (bitmaps are already embedded via data URLs)
        if (Array.isArray(model.textures)) {
            for (const tex of model.textures) {
                delete tex.path;
                delete tex.relative_path;
            }
        }

        const serialized = JSON.stringify(model, null, '\t');
        Platform.writeTextFile(outputPath, serialized, Platform.dirname(outputPath));

        if (options.switchActiveProjectToEmbedded) {
            state.mode = 'embedded';
            p.save_path = outputPath;
            p.name = Platform.basename(outputPath).replace(/\.bbmodel$/i, '');
            p.saved = true;
        } else {
            state.mode = prevMode;
        }

        return {
            outputPath,
            bytes: serialized.length,
            embeddedAssetCount: embeddedPayload ? Object.keys(embeddedPayload.assets).length : 0,
            bindingsCount: embeddedPayload ? Object.keys(embeddedPayload.bindings).length : 0
        };
    }

    function exportSingleEmbeddedAsset(project, assetId, targetPath) {
        const p = project || (typeof Project !== 'undefined' ? Project : null);
        const asset = KeyframeStore.getAssetById(p, assetId);
        if (!asset || !asset.rawText) {
            throw new Error(`Particle asset not found or has no loaded content: ${assetId}`);
        }
        if (asset.format === 'photon_fx' && typeof PhotonFxAdapter !== 'undefined') {
            const bytes = PhotonFxAdapter.toUint8Array(asset.rawText);
            if (!bytes) throw new Error('Invalid Photon .fx binary payload');
            Platform.writeBinaryFile(targetPath, bytes, Platform.dirname(targetPath));
            return {jsonPath: targetPath, texturePath: ''};
        }
        Platform.writeTextFile(targetPath, asset.rawText, Platform.dirname(targetPath));
        let exportedTexturePath = '';
        if (asset.textureDataUrl) {
            const decoded = Platform.dataUrlToBinary(asset.textureDataUrl);
            if (decoded) {
                const ref = SnowstormParser.parseTextureReference(asset.textureRef);
                const texFileName = `${Platform.sanitizeFilename(ref.stem || 'texture')}.png`;
                exportedTexturePath = Platform.joinPath(Platform.dirname(targetPath), texFileName);
                Platform.writeBinaryFile(exportedTexturePath, decoded.bytes, Platform.dirname(targetPath));
            }
        }
        return {jsonPath: targetPath, texturePath: exportedTexturePath};
    }

    return {
        inspectExternalDependencies,
        saveSelfContainedBbmodel,
        exportSingleEmbeddedAsset
    };
})();


/* === src/editor/kila_material_compiler.js === */
const KilaMaterialCompiler = (() => {
    function num(v, fallback = 0) {
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
    }

    function f(v, fallback = 0) {
        const n = num(v, fallback);
        const s = Number(n.toFixed(4)).toString();
        return s.includes('.') ? s : `${s}.0`;
    }

    function hexToRgb01(hex) {
        const clean = String(hex || '#ffffff').trim().replace(/^#/, '');
        if (clean.length === 3) {
            return [
                parseInt(clean[0] + clean[0], 16) / 255,
                parseInt(clean[1] + clean[1], 16) / 255,
                parseInt(clean[2] + clean[2], 16) / 255
            ];
        }
        if (clean.length >= 6) {
            return [
                parseInt(clean.slice(0, 2), 16) / 255,
                parseInt(clean.slice(2, 4), 16) / 255,
                parseInt(clean.slice(4, 6), 16) / 255
            ];
        }
        return [1, 1, 1];
    }

    function rgb01ToHex(rgb) {
        const c = (x) => Math.max(0, Math.min(255, Math.round(num(x, 1) * 255))).toString(16).padStart(2, '0');
        return `#${c(rgb?.[0])}${c(rgb?.[1])}${c(rgb?.[2])}`;
    }

    function createDefaultKilaConfig() {
        return {
            enabled: false,
            baseColor: '#ffffff',
            hdrBoost: 1.2,
            alphaClip: 0.01,
            useTexture: false,
            uvEffects: {
                enabled: false,
                tilingX: 1.0,
                tilingY: 1.0,
                scrollU: 0.0,
                scrollV: 0.0,
                twirl: 0.0,
                waveAmp: 0.0,
                waveFreq: 3.0,
                waveSpeed: 2.0,
                rippleAmp: 0.0,
                rippleFreq: 8.0
            },
            distortion: {
                enabled: false,
                strength: 0.08,
                scale: 4.5,
                speed: 0.8
            },
            dissolve: {
                enabled: false,
                progress: 0.35,
                softness: 0.06,
                noiseScale: 4.5,
                speed: 0.6,
                edgeWidth: 0.10,
                edgeColor: '#ff771c',
                edgeHdr: 2.2,
                direction: 'none' // none | radial | u | v
            },
            fresnel: {
                enabled: false,
                mode: 'rim', // rim | fade_edges | fade_center
                power: 2.4,
                strength: 1.1,
                color: '#4de8ff',
                hdr: 1.5
            },
            ramp: {
                enabled: false,
                input: 'luminance', // luminance | alpha | u | v | radial
                stops: [
                    [0.0, 0.12, 0.04, 0.25, 1.0],
                    [0.5, 0.95, 0.35, 0.10, 1.0],
                    [1.0, 1.0, 0.95, 0.72, 1.0]
                ]
            },
            scanline: {
                enabled: false,
                density: 48.0,
                speed: 3.0,
                edgeGlow: 0.65,
                color: '#3cf2ff'
            },
            radialMask: {
                enabled: true,
                innerRadius: 0.0,
                outerRadius: 0.96,
                softness: 0.18
            }
        };
    }

    function compileKilaMaterial(cfgInput) {
        const cfg = Object.assign(createDefaultKilaConfig(), cfgInput || {});
        const baseRgb = hexToRgb01(cfg.baseColor);
        const lines = [
            '// Generated by ParticleCue Studio — KilaMaterial Composer (LumenFX WebGL2 / OpenGL 3.2+)',
            'float kila_hash21(vec2 p) {',
            '    p = fract(p * vec2(127.1, 311.7));',
            '    p += dot(p, p + 19.19);',
            '    return fract(p.x * p.y);',
            '}',
            'float kila_noise(vec2 p) {',
            '    vec2 i = floor(p); vec2 fr = fract(p); fr = fr * fr * (3.0 - 2.0 * fr);',
            '    return mix(mix(kila_hash21(i), kila_hash21(i + vec2(1.0, 0.0)), fr.x),',
            '               mix(kila_hash21(i + vec2(0.0, 1.0)), kila_hash21(i + vec2(1.0, 1.0)), fr.x), fr.y);',
            '}',
            'float kila_fbm(vec2 p) {',
            '    float v = 0.0, a = 0.5;',
            '    for (int i = 0; i < 4; i++) { v += a * kila_noise(p); p = p * 2.07 + vec2(1.7, 9.2); a *= 0.5; }',
            '    return v;',
            '}'
        ];

        // Ramp evaluator if enabled
        if (cfg.ramp?.enabled && Array.isArray(cfg.ramp.stops) && cfg.ramp.stops.length >= 2) {
            const stops = cfg.ramp.stops.slice().sort((a, b) => a[0] - b[0]);
            lines.push('vec3 kila_eval_ramp(float x) {');
            lines.push('    float t = clamp(x, 0.0, 1.0);');
            lines.push(`    vec3 c = vec3(${f(stops[0][1])}, ${f(stops[0][2])}, ${f(stops[0][3])});`);
            for (let i = 1; i < stops.length; i++) {
                const p0 = stops[i - 1];
                const p1 = stops[i];
                const span = Math.max(0.0001, p1[0] - p0[0]);
                lines.push(`    c = mix(c, vec3(${f(p1[1])}, ${f(p1[2])}, ${f(p1[3])}), clamp((t - ${f(p0[0])}) / ${f(span)}, 0.0, 1.0));`);
            }
            lines.push('    return c;');
            lines.push('}');
        }

        lines.push('void main() {');
        lines.push('    vec2 uv = vUv;');
        lines.push('    vec2 centered = uv * 2.0 - 1.0;');
        lines.push('    float rad = length(centered);');

        // 1. KilaUvEffects
        if (cfg.uvEffects?.enabled) {
            const u = cfg.uvEffects;
            if (Math.abs(num(u.twirl, 0)) > 0.001) {
                lines.push('    {');
                lines.push('        vec2 d = uv - vec2(0.5);');
                lines.push(`        float ang = ${f(u.twirl)} * length(d) + uTime * 0.6;`);
                lines.push('        float ca = cos(ang), sa = sin(ang);');
                lines.push('        uv = vec2(d.x * ca - d.y * sa, d.x * sa + d.y * ca) + vec2(0.5);');
                lines.push('    }');
            }
            if (Math.abs(num(u.waveAmp, 0)) > 0.0005) {
                lines.push(`    uv.y += sin(uv.x * ${f(u.waveFreq * 6.28318)} + uTime * ${f(u.waveSpeed * 6.28318)}) * ${f(u.waveAmp)};`);
            }
            if (Math.abs(num(u.rippleAmp, 0)) > 0.0005) {
                lines.push(`    uv += normalize(centered + vec2(0.0001)) * sin(rad * ${f(u.rippleFreq * 6.28318)} - uTime * 4.0) * ${f(u.rippleAmp)};`);
            }
            lines.push(`    uv = uv * vec2(${f(u.tilingX, 1)}, ${f(u.tilingY, 1)}) + vec2(${f(u.scrollU, 0)}, ${f(u.scrollV, 0)}) * uTime;`);
        }

        // 2. KilaDistortion
        if (cfg.distortion?.enabled) {
            const d = cfg.distortion;
            lines.push(`    vec2 distN = vec2(kila_noise(uv * ${f(d.scale, 4.5)} + vec2(uTime * ${f(d.speed, 0.8)}, 0.0)), kila_noise(uv * ${f(d.scale, 4.5)} + vec2(3.7, -uTime * ${f(d.speed, 0.8)}))) * 2.0 - 1.0;`);
            lines.push(`    uv += distN * ${f(d.strength, 0.08)};`);
        }

        // 3. Base surface color + texture
        if (cfg.useTexture) {
            lines.push('    vec4 sampled = texture(uTex, uv);');
        } else {
            lines.push('    vec4 sampled = vec4(1.0);');
        }
        lines.push(`    vec3 col = sampled.rgb * vec3(${f(baseRgb[0])}, ${f(baseRgb[1])}, ${f(baseRgb[2])}) * vColor.rgb;`);
        lines.push('    float alpha = sampled.a * vColor.a;');

        // 4. KilaFresnel (computed before radial/dissolve mask so exterior pixels stay 100% transparent)
        if (cfg.fresnel?.enabled) {
            const fr = cfg.fresnel;
            const fRgb = hexToRgb01(fr.color);
            const fHdr = Math.max(0.2, num(fr.hdr, 1.5));
            lines.push('    float fz = sqrt(max(0.0, 1.0 - clamp(rad * rad, 0.0, 1.0)));');
            lines.push(`    float fres = pow(1.0 - fz, ${f(Math.max(0.2, num(fr.power, 2.4)))}) * ${f(num(fr.strength, 1.1))} * smoothstep(0.98, 0.86, rad);`);
            if (fr.mode === 'fade_edges') {
                lines.push('    alpha *= clamp(1.0 - fres, 0.0, 1.0);');
            } else if (fr.mode === 'fade_center') {
                lines.push('    alpha *= clamp(fres, 0.0, 1.0);');
            } else {
                lines.push(`    col += vec3(${f(fRgb[0] * fHdr)}, ${f(fRgb[1] * fHdr)}, ${f(fRgb[2] * fHdr)}) * fres;`);
                lines.push('    alpha = clamp(alpha + fres * 0.45 * vColor.a, 0.0, 1.0);');
            }
        }

        // 5. Radial / Ring Mask
        if (cfg.radialMask?.enabled) {
            const rm = cfg.radialMask;
            const inner = Math.max(0, num(rm.innerRadius, 0));
            const outer = Math.max(0.05, num(rm.outerRadius, 0.96));
            const soft = Math.max(0.005, num(rm.softness, 0.18));
            lines.push(`    float rOuter = smoothstep(${f(outer)}, ${f(Math.max(0, outer - soft))}, rad);`);
            if (inner > 0.005) {
                lines.push(`    float rInner = smoothstep(${f(inner)}, ${f(inner + soft)}, rad);`);
                lines.push('    alpha *= rOuter * rInner;');
            } else {
                lines.push('    alpha *= rOuter;');
            }
        }

        // 6. KilaRamp
        if (cfg.ramp?.enabled && Array.isArray(cfg.ramp.stops) && cfg.ramp.stops.length >= 2) {
            const inp = cfg.ramp.input || 'luminance';
            let expr = 'dot(col, vec3(0.299, 0.587, 0.114))';
            if (inp === 'alpha') expr = 'alpha';
            else if (inp === 'u') expr = 'vUv.x';
            else if (inp === 'v') expr = 'vUv.y';
            else if (inp === 'radial') expr = '1.0 - clamp(rad, 0.0, 1.0)';
            lines.push(`    col = kila_eval_ramp(${expr});`);
        }

        // 7. KilaDissolve
        if (cfg.dissolve?.enabled) {
            const ds = cfg.dissolve;
            const edgeRgb = hexToRgb01(ds.edgeColor);
            const eHdr = Math.max(0.2, num(ds.edgeHdr, 2.2));
            lines.push(`    float dNoise = kila_fbm(uv * ${f(ds.noiseScale, 4.5)} + vec2(0.0, -uTime * ${f(ds.speed, 0.6)}));`);
            if (ds.direction === 'radial') lines.push('    dNoise = mix(dNoise, 1.0 - clamp(rad, 0.0, 1.0), 0.45);');
            else if (ds.direction === 'u') lines.push('    dNoise = mix(dNoise, vUv.x, 0.45);');
            else if (ds.direction === 'v') lines.push('    dNoise = mix(dNoise, 1.0 - vUv.y, 0.45);');
            lines.push(`    float dCut = ${f(ds.progress, 0.35)};`);
            lines.push(`    float dMask = smoothstep(dCut, dCut + ${f(Math.max(0.005, num(ds.softness, 0.06)))}, dNoise);`);
            lines.push(`    float dEdge = smoothstep(dCut + ${f(Math.max(0.01, num(ds.edgeWidth, 0.10)))}, dCut, dNoise) * dMask;`);
            lines.push(`    col += vec3(${f(edgeRgb[0] * eHdr)}, ${f(edgeRgb[1] * eHdr)}, ${f(edgeRgb[2] * eHdr)}) * dEdge;`);
            lines.push('    alpha *= dMask;');
        }

        // 8. Scanline / Hologram
        if (cfg.scanline?.enabled) {
            const sc = cfg.scanline;
            const sRgb = hexToRgb01(sc.color);
            lines.push(`    float scStripe = smoothstep(0.18, 0.58, sin(vWorldPos.y * ${f(sc.density, 48)} - uTime * ${f(sc.speed, 3)}) * 0.5 + 0.5);`);
            lines.push('    vec2 scEdgeD = min(vUv, 1.0 - vUv);');
            lines.push(`    float scEdge = smoothstep(0.12, 0.0, min(scEdgeD.x, scEdgeD.y)) * ${f(sc.edgeGlow, 0.65)};`);
            lines.push(`    col = mix(col * 0.55, vec3(${f(sRgb[0])}, ${f(sRgb[1])}, ${f(sRgb[2])}) * 1.15, clamp(scEdge + scStripe * 0.55, 0.0, 1.0));`);
            lines.push('    alpha = clamp((0.28 + scStripe * 0.42 + scEdge * 0.35) * alpha, 0.0, 0.95);');
        }

        lines.push(`    col *= ${f(Math.max(0.05, num(cfg.hdrBoost, 1.2)))};`);
        lines.push(`    if (alpha <= ${f(Math.max(0.001, num(cfg.alphaClip, 0.01)))}) discard;`);
        lines.push('    fragColor = vec4(col, clamp(alpha, 0.0, 1.0));');
        lines.push('}');
        return lines.join('\n');
    }

    // =========================================================================
    // KilaGraph Visual Shader Node Graph Compiler (DAG -> LumenFX GLSL .fsh)
    // =========================================================================

    const NODE_CATALOG = {
        // ---- Inputs ----
        uv: {
            category: 'Input', label: 'UV', color: '#3b82f6',
            inputs: [],
            outputs: [{id: 'uv', label: 'UV', type: 'vec2'}, {id: 'u', label: 'U', type: 'float'}, {id: 'v', label: 'V', type: 'float'}],
            defaults: {}
        },
        time: {
            category: 'Input', label: 'Time', color: '#3b82f6',
            inputs: [],
            outputs: [{id: 't', label: 'Time', type: 'float'}, {id: 'sin_t', label: 'Sin(t)', type: 'float'}],
            defaults: {speed: 1.0}
        },
        vertex_color: {
            category: 'Input', label: 'Particle Color', color: '#3b82f6',
            inputs: [],
            outputs: [{id: 'rgb', label: 'RGB', type: 'vec3'}, {id: 'a', label: 'Alpha', type: 'float'}],
            defaults: {}
        },
        world_pos: {
            category: 'Input', label: 'World Pos', color: '#3b82f6',
            inputs: [],
            outputs: [{id: 'xyz', label: 'XYZ', type: 'vec3'}, {id: 'y', label: 'Y', type: 'float'}],
            defaults: {}
        },
        float: {
            category: 'Input', label: 'Float', color: '#22c55e',
            inputs: [],
            outputs: [{id: 'out', label: 'Value', type: 'float'}],
            defaults: {value: 0.5}
        },
        vec2: {
            category: 'Input', label: 'Vec2', color: '#22c55e',
            inputs: [],
            outputs: [{id: 'out', label: 'XY', type: 'vec2'}],
            defaults: {x: 1.0, y: 1.0}
        },
        color: {
            category: 'Input', label: 'HDR Color', color: '#eab308',
            inputs: [],
            outputs: [{id: 'rgb', label: 'RGB', type: 'vec3'}],
            defaults: {hex: '#38e8ff', intensity: 1.25}
        },
        texture_sample: {
            category: 'Input', label: 'Texture (uTex)', color: '#a855f7',
            inputs: [{id: 'uv', label: 'UV', type: 'vec2', fallback: 'vUv'}],
            outputs: [{id: 'rgb', label: 'RGB', type: 'vec3'}, {id: 'a', label: 'Alpha', type: 'float'}],
            defaults: {slot: 'uTex'}
        },

        // ---- UV & Procedural ----
        polar: {
            category: 'Procedural', label: 'Polar Coords', color: '#06b6d4',
            inputs: [{id: 'uv', label: 'UV', type: 'vec2', fallback: 'vUv'}],
            outputs: [{id: 'radius', label: 'Radius', type: 'float'}, {id: 'angle', label: 'Angle', type: 'float'}],
            defaults: {}
        },
        uv_scroll: {
            category: 'Procedural', label: 'UV Tile & Scroll', color: '#06b6d4',
            inputs: [
                {id: 'uv', label: 'UV', type: 'vec2', fallback: 'vUv'},
                {id: 'time', label: 'Time', type: 'float', fallback: 'uTime'}
            ],
            outputs: [{id: 'out', label: 'UV', type: 'vec2'}],
            defaults: {tileX: 1.0, tileY: 1.0, scrollX: 0.0, scrollY: -0.5}
        },
        twirl: {
            category: 'Procedural', label: 'Twirl / Swirl', color: '#06b6d4',
            inputs: [
                {id: 'uv', label: 'UV', type: 'vec2', fallback: 'vUv'},
                {id: 'time', label: 'Time', type: 'float', fallback: 'uTime'}
            ],
            outputs: [{id: 'out', label: 'UV', type: 'vec2'}],
            defaults: {strength: 4.0, speed: 1.2}
        },
        noise: {
            category: 'Procedural', label: 'Value Noise', color: '#14b8a6',
            inputs: [{id: 'uv', label: 'UV', type: 'vec2', fallback: 'vUv'}],
            outputs: [{id: 'out', label: 'Noise', type: 'float'}],
            defaults: {scale: 5.0}
        },
        fbm: {
            category: 'Procedural', label: 'FBM Cloud Noise', color: '#14b8a6',
            inputs: [{id: 'uv', label: 'UV', type: 'vec2', fallback: 'vUv'}],
            outputs: [{id: 'out', label: 'FBM', type: 'float'}],
            defaults: {scale: 4.0}
        },
        voronoi: {
            category: 'Procedural', label: 'Voronoi Cells', color: '#14b8a6',
            inputs: [{id: 'uv', label: 'UV', type: 'vec2', fallback: 'vUv'}],
            outputs: [{id: 'out', label: 'Cell', type: 'float'}],
            defaults: {scale: 5.0}
        },
        ring: {
            category: 'Procedural', label: 'Radial Ring', color: '#14b8a6',
            inputs: [{id: 'uv', label: 'UV', type: 'vec2', fallback: 'vUv'}],
            outputs: [{id: 'out', label: 'Mask', type: 'float'}],
            defaults: {radius: 0.72, thickness: 0.12}
        },
        scanline: {
            category: 'Procedural', label: 'Hologram Scanline', color: '#14b8a6',
            inputs: [
                {id: 'uv', label: 'UV', type: 'vec2', fallback: 'vUv'},
                {id: 'time', label: 'Time', type: 'float', fallback: 'uTime'}
            ],
            outputs: [{id: 'stripe', label: 'Stripe', type: 'float'}, {id: 'edge', label: 'Edge', type: 'float'}],
            defaults: {density: 48.0, speed: 3.0}
        },

        // ---- Kila VFX Modules ----
        kila_dissolve: {
            category: 'Kila', label: 'Kila Dissolve', color: '#f97316',
            inputs: [
                {id: 'noise', label: 'Noise', type: 'float', fallback: '0.5'},
                {id: 'progress', label: 'Progress', type: 'float', fallback: '0.35'}
            ],
            outputs: [
                {id: 'alpha', label: 'Mask', type: 'float'},
                {id: 'edge_rgb', label: 'Burn Edge', type: 'vec3'}
            ],
            defaults: {edgeWidth: 0.12, softness: 0.05, edgeHex: '#ff6a14', edgeHdr: 2.2}
        },
        kila_fresnel: {
            category: 'Kila', label: 'Kila Fresnel', color: '#f97316',
            inputs: [{id: 'uv', label: 'UV', type: 'vec2', fallback: 'vUv'}],
            outputs: [{id: 'rim', label: 'Rim', type: 'float'}, {id: 'rgb', label: 'Rim RGB', type: 'vec3'}],
            defaults: {power: 2.5, hex: '#4de8ff', hdr: 1.4}
        },
        soft_circle: {
            category: 'Kila', label: 'Soft Circle Mask', color: '#f97316',
            inputs: [{id: 'uv', label: 'UV', type: 'vec2', fallback: 'vUv'}],
            outputs: [{id: 'out', label: 'Mask', type: 'float'}],
            defaults: {radius: 0.95, softness: 0.35}
        },

        // ---- Math ----
        add: {
            category: 'Math', label: 'Add (A + B)', color: '#6366f1',
            inputs: [{id: 'a', label: 'A', type: 'vec3', fallback: 'vec3(0.0)'}, {id: 'b', label: 'B', type: 'vec3', fallback: 'vec3(0.0)'}],
            outputs: [{id: 'out', label: 'Out', type: 'vec3'}],
            defaults: {}
        },
        mul: {
            category: 'Math', label: 'Multiply (A * B)', color: '#6366f1',
            inputs: [{id: 'a', label: 'A', type: 'vec3', fallback: 'vec3(1.0)'}, {id: 'b', label: 'B', type: 'vec3', fallback: 'vec3(1.0)'}],
            outputs: [{id: 'out', label: 'Out', type: 'vec3'}],
            defaults: {}
        },
        mix: {
            category: 'Math', label: 'Mix (Lerp)', color: '#6366f1',
            inputs: [
                {id: 'a', label: 'A', type: 'vec3', fallback: 'vec3(0.0)'},
                {id: 'b', label: 'B', type: 'vec3', fallback: 'vec3(1.0)'},
                {id: 't', label: 'Factor', type: 'float', fallback: '0.5'}
            ],
            outputs: [{id: 'out', label: 'Out', type: 'vec3'}],
            defaults: {}
        },
        smoothstep: {
            category: 'Math', label: 'Smoothstep', color: '#6366f1',
            inputs: [{id: 'x', label: 'In', type: 'float', fallback: '0.5'}],
            outputs: [{id: 'out', label: 'Out', type: 'float'}],
            defaults: {edge0: 0.2, edge1: 0.8}
        },
        pow: {
            category: 'Math', label: 'Power', color: '#6366f1',
            inputs: [{id: 'x', label: 'Base', type: 'float', fallback: '0.5'}],
            outputs: [{id: 'out', label: 'Out', type: 'float'}],
            defaults: {exp: 2.0}
        },
        sin: {
            category: 'Math', label: 'Sine Wave', color: '#6366f1',
            inputs: [{id: 'x', label: 'In', type: 'float', fallback: '0.0'}],
            outputs: [{id: 'out', label: '0..1', type: 'float'}],
            defaults: {freq: 6.28318}
        },
        one_minus: {
            category: 'Math', label: 'One Minus (1-x)', color: '#6366f1',
            inputs: [{id: 'x', label: 'In', type: 'float', fallback: '0.5'}],
            outputs: [{id: 'out', label: 'Out', type: 'float'}],
            defaults: {}
        },

        // ---- Output ----
        fragment_output: {
            category: 'Output', label: 'Fragment Output', color: '#ef4444',
            inputs: [
                {id: 'rgb', label: 'Color RGB', type: 'vec3', fallback: 'vColor.rgb'},
                {id: 'alpha', label: 'Alpha', type: 'float', fallback: 'vColor.a'}
            ],
            outputs: [],
            defaults: {alphaClip: 0.01, hdrScale: 1.0}
        }
    };

    function castGlsl(expr, fromType, toType) {
        if (fromType === toType) return expr;
        if (toType === 'float') {
            if (fromType === 'vec2' || fromType === 'vec3' || fromType === 'vec4') return `(${expr}).x`;
            return expr;
        }
        if (toType === 'vec2') {
            if (fromType === 'float') return `vec2(${expr})`;
            if (fromType === 'vec3' || fromType === 'vec4') return `(${expr}).xy`;
            return expr;
        }
        if (toType === 'vec3') {
            if (fromType === 'float') return `vec3(${expr})`;
            if (fromType === 'vec2') return `vec3(${expr}, 0.0)`;
            if (fromType === 'vec4') return `(${expr}).rgb`;
            return expr;
        }
        if (toType === 'vec4') {
            if (fromType === 'float') return `vec4(vec3(${expr}), 1.0)`;
            if (fromType === 'vec2') return `vec4(${expr}, 0.0, 1.0)`;
            if (fromType === 'vec3') return `vec4(${expr}, 1.0)`;
            return expr;
        }
        return expr;
    }

    function compileShaderGraph(graph) {
        const nodes = Array.isArray(graph?.nodes) ? graph.nodes : [];
        const links = Array.isArray(graph?.links) ? graph.links : [];
        const nodeMap = new Map(nodes.map(n => [n.id, n]));
        const outNode = nodes.find(n => n.type === 'fragment_output');
        if (!outNode) {
            return {
                ok: false,
                error: 'Graph is missing a Fragment Output node.',
                glsl: ''
            };
        }

        // Map target (nodeId:inputPort) -> source { fromNode, fromPort }
        const inLinkMap = new Map();
        for (const lk of links) {
            if (nodeMap.has(lk.fromNode) && nodeMap.has(lk.toNode)) {
                inLinkMap.set(`${lk.toNode}::${lk.toPort}`, lk);
            }
        }

        // Topological DFS from fragment_output
        const visited = new Set();
        const visiting = new Set();
        const order = [];
        let cycleErr = '';

        function visit(nodeId) {
            if (visited.has(nodeId)) return;
            if (visiting.has(nodeId)) {
                cycleErr = `Cycle detected involving node ${nodeId}`;
                return;
            }
            visiting.add(nodeId);
            const node = nodeMap.get(nodeId);
            const def = NODE_CATALOG[node?.type];
            if (def) {
                for (const inp of def.inputs) {
                    const lk = inLinkMap.get(`${nodeId}::${inp.id}`);
                    if (lk) visit(lk.fromNode);
                }
            }
            visiting.delete(nodeId);
            visited.add(nodeId);
            order.push(node);
        }
        visit(outNode.id);

        if (cycleErr) {
            return {ok: false, error: cycleErr, glsl: ''};
        }

        const safeId = (id) => `n_${String(id).replace(/[^a-zA-Z0-9_]/g, '_')}`;
        const outExprs = new Map(); // `${nodeId}::${portId}` -> { expr, type }

        const resolveInput = (node, portId) => {
            const def = NODE_CATALOG[node.type];
            const inpDef = def?.inputs.find(i => i.id === portId);
            const targetType = inpDef?.type || 'float';
            const lk = inLinkMap.get(`${node.id}::${portId}`);
            if (lk) {
                const src = outExprs.get(`${lk.fromNode}::${lk.fromPort}`);
                if (src) return castGlsl(src.expr, src.type, targetType);
            }
            return inpDef?.fallback || (targetType === 'vec3' ? 'vec3(0.0)' : (targetType === 'vec2' ? 'vUv' : '0.0'));
        };

        const body = [];
        let needsNoise = false;
        let needsFbm = false;
        let needsVoronoi = false;

        for (const node of order) {
            const v = safeId(node.id);
            const p = Object.assign({}, NODE_CATALOG[node.type]?.defaults || {}, node.params || {});
            const setOut = (port, expr, type) => outExprs.set(`${node.id}::${port}`, {expr, type});

            switch (node.type) {
                case 'uv':
                    setOut('uv', 'vUv', 'vec2');
                    setOut('u', 'vUv.x', 'float');
                    setOut('v', 'vUv.y', 'float');
                    break;
                case 'time':
                    body.push(`    float ${v}_t = uTime * ${f(p.speed, 1.0)};`);
                    setOut('t', `${v}_t`, 'float');
                    setOut('sin_t', `(sin(${v}_t) * 0.5 + 0.5)`, 'float');
                    break;
                case 'vertex_color':
                    setOut('rgb', 'vColor.rgb', 'vec3');
                    setOut('a', 'vColor.a', 'float');
                    break;
                case 'world_pos':
                    setOut('xyz', 'vWorldPos', 'vec3');
                    setOut('y', 'vWorldPos.y', 'float');
                    break;
                case 'float':
                    body.push(`    float ${v}_val = ${f(p.value, 0.5)};`);
                    setOut('out', `${v}_val`, 'float');
                    break;
                case 'vec2':
                    body.push(`    vec2 ${v}_val = vec2(${f(p.x, 1)}, ${f(p.y, 1)});`);
                    setOut('out', `${v}_val`, 'vec2');
                    break;
                case 'color': {
                    const rgb = hexToRgb01(p.hex);
                    const inten = Math.max(0, num(p.intensity, 1.0));
                    body.push(`    vec3 ${v}_rgb = vec3(${f(rgb[0] * inten)}, ${f(rgb[1] * inten)}, ${f(rgb[2] * inten)});`);
                    setOut('rgb', `${v}_rgb`, 'vec3');
                    break;
                }
                case 'texture_sample': {
                    const uv = resolveInput(node, 'uv');
                    const slot = p.slot === 'uTex1' ? 'uTex1' : 'uTex';
                    body.push(`    vec4 ${v}_tex = texture(${slot}, ${uv});`);
                    setOut('rgb', `${v}_tex.rgb`, 'vec3');
                    setOut('a', `${v}_tex.a`, 'float');
                    break;
                }
                case 'polar': {
                    const uv = resolveInput(node, 'uv');
                    body.push(`    vec2 ${v}_c = (${uv}) * 2.0 - 1.0;`);
                    body.push(`    float ${v}_r = length(${v}_c);`);
                    body.push(`    float ${v}_a = atan(${v}_c.y, ${v}_c.x);`);
                    setOut('radius', `${v}_r`, 'float');
                    setOut('angle', `${v}_a`, 'float');
                    break;
                }
                case 'uv_scroll': {
                    const uv = resolveInput(node, 'uv');
                    const t = resolveInput(node, 'time');
                    body.push(`    vec2 ${v}_uv = (${uv}) * vec2(${f(p.tileX, 1)}, ${f(p.tileY, 1)}) + vec2(${f(p.scrollX, 0)}, ${f(p.scrollY, -0.5)}) * (${t});`);
                    setOut('out', `${v}_uv`, 'vec2');
                    break;
                }
                case 'twirl': {
                    const uv = resolveInput(node, 'uv');
                    const t = resolveInput(node, 'time');
                    body.push(`    vec2 ${v}_d = (${uv}) - vec2(0.5);`);
                    body.push(`    float ${v}_ang = length(${v}_d) * ${f(p.strength, 4.0)} - (${t}) * ${f(p.speed, 1.2)};`);
                    body.push(`    float ${v}_ca = cos(${v}_ang), ${v}_sa = sin(${v}_ang);`);
                    body.push(`    vec2 ${v}_uv = vec2(${v}_d.x * ${v}_ca - ${v}_d.y * ${v}_sa, ${v}_d.x * ${v}_sa + ${v}_d.y * ${v}_ca) + vec2(0.5);`);
                    setOut('out', `${v}_uv`, 'vec2');
                    break;
                }
                case 'noise': {
                    needsNoise = true;
                    const uv = resolveInput(node, 'uv');
                    body.push(`    float ${v}_n = kg_noise((${uv}) * ${f(p.scale, 5.0)});`);
                    setOut('out', `${v}_n`, 'float');
                    break;
                }
                case 'fbm': {
                    needsNoise = true;
                    needsFbm = true;
                    const uv = resolveInput(node, 'uv');
                    body.push(`    float ${v}_n = kg_fbm((${uv}) * ${f(p.scale, 4.0)});`);
                    setOut('out', `${v}_n`, 'float');
                    break;
                }
                case 'voronoi': {
                    needsVoronoi = true;
                    const uv = resolveInput(node, 'uv');
                    body.push(`    float ${v}_v = kg_voronoi((${uv}) * ${f(p.scale, 5.0)});`);
                    setOut('out', `${v}_v`, 'float');
                    break;
                }
                case 'ring': {
                    const uv = resolveInput(node, 'uv');
                    body.push(`    float ${v}_r = length((${uv}) * 2.0 - 1.0);`);
                    body.push(`    float ${v}_m = smoothstep(${f(Math.max(0.01, num(p.thickness, 0.12)))}, 0.0, abs(${v}_r - ${f(p.radius, 0.72)}));`);
                    setOut('out', `${v}_m`, 'float');
                    break;
                }
                case 'scanline': {
                    const uv = resolveInput(node, 'uv');
                    const t = resolveInput(node, 'time');
                    body.push(`    float ${v}_st = smoothstep(0.15, 0.55, sin(vWorldPos.y * ${f(p.density, 48)} - (${t}) * ${f(p.speed, 3)}) * 0.5 + 0.5);`);
                    body.push(`    vec2 ${v}_ed = min(${uv}, 1.0 - (${uv}));`);
                    body.push(`    float ${v}_eg = smoothstep(0.12, 0.0, min(${v}_ed.x, ${v}_ed.y));`);
                    setOut('stripe', `${v}_st`, 'float');
                    setOut('edge', `${v}_eg`, 'float');
                    break;
                }
                case 'kila_dissolve': {
                    const nIn = resolveInput(node, 'noise');
                    const prog = resolveInput(node, 'progress');
                    const eRgb = hexToRgb01(p.edgeHex);
                    const eHdr = Math.max(0.1, num(p.edgeHdr, 2.2));
                    body.push(`    float ${v}_cut = clamp(${prog}, 0.0, 0.99);`);
                    body.push(`    float ${v}_a = smoothstep(${v}_cut, ${v}_cut + ${f(Math.max(0.005, num(p.softness, 0.05)))}, ${nIn});`);
                    body.push(`    float ${v}_e = smoothstep(${v}_cut + ${f(Math.max(0.01, num(p.edgeWidth, 0.12)))}, ${v}_cut, ${nIn}) * ${v}_a;`);
                    body.push(`    vec3 ${v}_ergb = vec3(${f(eRgb[0] * eHdr)}, ${f(eRgb[1] * eHdr)}, ${f(eRgb[2] * eHdr)}) * ${v}_e;`);
                    setOut('alpha', `${v}_a`, 'float');
                    setOut('edge_rgb', `${v}_ergb`, 'vec3');
                    break;
                }
                case 'kila_fresnel': {
                    const uv = resolveInput(node, 'uv');
                    const fRgb = hexToRgb01(p.hex);
                    const fHdr = Math.max(0.1, num(p.hdr, 1.4));
                    body.push(`    float ${v}_r = length((${uv}) * 2.0 - 1.0);`);
                    body.push(`    float ${v}_z = sqrt(max(0.0, 1.0 - clamp(${v}_r * ${v}_r, 0.0, 1.0)));`);
                    body.push(`    float ${v}_rim = pow(1.0 - ${v}_z, ${f(Math.max(0.2, num(p.power, 2.5)))}) * step(${v}_r, 0.98);`);
                    body.push(`    vec3 ${v}_rgb = vec3(${f(fRgb[0] * fHdr)}, ${f(fRgb[1] * fHdr)}, ${f(fRgb[2] * fHdr)}) * ${v}_rim;`);
                    setOut('rim', `${v}_rim`, 'float');
                    setOut('rgb', `${v}_rgb`, 'vec3');
                    break;
                }
                case 'soft_circle': {
                    const uv = resolveInput(node, 'uv');
                    const rOut = Math.max(0.05, num(p.radius, 0.95));
                    const soft = Math.max(0.01, num(p.softness, 0.35));
                    body.push(`    float ${v}_m = smoothstep(${f(rOut)}, ${f(Math.max(0, rOut - soft))}, length((${uv}) * 2.0 - 1.0));`);
                    setOut('out', `${v}_m`, 'float');
                    break;
                }
                case 'add': {
                    const a = resolveInput(node, 'a');
                    const b = resolveInput(node, 'b');
                    body.push(`    vec3 ${v}_o = (${a}) + (${b});`);
                    setOut('out', `${v}_o`, 'vec3');
                    break;
                }
                case 'mul': {
                    const a = resolveInput(node, 'a');
                    const b = resolveInput(node, 'b');
                    body.push(`    vec3 ${v}_o = (${a}) * (${b});`);
                    setOut('out', `${v}_o`, 'vec3');
                    break;
                }
                case 'mix': {
                    const a = resolveInput(node, 'a');
                    const b = resolveInput(node, 'b');
                    const t = resolveInput(node, 't');
                    body.push(`    vec3 ${v}_o = mix(${a}, ${b}, clamp(${t}, 0.0, 1.0));`);
                    setOut('out', `${v}_o`, 'vec3');
                    break;
                }
                case 'smoothstep': {
                    const x = resolveInput(node, 'x');
                    body.push(`    float ${v}_o = smoothstep(${f(p.edge0, 0.2)}, ${f(p.edge1, 0.8)}, ${x});`);
                    setOut('out', `${v}_o`, 'float');
                    break;
                }
                case 'pow': {
                    const x = resolveInput(node, 'x');
                    body.push(`    float ${v}_o = pow(max(0.0, ${x}), ${f(p.exp, 2.0)});`);
                    setOut('out', `${v}_o`, 'float');
                    break;
                }
                case 'sin': {
                    const x = resolveInput(node, 'x');
                    body.push(`    float ${v}_o = sin((${x}) * ${f(p.freq, 6.28318)}) * 0.5 + 0.5;`);
                    setOut('out', `${v}_o`, 'float');
                    break;
                }
                case 'one_minus': {
                    const x = resolveInput(node, 'x');
                    body.push(`    float ${v}_o = 1.0 - clamp(${x}, 0.0, 1.0);`);
                    setOut('out', `${v}_o`, 'float');
                    break;
                }
                case 'fragment_output': {
                    const rgb = resolveInput(node, 'rgb');
                    const alpha = resolveInput(node, 'alpha');
                    body.push(`    vec3 outRgb = (${rgb}) * ${f(Math.max(0.05, num(p.hdrScale, 1.0)))};`);
                    body.push(`    float outA = clamp(${alpha}, 0.0, 1.0);`);
                    body.push(`    if (outA <= ${f(Math.max(0.001, num(p.alphaClip, 0.01)))}) discard;`);
                    body.push('    fragColor = vec4(outRgb, outA);');
                    break;
                }
            }
        }

        const helpers = ['// Generated by ParticleCue Studio — KilaGraph Visual Shader Editor'];
        if (needsNoise || needsFbm) {
            helpers.push(
                'float kg_hash21(vec2 p) { p = fract(p * vec2(127.1, 311.7)); p += dot(p, p + 19.19); return fract(p.x * p.y); }',
                'float kg_noise(vec2 p) { vec2 i = floor(p); vec2 fr = fract(p); fr = fr * fr * (3.0 - 2.0 * fr); return mix(mix(kg_hash21(i), kg_hash21(i + vec2(1.0, 0.0)), fr.x), mix(kg_hash21(i + vec2(0.0, 1.0)), kg_hash21(i + vec2(1.0, 1.0)), fr.x), fr.y); }'
            );
        }
        if (needsFbm) {
            helpers.push(
                'float kg_fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * kg_noise(p); p = p * 2.07 + vec2(1.7, 9.2); a *= 0.5; } return v; }'
            );
        }
        if (needsVoronoi) {
            helpers.push(
                'vec2 kg_hash22(vec2 p) { p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }',
                'float kg_voronoi(vec2 x) { vec2 n = floor(x), fr = fract(x); float md = 8.0; for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) { vec2 g = vec2(float(i), float(j)); vec2 o = kg_hash22(n + g); float d = length(g + o - fr); md = min(md, d); } return md; }'
            );
        }

        const glsl = `${helpers.join('\n')}\nvoid main() {\n${body.join('\n')}\n}`;
        return {ok: true, error: '', glsl};
    }

    function createGraphPreset(presetId = 'dissolve_fire') {
        if (presetId === 'hologram_scanline') {
            return {
                version: 1,
                preset: 'hologram_scanline',
                nodes: [
                    {id: 'n1', type: 'uv', x: 40, y: 60, params: {}},
                    {id: 'n2', type: 'time', x: 40, y: 185, params: {speed: 1.0}},
                    {id: 'n3', type: 'scanline', x: 250, y: 80, params: {density: 48.0, speed: 3.0}},
                    {id: 'n4', type: 'color', x: 250, y: 230, params: {hex: '#0e8ea8', intensity: 0.9}},
                    {id: 'n5', type: 'color', x: 250, y: 345, params: {hex: '#62faff', intensity: 1.4}},
                    {id: 'n6', type: 'add', x: 480, y: 80, params: {}},
                    {id: 'n7', type: 'mix', x: 500, y: 230, params: {}},
                    {id: 'n8', type: 'fragment_output', x: 740, y: 150, params: {alphaClip: 0.02, hdrScale: 1.1}}
                ],
                links: [
                    {fromNode: 'n1', fromPort: 'uv', toNode: 'n3', toPort: 'uv'},
                    {fromNode: 'n2', fromPort: 't', toNode: 'n3', toPort: 'time'},
                    {fromNode: 'n3', fromPort: 'stripe', toNode: 'n6', toPort: 'a'},
                    {fromNode: 'n3', fromPort: 'edge', toNode: 'n6', toPort: 'b'},
                    {fromNode: 'n4', fromPort: 'rgb', toNode: 'n7', toPort: 'a'},
                    {fromNode: 'n5', fromPort: 'rgb', toNode: 'n7', toPort: 'b'},
                    {fromNode: 'n6', fromPort: 'out', toNode: 'n7', toPort: 't'},
                    {fromNode: 'n7', fromPort: 'out', toNode: 'n8', toPort: 'rgb'},
                    {fromNode: 'n6', fromPort: 'out', toNode: 'n8', toPort: 'alpha'}
                ]
            };
        }
        if (presetId === 'fresnel_orb') {
            return {
                version: 1,
                preset: 'fresnel_orb',
                nodes: [
                    {id: 'n1', type: 'uv', x: 35, y: 70, params: {}},
                    {id: 'n2', type: 'uv_scroll', x: 215, y: 50, params: {tileX: 1, tileY: 1, scrollX: 0.25, scrollY: -0.18}},
                    {id: 'n3', type: 'fbm', x: 410, y: 50, params: {scale: 4.5}},
                    {id: 'n4', type: 'color', x: 410, y: 165, params: {hex: '#1270d6', intensity: 1.0}},
                    {id: 'n5', type: 'kila_fresnel', x: 215, y: 245, params: {power: 2.5, hex: '#6af5ff', hdr: 1.55}},
                    {id: 'n6', type: 'soft_circle', x: 215, y: 390, params: {radius: 0.96, softness: 0.08}},
                    {id: 'n7', type: 'mul', x: 590, y: 80, params: {}},
                    {id: 'n8', type: 'add', x: 605, y: 220, params: {}},
                    {id: 'n9', type: 'fragment_output', x: 805, y: 180, params: {alphaClip: 0.01, hdrScale: 1.15}}
                ],
                links: [
                    {fromNode: 'n1', fromPort: 'uv', toNode: 'n2', toPort: 'uv'},
                    {fromNode: 'n2', fromPort: 'out', toNode: 'n3', toPort: 'uv'},
                    {fromNode: 'n1', fromPort: 'uv', toNode: 'n5', toPort: 'uv'},
                    {fromNode: 'n1', fromPort: 'uv', toNode: 'n6', toPort: 'uv'},
                    {fromNode: 'n4', fromPort: 'rgb', toNode: 'n7', toPort: 'a'},
                    {fromNode: 'n3', fromPort: 'out', toNode: 'n7', toPort: 'b'},
                    {fromNode: 'n7', fromPort: 'out', toNode: 'n8', toPort: 'a'},
                    {fromNode: 'n5', fromPort: 'rgb', toNode: 'n8', toPort: 'b'},
                    {fromNode: 'n8', fromPort: 'out', toNode: 'n9', toPort: 'rgb'},
                    {fromNode: 'n6', fromPort: 'out', toNode: 'n9', toPort: 'alpha'}
                ]
            };
        }
        if (presetId === 'astral_vortex') {
            return {
                version: 1,
                preset: 'astral_vortex',
                nodes: [
                    {id: 'n1', type: 'uv', x: 35, y: 80, params: {}},
                    {id: 'n2', type: 'twirl', x: 210, y: 65, params: {strength: 7.5, speed: 1.6}},
                    {id: 'n3', type: 'fbm', x: 405, y: 65, params: {scale: 5.5}},
                    {id: 'n4', type: 'color', x: 405, y: 195, params: {hex: '#a83dff', intensity: 1.45}},
                    {id: 'n5', type: 'soft_circle', x: 210, y: 270, params: {radius: 0.96, softness: 0.55}},
                    {id: 'n6', type: 'mul', x: 600, y: 105, params: {}},
                    {id: 'n7', type: 'mul', x: 600, y: 245, params: {}},
                    {id: 'n8', type: 'fragment_output', x: 805, y: 155, params: {alphaClip: 0.015, hdrScale: 1.25}}
                ],
                links: [
                    {fromNode: 'n1', fromPort: 'uv', toNode: 'n2', toPort: 'uv'},
                    {fromNode: 'n2', fromPort: 'out', toNode: 'n3', toPort: 'uv'},
                    {fromNode: 'n1', fromPort: 'uv', toNode: 'n5', toPort: 'uv'},
                    {fromNode: 'n4', fromPort: 'rgb', toNode: 'n6', toPort: 'a'},
                    {fromNode: 'n3', fromPort: 'out', toNode: 'n6', toPort: 'b'},
                    {fromNode: 'n3', fromPort: 'out', toNode: 'n7', toPort: 'a'},
                    {fromNode: 'n5', fromPort: 'out', toNode: 'n7', toPort: 'b'},
                    {fromNode: 'n6', fromPort: 'out', toNode: 'n8', toPort: 'rgb'},
                    {fromNode: 'n7', fromPort: 'out', toNode: 'n8', toPort: 'alpha'}
                ]
            };
        }
        // Default: dissolve_fire
        return {
            version: 1,
            preset: 'dissolve_fire',
            nodes: [
                {id: 'n1', type: 'uv', x: 35, y: 75, params: {}},
                {id: 'n2', type: 'uv_scroll', x: 205, y: 55, params: {tileX: 1.0, tileY: 1.0, scrollX: 0.0, scrollY: -0.6}},
                {id: 'n3', type: 'fbm', x: 390, y: 55, params: {scale: 4.5}},
                {id: 'n4', type: 'float', x: 390, y: 175, params: {value: 0.34}},
                {id: 'n5', type: 'kila_dissolve', x: 575, y: 80, params: {edgeWidth: 0.14, softness: 0.05, edgeHex: '#ff6e14', edgeHdr: 2.3}},
                {id: 'n6', type: 'color', x: 390, y: 295, params: {hex: '#ffae2b', intensity: 1.3}},
                {id: 'n7', type: 'soft_circle', x: 205, y: 315, params: {radius: 0.96, softness: 0.38}},
                {id: 'n8', type: 'add', x: 775, y: 120, params: {}},
                {id: 'n9', type: 'mul', x: 775, y: 265, params: {}},
                {id: 'n10', type: 'fragment_output', x: 965, y: 175, params: {alphaClip: 0.015, hdrScale: 1.15}}
            ],
            links: [
                {fromNode: 'n1', fromPort: 'uv', toNode: 'n2', toPort: 'uv'},
                {fromNode: 'n2', fromPort: 'out', toNode: 'n3', toPort: 'uv'},
                {fromNode: 'n3', fromPort: 'out', toNode: 'n5', toPort: 'noise'},
                {fromNode: 'n4', fromPort: 'out', toNode: 'n5', toPort: 'progress'},
                {fromNode: 'n1', fromPort: 'uv', toNode: 'n7', toPort: 'uv'},
                {fromNode: 'n6', fromPort: 'rgb', toNode: 'n8', toPort: 'a'},
                {fromNode: 'n5', fromPort: 'edge_rgb', toNode: 'n8', toPort: 'b'},
                {fromNode: 'n5', fromPort: 'alpha', toNode: 'n9', toPort: 'a'},
                {fromNode: 'n7', fromPort: 'out', toNode: 'n9', toPort: 'b'},
                {fromNode: 'n8', fromPort: 'out', toNode: 'n10', toPort: 'rgb'},
                {fromNode: 'n9', fromPort: 'out', toNode: 'n10', toPort: 'alpha'}
            ]
        };
    }

    function validateGlslInWebGL2(fragBody) {
        const renderer = (typeof Preview !== 'undefined' && Preview.selected?.renderer)
            || (typeof Preview !== 'undefined' && Array.isArray(Preview.all) && Preview.all.find(p => p?.renderer)?.renderer)
            || (typeof Canvas !== 'undefined' ? Canvas?.renderer : null);
        const gl = renderer && typeof renderer.getContext === 'function' ? renderer.getContext() : null;
        if (!gl || typeof WebGL2RenderingContext === 'undefined' || !(gl instanceof WebGL2RenderingContext)) {
            return {ok: true, warning: 'WebGL2 context not active yet'};
        }
        const preamble = [
            '#version 300 es',
            'precision highp float;',
            'precision highp int;',
            'in vec2 vUv; in vec4 vColor; in vec3 vWorldPos;',
            'uniform sampler2D uTex; uniform sampler2D uTex1;',
            'uniform float uTime; uniform float uHdr; uniform vec4 uParams; uniform vec4 uTint;',
            'out vec4 fragColor;',
            'float lfx_soft_particle_alpha() { return 1.0; }'
        ].join('\n');
        const cleaned = String(fragBody || '').replace(/^\s*#version[^\n]*\n?/gm, '');
        const shader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!shader) return {ok: false, error: 'Failed to allocate WebGL2 shader'};
        gl.shaderSource(shader, `${preamble}\n${cleaned}`);
        gl.compileShader(shader);
        const ok = Boolean(gl.getShaderParameter(shader, gl.COMPILE_STATUS));
        const err = ok ? '' : String(gl.getShaderInfoLog(shader) || 'Compile failed').trim();
        gl.deleteShader(shader);
        return ok ? {ok: true, error: ''} : {ok: false, error: err};
    }

    return {
        NODE_CATALOG,
        hexToRgb01,
        rgb01ToHex,
        createDefaultKilaConfig,
        compileKilaMaterial,
        compileShaderGraph,
        createGraphPreset,
        validateGlslInWebGL2
    };
})();


/* === src/ui/styles.js === */
const ParticleCueStyles = (() => {
    let cssHandle = null;

    const STYLES = `
        /* === ParticleCue Studio — Native Blockbench Design System (aligned with AnimCue Studio & PAL) === */
        .pc-panel {
            display: flex;
            flex-direction: column;
            height: 100%;
            min-height: 0;
            font-size: 12px;
            color: var(--color-text);
        }
        .pc-bar {
            display: flex;
            align-items: center;
            height: 34px;
            padding: 0 6px;
            gap: 4px;
            border-bottom: 1px solid var(--color-border);
            flex-shrink: 0;
        }
        .pc-bar .pc-spacer { flex: 1; }
        .pc-action-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 3px;
            height: 24px;
            padding: 0 7px;
            border-radius: 4px;
            border: 1px solid var(--color-border);
            background: var(--color-button);
            color: var(--color-text);
            font-size: 11.5px;
            cursor: pointer;
            white-space: nowrap;
            user-select: none;
            transition: background 0.12s ease, border-color 0.12s ease;
        }
        .pc-action-btn:hover {
            background: var(--color-selected);
            color: var(--color-light);
        }
        .pc-action-btn.primary {
            background: var(--color-accent);
            border-color: var(--color-accent);
            color: var(--color-accent_text);
            font-weight: 500;
        }
        .pc-action-btn.primary:hover { filter: brightness(1.08); }
        .pc-action-btn.warn {
            border-color: rgba(255, 123, 114, 0.55);
            color: #ff8b82;
        }
        .pc-action-btn i { font-size: 15px; }
        .pc-tool {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            cursor: pointer;
            color: var(--color-subtle_text);
            border-radius: 4px;
            user-select: none;
            transition: background 0.12s ease, color 0.12s ease;
        }
        .pc-tool:hover {
            color: var(--color-light);
            background: var(--color-selected);
        }
        .pc-tool.warn { color: #ff8b82; }
        .pc-tool i { font-size: 17px; }
        .pc-badge-dot {
            position: absolute;
            top: 2px;
            right: 2px;
            min-width: 12px;
            height: 12px;
            padding: 0 3px;
            border-radius: 6px;
            background: #ef4444;
            color: #fff;
            font-size: 9px;
            font-weight: 700;
            line-height: 12px;
            text-align: center;
        }

        /* Segmented Tab Strip */
        .pc-tabs {
            display: flex;
            align-items: stretch;
            height: 28px;
            padding: 0 6px;
            gap: 2px;
            background: var(--color-back);
            border-bottom: 1px solid var(--color-border);
            flex-shrink: 0;
        }
        .pc-tab {
            flex: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            font-size: 11.5px;
            color: var(--color-subtle_text);
            cursor: pointer;
            border-bottom: 2px solid transparent;
            user-select: none;
            transition: color 0.12s ease, border-color 0.12s ease;
        }
        .pc-tab:hover { color: var(--color-text); }
        .pc-tab.active {
            color: var(--color-light);
            border-bottom-color: var(--color-accent);
            font-weight: 500;
        }
        .pc-tab i { font-size: 14px; }

        /* Scrollable Body */
        .pc-body {
            flex: 1;
            overflow-y: auto;
            padding: 6px;
            display: flex;
            flex-direction: column;
            gap: 5px;
            min-height: 0;
        }
        .pc-group-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 2px 2px 0;
            font-size: 11px;
            color: var(--color-subtle_text);
        }
        .pc-empty-box {
            padding: 14px 10px;
            text-align: center;
            color: var(--color-subtle_text);
            font-size: 11.5px;
            line-height: 1.5;
            background: var(--color-back);
            border: 1px dashed var(--color-border);
            border-radius: 5px;
        }

        /* AnimCue-style Cards */
        .pc-card {
            display: flex;
            align-items: center;
            gap: 7px;
            padding: 5px 8px;
            background: var(--color-back);
            border: 1px solid var(--color-border);
            border-radius: 5px;
            cursor: pointer;
            user-select: none;
            transition: border-color 0.12s ease, background 0.12s ease;
        }
        .pc-card:hover {
            border-color: var(--color-subtle_text);
            background: var(--color-ui);
        }
        .pc-card.selected {
            border-color: var(--color-accent);
            box-shadow: inset 3px 0 0 var(--color-accent);
            background: var(--color-ui);
        }
        .pc-card.missing {
            border-color: rgba(255, 123, 114, 0.45);
        }
        .pc-avatar {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 22px;
            height: 22px;
            border-radius: 4px;
            background: var(--color-button);
            color: var(--color-subtle_text);
            font-size: 11px;
            font-weight: 600;
            flex-shrink: 0;
        }
        .pc-card.selected .pc-avatar {
            background: var(--color-accent);
            color: var(--color-accent_text);
        }
        .pc-avatar i { font-size: 15px; }
        .pc-info {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 1px;
        }
        .pc-name-line {
            display: flex;
            align-items: center;
            gap: 5px;
            min-width: 0;
        }
        .pc-name {
            font-size: 12.5px;
            font-weight: 500;
            color: var(--color-text);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .pc-sub {
            font-size: 10.5px;
            color: var(--color-subtle_text);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .pc-chip {
            display: inline-flex;
            align-items: center;
            height: 16px;
            padding: 0 5px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: 500;
            background: var(--color-button);
            color: var(--color-subtle_text);
            flex-shrink: 0;
        }
        .pc-chip.accent {
            background: rgba(62, 144, 255, 0.16);
            color: var(--color-accent);
            border: 1px solid rgba(62, 144, 255, 0.35);
        }
        .pc-chip.ok {
            background: rgba(74, 222, 128, 0.13);
            color: #6ee7b7;
            border: 1px solid rgba(74, 222, 128, 0.3);
        }
        .pc-chip.warn {
            background: rgba(248, 113, 113, 0.14);
            color: #fca5a5;
            border: 1px solid rgba(248, 113, 113, 0.35);
        }
        .pc-row-btns {
            display: flex;
            align-items: center;
            gap: 2px;
            flex-shrink: 0;
        }
        .pc-row-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 22px;
            height: 22px;
            color: var(--color-subtle_text);
            border-radius: 4px;
            transition: background 0.1s ease, color 0.1s ease;
        }
        .pc-row-btn:hover {
            color: var(--color-light);
            background: var(--color-button);
        }
        .pc-row-btn i { font-size: 15px; }

        /* Photon-style Emitter Chips & Collapsible Modules */
        .pc-pill-strip {
            display: flex;
            align-items: center;
            gap: 4px;
            flex-wrap: wrap;
            padding: 4px;
            background: var(--color-back);
            border: 1px solid var(--color-border);
            border-radius: 5px;
        }
        .pc-pill {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            height: 22px;
            padding: 0 7px;
            border-radius: 4px;
            font-size: 11px;
            background: var(--color-button);
            color: var(--color-subtle_text);
            border: 1px solid transparent;
            cursor: pointer;
            max-width: 140px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .pc-pill:hover { color: var(--color-text); }
        .pc-pill.active {
            background: var(--color-accent);
            color: var(--color-accent_text);
            font-weight: 500;
        }
        .pc-mod {
            background: var(--color-back);
            border: 1px solid var(--color-border);
            border-radius: 5px;
            overflow: hidden;
            flex-shrink: 0;
        }
        .pc-mod-head {
            display: flex;
            align-items: center;
            gap: 6px;
            height: 26px;
            padding: 0 7px;
            background: var(--color-ui);
            cursor: pointer;
            user-select: none;
            font-size: 11.5px;
            font-weight: 500;
            color: var(--color-text);
        }
        .pc-mod-head:hover { background: var(--color-button); }
        .pc-mod-head i { font-size: 15px; color: var(--color-subtle_text); }
        .pc-mod-head .pc-mod-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pc-mod-body {
            padding: 6px 7px;
            display: flex;
            flex-direction: column;
            gap: 5px;
            border-top: 1px solid var(--color-border);
        }

        /* Compact Inspector Form Controls */
        .pc-grid-2 {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 5px;
        }
        .pc-field {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
        }
        .pc-field-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
            min-height: 22px;
        }
        .pc-label {
            font-size: 10.5px;
            color: var(--color-subtle_text);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .pc-input, .pc-select {
            width: 100%;
            height: 22px;
            padding: 0 5px;
            font-size: 11.5px;
            color: var(--color-text);
            background: var(--color-dark);
            border: 1px solid var(--color-border);
            border-radius: 3px;
            box-sizing: border-box;
            outline: none;
        }
        .pc-input:focus, .pc-select:focus {
            border-color: var(--color-accent);
        }
        .pc-vec3 {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 3px;
        }
        .pc-check {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 11px;
            color: var(--color-text);
            cursor: pointer;
            user-select: none;
        }
        .pc-check input { margin: 0; accent-color: var(--color-accent); }
        .pc-color-row {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .pc-color-swatch {
            width: 26px;
            height: 22px;
            padding: 0;
            border: 1px solid var(--color-border);
            border-radius: 3px;
            background: transparent;
            cursor: pointer;
            flex-shrink: 0;
        }

        /* Curve & Gradient Trigger Previews */
        .pc-curve-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            height: 28px;
            padding: 2px 6px;
            background: var(--color-dark);
            border: 1px solid var(--color-border);
            border-radius: 4px;
            cursor: pointer;
            transition: border-color 0.12s ease;
        }
        .pc-curve-btn:hover { border-color: var(--color-accent); }
        .pc-curve-btn svg { flex: 1; height: 22px; display: block; }
        .pc-grad-btn {
            height: 22px;
            border-radius: 4px;
            border: 1px solid var(--color-border);
            cursor: pointer;
            position: relative;
            overflow: hidden;
            background-image: linear-gradient(45deg, #2a2d34 25%, transparent 25%),
                              linear-gradient(-45deg, #2a2d34 25%, transparent 25%),
                              linear-gradient(45deg, transparent 75%, #2a2d34 75%),
                              linear-gradient(-45deg, transparent 75%, #2a2d34 75%);
            background-size: 8px 8px;
            background-position: 0 0, 0 4px, 4px -4px, -4px 0;
        }
        .pc-grad-btn:hover { border-color: var(--color-accent); }
        .pc-grad-fill { position: absolute; inset: 0; }

        /* Burst / Attachment Mini Rows */
        .pc-mini-row {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 3px 4px;
            background: var(--color-ui);
            border: 1px solid var(--color-border);
            border-radius: 3px;
        }

        /* 24px Native Footer */
        .pc-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 24px;
            padding: 0 8px;
            border-top: 1px solid var(--color-border);
            font-size: 11px;
            color: var(--color-subtle_text);
            flex-shrink: 0;
            gap: 6px;
        }
        .pc-footer-left {
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 0;
            overflow: hidden;
        }
        .pc-dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            margin-right: 4px;
            background: var(--color-subtle_text);
            vertical-align: middle;
        }
        .pc-dot.on {
            background: #4ade80;
            box-shadow: 0 0 5px rgba(74, 222, 128, 0.5);
        }
        .pc-dot.warn {
            background: #f87171;
            box-shadow: 0 0 5px rgba(248, 113, 113, 0.5);
        }

        /* === Interactive Curve & Gradient Editor Dialogs === */
        .pc-editor-wrap {
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-size: 12px;
        }
        .pc-curve-stage {
            position: relative;
            width: 100%;
            height: 220px;
            background: #14171d;
            border: 1px solid var(--color-border);
            border-radius: 5px;
            overflow: hidden;
            user-select: none;
        }
        .pc-curve-stage svg { width: 100%; height: 100%; display: block; cursor: crosshair; }
        .pc-preset-row {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            align-items: center;
        }
        .pc-grad-track-wrap {
            position: relative;
            padding: 14px 4px 20px;
            user-select: none;
        }
        .pc-grad-track {
            position: relative;
            height: 36px;
            border-radius: 4px;
            border: 1px solid var(--color-border);
            cursor: copy;
            background-image: linear-gradient(45deg, #2a2d34 25%, transparent 25%),
                              linear-gradient(-45deg, #2a2d34 25%, transparent 25%),
                              linear-gradient(45deg, transparent 75%, #2a2d34 75%),
                              linear-gradient(-45deg, transparent 75%, #2a2d34 75%);
            background-size: 10px 10px;
            background-position: 0 0, 0 5px, 5px -5px, -5px 0;
        }
        .pc-grad-stop {
            position: absolute;
            bottom: -14px;
            width: 12px;
            height: 14px;
            margin-left: -6px;
            border-radius: 2px;
            border: 2px solid #cbd5e1;
            cursor: ew-resize;
            box-shadow: 0 1px 4px rgba(0,0,0,0.6);
        }
        .pc-grad-stop.selected {
            border-color: var(--color-accent);
            transform: scale(1.18);
            z-index: 3;
        }

        /* === KilaGraph Visual Shader Node Editor === */
        .pc-kg-shell {
            display: flex;
            flex-direction: column;
            height: 600px;
            border: 1px solid var(--color-border);
            border-radius: 5px;
            overflow: hidden;
            background: #12151b;
            font-size: 12px;
        }
        .pc-kg-toolbar {
            display: flex;
            align-items: center;
            gap: 5px;
            height: 36px;
            padding: 0 8px;
            background: var(--color-ui);
            border-bottom: 1px solid var(--color-border);
            flex-shrink: 0;
        }
        .pc-kg-main {
            flex: 1;
            display: flex;
            min-height: 0;
            position: relative;
        }
        .pc-kg-palette {
            width: 148px;
            background: var(--color-back);
            border-right: 1px solid var(--color-border);
            overflow-y: auto;
            padding: 6px;
            flex-shrink: 0;
        }
        .pc-kg-cat {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--color-subtle_text);
            margin: 6px 2px 3px;
        }
        .pc-kg-pal-item {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 3px 6px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            color: var(--color-text);
            margin-bottom: 2px;
        }
        .pc-kg-pal-item:hover { background: var(--color-selected); color: var(--color-light); }
        .pc-kg-pal-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .pc-kg-canvas {
            flex: 1;
            position: relative;
            overflow: hidden;
            background-color: #11141a;
            background-image:
                linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px);
            background-size: 24px 24px;
            user-select: none;
        }
        .pc-kg-world {
            position: absolute;
            top: 0;
            left: 0;
            transform-origin: 0 0;
            width: 1px;
            height: 1px;
        }
        .pc-kg-wires {
            position: absolute;
            top: -2000px;
            left: -2000px;
            width: 6000px;
            height: 6000px;
            pointer-events: none;
            overflow: visible;
        }
        .pc-kg-wire {
            fill: none;
            stroke: #60a5fa;
            stroke-width: 2.2;
            pointer-events: stroke;
            cursor: pointer;
            opacity: 0.88;
        }
        .pc-kg-wire:hover { stroke: #f87171; stroke-width: 3.2; }
        .pc-kg-node {
            position: absolute;
            min-width: 152px;
            background: #1d222c;
            border: 1px solid #353d4f;
            border-radius: 6px;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
            color: #e5e7eb;
            font-size: 11px;
        }
        .pc-kg-node.selected {
            border-color: var(--color-accent);
            box-shadow: 0 0 0 1px var(--color-accent), 0 6px 18px rgba(0,0,0,0.55);
        }
        .pc-kg-node-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 4px 7px;
            border-radius: 5px 5px 0 0;
            font-weight: 600;
            font-size: 11px;
            cursor: grab;
            color: #fff;
        }
        .pc-kg-node-head:active { cursor: grabbing; }
        .pc-kg-node-body {
            padding: 5px 6px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .pc-kg-ports {
            display: flex;
            justify-content: space-between;
            gap: 10px;
        }
        .pc-kg-port-col {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .pc-kg-port {
            display: flex;
            align-items: center;
            gap: 5px;
            height: 16px;
            cursor: pointer;
            font-size: 10.5px;
            color: #cbd5e1;
        }
        .pc-kg-port.out { justify-content: flex-end; }
        .pc-kg-sock {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 1.5px solid #e2e8f0;
            background: #1e293b;
            flex-shrink: 0;
        }
        .pc-kg-sock.vec2 { border-color: #22d3ee; }
        .pc-kg-sock.vec3 { border-color: #facc15; }
        .pc-kg-sock.float { border-color: #4ade80; }
        .pc-kg-sock.connected { background: #60a5fa; }
        .pc-kg-sock.active { background: #f97316; transform: scale(1.25); }
        .pc-kg-inspector {
            width: 205px;
            background: var(--color-back);
            border-left: 1px solid var(--color-border);
            padding: 8px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex-shrink: 0;
        }
        .pc-kg-code {
            width: 100%;
            flex: 1;
            min-height: 220px;
            font-family: Consolas, monospace;
            font-size: 11px;
            line-height: 1.4;
            color: #d1fae5;
            background: #0d1117;
            border: 1px solid var(--color-border);
            border-radius: 4px;
            padding: 6px;
            box-sizing: border-box;
            resize: none;
        }
    `;

    function install() {
        if (cssHandle) return cssHandle;
        if (typeof Blockbench !== 'undefined' && typeof Blockbench.addCSS === 'function') {
            cssHandle = Blockbench.addCSS(STYLES);
        }
        return cssHandle;
    }

    function uninstall() {
        if (cssHandle && typeof cssHandle.delete === 'function') {
            try { cssHandle.delete(); } catch (_err) {}
        }
        cssHandle = null;
    }

    return {install, uninstall, STYLES};
})();


/* === src/ui/curve_editor.js === */
const ParticleCueCurveEditor = (() => {
    const PRESETS = [
        {id: 'const_1', label: 'Constant 1', keys: [{t: 0, v: 1}, {t: 1, v: 1}]},
        {id: 'linear_up', label: 'Linear Up', keys: [{t: 0, v: 0}, {t: 1, v: 1}]},
        {id: 'fade_out', label: 'Fade Out', keys: [{t: 0, v: 1}, {t: 0.7, v: 0.85}, {t: 1, v: 0}]},
        {id: 'bell', label: 'Bell Pulse', keys: [{t: 0, v: 0}, {t: 0.25, v: 1}, {t: 0.75, v: 0.9}, {t: 1, v: 0}]},
        {id: 'ease_out', label: 'Ease Out', keys: [{t: 0, v: 1}, {t: 0.2, v: 0.55}, {t: 0.55, v: 0.2}, {t: 1, v: 0}]},
        {id: 'sine_hover', label: 'Sine Hover', keys: [{t: 0, v: 0}, {t: 0.25, v: 0.25}, {t: 0.5, v: 0}, {t: 0.75, v: -0.25}, {t: 1, v: 0}]},
        {id: 'pop', label: 'Pop Burst', keys: [{t: 0, v: 0.2}, {t: 0.12, v: 1.25}, {t: 0.4, v: 0.95}, {t: 1, v: 0}]}
    ];

    function normalizeKeys(curveSpec, fallbackVal = 1) {
        if (typeof curveSpec === 'number' && Number.isFinite(curveSpec)) {
            return [{t: 0, v: curveSpec}, {t: 1, v: curveSpec}];
        }
        if (curveSpec && typeof curveSpec === 'object') {
            if (Array.isArray(curveSpec.keys) && curveSpec.keys.length) {
                return curveSpec.keys
                    .map(k => Array.isArray(k)
                        ? {t: Number(k[0]) || 0, v: Number(k[1]) || 0}
                        : {t: Number(k?.t ?? k?.time ?? 0) || 0, v: Number(k?.v ?? k?.value ?? 0) || 0})
                    .sort((a, b) => a.t - b.t);
            }
            if (Array.isArray(curveSpec.stops) && curveSpec.stops.length) {
                return curveSpec.stops
                    .map(s => ({t: Number(s?.t ?? s?.time ?? 0) || 0, v: Number(s?.v ?? s?.value ?? 0) || 0}))
                    .sort((a, b) => a.t - b.t);
            }
            if (typeof curveSpec.value === 'number') {
                return [{t: 0, v: curveSpec.value}, {t: 1, v: curveSpec.value}];
            }
        }
        return [{t: 0, v: fallbackVal}, {t: 1, v: fallbackVal}];
    }

    function buildMiniSvgPath(curveSpec, width = 96, height = 22, fallbackVal = 1) {
        const keys = normalizeKeys(curveSpec, fallbackVal);
        let minV = Infinity, maxV = -Infinity;
        for (const k of keys) {
            minV = Math.min(minV, k.v);
            maxV = Math.max(maxV, k.v);
        }
        if (!Number.isFinite(minV)) { minV = 0; maxV = 1; }
        if (Math.abs(maxV - minV) < 1e-4) { minV -= 0.5; maxV += 0.5; }
        const pad = 2;
        const pts = keys.map(k => {
            const x = pad + Math.max(0, Math.min(1, k.t)) * (width - pad * 2);
            const y = height - pad - ((k.v - minV) / (maxV - minV)) * (height - pad * 2);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        });
        return `M ${pts.join(' L ')}`;
    }

    function open(options = {}) {
        const title = options.title || 'Curve Editor';
        let keys = normalizeKeys(options.value, options.fallback ?? 1);
        let minV = Number.isFinite(Number(options.min)) ? Number(options.min) : Math.min(0, ...keys.map(k => k.v));
        let maxV = Number.isFinite(Number(options.max)) ? Number(options.max) : Math.max(1.5, ...keys.map(k => k.v * 1.1));
        for (const k of keys) {
            if (k.v < minV) minV = Math.floor(k.v * 10) / 10;
            if (k.v > maxV) maxV = Math.ceil(k.v * 10) / 10;
        }
        if (maxV - minV < 0.2) maxV = minV + 1;
        let selectedIdx = 0;
        let winMove = null;
        let winUp = null;
        const W = 540, H = 220, PAD_L = 38, PAD_R = 14, PAD_T = 14, PAD_B = 22;

        const emitLive = () => {
            if (typeof options.onChange === 'function') {
                const sorted = keys.slice().sort((a, b) => a.t - b.t);
                options.onChange({keys: sorted.map(k => ({t: Number(k.t.toFixed(3)), v: Number(k.v.toFixed(4))}))});
            }
        };

        const toX = (t) => PAD_L + Math.max(0, Math.min(1, t)) * (W - PAD_L - PAD_R);
        const toY = (v) => PAD_T + (1 - (v - minV) / Math.max(1e-5, maxV - minV)) * (H - PAD_T - PAD_B);
        const fromX = (x) => Math.max(0, Math.min(1, (x - PAD_L) / (W - PAD_L - PAD_R)));
        const fromY = (y) => minV + (1 - (y - PAD_T) / (H - PAD_T - PAD_B)) * (maxV - minV);

        const dialog = new Dialog({
            id: 'particlecue_curve_editor_dialog',
            title,
            width: 600,
            lines: ['<div id="pc_curve_dialog_mount" class="pc-editor-wrap"></div>'],
            buttons: [Locale.t('dialog_inspect_save'), 'dialog.cancel'],
            onOpen() {
                const mount = document.getElementById('pc_curve_dialog_mount');
                if (!mount) return;
                let draggingIdx = -1;

                const render = () => {
                    keys.sort((a, b) => a.t - b.t);
                    if (selectedIdx >= keys.length) selectedIdx = Math.max(0, keys.length - 1);
                    const sel = keys[selectedIdx] || {t: 0, v: 0};

                    const gridLines = [];
                    for (let i = 0; i <= 4; i++) {
                        const gy = PAD_T + (i / 4) * (H - PAD_T - PAD_B);
                        const val = maxV - (i / 4) * (maxV - minV);
                        gridLines.push(`<line x1="${PAD_L}" y1="${gy}" x2="${W - PAD_R}" y2="${gy}" stroke="rgba(255,255,255,0.08)" />`);
                        gridLines.push(`<text x="${PAD_L - 5}" y="${gy + 3}" text-anchor="end" fill="#8b949e" font-size="10">${val.toFixed(2)}</text>`);
                        const gx = PAD_L + (i / 4) * (W - PAD_L - PAD_R);
                        gridLines.push(`<line x1="${gx}" y1="${PAD_T}" x2="${gx}" y2="${H - PAD_B}" stroke="rgba(255,255,255,0.06)" />`);
                        gridLines.push(`<text x="${gx}" y="${H - 6}" text-anchor="middle" fill="#8b949e" font-size="10">${(i * 0.25).toFixed(2)}</text>`);
                    }
                    if (minV < 0 && maxV > 0) {
                        const y0 = toY(0);
                        gridLines.push(`<line x1="${PAD_L}" y1="${y0}" x2="${W - PAD_R}" y2="${y0}" stroke="rgba(250,204,21,0.3)" stroke-dasharray="4 3" />`);
                    }

                    const polyPts = keys.map(k => `${toX(k.t).toFixed(1)},${toY(k.v).toFixed(1)}`).join(' ');
                    const areaPts = `${toX(keys[0].t).toFixed(1)},${toY(Math.max(minV, Math.min(maxV, 0))).toFixed(1)} ${polyPts} ${toX(keys[keys.length - 1].t).toFixed(1)},${toY(Math.max(minV, Math.min(maxV, 0))).toFixed(1)}`;
                    const handles = keys.map((k, idx) => {
                        const cx = toX(k.t).toFixed(1);
                        const cy = toY(k.v).toFixed(1);
                        const active = idx === selectedIdx;
                        return `<circle class="pc-curve-pt" data-idx="${idx}" cx="${cx}" cy="${cy}" r="${active ? 6 : 4.5}" fill="${active ? '#38bdf8' : '#e2e8f0'}" stroke="#0f172a" stroke-width="1.8" style="cursor:grab;" />`;
                    }).join('');

                    const presetBtns = PRESETS.map(pr =>
                        `<span class="pc-action-btn pc-curve-preset" data-preset="${pr.id}">${pr.label}</span>`
                    ).join('');

                    mount.innerHTML = `
                        <div class="pc-preset-row">
                            <span class="pc-label" style="margin-right:4px;">Presets:</span>
                            ${presetBtns}
                        </div>
                        <div class="pc-curve-stage">
                            <svg id="pc_curve_svg" viewBox="0 0 ${W} ${H}">
                                ${gridLines.join('')}
                                <polygon points="${areaPts}" fill="rgba(56,189,248,0.12)" />
                                <polyline points="${polyPts}" fill="none" stroke="#38bdf8" stroke-width="2.2" />
                                ${handles}
                            </svg>
                        </div>
                        <div class="pc-grid-2">
                            <div class="pc-grid-2">
                                <div class="pc-field">
                                    <span class="pc-label">Selected Time (0..1)</span>
                                    <input id="pc_ce_t" class="pc-input" type="number" step="0.01" min="0" max="1" value="${sel.t.toFixed(3)}" />
                                </div>
                                <div class="pc-field">
                                    <span class="pc-label">Selected Value</span>
                                    <input id="pc_ce_v" class="pc-input" type="number" step="0.05" value="${sel.v.toFixed(3)}" />
                                </div>
                            </div>
                            <div class="pc-grid-2">
                                <div class="pc-field">
                                    <span class="pc-label">Axis Min / Max</span>
                                    <div style="display:flex;gap:4px;">
                                        <input id="pc_ce_min" class="pc-input" type="number" step="0.5" value="${minV}" />
                                        <input id="pc_ce_max" class="pc-input" type="number" step="0.5" value="${maxV}" />
                                    </div>
                                </div>
                                <div class="pc-field" style="justify-content:flex-end;">
                                    <span class="pc-label">Click canvas: add · Right-click pt: delete</span>
                                    <span id="pc_ce_del" class="pc-action-btn warn">Delete Point</span>
                                </div>
                            </div>
                        </div>
                    `;

                    const svg = document.getElementById('pc_curve_svg');
                    const getSvgCoords = (ev) => {
                        const rect = svg.getBoundingClientRect();
                        return {
                            x: ((ev.clientX - rect.left) / rect.width) * W,
                            y: ((ev.clientY - rect.top) / rect.height) * H
                        };
                    };

                    svg.querySelectorAll('.pc-curve-pt').forEach(el => {
                        el.onmousedown = (ev) => {
                            ev.stopPropagation();
                            const idx = Number(el.getAttribute('data-idx'));
                            if (ev.button === 2) {
                                if (keys.length > 2) {
                                    keys.splice(idx, 1);
                                    selectedIdx = Math.max(0, idx - 1);
                                    render();
                                    emitLive();
                                }
                                return;
                            }
                            selectedIdx = idx;
                            draggingIdx = idx;
                            render();
                        };
                        el.oncontextmenu = (ev) => {
                            ev.preventDefault();
                            const idx = Number(el.getAttribute('data-idx'));
                            if (keys.length > 2) {
                                keys.splice(idx, 1);
                                selectedIdx = Math.max(0, idx - 1);
                                render();
                                emitLive();
                            }
                        };
                    });

                    svg.onmousedown = (ev) => {
                        if (ev.button !== 0 || ev.target.classList?.contains('pc-curve-pt')) return;
                        const pt = getSvgCoords(ev);
                        const nt = Number(fromX(pt.x).toFixed(3));
                        const nv = Number(fromY(pt.y).toFixed(3));
                        keys.push({t: nt, v: nv});
                        keys.sort((a, b) => a.t - b.t);
                        selectedIdx = keys.findIndex(k => k.t === nt && k.v === nv);
                        draggingIdx = selectedIdx;
                        render();
                        emitLive();
                    };

                    if (winMove) window.removeEventListener('mousemove', winMove);
                    if (winUp) window.removeEventListener('mouseup', winUp);
                    winMove = (ev) => {
                        if (draggingIdx < 0 || !keys[draggingIdx]) return;
                        const pt = getSvgCoords(ev);
                        keys[draggingIdx].t = Number(fromX(pt.x).toFixed(3));
                        keys[draggingIdx].v = Number(fromY(pt.y).toFixed(3));
                        render();
                        emitLive();
                    };
                    winUp = () => { draggingIdx = -1; };
                    window.addEventListener('mousemove', winMove);
                    window.addEventListener('mouseup', winUp);

                    const inT = document.getElementById('pc_ce_t');
                    const inV = document.getElementById('pc_ce_v');
                    const inMin = document.getElementById('pc_ce_min');
                    const inMax = document.getElementById('pc_ce_max');
                    const delBtn = document.getElementById('pc_ce_del');

                    if (inT) inT.onchange = () => {
                        keys[selectedIdx].t = Math.max(0, Math.min(1, Number(inT.value) || 0));
                        render(); emitLive();
                    };
                    if (inV) inV.onchange = () => {
                        const nv = Number(inV.value) || 0;
                        keys[selectedIdx].v = nv;
                        if (nv < minV) minV = nv;
                        if (nv > maxV) maxV = nv;
                        render(); emitLive();
                    };
                    if (inMin) inMin.onchange = () => { minV = Number(inMin.value); if (maxV <= minV) maxV = minV + 1; render(); };
                    if (inMax) inMax.onchange = () => { maxV = Number(inMax.value); if (maxV <= minV) minV = maxV - 1; render(); };
                    if (delBtn) delBtn.onclick = () => {
                        if (keys.length > 2) {
                            keys.splice(selectedIdx, 1);
                            selectedIdx = Math.max(0, selectedIdx - 1);
                            render(); emitLive();
                        }
                    };
                    mount.querySelectorAll('.pc-curve-preset').forEach(btn => {
                        btn.onclick = () => {
                            const pr = PRESETS.find(x => x.id === btn.getAttribute('data-preset'));
                            if (!pr) return;
                            keys = pr.keys.map(k => ({t: k.t, v: k.v}));
                            minV = Math.min(0, ...keys.map(k => k.v));
                            maxV = Math.max(1.2, ...keys.map(k => k.v));
                            selectedIdx = 0;
                            render(); emitLive();
                        };
                    });
                };

                render();
            },
            onCancel() {
                if (winMove) window.removeEventListener('mousemove', winMove);
                if (winUp) window.removeEventListener('mouseup', winUp);
            },
            onConfirm() {
                if (winMove) window.removeEventListener('mousemove', winMove);
                if (winUp) window.removeEventListener('mouseup', winUp);
                const sorted = keys.slice().sort((a, b) => a.t - b.t)
                    .map(k => ({t: Number(k.t.toFixed(3)), v: Number(k.v.toFixed(4))}));
                if (typeof options.onConfirm === 'function') {
                    options.onConfirm({keys: sorted});
                }
                return true;
            }
        });
        dialog.show();
        return dialog;
    }

    return {PRESETS, normalizeKeys, buildMiniSvgPath, open};
})();


/* === src/ui/gradient_editor.js === */
const ParticleCueGradientEditor = (() => {
    const PRESETS = [
        {
            id: 'fire', label: 'Fire',
            stops: [[0, 1, 0.96, 0.72, 1], [0.35, 1, 0.55, 0.12, 0.95], [0.75, 0.82, 0.14, 0.04, 0.65], [1, 0.18, 0.03, 0.02, 0]]
        },
        {
            id: 'plasma', label: 'Plasma Cyan',
            stops: [[0, 0.9, 0.98, 1, 1], [0.35, 0.22, 0.88, 1, 0.95], [0.75, 0.42, 0.2, 0.95, 0.65], [1, 0.25, 0.08, 0.65, 0]]
        },
        {
            id: 'arcane', label: 'Arcane Gold',
            stops: [[0, 1, 0.96, 0.7, 1], [0.45, 1, 0.78, 0.2, 0.92], [0.85, 0.22, 0.85, 0.95, 0.5], [1, 0.1, 0.5, 0.7, 0]]
        },
        {
            id: 'void', label: 'Void Purple',
            stops: [[0, 0.95, 0.7, 1, 1], [0.4, 0.65, 0.2, 0.98, 0.9], [0.8, 0.25, 0.06, 0.45, 0.55], [1, 0.08, 0.02, 0.18, 0]]
        },
        {
            id: 'frost', label: 'Frost Ice',
            stops: [[0, 0.96, 0.99, 1, 1], [0.45, 0.58, 0.9, 1, 0.9], [0.85, 0.2, 0.55, 0.95, 0.45], [1, 0.12, 0.35, 0.7, 0]]
        },
        {
            id: 'fade_io', label: 'Fade In/Out',
            stops: [[0, 1, 1, 1, 0], [0.18, 1, 1, 1, 1], [0.8, 1, 1, 1, 1], [1, 1, 1, 1, 0]]
        }
    ];

    function normalizeStops(spec) {
        if (Array.isArray(spec) && spec.length > 0) {
            if (typeof spec[0] === 'number') {
                const c = [spec[0] ?? 1, spec[1] ?? 1, spec[2] ?? 1, spec[3] ?? 1];
                return [[0, ...c], [1, ...c]];
            }
            if (Array.isArray(spec[0]) && spec[0].length >= 4) {
                return spec.map(s => [
                    Math.max(0, Math.min(1, Number(s[0]) || 0)),
                    Number(s[1]) ?? 1, Number(s[2]) ?? 1, Number(s[3]) ?? 1,
                    s[4] !== undefined ? Number(s[4]) : 1
                ]).sort((a, b) => a[0] - b[0]);
            }
            if (typeof spec[0] === 'object' && spec[0] !== null) {
                return spec.map(s => {
                    const col = Array.isArray(s.color) ? s.color : [1, 1, 1, 1];
                    return [
                        Math.max(0, Math.min(1, Number(s.time ?? s.t ?? 0) || 0)),
                        col[0] ?? 1, col[1] ?? 1, col[2] ?? 1, col[3] ?? 1
                    ];
                }).sort((a, b) => a[0] - b[0]);
            }
        }
        if (spec && typeof spec === 'object') {
            if (Array.isArray(spec.stops)) return normalizeStops(spec.stops);
            if (Array.isArray(spec.keys)) return normalizeStops(spec.keys);
        }
        return [[0, 1, 1, 1, 1], [1, 1, 1, 1, 0]];
    }

    function buildCssGradient(spec) {
        const stops = normalizeStops(spec);
        const parts = stops.map(s => {
            const r = Math.max(0, Math.min(255, Math.round(s[1] * 255)));
            const g = Math.max(0, Math.min(255, Math.round(s[2] * 255)));
            const b = Math.max(0, Math.min(255, Math.round(s[3] * 255)));
            const a = Math.max(0, Math.min(1, s[4] ?? 1));
            return `rgba(${r},${g},${b},${a.toFixed(2)}) ${(s[0] * 100).toFixed(1)}%`;
        });
        return `linear-gradient(90deg, ${parts.join(', ')})`;
    }

    function open(options = {}) {
        const title = options.title || 'Gradient Color Editor';
        let stops = normalizeStops(options.value);
        let selectedIdx = 0;
        let winMove = null;
        let winUp = null;

        const emitLive = () => {
            if (typeof options.onChange === 'function') {
                const sorted = stops.slice().sort((a, b) => a[0] - b[0])
                    .map(s => s.map(v => Number(Number(v).toFixed(3))));
                options.onChange(sorted);
            }
        };

        const dialog = new Dialog({
            id: 'particlecue_gradient_editor_dialog',
            title,
            width: 560,
            lines: ['<div id="pc_grad_dialog_mount" class="pc-editor-wrap"></div>'],
            buttons: [Locale.t('dialog_inspect_save'), 'dialog.cancel'],
            onOpen() {
                const mount = document.getElementById('pc_grad_dialog_mount');
                if (!mount) return;
                let draggingIdx = -1;

                const render = () => {
                    stops.sort((a, b) => a[0] - b[0]);
                    if (selectedIdx >= stops.length) selectedIdx = Math.max(0, stops.length - 1);
                    const sel = stops[selectedIdx] || [0, 1, 1, 1, 1];
                    const hex = KilaMaterialCompiler.rgb01ToHex([sel[1], sel[2], sel[3]]);
                    const cssGrad = buildCssGradient(stops);

                    const handles = stops.map((s, idx) => {
                        const hHex = KilaMaterialCompiler.rgb01ToHex([s[1], s[2], s[3]]);
                        return `<div class="pc-grad-stop ${idx === selectedIdx ? 'selected' : ''}" data-idx="${idx}" style="left:${(s[0] * 100).toFixed(2)}%;background:${hHex};" title="t=${s[0].toFixed(2)} a=${s[4].toFixed(2)}"></div>`;
                    }).join('');

                    const presetBtns = PRESETS.map(pr =>
                        `<span class="pc-action-btn pc-grad-preset" data-preset="${pr.id}">${pr.label}</span>`
                    ).join('');

                    mount.innerHTML = `
                        <div class="pc-preset-row">
                            <span class="pc-label" style="margin-right:4px;">Presets:</span>
                            ${presetBtns}
                        </div>
                        <div class="pc-grad-track-wrap">
                            <div id="pc_grad_track" class="pc-grad-track">
                                <div class="pc-grad-fill" style="background:${cssGrad};"></div>
                                ${handles}
                            </div>
                        </div>
                        <div class="pc-grid-2">
                            <div class="pc-field">
                                <span class="pc-label">Stop Color & Time (0..1)</span>
                                <div class="pc-color-row">
                                    <input id="pc_ge_col" class="pc-color-swatch" type="color" value="${hex}" />
                                    <input id="pc_ge_t" class="pc-input" type="number" step="0.01" min="0" max="1" value="${sel[0].toFixed(3)}" />
                                </div>
                            </div>
                            <div class="pc-field">
                                <span class="pc-label">Alpha (${sel[4].toFixed(2)})</span>
                                <div style="display:flex;gap:6px;align-items:center;">
                                    <input id="pc_ge_a" type="range" min="0" max="1" step="0.01" value="${sel[4]}" style="flex:1;accent-color:var(--color-accent);" />
                                    <span id="pc_ge_del" class="pc-action-btn warn">Delete</span>
                                </div>
                            </div>
                        </div>
                        <div class="pc-label">Click gradient bar to insert stop · Drag handle to move · Selected stop #${selectedIdx + 1}/${stops.length}</div>
                    `;

                    const track = document.getElementById('pc_grad_track');
                    track.querySelectorAll('.pc-grad-stop').forEach(el => {
                        el.onmousedown = (ev) => {
                            ev.stopPropagation();
                            selectedIdx = Number(el.getAttribute('data-idx'));
                            draggingIdx = selectedIdx;
                            render();
                        };
                    });

                    track.onmousedown = (ev) => {
                        if (ev.target.classList?.contains('pc-grad-stop')) return;
                        const rect = track.getBoundingClientRect();
                        const t = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
                        const sampled = LumenFxSchema.evalColorCurve(stops, t, 1);
                        stops.push([Number(t.toFixed(3)), sampled[0], sampled[1], sampled[2], sampled[3]]);
                        stops.sort((a, b) => a[0] - b[0]);
                        selectedIdx = stops.findIndex(s => Math.abs(s[0] - Number(t.toFixed(3))) < 0.002);
                        draggingIdx = selectedIdx;
                        render();
                        emitLive();
                    };

                    if (winMove) window.removeEventListener('mousemove', winMove);
                    if (winUp) window.removeEventListener('mouseup', winUp);
                    winMove = (ev) => {
                        if (draggingIdx < 0 || !stops[draggingIdx]) return;
                        const rect = track.getBoundingClientRect();
                        const t = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
                        stops[draggingIdx][0] = Number(t.toFixed(3));
                        render();
                        emitLive();
                    };
                    winUp = () => { draggingIdx = -1; };
                    window.addEventListener('mousemove', winMove);
                    window.addEventListener('mouseup', winUp);

                    const inCol = document.getElementById('pc_ge_col');
                    const inT = document.getElementById('pc_ge_t');
                    const inA = document.getElementById('pc_ge_a');
                    const delBtn = document.getElementById('pc_ge_del');

                    if (inCol) inCol.oninput = () => {
                        const rgb = KilaMaterialCompiler.hexToRgb01(inCol.value);
                        stops[selectedIdx][1] = rgb[0];
                        stops[selectedIdx][2] = rgb[1];
                        stops[selectedIdx][3] = rgb[2];
                        render(); emitLive();
                    };
                    if (inT) inT.onchange = () => {
                        stops[selectedIdx][0] = Math.max(0, Math.min(1, Number(inT.value) || 0));
                        render(); emitLive();
                    };
                    if (inA) inA.oninput = () => {
                        stops[selectedIdx][4] = Math.max(0, Math.min(1, Number(inA.value)));
                        render(); emitLive();
                    };
                    if (delBtn) delBtn.onclick = () => {
                        if (stops.length > 2) {
                            stops.splice(selectedIdx, 1);
                            selectedIdx = Math.max(0, selectedIdx - 1);
                            render(); emitLive();
                        }
                    };
                    mount.querySelectorAll('.pc-grad-preset').forEach(btn => {
                        btn.onclick = () => {
                            const pr = PRESETS.find(x => x.id === btn.getAttribute('data-preset'));
                            if (!pr) return;
                            stops = pr.stops.map(s => s.slice());
                            selectedIdx = 0;
                            render(); emitLive();
                        };
                    });
                };

                render();
            },
            onCancel() {
                if (winMove) window.removeEventListener('mousemove', winMove);
                if (winUp) window.removeEventListener('mouseup', winUp);
            },
            onConfirm() {
                if (winMove) window.removeEventListener('mousemove', winMove);
                if (winUp) window.removeEventListener('mouseup', winUp);
                const sorted = stops.slice().sort((a, b) => a[0] - b[0])
                    .map(s => s.map(v => Number(Number(v).toFixed(3))));
                if (typeof options.onConfirm === 'function') {
                    options.onConfirm(sorted);
                }
                return true;
            }
        });
        dialog.show();
        return dialog;
    }

    return {PRESETS, normalizeStops, buildCssGradient, open};
})();


/* === src/ui/shader_graph_editor.js === */
const ParticleCueShaderGraphEditor = (() => {
    const CATEGORIES = ['Input', 'Procedural', 'Kila', 'Math'];

    function cloneGraph(g) {
        return JSON.parse(JSON.stringify(g));
    }

    function open(options = {}) {
        const title = options.title || 'KilaGraph — Visual Shader Node Editor';
        let graph = (options.graph && Array.isArray(options.graph.nodes) && options.graph.nodes.length)
            ? cloneGraph(options.graph)
            : KilaMaterialCompiler.createGraphPreset(options.preset || 'dissolve_fire');

        let selectedNodeId = graph.nodes[0]?.id || '';
        let activeOutPort = null; // { nodeId, portId }
        let panX = 16;
        let panY = 24;
        let zoom = 0.62;
        let showGlsl = false;
        let liveSync = true;
        let nextSeq = graph.nodes.length + 10;
        let winMoveHandler = null;
        let winUpHandler = null;

        const computeAutoFit = (canvasW = 580, canvasH = 540) => {
            if (!graph.nodes.length) { panX = 16; panY = 20; zoom = 0.72; return; }
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (const n of graph.nodes) {
                minX = Math.min(minX, n.x);
                minY = Math.min(minY, n.y);
                maxX = Math.max(maxX, n.x + 170);
                maxY = Math.max(maxY, n.y + 110);
            }
            const spanW = Math.max(200, maxX - minX + 48);
            const spanH = Math.max(160, maxY - minY + 48);
            zoom = Number(Math.max(0.45, Math.min(0.95, Math.min(canvasW / spanW, canvasH / spanH))).toFixed(2));
            panX = Math.round((canvasW - (maxX - minX) * zoom) * 0.5 - minX * zoom);
            panY = Math.round((canvasH - (maxY - minY) * zoom) * 0.5 - minY * zoom);
        };
        computeAutoFit();

        const catalog = KilaMaterialCompiler.NODE_CATALOG;

        const compileAndValidate = () => {
            const compiled = KilaMaterialCompiler.compileShaderGraph(graph);
            if (!compiled.ok) return {ok: false, glsl: '', error: compiled.error};
            const gpu = KilaMaterialCompiler.validateGlslInWebGL2(compiled.glsl);
            return {
                ok: gpu.ok,
                glsl: compiled.glsl,
                error: gpu.error || ''
            };
        };

        const emitLive = () => {
            if (!liveSync || typeof options.onApply !== 'function') return;
            const res = compileAndValidate();
            if (res.ok && res.glsl) {
                options.onApply({graph: cloneGraph(graph), glsl: res.glsl, live: true});
            }
        };

        const dialog = new Dialog({
            id: 'particlecue_kilagraph_dialog',
            title,
            width: 1080,
            lines: ['<div id="pc_kg_mount"></div>'],
            buttons: [Locale.t('dialog_inspect_save'), 'dialog.cancel'],
            onOpen() {
                const mount = document.getElementById('pc_kg_mount');
                if (!mount) return;

                let dragNode = null; // { id, startX, startY, origX, origY }
                let dragPan = null;  // { startX, startY, origPanX, origPanY }

                const getPortAnchor = (node, portId, isOutput) => {
                    const def = catalog[node.type];
                    if (!def) return {x: node.x, y: node.y};
                    const list = isOutput ? def.outputs : def.inputs;
                    const idx = Math.max(0, list.findIndex(p => p.id === portId));
                    const nodeW = 160;
                    const headerH = 26;
                    const rowH = 20;
                    return {
                        x: node.x + (isOutput ? nodeW : 0),
                        y: node.y + headerH + 10 + idx * rowH
                    };
                };

                const escapeHtml = (s) => String(s ?? '')
                    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

                const renderInspectorParams = (node) => {
                    if (!node) return '<div class="pc-label">Select a node to inspect or click palette to add.</div>';
                    const def = catalog[node.type];
                    if (!def) return '';
                    const params = Object.assign({}, def.defaults || {}, node.params || {});
                    const keys = Object.keys(params);
                    let rows = '';
                    for (const k of keys) {
                        const val = params[k];
                        if (k === 'hex' || k === 'edgeHex') {
                            rows += `
                                <div class="pc-field">
                                    <span class="pc-label">${escapeHtml(k)}</span>
                                    <div class="pc-color-row">
                                        <input class="pc-color-swatch pc-kg-param" data-param="${escapeHtml(k)}" type="color" value="${escapeHtml(val)}" />
                                        <span class="pc-label">${escapeHtml(val)}</span>
                                    </div>
                                </div>`;
                        } else if (k === 'slot') {
                            rows += `
                                <div class="pc-field">
                                    <span class="pc-label">Texture Slot</span>
                                    <select class="pc-select pc-kg-param" data-param="slot">
                                        <option value="uTex" ${val === 'uTex' ? 'selected' : ''}>uTex (Sampler0)</option>
                                        <option value="uTex1" ${val === 'uTex1' ? 'selected' : ''}>uTex1 (Sampler1)</option>
                                    </select>
                                </div>`;
                        } else if (typeof val === 'number') {
                            rows += `
                                <div class="pc-field">
                                    <span class="pc-label">${escapeHtml(k)}</span>
                                    <input class="pc-input pc-kg-param" data-param="${escapeHtml(k)}" data-num="1" type="number" step="0.05" value="${val}" />
                                </div>`;
                        }
                    }
                    const delBtn = node.type !== 'fragment_output'
                        ? `<span id="pc_kg_del_node" class="pc-action-btn warn" style="margin-top:6px;"><i class="material-icons">delete_outline</i>Delete Node</span>`
                        : '';
                    return `
                        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                            <span class="pc-kg-pal-dot" style="background:${def.color};"></span>
                            <strong style="font-size:12px;">${escapeHtml(def.label)}</strong>
                            <span class="pc-chip">${escapeHtml(node.id)}</span>
                        </div>
                        ${rows || '<div class="pc-label">No adjustable parameters. Connect sockets on canvas.</div>'}
                        ${delBtn}
                    `;
                };

                const render = () => {
                    const status = compileAndValidate();
                    const connectedIn = new Set(graph.links.map(l => `${l.toNode}::${l.toPort}`));
                    const connectedOut = new Set(graph.links.map(l => `${l.fromNode}::${l.fromPort}`));
                    const nodeMap = new Map(graph.nodes.map(n => [n.id, n]));

                    // Palette HTML
                    let paletteHtml = '';
                    for (const cat of CATEGORIES) {
                        paletteHtml += `<div class="pc-kg-cat">${cat}</div>`;
                        for (const [typeId, def] of Object.entries(catalog)) {
                            if (def.category !== cat) continue;
                            paletteHtml += `
                                <div class="pc-kg-pal-item" data-add-type="${typeId}">
                                    <span class="pc-kg-pal-dot" style="background:${def.color};"></span>
                                    <span>${escapeHtml(def.label)}</span>
                                </div>`;
                        }
                    }

                    // Wires SVG (offset +2000 because svg sits at -2000,-2000)
                    const wirePaths = graph.links.map((lk, idx) => {
                        const fromN = nodeMap.get(lk.fromNode);
                        const toN = nodeMap.get(lk.toNode);
                        if (!fromN || !toN) return '';
                        const a = getPortAnchor(fromN, lk.fromPort, true);
                        const b = getPortAnchor(toN, lk.toPort, false);
                        const dx = Math.max(40, Math.abs(b.x - a.x) * 0.5);
                        const x1 = a.x + 2000, y1 = a.y + 2000;
                        const x2 = b.x + 2000, y2 = b.y + 2000;
                        return `<path class="pc-kg-wire" data-link-idx="${idx}" d="M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}" />`;
                    }).join('');

                    // Nodes HTML
                    const nodesHtml = graph.nodes.map(node => {
                        const def = catalog[node.type];
                        if (!def) return '';
                        const inHtml = def.inputs.map(p => {
                            const key = `${node.id}::${p.id}`;
                            const cls = `pc-kg-sock ${p.type} ${connectedIn.has(key) ? 'connected' : ''}`;
                            return `<div class="pc-kg-port in" data-node="${node.id}" data-port="${p.id}" data-dir="in"><span class="${cls}"></span><span>${escapeHtml(p.label)}</span></div>`;
                        }).join('');
                        const outHtml = def.outputs.map(p => {
                            const key = `${node.id}::${p.id}`;
                            const isAct = activeOutPort && activeOutPort.nodeId === node.id && activeOutPort.portId === p.id;
                            const cls = `pc-kg-sock ${p.type} ${connectedOut.has(key) ? 'connected' : ''} ${isAct ? 'active' : ''}`;
                            return `<div class="pc-kg-port out" data-node="${node.id}" data-port="${p.id}" data-dir="out"><span>${escapeHtml(p.label)}</span><span class="${cls}"></span></div>`;
                        }).join('');
                        const summary = node.type === 'float' ? `= ${node.params?.value ?? def.defaults.value}`
                            : (node.type === 'color' ? `<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${escapeHtml(node.params?.hex || def.defaults.hex)};vertical-align:middle;margin-right:3px;"></span>${node.params?.intensity ?? def.defaults.intensity}x` : '');

                        return `
                            <div class="pc-kg-node ${node.id === selectedNodeId ? 'selected' : ''}" data-node-id="${node.id}" style="left:${node.x}px;top:${node.y}px;width:160px;">
                                <div class="pc-kg-node-head" style="background:${def.color};" data-drag-node="${node.id}">
                                    <span>${escapeHtml(def.label)}</span>
                                    <span style="opacity:0.75;font-size:9.5px;">${escapeHtml(node.id)}</span>
                                </div>
                                <div class="pc-kg-node-body">
                                    <div class="pc-kg-ports">
                                        <div class="pc-kg-port-col">${inHtml}</div>
                                        <div class="pc-kg-port-col">${outHtml}</div>
                                    </div>
                                    ${summary ? `<div style="font-size:10px;opacity:0.8;padding-top:2px;">${summary}</div>` : ''}
                                </div>
                            </div>`;
                    }).join('');

                    const selNode = nodeMap.get(selectedNodeId) || null;
                    const rightContent = showGlsl
                        ? `<div class="pc-label">Generated LumenFX GLSL (.fsh)</div>
                           <textarea class="pc-kg-code" readonly>${escapeHtml(status.glsl || status.error)}</textarea>`
                        : `${renderInspectorParams(selNode)}
                           <div style="margin-top:auto;padding-top:8px;border-top:1px solid var(--color-border);font-size:10.5px;color:var(--color-subtle_text);line-height:1.45;">
                               • Click output socket → click input socket to wire<br>
                               • Click wire to disconnect<br>
                               • Drag empty canvas to pan · Wheel to zoom
                           </div>`;

                    mount.innerHTML = `
                        <div class="pc-kg-shell">
                            <div class="pc-kg-toolbar">
                                <span class="pc-label">Preset:</span>
                                <select id="pc_kg_preset" class="pc-select" style="width:155px;">
                                    <option value="dissolve_fire" ${graph.preset === 'dissolve_fire' ? 'selected' : ''}>Dissolve Fire</option>
                                    <option value="hologram_scanline" ${graph.preset === 'hologram_scanline' ? 'selected' : ''}>Hologram Scanline</option>
                                    <option value="fresnel_orb" ${graph.preset === 'fresnel_orb' ? 'selected' : ''}>Fresnel Energy Orb</option>
                                    <option value="astral_vortex" ${graph.preset === 'astral_vortex' ? 'selected' : ''}>Astral Vortex</option>
                                </select>
                                <span id="pc_kg_reset_view" class="pc-action-btn"><i class="material-icons">center_focus_strong</i>Reset View</span>
                                <span id="pc_kg_toggle_glsl" class="pc-action-btn ${showGlsl ? 'primary' : ''}"><i class="material-icons">code</i>GLSL</span>
                                <label class="pc-check" style="margin-left:4px;"><input id="pc_kg_live" type="checkbox" ${liveSync ? 'checked' : ''} />Live Sync</label>
                                <div style="flex:1;"></div>
                                <span class="pc-chip ${status.ok ? 'ok' : 'warn'}" title="${escapeHtml(status.error || 'WebGL2 GLSL3 valid')}">
                                    ${status.ok ? 'GLSL OK' : 'GLSL ERR'}
                                </span>
                                <span id="pc_kg_export_fsh" class="pc-action-btn"><i class="material-icons">file_download</i>.fsh</span>
                            </div>
                            <div class="pc-kg-main">
                                <div class="pc-kg-palette">${paletteHtml}</div>
                                <div id="pc_kg_canvas" class="pc-kg-canvas">
                                    <div id="pc_kg_world" class="pc-kg-world" style="transform:translate(${panX}px, ${panY}px) scale(${zoom});">
                                        <svg class="pc-kg-wires">${wirePaths}</svg>
                                        ${nodesHtml}
                                    </div>
                                </div>
                                <div class="pc-kg-inspector">
                                    ${rightContent}
                                </div>
                            </div>
                        </div>
                    `;

                    // Bind toolbar
                    const presetSel = document.getElementById('pc_kg_preset');
                    if (presetSel) presetSel.onchange = () => {
                        graph = KilaMaterialCompiler.createGraphPreset(presetSel.value);
                        selectedNodeId = graph.nodes[0]?.id || '';
                        activeOutPort = null;
                        const cv = document.getElementById('pc_kg_canvas');
                        computeAutoFit(cv?.clientWidth || 580, cv?.clientHeight || 540);
                        render(); emitLive();
                    };
                    const resetBtn = document.getElementById('pc_kg_reset_view');
                    if (resetBtn) resetBtn.onclick = () => {
                        const cv = document.getElementById('pc_kg_canvas');
                        computeAutoFit(cv?.clientWidth || 580, cv?.clientHeight || 540);
                        render();
                    };
                    const glslBtn = document.getElementById('pc_kg_toggle_glsl');
                    if (glslBtn) glslBtn.onclick = () => { showGlsl = !showGlsl; render(); };
                    const liveCb = document.getElementById('pc_kg_live');
                    if (liveCb) liveCb.onchange = () => { liveSync = liveCb.checked; if (liveSync) emitLive(); };
                    const expBtn = document.getElementById('pc_kg_export_fsh');
                    if (expBtn) expBtn.onclick = () => {
                        const res = compileAndValidate();
                        if (!res.ok) {
                            Blockbench.showQuickMessage(`Cannot export: ${res.error}`, 3500);
                            return;
                        }
                        Blockbench.export({
                            type: 'LumenFX Fragment Shader',
                            extensions: ['fsh'],
                            name: `${Platform.sanitizeFilename(options.materialName || 'kilagraph_shader')}`,
                            content: res.glsl
                        });
                    };

                    // Bind palette add
                    mount.querySelectorAll('.pc-kg-pal-item').forEach(item => {
                        item.onclick = () => {
                            const typeId = item.getAttribute('data-add-type');
                            const def = catalog[typeId];
                            if (!def) return;
                            const id = `n${nextSeq++}`;
                            const nx = Math.round((260 - panX) / zoom + (nextSeq % 4) * 24);
                            const ny = Math.round((160 - panY) / zoom + (nextSeq % 4) * 20);
                            graph.nodes.push({
                                id,
                                type: typeId,
                                x: nx,
                                y: ny,
                                params: JSON.parse(JSON.stringify(def.defaults || {}))
                            });
                            selectedNodeId = id;
                            render();
                        };
                    });

                    // Bind node selection & header dragging
                    mount.querySelectorAll('.pc-kg-node').forEach(el => {
                        el.onmousedown = (ev) => {
                            if (ev.target.closest('.pc-kg-port')) return;
                            const nid = el.getAttribute('data-node-id');
                            selectedNodeId = nid;
                            const head = ev.target.closest('.pc-kg-node-head');
                            if (head) {
                                const node = nodeMap.get(nid);
                                dragNode = {id: nid, startX: ev.clientX, startY: ev.clientY, origX: node.x, origY: node.y};
                            }
                            render();
                        };
                    });

                    // Bind sockets
                    mount.querySelectorAll('.pc-kg-port').forEach(el => {
                        el.onclick = (ev) => {
                            ev.stopPropagation();
                            const nid = el.getAttribute('data-node');
                            const pid = el.getAttribute('data-port');
                            const dir = el.getAttribute('data-dir');
                            if (dir === 'out') {
                                if (activeOutPort && activeOutPort.nodeId === nid && activeOutPort.portId === pid) {
                                    activeOutPort = null;
                                } else {
                                    activeOutPort = {nodeId: nid, portId: pid};
                                }
                                render();
                            } else if (dir === 'in') {
                                if (activeOutPort && activeOutPort.nodeId !== nid) {
                                    // Replace any existing link to this input port
                                    graph.links = graph.links.filter(l => !(l.toNode === nid && l.toPort === pid));
                                    graph.links.push({
                                        fromNode: activeOutPort.nodeId,
                                        fromPort: activeOutPort.portId,
                                        toNode: nid,
                                        toPort: pid
                                    });
                                    activeOutPort = null;
                                    render();
                                    emitLive();
                                } else {
                                    // Disconnect input port if clicked alone
                                    const before = graph.links.length;
                                    graph.links = graph.links.filter(l => !(l.toNode === nid && l.toPort === pid));
                                    if (graph.links.length !== before) {
                                        render();
                                        emitLive();
                                    }
                                }
                            }
                        };
                    });

                    // Bind wire click to disconnect
                    mount.querySelectorAll('.pc-kg-wire').forEach(el => {
                        el.onclick = (ev) => {
                            ev.stopPropagation();
                            const idx = Number(el.getAttribute('data-link-idx'));
                            if (idx >= 0 && idx < graph.links.length) {
                                graph.links.splice(idx, 1);
                                render();
                                emitLive();
                            }
                        };
                    });

                    // Bind canvas pan & zoom
                    const canvas = document.getElementById('pc_kg_canvas');
                    if (canvas) {
                        canvas.onmousedown = (ev) => {
                            if (ev.target.closest('.pc-kg-node') || ev.target.classList?.contains('pc-kg-wire')) return;
                            activeOutPort = null;
                            dragPan = {startX: ev.clientX, startY: ev.clientY, origPanX: panX, origPanY: panY};
                        };
                        canvas.onwheel = (ev) => {
                            ev.preventDefault();
                            const factor = ev.deltaY < 0 ? 1.09 : 0.92;
                            zoom = Math.max(0.45, Math.min(1.6, zoom * factor));
                            const w = document.getElementById('pc_kg_world');
                            if (w) w.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
                        };
                    }

                    // Bind inspector params
                    mount.querySelectorAll('.pc-kg-param').forEach(inp => {
                        const handler = () => {
                            const node = nodeMap.get(selectedNodeId);
                            if (!node) return;
                            const key = inp.getAttribute('data-param');
                            if (!node.params) node.params = {};
                            node.params[key] = inp.getAttribute('data-num') ? (Number(inp.value) || 0) : inp.value;
                            emitLive();
                            if (showGlsl || inp.type === 'color' || inp.tagName === 'SELECT') render();
                        };
                        inp.onchange = handler;
                        if (inp.type === 'color') inp.oninput = handler;
                    });

                    const delBtn = document.getElementById('pc_kg_del_node');
                    if (delBtn) delBtn.onclick = () => {
                        const node = nodeMap.get(selectedNodeId);
                        if (!node || node.type === 'fragment_output') return;
                        graph.nodes = graph.nodes.filter(n => n.id !== selectedNodeId);
                        graph.links = graph.links.filter(l => l.fromNode !== selectedNodeId && l.toNode !== selectedNodeId);
                        selectedNodeId = graph.nodes[0]?.id || '';
                        render();
                        emitLive();
                    };
                };

                winMoveHandler = (ev) => {
                    if (dragNode) {
                        const node = graph.nodes.find(n => n.id === dragNode.id);
                        if (node) {
                            node.x = Math.round(dragNode.origX + (ev.clientX - dragNode.startX) / zoom);
                            node.y = Math.round(dragNode.origY + (ev.clientY - dragNode.startY) / zoom);
                            render();
                        }
                    } else if (dragPan) {
                        panX = Math.round(dragPan.origPanX + (ev.clientX - dragPan.startX));
                        panY = Math.round(dragPan.origPanY + (ev.clientY - dragPan.startY));
                        const w = document.getElementById('pc_kg_world');
                        if (w) w.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
                    }
                };
                winUpHandler = () => {
                    dragNode = null;
                    dragPan = null;
                };
                window.addEventListener('mousemove', winMoveHandler);
                window.addEventListener('mouseup', winUpHandler);

                render();
                const cv = document.getElementById('pc_kg_canvas');
                if (cv && cv.clientWidth > 100) {
                    computeAutoFit(cv.clientWidth, cv.clientHeight || 540);
                    render();
                }
            },
            onCancel() {
                if (winMoveHandler) window.removeEventListener('mousemove', winMoveHandler);
                if (winUpHandler) window.removeEventListener('mouseup', winUpHandler);
            },
            onConfirm() {
                if (winMoveHandler) window.removeEventListener('mousemove', winMoveHandler);
                if (winUpHandler) window.removeEventListener('mouseup', winUpHandler);
                const res = compileAndValidate();
                if (!res.ok) {
                    Blockbench.showQuickMessage(`Shader compile error: ${res.error}`, 4000);
                    return false;
                }
                if (typeof options.onApply === 'function') {
                    options.onApply({graph: cloneGraph(graph), glsl: res.glsl, live: false});
                }
                return true;
            }
        });
        dialog.show();
        return dialog;
    }

    return {open};
})();


/* === src/ui/dialogs.js === */
const ParticleCueDialogs = (() => {
    function escapeHtml(text) {
        return String(text ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function guard(fn) {
        return (...args) => {
            try {
                const out = fn(...args);
                if (out && typeof out.catch === 'function') {
                    out.catch(err => showError(err));
                }
                return out;
            } catch (err) {
                showError(err);
                return undefined;
            }
        };
    }

    function showError(err) {
        const msg = err instanceof Error ? err.message : String(err || 'Unknown error');
        console.error('[ParticleCue Studio]', err);
        if (typeof Blockbench !== 'undefined' && typeof Blockbench.showMessageBox === 'function') {
            Blockbench.showMessageBox({
                title: Locale.t('plugin_title'),
                message: msg,
                icon: 'error'
            });
        }
    }

    function ready() {
        return typeof Project !== 'undefined' && Boolean(Project);
    }

    function openNewEffectDialog() {
        if (!ready()) return;
        const project = Project;
        const locEntries = typeof AnimCueBridge !== 'undefined' ? AnimCueBridge.listParticipantLocators() : [];
        const locOptions = {none: '(None / Entity Origin)'};
        for (const loc of locEntries) {
            locOptions[loc.uuid] = `${loc.qualifiedName} (${loc.role})`;
        }

        const dialog = new Dialog({
            id: 'particlecue_new_effect_dialog',
            title: Locale.t('dialog_new_title'),
            form: {
                preset: {
                    label: 'Format / Preset',
                    type: 'select',
                    value: 'lumenfx_sprite',
                    options: {
                        snowstorm: 'Snowstorm / Bedrock Particle',
                        lumenfx_sprite: 'LumenFX JSON — Sprite Burst',
                        lumenfx_ribbon: 'LumenFX JSON — Ribbon Stream',
                        lumenfx_beam: 'LumenFX JSON — Energy Beam',
                        lumenfx_mesh: 'LumenFX JSON — 3D Mesh Crystal',
                        photon_fx: 'Photon .fx (GZIP NBT)',
                        kbr_geckolib: 'KBR 3D Particle — GeckoLib',
                        kbr_geometry: 'KBR 3D Particle — Vanilla Geometry',
                        kbr_poly_mesh: 'KBR 3D Particle — Poly Mesh',
                        kbr_hardcode: 'KBR 3D Particle — Hardcode (Placeholder)'
                    }
                },
                effect_id: {
                    label: 'Effect Identifier',
                    type: 'text',
                    value: 'particlecue:new_effect'
                },
                locator_uuid: {
                    label: 'Locator / Participant Target',
                    type: 'select',
                    value: 'none',
                    options: locOptions
                },
                pre_effect_script: {
                    label: 'Pre-Effect Script (Molang / LumenFX directives)',
                    type: 'text',
                    value: ''
                }
            },
            onConfirm(form) {
                const effId = String(form.effect_id || 'particlecue:new_effect').trim();
                const pickedLoc = locEntries.find(l => l.uuid === form.locator_uuid) || null;
                let rawText = '';
                let fileName = `${Platform.sanitizeFilename(effId.split(':').pop() || 'effect')}.json`;
                let embeddedModels = {};

                if (form.preset === 'snowstorm') {
                    rawText = SnowstormEditor.createPreset({identifier: effId});
                    fileName = `${Platform.sanitizeFilename(effId.split(':').pop() || 'effect')}.particle.json`;
                } else if (form.preset.startsWith('lumenfx_')) {
                    const map = {
                        lumenfx_sprite: 'sprite_burst',
                        lumenfx_ribbon: 'ribbon_stream',
                        lumenfx_beam: 'beam_arc',
                        lumenfx_mesh: 'mesh_crystal'
                    };
                    const presetObj = LumenFxSchema.createPreset(map[form.preset], effId);
                    rawText = JSON.stringify(presetObj, null, 2);
                } else if (form.preset === 'photon_fx') {
                    const nbt = PhotonFxAdapter.createPresetNbt({name: effId.split(':').pop() || 'photon_fx'});
                    const bytes = PhotonFxAdapter.writeNbt(nbt, true);
                    rawText = PhotonFxAdapter.encodeBinaryString(bytes);
                    fileName = `${Platform.sanitizeFilename(effId.split(':').pop() || 'effect')}.fx`;
                } else if (form.preset.startsWith('kbr_')) {
                    const variant = form.preset.replace(/^kbr_/, '');
                    const parts = effId.includes(':') ? effId.split(':') : ['particlecue', effId];
                    const bundle = KbrModelSchema.createPreset({
                        namespace: parts[0],
                        id: parts[1],
                        variant
                    });
                    rawText = JSON.stringify(bundle.particleDefinition, null, 2);
                    embeddedModels = {
                        [bundle.modelDescriptorId]: {
                            descriptor: bundle.modelDescriptor,
                            geometryJson: bundle.geometryJson
                        }
                    };
                }

                KeyframeStore.createAndBindEffect(project, {
                    rawText,
                    fileName,
                    effectName: effId,
                    locator: pickedLoc ? pickedLoc.name : '',
                    participantRole: pickedLoc ? pickedLoc.role : 'primary',
                    locatorUuid: pickedLoc ? pickedLoc.uuid : '',
                    script: String(form.pre_effect_script || '').trim(),
                    embeddedModels
                });
                Blockbench.showQuickMessage(`Created ${effId} (${form.preset})`, 3000);
            }
        });
        dialog.show();
        return dialog;
    }

    function openImportParticleFileDialog() {
        if (!ready()) return;
        const project = Project;
        Blockbench.import({
            resource_id: 'particlecue_import_effect',
            type: 'Particle Effect (.json, .fx)',
            extensions: ['json', 'fx'],
            readtype: 'buffer'
        }, files => {
            if (!files || !files[0]) return;
            const file = files[0];
            const isFx = (file.path || file.name || '').toLowerCase().endsWith('.fx');
            let rawText = '';
            if (isFx) {
                const bytes = file.content instanceof Uint8Array
                    ? file.content
                    : new Uint8Array(file.content);
                rawText = PhotonFxAdapter.encodeBinaryString(bytes);
            } else {
                rawText = typeof file.content === 'string'
                    ? file.content
                    : new TextDecoder('utf-8').decode(new Uint8Array(file.content));
            }
            const res = KeyframeStore.createAndBindEffect(project, {
                rawText,
                filePath: file.path || '',
                fileName: file.name || Platform.basename(file.path || 'effect.json')
            });
            Blockbench.showQuickMessage(`Imported ${res.record.identifier} [${res.record.format}]`, 3000);
        });
    }

    function openExportPalEmoteDialog() {
        if (!ready()) return;
        const anim = typeof Animation !== 'undefined' ? Animation.selected : null;
        if (!anim) {
            Blockbench.showMessageBox({
                title: Locale.t('plugin_title'),
                message: 'Please select an animation first.',
                icon: 'info'
            });
            return;
        }
        Blockbench.export({
            resource_id: 'particlecue_pal_emote',
            type: 'PAL Emote JSON',
            extensions: ['json'],
            name: `${Platform.sanitizeFilename(anim.name || 'emote')}.emote`,
            custom_writer: (_c, savePath) => {
                try {
                    const out = PalBridge.exportEmoteJsonWithParticles(anim, savePath);
                    Blockbench.showQuickMessage(`Exported PAL emote (${out.particleEventCount} particle events): ${savePath}`, 4000);
                } catch (err) {
                    showError(err);
                }
            }
        });
    }

    function openRelinkDialog(initialRootDir) {
        if (!ready()) return;
        const project = Project;
        const report = AssetResolver.scanProject(project, {notify: false});
        if (!report.missingItems.length) {
            Blockbench.showMessageBox({
                title: Locale.t('dialog_relink_title'),
                message: Locale.t('dialog_relink_none_missing'),
                icon: 'check_circle'
            });
            return;
        }

        let currentPlan = initialRootDir ? AssetResolver.planRelinkFromRoot(project, initialRootDir) : null;
        const choices = {};

        const renderBody = () => {
            const rootLabel = currentPlan?.rootDir
                ? `<div style="margin-bottom:8px;font-size:12px;opacity:0.85;">Root: <code>${escapeHtml(currentPlan.rootDir)}</code> (${currentPlan.scannedJsonCount} particle files / ${currentPlan.scannedImageCount} images)</div>`
                : '';

            let rowsHtml = '';
            if (currentPlan) {
                for (const g of currentPlan.groups) {
                    const kfSummary = g.keyframes
                        .map(k => `${k.animationName} @ ${k.time.toFixed(2)}s${k.locator ? ` [${k.locator}]` : ''}`)
                        .join('<br>');
                    let controlHtml = '';
                    if (g.candidates.length === 0) {
                        controlHtml = `<span style="color:#ff7b72;">${escapeHtml(Locale.t('dialog_relink_no_match'))}</span>`;
                    } else if (g.status === 'matched' && g.candidates.length === 1) {
                        const c = g.candidates[0];
                        controlHtml = `<span style="color:#7ee787;">${escapeHtml(Locale.t('dialog_relink_matched'))}:</span> <code>${escapeHtml(c.relPath)}</code>`;
                    } else {
                        const selected = choices[g.groupKey] !== undefined ? choices[g.groupKey] : (g.selectedPath || '');
                        const opts = [
                            `<option value="" ${selected === '' ? 'selected' : ''}>-- ${escapeHtml(Locale.t('dialog_relink_ambiguous'))} --</option>`,
                            ...g.candidates.map(c =>
                                `<option value="${escapeHtml(c.fullPath)}" ${selected === c.fullPath ? 'selected' : ''}>${escapeHtml(c.relPath)} [${c.hash.slice(0, 8)} · ${escapeHtml(c.reasons.join(','))}]</option>`
                            ),
                            `<option value="__skip__" ${selected === '__skip__' ? 'selected' : ''}>[Skip / Keep unchanged]</option>`
                        ].join('');
                        controlHtml = `<select class="pc-relink-select" data-group="${escapeHtml(g.groupKey)}" style="width:100%;max-width:340px;">${opts}</select>`;
                    }

                    rowsHtml += `<tr>
                        <td style="padding:6px;border-bottom:1px solid var(--color-border);vertical-align:top;">${escapeHtml(g.effects.join(', ') || '-')}</td>
                        <td style="padding:6px;border-bottom:1px solid var(--color-border);vertical-align:top;"><code>${escapeHtml(g.originalFile)}</code></td>
                        <td style="padding:6px;border-bottom:1px solid var(--color-border);vertical-align:top;font-size:12px;">${kfSummary}</td>
                        <td style="padding:6px;border-bottom:1px solid var(--color-border);vertical-align:top;">${controlHtml}</td>
                    </tr>`;
                }
            } else {
                for (const m of report.missingItems) {
                    rowsHtml += `<tr>
                        <td style="padding:6px;border-bottom:1px solid var(--color-border);">${escapeHtml(m.effect || '-')}</td>
                        <td style="padding:6px;border-bottom:1px solid var(--color-border);"><code>${escapeHtml(m.file)}</code></td>
                        <td style="padding:6px;border-bottom:1px solid var(--color-border);font-size:12px;">${escapeHtml(m.animationName)} @ ${m.time.toFixed(2)}s${m.locator ? ` [${escapeHtml(m.locator)}]` : ''}</td>
                        <td style="padding:6px;border-bottom:1px solid var(--color-border);opacity:0.75;">-</td>
                    </tr>`;
                }
            }

            return `
                <div style="margin-bottom:10px;display:flex;gap:8px;align-items:center;">
                    <button type="button" id="pc_pick_relink_root">${escapeHtml(Locale.t('dialog_relink_pick_root'))}</button>
                </div>
                ${rootLabel}
                <div style="max-height:360px;overflow:auto;border:1px solid var(--color-border);border-radius:4px;">
                    <table style="width:100%;border-collapse:collapse;font-size:13px;">
                        <thead>
                            <tr style="background:var(--color-back);text-align:left;">
                                <th style="padding:6px;">${escapeHtml(Locale.t('col_effect'))}</th>
                                <th style="padding:6px;">${escapeHtml(Locale.t('col_missing_file'))}</th>
                                <th style="padding:6px;">${escapeHtml(Locale.t('col_keyframes'))}</th>
                                <th style="padding:6px;">${escapeHtml(Locale.t('col_candidate'))}</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>
                </div>
            `;
        };

        const dialog = new Dialog({
            id: 'particlecue_relink_dialog',
            title: Locale.t('dialog_relink_title'),
            width: 820,
            lines: ['<div id="pc_relink_container"></div>'],
            buttons: [Locale.t('dialog_relink_apply'), 'dialog.cancel'],
            onOpen() {
                const refreshDom = () => {
                    const container = document.getElementById('pc_relink_container');
                    if (!container) return;
                    container.innerHTML = renderBody();
                    const pickBtn = document.getElementById('pc_pick_relink_root');
                    if (pickBtn) {
                        pickBtn.onclick = () => {
                            const picked = Platform.pickDirectory({title: Locale.t('dialog_relink_pick_root')});
                            if (!picked) return;
                            try {
                                currentPlan = AssetResolver.planRelinkFromRoot(project, picked);
                                for (const k of Object.keys(choices)) delete choices[k];
                                refreshDom();
                            } catch (err) {
                                showError(err);
                            }
                        };
                    }
                    container.querySelectorAll('.pc-relink-select').forEach(sel => {
                        sel.onchange = () => {
                            const gKey = sel.getAttribute('data-group');
                            choices[gKey] = sel.value;
                        };
                    });
                };
                refreshDom();
            },
            onConfirm() {
                if (!currentPlan) return false;
                const result = AssetResolver.applyRelinkPlan(project, currentPlan, choices);
                if (result.unresolvedAmbiguous.length > 0) {
                    Blockbench.showQuickMessage(Locale.t('dialog_relink_need_choice'), 4000);
                    return false;
                }
                Blockbench.showQuickMessage(Locale.t('dialog_relink_applied', {count: result.relinkedBindings}), 3500);
                return true;
            }
        });
        dialog.show();
        return dialog;
    }

    function openExportZipDialog() {
        if (!ready()) return;
        const project = Project;
        const defaultName = `${Platform.sanitizeFilename(project.name || 'project')}_portable`;
        Blockbench.export({
            resource_id: 'particlecue_portable_zip',
            type: 'ParticleCue Portable ZIP',
            extensions: ['zip'],
            name: defaultName,
            savetype: 'zip',
            custom_writer: (_content, savePath) => {
                PortableZip.exportPortableZip(project, savePath)
                    .then(res => {
                        Blockbench.showQuickMessage(Locale.t('dialog_zip_export_ok', {path: res.zipPath}), 4000);
                    })
                    .catch(err => showError(err));
            }
        });
    }

    function openImportZipDialog() {
        Blockbench.import({
            resource_id: 'particlecue_portable_zip',
            type: 'ParticleCue Portable ZIP',
            extensions: ['zip'],
            readtype: 'buffer'
        }, files => {
            if (!files || !files[0]) return;
            const file = files[0];
            const zipBytes = file.content instanceof Uint8Array
                ? file.content
                : (file.content instanceof ArrayBuffer ? new Uint8Array(file.content) : null);
            PortableZip.importPortableZip(file.path || file.name, {zipBytes})
                .then(res => {
                    Blockbench.showQuickMessage(
                        Locale.t('dialog_zip_import_ok', {name: res.project?.name || res.bbmodelEntry}),
                        3500
                    );
                })
                .catch(err => showError(err));
        });
    }

    function openSaveSelfContainedDialog() {
        if (!ready()) return;
        const project = Project;
        const check = SelfContainedProject.inspectExternalDependencies(project);
        if (check.missing.length > 0) {
            const details = check.missing.map(m =>
                m.type === 'particle'
                    ? `- Particle: ${m.ref} (${m.animation} @ ${m.time}s)`
                    : `- Texture: ${m.ref} (for ${m.particle})`
            ).join('\n');
            Blockbench.showMessageBox({
                title: Locale.t('dialog_embedded_title'),
                message: Locale.t('dialog_embedded_missing_warn', {details}),
                icon: 'warning'
            });
            return;
        }

        const defaultName = `${Platform.sanitizeFilename(project.name || 'project')}_self_contained`;
        Blockbench.export({
            resource_id: 'particlecue_self_contained_bbmodel',
            type: 'Blockbench Self-Contained Model',
            extensions: ['bbmodel'],
            name: defaultName,
            custom_writer: (_content, savePath) => {
                try {
                    const res = SelfContainedProject.saveSelfContainedBbmodel(project, savePath, {
                        switchActiveProjectToEmbedded: false
                    });
                    Blockbench.showQuickMessage(Locale.t('dialog_embedded_ok', {path: res.outputPath}), 4000);
                } catch (err) {
                    showError(err);
                }
            }
        });
    }

    function openAssetInspectorDialog() {
        if (!ready()) return;
        const project = Project;
        AssetResolver.scanProject(project, {notify: false});
        const state = KeyframeStore.getState(project, true);
        const assets = Array.from(state.assets.values());

        if (!assets.length) {
            Blockbench.showMessageBox({
                title: Locale.t('dialog_inspect_title'),
                message: Locale.t('panel_no_particles'),
                icon: 'info'
            });
            return;
        }

        let selectedId = assets[0].id;

        const renderInspector = () => {
            const current = state.assets.get(selectedId) || assets[0];
            const optionsHtml = assets.map(a =>
                `<option value="${escapeHtml(a.id)}" ${a.id === current.id ? 'selected' : ''}>[${escapeHtml(a.format)}] ${escapeHtml(a.fileName)} (${escapeHtml(a.identifier || a.id)}) [${escapeHtml(a.status)}]</option>`
            ).join('');
            const texInfo = current.isBuiltinTexture
                ? `Built-in (${current.textureRef || 'none'})`
                : (current.textureDataUrl ? `Embedded (${current.textureRef || 'custom'})` : (current.texturePath ? `Linked: ${current.texturePath}` : `Missing: ${current.textureRef || 'none'}`));

            let editorContent = '';
            if (current.format === 'photon_fx') {
                const meta = PhotonFxAdapter.inspect(current.rawText, current.fileName);
                const summary = meta ? JSON.stringify(meta.objects, null, 2) : 'Unable to decode Photon .fx';
                editorContent = `
                    <div style="font-size:12px;margin-bottom:6px;color:#79c0ff;">Photon .fx Binary NBT (${meta?.objectCount || 0} object(s)) — Summary (edit primary emitter via quick controls or API):</div>
                    <textarea id="pc_inspect_json" readonly style="width:100%;height:300px;font-family:monospace;font-size:12px;box-sizing:border-box;">${escapeHtml(summary)}</textarea>
                `;
            } else {
                const extraHint = current.originKind ? ` · Origin: <code>${escapeHtml(current.originKind)}</code>` : '';
                editorContent = `
                    <div style="font-size:12px;margin-bottom:6px;opacity:0.85;">Format: <code>${escapeHtml(current.format)}</code>${extraHint}</div>
                    <textarea id="pc_inspect_json" style="width:100%;height:320px;font-family:monospace;font-size:12px;box-sizing:border-box;">${escapeHtml(current.rawText || '')}</textarea>
                `;
            }

            return `
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
                    <select id="pc_inspect_select" style="flex:1;">${optionsHtml}</select>
                    <button type="button" id="pc_inspect_export_btn">${escapeHtml(Locale.t('dialog_inspect_export_particle'))}</button>
                </div>
                <div style="font-size:12px;opacity:0.85;margin-bottom:8px;">
                    ID: <code>${escapeHtml(current.id)}</code> · SHA-256: <code>${escapeHtml((current.hash || '').slice(0, 16))}</code><br>
                    Texture: <code>${escapeHtml(texInfo)}</code>
                </div>
                ${editorContent}
            `;
        };

        const dialog = new Dialog({
            id: 'particlecue_inspector_dialog',
            title: Locale.t('dialog_inspect_title'),
            width: 780,
            lines: ['<div id="pc_inspect_container"></div>'],
            buttons: [Locale.t('dialog_inspect_save'), 'dialog.cancel'],
            onOpen() {
                const mount = () => {
                    const el = document.getElementById('pc_inspect_container');
                    if (!el) return;
                    el.innerHTML = renderInspector();
                    const sel = document.getElementById('pc_inspect_select');
                    if (sel) {
                        sel.onchange = () => {
                            selectedId = sel.value;
                            mount();
                        };
                    }
                    const expBtn = document.getElementById('pc_inspect_export_btn');
                    if (expBtn) {
                        expBtn.onclick = () => {
                            const cur = state.assets.get(selectedId);
                            if (!cur) return;
                            const isFx = cur.format === 'photon_fx';
                            Blockbench.export({
                                type: isFx ? 'Photon FX' : 'Particle JSON',
                                extensions: [isFx ? 'fx' : 'json'],
                                name: cur.fileName.replace(/\.(json|fx)$/i, ''),
                                custom_writer: (_c, outPath) => {
                                    try {
                                        SelfContainedProject.exportSingleEmbeddedAsset(project, cur.id, outPath);
                                        Blockbench.showQuickMessage(`Exported ${outPath}`, 3000);
                                    } catch (err) {
                                        showError(err);
                                    }
                                }
                            });
                        };
                    }
                };
                mount();
            },
            onConfirm() {
                const cur = state.assets.get(selectedId);
                if (!cur || cur.format === 'photon_fx') return true;
                const ta = document.getElementById('pc_inspect_json');
                if (!ta) return true;
                try {
                    KeyframeStore.updateAssetContent(project, selectedId, ta.value);
                    if (typeof ParticleCuePanel !== 'undefined') ParticleCuePanel.refresh();
                    return true;
                } catch (err) {
                    showError(err);
                    return false;
                }
            }
        });
        dialog.show();
        return dialog;
    }

    function openGlslSourceDialog(matKey, initialSrc, onSave) {
        const dialog = new Dialog({
            id: 'particlecue_glsl_source_dialog',
            title: `GLSL Fragment Shader — ${matKey}`,
            width: 720,
            lines: [
                `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <span class="pc-label">LumenFX / WebGL2 Fragment Shader (vUv, vColor, vWorldPos, uTex, uTime, uParams -> fragColor)</span>
                    <span id="pc_glsl_status" class="pc-chip">Checking...</span>
                </div>`,
                `<textarea id="pc_glsl_ta" class="pc-kg-code" style="height:360px;resize:vertical;">${escapeHtml(initialSrc || '')}</textarea>`,
                `<div id="pc_glsl_err" style="margin-top:6px;font-size:11px;color:#fca5a5;white-space:pre-wrap;"></div>`
            ],
            buttons: [Locale.t('dialog_inspect_save'), 'dialog.cancel'],
            onOpen() {
                const ta = document.getElementById('pc_glsl_ta');
                const badge = document.getElementById('pc_glsl_status');
                const errEl = document.getElementById('pc_glsl_err');
                const check = () => {
                    if (!ta || !badge) return;
                    const src = ta.value.trim();
                    if (!src) {
                        badge.className = 'pc-chip';
                        badge.textContent = 'Default';
                        if (errEl) errEl.textContent = '';
                        return;
                    }
                    const res = KilaMaterialCompiler.validateGlslInWebGL2(src);
                    badge.className = res.ok ? 'pc-chip ok' : 'pc-chip warn';
                    badge.textContent = res.ok ? 'GLSL OK' : 'GLSL ERR';
                    if (errEl) errEl.textContent = res.ok ? '' : (res.error || 'Compile error');
                };
                if (ta) ta.oninput = check;
                check();
            },
            onConfirm() {
                const ta = document.getElementById('pc_glsl_ta');
                if (ta && typeof onSave === 'function') {
                    onSave(ta.value);
                }
                return true;
            }
        });
        dialog.show();
        return dialog;
    }

    function openKeyframeBindingDialog(bindingKey) {
        if (!ready()) return;
        const project = Project;
        const list = KeyframeStore.collectParticleDataPoints(project);
        const entry = list.find(x => x.bindingKey === bindingKey);
        if (!entry) return;
        const locEntries = typeof AnimCueBridge !== 'undefined' ? AnimCueBridge.listParticipantLocators() : [];
        const locOptions = {none: '(None / Entity Origin)'};
        for (const loc of locEntries) {
            locOptions[loc.uuid] = `${loc.qualifiedName} (${loc.role})`;
        }
        const curMeta = KeyframeStore.getBindingMeta(project, entry.animationUuid, entry.keyframeUuid, entry.dataPointIndex);
        const initialLocUuid = curMeta?.locatorUuid
            || locEntries.find(l => l.name === entry.dataPoint.locator)?.uuid
            || 'none';

        new Dialog({
            id: 'particlecue_edit_kf_dialog',
            title: 'Edit Particle Keyframe Trigger',
            form: {
                effect: {label: 'Effect Name', type: 'text', value: String(entry.dataPoint.effect || '')},
                time: {label: 'Trigger Time (s)', type: 'number', min: 0, step: 0.05, value: Number(entry.time) || 0},
                locator_uuid: {label: 'Locator / Participant', type: 'select', value: initialLocUuid, options: locOptions},
                script: {label: 'Pre-Effect Script', type: 'text', value: String(entry.dataPoint.script || '')}
            },
            onConfirm(form) {
                const picked = locEntries.find(l => l.uuid === form.locator_uuid) || null;
                entry.dataPoint.effect = String(form.effect || '').trim();
                entry.dataPoint.locator = picked ? picked.name : '';
                entry.dataPoint.script = String(form.script || '').trim();
                if (Number.isFinite(Number(form.time)) && Number(form.time) >= 0) {
                    entry.keyframe.time = Number(form.time);
                }
                KeyframeStore.setBindingMeta(project, entry.animationUuid, entry.keyframeUuid, entry.dataPointIndex, picked ? {
                    participantRole: picked.role,
                    locatorUuid: picked.uuid
                } : null);
                if (typeof Animator !== 'undefined' && Animator.open) Animator.preview();
                if (typeof ParticleCuePanel !== 'undefined') ParticleCuePanel.refresh();
                return true;
            }
        }).show();
    }

    return {
        guard,
        showError,
        ready,
        openNewEffectDialog,
        openImportParticleFileDialog,
        openExportPalEmoteDialog,
        openRelinkDialog,
        openExportZipDialog,
        openImportZipDialog,
        openSaveSelfContainedDialog,
        openAssetInspectorDialog,
        openGlslSourceDialog,
        openKeyframeBindingDialog
    };
})();


/* === src/ui/panel.js === */
const ParticleCuePanel = (() => {
    let panel = null;
    let vm = null;
    const cleanups = [];

    // Persistent UI selection state across refreshes
    const uiState = {
        activeTab: 'effects', // 'effects' | 'emitters' | 'materials'
        selectedAssetId: '',
        selectedEmitterIdx: 0,
        selectedMaterialKey: '',
        openModules: {
            main: true,
            emission: true,
            shape: false,
            motion: false,
            curves: true,
            renderer: false,
            collision: false,
            matState: true,
            kilaComposer: true,
            attachments: false
        }
    };

    function formatBadge(fmt) {
        switch (fmt) {
            case 'lumenfx_json': return 'LumenFX';
            case 'photon_fx': return 'Photon';
            case 'kbr_3d_particle': return 'KBR 3D';
            case 'bedrock_snowstorm': return 'Snowstorm';
            default: return fmt || 'Particle';
        }
    }

    function formatIcon(fmt) {
        switch (fmt) {
            case 'lumenfx_json': return 'flare';
            case 'photon_fx': return 'blur_on';
            case 'kbr_3d_particle': return 'view_in_ar';
            case 'bedrock_snowstorm': return 'grain';
            default: return 'auto_awesome';
        }
    }

    function quatToEulerDeg(q) {
        if (!Array.isArray(q) || q.length < 4 || typeof THREE === 'undefined') return [0, 0, 0];
        const quat = new THREE.Quaternion(Number(q[0]) || 0, Number(q[1]) || 0, Number(q[2]) || 0, Number.isFinite(Number(q[3])) ? Number(q[3]) : 1).normalize();
        const e = new THREE.Euler().setFromQuaternion(quat, 'XYZ');
        const r2d = 180 / Math.PI;
        return [Number((e.x * r2d).toFixed(1)), Number((e.y * r2d).toFixed(1)), Number((e.z * r2d).toFixed(1))];
    }

    function eulerDegToQuat(deg) {
        if (typeof THREE === 'undefined') return [0, 0, 0, 1];
        const d2r = Math.PI / 180;
        const e = new THREE.Euler((Number(deg[0]) || 0) * d2r, (Number(deg[1]) || 0) * d2r, (Number(deg[2]) || 0) * d2r, 'XYZ');
        const q = new THREE.Quaternion().setFromEuler(e);
        return [Number(q.x.toFixed(5)), Number(q.y.toFixed(5)), Number(q.z.toFixed(5)), Number(q.w.toFixed(5))];
    }

    function scalarDisplay(val, fallback = 0) {
        if (typeof val === 'number' && Number.isFinite(val)) return val;
        if (val && typeof val === 'object') {
            if (typeof val.value === 'number') return val.value;
            if (typeof val.min === 'number' && typeof val.max === 'number') return Number(((val.min + val.max) * 0.5).toFixed(3));
            if (Array.isArray(val.keys) && val.keys.length) return Number(val.keys[0].v ?? val.keys[0][1] ?? fallback);
        }
        return fallback;
    }

    function buildSelectedEditorModel(project, state) {
        if (!state || !state.assets.size) return null;
        let rec = state.assets.get(uiState.selectedAssetId);
        if (!rec) {
            rec = Array.from(state.assets.values())[0];
            uiState.selectedAssetId = rec ? rec.id : '';
        }
        if (!rec) return null;

        const base = {
            id: rec.id,
            format: rec.format,
            formatLabel: formatBadge(rec.format),
            originKind: rec.originKind || '',
            identifier: rec.identifier || rec.fileName,
            fileName: rec.fileName,
            status: rec.status
        };

        if (rec.format === 'lumenfx_json') {
            const json = LumenFxSchema.safeParseJson(rec.rawText) || {format_version: 1, materials: {}, emitters: []};
            const emitters = Array.isArray(json.emitters) ? json.emitters : [];
            const materials = (json.materials && typeof json.materials === 'object') ? json.materials : {};
            const matKeys = Object.keys(materials);
            if (uiState.selectedEmitterIdx >= emitters.length) uiState.selectedEmitterIdx = Math.max(0, emitters.length - 1);
            if (!uiState.selectedMaterialKey || !materials[uiState.selectedMaterialKey]) {
                uiState.selectedMaterialKey = matKeys[0] || '';
            }
            const em = emitters[uiState.selectedEmitterIdx] || null;
            const mat = uiState.selectedMaterialKey ? materials[uiState.selectedMaterialKey] : null;
            const startCol = em
                ? LumenFxSchema.evalColorCurve(em.start_color !== undefined ? em.start_color : (Array.isArray(em.color) && typeof em.color[0] === 'number' ? em.color : [1, 1, 1, 1]), 0, 1)
                : [1, 1, 1, 1];
            const colorOverLifeSpec = em ? (em.color_over_life !== undefined ? em.color_over_life : em.color) : [[0, 1, 1, 1, 1], [1, 1, 1, 1, 0]];
            const kilaCfg = mat ? Object.assign(KilaMaterialCompiler.createDefaultKilaConfig(), mat._kila_config || {}) : KilaMaterialCompiler.createDefaultKilaConfig();

            return {
                ...base,
                emitterList: emitters.map((e, i) => ({
                    index: i,
                    name: e?.name || `emitter_${i}`,
                    renderer: String(e?.renderer || 'sprite').toLowerCase()
                })),
                selectedEmitterIdx: uiState.selectedEmitterIdx,
                emitter: em ? {
                    name: em.name || `emitter_${uiState.selectedEmitterIdx}`,
                    renderer: String(em.renderer || 'sprite').toLowerCase(),
                    material: em.material || matKeys[0] || '',
                    duration: numOr(em.duration, 2.0),
                    delay: numOr(em.delay, 0),
                    loop: em.loop !== false,
                    local_space: em.local_space !== false,
                    stretched_billboard: Boolean(em.stretched_billboard),
                    scale_size_with_owner: em.scale_size_with_owner !== false,
                    max_particles: numOr(em.max_particles, 64),
                    sort_order: numOr(em.sort_order, 0),
                    rate: scalarDisplay(em.rate, 0),
                    lifetime: scalarDisplay(em.lifetime, 1.0),
                    start_speed: scalarDisplay(em.start_speed, 0),
                    width: scalarDisplay(em.width, 0.25),
                    height: scalarDisplay(em.height, scalarDisplay(em.width, 0.25)),
                    rotation: scalarDisplay(em.rotation, 0),
                    angular_velocity: scalarDisplay(em.angular_velocity, 0),
                    startColorHex: KilaMaterialCompiler.rgb01ToHex(startCol),
                    startColorAlpha: Number((startCol[3] ?? 1).toFixed(2)),
                    bursts: Array.isArray(em.bursts) ? em.bursts.map(b => ({
                        time: numOr(b.time, 0),
                        min: numOr(b.min ?? b.count, 1),
                        max: numOr(b.max ?? b.count, 1),
                        cycles: numOr(b.cycles, 1),
                        interval: numOr(b.interval, 1)
                    })) : [],
                    shapeType: String(em.shape?.type || 'point').toLowerCase(),
                    shapeRadius: numOr(em.shape?.radius, 0.5),
                    shapeAngle: numOr(em.shape?.angle, 25),
                    shapeSurface: Boolean(em.shape?.surface),
                    shapeSize: Array.isArray(em.shape?.size) ? [numOr(em.shape.size[0], 0.5), numOr(em.shape.size[1], 0.5), numOr(em.shape.size[2], 0.5)] : [0.5, 0.5, 0.5],
                    unityPos: Array.isArray(em.shape?.unity?.position) ? [numOr(em.shape.unity.position[0], 0), numOr(em.shape.unity.position[1], 0), numOr(em.shape.unity.position[2], 0)] : [0, 0, 0],
                    unityRotDeg: quatToEulerDeg(em.shape?.unity?.rotation),
                    velMin: Array.isArray(em.velocity_min) ? [numOr(em.velocity_min[0], 0), numOr(em.velocity_min[1], 0), numOr(em.velocity_min[2], 0)] : [0, 0, 0],
                    velMax: Array.isArray(em.velocity_max) ? [numOr(em.velocity_max[0], 0), numOr(em.velocity_max[1], 0), numOr(em.velocity_max[2], 0)] : [0, 0, 0],
                    accel: Array.isArray(em.acceleration) ? [numOr(em.acceleration[0], 0), numOr(em.acceleration[1], 0), numOr(em.acceleration[2], 0)] : [0, 0, 0],
                    drag: scalarDisplay(em.drag, 0),
                    noiseStr: Array.isArray(em.noise_strength) ? [numOr(em.noise_strength[0], 0), numOr(em.noise_strength[1], 0), numOr(em.noise_strength[2], 0)] : [0, 0, 0],
                    noiseFreq: numOr(em.noise_frequency, 1.0),
                    sizeCurvePath: ParticleCueCurveEditor.buildMiniSvgPath(em.size_over_life, 100, 22, 1),
                    colorGradientCss: ParticleCueGradientEditor.buildCssGradient(colorOverLifeSpec),
                    atlasCols: numOr(em.atlas_columns, 1),
                    atlasRows: numOr(em.atlas_rows, 1),
                    meshAsset: em.mesh?.entries?.[0]?.asset || '',
                    beamLength: numOr(em.beam_length, 3.0),
                    beamSegments: numOr(em.beam_segments, 10),
                    beamNoise: numOr(em.beam_noise, 0.08),
                    movementThreshold: numOr(em.movement_threshold, 8.0),
                    collisionEnabled: Boolean(em.collision?.enabled),
                    collisionBounce: numOr(em.collision?.bounce, 0.5),
                    collisionDampen: numOr(em.collision?.dampen, 0.1),
                    collisionLifeLoss: numOr(em.collision?.lifetime_loss, 0)
                } : null,
                materialKeys: matKeys,
                selectedMaterialKey: uiState.selectedMaterialKey,
                material: mat ? {
                    key: uiState.selectedMaterialKey,
                    blend: String(mat.blend || 'alpha').toLowerCase(),
                    fragment_shader: String(mat.fragment_shader || 'lumenfx:core/effect'),
                    hasInlineGlsl: Boolean(mat.custom_glsl_fragment && String(mat.custom_glsl_fragment).trim()),
                    hasKilaGraph: Boolean(mat._kilagraph && Array.isArray(mat._kilagraph.nodes)),
                    depth_test: mat.depth_test !== false,
                    depth_write: Boolean(mat.depth_write),
                    cull: Boolean(mat.cull),
                    hdr: Boolean(mat.hdr),
                    emissive_scale: numOr(mat.emissive_scale, 1.0),
                    bloom_intensity: numOr(mat.bloom_intensity, 0.35),
                    soft_particles: Boolean(mat.soft_particles),
                    soft_fade_distance: numOr(mat.soft_fade_distance, 0.5),
                    sampler0: mat.textures?.Sampler0 || (mat.textures ? Object.values(mat.textures)[0] : '') || '',
                    kila: kilaCfg
                } : null,
                lights: Array.isArray(json.lights) ? json.lights.map((l, idx) => ({
                    idx,
                    pos: Array.isArray(l.position) ? l.position : [0, 1, 0],
                    colorHex: KilaMaterialCompiler.rgb01ToHex(l.color || [1, 0.9, 0.6]),
                    radius: numOr(l.radius, 6.0),
                    intensity: numOr(l.intensity, 0.8)
                })) : [],
                volumes: Array.isArray(json.volumes) ? json.volumes.map((v, idx) => ({
                    idx,
                    pos: Array.isArray(v.position) ? v.position : [0, 1, 0],
                    size: Array.isArray(v.size) ? v.size : [2, 2, 2],
                    colorHex: KilaMaterialCompiler.rgb01ToHex(v.color || [0.4, 0.8, 1]),
                    density: numOr(v.density, 0.14)
                })) : [],
                decals: Array.isArray(json.decals) ? json.decals.map((d, idx) => ({
                    idx,
                    pos: Array.isArray(d.position) ? d.position : [0, 0.02, 0],
                    size: Array.isArray(d.size) ? d.size : [2, 0.1, 2],
                    texture: d.texture || ''
                })) : []
            };
        }

        if (rec.format === 'bedrock_snowstorm') {
            const params = SnowstormEditor.extractEditableParams(rec.rawText) || {};
            return {
                ...base,
                snowstorm: params,
                snowstormMaterials: SnowstormEditor.MATERIALS,
                snowstormFacingModes: SnowstormEditor.FACING_MODES
            };
        }

        if (rec.format === 'photon_fx') {
            const meta = PhotonFxAdapter.inspect(rec.rawText, rec.fileName);
            const objects = meta?.objects || [];
            if (uiState.selectedEmitterIdx >= objects.length) uiState.selectedEmitterIdx = Math.max(0, objects.length - 1);
            const cur = objects[uiState.selectedEmitterIdx] || null;
            return {
                ...base,
                photonObjects: objects.map((o, i) => ({index: i, name: o.name || `obj_${i}`, type: o.type || 'particle'})),
                selectedEmitterIdx: uiState.selectedEmitterIdx,
                photonObj: cur ? {
                    name: cur.name || 'emitter',
                    type: cur.type || 'particle',
                    durationSec: numOr(cur.durationSec, 3.0),
                    lifeSec: numOr(cur.lifeSec, 1.5),
                    emissionRatePerSec: numOr(cur.emissionRatePerSec, 20),
                    startSpeed: numOr(cur.startSpeed, 1.5),
                    startSize: numOr(cur.startSize, 0.25),
                    looping: cur.looping !== false,
                    localSpace: Boolean(cur.localSpace),
                    blend: cur.blend || 'alpha',
                    texture: cur.texture || '',
                    colorHex: KilaMaterialCompiler.rgb01ToHex(cur.color || [1, 1, 1, 1]),
                    subEmitters: Array.isArray(cur.subEmitters) ? cur.subEmitters : []
                } : null
            };
        }

        if (rec.format === 'kbr_3d_particle') {
            const json = LumenFxSchema.safeParseJson(rec.rawText) || {};
            const comps = json.particle_effect?.components || {};
            const steady = comps['minecraft:emitter_rate_steady'] || {};
            const life = comps['minecraft:particle_lifetime_expression'] || {};
            const dyn = comps['minecraft:particle_motion_dynamic'] || {};
            const firstModelKey = Object.keys(rec.embeddedModels || {})[0] || '';
            const firstModel = firstModelKey ? rec.embeddedModels[firstModelKey] : null;
            const desc = firstModel?.descriptor || null;
            const kbrDiag = typeof Kbr3dPreview !== 'undefined' ? Kbr3dPreview.getDiagnostics(project) : null;
            const kbrAssetDiag = kbrDiag?.assets?.find(a => a.assetKey === rec.id) || null;
            const firstDiagVariant = kbrAssetDiag?.variants?.[0] || null;
            return {
                ...base,
                kbr: {
                    identifier: json.particle_effect?.description?.identifier || rec.identifier,
                    spawnRate: numOr(steady.spawn_rate, 12),
                    maxParticles: numOr(steady.max_particles, 48),
                    maxLifetime: numOr(life.max_lifetime, 1.5),
                    initialSpeed: numOr(comps['minecraft:particle_initial_speed'], 1.5),
                    gravity: Array.isArray(dyn.linear_acceleration) ? numOr(dyn.linear_acceleration[1], -4) : -4,
                    drag: numOr(dyn.linear_drag_coefficient, 0.2),
                    modelKey: firstModelKey,
                    variant: desc?.variant || 'geckolib',
                    material: desc?.material || 'cutout',
                    doubleSided: Boolean(desc?.double_sided),
                    texture: desc?.texture || rec.textureRef || '',
                    mismatchReason: firstDiagVariant?.mismatchReason || ''
                }
            };
        }

        return base;
    }

    function numOr(v, fb) {
        const n = Number(v);
        return Number.isFinite(n) ? n : fb;
    }

    function buildViewModel() {
        const project = typeof Project !== 'undefined' ? Project : null;
        const animCueStatus = typeof AnimCueBridge !== 'undefined' ? AnimCueBridge.getStatus() : {available: false, participantCount: 0};
        const palStatus = typeof PalBridge !== 'undefined' ? PalBridge.getStatus() : {available: false, isPalRig: false, detectedRigPreset: 'none'};
        const lfxDiag = (project && typeof LumenFxPreview !== 'undefined') ? LumenFxPreview.getDiagnostics(project) : {liveParticles: 0, compiledShaderCount: 0};

        if (!project) {
            return {
                hasProject: false,
                activeTab: uiState.activeTab,
                openModules: Object.assign({}, uiState.openModules),
                mode: 'linked',
                enhancedPreview: SnowstormPreview.isEnhancedEnabled(),
                animCueStatus,
                palStatus,
                liveParticles: 0,
                compiledShaders: 0,
                totalBindings: 0,
                missingCount: 0,
                embeddedCount: 0,
                resolvedCount: 0,
                selectedAssetId: '',
                items: [],
                editor: null
            };
        }

        const state = KeyframeStore.getState(project, false);
        const report = AssetResolver.scanProject(project, {notify: false});
        const items = report.items.map(item => {
            const bm = state?.bindingMeta?.get(item.bindingKey);
            const roleLabel = bm?.participantRole && bm.participantRole !== 'primary' ? `${bm.participantRole}::` : '';
            return {
                bindingKey: item.bindingKey,
                assetId: item.assetId || '',
                animationName: item.animationName,
                timeNum: Number(item.time) || 0,
                time: item.time.toFixed(2),
                effect: item.effect || item.identifier || '-',
                locator: `${roleLabel}${item.locator || '-'}`,
                format: item.format,
                formatLabel: formatBadge(item.format),
                formatIcon: formatIcon(item.format),
                status: item.status,
                fileName: Platform.basename(item.file || '') || item.file || '-',
                textureOk: item.status !== 'missing' ? Boolean(item.textureResolved) : false
            };
        });

        const editor = buildSelectedEditorModel(project, state);

        return {
            hasProject: true,
            activeTab: uiState.activeTab,
            openModules: Object.assign({}, uiState.openModules),
            mode: state?.mode || 'linked',
            enhancedPreview: SnowstormPreview.isEnhancedEnabled(),
            animCueStatus,
            palStatus,
            liveParticles: lfxDiag.liveParticles || 0,
            compiledShaders: lfxDiag.compiledShaderCount || 0,
            totalBindings: report.totalBindings,
            missingCount: report.missingCount,
            embeddedCount: report.embeddedCount,
            resolvedCount: report.resolvedCount,
            selectedAssetId: uiState.selectedAssetId,
            items,
            editor
        };
    }

    function refresh() {
        if (!vm) return;
        vm.state = buildViewModel();
    }

    function mutateLumenFxJson(mutator) {
        if (typeof Project === 'undefined' || !Project || !uiState.selectedAssetId) return;
        const rec = KeyframeStore.getAssetById(Project, uiState.selectedAssetId);
        if (!rec || rec.format !== 'lumenfx_json') return;
        const json = LumenFxSchema.safeParseJson(rec.rawText) || {format_version: 1, materials: {}, emitters: []};
        mutator(json, rec);
        KeyframeStore.updateAssetContent(Project, rec.id, JSON.stringify(json, null, 2));
        if (typeof Animator !== 'undefined' && Animator.open) Animator.preview();
        refresh();
    }

    function openNewMenu(event) {
        const anchor = event?.currentTarget instanceof HTMLElement ? event.currentTarget : event;
        new Menu([
            {name: 'LumenFX — Sprite Burst', icon: 'flare', click: () => quickCreate('lumenfx_sprite')},
            {name: 'LumenFX — Ribbon Stream', icon: 'gesture', click: () => quickCreate('lumenfx_ribbon')},
            {name: 'LumenFX — Energy Beam', icon: 'bolt', click: () => quickCreate('lumenfx_beam')},
            {name: 'LumenFX — 3D Mesh Crystal', icon: 'diamond', click: () => quickCreate('lumenfx_mesh')},
            '_',
            {name: 'Snowstorm / Bedrock Particle', icon: 'grain', click: () => quickCreate('snowstorm')},
            {name: 'Photon .fx (GZIP NBT)', icon: 'blur_on', click: () => quickCreate('photon_fx')},
            {name: 'KBR 3D Particle (GeckoLib)', icon: 'view_in_ar', click: () => quickCreate('kbr_geckolib')},
            '_',
            {name: Locale.t('dialog_new_title') + '...', icon: 'tune', click: () => ParticleCueDialogs.openNewEffectDialog()}
        ]).open(anchor);
    }

    function quickCreate(preset) {
        if (!ParticleCueDialogs.ready()) return;
        if (!Animation.selected && !Animation.all.length) {
            Modes.options.animate.select();
            const anim = new Animation({name: 'particle_preview', length: 6.0, loop: 'loop'}).add(true);
            anim.select();
        } else if (!Animation.selected) {
            Animation.all[0].select();
        }
        const stamp = Math.floor(Date.now() % 10000);
        const effId = `particlecue:${preset}_${stamp}`;
        let rawText = '';
        let fileName = `${preset}_${stamp}.json`;
        let embeddedModels = {};
        if (preset === 'snowstorm') {
            rawText = SnowstormEditor.createPreset({identifier: effId});
            fileName = `${preset}_${stamp}.particle.json`;
        } else if (preset.startsWith('lumenfx_')) {
            const map = {lumenfx_sprite: 'sprite_burst', lumenfx_ribbon: 'ribbon_stream', lumenfx_beam: 'beam_arc', lumenfx_mesh: 'mesh_crystal'};
            rawText = JSON.stringify(LumenFxSchema.createPreset(map[preset], effId), null, 2);
        } else if (preset === 'photon_fx') {
            const nbt = PhotonFxAdapter.createPresetNbt({name: `photon_${stamp}`});
            rawText = PhotonFxAdapter.encodeBinaryString(PhotonFxAdapter.writeNbt(nbt, true));
            fileName = `photon_${stamp}.fx`;
        } else if (preset.startsWith('kbr_')) {
            const bundle = KbrModelSchema.createPreset({namespace: 'particlecue', id: `kbr_${stamp}`, variant: 'geckolib'});
            rawText = JSON.stringify(bundle.particleDefinition, null, 2);
            embeddedModels = {[bundle.modelDescriptorId]: {descriptor: bundle.modelDescriptor, geometryJson: bundle.geometryJson}};
        }
        const created = KeyframeStore.createAndBindEffect(Project, {rawText, fileName, effectName: effId, embeddedModels});
        uiState.selectedAssetId = created.record.id;
        uiState.activeTab = 'emitters';
        refresh();
        Blockbench.showQuickMessage(`Created ${effId}`, 2500);
    }

    function openImportMenu(event) {
        const anchor = event?.currentTarget instanceof HTMLElement ? event.currentTarget : event;
        new Menu([
            {name: Locale.t('menu_import_effect'), icon: 'file_open', click: () => ParticleCueDialogs.openImportParticleFileDialog()},
            {name: Locale.t('menu_import_zip'), icon: 'unarchive', click: () => ParticleCueDialogs.openImportZipDialog()}
        ]).open(anchor);
    }

    function openShareMenu(event) {
        const anchor = event?.currentTarget instanceof HTMLElement ? event.currentTarget : event;
        new Menu([
            {name: Locale.t('menu_export_zip'), icon: 'archive', click: () => ParticleCueDialogs.openExportZipDialog()},
            {name: Locale.t('menu_save_embedded'), icon: 'inventory_2', click: () => ParticleCueDialogs.openSaveSelfContainedDialog()},
            '_',
            {name: Locale.t('menu_inspect_assets'), icon: 'code', click: () => ParticleCueDialogs.openAssetInspectorDialog()},
            {name: Locale.t('menu_export_pal_emote'), icon: 'directions_run', click: () => ParticleCueDialogs.openExportPalEmoteDialog()},
            '_',
            {name: Locale.t('menu_rescan'), icon: 'refresh', click: () => {
                if (typeof Project !== 'undefined' && Project) {
                    AssetResolver.scanProject(Project, {notify: true});
                    if (typeof Animator !== 'undefined' && Animator.open) Animator.preview();
                    refresh();
                }
            }}
        ]).open(anchor);
    }

    function openAddEmitterMenu(event) {
        const anchor = event?.currentTarget instanceof HTMLElement ? event.currentTarget : event;
        const addType = (renderer) => {
            mutateLumenFxJson((json) => {
                if (!Array.isArray(json.emitters)) json.emitters = [];
                if (!json.materials || !Object.keys(json.materials).length) {
                    json.materials = {default_mat: {fragment_shader: 'lumenfx:core/effect', blend: 'additive', hdr: true, emissive_scale: 1.4}};
                }
                const matKey = Object.keys(json.materials)[0];
                const idx = json.emitters.length;
                json.emitters.push({
                    name: `${renderer}_${idx}`,
                    renderer,
                    material: matKey,
                    local_space: true,
                    duration: 3.0,
                    loop: true,
                    max_particles: renderer === 'beam' ? 1 : 64,
                    rate: renderer === 'beam' ? 0 : 20,
                    lifetime: 1.2,
                    width: renderer === 'beam' ? 0.35 : 0.28,
                    height: renderer === 'beam' ? 3.0 : 0.28,
                    start_speed: renderer === 'beam' ? 0 : 1.8,
                    shape: {type: 'sphere', radius: 0.25},
                    size_over_life: {keys: [{t: 0, v: 0.6}, {t: 0.3, v: 1.0}, {t: 1, v: 0.0}]},
                    color_over_life: [[0, 1, 0.95, 0.7, 1], [0.5, 0.25, 0.9, 1, 0.9], [1, 0.2, 0.3, 0.9, 0]]
                });
                uiState.selectedEmitterIdx = json.emitters.length - 1;
            });
        };
        new Menu([
            {name: 'Sprite Emitter', icon: 'grain', click: () => addType('sprite')},
            {name: 'Ribbon / Trail Emitter', icon: 'gesture', click: () => addType('ribbon')},
            {name: 'Energy Beam Emitter', icon: 'bolt', click: () => addType('beam')},
            {name: '3D Mesh Emitter', icon: 'view_in_ar', click: () => addType('mesh')}
        ]).open(anchor);
    }

    function openShaderGraphForActiveMaterial() {
        if (typeof Project === 'undefined' || !Project) return;
        const state = KeyframeStore.getState(Project, false);
        const rec = state?.assets.get(uiState.selectedAssetId) || Array.from(state?.assets.values() || []).find(a => a.format === 'lumenfx_json');
        if (!rec || rec.format !== 'lumenfx_json') {
            Blockbench.showQuickMessage('Select or create a LumenFX effect first to open KilaGraph Shader Editor.', 3000);
            return;
        }
        uiState.selectedAssetId = rec.id;
        const json = LumenFxSchema.safeParseJson(rec.rawText) || {format_version: 1, materials: {}, emitters: []};
        if (!json.materials || !Object.keys(json.materials).length) {
            json.materials = {custom_shader: {blend: 'additive', hdr: true, emissive_scale: 1.3}};
        }
        const matKey = (uiState.selectedMaterialKey && json.materials[uiState.selectedMaterialKey])
            ? uiState.selectedMaterialKey
            : Object.keys(json.materials)[0];
        uiState.selectedMaterialKey = matKey;
        const mat = json.materials[matKey];

        ParticleCueShaderGraphEditor.open({
            title: `KilaGraph — ${rec.identifier} / ${matKey}`,
            materialName: matKey,
            graph: mat._kilagraph || null,
            onApply({graph, glsl}) {
                mutateLumenFxJson((doc) => {
                    if (!doc.materials) doc.materials = {};
                    if (!doc.materials[matKey]) doc.materials[matKey] = {blend: 'additive', hdr: true};
                    doc.materials[matKey]._kilagraph = graph;
                    doc.materials[matKey].custom_glsl_fragment = glsl;
                    doc.materials[matKey].fragment_shader = `particlecue:kilagraph/${matKey}`;
                });
            }
        });
    }

    function register() {
        ParticleCueStyles.install();
        if (typeof Panels !== 'undefined' && Panels.particlecue_studio && typeof Panels.particlecue_studio.delete === 'function') {
            try { Panels.particlecue_studio.delete(); } catch (_err) {}
        }
        panel = new Panel('particlecue_studio', {
            id: 'particlecue_studio',
            name: Locale.t('panel_title'),
            icon: 'auto_awesome',
            growable: true,
            resizable: true,
            default_position: {
                slot: 'right_bar',
                float_position: [0, 0],
                float_size: [306, 490],
                height: 430
            },
            insert_after: 'pal_bend_player_panel',
            component: {
                data() {
                    return {
                        state: buildViewModel()
                    };
                },
                mounted() {
                    vm = this;
                },
                beforeDestroy() {
                    if (vm === this) vm = null;
                },
                methods: {
                    t(k, v) { return Locale.t(k, v); },
                    setTab(tab) {
                        uiState.activeTab = tab;
                        refresh();
                    },
                    toggleMod(key) {
                        uiState.openModules[key] = !uiState.openModules[key];
                        refresh();
                    },
                    openNew: (ev) => openNewMenu(ev),
                    openImport: (ev) => openImportMenu(ev),
                    openShare: (ev) => openShareMenu(ev),
                    openRelink: () => ParticleCueDialogs.openRelinkDialog(),
                    openShaderGraph: () => openShaderGraphForActiveMaterial(),
                    openRawInspector: () => ParticleCueDialogs.openAssetInspectorDialog(),
                    onRescan() {
                        if (typeof Project !== 'undefined' && Project) {
                            AssetResolver.scanProject(Project, {notify: true});
                            if (typeof Animator !== 'undefined' && Animator.open) Animator.preview();
                            refresh();
                        }
                    },
                    onTogglePreview() {
                        SnowstormPreview.setEnhancedEnabled(!SnowstormPreview.isEnhancedEnabled());
                        refresh();
                    },
                    selectEffectItem(item, jumpTab) {
                        if (item.assetId) {
                            uiState.selectedAssetId = item.assetId;
                            uiState.selectedEmitterIdx = 0;
                            uiState.selectedMaterialKey = '';
                        }
                        if (typeof Timeline !== 'undefined' && Number.isFinite(item.timeNum)) {
                            Timeline.setTime(item.timeNum + 0.6);
                            if (typeof Animator !== 'undefined' && Animator.open) Animator.preview();
                        }
                        if (jumpTab) uiState.activeTab = jumpTab;
                        refresh();
                    },
                    openEffectContextMenu(item, event) {
                        const anchor = event?.type === 'contextmenu' ? event : (event?.currentTarget instanceof HTMLElement ? event.currentTarget : event);
                        new Menu([
                            {name: Locale.t('panel_ctx_edit_emitters'), icon: 'tune', click: () => this.selectEffectItem(item, 'emitters')},
                            {name: Locale.t('panel_ctx_edit_materials'), icon: 'auto_fix_high', click: () => this.selectEffectItem(item, 'materials')},
                            {name: Locale.t('panel_ctx_open_kilagraph'), icon: 'account_tree', click: () => { this.selectEffectItem(item); openShaderGraphForActiveMaterial(); }},
                            '_',
                            {name: Locale.t('panel_ctx_edit_keyframe'), icon: 'schedule', click: () => ParticleCueDialogs.openKeyframeBindingDialog(item.bindingKey)},
                            {name: Locale.t('panel_ctx_raw_json'), icon: 'code', click: () => ParticleCueDialogs.openAssetInspectorDialog()},
                            {name: Locale.t('dialog_inspect_export_particle'), icon: 'file_download', click: () => {
                                if (!item.assetId) return;
                                const cur = KeyframeStore.getAssetById(Project, item.assetId);
                                if (!cur) return;
                                const isFx = cur.format === 'photon_fx';
                                Blockbench.export({
                                    type: isFx ? 'Photon FX' : 'Particle JSON',
                                    extensions: [isFx ? 'fx' : 'json'],
                                    name: cur.fileName.replace(/\.(json|fx)$/i, ''),
                                    custom_writer: (_c, outPath) => {
                                        SelfContainedProject.exportSingleEmbeddedAsset(Project, cur.id, outPath);
                                        Blockbench.showQuickMessage(`Exported ${outPath}`, 3000);
                                    }
                                });
                            }}
                        ]).open(anchor);
                    },

                    // ---- LumenFX Emitter Mutations ----
                    selectEmitter(idx) { uiState.selectedEmitterIdx = idx; refresh(); },
                    openAddEmitter: (ev) => openAddEmitterMenu(ev),
                    duplicateEmitter() {
                        mutateLumenFxJson((json) => {
                            if (!Array.isArray(json.emitters) || !json.emitters[uiState.selectedEmitterIdx]) return;
                            const copy = JSON.parse(JSON.stringify(json.emitters[uiState.selectedEmitterIdx]));
                            copy.name = `${copy.name || 'emitter'}_copy`;
                            json.emitters.push(copy);
                            uiState.selectedEmitterIdx = json.emitters.length - 1;
                        });
                    },
                    deleteEmitter() {
                        mutateLumenFxJson((json) => {
                            if (!Array.isArray(json.emitters) || json.emitters.length <= 1) return;
                            json.emitters.splice(uiState.selectedEmitterIdx, 1);
                            uiState.selectedEmitterIdx = Math.max(0, uiState.selectedEmitterIdx - 1);
                        });
                    },
                    setEmField(field, rawVal, asNum = false) {
                        mutateLumenFxJson((json) => {
                            const em = json.emitters?.[uiState.selectedEmitterIdx];
                            if (!em) return;
                            em[field] = asNum ? (Number(rawVal) || 0) : rawVal;
                        });
                    },
                    setEmStartColor(hex, alpha) {
                        mutateLumenFxJson((json) => {
                            const em = json.emitters?.[uiState.selectedEmitterIdx];
                            if (!em) return;
                            const rgb = KilaMaterialCompiler.hexToRgb01(hex);
                            const a = Math.max(0, Math.min(1, Number(alpha ?? 1)));
                            em.start_color = [Number(rgb[0].toFixed(3)), Number(rgb[1].toFixed(3)), Number(rgb[2].toFixed(3)), Number(a.toFixed(3))];
                        });
                    },
                    addBurst() {
                        mutateLumenFxJson((json) => {
                            const em = json.emitters?.[uiState.selectedEmitterIdx];
                            if (!em) return;
                            if (!Array.isArray(em.bursts)) em.bursts = [];
                            em.bursts.push({time: 0, min: 8, max: 12, cycles: 1, interval: 1});
                        });
                    },
                    setBurstField(bi, field, rawVal) {
                        mutateLumenFxJson((json) => {
                            const b = json.emitters?.[uiState.selectedEmitterIdx]?.bursts?.[bi];
                            if (!b) return;
                            b[field] = Number(rawVal) || 0;
                        });
                    },
                    removeBurst(bi) {
                        mutateLumenFxJson((json) => {
                            const list = json.emitters?.[uiState.selectedEmitterIdx]?.bursts;
                            if (Array.isArray(list)) list.splice(bi, 1);
                        });
                    },
                    setShapeField(field, rawVal, asNum = false) {
                        mutateLumenFxJson((json) => {
                            const em = json.emitters?.[uiState.selectedEmitterIdx];
                            if (!em) return;
                            if (!em.shape || typeof em.shape !== 'object') em.shape = {type: 'point'};
                            em.shape[field] = asNum ? (Number(rawVal) || 0) : rawVal;
                        });
                    },
                    setShapeVec(pathKey, axis, rawVal) {
                        mutateLumenFxJson((json) => {
                            const em = json.emitters?.[uiState.selectedEmitterIdx];
                            if (!em) return;
                            if (!em.shape) em.shape = {type: 'point'};
                            if (pathKey === 'size') {
                                if (!Array.isArray(em.shape.size)) em.shape.size = [0.5, 0.5, 0.5];
                                em.shape.size[axis] = Number(rawVal) || 0;
                            } else if (pathKey === 'unityPos') {
                                if (!em.shape.unity) em.shape.unity = {position: [0, 0, 0], rotation: [0, 0, 0, 1]};
                                if (!Array.isArray(em.shape.unity.position)) em.shape.unity.position = [0, 0, 0];
                                em.shape.unity.position[axis] = Number(rawVal) || 0;
                            } else if (pathKey === 'unityRot') {
                                if (!em.shape.unity) em.shape.unity = {position: [0, 0, 0], rotation: [0, 0, 0, 1]};
                                const cur = quatToEulerDeg(em.shape.unity.rotation);
                                cur[axis] = Number(rawVal) || 0;
                                em.shape.unity.rotation = eulerDegToQuat(cur);
                            }
                        });
                    },
                    setEmVec(field, axis, rawVal) {
                        mutateLumenFxJson((json) => {
                            const em = json.emitters?.[uiState.selectedEmitterIdx];
                            if (!em) return;
                            if (!Array.isArray(em[field])) em[field] = [0, 0, 0];
                            em[field][axis] = Number(rawVal) || 0;
                        });
                    },
                    setCollisionField(field, rawVal, isBool = false) {
                        mutateLumenFxJson((json) => {
                            const em = json.emitters?.[uiState.selectedEmitterIdx];
                            if (!em) return;
                            if (!em.collision) em.collision = {enabled: false, bounce: 0.5, dampen: 0.1, lifetime_loss: 0};
                            em.collision[field] = isBool ? Boolean(rawVal) : (Number(rawVal) || 0);
                        });
                    },
                    setEmMeshAsset(assetRef) {
                        mutateLumenFxJson((json) => {
                            const em = json.emitters?.[uiState.selectedEmitterIdx];
                            if (!em) return;
                            if (!em.mesh) em.mesh = {entries: [{asset: ''}]};
                            if (!Array.isArray(em.mesh.entries) || !em.mesh.entries.length) em.mesh.entries = [{asset: ''}];
                            em.mesh.entries[0].asset = String(assetRef || '').trim();
                        });
                    },
                    editSizeCurve() {
                        const rec = KeyframeStore.getAssetById(Project, uiState.selectedAssetId);
                        const json = rec ? LumenFxSchema.safeParseJson(rec.rawText) : null;
                        const em = json?.emitters?.[uiState.selectedEmitterIdx];
                        if (!em) return;
                        ParticleCueCurveEditor.open({
                            title: `Size Over Life — ${em.name || 'Emitter'}`,
                            value: em.size_over_life,
                            fallback: 1,
                            min: 0,
                            max: 2,
                            onChange: (curve) => mutateLumenFxJson(d => { if (d.emitters?.[uiState.selectedEmitterIdx]) d.emitters[uiState.selectedEmitterIdx].size_over_life = curve; }),
                            onConfirm: (curve) => mutateLumenFxJson(d => { if (d.emitters?.[uiState.selectedEmitterIdx]) d.emitters[uiState.selectedEmitterIdx].size_over_life = curve; })
                        });
                    },
                    editVec3Curve(field, axisIdx, label) {
                        const rec = KeyframeStore.getAssetById(Project, uiState.selectedAssetId);
                        const json = rec ? LumenFxSchema.safeParseJson(rec.rawText) : null;
                        const em = json?.emitters?.[uiState.selectedEmitterIdx];
                        if (!em) return;
                        const cur = Array.isArray(em[field]) ? em[field][axisIdx] : 0;
                        const applyCurve = (curve) => mutateLumenFxJson(d => {
                            const target = d.emitters?.[uiState.selectedEmitterIdx];
                            if (!target) return;
                            if (!Array.isArray(target[field])) target[field] = [0, 0, 0];
                            target[field][axisIdx] = curve;
                        });
                        ParticleCueCurveEditor.open({
                            title: `${label} — ${em.name || 'Emitter'}`,
                            value: cur,
                            fallback: 0,
                            min: -3,
                            max: 3,
                            onChange: applyCurve,
                            onConfirm: applyCurve
                        });
                    },
                    editColorGradient() {
                        const rec = KeyframeStore.getAssetById(Project, uiState.selectedAssetId);
                        const json = rec ? LumenFxSchema.safeParseJson(rec.rawText) : null;
                        const em = json?.emitters?.[uiState.selectedEmitterIdx];
                        if (!em) return;
                        const cur = em.color_over_life !== undefined ? em.color_over_life : em.color;
                        const applyGrad = (stops) => mutateLumenFxJson(d => {
                            const target = d.emitters?.[uiState.selectedEmitterIdx];
                            if (!target) return;
                            target.color_over_life = stops;
                            delete target.color;
                        });
                        ParticleCueGradientEditor.open({
                            title: `Color Over Life — ${em.name || 'Emitter'}`,
                            value: cur,
                            onChange: applyGrad,
                            onConfirm: applyGrad
                        });
                    },

                    // ---- LumenFX Material & Kila Composer Mutations ----
                    selectMaterial(k) { uiState.selectedMaterialKey = k; refresh(); },
                    addMaterial() {
                        mutateLumenFxJson((json) => {
                            if (!json.materials) json.materials = {};
                            const k = `mat_${Object.keys(json.materials).length + 1}`;
                            json.materials[k] = {
                                fragment_shader: 'lumenfx:core/effect',
                                blend: 'additive',
                                depth_test: true,
                                depth_write: false,
                                cull: false,
                                hdr: true,
                                emissive_scale: 1.35,
                                bloom_intensity: 0.4
                            };
                            uiState.selectedMaterialKey = k;
                        });
                    },
                    deleteMaterial() {
                        mutateLumenFxJson((json) => {
                            const keys = Object.keys(json.materials || {});
                            if (keys.length <= 1 || !uiState.selectedMaterialKey) return;
                            delete json.materials[uiState.selectedMaterialKey];
                            uiState.selectedMaterialKey = Object.keys(json.materials)[0] || '';
                        });
                    },
                    setMatField(field, rawVal, kind = 'str') {
                        mutateLumenFxJson((json) => {
                            const mat = json.materials?.[uiState.selectedMaterialKey];
                            if (!mat) return;
                            if (kind === 'num') mat[field] = Number(rawVal) || 0;
                            else if (kind === 'bool') mat[field] = Boolean(rawVal);
                            else mat[field] = String(rawVal || '');
                        });
                    },
                    setMatSampler0(val) {
                        mutateLumenFxJson((json) => {
                            const mat = json.materials?.[uiState.selectedMaterialKey];
                            if (!mat) return;
                            const clean = String(val || '').trim();
                            if (!clean) {
                                if (mat.textures) delete mat.textures.Sampler0;
                            } else {
                                if (!mat.textures) mat.textures = {};
                                mat.textures.Sampler0 = clean;
                            }
                        });
                    },
                    browseMatTexture() {
                        if (typeof Project === 'undefined' || !Project || !uiState.selectedAssetId) return;
                        Blockbench.import({
                            type: 'PNG Texture',
                            extensions: ['png'],
                            readtype: 'image'
                        }, files => {
                            if (!files?.[0]) return;
                            const file = files[0];
                            const ref = `particlecue:textures/vfx/${Platform.sanitizeFilename(file.name || 'custom.png')}`;
                            const rec = KeyframeStore.getAssetById(Project, uiState.selectedAssetId);
                            if (rec) {
                                if (!rec.embeddedTextures) rec.embeddedTextures = {};
                                rec.embeddedTextures[ref] = file.content;
                            }
                            this.setMatSampler0(ref);
                        });
                    },
                    updateKilaModule(section, key, rawVal, kind = 'num') {
                        mutateLumenFxJson((json) => {
                            const mat = json.materials?.[uiState.selectedMaterialKey];
                            if (!mat) return;
                            const cfg = Object.assign(KilaMaterialCompiler.createDefaultKilaConfig(), mat._kila_config || {});
                            cfg.enabled = true;
                            if (section === 'root') {
                                cfg[key] = kind === 'bool' ? Boolean(rawVal) : (kind === 'num' ? (Number(rawVal) || 0) : rawVal);
                            } else {
                                if (!cfg[section]) cfg[section] = {};
                                cfg[section][key] = kind === 'bool' ? Boolean(rawVal) : (kind === 'num' ? (Number(rawVal) || 0) : rawVal);
                            }
                            mat._kila_config = cfg;
                            mat.custom_glsl_fragment = KilaMaterialCompiler.compileKilaMaterial(cfg);
                            mat.fragment_shader = `particlecue:kila/${uiState.selectedMaterialKey}`;
                        });
                    },
                    editKilaRamp() {
                        const rec = KeyframeStore.getAssetById(Project, uiState.selectedAssetId);
                        const json = rec ? LumenFxSchema.safeParseJson(rec.rawText) : null;
                        const mat = json?.materials?.[uiState.selectedMaterialKey];
                        if (!mat) return;
                        const cfg = Object.assign(KilaMaterialCompiler.createDefaultKilaConfig(), mat._kila_config || {});
                        const apply = (stops) => {
                            mutateLumenFxJson(d => {
                                const m = d.materials?.[uiState.selectedMaterialKey];
                                if (!m) return;
                                const c = Object.assign(KilaMaterialCompiler.createDefaultKilaConfig(), m._kila_config || {});
                                c.enabled = true;
                                c.ramp.enabled = true;
                                c.ramp.stops = stops;
                                m._kila_config = c;
                                m.custom_glsl_fragment = KilaMaterialCompiler.compileKilaMaterial(c);
                                m.fragment_shader = `particlecue:kila/${uiState.selectedMaterialKey}`;
                            });
                        };
                        ParticleCueGradientEditor.open({
                            title: `Kila Color Ramp — ${uiState.selectedMaterialKey}`,
                            value: cfg.ramp.stops,
                            onChange: apply,
                            onConfirm: apply
                        });
                    },
                    openGlslCodeEditor() {
                        const rec = KeyframeStore.getAssetById(Project, uiState.selectedAssetId);
                        const json = rec ? LumenFxSchema.safeParseJson(rec.rawText) : null;
                        const mat = json?.materials?.[uiState.selectedMaterialKey];
                        if (!mat) return;
                        ParticleCueDialogs.openGlslSourceDialog(uiState.selectedMaterialKey, mat.custom_glsl_fragment || '', (newSrc) => {
                            mutateLumenFxJson(d => {
                                const m = d.materials?.[uiState.selectedMaterialKey];
                                if (!m) return;
                                m.custom_glsl_fragment = newSrc;
                                if (newSrc.trim()) m.fragment_shader = `particlecue:custom/${uiState.selectedMaterialKey}`;
                            });
                        });
                    },

                    // ---- Scene Attachments (Lights / Volumes / Decals) ----
                    addLight() {
                        mutateLumenFxJson(json => {
                            if (!Array.isArray(json.lights)) json.lights = [];
                            json.lights.push({position: [0, 1.5, 0], color: [1, 0.72, 0.3], radius: 8.0, intensity: 0.85, type: 'point'});
                            uiState.openModules.attachments = true;
                        });
                    },
                    setLightField(idx, field, val) {
                        mutateLumenFxJson(json => {
                            const lt = json.lights?.[idx];
                            if (!lt) return;
                            if (field === 'color') lt.color = KilaMaterialCompiler.hexToRgb01(val);
                            else if (field.startsWith('pos')) {
                                if (!Array.isArray(lt.position)) lt.position = [0, 0, 0];
                                lt.position[Number(field.slice(3))] = Number(val) || 0;
                            } else lt[field] = Number(val) || 0;
                        });
                    },
                    removeAttachment(kind, idx) {
                        mutateLumenFxJson(json => {
                            if (Array.isArray(json[kind])) json[kind].splice(idx, 1);
                        });
                    },
                    addVolume() {
                        mutateLumenFxJson(json => {
                            if (!Array.isArray(json.volumes)) json.volumes = [];
                            json.volumes.push({position: [0, 1.5, 0], size: [3, 3, 3], color: [0.35, 0.82, 1.0], density: 0.14});
                            uiState.openModules.attachments = true;
                        });
                    },
                    setVolumeField(idx, field, val) {
                        mutateLumenFxJson(json => {
                            const v = json.volumes?.[idx];
                            if (!v) return;
                            if (field === 'color') v.color = KilaMaterialCompiler.hexToRgb01(val);
                            else v[field] = Number(val) || 0;
                        });
                    },
                    addDecal() {
                        mutateLumenFxJson(json => {
                            if (!Array.isArray(json.decals)) json.decals = [];
                            json.decals.push({position: [0, 0.03, 0], size: [2.5, 0.1, 2.5], color: [1, 1, 1, 0.8], texture: ''});
                            uiState.openModules.attachments = true;
                        });
                    },

                    // ---- Snowstorm / Photon / KBR Direct Visual Edits ----
                    setSnowstormEdit(patch) {
                        const rec = KeyframeStore.getAssetById(Project, uiState.selectedAssetId);
                        if (!rec || rec.format !== 'bedrock_snowstorm') return;
                        const updated = SnowstormEditor.applyEditsLossless(rec.rawText, patch);
                        KeyframeStore.updateAssetContent(Project, rec.id, updated);
                        if (typeof Animator !== 'undefined' && Animator.open) Animator.preview();
                        refresh();
                    },
                    setPhotonEdit(patch) {
                        const rec = KeyframeStore.getAssetById(Project, uiState.selectedAssetId);
                        if (!rec || rec.format !== 'photon_fx') return;
                        const out = PhotonFxAdapter.applyEditsLossless(rec.rawText, uiState.selectedEmitterIdx, patch);
                        KeyframeStore.updateAssetContent(Project, rec.id, out.encoded);
                        if (typeof Animator !== 'undefined' && Animator.open) Animator.preview();
                        refresh();
                    },
                    setKbrEdit(field, rawVal) {
                        const rec = KeyframeStore.getAssetById(Project, uiState.selectedAssetId);
                        if (!rec || rec.format !== 'kbr_3d_particle') return;
                        const json = LumenFxSchema.safeParseJson(rec.rawText);
                        if (!json?.particle_effect) return;
                        const comps = json.particle_effect.components || (json.particle_effect.components = {});
                        if (field === 'spawnRate' || field === 'maxParticles') {
                            if (!comps['minecraft:emitter_rate_steady']) comps['minecraft:emitter_rate_steady'] = {spawn_rate: 12, max_particles: 48};
                            comps['minecraft:emitter_rate_steady'][field === 'spawnRate' ? 'spawn_rate' : 'max_particles'] = Math.max(1, Number(rawVal) || 1);
                        } else if (field === 'maxLifetime') {
                            if (!comps['minecraft:particle_lifetime_expression']) comps['minecraft:particle_lifetime_expression'] = {};
                            comps['minecraft:particle_lifetime_expression'].max_lifetime = Math.max(0.05, Number(rawVal) || 1);
                        } else if (field === 'initialSpeed') {
                            comps['minecraft:particle_initial_speed'] = Number(rawVal) || 0;
                        } else if (field === 'gravity') {
                            if (!comps['minecraft:particle_motion_dynamic']) comps['minecraft:particle_motion_dynamic'] = {};
                            comps['minecraft:particle_motion_dynamic'].linear_acceleration = [0, Number(rawVal) || 0, 0];
                        } else if (field === 'drag') {
                            if (!comps['minecraft:particle_motion_dynamic']) comps['minecraft:particle_motion_dynamic'] = {};
                            comps['minecraft:particle_motion_dynamic'].linear_drag_coefficient = Math.max(0, Number(rawVal) || 0);
                        } else if (['variant', 'material', 'doubleSided', 'texture'].includes(field)) {
                            const mk = Object.keys(rec.embeddedModels || {})[0];
                            if (mk && rec.embeddedModels[mk]?.descriptor) {
                                const d = rec.embeddedModels[mk].descriptor;
                                if (field === 'doubleSided') d.double_sided = Boolean(rawVal);
                                else d[field] = rawVal;
                            }
                        }
                        KeyframeStore.updateAssetContent(Project, rec.id, JSON.stringify(json, null, 2));
                        if (typeof Animator !== 'undefined' && Animator.open) Animator.preview();
                        refresh();
                    }
                },
                template: `
                    <div class="pc-panel">
                        <!-- 34px AnimCue/PAL-aligned Action Bar -->
                        <div class="pc-bar">
                            <div class="pc-action-btn primary" :title="t('panel_btn_new')" @click="openNew($event)">
                                <i class="material-icons">add</i><span>{{ t('panel_tool_new') }}</span>
                            </div>
                            <div class="pc-tool" :title="t('panel_tool_import')" @click="openImport($event)">
                                <i class="material-icons">file_upload</i>
                            </div>
                            <div class="pc-tool" :title="t('panel_tool_kilagraph')" @click="openShaderGraph">
                                <i class="material-icons">account_tree</i>
                            </div>
                            <div class="pc-tool" :class="{warn: state.missingCount > 0}" :title="t('panel_btn_relink')" @click="openRelink">
                                <i class="material-icons">link</i>
                                <span v-if="state.missingCount > 0" class="pc-badge-dot">{{ state.missingCount }}</span>
                            </div>
                            <div class="pc-spacer"></div>
                            <div class="pc-tool" :title="t('panel_btn_rescan')" @click="onRescan">
                                <i class="material-icons">refresh</i>
                            </div>
                            <div class="pc-action-btn" :title="t('panel_tool_share')" @click="openShare($event)">
                                <i class="material-icons">ios_share</i><span>{{ t('panel_tool_share') }}</span>
                            </div>
                        </div>

                        <!-- 28px Segmented Tabs -->
                        <div class="pc-tabs" v-if="state.hasProject">
                            <div class="pc-tab" :class="{active: state.activeTab === 'effects'}" @click="setTab('effects')">
                                <i class="material-icons">layers</i><span>{{ t('tab_effects') }} ({{ state.totalBindings }})</span>
                            </div>
                            <div class="pc-tab" :class="{active: state.activeTab === 'emitters'}" @click="setTab('emitters')">
                                <i class="material-icons">tune</i><span>{{ t('tab_emitters') }}</span>
                            </div>
                            <div class="pc-tab" :class="{active: state.activeTab === 'materials'}" @click="setTab('materials')">
                                <i class="material-icons">auto_fix_high</i><span>{{ t('tab_materials') }}</span>
                            </div>
                        </div>

                        <!-- No Active Project -->
                        <div v-if="!state.hasProject" class="pc-body">
                            <div class="pc-empty-box">{{ t('panel_no_particles') }}</div>
                        </div>

                        <!-- TAB 1: Effects / Bindings Cards (AnimCue Studio Style) -->
                        <div v-else-if="state.activeTab === 'effects'" class="pc-body">
                            <div v-if="state.missingCount > 0" class="pc-card missing" @click="openRelink">
                                <div class="pc-avatar" style="background:rgba(248,113,113,0.2);color:#fca5a5;"><i class="material-icons">warning</i></div>
                                <div class="pc-info">
                                    <div class="pc-name" style="color:#fca5a5;">{{ t('panel_status_missing', {count: state.missingCount}) }}</div>
                                    <div class="pc-sub">{{ t('panel_missing_hint') }}</div>
                                </div>
                                <span class="pc-chip warn">{{ t('panel_btn_relink') }}</span>
                            </div>

                            <div class="pc-group-label">
                                <span>{{ t('panel_bindings_heading') }}</span>
                                <span>{{ state.items.length }}</span>
                            </div>

                            <div v-if="!state.items.length" class="pc-empty-box">
                                <div>{{ t('panel_no_particles') }}</div>
                                <div style="display:flex;gap:6px;margin-top:8px;justify-content:center;">
                                    <span class="pc-action-btn primary" @click="openNew($event)"><i class="material-icons">add</i>{{ t('panel_btn_new') }}</span>
                                    <span class="pc-action-btn" @click="openImport($event)"><i class="material-icons">file_upload</i>{{ t('panel_tool_import') }}</span>
                                </div>
                            </div>

                            <div v-for="item in state.items" :key="item.bindingKey"
                                 class="pc-card"
                                 :class="{selected: item.assetId && item.assetId === state.selectedAssetId, missing: item.status === 'missing'}"
                                 @click="selectEffectItem(item)"
                                 @dblclick="selectEffectItem(item, 'emitters')"
                                 @contextmenu.prevent="openEffectContextMenu(item, $event)">
                                <div class="pc-avatar"><i class="material-icons">{{ item.formatIcon }}</i></div>
                                <div class="pc-info">
                                    <div class="pc-name-line">
                                        <span class="pc-name">{{ item.effect }}</span>
                                        <span class="pc-chip accent">{{ item.formatLabel }}</span>
                                    </div>
                                    <div class="pc-sub">@ {{ item.time }}s · {{ item.locator }} · {{ item.fileName }}</div>
                                </div>
                                <div class="pc-row-btns" @click.stop>
                                    <div class="pc-row-btn" :title="t('panel_ctx_edit_emitters')" @click="selectEffectItem(item, 'emitters')">
                                        <i class="material-icons">tune</i>
                                    </div>
                                    <div class="pc-row-btn" :title="t('panel_ctx_more')" @click="openEffectContextMenu(item, $event)">
                                        <i class="material-icons">more_vert</i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- TAB 2: Photon-Style Live Emitter & Module Inspector -->
                        <div v-else-if="state.activeTab === 'emitters'" class="pc-body">
                            <div v-if="!state.editor" class="pc-empty-box">
                                <div>{{ t('panel_select_effect_hint') }}</div>
                                <div style="margin-top:8px;">
                                    <span class="pc-action-btn primary" @click="openNew($event)"><i class="material-icons">add</i>{{ t('panel_btn_new') }}</span>
                                </div>
                            </div>

                            <!-- LUMENFX JSON (Native / Unity / Niagara) LIVE EDITOR -->
                            <template v-else-if="state.editor.format === 'lumenfx_json'">
                                <div class="pc-group-label">
                                    <span>{{ state.editor.identifier }}</span>
                                    <div style="display:flex;gap:3px;">
                                        <span class="pc-chip accent" v-if="state.editor.originKind">{{ state.editor.originKind }}</span>
                                        <span class="pc-chip">{{ state.editor.emitterList.length }} em</span>
                                    </div>
                                </div>

                                <!-- Emitter Hierarchy Pill Bar -->
                                <div class="pc-pill-strip">
                                    <span v-for="emItem in state.editor.emitterList" :key="emItem.index"
                                          class="pc-pill" :class="{active: emItem.index === state.editor.selectedEmitterIdx}"
                                          @click="selectEmitter(emItem.index)">
                                        {{ emItem.name }}
                                    </span>
                                    <span class="pc-tool" title="Add Emitter" @click="openAddEmitter($event)"><i class="material-icons">add</i></span>
                                    <span class="pc-tool" title="Duplicate Emitter" @click="duplicateEmitter"><i class="material-icons">content_copy</i></span>
                                    <span v-if="state.editor.emitterList.length > 1" class="pc-tool warn" title="Delete Emitter" @click="deleteEmitter"><i class="material-icons">delete_outline</i></span>
                                </div>

                                <template v-if="state.editor.emitter">
                                    <!-- Module 1: Main -->
                                    <div class="pc-mod">
                                        <div class="pc-mod-head" @click="toggleMod('main')">
                                            <i class="material-icons">{{ state.openModules.main ? 'expand_more' : 'chevron_right' }}</i>
                                            <span class="pc-mod-title">Main · 基础参数</span>
                                            <span class="pc-chip">{{ state.editor.emitter.renderer }}</span>
                                        </div>
                                        <div v-if="state.openModules.main" class="pc-mod-body">
                                            <div class="pc-grid-2">
                                                <div class="pc-field">
                                                    <span class="pc-label">Name</span>
                                                    <input class="pc-input" :value="state.editor.emitter.name" @change="setEmField('name', $event.target.value)" />
                                                </div>
                                                <div class="pc-field">
                                                    <span class="pc-label">Renderer</span>
                                                    <select class="pc-select" :value="state.editor.emitter.renderer" @change="setEmField('renderer', $event.target.value)">
                                                        <option value="sprite">Sprite</option>
                                                        <option value="ribbon">Ribbon</option>
                                                        <option value="beam">Beam</option>
                                                        <option value="mesh">3D Mesh</option>
                                                    </select>
                                                </div>
                                                <div class="pc-field">
                                                    <span class="pc-label">Material</span>
                                                    <select class="pc-select" :value="state.editor.emitter.material" @change="setEmField('material', $event.target.value)">
                                                        <option v-for="mk in state.editor.materialKeys" :key="mk" :value="mk">{{ mk }}</option>
                                                    </select>
                                                </div>
                                                <div class="pc-field">
                                                    <span class="pc-label">Max Particles</span>
                                                    <input class="pc-input" type="number" step="4" min="1" :value="state.editor.emitter.max_particles" @change="setEmField('max_particles', $event.target.value, true)" />
                                                </div>
                                                <div class="pc-field">
                                                    <span class="pc-label">Duration (s)</span>
                                                    <input class="pc-input" type="number" step="0.1" min="0.05" :value="state.editor.emitter.duration" @change="setEmField('duration', $event.target.value, true)" />
                                                </div>
                                                <div class="pc-field">
                                                    <span class="pc-label">Lifetime (s)</span>
                                                    <input class="pc-input" type="number" step="0.1" min="0.05" :value="state.editor.emitter.lifetime" @change="setEmField('lifetime', $event.target.value, true)" />
                                                </div>
                                                <div class="pc-field">
                                                    <span class="pc-label">Width</span>
                                                    <input class="pc-input" type="number" step="0.05" min="0.01" :value="state.editor.emitter.width" @change="setEmField('width', $event.target.value, true)" />
                                                </div>
                                                <div class="pc-field">
                                                    <span class="pc-label">Height</span>
                                                    <input class="pc-input" type="number" step="0.05" min="0.01" :value="state.editor.emitter.height" @change="setEmField('height', $event.target.value, true)" />
                                                </div>
                                                <div class="pc-field">
                                                    <span class="pc-label">Start Speed</span>
                                                    <input class="pc-input" type="number" step="0.2" :value="state.editor.emitter.start_speed" @change="setEmField('start_speed', $event.target.value, true)" />
                                                </div>
                                                <div class="pc-field">
                                                    <span class="pc-label">Spin (rad/s)</span>
                                                    <input class="pc-input" type="number" step="0.2" :value="state.editor.emitter.angular_velocity" @change="setEmField('angular_velocity', $event.target.value, true)" />
                                                </div>
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Start Color & Alpha</span>
                                                <div class="pc-color-row">
                                                    <input class="pc-color-swatch" type="color" :value="state.editor.emitter.startColorHex" @input="setEmStartColor($event.target.value, state.editor.emitter.startColorAlpha)" />
                                                    <input class="pc-input" style="width:62px;" type="number" step="0.05" min="0" max="1" :value="state.editor.emitter.startColorAlpha" @change="setEmStartColor(state.editor.emitter.startColorHex, $event.target.value)" />
                                                    <span class="pc-label">Sort</span>
                                                    <input class="pc-input" style="width:48px;" type="number" step="1" :value="state.editor.emitter.sort_order" @change="setEmField('sort_order', $event.target.value, true)" />
                                                </div>
                                            </div>
                                            <div class="pc-grid-2">
                                                <label class="pc-check"><input type="checkbox" :checked="state.editor.emitter.loop" @change="setEmField('loop', $event.target.checked)" />Loop</label>
                                                <label class="pc-check"><input type="checkbox" :checked="state.editor.emitter.local_space" @change="setEmField('local_space', $event.target.checked)" />Local Space</label>
                                                <label class="pc-check"><input type="checkbox" :checked="state.editor.emitter.stretched_billboard" @change="setEmField('stretched_billboard', $event.target.checked)" />Stretched</label>
                                                <label class="pc-check"><input type="checkbox" :checked="state.editor.emitter.scale_size_with_owner" @change="setEmField('scale_size_with_owner', $event.target.checked)" />Scale w/ Owner</label>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Module 2: Emission & Bursts -->
                                    <div class="pc-mod">
                                        <div class="pc-mod-head" @click="toggleMod('emission')">
                                            <i class="material-icons">{{ state.openModules.emission ? 'expand_more' : 'chevron_right' }}</i>
                                            <span class="pc-mod-title">Emission · 发射率与爆发</span>
                                            <span class="pc-chip">{{ state.editor.emitter.rate }}/s · {{ state.editor.emitter.bursts.length }}B</span>
                                        </div>
                                        <div v-if="state.openModules.emission" class="pc-mod-body">
                                            <div class="pc-grid-2">
                                                <div class="pc-field">
                                                    <span class="pc-label">Rate Over Time (/s)</span>
                                                    <input class="pc-input" type="number" step="2" min="0" :value="state.editor.emitter.rate" @change="setEmField('rate', $event.target.value, true)" />
                                                </div>
                                                <div class="pc-field">
                                                    <span class="pc-label">Delay (s)</span>
                                                    <input class="pc-input" type="number" step="0.1" min="0" :value="state.editor.emitter.delay" @change="setEmField('delay', $event.target.value, true)" />
                                                </div>
                                            </div>
                                            <div class="pc-field-row">
                                                <span class="pc-label">Bursts (Time / Min / Max / Cycles)</span>
                                                <span class="pc-action-btn" style="height:20px;font-size:10.5px;" @click="addBurst">+ Burst</span>
                                            </div>
                                            <div v-for="(b, bi) in state.editor.emitter.bursts" :key="bi" class="pc-mini-row">
                                                <input class="pc-input" type="number" step="0.1" :value="b.time" @change="setBurstField(bi, 'time', $event.target.value)" title="Time (s)" />
                                                <input class="pc-input" type="number" step="1" :value="b.min" @change="setBurstField(bi, 'min', $event.target.value)" title="Min" />
                                                <input class="pc-input" type="number" step="1" :value="b.max" @change="setBurstField(bi, 'max', $event.target.value)" title="Max" />
                                                <input class="pc-input" type="number" step="1" :value="b.cycles" @change="setBurstField(bi, 'cycles', $event.target.value)" title="Cycles" />
                                                <span class="pc-row-btn" @click="removeBurst(bi)"><i class="material-icons">close</i></span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Module 3: Size & Color Over Life (Interactive Curve & Gradient!) -->
                                    <div class="pc-mod">
                                        <div class="pc-mod-head" @click="toggleMod('curves')">
                                            <i class="material-icons">{{ state.openModules.curves ? 'expand_more' : 'chevron_right' }}</i>
                                            <span class="pc-mod-title">Lifetime · 大小曲线与颜色渐变</span>
                                        </div>
                                        <div v-if="state.openModules.curves" class="pc-mod-body">
                                            <div class="pc-field">
                                                <span class="pc-label">Size Over Life (Click to edit curve)</span>
                                                <div class="pc-curve-btn" @click="editSizeCurve">
                                                    <svg viewBox="0 0 100 22" preserveAspectRatio="none">
                                                        <path :d="state.editor.emitter.sizeCurvePath" fill="none" stroke="#38bdf8" stroke-width="1.8" />
                                                    </svg>
                                                    <i class="material-icons" style="font-size:14px;color:var(--color-subtle_text);">show_chart</i>
                                                </div>
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Color Over Life (Click to edit gradient)</span>
                                                <div class="pc-grad-btn" @click="editColorGradient">
                                                    <div class="pc-grad-fill" :style="{background: state.editor.emitter.colorGradientCss}"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Module 4: Shape & Unity Transform -->
                                    <div class="pc-mod">
                                        <div class="pc-mod-head" @click="toggleMod('shape')">
                                            <i class="material-icons">{{ state.openModules.shape ? 'expand_more' : 'chevron_right' }}</i>
                                            <span class="pc-mod-title">Shape · 发射形状与空间</span>
                                            <span class="pc-chip">{{ state.editor.emitter.shapeType }}</span>
                                        </div>
                                        <div v-if="state.openModules.shape" class="pc-mod-body">
                                            <div class="pc-grid-2">
                                                <div class="pc-field">
                                                    <span class="pc-label">Shape Type</span>
                                                    <select class="pc-select" :value="state.editor.emitter.shapeType" @change="setShapeField('type', $event.target.value)">
                                                        <option value="point">Point</option>
                                                        <option value="sphere">Sphere</option>
                                                        <option value="hemisphere">Hemisphere</option>
                                                        <option value="box">Box</option>
                                                        <option value="cone">Cone</option>
                                                        <option value="circle">Circle / Ring</option>
                                                        <option value="cylinder">Cylinder</option>
                                                    </select>
                                                </div>
                                                <div class="pc-field">
                                                    <span class="pc-label">Radius / Angle</span>
                                                    <div style="display:flex;gap:3px;">
                                                        <input class="pc-input" type="number" step="0.1" :value="state.editor.emitter.shapeRadius" @change="setShapeField('radius', $event.target.value, true)" title="Radius" />
                                                        <input class="pc-input" type="number" step="5" :value="state.editor.emitter.shapeAngle" @change="setShapeField('angle', $event.target.value, true)" title="Cone Angle" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Shape Size (X / Y / Z)</span>
                                                <div class="pc-vec3">
                                                    <input class="pc-input" type="number" step="0.1" :value="state.editor.emitter.shapeSize[0]" @change="setShapeVec('size', 0, $event.target.value)" />
                                                    <input class="pc-input" type="number" step="0.1" :value="state.editor.emitter.shapeSize[1]" @change="setShapeVec('size', 1, $event.target.value)" />
                                                    <input class="pc-input" type="number" step="0.1" :value="state.editor.emitter.shapeSize[2]" @change="setShapeVec('size', 2, $event.target.value)" />
                                                </div>
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Emitter Offset (X / Y / Z)</span>
                                                <div class="pc-vec3">
                                                    <input class="pc-input" type="number" step="0.2" :value="state.editor.emitter.unityPos[0]" @change="setShapeVec('unityPos', 0, $event.target.value)" />
                                                    <input class="pc-input" type="number" step="0.2" :value="state.editor.emitter.unityPos[1]" @change="setShapeVec('unityPos', 1, $event.target.value)" />
                                                    <input class="pc-input" type="number" step="0.2" :value="state.editor.emitter.unityPos[2]" @change="setShapeVec('unityPos', 2, $event.target.value)" />
                                                </div>
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Emitter Rotation Euler° (X / Y / Z)</span>
                                                <div class="pc-vec3">
                                                    <input class="pc-input" type="number" step="5" :value="state.editor.emitter.unityRotDeg[0]" @change="setShapeVec('unityRot', 0, $event.target.value)" />
                                                    <input class="pc-input" type="number" step="5" :value="state.editor.emitter.unityRotDeg[1]" @change="setShapeVec('unityRot', 1, $event.target.value)" />
                                                    <input class="pc-input" type="number" step="5" :value="state.editor.emitter.unityRotDeg[2]" @change="setShapeVec('unityRot', 2, $event.target.value)" />
                                                </div>
                                            </div>
                                            <label class="pc-check"><input type="checkbox" :checked="state.editor.emitter.shapeSurface" @change="setShapeField('surface', $event.target.checked)" />Emit From Shell Surface</label>
                                        </div>
                                    </div>

                                    <!-- Module 5: Velocity, Force, Drag & Noise -->
                                    <div class="pc-mod">
                                        <div class="pc-mod-head" @click="toggleMod('motion')">
                                            <i class="material-icons">{{ state.openModules.motion ? 'expand_more' : 'chevron_right' }}</i>
                                            <span class="pc-mod-title">Physics · 速度/重力/阻力/噪点</span>
                                        </div>
                                        <div v-if="state.openModules.motion" class="pc-mod-body">
                                            <div class="pc-field">
                                                <span class="pc-label">Acceleration / Gravity (X / Y / Z)</span>
                                                <div class="pc-vec3">
                                                    <input class="pc-input" type="number" step="0.5" :value="state.editor.emitter.accel[0]" @change="setEmVec('acceleration', 0, $event.target.value)" />
                                                    <input class="pc-input" type="number" step="0.5" :value="state.editor.emitter.accel[1]" @change="setEmVec('acceleration', 1, $event.target.value)" />
                                                    <input class="pc-input" type="number" step="0.5" :value="state.editor.emitter.accel[2]" @change="setEmVec('acceleration', 2, $event.target.value)" />
                                                </div>
                                            </div>
                                            <div class="pc-grid-2">
                                                <div class="pc-field">
                                                    <span class="pc-label">Drag</span>
                                                    <input class="pc-input" type="number" step="0.1" min="0" :value="state.editor.emitter.drag" @change="setEmField('drag', $event.target.value, true)" />
                                                </div>
                                                <div class="pc-field">
                                                    <span class="pc-label">Noise Freq</span>
                                                    <input class="pc-input" type="number" step="0.2" min="0" :value="state.editor.emitter.noiseFreq" @change="setEmField('noise_frequency', $event.target.value, true)" />
                                                </div>
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Noise Turbulence (X / Y / Z)</span>
                                                <div class="pc-vec3">
                                                    <input class="pc-input" type="number" step="0.2" :value="state.editor.emitter.noiseStr[0]" @change="setEmVec('noise_strength', 0, $event.target.value)" />
                                                    <input class="pc-input" type="number" step="0.2" :value="state.editor.emitter.noiseStr[1]" @change="setEmVec('noise_strength', 1, $event.target.value)" />
                                                    <input class="pc-input" type="number" step="0.2" :value="state.editor.emitter.noiseStr[2]" @change="setEmVec('noise_strength', 2, $event.target.value)" />
                                                </div>
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Velocity Over Life Curves</span>
                                                <div class="pc-vec3">
                                                    <span class="pc-action-btn" @click="editVec3Curve('velocity_over_life', 0, 'Vel X')">Vel X</span>
                                                    <span class="pc-action-btn" @click="editVec3Curve('velocity_over_life', 1, 'Vel Y')">Vel Y</span>
                                                    <span class="pc-action-btn" @click="editVec3Curve('velocity_over_life', 2, 'Vel Z')">Vel Z</span>
                                                </div>
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Force Over Life Curves</span>
                                                <div class="pc-vec3">
                                                    <span class="pc-action-btn" @click="editVec3Curve('force_over_life', 0, 'Force X')">Frc X</span>
                                                    <span class="pc-action-btn" @click="editVec3Curve('force_over_life', 1, 'Force Y')">Frc Y</span>
                                                    <span class="pc-action-btn" @click="editVec3Curve('force_over_life', 2, 'Force Z')">Frc Z</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Module 6: Renderer Specifics & Collision -->
                                    <div class="pc-mod">
                                        <div class="pc-mod-head" @click="toggleMod('renderer')">
                                            <i class="material-icons">{{ state.openModules.renderer ? 'expand_more' : 'chevron_right' }}</i>
                                            <span class="pc-mod-title">Renderer & Collision · 图集/网格/碰撞</span>
                                        </div>
                                        <div v-if="state.openModules.renderer" class="pc-mod-body">
                                            <div v-if="state.editor.emitter.renderer === 'sprite'" class="pc-grid-2">
                                                <div class="pc-field">
                                                    <span class="pc-label">Atlas Cols</span>
                                                    <input class="pc-input" type="number" min="1" step="1" :value="state.editor.emitter.atlasCols" @change="setEmField('atlas_columns', $event.target.value, true)" />
                                                </div>
                                                <div class="pc-field">
                                                    <span class="pc-label">Atlas Rows</span>
                                                    <input class="pc-input" type="number" min="1" step="1" :value="state.editor.emitter.atlasRows" @change="setEmField('atlas_rows', $event.target.value, true)" />
                                                </div>
                                            </div>
                                            <div v-else-if="state.editor.emitter.renderer === 'mesh'" class="pc-field">
                                                <span class="pc-label">.lfmesh Asset Ref</span>
                                                <input class="pc-input" :value="state.editor.emitter.meshAsset" @change="setEmMeshAsset($event.target.value)" />
                                            </div>
                                            <div v-else-if="state.editor.emitter.renderer === 'beam'" class="pc-grid-2">
                                                <div class="pc-field">
                                                    <span class="pc-label">Beam Length</span>
                                                    <input class="pc-input" type="number" step="0.2" :value="state.editor.emitter.beamLength" @change="setEmField('beam_length', $event.target.value, true)" />
                                                </div>
                                                <div class="pc-field">
                                                    <span class="pc-label">Beam Noise</span>
                                                    <input class="pc-input" type="number" step="0.02" :value="state.editor.emitter.beamNoise" @change="setEmField('beam_noise', $event.target.value, true)" />
                                                </div>
                                            </div>
                                            <label class="pc-check"><input type="checkbox" :checked="state.editor.emitter.collisionEnabled" @change="setCollisionField('enabled', $event.target.checked, true)" />Ground / Block Collision</label>
                                            <div v-if="state.editor.emitter.collisionEnabled" class="pc-grid-2">
                                                <div class="pc-field">
                                                    <span class="pc-label">Bounce</span>
                                                    <input class="pc-input" type="number" step="0.05" min="0" max="1" :value="state.editor.emitter.collisionBounce" @change="setCollisionField('bounce', $event.target.value)" />
                                                </div>
                                                <div class="pc-field">
                                                    <span class="pc-label">Dampen</span>
                                                    <input class="pc-input" type="number" step="0.05" min="0" max="1" :value="state.editor.emitter.collisionDampen" @change="setCollisionField('dampen', $event.target.value)" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </template>

                            <!-- SNOWSTORM / BEDROCK VISUAL EDITOR -->
                            <template v-else-if="state.editor.format === 'bedrock_snowstorm' && state.editor.snowstorm">
                                <div class="pc-group-label">
                                    <span>{{ state.editor.snowstorm.identifier }}</span>
                                    <span class="pc-chip accent">Snowstorm</span>
                                </div>
                                <div class="pc-mod">
                                    <div class="pc-mod-head"><i class="material-icons">grain</i><span class="pc-mod-title">Material & Billboard</span></div>
                                    <div class="pc-mod-body">
                                        <div class="pc-grid-2">
                                            <div class="pc-field">
                                                <span class="pc-label">Material</span>
                                                <select class="pc-select" :value="state.editor.snowstorm.material" @change="setSnowstormEdit({material: $event.target.value})">
                                                    <option v-for="m in state.editor.snowstormMaterials" :key="m" :value="m">{{ m }}</option>
                                                </select>
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Facing Mode</span>
                                                <select class="pc-select" :value="state.editor.snowstorm.facingCameraMode" @change="setSnowstormEdit({facingCameraMode: $event.target.value})">
                                                    <option v-for="fm in state.editor.snowstormFacingModes" :key="fm" :value="fm">{{ fm }}</option>
                                                </select>
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Spawn Rate</span>
                                                <input class="pc-input" type="number" step="2" :value="state.editor.snowstorm.spawnRate" @change="setSnowstormEdit({spawnRate: Number($event.target.value)})" />
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Max Particles</span>
                                                <input class="pc-input" type="number" step="4" :value="state.editor.snowstorm.maxParticles" @change="setSnowstormEdit({maxParticles: Number($event.target.value)})" />
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Active Time</span>
                                                <input class="pc-input" type="number" step="0.1" :value="state.editor.snowstorm.activeTime" @change="setSnowstormEdit({activeTime: Number($event.target.value)})" />
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Max Lifetime</span>
                                                <input class="pc-input" type="number" step="0.1" :value="state.editor.snowstorm.maxLifetime" @change="setSnowstormEdit({maxLifetime: Number($event.target.value)})" />
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Width</span>
                                                <input class="pc-input" type="number" step="0.05" :value="state.editor.snowstorm.size[0]" @change="setSnowstormEdit({size: [Number($event.target.value), state.editor.snowstorm.size[1]]})" />
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Height</span>
                                                <input class="pc-input" type="number" step="0.05" :value="state.editor.snowstorm.size[1]" @change="setSnowstormEdit({size: [state.editor.snowstorm.size[0], Number($event.target.value)]})" />
                                            </div>
                                        </div>
                                        <div class="pc-grid-2">
                                            <label class="pc-check"><input type="checkbox" :checked="state.editor.snowstorm.localPosition" @change="setSnowstormEdit({localPosition: $event.target.checked})" />Local Position</label>
                                            <label class="pc-check"><input type="checkbox" :checked="state.editor.snowstorm.localRotation" @change="setSnowstormEdit({localRotation: $event.target.checked})" />Local Rotation</label>
                                            <label class="pc-check"><input type="checkbox" :checked="state.editor.snowstorm.flipbookEnabled" @change="setSnowstormEdit({flipbookEnabled: $event.target.checked})" />Flipbook</label>
                                            <label class="pc-check" v-if="state.editor.snowstorm.flipbookEnabled"><input type="checkbox" :checked="state.editor.snowstorm.flipbookStretch" @change="setSnowstormEdit({flipbookStretch: $event.target.checked})" />Stretch Life</label>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <!-- PHOTON .FX LOSSLESS NBT VISUAL EDITOR -->
                            <template v-else-if="state.editor.format === 'photon_fx' && state.editor.photonObj">
                                <div class="pc-pill-strip">
                                    <span v-for="po in state.editor.photonObjects" :key="po.index"
                                          class="pc-pill" :class="{active: po.index === state.editor.selectedEmitterIdx}"
                                          @click="selectEmitter(po.index)">{{ po.name }}</span>
                                </div>
                                <div class="pc-mod">
                                    <div class="pc-mod-head"><i class="material-icons">blur_on</i><span class="pc-mod-title">Photon NBT Emitter (Lossless)</span></div>
                                    <div class="pc-mod-body">
                                        <div class="pc-grid-2">
                                            <div class="pc-field">
                                                <span class="pc-label">Name</span>
                                                <input class="pc-input" :value="state.editor.photonObj.name" @change="setPhotonEdit({name: $event.target.value})" />
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Blend</span>
                                                <select class="pc-select" :value="state.editor.photonObj.blend" @change="setPhotonEdit({blend: $event.target.value})">
                                                    <option value="alpha">Alpha</option>
                                                    <option value="additive">Additive</option>
                                                    <option value="opaque">Opaque</option>
                                                </select>
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Rate (/s)</span>
                                                <input class="pc-input" type="number" step="2" :value="state.editor.photonObj.emissionRatePerSec" @change="setPhotonEdit({emissionRatePerSec: Number($event.target.value)})" />
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Life (s)</span>
                                                <input class="pc-input" type="number" step="0.1" :value="state.editor.photonObj.lifeSec" @change="setPhotonEdit({lifeSec: Number($event.target.value)})" />
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Start Speed</span>
                                                <input class="pc-input" type="number" step="0.2" :value="state.editor.photonObj.startSpeed" @change="setPhotonEdit({startSpeed: Number($event.target.value)})" />
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Start Size</span>
                                                <input class="pc-input" type="number" step="0.05" :value="state.editor.photonObj.startSize" @change="setPhotonEdit({startSize: Number($event.target.value)})" />
                                            </div>
                                        </div>
                                        <div class="pc-field">
                                            <span class="pc-label">Start Color</span>
                                            <input class="pc-color-swatch" type="color" :value="state.editor.photonObj.colorHex" @input="setPhotonEdit({color: [...KilaMaterialCompiler.hexToRgb01($event.target.value), 1]})" />
                                        </div>
                                        <div class="pc-grid-2">
                                            <label class="pc-check"><input type="checkbox" :checked="state.editor.photonObj.looping" @change="setPhotonEdit({looping: $event.target.checked})" />Looping</label>
                                            <label class="pc-check"><input type="checkbox" :checked="state.editor.photonObj.localSpace" @change="setPhotonEdit({localSpace: $event.target.checked})" />Local Space</label>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <!-- KBR 3D PARTICLE VISUAL EDITOR -->
                            <template v-else-if="state.editor.format === 'kbr_3d_particle' && state.editor.kbr">
                                <div class="pc-mod">
                                    <div class="pc-mod-head"><i class="material-icons">view_in_ar</i><span class="pc-mod-title">KBR 3D Model & Physics</span></div>
                                    <div class="pc-mod-body">
                                        <div class="pc-grid-2">
                                            <div class="pc-field">
                                                <span class="pc-label">Model Variant</span>
                                                <select class="pc-select" :value="state.editor.kbr.variant" @change="setKbrEdit('variant', $event.target.value)">
                                                    <option value="geckolib">GeckoLib</option>
                                                    <option value="geometry">Vanilla Geometry</option>
                                                    <option value="poly_mesh">Poly Mesh</option>
                                                    <option value="hardcode">Hardcode</option>
                                                </select>
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Material</span>
                                                <select class="pc-select" :value="state.editor.kbr.material" @change="setKbrEdit('material', $event.target.value)">
                                                    <option value="solid">Solid</option>
                                                    <option value="cutout">Cutout</option>
                                                    <option value="cutout_mipped">Cutout Mipped</option>
                                                    <option value="translucent">Translucent</option>
                                                </select>
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Spawn Rate</span>
                                                <input class="pc-input" type="number" step="2" :value="state.editor.kbr.spawnRate" @change="setKbrEdit('spawnRate', $event.target.value)" />
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Max Lifetime</span>
                                                <input class="pc-input" type="number" step="0.1" :value="state.editor.kbr.maxLifetime" @change="setKbrEdit('maxLifetime', $event.target.value)" />
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Initial Speed</span>
                                                <input class="pc-input" type="number" step="0.2" :value="state.editor.kbr.initialSpeed" @change="setKbrEdit('initialSpeed', $event.target.value)" />
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Gravity Y</span>
                                                <input class="pc-input" type="number" step="0.5" :value="state.editor.kbr.gravity" @change="setKbrEdit('gravity', $event.target.value)" />
                                            </div>
                                        </div>
                                        <label class="pc-check"><input type="checkbox" :checked="state.editor.kbr.doubleSided" @change="setKbrEdit('doubleSided', $event.target.checked)" />Double Sided</label>
                                        <div v-if="state.editor.kbr.mismatchReason" class="pc-card missing" style="margin-top:6px;cursor:default;">
                                            <div class="pc-avatar" style="background:rgba(248,113,113,0.2);color:#fca5a5;"><i class="material-icons">warning</i></div>
                                            <div class="pc-info">
                                                <div class="pc-name" style="color:#fca5a5;">Model Variant Mismatch</div>
                                                <div class="pc-sub" style="white-space:normal;line-height:1.35;">{{ state.editor.kbr.mismatchReason }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <!-- TAB 3: Materials, KilaMaterial Composer, KilaGraph & Scene Attachments -->
                        <div v-else class="pc-body">
                            <div v-if="!state.editor || state.editor.format !== 'lumenfx_json'" class="pc-empty-box">
                                <div>{{ t('panel_mat_lumenfx_hint') }}</div>
                                <div style="margin-top:8px;">
                                    <span class="pc-action-btn" @click="openRawInspector"><i class="material-icons">code</i>{{ t('panel_ctx_raw_json') }}</span>
                                </div>
                            </div>

                            <template v-else>
                                <!-- Material Switcher -->
                                <div class="pc-pill-strip">
                                    <span v-for="mk in state.editor.materialKeys" :key="mk"
                                          class="pc-pill" :class="{active: mk === state.editor.selectedMaterialKey}"
                                          @click="selectMaterial(mk)">{{ mk }}</span>
                                    <span class="pc-tool" title="New Material" @click="addMaterial"><i class="material-icons">add</i></span>
                                    <span v-if="state.editor.materialKeys.length > 1" class="pc-tool warn" title="Delete Material" @click="deleteMaterial"><i class="material-icons">delete_outline</i></span>
                                </div>

                                <template v-if="state.editor.material">
                                    <!-- KilaGraph & GLSL Launch Bar -->
                                    <div style="display:flex;gap:4px;">
                                        <span class="pc-action-btn primary" style="flex:1;" @click="openShaderGraph">
                                            <i class="material-icons">account_tree</i><span>{{ t('panel_btn_open_kilagraph') }}</span>
                                        </span>
                                        <span class="pc-action-btn" @click="openGlslCodeEditor">
                                            <i class="material-icons">code</i><span>GLSL</span>
                                        </span>
                                    </div>

                                    <!-- Render State Module -->
                                    <div class="pc-mod">
                                        <div class="pc-mod-head" @click="toggleMod('matState')">
                                            <i class="material-icons">{{ state.openModules.matState ? 'expand_more' : 'chevron_right' }}</i>
                                            <span class="pc-mod-title">Render State · 渲染与贴图</span>
                                            <span class="pc-chip accent">{{ state.editor.material.blend }}</span>
                                        </div>
                                        <div v-if="state.openModules.matState" class="pc-mod-body">
                                            <div class="pc-grid-2">
                                                <div class="pc-field">
                                                    <span class="pc-label">Blend Mode</span>
                                                    <select class="pc-select" :value="state.editor.material.blend" @change="setMatField('blend', $event.target.value)">
                                                        <option value="alpha">Alpha</option>
                                                        <option value="additive">Additive</option>
                                                        <option value="premultiplied">Premultiplied</option>
                                                        <option value="multiply">Multiply</option>
                                                        <option value="opaque">Opaque</option>
                                                        <option value="subtract">Subtract</option>
                                                    </select>
                                                </div>
                                                <div class="pc-field">
                                                    <span class="pc-label">Emissive Scale</span>
                                                    <input class="pc-input" type="number" step="0.1" min="0" :value="state.editor.material.emissive_scale" @change="setMatField('emissive_scale', $event.target.value, 'num')" />
                                                </div>
                                            </div>
                                            <div class="pc-field">
                                                <span class="pc-label">Texture (Sampler0)</span>
                                                <div style="display:flex;gap:4px;">
                                                    <input class="pc-input" :value="state.editor.material.sampler0" @change="setMatSampler0($event.target.value)" placeholder="namespace:textures/vfx/..." />
                                                    <span class="pc-action-btn" style="height:22px;" @click="browseMatTexture" title="Pick PNG"><i class="material-icons">image</i></span>
                                                </div>
                                            </div>
                                            <div class="pc-grid-2">
                                                <label class="pc-check"><input type="checkbox" :checked="state.editor.material.hdr" @change="setMatField('hdr', $event.target.checked, 'bool')" />HDR Bloom</label>
                                                <label class="pc-check"><input type="checkbox" :checked="state.editor.material.depth_write" @change="setMatField('depth_write', $event.target.checked, 'bool')" />Depth Write</label>
                                                <label class="pc-check"><input type="checkbox" :checked="state.editor.material.cull" @change="setMatField('cull', $event.target.checked, 'bool')" />Backface Cull</label>
                                                <label class="pc-check"><input type="checkbox" :checked="state.editor.material.soft_particles" @change="setMatField('soft_particles', $event.target.checked, 'bool')" />Soft Particles</label>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- KilaMaterial Modular Composer (Real-Time GLSL Codegen!) -->
                                    <div class="pc-mod">
                                        <div class="pc-mod-head" @click="toggleMod('kilaComposer')">
                                            <i class="material-icons">{{ state.openModules.kilaComposer ? 'expand_more' : 'chevron_right' }}</i>
                                            <span class="pc-mod-title">KilaMaterial · 模块化着色器合成</span>
                                            <span v-if="state.editor.material.kila.enabled" class="pc-chip ok">ON</span>
                                        </div>
                                        <div v-if="state.openModules.kilaComposer" class="pc-mod-body">
                                            <div class="pc-grid-2">
                                                <div class="pc-field">
                                                    <span class="pc-label">Base Tint & HDR</span>
                                                    <div class="pc-color-row">
                                                        <input class="pc-color-swatch" type="color" :value="state.editor.material.kila.baseColor" @input="updateKilaModule('root', 'baseColor', $event.target.value, 'str')" />
                                                        <input class="pc-input" type="number" step="0.1" :value="state.editor.material.kila.hdrBoost" @change="updateKilaModule('root', 'hdrBoost', $event.target.value, 'num')" />
                                                    </div>
                                                </div>
                                                <div class="pc-field">
                                                    <span class="pc-label">Options</span>
                                                    <label class="pc-check" style="margin-top:3px;"><input type="checkbox" :checked="state.editor.material.kila.useTexture" @change="updateKilaModule('root', 'useTexture', $event.target.checked, 'bool')" />Multiply uTex</label>
                                                </div>
                                            </div>

                                            <!-- Kila UV Effects -->
                                            <label class="pc-check"><input type="checkbox" :checked="state.editor.material.kila.uvEffects.enabled" @change="updateKilaModule('uvEffects', 'enabled', $event.target.checked, 'bool')" /><strong>UV Effects</strong> (Twirl / Scroll / Wave)</label>
                                            <div v-if="state.editor.material.kila.uvEffects.enabled" class="pc-grid-2">
                                                <div class="pc-field"><span class="pc-label">Twirl</span><input class="pc-input" type="number" step="0.5" :value="state.editor.material.kila.uvEffects.twirl" @change="updateKilaModule('uvEffects', 'twirl', $event.target.value)" /></div>
                                                <div class="pc-field"><span class="pc-label">Scroll V</span><input class="pc-input" type="number" step="0.1" :value="state.editor.material.kila.uvEffects.scrollV" @change="updateKilaModule('uvEffects', 'scrollV', $event.target.value)" /></div>
                                            </div>

                                            <!-- Kila Distortion -->
                                            <label class="pc-check"><input type="checkbox" :checked="state.editor.material.kila.distortion.enabled" @change="updateKilaModule('distortion', 'enabled', $event.target.checked, 'bool')" /><strong>UV Distortion</strong> (Noise Flow)</label>
                                            <div v-if="state.editor.material.kila.distortion.enabled" class="pc-grid-2">
                                                <div class="pc-field"><span class="pc-label">Strength</span><input class="pc-input" type="number" step="0.02" :value="state.editor.material.kila.distortion.strength" @change="updateKilaModule('distortion', 'strength', $event.target.value)" /></div>
                                                <div class="pc-field"><span class="pc-label">Scale</span><input class="pc-input" type="number" step="0.5" :value="state.editor.material.kila.distortion.scale" @change="updateKilaModule('distortion', 'scale', $event.target.value)" /></div>
                                            </div>

                                            <!-- Kila Dissolve -->
                                            <label class="pc-check"><input type="checkbox" :checked="state.editor.material.kila.dissolve.enabled" @change="updateKilaModule('dissolve', 'enabled', $event.target.checked, 'bool')" /><strong>Dissolve</strong> (Burn Edge)</label>
                                            <div v-if="state.editor.material.kila.dissolve.enabled" class="pc-grid-2">
                                                <div class="pc-field"><span class="pc-label">Progress</span><input class="pc-input" type="number" step="0.05" min="0" max="1" :value="state.editor.material.kila.dissolve.progress" @change="updateKilaModule('dissolve', 'progress', $event.target.value)" /></div>
                                                <div class="pc-field"><span class="pc-label">Edge Color</span><input class="pc-color-swatch" type="color" :value="state.editor.material.kila.dissolve.edgeColor" @input="updateKilaModule('dissolve', 'edgeColor', $event.target.value, 'str')" /></div>
                                            </div>

                                            <!-- Kila Fresnel -->
                                            <label class="pc-check"><input type="checkbox" :checked="state.editor.material.kila.fresnel.enabled" @change="updateKilaModule('fresnel', 'enabled', $event.target.checked, 'bool')" /><strong>Fresnel</strong> (Rim Glow)</label>
                                            <div v-if="state.editor.material.kila.fresnel.enabled" class="pc-grid-2">
                                                <div class="pc-field"><span class="pc-label">Power</span><input class="pc-input" type="number" step="0.2" :value="state.editor.material.kila.fresnel.power" @change="updateKilaModule('fresnel', 'power', $event.target.value)" /></div>
                                                <div class="pc-field"><span class="pc-label">Rim Color</span><input class="pc-color-swatch" type="color" :value="state.editor.material.kila.fresnel.color" @input="updateKilaModule('fresnel', 'color', $event.target.value, 'str')" /></div>
                                            </div>

                                            <!-- Kila Ramp & Scanline -->
                                            <div class="pc-field-row">
                                                <label class="pc-check"><input type="checkbox" :checked="state.editor.material.kila.ramp.enabled" @change="updateKilaModule('ramp', 'enabled', $event.target.checked, 'bool')" /><strong>Color Ramp</strong></label>
                                                <span class="pc-action-btn" style="height:20px;font-size:10.5px;" @click="editKilaRamp">Edit Ramp</span>
                                            </div>
                                            <label class="pc-check"><input type="checkbox" :checked="state.editor.material.kila.scanline.enabled" @change="updateKilaModule('scanline', 'enabled', $event.target.checked, 'bool')" /><strong>Hologram Scanline</strong></label>
                                        </div>
                                    </div>
                                </template>

                                <!-- Scene Attachments (Lights / Volumes / Decals) -->
                                <div class="pc-mod">
                                    <div class="pc-mod-head" @click="toggleMod('attachments')">
                                        <i class="material-icons">{{ state.openModules.attachments ? 'expand_more' : 'chevron_right' }}</i>
                                        <span class="pc-mod-title">Attachments · 光源/体积雾/贴花</span>
                                        <span class="pc-chip">{{ state.editor.lights.length + state.editor.volumes.length + state.editor.decals.length }}</span>
                                    </div>
                                    <div v-if="state.openModules.attachments" class="pc-mod-body">
                                        <div style="display:flex;gap:4px;">
                                            <span class="pc-action-btn" style="flex:1;" @click="addLight">+ Light</span>
                                            <span class="pc-action-btn" style="flex:1;" @click="addVolume">+ Volume</span>
                                            <span class="pc-action-btn" style="flex:1;" @click="addDecal">+ Decal</span>
                                        </div>
                                        <div v-for="lt in state.editor.lights" :key="'l'+lt.idx" class="pc-mini-row">
                                            <span class="pc-chip accent">L</span>
                                            <input class="pc-color-swatch" style="width:20px;height:18px;" type="color" :value="lt.colorHex" @input="setLightField(lt.idx, 'color', $event.target.value)" />
                                            <input class="pc-input" type="number" step="0.5" :value="lt.radius" @change="setLightField(lt.idx, 'radius', $event.target.value)" title="Radius" />
                                            <input class="pc-input" type="number" step="0.1" :value="lt.intensity" @change="setLightField(lt.idx, 'intensity', $event.target.value)" title="Intensity" />
                                            <span class="pc-row-btn" @click="removeAttachment('lights', lt.idx)"><i class="material-icons">close</i></span>
                                        </div>
                                        <div v-for="vol in state.editor.volumes" :key="'v'+vol.idx" class="pc-mini-row">
                                            <span class="pc-chip">V</span>
                                            <input class="pc-color-swatch" style="width:20px;height:18px;" type="color" :value="vol.colorHex" @input="setVolumeField(vol.idx, 'color', $event.target.value)" />
                                            <input class="pc-input" type="number" step="0.02" :value="vol.density" @change="setVolumeField(vol.idx, 'density', $event.target.value)" title="Density" />
                                            <span class="pc-row-btn" @click="removeAttachment('volumes', vol.idx)"><i class="material-icons">close</i></span>
                                        </div>
                                        <div v-for="dec in state.editor.decals" :key="'d'+dec.idx" class="pc-mini-row">
                                            <span class="pc-chip">D</span>
                                            <span class="pc-sub" style="flex:1;">{{ dec.texture || 'ground_decal' }}</span>
                                            <span class="pc-row-btn" @click="removeAttachment('decals', dec.idx)"><i class="material-icons">close</i></span>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <!-- 24px Native Status Footer (aligned with AnimCue & PAL) -->
                        <div class="pc-footer">
                            <div class="pc-footer-left">
                                <span :title="'AnimCue: ' + (state.animCueStatus.available ? 'ON' : 'Standalone') + ' | PAL: ' + (state.palStatus.available ? 'ON' : 'Standalone')">
                                    <span class="pc-dot" :class="{on: state.missingCount === 0, warn: state.missingCount > 0}"></span>
                                    {{ state.liveParticles }}p · {{ state.compiledShaders }}sh
                                </span>
                                <span v-if="state.animCueStatus.available" class="pc-chip accent">AnimCue</span>
                                <span v-if="state.palStatus.available" class="pc-chip accent">PAL</span>
                            </div>
                            <span class="pc-chip" style="cursor:pointer;" :title="state.enhancedPreview ? t('panel_preview_enhanced') : t('panel_preview_native')" @click="onTogglePreview">
                                {{ state.enhancedPreview ? 'Unified' : 'Native' }}
                            </span>
                        </div>
                    </div>
                `
            }
        });

        const onRefreshEvent = () => refresh();
        Blockbench.on('select_project', onRefreshEvent);
        Blockbench.on('select_mode', onRefreshEvent);
        Blockbench.on('finished_edit', onRefreshEvent);
        cleanups.push(
            () => Blockbench.removeListener('select_project', onRefreshEvent),
            () => Blockbench.removeListener('select_mode', onRefreshEvent),
            () => Blockbench.removeListener('finished_edit', onRefreshEvent),
            () => {
                if (panel && typeof panel.delete === 'function') panel.delete();
                panel = null;
                vm = null;
                ParticleCueStyles.uninstall();
            }
        );

        return {
            delete() {
                while (cleanups.length) {
                    try { cleanups.pop()(); } catch (_err) {}
                }
            }
        };
    }

    return {
        register,
        refresh,
        setTab(tab) { uiState.activeTab = tab; refresh(); },
        selectAsset(assetId) { uiState.selectedAssetId = assetId; refresh(); },
        openShaderGraphForActiveMaterial
    };
})();


/* === src/ui/menus.js === */
const ParticleCueMenus = (() => {
    const cleanups = [];

    function register() {
        const ready = ParticleCueDialogs.ready;
        const guard = ParticleCueDialogs.guard;

        const addAction = (id, nameKey, icon, condition, click) => {
            const action = new Action(id, {
                name: Locale.t(nameKey),
                icon,
                condition,
                click: guard(click)
            });
            cleanups.push(() => action.delete());
            return action;
        };

        const actNewEffect = addAction('particlecue_new_effect', 'menu_new_effect', 'add_circle', ready, () => ParticleCueDialogs.openNewEffectDialog());
        const actImportEffect = addAction('particlecue_import_effect', 'menu_import_effect', 'file_open', ready, () => ParticleCueDialogs.openImportParticleFileDialog());
        const actRelink = addAction('particlecue_relink_assets', 'menu_relink', 'link', ready, () => ParticleCueDialogs.openRelinkDialog());
        const actExportZip = addAction('particlecue_export_zip', 'menu_export_zip', 'archive', ready, () => ParticleCueDialogs.openExportZipDialog());
        const actImportZip = addAction('particlecue_import_zip', 'menu_import_zip', 'unarchive', true, () => ParticleCueDialogs.openImportZipDialog());
        const actSaveEmbedded = addAction('particlecue_save_self_contained', 'menu_save_embedded', 'inventory_2', ready, () => ParticleCueDialogs.openSaveSelfContainedDialog());
        const actInspect = addAction('particlecue_inspect_assets', 'menu_inspect_assets', 'tune', ready, () => ParticleCueDialogs.openAssetInspectorDialog());
        const actKilaGraph = addAction('particlecue_open_kilagraph', 'menu_kilagraph', 'account_tree', ready, () => ParticleCuePanel.openShaderGraphForActiveMaterial());
        const actExportEmote = addAction('particlecue_export_pal_emote', 'menu_export_pal_emote', 'directions_run', ready, () => ParticleCueDialogs.openExportPalEmoteDialog());
        const actRescan = addAction('particlecue_rescan_assets', 'menu_rescan', 'refresh', ready, () => {
            AssetResolver.scanProject(Project, {notify: true});
            if (typeof Animator !== 'undefined' && Animator.open) Animator.preview();
            ParticleCuePanel.refresh();
        });

        const togglePreview = new Toggle('particlecue_enhanced_preview', {
            name: Locale.t('menu_toggle_preview'),
            icon: 'auto_awesome',
            default: true,
            onChange(value) {
                SnowstormPreview.setEnhancedEnabled(value);
                ParticleCuePanel.refresh();
            }
        });
        cleanups.push(() => togglePreview.delete());

        MenuBar.addAction(actImportZip, 'file.import');
        MenuBar.addAction(actImportEffect, 'file.import');
        MenuBar.addAction(actExportZip, 'file.export');
        MenuBar.addAction(actSaveEmbedded, 'file.export');
        MenuBar.addAction(actExportEmote, 'file.export');

        const toolsSubmenu = {
            id: 'particlecue_tools_menu',
            name: Locale.t('menu_root'),
            icon: 'auto_awesome',
            children: [
                actNewEffect,
                actImportEffect,
                actKilaGraph,
                actInspect,
                '_',
                actRelink,
                actRescan,
                '_',
                actExportZip,
                actImportZip,
                actSaveEmbedded,
                actExportEmote,
                '_',
                togglePreview
            ]
        };
        MenuBar.addAction(toolsSubmenu, 'tools');
        cleanups.push(() => {
            try { MenuBar.menus?.tools?.removeAction(toolsSubmenu); } catch (_err) {}
        });

        MenuBar.addAction(actNewEffect, 'animation');
        MenuBar.addAction(actRelink, 'animation');

        return {
            delete() {
                while (cleanups.length) {
                    try { cleanups.pop()(); } catch (_err) {}
                }
            }
        };
    }

    return {register};
})();


/* === src/entry.js === */
const cleanup = [];

Plugin.register('particlecue_studio', {
    title: 'ParticleCue Studio',
    author: 'kltyton',
    description: 'Unified Blockbench particle authoring for Snowstorm/Bedrock, LumenFX JSON, Unity/Niagara overrides, Photon .fx, and KBR 3D particles with portable project sharing and AnimCue/PAL integration.',
    icon: 'icon.png',
    tags: ['Minecraft: Java Edition', 'Minecraft: Bedrock Edition', 'Animation'],
    version: '1.0.1',
    min_version: '5.0.0',
    variant: 'desktop',
    await_loading: true,
    creation_date: '2026/11/27',
    website: 'https://github.com/kltyton/ParticleCue-Studio/wiki',
    repository: 'https://github.com/kltyton/ParticleCue-Studio',
    bug_tracker: 'https://github.com/kltyton/ParticleCue-Studio/issues',
    onload() {
        // Register all supported particle format adapters
        PhotonFxAdapter.registerFormat();
        KbrModelSchema.registerFormat();
        LumenFxSchema.registerFormat();
        SnowstormParser.registerFormat();

        // Install ecosystem bridges, preview dispatcher, and keyframe hooks
        PalBridge.installListeners();
        SnowstormPreview.installHooks();
        KeyframeStore.installHooks();
        cleanup.push(ParticleCuePanel.register());
        cleanup.push(ParticleCueMenus.register());

        // Expose structured public API for AnimCue/PAL interop and automated verification
        globalThis.ParticleCueStudio = {
            version: '1.0.1',
            Platform,
            FormatRegistry,
            SnowstormParser,
            SnowstormEditor,
            SnowstormPreview,
            LumenFxSchema,
            LumenFxPreview,
            EngineOverride,
            PhotonFxAdapter,
            KbrModelSchema,
            Kbr3dPreview,
            AnimCueBridge,
            PalBridge,
            KeyframeStore,
            AssetResolver,
            PortableZip,
            SelfContainedProject,
            KilaMaterialCompiler,
            Styles: ParticleCueStyles,
            CurveEditor: ParticleCueCurveEditor,
            GradientEditor: ParticleCueGradientEditor,
            ShaderGraphEditor: ParticleCueShaderGraphEditor,
            Dialogs: ParticleCueDialogs,
            Panel: ParticleCuePanel
        };

        if (typeof Project !== 'undefined' && Project) {
            AssetResolver.scanProject(Project, {notify: false});
            if (typeof Animator !== 'undefined' && Animator.open) {
                Animator.preview();
            }
            ParticleCuePanel.refresh();
        }
    },
    onunload() {
        for (const entry of cleanup.splice(0).reverse()) {
            try { entry.delete(); } catch (_ignore) {}
        }
        KeyframeStore.uninstallHooks();
        SnowstormPreview.uninstallHooks();
        PalBridge.uninstallListeners();
        FormatRegistry.unregister('photon_fx');
        FormatRegistry.unregister('kbr_3d_particle');
        FormatRegistry.unregister('lumenfx_json');
        FormatRegistry.unregister('bedrock_snowstorm');
        if (globalThis.ParticleCueStudio) {
            delete globalThis.ParticleCueStudio;
        }
    }
});

})(typeof requireNativeModule === "function" ? requireNativeModule : undefined, typeof require === "function" ? require : undefined);
