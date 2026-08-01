/**
 * Mesh → Cubes
 * Turns box-shaped meshes into real Cubes that can be exported into the game.
 *
 * The core (solveBox) does not depend on Blockbench and is covered by
 * tools/verify-conversion.mjs, which runs it against a real OBJ file.
 *
 * Install: Blockbench -> File -> Plugins -> Load Plugin from File -> this file.
 *
 * IMPORTANT: the file name must match PLUGIN_ID, otherwise Blockbench refuses
 * to load it. geckolib_model_importer.js <-> 'geckolib_model_importer'. Rename both together.
 */
(function () {

const PLUGIN_ID = 'geckolib_model_importer';

// All tolerances are relative. Absolute ones do not work here: models contain
// panels 0.001 px thick next to 8 px cubes (see the pitfalls in docs/format-notes.md).
const TOL_ORTHO = 1e-3;   // cosine between axes (flat case only)
const TOL_REL = 1e-4;     // fraction of the object bounds
const TOL_UV = 1e-3;      // texture pixels

// ---------------------------------------------------------------- vectors

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [
	a[1] * b[2] - a[2] * b[1],
	a[2] * b[0] - a[0] * b[2],
	a[0] * b[1] - a[1] * b[0],
];
const len = a => Math.hypot(a[0], a[1], a[2]);
const norm = a => { const l = len(a); return l ? mul(a, 1 / l) : [0, 0, 0]; };
const dist = (a, b) => len(sub(a, b));

// ------------------------------------------------------------ box detection

/**
 * Decides from the unique vertices whether this is a rectangular box,
 * and returns its centre, axes and size.
 *
 * Face normals are deliberately NOT used: on degenerately thin faces the cross
 * product drops into numeric noise and lies (measured during the first analysis).
 */
function detectBox(pts) {
	if (pts.length === 8) return detectBox8(pts);
	if (pts.length === 4) return detectBox4(pts);
	return null;
}

/** Full box: look for three mutually orthogonal edges starting from p0. */
function detectBox8(pts) {
	const p0 = pts[0];
	const rest = pts.slice(1);
	const span = Math.max(...rest.map(p => dist(p, p0)));
	if (!span) return null;
	const tol = span * TOL_REL;

	for (let i = 0; i < rest.length; i++) {
		for (let j = i + 1; j < rest.length; j++) {
			for (let k = j + 1; k < rest.length; k++) {
				const e = [sub(rest[i], p0), sub(rest[j], p0), sub(rest[k], p0)];
				if (e.some(v => !len(v))) continue;

				// Orthogonality is checked as a deviation in UNITS OF LENGTH, not as an
				// angle between normalised edges. For a short edge (a panel 0.001 px
				// thick) the angle is defined by coordinate noise, and the angular
				// criterion rejects perfectly good boxes. The real check is the match
				// of all eight corners below.
				const skew = (a, b) => Math.abs(dot(e[a], e[b])) / Math.max(len(e[a]), len(e[b]));
				if (skew(0, 1) > tol || skew(1, 2) > tol || skew(0, 2) > tol) continue;

				// all 8 corners must reproduce as p0 + a subset sum of the edges
				const corners = [];
				for (const [a, b, c] of [[0,0,0],[1,0,0],[0,1,0],[0,0,1],[1,1,0],[1,0,1],[0,1,1],[1,1,1]]) {
					corners.push(add(p0, add(add(mul(e[0], a), mul(e[1], b)), mul(e[2], c))));
				}
				if (!sameSet(pts, corners, tol)) continue;

				return refineBox(pts, e);
			}
		}
	}
	return null;
}

/**
 * Refines the axes, centre and size of a box from its edges.
 *
 * A short edge must not be normalised: on a panel 0.001 px thick the edge is
 * 6e-5 long, and coordinate error (float32 from glTF especially) gives a
 * direction error of hundredths of a degree. Multiplied by the long dimensions
 * it scatters vertices by millipixels, and faces stop being recognised.
 *
 * So we take the two longest edges as the basis — those are measured precisely —
 * orthogonalise them, and obtain the third axis with a cross product.
 * Size and centre come from projecting every vertex: more precise than edges.
 */
function refineBox(pts, e) {
	const order = [0, 1, 2].sort((i, j) => len(e[j]) - len(e[i]));
	const u1 = norm(e[order[0]]);
	const u2 = norm(sub(e[order[1]], mul(u1, dot(e[order[1]], u1))));
	const u3 = cross(u1, u2);
	const axes = [u1, u2, u3];

	const size = [], mid = [];
	for (const a of axes) {
		const ds = pts.map(p => dot(p, a));
		const lo = Math.min(...ds), hi = Math.max(...ds);
		size.push(hi - lo);
		mid.push((lo + hi) / 2);
	}
	// the axes are orthonormal, so the centre is just the sum of per-axis midpoints
	const center = axes.reduce((acc, a, i) => add(acc, mul(a, mid[i])), [0, 0, 0]);
	return { center, axes, size };
}

/** Degenerate case: 4 vertices, a flat panel of zero thickness. */
function detectBox4(pts) {
	const p0 = pts[0];
	const rest = pts.slice(1);
	const span = Math.max(...rest.map(p => dist(p, p0)));
	if (!span) return null;
	const tol = span * TOL_REL;

	for (let i = 0; i < rest.length; i++) {
		for (let j = i + 1; j < rest.length; j++) {
			const e0 = sub(rest[i], p0), e1 = sub(rest[j], p0);
			const n0 = norm(e0), n1 = norm(e1);
			if (!len(n0) || !len(n1)) continue;
			if (Math.abs(dot(n0, n1)) > TOL_ORTHO) continue;
			if (!sameSet(pts, [p0, rest[i], rest[j], add(p0, add(e0, e1))], tol)) continue;

			return {
				center: add(p0, mul(add(e0, e1), 0.5)),
				axes: [n0, n1, norm(cross(n0, n1))],
				size: [len(e0), len(e1), 0],
			};
		}
	}
	return null;
}

/** Two point sets are equal as sets (within tolerance). */
function sameSet(a, b, tol) {
	if (a.length !== b.length) return false;
	const used = new Array(b.length).fill(false);
	for (const p of a) {
		const hit = b.findIndex((q, idx) => !used[idx] && dist(p, q) <= tol);
		if (hit < 0) return false;
		used[hit] = true;
	}
	return true;
}

// ------------------------------------------------- orientation candidates

/**
 * Box axes arrive in arbitrary order with arbitrary signs — that makes 24
 * different right-handed bases giving the same shape but a different rotation
 * and a different spread of the texture across faces.
 *
 * We return all 24, sorted by closeness to the identity matrix.
 * Which one is right is decided later, by where the UV land without a rotation
 * and without mirroring.
 */
function orientations(axes, size) {
	const perms = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
	const out = [];
	for (const p of perms) {
		for (let mask = 0; mask < 8; mask++) {
			const vx = mul(axes[p[0]], mask & 1 ? -1 : 1);
			const vy = mul(axes[p[1]], mask & 2 ? -1 : 1);
			const vz = mul(axes[p[2]], mask & 4 ? -1 : 1);
			// right-handed bases only, otherwise the texture comes out mirrored
			if (dot(cross(vx, vy), vz) < 0.99) continue;
			out.push({ vx, vy, vz, size: [size[p[0]], size[p[1]], size[p[2]]], trace: vx[0] + vy[1] + vz[2] });
		}
	}
	return out.sort((a, b) => b.trace - a.trace);
}

// ----------------------------------------------------------------- UV

/**
 * For every cube face: the directions in which texture u and v grow, in the
 * cube's local coordinates.
 *
 * THIS IS ONLY A FALLBACK. Inside a live Blockbench the table is overwritten
 * by calibrateFaceDirs(), which measures the convention from the editor itself.
 *
 * The values below are what the measurement returned on Blockbench 5.1.6. Note
 * that `u x v = -n` on all six faces, i.e. the convention is chirally
 * consistent. Deriving it from mirroring statistics gave the opposite sign for
 * up/down and broke the picture — inference turned out worse than measurement.
 */
let FACE_DIRS = {
	north: { normal: [0, 0, -1], u: [-1, 0, 0], v: [0, -1, 0] },
	south: { normal: [0, 0,  1], u: [ 1, 0, 0], v: [0, -1, 0] },
	east:  { normal: [ 1, 0, 0], u: [0, 0, -1], v: [0, -1, 0] },
	west:  { normal: [-1, 0, 0], u: [0, 0,  1], v: [0, -1, 0] },
	up:    { normal: [0,  1, 0], u: [1, 0, 0], v: [0, 0,  1] },
	down:  { normal: [0, -1, 0], u: [1, 0, 0], v: [0, 0, -1] },
};
const FACE_NAMES = Object.keys(FACE_DIRS);

/**
 * Distributes mesh faces across the faces of the cube.
 * Strictly per face, not per vertex: one cube corner belongs to three faces and
 * carries its own UV on each; collecting by position would mix them up.
 */
function assignFaces(faces, center, o) {
	const half = mul(o.size, 0.5);
	const span = Math.max(...o.size) || 1;
	const tol = span * TOL_REL;
	const toLocal = p => {
		const d = sub(p, center);
		return [dot(d, o.vx), dot(d, o.vy), dot(d, o.vz)];
	};

	const samples = {};
	for (const name of FACE_NAMES) samples[name] = [];

	// The per-axis tolerance must not exceed half the thickness along that axis,
	// otherwise the two opposite sides of a 0.001 px panel merge: they sit exactly
	// one tolerance apart. The lower bound is needed for honestly zero thickness —
	// there both sides coincide, and the face must land on both of them.
	//
	const axisTol = a => Math.min(tol, Math.max(half[a] * 0.5, span * 1e-9));

	for (const face of faces) {
		const locals = face.positions.map(toLocal);
		for (const name of FACE_NAMES) {
			const n = FACE_DIRS[name].normal;
			const axis = n[0] ? 0 : n[1] ? 1 : 2;
			const at = axisTol(axis);
			// a mesh face lies on a cube face when ALL of its vertices are on that side
			if (!locals.every(l => Math.abs(dot(l, n) - half[axis]) < at)) continue;
			locals.forEach((pos, i) => {
				if (face.uvs[i]) samples[name].push({ pos, uv: face.uvs[i] });
			});
		}
	}
	return { samples, span };
}

/**
 * How many times the UV contradict the chosen face orientation.
 *
 * Texture u must stay constant along the face's v axis, and vice versa. If that
 * is broken the texture would have to be rotated by 90°, which geo.json cannot
 * express, so such an orientation is unusable.
 */
function countUVViolations(samples, span) {
	const tol = span * TOL_REL;
	let bad = 0;
	for (const name of FACE_NAMES) {
		const s = samples[name];
		const dirs = FACE_DIRS[name];
		for (let i = 0; i < s.length; i++) {
			for (let j = i + 1; j < s.length; j++) {
				const d = sub(s[i].pos, s[j].pos);
				if (Math.abs(dot(d, dirs.u)) < tol && Math.abs(s[i].uv[0] - s[j].uv[0]) > TOL_UV) bad++;
				if (Math.abs(dot(d, dirs.v)) < tol && Math.abs(s[i].uv[1] - s[j].uv[1]) > TOL_UV) bad++;
			}
		}
	}
	return bad;
}

/**
 * Builds the UV rectangle of a face from samples.
 *
 * Mirroring falls out naturally: if texture u decreases where the geometric one
 * grows, x1 ends up greater than x2 — Blockbench reads such a reversed
 * rectangle as a mirror.
 *
 * Degenerate faces are the exception. On panels 0.001 px thick the side faces
 * have almost no extent, and the texture direction on them is defined by noise.
 * Such axes are normalised (x1 < x2) so that random mirrors are not produced.
 *
 *
 * @param mirror false forces every rectangle to be normalised
 */
function buildFaceUV(samples, dirs, span, mirror) {
	if (!samples.length) return null;
	const tol = span * TOL_REL;

	const along = axis => {
		let lo = samples[0], hi = samples[0];
		let loP = dot(lo.pos, axis), hiP = loP;
		for (const s of samples) {
			const p = dot(s.pos, axis);
			if (p < loP) { lo = s; loP = p; }
			if (p > hiP) { hi = s; hiP = p; }
		}
		return { lo, hi, degenerate: hiP - loP < tol };
	};

	const u = along(dirs.u), v = along(dirs.v);
	let x1 = u.lo.uv[0], x2 = u.hi.uv[0];
	let y1 = v.lo.uv[1], y2 = v.hi.uv[1];

	if (!mirror || u.degenerate) { if (x1 > x2) [x1, x2] = [x2, x1]; }
	if (!mirror || v.degenerate) { if (y1 > y2) [y1, y2] = [y2, y1]; }

	return [x1, y1, x2, y2];
}

/** Builds UV for all six faces and counts how many came out mirrored. */
function buildFaces(samples, span, mirror) {
	const faceUV = {}, emptyFaces = [];
	let flips = 0;
	for (const name of FACE_NAMES) {
		const uv = buildFaceUV(samples[name], FACE_DIRS[name], span, mirror);
		if (!uv) { emptyFaces.push(name); continue; }
		faceUV[name] = uv;
		if (uv[0] > uv[2] || uv[1] > uv[3]) flips++;
	}
	return { faceUV, emptyFaces, flips };
}

/**
 * Bounding box from faces — the fallback for objects that are not boxes.
 *
 *
 * The shape is coarsened to an axis-aligned box. Without regenerating the
 * texture nothing more precise is possible, and it is far better than losing
 * the object, or the whole model.
 */
/**
 * Unit normal of a triangle, or null for a degenerate one.
 *
 * File normals cannot be trusted here: on approximated objects they are
 * smoothed per vertex and point anywhere. We compute from the points.
 */
function triangleNormal(p) {
	if (!p || p.length < 3) return null;
	const a = [p[1][0] - p[0][0], p[1][1] - p[0][1], p[1][2] - p[0][2]];
	const b = [p[2][0] - p[0][0], p[2][1] - p[0][1], p[2][2] - p[0][2]];
	const n = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
	const len = Math.hypot(n[0], n[1], n[2]);
	return len > 1e-12 ? [n[0] / len, n[1] / len, n[2] / len] : null;
}

function boxFromBounds(faces) {
	const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
	const uvLo = [Infinity, Infinity], uvHi = [-Infinity, -Infinity];
	for (const f of faces) {
		for (const p of f.positions) for (let a = 0; a < 3; a++) {
			if (p[a] < lo[a]) lo[a] = p[a];
			if (p[a] > hi[a]) hi[a] = p[a];
		}
		for (const u of f.uvs) if (u) for (let a = 0; a < 2; a++) {
			if (u[a] < uvLo[a]) uvLo[a] = u[a];
			if (u[a] > uvHi[a]) uvHi[a] = u[a];
		}
	}
	if (!isFinite(lo[0])) return null;
	const whole = isFinite(uvLo[0]) ? [uvLo[0], uvLo[1], uvHi[0], uvHi[1]] : [0, 0, 0, 0];

	// UV are assigned to EACH face separately by sorting the source triangles into
	// six directions. One shared rectangle for every face was exactly why
	// approximated objects looked like mush: every side showed the bounds of the
	// whole unwrap at once. The wedge shape is lost regardless, but the texture
	// then lands sensibly.
	const buckets = {};
	for (const name of FACE_NAMES) buckets[name] = [Infinity, Infinity, -Infinity, -Infinity];
	const seen = {};
	for (const f of faces) {
		if (!f.uvs || f.uvs.length < 3 || f.uvs.some(u => !u)) continue;
		const n = triangleNormal(f.positions);
		if (!n) continue;
		// the face whose direction is closest to the triangle normal
		let best = null, bestDot = -Infinity;
		for (const name of FACE_NAMES) {
			const d = FACE_DIRS[name].normal;
			const dot = n[0] * d[0] + n[1] * d[1] + n[2] * d[2];
			if (dot > bestDot) { bestDot = dot; best = name; }
		}
		const b = buckets[best];
		for (const u of f.uvs) {
			if (u[0] < b[0]) b[0] = u[0];
			if (u[1] < b[1]) b[1] = u[1];
			if (u[0] > b[2]) b[2] = u[0];
			if (u[1] > b[3]) b[3] = u[1];
		}
		seen[best] = true;
	}

	const faceUV = {};
	// A face with no triangles of its own gets the overall bounds: leaving it
	// empty is not an option — in Minecraft a cube has all six sides.
	for (const name of FACE_NAMES) faceUV[name] = seen[name] ? buckets[name] : whole.slice();
	return {
		center: [0, 1, 2].map(a => (lo[a] + hi[a]) / 2),
		size: [0, 1, 2].map(a => hi[a] - lo[a]),
		vx: [1, 0, 0], vy: [0, 1, 0], vz: [0, 0, 1],
		faceUV, emptyFaces: [], mirrored: 0, violations: 0,
		approximated: true,
	};
}

/**
 * Whether this object is meaningful at all.
 *
 * Exports contain fragments of 2-4 vertices with zero volume: leftovers of
 * triangulation and degenerate faces. Losing a whole model over them is absurd.
 */
function isDegenerate(faces) {
	const uniq = new Map();
	for (const f of faces) for (const p of f.positions) uniq.set(p.map(v => v.toFixed(5)).join(','), p);
	if (uniq.size <= 2) return true;
	const pts = [...uniq.values()];
	const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
	for (const p of pts) for (let a = 0; a < 3; a++) {
		if (p[a] < lo[a]) lo[a] = p[a];
		if (p[a] > hi[a]) hi[a] = p[a];
	}
	const dims = [0, 1, 2].map(a => hi[a] - lo[a]).sort((x, y) => y - x);
	// a flat shape is fine (panels), but a thread or a point is not
	return dims[1] < dims[0] * 1e-4;
}

/**
 * Splits a set of faces into connected components.
 *
 * Many exporters (Sketchfab included) merge every cube into one mesh: 1416
 * vertices and 708 triangles instead of 59 separate boxes. Without splitting,
 * such an object is not recognised as a box and the model gets rejected.
 *
 * Connectivity is computed from shared vertex positions: neighbouring cubes
 * rarely share vertices, while inside one cube they always do.
 */
function splitComponents(faces) {
	if (faces.length < 2) return [faces];

	const parent = faces.map((_, i) => i);
	const find = i => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
	const union = (a, b) => { a = find(a); b = find(b); if (a !== b) parent[b] = a; };

	// Connectivity goes by a shared EDGE, not a shared vertex: cubes touching
	// along an edge share two vertices, and vertex connectivity glued them into
	// one 14-vertex object instead of two 8-vertex boxes.
	// Edges count, but only HONEST ones: in a closed surface an edge belongs to
	// exactly two triangles. Where two cubes meet along an edge it has four
	// adjacent triangles — such an edge must not be joined, or the cubes fuse
	// into a single 14-vertex object.
	const key = p => p.map(v => v.toFixed(5)).join(',');
	const byEdge = new Map();
	faces.forEach((f, i) => {
		const ks = f.positions.map(key);
		for (let a = 0; a < ks.length; a++) {
			const b = (a + 1) % ks.length;
			if (ks[a] === ks[b]) continue;
			const edge = ks[a] < ks[b] ? ks[a] + '|' + ks[b] : ks[b] + '|' + ks[a];
			if (!byEdge.has(edge)) byEdge.set(edge, []);
			byEdge.get(edge).push(i);
		}
	});
	for (const [, list] of byEdge) {
		if (list.length !== 2) continue;
		union(list[0], list[1]);
	}

	const groups = new Map();
	faces.forEach((f, i) => {
		const root = find(i);
		if (!groups.has(root)) groups.set(root, []);
		groups.get(root).push(f);
	});
	return [...groups.values()];
}

// ------------------------------------------------------------------ core

/**
 * The main entry point. Input is normalised so that the same maths works both
 * from Blockbench and from the Node test that reads an OBJ.
 *
 * @param faces [{ positions: [[x,y,z],…], uvs: [[u,v]|null,…] }]
 * @param opts.mirror keep mirrored UV (default: yes)
 * @returns { center, size, vx, vy, vz, faceUV, emptyFaces, violations, mirrored } | { error }
 */
function solveBox(faces, opts) {
	const mirror = !opts || opts.mirror !== false;
	const uniq = new Map();
	for (const f of faces) for (const p of f.positions) {
		uniq.set(p.map(n => n.toFixed(6)).join(','), p);
	}
	const pts = [...uniq.values()];

	const box = detectBox(pts);
	if (!box) return { error: `not a box (${pts.length} unique vertices)` };

	// We try all 24 orientations and choose by three criteria, most important
	// first: fewer violations (a 90° UV rotation), fewer mirrors, and only then
	// closeness to the identity matrix.
	//
	// The order matters. Rotating a cube by 180° does not change the roles of u
	// and v, so it produces no violations and by the first criterion ties with the
	// identity basis. If the tie-break is closeness to identity, the 180° variant
	// always loses — and the texture rotation then has to be faked with mirroring,
	// which looks like flipped on both axes.
	// That is why the mirror count comes before closeness to identity.
	let best = null;
	for (const o of orientations(box.axes, box.size)) {
		const { samples, span } = assignFaces(faces, box.center, o);
		const violations = countUVViolations(samples, span);
		// mirrors are always counted honestly for the choice, regardless of the
		// option, otherwise with mirroring off the criterion collapses to zero
		const built = buildFaces(samples, span, true);
		const cand = { o, samples, span, violations, ...built };
		if (!best
			|| violations < best.violations
			|| (violations === best.violations && built.flips < best.flips)) best = cand;
		if (!violations && !built.flips) break;
	}
	if (!best) return { error: 'could not build a right-handed axis system' };

	// the final layout is rebuilt taking the user option into account
	const final = mirror ? best : buildFaces(best.samples, best.span, false);

	return {
		center: box.center,
		size: best.o.size,
		vx: best.o.vx, vy: best.o.vy, vz: best.o.vz,
		faceUV: final.faceUV,
		emptyFaces: final.emptyFaces,
		mirrored: best.flips,
		violations: best.violations,
	};
}

// ------------------------------------------------------------- glTF parsing

const GLTF_COMPONENTS = {
	5120: { size: 1, read: (dv, o) => dv.getInt8(o) },
	5121: { size: 1, read: (dv, o) => dv.getUint8(o) },
	5122: { size: 2, read: (dv, o) => dv.getInt16(o, true) },
	5123: { size: 2, read: (dv, o) => dv.getUint16(o, true) },
	5125: { size: 4, read: (dv, o) => dv.getUint32(o, true) },
	5126: { size: 4, read: (dv, o) => dv.getFloat32(o, true) },
};
const GLTF_TYPE_SIZE = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 };

// 4x4 matrices, column-major order as in glTF
const matIdentity = () => [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

function matMul(a, b) {
	const out = new Array(16);
	for (let c = 0; c < 4; c++) {
		for (let r = 0; r < 4; r++) {
			out[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1]
				+ a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
		}
	}
	return out;
}

/**
 * Whether the node rotation is axis-aligned, i.e. maps axes onto axes.
 *
 * Distinguishes a coordinate-system conversion (Z-up -> Y-up, always a multiple
 * of 90°) from arbitrary showcase placement. The marker is that the rotation
 * matrix turns out to be a signed permutation: exactly one unit per row and
 * per column, zeros elsewhere.
 *
 * Returns {matrix, quat} carrying the rotation only (the wrapper's offset and
 * scale are dropped either way), or null if the rotation is arbitrary.
 */
function axisRotationOf(node) {
	if (!node) return null;
	let m;
	if (node.matrix) m = node.matrix;
	else if (node.rotation) m = matFromTRS([0, 0, 0], node.rotation, [1, 1, 1]);
	else return null;

	// normalise the columns: the wrapper scale is irrelevant, directions matter
	const cols = [0, 1, 2].map(i => {
		const v = [m[i * 4], m[i * 4 + 1], m[i * 4 + 2]];
		const len = Math.hypot(v[0], v[1], v[2]);
		return len > 1e-6 ? v.map(x => x / len) : null;
	});
	if (cols.some(c => !c)) return null;

	const used = new Set();
	for (const c of cols) {
		// exactly one component is ±1 and the rest zero, else it is not axis-aligned
		const nz = c.map((v, i) => [v, i]).filter(([v]) => Math.abs(v) > 1e-4);
		if (nz.length !== 1 || Math.abs(Math.abs(nz[0][0]) - 1) > 1e-4) return null;
		if (used.has(nz[0][1])) return null;      // two axes onto one is not a rotation
		used.add(nz[0][1]);
	}

	const rounded = cols.map(c => c.map(v => Math.round(v)));
	const matrix = [
		rounded[0][0], rounded[0][1], rounded[0][2], 0,
		rounded[1][0], rounded[1][1], rounded[1][2], 0,
		rounded[2][0], rounded[2][1], rounded[2][2], 0,
		0, 0, 0, 1,
	];
	return { matrix, quat: quatFromMat(matrix) };
}

/** Quaternion from a rotation matrix (column-major, as in glTF). */
function quatFromMat(m) {
	const [m00, m01, m02, , m10, m11, m12, , m20, m21, m22] = m;
	const tr = m00 + m11 + m22;
	if (tr > 0) {
		const s = Math.sqrt(tr + 1) * 2;
		return [(m12 - m21) / s, (m20 - m02) / s, (m01 - m10) / s, 0.25 * s];
	}
	if (m00 > m11 && m00 > m22) {
		const s = Math.sqrt(1 + m00 - m11 - m22) * 2;
		return [0.25 * s, (m10 + m01) / s, (m20 + m02) / s, (m12 - m21) / s];
	}
	if (m11 > m22) {
		const s = Math.sqrt(1 + m11 - m00 - m22) * 2;
		return [(m10 + m01) / s, 0.25 * s, (m21 + m12) / s, (m20 - m02) / s];
	}
	const s = Math.sqrt(1 + m22 - m00 - m11) * 2;
	return [(m20 + m02) / s, (m21 + m12) / s, 0.25 * s, (m01 - m10) / s];
}

function matFromTRS(t, q, s) {
	const [x, y, z, w] = q;
	const x2 = x + x, y2 = y + y, z2 = z + z;
	const xx = x * x2, xy = x * y2, xz = x * z2;
	const yy = y * y2, yz = y * z2, zz = z * z2;
	const wx = w * x2, wy = w * y2, wz = w * z2;
	return [
		(1 - (yy + zz)) * s[0], (xy + wz) * s[0], (xz - wy) * s[0], 0,
		(xy - wz) * s[1], (1 - (xx + zz)) * s[1], (yz + wx) * s[1], 0,
		(xz + wy) * s[2], (yz - wx) * s[2], (1 - (xx + yy)) * s[2], 0,
		t[0], t[1], t[2], 1,
	];
}

const matApply = (m, p) => [
	m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12],
	m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
	m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14],
];

/** Quaternions [x, y, z, w]. Needed to accumulate rest rotation down the tree. */
const qMul = (a, b) => [
	a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
	a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
	a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
	a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
];

/** base64 -> Uint8Array, without depending on the environment. */
function base64ToBytes(b64) {
	if (typeof atob === 'function') {
		const bin = atob(b64);
		const out = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
		return out;
	}
	return new Uint8Array(Buffer.from(b64, 'base64'));
}

/** Splits a .glb container into its JSON and binary chunks. */
function parseGLB(bytes) {
	const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	if (dv.getUint32(0, true) !== 0x46546C67) throw new Error('not a .glb file (missing glTF signature)');
	const total = dv.getUint32(8, true);
	let offset = 12, json = null, bin = null;
	while (offset < total) {
		const len = dv.getUint32(offset, true);
		const type = dv.getUint32(offset + 4, true);
		const start = offset + 8;
		if (type === 0x4E4F534A) json = JSON.parse(new TextDecoder().decode(bytes.subarray(start, start + len)));
		else if (type === 0x004E4942) bin = bytes.subarray(start, start + len);
		offset = start + len + (len % 4 ? 4 - (len % 4) : 0);
	}
	if (!json) throw new Error('.glb has no JSON chunk');
	return { json, bin };
}

/** Reads a whole accessor: an array of tuples sized by component count. */
function readAccessor(gltf, buffers, index) {
	const acc = gltf.accessors[index];
	const comp = GLTF_COMPONENTS[acc.componentType];
	if (!comp) throw new Error(`unknown componentType ${acc.componentType}`);
	const n = GLTF_TYPE_SIZE[acc.type];
	if (!n) throw new Error(`unknown accessor type ${acc.type}`);

	const out = [];
	if (acc.bufferView === undefined) {
		for (let i = 0; i < acc.count; i++) out.push(new Array(n).fill(0));
	} else {
		const view = gltf.bufferViews[acc.bufferView];
		const buf = buffers[view.buffer];
		if (!buf) throw new Error(`missing buffer ${view.buffer}`);
		const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
		const base = (view.byteOffset || 0) + (acc.byteOffset || 0);
		const stride = view.byteStride || comp.size * n;
		for (let i = 0; i < acc.count; i++) {
			const el = [];
			for (let c = 0; c < n; c++) el.push(comp.read(dv, base + i * stride + c * comp.size));
			out.push(el);
		}
	}

	// sparse accessors: some values are overridden
	if (acc.sparse) {
		const idxAcc = acc.sparse.indices, valAcc = acc.sparse.values;
		const idxView = gltf.bufferViews[idxAcc.bufferView];
		const valView = gltf.bufferViews[valAcc.bufferView];
		const idxComp = GLTF_COMPONENTS[idxAcc.componentType];
		const ib = buffers[idxView.buffer], vb = buffers[valView.buffer];
		const idv = new DataView(ib.buffer, ib.byteOffset, ib.byteLength);
		const vdv = new DataView(vb.buffer, vb.byteOffset, vb.byteLength);
		for (let i = 0; i < acc.sparse.count; i++) {
			const target = idxComp.read(idv, (idxView.byteOffset || 0) + (idxAcc.byteOffset || 0) + i * idxComp.size);
			const el = [];
			for (let c = 0; c < n; c++) {
				el.push(comp.read(vdv, (valView.byteOffset || 0) + (valAcc.byteOffset || 0) + (i * n + c) * comp.size));
			}
			out[target] = el;
		}
	}
	return out;
}

// ---------------------------------------------- animation maths (pure)

const qConj = q => [-q[0], -q[1], -q[2], q[3]];

/** Rotates a vector by a quaternion. */
function qRotate(q, v) {
	const [x, y, z, w] = q;
	const ix = w * v[0] + y * v[2] - z * v[1];
	const iy = w * v[1] + z * v[0] - x * v[2];
	const iz = w * v[2] + x * v[1] - y * v[0];
	const iw = -x * v[0] - y * v[1] - z * v[2];
	return [
		ix * w + iw * -x + iy * -z - iz * -y,
		iy * w + iw * -y + iz * -x - ix * -z,
		iz * w + iw * -z + ix * -y - iy * -x,
	];
}

/**
 * Channel value at an arbitrary point in time.
 *
 * Needed to put a bone's position and rotation keyframes on THE SAME times.
 * When the times differ the bone pose drifts apart in the editor — seen on
 * walking and run, where position had 5 marks and rotation only 3.
 */
function sampleChannel(ch, t) {
	const { times, values, path } = ch;
	if (t <= times[0]) return values[0];
	if (t >= times[times.length - 1]) return values[values.length - 1];
	let i = 0;
	while (i + 1 < times.length && times[i + 1] < t) i++;
	const k = (t - times[i]) / (times[i + 1] - times[i]);
	const a = values[i], b = values[i + 1];

	if (path === 'rotation') {
		// shortest arc: flip the second quaternion on an obtuse angle
		let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
		const sign = d < 0 ? -1 : 1;
		const out = a.map((v, j) => v + (b[j] * sign - v) * k);
		const len = Math.hypot(out[0], out[1], out[2], out[3]) || 1;
		return out.map(v => v / len);
	}
	return a.map((v, j) => v + (b[j] - v) * k);
}

/**
 * Bone rotation offset relative to the rest pose.
 *
 * Kept in the core so the very same formula can be run from Node
 * (tools/verify-animation.mjs) and not only judged by eye in the editor.
 */
function boneDeltaRotation(rest, parentQuat, value, preMultiply) {
	const q0inv = qConj(rest.rotation);
	const local = preMultiply ? qMul(q0inv, value) : qMul(value, q0inv);
	// the bone sits in the model frame, so the offset is converted into it too
	return qMul(qMul(parentQuat, local), qConj(parentQuat));
}

/**
 * Bone position offset, in pixels.
 *
 * @param deltaRot rotation offset of the same bone; only the 'rt' mode needs it
 *
 * The 'rt' mode pre-compensates the rotation: if Blockbench composes the local
 * matrix as R·T (offset INSIDE the rotation), the stored value arrives rotated,
 * and to get the intended offset it must be rotated back in advance.
 * Under a T·R composition no such correction is needed.
 */
function boneDeltaPosition(rest, parentQuat, value, mode, deltaRot) {
	const base = mode === 'absolute' ? [0, 0, 0] : rest.translation;
	const d = [value[0] - base[0], value[1] - base[1], value[2] - base[2]];
	let out = mode === 'local' ? d : qRotate(parentQuat, d);
	if (mode === 'rt' && deltaRot) out = qRotate(qConj(deltaRot), out);
	return [out[0] * 16, out[1] * 16, out[2] * 16];
}

/**
 * Parses glTF animations into a convenient shape.
 *
 * In glTF a channel holds ABSOLUTE TRS values of a node at every point in time,
 * while Blockbench and GeckoLib store animation as an OFFSET from the rest pose.
 * The conversion happens later, once each bone's rest pose is known — here we
 * only extract the data faithfully.
 */
function parseAnimations(gltf, buffers, warnings) {
	const out = [];
	for (const anim of gltf.animations || []) {
		const channels = [];
		let length = 0;
		for (const ch of anim.channels || []) {
			const sampler = anim.samplers[ch.sampler];
			if (!sampler || !ch.target || ch.target.node === undefined) continue;
			if (ch.target.path === 'weights') {
				warnings.push(`animation “${anim.name}”: morph targets are not supported`);
				continue;
			}
			try {
				const times = readAccessor(gltf, buffers, sampler.input).map(t => t[0]);
				const values = readAccessor(gltf, buffers, sampler.output);
				if (times.length) length = Math.max(length, times[times.length - 1]);
				channels.push({
					node: ch.target.node,
					path: ch.target.path,          // translation | rotation | scale
					interpolation: sampler.interpolation || 'LINEAR',
					times, values,
				});
			} catch (e) {
				warnings.push(`animation “${anim.name}”: channel skipped (${(e && e.message) || e})`);
			}
		}
		out.push({ name: anim.name || `animation_${out.length}`, length, channels });
	}
	return out;
}

/**
 * Packs textures into a single atlas.
 *
 * GeckoLib supports one texture per model, while exports can carry eight.
 * Shelf packing by descending height is enough: textures are almost always
 * powers of two and pack tightly.
 *
 * @param sizes [{width, height}]
 * @returns { width, height, rects: [{x, y, w, h}] }
 */
function packAtlas(sizes) {
	const order = sizes.map((s, i) => ({ i, w: s.width, h: s.height }))
		.sort((a, b) => b.h - a.h || b.w - a.w);
	const area = order.reduce((s, r) => s + r.w * r.h, 0);
	const pow2 = v => { let p = 1; while (p < v) p *= 2; return p; };

	// try widths from the smallest power of two upwards, take the first where
	// the total shelf height also fits into a power of two
	let best = null;
	for (let width = pow2(Math.max(Math.ceil(Math.sqrt(area)), order[0] ? order[0].w : 1)); width <= 8192; width *= 2) {
		const rects = new Array(sizes.length);
		let x = 0, y = 0, shelf = 0, ok = true;
		for (const r of order) {
			if (r.w > width) { ok = false; break; }
			if (x + r.w > width) { y += shelf; x = 0; shelf = 0; }
			rects[r.i] = { x, y, w: r.w, h: r.h };
			x += r.w;
			if (r.h > shelf) shelf = r.h;
		}
		if (!ok) continue;
		const height = pow2(y + shelf);
		best = { width, height, rects };
		if (height <= width) break;   // compact enough
	}
	return best || { width: 16, height: 16, rects: sizes.map(() => ({ x: 0, y: 0, w: 16, h: 16 })) };
}

/** Quaternion for a rotation about one axis, angle in degrees. */
function qAxis(axis, deg) {
	const h = (deg * Math.PI / 180) / 2;
	const q = [0, 0, 0, Math.cos(h)];
	q[axis] = Math.sin(h);
	return q;
}

/**
 * A global extra rotation for the whole model.
 *
 * Needed because up means different things to different exporters: a Sketchfab
 * export carries a Z-up -> Y-up conversion, but the author's original
 * orientation is invisible, so a model may still arrive lying down. There is no
 */
function correctionQuat(rot) {
	if (!rot) return [0, 0, 0, 1];
	let q = [0, 0, 0, 1];
	for (let a = 0; a < 3; a++) if (rot[a]) q = qMul(qAxis(a, rot[a]), q);
	return q;
}

/**
 * Picks the coordinate scale.
 *
 * A glTF unit means different things per exporter: for Blockbench it is a block
 * (16 px), for Sketchfab exports it is already a pixel. A hardcoded ×16 blew
 * such a model up 16 times (538 px across instead of 34).
 *
 * We take the scale that puts the largest dimension into a range reasonable for
 * Minecraft; all else being equal, 16 is preferred.
 */
const NICE_SCALES = [1 / 16, 1 / 8, 1 / 4, 1 / 2, 1, 2, 4, 8, 16, 32, 64];

/** Nearest round scale value (compared in log space). */
function snapScale(v) {
	let best = NICE_SCALES[0], bestErr = Infinity;
	for (const c of NICE_SCALES) {
		const err = Math.abs(Math.log(v / c));
		if (err < bestErr) { bestErr = err; best = c; }
	}
	return best;
}

/**
 * Coordinate scale from texel density.
 *
 * In Minecraft models one texture texel matches one model pixel, so the scale
 * follows from the ratio of areas: geometric versus UV.
 * We divide by 2 because textures are conventionally twice as detailed as the
 * geometry — on both verified models the ratio was exactly 2.
 *
 * @param objects objects with positions in glTF units and NORMALISED UV
 * @param sizeOf  texture size of an object: (image index) -> {width, height}
 *
 * The size comes from the object's OWN texture, not the project: after atlas
 * packing the project size became the atlas size, and a shared scale
 * overestimated density almost threefold.
 */
function texelScale(objects, sizeOf) {
	const ratios = [];
	for (const o of objects) {
	const tex = sizeOf ? sizeOf(o.image) : null;
	const k = tex ? Math.sqrt(tex.width * tex.height) : 1;
	for (const f of o.faces) {
		if (f.positions.length < 3 || !f.uvs[0] || !f.uvs[1] || !f.uvs[2]) continue;
		const [a, b, c] = f.positions, [ua, ub, uc] = f.uvs;
		const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
		const e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
		const cr = cross(e1, e2);
		const geom = len(cr) / 2;
		const uv = Math.abs((ub[0] - ua[0]) * (uc[1] - ua[1]) - (uc[0] - ua[0]) * (ub[1] - ua[1])) / 2;
		if (geom < 1e-12 || uv < 1e-12) continue;
		ratios.push(Math.sqrt(uv / geom) * k);
	}
	}
	if (!ratios.length) return 0;
	ratios.sort((x, y) => x - y);
	return ratios[ratios.length >> 1] / 2;   // the median resists outliers
}

/**
 * Picks the coordinate scale.
 *
 * A glTF unit means different things per exporter: for Blockbench it is a block
 * (16 px), for Sketchfab exports a pixel. Texel density is the main signal;
 * the bounding size is a sanity check and a fallback.
 */
function pickScale(sizeInUnits, texelHint) {
	const MIN = 4, MAX = 256;
	if (texelHint > 0) {
		const snapped = snapScale(texelHint);
		const px = sizeInUnits * snapped;
		if (px >= MIN && px <= MAX) return snapped;
	}
	for (const c of [16, 1, 1 / 16]) {
		const px = sizeInUnits * c;
		if (px >= MIN && px <= MAX) return c;
	}
	return snapScale(32 / (sizeInUnits || 1));
}

/**
 * Parses glTF from a set of files (as they sit inside a ZIP) into objects
 * suitable for solveBox.
 *
 * All three forms are supported: .gltf with an external .bin, .gltf with inline
 * base64, and binary .glb.
 *
 * @param files {name: Uint8Array}
 * @param opts.scale     coordinate scale (default 16: one glTF unit = one block)
 * @param opts.uvWidth   texture width in pixels; UV are scaled to it
 * @param opts.uvHeight  texture height
 * @returns { objects: [{name, faces}], images: [{name, mime, bytes}], warnings: [] }
 */
function parseGLTFFiles(files, opts) {
	const o = opts || {};
	const scale = o.scale === undefined ? 16 : o.scale;
	const uvW = o.uvWidth || 1, uvH = o.uvHeight || 1;
	const offset = o.offset || [0, 0, 0];
	// The outer scene node of a Sketchfab export carries the showcase placement
	// of the model: an arbitrary rotation and offset. That must be dropped, while
	// the axis conversion one level below (Z-up -> Y-up) must be kept.
	//
	// But only a REAL wrapper is dropped: the single scene root that has children
	// and no mesh of its own. With several roots, or a root carrying geometry,
	// its transform is meaningful — a broader rule broke the test fixtures where
	// all 108 objects are roots.
	const wantIgnoreRoot = o.ignoreRootTransform !== false;
	const warnings = [];

	const names = Object.keys(files);
	const lower = n => n.toLowerCase();
	const glbName = names.find(n => lower(n).endsWith('.glb'));
	const gltfName = names.find(n => lower(n).endsWith('.gltf'));
	if (!glbName && !gltfName) {
		// Sketchfab offers two kinds of archive: the autoconversion (glTF) and the
		// author's source. The latter holds .blend or .fbx, which nothing here can
		// open — and this used to be reported as a missing texture, misleading.
		const src = names.filter(n => /\.(blend1?|fbx|max|ma|mb|c4d|3ds|dae|obj)$/i.test(n))
			.map(n => n.replace(/^.*[/\\]/, ''));
		throw new Error(src.length
			? `This archive has no glTF model, only the author's source files: ${src.slice(0, 3).join(', ')}.\n`
				+ 'That is the “Original” download. You need the “glTF” (autoconverted) one: '
				+ 'the plugin requests it automatically, but when downloading by hand you must pick it from the format list.'
			: 'the archive contains neither .gltf nor .glb');
	}

	let gltf, glbBin = null;
	if (glbName) {
		const parsed = parseGLB(files[glbName]);
		gltf = parsed.json;
		glbBin = parsed.bin;
	} else {
		gltf = JSON.parse(new TextDecoder().decode(files[gltfName]));
	}

	// buffers: inline base64, a .glb chunk, or a neighbouring file in the archive
	const baseDir = (glbName || gltfName).replace(/[^/\\]*$/, '');
	const buffers = (gltf.buffers || []).map((b, i) => {
		if (!b.uri) {
			if (glbBin) return glbBin;
			throw new Error(`buffer ${i} has no uri and there is no binary chunk`);
		}
		if (b.uri.startsWith('data:')) return base64ToBytes(b.uri.slice(b.uri.indexOf(',') + 1));
		const want = decodeURIComponent(b.uri);
		const key = names.find(n => n === baseDir + want || n === want || lower(n).endsWith('/' + lower(want)));
		if (!key) throw new Error(`buffer file “${want}” is missing from the archive`);
		return files[key];
	});

	// Images. Blockbench embeds the texture into glTF as a data URI, but it can
	// equally be a separate file in the archive or a buffer chunk in a .glb —
	// all three cases are supported and raw bytes are returned.
	//
	// The order strictly follows glTF: objects reference an image by its index,
	// and simply skipping an unreadable one would shift every later index, so an
	// object would silently get someone else's texture. A placeholder without
	// bytes therefore stays in place of an unreadable image.
	const images = (gltf.images || []).map((img, i) => {
		try {
			if (img.uri && img.uri.startsWith('data:')) {
				const mime = (img.uri.slice(5, img.uri.indexOf(';')) || 'image/png');
				return {
					name: img.name || `texture_${i}.${mime.split('/')[1] || 'png'}`,
					mime,
					bytes: base64ToBytes(img.uri.slice(img.uri.indexOf(',') + 1)),
				};
			}
			if (img.uri) {
				const want = decodeURIComponent(img.uri);
				const key = names.find(n => n === baseDir + want || n === want
					|| lower(n).endsWith('/' + lower(want)) || lower(n).endsWith(lower(want)));
				if (key) return { name: want.replace(/^.*[/\\]/, ''), mime: sniffMime(files[key]), bytes: files[key] };
				warnings.push(`image “${want}” not found in the archive`);
				return { name: want.replace(/^.*[/\\]/, ''), missing: true };
			}
			if (img.bufferView !== undefined) {
				const view = gltf.bufferViews[img.bufferView];
				const buf = buffers[view.buffer];
				return {
					name: img.name || `texture_${i}.png`,
					mime: img.mimeType || 'image/png',
					bytes: buf.subarray(view.byteOffset || 0, (view.byteOffset || 0) + view.byteLength),
				};
			}
		} catch (e) {
			warnings.push(`image ${i} could not be extracted: ${(e && e.message) || e}`);
		}
		return { name: img.name || `texture_${i}`, missing: true };
	});

	// The archive may hold an image glTF does not reference — for instance when
	// the exporter lost the texture paths. We take anything suitable by content:
	// the extension is sometimes wrong, sometimes foreign entirely.
	if (!images.some(img => img.bytes)) {
		for (const n of names) {
			if (/\.(png|jpe?g|gif|webp|tga|bmp)$/i.test(n) && imageSize(files[n])) {
				images.push({ name: n.replace(/^.*[/\\]/, ''), mime: sniffMime(files[n]), bytes: files[n], role: 'color' });
				break;
			}
		}
	}

	// The role of each image. Next to colour, glTF carries normal, roughness and
	// emissive maps — meaningless in Minecraft, yet they used to enter the atlas
	// alongside colour: inflating it, throwing off texel density (hence the
	// giant size complaints) and glowing as a lilac patch on the model.
	const imageRole = new Map();
	const setRole = (texIdx, role) => {
		const t = (gltf.textures || [])[texIdx];
		if (!t || t.source === undefined) return;
		// colour wins: if an image is used as colour anywhere, it is a colour image
		if (role === 'color' || !imageRole.has(t.source)) imageRole.set(t.source, role);
	};
	for (const m of gltf.materials || []) {
		const pbr = m.pbrMetallicRoughness || {};
		if (pbr.baseColorTexture) setRole(pbr.baseColorTexture.index, 'color');
		if (pbr.metallicRoughnessTexture) setRole(pbr.metallicRoughnessTexture.index, 'aux');
		if (m.normalTexture) setRole(m.normalTexture.index, 'aux');
		if (m.emissiveTexture) setRole(m.emissiveTexture.index, 'aux');
		if (m.occlusionTexture) setRole(m.occlusionTexture.index, 'aux');
	}
	// With no colour usage at all nothing is treated as auxiliary: some exports
	// have no materials, and the single texture just sits in the archive.
	const anyColor = [...imageRole.values()].includes('color');
	images.forEach((img, i) => {
		if (img.role) return;                       // one picked from the archive is already tagged
		img.role = anyColor ? (imageRole.get(i) || 'aux') : 'color';
	});

	const objects = [];
	// The node hierarchy is needed twice: as GeckoLib bones and as animation
	// targets, which reference nodes by index.
	const hierarchy = [];
	const scene = gltf.scenes && gltf.scenes[gltf.scene || 0];
	const roots = scene ? scene.nodes : (gltf.nodes || []).map((_, i) => i);
	// The export wrapper: Sketchfab_model -> root -> GLTF_SceneRootNode.
	// The first node carries showcase placement (an arbitrary rotation and
	// offset), which we drop. An axis-aligned rotation in the chain is the
	// Z-up -> Y-up conversion, part of the model data, and it is kept.
	const WRAPPER_NAMES = ['sketchfab_model', 'root', 'gltf_scenerootnode',
		'rootnode (gltf orientation matrix)', 'rootnode (model correction matrix)'];
	// What to do with a wrapper node transform: 'drop' discards it entirely,
	// 'axis' keeps the rotation only, when it is axis-aligned.
	const skipSet = new Map();
	if (wantIgnoreRoot && roots.length === 1) {
		let idx = roots[0];
		while (idx !== undefined) {
			const n = gltf.nodes[idx];
			// a wrapper node: a known name, no geometry of its own
			if (!n || n.mesh !== undefined) break;
			if (!WRAPPER_NAMES.includes(String(n.name || '').toLowerCase())) break;
			// Two meanings live mixed together inside the wrapper.
			// An axis-aligned rotation is the coordinate-system conversion
			// (Z-up -> Y-up); without it the model lies on its side. An arbitrary
			// rotation and offset are the Sketchfab showcase placement, unrelated to
			// the geometry. Both used to be discarded, and users had to rotate by 90°
			// by hand — the single most common complaint.
			skipSet.set(idx, axisRotationOf(n) ? 'axis' : 'drop');
			// descend only along a single chain: the last wrapper node is exactly
			// the one that branches into the model contents
			const kids = n.children || [];
			idx = kids.length === 1 ? kids[0] : undefined;
		}
		for (const [i, mode] of skipSet) {
			const name = gltf.nodes[i].name;
			warnings.push(mode === 'axis'
				? `wrapper “${name}”: axis rotation kept, offset discarded`
				: `wrapper “${name}”: showcase placement discarded`);
		}
	}

	const visit = (nodeIndex, parent, parentIndex, parentQuat) => {
		const node = gltf.nodes[nodeIndex];
		if (!node) return;
		const wrap = skipSet.get(nodeIndex);
		const axisRot = wrap === 'axis' ? axisRotationOf(node) : null;
		const local = wrap === 'drop' ? matIdentity()
			: axisRot ? axisRot.matrix
			: node.matrix ? node.matrix
			: matFromTRS(node.translation || [0, 0, 0], node.rotation || [0, 0, 0, 1], node.scale || [1, 1, 1]);
		const world = matMul(parent, local);
		if (node.matrix && !wrap) warnings.push(`node “${node.name || nodeIndex}” uses a matrix — rest rotation for animations was not extracted`);
		const worldQuat = wrap === 'drop' ? parentQuat.slice()
			: qMul(parentQuat, (axisRot ? axisRot.quat : node.rotation) || [0, 0, 0, 1]);

		hierarchy.push({
			index: nodeIndex,
			name: node.name || `node_${nodeIndex}`,
			parent: parentIndex,
			// the bone pivot is the node origin in world space
			pivot: matApply(world, [0, 0, 0]).map((v, i) => v * scale + offset[i]),
			// A wrapper has no rest pose: animations never target it, and its
			// axis-aligned rotation is already in the children's world matrix.
			rest: wrap
				? { translation: [0, 0, 0], rotation: axisRot ? axisRot.quat : [0, 0, 0, 1], scale: [1, 1, 1] }
				: {
					translation: node.translation || [0, 0, 0],
					rotation: node.rotation || [0, 0, 0, 1],
					scale: node.scale || [1, 1, 1],
				},
			// The PARENT's rest rotation in world space. A Blockbench bone sits with
			// zero rotation, so its frame is the model frame, while the glTF offset
			// is expressed locally. Conjugating by this quaternion removes the
			// difference; without it the rotation axis comes out rotated.
			parentQuat: parentQuat.slice(),
			hasMesh: node.mesh !== undefined,
			objectIndex: node.mesh !== undefined ? objects.length : -1,
		});

		if (node.mesh !== undefined) {
			const mesh = gltf.meshes[node.mesh];
			const faces = [];
			// which image this object uses: material -> texture -> image
			let imageIndex = -1;
			for (const prim of mesh.primitives || []) {
				if (prim.mode !== undefined && prim.mode !== 4) {
					warnings.push(`${node.name || mesh.name}: primitive mode ${prim.mode} skipped (triangles required)`);
					continue;
				}
				const posIdx = prim.attributes && prim.attributes.POSITION;
				if (posIdx === undefined) continue;
				if (imageIndex < 0 && prim.material !== undefined) {
					const mat = (gltf.materials || [])[prim.material];
					const texRef = mat && mat.pbrMetallicRoughness && mat.pbrMetallicRoughness.baseColorTexture;
					const tex = texRef && (gltf.textures || [])[texRef.index];
					if (tex && tex.source !== undefined) imageIndex = tex.source;
				}
				const pos = readAccessor(gltf, buffers, posIdx).map(p => {
					const w = matApply(world, p);
					return [w[0] * scale + offset[0], w[1] * scale + offset[1], w[2] * scale + offset[2]];
				});
				const uvIdx = prim.attributes.TEXCOORD_0;
				// in glTF the UV origin is top-left and V points down,
				// which matches Blockbench, so no flipping is required
				// With an atlas layout given, UV are mapped into its coordinates:
				// each image occupies its own rectangle.
				const rect = o.uvRects && imageIndex >= 0 ? o.uvRects[imageIndex] : null;
				const uv = uvIdx === undefined ? null
					: readAccessor(gltf, buffers, uvIdx).map(t => rect
						? [t[0] * rect.w + rect.x, t[1] * rect.h + rect.y]
						: [t[0] * uvW, t[1] * uvH]);

				const idx = prim.indices === undefined
					? pos.map((_, i) => i)
					: readAccessor(gltf, buffers, prim.indices).map(a => a[0]);

				for (let i = 0; i + 2 < idx.length; i += 3) {
					const tri = [idx[i], idx[i + 1], idx[i + 2]];
					faces.push({
						positions: tri.map(k => pos[k]),
						uvs: tri.map(k => uv ? uv[k] : null),
					});
				}
			}
			if (faces.length) objects.push({ name: node.name || mesh.name || `object_${objects.length}`, faces, node: nodeIndex, image: imageIndex });
		}

		for (const child of node.children || []) visit(child, world, nodeIndex, worldQuat);
	};

	// The extra rotation is applied as the base coordinate system: it reaches
	// positions, bone pivots and accumulated rest rotations alike, so animations
	// stay consistent.
	const corr = correctionQuat(o.rotate);
	const base = matFromTRS([0, 0, 0], corr, [1, 1, 1]);
	for (const r of roots) visit(r, base, -1, corr.slice());

	return { objects, images, warnings, hierarchy, animations: parseAnimations(gltf, buffers, warnings) };
}

/**
 * Grid snapping. Numbers like -4.3979 or 0.0005 are technically correct but
 * impossible to work with in the editor, and a 0.25 px step is native to
 * Minecraft: that is how cubes are placed by hand.
 *
 * Angles are NOT snapped: a rotated cube legitimately has any angle, and
 * rounding to a quarter degree would break the joins. Clearing the
 * floating-point noise is enough there.
 */
/**
 * The six faces of a cube in WORLD coordinates.
 *
 * A cube's from/to are local: Blockbench rotates them about origin. So the
 * bounding box from center ± size/2 matches the real placement only for
 * unrotated cubes, and lies for the rest — including axis-aligned ones whose
 * basis is a permutation of axes (a 90° rotation).
 *
 * Coordinates are taken already snapped: separation must be computed on the
 * geometry that actually lands in the project.
 */
function cubeFaces(sol) {
	const place = placeCoords(sol);
	const half = sol.size.map(v => Math.abs(v) / 2);
	const from = place(sol.center.map((c, i) => c - half[i]));
	const to = place(sol.center.map((c, i) => c + half[i]));
	const origin = place(sol.center);
	const basis = [sol.vx, sol.vy, sol.vz];

	const lc = [0, 1, 2].map(i => (from[i] + to[i]) / 2);
	const lh = [0, 1, 2].map(i => (to[i] - from[i]) / 2);
	const toWorld = q => {
		const d = [q[0] - origin[0], q[1] - origin[1], q[2] - origin[2]];
		return [0, 1, 2].map(k => origin[k] + basis[0][k] * d[0] + basis[1][k] * d[1] + basis[2][k] * d[2]);
	};

	const faces = [];
	for (let ax = 0; ax < 3; ax++) {
		const [b1, b2] = [0, 1, 2].filter(x => x !== ax);
		for (const s of [-1, 1]) {
			const q = lc.slice();
			q[ax] += s * lh[ax];
			const c = toWorld(q);
			const n = basis[ax].map(v => v * s);
			faces.push({
				n, c,
				d: n[0] * c[0] + n[1] * c[1] + n[2] * c[2],
				u: basis[b1], v: basis[b2],
				hu: lh[b1], hv: lh[b2],
			});
		}
	}
	return faces;
}

/** Whether two rectangles lying in the same plane overlap. */
function faceRectsOverlap(f1, f2, eps) {
	const dot = (x, y) => x[0] * y[0] + x[1] * y[1] + x[2] * y[2];
	const D = [f2.c[0] - f1.c[0], f2.c[1] - f1.c[1], f2.c[2] - f1.c[2]];
	// Separating axis: if the projections fail to meet along any of the four
	// sides, the rectangles do not overlap. For rotated faces this is the only
	// way — their sides are not parallel to each other.
	const reach = (f, ax) => f.hu * Math.abs(dot(f.u, ax)) + f.hv * Math.abs(dot(f.v, ax));
	for (const ax of [f1.u, f1.v, f2.u, f2.v]) {
		if (Math.abs(dot(D, ax)) >= reach(f1, ax) + reach(f2, ax) - eps) return false;
	}
	return true;
}

/**
 * Separates cubes whose faces lie in the same plane.
 *
 * The GPU cannot decide which of two coincident faces is nearer, and the model
 * flickers (z-fighting). A hair-thin shift cures it, but coordinates must not
 * move: a clean 5 in the panel would become 4.99432, and editing the model by
 * hand would become impossible. So the inflate field is used instead: it grows
 * the cube evenly and lives apart from position and size.
 *
 * Hiding the redundant face instead is not an option: among coplanar faces
 * neither covers the other, they share a depth. Hiding the wrong one loses a
 * detail — the face overlay fitted flush into a head, for example.
 *
 * The SMALLER cube of a pair is always inflated: usually it is an overlay on
 * top of a base, and protruding outwards is natural for it. The amount
 * accumulates per layer so that three nested cubes land at three depths.
 *
 * Back-to-back joins (the bottom of one cube on the top of another) do not
 * flicker: those faces point opposite ways and are covered by the neighbour's
 * volume. They drop out on their own — the normal sign is part of the plane key.
 *
 * @param sols  solveBox results: { center, size, vx, vy, vz }
 * @returns { inflate, pairs, skipped }
 */
function resolveCoplanar(sols, step, limit) {
	const EPS = 1e-4;
	const INFLATE = step || 0.01;
	const MAX = limit || 20000;
	// How close two planes must be to count as coincident.
	// Snapping moves a rotated cube's face by hundredths of a pixel, and an exact
	// comparison would separate planes that still flicker on screen.
	const PLANE_TOL = 0.02;
	// The inflate ceiling. Kept small: a noticeable share of cubes gets inflated,
	// and on tightly packed details a large value would creep onto neighbours.
	const CAP = 0.05;
	const inflate = sols.map(() => 0);
	if (sols.length > MAX) return { inflate, pairs: 0, skipped: sols.length };

	const volume = sols.map(s => Math.abs(s.size[0] * s.size[1] * s.size[2]));
	const faces = sols.map(cubeFaces);

	// There can be thousands of cubes, and pairwise comparison is quadratic. Faces
	// go into buckets keyed by normal: only those actually sharing a plane and
	// facing the same way need comparing.
	const buckets = new Map();
	faces.forEach((list, i) => {
		for (const f of list) {
			const key = f.n.map(v => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(3)).join(',');
			let bucket = buckets.get(key);
			if (!bucket) buckets.set(key, bucket = []);
			bucket.push({ i, f });
		}
	});

	// Planes are compared with a tolerance rather than for exact equality.
	// Snapping moves a rotated cube's face by hundredths of a pixel, and exact
	// comparison would separate planes that flicker on screen regardless.
	const conflicts = [];
	for (const bucket of buckets.values()) {
		if (bucket.length < 2) continue;
		bucket.sort((x, y) => x.f.d - y.f.d);
		for (let x = 0; x < bucket.length; x++) {
			for (let y = x + 1; y < bucket.length && bucket[y].f.d - bucket[x].f.d <= PLANE_TOL; y++) {
				const A = bucket[x], B = bucket[y];
				if (A.i === B.i) continue;
				if (!faceRectsOverlap(A.f, B.f, EPS)) continue;
				conflicts.push([A.i, B.i]);
			}
		}
	}

	// Largest first: otherwise layers scatter and nested cubes receive a smaller
	// offset than the ones covering them.
	conflicts.sort((p, q) => Math.max(volume[q[0]], volume[q[1]]) - Math.max(volume[p[0]], volume[p[1]]));

	let pairs = 0, capped = 0;
	const seen = new Set();
	for (const [i, j] of conflicts) {
		const tag = Math.min(i, j) + '_' + Math.max(i, j);
		if (seen.has(tag)) continue;
		seen.add(tag);
		pairs++;
		const big = volume[i] >= volume[j] ? i : j;
		const small = big === i ? j : i;
		const want = inflate[big] + INFLATE;
		if (want > inflate[small]) {
			// Ceiling: inflation must stay below half the grid step, or the cube
			// grows visibly. Deep layers hit it and stop separating — better than
			// a visible distortion of shape.
			inflate[small] = Math.min(want, CAP);
			if (want > CAP) capped++;
		}
	}

	return { inflate, pairs, capped, skipped: 0 };
}


const GRID = 0.25;

// The thickness below which a cube counts as flat. Such cubes have degenerate
// side faces: zero area, visible only once the cube has been inflated.
//
const FLAT_LIMIT = 0.01;

// How close to a grid node a coordinate must already sit for pulling it in to
// make sense. This is noise cleanup, not reshaping.
const SNAP_TOLERANCE = 0.02;

/**
 * How a particular cube's coordinates are laid down.
 *
 * Straight cubes snap to the grid, skewed ones are merely rounded. The logic
 * must be THE SAME where a cube is created and where coplanar faces are looked
 * for: otherwise separation is computed on geometry the project never gets.
 */
function placeCoords(sol) {
	return snapSafely(sol) ? snapVec : tidyVec;
}

/** Rounding without snapping: clears noise, leaves the shape alone. */
function tidyVec(v) {
	return v.map(x => {
		const r = Math.round(x * 1000) / 1000;
		return Object.is(r, -0) ? 0 : r;
	});
}

/**
 * Whether this cube can be snapped to the grid without breaking anything.
 *
 * A 0.25 px grid is coarse for small details: a pupil of 0.6 × 0.7 × 0.001
 * became 0.75 × 0.75 × 0 after snapping — a quarter larger and with no
 * thickness left, so the overlay above the eye ended up exactly in the plane of
 * the head and vanished. Its mirror twin survived if it happened to be rotated,
 * and the two eyes came out different.
 *
 * So snapping happens only where it changes almost nothing: for cubes built on
 * the grid it is noise cleanup like 4.99998 -> 5, while an off-grid detail
 * keeps its exact numbers. Round figures are not worth a broken model.
 */
function snapSafely(sol) {
	// For a rotated cube origin takes part in vertex placement, and snapping it
	// apart from from/to drags the geometry — so it is forbidden there entirely.
	if (!isIdentityBasis(sol)) return false;

	// Snap only if the cube ALREADY sits on the grid: then it is noise cleanup
	// like 4.99998 -> 5. A model built off-grid cannot be pulled onto it —
	// 0.6 would become 0.75, a quarter of the detail's size.
	const half = sol.size.map(v => Math.abs(v) / 2);
	for (let i = 0; i < 3; i++) {
		const lo = sol.center[i] - half[i];
		const hi = sol.center[i] + half[i];
		if (Math.abs(lo - snapGrid(lo)) > SNAP_TOLERANCE) return false;
		if (Math.abs(hi - snapGrid(hi)) > SNAP_TOLERANCE) return false;
		// Both bounds may sit at ONE node, and then the detail collapses into a
		// plane. A thin overlay loses its protrusion this way, lands flush in the
		// neighbour's face and disappears: exactly what happened to the pupil.
		if (Math.abs(hi - lo) > 1e-9 && Math.abs(snapGrid(hi) - snapGrid(lo)) < 1e-9) return false;
	}
	return true;
}

/**
 * Whether the cube stands unrotated: its basis matches the world axes.
 *
 * Precisely this case, not axis-aligned in general. A 90° rotation is also
 * axis-aligned, but its matrix is no longer the identity, and origin starts
 * affecting vertex placement again.
 */
function isIdentityBasis(sol) {
	const want = [sol.vx, sol.vy, sol.vz];
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (Math.abs(want[i][j] - (i === j ? 1 : 0)) > 1e-6) return false;
		}
	}
	return true;
}
function snapGrid(v, step) {
	const s = step || GRID;
	const r = Math.round(v / s) * s;
	// -0 prints as "-0" and looks like a bug
	return Object.is(r, -0) ? 0 : r;
}
function snapVec(v, step) { return v.map(x => snapGrid(x, step)); }

/** Angles: strip floating-point noise but keep the value. */
function snapAngle(deg) {
	const r = Math.round(deg * 100) / 100;
	return Object.is(r, -0) ? 0 : r;
}


/**
 * Whether the model has a ready glTF download.
 *
 * Sketchfab offers several archives: the autoconversion (gltf/glb) and the
 * author's source (.blend, .fbx, .max). Nothing here can open the latter. Some
 * models have no autoconversion at all and the field arrives with zero size.
 *
 * If the response has no archives field at all (an older API), assume glTF
 * exists: better to show too much than to hide everything.
 */
function hasGltfArchive(m) {
	if (!m || !m.archives) return true;
	const ok = a => a && typeof a.size === 'number' && a.size > 0;
	return ok(m.archives.gltf) || ok(m.archives.glb);
}

// ------------------------------------------------------------ Node export

if (typeof Plugin === 'undefined') {
	if (typeof module !== 'undefined') {
		module.exports = {
			solveBox, detectBox, orientations, assignFaces, countUVViolations, buildFaceUV,
			FACE_DIRS, FACE_NAMES,
			parseGLTFFiles, parseGLB, parseAnimations, readAccessor, matMul, matFromTRS, matApply, matIdentity,
			qMul, qConj, qRotate, boneDeltaRotation, boneDeltaPosition, sampleChannel, pickScale, snapScale, texelScale, correctionQuat, packAtlas, splitComponents, boxFromBounds, isDegenerate, imageSize, sniffMime, axisRotationOf, quatFromMat, triangleNormal, snapGrid, snapVec, snapAngle, isIdentityBasis, placeCoords, snapSafely, tidyVec, hasGltfArchive, resolveCoplanar, cubeFaces, faceRectsOverlap,
		};
	}
	return;
}

// ---------------------------------------------------- Blockbench integration

/**
 * Blockbench composes a cube rotation through THREE.Euler, and the axis order
 * depends on version and format. Guessing is not an option, so we ask
 * Blockbench itself: create a temporary cube and read order off its THREE object.
 */
// ZYX is what Blockbench actually returned when measured. Kept as a fallback
// in case the probe fails.
let EULER_ORDER = 'ZYX';
function detectEulerOrder() {
	try {
		const probe = new Cube({ from: [0, 0, 0], to: [1, 1, 1], origin: [0, 0, 0], rotation: [10, 20, 30] }).init();
		const order = probe.mesh && probe.mesh.rotation && probe.mesh.rotation.order;
		probe.remove();
		if (order) EULER_ORDER = order;
	} catch (e) {
		console.warn(`[geckolib-import] could not detect Euler order, falling back to ${EULER_ORDER}`, e);
	}
	return EULER_ORDER;
}

/**
 * Measures the UV convention from Blockbench itself.
 *
 * A probe cube is created, a deliberately asymmetric rectangle [0,0,4,8] is put
 * on every face, and the resulting geometry is read back: each pair of (vertex
 * position, its UV) shows which way u and v grow on that face.
 * No assumptions about the convention — measurement only.
 *
 * @returns {string} what was determined, for the report
 */
function calibrateFaceDirs() {
	const FACE_BY_NORMAL = {
		'0,0,-1': 'north', '0,0,1': 'south',
		'1,0,0': 'east', '-1,0,0': 'west',
		'0,1,0': 'up', '0,-1,0': 'down',
	};
	// round to the nearest axis direction
	const axisOf = v => {
		const a = [Math.abs(v[0]), Math.abs(v[1]), Math.abs(v[2])];
		const i = a.indexOf(Math.max(...a));
		const out = [0, 0, 0];
		out[i] = v[i] > 0 ? 1 : -1;
		return out;
	};

	let probe = null;
	try {
		probe = new Cube({
			from: [0, 0, 0], to: [16, 16, 16], origin: [8, 8, 8],
			box_uv: false, autouv: 0, name: '__probe__',
		}).init();
		for (const name of FACE_NAMES) probe.faces[name].uv = [0, 0, 4, 8];
		if (Canvas.updateUV) Canvas.updateUV(probe); else Canvas.updateAll();

		const geo = probe.mesh && probe.mesh.geometry;
		const posAttr = geo && geo.attributes && geo.attributes.position;
		const uvAttr = geo && geo.attributes && geo.attributes.uv;
		if (!posAttr || !uvAttr) throw new Error('cube has no position/uv attributes');
		if (posAttr.count !== 24) throw new Error(`expected 24 vertices, got ${posAttr.count}`);

		const pos = posAttr.array, buv = uvAttr.array;
		// The centre comes from the geometry itself rather than our assumptions:
		// Blockbench builds a cube relative to origin, not to zero.
		const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
		for (let k = 0; k < 24; k++) for (let a = 0; a < 3; a++) {
			const c = pos[k * 3 + a];
			if (c < lo[a]) lo[a] = c;
			if (c > hi[a]) hi[a] = c;
		}
		const mid = [0, 1, 2].map(a => (lo[a] + hi[a]) / 2);
		const half = [0, 1, 2].map(a => (hi[a] - lo[a]) / 2);
		const tol = Math.max(...half) * 1e-3;

		// The V axis in the buffer may be flipped (WebGL counts bottom-up).
		// The rectangle was placed flush against the edge: unflipped its minimum is
		// exactly 0, flipped its maximum is exactly 1.
		let vlo = Infinity, vhi = -Infinity;
		for (let k = 0; k < 24; k++) {
			const v = buv[k * 2 + 1];
			if (v < vlo) vlo = v;
			if (v > vhi) vhi = v;
		}
		const flipped = !(vlo < 0.001);

		const found = {};
		for (let f = 0; f < 6; f++) {
			const verts = [];
			for (let i = 0; i < 4; i++) {
				const k = f * 4 + i;
				verts.push({
					pos: [0, 1, 2].map(a => pos[k * 3 + a] - mid[a]),
					// work straight in buffer coordinates so as not to depend on
					// texture size; only the ordering matters, not the scale
					bu: buv[k * 2],
					bv: flipped ? -buv[k * 2 + 1] : buv[k * 2 + 1],
				});
			}
			// face normal: the one axis on which all four vertices agree
			let normal = null;
			for (let a = 0; a < 3 && !normal; a++) {
				const v0 = verts[0].pos[a];
				if (Math.abs(Math.abs(v0) - half[a]) > tol) continue;
				if (verts.every(v => Math.abs(v.pos[a] - v0) < tol)) {
					normal = [0, 0, 0];
					normal[a] = v0 > 0 ? 1 : -1;
				}
			}
			const name = normal && FACE_BY_NORMAL[normal.join(',')];
			if (!name) continue;

			// the rectangle starts at the corner with the smallest u and v
			const ulo = Math.min(...verts.map(v => v.bu));
			const vlo2 = Math.min(...verts.map(v => v.bv));
			const base = verts.find(v => Math.abs(v.bu - ulo) < 1e-6 && Math.abs(v.bv - vlo2) < 1e-6);
			if (!base) continue;
			const uEnd = verts.find(v => Math.abs(v.bv - base.bv) < 1e-6 && v.bu - base.bu > 1e-6);
			const vEnd = verts.find(v => Math.abs(v.bu - base.bu) < 1e-6 && v.bv - base.bv > 1e-6);
			if (!uEnd || !vEnd) continue;

			found[name] = { normal, u: axisOf(sub(uEnd.pos, base.pos)), v: axisOf(sub(vEnd.pos, base.pos)) };
		}

		const missing = FACE_NAMES.filter(n => !found[n]);
		if (missing.length) {
			// report what was actually seen, or debugging turns into guesswork
			throw new Error(`could not read faces: ${missing.join(', ')}`
				+ ` | bounds [${lo.map(v => v.toFixed(1))}]…[${hi.map(v => v.toFixed(1))}]`
				+ ` | bufV ${vlo.toFixed(3)}…${vhi.toFixed(3)}, flipped=${flipped}`
				+ ` | faces read: ${Object.keys(found).length}`);
		}

		const changed = FACE_NAMES.filter(n =>
			FACE_DIRS[n].u.join() !== found[n].u.join() || FACE_DIRS[n].v.join() !== found[n].v.join());
		FACE_DIRS = found;

		const table = FACE_NAMES.map(n => `${n}: u=[${found[n].u}] v=[${found[n].v}]`).join('\n  ');
		return `UV convention measured from Blockbench (V ${flipped ? 'flipped' : 'direct'}).\n` +
			`  Mismatches against the fallback table: ${changed.length}${changed.length ? ' (' + changed.join(', ') + ')' : ''}\n  ${table}`;
	} catch (e) {
		return `Could not measure the UV convention (${(e && e.message) || e}), using the fallback table.`;
	} finally {
		if (probe) { try { probe.remove(); } catch (e) { /* already gone */ } }
	}
}

/** World coordinates of a mesh vertex (vertices are stored local to origin). */
function meshVertexToWorld(mesh, v) {
	const rot = mesh.rotation || [0, 0, 0];
	let p = v;
	if (rot[0] || rot[1] || rot[2]) {
		const e = new THREE.Euler(
			THREE.MathUtils.degToRad(rot[0]),
			THREE.MathUtils.degToRad(rot[1]),
			THREE.MathUtils.degToRad(rot[2]),
			EULER_ORDER
		);
		const vec = new THREE.Vector3(v[0], v[1], v[2]).applyEuler(e);
		p = [vec.x, vec.y, vec.z];
	}
	return add(p, mesh.origin || [0, 0, 0]);
}

/** Converts a Blockbench mesh into the normalised input for solveBox. */
function meshToFaces(mesh) {
	const world = {};
	for (const vkey in mesh.vertices) world[vkey] = meshVertexToWorld(mesh, mesh.vertices[vkey]);

	const faces = [];
	for (const fkey in mesh.faces) {
		const face = mesh.faces[fkey];
		if (!face.vertices || !face.vertices.length) continue;
		faces.push({
			positions: face.vertices.map(vkey => world[vkey]),
			uvs: face.vertices.map(vkey => (face.uv && face.uv[vkey]) || null),
			texture: face.texture,
		});
	}
	return faces;
}

/**
 * Builds a Cube from a solveBox result. Shared by both paths: converting meshes
 * in an open project, and importing from a ZIP.
 */
function cubeFromSolution(name, sol, textureUUID, inflate) {
	const m = new THREE.Matrix4().makeBasis(
		new THREE.Vector3(...sol.vx),
		new THREE.Vector3(...sol.vy),
		new THREE.Vector3(...sol.vz)
	);
	const e = new THREE.Euler().setFromRotationMatrix(m, EULER_ORDER);

	// Only UNROTATED cubes may be snapped to the grid.
	//
	// A rotated cube's vertex sits at origin + R·(p - origin), so an origin
	// snapped separately from from/to drags the whole geometry along: on real
	// models vertices moved by up to 0.46 px and rectangular details turned
	// skewed. For an unrotated cube R = I, origin drops out of the formula and
	// does not affect placement at all — snapping is safe there.
	//
	// Rotated ones keep exact values with only the noise cleared: a cube at 37°
	// will not sit on a 0.25 grid anyway.
	const place = placeCoords(sol);

	const half = mul(sol.size, 0.5);
	const from = place(sub(sol.center, half));
	const to = place(add(sol.center, half));
	const cube = new Cube({
		name,
		from,
		to,
		origin: place(sol.center),
		rotation: [
			snapAngle(THREE.MathUtils.radToDeg(e.x)),
			snapAngle(THREE.MathUtils.radToDeg(e.y)),
			snapAngle(THREE.MathUtils.radToDeg(e.z)),
		],
		box_uv: false,
		autouv: 0,
		// A hair of inflation against flicker on coincident faces. Zero is not
		// written, to keep the field clean on cubes that do not need it.
		inflate: inflate || 0,
	});

	// A flat cube has four side faces of zero area: invisible, though they do
	// carry UV. Inflation gives them thickness and they show up as a band of
	// stretched pixel: the outline that was never there before. So degenerate
	// faces are hidden whenever a cube is inflated.
	const degenerate = {};
	if (inflate) {
		const AXIS_FACES = [['east', 'west'], ['up', 'down'], ['north', 'south']];
		for (let i = 0; i < 3; i++) {
			// The FINAL thickness is used, not the original: snapping collapses
			// details thinner than 0.125 px to zero, and by their original size they
			// would not count as flat yet.
			if (Math.abs(to[i] - from[i]) >= FLAT_LIMIT) continue;
			for (let j = 0; j < 3; j++) {
				if (j === i) continue;
				for (const f of AXIS_FACES[j]) degenerate[f] = true;
			}
		}
	}

	for (const fname of FACE_NAMES) {
		const cf = cube.faces[fname];
		if (sol.faceUV[fname] && !degenerate[fname]) {
			cf.uv = sol.faceUV[fname];
			if (textureUUID) cf.texture = textureUUID;
		} else {
			cf.texture = null;   // the face was absent in the source, or is degenerate
		}
	}
	return cube;
}

function convertMesh(mesh, opts) {
	const faces = meshToFaces(mesh);
	const sol = solveBox(faces, opts);
	if (sol.error) return { error: sol.error };

	const texture = faces.find(f => f.texture)?.texture
		|| (Texture.all.length ? Texture.all[0].uuid : null);
	const cube = cubeFromSolution(mesh.name, sol, texture);

	return {
		cube, basis: [sol.vx, sol.vy, sol.vz],
		emptyFaces: sol.emptyFaces, violations: sol.violations, mirrored: sol.mirrored,
	};
}

/**
 * How far the cube's actual orientation drifted from the intended one, in degrees.
 *
 * We set the rotation with Euler angles, and Blockbench builds a matrix from
 * them in its own axis order. If the order or a sign disagrees the cube ends up
 * wrong, and that is measured here instead of trusting a guessed EULER_ORDER.
 */
function rotationError(cube, basis) {
	try {
		const e = cube.mesh && cube.mesh.rotation;
		if (!e) return null;
		let worst = 0;
		[[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach((axis, i) => {
			const got = new THREE.Vector3(...axis).applyEuler(e);
			const want = basis[i];
			const cos = Math.min(1, Math.max(-1, got.x * want[0] + got.y * want[1] + got.z * want[2]));
			worst = Math.max(worst, Math.acos(cos) * 180 / Math.PI);
		});
		return worst;
	} catch (err) {
		return null;
	}
}

// ------------------------------------------------------------- action

function runConversion(options) {
	const meshes = Mesh.all.filter(m => !options.selected_only || m.selected);
	if (!meshes.length) {
		Blockbench.showQuickMessage('No meshes found', 2000);
		return;
	}
	if (Project && Project.box_uv) {
		Blockbench.showMessageBox({
			title: 'Box UV is enabled',
			message: 'This project uses Box UV, but the converter assigns UV per face.\n' +
				'Turn Box UV off in the project settings and run again.',
		});
		return;
	}

	detectEulerOrder();
	const calibration = calibrateFaceDirs();
	console.log('[geckolib-import] ' + calibration);

	Undo.initEdit({ elements: meshes, outliner: true, selection: true });

	const created = [], failed = [], rotated = [], mirrors = [], badRotation = [];
	let hiddenFaces = 0;
	const opts = { mirror: options.mirror_mode !== 'off' };

	for (const mesh of meshes) {
		let r;
		try { r = convertMesh(mesh, opts); }
		catch (err) { r = { error: String((err && err.message) || err) }; }

		if (r.error) { failed.push(`${mesh.name}: ${r.error}`); continue; }

		r.cube.addTo(mesh.parent);
		r.cube.init();
		created.push(r.cube);
		hiddenFaces += r.emptyFaces.length;
		if (r.violations) rotated.push(`${mesh.name}: ${r.violations} UV mismatches`);
		if (r.mirrored) mirrors.push(`${mesh.name} (${r.mirrored})`);

		const err = rotationError(r.cube, r.basis);
		if (err !== null && err > 0.5) badRotation.push(`${mesh.name}: ${err.toFixed(1)}°`);
	}

	// source meshes are removed only if everything converted
	if (options.delete_meshes && !failed.length) {
		for (const mesh of meshes) mesh.remove();
	}

	Undo.finishEdit('Convert meshes to cubes', { elements: created, outliner: true });
	Canvas.updateAll();

	const lines = [
		`Meshes processed: ${meshes.length}`,
		`Cubes created: ${created.length}`,
		`Not converted: ${failed.length}`,
		`Faces hidden (absent in the source): ${hiddenFaces}`,
		`Mirrored UV: ${opts.mirror ? 'as in source' : 'disabled'}`,
		`Mirrored cubes: ${mirrors.length}`,
		`Euler angle order: ${EULER_ORDER}`,
		`Cubes with a wrong rotation: ${badRotation.length}`,
		'',
		calibration,
	];
	if (badRotation.length) {
		lines.push('', 'ROTATION MISMATCH (wrong Euler angle order):',
			...badRotation.slice(0, 10));
		if (badRotation.length > 10) lines.push(`…and ${badRotation.length - 10} more`);
	}
	if (mirrors.length) {
		lines.push('', 'Mirrored: ' + mirrors.join(', '));
	}
	if (failed.length) {
		lines.push('', 'Failed:', ...failed.slice(0, 20));
		if (failed.length > 20) lines.push(`…and ${failed.length - 20} more`);
		if (options.delete_meshes) lines.push('', 'Source meshes were kept — there were errors.');
	}
	if (rotated.length) {
		lines.push('', 'The texture may be rotated:', ...rotated.slice(0, 10));
	}
	console.log('[geckolib-import]\n' + lines.join('\n'));
	Blockbench.showMessageBox({ title: 'Mesh → Cubes', message: lines.join('\n') });
}

// --------------------------------------------------------- import from ZIP

/**
 * Image size straight from the header — needed before the texture exists,
 * because it defines the project's UV space.
 *
 * Understands PNG, JPEG, GIF and WebP. PNG alone is not enough: on Sketchfab
 * textures are usually JPEG, and while only PNG was parsed such archives failed
 * with texture not found — even though the image was right there.
 */
function imageSize(bytes) {
	if (!bytes || bytes.length < 24) return null;
	const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

	// PNG: signature, then IHDR with width and height straight away.
	if (dv.getUint32(0) === 0x89504E47) return { width: dv.getUint32(16), height: dv.getUint32(20) };

	// GIF: 'GIF8', size lives in the logical screen descriptor, little-endian.
	if (dv.getUint32(0) === 0x47494638) return { width: dv.getUint16(6, true), height: dv.getUint16(8, true) };

	// WebP: 'RIFF'...'WEBP', then three sub-formats with different layouts.
	if (dv.getUint32(0) === 0x52494646 && dv.getUint32(8) === 0x57454250) {
		const tag = dv.getUint32(12);
		if (tag === 0x56503820 && bytes.length > 30) {          // 'VP8 ' — lossy
			return { width: dv.getUint16(26, true) & 0x3FFF, height: dv.getUint16(28, true) & 0x3FFF };
		}
		if (tag === 0x5650384C && bytes.length > 25) {          // 'VP8L' — lossless
			const b = dv.getUint32(21, true);
			return { width: (b & 0x3FFF) + 1, height: ((b >> 14) & 0x3FFF) + 1 };
		}
		if (tag === 0x56503858 && bytes.length > 30) {          // 'VP8X' extended
			return {
				width: (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)) + 1,
				height: (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)) + 1,
			};
		}
		return null;
	}

	// JPEG: walk the markers until SOFn, which holds the dimensions. Segments
	// must be skipped by their length, otherwise it is easy to hit payload bytes
	// that happen to look like a marker.
	if (dv.getUint16(0) === 0xFFD8) {
		let p = 2;
		while (p + 9 < bytes.length) {
			if (bytes[p] !== 0xFF) { p++; continue; }
			const marker = bytes[p + 1];
			if (marker === 0xFF || marker === 0x01 || (marker >= 0xD0 && marker <= 0xD9)) { p += 2; continue; }
			const len = dv.getUint16(p + 2);
			// SOFn (except DHT/JPG/DAC — 0xC4, 0xC8, 0xCC) carry the frame size.
			if (marker >= 0xC0 && marker <= 0xCF && marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC) {
				return { width: dv.getUint16(p + 7), height: dv.getUint16(p + 5) };
			}
			if (len < 2) return null;
			p += 2 + len;
		}
	}
	return null;
}

/** The old name is kept: tests and external callers use it. */
const pngSize = imageSize;

/** Image type from its first bytes: the archive extension cannot be trusted. */
function sniffMime(bytes) {
	if (!bytes || bytes.length < 12) return 'image/png';
	const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	if (dv.getUint32(0) === 0x89504E47) return 'image/png';
	if (dv.getUint16(0) === 0xFFD8) return 'image/jpeg';
	if (dv.getUint32(0) === 0x47494638) return 'image/gif';
	if (dv.getUint32(0) === 0x52494646 && dv.getUint32(8) === 0x57454250) return 'image/webp';
	return 'image/png';
}

function bytesToBase64(bytes) {
	let bin = '';
	const step = 0x8000;   // in chunks, or a large array blows the stack
	for (let i = 0; i < bytes.length; i += step) {
		bin += String.fromCharCode.apply(null, bytes.subarray(i, i + step));
	}
	return btoa(bin);
}

/**
 * Axis order for a BONE rotation. For a cube it is already measured (ZYX), but
 * a group may differ, so it is measured separately, the same way.
 */
let BONE_EULER_ORDER = 'ZYX';
let BONE_ROT_SIGN = [1, 1, 1];

/**
 * Measures how Blockbench turns a bone angle into a real rotation: axis order
 * and per-axis sign. Bone signs can well differ from cube ones — assuming them
 * blindly was tried already and cost several rounds.
 */
function calibrateBoneRotation() {
	let probe = null;
	try {
		probe = new Group({ name: '__probe_rot__' }).init();
		const refresh = () => {
			if (Canvas.updateAllBones) Canvas.updateAllBones([probe]);
			else if (Canvas.updateView) Canvas.updateView({ groups: [probe] });
			else Canvas.updateAll();
		};

		probe.rotation = [10, 20, 30];
		refresh();
		if (!probe.mesh || !probe.mesh.rotation) throw new Error('group has no mesh.rotation');
		BONE_EULER_ORDER = probe.mesh.rotation.order || BONE_EULER_ORDER;

		const signs = [1, 1, 1];
		for (let a = 0; a < 3; a++) {
			const rot = [0, 0, 0];
			rot[a] = 30;
			probe.rotation = rot;
			refresh();
			const got = [probe.mesh.rotation.x, probe.mesh.rotation.y, probe.mesh.rotation.z][a];
			signs[a] = got < 0 ? -1 : 1;
		}
		BONE_ROT_SIGN = signs;
		return `Bone rotations measured: order ${BONE_EULER_ORDER}, signs [${signs.join(', ')}]`;
	} catch (e) {
		return `Could not measure bone rotations (${(e && e.message) || e}), using ${BONE_EULER_ORDER} with signs [1, 1, 1]`;
	} finally {
		if (probe) { try { probe.remove(); } catch (e) { /* already gone */ } }
	}
}

/**
 * Measures which frame Blockbench applies a bone offset in.
 *
 * No more guessing: a probe offset is set along each axis, the frame is played,
 * and we look where the bone actually went. That yields a matrix M for which
 * actual offset = M · (written value). Inverting it is then enough to write
 * the value we want.
 *
 * If measuring fails (the API is missing) null is returned and we fall back to
 * the mode chosen in the dialog.
 */
function probeBonePositionFrame(groupByNode, parsed, report) {
	let anim = null;
	try {
		// Pick the bone with the LARGEST rest pose: only there is it visible whether
		// the mere presence of a keyframe moves the bone. A previous probe took a
		// bone with a zero rest pose and therefore could not notice this.
		const animated = new Set();
		for (const a of parsed.animations) for (const c of a.channels) animated.add(c.node);
		let target = null, best = -1;
		for (const h of parsed.hierarchy) {
			if (!groupByNode[h.index] || h.parent < 0 || !animated.has(h.index)) continue;
			const restLen = Math.hypot(h.rest.translation[0], h.rest.translation[1], h.rest.translation[2]) * 16;
			// A bone with a ROTATED parent is more valuable: only there is the
			// difference between local and model modes visible. A previous probe took
			// a bone with an identity parent and could not tell the modes apart.
			const score = restLen * (Math.abs(h.parentQuat[3]) < 0.999 ? 100 : 1);
			if (score > best) { best = score; target = h; }
		}
		if (!target) { report.push('Offset probe: no suitable bone found'); return null; }
		const group = groupByNode[target.index];

		const worldOf = g => {
			if (!g.mesh || !g.mesh.getWorldPosition) return null;
			if (g.mesh.updateWorldMatrix) g.mesh.updateWorldMatrix(true, false);
			const v = new THREE.Vector3();
			g.mesh.getWorldPosition(v);
			return [v.x, v.y, v.z];
		};

		anim = new Animation({ name: '__probe_pos__', loop: 'hold', length: 0.1 }).add();
		if (anim.select) anim.select();
		const animator = anim.getBoneAnimator(group);
		if (!animator) { report.push('Offset probe: no animator'); return null; }

		const play = t => {
			if (typeof Timeline !== 'undefined' && Timeline.setTime) Timeline.setTime(t);
			if (typeof Animator !== 'undefined' && Animator.preview) Animator.preview();
		};

		play(0);
		const rest = worldOf(group);
		if (!rest) { report.push('Offset probe: cannot read the bone world position'); return null; }

		const measure = (x, y, z) => {
			animator.position = [];
			animator.createKeyframe({ x, y, z }, 0, 'position', false, false);
			play(0);
			const now = worldOf(group);
			return [now[0] - rest[0], now[1] - rest[1], now[2] - rest[2]];
		};

		// THE key measurement: a keyframe holding zero. If the bone moves, the value
		// replaces the rest pose rather than adding to it.
		const snap = measure(0, 0, 0);
		const snapLen = Math.hypot(snap[0], snap[1], snap[2]);

		const cols = [measure(10, 0, 0), measure(0, 10, 0), measure(0, 0, 10)]
			.map(d => d.map((v, i) => (v - snap[i]) / 10));

		const fmt = c => '[' + c.map(v => v.toFixed(2)).join(', ') + ']';
		const targetRest = Math.hypot(target.rest.translation[0], target.rest.translation[1], target.rest.translation[2]) * 16;
		const targetRotated = Math.abs(target.parentQuat[3]) < 0.999;
		report.push(`Offset probe: bone “${target.name}”, rest pose ${targetRest.toFixed(1)} px,`
			+ ` parent ${targetRotated ? 'is rotated' : 'is not rotated'}`);
		report.push(`  a ZERO keyframe moves the bone by ${snapLen.toFixed(2)} px ${fmt(snap)}`);
		report.push(`  response: X→${fmt(cols[0])} Y→${fmt(cols[1])} Z→${fmt(cols[2])}`);

		// A zero response means the preview did not recompute, not that the bone
		// stayed put. Telling these apart is essential: otherwise an empty
		// measurement would masquerade as a meaningful conclusion.
		const moved = cols.some(c => c.some(v => Math.abs(v) > 0.01));
		if (!moved) {
			report.push('  the preview did not update — the probe measured nothing, mode comes from the dialog');
			return null;
		}
		report.push(snapLen > 0.5
			? `  CONCLUSION: the value REPLACES the bone offset — absolute values needed (${snapLen.toFixed(1)} px off)`
			: '  CONCLUSION: the value is ADDED to the rest pose — write offsets');
		return { cols, snap };
	} catch (e) {
		report.push(`Offset probe failed: ${(e && e.message) || e}`);
		return null;
	} finally {
		try {
			if (anim && anim.remove) anim.remove();
			else if (anim) {
				const i = Animation.all.indexOf(anim);
				if (i >= 0) Animation.all.splice(i, 1);
			}
		} catch (e) { /* not critical */ }
	}
}

/**
 * Measures the angle convention INSIDE ANIMATION KEYFRAMES.
 *
 * Until now signs were measured on a static group rotation, but
 * Bedrock-compatible formats use a different angle convention in animations
 * than in the model, and that was the last unverified spot.
 *
 * A keyframe rotating about a single axis is set on a bone, applied via
 * displayFrame(), and we look where the bone actually turned.
 */
function calibrateAnimRotation(groupByNode, parsed, report) {
	let anim = null;
	try {
		const h = parsed.hierarchy.find(x => groupByNode[x.index] && x.parent >= 0);
		if (!h) { report.push('Animation angle probe: no suitable bone'); return; }
		const group = groupByNode[h.index];

		anim = new Animation({ name: '__probe_rot__', loop: 'hold', length: 0.1 }).add();
		if (anim.select) anim.select();
		const animator = anim.getBoneAnimator(group);
		if (!animator) { report.push('Animation angle probe: no animator'); return; }

		const signs = [1, 1, 1];
		let measured = 0;
		for (let a = 0; a < 3; a++) {
			const data = { x: 0, y: 0, z: 0 };
			data[['x', 'y', 'z'][a]] = 30;
			animator.rotation = [];
			animator.createKeyframe(data, 0, 'rotation', false, false);
			if (typeof Timeline !== 'undefined' && Timeline.setTime) Timeline.setTime(0);
			try { if (animator.displayFrame) animator.displayFrame(); } catch (e) { /* handled below */ }
			const r = group.mesh && group.mesh.rotation;
			if (!r) continue;
			const got = [r.x, r.y, r.z][a];
			if (Math.abs(got) > 1e-4) { signs[a] = got < 0 ? -1 : 1; measured++; }
		}
		if (measured === 3) {
			BONE_ROT_SIGN = signs;
			report.push(`Animation angles measured: signs [${signs.join(', ')}]`);
		} else {
			report.push(`Animation angle probe: measured ${measured} of 3 axes, signs left as [${BONE_ROT_SIGN.join(', ')}]`);
		}
	} catch (e) {
		report.push(`Animation angle probe failed: ${(e && e.message) || e}`);
	} finally {
		try {
			if (anim && anim.remove) anim.remove();
			else if (anim) { const i = Animation.all.indexOf(anim); if (i >= 0) Animation.all.splice(i, 1); }
		} catch (e) { /* not critical */ }
	}
}

/**
 * Compares where bones actually stand in Blockbench with where the glTF data
 * says they must be.
 *
 * This is the measurement that was missing all along: keyframe values can each
 * be checked individually and found correct, and the model will still drift
 * apart. Here the end result is compared, so an error shows up as a miss
 * vector: a swapped axis, a wrong sign or a stray factor can all be read
 * straight off it.
 */
function verifyAnimationPose(parsed, groupByNode, report) {
	try {
		const anim = Animation.all.find(a => a.name && parsed.animations.some(x => x.name === a.name
			&& x.channels.some(c => c.path === 'translation')));
		if (!anim) { report.push('Pose check: no animation with position channels found'); return; }
		const src = parsed.animations.find(x => x.name === anim.name);

		// Only animate mode computes the pose: in edit mode Animator.preview()
		// recomputes nothing and the measurement returns the rest pose.
		let restored = false;
		if (typeof Modes !== 'undefined' && Modes.options && Modes.options.animate) {
			Modes.options.animate.select();
			restored = true;
		}
		if (anim.select) anim.select();
		if (typeof Timeline !== 'undefined' && Timeline.setTime) Timeline.setTime(0);
		if (typeof Animator !== 'undefined' && Animator.preview) Animator.preview();

		// Animator.preview() recomputed the pose in neither mode, so each animator
		// is asked to apply the frame directly. We also watch whether anything
		// changed at all, or the measurement returns the rest pose and lies again.
		let applied = 0;
		for (const key in anim.animators) {
			const an = anim.animators[key];
			try {
				if (an.displayFrame) { an.displayFrame(); applied++; }
				else if (an.displayPosition && an.displayRotation) { an.displayRotation(); an.displayPosition(); applied++; }
			} catch (e) { /* try the rest */ }
		}
		report.push(`  animators applied directly: ${applied}`);
		if (typeof Canvas !== 'undefined' && Canvas.updateAllBones) Canvas.updateAllBones();

		// glTF pose at t=0: first keyframe for animated nodes, rest pose for others
		const at0 = {};
		for (const c of src.channels) {
			if (!c.values.length) continue;
			(at0[c.node] = at0[c.node] || {})[c.path] = c.values[0];
		}
		const byIdx = {};
		for (const h of parsed.hierarchy) byIdx[h.index] = h;

		const worldOf = index => {
			const chain = [];
			for (let h = byIdx[index]; h; h = h.parent >= 0 ? byIdx[h.parent] : null) chain.unshift(h);
			let m = matIdentity();
			for (const h of chain) {
				const o = at0[h.index] || {};
				m = matMul(m, matFromTRS(
					o.translation || h.rest.translation,
					o.rotation || h.rest.rotation,
					h.rest.scale));
			}
			return matApply(m, [0, 0, 0]).map(v => v * 16);
		};

		// Walk EVERY animated bone and sort by depth: an ancestor's error drags its
		// whole subtree along, so it matters where the divergence appears FIRST,
		// rather than admiring its consequences on the leaves.
		const depthOf = h => { let d = 0; for (let c = h; c && c.parent >= 0; c = byIdx[c.parent]) d++; return d; };
		const animatedNodes = [...new Set(src.channels.map(c => c.node))];
		const rows = [];
		for (const index of animatedNodes) {
			const h = byIdx[index], g = groupByNode[index];
			if (!h || !g || !g.mesh || !g.mesh.getWorldPosition) continue;
			if (g.mesh.updateWorldMatrix) g.mesh.updateWorldMatrix(true, false);
			const v = new THREE.Vector3();
			g.mesh.getWorldPosition(v);
			const want = worldOf(index);
			const err = [v.x - want[0], v.y - want[1], v.z - want[2]];
			rows.push({ name: h.name, index, depth: depthOf(h), err, got: [v.x, v.y, v.z], len: Math.hypot(err[0], err[1], err[2]) });
		}
		rows.sort((a, b) => a.depth - b.depth || b.len - a.len);

		report.push(`Pose check for ${anim.name} at t=0 (by depth):`);
		for (const r of rows.slice(0, 8)) {
			report.push(`  [${r.depth}] ${r.name}: off by ${r.len.toFixed(2)} px`
				+ ` (${r.err.map(n => n.toFixed(2)).join(', ')})`);
		}
		// A self-check: if every bone sits exactly in its rest pose, the animation
		// had NOT been applied by the time of reading, and the misses are merely
		// the gap between rest and target pose. Such a measurement is useless and
		// must not be passed off as a result.
		const atRest = rows.every(r => {
			const h = byIdx[r.index];
			return h && Math.hypot(r.got[0] - h.pivot[0], r.got[1] - h.pivot[1], r.got[2] - h.pivot[2]) < 0.05;
		});
		if (atRest && rows.length) {
			report.push('  WARNING: every bone sits in its rest pose — the animation had not been applied');
			report.push('  by the time of measurement, so the numbers above mean nothing');
		} else {
			const firstBad = rows.find(r => r.len > 0.5);
			report.push(firstBad
				? `  FIRST diverging bone: ${firstBad.name} at depth ${firstBad.depth}, off by ${firstBad.len.toFixed(2)} px`
				: '  every animated bone is in place');
		}
		if (restored && Modes.options.edit) Modes.options.edit.select();
		if (!rows.length) report.push('  could not read bone positions');
	} catch (e) {
		report.push(`Pose check failed: ${(e && e.message) || e}`);
	}
}

/**
 * Transfers glTF animations onto Blockbench bones.
 *
 * The main subtlety: a glTF channel holds the node's ABSOLUTE pose, while
 * Blockbench stores an OFFSET from the rest pose. In the reference model 88 of
 * 142 nodes have a non-identity rest pose, so values cannot be taken as they
 * are: rotation becomes R(t)·R0⁻¹ and translation T(t)-T0.
 */
function applyAnimations(parsed, groupByNode, report, opts) {
	if (!parsed.animations.length) return;
	if (opts && opts.animations === false) {
		report.push(`Animations skipped by setting (the archive has ${parsed.animations.length}).`);
		return;
	}
	if (typeof Animation === 'undefined') {
		report.push('Animations skipped: the Animation class is unavailable in this build.');
		return;
	}
	report.push(calibrateBoneRotation());
	probeBonePositionFrame(groupByNode, parsed, report);
	calibrateAnimRotation(groupByNode, parsed, report);
	const preMultiply = !!(opts && opts.anim_order === 'pre');
	// Position channel modes:
	//   big      only offsets above the threshold, the rest are skipped (default)
	//   model    offset conjugated by the parent's rest rotation
	//   local    offset from rest WITHOUT conjugation
	//   absolute write T(t) as it is
	//   skip     do not transfer
	//
	// The mode was chosen by calculation, not by eye: tools/verify-animation.mjs
	// assembles a pose from our keyframes and compares it with the true glTF pose
	// across every animation and six time points. Of sixteen combinations exactly
	// one gives a zero miss: model + R(t)·R0⁻¹. The gap between model and local is
	// only 0.19 px, so the setting is indistinguishable by eye and picking it
	const posMode = (opts && opts.positions) || 'big';
	const withPositions = posMode !== 'skip';
	// Threshold: small offsets sit on bones that drag whole subtrees, doing more
	// harm than good. Large ones are exactly what the eye can see.
	const alignTimes = !!(opts && opts.align_times);
	// The threshold defaults to 0, so every offset is transferred. A value of 2 px
	// muted small offsets and served as insurance while animations were being
	// sorted out; it now remains a lever in the advanced settings in case bones
	// drift apart in an animation.
	const posMinDelta = posMode === 'big'
		? (opts && typeof opts.pos_threshold === 'number' ? opts.pos_threshold : 0)
		: 0;
	const deltaMode = posMode === 'big' ? 'model' : posMode;
	// Print what actually arrived from the dialog: if a setting fails to reach
	// here, both options give the same picture and that looks like a mystery.
	report.push(`Rotation formula: ${preMultiply ? 'R0⁻¹·R(t)' : 'R(t)·R0⁻¹'}`
		+ ` (from dialog: ${opts ? JSON.stringify(opts.anim_order) : 'nothing'})`);
	report.push(`Position channels: ${posMode}` + (posMode === 'big' ? ` (threshold ${posMinDelta} px)` : ''));

	// parentQuat lives on the node itself, not inside rest: taking only h.rest
	// would silently give the conjugation an identity quaternion and do nothing
	const restOf = {};
	for (const h of parsed.hierarchy) {
		restOf[h.index] = {
			translation: h.rest.translation,
			rotation: h.rest.rotation,
			scale: h.rest.scale,
			parentQuat: h.parentQuat,
		};
	}

	let ok = 0, failed = 0;
	// Everything that can silently fail is counted: without these numbers
	// debugging animations turns into guesswork.
	let noGroup = 0, noAnimator = 0, keyframes = 0, kfErrors = '';
	let posSkipped = 0, maxPosDelta = 0, maxPosApplied = 0, posConjugated = 0, resampled = 0;
	const lostMotion = [], poses = [];

	for (const a of parsed.animations) {
		try {
			// Some animations are static poses: zero length, one keyframe, rotations
			// that never change. They must be held rather than played instantly,
			// otherwise it looks like an animation a millisecond long.
			const isPose = a.length < 1e-6;
			if (isPose) poses.push(a.name);
			const anim = new Animation({
				name: a.name,
				loop: isPose ? 'hold' : 'loop',
				length: isPose ? 0.25 : a.length,
			}).add();

			// When creating a keyframe Blockbench touches the SELECTED animation, and
			// without one it fails on `null.setLength()`. The keyframes still get
			// written, but some settings are not applied — hence the drift.
			try { if (anim.select) anim.select(); } catch (e) { /* fallback below */ }
			if (typeof Animation !== 'undefined' && !Animation.selected) Animation.selected = anim;

			// channels of one node go into a single animator
			const byNode = {};
			for (const ch of a.channels) (byNode[ch.node] = byNode[ch.node] || []).push(ch);

			for (const nodeIndex in byNode) {
				const group = groupByNode[nodeIndex];
				if (!group) { noGroup++; continue; }
				const animator = anim.getBoneAnimator(group);
				if (!animator) { noAnimator++; continue; }
				const rest = restOf[nodeIndex] || { translation: [0, 0, 0], rotation: [0, 0, 0, 1] };

				// Position and rotation channels are placed on THE SAME times.
				// When the times differ, the bone pose drifts apart in the editor:
				// exactly walking and run broke, where position had 5 marks and rotation
				// only 3. Wherever the times matched, or there was no rotation,
				// everything worked. The size of the offset had nothing to do with it.
				const chans = byNode[nodeIndex].filter(c => c.path !== 'scale');
				const rotCh = chans.find(c => c.path === 'rotation');
				let posCh = chans.find(c => c.path === 'translation');

				if (posCh) {
					let chMax = 0;
					for (const v of posCh.values) {
						chMax = Math.max(chMax, Math.hypot(
							v[0] - rest.translation[0],
							v[1] - rest.translation[1],
							v[2] - rest.translation[2]) * 16);
					}
					if (!withPositions || chMax < posMinDelta) {
						posSkipped += posCh.times.length;
						if (chMax > maxPosDelta) maxPosDelta = chMax;
						if (chMax > 0.3) lostMotion.push(`${a.name}/${group.name} ${chMax.toFixed(2)}px`);
						posCh = null;
					}
				}
				if (!rotCh && !posCh) continue;

				const q0 = new THREE.Quaternion(rest.rotation[0], rest.rotation[1], rest.rotation[2], rest.rotation[3]);
				const q0inv = q0.clone().invert();
				// The rest pose is baked into the cubes' world coordinates while the
				// bone sits at zero rotation, so its frame is the model frame. The glTF
				// offset, however, is computed in the node's LOCAL frame; conjugating by
				// the parent's rest rotation converts one into the other.
				const pq = rest.parentQuat || [0, 0, 0, 1];
				const qp = new THREE.Quaternion(pq[0], pq[1], pq[2], pq[3]);
				const qpInv = qp.clone().invert();

				// Time alignment is a hypothesis guarded by its own flag. Without it
				// each channel is written on its own times, exactly as in glTF.
				const timeSet = new Set();
				if (alignTimes) {
					if (rotCh) for (const t of rotCh.times) timeSet.add(+t.toFixed(6));
					if (posCh) for (const t of posCh.times) timeSet.add(+t.toFixed(6));
				}
				const times = [...timeSet].sort((x, y) => x - y);
				// a bone whose channels sat on different times is the very one that
				// broke the pose; count them to see the fix working
				if (rotCh && posCh && (rotCh.times.length !== times.length || posCh.times.length !== times.length)) resampled++;

				const writeAt = (t, useRot, usePos) => {
					// Blockbench stores keyframe values as strings and parses them as
					// Molang expressions. A number like 4.8e-8 arrives in scientific
					// notation where e is not a digit; parsing can yield NaN and then the
					// whole bone flies off, though the useful magnitude is one pixel.
					// So noise is pinned to zero and the rest is rounded.
					const clean = v => {
						if (!isFinite(v) || Math.abs(v) < 1e-4) return 0;
						return Math.round(v * 1e4) / 1e4;
					};
					const write = (raw, channel) => {
						const data = { x: clean(raw.x), y: clean(raw.y), z: clean(raw.z) };
						try {
							const kf = animator.createKeyframe(data, t, channel, false, false);
							if (kf) {
								keyframes++;
								// Interpolation is set EXPLICITLY. glTF uses linear, while
								// Blockbench also has catmullrom and bezier; smoothing over
								// sparse oscillating values (legs in walking: +1, 0, -1, 0, +1)
								// overshoots far beyond the given points.
								try { kf.interpolation = 'linear'; } catch (e) { /* may be read-only */ }
							} else if (!kfErrors) kfErrors = 'createKeyframe returned nothing';
						} catch (err) {
							if (!kfErrors) kfErrors = `createKeyframe threw: ${(err && err.message) || err}`;
						}
					};

					if (rotCh && useRot) {
						const v = sampleChannel(rotCh, t);
						const q = new THREE.Quaternion(v[0], v[1], v[2], v[3]);
						const local = preMultiply ? q0inv.clone().multiply(q) : q.clone().multiply(q0inv);
						const delta = qp.clone().multiply(local).multiply(qpInv);
						const e = new THREE.Euler().setFromQuaternion(delta, BONE_EULER_ORDER);
						write({
							x: THREE.MathUtils.radToDeg(e.x) * BONE_ROT_SIGN[0],
							y: THREE.MathUtils.radToDeg(e.y) * BONE_ROT_SIGN[1],
							z: THREE.MathUtils.radToDeg(e.z) * BONE_ROT_SIGN[2],
						}, 'rotation');
					}
					if (posCh && usePos) {
						const v = sampleChannel(posCh, t);
						const base = deltaMode === 'absolute' ? [0, 0, 0] : rest.translation;
						const d = new THREE.Vector3(v[0] - base[0], v[1] - base[1], v[2] - base[2]);
						if (deltaMode !== 'local') d.applyQuaternion(qp);
						// Pre-compensation: if the editor applies the offset INSIDE the
						// bone rotation, the stored value arrives rotated. We rotate it
						// back in advance by that bone's rotation at this moment.
						if (deltaMode === 'rt' && rotCh) {
							const rv = sampleChannel(rotCh, t);
							const rq = new THREE.Quaternion(rv[0], rv[1], rv[2], rv[3]);
							const rlocal = preMultiply ? q0inv.clone().multiply(rq) : rq.clone().multiply(q0inv);
							const rdelta = qp.clone().multiply(rlocal).multiply(qpInv);
							d.applyQuaternion(rdelta.clone().invert());
						}
						maxPosApplied = Math.max(maxPosApplied, d.length() * 16);
						if (deltaMode !== 'local' && Math.abs(qp.w) < 0.999999) posConjugated++;
						write({ x: d.x * 16, y: d.y * 16, z: d.z * 16 }, 'position');
					}
				};

				if (alignTimes) {
					for (const t of times) writeAt(t, true, true);
				} else {
					if (rotCh) for (const t of rotCh.times) writeAt(t, true, false);
					if (posCh) for (const t of posCh.times) writeAt(t, false, true);
				}
			}
			// the length is recomputed from the actual keyframes: a value set in
			// advance may not match what really landed
			try { if (anim.setLength) anim.setLength(); } catch (e) { /* optional */ }
			ok++;
		} catch (e) {
			failed++;
			report.push(`  animation ${a.name}: ${(e && e.message) || e}`);
		}
	}

	// verify the keyframes really settled into the project rather than vanishing
	let stored = 0, animators = 0;
	try {
		for (const anim of Animation.all) {
			for (const key in anim.animators) {
				animators++;
				const an = anim.animators[key];
				for (const ch of ['rotation', 'position', 'scale']) {
					if (an[ch] && an[ch].length) stored += an[ch].length;
				}
			}
		}
	} catch (e) { /* not critical */ }

	verifyAnimationPose(parsed, groupByNode, report);

	// Return the model to its rest pose. Otherwise the last animation stays
	// selected, Blockbench shows the pose FROM IT, and that is indistinguishable
	// from the cubes having been assembled in the wrong places.
	try {
		if (typeof Animation !== 'undefined') Animation.selected = null;
		if (typeof Timeline !== 'undefined' && Timeline.setTime) Timeline.setTime(0);
		if (typeof Modes !== 'undefined' && Modes.options && Modes.options.edit) Modes.options.edit.select();
	} catch (e) { report.push(`  could not restore the rest pose: ${(e && e.message) || e}`); }

	report.push(`Animations transferred: ${ok}, failed: ${failed} (bone axis order: ${BONE_EULER_ORDER})`);
	report.push(`  keyframes created: ${keyframes}, stored in project: ${stored}, animators: ${animators}`);
	report.push(`  time alignment: ${alignTimes ? `on, bones resampled ${resampled}` : 'off'}`);
	if (posSkipped) {
		report.push(`  position channels skipped: ${posSkipped} keyframes, largest dropped offset ${maxPosDelta.toFixed(2)} px`);
		if (lostMotion.length) {
			const top = lostMotion.sort((x, y) => parseFloat(y.split(' ').pop()) - parseFloat(x.split(' ').pop()));
			report.push(`  largest dropped: ${top.slice(0, 8).join(', ')}`);
		}
	} else if (maxPosApplied) {
		report.push(`  largest applied offset: ${maxPosApplied.toFixed(2)} px`
			+ `, conjugations applied: ${posConjugated}`);
	}
	if (noGroup) report.push(`  channels without a bone: ${noGroup}`);
	if (noAnimator) report.push(`  bones without an animator: ${noAnimator}`);
	if (poses.length) report.push(`  static poses (held, not played): ${poses.join(', ')}`);
	if (kfErrors) report.push(`  first keyframe error: ${kfErrors}`);
	const skipped = parsed.animations.reduce((s, a) => s + a.channels.filter(c => c.path === 'scale').length, 0);
	if (skipped) report.push(`  scale channels skipped: ${skipped} — GeckoLib does not animate them`);
}

/**
 * Draws every texture into one atlas and returns a data URL.
 *
 * Asynchronous because the images must be decoded. The project texture is
 * created immediately and its content filled in once ready, so the whole import
 * does not have to be restructured around waiting.
 */
function buildAtlasDataURL(images, layout) {
	return new Promise(resolve => {
		try {
			const canvas = document.createElement('canvas');
			canvas.width = layout.width;
			canvas.height = layout.height;
			const ctx = canvas.getContext('2d');
			ctx.imageSmoothingEnabled = false;   // pixel art, no smoothing
			let pending = images.length;
			if (!pending) return resolve(canvas.toDataURL());
			images.forEach((img, i) => {
				const el = new Image();
				const done = () => { if (--pending === 0) resolve(canvas.toDataURL()); };
				el.onload = () => {
					const r = layout.rects[i];
					try { ctx.drawImage(el, r.x, r.y, r.w, r.h); } catch (e) { /* skip a broken one */ }
					done();
				};
				el.onerror = done;
				el.src = 'data:' + (img.mime || 'image/png') + ';base64,' + bytesToBase64(img.bytes);
			});
		} catch (e) {
			resolve(null);
		}
	});
}

/** Builds a project from an unpacked archive. */
function buildFromFiles(files, sourceName, opts, meta) {
	const report = [];
	// Import numbers are collected apart from the report text: they are what
	// later shows how failing models differ.
	const stats = { source: sourceName };
	const markKey = meta && meta.key;
	const remember = () => recordModel(markKey, Object.assign({ stats }, meta));

	// A probe parse in glTF units: both the texture size and the model bounds are
	// needed to pick the coordinate scale.
	let probe;
	const rotate = [
		Number((opts && opts.rot_x) || 0),
		Number((opts && opts.rot_y) || 0),
		0,
	];
	try { probe = parseGLTFFiles(files, { scale: 1, uvWidth: 1, uvHeight: 1, rotate }); }
	catch (e) { Blockbench.showMessageBox({ title: 'Import failed', message: String((e && e.message) || e) }); return; }

	// Objects reference an image by its glTF index, and unreadable ones fall out
	// of the list, so the indices shift after filtering. A map from glTF index to
	// atlas index is kept, otherwise an object silently receives someone else's
	// piece of texture.
	const sized = probe.images.map(img => ({ ...img, size: imageSize(img.bytes) }));
	// Only colour goes into the atlas: normal and roughness maps are useless in
	// Minecraft yet take up just as much room.
	const usable = img => !!img.size && img.role !== 'aux';
	const images = sized.filter(usable);
	const remap = [];
	let next = 0;
	sized.forEach((img, i) => { remap[i] = usable(img) ? next++ : -1; });

	if (!images.length) {
		const what = sized.length
			? `Images in the archive: ${sized.length}, but none usable as colour `
				+ '(PNG, JPEG, GIF and WebP are supported).'
			: 'No images were found in the archive.';
		Blockbench.showMessageBox({ title: 'Import failed', message: what });
		return;
	}
	const aux = sized.filter(img => img.size && img.role === 'aux').length;
	const unread = sized.filter(img => !img.size).length;
	if (aux) report.push(`Auxiliary maps skipped: ${aux} (normals, specular) — unused in Minecraft`);
	if (unread) report.push(`Images skipped: ${unread} — format not recognised`);

	// The main texture is the one most objects use: its size defines the
	// project's UV space.
	const usage = {};
	for (const o of probe.objects) {
		const i = remap[o.image];
		if (i >= 0) usage[i] = (usage[i] || 0) + 1;
	}
	let mainIndex = 0, mainCount = -1;
	images.forEach((img, i) => { if ((usage[i] || 0) > mainCount) { mainCount = usage[i] || 0; mainIndex = i; } });

	// Every texture is packed into one atlas: GeckoLib supports one per model, and
	// differing sizes cannot otherwise coexist in a shared project UV space.
	// For a single image the atlas degenerates into that image.
	const layout = packAtlas(images.map(img => img.size));
	const needAtlas = images.length > 1;
	const size = { width: layout.width, height: layout.height };
	if (needAtlas) {
		report.push(`Textures in archive: ${images.length} → packed into a ${layout.width}×${layout.height} atlas`);
	}

	// Coordinate scale: for Blockbench a glTF unit is a block, for Sketchfab
	// exports it is already a pixel. A hardcoded ×16 blew such models up 16 times.
	let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
	for (const o of probe.objects) for (const f of o.faces) for (const q of f.positions) {
		for (let a = 0; a < 3; a++) { if (q[a] < lo[a]) lo[a] = q[a]; if (q[a] > hi[a]) hi[a] = q[a]; }
	}
	const sizeUnits = Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) || 1;
	stats.sizeUnits = +sizeUnits.toFixed(3);
	stats.images = images.length;
	// Formats go into the journal: without them there is no view of what archives
	// actually arrive — and eight models failed unnoticed on exactly this.
	stats.formats = [...new Set(sized.map(i => (i.mime || '?').replace('image/', '')))].join(',');
	if (images.length < sized.length) stats.imagesSkipped = sized.length - images.length;
	stats.atlas = layout.width + 'x' + layout.height;
	// Texel density is computed on the probe parse: there the UV are normalised
	// and the size is taken from each object's own texture.
	const density = texelScale(probe.objects, i => images[remap[i] >= 0 ? remap[i] : mainIndex].size);

	// How much UV spills outside its texture. In glTF that is legal — the texture
	// tiles — but an atlas cannot tile: the coordinate wanders onto a neighbouring
	// image. Prime suspect for the broken texture complaints, so it is measured
	// and written into the journal.
	let uvTotal = 0, uvOutside = 0, noMaterial = 0;
	for (const o of probe.objects) {
		if (o.image < 0) noMaterial++;
		for (const f of o.faces) {
			for (const uv of f.uvs || []) {
				if (!uv) continue;
				uvTotal++;
				if (uv[0] < -1e-4 || uv[0] > 1 + 1e-4 || uv[1] < -1e-4 || uv[1] > 1 + 1e-4) uvOutside++;
			}
		}
	}
	stats.uvOutside = uvTotal ? +(100 * uvOutside / uvTotal).toFixed(1) : 0;
	stats.noMaterial = noMaterial;
	if (stats.uvOutside > 0.5) {
		report.push(`UV outside the texture: ${stats.uvOutside}% — in glTF that means tiling, `
			+ 'but an atlas cannot tile, so the texture may land wrong');
	}

	const custom = Number((opts && opts.scale_custom) || 0);
	const autoScale = pickScale(sizeUnits, density);
	const chosenScale = custom > 0
		? custom
		: (opts && opts.scale_mode && opts.scale_mode !== 'auto')
			? Number(opts.scale_mode)
			: autoScale;

	// Both the algorithm's suggestion and the human's choice go into the journal.
	// The giant size complaint appears 20 times in the notes, but tweaking the
	// coefficient blindly would mean changing two variables at once. First we
	// collect auto/manual pairs: they show whether there is a systematic bias and
	// in which direction, not merely that someone disliked the result.
	stats.autoScale = autoScale;
	stats.scaleSource = custom > 0 ? 'manual' : (opts && opts.scale_mode !== 'auto') ? 'from list' : 'auto';
	if (chosenScale !== autoScale) stats.scaleRatio = +(chosenScale / autoScale).toFixed(3);
	stats.rotX = rotate[0];
	stats.rotY = rotate[1];
	stats.recenter = !!(opts && opts.recenter);
	report.push(`Coordinate scale: ${chosenScale}`
		+ (custom > 0 ? ' (set manually)' : density > 0 ? ` (from texel density ${density.toFixed(2)})` : '')
		+ ` — bounds ${sizeUnits.toFixed(2)} units → ${(sizeUnits * chosenScale).toFixed(1)} px`);
	// Auto-detection relies on conventions, and those do not always hold.
	// Neighbouring options are shown so a manual choice can be an informed one.
	report.push('  other options: ' + [chosenScale * 4, chosenScale * 2, chosenScale / 2, chosenScale / 4]
		.map(c => `×${c} → ${(sizeUnits * c).toFixed(0)} px`).join(', '));

	// Centre it the Minecraft way: X and Z to zero, the bottom on the ground.
	// The bounds are already in glTF units, so we simply multiply.
	// Centring used to be OFF by default: a model may have a meaningful position
	// relative to the origin, and moving it unasked is wrong. The offset is
	// computed and printed regardless, so it is visible whether turning it on
	// makes sense.
	let offset = [0, 0, 0];
	const wouldOffset = [
		-((lo[0] + hi[0]) / 2) * chosenScale,
		-lo[1] * chosenScale,
		-((lo[2] + hi[2]) / 2) * chosenScale,
	];
	if (opts && opts.recenter) {
		offset = wouldOffset;
		report.push(`Model moved to centre by [${offset.map(v => v.toFixed(1)).join(', ')}] px`);
	} else if (wouldOffset.some(v => Math.abs(v) > 1)) {
		report.push(`Model sits off-centre by [${wouldOffset.map(v => v.toFixed(1)).join(', ')}] px`);
		report.push('  enable Centre the model if that is a problem');
	}

	// Licence: most downloadable models require attribution, and losing that
	// information during import is not acceptable.
	const licenseKey = Object.keys(files).find(n => /license[.]txt$/i.test(n));
	if (licenseKey) {
		const text = new TextDecoder().decode(files[licenseKey]).trim();
		report.push('Licence from the archive:');
		for (const l of text.split(String.fromCharCode(10)).map(x => x.trim()).filter(Boolean).slice(0, 4)) {
			report.push('  ' + l);
		}
	}

	stats.scale = chosenScale;
	stats.density = +density.toFixed(3);
	const parsed = parseGLTFFiles(files, {
		scale: chosenScale, offset, rotate,
		uvWidth: size.width, uvHeight: size.height,
		// The rectangles are converted to glTF numbering too: the parser knows only
		// that. Objects with an unreadable texture get a piece of the main one:
		// a wrong patch beats UV flying outside the atlas.
		uvRects: sized.map((img, i) => layout.rects[remap[i] >= 0 ? remap[i] : mainIndex]),
	});
	if (rotate.some(v => v)) report.push(`Extra rotation: X ${rotate[0]}°, Y ${rotate[1]}°`);

	// What came out of the export wrapper gets its own line rather than sitting
	// among warnings: if a model arrives lying down, that is the first thing to know.
	const wrapNotes = parsed.warnings.filter(w => w.indexOf('wrapper') >= 0);
	if (wrapNotes.length) {
		report.push('Export wrapper:');
		for (const w of wrapNotes) report.push('  ' + w);
		stats.wrapper = wrapNotes.join(' | ');
	} else {
		stats.wrapper = 'none';
	}

	// Many exporters merge every cube into one mesh (708 triangles instead of 59
	// boxes for Sketchfab), so objects are first split into connected components,
	// each becoming a separate cube.
	const split = [];
	let splitCount = 0;
	for (const obj of parsed.objects) {
		const parts = splitComponents(obj.faces);
		if (parts.length > 1) splitCount++;
		parts.forEach((faces, i) => split.push({
			...obj,
			name: parts.length > 1 ? `${obj.name}_${i + 1}` : obj.name,
			faces,
		}));
	}
	parsed.objects = split;
	stats.objects = parsed.objects.length;
	stats.splitFrom = splitCount;
	stats.animations = parsed.animations.length;
	stats.warnings = parsed.warnings.slice(0, 6);
	if (splitCount) {
		report.push(`Merged meshes split: ${splitCount} → ${split.length} objects`);
	}

	// Step 1. Check ALL the geometry before creating anything: the user must not
	// end up with a half-built project. Only the box/not-a-box verdict matters
	// here; it does not depend on the UV convention, so the layout result is NOT
	// taken from this pass.
	// Objects are sorted into three buckets. A single bad object used to cancel
	// the whole import — the journal shows that for six models out of forty
	// exactly one object was in the way, and the whole model was lost.
	const badMode = (opts && opts.bad_objects) || 'box';
	const notBoxes = [];
	const skipped = [];
	let degenerate = 0;
	for (const obj of parsed.objects) {
		if (isDegenerate(obj.faces)) { degenerate++; obj.drop = true; continue; }
		const sol = solveBox(obj.faces);
		if (!sol.error) continue;
		notBoxes.push(`${obj.name}: ${sol.error}`);
		if (badMode === 'abort') continue;
		obj.bad = true;
		if (badMode === 'skip') { obj.drop = true; skipped.push(obj.name); }
	}
	parsed.objects = parsed.objects.filter(o => !o.drop);
	if (degenerate) report.push(`Degenerate fragments dropped: ${degenerate}`);
	stats.notBoxes = notBoxes.length;
	stats.degenerate = degenerate;
	stats.badMode = badMode;
	if (notBoxes.length) {
		stats.notBoxExamples = notBoxes.slice(0, 3);
		report.push(`Not boxes: ${notBoxes.length} — `
			+ (badMode === 'skip' ? 'skipped' : badMode === 'box' ? 'replaced with their bounding box' : 'import cancelled'));
		for (const n of notBoxes.slice(0, 5)) report.push('  ' + n);
	}
	if (notBoxes.length && badMode === 'abort') {
		stats.result = 'rejected: not cubes';
		remember();
		Blockbench.showMessageBox({
			title: 'This model is not made of cubes',
			message: `Could not represent ${notBoxes.length} of ${parsed.objects.length} objects as cubes.\n\n`
				+ notBoxes.slice(0, 12).join('\n')
				+ (notBoxes.length > 12 ? `\n…and ${notBoxes.length - 12} more` : '')
				+ '\n\nSupport for arbitrary geometry (voxelisation) is not implemented yet.',
		});
		return;
	}

	newProject(Formats.geckolib_model);
	Project.name = (sourceName || 'model').replace(/\.[^.]*$/, '');
	// IMPORTANT: geckolib_model defaults to box_uv = true, while we need per-face
	// UV, otherwise Blockbench re-unwraps them and the layout is lost.
	Project.box_uv = false;
	Project.texture_width = size.width;
	Project.texture_height = size.height;

	// One texture per project, as GeckoLib requires.
	// Redrawing is not only for the atlas: Blockbench stores textures as PNG, and
	// a Sketchfab JPEG must first go through a canvas, or it lands in the project
	// labelled png and fails to open.
	const needRedraw = needAtlas || (images[0].mime && images[0].mime !== 'image/png');
	const atlasTexture = new Texture({ name: needAtlas ? 'atlas.png' : (images[0].name || 'texture.png').replace(/\.[^.]*$/, '.png') });
	if (needRedraw) {
		atlasTexture.add();
		// the content is filled in once the images decode
		buildAtlasDataURL(images, layout).then(url => {
			if (url) atlasTexture.fromDataURL(url);
			Canvas.updateAll();
		});
	} else {
		atlasTexture.fromDataURL('data:' + (images[0].mime || 'image/png') + ';base64,' + bytesToBase64(images[0].bytes)).add();
	}

	// Step 2. Measure Blockbench conventions — that needs a live project.
	detectEulerOrder();
	const calibration = calibrateFaceDirs();

	// Step 3. Only NOW is the final UV layout computed.
	// The order matters: solveBox relies on FACE_DIRS, and computing before
	// calibration lays everything out by the fallback table — exactly the
	// 180°-rotated-texture bug already caught once.
	const solved = [];
	let approximated = 0;
	for (const obj of parsed.objects) {
		const sol = solveBox(obj.faces);
		if (!sol.error) { solved.push({ obj, sol }); continue; }
		if (badMode !== 'box') continue;
		const approx = boxFromBounds(obj.faces);
		if (approx) { solved.push({ obj, sol: approx }); approximated++; }
	}
	stats.approximated = approximated;
	stats.skipped = skipped.length;
	// The approximation share is the only honest measure of result quality.
	// Without it the import succeeded even on models that turned out to be almost
	// entirely wedges and bevels: the project opened, looked like mush, and there
	// was no way to tell why. Better to say plainly that the model does not fit.
	const approxShare = solved.length ? Math.round(100 * approximated / solved.length) : 0;
	stats.approxShare = approxShare;
	if (approximated) {
		report.push(`Approximated with a bounding box: ${approximated} of ${solved.length} (${approxShare}%)`);
		report.push(approxShare >= 30
			? '  WARNING: this model is mostly NOT cube-based — wedges, bevels, rounded shapes. '
				+ 'Such objects lose their shape, so the result is only approximate.'
			: '  Approximated objects lost their shape, but their texture is laid out per face.');
	}

	// bones: the hierarchy is walked in order, a parent always before its child
	const groupByNode = {};
	for (const h of parsed.hierarchy) {
		const g = new Group({ name: h.name, origin: snapVec(h.pivot) }).init();
		if (h.parent >= 0 && groupByNode[h.parent]) g.addTo(groupByNode[h.parent]);
		groupByNode[h.index] = g;
	}

	// Cubes that landed in one plane are separated in depth via inflate:
	// otherwise the GPU cannot decide which face is nearer and the model
	// flickers. Coordinates stay clean throughout.
	const wantZFight = !opts || opts.zfight !== false;
	const coplanar = wantZFight
		? resolveCoplanar(solved.map(s => s.sol))
		: { inflate: solved.map(() => 0), pairs: 0, capped: 0, skipped: 0 };
	stats.coplanarPairs = coplanar.pairs;
	if (coplanar.skipped) {
		report.push(`Coplanar face separation skipped: ${coplanar.skipped} objects — too many`);
	}
	if (coplanar.capped) {
		report.push(`  layers that hit the inflate ceiling: ${coplanar.capped} — flicker may remain there`);
	}
	if (coplanar.pairs) {
		report.push(`Coplanar faces separated: ${coplanar.pairs} `
			+ '(via Inflate, coordinates untouched)');
	}

	let hidden = 0, mirrored = 0, untextured = 0;
	for (let si = 0; si < solved.length; si++) {
		const { obj, sol } = solved[si];
		if (obj.image < 0) untextured++;
		const cube = cubeFromSolution(obj.name, sol, atlasTexture.uuid, coplanar.inflate[si]);
		const parent = groupByNode[obj.node];
		if (parent) cube.addTo(parent);
		cube.init();
		hidden += sol.emptyFaces.length;
		mirrored += sol.mirrored ? 1 : 0;
	}

	const lines = [
		`Imported from: ${sourceName}`,
		// facts gathered before the project existed (scale, textures)
		...report,
		`Cubes created: ${solved.length}`,
		`Bones created: ${parsed.hierarchy.length}`,
		`Texture: ${size.width}×${size.height}`,
		`Objects without a material: ${untextured}`,
		`Faces hidden: ${hidden}`,
		`Mirrored cubes: ${mirrored}`,
	];
	// A failure in animations must not bring down the whole import: cubes and
	// texture are already built, and losing them over animations makes no sense.
	try {
		applyAnimations(parsed, groupByNode, lines, opts);
	} catch (e) {
		console.error('[geckolib-import] animation transfer failed', e);
		lines.push('', `ANIMATIONS WERE NOT TRANSFERRED: ${(e && e.message) || e}`,
			'The model and texture were still built correctly.');
	}
	if (parsed.warnings.length) lines.push('', 'Warnings:', ...parsed.warnings.slice(0, 8));
	lines.push('', calibration);

	// The outcome is recorded on the success path too: without it the journal is
	// blind to working models and there is nothing to compare failures against.
	//
	// notBoxes is NOT touched here: it was counted above and says how many objects
	// had to be approximated. This used to reset it to zero, and the journal
	// showed zero non-cubes for every imported model, even while examples of
	// non-cubes sat in the same record. On such data it is easy to draw exactly
	// the opposite conclusion about what separates working models from broken ones.
	stats.cubes = solved.length;
	stats.approximated = approximated;
	stats.bones = parsed.hierarchy.length;
	stats.result = 'imported';
	remember();

	Canvas.updateAll();
	console.log('[geckolib-import] import\n' + lines.join('\n'));
	showImportReport({
		title: 'Import finished',
		summary: [
			['Cubes', String(solved.length)],
			['Bones', String(parsed.hierarchy.length)],
			['Texture', `${size.width}×${size.height}`],
			['Animations', String(parsed.animations.length)],
			['Scale', `×${chosenScale}`],
		].concat(approximated
			? [['Approximated', `${approximated} of ${solved.length} (${approxShare}%)`]]
			: []),
		warning: approxShare >= 30
			? 'This model is mostly not cube-based: wedges and bevels became boxes, so shape was lost.'
			: null,
		log: lines.join('\n'),
		name: (sourceName || 'model').replace(/\.[^.]*$/, ''),
	});
}

/**
 * The import summary: the gist up front, details behind a scroll, the log as a file.
 *
 * showMessageBox neither scrolls nor wraps long lines: a forty-line report ran
 * off the edges of the window and could not be read. The details are needed
 * though — breakages are diagnosed from them — so they stay, but stop getting in
 * the way of anyone who only wants to know how many cubes came out.
 */
function showImportReport(info) {
	const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
	const rows = info.summary
		.map(([k, v]) => `<div class="mtc_rep_k">${esc(k)}</div><div class="mtc_rep_v">${esc(v)}</div>`)
		.join('');

	const dialog = new Dialog({
		id: PLUGIN_ID + '_report',
		title: info.title,
		buttons: ['Done'],
		onConfirm() { this.hide(); },
		lines: [
			'<style>'
			+ '.mtc_rep_grid { display: grid; grid-template-columns: max-content 1fr; gap: 4px 14px; margin-bottom: 12px; }'
			+ '.mtc_rep_k { opacity: 0.7; }'
			+ '.mtc_rep_v { font-weight: 600; }'
			+ '.mtc_rep_warn { border-left: 3px solid var(--color-warning, #d9a441); padding: 6px 10px;'
			+ '  margin-bottom: 12px; background: rgba(217,164,65,0.12); }'
			+ '.mtc_rep_log { max-height: 320px; overflow: auto; white-space: pre-wrap; word-break: break-word;'
			+ '  font-family: var(--font-code, monospace); font-size: 11px; line-height: 1.45;'
			+ '  background: var(--color-back, #21252b); padding: 8px; border-radius: 4px; }'
			+ '.mtc_rep_bar { display: flex; gap: 8px; align-items: center; margin-top: 10px; }'
			+ '</style>'
			+ `<div class="mtc_rep_grid">${rows}</div>`
			+ (info.warning ? `<div class="mtc_rep_warn">${esc(info.warning)}</div>` : '')
			+ '<details><summary style="cursor:pointer;margin-bottom:8px">Import details</summary>'
			+ `<div class="mtc_rep_log">${esc(info.log)}</div>`
			+ '<div class="mtc_rep_bar">'
			+ '<button class="mtc_rep_save">Save log…</button>'
			+ '<button class="mtc_rep_copy">Copy</button>'
			+ '<span class="mtc_rep_said" style="opacity:0.7"></span>'
			+ '</div></details>',
		],
	});
	dialog.show();

	const root = dialog.object || document;
	const said = root.querySelector('.mtc_rep_said');
	const tell = t => { if (said) said.textContent = t; };

	const save = root.querySelector('.mtc_rep_save');
	if (save) {
		save.addEventListener('click', () => {
			try {
				Blockbench.export({
					type: 'Text log',
					extensions: ['txt'],
					name: `${info.name || 'import'}-log`,
					content: info.log,
				});
			} catch (e) {
				tell('could not save: ' + ((e && e.message) || e));
			}
		});
	}
	const copy = root.querySelector('.mtc_rep_copy');
	if (copy) {
		copy.addEventListener('click', () => {
			// The clipboard can be unavailable in a sandbox — then say so honestly
			// instead of silently doing nothing.
			try {
				navigator.clipboard.writeText(info.log).then(
					() => tell('copied'),
					() => tell('clipboard unavailable — save to a file instead'));
			} catch (e) {
				tell('clipboard unavailable — save to a file instead');
			}
		});
	}
}

// --------------------------------------------------- model journal

const MARKS_KEY = PLUGIN_ID + '_marks';
const MARK_LABELS = { ok: '✅ works', issues: '⚠️ has problems', fail: '❌ will not load' };

/**
 * A journal of tested models.
 *
 * It stores not only the mark but the import numbers: without them a mark
 * explains nothing and diagnosing what went wrong starts from scratch.
 */
function loadMarks() {
	try { return JSON.parse(localStorage.getItem(MARKS_KEY) || '{}') || {}; }
	catch (e) { return {}; }
}

function saveMarks(marks) {
	try { localStorage.setItem(MARKS_KEY, JSON.stringify(marks)); } catch (e) { /* storage full */ }
}

/** Adds model details without overwriting a mark that is already set. */
function recordModel(key, patch) {
	if (!key) return;
	const marks = loadMarks();
	const prev = marks[key] || {};
	marks[key] = Object.assign({}, prev, patch, {
		key,
		updated: new Date().toISOString().slice(0, 19).replace('T', ' '),
	});
	saveMarks(marks);
}

function setMark(key, status) {
	recordModel(key, { status });
}

// ------------------------------------------------------- Sketchfab browser

const SKETCHFAB_API = 'https://api.sketchfab.com/v3';
const SKETCHFAB_TOKEN_KEY = PLUGIN_ID + '_sketchfab_token';

function sketchfabToken(value) {
	try {
		if (value !== undefined) localStorage.setItem(SKETCHFAB_TOKEN_KEY, value || '');
		return localStorage.getItem(SKETCHFAB_TOKEN_KEY) || '';
	} catch (e) {
		return '';
	}
}

/**
 * Model search. No token needed — the endpoint is public.
 *
 * Only downloadable models are searched: the rest cannot be fetched anyway, and
 * showing them would only raise false expectations.
 */
function sketchfabSearch(query) {
	const params = [
		'type=models',
		'downloadable=true',
		'archives_flavours=false',
		'count=24',
		'q=' + encodeURIComponent(query || ''),
	];
	return sketchfabFetchPage(SKETCHFAB_API + '/search?' + params.join('&'));
}

/** Loads a page of results. The `next` field already holds a ready URL. */
function sketchfabFetchPage(url) {
	return fetch(url).then(r => {
		if (!r.ok) throw new Error('search returned HTTP ' + r.status);
		return r.json();
	});
}

/**
 * Downloads a model and returns the unpacked files.
 *
 * The archive link is temporary, so it is fetched immediately. Its layout is
 * exactly what the import already parses: scene.gltf, scene.bin, textures/.
 */
function sketchfabDownload(uid, onProgress) {
	const token = sketchfabToken();
	if (!token) return Promise.reject(new Error('no API token set'));

	onProgress && onProgress('requesting link…');
	return fetch(SKETCHFAB_API + '/models/' + uid + '/download', {
		headers: { Authorization: 'Token ' + token },
	}).then(r => {
		if (r.status === 401) throw new Error('token rejected (401)');
		if (r.status === 403) throw new Error('no permission to download this model (403)');
		if (!r.ok) throw new Error('HTTP ' + r.status);
		return r.json();
	}).then(info => {
		const src = info.gltf || info.glb;
		if (!src || !src.url) throw new Error('the response has no glTF link');
		onProgress && onProgress('downloading archive…');
		return fetch(src.url);
	}).then(r => {
		if (!r.ok) throw new Error('archive returned HTTP ' + r.status);
		return r.arrayBuffer();
	}).then(buf => {
		onProgress && onProgress('unpacking…');
		return JSZip.loadAsync(buf);
	}).then(zip => {
		const entries = {};
		const tasks = [];
		zip.forEach((relPath, entry) => {
			if (entry.dir) return;
			tasks.push(entry.async('uint8array').then(data => { entries[relPath] = data; }));
		});
		return Promise.all(tasks).then(() => entries);
	});
}

/** Browser styles: custom markup does not inherit Blockbench styling. */
let sketchfabCSS = null;
function addSketchfabStyles() {
	if (sketchfabCSS || typeof Blockbench.addCSS !== 'function') return;
	sketchfabCSS = Blockbench.addCSS(`
		.mtc_sf_bar { display: flex; gap: 6px; margin-bottom: 8px; }
		.mtc_sf_bar input { flex: 1; }
		.mtc_sf_status { margin: 4px 0; opacity: 0.8; min-height: 18px; }
		.mtc_sf_results { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			gap: 8px; max-height: 380px; overflow-y: auto; }
		.mtc_sf_card { border: 1px solid var(--color-border); border-radius: 4px;
			padding: 4px; cursor: pointer; font-size: 11px; }
		.mtc_sf_card:hover { background-color: var(--color-selected); }
		.mtc_sf_card img { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 2px;
			background: var(--color-back); }
		.mtc_sf_marks { display: flex; gap: 4px; margin-top: 3px; }
		.mtc_sf_mark { opacity: 0.3; cursor: pointer; font-size: 13px; line-height: 1;
			padding: 1px 3px; border-radius: 3px; }
		.mtc_sf_mark:hover { opacity: 0.7; }
		.mtc_sf_mark.active { opacity: 1; background: var(--color-accent); }
		.mtc_sf_note.has_note { opacity: 1; }
		.mtc_sf_more { display: flex; align-items: center; justify-content: center;
			min-height: 90px; font-weight: bold; }
		.mtc_sf_name { font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
		.mtc_sf_meta { opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
	`);
}

/**
 * The Sketchfab browser: search and download straight from Blockbench.
 *
 * Only downloadable models are shown, always with author and licence: nearly
 * all of them require attribution, and that must not be lost.
 */
function openSketchfabBrowser() {
	if (typeof fetch !== 'function') {
		Blockbench.showMessageBox({ title: 'No network', message: 'This Blockbench build has no fetch available.' });
		return;
	}
	if (typeof JSZip === 'undefined') {
		Blockbench.showMessageBox({ title: 'JSZip missing', message: 'Nothing available to unpack the archive.' });
		return;
	}
	addSketchfabStyles();

	const dialog = new Dialog({
		id: PLUGIN_ID + '_sketchfab',
		title: 'Sketchfab — model search',
		width: 760,
		lines: [
			'<div class="mtc_sf_bar">'
			+ '<input type="text" class="dark_bordered mtc_sf_query" placeholder="search for, e.g.: dwarf house">'
			+ '<button class="mtc_sf_find">Search</button>'
			+ '<button class="mtc_sf_token">Token…</button>'
			+ '</div>'
			+ '<div class="mtc_sf_status"></div>'
			+ '<div class="mtc_sf_results"></div>',
		],
		singleButton: true,
	});
	dialog.show();

	const root = document.querySelector('.dialog#' + PLUGIN_ID + '_sketchfab') || document;
	const q = root.querySelector('.mtc_sf_query');
	const status = root.querySelector('.mtc_sf_status');
	const results = root.querySelector('.mtc_sf_results');
	const say = t => { if (status) status.textContent = t; };

	const askToken = () => {
		new Dialog({
			id: PLUGIN_ID + '_sf_token',
			title: 'Sketchfab token',
			form: {
				token: { label: 'API token', type: 'text', value: sketchfabToken() },
				hint: {
					type: 'info',
					text: 'A token is only needed for downloads; search works without one. '
						+ 'You can get one in your Sketchfab profile settings, under Password & API. '
						+ 'Only models the author allowed to be downloaded can be fetched.',
				},
			},
			onConfirm(form) { sketchfabToken(form.token.trim()); this.hide(); say('token saved'); },
		}).show();
	};

	const importModel = model => {
		// Check the format BEFORE downloading: fetching tens of megabytes only to
		// then say there is nothing to build into is a bad deal.
		if (!requireGeckolib()) return;
		say('preparing ' + model.name + '…');
		sketchfabDownload(model.uid, say)
			.then(entries => {
				say('unpacked, asking for settings…');
				dialog.hide();
				askImportOptions(opts => {
					const meta = {
						key: 'sf:' + model.uid,
						name: model.name,
						author: (model.user && model.user.displayName) || '',
						license: (model.license && model.license.label) || '',
						url: model.viewerUrl || '',
					};
					const built = buildFromFiles(entries, model.name || 'sketchfab', opts, meta);
					// attribution is always printed, even without a license.txt in the archive
					console.log('[geckolib-import] Sketchfab: «' + model.name + '» — '
						+ meta.author + ', ' + meta.license);
					return built;
				});
			})
			.catch(e => say('failed: ' + ((e && e.message) || e)));
	};

	const paintMarks = (bar, key) => {
		const rec = loadMarks()[key] || {};
		for (const b of bar.querySelectorAll('.mtc_sf_mark')) {
			if (b.dataset.status) b.classList.toggle('active', b.dataset.status === rec.status);
		}
		const note = bar.querySelector('.mtc_sf_note');
		if (note) {
			note.classList.toggle('has_note', !!rec.note);
			note.title = rec.note ? 'Note: ' + rec.note : 'Note';
		}
	};

	let nextUrl = null;
	let shown = 0;
	let hiddenNoGltf = 0;

	const render = (data, append) => {
		if (!results) return;
		if (!append) { results.innerHTML = ''; shown = 0; }
		const raw = data.results || [];
		nextUrl = data.next || null;

		// Keep only models with a glTF autoconversion. For some, the download is
		// merely the author's source (.blend, .fbx), which nothing here can open,
		// and such cards used to look usable right up until the import was tried.
		const list = raw.filter(hasGltfArchive);
		hiddenNoGltf += raw.length - list.length;

		if (!list.length && !append) {
			say(hiddenNoGltf
				? `nothing found (hidden without glTF: ${hiddenNoGltf})`
				: 'nothing found');
			return;
		}
		shown += list.length;
		say('shown: ' + shown + (nextUrl ? ' (more available)' : ' — that is all')
			+ (hiddenNoGltf ? ` · hidden without glTF: ${hiddenNoGltf}` : ''));
		for (const m of list) {
			const thumbs = (m.thumbnails && m.thumbnails.images) || [];
			// take the smallest preview at least 200 px wide: quick to load, still decent
			const sorted = thumbs.slice().sort((a, b) => a.width - b.width);
			const thumb = sorted.find(t => t.width >= 200) || sorted[sorted.length - 1];
			const card = document.createElement('div');
			card.className = 'mtc_sf_card';
			const NL = String.fromCharCode(10);
			card.title = (m.name || '') + NL + 'Author: ' + ((m.user && m.user.displayName) || '?')
				+ NL + 'Licence: ' + ((m.license && m.license.label) || '?');
			const kb = m.archives && m.archives.gltf ? Math.round(m.archives.gltf.size / 1024) : null;
			card.innerHTML =
				(thumb ? '<img src="' + thumb.url + '">' : '<img>')
				+ '<div class="mtc_sf_name"></div>'
				+ '<div class="mtc_sf_meta mtc_sf_author"></div>'
				+ '<div class="mtc_sf_meta mtc_sf_lic"></div>';
			// text goes through textContent: model names sometimes contain markup
			card.querySelector('.mtc_sf_name').textContent = m.name || '(unnamed)';
			card.querySelector('.mtc_sf_author').textContent = (m.user && m.user.displayName) || '';
			card.querySelector('.mtc_sf_lic').textContent =
				((m.license && m.license.label) || '') + (kb ? ' · ' + (kb > 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb + ' KB') : '');
			card.addEventListener('click', () => importModel(m));

			// Marks are set by a click without starting the import.
			const key = 'sf:' + m.uid;
			const bar = document.createElement('div');
			bar.className = 'mtc_sf_marks';
			for (const st of ['ok', 'issues', 'fail']) {
				const b = document.createElement('span');
				b.className = 'mtc_sf_mark';
				b.textContent = MARK_LABELS[st].split(' ')[0];
				b.title = MARK_LABELS[st];
				b.dataset.status = st;
				b.addEventListener('click', e => {
					e.stopPropagation();   // otherwise the tile would trigger an import
					const marks = loadMarks();
					const now = marks[key] && marks[key].status === st ? '' : st;
					setMark(key, now);
					recordModel(key, { name: m.name, author: (m.user && m.user.displayName) || '',
						license: (m.license && m.license.label) || '', url: m.viewerUrl || '' });
					paintMarks(bar, key);
					say(now ? 'marked: ' + MARK_LABELS[now] : 'mark removed');
					// for a problem model, ask right away what exactly went wrong
					if (now === 'issues' || now === 'fail') {
						askNote(key, m.name, () => { paintMarks(bar, key); say('note saved'); });
					}
				});
				bar.appendChild(b);
			}

			const noteBtn = document.createElement('span');
			noteBtn.className = 'mtc_sf_mark mtc_sf_note';
			noteBtn.textContent = '📝';
			noteBtn.title = 'Note';
			noteBtn.addEventListener('click', e => {
				e.stopPropagation();
				askNote(key, m.name, () => { paintMarks(bar, key); say('note saved'); });
			});
			bar.appendChild(noteBtn);
			card.appendChild(bar);
			paintMarks(bar, key);
			results.appendChild(card);
		}
		// the more button stays the last tile so the grid is not broken
		const oldMore = results.querySelector('.mtc_sf_more');
		if (oldMore) oldMore.remove();
		if (nextUrl) {
			const more = document.createElement('div');
			more.className = 'mtc_sf_card mtc_sf_more';
			more.textContent = 'Show more';
			more.addEventListener('click', () => {
				const url = nextUrl;
				nextUrl = null;
				say('loading more…');
				sketchfabFetchPage(url)
					.then(d => render(d, true))
					.catch(e => say('error: ' + ((e && e.message) || e)));
			});
			results.appendChild(more);
		}
	};

	const doSearch = () => {
		say('searching…');
		sketchfabSearch(q ? q.value : '').then(render).catch(e => say('search error: ' + ((e && e.message) || e)));
	};

	if (root.querySelector('.mtc_sf_find')) root.querySelector('.mtc_sf_find').addEventListener('click', doSearch);
	if (root.querySelector('.mtc_sf_token')) root.querySelector('.mtc_sf_token').addEventListener('click', askToken);
	if (q) {
		// Blockbench treats Enter in a dialog as confirmation and closes the window,
		// so the event must be stopped before it bubbles.
		q.addEventListener('keydown', e => {
			if (e.key !== 'Enter') return;
			e.preventDefault();
			e.stopPropagation();
			doSearch();
		});
	}
	say(sketchfabToken() ? 'token set — you can search and download' : 'no token: search works, press Token… to enable downloads');
}

/**
 * Asks for the import settings.
 *
 * Kept separate: the same dialog serves both the file import and downloads from
 * the Sketchfab browser.
 */
function askImportOptions(onReady) {
	// Visibility rule: advanced fields appear once the checkbox is ticked.
	const adv = form => !!form.advanced;

	new Dialog({
		id: PLUGIN_ID + '_import_dialog',
		title: 'Import GeckoLib from ZIP',
		// Expanded by a checkbox: an ordinary user needs four settings, the other
		// eight are levers for diagnosing breakage. Eleven fields in a row read like
		// a cockpit and get in the way of anyone who just wants to open a model.
		form: {
			scale_mode: {
				label: 'Model size', type: 'select', default: 'auto',
				options: { auto: 'Detect automatically', 16: '×16 (unit = block)', 1: '×1 (unit = pixel)' },
			},
			recenter: { label: 'Centre the model and place it on the ground', type: 'checkbox', value: true },
			rot_x: {
				label: 'Extra rotation around X', type: 'select', default: '0',
				options: { 0: 'none', '-90': '−90° (model lies face up)', 90: '+90°', 180: '180°' },
			},
			rot_y: {
				label: 'Extra rotation around Y', type: 'select', default: '0',
				options: { 0: 'none', 90: '90°', 180: '180° (faces backwards)', 270: '270°' },
			},
			animations: { label: 'Transfer animations', type: 'checkbox', value: true },

			advanced: { label: 'Advanced settings', type: 'checkbox', value: false },

			adv_hint: {
				type: 'info', condition: adv,
				text: 'Below are the levers for when a model does not arrive as expected. '
					+ 'Change them one at a time: turning several at once makes it impossible to tell '
					+ 'what actually helped.',
			},
			scale_custom: {
				label: 'Custom scale (0 = unset)', type: 'number',
				value: 0, min: 0, max: 64, step: 0.05, condition: adv,
			},
			bad_objects: {
				label: 'Objects that are not cubes', type: 'select', default: 'box', condition: adv,
				options: {
					box: 'Approximate with a bounding box',
					skip: 'Skip them',
					abort: 'Cancel the import',
				},
			},
			positions: {
				label: 'Position channels in animations', type: 'select', default: 'big', condition: adv,
				options: {
					big: 'Larger than the threshold',
					rt: 'All, with rotation pre-compensation',
					model: 'All',
					skip: 'Do not transfer',
					local: 'All, without conjugation',
					absolute: 'Absolute value (bones fly upwards)',
				},
			},
			pos_threshold: {
				label: 'Position threshold, px', type: 'number',
				value: 0, min: 0, max: 30, step: 0.1, condition: adv,
			},
			align_times: {
				label: 'Align keyframe times', type: 'checkbox', value: false, condition: adv,
			},
			zfight: {
				label: 'Separate coplanar faces (anti-flicker)', type: 'checkbox',
				value: true, condition: adv,
			},
			anim_order: {
				label: 'Rotation formula', type: 'select', default: 'post', condition: adv,
				options: { post: 'R(t)·R0⁻¹ (default)', pre: 'R0⁻¹·R(t) (if animations drift apart)' },
			},
			hint: {
				type: 'info', condition: adv,
				text: 'The maths gives exactly two exact options: All — if Blockbench adds the offset '
					+ 'outside the rotation, and pre-compensated — if inside. '
					+ 'If bones drift apart in an animation, raise the position threshold to 2 px: '
					+ 'small offsets are then dropped, which is a known-good state.',
			},
		},
		onConfirm(form) { this.hide(); onReady(form); },
	}).show();
}

/**
 * Whether the GeckoLib format exists. That plugin installs separately, and
 * without it there is nothing to build a project into.
 *
 * The dependency is deliberately soft: the mesh-to-cube converter is useful on
 * its own, so the plugin always loads and the check sits where the format is
 * actually needed — at the entrance to the import.
 */
function geckolibAvailable() {
	return typeof Formats !== 'undefined' && !!Formats.geckolib_model;
}

function requireGeckolib() {
	if (geckolibAvailable()) return true;
	new Dialog({
		id: PLUGIN_ID + '_need_geckolib',
		title: 'GeckoLib plugin required',
		buttons: ['Open plugin list', 'Cancel'],
		lines: [
			'<p>The import builds a project in the <b>GeckoLib Animated Model</b> format, '
			+ 'which comes from a separate plugin — and it is not installed right now.</p>'
			+ '<p style="opacity:0.75">Install <b>GeckoLib Animation Utils</b> from '
			+ 'File → Plugins and run the import again. Converting an already-open model '
			+ 'from meshes to cubes (Filter menu) works without it.</p>',
		],
		onConfirm() {
			this.hide();
			// Different builds open the plugin list differently, so both routes are
			// tried and neither failing is reported.
			try {
				if (typeof Plugins !== 'undefined' && Plugins.dialog) Plugins.dialog.show();
				else if (typeof BarItems !== 'undefined' && BarItems.plugins_window) BarItems.plugins_window.click();
			} catch (e) { /* not critical: the user can open it manually */ }
		},
		onCancel() { this.hide(); },
	}).show();
	return false;
}

function importFromZip() {
	if (typeof JSZip === 'undefined') {
		Blockbench.showMessageBox({ title: 'JSZip missing', message: 'This Blockbench build has no JSZip, so archives cannot be unpacked.' });
		return;
	}
	if (!requireGeckolib()) return;
	askImportOptions(opts => pickAndImport(opts));
}

function pickAndImport(opts) {
	Blockbench.import({
		extensions: ['zip'],
		type: 'Archive with a glTF model',
		readtype: 'buffer',
	}, files => {
		const file = files[0];
		if (!file) return;
		JSZip.loadAsync(file.content).then(zip => {
			const entries = {};
			const tasks = [];
			zip.forEach((relPath, entry) => {
				if (entry.dir) return;
				tasks.push(entry.async('uint8array').then(data => { entries[relPath] = data; }));
			});
			return Promise.all(tasks).then(() => buildFromFiles(entries, file.name, opts));
		}).catch(e => {
			console.error('[geckolib-import] import failed', e);
			Blockbench.showMessageBox({ title: 'Import failed', message: String((e && e.message) || e) });
		});
	});
}

/**
 * An entry on the start screen, next to the formats.
 *
 * The import creates a project itself, so demanding an empty one beforehand is
 * pointless. Blockbench offers no API for adding custom tiles to the start
 * screen, so they are inserted into the DOM by hand: several selectors are
 * tried and the working one is recorded so diagnostics can show it.
 */
let startScreenStatus = 'not attempted';
let importFormat = null;

/**
 * The start screen entry.
 *
 * Blockbench offers no API for custom tiles, and inserting them into the DOM by
 * hand failed twice: custom markup drifted and looked paler than its neighbours,
 * and cloning a neighbour dragged its icon along. So a real ModelFormat is
 * registered — then Blockbench draws the tile itself, with proper spacing,
 * colour and highlighting — but project creation is swapped for the ZIP import.
 */
function registerStartScreenFormat() {
	try {
		if (typeof ModelFormat === 'undefined') { startScreenStatus = 'ModelFormat unavailable'; return; }
		importFormat = new ModelFormat({
			id: PLUGIN_ID + '_zip',
			name: 'GeckoLib from ZIP',
			description: 'glTF + texture → a ready cube-based model',
			icon: 'folder_zip',
			category: 'general',
			show_on_start_screen: true,
			// Without this the format page is empty: Blockbench does not know what to
			// write, nor what to call the action.
			format_page: {
			button_text: 'Select archive…',
			content: [
				{ type: 'h3', text: 'Model from a glTF archive' },
				{ type: 'text', text: 'Takes a .zip with a glTF model and its textures and builds '
					+ 'a finished GeckoLib project: bones, cubes, textures and animations.' },
				{ type: 'text', text: 'Requires the GeckoLib Animation Utils plugin — its format is '
					+ 'what the project is built into.' },
				{ type: 'text', text: 'Cube-based models work best. Cubes merged into a single mesh are '
					+ 'split apart automatically, and several textures are packed into one atlas.' },
				{ type: 'text', text: 'Wedges, bevels and rounded shapes do not exist in Minecraft: such '
					+ 'objects are replaced with their bounding box, and the report tells you what '
					+ 'share of the model was approximated.' },
				{ type: 'text', text: 'Size and orientation are detected automatically. Everything else '
					+ 'lives under «Advanced settings» in the import dialog.' },
			],
			},
		});
		// The format exists only for the tile: instead of an empty project it starts
		// the import, which creates the project itself.
		importFormat.new = function () { importFromZip(); return false; };
		startScreenStatus = 'registered ModelFormat ' + importFormat.id;
	} catch (e) {
		startScreenStatus = 'error: ' + ((e && e.message) || e);
	}
}

/**
 * A note on a model.
 *
 * A has problems mark without a description says nothing a week later, so for
 * problem models this window opens right after the mark is set.
 */
function askNote(key, name, onSaved) {
	const cur = (loadMarks()[key] || {});
	new Dialog({
		id: PLUGIN_ID + '_note',
		title: 'Note: ' + (name || key),
		form: {
			note: {
				label: 'What went wrong', type: 'textarea', height: 120,
				value: cur.note || '',
			},
			hint: {
				type: 'info',
				text: 'Be specific: what exactly went wrong, which part of the model, with which settings. '
					+ 'The journal records the import numbers itself, so there is no need to repeat them.',
			},
		},
		onConfirm(form) {
			recordModel(key, { note: (form.note || '').trim() });
			this.hide();
			if (onSaved) onSaved();
		},
	}).show();
}

/**
 * A summary of the model journal.
 *
 * The point is not the marks themselves but the comparison: if every will not
 * load shares a trait — many non-cubes, say, or the same scale — it shows up
 * here. That is why the journal accumulates import numbers at all.
 */
function showMarksReport() {
	const marks = loadMarks();
	const all = Object.values(marks);
	if (!all.length) {
		Blockbench.showMessageBox({ title: 'Model journal', message: 'Nothing marked yet.' });
		return;
	}

	const byStatus = { ok: [], issues: [], fail: [], '': [] };
	for (const m of all) (byStatus[m.status || ''] = byStatus[m.status || ''] || []).push(m);

	const lines = [`Total in journal: ${all.length}`];
	for (const st of ['ok', 'issues', 'fail', '']) {
		const list = byStatus[st] || [];
		if (list.length) lines.push(`  ${st ? MARK_LABELS[st] : 'unmarked'}: ${list.length}`);
	}

	// Group averages are compared: that is how a trait separating problem models
	const num = (list, pick) => {
		const vs = list.map(pick).filter(v => typeof v === 'number' && isFinite(v));
		return vs.length ? (vs.reduce((a, b) => a + b, 0) / vs.length) : null;
	};
	const fields = [
		['objects', m => m.stats && m.stats.objects],
		['non-cubes', m => m.stats && m.stats.notBoxes],
		['textures', m => m.stats && m.stats.images],
		['scale', m => m.stats && m.stats.scale],
		['animations', m => m.stats && m.stats.animations],
		['meshes split', m => m.stats && m.stats.splitFrom],
	];
	lines.push('', 'Averages by group:');
	lines.push('  metric'.padEnd(20) + ['ok', 'issues', 'fail'].map(x => x.padStart(9)).join(''));
	for (const [name, pick] of fields) {
		const row = ['ok', 'issues', 'fail'].map(st => {
			const v = num(byStatus[st] || [], pick);
			return (v === null ? '—' : v.toFixed(1)).padStart(9);
		}).join('');
		lines.push('  ' + name.padEnd(18) + row);
	}

	const noNote = (byStatus.issues || []).concat(byStatus.fail || []).filter(m => !m.note);
	if (noNote.length) {
		lines.push('', `Without a note: ${noNote.length} — their cause is unknown:`);
		for (const m of noNote.slice(0, 6)) lines.push('  ' + (m.name || m.key));
	}

	const failed = (byStatus.fail || []).concat(byStatus.issues || []);
	if (failed.length) {
		lines.push('', 'Problem models:');
		for (const m of failed.slice(0, 12)) {
			const st = m.stats || {};
			lines.push(`  ${MARK_LABELS[m.status] ? MARK_LABELS[m.status].slice(0, 2) : '  '} ${(m.name || m.key || '').slice(0, 34)}`
				+ ` — ${st.result || 'did not import'}`
				+ (st.notBoxes ? `, non-cubes ${st.notBoxes}` : '')
				+ (st.images > 1 ? `, textures ${st.images}` : '')
				+ (st.scale !== undefined ? `, ×${st.scale}` : ''));
			if (m.note) lines.push('      note: ' + m.note.split(String.fromCharCode(10)).join(' / '));
			if (st.notBoxExamples && st.notBoxExamples.length) {
				lines.push('      ' + st.notBoxExamples[0]);
			}
		}
	}

	new Dialog({
		id: PLUGIN_ID + '_marks_report',
		title: 'Model journal',
		form: {
			hint: { type: 'info', text: 'Select and copy (Ctrl+A, Ctrl+C) to analyse it in detail.' },
			dump: { label: '', type: 'textarea', value: lines.join(String.fromCharCode(10)), height: 380 },
			raw: { label: '', type: 'textarea', value: JSON.stringify(marks, null, 1), height: 120 },
		},
		singleButton: true,
	}).show();
	console.log('[geckolib-import] model journal', marks);
}

// ------------------------------------------------------- environment diagnostics

/**
 * Shows what is available inside Blockbench.
 *
 * A user's Blockbench build may have no developer console, so the plugin serves
 * as its own console: the result goes into a window from which it can be copied
 * in full.
 */
function environmentReport() {
	const has = v => { try { return typeof eval(v); } catch (e) { return 'none'; } };
	const keys = obj => { try { return Object.keys(obj).join(', '); } catch (e) { return '—'; } };

	const lines = [
		`Blockbench: ${typeof Blockbench !== 'undefined' && Blockbench.version || '?'}`,
		'',
		'— ZIP unpacking —',
		`JSZip: ${has('JSZip')}`,
		`fflate: ${has('fflate')}`,
		`require: ${has('require')}`,
		`window.require: ${typeof window !== 'undefined' ? typeof window.require : 'none'}`,
		'',
		'— formats —',
		`all: ${keys(typeof Formats !== 'undefined' ? Formats : {})}`,
		'',
		'— codecs —',
		`all: ${keys(typeof Codecs !== 'undefined' ? Codecs : {})}`,
		'',
		'— integration —',
		`start screen entry: ${startScreenStatus}`,
		`ModelFormat: ${has('ModelFormat')}`,
		`Animation: ${has('Animation')}, Group: ${has('Group')}`,
		'',
		'— plugins —',
		(() => {
			try { return 'installed: ' + Plugins.all.filter(p => p.installed).map(p => p.id).join(', '); }
			catch (e) { return 'Plugins unavailable: ' + e.message; }
		})(),
	];

	// anything resembling GeckoLib: the exact id is needed to declare a dependency
	try {
		const gecko = Object.keys(Formats).filter(f => /gecko|animated/i.test(f));
		lines.push('', `GeckoLib-like formats found: ${gecko.join(', ') || 'none'}`);
		const f = Formats[gecko[0]];
		if (f) lines.push(`  id=${f.id} name=${f.name} box_uv=${f.box_uv} rotation_limit=${f.rotation_limit}`);
	} catch (e) { lines.push('', 'GeckoLib check failed: ' + e.message); }

	return lines.join('\n');
}

function showEnvironment() {
	const text = environmentReport();
	console.log('[geckolib-import] environment\n' + text);
	new Dialog({
		id: PLUGIN_ID + '_env',
		title: 'Environment diagnostics',
		form: {
			hint: { type: 'info', text: 'Select the text and copy it (Ctrl+A, Ctrl+C).' },
			dump: { label: '', type: 'textarea', value: text, height: 420 },
		},
		singleButton: true,
	}).show();
}

// ------------------------------------------------------------- registration

let action;
let envAction;
let importAction;
let sketchfabAction;
let marksAction;

Plugin.register(PLUGIN_ID, {
	title: 'GeckoLib Model Importer',
	author: 'MopicMP',
	icon: 'view_in_ar',
	description: 'Import glTF models — including straight from Sketchfab — into GeckoLib: bones, cubes, textures and animations.',
	version: '0.1.0',
	variant: 'both',
	min_version: '4.9.0',
	tags: ['Minecraft: Java Edition', 'Import', 'Animation'],
	website: 'https://github.com/MopicMP/geckolib-model-importer',
	repository: 'https://github.com/MopicMP/geckolib-model-importer',
	bug_tracker: 'https://github.com/MopicMP/geckolib-model-importer/issues',
	creation_date: '2026-08-01',

	onload() {
		action = new Action(PLUGIN_ID, {
			name: 'Convert Meshes to Cubes',
			description: 'Converts box-shaped meshes into Cubes, carrying the UV over',
			icon: 'view_in_ar',
			condition: () => typeof Mesh !== 'undefined' && Mesh.all.length > 0,
			click() {
				new Dialog({
					id: PLUGIN_ID + '_dialog',
					title: 'Mesh → Cubes',
					form: {
						selected_only: { label: 'Selected only', type: 'checkbox', value: false },
						delete_meshes: { label: 'Delete the source meshes', type: 'checkbox', value: false },
						mirror_mode: {
							label: 'Mirrored UV', type: 'select', default: 'source',
							options: { source: 'As in the source', off: 'Disable mirroring' },
						},
						hint: {
							type: 'info',
							text: 'Run it once without deleting and compare by eye. ' +
								'The meshes are kept regardless if even one object fails to convert.\n\n' +
								'If some textures look mirrored, run again with Disable mirroring ' +
								'and compare which result is closer to the source meshes.',
						},
					},
					onConfirm(form) { this.hide(); runConversion(form); },
				}).show();
			},
		});
		MenuBar.addAction(action, 'filter');

		envAction = new Action(PLUGIN_ID + '_env', {
			name: 'Environment diagnostics (GeckoLib Importer)',
			description: 'Shows what is available inside Blockbench: ZIP, formats, codecs',
			icon: 'bug_report',
			click: showEnvironment,
		});
		MenuBar.addAction(envAction, 'help');

		marksAction = new Action(PLUGIN_ID + '_marks', {
			name: 'Journal of tested models',
			description: 'Summary of marks and import numbers',
			icon: 'fact_check',
			condition: () => true,
			click: showMarksReport,
		});
		MenuBar.addAction(marksAction, 'help');

		importAction = new Action(PLUGIN_ID + '_import', {
			name: 'GeckoLib from ZIP (glTF + texture)',
			description: 'Builds a ready GeckoLib model from an archive with glTF and textures',
			icon: 'folder_zip',
			// the import creates a project itself, so it needs no open project
			condition: () => true,
			click: importFromZip,
		});
		MenuBar.addAction(importAction, 'file');

		sketchfabAction = new Action(PLUGIN_ID + '_sketchfab', {
			name: 'Sketchfab — model search',
			description: 'Search and download downloadable models straight from Blockbench',
			icon: 'travel_explore',
			condition: () => true,
			click: openSketchfabBrowser,
		});
		MenuBar.addAction(sketchfabAction, 'file');

		registerStartScreenFormat();
	},

	onunload() {
		if (action) action.delete();
		if (envAction) envAction.delete();
		if (importAction) importAction.delete();
		if (sketchfabAction) sketchfabAction.delete();
		if (marksAction) marksAction.delete();
		if (importFormat && importFormat.delete) importFormat.delete();
		if (sketchfabCSS && sketchfabCSS.delete) sketchfabCSS.delete();
	},
});

})();
