/*
 * True Mirror — mirror the edit, not the element
 *
 * Mirrors only the change the user actually made, instead of symmetrizing the whole
 * element on every edit. Vertices without a partner are never written to, which is
 * what protects deliberately asymmetric geometry.
 *
 * Supported: move, rotate and scale in any selection mode, and extrude.
 * Not mirrored: loop cut, knife, and face or vertex deletion.
 */
(function () {
	'use strict';

	const ID = 'true_mirror';
	const LOG = '[True Mirror]';

	// Tolerances. Deliberately two separate constants — see notes at the bottom of the file.
	const EPS_PARTNER = 0.001; // max distance for two vertices to count as mirror partners
	const EPS_PLANE = 0.02;    // distance from the mirror plane at which a vertex counts as "on it"
	const EPS_MOVED = 1e-6;    // movement below this is float noise, not an edit

	const AXES = ['x', 'y', 'z'];

	// Mirror plane. GLOBAL puts it at world zero on the axis; LOCAL puts it at the
	// element's own pivot, wherever the element sits in the world.
	const MODE_GLOBAL = 'global';
	const MODE_LOCAL = 'local';

	// ---------------------------------------------------------------- plugin state

	const state = {
		enabled: false,
		axis: 0, // 0 = X, 1 = Y, 2 = Z
		mode: MODE_GLOBAL,
		conflict_reported: false,
		listeners: [],
		bar_items: [],
		menu_entries: [],
		toolbars: [],
		last_idle_reason: null,
		applying: false
	};

	// ---------------------------------------------------------------- small helpers

	function approx(a, b, epsilon) {
		return Math.abs(a - b) < epsilon;
	}

	/*
	 * Where the GLOBAL mirror plane sits on a given axis. Mesh vertices are stored local to
	 * the element origin, so the plane is local 0 provided the origin is on it.
	 *
	 * The 8 applies to X only, and deliberately not to Y or Z.
	 *
	 * It is a Minecraft format convention — those formats place the model in a 0..16 box, so
	 * the model's centre line is at 8 — not a general rule about symmetry. Blockbench itself
	 * only ever mirrors X (`let center = Format.centered_grid ? 0 : 8` in mirror_modeling.ts),
	 * so there is no precedent for what Y or Z should use, and inferring 8 by analogy would be
	 * guessing at a convention that does not exist. Y and Z therefore stay at 0.
	 *
	 * The consequence is deliberate and documented: in a non-centered format, GLOBAL mode on Y
	 * or Z will rarely match where the user's geometry actually is. LOCAL mode covers that case
	 * properly, because it mirrors around the element's own pivot and has no such convention.
	 */
	function mirrorCenter(axis) {
		if (Format.centered_grid) return 0;
		return axis === 0 ? 8 : 0;
	}

	function notify(message) {
		console.warn(`${LOG} ${message}`);
		Blockbench.showQuickMessage(message, 2600);
	}

	function fail(message, detail) {
		console.error(`${LOG} ${message}`, detail !== undefined ? detail : '');
		Blockbench.showQuickMessage(message, 3000);
	}

	// ---------------------------------------------------------------- eligibility

	/**
	 * Returns null if the mesh can be mirrored, otherwise a human-readable reason.
	 *
	 * All the arithmetic downstream of this function already works in element-local
	 * coordinates around local zero, so LOCAL mode is the absence of the checks below
	 * rather than a different code path:
	 *
	 *   GLOBAL — the plane must be world zero on the axis, so local zero has to coincide
	 *            with it. That is what the rotation, origin and parent-chain checks enforce.
	 *   LOCAL  — the plane IS the element's own pivot, in the element's own frame. Where the
	 *            element sits in the world, how it is rotated, and what its ancestors do
	 *            cannot move it relative to the geometry. No check applies at all.
	 *
	 * Rotation is the reason the two differ. Under GLOBAL a rotated element has its local
	 * axis skewed against the world plane, so mirroring would be wrong. Under LOCAL the plane
	 * rotates with the element, so the result is correct in the frame the mode is defined in.
	 */
	function ineligibleReason(mesh, axis, mode) {
		if (mode === MODE_LOCAL) return null;

		if (mesh.rotation && mesh.rotation.some((r) => Math.roundTo(r, 4) !== 0)) {
			return (
				`"${mesh.name}" has a non-zero rotation, so its axes are skewed against the global ` +
				`mirror plane. Switch the plane to Local to mirror rotated elements around their own pivot.`
			);
		}

		const center = mirrorCenter(axis);

		if (!mesh.origin || !approx(mesh.origin[axis], center, EPS_PLANE)) {
			const at = mesh.origin ? mesh.origin[axis] : 'none';
			return (
				`"${mesh.name}" has its origin at ${at} on ${AXES[axis].toUpperCase()}, ` +
				`not on the global mirror plane (${center}). Switch the plane to Local to mirror around its own pivot.`
			);
		}

		// Blockbench itself only inspects the parent chain for bone-rig formats.
		if (Format.bone_rig) {
			let parent = mesh.parent;
			let depth = 0;
			while (parent instanceof OutlinerNode && depth < 50) {
				if (parent.rotation && parent.rotation.some((r) => Math.roundTo(r, 4) !== 0)) {
					return `A parent of "${mesh.name}" is rotated. True Mirror skips rotated hierarchies.`;
				}
				if (parent.origin && !approx(parent.origin[axis], center, EPS_PLANE)) {
					return (
						`A parent of "${mesh.name}" sits off the global mirror plane. ` +
						`Switch the plane to Local to mirror around the element's own pivot.`
					);
				}
				parent = parent.parent;
				depth++;
			}
		}
		return null;
	}

	// ---------------------------------------------------------------- partner table

	/**
	 * Builds vertex-key -> partner-vertex-key for one mesh, from a given vertex table.
	 *
	 * Always built from the PRE-edit state of the current edit rather than cached from
	 * when the mode was switched on. The pre-state is already available for free (see
	 * readPreVertices), and deriving the table from it removes every way the table can
	 * go stale. Bucketed by quantised position so this stays O(n) rather than O(n^2).
	 *
	 * Vertices on the mirror plane get no partner: pairing them with themselves is what
	 * produces duplicate geometry.
	 */
	function buildPartnerTable(vertices, axis) {
		const partners = Object.create(null);
		const bucket_size = EPS_PARTNER * 2;
		const buckets = new Map();

		const bucketKey = (pos, offsets) =>
			pos
				.map((c, i) => Math.round(c / bucket_size) + (offsets ? offsets[i] : 0))
				.join(',');

		const keys = Object.keys(vertices);

		for (const vkey of keys) {
			const key = bucketKey(vertices[vkey]);
			let list = buckets.get(key);
			if (!list) buckets.set(key, (list = []));
			list.push(vkey);
		}

		for (const vkey of keys) {
			if (partners[vkey] !== undefined) continue;

			const pos = vertices[vkey];
			if (Math.abs(pos[axis]) < EPS_PLANE) continue; // on the plane: no partner, by design

			// The position this vertex's partner would occupy.
			const target = pos.slice();
			target[axis] = -target[axis];

			let found;
			// Scan the 27 neighbouring buckets so a match never falls through a boundary.
			for (let dx = -1; dx <= 1 && !found; dx++) {
				for (let dy = -1; dy <= 1 && !found; dy++) {
					for (let dz = -1; dz <= 1 && !found; dz++) {
						const list = buckets.get(bucketKey(target, [dx, dy, dz]));
						if (!list) continue;
						for (const vkey2 of list) {
							if (vkey2 === vkey) continue;
							if (partners[vkey2] !== undefined) continue;
							const p2 = vertices[vkey2];
							const dist = Math.sqrt(
								Math.pow(p2[0] - target[0], 2) +
								Math.pow(p2[1] - target[1], 2) +
								Math.pow(p2[2] - target[2], 2)
							);
							if (dist < EPS_PARTNER) {
								found = vkey2;
								break;
							}
						}
					}
				}
			}

			if (found) {
				partners[vkey] = found;
				partners[found] = vkey;
			}
		}
		return partners;
	}

	/**
	 * Face-level partners, derived from the vertex table rather than matched independently:
	 * a face's partner is the face whose vertex SET is the mirror of this one's. Same shape as
	 * Blockbench's own face-counterpart detection (mirror_modeling.ts:530).
	 *
	 * Must be built from the PRE-edit faces. Extrude retargets the faces it extrudes from
	 * (mesh_editing.js:845), so by the time finish_edit runs, the live faces no longer describe
	 * the symmetry that existed when the user started.
	 */
	function buildFacePartnerTable(pre_faces, partners) {
		const by_vertex_set = new Map();
		const setKey = (vertices) => vertices.slice().sort().join(',');

		for (const fkey in pre_faces) {
			const vertices = pre_faces[fkey].vertices;
			if (vertices) by_vertex_set.set(setKey(vertices), fkey);
		}

		const face_partners = Object.create(null);
		for (const fkey in pre_faces) {
			if (face_partners[fkey] !== undefined) continue;
			const vertices = pre_faces[fkey].vertices;
			if (!vertices || !vertices.length) continue;

			const mirrored = vertices.map((vkey) => partners[vkey]);
			if (mirrored.some((vkey) => !vkey)) continue; // touches unpaired geometry: no face partner

			const other = by_vertex_set.get(setKey(mirrored));
			if (other && other !== fkey) {
				face_partners[fkey] = other;
				face_partners[other] = fkey;
			}
		}
		return face_partners;
	}

	// ---------------------------------------------------------------- pre-edit state

	/**
	 * The undo system already deep-copies every vertex position in initEdit
	 * (Mesh.getUndoCopy -> el.vertices[key] = this.vertices[key].slice()), so the
	 * pre-edit table is read straight out of Undo.current_save. No separate snapshot
	 * mechanism is needed.
	 *
	 * Returns null when the pre-state is unusable, with the reason logged.
	 */
	function readPreVertices(mesh) {
		const save = Undo.current_save;
		if (!save || !save.elements) return null;

		const entry = save.elements[mesh.uuid];
		if (!entry) return null;

		// getUndoCopy omits vertices entirely for UV-only edits.
		if (!entry.vertices) return null;

		return entry.vertices;
	}

	/**
	 * Pre-edit faces. getUndoCopy serialises them alongside vertices and outside the uv_only
	 * guard (mesh.js:607), and Face.getUndoCopy runs extend(this), so each copy carries
	 * `vertices` and `uv`. That gives the plugin the pre-edit TOPOLOGY, not just positions.
	 */
	function readPreFaces(mesh) {
		const save = Undo.current_save;
		if (!save || !save.elements) return null;
		const entry = save.elements[mesh.uuid];
		return (entry && entry.faces) || null;
	}

	// ---------------------------------------------------------------- topology (extrude)

	/**
	 * Three-way topology diff against the pre-edit state.
	 *
	 * `changed` matters as much as `added`: extrude does not leave the original faces alone, it
	 * RETARGETS them onto the newly created vertices (mesh_editing.js:845). A diff that only
	 * looked at additions would mirror the new side walls but leave the partner's cap facing the
	 * old vertices — subtly wrong geometry rather than an obvious failure.
	 */
	function diffTopology(mesh, pre_vertices, pre_faces) {
		const new_vertices = [];
		for (const vkey in mesh.vertices) {
			if (!pre_vertices[vkey]) new_vertices.push(vkey);
		}

		const new_faces = [];
		const changed_faces = [];
		for (const fkey in mesh.faces) {
			const before = pre_faces[fkey];
			if (!before) {
				new_faces.push(fkey);
			} else if (
				!before.vertices ||
				before.vertices.length !== mesh.faces[fkey].vertices.length ||
				mesh.faces[fkey].vertices.some((vkey, i) => before.vertices[i] !== vkey)
			) {
				changed_faces.push(fkey);
			}
		}
		return { new_vertices, new_faces, changed_faces };
	}

	/**
	 * Only extrusions that stay on one side of the mirror plane are mirrored. Anything landing on
	 * or across the plane would need the seam vertices welded together to avoid duplicate
	 * geometry, which this plugin does not do. Refuse the whole edit rather than half-do it.
	 *
	 * Returns a reason string, or null if the extrusion is safe to mirror.
	 */
	function crossingReason(mesh, pre_vertices, diff, axis) {
		const letter = AXES[axis].toUpperCase();
		const sides = new Set();

		for (const vkey of diff.new_vertices) {
			const c = mesh.vertices[vkey][axis];
			if (Math.abs(c) < EPS_PLANE) {
				return (
					`the extrusion put new geometry ON the ${letter} mirror plane. Mirroring it would ` +
					`leave duplicate vertices at the seam, which this plugin cannot weld together`
				);
			}
			sides.add(Math.sign(c));
		}
		if (sides.size > 1) {
			return (
				`the extrusion spans the ${letter} mirror plane — new geometry landed on both sides, ` +
				`so mirroring it would collide with itself`
			);
		}

		// Which side did the geometry it grew from sit on? An extrusion that ends up opposite its
		// own source has crossed the plane, even though all its new vertices share one side.
		const source_sides = new Set();
		for (const fkey of diff.new_faces.concat(diff.changed_faces)) {
			for (const vkey of mesh.faces[fkey].vertices) {
				const before = pre_vertices[vkey];
				if (!before) continue;
				if (Math.abs(before[axis]) < EPS_PLANE) continue; // on the plane: no side
				source_sides.add(Math.sign(before[axis]));
			}
		}
		if (sides.size === 1 && source_sides.size === 1) {
			const [to] = [...sides];
			const [from] = [...source_sides];
			if (to !== from) {
				return (
					`the extrusion crossed the ${letter} mirror plane — it started on one side and ` +
					`ended on the other, so mirroring it would collide with the original`
				);
			}
		}
		return null;
	}

	/** The first existing vertex within EPS_PARTNER of `target`, or undefined. */
	function findVertexAt(mesh, target) {
		for (const vkey in mesh.vertices) {
			const p = mesh.vertices[vkey];
			const dx = p[0] - target[0];
			const dy = p[1] - target[1];
			const dz = p[2] - target[2];
			if (Math.sqrt(dx * dx + dy * dy + dz * dz) < EPS_PARTNER) return vkey;
		}
		return undefined;
	}

	/**
	 * Builds a mirrored copy of `source` onto `mapped` vertex keys.
	 *
	 * Winding is inverted because mirroring reverses orientation — without it the mirrored faces
	 * are backwards and light incorrectly. Same treatment Blockbench applies to its own mirrored
	 * faces (mirror_modeling.ts:667). UVs are copied straight from the source face per key: UV
	 * mirroring is deliberately out of scope, so the mirrored face wears the original's UVs.
	 */
	function buildMirroredFace(mesh, source, combined) {
		const face = new MeshFace(mesh, source);
		source.vertices.forEach((vkey, i) => {
			const mapped = combined(vkey);
			face.vertices.splice(i, 1, mapped);
			delete face.uv[vkey];
			if (source.uv && source.uv[vkey]) face.uv[mapped] = source.uv[vkey].slice();
		});
		face.invert();
		return face;
	}

	/**
	 * Mirrors an edit that changed topology — the extrude case.
	 *
	 * Mirrors the RESULT, not the operation. Blockbench's extrude is a local closure inside the
	 * action's click handler (mesh_editing.js:703): unreachable from a plugin, and it runs its
	 * own Undo.initEdit/finishEdit plus an amendEdit dialog, so invoking it from inside
	 * finish_edit would corrupt the user's undo entry. The geometry it produced is already
	 * present, so the plugin mirrors that instead — and creates nothing via Undo, so there is no
	 * nested edit and nothing to recurse into.
	 */
	function mirrorTopology(mesh, pre_vertices, pre_faces, diff, axis) {
		const refusal = crossingReason(mesh, pre_vertices, diff, axis);
		if (refusal) {
			notify(`True Mirror: nothing mirrored in "${mesh.name}" — ${refusal}.`);
			return false;
		}

		const partners = buildPartnerTable(pre_vertices, axis);
		const face_partners = buildFacePartnerTable(pre_faces, partners);
		const new_partner = Object.create(null);

		// Mirror each new vertex, reusing a vertex that already sits at the mirrored position
		// rather than stacking a duplicate on top of it.
		for (const vkey of diff.new_vertices) {
			const p = mesh.vertices[vkey];
			const target = p.slice();
			target[axis] = -target[axis];
			const existing = findVertexAt(mesh, target);
			new_partner[vkey] = existing || mesh.addVertices(target)[0];
		}

		const combined = (vkey) => new_partner[vkey] || partners[vkey];

		let faces_added = 0;
		let faces_retargeted = 0;
		let skipped_unpaired = 0;

		// New faces -> mirrored copies.
		for (const fkey of diff.new_faces) {
			const source = mesh.faces[fkey];
			if (source.vertices.some((vkey) => !combined(vkey))) {
				skipped_unpaired++;
				continue; // reaches into geometry with no partner: leave it alone
			}
			mesh.addFaces(buildMirroredFace(mesh, source, combined));
			faces_added++;
		}

		// Changed faces -> retarget the partner face the same way.
		for (const fkey of diff.changed_faces) {
			const pfkey = face_partners[fkey];
			const partner = pfkey && mesh.faces[pfkey];
			if (!partner) {
				skipped_unpaired++;
				continue;
			}
			const source = mesh.faces[fkey];
			if (source.vertices.some((vkey) => !combined(vkey))) {
				skipped_unpaired++;
				continue;
			}
			const rebuilt = buildMirroredFace(mesh, source, combined);
			partner.vertices.replace
				? partner.vertices.replace(rebuilt.vertices)
				: (partner.vertices = rebuilt.vertices.slice());
			partner.uv = rebuilt.uv;
			faces_retargeted++;
		}

		console.log(
			`${LOG} "${mesh.name}": topology edit — ${diff.new_vertices.length} new vertices mirrored, ` +
			`${faces_added} faces added, ${faces_retargeted} partner faces retargeted, ${skipped_unpaired} skipped (unpaired).`
		);

		if (!faces_added && !faces_retargeted && diff.new_vertices.length) {
			notify(
				`True Mirror: "${mesh.name}" grew new geometry but none of it had a mirror partner, ` +
				`so nothing was mirrored.`
			);
		}
		return faces_added > 0 || faces_retargeted > 0;
	}

	// ---------------------------------------------------------------- snap to centre

	/**
	 * Port of the built-in "mirror modeling: Snap to middle to connect" helper
	 * (moveElementsInSpace in js/modeling/transform.js), generalised to the selected axis.
	 *
	 * The original runs per drag-step and is gated on the built-in toggle. This runs once,
	 * on finish_edit, so the snap lands on mouse-release rather than visibly mid-drag.
	 *
	 * Mutates mesh.vertices. Returns the set of vertex keys that were snapped.
	 */
	function applySnapToCenter(mesh, pre, moved_keys, axis) {
		const snapped = new Set();
		if (!moved_keys.length) return snapped;

		const first_post = mesh.vertices[moved_keys[0]][axis];

		for (const vkey of moved_keys) {
			const pre_c = pre[vkey][axis];
			const post_c = mesh.vertices[vkey][axis];

			// Every moved vertex must share one coordinate on the mirror axis...
			if (!approx(post_c, first_post, EPS_PLANE)) return snapped;
			// ...and the movement must actually have crossed the plane.
			if (pre_c === 0 || post_c === 0) return snapped;
			if (Math.sign(pre_c) === Math.sign(post_c)) return snapped;
		}

		for (const vkey of moved_keys) {
			mesh.vertices[vkey][axis] = 0;
			snapped.add(vkey);
		}
		console.log(`${LOG} Snapped ${snapped.size} vertex/vertices to the mirror plane.`);
		return snapped;
	}

	// ---------------------------------------------------------------- the core

	/**
	 * Diffs one mesh and writes the mirrored delta to partner vertices.
	 *
	 * The partner's new position is built from the partner's OWN pre-edit position plus a
	 * mirrored delta — never from the moved vertex's position. Any asymmetry the partner
	 * already carried survives by arithmetic rather than by a special case. That is the
	 * whole reason this plugin exists.
	 */
	function mirrorEdit(mesh, axis, mode) {
		const pre = readPreVertices(mesh);
		if (!pre) {
			console.log(`${LOG} No usable pre-edit state for "${mesh.name}" — skipping.`);
			return false;
		}

		const reason = ineligibleReason(mesh, axis, mode);
		if (reason) {
			notify(reason);
			return false;
		}

		// --- 0. topology edits take a different path entirely.
		// Extrude adds vertices rather than moving existing ones, so the position diff below
		// would find nothing to do and silently no-op.
		const pre_faces = readPreFaces(mesh);
		if (pre_faces) {
			const diff = diffTopology(mesh, pre, pre_faces);
			if (diff.new_vertices.length || diff.new_faces.length || diff.changed_faces.length) {
				return mirrorTopology(mesh, pre, pre_faces, diff, axis);
			}
		}

		// --- 1. work out what the user moved
		const moved_keys = [];
		const deltas = Object.create(null);

		for (const vkey in mesh.vertices) {
			const before = pre[vkey];
			if (!before) continue; // added by this edit; handled by the topology path above
			const after = mesh.vertices[vkey];
			const d = [after[0] - before[0], after[1] - before[1], after[2] - before[2]];
			if (Math.abs(d[0]) > EPS_MOVED || Math.abs(d[1]) > EPS_MOVED || Math.abs(d[2]) > EPS_MOVED) {
				moved_keys.push(vkey);
				deltas[vkey] = d;
			}
		}

		if (!moved_keys.length) return false;

		// --- 2. refuse rigid transforms of the whole element
		// Every vertex moved by one identical delta means the element was moved, rotated or
		// scaled as a body. Mirroring that delta would cancel the user's own movement, so
		// the plugin stays out of the way. Documented limitation.
		const pre_count = Object.keys(pre).length;
		const post_count = Object.keys(mesh.vertices).length;
		if (moved_keys.length === post_count && post_count === pre_count && post_count > 1) {
			const d0 = deltas[moved_keys[0]];
			const uniform = moved_keys.every((vkey) => {
				const d = deltas[vkey];
				return (
					Math.abs(d[0] - d0[0]) < EPS_MOVED &&
					Math.abs(d[1] - d0[1]) < EPS_MOVED &&
					Math.abs(d[2] - d0[2]) < EPS_MOVED
				);
			});
			if (uniform) {
				console.log(
					`${LOG} "${mesh.name}": rigid transform of the whole element (every vertex moved by the same delta). ` +
					`Nothing mirrored — mirroring a rigid move would cancel it. This is a documented limitation.`
				);
				return false;
			}
		}

		// --- 3. snap to the mirror plane if the move crossed it
		const snapped = applySnapToCenter(mesh, pre, moved_keys, axis);
		if (snapped.size) {
			// Snapped vertices now sit ON the plane, so they drop out of mirroring below by
			// the same rule that excludes any on-plane vertex. Their partners stay put — which
			// is what welds a half-model to the centre line without duplicating geometry.
			for (const vkey of snapped) {
				const after = mesh.vertices[vkey];
				const before = pre[vkey];
				deltas[vkey] = [after[0] - before[0], after[1] - before[1], after[2] - before[2]];
			}
		}

		// --- 4. mirror the delta onto partners
		const partners = buildPartnerTable(pre, axis);
		const moved_set = new Set(moved_keys);
		let written = 0;
		let skipped_both_moved = 0;
		let skipped_unpaired = 0;

		for (const vkey of moved_keys) {
			// On-plane vertices — before or after — never mirror. Checking both catches the
			// snap case, where the table was built from a pre-state that still had a partner.
			if (Math.abs(pre[vkey][axis]) < EPS_PLANE) continue;
			if (Math.abs(mesh.vertices[vkey][axis]) < EPS_PLANE) continue;

			const pkey = partners[vkey];
			if (!pkey) {
				skipped_unpaired++;
				continue; // asymmetric geometry: never touched
			}
			if (!mesh.vertices[pkey] || !pre[pkey]) continue;
			if (Math.abs(pre[pkey][axis]) < EPS_PLANE) continue;

			// Both sides moved deliberately — the user placed them, so leave them alone.
			if (moved_set.has(pkey)) {
				skipped_both_moved++;
				continue;
			}

			const d = deltas[vkey];
			const before = pre[pkey];
			const target = [before[0] + d[0], before[1] + d[1], before[2] + d[2]];
			target[axis] = before[axis] - d[axis]; // the mirror: negate on the mirror axis only

			mesh.vertices[pkey][0] = target[0];
			mesh.vertices[pkey][1] = target[1];
			mesh.vertices[pkey][2] = target[2];
			written++;
		}

		console.log(
			`${LOG} "${mesh.name}": ${moved_keys.length} moved, ${written} mirrored, ` +
			`${skipped_unpaired} unpaired (left alone), ${skipped_both_moved} moved on both sides.`
		);

		// Nothing paired at all. Global mode explains its own precondition up front; Local mode
		// has no precondition to fail, so without this it just does nothing and reads as broken.
		if (mode === MODE_LOCAL && written === 0 && !snapped.size && skipped_unpaired > 0 && !skipped_both_moved) {
			explainNoPairs(mesh, pre, axis);
		}

		// The caller refreshes geometry via Canvas.updateView once for all changed meshes.
		return written > 0 || snapped.size > 0;
	}

	/**
	 * Local mode mirrors around local zero, which is the pivot. If the pivot is not centred on
	 * the mirror axis relative to the geometry, no vertex has a partner and nothing happens.
	 *
	 * This diagnoses that case and says so. It never refuses the edit — an off-centre pivot is a
	 * legitimate way to ask for an asymmetric mirror plane. The point is only that silence is
	 * indistinguishable from the plugin being broken.
	 *
	 * Only the mirror axis is examined. Where the pivot sits on the other two axes has no bearing
	 * on pairing whatsoever, and the message must not suggest otherwise.
	 */
	function explainNoPairs(mesh, pre, axis) {
		const letter = AXES[axis].toUpperCase();

		let min = Infinity;
		let max = -Infinity;
		for (const vkey in pre) {
			const c = pre[vkey][axis];
			if (c < min) min = c;
			if (c > max) max = c;
		}
		if (!isFinite(min)) return;

		// Midpoint of the geometry's span on the mirror axis, measured from the pivot at zero.
		// Zero means the pivot is centred on that axis; anything else is the offset to correct.
		const offset = (min + max) / 2;

		if (Math.abs(offset) > EPS_PLANE) {
			notify(
				`True Mirror: nothing to mirror in "${mesh.name}". Its geometry spans ` +
				`${min.toFixed(2)} to ${max.toFixed(2)} on ${letter}, centred ${offset.toFixed(2)} away from the pivot, ` +
				`so no vertex has a partner. Centre the pivot on the ${letter} axis to fix this — ` +
				`its position on the other axes does not matter.`
			);
		} else {
			notify(
				`True Mirror: nothing to mirror in "${mesh.name}". Its pivot is centred on ${letter}, ` +
				`but the geometry itself is not symmetric across it, so no vertex has a partner.`
			);
		}
	}

	// ---------------------------------------------------------------- the hook

	/*
	 * Undo.finishEdit dispatches 'finish_edit' BEFORE it captures the post-edit save
	 * (js/undo.js:39 dispatches, :42 builds `post`). Anything written to the mesh from
	 * this handler therefore lands inside the same undo entry, and one Ctrl+Z reverts
	 * both the user's change and the mirrored one. No extra work is needed for that.
	 */
	/*
	 * Every one of these exits used to be a bare `return`, so an inactive plugin and a broken
	 * one looked identical: nothing on screen, nothing in the console. Each now reports why,
	 * once per distinct reason, so a "it stopped working" costs one glance instead of a round trip.
	 */
	function idleReason(aspects) {
		if (state.applying) return null; // our own writes; guarded below, never reported as idle
		if (aspects && aspects.true_mirror === false) return null; // explicit opt-out, like aspects.mirror_modeling
		if (!state.enabled) return 'the toggle is off (Tools menu -> True Mirror)';
		if (!Modes.edit) return `Blockbench is in ${Modes.selected ? Modes.selected.id : 'another'} mode, not Edit mode`;
		if (!aspects || !aspects.elements || !aspects.elements.length) return null; // not an element edit; normal
		if (!Undo.current_save) return 'the undo system had no pre-edit state for this edit';
		if (BarItems.mirror_modeling && BarItems.mirror_modeling.value) return 'BUILTIN_CONFLICT';
		if (!aspects.elements.some((el) => el instanceof Mesh)) return null; // cubes etc; normal
		if (!aspects.elements.some((el) => el instanceof Mesh && !el.locked)) return 'every selected mesh is locked';
		return null;
	}

	function reportIdle(reason) {
		if (reason === state.last_idle_reason) return;
		state.last_idle_reason = reason;
		console.warn(`${LOG} did nothing: ${reason}.`);
	}

	function onFinishEdit({ aspects }) {
		// Direct construction means no nested Undo.initEdit/finishEdit, so nothing should
		// re-enter here. Cheap insurance in case a future path does, and the shape Blockbench
		// itself uses to opt an edit out (aspects.mirror_modeling, mirror_modeling.ts:279).
		if (state.applying) return;
		if (aspects && aspects.true_mirror === false) return;

		try {
			const reason = idleReason(aspects);
			if (reason === 'BUILTIN_CONFLICT') {
				// The built-in registers its own 'finish_edit' listener at boot, and listeners run
				// in registration order, so it has already deleted and rebuilt half the mesh before
				// this handler sees it. Diffing against that is worse than doing nothing.
				reportConflict();
				return;
			}
			if (reason) {
				reportIdle(reason);
				return;
			}
			if (!aspects || !aspects.elements) return;

			const meshes = aspects.elements.filter((el) => el instanceof Mesh && !el.locked);
			if (!meshes.length) return;

			state.last_idle_reason = null;
			const axis = state.axis;
			const mode = state.mode;

			let changed = false;
			state.applying = true;
			try {
				for (const mesh of meshes) {
					if (mirrorEdit(mesh, axis, mode)) changed = true;
				}
			} finally {
				state.applying = false;
			}
			if (changed) {
				Canvas.updateView({
					elements: meshes,
					element_aspects: { geometry: true, faces: true, uv: true }
				});
			}
			// Geometry moved, so the plane's size — and an element's eligibility — may have changed.
			refreshOverlay();
		} catch (err) {
			fail('True Mirror failed on this edit — the model may be half-mirrored. See the console.', err);
		}
	}

	/**
	 * Prints everything that decides whether the plugin acts. Run `TrueMirror.status()` in the
	 * DevTools console (F12) when it appears to be doing nothing.
	 */
	function status() {
		const selected = (typeof Mesh !== 'undefined' && Mesh.selected) || [];
		const lines = [
			`hook registered: ${state.listeners.length > 0}`,
			`toggle enabled:  ${state.enabled}`,
			`mirror axis:     ${AXES[state.axis].toUpperCase()}`,
			`mirror plane:    ${state.mode}`,
			`Blockbench mode: ${typeof Modes !== 'undefined' && Modes.selected ? Modes.selected.id : 'unknown'}`,
			`built-in Mirror Modeling on: ${!!(BarItems.mirror_modeling && BarItems.mirror_modeling.value)}` +
				(BarItems.mirror_modeling && BarItems.mirror_modeling.value ? '   <-- this alone makes the plugin no-op' : ''),
			`selected meshes: ${selected.length}`
		];
		for (const mesh of selected) {
			const why = ineligibleReason(mesh, state.axis, state.mode);
			lines.push(`  - "${mesh.name}": ${why ? 'SKIPPED — ' + why : 'eligible'}`);
		}
		console.log(`${LOG} status\n` + lines.join('\n'));
		return lines;
	}

	function reportConflict() {
		const message =
			"True Mirror did nothing: Blockbench's built-in Mirror Modeling is switched on. " +
			'Turn the built-in Mirror Modeling off, then use True Mirror.';
		console.error(`${LOG} ${message}`);
		Blockbench.showQuickMessage('True Mirror is inactive: turn off built-in Mirror Modeling', 3000);
		if (!state.conflict_reported) {
			state.conflict_reported = true;
			Blockbench.showMessageBox({
				icon: 'warning',
				title: 'True Mirror',
				message:
					message +
					'\n\nThe built-in feature rebuilds the whole element before True Mirror can see the edit, ' +
					'so running both at once would produce meaningless results. True Mirror stays inactive ' +
					'until the built-in is off.'
			});
		}
	}

	// ---------------------------------------------------------------- plane overlay

	/*
	 * A semi-transparent quad drawn at the active mirror plane.
	 *
	 * It is a CHILD of `element.mesh`, and that one decision buys three of the requirements
	 * outright rather than by computing anything:
	 *
	 *   pivot + rotation   NodePreviewController.updateTransform sets mesh.position to the
	 *                      element's origin and mesh.rotation to its rotation
	 *                      (js/outliner/outliner.js:294). A child at local zero is therefore
	 *                      already at the pivot and already rotates with the element.
	 *   not raycastable    Preview.raycast collects candidates explicitly and calls
	 *                      intersectObjects(objects, false) — non-recursive
	 *                      (js/preview/preview.js:470). Children of element.mesh are never
	 *                      hit-tested, so the guide cannot be clicked.
	 *   Global vs Local    Global only ever runs on elements whose origin is ON the plane and
	 *                      whose rotation is zero — that is its eligibility precondition. For
	 *                      those, local zero IS world centre and the same child plane is
	 *                      correct. One code path covers both modes.
	 *
	 * Following the outline / vertex_points pattern in the Mesh preview controller
	 * (js/outliner/types/mesh.js:1109) for `no_export` and parenting.
	 */
	const OVERLAY_COLOR = 0x3a9dff;
	const OVERLAY_OPACITY = 0.16;
	const OVERLAY_SIZE_FACTOR = 1.5;
	const OVERLAY_MIN_SIZE = 1;

	const overlay = { planes: new Map() };

	/** Square, sized from the element's own extent on the two axes the plane spans. */
	function planeSizeFor(mesh, axis) {
		const b = (axis + 1) % 3;
		const c = (axis + 2) % 3;
		let extent = 0;
		for (const vkey in mesh.vertices) {
			const v = mesh.vertices[vkey];
			extent = Math.max(extent, Math.abs(v[b]), Math.abs(v[c]));
		}
		return Math.max(OVERLAY_MIN_SIZE, extent * 2 * OVERLAY_SIZE_FACTOR);
	}

	function createPlane(element, axis) {
		const size = planeSizeFor(element, axis);
		const geometry = new THREE.PlaneGeometry(size, size);

		const material = new THREE.MeshBasicMaterial({
			color: OVERLAY_COLOR,
			transparent: true,
			opacity: OVERLAY_OPACITY,
			side: THREE.DoubleSide,
			// The plane sits exactly on geometry at the mirror seam. depthWrite:false stops it
			// occluding the model; the polygon offset stops coincident faces z-fighting with it.
			depthWrite: false,
			polygonOffset: true,
			polygonOffsetFactor: -1,
			polygonOffsetUnits: -1
		});

		const plane = new THREE.Mesh(geometry, material);
		plane.name = `true_mirror_plane_${element.uuid}`;
		plane.no_export = true;
		plane.renderOrder = 3;
		plane.frustumCulled = false;

		// PlaneGeometry faces +Z. Turn it so its normal is the mirror axis.
		if (axis === 0) plane.rotation.y = Math.PI / 2;
		else if (axis === 1) plane.rotation.x = Math.PI / 2;

		// Edge-on, a flat quad disappears entirely — which is exactly the viewing angle you use
		// when lining something up against the plane. The border keeps it readable there.
		const border = new THREE.LineSegments(
			new THREE.EdgesGeometry(geometry),
			new THREE.LineBasicMaterial({ color: OVERLAY_COLOR, transparent: true, opacity: 0.5, depthWrite: false })
		);
		border.no_export = true;
		border.renderOrder = 4;
		border.frustumCulled = false;
		plane.add(border);
		plane.border = border;

		element.mesh.add(plane);
		if (Canvas.gizmos) Canvas.gizmos.push(plane); // excluded from screenshots, like every other guide
		return plane;
	}

	function disposePlane(plane) {
		if (plane.border) {
			plane.border.geometry.dispose();
			plane.border.material.dispose();
			plane.remove(plane.border);
		}
		if (plane.parent) plane.parent.remove(plane);
		plane.geometry.dispose();
		plane.material.dispose();
		if (Canvas.gizmos) {
			const i = Canvas.gizmos.indexOf(plane);
			if (i !== -1) Canvas.gizmos.splice(i, 1);
		}
	}

	function clearOverlay() {
		for (const plane of overlay.planes.values()) disposePlane(plane);
		overlay.planes.clear();
	}

	/**
	 * Rebuilds the overlay from scratch. Cheap — it only ever covers the selected meshes — and
	 * rebuilding avoids a whole class of stale-transform bugs that incremental updates invite.
	 *
	 * An ineligible element deliberately gets NO plane. Absence then means "mirroring will not
	 * happen here", which is the same thing the console message says, shown where the user is
	 * already looking.
	 */
	function refreshOverlay() {
		try {
			if (typeof THREE === 'undefined' || typeof Canvas === 'undefined') return;
			clearOverlay();

			if (!state.enabled) return;
			if (typeof Modes === 'undefined' || !Modes.edit) return;
			if (BarItems.mirror_modeling && BarItems.mirror_modeling.value) return;

			const selected = (typeof Mesh !== 'undefined' && Mesh.selected) || [];
			for (const element of selected) {
				if (!element.mesh) continue;
				if (ineligibleReason(element, state.axis, state.mode)) continue;
				overlay.planes.set(element.uuid, createPlane(element, state.axis));
			}
		} catch (err) {
			fail('True Mirror: the mirror-plane overlay failed. Mirroring is unaffected.', err);
		}
	}

	// ---------------------------------------------------------------- UI

	function buildUI() {
		const toggle = new Toggle('true_mirror_enabled', {
			name: 'True Mirror',
			description: 'Mirror only the edit you just made, leaving asymmetric geometry alone',
			icon: 'flip',
			category: 'edit',
			condition: { modes: ['edit'] },
			onChange(value) {
				state.enabled = value;
				refreshOverlay();
				console.log(
					`${LOG} ${value ? 'enabled' : 'disabled'} — axis ${AXES[state.axis].toUpperCase()}, plane ${state.mode}`
				);
				if (value && BarItems.mirror_modeling && BarItems.mirror_modeling.value) {
					reportConflict();
				}
			}
		});

		/*
		 * A real select in the toolbar, not a click-to-open popup: BarSelect.set() writes the
		 * active option's name straight into the widget's node (js/interface/actions.ts:1878),
		 * so the current axis is legible in the bar without any interaction. Same component
		 * the built-in `selection_mode` uses.
		 */
		const axis_select = new BarSelect('true_mirror_axis', {
			name: 'True Mirror Axis',
			description: 'Plane that True Mirror mirrors across',
			category: 'edit',
			condition: { modes: ['edit'] },
			value: AXES[state.axis],
			options: {
				x: { name: 'Mirror: X' },
				y: { name: 'Mirror: Y' },
				z: { name: 'Mirror: Z' }
			},
			onChange(select) {
				const index = AXES.indexOf(select.value);
				if (index === -1) {
					fail(`True Mirror: unknown axis "${select.value}" — keeping ${AXES[state.axis].toUpperCase()}.`);
					return;
				}
				state.axis = index;
				refreshOverlay();
				console.log(`${LOG} mirror axis set to ${AXES[index].toUpperCase()}`);
			}
		});

		/*
		 * Kept as a second select rather than folded into the axis one. Three axes times two
		 * planes is six combined options, which reads as a list to decode instead of two
		 * independent settings to glance at — and the bar has room for both.
		 */
		const mode_select = new BarSelect('true_mirror_plane', {
			name: 'True Mirror Plane',
			description: 'Mirror around world zero, or around the element\'s own pivot',
			category: 'edit',
			condition: { modes: ['edit'] },
			value: state.mode,
			options: {
				[MODE_GLOBAL]: { name: 'Plane: Global' },
				[MODE_LOCAL]: { name: 'Plane: Local' }
			},
			onChange(select) {
				if (select.value !== MODE_GLOBAL && select.value !== MODE_LOCAL) {
					fail(`True Mirror: unknown plane mode "${select.value}" — keeping ${state.mode}.`);
					return;
				}
				state.mode = select.value;
				refreshOverlay();
				console.log(`${LOG} mirror plane set to ${state.mode}`);
			}
		});

		state.bar_items.push(toggle, axis_select, mode_select);

		// BarItem.delete() removes the item from toolbars and keybinds but NOT from menus
		// (js/interface/actions.ts:291), so the menu entry is torn down separately.
		// BarMenu.removeAction takes the Action itself; MenuBar.removeAction only takes a
		// string path, which will not match an entry stored by reference.
		const tools_menu = MenuBar.menus.tools;
		if (tools_menu) {
			MenuBar.addAction(toggle, 'tools');
			state.menu_entries.push([tools_menu, toggle]);
		} else {
			fail('True Mirror could not find the Tools menu — use the Keybindings settings to reach the toggle.');
		}

		/*
		 * A BarSelect only renders on a toolbar, so it needs a default home. main_tools already
		 * hosts `selection_mode` and the built-in `mirror_modeling`, which makes it the right
		 * bar for this. Toolbar.add() persists the layout, and the matching remove() in
		 * onunload persists the removal, so no ghost entry is left behind.
		 */
		const bar = Toolbars && Toolbars.main_tools;
		if (bar) {
			const anchor = bar.children.findIndex(
				(child) => child === 'selection_mode' || (child && child.id === 'selection_mode')
			);
			bar.add(axis_select, anchor === -1 ? undefined : anchor + 1);
			// Placed after the axis select so the two read left-to-right as "Mirror: X | Plane: Global".
			const axis_at = bar.children.indexOf(axis_select);
			bar.add(mode_select, axis_at === -1 ? undefined : axis_at + 1);
			state.toolbars.push([bar, axis_select], [bar, mode_select]);
		} else {
			fail(
				'True Mirror could not find the main tools toolbar — add "True Mirror Axis" and ' +
				'"True Mirror Plane" via toolbar customization.'
			);
		}
	}

	// ---------------------------------------------------------------- registration

	Plugin.register(ID, {
		title: 'True Mirror',
		author: 'Kegoscho',
		description:
			'Mirrors only the change you actually made, instead of symmetrizing the whole element. ' +
			'Asymmetric detail survives unrelated mirrored edits. Move, rotate, scale and extrude, ' +
			'across any axis and around either world zero or the element\'s own pivot.',
		icon: 'icon.svg',
		version: '1.0.0',
		variant: 'both',
		tags: ['Edit', 'Meshes', 'Mirror'],
		/*
		 * Verified against the Blockbench source at tag v5.1.0 — not estimated. Every API this
		 * depends on exists there, and so does every behaviour it depends on: 'finish_edit'
		 * dispatched before the post-edit save is taken, Mesh.getUndoCopy serialising faces
		 * alongside vertices, Mesh.extend deleting vertices and faces absent from a restored
		 * save, and Preview.raycast intersecting non-recursively. Nothing below 5.1.0 has been
		 * checked, so nothing below it is claimed.
		 */
		min_version: '5.1.0',
		creation_date: '2026-08-04',
		new_repository_format: true,
		// Gates the Changelog tab in the plugin browser, which renders only when this is true
		// (plugin_loader.ts:1715). Shipping changelog.json alone does not surface it.
		has_changelog: true,
		// Source repository and issue tracker, shown in the plugin browser.
		repository: 'https://github.com/Kegoscho/true-mirror',
		bug_tracker: 'https://github.com/Kegoscho/true-mirror/issues',

		onload() {
			state.enabled = false;
			state.axis = 0;
			state.mode = MODE_GLOBAL;
			state.conflict_reported = false;
			state.last_idle_reason = null;
			state.applying = false;

			// The hook goes on FIRST. It used to be registered after buildUI(), which meant any
			// throw while constructing the UI took the whole plugin down silently — Blockbench
			// swallows plugin load errors, so it looked loaded and did nothing in every mode.
			// The mirroring must not depend on a toolbar accepting a widget.
			state.listeners.push(Blockbench.on('finish_edit', onFinishEdit));
			// Which elements are selected decides which of them get a plane.
			state.listeners.push(Blockbench.on('update_selection', refreshOverlay));

			try {
				buildUI();
			} catch (err) {
				fail('True Mirror: the UI failed to build. Mirroring still works — see the console.', err);
			}

			window.TrueMirror = { status, state };
			console.log(
				`${LOG} loaded. Toggle: Tools menu. Axis + plane selectors: main tools toolbar.\n` +
				`${LOG} If it appears to do nothing, run TrueMirror.status() in this console.`
			);
		},

		onunload() {
			state.listeners.forEach((listener) => listener.delete());
			state.listeners.length = 0;

			state.menu_entries.forEach(([menu, action]) => menu.removeAction(action));
			state.menu_entries.length = 0;

			// Explicit, so the toolbar layout is re-saved without this item rather than
			// relying on BarItem.delete()'s internal sweep.
			state.toolbars.forEach(([bar, item]) => bar.remove(item));
			state.toolbars.length = 0;

			state.bar_items.forEach((item) => item.delete());
			state.bar_items.length = 0;

			clearOverlay();
			state.enabled = false;
			// Reset every flag, not just the visible ones. `applying` is the important one: it is
			// set outside onload, so a stale `true` would survive a reinstall and leave the
			// reloaded plugin permanently inert. try/finally means it cannot leak in practice.
			state.applying = false;
			state.last_idle_reason = null;
			state.conflict_reported = false;
			if (window.TrueMirror && window.TrueMirror.state === state) delete window.TrueMirror;
			console.log(`${LOG} unloaded.`);
		}
	});

	/*
	 * Note on the two tolerances.
	 *
	 * It is tempting to reuse one epsilon for both jobs, since Blockbench's snap helper is
	 * often quoted as using 0.02. That conflates two different constants in its source:
	 *
	 *   - 0.02  is the on-plane / snap epsilon      (js/modeling/transform.js:386)
	 *   - 0.001 is the partner-match epsilon        (js/modeling/mirror_modeling.ts:522)
	 *
	 * They are kept separate here. Widening EPS_PARTNER to 0.02 would pair vertices that are
	 * merely near each other, which is precisely the failure mode this plugin is meant to avoid.
	 */
})();
