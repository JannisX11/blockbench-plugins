(function() {
	'use strict';

	const PLUGIN_ID = 'hitbox_guard';
	const HITBOX_GROUP_NAME = 'hitbox';
	const HITBOX_CUBE_NAME = 'hitbox';
	const HITBOX_SIZE = Object.freeze({
		x: 14,
		y: 32,
		z: 14
	});

	let createHitboxAction;

	function findHitboxGroup() {
		return Group.all.find(group => group.name.toLowerCase() === HITBOX_GROUP_NAME.toLowerCase()) || null;
	}

	function removeExistingHitbox(group) {
		group.children
			.filter(child => child instanceof Cube && child.name === HITBOX_CUBE_NAME)
			.forEach(cube => cube.remove());
	}

	function createHitbox() {
		if (!Project) {
			Blockbench.showQuickMessage('Open or create a project first.');
			return;
		}

		Undo.initEdit({outliner: true, elements: []});

		let group = findHitboxGroup();
		if (!group) {
			group = new Group({
				name: HITBOX_GROUP_NAME,
				origin: [0, 0, 0],
				visibility: false
			}).init();
		} else {
			group.visibility = false;
		}

		removeExistingHitbox(group);

		const halfX = HITBOX_SIZE.x / 2;
		const halfZ = HITBOX_SIZE.z / 2;
		const cube = new Cube({
			name: HITBOX_CUBE_NAME,
			from: [-halfX, 0, -halfZ],
			to: [halfX, HITBOX_SIZE.y, halfZ],
			origin: [0, 0, 0],
			color: 3,
			box_uv: true,
			visibility: false,
			locked: false
		});

		cube.addTo(group).init();
		Undo.finishEdit('Create hitbox');

		Canvas.updateAll();
		group.select();
		Blockbench.showQuickMessage('Hitbox created: 14 x 32 x 14');
	}

	Plugin.register(PLUGIN_ID, {
		title: 'Hitbox Guard',
		author: 'Dedou3D',
		description: 'Create a hitbox for your models.',
		icon: 'select_all',
		version: '1.0.0',
		variant: 'both',
		min_version: '4.0.0',
		new_repository_format: true,
		tags: ['Minecraft', 'ModelEngine', 'Utility'],
		onload() {
			createHitboxAction = new Action('create_hitbox_guard_hitbox', {
				name: 'Create Hitbox',
				description: 'Create a hidden 14 x 32 x 14 hitbox.',
				icon: 'select_all',
				category: 'edit',
				click: createHitbox
			});

			MenuBar.addAction(createHitboxAction, 'filter');
		},
		onunload() {
			if (createHitboxAction) {
				createHitboxAction.delete();
				createHitboxAction = null;
			}
		}
	});
})();
