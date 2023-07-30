(function () {

	let format
	let toggleMatchTextureSize = new Toggle('match-texture-size', {
		name: "Match Project UV with Texture Size",
		default: false,
		description: "Changes the ProjectUV so that it will always match the size of the active Texture.",
		condition: () => Format === format && !Project.box_uv,
		onChange(state) {
			if (state)
				updateProjectUV()
		}
	})
	let _width = 0, _height = 0
	function updateProjectUV() {
		if (Project.box_uv) return

		Cube.all.forEach(cube => {
			cube.setUVMode(false);
		})

		let texture = UVEditor.texture != 0 ? UVEditor.texture : Texture.selected
		let texture_width = texture.width,
			texture_height = texture.height
		if (texture != null && (texture_width != _width || texture_height != _height)) {
			Cube.all.forEach(cube => {
				for (var key in cube.faces) {
					var uv = cube.faces[key].uv;
					uv[0] *= texture_width / Project.texture_width;
					uv[2] *= texture_width / Project.texture_width;
					uv[1] *= texture_height / Project.texture_height;
					uv[3] *= texture_height / Project.texture_height;
				}
			})
			Mesh.all.forEach(mesh => {
				for (var key in mesh.faces) {
					var uv = mesh.faces[key].uv;
					for (let vkey in uv) {
						uv[vkey][0] *= texture_width / Project.texture_width;
						uv[vkey][1] *= texture_height / Project.texture_height;
					}
				}
			})

			Project.texture_width = _width = texture_width;
			Project.texture_height = _height = texture_height;
			Canvas.updateAllUVs()
		}
	}

	BBPlugin.register('figura_format', {
		title: 'Figura Model Format',
		author: 'Katt (KitCat962)',
		icon: 'change_history',
		description: "Adds a project format used for the Figura mod that removes features that Figura does not support and makes minor changes to clarify weird Figura behavior.",
		tags: ['Minecraft: Java Edition', 'Figura'],
		version: '0.1.0',
		min_version: '4.7.0',
		variant: 'both',
		await_loading: true,
		onload() {
			let callback
			format = new ModelFormat('figura', {
				icon: 'change_history',
				name: 'Figura',
				description: 'Model for the Figura mod.',
				format_page: {
					content: [
						{
							text:
								`Figura uses Blockbench for it's modeling, but some features of Blockbench will not be parsed by Figura.
						
						This Plugin adds a Project Format that will remove the following features from Blockbench:
						* Animated Textures (Figura parses them as normal textures)
						* Model Identifier (What even is this anyways? Regardless, Figura doesnt use it)
						* Locators (Figura does not load them, and IK is not supported)
						* Group Name Limitations (Duplicate names and arbitrary characters are now allowed)
						* Molang Errors (Figura uses lua, not molang)
						* Texture Render Mode (Figura uses a more advanced system for emissive textures)
						
						The Plugin makes the following changes to improve clarity:
						* Particle and Sound keyframes have been renamed to \`"N/A"\` as they are not used by Figura
						* New Animations will be named \`new\` instead of the confusing name \`animation.model.new\`
						* Instruction keyframes have been renamed to Lua Script keyframes
						* The Anim Time Update property has been renamed to Start Offset, as that is how that property is used in Figura
						* Override has been renamed to Override Vanilla Animations
						* The Export Animations action has been removed
						
						Additionally, the Figura Project Format adds these features:
						* The "Match Project UV with Texture Size" Toggle under Tools, which will automatically set the Project UV to match the current texture to prevent the texture behaving weird in the preview (Not available with BoxUV)
						* The "Cycle Face Vertices action", which will allow you to change the triangulation of non-flat faces (You may need to use this multiple times, and/or invert the face for correct normals)`
									.replace(/\t+/g, '')
						}
					]
				},
				category: 'low_poly',
				target: ['Figura'],
				show_on_start_screen: true,
				box_uv: false,
				optional_box_uv: true,
				single_texture: false,
				model_identifier: false,
				parent_model_id: false,
				vertex_color_ambient_occlusion: false,
				animated_textures: false,
				bone_rig: true,
				centered_grid: true,
				rotate_cubes: true,
				integer_size: false,
				meshes: true,
				texture_meshes: false,
				locators: false,
				rotation_limit: false,
				uv_rotation: true,
				java_face_properties: false,
				select_texture_for_particles: false,
				bone_binding_expression: false,
				animation_files: false,
				texture_folder: false,
				image_editor: false,
				edit_mode: true,
				paint_mode: true,
				display_mode: false,
				animation_mode: true,
				pose_mode: false,
				onActivation() {
					callback = Blockbench.on('update_selection', function (data) {
						if (toggleMatchTextureSize.value)
							updateProjectUV()
					})
					Language.addTranslations('en', {
						['menu.animation.anim_time_update']: "Start Offset",
						['menu.animation.override']: "Override Vanilla Animations",
						['timeline.particle']: "N/A",
						['timeline.sound']: "N/A",
						['timeline.timeline']: "Lua Script",
					})
					for (const [type, data] of Object.entries(EffectAnimator.prototype.channels))
						data.name = tl(`timeline.${type}`)
				},
				onDeactivation() {
					callback.delete()
					Language.addTranslations('en', {
						['menu.animation.anim_time_update']: "Anim Time Update",
						['menu.animation.override']: "Override",
						['timeline.particle']: "Particle",
						['timeline.sound']: "Sound",
						['timeline.timeline']: "Instructions",
					})
					for (const [type, data] of Object.entries(EffectAnimator.prototype.channels))
						data.name = tl(`timeline.${type}`)
				}
			})

			MenuBar.menus.tools.addAction(toggleMatchTextureSize)
			Toolbars.main_tools.add(new Action('cycle_vertex_order', {
				name: 'Cycle Vertex Order',
				icon: 'fa-sync',
				category: 'edit',
				condition: { modes: ['edit'], features: ['meshes'], formats: [format.id], method: () => (Mesh.selected[0] && Mesh.selected[0].getSelectedFaces().length) },
				click() {
					Undo.initEdit({ elements: Mesh.selected });
					Mesh.selected.forEach(mesh => {
						for (let key in mesh.faces) {
							let face = mesh.faces[key];
							if (face.isSelected()) {
								if (face.vertices.length < 3) continue;
								[face.vertices[0], face.vertices[1], face.vertices[2], face.vertices[3]] = [face.vertices[1], face.vertices[2], face.vertices[3], face.vertices[0]];
							}
						}
					})
					Undo.finishEdit('Cycle face vertices');
					Canvas.updateView({ elements: Mesh.selected, element_aspects: { geometry: true, uv: true, faces: true } });
				}
			}))
			let name_regex = Group.prototype.name_regex, needsUniqueName = Group.prototype.needsUniqueName
			Group.prototype.name_regex = () => Format === format ? false : name_regex();
			Group.prototype.needsUniqueName = () => Format === format ? false : needsUniqueName();

			let molangSyntax = Validator.checks.find(element => element.id == 'molang_syntax')
			if (molangSyntax) {
				let method = molangSyntax.condition.method
				molangSyntax.condition.method = (context) => Format === format ? false : (method ? method(context) : false)
			}

			let showMessageBox = Blockbench.showMessageBox
			Blockbench.showMessageBox = function (options, callback) {
				if (Format === format && options.translateKey == "duplicate_groups") return
				showMessageBox.apply(this, [options, callback])
			}

			let addAnimationClick = BarItems['add_animation'].click
			BarItems['add_animation'].click = function () {
				if (Format !== format) addAnimationClick.call(this)
				else
					new Animation({
						name: 'new',
						saved: false
					}).add(true).propertiesDialog()
			}
			BarItems['export_animation_file'].condition = () => Format !== format

			Texture.prototype.menu.structure.find(v => v.name == 'menu.texture.render_mode').condition = () => Format !== format
			let DialogBuild = Dialog.prototype.build
			Dialog.prototype.build = function () {
				if (Format === format && this.id == 'texture_edit') delete this.form.render_mode
				DialogBuild.call(this)
			}
		},
		onunload() {
			MenuBar.menus.tools.removeAction('match-texture-size')
			Toolbars.main_tools.remove('cycle_vertex_order')
			format.delete()
		}
	});

})()