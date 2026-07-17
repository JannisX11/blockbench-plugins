/** @typedef {import("three")} */
(() => {
	// Destructure global THREE object
	const { Vector2, Vector3, Matrix3, Matrix4} = THREE;

	/** @type {(() => void)[]} */
	const disposers = [];

	const modifiers = {
		'altKey': 'Alt',
		'ctrlKey': 'Ctrl',
		'shiftKey': 'Shift',
		'metaKey': 'Meta (Cmd/Win)',
	};

	/**
	 * @template {{delete: () => void}} TDeletable
	 * @param {TDeletable} deletable
	 * @returns {TDeletable}
	 */
	const deleteOnUnload = deletable => {
		disposers.push(() => deletable.delete());
		return deletable;
	};
	
	/** @type {Matrix4} */ const worldToUvMatrix = new Matrix4().identity();
	const updateWorldToUvMatrix = (() => {
		const edge_1_world = new Vector3(); const edge_2_world = new Vector3();
		const edge_1_uv = new Vector2(); const edge_2_uv = new Vector2();
		const u = new Vector3(); const v = new Vector3(); const w = new Vector3(); const o = new Vector3();
		const pos = [new Vector3(), new Vector3(), new Vector3(), new Vector3()];
		const uv = [new Vector2(), new Vector2(), new Vector2(), new Vector2()];
		return () => {
			const st = _sourceFace.mesh.mesh;
			if (!st) return;
			const sourceVertexPositions = _sourceFace.mesh.vertices;
			const sourceVertexUvs = _sourceFace.uv;

			_sourceFace.getSortedVertices().forEach((vkey, i) => {
				st.localToWorld(pos[i].fromArray(sourceVertexPositions[vkey]));
				uv[i].fromArray(sourceVertexUvs[vkey]);
			});

			// Compute edge vectors in 3D space and on UV plane
			edge_1_world.subVectors(pos[1], pos[0]); edge_2_world.subVectors(pos[2], pos[0]);
			edge_1_uv.subVectors(uv[1], uv[0]);      edge_2_uv.subVectors(uv[2], uv[0]);
			// Find determinant of the UV matrix
			const det = edge_1_uv.x * edge_2_uv.y - edge_2_uv.x * edge_1_uv.y;
			// If triangle is degenerate in UV space (division by zero), return identity matrix
			if (Math.abs(det) < 0.000001) {
				worldToUvMatrix.identity();
				return;
			}
			// U (Tangent), V (Bitangent), W (Normal) direction vectors
			u.copy(edge_1_world).multiplyScalar(edge_2_uv.y).addScaledVector(edge_2_world, -edge_1_uv.y);
			v.copy(edge_2_world).multiplyScalar(edge_1_uv.x).addScaledVector(edge_1_world, -edge_2_uv.x);
			w.crossVectors(u, v).normalize();
			worldToUvMatrix.makeBasis(u.divideScalar(det), v.divideScalar(det), w)
				// Compute position from point a
				.setPosition(o.copy(pos[0]).addScaledVector(u, -uv[0].x).addScaledVector(v, -uv[0].y))
				.invert();
		}
	})();
	
	/** @type {Matrix4} */ const unwrappingMatrix = new Matrix4().identity();
	const updateUnwrappingMatrix = (() => {
		const m = [new Vector3(), new Vector3(), new Vector3(), new Vector3()];
		const t = [new Vector3(), new Vector3(), new Vector3(), new Vector3()];

		const v3 = new Vector3(); const m3 = new Matrix3(); const m4 = new Matrix4();

		const nMain = new Vector3(); const nTarget = new Vector3();
		const axis = new Vector3(); const pivot = new Vector3();
		const crossN = new Vector3();
		/**
		 * Computes the fold matrix that maps points from the target triangle plane
		 * onto the source triangle plane along their intersection line.
		 */
		return () => {
			if (_hoveredFace === _sourceFace) {
				unwrappingMatrix.identity();
				return;
			}
			const mt = _sourceFace.mesh.mesh;
			const tt = _hoveredFace.mesh.mesh;
			if (!mt || !tt) return;
			const mv = _sourceFace.mesh.vertices;
			const tv = _hoveredFace.mesh.vertices;
			_sourceFace.getSortedVertices().forEach((vkey, i) => mt.localToWorld(m[i].fromArray(mv[vkey])));
			_hoveredFace.getSortedVertices().forEach((vkey, i) => tt.localToWorld(t[i].fromArray(tv[vkey])));
			unwrappingMatrix ??= new Matrix4();
			axis.crossVectors(
				nMain.subVectors(m[1], m[0]).cross(v3.subVectors(m[2], m[0])),
				nTarget.subVectors(t[1], t[0]).cross(v3.subVectors(t[2], t[0])));
			if (axis.lengthSq() < 0.000001) {
				unwrappingMatrix.identity();
				return;
			}
			axis.normalize();
			pivot.set(nMain.dot(m[0]), nTarget.dot(t[0]), 0).applyMatrix3(
				m3.set(nMain.x, nMain.y, nMain.z, nTarget.x, nTarget.y, nTarget.z, axis.x, axis.y, axis.z).invert()); 
			unwrappingMatrix.makeTranslation(pivot.x, pivot.y, pivot.z)
				.multiply(m4.makeRotationAxis(axis, nMain.angleTo(nTarget) *
					Math.sign(crossN.crossVectors(nTarget, nMain).dot(axis))))
				.multiply(m4.makeTranslation(-pivot.x, -pivot.y, -pivot.z));
		}
	})();

	/** @type {MeshFace | null} */ let _sourceFace = null;
	/** @type {MeshFace | null} */ let _hoveredFace = null;
	/** @type {MeshFace[]} */ let _targetFaces = [];

	// === Face highlight overlays (semi-transparent meshes on top of geometry) ===
	const SOURCE_COLOR  = 0xff8800;
	const HOVER_COLOR   = 0x0088ff;
	const TARGETS_COLOR = 0x44cc22;

	let faceOverlayGroup;

	/** @param{number} color */
	function createOverlayMesh(color) {
		const mat = new THREE.MeshBasicMaterial({
			color,
			transparent: true,
			opacity: 0.35,
			depthTest: false,
			depthWrite: false,
			side: THREE.DoubleSide,
		});
		const mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat);
		mesh.frustumCulled = false;
		mesh.renderOrder = 999;
		return mesh;
	}

	let sourceOverlay, hoverOverlay, targetsOverlay;

	BBPlugin.register("uv_wrapper", {
		title: "UV Wrapper",
		icon: "texture",
		author: "nklbdev",
		description: "Transfer UVs and textures from one face to another in real time",
		version: "1.0.0",
		min_version: "5.0.0",
		variant: "both",
		onload() {
			faceOverlayGroup = new THREE.Group();
			faceOverlayGroup.name = 'uv_wrapper_overlays';
			faceOverlayGroup.visible = false;
			Canvas.gizmos.push(faceOverlayGroup);
			Canvas.scene.add(faceOverlayGroup);
			sourceOverlay = createOverlayMesh(SOURCE_COLOR);
			hoverOverlay  = createOverlayMesh(HOVER_COLOR);
			targetsOverlay = createOverlayMesh(TARGETS_COLOR);
			faceOverlayGroup.add(sourceOverlay);
			faceOverlayGroup.add(hoverOverlay);
			faceOverlayGroup.add(targetsOverlay);
			let isToolSelected = false;

			/** @param{THREE.Mesh} overlay, @param{MeshFace | null} face */
			function updateOverlay(overlay, face) {
				if (!isToolSelected || !face?.mesh?.mesh) {
					overlay.visible = false;
					return;
				}
				const vertices = face.mesh.vertices;
				const vertKeys = face.getSortedVertices();
				const normal = face.getNormal(true);
				const offset = 0.002;
		
				const arr = new Float32Array(vertKeys.length * 3);
				for (let i = 0; i < vertKeys.length; i++) {
					const v = vertices[vertKeys[i]];
					arr[i * 3]     = v[0] + normal[0] * offset;
					arr[i * 3 + 1] = v[1] + normal[1] * offset;
					arr[i * 3 + 2] = v[2] + normal[2] * offset;
				}
		
				const geo = new THREE.BufferGeometry();
				geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
				geo.setIndex(vertKeys.length === 4 ? [0, 1, 2, 0, 2, 3] : [0, 1, 2]);
		
				overlay.geometry.dispose();
				overlay.geometry = geo;
				// Inherit world transform via matrix copy, no reparenting
				face.mesh.mesh.matrixWorld.decompose(overlay.position, overlay.rotation, overlay.scale);
				overlay.visible = true;
			}
		
			function updateTargetsOverlay() {
				if (!isToolSelected || !_targetFaces.length || !_targetFaces[0]?.mesh?.mesh) {
					targetsOverlay.visible = false;
					updateGroupVisibility();
					return;
				}
				const vertices = _hoveredFace.mesh.vertices;
				const offset = 0.002;
		
				const posArr = [];
				const idxArr = [];
				let baseIdx = 0;
				for (const f of _targetFaces) {
					const norm = f.getNormal(true);
					const keys = f.getSortedVertices();
					for (const vk of keys) {
						const v = vertices[vk];
						posArr.push(v[0] + norm[0] * offset, v[1] + norm[1] * offset, v[2] + norm[2] * offset);
					}
					if (keys.length === 4) {
						idxArr.push(baseIdx, baseIdx + 1, baseIdx + 2, baseIdx, baseIdx + 2, baseIdx + 3);
					} else {
						idxArr.push(baseIdx, baseIdx + 1, baseIdx + 2);
					}
					baseIdx += keys.length;
				}
		
				const geo = new THREE.BufferGeometry();
				geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(posArr), 3));
				geo.setIndex(idxArr);
		
				targetsOverlay.geometry.dispose();
				targetsOverlay.geometry = geo;
				_hoveredFace.mesh.mesh.matrixWorld.decompose(targetsOverlay.position, targetsOverlay.rotation, targetsOverlay.scale);
				targetsOverlay.visible = true;
				updateGroupVisibility();
			}
		
			function updateGroupVisibility() {
				faceOverlayGroup.visible =
					isToolSelected ||
					sourceOverlay.visible ||
					hoverOverlay.visible ||
					targetsOverlay.visible;
			}
		
			const setHoveredFace = (face) => {
				if (face === _hoveredFace) return;
				_hoveredFace = face;
				updateOverlay(hoverOverlay, face);
				updateGroupVisibility();
			};
		
			const updateMeshView = (() => {
				const aspects = {
					element_aspects: { faces: true, uv: true },
					elements: [null],
				};
				return (mesh) => {
					aspects.elements[0] = mesh;
					Canvas.updateView(aspects);
					aspects.elements[0] = null;
				};
			})();


			const addModifierSetting = (id_base, name_base, default_key) =>
				deleteOnUnload(new Setting("uv_wrapper_" + id_base + "_modifier", {
					category: 'edit',
					name: 'UV Wrapper: ' + name_base + ' Modifier Key',
					value: default_key,
					type: 'select',
					options: modifiers,
				}));

			const selectSourceModifier     = addModifierSetting("select_source", "Select Source Face", "altKey"  );
			const fillFullPlaneModifier    = addModifierSetting("fill_full_plane", "Fill Full Plane", "shiftKey" );
			const planarProjectionModifier = addModifierSetting("planar_projection", "Planar Projection", "ctrlKey" );

			/** @param {{value: string}} modifierSetting */
			function isModifierActive(modifierSetting) {
				switch (modifierSetting.value) {
					case 'shiftKey': return Pressing.shift;
					case 'altKey':   return Pressing.alt;
					case 'ctrlKey':  return Pressing.ctrl;
					default:         return false;
				}
			}
			
			const setSourceFace = (face) => {
				if (face === _sourceFace) return;
				_sourceFace = face;
				updateOverlay(sourceOverlay, face);
				updateTargets();
				updateGroupVisibility();
				if (_sourceFace) updateWorldToUvMatrix();
			};


			/** @returns {MeshFace[]} */
			function updateTargetFaces() {
				_targetFaces.length = 0;
				if (!_hoveredFace) return;
				if (!isModifierActive(fillFullPlaneModifier)) {
					_targetFaces.push(_hoveredFace);
					return;
				}
				const visited = new Set();
				const queue = [_hoveredFace];
				visited.add(_hoveredFace);
				while (queue.length) {
					const f = queue.shift();
					if (f !== _sourceFace) _targetFaces.push(f);
					for (let i = 0; i < f.vertices.length; i++) {
						const adj = f.getAdjacentFace(i)?.face;
						if (adj && !visited.has(adj) && adj.getAngleTo(_hoveredFace) < 0.01) {
							visited.add(adj);
							queue.push(adj);
						}
					}
				}
			}


			/** Updates targets overlay */
			function updateTargets() {
				updateTargetFaces();
				updateTargetsOverlay();
			}

			/** Transfers UV and texture from source to target faces */
			const performOperation = (() => {
				const tmp = new Vector3();
				const affectedMeshes = new Set();
				return () => {
					if (!_sourceFace || !_hoveredFace?.mesh.mesh || !_targetFaces.length) return;
					updateUnwrappingMatrix();
					const planar = isModifierActive(planarProjectionModifier);
					for (const face of _targetFaces) {
						if (face == _sourceFace) continue;
						const mesh = face.mesh;
						affectedMeshes.add(mesh);
						addElementToUndo(mesh);
						for (const vertexKey of face.vertices) {
							mesh.mesh.localToWorld(tmp.fromArray(mesh.vertices[vertexKey]));
							if (!planar) tmp.applyMatrix4(unwrappingMatrix);
							tmp.applyMatrix4(worldToUvMatrix);
							const uv = face.uv[vertexKey];
							if (uv) { uv[0] = tmp.x; uv[1] = tmp.y; }
						}
						face.texture = _sourceFace.texture;
					}
					affectedMeshes.forEach(updateMeshView);
					affectedMeshes.clear();
				};
			})();

			let _isDragging = false;

			function handleDrag(raycast_result, start) {
				const { type, element, face } = raycast_result;
				const meshFace = type === 'element' ? element.faces?.[face] ?? null : null;
				setHoveredFace(meshFace);
				updateTargets();
				if (!_hoveredFace || !_isDragging) return;

				// If drag just started and selectSourceModifier is held,
				// select the source face first
				if (start && isModifierActive(selectSourceModifier))
					setSourceFace(_hoveredFace);

				// Apply fill first, if possible
				if (_sourceFace && _targetFaces.length)
					performOperation();

				// Then select source, if needed
				if (isModifierActive(selectSourceModifier))
					setSourceFace(_hoveredFace);

				updateTargets();
			}

			// Must use mousedown to catch the press, not the full click
			/** @param{MouseEvent} event */
			function onMouseDown(event) {
				if (!isToolSelected || event.button !== 0 || !Preview.selected.canvas?.contains(event.target)) return;
				Undo.initEdit({uv_only: true});
				_isDragging = true;
				handleDrag(Preview.selected.raycast(event), true);
			}
			window.addEventListener('mousedown', onMouseDown);
			disposers.push(() => window.removeEventListener('mousedown', onMouseDown));

			/** @param{OutlinerElement} element */
			function addElementToUndo(element) {
				const save = Undo.current_save;
				if (!save.elements || !(element.uuid in save.elements))
					save.addElements([element], {uv_only: true});
			}

			/** @param{MouseEvent} event */
			function onMouseUp(event) {
				if (!isToolSelected || event.button !== 0 || !_isDragging) return;
				_isDragging = false;
				const hasChanges = Undo.current_save.elements && Object.keys(Undo.current_save.elements).length > 0;
				if (hasChanges) Undo.finishEdit('UV Wrap');
				else Undo.cancelEdit(false);
			}
			document.addEventListener('mouseup', onMouseUp);
			disposers.push(() => document.removeEventListener('mouseup', onMouseUp));

			deleteOnUnload(Blockbench.on('update_pressed_modifier_keys', updateTargets));

			// Create Blockbench Tool for toolbar integration and selection blocking
			deleteOnUnload(new Tool("uv_wrapper", {
				name: "UV Wrapper",
				description: "Click and drag across faces to transfer UVs and textures from the source face",
				transformerMode: "hidden",
				icon: "texture",
				category: "tools",
				raycast_options: { edges: false, vertices: false },
				selectFace: false,
				selectElements: false,
				modes: ["edit"],
				allowed_view_modes: ["textured", "uv"],
				keybind: new Keybind({ key: "u", ctrl: true, shift: true }),
				condition: { modes: ["edit"], project: true },
				onSelect() { isToolSelected = true; setSourceFace(); setHoveredFace(); },
				onUnselect() {
					isToolSelected = false;
					setSourceFace();
					setHoveredFace();
					updateOverlay(sourceOverlay);
					updateTargets();
					updateGroupVisibility();
				},
				onCanvasMouseMove(raycast_result) { handleDrag(raycast_result, false) },
			}));


		},
		onunload() {
			faceOverlayGroup.removeFromParent();
			const idx = Canvas.gizmos.indexOf(faceOverlayGroup);
			if (idx !== -1) Canvas.gizmos.splice(idx, 1);
			for (const disposer of disposers.reverse()) disposer();
			disposers.length = 0;
		},
	});
})();
