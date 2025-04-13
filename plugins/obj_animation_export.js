(function() {

	let export_action;
	
	BBPlugin.register('obj_animation_export', {
		title: 'OBJ Animation Exporter',
		icon: 'icon-objects',
		author: 'JannisX11',
		description: 'Exports an animation to OBJ as an OBJ file sequence',
		about: 'To export, right click an animation and click Export OBJ Sequence.',
		tags: ['Exporter'],
		version: '0.1.0',
		min_version: '4.0.0',
		variant: 'both',
		onload() {
			
			export_action = new Action('export_obj_sequence', {
				name: 'Export OBJ Sequence',
				description: 'Export animation as OBJ sequence',
				icon: 'icon-objects',
				category: 'animation',
				condition: () => Modes.animate && Animation.selected,
				click() {
					new Dialog({
						id: 'export_obj_sequence',
						title: 'Export OBJ Sequence',
						form: {
							length: {label: 'Length', type: 'number', value: Animation.selected.length, min: 0, max: 10000},
							fps: {label: 'FPS', type: 'number', value: Animation.selected.snapping, min: 1, max: 1000},
						},
						onConfirm({length, fps}) {
							let archive = new JSZip();
							let name = (Project.name||'model');
							let num_length = Math.round(length * fps).toString().length;

							Timeline.setTime(0);
							for (let frame = 0; frame <= length * fps; frame++) {
								Timeline.setTime(frame / fps);
								Animator.preview();
								let obj = Codecs.obj.compile();
								archive.file(`${name}_${frame.toDigitString(num_length)}.obj`, obj);
							}
							
							let all_files = Codecs.obj.compile({all_files: true});

							archive.file('materials.mtl', all_files.mtl)
				
							for (let key in all_files.images) {
								let texture = all_files.images[key]
								if (texture && !texture.error) {
									archive.file(pathToName(texture.name) + '.png', texture.getBase64(), {base64: true});
								}
							}
							archive.generateAsync({type: 'blob'}).then(content => {
								Blockbench.export({
									resource_id: 'obj',
									type: 'Zip Archive',
									extensions: ['zip'],
									name: 'animation',
									content: content,
									savetype: 'zip'
								});
							})
						}
					}).show();
				}
			})
	
			Animation.prototype.menu.addAction(export_action, '-1');
		},
		onunload() {
			export_action.delete();
		}
	});
})()
