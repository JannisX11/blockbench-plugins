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
		title: "Figura Model Format",
		author: "Katt (KitCat962)",
		icon: "icon.svg",
		description: "Create models for the Figura mod without unusable Blockbench features getting in the way.",
		tags: ["Minecraft: Java Edition", "Figura"],
		version: "0.1.1",
		min_version: "4.8.0",
		variant: "both",
		await_loading: true,
		creation_date: "2023-07-22",
		onload() {
			let callback
			let particle = EffectAnimator.prototype.channels.particle, sound = EffectAnimator.prototype.channels.sound
			format = new ModelFormat('figura', {
				icon: 'change_history',
				name: 'Figura Model',
				description: 'Model for the Figura mod.',
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
					})
					delete EffectAnimator.prototype.channels.particle
					delete EffectAnimator.prototype.channels.sound
					EffectAnimator.prototype.channels.timeline.name = "Lua Script"
				},
				onDeactivation() {
					callback.delete()
					Language.addTranslations('en', {
						['menu.animation.anim_time_update']: "Anim Time Update",
						['menu.animation.override']: "Override",
					})
					EffectAnimator.prototype.channels.particle = particle
					EffectAnimator.prototype.channels.sound = sound
					EffectAnimator.prototype.channels.timeline.name = tl('timeline.timeline')
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

			let displayFrame = EffectAnimator.prototype.displayFrame
			EffectAnimator.prototype.displayFrame = function(){
				if (Format === format) return
				displayFrame.call(this)
			}
		},
		onunload() {
			MenuBar.menus.tools.removeAction('match-texture-size')
			Toolbars.main_tools.remove('cycle_vertex_order')
			format.delete()
		}
	});

})()