let deletables = [];
let active = false;
let suppress_updates = false;
let pointer_locked = false;
let pressed_keys = [];
let last_frame_time = 0;
let render_frame_listener;
let press_key_listener;
let mouse_move_listener;
let mouse_down_listener;
let pointer_lock_listener;
let key_up_listener;
let navigation_keybinds = [];

const ORBIT_TARGET_DISTANCE = 8;
const PITCH_LIMIT = Math.PI / 2 - 0.01;

function syncOrbitTarget(preview, distance = ORBIT_TARGET_DISTANCE) {
	let forward = preview.camera.getWorldDirection(new THREE.Vector3());
	preview.controls.target.copy(preview.camera.position).add(forward.multiplyScalar(distance));
}

function captureCameraOrientation(preview) {
	preview.camera.rotation.setFromQuaternion(preview.camera.quaternion, 'YXZ');
	preview.camera.rotation.order = 'YXZ';
}

function preparePreviewForFreecam(preview) {
	if (preview.angle != null) {
		preview.setLockedAngle();
	}
	if (preview.isOrtho) {
		preview.setProjectionMode(false);
	}
	captureCameraOrientation(preview);
	preview.controls.unlinked = true;
	preview.controls.enableRotate = false;
	preview.controls.enablePan = false;
	preview.controls.enableZoom = false;
	syncOrbitTarget(preview);
	preview.render();
}

function restorePreviewControls(preview) {
	preview.controls.unlinked = false;
	preview.controls.enableRotate = true;
	preview.controls.enablePan = true;
	preview.controls.enableZoom = true;
}

function exitPointerLock() {
	if (document.pointerLockElement && document.exitPointerLock) {
		document.exitPointerLock();
	}
	pointer_locked = false;
}

function requestPointerLock(preview) {
	let target = preview.node || preview.canvas;
	if (target && target.requestPointerLock) {
		target.requestPointerLock();
	}
}

function isMovementKey(key) {
	return navigation_keybinds.find(item => item.keybind.key == key);
}

function isFreecamInputActive() {
	return active && Preview.selected && !getFocusedTextInput();
}

function applyMouseLook(preview, movementX, movementY) {
	let sensitivity = settings.freecam_mouse_sensitivity.value;
	let invert = settings.freecam_invert_y.value ? -1 : 1;

	preview.camera.rotation.order = 'YXZ';
	preview.camera.rotation.y -= movementX * sensitivity;
	preview.camera.rotation.x -= movementY * sensitivity * invert;
	preview.camera.rotation.x = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, preview.camera.rotation.x));

	syncOrbitTarget(preview);
	preview.render();
	Blockbench.dispatchEvent('update_camera_position', {preview});
}

function applyMovement(preview, delta) {
	let movement = new THREE.Vector3();
	let uses_movement = false;

	function add(x, y, z) {
		movement.x += x;
		movement.y += y;
		movement.z += z;
		uses_movement = true;
	}

	if (pressed_keys.includes(navigation_keybinds[0].keybind.key)) add(0, 0, -1);
	if (pressed_keys.includes(navigation_keybinds[1].keybind.key)) add(0, 0, 1);
	if (pressed_keys.includes(navigation_keybinds[2].keybind.key)) add(-1, 0, 0);
	if (pressed_keys.includes(navigation_keybinds[3].keybind.key)) add(1, 0, 0);
	if (pressed_keys.includes(navigation_keybinds[4].keybind.key)) add(0, 1, 0);
	if (pressed_keys.includes(navigation_keybinds[5].keybind.key)) add(0, -1, 0);
	if (!uses_movement) return;

	movement.normalize();

	let speed = settings.freecam_speed.value;
	if (pressed_keys.includes(navigation_keybinds[6].keybind.key)) {
		speed *= settings.freecam_fast_mult.value;
	} else if (pressed_keys.includes(navigation_keybinds[7].keybind.key)) {
		speed *= settings.freecam_slow_mult.value;
	}

	movement.applyQuaternion(preview.camera.quaternion);
	preview.camera.position.addScaledVector(movement, speed * delta);
	syncOrbitTarget(preview);
	preview.render();
	Blockbench.dispatchEvent('update_camera_position', {preview});
}

function syncUiState() {
	suppress_updates = true;
	settings.freecam_enabled.value = active;
	BarItems.freecam_mode.value = active;
	BarItems.freecam_mode.updateEnabledState();
	suppress_updates = false;
}

function setActive(value) {
	if (active == value) return;
	active = value;

	let preview = Preview.selected;

	if (active) {
		if (!preview) {
			active = false;
			Blockbench.showQuickMessage('Freecam: no viewport selected.');
			return;
		}
		preparePreviewForFreecam(preview);
		syncUiState();
		Blockbench.showQuickMessage('Freecam enabled. Click the viewport to capture the mouse.');
	} else {
		exitPointerLock();
		if (preview) {
			syncOrbitTarget(preview);
			restorePreviewControls(preview);
			preview.controls.update();
			preview.render();
		}
		pressed_keys.length = 0;
		syncUiState();
	}
}

BBPlugin.register('freecam', {
	title: 'Freecam',
	author: 'Dmitriy',
	description: 'Adds a fly camera mode for viewport navigation',
	icon: 'videocam',
	version: '1.0.2',
	min_version: '5.0.0',
	variant: 'both',
	repository: 'https://github.com/wantid/blockbench-freecam/tree/main/freecam',
	tags: ['Tool', 'UX'],
	onload() {
		deletables = [];

		let navigate_forward = new KeybindItem('freecam_forward', {
			name: 'Freecam Move Forward',
			icon: 'arrow_upward',
			category: 'navigate',
			keybind: new Keybind({key: 'w', ctrl: null})
		});
		let navigate_backward = new KeybindItem('freecam_backward', {
			name: 'Freecam Move Backward',
			icon: 'arrow_downward',
			category: 'navigate',
			keybind: new Keybind({key: 's', ctrl: null})
		});
		let navigate_left = new KeybindItem('freecam_left', {
			name: 'Freecam Move Left',
			icon: 'arrow_back',
			category: 'navigate',
			keybind: new Keybind({key: 'a', ctrl: null})
		});
		let navigate_right = new KeybindItem('freecam_right', {
			name: 'Freecam Move Right',
			icon: 'arrow_forward',
			category: 'navigate',
			keybind: new Keybind({key: 'd', ctrl: null})
		});
		let navigate_up = new KeybindItem('freecam_up', {
			name: 'Freecam Move Up',
			icon: 'expand_less',
			category: 'navigate',
			keybind: new Keybind({key: 'r', ctrl: null})
		});
		let navigate_down = new KeybindItem('freecam_down', {
			name: 'Freecam Move Down',
			icon: 'expand_more',
			category: 'navigate',
			keybind: new Keybind({key: 'f', ctrl: null})
		});
		let navigate_faster = new KeybindItem('freecam_faster', {
			name: 'Freecam Move Faster',
			icon: 'fast_forward',
			category: 'navigate',
			keybind: new Keybind({key: 16, ctrl: null, shift: null, alt: null})
		});
		let navigate_slower = new KeybindItem('freecam_slower', {
			name: 'Freecam Move Slower',
			icon: 'slow_motion_video',
			category: 'navigate',
			keybind: new Keybind({key: 18, ctrl: null, shift: null, alt: null})
		});

		navigation_keybinds = [
			navigate_forward,
			navigate_backward,
			navigate_left,
			navigate_right,
			navigate_up,
			navigate_down,
			navigate_faster,
			navigate_slower
		];
		deletables.push(...navigation_keybinds);

		deletables.push(new Setting('freecam_enabled', {
			name: 'Freecam Enabled',
			description: '_',
			category: 'preview',
			value: false,
			onChange(value) {
				if (suppress_updates) return;
				setActive(value);
			}
		}));

		deletables.push(new Setting('freecam_speed', {
			name: 'Freecam Speed',
			description: '-',
			category: 'preview',
			type: 'number',
			value: 120,
			min: 1,
			max: 1000
		}));

		deletables.push(new Setting('freecam_mouse_sensitivity', {
			name: 'Freecam Mouse Sensitivity',
			description: '-',
			category: 'preview',
			type: 'number',
			value: 0.002,
			min: 0.0001,
			max: 0.02,
			step: 0.0001
		}));

		deletables.push(new Setting('freecam_invert_y', {
			name: 'Freecam Invert Y',
			description: 'Invert vertical mouse look while in freecam mode',
			category: 'preview',
			value: false
		}));

		deletables.push(new Setting('freecam_fast_mult', {
			name: 'Freecam Fast Multiplier',
			description: '-',
			category: 'preview',
			type: 'number',
			value: 2.5,
			min: 1,
			max: 10
		}));

		deletables.push(new Setting('freecam_slow_mult', {
			name: 'Freecam Slow Multiplier',
			description: '-',
			category: 'preview',
			type: 'number',
			value: 0.35,
			min: 0.05,
			max: 1
		}));

		let freecam_toggle = new Toggle('freecam_mode', {
			name: 'Freecam Mode',
			icon: 'videocam',
			category: 'navigate',
			keybind: new Keybind({key: 117}),
			value: false,
			onChange(value) {
				if (suppress_updates) return;
				setActive(value);
			}
		});
		deletables.push(freecam_toggle);

		MenuBar.menus.view.addAction('_');
		MenuBar.menus.view.addAction(freecam_toggle);

		if (settings.freecam_enabled.value) {
			BarItems.freecam_mode.value = true;
			setActive(true);
		}

		press_key_listener = data => {
			let key = data.event.which;
			if (!isMovementKey(key) || !isFreecamInputActive()) return;
			pressed_keys.safePush(key);
			data.capture();
		};
		Blockbench.on('press_key', press_key_listener);

		key_up_listener = event => {
			pressed_keys.remove(event.which);
		};
		document.addEventListener('keyup', key_up_listener);

		mouse_move_listener = event => {
			if (!active || !pointer_locked || !Preview.selected) return;
			applyMouseLook(Preview.selected, event.movementX, event.movementY);
		};
		document.addEventListener('mousemove', mouse_move_listener);

		mouse_down_listener = event => {
			if (!active || event.button != 0 || !Preview.selected) return;
			let preview = Preview.selected;
			if (!preview.canvas.contains(event.target) && !preview.node.contains(event.target)) return;
			requestPointerLock(preview);
		};
		document.addEventListener('mousedown', mouse_down_listener);

		pointer_lock_listener = () => {
			pointer_locked = document.pointerLockElement != null;
		};
		document.addEventListener('pointerlockchange', pointer_lock_listener);

		render_frame_listener = () => {
			let now = performance.now();
			let delta = last_frame_time ? (now - last_frame_time) / 1000 : 0;
			last_frame_time = now;

			if (!active || !pressed_keys.length || !Preview.selected) return;
			applyMovement(Preview.selected, delta);
		};
		Blockbench.on('render_frame', render_frame_listener);
	},
	onunload() {
		if (active) {
			setActive(false);
		}
		exitPointerLock();

		Blockbench.removeListener('press_key', press_key_listener);
		Blockbench.removeListener('render_frame', render_frame_listener);
		document.removeEventListener('keyup', key_up_listener);
		document.removeEventListener('mousemove', mouse_move_listener);
		document.removeEventListener('mousedown', mouse_down_listener);
		document.removeEventListener('pointerlockchange', pointer_lock_listener);

		deletables.forEach(item => item.delete());
		deletables = [];
		pressed_keys.length = 0;
		last_frame_time = 0;
	},
	oninstall() {
		MenuBar.menus.view.highlight(BarItems.freecam_mode);
	}
});
