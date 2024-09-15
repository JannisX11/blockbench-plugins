(function() {

let cubeSample = undefined;
let cubeSample_normals = {};
const faceNormals = {
    north: { x: 0, y: 0, z: -1 },
    south: { x: 0, y: 0, z: 1 },
    west: { x: -1, y: 0, z: 0 },
    east: { x: 1, y: 0, z: 0 },
    up: { x: 0, y: 1, z: 0 },
    down: { x: 0, y: -1, z: 0 }
};

let old_animate;

let just_enabled = false;

BBPlugin.register('creative_mode', {
    title: 'Creative Mode',
    author: 'Caio Raphael',
    icon: 'icon.png',
    description: 'Place and remove cubes just like in Minecraft creative mode',
    version: '1.0.0',
    min_version: '4.8.0',
	variant: 'both',
    onload() {
        let canvas = document.querySelector('canvas');

        // SETTINGS
        new Setting('creative_mode_camera_sensitivity', {
			name: 'Creative Mode: Camera Sensitivity',
			description: '-', 
			category: 'preview',
			type: 'number',
			value: 1,
			max: 5.0,
			min: 0.1
		});
        new Setting('creative_mode_base_speed', {
			name: 'Creative Mode: Base Speed',
			description: '-', 
			category: 'preview',
			type: 'number',
			value: 50,
			min: 1
		});
		new Setting('creative_mode_move_faster_mult', {
			name: 'Creative Mode: Move Faster Multiplier',
			description: '-', 
			category: 'preview',
			type: 'number',
			value: 2.5,
			max: 10,
			min: 1
		});
		new Setting('creative_mode_move_slower_mult', {
			name: 'Creative Mode: Move Slower Multiplier',
			description: '-', 
			category: 'preview',
			type: 'number',
			value: 0.5,
			max: 1,
			min: 0.1
		});
        new Setting('creative_mode_wasd_y_level', {
			name: 'Creative Mode: Navigate at Y Level',
			description: 'Navigate using WASD at consistent Y level rather than on camera plane',
			category: 'preview',
			value: true
		});


        // FUNCTIONS: Behavior
        function manageActions(event) {   
            let intersection = Canvas.raycast(event);

            if (intersection && intersection.element instanceof Mesh) {
                if (event.button === 0 || event.button == 2) {
                    Blockbench.showQuickMessage('Meshes are not supported.', 2000);
                }
                return;
            }

            if (intersection && intersection.element instanceof Cube) {
                // Delete 
                if (event.button === 0) {
                    let cube = intersection.element;
                    removeCube(cube);
                    return;
                }
                if (cubeSample) {
                    // Add
                    if (event.button === 2) {
                        if (intersection && intersection.element instanceof Cube) {
                            let cube = intersection.element;
                            let clicked_face = intersection.face;
                            const cube_normals = {
                                north: getRotatedVector(faceNormals['north'], cube.rotation),
                                up: getRotatedVector(faceNormals['up'], cube.rotation),
                                east: getRotatedVector(faceNormals['east'], cube.rotation),
                                south: getRotatedVector(faceNormals['south'], cube.rotation),
                                west: getRotatedVector(faceNormals['west'], cube.rotation),
                                down: getRotatedVector(faceNormals['down'], cube.rotation)
                            };
                            let face_normal = cube_normals[clicked_face];
                            placeAdjacentCube(cube, face_normal);
                            return;
                        }
                    } else {
                        return;
                    }
                } else {
                    Blockbench.showQuickMessage('Cube Sample not selected.', 2000);
                    return;
                }
            }
        }
        function placeAdjacentCube(cubeTarget, face_normal) {
            Undo.initEdit({outliner: true, elements: []});

            // 'cubeSample' and 'cubeTarget' transforms.
            apply_origin_to_geometry(cubeSample);
            apply_origin_to_geometry(cubeTarget);

            // Location spawn for the 'newCube'.
            let size_cubeSample = cubeSample.size();
            let size_cubeTarget = cubeTarget.size();
            
            let from_newCube_location = [...cubeTarget.from];
            let to_newCube_location = [
                from_newCube_location[0] + size_cubeSample[0],
                from_newCube_location[1] + size_cubeSample[1],
                from_newCube_location[2] + size_cubeSample[2]
            ];

            // >>>> Testes para fix do bug 'scale + rotation'.
            let size_cubeTarget_converted = {
                x: size_cubeTarget[0],
                y: size_cubeTarget[1],
                z: size_cubeTarget[2],
            };
            let rotated_size_cubeTarget = getRotatedVector(size_cubeTarget_converted, cubeTarget.rotation);
            // let translation = [
            //     face_normal.x * rotated_size_cubeTarget.x,
            //     face_normal.y * rotated_size_cubeTarget.y,
            //     face_normal.z * rotated_size_cubeTarget.z
            // ];
            // <<<<

            let translation = [
                face_normal.x * size_cubeTarget[0],
                face_normal.y * size_cubeTarget[1],
                face_normal.z * size_cubeTarget[2],
            ];

            let newCube = cubeSample.duplicate();

            // 'newCube' transforms.
            let old_newCube_rotation = newCube.rotation;
            newCube.rotation = [0,0,0];
            newCube.from = [
                from_newCube_location[0] + translation[0],
                from_newCube_location[1] + translation[1],
                from_newCube_location[2] + translation[2]
            ];
            newCube.to = [
                to_newCube_location[0] + translation[0],
                to_newCube_location[1] + translation[1],
                to_newCube_location[2] + translation[2]
            ];
            move_pivot_to_geometry(newCube);
            newCube.rotation = old_newCube_rotation;
            
            // Finish.
            Cube.all.push(newCube);
            Undo.finishEdit('Add cube', {outliner: true, elements: [newCube]});
            Canvas.updateAll();

        }
        function removeCube(cube) {
            Undo.initEdit({outliner: true, elements: [cube]});
            cube.remove();
            // Atualizar somehow no outliner. Tive bugs ao apagar o objeto selecionado.
            if (cube === cubeSample) {
                cubeSample = undefined;
                cubeSample_normals = [];
            }
            Undo.finishEdit('Remove cube', {outliner: true, elements: []});
        }
        function isCreativeModeEnabled() {
			// return Preview.selected && BarItems.creative_tool && BarItems.creative_tool.value;
            return Preview.selected && (BarItems.creative_tool === BarItems[Toolbox.selected.id]);
		}
        function setupWASDMovement(preview, length = 1) {
			let pos = new THREE.Vector3().copy(preview.camera.position);
			pos.add(preview.camera.getWorldDirection(new THREE.Vector3()).normalize().multiplyScalar(length));
			preview.controls.target.copy(pos);
		}
        function move_camera(event) {
			let movementX = event.movementX || 0;
			let movementY = event.movementY || 0;

			// Rotate the camera
			Preview.selected.controls.rotateLeft(movementX * 0.004 * settings.creative_mode_camera_sensitivity.value);
			Preview.selected.controls.rotateUp(movementY * 0.004 * settings.creative_mode_camera_sensitivity.value);
		}
        function helper_hide_context_menu() {
			// Event trigger to hide the context_menu.
			let rect = canvas.getBoundingClientRect();
			let centerX = rect.left + window.innerWidth / 2;
			let centerY = rect.top + window.innerHeight / 2;
			let mousedown_event = new MouseEvent('mousedown', {
				bubbles: true,
				cancelable: true,
				view: window,
				clientX: centerX,
				clientY: centerY,
				button: 1
			});
			let mouseup_event = new MouseEvent('mouseup', {
				bubbles: true,
				cancelable: true,
				view: window,
				clientX: centerX,
				clientY: centerY,
				button: 1
			});
			mousedown_event.selection_helper = true;
			mouseup_event.selection_helper = true;
			canvas.dispatchEvent(mousedown_event);
			canvas.dispatchEvent(mouseup_event);
		}
        function click_on_center(b) {
            // Event trigger to hide the context_menu.
			let rect = canvas.getBoundingClientRect();
			let centerX = window.innerWidth / 2;
			let centerY = window.innerHeight / 2;
			let mousedown_event = new MouseEvent('mousedown', {
				bubbles: true,
				cancelable: true,
				view: window,
				clientX: centerX,
				clientY: centerY,
				button: b
			});
			let mouseup_event = new MouseEvent('mouseup', {
				bubbles: true,
				cancelable: true,
				view: window,
				clientX: centerX,
				clientY: centerY,
				button: b
			});
			mousedown_event.click_on_center = true;
			mouseup_event.click_on_center = true;
			canvas.dispatchEvent(mousedown_event);
			canvas.dispatchEvent(mouseup_event);
        }

        // FUNCTIONS: Geometry
        function getRotatedVector(vector, rotation) {
            let radX = rotation[0] * Math.PI / 180;
            let radY = rotation[1] * Math.PI / 180;
            let radZ = rotation[2] * Math.PI / 180;

            let cosX = Math.cos(radX);
            let sinX = Math.sin(radX);
            let cosY = Math.cos(radY);
            let sinY = Math.sin(radY);
            let cosZ = Math.cos(radZ);
            let sinZ = Math.sin(radZ);

            let rotatedNormal = {...vector};
            // Apply rotation around X axis
            let tempY = rotatedNormal.y;
            rotatedNormal.y = tempY * cosX - rotatedNormal.z * sinX;
            rotatedNormal.z = tempY * sinX + rotatedNormal.z * cosX;
            // Apply rotation around Y axis
            let tempZ = rotatedNormal.z;
            rotatedNormal.z = tempZ * cosY - rotatedNormal.x * sinY;
            rotatedNormal.x = tempZ * sinY + rotatedNormal.x * cosY;
            // Apply rotation around Z axis
            let tempX = rotatedNormal.x;
            rotatedNormal.x = tempX * cosZ - rotatedNormal.y * sinZ;
            rotatedNormal.y = tempX * sinZ + rotatedNormal.y * cosZ;

            return rotatedNormal;
        }
        function getCubeGhostCenter(cube) {
            let max = [-Infinity, -Infinity, -Infinity];
            let min = [ Infinity,  Infinity,  Infinity];

            if (cube.getWorldCenter) {
                var pos = cube.getWorldCenter();
                min[0] = Math.min(pos.x, min[0]);	max[0] = Math.max(pos.x, max[0]);
                min[1] = Math.min(pos.y, min[1]);	max[1] = Math.max(pos.y, max[1]);
                min[2] = Math.min(pos.z, min[2]);	max[2] = Math.max(pos.z, max[2]);
            }
            let center = (min[0] == Infinity) ? [0, 0, 0] : max.V3_add(min).V3_divide(2);
            
            if (!Format.centered_grid) {
                center.V3_add(8, 8, 8);
            }
            return center;
        }
        function apply_origin_to_geometry(cube) {
            var center = getCubeGhostCenter(cube);
            if (!cube.transferOrigin) return;
            cube.transferOrigin(center);
        }
        function getCubeCenter(cube) {
            return [
                cube.from[0] + cube.size(0)/2,
                cube.from[1] + cube.size(1)/2,
                cube.from[2] + cube.size(2)/2
            ]
        }
        function move_pivot_to_geometry(cube) {
            cube.origin = getCubeCenter(cube);
        }

        // FUNCTIONS: Draw
        const crosshair_size = 10;
        const crosshair_linewidth = 2;
        const crosshair_color = 'white';

        const custom_canvas = document.createElement('canvas');
        custom_canvas.width = window.innerWidth;
        custom_canvas.height = window.innerHeight;
        custom_canvas.style.position = 'absolute';
        custom_canvas.style.top = '0';
        custom_canvas.style.left = '0';
        custom_canvas.style.pointerEvents = 'none'; // Ensure the canvas doesn't block interactions
        custom_canvas.style.zIndex = '9999';
        document.body.appendChild(custom_canvas);
        const ctx = custom_canvas.getContext('2d');
        function drawCrosshair() {
            const centerX = custom_canvas.width / 2;
            const centerY = custom_canvas.height / 2;
            clearDrawing();
            ctx.beginPath();
            ctx.moveTo(centerX - crosshair_size, centerY);
            ctx.lineTo(centerX + crosshair_size, centerY);
            ctx.moveTo(centerX, centerY - crosshair_size);
            ctx.lineTo(centerX, centerY + crosshair_size);
            ctx.strokeStyle = crosshair_color;
            ctx.lineWidth = crosshair_linewidth;
            ctx.stroke();
        }
        function clearDrawing() {
            ctx.clearRect(0, 0, custom_canvas.width, custom_canvas.height); // Clear the custom_canvas
        }
        // Adjust the custom_canvas size when the window is resized
        window.addEventListener('resize', () => {
            custom_canvas.width = window.innerWidth;
            custom_canvas.height = window.innerHeight;
            if (isCreativeModeEnabled()) {
                drawCrosshair();
            }
        });


        // INPUT: Keybinds
        let navigate_forward = new KeybindItem('creative_mode_navigate_forward', {
			name: 'Creative Mode: Move Forward',
			icon: 'arrow_upward',
			category: 'navigate',
			keybind: new Keybind({key: 'w', ctrl: null})
		});
		let navigate_backward = new KeybindItem('creative_mode_navigate_backward', {
			name: 'Creative Mode: Move Backward',
			icon: 'arrow_downward',
			category: 'navigate',
			keybind: new Keybind({key: 's', ctrl: null})
		});
		let navigate_left = new KeybindItem('creative_mode_navigate_left', {
			name: 'Creative Mode: Move Left',
			icon: 'arrow_back',
			category: 'navigate',
			keybind: new Keybind({key: 'a', ctrl: null})
		});
		let navigate_right = new KeybindItem('creative_mode_navigate_right', {
			name: 'Creative Mode: Move Right',
			icon: 'arrow_forward',
			category: 'navigate',
			keybind: new Keybind({key: 'd', ctrl: null})
		});
		let navigate_down = new KeybindItem('creative_mode_navigate_down', {
			name: 'Creative Mode: Move Down',
			icon: 'expand_more',
			category: 'navigate',
			keybind: new Keybind({key: 'q', ctrl: null})
		});
		let navigate_up = new KeybindItem('creative_mode_navigate_up', {
			name: 'Creative Mode: Move Up',
			icon: 'expand_less',
			category: 'navigate',
			keybind: new Keybind({key: 'e', ctrl: null})
		});
		let navigate_faster = new KeybindItem('creative_mode_navigate_faster', {
			name: 'Creative Mode: Move Faster',
			icon: 'expand_less',
			category: 'navigate',
			keybind: new Keybind({key: 16, ctrl: null})
		});
		let navigate_slower = new KeybindItem('creative_mode_navigate_slower', {
			name: 'Creative Mode: Move Slower',
			icon: 'expand_less',
			category: 'navigate',
			keybind: new Keybind({key: 18, ctrl: null})
		});
        let plugin_keybinds = [navigate_forward, navigate_backward, navigate_left, navigate_right, navigate_down, navigate_up, navigate_faster, navigate_slower];


        // INPUT: Check
        let pressed_keys = [];
        Blockbench.on('press_key', data => {
			let key = data.event.which;
			if (plugin_keybinds.find(k => k.keybind.key == key) && !getFocusedTextInput()) {
				pressed_keys.safePush(key);
				if (isCreativeModeEnabled()) {
					data.capture();
				}
			}
		});
        document.addEventListener('keydown', event => {
            if (isCreativeModeEnabled()) {
                if (!just_enabled) {
                    if (event.keyCode == creativeToolAction.keybind.key || event.key === 'Escape') {
                        BarItems['move_tool'].select();
                    }
                }
                just_enabled = false;
            }
		});
        document.addEventListener('keyup', event => {
			pressed_keys.remove(event.which);
		});
        document.addEventListener('mousedown', event => {
            if (isCreativeModeEnabled()) {
                if (event.click_on_center) {
                    manageActions(event);
                } else {
                    if (event.button == 0) {
                        event.preventDefault();
                        click_on_center(0);
                    }
                    if (event.button == 2) {
                        event.preventDefault();
                        click_on_center(2);
                    }
                }
            }
        });
        document.addEventListener('mouseup', function(event) {
            if (isCreativeModeEnabled()) {
                if (event.click_on_center) {
                }
                if (event.button === 2) {
                    event.preventDefault();  // I'm not sure about this.
                    helper_hide_context_menu();
                }
                unselectAllElements();
                if (cubeSample) cubeSample.select();
            }
		});
        document.addEventListener('mousemove', function(event) {
			if (isCreativeModeEnabled()) {
				move_camera(event);
			}
		});


        // TOOLS
        let creativeToolAction = new Tool('creative_tool', {
            name: 'Creative Tool',
            icon: 'fa-cube',
            category: 'tools',
            keybind: new Keybind({key: 't'}),
            modes: ['edit'],
            condition: {modes: ['edit']},
            onSelect: function() {
                drawCrosshair();
                setupWASDMovement(Preview.selected, 1);
                Preview.all.forEach(preview => {
                    preview.controls.enableZoom = false;
                });
                canvas.requestPointerLock();
                cubeSample = Cube.selected[0];
                if (cubeSample) {
                    cubeSample.select();
                    cubeSample_normals = {
                        north: getRotatedVector(faceNormals['north'], cubeSample.rotation),
                        up: getRotatedVector(faceNormals['up'], cubeSample.rotation),
                        east: getRotatedVector(faceNormals['east'], cubeSample.rotation),
                        south: getRotatedVector(faceNormals['south'], cubeSample.rotation),
                        west: getRotatedVector(faceNormals['west'], cubeSample.rotation),
                        down: getRotatedVector(faceNormals['down'], cubeSample.rotation)
                    };
                }
                just_enabled = true;
            },
            onUnselect: function() {
                clearDrawing();
                setupWASDMovement(Preview.selected, 16);
                Preview.all.forEach(preview => {
                    preview.controls.enableZoom = true;
                });
                document.exitPointerLock();
                cubeSample = undefined;
                cubeSample_normals = [];
            }
        });       
        MenuBar.addAction(creativeToolAction, 'tools');


        // PROCESS
		function doWASDMovement() {
			let movement = new THREE.Vector3(0, 0, 0);

			let uses_wasd_movement = false;
			function add(x, y, z) {
				movement.x += x;
				movement.y += y;
				movement.z += z;
				uses_wasd_movement = true;
			}
			if (pressed_keys.includes(navigate_forward.keybind.key)) add(0, 0, -1);
			if (pressed_keys.includes(navigate_backward.keybind.key)) add(0, 0, 1);
			if (pressed_keys.includes(navigate_left.keybind.key)) add(-1, 0, 0);
			if (pressed_keys.includes(navigate_right.keybind.key)) add(1, 0, 0);
			if (pressed_keys.includes(navigate_down.keybind.key)) add(0, -1, 0);
			if (pressed_keys.includes(navigate_up.keybind.key)) add(0, 1, 0);
			
			
			if (uses_wasd_movement) {
				setupWASDMovement(Preview.selected);
				
				let speedMultiplier = 1.0;
				if (pressed_keys.includes(navigate_faster.keybind.key)) speedMultiplier *= settings.creative_mode_move_faster_mult.value;
				else if (pressed_keys.includes(navigate_slower.keybind.key)) speedMultiplier *= settings.creative_mode_move_slower_mult.value;

				if (settings.creative_mode_wasd_y_level.value) {
					let vec = Preview.selected.controls.object.getWorldDirection(new THREE.Vector3()).normalize();
					let angle = Math.atan2(-vec.x, -vec.z);
					movement.applyAxisAngle(THREE.NormalY, angle);
				} else {
					movement.applyEuler(Preview.selected.controls.object.rotation);
				}

				movement.multiplyScalar(Settings.get('creative_mode_base_speed') * speedMultiplier / 100);
				Preview.selected.camera.position.add(movement);
				Preview.selected.controls.target.add(movement);
			}
		}
		old_animate = window.animate;
		window.animate = function(...args) {
			old_animate(...args);

			if (isCreativeModeEnabled() && pressed_keys.length) {
				doWASDMovement();
			}
		};

    },
    onunload() {
        MenuBar.removeAction('creative_tool');
    }

});
})();
