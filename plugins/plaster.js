/// <reference path="../types/index.d.ts" />

(function() {

var plaster_action;

Plugin.register('plaster', {
	title: 'Plaster',
	icon: 'healing',
	author: 'JannisX11',
	description: 'Fixes texture bleeding (small white or colored lines around the edges of your model) by slightly shrinking UV maps',
	version: '1.1.0',
	min_version: '3.0.5',
	variant: 'both',
	onload() {
		plaster_action = new Action({
		    id: 'plaster',
		    name: 'Plaster',
		    icon: 'healing',
		    category: 'edit',
		    condition: () => !(Project.box_uv && !Format.optional_box_uv),
		    click(ev) {
		    	if (selected.length === 0) {
					Blockbench.showMessage('No cubes selected', 'center')
					return;
				}
				let elements = Outliner.selected.filter(element => element.faces);

				new Dialog({
					id: 'plaster',
					title: 'Plaster',
					icon: 'healing',
					form: {
						margin: {label: 'Margin', type: 'select', options: {
							s: 'Small',
							m: 'Medium',
							l: 'Large',
							xl: 'Extra Large',
							custom: 'Custom',
						}, default: 'm'},
						custom: {label: 'Custom Margin (%)', value: 5, min: 0, max: 50, condition: result => result.margin == 'custom'}
					},
					onConfirm(formData) {
						this.hide()
						//Margin
						var margin;
						switch (formData.margin) {
							case 's':
								margin = 0.016
								break;
							case 'm':
								margin = 0.032
								break;
							case 'l':
								margin = 0.06
								break;
							case 'xl':
								margin = 0.1
								break;
							case 'custom':
								margin = formData.custom/100
								break;
						}
						let fixNumber = function(number, isSecond) {
							//Vars
							let adapted_margin = margin
							let x1 = number
							let edge = x1%1
							let floor = Math.floor(x1)

							//Switches
							if (edge > 0.9 && !isSecond) {
								edge = 1 + adapted_margin
							} else if (edge < 0.1 && isSecond) {
								edge = -adapted_margin
							} else if (edge === 0 && !isSecond) {
								edge = adapted_margin
							}
							//Return
							return floor+edge
						}
						Undo.initEdit({elements, uv_only: true})
						//Processing
						elements.forEach(element => {
							for (let fkey in element.faces) {
								let face = element.faces[fkey];
								if (face.texture !== null) {

									if (face instanceof MeshFace) {
										let uv_center = [0, 0];
										let vertices = face.getSortedVertices();
										for (let vkey of vertices) {
											console.log(uv_center.slice(), face.uv[vkey].slice())
											uv_center.V2_add(face.uv[vkey]);
										}
										uv_center.V2_divide(vertices.length);
										for (let vkey of vertices) {
											let diff_to_center = uv_center.slice().V2_subtract(face.uv[vkey]);
											let distance = Math.sqrt(Math.pow(diff_to_center[0], 2) + Math.pow(diff_to_center[1], 2));
											console.log({uv_center, uv: face.uv[vkey].slice(), diff_to_center, distance, margin, vkey, face})
											face.uv[vkey][0] += (diff_to_center[0] / distance) * margin;
											face.uv[vkey][1] += (diff_to_center[1] / distance) * margin;
										}

									} else if (face.uv instanceof Array) {
										face.uv.forEach(function(u, i) {
											let is_mirrored = face.uv[ (i>1?i-2:i) ] > face.uv[i+ (i>1?0:2) ]
											face.uv[i] = fixNumber(face.uv[i], i>1 !== is_mirrored)
										})
									}
								}
							}
							element.preview_controller.updateUV(element);
						})
						UVEditor.loadData()
						Undo.finishEdit('plaster')
					}
				}).show()
		    }
		})
		MenuBar.addAction(plaster_action, 'filter')
	},
	onunload() {
		plaster_action.delete()
	}
});

})()
