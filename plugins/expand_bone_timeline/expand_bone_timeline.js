(function () {
	let expandAction, collapseAction;

	BBPlugin.register('expand_bone_timeline', {
		title: 'Expand Bone Timeline',
		author: 'zzz1999',
		description: 'Show or hide a bone and all its child bone animators in the timeline from the outliner context menu.',
		icon: 'account_tree',
		tags: ['Animation', 'Timeline'],
		version: '2.2.0',
		min_version: '4.8.0',
		variant: 'both',
		creation_date: '2026-03-21',
		has_changelog: false,
		repository: 'https://github.com/zzz1999/expand_bone_timeline',
		bug_tracker: 'https://github.com/zzz1999/expand_bone_timeline/issues',

		onload() {
			expandAction = new Action('expand_bone_animators', {
				name: 'Show Child Animators',
				description: 'Show this bone and all child bone animators in the timeline',
				icon: 'unfold_more',
				category: 'animation',
				condition: {modes: ['animate'], selected: {animation: true}},
				click() {
					const groups = Group.multi_selected;
					if (!groups.length) return;
					for (const group of groups) {
						expandDescendantAnimators(group);
					}
				}
			});

			collapseAction = new Action('collapse_bone_animators', {
				name: 'Hide Child Animators',
				description: 'Remove this bone and all child bone animators from the timeline',
				icon: 'unfold_less',
				category: 'animation',
				condition: {modes: ['animate'], selected: {animation: true}},
				click() {
					const groups = Group.multi_selected;
					if (!groups.length) return;
					for (const group of groups) {
						collapseGroup(group);
					}
				}
			});

			Group.prototype.menu.addAction(expandAction, '#settings');
			Group.prototype.menu.addAction(collapseAction, '#settings');
		},

		onunload() {
			expandAction.delete();
			collapseAction.delete();
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

		for (const group of allGroups) {
			const animator = animation.getBoneAnimator(group);
			if (animator && animator.keyframes && animator.keyframes.length > 0) {
				animator.addToTimeline();
			}
		}
	}

	function collapseGroup(parentGroup) {
		const allGroups = [parentGroup, ...getAllDescendantGroups(parentGroup)];
		const uuidsToRemove = new Set(allGroups.map(g => g.uuid));

		Timeline.animators.slice().forEach(animator => {
			if (uuidsToRemove.has(animator.uuid)) {
				Timeline.animators.remove(animator);
			}
		});

		TickUpdates.keyframe_selection = true;
	}

})();
