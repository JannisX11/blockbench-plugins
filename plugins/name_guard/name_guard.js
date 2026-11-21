(function() {
	'use strict';

	const PLUGIN_ID = 'name_guard';
	const FALLBACK_NAME = 'part';

	let cleanNamesAction;

	function sanitizeName(value, fallback = FALLBACK_NAME) {
		const sanitized = String(value || '')
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9_.-]+/g, '_')
			.replace(/_+/g, '_')
			.replace(/^_+|_+$/g, '');

		return sanitized || fallback;
	}

	function uniqueName(baseName, usedNames) {
		let name = baseName;
		let index = 2;

		while (usedNames.has(name)) {
			name = `${baseName}_${index}`;
			index += 1;
		}

		usedNames.add(name);
		return name;
	}

	function getChildGroups(group) {
		return group.children.filter(child => child instanceof Group);
	}

	function getChildCubes(group) {
		return group.children.filter(child => child instanceof Cube);
	}

	function renameGroupTree(group, usedNamesByGroup) {
		const parent = group.parent instanceof Group ? group.parent : null;
		const usedNames = usedNamesByGroup.get(parent) || new Set();
		usedNamesByGroup.set(parent, usedNames);

		group.name = uniqueName(sanitizeName(group.name), usedNames);

		const childGroupNames = new Set();
		usedNamesByGroup.set(group, childGroupNames);
		getChildGroups(group).forEach(childGroup => renameGroupTree(childGroup, usedNamesByGroup));

		const cubeBaseName = sanitizeName(group.name);
		getChildCubes(group).forEach(cube => {
			cube.name = cubeBaseName;
		});
	}

	function cleanRootCubes() {
		const usedNames = new Set();
		Cube.all
			.filter(cube => !(cube.parent instanceof Group))
			.forEach(cube => {
				cube.name = uniqueName(sanitizeName(cube.name), usedNames);
			});
	}

	function cleanNames() {
		if (!Project) {
			Blockbench.showQuickMessage('Open or create a project first.');
			return;
		}

		Undo.initEdit({outliner: true, elements: Cube.all});

		const rootGroups = Group.all.filter(group => !(group.parent instanceof Group));
		const usedNamesByGroup = new Map();
		rootGroups.forEach(group => renameGroupTree(group, usedNamesByGroup));
		cleanRootCubes();

		Undo.finishEdit('Clean names');
		Canvas.updateAll();
		Blockbench.showQuickMessage('Names cleaned.');
	}

	Plugin.register(PLUGIN_ID, {
		title: 'Name Guard',
		author: 'Dedou3D',
		description: 'Clean folder and cube names for safe ModelEngine exports.',
		icon: 'drive_file_rename_outline',
		version: '1.0.0',
		variant: 'both',
		min_version: '4.0.0',
		new_repository_format: true,
		tags: ['Minecraft', 'ModelEngine', 'Utility'],
		onload() {
			cleanNamesAction = new Action('clean_name_guard_names', {
				name: 'Clean Names',
				description: 'Clean folder and cube names for safe exports.',
				icon: 'drive_file_rename_outline',
				category: 'edit',
				click: cleanNames
			});

			MenuBar.addAction(cleanNamesAction, 'filter');
		},
		onunload() {
			if (cleanNamesAction) {
				cleanNamesAction.delete();
				cleanNamesAction = null;
			}
		}
	});
})();
