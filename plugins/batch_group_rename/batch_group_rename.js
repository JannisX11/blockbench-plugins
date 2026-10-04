(function () {
	let action;

	const PLUGIN_ID = 'batch_group_rename';
	const DEFAULT_TEMPLATE = '{base}{tree}';
	const DEFAULT_SEPARATOR = '_';
	const TREE_PREVIEW_LIMIT = 120;
	const SKIP_REASON_UNCHECKED = 'unchecked in preview';
	const GROUP_PREVIEW_KEYS = new WeakMap();
	let nextGroupPreviewKey = 1;
	const RENAME_PRESETS = {
		hierarchy: {
			label: 'Hierarchy Numbering',
			template: '{base}{tree}',
		},
		parent_index: {
			label: 'Parent Name + Index',
			template: '{parent}_{index}',
		},
		old_prefix: {
			label: 'Base Name + Old Name',
			template: '{base}_{old}',
		},
		old_suffix: {
			label: 'Old Name + Base Name',
			template: '{old}_{base}',
		},
		find_replace: {
			label: 'Find/Replace Existing Names',
			template: '{old}',
		},
		custom: {
			label: 'Custom Template',
			template: DEFAULT_TEMPLATE,
		},
	};

	function getChildGroups(group) {
		return (group.children || []).filter(child => child instanceof Group);
	}

	function getGroupPreviewKey(group) {
		if (!group) return '';
		if (group.uuid) return group.uuid;
		if (!GROUP_PREVIEW_KEYS.has(group)) {
			GROUP_PREVIEW_KEYS.set(group, 'group_' + nextGroupPreviewKey++);
		}
		return GROUP_PREVIEW_KEYS.get(group);
	}

	function isGroupExcluded(group, options) {
		return !!(
			group
			&& options
			&& options.excludedGroupKeys
			&& options.excludedGroupKeys.has
			&& options.excludedGroupKeys.has(getGroupPreviewKey(group))
		);
	}

	function collectDescendantGroups(group) {
		const result = [];
		getChildGroups(group).forEach(child => {
			result.push(child);
			result.push(...collectDescendantGroups(child));
		});
		return result;
	}

	function sortGroups(groups, sortMode) {
		const sorted = groups.slice();

		switch (sortMode) {
			case 'reverse':
				return sorted.reverse();
			case 'name_asc':
				return sorted.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
			case 'name_desc':
				return sorted.sort((a, b) => b.name.localeCompare(a.name, undefined, { sensitivity: 'base' }));
			default:
				return sorted;
		}
	}

	function targetMatches(child, namePath, depth, isLeaf, options) {
		if (options.maxDepth > 0 && depth > options.maxDepth) return false;

		switch (options.targetMode) {
			case 'name_filter': {
				const path = namePath.join('/');
				if (!options.targetPattern) return true;
				options.targetPattern.lastIndex = 0;
				if (options.targetPattern.test(child.name)) return true;
				options.targetPattern.lastIndex = 0;
				return options.targetPattern.test(path);
			}
			case 'leaf':
				return isLeaf;
			case 'branch':
				return !isLeaf;
			default:
				return true;
		}
	}

	function collectRenameItems(group, options, indexPath, namePath, depth, result) {
		const childGroups = sortGroups(getChildGroups(group), options.sortMode);

		childGroups.forEach((child, offset) => {
			const index = options.startIndex + offset;
			const childIndexPath = indexPath.concat(index);
			const childNamePath = namePath.concat(child.name);
			const isLeaf = getChildGroups(child).length === 0;

			if (targetMatches(child, childNamePath, depth, isLeaf, options)) {
				result.push({
					group: child,
					parentGroup: group,
					oldName: child.name,
					parentOldName: group.name,
					index,
					zeroIndex: offset,
					siblingCount: childGroups.length,
					indexPath: childIndexPath,
					namePath: childNamePath,
					depth,
					isLeaf,
				});
			}

			if (options.recursive) {
				collectRenameItems(child, options, childIndexPath, childNamePath, depth + 1, result);
			}
		});
	}

	function escapeRegExp(value) {
		return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	function escapeHTML(value) {
		return String(value)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	function clampInteger(value, fallback, min, max) {
		const parsed = parseInt(value, 10);
		if (!Number.isFinite(parsed)) return fallback;
		return Math.max(min, Math.min(max, parsed));
	}

	function formatNumber(value, padding) {
		return String(value).padStart(padding, '0');
	}

	function toSeparatedCase(value, separator) {
		let result = String(value)
			.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
			.replace(/[^\p{L}\p{N}]+/gu, separator)
			.replace(new RegExp(escapeRegExp(separator) + '+', 'g'), separator)
			.replace(new RegExp('^' + escapeRegExp(separator) + '|' + escapeRegExp(separator) + '$', 'g'), '');

		return result.toLowerCase();
	}

	function renderTemplate(template, tokens) {
		return template.replace(/\{([a-z0-9_]+)\}/gi, (match, token) => {
			const key = token.toLowerCase();
			return Object.prototype.hasOwnProperty.call(tokens, key) ? tokens[key] : match;
		});
	}

	function getPresetTemplate(formData) {
		const presetId = formData.naming_preset || 'hierarchy';
		if (presetId === 'custom') {
			return String(formData.name_template || '').trim() || DEFAULT_TEMPLATE;
		}
		return (RENAME_PRESETS[presetId] || RENAME_PRESETS.hierarchy).template;
	}

	function normalizeOptions(formData, fallbackBaseName) {
		const findText = String(formData.find_text || '');
		const useRegex = !!formData.use_regex;
		const targetText = String(formData.target_filter || '');
		const targetUsesRegex = !!formData.target_regex;
		let findPattern = null;
		let targetPattern = null;

		if (findText) {
			try {
				findPattern = new RegExp(useRegex ? findText : escapeRegExp(findText), formData.case_sensitive ? 'g' : 'gi');
			} catch (error) {
				return {
					error: 'Invalid regular expression: ' + error.message,
				};
			}
		}

		if (targetText) {
			try {
				targetPattern = new RegExp(targetUsesRegex ? targetText : escapeRegExp(targetText), formData.filter_case_sensitive ? 'g' : 'gi');
			} catch (error) {
				return {
					error: 'Invalid target filter regular expression: ' + error.message,
				};
			}
		}

		return {
			baseName: String(formData.base_name || '').trim() || fallbackBaseName,
			template: getPresetTemplate(formData),
			namingPreset: formData.naming_preset || 'hierarchy',
			recursive: formData.depth_mode !== 'direct',
			renameRoot: !!formData.rename_root,
			updateAnimations: formData.update_animations !== false,
			confirmBeforeApply: !!formData.confirm_before_apply,
			startIndex: clampInteger(formData.start_index, 1, 0, 999999),
			padding: clampInteger(formData.index_padding, 0, 0, 8),
			treeSeparator: formData.tree_separator === undefined || formData.tree_separator === null
				? DEFAULT_SEPARATOR
				: String(formData.tree_separator),
			caseTransform: formData.case_transform || 'none',
			targetMode: formData.target_mode || 'all',
			targetPattern,
			sortMode: formData.sort_mode || 'outliner',
			maxDepth: clampInteger(formData.max_depth, 0, 0, 99),
			duplicateStrategy: formData.duplicate_strategy || 'warn',
			duplicateSeparator: formData.duplicate_separator === undefined || formData.duplicate_separator === null
				? '_'
				: String(formData.duplicate_separator),
			emptyNameStrategy: formData.empty_name_strategy || 'old',
			skipUnchanged: formData.skip_unchanged !== false,
			findPattern,
			useRegex,
			replaceText: String(formData.replace_text || ''),
		};
	}

	function applyPostProcessing(name, options) {
		let result = String(name);

		if (options.findPattern) {
			result = options.useRegex
				? result.replace(options.findPattern, options.replaceText)
				: result.replace(options.findPattern, () => options.replaceText);
		}

		switch (options.caseTransform) {
			case 'lower':
				return result.toLowerCase();
			case 'upper':
				return result.toUpperCase();
			case 'snake':
				return toSeparatedCase(result, '_');
			case 'kebab':
				return toSeparatedCase(result, '-');
			default:
				return result;
		}
	}

	function buildRenamePlan(targetGroup, options) {
		const items = [];
		const changes = [];
		const newNames = new Map();
		const rootExcluded = isGroupExcluded(targetGroup, options);
		const generatedRootName = options.renameRoot
			? applyPostProcessing(options.baseName, options)
			: targetGroup.name;
		const rootName = options.renameRoot && !rootExcluded
			? generatedRootName
			: targetGroup.name;

		collectRenameItems(targetGroup, options, [], [], 1, items);

		items.forEach(item => {
			const parentName = item.parentGroup === targetGroup
				? rootName
				: newNames.get(item.parentGroup) || item.parentGroup.name;
			const tree = item.indexPath
				.map(index => formatNumber(index, options.padding))
				.join(options.treeSeparator);
			const index = formatNumber(item.index, options.padding);
			const zeroIndex = formatNumber(item.zeroIndex, options.padding);

			const tokens = {
				base: options.baseName,
				root: targetGroup.name,
				old: item.oldName,
				parent: parentName,
				parent_old: item.parentOldName,
				index,
				raw_index: String(item.index),
				zero_index: zeroIndex,
				tree,
				depth: String(item.depth),
				path: item.namePath.join('/'),
				count: String(item.siblingCount),
			};
			let newName = applyPostProcessing(renderTemplate(options.template, tokens), options);
			let skipReason = '';

			if (!newName.trim()) {
				if (options.emptyNameStrategy === 'skip') {
					skipReason = 'empty result';
				} else if (options.emptyNameStrategy === 'generated') {
					newName = applyPostProcessing(options.baseName + (tree || index), options);
				} else {
					newName = item.oldName;
				}
			}

			newNames.set(item.group, isGroupExcluded(item.group, options) ? item.oldName : newName);
			changes.push({
				group: item.group,
				parentGroup: item.parentGroup,
				oldName: item.oldName,
				newName,
				skipReason,
				path: item.namePath.join('/'),
				depth: item.depth,
				isLeaf: item.isLeaf,
			});
		});

		return {
			rootChange: options.renameRoot
				? {
					group: targetGroup,
					oldName: targetGroup.name,
					newName: generatedRootName,
					path: '(selected root)',
					depth: 0,
				}
				: null,
			changes,
		};
	}

	function getUniqueName(name, usedNames, separator) {
		let counter = 2;
		let candidate = name + separator + counter;

		while (usedNames.has(candidate)) {
			counter++;
			candidate = name + separator + counter;
		}

		return candidate;
	}

	function finalizeRenamePlan(targetGroup, rawPlan, options) {
		const skippedChanges = [];
		const conflictNames = [];
		const changeGroups = new Set(rawPlan.changes
			.filter(change => !isGroupExcluded(change.group, options))
			.filter(change => !change.skipReason)
			.filter(change => !(options.skipUnchanged && change.oldName === change.newName))
			.map(change => change.group));
		const changesByParent = new Map();
		let rootChange = rawPlan.rootChange;

		if (rootChange && isGroupExcluded(rootChange.group, options)) {
			skippedChanges.push(Object.assign({}, rootChange, { skipReason: SKIP_REASON_UNCHECKED }));
			rootChange = null;
		} else if (rootChange && options.skipUnchanged && rootChange.oldName === rootChange.newName) {
			skippedChanges.push({
				group: targetGroup,
				oldName: rootChange.oldName,
				newName: rootChange.newName,
				skipReason: 'unchanged',
			});
			rootChange = null;
		}

		rawPlan.changes.forEach(change => {
			if (!changesByParent.has(change.parentGroup)) {
				changesByParent.set(change.parentGroup, []);
			}
			changesByParent.get(change.parentGroup).push(change);
		});

		const finalChanges = [];
		changesByParent.forEach((changes, parentGroup) => {
			const usedNames = new Set();

			getChildGroups(parentGroup).forEach(child => {
				if (!changeGroups.has(child)) usedNames.add(child.name);
			});

			changes.forEach(change => {
				if (isGroupExcluded(change.group, options)) {
					skippedChanges.push(Object.assign({}, change, { skipReason: SKIP_REASON_UNCHECKED }));
					usedNames.add(change.oldName);
					return;
				}
				if (change.skipReason) {
					skippedChanges.push(change);
					usedNames.add(change.oldName);
					return;
				}
				if (options.skipUnchanged && change.oldName === change.newName) {
					skippedChanges.push(Object.assign({}, change, { skipReason: 'unchanged' }));
					usedNames.add(change.oldName);
					return;
				}

				if (usedNames.has(change.newName)) {
					if (options.duplicateStrategy === 'append') {
						change.newName = getUniqueName(change.newName, usedNames, options.duplicateSeparator);
					} else if (options.duplicateStrategy === 'skip') {
						skippedChanges.push(Object.assign({}, change, { skipReason: 'duplicate name' }));
						usedNames.add(change.oldName);
						return;
					} else if (!conflictNames.includes(change.newName)) {
						conflictNames.push(change.newName);
					}
				}

				usedNames.add(change.newName);
				finalChanges.push(change);
			});
		});

		return {
			rootChange,
			changes: finalChanges,
			skippedChanges,
			conflictNames,
			total: finalChanges.length + (rootChange ? 1 : 0),
		};
	}

	function getPlanRows(plan) {
		const previewChanges = [];
		if (plan.rootChange) previewChanges.push(plan.rootChange);
		previewChanges.push(...plan.changes);
		return previewChanges;
	}

	function getTreePreviewHTML(targetGroup, plan, previewState) {
		const changeMap = new Map();
		const skippedMap = new Map();
		const expanded = !!(previewState && previewState.expanded);
		const limit = expanded ? Infinity : TREE_PREVIEW_LIMIT;
		let rendered = 0;
		let hidden = 0;
		let html = '<div class="bgr_tree_preview">';

		if (plan.rootChange) changeMap.set(plan.rootChange.group, plan.rootChange);
		plan.changes.forEach(change => changeMap.set(change.group, change));
		plan.skippedChanges.forEach(change => {
			if (change.group) skippedMap.set(change.group, change);
		});

		function renderRow(group, depth, rootContext) {
			if (rendered >= limit) {
				hidden++;
				return;
			}

			rendered++;

			const change = changeMap.get(group);
			const skipped = skippedMap.get(group);
			const groupKey = getGroupPreviewKey(group);
			const excluded = previewState
				&& previewState.excludedGroupKeys
				&& previewState.excludedGroupKeys.has(groupKey);
			const actionable = !!change || (skipped && skipped.skipReason === SKIP_REASON_UNCHECKED);
			const indent = Math.min(depth, 10) * 16;
			let className = 'bgr_tree_row';
			let statusHTML = '';
			let nameHTML = escapeHTML(group.name);
			const checkboxHTML = '<input type="checkbox" class="bgr_tree_toggle" data-group-key="' + escapeHTML(groupKey) + '" title="Apply rename to this group"'
				+ (excluded ? '' : ' checked')
				+ (actionable ? '' : ' disabled')
				+ '>';

			if (change) {
				className += ' bgr_tree_changed';
				nameHTML = '<span class="bgr_tree_old">' + escapeHTML(change.oldName) + '</span>'
					+ '<span class="bgr_tree_arrow">-></span>'
					+ '<span class="bgr_tree_new">' + escapeHTML(change.newName) + '</span>';
				statusHTML = '<span class="bgr_tree_status">will rename</span>';
			} else if (skipped) {
				className += ' bgr_tree_skipped';
				if (skipped.oldName !== skipped.newName) {
					nameHTML = '<span class="bgr_tree_old">' + escapeHTML(skipped.oldName) + '</span>'
						+ '<span class="bgr_tree_arrow">-></span>'
						+ '<span class="bgr_tree_new">' + escapeHTML(skipped.newName) + '</span>';
				}
				statusHTML = '<span class="bgr_tree_status">skipped: ' + escapeHTML(skipped.skipReason) + '</span>';
			} else {
				className += ' bgr_tree_unchanged';
				statusHTML = '<span class="bgr_tree_status">' + (rootContext ? 'selected root' : 'not changed') + '</span>';
			}

			html += '<div class="' + className + '" style="padding-left: ' + indent + 'px;">'
				+ '<span class="bgr_tree_select">' + checkboxHTML + '</span>'
				+ '<span class="bgr_tree_branch">' + (depth > 0 ? '|--' : '') + '</span>'
				+ '<span class="bgr_tree_name">' + nameHTML + '</span>'
				+ statusHTML
				+ '</div>';
		}

		function walk(group, depth) {
			renderRow(group, depth, group === targetGroup);
			getChildGroups(group).forEach(child => walk(child, depth + 1));
		}

		walk(targetGroup, 0);
		html += '</div>';

		if (hidden > 0) {
			html += '<div class="bgr_preview_more"><button type="button" class="bgr_preview_expand" data-preview-action="expand">'
				+ 'Show ' + hidden + ' more group(s)'
				+ '</button></div>';
		} else if (expanded && rendered > TREE_PREVIEW_LIMIT) {
			html += '<div class="bgr_preview_more"><button type="button" class="bgr_preview_expand" data-preview-action="collapse">'
				+ 'Show fewer groups'
				+ '</button></div>';
		}

		return html;
	}

	function getPreviewMessage(plan) {
		const previewChanges = getPlanRows(plan);

		const lines = previewChanges.slice(0, 10).map(change => change.oldName + '  ->  ' + change.newName);
		const hidden = previewChanges.length - lines.length;
		let message = '<p>Review the first rename results before applying:</p>'
			+ '<pre style="white-space: pre-wrap; max-height: 260px; overflow: auto;">'
			+ escapeHTML(lines.join('\n'));

		if (hidden > 0) {
			message += escapeHTML('\n... and ' + hidden + ' more');
		}

		message += '</pre>';

		if (plan.conflictNames.length) {
			message += '<p><b>Warning:</b> This rule creates duplicate names for sibling groups: '
				+ escapeHTML(plan.conflictNames.slice(0, 5).join(', '))
				+ (plan.conflictNames.length > 5 ? ', ...' : '')
				+ '</p>';
		}

		if (plan.skippedChanges.length) {
			message += '<p>Skipped ' + plan.skippedChanges.length + ' group(s).</p>';
		}

		return message;
	}

	function addUniqueAnimation(animations, animation) {
		if (animation && !animations.includes(animation)) {
			animations.push(animation);
		}
	}

	function collectProjectAnimations() {
		const animations = [];
		const addFromList = list => {
			if (Array.isArray(list)) {
				list.forEach(animation => addUniqueAnimation(animations, animation));
			}
		};

		if (typeof Animation !== 'undefined') addFromList(Animation.all);
		if (typeof Animator !== 'undefined') addFromList(Animator.animations);
		if (typeof AnimationItem !== 'undefined') addFromList(AnimationItem.all);

		return animations;
	}

	function getAnimationRenameRows(plan) {
		return getPlanRows(plan).filter(change => change.group && change.oldName !== change.newName);
	}

	function updateAnimationGroupMaps(animation, renameRows) {
		if (!animation.groups || typeof animation.groups !== 'object') return 0;

		let updated = 0;
		renameRows.forEach(change => {
			if (!Object.prototype.hasOwnProperty.call(animation.groups, change.oldName)) return;

			if (!Object.prototype.hasOwnProperty.call(animation.groups, change.newName)) {
				animation.groups[change.newName] = animation.groups[change.oldName];
				delete animation.groups[change.oldName];
				updated++;
			}
		});
		return updated;
	}

	function updateAnimationReferences(plan) {
		const renameRows = getAnimationRenameRows(plan);
		if (!renameRows.length) return 0;

		const byUuid = new Map();
		const byOldName = new Map();
		const byGroup = new Map();
		let updated = 0;

		renameRows.forEach(change => {
			byGroup.set(change.group, change);
			byOldName.set(change.oldName, change);
			if (change.group.uuid) {
				byUuid.set(change.group.uuid, change);
			}
		});

		collectProjectAnimations().forEach(animation => {
			const animators = animation && animation.animators;
			if (!animators || typeof animators !== 'object') return;

			let animationTouched = false;
			Object.keys(animators).forEach(key => {
				const animator = animators[key];
				let change = null;
				let matchedByGroupIdentity = false;
				let keyMatchedUuid = false;

				if (byUuid.has(key)) {
					change = byUuid.get(key);
					matchedByGroupIdentity = true;
					keyMatchedUuid = true;
				} else if (animator && animator.uuid && byUuid.has(animator.uuid)) {
					change = byUuid.get(animator.uuid);
					matchedByGroupIdentity = true;
				} else if (animator && animator.element && byGroup.has(animator.element)) {
					change = byGroup.get(animator.element);
					matchedByGroupIdentity = true;
				} else if (animator && animator.name && byOldName.has(animator.name)) {
					change = byOldName.get(animator.name);
				} else if (byOldName.has(key)) {
					change = byOldName.get(key);
				}

				if (!change) return;

				let touched = false;
				if (animator && typeof animator.name === 'string' && (animator.name === change.oldName || matchedByGroupIdentity)) {
					if (animator.name !== change.newName) {
						animator.name = change.newName;
						touched = true;
					}
				}

				if (!keyMatchedUuid && key === change.oldName && key !== change.newName) {
					if (!Object.prototype.hasOwnProperty.call(animators, change.newName)) {
						animators[change.newName] = animator;
						delete animators[key];
						touched = true;
					} else if (animators[change.newName] === animator) {
						delete animators[key];
						touched = true;
					}
				}

				if (touched) {
					animationTouched = true;
					updated++;
				}
			});

			const groupMapUpdates = updateAnimationGroupMaps(animation, renameRows);
			if (groupMapUpdates) {
				animationTouched = true;
				updated += groupMapUpdates;
			}

			if (animationTouched && Object.prototype.hasOwnProperty.call(animation, 'saved')) {
				animation.saved = false;
			}
		});

		return updated;
	}

	function applyRenamePlan(targetGroup, plan, options) {
		const animations = options.updateAnimations ? collectProjectAnimations() : [];
		const undoData = { elements: [], outliner: true };
		if (animations.length) {
			undoData.animations = animations;
		}

		Undo.initEdit(undoData);
		const animationUpdates = options.updateAnimations ? updateAnimationReferences(plan) : 0;

		if (plan.rootChange) {
			targetGroup.name = plan.rootChange.newName;
		}

		plan.changes.forEach(change => {
			change.group.name = change.newName;
		});

		Undo.finishEdit('Batch rename groups');
		Canvas.updateAll();
		Blockbench.showQuickMessage(
			'Renamed ' + plan.total + ' group(s)' + (animationUpdates ? ', updated ' + animationUpdates + ' animation reference(s)' : ''),
			2000
		);
	}

	function previewOrApply(targetGroup, plan, options, dialog, forcePreview) {
		if (plan.total === 0) {
			Blockbench.showQuickMessage('No matching groups to rename', 2000);
			return false;
		}

		if (!forcePreview && plan.conflictNames.length === 0) {
			applyRenamePlan(targetGroup, plan, options);
			dialog.hide();
			return true;
		}

		Blockbench.showMessageBox({
			title: plan.conflictNames.length ? 'Batch Rename Warning' : 'Batch Rename Preview',
			icon: plan.conflictNames.length ? 'warning' : 'drive_file_rename_outline',
			message: getPreviewMessage(plan),
			buttons: ['Apply', 'Cancel'],
			confirm: 0,
			cancel: 1,
		}, buttonIndex => {
			if (buttonIndex === 0) {
				applyRenamePlan(targetGroup, plan, options);
				dialog.hide();
			}
		});
		return false;
	}

	function createPlanResult(targetGroup, formData, baseName, previewState) {
		const options = normalizeOptions(formData, baseName);
		if (options.error) return { error: options.error };
		options.excludedGroupKeys = previewState && previewState.excludedGroupKeys
			? previewState.excludedGroupKeys
			: new Set();

		return {
			options,
			plan: finalizeRenamePlan(targetGroup, buildRenamePlan(targetGroup, options), options),
		};
	}

	function getPreviewHTML(targetGroup, result, previewState) {
		if (result.error) {
			return '<div class="bgr_preview_error">' + escapeHTML(result.error) + '</div>';
		}

		const plan = result.plan;
		const options = result.options;
		const rows = getPlanRows(plan);
		const visibleRows = rows.length + plan.skippedChanges.length;
		const presetLabel = (RENAME_PRESETS[options.namingPreset] || RENAME_PRESETS.hierarchy).label;
		const scopeLabel = options.recursive ? 'Recursive descendants' : 'Direct children only';
		const targetLabel = {
			all: 'All matching groups',
			name_filter: 'Filtered by name/path',
			leaf: 'Leaf groups only',
			branch: 'Parent groups only',
		}[options.targetMode] || 'All matching groups';
		let html = '<div class="bgr_preview_summary">'
			+ '<span>Will rename: <b>' + plan.total + '</b></span>'
			+ '<span>Skipped: <b>' + plan.skippedChanges.length + '</b></span>'
			+ '<span>Conflicts: <b>' + plan.conflictNames.length + '</b></span>'
			+ '<span>Animations: <b>' + (options.updateAnimations ? 'sync names' : 'model only') + '</b></span>'
			+ '</div>';
		html += '<div class="bgr_rule_summary">'
			+ '<span>Preset: <b>' + escapeHTML(presetLabel) + '</b></span>'
			+ '<span>Template: <code>' + escapeHTML(options.template) + '</code></span>'
			+ '<span>Scope: <b>' + escapeHTML(scopeLabel) + '</b></span>'
			+ '<span>Target: <b>' + escapeHTML(targetLabel) + '</b></span>'
			+ '</div>';

		if (plan.conflictNames.length) {
			html += '<div class="bgr_preview_warning">Duplicate sibling names: '
				+ escapeHTML(plan.conflictNames.slice(0, 6).join(', '))
				+ (plan.conflictNames.length > 6 ? ', ...' : '')
				+ '</div>';
		}

		if (visibleRows === 0) {
			html += '<div class="bgr_preview_empty">No groups match the current target settings.</div>';
		} else {
			html += '<div class="bgr_preview_title">Exact group name preview</div>';
		}

		html += getTreePreviewHTML(targetGroup, plan, previewState);

		if (plan.skippedChanges.length) {
			const skipped = plan.skippedChanges.slice(0, 5)
				.map(change => change.oldName + ' (' + change.skipReason + ')')
				.join(', ');
			html += '<div class="bgr_preview_skipped">Skipped: ' + escapeHTML(skipped)
				+ (plan.skippedChanges.length > 5 ? ', ...' : '')
				+ '</div>';
		}

		return html;
	}

	function updateDialogPreview(targetGroup, formData, baseName, previewState) {
		if (typeof document === 'undefined') return;

		const previewNode = document.getElementById('batch_group_rename_preview');
		if (!previewNode) return;

		previewNode.innerHTML = getPreviewHTML(targetGroup, createPlanResult(targetGroup, formData, baseName, previewState), previewState);
	}

	function refreshPreviewFromDialog(dialog, targetGroup, baseName, previewState) {
		if (dialog && dialog.getFormResult) {
			updateDialogPreview(targetGroup, dialog.getFormResult(), baseName, previewState);
		}
	}

	function bindPreviewControls(dialog, targetGroup, baseName, previewState) {
		if (typeof document === 'undefined') return;

		const previewNode = document.getElementById('batch_group_rename_preview');
		if (!previewNode) return;

		previewNode.addEventListener('change', event => {
			const target = event.target;
			const checkbox = target && target.closest ? target.closest('.bgr_tree_toggle') : null;
			if (!checkbox) return;

			const groupKey = checkbox.getAttribute('data-group-key');
			if (!groupKey) return;

			if (checkbox.checked) {
				previewState.excludedGroupKeys.delete(groupKey);
			} else {
				previewState.excludedGroupKeys.add(groupKey);
			}
			refreshPreviewFromDialog(dialog, targetGroup, baseName, previewState);
		});

		previewNode.addEventListener('click', event => {
			const target = event.target;
			const button = target && target.closest ? target.closest('.bgr_preview_expand') : null;
			if (!button) return;

			previewState.expanded = button.getAttribute('data-preview-action') === 'expand';
			refreshPreviewFromDialog(dialog, targetGroup, baseName, previewState);
		});
	}

	function openRenameDialog(targetGroup) {
		const baseName = targetGroup.name;
		const directChildren = getChildGroups(targetGroup);
		const allDescendants = collectDescendantGroups(targetGroup);
		const previewState = {
			excludedGroupKeys: new Set(),
			expanded: false,
		};

		if (allDescendants.length === 0) {
			Blockbench.showQuickMessage('No child groups found under "' + baseName + '"', 2000);
			return;
		}

		const dialog = new Dialog({
			id: 'batch_group_rename_dialog',
			title: 'Batch Rename Groups',
			width: 680,
			form_first: true,
			lines: [`
				<style>
					#batch_group_rename_dialog .bgr_dialog_note {
						color: var(--color-subtle_text);
						line-height: 1.35;
						margin: 6px 0 8px;
					}
					#batch_group_rename_preview {
						margin-top: 12px;
						border: 1px solid var(--color-border);
						background: var(--color-back);
						max-height: 280px;
						overflow: auto;
					}
					#batch_group_rename_preview .bgr_preview_summary {
						display: flex;
						gap: 12px;
						flex-wrap: wrap;
						padding: 8px 10px;
						border-bottom: 1px solid var(--color-border);
					}
					#batch_group_rename_preview .bgr_rule_summary {
						display: grid;
						grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
						gap: 4px 12px;
						padding: 8px 10px;
						color: var(--color-subtle_text);
						border-bottom: 1px solid var(--color-border);
					}
					#batch_group_rename_preview .bgr_rule_summary code {
						color: var(--color-text);
					}
					#batch_group_rename_preview .bgr_preview_title {
						padding: 8px 10px 4px;
						font-weight: bold;
					}
					#batch_group_rename_preview .bgr_tree_preview {
						padding: 4px 0 6px;
						font-family: Consolas, monospace;
					}
					#batch_group_rename_preview .bgr_tree_row {
						display: grid;
						grid-template-columns: 22px 34px minmax(0, 1fr) auto;
						align-items: center;
						gap: 6px;
						min-height: 26px;
						padding-top: 2px;
						padding-right: 10px;
						padding-bottom: 2px;
						border-bottom: 1px solid rgba(255,255,255,0.05);
					}
					#batch_group_rename_preview .bgr_tree_select {
						display: flex;
						align-items: center;
						justify-content: center;
					}
					#batch_group_rename_preview .bgr_tree_toggle {
						margin: 0;
					}
					#batch_group_rename_preview .bgr_tree_branch {
						color: var(--color-subtle_text);
					}
					#batch_group_rename_preview .bgr_tree_name {
						min-width: 0;
						word-break: break-word;
					}
					#batch_group_rename_preview .bgr_tree_old {
						color: var(--color-subtle_text);
					}
					#batch_group_rename_preview .bgr_tree_arrow {
						margin: 0 6px;
						color: var(--color-subtle_text);
					}
					#batch_group_rename_preview .bgr_tree_new {
						color: var(--color-text);
						font-weight: bold;
					}
					#batch_group_rename_preview .bgr_tree_status {
						font-family: var(--font-custom-main, sans-serif);
						font-size: 11px;
						color: var(--color-subtle_text);
						white-space: nowrap;
					}
					#batch_group_rename_preview .bgr_tree_changed {
						background: rgba(76, 175, 80, 0.08);
					}
					#batch_group_rename_preview .bgr_tree_skipped {
						background: rgba(255, 193, 7, 0.08);
					}
					#batch_group_rename_preview .bgr_tree_unchanged {
						opacity: 0.72;
					}
					#batch_group_rename_preview .bgr_preview_warning,
					#batch_group_rename_preview .bgr_preview_error,
					#batch_group_rename_preview .bgr_preview_empty,
					#batch_group_rename_preview .bgr_preview_more,
					#batch_group_rename_preview .bgr_preview_skipped {
						padding: 7px 10px;
						color: var(--color-subtle_text);
					}
					#batch_group_rename_preview .bgr_preview_expand {
						width: 100%;
						text-align: left;
						color: var(--color-text);
					}
					#batch_group_rename_preview .bgr_preview_warning,
					#batch_group_rename_preview .bgr_preview_error {
						color: var(--color-warning);
					}
					.bgr_help_panel {
						margin: 8px 0 0;
						padding: 8px 10px;
						border: 1px solid var(--color-border);
						background: rgba(255,255,255,0.03);
					}
					.bgr_help_panel summary {
						cursor: pointer;
						color: var(--color-subtle_text);
					}
					.bgr_token_grid {
						display: grid;
						grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
						gap: 4px 10px;
						margin-top: 8px;
					}
					.bgr_token_grid code {
						color: var(--color-text);
					}
				</style>
				<div class="bgr_dialog_note">Preview updates as you edit. Use the row checkboxes to keep specific groups unchanged; Custom Template exposes the full token format.</div>
				<div id="batch_group_rename_preview"></div>
				<details class="bgr_help_panel">
					<summary>Token reference and workflow notes</summary>
					<div class="bgr_token_grid">
						<span><code>{base}</code> Base Name field</span>
						<span><code>{old}</code> original group name</span>
						<span><code>{parent}</code> generated parent name</span>
						<span><code>{index}</code> sibling number</span>
						<span><code>{tree}</code> hierarchy number path</span>
						<span><code>{depth}</code> depth below selected root</span>
						<span><code>{path}</code> original path</span>
						<span><code>{count}</code> sibling count</span>
					</div>
				</details>
			`],
			form: {
				info: {
					type: 'info',
					text: 'Direct children: ' + directChildren.length + '  |  All descendants: ' + allDescendants.length
						+ '\nTemplate tokens: {base}, {old}, {parent}, {index}, {tree}, {depth}, {path}'
						+ '\nExamples: {base}{tree}, {parent}_{index}, {old}_copy',
				},
				naming_section: {
					type: 'info',
					text: 'Naming rule: choose a preset for common workflows, or switch to Custom Template for Aseprite-style token naming.',
				},
				naming_preset: {
					label: 'Naming Preset',
					type: 'select',
					value: 'hierarchy',
					options: {
						hierarchy: RENAME_PRESETS.hierarchy.label,
						parent_index: RENAME_PRESETS.parent_index.label,
						old_prefix: RENAME_PRESETS.old_prefix.label,
						old_suffix: RENAME_PRESETS.old_suffix.label,
						find_replace: RENAME_PRESETS.find_replace.label,
						custom: RENAME_PRESETS.custom.label,
					},
					description: 'Controls the main name-building strategy. Presets fill the template for you; Custom Template lets you type any token pattern.',
				},
				base_name: {
					label: 'Base Name',
					type: 'text',
					value: baseName,
					description: 'Main reusable text for the rule. It is inserted wherever the template uses {base}.',
				},
				name_template: {
					label: 'Name Template',
					type: 'text',
					value: DEFAULT_TEMPLATE,
					condition: formData => formData.naming_preset === 'custom',
					description: 'A format string assembled from tokens. Example: {base}_{parent}_{index}.',
				},
				target_section: {
					type: 'info',
					text: 'Targeting: narrow down which child groups are renamed before the template is applied.',
				},
				depth_mode: {
					label: 'Rename Scope',
					type: 'select',
					value: 'all',
					options: {
						all: 'All Descendants (Recursive)',
						direct: 'Direct Children Only',
					},
					description: 'Recursive mode walks the full group tree. Direct mode only renames the selected group\'s immediate child groups.',
				},
				target_mode: {
					label: 'Target Groups',
					type: 'select',
					value: 'all',
					options: {
						all: 'All Groups in Scope',
						name_filter: 'Names/Paths Matching Filter',
						leaf: 'Leaf Groups Only',
						branch: 'Parent Groups Only',
					},
					description: 'Selects which groups inside the scope are eligible for renaming.',
				},
				target_filter: {
					label: 'Target Filter',
					type: 'text',
					value: '',
					condition: formData => formData.target_mode === 'name_filter',
					description: 'Matches against each group name and its original path under the selected root.',
				},
				target_regex: {
					label: 'Target Filter Is RegExp',
					type: 'checkbox',
					value: false,
					condition: formData => formData.target_mode === 'name_filter',
					description: 'Use JavaScript regular expression syntax for advanced path/name matching.',
				},
				filter_case_sensitive: {
					label: 'Case Sensitive Target Filter',
					type: 'checkbox',
					value: false,
					condition: formData => formData.target_mode === 'name_filter',
					description: 'When enabled, the target filter treats upper and lower case as different characters.',
				},
				max_depth: {
					label: 'Max Depth (0 = No Limit)',
					type: 'number',
					value: 0,
					min: 0,
					max: 99,
					step: 1,
					description: 'Limits how deep below the selected root groups can be renamed. 1 means only first-level child groups.',
				},
				numbering_section: {
					type: 'info',
					text: 'Numbering: controls how {index}, {zero_index}, and {tree} are produced.',
				},
				sort_mode: {
					label: 'Index Order',
					type: 'select',
					value: 'outliner',
					options: {
						outliner: 'Outliner Order',
						reverse: 'Reverse Outliner Order',
						name_asc: 'Name A-Z',
						name_desc: 'Name Z-A',
					},
					description: 'Defines the order used to assign index numbers. This does not reorder groups in the Outliner.',
				},
				start_index: {
					label: 'Index Start',
					type: 'number',
					value: 1,
					min: 0,
					step: 1,
					description: 'First number used by {index} and each level of {tree}. Use 0 for zero-based numbering.',
				},
				index_padding: {
					label: 'Index Padding',
					type: 'number',
					value: 0,
					min: 0,
					max: 8,
					step: 1,
					description: 'Adds leading zeroes. Padding 2 turns 1 into 01 and tree 1_2 into 01_02.',
				},
				tree_separator: {
					label: 'Tree Separator',
					type: 'text',
					value: DEFAULT_SEPARATOR,
					description: 'Separator inserted between levels inside {tree}. Default is underscore.',
				},
				transform_section: {
					type: 'info',
					text: 'Text processing: after the template generates a name, optional replace and transform rules are applied.',
				},
				case_transform: {
					label: 'Name Transform',
					type: 'select',
					value: 'none',
					options: {
						none: 'No Change',
						lower: 'lowercase',
						upper: 'UPPERCASE',
						snake: 'snake_case',
						kebab: 'kebab-case',
					},
					description: 'Final text style conversion applied after template and find/replace.',
				},
				find_text: {
					label: 'Find Text',
					type: 'text',
					value: '',
					description: 'Optional text to find in the generated result. Leave blank to skip replacement.',
				},
				replace_text: {
					label: 'Replace With',
					type: 'text',
					value: '',
					description: 'Replacement text. With RegExp enabled, JavaScript replacement groups like $1 can be used.',
				},
				use_regex: {
					label: 'Find Text Is RegExp',
					type: 'checkbox',
					value: false,
					description: 'Treats Find Text as a regular expression instead of plain text.',
				},
				case_sensitive: {
					label: 'Case Sensitive Find',
					type: 'checkbox',
					value: true,
					description: 'Controls whether Find Text distinguishes upper and lower case.',
				},
				safety_section: {
					type: 'info',
					text: 'Safety: decide how the plugin handles duplicate names, empty generated names, unchanged names, and root-group renaming.',
				},
				duplicate_strategy: {
					label: 'Duplicate Name Handling',
					type: 'select',
					value: 'warn',
					options: {
						warn: 'Warn Before Applying',
						append: 'Auto-Append Number',
						skip: 'Skip Duplicates',
					},
					description: 'Applies when the result would create duplicate sibling group names.',
				},
				duplicate_separator: {
					label: 'Duplicate Suffix Separator',
					type: 'text',
					value: '_',
					condition: formData => formData.duplicate_strategy === 'append',
					description: 'Used when auto-appending duplicate suffixes, for example name_2 or name-2.',
				},
				empty_name_strategy: {
					label: 'Empty Result Handling',
					type: 'select',
					value: 'old',
					options: {
						old: 'Keep Old Name',
						generated: 'Use Base + Index',
						skip: 'Skip Group',
					},
					description: 'Protects against rules that accidentally produce an empty group name.',
				},
				skip_unchanged: {
					label: 'Skip Unchanged Names',
					type: 'checkbox',
					value: true,
					description: 'Avoids touching groups whose final name would be identical to the current name.',
				},
				rename_root: {
					label: 'Also Rename Root Group',
					type: 'checkbox',
					value: false,
					description: 'Renames the selected group itself to Base Name, then uses that generated root name for child {parent} values.',
				},
				animation_section: {
					type: 'info',
					text: 'Animation references: when group names change, matching bone/group animator names can be updated at the same time.',
				},
				update_animations: {
					label: 'Also Update Animation Names',
					type: 'checkbox',
					value: true,
					description: 'Updates animation animators that refer to renamed groups by UUID or by the old group name. Turn this off if you only want to rename the model hierarchy.',
				},
				confirm_before_apply: {
					label: 'Require Extra Apply Confirmation',
					type: 'checkbox',
					value: false,
					description: 'Shows a final confirmation dialog even when there are no conflicts. Conflicts always request confirmation.',
				},
			},
			onFormChange(formData) {
				updateDialogPreview(targetGroup, formData, baseName, previewState);
			},
			onConfirm(formData) {
				const result = createPlanResult(targetGroup, formData, baseName, previewState);
				if (result.error) {
					Blockbench.showMessageBox({
						title: 'Invalid Rename Rule',
						icon: 'error',
						message: result.error,
					});
					return false;
				}

				return previewOrApply(targetGroup, result.plan, result.options, dialog, result.options.confirmBeforeApply);
			},
		});
		dialog.show();
		setTimeout(() => {
			bindPreviewControls(dialog, targetGroup, baseName, previewState);
			refreshPreviewFromDialog(dialog, targetGroup, baseName, previewState);
		}, 0);
	}

	BBPlugin.register(PLUGIN_ID, {
		title: 'Batch Group Rename',
		author: 'zzz1999',
		icon: 'drive_file_rename_outline',
		description: 'Batch rename child groups with selectable previews, animation name syncing, presets, templates, filters, and conflict handling.',
		version: '1.3.0',
		min_version: '4.8.0',
		variant: 'both',
		tags: ['Utility'],
		creation_date: '2026-03-20',
		has_changelog: false,
		repository: 'https://github.com/zzz1999/batch_group_rename',
		bug_tracker: 'https://github.com/zzz1999/batch_group_rename/issues',

		onload() {
			action = new Action('batch_group_rename_action', {
				name: 'Batch Rename Child Groups',
				icon: 'drive_file_rename_outline',
				description: 'Rename child groups under the selected group with a customizable preview',
				click() {
					const targetGroup = Group.selected[0];
					if (!targetGroup) {
						Blockbench.showQuickMessage('Please select a group in the Outliner first', 2000);
						return;
					}
					openRenameDialog(targetGroup);
				},
			});

			if (Group.prototype.menu && Group.prototype.menu.structure) {
				Group.prototype.menu.structure.push(action);
			}
			MenuBar.addAction(action, 'tools');
		},

		onunload() {
			if (Group.prototype.menu && Group.prototype.menu.structure) {
				const idx = Group.prototype.menu.structure.indexOf(action);
				if (idx !== -1) Group.prototype.menu.structure.splice(idx, 1);
			}
			MenuBar.removeAction('tools.batch_group_rename_action');
			if (action) action.delete();
		},
	});
})();
