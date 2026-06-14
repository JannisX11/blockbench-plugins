// Orion Gradient Studio PRO - Compiled Plugin

(function() {

// --- lang.js ---
var OrionLang = {
    ru: {
        action_name: 'Градиент/Перекрас PRO',
        action_desc: 'Умное перекрашивание текстуры через кривые LCH',
        live_preview: 'Live Preview (Реал-тайм)',
        global_gradient: 'Общий градиент',
        global_gradient_desc: 'Закрашивает текстуру единым куском (от самых темных до самых светлых пикселей во всем файле), игнорируя разделение на островки.',
        batch_mode: 'Пакетное Редактирование',
        batch_mode_desc: 'Перекрасить все текстуры текущего проекта разом',
        cat1: 'ГЛОБАЛЬНЫЕ НАСТРОЙКИ',
        color_mode: 'Режим покраски',
        gradient_mode: 'Градиент',
        single_mode: 'Сплошной 1 цвет (1 Цвет)',
        colors_count_2_4: 'Цвета',
        colors_count_5_10: 'Цветов',
        colors_count_1: 'Цвет',
        cat2: 'УСТАНОВКА ЦВЕТОВ',
        btn_presets: 'МЕНЮ ПРЕСЕТОВ',
        preset_none: 'Нет (Пользовательский)',
        gradient_preview: 'Предпросмотр текущего градиента',
        btn_pick: 'Пипетка с холста',
        btn_random: 'Случайные цвета',
        btn_reverse: 'Развернуть цвета',
        btn_add: 'Добавить тон',
        btn_remove: 'Убрать тон',
        cat3: 'ТОЧЕЧНАЯ КОРРЕКЦИЯ',
        lightness: 'Светлота',
        chroma: 'Насыщенность',
        hue: 'Оттенок',
        diag_shift: 'Диагональный сдвиг',
        cat_mask: 'МАСКА ПО ЦВЕТУ',
        use_mask: 'Использовать Маску',
        use_mask_desc: 'Закрашивать только этот цвет',
        mask_color: 'Цвет Маски',
        mask_color_desc: 'Цвет на текстуре, который нужно перекрасить',
        mask_tol: 'Допуск Маски (%)',
        cat4: 'СОХРАНЕНИЕ СВОЕГО ПРЕСЕТА',
        preset_cat: 'Папка (Категория)',
        my_presets: 'Свои Пресеты',
        preset_new_cat: 'Новая Категория (Опционально)',
        preset_new_cat_ph: 'Имя новой папки',
        preset_name: 'Имя пресета',
        btn_save: 'Сохранить пресет',
        msg_saved: 'Пресет сохранён!',
        msg_no_tex_pick: 'Нет целевой текстуры для подбора цвета!',
        msg_no_targets: 'Нет целевых текстур для обработки!',
        msg_no_valid: 'Нет валидных текстур с данными для обработки.',
        msg_applied: 'Изменения применены к',
        msg_textures: 'текстуре(ам)!',
        msg_err_import: 'Ошибка импорта',
        msg_reversed: 'Цвета инвертированы!',
        msg_removed: 'Цвет удалён!',
        msg_random: 'Случайные цвета сгенерированы!',
        msg_added: 'Цвет добавлен!',
        cat_nature: 'Природа',
        cat_fire: 'Огонь',
        cat_water: 'Вода и Лед',
        cat_magic: 'Магия',
        cat_ghost: 'Призрачные',
        cat_metal: 'Металл',
        cat_dark: 'Тьма',
        cat_dragon: 'Драконьи Цвета',
        cat_space: 'Космос',
        cat_cyberpunk: 'Киберпанк',
        cat_gems: 'Драгоценности',
        cat_organic: 'Органика',
                cat_other: 'Разное',
        cat_color_setup: 'НАСТРОЙКА ЦВЕТОВ',
        lbl_main_color: 'Основной Цвет',
        lbl_tone: 'Тон',
        lbl_tone_shadow: 'Тон 1 (Глубокая Тень)',
        lbl_tone_highlight: ' (Яркий Блик)',
        lbl_tone_base: ' (Основа)',
        btn_add_color: 'Добавить',
        btn_remove_color: 'Удалить',
        btn_reverse_colors: 'Перевернуть',
        btn_auto_shades: 'Оттенки из Основы',
        btn_reverse_colors_title: 'Поменять порядок цветов на обратный',
        btn_auto_shades_title: 'Построить равномерные оттенки от среднего тона (Основы)',
        cat_global_shifts: 'ОБЩИЕ СДВИГИ (HSL / OKLCH)',
        lbl_shift_l: 'Сдвиг Яркости (L)',
        lbl_shift_c: 'Сдвиг Насыщенности (C)',
        lbl_shift_h: 'Сдвиг Оттенка (Hue)',
        lbl_shift_diag: 'Диагональный Сдвиг',
        desc_shift_diag: 'Смещение контраста: >0 делает тени глубже, а блики ярче. <0 смягчает градиент к среднему тону.',
        cat_smart_mask: 'УМНАЯ МАСКА (Опционально)',
        lbl_replace_color: 'Заменяемый Цвет',
        btn_pick_model: 'Взять пипеткой с модели',

        btn_open_lib: 'Открыть библиотеку пресетов',
        btn_apply: 'Применить',
        btn_delete: 'Удалить',
        btn_export: 'Экспорт своих пресетов',
        btn_import: 'Импорт пресетов',
        msg_deleted: 'Пресет удалён:',
        msg_no_export: 'Нет своих пресетов для экспорта',
        msg_err_export: 'Ошибка экспорта:',
        msg_imported: 'Импортировано пресетов:'
    },
    en: {
        action_name: 'Gradient/Recolor PRO',
        action_desc: 'Smart texture recoloring via LCH curves',
        live_preview: 'Live Preview',
        global_gradient: 'Global Gradient',
        global_gradient_desc: 'Paints the texture as a single piece (from darkest to lightest pixels overall), ignoring isolated islands.',
        batch_mode: 'Batch Editing',
        batch_mode_desc: 'Recolor all textures in the current project at once',
        cat1: 'GLOBAL SETTINGS',
        color_mode: 'Color Mode',
        gradient_mode: 'Gradient',
        single_mode: 'Solid Color (1 Color)',
        colors_count_2_4: 'Colors',
        colors_count_5_10: 'Colors',
        colors_count_1: 'Color',
        cat2: 'COLOR SETUP',
        btn_presets: 'PRESETS MENU',
        preset_none: 'None (Custom)',
        gradient_preview: 'Current gradient preview',
        btn_pick: 'Pick from canvas',
        btn_random: 'Random Colors',
        btn_reverse: 'Reverse Colors',
        btn_add: 'Add Shade',
        btn_remove: 'Remove Shade',
        cat3: 'FINE ADJUSTMENTS',
        lightness: 'Lightness',
        chroma: 'Saturation',
        hue: 'Hue',
        diag_shift: 'Diagonal Shift',
        cat_mask: 'COLOR MASK',
        use_mask: 'Use Mask',
        use_mask_desc: 'Recolor only this specific color',
        mask_color: 'Mask Color',
        mask_color_desc: 'Target color on the texture to replace',
        mask_tol: 'Mask Tolerance (%)',
        cat4: 'SAVE CUSTOM PRESET',
        preset_cat: 'Folder (Category)',
        my_presets: 'My Presets',
        preset_new_cat: 'New Category (Optional)',
        preset_new_cat_ph: 'New folder name',
        preset_name: 'Preset Name',
        btn_save: 'Save Preset',
        msg_saved: 'Preset saved!',
        msg_no_tex_pick: 'No target texture to pick color from!',
        msg_no_targets: 'No target textures to process!',
        msg_no_valid: 'No valid textures with data found.',
        msg_applied: 'Changes applied to',
        msg_textures: 'texture(s)!',
        msg_err_import: 'Import error',
        msg_reversed: 'Colors reversed!',
        msg_removed: 'Color removed!',
        msg_random: 'Random colors generated!',
        msg_added: 'Color added!',
        cat_nature: 'Nature',
        cat_fire: 'Fire',
        cat_water: 'Water & Ice',
        cat_magic: 'Magic',
        cat_ghost: 'Ghostly',
        cat_metal: 'Metal',
        cat_dark: 'Darkness',
        cat_dragon: 'Dragon Colors',
        cat_space: 'Space',
        cat_cyberpunk: 'Cyberpunk',
        cat_gems: 'Gems & Jewels',
        cat_organic: 'Organic & Flesh',
                cat_other: 'Misc',
        cat_color_setup: 'COLOR SETUP',
        lbl_main_color: 'Main Color',
        lbl_tone: 'Shade',
        lbl_tone_shadow: 'Shade 1 (Deep Shadow)',
        lbl_tone_highlight: ' (Bright Highlight)',
        lbl_tone_base: ' (Base)',
        btn_add_color: 'Add',
        btn_remove_color: 'Remove',
        btn_reverse_colors: 'Reverse',
        btn_auto_shades: 'Shades from Base',
        btn_reverse_colors_title: 'Reverse the order of colors',
        btn_auto_shades_title: 'Generate even shades from the middle tone (Base)',
        cat_global_shifts: 'GLOBAL SHIFTS (HSL / OKLCH)',
        lbl_shift_l: 'Lightness Shift (L)',
        lbl_shift_c: 'Saturation Shift (C)',
        lbl_shift_h: 'Hue Shift',
        lbl_shift_diag: 'Diagonal Shift',
        desc_shift_diag: 'Contrast shift: >0 makes shadows deeper and highlights brighter. <0 softens the gradient towards the midtone.',
        cat_smart_mask: 'SMART MASK (Optional)',
        lbl_replace_color: 'Target Color',
        btn_pick_model: 'Pick from model',

        btn_open_lib: 'Open Preset Library',
        btn_apply: 'Apply',
        btn_delete: 'Delete',
        btn_export: 'Export My Presets',
        btn_import: 'Import Presets',
        msg_deleted: 'Preset deleted:',
        msg_no_export: 'No custom presets to export',
        msg_err_export: 'Export error:',
        msg_imported: 'Presets imported:'
    }
};

function _t(key) {
    var lang = (window.Language && window.Language.code) ? window.Language.code : 'en';
    if (lang.startsWith('ru')) {
        return OrionLang.ru[key] || OrionLang.en[key] || key;
    }
    return OrionLang.en[key] || key;
}

// --- math.js ---
// math.js - Цветовая математика и функции преобразования

function srgbToLinear(val) { 
    if (isNaN(val)) return 0;
    return (val <= 0.04045) ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4); 
}
function linearToSrgb(val) {
    if (isNaN(val)) return 0;
    if (val < 0) val = 0; if (val > 1) val = 1;
    return (val <= 0.0031308) ? 12.92 * val : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
}
function cbrt(x) { 
    if (isNaN(x)) return 0;
    return Math.sign(x) * Math.pow(Math.abs(x), 1/3); 
}

function srgbToOklab(r, g, b) {
    var lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
    var l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
    var m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
    var s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
    var l_ = cbrt(l), m_ = cbrt(m), s_ = cbrt(s);
    return {
        L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
        a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
        b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    };
}

function oklabToSrgb(L, a, b) {
    var l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    var m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    var s_ = L - 0.0894841775 * a - 1.2914855480 * b;
    var l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;
    var lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    var lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    var lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
    return { r: linearToSrgb(lr), g: linearToSrgb(lg), b: linearToSrgb(lb) };
}

function srgbToOklch(r, g, b) {
    var ok = srgbToOklab(r, g, b);
    return { L: ok.L, C: Math.sqrt(ok.a * ok.a + ok.b * ok.b), h: Math.atan2(ok.b, ok.a) };
}

function oklchToSrgb(L, C, h) { return oklabToSrgb(L, C * Math.cos(h), C * Math.sin(h)); }

function hexToOklch(hex) {
    var rgb = hexToRgb(hex);
    return srgbToOklch(rgb.r, rgb.g, rgb.b);
}

function lerpHue(h1, h2, t) {
    if (isNaN(h1)) h1 = 0; if (isNaN(h2)) h2 = 0;
    var delta = h2 - h1;
    delta = (((delta + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
    return h1 + delta * t;
}

function extractColorHex(v, defaultHex) {
    // Всегда lowercase: пресеты с верхним регистром иначе «не равны»
    // тем же цветам из формы (tinycolor отдаёт нижний регистр)
    if (!v) return defaultHex;
    if (typeof v === 'string') return (v.startsWith('#') ? v : '#' + v).toLowerCase();
    if (typeof v === 'object' && typeof v.toHexString === 'function') return v.toHexString().toLowerCase();
    return defaultHex;
}

function hexToRgb(hex) {
    if (typeof hex !== 'string') return {r:0, g:0, b:0};
    var short = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    if (short) {
        return {
            r: parseInt(short[1] + short[1], 16)/255,
            g: parseInt(short[2] + short[2], 16)/255,
            b: parseInt(short[3] + short[3], 16)/255
        };
    }
    var match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
    if (!match) return {r:0, g:0, b:0};
    return { r: parseInt(match[1], 16)/255, g: parseInt(match[2], 16)/255, b: parseInt(match[3], 16)/255 };
}

function rgbToHex(rgb) {
    var to2 = function(v) {
        v = Math.round(Math.max(0, Math.min(1, v)) * 255);
        return v.toString(16).padStart(2, '0');
    };
    return '#' + to2(rgb.r) + to2(rgb.g) + to2(rgb.b);
}

function hexToHsv(hex) {
    var rgb = hexToRgb(hex);
    var max = Math.max(rgb.r, rgb.g, rgb.b), min = Math.min(rgb.r, rgb.g, rgb.b);
    var h = 0, s = 0, v = max;
    var d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max !== min) {
        switch (max) {
            case rgb.r: h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0); break;
            case rgb.g: h = (rgb.b - rgb.r) / d + 2; break;
            case rgb.b: h = (rgb.r - rgb.g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

function hsvToHex(hsv) {
    var r, g, b;
    var i = Math.floor(hsv.h * 6);
    var f = hsv.h * 6 - i;
    var p = hsv.v * (1 - hsv.s);
    var q = hsv.v * (1 - f * hsv.s);
    var t = hsv.v * (1 - (1 - f) * hsv.s);
    switch (i % 6) {
        case 0: r = hsv.v, g = t, b = p; break;
        case 1: r = q, g = hsv.v, b = p; break;
        case 2: r = p, g = hsv.v, b = t; break;
        case 3: r = p, g = q, b = hsv.v; break;
        case 4: r = t, g = p, b = hsv.v; break;
        case 5: r = hsv.v, g = p, b = q; break;
    }
    var hr = Math.round(r * 255).toString(16).padStart(2, '0');
    var hg = Math.round(g * 255).toString(16).padStart(2, '0');
    var hb = Math.round(b * 255).toString(16).padStart(2, '0');
    return '#' + hr + hg + hb;
}

function applyDiagonalShift(hexColor, shift) {
    if (!shift || shift === 0) return hexColor;
    var hsv = hexToHsv(hexColor);
    var amount = shift / 100.0;
    
    if (amount > 0) {
        hsv.s += amount;
        hsv.v -= amount;
        if (hsv.s > 1.0) { var overflow = hsv.s - 1.0; hsv.s = 1.0; hsv.v -= overflow; }
        if (hsv.v < 0) hsv.v = 0;
    } else {
        amount = Math.abs(amount);
        hsv.s -= amount;
        hsv.v += amount;
        if (hsv.s < 0) { var overflow = Math.abs(hsv.s); hsv.s = 0; hsv.v += overflow; }
        if (hsv.v > 1.0) hsv.v = 1.0;
    }
    hsv.s = Math.max(0, Math.min(1, hsv.s));
    hsv.v = Math.max(0, Math.min(1, hsv.v));
    return hsvToHex(hsv);
}


// --- presets.js ---
// presets.js - Библиотека пресетов

var internalPresets = {
    'none': { colors: ['#000000', '#1c1c1c', '#393939', '#555555', '#727272', '#8e8e8e', '#aaaaaa', '#c7c7c7', '#e3e3e3', '#ffffff'] },

    '🔥 Магма': { colors: ['#1a0000', '#3c0000', '#5e0000', '#800000', '#a20000', '#bb1700', '#cc4400', '#dd7100', '#ee9f00', '#ffcc00'] },
    '🔥 Токсин': { colors: ['#0a1a00', '#134200', '#1c6900', '#259100', '#2eb800', '#44d211', '#66dd33', '#88e855', '#aaf477', '#ccff99'] },
    '🔥 Пустота': { colors: ['#0f0f14', '#1a0c2c', '#250844', '#30055c', '#3b0274', '#55008e', '#8000aa', '#aa00c7', '#d500e3', '#ff00ff'] },
    '🔥 Закат': { colors: ['#1a0500', '#4d1300', '#802100', '#b32f00', '#e63d00', '#ff5100', '#ff6c00', '#ff8600', '#ffa100', '#ffbb00'] },
    '🔥 Призрак': { colors: ['#051412', '#04372c', '#035b46', '#027e5f', '#01a179', '#14bb8e', '#3ccc9d', '#63ddad', '#8beebc', '#b3ffcc'] },
    '🔥 Рассвет': { colors: ['#1a0b14', '#4d142a', '#801d40', '#b32656', '#e62f6c', '#ff447b', '#ff6682', '#ff888a', '#ffaa91', '#ffcc99'] },
    '🔥 Шторм': { colors: ['#000a1a', '#0a1a3c', '#132a5e', '#1d3a80', '#264aa2', '#3760bb', '#507bcc', '#6896dd', '#81b1ee', '#99ccff'] },
    '🔥 Энергия': { colors: ['#141400', '#373700', '#5b5b00', '#7e7e00', '#a1a100', '#bbbb14', '#cccc3c', '#dddd63', '#eeee8b', '#ffffb3'] },
    '🔥 Синее Пламя': { colors: ['#00051a', '#001342', '#002169', '#002f91', '#003db8', '#1153d2', '#3371dd', '#5590e8', '#77aef4', '#99ccff'] },
    '🔥 Пепельный Огонь': { colors: ['#1a1818', '#3c2013', '#5e280d', '#803008', '#a23803', '#bb460b', '#cc5b22', '#dd7039', '#ee844f', '#ff9966'] },
    '🔥 Взрыв': { colors: ['#2e0a00', '#5c1700', '#8b2400', '#b93100', '#e83e00', '#ff591c', '#ff8255', '#ffac8e', '#ffd5c6', '#ffffff'] },
    '🔥 Адское Пламя': { colors: ['#1a000d', '#42001c', '#69002c', '#91003b', '#b8004a', '#d20b5b', '#dd226d', '#e8397f', '#f44f91', '#ff66a3'] },
    '🔥 Искра': { colors: ['#1a1100', '#472f00', '#754d00', '#a26c00', '#cf8a00', '#e9a211', '#eeb533', '#f4c855', '#f9db77', '#ffee99'] },

    '🌿 Органика': { colors: ['#0a1400', '#192c00', '#284400', '#375c00', '#467400', '#588e0b', '#6faa22', '#86c739', '#9ce34f', '#b3ff66'] },
    '🌿 Сухая Трава': { colors: ['#1a1800', '#3c3600', '#5e5400', '#807300', '#a29100', '#bbab14', '#ccc03c', '#ddd563', '#eeea8b', '#ffffb3'] },
    '🌿 Осенний Лес': { colors: ['#1f0a00', '#451700', '#6c2400', '#923100', '#b93e00', '#d24d06', '#dd6011', '#e8731c', '#f48628', '#ff9933'] },
    '🌿 Ядовитый Плющ': { colors: ['#051f0f', '#044019', '#036123', '#02822d', '#01a337', '#0bbb46', '#22cc5b', '#39dd70', '#4fee84', '#66ff99'] },
    '🌿 Глубокий Лес': { colors: ['#001a08', '#002b0e', '#003c14', '#004d19', '#005e1f', '#09772d', '#1a9944', '#2bbb5b', '#3cdd71', '#4dff88'] },
    '🌿 Морская Капуста': { colors: ['#051a14', '#0b3125', '#114736', '#175e47', '#1d7558', '#2c8e6c', '#43aa84', '#5ac79c', '#71e3b4', '#88ffcc'] },
    '🌿 Папоротник': { colors: ['#0a2605', '#0f3c0b', '#155312', '#1a6918', '#1f801f', '#2f972f', '#49b049', '#64c964', '#7ee27e', '#98fb98'] },
    '🌿 Лоза': { colors: ['#111a00', '#253408', '#394e10', '#4d6717', '#61811f', '#769934', '#8daf57', '#a3c47a', '#bada9d', '#d0f0c0'] },
    '🌿 Дремучий Бор': { colors: ['#0a1a0f', '#0f2b19', '#133c23', '#184d2e', '#1d5e38', '#2a7148', '#41885e', '#589f73', '#6eb589', '#85cc9f'] },
    '🌿 Хвоя': { colors: ['#051412', '#0b2b25', '#114138', '#16584b', '#1c6f5e', '#2a8573', '#419c89', '#58b3a0', '#6ec9b6', '#85e0cc'] },
    '🌿 Сухой Лист': { colors: ['#1a130a', '#312311', '#473218', '#5e421f', '#755126', '#8a6335', '#9e774b', '#b18b60', '#c59f76', '#d9b38c'] },
    '🌿 Токсичная Поросль': { colors: ['#0a1a00', '#214700', '#397500', '#50a200', '#67cf00', '#7de911', '#91ee33', '#a4f455', '#b8f977', '#ccff99'] },
    '🌿 Утренний Луг': { colors: ['#0f1f0a', '#224015', '#366120', '#49822b', '#5ca336', '#71b946', '#88c45b', '#9fcf70', '#b5db84', '#cce699'] },

    '💧 Чистая Вода': { colors: ['#001333', '#002555', '#003877', '#004a99', '#005dbb', '#1174d2', '#3391dd', '#55ade8', '#77caf4', '#99e6ff'] },
    '💧 Глубокий Океан': { colors: ['#00081a', '#001236', '#001b52', '#00256f', '#002e8b', '#063ca4', '#114fbb', '#1c62d2', '#2875e8', '#3388ff'] },
    '💧 Тропики': { colors: ['#001f2b', '#003a4f', '#005573', '#007096', '#008bba', '#0ba4d2', '#22bbdd', '#39d2e8', '#4fe8f4', '#66ffff'] },
    '💧 Болото': { colors: ['#0a140a', '#132613', '#1c381c', '#254b25', '#2e5d2e', '#3c713c', '#4f884f', '#629f62', '#75b575', '#88cc88'] },
    '💧 Ледник': { colors: ['#001a33', '#113960', '#22588e', '#3377bb', '#4496e8', '#5eb0ff', '#80c4ff', '#a2d7ff', '#c4ebff', '#e6ffff'] },
    '💧 Кровь': { colors: ['#1a0000', '#360000', '#520000', '#6f0000', '#8b0000', '#a40909', '#bb1a1a', '#d22b2b', '#e83c3c', '#ff4d4d'] },
    '💧 Нефть': { colors: ['#050505', '#0a0a0a', '#0e0e0e', '#131313', '#181818', '#202020', '#2b2b2b', '#363636', '#424242', '#4d4d4d'] },
    '💧 Лазурит': { colors: ['#00041a', '#000b42', '#001169', '#001891', '#001fb8', '#0b2dd2', '#2244dd', '#395be8', '#4f71f4', '#6688ff'] },
    '💧 Глубоководье': { colors: ['#000814', '#001432', '#00204f', '#002b6d', '#00378a', '#0645a4', '#1155bb', '#1c65d2', '#2875e8', '#3385ff'] },
    '💧 Бирюзовая Волна': { colors: ['#001a1a', '#003c3c', '#005e5e', '#008080', '#00a2a2', '#11bbbb', '#33cccc', '#55dddd', '#77eeee', '#99ffff'] },
    '💧 Мутная Река': { colors: ['#14140a', '#262613', '#38381c', '#4b4b25', '#5d5d2e', '#6f6f3d', '#808051', '#919164', '#a2a278', '#b3b38c'] },
    '💧 Подводный Свет': { colors: ['#001429', '#00264d', '#003871', '#004b96', '#005dba', '#1177d2', '#3399dd', '#55bbe8', '#77ddf4', '#99ffff'] },
    '💧 Замерзшее Озеро': { colors: ['#051a2e', '#15355c', '#25508b', '#356bb9', '#4586e8', '#5e9eff', '#80b3ff', '#a2c8ff', '#c4ddff', '#e6f2ff'] },

    '✨ Магия Света': { colors: ['#1a1a00', '#474700', '#757500', '#a2a200', '#cfcf00', '#e9e91c', '#eeee55', '#f4f48e', '#f9f9c6', '#ffffff'] },
    '✨ Магия Тьмы': { colors: ['#05001a', '#0f0036', '#190052', '#24006f', '#2e008b', '#410ba4', '#5e22bb', '#7a39d2', '#974fe8', '#b366ff'] },
    '✨ Чародейство': { colors: ['#14001a', '#2e0042', '#480069', '#610091', '#7b00b8', '#9511d2', '#b033dd', '#ca55e8', '#e577f4', '#ff99ff'] },
    '✨ Некромантия': { colors: ['#0a1a05', '#19360f', '#285219', '#376f24', '#468b2e', '#5ba441', '#77bb5e', '#94d27a', '#b0e897', '#ccffb3'] },
    '✨ Иллюзия': { colors: ['#001a1a', '#004242', '#006969', '#009191', '#00b8b8', '#11d2d2', '#33dddd', '#55e8e8', '#77f4f4', '#99ffff'] },
    '✨ Огонь Душ': { colors: ['#00141a', '#002e42', '#004869', '#006191', '#007bb8', '#1495d2', '#3cb0dd', '#63cae8', '#8be5f4', '#b3ffff'] },
    '✨ Звездная Пыль': { colors: ['#0a0a2b', '#19195a', '#282889', '#3737b8', '#4646e7', '#5e5eff', '#8080ff', '#a2a2ff', '#c4c4ff', '#e6e6ff'] },
    '✨ Эфир': { colors: ['#00122b', '#00305a', '#004e89', '#006cb8', '#008ae7', '#17a4ff', '#44bbff', '#71d2ff', '#9fe8ff', '#ccffff'] },
    '✨ Рунический Свет': { colors: ['#001429', '#003259', '#004f88', '#006db8', '#008ae7', '#1ca4ff', '#55bbff', '#8ed2ff', '#c6e8ff', '#ffffff'] },
    '✨ Тайная Магия': { colors: ['#140029', '#290053', '#3e007d', '#5300a7', '#6800d1', '#7e11e9', '#9533ee', '#ac55f4', '#c277f9', '#d999ff'] },
    '✨ Призыв Тьмы': { colors: ['#0a0014', '#16002c', '#220044', '#2e005c', '#3a0074', '#4d0b8e', '#6622aa', '#8039c7', '#994fe3', '#b366ff'] },
    '✨ Светлое Исцеление': { colors: ['#141a05', '#2f470f', '#497519', '#64a224', '#7fcf2e', '#97e944', '#aeee66', '#c5f488', '#dbf9aa', '#f2ffcc'] },
    '✨ Магический Кристалл': { colors: ['#001a1a', '#004242', '#006969', '#009191', '#00b8b8', '#17d2d2', '#44dddd', '#71e8e8', '#9ff4f4', '#ccffff'] },

    '🌆 Киберпанк': { colors: ['#05001a', '#3d0031', '#740047', '#ac005e', '#e30075', '#e31c8e', '#aa55aa', '#718ec7', '#39c6e3', '#00ffff'] },
    '🌆 Неон': { colors: ['#001a0a', '#004d16', '#008022', '#00b32e', '#00e63a', '#17ff50', '#44ff6f', '#71ff8e', '#9fffad', '#ccffcc'] },
    '🌆 Ретровейв': { colors: ['#1a001a', '#36004d', '#520080', '#6f00b3', '#8b00e6', '#a40bf7', '#bb22e6', '#d239d5', '#e84fc4', '#ff66b3'] },
    '🌆 Синтвейв': { colors: ['#180026', '#38004d', '#580073', '#78009a', '#9800c1', '#b200ce', '#c500c2', '#d800b5', '#ec00a9', '#ff009d'] },
    '🌆 Перегрузка': { colors: ['#1a0d00', '#4d1d00', '#802d00', '#b33d00', '#e64d00', '#ff6800', '#ff8e00', '#ffb300', '#ffd900', '#ffff00'] },
    '🌆 Нейросеть': { colors: ['#00132b', '#002c5a', '#004589', '#005eb8', '#0077e7', '#0092f9', '#00adee', '#00c8e3', '#00e4d7', '#00ffcc'] },
    '🌆 Кибер-Самурай': { colors: ['#120005', '#360011', '#5a001d', '#7d0029', '#a10035', '#bb0340', '#cc0949', '#dd0e53', '#ee145c', '#ff1a66'] },
    '🌆 Цифровой Дождь': { colors: ['#001405', '#004311', '#00711e', '#00a02a', '#00cf37', '#14e94d', '#3cee6d', '#63f48c', '#8bf9ac', '#b3ffcc'] },
    '🌆 Синдикат': { colors: ['#1a000d', '#47001b', '#750029', '#a20037', '#cf0045', '#e9145a', '#ee3c77', '#f46393', '#f98bb0', '#ffb3cc'] },
    '🌆 Неоновый Закат': { colors: ['#1a0514', '#4d0f3d', '#801966', '#b3248f', '#e62eb8', '#ff44c1', '#ff66aa', '#ff8893', '#ffaa7d', '#ffcc66'] },
    '🌆 Токсичный Город': { colors: ['#0f1a00', '#2e4700', '#4c7500', '#6ba200', '#8acf00', '#a4e90b', '#bbee22', '#d2f439', '#e8f94f', '#ffff66'] },
    '🌆 Корпорация': { colors: ['#050a1a', '#0f1e4d', '#193380', '#2447b3', '#2e5ce6', '#4477ff', '#6699ff', '#88bbff', '#aaddff', '#ccffff'] },

    '⚙️ Старая Бронза': { colors: ['#1c1510', '#3b2b1d', '#5a412b', '#795838', '#986e45', '#b28455', '#c59a66', '#d8af77', '#ecc588', '#ffdb99'] },
    '⚙️ Ржавое Железо': { colors: ['#210e05', '#38190a', '#50240f', '#672f14', '#7e3a19', '#944821', '#a9582b', '#be6736', '#d37740', '#e8874a'] },
    '⚙️ Холодная Сталь': { colors: ['#13161a', '#22282e', '#313a42', '#404b57', '#4f5d6b', '#607081', '#748598', '#889aaf', '#9cafc7', '#b0c4de'] },
    '⚙️ Темное Золото': { colors: ['#261b00', '#403000', '#594500', '#735a00', '#8c6f00', '#a48509', '#bb9a1a', '#d2b02b', '#e8c53c', '#ffdb4d'] },
    '⚙️ Медь': { colors: ['#240d04', '#451e0f', '#672f1a', '#884025', '#a95130', '#c26441', '#d17958', '#e08d6f', '#f0a285', '#ffb69c'] },
    '⚙️ Черная Сталь': { colors: ['#05070a', '#0e1116', '#161c23', '#1f262f', '#28313c', '#343f4b', '#44505d', '#546170', '#647282', '#748394'] },
    '⚙️ Титан': { colors: ['#0d1014', '#1b1f25', '#292f36', '#383e47', '#464d58', '#575f6a', '#6a727d', '#7d8590', '#9098a2', '#a3abb5'] },
    '⚙️ Расплавленный Металл': { colors: ['#1a0500', '#4d1300', '#802100', '#b32f00', '#e63d00', '#ff5600', '#ff7a00', '#ff9e00', '#ffc200', '#ffe600'] },
    '⚙️ Потускневшее Серебро': { colors: ['#111517', '#272e31', '#3e474b', '#546065', '#6b797f', '#808e95', '#94a1a8', '#a7b4bb', '#bbc7cd', '#cfdae0'] },
    '⚙️ Ржавая Медь': { colors: ['#1a0a05', '#36160a', '#52220e', '#6f2e13', '#8b3a18', '#a44822', '#bb5933', '#d26a44', '#e87b55', '#ff8c66'] },
    '⚙️ Вороненая Сталь': { colors: ['#050a14', '#0f192c', '#192844', '#24375c', '#2e4674', '#3d588a', '#516d9e', '#6482b1', '#7898c5', '#8cadd9'] },
    '⚙️ Светлое Золото': { colors: ['#1a1600', '#423900', '#695c00', '#917f00', '#b8a200', '#d2bb14', '#ddcc3c', '#e8dd63', '#f4ee8b', '#ffffb3'] },
    '⚙️ Свинец': { colors: ['#0a0c0f', '#191d22', '#282e36', '#373f49', '#46505c', '#576371', '#6a7888', '#7d8c9f', '#90a1b5', '#a3b5cc'] },
    '⚙️ Полированная Бронза': { colors: ['#1a110a', '#3c2819', '#5e4028', '#805737', '#a26e46', '#bb8558', '#cc9a6f', '#ddaf86', '#eec49c', '#ffd9b3'] },

    '🌑 Бездна': { colors: ['#050505', '#0a0a0c', '#0e0e13', '#13131a', '#181821', '#1e1e2a', '#272736', '#2f2f41', '#38384d', '#404059'] },
    '🌑 Пепел': { colors: ['#121212', '#1e1e1e', '#2b2b2b', '#373737', '#444444', '#535353', '#646464', '#767676', '#878787', '#999999'] },
    '🌑 Кровавый Бархат': { colors: ['#170000', '#260000', '#340000', '#430000', '#520000', '#630000', '#770000', '#8b0000', '#9f0000', '#b30000'] },
    '🌑 Затмение': { colors: ['#000000', '#090610', '#130c21', '#1c1131', '#251742', '#35215b', '#4a307e', '#5f3fa1', '#754dc3', '#8a5ce6'] },
    '🌑 Кошмар': { colors: ['#080005', '#12000b', '#1c0012', '#270018', '#31001f', '#3d0027', '#4c0031', '#5b003b', '#690045', '#78004f'] },
    '🌑 Мрак': { colors: ['#020305', '#06080b', '#090c11', '#0d1118', '#10161e', '#151c27', '#1c2532', '#232e3d', '#293649', '#303f54'] },
    '🌑 Кровавая Ночь': { colors: ['#0d0000', '#180000', '#240000', '#2f0000', '#3a0000', '#4d0000', '#660000', '#800000', '#990000', '#b30000'] },
    '🌑 Звездное Небо': { colors: ['#020012', '#06041a', '#0a0823', '#0d0b2b', '#110f34', '#1d1b44', '#302e5d', '#434176', '#57558f', '#6a68a8'] },
    '🌑 Забвение': { colors: ['#000000', '#040406', '#09090c', '#0d0d11', '#121217', '#191920', '#23232b', '#2c2c36', '#363642', '#40404d'] },
    '🌑 Глубокая Тень': { colors: ['#030005', '#08000d', '#0d0015', '#12001d', '#170025', '#200330', '#2b093d', '#360e4b', '#421458', '#4d1a66'] },
    '🌑 Подземелье': { colors: ['#0a0a0a', '#131313', '#1c1c1c', '#252525', '#2e2e2e', '#3c3c3c', '#4d4d4d', '#5e5e5e', '#6f6f6f', '#808080'] },
    '🌑 Багровый Мрак': { colors: ['#0f0000', '#1d0000', '#2b0000', '#380000', '#460000', '#580303', '#6f0909', '#860e0e', '#9c1414', '#b31a1a'] },
    '🌑 Ночной Ужас': { colors: ['#050a0a', '#0a1313', '#0e1c1c', '#132525', '#182e2e', '#203c3c', '#2b4d4d', '#365e5e', '#426f6f', '#4d8080'] },

    '💎 Рубин': { colors: ['#240005', '#43010b', '#620210', '#810316', '#a0041b', '#b90f28', '#ca223b', '#dc354e', '#ed4962', '#ff5c75'] },
    '💎 Изумруд': { colors: ['#00210e', '#01411c', '#02612a', '#038037', '#04a045', '#0db854', '#1cc765', '#2bd676', '#3be686', '#4af597'] },
    '💎 Сапфир': { colors: ['#010526', '#050f44', '#0a1962', '#0e2280', '#132c9e', '#1e3cb5', '#3153c5', '#446ad5', '#5780e5', '#6a97f5'] },
    '💎 Аметист': { colors: ['#1a0026', '#2f0646', '#440c66', '#591185', '#6e17a5', '#8426bd', '#993ece', '#ae55de', '#c36def', '#d885ff'] },
    '💎 Обсидиан': { colors: ['#040008', '#0c0512', '#130a1c', '#1b0f27', '#221431', '#2d1c3f', '#3b2652', '#4a2f65', '#583977', '#66438a'] },
    '💎 Топаз': { colors: ['#00142b', '#00264f', '#003873', '#004b96', '#005dba', '#0b70d2', '#2285dd', '#3999e8', '#4faef4', '#66c2ff'] },
    '💎 Опал': { colors: ['#120b17', '#2e1d3d', '#492f63', '#654189', '#8053af', '#9b66c5', '#b479ca', '#cd8ccf', '#e6a0d4', '#ffb3d9'] },
    '💎 Алмаз': { colors: ['#061726', '#203b54', '#3a5f82', '#5382b0', '#6da6de', '#89c0f6', '#a6d0f8', '#c4dffb', '#e1effd', '#ffffff'] },
    '💎 Янтарь': { colors: ['#241000', '#441e00', '#642b00', '#833900', '#a34600', '#bb5806', '#cc6d11', '#dd821c', '#ee9828', '#ffad33'] },
    '💎 Малахит': { colors: ['#001a0a', '#003c19', '#005e28', '#008037', '#00a246', '#0bbb58', '#22cc6d', '#39dd82', '#4fee98', '#66ffad'] },
    '💎 Жемчуг': { colors: ['#141414', '#343434', '#555555', '#757575', '#969696', '#b0b0b0', '#c4c4c4', '#d7d7d7', '#ebebeb', '#ffffff'] },
    '💎 Кварц': { colors: ['#14001a', '#371742', '#5b2d69', '#7e4491', '#a15bb8', '#bb73d2', '#cc8cdd', '#dda6e8', '#eebff4', '#ffd9ff'] },
    '💎 Оникс': { colors: ['#050505', '#0d0d0d', '#151515', '#1d1d1d', '#252525', '#313131', '#424242', '#525252', '#636363', '#737373'] },
    '💎 Цитрин': { colors: ['#1a1600', '#473c00', '#756300', '#a28900', '#cfb000', '#e9ca14', '#eed73c', '#f4e463', '#f9f28b', '#ffffb3'] },

    '🥩 Свежее Мясо': { colors: ['#33080c', '#510e14', '#6f141c', '#8d1a24', '#ab202c', '#c22e3b', '#d14551', '#e05c67', '#f0737d', '#ff8a93'] },
    '🥩 Гниющая Плоть': { colors: ['#1f1a16', '#312720', '#42352a', '#544234', '#654f3e', '#75624b', '#837b5a', '#919369', '#9fac79', '#adc488'] },
    '🥩 Хитин Жука': { colors: ['#0a0a0f', '#181421', '#261e32', '#342844', '#423255', '#504065', '#5f5173', '#6e6280', '#7c738e', '#8b849c'] },
    '🥩 Венозная Кровь': { colors: ['#1a0005', '#290009', '#38000d', '#470012', '#560016', '#69001b', '#7e0022', '#930028', '#a8002f', '#bd0035'] },
    '🥩 Ядовитая Слизь': { colors: ['#0c1a00', '#1a3600', '#295200', '#376f00', '#468b00', '#58a407', '#6fbb15', '#86d224', '#9ce832', '#b3ff40'] },
    '🥩 Глаз Дракона': { colors: ['#140000', '#370000', '#5b0000', '#7e0000', '#a10000', '#bb1700', '#cc4400', '#dd7100', '#ee9f00', '#ffcc00'] },
    '🥩 Древняя Кость': { colors: ['#1f1e1b', '#37352e', '#4f4c41', '#666354', '#7e7a67', '#948f7b', '#a9a38f', '#bdb7a4', '#d2cbb8', '#e6dfcc'] },
    '🥩 Мертвая Ткань': { colors: ['#141114', '#292129', '#3e313e', '#534153', '#685168', '#7d637d', '#917791', '#a48ba4', '#b89fb8', '#ccb3cc'] },
    '🥩 Сухожилие': { colors: ['#1a120d', '#3c2a1e', '#5e432f', '#805b40', '#a27451', '#bb8863', '#cc9977', '#ddaa8b', '#eebb9f', '#ffccb3'] },
    '🥩 Мутация': { colors: ['#0a1a0f', '#164225', '#22693b', '#2e9152', '#3ab868', '#4ad27c', '#5edd8d', '#71e89f', '#85f4b0', '#99ffc2'] },
    '🥩 Паразит': { colors: ['#1a0005', '#42000d', '#690015', '#91001d', '#b80025', '#d20e35', '#dd2b4e', '#e84767', '#f46480', '#ff8099'] },
    '🥩 Кислотный Ожог': { colors: ['#141a00', '#2f4700', '#497500', '#64a200', '#7fcf00', '#96e911', '#aaee33', '#bef455', '#d2f977', '#e6ff99'] },

    '🌀 Черная Дыра': { colors: ['#000000', '#030303', '#060606', '#090909', '#0c0c0c', '#282828', '#5e5e5e', '#939393', '#c9c9c9', '#ffffff'] },
    '🌀 Призрачное Сияние': { colors: ['#02120e', '#072d22', '#0b4736', '#106249', '#157d5d', '#2b9776', '#53b193', '#7ccbb0', '#a4e5ce', '#ccffeb'] },
    '🌀 Пустота': { colors: ['#080014', '#100023', '#180033', '#1f0042', '#270051', '#2a0152', '#280344', '#250436', '#230628', '#21081a'] },
    '🌀 Астрал': { colors: ['#0e0421', '#180a34', '#221048', '#2b175b', '#351d6e', '#453084', '#5b4f9d', '#716fb6', '#878ecf', '#9daee8'] },
    '🌀 Квантовый Разлом': { colors: ['#0b001a', '#18003c', '#24005e', '#310080', '#3e00a2', '#3c1cbb', '#2d55cc', '#1e8edd', '#0fc6ee', '#00ffff'] },
    '🌀 Искажение Времени': { colors: ['#111400', '#262c00', '#3a4400', '#4f5c00', '#647400', '#798e00', '#8faa00', '#a4c700', '#bae300', '#d0ff00'] },
    '🌀 Эхо Бездны': { colors: ['#020814', '#05132a', '#081e3f', '#0b2955', '#0e346a', '#154384', '#1f57a3', '#296cc2', '#3380e0', '#3d94ff'] },
    '🌀 Раскол Пространства': { colors: ['#0d0014', '#43002e', '#790048', '#ae0061', '#e4007b', '#ff1579', '#ff3e5b', '#ff683c', '#ff911e', '#ffbb00'] },
    '🌀 Туманность': { colors: ['#0a001a', '#1e0042', '#330069', '#470091', '#5c00b8', '#710bd2', '#8822dd', '#9f39e8', '#b54ff4', '#cc66ff'] },
    '🌀 Сверхновая': { colors: ['#1a0f00', '#4d2b00', '#804700', '#b36200', '#e67e00', '#ff991c', '#ffb255', '#ffcc8e', '#ffe5c6', '#ffffff'] },
    '🌀 Пульсар': { colors: ['#00081a', '#00194d', '#002a80', '#003bb3', '#004ce6', '#1168ff', '#338eff', '#55b3ff', '#77d9ff', '#99ffff'] },
    '🌀 Инопланетный Свет': { colors: ['#051a0f', '#044222', '#036936', '#029149', '#01b85c', '#11d271', '#33dd88', '#55e89f', '#77f4b5', '#99ffcc'] },
    '🌀 Темная Материя': { colors: ['#000000', '#040008', '#08000f', '#0b0017', '#0f001e', '#17002d', '#220044', '#2d005b', '#390071', '#440088'] },

    '🐉 Багровый Дракон': { colors: ['#2e0404', '#4e0707', '#6e0b0b', '#8d0e0e', '#ad1111', '#c42323', '#d34343', '#e26363', '#f08383', '#ffa3a3'] },
    '🐉 Ледяной Змей': { colors: ['#041c38', '#0c345f', '#144c85', '#1d64ac', '#257cd3', '#3893e9', '#57aaee', '#76c1f4', '#94d7f9', '#b3eeff'] },
    '🐉 Изумрудный Дракон': { colors: ['#062912', '#0b471e', '#10652a', '#158337', '#1aa143', '#29b955', '#42ca6d', '#5bdc85', '#75ed9d', '#8effb5'] },
    '🐉 Золотой Виверн': { colors: ['#362400', '#593e00', '#7c5900', '#9f7300', '#c28e00', '#d9a40f', '#e2b72c', '#ecca4a', '#f5dd67', '#fff085'] },
    '🐉 Черный Ужас': { colors: ['#050508', '#0d0d12', '#15151c', '#1e1e27', '#262631', '#30303e', '#3d3d4d', '#49495c', '#56566b', '#62627a'] },
    '🐉 Аметистовый Дракон': { colors: ['#190033', '#320855', '#4a0f77', '#631799', '#7c1ebb', '#922fd2', '#a74add', '#bc64e8', '#d17ff4', '#e699ff'] },
    '🐉 Костяной Дракон': { colors: ['#1a1815', '#3d3931', '#60594c', '#837a68', '#a69b83', '#c0b39a', '#d0c4ab', '#dfd5bd', '#efe5ce', '#fff6e0'] },
    '🐉 Грозовой Дракон': { colors: ['#03173d', '#0e295d', '#183a7d', '#234c9c', '#2e5dbc', '#4a77c4', '#7799b3', '#a4bba2', '#d2dd91', '#ffff80'] },
    '🐉 Ядовитая Гидра': { colors: ['#101f03', '#213a07', '#32550b', '#43700e', '#548b12', '#68a41c', '#81bb2d', '#9ad23d', '#b3e84e', '#ccff5e'] },
    '🐉 Бронзовый Дракон': { colors: ['#241408', '#40240e', '#5c3314', '#79431b', '#955221', '#ad6530', '#c27c47', '#d6925e', '#eba975', '#ffbf8c'] },
    '🐉 Небесный Дракон': { colors: ['#15325c', '#254a77', '#356192', '#4479ad', '#5490c8', '#6ea6d2', '#92baca', '#b7cdc3', '#dbe1bb', '#fff5b3'] },
    '🐉 Пустынный Змей': { colors: ['#361b0d', '#563018', '#764424', '#97592f', '#b76e3a', '#cd834a', '#da9a5e', '#e6b071', '#f3c785', '#ffdd99'] },
    '🐉 Пепельный Виверн': { colors: ['#1a1a1a', '#222222', '#2b2a2a', '#333131', '#3c3939', '#553f36', '#804229', '#aa461b', '#d5490e', '#ff4d00'] },
    '🐉 Дракон Джунглей': { colors: ['#002924', '#053f34', '#0a5444', '#0f6a53', '#147f63', '#2b975f', '#54b147', '#7dcb30', '#a7e518', '#d0ff00'] },
    '🐉 Кристальный Дракон': { colors: ['#1d0b36', '#2d3663', '#3d618f', '#4e8cbc', '#5eb7e9', '#77d2ff', '#99ddff', '#bbe8ff', '#ddf4ff', '#ffffff'] },
    '🐉 Морской Левиафан': { colors: ['#001126', '#002c3c', '#004753', '#006269', '#007d80', '#139894', '#38b2a6', '#5dcbb9', '#83e5cb', '#a8ffdd'] },
    '🐉 Лавовый Червь': { colors: ['#1a0505', '#360804', '#520a03', '#6f0d02', '#8b1001', '#a41f00', '#bb3a00', '#d25500', '#e87100', '#ff8c00'] },
    '🐉 Искаженный Дрейк': { colors: ['#180024', '#250338', '#31074d', '#3e0a61', '#4b0d76', '#641388', '#8b1b99', '#b223aa', '#d82bbb', '#ff33cc'] },
    '🐉 Солнечный Дракон': { colors: ['#331100', '#5b2f00', '#834d00', '#aa6c00', '#d28a00', '#e9a41c', '#eebb55', '#f4d28e', '#f9e8c6', '#ffffff'] },
    '🐉 Теневой Дракон': { colors: ['#000000', '#060608', '#0c0c10', '#111118', '#171720', '#292d3c', '#48526d', '#66779e', '#859dce', '#a3c2ff'] },
    '🐉 Призрачный Виверн': { colors: ['#081c15', '#17382d', '#255545', '#34715c', '#438e74', '#5ba78e', '#7cbdaa', '#9dd3c7', '#bfe9e3', '#e0ffff'] },
    '🐉 Хаос-Дракон': { colors: ['#2b001a', '#400428', '#550837', '#6a0b45', '#7f0f54', '#97236a', '#b14789', '#cb6ba8', '#e58fc7', '#ffb3e6'] },
    '🐉 Болотный Дракон': { colors: ['#1a180c', '#292614', '#38351c', '#474323', '#56522b', '#696535', '#7f7e42', '#96974e', '#acb05b', '#c2c967'] },
    '🐉 Магнитный Дракон': { colors: ['#001a33', '#171455', '#2d0e77', '#440999', '#5b03bb', '#7706bb', '#991199', '#bb1c77', '#dd2855', '#ff3333'] },

    '🐉 D&D Красный (Red)': { colors: ['#230000', '#4A0202', '#730505', '#960A0A', '#B30F0F', '#D32F2F', '#EF5350', '#FF7373', '#FF9E9E', '#FFCDCD'] },
    '🐉 D&D Синий (Blue)': { colors: ['#020B14', '#051C33', '#0A3154', '#0F4C81', '#1D6BB0', '#3182C4', '#4A90E2', '#74AEEF', '#A1C9F7', '#D1E6FC'] },
    '🐉 D&D Зеленый (Green)': { colors: ['#030F07', '#0A2411', '#113B1B', '#174D24', '#1E592F', '#2E7D42', '#4EAB65', '#74C486', '#A1DBB0', '#D0F2D9'] },
    '🐉 D&D Черный (Black)': { colors: ['#050505', '#0A0A0B', '#121214', '#1C1C1E', '#2C2C2E', '#3A3A3C', '#4A4A4A', '#636366', '#8E8E93', '#AEAEB2'] },
    '🐉 D&D Белый (White)': { colors: ['#475569', '#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0', '#F1F5F9', '#F8FAFC', '#FFFFFF', '#E0F2FE', '#BAE6FD'] },
    '🐉 D&D Коричневый (Brown)': { colors: ['#3e2723', '#482f2a', '#533730', '#5d4037', '#68483e', '#795a50', '#90776e', '#a8938c', '#bfb0aa', '#d7ccc8'] },
    '🐉 D&D Пурпурный (Purple)': { colors: ['#2a0845', '#380c58', '#46106b', '#55157e', '#631991', '#771fa5', '#9127ba', '#ac30d0', '#c638e5', '#e040fb'] },
    '🐉 D&D Серый (Gray)': { colors: ['#263238', '#303f47', '#3a4d55', '#455a64', '#4f6773', '#5e7782', '#738993', '#879aa4', '#9cacb4', '#b0bec5'] },
    '🐉 D&D Желтый (Yellow)': { colors: ['#3A2E0C', '#544312', '#735C18', '#91741E', '#B39025', '#D4AF37', '#E5C158', '#FFE57F', '#FFF1B3', '#FFF9DB'] },
    '🐉 D&D Оранжевый (Orange)': { colors: ['#361600', '#542200', '#6E2C00', '#913A00', '#B34700', '#D35400', '#E67E22', '#F39C12', '#FFA07A', '#FFD3B6'] },
    '🐉 D&D Розовый (Pink)': { colors: ['#3B131A', '#541C25', '#702733', '#8A3A4A', '#A84E60', '#D46A7F', '#E3889B', '#FFB7C5', '#FFD1DC', '#FFE4E9'] },
    '🐉 D&D Золотой (Gold)': { colors: ['#403000', '#5C4500', '#735700', '#8A6900', '#A88100', '#C49A00', '#D4AF37', '#E6C65B', '#FFF3A8', '#FFFFE0'] },
    '🐉 D&D Серебряный (Silver)': { colors: ['#3A444C', '#4F5B66', '#65737E', '#7B8B99', '#A2B1C2', '#C0C0C0', '#D3D3D3', '#E6E6E6', '#F5F5F5', '#FFFFFF'] },
    '🐉 D&D Бронзовый (Bronze)': { colors: ['#2E1C0A', '#42290E', '#5E3A14', '#754919', '#915B1F', '#AD6D26', '#CD7F32', '#DC9656', '#E6A875', '#F3CDAD'] },
    '🐉 D&D Медный (Copper)': { colors: ['#2B1706', '#42230A', '#5C310D', '#784011', '#945015', '#B1611A', '#B87333', '#CD8F54', '#E0A96D', '#F2D5B6'] },
    '🐉 D&D Латунный (Brass)': { colors: ['#2E2A11', '#423C18', '#595221', '#706729', '#8A7E33', '#A1933B', '#B5A642', '#CCBF60', '#E1D796', '#F0EAC2'] },
    '🐉 D&D Стальной (Steel)': { colors: ['#1E2022', '#2A2D30', '#3A3E41', '#4B5054', '#5C6267', '#71797E', '#8A9398', '#A3ACB2', '#B0C4DE', '#D1DAE6'] },
    '🐉 D&D Ртутный (Mercury)': { colors: ['#3F464D', '#545E66', '#6B7780', '#7F8C8D', '#9BB1B3', '#BDC3C7', '#E5E4E2', '#ECF0F1', '#F8F9FA', '#FFFFFF'] },
    '🐉 D&D Железный (Iron)': { colors: ['#121314', '#1A1B1C', '#242526', '#303236', '#3A3D42', '#43464B', '#575B61', '#6C7178', '#808588', '#9DA3AA'] },
    '🐉 D&D Хромовый (Chrome)': { colors: ['#292A2C', '#3A3C3E', '#444648', '#535456', '#6A6C6F', '#828487', '#A8A9AD', '#C4C5C9', '#ECEFF1', '#FFFFFF'] },
    '🐉 D&D Кобальтовый (Cobalt)': { colors: ['#000E24', '#001A42', '#002763', '#00378A', '#0047AB', '#1F65CF', '#4282EB', '#6495ED', '#91B5F2', '#C2D7F7'] },
    '🐉 D&D Никелевый (Nickel)': { colors: ['#202120', '#2E302E', '#3C3E3C', '#444644', '#545754', '#626662', '#727472', '#8E918E', '#A9A9A9', '#C8CCC8'] },
    '🐉 D&D Титановый (Titanium)': { colors: ['#2C2E2D', '#3D403F', '#4A4F4E', '#5C6261', '#707876', '#8A9492', '#A6B0AE', '#C0C9C7', '#D1D4D2', '#F4F6F6'] },
    '🐉 D&D Электрумовый (Electrum)': { colors: ['#363010', '#4D4416', '#6B5E1F', '#857526', '#A18E2E', '#BDA637', '#CFB53B', '#DEC862', '#EAD890', '#F5ECBE'] },
    '🐉 D&D Платиновый (Platinum)': { colors: ['#333B42', '#46515A', '#5A6873', '#6C7A89', '#8494A3', '#A2B4C2', '#B9CAD6', '#D2DEE6', '#E5E4E2', '#FDFEFE'] },
    '🐉 D&D Аметистовый (Amethyst)': { colors: ['#1F0038', '#33005C', '#4B0082', '#6200A8', '#7B1FA2', '#9966CC', '#B084E3', '#C5A3F0', '#D6B4FC', '#EAD6FF'] },
    '🐉 D&D Сапфировый (Sapphire)': { colors: ['#000D1A', '#002147', '#003366', '#004080', '#0A4BB5', '#0F52BA', '#3B7CE6', '#73C2FB', '#A6DCFF', '#D4F0FF'] },
    '🐉 D&D Изумрудный (Emerald)': { colors: ['#021F0A', '#053812', '#0B6623', '#0F8231', '#149E3E', '#2BB656', '#50C878', '#7EE09D', '#A9F9BF', '#D4FFE1'] },
    '🐉 D&D Топазовый (Topaz)': { colors: ['#4A3000', '#6E4700', '#915E00', '#B37400', '#D48A00', '#F2A104', '#FFC87C', '#FFE0B2', '#FFE5B4', '#FFF3E0'] },
    '🐉 D&D Кристальный (Crystal)': { colors: ['#4DD0E1', '#26C6DA', '#00BCD4', '#00ACC1', '#80DEEA', '#B2EBF2', '#E0F7FA', '#F0FDFD', '#F9FFFF', '#FFFFFF'] },
    '🐉 D&D Обсидиановый (Obsidian)': { colors: ['#010101', '#050505', '#0A0A0A', '#101010', '#151515', '#1F1F1F', '#2A2A2A', '#3A3A3A', '#505050', '#6E6E6E'] },
    '🐉 D&D Янтарный (Amber)': { colors: ['#423200', '#664D00', '#8A6800', '#997300', '#CC9900', '#E6B800', '#FFBF00', '#FFD633', '#FFE066', '#FFF0B3'] },
    '🐉 D&D Яцинтовый (Jacinth)': { colors: ['#2E0800', '#470C00', '#5D1000', '#801A00', '#A62400', '#CC3904', '#E65100', '#FF7518', '#FF9E40', '#FFC48C'] },
    '🐉 D&D Нефритовый (Jade)': { colors: ['#002418', '#003825', '#004B32', '#006E4A', '#008A5C', '#00A86B', '#26C28B', '#66FFB2', '#99FFCC', '#CCFFE6'] },
    '🐉 D&D Жемчужный (Pearl)': { colors: ['#474235', '#6B634F', '#8F846B', '#B3A586', '#C2B280', '#D1C7A5', '#E0DCB9', '#F0EAD6', '#F7F5E6', '#FFFFFF'] },
    '🐉 D&D Рубиновый (Ruby)': { colors: ['#360416', '#520621', '#70082E', '#940B3D', '#B80E4C', '#E0115F', '#F04685', '#FF6699', '#FFA3C2', '#FFE0EB'] },
    '🐉 D&D Лунный камень (Moonstone)': { colors: ['#1A252C', '#28353E', '#3A4B56', '#4B5E6B', '#5C7280', '#708090', '#8BA0B0', '#A7BCCF', '#C5D7E8', '#E6F2FF'] },
    '🐉 D&D Теневой (Shadow)': { colors: ['#030406', '#0B0C10', '#14171A', '#1F2833', '#212121', '#333333', '#45A29E', '#66FCF1', '#A1FAFA', '#D8FFFF'] },
    '🐉 D&D Адамантиновый (Adamantine)': { colors: ['#0F1717', '#182424', '#1C2833', '#253434', '#2F4F4F', '#3F6363', '#517878', '#566573', '#778899', '#A0B2C6'] },
    '🐉 D&D Астральный (Astral)': { colors: ['#0A192F', '#172A45', '#233554', '#2962FF', '#306EFF', '#5387FF', '#7FB3D5', '#A5C7F7', '#E3F2FD', '#FFFFFF'] },
    '🐉 D&D Боевой (Battle)': { colors: ['#240008', '#38000C', '#4A0011', '#660017', '#800020', '#A30029', '#C2185B', '#E91E63', '#F06292', '#F8BBD0'] },
    '🐉 D&D Сияющий (Radiant)': { colors: ['#5D4037', '#8D6E63', '#FBC02D', '#FDD835', '#FEE082', '#FFF59D', '#FFF9C4', '#FFFDE7', '#FFFFF0', '#FFFFFF'] },
    '🐉 D&D Стигийский (Styx)': { colors: ['#05080A', '#0B1317', '#121E24', '#1A252C', '#273742', '#354A59', '#435D70', '#4F6F80', '#6F8FA1', '#99B9CC'] },
    '🐉 D&D Воющий (Howling)': { colors: ['#13191C', '#1C2327', '#263238', '#37474F', '#455A64', '#546E7A', '#78909C', '#90A4AE', '#B0BEC5', '#CFD8DC'] },
    '🐉 D&D Пирокластический (Pyroclastic)': { colors: ['#0F0000', '#1B0000', '#2D0B00', '#3E2723', '#4E342E', '#D84315', '#FF3D00', '#FF6E40', '#FF9E80', '#FFCCBC'] },
    '🐉 D&D Ржавый (Rust)': { colors: ['#2E1004', '#421706', '#5C2008', '#7A2B0A', '#99360D', '#B7410E', '#CD5C5C', '#D27D2D', '#E5A65D', '#F3D2A9'] },
    '🐉 D&D Миражный (Mirage)': { colors: ['#21092B', '#350F45', '#4A235A', '#63327A', '#7D3C98', '#8E44AD', '#AF7AC5', '#D7BDE2', '#F4D03F', '#F9E79F'] },
    '🐉 D&D Солнечный (Sun)': { colors: ['#422A05', '#5E3C07', '#7E5109', '#9E660C', '#C27D10', '#D98C14', '#F39C12', '#F5B041', '#FFF176', '#FFF9C4'] },
    '🐉 D&D Лунный (Moon)': { colors: ['#1F2A38', '#2C3E50', '#34495E', '#566573', '#7F8C8D', '#95A5A6', '#BDC3C7', '#ECF0F1', '#F2F4F4', '#FFFFFF'] },
    '🐉 D&D Звездный (Stellar)': { colors: ['#0d47a1', '#103f99', '#133791', '#162f8a', '#192782', '#2e358a', '#5759a2', '#807cb9', '#a8a0d1', '#d1c4e9'] },
    '🐉 D&D Тянь Лун (T\'ien Lung)': { colors: ['#fbc02d', '#fccb3d', '#fdd64d', '#fee15e', '#ffec6e', '#fff385', '#fff6a4', '#fff9c2', '#fffce1', '#ffffff'] },
    '🐉 D&D Шэнь Лун (Shen Lung)': { colors: ['#00241E', '#003B31', '#004D40', '#00695C', '#00897B', '#4DB6AC', '#80CBC4', '#B2DFDB', '#E0F2F1', '#F2FBF9'] },
    '🐉 D&D Пань Лун (Pan Lung)': { colors: ['#2E0800', '#470C00', '#5D1000', '#8A1C00', '#B32700', '#D83700', '#E64A19', '#FF7043', '#FFCC80', '#FFE0B2'] },
    '🐉 D&D Цзян Лун (Chiang Lung)': { colors: ['#002A4A', '#013B66', '#014C85', '#01579B', '#0277BD', '#0288D1', '#039BE5', '#29B6F6', '#B3E5FC', '#E1F5FE'] },
    '🐉 D&D Лун Ван (Lung Wang)': { colors: ['#001A1C', '#00292B', '#00363A', '#004D40', '#004D52', '#006064', '#00838F', '#00ACC1', '#E0F7FA', '#F2FCFD'] },
    '🐉 D&D Тунь Ми Лун (Tun Mi Lung)': { colors: ['#151B1E', '#212121', '#263238', '#37474F', '#4F5D65', '#607D8B', '#78909C', '#90A4AE', '#B0BEC5', '#ECEFF1'] },
    '🐉 D&D Юй Лун (Yu Lung)': { colors: ['#5E1D0B', '#802B14', '#A63B1E', '#CC4C29', '#D84315', '#E65100', '#FF7043', '#FF8A65', '#FFCCBC', '#FFE0B2'] },
    '🐉 D&D Ли Лун (Li Lung)': { colors: ['#2B1D19', '#3E2A24', '#4E342E', '#5D4037', '#6D4C41', '#7D5748', '#8D6E63', '#A1887F', '#D7CCC8', '#EFEBE9'] },
    '🐉 D&D Призматический (Prismatic)': { colors: ['#311B92', '#4A148C', '#7B1FA2', '#9C27B0', '#E91E63', '#FF1744', '#FF9100', '#FFEA00', '#00E5FF', '#00E676'] },
    '🐉 D&D Дракон Силы (Force)': { colors: ['#0D47A1', '#1565C0', '#1976D2', '#1E88E5', '#2196F3', '#42A5F5', '#64B5F6', '#90CAF9', '#BBDEFB', '#FFFFFF'] },
    '🐉 D&D Дракон Времени (Time)': { colors: ['#263238', '#37474F', '#455A64', '#78909C', '#90A4AE', '#B0BEC5', '#CFD8DC', '#ECEFF1', '#FFD700', '#FFF59D'] },
    '🐉 D&D Песенный (Song)': { colors: ['#0A1128', '#101F42', '#1A237E', '#283593', '#3F51B5', '#5C6BC0', '#7986CB', '#9FA8DA', '#C5CAE9', '#E8EAF6'] },
    '🐉 D&D Туманный (Mist)': { colors: ['#37474F', '#455A64', '#546E7A', '#78909C', '#90A4AE', '#B0BEC5', '#CFD8DC', '#ECEFF1', '#F5F5F5', '#FFFFFF'] }
};

// Восстанавливает цвет из хранилища: hex-строка, tinycolor-объект
// или его JSON-останки ({_r,_g,_b} от старых версий плагина).
function normalizeStoredColor(c) {
    if (typeof c === 'string' && c.length > 0) return (c.startsWith('#') ? c : '#' + c).toLowerCase();
    if (c && typeof c === 'object') {
        if (typeof c.toHexString === 'function') return c.toHexString();
        if (typeof c._r === 'number' && typeof c._g === 'number' && typeof c._b === 'number') {
            return rgbToHex({ r: c._r / 255, g: c._g / 255, b: c._b / 255 });
        }
    }
    return null;
}

function sanitizeCustomPresets(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
    var clean = {};
    for (var name in raw) {
        var p = raw[name];
        if (!p || typeof p !== 'object') continue;
        var srcColors = Array.isArray(p.colors) ? p.colors
            : [p.shadow, p.mid, p.high]; // старый формат пресета
        var colors = srcColors.map(normalizeStoredColor).filter(Boolean);
        if (colors.length === 0) continue;
        clean[name] = {
            colors: colors,
            category: (typeof p.category === 'string' && p.category) ? p.category : 'Свои Пресеты'
        };
    }
    return clean;
}

var customPresets = {};
try {
    var p = localStorage.getItem('gradient_studio_presets');
    if (p) customPresets = sanitizeCustomPresets(JSON.parse(p));
} catch(e) {}


// --- processing.js ---
// processing.js - Чистое вычислительное ядро (без DOM и Blockbench API)
//
// ВАЖНО: функции этого файла сериализуются в Web Worker через Function.toString()
// (см. core.js), поэтому здесь нельзя замыкаться на внешние переменные (кроме
// функций math.js и переменной ORION_LINEAR_LUT, которые тоже попадают в воркер)
// и нельзя трогать DOM / Blockbench / tinycolor. Только аргументы и Math.
//
// Оптимизации битово-точные: LUT покрывает квантованные входы k/255, OKLab
// считается один раз на пиксель вместо четырёх. Любое изменение здесь обязано
// проходить scripts/parity_test.js (побайтовое сравнение с эталоном).

var ORION_LINEAR_LUT = null;

// LUT для srgbToLinear: входы пикселей всегда кратны 1/255, поэтому таблица
// из 256 значений даёт в точности те же double, что и прямой вызов
function getOrionLinearLUT() {
    if (ORION_LINEAR_LUT === null) {
        ORION_LINEAR_LUT = new Float64Array(256);
        for (var k = 0; k < 256; k++) {
            ORION_LINEAR_LUT[k] = srgbToLinear(k / 255);
        }
    }
    return ORION_LINEAR_LUT;
}

// OKLab напрямую из байтов через LUT; пишет L,a,b в out[o..o+2].
// Битово идентично srgbToOklab(r8/255, g8/255, b8/255).
function oklabFromBytes(lut, r8, g8, b8, out, o) {
    var lr = lut[r8], lg = lut[g8], lb = lut[b8];
    var l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
    var m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
    var s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
    var l_ = cbrt(l), m_ = cbrt(m), s_ = cbrt(s);
    out[o]   = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
    out[o+1] = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
    out[o+2] = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
}

// Полный конвейер обработки одной текстуры: доминирующий цвет (для режима
// «Сплошной»), гистограмма светлоты с отсечкой перцентилей, поиск «островков»
// итеративным BFS (8-связность) и перекраска в OKLCH.
// src — Uint8ClampedArray (RGBA), возвращает новый Uint8ClampedArray.
function orionProcessPixels(src, width, height, P) {
    var isSingleMode = P.isSingleMode;
    var targetOklchs = P.targetOklchs;
    var targetOklch = targetOklchs[0]; // для режима «Сплошной»
    var useMask = P.useMask;
    var maskL = P.maskOklab.L, maskA = P.maskOklab.a, maskB = P.maskOklab.b;
    var maxDeltaE = P.maxDeltaE;

    var lut = getOrionLinearLUT();
    var np = width * height;

    var dst = new Uint8ClampedArray(src.length);
    dst.set(src);

    // --- Доминирующий цвет как «база» для режима «Сплошной» ---
    var baseOklch = {L: 0.5, C: 0, h: 0};
    if (isSingleMode) {
        var colorCounts = new Map();
        var maxCount = 0;
        var baseR = 1, baseG = 1, baseB = 1;

        for (var i = 0; i < src.length; i += 4) {
            if (src[i+3] === 0) continue;
            var key = (src[i] << 16) | (src[i+1] << 8) | src[i+2];
            var count = (colorCounts.get(key) || 0) + 1;
            colorCounts.set(key, count);
            if (count > maxCount) {
                maxCount = count;
                baseR = src[i]/255;
                baseG = src[i+1]/255;
                baseB = src[i+2]/255;
            }
        }
        baseOklch = srgbToOklch(baseR, baseG, baseB);
    }

    // Кэш OKLab (3 double на пиксель, считаем один раз вместо ~4):
    // на гигантских текстурах не кэшируем, а пересчитываем через LUT —
    // оба пути битово идентичны
    var useCache = np <= 4194304; // ≤ 2048×2048 (~100 МБ кэша)
    var okCache = useCache ? new Float64Array(np * 3) : null;
    var tmpOk = new Float64Array(3);

    var globalHistRaw = new Uint32Array(100);
    var willProcess = new Uint8Array(np);

    for (var idx = 0; idx < np; idx++) {
        var i = idx * 4;
        if (src[i+3] > 0) {
            var okArr, oo;
            if (useCache) { okArr = okCache; oo = idx * 3; }
            else { okArr = tmpOk; oo = 0; }
            oklabFromBytes(lut, src[i], src[i+1], src[i+2], okArr, oo);
            var okLv = okArr[oo];

            var processPixel = true;
            if (useMask) {
                var dL = okLv - maskL;
                var da = okArr[oo+1] - maskA;
                var db = okArr[oo+2] - maskB;
                var deltaE = Math.sqrt(dL*dL + da*da + db*db);
                if (deltaE > maxDeltaE) processPixel = false;
            }
            if (processPixel) {
                willProcess[idx] = 1;
                if (okLv > 0.02 && okLv < 0.98) {
                    var bin = Math.floor(okLv * 100);
                    if (bin >= 100) bin = 99; if (bin < 0) bin = 0;
                    globalHistRaw[bin]++;
                }
            }
        }
    }

    var globalTotal = 0;
    for (var j=0; j<100; j++) globalTotal += globalHistRaw[j];
    var globalMinL = 0, globalMaxL = 1;
    if (globalTotal > 0) {
        var sum = 0;
        for (var j=0; j<100; j++) { sum += globalHistRaw[j]; if (sum >= globalTotal * 0.02) { globalMinL = j/100.0; break; } }
        sum = 0;
        for (var j=99; j>=0; j--) { sum += globalHistRaw[j]; if (sum >= globalTotal * 0.02) { globalMaxL = j/100.0; break; } }
        if (globalMaxL <= globalMinL) { globalMinL = 0; globalMaxL = 1; }
    }

    // Поиск «островков» — итеративный BFS с явной очередью.
    // Сознательно НЕ рекурсия: на больших текстурах рекурсивный flood-fill
    // переполняет стек вызовов.
    var visited = new Uint8Array(np);
    var islands = [];
    var q = new Uint32Array(np);

    if (P.globalGradient) {
        var tail = 0;
        for (var idx = 0; idx < np; idx++) {
            if (willProcess[idx] === 1) q[tail++] = idx;
        }
        if (tail > 0) islands.push(q.slice(0, tail));
    } else {
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var startIdx = y * width + x;
            if (willProcess[startIdx] === 1 && visited[startIdx] === 0) {
                var head = 0;
                var tail = 0;
                q[tail++] = startIdx;
                visited[startIdx] = 1;

                while (head < tail) {
                    var curr = q[head++];
                    var cx = curr % width;
                    var cy = (curr / width) | 0;

                    for (var dy = -1; dy <= 1; dy++) {
                        for (var dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            var nx = cx + dx, ny = cy + dy;
                            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                var nIdx = ny * width + nx;
                                if (willProcess[nIdx] === 1 && visited[nIdx] === 0) {
                                    visited[nIdx] = 1;
                                    q[tail++] = nIdx;
                                }
                            }
                        }
                    }
                }
                islands.push(q.slice(0, tail));
            }
        }
    }
    }

    var localHist = new Uint32Array(100);

    for (var isl = 0; isl < islands.length; isl++) {
        var island = islands[isl];

        localHist.fill(0);
        var localTotal = 0;
        for (var p = 0; p < island.length; p++) {
            var idx = island[p];
            var okArr, oo;
            if (useCache) { okArr = okCache; oo = idx * 3; }
            else {
                okArr = tmpOk; oo = 0;
                var i = idx * 4;
                oklabFromBytes(lut, src[i], src[i+1], src[i+2], okArr, oo);
            }
            var Lv = okArr[oo];
            if (Lv > 0.02 && Lv < 0.98) {
                var bin = Math.floor(Lv * 100);
                if (bin >= 100) bin = 99; if (bin < 0) bin = 0;
                localHist[bin]++;
                localTotal++;
            }
        }

        var islandMinL = globalMinL, islandMaxL = globalMaxL;

        if (localTotal > 0) {
            var sum = 0, tempMin = 0, tempMax = 1;
            for (var j=0; j<100; j++) { sum += localHist[j]; if (sum >= localTotal * 0.02) { tempMin = j/100.0; break; } }
            sum = 0;
            for (var j=99; j>=0; j--) { sum += localHist[j]; if (sum >= localTotal * 0.02) { tempMax = j/100.0; break; } }
            if (tempMax <= tempMin) { tempMin = 0; tempMax = 1; }

            var islandRange = tempMax - tempMin;
            var blendFactor = 1.0;
            if (island.length < 16) blendFactor = 0.0;
            else if (islandRange < 0.05) blendFactor = 0.0;
            else if (islandRange < 0.10) blendFactor = (islandRange - 0.05) / 0.05;

            islandMinL = globalMinL * (1.0 - blendFactor) + tempMin * blendFactor;
            islandMaxL = globalMaxL * (1.0 - blendFactor) + tempMax * blendFactor;
        }

        for (var p = 0; p < island.length; p++) {
            var idx = island[p];
            var i = idx * 4;
            var okArr, oo;
            if (useCache) { okArr = okCache; oo = idx * 3; }
            else {
                okArr = tmpOk; oo = 0;
                oklabFromBytes(lut, src[i], src[i+1], src[i+2], okArr, oo);
            }
            var origL = okArr[oo], origA = okArr[oo+1], origB = okArr[oo+2];
            // OKLCH из кэша OKLab — это в точности тело srgbToOklch
            var origC = Math.sqrt(origA * origA + origB * origB);
            var origH = Math.atan2(origB, origA);
            var newL, newC, newH;

            if (isSingleMode) {
                var deltaH = origH - baseOklch.h;
                newH = targetOklch.h + deltaH;
                newC = (baseOklch.C < 0.01) ? targetOklch.C : origC * (targetOklch.C / baseOklch.C);
                var EPSILON = 0.001;
                if (baseOklch.L < EPSILON) newL = targetOklch.L + (1 - targetOklch.L) * origL;
                else if (baseOklch.L > 1 - EPSILON) newL = targetOklch.L * origL;
                else if (origL < baseOklch.L) newL = targetOklch.L * (origL / baseOklch.L);
                else newL = targetOklch.L + (1 - targetOklch.L) * ((origL - baseOklch.L) / (1 - baseOklch.L));
                // Глобальные сдвиги L/C/H уже вшиты в targetOklch —
                // повторное применение здесь удваивало их эффект.
            } else {
                var t = 0;
                if (islandMaxL - islandMinL > 0) {
                    t = (origL - islandMinL) / (islandMaxL - islandMinL);
                }
                if (t < 0) t = 0; if (t > 1) t = 1;

                var N = targetOklchs.length;
                if (N === 1) {
                    newL = targetOklchs[0].L; newC = targetOklchs[0].C; newH = targetOklchs[0].h;
                } else {
                    var segment = Math.floor(t * (N - 1));
                    if (segment >= N - 1) segment = N - 2;
                    var localT = (t * (N - 1)) - segment;

                    var c1 = targetOklchs[segment];
                    var c2 = targetOklchs[segment + 1];

                    newL = c1.L + (c2.L - c1.L) * localT;
                    newC = c1.C + (c2.C - c1.C) * localT;
                    newH = lerpHue(c1.h, c2.h, localT);
                }
            }

            if (isNaN(newH)) newH = 0;
            if (newL > 1) newL = 1; if (newL < 0) newL = 0;
            var resRgb = oklchToSrgb(newL, newC, newH);
            dst[i]   = Math.round(resRgb.r * 255);
            dst[i+1] = Math.round(resRgb.g * 255);
            dst[i+2] = Math.round(resRgb.b * 255);
        }
    }

    return dst;
}


// --- core.js ---
// core.js - Оркестрация обработки: параметры, пул воркеров, canvas/texture I/O

function previewTextureSync(tex, canvas) {
    var painted = false;
    if (typeof Painter === 'object' && typeof Painter.getCanvas === 'function') {
        var paintCanvas = Painter.getCanvas(tex);
        if (paintCanvas) {
            var pCtx = paintCanvas.getContext('2d');
            pCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
            pCtx.drawImage(canvas, 0, 0);
            if (typeof Painter.updateTexture === 'function') Painter.updateTexture(tex);
            painted = true;
        }
    }
    if (!painted && tex.canvas) {
        var tCtx = tex.canvas.getContext('2d');
        tCtx.clearRect(0, 0, tex.canvas.width, tex.canvas.height);
        tCtx.drawImage(canvas, 0, 0);
        if (typeof tex.updateMaterial === 'function') tex.updateMaterial();
    }
}

function finalizeTexture(tex, canvas) {
    var base64 = canvas.toDataURL();
    if (typeof tex.fromDataURL === 'function') {
        tex.fromDataURL(base64);
    } else {
        tex.source = base64;
        if (typeof tex.update === 'function') tex.update();
    }
    previewTextureSync(tex, canvas);
}

// Готовит чистые параметры для ядра orionProcessPixels: все преобразования
// цветов (hex, tinycolor, диагональный сдвиг, глобальные L/C/H) выполняются
// здесь, на главном потоке — ядру достаются только числа и plain-объекты,
// пригодные для structured clone в воркер.
function buildProcessingParams(formData) {
    var isSingleMode = formData.color_mode === 'single';

    var targetOklchs = [];
    if (isSingleMode) {
        var mHex = applyDiagonalShift(extractColorHex(formData.colors[0], '#808080'), formData.global_diag);
        targetOklchs.push(hexToOklch(mHex));
    } else {
        var inputColors = formData.colors || [];
        if (inputColors.length === 0) inputColors = ['#000000', '#808080', '#ffffff'];
        inputColors.forEach(hex => {
            var shiftedHex = applyDiagonalShift(extractColorHex(hex, '#ffffff'), formData.global_diag);
            targetOklchs.push(hexToOklch(shiftedHex));
        });
    }

    var hOffset = (parseFloat(formData.global_h) || 0) * (Math.PI / 180.0);
    var lOffset = (parseFloat(formData.global_l) || 0) / 100.0 * 0.5;
    var cMult = ((parseFloat(formData.global_c) || 0) / 100.0) + 1.0;

    targetOklchs.forEach(ok => {
        ok.L = Math.max(0, Math.min(1, ok.L + lOffset));
        ok.C = Math.max(0, ok.C * cMult);
        ok.h = ok.h + hOffset;
    });

    var maskHex = extractColorHex(formData.mask_color, '#ff0000');
    var maskRgb = hexToRgb(maskHex);
    var maskOklab = srgbToOklab(maskRgb.r, maskRgb.g, maskRgb.b);

    return {
        batchMode: formData.batch_mode === true,
        params: {
            isSingleMode: isSingleMode,
            globalGradient: formData.global_gradient === true,
            targetOklchs: targetOklchs.map(function(ok) { return {L: ok.L, C: ok.C, h: ok.h}; }),
            useMask: !!formData.use_mask,
            maskOklab: {L: maskOklab.L, a: maskOklab.a, b: maskOklab.b},
            maxDeltaE: (parseFloat(formData.mask_tolerance) || 0) / 100.0 * 0.15
        }
    };
}

// ============================================================================
// Web Worker пул
// ============================================================================

// Источник воркера собирается из тех же функций, что работают на главном
// потоке (Function.toString) — синхронный fallback и воркер гарантированно
// считают одинаково. Поэтому сборку нельзя минифицировать.
function buildOrionWorkerSource() {
    var parts = [
        'var ORION_LINEAR_LUT = null;',
        srgbToLinear.toString(),
        linearToSrgb.toString(),
        cbrt.toString(),
        srgbToOklab.toString(),
        oklabToSrgb.toString(),
        srgbToOklch.toString(),
        oklchToSrgb.toString(),
        lerpHue.toString(),
        getOrionLinearLUT.toString(),
        oklabFromBytes.toString(),
        orionProcessPixels.toString(),
        'self.onmessage = function(e) {\n' +
        '    var d = e.data || {};\n' +
        '    if (d.type === "ping") { self.postMessage({type: "pong"}); return; }\n' +
        '    if (d.type !== "job") return;\n' +
        '    try {\n' +
        '        var src = new Uint8ClampedArray(d.buffer);\n' +
        '        var out = orionProcessPixels(src, d.width, d.height, d.params);\n' +
        '        self.postMessage({type: "result", jobId: d.jobId, width: d.width, height: d.height, buffer: out.buffer}, [out.buffer]);\n' +
        '    } catch (err) {\n' +
        '        self.postMessage({type: "error", jobId: d.jobId, message: String(err && err.message || err)});\n' +
        '    }\n' +
        '};'
    ];
    return parts.join('\n\n');
}

// Пул: ленивая инициализация с ping/pong-рукопожатием; при любой проблеме
// (CSP, ошибка скрипта, таймаут) защёлкивается в 'disabled' и вся обработка
// идёт синхронным путём с тем же ядром — результат битово идентичен.
var OrionWorkerPool = {
    workers: [],
    queue: [],
    jobs: {},
    jobSeq: 0,
    state: 'unknown', // unknown | init | ready | disabled
    readyPromise: null,
    blobUrl: null,
    maxWorkers: Math.min(4, Math.max(1, ((typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 4) - 1)),

    ready: function() {
        if (this.state === 'ready') return Promise.resolve(true);
        if (this.state === 'disabled') return Promise.resolve(false);
        if (this.readyPromise) return this.readyPromise;
        var self = this;
        this.state = 'init';
        this.readyPromise = new Promise(function(resolve) {
            var w = null;
            var settled = false;
            var finish = function(ok) {
                if (settled) return;
                settled = true;
                if (ok) {
                    var entry = {worker: w, busy: false, currentJobId: null};
                    self.workers.push(entry);
                    self._attach(entry);
                    self.state = 'ready';
                } else {
                    self.state = 'disabled';
                    if (w) { try { w.terminate(); } catch(e) {} }
                    console.warn('Orion Gradient: Web Workers недоступны, работаем синхронно');
                }
                resolve(ok);
            };
            try {
                if (typeof Worker === 'undefined' || typeof Blob === 'undefined' ||
                    typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
                    finish(false);
                    return;
                }
                var blob = new Blob([buildOrionWorkerSource()], {type: 'application/javascript'});
                self.blobUrl = URL.createObjectURL(blob);
                w = new Worker(self.blobUrl);
                var timer = setTimeout(function() { finish(false); }, 2000);
                w.onmessage = function(e) {
                    if (e.data && e.data.type === 'pong') { clearTimeout(timer); finish(true); }
                };
                w.onerror = function() { clearTimeout(timer); finish(false); };
                w.postMessage({type: 'ping'});
            } catch (e) {
                finish(false);
            }
        });
        return this.readyPromise;
    },

    _attach: function(entry) {
        var self = this;
        entry.worker.onmessage = function(e) {
            var d = e.data || {};
            if (d.type !== 'result' && d.type !== 'error') return;
            var job = self.jobs[d.jobId];
            delete self.jobs[d.jobId];
            entry.busy = false;
            entry.currentJobId = null;
            if (job) {
                if (d.type === 'result') job.resolve({buffer: d.buffer, width: d.width, height: d.height});
                else job.reject(new Error(d.message || 'Ошибка воркера'));
            }
            self._pump();
        };
        entry.worker.onerror = function(err) {
            // Скриптовая ошибка: хороним пул, in-flight задачи отклоняем —
            // вызывающий код сам падает на синхронный путь
            self._failAll((err && err.message) || 'Ошибка скрипта воркера');
        };
    },

    _failAll: function(msg) {
        this.state = 'disabled';
        var jobs = this.jobs;
        this.jobs = {};
        var queued = this.queue;
        this.queue = [];
        this.workers.forEach(function(e) { try { e.worker.terminate(); } catch(ex) {} });
        this.workers = [];
        for (var id in jobs) { jobs[id].reject(new Error(msg)); }
        queued.forEach(function(j) { j.reject(new Error(msg)); });
    },

    runJob: function(payload, transfer, isStale) {
        var self = this;
        if (this.state !== 'ready') return Promise.reject(new Error('Пул воркеров не готов'));
        return new Promise(function(resolve, reject) {
            self.queue.push({payload: payload, transfer: transfer, resolve: resolve, reject: reject, isStale: isStale || null});
            self._pump();
        });
    },

    _pump: function() {
        if (this.state !== 'ready') return;
        while (this.queue.length > 0) {
            var job = this.queue[0];
            // Устаревшие превью не считаем вовсе
            if (job.isStale && job.isStale()) {
                this.queue.shift();
                job.resolve(null);
                continue;
            }
            var entry = null;
            for (var i = 0; i < this.workers.length; i++) {
                if (!this.workers[i].busy) { entry = this.workers[i]; break; }
            }
            if (!entry && this.workers.length < this.maxWorkers && this.blobUrl) {
                try {
                    var w = new Worker(this.blobUrl);
                    entry = {worker: w, busy: false, currentJobId: null};
                    this.workers.push(entry);
                    this._attach(entry);
                } catch (e) {
                    entry = null;
                }
            }
            if (!entry) return; // все заняты — продолжим, когда кто-то освободится

            this.queue.shift();
            var jobId = ++this.jobSeq;
            this.jobs[jobId] = job;
            entry.busy = true;
            entry.currentJobId = jobId;
            try {
                entry.worker.postMessage({
                    type: 'job',
                    jobId: jobId,
                    width: job.payload.width,
                    height: job.payload.height,
                    params: job.payload.params,
                    buffer: job.payload.buffer
                }, job.transfer || []);
            } catch (e) {
                delete this.jobs[jobId];
                entry.busy = false;
                entry.currentJobId = null;
                job.reject(e);
            }
        }
    },

    dispose: function() {
        this._failAll('Пул остановлен');
        if (this.blobUrl) {
            try { URL.revokeObjectURL(this.blobUrl); } catch(e) {}
            this.blobUrl = null;
        }
        this.state = 'unknown'; // повторная загрузка плагина переинициализирует пул
        this.readyPromise = null;
    }
};

// ============================================================================
// Высокоуровневый конвейер
// ============================================================================

// Считает результаты для всех подходящих текстур (воркеры или sync-fallback).
// Возвращает Promise<[{td, out}]>. Текстуры НЕ трогает — запись делают
// paintGradientPreview/commitGradientResults.
// opts.shouldCancel() — отбрасывание устаревших превью (latest-wins);
// opts.onResult(td, out) — отрисовка по мере готовности;
// opts.onProgress(done, total) — прогресс для батча.
function computeGradientResults(texturesData, formData, opts) {
    opts = opts || {};
    var shouldCancel = opts.shouldCancel || function() { return false; };
    var job = buildProcessingParams(formData);

    var targets = texturesData.filter(function(td) {
        return td && td.tex && td.origData && (job.batchMode || td.isSelected);
    });
    var total = targets.length;
    var done = 0;

    var promises = targets.map(function(td) {
        td.touched = true; // restoreOriginalsSync восстановит только тронутые
        return dispatchTextureJob(td, job.params, shouldCancel).then(function(out) {
            done++;
            if (opts.onProgress) {
                try { opts.onProgress(done, total); } catch(e) {}
            }
            if (out && !shouldCancel() && opts.onResult) {
                try { opts.onResult(td, out); } catch(e) { console.error(e); }
            }
            return out ? {td: td, out: out} : null;
        });
    });

    return Promise.all(promises).then(function(rs) { return rs.filter(Boolean); });
}

function dispatchTextureJob(td, params, isStale) {
    return OrionWorkerPool.ready().then(function(workersOk) {
        if (isStale()) return null;
        if (!workersOk) {
            return orionProcessPixels(td.origData.data, td.width, td.height, params);
        }
        // Передаём КОПИЮ буфера (transferable): оригинал нужен для отмены/restore
        var copy = td.origData.data.slice();
        return OrionWorkerPool.runJob(
            {width: td.width, height: td.height, params: params, buffer: copy.buffer},
            [copy.buffer],
            isStale
        ).then(function(res) {
            if (!res) return null; // протухло в очереди
            return new Uint8ClampedArray(res.buffer);
        }).catch(function(err) {
            // Надёжность: любая ошибка воркера → синхронный путь, то же ядро
            console.warn('Orion Gradient: fallback на синхронную обработку —', err && err.message);
            if (isStale()) return null;
            return orionProcessPixels(td.origData.data, td.width, td.height, params);
        });
    });
}

function makeCanvasFromResult(td, out) {
    var canvas = document.createElement('canvas');
    canvas.width = td.width;
    canvas.height = td.height;
    var ctx = canvas.getContext('2d');
    var imgData = ctx.createImageData(td.width, td.height);
    imgData.data.set(out);
    ctx.putImageData(imgData, 0, 0);
    return canvas;
}

function paintGradientPreview(td, out) {
    previewTextureSync(td.tex, makeCanvasFromResult(td, out));
}

// Вызывается СТРОГО синхронно между Undo.initEdit и Undo.finishEdit
function commitGradientResults(results) {
    results.forEach(function(r) {
        finalizeTexture(r.td.tex, makeCanvasFromResult(r.td, r.out));
    });
}


// --- ui.js ---
// ui.js - Пользовательский интерфейс (Диалог)

// Раздельная память цветов: confirm в «Сплошном» режиме не должен
// схлопывать сохранённый набор градиента до одного цвета
var lastGradientColors = ['#000000', '#808080', '#ffffff'];
var lastSingleColor = '#808080';

var lastUseMask = false;
var lastMaskColor = '#ff0000';
var lastMaskTolerance = 10;
var lastBatchMode = false;
var lastColorMode = 'gradient';
var lastGlobalGradient = false;
var lastActivePreset = '';

// Состояние «диалог открыт» — main.js не даёт открыть второй диалог поверх
var orionDialogState = { open: false };

// Равномерные оттенки базового цвета по светлоте (OKLCH)
function generateShades(baseHex, count) {
    var ok = hexToOklch(extractColorHex(baseHex, '#808080'));
    if (!(count >= 2)) count = 3;
    var minL = Math.max(0.05, ok.L * 0.35);
    var maxL = Math.min(0.97, ok.L + (1 - ok.L) * 0.75);
    var shades = [];
    for (var i = 0; i < count; i++) {
        var t = i / (count - 1);
        var L = minL + (maxL - minL) * t;
        var C = ok.C * (1 - Math.abs(t - 0.5) * 0.35);
        shades.push(rgbToHex(oklchToSrgb(L, C, ok.h)));
    }
    return shades;
}

// Имена пресетов вводит пользователь — экранируем перед вставкой в HTML диалога
function escapeHtmlText(s) {
    return String(s).replace(/[&<>"']/g, function(ch) {
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
}

// CSS-фон полосы предпросмотра текущего градиента
function buildGradientCss(colors, isSingle) {
    if (isSingle || !colors || colors.length < 2) {
        return (colors && colors[0]) || '#808080';
    }
    return 'linear-gradient(to right, ' + colors.join(', ') + ')';
}

function updateGradientPreviewBar(colors, isSingle) {
    var bar = document.getElementById('ai_gradient_preview_bar');
    if (bar) bar.style.background = buildGradientCss(colors, isSingle);
}

// Запоминание настроек между сессиями Blockbench
function saveLastDialogState() {
    try {
        localStorage.setItem('gradient_studio_last_state', JSON.stringify({
            gradientColors: lastGradientColors,
            singleColor: lastSingleColor,
            useMask: lastUseMask,
            maskColor: lastMaskColor,
            maskTolerance: lastMaskTolerance,
            batchMode: lastBatchMode,
            colorMode: lastColorMode,
            globalGradient: lastGlobalGradient,
            activePreset: lastActivePreset
        }));
    } catch (e) {}
}

function loadLastDialogState() {
    try {
        var raw = localStorage.getItem('gradient_studio_last_state');
        if (!raw) return;
        var s = JSON.parse(raw);
        if (!s || typeof s !== 'object') return;
        if (Array.isArray(s.gradientColors)) {
            var colors = s.gradientColors.map(normalizeStoredColor).filter(Boolean);
            if (colors.length >= 2 && colors.length <= 10) lastGradientColors = colors;
        }
        var single = normalizeStoredColor(s.singleColor);
        if (single) lastSingleColor = single;
        var mask = normalizeStoredColor(s.maskColor);
        if (mask) lastMaskColor = mask;
        if (typeof s.useMask === 'boolean') lastUseMask = s.useMask;
        if (typeof s.maskTolerance === 'number' && isFinite(s.maskTolerance)) {
            lastMaskTolerance = Math.max(0, Math.min(100, s.maskTolerance));
        }
        if (typeof s.batchMode === 'boolean') lastBatchMode = s.batchMode;
        if (s.colorMode === 'single' || s.colorMode === 'gradient') lastColorMode = s.colorMode;
        if (typeof s.globalGradient === 'boolean') lastGlobalGradient = s.globalGradient;
        if (typeof s.activePreset === 'string') lastActivePreset = s.activePreset;
    } catch (e) {}
}
loadLastDialogState();

// Blockbench-форма возвращает только значения полей (color_0..N) — синтетический
// массив colors надо собирать заново перед каждым переоткрытием диалога
function collectFormColors(formValues, count, isSingle) {
    var colors = [];
    if (isSingle) {
        if (formValues.color_0 !== undefined) colors.push(extractColorHex(formValues.color_0, '#808080'));
    } else {
        for (var i = 0; i < count; i++) {
            if (formValues['color_' + i] !== undefined) {
                colors.push(extractColorHex(formValues['color_' + i], '#808080'));
            }
        }
    }
    return colors;
}

function openGradientDialog(texturesData, initialFormState) {
    var currentFormState = initialFormState || {
        live_preview: true,
        batch_mode: lastBatchMode,
        global_gradient: lastGlobalGradient,
        color_mode: lastColorMode,
        colors: lastColorMode === 'single' ? [lastSingleColor] : [...lastGradientColors],
        global_l: 0,
        global_c: 0,
        global_h: 0,
        global_diag: 0,
        use_mask: lastUseMask,
        mask_color: lastMaskColor,
        mask_tolerance: lastMaskTolerance,
        preset_name: '',
        active_preset_name: lastActivePreset
    };

    // Нормализация при переоткрытии (смена режима, пипетка, пресеты): сырой
    // form-результат Blockbench не содержит .colors — без этого диалог падал
    // с TypeError и просто не открывался
    if (!Array.isArray(currentFormState.colors) || currentFormState.colors.length === 0) {
        var rebuiltColors = [];
        for (var ci = 0; currentFormState['color_' + ci] !== undefined; ci++) {
            rebuiltColors.push(currentFormState['color_' + ci]);
        }
        currentFormState.colors = rebuiltColors;
    }
    currentFormState.colors = currentFormState.colors.map(function(c) { return extractColorHex(c, '#808080'); });
    if (currentFormState.color_mode === 'single') {
        currentFormState.colors = [currentFormState.colors[0] || lastSingleColor];
    } else {
        if (currentFormState.colors.length === 0) currentFormState.colors = lastGradientColors.slice();
        if (currentFormState.colors.length === 1) currentFormState.colors = generateShades(currentFormState.colors[0], 3);
    }
    if (typeof currentFormState.active_preset_name !== 'string') currentFormState.active_preset_name = '';

    var previewTimeout = null;
    var isRebuilding = false;
    var isConfirmed = false;
    var suppressPresetReset = false;
    var previewGeneration = 0;

    // Live preview через пул воркеров: каждый запуск поднимает поколение,
    // результаты устаревших поколений отбрасываются (latest-wins), включая
    // момент закрытия/переоткрытия диалога
    function runLivePreview() {
        var myGen = ++previewGeneration;
        var stale = function() {
            return myGen !== previewGeneration || isConfirmed || isRebuilding;
        };
        computeGradientResults(texturesData, currentFormState, {
            shouldCancel: stale,
            onResult: paintGradientPreview
        }).catch(function(e) { console.error(e); });
    }

    function restoreOriginalsSync() {
        texturesData.forEach(td => {
            // Только тронутые превью текстуры; незагруженные (origData=null)
            // раньше роняли restore, и текстуры после них не восстанавливались
            if (!td || !td.tex || !td.origData || !td.touched) return;
            var canvas = document.createElement("canvas");
            canvas.width = td.width; canvas.height = td.height;
            var ctx = canvas.getContext('2d');
            ctx.putImageData(td.origData, 0, 0);
            previewTextureSync(td.tex, canvas);

            var base64 = canvas.toDataURL();
            if (typeof td.tex.fromDataURL === 'function') {
                td.tex.fromDataURL(base64);
            } else {
                td.tex.source = base64;
                if (typeof td.tex.update === 'function') td.tex.update();
            }
            td.touched = false;
        });
    }

    function getCustomCategoryOptions() {
        var cats = {};
        cats[_t('my_presets')] = '📁 ' + _t('my_presets');
        for (var k in customPresets) {
            if (customPresets[k].category) {
                var c = customPresets[k].category;
                cats[c] = '📁 ' + c;
            }
        }
        return cats;
    }

    var isSingleMode = currentFormState.color_mode === 'single';

    var formConfig = {
        live_preview: {label: _t('live_preview'), type: 'checkbox', value: currentFormState.live_preview},
        global_gradient: {label: _t('global_gradient'), type: 'checkbox', value: currentFormState.global_gradient === true, description: _t('global_gradient_desc')},
        // Батч снова включён: текстуры теперь собираются только из текущего
        // проекта, поэтому Ctrl+Z на других вкладках больше не страдает
        batch_mode: {label: _t('batch_mode'), type: 'checkbox', value: currentFormState.batch_mode === true, description: _t('batch_mode_desc')},

        _cat1: {type: 'info', text: '<b style="color:var(--color-accent)">' + _t('cat_color_setup') + '</b>'},
        color_mode: {label: _t('color_mode'), type: 'select', options: (function() {
            var gradCount = isSingleMode
                ? (lastGradientColors.length >= 2 ? lastGradientColors.length : 3)
                : currentFormState.colors.length;
            return {
                'gradient': '🌈 ' + _t('gradient_mode') + ' (' + gradCount + ' ' + (gradCount >= 5 && gradCount <= 10 ? _t('colors_count_5_10') : (gradCount === 1 ? _t('colors_count_1') : _t('colors_count_2_4'))) + ')',
                'single': '🎨 ' + _t('single_mode')
            };
        })(), value: currentFormState.color_mode},
        
        preset_btn: {
            type: 'info',
            text: '<button type="button" id="ai_btn_presets_menu" style="width: 100%; padding: 6px; background: var(--color-accent); color: var(--color-text); border: 1px solid var(--color-border); border-radius: 2px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;"><i class="material-icons" style="font-size: 16px;">folder</i>' + _t('btn_open_lib') + '</button>'
        },

        preset_display: {
            type: 'info',
            text: '<div style="display:flex; align-items:center; justify-content:space-between; background:var(--color-back); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--color-border); margin-top: 4px;">' +
                  '<button type="button" id="ai_btn_prev_preset" style="background:none; border:none; color:var(--color-text); cursor:pointer;"><i class="material-icons" style="font-size: 18px;">chevron_left</i></button>' +
                  '<span id="ai_preset_name_display" style="flex:1; text-align:center; font-size:13px; color:var(--color-sub_text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' + escapeHtmlText(currentFormState.active_preset_name || _t('preset_none')) + '</span>' +
                  '<button type="button" id="ai_btn_next_preset" style="background:none; border:none; color:var(--color-text); cursor:pointer;"><i class="material-icons" style="font-size: 18px;">chevron_right</i></button>' +
                  '</div>'
        },

        gradient_preview: {
            type: 'info',
            text: '<div id="ai_gradient_preview_bar" style="height: 16px; border-radius: 4px; border: 1px solid var(--color-border); margin: 6px 0 2px 0; background: ' + buildGradientCss(currentFormState.colors, isSingleMode) + ';" title="' + _t('gradient_preview') + '"></div>'
        }
    };

    if (isSingleMode) {
        formConfig.color_0 = {label: _t('lbl_main_color'), type: 'color', value: currentFormState.colors[0] || '#808080'};
    } else {
        var numColors = currentFormState.colors.length;
        for (var i = 0; i < numColors; i++) {
            var lbl = _t('lbl_tone') + ' ' + (i + 1);
            if (i === 0) lbl = _t('lbl_tone_shadow');
            else if (i === numColors - 1) lbl = _t('lbl_tone') + ' ' + numColors + _t('lbl_tone_highlight');
            else if (i === Math.floor(numColors / 2)) lbl = _t('lbl_tone') + ' ' + (i + 1) + _t('lbl_tone_base');
            
            formConfig['color_' + i] = {label: lbl, type: 'color', value: currentFormState.colors[i] || '#808080'};
        }
        
        var btns = '<div style="display:flex; gap: 8px;">';
        if (numColors < 10) {
            btns += '<button type="button" id="ai_btn_add_color" style="flex:1; padding: 4px; background: var(--color-accent); color: var(--color-text); border: 1px solid var(--color-border); border-radius: 2px; cursor: pointer;"><i class="material-icons" style="font-size: 16px; vertical-align: middle;">add</i> ' + _t('btn_add_color') + '</button>';
        }
        if (numColors > 2) {
            btns += '<button type="button" id="ai_btn_remove_color" style="flex:1; padding: 4px; background: var(--color-button); color: var(--color-text); border: 1px solid var(--color-border); border-radius: 2px; cursor: pointer;"><i class="material-icons" style="font-size: 16px; vertical-align: middle;">remove</i> ' + _t('btn_remove_color') + '</button>';
        }
        btns += '</div>';
        btns += '<div style="display:flex; gap: 8px; margin-top: 4px;">';
        btns += '<button type="button" id="ai_btn_reverse_colors" title="' + _t('btn_reverse_colors_title') + '" style="flex:1; padding: 4px; background: var(--color-button); color: var(--color-text); border: 1px solid var(--color-border); border-radius: 2px; cursor: pointer;"><i class="material-icons" style="font-size: 16px; vertical-align: middle;">swap_horiz</i> ' + _t('btn_reverse_colors') + '</button>';
        btns += '<button type="button" id="ai_btn_auto_shades" title="' + _t('btn_auto_shades_title') + '" style="flex:1; padding: 4px; background: var(--color-button); color: var(--color-text); border: 1px solid var(--color-border); border-radius: 2px; cursor: pointer;"><i class="material-icons" style="font-size: 16px; vertical-align: middle;">gradient</i> ' + _t('btn_auto_shades') + '</button>';
        btns += '</div>';

        formConfig.color_controls = { type: 'info', text: btns };
    }

    Object.assign(formConfig, {
        _cat2: {type: 'info', text: '<b style="color:var(--color-accent)">' + _t('cat_global_shifts') + '</b>'},
        global_l: {label: _t('lbl_shift_l'), type: 'number', value: currentFormState.global_l, min: -100, max: 100, step: 1},
        global_c: {label: _t('lbl_shift_c'), type: 'number', value: currentFormState.global_c, min: -100, max: 100, step: 1},
        global_h: {label: _t('lbl_shift_h'), type: 'number', value: currentFormState.global_h, min: -180, max: 180, step: 1},
        global_diag: {label: _t('lbl_shift_diag'), type: 'number', value: currentFormState.global_diag, min: -100, max: 100, step: 1, description: _t('desc_shift_diag')},
        
        _cat3: {type: 'info', text: '<b style="color:var(--color-accent)">' + _t('cat_smart_mask') + '</b>'},
        use_mask: {label: _t('use_mask'), type: 'checkbox', value: currentFormState.use_mask},
        mask_color: {label: _t('lbl_replace_color'), type: 'color', value: currentFormState.mask_color},
        
        pick_btn: {
            type: 'info',
            text: '<button type="button" id="ai_btn_pick_color" style="width: 100%; padding: 6px; background: var(--color-button); color: var(--color-text); border: 1px solid var(--color-border); border-radius: 2px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;"><i class="material-icons" style="font-size: 16px;">colorize</i>' + _t('btn_pick_model') + '</button>'
        },

        mask_tolerance: {label: _t('mask_tol'), type: 'number', value: currentFormState.mask_tolerance, min: 0, max: 100, step: 1},
        
        _cat4: {type: 'info', text: '<b style="color:var(--color-accent)">' + _t('cat4') + '</b>'},
        preset_category: {label: _t('preset_cat'), type: 'select', options: getCustomCategoryOptions(), value: _t('my_presets')},
        preset_new_category: {label: _t('preset_new_cat'), type: 'input', value: '', placeholder: _t('preset_new_cat_ph')},
        preset_name: {label: _t('preset_name'), type: 'input', value: ''},
        
        save_btn: {
            type: 'info',
            text: '<button type="button" id="ai_btn_save_preset" style="width: 100%; padding: 6px; background: var(--color-accent); color: var(--color-text); border: 1px solid var(--color-border); border-radius: 2px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;"><i class="material-icons" style="font-size: 16px;">save</i>' + _t('btn_save') + '</button>'
        }
    });

    if (isSingleMode) {
        delete formConfig.preset_btn;
        delete formConfig.preset_display;
        delete formConfig._cat4;
        delete formConfig.preset_category;
        delete formConfig.preset_new_category;
        delete formConfig.preset_name;
        delete formConfig.save_btn;
    }

    var dialog = new Dialog({
        id: 'gradient_studio_pro_dialog',
        title: 'Gradient Studio PRO',
        width: 600,
        form: formConfig,
        onConfirm: function(finalForm) {
            isConfirmed = true;
            orionDialogState.open = false;
            dialog.hide();

            if (window.OrionGradientBridge && window.OrionGradientBridge.globalClickHandler) {
                document.removeEventListener('click', window.OrionGradientBridge.globalClickHandler);
            }
            if (window.OrionGradientBridge && window.OrionGradientBridge.cleanupPicker) {
                window.OrionGradientBridge.cleanupPicker();
            }

            if (previewTimeout) clearTimeout(previewTimeout);

            setTimeout(() => {
                try {
                    var newColors = collectFormColors(finalForm, currentFormState.colors.length, isSingleMode);
                    if (newColors.length === 0) newColors = currentFormState.colors.slice();
                    finalForm.colors = newColors;

                    if (isSingleMode) {
                        lastSingleColor = newColors[0];
                    } else {
                        lastGradientColors = newColors.slice();
                    }
                    lastUseMask = finalForm.use_mask === true;
                    lastMaskColor = extractColorHex(finalForm.mask_color, lastMaskColor);
                    lastMaskTolerance = parseFloat(finalForm.mask_tolerance) || 0;
                    lastBatchMode = finalForm.batch_mode === true;
                    lastGlobalGradient = finalForm.global_gradient === true;
                    lastColorMode = finalForm.color_mode;
                    // active_preset_name — не поле формы, берём из состояния диалога
                    lastActivePreset = currentFormState.active_preset_name || '';
                    saveLastDialogState();

                    // Восстанавливаем оригиналы ДО расчёта: undo-снимок должен
                    // зафиксировать исходное состояние, а не live preview
                    restoreOriginalsSync();
                    var targetTextures = texturesData.filter(td => td.origData && (lastBatchMode || td.isSelected)).map(td => td.tex);
                    if (targetTextures.length === 0) {
                        Blockbench.showQuickMessage('Нет текстур для применения!', 3000);
                        return;
                    }

                    var showProgress = targetTextures.length > 2 && typeof Blockbench.setProgress === 'function';

                    computeGradientResults(texturesData, finalForm, {
                        onProgress: showProgress ? function(done, total) { Blockbench.setProgress(done / total); } : null
                    }).then(function(results) {
                        try {
                            // Compute-then-commit: между initEdit и finishEdit
                            // только синхронная запись, никаких await
                            Undo.initEdit({textures: targetTextures, bitmap: true});
                            commitGradientResults(results);
                            Undo.finishEdit('Студийный Градиент');
                            Blockbench.showQuickMessage('Применено к ' + results.length + ' текстурам!', 3000);
                        } catch (e) {
                            console.error("Critical Commit Error:", e);
                            Blockbench.showQuickMessage("Ошибка при сохранении: " + e.message, 5000);
                        } finally {
                            if (showProgress) Blockbench.setProgress(0);
                        }
                    }).catch(function(e) {
                        console.error("Critical Confirm Error:", e);
                        if (showProgress) Blockbench.setProgress(0);
                        Blockbench.showQuickMessage("Ошибка при сохранении: " + e.message, 5000);
                    });
                } catch (e) {
                    console.error("Critical Confirm Error:", e);
                    Blockbench.showQuickMessage("Ошибка при сохранении: " + e.message, 5000);
                }
            }, 50);
        },
        onCancel: function() {
            if (isRebuilding) return;
            isConfirmed = true;
            orionDialogState.open = false;
            dialog.hide();
            if (window.OrionGradientBridge && window.OrionGradientBridge.globalClickHandler) {
                document.removeEventListener('click', window.OrionGradientBridge.globalClickHandler);
            }
            if (window.OrionGradientBridge && window.OrionGradientBridge.cleanupPicker) {
                window.OrionGradientBridge.cleanupPicker();
            }
            if (previewTimeout) clearTimeout(previewTimeout);
            if (currentFormState.live_preview) {
                setTimeout(restoreOriginalsSync, 50);
            }
        },
        onFormChange: function(formData) {
            // active_preset_name — не поле формы: без явного переноса
            // Object.assign ниже стирал его при любом изменении
            if (formData.active_preset_name === undefined) {
                formData.active_preset_name = currentFormState.active_preset_name;
            }

            if (formData.color_mode !== currentFormState.color_mode) {
                var oldColors = collectFormColors(formData, currentFormState.colors.length, isSingleMode);
                if (oldColors.length === 0) oldColors = currentFormState.colors.slice();
                if (formData.color_mode === 'single') {
                    // Градиент → Сплошной: запоминаем градиент, берём средний тон («Основу»)
                    if (oldColors.length >= 2) lastGradientColors = oldColors.slice();
                    formData.colors = [oldColors[Math.floor(oldColors.length / 2)]];
                } else {
                    // Сплошной → Градиент: возвращаем прежний градиент,
                    // либо строим оттенки от текущего цвета
                    if (oldColors.length === 1) lastSingleColor = oldColors[0];
                    formData.colors = (lastGradientColors.length >= 2) ? lastGradientColors.slice() : generateShades(oldColors[0], 3);
                }
                formData.active_preset_name = '';
                isRebuilding = true;
                dialog.hide();
                setTimeout(() => openGradientDialog(texturesData, formData), 50);
                return;
            }

            // Сравнение цветов в hex: форма возвращает tinycolor-объекты,
            // прямое сравнение со строками состояния всегда давало «не равно»
            formData.colors = collectFormColors(formData, currentFormState.colors.length, isSingleMode);
            if (formData.colors.length === 0) formData.colors = currentFormState.colors.slice();

            updateGradientPreviewBar(formData.colors, isSingleMode);

            var userModifiedParams = false;
            if (formData.global_diag !== currentFormState.global_diag ||
                formData.global_h !== currentFormState.global_h ||
                formData.global_l !== currentFormState.global_l ||
                formData.global_c !== currentFormState.global_c) {
                userModifiedParams = true;
            }
            for (var i = 0; i < formData.colors.length; i++) {
                if (formData.colors[i] !== currentFormState.colors[i]) userModifiedParams = true;
            }
            if (userModifiedParams && !suppressPresetReset) {
                formData.active_preset_name = '';
                var presetSpan = document.getElementById('ai_preset_name_display');
                if (presetSpan) presetSpan.innerText = 'Нет (Пользовательский)';
            }

            var previewToggled = (formData.live_preview !== currentFormState.live_preview);
            var batchToggled = ((formData.batch_mode === true) !== (currentFormState.batch_mode === true));

            currentFormState = Object.assign({}, formData);
            lastBatchMode = currentFormState.batch_mode === true;
            lastGlobalGradient = currentFormState.global_gradient === true;
            
            if (previewToggled && !currentFormState.live_preview) {
                if (previewTimeout) clearTimeout(previewTimeout);
                setTimeout(restoreOriginalsSync, 50);
                return;
            }
            
            if (batchToggled) {
                if (previewTimeout) clearTimeout(previewTimeout);
                setTimeout(restoreOriginalsSync, 50);
            }
            
            if (currentFormState.live_preview && !isRebuilding) {
                if (previewTimeout) clearTimeout(previewTimeout);
                previewTimeout = setTimeout(() => {
                    if (isConfirmed || isRebuilding) return;
                    runLivePreview();
                }, 150);
            }
        }
    });

    if (!isRebuilding && currentFormState.live_preview) {
        setTimeout(() => {
            if (isConfirmed || isRebuilding) return;
            runLivePreview();
        }, 300);
    }
    
    dialog.show();
    orionDialogState.open = true;

    if (window.OrionGradientBridge) {
        if (window.OrionGradientBridge.cleanupPicker) {
            window.OrionGradientBridge.cleanupPicker();
        }
        if (window.OrionGradientBridge.globalClickHandler) {
            document.removeEventListener('click', window.OrionGradientBridge.globalClickHandler);
        }
    }

    window.OrionGradientBridge = {
        activePickerHandler: null,
        globalClickHandler: function(e) {
            if (e.target.closest('[id^="ai_btn_"]')) {
                e.preventDefault();
            }
            if (e.target.closest('#ai_btn_presets_menu')) {
                window.OrionGradientBridge.openPresets(e);
            } else if (e.target.closest('#ai_btn_pick_color')) {
                window.OrionGradientBridge.pickColor();
            } else if (e.target.closest('#ai_btn_save_preset')) {
                window.OrionGradientBridge.savePreset();
            } else if (e.target.closest('#ai_btn_add_color')) {
                window.OrionGradientBridge.addColor();
            } else if (e.target.closest('#ai_btn_remove_color')) {
                window.OrionGradientBridge.removeColor();
            } else if (e.target.closest('#ai_btn_reverse_colors')) {
                window.OrionGradientBridge.reverseColors();
            } else if (e.target.closest('#ai_btn_auto_shades')) {
                window.OrionGradientBridge.autoShades();
            } else if (e.target.closest('#ai_btn_prev_preset')) {
                window.OrionGradientBridge.nextPreset(-1);
            } else if (e.target.closest('#ai_btn_next_preset')) {
                window.OrionGradientBridge.nextPreset(1);
            }
        },
        
        // Обновление полей формы БЕЗ переоткрытия диалога (нет мерцания).
        // Возвращает false, если setFormValues недоступен — тогда вызывающий
        // код делает hide+reopen, как раньше.
        applyFormPatch: function(patch, presetName) {
            if (typeof dialog.setFormValues !== 'function') return false;
            suppressPresetReset = true;
            try {
                dialog.setFormValues(patch);
            } catch (e) {
                console.warn('setFormValues недоступен, переоткрываем диалог', e);
                suppressPresetReset = false;
                return false;
            }
            suppressPresetReset = false;
            // Синхронизируем состояние сами: onFormChange мог не сработать
            // (или сработать асинхронно) в зависимости от версии Blockbench
            for (var k in patch) {
                if (k.indexOf('color_') === 0) {
                    var ci = parseInt(k.slice(6), 10);
                    currentFormState.colors[ci] = extractColorHex(patch[k], currentFormState.colors[ci]);
                } else {
                    currentFormState[k] = patch[k];
                }
            }
            currentFormState.active_preset_name = presetName || '';
            var presetSpan = document.getElementById('ai_preset_name_display');
            if (presetSpan) presetSpan.innerText = currentFormState.active_preset_name || _t('preset_none');
            updateGradientPreviewBar(currentFormState.colors, isSingleMode);
            // Через общий previewTimeout: гасим таймер, который мог завести
            // onFormChange от setFormValues, чтобы не считать превью дважды
            if (currentFormState.live_preview && !isConfirmed && !isRebuilding) {
                if (previewTimeout) clearTimeout(previewTimeout);
                previewTimeout = setTimeout(function() {
                    if (isConfirmed || isRebuilding) return;
                    runLivePreview();
                }, 50);
            }
            return true;
        },

        // Заменить набор цветов (то же количество стопов) на месте
        applyColors: function(colors, presetName) {
            var patch = {};
            for (var i = 0; i < colors.length; i++) patch['color_' + i] = colors[i];
            if (this.applyFormPatch(patch, presetName)) return;

            var formValues = dialog.getFormResult();
            formValues.colors = colors;
            formValues.active_preset_name = presetName || '';
            isRebuilding = true;
            dialog.hide();
            setTimeout(() => openGradientDialog(texturesData, formValues), 50);
        },

        reverseColors: function() {
            if (isSingleMode) return;
            var formValues = dialog.getFormResult();
            var colors = collectFormColors(formValues, currentFormState.colors.length, false);
            if (colors.length === 0) colors = currentFormState.colors.slice();
            colors.reverse();
            this.applyColors(colors, '');
        },

        autoShades: function() {
            if (isSingleMode) return;
            var formValues = dialog.getFormResult();
            var colors = collectFormColors(formValues, currentFormState.colors.length, false);
            if (colors.length === 0) colors = currentFormState.colors.slice();
            var base = colors[Math.floor(colors.length / 2)];
            this.applyColors(generateShades(base, colors.length), '');
        },

        applyPresetData: function(name, p, formValues) {
            var pColors = (p.colors || [p.shadow || '#000000', p.mid || '#808080', p.high || '#ffffff'])
                .map(function(c) { return normalizeStoredColor(c) || '#808080'; });
            var targetCount = currentFormState.color_mode === 'single' ? 1 : currentFormState.colors.length;
            var sampled = [];
            for (var i = 0; i < targetCount; i++) {
                if (targetCount === 1) sampled.push(pColors[Math.floor(pColors.length / 2)]);
                else {
                    var t = i / (targetCount - 1);
                    sampled.push(pColors[Math.round(t * (pColors.length - 1))]);
                }
            }

            // Пресет = абсолютный вид: цвета + обнуление глобальных сдвигов
            var patch = {global_l: 0, global_c: 0, global_h: 0, global_diag: 0};
            for (var i = 0; i < sampled.length; i++) patch['color_' + i] = sampled[i];
            if (this.applyFormPatch(patch, name)) return;

            // Fallback: переоткрытие диалога (режим покраски сохраняем —
            // насильственный «градиент из 1 цвета» давал плоскую заливку)
            formValues.colors = sampled;
            formValues.global_diag = 0;
            formValues.global_h = 0;
            formValues.global_l = 0;
            formValues.global_c = 0;
            formValues.color_mode = currentFormState.color_mode;
            formValues.active_preset_name = name;

            isRebuilding = true;
            dialog.hide();
            setTimeout(() => openGradientDialog(texturesData, formValues), 50);
        },
        nextPreset: function(dir) {
            var allKeys = [];
            for (var k in internalPresets) { if (k !== 'none') allKeys.push(k); }
            for (var k in customPresets) { allKeys.push(k); }
            if (allKeys.length === 0) return;
            
            var formValues = dialog.getFormResult();
            var curr = formValues.active_preset_name || currentFormState.active_preset_name;
            var idx = allKeys.indexOf(curr);
            
            idx += dir;
            if (idx < 0) idx = allKeys.length - 1;
            if (idx >= allKeys.length) idx = 0;
            
            var newKey = allKeys[idx];
            var p = internalPresets[newKey] || customPresets[newKey];
            if (p) {
                this.applyPresetData(newKey, p, formValues);
            }
        },
        cleanupPicker: function() {
            if (this.activePickerHandler) {
                document.removeEventListener('pointerup', this.activePickerHandler, true);
                this.activePickerHandler = null;
            }
        },
        openPresets: function(e) {
            var menuTemplate = [];
            var applyPreset = function(p, name) {
                window.OrionGradientBridge.applyPresetData(name || '', p, dialog.getFormResult());
            };

            var groups = {};
            for (var k in internalPresets) {
                if (k === 'none') continue;
                var prefix = k.split(' ')[0] || '📁';
                var groupName = _t('cat_other');
                if (prefix === '🔥') groupName = '🔥 ' + _t('cat_fire');
                else if (prefix === '🌿') groupName = '🌿 ' + _t('cat_nature');
                else if (prefix === '💧') groupName = '💧 ' + _t('cat_water');
                else if (prefix === '✨') groupName = '✨ ' + _t('cat_magic');
                else if (prefix === '🌆') groupName = '🌆 ' + _t('cat_cyberpunk');
                else if (prefix === '⚙️') groupName = '⚙️ ' + _t('cat_metal');
                else if (prefix === '🌑') groupName = '🌑 ' + _t('cat_dark');
                else if (prefix === '💎') groupName = '💎 ' + _t('cat_gems');
                else if (prefix === '🥩') groupName = '🥩 ' + _t('cat_organic');
                else if (prefix === '🌀') groupName = '🌀 ' + _t('cat_space');
                else if (prefix === '🐉') groupName = '🐉 ' + _t('cat_dragon');
                
                if (!groups[groupName]) groups[groupName] = [];
                groups[groupName].push({name: k, p: internalPresets[k]});
            }

            for (var g in groups) {
                var children = groups[g].map(item => {
                    return {
                        name: item.name,
                        icon: 'color_lens',
                        click: function() { applyPreset(item.p, item.name); }
                    };
                });
                menuTemplate.push({
                    name: g,
                    icon: 'folder',
                    children: children
                });
            }

            if (Object.keys(customPresets).length > 0) {
                menuTemplate.push('_'); // divider
                var customCats = {};
                for (var c in customPresets) {
                    var catName = '💾 ' + (customPresets[c].category || _t('my_presets'));
                    if (!customCats[catName]) customCats[catName] = [];
                    customCats[catName].push({name: c, p: customPresets[c]});
                }
                for (var cg in customCats) {
                    var children = customCats[cg].map(item => {
                        return {
                            name: item.name,
                            icon: 'favorite',
                            children: [
                                {
                                    name: _t('btn_apply'),
                                    icon: 'check',
                                    click: function() { applyPreset(item.p, item.name); }
                                },
                                {
                                    name: _t('btn_delete'),
                                    icon: 'delete',
                                    click: function() {
                                        delete customPresets[item.name];
                                        try {
                                            localStorage.setItem('gradient_studio_presets', JSON.stringify(customPresets));
                                        } catch(err) {}
                                        Blockbench.showQuickMessage(_t('msg_deleted') + ' ' + item.name, 2000);
                                    }
                                }
                            ]
                        };
                    });
                    menuTemplate.push({
                        name: cg,
                        icon: 'folder_special',
                        children: children
                    });
                }
            }

            menuTemplate.push('_');
            menuTemplate.push({
                name: _t('btn_export'),
                icon: 'file_download',
                click: function() { window.OrionGradientBridge.exportPresets(); }
            });
            menuTemplate.push({
                name: _t('btn_import'),
                icon: 'file_upload',
                click: function() { window.OrionGradientBridge.importPresets(); }
            });

            new Menu(menuTemplate).open(e.target);
        },

        exportPresets: function() {
            if (Object.keys(customPresets).length === 0) {
                Blockbench.showQuickMessage(_t('msg_no_export'), 2500);
                return;
            }
            try {
                Blockbench.export({
                    resource_id: 'orion_gradient_presets',
                    type: 'Orion Gradient Presets',
                    extensions: ['json'],
                    name: 'orion_gradient_presets',
                    content: JSON.stringify(customPresets, null, 2)
                });
            } catch (e) {
                Blockbench.showQuickMessage(_t('msg_err_export') + ' ' + e.message, 3000);
            }
        },

        importPresets: function() {
            try {
                Blockbench.import({
                    resource_id: 'orion_gradient_presets',
                    extensions: ['json'],
                    type: 'Orion Gradient Presets',
                    readtype: 'text'
                }, function(files) {
                    try {
                        if (!files || !files.length) return;
                        // Мерж, не перезапись: чужой файл не должен снести свои пресеты
                        var clean = sanitizeCustomPresets(JSON.parse(files[0].content));
                        var added = 0;
                        for (var k in clean) {
                            var key = k.indexOf('💾 ') === 0 ? k : '💾 ' + k;
                            customPresets[key] = clean[k];
                            added++;
                        }
                        if (added > 0) {
                            try {
                                localStorage.setItem('gradient_studio_presets', JSON.stringify(customPresets));
                            } catch(err) {}
                        }
                        Blockbench.showQuickMessage(_t('msg_imported') + ' ' + added, 2500);
                    } catch (e) {
                        Blockbench.showQuickMessage('Ошибка импорта: ' + e.message, 3000);
                    }
                });
            } catch (e) {
                Blockbench.showQuickMessage('Ошибка импорта: ' + e.message, 3000);
            }
        },
        pickColor: function() {
            var formValues = dialog.getFormResult();
            isRebuilding = true;
            dialog.hide();
            restoreOriginalsSync();
            
            if (typeof BarItems !== 'undefined' && BarItems.color_picker) {
                try { BarItems.color_picker.select(); } catch(e){}
            }
            
            Blockbench.showQuickMessage("Кликните на пиксель (ЛКМ) для выбора цвета маски", 4000);
            
            var clickHandler = function(e) {
                if (e.button && e.button !== 0) return; 
                
                setTimeout(function() {
                    window.OrionGradientBridge.cleanupPicker();
                    
                    var pickedHex = '#ffffff';
                    if (typeof ColorPanel !== 'undefined' && typeof ColorPanel.get === 'function') {
                        var c = ColorPanel.get();
                        if (typeof c === 'string') pickedHex = c;
                        else if (c && typeof c.toHexString === 'function') pickedHex = c.toHexString();
                    } else if (typeof ColorPicker !== 'undefined' && ColorPicker.color && typeof ColorPicker.color.getHex === 'function') {
                        pickedHex = ColorPicker.color.getHex();
                    }
                    if (!pickedHex.startsWith('#')) pickedHex = '#' + pickedHex;

                    formValues.mask_color = pickedHex;
                    formValues.use_mask = true;
                    // Без colors переоткрытие диалога падало с TypeError
                    formValues.colors = collectFormColors(formValues, currentFormState.colors.length, isSingleMode);
                    if (formValues.colors.length === 0) formValues.colors = currentFormState.colors.slice();
                    formValues.active_preset_name = currentFormState.active_preset_name;

                    openGradientDialog(texturesData, formValues);
                }, 150);
            };
            
            this.cleanupPicker();
            this.activePickerHandler = clickHandler;
            
            setTimeout(function() {
                document.addEventListener('pointerup', clickHandler, true);
            }, 200);
        },
        addColor: function() {
            var formValues = dialog.getFormResult();
            if (!isSingleMode) {
                var colors = collectFormColors(formValues, currentFormState.colors.length, false);
                if (colors.length === 0) colors = currentFormState.colors.slice();
                if (colors.length < 10) {
                    colors.push('#ffffff'); // Default new color
                    formValues.colors = colors;
                    formValues.active_preset_name = '';
                    isRebuilding = true;
                    dialog.hide();
                    setTimeout(() => openGradientDialog(texturesData, formValues), 50);
                }
            }
        },
        removeColor: function() {
            var formValues = dialog.getFormResult();
            if (!isSingleMode) {
                var colors = collectFormColors(formValues, currentFormState.colors.length, false);
                if (colors.length === 0) colors = currentFormState.colors.slice();
                if (colors.length > 2) {
                    colors.pop();
                    formValues.colors = colors;
                    formValues.active_preset_name = '';
                    isRebuilding = true;
                    dialog.hide();
                    setTimeout(() => openGradientDialog(texturesData, formValues), 50);
                }
            }
        },
        savePreset: function() {
            var formValues = dialog.getFormResult();
            var name = (formValues.preset_name || '').trim();
            if (name.length === 0) {
                Blockbench.showQuickMessage("Введите имя пресета!", 2000);
                return;
            }
            var cat = (formValues.preset_new_category || '').trim() || formValues.preset_category || _t('my_presets');
            if (!name.startsWith('💾 ')) name = '💾 ' + name;

            // Сохраняем только hex-строки: сырые tinycolor-объекты в JSON
            // превращались после перезапуска Blockbench в мусор, и пресеты ломались
            var presetColors = collectFormColors(formValues, currentFormState.colors.length, isSingleMode);
            if (presetColors.length === 0) presetColors = currentFormState.colors.slice();

            customPresets[name] = { colors: presetColors, category: cat };
            try {
                localStorage.setItem('gradient_studio_presets', JSON.stringify(customPresets));
            } catch(e) {}
            Blockbench.showQuickMessage("Пресет сохранен!", 2000);

            formValues.colors = presetColors;
            formValues.active_preset_name = name;
            isRebuilding = true;
            dialog.hide();
            setTimeout(() => openGradientDialog(texturesData, formValues), 50);
        }
    };

    document.addEventListener('click', window.OrionGradientBridge.globalClickHandler);
}


// --- main.js ---
// main.js - Инициализация и регистрация плагина

var recolorAction;
var updateAllTextures;

Plugin.register('gradient_studio_pro', {
    title: 'Gradient Studio PRO',
    author: 'OrionDragon',
    description: 'Advanced hybrid gradient mapping tool with lightness preservation and smart island analysis.',
    about: '<div align="center"><img src="https://raw.githubusercontent.com/OrionTheDragon/blockbench-plugins/master/plugins/gradient_studio_pro.png" width="200" alt="Logo"><h1>Gradient Studio PRO</h1><p><b>[EN]</b> Advanced hybrid gradient mapping tool with lightness preservation and smart island analysis. Processing in background workers allows you to seamlessly recolor complex textures without freezing the editor!</p><p><b>[RU]</b> Продвинутый инструмент градиентного маппинга с сохранением яркости и умным анализом пиксельных островов. Фоновая обработка позволяет перекрашивать текстуры без зависаний редактора!</p><hr><h3>☕ Support the Creator / Поддержать автора</h3><p><i>If this plugin saves your time, you can support its development! / Если плагин сэкономил вам время, вы можете угостить меня кофе!</i></p><a href="https://paypal.me/Dralink96" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white" alt="PayPal"></a>&nbsp;<a href="https://www.donationalerts.com/r/orion_dragon" target="_blank"><img src="https://img.shields.io/badge/Donate-DonationAlerts-FF7D00?style=for-the-badge&logo=coffeescript&logoColor=white" alt="DonationAlerts"></a></div>',
    icon: 'format_paint',
    tags: ['texture', 'color', 'gradient', 'tool'],
    version: '1.0.0',
    variant: 'both',
    onload() {
        updateAllTextures = function() {
            setTimeout(function() {
                if (typeof Texture !== 'undefined' && Texture.all) {
                    Texture.all.forEach(function(tex) {
                        if (typeof Painter === 'object' && typeof Painter.updateTexture === 'function') {
                            Painter.updateTexture(tex);
                        }
                    });
                }
            }, 50);
        };

        Blockbench.on('undo', updateAllTextures);
        Blockbench.on('redo', updateAllTextures);

        recolorAction = new Action('gradient_studio_pro_action', {
            name: _t('action_name'),
            description: _t('action_desc'),
            icon: 'palette',
            keybind: new Keybind({keys: ['shift', 'c']}),
            click: function() {
                // Повторный вызов при открытом диалоге плодил вторые диалоги и слушатели
                if (typeof orionDialogState !== 'undefined' && orionDialogState.open &&
                    document.getElementById('gradient_studio_pro_dialog')) {
                    return;
                }

                // Берём только текстуры ТЕКУЩЕГО проекта: undo-стек в Blockbench у каждой
                // вкладки свой, поэтому правка текстур чужих вкладок ломала там Ctrl+Z.
                var allTex = [];
                if (typeof Texture !== 'undefined' && Array.isArray(Texture.all)) {
                    Texture.all.forEach(function(t) { if (!allTex.includes(t)) allTex.push(t); });
                }
                if (allTex.length === 0 && typeof textures !== 'undefined' && Array.isArray(textures)) {
                    textures.forEach(function(t) { if (!allTex.includes(t)) allTex.push(t); });
                }

                if (allTex.length === 0) {
                    Blockbench.showQuickMessage(_t('msg_no_targets'), 2000);
                    return;
                }

                // Если ничего не выбрано — работаем с текстурой по умолчанию,
                // иначе применение заканчивалось «Применено к 0 текстурам»
                var selectedTex = null;
                try { if (typeof Texture !== 'undefined' && Texture.selected) selectedTex = Texture.selected; } catch(e) {}
                if (!selectedTex && typeof Texture !== 'undefined' && typeof Texture.getDefault === 'function') {
                    try { selectedTex = Texture.getDefault(); } catch(e) {}
                }
                if (!selectedTex || !allTex.includes(selectedTex)) selectedTex = allTex[0];

                var texturesData = [];
                var loadedCount = 0;

                allTex.forEach(function(tex) {
                    var isSelected = (tex === selectedTex);
                    var done = false;

                    var finishLoading = function(imgData, w, h) {
                        if (done) return;
                        done = true;
                        texturesData.push({
                            tex: tex,
                            width: w,
                            height: h,
                            origData: imgData,
                            isSelected: isSelected,
                            touched: false
                        });
                        loadedCount++;
                        if (loadedCount === allTex.length) {
                            if (texturesData.every(function(td) { return !td.origData; })) {
                                Blockbench.showQuickMessage(_t('msg_no_valid'), 3000);
                                return;
                            }
                            openGradientDialog(texturesData);
                        }
                    };

                    try {
                        if (tex.img && tex.img.complete && tex.img.naturalWidth > 0) {
                            var canvas = document.createElement('canvas');
                            canvas.width = tex.img.naturalWidth;
                            canvas.height = tex.img.naturalHeight;
                            var ctx = canvas.getContext('2d');
                            ctx.drawImage(tex.img, 0, 0);
                            finishLoading(ctx.getImageData(0, 0, canvas.width, canvas.height), canvas.width, canvas.height);
                            return;
                        }
                    } catch(e) {}

                    var img = new Image();
                    img.onload = function() {
                        try {
                            var canvas = document.createElement('canvas');
                            canvas.width = Math.max(1, img.width || tex.width || 16);
                            canvas.height = Math.max(1, img.height || tex.height || 16);
                            var ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                            finishLoading(ctx.getImageData(0, 0, canvas.width, canvas.height), canvas.width, canvas.height);
                        } catch(e) {
                            finishLoading(null, 0, 0);
                        }
                    };
                    img.onerror = function() {
                        finishLoading(null, 0, 0);
                    };
                    try {
                        var rawSource = (typeof tex.getBase64 === 'function') ? tex.getBase64() : tex.source;
                        if (typeof rawSource !== 'string' || rawSource.length === 0) throw new Error('Текстура без источника');
                        img.src = rawSource.startsWith('data:') ? rawSource : ('data:image/png;base64,' + rawSource);
                    } catch(e) {
                        finishLoading(null, 0, 0);
                    }
                });
            }
        });

        try {
            MenuBar.menus.edit.addAction(recolorAction);
        } catch(e) {
            console.error("Failed to add action to edit menu", e);
        }
    },
    onunload() {
        if (typeof updateAllTextures === 'function') {
            Blockbench.removeListener('undo', updateAllTextures);
            Blockbench.removeListener('redo', updateAllTextures);
        }
        if (recolorAction) {
            recolorAction.delete();
        }
        if (window.OrionGradientBridge) {
            // Снимаем document-слушатели, иначе они переживают выгрузку плагина
            if (window.OrionGradientBridge.globalClickHandler) {
                document.removeEventListener('click', window.OrionGradientBridge.globalClickHandler);
            }
            if (typeof window.OrionGradientBridge.cleanupPicker === 'function') {
                window.OrionGradientBridge.cleanupPicker();
            }
            delete window.OrionGradientBridge;
        }
        if (typeof orionDialogState !== 'undefined') orionDialogState.open = false;
        if (typeof OrionWorkerPool !== 'undefined' && OrionWorkerPool && typeof OrionWorkerPool.dispose === 'function') {
            OrionWorkerPool.dispose();
        }
    }
});


})();
