/**
 * glTF to Minecraft
 * Turns glTF models — from an archive, a folder or straight from Sketchfab —
 * into cubes that Minecraft can use: a GeckoLib, Bedrock or Generic project, a
 * still Java block/item model, or a Customizable Player Models skin.
 *
 * The core (solveBox) does not depend on Blockbench and is covered by
 * tools/verify-conversion.mjs, which runs it against a real OBJ file.
 *
 * Install: Blockbench -> File -> Plugins -> Load Plugin from File -> this file.
 *
 * IMPORTANT: the file name must match PLUGIN_ID, otherwise Blockbench refuses
 * to load it. gltf_to_minecraft.js <-> 'gltf_to_minecraft'. Rename both together.
 */
(function () {

const PLUGIN_ID = 'gltf_to_minecraft';

// All tolerances are relative. Absolute ones do not work here: models contain
// panels 0.001 px thick next to 8 px cubes (see Box detection in docs/how-it-works.md).
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

/**
 * Full box: look for three mutually orthogonal edges starting from p0.
 *
 * Of the edge triples that pass, the one whose corners land closest wins, not
 * the first found. On a panel a thousandth of a pixel thick the corner across
 * the thickness sits within the tolerance of the true neighbour, so an edge run
 * to it passes too — slanted by the thickness over the length. Taken as an axis
 * it tilts the whole box a hair, the big faces no longer lie on its sides, and
 * the panel comes out with nothing on its two faces that show: an awning and the
 * snow on it vanished from a scene this way.
 */
function detectBox8(pts) {
	const p0 = pts[0];
	const rest = pts.slice(1);
	const span = Math.max(...rest.map(p => dist(p, p0)));
	if (!span) return null;
	const tol = span * TOL_REL;
	let best = null, bestErr = Infinity;

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

				// how far the worst corner lands; an exact triple gives float noise
				let err = 0;
				for (const p of pts) err = Math.max(err, Math.min(...corners.map(q => dist(p, q))));
				if (err < bestErr) { bestErr = err; best = e; }
			}
		}
	}
	return best ? refineBox(pts, best) : null;
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

/**
 * Turning whatever a file draws with into plain triangles.
 *
 * Only mode 4 was read, and everything else was skipped with a warning. That
 * sounds cautious and was not: every model in the reference set — six of them,
 * from three different authors, all exported through Sketchfab — is written as
 * triangle strips, so the importer skipped every primitive in every one of them
 * and reported finding no cubes at all. The geometry was perfect: twenty-four
 * vertices to a primitive, which is six faces of four corners.
 *
 * A strip and a fan are not other kinds of geometry. They are the same triangles
 * written down more briefly, and unrolling them is four lines.
 *
 * Two things can go wrong and both have bitten.
 *
 * <b>Winding.</b> In a strip every other triangle is wound the other way and the
 * file relies on the reader to flip it back. A reader that does not gets every
 * second face inside out, which shows as a cube with holes rather than as an
 * error.
 *
 * <b>Stitches.</b> A strip is one unbroken ribbon, so a box drawn as a strip has
 * to jump from face to face, and it jumps by repeating an index. Thirty-four
 * indices come out as thirty-two triangles of which <em>twenty</em> are those
 * jumps and only twelve are the box. A jump draws nothing — it has no area — but
 * its three corners are read from two different faces of the texture at once, and
 * the UV rectangle worked out for each side then stretches over its neighbours.
 * That is what "the textures land completely wrong" looked like, and it does not
 * happen in files written as plain triangles, which is why it survived the first
 * fix.
 *
 * So a triangle with a repeated corner is dropped. It is not a triangle.
 */
const TRIANGULATE = {
	// TRIANGLES: already triangles.
	4: idx => real(triples(idx)),
	// TRIANGLE_STRIP: each new index closes a triangle with the two before it,
	// and the odd ones are reversed so that every face keeps facing outwards.
	5: idx => {
		const out = [];
		for (let i = 0; i + 2 < idx.length; i++) {
			out.push(i % 2 === 0
				? [idx[i], idx[i + 1], idx[i + 2]]
				: [idx[i + 1], idx[i], idx[i + 2]]);
		}
		return real(out);
	},
	// TRIANGLE_FAN: every triangle shares the first index.
	6: idx => {
		const out = [];
		for (let i = 1; i + 1 < idx.length; i++) out.push([idx[0], idx[i], idx[i + 1]]);
		return real(out);
	},
};

function triples(idx) {
	const out = [];
	for (let i = 0; i + 2 < idx.length; i += 3) out.push([idx[i], idx[i + 1], idx[i + 2]]);
	return out;
}

/** Only the triangles that are triangles: two corners the same is no area at all. */
function real(tris) {
	return tris.filter(t => t[0] !== t[1] && t[1] !== t[2] && t[0] !== t[2]);
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

/**
 * Outline shells drawn by the inverted-hull trick, found among an object's faces.
 *
 * A toon outline is a copy of a part, a little larger, turned inside out and on a
 * one-sided dark material. A viewer that culls back faces draws only its far
 * side, which peeks out around the part as a rim. Blockbench and Minecraft draw
 * cubes from both sides, so the same shell arrives as a dark casing over the
 * part: on a model with a dozen of them nearly every part came out dark. A rim
 * cannot be kept that way, so the shell is left out.
 *
 * A shell is a connected piece whose faces are all one-sided, closed, and wound
 * inward: its signed volume is negative, read the other way round under a
 * mirroring transform, where glTF itself turns the winding. Up to one edge in
 * twenty may go unpaired, since one such shell carried doubled triangles. Across
 * every model at hand nothing else fits: inside-out closed parts on two-sided
 * materials exist, and there the winding means nothing.
 *
 * Returns the faces to leave out and how many shells they make.
 */
function insideOutShells(faces, oneSided, mirrored) {
	const out = new Set();
	let shells = 0;
	if (!oneSided.size) return { faces: out, shells };
	for (const piece of splitComponents(faces)) {
		if (piece.length < 4 || !piece.every(f => oneSided.has(f))) continue;
		const v = enclosedVolume(piece);
		if (v && (mirrored ? -v : v) < 0) {
			shells++;
			for (const f of piece) out.add(f);
		}
	}
	return { faces: out, shells };
}

/**
 * Signed volume a closed surface encloses: positive when wound outward, 0 when
 * the surface is open. Measured from the centroid, so a small hole shifts it
 * little.
 */
function enclosedVolume(faces) {
	const key = p => Math.round(p[0] * 1000) + ',' + Math.round(p[1] * 1000) + ',' + Math.round(p[2] * 1000);
	const edges = new Map();
	const c = [0, 0, 0];
	let n = 0;
	for (const f of faces) for (const p of f.positions) { c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; n++; }
	c[0] /= n; c[1] /= n; c[2] /= n;
	let volume = 0;
	for (const f of faces) {
		const ks = f.positions.map(key);
		if (ks[0] === ks[1] || ks[1] === ks[2] || ks[0] === ks[2]) continue;
		for (let i = 0; i < 3; i++) {
			const e = ks[i] + '>' + ks[(i + 1) % 3];
			edges.set(e, (edges.get(e) || 0) + 1);
		}
		const [a, b, d] = f.positions.map(p => [p[0] - c[0], p[1] - c[1], p[2] - c[2]]);
		volume += (a[0] * (b[1] * d[2] - b[2] * d[1]) - a[1] * (b[0] * d[2] - b[2] * d[0])
			+ a[2] * (b[0] * d[1] - b[1] * d[0])) / 6;
	}
	let unpaired = 0;
	for (const [e, count] of edges) {
		const [from, to] = e.split('>');
		if (count !== 1 || edges.get(to + '>' + from) !== 1) unpaired++;
	}
	return edges.size && unpaired <= edges.size / 20 ? volume : 0;
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

// Budgets apply before allocation, including implicit-zero and compressed inputs.
const IMPORT_LIMITS = Object.freeze({
	nodes: 20000, depth: 256, nodeVisits: 40000,
	accessorCount: 1000000, accessorComponents: 4000000,
	archiveEntries: 4096, archiveInputBytes: 64 * 1024 * 1024,
	archiveEntryBytes: 64 * 1024 * 1024, archiveBytes: 128 * 1024 * 1024,
	imageSide: 8192, imagePixels: 16 * 1024 * 1024, totalImagePixels: 32 * 1024 * 1024,
});

class ImportLimitError extends Error {}

function boundedInteger(value, max, label) {
	if (!Number.isSafeInteger(value) || value < 0 || value > max) {
		throw new ImportLimitError(`${label} must be an integer between 0 and ${max}`);
	}
	return value;
}

function checkImageDimensions(width, height) {
	boundedInteger(width, IMPORT_LIMITS.imageSide, 'image width');
	boundedInteger(height, IMPORT_LIMITS.imageSide, 'image height');
	if (!width || !height || width * height > IMPORT_LIMITS.imagePixels) {
		throw new ImportLimitError(`image exceeds the ${IMPORT_LIMITS.imagePixels} pixel limit`);
	}
}

function checkedImageSize(width, height) {
	checkImageDimensions(width, height);
	return { width, height };
}

/** Validate the graph without recursion, before either wrapper or scene traversal. */
function validateNodeGraph(nodes, roots) {
	boundedInteger(nodes.length, IMPORT_LIMITS.nodes, 'node count');
	boundedInteger(roots.length, IMPORT_LIMITS.nodes, 'scene root count');
	let edges = 0;
	const state = new Uint8Array(nodes.length);
	const checkIndex = i => {
		boundedInteger(i, nodes.length - 1, 'node index');
		if (!nodes[i] || !Array.isArray(nodes[i].children || [])) throw new Error('invalid node children');
	};
	for (const r of roots) checkIndex(r);
	for (let i = 0; i < nodes.length; i++) {
		if (state[i] === 2) continue;
		const stack = [{ index: i, exit: false }];
		while (stack.length) {
			const frame = stack.pop(), idx = frame.index;
			checkIndex(idx);
			if (frame.exit) { state[idx] = 2; continue; }
			if (state[idx] === 1) throw new Error('glTF node hierarchy contains a cycle');
			if (state[idx] === 2) continue;
			state[idx] = 1;
			stack.push({ index: idx, exit: true });
			const children = nodes[idx].children || [];
			edges += children.length;
			boundedInteger(edges, IMPORT_LIMITS.nodeVisits, 'node child references');
			for (let j = children.length - 1; j >= 0; j--) stack.push({ index: children[j], exit: false });
		}
	}
}

/** A view-relative span, checked before any accessor tuples are allocated. */
function accessorView(gltf, buffers, index, offset, count, size, stride) {
	const view = (gltf.bufferViews || [])[index];
	if (!view) throw new Error(`missing bufferView ${index}`);
	const buf = buffers[view.buffer];
	if (!buf) throw new Error(`missing buffer ${view.buffer}`);
	const start = boundedInteger(view.byteOffset || 0, buf.byteLength, 'bufferView offset');
	const length = boundedInteger(view.byteLength, buf.byteLength - start, 'bufferView length');
	boundedInteger(offset, length, 'accessor offset');
	boundedInteger(stride, IMPORT_LIMITS.archiveBytes, 'accessor stride');
	const bytes = count ? (count - 1) * stride + size : 0;
	if (stride < size || bytes > length - offset) throw new Error('accessor exceeds its bufferView');
	return { dv: new DataView(buf.buffer, buf.byteOffset, buf.byteLength), base: start + offset };
}

/** Reads a whole accessor: an array of tuples sized by component count. */
function readAccessor(gltf, buffers, index, budget = { components: 0 }) {
	const acc = gltf.accessors[index];
	if (!acc) throw new Error(`missing accessor ${index}`);
	const comp = GLTF_COMPONENTS[acc.componentType];
	if (!comp) throw new Error(`unknown componentType ${acc.componentType}`);
	const n = GLTF_TYPE_SIZE[acc.type];
	if (!n) throw new Error(`unknown accessor type ${acc.type}`);
	boundedInteger(acc.count, IMPORT_LIMITS.accessorCount, 'accessor count');
	budget.components += acc.count * n;
	boundedInteger(budget.components, IMPORT_LIMITS.accessorComponents, 'decoded accessor components');
	if (acc.sparse) boundedInteger(acc.sparse.count, acc.count, 'sparse accessor count');

	const out = [];
	if (acc.bufferView === undefined) {
		for (let i = 0; i < acc.count; i++) out.push(new Array(n).fill(0));
	} else {
		const view = gltf.bufferViews[acc.bufferView];
		const stride = view.byteStride || comp.size * n;
		const { dv, base } = accessorView(gltf, buffers, acc.bufferView, acc.byteOffset || 0, acc.count, comp.size * n, stride);
		for (let i = 0; i < acc.count; i++) {
			const el = [];
			for (let c = 0; c < n; c++) el.push(comp.read(dv, base + i * stride + c * comp.size));
			out.push(el);
		}
	}

	// sparse accessors: some values are overridden
	if (acc.sparse) {
		const idxAcc = acc.sparse.indices, valAcc = acc.sparse.values;
		const idxComp = GLTF_COMPONENTS[idxAcc.componentType];
		if (![5121, 5123, 5125].includes(idxAcc.componentType)) throw new Error('invalid sparse index componentType');
		const { dv: idv, base: ibase } = accessorView(gltf, buffers, idxAcc.bufferView, idxAcc.byteOffset || 0, acc.sparse.count, idxComp.size, idxComp.size);
		const { dv: vdv, base: vbase } = accessorView(gltf, buffers, valAcc.bufferView, valAcc.byteOffset || 0, acc.sparse.count, comp.size * n, comp.size * n);
		for (let i = 0; i < acc.sparse.count; i++) {
			const target = idxComp.read(idv, ibase + i * idxComp.size);
			boundedInteger(target, acc.count - 1, 'sparse accessor index');
			const el = [];
			for (let c = 0; c < n; c++) {
				el.push(comp.read(vdv, vbase + (i * n + c) * comp.size));
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
function parseAnimations(gltf, buffers, warnings, budget = { components: 0 }) {
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
				const times = readAccessor(gltf, buffers, sampler.input, budget).map(t => t[0]);
				const values = readAccessor(gltf, buffers, sampler.output, budget);
				if (times.length) length = Math.max(length, times[times.length - 1]);
				channels.push({
					node: ch.target.node,
					path: ch.target.path,          // translation | rotation | scale
					interpolation: sampler.interpolation || 'LINEAR',
					times, values,
				});
			} catch (e) {
				if (e instanceof ImportLimitError) throw e;
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
	const baseName = n => lower(n).replace(/^.*[/\\]/, '');
	const glbName = names.find(n => lower(n).endsWith('.glb'));

	// More than one .gltf in the same place is normal, not an oddity: a Sketchfab
	// folder holds the plain model and a “_Textured” twin, and the plain one has
	// zero images and a material with no texture. Taking whichever came first
	// meant importing a model that cannot be textured at all — and the choice
	// depended on the order of names, which nobody controls.
	//
	// So the candidates are read and the richest wins: the one that declares the
	// most images. Parsing a few megabytes of JSON twice costs less than a silent
	// import of the wrong file.
	const gltfNames = names.filter(n => lower(n).endsWith('.gltf'));
	const countImages = n => {
		try { return (JSON.parse(new TextDecoder().decode(files[n])).images || []).length; }
		catch { return -1; }
	};
	let gltfName = gltfNames[0];
	if (gltfNames.length > 1) {
		let best = -Infinity;
		for (const n of gltfNames) {
			const c = countImages(n);
			if (c > best) { best = c; gltfName = n; }
		}
		warnings.push(`glTF files here: ${gltfNames.length} — chose `
			+ `“${gltfName.replace(/^.*[/\\]/, '')}”, the one declaring the most images (${best})`);
	}
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
		// The last resort is the bare file name. It matters when the files come
		// loose from a folder rather than out of an archive: the model says
		// “textures/scene.bin” while the picker hands over “scene.bin”.
		const key = names.find(n => n === baseDir + want || n === want || lower(n).endsWith('/' + lower(want)))
			|| names.find(n => baseName(n) === baseName(want));
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
					|| lower(n).endsWith('/' + lower(want)) || lower(n).endsWith(lower(want)))
					|| names.find(n => baseName(n) === baseName(want));
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
		const colour = colourTextureOf(m);
		if (colour) setRole(colour.index, 'color');
		if (pbr.metallicRoughnessTexture) setRole(pbr.metallicRoughnessTexture.index, 'aux');
		const sg = m.extensions && m.extensions.KHR_materials_pbrSpecularGlossiness;
		if (sg && sg.specularGlossinessTexture) setRole(sg.specularGlossinessTexture.index, 'aux');
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
	// A fully transparent placeholder: Blockbench's stand-in for "no texture".
	for (const img of images) img.blank = !!img.bytes && isBlankImage(img.bytes);
	let blankTriangles = 0, blankObjects = 0, outlineShells = 0;

	const objects = [];
	// The node hierarchy is needed twice: as GeckoLib bones and as animation
	// targets, which reference nodes by index.
	const hierarchy = [];
	const scene = gltf.scenes && gltf.scenes[gltf.scene || 0];
	const roots = scene ? scene.nodes : (gltf.nodes || []).map((_, i) => i);
	validateNodeGraph(gltf.nodes || [], roots);
	const accessorBudget = { components: 0 };
	let nodeVisits = 0;
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

	const visit = (nodeIndex, parent, parentIndex, parentQuat, depth = 0) => {
		boundedInteger(depth, IMPORT_LIMITS.depth, 'node hierarchy depth');
		boundedInteger(++nodeVisits, IMPORT_LIMITS.nodeVisits, 'node visits');
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
			// the export wrapper carries no transform of its own any more
			wrapper: !!wrap,
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
			let faces = [];
			// faces on a one-sided material, where the winding says which side shows
			const oneSided = new Set();
			// Which image each primitive uses: material -> texture -> image. Per
			// primitive, not per object: Blockbench exports every face of a cube as
			// a primitive of its own, and a face with no texture points at a
			// transparent placeholder. The image used to be taken from the first
			// primitive and applied to all six, so a cube whose first face had no
			// texture came out invisible — reported on a shark whose fin vanished.
			for (const prim of mesh.primitives || []) {
				if (prim.mode !== undefined && !TRIANGULATE[prim.mode]) {
					warnings.push(`${node.name || mesh.name}: primitive mode ${prim.mode} skipped (points and lines are not geometry)`);
					continue;
				}
				const posIdx = prim.attributes && prim.attributes.POSITION;
				if (posIdx === undefined) continue;
				let imageIndex = -1, culled = false;
				if (prim.material !== undefined) {
					const mat = (gltf.materials || [])[prim.material];
					culled = !!mat && !mat.doubleSided;
					const texRef = mat && colourTextureOf(mat);
					const tex = texRef && (gltf.textures || [])[texRef.index];
					if (tex && tex.source !== undefined) imageIndex = tex.source;
				}
				// A placeholder face keeps its geometry — the cube needs its corners —
				// but gets no UV, so it stays hidden as it was in Blockbench.
				const blank = imageIndex >= 0 && !!images[imageIndex] && images[imageIndex].blank;
				const pos = readAccessor(gltf, buffers, posIdx, accessorBudget).map(p => {
					const w = matApply(world, p);
					return [w[0] * scale + offset[0], w[1] * scale + offset[1], w[2] * scale + offset[2]];
				});
				const uvIdx = prim.attributes.TEXCOORD_0;
				// in glTF the UV origin is top-left and V points down,
				// which matches Blockbench, so no flipping is required
				// With an atlas layout given, UV are mapped into its coordinates:
				// each image occupies its own rectangle.
				// An object with no material at all has no image to point at, and
				// without a rectangle its UV are simply multiplied by the project's
				// texture size — which, with an atlas, is the whole atlas. The model
				// then arrives wearing a stretched mix of every picture in it.
				//
				// Measured on a test model: all 533 primitives carry material 0, and
				// that material has no baseColorTexture, so not one object reaches an
				// image. It is the second way textures go wrong, next to a file that
				// pins everything to one material.
				const rect = o.uvRects
					? (imageIndex >= 0 ? o.uvRects[imageIndex] : (o.uvFallback || null))
					: null;
				const uv = uvIdx === undefined || blank ? null
					: readAccessor(gltf, buffers, uvIdx, accessorBudget).map(t => rect
						? [t[0] * rect.w + rect.x, t[1] * rect.h + rect.y]
						: [t[0] * uvW, t[1] * uvH]);

				const idx = prim.indices === undefined
					? pos.map((_, i) => i)
					: readAccessor(gltf, buffers, prim.indices, accessorBudget).map(a => a[0]);

				for (const tri of TRIANGULATE[prim.mode === undefined ? 4 : prim.mode](idx)) {
					const face = {
						positions: tri.map(k => pos[k]),
						uvs: tri.map(k => uv ? uv[k] : null),
						// the picture it reads, by glTF index; -1 for none
						image: imageIndex,
					};
					faces.push(face);
					if (culled) oneSided.add(face);
				}
			}
			// Outline shells are left out (see insideOutShells). A mirroring
			// transform turns the winding, and glTF reads it the other way there.
			const w = world;
			const mirrored = w[0] * (w[5] * w[10] - w[6] * w[9]) - w[4] * (w[1] * w[10] - w[2] * w[9])
				+ w[8] * (w[1] * w[6] - w[2] * w[5]) < 0;
			const outline = insideOutShells(faces, oneSided, mirrored);
			if (outline.shells) {
				outlineShells += outline.shells;
				faces = faces.filter(f => !outline.faces.has(f));
			}
			const trianglesPerImage = new Map();
			let blankHere = 0;
			for (const f of faces) {
				if (f.image >= 0 && images[f.image] && images[f.image].blank) blankHere++;
				else trianglesPerImage.set(f.image, (trianglesPerImage.get(f.image) || 0) + 1);
			}
			blankTriangles += blankHere;
			// Nothing but placeholder faces: an object nobody could ever see. Sketchfab's
			// conversion splits a cube by material, so its untextured faces arrive as
			// objects of their own — flat panels, or L-shaped pairs taken for non-boxes.
			if (faces.length && blankHere === faces.length) { blankObjects++; }
			else if (faces.length) {
				// The object's main image, for texel density and the report: the one
				// most of its triangles use.
				let imageIndex = -1, most = -1;
				for (const [img, n] of trianglesPerImage) if (img >= 0 && n > most) { imageIndex = img; most = n; }
				objects.push({
					name: node.name || mesh.name || `object_${objects.length}`, faces, node: nodeIndex,
					image: imageIndex,
					// every image the object reaches, for the atlas
					images: [...trianglesPerImage.keys()].filter(i => i >= 0),
				});
			}
		}

		for (const child of node.children || []) visit(child, world, nodeIndex, worldQuat, depth + 1);
	};

	// The extra rotation is applied as the base coordinate system: it reaches
	// positions, bone pivots and accumulated rest rotations alike, so animations
	// stay consistent.
	const corr = correctionQuat(o.rotate);
	const base = matFromTRS([0, 0, 0], corr, [1, 1, 1]);
	for (const r of roots) visit(r, base, -1, corr.slice());

	// Whether the model asks for transparency at all. A Minecraft-style figure is
	// built of two shells, and the outer one is see-through wherever it is unused;
	// with the alpha channel gone that shell turns into a solid slab and hides the
	// body. Knowing the material's intent is what makes the missing channel worth
	// reporting rather than guessing from the picture.
	const wantsAlpha = (gltf.materials || []).some(m => m.alphaMode === 'BLEND' || m.alphaMode === 'MASK');

	return {
		objects, images, warnings, hierarchy, wantsAlpha,
		// faces on a transparent placeholder, kept hidden, and objects made of nothing else
		blank: { triangles: blankTriangles, objects: blankObjects },
		// inside-out outline shells left out
		outlineShells,
		animations: parseAnimations(gltf, buffers, warnings, accessorBudget),
	};
}

/**
 * The texture that gives a material its colour. In glTF's own workflow that is
 * baseColorTexture; a file written in the specular-glossiness one keeps it as
 * diffuseTexture inside that extension instead. Read only there, such a file
 * looked textureless: every part fell back to the first picture, and on a scene
 * of a building with people in it the people wore pieces of the walls.
 */
function colourTextureOf(mat) {
	const pbr = mat && mat.pbrMetallicRoughness;
	if (pbr && pbr.baseColorTexture) return pbr.baseColorTexture;
	const sg = mat && mat.extensions && mat.extensions.KHR_materials_pbrSpecularGlossiness;
	return (sg && sg.diffuseTexture) || null;
}

/**
 * Moves every face's UV from its picture's own 0..1 into the atlas: `rects` by
 * glTF image index, `fallback` for a face that names no picture, and with
 * neither the UV size. The same as the parser's `uvRects`, done afterwards: the
 * atlas can only be laid out once the rebuild of the parts that are not boxes
 * has said what it adds to it, and the rebuild reads the pictures through the
 * UV as they were.
 */
function mapFaceUVs(objects, rects, fallback, uvSize) {
	for (const o of objects) for (const f of o.faces) {
		if (!f.uvs) continue;
		const r = f.image >= 0 ? rects[f.image] : fallback;
		f.uvs = f.uvs.map(t => t && (r ? [t[0] * r.w + r.x, t[1] * r.h + r.y] : [t[0] * uvSize[0], t[1] * uvSize[1]]));
	}
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

// Declared up here, above the Node export, on purpose: the export block ends in
// a `return`, and a `const` placed below it is never initialised in Node — any
// exported function that reads it then throws. This plugin has been bitten by
// exactly that once already.
const SKETCHFAB_API = 'https://api.sketchfab.com/v3';

/**
 * The search request, as a URL.
 *
 * Kept apart from the fetch so that the very request the plugin sends can be
 * checked against the live API, rather than a copy of it written in a test.
 *
 * Only downloadable models are searched: the rest cannot be fetched anyway, and
 * showing them would only raise false expectations.
 *
 * `blockbenchOnly` narrows the results to models tagged "blockbench". Those
 * are mostly built from cubes and convert whole, while a sculpt or a scanned
 * statue can only arrive as a pile of bounding boxes. Mostly, not always: the
 * tag can be set by hand, and Blockbench makes meshes too — cubeHint tells.
 * Checked on the live API: for "girl", none of 24 plain results carry the tag
 * and all 24 filtered ones do — on the second page as well, because the `next`
 * link Sketchfab returns keeps the parameter.
 */
function sketchfabSearchURL(query, blockbenchOnly, animatedOnly, sort) {
	const params = [
		'type=models',
		'downloadable=true',
		'archives_flavours=false',
		'count=24',
		'q=' + encodeURIComponent(query || ''),
	];
	if (blockbenchOnly) params.push('tags=blockbench');
	// Measured on the live API: with it 24 of 24 results carry an animation, without
	// it 3 to 13 of 24 did, and the next-page link keeps the parameter.
	if (animatedOnly) params.push('animated=true');
	if (sort && SKETCHFAB_SORTS.some(s => s.id === sort)) params.push('sort_by=' + sort);
	return SKETCHFAB_API + '/search?' + params.join('&');
}

/**
 * The orders the search can be put in. Measured on the live API: each of these
 * comes back ordered by its field, and the next-page link keeps it, so the
 * second page carries on where the first stopped. Without one, Sketchfab orders
 * by relevance.
 *
 * There is no order by downloads: the results carry no download count, and
 * `sort_by=-downloadCount` — like any value the API does not know — is taken
 * without complaint and returns the newest models instead. So only values from
 * this list are ever sent.
 */
const SKETCHFAB_SORTS = [
	{ id: '', label: 'Relevance' },
	{ id: '-likeCount', label: 'Most liked' },
	{ id: '-viewCount', label: 'Most viewed' },
	{ id: '-publishedAt', label: 'Newest' },
];

/**
 * Sketchfab's own 3D viewer for a model, to embed. Built from the uid rather than
 * taken from the results, so nothing but a model id ever lands in the frame's
 * address; `dnt` asks the viewer not to track.
 */
function sketchfabEmbedURL(uid) {
	return /^[0-9a-f]{32}$/i.test(String(uid))
		? `https://sketchfab.com/models/${uid}/embed?autostart=1&dnt=1&ui_theme=dark`
		: null;
}

/** The model's page on Sketchfab: the one the results give, if it is Sketchfab's. */
function sketchfabPageURL(model) {
	const given = model && model.viewerUrl;
	if (typeof given === 'string' && /^https:\/\/sketchfab\.com\//.test(given)) return given;
	return model && /^[0-9a-f]{32}$/i.test(String(model.uid)) ? `https://sketchfab.com/3d-models/${model.uid}` : null;
}

/**
 * Which of a model's archives to fetch, in the order to try them.
 *
 * Sketchfab keeps two: its own conversion to glTF, and the file the author
 * uploaded. The conversion is the safe choice, since an original may be a .blend
 * or an .fbx. But a model uploaded straight from Blockbench has Blockbench's own
 * glTF for an original, and the conversion can spoil it: it was seen dropping a
 * texture's transparency together with the material's alphaMode, so a fifth of
 * the faces came out black, rewriting the materials into specular-glossiness,
 * and wrapping the model in hundreds of numbered nodes. The originals of the same
 * models kept the transparency, the author's folders and every cube.
 *
 * Where a model came from is in its details (`source`); search results leave it
 * out. Without the details the conversion is taken, as before.
 */
function sketchfabArchives(links, details) {
	const list = [];
	if (details && details.source === 'blockbench' && links.source && links.source.url) {
		list.push({ url: links.source.url, original: true });
	}
	const converted = links.gltf || links.glb;
	if (converted && converted.url) list.push({ url: converted.url, original: false });
	return list;
}

/**
 * The credit Sketchfab writes into its conversion as license.txt, made from the
 * model's details: the author's original comes without one, and attribution must
 * not be lost on the way.
 */
function sketchfabCredit(details) {
	const user = details.user || {}, lic = details.license || {};
	const author = (user.displayName || user.username || '?') + (user.profileUrl ? ` (${user.profileUrl})` : '');
	const licence = (lic.fullName || lic.label || 'not stated') + (lic.url ? ` (${lic.url})` : '');
	return [
		'Model Information:',
		`* title:\t${details.name || '?'}`,
		`* source:\t${details.viewerUrl || '?'}`,
		`* author:\t${author}`,
		'',
		'Model License:',
		`* license type:\t${licence}`,
		...(lic.requirements ? [`* requirements:\t${lic.requirements}`] : []),
		'',
		'If you use this 3D model in your project be sure to copy paste this credit wherever you share it:',
		`This work is based on "${details.name || '?'}" (${details.viewerUrl || '?'}) by ${author} licensed under ${licence}`,
	].join('\n');
}

/**
 * Downloads a model: the unpacked files, and whether they are the author's
 * original. Which archive is tried first is sketchfabArchives' call; an
 * original that fails to come or holds no glTF gives way to the conversion.
 *
 * The archive links are temporary, so they are fetched at once.
 */
async function sketchfabDownload(uid, token, onProgress) {
	if (!token) throw new Error('no API token set');
	const say = text => onProgress && onProgress(text);

	say('requesting link…');
	// The details need no token, and are asked for alongside the links.
	const asked = fetch(SKETCHFAB_API + '/models/' + uid)
		.then(r => r.ok ? r.json() : null)
		.catch(() => null);
	const r = await fetch(SKETCHFAB_API + '/models/' + uid + '/download', {
		headers: { Authorization: 'Token ' + token },
	});
	if (r.status === 401) throw new Error('token rejected (401)');
	if (r.status === 403) throw new Error('no permission to download this model (403)');
	if (!r.ok) throw new Error('HTTP ' + r.status);
	const links = await r.json();
	const details = await asked;
	const archives = sketchfabArchives(links, details);
	if (!archives.length) throw new Error('the response has no glTF link');

	let failure = null;
	for (const archive of archives) {
		try {
			say(archive.original ? 'downloading the author\'s original…' : 'downloading archive…');
			const entries = await sketchfabUnpack(archive.url, say);
			if (!archive.original) return { entries, original: false };
			if (Object.keys(entries).some(n => /\.(gltf|glb)$/i.test(n))) {
				if (!Object.keys(entries).some(n => /license[.]txt$/i.test(n))) {
					entries['license.txt'] = new TextEncoder().encode(sketchfabCredit(details));
				}
				return { entries, original: true };
			}
		} catch (e) {
			failure = e;
		}
	}
	throw failure || new Error('the author\'s original holds no glTF, and there is no conversion');
}

/** Fetches an archive and unpacks it: path in the archive -> bytes. */
async function sketchfabUnpack(url, say) {
	const r = await fetch(url);
	if (!r.ok) throw new Error('archive returned HTTP ' + r.status);
	if (!r.body || !r.body.getReader) throw new Error('This build cannot stream archive downloads safely');
	const reader = r.body.getReader(), chunks = [];
	let size = 0;
	try {
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			size += value.byteLength;
			boundedInteger(size, IMPORT_LIMITS.archiveInputBytes, 'archive download bytes');
			chunks.push(value);
		}
	} catch (e) { await reader.cancel().catch(() => {}); throw e; }
	finally { reader.releaseLock(); }
	const buf = new Uint8Array(size);
	let at = 0;
	for (const chunk of chunks) { buf.set(chunk, at); at += chunk.length; }
	say('unpacking…');
	return unpackModelArchive(buf);
}

/** Both archive entry points count actual streamed output, never just ZIP metadata. */
async function unpackModelArchive(bytes) {
	boundedInteger(bytes.byteLength, IMPORT_LIMITS.archiveInputBytes, 'archive input bytes');
	const zip = await JSZip.loadAsync(bytes);
	const members = [], entries = Object.create(null);
	let count = 0, total = 0;
	zip.forEach((name, entry) => {
		boundedInteger(++count, IMPORT_LIMITS.archiveEntries, 'archive entry count');
		if (!entry.dir) members.push({ name, entry });
	});
	for (const { name, entry } of members) {
		if (typeof entry.internalStream !== 'function') throw new Error('This JSZip build cannot stream archive entries safely');
		entries[name] = await new Promise((resolve, reject) => {
			const chunks = [], stream = entry.internalStream('uint8array');
			let size = 0, failed = false;
			stream.on('data', chunk => {
				if (failed) return;
				try {
					size += chunk.byteLength; total += chunk.byteLength;
					boundedInteger(size, IMPORT_LIMITS.archiveEntryBytes, 'archive entry bytes');
					boundedInteger(total, IMPORT_LIMITS.archiveBytes, 'archive expanded bytes');
					chunks.push(chunk);
				} catch (e) { failed = true; stream.pause(); reject(e); }
			}).on('error', e => { failed = true; reject(e); }).on('end', () => {
				if (failed) return;
				try {
					const out = new Uint8Array(size);
					let offset = 0;
					for (const chunk of chunks) { out.set(chunk, offset); offset += chunk.length; }
					resolve(out);
				} catch (e) { reject(e); }
			}).resume();
		});
	}
	return entries;
}

// ------------------------------------------- CPM (.cpmproject) construction

/**
 * Customizable Player Models lives in the coordinate system of vanilla
 * Minecraft models, not of Blockbench: X points the other way, Y points down
 * and starts 24 px above the feet. Rotations follow the axes.
 *
 * Derived from the mod's own Blockbench exporter (BlockbenchExport.java:255-272
 * and its convert()), not guessed.
 */
function cpmPoint(p) { return [-p[0], 24 - p[1], p[2]]; }

/** The same for a difference of two points: the 24 px shift cancels out. */
function cpmDelta(p) { return [-p[0], -p[1], p[2]]; }

/**
 * Pivots of the vanilla player parts, already in CPM coordinates.
 * Straight out of PlayerPartValues.java (px, py, pz). Independent of skin type:
 * the slim arms differ in width, not in where they hinge.
 */
const CPM_PARTS = {
	head:      [0, 0, 0],
	body:      [0, 0, 0],
	left_arm:  [5, 2, 0],
	right_arm: [-5, 2, 0],
	left_leg:  [1.9, 12, 0],
	right_leg: [-1.9, 12, 0],
};
const CPM_PART_NAMES = Object.keys(CPM_PARTS);

/**
 * Blockbench face -> CPM face, with the UV rotation each one needs.
 *
 * East and west swap because X is flipped. Up and down keep their names — CPM's
 * "up" is the face with the SMALLEST y, since y grows downwards — but their UV
 * comes out rotated by 180°: BoxRender.createTextured lays u along +X and v
 * along -Z there, while Blockbench uses -X and +Z. The mod's own exporter adds
 * the same 180° in convertUV().
 */
const CPM_FACE = {
	north: { dir: 'north', rot: '0' },
	south: { dir: 'south', rot: '0' },
	east:  { dir: 'west',  rot: '0' },
	west:  { dir: 'east',  rot: '0' },
	up:    { dir: 'up',    rot: '180' },
	down:  { dir: 'down',  rot: '180' },
};

/**
 * Euler angles of a cube for CPM, in degrees, normalised to 0..360.
 *
 * The basis is carried over into CPM coordinates by conjugation with
 * S = diag(-1, -1, 1) rather than by flipping the angles that Blockbench
 * reports. Conjugation is exact and needs no case analysis: S is its own
 * inverse and its determinant is +1, so the result is still a rotation.
 *
 * The angles are then extracted in ZYX order, i.e. R = Rz·Ry·Rx. That is the
 * order an element is actually rotated in: Rotation.asQ() builds the quaternion
 * with RotationOrder.ZYX. Quaternion also has a plain three-float constructor
 * that composes XYZ, but nothing on the element path calls it.
 */
function cpmEuler(sol) {
	return cpmEulerFromMatrix([
		[sol.vx[0], sol.vy[0], sol.vz[0]],
		[sol.vx[1], sol.vy[1], sol.vz[1]],
		[sol.vx[2], sol.vy[2], sol.vz[2]],
	]);
}

/** The same for a rotation given as a quaternion in Blockbench axes. */
function cpmEulerFromQuat(q) {
	const [x, y, z, w] = q;
	return cpmEulerFromMatrix([
		[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
		[2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
		[2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)],
	]);
}

/** @param R rotation matrix in Blockbench axes, R[row][col] */
function cpmEulerFromMatrix(R) {
	return cpmEulerZYX(cpmConjugate(R));
}

/** Carries a rotation from Blockbench axes into CPM ones: S·R·S, S = diag(-1,-1,1). */
function cpmConjugate(R) {
	const s = [-1, -1, 1];
	return [0, 1, 2].map(i => [0, 1, 2].map(j => s[i] * s[j] * R[i][j]));
}

/** Euler angles in ZYX order, degrees, 0..360. The matrix is already in CPM axes. */
function cpmEulerZYX(m) {
	const clamp = v => Math.min(1, Math.max(-1, v));
	const y = Math.asin(-clamp(m[2][0]));
	let x, z;
	if (Math.abs(m[2][0]) < 0.9999999) {
		x = Math.atan2(m[2][1], m[2][2]);
		z = Math.atan2(m[1][0], m[0][0]);
	} else {
		// Gimbal lock: y is ±90°, and only the sum of x and z is defined.
		x = 0;
		z = Math.atan2(-m[0][1], m[1][1]);
	}
	return [x, y, z].map(r => cpmAngle(r * 180 / Math.PI));
}

const mat3Mul = (a, b) => [0, 1, 2].map(i => [0, 1, 2].map(j =>
	a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j]));
const mat3T = a => [0, 1, 2].map(i => [0, 1, 2].map(j => a[j][i]));
const mat3Apply = (a, v) => [0, 1, 2].map(i => a[i][0] * v[0] + a[i][1] * v[1] + a[i][2] * v[2]);
const MAT3_ID = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

/** The rotation of a column-major 4x4, with any scale divided out. */
function mat3FromMat4(m) {
	const col = c => {
		const v = [m[c * 4], m[c * 4 + 1], m[c * 4 + 2]];
		const l = Math.hypot(v[0], v[1], v[2]) || 1;
		return [v[0] / l, v[1] / l, v[2] / l];
	};
	const [a, b, c] = [col(0), col(1), col(2)];
	return [0, 1, 2].map(i => [a[i], b[i], c[i]]);
}

/**
 * CPM stores an angle as an unsigned 16-bit fraction of a full turn
 * (IOHelper.writeAngle), so a negative value would be clamped to zero rather
 * than wrapped. Everything is brought into 0..360 before it is written.
 */
function cpmAngle(deg) {
	let r = deg % 360;
	if (r < 0) r += 360;
	r = Math.round(r * 100) / 100;
	return r >= 360 ? 0 : r;
}

/**
 * How much finer the UV grid has to be for every UV to land on a whole number.
 *
 * CPM keeps face UV in integers, but they are integers of the UV GRID, whose
 * size is stored apart from the actual picture (config.json skinSize versus
 * skin.png — the mismatch is exactly what turns on customGridSize). So a
 * fractional UV costs nothing but a larger number: the image is never touched,
 * and the viewer-side limit on texture size is measured on the image.
 *
 * The mod's own exporter multiplies by 16 whenever a single UV is fractional.
 * We take the smallest multiplier that works, so the numbers stay readable.
 */
function cpmUVScale(cubes, limit, texSize) {
	// The grid is written as a signed short (IOHelper.write2s), so it has to stay
	// under 32767 — ×16 on a 2048 texture would land exactly on the edge.
	let max = limit || 16;
	while (texSize && texSize * max > 32767 && max > 1) max /= 2;
	const values = [];
	for (const c of cubes) {
		for (const name of FACE_NAMES) {
			const uv = c.sol.faceUV[name];
			if (uv) values.push(uv[0], uv[1], uv[2], uv[3]);
		}
	}
	const off = (v, mul) => Math.abs(v * mul - Math.round(v * mul));
	for (let mul = 1; mul <= max; mul *= 2) {
		if (values.every(v => off(v, mul) < 0.01)) return { mul, exact: true, worst: 0 };
	}
	// Nothing within the ceiling makes them whole: take the ceiling and report
	// the worst rounding, in picture pixels, so the cost is visible.
	let worst = 0;
	for (const v of values) worst = Math.max(worst, off(v, max) / max);
	return { mul: max, exact: false, worst };
}

/**
 * A first guess at which bone is which part of the player, by name.
 *
 * Only a guess — the last word belongs to the person at the dialog. Models off
 * Sketchfab name their bones anything at all, and a wrong guess made silently
 * is worse than no guess. What it does buy is that a model already rigged like
 * a player, which is most of them, needs no corrections at all.
 *
 * A bone with no verdict is deliberately left out: it inherits its parent's
 * part, so an item pivot inside an arm goes along with the arm on its own.
 */
function cpmAutoAssign(hierarchy) {
	const assign = {};
	for (const h of hierarchy) {
		const n = String(h.name || '').toLowerCase().replace(/[^a-z]/g, '');
		const side = n.indexOf('left') >= 0 ? 'left' : n.indexOf('right') >= 0 ? 'right' : null;
		const limb = /arm|hand|shoulder/.test(n) ? 'arm' : /leg|foot|thigh|knee/.test(n) ? 'leg' : null;
		if (side && limb) assign[h.index] = `${side}_${limb}`;
		else if (/head|skull/.test(n)) assign[h.index] = 'head';
		else if (/body|torso|chest|spine/.test(n)) assign[h.index] = 'body';
	}
	return assign;
}

/**
 * How far the model has to be moved for its skeleton to sit on the player's.
 *
 * Centring on the bounding box is not enough, and on some models it is actively
 * wrong: this one has a long tail, so centring the box put the character itself
 * 18 px in front of the player. At rest that is invisible — the model is
 * self-consistent — but every vanilla part turns about ITS OWN pivot, and a limb
 * hanging 18 px away from that pivot swings out of the body the moment the arm
 * moves. That is what tore the first version apart in game.
 *
 * So the offset is taken from the rig instead: the average gap between the bones
 * the person mapped and the vanilla pivots they were mapped to. A whole-model
 * translation cannot deform anything — the alternative, aligning each part
 * separately, would put every limb exactly on its pivot and pull the model
 * apart at rest.
 *
 * A residual of a few pixels stays and is unavoidable: an imported character has
 * its shoulders and hips where its author put them, not where Minecraft does.
 */
function cpmAlignOffset(hierarchy, assign, k) {
	const diffs = [];
	for (const h of hierarchy) {
		const part = assign && assign[h.index];
		if (!part || !CPM_PARTS[part]) continue;
		diffs.push(sub(CPM_PARTS[part], cpmPoint(mul(h.pivot, k || 1))));
	}
	if (!diffs.length) return [0, 0, 0];
	const mean = i => diffs.reduce((s, d) => s + d[i], 0) / diffs.length;
	// Height is left alone on purpose. The import already stands the model on the
	// ground, and that is a hard constraint — averaging the rig mismatch
	// vertically pulled this model a pixel INTO the floor, which showed up the
	// moment it crouched. Sideways and depthwise there is no such anchor, and
	// that is exactly where centring on the bounding box goes wrong.
	return [mean(0), 0, mean(2)];
}

/**
 * The model tree for config.json.
 *
 * Roots are not our bones but the fixed parts of the player: everything of ours
 * hangs off them as children. A bone becomes a CPM element with no geometry
 * (size 0), a cube becomes an element with a box.
 *
 * `assign` maps a glTF node index to a player part. It may be partial: a bone
 * without an entry of its own inherits the part of its parent.
 */
function buildCPMConfig(input) {
	const hierarchy = input.hierarchy;
	const cubes = input.cubes;
	const assign = input.assign || {};
	const fallback = input.fallback || 'body';
	const uvMul = input.uvMul || 1;
	// CPM measures in player pixels, and a Sketchfab model arrives in whatever
	// units its author used, so the size here is its own setting rather than the
	// one the GeckoLib branch was imported at. Geometry scales uniformly —
	// positions, sizes and inflation — while angles and UV do not.
	const k = input.scale || 1;
	// A whole-model shift onto the player's skeleton. Only bones attached
	// straight to a player part need it: everything below them is measured
	// against its parent and comes along by itself.
	const align = input.align || [0, 0, 0];
	const warnings = [];

	// Step 1. Which player part each bone belongs to. The hierarchy is ordered
	// parent-before-child, so one pass is enough.
	const partOf = {};
	const indexOf = {};
	hierarchy.forEach((h, i) => { indexOf[h.index] = i; });
	for (const h of hierarchy) {
		const own = assign[h.index];
		const inherited = h.parent >= 0 ? partOf[h.parent] : null;
		partOf[h.index] = own || inherited || fallback;
	}

	// Step 2. Which bones are worth keeping. A bone with no cubes anywhere below
	// it carries nothing; the model gains a hundred empty elements and the tree
	// becomes unreadable. Walking backwards marks the ancestors of a keeper.
	const cubesByNode = {};
	for (const c of cubes) (cubesByNode[c.node] = cubesByNode[c.node] || []).push(c);
	const keep = {};
	for (let i = hierarchy.length - 1; i >= 0; i--) {
		const h = hierarchy[i];
		if (cubesByNode[h.index] || keep[h.index]) {
			keep[h.index] = true;
			if (h.parent >= 0) keep[h.parent] = true;
		}
	}

	// Step 2a. Collapse the nodes glTF creates just to hold a mesh.
	//
	// This is not tidiness. CPM counts EVERY element against MAX_CUBE_COUNT,
	// empty ones included (ModelDefinition:162 counts cubes.size()), and the
	// default limit is 256. One node per mesh doubles the count for nothing: the
	// node's pivot has no life of its own, and its box already carries its own
	// position. Dropping them took this model from 248 elements to 140.
	//
	// A node an animation moves is never collapsed — there it IS the pivot, and
	// merging it away would leave the animation nothing to turn.
	const animated = input.keepNodes || new Set();
	const collapse = {};
	const hostOf = {};
	for (const h of hierarchy) {
		const parentHost = h.parent >= 0 ? hostOf[h.parent] : undefined;
		collapse[h.index] = keep[h.index] && h.hasMesh && !animated.has(h.index) && parentHost !== undefined;
		hostOf[h.index] = collapse[h.index] ? parentHost : h.index;
	}

	// Step 3. The elements themselves.
	let storeID = 1000;
	const roots = {};
	const elemOf = {};
	const attachOf = {};
	const usedParts = {};

	const rootFor = part => {
		if (!roots[part]) {
			roots[part] = {
				id: part,
				// The vanilla part is hidden: our model stands in its place. Its pivot
				// is left where it is, so vanilla animation still swings the limb.
				show: false,
				showInEditor: true,
				locked: false,
				pos: vec3(0, 0, 0),
				rotation: vec3(0, 0, 0),
				dup: false,
				// When the model brings its own walk, the vanilla arm swing lands on
				// top of it and the motion is played twice. The head is normally left
				// alone even so: vanilla animation is what makes it follow the camera,
				// and a character that no longer looks where you look reads as broken.
				disableVanillaAnim: !!(input.stopVanillaAnim && input.stopVanillaAnim[part]),
				name: '',
				nameColor: 0,
				children: [],
			};
			usedParts[part] = 0;
		}
		return roots[part];
	};

	for (const h of hierarchy) {
		if (!keep[h.index] || collapse[h.index]) continue;
		const part = partOf[h.index];
		const host = h.parent >= 0 ? hostOf[h.parent] : undefined;
		const parentKept = host !== undefined && keep[host];
		// A bone whose parent went to a different part cannot hang off it: it
		// starts a new subtree under its own part, measured from that part's pivot.
		const attachToRoot = !parentKept || partOf[host] !== part;

		const pos = attachToRoot
			? sub(add(cpmPoint(mul(h.pivot, k)), align), CPM_PARTS[part])
			: cpmDelta(mul(sub(h.pivot, hierarchy[indexOf[host]].pivot), k));

		const el = cpmElement({
			name: h.name,
			pos,
			size: [0, 0, 0],
			storeID: storeID++,
		});
		el.children = [];
		elemOf[h.index] = el;
		if (attachToRoot) {
			rootFor(part).children.push(el);
			usedParts[part]++;
			attachOf[h.index] = { parent: null, part };
		} else {
			elemOf[host].children.push(el);
			attachOf[h.index] = { parent: host, part };
		}
	}

	// Step 4. Cubes, each under the bone of its own node.
	let placed = 0;
	for (const c of cubes) {
		const host = hostOf[c.node];
		const bone = elemOf[host];
		if (!bone) { warnings.push(`${c.name}: no bone for node ${c.node}, cube dropped`); continue; }
		const h = hierarchy[indexOf[host]];
		const place = placeCoords(c.sol);
		const half = c.sol.size.map(v => Math.abs(v) / 2);
		const from = place(sub(c.sol.center, half));
		const to = place(add(c.sol.center, half));
		const center = from.map((v, i) => (v + to[i]) / 2);
		const size = from.map((v, i) => Math.abs(to[i] - v) * k);

		const el = cpmElement({
			name: c.name,
			// CPM places a box as: shift by pos, rotate, shift by offset, then draw
			// size. Putting the pivot at the centre and the offset at minus half the
			// size reproduces Blockbench exactly, where a cube turns about origin and
			// our origin is the centre.
			pos: cpmDelta(mul(sub(center, h.pivot), k)),
			rotation: cpmEuler(c.sol),
			offset: size.map(v => -v / 2),
			size,
			mcScale: (c.inflate || 0) * k,
			storeID: storeID++,
			faceUV: cpmFaceUV(c.sol, uvMul),
		});
		bone.children.push(el);
		placed++;
	}

	// Empty bones can survive step 2 as ancestors of a keeper; that is fine. What
	// is not fine is a part that ended up with nothing at all.
	const parts = Object.keys(roots);
	if (!parts.length) warnings.push('nothing was assigned to any player part');

	// Every vanilla part is hidden, including the ones we did not fill: a half
	// vanilla, half custom player is never what anyone meant by replacing a model.
	for (const p of CPM_PART_NAMES) rootFor(p);

	return {
		elements: CPM_PART_NAMES.map(p => roots[p]),
		// Animations address elements by storeID and need each bone's rest position
		// to write an absolute value, so the built elements are handed back rather
		// than being rebuilt from the JSON afterwards.
		elemByNode: elemOf,
		// Where each bone actually ended up: under another bone, or straight under a
		// player part. Animations need this, because a bone's parent in the CPM tree
		// is often NOT its parent in glTF.
		attachOf,
		warnings,
		stats: { cubes: placed, bones: Object.keys(elemOf).length, parts: usedParts },
	};
}

/**
 * Which vanilla pose an animation is called by, guessed from its name.
 *
 * Sketchfab models come from Blockbench and Blockbench-likes, where these names
 * are a de facto standard: the fourteen animations of the test model all land
 * without a correction. Anything unrecognised becomes a gesture, which is the
 * safe outcome — a gesture plays on demand and never replaces vanilla motion.
 */
const CPM_POSE_GUESS = [
	[/^(idle|stand)/, 'STANDING'],
	[/^(sneak.?walk|crouch.?walk)/, 'SNEAK_WALK'],
	[/^(walk)/, 'WALKING'],
	[/^(run|sprint)/, 'RUNNING'],
	[/^(sneak|crouch|squat)$/, 'SNEAKING'],
	[/^(swim)/, 'SWIMMING'],
	[/^(sleep)/, 'SLEEPING'],
	[/^(sit|ride|riding)/, 'RIDING'],
	// Elytra flight is FLYING, not WEARING_ELYTRA: AnimationState.getMainPose
	// returns FLYING for elytraFlying, while WEARING_ELYTRA is a layer that
	// applies whenever an elytra is worn, flying or not. Plain "flying" is left
	// to creative flight, which is what the word usually means in a model.
	[/elytra/, 'FLYING'],
	[/^(fly|flying|hover)/, 'CREATIVE_FLYING'],
	[/^(fall)/, 'FALLING'],
	[/^(jump)/, 'JUMPING'],
	[/^(die|dying|death)/, 'DYING'],
	[/^(hurt|damage)/, 'HURT'],
];

/**
 * The poses offered in the dialog. CPM has about sixty, most of them about
 * holding a particular item; a list that long is unreadable, and everything
 * missing from it is still reachable inside the CPM editor afterwards.
 */
const CPM_POSE_OPTIONS = [
	'STANDING', 'WALKING', 'RUNNING', 'SNEAKING', 'SNEAK_WALK', 'JUMPING', 'FALLING',
	'SWIMMING', 'SLEEPING', 'RIDING', 'FLYING', 'CREATIVE_FLYING', 'WEARING_ELYTRA',
	'ON_LADDER', 'CLIMBING_ON_LADDER', 'DYING', 'HURT', 'ON_FIRE',
];

/**
 * The poses AnimationState.getMainPose can settle on, in its own priority order.
 *
 * Worth listing because of what happens in the gaps. The pose is chosen by
 * player state, first match wins, and if the model has nothing for the chosen
 * one it simply keeps its rest pose. That is harmless on its own — vanilla
 * animation still moves the limbs — but becomes a frozen model the moment
 * disableVanillaAnim is switched on for a part.
 */
const CPM_MAIN_POSES = [
	'SLEEPING', 'DYING', 'FLYING', 'TRIDENT_SPIN', 'FALLING', 'RIDING', 'CREATIVE_FLYING',
	'CRAWLING', 'SWIMMING', 'RETRO_SWIMMING', 'CLIMBING_ON_LADDER', 'ON_LADDER',
	'JUMPING', 'SNEAK_WALK', 'SNEAKING', 'RUNNING', 'WALKING', 'STANDING',
];

function cpmAutoPose(name) {
	const n = String(name || '').toLowerCase().trim();
	for (const [re, pose] of CPM_POSE_GUESS) if (re.test(n)) return pose;
	return 'gesture';
}

/**
 * Animations for the .cpmproject.
 *
 * CPM does not store curves. A frame is a SNAPSHOT: a list of elements with
 * their absolute position and rotation, and the frames are spread evenly over
 * `duration` (EditorAnim.animate computes the step as
 * `millis % duration / duration * frames.size()`). So the glTF curves are
 * sampled at a fixed rate, and the last frame interpolates back into the first.
 *
 * The offsets are NOT carried over one bone at a time, the way the GeckoLib
 * branch does it. There a bone keeps its glTF parent, so a local offset is all
 * that is needed. Here it is not: the head hangs off the player's head part
 * while in glTF it sits under the body, so a rotation of the body would simply
 * fail to reach it and the model would come apart mid-animation.
 *
 * So each frame is computed from the WORLD pose. For every bone we work out
 * where glTF puts it at that moment, then express that against whatever its
 * parent in the CPM tree happens to be. Bones whose two parents coincide come
 * out with exactly the local offset anyway; the ones that cross a part boundary
 * come out right instead of coming apart.
 */
function buildCPMAnimations(input) {
	const hierarchy = input.hierarchy;
	const elemByNode = input.elemByNode;
	const attachOf = input.attachOf || {};
	const poses = input.poses || {};
	const fps = input.fps || 12;
	const maxFrames = input.maxFrames || 60;
	const scale = input.scale || 16;
	const k = input.k || 1;
	// The same shift onto the player's skeleton the rest pose got. For a nested
	// bone it cancels out in the difference against its parent; for one hanging
	// off a player part it does not, because the part pivot does not move.
	const align = input.align || [0, 0, 0];
	const files = {};
	const warnings = [];
	const stats = { animations: 0, frames: 0, components: 0, skipped: [], moved: 0 };

	const byIdx = {};
	for (const h of hierarchy) byIdx[h.index] = h;

	// The base frame the parser started from: the extra rotation from the dialog
	// is baked into it, and a root node carries it as its parentQuat.
	const firstRoot = hierarchy.find(h => h.parent < 0);
	const base = matFromTRS([0, 0, 0], (firstRoot && firstRoot.parentQuat) || [0, 0, 0, 1], [1, 1, 1]);

	/** World matrices for the whole tree, with `at` overriding the rest pose. */
	const worldAll = at => {
		const w = {};
		for (const h of hierarchy) {
			const o = (at && at[h.index]) || {};
			const local = matFromTRS(
				o.translation || h.rest.translation,
				o.rotation || h.rest.rotation,
				h.rest.scale);
			w[h.index] = matMul(h.parent >= 0 ? w[h.parent] : base, local);
		}
		return w;
	};

	const restWorld = worldAll(null);
	// Rest positions come from the parser rather than from this matrix: it already
	// carries the centring offset, and reproducing that here would be a second
	// place for the two to drift apart.
	const restOrigin = {};
	for (const h of hierarchy) restOrigin[h.index] = matApply(restWorld[h.index], [0, 0, 0]);

	// Which bones have an element of their own. Cubes need no frames: they sit
	// under their bone and follow it.
	const boneNodes = hierarchy.filter(h => elemByNode[h.index]).map(h => h.index);

	for (const a of input.animations) {
		const choice = poses[a.name] || 'gesture';
		if (choice === 'skip') { stats.skipped.push(a.name); continue; }

		const channels = a.channels.filter(ch => ch.path !== 'scale');
		if (!channels.length) { warnings.push(`${a.name}: no rotation or position channels`); continue; }

		// A static pose is an animation of zero length: one frame, held.
		const isPose = a.length < 1e-6;
		const count = isPose ? 1 : Math.max(2, Math.min(maxFrames, Math.round(a.length * fps)));

		// Pass one: work out every bone's local transform in every frame, and note
		// which of them ever leave their rest pose. A bone that moves in one frame
		// is written in ALL of them — a bone that appears and vanishes between
		// frames would have the player guessing what it interpolates towards.
		const perFrame = [];
		const moves = new Set();
		for (let i = 0; i < count; i++) {
			const t = isPose ? 0 : (i / count) * a.length;
			const at = {};
			for (const ch of channels) (at[ch.node] = at[ch.node] || {})[ch.path] = sampleChannel(ch, t);
			const world = worldAll(at);

			// Where every bone stands now, in CPM coordinates, and how it is turned.
			const P = {}, R = {};
			for (const n of boneNodes) {
				const h = byIdx[n];
				const moved = matApply(world[n], [0, 0, 0]);
				const o = restOrigin[n];
				// The pivot from the parser already holds scale and centring, so only
				// the displacement since rest is scaled and added to it.
				const bb = [
					h.pivot[0] + (moved[0] - o[0]) * scale,
					h.pivot[1] + (moved[1] - o[1]) * scale,
					h.pivot[2] + (moved[2] - o[2]) * scale,
				];
				P[n] = add(cpmPoint(mul(bb, k)), align);
				// The rest pose is baked into the geometry while the bone stands
				// unrotated, so what the frame carries is the change since rest.
				R[n] = cpmConjugate(mat3Mul(mat3FromMat4(world[n]), mat3T(mat3FromMat4(restWorld[n]))));
			}

			const locals = {};
			for (const n of boneNodes) {
				const att = attachOf[n] || { parent: null, part: 'body' };
				const parentP = att.parent !== null && P[att.parent] ? P[att.parent] : CPM_PARTS[att.part] || [0, 0, 0];
				const parentR = att.parent !== null && R[att.parent] ? R[att.parent] : MAT3_ID;
				const inv = mat3T(parentR);
				const pos = mat3Apply(inv, sub(P[n], parentP));
				const rot = cpmEulerZYX(mat3Mul(inv, R[n]));
				locals[n] = { pos, rot };

				const el = elemByNode[n];
				const dp = Math.hypot(pos[0] - el.pos.x, pos[1] - el.pos.y, pos[2] - el.pos.z);
				const dr = Math.max(...rot.map(v => Math.min(v, 360 - v)));
				if (dp > 0.01 || dr > 0.05) moves.add(n);
			}
			perFrame.push(locals);
		}

		if (!moves.size) { warnings.push(`${a.name}: nothing moves, skipped`); continue; }
		stats.moved += moves.size;

		const frames = perFrame.map(locals => {
			const components = [];
			for (const n of moves) {
				const el = elemByNode[n];
				components.push({
					storeID: el.storeID,
					pos: vec3(...locals[n].pos),
					rotation: vec3(...locals[n].rot),
					scale: vec3(1, 1, 1),
					color: 'ffffff',
					show: true,
				});
			}
			stats.components += components.length;
			return { components };
		});

		const vanilla = choice !== 'gesture';
		const clean = String(a.name).replace(/[^a-zA-Z0-9.\-]/g, '');
		const id = cpmRandomId();
		const file = vanilla
			? `v_${choice.toLowerCase()}_${clean}_${id}.json`
			: `g_${clean}_${id}.json`;

		files['animations/' + file] = JSON.stringify({
			name: a.name,
			additive: false,
			// Zero-length poses would otherwise play out in a millisecond.
			duration: isPose ? 1000 : Math.max(1, Math.round(a.length * 1000)),
			priority: 0,
			loop: !isPose,
			// glTF interpolates linearly. A spline over sparse oscillating values —
			// legs in a walk cycle go +1, 0, −1, 0 — overshoots well past them.
			interpolator: isPose ? 'linear_single' : 'linear_loop',
			layerDefault: 0,
			order: 0,
			isProperty: false,
			command: false,
			layerControlled: true,
			maxValue: 100,
			interpolateVal: true,
			mustFinish: false,
			hidden: false,
			frames,
		}, null, 1);

		stats.animations++;
		stats.frames += frames.length;
	}

	return { files, warnings, stats };
}

/**
 * How large the model will be once CPM encodes it, in bytes.
 *
 * This matters more than it sounds. A local `.cpmmodel` gets a buffer of
 * exactly 30 kB (Exporter.ModelWriter: `new byte[skinCompat ? 2*1024 : 30*1024]`),
 * and anything past that has to be uploaded to a paste site instead of just
 * working. Without a number here the overflow is a surprise at the end of a long
 * export; with one it is a decision taken up front, where the levers are.
 *
 * The estimate follows the mod's own writers: saveDefinitionCubeV2 for boxes,
 * writeFaces for per-face UV, and ModelPartAnimation.write for frames — where a
 * track whose values never leave the element's rest pose is dropped entirely
 * (`hasPosChanges`), so a bone that only turns costs nothing for position.
 */
function cpmEstimateSize(config, animations, skinBytes) {
	// A CPM float is stored as a signed varint of value×682 (IOHelper DIV).
	const varLen = v => {
		let n = Math.abs(Math.round(v)) * 2;
		let len = 1;
		while (n >= 128) { n = Math.floor(n / 128); len++; }
		return len;
	};
	const vecLen = v => varLen(v.x * 682) + varLen(v.y * 682) + varLen(v.z * 682);

	let cubes = 0, count = 0;
	const byStore = {};
	const walk = list => {
		for (const el of list || []) {
			count++;
			byStore[el.storeID] = el;
			const box = el.size.x || el.size.y || el.size.z;
			// flags, parent, pos, rotation
			let n = 1 + 2 + vecLen(el.pos) + 6;
			if (box) {
				n += vecLen(el.size) + vecLen(el.offset);
				n += 1 + varLen(el.u) + varLen(el.v);
				if (el.faceUV) {
					n += 1;
					for (const f of Object.values(el.faceUV)) {
						n += varLen(f.sx) + varLen(f.sy) + varLen(f.ex) + varLen(f.ey) + 1;
					}
				}
			}
			cubes += n;
			walk(el.children);
		}
	};
	for (const root of config.elements) walk(root.children);

	let anim = 0;
	for (const raw of Object.values(animations || {})) {
		const a = typeof raw === 'string' ? JSON.parse(raw) : raw;
		const frames = a.frames.length;
		anim += 30 + (a.name || '').length;
		// A track is kept only if it leaves the element's REST pose, not merely if
		// it varies: a bone held at a constant offset still needs storing.
		const seen = {};
		for (const f of a.frames) {
			for (const c of f.components) {
				const el = byStore[c.storeID];
				if (!el) continue;
				const s = seen[c.storeID] = seen[c.storeID] || { pos: false, rot: false };
				const off = (v, r) => Math.abs(v - r) > 0.01;
				if (off(c.pos.x, el.pos.x) || off(c.pos.y, el.pos.y) || off(c.pos.z, el.pos.z)) s.pos = true;
				if (off(c.rotation.x, el.rotation.x) || off(c.rotation.y, el.rotation.y)
					|| off(c.rotation.z, el.rotation.z)) s.rot = true;
			}
		}
		for (const s of Object.values(seen)) {
			anim += 2;
			// six bytes a frame for a track: three shorts, whether angle or position
			if (s.pos) anim += 5 + 6 * frames;
			if (s.rot) anim += 5 + 6 * frames;
		}
	}

	const texture = skinBytes ? skinBytes.length : 0;
	return { cubes, anim, texture, elements: count, total: cubes + anim + texture };
}

/**
 * An id for an animation filename. CPM puts a UUID there; nothing parses it,
 * it only has to keep two animations of the same name apart.
 */
function cpmRandomId() {
	const hex = n => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join('');
	return `${hex(8)}-${hex(4)}-${hex(4)}-${hex(4)}-${hex(12)}`;
}

function vec3(x, y, z) { return { x: round4(x), y: round4(y), z: round4(z) }; }
function round4(v) {
	const r = Math.round(v * 10000) / 10000;
	return Object.is(r, -0) ? 0 : r;
}

/** One element of the CPM tree, with every field its loader reads. */
function cpmElement(o) {
	const el = {
		name: o.name || '',
		show: true,
		texture: true,
		textureSize: 1,
		offset: vec3(...(o.offset || [0, 0, 0])),
		pos: vec3(...(o.pos || [0, 0, 0])),
		rotation: vec3(...(o.rotation || [0, 0, 0])),
		size: vec3(...(o.size || [0, 0, 0])),
		rscale: vec3(1, 1, 1),
		scale: vec3(1, 1, 1),
		u: 0,
		v: 0,
		color: 'ffffff',
		mirror: false,
		mcScale: o.mcScale || 0,
		glow: false,
		recolor: false,
		hidden: false,
		singleTex: false,
		extrude: false,
		locked: false,
		nameColor: 0,
		storeID: o.storeID || 0,
	};
	if (o.faceUV) el.faceUV = o.faceUV;
	return el;
}

/**
 * Per-face UV for one cube.
 *
 * A face missing from the map is not drawn at all — which is exactly what we
 * want for faces the source model never had. Mirroring needs no special case:
 * Blockbench writes it as a rectangle with x1 > x2, and CPM reads sx and ex in
 * the same order, so the flip carries over by itself.
 */
function cpmFaceUV(sol, mul) {
	const out = {};
	for (const name of FACE_NAMES) {
		const uv = sol.faceUV[name];
		if (!uv) continue;
		const f = CPM_FACE[name];
		out[f.dir] = {
			sx: Math.round(uv[0] * mul),
			sy: Math.round(uv[1] * mul),
			ex: Math.round(uv[2] * mul),
			ey: Math.round(uv[3] * mul),
			rot: f.rot,
			autoUV: false,
		};
	}
	return out;
}

/**
 * The files of a .cpmproject, ready to be zipped.
 *
 * Zipping is left to the caller on purpose: inside Blockbench that is JSZip,
 * and in the test harness a dozen lines of stored-entry writer. The part worth
 * checking is the content, and it is the same on both paths.
 */
function buildCPMFiles(input) {
	const built = buildCPMConfig(input);
	const config = {
		version: 1,
		skinType: input.skinType || 'default',
		elements: built.elements,
		skinSize: { x: input.uvWidth, y: input.uvHeight },
		textures: { skin: { customGridSize: input.uvWidth !== input.texWidth || input.uvHeight !== input.texHeight, anim: [] } },
		scaling: 0,
		hideHeadIfSkull: true,
		removeArmorOffset: true,
		removeBedOffset: false,
		enableInvisGlow: false,
	};
	const files = {
		'config.json': JSON.stringify(config, null, 1),
		'description.json': JSON.stringify({
			name: input.name || '',
			desc: input.description || '',
			cam: { pos: { x: 0.5, y: 1, z: 0.5 }, look: { x: 0.25, y: 0.5, z: 0.25 }, zoom: 64, copyProt: 'normal' },
		}, null, 1),
	};
	if (input.skin) files['skin.png'] = input.skin;

	let anims = { files: {}, warnings: [], stats: { animations: 0, frames: 0, components: 0, skipped: [], moved: 0 } };
	if (input.animations && input.animations.length) {
		anims = buildCPMAnimations({
			animations: input.animations,
			hierarchy: input.hierarchy,
			elemByNode: built.elemByNode,
			attachOf: built.attachOf,
			align: input.align,
			poses: input.poses,
			fps: input.fps,
			maxFrames: input.maxFrames,
			scale: input.gltfScale,
			k: input.scale,
		});
		Object.assign(files, anims.files);
	}

	return {
		files,
		config,
		warnings: built.warnings.concat(anims.warnings),
		stats: Object.assign({}, built.stats, {
			anim: anims.stats,
			size: cpmEstimateSize(config, anims.files, input.skin),
		}),
	};
}

// ------------------------------------------------------ Java block/item models

/**
 * The box a Java block or item model may occupy: every element's from/to within
 * −16…32 on each axis, the block itself and one block around it.
 */
const JAVA_BOX = [-16, 32];

/**
 * Where a still model goes in a Java model, and at what size.
 *
 * The bounds are taken from the cubes, not from the vertices: a turned cube's
 * from/to are its unturned box, which reaches further than its corners do. And
 * inflate counts, because the export bakes it into from/to.
 *
 * With `place` the model stands like a block — X and Z centred on it, the
 * bottom on its floor; without it the model stays where it is. Either way it is
 * then pushed back inside the box, and shrunk only if it is larger than the box
 * itself: moving by whole pixels keeps a model on its grid, shrinking does not.
 *
 * Returns the transform p' = pivot + k·(p − pivot) + shift.
 */
function fitJavaBox(boxes, place) {
	if (!boxes.length) return { k: 1, pivot: [0, 0, 0], shift: [0, 0, 0], extent: 0 };
	const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
	for (const b of boxes) {
		for (let a = 0; a < 3; a++) {
			const half = Math.abs(b.size[a]) / 2 + (b.inflate || 0);
			lo[a] = Math.min(lo[a], b.center[a] - half);
			hi[a] = Math.max(hi[a], b.center[a] + half);
		}
	}
	const span = JAVA_BOX[1] - JAVA_BOX[0];
	const extent = Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]);
	// A hair under the box when shrinking: coordinates are rounded to 0.001
	// afterwards, and a value on the very edge could round past it.
	const k = extent > span ? (span - 0.002) / extent : 1;
	const pivot = lo.map((v, a) => (v + hi[a]) / 2);
	const shift = [0, 0, 0];
	for (let a = 0; a < 3; a++) {
		const half = k * (hi[a] - lo[a]) / 2;
		let centre = !place ? pivot[a] : a === 1 ? half : 8;
		if (k === 1) centre = pivot[a] + Math.round(centre - pivot[a]);
		centre = Math.min(Math.max(centre, JAVA_BOX[0] + half), JAVA_BOX[1] - half);
		shift[a] = centre - pivot[a];
	}
	return { k, pivot, shift, extent };
}

function applyFit(p, fit) {
	return p.map((v, a) => fit.pivot[a] + fit.k * (v - fit.pivot[a]) + fit.shift[a]);
}

/**
 * The oldest Java model format that holds these cube rotations, and with it the
 * oldest Minecraft that shows the model as built. These are Blockbench's own
 * rules for the three rotation formats it writes:
 *   1.9.0   — one axis, a multiple of 22.5° within ±45°;
 *   1.21.6  — one axis, any angle within ±45°;
 *   1.21.11 — any rotation, on all three axes.
 * `counts` says how many cubes need each of them.
 */
const JAVA_ROTATION_FORMATS = ['1.9.0', '1.21.6', '1.21.11'];
function javaFormatFor(rotations) {
	const counts = [0, 0, 0];
	let need = 0;
	for (const r of rotations) {
		const turned = r.filter(v => Math.abs(v) > 1e-6);
		let level = 0;
		if (turned.length > 1 || turned.some(v => Math.abs(v) > 45 + 1e-6)) level = 2;
		else if (turned.length && Math.abs(turned[0] / 22.5 - Math.round(turned[0] / 22.5)) > 1e-4) level = 1;
		counts[level]++;
		need = Math.max(need, level);
	}
	return { version: JAVA_ROTATION_FORMATS[need], counts };
}

/** Dotted version comparison: '1.21.6' is below '1.21.11', and '26.3' above both. */
function versionBelow(a, b) {
	const pa = String(a).split('.').map(Number), pb = String(b).split('.').map(Number);
	for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
		const x = pa[i] || 0, y = pb[i] || 0;
		if (x !== y) return x < y;
	}
	return false;
}

// ------------------------------------------------------------ the outliner

/**
 * Names an exporter makes up rather than an author: Sketchfab's mesh holders
 * (`_gltfNode_2`), Blender's `Object_104`, the parser's own `node_7`, bare numbers.
 */
const GENERIC_NODE = /^(_?gltfnode_?\d*|object_?\d*|node_?\d*|mesh_?\d*|_?\d+)$/i;

/**
 * Which glTF nodes become folders, where each cube goes, and what things are called.
 *
 * Every glTF node used to become a folder, and a Sketchfab export nests them
 * deep: three wrapper nodes on top, then every cube inside a node of its own,
 * inside another node holding the mesh. On the local collection that was up to
 * 1691 folders for 704 cubes, and a cube 12 folders down on average.
 *
 * A folder goes when it has no animation and holds one thing or nothing: its
 * content moves up to its parent. The export wrapper goes whatever it holds.
 * That changes no shape: bones stand unrotated, so a folder nothing animates
 * moves nothing. Animated folders all stay, and with them the skeleton.
 *
 * A cube whose node went takes the innermost author's name on the way up — the
 * node Sketchfab named `cube_1`, not the `_gltfNode_2` holding its mesh.
 *
 * Sketchfab appends `_N` to every node name. When every name carries such a
 * number it is the exporter's, and one is stripped; a folder name that then
 * repeats gets a number back, because GeckoLib and Bedrock bones must differ.
 *
 * `cubeNodes` lists the node of every cube, and `taken` the names a folder may
 * not have; returns the kept folders with their parents and names, and for a
 * cube, its folder and name.
 */
function tidyHierarchy(hierarchy, cubeNodes, animated, taken) {
	const byIndex = new Map(hierarchy.map(h => [h.index, h]));
	const count = new Map(hierarchy.map(h => [h.index, 0]));
	for (const h of hierarchy) if (byIndex.has(h.parent)) count.set(h.parent, count.get(h.parent) + 1);
	for (const n of cubeNodes) if (count.has(n)) count.set(n, count.get(n) + 1);

	const removed = new Set();
	const liveParent = n => {
		let p = byIndex.get(n).parent;
		while (removed.has(p)) p = byIndex.get(p).parent;
		return byIndex.has(p) ? p : -1;
	};
	// Handing a single child up leaves the parent's count as it was; an empty
	// folder lowers it and a lifted wrapper raises it, hence the loop.
	for (let changed = true; changed;) {
		changed = false;
		for (const h of hierarchy) {
			const n = h.index;
			if (removed.has(n) || animated.has(n)) continue;
			const c = count.get(n);
			if (c > 1 && !h.wrapper) continue;
			const p = liveParent(n);
			removed.add(n);
			changed = true;
			if (p >= 0) count.set(p, count.get(p) - 1 + c);
		}
	}

	const authored = hierarchy.filter(h => !h.wrapper);
	const strip = authored.length > 0 && authored.every(h => /_\d+$/.test(h.name));
	const clean = name => (strip && name.replace(/_\d+$/, '')) || name;

	const parent = new Map();
	const name = new Map();
	// names already in the project the model is added to count as taken
	const used = new Set(taken || []);
	for (const h of hierarchy) {
		if (removed.has(h.index)) continue;
		parent.set(h.index, liveParent(h.index));
		const unique = uniqueName(clean(h.name), used);
		used.add(unique);
		name.set(h.index, unique);
	}

	return {
		kept: [...parent.keys()],
		parent,
		name,
		removed: removed.size,
		stripped: strip,
		/** The folder a cube of node `n` goes in, or -1 for the top level. */
		home: n => (!byIndex.has(n) ? -1 : removed.has(n) ? liveParent(n) : n),
		/** Any node's name as the user sees it: the folder's, or the cleaned one. */
		label: n => name.get(n) || (byIndex.has(n) ? clean(byIndex.get(n).name) : ''),
		/** A cube's name: the innermost author's name on its removed chain, or its own. */
		cubeName(n, own) {
			for (let c = n; byIndex.has(c) && removed.has(c); c = byIndex.get(c).parent) {
				const h = byIndex.get(c);
				if (!h.wrapper && !GENERIC_NODE.test(h.name)) return clean(h.name);
			}
			return clean(own);
		},
	};
}

/**
 * Whether a Sketchfab model looks built from cubes, from the two counts every
 * search result carries. Sketchfab counts vertex positions, so a separate cube
 * gives 8 of them to 12 triangles — exactly 2:3 — while shared corners, as on
 * any smooth or bevelled mesh, bring vertices below that.
 *
 * Measured on 144 models tagged `blockbench`, with every preview looked at:
 * all 24 looked at of the 84 at exactly 2:3 were cubes; below 0.6 (21 models)
 * most were cars with round wheels, bevelled houses and smooth figures. In
 * between it is mixed, so nothing is claimed there.
 *
 * Returns 'cubes', 'shapes' or null.
 */
function cubeHint(faceCount, vertexCount) {
	const f = Number(faceCount), v = Number(vertexCount);
	if (!(f > 0) || !(v > 0)) return null;
	if (3 * v === 2 * f) return 'cubes';
	return v / f < 0.6 ? 'shapes' : null;
}

// -------------------------------------------- adding to the open project

/** `base`, or `base_2`, `base_3`… — the first one not in `used`. */
function uniqueName(base, used) {
	let name = base;
	for (let k = 2; used.has(name); k++) name = `${base}_${k}`;
	return name;
}

/** A model's file name as a folder or animation name: `Iron Sword (1).zip` → `iron_sword_1`. */
function nameSlug(fileName) {
	return String(fileName || '').replace(/\.[^.]*$/, '').toLowerCase()
		.replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '') || 'model';
}

/**
 * Where the new texture goes on a project texture it has to share: beside it or
 * under it, whichever leaves the smaller sheet, and the squarer one on a tie.
 * The old texture stays in the corner, so every UV already made still reads the
 * same pixels. Sizes are in the project's UV units.
 */
function placeBeside(base, add) {
	const right = { x: base[0], y: 0, width: base[0] + add[0], height: Math.max(base[1], add[1]) };
	const below = { x: 0, y: base[1], width: Math.max(base[0], add[0]), height: base[1] + add[1] };
	const area = r => r.width * r.height;
	const long = r => Math.max(r.width, r.height) / Math.min(r.width, r.height);
	if (area(right) !== area(below)) return area(right) < area(below) ? right : below;
	return long(right) <= long(below) ? right : below;
}

/**
 * How a model's atlas joins a project and where its UV go there. `kind` is:
 *   fresh   nothing is in the project yet, or it is new: the project's UV size
 *           becomes the atlas's
 *   own     each texture has a UV size of its own (Generic): the atlas keeps its
 *           size and is added beside the textures already there
 *   shared every texture shares the project's UV size (Java): the atlas becomes a
 *           texture of its own and its UV are squeezed into that size, as
 *           Minecraft stretches every texture over it anyway
 *   beside  one texture per model (GeckoLib, Bedrock): the atlas is drawn beside
 *           the project's texture, which grows to hold both
 * `project` and `atlas` are [width, height]. The result gives the UV size the
 * parser scales to, where the atlas starts and how much it is scaled in UV
 * units, and the project's new UV size, or null to leave it.
 */
function texturePlan(kind, project, atlas) {
	if (kind === 'shared') {
		return { uvSize: project.slice(), offset: [0, 0], scale: [project[0] / atlas[0], project[1] / atlas[1]], projectSize: null };
	}
	if (kind === 'beside') {
		const spot = placeBeside(project, atlas);
		const size = [spot.width, spot.height];
		return { uvSize: size, offset: [spot.x, spot.y], scale: [1, 1], projectSize: size };
	}
	return { uvSize: atlas.slice(), offset: [0, 0], scale: [1, 1], projectSize: kind === 'fresh' ? atlas.slice() : null };
}

/** An atlas rectangle moved to where the plan puts the atlas. */
function placeRect(r, plan) {
	return r && {
		x: plan.offset[0] + r.x * plan.scale[0], y: plan.offset[1] + r.y * plan.scale[1],
		w: r.w * plan.scale[0], h: r.h * plan.scale[1],
	};
}

// ------------------------------------------------ rounded parts: the pieces

/**
 * Parts that are not boxes — bevels, wedges, anything rounded — used to become
 * their bounding box, and their shape was gone. Here such a part is rebuilt the
 * way its surface runs: each near-flat stretch of the surface becomes a flat
 * cube lying in its plane, and the stretch's outline is cut out of that cube by
 * the transparency of a texture baked for it. A cube can only be a rectangle;
 * the texture is what lets its outline run at a slant.
 *
 * Measured against the source, rendered from twelve sides: on the test models
 * plates got 3 to 30 times fewer pixels wrong than boxes did, and in a blind
 * comparison they won on every model. What they cost is cubes and texture —
 * several times more of both.
 *
 * Two ways, picked in the import dialog:
 *  - fast: plates alone. A slanted edge is drawn by whole texels, and at 1/8 px
 *    those show as fine steps up close;
 *  - best: a thin strip also lies along every slanted edge where the surface
 *    turns sharply or ends. The strip is turned to run along the edge, so the
 *    edge falls on the strip's own texel border and comes out straight. It takes
 *    1.5 to 2 times the cubes.
 *
 * All distances are model pixels.
 */
const ROUND = {
	// A part that one box follows this closely, both ways, stays one box: most
	// deformed cubes do, and a box is one cube where plates would be six.
	FIT_TOL: 0.1,
	// Triangles join a region while its corners stay this close to its plane and
	// each turns less than this from it. Bolder merging was measured to cost
	// quality; stricter merging leaves the plates too small to draw an edge.
	REGION_EPS: 0.15,
	REGION_ANGLE: 5,
	// The texel of the baked sheets: the finest whose total fits the budget, a
	// sheet of 2048². At 1 px the steps along a slanted edge are what one sees.
	TEXELS: [0.125, 0.25, 0.5, 1],
	TEXEL_BUDGET: 4e6,
	// A texel shows while its centre lies this close to the outline, in texels:
	// without it a thin sliver between texel centres would vanish.
	DILATE: 0.35,
	// Strips: their width in texels, the shortest edge worth one, and the turn of
	// the surface across the edge below which the step is not seen.
	STRIP_WIDTH: 1.5,
	STRIP_MIN: 1,
	CREASE: 30,
	// Each strip lies this much further out than the one before it on its plate,
	// so strips that cross at a corner do not flicker against each other.
	LIFT: 0.006,
	// A cube is kept when it covers this many pixels from at least one of the
	// directions it is looked at from, the model drawn this many pixels across.
	CULL_PIXELS: 4,
	CULL_SCALE: 840,
	// A texel read on a triangle's very edge is pulled this share towards its
	// middle: the edge of a triangle is the edge of its UV island, and rounding
	// there picks the neighbouring island's pixel.
	UV_INSET: 0.01,
};
const ROUND_MODES = ['fast', 'best'];

const pointKey = p => p[0].toFixed(4) + ',' + p[1].toFixed(4) + ',' + p[2].toFixed(4);
const edgeKey = (a, b) => (a < b ? a + '|' + b : b + '|' + a);

function uniquePoints(tris) {
	const seen = new Set(), pts = [];
	for (const t of tris) for (const q of t) {
		const k = pointKey(q);
		if (!seen.has(k)) { seen.add(k); pts.push(q); }
	}
	return pts;
}

/** 2D convex hull, monotone chain. */
function hull2d(pts) {
	const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
	const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
	const lo = [], hi = [];
	for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
	for (const q of p.slice().reverse()) { while (hi.length >= 2 && cr(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
	return lo.slice(0, -1).concat(hi.slice(0, -1));
}

/** The box along given axes that holds the points: { c, axes, half }. */
function boxAlong(axes, pts) {
	const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
	for (const p of pts) for (let a = 0; a < 3; a++) {
		const t = dot(p, axes[a]);
		if (t < lo[a]) lo[a] = t;
		if (t > hi[a]) hi[a] = t;
	}
	const mid = [0, 1, 2].map(a => (lo[a] + hi[a]) / 2);
	return {
		c: [0, 1, 2].map(i => axes[0][i] * mid[0] + axes[1][i] * mid[1] + axes[2][i] * mid[2]),
		axes, half: [0, 1, 2].map(a => (hi[a] - lo[a]) / 2),
	};
}
const boxVolume = b => 8 * b.half[0] * b.half[1] * b.half[2];

/**
 * The smallest box found among the directions the triangles face: for each
 * normal, the box whose side lies along each edge of the points' hull in that plane.
 */
function minVolumeBox(pts, tris) {
	const dirs = [];
	for (const [a, b, c] of tris) {
		const n = cross(sub(b, a), sub(c, a));
		if (len(n) < 1e-9) continue;
		const u = norm(n);
		if (!dirs.some(d => Math.abs(dot(d, u)) > 0.9999)) dirs.push(u);
	}
	let best = boxAlong([[1, 0, 0], [0, 1, 0], [0, 0, 1]], pts);
	for (const n of dirs) {
		const t = norm(Math.abs(n[0]) < 0.9 ? cross(n, [1, 0, 0]) : cross(n, [0, 1, 0]));
		const s = cross(n, t);
		const h = hull2d(pts.map(p => [dot(p, t), dot(p, s)]));
		for (let i = 0; i < h.length; i++) {
			const q = h[(i + 1) % h.length];
			const e = norm([q[0] - h[i][0], q[1] - h[i][1], 0]);
			const ax1 = norm([t[0] * e[0] + s[0] * e[1], t[1] * e[0] + s[1] * e[1], t[2] * e[0] + s[2] * e[1]]);
			const b = boxAlong([n, ax1, cross(n, ax1)], pts);
			if (boxVolume(b) < boxVolume(best)) best = b;
		}
	}
	return best;
}

/** The closest point of a triangle to a point, as barycentric weights (after Ericson). */
function closestOnTriangle(pt, t) {
	const [a, b, c] = t;
	const ab = sub(b, a), ac = sub(c, a), ap = sub(pt, a);
	const d1 = dot(ab, ap), d2 = dot(ac, ap);
	if (d1 <= 0 && d2 <= 0) return [1, 0, 0];
	const bp = sub(pt, b), d3 = dot(ab, bp), d4 = dot(ac, bp);
	if (d3 >= 0 && d4 <= d3) return [0, 1, 0];
	const vc = d1 * d4 - d3 * d2;
	if (vc <= 0 && d1 >= 0 && d3 <= 0) { const v = d1 / (d1 - d3); return [1 - v, v, 0]; }
	const cp = sub(pt, c), d5 = dot(ab, cp), d6 = dot(ac, cp);
	if (d6 >= 0 && d5 <= d6) return [0, 0, 1];
	const vb = d5 * d2 - d1 * d6;
	if (vb <= 0 && d2 >= 0 && d6 <= 0) { const w = d2 / (d2 - d6); return [1 - w, 0, w]; }
	const va = d3 * d6 - d5 * d4;
	if (va <= 0 && (d4 - d3) >= 0 && (d5 - d6) >= 0) { const w = (d4 - d3) / ((d4 - d3) + (d5 - d6)); return [0, 1 - w, w]; }
	const den = 1 / (va + vb + vc), v = vb * den, w = vc * den;
	return [1 - v - w, v, w];
}

/** Where a ray meets a triangle: distance along it and barycentric weights, or null. */
function rayTriangle(o, d, t) {
	const e1 = sub(t[1], t[0]), e2 = sub(t[2], t[0]);
	const h = cross(d, e2), det = dot(e1, h);
	if (Math.abs(det) < 1e-12) return null;
	const f = 1 / det, s = sub(o, t[0]), u = f * dot(s, h);
	if (u < -1e-6 || u > 1 + 1e-6) return null;
	const q = cross(s, e1), v = f * dot(d, q);
	if (v < -1e-6 || u + v > 1 + 1e-6) return null;
	return { dist: f * dot(e2, q), w: [1 - u - v, u, v] };
}

/**
 * Whether one box stands for the part within `tol` both ways: every corner of
 * the part near the box's surface, and every point of the box's surface, on a
 * grid of `step`, near the part's.
 */
function boxFitsPart(box, tris, tol, step) {
	const pts = uniquePoints(tris);
	const surfDist = p => {
		const d = sub(p, box.c);
		const l = box.axes.map(ax => dot(d, ax));
		const out = l.map((v, a) => Math.max(0, Math.abs(v) - box.half[a]));
		if (out.some(v => v > 0)) return len(out);
		return Math.min(...l.map((v, a) => box.half[a] - Math.abs(v)));
	};
	for (const p of pts) if (surfDist(p) > tol) return false;
	const triDist = p => {
		let best = Infinity;
		for (const t of tris) {
			const w = closestOnTriangle(p, t);
			const q = [0, 1, 2].map(k => w[0] * t[0][k] + w[1] * t[1][k] + w[2] * t[2][k]);
			best = Math.min(best, dist(q, p));
			if (best <= tol) return best;
		}
		return best;
	};
	for (let a = 0; a < 3; a++) for (const sgn of [-1, 1]) {
		const [p, q] = [0, 1, 2].filter(x => x !== a);
		const np = Math.max(1, Math.ceil(2 * box.half[p] / step)), nq = Math.max(1, Math.ceil(2 * box.half[q] / step));
		for (let i = 0; i <= np; i++) for (let j = 0; j <= nq; j++) {
			const l = [0, 0, 0];
			l[a] = sgn * box.half[a];
			l[p] = -box.half[p] + 2 * box.half[p] * i / np;
			l[q] = -box.half[q] + 2 * box.half[q] * j / nq;
			const P = [0, 1, 2].map(k => box.c[k] + l[0] * box.axes[0][k] + l[1] * box.axes[1][k] + l[2] * box.axes[2][k]);
			if (triDist(P) > tol) return false;
		}
	}
	return true;
}

/**
 * Triangles grown into near-flat regions, the largest first: a neighbour across
 * an edge joins while it turns less than `ang` degrees from the region and its
 * corners stay within `eps` of the region's plane.
 *
 * Hierarchical clustering (Garland, Willmott and Heckbert) was tried in its
 * place and drew worse edges.
 */
function flatRegions(tris, eps, ang) {
	const info = tris.map(t => {
		const n = cross(sub(t[1], t[0]), sub(t[2], t[0]));
		const l = len(n);
		if (l < 1e-10) return null;
		return { n: mul(n, 1 / l), a: l / 2, c: [0, 1, 2].map(k => (t[0][k] + t[1][k] + t[2][k]) / 3) };
	});
	const byEdge = new Map();
	tris.forEach((t, i) => {
		for (let k = 0; k < 3; k++) {
			const e = edgeKey(pointKey(t[k]), pointKey(t[(k + 1) % 3]));
			(byEdge.get(e) || byEdge.set(e, []).get(e)).push(i);
		}
	});
	const nbrs = tris.map(() => []);
	for (const list of byEdge.values()) for (const i of list) for (const j of list) if (i !== j) nbrs[i].push(j);
	const COS = Math.cos(ang * Math.PI / 180);
	const used = new Array(tris.length).fill(false);
	const order = tris.map((_, i) => i).filter(i => info[i]).sort((x, y) => info[y].a - info[x].a);
	const regions = [];
	for (const seed of order) {
		if (used[seed]) continue;
		used[seed] = true;
		const list = [seed], queue = [seed];
		let nSum = mul(info[seed].n, info[seed].a), cSum = mul(info[seed].c, info[seed].a), aSum = info[seed].a;
		while (queue.length) {
			const i = queue.pop();
			for (const j of nbrs[i]) {
				if (used[j] || !info[j]) continue;
				const nR = norm(nSum), cR = mul(cSum, 1 / aSum);
				if (dot(info[j].n, nR) < COS) continue;
				if (tris[j].some(v => Math.abs(dot(sub(v, cR), nR)) > eps)) continue;
				used[j] = true; list.push(j); queue.push(j);
				nSum = add(nSum, mul(info[j].n, info[j].a)); cSum = add(cSum, mul(info[j].c, info[j].a)); aSum += info[j].a;
			}
		}
		regions.push({ tris: list.map(i => tris[i]), n: norm(nSum) });
	}
	return regions;
}

/**
 * Whether the surface turns sharply across an edge: the triangle on the far side
 * turns at least `deg` from the one holding corner C, or there is none at all.
 */
function creaseTest(tris, deg) {
	const byEdge = new Map();
	for (const t of tris) for (let k = 0; k < 3; k++) {
		const e = edgeKey(pointKey(t[k]), pointKey(t[(k + 1) % 3]));
		(byEdge.get(e) || byEdge.set(e, []).get(e)).push(t);
	}
	const nrm = t => norm(cross(sub(t[1], t[0]), sub(t[2], t[0])));
	const COS = Math.cos(deg * Math.PI / 180);
	return (A, B, C) => {
		const list = byEdge.get(edgeKey(pointKey(A), pointKey(B))) || [];
		const c = pointKey(C);
		const own = list.find(t => t.some(q => pointKey(q) === c));
		const other = list.filter(t => t !== own);
		if (!own || !other.length) return true;
		return other.some(t => Math.abs(dot(nrm(own), nrm(t))) < COS);
	};
}

function inTri2(x, y, tr) {
	const [A, B, C] = tr;
	const s1 = (B[0] - A[0]) * (y - A[1]) - (B[1] - A[1]) * (x - A[0]);
	const s2 = (C[0] - B[0]) * (y - B[1]) - (C[1] - B[1]) * (x - B[0]);
	const s3 = (A[0] - C[0]) * (y - C[1]) - (A[1] - C[1]) * (x - C[0]);
	return (s1 >= 0 && s2 >= 0 && s3 >= 0) || (s1 <= 0 && s2 <= 0 && s3 <= 0);
}
function segDist2(x, y, A, B) {
	const dx = B[0] - A[0], dy = B[1] - A[1], l2 = dx * dx + dy * dy;
	const k = l2 ? Math.max(0, Math.min(1, ((x - A[0]) * dx + (y - A[1]) * dy) / l2)) : 0;
	return Math.hypot(x - A[0] - k * dx, y - A[1] - k * dy);
}

/**
 * The triangles of a region laid flat, with a grid over them so that finding the
 * one under a point does not mean testing them all: a region can hold hundreds,
 * and a sheet at 1/8 px a hundred thousand texels.
 */
function flatLocator(polys) {
	let lo = [Infinity, Infinity], hi = [-Infinity, -Infinity];
	for (const tr of polys) for (const q of tr) for (let a = 0; a < 2; a++) {
		if (q[a] < lo[a]) lo[a] = q[a];
		if (q[a] > hi[a]) hi[a] = q[a];
	}
	const span = Math.max(hi[0] - lo[0], hi[1] - lo[1], 1e-6);
	const cell = Math.max(span / 128, 0.25);
	const nx = Math.max(1, Math.ceil((hi[0] - lo[0]) / cell) + 1), ny = Math.max(1, Math.ceil((hi[1] - lo[1]) / cell) + 1);
	const cells = new Map();
	polys.forEach((tr, i) => {
		const x0 = Math.floor((Math.min(tr[0][0], tr[1][0], tr[2][0]) - lo[0]) / cell), x1 = Math.floor((Math.max(tr[0][0], tr[1][0], tr[2][0]) - lo[0]) / cell);
		const y0 = Math.floor((Math.min(tr[0][1], tr[1][1], tr[2][1]) - lo[1]) / cell), y1 = Math.floor((Math.max(tr[0][1], tr[1][1], tr[2][1]) - lo[1]) / cell);
		for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
			const k = y * nx + x;
			(cells.get(k) || cells.set(k, []).get(k)).push(i);
		}
	});
	const inside = (x, y) => {
		const cx = Math.floor((x - lo[0]) / cell), cy = Math.floor((y - lo[1]) / cell);
		if (cx < 0 || cy < 0 || cx >= nx || cy >= ny) return -1;
		for (const i of cells.get(cy * nx + cx) || []) if (inTri2(x, y, polys[i])) return i;
		return -1;
	};
	return { inside, count: polys.length, nx, ny };
}

/**
 * A flat cube in the plane of a region, and the grid of texels on it.
 *
 * Of the ways the plate can be turned in its plane, the one that lays the most
 * outline length along the texel grid wins: an edge along the grid is drawn
 * straight, while a slanted one is drawn in steps. The smallest sheet only breaks ties.
 */
function plateFor(group, texel) {
	const n = group.n;
	const pts = uniquePoints(group.tris);
	const t = norm(Math.abs(n[0]) < 0.9 ? cross(n, [1, 0, 0]) : cross(n, [0, 1, 0]));
	const s = cross(n, t);
	const h = hull2d(pts.map(p => [dot(p, t), dot(p, s)]));
	const count = new Map();
	for (const tr of group.tris) for (let k = 0; k < 3; k++) {
		const e = edgeKey(pointKey(tr[k]), pointKey(tr[(k + 1) % 3]));
		const entry = count.get(e) || { n: 0, A: tr[k], B: tr[(k + 1) % 3], C: tr[(k + 2) % 3] };
		entry.n++;
		count.set(e, entry);
	}
	const outline = [];
	for (const e of count.values()) if (e.n === 1) {
		const d = [dot(sub(e.B, e.A), t), dot(sub(e.B, e.A), s)];
		const l = Math.hypot(d[0], d[1]);
		if (l > 1e-6) outline.push({ phi: Math.atan2(d[1], d[0]), len: l });
	}
	const Q = Math.PI / 2, TOL = 0.5 * Math.PI / 180;
	const alignedLen = phi => outline.reduce((sum, e) => {
		const dd = (((e.phi - phi) % Q) + Q) % Q;
		return sum + (Math.min(dd, Q - dd) < TOL ? e.len : 0);
	}, 0);
	const dirs = [];
	for (let i = 0; i < Math.max(1, h.length); i++) {
		const q = h[(i + 1) % h.length] || [1, 0], o = h[i] || [0, 0];
		dirs.push(Math.atan2(q[1] - o[1], q[0] - o[0]));
	}
	for (const e of outline) dirs.push(e.phi);
	let best = null, bestAligned = -1;
	for (const phi of dirs) {
		const a1 = norm(add(mul(t, Math.cos(phi)), mul(s, Math.sin(phi))));
		const b = boxAlong([n, a1, cross(n, a1)], pts);
		const al = alignedLen(phi);
		const area = b.half[1] * b.half[2];
		if (!best || al > bestAligned + 1e-6 || (Math.abs(al - bestAligned) <= 1e-6 && area < best.half[1] * best.half[2])) {
			best = b;
			bestAligned = al;
		}
	}
	best.half[0] = 0;
	const [, a1, a2] = best.axes;
	const corner = sub(sub(best.c, mul(a1, best.half[1])), mul(a2, best.half[2]));
	const to2 = p => { const d = sub(p, corner); return [dot(d, a1), dot(d, a2)]; };
	const polys = group.tris.map(tr => tr.map(to2));
	return {
		kind: 'plate', group, texel, box: best, corner, a1, a2, to2, polys, edges: count,
		cols: Math.ceil(2 * best.half[1] / texel), rows: Math.ceil(2 * best.half[2] / texel),
		// a texel's centre, in the model
		at: (i, j) => add(add(corner, mul(a1, (i + 0.5) * texel)), mul(a2, (j + 0.5) * texel)),
	};
}

/**
 * The plate's texels that show: a texel shows when its centre lies within the
 * outline, or within DILATE texels of it. Worked out triangle by triangle over
 * the texels each one reaches, rather than every triangle for every texel.
 */
function plateMask(plate) {
	const { cols, rows, texel: T, polys } = plate;
	const dil = ROUND.DILATE * T;
	const m = new Uint8Array(cols * rows);
	for (const tr of polys) {
		const xs = [tr[0][0], tr[1][0], tr[2][0]], ys = [tr[0][1], tr[1][1], tr[2][1]];
		const i0 = Math.max(0, Math.floor((Math.min(...xs) - dil) / T - 0.5)), i1 = Math.min(cols - 1, Math.ceil((Math.max(...xs) + dil) / T - 0.5));
		const j0 = Math.max(0, Math.floor((Math.min(...ys) - dil) / T - 0.5)), j1 = Math.min(rows - 1, Math.ceil((Math.max(...ys) + dil) / T - 0.5));
		for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
			const k = j * cols + i;
			if (m[k]) continue;
			const u = (i + 0.5) * T, v = (j + 0.5) * T;
			if (inTri2(u, v, tr)
				|| (dil > 0 && (segDist2(u, v, tr[0], tr[1]) <= dil || segDist2(u, v, tr[1], tr[2]) <= dil || segDist2(u, v, tr[2], tr[0]) <= dil))) m[k] = 1;
		}
	}
	return m;
}

/**
 * The strips of a plate: one along each slanted edge at least STRIP_MIN long
 * where the surface turns at least CREASE degrees, or ends.
 *
 * Near those edges the plate keeps only the texels lying wholly inside its
 * outline, so nothing pokes out there, and the notches that leaves are filled by
 * the strip. The strip stands on the file's own edge, not on the flattened
 * plate's: the strips of two faces meeting there share one line, and no hairline
 * opens between them.
 */
function stripsFor(plate, sharp) {
	const T = plate.texel, W = ROUND.STRIP_WIDTH * T;
	const loc = plate.locator || (plate.locator = flatLocator(plate.polys));
	const inside = (x, y) => loc.inside(x, y) >= 0;
	const edges = [];
	for (const e of plate.edges.values()) {
		if (e.n !== 1) continue;
		const A = plate.to2(e.A), B = plate.to2(e.B), C = plate.to2(e.C);
		const l = Math.hypot(B[0] - A[0], B[1] - A[1]);
		if (l < 1e-6) continue;
		const d = [(B[0] - A[0]) / l, (B[1] - A[1]) / l];
		const phi = ((Math.atan2(d[1], d[0]) % (Math.PI / 2)) + Math.PI / 2) % (Math.PI / 2);
		const slanted = Math.min(phi, Math.PI / 2 - phi) > 0.5 * Math.PI / 180;
		let m = [-d[1], d[0]];
		if ((C[0] - A[0]) * m[0] + (C[1] - A[1]) * m[1] < 0) m = [-m[0], -m[1]];
		edges.push({ A, B, m, A3: e.A, B3: e.B, strip: slanted && l >= ROUND.STRIP_MIN && sharp(e.A, e.B, e.C) });
	}
	plate.stripEdges = edges;
	const out = [];
	for (const e of edges) {
		if (!e.strip) continue;
		const len3 = dist(e.B3, e.A3);
		const e1 = norm(sub(e.B3, e.A3));
		const m3 = add(mul(plate.a1, e.m[0]), mul(plate.a2, e.m[1]));
		const e2 = norm(sub(m3, mul(e1, dot(m3, e1))));
		const ns = norm(cross(e1, e2));
		const A3 = e.A3;
		out.push({
			kind: 'strip', owner: plate, step: out.length + 1, group: plate.group, texel: T,
			box: { c: add(add(A3, mul(e1, len3 / 2)), mul(e2, W / 2)), axes: [ns, e1, e2], half: [0, len3 / 2, W / 2] },
			corner: A3, a1: e1, a2: e2,
			cols: Math.ceil(len3 / T), rows: Math.ceil(W / T),
			at: (i, j) => add(add(A3, mul(e1, (i + 0.5) * T)), mul(e2, Math.max((j + 0.5) * T, 1e-4))),
			// the whole texel inside the outline, a hair shrunk so the row on the edge
			// itself counts; corners past the edge are tested on the edge
			shows: (i, j) => {
				const u = (i + 0.5) * T, v = (j + 0.5) * T, h = T / 2 - 1e-4;
				for (const [du, dv] of [[-h, -h], [h, -h], [h, h], [-h, h]]) {
					const X = plate.to2(add(add(A3, mul(e1, u + du)), mul(e2, Math.max(v + dv, 1e-4))));
					if (!inside(X[0], X[1])) return false;
				}
				return true;
			},
		});
	}
	return out;
}

/** The plate's mask once strips take its slanted edges: whole texels only, near them. */
function plateMaskBesideStrips(plate, mask) {
	const edges = plate.stripEdges || [];
	if (!edges.some(e => e.strip)) return mask;
	const { cols, rows, texel: T } = plate;
	const loc = plate.locator || (plate.locator = flatLocator(plate.polys));
	const inside = (x, y) => loc.inside(x, y) >= 0;
	const h = T / 2 - 1e-6;
	const done = new Uint8Array(cols * rows);
	for (const s of edges) {
		if (!s.strip) continue;
		const i0 = Math.max(0, Math.floor((Math.min(s.A[0], s.B[0]) - 2 * T) / T)), i1 = Math.min(cols - 1, Math.ceil((Math.max(s.A[0], s.B[0]) + 2 * T) / T));
		const j0 = Math.max(0, Math.floor((Math.min(s.A[1], s.B[1]) - 2 * T) / T)), j1 = Math.min(rows - 1, Math.ceil((Math.max(s.A[1], s.B[1]) + 2 * T) / T));
		for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
			const k = j * cols + i;
			if (done[k]) continue;
			const u = (i + 0.5) * T, v = (j + 0.5) * T;
			// the nearest edge of all decides, strip or not
			let best = Infinity, near = null;
			for (const e of edges) { const dd = segDist2(u, v, e.A, e.B); if (dd < best) { best = dd; near = e; } }
			if (!near || !near.strip || best >= 2 * T) continue;
			done[k] = 1;
			mask[k] = inside(u - h, v - h) && inside(u + h, v - h) && inside(u + h, v + h) && inside(u - h, v + h) ? 1 : 0;
		}
	}
	return mask;
}

/**
 * The shape of one part that is not a box, whatever the texel: one box where one
 * follows it within FIT_TOL, and otherwise its near-flat regions. Worked out once,
 * while the texel is tried finest first.
 */
function shapePart(tris) {
	const pts = uniquePoints(tris);
	if (pts.length >= 4) {
		const box = minVolumeBox(pts, tris);
		if (boxFitsPart(box, tris, ROUND.FIT_TOL, Math.min(0.5, ROUND.FIT_TOL))) return { box };
	}
	return { tris, regions: flatRegions(tris, ROUND.REGION_EPS, ROUND.REGION_ANGLE) };
}

/** The cubes of a shaped part at one texel: the box, or a plate per region with its strips when asked for. */
function piecesAt(shape, texel, strips) {
	if (shape.box) return [{ kind: 'box', box: shape.box, texel }];
	const sharp = strips ? (shape.sharp || (shape.sharp = creaseTest(shape.tris, ROUND.CREASE))) : null;
	const out = [];
	for (const g of shape.regions) {
		const plate = plateFor(g, texel);
		out.push(plate);
		if (sharp) out.push(...stripsFor(plate, sharp));
	}
	return out;
}

function piecesForPart(tris, texel, strips) {
	return piecesAt(shapePart(tris), texel, strips);
}

/**
 * Texels a piece bakes, for the budget. A whole box counts its six faces too: a
 * skewed slab kept as one box would otherwise bake at 1/8 px past any budget.
 */
function pieceTexels(pc) {
	if (pc.kind !== 'box') return pc.cols * pc.rows;
	const h = pc.box.half, T = pc.texel;
	const side = (p, q) => Math.ceil(2 * h[p] / T - 1e-9) * Math.ceil(2 * h[q] / T - 1e-9);
	return 2 * (side(1, 2) + side(0, 2) + side(0, 1));
}

// ------------------------------------------------- rounded parts: the texture

/**
 * A PNG's pixels, without a canvas: the Node tools have none, and in Blockbench
 * a canvas may alter colours through colour management. Palette images down to
 * one bit a pixel are read too — test models carry them. Throws on anything
 * else, and the caller then asks the canvas.
 */
function decodePNG(bytes) {
	const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	if (bytes.length < 8 || dv.getUint32(0) !== 0x89504E47) throw new Error('not a PNG');
	let pos = 8, w = 0, h = 0, type = 0, depth = 0, interlace = 0, palette = null, trns = null;
	const idat = [];
	while (pos + 8 <= bytes.length) {
		const n = dv.getUint32(pos);
		const t = String.fromCharCode(bytes[pos + 4], bytes[pos + 5], bytes[pos + 6], bytes[pos + 7]);
		if (pos + 12 + n > bytes.length) throw new ImportLimitError('truncated PNG chunk');
		const d = bytes.subarray(pos + 8, pos + 8 + n);
		if (t === 'IHDR') {
			if (pos !== 8 || n !== 13) throw new ImportLimitError('invalid or duplicate PNG header');
			w = dv.getUint32(pos + 8); h = dv.getUint32(pos + 12);
			checkImageDimensions(w, h);
			depth = d[8]; type = d[9]; interlace = d[12];
		}
		else if (t === 'PLTE') palette = d;
		else if (t === 'tRNS') trns = d;
		else if (t === 'IDAT') idat.push(d);
		else if (t === 'IEND') break;
		pos += 12 + n;
	}
	checkImageDimensions(w, h);
	const ch = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[type];
	if (!ch || interlace || ![1, 2, 4, 8].includes(depth) || (depth < 8 && ch !== 1)) {
		throw new Error(`PNG kind not read here (type ${type}, depth ${depth}${interlace ? ', interlaced' : ''})`);
	}
	let total = 0;
	for (const d of idat) total += d.length;
	const z = new Uint8Array(total);
	let o = 0;
	for (const d of idat) { z.set(d, o); o += d.length; }
	const stride = Math.ceil(w * ch * depth / 8), bpp = Math.max(1, ch * depth / 8);
	// a zlib stream: two bytes of header before the deflate data
	const raw = inflateRaw(z.subarray(2), (stride + 1) * h);
	if (raw.length !== (stride + 1) * h) throw new ImportLimitError('incomplete PNG scanlines');
	const out = new Uint8ClampedArray(w * h * 4);
	const packed = (line, x) => (line[(x * depth) >> 3] >> (8 - depth - ((x * depth) & 7))) & ((1 << depth) - 1);
	let prev = new Uint8Array(stride);
	for (let y = 0; y < h; y++) {
		const f = raw[y * (stride + 1)];
		const line = Uint8Array.from(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)));
		for (let x = 0; x < stride; x++) {
			const a = x >= bpp ? line[x - bpp] : 0, b = prev[x], c = x >= bpp ? prev[x - bpp] : 0;
			let v = line[x];
			if (f === 1) v += a;
			else if (f === 2) v += b;
			else if (f === 3) v += (a + b) >> 1;
			else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
			line[x] = v & 255;
		}
		for (let x = 0; x < w; x++) {
			let r, g, bl, al = 255;
			if (type === 2) { r = line[x * 3]; g = line[x * 3 + 1]; bl = line[x * 3 + 2]; }
			else if (type === 6) { r = line[x * 4]; g = line[x * 4 + 1]; bl = line[x * 4 + 2]; al = line[x * 4 + 3]; }
			else if (type === 0) { r = g = bl = depth === 8 ? line[x] : Math.round(packed(line, x) * 255 / ((1 << depth) - 1)); }
			else if (type === 4) { r = g = bl = line[x * 2]; al = line[x * 2 + 1]; }
			else {
				const i = depth === 8 ? line[x] : packed(line, x);
				if (!palette || i * 3 + 2 >= palette.length) throw new Error('PNG palette index out of range');
				r = palette[i * 3]; g = palette[i * 3 + 1]; bl = palette[i * 3 + 2];
				if (trns && i < trns.length) al = trns[i];
			}
			const k = (y * w + x) * 4;
			out[k] = r; out[k + 1] = g; out[k + 2] = bl; out[k + 3] = al;
		}
		prev = line;
	}
	return { w, h, data: out };
}

/** The nearest pixel of a picture, the UV wrapping like a repeating sampler. */
function samplePicture(pic, uv) {
	if (!pic) return null;
	const u = uv[0] - Math.floor(uv[0]), v = uv[1] - Math.floor(uv[1]);
	const x = Math.min(pic.w - 1, Math.floor(u * pic.w)), y = Math.min(pic.h - 1, Math.floor(v * pic.h));
	const o = (y * pic.w + x) * 4;
	return [pic.data[o], pic.data[o + 1], pic.data[o + 2], pic.data[o + 3]];
}

/** A face's UV at barycentric weights, pulled UV_INSET towards the middle. */
function faceUVAt(face, w) {
	const k = ROUND.UV_INSET;
	const v = w.map(x => x * (1 - k) + k / 3);
	return [0, 1].map(j => v[0] * face.uvs[0][j] + v[1] * face.uvs[1][j] + v[2] * face.uvs[2][j]);
}

const hasUV = f => !!f && !!f.uvs && f.uvs.length === 3 && f.uvs.every(Boolean);

/**
 * The colour of each texel of a plate or strip: the source point right under
 * its centre, found among the region's own triangles and read through their UV.
 * A texel beyond the outline — the dilated rim — takes the nearest triangle's.
 */
function regionPainter(plate, faceOf, pictureOf) {
	if (plate.painter) return plate.painter;
	const loc = plate.locator || (plate.locator = flatLocator(plate.polys));
	const faces = plate.group.tris.map(t => faceOf.get(t));
	plate.painter = P => {
		const X = plate.to2(P);
		let i = loc.inside(X[0], X[1]);
		let w;
		if (i >= 0 && hasUV(faces[i])) {
			const [A, B, C] = plate.polys[i];
			const den = (B[1] - C[1]) * (A[0] - C[0]) + (C[0] - B[0]) * (A[1] - C[1]);
			if (Math.abs(den) < 1e-14) i = -1;
			else {
				const w0 = ((B[1] - C[1]) * (X[0] - C[0]) + (C[0] - B[0]) * (X[1] - C[1])) / den;
				const w1 = ((C[1] - A[1]) * (X[0] - C[0]) + (A[0] - C[0]) * (X[1] - C[1])) / den;
				w = [w0, w1, 1 - w0 - w1];
			}
		} else i = -1;
		if (i < 0) {
			let bestD = Infinity;
			plate.polys.forEach((tr, k) => {
				if (!hasUV(faces[k])) return;
				const ww = closestOnTriangle([X[0], X[1], 0], tr.map(q => [q[0], q[1], 0]));
				const qx = ww[0] * tr[0][0] + ww[1] * tr[1][0] + ww[2] * tr[2][0], qy = ww[0] * tr[0][1] + ww[1] * tr[1][1] + ww[2] * tr[2][1];
				const dd = Math.hypot(qx - X[0], qy - X[1]);
				if (dd < bestD) { bestD = dd; i = k; w = ww; }
			});
		}
		if (i < 0) return null;
		return samplePicture(pictureOf(faces[i]), faceUVAt(faces[i], w));
	};
	return plate.painter;
}

/** The colour of a point on a whole box's face: a ray along the face's normal, both ways, onto the part. */
function boxPainter(faces, pictureOf) {
	const tris = faces.filter(hasUV);
	return (C, n) => {
		let hit = null, hd = Infinity;
		for (const f of tris) for (const dir of [n, mul(n, -1)]) {
			const h = rayTriangle(C, dir, f.positions);
			if (h && h.dist >= -1e-6 && h.dist < hd) { hd = h.dist; hit = { f, w: h.w }; }
		}
		if (!hit) for (const f of tris) {
			const w = closestOnTriangle(C, f.positions);
			const q = [0, 1, 2].map(k => w[0] * f.positions[0][k] + w[1] * f.positions[1][k] + w[2] * f.positions[2][k]);
			const dd = dist(q, C);
			if (dd < hd) { hd = dd; hit = { f, w }; }
		}
		return hit ? samplePicture(pictureOf(hit.f), faceUVAt(hit.f, hit.w)) : null;
	};
}

/**
 * The sheets a piece wears: one for a plate or strip, shared by its two sides;
 * one per face for a whole box. Each is { cols, rows, data } in RGBA, with a
 * texel either shown or clear — Minecraft cuts at an alpha, it does not blend.
 * A sheet with nothing shown is null.
 */
function bakePiece(pc, faceOf, pictureOf, partFaces) {
	const put = (sheet, k, col) => {
		if (!col || col[3] < 128) return false;
		sheet.data[k * 4] = col[0]; sheet.data[k * 4 + 1] = col[1]; sheet.data[k * 4 + 2] = col[2]; sheet.data[k * 4 + 3] = 255;
		return true;
	};
	if (pc.kind === 'plate' || pc.kind === 'strip') {
		const { cols, rows } = pc;
		if (!cols || !rows) return null;
		const plate = pc.kind === 'plate' ? pc : pc.owner;
		const paint = regionPainter(plate, faceOf, pictureOf);
		const sheet = { cols, rows, data: new Uint8ClampedArray(cols * rows * 4) };
		let any = false;
		if (pc.kind === 'plate') {
			const mask = plateMaskBesideStrips(pc, plateMask(pc));
			for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
				const k = j * cols + i;
				if (mask[k] && put(sheet, k, paint(pc.at(i, j)))) any = true;
			}
		} else {
			for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
				if (pc.shows(i, j) && put(sheet, j * cols + i, paint(pc.at(i, j)))) any = true;
			}
		}
		return any ? [sheet] : null;
	}
	// a whole box: six faces, [axis, side], each with its own sheet
	const paint = boxPainter(partFaces, pictureOf);
	const T = pc.texel, b = pc.box;
	const sheets = [];
	let any = false;
	for (const [a, sg] of BOX_SIDES) {
		const [p, q] = [0, 1, 2].filter(x => x !== a);
		const cols = Math.ceil(2 * b.half[p] / T - 1e-9), rows = Math.ceil(2 * b.half[q] / T - 1e-9);
		if (!cols || !rows || b.half[p] < 1e-6 || b.half[q] < 1e-6) { sheets.push(null); continue; }
		const sheet = { cols, rows, data: new Uint8ClampedArray(cols * rows * 4) };
		const n = mul(b.axes[a], sg);
		let shown = false;
		for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
			const C = add(add(add(b.c, mul(b.axes[a], sg * b.half[a])),
				mul(b.axes[p], -b.half[p] + (i + 0.5) * T)), mul(b.axes[q], -b.half[q] + (j + 0.5) * T));
			if (put(sheet, j * cols + i, paint(C, n))) shown = true;
		}
		sheets.push(shown ? sheet : null);
		if (shown) any = true;
	}
	return any ? sheets : null;
}
// the sides of a box in a fixed order: [axis, sign]
const BOX_SIDES = [[0, -1], [0, 1], [1, -1], [1, 1], [2, -1], [2, 1]];

// ---------------------------------------- rounded parts: what cannot be seen

/**
 * The faces of a piece as the cull pass draws them: four corners each, and for
 * a sheet the texel coordinates at those corners, so a clear texel draws nothing.
 * `lift` moves a plate or strip along its normal; `grow` inflates a box.
 */
function pieceQuads(pc, grow, lift) {
	const b = pc.box;
	const out = [];
	const corner = (c, s) => [0, 1, 2].map(k => c[k] + s[0] * b.axes[0][k] + s[1] * b.axes[1][k] + s[2] * b.axes[2][k]);
	if (pc.kind === 'plate' || pc.kind === 'strip') {
		const sheet = pc.sheets && pc.sheets[0];
		if (!sheet) return out;
		const T = pc.texel, g = grow || 0;
		const base = add(pc.corner, mul(b.axes[0], lift || 0));
		const W = 2 * b.half[1], H = 2 * b.half[2];
		for (const sg of [-1, 1]) {
			const c = add(base, mul(b.axes[0], sg * g));
			const P = [[-g, -g], [W + g, -g], [W + g, H + g], [-g, H + g]].map(([s, t]) => add(add(c, mul(b.axes[1], s)), mul(b.axes[2], t)));
			out.push({ P, st: [[-g / T, -g / T], [(W + g) / T, -g / T], [(W + g) / T, (H + g) / T], [-g / T, (H + g) / T]], sheet, n: mul(b.axes[0], sg), closed: true });
		}
		return out;
	}
	const half = b.half.map(h => h + (grow || 0));
	BOX_SIDES.forEach(([a, sg], f) => {
		if (pc.skip && pc.skip[f]) return;
		const [p, q] = [0, 1, 2].filter(x => x !== a);
		const s = (u, v) => { const l = [0, 0, 0]; l[a] = sg * half[a]; l[p] = u * half[p]; l[q] = v * half[q]; return l; };
		const P = [s(-1, -1), s(1, -1), s(1, 1), s(-1, 1)].map(l => corner(b.c, l));
		const sheet = pc.sheets ? pc.sheets[f] : null;
		if (pc.sheets && !sheet) return;
		const T = pc.texel || 1;
		const st = sheet ? [[0, 0], [2 * half[p] / T, 0], [2 * half[p] / T, 2 * half[q] / T], [0, 2 * half[q] / T]] : null;
		// a box with a side missing shows its inside through the gap
		const closed = pc.sheets ? pc.sheets.every(Boolean) : !(pc.skip && pc.skip.some(Boolean));
		out.push({ P, st, sheet, n: mul(b.axes[a], sg), closed });
	});
	return out;
}

/**
 * The file's own triangles as the cull pass draws them, each texel of their
 * picture hiding what is behind only where it shows. A Minecraft figure wears an
 * outer layer that is see-through wherever it is unused, and counted as solid it
 * would hide the body under it, holes and all.
 */
function sourceQuads(faces, pictureOf) {
	const out = [];
	for (const f of faces) {
		const pic = hasUV(f) ? pictureOf(f) : null;
		const sheet = pic ? { cols: pic.w, rows: pic.h, data: pic.data, wrap: true } : null;
		const n = norm(cross(sub(f.positions[1], f.positions[0]), sub(f.positions[2], f.positions[0])));
		out.push({
			P: f.positions, n, closed: false, sheet,
			st: sheet ? f.uvs.map(uv => [uv[0] * pic.w, uv[1] * pic.h]) : null,
		});
	}
	return out;
}

/** The directions the cull pass looks from: every 22.5° around at seven heights, and straight up and down. */
function cullDirections() {
	const dirs = [];
	for (const pitch of [-67.5, -45, -22.5, 0, 22.5, 45, 67.5]) for (let yaw = 0; yaw < 360; yaw += 22.5) dirs.push([yaw, pitch]);
	dirs.push([0, 89.9], [0, -89.9]);
	return dirs;
}

/**
 * How many pixels each item covers at most, over the directions. Items are
 * { quads, rigid, cullable }: only items that move together hide one another, so each
 * rigid set is drawn on its own — a cube behind an arm at rest may be in plain
 * sight once the arm moves. 26 directions were too few: a cliff seen only from
 * below slipped between them.
 *
 * `tick` is called between drawings and may return a promise, which is awaited:
 * that is how the work gives way to the interface.
 */
async function coverage(items, bounds, tick) {
	const ext = Math.max(bounds.hi[0] - bounds.lo[0], bounds.hi[1] - bounds.lo[1], bounds.hi[2] - bounds.lo[2]) || 1;
	const S = ROUND.CULL_SCALE / ext, M = 4;
	const best = new Int32Array(items.length), count = new Int32Array(items.length);
	let zbuf = new Float32Array(0), ibuf = new Int32Array(0);
	const sets = new Map();
	items.forEach((it, k) => { (sets.get(it.rigid) || sets.set(it.rigid, []).get(it.rigid)).push(k); });
	const dirs = cullDirections();
	for (let di = 0; di < dirs.length; di++) {
		const yaw = dirs[di][0] * Math.PI / 180, pitch = dirs[di][1] * Math.PI / 180;
		const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
		// the view: x across, y up, z away from the viewer
		const view = v => {
			const x1 = v[0] * cy - v[2] * sy, z1 = v[0] * sy + v[2] * cy;
			return [x1, v[1] * cp - z1 * sp, v[1] * sp + z1 * cp];
		};
		for (const list of sets.values()) {
			// a set with nothing that may go need not be drawn at all
			if (!list.some(k => items[k].cullable)) continue;
			const pl = [Infinity, Infinity], ph = [-Infinity, -Infinity];
			const proj = list.map(k => items[k].quads.map(q => q.P.map(view)));
			for (const qs of proj) for (const q of qs) for (const w of q) for (let a = 0; a < 2; a++) {
				if (w[a] < pl[a]) pl[a] = w[a];
				if (w[a] > ph[a]) ph[a] = w[a];
			}
			if (!isFinite(pl[0])) continue;
			const W = Math.ceil((ph[0] - pl[0]) * S + 2 * M), H = Math.ceil((ph[1] - pl[1]) * S + 2 * M);
			if (W * H > zbuf.length) { zbuf = new Float32Array(W * H); ibuf = new Int32Array(W * H); }
			const zb = zbuf.subarray(0, W * H).fill(Infinity), id = ibuf.subarray(0, W * H).fill(-1);
			list.forEach((k, li) => {
				items[k].quads.forEach((q, qi) => {
					// a closed box's far side is always behind its near one
					if (q.closed && view(q.n)[2] > 1e-9) return;
					const s = proj[li][qi].map(w => [(w[0] - pl[0]) * S + M, H - ((w[1] - pl[1]) * S + M), w[2]]);
					for (let t = 1; t + 1 < s.length; t++) drawTriangle(s[0], s[t], s[t + 1], q.st && [q.st[0], q.st[t], q.st[t + 1]], q.sheet, k, W, H, zb, id);
				});
			});
			count.fill(0);
			for (let i = 0; i < id.length; i++) if (id[i] >= 0) count[id[i]]++;
			for (const k of list) if (count[k] > best[k]) best[k] = count[k];
		}
		if (tick) await tick((di + 1) / dirs.length);
	}
	return best;
}

/**
 * One triangle into the depth and id buffers, a pixel taken when its centre is
 * inside. The weights are linear across the screen, so they, the depth and the
 * texel are stepped along a row rather than worked out again for every pixel,
 * and each row starts and ends where the triangle does.
 */
function drawTriangle(a, b, c, st, sheet, k, W, H, zb, id) {
	const area = (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
	if (Math.abs(area) < 1e-9) return;
	const inv = 1 / area;
	// w0 = e0x·x + e0y·y + e0c at a pixel centre (x, y); likewise w1; w2 = 1 - w0 - w1
	const e0x = (b[1] - c[1]) * inv, e0y = (c[0] - b[0]) * inv, e0c = (b[0] * c[1] - c[0] * b[1]) * inv;
	const e1x = (c[1] - a[1]) * inv, e1y = (a[0] - c[0]) * inv, e1c = (c[0] * a[1] - a[0] * c[1]) * inv;
	const dz0 = a[2] - c[2], dz1 = b[2] - c[2];
	const x0 = Math.max(0, Math.floor(Math.min(a[0], b[0], c[0]))), x1 = Math.min(W - 1, Math.ceil(Math.max(a[0], b[0], c[0])));
	const y0 = Math.max(0, Math.floor(Math.min(a[1], b[1], c[1]))), y1 = Math.min(H - 1, Math.ceil(Math.max(a[1], b[1], c[1])));
	let su0 = 0, su1 = 0, su2 = 0, sv0 = 0, sv1 = 0, sv2 = 0, cols = 0, rows = 0, alpha = null, wrap = false;
	if (sheet) {
		su0 = st[0][0]; su1 = st[1][0]; su2 = st[2][0]; sv0 = st[0][1]; sv1 = st[1][1]; sv2 = st[2][1];
		cols = sheet.cols; rows = sheet.rows; alpha = sheet.data; wrap = !!sheet.wrap;
	}
	const e2x = -(e0x + e1x);
	for (let y = y0; y <= y1; y++) {
		const py = y + 0.5;
		// the weights at the row's first pixel centre; w2 = 1 - w0 - w1
		const r0 = e0x * (x0 + 0.5) + e0y * py + e0c, r1 = e1x * (x0 + 0.5) + e1y * py + e1c, r2 = 1 - r0 - r1;
		// where along the row each weight stays at or above zero
		let lo = 0, hi = x1 - x0;
		if (e0x > 0) lo = Math.max(lo, Math.ceil(-r0 / e0x - 1e-7)); else if (e0x < 0) hi = Math.min(hi, Math.floor(r0 / -e0x + 1e-7)); else if (r0 < -1e-12) continue;
		if (e1x > 0) lo = Math.max(lo, Math.ceil(-r1 / e1x - 1e-7)); else if (e1x < 0) hi = Math.min(hi, Math.floor(r1 / -e1x + 1e-7)); else if (r1 < -1e-12) continue;
		if (e2x > 0) lo = Math.max(lo, Math.ceil(-r2 / e2x - 1e-7)); else if (e2x < 0) hi = Math.min(hi, Math.floor(r2 / -e2x + 1e-7)); else if (r2 < -1e-12) continue;
		for (let t = lo; t <= hi; t++) {
			const w0 = r0 + e0x * t, w1 = r1 + e1x * t, w2 = 1 - w0 - w1;
			if (w0 < -1e-9 || w1 < -1e-9 || w2 < -1e-9) continue;
			const i = y * W + x0 + t;
			const z = c[2] + w0 * dz0 + w1 * dz1;
			if (z >= zb[i]) continue;
			if (alpha) {
				let u = Math.floor(w0 * su0 + w1 * su1 + w2 * su2);
				let v = Math.floor(w0 * sv0 + w1 * sv1 + w2 * sv2);
				// a picture repeats; a baked sheet ends at its edge
				if (wrap) { u = ((u % cols) + cols) % cols; v = ((v % rows) + rows) % rows; }
				if (u < 0 || v < 0 || u >= cols || v >= rows || alpha[(v * cols + u) * 4 + 3] < 128) continue;
			}
			zb[i] = z;
			id[i] = k;
		}
	}
}

// ------------------------------------------------ rounded parts: the whole pass

/**
 * Rebuilds the parts that are not boxes, and says which cubes nobody can see.
 *
 * input:
 *   parts   [{ faces, rigid }] — faces with positions, UV in the picture's own
 *           0..1 and the index of the picture
 *   boxes   [{ box: { c, axes, half }, faces, rigid }] — the file's own boxes: they
 *           hide pieces where their texture shows, and they always stay: what an
 *           author put in is the author's, seen or not
 *   pictures(face) — the decoded picture a face reads, or null
 *   mode    'fast' | 'best'
 * hooks: progress(share, text) may return a promise; stopRequested() says to
 *   finish sooner (strips for the parts left and the cull are dropped);
 *   cancelled() says to give up, and null comes back.
 *
 * Returns { pieces, texel, stats }: pieces carry { part, kind, box, sheets,
 * owner?, step? }.
 */
async function rebuildNotBoxes(input, hooks) {
	const h = hooks || {};
	const say = async (share, text) => { if (h.progress) await h.progress(share, text); };
	const gone = () => !!(h.cancelled && h.cancelled());
	const hurry = () => !!(h.stopRequested && h.stopRequested());
	const strips = input.mode === 'best';
	const partTris = input.parts.map(p => p.faces.map(f => f.positions));
	const stats = { parts: input.parts.length, boxes: 0, plates: 0, strips: 0, culled: 0, hurried: false };

	const shapes = [];
	for (let i = 0; i < input.parts.length; i++) {
		if (gone()) return null;
		shapes.push(shapePart(partTris[i]));
		await say(0.25 * (i + 1) / input.parts.length, `Shaping part ${i + 1} of ${input.parts.length}`);
	}
	// the texel: the finest at which the sheets fit the budget
	let pieces = null, texel = ROUND.TEXELS[0];
	for (const T of ROUND.TEXELS) {
		texel = T;
		pieces = [];
		let total = 0;
		for (let i = 0; i < shapes.length; i++) {
			if (gone()) return null;
			const withStrips = strips && !hurry();
			for (const pc of piecesAt(shapes[i], T, withStrips)) { pc.part = i; pieces.push(pc); total += pieceTexels(pc); }
		}
		await say(0.3, 'Choosing the texel');
		if (total <= ROUND.TEXEL_BUDGET) break;
	}

	// the texture of every piece; a piece with nothing to show goes
	for (let i = 0; i < pieces.length; i++) {
		if (gone()) return null;
		const pc = pieces[i];
		const part = input.parts[pc.part];
		if (!part.faceOf) part.faceOf = new Map(part.faces.map(f => [f.positions, f]));
		pc.sheets = bakePiece(pc, part.faceOf, input.pictures, part.faces);
		if (i % 50 === 49) await say(0.3 + 0.3 * (i + 1) / pieces.length, `Painting piece ${i + 1} of ${pieces.length}`);
	}
	// a strip whose plate went goes with it
	pieces = pieces.filter(pc => pc.sheets && (pc.kind !== 'strip' || pc.owner.sheets));

	// what nobody sees: drawn from every side, with the layers the import will give
	// coincident faces, so that the one in front is the one that counts
	if (!hurry()) {
		const layered = input.boxes.map(b => ({ center: b.box.c, size: b.box.half.map(x => 2 * x), vx: b.box.axes[0], vy: b.box.axes[1], vz: b.box.axes[2] }))
			.concat(pieces.filter(pc => pc.kind !== 'strip').map(pc => ({ center: pc.box.c, size: pc.box.half.map(x => 2 * x), vx: pc.box.axes[0], vy: pc.box.axes[1], vz: pc.box.axes[2] })));
		const inflate = resolveCoplanar(layered).inflate;
		const growOf = new Map();
		let k = input.boxes.length;
		for (const pc of pieces) if (pc.kind !== 'strip') growOf.set(pc, inflate[k++] || 0);
		const items = input.boxes.map(b => ({ quads: sourceQuads(b.faces, input.pictures), rigid: b.rigid, cullable: false }))
			.concat(pieces.map(pc => ({
				quads: pc.kind === 'strip'
					? pieceQuads(pc, 0, (growOf.get(pc.owner) || 0) + ROUND.LIFT * pc.step)
					: pieceQuads(pc, growOf.get(pc) || 0),
				rigid: input.parts[pc.part].rigid,
				cullable: true,
			})));
		const bounds = { lo: [Infinity, Infinity, Infinity], hi: [-Infinity, -Infinity, -Infinity] };
		for (const tris of partTris) for (const t of tris) for (const q of t) for (let a = 0; a < 3; a++) {
			if (q[a] < bounds.lo[a]) bounds.lo[a] = q[a];
			if (q[a] > bounds.hi[a]) bounds.hi[a] = q[a];
		}
		for (const b of input.boxes) for (const f of b.faces) for (const q of f.positions) for (let a = 0; a < 3; a++) {
			if (q[a] < bounds.lo[a]) bounds.lo[a] = q[a];
			if (q[a] > bounds.hi[a]) bounds.hi[a] = q[a];
		}
		let stopped = false;
		const best = await coverage(items, bounds, async share => {
			if (gone() || hurry()) { stopped = true; throw new Error('stop'); }
			await say(0.6 + 0.4 * share, 'Looking for cubes nobody sees');
		}).catch(e => { if (e && e.message === 'stop') return null; throw e; });
		if (gone()) return null;
		if (best && !stopped) {
			const before = pieces.length;
			const kept = new Set(pieces.filter((pc, i) => best[input.boxes.length + i] >= ROUND.CULL_PIXELS));
			// a strip stays only with its plate: it is drawn in the plate's layer
			pieces = pieces.filter(pc => kept.has(pc) && (pc.kind !== 'strip' || kept.has(pc.owner)));
			stats.culled = before - pieces.length;
		} else stats.hurried = true;
	} else stats.hurried = true;
	if (strips && hurry()) stats.hurried = true;

	for (const pc of pieces) stats[pc.kind === 'box' ? 'boxes' : pc.kind === 'plate' ? 'plates' : 'strips']++;
	return { pieces, texel, stats };
}

/**
 * A rebuilt piece as the faces solveBox reads: its sides, with the UV of their
 * sheets. `rectOf(k)` is where sheet k's texels landed, in project UV units; a
 * plate's one sheet serves both its sides. A box's side with nothing to show
 * stays in as bare geometry, so the box is still found whole.
 */
function pieceFaces(pc, rectOf) {
	const b = pc.box, T = pc.texel, faces = [];
	const quad = (P, UV) => {
		faces.push({ positions: [P[0], P[1], P[2]], uvs: UV ? [UV[0], UV[1], UV[2]] : [null, null, null] });
		faces.push({ positions: [P[0], P[2], P[3]], uvs: UV ? [UV[0], UV[2], UV[3]] : [null, null, null] });
	};
	if (pc.kind === 'plate' || pc.kind === 'strip') {
		const r = rectOf(pc.sheetIndex[0]);
		const W = 2 * b.half[1], H = 2 * b.half[2];
		const st = [[0, 0], [W, 0], [W, H], [0, H]];
		quad(st.map(([u, v]) => add(add(pc.corner, mul(b.axes[1], u)), mul(b.axes[2], v))),
			st.map(([u, v]) => [r.x + u / T * r.w / pc.cols, r.y + v / T * r.h / pc.rows]));
		return faces;
	}
	const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
	BOX_SIDES.forEach(([a, sg], f) => {
		const [p, q] = [0, 1, 2].filter(x => x !== a);
		const P = corners.map(([u, v]) => {
			const l = [0, 0, 0];
			l[a] = sg * b.half[a]; l[p] = u * b.half[p]; l[q] = v * b.half[q];
			return [0, 1, 2].map(k => b.c[k] + l[0] * b.axes[0][k] + l[1] * b.axes[1][k] + l[2] * b.axes[2][k]);
		});
		const k = pc.sheetIndex ? pc.sheetIndex[f] : undefined;
		if (k === undefined) { quad(P, null); return; }
		const sh = pc.sheets[f], r = rectOf(k);
		quad(P, corners.map(([u, v]) => [r.x + (u + 1) * b.half[p] / T * r.w / sh.cols, r.y + (v + 1) * b.half[q] / T * r.h / sh.rows]));
	});
	return faces;
}

/** A solveBox result as the rebuild's box: centre, axes, half sizes. */
function boxOfSolution(sol) {
	return { c: sol.center, axes: [sol.vx, sol.vy, sol.vz], half: sol.size.map(v => Math.abs(v) / 2) };
}

// ------------------------------------------------------------ Node export

if (typeof Plugin === 'undefined') {
	if (typeof module !== 'undefined') {
		module.exports = {
			solveBox, detectBox, orientations, assignFaces, countUVViolations, buildFaceUV,
			FACE_DIRS, FACE_NAMES,
			parseGLTFFiles, parseGLB, parseAnimations, readAccessor, matMul, matFromTRS, matApply, matIdentity,
			qMul, qConj, qRotate, boneDeltaRotation, boneDeltaPosition, sampleChannel, pickScale, snapScale, texelScale, correctionQuat, packAtlas, splitComponents, insideOutShells, enclosedVolume, boxFromBounds, TRIANGULATE, isDegenerate, imageSize, sniffMime, axisRotationOf, quatFromMat, triangleNormal, snapGrid, snapVec, snapAngle, isIdentityBasis, placeCoords, snapSafely, tidyVec, hasGltfArchive, sketchfabSearchURL, SKETCHFAB_SORTS, sketchfabEmbedURL, sketchfabPageURL, sketchfabArchives, sketchfabCredit, sketchfabDownload, hasAlphaChannel, resolveCoplanar, cubeFaces, faceRectsOverlap,
			JAVA_BOX, fitJavaBox, applyFit, javaFormatFor, versionBelow, tidyHierarchy, GENERIC_NODE, cubeHint,
			uniqueName, nameSlug, placeBeside, texturePlan, placeRect,
			isBlankImage, inflateRaw, IMPORT_LIMITS, unpackModelArchive, decodePicture,
			ROUND, ROUND_MODES, uniquePoints, hull2d, boxAlong, minVolumeBox, closestOnTriangle, rayTriangle, boxFitsPart, flatRegions, creaseTest, flatLocator, plateFor, plateMask, stripsFor, plateMaskBesideStrips, shapePart, piecesAt, piecesForPart, decodePNG, samplePicture, faceUVAt, regionPainter, boxPainter, bakePiece, BOX_SIDES, pieceQuads, cullDirections, coverage, rebuildNotBoxes, pieceFaces, mapFaceUVs, boxOfSolution, sourceQuads, colourTextureOf,
			buildCPMFiles, buildCPMConfig, buildCPMAnimations, cpmAlignOffset, cpmEstimateSize, cpmAutoAssign, cpmAutoPose, cpmPoint, cpmDelta, cpmEuler, cpmEulerFromQuat, cpmAngle, cpmUVScale, cpmFaceUV, CPM_PARTS, CPM_PART_NAMES, CPM_FACE,
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
		console.warn(`[gltf-to-minecraft] could not detect Euler order, falling back to ${EULER_ORDER}`, e);
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
	console.log('[gltf-to-minecraft] ' + calibration);

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
	console.log('[gltf-to-minecraft]\n' + lines.join('\n'));
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
/**
 * Whether the picture can carry transparency at all.
 *
 * Read from the header, not from the pixels: a texture may be fully opaque and
 * still have the channel, and it is the missing channel that cannot be undone.
 *
 * Returns null when the format gives no cheap answer — the caller then says
 * nothing rather than guessing.
 */
function hasAlphaChannel(bytes) {
	if (!bytes || bytes.length < 26) return null;
	const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

	// PNG: colour type sits in IHDR. 6 is RGBA and 4 is grey+alpha; a palette
	// (3) carries transparency only through a tRNS chunk.
	if (dv.getUint32(0) === 0x89504E47) {
		const type = bytes[25];
		if (type === 6 || type === 4) return true;
		if (type !== 3) return false;
		// tRNS, searched in the bytes: parsing the whole chunk list for one flag
		// would cost more than it is worth.
		for (let i = 8; i < bytes.length - 4; i++) {
			if (bytes[i] === 0x74 && bytes[i + 1] === 0x52 && bytes[i + 2] === 0x4E && bytes[i + 3] === 0x53) return true;
		}
		return false;
	}

	// JPEG has no alpha at all, ever.
	if ((bytes[0] === 0xFF && bytes[1] === 0xD8)) return false;

	return null;
}

/**
 * Whether an image is fully transparent — a placeholder, not a texture.
 *
 * Blockbench exports a face that has no texture with a material of its own,
 * pointing at a 1×1 picture whose one pixel is (0,0,0,0). Such faces were not
 * there in Blockbench, so they must stay hidden, and the picture has no place
 * in the atlas: it doubled one to 128×64 for a single transparent pixel.
 *
 * Only small PNGs are read, and the answer is yes only when certain: every
 * decoded sample is zero (then every pixel is zero whatever the row filters,
 * since each is predicted from zeros) and zero means transparent — an alpha
 * channel, or a palette whose entry 0 has zero alpha. Anything else, any doubt,
 * is no.
 */
function isBlankImage(bytes) {
	if (!bytes || bytes.length < 33 || bytes.length > 8192) return false;
	const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	if (dv.getUint32(0) !== 0x89504E47) return false;
	const width = dv.getUint32(16), height = dv.getUint32(20);
	const depth = bytes[24], type = bytes[25];
	if (!width || !height || width * height > 4096) return false;
	const idat = [];
	let paletteTransparent = false;
	for (let at = 8; at + 8 <= bytes.length;) {
		const len = dv.getUint32(at);
		const name = String.fromCharCode(bytes[at + 4], bytes[at + 5], bytes[at + 6], bytes[at + 7]);
		if (at + 12 + len > bytes.length) return false;
		if (name === 'IDAT') idat.push(bytes.subarray(at + 8, at + 8 + len));
		if (name === 'tRNS' && type === 3) paletteTransparent = len > 0 && bytes[at + 8] === 0;
		if (name === 'IEND') break;
		at += 12 + len;
	}
	if (!(type === 6 || type === 4 || (type === 3 && paletteTransparent))) return false;
	const joined = new Uint8Array(idat.reduce((n, c) => n + c.length, 0));
	let o = 0;
	for (const c of idat) { joined.set(c, o); o += c.length; }
	// Bytes per row: the filter byte plus the samples.
	const channels = type === 6 ? 4 : type === 4 ? 2 : 1;
	const expected = height * (1 + Math.ceil(width * channels * depth / 8));
	let raw;
	try { raw = inflateRaw(joined.subarray(2), expected); } catch (e) { return false; }
	if (raw.length !== expected) return false;
	// Each row starts with its filter type, which may be anything; only the
	// samples after it have to be zero.
	const row = expected / height;
	for (let i = 0; i < raw.length; i++) if (i % row && raw[i]) return false;
	return true;
}

/**
 * Inflates a raw deflate stream (RFC 1951): stored, fixed and dynamic blocks.
 * Blockbench offers no zlib to a plugin in every build, and a PNG's pixels sit
 * behind one. Written after Mark Adler's puff; `limit` stops a runaway stream.
 */
function inflateRaw(data, limit) {
	const LBASE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
	const LEXT = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
	const DBASE = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
	const DEXT = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
	const ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
	const out = [];
	let pos = 0, bit = 0;
	const bits = n => {
		let v = 0;
		for (let i = 0; i < n; i++) {
			if (pos >= data.length) throw new Error('stream ended early');
			v |= ((data[pos] >> bit) & 1) << i;
			if (++bit === 8) { bit = 0; pos++; }
		}
		return v;
	};
	// A canonical Huffman code: how many codes of each length, and the symbols in order.
	const code = lengths => {
		const count = new Array(16).fill(0), offs = new Array(16).fill(0);
		for (const l of lengths) count[l]++;
		count[0] = 0;
		for (let l = 1; l < 16; l++) offs[l] = offs[l - 1] + count[l - 1];
		const symbol = new Array(lengths.length);
		lengths.forEach((l, s) => { if (l) symbol[offs[l]++] = s; });
		return { count, symbol };
	};
	const decode = h => {
		let c = 0, first = 0, index = 0;
		for (let len = 1; len < 16; len++) {
			c |= bits(1);
			const n = h.count[len];
			if (c - n < first) return h.symbol[index + (c - first)];
			index += n;
			first = (first + n) << 1;
			c <<= 1;
		}
		throw new Error('bad Huffman code');
	};
	let last;
	do {
		last = bits(1);
		const type = bits(2);
		if (type === 0) {
			if (bit) { bit = 0; pos++; }
			if (pos + 4 > data.length) throw new Error('stream ended early');
			const len = data[pos] | (data[pos + 1] << 8);
			pos += 4;
			if (pos + len > data.length) throw new Error('stream ended early');
			for (let i = 0; i < len; i++) out.push(data[pos++]);
		} else if (type === 1 || type === 2) {
			let lit, dist;
			if (type === 1) {
				const l = [];
				for (let s = 0; s < 288; s++) l.push(s < 144 ? 8 : s < 256 ? 9 : s < 280 ? 7 : 8);
				lit = code(l);
				dist = code(new Array(30).fill(5));
			} else {
				const nlen = bits(5) + 257, ndist = bits(5) + 1, ncode = bits(4) + 4;
				const cl = new Array(19).fill(0);
				for (let i = 0; i < ncode; i++) cl[ORDER[i]] = bits(3);
				const clc = code(cl);
				const lengths = [];
				while (lengths.length < nlen + ndist) {
					const sym = decode(clc);
					if (sym < 16) { lengths.push(sym); continue; }
					let rep, val = 0;
					if (sym === 16) {
						if (!lengths.length) throw new Error('repeat with nothing before');
						val = lengths[lengths.length - 1];
						rep = 3 + bits(2);
					} else rep = sym === 17 ? 3 + bits(3) : 11 + bits(7);
					for (let i = 0; i < rep; i++) lengths.push(val);
				}
				lit = code(lengths.slice(0, nlen));
				dist = code(lengths.slice(nlen, nlen + ndist));
			}
			for (;;) {
				let sym = decode(lit);
				if (sym < 256) { out.push(sym); }
				else if (sym === 256) break;
				else {
					sym -= 257;
					if (sym >= 29) throw new Error('bad length symbol');
					const len = LBASE[sym] + bits(LEXT[sym]);
					const d = decode(dist);
					if (d >= 30) throw new Error('bad distance symbol');
					const back = DBASE[d] + bits(DEXT[d]);
					if (back > out.length) throw new Error('distance too far back');
					for (let i = 0; i < len; i++) out.push(out[out.length - back]);
				}
				if (out.length > limit) throw new Error('longer than expected');
			}
		} else {
			throw new Error('bad block type');
		}
		if (out.length > limit) throw new Error('longer than expected');
	} while (!last);
	return Uint8Array.from(out);
}

function imageSize(bytes) {
	if (!bytes || bytes.length < 24) return null;
	const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

	// PNG: signature, then IHDR with width and height straight away.
	if (dv.getUint32(0) === 0x89504E47) return checkedImageSize(dv.getUint32(16), dv.getUint32(20));

	// GIF: 'GIF8', size lives in the logical screen descriptor, little-endian.
	if (dv.getUint32(0) === 0x47494638) return checkedImageSize(dv.getUint16(6, true), dv.getUint16(8, true));

	// WebP: 'RIFF'...'WEBP', then three sub-formats with different layouts.
	if (dv.getUint32(0) === 0x52494646 && dv.getUint32(8) === 0x57454250) {
		const tag = dv.getUint32(12);
		if (tag === 0x56503820 && bytes.length > 30) {          // 'VP8 ' — lossy
			return checkedImageSize(dv.getUint16(26, true) & 0x3FFF, dv.getUint16(28, true) & 0x3FFF);
		}
		if (tag === 0x5650384C && bytes.length > 25) {          // 'VP8L' — lossless
			const b = dv.getUint32(21, true);
			return checkedImageSize((b & 0x3FFF) + 1, ((b >> 14) & 0x3FFF) + 1);
		}
		if (tag === 0x56503858 && bytes.length > 30) {          // 'VP8X' extended
			return checkedImageSize(
				(bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)) + 1,
				(bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)) + 1);
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
				return checkedImageSize(dv.getUint16(p + 7), dv.getUint16(p + 5));
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
function verifyAnimationPose(parsed, groupByNode, report, nameOf = n => n) {
	try {
		const anim = Animation.all.find(a => a.name && parsed.animations.some(x => nameOf(x.name) === a.name
			&& x.channels.some(c => c.path === 'translation')));
		if (!anim) { report.push('Pose check: no animation with position channels found'); return; }
		const src = parsed.animations.find(x => nameOf(x.name) === anim.name);

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
	// the name an animation takes in the project; an added model's carry its name
	const nameOf = (opts && opts.animName) || (n => n);
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
				name: nameOf(a.name),
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

	verifyAnimationPose(parsed, groupByNode, report, nameOf);

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
function buildAtlasDataURL(images, layout, sheets) {
	return new Promise(resolve => {
		try {
			const canvas = document.createElement('canvas');
			canvas.width = layout.width;
			canvas.height = layout.height;
			const ctx = canvas.getContext('2d');
			ctx.imageSmoothingEnabled = false;   // pixel art, no smoothing
			// The baked sheets of rebuilt parts sit after the pictures in the layout.
			// They are pixels already, so they go in as one block, before any picture:
			// putImageData replaces, while drawImage blends over what is there.
			if (sheets && sheets.length && ctx.createImageData) {
				const full = ctx.createImageData(layout.width, layout.height);
				sheets.forEach((sh, k) => writeSheet(full.data, layout.width, layout.rects[images.length + k], sh));
				ctx.putImageData(full, 0, 0);
			}
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

/**
 * A baked sheet into an RGBA block, inside `rect` less a border of one texel,
 * the border repeating the sheet's edge.
 */
function writeSheet(data, width, rect, sh) {
	for (let y = 0; y < rect.h; y++) {
		const j = Math.min(sh.rows - 1, Math.max(0, y - 1));
		for (let x = 0; x < rect.w; x++) {
			const i = Math.min(sh.cols - 1, Math.max(0, x - 1));
			const from = (j * sh.cols + i) * 4, to = ((rect.y + y) * width + rect.x + x) * 4;
			data[to] = sh.data[from]; data[to + 1] = sh.data[from + 1]; data[to + 2] = sh.data[from + 2]; data[to + 3] = sh.data[from + 3];
		}
	}
}

/**
 * A picture's pixels, for baking the sheets of rebuilt parts: a PNG is read here,
 * anything else — a JPEG from Sketchfab — through a canvas. Null when neither can.
 */
function decodePicture(img, budget = { pixels: 0 }) {
	// Check headers before the native decoder, and never fall back after a limit error.
	let reserved = 0;
	try {
		const size = imageSize(img.bytes);
		if (size) {
			reserved = size.width * size.height;
			budget.pixels += reserved;
			boundedInteger(budget.pixels, IMPORT_LIMITS.totalImagePixels, 'decoded image pixels');
		}
		return Promise.resolve(decodePNG(img.bytes));
	} catch (e) { if (e instanceof ImportLimitError) return Promise.reject(e); }
	return new Promise((resolve, reject) => {
		try {
			const el = new Image();
			el.onload = () => {
				try {
					const w = el.naturalWidth || el.width, h = el.naturalHeight || el.height;
					checkImageDimensions(w, h);
					budget.pixels += w * h - reserved;
					boundedInteger(budget.pixels, IMPORT_LIMITS.totalImagePixels, 'decoded image pixels');
					const canvas = document.createElement('canvas');
					canvas.width = w;
					canvas.height = h;
					const ctx = canvas.getContext('2d');
					ctx.drawImage(el, 0, 0);
					resolve({ w, h, data: ctx.getImageData(0, 0, w, h).data });
				} catch (e) { if (e instanceof ImportLimitError) reject(e); else resolve(null); }
			};
			el.onerror = () => resolve(null);
			el.src = 'data:' + (img.mime || 'image/png') + ';base64,' + bytesToBase64(img.bytes);
		} catch (e) { resolve(null); }
	});
}

/**
 * Long work with a window that shows how far it got and lets it be cut short.
 *
 * `run(hooks)` gets the hooks rebuildNotBoxes takes. Its progress calls give way
 * to the interface every few dozen milliseconds, so Blockbench keeps drawing and
 * the buttons answer. Finish now keeps what is done and hurries the rest; Cancel
 * throws it all away, and the promise then gives null.
 */
function withProgress(title, run) {
	let stop = false, cancel = false, last = Date.now();
	let fill = null, text = null, dialog = null;
	try {
		dialog = new Dialog({
			id: PLUGIN_ID + '_progress',
			title,
			width: 460,
			cancel_on_click_outside: false,
			buttons: ['Finish now', 'Cancel import'],
			confirmIndex: 0,
			cancelIndex: 1,
			lines: ['<div class="mtc_prog">'
				+ '<div class="mtc_prog_text" style="margin-bottom:8px">Starting</div>'
				+ '<div style="height:6px;border-radius:3px;background:var(--color-back,#21252b);overflow:hidden">'
				+ '<div class="mtc_prog_fill" style="height:100%;width:0;background:var(--color-accent,#3e90ff)"></div></div>'
				+ '<p style="opacity:0.7;margin-top:10px">Finish now keeps what is done: the parts left get no edge strips, '
				+ 'and cubes nobody sees are kept. Cancel import leaves the project as it was.</p></div>'],
			onConfirm() { stop = true; if (text) text.textContent = 'Finishing'; return false; },
			onCancel() { cancel = true; if (text) text.textContent = 'Cancelling'; return false; },
		});
		dialog.show();
		const root = dialog.object || document;
		fill = root.querySelector('.mtc_prog_fill');
		text = root.querySelector('.mtc_prog_text');
	} catch (e) { /* the work goes on without a window */ }
	const pause = () => (typeof setTimeout === 'function' ? new Promise(r => setTimeout(r, 0)) : Promise.resolve());
	const hooks = {
		progress(share, what) {
			if (Date.now() - last < 40) return null;
			last = Date.now();
			if (fill && fill.style) fill.style.width = Math.round(100 * share) + '%';
			if (text && !stop && !cancel) text.textContent = what;
			try { Blockbench.setProgress(share); } catch (e) { /* only the taskbar */ }
			return pause();
		},
		stopRequested: () => stop,
		cancelled: () => cancel,
	};
	const close = () => {
		try { Blockbench.setProgress(0); } catch (e) { /* only the taskbar */ }
		try { if (dialog) dialog.hide(); } catch (e) { /* already gone */ }
	};
	return pause().then(() => run(hooks)).then(
		result => { close(); return cancel ? null : result; },
		e => { close(); throw e; });
}

/** The open project's format, when the import can build into it; null otherwise. */
function openProjectTarget() {
	try {
		if (typeof Project === 'undefined' || !Project || typeof Format === 'undefined' || !Format) return null;
		return TARGETS.find(t => t.id === Format.id) || null;
	} catch (e) {
		return null;
	}
}

/**
 * Where an added model goes: into the selected folder, or the folder of the
 * selected cube, around that folder's pivot; to the top level otherwise. A sword
 * lands in the hand it is meant for and turns with it.
 *
 * Blockbench 5 names the selected folder Group.first_selected and makes
 * Group.selected a list; Blockbench 4 keeps the folder itself in Group.selected.
 */
function attachPoint() {
	const folder = v => (v && !Array.isArray(v) && Array.isArray(v.children) && Array.isArray(v.origin) ? v : null);
	let group = null;
	try {
		group = folder(Group.first_selected) || folder(Group.selected)
			|| (Array.isArray(Group.selected) ? folder(Group.selected[0]) : null);
		if (!group && typeof Outliner !== 'undefined') group = folder(((Outliner.selected || [])[0] || {}).parent);
	} catch (e) { /* nothing selected */ }
	return group ? { group, point: group.origin.slice() } : { group: null, point: [0, 0, 0] };
}

/** The names in use in a list of folders or animations. */
function namesIn(list) {
	try {
		return new Set((list || []).map(x => x && x.name).filter(Boolean));
	} catch (e) {
		return new Set();
	}
}

/** The texture a one-texture format draws every face with. */
function projectTexture() {
	try {
		return (Texture.getDefault && Texture.getDefault()) || Texture.all[0] || null;
	} catch (e) {
		return null;
	}
}

/**
 * Why the atlas cannot be drawn beside this project texture, or null when it can.
 * The texture is redrawn as one picture, and that would flatten layers and break
 * the frames of an animated one; a texture that never loaded would be replaced
 * with an empty sheet.
 */
function besideProblem(tex) {
	if (!tex) return null;
	if (tex.error || !tex.width || !tex.height) return 'The project texture has not loaded, so nothing can be drawn beside it.';
	if (tex.layers_enabled) return 'The project texture has layers, and drawing the model\'s texture beside it would merge them. Merge its layers into one and run the import again.';
	if (tex.frameCount > 1) return 'The project texture is animated, and the model\'s texture beside it would break its frames.';
	return null;
}

/**
 * The project texture with the model's atlas drawn beside it, as a data URL.
 * Drawn at the project texture's own resolution — a 64×64 UV space painted at
 * 128×128 gets the atlas doubled — so every UV keeps meaning the same pixels.
 * `base` is null when the project had no texture yet.
 */
function composeBeside(base, plan, oldSize, atlasSize, atlasURL) {
	return new Promise(resolve => {
		try {
			const px = base ? base.width / oldSize[0] : 1;
			const py = base ? base.height / oldSize[1] : 1;
			const canvas = document.createElement('canvas');
			canvas.width = Math.round(plan.uvSize[0] * px);
			canvas.height = Math.round(plan.uvSize[1] * py);
			const ctx = canvas.getContext('2d');
			ctx.imageSmoothingEnabled = false;
			if (base) ctx.drawImage(base.canvas && base.canvas.width ? base.canvas : base.img, 0, 0, base.width, base.height);
			const el = new Image();
			el.onload = () => {
				try {
					ctx.drawImage(el, plan.offset[0] * px, plan.offset[1] * py, atlasSize[0] * px, atlasSize[1] * py);
				} catch (e) { /* the old texture is still there */ }
				resolve(canvas.toDataURL());
			};
			el.onerror = () => resolve(null);
			el.src = atlasURL;
		} catch (e) {
			resolve(null);
		}
	});
}

/** Builds a project from an unpacked archive. */
/**
 * What the last import produced. The CPM export needs the same hierarchy, boxes
 * and texture, and it has to survive between two dialogs — so it is kept here
 * rather than threaded through. Declared BEFORE the function that fills it:
 * a `let` used above its declaration is a temporal-dead-zone error, and this
 * plugin has already been bitten by that once.
 */
let lastImport = null;

async function buildFromFiles(files, sourceName, opts) {
	const report = [];

	// The format goes first: finding out there is nothing to build into after the
	// whole parse would waste it. Added to the open project, the model takes that
	// project's format.
	const adding = !!(opts && opts.add_to_open);
	const target = adding ? openProjectTarget() : targetById((opts && opts.target) || 'geckolib_model');
	if (!target) {
		Blockbench.showMessageBox({ title: 'Import failed', message: 'No open project in a format the model can be added to.' });
		return;
	}
	const format = typeof Formats !== 'undefined' && Formats[target.id];
	if (!format) {
		if (target.id === 'geckolib_model') requireGeckolib();
		else Blockbench.showMessageBox({ title: 'Import failed', message: `This Blockbench has no ${target.name} format.` });
		return;
	}

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

	// Which images the geometry actually reaches. A colour texture that no
	// primitive references cannot show up on the model, so packing it only
	// inflates the atlas and moves everyone else's rectangle.
	//
	// This is not a rare case. On all three reference models with several
	// textures every single primitive carries material 0, so the rest are
	// declared and never used: one packed twelve images into a 512x256 atlas
	// while the only one its geometry reads is 32x32.
	// Every image an object's faces use, not only its main one: a cube may wear
	// two pictures on different faces.
	const reached = new Set();
	for (const o of probe.objects) for (const i of o.images || [o.image]) if (i >= 0) reached.add(i);

	// Only colour goes into the atlas: normal and roughness maps are useless in
	// Minecraft yet take up just as much room.
	//
	// The reach test is skipped when nothing reports an image at all — a file
	// without materials gives no assignment to go on, and there the pictures in
	// the archive are the whole of what we know.
	// A transparent placeholder stays out too: its faces are hidden anyway.
	const usable = (img, i) => !!img.size && img.role !== 'aux' && !img.blank
		&& (!reached.size || reached.has(i));
	const images = sized.filter(usable);
	boundedInteger(images.reduce((n, img) => n + img.size.width * img.size.height, 0), IMPORT_LIMITS.totalImagePixels, 'model image pixels');
	const remap = [];
	let next = 0;
	sized.forEach((img, i) => { remap[i] = usable(img, i) ? next++ : -1; });

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
	const unreached = sized.filter((img, i) =>
		img.size && img.role !== 'aux' && !img.blank && reached.size && !reached.has(i)).length;
	if (aux) report.push(`Auxiliary maps skipped: ${aux} (normals, specular) — unused in Minecraft`);
	// Blockbench exports an untextured face with a transparent 1×1 stand-in.
	if (probe.blank && probe.blank.triangles) {
		report.push(`Faces with no texture: ${probe.blank.triangles / 2 | 0} kept hidden, as they were in `
			+ 'Blockbench' + (probe.blank.objects ? `; ${probe.blank.objects} objects made only of them left out` : ''));
	}
	if (probe.outlineShells) {
		report.push(`Outline shells left out: ${probe.outlineShells} — inside-out copies that draw a dark rim `
			+ 'where back faces are culled, and would cover the model as cubes');
	}
	if (unread) report.push(`Images skipped: ${unread} — format not recognised`);
	// Said plainly, because it is the honest explanation for a model that arrives
	// wearing one texture everywhere: the file itself points all of its geometry
	// at a single material, and the other pictures have nothing to land on.
	if (unreached) report.push(`Colour textures no mesh references: ${unreached} of `
		+ `${unreached + images.length} — left out of the atlas, and nothing in the `
		+ 'file says which parts they belong to');
	// When every part points at one picture and the others lie unused, the file has
	// lost which parts use which material. Exporters do not write materials nobody
	// uses, so this is a damaged file, and it is said up front: otherwise the wrong
	// colours read as the import's fault. Seen on files where every part, effects
	// included, wore the one texture.
	const lostMaterials = unreached && reached.size === 1
		? `Every part of this file points at one texture, while ${unreached} more are not used by any part. `
			+ 'The file has most likely lost which parts use which material, so colours will land on the '
			+ 'wrong parts. Getting the model again from its source is the fix; the import cannot tell.'
		: null;

	// Transparency the material asks for and the picture cannot give.
	//
	// A Minecraft-style figure is two shells, and the outer one is see-through
	// wherever it is unused. Strip the alpha channel and that shell becomes a
	// solid slab: the body disappears behind it, which reads as "the textures do
	// not work" while every coordinate is in fact correct. Measured on the
	// reference set — the one model whose texture kept its alpha is the one whose
	// textures were reported as fine.
	//
	// Stated as a mismatch, not as a loss: some models set BLEND on a texture that
	// never had alpha, and there nothing is missing. Guessing a transparent colour
	// was measured and rejected — black is also outlines and dark details.
	const flat = images.filter(img => hasAlphaChannel(img.bytes) === false).length;
	if (probe.wantsAlpha && flat === images.length) {
		report.push('The material asks for transparency, but the texture has no alpha '
			+ 'channel — any see-through parts will arrive opaque.');
	}

	// The main texture is the one most objects use: its size defines the
	// project's UV space.
	const usage = {};
	for (const o of probe.objects) {
		const i = remap[o.image];
		if (i >= 0) usage[i] = (usage[i] || 0) + 1;
	}
	let mainIndex = 0, mainCount = -1;
	images.forEach((img, i) => { if ((usage[i] || 0) > mainCount) { mainCount = usage[i] || 0; mainIndex = i; } });

	// Added to the open project: where the model goes, and how its texture joins
	// the project's (see texturePlan). Decided before anything is built, so a
	// texture the atlas cannot join stops the import with the project untouched.
	const host = adding ? attachPoint() : null;
	const oldSize = adding ? [Project.texture_width, Project.texture_height] : null;
	let texKind = 'fresh', baseTexture = null;
	if (adding) {
		const empty = !Texture.all.length && !((typeof Outliner !== 'undefined' && Outliner.elements) || []).length;
		texKind = empty ? 'fresh' : Format.per_texture_uv_size ? 'own' : Format.single_texture ? 'beside' : 'shared';
		if (texKind === 'beside') {
			baseTexture = projectTexture();
			const problem = besideProblem(baseTexture);
			if (problem) {
				Blockbench.showMessageBox({ title: 'Cannot add the model', message: problem });
				return;
			}
		}
	}

	// Coordinate scale: for Blockbench a glTF unit is a block, for Sketchfab
	// exports it is already a pixel. A hardcoded ×16 blew such models up 16 times.
	let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
	for (const o of probe.objects) for (const f of o.faces) for (const q of f.positions) {
		for (let a = 0; a < 3; a++) { if (q[a] < lo[a]) lo[a] = q[a]; if (q[a] > hi[a]) hi[a] = q[a]; }
	}
	const sizeUnits = Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) || 1;
	// Texel density is computed on the probe parse: there the UV are normalised
	// and the size is taken from each object's own texture.
	const density = texelScale(probe.objects, i => images[remap[i] >= 0 ? remap[i] : mainIndex].size);

	// How much UV spills outside its texture. In glTF that is legal — the texture
	// tiles — but an atlas cannot tile: the coordinate wanders onto a neighbouring
	// image, which is the usual cause of a model arriving with the wrong texture.
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
	const uvOutsideShare = uvTotal ? +(100 * uvOutside / uvTotal).toFixed(1) : 0;
	if (uvOutsideShare > 0.5) {
		report.push(`UV outside the texture: ${uvOutsideShare}% — in glTF that means tiling, `
			+ 'but an atlas cannot tile, so the texture may land wrong');
	}

	const custom = Number((opts && opts.scale_custom) || 0);
	const autoScale = pickScale(sizeUnits, density);
	const chosenScale = custom > 0
		? custom
		: (opts && opts.scale_mode && opts.scale_mode !== 'auto')
			? Number(opts.scale_mode)
			: autoScale;

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

	// Said, because the two archives of one model can differ (see sketchfabArchives).
	if (opts && opts.original) {
		report.push('Downloaded: the author\'s original, uploaded from Blockbench — Sketchfab\'s own '
			+ 'conversion can lose transparency and wraps the model in extra nodes');
	}
	// Licence: most downloadable models require attribution, and losing that
	// information during import is not acceptable.
	const licenseKey = Object.keys(files).find(n => /license[.]txt$/i.test(n));
	if (licenseKey) {
		const text = new TextDecoder().decode(files[licenseKey]).trim();
		// the original has no licence file; its credit is made from the model page
		report.push(opts && opts.original ? 'Licence from the model page:' : 'Licence from the archive:');
		for (const l of text.split(String.fromCharCode(10)).map(x => x.trim()).filter(Boolean).slice(0, 4)) {
			report.push('  ' + l);
		}
	}

	// Added into a folder, the model stands on that folder's pivot.
	if (host && host.group) {
		report.push(`Placed at the pivot of “${host.group.name}”: [${host.point.map(v => +v.toFixed(2)).join(', ')}]`);
	}
	// The UV stay in each picture's own 0..1 for now: the rebuild of the parts
	// that are not boxes reads the pictures through them, and the atlas can only
	// be laid out once it knows what the rebuild adds. They move into it below.
	const parsed = parseGLTFFiles(files, {
		scale: chosenScale, offset: host ? add(offset, host.point) : offset, rotate,
		uvWidth: 1, uvHeight: 1,
	});
	if (rotate.some(v => v)) report.push(`Extra rotation: X ${rotate[0]}°, Y ${rotate[1]}°`);

	// What came out of the export wrapper gets its own line rather than sitting
	// among warnings: if a model arrives lying down, that is the first thing to know.
	const wrapNotes = parsed.warnings.filter(w => w.indexOf('wrapper') >= 0);
	if (wrapNotes.length) {
		report.push('Export wrapper:');
		for (const w of wrapNotes) report.push('  ' + w);
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
			// kept apart, so tidying the names strips the exporter's number and
			// not the part number appended here
			baseName: obj.name,
			part: parts.length > 1 ? i + 1 : 0,
			faces,
		}));
	}
	parsed.objects = split;
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
	const badMode = (opts && opts.bad_objects) || 'rebuild';
	const notBoxes = [];
	const skipped = [];
	let degenerate = 0;
	for (const obj of parsed.objects) {
		if (isDegenerate(obj.faces)) { degenerate++; obj.drop = true; continue; }
		const sol = solveBox(obj.faces);
		// the box as found, for the rebuild: it hides what lies behind it
		if (!sol.error) { obj.box = sol; continue; }
		notBoxes.push(`${obj.name}: ${sol.error}`);
		if (badMode === 'abort') continue;
		obj.bad = true;
		if (badMode === 'skip') { obj.drop = true; skipped.push(obj.name); }
	}
	parsed.objects = parsed.objects.filter(o => !o.drop);
	if (degenerate) report.push(`Degenerate fragments dropped: ${degenerate}`);
	if (notBoxes.length) {
		report.push(`Not boxes: ${notBoxes.length} — `
			+ (badMode === 'skip' ? 'skipped' : badMode === 'box' ? 'replaced with their bounding box'
				: badMode === 'rebuild' ? 'rebuilt from plates' : 'import cancelled'));
		for (const n of notBoxes.slice(0, 5)) report.push('  ' + n);
	}
	if (notBoxes.length && badMode === 'abort') {
		Blockbench.showMessageBox({
			title: 'This model is not made of cubes',
			message: `Could not represent ${notBoxes.length} of ${parsed.objects.length} objects as cubes.\n\n`
				+ notBoxes.slice(0, 12).join('\n')
				+ (notBoxes.length > 12 ? `\n…and ${notBoxes.length - 12} more` : '')
				+ '\n\nTo import it anyway, pick another way for such objects in the advanced settings: '
				+ 'by default they are rebuilt from plates.',
		});
		return;
	}

	// Step 1b. The objects that are not boxes, rebuilt from plates. Before anything
	// is created, so that stopping it leaves the project as it was.
	let rebuilt = null;
	const rebuildMode = ROUND_MODES.includes(opts && opts.rounded) ? opts.rounded : 'fast';
	const bad = badMode === 'rebuild' ? parsed.objects.filter(o => o.bad) : [];
	if (bad.length) {
		const began = Date.now();
		const pictureBudget = { pixels: 0 };
		const pictures = await Promise.all(images.map(img => decodePicture(img, pictureBudget)));
		const pictureOf = face => {
			const i = face.image >= 0 && remap[face.image] >= 0 ? remap[face.image] : mainIndex;
			return pictures[i] || pictures[mainIndex] || null;
		};
		// Only what moves together can hide itself: a cube behind an arm at rest is
		// in plain sight once the arm moves. So each set of objects under the same
		// animated node is looked at on its own.
		const moving = new Set();
		if (!target.still && !(opts && opts.animations === false)) {
			for (const a of parsed.animations) for (const ch of a.channels) moving.add(ch.node);
		}
		const up = new Map(parsed.hierarchy.map(h => [h.index, h.parent]));
		const rigidOf = node => {
			for (let n = node; n !== undefined && n >= 0; n = up.get(n)) if (moving.has(n)) return n;
			return -1;
		};
		const whole = parsed.objects.filter(o => !o.bad && o.box);
		rebuilt = await withProgress(`Rebuilding ${bad.length} parts that are not cubes`, hooks => rebuildNotBoxes({
			parts: bad.map(o => ({ faces: o.faces, rigid: rigidOf(o.node) })),
			boxes: whole.map(o => ({ box: boxOfSolution(o.box), faces: o.faces, rigid: rigidOf(o.node) })),
			pictures: pictureOf,
			mode: rebuildMode,
		}, hooks));
		if (!rebuilt) return null;   // cancelled, and nothing was touched
		rebuilt.objects = bad;
		rebuilt.seconds = (Date.now() - began) / 1000;
	}

	// Every texture is packed into one atlas: GeckoLib supports one per model, and
	// differing sizes cannot otherwise coexist in a shared project UV space.
	// For a single image the atlas degenerates into that image.
	//
	// The rebuilt pieces add their sheets, each with a border of one texel that
	// repeats its edge: a sampler rounding at the very edge then reads the same colour.
	const sheetList = [];
	if (rebuilt) {
		for (const pc of rebuilt.pieces) {
			pc.sheetIndex = [];
			pc.sheets.forEach((sh, f) => { if (sh) { pc.sheetIndex[f] = sheetList.length; sheetList.push(sh); } });
		}
	}
	const layout = packAtlas(images.map(img => img.size).concat(sheetList.map(sh => ({ width: sh.cols + 2, height: sh.rows + 2 }))));
	const needAtlas = images.length > 1 || sheetList.length > 0;
	const size = { width: layout.width, height: layout.height };
	if (needAtlas) {
		report.push(`Textures in archive: ${images.length}`
			+ (sheetList.length ? `, and ${sheetList.length} sheets baked for the rebuilt parts` : '')
			+ ` → packed into a ${layout.width}×${layout.height} atlas`);
	}
	if (Math.max(layout.width, layout.height) > 4096) {
		report.push(`WARNING: the texture is ${layout.width}×${layout.height}, more than many graphics cards take.`);
	}
	const plan = texturePlan(texKind, oldSize, [size.width, size.height]);
	// Objects with an unreadable texture get a piece of the main one: a wrong patch
	// beats UV flying outside the atlas. And the same piece for an object that
	// names no image at all: its UV were authored inside some single picture, so
	// the main one is the best guess available.
	mapFaceUVs(parsed.objects,
		sized.map((img, i) => placeRect(layout.rects[remap[i] >= 0 ? remap[i] : mainIndex], plan)),
		placeRect(layout.rects[mainIndex], plan), plan.uvSize);
	const sheetRect = k => {
		const r = layout.rects[images.length + k];
		return placeRect({ x: r.x + 1, y: r.y + 1, w: r.w - 2, h: r.h - 2 }, plan);
	};

	// What an added model changes is one edit, so a single Ctrl+Z takes it all
	// back: its folders and cubes, its animations, and the texture it added or
	// grew. It is closed once the texture has its pixels, or undo would restore
	// an empty one.
	const animsBefore = adding ? new Set(Animation.all) : null;
	if (adding) {
		// Cubes are added in Edit mode; in Animate mode a pose would be showing.
		try { if (Modes.animate && Modes.options.edit) Modes.options.edit.select(); } catch (e) { /* stay */ }
		Undo.initEdit({
			elements: [], outliner: true, textures: baseTexture ? [baseTexture] : [], bitmap: true,
			uv_mode: true, animations: [], selection: true,
		});
	} else {
		newProject(format);
		Project.name = (sourceName || 'model').replace(/\.[^.]*$/, '');
		// IMPORTANT: geckolib_model and bedrock default to box_uv = true, while we need
		// per-face UV, otherwise Blockbench re-unwraps them and the layout is lost.
		// An open project keeps its own: each cube carries its UV mode.
		Project.box_uv = false;
		// Bedrock names the geometry after this identifier, and an empty one is
		// exported as geometry.unknown.
		if (target.id === 'bedrock' && !Project.model_identifier) {
			Project.model_identifier = Project.name.toLowerCase().replace(/[^a-z0-9_.]+/g, '_') || 'model';
		}
	}
	if (plan.projectSize) {
		Project.texture_width = plan.projectSize[0];
		Project.texture_height = plan.projectSize[1];
	}

	// One texture per project, as GeckoLib and Bedrock require.
	// Redrawing is not only for the atlas: Blockbench stores textures as PNG, and
	// a Sketchfab JPEG must first go through a canvas, or it lands in the project
	// labelled png and fails to open.
	const needRedraw = needAtlas || (images[0].mime && images[0].mime !== 'image/png');
	const firstURL = 'data:' + (images[0].mime || 'image/png') + ';base64,' + bytesToBase64(images[0].bytes);
	const atlasURL = () => (needRedraw ? buildAtlasDataURL(images, layout, sheetList) : Promise.resolve(firstURL));
	// Beside an existing texture, or on a sheet sized to keep the UV of cubes
	// already in the project, the atlas is drawn into a bigger picture.
	const besides = texKind === 'beside';
	const beside = () => atlasURL().then(url => url && composeBeside(baseTexture, plan, oldSize, [size.width, size.height], url));
	let atlasTexture = baseTexture;
	let texReady;
	const filled = tex => url => {
		if (url) tex.fromDataURL(url);
		else if (besides) {
			Blockbench.showMessageBox({ title: 'Texture not drawn', message: 'The model\'s texture could not be drawn '
				+ 'beside the project\'s, so its cubes show the wrong pixels. Ctrl+Z takes the import back.' });
		}
		Canvas.updateAll();
	};
	if (atlasTexture) {
		texReady = beside().then(filled(atlasTexture));
	} else {
		atlasTexture = new Texture({
			name: adding ? nameSlug(sourceName) + '.png'
				: needAtlas ? 'atlas.png' : (images[0].name || 'texture.png').replace(/\.[^.]*$/, '.png'),
		});
		// Generic models measure UV against each texture's own size rather than the
		// project's. The constructor copies the project's size, set just above; it is
		// written out anyway, so the UV never depend on when the atlas finishes drawing.
		atlasTexture.uv_width = plan.uvSize[0];
		atlasTexture.uv_height = plan.uvSize[1];
		if (needRedraw || besides) {
			atlasTexture.add();
			// the content is filled in once the images decode
			texReady = (besides ? beside() : buildAtlasDataURL(images, layout, sheetList)).then(filled(atlasTexture));
		} else {
			atlasTexture.fromDataURL(firstURL).add();
			texReady = Promise.resolve();
		}
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
		if (obj.bad && rebuilt) continue;
		const sol = solveBox(obj.faces);
		if (!sol.error) { solved.push({ obj, sol }); continue; }
		if (badMode !== 'box') continue;
		const approx = boxFromBounds(obj.faces);
		if (approx) { solved.push({ obj, sol: approx }); approximated++; }
	}
	// The rebuilt pieces, as cubes: the faces of each, with the UV of its sheets,
	// go through the same solver as the file's own boxes.
	let unsolved = 0;
	if (rebuilt) {
		for (const pc of rebuilt.pieces) {
			const sol = solveBox(pieceFaces(pc, sheetRect));
			if (sol.error) { unsolved++; continue; }
			solved.push({ obj: rebuilt.objects[pc.part], sol, piece: pc });
		}
	}

	if (rebuilt) {
		const st = rebuilt.stats;
		const T = rebuilt.texel;
		report.push(`Rebuilt, ${rebuildMode === 'best' ? 'best quality' : 'fast'}: ${st.parts} parts → `
			+ `${st.plates} plates` + (st.strips ? `, ${st.strips} edge strips` : '')
			+ (st.boxes ? `, ${st.boxes} whole boxes` : '')
			+ `; texel ${T >= 1 ? T : '1/' + Math.round(1 / T)} px; ${rebuilt.seconds.toFixed(1)} s`);
		if (st.hurried) {
			report.push('  finished early: ' + (rebuildMode === 'best' ? 'the parts left got no strips, and ' : '')
				+ 'cubes nobody sees were kept');
		} else if (st.culled) {
			report.push(`  pieces nobody sees, left out: ${st.culled} — looked at from 114 directions; `
				+ 'what an animation could reveal stays, and so does every cube of the file itself');
		}
		if (unsolved) report.push(`  pieces that could not be made into cubes: ${unsolved}`);
		// A plate cuts its outline out of a rectangle with clear texels, and a
		// renderer that blends or ignores alpha shows the rectangle instead.
		const cut = {
			geckolib_model: 'GeckoLib draws it that way by default',
			bedrock: 'the entity needs the entity_alphatest material',
			java_block: 'a block needs a cutout render type; items have it',
			free: 'keep the texture\'s transparency wherever the model goes',
		}[target.id];
		report.push(`  the plates are cut out by clear texels, so they need cutout transparency${cut ? ': ' + cut : ''}`);
	}

	// The approximation share is the only honest measure of result quality.
	// Without it the import succeeded even on models that turned out to be almost
	// entirely wedges and bevels: the project opened, looked like mush, and there
	// was no way to tell why. Better to say plainly that the model does not fit.
	const approxShare = solved.length ? Math.round(100 * approximated / solved.length) : 0;
	if (approximated) {
		report.push(`Approximated with a bounding box: ${approximated} of ${solved.length} (${approxShare}%)`);
		report.push(approxShare >= 30
			? '  WARNING: this model is mostly NOT cube-based — wedges, bevels, rounded shapes. '
				+ 'Such objects lose their shape, so the result is only approximate.'
			: '  Approximated objects lost their shape, but their texture is laid out per face.');
	}

	// Cubes that landed in one plane are separated in depth via inflate:
	// otherwise the GPU cannot decide which face is nearer and the model
	// flickers. Coordinates stay clean throughout.
	const wantZFight = !opts || opts.zfight !== false;
	// Strips stay out of it: flat, with no volume to order them by, they would take
	// a neighbour's layer. Each lies just above its own plate instead, one step
	// further out than the one before it — lifted, not inflated, since inflating
	// would also widen it past its edge.
	const isStrip = s => !!s.piece && s.piece.kind === 'strip';
	const layered = solved.filter(s => !isStrip(s));
	const coplanar = wantZFight
		? resolveCoplanar(layered.map(s => s.sol))
		: { inflate: layered.map(() => 0), pairs: 0, capped: 0, skipped: 0 };
	layered.forEach((s, i) => { s.inflate = coplanar.inflate[i] || 0; });
	if (rebuilt) {
		const byPiece = new Map(solved.filter(s => s.piece).map(s => [s.piece, s]));
		for (const s of solved) {
			if (!isStrip(s)) continue;
			const owner = byPiece.get(s.piece.owner);
			const lift = (owner ? owner.inflate : 0) + ROUND.LIFT * s.piece.step;
			s.sol = { ...s.sol, center: add(s.sol.center, mul(s.piece.owner.box.axes[0], lift)) };
		}
	}
	coplanar.inflate = solved.map(s => s.inflate || 0);
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

	// A Java model has a box to stay in. Fitted after the coplanar pass, because
	// inflate counts towards the box, and before anything is created, so cubes and
	// bones are moved by one and the same transform.
	let pivots = parsed.hierarchy.map(h => h.pivot);
	if (target.still) {
		// An added model stays where it was put, and is only pushed back inside.
		const fit = fitJavaBox(solved.map((s, i) => ({
			center: s.sol.center, size: s.sol.size, inflate: coplanar.inflate[i],
		})), !adding && !!(opts && opts.recenter));
		for (let si = 0; si < solved.length; si++) {
			const sol = solved[si].sol;
			solved[si] = { ...solved[si], sol: { ...sol, center: applyFit(sol.center, fit), size: sol.size.map(v => v * fit.k) } };
			coplanar.inflate[si] *= fit.k;
		}
		pivots = pivots.map(p => applyFit(p, fit));
		if (fit.shift.some(v => Math.abs(v) > 1e-6)) {
			report.push(`Placed in the Java model box: moved by [${fit.shift.map(v => +v.toFixed(2)).join(', ')}] px`);
		}
		if (fit.k < 1) {
			report.push(`Shrunk ×${fit.k.toFixed(3)} to fit: the model spans ${fit.extent.toFixed(1)} px, `
				+ `and a Java model may span ${JAVA_BOX[1] - JAVA_BOX[0]} (from ${JAVA_BOX[0]} to ${JAVA_BOX[1]})`);
		}
	}

	// Folders. The pass-through ones go (see tidyHierarchy) unless the user asked
	// for the file's hierarchy as it is. A node counts as animated only when its
	// animation is actually carried over: a still Java model, or animations
	// switched off, leave nothing that needs its folder.
	const animatedNodes = new Set();
	if (!target.still && !(opts && opts.animations === false)) {
		for (const a of parsed.animations) for (const ch of a.channels) animatedNodes.add(ch.node);
	}
	// GeckoLib and Bedrock tell bones apart by name, so an added model's folders
	// must not take one the project already has.
	const taken = adding ? namesIn(Group.all) : new Set();
	const tidy = opts && opts.keep_hierarchy
		? null
		: tidyHierarchy(parsed.hierarchy, solved.map(s => s.obj.node), animatedNodes, taken);
	if (tidy && tidy.removed) {
		report.push(`Folders: ${tidy.kept.length} of ${parsed.hierarchy.length} kept — the rest held one thing `
			+ 'or nothing and no animation' + (tidy.stripped ? "; the exporter's _N numbering stripped" : ''));
	}
	if (tidy) for (const n of tidy.name.values()) taken.add(n);

	// An added model arrives as one folder, to be moved, hidden or deleted whole:
	// its own top folder when it has exactly one and nothing loose beside it, or
	// else a new one named after the model, standing on the attach point.
	const inHierarchy = new Set(parsed.hierarchy.map(h => h.index));
	const folderOf = n => (tidy ? tidy.home(n) : inHierarchy.has(n) ? n : -1);
	const parentOf = h => (tidy ? tidy.parent.get(h.index) : h.parent);
	const tops = parsed.hierarchy.filter(h => (!tidy || tidy.name.has(h.index)) && !(parentOf(h) >= 0));
	let holder = null;
	if (adding && (tops.length !== 1 || solved.some(s => folderOf(s.obj.node) < 0))) {
		const name = uniqueName(nameSlug(sourceName), taken);
		taken.add(name);
		holder = new Group({ name, origin: host.point.slice() }).init();
		if (host.group) holder.addTo(host.group);
	}
	const topParent = holder || (host && host.group) || null;

	// bones: the hierarchy is walked in order, a parent always before its child
	const groupByNode = {};
	parsed.hierarchy.forEach((h, i) => {
		if (tidy && !tidy.name.has(h.index)) return;
		let name = tidy ? tidy.name.get(h.index) : h.name;
		if (adding && !tidy) { name = uniqueName(name, taken); taken.add(name); }
		const g = new Group({ name, origin: snapVec(pivots[i]) }).init();
		const p = parentOf(h);
		if (p >= 0 && groupByNode[p]) g.addTo(groupByNode[p]);
		else if (topParent) g.addTo(topParent);
		groupByNode[h.index] = g;
	});
	const groupCount = Object.keys(groupByNode).length + (holder ? 1 : 0);

	let hidden = 0, mirrored = 0, untextured = 0;
	const cubes = [];
	const piecesMade = new Map();
	for (let si = 0; si < solved.length; si++) {
		const { obj, sol, piece } = solved[si];
		if (obj.image < 0 && !piece) untextured++;
		let name = tidy
			? tidy.cubeName(obj.node, obj.baseName || obj.name) + (obj.part ? `_${obj.part}` : '')
			: obj.name;
		// a rebuilt part becomes several cubes, numbered after it
		if (piece) {
			const k = (piecesMade.get(obj) || 0) + 1;
			piecesMade.set(obj, k);
			name += `_${k}`;
		}
		const cube = cubeFromSolution(name, sol, atlasTexture.uuid, coplanar.inflate[si]);
		const parent = groupByNode[folderOf(obj.node)] || topParent;
		if (parent) cube.addTo(parent);
		cube.init();
		cubes.push(cube);
		// a plate has four sides of no size and a mirrored back by nature
		if (!piece) {
			hidden += sol.emptyFaces.length;
			mirrored += sol.mirrored ? 1 : 0;
		}
	}

	// Which Minecraft can show the cubes as turned. Blockbench keys its Java
	// rotation rules to the project's format version, and a new project takes the
	// version from the user's settings — which may be too old for the model.
	if (target.still) {
		const need = javaFormatFor(cubes.map(c => c.rotation || [0, 0, 0]));
		const had = Project.java_block_version;
		if (had !== undefined && versionBelow(had, need.version)) {
			Project.java_block_version = need.version;
			report.push(`Java model format raised from ${had} to ${need.version}: the cubes need it`);
		}
		report.push(need.version === '1.9.0'
			? 'Minecraft Java version: any'
			: `Needs Minecraft Java ${need.version} or newer: `
				+ (need.counts[2] ? `${need.counts[2]} cubes turned on several axes or past 45°` : '')
				+ (need.counts[2] && need.counts[1] ? ', ' : '')
				+ (need.counts[1] ? `${need.counts[1]} cubes turned off the 22.5° steps` : ''));
		// Read after the version is raised: in Blockbench 5 these follow it, while
		// older builds keep one axis and 22.5° steps whatever the version says.
		const snapped = (Format.rotation_limit ? need.counts[2] : 0) + (Format.rotation_snap ? need.counts[1] : 0);
		if (snapped) {
			report.push(`WARNING: this Blockbench cannot write the rotation of ${snapped} cubes into a `
				+ 'Java model, so they will be snapped on export. Blockbench 5 keeps them as they are.');
		}
	}

	// How the texture came out: its own size, or where it went in the project's.
	const sizeText = `${size.width}×${size.height}`;
	const uvText = s => `${s[0]}×${s[1]}`;
	const place = adding && host.group ? `the folder “${host.group.name}”` : 'the top level';
	let texLine = `Texture: ${sizeText}`, texShort = sizeText;
	if (adding && texKind === 'beside') {
		const k = baseTexture ? baseTexture.width / oldSize[0] : 1;
		texLine = `Texture: the model's ${sizeText} drawn beside the project's at [${plan.offset.join(', ')}]; `
			+ `the UV size grew from ${uvText(oldSize)} to ${uvText(plan.uvSize)}, the UV already made kept`
			+ (k !== 1 ? `; drawn ×${+k.toFixed(3)} to match the project texture's resolution` : '')
			+ (baseTexture && baseTexture.path ? '. The project texture now differs from its file: save the texture to write it' : '');
		texShort = `${uvText(plan.uvSize)}, was ${uvText(oldSize)}`;
	} else if (adding && texKind !== 'fresh') {
		texLine = `Texture: ${sizeText}, added as a texture of its own`
			+ (texKind === 'shared' ? `; its UV fitted to the project's UV size, ${uvText(oldSize)}` : '');
		texShort = `${sizeText}, added`;
	}

	const lines = [
		`Imported from: ${sourceName}`,
		adding ? `Added to: the open ${target.name} project, into ${place}` : `Built into: ${target.name}`,
		// facts gathered before the project existed (scale, textures)
		...report,
		`Cubes created: ${solved.length}`,
		`Bones created: ${groupCount}`,
		texLine,
		`Objects without a material: ${untextured}`,
		`Faces hidden: ${hidden}`,
		`Mirrored cubes: ${mirrored}`,
	];
	// An added model's animations carry its name in front, so they neither take
	// nor hide an animation the project already has.
	let animOpts = opts;
	if (adding) {
		const used = namesIn(Animation.all);
		const renamed = new Map();
		for (const a of parsed.animations) {
			const n = uniqueName(`${nameSlug(sourceName)}.${a.name}`, used);
			used.add(n);
			renamed.set(a.name, n);
		}
		animOpts = { ...opts, animName: n => renamed.get(n) || n };
	}
	// A failure in animations must not bring down the whole import: cubes and
	// texture are already built, and losing them over animations makes no sense.
	if (target.still) {
		if (parsed.animations.length) {
			lines.push(`Animations left out: ${parsed.animations.length} — Java block and item models do not animate`);
		}
	} else {
		try {
			applyAnimations(parsed, groupByNode, lines, animOpts);
		} catch (e) {
			console.error('[gltf-to-minecraft] animation transfer failed', e);
			lines.push('', `ANIMATIONS WERE NOT TRANSFERRED: ${(e && e.message) || e}`,
				'The model and texture were still built correctly.');
		}
	}
	if (parsed.warnings.length) lines.push('', 'Warnings:', ...parsed.warnings.slice(0, 8));
	lines.push('', calibration);

	Canvas.updateAll();
	if (adding) {
		// Selected, so it can be moved into place right away.
		const handle = holder || (tops.length && groupByNode[tops[0].index]);
		try { if (handle && handle.select) handle.select(); } catch (e) { /* only a convenience */ }
		const added = Animation.all.filter(a => !animsBefore.has(a));
		const finish = () => {
			try {
				Undo.finishEdit('Import glTF model', {
					elements: cubes, outliner: true, textures: [atlasTexture], bitmap: true,
					uv_mode: true, animations: added, selection: true,
				});
			} catch (e) {
				console.error('[gltf-to-minecraft] the import could not be recorded for undo', e);
			}
		};
		texReady.then(finish, finish);
	}
	console.log('[gltf-to-minecraft] import\n' + lines.join('\n'));
	// Everything worked out along the way is handed back: the CPM branch needs the
	// very same hierarchy, boxes and texture, and re-deriving them would mean a
	// second copy of the scale and atlas logic that could drift from this one.
	lastImport = {
		parsed, solved, images, layout, size, chosenScale, sourceName,
		texture: atlasTexture,
		needAtlas,
		// the CPM dialog and file name bones and cubes the way the outliner does
		tidy,
		rebuilt,
		// the baked sheets, for anything that draws the atlas again
		sheets: sheetList,
	};
	showImportReport({
		title: 'Import finished',
		summary: [
			['Format', target.name],
		].concat(adding ? [['Added to', place.replace(/^the /, '')]] : [], [
			['Cubes', String(solved.length)],
			['Bones', String(groupCount)],
			['Texture', texShort],
			['Animations', target.still ? 'none, the model is still'
				: opts && opts.animations === false && parsed.animations.length ? `${parsed.animations.length}, left out`
					: String(parsed.animations.length)],
			['Scale', `×${chosenScale}`],
		], approximated
			? [['Approximated', `${approximated} of ${solved.length} (${approxShare}%)`]]
			: [], rebuilt
			? [['Rebuilt', `${rebuilt.stats.parts} parts → ${rebuilt.pieces.length - unsolved} cubes (${rebuildMode === 'best' ? 'best quality' : 'fast'})`]]
			: []),
		warning: [
			approxShare >= 30 ? 'This model is mostly not cube-based: wedges and bevels became boxes, so shape was lost.' : null,
			lostMaterials,
		].filter(Boolean),
		log: lines.join('\n'),
		name: (sourceName || 'model').replace(/\.[^.]*$/, ''),
	});
	return lastImport;
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
			+ [].concat(info.warning || []).map(w => `<div class="mtc_rep_warn">${esc(w)}</div>`).join('')
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

// ------------------------------------------------------- Sketchfab browser

const SKETCHFAB_TOKEN_KEY = PLUGIN_ID + '_sketchfab_token';

function sketchfabToken(value) {
	try {
		if (value !== undefined) localStorage.setItem(SKETCHFAB_TOKEN_KEY, value || '');
		return localStorage.getItem(SKETCHFAB_TOKEN_KEY) || '';
	} catch (e) {
		return '';
	}
}

/** Model search. No token needed — the endpoint is public. */
function sketchfabSearch(query, blockbenchOnly, animatedOnly, sort) {
	return sketchfabFetchPage(sketchfabSearchURL(query, blockbenchOnly, animatedOnly, sort));
}

/** The order last chosen in the search, kept between openings of the browser. */
const SKETCHFAB_SORT_KEY = PLUGIN_ID + '_sketchfab_sort';
function sketchfabSort(value) {
	try {
		if (value !== undefined) localStorage.setItem(SKETCHFAB_SORT_KEY, value);
		const saved = localStorage.getItem(SKETCHFAB_SORT_KEY) || '';
		return SKETCHFAB_SORTS.some(o => o.id === saved) ? saved : '';
	} catch (e) {
		return value || '';
	}
}

/** Loads a page of results. The `next` field already holds a ready URL. */
function sketchfabFetchPage(url) {
	return fetch(url).then(r => {
		if (!r.ok) throw new Error('search returned HTTP ' + r.status);
		return r.json();
	});
}

/** Browser styles: custom markup does not inherit Blockbench styling. */
let sketchfabCSS = null;
function addSketchfabStyles() {
	if (sketchfabCSS || typeof Blockbench.addCSS !== 'function') return;
	sketchfabCSS = Blockbench.addCSS(`
		.mtc_sf_bar { display: flex; gap: 6px; margin-bottom: 8px; }
		.mtc_sf_bar input[type="text"] { flex: 1 1 auto; min-width: 90px; width: 0; }
		.mtc_sf_bar > button, .mtc_sf_bar > label { flex: none; }
		/* sized to its longest option: squeezed by the flex row it read "Most l" */
		.mtc_sf_sort { display: flex; flex: none; }
		.mtc_sf_sort .bb-select { width: auto; min-width: 116px; margin: 0; }
		.mtc_sf_sort select { width: auto; }
		.mtc_sf_only { display: flex; align-items: center; gap: 4px; white-space: nowrap; cursor: pointer; }
		.mtc_sf_status { margin: 4px 0; opacity: 0.8; min-height: 18px; }
		.mtc_sf_results { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			gap: 8px; max-height: 380px; overflow-y: auto; }
		.mtc_sf_card { border: 1px solid var(--color-border); border-radius: 4px;
			padding: 4px; cursor: pointer; font-size: 11px; position: relative; }
		.mtc_sf_look { position: absolute; top: 8px; right: 8px; min-width: 0; height: 28px; padding: 0 4px;
			display: flex; align-items: center; background: rgba(0, 0, 0, 0.55); color: #fff;
			border: none; border-radius: 4px; cursor: pointer; }
		.mtc_sf_look:hover { background: var(--color-accent); }
		.mtc_sf_look i { font-size: 20px; }
		.mtc_sf_preview { display: flex; flex-direction: column; gap: 6px; }
		.mtc_sf_pbar { display: flex; gap: 6px; align-items: center; }
		.mtc_sf_ptitle { flex: 1; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
		.mtc_sf_preview iframe { width: 100%; height: 380px; border: none; border-radius: 4px;
			background: var(--color-back); }
		.mtc_sf_card:hover { background-color: var(--color-selected); }
		.mtc_sf_card.mtc_sf_busy { opacity: 0.5; cursor: progress; }
		.mtc_sf_card img { width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 2px;
			background: var(--color-back); }
		.mtc_sf_more { display: flex; align-items: center; justify-content: center;
			min-height: 90px; font-weight: bold; }
		.mtc_sf_name { font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
		.mtc_sf_meta { opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
		.mtc_sf_stats { display: flex; gap: 10px; }
		.mtc_sf_stats span { display: inline-flex; align-items: center; gap: 2px; }
		.mtc_sf_stats i { font-size: 14px; }
		.mtc_sf_stats .mtc_sf_none { opacity: 0.45; }
		.mtc_sf_stats .mtc_sf_warn { color: var(--color-warning, #e8a33d); }
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
		width: 800,
		lines: [
			'<div class="mtc_sf_bar">'
			+ '<input type="text" class="dark_bordered mtc_sf_query" placeholder="search for, e.g.: dwarf house">'
			// On by default: a model made in Blockbench is cubes already and comes
			// through whole, while most of Sketchfab is sculpts that cannot.
			+ '<label class="mtc_sf_only" title="Only models tagged “blockbench”: mostly built from '
			+ 'cubes. The icon on each card tells which ones look it">'
			+ '<input type="checkbox" class="mtc_sf_bb" checked> Made in Blockbench</label>'
			+ '<label class="mtc_sf_only" title="Only models with at least one animation">'
			+ '<input type="checkbox" class="mtc_sf_anim"> Animated</label>'
			// the order's drop-down is put in here once the dialog exists
			+ '<span class="mtc_sf_sort" title="Order of the results. Sketchfab has no order by downloads"></span>'
			+ '<button class="mtc_sf_find">Search</button>'
			+ '<button class="mtc_sf_token">Token…</button>'
			+ '</div>'
			+ '<div class="mtc_sf_status"></div>'
			+ '<div class="mtc_sf_results"></div>'
			// A model looked at in Sketchfab's own viewer, in place of the results.
			+ '<div class="mtc_sf_preview" style="display: none">'
			+ '<div class="mtc_sf_pbar">'
			+ '<button class="mtc_sf_back"><i class="material-icons">arrow_back</i> Results</button>'
			+ '<span class="mtc_sf_ptitle"></span>'
			+ '<button class="mtc_sf_page">Open on Sketchfab</button>'
			+ '<button class="mtc_sf_pimport">Import</button>'
			+ '</div>'
			+ '<div class="mtc_sf_frame"></div>'
			+ '</div>',
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

	// One download at a time. A second click on a card still downloading started
	// a second download, and every finished one opened an import dialog of its
	// own, so the format could not be changed without another dialog popping up
	// on top. A different card clicked meanwhile would do the same, and worse:
	// its dialog would appear after the browser had already closed.
	let busy = null;
	const importModel = (model, card) => {
		if (busy) {
			say(busy.uid === model.uid
				? `still downloading ${model.name}…`
				: `wait for ${busy.name} to finish downloading`);
			return;
		}
		busy = model;
		if (card) card.classList.add('mtc_sf_busy');
		const release = () => {
			busy = null;
			if (card) card.classList.remove('mtc_sf_busy');
		};
		// No format check before the download any more: the format is chosen in the
		// dialog that follows, and three of the four come with Blockbench. If the
		// one chosen is missing, that dialog stays open with the download in hand.
		say('preparing ' + model.name + '…');
		sketchfabDownload(model.uid, sketchfabToken(), say)
			.then(({ entries, original }) => {
				release();
				say('unpacked, asking for settings…');
				dialog.hide();
				askImportOptions(opts => {
					// attribution is always printed, even without a license.txt in the archive
					console.log('[gltf-to-minecraft] Sketchfab: «' + model.name + '» — '
						+ ((model.user && model.user.displayName) || '?') + ', '
						+ ((model.license && model.license.label) || 'licence not stated')
						+ (original ? ', the author\'s original' : ''));
					const settings = original ? Object.assign({}, opts, { original: true }) : opts;
					return buildFromFiles(entries, model.name || 'sketchfab', settings).catch(e => {
						console.error('[gltf-to-minecraft] import failed', e);
						Blockbench.showMessageBox({ title: 'Import failed', message: String((e && e.message) || e) });
					});
				});
			})
			.catch(e => { release(); say('failed: ' + ((e && e.message) || e)); });
	};

	// Looking before downloading: Sketchfab's own viewer, turned and played right
	// here in place of the results. A click on a card still imports at once; the
	// 3D button on its picture opens this instead.
	const preview = root.querySelector('.mtc_sf_preview');
	const frame = root.querySelector('.mtc_sf_frame');
	let previewed = null;
	// what the status said over the results, to say again on the way back
	let statusBefore = '';
	const closePreview = () => {
		if (!previewed) return;
		previewed = null;
		say(statusBefore);
		// the viewer goes with its frame, so a closed preview stops drawing
		if (frame) frame.innerHTML = '';
		if (preview) preview.style.display = 'none';
		if (results) results.style.display = '';
	};
	const openPreview = (model, card) => {
		const src = sketchfabEmbedURL(model.uid);
		if (!src || !preview || !frame || !results) return;
		closePreview();
		statusBefore = status ? status.textContent : '';
		previewed = { model, card };
		results.style.display = 'none';
		preview.style.display = '';
		const title = root.querySelector('.mtc_sf_ptitle');
		if (title) title.textContent = (model.name || '') + (model.user && model.user.displayName ? ' — ' + model.user.displayName : '');
		const iframe = document.createElement('iframe');
		iframe.setAttribute('allow', 'autoplay; fullscreen; xr-spatial-tracking');
		iframe.setAttribute('allowfullscreen', '');
		iframe.src = src;
		frame.appendChild(iframe);
		say((model.license && model.license.label ? 'licence: ' + model.license.label + ' · ' : '')
			+ 'drag to turn it; Import downloads it');
	};
	const onClick = (selector, fn) => {
		const el = root.querySelector(selector);
		if (el) el.addEventListener('click', fn);
	};
	onClick('.mtc_sf_back', closePreview);
	onClick('.mtc_sf_page', () => {
		const url = previewed && sketchfabPageURL(previewed.model);
		if (!url) return;
		if (Blockbench.openLink) Blockbench.openLink(url); else window.open(url);
	});
	onClick('.mtc_sf_pimport', () => { if (previewed) importModel(previewed.model, previewed.card); });

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
			const likes = Number(m.likeCount) || 0;
			card.title = (m.name || '') + NL + 'Author: ' + ((m.user && m.user.displayName) || '?')
				+ NL + 'Licence: ' + ((m.license && m.license.label) || '?')
				+ NL + `Likes: ${likes}, views: ${Number(m.viewCount) || 0}`
				+ (m.publishedAt ? NL + 'Published: ' + String(m.publishedAt).slice(0, 10) : '');
			const kb = m.archives && m.archives.gltf ? Math.round(m.archives.gltf.size / 1024) : null;
			// Triangles and animations as icons with a number, the meaning in the
			// tooltip: both come with the search results, and both say more about
			// whether a model will come through than its picture does.
			const tris = Number(m.faceCount) || 0;
			const anims = Number(m.animationCount) || 0;
			// The "blockbench" tag is set by hand as often as by Blockbench's own
			// upload, and Blockbench makes meshes too, so the counts are the better
			// sign of what will convert — see cubeHint.
			const hint = cubeHint(m.faceCount, m.vertexCount);
			const count = n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : String(n);
			card.innerHTML =
				(thumb ? '<img src="' + thumb.url + '">' : '<img>')
				+ (sketchfabEmbedURL(m.uid)
					? '<button class="mtc_sf_look" title="Look at it in 3D before downloading">'
						+ '<i class="material-icons">3d_rotation</i></button>'
					: '')
				+ '<div class="mtc_sf_name"></div>'
				+ '<div class="mtc_sf_meta mtc_sf_author"></div>'
				+ '<div class="mtc_sf_meta mtc_sf_lic"></div>'
				+ '<div class="mtc_sf_meta mtc_sf_stats">'
				+ `<span title="Triangles: ${tris}"><i class="material-icons">change_history</i>${count(tris)}</span>`
				+ `<span title="Animations: ${anims}"${anims ? '' : ' class="mtc_sf_none"'}>`
				+ `<i class="material-icons">animation</i>${anims}</span>`
				+ `<span title="Likes: ${likes}"${likes ? '' : ' class="mtc_sf_none"'}>`
				+ `<i class="material-icons">favorite</i>${count(likes)}</span>`
				+ (hint === 'cubes'
					? '<span title="Built from separate cubes: it should convert whole">'
						+ '<i class="material-icons">view_in_ar</i></span>'
					: hint === 'shapes'
						? '<span class="mtc_sf_warn" title="Corners are shared, so this is probably not built '
							+ 'from cubes: slopes and curves will turn into boxes">'
							+ '<i class="material-icons">warning</i></span>'
						: '')
				+ '</div>';
			// text goes through textContent: model names sometimes contain markup
			card.querySelector('.mtc_sf_name').textContent = m.name || '(unnamed)';
			card.querySelector('.mtc_sf_author').textContent = (m.user && m.user.displayName) || '';
			card.querySelector('.mtc_sf_lic').textContent =
				((m.license && m.license.label) || '') + (kb ? ' · ' + (kb > 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb + ' KB') : '');
			card.addEventListener('click', () => importModel(m, card));
			const look = card.querySelector('.mtc_sf_look');
			if (look) look.addEventListener('click', e => { e.stopPropagation(); openPreview(m, card); });
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

	const onlyBB = root.querySelector('.mtc_sf_bb');
	const onlyAnimated = root.querySelector('.mtc_sf_anim');
	let sort = sketchfabSort();
	let searched = false;
	const doSearch = () => {
		searched = true;
		closePreview();
		say('searching…');
		sketchfabSearch(q ? q.value : '', !onlyBB || onlyBB.checked, !!onlyAnimated && onlyAnimated.checked, sort)
			.then(render).catch(e => say('search error: ' + ((e && e.message) || e)));
	};

	// The order, as Blockbench's own drop-down: the one its dialogs use, opening
	// its own menu. A plain <select> opened the system's list, which looked like
	// nothing else in Blockbench. A build without it gets the plain one still.
	const sortSlot = root.querySelector('.mtc_sf_sort');
	const pickSort = value => {
		sort = SKETCHFAB_SORTS.some(o => o.id === value) ? value : '';
		sketchfabSort(sort);
		if (searched) doSearch();
	};
	if (sortSlot) {
		// the empty id of Relevance would read as "nothing chosen" to the drop-down
		const keyOf = id => id || 'relevance';
		let node = null;
		try {
			const options = {};
			for (const o of SKETCHFAB_SORTS) options[keyOf(o.id)] = o.label;
			node = new Interface.CustomElements.SelectInput(PLUGIN_ID + '_sf_sort', {
				options, value: keyOf(sort),
				onChange: key => pickSort(key === 'relevance' ? '' : key),
			}).node;
		} catch (e) {
			node = document.createElement('select');
			node.className = 'dark_bordered';
			for (const o of SKETCHFAB_SORTS) node.add(new Option(o.label, o.id, false, o.id === sort));
			node.addEventListener('change', () => pickSort(node.value));
		}
		sortSlot.appendChild(node);
	}

	if (root.querySelector('.mtc_sf_find')) root.querySelector('.mtc_sf_find').addEventListener('click', doSearch);
	// Flipping the filter over results already on screen redoes the search:
	// otherwise the grid would keep showing what the box no longer says.
	if (onlyBB) onlyBB.addEventListener('change', () => { if (searched) doSearch(); });
	if (onlyAnimated) onlyAnimated.addEventListener('change', () => { if (searched) doSearch(); });
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
 * The formats a model can be built into.
 *
 * The conversion owes nothing to GeckoLib: cubes turned freely, per-face UV,
 * bones and keyframes are what Bedrock entities and Generic models take as well,
 * and the UV convention is measured on whichever project is open. Java block and
 * item models take the cubes too, but have no bones and do not animate, so they
 * get a still model fitted into their box.
 *
 * Modded Entity and OptiFine are left out: both demand box UV or whole-pixel
 * sizes, and neither can turn a cube on its own.
 */
const TARGETS = [
	{ id: 'geckolib_model', name: 'GeckoLib',
		about: 'An animated model for Java mods that use GeckoLib.' },
	{ id: 'bedrock', name: 'Bedrock Entity',
		about: 'An animated entity model for Bedrock add-ons. Comes with Blockbench.' },
	{ id: 'free', name: 'Generic Model',
		about: 'Keeps bones and animations, and goes further from here: File → Convert Project, '
			+ 'or an export to glTF or OBJ. Comes with Blockbench.' },
	{ id: 'java_block', name: 'Java Block/Item', still: true,
		about: 'Java block and item models have no bones and do not animate: the model arrives '
			+ 'still. It has to fit the box such a model may take up, from −16 to 32 on each '
			+ 'axis, so it is moved into it, and shrunk only if it is larger. With centring on, '
			+ 'it stands on the block the way block models do.' },
];
const TARGET_KEY = PLUGIN_ID + '_target';

function targetById(id) {
	return TARGETS.find(t => t.id === id) || TARGETS[0];
}

/**
 * The last format chosen, as long as it can still be built; otherwise GeckoLib
 * where it is installed, and Bedrock, which ships with Blockbench, where it is not.
 */
function defaultTarget() {
	let saved = null;
	try { saved = localStorage.getItem(TARGET_KEY); } catch (e) { /* storage may be off */ }
	if (saved && TARGETS.some(t => t.id === saved) && (saved !== 'geckolib_model' || geckolibAvailable())) return saved;
	return geckolibAvailable() ? 'geckolib_model' : 'bedrock';
}

/**
 * What adding to the open project will do, said in the dialog before it is done:
 * where the model goes, and what becomes of its texture.
 */
function describeAdding(target) {
	const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
	const host = attachPoint();
	const where = host.group
		? `Goes into the selected folder “${esc(host.group.name)}”, standing on its pivot.`
		: 'Goes to the top level. To put it in a folder, a hand for instance, select that folder before importing.';
	let texture = 'Its texture is added as a texture of its own.';
	try {
		const empty = !Texture.all.length && !((typeof Outliner !== 'undefined' && Outliner.elements) || []).length;
		if (!empty && Format.single_texture) {
			texture = `A ${target.name} model has one texture, so the model's is drawn beside it, `
				+ 'and the sheet grows to hold both. The UV already made stay as they are.';
		}
	} catch (e) { /* the general line stands */ }
	return `${where} ${texture} Ctrl+Z takes the whole import back.`;
}

/**
 * Asks for the import settings.
 *
 * Kept separate: the same dialog serves both the file import and downloads from
 * the Sketchfab browser. `fixedTarget` builds into that format without asking —
 * the CPM export needs a project only to measure on, and any format will do.
 */
function askImportOptions(onReady, fixedTarget) {
	// Visibility rule: advanced fields appear once the checkbox is ticked.
	const adv = form => !!form.advanced;
	// Adding to the open project is offered when one is open in a format the
	// import builds into, and never to the CPM export, which needs its own.
	const open = fixedTarget ? null : openProjectTarget();
	const adding = form => !!(open && form.add_to_open);
	// Java models do not animate, so the animation levers hide for them.
	const animated = form => (fixedTarget || (adding(form) ? open.id : form.target)) !== 'java_block';
	const advAnim = form => adv(form) && animated(form);
	// The rebuild's two ways show while the rebuild is what happens to such parts.
	const rebuilding = form => (form.bad_objects || 'rebuild') === 'rebuild';

	// GeckoLib is offered even when it is not installed, so the choice leads
	// somewhere: to the plugin that provides it.
	//
	// The list holds bare names and the explanation sits under it, one line for
	// whichever format is chosen: "GeckoLib: animated, for Java mods" did not fit
	// the width of a select and was cut off mid-word.
	const hasGeckolib = geckolibAvailable();
	const targetOptions = {};
	for (const t of TARGETS) {
		targetOptions[t.id] = t.id === 'geckolib_model' && !hasGeckolib ? 'GeckoLib (no plugin)' : t.name;
	}
	const targetFields = fixedTarget ? {} : {
		...(open ? {
			add_to_open: { label: 'Add to the open project', type: 'checkbox', value: false },
			about_open: { type: 'info', condition: adding, text: describeAdding(open) },
		} : {}),
		target: { label: 'Build into', type: 'select', default: defaultTarget(), options: targetOptions,
			condition: form => !adding(form) },
	};
	if (!fixedTarget) {
		for (const t of TARGETS) {
			targetFields['about_' + t.id] = {
				type: 'info', condition: form => !adding(form) && form.target === t.id,
				text: t.id === 'geckolib_model' && !hasGeckolib
					? 'The GeckoLib plugin is not installed. Choose this anyway and the import '
						+ 'will show which plugin to get and where.'
					: t.about,
			};
		}
	}

	new Dialog({
		id: PLUGIN_ID + '_import_dialog',
		title: 'Import glTF model',
		// Expanded by a checkbox: an ordinary user needs a few settings, the other
		// eight are levers for diagnosing breakage. Every field in a row reads like
		// a cockpit and gets in the way of anyone who just wants to open a model.
		form: {
			...targetFields,
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
			animations: { label: 'Transfer animations', type: 'checkbox', value: true,
				condition: form => animated(form) && !adding(form) },
			// Off when adding: the project has animations of its own, and a sword
			// rarely needs the ones it was shown off with on Sketchfab.
			add_animations: { label: 'Add its animations too', type: 'checkbox', value: false,
				condition: form => animated(form) && adding(form) },
			// Most models are cubes throughout and never reach this. For the ones with
			// bevels and rounded shapes it decides how they look, so it sits here and
			// not among the levers below; the wait each way costs is said under it.
			rounded: {
				label: 'Rounded parts', type: 'select', default: 'fast', condition: rebuilding,
				options: { fast: 'Fast', best: 'Best quality (slow)' },
			},
			about_rounded_fast: {
				type: 'info', condition: form => rebuilding(form) && form.rounded !== 'best',
				text: 'Parts that are not cubes (bevels, wedges, rounded shapes) are rebuilt from thin plates '
					+ 'that follow their surface, each cut to its outline by a baked texture. Slanted edges show '
					+ 'fine steps up close. Takes seconds on most models.',
			},
			about_rounded_best: {
				type: 'info', condition: form => rebuilding(form) && form.rounded === 'best',
				text: 'Also lays a thin strip along each sharp slanted edge, so edges come out straight. For when '
					+ 'the look matters more than the wait: 1.5 to 2 times the cubes, a somewhat larger texture, '
					+ 'and on big models an import of a minute or more. It can be finished early from its window.',
			},

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
				label: 'Objects that are not cubes', type: 'select', default: 'rebuild', condition: adv,
				options: {
					rebuild: 'Rebuild them (Rounded parts)',
					box: 'Approximate with a bounding box',
					skip: 'Skip them',
					abort: 'Cancel the import',
				},
			},
			positions: {
				label: 'Position channels in animations', type: 'select', default: 'big', condition: advAnim,
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
				value: 0, min: 0, max: 30, step: 0.1, condition: advAnim,
			},
			align_times: {
				label: 'Align keyframe times', type: 'checkbox', value: false, condition: advAnim,
			},
			zfight: {
				label: 'Separate coplanar faces (anti-flicker)', type: 'checkbox',
				value: true, condition: adv,
			},
			keep_hierarchy: {
				label: 'Keep every glTF node as a folder', type: 'checkbox',
				value: false, condition: adv,
			},
			anim_order: {
				label: 'Rotation formula', type: 'select', default: 'post', condition: advAnim,
				options: { post: 'R(t)·R0⁻¹ (default)', pre: 'R0⁻¹·R(t) (if animations drift apart)' },
			},
			hint: {
				type: 'info', condition: advAnim,
				text: 'The maths gives exactly two exact options: All — if Blockbench adds the offset '
					+ 'outside the rotation, and pre-compensated — if inside. '
					+ 'If bones drift apart in an animation, raise the position threshold to 2 px: '
					+ 'small offsets are then dropped, which is a known-good state.',
			},
		},
		onConfirm(form) {
			if (fixedTarget) {
				form.target = fixedTarget;
			} else if (adding(form)) {
				// The project's format, and the remembered choice left alone.
				form.target = open.id;
				form.animations = !!form.add_animations;
			} else {
				try { localStorage.setItem(TARGET_KEY, form.target); } catch (e) { /* only a convenience */ }
				// The dialog stays open behind the message, so another format can be
				// picked without choosing the files — or downloading them — again.
				if (form.target === 'geckolib_model' && !requireGeckolib()) return false;
			}
			this.hide();
			onReady(form);
		},
	}).show();
}

/**
 * Whether the GeckoLib format exists. That plugin installs separately, and it
 * is needed only when GeckoLib is the format chosen: the other formats come
 * with Blockbench, so the plugin always loads and the check sits at that choice.
 */
function geckolibAvailable() {
	return typeof Formats !== 'undefined' && !!Formats.geckolib_model;
}

/**
 * The two catalog plugins that provide the `geckolib_model` format. The first
 * stops at Blockbench 5.0 and the second starts there, so naming only the old
 * one sent Blockbench 5 users to a plugin that refuses to install.
 */
const GECKOLIB_PLUGINS = [
	{ id: 'geckolib', title: 'GeckoLib Models & Animations' },
	{ id: 'animation_utils', title: 'GeckoLib Animation Utils' },
];

/**
 * Which of them to send the user to. The catalog decides — the entry that says
 * it installs on this build — and the version only when the catalog has not
 * loaded (offline, or still on its way).
 */
function geckolibPlugin() {
	try {
		for (const g of GECKOLIB_PLUGINS) {
			const entry = Plugins.all.find(p => p.id === g.id);
			if (entry && entry.isInstallable() === true) return { id: g.id, title: g.title, entry };
		}
	} catch (e) { /* no catalog: decided by the version below */ }
	let older = false;
	try { older = Blockbench.isOlderThan('5.0.0'); } catch (e) { /* assume a current build */ }
	const g = GECKOLIB_PLUGINS[older ? 1 : 0];
	return { id: g.id, title: g.title, entry: null };
}

function requireGeckolib() {
	if (geckolibAvailable()) return true;
	const need = geckolibPlugin();
	const installed = need.entry && need.entry.installed;
	const advice = !installed
		? `Install <b>${need.title}</b> from File → Plugins and run the import again.`
		: need.entry.disabled
			? `<b>${need.title}</b> is installed but disabled: enable it in File → Plugins `
				+ 'and run the import again.'
			: `<b>${need.title}</b> is installed, but its format did not register: `
				+ 'check the plugin list for an error, or restart Blockbench.';
	new Dialog({
		id: PLUGIN_ID + '_need_geckolib',
		title: 'GeckoLib plugin required',
		buttons: ['Open plugin list', 'Cancel'],
		lines: [
			'<p>The <b>GeckoLib Animated Model</b> format comes from a separate plugin, '
			+ 'and it is not available right now.</p>'
			+ `<p style="opacity:0.75">${advice} Or pick another format in the import dialog: `
			+ 'the others come with Blockbench.</p>',
		],
		onConfirm() {
			this.hide();
			// Different builds open the plugin list differently, so both routes are
			// tried and neither failing is reported.
			try {
				if (typeof Plugins !== 'undefined' && Plugins.dialog) Plugins.dialog.show();
				else if (typeof BarItems !== 'undefined' && BarItems.plugins_window) BarItems.plugins_window.click();
			} catch (e) { /* not critical: the user can open it manually */ }
			// Blockbench 5 can open the list on the plugin's own page; older builds
			// have no such call and just show the list.
			try {
				const list = Plugins.dialog.content_vue;
				if (need.entry) list.selectPlugin(need.entry);
				if (need.entry) list.setTab(installed ? 'installed' : 'available');
			} catch (e) { /* the list is open either way */ }
		},
		onCancel() { this.hide(); },
	}).show();
	return false;
}

function importFromZip() {
	// No JSZip check here any more: it is only needed for an archive, and an
	// unpacked folder goes in without it. The check moved to where the archive
	// is actually opened. Nor a GeckoLib check: the format is chosen in the
	// dialog, and only that choice needs the plugin.
	askImportOptions(opts => pickAndImport(opts));
}

// ------------------------------------------------- CPM export from Blockbench

/**
 * Import a glTF archive and save it as a .cpmproject.
 *
 * The ordinary import runs first, in full. That is not a detour: the UV
 * convention is MEASURED from a live Blockbench (calibrateFaceDirs builds a
 * probe cube and reads its buffers), and without a project there is nothing to
 * measure it on — the fallback table would be used instead, which is exactly
 * the guessing that produced 180°-rotated textures once already.
 *
 * The side effect is welcome anyway: the project stays open, so the model can
 * be looked at and corrected before it goes into the game.
 */
function importCPMFromZip() {
	if (typeof JSZip === 'undefined') {
		Blockbench.showMessageBox({ title: 'JSZip missing', message: 'This Blockbench build has no JSZip, so archives cannot be unpacked.' });
		return;
	}
	// The project is built as a Generic model: it only has to exist for the
	// measurement, nothing in the CPM output depends on its format, and Generic
	// ships with every Blockbench. It used to be GeckoLib, which made the CPM
	// export demand a plugin it never used.
	askImportOptions(opts => pickAndImport(opts, built => {
		if (!built) return;
		askCPMOptions(built, form => saveCPMProject(built, form));
	}), 'free');
}

/**
 * The CPM dialog: how big the model should be, and which bone is which part of
 * the player.
 *
 * The size is its own setting and not the one the import ran at. CPM measures in
 * player pixels — 32 px tall — while a Sketchfab model arrives in whatever units
 * its author used, so one number cannot serve both formats.
 *
 * The mapping is offered rather than decided. A guess by name is filled in, and
 * on a model already rigged like a player it needs no corrections; on anything
 * else a silent guess would be worse than none.
 */
function askCPMOptions(built, onReady) {
	const hierarchy = built.parsed.hierarchy;
	const guess = cpmAutoAssign(hierarchy);
	const tidy = built.tidy;

	// Only the bones worth asking about: the ones the guess spoke for, plus the
	// top of the tree. Thirty-two selects would be a cockpit, and the rest of the
	// bones inherit their parent's part anyway.
	//
	// The top of the tree is the tidied one, as in the outliner. The file's own top
	// is the export wrapper, so a Sketchfab model used to be asked about
	// "Sketchfab_model" and "root" first.
	const parentOf = h => (tidy ? (tidy.parent.has(h.index) ? tidy.parent.get(h.index) : null) : h.parent);
	const roots = hierarchy.filter(h => parentOf(h) === -1).map(h => h.index);
	const candidates = hierarchy.filter(h => guess[h.index] || roots.includes(h.index)
		|| roots.includes(parentOf(h)));

	const options = { '': 'inherit from parent' };
	for (const p of CPM_PART_NAMES) options[p] = p.replace('_', ' ');

	let height = 0;
	{
		let lo = Infinity, hi = -Infinity;
		for (const s of built.solved) {
			const half = Math.abs(s.sol.size[1]) / 2;
			lo = Math.min(lo, s.sol.center[1] - half);
			hi = Math.max(hi, s.sol.center[1] + half);
		}
		height = hi - lo;
	}

	const form = {
		cpm_height: {
			label: 'Model height in player pixels', type: 'number',
			value: 32, min: 1, max: 512, step: 1,
		},
		height_hint: {
			type: 'info',
			text: `A player is 32 px tall. The imported model measures ${height.toFixed(1)} px, `
				+ 'so the height set here decides how much it is scaled by.',
		},
		map_hint: {
			type: 'info',
			text: 'Every bone below becomes a part of the player. A bone left on '
				+ '"inherit" goes wherever its parent went, so only the joints need answering.',
		},
	};
	for (const h of candidates) {
		form['b_' + h.index] = {
			label: tidy ? tidy.label(h.index) : h.name, type: 'select',
			default: guess[h.index] || '',
			options,
		};
	}
	form.fallback = {
		label: 'Everything not covered above', type: 'select', default: 'body', options: (() => {
			const o = {};
			for (const p of CPM_PART_NAMES) o[p] = p.replace('_', ' ');
			return o;
		})(),
	};
	form.align = {
		label: 'Line the rig up with the player skeleton', type: 'checkbox', value: true,
	};
	form.align_hint = {
		type: 'info',
		text: 'Moves the whole model so the bones mapped above sit on the vanilla pivots. '
			+ 'Without it a model built off-centre — one with a tail, say — looks right standing '
			+ 'still and tears apart as soon as an arm moves, because vanilla turns each limb '
			+ 'about its own pivot.',
	};

	// Animations. A vanilla pose replaces what the player does in that state; a
	// gesture waits to be played on demand. Gesture is the safe default, so
	// anything the guess does not recognise ends up harmless rather than
	// overriding walking.
	const anims = built.parsed.animations || [];
	if (anims.length) {
		const poseOptions = { gesture: 'gesture (played on demand)', skip: 'do not transfer' };
		for (const p of CPM_POSE_OPTIONS) poseOptions[p] = 'pose: ' + p.toLowerCase().replace(/_/g, ' ');
		form.anim_hint = {
			type: 'info',
			text: `The archive has ${anims.length} animations. A pose replaces vanilla motion in that `
				+ 'state; a gesture is played on demand and changes nothing by itself.',
		};
		form.anim_fps = {
			label: 'Animation sampling, frames per second', type: 'number',
			value: 12, min: 2, max: 30, step: 1,
		};
		form.stop_vanilla = {
			label: 'Switch vanilla motion off on the parts we animate', type: 'checkbox', value: false,
		};
		form.stop_vanilla_hint = {
			type: 'info',
			text: 'Off by default, and deliberately. It stops the vanilla arm swing from landing on '
				+ 'top of the model\'s own walk — but the flag is per BODY PART, not per pose, so in '
				+ 'any state you have no animation for (falling, on a ladder, swinging a sword) that '
				+ 'part simply freezes. Turn it on only once the poses you actually use are covered.',
		};
		form.head_camera = {
			label: 'Head keeps following the camera', type: 'checkbox', value: false,
		};
		form.head_camera_hint = {
			type: 'info',
			text: 'Leave this off when the model brings its own animations. In Minecraft the head is '
				+ 'not attached to the body, so an animation that lays the character flat has to carry '
				+ 'the head across by itself — and the camera look rotation, applied on top about the '
				+ 'neck, then swings that offset and the head sails off the body. Turn it on for a '
				+ 'model with no animations of its own, where nothing competes.',
		};
		for (let i = 0; i < anims.length; i++) {
			form['a_' + i] = {
				label: anims[i].name, type: 'select',
				default: cpmAutoPose(anims[i].name),
				options: poseOptions,
			};
		}
	}

	new Dialog({
		id: PLUGIN_ID + '_cpm_dialog',
		title: 'Export to Customizable Player Models',
		form,
		onConfirm(f) {
			this.hide();
			const assign = {};
			for (const h of candidates) {
				const v = f['b_' + h.index];
				if (v) assign[h.index] = v;
			}
			const poses = {};
			for (let i = 0; i < anims.length; i++) poses[anims[i].name] = f['a_' + i] || 'gesture';
			onReady({
				assign,
				fallback: f.fallback,
				scale: height > 0 ? Number(f.cpm_height) / height : 1,
				align: f.align !== false,
				stopVanilla: anims.length ? f.stop_vanilla === true : false,
				// With no animations of its own there is nothing to compete with the
				// camera, so the head may as well keep following it.
				headCamera: anims.length ? f.head_camera === true : true,
				poses,
				fps: Number(f.anim_fps) || 12,
			});
		},
	}).show();
}

/** Builds the archive and hands it to Blockbench to save. */
function saveCPMProject(built, form) {
	// Names as in the outliner: the author's, not the exporter's.
	const tidy = built.tidy;
	const cubes = built.solved.map((s, i) => ({
		name: tidy
			? tidy.cubeName(s.obj.node, s.obj.baseName || s.obj.name) + (s.obj.part ? `_${s.obj.part}` : '')
			: s.obj.name,
		node: s.obj.node,
		sol: s.sol,
		inflate: 0,
	}));
	// Nodes an animation moves keep their own element: collapsing one would leave
	// the animation nothing to turn.
	const animated = new Set();
	for (const a of built.parsed.animations) for (const ch of a.channels) animated.add(ch.node);

	const uv = cpmUVScale(cubes, 16, Math.max(built.size.width, built.size.height));
	const align = form.align === false
		? [0, 0, 0]
		: cpmAlignOffset(built.parsed.hierarchy, form.assign, form.scale);
	const stopVanillaAnim = {};
	if (form.stopVanilla) {
		for (const p of CPM_PART_NAMES) if (p !== 'head') stopVanillaAnim[p] = true;
	}
	// The head is its own decision, and a consequential one.
	//
	// In Minecraft the head is NOT a child of the body: both hang off the player
	// origin, so tilting the body never moves the head. When an animation lays the
	// character flat — flying — the head has to be carried across by the animation
	// itself, and ours does compute that. But the vanilla look rotation is then
	// applied on top, about the head pivot at the neck, and it swings that whole
	// carried-across offset around: the head sails off the body.
	//
	// So with animations of its own, the model drives the head and it stays put.
	// The cost is that it no longer follows the camera.
	if (!form.headCamera) stopVanillaAnim.head = true;

	cpmSkinBytes(built).then(skin => {
		const out = buildCPMFiles({
			hierarchy: tidy
				? built.parsed.hierarchy.map(h => ({ ...h, name: tidy.label(h.index) }))
				: built.parsed.hierarchy,
			cubes,
			assign: form.assign,
			fallback: form.fallback,
			keepNodes: animated,
			scale: form.scale,
			align,
			stopVanillaAnim,
			uvMul: uv.mul,
			texWidth: built.size.width,
			texHeight: built.size.height,
			uvWidth: built.size.width * uv.mul,
			uvHeight: built.size.height * uv.mul,
			skin,
			name: (built.sourceName || 'model').replace(/\.[^.]*$/, ''),
			animations: built.parsed.animations,
			poses: form.poses,
			fps: form.fps,
			gltfScale: built.chosenScale,
		});

		const zip = new JSZip();
		for (const [name, data] of Object.entries(out.files)) zip.file(name, data);
		// Compressed, like CPM's own projects: animation frames are snapshots of
		// every moving bone, so the JSON is bulky and repetitive — exactly what
		// deflate is good at. Uncompressed this model came to 1.7 MB.
		return zip.generateAsync({ type: 'arraybuffer', compression: 'DEFLATE' }).then(buf => {
			const parts = Object.entries(out.stats.parts).filter(([, n]) => n > 0).map(([p]) => p);
			const lines = [
				`Cubes: ${out.stats.cubes}`,
				`Bones: ${out.stats.bones}`,
				`Player parts used: ${parts.join(', ') || 'none'}`,
				`Scale: ×${form.scale.toFixed(3)}`,
				`UV grid: ${built.size.width * uv.mul}×${built.size.height * uv.mul} (×${uv.mul}) `
					+ `over a ${built.size.width}×${built.size.height} texture`
					+ (uv.exact ? ', exact' : `, rounded by up to ${uv.worst.toFixed(3)} px`),
				`Animations: ${out.stats.anim.animations} of ${built.parsed.animations.length}, `
					+ `${out.stats.anim.frames} frames at ${form.fps} fps`,
				`Rig aligned to the player by [${align.map(v => v.toFixed(1)).join(', ')}] px (height untouched)`,
				`Vanilla motion: ${form.stopVanilla ? 'off on body, arms and legs' : 'on'}`
					+ `, head ${form.headCamera ? 'follows the camera' : 'driven by the model'}`,
			];
			// Worth spelling out: an unaligned model looks fine standing still and
			// tears itself apart the moment a limb moves.
			if (Math.max(...align.map(Math.abs)) > 4) {
				lines.push('  a shift this large means the model was not built around the player skeleton; '
					+ 'without it the limbs would swing about pivots far outside themselves');
			}
			// Which player states the model actually answers for. The gaps only bite
			// when vanilla motion is switched off, but then they bite hard.
			const covered = new Set(Object.values(form.poses || {}).filter(p => p !== 'gesture' && p !== 'skip'));
			const missing = CPM_MAIN_POSES.filter(p => !covered.has(p));
			lines.push(`Poses covered: ${[...covered].join(', ') || 'none'}`);
			if (missing.length) {
				lines.push(`  no animation for: ${missing.join(', ')}`);
				if (form.stopVanilla) {
					lines.push('  and vanilla motion is off, so in those states the model will stand frozen. '
						+ 'That is what the setting costs.');
				}
			}
			if (out.stats.anim.skipped.length) {
				lines.push(`  not transferred: ${out.stats.anim.skipped.join(', ')}`);
			}
			const kb = n => (n / 1024).toFixed(1) + ' kB';
			const size = out.stats.size;
			lines.push(`Encoded size, estimated: ${kb(size.total)} `
				+ `(model ${kb(size.cubes)}, animations ${kb(size.anim)}, texture ${kb(size.texture)})`);
			// The budget for a local .cpmmodel is exactly 30 kB, and past it the mod
			// demands an upload to a paste site. Better known here than at the end of
			// an export, where the levers are already out of reach.
			if (size.total > 30 * 1024) {
				lines.push('  over the 30 kB budget for a local .cpmmodel: File/Test ingame will still work, '
					+ 'but a normal export will ask you to upload the model. '
					+ 'Lower the sampling rate or transfer fewer animations to fit.');
			}
			// The viewer decides whether a model loads, and both defaults are easy to
			// exceed without noticing. Better said here than debugged in game.
			const boxes = out.stats.cubes + out.stats.bones;
			if (boxes > 256) lines.push(`WARNING: ${boxes} elements — over the default MAX_CUBE_COUNT of 256, `
				+ 'so other players will not see the model unless they raise it.');
			if (Math.max(built.size.width, built.size.height) > 256) {
				lines.push(`WARNING: the texture is ${built.size.width}×${built.size.height} — over the default `
					+ 'MAX_TEX_SHEET_SIZE of 256. The UV grid is free, the picture is not.');
			}
			for (const w of out.warnings) lines.push(`Warning: ${w}`);
			console.log('[gltf-to-minecraft] cpm export\n' + lines.join('\n'));

			Blockbench.export({
				type: 'Customizable Player Models Project',
				extensions: ['cpmproject'],
				name: (built.sourceName || 'model').replace(/\.[^.]*$/, ''),
				content: buf,
				savetype: 'buffer',
			});
			showImportReport({
				title: 'Exported to CPM',
				summary: [
					['Cubes', String(out.stats.cubes)],
					['Bones', String(out.stats.bones)],
					['Parts', parts.join(', ') || 'none'],
					['Scale', `×${form.scale.toFixed(2)}`],
					['UV grid', `×${uv.mul}`],
					['Animations', `${out.stats.anim.animations} (${out.stats.anim.frames} frames)`],
					['Encoded size', `~${(out.stats.size.total / 1024).toFixed(1)} kB`],
				],
				warning: boxes > 256
					? `${boxes} elements is over the default limit of 256: other players will not see this model `
						+ 'until they raise MAX_CUBE_COUNT.'
					: out.stats.size.total > 30 * 1024
						? `About ${(out.stats.size.total / 1024).toFixed(0)} kB, over the 30 kB budget for a local `
							+ '.cpmmodel. File/Test ingame still works; a normal export will ask you to upload.'
						: null,
				log: lines.join('\n'),
				name: (built.sourceName || 'model').replace(/\.[^.]*$/, ''),
			});
		});
	}).catch(e => {
		console.error('[gltf-to-minecraft] cpm export failed', e);
		Blockbench.showMessageBox({ title: 'CPM export failed', message: String((e && e.message) || e) });
	});
}

/**
 * The skin for the archive, as PNG bytes.
 *
 * A single PNG goes in as it came. Anything else — an atlas, or a JPEG from
 * Sketchfab — has to be redrawn through a canvas first: CPM reads skin.png with
 * an image decoder that expects a PNG, whatever the file is called.
 */
function cpmSkinBytes(built) {
	if (!built.needAtlas && built.images.length === 1 && built.images[0].mime === 'image/png') {
		return Promise.resolve(built.images[0].bytes);
	}
	// the rebuilt parts' sheets are in the atlas too, after the pictures
	return buildAtlasDataURL(built.images, built.layout, built.sheets).then(url => {
		if (!url) throw new Error('the texture could not be assembled');
		return base64ToBytes(url.slice(url.indexOf(',') + 1));
	});
}

/** What a model folder is made of, besides the model itself. */
const MODEL_PARTS = ['gltf', 'glb', 'bin', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'txt'];

/**
 * One way in for both an archive and an unpacked folder.
 *
 * Nothing below this point cares where the bytes came from: buildFromFiles takes
 * a map of name to bytes, and unpacking a ZIP does nothing but fill that map.
 * Loose files fill the same map, so this is a second source, not a second path —
 * and it stays one menu entry rather than two.
 *
 * A folder also needs no JSZip, so it works in builds that have none.
 */
function pickAndImport(opts, then) {
	Blockbench.import({
		extensions: ['zip', ...MODEL_PARTS],
		type: 'Model archive, or the files of an unpacked folder',
		readtype: 'buffer',
		multiple: true,
	}, files => {
		if (!files || !files.length) return;
		const fail = e => {
			console.error('[gltf-to-minecraft] import failed', e);
			Blockbench.showMessageBox({ title: 'Import failed', message: String((e && e.message) || e) });
		};

		const archive = files.find(f => /\.zip$/i.test(String(f.name || '')));
		if (archive) {
			if (typeof JSZip === 'undefined') {
				Blockbench.showMessageBox({
					title: 'JSZip missing',
					message: 'This Blockbench build has no JSZip, so archives cannot be unpacked.\n'
						+ 'Unpack the archive yourself and select the files inside it instead.',
				});
				return;
			}
			unpackModelArchive(archive.content)
				.then(entries => buildFromFiles(entries, archive.name, opts))
				.then(built => { if (then) then(built); }).catch(fail);
			return;
		}

		// Loose files. The key is the bare file name — that is what a glTF lying
		// next to its textures refers to, while the picker may hand over a full
		// path.
		const entries = {};
		let modelName = '';
		for (const f of files) {
			const name = String(f.name || f.path || '').replace(/^.*[/\\]/, '');
			if (!name) continue;
			entries[name] = f.content instanceof Uint8Array ? f.content : new Uint8Array(f.content);
			if (!modelName && /\.(gltf|glb)$/i.test(name)) modelName = name;
		}
		if (!modelName) {
			Blockbench.showMessageBox({
				title: 'Import failed',
				message: 'No .gltf or .glb among the selected files.\n'
					+ 'Select everything in the model folder: the model, its .bin and the textures.',
			});
			return;
		}
		buildFromFiles(entries, modelName, opts)
			.then(built => { if (then) then(built); })
			.catch(fail);
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
			name: 'glTF to Minecraft',
			description: 'glTF + textures → a ready cube-based model',
			icon: 'folder_zip',
			category: 'general',
			show_on_start_screen: true,
			// Without this the format page is empty: Blockbench does not know what to
			// write, nor what to call the action.
			format_page: {
			button_text: 'Select archive or files…',
			content: [
				{ type: 'h3', text: 'Model from a glTF archive or folder' },
				{ type: 'text', text: 'Takes a .zip with a glTF model and its textures — or the files of an '
					+ 'already unpacked folder — and builds a finished project: bones, cubes, '
					+ 'textures and animations.' },
				{ type: 'text', text: 'The format is chosen in the import dialog: GeckoLib, Bedrock Entity, '
					+ 'Generic Model, or a still Java block or item model. GeckoLib needs its own plugin '
					+ '(GeckoLib Models & Animations on Blockbench 5); the others come with Blockbench.' },
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
	console.log('[gltf-to-minecraft] environment\n' + text);
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
let cpmAction;

Plugin.register(PLUGIN_ID, {
	title: 'glTF to Minecraft',
	author: 'MopicMP',
	// beside this file: Blockbench looks for it next to the plugin, and the
	// catalog in the plugin's folder
	icon: 'icon.png',
	description: 'Convert glTF models — from an archive, a folder or straight from Sketchfab — into cubes Minecraft can use: GeckoLib and Bedrock models with bones and animations, still Java block and item models, or Customizable Player Models skins.',
	version: '0.1.3',
	variant: 'both',
	min_version: '4.9.0',
	has_changelog: true,
	tags: ['Minecraft: Java Edition', 'Minecraft: Bedrock Edition', 'Import', 'Animation'],
	website: 'https://github.com/MopicMP/gltf-to-minecraft',
	repository: 'https://github.com/MopicMP/gltf-to-minecraft',
	bug_tracker: 'https://github.com/MopicMP/gltf-to-minecraft/issues',
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
			name: 'Environment diagnostics (glTF to Minecraft)',
			description: 'Shows what is available inside Blockbench: ZIP, formats, codecs',
			icon: 'bug_report',
			click: showEnvironment,
		});
		MenuBar.addAction(envAction, 'help');

		// All three go to File > Import, next to the other importers. Appended to
		// the bare File menu they landed at its very bottom, away from every other
		// import, and looked out of place there.
		importAction = new Action(PLUGIN_ID + '_import', {
			name: 'Import glTF Model',
			description: 'Builds a cube model from a glTF archive or an unpacked folder: GeckoLib, Bedrock, Generic or Java block/item',
			icon: 'folder_zip',
			// the import creates a project itself, so it needs no open project
			condition: () => true,
			click: importFromZip,
		});
		MenuBar.addAction(importAction, 'file.import');

		cpmAction = new Action(PLUGIN_ID + '_cpm', {
			name: 'Import glTF as Customizable Player Model',
			description: 'Same import, saved as a .cpmproject for the CPM mod',
			icon: 'accessibility_new',
			condition: () => true,
			click: importCPMFromZip,
		});
		MenuBar.addAction(cpmAction, 'file.import');

		sketchfabAction = new Action(PLUGIN_ID + '_sketchfab', {
			name: 'Import from Sketchfab',
			description: 'Search downloadable models and import them straight from Blockbench',
			icon: 'travel_explore',
			condition: () => true,
			click: openSketchfabBrowser,
		});
		MenuBar.addAction(sketchfabAction, 'file.import');

		registerStartScreenFormat();
	},

	onunload() {
		if (action) action.delete();
		if (envAction) envAction.delete();
		if (importAction) importAction.delete();
		if (cpmAction) cpmAction.delete();
		if (sketchfabAction) sketchfabAction.delete();
		if (importFormat && importFormat.delete) importFormat.delete();
		if (sketchfabCSS && sketchfabCSS.delete) sketchfabCSS.delete();
	},
});

})();
