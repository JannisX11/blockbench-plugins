let action

Plugin.register("mesh_to_cube_converter", {
  title: "Mesh to Cube Converter",
  icon: "icon.svg",
  author: "Ewan Howell",
  description: "Detect cuboids within meshes and convert them into real cubes.",
  tags: ["Meshes", "Cubes", "Utility"],
  version: "1.0.0",
  min_version: "5.0.0",
  variant: "both",
  website: "https://ewanhowell.com/plugins/mesh-to-cube-converter/",
  repository: "https://github.com/ewanhowell5195/blockbenchPlugins/tree/main/mesh_to_cube_converter",
  bug_tracker: "https://github.com/ewanhowell5195/blockbenchPlugins/issues/new?title=[Mesh to Cube Converter]",
  creation_date: "2026-08-15",
  has_changelog: true,
  onload() {
    action = new Action("convert_mesh_to_cubes", {
      name: "Convert Mesh to Cubes",
      description: "Detect cuboids within meshes and convert them into cubes",
      icon: "fa-cube",
      condition: { modes: ["edit"], features: ["meshes"], method: () => Mesh.all.length > 0 },
      click() {
        const meshes = (Mesh.selected.length ? Mesh.selected : Mesh.all).filter(mesh => !mesh.locked)
        if (!meshes.length) {
          Blockbench.showQuickMessage("No unlocked meshes found")
          return
        }
        convertMeshes(meshes)
      }
    })
    MenuBar.addAction(action, "tools")
  },
  onunload() {
    action.delete()
  }
})

const EPS = 0.0001
const DOT_EPS = 0.005
const UV_EPS = 0.05
const MIN_ATTACHED_FACES = 4

const NORMALIZE_GRIDS = [1, 0.5, 0.25, 0.1, 0.05, 0.025, 0.01]
const INFLATE_CANDIDATES = [0, -0.01, 0.01, -0.02, 0.02]
const NORMALIZE_TOL = 0.002
const NORMALIZE_RADIUS_FACTOR = 50

const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]
const DIRECTIONS = ["north", "east", "south", "west", "up", "down"]

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0]
]
const len = a => Math.sqrt(dot(a, a))
const norm = a => scale(a, 1 / len(a))
const dist = (a, b) => len(sub(a, b))
const combine = (axes, coords) => [0, 1, 2].map(i => axes[0][i] * coords[0] + axes[1][i] * coords[1] + axes[2][i] * coords[2])
const basisMatrix = cols => new THREE.Matrix4().makeBasis(...cols.map(col => new THREE.Vector3().fromArray(col)))

const pushTo = (map, key, value) => {
  if (!map.has(key)) map.set(key, [])
  map.get(key).push(value)
}

const cornerKey = pids => pids.slice().sort((a, b) => a - b).join(",")

function rectangleAxes(origin, a, b, opposite) {
  const ea = sub(a, origin)
  const eb = sub(b, origin)
  const la = len(ea)
  const lb = len(eb)
  if (la < EPS || lb < EPS) return null
  const u = scale(ea, 1 / la)
  const v = scale(eb, 1 / lb)
  if (Math.abs(dot(u, v)) > DOT_EPS) return null
  const closure = [origin[0] + ea[0] + eb[0], origin[1] + ea[1] + eb[1], origin[2] + ea[2] + eb[2]]
  if (dist(opposite, closure) > EPS * 2) return null
  return { u, v }
}

function directionFromLocal(axisIndex, positive) {
  if (axisIndex === 0) return positive ? "east" : "west"
  if (axisIndex === 1) return positive ? "up" : "down"
  return positive ? "south" : "north"
}

function faceCoords(direction, fx, fy, fz) {
  switch (direction) {
    case "east": return [1 - fz, 1 - fy]
    case "west": return [fz, 1 - fy]
    case "up": return [fx, fz]
    case "down": return [fx, 1 - fz]
    case "south": return [fx, 1 - fy]
    case "north": return [1 - fx, 1 - fy]
  }
}

function cubeName(meshName) {
  return meshName.replace(/mesh/gi, match => {
    if (match === "MESH") return "CUBE"
    if (match[0] === "M") return "Cube"
    return "cube"
  })
}

function normalizePlacement(cols, authoredHalf, W) {
  const snap = (value, g) => Math.round(value / g) * g
  const applyInverse = v => [dot(cols[0], v), dot(cols[1], v), dot(cols[2], v)]

  const quat = new THREE.Quaternion().setFromRotationMatrix(basisMatrix(cols))
  const angle = 2 * Math.acos(Math.min(1, Math.abs(quat.w)))

  if (angle < 1e-4) {
    for (const g of NORMALIZE_GRIDS) {
      const from = authoredHalf.map((h, i) => snap(W[i] - h, g))
      const to = authoredHalf.map((h, i) => snap(W[i] + h, g))
      const ok = from.every((v, i) => Math.abs(v - (W[i] - authoredHalf[i])) < NORMALIZE_TOL)
        && to.every((v, i) => Math.abs(v - (W[i] + authoredHalf[i])) < NORMALIZE_TOL)
      if (ok) return { from, to, origin: W.map(v => snap(v, g)) }
    }
    return null
  }

  const axis = norm([quat.x, quat.y, quat.z])
  const e1 = norm(cross(axis, Math.abs(axis[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]))
  const e2 = cross(axis, e1)
  const col1 = sub(e1, applyInverse(e1))
  const col2 = sub(e2, applyInverse(e2))
  const m11 = dot(e1, col1), m12 = dot(e1, col2)
  const m21 = dot(e2, col1), m22 = dot(e2, col2)
  const det = m11 * m22 - m12 * m21
  if (Math.abs(det) < 1e-9) return null

  const caTarget = dot(axis, W)
  const k = [0, 1, 2].reduce((prev, i) => Math.abs(axis[i]) > Math.abs(axis[prev]) ? i : prev, 0)
  const i1 = (k + 1) % 3
  const i2 = (k + 2) % 3
  const maxPivotDistance = Math.max(12, len(authoredHalf) * 4)

  for (const g of NORMALIZE_GRIDS) {
    const radius = Math.min(50, NORMALIZE_RADIUS_FACTOR * g)
    const offsets = authoredHalf.map(h => ((h % g) + g) % g)
    const latticeSnap = (value, comp) => snap(value - offsets[comp], g) + offsets[comp]
    let best = null
    for (let c1 = latticeSnap(W[i1] - radius, i1); c1 <= W[i1] + radius; c1 += g) {
      for (let c2 = latticeSnap(W[i2] - radius, i2); c2 <= W[i2] + radius; c2 += g) {
        const ckExact = (caTarget - axis[i1] * c1 - axis[i2] * c2) / axis[k]
        const ck = latticeSnap(ckExact, k)
        if (Math.abs(ck - ckExact) * Math.abs(axis[k]) > 0.001) continue
        const cSeed = []
        cSeed[i1] = c1
        cSeed[i2] = c2
        cSeed[k] = ck
        const d = sub(cSeed, W)
        const d1 = dot(e1, d), d2 = dot(e2, d)
        const v1 = (m22 * d1 - m12 * d2) / det
        const v2 = (-m21 * d1 + m11 * d2) / det
        const baseO = [0, 1, 2].map(i => W[i] + e1[i] * v1 + e2[i] * v2)
        for (let n = -2; n <= 2; n++) {
          const t = (snap(baseO[k], g) + n * g - baseO[k]) / axis[k]
          const o = [baseO[0] + axis[0] * t, baseO[1] + axis[1] * t, baseO[2] + axis[2] * t]
          const oSnapped = o.map(v => snap(v, g))
          if (o.some((v, i) => Math.abs(oSnapped[i] - v) > 0.001)) continue
          const distance = len(sub(oSnapped, W))
          if (distance > maxPivotDistance) continue
          const c = applyInverse(sub(W, oSnapped)).map((v, i) => v + oSnapped[i])
          const cSnap = c.map((v, comp) => snap(v - offsets[comp], g) + offsets[comp])
          if (len(sub(cSnap, c)) > NORMALIZE_TOL) continue
          if (best && distance >= best.distance) continue
          best = {
            from: authoredHalf.map((h, i) => cSnap[i] - h),
            to: authoredHalf.map((h, i) => cSnap[i] + h),
            origin: oSnapped,
            distance
          }
        }
      }
    }
    if (best) return { from: best.from, to: best.to, origin: best.origin }
  }
  return null
}

function convertMesh(mesh) {
  const created = []

  const euler = new THREE.Euler(
    Math.degToRad(mesh.rotation[0]),
    Math.degToRad(mesh.rotation[1]),
    Math.degToRad(mesh.rotation[2]),
    "XYZ"
  )
  const positions = {}
  const vec = new THREE.Vector3()
  for (const vkey in mesh.vertices) {
    vec.fromArray(mesh.vertices[vkey]).applyEuler(euler)
    positions[vkey] = [vec.x + mesh.origin[0], vec.y + mesh.origin[1], vec.z + mesh.origin[2]]
  }

  const grid = new Map()
  const pidPositions = []
  const vkeyPid = {}
  const cellSize = EPS * 2
  const cell = p => p.map(v => Math.round(v / cellSize))
  function findPid(p, tolerance = EPS) {
    const reach = Math.ceil(tolerance / cellSize)
    const [cx, cy, cz] = cell(p)
    for (let dx = -reach; dx <= reach; dx++) {
      for (let dy = -reach; dy <= reach; dy++) {
        for (let dz = -reach; dz <= reach; dz++) {
          const list = grid.get((cx + dx) + "," + (cy + dy) + "," + (cz + dz))
          if (!list) continue
          for (const pid of list) {
            const q = pidPositions[pid]
            if (Math.abs(q[0] - p[0]) < tolerance && Math.abs(q[1] - p[1]) < tolerance && Math.abs(q[2] - p[2]) < tolerance) return pid
          }
        }
      }
    }
    return -1
  }
  function getPid(p) {
    let pid = findPid(p)
    if (pid === -1) {
      pid = pidPositions.length
      pidPositions.push(p)
      pushTo(grid, cell(p).join(","), pid)
    }
    return pid
  }
  for (const vkey in positions) vkeyPid[vkey] = getPid(positions[vkey])

  const pidFaces = new Map()
  const rects = []
  const triangles = []
  for (const fkey in mesh.faces) {
    const face = mesh.faces[fkey]
    for (const pid of new Set(face.vertices.map(vkey => vkeyPid[vkey]))) {
      pushTo(pidFaces, pid, fkey)
    }
    const sorted = face.getSortedVertices()
    const corners = sorted.map(vkey => vkeyPid[vkey])
    if (face.vertices.length === 3) {
      if (new Set(corners).size !== 3) continue
      const p = sorted.map(vkey => positions[vkey])
      const n = cross(sub(p[1], p[0]), sub(p[2], p[0]))
      const l = len(n)
      if (l < EPS * EPS) continue
      triangles.push({ fkey, vkeys: sorted, corners, normal: scale(n, 1 / l), uv: face.uv, texture: face.texture })
      continue
    }
    if (face.vertices.length !== 4) continue
    if (new Set(corners).size !== 4) continue
    const p = sorted.map(vkey => positions[vkey])
    const frame = rectangleAxes(p[0], p[1], p[3], p[2])
    if (!frame) continue
    const { u, v } = frame
    rects.push({
      fkeys: [fkey],
      sorted,
      corners,
      cornerKey: cornerKey(corners),
      u,
      v,
      normal: norm(cross(u, v)),
      uv: face.uv,
      texture: face.texture,
      pids: new Set(corners)
    })
  }

  function tryMergeTriangles(a, b) {
    if ((a.texture || false) !== (b.texture || false)) return null
    if (dot(a.normal, b.normal) < 1 - DOT_EPS) return null
    const sharedPids = a.corners.filter(pid => b.corners.includes(pid))
    if (sharedPids.length !== 2) return null
    const aUnique = a.corners.findIndex(pid => !sharedPids.includes(pid))
    const bUnique = b.corners.findIndex(pid => !sharedPids.includes(pid))
    for (const pid of sharedPids) {
      const uvA = a.uv[a.vkeys[a.corners.indexOf(pid)]]
      const uvB = b.uv[b.vkeys[b.corners.indexOf(pid)]]
      if (Math.abs(uvA[0] - uvB[0]) > UV_EPS || Math.abs(uvA[1] - uvB[1]) > UV_EPS) return null
    }
    const frame = rectangleAxes(pidPositions[a.corners[aUnique]], pidPositions[sharedPids[0]], pidPositions[sharedPids[1]], pidPositions[b.corners[bUnique]])
    if (!frame) return null
    let { u, v } = frame
    const vA = a.vkeys[aUnique]
    const vB = b.vkeys[bUnique]
    let vs1 = a.vkeys[a.corners.indexOf(sharedPids[0])]
    let vs2 = a.vkeys[a.corners.indexOf(sharedPids[1])]
    let corners = [a.corners[aUnique], sharedPids[0], b.corners[bUnique], sharedPids[1]]
    if (dot(cross(u, v), a.normal) < 0) {
      ;[vs1, vs2] = [vs2, vs1]
      ;[u, v] = [v, u]
      corners = [corners[0], corners[3], corners[2], corners[1]]
    }
    return {
      fkeys: [a.fkey, b.fkey],
      sorted: [vA, vs1, vB, vs2],
      corners,
      cornerKey: cornerKey(corners),
      u,
      v,
      normal: a.normal,
      uv: { [vA]: a.uv[vA], [vs1]: a.uv[vs1], [vs2]: a.uv[vs2], [vB]: b.uv[vB] },
      texture: a.texture,
      pids: new Set(corners)
    }
  }
  const edgeMap = new Map()
  triangles.forEach((tri, index) => {
    for (let i = 0; i < 3; i++) {
      const p1 = tri.corners[i]
      const p2 = tri.corners[(i + 1) % 3]
      pushTo(edgeMap, Math.min(p1, p2) + "," + Math.max(p1, p2), index)
    }
  })
  for (const list of edgeMap.values()) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const merged = tryMergeTriangles(triangles[list[i]], triangles[list[j]])
        if (merged) rects.push(merged)
      }
    }
  }

  const consumed = new Set()
  const rejected = new Set()

  const isAligned = (rec, axes) => [rec.u, rec.v].every(dir => axes.some(axis => Math.abs(dot(dir, axis)) > 1 - DOT_EPS))

  function assembleBox(axes, bounds, facesByCorners) {
    const cornerPids = {}
    for (let corner = 0; corner < 8; corner++) {
      const f = [corner >> 2 & 1, corner >> 1 & 1, corner & 1]
      cornerPids[f.join("")] = findPid(combine(axes, f.map((side, axis) => bounds[axis][side])), EPS * 3)
    }
    const faces = {}
    let count = 0
    for (let axis = 0; axis < 3; axis++) {
      if (bounds.some((b, i) => i !== axis && b[1] - b[0] < EPS)) continue
      for (let side = 0; side <= 1; side++) {
        const pids = []
        for (let fa = 0; fa <= 1; fa++) {
          for (let fb = 0; fb <= 1; fb++) {
            const f = [0, 0, 0]
            f[axis] = side
            f[(axis + 1) % 3] = fa
            f[(axis + 2) % 3] = fb
            pids.push(cornerPids[`${f[0]}${f[1]}${f[2]}`])
          }
        }
        if (pids.includes(-1)) continue
        const matches = facesByCorners.get(cornerKey(pids))
        if (!matches) continue
        const outward = scale(axes[axis], side ? 1 : -1)
        const match = matches.find(rec => dot(rec.normal, outward) > 0.9)
        if (!match) continue
        faces[`${axis},${side}`] = match
        count++
      }
    }
    if (!count) return null
    if (bounds[2][1] - bounds[2][0] > EPS && Object.keys(faces).every(key => key === "2,1")) return null
    const signature = Object.values(faces).map(rec => rec.fkeys.join("+")).sort().join("|")
      + "@" + bounds.map(b => b.map(v => Math.roundTo(v, 3)).join(":")).join(";")
      + "@" + axes.map(a => a.map(v => Math.roundTo(v, 3)).join(":")).join(";")
    return {
      axes,
      bounds,
      faces,
      count,
      cornerPids: new Set(Object.values(faces).flatMap(rec => rec.corners)),
      signature,
      volume: (bounds[0][1] - bounds[0][0]) * (bounds[1][1] - bounds[1][0]) * (bounds[2][1] - bounds[2][0])
    }
  }

  function buildCandidates() {
    const available = rects.filter(rec => rec.fkeys.every(fkey => !consumed.has(fkey)))
    const facesByCorners = new Map()
    for (const rec of available) {
      pushTo(facesByCorners, rec.cornerKey, rec)
    }
    const candidates = []
    const seen = new Set()
    for (const seed of available) {
      const axes = [seed.u, seed.v, seed.normal]
      const corners = seed.corners.map(pid => pidPositions[pid])
      const us = corners.map(p => dot(p, axes[0]))
      const vs = corners.map(p => dot(p, axes[1]))
      const u0 = Math.min(...us), u1 = Math.max(...us)
      const v0 = Math.min(...vs), v1 = Math.max(...vs)
      const n1 = dot(corners[0], axes[2])
      const depths = [n1]
      for (const rec of available) {
        if (rec === seed || !isAligned(rec, axes)) continue
        for (const pid of rec.corners) {
          const cn = dot(pidPositions[pid], axes[2])
          if (cn < n1 - EPS && !depths.some(d => Math.abs(d - cn) < EPS)) depths.push(cn)
        }
      }
      for (const n0 of depths) {
        const candidate = assembleBox(axes, [[u0, u1], [v0, v1], [n0, n1]], facesByCorners)
        if (candidate && !seen.has(candidate.signature)) {
          seen.add(candidate.signature)
          candidates.push(candidate)
        }
      }
    }
    return candidates
  }

  function facesAreConnected(candidate) {
    const recs = Object.values(candidate.faces)
    if (recs.length < 2) return true
    const visited = new Set([0])
    const queue = [0]
    while (queue.length) {
      const current = recs[queue.pop()]
      recs.forEach((other, i) => {
        if (visited.has(i)) return
        let shared = 0
        for (const pid of other.corners) {
          if (current.pids.has(pid)) shared++
        }
        if (shared >= 2) {
          visited.add(i)
          queue.push(i)
        }
      })
    }
    return visited.size === recs.length
  }

  function hasExternalAttachment(candidate) {
    const boxFkeys = new Set(Object.values(candidate.faces).flatMap(rec => rec.fkeys))
    for (const pid of candidate.cornerPids) {
      for (const fkey of pidFaces.get(pid) ?? []) {
        if (!consumed.has(fkey) && !boxFkeys.has(fkey)) return true
      }
    }
    return false
  }

  function isEligible(candidate) {
    if (candidate.count === 6) return true
    if (!facesAreConnected(candidate)) return false
    if (!hasExternalAttachment(candidate)) return true
    return candidate.count >= MIN_ATTACHED_FACES
  }

  function tryCreateCube(candidate) {
    const { axes, bounds } = candidate

    let best = null
    for (const perm of PERMS) {
      for (let signBits = 0; signBits < 8; signBits++) {
        const signs = [signBits & 1 ? -1 : 1, signBits & 2 ? -1 : 1, signBits & 4 ? -1 : 1]
        const cols = [
          scale(axes[perm[0]], signs[0]),
          scale(axes[perm[1]], signs[1]),
          scale(axes[perm[2]], signs[2])
        ]
        if (dot(cols[0], cross(cols[1], cols[2])) < 0.5) continue
        const trace = cols[0][0] + cols[1][1] + cols[2][2]
        if (!best || trace > best.trace) best = { cols, perm, trace }
      }
    }
    const { cols, perm } = best

    const center = combine(axes, bounds.map(b => (b[0] + b[1]) / 2))
    const rawSize = perm.map(axis => bounds[axis][1] - bounds[axis][0]).map(s => s < 0.0015 ? 0 : s)
    let inflate = 0
    let size = null
    for (const value of INFLATE_CANDIDATES) {
      const authored = rawSize.map(s => {
        if (s === 0) return value === 0 ? 0 : null
        const target = s - value * 2
        const snapped = Math.round(target / 0.025) * 0.025
        return (snapped > EPS && Math.abs(snapped - target) < 0.0005) ? snapped : null
      })
      if (authored.every(v => v !== null)) {
        inflate = value
        size = authored.map(v => v + value * 2)
        break
      }
    }
    if (!size) {
      size = rawSize.map(s => {
        for (const g of [0.01, 0.005, 0.0025, 0.001]) {
          const snapped = Math.round(s / g) * g
          if (snapped > EPS && Math.abs(snapped - s) < 0.0005 && Math.abs(snapped - s) < s * 0.05) return snapped
        }
        return Math.roundTo(s, 4)
      })
    }

    const rotationEuler = new THREE.Euler().setFromRotationMatrix(basisMatrix(cols), Format.euler_order ?? "ZYX")
    let rotation = [rotationEuler.x, rotationEuler.y, rotationEuler.z]
      .map(rad => Math.roundTo(Math.radToDeg(rad), 4))
      .map(deg => Math.abs(deg) < 0.01 ? 0 : deg)

    if (rotation.some(deg => deg)) {
      if (!Format.rotate_cubes) return null
      if (Format.rotation_limit) {
        const nonzero = rotation.filter(deg => deg)
        if (nonzero.length > 1) return null
        const snapped = Math.round(nonzero[0] / 22.5) * 22.5
        if (Math.abs(snapped - nonzero[0]) > 0.01 || Math.abs(snapped) > 45) return null
        rotation = rotation.map(deg => deg ? snapped : 0)
      }
    }

    const centerLocal = [dot(center, cols[0]), dot(center, cols[1]), dot(center, cols[2])]
    const faceEntries = {}
    for (const sideKey in candidate.faces) {
      const [axis, side] = sideKey.split(",").map(Number)
      const rec = candidate.faces[sideKey]
      const localAxis = perm.indexOf(axis)
      const positive = (cols[localAxis][0] * axes[axis][0] + cols[localAxis][1] * axes[axis][1] + cols[localAxis][2] * axes[axis][2]) > 0
      const direction = directionFromLocal(localAxis, side === 1 ? positive : !positive)

      const observed = [null, null, null, null]
      for (const vkey of rec.sorted) {
        const [lx, ly] = faceCoords(direction, ...cols.map((col, i) => dot(positions[vkey], col) > centerLocal[i] ? 1 : 0))
        const slot = ly === 0 ? lx : 3 - lx
        if (observed[slot]) return null
        observed[slot] = rec.uv[vkey].slice()
      }
      if (observed.includes(null)) return null

      let entry = null
      for (let k = 0; k < 4; k++) {
        if (k && !Format.uv_rotation) break
        const tl = observed[k]
        const tr = observed[(k + 1) % 4]
        const br = observed[(k + 2) % 4]
        const bl = observed[(k + 3) % 4]
        if (
          Math.abs(tl[0] - bl[0]) < UV_EPS && Math.abs(tr[0] - br[0]) < UV_EPS &&
          Math.abs(tl[1] - tr[1]) < UV_EPS && Math.abs(bl[1] - br[1]) < UV_EPS
        ) {
          entry = {
            uv: [
              Math.roundTo((tl[0] + bl[0]) / 2, 4),
              Math.roundTo((tl[1] + tr[1]) / 2, 4),
              Math.roundTo((tr[0] + br[0]) / 2, 4),
              Math.roundTo((bl[1] + br[1]) / 2, 4)
            ],
            rotation: k * 90,
            texture: rec.texture
          }
          break
        }
      }
      if (!entry) return null
      faceEntries[direction] = entry
    }

    const placement = normalizePlacement(cols, size.map(s => s / 2 - inflate), center) ?? {
      from: size.map((s, i) => center[i] - s / 2 + inflate),
      to: size.map((s, i) => center[i] + s / 2 - inflate),
      origin: center
    }
    const cube = new Cube({
      name: cubeName(mesh.name),
      color: mesh.color,
      visibility: mesh.visibility,
      autouv: 0,
      box_uv: false,
      inflate,
      from: placement.from.map(v => Math.roundTo(v, 4)),
      to: placement.to.map(v => Math.roundTo(v, 4)),
      origin: placement.origin.map(v => Math.roundTo(v, 4)),
      rotation
    })
    for (const direction of DIRECTIONS) {
      cube.faces[direction].extend(faceEntries[direction] ?? { texture: null })
    }
    cube.sortInBefore(mesh).init()
    return cube
  }

  while (true) {
    const candidates = buildCandidates()
      .filter(candidate => !rejected.has(candidate.signature) && isEligible(candidate))
      .sort((a, b) => b.count - a.count || b.volume - a.volume)
    let progress = false
    for (const candidate of candidates) {
      if (Object.values(candidate.faces).some(rec => rec.fkeys.some(fkey => consumed.has(fkey)))) continue
      const cube = tryCreateCube(candidate)
      if (!cube) {
        rejected.add(candidate.signature)
        continue
      }
      created.push(cube)
      if (mesh.selected) selected.safePush(cube)
      for (const fkey of Object.values(candidate.faces).flatMap(rec => rec.fkeys)) consumed.add(fkey)
      progress = true
    }
    if (!progress) break
  }

  if (!created.length) return { created, removedMesh: false }

  for (const fkey of consumed) delete mesh.faces[fkey]
  if (!Object.keys(mesh.faces).length) {
    mesh.remove()
    return { created, removedMesh: true }
  }
  const usedVkeys = new Set(Object.values(mesh.faces).flatMap(face => face.vertices))
  for (const vkey in mesh.vertices) {
    if (!usedVkeys.has(vkey)) delete mesh.vertices[vkey]
  }
  return { created, removedMesh: false }
}

function convertMeshes(meshes) {
  if (Format.box_uv && !Format.optional_box_uv) {
    Blockbench.showQuickMessage("This format does not support per-face UV on cubes")
    return
  }
  Undo.initEdit({ elements: meshes.slice(), outliner: true, selection: true })
  const newCubes = []
  const keptMeshes = []
  let affectedMeshes = 0
  for (const mesh of meshes) {
    const result = convertMesh(mesh)
    if (result.created.length) {
      newCubes.push(...result.created)
      affectedMeshes++
      if (!result.removedMesh) keptMeshes.push(mesh)
    }
  }
  if (!newCubes.length) {
    Undo.cancelEdit()
    Blockbench.showQuickMessage("No convertible cubes found")
    return
  }
  updateSelection()
  Canvas.updateView({
    elements: [...keptMeshes, ...newCubes],
    element_aspects: { transform: true, geometry: true, uv: true, faces: true }
  })
  Undo.finishEdit("Convert meshes to cubes", { elements: [...keptMeshes, ...newCubes], outliner: true, selection: true })
  Blockbench.showQuickMessage(`Converted ${newCubes.length} cube${newCubes.length === 1 ? "" : "s"} from ${affectedMeshes} mesh${affectedMeshes === 1 ? "" : "es"}`, 2000)
}
