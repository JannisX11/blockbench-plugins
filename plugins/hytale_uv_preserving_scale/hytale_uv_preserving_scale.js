/*! Hytale UV-Preserving Scale v1.0.0 | MIT */
/*
 * Hytale UV-Preserving Scale
 *
 * Scales a Hytale model up or down without changing its UVs. In this format the
 * UV size comes from a cube's base size, so a normal resize would change the UVs.
 * Instead we keep the base size, multiply each cube's `stretch` (that's what
 * scales the visible box), and move pivots/origins. Texture layout stays put.
 *
 * Standalone add-on for the official Hytale plugin. It doesn't import or modify
 * it; it just checks the active format id, so load order doesn't matter.
 *
 * Author: CODEFELICE
 */

(function () {
	'use strict';

	var PLUGIN_ID = 'hytale_uv_preserving_scale';
	var ACTION_ID = 'hytale_uv_preserving_scale_action';
	var DIALOG_ID = 'hytale_uv_preserving_scale_dialog';
	var TITLE = 'Hytale UV-Preserving Scale';
	var UNDO_LABEL = 'Scale Hytale model while preserving UVs';

	// We only check the active format id, so the official plugin doesn't need to
	// be loaded first.
	var HYTALE_FORMAT_IDS = ['hytale_character', 'hytale_prop'];

	var FACTOR_MIN = 0.1;
	var FACTOR_MAX = 10;
	var FACTOR_DEFAULT = 0.5;

	// Only for comparisons, never for rounding values.
	var EPSILON = 1e-6;

	// --- Math --------------------------------------------------------------

	// Turn -0 into 0. (-0 === 0 is true, so other values pass through.)
	function normalizeZero(x) {
		return x === 0 ? 0 : x;
	}

	// Scale a point around a pivot: V' = P + s(V - P).
	function scalePointAroundPivot(point, pivot, s) {
		return [
			normalizeZero(pivot[0] + s * (point[0] - pivot[0])),
			normalizeZero(pivot[1] + s * (point[1] - pivot[1])),
			normalizeZero(pivot[2] + s * (point[2] - pivot[2]))
		];
	}

	// Scale a displacement/offset. No anchor, so the pivot doesn't matter.
	function scaleDisplacement(vec, s) {
		return [
			normalizeZero(vec[0] * s),
			normalizeZero(vec[1] * s),
			normalizeZero(vec[2] * s)
		];
	}

	function centerOf(from, to) {
		return [
			(from[0] + to[0]) / 2,
			(from[1] + to[1]) / 2,
			(from[2] + to[2]) / 2
		];
	}

	// Offset to add to from and to so the center lands at its scaled position.
	function computeCenterDelta(from, to, pivot, s) {
		var c = centerOf(from, to);
		var c2 = scalePointAroundPivot(c, pivot, s);
		return [c2[0] - c[0], c2[1] - c[1], c2[2] - c[2]];
	}

	// Multiply stretch, don't replace it. Negative and zero axes are kept.
	function scaleStretch(stretch, s) {
		return [
			normalizeZero(stretch[0] * s),
			normalizeZero(stretch[1] * s),
			normalizeZero(stretch[2] * s)
		];
	}

	// The actual cube scale. Same delta on from and to keeps the base size, so
	// the visible scaling comes from stretch alone (which keeps the UVs intact).
	function transformCubeData(data, pivot, s) {
		var delta = computeCenterDelta(data.from, data.to, pivot, s);
		return {
			from: [
				normalizeZero(data.from[0] + delta[0]),
				normalizeZero(data.from[1] + delta[1]),
				normalizeZero(data.from[2] + delta[2])
			],
			to: [
				normalizeZero(data.to[0] + delta[0]),
				normalizeZero(data.to[1] + delta[1]),
				normalizeZero(data.to[2] + delta[2])
			],
			origin: scalePointAroundPivot(data.origin, pivot, s),
			stretch: scaleStretch(data.stretch, s)
		};
	}

	function transformGroupData(data, pivot, s) {
		var out = { origin: scalePointAroundPivot(data.origin, pivot, s) };
		// original_offset/original_position are local offsets, not world points,
		// so just multiply them by s.
		if (Array.isArray(data.original_offset)) {
			out.original_offset = scaleDisplacement(data.original_offset, s);
		}
		if (Array.isArray(data.original_position)) {
			out.original_position = scaleDisplacement(data.original_position, s);
		}
		return out;
	}

	function isPlainNumberString(str) {
		if (typeof str !== 'string') return false;
		var t = str.trim();
		if (t === '') return false;
		if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(t)) return false;
		return Number.isFinite(parseFloat(t));
	}

	// Position keyframes are deltas, so scale by s. Plain numbers stay numbers;
	// Molang expressions get wrapped so they still scale.
	function scaleKeyframeValue(raw, s) {
		if (typeof raw === 'number') {
			return Number.isFinite(raw) ? normalizeZero(raw * s) : raw;
		}
		if (typeof raw === 'string') {
			if (isPlainNumberString(raw)) {
				return normalizeZero(parseFloat(raw) * s);
			}
			var t = raw.trim();
			if (t === '') return raw;
			return '(' + raw + ') * ' + s;
		}
		return raw;
	}

	// Re-base a keyframe value by subtracting a constant offset. Used after a pose
	// is baked into the model: every keyframe of the channel is shifted by the
	// baked offset, so the animation keeps playing relative to the new rest pose.
	function rebaseKeyframeValue(raw, offset) {
		if (!offset) return raw;
		if (typeof raw === 'number') {
			return Number.isFinite(raw) ? normalizeZero(raw - offset) : raw;
		}
		if (typeof raw === 'string') {
			if (isPlainNumberString(raw)) {
				return normalizeZero(parseFloat(raw) - offset);
			}
			var t = raw.trim();
			if (t === '') return raw;
			return '(' + raw + ') - (' + offset + ')';
		}
		return raw;
	}

	// Reject NaN, Infinity, zero, negatives and out-of-range values.
	function validateScaleFactor(raw, opts) {
		var min = opts && typeof opts.min === 'number' ? opts.min : FACTOR_MIN;
		var max = opts && typeof opts.max === 'number' ? opts.max : FACTOR_MAX;

		if (raw === null || raw === undefined || raw === '') {
			return { ok: false, error: 'Enter a scale factor.' };
		}
		var n = typeof raw === 'number' ? raw : parseFloat(raw);
		if (typeof n !== 'number' || Number.isNaN(n)) {
			return { ok: false, error: 'Scale factor must be a valid number.' };
		}
		if (!Number.isFinite(n)) {
			return { ok: false, error: 'Scale factor must be finite (not Infinity).' };
		}
		if (n === 0) {
			return { ok: false, error: 'Scale factor cannot be zero.' };
		}
		if (n < 0) {
			return { ok: false, error: 'Scale factor must be positive.' };
		}
		if (n < min || n > max) {
			return { ok: false, error: 'Scale factor must be between ' + min + ' and ' + max + '.' };
		}
		return { ok: true, value: n };
	}

	function nearlyEqual(a, b, eps) {
		eps = typeof eps === 'number' ? eps : EPSILON;
		if (a === b) return true;
		if (!Number.isFinite(a) || !Number.isFinite(b)) return a === b;
		return Math.abs(a - b) <= eps * Math.max(1, Math.abs(a), Math.abs(b));
	}

	function vecNearlyEqual(a, b, eps) {
		if (!a || !b || a.length !== b.length) return false;
		for (var i = 0; i < a.length; i++) {
			if (!nearlyEqual(a[i], b[i], eps)) return false;
		}
		return true;
	}

	// Exact match, for values we expect to be left untouched (UVs, rotations).
	function vecExactEqual(a, b) {
		if (!a || !b || a.length !== b.length) return false;
		for (var i = 0; i < a.length; i++) {
			if (a[i] !== b[i] && !(Number.isNaN(a[i]) && Number.isNaN(b[i]))) return false;
		}
		return true;
	}

	// Write into a vector array in place so existing references stay valid.
	function writeVec(target, src) {
		for (var i = 0; i < src.length; i++) {
			target[i] = normalizeZero(src[i]);
		}
	}

	// --- Element operations (work on the Cube/Group/Keyframe interface) -----

	function snapshotCube(cube) {
		var faces = {};
		for (var fk in cube.faces) {
			var f = cube.faces[fk];
			faces[fk] = {
				uv: Array.isArray(f.uv) ? f.uv.slice() : null,
				rotation: f.rotation,
				texture: f.texture,
				enabled: f.enabled
			};
		}
		var size = cube.size();
		return {
			cube: cube,
			from: cube.from.slice(),
			to: cube.to.slice(),
			origin: cube.origin.slice(),
			rotation: cube.rotation.slice(),
			stretch: (cube.stretch ? cube.stretch.slice() : [1, 1, 1]),
			size: Array.isArray(size) ? size.slice() : [size, size, size],
			visibility: cube.visibility,
			shading_mode: cube.shading_mode,
			double_sided: cube.double_sided,
			faces: faces
		};
	}

	function snapshotGroup(group) {
		return {
			group: group,
			origin: group.origin.slice(),
			rotation: group.rotation.slice(),
			original_offset: Array.isArray(group.original_offset) ? group.original_offset.slice() : undefined,
			original_position: Array.isArray(group.original_position) ? group.original_position.slice() : undefined,
			visibility: group.visibility,
			name: group.name,
			uuid: group.uuid,
			parent: group.parent
		};
	}

	function snapshotKeyframes(keyframes) {
		return keyframes.map(function (kf) {
			var dps = [];
			for (var i = 0; i < kf.data_points.length; i++) {
				dps.push({ x: kf.get('x', i), y: kf.get('y', i), z: kf.get('z', i) });
			}
			return { kf: kf, dps: dps };
		});
	}

	// Snapshot everything we might touch, so we can roll back on failure.
	function snapshotModelState(cubes, groups, keyframes) {
		return {
			cubes: cubes.map(snapshotCube),
			groups: groups.map(snapshotGroup),
			keyframes: snapshotKeyframes(keyframes)
		};
	}

	function applyCubeTransform(cube, pivot, s) {
		var stretch = cube.stretch ? cube.stretch : [1, 1, 1];
		var res = transformCubeData(
			{ from: cube.from, to: cube.to, origin: cube.origin, stretch: stretch },
			pivot, s
		);
		writeVec(cube.from, res.from);
		writeVec(cube.to, res.to);
		writeVec(cube.origin, res.origin);
		if (!cube.stretch) cube.stretch = [1, 1, 1];
		writeVec(cube.stretch, res.stretch);
	}

	function applyGroupTransform(group, pivot, s) {
		var res = transformGroupData({
			origin: group.origin,
			original_offset: Array.isArray(group.original_offset) ? group.original_offset : undefined,
			original_position: Array.isArray(group.original_position) ? group.original_position : undefined
		}, pivot, s);
		writeVec(group.origin, res.origin);
		if (res.original_offset && Array.isArray(group.original_offset)) {
			writeVec(group.original_offset, res.original_offset);
		}
		if (res.original_position && Array.isArray(group.original_position)) {
			writeVec(group.original_position, res.original_position);
		}
	}

	function scaleLoadedPositionAnimations(keyframes, s) {
		for (var i = 0; i < keyframes.length; i++) {
			var kf = keyframes[i];
			for (var dp = 0; dp < kf.data_points.length; dp++) {
				kf.set('x', scaleKeyframeValue(kf.get('x', dp), s), dp);
				kf.set('y', scaleKeyframeValue(kf.get('y', dp), s), dp);
				kf.set('z', scaleKeyframeValue(kf.get('z', dp), s), dp);
			}
		}
	}

	function restoreSnapshot(snapshot) {
		snapshot.cubes.forEach(function (snap) {
			var cube = snap.cube;
			writeVec(cube.from, snap.from);
			writeVec(cube.to, snap.to);
			writeVec(cube.origin, snap.origin);
			writeVec(cube.rotation, snap.rotation);
			if (cube.stretch) writeVec(cube.stretch, snap.stretch);
			for (var fk in snap.faces) {
				if (!cube.faces[fk]) continue;
				var fs = snap.faces[fk];
				if (fs.uv && cube.faces[fk].uv) writeVec(cube.faces[fk].uv, fs.uv);
				cube.faces[fk].rotation = fs.rotation;
				cube.faces[fk].texture = fs.texture;
				cube.faces[fk].enabled = fs.enabled;
			}
			cube.visibility = snap.visibility;
			if (snap.shading_mode !== undefined) cube.shading_mode = snap.shading_mode;
			if (snap.double_sided !== undefined) cube.double_sided = snap.double_sided;
		});
		snapshot.groups.forEach(function (snap) {
			var group = snap.group;
			writeVec(group.origin, snap.origin);
			writeVec(group.rotation, snap.rotation);
			if (snap.original_offset && Array.isArray(group.original_offset)) {
				writeVec(group.original_offset, snap.original_offset);
			}
			if (snap.original_position && Array.isArray(group.original_position)) {
				writeVec(group.original_position, snap.original_position);
			}
			group.visibility = snap.visibility;
		});
		snapshot.keyframes.forEach(function (snap) {
			snap.dps.forEach(function (vals, i) {
				snap.kf.set('x', vals.x, i);
				snap.kf.set('y', vals.y, i);
				snap.kf.set('z', vals.z, i);
			});
		});
	}

	// Sanity-check the result before committing. Returns the first problem found.
	function validateTransformedState(snapshot, s, pivot, animationsScaled) {
		var i;
		for (i = 0; i < snapshot.cubes.length; i++) {
			var snap = snapshot.cubes[i];
			var cube = snap.cube;
			var label = 'cube "' + (cube.name || cube.uuid) + '"';

			var exp = transformCubeData(
				{ from: snap.from, to: snap.to, origin: snap.origin, stretch: snap.stretch },
				pivot, s
			);

			// base size must not change
			var sizeNow = cube.size();
			if (!Array.isArray(sizeNow)) sizeNow = [sizeNow, sizeNow, sizeNow];
			if (!vecNearlyEqual(sizeNow, snap.size)) {
				return { ok: false, error: label + ': base size changed (' + snap.size + ' -> ' + sizeNow + ').' };
			}
			// stretch must be old * s
			if (!vecNearlyEqual(cube.stretch || [1, 1, 1], scaleStretch(snap.stretch, s))) {
				return { ok: false, error: label + ': stretch not multiplied by factor.' };
			}
			// center, from/to and origin at the expected positions
			var expCenter = scalePointAroundPivot(centerOf(snap.from, snap.to), pivot, s);
			if (!vecNearlyEqual(centerOf(cube.from, cube.to), expCenter)) {
				return { ok: false, error: label + ': center is not at the expected position.' };
			}
			if (!vecNearlyEqual(cube.from, exp.from) || !vecNearlyEqual(cube.to, exp.to)) {
				return { ok: false, error: label + ': from/to not at expected position.' };
			}
			if (!vecNearlyEqual(cube.origin, exp.origin)) {
				return { ok: false, error: label + ': origin not at expected position.' };
			}
			// rotation untouched
			if (!vecExactEqual(cube.rotation, snap.rotation)) {
				return { ok: false, error: label + ': rotation changed.' };
			}
			// UVs, face rotations, textures untouched
			for (var fk in snap.faces) {
				var fs = snap.faces[fk];
				var fn = cube.faces[fk];
				if (!fn) return { ok: false, error: label + ': face "' + fk + '" disappeared.' };
				if (fs.uv && !vecExactEqual(fn.uv, fs.uv)) {
					return { ok: false, error: label + ': UV of face "' + fk + '" changed.' };
				}
				if (fn.rotation !== fs.rotation) {
					return { ok: false, error: label + ': UV rotation of face "' + fk + '" changed.' };
				}
				if (fn.texture !== fs.texture) {
					return { ok: false, error: label + ': texture of face "' + fk + '" changed.' };
				}
			}
			if (cube.visibility !== snap.visibility) {
				return { ok: false, error: label + ': visibility changed.' };
			}
			if (snap.shading_mode !== undefined && cube.shading_mode !== snap.shading_mode) {
				return { ok: false, error: label + ': shading mode changed.' };
			}
			if (snap.double_sided !== undefined && cube.double_sided !== snap.double_sided) {
				return { ok: false, error: label + ': double-sided state changed.' };
			}
		}

		for (i = 0; i < snapshot.groups.length; i++) {
			var gsnap = snapshot.groups[i];
			var group = gsnap.group;
			var glabel = 'group "' + (group.name || group.uuid) + '"';
			var gexp = transformGroupData({
				origin: gsnap.origin,
				original_offset: gsnap.original_offset,
				original_position: gsnap.original_position
			}, pivot, s);

			if (!vecNearlyEqual(group.origin, gexp.origin)) {
				return { ok: false, error: glabel + ': origin not at expected position.' };
			}
			if (gsnap.original_offset && !vecNearlyEqual(group.original_offset, scaleDisplacement(gsnap.original_offset, s))) {
				return { ok: false, error: glabel + ': original_offset not multiplied by factor.' };
			}
			if (gsnap.original_position && !vecNearlyEqual(group.original_position, scaleDisplacement(gsnap.original_position, s))) {
				return { ok: false, error: glabel + ': original_position not multiplied by factor.' };
			}
			if (!vecExactEqual(group.rotation, gsnap.rotation)) {
				return { ok: false, error: glabel + ': rotation changed.' };
			}
			if (group.parent !== gsnap.parent) {
				return { ok: false, error: glabel + ': parent changed.' };
			}
			if (group.name !== gsnap.name) {
				return { ok: false, error: glabel + ': name changed.' };
			}
			if (group.uuid !== gsnap.uuid) {
				return { ok: false, error: glabel + ': uuid changed.' };
			}
		}

		if (animationsScaled) {
			for (i = 0; i < snapshot.keyframes.length; i++) {
				var ksnap = snapshot.keyframes[i];
				var kf = ksnap.kf;
				for (var dp = 0; dp < ksnap.dps.length; dp++) {
					var before = ksnap.dps[dp];
					var axes = ['x', 'y', 'z'];
					for (var ax = 0; ax < axes.length; ax++) {
						var axis = axes[ax];
						var expected = scaleKeyframeValue(before[axis], s);
						var now = kf.get(axis, dp);
						var same;
						if (typeof expected === 'number' && typeof now === 'number') {
							same = nearlyEqual(now, expected);
						} else {
							same = now === expected;
						}
						if (!same) {
							return { ok: false, error: 'a position keyframe value was not multiplied by the factor exactly once.' };
						}
					}
				}
			}
		}

		return { ok: true };
	}

	// Pure helpers, shared with the test runner and reused by the live code below.
	var PURE = {
		PLUGIN_ID: PLUGIN_ID,
		HYTALE_FORMAT_IDS: HYTALE_FORMAT_IDS,
		FACTOR_MIN: FACTOR_MIN,
		FACTOR_MAX: FACTOR_MAX,
		FACTOR_DEFAULT: FACTOR_DEFAULT,
		EPSILON: EPSILON,
		normalizeZero: normalizeZero,
		scalePointAroundPivot: scalePointAroundPivot,
		scaleDisplacement: scaleDisplacement,
		centerOf: centerOf,
		computeCenterDelta: computeCenterDelta,
		scaleStretch: scaleStretch,
		transformCubeData: transformCubeData,
		transformGroupData: transformGroupData,
		isPlainNumberString: isPlainNumberString,
		scaleKeyframeValue: scaleKeyframeValue,
		rebaseKeyframeValue: rebaseKeyframeValue,
		validateScaleFactor: validateScaleFactor,
		nearlyEqual: nearlyEqual,
		vecNearlyEqual: vecNearlyEqual,
		vecExactEqual: vecExactEqual,
		writeVec: writeVec,
		snapshotModelState: snapshotModelState,
		applyCubeTransform: applyCubeTransform,
		applyGroupTransform: applyGroupTransform,
		scaleLoadedPositionAnimations: scaleLoadedPositionAnimations,
		restoreSnapshot: restoreSnapshot,
		validateTransformedState: validateTransformedState
	};

	// Outside Blockbench (the test runner) just export the helpers and stop.
	var inBlockbench = (typeof Plugin !== 'undefined') && Plugin && typeof Plugin.register === 'function';
	if (!inBlockbench) {
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = PURE;
		}
		return;
	}

	// --- Blockbench integration --------------------------------------------

	var activeDialog = null;
	var pluginAction = null;
	var lastFormValues = null; // keep inputs around when reopening after an error
	var animLoadAttempted = null; // the Project we already tried to lazy-load animations for

	function isHytaleActiveFormat() {
		return (typeof Format !== 'undefined') && !!Format && HYTALE_FORMAT_IDS.indexOf(Format.id) !== -1;
	}

	function getVec3(v, fallback) {
		if (Array.isArray(v) && v.length >= 3 &&
			Number.isFinite(v[0]) && Number.isFinite(v[1]) && Number.isFinite(v[2])) {
			return [v[0], v[1], v[2]];
		}
		return fallback ? fallback.slice() : null;
	}

	function fmtVec(v) {
		return v.map(function (n) {
			return String(Math.round(n * 10000) / 10000);
		}).join(', ');
	}

	// Escape any dynamic text before it goes into the summary's innerHTML.
	function esc(s) {
		return String(s == null ? '' : s)
			.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
	}

	// Walk the chosen scope and split it into cubes, groups and anything we
	// can't handle. A node is only visited once, even if it and a parent are
	// both selected.
	function collectTargetElements(scope) {
		var cubes = [];
		var groups = [];
		var unsupported = {};
		var seen = Object.create(null);

		function visit(node) {
			if (!node || seen[node.uuid]) return;
			seen[node.uuid] = true;
			if (typeof Group !== 'undefined' && node instanceof Group) {
				groups.push(node);
			} else if (typeof Cube !== 'undefined' && node instanceof Cube) {
				cubes.push(node);
			} else {
				var t = (node.constructor && node.constructor.name) || node.type || 'Unknown';
				unsupported[t] = (unsupported[t] || 0) + 1;
			}
			if (node.children && node.children.length) {
				for (var i = 0; i < node.children.length; i++) visit(node.children[i]);
			}
		}

		var roots = [];
		if (scope === 'selection') {
			roots = getSelectionRoots();
			for (var i = 0; i < roots.length; i++) visit(roots[i]);
		} else {
			var top = (typeof Outliner !== 'undefined' && Outliner.root) ? Outliner.root : [];
			for (var j = 0; j < top.length; j++) {
				var n = top[j];
				if ((typeof Group !== 'undefined' && n instanceof Group) ||
					(typeof Cube !== 'undefined' && n instanceof Cube)) {
					roots.push(n);
				}
				visit(n);
			}
		}

		var unsupportedList = Object.keys(unsupported).map(function (k) {
			return { type: k, count: unsupported[k] };
		});
		return { cubes: cubes, groups: groups, unsupported: unsupportedList, roots: roots };
	}

	// Top-level selected nodes whose parents aren't also selected.
	function getSelectionRoots() {
		var selGroups = (typeof Group !== 'undefined' && Group.all)
			? Group.all.filter(function (g) { return g.selected; })
			: [];
		var selCubes = (typeof selected !== 'undefined' && Array.isArray(selected))
			? selected.filter(function (e) { return typeof Cube !== 'undefined' && e instanceof Cube; })
			: [];
		var nodes = selGroups.concat(selCubes);
		var selectedSet = Object.create(null);
		nodes.forEach(function (n) { selectedSet[n.uuid] = true; });

		return nodes.filter(function (node) {
			var p = node.parent;
			while (p && typeof p === 'object') {
				if (selectedSet[p.uuid]) return false;
				p = p.parent;
			}
			return true;
		});
	}

	function determinePivot(result, scope) {
		var mode = result.pivot || 'origin';
		if (mode === 'origin') {
			return { ok: true, pivot: [0, 0, 0], label: 'Model Origin [0, 0, 0]' };
		}
		if (mode === 'custom') {
			var cp = result.custom_pivot || [0, 0, 0];
			var v = [Number(cp[0]), Number(cp[1]), Number(cp[2])];
			if (!Number.isFinite(v[0]) || !Number.isFinite(v[1]) || !Number.isFinite(v[2])) {
				return { ok: false, error: 'Custom pivot must contain three finite numbers.' };
			}
			return { ok: true, pivot: v, label: 'Custom Pivot [' + fmtVec(v) + ']' };
		}
		if (mode === 'root') {
			var roots;
			if (scope === 'selection') {
				roots = getSelectionRoots();
			} else {
				var top = (typeof Outliner !== 'undefined' && Outliner.root) ? Outliner.root : [];
				roots = top.filter(function (n) {
					return (typeof Group !== 'undefined' && n instanceof Group) ||
						(typeof Cube !== 'undefined' && n instanceof Cube);
				});
			}
			if (roots.length !== 1) {
				return {
					ok: false,
					error: 'Selected Root Pivot needs exactly one root element in the chosen scope (found ' + roots.length + ').'
				};
			}
			var origin = getVec3(roots[0].origin, [0, 0, 0]);
			return { ok: true, pivot: origin.slice(), label: 'Selected Root Pivot [' + fmtVec(origin) + ']' };
		}
		return { ok: false, error: 'Unknown pivot mode.' };
	}

	// Find the position keyframes in scope. Only loaded animations are touched.
	function collectPositionAnimators(scope, targetGroupUuids) {
		var entries = [];
		var animationsSet = Object.create(null);
		var animations = [];
		var keyframes = [];
		var warnings = [];

		var anims = (typeof Animation !== 'undefined' && Animation.all) ? Animation.all : [];
		for (var a = 0; a < anims.length; a++) {
			var anim = anims[a];
			if (!anim || !anim.animators) continue;
			for (var uuid in anim.animators) {
				var animator = anim.animators[uuid];
				if (!animator) continue;
				// Bone animators only; skip the effects (sound/particle) animator.
				if (typeof BoneAnimator !== 'undefined' && !(animator instanceof BoneAnimator)) continue;

				var posKfs = (animator.position && Array.isArray(animator.position))
					? animator.position.filter(function (kf) { return kf && kf.channel === 'position'; })
					: [];
				if (!posKfs.length) continue;

				// Match the animator to its group; don't guess if we can't.
				var group = null;
				try {
					group = (typeof animator.getGroup === 'function') ? animator.getGroup() : null;
				} catch (e) { group = null; }
				if (!group) group = animator.group || null;
				if (!group && typeof Group !== 'undefined' && Group.all) {
					group = Group.all.find(function (g) { return g.uuid === animator.uuid; }) || null;
				}
				if (!group) {
					warnings.push('Animation "' + (anim.name || '?') + '": position animator "' +
						(animator.name || uuid) + '" could not be matched to a group and was left unchanged.');
					continue;
				}
				if (scope === 'selection' && !targetGroupUuids[group.uuid]) {
					continue;
				}

				entries.push({ animation: anim, animator: animator, group: group, keyframes: posKfs });
				if (!animationsSet[anim.uuid]) {
					animationsSet[anim.uuid] = true;
					animations.push(anim);
				}
				for (var k = 0; k < posKfs.length; k++) keyframes.push(posKfs[k]);
			}
		}
		return { entries: entries, animations: animations, keyframes: keyframes, warnings: warnings };
	}

	function refreshBlockbenchView(cubes, groups) {
		try {
			if (typeof Canvas === 'undefined') return;
			Canvas.updateView({
				elements: cubes,
				element_aspects: { transform: true, geometry: true },
				groups: groups,
				selection: true
			});
			if (typeof Canvas.updateAllBones === 'function') Canvas.updateAllBones();
			if (typeof Canvas.updateOrigin === 'function') Canvas.updateOrigin();
		} catch (e) {
			console.error('[' + TITLE + '] canvas refresh failed:', e);
		}
	}

	// The whole thing as one undo step. Rolls back on any failure.
	function applyModelScale(opts) {
		var s = opts.factor;
		var pivot = opts.pivot;
		var cubes = opts.cubes;
		var groups = opts.groups;
		var animKeyframes = opts.animKeyframes || [];
		var animAnimations = opts.animAnimations || [];
		var animationsScaled = animKeyframes.length > 0;

		var snapshot = snapshotModelState(cubes, groups, animKeyframes);

		// One undo step covering the cubes, groups, the outliner, and (when
		// scaling animations) the affected animations and their keyframes.
		var aspects = {
			elements: cubes.slice(),
			groups: groups.slice(),
			outliner: true,
			selection: true
		};
		if (animationsScaled) {
			aspects.animations = animAnimations.slice();
			aspects.keyframes = animKeyframes.slice();
		}

		var editStarted = false;
		try {
			Undo.initEdit(aspects);
			editStarted = true;

			for (var g = 0; g < groups.length; g++) applyGroupTransform(groups[g], pivot, s);
			for (var c = 0; c < cubes.length; c++) applyCubeTransform(cubes[c], pivot, s);
			if (animationsScaled) scaleLoadedPositionAnimations(animKeyframes, s);

			var v = validateTransformedState(snapshot, s, pivot, animationsScaled);
			if (!v.ok) throw new Error('Post-operation validation failed: ' + v.error);

			refreshBlockbenchView(cubes, groups);

			for (var a = 0; a < animAnimations.length; a++) animAnimations[a].saved = false;
			if (typeof Project !== 'undefined' && Project) Project.saved = false;

			Undo.finishEdit(UNDO_LABEL, aspects);
			return { ok: true };
		} catch (err) {
			console.error('[' + TITLE + '] operation failed, rolling back:', err);
			// Restore our snapshot, cancel the open undo, refresh the view.
			try { restoreSnapshot(snapshot); } catch (e) { console.error('snapshot restore failed:', e); }
			try { if (editStarted) Undo.cancelEdit(); } catch (e) { console.error('Undo.cancelEdit failed:', e); }
			try { refreshBlockbenchView(cubes, groups); } catch (e) { /* already logged */ }
			return { ok: false, error: (err && err.message) ? err.message : String(err) };
		}
	}

	// --- Dialog ------------------------------------------------------------

	function countLoadedPositionAnimations() {
		return collectPositionAnimators('all', Object.create(null)).animations.length;
	}

	// Live summary shown under the form.
	function buildSummaryHtml(result) {
		var fv = validateScaleFactor(result.factor, { min: FACTOR_MIN, max: FACTOR_MAX });
		var scope = result.scope || 'all';
		var targets = collectTargetElements(scope);
		var pv = determinePivot(result, scope);

		var targetGroupUuids = Object.create(null);
		targets.groups.forEach(function (g) { targetGroupUuids[g.uuid] = true; });
		var anim = result.scale_animations
			? collectPositionAnimators(scope, targetGroupUuids)
			: { animations: [], keyframes: [], warnings: [] };

		function row(k, val) {
			return '<tr><td style="padding:2px 8px 2px 0;opacity:0.7;white-space:nowrap;vertical-align:top;">' + k +
				'</td><td style="padding:2px 0;">' + val + '</td></tr>';
		}
		function warn(t) {
			return '<span style="color:var(--color-warning,#e1a948);">⚠ ' + esc(t || '') + '</span>';
		}

		var rows = [];
		rows.push(row('Scale factor', fv.ok ? ('× ' + fv.value) : warn(fv.error)));
		rows.push(row('Cubes', String(targets.cubes.length)));
		rows.push(row('Groups', String(targets.groups.length)));
		rows.push(row('Animations', result.scale_animations
			? (anim.animations.length + (anim.keyframes.length ? ' (' + anim.keyframes.length + ' position keyframes)' : ''))
			: 'not scaling'));
		rows.push(row('Pivot', pv.ok ? pv.label : warn(pv.error)));

		var notes = [];
		if (scope === 'selection' && targets.cubes.length === 0 && targets.groups.length === 0) {
			notes.push(warn('No valid selection — select one or more groups/cubes, or use "Entire Model".'));
		}
		if (targets.unsupported.length) {
			notes.push(warn('Unsupported elements in scope: ' + targets.unsupported.map(function (u) {
				return u.count + '× ' + u.type;
			}).join(', ') + ' — scaling will abort.'));
		}
		if (anim.warnings && anim.warnings.length) {
			notes.push(warn(anim.warnings.length + ' animator(s) could not be matched to a group and will be skipped.'));
		}

		var html = '<div style="border-top:1px solid var(--color-border);margin-top:8px;padding-top:8px;">';
		html += '<table style="width:100%;border-collapse:collapse;">' + rows.join('') + '</table>';
		if (notes.length) {
			html += '<p style="margin:8px 0 0;">' + notes.join('<br>') + '</p>';
		}
		html += '</div>';
		return html;
	}

	function updateSummary(el, result) {
		if (!el) return;
		try {
			el.innerHTML = buildSummaryHtml(result || {});
		} catch (e) {
			el.textContent = 'Summary unavailable: ' + e.message;
		}
	}

	// The Hytale plugin loads a model's .blockyanim files lazily, via a one-shot
	// 'select_mode' listener that only fires the first time you enter animate mode.
	// So if you load a model and scale straight away (still in edit mode), those
	// animations aren't in the project yet and can't be scaled. Fire that same event
	// to trigger the load now — without switching modes, so the current selection,
	// pose and mode stay exactly as they are. It's a no-op once they're loaded.
	function ensureHytaleAnimationsLoaded() {
		try {
			if (!isHytaleActiveFormat()) return;
			if (typeof Animation === 'undefined' || !Animation.all || Animation.all.length) return;
			if (typeof Animator !== 'undefined' && Animator.open) return; // animate mode already loads them
			if (typeof Blockbench === 'undefined' || typeof Blockbench.dispatchEvent !== 'function') return;
			if (typeof Modes === 'undefined' || !Modes.options || !Modes.options.animate) return;
			// Try at most once per project: if there was nothing to load, don't keep
			// re-firing the event every time the dialog opens.
			var proj = (typeof Project !== 'undefined') ? Project : null;
			if (proj && animLoadAttempted === proj) return;
			animLoadAttempted = proj;
			Blockbench.dispatchEvent('select_mode', { mode: Modes.options.animate });
		} catch (e) {
			console.error('[' + TITLE + '] could not pre-load animations:', e);
		}
	}

	function openDialog() {
		if (!isHytaleActiveFormat()) {
			Blockbench.showMessageBox({
				title: TITLE,
				message: 'This tool only works while a Hytale format is active (Hytale Character or Hytale Prop).'
			});
			return;
		}

		// Rebuild each time so it reflects the current project.
		if (activeDialog) {
			try { activeDialog.delete(); } catch (e) { /* ignore */ }
			activeDialog = null;
		}

		var hasAnims = countLoadedPositionAnimations() > 0;
		var summaryEl = document.createElement('div');
		var presetMap = [0.25, 0.5, 2, 4];
		var prevScope = 'all'; // so we can suggest a sensible pivot when the scope changes
		var restoring = false; // don't re-suggest a pivot while restoring saved values

		var dialog = new Dialog(DIALOG_ID, {
			title: TITLE,
			width: 560,
			form: {
				factor: {
					label: 'Scale factor',
					type: 'number',
					value: FACTOR_DEFAULT,
					min: FACTOR_MIN,
					max: FACTOR_MAX,
					step: 0.01
				},
				presets: {
					label: 'Presets',
					type: 'buttons',
					buttons: ['×0.25', '×0.5', '×2', '×4'],
					click: function (index) {
						if (activeDialog) activeDialog.setFormValues({ factor: presetMap[index] });
					}
				},
				_sep1: '_',
				scope: {
					label: 'Scope',
					type: 'inline_select',
					default: 'all',
					options: { all: 'Entire Model', selection: 'Selected Hierarchy' }
				},
				pivot: {
					label: 'Scaling pivot',
					type: 'inline_select',
					default: 'origin',
					options: {
						origin: 'Model Origin [0, 0, 0]',
						root: 'Selected Root Pivot',
						custom: 'Custom Pivot'
					}
				},
				custom_pivot: {
					label: 'Custom pivot',
					type: 'vector',
					value: [0, 0, 0],
					condition: function (form) { return form.pivot === 'custom'; }
				},
				_sep2: '_',
				scale_animations: {
					label: 'Scale loaded position animations',
					type: 'checkbox',
					value: hasAnims,
					description: 'Multiplies position keyframes by the factor. Only animations loaded in this project are affected (external .blockyanim files are not). Rotation, stretch, visibility and UV channels are left alone.'
				}
			},
			lines: [summaryEl],
			onFormChange: function (result) {
				// A sub-selection should scale in place, so steer the pivot to the
				// selection's own root (and back to model origin for the whole model).
				// Only swaps the origin<->root pair, never a custom or restored pivot.
				var scopeChanged = result.scope !== prevScope;
				prevScope = result.scope;
				if (scopeChanged && !restoring) {
					var swapFrom = result.scope === 'selection' ? 'origin' : 'root';
					var swapTo = result.scope === 'selection' ? 'root' : 'origin';
					if (result.pivot === swapFrom && activeDialog && activeDialog.setFormValues) {
						activeDialog.setFormValues({ pivot: swapTo });
						return; // re-fires onFormChange, which refreshes the summary
					}
				}
				lastFormValues = result;
				updateSummary(summaryEl, result);
			},
			onOpen: function () {
				updateSummary(summaryEl, this.getFormResult ? this.getFormResult() : {});
			},
			onConfirm: function (result) {
				handleConfirm(result);
			}
		});

		activeDialog = dialog;
		dialog.show();
		if (lastFormValues) {
			restoring = true;
			try { dialog.setFormValues(lastFormValues); } catch (e) { /* ignore */ }
			restoring = false;
		}
		updateSummary(summaryEl, dialog.getFormResult ? dialog.getFormResult() : {});
	}

	function reopenWithError(result, message) {
		lastFormValues = result;
		Blockbench.showMessageBox({ title: TITLE, message: message });
		setTimeout(openDialog, 0);
	}

	function handleConfirm(result) {
		if (!isHytaleActiveFormat()) {
			Blockbench.showMessageBox({ title: TITLE, message: 'The active format is no longer a Hytale format.' });
			return;
		}

		var fv = validateScaleFactor(result.factor, { min: FACTOR_MIN, max: FACTOR_MAX });
		if (!fv.ok) { reopenWithError(result, fv.error); return; }
		var s = fv.value;

		var scope = result.scope || 'all';
		var targets = collectTargetElements(scope);

		if (scope === 'selection' && targets.cubes.length === 0 && targets.groups.length === 0) {
			reopenWithError(result, 'No valid selection for "Selected Hierarchy". Select one or more groups or cubes first, or switch the scope to "Entire Model".');
			return;
		}

		// Bail out on element types we can't scale safely, rather than half-do it.
		if (targets.unsupported.length) {
			var list = targets.unsupported.map(function (u) { return '• ' + u.count + '× ' + u.type; }).join('\n');
			Blockbench.showMessageBox({
				title: TITLE,
				message: 'The scope contains element types this tool cannot scale safely:\n\n' + list +
					'\n\nScaling was aborted so the model is not left partially transformed. ' +
					'Hytale models should contain only groups and cubes.'
			});
			return;
		}

		var pv = determinePivot(result, scope);
		if (!pv.ok) { reopenWithError(result, pv.error); return; }

		// Factor 1 changes nothing, so don't add an undo entry.
		if (s === 1) {
			Blockbench.showQuickMessage('Scale factor 1 — nothing to change.');
			return;
		}

		var targetGroupUuids = Object.create(null);
		targets.groups.forEach(function (g) { targetGroupUuids[g.uuid] = true; });
		var anim = result.scale_animations
			? collectPositionAnimators(scope, targetGroupUuids)
			: { entries: [], animations: [], keyframes: [], warnings: [] };

		var res = applyModelScale({
			factor: s,
			pivot: pv.pivot,
			cubes: targets.cubes,
			groups: targets.groups,
			animKeyframes: anim.keyframes,
			animAnimations: anim.animations
		});

		if (!res.ok) {
			Blockbench.showMessageBox({
				title: TITLE,
				message: 'The scaling operation failed and the model was restored to its previous state.\n\nReason: ' + res.error
			});
			return;
		}

		lastFormValues = result;
		var msg = 'Scaled ×' + s + ': ' + targets.cubes.length + ' cube(s), ' + targets.groups.length + ' group(s)';
		if (result.scale_animations) msg += ', ' + anim.animations.length + ' animation(s)';
		Blockbench.showQuickMessage(msg, 3000);
		if (anim.warnings && anim.warnings.length) {
			console.warn('[' + TITLE + '] warnings:\n' + anim.warnings.join('\n'));
		}
	}

	// --- Bake-pose interception --------------------------------------------
	// Wraps the native "Bake Animation Pose into Model" action so we can offer to
	// re-base every loaded animation onto the newly baked rest pose, in one undo.

	var bakeActionRef = null;
	var bakeOriginalClick = null;
	var bakeWrapper = null;
	var bakeActionPatched = false;
	var activeBakeDialog = null;

	var BAKE_DEG2RAD = Math.PI / 180;
	var BAKE_RAD2DEG = 180 / Math.PI;

	// Rotation math runs through Blockbench's own THREE quaternions so it matches how
	// Hytale interpolates rotation. Plain euler math doesn't (slerp != lerp).
	function bakeHasThree() {
		return typeof THREE !== 'undefined' && THREE && typeof THREE.Quaternion === 'function' && typeof THREE.Euler === 'function';
	}
	function bakeBoneOrder(g) {
		return (g && g.scene_object && g.scene_object.rotation && g.scene_object.rotation.order) || 'ZYX';
	}
	function eulerDegToQuat(e, order) {
		return new THREE.Quaternion().setFromEuler(new THREE.Euler(e[0] * BAKE_DEG2RAD, e[1] * BAKE_DEG2RAD, e[2] * BAKE_DEG2RAD, order || 'ZYX'));
	}
	function quatToEulerDeg(q, order) {
		var e = new THREE.Euler().setFromQuaternion(q, order || 'ZYX');
		return [e.x * BAKE_RAD2DEG, e.y * BAKE_RAD2DEG, e.z * BAKE_RAD2DEG];
	}

	function getBakeAction() {
		return (typeof BarItems !== 'undefined' && BarItems.bake_animation_into_model) ? BarItems.bake_animation_into_model : null;
	}

	function installBakeIntercept() {
		var action = getBakeAction();
		if (!action || bakeActionPatched || typeof action.click !== 'function') return;
		bakeActionRef = action;
		bakeOriginalClick = action.click;
		bakeWrapper = function () {
			// Only intercept for Hytale formats; everything else stays native.
			if (!isHytaleActiveFormat()) {
				return bakeOriginalClick.apply(this, arguments);
			}
			openBakeDialog();
		};
		action.click = bakeWrapper;
		bakeActionPatched = true;
	}

	function removeBakeIntercept() {
		try {
			// Only restore if our wrapper is still the installed handler. If another
			// plugin has since wrapped it, leave their patch alone rather than clobber it.
			if (bakeActionPatched && bakeActionRef && bakeOriginalClick && bakeActionRef.click === bakeWrapper) {
				bakeActionRef.click = bakeOriginalClick;
			}
		} catch (e) { console.error('[' + TITLE + '] bake intercept cleanup failed:', e); }
		bakeActionPatched = false;
		bakeActionRef = null;
		bakeOriginalClick = null;
		bakeWrapper = null;
		try { if (activeBakeDialog) { activeBakeDialog.delete(); activeBakeDialog = null; } } catch (e) { /* ignore */ }
	}

	function callOriginalBake() {
		if (typeof bakeOriginalClick === 'function') {
			try { bakeOriginalClick.call(bakeActionRef); }
			catch (e) { console.error('[' + TITLE + '] native bake failed:', e); }
		}
	}

	function openBakeDialog() {
		if (activeBakeDialog) { try { activeBakeDialog.delete(); } catch (e) { /* ignore */ } activeBakeDialog = null; }
		var dialog = new Dialog('hytale_uv_preserving_scale_bake_dialog', {
			title: 'Bake Animation Pose into Model',
			width: 480,
			form: {
				rebase: {
					label: 'Re-base loaded animations',
					type: 'checkbox',
					value: true,
					description: 'Bakes the current pose into the model and shifts every loaded animation so they keep playing correctly relative to the new rest pose. Uncheck for the plain native bake.'
				}
			},
			onConfirm: function (result) {
				runBakeWithOptionalRebase(!!(result && result.rebase));
			}
		});
		activeBakeDialog = dialog;
		dialog.show();
	}

	function bakeMultiplier(animation) {
		try {
			if (animation.blend_weight && typeof Animator !== 'undefined' && Animator.MolangParser && typeof Animator.MolangParser.parse === 'function') {
				return Math.max(0, Animator.MolangParser.parse(animation.blend_weight));
			}
		} catch (e) { /* fall through */ }
		return 1;
	}

	function playingAnimations() {
		var anims = (typeof Animator !== 'undefined' && Array.isArray(Animator.animations)) ? Animator.animations
			: ((typeof Animation !== 'undefined' && Animation.all) ? Animation.all : []);
		return anims.filter(function (a) { return a && a.playing; });
	}

	function resolveAnimatorGroupUuid(an) {
		var grp = null;
		try { grp = (typeof an.getGroup === 'function') ? an.getGroup() : null; } catch (e) { grp = null; }
		if (!grp) grp = an.group || null;
		return grp ? grp.uuid : an.uuid;
	}

	// Per bone: the pose offset the native bake adds at the current frame (rotation
	// euler + position), read via interpolate() like the native action. For rotation
	// we also stash K0^-1 in stored-keyframe space for re-basing the keyframes.
	//
	// Gotcha: Hytale interpolates rotation as quaternions. A key K (degrees) is
	// composed as F*K with the bone's rest F, and interpolate() returns euler(F*K) - F.
	// New rest after baking is F*K0, so keeping loaded anims unchanged means multiplying
	// every key by K0^-1 = (F^-1*F')^-1. Captured before rest is touched, while F is
	// still the current rest.
	function captureBakeOffsets() {
		var offsets = {};
		var playing = playingAnimations();
		if (!playing.length) return offsets;
		var groups = (typeof Group !== 'undefined' && Group.all) ? Group.all : [];
		for (var gi = 0; gi < groups.length; gi++) {
			var g = groups[gi];
			var rot = [0, 0, 0], pos = [0, 0, 0], any = false;
			for (var pi = 0; pi < playing.length; pi++) {
				var a = playing[pi];
				var an = (typeof a.getBoneAnimator === 'function') ? a.getBoneAnimator(g) : null;
				if (!an) continue;
				var mult = bakeMultiplier(a);
				if (an.channels && an.channels.rotation && typeof an.interpolate === 'function') {
					var r = an.interpolate('rotation');
					if (Array.isArray(r)) { rot[0] += r[0] * mult; rot[1] += r[1] * mult; rot[2] += r[2] * mult; any = true; }
				}
				if (an.channels && an.channels.position && typeof an.interpolate === 'function') {
					var p = an.interpolate('position');
					if (Array.isArray(p)) { pos[0] += p[0] * mult; pos[1] += p[1] * mult; pos[2] += p[2] * mult; any = true; }
				}
			}
			if (any && (rot[0] || rot[1] || rot[2] || pos[0] || pos[1] || pos[2])) {
				var order = bakeBoneOrder(g);
				var rec = { rot: rot, pos: pos, order: order, restDeg: [g.rotation[0], g.rotation[1], g.rotation[2]] };
				if ((rot[0] || rot[1] || rot[2]) && bakeHasThree()) {
					// F = current rest, F' = setFromEuler(rest + pose) = the new rest the
					// native bake lands on. K0 = F^-1*F'; store K0^-1 for the key re-base.
					var qF = eulerDegToQuat(rec.restDeg, order);
					var qFnew = eulerDegToQuat([rec.restDeg[0] + rot[0], rec.restDeg[1] + rot[1], rec.restDeg[2] + rot[2]], order);
					rec.rotInv = qF.clone().conjugate().multiply(qFnew).conjugate(); // (F^-1*F')^-1 = K0^-1
				}
				offsets[g.uuid] = rec;
			}
		}
		return offsets;
	}

	// Reproduce the native bake for bones: rotation added to the bone euler,
	// position added to the origin and propagated to all descendants. Scale is
	// ignored (as the native bake does); Hytale models contain no meshes.
	function applyBakeToRestPose(offsets) {
		var groups = (typeof Group !== 'undefined' && Group.all) ? Group.all : [];
		function propagate(node, pos) {
			if (typeof Group !== 'undefined' && node instanceof Group) {
				node.origin[0] += pos[0]; node.origin[1] += pos[1]; node.origin[2] += pos[2];
				if (node.children) for (var i = 0; i < node.children.length; i++) propagate(node.children[i], pos);
			} else {
				if (node.from) { node.from[0] += pos[0]; node.from[1] += pos[1]; node.from[2] += pos[2]; }
				if (node.to) { node.to[0] += pos[0]; node.to[1] += pos[1]; node.to[2] += pos[2]; }
				if (node.origin && node.origin !== node.from) { node.origin[0] += pos[0]; node.origin[1] += pos[1]; node.origin[2] += pos[2]; }
			}
		}
		for (var gi = 0; gi < groups.length; gi++) {
			var g = groups[gi];
			var off = offsets[g.uuid];
			if (!off) continue;
			// Add the interpolated pose straight onto the bone euler, exactly like the
			// native bake. interpolate() already returned euler(F*K) - F, so this lands
			// the rest rotation on euler(F*K) = the displayed pose. (A quaternion compose
			// here would NOT match the native action — the fix-rotation term is the point.)
			g.rotation[0] += off.rot[0]; g.rotation[1] += off.rot[1]; g.rotation[2] += off.rot[2];
			propagate(g, off.pos);
		}
	}

	function rebaseChannelKeyframes(keyframes, off) {
		if (!keyframes || !keyframes.length || (!off[0] && !off[1] && !off[2])) return [];
		var touched = [];
		for (var i = 0; i < keyframes.length; i++) {
			var kf = keyframes[i];
			if (!kf || !kf.data_points) continue;
			for (var dp = 0; dp < kf.data_points.length; dp++) {
				kf.set('x', rebaseKeyframeValue(kf.get('x', dp), off[0]), dp);
				kf.set('y', rebaseKeyframeValue(kf.get('y', dp), off[1]), dp);
				kf.set('z', rebaseKeyframeValue(kf.get('z', dp), off[2]), dp);
			}
			touched.push(kf);
		}
		return touched;
	}

	// Re-base rotation keyframes in stored-keyframe space: each key K becomes K0^-1*K
	// (quaternion), the exact inverse of how Blockbench slerps Hytale rotations, so the
	// animation plays identically relative to the new rest pose. q0inv (= K0^-1) is
	// precomputed in captureBakeOffsets while the bone's rest rotation is still intact.
	function rebaseRotationKeyframesQuat(keyframes, q0inv, order) {
		if (!keyframes || !keyframes.length || !q0inv) return [];
		var touched = [];
		for (var i = 0; i < keyframes.length; i++) {
			var kf = keyframes[i];
			if (!kf || !kf.data_points) continue;
			for (var dp = 0; dp < kf.data_points.length; dp++) {
				var ex = Number(kf.get('x', dp)), ey = Number(kf.get('y', dp)), ez = Number(kf.get('z', dp));
				if (!isFinite(ex) || !isFinite(ey) || !isFinite(ez)) continue; // leave expression keys alone
				var ne = quatToEulerDeg(q0inv.clone().multiply(eulerDegToQuat([ex, ey, ez], order)), order);
				kf.set('x', normalizeZero(ne[0]), dp);
				kf.set('y', normalizeZero(ne[1]), dp);
				kf.set('z', normalizeZero(ne[2]), dp);
			}
			touched.push(kf);
		}
		return touched;
	}

	// Re-base every loaded animation against the baked pose, per matching bone:
	// rotation by quaternion (K0^-1 * key), position by subtraction.
	function rebaseLoadedAnimations(offsets) {
		var anims = (typeof Animation !== 'undefined' && Animation.all) ? Animation.all : [];
		var changedAnims = [], changedKfs = [];
		for (var ai = 0; ai < anims.length; ai++) {
			var a = anims[ai];
			if (!a || !a.animators) continue;
			var animChanged = false;
			for (var uuid in a.animators) {
				var an = a.animators[uuid];
				if (!an) continue;
				if (typeof BoneAnimator !== 'undefined' && !(an instanceof BoneAnimator)) continue;
				var off = offsets[resolveAnimatorGroupUuid(an)];
				if (!off) continue;
				// rotInv is set whenever there's a rotation offset (THREE is always present
				// in Blockbench); no offset means nothing to re-base on that channel.
				var t1 = off.rotInv ? rebaseRotationKeyframesQuat(an.rotation, off.rotInv, off.order) : [];
				var t2 = rebaseChannelKeyframes(an.position, off.pos);
				if (t1.length || t2.length) { animChanged = true; changedKfs = changedKfs.concat(t1, t2); }
			}
			if (animChanged) changedAnims.push(a);
		}
		return { animations: changedAnims, keyframes: changedKfs };
	}

	// After re-basing, the playing animation must collapse to ~0 at the current
	// frame for every baked bone (= the new rest pose). Otherwise roll back.
	function validateBakeRebase(offsets) {
		var playing = playingAnimations();
		var tol = 1e-3;
		for (var pi = 0; pi < playing.length; pi++) {
			var a = playing[pi];
			if (!a.animators) continue;
			for (var uuid in a.animators) {
				var an = a.animators[uuid];
				if (!an) continue;
				if (typeof BoneAnimator !== 'undefined' && !(an instanceof BoneAnimator)) continue;
				if (!offsets[resolveAnimatorGroupUuid(an)]) continue;
				if (an.channels && an.channels.rotation && typeof an.interpolate === 'function') {
					var r = an.interpolate('rotation');
					if (Array.isArray(r) && (Math.abs(r[0]) > tol || Math.abs(r[1]) > tol || Math.abs(r[2]) > tol)) {
						return { ok: false, error: 'rotation re-base self-check failed' };
					}
				}
				if (an.channels && an.channels.position && typeof an.interpolate === 'function') {
					var p = an.interpolate('position');
					if (Array.isArray(p) && (Math.abs(p[0]) > tol || Math.abs(p[1]) > tol || Math.abs(p[2]) > tol)) {
						return { ok: false, error: 'position re-base self-check failed' };
					}
				}
			}
		}
		return { ok: true };
	}

	function collectBakeKeyframeSnapshots(keyframes, out) {
		if (!keyframes) return;
		for (var i = 0; i < keyframes.length; i++) {
			var kf = keyframes[i];
			if (!kf || !kf.data_points) continue;
			var dps = [];
			for (var dp = 0; dp < kf.data_points.length; dp++) {
				dps.push({ x: kf.get('x', dp), y: kf.get('y', dp), z: kf.get('z', dp) });
			}
			out.push({ kf: kf, dps: dps });
		}
	}

	function snapshotBakeState(offsets) {
		var groups = (typeof Group !== 'undefined' && Group.all) ? Group.all.slice() : [];
		var cubes = (typeof Cube !== 'undefined' && Cube.all) ? Cube.all.slice() : [];
		var gs = groups.map(function (g) { return { g: g, rotation: g.rotation.slice(), origin: g.origin.slice() }; });
		var cs = cubes.map(function (c) { return { c: c, from: c.from.slice(), to: c.to.slice(), origin: c.origin.slice() }; });
		var kfs = [];
		var anims = (typeof Animation !== 'undefined' && Animation.all) ? Animation.all : [];
		for (var ai = 0; ai < anims.length; ai++) {
			var a = anims[ai];
			if (!a || !a.animators) continue;
			for (var uuid in a.animators) {
				var an = a.animators[uuid];
				if (typeof BoneAnimator !== 'undefined' && !(an instanceof BoneAnimator)) continue;
				if (!offsets[resolveAnimatorGroupUuid(an)]) continue;
				collectBakeKeyframeSnapshots(an.rotation, kfs);
				collectBakeKeyframeSnapshots(an.position, kfs);
			}
		}
		return { groups: gs, cubes: cs, keyframes: kfs };
	}

	function restoreBakeState(snap) {
		snap.groups.forEach(function (s) { writeVec(s.g.rotation, s.rotation); writeVec(s.g.origin, s.origin); });
		snap.cubes.forEach(function (s) { writeVec(s.c.from, s.from); writeVec(s.c.to, s.to); writeVec(s.c.origin, s.origin); });
		snap.keyframes.forEach(function (s) {
			s.dps.forEach(function (vals, i) { s.kf.set('x', vals.x, i); s.kf.set('y', vals.y, i); s.kf.set('z', vals.z, i); });
		});
	}

	function refreshAfterBake(cubes, groups) {
		try {
			if (typeof Canvas === 'undefined') return;
			Canvas.updateView({ elements: cubes, element_aspects: { transform: true, geometry: true }, groups: groups, selection: true });
			if (typeof Canvas.updateAllBones === 'function') Canvas.updateAllBones();
		} catch (e) { console.error('[' + TITLE + '] refresh after bake failed:', e); }
	}

	// Bake the pose and re-base all animations as ONE undo step. If re-base is
	// off, or nothing is playing to bake, the plain native bake runs instead.
	function runBakeWithOptionalRebase(doRebase) {
		var offsets = doRebase ? captureBakeOffsets() : {};
		if (!doRebase || !Object.keys(offsets).length) {
			callOriginalBake();
			return;
		}

		var groups = (typeof Group !== 'undefined' && Group.all) ? Group.all.slice() : [];
		var cubes = (typeof Cube !== 'undefined' && Cube.all) ? Cube.all.slice() : [];
		var anims = (typeof Animation !== 'undefined' && Animation.all) ? Animation.all.slice() : [];
		var snapshot = snapshotBakeState(offsets);

		var aspects = { elements: cubes, groups: groups, outliner: true, selection: true };
		if (anims.length) aspects.animations = anims;

		var editStarted = false;
		try {
			Undo.initEdit(aspects);
			editStarted = true;

			applyBakeToRestPose(offsets);
			var changed = rebaseLoadedAnimations(offsets);

			var v = validateBakeRebase(offsets);
			if (!v.ok) throw new Error('Post-operation validation failed: ' + v.error);

			refreshAfterBake(cubes, groups);
			changed.animations.forEach(function (a) { a.saved = false; });
			if (typeof Project !== 'undefined' && Project) Project.saved = false;

			Undo.finishEdit('Bake animation pose into model (re-based)', aspects);

			// Match the native bake, which leaves you in edit mode afterwards.
			try {
				if (typeof Modes !== 'undefined' && Modes.options && Modes.options.edit && typeof Modes.options.edit.select === 'function') {
					Modes.options.edit.select();
				}
			} catch (e) { /* ignore */ }

			Blockbench.showQuickMessage('Pose baked, ' + changed.animations.length + ' animation(s) re-based', 3000);
		} catch (err) {
			console.error('[' + TITLE + '] bake + re-base failed, rolling back:', err);
			try { restoreBakeState(snapshot); } catch (e) { console.error('bake restore failed:', e); }
			try { if (editStarted) Undo.cancelEdit(); } catch (e) { console.error('Undo.cancelEdit failed:', e); }
			try { refreshAfterBake(cubes, groups); } catch (e) { /* already logged */ }
			Blockbench.showMessageBox({ title: TITLE, message: 'Bake + re-base failed and the model was restored.\n\nReason: ' + (err && err.message ? err.message : err) });
		}
	}

	// --- Plugin lifecycle --------------------------------------------------

	Plugin.register(PLUGIN_ID, {
		title: TITLE,
		author: 'CODEFELICE',
		description: 'Uniformly scales Hytale models without changing their UV size or texture layout.',
		icon: 'photo_size_select_large',
		version: '1.0.0',
		variant: 'both',
		min_version: '5.0.5',
		tags: ['Hytale', 'Scale', 'UV'],
		repository: 'https://github.com/CODEFELICE/hytale-uv-preserving-scale',
		bug_tracker: 'https://github.com/CODEFELICE/hytale-uv-preserving-scale/issues',
		onload: function () {
			pluginAction = new Action(ACTION_ID, {
				name: 'Scale Model — Preserve UV',
				description: 'Uniformly scale a Hytale model while keeping every UV island the same size and texture position.',
				icon: 'photo_size_select_large',
				category: 'tools',
				condition: function () { return isHytaleActiveFormat(); },
				click: function () { ensureHytaleAnimationsLoaded(); openDialog(); }
			});
			MenuBar.menus.tools.addAction(pluginAction);
			installBakeIntercept();
		},
		onunload: function () {
			try {
				if (activeDialog) { activeDialog.delete(); activeDialog = null; }
			} catch (e) { console.error('[' + TITLE + '] dialog cleanup failed:', e); }
			try {
				if (pluginAction) { pluginAction.delete(); pluginAction = null; }
			} catch (e) { console.error('[' + TITLE + '] action cleanup failed:', e); }
			removeBakeIntercept();
			lastFormValues = null;
		}
	});

})();
