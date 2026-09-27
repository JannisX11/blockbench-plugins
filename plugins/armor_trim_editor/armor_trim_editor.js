/**
 * Armor Trim Editor — Blockbench plugin
 * Paint Minecraft armor trims on an accurate player/armor model, preview materials and poses,
 * generate template icons and export everything straight into a resource pack.
 */
(function () {
'use strict';

const PLUGIN_ID = 'armor_trim_editor';
const PLUGIN_VERSION = '1.0.0';
const FORMAT_ID = 'armor_trim';

const TL_PREFIX = 'armor_trim_editor.';
function t(key, variables) {
	return tl(TL_PREFIX + key, variables);
}
(function registerTranslations() {
	let translations = getTranslations();
	for (let lang in translations) {
		let strings = {};
		for (let key in translations[lang]) strings[TL_PREFIX + key] = translations[lang][key];
		Language.addTranslations(lang, strings);
	}
})();

const deletables = [];
const track = (item) => { if (item) deletables.push(item); return item; };

// ============================================================================
// Game data (verified against the 1.21.11 / 26.1 client)
// ============================================================================

// Bone pivots in Blockbench space (Java model space: x -> -x, y -> 24 - y).
const BONES = [
	{id: 'head', origin: [0, 24, 0]},
	{id: 'body', origin: [0, 24, 0]},
	{id: 'right_arm', origin: [5, 22, 0]},
	{id: 'left_arm', origin: [-5, 22, 0]},
	{id: 'right_leg', origin: [1.9, 12, 0]},
	{id: 'left_leg', origin: [-1.9, 12, 0]},
];
const BOXES = {
	head: {from: [-4, 24, -4], to: [4, 32, 4]},
	body: {from: [-4, 12, -2], to: [4, 24, 2]},
	right_arm: {from: [4, 12, -2], to: [8, 24, 2]},
	left_arm: {from: [-8, 12, -2], to: [-4, 24, 2]},
	right_arm_slim: {from: [4, 12, -2], to: [7, 24, 2]},
	left_arm_slim: {from: [-7, 12, -2], to: [-4, 24, 2]},
	right_leg: {from: [-0.1, 0, -2], to: [3.9, 12, 2]},
	left_leg: {from: [-3.9, 0, -2], to: [0.1, 12, 2]},
};

// Armor model: HumanoidModel.createArmorMeshSet(inner 0.5, outer 1.0); legs get an extra -0.1,
// the helmet keeps the "hat" child (+0.5). Left limbs use the mirrored right-side UV.
const PIECES = {
	helmet: {layer: 'humanoid', parts: [
		{key: 'helmet', bone: 'head', box: 'head', inflate: 1.0, uv: [0, 0]},
		{key: 'helmet_outer', bone: 'head', box: 'head', inflate: 1.5, uv: [32, 0]},
	]},
	chestplate: {layer: 'humanoid', parts: [
		{key: 'chest_body', bone: 'body', box: 'body', inflate: 1.0, uv: [16, 16]},
		{key: 'chest_right_arm', bone: 'right_arm', box: 'right_arm', inflate: 1.0, uv: [40, 16]},
		{key: 'chest_left_arm', bone: 'left_arm', box: 'left_arm', inflate: 1.0, uv: [40, 16], mirror: true},
	]},
	leggings: {layer: 'humanoid_leggings', parts: [
		{key: 'legs_waist', bone: 'body', box: 'body', inflate: 0.5, uv: [16, 16]},
		{key: 'legs_right', bone: 'right_leg', box: 'right_leg', inflate: 0.4, uv: [0, 16]},
		{key: 'legs_left', bone: 'left_leg', box: 'left_leg', inflate: 0.4, uv: [0, 16], mirror: true},
	]},
	boots: {layer: 'humanoid', parts: [
		{key: 'boots_right', bone: 'right_leg', box: 'right_leg', inflate: 0.9, uv: [0, 16]},
		{key: 'boots_left', bone: 'left_leg', box: 'left_leg', inflate: 0.9, uv: [0, 16], mirror: true},
	]},
};
const PIECE_ORDER = ['helmet', 'chestplate', 'leggings', 'boots'];
const PART_TO_PIECE = {};
const PARTS = {};
for (let piece of PIECE_ORDER) {
	for (let part of PIECES[piece].parts) {
		PART_TO_PIECE[part.key] = piece;
		PARTS[part.key] = part;
	}
}
// The reference armor sits a hair inside the trim so both never z-fight.
const ARMOR_BASE_SHRINK = 0.02;

const SKIN_PARTS = [
	{key: 'head', bone: 'head', box: 'head', uv: [0, 0]},
	{key: 'hat', bone: 'head', box: 'head', uv: [32, 0], inflate: 0.5, outer: true},
	{key: 'body', bone: 'body', box: 'body', uv: [16, 16]},
	{key: 'jacket', bone: 'body', box: 'body', uv: [16, 32], inflate: 0.25, outer: true},
	{key: 'right_arm', bone: 'right_arm', box: 'right_arm', uv: [40, 16], arm: true},
	{key: 'right_sleeve', bone: 'right_arm', box: 'right_arm', uv: [40, 32], inflate: 0.25, outer: true, arm: true},
	{key: 'left_arm', bone: 'left_arm', box: 'left_arm', uv: [32, 48], arm: true},
	{key: 'left_sleeve', bone: 'left_arm', box: 'left_arm', uv: [48, 48], inflate: 0.25, outer: true, arm: true},
	{key: 'right_leg', bone: 'right_leg', box: 'right_leg', uv: [0, 16]},
	{key: 'right_pants', bone: 'right_leg', box: 'right_leg', uv: [0, 32], inflate: 0.25, outer: true},
	{key: 'left_leg', bone: 'left_leg', box: 'left_leg', uv: [16, 48]},
	{key: 'left_pants', bone: 'left_leg', box: 'left_leg', uv: [0, 48], inflate: 0.25, outer: true},
];

// Pixel areas that the game actually samples: [u, v, width, height, depth] of each box unwrap.
const USED_BOXES = {
	trim_humanoid: [[0, 0, 8, 8, 8], [32, 0, 8, 8, 8], [16, 16, 8, 12, 4], [40, 16, 4, 12, 4], [0, 16, 4, 12, 4]],
	trim_leggings: [[16, 16, 8, 12, 4], [0, 16, 4, 12, 4]],
};
const PIECE_BOXES = {
	helmet: {trim_humanoid: [[0, 0, 8, 8, 8], [32, 0, 8, 8, 8]]},
	chestplate: {trim_humanoid: [[16, 16, 8, 12, 4], [40, 16, 4, 12, 4]]},
	leggings: {trim_leggings: [[16, 16, 8, 12, 4], [0, 16, 4, 12, 4]]},
	boots: {trim_humanoid: [[0, 16, 4, 12, 4]]},
};

const PALETTE_KEY = ['#e0e0e0', '#c0c0c0', '#a0a0a0', '#808080', '#606060', '#404040', '#202020', '#000000'];
const PALETTES = {
	amethyst: ['c98ff3', '9a5cc6', '6c49aa', '523687', '422776', '361c6a', '240c53', '17063b'],
	copper: ['e3826c', 'b4684d', '9a472c', '793c28', '6d3420', '5f2b18', '4c2010', '3d180b'],
	copper_darker: ['7b4135', '6b3628', '592a19', '4c2416', '401e11', '36190f', '29140c', '1b0e08'],
	diamond: ['cbfff5', '6eecd2', '2cbaa8', '1d969a', '0c788d', '076578', '04515f', '013c47'],
	diamond_darker: ['15b3a1', '0a9ca1', '048185', '027472', '065d5b', '095148', '034642', '04403e'],
	emerald: ['82f6ad', '0ec754', '11a036', '107b24', '0e7222', '09631b', '035013', '023d0e'],
	gold: ['fffd90', 'ecd93f', 'deb12d', 'b16712', 'a0450a', '803503', '712d00', '572300'],
	gold_darker: ['c29c2a', 'ba8327', 'a35f14', '89470c', '803503', '712d00', '572300', '3e1b03'],
	iron: ['c5d2d4', 'bfc9c8', '9daaaa', '7b8989', '717d7d', '657070', '576363', '465151'],
	iron_darker: ['a2b0b3', '8a9291', '6f7676', '576363', '3d4949', '313b3b', '2b3434', '1d2828'],
	lapis: ['416e97', '1c4d9c', '21497b', '123365', '112e63', '0c285a', '091e45', '051636'],
	netherite: ['5a575a', '443a3b', '312e31', '2f2727', '231e1e', '1a1616', '100c0c', '090707'],
	netherite_darker: ['2e2829', '282425', '281d1d', '241a1a', '1f1717', '1d1313', '140f0f', '0b0909'],
	quartz: ['f2efed', 'f6eadf', 'e3dbc4', 'b6ad96', '908e80', '656156', '45433c', '2a2822'],
	redstone: ['e62008', 'bd2008', '971607', '781101', '650b01', '520d06', '360803', '1d0502'],
	resin: ['ffc354', 'f69f3b', 'f0852a', 'ec7214', 'db5f10', 'c7490a', 'a53b11', '802a1a'],
};
const VANILLA_PERMUTATIONS = ['quartz', 'iron', 'gold', 'diamond', 'netherite', 'redstone', 'copper', 'emerald', 'lapis', 'amethyst',
	'iron_darker', 'gold_darker', 'diamond_darker', 'netherite_darker', 'copper_darker', 'resin'];

const TRIM_MATERIALS = [
	{id: 'quartz', color: '#E3D4C4', name: t('quartz')},
	{id: 'iron', color: '#ECECEC', name: t('iron'), armor: 'iron'},
	{id: 'netherite', color: '#625859', name: t('netherite'), armor: 'netherite'},
	{id: 'redstone', color: '#971607', name: t('redstone')},
	{id: 'copper', color: '#B4684D', name: t('copper'), armor: 'copper'},
	{id: 'gold', color: '#DEB12D', name: t('gold'), armor: 'gold'},
	{id: 'emerald', color: '#11A036', name: t('emerald')},
	{id: 'diamond', color: '#6EECD2', name: t('diamond'), armor: 'diamond'},
	{id: 'lapis', color: '#416E97', name: t('lapis')},
	{id: 'amethyst', color: '#9A5CC6', name: t('amethyst')},
	{id: 'resin', color: '#FC7812', name: t('resin')},
];

const ARMOR_MATERIALS = [
	{id: 'none', name: t('no_armor'), color: '#000000'},
	{id: 'leather', name: t('leather'), color: '#a06540'},
	{id: 'chainmail', name: t('chainmail'), color: '#8b8b8b'},
	{id: 'iron', name: t('iron_2'), color: '#c6c6c6'},
	{id: 'copper', name: t('copper_2'), color: '#b4684d'},
	{id: 'gold', name: t('gold_2'), color: '#e7c24a'},
	{id: 'diamond', name: t('diamond_2'), color: '#4aedd9'},
	{id: 'netherite', name: t('netherite_2'), color: '#4a4042'},
	{id: 'turtle_scute', name: t('turtle_shell'), color: '#47bf4a', helmet_only: true},
];

const VANILLA_PATTERNS = ['bolt', 'coast', 'dune', 'eye', 'flow', 'host', 'raiser', 'rib', 'sentry', 'shaper', 'silence',
	'snout', 'spire', 'tide', 'vex', 'ward', 'wayfinder', 'wild'];

const DEFAULT_SKINS = ['steve', 'alex', 'ari', 'efe', 'kai', 'makena', 'noor', 'sunny', 'zuri'];
const DEFAULT_SLIM = {alex: true};

const DEFAULT_ICON_ID = 'minecraft:item/{id}_armor_trim_smithing_template';

const PART_NAMES = {
	helmet: t('helmet'),
	helmet_outer: t('helmet_outer_layer'),
	chest_body: t('chestplate_body'),
	chest_right_arm: t('chestplate_right_arm'),
	chest_left_arm: t('chestplate_left_arm'),
	legs_waist: t('leggings_waist'),
	legs_right: t('leggings_right_leg'),
	legs_left: t('leggings_left_leg'),
	boots_right: t('boots_right'),
	boots_left: t('boots_left'),
};
const SKIN_NAMES = {
	head: t('head'), hat: t('hat_layer'),
	body: t('body'), jacket: t('jacket'),
	right_arm: t('right_arm'), right_sleeve: t('right_sleeve'),
	left_arm: t('left_arm'), left_sleeve: t('left_sleeve'),
	right_leg: t('right_leg'), right_pants: t('right_pants'),
	left_leg: t('left_leg'), left_pants: t('left_pants'),
};
const PIECE_NAMES = {
	helmet: t('helmet_2'), chestplate: t('chestplate'),
	leggings: t('leggings'), boots: t('boots'),
};

// ============================================================================
// Small utilities
// ============================================================================

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const rad = (d) => d * Math.PI / 180;
const deg = (r) => r * 180 / Math.PI;

function hexToRgb(hex) {
	hex = String(hex).replace('#', '');
	if (hex.length == 3) hex = hex.split('').map(c => c + c).join('');
	let n = parseInt(hex.substring(0, 6), 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r, g, b) {
	return '#' + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
}
function rgbToHsl(r, g, b) {
	r /= 255; g /= 255; b /= 255;
	let max = Math.max(r, g, b), min = Math.min(r, g, b);
	let h = 0, s = 0, l = (max + min) / 2;
	if (max != min) {
		let d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		if (max == r) h = (g - b) / d + (g < b ? 6 : 0);
		else if (max == g) h = (b - r) / d + 2;
		else h = (r - g) / d + 4;
		h /= 6;
	}
	return [h, s, l];
}
function hslToRgb(h, s, l) {
	h = ((h % 1) + 1) % 1; s = clamp(s, 0, 1); l = clamp(l, 0, 1);
	if (s == 0) return [l * 255, l * 255, l * 255];
	const hue2rgb = (p, q, t) => {
		if (t < 0) t += 1; if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};
	let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	let p = 2 * l - q;
	return [hue2rgb(p, q, h + 1 / 3) * 255, hue2rgb(p, q, h) * 255, hue2rgb(p, q, h - 1 / 3) * 255];
}
function luminance(r, g, b) {
	return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function makeCanvas(w, h) {
	let canvas = document.createElement('canvas');
	canvas.width = w; canvas.height = h;
	let ctx = canvas.getContext('2d', {willReadFrequently: true});
	ctx.imageSmoothingEnabled = false;
	return {canvas, ctx};
}
function loadImage(src) {
	return new Promise((resolve, reject) => {
		let img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error('Could not load image'));
		img.src = src;
	});
}
async function dataURLToCanvas(url) {
	let img = await loadImage(url);
	let {canvas, ctx} = makeCanvas(img.naturalWidth, img.naturalHeight);
	ctx.drawImage(img, 0, 0);
	return canvas;
}
function blankDataURL(w, h) {
	return makeCanvas(w, h).canvas.toDataURL('image/png');
}
function bufferToDataURL(buffer) {
	return 'data:image/png;base64,' + Buffer.from(buffer).toString('base64');
}
function dataURLToBuffer(url) {
	return Buffer.from(url.substring(url.indexOf(',') + 1), 'base64');
}
function deepDefaults(target, defaults) {
	if (!target || typeof target != 'object') target = {};
	for (let key in defaults) {
		let dv = defaults[key];
		if (dv && typeof dv == 'object' && !Array.isArray(dv)) {
			target[key] = deepDefaults(target[key], dv);
		} else if (target[key] === undefined) {
			target[key] = dv;
		}
	}
	return target;
}
function parseResourceId(id, fallback_ns = 'minecraft') {
	id = String(id || '').trim();
	let i = id.indexOf(':');
	if (i == -1) return {ns: fallback_ns, path: id};
	return {ns: id.substring(0, i) || fallback_ns, path: id.substring(i + 1)};
}
function normalizeId(id) {
	let p = parseResourceId(id);
	return p.ns + ':' + p.path;
}
function isValidPath(path) {
	return /^[a-z0-9_.\-\/]+$/.test(path) && !path.startsWith('/') && !path.includes('//');
}
function isValidNamespace(ns) {
	return /^[a-z0-9_.\-]+$/.test(ns);
}
function sanitizeId(text) {
	return String(text || '').toLowerCase().trim().replace(/[\s]+/g, '_').replace(/[^a-z0-9_.\-]/g, '');
}
function boxRects(u, v, w, h, d) {
	return [[u + d, v, w, d], [u + d + w, v, w, d], [u, v + d, 2 * (d + w), h]];
}
function escapeHTML(text) {
	return String(text).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
}
function notify(text, time = 2200) {
	Blockbench.showQuickMessage(text, time);
}
function showError(title, err) {
	console.error('[Trim Editor]', err);
	Blockbench.showMessageBox({title, icon: 'error', message: escapeHTML(err && err.message ? err.message : String(err))});
}

// ============================================================================
// File system (desktop) and global preferences
// ============================================================================

const PathModule = (typeof isApp != 'undefined' && isApp) ? require('path') : null;
let fs_module = null;
function getFS() {
	if (fs_module) return fs_module;
	if (!isApp) throw new Error(t('file_access_requires_the_desktop_app'));
	fs_module = require('fs', {message: t('needed_to_read_the_minecraft_jar_skins')});
	if (!fs_module) throw new Error(t('file_access_was_denied'));
	return fs_module;
}
function pathExists(path) {
	try { return !!path && getFS().existsSync(path); } catch (e) { return false; }
}
function isDirectory(path) {
	try { return getFS().statSync(path).isDirectory(); } catch (e) { return false; }
}
function readDir(path) {
	try { return getFS().readdirSync(path); } catch (e) { return []; }
}
function ensureDir(dir) {
	let fs = getFS();
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});
}
function revealInFolder(path) {
	let shell = require('shell', {message: t('to_reveal_the_exported_trim_in_the_file')});
	if (shell) shell.showItemInFolder(path);
}

const Prefs = {
	key: 'armor_trim_editor_prefs',
	get() {
		try { return JSON.parse(localStorage.getItem(this.key)) || {}; } catch (e) { return {}; }
	},
	set(patch) {
		let data = Object.assign(this.get(), patch);
		try { localStorage.setItem(this.key, JSON.stringify(data)); } catch (e) {}
		return data;
	}
};

// ============================================================================
// Vanilla assets from the Minecraft client jar
// ============================================================================

const Assets = {
	path: '',
	zip: null,
	opening: null,
	cache: new Map(),

	candidates() {
		let found = [];
		if (!isApp) return found;
		let P = PathModule;
		let home = SystemInfo.home_directory;
		let platform = SystemInfo.platform;
		let appdata = SystemInfo.appdata_directory || P.join(home, 'AppData', 'Roaming');
		let seen = new Set();
		let add = (path, version, source) => {
			if (seen.has(path) || !/^\d+(\.\d+)+$/.test(version)) return;
			seen.add(path);
			if (pathExists(path)) found.push({path, version, source});
		};
		let addVersionsDir = (dir, source) => {
			for (let v of readDir(dir)) add(P.join(dir, v, v + '.jar'), v, source);
		};
		let addLibraries = (root) => {
			let libs = P.join(root, 'libraries', 'com', 'mojang', 'minecraft');
			for (let v of readDir(libs)) add(P.join(libs, v, `minecraft-${v}-client.jar`), v, P.basename(root));
		};

		// Jars downloaded by other Blockbench plugins
		let bb_cache = P.join(SystemInfo.user_data_directory || P.join(appdata, 'Blockbench'), 'minecraft_assets_cache');
		for (let file of readDir(bb_cache)) {
			let m = file.match(/^(\d+\.\d+(?:\.\d+)?)\.jar$/);
			if (m) add(P.join(bb_cache, file), m[1], 'Blockbench');
		}

		// Official launcher
		let minecraft_dir = platform == 'win32' ? P.join(appdata, '.minecraft')
			: platform == 'darwin' ? P.join(home, 'Library', 'Application Support', 'minecraft')
			: P.join(home, '.minecraft');
		addVersionsDir(P.join(minecraft_dir, 'versions'), 'Minecraft Launcher');

		// MultiMC-style launchers keep client jars in a libraries folder
		let roots = [];
		if (platform == 'win32') {
			let local = P.join(home, 'AppData', 'Local');
			roots.push(P.join(appdata, 'PrismLauncher'), P.join(appdata, 'PolyMC'), P.join(local, 'Programs', 'PrismLauncher'));
			// Portable installs: look one level into the usual places
			let bases = ['C:/Program Files', 'C:/Program Files (x86)', 'C:/Games', home,
				P.join(home, 'Desktop'), P.join(home, 'Documents'), P.join(home, 'Downloads')];
			for (let base of bases) {
				for (let entry of readDir(base)) {
					if (!/multimc|mmc|prism|polymc/i.test(entry)) continue;
					let dir = P.join(base, entry);
					roots.push(dir, P.join(dir, 'MultiMC'), P.join(dir, 'PrismLauncher'));
				}
			}
		} else if (platform == 'darwin') {
			let support = P.join(home, 'Library', 'Application Support');
			roots.push(P.join(support, 'PrismLauncher'), P.join(support, 'PolyMC'), P.join(support, 'MultiMC'));
		} else {
			let share = P.join(home, '.local', 'share');
			roots.push(P.join(share, 'PrismLauncher'), P.join(share, 'PolyMC'), P.join(share, 'multimc'),
				P.join(home, '.var', 'app', 'org.prismlauncher.PrismLauncher', 'data', 'PrismLauncher'));
		}
		for (let root of roots) addLibraries(root);

		let cmp = (a, b) => {
			let pa = a.split('.').map(Number), pb = b.split('.').map(Number);
			for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
				if ((pa[i] || 0) != (pb[i] || 0)) return (pb[i] || 0) - (pa[i] || 0);
			}
			return 0;
		};
		found.sort((a, b) => cmp(a.version, b.version));
		return found;
	},
	resolvePath() {
		let saved = Prefs.get().jar_path;
		if (saved && pathExists(saved)) return saved;
		let list = this.candidates();
		return list[0] ? list[0].path : '';
	},
	setPath(path) {
		Prefs.set({jar_path: path});
		this.zip = null;
		this.path = '';
		this.cache.clear();
	},
	async open() {
		if (this.zip) return this.zip;
		if (this.opening) return this.opening;
		this.opening = (async () => {
			let path = this.resolvePath();
			if (!path) {
				throw new Error(t('minecraft_client_jar_not_found_set_it_in'));
			}
			let buffer = getFS().readFileSync(path);
			this.zip = await JSZip.loadAsync(buffer);
			this.path = path;
			return this.zip;
		})();
		try {
			return await this.opening;
		} finally {
			this.opening = null;
		}
	},
	async image(paths) {
		if (!Array.isArray(paths)) paths = [paths];
		for (let path of paths) {
			if (this.cache.has(path)) return this.cache.get(path);
		}
		let zip = await this.open();
		for (let path of paths) {
			let file = zip.file(path);
			if (!file) continue;
			let url = 'data:image/png;base64,' + await file.async('base64');
			this.cache.set(path, url);
			return url;
		}
		return null;
	},
	skin(id, slim) {
		let variant = slim ? 'slim' : 'wide';
		return this.image([
			`assets/minecraft/textures/entity/player/${variant}/${id}.png`,
			`assets/minecraft/textures/entity/player/${slim ? 'wide' : 'slim'}/${id}.png`,
		]);
	},
	armor(material, layer) {
		let legacy = {humanoid: '_layer_1', humanoid_leggings: '_layer_2'}[layer];
		let legacy_name = material == 'turtle_scute' ? 'turtle' : material;
		return this.image([
			`assets/minecraft/textures/entity/equipment/${layer}/${material}.png`,
			`assets/minecraft/textures/models/armor/${legacy_name}${legacy}.png`,
		]);
	},
	trim(pattern, layer) {
		return this.image([`assets/minecraft/textures/trims/entity/${layer}/${pattern}.png`, `assets/minecraft/textures/trims/models/armor/${pattern}${layer == 'humanoid' ? '' : '_leggings'}.png`]);
	},
	template(pattern) {
		let name = pattern == 'netherite_upgrade' ? 'netherite_upgrade_smithing_template' : pattern + '_armor_trim_smithing_template';
		return this.image(`assets/minecraft/textures/item/${name}.png`);
	},
};

// ============================================================================
// Project data
// ============================================================================

const DATA_VERSION = 3;
function defaultData() {
	let prefs = Prefs.get();
	return {
		version: DATA_VERSION,
		trim_id: 'new_trim',
		resolution: 1,
		view: {
			pieces: {helmet: true, chestplate: true, leggings: true, boots: true},
			helmet_inner: true,
			helmet_outer: true,
			layers: {trim: true, armor: true, skin: true, skin_outer: true, icon: true},
		},
		armor: {material: 'diamond', leather_color: '#a06540'},
		preview: {material: 'none', highlight: false},
		skin: {source: 'default', id: 'steve', slim: false, name: ''},
		pose: {id: 'default', speed: 1, paused: false, head_yaw: 0, head_pitch: 0},
		mc_version: prefs.mc_version || DEFAULT_MC_VERSION,
		export: {
			pack_type: prefs.pack_type || 'zip',
			pack_path: prefs.pack_path || '',
			zip_dir: prefs.zip_dir || '',
			zip_name: prefs.zip_name || 'armor_trims',
			namespace: prefs.namespace || 'minecraft',
			register_atlas: true,
			sync_permutations: true,
			icon: true,
			icon_texture: prefs.icon_texture || DEFAULT_ICON_ID,
			icon_model: prefs.icon_model || DEFAULT_ICON_ID,
			icon_parent: prefs.icon_parent || 'minecraft:item/generated',
			backup: true,
		},
		icon_gen: {base: 'sentry', body: '#6a3fb0', accent: '#4bc9c9', glyph: 'recolor', contrast: 1},
		datapack: {dir: prefs.datapack_dir || '', name: prefs.datapack_name || 'armor_trims', decal: false, names: ''},
	};
}
function isTrimProject(project = Project) {
	return !!(project && project.format && project.format.id == FORMAT_ID);
}
function D() {
	if (!isTrimProject()) return null;
	let data = Project.armor_trim_editor;
	if (!data || !data.view || !(data.version >= DATA_VERSION)) {
		data = data || {};
		// Projects from before zip export wrote into a resource pack folder
		if (data.export && data.export.pack_path && !data.export.pack_type) data.export.pack_type = 'folder';
		if (data.datapack && data.datapack.version && !data.mc_version) data.mc_version = data.datapack.version;
		// Fill settings added in newer versions without touching existing ones
		Project.armor_trim_editor = deepDefaults(data, defaultData());
		Project.armor_trim_editor.version = DATA_VERSION;
	}
	return Project.armor_trim_editor;
}
function findTexture(role) {
	return Texture.all.find(t => t.trim_role == role);
}
function findBone(id) {
	return Group.all.find(g => g.name == id && !(g.parent instanceof Group));
}
function roleCubes(prefix) {
	return Cube.all.filter(c => c.trim_role && c.trim_role.startsWith(prefix));
}
function trimTextures() {
	return Texture.all.filter(t => t.trim_role == 'trim_humanoid' || t.trim_role == 'trim_leggings');
}

// ============================================================================
// Model construction
// ============================================================================

function createTexture(role, name, data_url, uv_w, uv_h) {
	let texture = new Texture({name, trim_role: role, uv_width: uv_w, uv_height: uv_h, internal: true});
	texture.fromDataURL(data_url).add(false);
	return texture;
}
function setTextureImage(texture, data_url) {
	return new Promise((resolve) => {
		let done = false;
		let finish = () => {
			if (done) return;
			done = true;
			texture.saved = true;
			resolve(texture);
		};
		texture.img.addEventListener('load', () => setTimeout(finish, 20), {once: true});
		texture.internal = true;
		texture.updateSource(data_url);
		setTimeout(finish, 1500);
	});
}
function makeBoxCube(name, role, box, options, texture, group) {
	let cube = new Cube({
		name,
		trim_role: role,
		from: box.from.slice(),
		to: box.to.slice(),
		inflate: options.inflate || 0,
		box_uv: true,
		uv_offset: options.uv.slice(),
		mirror_uv: !!options.mirror,
		locked: !!options.locked,
		color: options.color || 0,
	});
	cube.addTo(group).init();
	for (let face in cube.faces) {
		cube.faces[face].texture = texture ? texture.uuid : null;
	}
	return cube;
}

async function buildTrimProject(opts) {
	let data = D();
	Object.assign(data, {trim_id: opts.trim_id, resolution: opts.resolution || 1});
	if (opts.export) Object.assign(data.export, opts.export);
	if (opts.armor) data.armor.material = opts.armor;
	if (opts.skin) Object.assign(data.skin, opts.skin);

	let res = data.resolution;
	Project.name = opts.trim_id;
	Project.texture_width = 64;
	Project.texture_height = 32;
	Project.box_uv = true;

	let tex_h = createTexture('trim_humanoid', 'humanoid', opts.humanoid || blankDataURL(64 * res, 32 * res), 64, 32);
	let tex_l = createTexture('trim_leggings', 'humanoid_leggings', opts.leggings || blankDataURL(64 * res, 32 * res), 64, 32);
	let tex_icon = createTexture('icon', 'icon', opts.icon || blankDataURL(16 * res, 16 * res), 16, 16);
	let tex_armor_h = createTexture('armor_humanoid', t('armor_preview'), blankDataURL(64, 32), 64, 32);
	let tex_armor_l = createTexture('armor_leggings', t('armor_leggings_preview'), blankDataURL(64, 32), 64, 32);
	let tex_skin = createTexture('skin', t('skin_preview'), opts.skin_data || blankDataURL(64, 64), 64, 64);

	let groups = {};
	for (let bone of BONES) {
		let group = new Group({name: bone.id, origin: bone.origin.slice()});
		group.init();
		group.addTo();
		group.isOpen = false;
		groups[bone.id] = group;
	}

	let trim_name = t('trim'), armor_name = t('armor'), skin_name = t('skin');
	for (let piece of PIECE_ORDER) {
		let def = PIECES[piece];
		let texture = def.layer == 'humanoid' ? tex_h : tex_l;
		for (let part of def.parts) {
			makeBoxCube(`${trim_name}: ${PART_NAMES[part.key]}`, 'trim/' + part.key, BOXES[part.box],
				{inflate: part.inflate, uv: part.uv, mirror: part.mirror, color: 1}, texture, groups[part.bone]);
		}
	}
	for (let piece of PIECE_ORDER) {
		let def = PIECES[piece];
		let texture = def.layer == 'humanoid' ? tex_armor_h : tex_armor_l;
		for (let part of def.parts) {
			makeBoxCube(`${armor_name}: ${PART_NAMES[part.key]}`, 'armor/' + part.key, BOXES[part.box],
				{inflate: part.inflate - ARMOR_BASE_SHRINK, uv: part.uv, mirror: part.mirror, locked: true, color: 5}, texture, groups[part.bone]);
		}
	}
	for (let part of SKIN_PARTS) {
		let box = BOXES[part.box + (part.arm && data.skin.slim ? '_slim' : '')];
		makeBoxCube(`${skin_name}: ${SKIN_NAMES[part.key]}`, 'skin/' + part.key, box,
			{inflate: part.inflate || 0, uv: part.uv, locked: true, color: 0}, tex_skin, groups[part.bone]);
	}

	// Item icon, shown as a flat card next to the player
	let icon_cube = new Cube({
		name: t('item_icon'),
		trim_role: 'icon',
		from: [-42, 10, 0], to: [-26, 26, 0],
		box_uv: false,
		color: 2,
	});
	icon_cube.addTo().init();
	for (let face in icon_cube.faces) {
		icon_cube.faces[face].texture = null;
	}
	icon_cube.faces.north.texture = tex_icon.uuid;
	icon_cube.faces.north.uv = [0, 0, 16, 16];
	icon_cube.faces.south.texture = tex_icon.uuid;
	icon_cube.faces.south.uv = [16, 0, 0, 16];

	Canvas.updateAll();
	tex_h.select();

	await Promise.all([refreshSkin(false), refreshArmor(false)]);
	applyVisibility();
	updatePreviewUniforms();
	Project.saved = true;
}

function startNewTrim(opts) {
	if (!newProject(Formats[FORMAT_ID])) return;
	Project.armor_trim_editor = deepDefaults({}, defaultData());
	buildTrimProject(opts).then(() => {
		Modes.options.paint.select();
		refreshPanels();
	}).catch(err => showError(t('could_not_create_trim'), err));
}

// ============================================================================
// Skin & reference armor
// ============================================================================

function fallbackSkin() {
	// Plain mannequin used when no Minecraft jar is available
	let {canvas, ctx} = makeCanvas(64, 64);
	let paint = (box, top, side) => {
		let [u, v, w, h, d] = box;
		ctx.fillStyle = top;
		ctx.fillRect(u + d, v, w * 2, d);
		ctx.fillStyle = side;
		ctx.fillRect(u, v + d, 2 * (d + w), h);
	};
	paint([0, 0, 8, 8, 8], '#b98f6c', '#c9a07c');
	paint([16, 16, 8, 12, 4], '#56708f', '#607d9e');
	paint([40, 16, 4, 12, 4], '#b98f6c', '#c9a07c');
	paint([32, 48, 4, 12, 4], '#b98f6c', '#c9a07c');
	paint([0, 16, 4, 12, 4], '#3c465e', '#46516b');
	paint([16, 48, 4, 12, 4], '#3c465e', '#46516b');
	ctx.fillStyle = '#2b2b33';
	ctx.fillRect(9, 12, 2, 1);
	ctx.fillRect(13, 12, 2, 1);
	return canvas.toDataURL('image/png');
}
async function getSkinDataURL(skin) {
	if (skin.source == 'default') {
		let url = null;
		try {
			url = await Assets.skin(skin.id, skin.slim);
		} catch (err) {
			console.warn('[Trim Editor] skin:', err);
		}
		return url || fallbackSkin();
	}
	return null;
}
async function normalizeSkin(data_url) {
	let canvas = await dataURLToCanvas(data_url);
	let w = canvas.width, h = canvas.height;
	if (w == h * 2) {
		// Legacy 64x32 skin: rebuild the 64x64 layout the same way the game does
		let s = w / 64;
		let {canvas: out, ctx} = makeCanvas(w, w);
		ctx.drawImage(canvas, 0, 0);
		let copyFlipped = (sx, sy, sw, sh, dx, dy) => {
			ctx.save();
			ctx.translate((dx + sw) * s, dy * s);
			ctx.scale(-1, 1);
			ctx.drawImage(canvas, sx * s, sy * s, sw * s, sh * s, 0, 0, sw * s, sh * s);
			ctx.restore();
		};
		copyFlipped(4, 16, 4, 4, 20, 48); copyFlipped(8, 16, 4, 4, 24, 48);
		copyFlipped(0, 20, 4, 12, 24, 52); copyFlipped(4, 20, 4, 12, 20, 52);
		copyFlipped(8, 20, 4, 12, 16, 52); copyFlipped(12, 20, 4, 12, 28, 52);
		copyFlipped(44, 16, 4, 4, 36, 48); copyFlipped(48, 16, 4, 4, 40, 48);
		copyFlipped(40, 20, 4, 12, 40, 52); copyFlipped(44, 20, 4, 12, 36, 52);
		copyFlipped(48, 20, 4, 12, 32, 52); copyFlipped(52, 20, 4, 12, 44, 52);
		return out.toDataURL('image/png');
	}
	return canvas.toDataURL('image/png');
}
async function detectSlim(data_url) {
	let canvas = await dataURLToCanvas(data_url);
	if (canvas.width != canvas.height) return false;
	let s = canvas.width / 64;
	let pixels = canvas.getContext('2d').getImageData(54 * s, 20 * s, 2 * s, 12 * s).data;
	for (let i = 3; i < pixels.length; i += 4) {
		if (pixels[i] != 0) return false;
	}
	return true;
}
async function refreshSkin(update = true) {
	let data = D();
	let texture = findTexture('skin');
	if (!data || !texture) return;
	try {
		let url = await getSkinDataURL(data.skin);
		if (url) await setTextureImage(texture, url);
	} catch (err) {
		console.warn('[Trim Editor] skin:', err);
		if (update) notify(err.message || String(err), 3500);
	}
	applySkinModel();
	if (update) refreshPanels();
}
async function setCustomSkin(data_url, slim, source, name) {
	let data = D();
	let texture = findTexture('skin');
	if (!data || !texture) return;
	data_url = await normalizeSkin(data_url);
	if (slim === undefined) slim = await detectSlim(data_url);
	Object.assign(data.skin, {source, slim, name: name || ''});
	await setTextureImage(texture, data_url);
	applySkinModel();
	refreshPanels();
}
async function blobToDataURL(blob) {
	return new Promise((resolve, reject) => {
		let reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}
async function loadPlayerSkin(name) {
	let url = null, slim;
	try {
		let profile = await (await fetch('https://api.mojang.com/users/profiles/minecraft/' + encodeURIComponent(name))).json();
		if (profile && profile.id) {
			let session = await (await fetch('https://sessionserver.mojang.com/session/minecraft/profile/' + profile.id)).json();
			let prop = (session.properties || []).find(p => p.name == 'textures');
			let textures = JSON.parse(atob(prop.value)).textures;
			if (textures.SKIN) {
				let skin_response = await fetch(textures.SKIN.url.replace(/^http:/, 'https:'));
				url = await blobToDataURL(await skin_response.blob());
				slim = !!(textures.SKIN.metadata && textures.SKIN.metadata.model == 'slim');
				name = profile.name || name;
			}
		}
	} catch (err) {
		console.warn('[Trim Editor] Mojang API:', err);
	}
	if (!url) {
		let response = await fetch('https://mc-heads.net/skin/' + encodeURIComponent(name), {cache: 'no-cache'});
		if (!response.ok) throw new Error(t('player_not_found') + ' (HTTP ' + response.status + ')');
		url = await blobToDataURL(await response.blob());
	}
	await setCustomSkin(url, slim, 'player', name);
}
function applySkinModel() {
	let data = D();
	if (!data) return;
	let changed = [];
	for (let part of SKIN_PARTS) {
		if (!part.arm) continue;
		let cube = Cube.all.find(c => c.trim_role == 'skin/' + part.key);
		if (!cube) continue;
		let box = BOXES[part.box + (data.skin.slim ? '_slim' : '')];
		if (!cube.from.equals(box.from) || !cube.to.equals(box.to)) {
			cube.from.replace(box.from);
			cube.to.replace(box.to);
			changed.push(cube);
		}
	}
	if (changed.length) {
		Canvas.updateView({elements: changed, element_aspects: {geometry: true, uv: true, faces: true}});
	}
}

function tintCanvas(source, color) {
	let [tr_, tg, tb] = hexToRgb(color);
	let {canvas, ctx} = makeCanvas(source.width, source.height);
	ctx.drawImage(source, 0, 0);
	let image = ctx.getImageData(0, 0, canvas.width, canvas.height);
	let px = image.data;
	for (let i = 0; i < px.length; i += 4) {
		px[i] = px[i] * tr_ / 255;
		px[i + 1] = px[i + 1] * tg / 255;
		px[i + 2] = px[i + 2] * tb / 255;
	}
	ctx.putImageData(image, 0, 0);
	return canvas;
}
function fallbackArmor(color, layer) {
	let {canvas, ctx} = makeCanvas(64, 32);
	let [r, g, b] = hexToRgb(color);
	let boxes = layer == 'humanoid' ? [[0, 0, 8, 8, 8], [16, 16, 8, 12, 4], [40, 16, 4, 12, 4], [0, 16, 4, 12, 4]] : USED_BOXES.trim_leggings;
	for (let box of boxes) {
		for (let [x, y, w, h] of boxRects(...box)) {
			ctx.fillStyle = rgbToHex(r * 0.75, g * 0.75, b * 0.75);
			ctx.fillRect(x, y, w, h);
			ctx.fillStyle = rgbToHex(r, g, b);
			ctx.fillRect(x + 1, y + 1, Math.max(0, w - 2), Math.max(0, h - 2));
		}
	}
	return canvas.toDataURL('image/png');
}
async function armorDataURL(material, layer, leather_color) {
	let def = ARMOR_MATERIALS.find(m => m.id == material);
	if (!def || material == 'none') return blankDataURL(64, 32);
	if (def.helmet_only && layer == 'humanoid_leggings') return blankDataURL(64, 32);
	let url = null;
	try {
		url = await Assets.armor(material, layer);
		if (url && material == 'leather') {
			let base = tintCanvas(await dataURLToCanvas(url), leather_color || '#a06540');
			let overlay_url = await Assets.image([
				`assets/minecraft/textures/entity/equipment/${layer}/leather_overlay.png`,
				`assets/minecraft/textures/models/armor/leather${layer == 'humanoid' ? '_layer_1' : '_layer_2'}_overlay.png`,
			]);
			if (overlay_url) base.getContext('2d').drawImage(await dataURLToCanvas(overlay_url), 0, 0);
			url = base.toDataURL('image/png');
		}
	} catch (err) {
		console.warn('[Trim Editor] armor:', err);
	}
	return url || fallbackArmor(def.color, layer);
}
async function refreshArmor(update = true) {
	let data = D();
	if (!data) return;
	let mat = data.armor.material;
	let tex_h = findTexture('armor_humanoid'), tex_l = findTexture('armor_leggings');
	if (tex_h) await setTextureImage(tex_h, await armorDataURL(mat, 'humanoid', data.armor.leather_color));
	if (tex_l) await setTextureImage(tex_l, await armorDataURL(mat, 'humanoid_leggings', data.armor.leather_color));
	applyVisibility();
	updatePreviewUniforms();
	if (update) refreshPanels();
}

// ============================================================================
// Visibility
// ============================================================================

function applyVisibility() {
	let data = D();
	if (!data) return;
	let view = data.view;
	let armor_def = ARMOR_MATERIALS.find(m => m.id == data.armor.material) || ARMOR_MATERIALS[0];
	let changed = [];
	for (let cube of Cube.all) {
		let role = cube.trim_role;
		if (!role) continue;
		let [kind, key] = role.split('/');
		let visible = true;
		if (kind == 'trim' || kind == 'armor') {
			let piece = PART_TO_PIECE[key];
			visible = !!(view.pieces[piece] && view.layers[kind]);
			if (key == 'helmet') visible = visible && view.helmet_inner;
			if (key == 'helmet_outer') visible = visible && view.helmet_outer;
			if (kind == 'armor') {
				if (armor_def.id == 'none') visible = false;
				if (armor_def.helmet_only && piece != 'helmet') visible = false;
			}
		} else if (kind == 'skin') {
			let part = SKIN_PARTS.find(p => p.key == key);
			visible = !!(view.layers.skin && (!part || !part.outer || view.layers.skin_outer));
		} else if (kind == 'icon') {
			visible = !!view.layers.icon;
		}
		if (cube.visibility != visible) {
			cube.visibility = visible;
			changed.push(cube);
		}
	}
	if (changed.length) {
		Canvas.updateView({elements: changed, element_aspects: {visibility: true}});
	}
}

// ============================================================================
// Material preview: palette swap inside the texture shader
// ============================================================================

const SHADER_UNIFORMS = 'uniform int TRIM_MODE;\nuniform vec3 TRIM_KEYS[8];\nuniform vec3 TRIM_VALS[8];\nuniform int TRIM_DECAL;\nuniform sampler2D TRIM_ARMOR_MAP;\n';
const SHADER_CODE = `
	if (TRIM_DECAL == 1 && texture2D(TRIM_ARMOR_MAP, vUv).a < 0.1) discard;
	if (TRIM_MODE > 0 && color.a > 0.0) {
		int trim_hit = -1;
		for (int ti = 0; ti < 8; ti++) {
			vec3 td = abs(color.rgb - TRIM_KEYS[ti]);
			if (trim_hit < 0 && td.r < 0.003 && td.g < 0.003 && td.b < 0.003) trim_hit = ti;
		}
		if (TRIM_MODE == 1 || TRIM_MODE == 3) {
			for (int ti = 0; ti < 8; ti++) {
				if (ti == trim_hit) color.rgb = TRIM_VALS[ti];
			}
		}
		if (TRIM_MODE >= 2) {
			if (trim_hit >= 0) {
				color.rgb = mix(color.rgb, vec3(1.0, 0.15, 0.85), 0.45);
			} else {
				color.rgb = mix(color.rgb, vec3(0.1, 0.9, 1.0), 0.45);
			}
		}
	}
`;
const COLOR_LINE = /vec4\s+color\s*=\s*texture2D\(\s*map\s*,\s*vUv\s*\)\s*;/;

function patchMaterial(texture) {
	let material = texture.getOwnMaterial ? texture.getOwnMaterial() : texture.material;
	if (!material || !material.uniforms) return false;
	if (material.uniforms.TRIM_MODE) return true;
	if (!COLOR_LINE.test(material.fragmentShader)) return false;
	material.userData.trim_original_shader = material.fragmentShader;
	material.uniforms.TRIM_MODE = {value: 0};
	material.uniforms.TRIM_KEYS = {value: PALETTE_KEY.map(hex => new THREE.Vector3(...hexToRgb(hex).map(v => v / 255)))};
	material.uniforms.TRIM_VALS = {value: PALETTE_KEY.map(hex => new THREE.Vector3(...hexToRgb(hex).map(v => v / 255)))};
	material.uniforms.TRIM_DECAL = {value: 0};
	material.uniforms.TRIM_ARMOR_MAP = {value: null};
	material.fragmentShader = material.fragmentShader
		.replace(/void\s+main\s*\(\s*(void)?\s*\)\s*\{/, (m) => SHADER_UNIFORMS + m)
		.replace(COLOR_LINE, (m) => m + SHADER_CODE);
	material.needsUpdate = true;
	return true;
}
function unpatchMaterial(texture) {
	let material = texture.getOwnMaterial ? texture.getOwnMaterial() : texture.material;
	if (!material || !material.uniforms || !material.uniforms.TRIM_MODE) return;
	material.fragmentShader = material.userData.trim_original_shader;
	delete material.uniforms.TRIM_MODE;
	delete material.uniforms.TRIM_KEYS;
	delete material.uniforms.TRIM_VALS;
	delete material.uniforms.TRIM_DECAL;
	delete material.uniforms.TRIM_ARMOR_MAP;
	material.needsUpdate = true;
}
function armorMapFor(trim_texture) {
	// Trim and reference armor share the UV layout, so the armor texel at the same UV tells whether armor is there
	let armor = findTexture(trim_texture.trim_role == 'trim_leggings' ? 'armor_leggings' : 'armor_humanoid');
	let material = armor && armor.getOwnMaterial && armor.getOwnMaterial();
	return material ? material.map : null;
}
function effectivePaletteId(material_id, armor_id) {
	let def = TRIM_MATERIALS.find(m => m.id == material_id);
	if (def && def.armor && def.armor == armor_id && PALETTES[material_id + '_darker']) return material_id + '_darker';
	return material_id;
}
function updatePreviewUniforms() {
	let data = D();
	if (!data) return;
	let palette_id = data.preview.material != 'none' ? effectivePaletteId(data.preview.material, data.armor.material) : null;
	let palette = palette_id && PALETTES[palette_id];
	let mode = (palette ? 1 : 0) + (data.preview.highlight ? 2 : 0);
	// Without reference armor there is nothing to clip against, so the decal preview stays off
	let decal = !!data.datapack.decal && data.armor.material != 'none';
	for (let texture of trimTextures()) {
		if (!patchMaterial(texture)) continue;
		let uniforms = texture.getOwnMaterial().uniforms;
		uniforms.TRIM_MODE.value = mode;
		uniforms.TRIM_DECAL.value = decal ? 1 : 0;
		uniforms.TRIM_ARMOR_MAP.value = armorMapFor(texture);
		if (palette) {
			palette.forEach((hex, i) => uniforms.TRIM_VALS.value[i].set(...hexToRgb(hex).map(v => v / 255)));
		}
	}
}

// ============================================================================
// Poses (port of HumanoidModel.setupAnim)
// ============================================================================

const PI = Math.PI;
const POSES = [
	{id: 'default', icon: 'accessibility', name: t('standing')},
	{id: 'idle', icon: 'self_improvement', name: t('idle'), animated: true},
	{id: 'walk', icon: 'directions_walk', name: t('walking'), animated: true},
	{id: 'run', icon: 'directions_run', name: t('sprinting'), animated: true},
	{id: 'sneak', icon: 'airline_seat_legroom_reduced', name: t('sneaking'), animated: true},
	{id: 'sneak_walk', icon: 'hiking', name: t('sneak_walk'), animated: true},
	{id: 'sit', icon: 'event_seat', name: t('riding')},
	{id: 'attack', icon: 'sports_martial_arts', name: t('attack'), animated: true},
	{id: 'bow', icon: 'gps_fixed', name: t('bow')},
	{id: 'crossbow', icon: 'center_focus_strong', name: t('crossbow')},
	{id: 'shield', icon: 'shield', name: t('shield')},
	{id: 'trident', icon: 'north', name: t('trident')},
	{id: 'spyglass', icon: 'search', name: t('spyglass')},
	{id: 'zombie', icon: 'front_hand', name: t('arms_forward')},
	{id: 'tpose', icon: 'open_with', name: t('t_pose')},
	{id: 'spread', icon: 'open_in_full', name: t('pose_spread')},
	{id: 'tpose_spread', icon: 'zoom_out_map', name: t('pose_tpose_spread')},
	{id: 'wave', icon: 'waving_hand', name: t('waving'), animated: true},
	{id: 'swim', icon: 'pool', name: t('swimming'), animated: true},
	{id: 'elytra', icon: 'flight', name: t('elytra')},
];

function mcDefaultParts() {
	let part = (x, y, z) => ({x, y, z, xRot: 0, yRot: 0, zRot: 0, x0: x, y0: y, z0: z});
	return {
		head: part(0, 0, 0), body: part(0, 0, 0),
		right_arm: part(-5, 2, 0), left_arm: part(5, 2, 0),
		right_leg: part(-1.9, 12, 0), left_leg: part(1.9, 12, 0),
	};
}
function bob(part, age, dir) {
	part.zRot += dir * (Math.cos(age * 0.09) * 0.05 + 0.05);
	part.xRot += dir * Math.sin(age * 0.067) * 0.05;
}
function quadraticArm(x) {
	return -65 * x + x * x;
}
function lerp(t, a, b) {
	return a + (b - a) * t;
}

// Returns MC-space part transforms plus an optional root transform (Blockbench space).
function computePose(pose_id, ticks, head_yaw, head_pitch) {
	let p = mcDefaultParts();
	let head = p.head, body = p.body, ra = p.right_arm, la = p.left_arm, rl = p.right_leg, ll = p.left_leg;
	let root = {rot: [0, 0, 0], pos: [0, 0, 0]};
	let s = {walk_pos: 0, walk_speed: 0, crouch: false, riding: false, bob: true, swim: 0, fall_flying: false, attack: 0};

	switch (pose_id) {
		case 'default': s.bob = false; break;
		case 'spread': s.bob = false; s.spread = true; break;
		case 'tpose_spread': s.bob = false; s.spread = true; break;
		case 'walk': s.walk_pos = ticks * 0.86; s.walk_speed = 0.86; break;
		case 'run': s.walk_pos = ticks * 1.0; s.walk_speed = 1.0; break;
		case 'sneak': s.crouch = true; break;
		case 'sneak_walk': s.crouch = true; s.walk_pos = ticks * 0.3; s.walk_speed = 0.3; break;
		case 'sit': s.riding = true; break;
		case 'attack': s.attack = (ticks % 10) / 6; if (s.attack >= 1) s.attack = 0; break;
		case 'swim': s.swim = 1; s.walk_pos = ticks * 0.9; s.walk_speed = 0.9; break;
		case 'elytra': s.fall_flying = true; s.walk_pos = ticks * 0.3; s.walk_speed = 0.1; break;
	}
	let age = ticks;

	head.xRot = rad(head_pitch);
	head.yRot = rad(-head_yaw);
	if (s.fall_flying) head.xRot = -PI / 4;
	else if (s.swim > 0) head.xRot = lerp(s.swim, head.xRot, -PI / 4);

	ra.xRot = Math.cos(s.walk_pos * 0.6662 + PI) * 2 * s.walk_speed * 0.5;
	la.xRot = Math.cos(s.walk_pos * 0.6662) * 2 * s.walk_speed * 0.5;
	rl.xRot = Math.cos(s.walk_pos * 0.6662) * 1.4 * s.walk_speed;
	ll.xRot = Math.cos(s.walk_pos * 0.6662 + PI) * 1.4 * s.walk_speed;
	rl.yRot = 0.005; ll.yRot = -0.005; rl.zRot = 0.005; ll.zRot = -0.005;

	if (s.riding) {
		ra.xRot += -PI / 5; la.xRot += -PI / 5;
		rl.xRot = -1.4137167; rl.yRot = PI / 10; rl.zRot = 0.07853982;
		ll.xRot = -1.4137167; ll.yRot = -PI / 10; ll.zRot = -0.07853982;
	}

	switch (pose_id) {
		case 'bow':
			ra.yRot = -0.1 + head.yRot; la.yRot = 0.1 + head.yRot + 0.4;
			ra.xRot = -PI / 2 + head.xRot; la.xRot = -PI / 2 + head.xRot;
			break;
		case 'crossbow':
			ra.yRot = -0.3 + head.yRot; la.yRot = 0.6 + head.yRot;
			ra.xRot = -PI / 2 + head.xRot + 0.1; la.xRot = -1.5 + head.xRot;
			break;
		case 'shield':
			la.xRot = la.xRot * 0.5 - 0.9424779; la.yRot = PI / 6;
			ra.xRot = ra.xRot * 0.5 - PI / 10;
			break;
		case 'trident':
			ra.xRot = ra.xRot * 0.5 - PI; ra.yRot = 0;
			break;
		case 'spyglass':
			ra.xRot = clamp(head.xRot - 1.9198622, -2.4, 3.3); ra.yRot = head.yRot - PI / 12;
			s.bob = false;
			break;
		case 'zombie':
			ra.xRot = -PI / 2; la.xRot = -PI / 2;
			break;
		case 'tpose':
		case 'tpose_spread':
			ra.zRot = PI / 2; la.zRot = -PI / 2; s.bob = false;
			break;
		case 'wave':
			ra.xRot = -0.2; ra.zRot = 2.6 + Math.sin(ticks * 0.35) * 0.35;
			break;
	}

	if (s.attack > 0) {
		let f = s.attack;
		body.yRot = Math.sin(Math.sqrt(f) * PI * 2) * 0.2;
		ra.z = Math.sin(body.yRot) * 5; ra.x = -Math.cos(body.yRot) * 5;
		la.z = -Math.sin(body.yRot) * 5; la.x = Math.cos(body.yRot) * 5;
		ra.yRot += body.yRot; la.yRot += body.yRot; la.xRot += body.yRot;
		let g = 1 - f; g *= g; g *= g; g = 1 - g;
		let h = Math.sin(g * PI);
		let k = Math.sin(f * PI) * -(head.xRot - 0.7) * 0.75;
		ra.xRot -= h * 1.2 + k;
		ra.yRot += body.yRot * 2;
		ra.zRot += Math.sin(f * PI) * -0.4;
	}

	if (s.crouch) {
		body.xRot = 0.5;
		ra.xRot += 0.4; la.xRot += 0.4;
		rl.z += 4; ll.z += 4;
		head.y += 4.2; body.y += 3.2; la.y += 3.2; ra.y += 3.2;
	}

	if (s.spread) {
		// Pull the parts apart so the armor of each one is seen on its own (like an exploded view)
		head.y -= 4.5;
		ra.x -= 4; la.x += 4;
		rl.x -= 2; ll.x += 2;
		rl.y += 4; ll.y += 4;
	}

	if (s.bob) {
		bob(ra, age, 1);
		bob(la, age, -1);
	}

	if (s.swim > 0) {
		let l = s.walk_pos % 26;
		let n = s.swim, m = s.swim;
		if (l < 14) {
			la.xRot = lerp(n, la.xRot, 0); ra.xRot = lerp(m, ra.xRot, 0);
			la.yRot = lerp(n, la.yRot, PI); ra.yRot = lerp(m, ra.yRot, PI);
			la.zRot = lerp(n, la.zRot, PI + 1.8707964 * quadraticArm(l) / quadraticArm(14));
			ra.zRot = lerp(m, ra.zRot, PI - 1.8707964 * quadraticArm(l) / quadraticArm(14));
		} else if (l < 22) {
			let o = (l - 14) / 8;
			la.xRot = lerp(n, la.xRot, PI / 2 * o); ra.xRot = lerp(m, ra.xRot, PI / 2 * o);
			la.yRot = lerp(n, la.yRot, PI); ra.yRot = lerp(m, ra.yRot, PI);
			la.zRot = lerp(n, la.zRot, 5.012389 - 1.8707964 * o);
			ra.zRot = lerp(m, ra.zRot, 1.2707963 + 1.8707964 * o);
		} else {
			let o = (l - 22) / 4;
			la.xRot = lerp(n, la.xRot, PI / 2 - PI / 2 * o); ra.xRot = lerp(m, ra.xRot, PI / 2 - PI / 2 * o);
			la.yRot = lerp(n, la.yRot, PI); ra.yRot = lerp(m, ra.yRot, PI);
			la.zRot = lerp(n, la.zRot, PI); ra.zRot = lerp(m, ra.zRot, PI);
		}
		ll.xRot = lerp(s.swim, ll.xRot, 0.3 * Math.cos(s.walk_pos * 0.33333334 + PI));
		rl.xRot = lerp(s.swim, rl.xRot, 0.3 * Math.cos(s.walk_pos * 0.33333334));
		root = {rot: [-90, 0, 0], pos: [0, 5, 16]};
	}
	if (s.fall_flying) {
		root = {rot: [-80, 0, 0], pos: [0, 6, 16]};
		ra.zRot += 0.15; la.zRot -= 0.15;
		rl.zRot += 0.05; ll.zRot -= 0.05;
	}

	// Convert Java model space to Blockbench (x and y flipped)
	let bones = {};
	for (let id in p) {
		let part = p[id];
		bones[id] = {
			rot: [-deg(part.xRot), -deg(part.yRot), deg(part.zRot)],
			pos: [-(part.x - part.x0), -(part.y - part.y0), part.z - part.z0],
		};
	}
	return {bones, root};
}

const PoseRuntime = {
	ticks: 0,
	last_time: 0,
	active: false,
	mouse_down: false,

	frame() {
		let data = D();
		if (!data || !Project || !Project.model_3d) {
			this.active = false;
			return;
		}
		let now = performance.now();
		let dt = this.last_time ? Math.min(0.1, (now - this.last_time) / 1000) : 0;
		this.last_time = now;
		let pose = data.pose;
		let def = POSES.find(p => p.id == pose.id) || POSES[0];
		let static_pose = pose.id == 'default' && !pose.head_yaw && !pose.head_pitch;
		if (static_pose) {
			if (this.active) this.reset();
			return;
		}
		let frozen = pose.paused || (this.mouse_down && Modes.paint);
		if (def.animated && !frozen) this.ticks += dt * 20 * (pose.speed || 1);
		this.apply(computePose(pose.id, this.ticks, pose.head_yaw || 0, pose.head_pitch || 0));
	},
	apply(result) {
		// The root transform (swimming, elytra) is baked into every bone so the icon card stays put
		let root = new THREE.Matrix4().compose(
			new THREE.Vector3(...result.root.pos),
			new THREE.Quaternion().setFromEuler(new THREE.Euler(rad(result.root.rot[0]), rad(result.root.rot[1]), rad(result.root.rot[2]), 'ZYX')),
			new THREE.Vector3(1, 1, 1)
		);
		let local = new THREE.Matrix4();
		for (let bone of BONES) {
			let group = findBone(bone.id);
			if (!group || !group.mesh) continue;
			let pose = result.bones[bone.id];
			let mesh = group.mesh;
			local.compose(
				new THREE.Vector3(group.origin[0] + pose.pos[0], group.origin[1] + pose.pos[1], group.origin[2] + pose.pos[2]),
				new THREE.Quaternion().setFromEuler(new THREE.Euler(
					rad(group.rotation[0] + pose.rot[0]), rad(group.rotation[1] + pose.rot[1]), rad(group.rotation[2] + pose.rot[2]), 'ZYX')),
				mesh.scale
			);
			local.premultiply(root);
			local.decompose(mesh.position, mesh.quaternion, new THREE.Vector3());
		}
		this.active = true;
	},
	reset() {
		this.active = false;
		if (!Project || !Project.model_3d) return;
		Canvas.updateAllBones();
	},
};

// ============================================================================
// Icon generator
// ============================================================================

const GLYPH_COLORS = ['4bc9c9', '209ab8', '60e8e8', '83f8f8'];
function isGlyphPixel(r, g, b) {
	let hex = rgbToHex(r, g, b).substring(1);
	if (GLYPH_COLORS.includes(hex)) return true;
	let [h, s] = rgbToHsl(r, g, b);
	return h > 0.46 && h < 0.56 && s > 0.45;
}
const FALLBACK_TABLET = [
	'................',
	'.......###......',
	'.....##ooo#.....',
	'....#oooooo#....',
	'...#oooooooo#...',
	'..#oo+ooooooo#..',
	'..#o+oooooooo#..',
	'.#ooooooooooo#..',
	'.#oooooooooooo#.',
	'.#ooooooooooo--.',
	'..#oooooooo---..',
	'..#oooooo----...',
	'...#ooo----.....',
	'....#----.......',
	'.....--.........',
	'................',
];
function fallbackTemplateCanvas() {
	let {canvas, ctx} = makeCanvas(16, 16);
	let colors = {'#': '#2a2a33', 'o': '#6e6d75', '+': '#9a99a2', '-': '#1c1c22'};
	FALLBACK_TABLET.forEach((row, y) => row.split('').forEach((ch, x) => {
		if (!colors[ch]) return;
		ctx.fillStyle = colors[ch];
		ctx.fillRect(x, y, 1, 1);
	}));
	return canvas;
}
function recolorIcon(source, opts) {
	let w = source.width, h = source.height;
	let {canvas, ctx} = makeCanvas(w, h);
	ctx.drawImage(source, 0, 0);
	let image = ctx.getImageData(0, 0, w, h);
	let px = image.data;
	let glyph = new Uint8Array(w * h);
	let sums = {body: [0, 0], glyph: [0, 0]};
	for (let i = 0; i < w * h; i++) {
		if (px[i * 4 + 3] == 0) continue;
		let is_glyph = isGlyphPixel(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
		glyph[i] = is_glyph ? 1 : 0;
		let l = luminance(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
		let bucket = is_glyph ? sums.glyph : sums.body;
		bucket[0] += l; bucket[1]++;
	}
	let body_mean = sums.body[1] ? sums.body[0] / sums.body[1] : 0.4;
	let glyph_mean = sums.glyph[1] ? sums.glyph[0] / sums.glyph[1] : 0.6;
	let body_hsl = rgbToHsl(...hexToRgb(opts.body));
	let accent_hsl = rgbToHsl(...hexToRgb(opts.accent));
	let contrast = opts.contrast || 1;
	let out = new Uint8ClampedArray(px);
	for (let i = 0; i < w * h; i++) {
		if (px[i * 4 + 3] == 0) continue;
		let l = luminance(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
		let rgb;
		if (glyph[i] && opts.glyph == 'keep') continue;
		if (glyph[i] && opts.glyph == 'recolor') {
			rgb = hslToRgb(accent_hsl[0], accent_hsl[1], accent_hsl[2] + (l - glyph_mean) * contrast);
		} else if (glyph[i] && opts.glyph == 'remove') {
			let acc = [0, 0, 0], n = 0;
			for (let [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
				let x = (i % w) + dx, y = Math.floor(i / w) + dy;
				if (x < 0 || y < 0 || x >= w || y >= h) continue;
				let j = y * w + x;
				if (glyph[j] || px[j * 4 + 3] == 0) continue;
				acc[0] += px[j * 4]; acc[1] += px[j * 4 + 1]; acc[2] += px[j * 4 + 2]; n++;
			}
			let nl = n ? luminance(acc[0] / n, acc[1] / n, acc[2] / n) : body_mean;
			rgb = hslToRgb(body_hsl[0], body_hsl[1], body_hsl[2] + (nl - body_mean) * contrast);
		} else {
			rgb = hslToRgb(body_hsl[0], body_hsl[1], body_hsl[2] + (l - body_mean) * contrast);
		}
		out[i * 4] = rgb[0]; out[i * 4 + 1] = rgb[1]; out[i * 4 + 2] = rgb[2];
	}
	image.data.set(out);
	ctx.putImageData(image, 0, 0);
	return canvas;
}
function suggestColors() {
	// Most common saturated colors of the trim become the body and accent of the icon
	let buckets = {};
	for (let texture of trimTextures()) {
		if (!texture.canvas || !texture.width) continue;
		let px = texture.canvas.getContext('2d').getImageData(0, 0, texture.canvas.width, texture.canvas.height).data;
		for (let i = 0; i < px.length; i += 4) {
			if (px[i + 3] < 128) continue;
			let [h, s, l] = rgbToHsl(px[i], px[i + 1], px[i + 2]);
			let key = s < 0.15 ? 'gray' + Math.round(l * 4) : 'h' + Math.round(h * 24);
			if (!buckets[key]) buckets[key] = {n: 0, r: 0, g: 0, b: 0};
			let bucket = buckets[key];
			bucket.n++; bucket.r += px[i]; bucket.g += px[i + 1]; bucket.b += px[i + 2];
		}
	}
	let sorted = Object.values(buckets).sort((a, b) => b.n - a.n).map(b => {
		let rgb = [b.r / b.n, b.g / b.n, b.b / b.n];
		return {rgb, hsl: rgbToHsl(...rgb)};
	});
	if (!sorted.length) return null;
	let main = sorted[0];
	let accent = sorted.find(c => Math.abs(c.hsl[0] - main.hsl[0]) > 0.08 && c.hsl[1] > 0.2) || sorted[1] || main;
	let body = hslToRgb(main.hsl[0], Math.min(0.8, main.hsl[1]), clamp(main.hsl[2] * 0.8, 0.22, 0.5));
	let acc = hslToRgb(accent.hsl[0], Math.max(0.5, accent.hsl[1]), clamp(accent.hsl[2], 0.45, 0.7));
	return {body: rgbToHex(...body), accent: rgbToHex(...acc)};
}
async function iconBaseCanvas(base) {
	if (base.startsWith('pack:')) {
		let data = D();
		let pack = await packStorage(rpTargetPath(data.export)).load();
		let url = await readPackPNG(pack, base.substring(5));
		if (url) return dataURLToCanvas(url);
	}
	if (base == 'current') {
		let tex = findTexture('icon');
		if (tex && tex.canvas) {
			let {canvas, ctx} = makeCanvas(tex.canvas.width, tex.canvas.height);
			ctx.drawImage(tex.canvas, 0, 0);
			return canvas;
		}
	}
	if (base == 'simple') return fallbackTemplateCanvas();
	try {
		let url = await Assets.template(base);
		if (url) return dataURLToCanvas(url);
	} catch (err) {
		console.warn('[Trim Editor] template:', err);
	}
	return fallbackTemplateCanvas();
}
async function packIconFiles(data) {
	let list = [];
	try {
		let target = rpTargetPath(data.export);
		if (!target || !pathExists(target)) return list;
		let pack = await packStorage(target).load();
		let dir = PathModule.posix.dirname(iconRel(data.export.icon_texture, '__id__'));
		for (let file of pack.listDir(dir)) {
			if (file.endsWith('.png')) list.push({id: 'pack:' + dir + '/' + file, name: t('pack') + file.replace('.png', '')});
		}
	} catch (err) {}
	return list;
}

async function openIconGenerator() {
	let data = D();
	if (!data) return;
	let icon_texture = findTexture('icon');
	if (!icon_texture) return;
	let gen = data.icon_gen;
	let bases = [
		{id: 'current', name: t('current_icon')},
		{id: 'simple', name: t('simple_tablet')},
		...VANILLA_PATTERNS.map(p => ({id: p, name: t('template') + p})),
		{id: 'netherite_upgrade', name: t('template_netherite_upgrade')},
		...await packIconFiles(data),
	];
	let dialog = new Dialog({
		id: 'armor_trim_editor_icon_generator',
		title: t('icon_generator'),
		width: 620,
		component: {
			data() {
				return {bases, gen: Object.assign({}, gen), status: '', glyph_modes: [
					{id: 'recolor', name: t('recolor_glyph')},
					{id: 'keep', name: t('keep')},
					{id: 'remove', name: t('remove_glyph')},
				]};
			},
			methods: {
				async render() {
					try {
						let base = await iconBaseCanvas(this.gen.base);
						this.base_canvas = base;
						let result = recolorIcon(base, this.gen);
						this.result_canvas = result;
						for (let [ref, source] of [['before', base], ['after', result]]) {
							let target = this.$refs[ref];
							if (!target) continue;
							let ctx = target.getContext('2d');
							ctx.imageSmoothingEnabled = false;
							ctx.clearRect(0, 0, target.width, target.height);
							ctx.drawImage(source, 0, 0, target.width, target.height);
						}
						this.status = '';
					} catch (err) {
						this.status = err.message || String(err);
					}
				},
				autoColors() {
					let colors = suggestColors();
					if (!colors) {
						this.status = t('the_trim_is_empty_nothing_to_sample');
						return;
					}
					this.gen.body = colors.body;
					this.gen.accent = colors.accent;
					this.render();
				},
			},
			watch: {
				gen: {deep: true, handler() { this.render(); }},
			},
			mounted() {
				this.render();
			},
			template: `
				<div class="te_icon_gen">
					<div class="te_icon_previews">
						<div><canvas ref="before" width="128" height="128" class="te_pixel"></canvas><div class="te_hint">${t('base')}</div></div>
						<i class="material-icons">arrow_forward</i>
						<div><canvas ref="after" width="128" height="128" class="te_pixel te_checker"></canvas><div class="te_hint">${t('result')}</div></div>
					</div>
					<div class="te_form_row"><label>${t('base')}</label>
						<select v-model="gen.base"><option v-for="b in bases" :value="b.id">{{ b.name }}</option></select>
					</div>
					<div class="te_form_row"><label>${t('body_color')}</label><input type="color" v-model="gen.body"></div>
					<div class="te_form_row"><label>${t('glyph_color')}</label><input type="color" v-model="gen.accent"></div>
					<div class="te_form_row"><label>${t('glyph')}</label>
						<select v-model="gen.glyph"><option v-for="m in glyph_modes" :value="m.id">{{ m.name }}</option></select>
					</div>
					<div class="te_form_row"><label>${t('contrast')}</label><input type="range" min="0.3" max="2" step="0.05" v-model.number="gen.contrast"><span>{{ gen.contrast.toFixed(2) }}</span></div>
					<div class="te_form_row"><label></label><button @click="autoColors()">${t('sample_colors_from_trim')}</button></div>
					<div class="te_hint">${t('the_glyph_cyan_pixels_of_vanilla')}</div>
					<div class="te_error" v-if="status">{{ status }}</div>
				</div>`,
		},
		onConfirm() {
			let vm = this.content_vue;
			if (!vm || !vm.result_canvas) return;
			Object.assign(gen, vm.gen);
			let result = vm.result_canvas;
			icon_texture.edit((canvas) => {
				let ctx = canvas.getContext('2d');
				ctx.imageSmoothingEnabled = false;
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(result, 0, 0, canvas.width, canvas.height);
			}, {edit_name: t('generate_icon')});
			notify(t('icon_updated'));
		},
	});
	dialog.show();
}

// ============================================================================
// Validation
// ============================================================================

function usedMask(role, w, h) {
	let scale = w / 64;
	let mask = new Uint8Array(w * h);
	for (let box of USED_BOXES[role] || []) {
		for (let [x, y, rw, rh] of boxRects(...box)) {
			for (let yy = y * scale; yy < (y + rh) * scale; yy++) {
				for (let xx = x * scale; xx < (x + rw) * scale; xx++) mask[yy * w + xx] = 1;
			}
		}
	}
	return mask;
}
const KEY_RGB = PALETTE_KEY.map(hexToRgb);
function nearestKey(r, g, b) {
	let best = -1, best_d = Infinity;
	KEY_RGB.forEach((k, i) => {
		let d = Math.abs(k[0] - r) + Math.abs(k[1] - g) + Math.abs(k[2] - b);
		if (d < best_d) { best_d = d; best = i; }
	});
	return {index: best, distance: best_d};
}
function analyzeTexture(texture) {
	let w = texture.canvas.width, h = texture.canvas.height;
	let px = texture.canvas.getContext('2d').getImageData(0, 0, w, h).data;
	let mask = usedMask(texture.trim_role, w, h);
	let stats = {texture, w, h, opaque: 0, palette: 0, fixed: 0, semi: 0, unused: 0, near: 0, below_cutout: 0};
	for (let i = 0; i < w * h; i++) {
		let a = px[i * 4 + 3];
		if (a == 0) continue;
		if (!mask[i]) { stats.unused++; continue; }
		stats.opaque++;
		if (a < 255) stats.semi++;
		if (a < 26) stats.below_cutout++;
		let near = nearestKey(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
		if (near.distance == 0) stats.palette++;
		else {
			stats.fixed++;
			if (near.distance <= 12) stats.near++;
		}
	}
	return stats;
}
function validateTrim() {
	let data = D();
	let issues = [];
	if (!data) return issues;
	let label = {trim_humanoid: 'humanoid', trim_leggings: 'humanoid_leggings'};
	let total = 0;
	for (let texture of trimTextures()) {
		if (!texture.canvas || !texture.canvas.width) continue;
		let s = analyzeTexture(texture);
		total += s.opaque;
		let name = label[texture.trim_role];
		if (s.w * 32 != s.h * 64) {
			issues.push({level: 'error', text: t('size_must_be_2_1_64_32_128_64', [name, s.w, s.h])});
		}
		if (s.unused) {
			issues.push({level: 'warn', text: t('px_outside_the_uv_layout_invisible_in', [name, s.unused]),
				fix: {id: 'clear_unused', texture, label: t('remove')}});
		}
		if (s.semi) {
			issues.push({level: 'warn', text: t('semi_transparent_px_trims_render_as', [name, s.semi]),
				fix: {id: 'fix_alpha', texture, label: t('match_game')}});
		}
		if (s.near) {
			issues.push({level: 'info', text: t('px_are_close_to_palette_colors_but_will', [name, s.near]),
				fix: {id: 'snap_palette', texture, label: t('snap_to_palette')}});
		}
		if (s.opaque) {
			issues.push({level: 'info', text: t('px_follow_the_material_px_keep_their', [name, s.palette, s.fixed])});
		}
	}
	if (!total) issues.unshift({level: 'warn', text: t('the_trim_is_empty')});
	let icon = findTexture('icon');
	if (icon && icon.canvas && icon.canvas.width != icon.canvas.height) {
		issues.push({level: 'warn', text: t('the_icon_is_not_square')});
	}
	let id_error = trimIdError(data.trim_id);
	if (id_error) issues.unshift({level: 'error', text: id_error});
	return issues;
}
function applyFix(fix) {
	let texture = fix.texture;
	texture.edit((canvas) => {
		let ctx = canvas.getContext('2d');
		let w = canvas.width, h = canvas.height;
		let image = ctx.getImageData(0, 0, w, h);
		let px = image.data;
		let mask = usedMask(texture.trim_role, w, h);
		for (let i = 0; i < w * h; i++) {
			let a = px[i * 4 + 3];
			if (a == 0) continue;
			if (fix.id == 'clear_unused' && !mask[i]) {
				px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = px[i * 4 + 3] = 0;
			} else if (fix.id == 'fix_alpha' && a < 255) {
				px[i * 4 + 3] = a < 26 ? 0 : 255;
			} else if (fix.id == 'snap_palette') {
				let near = nearestKey(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
				if (near.distance > 0 && near.distance <= 12) {
					let k = KEY_RGB[near.index];
					px[i * 4] = k[0]; px[i * 4 + 1] = k[1]; px[i * 4 + 2] = k[2];
				}
			}
		}
		ctx.putImageData(image, 0, 0);
	}, {edit_name: t('fix_trim')});
}
function trimIdError(id) {
	if (!id) return t('trim_id_is_empty');
	if (!/^[a-z0-9_.\-]+$/.test(id)) return t('trim_id_may_only_contain_a_z_0_9');
	return '';
}

function clearPiece(piece) {
	let boxes = PIECE_BOXES[piece];
	for (let role in boxes) {
		let texture = findTexture(role);
		if (!texture) continue;
		texture.edit((canvas) => {
			let ctx = canvas.getContext('2d');
			let scale = canvas.width / 64;
			for (let box of boxes[role]) {
				for (let [x, y, w, h] of boxRects(...box)) ctx.clearRect(x * scale, y * scale, w * scale, h * scale);
			}
		}, {edit_name: t('clear_trim_piece')});
	}
}

function confirmClearPiece(piece) {
	Blockbench.showMessageBox({
		title: t('clear_trim_piece'),
		message: t('erase_from_the_trim_texture_you_can_undo', [PIECE_NAMES[piece]]),
		buttons: [t('erase'), t('cancel')], confirm: 0, cancel: 1,
	}, (button) => { if (button == 0) clearPiece(piece); });
}

// ============================================================================
// Pack storage: a resource pack or datapack is either a folder or a zip archive
// ============================================================================

class FolderPack {
	constructor(root) {
		this.kind = 'folder';
		this.root = root;
		this.path = root;
	}
	async load() {
		return this;
	}
	abs(rel) {
		return PathModule.join(this.root, ...rel.split('/'));
	}
	exists(rel) {
		return pathExists(this.abs(rel));
	}
	async read(rel) {
		return this.exists(rel) ? getFS().readFileSync(this.abs(rel)) : null;
	}
	listDir(rel) {
		return readDir(this.abs(rel));
	}
	write(rel, content, backup_stamp) {
		let path = this.abs(rel);
		if (backup_stamp) backupFile(path, this.root, backup_stamp);
		ensureDir(PathModule.dirname(path));
		getFS().writeFileSync(path, content);
	}
	async save() {}
}

class ZipPack {
	constructor(file) {
		this.kind = 'zip';
		this.path = file;
		this.zip = null;
		this.existed = false;
		this.dirty = false;
	}
	async load() {
		let fs = getFS();
		this.existed = fs.existsSync(this.path);
		this.zip = this.existed ? await JSZip.loadAsync(fs.readFileSync(this.path)) : new JSZip();
		return this;
	}
	exists(rel) {
		return !!this.zip.file(rel);
	}
	async read(rel) {
		let file = this.zip.file(rel);
		return file ? Buffer.from(await file.async('uint8array')) : null;
	}
	listDir(rel) {
		let prefix = rel.replace(/\/?$/, '/');
		let names = new Set();
		this.zip.forEach((path) => {
			if (!path.startsWith(prefix)) return;
			let name = path.substring(prefix.length).split('/')[0];
			if (name) names.add(name);
		});
		return [...names];
	}
	write(rel, content) {
		this.zip.file(rel, content);
		this.dirty = true;
	}
	async save(backup_stamp) {
		if (!this.dirty) return;
		if (this.existed && backup_stamp) backupFile(this.path, PathModule.dirname(this.path), backup_stamp);
		let content = await this.zip.generateAsync({type: 'uint8array', compression: 'DEFLATE'});
		ensureDir(PathModule.dirname(this.path));
		getFS().writeFileSync(this.path, Buffer.from(content));
		this.existed = true;
		this.dirty = false;
	}
}

function packStorage(path) {
	return /\.zip$/i.test(path) ? new ZipPack(path) : new FolderPack(path);
}
async function readPackText(pack, rel) {
	let buffer = await pack.read(rel);
	return buffer ? buffer.toString('utf-8').replace(/^﻿/, '') : null;
}
function writeJSON(pack, rel, json, previous_text, backup_stamp) {
	// Keep the indentation and trailing newline of the file being replaced
	let text = previous_text || '';
	pack.write(rel, JSON.stringify(json, null, detectIndent(text)) + (text.endsWith('\n') || !text ? '\n' : ''), backup_stamp);
}
function zipFileName(name) {
	name = String(name || '').trim().replace(/\.zip$/i, '');
	return /^[^\\/:*?"<>|]+$/.test(name) ? name : '';
}

// ============================================================================
// Minecraft versions
// ============================================================================

// Versions whose resource pack layout matches what the plugin exports (1.21.2+)
const MC_VERSIONS = [
	{id: '26.2', name: '26.2', rp: 88, dp: 107, new_meta: true},
	{id: '26.1.2', name: '26.1.2', rp: 84, dp: 101, new_meta: true},
	{id: '1.21.11', name: '1.21.11', rp: 75, dp: 94, new_meta: true},
	{id: '1.21.9', name: '1.21.9 – 1.21.10', rp: 69, dp: 88, new_meta: true},
	{id: '1.21.7', name: '1.21.7 – 1.21.8', rp: 64, dp: 81},
	{id: '1.21.6', name: '1.21.6', rp: 63, dp: 80},
	{id: '1.21.5', name: '1.21.5', rp: 55, dp: 71},
	{id: '1.21.4', name: '1.21.4', rp: 46, dp: 61, template_item: true},
	{id: '1.21.2', name: '1.21.2 – 1.21.3', rp: 42, dp: 57, template_item: true},
];
const DEFAULT_MC_VERSION = '1.21.11';

function mcVersion(id) {
	return MC_VERSIONS.find(v => v.id == id) || MC_VERSIONS.find(v => v.id == DEFAULT_MC_VERSION);
}
function versionOptions() {
	let options = {};
	for (let v of MC_VERSIONS) options[v.id] = v.name;
	return options;
}
function mcmetaText(version, kind) {
	let format = kind == 'rp' ? version.rp : version.dp;
	let pack = {description: 'Armor trims'};
	if (version.new_meta) {
		pack.min_format = format;
		pack.max_format = format;
	} else {
		pack.pack_format = format;
	}
	return JSON.stringify({pack}, null, '\t') + '\n';
}
function mcmetaFormat(json) {
	let pack = json && json.pack || {};
	let value = pack.max_format ?? pack.pack_format ?? pack.min_format;
	return Array.isArray(value) ? value[0] : value;
}

// ============================================================================
// Export to resource pack
// ============================================================================

function rpTargetPath(e) {
	if (e.pack_type == 'folder') return e.pack_path || '';
	let name = zipFileName(e.zip_name);
	return e.zip_dir && name ? PathModule.join(e.zip_dir, name + '.zip') : '';
}
function exportPlan(data) {
	let e = data.export;
	let id = data.trim_id;
	let ns = e.namespace || 'minecraft';
	let plan = {target: rpTargetPath(e), type: e.pack_type, id, ns, files: [], atlas: null, version: mcVersion(data.mc_version)};
	plan.files.push({kind: 'texture', role: 'trim_humanoid', rel: `assets/${ns}/textures/trims/entity/humanoid/${id}.png`});
	plan.files.push({kind: 'texture', role: 'trim_leggings', rel: `assets/${ns}/textures/trims/entity/humanoid_leggings/${id}.png`});
	if (e.icon) {
		let tex_id = parseResourceId(e.icon_texture.replace(/\{id\}/g, id));
		let model_id = parseResourceId(e.icon_model.replace(/\{id\}/g, id));
		plan.icon_texture_id = tex_id.ns + ':' + tex_id.path;
		plan.icon_model_id = model_id.ns + ':' + model_id.path;
		plan.files.push({kind: 'texture', role: 'icon', rel: `assets/${tex_id.ns}/textures/${tex_id.path}.png`});
		plan.files.push({kind: 'model', rel: `assets/${model_id.ns}/models/${model_id.path}.json`,
			content: JSON.stringify({parent: e.icon_parent || 'minecraft:item/generated', textures: {layer0: plan.icon_texture_id}}, null, 4)});
	}
	// Vanilla patterns are already listed in the vanilla atlas
	plan.vanilla = ns == 'minecraft' && VANILLA_PATTERNS.includes(id);
	if (e.register_atlas && !plan.vanilla) plan.atlas = 'assets/minecraft/atlases/armor_trims.json';
	return plan;
}
function exportPlanErrors(data, plan) {
	let errors = [];
	let e = data.export;
	let id_error = trimIdError(data.trim_id);
	if (id_error) errors.push(id_error);
	if (e.pack_type == 'folder') {
		if (!e.pack_path) errors.push(t('no_resource_pack_folder_selected'));
		else if (!isDirectory(e.pack_path)) errors.push(t('resource_pack_folder_not_found') + e.pack_path);
	} else {
		if (!e.zip_dir) errors.push(t('no_zip_folder'));
		else if (pathExists(e.zip_dir) && !isDirectory(e.zip_dir)) errors.push(t('dp_not_folder') + e.zip_dir);
		if (!zipFileName(e.zip_name)) errors.push(t('invalid_zip_name'));
	}
	if (!isValidNamespace(e.namespace || 'minecraft')) errors.push(t('invalid_texture_namespace'));
	if (e.icon) {
		for (let id of [plan.icon_texture_id, plan.icon_model_id]) {
			let p = parseResourceId(id);
			if (!isValidNamespace(p.ns) || !isValidPath(p.path)) errors.push(t('invalid_icon_path') + id);
		}
	}
	return errors;
}
function detectIndent(text) {
	let m = text && text.match(/\n([ \t]+)"/);
	if (!m) return 4;
	return m[1].includes('\t') ? '\t' : m[1].length;
}
function updateAtlasJSON(text, texture_ids, sync_permutations) {
	let json;
	if (text) {
		json = JSON.parse(text);
	} else {
		json = {sources: []};
	}
	if (!Array.isArray(json.sources)) json.sources = [];
	let is_palette_source = (s) => s && /(^|:)paletted_permutations$/.test(s.type || '') &&
		normalizeId(s.palette_key || '') == 'minecraft:trims/color_palettes/trim_palette';
	let source = json.sources.find(is_palette_source);
	let changes = [];
	// Follow the style already used in the file (with or without "minecraft:")
	let prefixed = source && Array.isArray(source.textures) && source.textures.length ? source.textures.some(t => t.startsWith('minecraft:')) : false;
	if (!source) {
		source = {type: 'paletted_permutations', textures: [], palette_key: 'trims/color_palettes/trim_palette', permutations: {}};
		for (let perm of VANILLA_PERMUTATIONS) source.permutations[perm] = 'trims/color_palettes/' + perm;
		json.sources.push(source);
		changes.push(t('created_paletted_permutations_source'));
	}
	if (!Array.isArray(source.textures)) source.textures = [];
	for (let id of texture_ids) {
		let listed = json.sources.some(s => Array.isArray(s.textures) && s.textures.some(t => normalizeId(t) == normalizeId(id)));
		if (!listed) {
			let p = parseResourceId(id);
			source.textures.push(p.ns == 'minecraft' && !prefixed ? p.path : p.ns + ':' + p.path);
			changes.push(t('added_texture') + id);
		}
	}
	if (sync_permutations) {
		if (!source.permutations || typeof source.permutations != 'object') source.permutations = {};
		let perm_prefixed = Object.values(source.permutations).some(v => String(v).startsWith('minecraft:'));
		for (let perm of VANILLA_PERMUTATIONS) {
			if (!(perm in source.permutations)) {
				source.permutations[perm] = (perm_prefixed ? 'minecraft:' : '') + 'trims/color_palettes/' + perm;
				changes.push(t('added_palette') + perm);
			}
		}
	}
	return {json, changes};
}
function textureBuffer(texture) {
	return dataURLToBuffer(texture.canvas.toDataURL('image/png'));
}
function packIconBuffer() {
	// pack.png for a new pack: the template icon scaled up without smoothing
	let icon = findTexture('icon');
	if (!icon || !icon.canvas || !icon.canvas.width) return null;
	let {canvas, ctx} = makeCanvas(128, 128);
	ctx.drawImage(icon.canvas, 0, 0, 128, 128);
	return dataURLToBuffer(canvas.toDataURL('image/png'));
}
function backupFile(path, pack, stamp) {
	let fs = getFS();
	if (!fs.existsSync(path)) return;
	let rel = PathModule.relative(pack, path);
	let target = PathModule.join(SystemInfo.user_data_directory, 'armor_trim_editor_backups', stamp, PathModule.basename(pack), rel);
	ensureDir(PathModule.dirname(target));
	fs.copyFileSync(path, target);
}
function planHeader(pack) {
	if (pack.kind == 'zip') return `📦 ${PathModule.basename(pack.path)} — ${pack.existed ? t('archive_update') : t('archive_new')}`;
	return `📁 ${pack.path}`;
}
async function describePlan(plan) {
	let pack = await packStorage(plan.target).load();
	let mark = (rel) => pack.exists(rel) ? '♻ ' : '＋ ';
	let lines = [planHeader(pack)];
	lines.push((pack.exists('pack.mcmeta') ? '· ' : '＋ ') + 'pack.mcmeta');
	if (!pack.exists('pack.png') && (pack.kind == 'zip' || !pack.exists('pack.mcmeta')) && findTexture('icon')) lines.push('＋ pack.png');
	for (let file of plan.files) lines.push(mark(file.rel) + file.rel);
	if (plan.atlas) lines.push((pack.exists(plan.atlas) ? '✎ ' : '＋ ') + plan.atlas);
	return lines;
}
async function runExport(quiet = false) {
	let data = D();
	if (!data) return;
	let plan = exportPlan(data);
	let errors = exportPlanErrors(data, plan);
	if (errors.length) {
		Blockbench.showMessageBox({title: t('cannot_export'), icon: 'error', message: errors.map(escapeHTML).join('<br>')});
		return;
	}
	let written = [];
	let stamp = data.export.backup ? new Date().toISOString().replace(/[:.]/g, '-') : null;
	try {
		let pack = await packStorage(plan.target).load();
		// Folder packs back up each overwritten file, zip archives are backed up as a whole on save
		let file_stamp = pack.kind == 'folder' ? stamp : null;
		let created = !pack.exists('pack.mcmeta');
		if (created) {
			pack.write('pack.mcmeta', mcmetaText(plan.version, 'rp'));
			written.push('pack.mcmeta');
		}
		if (!pack.exists('pack.png') && (pack.kind == 'zip' || created)) {
			let icon = packIconBuffer();
			if (icon) {
				pack.write('pack.png', icon);
				written.push('pack.png');
			}
		}
		for (let file of plan.files) {
			let content;
			if (file.kind == 'texture') {
				let texture = findTexture(file.role);
				if (!texture) continue;
				content = textureBuffer(texture);
			} else {
				content = file.content + '\n';
			}
			pack.write(file.rel, content, file_stamp);
			written.push(file.rel);
		}
		let atlas_changes = [];
		if (plan.atlas) {
			let text = await readPackText(pack, plan.atlas) || '';
			let ids = [`${plan.ns}:trims/entity/humanoid/${plan.id}`, `${plan.ns}:trims/entity/humanoid_leggings/${plan.id}`];
			let result = updateAtlasJSON(text, ids, data.export.sync_permutations);
			if (result.changes.length) {
				writeJSON(pack, plan.atlas, result.json, text, file_stamp);
				written.push(plan.atlas);
			}
			atlas_changes = result.changes;
		}
		await pack.save(stamp);
		let e = data.export;
		Prefs.set({pack_type: e.pack_type, pack_path: e.pack_path, zip_dir: e.zip_dir, zip_name: e.zip_name, namespace: e.namespace,
			icon_texture: e.icon_texture, icon_model: e.icon_model, icon_parent: e.icon_parent, mc_version: data.mc_version});
		data.last_export = {time: Date.now(), files: written.length};
		if (quiet) {
			notify(t('trim_exported_files', [plan.id, written.length]), 2500);
		} else {
			showExportResult(plan, pack, written, atlas_changes);
		}
	} catch (err) {
		showError(t('export_failed'), err);
	}
}
function itemSnippet(plan) {
	return JSON.stringify({threshold: 0, model: {type: 'minecraft:model', model: plan.icon_model_id}}, null, 4);
}
function showExportResult(plan, pack, written, atlas_changes) {
	let html = `<p>${t('written_to')}: <b class="te_break">${escapeHTML(pack.path)}</b></p>`;
	html += `<p>${t('files_written')}: <b>${written.length}</b></p><ul class="te_list">${written.map(p => `<li>${escapeHTML(p)}</li>`).join('')}</ul>`;
	if (atlas_changes.length) html += `<p>${t('atlas')}: ${atlas_changes.map(escapeHTML).join(', ')}</p>`;
	if (plan.vanilla) html += `<p>${t('vanilla_atlas_note')}</p>`;
	html += `<p class="te_hint">${t('in_game_press_f3_t_to_reload_resources')}</p>`;
	new Dialog({
		id: 'armor_trim_editor_export_result',
		title: t('trim_exported'),
		width: 580,
		component: {template: `<div class="te_dialog_html">${html}</div>`},
		buttons: [t('copy_items_entry'), t('datapack'), t('open_folder'), t('done')],
		cancelIndex: 3,
		confirmIndex: 3,
		onButton(index) {
			if (index == 0 && plan.icon_model_id) {
				Clipbench.setText(itemSnippet(plan));
				notify(t('copied_fill_in_the_threshold'));
				return false;
			}
			if (index == 1) {
				setTimeout(openDatapackDialog, 50);
				return;
			}
			if (index == 2) {
				revealInFolder(pack.kind == 'zip' ? pack.path : pack.abs(plan.files[0].rel));
				return false;
			}
		},
	}).show();
}
function planHolder(dialog, id) {
	let holder = dialog.object && dialog.object.querySelector('#' + id);
	if (!holder && dialog.object) {
		holder = document.createElement('div');
		holder.id = id;
		holder.className = 'te_export_plan';
		dialog.object.querySelector('.dialog_content').appendChild(holder);
	}
	return holder;
}

function openExportDialog() {
	let data = D();
	if (!data) return;
	let e = data.export;
	let preview_run = 0;
	let dialog = new Dialog({
		id: 'armor_trim_editor_export',
		title: t('export_trim_to_resource_pack'),
		width: 640,
		form: {
			trim_id: {label: t('trim_id'), type: 'text', value: data.trim_id,
				description: t('file_name_and_pattern_asset_id_as_in_the')},
			pack_type: {label: t('rp_type'), type: 'inline_select', value: e.pack_type || 'zip',
				options: {zip: t('rp_type_zip'), folder: t('rp_type_folder')}},
			zip_dir: {label: t('zip_dir'), type: 'folder', value: e.zip_dir, description: t('zip_dir_desc'), condition: (f) => f.pack_type != 'folder'},
			zip_name: {label: t('zip_name'), type: 'text', value: e.zip_name, description: t('zip_name_desc'), condition: (f) => f.pack_type != 'folder'},
			pack_path: {label: t('resource_pack_folder'), type: 'folder', value: e.pack_path, description: t('rp_folder_desc'), condition: (f) => f.pack_type == 'folder'},
			mc_version: {label: t('dp_version'), type: 'select', options: versionOptions(), value: mcVersion(data.mc_version).id, description: t('mc_version_desc')},
			namespace: {label: t('texture_namespace'), type: 'text', value: e.namespace || 'minecraft',
				description: t('namespace_of_the_pattern_asset_id')},
			_atlas: {type: 'info', text: t('atlas_assets_minecraft_atlases_armor')},
			register_atlas: {label: t('register_in_atlas'), type: 'checkbox', value: e.register_atlas},
			sync_permutations: {label: t('add_missing_vanilla_palettes'), type: 'checkbox', value: e.sync_permutations,
				description: t('e_g_copper_darker_without_it_a_copper')},
			_icon: {type: 'info', text: t('template_icon_id_is_replaced_with_the')},
			icon: {label: t('export_icon_and_model'), type: 'checkbox', value: e.icon},
			icon_texture: {label: t('icon_texture'), type: 'text', value: e.icon_texture, condition: (f) => f.icon},
			icon_model: {label: t('icon_model'), type: 'text', value: e.icon_model, condition: (f) => f.icon},
			icon_parent: {label: t('model_parent'), type: 'text', value: e.icon_parent, condition: (f) => f.icon},
			_other: {type: 'info', text: t('other')},
			backup: {label: t('back_up_overwritten_files'), type: 'checkbox', value: e.backup,
				description: t('copies_go_to_blockbench_data_armor_trim')},
		},
		async onFormChange(result) {
			let run = ++preview_run;
			let tmp = JSON.parse(JSON.stringify(data));
			applyExportForm(tmp, result);
			let plan = exportPlan(tmp);
			let errors = exportPlanErrors(tmp, plan);
			let html;
			if (errors.length) {
				html = `<div class="te_error">${errors.map(escapeHTML).join('<br>')}</div>`;
			} else {
				try {
					html = `<div class="te_plan_list">${(await describePlan(plan)).map(escapeHTML).join('<br>')}</div>`;
				} catch (err) {
					html = `<div class="te_error">${escapeHTML(err.message || String(err))}</div>`;
				}
			}
			if (run != preview_run) return;
			let holder = planHolder(this, 'te_export_plan');
			if (holder) holder.innerHTML = `<div class="te_hint">${t('dp_will_be_written')}</div>` + html;
		},
		onConfirm(result) {
			applyExportForm(data, result);
			refreshPanels();
			runExport(false);
		},
	});
	dialog.show();
	setTimeout(() => dialog.onFormChange && dialog.onFormChange(dialog.getFormResult()), 50);
}
function applyExportForm(data, result) {
	let new_id = sanitizeId(result.trim_id);
	if (data === Project.armor_trim_editor && new_id && Project.name == data.trim_id) {
		Project.name = new_id;
		if (typeof setProjectTitle == 'function') setProjectTitle();
	}
	data.trim_id = new_id;
	data.mc_version = result.mc_version;
	let e = data.export;
	e.pack_type = result.pack_type == 'folder' ? 'folder' : 'zip';
	if (result.pack_path !== undefined) e.pack_path = result.pack_path;
	if (result.zip_dir !== undefined) e.zip_dir = result.zip_dir;
	if (result.zip_name !== undefined) e.zip_name = zipFileName(result.zip_name) || result.zip_name;
	e.namespace = sanitizeId(result.namespace) || 'minecraft';
	e.register_atlas = result.register_atlas;
	e.sync_permutations = result.sync_permutations;
	e.icon = result.icon;
	if (result.icon_texture !== undefined) e.icon_texture = result.icon_texture.trim();
	if (result.icon_model !== undefined) e.icon_model = result.icon_model.trim();
	if (result.icon_parent !== undefined) e.icon_parent = result.icon_parent.trim();
	e.backup = result.backup;
}
function quickExport() {
	let data = D();
	if (!data) return;
	if (!rpTargetPath(data.export) || !data.last_export) {
		openExportDialog();
		return;
	}
	runExport(true);
}

// ============================================================================
// Datapack generator
// ============================================================================

const LANG_CODE = /^[a-z]{2,3}_[a-z]{2,4}$/;

function patternKey(data) {
	return (data.export.namespace || 'minecraft') + ':' + data.trim_id;
}
function titleCase(id) {
	return id.split(/[_\-.]+/).filter(Boolean).map(w => w[0].toUpperCase() + w.substring(1)).join(' ');
}
function parseNames(text) {
	let names = [], skipped = [];
	for (let line of String(text || '').split(/\r?\n/)) {
		line = line.trim();
		if (!line) continue;
		let i = line.indexOf('=');
		let code = i > 0 ? line.substring(0, i).trim().toLowerCase() : '';
		let name = i > 0 ? line.substring(i + 1).trim() : '';
		if (!LANG_CODE.test(code)) {
			skipped.push(line);
		} else if (name) {
			names.push({code, name});
		}
	}
	return {names, skipped};
}
async function langNamesFromPack(data) {
	// Existing names of this pattern in the resource pack, as "code=name" lines
	let target = rpTargetPath(data.export);
	let key = `trim_pattern.${data.export.namespace || 'minecraft'}.${data.trim_id}`;
	let lines = [];
	if (target && pathExists(target)) {
		try {
			let pack = await packStorage(target).load();
			for (let file of pack.listDir('assets/minecraft/lang')) {
				if (!file.endsWith('.json')) continue;
				try {
					let json = JSON.parse(await readPackText(pack, 'assets/minecraft/lang/' + file));
					if (typeof json[key] == 'string') lines.push(file.replace('.json', '') + '=' + json[key]);
				} catch (err) {}
			}
		} catch (err) {}
	}
	if (!lines.some(l => l.startsWith('en_us='))) lines.unshift('en_us=' + titleCase(data.trim_id));
	if (Language.code == 'ru' && !lines.some(l => l.startsWith('ru_ru='))) lines.push('ru_ru=');
	return lines.join('\n');
}

function datapackPlan(data) {
	let d = data.datapack;
	let ns = data.export.namespace || 'minecraft';
	let id = data.trim_id;
	let version = mcVersion(data.mc_version);
	let name = zipFileName(d.name);
	let plan = {file: d.dir && name ? PathModule.join(d.dir, name + '.zip') : '', ns, id, version, key: ns + ':' + id, lang: [], skipped: []};
	plan.pattern_rel = `data/${ns}/trim_pattern/${id}.json`;
	plan.pattern = {
		asset_id: ns + ':' + id,
		description: {translate: `trim_pattern.${ns}.${id}`},
		decal: !!d.decal,
	};
	// Before 1.21.5 a pattern needs a template item; structure_void cannot be obtained in survival
	if (version.template_item) plan.pattern.template_item = 'minecraft:structure_void';
	let {names, skipped} = parseNames(d.names);
	plan.skipped = skipped;
	plan.rp_target = rpTargetPath(data.export);
	if (names.length && plan.rp_target) {
		for (let entry of names) plan.lang.push(Object.assign({rel: `assets/minecraft/lang/${entry.code}.json`}, entry));
	}
	plan.names_without_pack = names.length > 0 && !plan.rp_target;
	return plan;
}
function datapackErrors(data, plan) {
	let errors = [];
	let d = data.datapack;
	let id_error = trimIdError(data.trim_id);
	if (id_error) errors.push(id_error);
	if (!d.dir) errors.push(t('dp_no_folder'));
	else if (pathExists(d.dir) && !isDirectory(d.dir)) errors.push(t('dp_not_folder') + d.dir);
	if (!zipFileName(d.name)) errors.push(t('invalid_zip_name'));
	if (plan.rp_target && data.export.pack_type == 'folder' && !isDirectory(plan.rp_target)) errors.push(t('resource_pack_folder_not_found') + plan.rp_target);
	return errors;
}
async function describeDatapackPlan(plan) {
	let dp = await new ZipPack(plan.file).load();
	let lines = [planHeader(dp)];
	lines.push((dp.exists('pack.mcmeta') ? '· ' : '＋ ') + 'pack.mcmeta');
	lines.push((dp.exists(plan.pattern_rel) ? '♻ ' : '＋ ') + plan.pattern_rel);
	if (plan.lang.length) {
		let rp = await packStorage(plan.rp_target).load();
		let key = `trim_pattern.${plan.ns}.${plan.id}`;
		for (let entry of plan.lang) {
			let mark = '＋ ';
			if (rp.exists(entry.rel)) {
				let current;
				try { current = JSON.parse(await readPackText(rp, entry.rel))[key]; } catch (err) {}
				mark = current === entry.name ? '· ' : '✎ ';
			}
			lines.push(mark + t('dp_rp') + PathModule.basename(rp.path) + ' › ' + entry.rel + ` — ${entry.name}`);
		}
	}
	return lines;
}
async function runDatapackExport() {
	let data = D();
	if (!data) return;
	let plan = datapackPlan(data);
	let errors = datapackErrors(data, plan);
	if (errors.length) {
		Blockbench.showMessageBox({title: t('dp_title'), icon: 'error', message: errors.map(escapeHTML).join('<br>')});
		return;
	}
	let stamp = data.export.backup ? new Date().toISOString().replace(/[:.]/g, '-') : null;
	let written = [], notes = [];
	try {
		let dp = await new ZipPack(plan.file).load();
		if (!dp.exists('pack.mcmeta')) {
			dp.write('pack.mcmeta', mcmetaText(plan.version, 'dp'));
			written.push('pack.mcmeta');
		} else {
			let format;
			try { format = mcmetaFormat(JSON.parse(await readPackText(dp, 'pack.mcmeta'))); } catch (err) {}
			if (format != plan.version.dp) notes.push(t('dp_format_mismatch', [String(format), plan.version.name, plan.version.dp]));
		}
		dp.write(plan.pattern_rel, JSON.stringify(plan.pattern, null, 2) + '\n');
		written.push(plan.pattern_rel);
		await dp.save(stamp);

		if (plan.lang.length) {
			let rp = await packStorage(plan.rp_target).load();
			let file_stamp = rp.kind == 'folder' ? stamp : null;
			if (!rp.exists('pack.mcmeta')) rp.write('pack.mcmeta', mcmetaText(plan.version, 'rp'));
			let key = `trim_pattern.${plan.ns}.${plan.id}`;
			for (let entry of plan.lang) {
				let text = await readPackText(rp, entry.rel) || '';
				let json = text ? JSON.parse(text) : {};
				if (json[key] === entry.name) continue;
				json[key] = entry.name;
				writeJSON(rp, entry.rel, json, text, file_stamp);
				written.push(t('dp_rp') + PathModule.basename(rp.path) + ' › ' + entry.rel);
			}
			await rp.save(stamp);
		}
		if (plan.names_without_pack) notes.push(t('dp_names_need_pack'));
		for (let line of plan.skipped) notes.push(t('dp_bad_name_line', [line]));
		Prefs.set({datapack_dir: data.datapack.dir, datapack_name: data.datapack.name, mc_version: data.mc_version});
		showDatapackResult(plan, written, notes);
	} catch (err) {
		showError(t('dp_title'), err);
	}
}
async function openDatapackDialog() {
	let data = D();
	if (!data) return;
	let d = data.datapack;
	if (!d.names) d.names = await langNamesFromPack(data);
	let preview_run = 0;
	let dialog = new Dialog({
		id: 'armor_trim_editor_datapack',
		title: t('dp_title'),
		width: 640,
		form: {
			_pattern: {type: 'info', text: t('dp_pattern_info', [patternKey(data)])},
			dir: {label: t('dp_dir'), type: 'folder', value: d.dir, description: t('dp_dir_desc')},
			name: {label: t('zip_name'), type: 'text', value: d.name, description: t('dp_name_desc')},
			version: {label: t('dp_version'), type: 'select', options: versionOptions(), value: mcVersion(data.mc_version).id},
			decal: {label: 'Decal', type: 'checkbox', value: d.decal, description: t('dp_decal_desc')},
			names: {label: t('dp_names'), type: 'textarea', height: 64, value: d.names,
				description: t('dp_names_desc', [`${data.export.namespace || 'minecraft'}.${data.trim_id}`])},
		},
		async onFormChange(result) {
			let run = ++preview_run;
			let tmp = JSON.parse(JSON.stringify(data));
			Object.assign(tmp.datapack, {dir: result.dir, name: result.name, decal: result.decal, names: result.names});
			tmp.mc_version = result.version;
			let plan = datapackPlan(tmp);
			let errors = datapackErrors(tmp, plan);
			let html;
			if (errors.length) {
				html = `<div class="te_error">${errors.map(escapeHTML).join('<br>')}</div>`;
			} else {
				try {
					html = `<div class="te_plan_list">${(await describeDatapackPlan(plan)).map(escapeHTML).join('<br>')}</div>`;
				} catch (err) {
					html = `<div class="te_error">${escapeHTML(err.message || String(err))}</div>`;
				}
				if (plan.names_without_pack) html += `<div class="te_hint">${t('dp_names_need_pack')}</div>`;
			}
			if (run != preview_run) return;
			let holder = planHolder(this, 'te_datapack_plan');
			if (holder) holder.innerHTML = `<div class="te_hint">${t('dp_will_be_written')}</div>` + html;
		},
		onConfirm(result) {
			Object.assign(d, {dir: result.dir, name: zipFileName(result.name) || result.name, decal: result.decal, names: result.names});
			updatePreviewUniforms();
			refreshPanels();
			data.mc_version = result.version;
			runDatapackExport();
		},
	});
	dialog.show();
	setTimeout(() => dialog.onFormChange && dialog.onFormChange(dialog.getFormResult()), 50);
}

function giveCommand(key) {
	return `/give @s minecraft:diamond_chestplate[minecraft:trim={material:"minecraft:redstone",pattern:"${key}"}]`;
}
function paperCode(key) {
	let p = parseResourceId(key);
	let namespaced = p.ns == 'minecraft' ? `NamespacedKey.minecraft("${p.path}")` : `NamespacedKey.fromString("${p.ns}:${p.path}")`;
	return [
		'TrimPattern pattern = RegistryAccess.registryAccess()',
		'        .getRegistry(RegistryKey.TRIM_PATTERN)',
		`        .get(${namespaced});`,
		'if (pattern != null) {',
		'    ArmorTrim trim = new ArmorTrim(TrimMaterial.REDSTONE, pattern);',
		'    item.editMeta(ArmorMeta.class, meta -> meta.setTrim(trim));',
		'}',
	].join('\n');
}
function gameGuideHTML(key) {
	return `
		<h3>${t('guide_server_h')}</h3>
		<ol class="te_guide">
			<li>${t('guide_server_1')}</li>
			<li>${t('guide_server_2')}</li>
			<li>${t('guide_server_3')}</li>
		</ol>
		<h3>${t('guide_give_h')}</h3>
		<pre class="te_code">${escapeHTML(giveCommand(key))}</pre>
		<p class="te_hint">${t('guide_material')} ${t('guide_smithing')}</p>
		<h3>${t('guide_plugin_h')}</h3>
		<pre class="te_code">${escapeHTML(paperCode(key))}</pre>
		<p class="te_hint">${t('guide_plugin_note')}</p>`;
}
function guideButtons(key) {
	return {
		buttons: [t('copy_give'), t('copy_code'), t('done')],
		onButton(index) {
			if (index == 0) {
				Clipbench.setText(giveCommand(key));
				notify(t('copied'));
				return false;
			}
			if (index == 1) {
				Clipbench.setText(paperCode(key));
				notify(t('copied'));
				return false;
			}
		},
	};
}
function showDatapackResult(plan, written, notes) {
	let html = `<p>${t('written_to')}: <b class="te_break">${escapeHTML(plan.file)}</b></p>`;
	html += `<p>${t('files_written')}: <b>${written.length}</b></p><ul class="te_list">${written.map(p => `<li>${escapeHTML(p)}</li>`).join('')}</ul>`;
	for (let note of notes) html += `<p class="te_warn_text">${escapeHTML(note)}</p>`;
	html += gameGuideHTML(plan.key);
	new Dialog(Object.assign({
		id: 'armor_trim_editor_datapack_result',
		title: t('dp_done_title'),
		width: 640,
		component: {template: `<div class="te_dialog_html">${html}</div>`},
		cancelIndex: 2,
		confirmIndex: 2,
	}, guideButtons(plan.key))).show();
}
function openGameGuide() {
	let data = D();
	let key = data ? patternKey(data) : 'minecraft:my_trim';
	new Dialog(Object.assign({
		id: 'armor_trim_editor_guide',
		title: t('guide_title'),
		width: 640,
		component: {template: `<div class="te_dialog_html">${gameGuideHTML(key)}</div>`},
		cancelIndex: 2,
		confirmIndex: 2,
	}, guideButtons(key))).show();
}

// ============================================================================
// Import
// ============================================================================

async function scanPackTrims(pack) {
	let found = {};
	let add = (ns, id, key, rel) => {
		let k = ns + ':' + id;
		if (!found[k]) found[k] = {ns, id, humanoid: null, leggings: null, registered: false};
		if (key) found[k][key] = rel;
	};
	for (let ns of pack.listDir('assets')) {
		for (let [layer, key] of [['humanoid', 'humanoid'], ['humanoid_leggings', 'leggings']]) {
			let dir = `assets/${ns}/textures/trims/entity/${layer}`;
			for (let file of pack.listDir(dir)) {
				let m = file.match(/^([a-z0-9_.\-]+)\.png$/);
				if (m) add(ns, m[1], key, dir + '/' + file);
			}
		}
	}
	try {
		let atlas = JSON.parse(await readPackText(pack, 'assets/minecraft/atlases/armor_trims.json'));
		for (let source of atlas.sources || []) {
			for (let t of source.textures || []) {
				let p = parseResourceId(t);
				let m = p.path.match(/^trims\/entity\/humanoid(?:_leggings)?\/(.+)$/);
				if (m) {
					add(p.ns, m[1]);
					found[p.ns + ':' + m[1]].registered = true;
				}
			}
		}
	} catch (err) {}
	return Object.values(found).sort((a, b) => a.id.localeCompare(b.id));
}
async function readPackPNG(pack, rel) {
	if (!rel) return null;
	let buffer = await pack.read(rel);
	return buffer ? bufferToDataURL(buffer) : null;
}
function iconRel(pattern, id) {
	let p = parseResourceId(pattern.replace(/\{id\}/g, id));
	return `assets/${p.ns}/textures/${p.path}.png`;
}
function openImportDialog() {
	let prefs = Prefs.get();
	let pack = prefs.import_path || rpTargetPath({pack_type: prefs.pack_type, pack_path: prefs.pack_path, zip_dir: prefs.zip_dir, zip_name: prefs.zip_name}) || '';
	let dialog = new Dialog({
		id: 'armor_trim_editor_import',
		title: t('open_trim_from_resource_pack'),
		width: 600,
		component: {
			data() {
				return {pack, list: [], selected: '', icon_pattern: prefs.icon_texture || DEFAULT_ICON_ID, error: '', filter: '', storage: null};
			},
			computed: {
				filtered() {
					let f = this.filter.toLowerCase();
					return this.list.filter(t => !f || t.id.includes(f) || t.ns.includes(f));
				},
			},
			methods: {
				pickFolder() {
					let path = Blockbench.pickDirectory({title: t('resource_pack_folder'), startpath: this.pack || undefined, resource_id: 'armor_trim_editor_pack'});
					if (path) { this.pack = path; this.scan(); }
				},
				pickZip() {
					Blockbench.import({extensions: ['zip'], type: t('rp_type_zip'), readtype: 'none', resource_id: 'armor_trim_editor_pack'}, (files) => {
						if (files[0] && files[0].path) { this.pack = files[0].path; this.scan(); }
					});
				},
				confirmDialog() {
					if (Dialog.open && Dialog.open.id == 'armor_trim_editor_import') Dialog.open.confirm();
				},
				async scan() {
					this.error = '';
					this.list = [];
					this.storage = null;
					try {
						if (!this.pack || !pathExists(this.pack)) return;
						if (!/\.zip$/i.test(this.pack) && !isDirectory(this.pack)) return;
						let storage = await packStorage(this.pack).load();
						let list = await scanPackTrims(storage);
						for (let trim of list) trim.icon = await readPackPNG(storage, iconRel(this.icon_pattern, trim.id));
						this.storage = storage;
						this.list = list;
						if (!list.length) this.error = t('no_trims_found_in_this_pack');
					} catch (err) {
						this.error = err.message || String(err);
					}
				},
			},
			mounted() { this.scan(); },
			template: `
				<div class="te_import">
					<div class="te_form_row"><label>${t('pack_2')}</label><input type="text" v-model="pack" @change="scan()" class="dark_bordered" placeholder="${t('folder_or_zip')}">
						<button @click="pickFolder()" title="${t('rp_type_folder')}"><i class="material-icons">folder</i></button>
						<button @click="pickZip()" title="${t('rp_type_zip')}"><i class="material-icons">folder_zip</i></button></div>
					<div class="te_form_row"><label>${t('icon')}</label><input type="text" v-model="icon_pattern" @change="scan()" class="dark_bordered"></div>
					<div class="te_form_row"><label>${t('search')}</label><input type="text" v-model="filter" class="dark_bordered"></div>
					<ul class="te_trim_list">
						<li v-for="t in filtered" :class="{selected: selected == t.ns + ':' + t.id}" @click="selected = t.ns + ':' + t.id" @dblclick="selected = t.ns + ':' + t.id; confirmDialog()">
							<img v-if="t.icon" :src="t.icon" class="te_list_icon"><span v-else class="te_list_icon"></span>
							<b>{{ t.id }}</b> <span class="te_ns">{{ t.ns }}</span>
							<span class="te_tags">
								<span :class="{off: !t.humanoid}">humanoid</span>
								<span :class="{off: !t.leggings}">leggings</span>
								<span :class="{off: !t.registered}">${t('atlas_2')}</span>
							</span>
						</li>
					</ul>
					<div class="te_error" v-if="error">{{ error }}</div>
				</div>`,
		},
		onConfirm() {
			let vm = this.content_vue;
			let trim = vm && vm.list.find(t => t.ns + ':' + t.id == vm.selected);
			if (!trim || !vm.storage) return false;
			Prefs.set({import_path: vm.pack, icon_texture: vm.icon_pattern});
			importFromPack(vm.storage, trim, vm.icon_pattern).catch(err => showError(t('could_not_create_trim'), err));
		},
	});
	dialog.show();
}
async function importFromPack(storage, trim, icon_pattern) {
	let target = storage.kind == 'zip'
		? {pack_type: 'zip', zip_dir: PathModule.dirname(storage.path), zip_name: PathModule.basename(storage.path).replace(/\.zip$/i, '')}
		: {pack_type: 'folder', pack_path: storage.path};
	await importTrim({
		trim_id: trim.id,
		humanoid: await readPackPNG(storage, trim.humanoid),
		leggings: await readPackPNG(storage, trim.leggings),
		icon: await readPackPNG(storage, iconRel(icon_pattern, trim.id)),
		export: Object.assign({namespace: trim.ns, icon_texture: icon_pattern, icon_model: icon_pattern}, target),
	});
}
async function importTrim(opts) {
	let res = 1;
	for (let url of [opts.humanoid, opts.leggings]) {
		if (!url) continue;
		let img = await loadImage(url);
		res = Math.max(res, Math.round(img.naturalWidth / 64));
	}
	startNewTrim(Object.assign({resolution: res}, opts));
}

// ============================================================================
// New trim / settings dialogs
// ============================================================================

function openNewTrimDialog() {
	let prefs = Prefs.get();
	let patterns = {empty: t('empty')};
	for (let p of VANILLA_PATTERNS) patterns['vanilla:' + p] = t('vanilla') + p;
	let skins = {};
	for (let s of DEFAULT_SKINS) skins[s] = s[0].toUpperCase() + s.substring(1);
	let armors = {};
	for (let a of ARMOR_MATERIALS) armors[a.id] = a.name;
	new Dialog({
		id: 'armor_trim_editor_new',
		title: t('new_armor_trim'),
		width: 520,
		form: {
			trim_id: {label: t('trim_id'), type: 'text', value: 'new_trim'},
			base: {label: t('start_from'), type: 'select', options: patterns, value: 'empty'},
			resolution: {label: t('resolution'), type: 'select', value: '1', options: {'1': '64×32 (16x)', '2': '128×64 (32x)', '4': '256×128 (64x)'}},
			skin: {label: t('skin'), type: 'select', options: skins, value: 'steve'},
			armor: {label: t('armor_under_trim'), type: 'select', options: armors, value: 'diamond'},
		},
		async onConfirm(result) {
			let id = sanitizeId(result.trim_id) || 'new_trim';
			let opts = {
				trim_id: id,
				resolution: parseInt(result.resolution) || 1,
				armor: result.armor,
				skin: {source: 'default', id: result.skin, slim: !!DEFAULT_SLIM[result.skin], name: ''},
			};
			if (result.base.startsWith('vanilla:')) {
				let pattern = result.base.substring(8);
				try {
					opts.humanoid = await Assets.trim(pattern, 'humanoid');
					opts.leggings = await Assets.trim(pattern, 'humanoid_leggings');
					let template = await Assets.template(pattern);
					if (template) opts.icon = template;
					opts.resolution = 1;
				} catch (err) {
					showError(t('could_not_load_vanilla_trim'), err);
					return;
				}
			}
			startNewTrim(opts);
		},
	}).show();
}

function openSettingsDialog() {
	let candidates = [];
	try { candidates = Assets.candidates(); } catch (err) {}
	let options = {};
	for (let c of candidates) options[c.path] = `${c.version} — ${c.source}`;
	let current = Assets.resolvePath();
	if (current && !options[current]) options[current] = current;
	options.custom = t('other_file');
	new Dialog({
		id: 'armor_trim_editor_settings',
		title: t('trim_editor_settings'),
		width: 640,
		form: {
			jar: {label: t('minecraft_client_jar'), type: 'select', options, value: current || 'custom'},
			custom_jar: {label: t('jar_path'), type: 'file', extensions: ['jar'], filetype: 'JAR', condition: (f) => f.jar == 'custom'},
			info: {type: 'info', text: t('the_jar_provides_default_skins_armor')},
		},
		onConfirm(result) {
			let path = result.jar == 'custom' ? result.custom_jar : result.jar;
			if (path) {
				Assets.setPath(path);
				notify(t('jar_saved'));
			}
		},
	}).show();
}

function openHelpDialog() {
	let rows = [
		['humanoid', t('helmet_0_0_at_1_0_and_outer_hat_32_0_at')],
		['humanoid_leggings', t('leggings_waist_16_16_at_0_5_legs_0_16_at')],
	];
	let html = `
		<p>${t('a_trim_is_drawn_on_the_same_model_as_the')}</p>
		<table class="te_table">${rows.map(r => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td></tr>`).join('')}</table>
		<p>${t('two_layers_on_the_helmet_are_the_left')}</p>
		<p>${t('left_arm_and_leg_reuse_the_right_side')}</p>
		<p>${t('palette_only_the_8_grays_e0e0e0_000000')}</p>
		<p>${t('transparency_trims_render_as_cutout')}</p>
		<p>${t('server_the_pattern_is_registered_by_a')}</p>`;
	new Dialog({id: 'armor_trim_editor_help', title: t('how_armor_trims_work'), width: 700,
		component: {template: `<div class="te_dialog_html">${html}</div>`},
		buttons: [t('guide_menu'), t('done')], cancelIndex: 1, confirmIndex: 1,
		onButton(index) { if (index == 0) setTimeout(openGameGuide, 50); }}).show();
}

// ============================================================================
// Panels
// ============================================================================

const panels = {};
function refreshPanels() {
	for (let id in panels) {
		let vue = panels[id] && panels[id].inside_vue;
		if (vue && vue.refresh) vue.refresh();
	}
}
function drawSkinHead(canvas) {
	let texture = findTexture('skin');
	if (!canvas || !texture || !texture.canvas || !texture.canvas.width) return;
	let ctx = canvas.getContext('2d');
	let s = texture.canvas.width / 64;
	ctx.imageSmoothingEnabled = false;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(texture.canvas, 8 * s, 8 * s, 8 * s, 8 * s, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(texture.canvas, 40 * s, 8 * s, 8 * s, 8 * s, 0, 0, canvas.width, canvas.height);
}

function showPreviewTabOnce() {
	// On first use, bring the preview tab to the front of the panel it is attached to
	if (Prefs.get().preview_tab_shown) return;
	let panel = panels.view;
	let host = panel && panel.getHostPanel && panel.getHostPanel();
	if (host && host.selectTab) host.selectTab(panel);
	Prefs.set({preview_tab_shown: true});
}

function createPanels() {
	panels.view = track(new Panel('armor_trim_editor_view', {
		name: t('trim_preview'),
		icon: 'checkroom',
		condition: {formats: [FORMAT_ID]},
		growable: true,
		resizable: true,
		default_position: {slot: 'right_bar', attached_to: 'outliner', attached_index: 0, float_position: [0, 0], float_size: [320, 460], height: 400},
		component: {
			data() {
				return {
					d: null,
					tab: 'view',
					pieces: PIECE_ORDER.map(id => ({id, name: PIECE_NAMES[id]})),
					layers: [
						{id: 'trim', name: t('trim')},
						{id: 'armor', name: t('armor')},
						{id: 'skin', name: t('skin')},
						{id: 'skin_outer', name: t('skin_overlay')},
						{id: 'icon', name: t('icon')},
					],
					materials: TRIM_MATERIALS,
					armors: ARMOR_MATERIALS,
					poses: POSES,
					skins: DEFAULT_SKINS,
					nickname: '',
					loading: '',
				};
			},
			computed: {
				skinLabel() {
					if (!this.d) return '';
					let s = this.d.skin;
					if (s.source == 'player') return s.name;
					if (s.source == 'file') return t('from_file');
					return s.id[0].toUpperCase() + s.id.substring(1);
				},
				poseName() {
					let pose = this.d && POSES.find(p => p.id == this.d.pose.id);
					return pose ? pose.name : '';
				},
				materialName() {
					if (!this.d || this.d.preview.material == 'none') return t('as_painted');
					let mat = TRIM_MATERIALS.find(m => m.id == this.d.preview.material);
					let palette = effectivePaletteId(this.d.preview.material, this.d.armor.material);
					return (mat ? mat.name : '') + (palette.endsWith('_darker') ? t('darker_palette') : '');
				},
			},
			watch: {
				tab() { this.$nextTick(() => drawSkinHead(this.$refs.head)); },
			},
			methods: {
				refresh() {
					this.d = D();
					this.$nextTick(() => drawSkinHead(this.$refs.head));
				},
				togglePiece(id) { this.d.view.pieces[id] = !this.d.view.pieces[id]; applyVisibility(); },
				soloPiece(id) {
					let pieces = this.d.view.pieces;
					let solo = PIECE_ORDER.every(p => pieces[p] == (p == id));
					for (let p of PIECE_ORDER) pieces[p] = solo ? true : p == id;
					applyVisibility();
				},
				toggleLayer(id) { this.d.view.layers[id] = !this.d.view.layers[id]; applyVisibility(); },
				toggleHelmet(key) { this.d.view[key] = !this.d.view[key]; applyVisibility(); },
				setArmor() { refreshArmor(); },
				setMaterial(id) { this.d.preview.material = id; updatePreviewUniforms(); },
				toggleHighlight() { this.d.preview.highlight = !this.d.preview.highlight; updatePreviewUniforms(); },
				toggleDecal() { this.d.datapack.decal = !this.d.datapack.decal; updatePreviewUniforms(); },
				setPose(id) {
					this.d.pose.id = id;
					PoseRuntime.ticks = 0;
				},
				resetHead() { this.d.pose.head_yaw = 0; this.d.pose.head_pitch = 0; },
				async setDefaultSkin(id) {
					this.d.skin.source = 'default';
					this.d.skin.id = id;
					this.d.skin.slim = !!DEFAULT_SLIM[id];
					this.loading = '…';
					await refreshSkin();
					this.loading = '';
				},
				async setSlim(slim) {
					this.d.skin.slim = slim;
					if (this.d.skin.source == 'default') await refreshSkin();
					else { applySkinModel(); this.refresh(); }
				},
				loadSkinFile() {
					Blockbench.import({extensions: ['png'], type: 'PNG', readtype: 'image', resource_id: 'armor_trim_editor_skin'}, async (files) => {
						if (!files[0]) return;
						try {
							await setCustomSkin(files[0].content, undefined, 'file');
						} catch (err) { showError(t('skin_not_loaded'), err); }
					});
				},
				async loadNickname() {
					let name = this.nickname.trim();
					if (!/^[A-Za-z0-9_]{2,16}$/.test(name)) {
						notify(t('invalid_nickname'));
						return;
					}
					this.loading = t('loading');
					try {
						await loadPlayerSkin(name);
					} catch (err) {
						showError(t('skin_not_loaded'), err);
					}
					this.loading = '';
				},
			},
			template: `
				<div class="te_panel_wrap"><div class="te_panel te_tabbed" v-if="d">
					<div class="te_tabs">
						<div :class="{on: tab == 'view'}" @click="tab = 'view'"><i class="material-icons">visibility</i>${t('view')}</div>
						<div :class="{on: tab == 'pose'}" @click="tab = 'pose'"><i class="material-icons">accessibility_new</i>${t('pose')}</div>
						<div :class="{on: tab == 'skin'}" @click="tab = 'skin'"><i class="material-icons">face</i>${t('skin')}</div>
					</div>
					<div class="te_tab_body">

					<template v-if="tab == 'view'">
						<div class="te_label">${t('armor_pieces')}<span class="te_hint_inline">${t('right_click_solo')}</span></div>
						<div class="te_chips">
							<div v-for="p in pieces" class="te_chip" :class="{on: d.view.pieces[p.id]}" @click="togglePiece(p.id)" @contextmenu.prevent="soloPiece(p.id)">{{ p.name }}</div>
						</div>
						<div class="te_chips">
							<div class="te_chip small" :class="{on: d.view.helmet_inner}" @click="toggleHelmet('helmet_inner')" title="${t('left_half_of_the_humanoid_top_row_0_0')}">${t('helmet_1_0')}</div>
							<div class="te_chip small" :class="{on: d.view.helmet_outer}" @click="toggleHelmet('helmet_outer')" title="${t('right_half_of_the_humanoid_top_row_32_0')}">${t('helmet_1_5_outer')}</div>
						</div>
						<div class="te_chips">
							<div v-for="l in layers" class="te_chip small" :class="{on: d.view.layers[l.id]}" @click="toggleLayer(l.id)">{{ l.name }}</div>
						</div>
						<div class="te_label">${t('armor')}</div>
						<div class="te_row">
							<select v-model="d.armor.material" @change="setArmor()" class="te_select">
								<option v-for="a in armors" :value="a.id">{{ a.name }}</option>
							</select>
							<input v-if="d.armor.material == 'leather'" type="color" v-model="d.armor.leather_color" @change="setArmor()" title="${t('leather_dye')}">
						</div>
						<div class="te_label">${t('trim_material')}: <span class="te_small">{{ materialName }}</span></div>
						<div class="te_materials">
							<div class="te_material none" :class="{on: d.preview.material == 'none'}" @click="setMaterial('none')" title="${t('as_painted_2')}"><i class="material-icons">block</i></div>
							<div v-for="m in materials" class="te_material" :class="{on: d.preview.material == m.id}" :style="{background: m.color}" :title="m.name" @click="setMaterial(m.id)"></div>
						</div>
						<div class="te_chips">
							<div class="te_chip small" :class="{on: d.preview.highlight}" @click="toggleHighlight()" title="${t('pink_follow_the_material_cyan_keep_their')}">${t('highlight_palette')}</div>
							<div class="te_chip small" :class="{on: d.datapack.decal}" @click="toggleDecal()" title="${t('decal_preview_desc')}">Decal</div>
						</div>
					</template>

					<template v-if="tab == 'pose'">
						<div class="te_label">{{ poseName }}</div>
						<div class="te_poses">
							<div v-for="p in poses" class="te_pose" :class="{on: d.pose.id == p.id}" :title="p.name" @click="setPose(p.id)">
								<i class="material-icons">{{ p.icon }}</i>
							</div>
						</div>
						<div class="te_row">
							<i class="material-icons te_btn" @click="d.pose.paused = !d.pose.paused" :title="d.pose.paused ? '${t('play')}' : '${t('pause')}'">{{ d.pose.paused ? 'play_arrow' : 'pause' }}</i>
							<span class="te_small te_w">${t('speed')}</span>
							<input type="range" min="0.1" max="2" step="0.05" v-model.number="d.pose.speed">
						</div>
						<div class="te_row">
							<i class="material-icons te_btn" @click="resetHead()" title="${t('reset_head')}">restart_alt</i>
							<span class="te_small te_w">${t('head_2')}</span><input type="range" min="-70" max="70" step="1" v-model.number="d.pose.head_yaw">
						</div>
						<div class="te_row">
							<i class="material-icons te_btn te_ghost">restart_alt</i>
							<span class="te_small te_w">${t('head_3')}</span><input type="range" min="-80" max="80" step="1" v-model.number="d.pose.head_pitch">
						</div>
						<div class="te_hint">${t('animation_freezes_while_you_paint_poses')}</div>
					</template>

					<template v-if="tab == 'skin'">
						<div class="te_row te_skin_head">
							<canvas ref="head" width="32" height="32" class="te_head"></canvas>
							<div><div>{{ skinLabel }}</div><div class="te_small">{{ d.skin.slim ? '${t('slim_arms')}' : '${t('wide_arms')}' }} {{ loading }}</div></div>
						</div>
						<div class="te_label">${t('default_skins')}</div>
						<div class="te_chips">
							<div v-for="s in skins" class="te_chip small" :class="{on: d.skin.source == 'default' && d.skin.id == s}" @click="setDefaultSkin(s)">{{ s[0].toUpperCase() + s.substring(1) }}</div>
						</div>
						<div class="te_label">${t('player_skin_by_name')}</div>
						<div class="te_row">
							<input type="text" class="dark_bordered te_input" v-model="nickname" placeholder="${t('name')}" @keydown.enter="loadNickname()">
							<i class="material-icons te_btn" @click="loadNickname()" title="${t('load')}">download</i>
							<i class="material-icons te_btn" @click="loadSkinFile()" title="${t('skin_from_file')}">folder_open</i>
						</div>
						<div class="te_chips">
							<div class="te_chip small" :class="{on: !d.skin.slim}" @click="setSlim(false)">${t('wide_arms_2')}</div>
							<div class="te_chip small" :class="{on: d.skin.slim}" @click="setSlim(true)">${t('slim_arms_2')}</div>
						</div>
						<div class="te_hint">${t('armor_uses_the_same_wide_arms_for_slim')}</div>
					</template>
					</div>
				</div></div>`,
		},
	}));

	panels.tools = track(new Panel('armor_trim_editor_tools', {
		name: t('trim_palette_export'),
		icon: 'palette',
		condition: {formats: [FORMAT_ID]},
		growable: true,
		resizable: true,
		default_position: {slot: 'left_bar', float_position: [0, 0], float_size: [300, 400], height: 230},
		component: {
			data() {
				return {d: null, keys: PALETTE_KEY, issues: [], checked: false};
			},
			computed: {
				mapped() {
					if (!this.d) return PALETTE_KEY;
					let mat = this.d.preview.material;
					if (mat == 'none') return PALETTE_KEY;
					let palette = PALETTES[effectivePaletteId(mat, this.d.armor.material)];
					return palette ? palette.map(h => '#' + h) : PALETTE_KEY;
				},
				packShort() {
					let p = this.d && rpTargetPath(this.d.export);
					if (!p) return t('no_resource_pack');
					return p.length > 34 ? '…' + p.substring(p.length - 33) : p;
				},
			},
			methods: {
				refresh() { this.d = D(); if (this.checked) this.check(); },
				pick(hex) { ColorPanel.set(hex); },
				check() { this.issues = validateTrim(); this.checked = true; },
				fix(issue) { applyFix(issue.fix); this.check(); },
				exportDialog() { openExportDialog(); },
				quick() { quickExport(); },
				icon() { openIconGenerator(); },
				datapack() { openDatapackDialog(); },
			},
			template: `
				<div class="te_panel_wrap"><div class="te_panel" v-if="d">
					<div class="te_label">${t('trim_palette')}</div>
					<div class="te_palette">
						<div v-for="(k, i) in keys" class="te_key" @click="pick(k)" :title="k.toUpperCase() + ' → ' + mapped[i].toUpperCase()">
							<div :style="{background: k}"></div>
							<div :style="{background: mapped[i]}"></div>
						</div>
					</div>
					<div class="te_hint">${t('top_color_to_paint_with_bottom_result')}</div>
					<div class="te_row te_buttons">
						<button @click="exportDialog()" title="${t('export_trim_to_resource_pack')}"><i class="material-icons">save_alt</i>${t('export')}</button>
						<button @click="quick()" title="${t('export_with_the_last_settings_ctrl_alt_e')}"><i class="material-icons">bolt</i>${t('quick')}</button>
						<button @click="datapack()" title="${t('dp_title')}"><i class="material-icons">dns</i>${t('datapack_short')}</button>
					</div>
					<div class="te_row te_buttons">
						<button @click="icon()"><i class="material-icons">auto_fix_high</i>${t('icon')}</button>
						<button @click="check()"><i class="material-icons">fact_check</i>${t('check')}</button>
					</div>
					<div class="te_small te_path"><b>{{ d.trim_id }}</b> → {{ packShort }}</div>
					<div v-if="checked" class="te_issues">
						<div v-if="!issues.length" class="te_hint">${t('no_problems_found')}</div>
						<div v-for="issue in issues" class="te_issue" :class="issue.level">
							<i class="material-icons">{{ issue.level == 'error' ? 'error' : issue.level == 'warn' ? 'warning' : 'info' }}</i>
							<span>{{ issue.text }}</span>
							<button v-if="issue.fix" @click="fix(issue)">{{ issue.fix.label }}</button>
						</div>
					</div>
				</div></div>`,
		},
	}));
}

const CSS = `
/* Panels scroll inside their own height, so small screens still reach every control */
.te_panel_wrap { display: flex; flex-direction: column; flex-grow: 1; height: 100%; min-height: 0; overflow: hidden; }
.te_panel { flex: 1 1 auto; min-height: 0; overflow-x: hidden; overflow-y: auto; padding: 2px 8px 8px; font-size: 14px; }
.te_panel.te_tabbed { display: flex; flex-direction: column; overflow: hidden; padding-bottom: 0; }
.te_tab_body { flex: 1 1 auto; min-height: 0; overflow-x: hidden; overflow-y: auto; padding-bottom: 8px; }
/* As a tab of another panel Blockbench forces the host's height; let the panel shrink to the space it really has */
#panel_armor_trim_editor_view.attached, #panel_armor_trim_editor_tools.attached { min-height: 0; flex: 1 1 0; }
#panel_armor_trim_editor_view.attached.grow, #panel_armor_trim_editor_tools.attached.grow { height: auto; }
.te_tabs { flex-shrink: 0; display: flex; gap: 2px; margin: 2px 0 6px; border-bottom: 1px solid var(--color-border); }
.te_tabs > div { flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; padding: 4px 2px; cursor: pointer; color: var(--color-subtle_text); border-bottom: 2px solid transparent; }
.te_tabs > div i { font-size: 18px; }
.te_tabs > div.on { color: var(--color-light); border-bottom-color: var(--color-accent); }
.te_tabs > div:hover { color: var(--color-light); }
.te_w { width: 64px; }
.te_ghost { visibility: hidden; }
.te_buttons button { height: 28px; font-size: 13px; }
.te_buttons button i { font-size: 18px; }
.te_skin_head { gap: 10px; }
.te_issues { margin-top: 6px; border-top: 1px solid var(--color-border); padding-top: 4px; }
.te_section { padding: 6px 0 8px; border-bottom: 1px solid var(--color-border); }
.te_section:last-child { border-bottom: none; }
.te_label { color: var(--color-subtle_text); margin: 4px 0; display: flex; align-items: center; gap: 4px; }
.te_hint_inline { font-size: 11px; opacity: 0.7; margin-left: auto; }
.te_hint { font-size: 12px; color: var(--color-subtle_text); margin-top: 4px; line-height: 1.35; }
.te_small { font-size: 12px; color: var(--color-subtle_text); white-space: nowrap; }
.te_chips { display: flex; flex-wrap: wrap; gap: 4px; margin: 3px 0; }
.te_chip { padding: 3px 9px; border-radius: 12px; background: var(--color-back); border: 1px solid var(--color-border); cursor: pointer; user-select: none; }
.te_chip.small { font-size: 12px; padding: 2px 8px; }
.te_chip.on { background: var(--color-accent); color: var(--color-accent_text); border-color: var(--color-accent); }
.te_chip:hover { border-color: var(--color-accent); }
.te_row { display: flex; align-items: center; gap: 6px; margin: 4px 0; }
.te_row input[type=range] { flex: 1; min-width: 60px; }
.te_row button { flex: 1; min-width: 0; display: flex; align-items: center; justify-content: center; gap: 4px; }
.te_select { flex: 1; min-width: 0; background: var(--color-back); color: var(--color-text); border: 1px solid var(--color-border); height: 28px; padding: 0 4px; }
.te_input { flex: 1; min-width: 0; height: 28px; padding: 0 6px; }
.te_btn { cursor: pointer; padding: 2px; border-radius: 4px; }
.te_btn:hover { color: var(--color-light); background: var(--color-button); }
.te_materials { display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px; margin: 4px 0; }
.te_material { height: 22px; border-radius: 4px; cursor: pointer; border: 2px solid transparent; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.35); }
.te_material.none { background: var(--color-back); display: flex; align-items: center; justify-content: center; }
.te_material.none i { font-size: 16px; }
.te_material.on { border-color: var(--color-light); }
.te_poses { display: grid; grid-template-columns: repeat(6, 1fr); gap: 3px; margin-bottom: 4px; }
.te_pose { display: flex; align-items: center; justify-content: center; height: 30px; border-radius: 4px; cursor: pointer; background: var(--color-back); border: 1px solid transparent; }
.te_pose span { font-size: 11px; text-align: center; line-height: 1.1; }
.te_pose.on { border-color: var(--color-accent); color: var(--color-light); }
.te_pose:hover { background: var(--color-button); }
.te_head { width: 32px; height: 32px; image-rendering: pixelated; border-radius: 3px; background: var(--color-back); }
.te_palette { display: grid; grid-template-columns: repeat(8, 1fr); gap: 3px; }
.te_key { cursor: pointer; border-radius: 3px; overflow: hidden; box-shadow: 0 0 0 1px var(--color-border); }
.te_key div { height: 16px; }
.te_key:hover { box-shadow: 0 0 0 2px var(--color-accent); }
.te_path { overflow: hidden; text-overflow: ellipsis; direction: ltr; }
.te_issue { display: flex; align-items: flex-start; gap: 4px; font-size: 12px; margin: 4px 0; line-height: 1.3; }
.te_issue i { font-size: 16px; }
.te_issue span { flex: 1; }
.te_issue.error i { color: var(--color-close); }
.te_issue.warn i { color: #e5b84b; }
.te_issue button { font-size: 11px; padding: 0 6px; height: 22px; min-width: 0; }
.te_error { color: var(--color-close); margin: 6px 0; }
.te_pixel { image-rendering: pixelated; width: 128px; height: 128px; background: var(--color-back); border-radius: 4px; }
.te_checker { background-image: linear-gradient(45deg, rgba(128,128,128,.25) 25%, transparent 25%, transparent 75%, rgba(128,128,128,.25) 75%), linear-gradient(45deg, rgba(128,128,128,.25) 25%, transparent 25%, transparent 75%, rgba(128,128,128,.25) 75%); background-size: 16px 16px; background-position: 0 0, 8px 8px; }
.te_icon_previews { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 12px; text-align: center; }
.te_form_row { display: flex; align-items: center; gap: 8px; margin: 6px 0; }
.te_form_row label { width: 140px; flex-shrink: 0; }
.te_form_row select, .te_form_row input[type=text] { flex: 1; height: 30px; background: var(--color-back); color: var(--color-text); border: 1px solid var(--color-border); padding: 0 6px; }
.te_form_row input[type=range] { flex: 1; }
.te_form_row button { flex: 0 0 auto; min-width: 36px; height: 30px; display: flex; align-items: center; justify-content: center; }
.te_list_icon { width: 32px; height: 32px; image-rendering: pixelated; flex-shrink: 0; }
.te_trim_list { max-height: 320px; overflow-y: auto; margin: 8px 0; border: 1px solid var(--color-border); }
.te_trim_list li { padding: 4px 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.te_trim_list li:hover { background: var(--color-button); }
.te_trim_list li.selected { background: var(--color-selected); }
.te_ns { color: var(--color-subtle_text); font-size: 12px; }
.te_tags { margin-left: auto; display: flex; gap: 4px; font-size: 11px; }
.te_tags span { padding: 0 5px; border-radius: 8px; background: var(--color-accent); color: var(--color-accent_text); }
.te_tags span.off { background: var(--color-back); color: var(--color-subtle_text); text-decoration: line-through; }
.te_export_plan { margin-top: 10px; font-family: var(--font-code, monospace); font-size: 12px; }
.te_plan_list { max-height: 160px; overflow-y: auto; }
.te_list { font-family: var(--font-code, monospace); font-size: 12px; max-height: 200px; overflow-y: auto; }
.te_table td { padding: 3px 8px; vertical-align: top; }
.te_dialog_html p { margin: 6px 0; }
.te_dialog_html h3 { margin: 14px 0 6px; font-size: 16px; }
.te_guide { margin: 4px 0 4px 22px; padding: 0; list-style: decimal outside; }
.te_guide li { display: list-item; list-style: decimal outside; margin: 3px 0; }
.te_code { font-family: var(--font-code, monospace); font-size: 12px; background: var(--color-back); border: 1px solid var(--color-border); padding: 6px 8px; white-space: pre-wrap; word-break: break-all; user-select: text; margin: 4px 0; }
.te_warn_text { color: #e5b84b; }
.te_break { word-break: break-all; }
`;

// ============================================================================
// Format, properties, actions, events
// ============================================================================

let format = null;
let properties = [];
let menu = null;
let actions = {};

function registerFormat() {
	format = new ModelFormat(FORMAT_ID, {
		name: t('armor_trim'),
		description: t('paint_minecraft_armor_trims_on_an'),
		icon: 'checkroom',
		category: 'minecraft',
		target: 'Minecraft: Java Edition',
		format_page: {
			content: [
				{type: 'h3', text: t('armor_trim')},
				{text: t('exact_armor_model_from_the_game_client')},
			],
			button_text: t('new_trim'),
		},
		show_on_start_screen: true,
		can_convert_to: false,
		model_identifier: false,
		box_uv: true,
		optional_box_uv: true,
		single_texture: false,
		per_texture_uv_size: true,
		bone_rig: true,
		centered_grid: true,
		rotate_cubes: false,
		euler_order: 'ZYX',
		edit_mode: false,
		paint_mode: true,
		display_mode: false,
		animation_mode: false,
		pose_mode: false,
		texture_folder: false,
		onActivation() {
			setTimeout(() => {
				MenuBar.update();
				refreshPanels();
				showPreviewTabOnce();
			}, 0);
		},
		onDeactivation() {
			PoseRuntime.reset();
			setTimeout(() => MenuBar.update(), 0);
		},
	});
	format.new = function () {
		openNewTrimDialog();
		return true;
	};
	properties.push(new Property(ModelProject, 'object', 'armor_trim_editor', {condition: {formats: [FORMAT_ID]}, exposed: false}));
	properties.push(new Property(Cube, 'string', 'trim_role', {condition: {formats: [FORMAT_ID]}, exposed: false}));
	properties.push(new Property(Texture, 'string', 'trim_role', {condition: {formats: [FORMAT_ID]}, exposed: false}));
}

function registerActions() {
	let condition = {formats: [FORMAT_ID]};
	actions.new_trim = track(new Action('armor_trim_editor_new', {
		name: t('new_trim_2'), icon: 'add_box', category: 'file',
		click: () => openNewTrimDialog(),
	}));
	actions.import = track(new Action('armor_trim_editor_import', {
		name: t('open_trim_from_resource_pack_2'), icon: 'folder_open', category: 'file',
		click: () => { try { openImportDialog(); } catch (err) { showError(t('error'), err); } },
	}));
	actions.export = track(new Action('armor_trim_editor_export', {
		name: t('export_trim_to_resource_pack_2'), icon: 'save_alt', category: 'file', condition,
		click: () => openExportDialog(),
	}));
	actions.quick_export = track(new Action('armor_trim_editor_quick_export', {
		name: t('quick_export_trim'), icon: 'bolt', category: 'file', condition,
		keybind: new Keybind({key: 'e', ctrl: true, alt: true}),
		click: () => quickExport(),
	}));
	actions.icon = track(new Action('armor_trim_editor_icon', {
		name: t('icon_generator_2'), icon: 'auto_fix_high', category: 'edit', condition,
		click: () => openIconGenerator(),
	}));
	actions.check = track(new Action('armor_trim_editor_check', {
		name: t('check_trim'), icon: 'fact_check', category: 'edit', condition,
		click: () => {
			let issues = validateTrim();
			let html = issues.map(i => `<p>${i.level == 'error' ? '⛔' : i.level == 'warn' ? '⚠️' : 'ℹ️'} ${escapeHTML(i.text)}</p>`).join('') || t('no_problems_found');
			Blockbench.showMessageBox({title: t('trim_check'), message: html});
		},
	}));
	actions.datapack = track(new Action('armor_trim_editor_datapack', {
		name: t('datapack'), icon: 'dns', category: 'file', condition,
		click: () => openDatapackDialog(),
	}));
	actions.guide = track(new Action('armor_trim_editor_guide', {
		name: t('guide_menu'), icon: 'sports_esports', category: 'help',
		click: () => openGameGuide(),
	}));
	actions.settings = track(new Action('armor_trim_editor_settings', {
		name: t('trim_editor_settings_2'), icon: 'settings', category: 'settings',
		click: () => { try { openSettingsDialog(); } catch (err) { showError(t('error'), err); } },
	}));
	actions.help = track(new Action('armor_trim_editor_help', {
		name: t('how_trims_work'), icon: 'help', category: 'help',
		click: () => openHelpDialog(),
	}));

	menu = new BarMenu('armor_trim_editor', [
		'armor_trim_editor_new', 'armor_trim_editor_import', '_',
		'armor_trim_editor_export', 'armor_trim_editor_quick_export', 'armor_trim_editor_datapack', '_',
		'armor_trim_editor_icon', 'armor_trim_editor_check',
		{name: t('clear_trim_piece'), id: 'armor_trim_editor_clear', icon: 'layers_clear', condition: () => isTrimProject(),
			children: PIECE_ORDER.map(piece => ({name: PIECE_NAMES[piece], icon: 'clear', click: () => confirmClearPiece(piece)}))},
		'_',
		'armor_trim_editor_settings', 'armor_trim_editor_guide', 'armor_trim_editor_help',
	], {name: t('trim'), condition: () => isTrimProject()});
	// Keep "Help" as the last menu
	if (MenuBar.menus.help) {
		let help = MenuBar.menus.help;
		delete MenuBar.menus.help;
		MenuBar.menus.help = help;
	}
	MenuBar.update();
	MenuBar.addAction(actions.import, 'file.import');
	MenuBar.addAction(actions.export, 'file.export');
}

function onProjectChange() {
	PoseRuntime.last_time = 0;
	if (isTrimProject()) {
		D();
		setTimeout(() => {
			if (!isTrimProject()) return;
			updatePreviewUniforms();
			applyVisibility();
			refreshPanels();
		}, 50);
	}
}

let frame_counter = 0;
function onFrame() {
	if (!isTrimProject()) return;
	PoseRuntime.frame();
	// Pixel grids on the locked reference cubes only add noise
	for (let cube of Cube.all) {
		let grid = cube.mesh && cube.mesh.grid_box;
		if (grid && grid.visible && cube.trim_role && (cube.trim_role.startsWith('skin/') || cube.trim_role.startsWith('armor/'))) {
			grid.visible = false;
		}
	}
	if (++frame_counter % 60 == 0) {
		// Materials get rebuilt when textures reload; re-apply the preview patch
		for (let texture of trimTextures()) {
			let mat = texture.getOwnMaterial && texture.getOwnMaterial();
			if (mat && mat.uniforms && (!mat.uniforms.TRIM_MODE || mat.uniforms.TRIM_ARMOR_MAP.value !== armorMapFor(texture))) {
				updatePreviewUniforms();
				break;
			}
		}
	}
}
function onPointer(event) {
	if (event.type == 'pointerdown' && event.target && event.target.tagName == 'CANVAS' && event.target.closest && event.target.closest('.preview')) {
		PoseRuntime.mouse_down = true;
	} else if (event.type == 'pointerup') {
		PoseRuntime.mouse_down = false;
	}
}

Plugin.register(PLUGIN_ID, {
	title: 'Armor Trim Editor',
	author: 'BbIJABNPOBATEJb',
	description: 'Paint Minecraft: Java Edition armor trims on an exact armor model with poses, skins and a live material preview, then export them straight into a resource pack and a datapack.',
	icon: 'checkroom',
	version: PLUGIN_VERSION,
	min_version: '5.0.0',
	variant: 'desktop',
	tags: ['Minecraft: Java Edition', 'Paint', 'Exporter'],
	creation_date: '2026-09-27',
	has_changelog: true,
	contributes: {
		formats: [FORMAT_ID],
	},
	website: 'https://github.com/BbIJABNPOBATEJb/Armor-Trim-Editor',
	repository: 'https://github.com/BbIJABNPOBATEJb/Armor-Trim-Editor',
	bug_tracker: 'https://github.com/BbIJABNPOBATEJb/Armor-Trim-Editor/issues',
	onload() {
		track(Blockbench.addCSS(CSS));
		registerFormat();
		registerActions();
		createPanels();
		track(Blockbench.on('select_project', onProjectChange));
		track(Blockbench.on('load_project', onProjectChange));
		track(Blockbench.on('render_frame', onFrame));
		document.addEventListener('pointerdown', onPointer, true);
		document.addEventListener('pointerup', onPointer, true);
		if (isTrimProject()) onProjectChange();
	},
	onunload() {
		document.removeEventListener('pointerdown', onPointer, true);
		document.removeEventListener('pointerup', onPointer, true);
		try { PoseRuntime.reset(); } catch (err) {}
		for (let project of ModelProject.all || []) {
			for (let texture of project.textures || []) {
				try { unpatchMaterial(texture); } catch (err) {}
			}
		}
		MenuBar.removeAction('file.import.armor_trim_editor_import');
		MenuBar.removeAction('file.export.armor_trim_editor_export');
		for (let item of deletables.splice(0)) {
			try { item.delete(); } catch (err) { console.warn(err); }
		}
		if (menu) { menu.delete(); menu = null; MenuBar.update(); }
		for (let property of properties.splice(0)) property.delete();
		if (format) { format.delete(); format = null; }
	},
});

// ============================================================================
// Translations. English is the base language, others are added through Language.addTranslations
// ============================================================================

function getTranslations() {
	return {
		en: {
			quartz: "Quartz",
			iron: "Iron",
			netherite: "Netherite",
			redstone: "Redstone",
			copper: "Copper",
			gold: "Gold",
			emerald: "Emerald",
			diamond: "Diamond",
			lapis: "Lapis",
			amethyst: "Amethyst",
			resin: "Resin",
			no_armor: "No armor",
			leather: "Leather",
			chainmail: "Chainmail",
			iron_2: "Iron",
			copper_2: "Copper",
			gold_2: "Gold",
			diamond_2: "Diamond",
			netherite_2: "Netherite",
			turtle_shell: "Turtle shell",
			helmet: "helmet",
			helmet_outer_layer: "helmet, outer layer",
			chestplate_body: "chestplate, body",
			chestplate_right_arm: "chestplate, right arm",
			chestplate_left_arm: "chestplate, left arm",
			leggings_waist: "leggings, waist",
			leggings_right_leg: "leggings, right leg",
			leggings_left_leg: "leggings, left leg",
			boots_right: "boots, right",
			boots_left: "boots, left",
			head: "head",
			hat_layer: "hat layer",
			body: "body",
			jacket: "jacket",
			right_arm: "right arm",
			right_sleeve: "right sleeve",
			left_arm: "left arm",
			left_sleeve: "left sleeve",
			right_leg: "right leg",
			right_pants: "right pants",
			left_leg: "left leg",
			left_pants: "left pants",
			helmet_2: "Helmet",
			chestplate: "Chestplate",
			leggings: "Leggings",
			boots: "Boots",
			file_access_requires_the_desktop_app: "File access requires the desktop app.",
			needed_to_read_the_minecraft_jar_skins: "Needed to read the Minecraft jar (skins, armor, palettes) and to write trims into your resource pack.",
			file_access_was_denied: "File access was denied.",
			to_reveal_the_exported_trim_in_the_file: "To reveal the exported trim in the file explorer.",
			minecraft_client_jar_not_found_set_it_in: "Minecraft client jar not found. Set it in \"Trim → Settings\".",
			armor_preview: "⚙ armor (preview)",
			armor_leggings_preview: "⚙ armor leggings (preview)",
			skin_preview: "⚙ skin (preview)",
			trim: "Trim",
			armor: "Armor",
			skin: "Skin",
			item_icon: "Item icon",
			could_not_create_trim: "Could not create trim",
			player_not_found: "Player not found",
			standing: "Standing",
			idle: "Idle",
			walking: "Walking",
			sprinting: "Sprinting",
			sneaking: "Sneaking",
			sneak_walk: "Sneak walk",
			riding: "Riding",
			attack: "Attack",
			bow: "Bow",
			crossbow: "Crossbow",
			shield: "Shield",
			trident: "Trident",
			spyglass: "Spyglass",
			arms_forward: "Arms forward",
			t_pose: "T-pose",
			waving: "Waving",
			swimming: "Swimming",
			elytra: "Elytra",
			pack: "Pack: ",
			current_icon: "Current icon",
			simple_tablet: "Simple tablet",
			template: "Template: ",
			template_netherite_upgrade: "Template: netherite upgrade",
			icon_generator: "Icon generator",
			recolor_glyph: "Recolor glyph",
			keep: "Keep",
			remove_glyph: "Remove glyph",
			the_trim_is_empty_nothing_to_sample: "The trim is empty, nothing to sample.",
			base: "Base",
			result: "Result",
			body_color: "Body color",
			glyph_color: "Glyph color",
			glyph: "Glyph",
			contrast: "Contrast",
			sample_colors_from_trim: "Sample colors from trim",
			the_glyph_cyan_pixels_of_vanilla: "The glyph (cyan pixels of vanilla templates) is recolored separately. Touch the icon up by hand afterwards — texture \"icon\".",
			generate_icon: "Generate icon",
			icon_updated: "Icon updated",
			size_must_be_2_1_64_32_128_64: "%0: size %1×%2 must be 2:1 (64×32, 128×64…)",
			px_outside_the_uv_layout_invisible_in: "%0: %1 px outside the UV layout — invisible in game",
			remove: "Remove",
			semi_transparent_px_trims_render_as: "%0: %1 semi-transparent px — trims render as cutout: alpha < 10% vanishes, the rest becomes opaque",
			match_game: "Match game",
			px_are_close_to_palette_colors_but_will: "%0: %1 px are close to palette colors but will not be recolored",
			snap_to_palette: "Snap to palette",
			px_follow_the_material_px_keep_their: "%0: %1 px follow the material, %2 px keep their color",
			the_trim_is_empty: "The trim is empty.",
			the_icon_is_not_square: "The icon is not square.",
			fix_trim: "Fix trim",
			trim_id_is_empty: "Trim ID is empty.",
			trim_id_may_only_contain_a_z_0_9: "Trim ID may only contain a-z, 0-9, _ . -",
			clear_trim_piece: "Clear trim piece",
			erase_from_the_trim_texture_you_can_undo: "Erase \"%0\" from the trim texture? You can undo it (Ctrl+Z).",
			erase: "Erase",
			cancel: "Cancel",
			no_resource_pack_folder_selected: "No resource pack folder selected.",
			resource_pack_folder_not_found: "Resource pack folder not found: ",
			invalid_texture_namespace: "Invalid texture namespace.",
			invalid_icon_path: "Invalid icon path: ",
			created_paletted_permutations_source: "created paletted_permutations source",
			added_texture: "added texture ",
			added_palette: "added palette ",
			cannot_export: "Cannot export",
			trim_exported_files: "Trim \"%0\" exported (%1 files)",
			export_failed: "Export failed",
			files_written: "Files written",
			atlas: "Atlas",
			in_game_press_f3_t_to_reload_resources: "In game: press F3+T to reload resources.",
			trim_exported: "Trim exported",
			copy_items_entry: "Copy items entry",
			open_folder: "Open folder",
			done: "Done",
			copied_fill_in_the_threshold: "Copied (fill in the threshold)",
			export_trim_to_resource_pack: "Export trim to resource pack",
			trim_id: "Trim ID",
			file_name_and_pattern_asset_id_as_in_the: "File name and pattern asset_id (as in the datapack trim_pattern).",
			resource_pack_folder: "Resource pack folder",
			texture_namespace: "Texture namespace",
			namespace_of_the_pattern_asset_id: "Namespace of the pattern asset_id.",
			atlas_assets_minecraft_atlases_armor: "**Atlas** `assets/minecraft/atlases/armor_trims.json`",
			register_in_atlas: "Register in atlas",
			add_missing_vanilla_palettes: "Add missing vanilla palettes",
			e_g_copper_darker_without_it_a_copper: "E.g. copper_darker: without it a copper trim on copper armor shows a missing texture.",
			template_icon_id_is_replaced_with_the: "**Template icon** (`{id}` is replaced with the trim ID)",
			export_icon_and_model: "Export icon and model",
			icon_texture: "Icon texture",
			icon_model: "Icon model",
			model_parent: "Model parent",
			other: "**Other**",
			back_up_overwritten_files: "Back up overwritten files",
			copies_go_to_blockbench_data_armor_trim: "Copies go to Blockbench data/armor_trim_editor_backups.",
			open_trim_from_resource_pack: "Open trim from resource pack",
			no_trims_found_in_this_pack: "No trims found in this pack.",
			pack_2: "Pack",
			icon: "Icon",
			search: "Search",
			atlas_2: "atlas",
			empty: "Empty",
			vanilla: "Vanilla: ",
			new_armor_trim: "New armor trim",
			start_from: "Start from",
			resolution: "Resolution",
			armor_under_trim: "Armor under trim",
			could_not_load_vanilla_trim: "Could not load vanilla trim",
			other_file: "Other file…",
			trim_editor_settings: "Trim Editor settings",
			minecraft_client_jar: "Minecraft client jar",
			jar_path: "Jar path",
			the_jar_provides_default_skins_armor: "The jar provides default skins, armor textures, template icons and vanilla trims. Nothing from it is copied into your pack.",
			jar_saved: "Jar saved",
			helmet_0_0_at_1_0_and_outer_hat_32_0_at: "helmet (0,0) at 1.0 and outer \"hat\" (32,0) at 1.5; chestplate body (16,16) and arms (40,16) at 1.0; boots: legs (0,16) at 0.9",
			leggings_waist_16_16_at_0_5_legs_0_16_at: "leggings: waist (16,16) at 0.5, legs (0,16) at 0.4",
			a_trim_is_drawn_on_the_same_model_as_the: "A trim is drawn on the same model as the armor. Numbers are how far each box is inflated around the player (in pixels).",
			two_layers_on_the_helmet_are_the_left: "<b>\"Two layers\" on the helmet</b> are the left (head, 1.0) and right (hat, 1.5) halves of the humanoid top row. Pixels on the right float 0.5 px above the helmet.",
			left_arm_and_leg_reuse_the_right_side: "<b>Left arm and leg</b> reuse the right side area (mirrored) — they cannot differ.",
			palette_only_the_8_grays_e0e0e0_000000: "<b>Palette:</b> only the 8 grays (#E0E0E0 … #000000) are recolored by the material. Any other color stays as painted. A trim material matching the armor (gold on gold) uses the \"_darker\" palette.",
			transparency_trims_render_as_cutout: "<b>Transparency:</b> trims render as cutout — alpha below 10% is discarded, everything else is opaque.",
			server_the_pattern_is_registered_by_a: "<b>Server:</b> the pattern is registered by a datapack (data/&lt;ns&gt;/trim_pattern/&lt;id&gt;.json, asset_id = &lt;ns&gt;:&lt;id&gt;). decal: true draws the trim only on top of armor pixels.",
			how_armor_trims_work: "How armor trims work",
			trim_preview: "Trim: preview",
			skin_overlay: "Skin overlay",
			from_file: "from file",
			as_painted: "as painted",
			darker_palette: " (darker palette)",
			skin_not_loaded: "Skin not loaded",
			invalid_nickname: "Invalid nickname",
			loading: "loading…",
			view: "View",
			pose: "Pose",
			armor_pieces: "Armor pieces",
			vanilla_atlas_note: "This is a vanilla pattern name, so the vanilla atlas already registers it.",
			right_click_solo: "right click — solo",
			left_half_of_the_humanoid_top_row_0_0: "Left half of the humanoid top row (0,0)",
			helmet_1_0: "Helmet 1.0",
			right_half_of_the_humanoid_top_row_32_0: "Right half of the humanoid top row (32,0), floats 0.5 px above the helmet",
			helmet_1_5_outer: "Helmet 1.5 (outer)",
			leather_dye: "Leather dye",
			trim_material: "Trim material",
			as_painted_2: "As painted",
			pink_follow_the_material_cyan_keep_their: "Pink follow the material, cyan keep their color",
			highlight_palette: "Highlight palette",
			play: "Play",
			pause: "Pause",
			speed: "Speed",
			reset_head: "Reset head",
			head_2: "Head ↔",
			head_3: "Head ↕",
			animation_freezes_while_you_paint_poses: "Animation freezes while you paint. Poses are preview-only and never saved into the textures.",
			slim_arms: "slim arms",
			wide_arms: "wide arms",
			default_skins: "Default skins",
			player_skin_by_name: "Player skin by name",
			name: "Name",
			load: "Load",
			skin_from_file: "Skin from file",
			wide_arms_2: "Wide arms",
			slim_arms_2: "Slim arms",
			armor_uses_the_same_wide_arms_for_slim: "Armor uses the same wide arms for slim skins in game.",
			trim_palette_export: "Trim: palette & export",
			no_resource_pack: "no resource pack",
			trim_palette: "Trim palette",
			top_color_to_paint_with_bottom_result: "Top: color to paint with, bottom: result with the selected material. Other colors stay fixed.",
			export: "Export",
			export_with_the_last_settings_ctrl_alt_e: "Export with the last settings (Ctrl+Alt+E)",
			quick: "Quick",
			check: "Check",
			no_problems_found: "No problems found.",
			armor_trim: "Armor Trim",
			paint_minecraft_armor_trims_on_an: "Paint Minecraft armor trims on an accurate armor model with poses and resource pack export",
			exact_armor_model_from_the_game_client: "* Exact armor model from the game client: helmet (1.0 + outer 1.5), chestplate, leggings, boots\n* Material preview (quartz, gold, …) while painting\n* Player poses and animations, skins (default, file, player name)\n* Template icon generator and resource pack export with atlas registration",
			new_trim: "New trim",
			new_trim_2: "New trim…",
			open_trim_from_resource_pack_2: "Open trim from resource pack…",
			error: "Error",
			export_trim_to_resource_pack_2: "Export trim to resource pack…",
			quick_export_trim: "Quick export trim",
			icon_generator_2: "Icon generator…",
			check_trim: "Check trim",
			trim_check: "Trim check",
			trim_editor_settings_2: "Trim Editor settings…",
			how_trims_work: "How trims work",
			datapack: "Datapack…",
			datapack_short: "Datapack",
			dp_title: "Trim pattern datapack",
			dp_pattern_info: "Pattern **%0**. The trim ID and namespace come from the export settings.",
			dp_version: "Minecraft version",
			dp_decal_desc: "Draw the trim only over armor pixels. Preview it with the Decal switch in the View tab.",
			dp_names: "Names",
			dp_names_desc: "One per line: language=name, e.g. en_us=Clouds. Written to assets/minecraft/lang/<language>.json of the resource pack as trim_pattern.%0.",
			dp_will_be_written: "Will be written (♻ overwrite, ✎ modify, · unchanged):",
			dp_no_folder: "No datapacks folder selected.",
			dp_not_folder: "Not a folder: ",
			dp_rp: "resource pack: ",
			dp_names_need_pack: "Names are skipped: choose the resource pack in the export settings first.",
			dp_bad_name_line: "Skipped line (expected language=name): %0",
			dp_format_mismatch: "pack.mcmeta was kept as is, but its format is %0 while %1 uses %2.",
			dp_done_title: "Datapack updated",
			copy_give: "Copy /give",
			copy_code: "Copy Paper code",
			copied: "Copied",
			guide_menu: "How to use a trim in game",
			guide_title: "Using the trim in game",
			guide_server_h: "Server",
			guide_server_1: "Put the datapack zip into <code>world/datapacks</code> of the main world, or pick that folder in the generator right away.",
			guide_server_2: "Restart the server: new trim patterns are loaded only when the world starts, <code>/reload</code> does not add them.",
			guide_server_3: "Players need the resource pack with the textures (the <b>Export</b> button).",
			guide_give_h: "Command",
			guide_material: "The material only recolors the 8 palette grays; a trim painted in its own colors looks the same with any material, e.g. redstone.",
			guide_smithing: "The pattern has no smithing template, so it can only be applied by commands or plugins.",
			guide_plugin_h: "Bukkit / Paper plugin",
			guide_plugin_note: "On Spigot use <code>Registry.TRIM_PATTERN.get(key)</code>. If the pattern is <code>null</code>, the datapack was not loaded.",
			rp_type: "Save as",
			rp_type_zip: "Zip archive",
			rp_type_folder: "Folder",
			zip_dir: "Archive folder",
			zip_dir_desc: "For example .minecraft/resourcepacks. A new archive gets pack.mcmeta and pack.png.",
			zip_name: "Archive name",
			zip_name_desc: "Without .zip. An existing archive is updated, everything else in it is kept.",
			rp_folder_desc: "An unpacked resource pack. pack.mcmeta is created if the folder has none.",
			mc_version_desc: "Sets the format in pack.mcmeta of a new pack.",
			no_zip_folder: "No folder for the archive selected.",
			invalid_zip_name: "Invalid archive name.",
			archive_new: "new archive",
			archive_update: "will be updated",
			written_to: "Written to",
			dp_dir: "Datapacks folder",
			dp_dir_desc: "For example saves/<world>/datapacks. The datapack is saved as a zip archive.",
			dp_name_desc: "Without .zip. An existing datapack is updated, its other trims are kept.",
			folder_or_zip: "Folder or .zip",
			pose_spread: "Standing, parts apart",
			pose_tpose_spread: "T-pose, parts apart",
			decal_preview_desc: "Preview of \"decal\": true — trim pixels are only drawn over armor pixels, so the outer helmet layer and holes in the armor stay empty. The same setting goes into the datapack.",
		},
		ru: {
			quartz: "Кварц",
			iron: "Железо",
			netherite: "Незерит",
			redstone: "Редстоун",
			copper: "Медь",
			gold: "Золото",
			emerald: "Изумруд",
			diamond: "Алмаз",
			lapis: "Лазурит",
			amethyst: "Аметист",
			resin: "Смола",
			no_armor: "Без брони",
			leather: "Кожаная",
			chainmail: "Кольчужная",
			iron_2: "Железная",
			copper_2: "Медная",
			gold_2: "Золотая",
			diamond_2: "Алмазная",
			netherite_2: "Незеритовая",
			turtle_shell: "Черепаший шлем",
			helmet: "шлем",
			helmet_outer_layer: "шлем, внешний слой",
			chestplate_body: "нагрудник, торс",
			chestplate_right_arm: "нагрудник, правая рука",
			chestplate_left_arm: "нагрудник, левая рука",
			leggings_waist: "поножи, пояс",
			leggings_right_leg: "поножи, правая нога",
			leggings_left_leg: "поножи, левая нога",
			boots_right: "ботинки, правый",
			boots_left: "ботинки, левый",
			head: "голова",
			hat_layer: "голова, внешний слой",
			body: "торс",
			jacket: "торс, внешний слой",
			right_arm: "правая рука",
			right_sleeve: "правая рука, внешний слой",
			left_arm: "левая рука",
			left_sleeve: "левая рука, внешний слой",
			right_leg: "правая нога",
			right_pants: "правая нога, внешний слой",
			left_leg: "левая нога",
			left_pants: "левая нога, внешний слой",
			helmet_2: "Шлем",
			chestplate: "Нагрудник",
			leggings: "Поножи",
			boots: "Ботинки",
			file_access_requires_the_desktop_app: "Работа с файлами доступна только в десктопной версии Blockbench.",
			needed_to_read_the_minecraft_jar_skins: "Нужно для чтения jar-файла Minecraft (скины, броня, палитры) и записи отделки в ресурспак.",
			file_access_was_denied: "Доступ к файлам не выдан.",
			to_reveal_the_exported_trim_in_the_file: "Чтобы открыть папку с экспортированной отделкой.",
			minecraft_client_jar_not_found_set_it_in: "Не найден jar-клиент Minecraft. Укажите его в меню «Отделка → Настройки».",
			armor_preview: "⚙ броня (превью)",
			armor_leggings_preview: "⚙ броня: поножи (превью)",
			skin_preview: "⚙ скин (превью)",
			trim: "Отделка",
			armor: "Броня",
			skin: "Скин",
			item_icon: "Иконка предмета",
			could_not_create_trim: "Не удалось создать отделку",
			player_not_found: "Игрок не найден",
			standing: "Стойка",
			idle: "Дыхание",
			walking: "Ходьба",
			sprinting: "Бег",
			sneaking: "Присед",
			sneak_walk: "Крадётся",
			riding: "Сидит",
			attack: "Удар",
			bow: "Лук",
			crossbow: "Арбалет",
			shield: "Щит",
			trident: "Трезубец",
			spyglass: "Подзорная труба",
			arms_forward: "Руки вперёд",
			t_pose: "T-поза",
			waving: "Машет",
			swimming: "Плавание",
			elytra: "Элитры",
			pack: "РП: ",
			current_icon: "Текущая иконка",
			simple_tablet: "Простая табличка",
			template: "Шаблон: ",
			template_netherite_upgrade: "Шаблон: улучшение до незерита",
			icon_generator: "Генератор иконки",
			recolor_glyph: "Перекрасить узор",
			keep: "Оставить как есть",
			remove_glyph: "Убрать узор",
			the_trim_is_empty_nothing_to_sample: "Отделка пустая — не из чего брать цвета.",
			base: "Основа",
			result: "Результат",
			body_color: "Цвет таблички",
			glyph_color: "Цвет узора",
			glyph: "Узор",
			contrast: "Контраст",
			sample_colors_from_trim: "Взять цвета из отделки",
			the_glyph_cyan_pixels_of_vanilla: "Узор (бирюзовые пиксели ванильных шаблонов) перекрашивается отдельно. После генерации иконку можно дорисовать вручную — текстура «icon».",
			generate_icon: "Генерация иконки",
			icon_updated: "Иконка обновлена",
			size_must_be_2_1_64_32_128_64: "%0: размер %1×%2 — нужно соотношение 2:1 (64×32, 128×64…)",
			px_outside_the_uv_layout_invisible_in: "%0: %1 пикс. вне развёртки — в игре не видны",
			remove: "Удалить",
			semi_transparent_px_trims_render_as: "%0: %1 полупрозрачных пикс. — игра рисует отделку без смешивания (cutout): альфа < 10% пропадёт, остальное станет непрозрачным",
			match_game: "Сделать как в игре",
			px_are_close_to_palette_colors_but_will: "%0: %1 пикс. почти совпадают с палитрой, но не перекрасятся материалом",
			snap_to_palette: "Привязать к палитре",
			px_follow_the_material_px_keep_their: "%0: %1 пикс. перекрашиваются материалом, %2 — фиксированного цвета",
			the_trim_is_empty: "Отделка пустая.",
			the_icon_is_not_square: "Иконка не квадратная.",
			fix_trim: "Исправление отделки",
			trim_id_is_empty: "Не указан ID отделки.",
			trim_id_may_only_contain_a_z_0_9: "ID отделки: только a-z, 0-9, _ . -",
			clear_trim_piece: "Очистить часть отделки",
			erase_from_the_trim_texture_you_can_undo: "Стереть «%0» в текстуре отделки? Действие можно отменить (Ctrl+Z).",
			erase: "Стереть",
			cancel: "Отмена",
			no_resource_pack_folder_selected: "Не выбрана папка ресурспака.",
			resource_pack_folder_not_found: "Папка ресурспака не найдена: ",
			invalid_texture_namespace: "Неверный namespace текстур.",
			invalid_icon_path: "Неверный путь иконки: ",
			created_paletted_permutations_source: "создан источник paletted_permutations",
			added_texture: "добавлена текстура ",
			added_palette: "добавлена палитра ",
			cannot_export: "Экспорт невозможен",
			trim_exported_files: "Отделка «%0» экспортирована (%1 файл.)",
			export_failed: "Ошибка экспорта",
			files_written: "Записано файлов",
			atlas: "Атлас",
			in_game_press_f3_t_to_reload_resources: "В игре: F3+T для перезагрузки ресурсов.",
			trim_exported: "Отделка экспортирована",
			copy_items_entry: "Копировать запись для items",
			open_folder: "Открыть папку",
			done: "Готово",
			copied_fill_in_the_threshold: "Скопировано (threshold заполните сами)",
			export_trim_to_resource_pack: "Экспорт отделки в ресурспак",
			trim_id: "ID отделки",
			file_name_and_pattern_asset_id_as_in_the: "Имя файлов и asset_id паттерна (как в trim_pattern датапака).",
			resource_pack_folder: "Папка ресурспака",
			texture_namespace: "Namespace текстур",
			namespace_of_the_pattern_asset_id: "Namespace из asset_id паттерна (обычно minecraft).",
			atlas_assets_minecraft_atlases_armor: "**Атлас** `assets/minecraft/atlases/armor_trims.json`",
			register_in_atlas: "Регистрировать в атласе",
			add_missing_vanilla_palettes: "Добавить недостающие ванильные палитры",
			e_g_copper_darker_without_it_a_copper: "Например copper_darker: без неё медная отделка на медной броне будет «missing texture».",
			template_icon_id_is_replaced_with_the: "**Иконка шаблона** (`{id}` заменяется на ID отделки)",
			export_icon_and_model: "Экспортировать иконку и модель",
			icon_texture: "Текстура иконки",
			icon_model: "Модель иконки",
			model_parent: "Parent модели",
			other: "**Прочее**",
			back_up_overwritten_files: "Резервные копии перезаписываемых файлов",
			copies_go_to_blockbench_data_armor_trim: "Копии складываются в папку данных Blockbench/armor_trim_editor_backups.",
			open_trim_from_resource_pack: "Открыть отделку из ресурспака",
			no_trims_found_in_this_pack: "В этом ресурспаке отделок не найдено.",
			pack_2: "Ресурспак",
			icon: "Иконка",
			search: "Поиск",
			atlas_2: "атлас",
			empty: "Пустой",
			vanilla: "Ванильный: ",
			new_armor_trim: "Новая отделка брони",
			start_from: "Основа",
			resolution: "Разрешение",
			armor_under_trim: "Броня под отделкой",
			could_not_load_vanilla_trim: "Не удалось загрузить ванильную отделку",
			other_file: "Другой файл…",
			trim_editor_settings: "Настройки Trim Editor",
			minecraft_client_jar: "Jar клиента Minecraft",
			jar_path: "Путь к jar",
			the_jar_provides_default_skins_armor: "Из jar берутся ванильные скины, текстуры брони, шаблоны иконок и ванильные отделки. В ресурспак ничего из jar не копируется.",
			jar_saved: "Jar сохранён",
			helmet_0_0_at_1_0_and_outer_hat_32_0_at: "шлем (0,0) — слой 1.0 и внешний слой «hat» (32,0) — 1.5; нагрудник: торс (16,16) и руки (40,16) — 1.0; ботинки: ноги (0,16) — 0.9",
			leggings_waist_16_16_at_0_5_legs_0_16_at: "поножи: пояс (16,16) — 0.5, ноги (0,16) — 0.4",
			a_trim_is_drawn_on_the_same_model_as_the: "Отделка рисуется поверх брони той же моделью, что и броня. Числа — насколько куб раздут относительно тела игрока (в пикселях).",
			two_layers_on_the_helmet_are_the_left: "<b>«Два слоя» на шлеме</b> — это левая (голова, 1.0) и правая (hat, 1.5) половины верхней части humanoid. Пиксели справа висят над шлемом на 0.5 пикселя.",
			left_arm_and_leg_reuse_the_right_side: "<b>Левые рука и нога</b> используют ту же область текстуры, что и правые (зеркально) — нарисовать их по-разному нельзя.",
			palette_only_the_8_grays_e0e0e0_000000: "<b>Палитра:</b> только 8 серых оттенков (#E0E0E0 … #000000) перекрашиваются материалом. Любой другой цвет остаётся как нарисован. Отделка из того же материала, что и броня (золото на золоте), берёт палитру «_darker».",
			transparency_trims_render_as_cutout: "<b>Прозрачность:</b> отделка рисуется как cutout — альфа < 10% отбрасывается, остальное становится непрозрачным.",
			server_the_pattern_is_registered_by_a: "<b>Сервер:</b> паттерн регистрируется датапаком (data/&lt;ns&gt;/trim_pattern/&lt;id&gt;.json, поле asset_id = &lt;ns&gt;:&lt;id&gt;). Параметр decal: true рисует отделку только там, где есть броня.",
			how_armor_trims_work: "Как устроена отделка брони",
			trim_preview: "Отделка",
			skin_overlay: "Слой скина",
			from_file: "из файла",
			as_painted: "как нарисовано",
			darker_palette: " (тёмная палитра)",
			skin_not_loaded: "Скин не загружен",
			invalid_nickname: "Неверный ник",
			loading: "загрузка…",
			view: "Вид",
			pose: "Поза",
			armor_pieces: "Части брони",
			vanilla_atlas_note: "Это имя ванильного паттерна — он уже зарегистрирован в ванильном атласе.",
			right_click_solo: "ПКМ — только эта",
			left_half_of_the_humanoid_top_row_0_0: "Левая половина верха humanoid (0,0)",
			helmet_1_0: "Шлем 1.0",
			right_half_of_the_humanoid_top_row_32_0: "Правая половина верха humanoid (32,0), висит на 0.5 px над шлемом",
			helmet_1_5_outer: "Шлем 1.5 (внешний)",
			leather_dye: "Цвет кожаной брони",
			trim_material: "Материал отделки",
			as_painted_2: "Как нарисовано",
			pink_follow_the_material_cyan_keep_their: "Розовые — перекрашиваются материалом, голубые — фиксированный цвет",
			highlight_palette: "Подсветить палитру",
			play: "Продолжить",
			pause: "Пауза",
			speed: "Скорость",
			reset_head: "Сбросить поворот головы",
			head_2: "Голова ↔",
			head_3: "Голова ↕",
			animation_freezes_while_you_paint_poses: "Во время рисования анимация замирает. Позы только для просмотра — в файл не записываются.",
			slim_arms: "тонкие руки",
			wide_arms: "широкие руки",
			default_skins: "Стандартные скины",
			player_skin_by_name: "Скин игрока по нику",
			name: "Ник",
			load: "Загрузить",
			skin_from_file: "Скин из файла",
			wide_arms_2: "Широкие руки",
			slim_arms_2: "Тонкие руки",
			armor_uses_the_same_wide_arms_for_slim: "Броня для тонких рук в игре та же, что и для широких.",
			trim_palette_export: "Отделка: палитра и экспорт",
			no_resource_pack: "ресурспак не выбран",
			trim_palette: "Палитра отделки",
			top_color_to_paint_with_bottom_result: "Верх — цвет для рисования, низ — результат у выбранного материала. Остальные цвета не перекрашиваются.",
			export: "Экспорт",
			export_with_the_last_settings_ctrl_alt_e: "Экспорт с последними настройками (Ctrl+Alt+E)",
			quick: "Быстро",
			check: "Проверка",
			no_problems_found: "Проблем не найдено.",
			armor_trim: "Отделка брони",
			paint_minecraft_armor_trims_on_an: "Рисование отделки брони Minecraft с точной моделью брони, позами и экспортом в ресурспак",
			exact_armor_model_from_the_game_client: "* Точная модель брони из клиента игры: шлем (1.0 + внешний слой 1.5), нагрудник, поножи, ботинки\n* Превью материалов (кварц, золото, …) прямо во время рисования\n* Позы и анимации игрока, смена скина (ванильные, файл, ник)\n* Генератор иконки шаблона и экспорт в ресурспак с регистрацией в атласе",
			new_trim: "Новая отделка",
			new_trim_2: "Новая отделка…",
			open_trim_from_resource_pack_2: "Открыть отделку из ресурспака…",
			error: "Ошибка",
			export_trim_to_resource_pack_2: "Экспорт отделки в ресурспак…",
			quick_export_trim: "Быстрый экспорт отделки",
			icon_generator_2: "Генератор иконки…",
			check_trim: "Проверить отделку",
			trim_check: "Проверка отделки",
			trim_editor_settings_2: "Настройки Trim Editor…",
			how_trims_work: "Как устроена отделка",
			datapack: "Датапак…",
			datapack_short: "Датапак",
			dp_title: "Датапак паттерна отделки",
			dp_pattern_info: "Паттерн **%0**. ID отделки и namespace берутся из настроек экспорта.",
			dp_version: "Версия Minecraft",
			dp_decal_desc: "Рисовать отделку только поверх пикселей брони. Посмотреть результат — переключатель Decal во вкладке «Вид».",
			dp_names: "Названия",
			dp_names_desc: "По одному в строке: язык=название, например ru_ru=Облака. Записываются в assets/minecraft/lang/<язык>.json ресурспака как trim_pattern.%0.",
			dp_will_be_written: "Будут записаны (♻ — перезапись, ✎ — изменение, · — без изменений):",
			dp_no_folder: "Не выбрана папка datapacks.",
			dp_not_folder: "Это не папка: ",
			dp_rp: "ресурспак: ",
			dp_names_need_pack: "Названия пропущены: сначала выберите ресурспак в настройках экспорта.",
			dp_bad_name_line: "Строка пропущена (нужно язык=название): %0",
			dp_format_mismatch: "pack.mcmeta оставлен как есть, но его формат %0, а для %1 нужен %2.",
			dp_done_title: "Датапак обновлён",
			copy_give: "Копировать /give",
			copy_code: "Копировать код Paper",
			copied: "Скопировано",
			guide_menu: "Как выдать отделку в игре",
			guide_title: "Как выдать отделку в игре",
			guide_server_h: "Сервер",
			guide_server_1: "Положите zip датапака в <code>world/datapacks</code> основного мира или сразу выберите эту папку в генераторе.",
			guide_server_2: "Перезапустите сервер: новые паттерны отделки загружаются только при запуске мира, <code>/reload</code> их не добавит.",
			guide_server_3: "Игрокам нужен ресурспак с текстурами (кнопка <b>Экспорт</b>).",
			guide_give_h: "Командой",
			guide_material: "Материал перекрашивает только 8 серых оттенков палитры; отделка, нарисованная своими цветами, выглядит одинаково с любым материалом, например redstone.",
			guide_smithing: "У паттерна нет кузнечного шаблона, поэтому наложить его можно только командой или плагином.",
			guide_plugin_h: "Плагин Bukkit / Paper",
			guide_plugin_note: "На Spigot используйте <code>Registry.TRIM_PATTERN.get(key)</code>. Если паттерн <code>null</code> — датапак не загрузился.",
			rp_type: "Сохранить как",
			rp_type_zip: "Zip-архив",
			rp_type_folder: "Папка",
			zip_dir: "Папка для архива",
			zip_dir_desc: "Например .minecraft/resourcepacks. В новый архив добавляются pack.mcmeta и pack.png.",
			zip_name: "Имя архива",
			zip_name_desc: "Без .zip. Если архив уже есть, он обновляется, всё остальное в нём сохраняется.",
			rp_folder_desc: "Распакованный ресурспак. Если в папке нет pack.mcmeta, он будет создан.",
			mc_version_desc: "Задаёт формат в pack.mcmeta нового пака.",
			no_zip_folder: "Не выбрана папка для архива.",
			invalid_zip_name: "Недопустимое имя архива.",
			archive_new: "новый архив",
			archive_update: "будет обновлён",
			written_to: "Записано в",
			dp_dir: "Папка datapacks",
			dp_dir_desc: "Например saves/<мир>/datapacks. Датапак сохраняется zip-архивом.",
			dp_name_desc: "Без .zip. Если датапак уже есть, он обновляется, остальные отделки в нём сохраняются.",
			folder_or_zip: "Папка или .zip",
			pose_spread: "Стойка, части раздвинуты",
			pose_tpose_spread: "T-поза, части раздвинуты",
			decal_preview_desc: "Превью «decal»: true — пиксели отделки рисуются только поверх пикселей брони, поэтому внешний слой шлема и дыры в броне остаются пустыми. Эта же настройка пишется в датапак.",
		},
	};
}

})();
