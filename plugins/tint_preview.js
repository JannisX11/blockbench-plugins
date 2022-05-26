/*
	Tint Preview - A Blockbench plugin to preview tint effect on JSON models
	Copyright (C) 2022  MrCrayfish

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
var defaultTintColor = [1.0, 0.705, 0.294];
var dragTintColor = null;
var origMats = [];

function isTintColorArray(obj) {
	return obj && Array.isArray(obj) && obj.length == 3 && obj.every(e => typeof e === 'number');
}

(function() {
	var toggleTintAction;
	var setTintColorAction;
	var patchedCodecs = [];
	var openedDialog;

	/**
	 * Hook to patch textures when added
	 */
	function addTextureEvent(data) {
		if(isTintingFormat(Project.format)) {
			applyTintingShader(Project, data.texture);
		}
	} 

	/**
	 * Refreshes the tint for supported projects after parsing the model data
	 */
	function parsedEvent(data) {
		if(isTintingFormat(Project.format)) {
			updateTint();
		}
	}

	/** 
	 * Adds a parsed event to supported codes to trigger a refresh of the tinted elements.
	 * This is essentially a "completed loading" event, just a strange way to do it.
	 */
	function setupProjectEvent() {
		if(!isTintingFormat(Project.format)) {
			return;
		}
		for(let key in Codecs) {
			let codec = Codecs[key];
			if(codec.format && isTintingFormat(codec.format)) {
				codec.on('parsed', parsedEvent);
				patchedCodecs.safePush(codec);
			}
		}
		// Add to project format since it can be a fallback
		Codecs.project.on('parsed', parsedEvent);
		patchedCodecs.safePush(Codecs.project);
	}

	/**
	 * Hides the color picker dialog when switching projects
	 */
	function unselectProjectEvent(data) {
		if(openedDialog) {
			openedDialog.delete();
		}
	} 

	/**
	 * Causes any changes to face tint toggle to update the tint preview
	 */
	function finishEditEvent(data) {
		if(!isTintingFormat(Project.format)) {
			return;
		}
		let elements = data.aspects.elements;
		if(Undo.current_save.elements && Object.keys(Undo.current_save.elements).length && Array.isArray(elements) && elements.length) {
			let obj = data.aspects.elements[0];
			let oldObj = Undo.current_save.elements[obj.uuid];
			if(!obj.faces || !oldObj.faces)
				return;
			function faceTintChanged(a, b) {
				return a.tint != b.tint;
			}
			for(let f of Canvas.face_order) {
				if(faceTintChanged(obj.faces[f], oldObj.faces[f])) {
					updateTint();
					break;
				}
			}
		}
	}

	/**
	 * Causes undo and redo events related to face tint or deleted 
	 * element to trigger tint update.
	 */
	function undoRedoEvent(data) {
		if(!isTintingFormat(Project.format)) {
			return;
		}

		let beforeElements = data.entry.before.elements;
		if(typeof beforeElements !== 'object' || !beforeElements)
			return;

		let postElements = data.entry.post.elements;
		if(typeof postElements !== 'object' || !postElements)
			return;

		// Causes the tint to update if the undo/redo action was "Toggle face tint".
		if(Object.keys(beforeElements).length == Object.keys(postElements).length) {
			for(let key in beforeElements) {
				let beforeObj = beforeElements[key];
				let postObj = postElements[key];
				function faceTintChanged(a, b) {
					return a.tint != b.tint;
				}
				for(let f of Canvas.face_order) {
					if(faceTintChanged(beforeObj.faces[f], postObj.faces[f])) {
						updateTint();
						return;
					}
				}
			}
		} else if(!Object.keys(postElements).length) { // Elements were deleted
			for(let key in beforeElements) {
				let beforeObj = beforeElements[key];
				for(let f of Canvas.face_order) {
					function hasFaceTint(a) {
						return a.tint != -1;
					}
					if(hasFaceTint(beforeObj.faces[f])) {
						updateTint();
						return;
					}
				}
			}
		}
	}

	/**
	 * Loads the tint colour from the project file
	 */
	function loadProjectEvent(data) {
		if(!isTintingFormat(Project.format)) {
			return;
		}
		let tintColor = data.model.tint_color;
		if(isTintColorArray(tintColor)) {
			ProjectData[Project.uuid].tintColor = tintColor;
		}
	}

	/**
	 * Saves the tint colour to the project file
	 */
	function saveProjectEvent(data) {
		if(!isTintingFormat(Project.format)) {
			return;
		}
		let model = data.model;
		model.tint_color = getTintColor(Project);
	}

	/**
	 * Patches all textures in opened projects that support tinting with custom material. 
	 * Refer to #isTintingFormat(format) for the condition of a project to support tinting.
	 */
	function patchAllTextures() {
		if(!ModelProject.all.length)
			return;
		let count = 0;
		ModelProject.all.forEach(project => {
			if(isTintingFormat(project.format)) {
				let textures = project.textures;
				textures.forEach(texture => {
					applyTintingShader(project, texture);
					count++;
				});
			}
		});
		console.log(`[Tint Preview] Patched ${count} textures`);
	}

	/**
	 * Restores the original materials for all textures in opened projects. Any
	 * reminant materials (from closed projects) will simply be purged.
	 */
	function restoreOriginalMaterials() {
		if(ModelProject.all.length) {
			let count = 0;
			ModelProject.all.forEach(project => {
				if(isTintingFormat(project.format)) {
					let textures = project.textures;
					textures.forEach(texture => {
						let origMat = origMats[texture.uuid];
						if(origMat) {
							project.materials[texture.uuid] = origMat;
							count++;
						}
					});
				}
			});
			console.log(`[Tint Preview] Restored ${count} textures`);
		}
		origMats.purge();
	}

	Plugin.register('tint_preview', {
		title: 'Tint Preview',
		author: 'MrCrayfish',
		description: 'Preview a color on tint enabled faces! (JSON models only)',
		about: `The plugin adds the ability to preview a color on tint enabled cube faces. It adds two new options to the Tools menu that allows you to toggle tinting and change the tint color.
Important: This plugin is designed for JSON models only and will not work for other formats.`,
		tags: ["Minecraft: Java Edition"],
		icon: 'fa-fill',
		version: '1.0.0',
		variant: 'both',
		onload() {
			// Custom translations. Am I doing this right?
			window.Language.addTranslations('en', {
				'dialog.tint_preview.set_tint_color': 'Set Tint Color',
				'panel.color.main_palette': 'Main Palette'
			});

			// Register events
			Blockbench.on('add_texture', addTextureEvent);
			Blockbench.on('unselect_project', unselectProjectEvent);
			Blockbench.on('finish_edit', finishEditEvent);
			Blockbench.on('setup_project', setupProjectEvent);
			Blockbench.on('load_project', loadProjectEvent);
			Blockbench.on('save_project', saveProjectEvent);
			Blockbench.on('undo', undoRedoEvent);
			Blockbench.on('redo', undoRedoEvent);

			// Patches all current textures loaded in valid porjects
			patchAllTextures(); 

			// Setup state memory
			StateMemory.init('tint_color_picker_tab', 'string');
			StateMemory.init('tint_color_wheel', 'boolean');
			StateMemory.init('show_tint', 'boolean');

			toggleTintAction = new Toggle('toggle_tint_preview', {
				name: 'Show Tint Color',
				icon: (StateMemory.show_tint ? 'fa-fill-drip' : 'fa-fill'),
				description: 'Toggles the tint effect for tint enabled faces',
				category: 'tools',
				default: StateMemory.show_tint,
				condition: () => isTintingFormat(Format),
				onChange: (state) => {
					StateMemory.show_tint = state;
					StateMemory.save('show_tint');
					updateTint(true);
				}
			});

			setTintColorAction = new Action({
				id: 'set_tint_color',
				name: 'Set Tint Color',
				icon: 'fa-palette',
				description: 'Toggles the tint effect for tint enabled faces',
				category: 'tools',
				condition: () => isTintingFormat(Format),
				click: () => {
					openedDialog = createTintColorDialog();
					openedDialog.show();
					$('#blackout').hide();
					open_dialog = false; // Hack to allow keybinds to pass through dialog
				}
			});

			// Adds the actions to the tools menu
			MenuBar.addAction(toggleTintAction, 'tools');
			MenuBar.addAction(setTintColorAction, 'tools');
			MenuBar.update();
		},
		onunload() {
			toggleTintAction.delete();
			setTintColorAction.delete();
			if(openedDialog) openedDialog.delete();
			restoreOriginalMaterials();
			Blockbench.removeListener('add_texture', addTextureEvent);
			Blockbench.removeListener('unselect_project', unselectProjectEvent);
			Blockbench.removeListener('finish_edit', finishEditEvent);
			Blockbench.removeListener('setup_project', setupProjectEvent);
			Blockbench.removeListener('load_project', loadProjectEvent);
			Blockbench.removeListener('save_project', saveProjectEvent);
			Blockbench.removeListener('undo', undoRedoEvent);
			Blockbench.removeListener('redo', undoRedoEvent);
			patchedCodecs.forEach(codec => codec.removeListener('parsed', parsedEvent));
		}
	});
})();

function createTintColorDialog(project = Project) {

	// Gets the current tint color for the project
	let rgb = getTintColor(project);
	let tintColor = new tinycolor({
		r: Math.round(Math.clamp(rgb[0] * 255, 0, 255)), 
		g: Math.round(Math.clamp(rgb[1] * 255, 0, 255)),
		b: Math.round(Math.clamp(rgb[2] * 255, 0, 255))
	});

	// Create dialog
	let colorPickerDialog = new Dialog({
		id: 'select_tint_color_dialog',
		title: 'dialog.tint_preview.set_tint_color',
		singleButton: true,
		width: 400,
		darken: false,
		component: {
			data: {
				width: 352,
				open_tab: StateMemory.tint_color_picker_tab || 'picker',
				picker_type: StateMemory.tint_color_wheel ? 'wheel' : 'box',
				picker_toggle_label: tl('panel.color.picker_type'),
				text_input: tintColor.toHexString(),
				tint_color: tintColor.toHexString(),
				hover_color: '',
				get color_code() {
					return this.hover_color || this.tint_color
				},
				set color_code(value) {
					this.tint_color = value.toLowerCase().replace(/[^a-f0-9#]/g, '');
				},
				// Just use the palette/history from main color picker. Maybe in a future update it'll be separate
				palette: Interface.Panels.color.vue._data.palette,
				history: Interface.Panels.color.vue._data.history
			},
			methods: {
				togglePickerType() {
					StateMemory.tint_color_wheel = !StateMemory.tint_color_wheel;
					StateMemory.save('tint_color_wheel');
					this.picker_type = StateMemory.tint_color_wheel ? 'wheel' : 'box';
					Vue.nextTick(() => {
						$('#tint_colorpicker').spectrum('reflow');
					});
				},
				sort(event) {
					var item = this.palette.splice(event.oldIndex, 1)[0];
					this.palette.splice(event.newIndex, 0, item);
				},
				drop(event) {
				},
				setColor(color) {
					colorPickerDialog.set(color, true);
				},
				validateTintColorAndUpdate() {
					var color = this.text_input;
					if (!color.match(/^#[0-9a-f]{6}$/)) {
						this.tint_color = tinycolor(color).toHexString();
					}
					setTintColor(new tinycolor(this.tint_color), true);
				},
				isDarkColor(hex) {
					if (hex) {
						let color_val = new tinycolor(hex).getBrightness();
						let bg_val = new tinycolor(CustomTheme.data.colors.back).getBrightness();
						return Math.abs(color_val - bg_val) <= 50;
					}
				},
				onWheelColorChange(value) {
					let color = new tinycolor(value);
					this.tint_color = color.toHexString();
					dragTintColor = convertTintToRgbArray(color);
					updateTint();
				},
				tl
			},
			watch: {
				tint_color: function(value) {
					this.hover_color = '';
					$('#tint_colorpicker').spectrum('set', value);
					this.text_input = value;
				},
				open_tab(tab) {
					StateMemory.tint_color_picker_tab = tab;
					StateMemory.save('tint_color_picker_tab');
					Vue.nextTick(() => {
						$('#tint_colorpicker').spectrum('reflow');
					});
				}
			},
			template: `
				<div id="tint_color_panel_wrapper" class="panel_inside">
					<div id="color_panel_head">
						<div class="main" v-bind:style="{'background-color': hover_color || tint_color}"></div>
						<div class="side">
							<input type="text" v-model="color_code" @focusout="validateTintColorAndUpdate()">
							<div id="color_history">
								<li
									v-for="(color, i) in history" v-if="i || color != tint_color"
									:key="color"
									v-bind:style="{'background-color': color}"
									v-bind:title="color" @click="setColor(color)"
								></li>
							</div>
						</div>
					</div>

					<div class="bar tabs_small">

						<input type="radio" name="tab" id="radio_tint_color_picker" value="picker" v-model="open_tab">
						<label for="radio_tint_color_picker">${tl('panel.color.picker')}</label>

						<input type="radio" name="tab" id="radio_tint_color_palette" value="palette" v-model="open_tab">
						<label for="radio_tint_color_palette">${tl('panel.color.main_palette')}</label>

						<input type="radio" name="tab" id="radio_tint_color_both" value="both" v-model="open_tab">
						<label for="radio_tint_color_both">${tl('panel.color.both')}</label>

						<div class="tool" @click="togglePickerType()" :title="picker_toggle_label">
							<i class="fa_big icon" :class="picker_type == 'box' ? 'fas fa-square' : 'far fa-stop-circle'"></i>
						</div>

					</div>
					<div v-show="open_tab == 'picker' || open_tab == 'both'">
						<div v-show="picker_type == 'box'" ref="square_picker" :width="width">
							<input id="tint_colorpicker">
						</div>
						<color-wheel ref="color_wheel" v-if="picker_type == 'wheel' && width" v-model="tint_color" :width="width" :height="width" v-on:color-change="onWheelColorChange($event)"></color-wheel>
					</div>
					<div v-show="open_tab == 'palette' || open_tab == 'both'">
						<div class="toolbar_wrapper palette" toolbar="palette"></div>
						<ul id="palette_list" class="list" v-sortable="{onUpdate: sort, onEnd: drop, fallbackTolerance: 10}" @contextmenu="ColorPanel.menu.open($event)">
							<li
								class="color" v-for="color in palette"
								:title="color" :key="color"
								:class="{selected: color == tint_color, contrast: isDarkColor(color)}"
								@click="setColor(color)"
								@mouseenter="hover_color = color"
								@mouseleave="hover_color = ''"
							>
								<div class="color_inner" v-bind:style="{'background-color': color}"></div>
							</li>
						</ul>
					</div>
				</div>
			`,
			mounted() {
				// Initialize spectrum and add dragstop event
				let colorPicker = $(this.$el).find('#tint_colorpicker').spectrum({
					preferredFormat: "hex",
					flat: true,
					color: tintColor,
					move: function(color) {
						colorPickerDialog.set(color);
						dragTintColor = convertTintToRgbArray(color);
						updateTint();
					}
				});
				$(colorPicker).on("dragstop.spectrum", function(e, color) {
					colorPickerDialog.set(color);
					dragTintColor = null;
					setTintColor(color, true);
				});

				// Adds a mouse up listener to the color wheel
				let scope = this;
				function colorWheelMouseUp(event) {
					document.removeEventListener('mouseup', colorWheelMouseUp);
					let color = new tinycolor(scope.$refs.color_wheel.color);
					colorPickerDialog.set(color);
					dragTintColor = null;
					setTintColor(color, true);
				}
				$(this.$el).find('#color-wheel').on('mousedown', function(event) {
					document.addEventListener('mouseup', colorWheelMouseUp);
				});

				// Fixes an issue on first load where the marker is in the wrong position
				Vue.nextTick(() => {
					$(colorPicker).spectrum('reflow');
				});
			}
		}
	});
	colorPickerDialog.set = function(color) {
		var value = new tinycolor(color);
		colorPickerDialog.content_vue._data.tint_color = value.toHexString();
	}
	colorPickerDialog.get = function() {
		return colorPickerDialog.content_vue._data.tint_color;
	}
	return colorPickerDialog;
}

/* Converts tinycolor to rgb array in the range of [0, 1]*/
function convertTintToRgbArray(color) {
	let rgb = color.toRgb();
	let r = Math.clamp(rgb.r / 255.0, 0.0, 1.0);
	let g = Math.clamp(rgb.g / 255.0, 0.0, 1.0);
	let b = Math.clamp(rgb.b / 255.0, 0.0, 1.0);
	return [r, g, b];
}

// Accepts a tinycolor
function setTintColor(color, save = false) {
	let rgb = convertTintToRgbArray(color);
	ProjectData[Project.uuid].tintColor = rgb;
	if(save) Project.saved = false;
	updateTint();
}

/**
 * Gets the tint color for the given project. This returns an array in
 * in the format of [r, g, b]. If no project is specified, the current is used.
 */
function getTintColor(project = Project) {
	if(dragTintColor && isTintColorArray(dragTintColor)) {
		return dragTintColor;
	}
	let tintColor = ProjectData[project.uuid].tintColor;
	if(!isTintColorArray(tintColor)) {
		ProjectData[project.uuid].tintColor = defaultTintColor;
		tintColor = defaultTintColor;
	}
	return tintColor;
}

/**
 * Updates the color atrribute on the cube geometry. Faces that that have tint
 * enabled will recieve the tint color while other faces will just recieve a
 * white tint.
 */
function updateTint(force = false) {
	if(!StateMemory.show_tint && !force)
		return;
	Outliner.elements.forEach(obj => {
		const geometry = obj.mesh.geometry;
		const positionAttribute = geometry.getAttribute('position');
		const colors = new Array(positionAttribute.count * 3);
		colors.fill(1); // Fill with white
		function setFaceTintColor(face, rgb) {
			let index = Canvas.face_order.indexOf(face);
			if(index == -1) return;
			let startIndex = index * 12;
			for(let i = 0; i < 12; i++) {
	            colors[startIndex + i] = rgb[i % 3];
		    }
		}
		let tintColor = getTintColor();
		for(let key in obj.faces) {
			let face = obj.faces[key];
			if(face.tint != -1 && StateMemory.show_tint) {
				setFaceTintColor(face.direction, tintColor);
			} else {
				setFaceTintColor(face.direction, [1.0, 1.0, 1.0]);
			}
		}
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
	});
}

/**
 * Patches the texture in the given project with a custom material. The shader
 * has been based on the original texture shader, just with the inclusion to 
 * apply a vertex color. The tint calculation is the same as Minecraft, that being
 * "texture * tint".
 */
function applyTintingShader(project, texture) {
	var originalMat = project.materials[texture.uuid];
	var vertShader = `
		attribute float highlight;

		uniform bool SHADE;

		varying vec3 vColor;
		varying vec2 vUv;
		varying float light;
		varying float lift;

		float AMBIENT = 0.5;
		float XFAC = -0.15;
		float ZFAC = 0.05;

		void main() {
			if (SHADE) {
				vec3 N = normalize( vec3( modelMatrix * vec4(normal, 0.0) ) );
				float yLight = (1.0+N.y) * 0.5;
				light = yLight * (1.0-AMBIENT) + N.x*N.x * XFAC + N.z*N.z * ZFAC + AMBIENT;
			} else {
				light = 1.0;
			}
			if (highlight == 2.0) {
				lift = 0.22;
			} else if (highlight == 1.0) {
				lift = 0.1;
			} else {
				lift = 0.0;
			}
			vColor = color;
			vUv = uv;
			vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
			gl_Position = projectionMatrix * mvPosition;
		}`
	var fragShader = `
		#ifdef GL_ES
		precision ${isApp ? 'highp' : 'mediump'} float;
		#endif

		uniform sampler2D map;

		uniform bool SHADE;
		uniform bool EMISSIVE;
		uniform float BRIGHTNESS;

		varying vec3 vColor;
		varying vec2 vUv;
		varying float light;
		varying float lift;

		void main(void) {
			
			vec4 color = texture2D(map, vUv);
			if (color.a < 0.01) 
				discard;
			if (EMISSIVE == false) {
				color = vec4(lift + color.rgb * light * BRIGHTNESS, color.a);
			} else {
				float light2 = (light * BRIGHTNESS) + (1.0 - light * BRIGHTNESS) * (1.0 - color.a);
				color = vec4(lift + color.rgb * light2, 1.0);
			}
			if (lift > 0.2) {
				color.r = color.r * 0.6;
				color.g = color.g * 0.7;
			}
			vec4 tint = vec4(vColor.rgb, 1.0);
			gl_FragColor = color * tint;
		}`
	var mat = new THREE.ShaderMaterial({
		uniforms: {
			map: {type: 't', value: originalMat.map},
			SHADE: {type: 'bool', value: settings.shading.value},
			BRIGHTNESS: {type: 'bool', value: settings.brightness.value / 50},
			EMISSIVE: {type: 'bool', value: texture.render_mode == 'emissive'}
		},
		vertexShader: vertShader,
		fragmentShader: fragShader,
		side: Canvas.getRenderSide(),
		vertexColors: true,
		transparent: true,
	});
	mat.map = originalMat.map;
	mat.name = texture.name;
	project.materials[texture.uuid] = mat;

	// Store the original mat for restoring
	origMats[texture.uuid] = originalMat;
}

/**
 * Checks if the format supports tinting. Support for other formats can be added by
 * adding "allowTinting = true" onto the format instance on creation.
 */
function isTintingFormat(format) {
	return format.id == 'java_block' || format.allowTinting;
}