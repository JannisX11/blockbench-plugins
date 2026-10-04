/** @typedef {import("three")} */
(() => {
	const { Vector2, Vector3, Matrix4 } = THREE;

	const epsilon = 1e-6;

	/** @type {(() => void)[]} */
	const disposers = [];

	/**
	 * @template {{delete: () => void}} TDeletable
	 * @param {TDeletable} deletable
	 * @returns {TDeletable}
	 */
	const deleteOnUnload = deletable => {
		disposers.push(() => deletable.delete());
		return deletable;
	};

	const updateMeshesView = (() => {
		const aspects = { element_aspects: { faces: true, uv: true } };
		return () => {
			aspects.elements = Mesh.selected;
			Canvas.updateView(aspects);
			aspects.elements = null;
		};
	})();


	BBPlugin.register("uv_locker", {
		title: "UV Locker",
		icon: "lock",
		author: "nklbdev",
		description: "Lock UV coordinates when moving vertices in 3D (like Blender's Fix Face Attributes)",
		version: "1.0.0",
		min_version: "5.0.0",
		variant: "both",
		onload() {
			/** @type {Map<MeshFace, Matrix4>} */
			const faceProjections = new Map();

			const lock_uv = deleteOnUnload(new Setting("uv_locker_lock_uv", {
				name: "UV Locker: Lock UV",
				description: "Automatically reproject UVs when moving vertices in 3D, like Blender's Fix Face Attributes.",
				category: "preview", type: "toggle", value: false,
			}));
			Toolbars.main_tools.add(deleteOnUnload(new Toggle("uv_locker_lock_uv_toggle", {
				name: "UV Locker: Lock UV", icon: "lock",
				description: "Automatically reproject UVs when moving vertices in 3D, like Blender's Fix Face Attributes.",
				category: "edit", value: false, linked_setting: lock_uv.id,
			})));

			const exclude_selected_faces = deleteOnUnload(new Setting("uv_locker_exclude_selected_faces", {
				name: "UV Locker: Exclude Selected Faces",
				description: "When active, explicitly selected faces keep their UVs unchanged.",
				category: "preview", type: "toggle", value: false,
			}));
			Toolbars.main_tools.add(deleteOnUnload(new Toggle("uv_locker_exclude_selected_faces_toggle", {
				name: "UV Locker: Exclude Selected Faces", icon: "deselect",
				description: "When active, explicitly selected faces keep their UVs unchanged.",
				category: "edit", value: false, linked_setting: exclude_selected_faces.id,
			})));


			const computeFaceWorldToUv = (() => {
				const ew1 = new Vector3(), ew2 = new Vector3();
				const eu1 = new Vector2(), eu2 = new Vector2();
				const u = new Vector3(), v = new Vector3(), w = new Vector3(), o = new Vector3();
				const pos = [new Vector3(), new Vector3(), new Vector3()];
				const uvs = [new Vector2(), new Vector2(), new Vector2()];
	
				/** @param {MeshFace} face @param {Matrix4} [out] @returns {Matrix4 | null} */
				return (face, out) => {
					const tmesh = face.mesh.mesh;
					if (!tmesh) return null;
					const vertices = face.mesh.vertices;
					const faceUvs = face.uv;
					const keys = face.getSortedVertices();
					if (keys.length < 3) return null;
	
					for (let i = 0; i < 3; i++) {
						tmesh.localToWorld(pos[i].fromArray(vertices[keys[i]]));
						uvs[i].fromArray(faceUvs[keys[i]]);
					}
	
					ew1.subVectors(pos[1], pos[0]); ew2.subVectors(pos[2], pos[0]);
					eu1.subVectors(uvs[1], uvs[0]); eu2.subVectors(uvs[2], uvs[0]);
	
					const det = eu1.x * eu2.y - eu2.x * eu1.y;
					if (Math.abs(det) < epsilon) return null;
	
					u.copy(ew1).multiplyScalar(eu2.y).addScaledVector(ew2, -eu1.y);
					v.copy(ew2).multiplyScalar(eu1.x).addScaledVector(ew1, -eu2.x);
					w.crossVectors(u, v).normalize();
	
					return (out ?? new Matrix4()).makeBasis(u.divideScalar(det), v.divideScalar(det), w)
						.setPosition(o.copy(pos[0]).addScaledVector(u, -uvs[0].x).addScaledVector(v, -uvs[0].y))
						.invert();
				};
			})();

			const reprojectFace = (() => {
				const _v3 = new Vector3();
				return (face, worldToUv) => {
					const tmesh = face.mesh.mesh;
					const vertices = face.mesh.vertices;
					for (const vkey of Object.keys(face.uv)) {
						const pos = vertices[vkey];
						if (!pos) continue;
						tmesh.localToWorld(_v3.fromArray(pos));
						_v3.applyMatrix4(worldToUv);
						const uv = face.uv[vkey];
						if (uv) { uv[0] = _v3.x; uv[1] = _v3.y; }
					}
				};
			})();

			const getAffectedFaces = () => Mesh.selected.flatMap(mesh => {
				const sel = Project.mesh_selection[mesh.uuid];
				if (!sel) return [];
				const { vertices, edges, faces } = sel;
				return Object.entries(mesh.faces)
					.filter(([face_key, face]) => faces.includes(face_key)
						? !exclude_selected_faces?.value
						: face.vertices.some(v => vertices.includes(v) || edges.some(e => e.includes(v))))
					.map(([_, face]) => face);
			});

			let _isGizmoDrag = false;

			deleteOnUnload(Blockbench.on("init_edit", data => {
				if (data.aspects?.uv_only || !_isGizmoDrag && Dialog.open || !lock_uv.value || Modes.id !== "edit") return;
				faceProjections.clear();
				for (const face of getAffectedFaces()) {
					const m = computeFaceWorldToUv(face);
					if (m) faceProjections.set(face, m);
				}
			}));

			deleteOnUnload(Blockbench.on("finished_edit", data => {
				if (data.aspects?.uv_only) return;
				if (!_isGizmoDrag && Dialog.open) return;
				if (!lock_uv.value || Modes.id !== "edit") return;
				if (faceProjections.size === 0) { _isGizmoDrag = false; return; }
				for (const [face, worldToUv] of faceProjections)
					reprojectFace(face, worldToUv);
				updateMeshesView();
				_isGizmoDrag = false;
			}));

			function onTransformStart() {
				if (!lock_uv.value || Modes.id !== "edit") return;
				_isGizmoDrag = true;
				faceProjections.clear();
				for (const face of getAffectedFaces()) {
					const m = computeFaceWorldToUv(face);
					if (m) faceProjections.set(face, m);
				}
			}
			Transformer.addEventListener("mouseDown", onTransformStart);
			disposers.push(() => Transformer.removeEventListener("mouseDown", onTransformStart));

			function onTransformUpdate() {
				if (!lock_uv.value || Modes.id !== "edit") return;
				if (faceProjections.size === 0) return;
				for (const [face, worldToUv] of faceProjections)
					reprojectFace(face, worldToUv);
				updateMeshesView();
			}
			Transformer.addEventListener("objectChange", onTransformUpdate);
			disposers.push(() => Transformer.removeEventListener("objectChange", onTransformUpdate));
		},
		onunload() {
			for (const disposer of disposers.reverse()) disposer();
			disposers.length = 0;
		},
	});
})();
