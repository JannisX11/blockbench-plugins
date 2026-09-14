/// <reference path="../../types/index.d.ts" />
(function () {
	'use strict';

	const PLUGIN_ID = 'recordshots';
	const PREFS_KEY = 'speaway_recordshots';
	const DEFAULT_ANGLE_ID = 'isometric_left';

	let action = null;
	let styleEl = null;
	let modeBarBtn = null;
	let modeBarObserver = null;
	let modeBarLabelNode = null;
	let cancelRequested = false;
	let isRunning = false;
	let escapeKeyHandler = null;
	let modeSyncHandlers = [];

	const DEFAULT_PREFS = {
		selected_angle_ids: [DEFAULT_ANGLE_ID],
		output_root: '',
		use_default_pictures_path: true,
		variant_batch: false,
		panel_mode: 'screenshot',
		record_format: 'apng',
		record_fps: 20,
		record_animation: '',
		record_bg_color: '#000000'
	};

	const RECORD_FORMATS = ['apng', 'gif', 'png_sequence', 'mp4'];

	// --- Native modules --------------------------------------------------------

	function canUseAppFileSystem() {
		return typeof require === 'function' || typeof requireNativeModule === 'function';
	}

	function getNativeModule(moduleName, options) {
		let moduleRef = null;
		if (typeof requireNativeModule === 'function') {
			try {
				moduleRef = options
					? requireNativeModule(moduleName, options)
					: requireNativeModule(moduleName);
			} catch (e) { /* ignore */ }
		}
		if (!moduleRef && typeof require === 'function') {
			try {
				moduleRef = require(moduleName);
			} catch (e) { /* ignore */ }
		}
		return moduleRef;
	}

	function getPathModule() {
		if (typeof PathModule !== 'undefined') return PathModule;
		return getNativeModule('path') || getNativeModule('node:path');
	}

	function getFsForScope(scopePath, message) {
		return getNativeModule('fs', {
			scope: scopePath,
			message: message || 'Required to read/write screenshot and texture files.',
			optional: false
		});
	}

	function getPicturesDir() {
		try {
			if (typeof electron !== 'undefined' && electron.app && electron.app.getPath) {
				return electron.app.getPath('pictures');
			}
		} catch (e) { /* ignore */ }
		try {
			if (typeof require === 'function') {
				let remote = require('@electron/remote');
				if (remote && remote.app) return remote.app.getPath('pictures');
			}
		} catch (e) { /* ignore */ }
		if (typeof SystemInfo !== 'undefined' && SystemInfo.home_directory) {
			return getPathModule().join(SystemInfo.home_directory, 'Pictures');
		}
		return '';
	}

	function getChildProcess() {
		return getNativeModule('child_process', {
			message: 'Required to encode MP4 recordings with FFmpeg.',
			optional: false
		}) || getNativeModule('child_process') || getNativeModule('node:child_process');
	}

	function colorToHex(value) {
		if (!value) return '#000000';
		if (typeof value === 'string') {
			return value.charAt(0) === '#' ? value : ('#' + value);
		}
		if (typeof value.toHexString === 'function') return value.toHexString();
		if (typeof value.toHex === 'function') return '#' + value.toHex();
		if (value.hex) return value.hex.charAt(0) === '#' ? value.hex : ('#' + value.hex);
		return '#000000';
	}

	function spawnProcess(exe, args, stdioOpts) {
		let cp = getChildProcess();
		if (!cp || typeof cp.spawn !== 'function') {
			throw new Error('child_process is not available');
		}
		let p = cp.spawn(exe, args, stdioOpts || { stdio: 'ignore' });
		p.promise = new Promise(function (resolve, reject) {
			p.on('close', function (code) { resolve(code); });
			p.on('error', reject);
		});
		return p;
	}

	async function resolveFfmpegPath() {
		let candidates = [
			localStorage.getItem('ffmpegPath'),
			'ffmpeg',
			'/usr/local/bin/ffmpeg'
		].filter(Boolean);
		for (let i = 0; i < candidates.length; i++) {
			let exe = candidates[i];
			try {
				let p = spawnProcess(exe, []);
				await p.promise;
				return exe;
			} catch (e) { /* try next */ }
		}
		return null;
	}

	function showFfmpegMissingDialog() {
		Blockbench.showMessageBox({
			title: 'FFmpeg Required',
			message: 'MP4 export needs FFmpeg on your system. Download it from https://ffmpeg.org/download.html and ensure it is on PATH, or set localStorage ffmpegPath (Scene Recorder’s path picker also works).',
			icon: 'error'
		});
	}

	function canvasToPngBuffer(canvas) {
		return new Promise(function (resolve, reject) {
			canvas.toBlob(function (blob) {
				if (!blob) {
					reject(new Error('Failed to encode frame PNG'));
					return;
				}
				blob.arrayBuffer().then(function (ab) {
					if (typeof Buffer !== 'undefined') resolve(Buffer.from(ab));
					else resolve(new Uint8Array(ab));
				}).catch(reject);
			}, 'image/png');
		});
	}

	async function encodeMp4FromCanvases(frameCanvases, fps, outPath) {
		let ffmpegPath = await resolveFfmpegPath();
		if (!ffmpegPath) throw new Error('FFmpeg not found');
		if (!frameCanvases || !frameCanvases.length) throw new Error('No frames to encode');

		let buffers = [];
		for (let i = 0; i < frameCanvases.length; i++) {
			buffers.push(await canvasToPngBuffer(frameCanvases[i]));
		}

		let args = [
			'-framerate', String(fps || 20),
			'-i', '-',
			'-c:v', 'libx264',
			'-pix_fmt', 'yuv420p',
			'-vf', 'scale=floor(iw/2)*2:floor(ih/2)*2',
			'-an',
			'-f', 'mp4',
			'-y', outPath
		];
		let p = spawnProcess(ffmpegPath, args, { stdio: ['pipe', 'ignore', 'pipe'] });
		let errOut = '';
		if (p.stderr && typeof p.stderr.on === 'function') {
			p.stderr.on('data', function (chunk) { errOut += String(chunk); });
		}

		return new Promise(function (resolve, reject) {
			p.on('error', reject);
			p.on('close', function (code) {
				if (code === 0) resolve(outPath);
				else {
					let hint = errOut ? errOut.trim().slice(-300) : '';
					reject(new Error('FFmpeg failed (exit ' + code + ')' + (hint ? ': ' + hint : '')));
				}
			});
			try {
				for (let i = 0; i < buffers.length; i++) {
					p.stdin.write(buffers[i]);
				}
				p.stdin.end();
			} catch (e) {
				reject(e);
			}
		});
	}

	// --- Prefs / paths ---------------------------------------------------------

	function loadPrefs() {
		try {
			let raw = localStorage.getItem(PREFS_KEY);
			if (!raw) {
				// Migrate prefs from previous plugin id
				raw = localStorage.getItem('speaway_batch_screenshot');
			}
			if (!raw) return Object.assign({}, DEFAULT_PREFS);
			let parsed = JSON.parse(raw);
			return {
				selected_angle_ids: Array.isArray(parsed.selected_angle_ids) && parsed.selected_angle_ids.length
					? parsed.selected_angle_ids.slice()
					: DEFAULT_PREFS.selected_angle_ids.slice(),
				output_root: typeof parsed.output_root === 'string' ? parsed.output_root : '',
				use_default_pictures_path: parsed.use_default_pictures_path !== false,
				variant_batch: parsed.variant_batch === true,
				panel_mode: parsed.panel_mode === 'record' ? 'record' : 'screenshot',
				record_format: RECORD_FORMATS.indexOf(parsed.record_format) >= 0
					? parsed.record_format
					: 'apng',
				record_fps: (typeof parsed.record_fps === 'number' && parsed.record_fps > 0)
					? parsed.record_fps
					: 20,
				record_animation: typeof parsed.record_animation === 'string' ? parsed.record_animation : '',
				record_bg_color: (typeof parsed.record_bg_color === 'string' && parsed.record_bg_color)
					? parsed.record_bg_color
					: '#000000'
			};
		} catch (e) {
			return Object.assign({}, DEFAULT_PREFS);
		}
	}

	function savePrefs(prefs) {
		try {
			localStorage.setItem(PREFS_KEY, JSON.stringify({
				selected_angle_ids: prefs.selected_angle_ids || DEFAULT_PREFS.selected_angle_ids,
				output_root: prefs.output_root || '',
				use_default_pictures_path: prefs.use_default_pictures_path !== false,
				variant_batch: prefs.variant_batch === true,
				panel_mode: prefs.panel_mode === 'record' ? 'record' : 'screenshot',
				record_format: prefs.record_format || 'apng',
				record_fps: prefs.record_fps || 20,
				record_animation: prefs.record_animation || '',
				record_bg_color: prefs.record_bg_color || '#000000'
			}));
		} catch (e) { /* ignore */ }
	}

	// --- Paths / names ---------------------------------------------------------

	function sanitizeName(name) {
		return String(name || 'model')
			.replace(/\.geo\.json$/i, '')
			.replace(/\.bbmodel$/i, '')
			.replace(/\.geo$/i, '')
			.replace(/[/\\:*?"<>|]+/g, '_')
			.replace(/\s+/g, '_')
			.replace(/_+/g, '_')
			.replace(/^_|_$/g, '') || 'model';
	}

	function getModelName() {
		if (!Project) return 'model';
		return sanitizeName(Project.name || 'model');
	}

	function getDefaultScreenshotsRoot() {
		let pictures = getPicturesDir();
		if (!pictures) return '';
		return getPathModule().join(pictures, 'Blockbench', 'Screenshots');
	}

	function getOutputFolderForModel(prefs) {
		let pathMod = getPathModule();
		let root;
		if (prefs.use_default_pictures_path || !prefs.output_root) {
			root = getDefaultScreenshotsRoot();
		} else {
			root = prefs.output_root;
		}
		if (!root) return '';
		return pathMod.join(root, getModelName());
	}

	function ensureDir(fsMod, dirPath) {
		if (!fsMod.existsSync(dirPath)) {
			fsMod.mkdirSync(dirPath, { recursive: true });
		}
	}

	function writeDataUrlPng(fsMod, pathMod, dataUrl, folder, filename) {
		return writeDataUrlFile(fsMod, pathMod, dataUrl, folder, filename);
	}

	function writeDataUrlFile(fsMod, pathMod, dataUrl, folder, filename) {
		ensureDir(fsMod, folder);
		let fullPath = pathMod.join(folder, filename);
		if (typeof dataUrl !== 'string') {
			throw new Error('Invalid image data');
		}
		let comma = dataUrl.indexOf(',');
		if (comma === -1) throw new Error('Invalid image data');
		fsMod.writeFileSync(fullPath, dataUrl.slice(comma + 1), 'base64');
		return fullPath;
	}

	function resolveOutputPaths(prefs) {
		let pathMod = getPathModule();
		let permissionRoot;
		let outFolder;
		if (prefs.use_default_pictures_path || !prefs.output_root) {
			permissionRoot = getPicturesDir();
			if (!permissionRoot) return { error: 'pictures' };
			outFolder = pathMod.join(permissionRoot, 'Blockbench', 'Screenshots', getModelName());
		} else {
			permissionRoot = prefs.output_root;
			outFolder = pathMod.join(permissionRoot, getModelName());
		}
		let fsMod = getFsForScope(permissionRoot, 'Required to save batch screenshots under your Pictures or chosen folder.');
		if (!fsMod || !pathMod) return { error: 'fs' };
		return { pathMod: pathMod, permissionRoot: permissionRoot, outFolder: outFolder, fsMod: fsMod };
	}

	function projectHasAnimations() {
		return typeof Animation !== 'undefined' && Animation.all && Animation.all.length > 0;
	}

	function getProjectAnimations() {
		if (!projectHasAnimations()) return [];
		return Animation.all.slice();
	}

	// --- Angles ----------------------------------------------------------------

	function getAllAnglePresets() {
		let list = [];
		if (typeof DefaultCameraPresets !== 'undefined' && Array.isArray(DefaultCameraPresets)) {
			DefaultCameraPresets.forEach(function (preset) {
				if (!preset || typeof preset !== 'object') return;
				if (typeof Condition === 'function' && preset.condition && !Condition(preset.condition)) return;
				list.push({
					id: preset.id || sanitizeName(preset.name),
					name: typeof tl === 'function' ? tl(preset.name) : preset.name,
					preset: preset,
					custom: false
				});
			});
		}
		try {
			let raw = localStorage.getItem('camera_presets');
			let custom = raw ? JSON.parse(raw) : [];
			if (Array.isArray(custom)) {
				custom.forEach(function (preset, i) {
					if (!preset || typeof preset !== 'object') return;
					list.push({
						id: 'custom_' + i,
						name: preset.name || ('Custom ' + (i + 1)),
						preset: preset,
						custom: true
					});
				});
			}
		} catch (e) { /* ignore */ }
		return list;
	}

	function resolveSelectedPresets(selectedIds) {
		let all = getAllAnglePresets();
		let byId = {};
		all.forEach(function (a) { byId[a.id] = a; });
		let result = [];
		(selectedIds || []).forEach(function (id) {
			if (byId[id]) result.push(byId[id]);
		});
		if (!result.length) {
			let fallback = all.find(function (a) { return a.id === DEFAULT_ANGLE_ID; }) || all[0];
			if (fallback) result.push(fallback);
		}
		return result;
	}

	// --- Textures (panel Texture.all) ------------------------------------------

	function getPanelTextures() {
		if (typeof Texture === 'undefined' || !Texture.all) return [];
		return Texture.all.slice();
	}

	function textureFileLabel(tex) {
		let name = (tex && (tex.name || tex.id)) || 'texture';
		return sanitizeName(String(name).replace(/\.[^.]+$/, ''));
	}

	function backupFaceTextures() {
		let backup = [];
		let elements = (typeof Outliner !== 'undefined' && Outliner.elements) ? Outliner.elements : [];
		elements.forEach(function (el) {
			if (!el || !el.faces) return;
			let faces = {};
			Object.keys(el.faces).forEach(function (key) {
				let face = el.faces[key];
				if (!face) return;
				faces[key] = face.texture === undefined ? null : face.texture;
			});
			backup.push({ uuid: el.uuid, faces: faces });
		});
		return backup;
	}

	function applyTextureToModel(tex) {
		if (!tex) return;
		let elements = (typeof Outliner !== 'undefined' && Outliner.elements) ? Outliner.elements : [];
		elements.forEach(function (el) {
			if (!el) return;
			if (typeof el.applyTexture === 'function') {
				try {
					el.applyTexture(tex, true);
					return;
				} catch (e) { /* fall through */ }
			}
			if (!el.faces) return;
			Object.keys(el.faces).forEach(function (key) {
				if (el.faces[key]) el.faces[key].texture = tex.uuid;
			});
		});
		if (typeof Canvas !== 'undefined') {
			if (typeof Canvas.updateAllFaces === 'function') Canvas.updateAllFaces();
			else if (typeof Canvas.updateView === 'function') {
				Canvas.updateView({
					elements: elements,
					element_aspects: { geometry: true, uv: true },
					selection: false
				});
			}
		}
	}

	function restoreFaceTextures(backup) {
		if (!backup || !backup.length) return;
		let byUuid = {};
		let elements = (typeof Outliner !== 'undefined' && Outliner.elements) ? Outliner.elements : [];
		elements.forEach(function (el) {
			if (el && el.uuid) byUuid[el.uuid] = el;
		});
		backup.forEach(function (entry) {
			let el = byUuid[entry.uuid];
			if (!el || !el.faces || !entry.faces) return;
			Object.keys(entry.faces).forEach(function (key) {
				if (el.faces[key]) el.faces[key].texture = entry.faces[key];
			});
		});
		if (typeof Canvas !== 'undefined') {
			if (typeof Canvas.updateAllFaces === 'function') Canvas.updateAllFaces();
			else if (typeof Canvas.updateView === 'function') {
				Canvas.updateView({
					elements: elements,
					element_aspects: { geometry: true, uv: true },
					selection: false
				});
			}
		}
	}

	// --- Capture ---------------------------------------------------------------

	function nextFrames(count) {
		count = count || 2;
		return new Promise(function (resolve) {
			function step(n) {
				if (n <= 0) {
					resolve();
					return;
				}
				requestAnimationFrame(function () { step(n - 1); });
			}
			step(count);
		});
	}

	/**
	 * After an angle preset is loaded, re-center and zoom so the full model fits
	 * using world bounds (works for ortho/isometric and any model size).
	 */
	function getVisibleModelBounds() {
		let box = new THREE.Box3();
		let expand = function () {
			let elements = (typeof Outliner !== 'undefined' && Outliner.elements) ? Outliner.elements : [];
			elements.forEach(function (el) {
				if (!el || el.visibility === false) return;
				if (el.mesh && el.mesh.geometry) {
					box.expandByObject(el.mesh);
				}
			});
		};
		if (typeof Canvas !== 'undefined' && typeof Canvas.withoutGizmos === 'function') {
			Canvas.withoutGizmos(expand);
		} else {
			expand();
		}
		return box;
	}

	function frameModelToFit() {
		return new Promise(function (resolve) {
			try {
				let preview = Preview.selected;
				if (!preview || !preview.camera || !preview.controls) {
					resolve();
					return;
				}

				let box = getVisibleModelBounds();
				if (!box || box.isEmpty()) {
					resolve();
					return;
				}

				let center = new THREE.Vector3();
				let size = new THREE.Vector3();
				box.getCenter(center);
				box.getSize(size);

				let maxDim = Math.max(size.x, size.y, size.z, 1);
				let padding = 1.35;
				let neededHalf = (maxDim * padding) / 2;

				let offset = preview.camera.position.clone().sub(preview.controls.target);
				if (offset.lengthSq() < 1e-8) {
					offset.set(1, 0.8, 1);
				}

				preview.controls.target.copy(center);
				if (preview.side_view_target && preview.side_view_target.copy) {
					preview.side_view_target.copy(center);
				}

				if (preview.isOrtho) {
					// At zoom=1, half-extent ≈ preview.size/80 (see Preview.resize)
					let halfW = Math.max(preview.width, 1) / 80;
					let halfH = Math.max(preview.height, 1) / 80;
					let zoom = Math.min(halfW, halfH) / neededHalf;
					preview.camera.zoom = Math.max(zoom, 0.001);
					preview.camera.updateProjectionMatrix();
					offset.setLength(Math.max(maxDim * 2, 64));
					preview.camera.position.copy(center).add(offset);
				} else {
					let fov = preview.camera.fov || 45;
					let halfFovRad = (fov * 0.5) * Math.PI / 180;
					let dist = neededHalf / Math.tan(halfFovRad);
					offset.setLength(Math.max(dist, maxDim, 16));
					preview.camera.position.copy(center).add(offset);
					preview.camera.lookAt(center);
				}

				if (typeof preview.controls.update === 'function') {
					preview.controls.update();
				}
				if (typeof preview.render === 'function') {
					preview.render();
				}
			} catch (e) {
				console.warn('[Recordshots] frameModelToFit failed', e);
			}
			resolve();
		});
	}

	function takeScreenshotDataUrl() {
		return new Promise(function (resolve, reject) {
			let preview = Preview.selected;
			if (!preview || typeof preview.screenshot !== 'function') {
				reject(new Error('No preview available'));
				return;
			}
			preview.screenshot({}, function (dataUrl) {
				if (dataUrl) resolve(dataUrl);
				else reject(new Error('Screenshot failed'));
			});
		});
	}

	async function runBatch(options) {
		if (isRunning) {
			Blockbench.showQuickMessage('Recordshots already running', 2000);
			return;
		}
		if (!Project) {
			Blockbench.showQuickMessage('Open a model first', 2000);
			return;
		}
		if (!canUseAppFileSystem()) {
			Blockbench.showMessageBox({
				title: 'Desktop Only',
				message: 'Recordshots requires the Blockbench desktop app to save files.',
				icon: 'error'
			});
			return;
		}

		let prefs = loadPrefs();
		prefs.selected_angle_ids = options.selected_angle_ids;
		prefs.use_default_pictures_path = options.use_default_pictures_path;
		prefs.output_root = options.output_root || '';
		prefs.variant_batch = options.variant_batch === true;
		prefs.panel_mode = 'screenshot';
		savePrefs(prefs);

		let angles = resolveSelectedPresets(prefs.selected_angle_ids);
		if (!angles.length) {
			Blockbench.showQuickMessage('Select at least one camera angle', 2500);
			return;
		}

		let variantBatch = prefs.variant_batch === true;
		let panelTextures = variantBatch ? getPanelTextures() : [];
		// Default WYSIWYG: one pass of the model as currently displayed (no texture swap)
		let passes = (variantBatch && panelTextures.length)
			? panelTextures.map(function (tex) {
				return { texture: tex, label: textureFileLabel(tex) };
			})
			: [{ texture: null, label: getModelName() }];

		let paths = resolveOutputPaths(prefs);
		if (paths.error === 'pictures') {
			Blockbench.showMessageBox({
				title: 'Output Folder',
				message: 'Could not find the Pictures folder. Choose a custom output folder instead.',
				icon: 'folder'
			});
			return;
		}
		if (paths.error) {
			Blockbench.showMessageBox({
				title: 'Permission Denied',
				message: 'File system access was denied. Allow access to save screenshots.',
				icon: 'error'
			});
			return;
		}
		let pathMod = paths.pathMod;
		let outFolder = paths.outFolder;
		let fsMod = paths.fsMod;

		let total = passes.length * angles.length;
		let done = 0;
		let saved = 0;
		cancelRequested = false;
		isRunning = true;

		let faceBackup = (variantBatch && panelTextures.length) ? backupFaceTextures() : null;
		let originalAngle = null;
		try {
			if (Preview.selected && Preview.selected.camera) {
				originalAngle = {
					position: Preview.selected.camera.position.toArray(),
					target: Preview.selected.controls.target.toArray(),
					projection: Preview.selected.isOrtho ? 'orthographic' : 'perspective',
					zoom: Preview.selected.isOrtho ? Preview.selected.camera.zoom : undefined
				};
			}
		} catch (e) { /* ignore */ }

		attachEscapeCancel();
		Blockbench.setStatusBarText('Recordshots: capturing…');
		Blockbench.setProgress(0);

		try {
			ensureDir(fsMod, outFolder);

			for (let pi = 0; pi < passes.length; pi++) {
				if (cancelRequested) break;
				let pass = passes[pi];

				if (pass.texture) {
					Blockbench.setStatusBarText('Applying texture: ' + (pass.texture.name || pass.label));
					applyTextureToModel(pass.texture);
					await nextFrames(3);
				}

				for (let ai = 0; ai < angles.length; ai++) {
					if (cancelRequested) break;
					let angle = angles[ai];
					Preview.selected.loadAnglePreset(angle.preset);
					await frameModelToFit();
					await nextFrames(2);

					Blockbench.setStatusBarText(
						'Capturing ' + (done + 1) + '/' + total + ': ' + pass.label + ' @ ' + angle.name
					);

					let shot = await takeScreenshotDataUrl();
					let fileName = pass.label + '_' + sanitizeName(angle.id) + '.png';
					writeDataUrlPng(fsMod, pathMod, shot, outFolder, fileName);
					saved++;
					done++;
					Blockbench.setProgress(done / total);
				}
			}
		} catch (err) {
			console.error('[Recordshots]', err);
			Blockbench.showMessageBox({
				title: 'Recordshots Failed',
				message: (err && err.message) ? err.message : String(err),
				icon: 'error'
			});
		} finally {
			if (faceBackup) {
				restoreFaceTextures(faceBackup);
				await nextFrames(2);
			}
			if (originalAngle && Preview.selected) {
				try {
					Preview.selected.loadAnglePreset(originalAngle);
				} catch (e) { /* ignore */ }
			}
			detachEscapeCancel();
			isRunning = false;
			cancelRequested = false;
			Blockbench.setProgress();
			Blockbench.setStatusBarText();
			if (saved > 0) {
				Blockbench.showQuickMessage('Saved ' + saved + ' screenshot(s) to ' + outFolder, 4000);
			} else if (!cancelRequested) {
				Blockbench.showQuickMessage('No screenshots saved', 2500);
			} else {
				Blockbench.showQuickMessage('Batch cancelled (' + saved + ' saved)', 3000);
			}
		}
	}

	function selectAnimation(anim) {
		if (!anim) return;
		if (typeof anim.select === 'function') {
			anim.select();
		} else if (typeof Animation !== 'undefined' && typeof Animation.select === 'function') {
			Animation.select(anim);
		}
	}

	function ensureAnimateMode() {
		let previousId = (typeof Modes !== 'undefined' && Modes.selected) ? Modes.selected.id : null;
		if (typeof Modes !== 'undefined' && Modes.options && Modes.options.animate) {
			if (!Modes.selected || Modes.selected.id !== 'animate') {
				try {
					Modes.options.animate.select();
				} catch (e) { /* ignore */ }
			}
		}
		return previousId;
	}

	function restoreMode(modeId) {
		if (!modeId || typeof Modes === 'undefined' || !Modes.options) return;
		if (Modes.selected && Modes.selected.id === modeId) return;
		let mode = Modes.options[modeId];
		if (mode && typeof mode.select === 'function') {
			try {
				mode.select();
			} catch (e) { /* ignore */ }
		}
	}

	function cancelGifRecorderUi() {
		let tools = document.querySelectorAll('#gif_recording_controls .tool');
		if (tools.length) {
			tools[tools.length - 1].click();
			return;
		}
		let frame = document.getElementById('gif_recording_frame');
		if (frame) frame.remove();
	}

	function autoStartGifRecorder() {
		return new Promise(function (resolve, reject) {
			let attempts = 0;
			function tryClick() {
				let btn = document.querySelector('#gif_recording_frame .gif_record_button');
				if (btn) {
					btn.click();
					resolve();
					return;
				}
				attempts++;
				if (attempts > 40) {
					reject(new Error('Could not start animation recorder'));
					return;
				}
				setTimeout(tryClick, 50);
			}
			tryClick();
		});
	}

	function recordAnimationClip(options) {
		return new Promise(function (resolve, reject) {
			if (typeof Screencam === 'undefined' || typeof Screencam.createGif !== 'function') {
				reject(new Error('Screencam.createGif is not available in this Blockbench version'));
				return;
			}

			let settled = false;
			let exportPatched = false;
			let originalExport = null;
			let mp4FormatPatched = false;
			let previousMp4Format = undefined;
			let hadMp4Format = false;

			function restoreMp4Format() {
				if (!mp4FormatPatched || typeof ScreencamGIFFormats === 'undefined') return;
				mp4FormatPatched = false;
				if (hadMp4Format) {
					ScreencamGIFFormats.mp4 = previousMp4Format;
				} else {
					delete ScreencamGIFFormats.mp4;
				}
			}

			function finish(result, err) {
				if (settled) return;
				settled = true;
				if (exportPatched && originalExport) {
					Blockbench.export = originalExport;
					exportPatched = false;
				}
				restoreMp4Format();
				if (err) reject(err);
				else resolve(result);
			}

			if (options.format === 'png_sequence' && typeof Blockbench.export === 'function') {
				originalExport = Blockbench.export;
				exportPatched = true;
				Blockbench.export = function (exportOpts) {
					if (exportOpts && exportOpts.savetype === 'zip' && exportOpts.content) {
						finish({ kind: 'zip', blob: exportOpts.content });
						return;
					}
					return originalExport.apply(this, arguments);
				};
			}

			if (options.format === 'mp4') {
				if (typeof ScreencamGIFFormats === 'undefined') {
					finish(null, new Error('ScreencamGIFFormats is not available'));
					return;
				}
				if (!options.mp4OutPath) {
					finish(null, new Error('MP4 output path missing'));
					return;
				}
				hadMp4Format = Object.prototype.hasOwnProperty.call(ScreencamGIFFormats, 'mp4');
				previousMp4Format = ScreencamGIFFormats.mp4;
				mp4FormatPatched = true;
				ScreencamGIFFormats.mp4 = {
					name: 'MP4 Video',
					process: async function (vars, gifOptions) {
						try {
							await encodeMp4FromCanvases(
								vars.frame_canvases,
								gifOptions.fps || options.fps || 20,
								options.mp4OutPath
							);
							finish({ kind: 'file', path: options.mp4OutPath });
						} catch (encErr) {
							finish(null, encErr);
						}
					}
				};
			}

			if (typeof Screencam.gif_crop === 'object') {
				Screencam.gif_crop.top = 0;
				Screencam.gif_crop.left = 0;
				Screencam.gif_crop.right = 0;
				Screencam.gif_crop.bottom = 0;
			}

			let existingFrame = document.getElementById('gif_recording_frame');
			if (existingFrame) existingFrame.remove();

			let gifOpts = {
				format: options.format || 'apng',
				fps: options.fps || 20,
				length_mode: 'animation',
				play: true,
				silent: true,
				show_gizmos: false
			};
			if (options.format === 'mp4') {
				gifOpts.background = options.background || '#000000';
			}

			Screencam.createGif(gifOpts, function (dataUrl) {
				finish({ kind: 'dataUrl', dataUrl: dataUrl });
			});

			autoStartGifRecorder().catch(function (err) {
				cancelGifRecorderUi();
				finish(null, err);
			});

			let cancelWatch = setInterval(function () {
				if (settled) {
					clearInterval(cancelWatch);
					return;
				}
				if (cancelRequested) {
					clearInterval(cancelWatch);
					cancelGifRecorderUi();
					finish(null, new Error('cancelled'));
				}
			}, 100);
		});
	}

	function writeBlobFile(fsMod, pathMod, blob, folder, filename) {
		return new Promise(function (resolve, reject) {
			ensureDir(fsMod, folder);
			let fullPath = pathMod.join(folder, filename);
			let reader = new FileReader();
			reader.onload = function () {
				try {
					let result = reader.result;
					let comma = typeof result === 'string' ? result.indexOf(',') : -1;
					let base64 = comma >= 0 ? result.slice(comma + 1) : result;
					fsMod.writeFileSync(fullPath, base64, 'base64');
					resolve(fullPath);
				} catch (e) {
					reject(e);
				}
			};
			reader.onerror = function () {
				reject(new Error('Failed to read zip blob'));
			};
			reader.readAsDataURL(blob);
		});
	}

	function extensionForRecordFormat(format) {
		if (format === 'gif') return '.gif';
		if (format === 'png_sequence') return '.zip';
		if (format === 'mp4') return '.mp4';
		return '.apng';
	}

	async function runAnimationRecord(options) {
		if (isRunning) {
			Blockbench.showQuickMessage('Recordshots already running', 2000);
			return;
		}
		if (!Project) {
			Blockbench.showQuickMessage('Open a model first', 2000);
			return;
		}
		if (!canUseAppFileSystem()) {
			Blockbench.showMessageBox({
				title: 'Desktop Only',
				message: 'Recordshots requires the Blockbench desktop app to save files.',
				icon: 'error'
			});
			return;
		}
		if (!projectHasAnimations()) {
			Blockbench.showQuickMessage('No animations in this project', 2500);
			return;
		}

		let prefs = loadPrefs();
		prefs.selected_angle_ids = options.selected_angle_ids;
		prefs.use_default_pictures_path = options.use_default_pictures_path;
		prefs.output_root = options.output_root || '';
		prefs.panel_mode = 'record';
		prefs.record_format = options.record_format || 'apng';
		prefs.record_fps = options.record_fps || 20;
		prefs.record_animation = options.record_animation || '';
		prefs.record_bg_color = colorToHex(options.record_bg_color || prefs.record_bg_color || '#000000');
		savePrefs(prefs);

		let angles = resolveSelectedPresets(prefs.selected_angle_ids);
		if (!angles.length) {
			Blockbench.showQuickMessage('Select at least one camera angle', 2500);
			return;
		}

		if (prefs.record_format === 'mp4') {
			let ffmpegOk = await resolveFfmpegPath();
			if (!ffmpegOk) {
				showFfmpegMissingDialog();
				return;
			}
		}

		let allAnims = getProjectAnimations();
		let anims;
		if (options.record_animation === '__all__') {
			anims = allAnims.slice();
		} else {
			let match = allAnims.find(function (a) {
				return a.uuid === options.record_animation || a.name === options.record_animation;
			});
			anims = match ? [match] : (Animation.selected ? [Animation.selected] : allAnims.slice(0, 1));
		}
		if (!anims.length) {
			Blockbench.showQuickMessage('Select an animation to record', 2500);
			return;
		}

		let paths = resolveOutputPaths(prefs);
		if (paths.error === 'pictures') {
			Blockbench.showMessageBox({
				title: 'Output Folder',
				message: 'Could not find the Pictures folder. Choose a custom output folder instead.',
				icon: 'folder'
			});
			return;
		}
		if (paths.error) {
			Blockbench.showMessageBox({
				title: 'Permission Denied',
				message: 'File system access was denied. Allow access to save recordings.',
				icon: 'error'
			});
			return;
		}

		let pathMod = paths.pathMod;
		let outFolder = paths.outFolder;
		let fsMod = paths.fsMod;
		let format = prefs.record_format;
		let fps = prefs.record_fps;
		let bgColor = colorToHex(prefs.record_bg_color || '#000000');
		let ext = extensionForRecordFormat(format);

		let total = anims.length * angles.length;
		let done = 0;
		let saved = 0;
		cancelRequested = false;
		isRunning = true;

		let originalAngle = null;
		let previousModeId = ensureAnimateMode();
		await nextFrames(3);

		try {
			if (Preview.selected && Preview.selected.camera) {
				originalAngle = {
					position: Preview.selected.camera.position.toArray(),
					target: Preview.selected.controls.target.toArray(),
					projection: Preview.selected.isOrtho ? 'orthographic' : 'perspective',
					zoom: Preview.selected.isOrtho ? Preview.selected.camera.zoom : undefined
				};
			}
		} catch (e) { /* ignore */ }

		attachEscapeCancel();
		Blockbench.setStatusBarText('Recordshots: recording…');
		Blockbench.setProgress(0);

		try {
			ensureDir(fsMod, outFolder);

			for (let ani = 0; ani < anims.length; ani++) {
				if (cancelRequested) break;
				let anim = anims[ani];
				selectAnimation(anim);
				await nextFrames(2);

				let animLabel = sanitizeName(anim.name || ('anim_' + (ani + 1)));

				for (let ai = 0; ai < angles.length; ai++) {
					if (cancelRequested) break;
					let angle = angles[ai];
					Preview.selected.loadAnglePreset(angle.preset);
					await frameModelToFit();
					await nextFrames(2);

					Blockbench.setStatusBarText(
						'Recording ' + (done + 1) + '/' + total + ': ' + animLabel + ' @ ' + angle.name
					);

					try {
						let fileName = animLabel + '_' + sanitizeName(angle.id) + ext;
						let clipOpts = {
							format: format,
							fps: fps
						};
						if (format === 'mp4') {
							clipOpts.background = bgColor;
							clipOpts.mp4OutPath = pathMod.join(outFolder, fileName);
						}
						let result = await recordAnimationClip(clipOpts);
						if (result.kind === 'file' && result.path) {
							// Already written by FFmpeg
						} else if (result.kind === 'zip' && result.blob) {
							await writeBlobFile(fsMod, pathMod, result.blob, outFolder, fileName);
						} else if (result.dataUrl) {
							writeDataUrlFile(fsMod, pathMod, result.dataUrl, outFolder, fileName);
						} else {
							throw new Error('Recorder returned no data');
						}
						saved++;
					} catch (recErr) {
						if (recErr && recErr.message === 'cancelled') break;
						throw recErr;
					}

					done++;
					Blockbench.setProgress(done / total);
					await nextFrames(2);
				}
			}
		} catch (err) {
			console.error('[Recordshots Record]', err);
			Blockbench.showMessageBox({
				title: 'Recordshots Failed',
				message: (err && err.message) ? err.message : String(err),
				icon: 'error'
			});
		} finally {
			cancelGifRecorderUi();
			if (originalAngle && Preview.selected) {
				try {
					Preview.selected.loadAnglePreset(originalAngle);
				} catch (e) { /* ignore */ }
			}
			restoreMode(previousModeId);
			detachEscapeCancel();
			isRunning = false;
			let wasCancelled = cancelRequested;
			cancelRequested = false;
			Blockbench.setProgress();
			Blockbench.setStatusBarText();
			if (saved > 0) {
				Blockbench.showQuickMessage('Saved ' + saved + ' recording(s) to ' + outFolder, 4000);
			} else if (wasCancelled) {
				Blockbench.showQuickMessage('Record cancelled', 2500);
			} else {
				Blockbench.showQuickMessage('No recordings saved', 2500);
			}
		}
	}

	function attachEscapeCancel() {
		detachEscapeCancel();
		escapeKeyHandler = Blockbench.on('press_key', function (context) {
			if (!isRunning) return;
			if (context.event && (context.event.key === 'Escape' || context.event.which === 27)) {
				cancelRequested = true;
				Blockbench.setStatusBarText('Cancelling batch…');
				if (typeof context.capture === 'function') context.capture();
			}
		});
	}

	function detachEscapeCancel() {
		if (escapeKeyHandler && typeof escapeKeyHandler.delete === 'function') {
			escapeKeyHandler.delete();
		}
		escapeKeyHandler = null;
	}

	// --- Dialog ----------------------------------------------------------------

	function buildAngleFormFields(prefs) {
		let fields = {};
		let angles = getAllAnglePresets();
		let selected = {};
		(prefs.selected_angle_ids || []).forEach(function (id) { selected[id] = true; });

		fields.angles_help = {
			type: 'info',
			text: 'Camera angles (default: Isometric Left 2:1). Uses the same capture as Screenshot Model (Ctrl+P).'
		};
		fields.angle_buttons = {
			type: 'buttons',
			buttons: ['Select All', 'Select None'],
			click: function (index) {
				if (!Dialog.open) return;
				let form = {};
				angles.forEach(function (a) {
					form['angle_' + a.id] = index === 0;
				});
				Dialog.open.setFormValues(form);
			}
		};

		angles.forEach(function (a) {
			fields['angle_' + a.id] = {
				label: a.name + (a.id === DEFAULT_ANGLE_ID ? ' (default)' : ''),
				type: 'checkbox',
				value: !!selected[a.id] || (prefs.selected_angle_ids.length === 0 && a.id === DEFAULT_ANGLE_ID)
			};
		});

		return { fields: fields, angles: angles };
	}

	function isAnimateMode() {
		return typeof Modes !== 'undefined' && Modes.selected && Modes.selected.id === 'animate';
	}

	function isAnimateRecordContext() {
		return isAnimateMode() && projectHasAnimations();
	}

	function openContextualDialog() {
		if (isAnimateRecordContext()) openRecordDialog();
		else openScreenshotDialog();
	}

	function buildFolderFormFields(prefs) {
		let defaultRoot = getDefaultScreenshotsRoot();
		let previewOut = getOutputFolderForModel(prefs) || '(set output folder)';
		return {
			_div_folder: '_',
			use_default_pictures_path: {
				label: 'Use Pictures/Blockbench/Screenshots',
				type: 'checkbox',
				value: prefs.use_default_pictures_path !== false,
				description: 'Default: Pictures/Blockbench/Screenshots/{ModelName}/'
			},
			output_root: {
				label: 'Custom screenshots root',
				type: 'folder',
				value: prefs.output_root || defaultRoot || '',
				condition: function (formResult) {
					return !formResult.use_default_pictures_path;
				},
				description: 'Parent folder; a subfolder named after the model is created automatically'
			},
			output_preview: {
				type: 'info',
				text: 'Saves into: ' + previewOut
			}
		};
	}

	function selectedAngleIdsFromForm(formData, angles) {
		let selectedIds = [];
		angles.forEach(function (a) {
			if (formData['angle_' + a.id]) selectedIds.push(a.id);
		});
		return selectedIds;
	}

	function openScreenshotDialog() {
		if (!Project) {
			Blockbench.showQuickMessage('Open a model first', 2000);
			return;
		}
		if (isRunning) {
			Blockbench.showQuickMessage('Recordshots already running — press Escape to cancel', 3000);
			return;
		}

		let prefs = loadPrefs();
		let angleBuild = buildAngleFormFields(prefs);
		let texCount = getPanelTextures().length;

		let form = Object.assign({}, angleBuild.fields, buildFolderFormFields(prefs), {
			_div2: '_',
			variant_batch: {
				label: 'Capture each Textures panel entry as a variant',
				type: 'checkbox',
				value: prefs.variant_batch === true,
				description: 'Off (default): one photo of the model as shown. On: apply each panel texture to the whole model and capture separately (block-pack variants).'
			},
			texture_info: {
				type: 'info',
				text: 'By default captures exactly what you see (including multi-texture / animated models as a single still). Escape cancels a running batch.'
					+ (texCount ? (' Textures panel currently has ' + texCount + ' texture(s).') : '')
			}
		});

		function collectScreenshotPrefs(formData) {
			let selectedIds = selectedAngleIdsFromForm(formData, angleBuild.angles);
			if (!selectedIds.length) selectedIds = [DEFAULT_ANGLE_ID];
			let current = loadPrefs();
			return {
				selected_angle_ids: selectedIds,
				use_default_pictures_path: !!formData.use_default_pictures_path,
				output_root: formData.output_root || '',
				variant_batch: !!formData.variant_batch,
				panel_mode: 'screenshot',
				record_format: current.record_format,
				record_fps: current.record_fps,
				record_animation: current.record_animation,
				record_bg_color: current.record_bg_color || '#000000'
			};
		}

		let dialog = new Dialog({
			id: PLUGIN_ID + '_dialog',
			title: 'Recordshots',
			width: 520,
			form: form,
			buttons: ['Start', 'dialog.cancel'],
			onConfirm: function (formData) {
				let selectedIds = selectedAngleIdsFromForm(formData, angleBuild.angles);
				if (!selectedIds.length) {
					Blockbench.showQuickMessage('Select at least one angle', 2500);
					return false;
				}
				let useDefault = !!formData.use_default_pictures_path;
				let outputRoot = useDefault ? '' : (formData.output_root || '');
				savePrefs(collectScreenshotPrefs(formData));
				dialog.hide();
				setTimeout(function () {
					runBatch({
						selected_angle_ids: selectedIds,
						use_default_pictures_path: useDefault,
						output_root: outputRoot,
						variant_batch: !!formData.variant_batch
					});
				}, 50);
				return true;
			},
			onFormChange: function (formData) {
				savePrefs(collectScreenshotPrefs(formData));
			}
		});
		dialog.show();
	}

	function openRecordDialog() {
		if (!Project) {
			Blockbench.showQuickMessage('Open a model first', 2000);
			return;
		}
		if (isRunning) {
			Blockbench.showQuickMessage('Recordshots already running — press Escape to cancel', 3000);
			return;
		}
		if (!projectHasAnimations()) {
			Blockbench.showQuickMessage('No animations in this project', 2500);
			return;
		}

		let prefs = loadPrefs();
		let angleBuild = buildAngleFormFields(prefs);
		let animations = getProjectAnimations();
		let animOptions = { __all__: 'All animations' };
		animations.forEach(function (anim) {
			let key = anim.uuid || anim.name;
			animOptions[key] = anim.name || key;
		});
		let defaultAnim = prefs.record_animation;
		if (!defaultAnim || (defaultAnim !== '__all__' && !animOptions[defaultAnim])) {
			defaultAnim = (Animation.selected && (Animation.selected.uuid || Animation.selected.name))
				|| (animations[0] && (animations[0].uuid || animations[0].name))
				|| '__all__';
		}

		let form = Object.assign({}, angleBuild.fields, {
			_div_record: '_',
			record_animation: {
				label: 'Animation',
				type: 'select',
				value: defaultAnim,
				options: animOptions
			},
			record_format: {
				label: 'Output format',
				type: 'select',
				value: prefs.record_format || 'apng',
				options: {
					apng: 'APNG (transparent)',
					gif: 'GIF (transparent)',
					png_sequence: 'PNG sequence (ZIP)',
					mp4: 'MP4 (needs FFmpeg)'
				}
			},
			record_bg_color: {
				label: 'MP4 background',
				type: 'color',
				value: prefs.record_bg_color || '#000000',
				condition: function (formResult) { return formResult.record_format === 'mp4'; }
			},
			record_fps: {
				label: 'FPS',
				type: 'number',
				value: prefs.record_fps || 20,
				min: 1,
				max: 60
			},
			record_info: {
				type: 'info',
				text: 'APNG/GIF/PNG sequence use a transparent background. MP4 is opaque (pick a solid color) and requires FFmpeg on PATH or localStorage ffmpegPath. Saves as {animation}_{angle}. Escape cancels between jobs.'
			}
		}, buildFolderFormFields(prefs));

		function collectRecordPrefs(formData) {
			let selectedIds = selectedAngleIdsFromForm(formData, angleBuild.angles);
			if (!selectedIds.length) selectedIds = [DEFAULT_ANGLE_ID];
			let current = loadPrefs();
			return {
				selected_angle_ids: selectedIds,
				use_default_pictures_path: !!formData.use_default_pictures_path,
				output_root: formData.output_root || '',
				variant_batch: current.variant_batch === true,
				panel_mode: 'record',
				record_format: formData.record_format || 'apng',
				record_fps: (typeof formData.record_fps === 'number' && formData.record_fps > 0) ? formData.record_fps : 20,
				record_animation: formData.record_animation || '',
				record_bg_color: colorToHex(formData.record_bg_color || current.record_bg_color || '#000000')
			};
		}

		let dialog = new Dialog({
			id: PLUGIN_ID + '_record_dialog',
			title: 'Recordshots — Record',
			width: 520,
			form: form,
			buttons: ['Start', 'dialog.cancel'],
			onConfirm: function (formData) {
				let selectedIds = selectedAngleIdsFromForm(formData, angleBuild.angles);
				if (!selectedIds.length) {
					Blockbench.showQuickMessage('Select at least one angle', 2500);
					return false;
				}
				let useDefault = !!formData.use_default_pictures_path;
				let outputRoot = useDefault ? '' : (formData.output_root || '');
				let nextPrefs = collectRecordPrefs(formData);
				savePrefs(nextPrefs);
				dialog.hide();
				setTimeout(function () {
					runAnimationRecord({
						selected_angle_ids: selectedIds,
						use_default_pictures_path: useDefault,
						output_root: outputRoot,
						record_format: nextPrefs.record_format,
						record_fps: nextPrefs.record_fps,
						record_animation: nextPrefs.record_animation,
						record_bg_color: nextPrefs.record_bg_color
					});
				}, 50);
				return true;
			},
			onFormChange: function (formData) {
				savePrefs(collectRecordPrefs(formData));
			}
		});
		dialog.show();
	}

	// --- Mode bar button -------------------------------------------------------

	function updateModeBarButton() {
		if (!modeBarBtn || !modeBarBtn.isConnected) return;
		let record = isAnimateRecordContext();
		let nextMode = record ? 'record' : 'screenshot';
		if (modeBarBtn.getAttribute('data-mode') === nextMode && modeBarLabelNode && modeBarLabelNode.parentNode === modeBarBtn) {
			// Still refresh action name if needed, but skip DOM churn
			if (action) {
				try {
					let name = record ? 'Recordshots — Record' : 'Recordshots';
					if (typeof action.setName === 'function') action.setName(name);
					else action.name = name;
				} catch (e) { /* ignore */ }
			}
			return;
		}
		let label = record ? ' Record' : ' Screenshot';
		let title = record ? 'Recordshots — Record' : 'Recordshots';
		let iconName = record ? 'fiber_manual_record' : 'photo_camera';

		modeBarBtn.title = title;
		modeBarBtn.setAttribute('data-mode', nextMode);

		let oldIcon = modeBarBtn.querySelector('.icon, i, svg');
		let newIcon = Blockbench.getIconNode(iconName);
		if (oldIcon && oldIcon.parentNode === modeBarBtn) {
			modeBarBtn.replaceChild(newIcon, oldIcon);
		} else {
			modeBarBtn.insertBefore(newIcon, modeBarBtn.firstChild);
		}

		if (modeBarLabelNode && modeBarLabelNode.parentNode === modeBarBtn) {
			modeBarLabelNode.textContent = label;
		} else {
			Array.prototype.slice.call(modeBarBtn.childNodes).forEach(function (n) {
				if (n.nodeType === 3) modeBarBtn.removeChild(n);
			});
			modeBarLabelNode = document.createTextNode(label);
			modeBarBtn.appendChild(modeBarLabelNode);
		}

		if (action) {
			try {
				if (typeof action.setName === 'function') action.setName(title);
				else action.name = title;
				if (typeof action.setIcon === 'function') action.setIcon(iconName);
				else action.icon = iconName;
			} catch (e) { /* ignore */ }
		}
	}

	function createModeBarButton() {
		if (modeBarBtn && modeBarBtn.isConnected) {
			updateModeBarButton();
			return;
		}

		let btn = document.createElement('li');
		btn.id = 'recordshots_mode_btn';
		btn.title = 'Recordshots';
		btn.setAttribute('role', 'button');
		btn.tabIndex = 0;

		let icon = Blockbench.getIconNode('photo_camera');
		btn.appendChild(icon);
		modeBarLabelNode = document.createTextNode(' Screenshot');
		btn.appendChild(modeBarLabelNode);

		btn.addEventListener('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			openContextualDialog();
		});
		btn.addEventListener('keydown', function (e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				openContextualDialog();
			}
		});

		modeBarBtn = btn;
		placeModeBarButton();
		updateModeBarButton();
	}

	function placeModeBarButton() {
		if (!modeBarBtn) return;
		let selector = document.getElementById('mode_selector');
		if (!selector) return;
		if (modeBarBtn.parentNode === selector && selector.firstChild === modeBarBtn) return;
		selector.insertBefore(modeBarBtn, selector.firstChild);
	}

	function startModeBarWatcher() {
		stopModeBarWatcher();
		createModeBarButton();
		let host = document.getElementById('main_toolbar') || document.body;
		modeBarObserver = new MutationObserver(function () {
			if (!document.getElementById('recordshots_mode_btn')) {
				createModeBarButton();
			} else {
				placeModeBarButton();
			}
		});
		modeBarObserver.observe(host, { childList: true, subtree: true });
	}

	function stopModeBarWatcher() {
		if (modeBarObserver) {
			modeBarObserver.disconnect();
			modeBarObserver = null;
		}
		if (modeBarBtn) {
			modeBarBtn.remove();
			modeBarBtn = null;
		}
		modeBarLabelNode = null;
	}

	function bindModeSync() {
		unbindModeSync();
		function sync() {
			updateModeBarButton();
		}
		['select_mode', 'unselect_mode', 'select_project', 'load_project', 'close_project'].forEach(function (evt) {
			try {
				let h = Blockbench.on(evt, sync);
				modeSyncHandlers.push(h);
			} catch (e) { /* ignore */ }
		});
		sync();
	}

	function unbindModeSync() {
		modeSyncHandlers.forEach(function (h) {
			if (h && typeof h.delete === 'function') h.delete();
		});
		modeSyncHandlers = [];
	}

	// --- Plugin ----------------------------------------------------------------

	const CSS = `
#mode_selector > li#recordshots_mode_btn {
	display: inline-block;
	height: 30px;
	overflow: hidden;
	padding: 2px 10px;
	margin-right: 10px;
	border-radius: 5px;
	font-size: 1.1em;
	cursor: pointer;
	color: var(--color-text);
	vertical-align: top;
	flex-shrink: 0;
	white-space: nowrap;
}
#mode_selector > li#recordshots_mode_btn:hover {
	color: var(--color-light);
	background-color: var(--color-elevated);
}
#mode_selector > li#recordshots_mode_btn > .icon {
	vertical-align: text-bottom;
	color: var(--color-accent);
}
`;

	BBPlugin.register(PLUGIN_ID, {
		title: 'Recordshots',
		author: 'Speaway',
		description: 'Screenshot and Record in one plugin: batch stills from camera angles, or in Animate mode export transparent APNG/GIF/PNG sequence or MP4 via FFmpeg. Optional per-texture variant mode for block packs.',
		icon: 'photo_camera',
		version: '1.3.1',
		min_version: '4.10.0',
		variant: 'desktop',
		tags: ['Minecraft: Java Edition', 'Minecraft: Bedrock Edition', 'Utility'],

		onload: function () {
			styleEl = document.createElement('style');
			styleEl.id = 'recordshots_style';
			styleEl.textContent = CSS;
			document.head.appendChild(styleEl);

			action = new Action('recordshots_open', {
				name: 'Recordshots',
				description: 'Open Recordshots — Screenshot or Record (Animate mode)',
				icon: 'photo_camera',
				category: 'view',
				condition: function () { return !!Project && !Format.image_editor; },
				click: function () {
					openContextualDialog();
				}
			});
			MenuBar.addAction(action, 'view');

			startModeBarWatcher();
			bindModeSync();
			loadPrefs();
		},

		onunload: function () {
			cancelRequested = true;
			detachEscapeCancel();
			unbindModeSync();
			stopModeBarWatcher();
			if (action) {
				action.delete();
				action = null;
			}
			MenuBar.removeAction('view.recordshots_open');
			if (styleEl) {
				styleEl.remove();
				styleEl = null;
			}
			isRunning = false;
		}
	});
})();
