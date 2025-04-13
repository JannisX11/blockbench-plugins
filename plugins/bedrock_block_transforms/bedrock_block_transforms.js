(function() {

let action, style;

BBPlugin.register('bedrock_block_transforms', {
	title: 'Bedrock Block Transformation Preview',
	author: 'JannisX11',
	version: '1.0.0',
	min_version: '4.9.0',
	icon: 'token',
	description: 'Edit and preview the Minecraft Bedrock Edition block transformation component',
	variant: 'both',
	tags: ['Minecraft: Bedrock Edition'],
	onload() {
		let dialog;

		function setupDialog() {
			let scale_object = new THREE.Object3D();
			function updateTransformation(form_data) {
				let object = Project.model_3d;
				if (!form_data) {
					object.rotation.set(0, 0, 0);
					object.position.set(0, 0, 0);
					object.scale.set(1, 1, 1);
					return;
				}
				let rotation_pivot = new THREE.Vector3(
					(form_data.rotation_pivot[0] * 16),
					(form_data.rotation_pivot[1] * 16) + 8,
					(form_data.rotation_pivot[2] * 16),
				);
				object.rotation.set(
					Math.degToRad(form_data.rotation[0]),
					Math.degToRad(form_data.rotation[1]),
					Math.degToRad(form_data.rotation[2]),
					'ZYX'
				)
				let rotated_rot_pivot = new THREE.Vector3().copy(rotation_pivot).applyEuler(object.rotation);
				object.position.set(
					form_data.translation[0] * 16 + rotation_pivot.x - rotated_rot_pivot.x,
					form_data.translation[1] * 16 + rotation_pivot.y - rotated_rot_pivot.y,
					form_data.translation[2] * 16 + rotation_pivot.z - rotated_rot_pivot.z,
				)
				object.scale.set(1, 1, 1);

				if (!form_data.scale.allEqual(1)) {
					let scale_pivot = new THREE.Vector3(
						(form_data.scale_pivot[0] * 16),
						(form_data.scale_pivot[1] * 16) + 8,
						(form_data.scale_pivot[2] * 16),
					);
					scale_object.scale.set(
						form_data.scale[0] || 0.00002,
						form_data.scale[1] || 0.00002,
						form_data.scale[2] || 0.00002,
					);
					scale_object.position.x = scale_pivot.x - scale_pivot.x * form_data.scale[0];
					scale_object.position.y = scale_pivot.y - scale_pivot.y * form_data.scale[1];
					scale_object.position.z = scale_pivot.z - scale_pivot.z * form_data.scale[2];

				}
			}
			function setupPreview() {
				for (let child of Project.model_3d.children.slice()) {
					scale_object.add(child);
				}
				Project.model_3d.add(scale_object);
			}
			function resetPreview() {
				Project.model_3d.position.set(0, 0, 0);
				Project.model_3d.rotation.set(0, 0, 0);
				Project.model_3d.scale.set(1, 1, 1);
				for (let child of scale_object.children.slice()) {
					Project.model_3d.add(child);
				}
				Project.model_3d.remove(scale_object);
			}

			json_output = '';
			let last_form_data;
			dialog = new Dialog('bedrock_block_transforms', {
				title: 'Edit Block Transformation',
				cancel_on_click_outside: false,
				darken: false,
				form: {
					rotation: {label: 'Rotation', type: 'vector', dimensions: 3, value: [0, 0, 0], step: 90, min: -270, max: 270},
					translation: {label: 'Translation', type: 'vector', dimensions: 3, value: [0, 0, 0], step: 1/16},
					scale: {label: 'Scale', type: 'vector', dimensions: 3, value: [1, 1, 1 ], step: 1/20},
					rotation_pivot: {label: 'Rotation Pivot', type: 'vector', dimensions: 3, value: [0, 0, 0], step: 1/16},
					scale_pivot: {label: 'Scale Pivot', type: 'vector', dimensions: 3, value: [0, 0, 0], step: 1/16},
					json: {type: 'textarea', share_text: true},
					copy: {type: 'buttons', buttons: ['Copy'], click() {
						Clipbench.setText(json_output);
						Blockbench.showQuickMessage('Copied!')
					}}
				},
				singleButton: true,
				resizable: 'x',
				onOpen() {
					if (!scale_object.parent) {
						setupPreview();
					}
					updateTransformation(last_form_data);
				},
				onFormChange(form_data) {
					updateTransformation(form_data);
					last_form_data = form_data;
					let json = {
						rotation: form_data.rotation.allEqual(0) ? undefined : form_data.rotation,
						translation: form_data.translation.allEqual(0) ? undefined : form_data.translation,
						scale: form_data.scale.allEqual(1) ? undefined : form_data.scale,
						rotation_pivot: form_data.rotation_pivot.allEqual(0) ? undefined : form_data.rotation_pivot,
						scale_pivot: form_data.scale_pivot.allEqual(0) ? undefined : form_data.scale_pivot,
					};
					json_output = '"minecraft:transformation": ' + compileJSON(json);
					dialog.setFormValues({json: json_output}, false);
				},
				onCancel() {
					resetPreview();
				}
			});
		}

		action = new Action('bedrock_block_transforms', {
			name: 'Edit Block Transformation',
			icon: 'token',
			condition: {formats: ['bedrock_block']},
			click(event) {
				if (!dialog) setupDialog();
				dialog.show();
			}
		})
		MenuBar.menus.tools.addAction(action);

		style = Blockbench.addCSS(`
			dialog#bedrock_block_transforms textarea {
				font-family: var(--font-code);
			}
		`)
	},
	onunload() {
		if (action instanceof Action) action.delete();
		style.delete();
	}
})

})()
