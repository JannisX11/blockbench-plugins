(function () {
	let action;

	const PLUGIN_ID = 'batch_group_rename';

	function collectDescendantGroups(group) {
		const result = [];
		(group.children || []).forEach(child => {
			if (child instanceof Group) {
				result.push(child);
				result.push(...collectDescendantGroups(child));
			}
		});
		return result;
	}

	function renameChildGroups(group, prefix, isRoot, recursive) {
		const childGroups = (group.children || []).filter(child => child instanceof Group);
		if (childGroups.length === 0) return;

		childGroups.forEach((child, index) => {
			const num = index + 1;
			const newName = isRoot
				? prefix + num
				: prefix + '_' + num;

			child.name = newName;

			if (recursive) {
				renameChildGroups(child, newName, false, true);
			}
		});
	}

	function openRenameDialog(targetGroup) {
		const baseName = targetGroup.name;
		const directChildren = (targetGroup.children || []).filter(c => c instanceof Group);
		const allDescendants = collectDescendantGroups(targetGroup);

		if (allDescendants.length === 0) {
			Blockbench.showQuickMessage('No child groups found under "' + baseName + '"', 2000);
			return;
		}

		const dialog = new Dialog({
			id: 'batch_group_rename_dialog',
			title: 'Batch Rename Groups',
			form: {
				info: {
					type: 'info',
					text: 'Direct children: ' + directChildren.length + '  |  All descendants: ' + allDescendants.length
						+ '\nExample: ' + baseName + '1, ' + baseName + '2 > ' + baseName + '2_1, ' + baseName + '2_2 > ' + baseName + '2_2_1 ...',
				},
				base_name: {
					label: 'Base Name',
					type: 'text',
					value: baseName,
				},
				depth_mode: {
					label: 'Rename Scope',
					type: 'select',
					value: 'all',
					options: {
						all: 'All Descendants (Recursive)',
						direct: 'Direct Children Only',
					},
				},
				rename_root: {
					label: 'Also Rename Root Group',
					type: 'checkbox',
					value: false,
				},
			},
			onConfirm(formData) {
				const finalBase = formData.base_name.trim() || baseName;
				const recursive = formData.depth_mode === 'all';

				Undo.initEdit({ elements: [], outliner: true });

				if (formData.rename_root) {
					targetGroup.name = finalBase;
				}

				renameChildGroups(targetGroup, finalBase, true, recursive);

				const affected = recursive
					? allDescendants.length
					: directChildren.length;

				Undo.finishEdit('Batch rename groups');
				Canvas.updateAll();
				Blockbench.showQuickMessage('Renamed ' + affected + ' group(s)', 2000);
				dialog.hide();
			},
		});
		dialog.show();
	}

	BBPlugin.register(PLUGIN_ID, {
		title: 'Batch Group Rename',
		author: 'Your Name',
		icon: 'drive_file_rename_outline',
		description: 'Batch rename all child groups under a selected group with hierarchical numbering (e.g. arm1, arm2, arm2_1, arm2_1_1).',
		version: '1.0.0',
		min_version: '4.8.0',
		variant: 'both',
		tags: ['Utility'],

		onload() {
			action = new Action('batch_group_rename_action', {
				name: 'Batch Rename Child Groups',
				icon: 'drive_file_rename_outline',
				description: 'Recursively rename all child groups under the selected group',
				click() {
					const targetGroup = Group.selected[0];
					if (!targetGroup) {
						Blockbench.showQuickMessage('Please select a group in the Outliner first', 2000);
						return;
					}
					openRenameDialog(targetGroup);
				},
			});

			// Add to group right-click context menu only
			if (Group.prototype.menu && Group.prototype.menu.structure) {
				Group.prototype.menu.structure.push(action);
			}
		},

		onunload() {
			if (Group.prototype.menu && Group.prototype.menu.structure) {
				const idx = Group.prototype.menu.structure.indexOf(action);
				if (idx !== -1) Group.prototype.menu.structure.splice(idx, 1);
			}
			if (action) action.delete();
		},
	});
})();