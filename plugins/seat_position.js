(function() {
	let scale = 1;
	let position = [0, 0, 0]

	function getDialogLines() {
		console.log({scale, position})
		return [
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
			</div>`,
			`<div class="dialog_bar">
				<input id="STP-out" class="dark_bordered input_wide code" readonly>
			</div>`
		]
	}

	window.SeatPositioner = {
		dialog: new Dialog({
			id: 'seat_position',
			title: 'Seat Position',
			width: 540,
			lines: getDialogLines(),
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
	
			var head = new THREE.Mesh(new THREE.CubeGeometry(8, 8, 8), M);
			head.position.y = 19;
			O.add(head);
	
			var body = new THREE.Mesh(new THREE.CubeGeometry(8, 12, 4), M);
			body.position.y = 9;
			O.add(body);
	
			var leg_geo = new THREE.CubeGeometry();
			leg_geo.from([-2, -12, -2]);
			leg_geo.to([2, 0, 2]);
	
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
	
			var arm_geo = new THREE.CubeGeometry();
			arm_geo.from([-2, -10, -2]);
			arm_geo.to([2, 2, 2]);
	
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
			position[0] = trimFloatNumber(parseFloat($('#STP-px').val())||0);
			position[1] = trimFloatNumber(parseFloat($('#STP-py').val())||0);
			position[2] = trimFloatNumber(parseFloat($('#STP-pz').val())||0);

			SeatPositioner.object.position.set(
				position[0] * -16,
				position[1] * 16,
				position[2] * -16,
			);
			scale = parseFloat( $('#STP-s').val() )||0
			var s = 1 / scale;
			SeatPositioner.object.scale.set(s, s, s);
	
			$('#STP-out').val(`"position": [${position.join(', ')}]`);
	
		}
	};
	
	var action;

	Plugin.register('seat_position', {
		title: 'Seat Position',
		icon: 'event_seat',
		author: 'JannisX11',
		description: 'Preview seat positions for custom Bedrock entities',
		version: '1.1.1',
		variant: 'both',
		onload() {
			action = new Action({
				id: 'open_seat_position',
				name: 'Seat Position',
				icon: 'event_seat',
				condition: _ => Format.bone_rig,
				click: () => {
					SeatPositioner.dialog.lines = getDialogLines();
					SeatPositioner.dialog.show();
					$('#blackout').hide(0);
					SeatPositioner.setupObject();
					scene.add(SeatPositioner.object);
				}
			})
			MenuBar.addAction(action, 'filter');
		},
		onunload() {
			action.delete()
		}
	})

})()
