(function () {
	const Path = require('path')
	const toDelete = []

	function isValidLuaIdentifier(str) {
		const keywords = [
			"and",
			"break",
			"do",
			"else",
			"elseif",
			"end",
			"false",
			"for",
			"function",
			"if",
			"in",
			"local",
			"nil",
			"not",
			"or",
			"repeat",
			"return",
			"then",
			"true",
			"until",
			"while",
		]
		return (
			typeof str == "string"
			&& str.search(/^[a-zA-Z0-9_]+$/) !== -1
			&& str.search(/^[0-9]/) === -1
			&& !keywords.includes(str)
		)
	}
	function getValidLuaIndex(str) {
		return isValidLuaIdentifier(str) ? `.${str}` : `["${str}"]`
	}

	// Stolen from line 92 of timeline_animators.js
	function getOrMakeKeyframe(animator, channel, time, snapping = 24) {
		let before;
		let epsilon = (1 / Math.clamp(snapping, 1, 120)) / 2 || 0.01;

		for (let kf of animator[channel]) {
			if (Math.abs(kf.time - time) <= epsilon) {
				before = kf;
			}
		}
		return before ? before : animator.createKeyframe(null, time, channel, false, false);
	}

	BBPlugin.register('figura_format', {
		title: "Figura Model Format",
		author: "Katt (KitCat962)",
		icon: "icon.svg",
		description: "Create models for the Figura mod in a custom format that optimizes Blockbench to work with Figura models.",
		tags: ["Minecraft: Java Edition", "Figura"],
		version: "0.1.3",
		min_version: "4.8.0",
		variant: "both",
		await_loading: true,
		creation_date: "2023-07-22",
		onload() {
			const particle = EffectAnimator.prototype.channels.particle, sound = EffectAnimator.prototype.channels.sound
			const format = new ModelFormat('figura', {
				icon: 'change_history',
				name: 'Figura Model',
				description: 'Model for the Figura mod.',
				category: 'low_poly',
				target: ['Figura'],
				show_on_start_screen: true,
				box_uv: false,
				optional_box_uv: true,
				single_texture: false,
				per_texture_uv_size: true,
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
				locators: true,
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
					Language.addTranslations('en', {
						['menu.animation.anim_time_update']: "Start Offset",
						['menu.animation.override']: "Override Vanilla Animations",
					})
					delete EffectAnimator.prototype.channels.particle
					delete EffectAnimator.prototype.channels.sound
					EffectAnimator.prototype.channels.timeline.name = "Instruction (Lua Script)"
				},
				onDeactivation() {
					Language.addTranslations('en', {
						['menu.animation.anim_time_update']: "Anim Time Update",
						['menu.animation.override']: "Override",
					})
					EffectAnimator.prototype.channels.particle = particle
					EffectAnimator.prototype.channels.sound = sound
					EffectAnimator.prototype.channels.timeline.name = tl('timeline.timeline')
				},
			})

			toDelete.push(format)

			const copyPathModelPart = new Action('figura_copy_path_modelpart', {
				name: "Copy ModelPart Path",
				description: "Calculates the scripting path to this ModelPart and copies it to the clipboard.",
				icon: "fa-clipboard",
				condition: () => Format === format && (Group.selected != null || Outliner.selected.length === 1),
				click() {
					let path = []
					let element = Group.selected || Outliner.selected[0]
					while (element !== "root") {
						path.unshift(element.name)
						element = element.parent;
					}
					path.unshift(Project.name || "modelName")
					path = path.map(getValidLuaIndex)
					path.unshift('models')
					navigator.clipboard.writeText(path.join(""))
				}
			})
			const copyPathAnimation = new Action('figura_copy_path_animation', {
				name: "Copy Animation Path",
				description: "Calculates the scripting path to this Animation and copies it to the clipboard.",
				icon: "fa-clipboard",
				condition: () => Format === format && (Animation.selected !== null),
				click() {
					let path = [Project.name || "modelName", Animation.selected.name]
					path = path.map(getValidLuaIndex)
					path.unshift('animations')
					navigator.clipboard.writeText(path.join(""))
				}
			})
			const copyPathTextures = new Action('figura_copy_path_texture', {
				name: "Copy Texture Path",
				description: "Calculates the scripting path to this Texture and copies it to the clipboard. Results may vary.",
				icon: "fa-clipboard",
				condition: () => Format === format && (Texture.selected !== null),
				click() {
					let texture = Path.parse(Texture.selected.path)
					let project = Path.parse(Project.save_path)
					let relative = Path.relative(project.dir, texture.dir)
					let path
					if (texture.dir == '' || relative.startsWith(`..`))
						path = `textures["${Project.name}.${Texture.selected.name.replace(/\.png$/, "")}"]`
					else
						path = `textures["${relative.replace(`\\${Path.sep}`, '.')}${relative == '' ? '' : '.'}${texture.name}"]`
					navigator.clipboard.writeText(path)
				}
			})
			const recalculateUV = new Action('figura_recalculate_uv', {
				name: "Recalculate UVs",
				description: "Calculate the uvs for all of a texture's parts",
				icon: "fa-expand",
				condition: { method: () => Format === format },
				click() {
					if (Texture.all.length == 0) {
						Blockbench.showQuickMessage('No textures in bbmodel');
						return
					}
					let _texture = null;
					let _width = 0, _height = 0;
					let dialog = new Dialog({
						id: 'figura_recalculate_uv',
						title: 'Recalculate UVs',
						form: {
							texture: {
								label: 'Texture',
								type: 'select',
								options: Texture.all.reduce((o, t) => { o[t.uuid] = t.name; return o }, {})
							},
							prev_width: {
								label: 'Current Width',
								type: 'number',
							},
							prev_height: {
								label: 'Current Height',
								type: 'number',
							},
							_: "_",
							new_width: {
								label: 'New Width',
								type: 'number',
								min: 1,
								step: 1
							},
							new_height: {
								label: 'New Height',
								type: 'number',
								min: 1,
								step: 1
							},
						},
						onFormChange(form_result) {
							let texture = Texture.all.find(t => t.uuid === form_result.texture)
							if (form_result.texture != _texture) {
								_texture = form_result.texture
								_width = texture.width
								_height = texture.height
								dialog.setFormValues({
									prev_width: texture.width,
									prev_height: texture.height,
									new_width: texture.width,
									new_height: texture.height
								})
								dialog.updateFormValues(false)
							} else if (form_result.prev_width != _width || form_result.prev_height != _height) {
								dialog.setFormValues({
									prev_width: _width,
									prev_height: _height,
								})
								dialog.updateFormValues(false)
							}
						},
						onConfirm(form_result) {
							console.log("?")
							console.log(Cube.all.filter(c => !c.box_uv))
							Undo.initEdit({ elements: [...Cube.all, ...Mesh.all] })
							Cube.all.filter(c => !c.box_uv).forEach(cube => {
								for (var key in cube.faces) {
									if (cube.faces[key].texture != form_result.texture) continue
									var uv = cube.faces[key].uv;
									uv[0] *= form_result.new_width / form_result.prev_width;
									uv[2] *= form_result.new_width / form_result.prev_width;
									uv[1] *= form_result.new_height / form_result.prev_height;
									uv[3] *= form_result.new_height / form_result.prev_height;
								}
							})
							Mesh.all.forEach(mesh => {
								for (var key in mesh.faces) {
									if (mesh.faces[key].texture != form_result.texture) continue
									var uv = mesh.faces[key].uv;
									for (let vkey in uv) {
										uv[vkey][0] *= form_result.new_width / form_result.prev_width;
										uv[vkey][1] *= form_result.new_height / form_result.prev_height;
									}
								}
							})
							Canvas.updateAllUVs()
							Interface.Panels.textures.inside_vue.$forceUpdate();
							Canvas.updateLayeredTextures();
							UVEditor.vue.$forceUpdate();
							Undo.finishEdit('Recalculated UVs')
						},
						onCancel() {
						}
					});
					dialog.show();
					dialog.updateFormValues(false)
				}
			})
			const importAnimations = new Action('figura_import_animations', {
				name: "Import Animations...",
				description: "Import animations from another bbmodel",
				icon: "fa-file-import",
				condition: { modes: ['animate'], method: () => Format === format },
				click() {
					Blockbench.import({
						resource_id: 'model',
						extensions: ['bbmodel'],
						type: 'Model',
						readtype: 'text',
						multiple: false
					}, function (files) {
						let file = files[0]
						if (!file) return

						// get the animation data in JSON form via opening the project file and generating the json from the current file.
						let currentProject = Project
						let close = !(isApp && ModelProject.all.find(project => (
							project.save_path == file.path || project.export_path == file.path
						)))
						loadModelFile(file);
						let loadedProject = Project
						let animJson = Animator.buildFile()
						currentProject.select()
						if (close) loadedProject.close()

						// load the animations into the current project, deleting the originals if desired.
						// stolen from function importFile at line 1525 of animation.js
						let form = {};
						let keys = [];
						for (var key in animJson.animations) {
							form[key.hashCode()] = { label: key, type: 'checkbox', value: true, nocolon: true };
							keys.push(key)
						}
						if (keys.length == 0) {
							Blockbench.showQuickMessage('message.no_animation_to_import');
						} else {
							let dialog = new Dialog({
								id: 'figura_animation_import',
								title: 'dialog.animation_import.title',
								form,
								onConfirm(form_result) {
									let names = [];
									let animsToRemove = [];
									for (var key of keys) {
										if (form_result[key.hashCode()]) {
											names.push(key);
											let a = Animation.all.find(anim => anim.name == key)
											if (a) animsToRemove.push(a)
										}
									}
									Undo.initEdit({ animations: animsToRemove })
									if (form_result.replace_animations)
										animsToRemove.forEach(anim => anim.remove(false))
									let new_animations = Animator.loadFile({ json: animJson, path: null }, names);
									Undo.finishEdit('Figura Import animations', { animations: new_animations })
								},
								onCancel() {
								}
							});
							form.select_all_none = {
								type: 'buttons',
								buttons: ['generic.select_all', 'generic.select_none'],
								click(index) {
									let values = {};
									keys.forEach(key => values[key.hashCode()] = (index == 0));
									dialog.setFormValues(values);
								}
							}
							form.properties_break = '_'
							form.replace_animations = {
								label: "Replace Animations?",
								description: "If enabled, the imported animations will replace the old ones",
								type: 'checkbox',
								value: true,
								nocolon: true
							};
							dialog.show();
						}
					})
				}
			})
			const bakeIK = new Action('figura_bake_ik', {
				name: "Bake IK into Animations",
				description: "Bakes Inverse Kinematics into raw Keyframes for use in Figura",
				icon: "fa-bone",
				condition: { modes: ['animate'], method: () => Format === format && Animation.selected },
				click() {
					new Dialog({
						id: "figura_confirm_bake_ik",
						title: "Confirm Bake Inverse Kinematics",
						lines: [
							"<p>This bakes the IK of all NullObjects onto the keyframes of the groups themselves, allowing it to be visible in Figura</p>",
							"<p>However, NullObjects <strong>override</strong> the keyframes of the affected groups while it is present</p>",
							"<p>Leaving the NullObject in the model has no effect on Figura, so just leave it incase you want to rebake the IK later</p>"
						],
						form: {
							"all_animations": {
								type: 'checkbox',
								label: 'Bake all Animations?',
								description: "This Action will normally only bake the selected Animation. Do you want to bake all Animations in one swoop?",
								value: false,
								full_width: false
							}
						},
						onConfirm() {
							const animations = this.getFormResult().all_animations ? Animator.animations : [Animation.selected]
							for (const animation of animations) {
								let animators = animation.animators

								// Inverse Kinematics
								let ik_samples = animation.sampleIK();
								for (let uuid in ik_samples) {
									//let group = OutlinerNode.uuids[uuid];
									ik_samples[uuid].forEach((rotation, i) => {
										let timecode = i / animation.snapping
										let kf = getOrMakeKeyframe(animators[uuid], 'rotation', timecode, animation.snapping)
										kf.set('x', rotation.array[0])
										kf.set('y', rotation.array[1])
										kf.set('z', rotation.array[2])
									})
								}
							}
						}
					}).show()
				}
			})
			const cycleVertexOrder = new Action('figura_cycle_vertex_order', {
				name: 'Cycle Vertex Order',
				icon: 'fa-sync',
				category: 'edit',
				condition: { modes: ['edit'], features: ['meshes'], method: () => Format === format && (Mesh.selected[0] && Mesh.selected[0].getSelectedFaces().length) },
				click() {
					Undo.initEdit({ elements: Mesh.selected });
					Mesh.selected.forEach(mesh => {
						for (const face of mesh.faces) {
							if (face.isSelected()) {
								if (face.vertices.length < 3) continue;
								[face.vertices[0], face.vertices[1], face.vertices[2], face.vertices[3]] = [face.vertices[1], face.vertices[2], face.vertices[3], face.vertices[0]];
							}
						}
					})
					Undo.finishEdit('Cycle face vertices');
					Canvas.updateView({ elements: Mesh.selected, element_aspects: { geometry: true, uv: true, faces: true } });
				}
			})
			const optimizeModel = new Action('figura_optimize_model', {
				name: 'Optimize Model',
				icon: 'fa-gear',
				condition: { method: () => Format == format },
				click() {
					new Dialog('figura_optimize_model_dialog', {
						title: "Optimize Model",
						form: {
							clear_unused_pivots: {
								type: "checkbox",
								label: "Clear Unused Pivot Data",
								description: "If a cube does not have a rotation, set the pivot point to the origin.\nFigura does not store pivot points at the origin, resulting in saved bytes",
								value: true,
								nocolon: true,
							}
						},
						onConfirm(form_result) {
							Undo.initEdit({ elements: Cube.all })
							if (form_result.clear_unused_pivots) {
								Cube.all.forEach((cube) => {
									if (cube.rotation.allEqual(0)) {
										cube.origin.V3_set(0, 0, 0)
									}
								})
								Canvas.updatePositions(Cube.all)
							}
							Undo.finishEdit('Optimize Model');
						}
					}).show()
				}
			})

			const validateFaces = new ValidatorCheck('figura_mesh_face_rule', {
				update_triggers: ['update_selection'],
				condition: {
					method: (context) => Format === format && Mesh.hasAny()
				},
				run() {
					Mesh.all.forEach(mesh => {
						mesh.forAllFaces(face => {
							if (![3, 4].includes(face.vertices.length)) {
								this.fail({
									message: `Mesh ${mesh.name} has invalid face ${face.getFaceKey()} with ${face.vertices.length} vertices`,
									buttons: [{
										name: "Select Mesh",
										icon: "fa-gem",
										click() {
											mesh.select()
											BarItems.selection_mode.change('face')

											// It works best when I select all possible selections, even though I only need to select faces.
											let selectedVertices = mesh.getSelectedVertices(true)
											selectedVertices.empty()
											selectedVertices.push(...face.vertices)

											let selectedEdges = mesh.getSelectedEdges(true)
											selectedEdges.empty()
											for (i = 0; i < face.vertices.length; i++)
												selectedEdges.push([face.vertices[i], face.vertices[(i + 1) % face.vertices.length]])

											let selectedFaces = mesh.getSelectedFaces(true)
											selectedFaces.empty()
											selectedFaces.push(face.getFaceKey())

											// UV Editor for completeness
											UVEditor.vue.selected_faces.empty();
											UVEditor.vue.selected_faces.safePush(face.getFaceKey());
											updateSelection()
											Validator.dialog.hide()
										}
									}]
								})
							}
						})
					})
				}
			})
			const validateTextureNames = new ValidatorCheck('figura_duplicate_texture_name_rule', {
				update_triggers: ['add_texture', 'update_selection'],
				condition: {
					method: (context) => Format === format && Texture.all.length > 0
				},
				run() {
					let textureCount = Texture.all.reduce((arr, t) => {
						if (arr[t.name])
							arr[t.name]++
						else
							arr[t.name] = 1
						return arr
					}, {})
					for (const [name, cnt] of Object.entries(textureCount))
						if (cnt > 1)
							this.fail({
								message: `${cnt} textures have the name "${name}". Figura does not support textures with duplicate names`
							})
				}
			})

			const arbitraryGroupNames = new Setting('figura_allow_duplicate_names', {
				name: "Allow arbitrary group names",
				description: "Enabling this removes the group name restrictions imposed by Blockbench. This can break Animations. Figura Model Format is not liable for any harm caused by this setting. You have been warned.",
				category: 'edit',
				type: 'toggle',
				value: false
			})

			Cube.prototype.menu.addAction(copyPathModelPart, '#manage');
			Mesh.prototype.menu.addAction(copyPathModelPart, '#manage');
			Group.prototype.menu.addAction(copyPathModelPart, '#manage');
			Animation.prototype.menu.addAction(copyPathAnimation, '#properties');
			Texture.prototype.menu.addAction(copyPathTextures, '#properties');
			MenuBar.menus.uv.addAction(recalculateUV)
			MenuBar.menus.animation.addAction(importAnimations, '#file')
			MenuBar.menus.animation.addAction(bakeIK, '#edit')
			MenuBar.menus.tools.addAction(optimizeModel)
			Toolbars.main_tools.add(cycleVertexOrder)

			toDelete.push(
				copyPathModelPart,
				copyPathAnimation,
				copyPathTextures,
				recalculateUV,
				importAnimations,
				bakeIK,
				cycleVertexOrder,
				validateFaces,
				validateTextureNames,
				arbitraryGroupNames,
				optimizeModel,
			)

			// Removes the FileName in the Project dialog
			ModelProject.properties.name.condition = () => Format != format

			// Removed the Render Order field from the Right Click context menu.
			const elementRenderOrderCondition = BarItems.element_render_order.condition
			BarItems['element_render_order'].condition = () => Format === format ? false : elementRenderOrderCondition()

			// Change the default name of new Animations from `animation.model.new` to just `new`
			const addAnimationClick = BarItems['add_animation'].click
			BarItems['add_animation'].click = function () {
				if (Format !== format) addAnimationClick.call(this)
				else
					new Animation({
						name: 'new',
						saved: false
					}).add(true).propertiesDialog()
			}
			// Add a popup when clicking on Export Textures to notify new users
			const exportAnimationClick = BarItems['export_animation_file'].click
			BarItems['export_animation_file'].click = function (...args) {
				let button = this
				if (Format !== format) {
					exportAnimationClick.call(button, ...args)
					return
				}
				new Dialog({
					id: "figura_confirm_export_animation",
					title: "Confirm Export Animations",
					lines: [
						"<p><strong>Figura does not read these exported Animation files.</strong></p>",
						"<p>Figura reads animations directly from the Blockbench file itself.</p>",
						"<p>The Export Animmations button should only be used when transfering animations from one bbmodel to another.</p>",
						"<p>Otherwise, do not touch this button.</p>",
						"<p>Do you understand, and want the exported animations anyways?</p>"
					],
					onConfirm() {
						exportAnimationClick.call(button, ...args)
					}
				}).show()
			}

			const name_regex = Group.prototype.name_regex, needsUniqueName = Group.prototype.needsUniqueName
			Group.prototype.name_regex = () => (Format === format && arbitraryGroupNames.value) ? false : name_regex();
			Group.prototype.needsUniqueName = () => (Format === format && arbitraryGroupNames.value) ? false : needsUniqueName();
			const showMessageBox = Blockbench.showMessageBox
			Blockbench.showMessageBox = function (options, callback) {
				if (Format === format && arbitraryGroupNames.value && options.translateKey == "duplicate_groups") return
				showMessageBox.apply(this, [options, callback])
			}

			// Remove the Texture Render Mode field from the Right Click context menu.
			Texture.prototype.menu.structure.find(v => v.name == 'menu.texture.render_mode').condition = () => Format !== format
			// In the Texture Properties Dialog specifically, remove the Render Mode field
			const DialogBuild = Dialog.prototype.build
			Dialog.prototype.build = function () {
				if (Format === format && this.id == 'texture_edit') delete this.form.render_mode
				DialogBuild.call(this)
			}

			// Prevents the Timeline from erroring when Sound and Particle channels are removed
			const displayFrame = EffectAnimator.prototype.displayFrame
			EffectAnimator.prototype.displayFrame = function () {
				if (Format === format) return
				displayFrame.call(this)
			}

			// Remove molang validation, as Figura uses Lua not molang
			const molangSyntax = Validator.checks.find(element => element.id == 'molang_syntax')
			if (molangSyntax) {
				let method = molangSyntax.condition.method
				molangSyntax.condition.method = (context) => Format === format ? false : (method ? method(context) : false)
			}
		},
		onunload() {
			for (const deletable of toDelete)
				deletable.delete()
		}
	});

})()