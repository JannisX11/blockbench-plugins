(function () {
	const expandedGroups = new Set();
	let expandAction, collapseAction;
	let lastContextGroup = null;

	BBPlugin.register('expand_bone_timeline', {
		title: 'Expand Bone Timeline',
		author: 'zzz1999',
		description: 'Right-click a bone group to show/hide all child bone animators in the timeline',
		icon: 'account_tree',
		version: '2.1.0',
		variant: 'both',

		onload() {
			// Capture the target group when the right-click menu opens
			const origOpen = Group.prototype.menu.open;
			Group.prototype.menu.open = function (event, group) {
				lastContextGroup = group || Group.selected;
				return origOpen.call(this, event, group);
			};
			Group.prototype.menu._origOpen = origOpen;

			expandAction = new Action('expand_bone_animators', {
				name: 'Show Child Animators',
				description: 'Show this bone and all child bone animators in the timeline',
				icon: 'unfold_more',
				condition: () => Animator.open && Animation.selected,
				click() {
					const group = lastContextGroup || Group.selected;
					if (!group) return;
					expandDescendantAnimators(group);
					expandedGroups.add(group.uuid);
				}
			});

			collapseAction = new Action('collapse_bone_animators', {
				name: 'Hide Child Animators',
				description: 'Remove this bone and all child bone animators from the timeline',
				icon: 'unfold_less',
				condition: () => Animator.open && Animation.selected,
				click() {
					const group = lastContextGroup || Group.selected;
					if (!group) return;
					collapseGroup(group);
					expandedGroups.delete(group.uuid);
				}
			});

			Group.prototype.menu.addAction(expandAction, '#');
			Group.prototype.menu.addAction(collapseAction, '#');
		},

		onunload() {
			expandAction.delete();
			collapseAction.delete();
			expandedGroups.clear();

			// Restore original menu.open
			if (Group.prototype.menu._origOpen) {
				Group.prototype.menu.open = Group.prototype.menu._origOpen;
				delete Group.prototype.menu._origOpen;
			}
			lastContextGroup = null;
		}
	});

	function getAllDescendantGroups(group) {
		const result = [];
		if (!group.children) return result;
		for (const child of group.children) {
			if (child instanceof Group) {
				result.push(child);
				result.push(...getAllDescendantGroups(child));
			}
		}
		return result;
	}

	function expandDescendantAnimators(parentGroup) {
		const animation = Animation.selected;
		if (!animation) return;

		const allGroups = [parentGroup, ...getAllDescendantGroups(parentGroup)];
		let changed = false;

		for (const group of allGroups) {
			const animator = animation.animators[group.uuid];
			if (animator && animator.keyframes && animator.keyframes.length > 0) {
				if (!Timeline.animators.includes(animator)) {
					Timeline.animators.push(animator);
					changed = true;
				}
			}
		}

		if (changed) {
			updateKeyframeSelection();
			Animator.preview();
		}
	}

	function collapseGroup(parentGroup) {
		const animation = Animation.selected;
		if (!animation) return;

		const allGroups = [parentGroup, ...getAllDescendantGroups(parentGroup)];
		const uuidsToRemove = new Set(allGroups.map(g => g.uuid));

		// Remove animators using splice to trigger Vue reactivity
		for (let i = Timeline.animators.length - 1; i >= 0; i--) {
			if (uuidsToRemove.has(Timeline.animators[i].uuid)) {
				Timeline.animators.splice(i, 1);
			}
		}

		for (const group of allGroups) {
			expandedGroups.delete(group.uuid);
		}

		updateKeyframeSelection();
		Animator.preview();
	}

})();