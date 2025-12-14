(function() {

	let codec, format, export_action;
	
	const description = 'Exports an animation into a sequence of Minecraft block/item models.'
	const icon = 'icon-objects'
	
	BBPlugin.register('java_block_sequencer', {
		title: 'Java Block Sequencer',
		icon,
		author: 'Jatzylap',
		description,
    	tags: ["Minecraft: Java Edition", "Exporter", "Animation"],
		version: '1.0.0',
		min_version: '5.0.5',
		variant: 'both',
		creation_date: "2025-12-14",
		has_changelog: true,
		repository: "https://github.com/Jatzylap/Java-Block-Sequencer",
		onload() {

			codec = Codecs.java_block;	// Defaults to 1.21.11+ format
			
			format = new ModelFormat({
		        id: "java_block_sequence",
		        name: "Java Block Sequence",
		        extension: "json",
		        icon: "icon-objects",
		        category: "minecraft",
		        format_page: {
		          component: {
		            methods: {
		              create: () => format.new()
		            },
		            template: `
		              <div class="format-page" style="display:flex;flex-direction:column;height:100%">
		                <p class="format_description">${description}</p>
		                <p class="format_target"><b>Target</b> : <span>Minecraft: Java Edition</span></p>
		                <content>
		                  <h3 class="markdown">About:</h3>
		                  <p class="markdown">
		                    <ul>
		            		  <li>Adds the option to turn an animation into a sequence of Minecraft block/item models.</li>
		                      <li>This will not export any item definition files for the exported models, so these must be referenced manually in a resource pack.</li>
		                      <li>Requires <strong>Minecraft 1.21.11</strong> or later.</li>
		                    </ul>
		                  </p>
		                  <h3 class="markdown">How to use:</h3>
		                  <p class="markdown">
		                    <ul>
		                      <li>Create a new model or convert an existing cube-based project into a <strong>Java Block Sequence</strong>.</li>
		                      <li>Create an animation.</li>
		                      <li>Right-click your animation.</li>
		                      <li>Click <strong>Export Java Block Sequence</strong> from the drop-down menu.</li>
		            		  <li>Each model will be displayed in-game based on settings in the Display tab.</li>
		                    </ul>
		                  </p>
		                  <h3 class="markdown">Troubleshooting:</h3>
		                  <p class="markdown">
		                    <ul>
		                      <li>If the exported models aren't getting rotated or positioned properly, make sure the groups/bones used in your Java Block Sequence have been checked (Export: On) in the outliner.</li>
		                    </ul>
		                  </p>
		                </content>
		                <div class="spacer"></div>
		                <div class="button_bar">
		                  <button id="create_new_model_button" style="margin-top:20px;margin-bottom:24px;" @click="create">
		                    <i class="material-icons icon">arrow_forward</i>
		                    Create New Model
		                  </button>
		                </div>
		              </div>
		            `
		          }
		        },
		        render_sides: "front",
		        model_identifier: false,
		        parent_model_id: true,
		        vertex_color_ambient_occlusion: true,
		        bone_rig: true,
		        rotate_cubes: true,
		        optional_box_uv: true,
		        uv_rotation: true,
		        java_cube_shading_properties: true,
		        java_face_properties: true,
		        cullfaces: true,
		        animated_textures: true,
		        select_texture_for_particles: true,
		        texture_mcmeta: true,
		        display_mode: true,
		        animation_mode: true,
		        texture_folder: true,
		        animation_controllers: true,
		        animation_files: true,
		        codec
		      })

			codec.format = format;

			export_anim_action = new Action('export_java_block_sequence', {
				name: 'Export Java Block sequence',
				description: 'Export animation into Java Block models',
				icon: 'icon-objects',
				category: 'animation',
				condition: () => Modes.animate && Animation.selected,
				click() {
					new Dialog({
						id: 'export_java_block_sequence',
						title: 'Export Java Block Sequence',
						form: {
							length: {label: 'Length', type: 'number', value: Animation.selected.length, min: 0, max: 10000},
							fps: {label: 'FPS', type: 'number', value: Animation.selected.snapping, min: 1, max: 1000},
						},
						onConfirm({length, fps}) {

							let archive = new JSZip();
							Timeline.setTime(0);

							for (let frame = 0; frame <= length * fps; frame++) {
								Timeline.setTime(frame / fps);
								Animator.preview();
								let elements = Outliner.elements;
								Undo.initEdit({elements, outliner: true, groups: Group.all});
								let animatable_elements = Outliner.elements.filter(el => el.constructor.animator);

								[...Group.all, ...animatable_elements].forEach(node => {
									let offset_rotation = [0, 0, 0];
									let offset_position = [0, 0, 0];
									let offset_scale = [1, 1, 1];
									Animator.animations.forEach(animation => {
										if (animation.playing) {
											let animator = animation.getBoneAnimator(node);
											let multiplier = animation.blend_weight ? Math.clamp(Animator.MolangParser.parse(animation.blend_weight), 0, Infinity) : 1;
											
											if (node instanceof Group) {
												if (animator.channels.rotation) {
													let rotation = animator.interpolate('rotation');
													if (rotation instanceof Array) offset_rotation.V3_add(rotation.map(v => v * multiplier));
												}
												if (animator.channels.position) {
													let position = animator.interpolate('position');
													if (position instanceof Array) offset_position.V3_add(position.map(v => v * multiplier));
												}
												if (animator.channels.scale) {
													let scale = animator.interpolate('scale');
													if (scale instanceof Array) offset_scale.V3_multiply(scale.map(v => v * multiplier));
												}
											}
										}
									});

									// Rotation
									if (node.getTypeBehavior('rotatable')) {
										node.rotation[0] += offset_rotation[0];
										node.rotation[1] += offset_rotation[1];
										node.rotation[2] += offset_rotation[2];
									}
									
									// Position, Scale
									function offset(node) {
										if (node instanceof Group) {
											node.origin.V3_add(offset_position);
											node.children.forEach(offset);
										} else {	
											if (node.from) node.from.V3_add(offset_position);
											if (node.to) node.to.V3_add(offset_position);
											if (node.origin && node.origin !== node.from) node.origin.V3_add(offset_position);

											// Scale
											let before_from = node.from;
											let before_to = node.to;
											let before_origin = node.origin;
											let new_origin = node.parent.origin;

											new_origin.forEach(function(ogn, i) {
												if (node.from) {
													node.from[i] = (before_from[i] - node.inflate - ogn) * offset_scale[i];
													node.from[i] = node.from[i] + node.inflate + ogn;
												}
												if (node.to) {
													node.to[i] = (before_to[i] + node.inflate - ogn) * offset_scale[i];
													node.to[i] = node.to[i] - node.inflate + ogn;
													if (Format.integer_size) {
														node.to[i] = node.from[i] + Math.round(node.to[i] - node.from[i])
													}
												}
												if (node.origin) {
													node.origin[i] = (before_origin[i] - ogn) * offset_scale[i];
													node.origin[i] = node.origin[i] + ogn;
												}
											});
										}
									}

									// Resolve mesh positions from bones
									function resolve(node) {
										var array = node.children.slice();
										var index = node.getParentArray().indexOf(node)
										let all_elements = [];
										let all_groups = [node];
										node.forEachChild(obj => {
											if (obj instanceof Group == false) {
												all_elements.push(obj);
											} else {
												all_groups.push(obj);
											}
										});

										array.forEach((obj) => {
											obj.addTo(node.parent, index)
											
											if ((obj instanceof Cube && Format.rotate_cubes) || (obj instanceof OutlinerElement && obj.getTypeBehavior('rotatable')) || (obj instanceof Group && Format.bone_rig)) {
												let quat = new THREE.Quaternion().copy(obj.mesh.quaternion);
												quat.premultiply(obj.mesh.parent.quaternion);
												let e = new THREE.Euler().setFromQuaternion(quat, obj.mesh.rotation.order);
												obj.extend({
													rotation: [
														Math.roundTo(Math.radToDeg(e.x), 4),
														Math.roundTo(Math.radToDeg(e.y), 4),
														Math.roundTo(Math.radToDeg(e.z), 4),
													]
												});
											}
											if (obj.mesh) {
												let pos = new THREE.Vector3().copy(obj.mesh.position);
												pos.applyQuaternion(node.mesh.quaternion).sub(obj.mesh.position);
												let diff = pos.toArray();

												if (obj.from) obj.from.V3_add(diff);
												if (obj.to) obj.to.V3_add(diff);
												if (obj.getTypeBehavior('rotatable') || obj instanceof Group) obj.origin.V3_add(diff);

												if (obj instanceof Group) {
													obj.forEachChild(child => {
														if (child instanceof Mesh) {
															for (let vkey in child.vertices) {
																child.vertices[vkey].V3_add(diff);
															}
														}
														if (child instanceof Cube) child.from.V3_add(diff);
														if (child.to) child.to.V3_add(diff);
														if (child.origin) child.origin.V3_add(diff);
														
													});
												}
											}
										});
										Canvas.updateView({elements: array, element_aspects: {transform: true}});
									}

									offset(node);
									resolve(node);
								});
								
								let javablockmodel = codec.compile(Project);
								archive.file(`${frame}.json`, javablockmodel);
								Undo.finishEdit(`Java Block Sequence Cache`);
								Undo.undo();
							}

							archive.generateAsync({type: 'blob'}).then(content => {
								Blockbench.export({
									resource_id: 'model',
									type: 'Zip Archive',
									extensions: ['zip'],
									name: Animation.selected.name,
									content: content,
									savetype: 'zip'
								});
							});
						}
					}).show();
				}
			});

			export_model_action = new Action({
				id: 'export_blockmodel',
				icon: 'icon-format_block',
				category: 'file',
				condition: () => Format == format,
				click: function () {
					codec.export();
				}
			})
			import_model_action = new Action('import_java_block_model', {
				icon: 'assessment',
				category: 'file',
				condition: () => Format == format,
				click: function () {
					Blockbench.import({
						resource_id: 'model',
						extensions: ['json'],
						type: codec.name,
						multiple: true,
					}, function(files) {
						files.forEach(file => {
							var model = autoParseJSON(file.content, {file_path: file.path})
							codec.parse(model, file.path, {
								import_to_current_project: true
							})
						})
					})
				}
			})

			Animation.prototype.menu.addAction(export_anim_action, '-1');
			MenuBar.addAction(export_model_action, "file.export.0")
			MenuBar.addAction(import_model_action, "file.import.0")

		},
		onunload() {
			codec.delete();
			format.delete();
			export_action.delete();
		}
	});
})()
