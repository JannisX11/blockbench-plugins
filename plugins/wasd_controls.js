(function() {

let deletables = [];

BBPlugin.register('wasd_controls', {
	title: 'WASD Controls',
	icon: 'sports_esports',
	author: 'JannisX11',
	description: 'Adds a WASD controlled viewport navigation mode',
	about: 'The WASD mode can be enabled from the View menu.\nThe keys can be remapped in the keybindings menu.\nThe sensitivity can be changed in the settings under Preview.',
	version: '1.0.0',
	min_version: '4.1.0',
	variant: 'both',
	onload() {
		let navigate_forward = new KeybindItem('navigate_forward', {
		    name: 'Move Forward',
		    icon: 'arrow_upward',
		    category: 'navigate',
			keybind: new Keybind({key: 'w'})
		})
		let navigate_backward = new KeybindItem('navigate_backward', {
		    name: 'Move Backward',
		    icon: 'arrow_upward',
		    category: 'navigate',
			keybind: new Keybind({key: 's'})
		})
		let navigate_left = new KeybindItem('navigate_left', {
		    name: 'Move Left',
		    icon: 'arrow_upward',
		    category: 'navigate',
			keybind: new Keybind({key: 'a'})
		})
		let navigate_right = new KeybindItem('navigate_right', {
		    name: 'Move Right',
		    icon: 'arrow_upward',
		    category: 'navigate',
			keybind: new Keybind({key: 'd'})
		})
		let navigate_down = new KeybindItem('navigate_down', {
		    name: 'Move Down',
		    icon: 'arrow_upward',
		    category: 'navigate',
			keybind: new Keybind({key: 16})
		})
		let navigate_up = new KeybindItem('navigate_up', {
		    name: 'Move Up',
		    icon: 'arrow_upward',
		    category: 'navigate',
			keybind: new Keybind({key: 32})
		})
		let navigation_keybinds = [navigate_forward, navigate_backward, navigate_left, navigate_right, navigate_down, navigate_up];
		deletables.push(...navigation_keybinds);

		// Fix for 4.2.2
		navigate_forward.name = 'Move Forward';
		navigate_backward.name = 'Move Backward';
		navigate_left.name = 'Move Left';
		navigate_right.name = 'Move Right';
		navigate_down.name = 'Move Down';
		navigate_up.name = 'Move Up';

		function setupWASDMovement(preview, length = 1) {
			let pos = new THREE.Vector3().copy(preview.camera.position);
			pos.add(preview.camera.getWorldDirection(new THREE.Vector3()).normalize().multiplyScalar(length));
			preview.controls.target.copy(pos);

			preview.controls.enable_zoom = false;
		}

		let wasd_toggle = new Toggle('wasd_movement', {
		    name: 'WASD Movement',
		    icon: 'sports_esports',
		    category: 'navigate',
			value: false,
			onChange(value) {
				setupWASDMovement(Preview.selected, value ? 1 : 16);
				Preview.all.forEach(preview => {
					preview.controls.enableZoom = !value;
				})
			}
		})
		deletables.push(wasd_toggle);
		MenuBar.menus.view.addAction('_');
		MenuBar.menus.view.addAction(wasd_toggle);

		deletables.push(new Setting('wasd_sensitivity', {
			name: 'WASD Sensitivity',
			category: 'preview',
			type: 'number',
			value: 100,
			min: 1
		}))

		let pressed_keys = [];
		document.addEventListener('keydown', event => {
			let key = event.which;
			if (navigation_keybinds.find(k => k.keybind.key == key) && !getFocusedTextInput()) {
				pressed_keys.safePush(key);
			}
		})
		document.addEventListener('keyup', event => {
			pressed_keys.remove(event.which);
		})

		function doWASDMovement() {

			let movement = new THREE.Vector3(0, 0, 0);
			let uses_wasd_movement = false;
			function add(x, y, z) {
				movement.x += x;
				movement.y += y;
				movement.z += z;
				uses_wasd_movement = true;
			}
			if (pressed_keys.includes(navigate_forward.keybind.key)) add(0, 0, 1);
			if (pressed_keys.includes(navigate_backward.keybind.key)) add(0, 0, -1);
			if (pressed_keys.includes(navigate_left.keybind.key)) add(1, 0, 0);
			if (pressed_keys.includes(navigate_right.keybind.key)) add(-1, 0, 0);
			if (pressed_keys.includes(navigate_down.keybind.key)) add(0, -1, 0);
			if (pressed_keys.includes(navigate_up.keybind.key)) add(0, 1, 0);
			
			if (uses_wasd_movement) {
				setupWASDMovement(Preview.selected);

				let vec = Preview.selected.controls.object.getWorldDirection(new THREE.Vector3()).normalize();
				let angle = Math.atan2(vec.x, vec.z)
				movement.applyAxisAngle(THREE.NormalY, angle);
				movement.multiplyScalar(Settings.get('wasd_sensitivity') / 100);
				Preview.selected.camera.position.add(movement);
				Preview.selected.controls.target.add(movement);
			}
		}

		let old_animate = window.animate;
		window.animate = function(...args) {
			old_animate(...args);

			if (Preview.selected && BarItems.wasd_movement && BarItems.wasd_movement.value && pressed_keys.length) {
				doWASDMovement();
			}
		}
	},
	oninstall() {
		MenuBar.menus.view.highlight(BarItems.wasd_movement)
	},
	onunload() {
		deletables.forEach(action => {
			action.delete();
		})
	}
});

})()
