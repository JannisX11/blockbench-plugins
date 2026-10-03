/**
 * AzureLib Animator — FABRIK Inverse Kinematics
 * -----------------------------------------------
 * Integrated IK module for the AzureLib Blockbench plugin.
 *
 * Exports (consumed by azure-animation-tab.js):
 *   registerIK()    — call inside registerAzureAnimationFormat()
 *   unregisterIK()  — call inside unregisterAzureAnimationFormat()
 *   IKManager       — singleton, accessible for advanced use
 *
 * Features
 *   • FABRIK solver with pole-vector and hinge-axis constraints
 *   • Three Meta gizmos per chain (Tip/green, Knee/blue, Root/orange)
 *     draggable directly in the Blockbench viewport
 *   • Pin Meta — freezes a gizmo in world-space so the body can move
 *     freely while the foot stays planted (walkcycle floor anchoring)
 *   • Placed Metas — dragging a gizmo holds it where you put it (it keeps
 *     driving the chain until pinned, keyed, or released with ⟳)
 *   • Keyed Metas — Tip/Knee targets can be keyframed on the timeline
 *     (⏺ in the panel); the gizmo follows its keyed path during playback
 *     and the chain tracks it live (CoreIK-style target animation)
 *   • Follow mode — unpinned, unkeyed gizmos ride along with the animated
 *     bone positions every frame, so the rig overlay always matches the pose
 *   • Live solve — IK is applied on every animation frame (scrub & playback),
 *     not just while dragging; WYSIWYG with the baked result
 *   • Hinge Lock — restricts joint rotation to one axis (X/Y/Z)
 *   • Bake — two-pass: samples every frame first, then writes rotation
 *     keyframes (Blockbench sign convention) via the undo system
 *   • Undo/redo — target moves, pins, keys, hinge, chain create/remove,
 *     and bakes all integrate with Blockbench's undo stack
 *
 * © 2026 AzureDoom — MIT License
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FABRIK_ITERS   = 24;
const FABRIK_EPS     = 0.0005;

const CLR_TIP    = 0x00ff88;  // green
const CLR_KNEE   = 0x44aaff;  // blue
const CLR_ROOT   = 0xff9900;  // orange
const CLR_PINNED = 0xff2255;  // red — shown when pinned

const RAD2DEG = 180 / Math.PI;

// ---------------------------------------------------------------------------
// Math utilities
// ---------------------------------------------------------------------------

function v3(x = 0, y = 0, z = 0) { return new THREE.Vector3(x, y, z); }

/**
 * Animated world-space position of a Blockbench Group bone.
 * group.scene_object is the animated THREE.js bone — getWorldPosition on it
 * returns the actual current position including all animation transforms.
 * This is the same object Blockbench uses in animation_transform.js.
 */
function boneWorldPos(bone) {
  // During solving we need bone.mesh because we've just written rotations to it
  // and updateWorldMatrix(true,true) has been called to propagate them.
  // bone.scene_object reflects Blockbench's last preview pass, not our live writes.
  const obj = bone.mesh ?? bone.scene_object;
  if (!obj) return v3();
  obj.updateWorldMatrix(true, false);
  return new THREE.Vector3().setFromMatrixPosition(obj.matrixWorld);
}

function segmentLengths(positions) {
  return positions.slice(0, -1).map((p, i) => p.distanceTo(positions[i + 1]));
}

// ---------------------------------------------------------------------------
// FABRIKSolver — pure math, no Blockbench I/O
// ---------------------------------------------------------------------------

const FABRIKSolver = {
  /**
   * @param {THREE.Vector3[]} joints    root-first joint world positions
   * @param {number[]}        lengths   segment lengths
   * @param {THREE.Vector3}   target    desired tip world pos
   * @param {THREE.Vector3|null} pole   optional pole-vector hint
   * @param {{ hingeAxis?: 'x'|'y'|'z'|null, pinRoot?: boolean }} opts
   * @returns {THREE.Vector3[]}
   */
  solve(joints, lengths, target, pole, opts = {}) {
    const n       = joints.length;
    if (n < 2) return joints.map(j => j.clone());

    const pts     = joints.map(j => j.clone());
    const root    = pts[0].clone();
    const total   = lengths.reduce((s, l) => s + l, 0);
    const pinRoot = opts.pinRoot !== false;

    // Chain fully stretched toward target
    if (pts[0].distanceTo(target) >= total) {
      for (let i = 0; i < n - 1; i++) {
        const d = target.distanceTo(pts[i]);
        pts[i + 1].lerpVectors(pts[i], target, lengths[i] / d);
      }
      return pts;
    }

    for (let iter = 0; iter < FABRIK_ITERS; iter++) {
      // Forward pass  tip → root
      pts[n - 1].copy(target);
      for (let i = n - 2; i >= 0; i--) {
        const d = pts[i + 1].distanceTo(pts[i]);
        if (d < 1e-9) continue;
        pts[i].lerpVectors(pts[i + 1], pts[i], lengths[i] / d);
      }

      // Backward pass  root → tip
      if (pinRoot) pts[0].copy(root);
      for (let i = 0; i < n - 1; i++) {
        const d = pts[i].distanceTo(pts[i + 1]);
        if (d < 1e-9) continue;
        pts[i + 1].lerpVectors(pts[i], pts[i + 1], lengths[i] / d);
      }

      // Pole-vector nudge
      if (pole && n >= 3) this._poleHint(pts, lengths, pole);

      // Hinge constraint
      if (opts.hingeAxis) this._hinge(pts, lengths, opts.hingeAxis);

      if (pts[n - 1].distanceTo(target) < FABRIK_EPS) break;
    }

    return pts;
  },

  _poleHint(pts, lengths, pole) {
    const mid   = Math.floor(pts.length / 2);
    const nudge = pole.clone().sub(pts[mid]).normalize()
                     .multiplyScalar(pts[mid - 1].distanceTo(pts[mid]) * 0.25);
    pts[mid].add(nudge);
    // Re-project forward
    for (let i = mid; i < pts.length - 1; i++) {
      const d = pts[i + 1].distanceTo(pts[i]);
      if (d < 1e-9) continue;
      pts[i + 1].lerpVectors(pts[i], pts[i + 1], lengths[i] / d);
    }
    // Re-project backward
    for (let i = mid; i > 0; i--) {
      const d = pts[i - 1].distanceTo(pts[i]);
      if (d < 1e-9) continue;
      pts[i - 1].lerpVectors(pts[i], pts[i - 1], lengths[i - 1] / d);
    }
  },

  _hinge(pts, lengths, axis) {
    const axVec = axis === 'x' ? v3(1, 0, 0)
                : axis === 'z' ? v3(0, 0, 1)
                : v3(0, 1, 0);
    for (let i = 0; i < pts.length - 1; i++) {
      const delta   = pts[i + 1].clone().sub(pts[i]);
      const inPlane = delta.clone().sub(delta.clone().projectOnVector(axVec)).normalize();
      if (inPlane.lengthSq() < 1e-8) continue;
      pts[i + 1].copy(pts[i]).addScaledVector(inPlane, lengths[i]);
    }
  },
};

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Gizmo scene helpers
// Exact pattern used by Blockbench's own transform gizmo (transform_gizmo.js):
//   depthTest:false + depthWrite:false + transparent:true + renderOrder:999
// transparent:true is essential — without it Three.js uses the opaque render
// queue which ignores renderOrder for depth, so the object gets occluded.
// ---------------------------------------------------------------------------

function _addGizmoToScene(obj) {
  obj.traverse(child => {
    child.renderOrder = 999;
    if (child.material) {
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach(m => {
        m.depthTest   = false;
        m.depthWrite  = false;
        m.transparent = true;   // required — moves object to transparent render queue
        // which respects renderOrder, unlike the opaque queue
      });
    }
  });
  obj.renderOrder = 999;
  if (typeof scene !== 'undefined') scene.add(obj);
}

function _removeGizmoFromScene(obj) {
  if (typeof scene !== 'undefined') scene.remove(obj);
}

const IKOverlay = {
  init()      {},
  hook()      {},
  unhook()    {},
  dispose()   {},
  add(obj)    { _addGizmoToScene(obj); },
  remove(obj) { _removeGizmoFromScene(obj); },
};

// ---------------------------------------------------------------------------
// Constants — gizmo visuals
// ---------------------------------------------------------------------------

const GIZMO_BOX_SIZE = 3;

// ---------------------------------------------------------------------------
// MetaController — solid coloured box gizmo in the overlay scene
// ---------------------------------------------------------------------------

class MetaController {
  constructor(id, role, initPos) {
    this.id        = id;
    this.role      = role;        // 'tip' | 'knee' | 'root'
    this.position  = initPos.clone();
    this.pinned    = false;
    this.pinnedPos = null;
    this.userPlaced = false;      // dragged by the user — holds position & drives IK
    this.keys      = [];          // [{ time:number, pos:[x,y,z] }] sorted by time
    this._mesh     = null;
    this._build();
  }

  _color() {
    if (this.pinned)          return CLR_PINNED;
    if (this.role === 'tip')  return CLR_TIP;
    if (this.role === 'knee') return CLR_KNEE;
    return CLR_ROOT;
  }

  _build() {
    const s = GIZMO_BOX_SIZE;

    // Solid coloured box — added directly to scene, no children
    const solidMat = new THREE.MeshBasicMaterial({ color: this._color() });
    this._mesh = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), solidMat);
    this._mesh.position.copy(this.position);
    this._mesh.userData.ikMetaId = this.id;

    // Separate edge lines object — gives the X-marks wireframe look
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x000000 });
    this._edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(s, s, s)),
      edgesMat,
    );
    this._edges.position.copy(this.position);

    // Add both independently so each gets its own onBeforeRender depth-clear
    IKOverlay.add(this._mesh);
    IKOverlay.add(this._edges);
  }

  refreshColor() {
    if (this._mesh) this._mesh.material.color.setHex(this._color());
  }

  moveTo(pos) {
    this.position.copy(pos);
    if (this._mesh)  this._mesh.position.copy(pos);
    if (this._edges) this._edges.position.copy(pos);
  }

  togglePin() {
    this.pinned    = !this.pinned;
    this.pinnedPos = this.pinned ? this.position.clone() : null;
    if (!this.pinned) this.userPlaced = false;  // unpin = release back to follow
    this.refreshColor();
  }

  /** Stop holding a dragged position and resume following the animation. */
  resumeFollow() { this.userPlaced = false; }

  // ── Target keyframes ──────────────────────────────────────────────────────
  // A meta can be animated over the timeline. During playback/scrub the
  // gizmo follows its keyed path and the IK chain tracks it (CoreIK-style).

  hasKeys() { return this.keys.length > 0; }

  /** Add (or replace) a key at `time` using the gizmo's current position. */
  addKey(time) {
    const t = Math.round(time * 1e4) / 1e4;
    const existing = this.keys.find(k => Math.abs(k.time - t) < 1e-4);
    if (existing) {
      existing.pos = this.position.toArray();
    } else {
      this.keys.push({ time: t, pos: this.position.toArray() });
      this.keys.sort((a, b) => a.time - b.time);
    }
  }

  /** Remove the key closest to `time` (within tolerance). */
  removeKeyNear(time, tolerance = 0.05) {
    let best = -1, bestDist = tolerance;
    this.keys.forEach((k, i) => {
      const d = Math.abs(k.time - time);
      if (d <= bestDist) { best = i; bestDist = d; }
    });
    if (best !== -1) this.keys.splice(best, 1);
    return best !== -1;
  }

  clearKeys() { this.keys = []; }

  /**
   * Evaluate the keyed position at `time` (linear interpolation, clamped
   * at the ends). Returns null when the meta has no keys.
   */
  evaluate(time) {
    if (!this.keys.length) return null;
    const keys = this.keys;
    if (time <= keys[0].time)            return new THREE.Vector3(...keys[0].pos);
    if (time >= keys.at(-1).time)        return new THREE.Vector3(...keys.at(-1).pos);
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i], b = keys[i + 1];
      if (time >= a.time && time <= b.time) {
        const span = b.time - a.time;
        const f = span < 1e-9 ? 0 : (time - a.time) / span;
        return new THREE.Vector3(...a.pos).lerp(new THREE.Vector3(...b.pos), f);
      }
    }
    return new THREE.Vector3(...keys.at(-1).pos);
  }

  dispose() {
    if (this._mesh) {
      IKOverlay.remove(this._mesh);
      this._mesh.geometry.dispose();
      this._mesh.material.dispose();
      this._mesh = null;
    }
    if (this._edges) {
      IKOverlay.remove(this._edges);
      this._edges.geometry.dispose();
      this._edges.material.dispose();
      this._edges = null;
    }
  }
}

// ---------------------------------------------------------------------------
// IKChain — bones + Metas + white connector lines
// ---------------------------------------------------------------------------

class IKChain {
  /**
   * @param {string}   name
   * @param {Group[]}  bones  ordered Blockbench Group array (root → tip)
   */
  constructor(name, bones) {
    this.name      = name;
    this.bones     = bones;
    this.enabled   = true;
    this.hingeAxis = null;
    this._lastRotDelta = {};

    const restPos  = bones.map(b => boneWorldPos(b));
    this._lengths  = segmentLengths(restPos);

    const tipPos   = restPos.at(-1).clone();
    const rootPos  = restPos[0].clone();

    // Place knee meta exactly at the middle bone's world position.
    // The user drags it to set the pole direction; starting on the joint
    // matches the reference and avoids orientation-dependent wrong guesses.
    const midPos = restPos[Math.floor(restPos.length / 2)].clone();

    this.metaTip  = new MetaController(`${name}_tip`,  'tip',  tipPos);
    this.metaKnee = new MetaController(`${name}_knee`, 'knee', midPos);
    this.metaRoot = new MetaController(`${name}_root`, 'root', rootPos);

    // White lines connecting root→knee→tip in the overlay scene
    this._lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff, depthTest: false, depthWrite: false, transparent: true,
    });
    this._lineGeo  = new THREE.BufferGeometry();
    this._linePositions = new Float32Array(3 * 3);
    this._lineGeo.setAttribute('position',
      new THREE.BufferAttribute(this._linePositions, 3));
    this._line = new THREE.Line(this._lineGeo, this._lineMat);
    this._line.renderOrder = 9500;
    IKOverlay.add(this._line);

    this._updateLines();
  }

  _updateLines() {
    if (!this._linePositions || !this._lineGeo) return;
    const p = this._linePositions;
    const r = this.metaRoot.position;
    const k = this.metaKnee.position;
    const t = this.metaTip.position;
    p[0] = r.x; p[1] = r.y; p[2] = r.z;
    p[3] = k.x; p[4] = k.y; p[5] = k.z;
    p[6] = t.x; p[7] = t.y; p[8] = t.z;
    this._lineGeo.attributes.position.needsUpdate = true;
  }

  /**
   * Refresh every meta for the given timeline time. Priority per meta:
   *   1. pinned     — stays at its frozen world position (floor anchor)
   *   2. keyed      — follows its own keyframed path (CoreIK-style targets)
   *   3. userPlaced — holds the position the user dragged it to
   *   4. neither    — rides along with the animated bone position
   *
   * Returns true when the chain actually needs an IK solve this frame
   * (i.e. at least one driving meta is pinned, keyed, or user-placed).
   * Chains whose metas merely follow the animation are a no-op and skip.
   */
  updateTargetsForTime(time) {
    const animatedPos = this.bones.map(b => boneWorldPos(b));
    const midIdx = Math.floor(animatedPos.length / 2);

    const place = (meta, followPos) => {
      if (meta.pinned) { meta.moveTo(meta.pinnedPos); return true; }
      const keyed = meta.evaluate(time);
      if (keyed)           { meta.moveTo(keyed);      return true; }
      if (meta.userPlaced) {  /* keep where dragged */ return true; }
      meta.moveTo(followPos);
      return false;
    };

    // Root is informational — it always sits on the (possibly animated) root
    // joint; pinning it only affects the solver via pinRoot which is already
    // enforced, so it never *drives* a solve by itself.
    place(this.metaRoot, animatedPos[0]);

    const tipDrives  = place(this.metaTip,  animatedPos.at(-1));
    const kneeDrives = place(this.metaKnee, animatedPos[midIdx]);

    this._updateLines();
    return tipDrives || kneeDrives;
  }

  solve() {
    if (!this.enabled) return;

    // Seed current joint positions from the mesh hierarchy (live, not stale scene_object)
    // First ensure the root bone's world matrix is fresh from Blockbench's last frame
    const rootMesh = this.bones[0]?.mesh;
    if (rootMesh) rootMesh.updateWorldMatrix(true, true);

    const currentPos = this.bones.map(b => boneWorldPos(b));
    const tipTarget  = this.metaTip.pinned
      ? this.metaTip.pinnedPos.clone()
      : this.metaTip.position.clone();

    const solved = FABRIKSolver.solve(
      currentPos,
      this._lengths,
      tipTarget,
      this.metaKnee.position,
      { hingeAxis: this.hingeAxis, pinRoot: true },
    );

    this._writeRotations(solved);

    // Show the achieved tip position — but never fight a pinned, keyed, or
    // user-placed target, which must keep authority over the gizmo.
    if (!this.metaTip.pinned && !this.metaTip.hasKeys() && !this.metaTip.userPlaced) {
      this.metaTip.moveTo(solved.at(-1));
    }
    this._updateLines();
  }

  _writeRotations(solved) {
    this._lastRotDelta = {};

    for (let i = 0; i < this.bones.length - 1; i++) {
      const bone     = this.bones[i];
      const boneMesh = bone.mesh;
      const nextMesh = this.bones[i + 1].mesh;
      if (!boneMesh || !nextMesh) continue;

      // Parents above may have just been rotated — refresh this bone's matrix
      boneMesh.updateWorldMatrix(true, false);

      // Desired segment direction, expressed in this bone's LOCAL space
      const localStart = boneMesh.worldToLocal(solved[i].clone());
      const localEnd   = boneMesh.worldToLocal(solved[i + 1].clone());
      const desired    = localEnd.sub(localStart);
      if (desired.lengthSq() < 1e-10) continue;
      desired.normalize();

      // CURRENT direction toward the child joint in the same local space.
      // Under pure-rotation animation the child's local offset is constant,
      // so rotating `current` onto `desired` is an EXACT correction — unlike
      // the old rest-direction approximation, which treated model-space
      // origin deltas as world offsets and only converged asymptotically
      // (the chain visibly lagged behind the dragged anchor).
      const childWorld = nextMesh.getWorldPosition(new THREE.Vector3());
      const current    = boneMesh.worldToLocal(childWorld);
      if (current.lengthSq() < 1e-10) continue;
      current.normalize();

      // Post-multiply so R_new = R_current ∘ q (q lives in local space).
      // THREE keeps .rotation in sync with .quaternion automatically.
      const q = new THREE.Quaternion().setFromUnitVectors(current, desired);
      boneMesh.quaternion.multiply(q);

      // Apply hinge constraint
      if (this.hingeAxis) {
        const fix = boneMesh.fix_rotation ?? new THREE.Euler();
        if (this.hingeAxis === 'x') { boneMesh.rotation.y = fix.y; boneMesh.rotation.z = fix.z; }
        else if (this.hingeAxis === 'y') { boneMesh.rotation.x = fix.x; boneMesh.rotation.z = fix.z; }
        else if (this.hingeAxis === 'z') { boneMesh.rotation.x = fix.x; boneMesh.rotation.y = fix.y; }
      }

      // Propagate to children
      boneMesh.updateWorldMatrix(false, true);

      // Store keyframe delta = (mesh.rotation - fix_rotation) in degrees
      const fix = boneMesh.fix_rotation ?? new THREE.Euler();
      this._lastRotDelta[bone.uuid] = {
        x: (boneMesh.rotation.x - fix.x) * RAD2DEG,
        y: (boneMesh.rotation.y - fix.y) * RAD2DEG,
        z: (boneMesh.rotation.z - fix.z) * RAD2DEG,
      };
    }
  }

  toggleHinge(axis) {
    this.hingeAxis = this.hingeAxis === axis ? null : axis;
  }

  dispose() {
    // Reset bones to rest rotation
    for (const bone of this.bones) {
      if (bone.mesh?.fix_rotation) bone.mesh.rotation.copy(bone.mesh.fix_rotation);
    }
    this._lastRotDelta = {};
    this._linePositions = null;
    try { Animator.preview(); } catch (_) {}

    this.metaTip.dispose();
    this.metaKnee.dispose();
    this.metaRoot.dispose();
    if (this._line) {
      IKOverlay.remove(this._line);
      this._lineGeo.dispose();
      this._lineMat.dispose();
      this._line = null;
    }
  }
}

// ---------------------------------------------------------------------------
// IKManager — top-level singleton
// ---------------------------------------------------------------------------

export const IKManager = {
  chains:     [],
  _raycaster: new THREE.Raycaster(),
  _dragState: null,
  _canvas:    null,
  _baking:    false,
  _registered: false,
  _onFrameBound:   null,
  _compileBound:   null,
  _parseBound:     null,
  _onDownBound:    null,
  _onMoveBound:    null,
  _onUpBound:      null,
  _onUndoBound:    null,
  _onRedoBound:    null,
  _panel:          null,
  _createAction:   null,
  _bakeAllAction:  null,

  // ── Public lifecycle ─────────────────────────────────────────────────────

  register() {
    if (this._registered) return;
    this._registered = true;

    IKOverlay.init();
    IKOverlay.hook();

    this._onFrameBound = () => this._onFrame();
    Blockbench.on('display_animation_frame', this._onFrameBound);

    // Restore IK snapshots when Blockbench undoes/redoes one of our entries
    this._onUndoBound = (e) => this._onUndo(e);
    this._onRedoBound = (e) => this._onRedo(e);
    Blockbench.on('undo', this._onUndoBound);
    Blockbench.on('redo', this._onRedoBound);

    // Persist chains in the .bbmodel project file
    this._compileBound = (e) => this._onCompile(e);
    this._parseBound   = (e) => this._onParse(e);
    Codecs.project.on('compile', this._compileBound);
    Codecs.project.on('parsed',  this._parseBound);  // 'parsed' fires after bones are in Group.all

    this._registerActions();
    this._registerPanel();
    this._wireCanvas();
    console.log('[AzureIK] IK registered');
  },

  unregister() {
    if (!this._registered) return;
    this._registered = false;

    Blockbench.removeListener('display_animation_frame', this._onFrameBound);
    Blockbench.removeListener('undo', this._onUndoBound);
    Blockbench.removeListener('redo', this._onRedoBound);
    Codecs.project.events.compile.remove(this._compileBound);
    if (Codecs.project.events.parsed) Codecs.project.events.parsed.remove(this._parseBound);

    this.chains.forEach(c => c.dispose());
    this.chains = [];

    this._createAction?.delete();
    this._bakeAllAction?.delete();
    this._createAction  = null;
    this._bakeAllAction = null;

    this._unregisterPanel();
    this._unwireCanvas();
    IKOverlay.dispose();
    console.log('[AzureIK] IK unregistered');
  },

  // ── State serialization (shared by project persistence and undo) ──────────

  serializeState() {
    const metaData = meta => ({
      pos:        meta.position.toArray(),
      pinned:     meta.pinned,
      userPlaced: meta.userPlaced,
      keys:       meta.keys.map(k => ({ time: k.time, pos: k.pos.slice() })),
    });
    return this.chains.map(chain => ({
      name:      chain.name,
      enabled:   chain.enabled,
      hingeAxis: chain.hingeAxis,
      bones:     chain.bones.map(b => b.name),
      metaTip:   metaData(chain.metaTip),
      metaKnee:  metaData(chain.metaKnee),
      metaRoot:  metaData(chain.metaRoot),
    }));
  },

  /**
   * Apply a serialized IK state. Existing chains matching by name + bone list
   * are updated in place (no gizmo flicker); mismatched or missing chains are
   * rebuilt; chains absent from the state are disposed.
   */
  applyState(state) {
    if (!Array.isArray(state)) return;

    const wanted = new Map(state.map(s => [s.name, s]));

    // Dispose chains that no longer exist, or whose bone list changed
    this.chains = this.chains.filter(chain => {
      const data = wanted.get(chain.name);
      const sameBones = data && data.bones.join('\u0000') ===
        chain.bones.map(b => b.name).join('\u0000');
      if (!sameBones) { chain.dispose(); return false; }
      return true;
    });

    const applyMeta = (meta, d) => {
      if (!d) return;
      if (Array.isArray(d.pos)) meta.moveTo(new THREE.Vector3(...d.pos));
      meta.pinned     = !!d.pinned;
      meta.pinnedPos  = meta.pinned ? meta.position.clone() : null;
      meta.userPlaced = !!d.userPlaced;
      meta.keys = Array.isArray(d.keys)
        ? d.keys
            .filter(k => typeof k?.time === 'number' && Array.isArray(k?.pos))
            .map(k => ({ time: k.time, pos: k.pos.slice() }))
            .sort((a, b) => a.time - b.time)
        : [];
      meta.refreshColor();
    };

    for (const data of state) {
      let chain = this.chains.find(c => c.name === data.name);
      if (!chain) {
        const bones = data.bones
          .map(name => Group.all.find(g => g.name === name))
          .filter(Boolean);
        if (bones.length < 2) continue;
        chain = new IKChain(data.name, bones);
        this.chains.push(chain);
      }
      chain.enabled   = data.enabled ?? true;
      chain.hingeAxis = data.hingeAxis ?? null;
      applyMeta(chain.metaTip,  data.metaTip);
      applyMeta(chain.metaKnee, data.metaKnee);
      applyMeta(chain.metaRoot, data.metaRoot);
      chain._updateLines();
    }

    this._panel?.vue?.$forceUpdate();
    // Re-pose the model for the restored state. preview() fires
    // display_animation_frame → _onFrame refreshes targets and re-solves.
    if (Animator.open) { try { Animator.preview(); } catch (_) {} }
  },

  // ── Undo/redo integration ─────────────────────────────────────────────────
  // Blockbench's UndoSystem has a fixed set of aspects and can't carry IK
  // state natively. We push a (possibly empty) entry onto its stack via
  // initEdit/finishEdit, remember our own before/after snapshots keyed on
  // that entry object, and restore them when Blockbench fires 'undo'/'redo'.

  _undoMap: new WeakMap(),

  /** Push an undo entry pairing Blockbench's stack with our IK snapshots. */
  _commitIKUndo(name, beforeState, afterState = this.serializeState()) {
    try {
      Undo.initEdit({});
      Undo.finishEdit(name);
      const entry = Undo.history?.[Undo.index - 1];
      if (entry) this._undoMap.set(entry, { before: beforeState, after: afterState });
    } catch (err) {
      console.warn('[AzureIK] Could not register undo entry:', err);
    }
  },

  /** Run `fn` and record it as a single undoable IK edit. */
  _withUndo(name, fn) {
    const before = this.serializeState();
    const result = fn();
    this._commitIKUndo(name, before);
    return result;
  },

  _onUndo({ entry } = {}) {
    const snap = entry && this._undoMap.get(entry);
    if (snap) this.applyState(snap.before);
  },

  _onRedo({ entry } = {}) {
    const snap = entry && this._undoMap.get(entry);
    if (snap) this.applyState(snap.after);
  },

  // ── Project persistence ───────────────────────────────────────────────────

  _onCompile(event) {
    if (Format?.id !== 'azure_model') return;
    if (!this.chains.length) return;
    event.model.azureIKChains = this.serializeState();
  },

  _onParse(event) {
    const model = event.model || {};
    const saved = model.azureIKChains;
    if (!Array.isArray(saved) || !saved.length) return;

    // Full rebuild on project load
    this.chains.forEach(c => c.dispose());
    this.chains = [];
    this.applyState(saved);
    console.log(`[AzureIK] Restored ${this.chains.length} IK chain(s) from project.`);
  },

  // ── Frame solve ───────────────────────────────────────────────────────────

  _onFrame() {
    if (Format?.id !== 'azure_model') return;
    if (!Animator.open) return;
    if (this._baking) return;          // bake loop drives its own solves
    if (this._dragState) return;       // drag handler already solves

    // This event fires at the END of Animator.preview(), i.e. after Blockbench
    // has reset every bone mesh to its keyframed pose for the current time.
    // Solving here is therefore idempotent: each frame starts from the clean
    // FK pose, so repeated solves can no longer corrupt bone rotations the way
    // stale-target solving used to.
    const time = Timeline.time || 0;
    for (const chain of this.chains) {
      if (!chain.enabled) continue;
      const needsSolve = chain.updateTargetsForTime(time);
      if (needsSolve) chain.solve();
    }
  },

  // ── Chain management ──────────────────────────────────────────────────────

  /**
   * Walk a bone's direct children, following the single-child spine downward.
   * Stops when a bone has 0 or 2+ Group children (fork or leaf).
   * Returns the ordered array [root, child, grandchild, ...].
   */
  _walkChain(root) {
    const chain = [root];
    let current = root;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const childBones = (current.children || []).filter(c => c instanceof Group);
      if (childBones.length !== 1) break;   // stop at fork or leaf
      current = childBones[0];
      chain.push(current);
      if (chain.length > 64) break;         // safety cap
    }
    return chain;
  },

  /**
   * Sort a flat selection of Group bones into parent-first hierarchy order
   * by checking parent links. Falls back to the raw selection if the bones
   * are not all in the same chain.
   */
  _sortByHierarchy(bones) {
    if (!bones.length) return bones;

    // Build a set for fast membership lookup
    const set = new Set(bones);

    // Find the root: the bone whose parent is NOT in the selection
    const roots = bones.filter(b => {
      let p = b.parent;
      while (p) {
        if (set.has(p)) return false;
        p = p.parent;
      }
      return true;
    });

    if (roots.length !== 1) return bones;  // multiple roots → can't determine order

    // Walk down from root, picking only bones that are in the selection
    const sorted = [];
    const visit = (bone) => {
      if (!set.has(bone)) return;
      sorted.push(bone);
      (bone.children || [])
        .filter(c => c instanceof Group && set.has(c))
        .forEach(visit);
    };
    visit(roots[0]);

    return sorted.length === bones.length ? sorted : bones;
  },

  createChainFromSelection() {
    // In Animate mode Blockbench routes bone selection through the BoneAnimator /
    // timeline, so Outliner.selected is often empty even when a bone is visibly
    // highlighted. We therefore check every available selection source and merge
    // them, deduplicated, so the function works in both Edit and Animate mode.
    const selSources = [
      ...(Outliner.selected              || []),
      ...(Group.selected                 || []),  // populated in Animate mode
      ...(Project?.selected_elements     || []),
    ];
    const rawSel = [...new Set(selSources)].filter(el => el instanceof Group);
    console.log('[AzureIK] createChainFromSelection — rawSel:', rawSel.map(g => g.name),
      '| Outliner.selected:', (Outliner.selected || []).map(g => g.name ?? g.constructor?.name),
      '| Group.selected:', (Array.isArray(Group?.selected) ? Group.selected : [Group?.selected])
        .filter(Boolean).map(g => g.name));

    let bones;

    if (rawSel.length === 1) {
      // Single bone selected — auto-walk down its child spine
      bones = this._walkChain(rawSel[0]);
      if (bones.length < 2) {
        Blockbench.showMessage(
          `"${rawSel[0].name}" has no single-child chain to follow. ` +
          'Select the bones you want manually (root → tip) and try again.',
          'center',
        );
        return null;
      }
    } else if (rawSel.length >= 2) {
      // Multi-selection — sort into hierarchy order
      bones = this._sortByHierarchy(rawSel);
      if (bones.length < 2) {
        Blockbench.showMessage('Could not determine chain order. Select bones from root → tip.', 'center');
        return null;
      }
    } else {
      // Last resort: try the most recently interacted-with Group anywhere in BB's state
      const lastGroup = typeof Group !== 'undefined' && Group.all
        ? Group.all.find(g => g.selected)
        : null;
      if (lastGroup) {
        bones = this._walkChain(lastGroup);
        if (bones.length < 2) {
          Blockbench.showMessage(
            `"${lastGroup.name}" has no child chain to follow. Select a root bone with children.`,
            'center',
          );
          return null;
        }
      } else {
        console.warn('[AzureIK] createChainFromSelection: no Group found in any selection source.',
          { OutlinerSelected: Outliner.selected, GroupSelected: Group?.selected });
        Blockbench.showMessage(
          'No bone selected. Click a bone in the Outliner or viewport first, then press Create IK Chain.',
          'center',
        );
        return null;
      }
    }

    const name  = `Chain_${this.chains.length + 1}`;
    const before = this.serializeState();
    const chain = new IKChain(name, bones);
    this.chains.push(chain);
    this._commitIKUndo(`Create IK chain (${name})`, before);
    Blockbench.showMessage(`IK chain "${name}" created (${bones.length} bones).`, 'center');
    this._panel?.vue?.$forceUpdate();
    return chain;
  },

  removeChain(chain) {
    const before = this.serializeState();
    chain.dispose();
    this.chains = this.chains.filter(c => c !== chain);
    this._commitIKUndo(`Remove IK chain (${chain.name})`, before);
    this._panel?.vue?.$forceUpdate();
  },

  // ── Bake ──────────────────────────────────────────────────────────────────

  bakeChain(chain) {
    const anim = Animation.selected;
    if (!anim) {
      Blockbench.showMessageBox({ title: 'No Animation', message: 'Please select an animation first.' });
      return;
    }
    new Dialog({
      id:    'azl_ik_bake',
      title: `Bake IK — ${chain.name}`,
      form: {
        fps:       { label: 'Samples per second', type: 'number', value: anim.snapping || 20, min: 1, max: 120 },
        overwrite: { label: 'Overwrite existing rotation keyframes', type: 'checkbox', value: true },
        disable:   { label: 'Disable chain after baking', type: 'checkbox', value: true },
      },
      onConfirm: ({ fps, overwrite, disable }) => this._doBake([chain], fps, overwrite, disable),
    }).show();
  },

  bakeAllChains() {
    if (!this.chains.length) return;
    const anim = Animation.selected;
    if (!anim) {
      Blockbench.showMessageBox({ title: 'No Animation', message: 'Please select an animation first.' });
      return;
    }
    new Dialog({
      id:    'azl_ik_bake_all',
      title: 'Bake All IK Chains',
      form: {
        fps:       { label: 'Samples per second', type: 'number', value: anim.snapping || 20, min: 1, max: 120 },
        overwrite: { label: 'Overwrite existing rotation keyframes', type: 'checkbox', value: true },
        disable:   { label: 'Disable chains after baking', type: 'checkbox', value: true },
      },
      onConfirm: ({ fps, overwrite, disable }) => this._doBake(this.chains, fps, overwrite, disable),
    }).show();
  },

  _doBake(chains, fps, overwrite, disableAfter = true) {
    const anim = Animation.selected;
    if (!anim) return;

    this._baking = true;
    const timeBefore  = Timeline.time || 0;
    const totalFrames = Math.max(1, Math.ceil(anim.length * fps));

    // ── PASS 1 — sample ──────────────────────────────────────────────────
    // Scrub every frame, refresh targets, solve, and RECORD the deltas.
    // Nothing is written to the animation yet: mutating keyframes while
    // sampling would change the interpolated pose of every later frame
    // (the old one-pass bake drifted for exactly this reason).
    const samples = [];   // [{ time, deltas: { boneUuid: {x,y,z} } }]

    for (let f = 0; f <= totalFrames; f++) {
      const time = Math.round((f / fps) * 1e6) / 1e6;
      Timeline.setTime(time);
      Animator.preview();

      const frame = { time, deltas: {} };
      for (const chain of chains) {
        if (!chain.enabled) continue;
        chain.updateTargetsForTime(time);
        // A single solve() is exact per bone but processed root→tip, so a
        // couple of passes settle interactions along long chains.
        for (let it = 0; it < 3; it++) chain.solve();
        Object.assign(frame.deltas, chain._lastRotDelta);
      }

      // Euler continuity: unwrap ±360° flips between consecutive samples so
      // linear interpolation between baked keys never spins the long way.
      const prev = samples.at(-1)?.deltas;
      if (prev) {
        for (const [uuid, d] of Object.entries(frame.deltas)) {
          const p = prev[uuid];
          if (!p) continue;
          for (const ax of ['x', 'y', 'z']) {
            while (d[ax] - p[ax] >  180) d[ax] -= 360;
            while (d[ax] - p[ax] < -180) d[ax] += 360;
          }
        }
      }
      samples.push(frame);
    }

    // ── PASS 2 — write ───────────────────────────────────────────────────
    const ikBefore = this.serializeState();
    Undo.initEdit({ animations: [anim] });

    const bakeBones = new Map();
    chains.forEach(c => c.bones.slice(0, -1).forEach(b => bakeBones.set(b.uuid, b)));

    for (const bone of bakeBones.values()) {
      const animator = anim.getBoneAnimator(bone);
      if (!animator) continue;

      if (overwrite) {
        // Replace the WHOLE rotation channel. The sampled deltas already
        // include the original FK keyframed pose (delta = mesh − rest), so
        // any old rotation keys left behind would double-apply.
        const old = animator.keyframes.filter(k => k.channel === 'rotation');
        for (const k of old) {
          if (typeof k.remove === 'function') {
            k.remove();
          } else {
            const idx = animator.keyframes.indexOf(k);
            if (idx !== -1) animator.keyframes.splice(idx, 1);
          }
        }
      }

      for (const s of samples) {
        const d = s.deltas[bone.uuid];
        if (!d) continue;

        // Sign convention: BoneAnimator.displayRotation applies keyframe
        // values as  mesh.rotation[axis] += degToRad(v) * (axis==z ? 1 : -1)
        // so the stored keyframe must negate X and Y to reproduce the pose.
        animator.addKeyframe({
          channel:       'rotation',
          time:          s.time,
          interpolation: 'linear',
          data_points:   [{
            x: (-d.x).toFixed(4),
            y: (-d.y).toFixed(4),
            z: ( d.z).toFixed(4),
          }],
        });
      }
    }

    Undo.finishEdit(`Bake IK: ${chains.map(c => c.name).join(', ')}`);

    // The baked keyframes now contain the solved pose. Leaving the chains
    // enabled would re-solve on top of it every frame, so switch them off
    // (the user can re-enable from the panel to iterate).
    if (disableAfter) chains.forEach(c => { c.enabled = false; });

    // Pair IK snapshots with the bake's own undo entry: undoing the bake
    // restores the keyframes (Blockbench) AND re-enables the chains (ours).
    const bakeEntry = Undo.history?.[Undo.index - 1];
    if (bakeEntry) {
      this._undoMap.set(bakeEntry, { before: ikBefore, after: this.serializeState() });
    }

    this._baking = false;
    Timeline.setTime(timeBefore);
    Animator.preview();
    this._panel?.vue?.$forceUpdate();

    const label = chains.length === 1 ? `"${chains[0].name}"` : `${chains.length} chains`;
    Blockbench.showMessage(`✓ Baked ${label} — ${totalFrames + 1} frames @ ${fps} fps`, 'center');
  },

  // ── BB Actions ────────────────────────────────────────────────────────────

  _registerActions() {
    this._createAction = new Action('azl_ik_create_chain', {
      name:        'Create IK Chain',
      description: 'Select a root bone (auto-walks children) or multiple bones (root → tip)',
      icon:        'icon-bone',
      category:    'animation',
      condition:   () => Format?.id === 'azure_model' && Animator.open,
      click:       () => this.createChainFromSelection(),
    });

    this._bakeAllAction = new Action('azl_ik_bake_all', {
      name:        'Bake All IK Chains',
      description: 'Write solved IK rotations as keyframes into the active animation',
      icon:        'icon-keyframe',
      category:    'animation',
      condition:   () => Format?.id === 'azure_model' && Animator.open && this.chains.length > 0,
      click:       () => this.bakeAllChains(),
    });

    // Append to Animation menu and Outliner toolbar
    try { MenuBar.menus?.animation?.addAction(this._createAction); }   catch (_) {}
    try { MenuBar.menus?.animation?.addAction(this._bakeAllAction); }  catch (_) {}
    try { Toolbars.outliner?.add(this._createAction); }                catch (_) {}
  },

  // ── Persistent side panel ─────────────────────────────────────────────────

  _registerPanel() {
    const manager = this;

    this._panel = new Panel('azl_ik_panel', {
      name: 'IK Chains',
      icon: 'icon-bone',
      display_condition: {
        modes:   ['animate'],
        formats: ['azure_model'],
      },
      default_position: {
        slot:   'left_bar',
        float_position: [0, 0],
        float_size:     [300, 400],
        folded: false,
      },
      component: {
        name: 'azl-ik-panel',
        data() {
          return { manager };
        },
        computed: {
          chains() { return this.manager.chains; },
        },
        methods: {
          createChain() { manager.createChainFromSelection(); },
          removeChain(chain) { manager.removeChain(chain); },
          toggleEnabled(chain) {
            manager._withUndo(
              `${chain.enabled ? 'Disable' : 'Enable'} IK chain (${chain.name})`,
              () => { chain.enabled = !chain.enabled; },
            );
          },
          togglePin(meta) {
            manager._withUndo(
              `${meta.pinned ? 'Unpin' : 'Pin'} IK ${meta.role}`,
              () => meta.togglePin(),
            );
            this.$forceUpdate();
          },
          toggleHinge(chain, ax) {
            manager._withUndo(
              `Toggle IK hinge (${chain.name})`,
              () => chain.toggleHinge(ax),
            );
            this.$forceUpdate();
          },
          bakeChain(chain) { manager.bakeChain(chain); },
          bakeAll() { manager.bakeAllChains(); },
          addKey(meta) {
            manager._withUndo(
              `Key IK ${meta.role} target`,
              () => meta.addKey(Timeline.time || 0),
            );
            this.$forceUpdate();
          },
          deleteKey(meta) {
            manager._withUndo(
              `Remove IK ${meta.role} target key`,
              () => meta.removeKeyNear(Timeline.time || 0),
            );
            this.$forceUpdate();
          },
          clearKeys(meta) {
            manager._withUndo(
              `Clear IK ${meta.role} target keys`,
              () => meta.clearKeys(),
            );
            this.$forceUpdate();
          },
          resumeFollow(meta) {
            manager._withUndo(
              `Release IK ${meta.role} target`,
              () => meta.resumeFollow(),
            );
            // Re-place targets and re-solve for the current frame
            if (Animator.open) { try { Animator.preview(); } catch (_) {} }
            this.$forceUpdate();
          },
          metaDotColor(meta) {
            if (meta.pinned)          return '#ff2255';
            if (meta.role === 'tip')  return '#00ff88';
            if (meta.role === 'knee') return '#44aaff';
            return '#ff9900';
          },
        },
        template: `
<div style="padding:8px;font-size:12px;">

  <!-- Empty state -->
  <div v-if="!chains.length" style="color:var(--color-subtle);line-height:1.6;padding:4px 2px;">
    <p style="margin:0 0 6px 0;">No IK chains yet.</p>
    <p style="margin:0;">Select a <b>root bone</b> in the Outliner — its child chain will be detected automatically. Or select multiple bones (root → tip) for a custom chain.</p>
  </div>

  <!-- Chain cards -->
  <div v-for="chain in chains" :key="chain.name"
       style="border:1px solid var(--color-border);border-radius:4px;padding:7px 8px;margin-bottom:7px;">

    <!-- Chain header -->
    <div style="display:flex;align-items:center;gap:5px;margin-bottom:5px;">
      <input type="checkbox" :checked="chain.enabled" @change="toggleEnabled(chain)" style="cursor:pointer;" title="Enable / disable solving">
      <span style="flex:1;font-weight:600;">{{ chain.name }}</span>
      <span style="font-size:10px;color:var(--color-subtle);">{{ chain.bones.length }} bones</span>
      <button class="dark_bordered" @click="removeChain(chain)" style="padding:1px 6px;cursor:pointer;" title="Remove chain">✕</button>
    </div>

    <!-- Tip meta row -->
    <div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;">
      <span style="width:9px;height:9px;border-radius:2px;flex-shrink:0;display:inline-block;"
            :style="{ background: metaDotColor(chain.metaTip) }"></span>
      <span style="flex:1;">🟢 Tip <small style="color:var(--color-subtle);">(drag in viewport)</small></span>
      <span v-if="chain.metaTip.keys.length" style="font-size:10px;color:var(--color-accent);"
            :title="chain.metaTip.keys.length + ' target key(s)'">◆{{ chain.metaTip.keys.length }}</span>
      <button v-if="chain.metaTip.userPlaced && !chain.metaTip.pinned && !chain.metaTip.keys.length"
              class="dark_bordered" @click="resumeFollow(chain.metaTip)"
              style="padding:1px 6px;cursor:pointer;"
              title="Release — resume following the animation">⟳</button>
      <button class="dark_bordered" @click="addKey(chain.metaTip)"
              style="padding:1px 6px;cursor:pointer;"
              title="Key the Tip target at the current timeline position">⏺</button>
      <button v-if="chain.metaTip.keys.length" class="dark_bordered" @click="clearKeys(chain.metaTip)"
              style="padding:1px 6px;cursor:pointer;color:var(--color-subtle);"
              title="Clear all Tip target keys">✕◆</button>
      <button class="dark_bordered" @click="togglePin(chain.metaTip)"
              :style="{ padding:'1px 8px', cursor:'pointer', color: chain.metaTip.pinned ? '#ff2255' : '' }"
              :title="chain.metaTip.pinned ? 'Unpin Tip' : 'Pin Tip to current world position (floor anchor)'">
        {{ chain.metaTip.pinned ? '📌 Pinned' : 'Pin' }}
      </button>
    </div>

    <!-- Knee meta row -->
    <div style="display:flex;align-items:center;gap:5px;margin-bottom:3px;">
      <span style="width:9px;height:9px;border-radius:2px;flex-shrink:0;display:inline-block;"
            :style="{ background: metaDotColor(chain.metaKnee) }"></span>
      <span style="flex:1;">🔵 Knee <small style="color:var(--color-subtle);">(pole vector)</small></span>
      <span v-if="chain.metaKnee.keys.length" style="font-size:10px;color:var(--color-accent);"
            :title="chain.metaKnee.keys.length + ' target key(s)'">◆{{ chain.metaKnee.keys.length }}</span>
      <button v-if="chain.metaKnee.userPlaced && !chain.metaKnee.pinned && !chain.metaKnee.keys.length"
              class="dark_bordered" @click="resumeFollow(chain.metaKnee)"
              style="padding:1px 6px;cursor:pointer;"
              title="Release — resume following the animation">⟳</button>
      <button class="dark_bordered" @click="addKey(chain.metaKnee)"
              style="padding:1px 6px;cursor:pointer;"
              title="Key the Knee target at the current timeline position">⏺</button>
      <button v-if="chain.metaKnee.keys.length" class="dark_bordered" @click="clearKeys(chain.metaKnee)"
              style="padding:1px 6px;cursor:pointer;color:var(--color-subtle);"
              title="Clear all Knee target keys">✕◆</button>
      <button class="dark_bordered" @click="togglePin(chain.metaKnee)"
              :style="{ padding:'1px 8px', cursor:'pointer', color: chain.metaKnee.pinned ? '#ff2255' : '' }"
              :title="chain.metaKnee.pinned ? 'Unpin Knee' : 'Pin Knee to current world position'">
        {{ chain.metaKnee.pinned ? '📌 Pinned' : 'Pin' }}
      </button>
    </div>

    <!-- Root meta row (informational anchor) -->
    <div style="display:flex;align-items:center;gap:5px;margin-bottom:5px;">
      <span style="width:9px;height:9px;border-radius:2px;flex-shrink:0;display:inline-block;"
            :style="{ background: metaDotColor(chain.metaRoot) }"></span>
      <span style="flex:1;">🟠 Root <small style="color:var(--color-subtle);">(follows body)</small></span>
    </div>

    <!-- Hinge lock -->
    <div style="display:flex;align-items:center;gap:3px;margin-bottom:6px;">
      <span style="flex:1;font-size:11px;color:var(--color-text);">Hinge:</span>
      <button v-for="ax in ['x','y','z']" :key="ax" class="dark_bordered"
              @click="toggleHinge(chain, ax)"
              :style="{ padding:'1px 8px', cursor:'pointer', fontSize:'11px',
                        color: chain.hingeAxis === ax ? 'var(--color-accent)' : '',
                        borderColor: chain.hingeAxis === ax ? 'var(--color-accent)' : '' }"
              :title="'Restrict joints to ' + ax.toUpperCase() + ' axis rotation only'">
        {{ ax.toUpperCase() }}
      </button>
      <button v-if="chain.hingeAxis" class="dark_bordered"
              @click="toggleHinge(chain, chain.hingeAxis)"
              style="padding:1px 6px;cursor:pointer;font-size:11px;color:var(--color-subtle);"
              title="Remove hinge lock">✕</button>
      <span v-if="!chain.hingeAxis" style="font-size:10px;color:var(--color-subtle);margin-left:2px;">None</span>
    </div>

    <!-- Per-chain bake -->
    <button class="dark_bordered" @click="bakeChain(chain)"
            style="width:100%;padding:3px;cursor:pointer;font-size:11px;">
      ⬇ Bake to Keyframes
    </button>
  </div>

  <!-- Create button — always visible -->
  <button class="dark_bordered" @click="createChain()"
          style="width:100%;padding:4px;cursor:pointer;margin-top:2px;font-weight:600;">
    + Create IK Chain from Selection
  </button>

  <!-- Bake all — only when multiple chains -->
  <button v-if="chains.length > 1" class="dark_bordered" @click="bakeAll()"
          style="width:100%;padding:4px;cursor:pointer;margin-top:4px;
                 background:var(--color-accent);color:#fff;border-color:var(--color-accent);">
    ⬇ Bake ALL Chains
  </button>

</div>`,
      },
    });
  },

  _unregisterPanel() {
    if (this._panel) {
      this._panel.delete();
      this._panel = null;
    }
  },

  // ── Canvas drag ───────────────────────────────────────────────────────────
  // We attach to the Preview wrapper element (not the raw canvas) using
  // pointerdown/pointermove/pointerup so we don't race with Blockbench's own
  // mouse handler. We only intercept when the pointer hits a Meta gizmo.

  _wireCanvas() {
    setTimeout(() => {
      // Blockbench's main 3-D viewport wrapper — more reliable than querying canvas
      const el = document.getElementById('preview') ?? document.querySelector('.preview');
      if (!el) {
        console.warn('[AzureIK] Could not find preview element for drag wiring');
        return;
      }
      this._canvas = el;

      this._onDownBound = e => this._onDown(e);
      this._onMoveBound = e => this._onMove(e);
      this._onUpBound   = e => this._onUp(e);

      el.addEventListener('pointerdown', this._onDownBound);
      el.addEventListener('pointermove', this._onMoveBound);
      el.addEventListener('pointerup',   this._onUpBound);
      window.addEventListener('pointerup', this._onUpBound);
    }, 1200);
  },

  _unwireCanvas() {
    if (!this._canvas) return;
    this._canvas.removeEventListener('pointerdown', this._onDownBound);
    this._canvas.removeEventListener('pointermove', this._onMoveBound);
    this._canvas.removeEventListener('pointerup',   this._onUpBound);
    window.removeEventListener('pointerup', this._onUpBound);
    this._canvas = null;
  },

  _ndc(e, el) {
    const r = el.getBoundingClientRect();
    return new THREE.Vector2(
      ((e.clientX - r.left) / r.width)  *  2 - 1,
      ((e.clientY - r.top)  / r.height) * -2 + 1,
    );
  },

  _pickMeta(e) {
    const cam = Preview.selected?.camera;
    if (!cam || !this._canvas) return null;

    this._raycaster.setFromCamera(this._ndc(e, this._canvas), cam);

    // Collect only the root mesh of each meta (not children like the wireframe)
    const meshes = this.chains.flatMap(c =>
      [c.metaTip, c.metaKnee, c.metaRoot].filter(m => m._mesh).map(m => m._mesh)
    );
    if (!meshes.length) return null;

    const hits = this._raycaster.intersectObjects(meshes, false);
    if (!hits.length) return null;

    const id = hits[0].object.userData.ikMetaId;
    for (const chain of this.chains) {
      for (const meta of [chain.metaTip, chain.metaKnee, chain.metaRoot]) {
        if (meta.id === id) return { meta, chain };
      }
    }
    return null;
  },

  _onDown(e) {
    if (e.button !== 0) return;
    const hit = this._pickMeta(e);
    if (!hit) return;

    // The root gizmo is informational (it always follows the chain root) —
    // let the click fall through to Blockbench instead of a pointless drag.
    if (hit.meta.role === 'root') return;

    // Confirmed meta hit — fully consume this event so Blockbench's bone
    // selection / orbit handlers never see it
    e.preventDefault();
    e.stopImmediatePropagation();
    try { this._canvas.setPointerCapture(e.pointerId); } catch (_) {}

    const { meta, chain } = hit;
    const cam = Preview.selected?.camera;
    // Camera-facing plane through the meta so dragging works at any angle
    const normal = cam
      ? cam.getWorldDirection(new THREE.Vector3()).negate()
      : v3(0, 1, 0);
    this._dragState = {
      meta,
      chain,
      pointerId: e.pointerId,
      plane: new THREE.Plane().setFromNormalAndCoplanarPoint(normal, meta.position),
      beforeState: this.serializeState(),  // snapshot for undo
      moved: false,
    };
  },

  _onMove(e) {
    if (!this._dragState || e.pointerId !== this._dragState.pointerId) return;
    e.preventDefault();
    e.stopImmediatePropagation();

    const { meta, plane } = this._dragState;
    if (meta.pinned) return;

    const cam = Preview.selected?.camera;
    if (!cam || !this._canvas) return;

    this._raycaster.setFromCamera(this._ndc(e, this._canvas), cam);
    const hit = new THREE.Vector3();
    if (!this._raycaster.ray.intersectPlane(plane, hit)) return;

    meta.moveTo(hit);
    // The user has explicitly placed this target — hold it here and keep
    // driving the chain even after release (instead of snapping back to
    // follow mode on the next preview frame, which is what made anchors
    // appear to "not follow").
    meta.userPlaced = true;
    this._dragState.moved = true;
    // Solve ONLY the dragged chain, directly — do NOT dispatch
    // display_animation_frame (triggers Blockbench's selection/preview
    // pipeline and causes wild jumps), and do NOT solve other chains:
    // without a preview() reset between moves, repeated solves against
    // their stale targets accumulate rotation drift.
    this._dragState.chain.solve();
  },

  _onUp(e) {
    if (this._dragState && e.pointerId === this._dragState.pointerId) {
      try { this._canvas?.releasePointerCapture(e.pointerId); } catch (_) {}
      const { moved, beforeState, meta, chain } = this._dragState;
      this._dragState = null;
      if (moved) {
        this._commitIKUndo(
          `Move IK ${meta.role} (${chain.name})`,
          beforeState,
        );
        this._panel?.vue?.$forceUpdate();
      }
    }
  },
};

// ---------------------------------------------------------------------------
// DOM helpers — module-level, used by the Vue panel template methods
// ---------------------------------------------------------------------------

const _row = () => {
  const el = document.createElement('div');
  el.style.cssText = 'display:flex;align-items:center;gap:4px;';
  return el;
};

const _btn = (text, onClick, extraStyle = '', title = '') => {
  const b = document.createElement('button');
  b.className = 'dark_bordered';
  b.textContent = text;
  b.title = title;
  b.style.cssText = `padding:2px 8px;cursor:pointer;${extraStyle}`;
  b.onclick = onClick;
  return b;
};

// ---------------------------------------------------------------------------
// Public lifecycle exports — consumed by azure-animation-tab.js
// ---------------------------------------------------------------------------

export function registerIK()   { IKManager.register(); }
export function unregisterIK() { IKManager.unregister(); }