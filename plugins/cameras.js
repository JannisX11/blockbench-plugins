(function() {

let deletables = [];

BBPlugin.register('cameras', {
	title: 'Cameras',
	icon: 'videocam',
	author: 'JannisX11',
	description: 'Adds cameras to Blockbench. Cameras allow you to view the model from different angles, and can be animated to create camera paths.',
	about: 'Cameras can be added through the Edit menu. Enabling Split Screen from View > Split Screen is recommended to preview what the camera can see while editing it. Right-click the camera in the viewport to link or unlink it to the viewport.',
	version: '1.1.0',
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
			updatePreviewCamera() {
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
				}
			}
		}
		
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
		new Property(CameraElement, 'string', 'linked_preview');
		new Property(CameraElement, 'boolean', 'camera_linked');
		new Property(CameraElement, 'boolean', 'visibility', {default: true});
		
		OutlinerElement.registerType(CameraElement, 'camera');
		
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
		
				let geometry = new THREE.BufferGeometry();
				let vertices = [
					0, 0, 0, -3, -1.8, -6,
					0, 0, 0,  3, -1.8, -6,
					0, 0, 0, -3,  1.8, -6,
					0, 0, 0,  3,  1.8, -6,
					-3, -1.8, -6,  3, -1.8, -6,
					-3,  1.8, -6,  3,  1.8, -6,
					-3,  1.8, -6, -3, -1.8, -6,
					 3,  1.8, -6,  3, -1.8, -6,
				];
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

				element.updatePreviewCamera();
	
				this.dispatchEvent('update_transform', {element});
			},
			updateSelection(element) {
				let {mesh} = element;
				mesh.material.color.set(element.selected ? gizmo_colors.outline : gizmo_colors.grid)
				mesh.line_material.color.set(element.selected ? gizmo_colors.outline : gizmo_colors.grid)
		
				this.dispatchEvent('update_selection', {element});
			}
		})

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
		
				if (!this.muted.position) {
					this.displayPosition(this.interpolate('position'), multiplier);
				}
				if (!this.muted.rotation) {
					this.displayRotation(this.interpolate('rotation'), multiplier);
				}
				this.element.mesh.updateMatrixWorld()
				this.element.updatePreviewCamera();
			}
		}
			CameraAnimator.prototype.type = 'camera';
			CameraAnimator.prototype.channels = {
				position: {name: tl('timeline.position'), mutable: true, transform: true, max_data_points: 2},
				rotation: {name: tl('timeline.rotation'), mutable: true, transform: true, max_data_points: 2},
			}
		CameraElement.animator = CameraAnimator;

	},
	onunload() {
		deletables.forEach(action => {
			action.delete();
		})
	}
});

})()
