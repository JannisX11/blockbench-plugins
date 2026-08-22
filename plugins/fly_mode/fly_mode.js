/** @typedef { import("three") } */
(() => {
	'use strict'
	const { Vector3, Euler, NormalY} = THREE;

	let is_active = false;
	/** @type {(() => void)[]} */
	const disposers = [];

	/**
	 * @template {{delete: () => void}} TDeletable
	 * @param {TDeletable} deletable
	 * @returns {TDeletable}
	 */
	const deleteOnUnload = deletable => {
		disposers.push(() => deletable.delete());
		return deletable;
	};

	BBPlugin.register("fly_mode", {
		title: "Fly Mode",
		icon: "sports_esports",
		author: "nklbdev",
		description: "Adds a FPS-fly viewport navigation mode",
		version: "1.0.0",
		min_version: "5.0.0",
		variant: "both",
		onload() {
			const MAX_PITCH_ANGLE = Math.PI * 0.5 * 0.99;

			const pressed_keys_codes = new Set();
			let captured_target_distance = 0.0;
			let runtime_speed_multiplier = 1.0;
			let speed_iteration = 0;

			const temp_movement = new Vector3();
			const temp_camera_euler = new Euler();

			const navigation_keybinds = [];
			const addKeybindItem = (id_suffix, icon, key) => {
				const keybind = deleteOnUnload(new KeybindItem("fly_mode_move_" + id_suffix, {
					name: "Fly Mode: Move " + id_suffix.charAt(0).toUpperCase() + id_suffix.slice(1),
					icon, category: "navigate", keybind: new Keybind({ key, ctrl: null })}));
				navigation_keybinds.push(keybind);
				return keybind;
			}

			const move_forward  = addKeybindItem("forward",  "arrow_upward",   "W");
			const move_backward = addKeybindItem("backward", "arrow_downward", "S");
			const move_left     = addKeybindItem("left",     "arrow_back",     "A");
			const move_right    = addKeybindItem("right",    "arrow_forward",  "D");
			const move_down     = addKeybindItem("down",     "expand_more",    16 );
			const move_up       = addKeybindItem("up",       "expand_less",    32 );
			const move_faster   = addKeybindItem("faster",   "expand_less",    17 );
			const move_slower   = addKeybindItem("slower",   "expand_less",    18 );

			const addSetting = (id_suffix, name_suffix, description, type, value, min, max) =>
				deleteOnUnload(new Setting("fly_mode_" + id_suffix, {
				name: "Fly Mode: " + name_suffix, description, category: "preview",
				type, value, min, max}));

			const base_speed = addSetting(
				"base_speed", "Base Speed",
				"Movement speed in units per second", "number", 50, 1, 500);
			const move_faster_multiplier = addSetting(
				"move_faster_multiplier", "Move Faster Multiplier",
				"Speed multiplier when holding the Faster key", "number", 2, 1, 10);
			const move_slower_multiplier = addSetting(
				"move_slower_multiplier", "Move Slower Multiplier",
				"Speed multiplier when holding the Slower key", "number", 0.5, 0.1, 1);
			const speed_wheel_step = addSetting(
				"speed_wheel_step", "Speed Wheel Range",
				"Max power-of-2 steps from normal speed (0 = ×1, 4 = ×16)", "number", 4, 1, 6);
			const mouse_horizontal_sensitivity = addSetting(
				"mouse_horizontal_sensitivity", "Mouse Horizontal Sensitivity",
				"Mouse sensitivity for horizontal look rotation", "number", 0.005, 0.001, 0.01);
			const mouse_vertical_sensitivity = addSetting(
				"mouse_vertical_sensitivity", "Mouse Vertical Sensitivity",
				"Mouse sensitivity for vertical look rotation", "number", 0.005, 0.001, 0.01);
			const invert_pitch = addSetting(
				"invert_pitch", "Mouse Invert Vertical Axis",
				"Invert the vertical mouse look direction", "toggle", true);
			const enabled = addSetting(
				"enabled", "Enabled",
				"Enable the Fly Mode navigation toggle in the View menu", "toggle", false);

			const fly_mode_toggle = deleteOnUnload(new Toggle("fly_mode_enabled", {
				name: "Fly Mode", icon: "sports_esports", category: "navigate", value: false,
				linked_setting: enabled.id,
			}));
			MenuBar.menus.view.addAction(fly_mode_toggle);

			const canActivate = () => !is_active && enabled.value && !Preview.selected.isOrtho;

			function activate() {
				activation_timer = null;
				pending_movement_sq = 0;
				if (!canActivate()) return;
				document.body.requestPointerLock().then(() => {
					if (!canActivate()) return;
					is_active = true;
					pressed_keys_codes.clear();
					const controls = Preview.selected.controls;
					controls.enabled = false;
					captured_target_distance = controls.object.position.distanceTo(controls.target);
				});
			}

			function deactivate() {
				if (!is_active) return;
				is_active = false;
				pressed_keys_codes.clear();
				document.exitPointerLock();
				captured_target_distance = 0.0;
				Preview.selected.controls.enabled = true;
			}

			function addDocumentEventListener(type, listener, options) {
				document.addEventListener(type, listener, options);
				disposers.push(() => {document.removeEventListener(type, listener, options)});
				return listener;
			};
			function addBlockbenchListener(type, listener) {
				Blockbench.addListener(type, listener);
				disposers.push(() => {Blockbench.removeListener(type, listener)});
				return listener;
			};

			deleteOnUnload(Blockbench.on("press_key", data => {
				if (!is_active) return;
				if (getFocusedTextInput()) return;
				if (!navigation_keybinds.find(k => k.keybind.key === data.event.keyCode)) return;
				pressed_keys_codes.add(data.event.keyCode);
				data.capture();
			}));
			addDocumentEventListener("keyup", event => pressed_keys_codes.delete(event.keyCode));

			const ACTIVATION_DELAY_MS = 200;
			const ACTIVATION_MOVE_THRESHOLD_SQ = 25;
			let is_right_mouse_button_pressed = false;
			let activation_timer = null;
			let pending_movement_sq = 0;
			function updateRightMouseDown(event) {
				const previous_is_right_mouse_button_pressed = is_right_mouse_button_pressed;
				is_right_mouse_button_pressed = event.buttons & 2;
				if (previous_is_right_mouse_button_pressed === is_right_mouse_button_pressed) return;
				if (is_right_mouse_button_pressed) {
					pending_movement_sq = 0;
					activation_timer = setTimeout(activate, ACTIVATION_DELAY_MS);
				} else {
					if (activation_timer !== null) {
						clearTimeout(activation_timer);
						activation_timer = null;
						pending_movement_sq = 0;
					} else deactivate();
				}
			}

			addDocumentEventListener("mousedown", updateRightMouseDown);
			addDocumentEventListener("mouseup", updateRightMouseDown);
			addDocumentEventListener("mousemove", (event) => {
				if (activation_timer !== null) {
					pending_movement_sq += event.movementX ** 2 + event.movementY ** 2;
					if (pending_movement_sq >= ACTIVATION_MOVE_THRESHOLD_SQ) {
						clearTimeout(activation_timer);
						activate();
					}
				}
				if (!is_active) return;
				const { movementX, movementY } = event;
				const { object, target } = Preview.selected.controls;

				temp_camera_euler.setFromQuaternion(object.quaternion, "YXZ");
				temp_camera_euler.x = Math.clamp(
					temp_camera_euler.x + -movementY * mouse_vertical_sensitivity.value * (invert_pitch.value ? -1.0 : 1.0),
					-MAX_PITCH_ANGLE, MAX_PITCH_ANGLE);
				object.quaternion.setFromEuler(temp_camera_euler);

				object.rotateOnWorldAxis(NormalY, -movementX * mouse_horizontal_sensitivity.value);

				object.getWorldDirection(target)
					.multiplyScalar(captured_target_distance)
					.add(object.position);
			})

			let speed_toast_timer = null;
			addDocumentEventListener("wheel", (event) => {
				if (!is_active) return;
				event.preventDefault();
				const step = event.deltaY > 0 ? -1 : event.deltaY < 0 ? 1 : 0;
				if (step === 0) return;
				speed_iteration = Math.clamp(speed_iteration + step, -speed_wheel_step.value, speed_wheel_step.value);
				runtime_speed_multiplier = Math.pow(2, speed_iteration);
				clearTimeout(speed_toast_timer);
				speed_toast_timer = setTimeout(() => {
					Blockbench.showQuickMessage("Fly speed: ×" + runtime_speed_multiplier.toFixed(1), 500);
				}, 50);
			}, {passive: false});

			addBlockbenchListener("render_frame", () => {
				if (!is_active && !pressed_keys_codes.size) return;
				temp_movement.set(0.0, 0.0, 0.0);
				if (pressed_keys_codes.has(move_forward .keybind.key)) temp_movement.z -= 1;
				if (pressed_keys_codes.has(move_backward.keybind.key)) temp_movement.z += 1;
				if (pressed_keys_codes.has(move_left    .keybind.key)) temp_movement.x -= 1;
				if (pressed_keys_codes.has(move_right   .keybind.key)) temp_movement.x += 1;
				if (pressed_keys_codes.has(move_down    .keybind.key)) temp_movement.y -= 1;
				if (pressed_keys_codes.has(move_up      .keybind.key)) temp_movement.y += 1;
				if (temp_movement.lengthSq() === 0) return;
				temp_movement.normalize();

				const { object, target } = Preview.selected.controls;

				const speed = base_speed.value * 0.01 * runtime_speed_multiplier * (
					pressed_keys_codes.has(move_faster.keybind.key) ?  move_faster_multiplier.value :
					pressed_keys_codes.has(move_slower.keybind.key) ?  move_slower_multiplier.value :
					1.0);
				
				temp_movement.applyEuler(object.rotation).multiplyScalar(speed);

				object.position.add(temp_movement);
				target.add(temp_movement);
			});

			disposers.push(() => { if (is_active) deactivate(); });
			disposers.push(() => clearTimeout(activation_timer));
			disposers.push(() => clearTimeout(speed_toast_timer));
		},
		onunload() {
			for (const disposer of disposers.reverse())
				disposer();
			disposers.length = 0;
		},
	});
})();
