(function () {
	let exportEndimations;

	Plugin.register('endimations_exporter', {
		title: 'Endimator Animations Exporter',
		author: 'SmellyModder',
		icon: 'icon-format_java',
		description: 'Exports Blockbench animations as the JSON format for Endimator animations from the Blueprint Mod Library. https://github.com/team-abnormals/blueprint',
		about: 'Go to Animation -> Export Endimations...',
		tags: ["Minecraft: Java Edition"],
		version: '1.0.0',
		min_version: '4.0.0',
		variant: 'both',
		onload() {
			exportEndimations = new Action('export_endimations', {
				name: 'Export Endimations...',
				description: 'Export a selection of animations as endimations',
				icon: 'movie',
				click: function () {
					const animations = Animation.all.slice()
					let keys = [];
					const form = {};
					if (Format.animation_files) {
						animations.sort((a1, a2) => a1.path.hashCode() - a2.path.hashCode())
					}
					animations.forEach(animation => {
						const key = animation.name;
						keys.push(key)
						form[key.hashCode()] = {label: key, type: 'checkbox', value: true};
					})
					const singleFile = "single_file".hashCode();
					form[singleFile] = {label: "Single File", type: 'checkbox', value: false}
					const dialog = new Dialog({
						id: 'animation_export',
						title: 'dialog.animation_export.title',
						form,
						onConfirm(form_result) {
							dialog.hide();
							keys = keys.filter(key => form_result[key.hashCode()])
							if (form_result[singleFile]) {
								const endimations = {};
								Animator.animations.forEach(function (animation) {
									if (!keys || !keys.length || keys.includes(animation.name)) {
										endimations[animation.name] = compileEndimation(animation);
									}
								})
								Blockbench.export({
									resource_id: 'animation',
									type: 'JSON Animation',
									extensions: ['json'],
									name: (Project.geometry_name || 'endimations'),
									content: autoStringify(endimations),
								})
							} else {
								Animator.animations.forEach(function (animation) {
									if (!keys || !keys.length || keys.includes(animation.name)) {
										Blockbench.export({
											resource_id: 'animation',
											type: 'JSON Animation',
											extensions: ['json'],
											name: animation.name,
											content: autoStringify(compileEndimation(animation)),
										})
									}
								})
							}
						}
					})
					dialog.show();
				}
			});
			MenuBar.addAction(exportEndimations, 'animation');
		},
		onunload() {
			exportEndimations.delete();
		}
	});

	function compileEndimation(animation) {
		const endimation = {};
		const length = animation.length;
		if (length) {
			endimation.length = length;
		}
		const blendWeight = animation.blend_weight;
		if (blendWeight) {
			endimation.blend_weight = parseFloat(blendWeight);
		}
		const animators = animation.animators;
		const parts = {};
		for (const uuid in animators) {
			const animator = animators[uuid];
			if (animator instanceof BoneAnimator) {
				const keyframes = animator.keyframes;
				if (keyframes.length) {
					const group = animator.getGroup();
					const part = parts[group ? group.name : animator.name] = {};
					const channels = {};
					keyframes.forEach(function (kf) {
						const channel = kf.channel;
						if (!channels[channel]) {
							channels[channel] = {};
						}
						if (kf.transform) {
							let endimatorKeyframe;
							const timecodeString = kf.getTimecodeString();
							if (kf.data_points.length === 1) {
								endimatorKeyframe = {
									time: parseFloat(timecodeString),
									transform: kf.getArray(),
									interpolation: {
										type: kf.interpolation
									}
								}
							} else {
								endimatorKeyframe = {
									time: parseFloat(timecodeString),
									transform: {
										pre: kf.getArray(0),
										post: kf.getArray(1),
									},
									interpolation: {
										type: kf.interpolation
									}
								}
							}
							channels[channel][timecodeString] = endimatorKeyframe;
						}
					})
					for (const channel in Animator.possible_channels) {
						const timecodes = channels[channel];
						if (timecodes) {
							Object.keys(timecodes).sort((a, b) => parseFloat(a) - parseFloat(b)).forEach((timecode) => {
								if (!part[channel]) {
									part[channel] = [];
								}
								part[channel].push(timecodes[timecode]);
							})
						}
					}
				}
			}
		}
		if (Object.keys(parts).length > 0) {
			endimation.parts = parts;
		}
		return endimation;
	}
})();