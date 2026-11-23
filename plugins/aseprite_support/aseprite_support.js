// aseprite_support.js
// Aseprite Import/Export for Blockbench — .aseprite textures with layers and animation support.
//
//   Import:  .aseprite / .ase  ->  Blockbench texture with layers (RGBA / grayscale / indexed,
//            raw / linked / zlib-compressed cels). Multiple frames -> flipbook strip: layers and
//            the composite become vertical strips, frame durations are matched by duplicating
//            frames under a single FPS (dialog), fps + frame_time (50 ms ticks) are written to the texture.
//   Export:  Blockbench texture (including layered and flipbook strip textures)  ->  .aseprite 32bpp RGBA,
//            cels compressed with zlib, the strip is sliced into slots, identical adjacent slots
//            are merged into a single frame with "duplicates x slot" duration (dialog),
//            palette from unique colors.
//
// Specification: https://github.com/aseprite/aseprite/blob/main/docs/ase-file-specs.md
// CRITICAL FORMAT RULE: the chunk "size" field includes both its own 4 bytes and the 2 type bytes
// (next chunk = chunkStart + size); the frame "bytes" field includes the whole frame. All little-endian.
//
// The core (parseAseprite / buildAseprite / timing helpers) does not depend on Blockbench and is
// tested in Node (analysis/test_plugin.mjs); the module.exports branch exists only for those tests.
(function () {
	'use strict';

	// ============================================================
	// Format constants
	// ============================================================
	const ASE_MAGIC = 0xA5E0;
	const FRAME_MAGIC = 0xF1FA;
	const CHUNK = {
		LAYER: 0x2004,
		CEL: 0x2005,
		COLOR_PROFILE: 0x2007,
		PALETTE: 0x2019,
	};

	// Aseprite blend modes (0-18) -> Blockbench 5.x layer blend_mode enum values.
	// Blockbench layers have no color dodge/burn, hard/soft light, exclusion, hue/saturation/luminosity,
	// subtract/divide — they fall back to 'default' (source-over).
	const ASE_BLEND_TO_BB = {
		0: 'default', 1: 'multiply', 2: 'screen', 3: 'overlay',
		4: 'darken', 5: 'lighten', 10: 'difference',
		12: 'color', 13: 'color', 14: 'color', 16: 'add',
	};
	// Reverse mapping for export.
	const BB_BLEND_TO_ASE = {
		default: 0, set_opacity: 0, alpha_mask: 0, behind: 0,
		multiply: 1, screen: 2, overlay: 3, darken: 4, lighten: 5,
		difference: 10, color: 14, add: 16,
	};
	// canvas globalCompositeOperation for Blockbench layer blend modes
	// (same as Painter.getBlendModeCompositeOperation) — used to build the composite on import.
	const BB_BLEND_TO_COMPOSITE = {
		default: 'source-over', set_opacity: 'source-atop', color: 'color',
		behind: 'destination-over', multiply: 'multiply', add: 'lighter',
		darken: 'darken', lighten: 'lighten', screen: 'screen',
		overlay: 'overlay', difference: 'difference',
	};

	// Aseprite blend modes (0-18): display names for layer warnings.
	const ASE_BLEND_NAMES = {
		0: 'Normal', 1: 'Multiply', 2: 'Screen', 3: 'Overlay', 4: 'Darken', 5: 'Lighten',
		6: 'Color Dodge', 7: 'Color Burn', 8: 'Hard Light', 9: 'Soft Light', 10: 'Difference',
		11: 'Exclusion', 12: 'Hue', 13: 'Saturation', 14: 'Color', 15: 'Luminosity',
		16: 'Addition', 17: 'Subtract', 18: 'Divide',
	};
	// Aseprite blend modes Blockbench reproduces without loss (the rest are lossy).
	const ASE_BB_EQUIVALENT = [0, 1, 2, 3, 4, 5, 10, 14, 16];
	// Blockbench blend modes that do not exist in Aseprite.
	const ASE_UNSUPPORTED_BB_MODES = ['set_opacity', 'alpha_mask', 'behind'];

	const aseOpacityToBB = (a) => Math.max(0, Math.min(100, Math.round((a / 255) * 100)));
	const bbOpacityToAse = (o) => Math.max(0, Math.min(255, Math.round((o / 100) * 255)));

	// Originals of Blockbench methods (restored on plugin unload)
	let BB_TEXTURE_SAVE = null;
	let BB_TEXTURE_FROM_PATH = null;
	let BB_LAYER_SELECT = null;
	let BB_LAYER_PROPS_DIALOG = null;
	let BB_LBM_ONCHANGE = null;

	// ============================================================
	// Blend mode warnings and Aseprite-linked selection restrictions
	// ============================================================
	function aseSelectedTextureLinked() {
		try {
			const l = TextureLayer.selected;
			return !!(l && l.texture && l.texture.ase_path);
		} catch (e) { return false; }
	}

	function findLayerByUuid(uuid) {
		try {
			for (const tex of Texture.all) {
				const l = (tex.layers || []).find(x => x.uuid === uuid);
				if (l) return l;
			}
		} catch (e) { /* no project */ }
		return null;
	}

	let layerWarningsScheduled = false;
	function scheduleLayerWarningsUpdate() {
		if (layerWarningsScheduled) return;
		layerWarningsScheduled = true;
		setTimeout(() => {
			layerWarningsScheduled = false;
			updateLayerWarningsAndIndicator();
		}, 60);
	}

	// Warning icons on layer rows + the restriction indicator next to the blend mode select.
	function updateLayerWarningsAndIndicator() {
		try {
			const list = document.getElementById('layers_list');
			if (list) {
				for (const row of list.querySelectorAll('.texture_layer[layer_id]')) {
					const layer = findLayerByUuid(row.getAttribute('layer_id'));
					let show = false;
					let tip = '';
					if (layer) {
						if (layer.ase_blend_warning && layer.blend_mode !== 'default') {
							layer.ase_blend_warning = ''; // user picked a supported mode
						}
						if (layer.ase_blend_warning && layer.blend_mode === 'default') {
							show = true;
							tip = 'The original Aseprite blend mode — "' + layer.ase_blend_warning +
								'" — is not supported by Blockbench; the layer renders as Normal. ' +
								'This warning disappears once you pick a different blend mode.';
						}
					}
					let icon = row.querySelector(':scope > .ase_blend_warning_icon');
					if (show && !icon) {
						icon = document.createElement('div');
						icon.className = 'ase_blend_warning_icon';
						icon.appendChild(Blockbench.getIconNode('warning'));
						icon.style.cssText = 'display:inline-flex;align-items:center;color:#ffbe3d;margin-left:6px;cursor:help;flex-shrink:0;';
						row.appendChild(icon);
					}
					if (icon) icon.title = tip;
					if (!show && icon) icon.remove();
				}
			}
		} catch (e) { /* layers panel unavailable */ }
		// "This is an Aseprite texture" badge on TEXTURES panel rows
		try {
			const list = document.getElementById('texture_list');
			if (list) {
				for (const row of list.querySelectorAll('li.texture[texid]')) {
					const tex = (typeof Project !== 'undefined' && Project.textures || []).find(t => t.uuid === row.getAttribute('texid'));
					const linked = !!(tex && tex.ase_path);
					let badge = row.querySelector(':scope > .ase_texture_badge');
					if (linked && !badge) {
						badge = aseIconNode('logo', '#D9D9D9');
						badge.classList.add('ase_texture_badge');
						badge.style.cssText = 'position:absolute;bottom:2px;width:16px;height:16px;z-index:1;' +
							'filter:drop-shadow(0 0 2px rgba(0,0,0,0.9));';
						badge.title = 'Texture linked to Aseprite: saving writes to the source .aseprite';
						row.appendChild(badge);
					}
					if (badge) {
						const wrapper = row.querySelector('.texture_icon_wrapper');
						if (wrapper) badge.style.left = (wrapper.offsetLeft + wrapper.offsetWidth - 18) + 'px';
						badge.title = 'Texture linked to Aseprite: saving writes to the source .aseprite';
					}
					if (!linked && badge) badge.remove();
				}
			}
		} catch (e) { /* textures panel unavailable */ }
		try {
			const lbm = BarItems.layer_blend_mode;
			const linked = aseSelectedTextureLinked();
			let lock = lbm.node.querySelector(':scope > .ase_mode_lock');
			if (linked && !lock) {
				lock = document.createElement('div');
				lock.className = 'ase_mode_lock';
				lock.appendChild(Blockbench.getIconNode('warning'));
				lock.style.cssText = 'display:inline-flex;align-items:center;color:#ffbe3d;margin-left:5px;cursor:help;';
				lock.title = 'This texture is saved as .aseprite, so only Aseprite-supported modes are available: ' +
					'Normal, Multiply, Screen, Overlay, Darken, Lighten, Difference, Color, Addition. ' +
					'The set_opacity and alpha_mask modes become available once the file is saved as an image.';
				lbm.node.appendChild(lock);
			} else if (!linked && lock) {
				lock.remove();
			}
		} catch (e) { /* widget unavailable */ }
	}

	// ============================================================
	// Icons (user SVG art, adapted: square viewBox with padding —
	// fits Blockbench's square 26px icon slots; fill #D9D9D9 = dark theme text color)
	// ============================================================
	const ASE_ICON_ART = {
		logo: '<path fill-rule="evenodd" clip-rule="evenodd" d="M256 368L257.331 367.991C313.16 367.284 358.284 322.16 358.991 266.331L359 265V192V103C359 66.1552 339.654 33.8289 310.566 15.6249C295.095 5.94308 276.868 0.256225 257.331 0.00878906L256 0H103C46.1147 0 0 46.1147 0 103V192V265L0.00878906 266.331C0.721456 322.603 46.559 368 103 368H256ZM103 295C72.9091 295 45.8319 282.096 27 261.521V265C27 306.974 61.0264 341 103 341H256C297.974 341 332 306.974 332 265V261.521C313.168 282.096 286.091 295 256 295H103ZM90.5 180L90.5 83C90.5 69.469 101.469 58.5 115 58.5C128.531 58.5 139.5 69.469 139.5 83V180C139.5 193.531 128.531 204.5 115 204.5C101.469 204.5 90.5 193.531 90.5 180ZM220.5 180V83C220.5 69.469 231.469 58.5 245 58.5C258.531 58.5 269.5 69.469 269.5 83V180C269.5 193.531 258.531 204.5 245 204.5C231.469 204.5 220.5 193.531 220.5 180Z"/>',
		import: '<path fill-rule="evenodd" clip-rule="evenodd" d="M353 0L354.331 0.00878906C353.888 0.00317838 353.444 0 353 0ZM97 249L16 249C7.16344 249 0 241.836 0 233C0 224.163 7.16345 217 16 217L97 217V249Z"/><path d="M261.627 295H216.373L187.863 323.51C183.596 327.777 182.243 333.855 183.805 339.271C189.023 340.403 194.442 341 200 341H215.627L261.627 295Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M187.863 119.863C194.112 113.615 204.242 113.615 210.49 119.863L312.313 221.686C318.562 227.935 318.562 238.065 312.313 244.313L261.627 295H353C383.091 295 410.168 282.096 429 261.521V265C429 306.974 394.974 341 353 341H215.627L210.49 346.137C207.575 349.051 203.816 350.606 200 350.802C195.635 351.025 191.197 349.47 187.863 346.137C185.882 344.156 184.529 341.785 183.805 339.271C149.612 331.849 124 301.416 124 265V261.521C142.832 282.096 169.909 295 200 295H216.373L262.373 249L124 249H114.196H97V265L97.0088 266.331C97.7215 322.603 143.559 368 200 368H353L354.331 367.991C410.16 367.284 455.284 322.16 455.991 266.331L456 265V192V103C456 67.4467 437.986 36.1006 410.588 17.5908C406.479 14.8143 402.158 12.3266 397.655 10.1569C384.521 3.82865 369.839 0.205194 354.331 0.00878906L353 0H200C143.115 0 97 46.1147 97 103V192V217H100.055H124L262.373 217L187.863 142.49C181.615 136.242 181.615 126.111 187.863 119.863ZM268.601 103.738L286.601 45.7384C290.611 32.8155 304.338 25.5906 317.261 29.6011C330.184 33.6117 337.409 47.339 333.399 60.262L315.399 118.262C311.388 131.185 297.661 138.409 284.738 134.399C271.815 130.388 264.59 116.661 268.601 103.738ZM340.284 151.851L361.284 70.8517C364.68 57.7537 378.051 49.8886 391.149 53.2843C404.246 56.6801 412.112 70.0509 408.716 83.1488L387.716 164.149C384.32 177.247 370.949 185.112 357.851 181.716C344.754 178.32 336.888 164.949 340.284 151.851Z"/>',
		export: '<path fill-rule="evenodd" clip-rule="evenodd" d="M103 0L101.669 0.00878906C102.112 0.00317835 102.556 0 103 0ZM359 236L452.373 236L377.863 310.51C371.615 316.758 371.615 326.888 377.863 333.137C384.112 339.385 394.242 339.385 400.49 333.137L502.313 231.313C508.562 225.065 508.562 214.935 502.313 208.686L400.49 106.863C394.242 100.615 384.112 100.615 377.863 106.863C371.615 113.111 371.615 123.242 377.863 129.49L452.373 204L359 204V192C359 196.059 358.765 200.063 358.308 204H359V236Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M103 0L101.669 0.00878906C79.253 0.292681 58.5626 7.73715 41.7802 20.16C40.7613 20.9143 39.7568 21.6868 38.7672 22.4772C38.3015 22.8493 37.839 23.2252 37.3799 23.6051C37.1109 23.8277 36.843 24.0516 36.5764 24.2768C35.9897 24.7723 35.4086 25.2743 34.8333 25.7826C33.5784 26.8912 32.3508 28.0299 31.1515 29.1977C30.5529 29.7805 29.9613 30.3706 29.377 30.9677C28.6877 31.6722 28.0084 32.3864 27.3394 33.1103C27.0407 33.4335 26.7441 33.7586 26.4495 34.0856C24.8738 35.8349 23.3571 37.6383 21.9027 39.493C21.6034 39.8746 21.3068 40.2584 21.0128 40.6444C19.3545 42.8215 17.7809 45.0665 16.2969 47.3748C14.2882 50.4992 12.4438 53.7393 10.7759 57.0829C10.2313 58.1745 9.7056 59.2771 9.1991 60.3903C3.29097 73.3757 0 87.8035 0 103V192V265L0.00878906 266.331C0.715845 322.16 45.8401 367.284 101.669 367.991L103 368H256C312.441 368 358.279 322.603 358.991 266.331L359 265V236H349.156H332L195 236C186.163 236 179 228.836 179 220C179 211.163 186.163 204 195 204L332 204H358.308C358.765 200.063 359 196.059 359 192V103C359 46.1147 312.885 0 256 0H103ZM88.6499 102.706L94.6499 156.705C96.1441 170.154 108.257 179.844 121.706 178.35C135.154 176.856 144.844 164.742 143.35 151.294L137.35 97.2945C135.856 83.8463 123.743 74.1556 110.294 75.6499C96.8463 77.1441 87.1557 89.2574 88.6499 102.706ZM158.767 70.6023L170.869 152.016C172.859 165.4 185.322 174.637 198.706 172.647C212.09 170.658 221.326 158.195 219.337 144.811L207.234 63.3973C205.244 50.0134 192.782 40.7765 179.398 42.7661C166.014 44.7557 156.777 57.2184 158.767 70.6023ZM256 341C297.974 341 332 306.974 332 265V261.521C313.168 282.096 286.091 295 256 295H103C72.9091 295 45.8319 282.096 27 261.521V265C27 306.974 61.0264 341 103 341H256Z"/>',
	};
	// Square viewBox with padding around the artwork (content -> center)
	const ASE_ICON_VIEWBOX = {
		logo: '-20.5 -16 400 400',
		import: '-32 -76 520 520',
		export: '-36.5 -106 580 580',
	};
	function aseIconDataUrl(kind) {
		const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + ASE_ICON_VIEWBOX[kind] +
			'" fill="#D9D9D9">' + ASE_ICON_ART[kind] + '</svg>';
		return 'data:image/svg+xml,' + encodeURIComponent(svg);
	}
	// Inline SVG node: with fill="currentColor" the icon inherits the exact CSS color
	// that native Blockbench icons use (white in menus, theme color in toolbars) — never darkens.
	// IMPORTANT: returns a div wrapper — getIconNode checks `instanceof HTMLElement`,
	// and SVGElement is not one (otherwise that branch falls into icon.match and breaks plugin loading).
	function aseIconNode(kind, fixedFill) {
		const NS = 'http://www.w3.org/2000/svg';
		const wrap = document.createElement('div');
		const svg = document.createElementNS(NS, 'svg');
		svg.setAttribute('viewBox', ASE_ICON_VIEWBOX[kind]);
		svg.setAttribute('fill', fixedFill || 'currentColor');
		svg.innerHTML = ASE_ICON_ART[kind];
		wrap.appendChild(svg);
		wrap.classList.add('ase_icon');
		return wrap;
	}

	// ============================================================
	// Binary writer
	// ============================================================
	class BinaryWriter {
		constructor(initial = 4096) {
			this.buffer = new ArrayBuffer(initial);
			this.view = new DataView(this.buffer);
			this.bytes = new Uint8Array(this.buffer);
			this.offset = 0;
		}
		_ensure(n) {
			if (this.offset + n <= this.buffer.byteLength) return;
			let size = this.buffer.byteLength * 2;
			while (size < this.offset + n) size *= 2;
			const nb = new ArrayBuffer(size);
			new Uint8Array(nb).set(this.bytes);
			this.buffer = nb;
			this.view = new DataView(nb);
			this.bytes = new Uint8Array(nb);
		}
		writeBYTE(x) { this._ensure(1); this.view.setUint8(this.offset, x & 0xFF); this.offset += 1; }
		writeWORD(x) { this._ensure(2); this.view.setUint16(this.offset, x & 0xFFFF, true); this.offset += 2; }
		writeSHORT(x) { this._ensure(2); this.view.setInt16(this.offset, x, true); this.offset += 2; }
		writeDWORD(x) { this._ensure(4); this.view.setUint32(this.offset, x >>> 0, true); this.offset += 4; }
		writeBytes(arr) {
			this._ensure(arr.length);
			this.bytes.set(arr, this.offset);
			this.offset += arr.length;
		}
		writeZeros(n) { this._ensure(n); this.bytes.fill(0, this.offset, this.offset + n); this.offset += n; }
		writeString(str) {
			const b = new TextEncoder().encode(String(str));
			this.writeWORD(b.length);
			this.writeBytes(b);
		}
		patchDWORD(absoluteOffset, value) { this.view.setUint32(absoluteOffset, value >>> 0, true); }
		patchWORD(absoluteOffset, value) { this.view.setUint16(absoluteOffset, value & 0xFFFF, true); }
		length() { return this.offset; }
		getBuffer() { return this.buffer.slice(0, this.offset); }
	}

	// ============================================================
	// zlib (cel type 2). 'deflate' in the Streams API = RFC1950 = zlib, as the spec requires
	// ============================================================
	async function inflateZlib(bytes) {
		if (typeof DecompressionStream === 'undefined') {
			throw new Error('DecompressionStream is not supported in this environment');
		}
		const stream = new DecompressionStream('deflate');
		const writer = stream.writable.getWriter();
		writer.write(bytes);
		writer.close();
		const reader = stream.readable.getReader();
		const chunks = [];
		let total = 0;
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			chunks.push(value);
			total += value.length;
		}
		const out = new Uint8Array(total);
		let p = 0;
		for (const c of chunks) { out.set(c, p); p += c.length; }
		return out;
	}

	async function deflateZlib(bytes) {
		if (typeof CompressionStream === 'undefined') {
			throw new Error('CompressionStream is not supported in this environment');
		}
		const stream = new CompressionStream('deflate');
		const writer = stream.writable.getWriter();
		writer.write(bytes);
		writer.close();
		const reader = stream.readable.getReader();
		const chunks = [];
		let total = 0;
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			chunks.push(value);
			total += value.length;
		}
		const out = new Uint8Array(total);
		let p = 0;
		for (const c of chunks) { out.set(c, p); p += c.length; }
		return out;
	}

	// ============================================================
	// .aseprite parser -> { width, height, frames, layers: [{name, visible, opacity(0-100), blend_mode, pixels}] }
	// pixels — Uint8ClampedArray width*height*4 (RGBA), the full canvas.
	// ============================================================
	async function parseAseprite(input) {
		let ab;
		if (input instanceof ArrayBuffer) ab = input;
		else if (ArrayBuffer.isView(input)) {
			ab = input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength);
		} else throw new Error('parseAseprite: expected ArrayBuffer or Uint8Array');

		const view = new DataView(ab);
		const u8 = new Uint8Array(ab);

		if (ab.byteLength < 128) throw new Error('File is smaller than 128 bytes — not an .aseprite file');
		const magic = view.getUint16(4, true);
		if (magic !== ASE_MAGIC) throw new Error('Not an Aseprite file (magic 0x' + magic.toString(16) + ')');

		const numFrames = view.getUint16(6, true) || 1;
		const width = view.getUint16(8, true);
		const height = view.getUint16(10, true);
		const bpp = view.getUint16(12, true);
		if (!width || !height) throw new Error('Invalid sprite size');
		if (bpp !== 32 && bpp !== 16 && bpp !== 8) throw new Error('Unsupported color depth: ' + bpp + ' bpp');
		const transparentIndex = view.getUint8(28);

		const allLayers = [];   // all LAYER chunks in order (index = cel layerIndex)
		const cels = new Map(); // "frame:layerIndex" -> {type, x, y, opacity, dataOffset, ...}
		const palette = [];     // index -> [r,g,b,a]
		const frameDur = [];    // frame duration, ms

		let off = 128;
		for (let frame = 0; frame < numFrames; frame++) {
			if (off + 16 > ab.byteLength) break;
			const frameSize = view.getUint32(off, true);
			if (view.getUint16(off + 4, true) !== FRAME_MAGIC) {
				throw new Error('Frame ' + frame + ': invalid frame magic');
			}
			frameDur.push(view.getUint16(off + 8, true));
			const oldCount = view.getUint16(off + 6, true);
			const chunkCount = oldCount === 0xFFFF ? view.getUint32(off + 12, true) : (oldCount || view.getUint32(off + 12, true));

			let co = off + 16;
			for (let c = 0; c < chunkCount; c++) {
				if (co + 6 > ab.byteLength) break;
				const size = view.getUint32(co, true);
				const type = view.getUint16(co + 4, true);
				if (size < 6 || co + size > ab.byteLength) {
					throw new Error('Frame ' + frame + ': chunk extends past end of file (offset ' + co + ', size ' + size + ')');
				}
				const d = co + 6;

				if (type === CHUNK.LAYER) {
					allLayers.push(readLayerChunk(view, u8, d));
				} else if (type === CHUNK.CEL) {
					const cel = {
						type: view.getUint16(d + 7, true),
						layerIndex: view.getUint16(d, true),
						x: view.getInt16(d + 2, true),
						y: view.getInt16(d + 4, true),
						opacity: view.getUint8(d + 6),
						dataOffset: d,
						chunkEnd: co + size,
						frame,
					};
					if (cel.type === 1) cel.linkFrame = view.getUint16(d + 16, true);
					cels.set(cel.frame + ':' + cel.layerIndex, cel);
				} else if (type === CHUNK.PALETTE) {
					readPaletteChunk(view, u8, d, co + size, palette);
				}
				// Other chunks (color profile, tags, user data, slices, ...) are skipped.
				co += size;
			}
			if (frameSize < 16 || off + frameSize > ab.byteLength) break;
			off += frameSize;
		}

		// Blockbench layers — only regular pixel layers (groups are flattened, tilemap layers skipped).
		const pixelLayers = [];
		allLayers.forEach((entry, index) => {
			if (entry.type === 1) return; // group — imported flat for now
			if (entry.type === 2) {
				console.warn('[aseprite_support] tilemap layer "' + entry.name + '" skipped');
				return;
			}
			pixelLayers.push({ entry, aseIndex: index });
		});

		// Pixels of every frame per layer: framesByLayer[frame][layer] -> full RGBA canvas.
		const framesByLayer = [];
		for (let f = 0; f < numFrames; f++) {
			const perLayer = [];
			for (const pl of pixelLayers) {
				const pixels = new Uint8ClampedArray(width * height * 4);
				const cel = resolveCel(cels, f, pl.aseIndex);
				if (cel) {
					const decoded = await decodeCel(cel, view, u8, ab, width, height, bpp, palette, transparentIndex);
					blitCel(pixels, decoded, width, height);
				}
				perLayer.push(pixels);
			}
			framesByLayer.push(perLayer);
		}

		// layers — layer metadata + frame 1 pixels (backwards compatible with the old API).
		const layers = pixelLayers.map((pl, j) => ({
			name: pl.entry.name,
			visible: pl.entry.visible,
			opacity: aseOpacityToBB(pl.entry.opacity),
			blend_mode: ASE_BLEND_TO_BB[pl.entry.blend] || 'default',
			aseBlend: pl.entry.blend,
			aseBlendName: ASE_BLEND_NAMES[pl.entry.blend] || 'Normal',
			pixels: framesByLayer[0][j],
		}));

		return {
			width, height,
			frames: numFrames,
			frameDurations: frameDur.length === numFrames ? frameDur : frameDur.concat(new Array(numFrames - frameDur.length).fill(100)),
			bpp,
			layers,
			framesByLayer,
		};
	}

	function readLayerChunk(view, u8, d) {
		const flags = view.getUint16(d, true);
		return {
			flags,
			visible: (flags & 1) !== 0,
			type: view.getUint16(d + 2, true),
			childLevel: view.getUint16(d + 4, true),
			blend: view.getUint16(d + 10, true),
			opacity: view.getUint8(d + 12),
			name: readString(view, u8, d + 16) || 'Layer',
		};
	}

	function readString(view, u8, d) {
		const len = view.getUint16(d, true);
		if (d + 2 + len > u8.length) return '';
		return new TextDecoder().decode(u8.subarray(d + 2, d + 2 + len));
	}

	function readPaletteChunk(view, u8, d, end, palette) {
		const from = view.getUint32(d + 4, true);
		const to = view.getUint32(d + 8, true);
		let p = d + 20;
		for (let i = from; i <= to && p + 6 <= end; i++) {
			const flags = view.getUint16(p, true);
			const entry = [view.getUint8(p + 2), view.getUint8(p + 3), view.getUint8(p + 4), view.getUint8(p + 5)];
			palette[i] = entry;
			p += 6;
			if (flags & 1) {
				if (p + 2 > end) break;
				p += 2 + view.getUint16(p, true);
			}
		}
	}

	// Resolving a linked cel (type 1) to a cel of another frame of the same layer.
	function resolveCel(cels, frame, layerIndex, seen = new Set()) {
		const key = frame + ':' + layerIndex;
		if (seen.has(key)) return null;
		seen.add(key);
		const cel = cels.get(key);
		if (!cel) return null;
		if (cel.type === 1) return resolveCel(cels, cel.linkFrame, layerIndex, seen);
		if (cel.type !== 0 && cel.type !== 2) return null;
		return cel;
	}

	async function decodeCel(cel, view, u8, ab, spriteW, spriteH, bpp, palette, transparentIndex) {
		const bytesPP = bpp / 8;
		let cw, ch, raw;
		if (cel.type === 0) {
			cw = spriteW; ch = spriteH;
			const need = cw * ch * bytesPP;
			const avail = Math.max(0, Math.min(need, cel.chunkEnd - (cel.dataOffset + 16)));
			raw = decodePixels(u8.subarray(cel.dataOffset + 16, cel.dataOffset + 16 + avail), avail, bpp, palette, transparentIndex);
		} else {
			cw = view.getUint16(cel.dataOffset + 16, true);
			ch = view.getUint16(cel.dataOffset + 18, true);
			const compStart = cel.dataOffset + 20;
			const compEnd = cel.chunkEnd;
			if (cw === 0 || ch === 0 || compEnd <= compStart) {
				return { x: cel.x, y: cel.y, w: cw, h: ch, pixels: new Uint8ClampedArray(0) };
			}
			const comp = u8.subarray(compStart, compEnd);
			const inflated = await inflateZlib(comp);
			const expected = cw * ch * bytesPP;
			raw = decodePixels(inflated, Math.min(inflated.length, expected), bpp, palette, transparentIndex);
		}
		// cel opacity is baked into the alpha channel (Aseprite effect = layer.opacity * cel.opacity)
		if (cel.opacity < 255) {
			const k = cel.opacity / 255;
			for (let i = 3; i < raw.length; i += 4) raw[i] = Math.round(raw[i] * k);
		}
		return { x: cel.x, y: cel.y, w: cw, h: ch, pixels: raw };
	}

	function decodePixels(bytes, byteLength, bpp, palette, transparentIndex) {
		const out = new Uint8ClampedArray(byteLength && (byteLength / (bpp / 8)) * 4);
		if (bpp === 32) {
			for (let p = 0; p < out.length / 4; p++) {
				out[p * 4] = bytes[p * 4];
				out[p * 4 + 1] = bytes[p * 4 + 1];
				out[p * 4 + 2] = bytes[p * 4 + 2];
				out[p * 4 + 3] = bytes[p * 4 + 3];
			}
		} else if (bpp === 16) {
			// grayscale: value byte + alpha byte
			for (let p = 0; p < out.length / 4; p++) {
				const v = bytes[p * 2];
				out[p * 4] = v; out[p * 4 + 1] = v; out[p * 4 + 2] = v;
				out[p * 4 + 3] = bytes[p * 2 + 1];
			}
		} else {
			// indexed: palette index; transparentIndex = fully transparent pixel
			for (let p = 0; p < out.length / 4; p++) {
				const idx = bytes[p];
				const entry = (idx === transparentIndex) ? null : (palette[idx] || null);
				if (!entry) { out[p * 4 + 3] = 0; continue; }
				out[p * 4] = entry[0];
				out[p * 4 + 1] = entry[1];
				out[p * 4 + 2] = entry[2];
				out[p * 4 + 3] = entry[3];
			}
		}
		return out;
	}

	function blitCel(target, cel, targetW, targetH) {
		for (let y = 0; y < cel.h; y++) {
			const dy = cel.y + y;
			if (dy < 0 || dy >= targetH) continue;
			for (let x = 0; x < cel.w; x++) {
				const dx = cel.x + x;
				if (dx < 0 || dx >= targetW) continue;
				const si = (y * cel.w + x) * 4;
				const di = (dy * targetW + dx) * 4;
				target[di] = cel.pixels[si];
				target[di + 1] = cel.pixels[si + 1];
				target[di + 2] = cel.pixels[si + 2];
				target[di + 3] = cel.pixels[si + 3];
			}
		}
	}

	// ============================================================
	// .aseprite builder: { width, height, layers: [{name, visible, opacity(0-100), blend_mode, pixels}] }
	// pixels — Uint8ClampedArray width*height*4. Returns ArrayBuffer.
	// ============================================================
	async function buildAseprite(sprite) {
		const width = sprite.width, height = sprite.height;
		if (!width || !height) throw new Error('buildAseprite: size is not set');
		const frameList = (Array.isArray(sprite.frames) && sprite.frames.length)
			? sprite.frames
			: [{ duration: 100, layers: sprite.layers || [] }];
		const metaLayers = frameList[0].layers || [];

		const w = new BinaryWriter(64 * 1024);

		// ---- File header (128 bytes) ----
		w.writeDWORD(0);            // 0   file size (patched)
		w.writeWORD(ASE_MAGIC);     // 4
		w.writeWORD(frameList.length); // 6  frames
		w.writeWORD(width);         // 8
		w.writeWORD(height);        // 10
		w.writeWORD(32);            // 12  RGBA
		w.writeDWORD(1);            // 14  flags: layer opacity is valid
		w.writeWORD(100);           // 18  speed (deprecated)
		w.writeDWORD(0);            // 20
		w.writeDWORD(0);            // 24
		w.writeBYTE(0);             // 28  transparent palette entry
		w.writeZeros(3);            // 29
		w.writeWORD(0);             // 32  color count (patched from palette)
		w.writeBYTE(1); w.writeBYTE(1); // 34 pixel ratio
		w.writeSHORT(0);            // 36  grid x
		w.writeSHORT(0);            // 38  grid y
		w.writeWORD(16);            // 40  grid w
		w.writeWORD(16);            // 42  grid h
		w.writeZeros(84);           // 44

		// ---- Palette from unique colors across all frames ----
		const colors = collectColors(frameList.reduce((acc, fr) => acc.concat(fr.layers || []), []));

		// ---- Frames ----
		const frameStarts = [];
		const frameChunkCounts = [];
		for (let f = 0; f < frameList.length; f++) {
			const frameStart = w.length();
			frameStarts.push(frameStart);

			// Frame header (16 bytes)
			w.writeDWORD(0);            // frame bytes (patched; includes the whole frame)
			w.writeWORD(FRAME_MAGIC);
			w.writeWORD(0);             // old chunk count (patched)
			w.writeWORD(Math.max(0, Math.min(65535, Math.round(frameList[f].duration ?? 100)))); // duration, ms
			w.writeZeros(2);
			w.writeDWORD(0);            // new chunk count (patched)

			let chunkCount = 0;
			if (f === 0) {
				// Color profile (sRGB, same as Aseprite itself writes)
				w.writeDWORD(22);
				w.writeWORD(CHUNK.COLOR_PROFILE);
				w.writeWORD(1); w.writeWORD(0); w.writeDWORD(0); w.writeZeros(8);
				chunkCount++;

				// Palette (not required for RGBA, but improves compatibility)
				if (colors.length > 0 && colors.length <= 256) {
					const start = w.length();
					w.writeDWORD(0);
					w.writeWORD(CHUNK.PALETTE);
					w.writeDWORD(colors.length);
					w.writeDWORD(0);
					w.writeDWORD(colors.length - 1);
					w.writeZeros(8);
					for (const c of colors) {
						w.writeWORD(0);
						w.writeBYTE(c[0]); w.writeBYTE(c[1]); w.writeBYTE(c[2]); w.writeBYTE(c[3]);
					}
					w.patchDWORD(start, w.length() - start);
					w.patchWORD(32, colors.length);
					chunkCount++;
				}

				// Layer chunks (bottom -> top, same as the array order)
				for (const l of metaLayers) {
					const start = w.length();
					w.writeDWORD(0);
					w.writeWORD(CHUNK.LAYER);
					w.writeWORD(((l.visible === false) ? 0 : 1) | 2); // visible + editable
					w.writeWORD(0);              // type: normal
					w.writeWORD(0);              // child level
					w.writeWORD(0); w.writeWORD(0); // default w/h
					w.writeWORD(BB_BLEND_TO_ASE[l.blend_mode] ?? 0);
					w.writeBYTE(bbOpacityToAse(l.opacity));
					w.writeZeros(3);
					w.writeString(l.name || 'Layer');
					// The chunk size includes its own 4 size bytes and the 2 type bytes — the critical v2 fix.
					w.patchDWORD(start, w.length() - start);
					chunkCount++;
				}
			}

			// Cel chunks (type 2, zlib; an empty layer gets no cel in this frame)
			const layersF = frameList[f].layers || metaLayers;
			for (let i = 0; i < layersF.length; i++) {
				const l = layersF[i];
				const bbox = alphaBBox(l.pixels, width, height);
				if (!bbox) continue;
				const cw = bbox.x1 - bbox.x0 + 1;
				const ch = bbox.y1 - bbox.y0 + 1;
				const raw = new Uint8Array(cw * ch * 4);
				for (let y = 0; y < ch; y++) {
					for (let x = 0; x < cw; x++) {
						const si = ((bbox.y0 + y) * width + (bbox.x0 + x)) * 4;
						const di = (y * cw + x) * 4;
						raw[di] = l.pixels[si];
						raw[di + 1] = l.pixels[si + 1];
						raw[di + 2] = l.pixels[si + 2];
						raw[di + 3] = l.pixels[si + 3];
					}
				}
				const comp = await deflateZlib(raw);
				const start = w.length();
				w.writeDWORD(0);
				w.writeWORD(CHUNK.CEL);
				w.writeWORD(i);              // layer index
				w.writeSHORT(bbox.x0);
				w.writeSHORT(bbox.y0);
				w.writeBYTE(255);            // cel opacity
				w.writeWORD(2);              // type: compressed image
				w.writeSHORT(0);             // z-index
				w.writeZeros(5);
				w.writeWORD(cw); w.writeWORD(ch);
				w.writeBytes(comp);
				w.patchDWORD(start, w.length() - start);
				chunkCount++;
			}

			frameChunkCounts.push(chunkCount);
		}

		// ---- Size patches (every size includes its own field) ----
		for (let f = 0; f < frameStarts.length; f++) {
			const end = (f + 1 < frameStarts.length) ? frameStarts[f + 1] : w.length();
			w.patchDWORD(frameStarts[f], end - frameStarts[f]);
			const count = Math.min(frameChunkCounts[f], 0xFFFF);
			w.patchWORD(frameStarts[f] + 6, count);
			w.patchDWORD(frameStarts[f] + 12, count);
		}
		w.patchDWORD(0, w.length());

		return w.getBuffer();
	}

	function collectColors(layers) {
		const counts = new Map();
		for (const l of layers) {
			const px = l.pixels;
			if (!px) continue;
			for (let p = 0; p < px.length; p += 4) {
				if (px[p + 3] === 0) continue;
				const key = px[p] + ',' + px[p + 1] + ',' + px[p + 2] + ',' + px[p + 3];
				counts.set(key, (counts.get(key) || 0) + 1);
			}
		}
		return [...counts.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, 256)
			.map(([key]) => key.split(',').map(Number));
	}

	// Bounding box of non-transparent area; null if the layer is empty.
	function alphaBBox(pixels, width, height) {
		let x0 = width, y0 = height, x1 = -1, y1 = -1;
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				if (pixels[(y * width + x) * 4 + 3] !== 0) {
					if (x < x0) x0 = x;
					if (x > x1) x1 = x;
					if (y < y0) y0 = y;
					if (y > y1) y1 = y;
				}
			}
		}
		return x1 < 0 ? null : { x0, y0, x1, y1 };
	}

	// ============================================================
	// Aseprite <-> flipbook timing conversion
	// ============================================================
	function gcd2(a, b) { return b === 0 ? a : gcd2(b, a % b); }

	// The FPS at which every frame duration is a multiple of the slot (GCD of durations).
	function suggestedFps(durations) {
		if (!Array.isArray(durations) || !durations.length) return 10;
		let g = Math.max(1, Math.round(durations[0]));
		for (const d of durations) g = gcd2(g, Math.max(1, Math.round(d)));
		if (!g || g < 10) return 10;
		return Math.max(1, Math.min(60, Math.round(1000 / g)));
	}

	// How many flipbook slots each Aseprite frame takes at the given FPS.
	function computeFrameCopies(durations, fps) {
		const slotMs = 1000 / Math.max(1, fps);
		return durations.map(d => Math.max(1, Math.round(d / slotMs)));
	}

	// Whether two slots are identical (arrays of layer pixel arrays).
	function slotsAreIdentical(a, b) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			const x = a[i], y = b[i];
			if (x === y) continue;
			if (!x || !y || x.length !== y.length) return false;
			for (let p = 0; p < x.length; p++) if (x[p] !== y[p]) return false;
		}
		return true;
	}

	// Slots -> runs of identical neighbors: [{start, count}] (for merging duplicates into .aseprite frames).
	function mergeConsecutiveSlots(slots) {
		const runs = [];
		for (let s = 0; s < slots.length; s++) {
			const last = runs[runs.length - 1];
			if (last && slotsAreIdentical(slots[last.start], slots[s])) last.count++;
			else runs.push({ start: s, count: 1 });
		}
		return runs;
	}

	// ============================================================
	// Blockbench: import
	// ============================================================
	function importIntoBlockbench(parsed, suggestedName, sourcePath) {
		const { width, height, layers } = parsed;
		if (!width || !height || !layers.length) {
			Blockbench.showQuickMessage('Aseprite: the file has no pixel layers', 4000);
			return;
		}

		// Composite for source: same operations as Blockbench's updateLayerChanges.
		const composite = document.createElement('canvas');
		composite.width = width;
		composite.height = height;
		const cctx = composite.getContext('2d');
		const scratch = document.createElement('canvas');
		scratch.width = width;
		scratch.height = height;
		const sctx = scratch.getContext('2d');
		for (const l of layers) {
			if (l.visible === false || l.opacity === 0) continue;
			sctx.clearRect(0, 0, width, height);
			sctx.putImageData(new ImageData(new Uint8ClampedArray(l.pixels), width, height), 0, 0);
			cctx.save();
			cctx.globalAlpha = l.opacity / 100;
			cctx.globalCompositeOperation = BB_BLEND_TO_COMPOSITE[l.blend_mode] || 'source-over';
			cctx.drawImage(scratch, 0, 0);
			cctx.restore();
		}

		const texture = new Texture({
			name: suggestedName,
			width,
			height,
			source: composite.toDataURL('image/png'),
		});
		texture.layers_enabled = true;
		if (sourcePath) texture.ase_path = sourcePath; // remember the source .aseprite for the save button

		for (const l of layers) {
			const layer = new TextureLayer({
				name: l.name,
				visible: l.visible !== false,
				opacity: l.opacity,
				blend_mode: l.blend_mode,
			}, texture);
			if (!texture.layers.includes(layer)) texture.layers.push(layer);
			if (l.aseBlend !== undefined && !ASE_BB_EQUIVALENT.includes(l.aseBlend)) {
				layer.ase_blend_warning = l.aseBlendName || 'Normal';
			}
			if (typeof layer.setSize === 'function') layer.setSize(width, height);
			else { layer.canvas.width = width; layer.canvas.height = height; }
			layer.ctx.putImageData(new ImageData(new Uint8ClampedArray(l.pixels), width, height), 0, 0);
		}

		texture.add(false, true);
		try { texture.load(); } catch (e) { /* source is already a data URL */ }
		texture.updateLayerChanges(true);
		if (typeof texture.select === 'function') texture.select();
		if (typeof Canvas !== 'undefined') {
			if (typeof Canvas.updateAllUVs === 'function') Canvas.updateAllUVs();
			if (typeof Canvas.updateAllFaces === 'function') Canvas.updateAllFaces(texture);
		}

		Blockbench.showQuickMessage(
			'Aseprite: imported ' + width + '×' + height +
			', layers: ' + layers.length +
			(parsed.frames > 1 ? ' (frame 1 of ' + parsed.frames + ')' : ''), 4000);
	}

	// Timing adaptation dialog: Aseprite frames -> flipbook slots.
	function showImportAnimationDialog(parsed, suggestedName, sourcePath) {
		const durations = parsed.frameDurations;
		const min = Math.min.apply(null, durations);
		const max = Math.max.apply(null, durations);
		const total = durations.reduce((a, b) => a + b, 0);
		new Dialog({
			id: 'aseprite_support_import_anim',
			title: 'Aseprite: animation, ' + parsed.frames + ' frames',
			width: 470,
			form: {
				info: { type: 'info', text: 'Frame durations: ' + min + '–' + max + ' ms, total ' + total + ' ms. ' +
					'The Blockbench flipbook uses a single FPS for the whole animation — durations are matched by duplicating frames. ' +
					'The default FPS is chosen so the timing matches exactly.' },
				mode: { type: 'select', label: 'Frame duration matching', value: 'duplicate', options: {
					duplicate: 'Duplicate frames to match the FPS (exact timing)',
					uniform: 'Each frame = 1 slot, ignore durations',
				}},
				fps: { type: 'number', label: 'Flipbook FPS (1 sec = 20 ticks)', value: suggestedFps(durations), min: 1, max: 60, step: 1 },
			},
			onConfirm(result) {
				buildAnimatedTexture(parsed, suggestedName, Math.max(1, Math.round(result.fps || 10)), result.mode === 'duplicate', sourcePath);
			},
		}).show();
	}

	// Animated import: every layer becomes a vertical frame strip,
	// texture.fps/frame_time set the flipbook speed (java-format preview runs on frame_time in 50 ms ticks).
	function buildAnimatedTexture(parsed, suggestedName, fps, useDurations, sourcePath) {
		const W = parsed.width, H = parsed.height;
		let copies = useDurations
			? computeFrameCopies(parsed.frameDurations, fps)
			: new Array(parsed.frames).fill(1);
		let slots = copies.reduce((a, b) => a + b, 0);
		if (H * slots > 16384) { // canvas height limit
			copies = new Array(parsed.frames).fill(1);
			slots = parsed.frames;
			if (H * slots > 16384) {
				Blockbench.showQuickMessage('Animation is too long for a flipbook (' + slots + ' slots) — import cancelled', 5000);
				return;
			}
			Blockbench.showQuickMessage('Strip would be too tall — frames were not duplicated', 4000);
		}

		// Strip of every layer: frames stacked vertically (as Blockbench stores them)
		const strips = parsed.layers.map(() => {
			const c = document.createElement('canvas');
			c.width = W; c.height = H * slots;
			return c;
		});
		let slot = 0;
		for (let f = 0; f < parsed.frames; f++) {
			for (let c = 0; c < copies[f]; c++) {
				for (let j = 0; j < parsed.layers.length; j++) {
					strips[j].getContext('2d').putImageData(
						new ImageData(new Uint8ClampedArray(parsed.framesByLayer[f][j]), W, H), 0, slot * H);
				}
				slot++;
			}
		}

		// Composite strip for source (same operations as updateLayerChanges)
		const composite = document.createElement('canvas');
		composite.width = W; composite.height = H * slots;
		const cctx = composite.getContext('2d');
		for (let j = 0; j < parsed.layers.length; j++) {
			const l = parsed.layers[j];
			if (l.visible === false || l.opacity === 0) continue;
			cctx.save();
			cctx.globalAlpha = l.opacity / 100;
			cctx.globalCompositeOperation = BB_BLEND_TO_COMPOSITE[l.blend_mode] || 'source-over';
			cctx.drawImage(strips[j], 0, 0);
			cctx.restore();
		}

		const texture = new Texture({
			name: suggestedName,
			width: W, height: H * slots,
			uv_width: W, uv_height: H,
			source: composite.toDataURL('image/png'),
			fps: fps,
			frame_time: Math.max(1, Math.round(20 / fps)), // 50 ms ticks
			frame_order_type: 'loop',
		});
		texture.layers_enabled = true;
		if (sourcePath) texture.ase_path = sourcePath; // remember the source .aseprite for the save button
		for (let j = 0; j < parsed.layers.length; j++) {
			const l = parsed.layers[j];
			const layer = new TextureLayer({
				name: l.name, visible: l.visible !== false, opacity: l.opacity, blend_mode: l.blend_mode,
			}, texture);
			if (!texture.layers.includes(layer)) texture.layers.push(layer);
			if (l.aseBlend !== undefined && !ASE_BB_EQUIVALENT.includes(l.aseBlend)) {
				layer.ase_blend_warning = l.aseBlendName || 'Normal';
			}
			if (typeof layer.setSize === 'function') layer.setSize(W, H * slots);
			else { layer.canvas.width = W; layer.canvas.height = H * slots; }
			layer.ctx.drawImage(strips[j], 0, 0);
		}
		texture.add(false, true);
		try { texture.load(); } catch (e) { /* source is already a data URL */ }
		texture.updateLayerChanges(true);
		if (typeof texture.select === 'function') texture.select();
		if (typeof Canvas !== 'undefined') {
			if (typeof Canvas.updateAllUVs === 'function') Canvas.updateAllUVs();
			if (typeof Canvas.updateAllFaces === 'function') Canvas.updateAllFaces(texture);
		}
		Blockbench.showQuickMessage('Aseprite: ' + parsed.frames + ' frames → ' + slots + ' slots @ ' + fps + ' fps, layers: ' + parsed.layers.length, 4500);
	}

	async function importFiles(files) {
		for (const file of files) {
			try {
				const parsed = await parseAseprite(file.buffer || file.content);
				const name = (file.name || 'aseprite').replace(/\.(aseprite|ase)$/i, '');
				const sourcePath = file.path || '';
				if (parsed.frames > 1) showImportAnimationDialog(parsed, name, sourcePath);
				else importIntoBlockbench(parsed, name, sourcePath);
			} catch (err) {
				console.error('[aseprite_support] import error:', err);
				Blockbench.showQuickMessage('Aseprite import error: ' + err.message, 5000);
			}
		}
	}

	// ============================================================
	// Blockbench: export
	// ============================================================
	// Collect texture data: size, flipbook slots, layer metadata and baked canvases.
	function collectTextureData(texture) {
		const width = texture.width || texture.canvas?.width;
		const fullH = texture.height || texture.canvas?.height;
		if (!width || !fullH) return { error: 'Texture size is unknown' };
		// Flipbook: frame height = uv_height, slot count = strip height / frame height
		const uvH = texture.uv_height;
		const frameH = (uvH && uvH > 0 && uvH < fullH && fullH % uvH === 0) ? uvH : fullH;
		const slots = fullH / frameH;

		const layersMeta = [];
		const bakedCanvases = [];
		const unsupportedModes = [];
		const texCtx = texture.ctx || texture.canvas?.getContext('2d');

		if (texture.layers_enabled && Array.isArray(texture.layers) && texture.layers.length) {
			for (const l of texture.layers) {
				if (l.type && l.type !== 'pixel_layer') continue; // groups are not exported
				if (ASE_UNSUPPORTED_BB_MODES.includes(l.blend_mode) && !unsupportedModes.includes(l.blend_mode)) {
					unsupportedModes.push(l.blend_mode);
				}
				const c = document.createElement('canvas');
				c.width = width; c.height = fullH;
				const ctx = c.getContext('2d');
				const lw = Math.round((l.canvas?.width || 0) * (l.scale ? l.scale[0] : 1));
				const lh = Math.round((l.canvas?.height || 0) * (l.scale ? l.scale[1] : 1));
				if (l.canvas && lw > 0 && lh > 0) {
					ctx.drawImage(l.canvas, (l.offset ? l.offset[0] : 0), (l.offset ? l.offset[1] : 0), lw, lh);
				}
				layersMeta.push({
					name: l.name || 'Layer',
					visible: l.visible !== false,
					opacity: Math.max(0, Math.min(100, l.opacity ?? 100)),
					blend_mode: l.blend_mode || 'default',
				});
				bakedCanvases.push(c);
			}
		} else if (texCtx && texture.canvas) {
			const c = document.createElement('canvas');
			c.width = width; c.height = fullH;
			c.getContext('2d').drawImage(texture.canvas, 0, 0);
			layersMeta.push({ name: texture.name || 'Background', visible: true, opacity: 100, blend_mode: 'default' });
			bakedCanvases.push(c);
		}
		if (!layersMeta.length) return { error: 'Texture has no pixels to export' };
		return { width, fullH, frameH, slots, layersMeta, bakedCanvases, unsupportedModes };
	}

	// Build the .aseprite ArrayBuffer from a texture. mergeDuplicates — merge identical adjacent slots.
	async function buildAsepriteFromTexture(texture, mergeDuplicates) {
		const data = collectTextureData(texture);
		if (data.error) throw new Error(data.error);
		if (data.slots > 1) {
			const ft = Math.max(1, Math.round(texture.frame_time || 1));
			const fpsDef = Math.max(1, Math.round(texture.fps || 10));
			const slotMs = (typeof Format !== 'undefined' && Format && Format.texture_mcmeta && (texture.frame_time || 1) > 1)
				? 50 * ft
				: 1000 / fpsDef;
			const slotPixels = [];
			for (let s = 0; s < data.slots; s++) {
				const perLayer = [];
				for (let j = 0; j < data.bakedCanvases.length; j++) {
					perLayer.push(data.bakedCanvases[j].getContext('2d').getImageData(0, s * data.frameH, data.width, data.frameH).data);
				}
				slotPixels.push(perLayer);
			}
			const runs = (mergeDuplicates !== false)
				? mergeConsecutiveSlots(slotPixels)
				: slotPixels.map((_, s) => ({ start: s, count: 1 }));
			const frames = runs.map(r => ({
				duration: Math.max(1, Math.round(r.count * slotMs)),
				layers: data.layersMeta.map((m, j) => Object.assign({}, m, { pixels: slotPixels[r.start][j] })),
			}));
			const buffer = await buildAseprite({ width: data.width, height: data.frameH, frames });
			return { buffer, data, frames: frames.length, slotMs };
		}
		const layers = data.layersMeta.map((m, j) => Object.assign({}, m, {
			pixels: data.bakedCanvases[j].getContext('2d').getImageData(0, 0, data.width, data.fullH).data,
		}));
		const buffer = await buildAseprite({ width: data.width, height: data.fullH, layers });
		return { buffer, data, frames: 1, slotMs: 100 };
	}

	async function exportTexture(texture) {
		texture = texture || Texture.selected;
		if (!texture) {
			Blockbench.showQuickMessage('Select a texture first', 2500);
			return;
		}
		try {
			const data = collectTextureData(texture);
			if (data.error) {
				Blockbench.showQuickMessage(data.error, 3000);
				return;
			}
			if (data.slots > 1) {
				// Slot speed: java format (mcmeta) runs on frame_time in 50 ms ticks, others on fps
				const ft = Math.max(1, Math.round(texture.frame_time || 1));
				const fpsDef = Math.max(1, Math.round(texture.fps || 10));
				const slotMs = (typeof Format !== 'undefined' && Format && Format.texture_mcmeta && (texture.frame_time || 1) > 1)
					? 50 * ft
					: 1000 / fpsDef;
				showExportAnimationDialog({
					texture, width: data.width, frameH: data.frameH, slots: data.slots,
					layersMeta: data.layersMeta, bakedCanvases: data.bakedCanvases,
					slotMs, fps: fpsDef, unsupportedModes: data.unsupportedModes,
				});
			} else {
				const doExport = async () => {
					const { buffer } = await buildAsepriteFromTexture(texture, false);
					Blockbench.export({
						resource_id: 'aseprite_file',
						name: (texture.name || 'texture') + '.aseprite',
						extensions: ['aseprite'],
						type: 'Aseprite File',
						savetype: 'binary',
						content: buffer,
					}, (path) => {
						if (path && /\.aseprite$/i.test(path)) {
							texture.ase_path = path; // explicit export (re)links the texture to the file
							texture.saved = true;
						}
					});
					if (data.unsupportedModes.length) {
						Blockbench.showQuickMessage('Blend modes not supported by Aseprite (' + data.unsupportedModes.join(', ') + ') were saved as Normal', 4000);
					}
				};
				if (data.unsupportedModes.length) {
					showUnsupportedBlendDialog(data.unsupportedModes, doExport);
				} else {
					doExport();
				}
			}
		} catch (err) {
			console.error('[aseprite_support] export error:', err);
			Blockbench.showQuickMessage('Aseprite export error: ' + err.message, 5000);
		}
	}

	// Warning before export: Blockbench blend modes missing in Aseprite become Normal.
	function showUnsupportedBlendDialog(modes, onContinue) {
		new Dialog({
			id: 'aseprite_support_blend_warning',
			title: 'Aseprite: unsupported blend modes',
			width: 480,
			form: {
				info: { type: 'info', text: 'These blend modes exist only in Blockbench and are not supported by Aseprite: **' +
					modes.join('**, **') + '**. On export they will be replaced with Normal — layers, positions and opacity are preserved.' },
			},
			onConfirm() { onContinue(); },
		}).show();
	}

	function showExportAnimationDialog(ctx) {
		const byFrameTime = ctx.slotMs !== 1000 / Math.max(1, ctx.fps);
		new Dialog({
			id: 'aseprite_support_export_anim',
			title: 'Aseprite: animation export',
			width: 470,
			form: {
				info: { type: 'info', text: 'The texture is a flipbook: ' + ctx.slots + ' slots of ' + ctx.width + '×' + ctx.frameH +
					', slot ≈ ' + Math.round(ctx.slotMs) + ' ms' +
					(byFrameTime
						? ' (by frame_time: ' + Math.max(1, Math.round(ctx.texture.frame_time || 1)) + ' ticks = 50 ms)'
						: ' (by ' + Math.round(ctx.fps) + ' fps)') + '. ' +
					'Identical adjacent slots can be merged into one .aseprite frame with a "duplicates × slot" duration.' +
					(ctx.unsupportedModes && ctx.unsupportedModes.length
						? '\\n\\n⚠ Blend modes not supported by Aseprite (' + ctx.unsupportedModes.join(', ') + ') will be replaced with Normal.'
						: '') },
				mode: { type: 'select', label: '.aseprite frames', value: 'merge', options: {
					merge: 'Merge identical adjacent slots (recommended)',
					all: 'Every slot = a separate frame',
				}},
			},
			onConfirm(result) {
				exportAnimated(ctx, result.mode === 'merge');
			},
		}).show();
	}

	async function exportAnimated(ctx, merge) {
		try {
			const { buffer, frames, slotMs } = await buildAsepriteFromTexture(ctx.texture, merge);
			Blockbench.export({
				resource_id: 'aseprite_file',
				name: (ctx.texture.name || 'texture') + '.aseprite',
				extensions: ['aseprite'],
				type: 'Aseprite File',
				savetype: 'binary',
				content: buffer,
			}, (path) => {
				if (path && /\.aseprite$/i.test(path)) {
					ctx.texture.ase_path = path; // explicit export (re)links the texture to the file
					ctx.texture.saved = true;
				}
			});
			if (ctx.unsupportedModes && ctx.unsupportedModes.length) {
				Blockbench.showQuickMessage('Blend modes not supported by Aseprite (' + ctx.unsupportedModes.join(', ') + ') were saved as Normal', 4000);
			}
			Blockbench.showQuickMessage('Aseprite: ' + ctx.slots + ' slots → ' + frames + ' frames (' + Math.round(slotMs) + ' ms per slot)', 3500);
		} catch (err) {
			console.error('[aseprite_support] export error:', err);
			Blockbench.showQuickMessage('Aseprite export error: ' + err.message, 5000);
		}
	}

	// Direct write to the linked .aseprite (texture save button / Save Textures).
	async function writeAsepriteFile(texture, path) {
		try {
			const { buffer, data, frames, slots } = await buildAsepriteFromTexture(texture, true);
			const direct = (typeof isApp !== 'undefined' && isApp && typeof Filesystem !== 'undefined' && typeof Filesystem.writeFile === 'function');
			if (direct) {
				Filesystem.writeFile(path, { content: buffer, savetype: 'binary' });
			} else {
				// Web version: download the file
				Blockbench.export({
					name: String(path).split(/[\\/]/).pop() || (texture.name || 'texture') + '.aseprite',
					extensions: ['aseprite'],
					type: 'Aseprite File',
					savetype: 'binary',
					content: buffer,
				});
			}
			texture.saved = true;
			Blockbench.showQuickMessage('Saved (.aseprite): ' + path +
				(slots > 1 ? ' — ' + slots + ' slots → ' + frames + ' frames' : '') +
				(data.unsupportedModes.length ? '. Blend modes (' + data.unsupportedModes.join(', ') + ') replaced with Normal' : ''), 3500);
		} catch (err) {
			console.error('[aseprite_support] save error:', err);
			Blockbench.showQuickMessage('Aseprite save error: ' + err.message, 5000);
		}
	}

	// "Save As" for a texture linked to .aseprite: stay in Aseprite or switch to another format.
	function showAsepriteSaveAsDialog(texture) {
		const base = String(texture.ase_path || '').split(/[\\/]/).pop();
		new Dialog({
			id: 'aseprite_support_save_as',
			title: 'Save texture',
			width: 480,
			form: {
				info: { type: 'info', text: 'This texture is linked to an Aseprite file: `' + base + '`. ' +
					'Saving as Aseprite updates the source file (with layers and animation). ' +
					'Saving in another format unlinks the texture from Aseprite.' },
				mode: { type: 'select', label: 'Format', value: 'aseprite', options: {
					aseprite: 'Aseprite — update the source file',
					other: 'Another format (PNG etc.) — unlink from Aseprite',
				}},
			},
			onConfirm(result) {
				if (result.mode === 'aseprite') {
					writeAsepriteFile(texture, texture.ase_path);
				} else if (BB_TEXTURE_SAVE) {
					// native Blockbench "Save As" dialog; unlinking happens in the fromPath wrapper
					BB_TEXTURE_SAVE.call(texture, true);
				}
			},
		}).show();
	}

	// ============================================================
	// Plugin registration
	// ============================================================
	if (typeof Plugin !== 'undefined') {

		Plugin.register('aseprite_support', {
			title: 'Aseprite Support',
			author: 'Animun4ik',
			description: 'Import .aseprite textures with layers and export Blockbench textures to .aseprite with layers.',
			// Inline about text: shown on the plugin page without any CDN fetch.
			// (fetchAbout only reads a sibling about.md for installed new-repository-format plugins.)
			about: [
				'# Aseprite Support',
				'',
				'Import and export `.aseprite` / `.ase` textures in Blockbench **with layers and animation**.',
				'',
				'## Import',
				'- `.aseprite` / `.ase` → Blockbench texture with layers, opacity and blend modes.',
				'- Multiple frames → flipbook animation (frame durations are matched by duplicating frames under a single FPS).',
				'- Supports RGBA, grayscale and indexed color; raw, linked and zlib-compressed cels.',
				'',
				'## Export',
				'- Blockbench texture → `.aseprite`.',
				'- Preserves layers and animation; identical adjacent flipbook slots are merged into single frames.',
				'- Textures without layers are exported as a single layer.',
				'',
				'## File link',
				'- An imported texture remembers its source `.aseprite` file.',
				'- The texture save button overwrites the source file; "Save As" can switch formats (which unlinks the texture).',
				'',
				'## Limitations',
				'- Aseprite layer groups are flattened; tilemap layers are skipped.',
				'- Blend modes missing in Aseprite (set_opacity, alpha_mask) are exported as Normal.',
				'- Custom frame order and interpolation are not transferred.',
			].join('\n'),
			icon: aseIconDataUrl('logo'),
			version: '3.4.1',
			variant: 'both',
			// Do NOT set 4.8+: min_version >= 4.8 force-enables new_repository_format,
			// and Blockbench starts requesting about.md from the CDN (404 spam in the console).
			min_version: '4.0.0',
			onload() {
				const importAction = new Action('aseprite_import', {
					name: 'Import Aseprite…',
					description: 'Open a .aseprite / .ase file as a Blockbench texture with layers',
					icon: () => aseIconNode('import'),
					click() {
						Blockbench.import({
							resource_id: 'aseprite_file',
							extensions: ['aseprite', 'ase'],
							type: 'Aseprite File',
							readtype: 'buffer',
							multiple: true,
						}, importFiles);
					},
				});
				const exportAction = new Action('aseprite_export', {
					name: 'Export as Aseprite…',
					description: 'Save the selected texture as .aseprite with layers',
					icon: () => aseIconNode('export'),
					click() { exportTexture(Texture.selected); },
				});

				try { MenuBar.addAction(importAction, 'file.import'); }
				catch (e) { MenuBar.addAction(importAction, 'file'); }
				try { MenuBar.addAction(exportAction, 'file.export'); }
				catch (e) { MenuBar.addAction(exportAction, 'file'); }

				// Texture context menu in the textures panel
				try {
					if (Texture.prototype.menu && typeof Texture.prototype.menu.addAction === 'function') {
						Texture.prototype.menu.addAction(exportAction);
					}
				} catch (e) { console.warn('[aseprite_support] texture menu:', e); }

				// TEXTURES panel context menu (right-click on empty space in the list):
				// the item is inserted right after the built-in "Import Texture".
				const attachPanelMenu = () => {
					try {
						const panel = (typeof Panels !== 'undefined' && Panels.textures) ||
							(typeof Interface !== 'undefined' && Interface.Panels && Interface.Panels.textures);
						const menu = panel && panel.menu;
						if (!menu) return false;
						if (Array.isArray(menu.items) && menu.items.includes('import_texture')) {
							menu.items.splice(menu.items.indexOf('import_texture') + 1, 0, importAction);
						} else if (typeof menu.addAction === 'function') {
							menu.addAction(importAction);
						} else {
							return false;
						}
						this.__panelMenu = menu;
						this.__panelMenuAction = importAction;
						return true;
					} catch (e) {
						console.warn('[aseprite_support] textures panel menu:', e);
						return false;
					}
				};
				if (!attachPanelMenu()) setTimeout(attachPanelMenu, 1500);

				// Texture <-> source .aseprite link property (saved into .bbmodel)
				try { new Property(Texture, 'string', 'ase_path', { default: '' }); }
				catch (e) { console.warn('[aseprite_support] property:', e); }

				// Property marking "the layer's original blend mode does not transfer to Blockbench"
				try { new Property(TextureLayer, 'string', 'ase_blend_warning', { default: '' }); }
				catch (e) { console.warn('[aseprite_support] property:', e); }

				// While a texture is linked to .aseprite — hide blend modes missing in Aseprite
				// from the layer select (options with a condition are hidden from the menu and skipped by the wheel).
				try {
					const lbm = BarItems.layer_blend_mode;
					this.__lbmOriginalOptions = {};
					for (const key of ['set_opacity', 'alpha_mask']) {
						if (lbm.options[key] !== undefined) {
							this.__lbmOriginalOptions[key] = lbm.options[key];
							lbm.options[key] = {
								name: 'action.blend_mode.' + key,
								condition: () => !aseSelectedTextureLinked(),
							};
						}
					}
					BB_LBM_ONCHANGE = lbm.onChange;
					lbm.onChange = function (sel, event) {
						const r = BB_LBM_ONCHANGE ? BB_LBM_ONCHANGE.call(this, sel, event) : undefined;
						try {
							if (TextureLayer.selected && TextureLayer.selected.ase_blend_warning) {
								TextureLayer.selected.ase_blend_warning = '';
							}
						} catch (e) { /* no layer */ }
						scheduleLayerWarningsUpdate();
						return r;
					};
				} catch (e) { console.warn('[aseprite_support] blend select:', e); }

				// Update warning icons and the indicator on layer selection / panel changes
				BB_LAYER_SELECT = TextureLayer.prototype.select;
				TextureLayer.prototype.select = function (m) {
					const r = BB_LAYER_SELECT.call(this, m);
					scheduleLayerWarningsUpdate();
					return r;
				};
				// In the layer properties dialog — also remove modes unavailable for .aseprite
				BB_LAYER_PROPS_DIALOG = TextureLayer.prototype.propertiesDialog;
				TextureLayer.prototype.propertiesDialog = function (...args) {
					const removed = [];
					if (this.texture && this.texture.ase_path && TextureLayer.properties.blend_mode.enum_values) {
						const ev = TextureLayer.properties.blend_mode.enum_values;
						for (const key of ['set_opacity', 'alpha_mask']) {
							const i = ev.indexOf(key);
							if (i !== -1) { removed.push([key, i]); ev.splice(i, 1); }
						}
					}
					try { return BB_LAYER_PROPS_DIALOG.apply(this, args); }
					finally {
						const ev = TextureLayer.properties.blend_mode.enum_values;
						for (let k = removed.length - 1; k >= 0; k--) ev.splice(removed[k][1], 0, removed[k][0]);
					}
				};
				this.__layersObserver = new MutationObserver(() => scheduleLayerWarningsUpdate());
				this.__layersObserver.observe(document.body, { childList: true, subtree: true });
				setTimeout(() => scheduleLayerWarningsUpdate(), 400);

				// Inline SVG icon sizes — mirroring Blockbench's img.icon rules
				this.__iconStyle = document.createElement('style');
				this.__iconStyle.textContent =
					'div.ase_icon { width: 26px; height: 26px; display: block; flex-shrink: 0; }' +
					'div.ase_icon > svg { width: 100%; height: 100%; display: block; }' +
					'header .tool > div.ase_icon { margin-top: 2px; }' +
					'.contextMenu li > div.ase_icon { width: 20px; height: 20px; margin-bottom: -3px; margin-left: -27px; margin-right: 5px; margin-top: 1px; }' +
					'.ase_texture_badge > svg { width: 100%; height: 100%; display: block; }';
				document.head.appendChild(this.__iconStyle);

				// Texture save button: .aseprite-linked textures are written to the source file
				// until the user saves them in another format — then the link is removed.
				BB_TEXTURE_SAVE = Texture.prototype.save;
				BB_TEXTURE_FROM_PATH = Texture.prototype.fromPath;
				Texture.prototype.save = function (as) {
					if (this.ase_path && !(this.saved && !as)) {
						if (!as) return writeAsepriteFile(this, this.ase_path);
						return showAsepriteSaveAsDialog(this);
					}
					return BB_TEXTURE_SAVE.apply(this, arguments);
				};
				Texture.prototype.fromPath = function (path) {
					const result = BB_TEXTURE_FROM_PATH.apply(this, arguments);
					try {
						if (typeof path === 'string' && path && /\.aseprite$/i.test(path)) {
							this.ase_path = path; // an .aseprite file became the source again
						} else if (this.ase_path && path && path.toLowerCase() !== String(this.ase_path).toLowerCase()) {
							this.ase_path = ''; // saving in another format unlinks the texture
						}
					} catch (e) { /* not in this version */ }
					scheduleLayerWarningsUpdate();
					return result;
				};

				this.__actions = [importAction, exportAction];
			},
			onunload() {
				for (const a of (this.__actions || [])) { try { a.delete(); } catch (e) { /* already deleted */ } }
				this.__actions = null;
				try {
					if (BB_TEXTURE_SAVE) Texture.prototype.save = BB_TEXTURE_SAVE;
					if (BB_TEXTURE_FROM_PATH) Texture.prototype.fromPath = BB_TEXTURE_FROM_PATH;
				} catch (e) { /* not in this version */ }
				BB_TEXTURE_SAVE = null;
				BB_TEXTURE_FROM_PATH = null;
				try {
					const lbm = BarItems.layer_blend_mode;
					for (const key in (this.__lbmOriginalOptions || {})) lbm.options[key] = this.__lbmOriginalOptions[key];
					if (BB_LBM_ONCHANGE) lbm.onChange = BB_LBM_ONCHANGE;
					if (BB_LAYER_SELECT) TextureLayer.prototype.select = BB_LAYER_SELECT;
					if (BB_LAYER_PROPS_DIALOG) TextureLayer.prototype.propertiesDialog = BB_LAYER_PROPS_DIALOG;
				} catch (e) { /* not in this version */ }
				BB_LBM_ONCHANGE = null;
				BB_LAYER_SELECT = null;
				BB_LAYER_PROPS_DIALOG = null;
				try { if (this.__layersObserver) this.__layersObserver.disconnect(); } catch (e) { /* none */ }
				this.__layersObserver = null;
				try { if (this.__iconStyle) this.__iconStyle.remove(); } catch (e) { /* none */ }
				this.__iconStyle = null;
				try {
					document.querySelectorAll('.ase_mode_lock, .ase_blend_warning_icon').forEach(n => n.remove());
				} catch (e) { /* none */ }
				try {
					const menu = this.__panelMenu;
					const action = this.__panelMenuAction;
					if (menu && action) {
						if (Array.isArray(menu.items) && menu.items.includes(action)) {
							menu.items.splice(menu.items.indexOf(action), 1);
						} else if (typeof menu.removeAction === 'function') {
							menu.removeAction(action);
						}
					}
				} catch (e) { /* not in this version */ }
				this.__panelMenu = null;
				this.__panelMenuAction = null;
				try {
					if (typeof Blockbench.removeDragHandler === 'function') Blockbench.removeDragHandler('aseprite_support');
				} catch (e) { /* not in this version */ }
			},
		});

	} else if (typeof module !== 'undefined' && module.exports !== undefined) {
		// Only for Node core tests (analysis/test_plugin.mjs)
		module.exports = {
			parseAseprite, buildAseprite, inflateZlib, deflateZlib,
			suggestedFps, computeFrameCopies, mergeConsecutiveSlots,
		};
	}
})();
