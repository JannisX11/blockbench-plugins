(function() {
	'use strict';

	const PLUGIN_ID = 'armor_exploded_view';
	const STORAGE_KEY = `${PLUGIN_ID}.settings`;

	const DEFAULT_SETTINGS = Object.freeze({
		armOffset: 4,
		legOffset: 3,
		legDrop: 2,
		headLift: 3,
		waistBackOffset: 7,
		waistDrop: 4
	});

	const ACTIONS = Object.freeze({
		toggle: 'toggle_armor_exploded_view',
		settings: 'armor_exploded_view_settings'
	});

	const AXIS = Object.freeze({
		x: 0,
		y: 1,
		z: 2
	});

	const PART_ALIASES = Object.freeze({
		head: ['head', 'helmet', 'helm', 'casque'],
		waist: ['wast', 'waist', 'belt', 'ceinture', 'taille'],
		leftArm: ['leftarm', 'armleft', 'larm', 'brasgauche'],
		rightArm: ['rightarm', 'armright', 'rarm', 'brasdroit'],
		leftLeg: [
			'leftleg',
			'legleft',
			'lleg',
			'leftshoe',
			'shoeleft',
			'leftboot',
			'bootleft',
			'leftfoot',
			'footleft',
			'leftpants',
			'pantsleft',
			'leftjeans',
			'jeansleft',
			'jambegauche',
			'chaussuregauche'
		],
		rightLeg: [
			'rightleg',
			'legright',
			'rleg',
			'rightshoe',
			'shoeright',
			'rightboot',
			'bootright',
			'rightfoot',
			'footright',
			'rightpants',
			'pantsright',
			'rightjeans',
			'jeansright',
			'jambedroite',
			'chaussuredroite'
		]
	});

	const state = {
		exploded: false,
		settings: loadSettings(),
		activeSettings: null,
		entries: [],
		actions: {}
	};

	Plugin.register(PLUGIN_ID, {
		title: 'Armor Exploded View',
		author: 'Dedou3D',
		description: 'Toggle a configurable exploded view for humanoid armor parts.',
		icon: 'open_with',
		variant: 'both',
		version: '1.0.0',
		min_version: '4.0.0',
		new_repository_format: true,
		tags: ['Minecraft', 'Armor', 'Utility'],
		onload() {
			registerActions();
		},
		onunload() {
			if (state.exploded) {
				restoreExplodedView({createUndoPoint: false, showMessage: false});
			}

			Object.values(state.actions).forEach(action => action.delete());
			state.actions = {};
		}
	});

	function registerActions() {
		state.actions.toggle = new Action(ACTIONS.toggle, {
			name: 'Toggle Armor Exploded View',
			description: 'Spread recognized armor parts apart, then press again to restore them.',
			icon: 'open_with',
			category: 'view',
			plugin: PLUGIN_ID,
			searchable: true,
			keybind: new Keybind({key: 'e', ctrl: true, shift: true}),
			click: toggleExplodedView
		});

		state.actions.settings = new Action(ACTIONS.settings, {
			name: 'Armor Exploded View Settings',
			description: 'Configure the exploded view distances.',
			icon: 'settings',
			category: 'view',
			plugin: PLUGIN_ID,
			searchable: true,
			click: openSettingsDialog
		});

		MenuBar.addAction(state.actions.toggle, 'view');
		MenuBar.addAction(state.actions.settings, 'view');

		if (Toolbars.outliner) {
			Toolbars.outliner.add(state.actions.toggle);
		}
	}

	function toggleExplodedView() {
		if (state.exploded) {
			restoreExplodedView({createUndoPoint: true, showMessage: true});
			return;
		}

		applyExplodedView();
	}

	function applyExplodedView() {
		const activeSettings = cloneSettings(state.settings);
		const targets = findExplodableElements(activeSettings);

		if (!targets.length) {
			Blockbench.showQuickMessage('No matching armor parts found');
			return;
		}

		const elements = targets.map(target => target.element);
		state.entries = targets.map(target => ({
			id: getElementId(target.element),
			element: target.element,
			snapshot: createSnapshot(target.element),
			offset: target.offset
		}));
		state.activeSettings = activeSettings;

		Undo.initEdit({elements, outliner: true});

		targets.forEach(target => {
			translateElement(target.element, target.offset);
		});

		refreshElements(elements);
		Undo.finishEdit('Toggle armor exploded view');

		state.exploded = true;
		Blockbench.showQuickMessage(`${targets.length} armor parts moved`);
	}

	function restoreExplodedView(options) {
		const elementMap = buildElementMap();
		const validEntries = state.entries
			.map(entry => Object.assign({}, entry, {element: elementMap.get(entry.id) || entry.element}))
			.filter(entry => isLiveElement(entry.element));
		const originalIds = new Set(validEntries.map(entry => entry.id));
		const addedTargets = findExplodableElements(state.activeSettings || state.settings)
			.filter(target => !originalIds.has(getElementId(target.element)));
		const elements = [
			...validEntries.map(entry => entry.element),
			...addedTargets.map(target => target.element)
		];

		if (!elements.length) {
			clearExplodedState();
			return;
		}

		if (options.createUndoPoint) {
			Undo.initEdit({elements, outliner: true});
		}

		validEntries.forEach(entry => {
			restoreSnapshot(entry.element, entry.snapshot);
		});

		addedTargets.forEach(target => {
			translateElement(target.element, invertVector(target.offset));
		});

		refreshElements(elements);

		if (options.createUndoPoint) {
			Undo.finishEdit('Restore armor exploded view');
		}

		clearExplodedState();

		if (options.showMessage) {
			Blockbench.showQuickMessage('Armor parts restored');
		}
	}

	function clearExplodedState() {
		state.exploded = false;
		state.activeSettings = null;
		state.entries = [];
	}

	function findExplodableElements(settings) {
		const elements = getOutlinerElements();
		const parentMap = buildParentMap();
		const seen = new Set();
		const targets = [];

		elements.forEach(element => {
			const elementId = getElementId(element);
			if (seen.has(elementId) || !canTranslateElement(element)) return;

			const offset = findOffset(element, parentMap, settings);
			if (!offset) return;

			seen.add(elementId);
			targets.push({element, offset});
		});

		return targets;
	}

	function findOffset(element, parentMap, settings) {
		let node = element;

		while (node) {
			const offset = getNamedOffset(node.name, settings);
			if (offset) return offset;
			node = getParent(node, parentMap);
		}

		return null;
	}

	function getNamedOffset(name, settings) {
		const normalizedName = normalizeName(name);

		if (matchesAnyAlias(normalizedName, PART_ALIASES.head)) {
			return vector(0, settings.headLift, 0);
		}

		if (matchesAnyAlias(normalizedName, PART_ALIASES.waist)) {
			return vector(0, -settings.waistDrop, settings.waistBackOffset);
		}

		if (matchesAnyAlias(normalizedName, PART_ALIASES.leftArm)) {
			return vector(-settings.armOffset, 0, 0);
		}

		if (matchesAnyAlias(normalizedName, PART_ALIASES.rightArm)) {
			return vector(settings.armOffset, 0, 0);
		}

		if (matchesAnyAlias(normalizedName, PART_ALIASES.leftLeg)) {
			return vector(-settings.legOffset, -settings.legDrop, 0);
		}

		if (matchesAnyAlias(normalizedName, PART_ALIASES.rightLeg)) {
			return vector(settings.legOffset, -settings.legDrop, 0);
		}

		return null;
	}

	function openSettingsDialog() {
		new Dialog({
			id: ACTIONS.settings,
			title: 'Armor Exploded View Settings',
			form: {
				armOffset: createNumberField('Arm side offset', state.settings.armOffset),
				legOffset: createNumberField('Leg and shoe side offset', state.settings.legOffset),
				legDrop: createNumberField('Leg and shoe drop', state.settings.legDrop),
				headLift: createNumberField('Head lift', state.settings.headLift),
				waistBackOffset: createNumberField('Waist back offset', state.settings.waistBackOffset),
				waistDrop: createNumberField('Waist drop', state.settings.waistDrop)
			},
			onConfirm(formData) {
				state.settings = sanitizeSettings(formData);
				saveSettings(state.settings);
				Blockbench.showQuickMessage('Exploded view settings saved');
			}
		}).show();
	}

	function createNumberField(label, value) {
		return {
			label,
			type: 'number',
			value,
			min: 0,
			step: 0.25
		};
	}

	function getOutlinerElements() {
		if (typeof Outliner !== 'undefined' && Array.isArray(Outliner.elements)) {
			return Outliner.elements;
		}

		if (typeof Cube !== 'undefined' && Array.isArray(Cube.all)) {
			return Cube.all;
		}

		return [];
	}

	function buildElementMap() {
		const map = new Map();

		getOutlinerElements().forEach(element => {
			map.set(getElementId(element), element);
		});

		return map;
	}

	function getElementId(element) {
		if (!element) return null;
		return element.uuid || element.mesh?.uuid || element.name || element;
	}

	function buildParentMap() {
		const parentMap = new Map();

		if (typeof Group === 'undefined' || !Array.isArray(Group.all)) {
			return parentMap;
		}

		Group.all.forEach(group => {
			if (!Array.isArray(group.children)) return;

			group.children.forEach(child => {
				if (child) parentMap.set(child, group);
			});
		});

		return parentMap;
	}

	function getParent(element, parentMap) {
		if (!element) return null;

		if (element.parent && element.parent !== 'root') {
			return typeof element.parent === 'object' ? element.parent : null;
		}

		return parentMap.get(element) || null;
	}

	function canTranslateElement(element) {
		return Boolean(
			element &&
			(Array.isArray(element.from) || Array.isArray(element.to) || Array.isArray(element.origin))
		);
	}

	function translateElement(element, offset) {
		translateVector(element.from, offset);
		translateVector(element.to, offset);
		translateVector(element.origin, offset);
	}

	function createSnapshot(element) {
		return {
			from: cloneVector(element.from),
			to: cloneVector(element.to),
			origin: cloneVector(element.origin)
		};
	}

	function restoreSnapshot(element, snapshot) {
		restoreVector(element.from, snapshot.from);
		restoreVector(element.to, snapshot.to);
		restoreVector(element.origin, snapshot.origin);
	}

	function refreshElements(elements) {
		elements.forEach(element => {
			if (element && typeof element.updateElement === 'function') {
				element.updateElement();
			}
		});

		Canvas.updateView({
			elements,
			element_aspects: {geometry: true, transform: true},
			selection: true
		});
	}

	function isLiveElement(element) {
		return getOutlinerElements().includes(element);
	}

	function vector(x, y, z) {
		return [x, y, z];
	}

	function invertVector(source) {
		return vector(-source[AXIS.x], -source[AXIS.y], -source[AXIS.z]);
	}

	function translateVector(target, offset) {
		if (!Array.isArray(target)) return;

		target[AXIS.x] += offset[AXIS.x];
		target[AXIS.y] += offset[AXIS.y];
		target[AXIS.z] += offset[AXIS.z];
	}

	function cloneVector(source) {
		return Array.isArray(source) ? source.slice() : null;
	}

	function restoreVector(target, source) {
		if (!Array.isArray(target) || !Array.isArray(source)) return;

		target[AXIS.x] = source[AXIS.x];
		target[AXIS.y] = source[AXIS.y];
		target[AXIS.z] = source[AXIS.z];
	}

	function normalizeName(name) {
		return String(name || '')
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]/g, '');
	}

	function matchesAnyAlias(name, aliases) {
		return aliases.some(alias => name === alias || name.includes(alias));
	}

	function loadSettings() {
		try {
			const savedSettings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
			return sanitizeSettings(Object.assign({}, DEFAULT_SETTINGS, savedSettings));
		} catch (error) {
			return Object.assign({}, DEFAULT_SETTINGS);
		}
	}

	function saveSettings(settings) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	}

	function cloneSettings(settings) {
		return Object.assign({}, settings);
	}

	function sanitizeSettings(settings) {
		return {
			armOffset: readDistance(settings.armOffset, DEFAULT_SETTINGS.armOffset),
			legOffset: readDistance(settings.legOffset, DEFAULT_SETTINGS.legOffset),
			legDrop: readDistance(settings.legDrop, DEFAULT_SETTINGS.legDrop),
			headLift: readDistance(settings.headLift, DEFAULT_SETTINGS.headLift),
			waistBackOffset: readDistance(settings.waistBackOffset, DEFAULT_SETTINGS.waistBackOffset),
			waistDrop: readDistance(settings.waistDrop, DEFAULT_SETTINGS.waistDrop)
		};
	}

	function readDistance(value, fallback) {
		const distance = Number(value);
		return Number.isFinite(distance) && distance >= 0 ? distance : fallback;
	}
})();
