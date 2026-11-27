/*
 * Gestures — Blockbench desktop plugin for the Gestures Fabric mod.
 *
 * Install: copy this file into your Blockbench plugins folder (Ctrl+J in Blockbench).
 * The plugin reads/writes plain JSON in config/gestures/animations.
 *
 * It also provides a dedicated "Gestures" project format: File → New →
 * Gestures opens a ready-made player rig in animation mode.
 */
(function () {
	'use strict';

	const PLUGIN_ID = 'gestures';
	const PLUGIN_VERSION = '1.0.0';
	/* Fill these in when the mod pages go live. An empty string shows a
	 * "coming soon" placeholder in the About text and dialog instead of a link. */
	const LINKS = {
		modrinth: '',
		curseforge: '',
		coffee: 'https://buymeacoffee.com/oybekk_sad',
		discord: ''
	};
	const FORMAT_ID = 'gestures';
	const FREE_BUTTON_ID = 'gestureFree';
	const RESTRICT_PROPERTY = 'gestureRestrictMovement';
	/* Project-level icon timecode, in seconds. Exported as the gesture's "icon". */
	const ICON_PROPERTY = 'icon';
	/* Stored inside the .bbmodel (and therefore inside Blockbench's auto-backups),
	 * so Recover / reopen keeps the gesture file path and the loop region. */
	const FILE_PROPERTY = 'gestureFile';
	const LOOP_PROPERTY = 'gestureLoop';
	const PARTS = ['head', 'body', 'rightArm', 'leftArm', 'rightLeg', 'leftLeg'];
	const SLOTS = [
		'helmet_slot', 'chestplate_slot', 'leggings_slot',
		'boots_slot', 'left_arm_slot', 'right_arm_slot'
	];
	/* The hitbox is a transparent root group: moving/rotating it in the timeline
	 * moves the player in the world and aims the in-game gaze line. */
	const HITBOX = 'hitbox';
	const TRACKS = PARTS.concat(SLOTS, [HITBOX]);
	const ALLOWED_TOOLS = ['move_tool', 'rotate_tool', 'pivot_tool'];

	/* Vanilla player collision box: 0.6 x 1.8 x 0.6 blocks. Blockbench uses
	 * 16 units per block, so the guide is 9.6 x 28.8 x 9.6 units, centred on
	 * the entity position and starting at the feet (Y = 0). */
	const HITBOX_BODY_FROM = [-4.8, 0, -4.8];
	const HITBOX_BODY_TO = [4.8, 28.8, 4.8];
	const GAZE_LINE_FROM = [-0.25, 28, -2];
	const GAZE_LINE_TO = [0.25, 28, -48];
	const GUIDE_TEXTURES = {
		body: {name: 'hitbox_translucent', rgba: [90, 190, 255, 31]},
		gaze: {name: 'gaze_translucent', rgba: [255, 190, 80, 140]}
	};

	/* Slot points are empty groups parented to a body part. Their animated
	 * transform is an additive offset applied in the game on top of the item
	 * or armour piece that is normally attached to that part. */
	const SLOT_PARENT = {
		helmet_slot: 'head',
		chestplate_slot: 'body',
		leggings_slot: 'body',
		boots_slot: 'body',
		left_arm_slot: 'leftArm',
		right_arm_slot: 'rightArm'
	};
	const SLOT_POSITION = {
		helmet_slot: [0, 28, 0],
		chestplate_slot: [0, 20, 0],
		leggings_slot: [0, 11, 0],
		boots_slot: [0, 2, 0],
		left_arm_slot: [-6, 18, 0],
		right_arm_slot: [6, 18, 0]
	};

	const DEFAULT_BONES = {
		head: ['head', 'Head', 'bone.head', 'Head Bone'],
		body: ['body', 'Body', 'torso', 'Torso', 'chest', 'Chest'],
		rightArm: ['rightArm', 'Right Arm', 'right_arm', 'RightArm', 'armRight'],
		leftArm: ['leftArm', 'Left Arm', 'left_arm', 'LeftArm', 'armLeft'],
		rightLeg: ['rightLeg', 'Right Leg', 'right_leg', 'RightLeg', 'legRight'],
		leftLeg: ['leftLeg', 'Left Leg', 'left_leg', 'LeftLeg', 'legLeft'],
		helmet_slot: ['helmet_slot', 'Helmet Slot'],
		chestplate_slot: ['chestplate_slot', 'Chestplate Slot'],
		leggings_slot: ['leggings_slot', 'Leggings Slot'],
		boots_slot: ['boots_slot', 'Boots Slot'],
		left_arm_slot: ['left_arm_slot', 'Left Arm Slot'],
		right_arm_slot: ['right_arm_slot', 'Right Arm Slot'],
		hitbox: ['hitbox', 'Hitbox', 'Hitbox Root', 'Root']
	};

	/* Steve rig matching the vanilla/Blockbench player geometry.
	 * Numbers are Blockbench model units, Y points up. UV offsets are
	 * expanded by Blockbench's box-UV rule, like in the Bedrock player model. */
	/* Coordinates are Blockbench-internal (X is mirrored relative to the
	 * Minecraft entity JSON): right limbs sit at +X, left limbs at -X. This
	 * matches Blockbench's own Steve preset, so each limb uses its correct
	 * skin area instead of swapping the arms/legs. */
	const PLAYER_RIG = [
		{part: 'head', origin: [0, 24, 0], from: [-4, 24, -4], to: [4, 32, 4], uv: [0, 0]},
		{part: 'body', origin: [0, 24, 0], from: [-4, 12, -2], to: [4, 24, 2], uv: [16, 16]},
		{part: 'rightArm', origin: [5, 22, 0], from: [4, 12, -2], to: [8, 24, 2], uv: [40, 16]},
		{part: 'leftArm', origin: [-5, 22, 0], from: [-8, 12, -2], to: [-4, 24, 2], uv: [32, 48]},
		{part: 'rightLeg', origin: [1.9, 12, 0], from: [-0.1, 0, -2], to: [3.9, 12, 2], uv: [0, 16]},
		{part: 'leftLeg', origin: [-1.9, 12, 0], from: [-3.9, 0, -2], to: [0.1, 12, 2], uv: [16, 48]}
	];

	/* Embedded copy of Blockbench's 64x64 Steve skin. Loading it from a data
	 * URL keeps the rig textured in desktop Blockbench, where fetching
	 * assets/player_skin.png over file:// is unreliable. */
	const PLAYER_SKIN_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAIiklEQVR4Aeyaa4hVVRTH9z1CNDjgzJiO4jSVPSA1KqLCDxUU2Dvs+amgondEZE+K+lAQBQX1obdRENGn8oOEoT19pFampY6o4XNEx3yFIxOB3e5vN//Dutt9zzkz17wzQ8P8Zq291tr77LXOPo855yQu5+fyuYfKWYx5+Ity88z3o+DLGb7h7twChDPcdeCQg9A+XNuFCnBG5/FpfhNaRnt9pBShUAF8xiP0T+EChKtAK2G416VwAUiUIliwDXcKFWDDtj+PyDNmOyJoGBgKFYA8SNiCDf6a95I73PVRFHzEDGWSrGs8Pk3eLn102S9+9XOXBWNkoXEaJWuuAJK0hBPM8oWxQ7mdxK7nJDf75sucmHv/Takesy189Oojbo4YF0geGQNfo/ErgMlpIkpe7fYTWt2KubMdMsu24YVbfBEYC4jt2b3b29BjKC7mO1a2hEmyMSYDnOhoC5I/79q7fBGybPg0FrrABmpLYgO1GyWTvm3djokIimAnQ/I9e/a7juk3+lXASkDHhs/GhmPRBmI0viQ2+dAbRcKGmQigM0GkIFF0Emc1ADo2+dCPu/Ip19TZgeoYC3yj8gc9RsXV8F9fAM1CkyQZ2SRJlj0O6LIjFa/+2CyHt+5wMWzMsdLD7SR/vH5FydL2+UMOxhxc72DUqbc6sWfM1W7L93NKfRu+rcL23/Tc+W7pvZ1V/PDidLf1/ZmecWtecoLtnHLa6WVLOMGwvXfv3rLl7I92l2HCq2vKEMbntatWgIL7DvVK9XLcxpcd+EaBP5fO+9tNf2dbFVM/3FmgZ7GQtrY2B4rmsK21+hRTS0YLoOCm0c1Sh4y0iWtS7ePH+/OPzkGyF5HRApA4aIDfT3/Sgdp5cu3tE/2EFMfEsNEe3dzsAN2CDaytqK4V0LtoedEuaVzC8TftnHPLD8163HPNdTPdpBM700my9JtXPevEhIkTyxZ7PKKzhyDdQr+CDb776ksHPy1f5izYVq/82ZXND+MJmfuHS8XXV41yFJdzD+cZxUumgTWURFVfWdm4CGPtarC+E9on+OaKFSsc0Ni3b5+DnbOmugOvXe5BxwbEEAvoPT09DtDxW7DVgjj6WWrFZtkTOQ/s3+cEtpbWNr8KVCBsllpFYUIXXXyJLwLxU6edler4sIW0t7d7EysEfKPyh3hBwmLdunW+aN3d3c6iWCsrw2T+Jod6ex0QRdJAIXZs3+bt8uEXSl6+jo4OB/LnSWLBxtnE0YHC6Goy+fkfncB2wdNL3Q1vbq8CW4jdRkz3h0C4lymCzgPyKWk7iHxMFDuVR4JdBejYwMbQBpJFCu1p2pxAQ7CPOmkSwknSQLc0X3Qh5kz8ClAEex5aW1scyI609wbooBUQS4o+eagfS9omTUFEbAwVhGSz/DFfaPPnACUi5+ZNmxxgB+x2BaADdiWBLhYt/M6tXbPa36wgQb6YZAWFCVMQCkM813kLtqNFwp4MB2upnACBJQ6hnz4CHycipIUELNaHHuuDXX3Qi8JKgKLxNs6vAAza0+j1ElsVMZu2gy9MHJv8oWQ1hLbBthP32ALXd/8cD0UAzgOADvITG6I9KamJkIBFdqSNlW5j0W0cd3q08+DckBcT+v0Dkc0PnPrv//D9hZj0wmIHSpx/NNKYygMUdMBuBySZIqgPsejIGPhiUBBt2/6bza0wbaT8sf7Wlhze0O3G3fCxQ/Z+uczBkjc/cYAO+BQjXe17H3jQwawnnnQWbJYsn40L9VgiHALa2xz7XO6sRJffJhvTk955d5WyeOX6svvskU4Pehi7+beNJVizamXJgs2S5bNxoc6zhl2PTiv9ctv4KrDhA+mSstGOJW1t6UnQGq0++eST/B5mz6Bb30jQcwswEpLMyiG3ANyzd63+1QF61mDD0ZcWQM8DkDaRKVOmlJqamjzo1jcS9LQAPAvYsmWTg5GQWNEc0gIU7TDS4tICLP7mq9Lczz71DKUku7q6yqBHXJLY5s+fX46BT+TlkhYgL7BRfs47MHbs2JIF24wZM0ox8Im8eQ/5AuQlUK///wLUW8Hh3n9QK6DoCWY4FGdQBeCpLAyHBPPmOKgC6IUHg7/97nvppQhdhJcn2ZHyoQvZJGVnG/8lCRvSRrW0+/r6yqC2/MTCggULHKDfd8/d6aUIXYSXJ9mR8qEL2SRlH2jyA41P2JA2qmunvfdfuHhJ1Zg2Hr3KWWnY94bozVfOLlsqIZm/utGR5J0/8A0AZHYehDP3EOAZAM8CAH0g29Cjc16wQtG+9hE5T4SAx2BF+w8kLrcAAxmMWCWNXi8UgkdbwGOweseL9c8tAM8AeBYA6LFBQhtFANn5tgDUHojUA86GrACeDbw1+wP3xDPPOc4LnCPCyXOcC741wM/LFN4t8q3BHWeud3Dyzjf8ZzbEKB6pY12S/paDc+50XHX4BoBvARQnaWMHo2euAJ4NAM8K8gbXHid53ioRTz9BGx8QC9iA9wAWXpJgPxZkFmCgEyA5+vBSRRIdaMcg8fCdADbeC1IIgS1GbMyB2DILoOcDiyvPCooMylskIJakWQlAG7ugLXifH3vPz53m5OCbAGzEW3SPYiX3LzpEJLGF0CezAJpkntRyZgUASYPth11tXqxK5yVGqMvG2T9EL0GIAd3DWMm5yj47QMcWQp+jUgAlINna/30BqwBkRyp5SWwWklLS1m71PL+NzdOPagG0xPm2AOzG8anNigG1a0mu/ZZacfXYj2oBWObQ0v99QTgx7XUkyM9eB7WPpRxUAXQyKTpRu/eL9mHPF42tJ25QBeBsDH7DdX5fwPHsx8n505A7wVpz4s4M8POPir4V0PcEfFsAalfFBN8XcKvLO32hMbMSZjz1I74e6n4eoO8FkHxLAHxbAOiAb1z/NwjS1dZlTZJkWBWxQ4DE5eecAbTr4R8AAAD//4f/6uQAAAAGSURBVAMAUEle/eUQLPgAAAAASUVORK5CYII=';

	const KEY_SETTINGS = PLUGIN_ID + '.settings';
	const KEY_META = PLUGIN_ID + '.meta';

	let actions = [];
	let pluginSettings = [];
	let newMenuOwner = null;
	let newMenuOriginalChildren = null;
	let newMenuPatched = false;
	let openGestureOwner = null;
	let openGesturePlaced = false;
	let settings;
	let meta;
	let workspaceFormat = null;
	let toolConditions = null;
	let animationPanelPatched = false;
	let animationPanelCondition = null;
	let animationActionConditions = {};
	let projectWindowClick = null;
	let projectWindowOnClick = null;
	let saveClick = null;
	let saveOnClick = null;
	let gestureFilePaths = {};
	let gestureDropHandler = null;
	let replayingDrop = false;
	let projectProperty = null;
	let freeButton = null;
	let freeProperty = null;
	let restrictProperty = null;
	let iconProperty = null;
	let fileProperty = null;
	let loopProperty = null;
	let parsedListener = null;
	const slotStores = {};
	let projectPropertyVisibility = null;
	let loopHandles = null;
	let loopDragging = null;
	let timelineVueWatched = null;
	let timelineUnwatchers = [];
	let eventBindings = [];
	let styleNode = null;
	let iconRenderer = null;

	function pathLib() {
		if (typeof requireNativeModule === 'function') {
			try {
				return requireNativeModule('path');
			} catch (err) {
				console.warn('[Gestures] Could not load path module', err);
			}
		}
		return {
			join: function () { return Array.prototype.slice.call(arguments).join('/'); },
			resolve: function () { return Array.prototype.slice.call(arguments).join('/'); },
			basename: function (p) { return String(p).split(/[\\/]/).pop(); },
			isAbsolute: function () { return true; }
		};
	}

	/* The JSON file an opened/dropped gesture came from. Ctrl+S writes there
	 * without asking again; a brand-new gesture asks once via the save dialog. */
	function rememberGestureFile(animation, filePath, fileName, project) {
		if (!animation || !animation.uuid) return;
		gestureFilePaths[animation.uuid] = {
			path: filePath || null,
			name: fileName || (filePath ? pathLib().basename(filePath) : 'gesture.json')
		};
		const target = project || ((typeof Project !== 'undefined' && Project) ? Project : null);
		if (target) target[FILE_PROPERTY] = filePath || '';
	}

	function gestureFileFor(animation) {
		if (animation && animation.uuid && gestureFilePaths[animation.uuid]) return gestureFilePaths[animation.uuid];
		const saved = projectValue(FILE_PROPERTY);
		if (saved) return {path: String(saved), name: pathLib().basename(String(saved))};
		return null;
	}

	/* A project that is already showing this gesture file (any tab). */
	function findOpenGestureProject(filePath) {
		if (!filePath || typeof ModelProject === 'undefined' || !Array.isArray(ModelProject.all)) return null;
		const norm = function (value) { return String(value).replace(/\\/g, '/').toLowerCase(); };
		const wanted = norm(filePath);
		return ModelProject.all.find(function (project) {
			return project && project.format && project.format.id === FORMAT_ID
				&& project[FILE_PROPERTY] && norm(project[FILE_PROPERTY]) === wanted;
		}) || null;
	}

	function defaultSettings() {
		const path = pathLib();
		let dir = '';
		if (typeof SystemInfo !== 'undefined') {
			if (SystemInfo.platform === 'win32' && SystemInfo.appdata_directory) {
				dir = path.join(SystemInfo.appdata_directory, '.minecraft', 'config', 'gestures', 'animations');
			} else if (SystemInfo.platform === 'darwin' && SystemInfo.home_directory) {
				dir = path.join(SystemInfo.home_directory, 'Library', 'Application Support', 'minecraft',
						'config', 'gestures', 'animations');
			} else if (SystemInfo.home_directory) {
				dir = path.join(SystemInfo.home_directory, '.minecraft', 'config', 'gestures', 'animations');
			}
		}
		return {
			configDir: dir,
			rotX: -1,
			rotY: -1,
			rotZ: 1,
			posX: -1,
			posY: -1,
			posZ: 1,
			vanillaJar: '',
			assetsDirs: '',
			posScale: 16,
			defaultPlayMode: 'ONCE',
			bones: JSON.parse(JSON.stringify(DEFAULT_BONES))
		};
	}

	function readStored(key, fallback) {
		try {
			const raw = localStorage.getItem(key);
			if (!raw) return fallback;
			const parsed = JSON.parse(raw);
			return parsed && typeof parsed === 'object' ? parsed : fallback;
		} catch (err) {
			return fallback;
		}
	}

	function loadState() {
		const defaults = defaultSettings();
		settings = Object.assign(defaults, readStored(KEY_SETTINGS, {}));
		if (!settings.bones || typeof settings.bones !== 'object') {
			settings.bones = JSON.parse(JSON.stringify(DEFAULT_BONES));
		}
		TRACKS.forEach(function (part) {
			if (!Array.isArray(settings.bones[part])) settings.bones[part] = DEFAULT_BONES[part].slice();
		});
		meta = readStored(KEY_META, {});
	}

	function saveSettings() {
		localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
	}

	function saveMeta() {
		localStorage.setItem(KEY_META, JSON.stringify(meta));
	}

	function getMeta(animation) {
		return animation ? (meta[animation.uuid] || {}) : {};
	}

	function setMeta(animation, values) {
		if (!animation) return;
		meta[animation.uuid] = Object.assign(getMeta(animation), values);
		saveMeta();
		if (values && values.loopStart !== undefined && values.loopEnd !== undefined && workspaceActive()) {
			setProjectValue(LOOP_PROPERTY, round(values.loopStart, 4) + ',' + round(values.loopEnd, 4));
		}
	}

	function safeId(value) {
		const id = String(value || 'gesture').replace(/[^a-zA-Z0-9_.-]/g, '_').trim();
		return id && id !== '.' && id !== '..' ? id : 'gesture';
	}

	function round(value, digits) {
		const pow = Math.pow(10, digits === undefined ? 4 : digits);
		const number = Number(value);
		return Math.round((isFinite(number) ? number : 0) * pow) / pow;
	}

	function number(value) {
		const parsed = Number(value);
		return isFinite(parsed) ? parsed : 0;
	}

	function clamp(value, min, max) {
		return Math.min(max, Math.max(min, value));
	}

	/* Blockbench 5.0 stopped inverting rotation X/Y and position X in stored
	 * keyframes. Older projects still use the inverted convention. */
	function legacyKeyframeConvention() {
		const major = parseInt(String(Blockbench.version || '5').split('.')[0], 10);
		return isFinite(major) && major < 5;
	}

	function axisSigns() {
		const flip = legacyKeyframeConvention() ? -1 : 1;
		return {
			rot: [number(settings.rotX) * flip, number(settings.rotY) * flip, number(settings.rotZ)],
			pos: [number(settings.posX) * flip, number(settings.posY), number(settings.posZ)],
			scale: Math.max(1, number(settings.posScale) || 16)
		};
	}

	function partForNode(node) {
		if (!node || !node.name) return null;
		const name = String(node.name).toLowerCase();
		for (const part of TRACKS) {
			const aliases = settings.bones[part] || [];
			for (const alias of aliases) {
				if (String(alias).toLowerCase() === name) return part;
			}
		}
		/* Legacy settings may contain only the six body parts. Always accept the
		 * canonical group name so slot keys are never silently dropped. */
		for (const part of TRACKS) {
			if (String(part).toLowerCase() === name) return part;
		}
		return null;
	}

	function groupForPart(part) {
		const aliases = settings.bones[part] || [part];
		const names = aliases.map(function (name) { return String(name).toLowerCase(); });
		return Group.all.find(function (group) {
			return group.name && names.includes(String(group.name).toLowerCase());
		});
	}

	function vector(value) {
		if (!Array.isArray(value)) return [0, 0, 0];
		return [number(value[0]), number(value[1]), number(value[2])];
	}

	function vectorData(values) {
		return {x: round(values[0]), y: round(values[1]), z: round(values[2])};
	}

	function playModeOf(animation) {
		if (animation && animation.loop === 'loop') return 'LOOP';
		if (animation && animation.loop === 'hold') return 'HOLD';
		return 'ONCE';
	}

	function validPlayMode(value) {
		return value === 'ONCE' || value === 'LOOP' || value === 'HOLD' ? value : null;
	}

	function blockbenchLoop(playMode) {
		return playMode === 'LOOP' ? 'loop' : (playMode === 'HOLD' ? 'hold' : 'once');
	}

	function projectValue(name) {
		return (typeof Project !== 'undefined' && Project) ? Project[name] : undefined;
	}

	function setProjectValue(name, value) {
		if (typeof Project !== 'undefined' && Project) Project[name] = value;
	}

	/* The project name is the single source for the gesture name and file id.
	 * Animation names are never used: renaming an animation must not rename the gesture. */
	function gestureName(animation) {
		const projectName = String(projectValue('name') || '').trim();
		return projectName || 'Gesture';
	}

	/* Readable ASCII slug: Cyrillic names are transliterated instead of becoming underscores. */
	function gestureSlug(value) {
		const map = {
			'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
			'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
			'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
			'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
		};
		return String(value || '').toLowerCase().trim().replace(/[а-яё]/g, function (ch) {
			return map[ch] !== undefined ? map[ch] : '';
		}).replace(/[^a-z0-9_.-]+/g, '_').replace(/^_+|_+$/g, '');
	}

	function gestureId(animation) {
		return safeId(gestureSlug(gestureName(animation)) || 'gesture');
	}

	/* Type is chosen in the project settings, not in the animation panel. */
	function gesturePlayMode(animation) {
		const fromProject = validPlayMode(projectValue('gesturePlayMode'));
		if (fromProject) return fromProject;
		const stored = validPlayMode(getMeta(animation).playMode);
		if (stored) return stored;
		const fromBlockbench = playModeOf(animation);
		if (animation && (animation.loop === 'loop' || animation.loop === 'hold')) return fromBlockbench;
		return validPlayMode(settings.defaultPlayMode) || 'ONCE';
	}

	/* Free parts keep their own vanilla animation in game. The flag lives on the
	 * outliner group, so it is visible next to eye/lock, saved in the .bbmodel
	 * project and written to the exported gesture JSON. */
	function freeParts() {
		if (typeof Group === 'undefined' || !Array.isArray(Group.all)) return [];
		return TRACKS.filter(function (part) {
			/* Hitbox is root motion, never a "free" body part. */
			if (part === HITBOX) return false;
			return Group.all.some(function (group) {
				return !!group[FREE_BUTTON_ID] && partForNode(group) === part;
			});
		});
	}

	function isPartFree(part) {
		return freeParts().indexOf(part) !== -1;
	}

	function setPartFree(part, value) {
		if (typeof Group === 'undefined' || !Array.isArray(Group.all)) return;
		Group.all.forEach(function (group) {
			if (partForNode(group) === part) group[FREE_BUTTON_ID] = !!value;
		});
		if (typeof Project !== 'undefined' && Project) Project.saved = false;
	}

	/* Movement restriction belongs to the whole gesture, so it is a project
	 * setting rather than an outliner toggle. */
	function movementRestricted() {
		const value = projectValue(RESTRICT_PROPERTY);
		return value === true || value === 'true';
	}

	function setMovementRestricted(value) {
		setProjectValue(RESTRICT_PROPERTY, !!value);
		if (typeof Project !== 'undefined' && Project) Project.saved = false;
	}

	/* Stored as text so both "0.5" and numeric JSON values survive a round trip. */
	function iconTimecode() {
		const value = projectValue(ICON_PROPERTY);
		return value === undefined || value === null ? '' : String(value).trim();
	}

	function setIconTimecode(value) {
		setProjectValue(ICON_PROPERTY, String(value === undefined || value === null ? '' : value).trim());
		if (typeof Project !== 'undefined' && Project) Project.saved = false;
	}

	function currentAnimation() {
		if (typeof Animation === 'undefined') return null;
		if (Animation.selected) return Animation.selected;
		return Array.isArray(Animation.all) && Animation.all.length ? Animation.all[0] : null;
	}

	function animationDuration(animation) {
		return Math.max(0.05, number(animation && animation.length) || 1);
	}

	/* Loop region used by the blue timeline strip. Unset means the whole clip.
	 * Both ends are always kept inside the Blockbench animation length. */
	function normalizeLoop(animation, start, end) {
		const duration = animationDuration(animation);
		let a = number(start);
		let b = number(end);
		if (!b || b <= a + 0.0001) return [0, round(duration, 4)];
		a = clamp(a, 0, Math.max(0, duration - 0.05));
		b = clamp(b, a + 0.05, duration);
		return [round(a, 4), round(b, 4)];
	}

	function storedLoop() {
		const raw = projectValue(LOOP_PROPERTY);
		if (typeof raw !== 'string' || !raw) return null;
		const parts = raw.split(',').map(Number);
		return parts.length === 2 && parts.every(isFinite) ? parts : null;
	}

	/* The project value wins: it travels with the file and with backups, while
	 * the localStorage meta only exists on this machine. */
	function loopRange(animation) {
		if (!animation) return [0, 1];
		const project = storedLoop();
		if (project) return normalizeLoop(animation, project[0], project[1]);
		const stored = getMeta(animation);
		return normalizeLoop(animation, stored.loopStart, stored.loopEnd);
	}

	function setTimelineRange(start, end) {
		if (typeof Timeline === 'undefined' || !Timeline.custom_range) return;
		if (typeof Timeline.custom_range.set === 'function') {
			Timeline.custom_range.set(0, start);
			Timeline.custom_range.set(1, end);
		} else {
			Timeline.custom_range[0] = start;
			Timeline.custom_range[1] = end;
		}
	}

	function setLoopRange(animation, start, end, silent) {
		if (!animation) return null;
		const range = normalizeLoop(animation, start, end);
		const a = range[0];
		const b = range[1];
		setMeta(animation, {loopStart: a, loopEnd: b});
		setTimelineRange(a, b);
		if (!silent) {
			if (typeof Project !== 'undefined' && Project) Project.saved = false;
			renderLoopStrip();
			if (typeof updateInterface === 'function') updateInterface();
		}
		return range;
	}

	function loopStripVisible(animation) {
		return !!animation && workspaceActive() && gesturePlayMode(animation) === 'LOOP';
	}

	function syncTimelineRange() {
		const animation = (typeof Animation !== 'undefined') ? Animation.selected : null;
		if (typeof Timeline === 'undefined' || !Timeline.custom_range) return;
		if (!loopStripVisible(animation)) {
			setTimelineRange(0, 0);
			return;
		}
		const range = loopRange(animation);
		setTimelineRange(range[0], range[1]);
	}

	function compileGesture(animation, form) {
		const sign = axisSigns();
		const duration = animationDuration(animation);
		const loop = normalizeLoop(animation, form.loopStart, form.loopEnd);
		const tracks = {};
		TRACKS.forEach(function (part) { tracks[part] = []; });

		const oldTime = Timeline.time;
		const oldLoop = animation.loop;
		animation.loop = 'once';

		try {
			for (const uuid in animation.animators) {
				const animator = animation.animators[uuid];
				if (!animator || !animator.channels) continue;
				const group = animator.getGroup ? animator.getGroup() : null;
				const part = partForNode(group);
				if (!part) continue;

				const rotationKeys = animator.rotation || [];
				const positionKeys = animator.position || [];
				const times = new Set();
				rotationKeys.forEach(function (key) { times.add(round(key.time, 5)); });
				positionKeys.forEach(function (key) { times.add(round(key.time, 5)); });
				if (!times.size) continue;

				for (const time of Array.from(times).sort(function (a, b) { return a - b; })) {
					if (time > duration + 0.0001) continue;
					Timeline.time = Math.min(time, duration);
					const rotation = vector(animator.interpolate('rotation'));
					const position = vector(animator.interpolate('position'));
					tracks[part].push({
						time: round(time),
						pitch: round(rotation[0] * sign.rot[0]),
						yaw: round(rotation[1] * sign.rot[1]),
						roll: round(rotation[2] * sign.rot[2]),
						x: round(position[0] * sign.pos[0] / sign.scale),
						y: round(position[1] * sign.pos[1] / sign.scale),
						z: round(position[2] * sign.pos[2] / sign.scale)
					});
				}
			}
		} finally {
			animation.loop = oldLoop;
			Timeline.time = oldTime;
		}

		TRACKS.forEach(function (part) {
			tracks[part].sort(function (a, b) { return a.time - b.time; });
			tracks[part] = tracks[part].filter(function (key, index, all) {
				return index === 0 || Math.abs(key.time - all[index - 1].time) > 0.00001;
			});
		});

		const playMode = gesturePlayMode(animation);
		return {
			id: gestureId(animation),
			name: gestureName(animation),
			duration: round(duration),
			loop: playMode === 'LOOP',
			holdLastFrame: playMode === 'HOLD',
			loopStart: loop[0],
			loopEnd: loop[1],
			freeParts: freeParts(),
			restrictMovement: movementRestricted(),
			icon: iconTimecode(),
			tracks: tracks
		};
	}

	function keyCount(gesture) {
		return TRACKS.reduce(function (sum, part) {
			return sum + (gesture.tracks[part] ? gesture.tracks[part].length : 0);
		}, 0);
	}

	/* Shared payload for both File → Export → Gesture and Ctrl+S. */
	function gestureExportPayload() {
		const animation = currentAnimation();
		if (!animation) {
			Blockbench.showQuickMessage('Open a gesture project first', 4000);
			return null;
		}
		/* Always name the saved gesture after the project, never after the
		 * animation entry (which can still be called "animation"/"anim"). */
		const projectName = gestureName(animation);
		if (!String(projectValue('name') || '').trim()) setProjectValue('name', projectName);
		if (animation.name !== projectName) animation.name = projectName;
		const range = loopRange(animation);
		const gesture = compileGesture(animation, {loopStart: range[0], loopEnd: range[1]});
		setMeta(animation, {
			id: gesture.id,
			name: gesture.name,
			playMode: gesturePlayMode(animation),
			loopStart: gesture.loopStart,
			loopEnd: gesture.loopEnd
		});
		const options = {
			type: 'Gesture JSON',
			extensions: ['json'],
			name: gesture.id + '.json',
			content: JSON.stringify(gesture, null, 2) + '\n',
			resource_id: 'gestures.gesture'
		};
		if (settings.configDir) options.startpath = settings.configDir;
		return {animation: animation, gesture: gesture, options: options, count: keyCount(gesture)};
	}

	function markGestureSaved(animation, project) {
		if (animation) animation.saved = true;
		const target = project || ((typeof Project !== 'undefined' && Project) ? Project : null);
		if (target) target.saved = true;
	}

	/* Ctrl+S inside a gesture workspace: overwrite the file this gesture was
	 * opened/imported from. If there is no file yet, ask once via save dialog. */
	function saveGestureFile() {
		const payload = gestureExportPayload();
		if (!payload) return;
		const project = Project;
		const stored = gestureFileFor(payload.animation);
		if (stored && stored.path && typeof Blockbench.writeFile === 'function') {
			try {
				Blockbench.writeFile(stored.path, {content: payload.options.content}, function (filePath) {
					rememberGestureFile(payload.animation, filePath || stored.path, payload.options.name, project);
					markGestureSaved(payload.animation, project);
					Blockbench.showQuickMessage('Saved ' + payload.gesture.id + ' (' + payload.count + ' keys) to '
						+ (filePath || stored.path), 4000);
				});
				return;
			} catch (err) {
				/* Folder moved/deleted or file locked: fall back to the save dialog. */
				console.warn('[Gestures] Could not write ' + stored.path, err);
				Blockbench.showQuickMessage('Could not write ' + stored.path + ' - choose a new location', 5000);
			}
		}
		if (typeof Blockbench.exportFile !== 'function') {
			Blockbench.showMessageBox({
				title: 'Save unavailable',
				message: 'This Blockbench build cannot save a gesture file.',
				buttons: ['OK']
			});
			return;
		}
		Blockbench.exportFile(payload.options, function (filePath) {
			if (!filePath) return;
			rememberGestureFile(payload.animation, filePath, payload.options.name, project);
			markGestureSaved(payload.animation, project);
			Blockbench.showQuickMessage('Saved ' + payload.gesture.id + ' (' + payload.count + ' keys) to ' + filePath, 4000);
		});
	}

	/* File → Export → Gesture always opens the native save dialog. */
	function exportGestureFile() {
		const payload = gestureExportPayload();
		if (!payload) return;
		if (typeof Blockbench.exportFile !== 'function') {
			Blockbench.showMessageBox({
				title: 'Export unavailable',
				message: 'This Blockbench build cannot open a save dialog.',
				buttons: ['OK']
			});
			return;
		}
		const project = Project;
		Blockbench.exportFile(payload.options, function (filePath) {
			if (!filePath) return;
			rememberGestureFile(payload.animation, filePath, payload.options.name, project);
			markGestureSaved(payload.animation, project);
			Blockbench.showQuickMessage('Exported ' + payload.gesture.id + ' (' + payload.count + ' keys) to ' + filePath, 5000);
		});
	}

	function importGestureData(data, sourceName) {
		const fileName = String(sourceName || 'gesture.json');
		if (!data || !data.tracks || typeof data.tracks !== 'object') {
			Blockbench.showQuickMessage(fileName + ' is not a gesture animation', 4000);
			return null;
		}

		const sign = axisSigns();
		const playMode = data.holdLastFrame ? 'HOLD' : (data.loop ? 'LOOP' : 'ONCE');
		const duration = Math.max(0.05, number(data.duration) || 1);
		const importedName = String(data.name || fileName.replace(/\.json$/i, ''));

		/* One project = one gesture. Drop the placeholder/old animation before
		 * creating the imported one, so its name does not get a numeric suffix. */
		if (workspaceActive() && Array.isArray(Animation.all)) {
			Animation.all.slice().forEach(function (old) {
				if (typeof old.remove === 'function') old.remove(false, false);
			});
		}
		const animation = new Animation({
			name: importedName,
			length: duration,
			loop: blockbenchLoop(playMode),
			saved: false
		}).add(false);
		setProjectValue('name', importedName);
		setProjectValue('gesturePlayMode', playMode);
		const importedFree = Array.isArray(data.freeParts) ? data.freeParts : [];
		TRACKS.forEach(function (part) {
			setPartFree(part, importedFree.some(function (value) {
				return String(value).toLowerCase() === part.toLowerCase();
			}));
		});
		setMovementRestricted(data.restrictMovement === true);
		setIconTimecode(data.icon);

		const missing = [];
		try {
			Undo.initEdit({animations: [animation], keyframes: []});
			TRACKS.forEach(function (part) {
				const keys = data.tracks[part] || [];
				if (!keys.length) return;
				const group = groupForPart(part);
				if (!group) {
					missing.push(part);
					return;
				}
				const animator = animation.getBoneAnimator(group);
				if (!animator) return;
				keys.slice().sort(function (a, b) { return number(a.time) - number(b.time); }).forEach(function (key) {
					const rotation = [
						number(key.pitch) * sign.rot[0],
						number(key.yaw) * sign.rot[1],
						number(key.roll) * sign.rot[2]
					];
					animator.addKeyframe({
						channel: 'rotation',
						time: round(number(key.time), 5),
						interpolation: 'linear',
						data_points: [vectorData(rotation)]
					});
					/* Every gesture keyframe carries rotation and translation together.
					 * Keep both channels at the same timecodes, including zero values,
					 * otherwise export would extrapolate a later Move key backwards. */
					const position = [
						number(key.x) * sign.pos[0] * sign.scale,
						number(key.y) * sign.pos[1] * sign.scale,
						number(key.z) * sign.pos[2] * sign.scale
					];
					animator.addKeyframe({
						channel: 'position',
						time: round(number(key.time), 5),
						interpolation: 'linear',
						data_points: [vectorData(position)]
					});
				});
				animator.addToTimeline();
			});
			animation.setLength(duration);
			Undo.finishEdit('Import gesture');
		} catch (err) {
			console.error('[Gestures] Import failed', err);
			Blockbench.showMessageBox({
				title: 'Import failed',
				message: String(err && err.message ? err.message : err),
				buttons: ['OK']
			});
			return null;
		}

		animation.createUniqueName();
		const loop = normalizeLoop(animation, data.loopStart, number(data.loopEnd) || duration);
		setMeta(animation, {
			id: gestureId(animation),
			name: gestureName(animation),
			playMode: playMode,
			loopStart: loop[0],
			loopEnd: loop[1]
		});
		if (Modes.animate) animation.select();
		if (typeof Animator !== 'undefined' && Animator.preview) Animator.preview();
		syncTimelineRange();
		renderLoopStrip();
		Blockbench.showQuickMessage('Imported ' + animation.name, 4000);
		if (missing.length) {
			Blockbench.showQuickMessage('No group for: ' + missing.join(', ') + ' — check bone names in Gestures settings', 6000);
		}
		return animation;
	}

	function hasGestureTracks(data) {
		return !!data && typeof data === 'object' && !Array.isArray(data)
			&& !!data.tracks && typeof data.tracks === 'object' && !Array.isArray(data.tracks);
	}

	/* Every opened gesture gets its own project tab, even when the current
	 * project is already a gesture workspace. If the same file is already open
	 * the user can jump to that tab instead of getting a second copy. */
	function openGestureInNewWorkspace(data, fileName, filePath) {
		const openIt = function () {
			if (!createGestureWorkspace()) return;
			const project = Project;
			const animation = importGestureData(data, fileName);
			if (!animation) {
				/* Do not leave an empty rig tab behind after a failed import. */
				try { if (project && typeof project.close === 'function') project.close(true); } catch (err) { /* ignore */ }
				return;
			}
			rememberGestureFile(animation, filePath || null, fileName, project);
			/* The project now equals the file on disk. */
			markGestureSaved(animation, project);
		};
		const existing = findOpenGestureProject(filePath);
		if (!existing) {
			openIt();
			return;
		}
		Blockbench.showMessageBox({
			title: 'Open Gesture',
			message: fileName + ' is already open in another tab.',
			buttons: ['Go to open tab', 'Open another copy', 'Cancel'],
			confirm: 0,
			cancel: 2
		}, function (index) {
			if (index === 0) existing.select();
			else if (index === 1) openIt();
		});
	}

	function isGestureData(data) {
		return !!data && typeof data === 'object' && !Array.isArray(data)
			&& !!data.tracks && typeof data.tracks === 'object' && !Array.isArray(data.tracks)
			&& (typeof data.duration !== 'undefined'
				|| typeof data.loop === 'boolean'
				|| typeof data.holdLastFrame === 'boolean');
	}

	/* File → Open Gesture. Blockbench opens a native folder/file picker, so the
	 * player chooses any gesture JSON themselves. No filesystem permission is
	 * needed: Blockbench reads the file and gives us its text. */
	function openGesture() {
		const importApi = (typeof Blockbench !== 'undefined') &&
			(typeof Blockbench.importFile === 'function' ? Blockbench.importFile :
			 (typeof Blockbench.import === 'function' ? Blockbench.import : null));
		if (!importApi) {
			Blockbench.showMessageBox({
				title: 'Open unavailable',
				message: 'This Blockbench build cannot open a file dialog.',
				buttons: ['OK']
			});
			return;
		}
		const options = {
			resource_id: 'gestures.gesture',
			type: 'Gesture JSON',
			title: 'Open Gesture',
			extensions: ['json'],
			multiple: false
		};
		if (settings.configDir) options.startpath = settings.configDir;
		importApi(options, function (files) {
			const file = files && files[0];
			if (!file) return;
			let data;
			try {
				data = JSON.parse(file.content);
			} catch (err) {
				console.error('[Gestures] Could not parse gesture file', err);
				Blockbench.showMessageBox({
					title: 'Import failed',
					message: (file.name || 'File') + ' is not a valid gesture JSON: '
						+ (err && err.message ? err.message : err),
					buttons: ['OK']
				});
				return;
			}
			if (!hasGestureTracks(data)) {
				Blockbench.showMessageBox({
					title: 'Open Gesture',
					message: (file.name || 'File') + ' is not a gesture animation (no "tracks" object).',
					buttons: ['OK']
				});
				return;
			}
			openGestureInNewWorkspace(data, file.name || 'gesture.json', filePathOf(file) || file.path || null);
		});
	}

	/* Drag & drop a gesture JSON anywhere into Blockbench. We read the dropped
	 * file first: if it is a gesture we open it here, otherwise the event is
	 * replayed so Blockbench's own model/texture drop handlers still work. */
	function readDroppedText(file) {
		if (typeof file.text === 'function') return file.text();
		return new Promise(function (resolve, reject) {
			const reader = new FileReader();
			reader.onload = function () { resolve(String(reader.result || '')); };
			reader.onerror = function () { reject(reader.error || new Error('Could not read dropped file')); };
			reader.readAsText(file);
		});
	}

	function replayDropEvent(original) {
		let replay;
		const init = {bubbles: true, cancelable: true, dataTransfer: original.dataTransfer};
		try {
			replay = typeof DragEvent === 'function' ? new DragEvent('drop', init) : new Event('drop', init);
			if (typeof replay.dataTransfer === 'undefined') {
				Object.defineProperty(replay, 'dataTransfer', {value: original.dataTransfer});
			}
		} catch (err) {
			replay = document.createEvent('Event');
			replay.initEvent('drop', true, true);
			Object.defineProperty(replay, 'dataTransfer', {value: original.dataTransfer});
		}
		replayingDrop = true;
		try {
			document.body.dispatchEvent(replay);
		} finally {
			replayingDrop = false;
		}
	}

	function installGestureDropHandler() {
		if (typeof document === 'undefined' || gestureDropHandler) return;
		gestureDropHandler = function (event) {
			if (replayingDrop || !event.dataTransfer || !event.dataTransfer.files || !event.dataTransfer.files.length) return;
			const files = Array.prototype.slice.call(event.dataTransfer.files);
			const file = files.find(function (item) { return item && /\.json$/i.test(item.name || ''); });
			if (!file) return;
			const dataTransfer = event.dataTransfer;
			event.preventDefault();
			event.stopImmediatePropagation();
			readDroppedText(file).then(function (text) {
				let data = null;
				try {
					data = JSON.parse(text);
				} catch (err) {
					data = null;
				}
				if (!isGestureData(data)) {
					replayDropEvent({dataTransfer: dataTransfer});
					return;
				}
				openGestureInNewWorkspace(data, file.name || 'gesture.json', filePathOf(file) || null);
			}).catch(function (err) {
				console.error('[Gestures] Could not read dropped file', err);
				replayDropEvent({dataTransfer: dataTransfer});
			});
		};
		document.addEventListener('drop', gestureDropHandler, true);
	}

	function removeGestureDropHandler() {
		if (!gestureDropHandler || typeof document === 'undefined') return;
		document.removeEventListener('drop', gestureDropHandler, true);
		gestureDropHandler = null;
	}

	function signValue(value) {
		return number(value) < 0 ? -1 : 1;
	}

	/* Settings live on the plugin's own page in Blockbench (Plugins → Gestures
	 * Animator → Settings), next to About/Details/Features. Registering them
	 * with `plugin` is what puts them on that tab. */
	function applySettingValue(key, value, silent) {
		if (key === 'bones') {
			let bones;
			try {
				bones = JSON.parse(value);
			} catch (err) {
				if (!silent) Blockbench.showQuickMessage('Bone groups must be valid JSON', 5000);
				return;
			}
			if (!bones || typeof bones !== 'object') {
				if (!silent) Blockbench.showQuickMessage('Bone groups must be a JSON object', 5000);
				return;
			}
			settings.bones = bones;
			TRACKS.forEach(function (part) {
				if (!Array.isArray(settings.bones[part])) settings.bones[part] = DEFAULT_BONES[part].slice();
			});
		} else if (key === 'posScale') {
			settings.posScale = Math.max(1, number(value) || 16);
		} else if (key === 'defaultPlayMode') {
			settings.defaultPlayMode = validPlayMode(value) || 'ONCE';
		} else if (['rotX', 'rotY', 'rotZ', 'posX', 'posY', 'posZ'].includes(key)) {
			settings[key] = signValue(value);
		} else {
			settings[key] = String(value === undefined || value === null ? '' : value).trim();
		}
		saveSettings();
	}

	function registerPluginSettings() {
		if (typeof Setting === 'undefined') return;
		const modes = {ONCE: 'play once', LOOP: 'loop', HOLD: 'hold on last frame'};
		const signs = {'-1': '-1 (invert)', 1: '1'};
		const defs = [
			{key: 'configDir', type: 'text', name: 'Game config/gestures/animations folder',
				description: 'Used as the starting folder of the save dialog and for gesture import.', value: settings.configDir},
			{key: 'vanillaJar', type: 'text', name: 'Minecraft client .jar (optional)',
				description: 'Used to find vanilla parent models and textures for slot previews. Empty = newest jar in .minecraft/versions.', value: settings.vanillaJar || ''},
			{key: 'assetsDirs', type: 'text', name: 'Resource folders for slot previews (optional)',
				description: 'Mod resources or resource pack folders (the folder that contains "assets", or the assets folder itself), one per line. Used to find item textures that are not in the vanilla jar.', value: settings.assetsDirs || ''},
			{key: 'defaultPlayMode', type: 'select', name: 'Default play mode',
				description: 'Type used for new gesture projects.', value: settings.defaultPlayMode || 'ONCE', options: modes},
			{key: 'posScale', type: 'number', name: 'Model units per block',
				description: 'Usually 16 for Minecraft models.', value: settings.posScale, min: 1, max: 64, step: 1},
			{key: 'rotX', type: 'select', name: 'pitch sign (X)', description: 'Rotation sign for the X axis (pitch = -X by default).', value: String(signValue(settings.rotX)), options: signs},
			{key: 'rotY', type: 'select', name: 'yaw sign (Y)', description: 'Rotation sign for the Y axis (yaw = -Y by default).', value: String(signValue(settings.rotY)), options: signs},
			{key: 'rotZ', type: 'select', name: 'roll sign (Z)', description: 'Rotation sign for the Z axis (roll = Z by default).', value: String(signValue(settings.rotZ)), options: signs},
			{key: 'posX', type: 'select', name: 'x sign', description: 'Translation sign for X.', value: String(signValue(settings.posX)), options: signs},
			{key: 'posY', type: 'select', name: 'y sign', description: 'Translation sign for Y.', value: String(signValue(settings.posY)), options: signs},
			{key: 'posZ', type: 'select', name: 'z sign', description: 'Translation sign for Z.', value: String(signValue(settings.posZ)), options: signs},
			{key: 'bones', type: 'text', name: 'Bone groups (JSON)',
				description: 'Group names mapped to the six animated body parts (case-insensitive).',
				value: JSON.stringify(settings.bones, null, 2)}
		];
		defs.forEach(function (def) {
			const setting = new Setting(PLUGIN_ID + '.' + def.key, {
				name: def.name,
				description: def.description || '',
				/* Keep these out of the global Preferences → Settings dialog. */
				category: PLUGIN_ID,
				plugin: PLUGIN_ID,
				type: def.type,
				value: def.value,
				options: def.options,
				min: def.min,
				max: def.max,
				step: def.step,
				onChange: function (value) { applySettingValue(def.key, value, false); }
			});
			pluginSettings.push(setting);
		});
		pluginSettings.forEach(function (setting) {
			applySettingValue(setting.id.slice(PLUGIN_ID.length + 1), setting.value, true);
		});
	}

	function unregisterPluginSettings() {
		pluginSettings.forEach(function (setting) {
			if (setting && typeof setting.delete === 'function') setting.delete();
		});
		pluginSettings = [];
	}

	/* File → New builds its children from a function, so MenuBar.addAction
	 * cannot descend into it. Wrap that function once to place our action there. */
	function installNewWorkspaceAction(action) {
		if (typeof MenuBar === 'undefined' || !MenuBar.menus || !MenuBar.menus.file) return false;
		const fileMenu = MenuBar.menus.file;
		const structure = Array.isArray(fileMenu.structure) ? fileMenu.structure : fileMenu.children;
		if (!Array.isArray(structure)) return false;
		const owner = structure.find(function (item) { return item && item.id === 'new'; });
		if (!owner) return false;
		newMenuOwner = owner;
		newMenuOriginalChildren = owner.children;
		owner.children = function () {
			let items = [];
			if (typeof newMenuOriginalChildren === 'function') items = newMenuOriginalChildren.call(this) || [];
			else if (Array.isArray(newMenuOriginalChildren)) items = newMenuOriginalChildren.slice();
			/* A plugin reload can leave an older copy of the action behind. */
			items = items.filter(function (item) { return !item || item.id !== action.id; });
			items.unshift(action);
			return items;
		};
		newMenuPatched = true;
		if (Array.isArray(action.menus)) action.menus.push({menu: fileMenu, path: 'new'});
		return true;
	}

	function restoreNewWorkspaceAction() {
		if (newMenuPatched && newMenuOwner) newMenuOwner.children = newMenuOriginalChildren;
		newMenuOwner = null;
		newMenuOriginalChildren = null;
		newMenuPatched = false;
	}

	/* Place Open Gesture directly below Open Model in the File menu. */
	function installOpenGestureAction(action) {
		if (typeof MenuBar === 'undefined' || !MenuBar.menus || !MenuBar.menus.file) return false;
		const fileMenu = MenuBar.menus.file;
		const structure = Array.isArray(fileMenu.structure) ? fileMenu.structure : fileMenu.children;
		if (!Array.isArray(structure)) return false;
		for (let i = structure.length - 1; i >= 0; i--) {
			if (structure[i] && structure[i].id === action.id) structure.splice(i, 1);
		}
		/* Stock menu entries can be plain action-id strings, not objects. */
		const anchor = structure.findIndex(function (item) {
			return item === 'open_model' || (item && item.id === 'open_model');
		});
		if (anchor === -1) return false;
		structure.splice(anchor + 1, 0, action);
		openGestureOwner = structure;
		openGesturePlaced = true;
		if (Array.isArray(action.menus)) action.menus.push({menu: fileMenu, path: ''});
		return true;
	}

	function restoreOpenGestureAction() {
		if (!openGesturePlaced || !openGestureOwner) return;
		for (let i = openGestureOwner.length - 1; i >= 0; i--) {
			if (openGestureOwner[i] && openGestureOwner[i].id === PLUGIN_ID + '.import') {
				openGestureOwner.splice(i, 1);
			}
		}
		openGestureOwner = null;
		openGesturePlaced = false;
	}

	/* ----------------------------------------------------------------------
	 * Dedicated workspace (project format + player rig + animation mode)
	 * -------------------------------------------------------------------- */

	function workspaceActive() {
		return typeof Format !== 'undefined' && !!Format && Format.id === FORMAT_ID;
	}

	/* Open Gesture always starts a fresh gesture project (a new tab), like
	 * Open Model does. It never reuses or overwrites the project that is
	 * currently open, whatever its format. */
	function createGestureWorkspace() {
		const fail = function () {
			Blockbench.showMessageBox({
				title: 'Gesture workspace unavailable',
				message: 'This Blockbench build cannot create a gesture workspace.',
				buttons: ['OK']
			});
			return false;
		};
		const format = registerWorkspace();
		if (!format || typeof newProject !== 'function') return fail();
		newProject(format);
		if (!workspaceActive()) return fail();
		if (typeof Modes !== 'undefined' && Modes.options && Modes.options.animate) {
			Modes.options.animate.select();
		}
		if (typeof Animation !== 'undefined' && !Animation.all.length) {
			createDefaultAnimation();
		}
		installProjectDialogOverride();
		installSaveOverride();
		return true;
	}

	function addPlayerTexture() {
		if (typeof Texture === 'undefined') return null;
		let texture = null;
		try {
			texture = new Texture({name: 'player_skin', uv_width: 64, uv_height: 64}).add(false);
			/* The skin is embedded, so the rig is textured synchronously even
			 * when file:// fetches of assets/player_skin.png are blocked. */
			if (typeof texture.fromDataURL === 'function') {
				texture.fromDataURL(PLAYER_SKIN_DATA_URL);
			}
			texture.uv_width = 64;
			texture.uv_height = 64;
			if (typeof texture.update === 'function') texture.update();
		} catch (err) {
			console.error('[Gestures] Could not create player texture', err);
			return null;
		}
		return texture;
	}

	/* Box UV divides face coordinates by Project.texture_width/height.
	 * Without this, Blockbench's 16x16 default wraps all 64x64 skin
	 * offsets and produces the striped/stretched texture. Called both for
	 * new rigs and when an older gesture project is activated. */
	function ensureProjectTextureSize() {
		if (typeof Project !== 'undefined' && Project) {
			Project.texture_width = 64;
			Project.texture_height = 64;
			Project.box_uv = true;
		}
	}

	/* Blockbench cubes have no opacity property. A dedicated texture whose
	 * pixels have a low alpha does work: Texture's shader material is already
	 * transparent and blends the alpha from the sampled pixel. */
	function translucentTextureDataUrl(rgba) {
		if (typeof document === 'undefined') return '';
		try {
			const canvas = document.createElement('canvas');
			canvas.width = canvas.height = 1;
			const ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, 1, 1);
			ctx.fillStyle = 'rgba(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ','
				+ (rgba[3] / 255) + ')';
			ctx.fillRect(0, 0, 1, 1);
			return canvas.toDataURL('image/png');
		} catch (err) {
			console.warn('[Gestures] Could not create a guide texture', err);
			return '';
		}
	}

	function guideTexture(spec) {
		if (typeof Texture === 'undefined') return null;
		const all = Texture.all || [];
		let texture = all.find(function (item) { return item.name === spec.name; });
		if (!texture) {
			const dataUrl = translucentTextureDataUrl(spec.rgba);
			if (!dataUrl) return null;
			try {
				texture = new Texture({name: spec.name, uv_width: 16, uv_height: 16});
				texture.fromDataURL(dataUrl).add(false);
			} catch (err) {
				console.warn('[Gestures] Could not add a guide texture', err);
				return null;
			}
		}
		texture.render_mode = 'default';
		texture.wrap_mode = 'clamp';
		texture.uv_width = 16;
		texture.uv_height = 16;
		texture.force_translucent = true;
		texture.show_icon = false;
		/* Generated in memory: never ask the user to save these guides. */
		texture.saved = true;
		if (texture.material) {
			texture.material.transparent = true;
			/* Do not let the translucent box occlude itself. */
			texture.material.depthWrite = false;
			if (typeof THREE !== 'undefined' && THREE.NormalBlending !== undefined) {
				texture.material.blending = THREE.NormalBlending;
			}
			texture.material.needsUpdate = true;
		}
		return texture;
	}

	function assignGuideTexture(cube, texture) {
		if (!cube || !texture || !cube.faces) return;
		Object.keys(cube.faces).forEach(function (face) {
			cube.faces[face].texture = texture.uuid;
		});
		if (cube.preview_controller && typeof cube.preview_controller.updateFaces === 'function') {
			cube.preview_controller.updateFaces(cube);
		}
		if (cube.preview_controller && typeof cube.preview_controller.updateUV === 'function') {
			cube.preview_controller.updateUV(cube);
		}
	}

	function setCubeBounds(cube, from, to) {
		if (!cube) return;
		const same = function (a, b) {
			return a && a.length === b.length && a.every(function (value, index) {
				return Math.abs(value - b[index]) < 0.00001;
			});
		};
		if (same(cube.from, from) && same(cube.to, to)) return;
		cube.from = from.slice();
		cube.to = to.slice();
		if (cube.preview_controller && typeof cube.preview_controller.updateGeometry === 'function') {
			cube.preview_controller.updateGeometry(cube);
		}
	}

	/* The guide alpha only works in Blockbench's textured view. */
	function ensureTexturedView() {
		if (typeof BarItems === 'undefined' || !BarItems.view_mode) return;
		const selector = BarItems.view_mode;
		if (!selector.options || !selector.options.textured || selector.value === 'textured') return;
		selector.set('textured');
		if (typeof selector.onChange === 'function') selector.onChange(selector, null);
	}

	/* Applied to a newly created rig and to gesture projects opened by the
	 * plugin, so older files with the old opaque hitbox get fixed as well. */
	function ensureHitboxAppearance() {
		if (typeof Cube === 'undefined' || !Array.isArray(Cube.all)) return;
		ensureTexturedView();
		const bodyTexture = guideTexture(GUIDE_TEXTURES.body);
		const gazeTexture = guideTexture(GUIDE_TEXTURES.gaze);
		const guides = [];
		Cube.all.forEach(function (cube) {
			if (cube.name === 'hitbox_body') {
				setCubeBounds(cube, HITBOX_BODY_FROM, HITBOX_BODY_TO);
				assignGuideTexture(cube, bodyTexture);
				guides.push(cube);
			} else if (cube.name === 'hitbox_gaze_line') {
				assignGuideTexture(cube, gazeTexture);
				guides.push(cube);
			}
		});
		if (guides.length && typeof Canvas !== 'undefined' && Canvas.updateView) {
			Canvas.updateView({elements: guides, element_aspects: {faces: true, uv: true, geometry: true}});
		}
	}

	function createPlayerRig() {
		if (typeof Group === 'undefined' || typeof Cube === 'undefined') return;
		if (Group.all.length || Cube.all.length) return;
		ensureProjectTextureSize();
		const texture = addPlayerTexture();
		const groups = {};
		/* Transparent root group. Every animated part is parented to it, so
		 * moving/rotating the hitbox in the editor carries the whole player. */
		const hitbox = new Group({name: HITBOX, origin: [0, 0, 0]}).init().addTo();
		PLAYER_RIG.forEach(function (spec) {
			const group = new Group({name: spec.part, origin: spec.origin.slice()}).init().addTo(hitbox);
			const cube = new Cube({
				name: spec.part,
				from: spec.from.slice(),
				to: spec.to.slice(),
				origin: spec.origin.slice(),
				box_uv: true,
				uv_offset: spec.uv.slice()
			}).init().addTo(group);
			if (texture && typeof cube.applyTexture === 'function') {
				cube.applyTexture(texture, true);
			} else if (texture && cube.faces) {
				Object.keys(cube.faces).forEach(function (face) { cube.faces[face].texture = texture.uuid; });
				if (cube.preview_controller && typeof cube.preview_controller.updateUV === 'function') {
					cube.preview_controller.updateUV(cube);
				}
			}
			groups[spec.part] = group;
		});
		/* Empty animatable groups act as the six item/armour slot points. */
		SLOTS.forEach(function (slot) {
			const parent = groups[SLOT_PARENT[slot]];
			const group = new Group({
				name: slot,
				origin: SLOT_POSITION[slot].slice()
			}).init().addTo(parent || undefined);
			groups[slot] = group;
		});
		/* Transparent root box + a thin forward line. The group is animated like
		 * any other bone, but its track means root motion in the game instead of
		 * a body-part pose. The line marks the gaze direction (model -Z). */
		new Cube({
			name: 'hitbox_body',
			from: HITBOX_BODY_FROM.slice(), to: HITBOX_BODY_TO.slice(),
			origin: [0, 0, 0],
			color: 6
		}).init().addTo(hitbox);
		new Cube({
			name: 'hitbox_gaze_line',
			from: GAZE_LINE_FROM.slice(), to: GAZE_LINE_TO.slice(),
			origin: [0, 28, 0],
			color: 4
		}).init().addTo(hitbox);
		groups[HITBOX] = hitbox;
		Group.all.forEach(function (group) {
			if (group[FREE_BUTTON_ID] === undefined) group[FREE_BUTTON_ID] = false;
		});
		ensureHitboxAppearance();
		if (typeof Canvas !== 'undefined' && Canvas.updateAll) Canvas.updateAll();
		return groups;
	}

	/* --- SLOTS panel and item-model previews ------------------------------- */

	const SLOT_LABELS = {
		helmet_slot: 'Helmet',
		chestplate_slot: 'Chestplate',
		leggings_slot: 'Leggings',
		boots_slot: 'Boots',
		left_arm_slot: 'Left hand',
		right_arm_slot: 'Right hand'
	};
	/* Slot previews, selected models and textures belong to one project: every
	 * gesture tab has its own set, so tabs never touch each other's scene. */
	function slotStore(project) {
		const target = project || ((typeof Project !== 'undefined' && Project) ? Project : null);
		const key = target && target.uuid ? target.uuid : '_none';
		if (!slotStores[key]) {
			slotStores[key] = {previews: {}, textures: {}, entries: {}, overrides: {}, tiles: {}};
		}
		return slotStores[key];
	}
	/* Last model selection and the manually uploaded texture(s) per slot.
	 * Texture overrides are editor-only and never written to the gesture JSON. */
	let slotsPanel = null;

	function shortName(path) {
		return String(path || '').split(':').pop().split('/').pop().replace(/\.json$/i, '');
	}

	/* File.path was removed from newer Electron builds; webUtils replaces it. */
	function filePathOf(file) {
		if (file && file.path) return file.path;
		try {
			const electron = nodeModule('electron');
			if (electron && electron.webUtils && typeof electron.webUtils.getPathForFile === 'function') {
				return electron.webUtils.getPathForFile(file) || '';
			}
		} catch (err) { /* not available */ }
		return '';
	}

	function baseKey(name) {
		return String(name || '').split(':').pop().split('/').pop().replace(/\.(json|png)$/i, '').toLowerCase();
	}

	function readSlotFiles(files) {
		return Promise.all(Array.from(files || []).map(function (file) {
			return new Promise(function (resolve, reject) {
				const reader = new FileReader();
				const isPng = /\.png$/i.test(file.name);
				reader.onload = function () {
					resolve({name: file.name, path: filePathOf(file), content: String(reader.result),
						isPng: isPng, isJson: /\.json$/i.test(file.name)});
				};
				reader.onerror = reject;
				if (isPng) reader.readAsDataURL(file);
				else reader.readAsText(file);
			});
		}));
	}

	/* Manually uploaded PNGs win over resource folders and the vanilla jar.
	 * A file whose name matches the model's texture path is used for that path;
	 * the remaining files are assigned to the remaining paths in order. */
	function textureOverrideMap(paths, overrides) {
		const map = new Map();
		const list = Array.isArray(overrides) ? overrides.filter(function (entry) {
			return entry && entry.isPng && entry.content;
		}) : [];
		const byName = new Map();
		list.forEach(function (entry) {
			const key = baseKey(entry.name);
			if (!byName.has(key)) byName.set(key, entry.content);
		});
		const used = new Set();
		paths.forEach(function (path) {
			const key = baseKey(path);
			if (byName.has(key) && !used.has(key)) {
				map.set(path, byName.get(key));
				used.add(key);
			}
		});
		let index = 0;
		paths.forEach(function (path) {
			if (map.has(path)) return;
			while (index < list.length && used.has(baseKey(list[index].name))) index++;
			if (index < list.length) {
				map.set(path, list[index].content);
				used.add(baseKey(list[index].name));
				index++;
			}
		});
		return map;
	}

	/* ---- Minecraft model format -------------------------------------------
	 * Model JSON: parent, display, textures, elements, gui_light, texture_size,
	 * ambientocclusion (+ legacy overrides). Elements: from, to, rotation
	 * ({axis, angle, origin, rescale} or, since 1.21.11, {x, y, z, origin}),
	 * shade, light_emission, faces{down,up,north,south,west,east}{uv, texture,
	 * cullface, rotation, tintindex}. Texture slots are "ns:path" strings,
	 * "#slot" references, or (26.1+) {sprite, force_translucent} objects.
	 * Item definitions (assets/<ns>/items/<id>.json, 1.21.4+) pick a model via
	 * model / composite / condition / select / range_dispatch / special / empty. */

	/* Minecraft reads model files with a lenient parser: BOM, comments and
	 * trailing commas are accepted there, so they are accepted here too. */
	function parseLenientJson(text) {
		const src = String(text || '').replace(/^\uFEFF/, '');
		try {
			return JSON.parse(src);
		} catch (err) { /* fall through to the lenient pass */ }
		let out = '';
		let inString = false;
		let i = 0;
		while (i < src.length) {
			const ch = src[i];
			const next = src[i + 1];
			if (inString) {
				out += ch;
				if (ch === '\\') { out += next || ''; i += 2; continue; }
				if (ch === '"') inString = false;
				i++;
				continue;
			}
			if (ch === '"') { inString = true; out += ch; i++; continue; }
			if (ch === '/' && next === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
			if (ch === '/' && next === '*') {
				i += 2;
				while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
				i += 2;
				continue;
			}
			out += ch;
			i++;
		}
		return JSON.parse(out.replace(/,(\s*[}\]])/g, '$1'));
	}

	function splitLoc(value) {
		const text = String(value || '');
		const index = text.indexOf(':');
		return index >= 0
			? {ns: text.slice(0, index) || 'minecraft', path: text.slice(index + 1)}
			: {ns: 'minecraft', path: text};
	}

	/* Vanilla parents are normally read from the game jar. These copies are the
	 * fallback when no jar is found, so the common cases still open. */
	const DIR6 = ['down', 'up', 'north', 'south', 'west', 'east'];
	const HAND = function (rotation, translation, scale) {
		return {rotation: rotation, translation: translation, scale: [scale, scale, scale]};
	};
	function cubeFaces(slots, extra) {
		const faces = {};
		DIR6.forEach(function (dir) {
			faces[dir] = Object.assign({texture: '#' + slots[dir], cullface: dir}, extra && extra[dir]);
		});
		return faces;
	}
	function allSlots(value) {
		const slots = {};
		DIR6.forEach(function (dir) { slots[dir] = value; });
		return slots;
	}
	const SIDE_UV_SLAB = {north: {uv: [0, 8, 16, 16]}, south: {uv: [0, 8, 16, 16]}, west: {uv: [0, 8, 16, 16]}, east: {uv: [0, 8, 16, 16]}};
	const SIDE_UV_SLAB_TOP = {north: {uv: [0, 0, 16, 8]}, south: {uv: [0, 0, 16, 8]}, west: {uv: [0, 0, 16, 8]}, east: {uv: [0, 0, 16, 8]}};
	const CROSS_ELEMENTS = [
		{from: [0.8, 0, 8], to: [15.2, 16, 8], rotation: {origin: [8, 8, 8], axis: 'y', angle: 45, rescale: true}, shade: false,
			faces: {north: {uv: [0, 0, 16, 16], texture: '#cross'}, south: {uv: [0, 0, 16, 16], texture: '#cross'}}},
		{from: [8, 0, 0.8], to: [8, 16, 15.2], rotation: {origin: [8, 8, 8], axis: 'y', angle: 45, rescale: true}, shade: false,
			faces: {west: {uv: [0, 0, 16, 16], texture: '#cross'}, east: {uv: [0, 0, 16, 16], texture: '#cross'}}}
	];
	const BUILTIN_MODELS = {
		'block/block': {
			display: {
				gui: HAND([30, 225, 0], [0, 0, 0], 0.625),
				ground: HAND([0, 0, 0], [0, 3, 0], 0.25),
				fixed: HAND([0, 0, 0], [0, 0, 0], 0.5),
				thirdperson_righthand: HAND([75, 45, 0], [0, 2.5, 0], 0.375),
				firstperson_righthand: HAND([0, 45, 0], [0, 0, 0], 0.4),
				firstperson_lefthand: HAND([0, 225, 0], [0, 0, 0], 0.4)
			}
		},
		'block/cube': {
			parent: 'minecraft:block/block', textures: {particle: '#down'},
			elements: [{from: [0, 0, 0], to: [16, 16, 16], faces: cubeFaces({down: 'down', up: 'up', north: 'north', south: 'south', west: 'west', east: 'east'})}]
		},
		'block/cube_all': {parent: 'minecraft:block/cube', textures: Object.assign({particle: '#all'}, allSlots('#all'))},
		'block/cube_column': {
			parent: 'minecraft:block/cube',
			textures: {particle: '#side', down: '#end', up: '#end', north: '#side', south: '#side', west: '#side', east: '#side'}
		},
		'block/cube_bottom_top': {
			parent: 'minecraft:block/cube',
			textures: {particle: '#side', down: '#bottom', up: '#top', north: '#side', south: '#side', west: '#side', east: '#side'}
		},
		'block/cube_top': {
			parent: 'minecraft:block/cube',
			textures: {particle: '#side', down: '#side', up: '#top', north: '#side', south: '#side', west: '#side', east: '#side'}
		},
		'block/orientable': {
			parent: 'minecraft:block/block', textures: {particle: '#front'},
			elements: [{from: [0, 0, 0], to: [16, 16, 16], faces: cubeFaces({down: 'top', up: 'top', north: 'front', south: 'side', west: 'side', east: 'side'})}]
		},
		'block/cross': {parent: 'minecraft:block/block', textures: {particle: '#cross'}, elements: CROSS_ELEMENTS},
		'block/tinted_cross': {parent: 'minecraft:block/block', textures: {particle: '#cross'}, elements: CROSS_ELEMENTS},
		'block/slab': {
			parent: 'minecraft:block/block',
			elements: [{from: [0, 0, 0], to: [16, 8, 16], faces: cubeFaces({down: 'bottom', up: 'top', north: 'side', south: 'side', west: 'side', east: 'side'}, SIDE_UV_SLAB)}]
		},
		'block/slab_top': {
			parent: 'minecraft:block/block',
			elements: [{from: [0, 8, 0], to: [16, 16, 16], faces: cubeFaces({down: 'bottom', up: 'top', north: 'side', south: 'side', west: 'side', east: 'side'}, SIDE_UV_SLAB_TOP)}]
		},
		'item/generated': {
			parent: 'builtin/generated', gui_light: 'front',
			display: {
				ground: HAND([0, 0, 0], [0, 2, 0], 0.5),
				head: HAND([0, 180, 0], [0, 13, 7], 1),
				fixed: HAND([0, 180, 0], [0, 0, 0], 1),
				thirdperson_righthand: HAND([0, 0, 0], [0, 3, 1], 0.55),
				thirdperson_lefthand: HAND([0, 0, 0], [0, 3, 1], 0.55),
				firstperson_righthand: HAND([0, -90, 25], [1.13, 3.2, 1.13], 0.68),
				firstperson_lefthand: HAND([0, 90, -25], [1.13, 3.2, 1.13], 0.68)
			}
		},
		'item/handheld': {
			parent: 'minecraft:item/generated',
			display: {
				thirdperson_righthand: HAND([0, -90, 55], [0, 4, 0.5], 0.85),
				thirdperson_lefthand: HAND([0, 90, -55], [0, 4, 0.5], 0.85),
				firstperson_righthand: HAND([0, -90, 25], [1.13, 3.2, 1.13], 0.68),
				firstperson_lefthand: HAND([0, 90, -25], [1.13, 3.2, 1.13], 0.68)
			}
		},
		'item/handheld_rod': {
			parent: 'minecraft:item/generated',
			display: {
				thirdperson_righthand: HAND([0, 90, 55], [0, 4, 0.5], 0.85),
				thirdperson_lefthand: HAND([0, -90, -55], [0, 4, 0.5], 0.85),
				firstperson_righthand: HAND([0, 90, 25], [1.13, 3.2, 1.13], 0.68),
				firstperson_lefthand: HAND([0, -90, -25], [1.13, 3.2, 1.13], 0.68)
			}
		}
	};
	BUILTIN_MODELS['item/handheld_mace'] = BUILTIN_MODELS['item/handheld'];

	/* If an item points the wrong way in the hand, flip a sign here. */
	const DISPLAY_ROT_SIGN = [1, 1, 1];

	function isItemDefinition(data) {
		return !!data && typeof data === 'object' && data.model !== undefined
			&& data.parent === undefined && data.elements === undefined && data.textures === undefined;
	}

	/* Collect the model ids an item definition renders. composite renders all
	 * of its models; condition/select/range_dispatch use their default branch. */
	function definitionModelIds(node, out, depth) {
		if (!node || depth > 24) return out;
		if (typeof node === 'string') { out.push(node); return out; }
		if (typeof node !== 'object') return out;
		if (typeof node.model === 'string') { out.push(node.model); return out; }
		const type = String(node.type || '').replace(/^minecraft:/, '');
		const recurse = function (child) { definitionModelIds(child, out, depth + 1); };
		if (type === 'composite') {
			(node.models || []).forEach(recurse);
		} else if (type === 'condition') {
			recurse(node.on_false || node.on_true);
		} else if (type === 'select') {
			const first = (node.cases || []).find(function (c) { return c && c.model; });
			recurse(node.fallback || (first && first.model));
		} else if (type === 'range_dispatch') {
			const first = (node.entries || []).find(function (e) { return e && e.model; });
			recurse(node.fallback || (first && first.model));
		} else if (type === 'special') {
			if (typeof node.base === 'string') out.push(node.base);
		} else if (node.model && typeof node.model === 'object') {
			recurse(node.model);
		} else {
			recurse(node.fallback);
		}
		return out;
	}

	function pickModelJson(list) {
		return (list || []).find(function (data) { return !isItemDefinition(data); }) || null;
	}

	function normalizedTextures(textures) {
		const out = {};
		Object.keys(textures || {}).forEach(function (slot) {
			const value = textures[slot];
			if (typeof value === 'string') out[slot] = value;
			else if (value && typeof value.sprite === 'string') out[slot] = value.sprite;
		});
		return out;
	}

	/* parent chain -> one merged model. Child fields override parent fields. */
	async function resolveModelData(resolver, data, seen, notes) {
		if (!data || typeof data !== 'object') return {};
		let parent = {};
		const parentId = typeof data.parent === 'string' ? data.parent : '';
		if (parentId) {
			const loc = splitLoc(parentId);
			const key = loc.ns + ':' + loc.path;
			if (loc.path === 'builtin/generated') parent = {generated: true};
			else if (loc.path === 'builtin/entity') parent = {entity: true};
			else if (loc.path === 'builtin/missing') parent = {};
			else if (seen.includes(key)) notes.push('parent loop at ' + key);
			else {
				const parentData = await resolver.getModel(parentId);
				if (parentData) parent = await resolveModelData(resolver, parentData, seen.concat(key), notes);
				else notes.push('parent model not found: ' + parentId);
			}
		}
		const elements = Array.isArray(data.elements) ? data.elements : parent.elements;
		return {
			generated: !elements && !!parent.generated,
			entity: !elements && !!parent.entity,
			textures: Object.assign({}, parent.textures, normalizedTextures(data.textures)),
			display: Object.assign({}, parent.display, data.display),
			elements: elements,
			textureSize: Array.isArray(data.texture_size) ? data.texture_size : parent.textureSize
		};
	}

	function resolveTextureRef(model, ref) {
		let value = String(ref || '');
		for (let guard = 0; value.charAt(0) === '#' && guard < 16; guard++) {
			value = String((model.textures || {})[value.slice(1)] || '');
		}
		return value.charAt(0) === '#' ? '' : value;
	}

	function modelElements(model) {
		if (model.elements && model.elements.length) return model.elements;
		if (!model.generated) return [];
		/* item/generated: one flat sprite per layerN texture. */
		const list = [];
		for (let i = 0; i < 5; i++) {
			const key = 'layer' + i;
			if (!(model.textures || {})[key]) continue;
			list.push({
				from: [0, 0, 7.5], to: [16, 16, 8.5],
				faces: {
					north: {uv: [0, 0, 16, 16], texture: '#' + key},
					south: {uv: [0, 0, 16, 16], texture: '#' + key}
				}
			});
		}
		return list;
	}

	/* Element rotation: legacy {axis, angle} or multi-axis {x, y, z} (1.21.11+). */
	function elementRotation(rot) {
		if (!rot || typeof rot !== 'object') return null;
		const origin = Array.isArray(rot.origin) ? rot.origin : [8, 8, 8];
		let angles = [0, 0, 0];
		if (rot.axis) {
			const axis = String(rot.axis).toLowerCase();
			angles[axis === 'x' ? 0 : (axis === 'y' ? 1 : 2)] = number(rot.angle);
		} else if (Array.isArray(rot)) {
			angles = [number(rot[0]), number(rot[1]), number(rot[2])];
		} else {
			angles = [number(rot.x), number(rot.y), number(rot.z)];
		}
		return {origin: origin, angles: angles};
	}

	/* Minecraft's default face UVs (0..16 space) when an element omits "uv". */
	function defaultFaceUV(element, face) {
		const f = element.from || [0, 0, 0];
		const t = element.to || [16, 16, 16];
		switch (face) {
			case 'north': return [16 - t[0], 16 - t[1], 16 - f[0], 16 - f[1]];
			case 'south': return [f[0], 16 - t[1], t[0], 16 - f[1]];
			case 'east': return [16 - t[2], 16 - t[1], 16 - f[2], 16 - f[1]];
			case 'west': return [f[2], 16 - t[1], t[2], 16 - f[1]];
			case 'up': return [f[0], f[2], t[0], t[2]];
			default: return [f[0], 16 - t[2], t[0], 16 - f[2]];
		}
	}

	/* ---- Where models and textures come from --------------------------------
	 * 1. the resource pack on disk (found from the selected files' paths),
	 * 2. the selected files themselves (matched by name),
	 * 3. the vanilla client jar (.minecraft/versions/<ver>/<ver>.jar),
	 * 4. the built-in copies above (models only). */
	let vanillaZipCache = {jar: null, zip: null};

	function nodeModule(name) {
		if (typeof requireNativeModule === 'function') {
			try { return requireNativeModule(name); } catch (err) { console.warn('[Gestures] ' + name + ' module unavailable', err); }
		}
		return null;
	}

	function compareVersions(a, b) {
		const pa = String(a).split(/[^0-9]+/).filter(Boolean).map(Number);
		const pb = String(b).split(/[^0-9]+/).filter(Boolean).map(Number);
		for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
			const d = (pa[i] || 0) - (pb[i] || 0);
			if (d) return d;
		}
		return 0;
	}

	function findVanillaJar(fs) {
		if (settings.vanillaJar) return fs.existsSync(settings.vanillaJar) ? settings.vanillaJar : null;
		const gameDirs = [];
		const config = String(settings.configDir || '').replace(/\\/g, '/');
		const cut = config.toLowerCase().lastIndexOf('/config/gestures');
		if (cut > 0) gameDirs.push(config.slice(0, cut));
		const defaults = defaultSettings().configDir.replace(/\\/g, '/');
		const cut2 = defaults.toLowerCase().lastIndexOf('/config/gestures');
		if (cut2 > 0) gameDirs.push(defaults.slice(0, cut2));
		for (const dir of gameDirs) {
			const versions = dir + '/versions';
			let names = [];
			try { names = fs.readdirSync(versions); } catch (err) { continue; }
			const found = names.filter(function (name) {
				return /^\d/.test(name) && fs.existsSync(versions + '/' + name + '/' + name + '.jar');
			}).sort(compareVersions);
			if (found.length) {
				const name = found[found.length - 1];
				return versions + '/' + name + '/' + name + '.jar';
			}
		}
		return null;
	}

	function bytesToDataURL(bytes) {
		let binary = '';
		for (let i = 0; i < bytes.length; i += 0x8000) {
			binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
		}
		return 'data:image/png;base64,' + btoa(binary);
	}

	function namespaceDirFromPath(filePath) {
		const parts = String(filePath || '').replace(/\\/g, '/').split('/');
		const known = ['models', 'textures', 'items'];
		for (let i = parts.length - 3; i >= 1; i--) {
			if (parts[i - 1] === 'assets' && known.includes(parts[i + 1])) return parts.slice(0, i + 1).join('/');
		}
		for (let i = parts.length - 2; i >= 1; i--) {
			if (known.includes(parts[i])) return parts.slice(0, i).join('/');
		}
		return null;
	}

	function createResolver(entries) {
		const fs = nodeModule('fs');
		const nsDirs = {};
		const memModels = new Map();
		const memTextures = new Map();
		const modelCache = new Map();
		let zipPromise = null;

		function addNsDir(ns, dir) {
			if (!nsDirs[ns]) nsDirs[ns] = [];
			if (!nsDirs[ns].includes(dir)) nsDirs[ns].push(dir);
		}
		entries.forEach(function (entry) {
			if (entry.isPng) memTextures.set(baseKey(entry.name), entry.content);
			if (!fs || !entry.path) return;
			const dir = namespaceDirFromPath(entry.path);
			if (!dir) return;
			const slash = dir.lastIndexOf('/');
			addNsDir(dir.slice(slash + 1), dir);
			try { /* sibling namespaces of the same assets folder (e.g. minecraft) */
				const assets = dir.slice(0, slash);
				fs.readdirSync(assets).forEach(function (name) { addNsDir(name, assets + '/' + name); });
			} catch (err) { /* not an assets folder */ }
		});

		/* Folders from the plugin settings: a mod's resources, a resource pack, or an assets folder. */
		function addAssetsRoot(raw) {
			if (!fs) return;
			const dir = String(raw).replace(/\\/g, '/').replace(/\/+$/, '');
			try {
				let root = null;
				if (fs.existsSync(dir + '/assets')) root = dir + '/assets';
				else if (dir.split('/').pop() === 'assets') root = dir;
				if (root) {
					fs.readdirSync(root).forEach(function (name) { addNsDir(name, root + '/' + name); });
				} else if (['models', 'textures', 'items'].some(function (n) { return fs.existsSync(dir + '/' + n); })) {
					addNsDir(dir.split('/').pop(), dir);
				}
			} catch (err) { console.warn('[Gestures] Could not read resource folder ' + dir, err); }
		}
		String(settings.assetsDirs || '').split(/[\r\n;|]+/).map(function (v) { return v.trim(); })
			.filter(Boolean).forEach(addAssetsRoot);

		function vanillaZip() {
			if (zipPromise) return zipPromise;
			zipPromise = (async function () {
				if (!fs || typeof JSZip === 'undefined') return null;
				const jar = findVanillaJar(fs);
				if (!jar) return null;
				if (vanillaZipCache.jar === jar && vanillaZipCache.zip) return vanillaZipCache.zip;
				try {
					const zip = await JSZip.loadAsync(fs.readFileSync(jar));
					vanillaZipCache = {jar: jar, zip: zip};
					return zip;
				} catch (err) {
					console.warn('[Gestures] Could not open the Minecraft jar', err);
					return null;
				}
			})();
			return zipPromise;
		}

		function diskRead(ns, rel) {
			if (!fs) return null;
			for (const dir of (nsDirs[ns] || [])) {
				try { if (fs.existsSync(dir + '/' + rel)) return fs.readFileSync(dir + '/' + rel); } catch (err) { /* next */ }
			}
			return null;
		}

		function diskReadAny(rel) {
			if (!fs) return null;
			for (const ns of Object.keys(nsDirs)) {
				const bytes = diskRead(ns, rel);
				if (bytes) return bytes;
			}
			return null;
		}

		async function jarRead(ns, rel) {
			const zip = await vanillaZip();
			const file = zip && zip.file('assets/' + ns + '/' + rel);
			return file ? file.async('uint8array') : null;
		}

		return {
			hasJar: function () { return vanillaZip().then(function (zip) { return !!zip; }); },
			describe: function () { return {namespaces: Object.keys(nsDirs)}; },
			addModel: function (name, data) {
				const key = shortName(name);
				if (!memModels.has(key)) memModels.set(key, []);
				memModels.get(key).push(data);
			},
			getModel: async function (id) {
				const loc = splitLoc(id);
				const key = loc.ns + ':' + loc.path;
				if (modelCache.has(key)) return modelCache.get(key);
				const rel = 'models/' + loc.path + '.json';
				let data = null;
				let bytes = diskRead(loc.ns, rel);
				if (bytes) data = parseLenientJson(new TextDecoder('utf-8').decode(bytes));
				if (!data) data = pickModelJson(memModels.get(shortName(loc.path)));
				if (!data) {
					bytes = await jarRead(loc.ns, rel);
					if (bytes) data = parseLenientJson(new TextDecoder('utf-8').decode(bytes));
				}
				if (!data && loc.ns === 'minecraft' && BUILTIN_MODELS[loc.path]) data = BUILTIN_MODELS[loc.path];
				modelCache.set(key, data);
				return data;
			},
			getTexture: async function (ref) {
				const loc = splitLoc(ref);
				const rel = 'textures/' + loc.path + '.png';
				let bytes = diskRead(loc.ns, rel);
				if (bytes) return bytesToDataURL(bytes);
				const selected = memTextures.get(baseKey(loc.path));
				if (selected) return selected;
				bytes = diskReadAny(rel);
				if (bytes) return bytesToDataURL(bytes);
				bytes = await jarRead(loc.ns, rel);
				return bytes ? bytesToDataURL(bytes) : null;
			}
		};
	}

	/* ---- Building the preview in Blockbench --------------------------------- */

	/* ---- Building the preview ----------------------------------------------
	 * Own renderer: the item is drawn with plain three.js meshes and textures
	 * that hang under the slot group's mesh (group.mesh), so they follow the
	 * body part and the animated slot transform. No Blockbench cubes or Texture
	 * objects are created: the project, outliner, texture list and the exported
	 * gesture stay clean, and the project's box-UV / 64x64 texture rules can no
	 * longer break item textures. */

	const FACE_SHADE = {up: 1, down: 0.5, north: 0.8, south: 0.8, east: 0.6, west: 0.6};

	function threeAvailable() {
		return typeof THREE !== 'undefined' && !!THREE.Matrix4 && !!THREE.Group;
	}

	function degToRad(value) {
		return number(value) * Math.PI / 180;
	}

	function configureThreeTexture(texture) {
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.NearestFilter;
		texture.generateMipmaps = false;
		texture.wrapS = THREE.ClampToEdgeWrapping;
		texture.wrapT = THREE.ClampToEdgeWrapping;
		/* Match the colour handling of the rig's skin so items are not brighter or darker. */
		try {
			const ref = typeof Texture !== 'undefined' && Texture.all && Texture.all[0];
			const mat = ref && typeof ref.getMaterial === 'function' ? ref.getMaterial() : null;
			const map = mat && mat.uniforms && mat.uniforms.map && mat.uniforms.map.value;
			if (map) {
				if ('colorSpace' in map) texture.colorSpace = map.colorSpace;
				else if ('encoding' in map) texture.encoding = map.encoding;
			}
		} catch (err) { /* keep the defaults */ }
	}

	function loadImageTexture(dataUrl) {
		return new Promise(function (resolve) {
			const img = new Image();
			img.onload = function () {
				const texture = new THREE.Texture(img);
				configureThreeTexture(texture);
				texture.needsUpdate = true;
				resolve({texture: texture, image: img, width: img.naturalWidth, height: img.naturalHeight});
			};
			img.onerror = function () { resolve(null); };
			img.src = dataUrl;
		});
	}

	/* The model's own "display" transform for the slot. Hands use the
	 * third-person hand transforms, the helmet slot uses "head". The body slots
	 * have no vanilla key, so "chestplate"/"chest", "leggings"/"legs" and
	 * "boots"/"feet" are read when a model defines them. */
	function displayTransform(model, slot) {
		const display = model.display || {};
		const pick = function () {
			for (let i = 0; i < arguments.length; i++) {
				if (display[arguments[i]]) return display[arguments[i]];
			}
			return null;
		};
		let value;
		let flip = false;
		if (slot === 'left_arm_slot') {
			/* A model without a left-hand transform uses the right-hand one;
			 * the game then mirrors it (rotation Y/Z and translation X). */
			value = pick('thirdperson_lefthand', 'thirdperson_righthand');
			flip = true;
		} else if (slot === 'right_arm_slot') value = pick('thirdperson_righthand');
		else if (slot === 'helmet_slot') value = pick('head');
		else if (slot === 'chestplate_slot') value = pick('chestplate', 'chest');
		else if (slot === 'leggings_slot') value = pick('leggings', 'legs');
		else value = pick('boots', 'feet');
		const vec3 = function (source, fallbackValue, min, max) {
			const v = Array.isArray(source) ? source : fallbackValue;
			return [0, 1, 2].map(function (i) { return clamp(number(v[i]), min, max); });
		};
		const translation = vec3(value && value.translation, [0, 0, 0], -80, 80);
		const rotation = vec3(value && value.rotation, [0, 0, 0], -360, 360);
		const scale = vec3(value && value.scale, [1, 1, 1], -4, 4);
		if (flip) {
			translation[0] = -translation[0];
			rotation[1] = -rotation[1];
			rotation[2] = -rotation[2];
		}
		return {translation: translation, rotation: rotation, scale: scale};
	}

	/* How the item is drawn in an inventory slot. Minecraft's default gui
	 * transform is used when the model does not define one (item/generated and
	 * item/handheld models inherit it from the item renderer, not from JSON). */
	function guiTransform(model) {
		const display = model.display || {};
		const value = display.gui || {
			translation: [0, 0, 0],
			rotation: [30, 225, 0],
			scale: [0.625, 0.625, 0.625]
		};
		const vec3 = function (source, fallbackValue, min, max) {
			const v = Array.isArray(source) ? source : fallbackValue;
			return [0, 1, 2].map(function (i) { return clamp(number(v[i]), min, max); });
		};
		return {
			translation: vec3(value.translation, [0, 0, 0], -80, 80),
			rotation: vec3(value.rotation, [0, 0, 0], -360, 360),
			scale: vec3(value.scale, [1, 1, 1], -4, 4)
		};
	}

	/* Same transform chain as the game's item layers, in model pixels.
	 * Game entity space has X mirrored and Y pointing down; the rig is the
	 * same space with x -> -x, y -> 24 - y, so the result is converted with
	 * GAME_TO_RIG. The matrix is relative to the slot group (translation only
	 * at rest), which is where the preview mesh is attached.
	 *   hands : arm pivot, rotate X -90 / Y 180, move (+-1, 2, -10), then display
	 *   head  : head pivot, move (0, -4, 0), rotate Y 180, scale (.625, -.625, -.625), then display
	 *   body  : the slot point in rig space, then display
	 * display = translate, rotate (X then Y then Z as in the game's XYZ quaternion), scale. */
	function slotMatrix(slot, display, slotOrigin) {
		const M4 = THREE.Matrix4;
		const tr = function (v) { return new M4().makeTranslation(v[0], v[1], v[2]); };
		const rx = function (deg) { return new M4().makeRotationX(degToRad(deg)); };
		const ry = function (deg) { return new M4().makeRotationY(degToRad(deg)); };
		const rz = function (deg) { return new M4().makeRotationZ(degToRad(deg)); };
		const sc = function (v) { return new M4().makeScale(v[0], v[1], v[2]); };
		const gameToRig = function () { return tr([0, 24, 0]).multiply(sc([-1, -1, 1])); };

		const disp = tr(display.translation)
			.multiply(rx(display.rotation[0]))
			.multiply(ry(display.rotation[1]))
			.multiply(rz(display.rotation[2]))
			.multiply(sc(display.scale));
		let world;
		if (slot === 'left_arm_slot' || slot === 'right_arm_slot') {
			const left = slot === 'left_arm_slot';
			const frame = tr([left ? 5 : -5, 2, 0])
				.multiply(rx(-90)).multiply(ry(180))
				.multiply(tr([left ? -1 : 1, 2, -10]));
			world = gameToRig().multiply(frame).multiply(disp);
		} else if (slot === 'helmet_slot') {
			const frame = tr([0, -4, 0]).multiply(ry(180)).multiply(sc([0.625, -0.625, -0.625]));
			world = gameToRig().multiply(frame).multiply(disp);
		} else {
			world = tr(SLOT_POSITION[slot]).multiply(disp);
		}
		const origin = Array.isArray(slotOrigin) ? slotOrigin : SLOT_POSITION[slot];
		return tr([-number(origin[0]), -number(origin[1]), -number(origin[2])]).multiply(world);
	}

	/* Corners of a face as [top-left, top-right, bottom-right, bottom-left] as seen
	 * from outside, matching the game's default UV directions. */
	function faceCorners(face, f, t) {
		switch (face) {
			case 'north': return [[t[0], t[1], f[2]], [f[0], t[1], f[2]], [f[0], f[1], f[2]], [t[0], f[1], f[2]]];
			case 'south': return [[f[0], t[1], t[2]], [t[0], t[1], t[2]], [t[0], f[1], t[2]], [f[0], f[1], t[2]]];
			case 'east': return [[t[0], t[1], t[2]], [t[0], t[1], f[2]], [t[0], f[1], f[2]], [t[0], f[1], t[2]]];
			case 'west': return [[f[0], t[1], f[2]], [f[0], t[1], t[2]], [f[0], f[1], t[2]], [f[0], f[1], f[2]]];
			case 'up': return [[f[0], t[1], f[2]], [t[0], t[1], f[2]], [t[0], t[1], t[2]], [f[0], t[1], t[2]]];
			default: return [[f[0], f[1], t[2]], [t[0], f[1], t[2]], [t[0], f[1], f[2]], [f[0], f[1], f[2]]];
		}
	}

	/* ---- Generated items (item/generated, item/handheld, builtin/generated) ----
	 * Blockbench already has a renderer for these: the GeneratedItemMesh used by
	 * the Java Block/Item format. It extrudes every opaque pixel of the sprite
	 * into a 1 unit thick shape with side faces. Its geometry builder
	 * (TextureMesh.preview_controller.updateGeometry) is reused here, and the
	 * result is placed exactly like Blockbench's placeholder:
	 * rotation [90, 180, 0] (ZYX) and local_pivot [0, -7.5, -16], which puts the
	 * sprite in the 0..16 model box at z 7.5..8.5. If this Blockbench build has
	 * no such renderer, the flat two-sided sprite below is used instead. */
	const GENERATED_PIVOT = [0, -7.5, -16];
	const GENERATED_ROTATION = [90, 180, 0];

	function generatedRendererAvailable() {
		return typeof TextureMesh !== 'undefined' && !!TextureMesh.preview_controller
			&& typeof TextureMesh.preview_controller.updateGeometry === 'function'
			&& typeof Project !== 'undefined' && !!Project && typeof Project.getUVWidth === 'function'
			&& typeof THREE !== 'undefined' && !!THREE.BufferAttribute;
	}

	/* geometry: item-centred coordinates (model box 0..16 minus 8), ready to hang under the item root. */
	function blockbenchGeneratedGeometry(info) {
		if (!generatedRendererAvailable() || !info || !info.image || !info.width || !info.height) return null;
		const frames = Math.max(1, number(info.frames) || 1);
		/* The stand-in for a Blockbench Texture: only what the builder reads. */
		const source = {
			width: info.width,
			height: info.height,
			display_height: info.height / frames,
			frameCount: frames,
			currentFrame: 0,
			img: info.image,
			uv_width: 16,
			uv_height: 16
		};
		const geometry = new THREE.BufferGeometry();
		const element = {
			mesh: {geometry: geometry, outline: {geometry: new THREE.BufferGeometry()}},
			scale: [1, 1, 1],
			local_pivot: [0, 0, 0]
		};
		try {
			TextureMesh.preview_controller.updateGeometry(element, source);
		} catch (err) {
			console.warn('[Gestures] Blockbench generated-item geometry failed', err);
			geometry.dispose();
			return null;
		}
		if (!geometry.attributes.position || !geometry.attributes.position.count) { geometry.dispose(); return null; }
		/* The builder sizes the sprite to the project's UV size (64 in a gesture
		 * project); a sprite always spans 16 model units, so rescale X and Z. */
		const uw = number(Project.getUVWidth(source)) || 16;
		const uh = number(Project.getUVHeight(source)) || 16;
		const M4 = THREE.Matrix4;
		const euler = new THREE.Euler(degToRad(GENERATED_ROTATION[0]), degToRad(GENERATED_ROTATION[1]),
			degToRad(GENERATED_ROTATION[2]), 'ZYX');
		const matrix = new M4().makeTranslation(-8, -8, -8)
			.multiply(new M4().makeRotationFromEuler(euler))
			.multiply(new M4().makeTranslation(GENERATED_PIVOT[0], GENERATED_PIVOT[1], GENERATED_PIVOT[2]))
			.multiply(new M4().makeScale(16 / uw, 1, 16 / uh));
		geometry.applyMatrix4(matrix);
		geometry.computeBoundingBox();
		geometry.computeBoundingSphere();
		return geometry;
	}

	function buildGeneratedLayerMesh(info, layerIndex, disposables) {
		const geometry = blockbenchGeneratedGeometry(info);
		if (!geometry) return null;
		const material = new THREE.MeshBasicMaterial({
			map: info.texture,
			side: THREE.DoubleSide,
			transparent: true,
			alphaTest: 0.1,
			toneMapped: false,
			polygonOffset: layerIndex > 0,
			polygonOffsetFactor: -layerIndex,
			polygonOffsetUnits: -layerIndex
		});
		disposables.push(material);
		const mesh = new THREE.Mesh(geometry, material);
		mesh.renderOrder = layerIndex;
		mesh.raycast = function () {};
		return mesh;
	}

	function buildItemObject(model, textures, disposables, matrix) {
		const root = new THREE.Group();
		root.name = 'gestures_slot_preview';
		root.matrixAutoUpdate = false;
		root.matrix.copy(matrix);
		root.matrixWorldNeedsUpdate = true;
		const size = model.textureSize || [16, 16];
		const sizeU = number(size[0]) || 16;
		const sizeV = number(size[1]) || 16;
		const materials = new Map();
		const materialFor = function (info, face) {
			const key = (info ? info.id : 'missing') + ':' + face;
			if (materials.has(key)) return materials.get(key);
			const shade = FACE_SHADE[face] || 1;
			const material = new THREE.MeshBasicMaterial({
				map: info ? info.texture : null,
				color: info ? new THREE.Color(shade, shade, shade) : new THREE.Color(0.83 * shade, 0, 0.83 * shade),
				side: THREE.DoubleSide,
				alphaTest: info ? 0.5 : 0,
				toneMapped: false
			});
			disposables.push(material);
			materials.set(key, material);
			return material;
		};
		modelElements(model).forEach(function (element, elementIndex) {
			/* item/generated layers use Blockbench's own extruded-sprite geometry. */
			if (model.generated && !(model.elements && model.elements.length)) {
				const layerFace = element.faces && (element.faces.south || element.faces.north);
				const layerInfo = layerFace ? textures.get(resolveTextureRef(model, layerFace.texture)) : null;
				const layerMesh = layerInfo ? buildGeneratedLayerMesh(layerInfo, elementIndex, disposables) : null;
				if (layerMesh) { root.add(layerMesh); return; }
			}
			const a = vector(element.from);
			const b = Array.isArray(element.to) ? vector(element.to) : [16, 16, 16];
			const f = [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.min(a[2], b[2])];
			const t = [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.max(a[2], b[2])];
			const rot = elementRotation(element.rotation);
			const origin = rot ? [number(rot.origin[0]), number(rot.origin[1]), number(rot.origin[2])] : [8, 8, 8];
			const holder = new THREE.Group();
			holder.position.set(origin[0] - 8, origin[1] - 8, origin[2] - 8);
			if (rot) {
				holder.rotation.order = 'XYZ';
				holder.rotation.set(degToRad(rot.angles[0]), degToRad(rot.angles[1]), degToRad(rot.angles[2]));
				if (element.rotation && element.rotation.rescale && element.rotation.axis) {
					const k = 1 / Math.max(0.1, Math.cos(degToRad(rot.angles[0] || rot.angles[1] || rot.angles[2])));
					const axis = String(element.rotation.axis).toLowerCase();
					holder.scale.set(axis === 'x' ? 1 : k, axis === 'y' ? 1 : k, axis === 'z' ? 1 : k);
				}
			}
			Object.keys(element.faces || {}).forEach(function (faceName) {
				const face = element.faces[faceName];
				if (!face || typeof face !== 'object') return;
				const info = textures.get(resolveTextureRef(model, face.texture));
				const frames = info ? info.frames : 1;
				const uv = Array.isArray(face.uv) && face.uv.length === 4 ? face.uv.map(number) : defaultFaceUV(element, faceName);
				const U = function (u) { return u / sizeU; };
				/* Tall animated strips: only the first frame is shown. */
				const V = function (v) { return 1 - v / sizeV / frames; };
				const cornerUV = [[U(uv[0]), V(uv[1])], [U(uv[2]), V(uv[1])], [U(uv[2]), V(uv[3])], [U(uv[0]), V(uv[3])]];
				const turns = ((Math.round(number(face.rotation) / 90) % 4) + 4) % 4;
				const corners = faceCorners(faceName, f, t);
				const positions = [];
				const uvs = [];
				for (let i = 0; i < 4; i++) {
					positions.push(corners[i][0] - origin[0], corners[i][1] - origin[1], corners[i][2] - origin[2]);
					const c = cornerUV[(i - turns + 4) % 4];
					uvs.push(c[0], c[1]);
				}
				const geometry = new THREE.BufferGeometry();
				geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
				geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
				geometry.setIndex([0, 1, 2, 0, 2, 3]);
				const mesh = new THREE.Mesh(geometry, materialFor(info, faceName));
				mesh.raycast = function () {};
				holder.add(mesh);
			});
			root.add(holder);
		});
		return root;
	}

	/* ---- Slot icons -------------------------------------------------------
	 * One small offscreen WebGL renderer draws every model into a PNG data URL,
	 * posed with the model's "display.gui" transform, so the square shows the
	 * item exactly as it looks in an inventory slot. */
	const ICON_SIZE = 96;

	function getIconRenderer() {
		if (iconRenderer !== null) return iconRenderer;
		iconRenderer = false;
		if (typeof document === 'undefined' || !threeAvailable()) return iconRenderer;
		try {
			const canvas = document.createElement('canvas');
			canvas.width = ICON_SIZE;
			canvas.height = ICON_SIZE;
			const renderer = new THREE.WebGLRenderer({
				canvas: canvas,
				alpha: true,
				antialias: false,
				preserveDrawingBuffer: true
			});
			renderer.setPixelRatio(1);
			renderer.setSize(ICON_SIZE, ICON_SIZE, false);
			renderer.setClearColor(0x000000, 0);
			iconRenderer = {renderer: renderer, canvas: canvas};
		} catch (err) {
			console.warn('[Gestures] Could not create slot icon renderer', err);
		}
		return iconRenderer;
	}

	function renderSlotIcon(buildable, textures) {
		const ctx = getIconRenderer();
		if (!ctx) return '';
		const group = new THREE.Group();
		const M4 = THREE.Matrix4;
		buildable.forEach(function (model) {
			/* Use the model's own "display.gui" transform: this is exactly how
			 * the item is posed when drawn in an inventory slot. */
			const display = guiTransform(model);
			const matrix = new M4().makeTranslation(display.translation[0], display.translation[1], display.translation[2])
				.multiply(new M4().makeRotationX(degToRad(display.rotation[0])))
				.multiply(new M4().makeRotationY(degToRad(display.rotation[1])))
				.multiply(new M4().makeRotationZ(degToRad(display.rotation[2])))
				.multiply(new M4().makeScale(display.scale[0], display.scale[1], display.scale[2]));
			group.add(buildItemObject(model, textures, [], matrix));
		});
		const scene = new THREE.Scene();
		scene.add(group);
		/* The game draws inventory items with a straight-on orthographic view. */
		const camera = new THREE.OrthographicCamera(-9, 9, 9, -9, 0.1, 200);
		camera.position.set(0, 0, 40);
		camera.lookAt(0, 0, 0);
		try {
			ctx.renderer.render(scene, camera);
			return ctx.canvas.toDataURL('image/png');
		} catch (err) {
			console.warn('[Gestures] Could not render slot icon', err);
			return '';
		} finally {
			group.traverse(function (object) {
				if (object.geometry && typeof object.geometry.dispose === 'function') object.geometry.dispose();
				if (object.material) {
					const list = Array.isArray(object.material) ? object.material : [object.material];
					list.forEach(function (material) {
						if (material && typeof material.dispose === 'function') material.dispose();
					});
				}
			});
		}
	}

	function clearSlotPreview(slot, store) {
		store = store || slotStore();
		const objects = store.previews[slot] || [];
		delete store.previews[slot];
		objects.forEach(function (object) {
			if (object.parent) object.parent.remove(object);
			object.traverse(function (child) {
				if (child.geometry && typeof child.geometry.dispose === 'function') child.geometry.dispose();
			});
		});
		(store.textures[slot] || []).forEach(function (item) {
			try { if (item && typeof item.dispose === 'function') item.dispose(); } catch (err) { /* ignore */ }
		});
		delete store.textures[slot];
		refreshCanvas();
	}

	function disposeSlotStore(project) {
		const target = project || ((typeof Project !== 'undefined' && Project) ? Project : null);
		const key = target && target.uuid ? target.uuid : '_none';
		const store = slotStores[key];
		if (!store) return;
		SLOTS.forEach(function (slot) {
			try { clearSlotPreview(slot, store); } catch (err) { /* ignore */ }
		});
		delete slotStores[key];
	}

	/* Show the tile state (model/texture/thumbnail) of the selected project. */
	function syncSlotsPanel() {
		if (!slotsPanel || !slotsPanel.inside_vue || !Array.isArray(slotsPanel.inside_vue.slots)) return;
		const store = slotStore();
		slotsPanel.inside_vue.slots.forEach(function (slot) {
			const tile = store.tiles[slot.id] || {};
			slot.file = tile.file || '';
			slot.texture = tile.texture || '';
			slot.icon = tile.icon || '';
		});
	}

	function setSlotTile(store, slotId, values) {
		store.tiles[slotId] = Object.assign({file: '', texture: '', icon: ''}, store.tiles[slotId], values);
		if (store === slotStore()) syncSlotsPanel();
	}

	function refreshCanvas() {
		try {
			if (typeof Preview === 'undefined') return;
			if (Preview.selected && typeof Preview.selected.render === 'function') {
				Preview.selected.render();
			} else if (Array.isArray(Preview.all)) {
				Preview.all.forEach(function (preview) { if (preview && typeof preview.render === 'function') preview.render(); });
			}
		} catch (err) { /* ignore */ }
	}

	async function loadSlotPreviewAsync(slot, files) {
		const parent = groupForPart(slot);
		if (!parent || !parent.mesh || !threeAvailable()) throw new Error('Open a gesture workspace first');
		const store = slotStore();
		/* Cached entries are arrays of {content, isJson/isPng}; a FileList (or an
		 * array of File objects) is a fresh selection and must be read first. */
		const cached = Array.isArray(files) && files.length > 0
			&& files.every(function (f) { return f && typeof f.content === 'string'
				&& (f.isJson || f.isPng); });
		const entries = cached ? files : await readSlotFiles(files);
		if (!cached) store.entries[slot] = entries.slice();
		const resolver = createResolver(entries);
		const jsons = [];
		entries.forEach(function (entry) {
			if (!entry.isJson) return;
			let data;
			try {
				data = parseLenientJson(entry.content);
			} catch (err) {
				throw new Error(entry.name + ' is not valid JSON: ' + (err && err.message ? err.message : err));
			}
			if (!data || typeof data !== 'object' || Array.isArray(data)) {
				throw new Error(entry.name + ' is not a Minecraft model (the root must be a JSON object)');
			}
			resolver.addModel(entry.name, data);
			jsons.push({name: entry.name, data: data});
		});
		if (!jsons.length) throw new Error('Select a Minecraft item/block model JSON file');
		const main = jsons.find(function (j) { return isItemDefinition(j.data); }) || jsons[0];

		/* The item definition (items/<id>.json) names the model(s) to render. */
		const notes = [];
		const models = [];
		if (isItemDefinition(main.data)) {
			const ids = definitionModelIds(main.data.model, [], 0);
			if (!ids.length) throw new Error(main.name + ': item definition has no model to render');
			for (const id of ids) {
				const data = await resolver.getModel(id);
				if (!data) notes.push('model not found: ' + id);
				else models.push(await resolveModelData(resolver, data, [splitLoc(id).ns + ':' + splitLoc(id).path], notes));
			}
		} else {
			models.push(await resolveModelData(resolver, main.data, [], notes));
		}

		const buildable = models.filter(function (model) { return modelElements(model).length; });
		if (!buildable.length) {
			if (models.some(function (model) { return model.entity; })) {
				throw new Error('This item uses builtin/entity (chest, banner, shield, head...): it has no JSON geometry to preview');
			}
			const hasJar = await resolver.hasJar();
			throw new Error('No geometry in ' + main.name + (notes.length ? ' - ' + notes[0] : '')
				+ (hasJar ? '' : '. Select the parent JSON too, or set "Minecraft client .jar" in the plugin settings'));
		}

		clearSlotPreview(slot, store);
		const disposables = [];
		store.textures[slot] = disposables;
		const textures = new Map();
		const missing = [];
		let textureId = 0;
		const paths = [];
		for (const model of buildable) {
			for (const element of modelElements(model)) {
				for (const face of Object.values(element.faces || {})) {
					const path = resolveTextureRef(model, face && face.texture);
					if (path && !paths.includes(path)) paths.push(path);
				}
			}
		}
		const overrides = textureOverrideMap(paths, store.overrides[slot]);
		for (const model of buildable) {
			for (const element of modelElements(model)) {
				for (const face of Object.values(element.faces || {})) {
					const path = resolveTextureRef(model, face && face.texture);
					if (!path || textures.has(path)) continue;
					const dataUrl = overrides.get(path) || await resolver.getTexture(path);
					const loaded = dataUrl ? await loadImageTexture(dataUrl) : null;
					if (!loaded) { textures.set(path, null); missing.push(path); continue; }
					disposables.push(loaded.texture);
					const w = loaded.width;
					const h = loaded.height;
					textures.set(path, {texture: loaded.texture, image: loaded.image, width: w, height: h, id: ++textureId,
						frames: w && h > w && h % w === 0 ? h / w : 1});
				}
			}
		}
		textures.forEach(function (value, key) { if (!value) textures.delete(key); });

		store.previews[slot] = [];
		buildable.forEach(function (model) {
			const matrix = slotMatrix(slot, displayTransform(model, slot), parent.origin);
			const object = buildItemObject(model, textures, disposables, matrix);
			parent.mesh.add(object);
			store.previews[slot].push(object);
		});
		/* The square in the SLOTS panel shows this thumbnail. If WebGL is not
		 * available, fall back to the first PNG the user selected. */
		let icon = renderSlotIcon(buildable, textures);
		if (!icon) {
			const png = entries.find(function (entry) { return entry.isPng && entry.content; });
			icon = png ? png.content : '';
		}
		refreshCanvas();
		setTimeout(refreshCanvas, 150);
		if (typeof Blockbench !== 'undefined') {
			const problems = [];
			if (missing.length) {
				const known = resolver.describe();
				console.warn('[Gestures] Missing item textures:', missing, 'namespaces searched:', known.namespaces);
				problems.push('missing textures: ' + Array.from(new Set(missing)).slice(0, 4).join(', ')
					+ ' (searched: ' + (known.namespaces.join(', ') || 'selected files and jar only')
					+ '). Click the slot again and select the PNG, or set "Resource folders" in the plugin settings');
			}
			if (notes.length) problems.push(notes[0]);
			if (problems.length) Blockbench.showQuickMessage(problems.join(' | '), 8000);
		}
		return {name: main.name, icon: icon};
	}

	function loadSlotPreview(slot, files) {
		return loadSlotPreviewAsync(slot, files).catch(function (err) {
			console.error('[Gestures] Slot preview failed', err);
			throw err;
		});
	}

	/* The texture field is independent from the model JSON: item JSON files only
	 * contain resource paths, so the real PNG is supplied here by the user. */
	function loadSlotTexture(slot, files) {
		const project = Project;
		const store = slotStore();
		return readSlotFiles(files).then(function (entries) {
			if (Project !== project) throw new Error('The project changed while the texture was loading');
			const textures = entries.filter(function (entry) { return entry.isPng; });
			if (!textures.length) throw new Error('Select one or more PNG textures');
			const cached = store.entries[slot];
			if (!cached || !cached.some(function (entry) { return entry.isJson; })) {
				throw new Error('Load the item model for this slot first');
			}
			store.overrides[slot] = textures;
			return loadSlotPreviewAsync(slot, cached).then(function (result) {
				return {name: textures.map(function (entry) { return entry.name; }).join(', '), icon: result.icon};
			});
		});
	}

	function clearSlotTexture(slot) {
		const store = slotStore();
		delete store.overrides[slot];
		const cached = store.entries[slot];
		if (!cached) return Promise.resolve({icon: ''});
		return loadSlotPreviewAsync(slot, cached).then(function (result) { return {icon: result.icon}; });
	}

	function registerSlotsPanel() {
		if (slotsPanel || typeof Panel === 'undefined' || (typeof Blockbench !== 'undefined' && Blockbench.isMobile)) return;
		slotsPanel = new Panel('gesture_slots', {
			name: 'SLOTS',
			icon: 'hexagon',
			resizable: true,
			condition: function () { return workspaceActive(); },
			default_position: {
				slot: 'left_bar',
				float_position: [0, 0],
				float_size: [280, 300],
				height: 270,
				sidebar_index: 1
			},
			component: {
				data: function () {
					return {slots: SLOTS.map(function (slot) {
						return {id: slot, label: SLOT_LABELS[slot], file: '', texture: '', icon: ''};
					})};
				},
				methods: {
					/* First click opens the model folder. Once a model is set,
					 * every later click opens the texture folder instead. */
					pick: function (slot, event) {
						const selector = slot.file ? '.gesture_slot_texture_input' : '.gesture_slot_model_input';
						const input = event.currentTarget.querySelector(selector);
						if (!input) return;
						input.value = '';
						input.click();
					},
					onFiles: function (event, slot) {
						const input = event.target;
						const files = Array.from(input.files || []);
						if (!files.some(function (file) { return /\.json$/i.test(file.name); })) {
							Blockbench.showQuickMessage('Select a Minecraft model .json', 4000);
							input.value = '';
							return;
						}
						const store = slotStore();
						setSlotTile(store, slot.id, {icon: ''});
						loadSlotPreview(slot.id, files).then(function (result) {
							setSlotTile(store, slot.id, {file: result.name, icon: result.icon});
							input.value = '';
							Blockbench.showQuickMessage('Model loaded. Click the square again to choose the texture.', 3000);
						}).catch(function (err) {
							setSlotTile(store, slot.id, {file: '', icon: ''});
							input.value = '';
							Blockbench.showQuickMessage(String(err && err.message ? err.message : err), 4000);
						});
					},
					onTexture: function (event, slot) {
						const input = event.target;
						const files = Array.from(input.files || []);
						input.value = '';
						if (!files.length) return;
						const store = slotStore();
						loadSlotTexture(slot.id, files).then(function (result) {
							setSlotTile(store, slot.id, {texture: result.name, icon: result.icon});
						}).catch(function (err) {
							setSlotTile(store, slot.id, {texture: ''});
							Blockbench.showQuickMessage(String(err && err.message ? err.message : err), 4000);
						});
					},
					clear: function (slot) {
						const store = slotStore();
						clearSlotPreview(slot.id, store);
						delete store.entries[slot.id];
						delete store.overrides[slot.id];
						setSlotTile(store, slot.id, {file: '', texture: '', icon: ''});
					}
				},
				template: [
					'<div class="gesture_slots">',
					'<template v-for="slot in slots">',
					'<div class="gesture_slot_tile" :key="slot.id">',
					'<div class="gesture_slot_square" @click="pick(slot, $event)" :title="slot.file ? (slot.texture ? slot.file + \' | \' + slot.texture + \' (click to change texture)\' : slot.file + \' (click to choose texture)\') : \'Click to choose model\'">',
					'<img v-if="slot.icon" class="gesture_slot_icon" :src="slot.icon" alt="">',
					'<span v-else class="gesture_slot_empty">+</span>',
					'<span v-if="slot.file" class="gesture_slot_remove" @click.stop="clear(slot)">×</span>',
					'<input class="gesture_slot_model_input" type="file" multiple accept=".json" @click.stop @change="onFiles($event, slot)">',
					'<input class="gesture_slot_texture_input" type="file" multiple accept=".png" @click.stop @change="onTexture($event, slot)">',
					'</div>',
					'<div class="gesture_slot_label">{{ slot.label }}</div>',
					'</div>',
					'</template>',
					'</div>'
				].join('')
			}
		});
	}

	function unregisterSlotsPanel() {
		if (!slotsPanel) return;
		if (typeof slotsPanel.delete === 'function') slotsPanel.delete();
		slotsPanel = null;
	}

	function createDefaultAnimation() {
		if (typeof Animation === 'undefined' || Animation.all.length) return null;
		if (!String(projectValue('name') || '').trim()) setProjectValue('name', 'Gesture');
		const playMode = validPlayMode(projectValue('gesturePlayMode')) || validPlayMode(settings.defaultPlayMode) || 'ONCE';
		setProjectValue('gesturePlayMode', playMode);
		const animation = new Animation({
			name: gestureName(null),
			length: 1,
			loop: blockbenchLoop(playMode),
			saved: false
		}).add(false);
		Undo.initEdit({animations: [animation]});
		/* The hitbox gets a zero key too, so its translation track is always
		 * present in the exported JSON and can be moved with the gizmo. */
		PARTS.concat([HITBOX]).forEach(function (part) {
			const group = groupForPart(part);
			if (!group) return;
			const animator = animation.getBoneAnimator(group);
			if (!animator) return;
			['rotation', 'position'].forEach(function (channel) {
				animator.addKeyframe({
					channel: channel,
					time: 0,
					interpolation: 'linear',
					data_points: [{x: 0, y: 0, z: 0}]
				});
			});
			animator.addToTimeline();
		});
		Undo.finishEdit('Create gesture animation');
		setMeta(animation, {
			id: gestureId(animation),
			name: gestureName(animation),
			playMode: playMode,
			loopStart: 0,
			loopEnd: animationDuration(animation)
		});
		animation.select();
		if (typeof Animator !== 'undefined' && Animator.preview) Animator.preview();
		return animation;
	}

	function installWorkspaceStyle() {
		if (typeof document === 'undefined' || styleNode) return;
		styleNode = document.createElement('style');
		styleNode.id = 'gestures_workspace_style';
		styleNode.textContent = [
			'body.gestures-workspace #panel_animations,',
			'body.gestures-workspace .panel_handle[panel_id="animations"],',
			'body.gestures-workspace .panel_container[panel_id="animations"] { display: none !important; }',
			'body.gestures-workspace #timeline_custom_range_indicator {',
			'  background: rgba(108,182,255,0.10);',
			'  box-shadow: none;',
			'}',
			'body.gestures-workspace.gestures-loop-hidden #timeline_custom_range_indicator {',
			'  display: none !important;',
			'}',
			'.gestures-loop-region {',
			'  position: absolute; z-index: 3; top: 0; height: 26px;',
			'  box-sizing: border-box; pointer-events: none;',
			'  border-top: 2px solid rgba(255,255,255,0.35);',
			'}',
			'.gestures-loop-region.intro {',
			'  left: 0; background: rgba(118, 214, 151, 0.14); border-color: #76d697;',
			'}',
			'.gestures-loop-region.outro {',
			'  background: rgba(255, 183, 94, 0.14); border-color: #ffb75e;',
			'}',
			'.gestures-loop-region::after {',
			'  content: attr(data-label); position: absolute; top: 3px;',
			'  color: rgba(255,255,255,0.75); font-size: 9px;',
			'  text-shadow: 0 1px 2px rgba(0,0,0,0.6);',
			'}',
			'.gestures-loop-region.intro::after { content: "Start"; left: 5px; }',
			'.gestures-loop-region.outro::after { content: "End"; right: 5px; }',
			'.gestures-loop-handle {',
			'  position: absolute; z-index: 5; top: 0; height: 26px; width: 2px;',
			'  margin-left: -1px; box-sizing: border-box; cursor: ew-resize;',
			'  background: #6cb6ff;',
			'}',
			'.gestures-loop-handle::before {',
			'  content: ""; position: absolute; top: 0; left: -8px; width: 18px; height: 100%;',
			'}',
			'.gestures-loop-handle::after {',
			'  content: attr(data-label); position: absolute; top: 2px; left: 5px;',
			'  color: #cfe8ff; font-size: 9px; white-space: nowrap; pointer-events: none;',
			'  opacity: 0.55;',
			'}',
			'.gestures-loop-handle.end::after { left: auto; right: 5px; }',
			'.gestures-loop-grip {',
			'  position: absolute; z-index: 5; top: 9px; height: 12px; width: 12px;',
			'  margin-left: -6px; transform: rotate(45deg); cursor: grab;',
			'  background: #9ed0ff; border: 1px solid #d6ebff;',
			'}',
			'.gestures-loop-grip::after {',
			'  content: ""; position: absolute; top: 3px; left: 3px; right: 3px; bottom: 3px;',
			'  background: #2f6ea8;',
			'}',
			'.gestures-loop-grip:active { cursor: grabbing; }',
			'.gesture_slots { display: grid; grid-template-columns: repeat(3, 1fr); justify-items: center; gap: 12px 6px; padding: 12px 8px; }',
			'.gesture_slot_tile { display: flex; flex-direction: column; align-items: center; gap: 5px; max-width: 100%; }',
			'.gesture_slot_square { position: relative; box-sizing: border-box; width: 72px; height: 72px; border-radius: 14px;',
			'  border: 1px solid rgba(255,255,255,0.14); background: #2b2b2b; cursor: pointer; overflow: hidden;',
			'  display: flex; align-items: center; justify-content: center; transition: border-color 0.12s, background 0.12s; }',
			'.gesture_slot_square:hover { border-color: #6cb6ff; background: #333333; }',
			'.gesture_slot_icon { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }',
			'.gesture_slot_empty { font-size: 26px; line-height: 1; color: rgba(255,255,255,0.32); pointer-events: none; }',
			'.gesture_slot_remove { position: absolute; top: 2px; right: 5px; font-size: 15px; line-height: 1; color: rgba(255,255,255,0.7); }',
			'.gesture_slot_remove:hover { color: #ff8a8a; }',
			'.gesture_slot_label { max-width: 100%; font-size: 10px; line-height: 1.2; text-align: center; opacity: 0.85;',
			'  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
			'.gesture_slot_square input[type="file"] { display: none; }'
		].join('\n');
		document.head.appendChild(styleNode);
	}

	function resolveCondition(condition, context) {
		if (typeof Condition === 'function') return !!Condition(condition, context);
		if (typeof condition === 'function') return !!condition(context);
		return condition !== false;
	}

	function restrictWorkspaceTools(active) {
		if (typeof BarItems === 'undefined') return;
		if (active && toolConditions) return;
		if (!active && !toolConditions) return;
		const tools = (typeof Tool !== 'undefined' && Array.isArray(Tool.all))
			? Tool.all
			: ALLOWED_TOOLS.map(function (id) { return BarItems[id]; }).filter(Boolean);
		if (active) {
			toolConditions = {};
			tools.forEach(function (tool) {
				if (!tool || !tool.id) return;
				toolConditions[tool.id] = tool.condition;
				const original = tool.condition;
				tool.condition = function (context) {
					if (!workspaceActive()) return resolveCondition(original, context);
					return ALLOWED_TOOLS.indexOf(tool.id) !== -1 && resolveCondition(original, context);
				};
			});
			ALLOWED_TOOLS.forEach(function (id) {
				const tool = BarItems[id];
				if (tool && tool.id) tool.alt_tool = id === 'move_tool' ? 'rotate_tool' : 'pivot_tool';
			});
		} else {
			tools.forEach(function (tool) {
				if (tool && tool.id && Object.prototype.hasOwnProperty.call(toolConditions, tool.id)) {
					tool.condition = toolConditions[tool.id];
				}
			});
			toolConditions = null;
		}
		if (typeof BARS !== 'undefined' && typeof BARS.updateConditions === 'function') BARS.updateConditions();
		if (typeof updateInterface === 'function') updateInterface();
	}

	/* Outliner toggle next to eye/lock. Blockbench flips `node.gestureFree`
	 * itself through the generic dragToggle handler; the registered Property
	 * makes that state reactive, undoable and stored in the .bbmodel file. */
	function installOutlinerFreeButton() {
		if (typeof Outliner === 'undefined' || !Outliner.buttons || Outliner.buttons[FREE_BUTTON_ID]) return;
		freeButton = {
			id: FREE_BUTTON_ID,
			title: 'Free in game (keep its own animation)',
			icon: 'directions_run',
			icon_off: 'check_box_outline_blank',
			advanced_option: false,
			change_children: false,
			condition: {method: function () { return workspaceActive(); }}
		};
		Outliner.buttons[FREE_BUTTON_ID] = freeButton;
		if (typeof Property !== 'undefined' && typeof Group !== 'undefined') {
			freeProperty = new Property(Group, 'boolean', FREE_BUTTON_ID, {default: false});
		}
		if (typeof Group !== 'undefined' && Array.isArray(Group.all)) {
			Group.all.forEach(function (group) {
				if (group[FREE_BUTTON_ID] === undefined) group[FREE_BUTTON_ID] = false;
			});
		}
		refreshOutlinerFreeButton();
	}

	function refreshOutlinerFreeButton() {
		if (!freeButton || typeof Group === 'undefined' || !Group.prototype
				|| !Array.isArray(Group.prototype.buttons)) return;
		const list = Group.prototype.buttons;
		const index = list.indexOf(freeButton);
		if (workspaceActive() && index === -1) list.splice(-1, 0, freeButton);
		else if (!workspaceActive() && index !== -1) list.splice(index, 1);
		if (typeof Outliner !== 'undefined' && Outliner.vue && Outliner.vue.options) {
			Outliner.vue.options.update_conditions++;
		}
	}

	function uninstallOutlinerFreeButton() {
		if (freeButton && typeof Group !== 'undefined' && Group.prototype
				&& Array.isArray(Group.prototype.buttons)) {
			const index = Group.prototype.buttons.indexOf(freeButton);
			if (index !== -1) Group.prototype.buttons.splice(index, 1);
		}
		if (freeProperty && typeof freeProperty.delete === 'function') freeProperty.delete();
		freeProperty = null;
		if (typeof Outliner !== 'undefined' && Outliner.buttons) delete Outliner.buttons[FREE_BUTTON_ID];
		freeButton = null;
	}

	/* Persist the project-level gesture settings inside the .bbmodel file. */
	function registerProjectProperty() {
		if (typeof Property === 'undefined' || typeof ModelProject === 'undefined') return;
		const properties = ModelProject.properties || {};
		if (!properties.gesturePlayMode) {
			projectProperty = new Property(ModelProject, 'enum', 'gesturePlayMode', {
				label: 'Type',
				values: ['ONCE', 'LOOP', 'HOLD'],
				options: {ONCE: 'play once', LOOP: 'loop', HOLD: 'hold on last frame'},
				default: function () { return validPlayMode(settings.defaultPlayMode) || 'ONCE'; },
				condition: function () { return workspaceActive(); }
			});
		}
		if (!properties[RESTRICT_PROPERTY]) {
			restrictProperty = new Property(ModelProject, 'boolean', RESTRICT_PROPERTY, {
				label: 'Restrict movement',
				default: false,
				condition: function () { return workspaceActive(); }
			});
		}
		if (!properties[ICON_PROPERTY]) {
			iconProperty = new Property(ModelProject, 'string', ICON_PROPERTY, {
				label: 'Icon timecode',
				default: '',
				condition: function () { return workspaceActive(); }
			});
		}
		if (!properties[FILE_PROPERTY]) {
			fileProperty = new Property(ModelProject, 'string', FILE_PROPERTY, {
				exposed: false,
				default: '',
				condition: function () { return workspaceActive(); }
			});
		}
		if (!properties[LOOP_PROPERTY]) {
			loopProperty = new Property(ModelProject, 'string', LOOP_PROPERTY, {
				exposed: false,
				default: '',
				condition: function () { return workspaceActive(); }
			});
		}
	}

	function openProjectSettings() {
		const animation = currentAnimation();
		const form = {
			name: {label: 'Gesture name', value: gestureName(animation)},
			playMode: {
				label: 'Type',
				type: 'select',
				value: gesturePlayMode(animation),
				options: {ONCE: 'play once', LOOP: 'loop', HOLD: 'hold on last frame'}
			},
			restrictMovement: {
				label: 'Restrict player movement (cannot walk)',
				type: 'checkbox',
				value: movementRestricted()
			},
			icon: {
				label: 'Icon timecode (seconds)',
				description: 'Pose time used for the wheel and world icons. Empty or past the gesture length uses the default.',
				type: 'text',
				value: iconTimecode()
			}
		};
		new Dialog({
			id: 'gestures_project_settings',
			title: 'Gesture project settings',
			width: 460,
			form: form,
			onConfirm: function (result) {
				const name = String(result.name || '').trim() || 'Gesture';
				const playMode = validPlayMode(result.playMode) || 'ONCE';
				setProjectValue('name', name);
				setProjectValue('gesturePlayMode', playMode);
				setMovementRestricted(result.restrictMovement === true);
				setIconTimecode(result.icon);
				if (typeof Project !== 'undefined' && Project) Project.saved = false;
				if (animation) {
					animation.name = name;
					if (typeof animation.setLoop === 'function') animation.setLoop(blockbenchLoop(playMode), false);
					else animation.loop = blockbenchLoop(playMode);
					const range = loopRange(animation);
					setMeta(animation, {
						id: gestureId(animation),
						name: gestureName(animation),
						playMode: playMode,
						loopStart: range[0],
						loopEnd: range[1]
					});
				}
				if (typeof Blockbench !== 'undefined' && typeof Blockbench.dispatchEvent === 'function') {
					Blockbench.dispatchEvent('update_project_settings', {
						name: name,
						gesturePlayMode: playMode,
						restrictMovement: movementRestricted(),
						icon: iconTimecode()
					});
				}
				if (typeof BARS !== 'undefined' && typeof BARS.updateConditions === 'function') BARS.updateConditions();
				if (typeof updateInterface === 'function') updateInterface();
				syncTimelineRange();
				renderLoopStrip();
			}
		}).show();
	}

	/* Blockbench's project window always adds Default UV mode, UV size and the
	 * format identifier. None of that belongs to a gesture project. Replace the
	 * action entirely while our format is active, and keep re-checking it so a
	 * later Blockbench/action refresh cannot bring the native dialog back. */
	function projectDialogOverride() {
		if (workspaceActive()) openProjectSettings();
		else if (projectWindowClick) return projectWindowClick.apply(this, arguments);
	}

	function installProjectDialogOverride() {
		if (typeof BarItems === 'undefined' || !BarItems.project_window) return;
		const item = BarItems.project_window;
		if (item.click && item.click.gesturesOverride) return;
		if (!projectWindowClick || projectWindowClick.gesturesOverride) {
			projectWindowClick = item.click;
			projectWindowOnClick = item.onClick;
		}
		projectDialogOverride.gesturesOverride = true;
		item.onClick = projectDialogOverride;
		item.click = projectDialogOverride;
	}

	function restoreProjectDialogOverride() {
		if (!projectWindowClick || typeof BarItems === 'undefined' || !BarItems.project_window) return;
		BarItems.project_window.onClick = projectWindowOnClick;
		BarItems.project_window.click = projectWindowClick;
		projectWindowClick = null;
		projectWindowOnClick = null;
	}

	/* Blockbench binds Ctrl+S to the built-in "export_over" action. In a
	 * gesture workspace that action must write our gesture JSON instead of the
	 * .bbmodel project, otherwise the user has to export every time. */
	function saveOverride() {
		if (workspaceActive()) return saveGestureFile.apply(this, arguments);
		if (saveClick) return saveClick.apply(this, arguments);
	}

	function installSaveOverride() {
		if (typeof BarItems === 'undefined' || !BarItems.export_over) return;
		const item = BarItems.export_over;
		if (item.click && item.click.gesturesOverride) return;
		if (!saveClick || saveClick.gesturesOverride) {
			saveClick = item.click;
			saveOnClick = item.onClick;
		}
		saveOverride.gesturesOverride = true;
		item.onClick = saveOverride;
		item.click = saveOverride;
	}

	function restoreSaveOverride() {
		if (!saveClick || typeof BarItems === 'undefined' || !BarItems.export_over) return;
		BarItems.export_over.onClick = saveOnClick;
		BarItems.export_over.click = saveClick;
		saveClick = null;
		saveOnClick = null;
	}

	/* Strip every stock project field (model identifier, texture size, UV mode,
	 * author/description, ...) from the project type while a gesture project is
	 * open. Only the gesture name and type remain. */
	function hideForeignProjectProperties(active) {
		if (typeof ModelProject === 'undefined' || !ModelProject.properties) return;
		if (active) {
			if (projectPropertyVisibility) return;
			projectPropertyVisibility = {};
			Object.keys(ModelProject.properties).forEach(function (key) {
				if (key === 'name' || key === 'gesturePlayMode') return;
				const property = ModelProject.properties[key];
				projectPropertyVisibility[key] = property.exposed;
				property.exposed = false;
			});
		} else {
			if (!projectPropertyVisibility) return;
			Object.keys(projectPropertyVisibility).forEach(function (key) {
				const property = ModelProject.properties[key];
				if (property) property.exposed = projectPropertyVisibility[key];
			});
			projectPropertyVisibility = null;
		}
	}

	function restrictAnimationUi(active) {
		const panel = (typeof Panels !== 'undefined') ? Panels.animations : null;
		if (active) {
			if (panel && !animationPanelPatched) {
				animationPanelPatched = true;
				animationPanelCondition = panel.condition;
				const original = panel.condition;
				panel.condition = function (context) {
					return !workspaceActive() && resolveCondition(original, context);
				};
			}
			['add_animation', 'add_animation_controller', 'create_animation_group'].forEach(function (id) {
				if (typeof BarItems === 'undefined' || !BarItems[id]) return;
				if (Object.prototype.hasOwnProperty.call(animationActionConditions, id)) return;
				const item = BarItems[id];
				animationActionConditions[id] = item.condition;
				const original = item.condition;
				item.condition = function (context) {
					return !workspaceActive() && resolveCondition(original, context);
				};
			});
		} else {
			if (panel && animationPanelPatched) {
				panel.condition = animationPanelCondition;
				animationPanelPatched = false;
				animationPanelCondition = null;
			}
			Object.keys(animationActionConditions).forEach(function (id) {
				if (typeof BarItems !== 'undefined' && BarItems[id]) BarItems[id].condition = animationActionConditions[id];
			});
			animationActionConditions = {};
		}
		if (typeof BARS !== 'undefined' && typeof BARS.updateConditions === 'function') BARS.updateConditions();
		if (typeof updateInterface === 'function') updateInterface();
	}

	function registerWorkspace() {
		if (typeof ModelFormat === 'undefined' || typeof Formats === 'undefined') return null;
		if (Formats[FORMAT_ID]) {
			workspaceFormat = Formats[FORMAT_ID];
			return workspaceFormat;
		}
		const codec = (Formats.free && Formats.free.codec) || undefined;
		workspaceFormat = new ModelFormat(FORMAT_ID, {
			name: 'Gestures',
			description: 'Animate the six player body parts and export a gesture JSON file.',
			/* Blockbench's built-in hexagon matches the gesture wheel. */
			icon: 'hexagon',
			category: 'minecraft',
			target: 'Minecraft',
			show_on_start_screen: true,
			/* The action installed into File → New is the single entry point. */
			show_in_new_list: false,
			codec: codec,
			bone_rig: true,
			centered_grid: true,
			box_uv: true,
			optional_box_uv: false,
			model_identifier: false,
			animation_mode: true,
			animation_files: false,
			animation_grouping: 'disabled',
			edit_mode: false,
			paint_mode: false,
			display_mode: false,
			pose_mode: false,
			meshes: false,
			splines: false,
			billboards: false,
			locators: false,
			bounding_boxes: false,
			stretch_cubes: false,
			format_page: {
				content: [
					{type: 'h3', text: 'Gestures'},
					{text: 'One project = one gesture. Project settings hold the gesture name and type; the file id is generated from the name. '
						+ 'The workspace opens a ready-made Steve rig in animation mode with move, rotate and pivot tools.'}
				]
			},
			onSetup: function (project, newModel) {
				if (newModel) {
					createPlayerRig();
					createDefaultAnimation();
				}
				applyWorkspaceUI();
			},
			onActivation: applyWorkspaceUI,
			onDeactivation: restoreWorkspaceUI,
			new: function () {
				if (typeof newProject !== 'function') return false;
				newProject(workspaceFormat);
				if (typeof Modes !== 'undefined' && Modes.options && Modes.options.animate) {
					Modes.options.animate.select();
				}
				if (typeof Animation !== 'undefined' && !Animation.all.length) createDefaultAnimation();
				installProjectDialogOverride();
				openProjectSettings();
				return true;
			}
		});
		return workspaceFormat;
	}

	/* Blockbench's Recover (and Open Project) builds the project with
	 * setupProject() + Codecs.project.parse(). Unlike a normal bbmodel load it
	 * never selects an animation, so the timeline, loop strip and pose stayed
	 * empty. Finish the setup once the parsed project data is in place. */
	function finalizeLoadedGesture() {
		if (!workspaceActive()) return;
		try {
			ensureHitboxAppearance();
			applyWorkspaceUI();
			if (typeof Modes !== 'undefined' && Modes.options && Modes.options.animate
					&& (!Modes.selected || Modes.selected.id !== 'animate')) {
				Modes.options.animate.select();
			}
			if (typeof Animation !== 'undefined' && Array.isArray(Animation.all) && Animation.all.length) {
				if (!Animation.selected || Animation.all.indexOf(Animation.selected) === -1) {
					Animation.all[0].select();
				}
				if (typeof Animator !== 'undefined' && Animator.preview) Animator.preview();
			}
			refreshOutlinerFreeButton();
			syncTimelineRange();
			renderLoopStrip();
		} catch (err) {
			console.warn('[Gestures] Could not finish loading the gesture project', err);
		}
	}

	function onProjectParsed() {
		finalizeLoadedGesture();
		/* editor_state (mode, selection) is merged right after this event. */
		const project = Project;
		setTimeout(function () {
			if (Project === project) finalizeLoadedGesture();
		}, 60);
	}

	function installParseHook() {
		if (parsedListener || typeof Codecs === 'undefined' || !Codecs.project || typeof Codecs.project.on !== 'function') return;
		parsedListener = onProjectParsed;
		Codecs.project.on('parsed', parsedListener);
	}

	function removeParseHook() {
		if (!parsedListener) return;
		try {
			if (Codecs.project && typeof Codecs.project.removeListener === 'function') {
				Codecs.project.removeListener('parsed', parsedListener);
			}
		} catch (err) { /* ignore */ }
		parsedListener = null;
	}

	function applyWorkspaceUI() {
		ensureProjectTextureSize();
		ensureHitboxAppearance();
		hideForeignProjectProperties(true);
		installProjectDialogOverride();
		installSaveOverride();
		if (typeof document === 'undefined') return;
		installWorkspaceStyle();
		document.body.classList.add('gestures-workspace');
		restrictWorkspaceTools(true);
		restrictAnimationUi(true);
		installLoopStrip();
		watchTimelineChanges();
		syncTimelineRange();
		renderLoopStrip();
	}

	function restoreWorkspaceUI() {
		hideForeignProjectProperties(false);
		restoreProjectDialogOverride();
		restoreSaveOverride();
		if (typeof document !== 'undefined') document.body.classList.remove('gestures-workspace');
		restrictWorkspaceTools(false);
		restrictAnimationUi(false);
		setTimelineRange(0, 0);
		renderLoopStrip();
	}

	/* Timeline regions for a LOOP gesture: green Start before the loop, blue
	 * repeating loop in the middle, orange End after it. The two draggable
	 * handles set all three boundaries at once. */
	function loopSize() {
		if (typeof Timeline !== 'undefined' && Timeline.vue) {
			const size = number(Timeline.vue._data ? Timeline.vue._data.size : Timeline.vue.size);
			if (size > 0) return size;
		}
		return 50;
	}

	function installLoopStrip() {
		if (typeof document === 'undefined') return;
		const holder = document.getElementById('timeline_time');
		if (!holder || holder.querySelector('.gestures-loop-handle')) return;
		watchTimelineChanges();
		/* Start and End are the parts outside the loop region. They are drawn as
		 * separate areas, but their boundaries are the existing loop handles. */
		const intro = document.createElement('div');
		intro.className = 'gestures-loop-region intro';
		intro.title = 'Start — played when the gesture begins';
		const outro = document.createElement('div');
		outro.className = 'gestures-loop-region outro';
		outro.title = 'End — played when the gesture stops';
		const start = document.createElement('div');
		start.className = 'gestures-loop-handle start';
		start.setAttribute('data-label', 'loop_start');
		start.title = 'loop_start — drag to change the loop start';
		const end = document.createElement('div');
		end.className = 'gestures-loop-handle end';
		end.setAttribute('data-label', 'loop_end');
		end.title = 'loop_end — drag to change the loop end';
		const grip = document.createElement('div');
		grip.className = 'gestures-loop-grip';
		grip.title = 'Drag the whole loop region';
		start.addEventListener('mousedown', function (event) { beginLoopDrag(event, 'start'); });
		end.addEventListener('mousedown', function (event) { beginLoopDrag(event, 'end'); });
		grip.addEventListener('mousedown', function (event) { beginLoopDrag(event, 'move'); });
		holder.appendChild(intro);
		holder.appendChild(outro);
		holder.appendChild(start);
		holder.appendChild(end);
		holder.appendChild(grip);
		loopHandles = {intro: intro, outro: outro, start: start, end: end, grip: grip};
		renderLoopStrip();
	}

	function renderLoopStrip() {
		if (typeof document === 'undefined') return;
		document.body.classList.toggle('gestures-loop-hidden', !loopStripVisible(
			(typeof Animation !== 'undefined') ? Animation.selected : null
		));
		if (!loopHandles) return;
		const holder = document.getElementById('timeline_time');
		if (!holder) return;
		const animation = (typeof Animation !== 'undefined') ? Animation.selected : null;
		const visible = loopStripVisible(animation);
		const display = visible ? '' : 'none';
		Object.keys(loopHandles).forEach(function (key) {
			loopHandles[key].style.display = display;
		});
		if (!visible) return;
		const range = loopRange(animation);
		const size = loopSize();
		const duration = animationDuration(animation);
		loopHandles.intro.style.left = '0px';
		loopHandles.intro.style.width = (range[0] * size) + 'px';
		loopHandles.intro.style.display = range[0] > 0.001 ? '' : 'none';
		loopHandles.outro.style.left = (range[1] * size) + 'px';
		loopHandles.outro.style.width = (Math.max(0, duration - range[1]) * size) + 'px';
		loopHandles.outro.style.display = duration - range[1] > 0.001 ? '' : 'none';
		loopHandles.start.style.left = (range[0] * size) + 'px';
		loopHandles.end.style.left = (range[1] * size) + 'px';
		loopHandles.grip.style.left = ((range[0] + range[1]) * 0.5 * size) + 'px';
	}

	/* Blockbench redraws its own ruler on zoom, but the handles are plugin DOM.
	 * Watching the timeline Vue data keeps them glued to the same scale. */
	function clearTimelineWatchers() {
		timelineUnwatchers.forEach(function (unwatch) {
			if (typeof unwatch === 'function') {
				try { unwatch(); } catch (err) { console.warn('[Gestures] Could not unwatch timeline', err); }
			}
		});
		timelineUnwatchers = [];
		timelineVueWatched = null;
	}

	function watchTimelineChanges() {
		if (typeof Timeline === 'undefined' || !Timeline.vue || typeof Timeline.vue.$watch !== 'function') return;
		const vue = Timeline.vue;
		if (timelineVueWatched === vue) return;
		clearTimelineWatchers();
		timelineVueWatched = vue;
		timelineUnwatchers.push(vue.$watch('size', function () { renderLoopStrip(); }));
		timelineUnwatchers.push(vue.$watch('length', function () { renderLoopStrip(); }));
		timelineUnwatchers.push(vue.$watch('animation_length', function () {
			syncTimelineRange();
			renderLoopStrip();
		}));
	}

	function loopSnap(time, event) {
		if (event && (event.shiftKey || event.ctrlKey || event.metaKey)) return round(time, 4);
		if (typeof Timeline !== 'undefined' && typeof Timeline.snapTime === 'function') {
			return number(Timeline.snapTime(time));
		}
		return Math.round(time * 20) / 20;
	}

	function beginLoopDrag(event, mode) {
		event.preventDefault();
		event.stopPropagation();
		const animation = (typeof Animation !== 'undefined') ? Animation.selected : null;
		if (!animation || !workspaceActive()) return;
		const size = loopSize();
		const initial = loopRange(animation);
		const originX = event.clientX;
		const duration = animationDuration(animation);
		const minWidth = Math.min(0.05, duration);
		loopDragging = mode;
		document.body.style.cursor = mode === 'move' ? 'grabbing' : 'ew-resize';

		function onMove(moveEvent) {
			const delta = number(moveEvent.clientX - originX) / size;
			let start = initial[0];
			let end = initial[1];
			if (mode === 'start') {
				start = clamp(loopSnap(start + delta, moveEvent), 0, Math.max(0, end - minWidth));
			} else if (mode === 'end') {
				end = clamp(loopSnap(end + delta, moveEvent), Math.min(start + minWidth, duration), duration);
			} else {
				const width = Math.min(initial[1] - initial[0], duration);
				start = loopSnap(clamp(start + delta, 0, Math.max(0, duration - width)), moveEvent);
				end = loopSnap(clamp(start + width, start, duration), moveEvent);
			}
			setLoopRange(animation, start, end);
		}
		function onUp() {
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseup', onUp);
			document.body.style.cursor = '';
			loopDragging = null;
		}
		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseup', onUp);
	}

	function bindEvents() {
		if (!Blockbench || typeof Blockbench.on !== 'function') return;
		const bindings = [
			['select_animation', function () { syncTimelineRange(); renderLoopStrip(); }],
			['edit_animation_properties', function () {
				const animation = currentAnimation();
				if (animation) {
					const range = loopRange(animation);
					setLoopRange(animation, range[0], range[1], true);
				}
				syncTimelineRange();
				renderLoopStrip();
			}],
			['select_format', function () {
				if (workspaceActive()) applyWorkspaceUI();
				else restoreWorkspaceUI();
				refreshOutlinerFreeButton();
				installLoopStrip();
				syncTimelineRange();
				renderLoopStrip();
				installProjectDialogOverride();
				installSaveOverride();
			}],
			['select_project', function () {
				if (workspaceActive()) ensureHitboxAppearance();
				installProjectDialogOverride();
				installSaveOverride();
				syncSlotsPanel();
				syncTimelineRange();
				renderLoopStrip();
			}],
			['close_project', function (data) {
				if (data && data.project) {
					disposeSlotStore(data.project);
					delete slotStores[data.project.uuid];
				}
			}],
			['change_view_mode', function () {
				/* Keep the guide translucent: solid/colored view would ignore
				 * the low-alpha texture and paint the hitbox opaque. */
				if (workspaceActive()) ensureHitboxAppearance();
			}],
			['update_project_settings', function () {
				syncTimelineRange();
				renderLoopStrip();
				installProjectDialogOverride();
				installSaveOverride();
			}],
			['open_bar_menu', function (data) {
				if (data && data.menu && data.menu.id === 'file') {
					installProjectDialogOverride();
					installSaveOverride();
				}
			}],
			['select_mode', function () { installLoopStrip(); renderLoopStrip(); }],
			/* Undo saves capture the mode at creation time. A gesture project must
			 * never fall back to Edit (which would reveal the UV panel). */
			['load_undo_save', function () {
				if (workspaceActive() && typeof Modes !== 'undefined' && Modes.options
						&& Modes.options.animate
						&& (!Modes.selected || Modes.selected.id !== 'animate')) {
					Modes.options.animate.select();
				}
			}],
			['remove_animation', function () { renderLoopStrip(); }],
			['update_selection', function () { renderLoopStrip(); }]
		];
		bindings.forEach(function (binding) {
			try {
				Blockbench.on(binding[0], binding[1]);
				eventBindings.push(binding);
			} catch (err) {
				console.warn('[Gestures] Could not bind ' + binding[0], err);
			}
		});
	}

	function unbindEvents() {
		if (!Blockbench || typeof Blockbench.removeListener !== 'function') return;
		eventBindings.forEach(function (binding) {
			try {
				Blockbench.removeListener(binding[0], binding[1]);
			} catch (err) {
				console.warn('[Gestures] Could not unbind ' + binding[0], err);
			}
		});
		eventBindings = [];
	}

	/* --- About ------------------------------------------------------------- */

	function aboutMarkdown() {
		const link = function (label, url) {
			return url ? '[' + label + '](' + url + ')' : label + ' - coming soon';
		};
		const lines = [
			'**Gestures** is the companion Blockbench plugin for the **Gestures** Fabric mod for Minecraft. '
				+ 'It gives you a ready-made player rig and a timeline, and writes the gesture JSON files the mod plays in game.',
			'',
			'#### Get the Gestures mod',
			'* ' + link('Modrinth', LINKS.modrinth),
			'* ' + link('CurseForge', LINKS.curseforge),
			'',
			'#### Features',
			'* Dedicated **Gestures** project: Steve rig, animation mode, move / rotate / pivot tools',
			'* One project = one gesture; the gesture name and file id come from the project name',
			'* Play types: play once, loop (with draggable start / loop / end regions) and hold on last frame',
			'* Hitbox root for player movement and gaze direction',
			'* **Free parts** keep their vanilla animation in game; optional movement restriction',
			'* Item and armour **slots** with live item model previews',
			'* Icon timecode for the gesture wheel and world icons',
			'* Every opened gesture gets its own tab; Recover and reopened projects keep the file path and loop region',
			'',
			'#### How to use',
			'1. File \u2192 New \u2192 **New gesture workspace**, or **Open Gesture** for an existing JSON (drag & drop works too)',
			'2. Animate the body parts and slots on the timeline',
			'3. **Ctrl+S** saves the gesture JSON; File \u2192 Export \u2192 Gesture always asks for a location',
			'4. Put the file into `config/gestures/animations` of your Minecraft instance',
			'',
			'#### Support the project',
			'If the plugin or the mod is useful to you, you can support development: [Buy Me a Coffee](' + LINKS.coffee + ')',
		];
		if (LINKS.discord) lines.push('', 'Questions, bugs and commissions: [Discord](' + LINKS.discord + ')');
		lines.push('', 'Made by sad. Desktop Blockbench only. Version ' + PLUGIN_VERSION + '.');
		return lines.join('\n');
	}

	function openAbout() {
		const entries = [
			{label: 'Modrinth', url: LINKS.modrinth},
			{label: 'CurseForge', url: LINKS.curseforge},
			{label: 'Buy Me a Coffee', url: LINKS.coffee}
		];
		if (LINKS.discord) entries.push({label: 'Discord', url: LINKS.discord});
		const form = {
			info: {
				type: 'info',
				text: 'Gestures v' + PLUGIN_VERSION + ' - the Blockbench companion for the Gestures Fabric mod. '
					+ 'Build a gesture on a ready-made player rig, then save it as JSON for the mod.'
			},
			usage: {
				type: 'info',
				text: 'New gesture workspace / Open Gesture in the File menu. Ctrl+S saves the JSON next to where it was opened from; '
					+ 'Export \u2192 Gesture asks for a location. Put files into config/gestures/animations.'
			},
			links: {
				type: 'buttons',
				buttons: entries.map(function (entry) {
					return entry.url ? entry.label : entry.label + ' (coming soon)';
				}),
				click: function (index) {
					const entry = entries[index];
					if (!entry) return;
					if (entry.url) Blockbench.openLink(entry.url);
					else Blockbench.showQuickMessage(entry.label + ' page is not published yet', 3000);
				}
			},
			author: {
				type: 'info',
				text: 'Made by sad. Desktop Blockbench only.'
			}
		};
		new Dialog({
			id: 'gestures_about',
			title: 'About Gestures',
			width: 480,
			form: form,
			buttons: ['dialog.close']
		}).show();
	}

	Plugin.register(PLUGIN_ID, {
		title: 'Gestures',
		author: 'sad',
		description: 'Animation workspace and JSON import/export for the Fabric Gestures mod.',
		tags: ['Minecraft: Java Edition', 'Animation'],
		contributes: {formats: [FORMAT_ID]},
		/* Repository format: gestures.png sits next to this file in plugins/gestures/. */
		icon: 'gestures.png',
		version: PLUGIN_VERSION,
		min_version: '4.9.0',
		variant: 'desktop',
		onload: function () {
			loadState();
			registerPluginSettings();
			registerProjectProperty();
			installOutlinerFreeButton();
			registerWorkspace();
			installWorkspaceStyle();
			registerSlotsPanel();
			installProjectDialogOverride();
			installSaveOverride();
			installGestureDropHandler();
			installParseHook();
			bindEvents();
			if (workspaceActive()) applyWorkspaceUI();

			function addAction(id, data, path) {
				const action = new Action(id, data);
				actions.push(action);
				if (path) MenuBar.addAction(action, path);
				return action;
			}

			addAction(PLUGIN_ID + '.export', {
				name: 'Gesture',
				description: 'Save the current gesture as a JSON file',
				icon: 'hexagon',
				category: 'file',
				condition: function () {
					return typeof Modes !== 'undefined' && Modes.animate && !!currentAnimation() && workspaceActive();
				},
				click: exportGestureFile
			}, 'file.export');
			installOpenGestureAction(addAction(PLUGIN_ID + '.import', {
				name: 'Open Gesture',
				description: 'Open a gesture JSON file from any folder',
				icon: 'hexagon',
				category: 'file',
				/* Always visible, like Open Model. Import creates a gesture
				 * workspace when the current project is not a gesture. */
				click: openGesture
			}));

			addAction(PLUGIN_ID + '.about', {
				name: 'About Gestures',
				description: 'Links, usage and support for the Gestures mod plugin',
				icon: 'info',
				category: 'help',
				click: openAbout
			}, 'help');

			/* File → New gesture workspace (not a top-level File item). */
			installNewWorkspaceAction(addAction(PLUGIN_ID + '.new', {
				name: 'New gesture workspace',
				description: 'Create a project with the player rig in animation mode',
				icon: 'hexagon',
				category: 'file',
				click: function () {
					if (workspaceFormat && typeof workspaceFormat.new === 'function') workspaceFormat.new();
				}
			}));
		},
		onunload: function () {
			actions.forEach(function (action) { action.delete(); });
			actions = [];
			restoreNewWorkspaceAction();
			restoreOpenGestureAction();
			removeParseHook();
			Object.keys(slotStores).forEach(function (key) {
				const store = slotStores[key];
				SLOTS.forEach(function (slot) {
					try { clearSlotPreview(slot, store); } catch (err) { /* ignore */ }
				});
				delete slotStores[key];
			});
			unregisterSlotsPanel();
			if (iconRenderer && iconRenderer.renderer && typeof iconRenderer.renderer.dispose === 'function') {
				try { iconRenderer.renderer.dispose(); } catch (err) { /* ignore */ }
			}
			iconRenderer = null;
			unregisterPluginSettings();
			unbindEvents();
			clearTimelineWatchers();
			removeGestureDropHandler();
			restoreWorkspaceUI();
			if (loopHandles && typeof document !== 'undefined') {
				Object.keys(loopHandles).forEach(function (key) {
					if (loopHandles[key] && loopHandles[key].parentNode) loopHandles[key].parentNode.removeChild(loopHandles[key]);
				});
			}
			loopHandles = null;
			if (styleNode && typeof document !== 'undefined' && styleNode.parentNode) {
				styleNode.parentNode.removeChild(styleNode);
			}
			styleNode = null;
			if (projectProperty && typeof projectProperty.delete === 'function') projectProperty.delete();
			projectProperty = null;
			if (restrictProperty && typeof restrictProperty.delete === 'function') restrictProperty.delete();
			restrictProperty = null;
			if (iconProperty && typeof iconProperty.delete === 'function') iconProperty.delete();
			iconProperty = null;
			if (fileProperty && typeof fileProperty.delete === 'function') fileProperty.delete();
			fileProperty = null;
			if (loopProperty && typeof loopProperty.delete === 'function') loopProperty.delete();
			loopProperty = null;
			uninstallOutlinerFreeButton();
			if (typeof Formats !== 'undefined') delete Formats[FORMAT_ID];
			workspaceFormat = null;
		}
	});
})();
