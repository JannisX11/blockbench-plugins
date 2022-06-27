/// <reference path="../types/index.d.ts" />

(function() {

	var tween_slider, amplify_slider, easing_slider, axis_selector, key_column, select_column, updateSliders;

	Plugin.register('animation_sliders', {
		title: 'Animation Sliders',
		icon: 'fas.fa-bezier-curve',
		author: 'JannisX11',
		description: 'Adds multiple sliders to tweak keyframes',
		about: `Adds sliders and other tools to modify keyframes:\n\nYou can add the sliders and tools to any of your toolbars by clicking the three dots on the right side and selecting **Customize**. Search for the slider you want to add and click to add it.\n\n- **Tween Keyframes:** Amplify the values of the selected keyframes\n- **Amplify Keyframes:** Amplify the values of the selected keyframes\n- **Ease Keyframes:** Create a curve with the selected keyframes between the adjacent keyframes\n- **Retime Keyframes:** Shift the curve in the graph editor without changing the time of the keyframe. This allows you to change the time of one axis individually\n- **Keyframe Slider Axis:** Select which axis the keyframe sliders affect\n- **Create Keyframe Column:** Key all channels in the timeline at the current timecode, if they already have keyframes\n- **Select Keyframe Column:** Select all keyframes in the timeline along a column below the playhead`,
		tags: ['Animation'],
		version: '0.2.1',
		min_version: '3.7.0',
		variant: 'both',
		onload() {

			function calcKeyframeValues(kf) {
				return [
					kf.calc('x'),
					kf.calc('y'),
					kf.calc('z'),
				]
			}
			function getInterval(event) {
				if ((event.shiftKey || Pressing.overrides.shift) && (event.ctrlOrCmd || Pressing.overrides.ctrl)) {
					return 0.1;
				} else if (event.shiftKey || Pressing.overrides.shift) {
					return 1;
				} else if (event.ctrlOrCmd || Pressing.overrides.ctrl) {
					return 0.5;
				} else {
					return 5;
				}
			}
			let channels = ['rotation', 'position', 'scale'];

			let selected_axes = {x: true, y: true, z: true};
			axis_selector = new Action('keyframe_slider_axis_selector', {
				name: 'Keyframe Slider Axis',
				description: 'Select which axis is affected by animation sliders',
				icon: 'merge_type',
				condition: () => Animator.open,
				children() {
					return [
						{icon: selected_axes.x ? 'check_box' : 'check_box_outline_blank', name: 'X', click() {selected_axes.x = !selected_axes.x}},
						{icon: selected_axes.y ? 'check_box' : 'check_box_outline_blank', name: 'Y', click() {selected_axes.y = !selected_axes.y}},
						{icon: selected_axes.z ? 'check_box' : 'check_box_outline_blank', name: 'Z', click() {selected_axes.z = !selected_axes.z}},
						'_',
						{icon: 'clear_all', name: 'Enable All', condition: () => {
							let {length} = [selected_axes.x, selected_axes.y, selected_axes.z].filter(key => key);
							return length != 3;
						}, click() {
							selected_axes.x = true; selected_axes.y = true; selected_axes.z = true;
						}},
					]
				},
				click(event) {
					new Menu(this.children()).open(event.target);
				}
			})
			
			key_column = new Action('keyframe_column_create', {
				name: 'Create Keyframe Column',
				description: 'Key all channels in the timeline at the current timecode, if they already have keyframes',
				icon: 'more_vert',
				condition: () => Animator.open,
				click() {
					Timeline.selected.empty();
					let new_keyframes = [];
					Undo.initEdit({keyframes: new_keyframes})
					Timeline.animators.forEach(animator => {
						if (animator instanceof BoneAnimator == false) return;
						channels.forEach(channel => {
							if (Timeline.vue.channels[channel] !== false && animator[channel] && animator[channel].length) {
								let kf = animator.createKeyframe(null, Timeline.time, channel, false, false);
								new_keyframes.push(kf)
								Timeline.selected.push(kf);
								kf.selected = true;
							}
						})
					})
					updateKeyframeSelection();
					Undo.finishEdit('Create keyframe column');
				}
			})
			select_column = new Action('keyframe_column_select', {
				name: 'Select Keyframe Column',
				description: 'Select all keyframes in the timeline along a column below the playhead',
				icon: 'fa-sort-alpha-down',
				condition: () => Animator.open,
				click() {
					Timeline.selected.empty();
					Timeline.animators.forEach(animator => {
						if (animator instanceof BoneAnimator == false) return;
						channels.forEach(channel => {
							if (Timeline.vue.channels[channel] !== false && animator[channel] && animator[channel].length) {
								animator[channel].forEach(kf => {
									if (Math.epsilon(kf.time, Timeline.time, 1e-5) && Timeline.vue.channels[kf.channel] !== false) {
										Timeline.selected.push(kf);
										kf.selected = true;
									}
								})
							}
						})
					})
					updateKeyframeSelection();
				}
			})


			let tween_value = 50;
			tween_slider = new NumSlider('slider_tween_keyframes', {
				name: 'Tween Keyframes',
				category: 'animation',
				condition: () => Animator.open && Timeline.selected.length,
				settings: {show_bar: true, limit: false, min: 0, max: 100},
				getInterval(event) {
					return 5
				},
				get: function() {
					return tween_value;
				},
				change: function(modify) {
					let previous_tween = tween_value;
					tween_value = modify(previous_tween);

					Timeline.animators.forEach(animator => {
						if (animator instanceof BoneAnimator) {
							channels.forEach(channel => {
								let first_selected = animator[channel].find(kf => kf.selected);
								if (!first_selected) return;

								let sorted = animator[channel].slice().sort((a, b) => a.time - b.time);
								let pre, post, found_selected;
								sorted.forEach(kf => {
									if (kf.selected) {
										found_selected = true;
									} else {
										if (!found_selected) pre = kf;
										if (found_selected && !post) post = kf;
									}
								})
								let pre_val = calcKeyframeValues(pre || post || first_selected);
								let post_val = calcKeyframeValues(post || pre || first_selected);
								sorted.forEach(kf => {
									if (kf.selected) {
										let val = calcKeyframeValues(kf);
										if (selected_axes.x) kf.offset('x', pre_val[0] - val[0] + ((post_val[0] - pre_val[0]) * (tween_value / 100)));
										if (selected_axes.y) kf.offset('y', pre_val[1] - val[1] + ((post_val[1] - pre_val[1]) * (tween_value / 100)));
										if (selected_axes.z) kf.offset('z', pre_val[2] - val[2] + ((post_val[2] - pre_val[2]) * (tween_value / 100)));
									}
								})
							})
						}
					})
					Animator.preview()
				},
				onBefore: function() {
					Undo.initEdit({keyframes: Timeline.selected})
				},
				onAfter: function() {
					Undo.finishEdit('Tween keyframes')
					tween_value = 50;
					this.update();
				}
			})


			let amplify_value = 100;
			let amplify_original_values = {};
			amplify_slider = new NumSlider('slider_amplify_keyframes', {
				name: 'Amplify Keyframes',
				category: 'animation',
				condition: () => Animator.open && Timeline.selected.length,
				settings: {show_bar: true, limit: false, min: 0, max: 200},
				getInterval(event) {
					return 5
				},
				get: function() {
					return amplify_value;
				},
				change: function(modify) {
					let previous_amplify = amplify_value;
					amplify_value = modify(previous_amplify);

					Timeline.selected.forEach((kf) => {
						let val = calcKeyframeValues(kf);
						if (kf.channel == 'scale') {
							if (selected_axes.x) kf.offset('x', (amplify_original_values[kf.uuid][0]-1) * (amplify_value/100) + 1 - val[0]);
							if (selected_axes.y) kf.offset('y', (amplify_original_values[kf.uuid][1]-1) * (amplify_value/100) + 1 - val[1]);
							if (selected_axes.z) kf.offset('z', (amplify_original_values[kf.uuid][2]-1) * (amplify_value/100) + 1 - val[2]);
						} else {
							if (selected_axes.x) kf.offset('x', amplify_original_values[kf.uuid][0] * (amplify_value/100) - val[0]);
							if (selected_axes.y) kf.offset('y', amplify_original_values[kf.uuid][1] * (amplify_value/100) - val[1]);
							if (selected_axes.z) kf.offset('z', amplify_original_values[kf.uuid][2] * (amplify_value/100) - val[2]);
						}
					})
					Animator.preview();
				},
				onBefore: function() {
					Timeline.selected.forEach((kf) => {
						amplify_original_values[kf.uuid] = calcKeyframeValues(kf);
					})
					Undo.initEdit({keyframes: Timeline.selected})
				},
				onAfter: function() {
					Undo.finishEdit('Amplify keyframes')
					amplify_value = 100;
					amplify_original_values = {};
					this.update();
				}
			})

			let easing_value = 50;
			easing_slider = new NumSlider('slider_easing_keyframes', {
				name: 'Ease Keyframes',
				category: 'animation',
				condition: () => Animator.open && Timeline.selected.length,
				settings: {show_bar: true, limit: false, min: 0, max: 100},
				getInterval,
				get: function() {
					return easing_value;
				},
				change: function(modify) {
					let previous_easing = easing_value;
					easing_value = modify(previous_easing);

					Timeline.animators.forEach(animator => {
						if (animator instanceof BoneAnimator) {
							channels.forEach(channel => {
								let first_selected = animator[channel].find(kf => kf.selected);
								if (!first_selected) return;

								let sorted = animator[channel].slice().sort((a, b) => a.time - b.time);
								let pre, post, found_selected;
								sorted.forEach(kf => {
									if (kf.selected) {
										found_selected = true;
									} else {
										if (!found_selected) pre = kf;
										if (found_selected && !post) post = kf;
									}
								})
								let pre_val = calcKeyframeValues(pre || post || first_selected);
								let post_val = calcKeyframeValues(post || pre || first_selected);
								sorted.forEach(kf => {
									if (kf.selected) {
										let val = calcKeyframeValues(kf);
										let t = (kf.time - pre.time) / (post.time - pre.time);
										if (easing_value > 100) {
											t = Math.clamp(t * (easing_value / 100), 0, 1);
										}
										if (easing_value < 0) {
											t = Math.clamp(1 - (1 - t) * (1 - (easing_value / 100)), 0, 1);
										}
										let t_2 = Math.pow(1-t, 2) * 0  +  2*(1-t)*t*(Math.clamp(easing_value, 0, 100)/100)  +  Math.pow(t, 2) * 1;


										function offsetAxis(axis) {
		
											let x_p2 = pre_val[axis]  +  (post_val[axis] - pre_val[axis]) * (Math.clamp(easing_value, 0, 100)/100)
											let x_v = Math.pow(1-t_2, 2) * pre_val[axis]  +  2*(1-t_2)*t_2*x_p2  +  Math.pow(t_2, 2) * post_val[axis];
											kf.offset(getAxisLetter(axis), -val[axis] + x_v);
										}
										if (selected_axes.x) offsetAxis(0);
										if (selected_axes.y) offsetAxis(1);
										if (selected_axes.z) offsetAxis(2);
									}
								})
							})
						}
					})
					Animator.preview()
				},
				onBefore: function() {
					Undo.initEdit({keyframes: Timeline.selected})
				},
				onAfter: function() {
					Undo.finishEdit('Ease keyframes')
					easing_value = 50;
					this.update();
				}
			})


			let retime_offset = 0;
			let retime_original_values = [];
			retime_slider = new NumSlider('slider_retime_keyframes', {
				name: 'Retime Keyframes',
				category: 'animation',
				condition: () => Animator.open && Animation.selected && Timeline.selected.length,
				getInterval(event) {
					return 1 / Animation.selected.snapping;
				},
				get() {
					return retime_offset;
				},
				change(modify) {
					let previous_retime = retime_offset;
					retime_offset = modify(previous_retime);

					Timeline.selected.forEach((kf) => {
						let new_time = kf.time + retime_offset;
						let index = Math.round(new_time * Animation.selected.snapping + retime_original_values.length*100) % retime_original_values.length;
						let value = retime_original_values[index];
						if (selected_axes.x) kf.set('x', value[0]);
						if (selected_axes.y) kf.set('y', value[1]);
						if (selected_axes.z) kf.set('z', value[2]);
					})
					Animator.preview();
				},
				onBefore() {
					let original_time = Timeline.time;
					let first = Timeline.selected[0];
					for (let time = 0; time <= Animation.selected.length; time += 1 / Animation.selected.snapping) {
						Timeline.time = time;
						let value = [
							first.animator.interpolate(first.channel, true, 'x'),
							first.animator.interpolate(first.channel, true, 'y'),
							first.animator.interpolate(first.channel, true, 'z'),
						]
						retime_original_values.push(value);
					}
					Timeline.time = original_time;
					Undo.initEdit({keyframes: Timeline.selected})
				},
				onAfter() {
					Undo.finishEdit('Retime keyframes')
					retime_offset = 0;
					retime_original_values = [];
					this.update();
				}
			})

			updateSliders = function() {
				tween_slider.update();
				amplify_slider.update();
				easing_slider.update();
				retime_slider.update();
			}
			
			Blockbench.on('update_keyframe_selection', updateSliders);
		},
		onunload() {
			tween_slider.delete();
			amplify_slider.delete();
			easing_slider.delete();
			retime_slider.delete();
			axis_selector.delete();
			key_column.delete();
			select_column.delete();
			Blockbench.removeListener('update_keyframe_selection', updateSliders);
		}
	});

})()
