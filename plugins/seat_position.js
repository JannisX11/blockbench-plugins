/// <reference path="../types/index.d.ts" />

(function() {
	let scale = 1;
	let position = [0, 0, 0];
	let rotation = 0;
	let new_version = true;


	window.SeatPositioner = {
		getDialogLines() {
			return [
				`<div class="dialog_bar">
					<label class="inline_label">Current Version</label>
						<input type="checkbox" id="STP-v" oninput="SeatPositioner.update()" checked="${new_version}">
				</div>`,
				`<div class="dialog_bar">
					<label class="inline_label">Model Scale</label>
						<input type="number" step="0.1" id="STP-s" oninput="SeatPositioner.update()" class="dark_bordered medium_width" value="${scale}">
				</div>`,
				`<div class="dialog_bar">
					<label class="inline_label">X: </label>
						<input type="number" step="0.1" id="STP-px" class="dark_bordered medium_width" oninput="SeatPositioner.update()" value="${position[0]}">
					<label class="inline_label">Y: </label>
						<input type="number" step="0.1" id="STP-py" class="dark_bordered medium_width" oninput="SeatPositioner.update()" value="${position[1]}">
					<label class="inline_label">Z: </label>
						<input type="number" step="0.1" id="STP-pz" class="dark_bordered medium_width" oninput="SeatPositioner.update()" value="${position[2]}">
					<label class="inline_label">Rotation</label>
						<input type="number" step="1" id="STP-r" oninput="SeatPositioner.update()" class="dark_bordered medium_width" value="${rotation}">
				</div>`,
				`<div class="dialog_bar">
					<input type="text" id="STP-out" class="dark_bordered input_wide code" readonly>
				</div>`
			]
		},
		dialog: new Dialog({
			id: 'seat_position',
			title: 'Seat Position',
			width: 540,
			lines: [],
			singleButton: true,
			onConfirm: function() {
				scene.remove(SeatPositioner.object);
				this.hide()
			}
		}),
		object: new THREE.Object3D(),
		setupObject: function() {
	
			if (SeatPositioner.init) return;
	
			var O = SeatPositioner.object;
			var M = new THREE.MeshLambertMaterial({color: 0xffffff});
	
			var head = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 8), M);
			head.position.y = 19;
			O.add(head);
	
			var body = new THREE.Mesh(new THREE.BoxGeometry(8, 12, 4), M);
			body.position.y = 9;
			O.add(body);
	
			var leg_geo = new THREE.BoxGeometry();
			leg_geo.setShape([-2, -12, -2], [2, 0, 2]);
	
			var leg_r = new THREE.Mesh(leg_geo, M);
			leg_r.position.set(2, 3, 0);
			leg_r.rotation.x = Math.degToRad(70);
			leg_r.rotation.z = Math.degToRad(13);
			O.add(leg_r);
	
			var leg_l = new THREE.Mesh(leg_geo, M);
			leg_l.position.set(-2, 3, 0);
			leg_l.rotation.x = Math.degToRad(70);
			leg_l.rotation.z = Math.degToRad(-13);
			O.add(leg_l);
	
			var arm_geo = new THREE.BoxGeometry();
			arm_geo.setShape([-2, -10, -2], [2, 2, 2]);
	
			var arm_r = new THREE.Mesh(arm_geo, M);
			arm_r.position.set(6, 13, 0);
			arm_r.rotation.x = Math.degToRad(36);
			O.add(arm_r);
	
			var arm_l = new THREE.Mesh(arm_geo, M);
			arm_l.position.set(-6, 13, 0);
			arm_l.rotation.x = Math.degToRad(36);
			O.add(arm_l);
	
			SeatPositioner.init = true;
		},
		update: function() {
			let output = '';

			position[0] = trimFloatNumber(parseFloat($('#STP-px').val())||0);
			position[1] = trimFloatNumber(parseFloat($('#STP-py').val())||0);
			position[2] = trimFloatNumber(parseFloat($('#STP-pz').val())||0);

			new_version = $('#STP-v').is(':checked');
			SeatPositioner.object.position.set(
				position[0] * -16,
				position[1] * 16 + (new_version ? 2.2 : 0),
				position[2] * -16,
			);
			output = `"position": [${position.join(', ')}]`;
			
			scale = parseFloat( $('#STP-s').val() )||0
			var s = 1 / scale;
			SeatPositioner.object.scale.set(s, s, s);

			rotation = parseFloat( $('#STP-r').val() )||0;
			SeatPositioner.object.rotation.y = -Math.degToRad(rotation);
			if (rotation) {
				output += `, "rotate_rider_by": ${trimFloatNumber(rotation)}`
			}
				
			$('#STP-out').val(output);
	
		}
	};


	window.SetupHitboxHelper = {
		dialog: new Dialog({
			id: 'setup_hitbox',
			title: 'Setup Hitbox',
			width: 540,
			form: {
				type: {label: 'Type', type: 'select', options: {
					entity_hitbox: 'Entity Hitbox',
					entity_collision: 'Entity Collision',
					block_selection_box: 'Block Selection Box',
					block_collision: 'Block Collision',
				}},
				size_entity: {label: 'Size', type: 'vector', value: [1, 1], dimensions: 2, step: 0.1, condition: form => form.type == 'entity_hitbox' || form.type == 'entity_collision'},
				offset_entity: {label: 'Offset', type: 'vector', value: [0, 0, 0], step: 0.1, condition: form => form.type == 'entity_hitbox'},
				size_block: {label: 'Size', type: 'vector', value: [16, 16, 16], max: 16, min: 0, dimensions: 3, condition: form => form.type.startsWith('block')},
				offset_block: {label: 'Offset', type: 'vector', value: [0, 0, 0], condition: form => form.type.startsWith('block')},
				result: {type: 'textarea', height: 130, readonly: true}
			},
			singleButton: true,
			onFormChange({type, size_entity, size_block, offset_entity, offset_block}) {
				if (type.startsWith('entity')) {
					SetupHitboxHelper.object.scale.x = SetupHitboxHelper.object.scale.z = size_entity[0] || 0.01;
					SetupHitboxHelper.object.scale.y = size_entity[1] || 0.01;
					SetupHitboxHelper.object.position.fromArray(offset_entity).multiplyScalar(16);
					SetupHitboxHelper.object.position.set(
						-offset_entity[0] * 16,
						offset_entity[1] * 16,
						-offset_entity[2] * 16
					);
				} else {
					SetupHitboxHelper.object.scale.x = size_block[0]/16 || 0.01;
					SetupHitboxHelper.object.scale.z = size_block[2]/16 || 0.01;
					SetupHitboxHelper.object.scale.y = size_block[1]/16 || 0.01;
					SetupHitboxHelper.object.position.set(
						-offset_block[0],
						offset_block[1],
						offset_block[2]
					);
				}

				let result_string;
				if (type == 'entity_hitbox') {
					// Entity
					result_string = '"minecraft:custom_hit_test": '+ compileJSON({
						"hitboxes": [
							{
								width: size_entity[0],
								height: size_entity[1],
								pivot: [offset_entity[0], offset_entity[1] + size_entity[1]/2, offset_entity[2]]
							}
						]
					})
				} else if (type == 'entity_collision') {
					// Entity
					result_string = '"minecraft:collision_box": '+ compileJSON({
						width: size_entity[0],
						height: size_entity[1],
					})
				} else {
					// Block
					let value = compileJSON({
						origin: [offset_block[0] - size_block[0]/2, offset_block[1], offset_block[2] - size_block[2]/2],
						size: size_block
					});16

					if (size_block.allEqual(0)) value = false;
					if (size_block.allEqual(16) && offset_block.allEqual(0)) value = true;

					result_string = `"minecraft:${type == 'block_collision' ? 'collision_box' : 'selection_box'}": ` + value
				}
				$('dialog#setup_hitbox textarea').val(result_string).addClass('code');
			},
			onOpen() {
				if (!this.getFormResult().type?.endsWith('block') && Format.id == 'bedrock_block') {
					setTimeout(() => {
						this.setFormValues({type: 'block_collision'});
					}, 10);
				}
			},
			onConfirm() {
				scene.remove(SetupHitboxHelper.object);
				this.hide()
			}
		}),
		size: [1, 0],
		offset: [0, 0, 0],
		object: null,
		setupObject: function() {
	
			if (SetupHitboxHelper.init) return;
			let object = SetupHitboxHelper.object = new THREE.LineSegments(
				new THREE.BufferGeometry(),
				new THREE.LineBasicMaterial({color: 0xffbd2e})
			)
			let position_array = [
				8, 0, 8, 	8, 16, 8,
				8, 0, -8, 	8, 16, -8,
				-8, 0, 8, 	-8, 16, 8,
				-8, 0, -8,	-8, 16, -8,

				8, 0, 8,	-8, 0, 8,
				8, 0, -8,	-8, 0, -8,
				8, 16, 8,	-8, 16, 8,
				8, 16, -8,	-8, 16, -8,

				8, 0, 8,	8, 0, -8,
				-8, 0, 8,	-8, 0, -8,
				8, 16, 8,	8, 16, -8,
				-8, 16, 8,	-8, 16, -8,
			]
			object.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(position_array), 3));
			object.geometry.attributes.position.needsUpdate = true;
			SetupHitboxHelper.init = true;
		}
	};
	
	var seat_pos_action, hitbox_action, style;

	Plugin.register('seat_position', {
		title: 'Seat Position + Hitbox',
		icon: 'event_seat',
		author: 'JannisX11',
		description: 'Preview seat positions, hit/selection boxes, and collision boxes for custom MC Bedrock entities and blocks',
		tags: ["Minecraft: Bedrock Edition"],
		version: '1.3.2',
		variant: 'both',
		onload() {
			seat_pos_action = new Action('open_seat_position', {
				name: 'Setup Seat Position',
				icon: 'event_seat',
				condition: _ => Format.bone_rig,
				click: () => {
					SeatPositioner.dialog.lines = SeatPositioner.getDialogLines();
					SeatPositioner.dialog.show();
					$('#blackout').hide(0);
					SeatPositioner.setupObject();
					scene.add(SeatPositioner.object);
				}
			})
			hitbox_action = new Action('open_hitbox_setup', {
				name: 'Setup Hitbox',
				description: 'Set up an entity or block collision, hitbox, or selection box',
				icon: 'view_in_ar',
				condition: _ => Format.bone_rig,
				click: () => {
					SetupHitboxHelper.dialog.show();
					$('#blackout').hide(0);
					SetupHitboxHelper.setupObject();
					scene.add(SetupHitboxHelper.object);
					SetupHitboxHelper.dialog.updateFormValues();
				}
			})
			MenuBar.addAction(seat_pos_action, 'filter');
			MenuBar.addAction(hitbox_action, 'filter');

			style = Blockbench.addCSS(`
				dialog#setup_hitbox textarea {
					tab-size: 40px;
				}
			`)
		},
		onunload() {
			seat_pos_action.delete();
			hitbox_action.delete();
		}
	})

})()
