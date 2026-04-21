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
 *   • Hinge Lock — restricts joint rotation to one axis (X/Y/Z)
 *   • Bake — scrubs every frame, solves IK, writes rotation keyframes
 *     into the active animation via Blockbench's undo system
 *
 * © 2025 AzureDoom — MIT License
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
    this.refreshColor();
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

    if (!this.metaTip.pinned) this.metaTip.moveTo(solved.at(-1));
    this._updateLines();
  }

  _writeRotations(solved) {
    this._lastRotDelta = {};

    for (let i = 0; i < this.bones.length - 1; i++) {
      const bone     = this.bones[i];
      const boneMesh = bone.mesh;
      if (!boneMesh) continue;

      const worldStart = solved[i].clone();
      const worldEnd   = solved[i + 1].clone();

      // Convert start and end into this bone's LOCAL space
      // (exactly as Blockbench's own IK does in timeline_animators.js)
      boneMesh.updateWorldMatrix(true, false);
      const localStart = boneMesh.worldToLocal(worldStart.clone());
      const localEnd   = boneMesh.worldToLocal(worldEnd.clone());
      const localDir   = localEnd.clone().sub(localStart).normalize();

      if (localDir.lengthSq() < 1e-8) continue;

      // Rest-pose direction in local space:
      // In rest pose the bone points from its own origin toward the next bone's origin.
      // After worldToLocal this becomes the local +Y direction (0,1,0) assuming
      // the bone is at its rest rotation. We use the actual rest direction from origins.
      const nextBone = this.bones[i + 1];
      const restDir  = new THREE.Vector3(
        nextBone.origin[0] - bone.origin[0],
        nextBone.origin[1] - bone.origin[1],
        nextBone.origin[2] - bone.origin[2],
      );
      // Convert rest direction to bone local space at rest pose
      const restLocal = boneMesh.worldToLocal(
        new THREE.Vector3(
          bone.mesh.getWorldPosition(new THREE.Vector3()).x + restDir.x,
          bone.mesh.getWorldPosition(new THREE.Vector3()).y + restDir.y,
          bone.mesh.getWorldPosition(new THREE.Vector3()).z + restDir.z,
        )
      ).normalize();

      if (restLocal.lengthSq() < 1e-8) continue;

      // Quaternion that rotates restLocal → localDir (both in bone local space)
      const q = new THREE.Quaternion().setFromUnitVectors(restLocal, localDir);
      const euler = new THREE.Euler().setFromQuaternion(q, boneMesh.rotation.order || 'ZYX');

      // Apply: ADD to current mesh rotation (same as Blockbench's IK)
      boneMesh.rotation.x += euler.x;
      boneMesh.rotation.y += euler.y;
      boneMesh.rotation.z += euler.z;

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
  _onFrameBound:   null,
  _compileBound:   null,
  _parseBound:     null,
  _onDownBound:    null,
  _onMoveBound:    null,
  _onUpBound:      null,
  _panel:          null,
  _createAction:   null,
  _bakeAllAction:  null,

  // ── Public lifecycle ─────────────────────────────────────────────────────

  register() {
    IKOverlay.init();
    IKOverlay.hook();

    this._onFrameBound = () => this._onFrame();
    Blockbench.on('display_animation_frame', this._onFrameBound);

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
    Blockbench.removeListener('display_animation_frame', this._onFrameBound);
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

  // ── Project persistence ───────────────────────────────────────────────────

  _onCompile(event) {
    if (Format?.id !== 'azure_model') return;
    if (!this.chains.length) return;
    event.model.azureIKChains = this.chains.map(chain => ({
      name:      chain.name,
      enabled:   chain.enabled,
      hingeAxis: chain.hingeAxis,
      bones:     chain.bones.map(b => b.name),
      metaTip:  { pos: chain.metaTip.position.toArray(),  pinned: chain.metaTip.pinned },
      metaKnee: { pos: chain.metaKnee.position.toArray(), pinned: chain.metaKnee.pinned },
      metaRoot: { pos: chain.metaRoot.position.toArray(), pinned: chain.metaRoot.pinned },
    }));
  },

  _onParse(event) {
    const model = event.model || {};
    const saved = model.azureIKChains;
    if (!Array.isArray(saved) || !saved.length) return;

    this.chains.forEach(c => c.dispose());
    this.chains = [];

    for (const data of saved) {
      const bones = data.bones
        .map(name => Group.all.find(g => g.name === name))
        .filter(Boolean);
      if (bones.length < 2) continue;

      const chain     = new IKChain(data.name, bones);
      chain.enabled   = data.enabled ?? true;
      chain.hingeAxis = data.hingeAxis ?? null;

      const restore = (meta, saved) => {
        if (saved?.pos) meta.moveTo(new THREE.Vector3(...saved.pos));
        if (saved?.pinned) meta.togglePin();
      };
      restore(chain.metaTip,  data.metaTip);
      restore(chain.metaKnee, data.metaKnee);
      restore(chain.metaRoot, data.metaRoot);

      this.chains.push(chain);
    }

    this._panel?.vue?.$forceUpdate();
    console.log(`[AzureIK] Restored ${this.chains.length} IK chain(s) from project.`);
  },

  // ── Frame solve ───────────────────────────────────────────────────────────

  _onFrame() {
    if (Format?.id !== 'azure_model') return;
    if (!Animator.open) return;
    // Only solve when a Meta is actively being dragged — do NOT solve every frame
    // as that corrupts bone rotations while the user is scrubbing keyframes.
    if (!this._dragState) return;
    this.chains.forEach(c => c.solve());
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
    const chain = new IKChain(name, bones);
    this.chains.push(chain);
    Blockbench.showMessage(`IK chain "${name}" created (${bones.length} bones).`, 'center');
    this._panel?.vue?.$forceUpdate();
    return chain;
  },

  removeChain(chain) {
    chain.dispose();
    this.chains = this.chains.filter(c => c !== chain);
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
        fps:       { label: 'Frames per second', type: 'number', value: 20, min: 1, max: 60 },
        overwrite: { label: 'Overwrite existing rotation keyframes', type: 'checkbox', value: true },
      },
      onConfirm: ({ fps, overwrite }) => this._doBake([chain], fps, overwrite),
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
        fps:       { label: 'Frames per second', type: 'number', value: 20, min: 1, max: 60 },
        overwrite: { label: 'Overwrite existing rotation keyframes', type: 'checkbox', value: true },
      },
      onConfirm: ({ fps, overwrite }) => this._doBake(this.chains, fps, overwrite),
    }).show();
  },

  _doBake(chains, fps, overwrite) {
    const anim = Animation.selected;
    if (!anim) return;

    Undo.initEdit({ animations: [anim] });
    const totalFrames = Math.ceil(anim.length * fps);

    for (let f = 0; f <= totalFrames; f++) {
      const time = Math.round(f / fps * 1e6) / 1e6;
      Timeline.setTime(time);
      Animator.preview();

      for (const chain of chains) {
        chain.solve();
        for (const bone of chain.bones.slice(0, -1)) {
          const animator = anim.getBoneAnimator(bone);
          if (!animator) continue;

          const delta = chain._lastRotDelta?.[bone.uuid] ?? { x: 0, y: 0, z: 0 };

          if (overwrite) {
            const toRemove = animator.keyframes.filter(
              k => k.channel === 'rotation' && Math.abs(k.time - time) < 0.5 / fps
            );
            toRemove.forEach(k => {
              const idx = animator.keyframes.indexOf(k);
              if (idx !== -1) animator.keyframes.splice(idx, 1);
            });
          }

          animator.addKeyframe({
            channel:       'rotation',
            time,
            interpolation: 'linear',
            data_points:   [{
              x: delta.x.toFixed(4),
              y: delta.y.toFixed(4),
              z: delta.z.toFixed(4),
            }],
          });
        }
      }
    }

    Undo.finishEdit(`Bake IK: ${chains.map(c => c.name).join(', ')}`);
    Timeline.setTime(0);
    Animator.preview();

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
          toggleEnabled(chain) { chain.enabled = !chain.enabled; },
          togglePin(meta) {
            meta.togglePin();
            this.$forceUpdate();
          },
          toggleHinge(chain, ax) {
            chain.toggleHinge(ax);
            this.$forceUpdate();
          },
          bakeChain(chain) { manager.bakeChain(chain); },
          bakeAll() { manager.bakeAllChains(); },
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
      <button class="dark_bordered" @click="togglePin(chain.metaTip)"
              :style="{ padding:'1px 8px', cursor:'pointer', color: chain.metaTip.pinned ? '#ff2255' : '' }"
              :title="chain.metaTip.pinned ? 'Unpin Tip' : 'Pin Tip to current world position (floor anchor)'">
        {{ chain.metaTip.pinned ? '📌 Pinned' : 'Pin' }}
      </button>
    </div>

    <!-- Knee meta row -->
    <div style="display:flex;align-items:center;gap:5px;margin-bottom:5px;">
      <span style="width:9px;height:9px;border-radius:2px;flex-shrink:0;display:inline-block;"
            :style="{ background: metaDotColor(chain.metaKnee) }"></span>
      <span style="flex:1;">🔵 Knee <small style="color:var(--color-subtle);">(pole vector)</small></span>
      <button class="dark_bordered" @click="togglePin(chain.metaKnee)"
              :style="{ padding:'1px 8px', cursor:'pointer', color: chain.metaKnee.pinned ? '#ff2255' : '' }"
              :title="chain.metaKnee.pinned ? 'Unpin Knee' : 'Pin Knee to current world position'">
        {{ chain.metaKnee.pinned ? '📌 Pinned' : 'Pin' }}
      </button>
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

    // Confirmed meta hit — fully consume this event so Blockbench's bone
    // selection / orbit handlers never see it
    e.preventDefault();
    e.stopImmediatePropagation();
    try { this._canvas.setPointerCapture(e.pointerId); } catch (_) {}

    const { meta } = hit;
    const cam = Preview.selected?.camera;
    // Camera-facing plane through the meta so dragging works at any angle
    const normal = cam
      ? cam.getWorldDirection(new THREE.Vector3()).negate()
      : v3(0, 1, 0);
    this._dragState = {
      meta,
      pointerId: e.pointerId,
      plane: new THREE.Plane().setFromNormalAndCoplanarPoint(normal, meta.position),
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
    // Solve directly — do NOT dispatch display_animation_frame as that
    // triggers Blockbench's selection/preview pipeline and causes wild jumps
    for (const chain of this.chains) chain.solve();
  },

  _onUp(e) {
    if (this._dragState && e.pointerId === this._dragState.pointerId) {
      try { this._canvas?.releasePointerCapture(e.pointerId); } catch (_) {}
      this._dragState = null;
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
