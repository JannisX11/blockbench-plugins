(function() {

let deletables = [];

BBPlugin.register('cameras', {
	title: 'Cameras',
	icon: 'videocam',
	author: 'JannisX11',
	description: 'Adds cameras to Blockbench. Cameras allow you to view the model from different angles, and can be animated to create camera paths.',
	about: 'Cameras can be added through the Edit menu. Enabling Split Screen from View > Split Screen is recommended to preview what the camera can see while editing it. Right-click the camera in the viewport to link or unlink it to the viewport.',
	version: '1.2.0',
	min_version: '4.3.0',
	variant: 'both',
	onload() {
		
		class CameraElement extends OutlinerElement {
			constructor(data, uuid) {
				super(data, uuid)
				
				for (var key in CameraElement.properties) {
					CameraElement.properties[key].reset(this);
				}
				if (data && typeof data === 'object') {
					this.extend(data)
				}
			}
			get origin() {
				return this.position;
			}
			getWorldCenter() {
				return THREE.fastWorldPosition(this.mesh, Reusable.vec2);
			}
			extend(object) {
				for (var key in CameraElement.properties) {
					CameraElement.properties[key].merge(this, object)
				}
				if (typeof object.vertices == 'object') {
					for (let key in object.vertices) {
						this.vertices[key] = object.vertices[key].slice();
					}
				}
				this.sanitizeName();
				return this;
			}
			getUndoCopy() {
				var copy = new CameraElement(this)
				copy.uuid = this.uuid;
				delete copy.parent;
				return copy;
			}
			getSaveCopy() {
				var el = {}
				for (var key in CameraElement.properties) {
					CameraElement.properties[key].copy(this, el)
				}
				el.type = 'camera';
				el.uuid = this.uuid
				return el;
			}
			select(event, isOutlinerClick) {
				super.select(event, isOutlinerClick);
				if (Animator.open && Animation.selected) {
					Animation.selected.getBoneAnimator(this).select(true);
				}
				return this;
			}
			unselect(...args) {
				super.unselect(...args);
				if (Animator.open && Timeline.selected_animator && Timeline.selected_animator.element == this) {
					Timeline.selected_animator.selected = false;
				}
			}		
			updatePreviewCamera(fov) {
				if (this.linked_preview) {
					let preview = Preview.all.find(preview => preview.id == this.linked_preview);
					if (!preview) return;

					if (preview.isOrtho) preview.setProjectionMode(false);
					preview.controls.unlinked = true;

					preview.camera.position.copy(this.getWorldCenter());
					this.mesh.getWorldQuaternion(preview.camera.quaternion);
					// Update controls target in case camera is controlled by controls
					preview.controls.target.copy(preview.camera.position);
					let offset = Reusable.vec1.set(0, 0, -16).applyQuaternion(preview.camera.quaternion);
					preview.controls.target.add(offset);

					let preview_fov = (fov || this.fov) * 1.001; // padding to fix flickering with viewport border
					preview.setFOV(preview_fov);
				}
			}
		}
		window.CameraElement = CameraElement;
		
		/*Outliner.buttons.camera_linked = {
			id: 'camera_linked',
			title: 'Camera Active',
			icon: ' fas fa-link-slash',
			icon_off: ' fas fa-link',
			advanced_option: false
		};*/
			CameraElement.prototype.title = 'Camera';
			CameraElement.prototype.type = 'camera';
			CameraElement.prototype.icon = 'fas fa-video';
			CameraElement.prototype.movable = true;
			CameraElement.prototype.rotatable = true;
			CameraElement.prototype.needsUniqueName = true;
			CameraElement.prototype.menu = new Menu([
				'link_camera_to_preview',
				'camera_to_view',
				'edit_camera_properties',
				'_',
				...Outliner.control_menu_group,
				'_',
				'rename',
				'delete'
			]);
			CameraElement.prototype.buttons = [
				//Outliner.buttons.camera_linked,
				Outliner.buttons.export,
				Outliner.buttons.locked,
				Outliner.buttons.visibility,
			];
		
		new Property(CameraElement, 'string', 'name', {default: 'camera'})
		new Property(CameraElement, 'string', 'path')
		new Property(CameraElement, 'vector', 'position');
		new Property(CameraElement, 'vector', 'rotation');
		new Property(CameraElement, 'number', 'fov', {default: 70});
		new Property(CameraElement, 'vector2', 'aspect_ratio', {default: [16, 9]});
		new Property(CameraElement, 'string', 'linked_preview');
		new Property(CameraElement, 'boolean', 'camera_linked');
		new Property(CameraElement, 'boolean', 'visibility', {default: true});
		
		OutlinerElement.registerType(CameraElement, 'camera');

		function getFrameVertices(camera, fov) {
			let r = 6;
			let deg = Math.degToRad(fov ?? camera.fov) / 2;
			let ratio = camera.aspect_ratio[0] / camera.aspect_ratio[1];
			let h = r * Math.sin(deg);
			let d = r * Math.cos(deg);
			let w = h * ratio;

			let vertices = [
				0, 0, 0, -w, -h, -d,
				0, 0, 0,  w, -h, -d,
				0, 0, 0, -w,  h, -d,
				0, 0, 0,  w,  h, -d,
				-w, -h, -d,  w, -h, -d,
				-w,  h, -d,  w,  h, -d,
				-w,  h, -d, -w, -h, -d,
				 w,  h, -d,  w, -h, -d,
			];
			return vertices;
		}
		
		new NodePreviewController(CameraElement, {
			setup(element) {
				var mesh = new THREE.Mesh(
					new THREE.BoxBufferGeometry(2.4, 1.3, 1.0),
					new THREE.MeshBasicMaterial({color: gizmo_colors.grid})
				);
				Project.nodes_3d[element.uuid] = mesh;
				mesh.name = element.uuid;
				mesh.type = element.type;
				mesh.isElement = true;
				mesh.visible = element.visibility;
				mesh.rotation.order = 'ZYX';
				mesh.geometry.translate(0, 0, -0.5)
		
				let vertices = getFrameVertices(element, element.fov);
				let geometry = new THREE.BufferGeometry();
				geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
				mesh.line_material = new THREE.LineBasicMaterial({color: gizmo_colors.grid});
				
				let frame = new THREE.LineSegments(geometry, mesh.material);
				frame.no_export = true;
				mesh.add(frame)
				mesh.outline = frame;


				mesh.fix_position = new THREE.Vector3();
				mesh.fix_rotation = new THREE.Euler();

				this.updateTransform(element);

				this.dispatchEvent('setup', {element});
			},
			updateTransform(element) {
				NodePreviewController.prototype.updateTransform.call(this, element);
				element.mesh.fix_position.copy(element.mesh.position);
				element.mesh.fix_rotation.copy(element.mesh.rotation);

				this.updateGeometry(element);

				element.updatePreviewCamera();
	
				this.dispatchEvent('update_transform', {element});
			},
			updateGeometry(element) {
				let vertices = getFrameVertices(element, element.mesh.fov ?? element.fov);
				element.mesh.outline.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
				this.dispatchEvent('update_geometry', {element});
			},
			updateSelection(element) {
				let {mesh} = element;
				mesh.material.color.set(element.selected ? gizmo_colors.outline : gizmo_colors.grid)
				mesh.line_material.color.set(element.selected ? gizmo_colors.outline : gizmo_colors.grid)
		
				this.dispatchEvent('update_selection', {element});
			}
		})

		let old_y_condition = KeyframeDataPoint.properties.y.condition;
		let old_z_condition = KeyframeDataPoint.properties.z.condition;
		KeyframeDataPoint.properties.y.condition = (point) => {
			return point.keyframe.channel == 'fov' ? false : old_y_condition(point);
		}
		KeyframeDataPoint.properties.z.condition = (point) => {
			return point.keyframe.channel == 'fov' ? false : old_z_condition(point);
		}
		let old_x_default = KeyframeDataPoint.properties.x.default;
		KeyframeDataPoint.properties.x.default = (point) => {
			return point.keyframe.channel == 'fov' ? (point.keyframe.animator.element?.fov || 70) : old_x_default(point);
		}

		let add_action = new Action('add_camera', {
			name: 'Add Camera',
			icon: 'fas.fa-video',
			category: 'edit',
			condition: () => Modes.edit,
			click() {

				Undo.initEdit({outliner: true, elements: [], selection: true});
				var base_camera = new CameraElement().init()
				var group = getCurrentGroup();
				base_camera.addTo(group)
	
				if (Format.bone_rig && group) {
					var pos1 = group.origin.slice()
					base_camera.extend({
						position: pos1
					})
				}
	
				if (Group.selected) Group.selected.unselect()
				base_camera.select()
				Undo.finishEdit('Add camera', {outliner: true, elements: selected, selection: true});
				Blockbench.dispatchEvent( 'add_camera', {object: base_camera} )
	

				return base_camera
			}
		})
		Interface.Panels.outliner.menu.addAction(add_action, '3')
		MenuBar.menus.edit.addAction(add_action, '8')
		deletables.push(add_action);

		let link_action = new Toggle('link_camera_to_preview', {
			name: 'Link Camera to Preview',
			icon: 'emergency_recording',
			category: 'edit',
			condition: () => CameraElement.all.length && Preview.selected,
			onChange() {
				let should_have_preview = !(CameraElement.selected[0] || CameraElement.all[0]).linked_preview;
				if (!CameraElement.selected[0]) CameraElement.all[0].select();

				Undo.initEdit({elements: CameraElement.selected})
				CameraElement.selected.forEach(camera => {
					camera.linked_preview = should_have_preview ? Preview.selected.id : '';
					if (should_have_preview) {
						camera.updatePreviewCamera();
					}
				})
				Undo.finishEdit('Link camera to preview')
			}
		})
		deletables.push(link_action);
		Blockbench.on('update_selection', () => {
			if (CameraElement.selected[0]) {
				link_action.value = !!CameraElement.selected[0].linked_preview;
				link_action.updateEnabledState();
			}
			Preview.all.forEach(preview => {
				let is_linked = CameraElement.all.find(camera => camera.linked_preview == preview.id);
				preview.controls.unlinked = !!is_linked;
			})
		})
		Preview.prototype.menu.addAction(link_action, -3);

		
		let set_fov_action = new Action('edit_camera_properties', {
			name: 'Camera Properties...',
			icon: 'settings_photo_camera',
			category: 'edit',
			condition: () => CameraElement.selected.length,
			click() {
				new Dialog('edit_camera_properties', {
					title: 'Edit Camera Properties',
					form: {
						fov: {label: 'FOV', value: CameraElement.selected[0]?.fov, type: 'number', min: 1, max: 160},
						aspect_ratio: {label: 'Aspect Ratio', value: CameraElement.selected[0]?.aspect_ratio, type: 'vector', dimensions: 2, min: 1},
					},
					onConfirm(form) {
						Undo.initEdit({elements: CameraElement.selected})
						CameraElement.selected.forEach(camera => {
							camera.fov = form.fov;
							camera.aspect_ratio.replace(form.aspect_ratio);
							CameraElement.preview_controller.updateTransform(camera);
						})
						Undo.finishEdit('Change camera FOV')
					}
				}).show();
			}
		})
		deletables.push(set_fov_action);

		let snap_action = new Action('camera_to_view', {
			name: 'Move Camera to View',
			icon: 'fas.fa-video',
			category: 'edit',
			condition: () => CameraElement.selected.length && Modes.edit,
			click() {
				let position = Preview.selected.camera.position.toArray();
				let rotation_euler = new THREE.Euler().copy(Preview.selected.camera.rotation).reorder('ZYX');
				let rotation = rotation_euler.toArray().map(v => Math.radToDeg(v));
				Undo.initEdit({elements: CameraElement.selected});
				CameraElement.selected.forEach(cam => {
					cam.position.V3_set(position);
					cam.rotation.V3_set(rotation);
					cam.preview_controller.updateTransform(cam);
				})
				Undo.finishEdit('Move camera to view')
				updateSelection();
			}
		})
		deletables.push(snap_action);

		class CameraAnimator extends BoneAnimator {
			constructor(uuid, animation, name) {
				super(uuid, animation);
				this.uuid = uuid;
				this._name = name;
		
				this.position = [];
				this.rotation = [];
				this.fov = [];
			}
			get name() {
				var element = this.getElement();
				if (element) return element.name;
				return this._name;
			}
			set name(name) {
				this._name = name;
			}
			getElement() {
				this.element = OutlinerNode.uuids[this.uuid];
				return this.element
			}
			select(element_is_selected) {
				if (!this.getElement()) {
					unselectAll();
					return this;
				}
				if (this.getElement().locked) return;
		
				if (element_is_selected !== true && this.element) {
					this.element.select();
				}
				GeneralAnimator.prototype.select.call(this);
				
				if (this[Toolbox.selected.animation_channel] && (Timeline.selected.length == 0 || Timeline.selected[0].animator != this)) {
					var nearest;
					this[Toolbox.selected.animation_channel].forEach(kf => {
						if (Math.abs(kf.time - Timeline.time) < 0.002) {
							nearest = kf;
						}
					})
					if (nearest) {
						nearest.select();
					}
				}
		
				if (this.element && this.element.parent && this.element.parent !== 'root') {
					this.element.parent.openUp();
				}
				return this;
			}
			doRender() {
				this.getElement()
				return (this.element && this.element && this.element.mesh);
			}
			displayPosition(arr, multiplier = 1) {
				var bone = this.element.mesh
				if (arr) {
					bone.position.x -= arr[0] * multiplier;
					bone.position.y += arr[1] * multiplier;
					bone.position.z += arr[2] * multiplier;
				}
				return this;
			}
			displayRotation(arr, multiplier = 1) {
				var bone = this.element.mesh
				if (arr) {
					arr.forEach((n, i) => {
						bone.rotation[getAxisLetter(i)] += Math.degToRad(n) * (i == 2 ? 1 : -1) * multiplier
					})
				}
				return this;
			}
			displayFrame(multiplier = 1) {
				if (!this.doRender()) return;
				this.getElement()
				let fov;
		
				if (!this.muted.position) {
					this.displayPosition(this.interpolate('position'), multiplier);
				}
				if (!this.muted.rotation) {
					this.displayRotation(this.interpolate('rotation'), multiplier);
				}
				if (!this.muted.fov) {
					fov = this.interpolate('fov')[0];
				}
				this.element.mesh.updateMatrixWorld()
				this.element.mesh.fov = fov;
				this.element.preview_controller.updateGeometry(this.element);
				this.element.updatePreviewCamera(fov);
			}
		}
			CameraAnimator.prototype.type = 'camera';
			CameraAnimator.prototype.channels = {
				position: {name: tl('timeline.position'), mutable: true, transform: true, max_data_points: 2},
				rotation: {name: tl('timeline.rotation'), mutable: true, transform: true, max_data_points: 2},
				fov: {name: 'FOV', mutable: true, transform: true, max_data_points: 2},
			}
		CameraElement.animator = CameraAnimator;

		Blockbench.on('select_mode', (arg) => {
			if (arg.mode.id == 'animate') return;
			for (let camera of CameraElement.all) {
				camera.mesh.fov = camera.fov;
				CameraElement.preview_controller.updateGeometry(camera);
			}
		})

	},
	onunload() {
		deletables.forEach(action => {
			action.delete();
		})
	}
});

})()
