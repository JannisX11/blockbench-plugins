/// <reference path="../types/index.d.ts" />

(function() {

var bake_action;

Plugin.register('bakery', {
	title: 'Bakery',
	icon: 'storefront',
	author: 'JannisX11',
	description: 'Bakes complex animations into simple linear keyframes',
	version: '1.1.0',
	min_version: '3.7.0',
	variant: 'both',
	onload() {
		bake_action = new Action('bake_animations', {
		    name: 'Bake Animations',
		    icon: 'storefront',
		    category: 'animation',
		    condition: {modes: ['animate']},
		    click: function(ev) {
		    	if (Timeline.selected.length === 0) {
					Blockbench.showMessage('No keyframes selected', 'center')
					return;
				}

				new Dialog({
					id: 'bake_animations',
					title: 'Bake Animations',
					icon: 'storefront',
					form: {
						rate: {label: 'Rate', type: 'number', value: 1},
						spherical_interpolation: {label: 'Spherical Interpolation', type: 'checkbox', value: false},
					},
					onConfirm: function(formData) {
						this.hide()
						
						let target_keyframes = Timeline.selected.slice();
						let keyframes = Timeline.selected.slice();
						Undo.initEdit({keyframes});
						let animators = [];
						Timeline.selected.forEach(kf => animators.safePush(kf.animator));
						let channels = ['rotation', 'position', 'scale'];

						animators.forEach(animator => {
							let mesh = animator.getGroup().mesh;
							channels.forEach(channel => {
								if (!animator[channel]) return;
								let kfs = animator[channel].filter(kf => target_keyframes.includes(kf));
								if (kfs.length < 2) return;

								kfs.sort((a, b) => a.time - b.time);

								let [min, max] = [kfs[0].time, kfs.last().time];
								let step = 1/Animation.selected.snapping*formData.rate || 0.1;
								let new_keyframes = [];

								for (let time = min; time <= max; time += step) {

									Timeline.time = time;
									let keyframe = kfs.find(kf => Math.epsilon(kf.time, time, 0.006));

									if (!keyframe) {
										keyframe = new Keyframe({
											channel, time
										}, null, animator);
										if (channel == 'rotation' && formData.spherical_interpolation) {
											let before = kfs.findLast(kf => kf.time < time);
											let after = kfs.find(kf => kf.time > time);
											if (before && after) {
												let quat_before = before.getFixed(0, true);
												let quat_after = after.getFixed(0, true);
												let t = Math.getLerp(before.time, after.time, time);
												let slerp = quat_before.slerp(quat_after, t);

												let euler = new THREE.Euler().setFromQuaternion(slerp, mesh.rotation.order);
												keyframe.set('x', Math.trimDeg( (-Math.radToDeg(euler.x - mesh.fix_rotation.x)) ));
												keyframe.set('y', Math.trimDeg( (-Math.radToDeg(euler.y - mesh.fix_rotation.y)) ));
												keyframe.set('z', Math.trimDeg( ( Math.radToDeg(euler.z - mesh.fix_rotation.z)) ));
											}

										} else {
											animator.fillValues(keyframe, null, true, false);
										}
										new_keyframes.push(keyframe);
									}
								}
								new_keyframes.forEach(kf => {
									animator[channel].push(kf);
									keyframes.push(kf);
									kf.animator = animator;
								})
								target_keyframes.push(...new_keyframes);
							})
						})
						target_keyframes.forEach(kf => {
							if (!channels.includes(kf.channel)) return;
							Timeline.time = kf.time;
							kf.animator.fillValues(kf, null, false);
							kf.interpolation = 'linear';
						});
						TickUpdates.keyframes = true;
						Animator.preview();

						Undo.finishEdit('bake keyframes');
					}
				}).show()
		    }
		})
		MenuBar.addAction(bake_action, 'animation')
	},
	onunload() {
		bake_action.delete()
	}
});

})()
