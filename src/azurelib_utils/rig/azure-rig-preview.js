/**
 * AzureLib Animator — Rig Preview
 * --------------------------------
 * Shows AzureLib's runtime rig features in the Blockbench viewport:
 *
 *   • Hitboxes, fitted the way AzureLib fits them (the AABB of the bone's own
 *     cubes around its pivot, or an explicit size), coloured like F3 + B.
 *   • Sockets, as a forward arrow (the socket's -Z) and an up arrow.
 *   • Spring colliders, as orange wireframe spheres and capsules.
 *   • In Animate mode, the pose modifiers run on top of the animation every
 *     frame, in AzureLib's priority order, with the same solvers the game
 *     uses: two-bone and CCD IK, look-at, spring bones and constraints.
 *   • Blend spaces, by stacking their samples at AzureLib's weights (without
 *     touching the animations' own playing state or blend weights).
 *
 * The preview never writes keyframes or project data.
 *
 * © 2026 AzureDoom — MIT License
 */

import { RigStore } from './azure-rig-state.js';
import { blendSpaceWeights } from './azure-rig-math.js';

const DEG = Math.PI / 180;
const TICKS_PER_SECOND = 20;
const PIXELS_PER_BLOCK = 16;

const COLOR_COMBAT = 0x55ff55;
const COLOR_STRONG = 0xff5555;
const COLOR_WEAK = 0x5599ff;
const COLOR_INTERACT = 0x55ffff;
const COLOR_ANCHOR = 0xffff55;
const COLOR_SOCKET = 0xff55ff;
const COLOR_SOCKET_UP = 0xaa66ff;
const COLOR_TARGET = 0xffaa00;
const COLOR_COLLIDER = 0xff8a3d;

/** Runtime-only preview switches (not saved with the project). */
export const PreviewSettings = {
  hitboxes: true,
  sockets: true,
  colliders: true,
  modifiers: true,
};

function isActive() {
  return typeof Format !== 'undefined' && Format?.id === 'azure_model' && typeof Project !== 'undefined' && !!Project;
}

function findBone(name) {
  return Group.all.find(g => g.name === name) || null;
}

function findLocator(name) {
  return (typeof Locator !== 'undefined' ? Locator.all : []).find(l => l.name === name) || null;
}

function boneMesh(name) {
  return findBone(name)?.mesh || null;
}

function worldPosition(object, target = new THREE.Vector3()) {
  object.updateWorldMatrix(true, false);
  return target.setFromMatrixPosition(object.matrixWorld);
}

/** Model-space point (Blockbench pixels from the model origin) to world space. */
function modelToWorld(point) {
  const v = new THREE.Vector3(point[0], point[1], point[2]);
  const root = Project?.model_3d;
  if (root) {
    root.updateWorldMatrix(true, false);
    v.applyMatrix4(root.matrixWorld);
  }
  return v;
}

/** A Blockbench rotation in degrees as a quaternion, applied Z, then Y, then X like bone rotations. */
function bbRotation(degrees) {
  return new THREE.Quaternion().setFromEuler(
    new THREE.Euler(degrees[0] * DEG, degrees[1] * DEG, degrees[2] * DEG, 'ZYX'),
  );
}

const overlay = {
  root: null,
  hitboxes: [],
  sockets: [],
  colliders: [],
  dirty: true,
};

function ensureOverlayRoot() {
  if (overlay.root) return overlay.root;
  overlay.root = new THREE.Object3D();
  overlay.root.name = 'azurelib_rig_overlay';
  return overlay.root;
}

function attachOverlayRoot() {
  const root = ensureOverlayRoot();
  const scene = typeof Canvas !== 'undefined' ? Canvas.scene : null;
  if (scene && root.parent !== scene) scene.add(root);
}

function clearOverlay() {
  for (const item of [...overlay.hitboxes, ...overlay.sockets, ...overlay.colliders]) {
    item.object.parent?.remove(item.object);
    item.object.traverse(o => {
      o.geometry?.dispose?.();
      o.material?.dispose?.();
    });
  }
  overlay.hitboxes = [];
  overlay.sockets = [];
  overlay.colliders = [];
}

function hitboxColor(h) {
  if (h.role === 'INTERACT') return COLOR_INTERACT;
  if (h.role === 'ANCHOR') return COLOR_ANCHOR;
  if (h.damageMultiplier > 1) return COLOR_STRONG;
  if (h.damageMultiplier < 1) return COLOR_WEAK;
  return COLOR_COMBAT;
}

/**
 * The hitbox's box in bone space, like AzHitboxClientHooks#fitBoneSpaceBox:
 * bounds of the bone's own cubes around its pivot, explicit size centred on
 * the cubes (or the pivot with anchorAtPivot), plus offset and inflate.
 * Returns {center, half} in pixels, or null when the box would be empty.
 */
export function hitboxBox(h) {
  const bone = findBone(h.bone);
  const mesh = bone?.mesh;
  if (!mesh) return null;

  const bounds = new THREE.Box3();
  mesh.updateWorldMatrix(true, false);
  const toBone = new THREE.Matrix4().copy(mesh.matrixWorld).invert();

  for (const child of bone.children || []) {
    if (!(child instanceof Cube) || !child.mesh?.geometry) continue;
    const geometry = child.mesh.geometry;
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    child.mesh.updateWorldMatrix(true, false);
    const local = new THREE.Matrix4().multiplyMatrices(toBone, child.mesh.matrixWorld);
    const { min, max } = geometry.boundingBox;
    for (let i = 0; i < 8; i++) {
      bounds.expandByPoint(new THREE.Vector3(
        i & 1 ? max.x : min.x,
        i & 2 ? max.y : min.y,
        i & 4 ? max.z : min.z,
      ).applyMatrix4(local));
    }
  }

  const hasCubes = !bounds.isEmpty();
  const center = new THREE.Vector3();
  const half = new THREE.Vector3();

  if (hasCubes && !h.anchorAtPivot) bounds.getCenter(center);

  if (h.fit) {
    if (!hasCubes) return null;
    bounds.getSize(half).multiplyScalar(0.5);
  } else {
    half.set(h.size[0] / 2, h.size[1] / 2, h.size[2] / 2);
  }

  const inflate = Number(h.inflate) || 0;
  half.set(Math.max(0, half.x + inflate), Math.max(0, half.y + inflate), Math.max(0, half.z + inflate));
  if (half.x === 0 && half.y === 0 && half.z === 0) return null;

  // Offsets are Blockbench pixels along the bone's axes; in Blockbench space no axis is mirrored.
  center.add(new THREE.Vector3(h.offset[0], h.offset[1], h.offset[2]));
  return { center, half };
}

function makeBoxLines(color) {
  const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
  const material = new THREE.LineBasicMaterial({ color, depthTest: false, transparent: true, opacity: 0.9 });
  const lines = new THREE.LineSegments(geometry, material);
  lines.renderOrder = 999;
  lines.matrixAutoUpdate = false;
  return lines;
}

function makeArrow(direction, color, length) {
  const arrow = new THREE.ArrowHelper(direction, new THREE.Vector3(), length, color, length * 0.3, length * 0.18);
  arrow.traverse(o => {
    if (o.material) {
      o.material.depthTest = false;
      o.material.transparent = true;
    }
    o.renderOrder = 999;
  });
  return arrow;
}

/**
 * Wireframe for a spring collider in its bone's space (pixels): three rings around each end and,
 * for a capsule, four lines joining the ends.
 */
export function colliderLinePoints(c) {
  const a = new THREE.Vector3(c.start[0], c.start[1], c.start[2]);
  const capsule = c.shape === 'capsule';
  const b = capsule ? new THREE.Vector3(c.end[0], c.end[1], c.end[2]) : a.clone();
  const r = Math.max(0.01, Number(c.radius) || 0);
  const points = [];
  const segments = 24;
  const ring = (center, u, v) => {
    for (let i = 0; i < segments; i++) {
      const t0 = (i / segments) * Math.PI * 2;
      const t1 = ((i + 1) / segments) * Math.PI * 2;
      for (const t of [t0, t1]) {
        points.push(center.x + (u.x * Math.cos(t) + v.x * Math.sin(t)) * r,
          center.y + (u.y * Math.cos(t) + v.y * Math.sin(t)) * r,
          center.z + (u.z * Math.cos(t) + v.z * Math.sin(t)) * r);
      }
    }
  };
  const X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0), Z = new THREE.Vector3(0, 0, 1);
  for (const center of capsule ? [a, b] : [a]) {
    ring(center, X, Y);
    ring(center, X, Z);
    ring(center, Y, Z);
  }
  if (capsule) {
    const axis = b.clone().sub(a);
    if (axis.lengthSq() > 1e-12) {
      axis.normalize();
      const helper = Math.abs(axis.y) < 0.9 ? Y : X;
      const u = new THREE.Vector3().crossVectors(axis, helper).normalize();
      const v = new THREE.Vector3().crossVectors(axis, u).normalize();
      for (const side of [u, v, u.clone().multiplyScalar(-1), v.clone().multiplyScalar(-1)]) {
        points.push(a.x + side.x * r, a.y + side.y * r, a.z + side.z * r, b.x + side.x * r, b.y + side.y * r, b.z + side.z * r);
      }
    }
  }
  return points;
}

function makeColliderLines(c) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(colliderLinePoints(c), 3));
  const material = new THREE.LineBasicMaterial({ color: COLOR_COLLIDER, depthTest: false, transparent: true, opacity: 0.85 });
  const lines = new THREE.LineSegments(geometry, material);
  lines.renderOrder = 999;
  lines.matrixAutoUpdate = false;
  return lines;
}

function makeSocketGizmo() {
  const group = new THREE.Object3D();
  group.add(makeArrow(new THREE.Vector3(0, 0, -1), COLOR_SOCKET, 4));
  group.add(makeArrow(new THREE.Vector3(0, 1, 0), COLOR_SOCKET_UP, 2));
  group.matrixAutoUpdate = false;
  return group;
}

function rebuildOverlay() {
  clearOverlay();
  overlay.dirty = false;
  if (!isActive()) return;

  const root = ensureOverlayRoot();
  const rig = RigStore.rig;

  for (const h of rig.hitboxes) {
    const object = makeBoxLines(hitboxColor(h));
    root.add(object);
    overlay.hitboxes.push({ def: h, object, box: null });
  }

  for (const s of rig.sockets) {
    const object = makeSocketGizmo();
    root.add(object);
    overlay.sockets.push({ def: s, object });
  }

  for (const c of rig.colliders || []) {
    const object = makeColliderLines(c);
    root.add(object);
    overlay.colliders.push({ def: c, object });
  }
}

/** Socket frame in world space: bone pivot, plus locator and socket offset, then locator and socket rotation. */
export function socketWorldMatrix(s) {
  let bone = s.locator ? null : findBone(s.bone);
  let localPosition = new THREE.Vector3(s.offset[0], s.offset[1], s.offset[2]);
  let rotation = bbRotation(s.rotation);

  if (s.locator) {
    const locator = findLocator(s.locator);
    if (!locator) return null;
    bone = locator.parent instanceof Group ? locator.parent : null;
    const origin = bone ? bone.origin : [0, 0, 0];
    localPosition.add(new THREE.Vector3(
      locator.position[0] - origin[0],
      locator.position[1] - origin[1],
      locator.position[2] - origin[2],
    ));
    rotation = bbRotation(locator.rotation || [0, 0, 0]).multiply(rotation);
  }

  const parent = bone?.mesh || Project?.model_3d;
  if (!parent) return null;
  parent.updateWorldMatrix(true, false);

  return new THREE.Matrix4()
    .copy(parent.matrixWorld)
    .multiply(new THREE.Matrix4().compose(localPosition, rotation, new THREE.Vector3(1, 1, 1)));
}

function syncOverlay() {
  if (!isActive()) {
    if (overlay.root) overlay.root.visible = false;
    return;
  }

  // Creates the overlay root on first use and keeps it in the scene.
  attachOverlayRoot();
  overlay.root.visible = true;
  if (overlay.dirty) rebuildOverlay();

  const parentInverse = new THREE.Matrix4();
  overlay.root.parent?.updateWorldMatrix(true, false);
  if (overlay.root.parent) parentInverse.copy(overlay.root.parent.matrixWorld).invert();

  for (const item of overlay.hitboxes) {
    const mesh = boneMesh(item.def.bone);
    const box = PreviewSettings.hitboxes && mesh ? hitboxBox(item.def) : null;
    item.object.visible = !!box;
    if (!box) continue;
    item.object.matrix.copy(parentInverse)
      .multiply(mesh.matrixWorld)
      .multiply(new THREE.Matrix4().compose(box.center, new THREE.Quaternion(), box.half.clone().multiplyScalar(2)));
  }

  for (const item of overlay.colliders) {
    const mesh = PreviewSettings.colliders ? boneMesh(item.def.bone) : null;
    item.object.visible = !!mesh;
    if (!mesh) continue;
    mesh.updateWorldMatrix(true, false);
    item.object.matrix.copy(parentInverse).multiply(mesh.matrixWorld);
  }

  for (const item of overlay.sockets) {
    const matrix = PreviewSettings.sockets ? socketWorldMatrix(item.def) : null;
    item.object.visible = !!matrix;
    if (!matrix) continue;
    item.object.matrix.copy(parentInverse).multiply(matrix);
  }
}

function restRotation(bone) {
  const mesh = bone.mesh;
  if (mesh?.fix_rotation) return mesh.fix_rotation;
  const r = bone.rotation || [0, 0, 0];
  return new THREE.Euler(r[0] * DEG, r[1] * DEG, r[2] * DEG, 'ZYX');
}

/** Turns a bone about its pivot by a world-space rotation. */
function rotateWorld(mesh, worldDelta) {
  const parentQuat = new THREE.Quaternion();
  mesh.parent.updateWorldMatrix(true, false);
  mesh.parent.getWorldQuaternion(parentQuat);
  const local = parentQuat.clone().invert().multiply(worldDelta).multiply(parentQuat);
  mesh.quaternion.premultiply(local);
  mesh.updateMatrixWorld(true);
}

/** Turns a bone so the direction to {@code from} points at {@code to}, by {@code fraction} of the turn. */
function aim(mesh, from, to, fraction = 1) {
  const pivot = worldPosition(mesh);
  const u = from.clone().sub(pivot);
  const v = to.clone().sub(pivot);
  if (u.lengthSq() < 1e-8 || v.lengthSq() < 1e-8) return false;
  u.normalize();
  v.normalize();
  if (u.dot(v) > 1 - 1e-9) return false;

  let q = new THREE.Quaternion().setFromUnitVectors(u, v);
  if (fraction < 1) q = new THREE.Quaternion().slerp(q, fraction);
  rotateWorld(mesh, q);
  return true;
}

/** A point fixed to a bone, in Blockbench pixels from its pivot, in world space. */
function pointOnBone(mesh, offset) {
  mesh.updateWorldMatrix(true, false);
  return new THREE.Vector3(offset[0], offset[1], offset[2]).applyMatrix4(mesh.matrixWorld);
}

function directionOnBone(mesh, direction) {
  const q = new THREE.Quaternion();
  mesh.updateWorldMatrix(true, false);
  mesh.getWorldQuaternion(q);
  return new THREE.Vector3(direction[0], direction[1], direction[2]).normalize().applyQuaternion(q);
}

function wrapAngle(a) {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

/**
 * Clamps a bone's rotation relative to its rest pose. Limits are keyframe
 * degrees; keyframes land on the mesh with X and Y negated (as in AzureLib),
 * so the mesh ranges for X and Y are [-max, -min].
 */
function applyConstraint(bone, c) {
  const mesh = bone.mesh;
  if (!mesh) return;
  const rest = restRotation(bone);
  const ranges = {
    x: [-c.max[0] * DEG, -c.min[0] * DEG],
    y: [-c.max[1] * DEG, -c.min[1] * DEG],
    z: [c.min[2] * DEG, c.max[2] * DEG],
  };
  if (c.type === 'hinge_x') { ranges.y = [0, 0]; ranges.z = [0, 0]; }
  if (c.type === 'hinge_y') { ranges.x = [0, 0]; ranges.z = [0, 0]; }
  if (c.type === 'hinge_z') { ranges.x = [0, 0]; ranges.y = [0, 0]; }

  const euler = new THREE.Euler().setFromQuaternion(mesh.quaternion, 'ZYX');
  for (const axis of ['x', 'y', 'z']) {
    const offset = wrapAngle(euler[axis] - rest[axis]);
    const [min, max] = ranges[axis];
    euler[axis] = rest[axis] + Math.min(max, Math.max(min, offset));
  }
  mesh.quaternion.setFromEuler(euler);
  mesh.updateMatrixWorld(true);
}

function constraintsFor(boneNames) {
  const byBone = new Map(RigStore.rig.constraints.map(c => [c.bone, c]));
  return boneNames.map(n => byBone.get(n) || null);
}

function resolvedSolver(chain) {
  if (chain.solver !== 'auto') return chain.solver;
  return chain.bones.length === 2 || chain.bones.length === 3 ? 'two_bone' : 'ccd';
}

/** AzIkSolvers.twoBone: bend the middle joint, swing the root, then twist towards the pole. */
function solveTwoBone(bones, effector, target, constraints, pole) {
  const [upper, lower] = bones.map(b => b.mesh);
  const last = bones[bones.length - 1].mesh;
  const a = worldPosition(upper);
  const b = worldPosition(lower);
  const c = pointOnBone(last, effector);
  const upperLen = a.distanceTo(b);
  const lowerLen = b.distanceTo(c);
  if (upperLen < 1e-5 || lowerLen < 1e-5) return;

  const reach = Math.min(upperLen + lowerLen - 1e-4, Math.max(Math.abs(upperLen - lowerLen) + 1e-4, a.distanceTo(target)));
  const u = a.clone().sub(b);
  const v = c.clone().sub(b);
  let axis = new THREE.Vector3().crossVectors(u, v);
  if (axis.lengthSq() < 1e-12) {
    axis = directionOnBone(upper, [1, 0, 0]);
  }
  axis.normalize();

  const current = Math.acos(Math.min(1, Math.max(-1, u.dot(v) / (upperLen * lowerLen))));
  const desired = Math.acos(Math.min(1, Math.max(-1, (upperLen * upperLen + lowerLen * lowerLen - reach * reach) / (2 * upperLen * lowerLen))));
  rotateWorld(lower, new THREE.Quaternion().setFromAxisAngle(axis, desired - current));
  if (constraints[1]) applyConstraint(bones[1], constraints[1]);

  aim(upper, pointOnBone(last, effector), target);
  if (constraints[0]) applyConstraint(bones[0], constraints[0]);

  if (pole) {
    const root = worldPosition(upper);
    const k = target.clone().sub(root);
    if (k.lengthSq() < 1e-10) return;
    k.normalize();
    const knee = worldPosition(lower).sub(root);
    const toPole = modelToWorld(pole).sub(root);
    knee.sub(k.clone().multiplyScalar(knee.dot(k)));
    toPole.sub(k.clone().multiplyScalar(toPole.dot(k)));
    if (knee.lengthSq() < 1e-10 || toPole.lengthSq() < 1e-10) return;
    const angle = Math.atan2(k.dot(new THREE.Vector3().crossVectors(knee, toPole)), knee.dot(toPole));
    rotateWorld(upper, new THREE.Quaternion().setFromAxisAngle(k, angle));
    if (constraints[0]) applyConstraint(bones[0], constraints[0]);
  }
}

/** AzIkSolvers.ccd: every pass turns each bone, tip first, to point the effector at the target. */
function solveCcd(bones, effector, target, constraints, iterations, tolerance) {
  const last = bones[bones.length - 1].mesh;
  for (let it = 0; it < iterations; it++) {
    for (let i = bones.length - 1; i >= 0; i--) {
      aim(bones[i].mesh, pointOnBone(last, effector), target);
      if (constraints[i]) applyConstraint(bones[i], constraints[i]);
    }
    if (pointOnBone(last, effector).distanceTo(target) <= tolerance) return;
  }
}

/** Where a chain's preview target is this frame, in world space, or null to skip. */
function previewTarget(entry, effectorWorld) {
  const p = entry.preview || {};
  if (p.enabled === false || p.mode === 'off') return null;

  if (p.mode === 'locator') {
    const locator = findLocator(p.locator);
    return locator?.mesh ? worldPosition(locator.mesh) : null;
  }

  if (p.mode === 'ground') {
    // AzIkTargets.ground keeps the animated foot height but measures it from the
    // ground under the foot: with flat preview ground raised by groundHeight,
    // the foot moves up by that much.
    return effectorWorld.clone().add(new THREE.Vector3(0, Number(p.groundHeight) || 0, 0));
  }

  return modelToWorld(p.point || [0, 0, 0]);
}

/** Captures bone rotations so a modifier's result can be blended in by its weight. */
function captureRotations(meshes) {
  return meshes.map(m => m.quaternion.clone());
}

function blendRotations(meshes, before, weight) {
  if (weight >= 1) return;
  meshes.forEach((m, i) => m.quaternion.copy(before[i].clone().slerp(m.quaternion.clone(), Math.max(0, weight))));
  meshes.forEach(m => m.updateMatrixWorld(true));
}

function runIkChain(chain) {
  const bones = chain.bones.map(findBone);
  if (bones.some(b => !b?.mesh) || !bones.length) return;
  const meshes = bones.map(b => b.mesh);
  const last = meshes[meshes.length - 1];
  const target = previewTarget(chain, pointOnBone(last, chain.effector));
  if (!target) return;

  const before = captureRotations(meshes);
  const constraints = constraintsFor(chain.bones);
  const solver = resolvedSolver(chain);

  if (solver === 'two_bone' && bones.length >= 2) {
    solveTwoBone(bones, chain.effector, target, constraints, chain.pole);
  } else {
    solveCcd(bones, chain.effector, target, constraints, Math.max(1, chain.iterations | 0), Math.max(0.001, Number(chain.tolerance) || 0.1));
  }

  blendRotations(meshes, before, Number(chain.weight) || 0);
}

function runLookAt(look) {
  const bones = look.bones.map(findBone);
  if (bones.some(b => !b?.mesh) || !bones.length) return;
  const meshes = bones.map(b => b.mesh);
  const head = meshes[meshes.length - 1];
  const target = previewTarget(look, worldPosition(head));
  if (!target) return;

  const before = captureRotations(meshes);
  const constraints = constraintsFor(look.bones);
  const last = meshes.length - 1;

  for (let i = 0; i <= last; i++) {
    const headPos = worldPosition(head);
    const distance = headPos.distanceTo(target);
    if (distance < 1e-4) break;
    const aimPoint = directionOnBone(head, look.forward).multiplyScalar(distance).add(headPos);
    aim(meshes[i], aimPoint, target, 1 / (last - i + 1));
    if (constraints[i]) applyConstraint(bones[i], constraints[i]);
  }

  blendRotations(meshes, before, Number(look.weight) || 0);
}

const springStates = new Map();

/**
 * A spring chain's colliders in world space for this frame: [{a, b, radius, capsule}], with the
 * radius in pixels. Mirrors AzSpringBone#updateColliders.
 */
function springColliders(spring) {
  const byId = new Map((RigStore.rig.colliders || []).map(c => [c.id, c]));
  const out = [];
  for (const id of spring.colliders || []) {
    const c = byId.get(id);
    const mesh = c && boneMesh(c.bone);
    if (!mesh) continue;
    const capsule = c.shape === 'capsule';
    out.push({
      a: pointOnBone(mesh, c.start),
      b: pointOnBone(mesh, capsule ? c.end : c.start),
      radius: Math.max(0, Number(c.radius) || 0),
      capsule,
    });
  }
  return out;
}

/** Closest points between segments p0-p1 and a-b: returns [s, t], the parameters along each. */
function closestSegmentParams(p0, p1, a, b) {
  const d1 = p1.clone().sub(p0);
  const d2 = b.clone().sub(a);
  const r = p0.clone().sub(a);
  const aa = d1.dot(d1);
  const ee = d2.dot(d2);
  const ff = d2.dot(r);
  let s;
  let t;

  if (aa <= 1e-12 && ee <= 1e-12) return [0, 0];
  if (aa <= 1e-12) return [0, Math.max(0, Math.min(1, ff / ee))];

  const c = d1.dot(r);
  if (ee <= 1e-12) {
    s = Math.max(0, Math.min(1, -c / aa));
    t = 0;
  } else {
    const bb = d1.dot(d2);
    const denom = aa * ee - bb * bb;
    s = denom > 1e-12 ? Math.max(0, Math.min(1, (bb * ff - c * ee) / denom)) : 0;
    t = (bb * s + ff) / ee;
    if (t < 0) {
      t = 0;
      s = Math.max(0, Math.min(1, -c / aa));
    } else if (t > 1) {
      t = 1;
      s = Math.max(0, Math.min(1, (bb - c) / aa));
    }
  }
  return [s, t];
}

/**
 * Pushes the chain out of the colliders and above the ground. Each segment is tested against
 * each collider's core, so thin colliders can't slip between two joints; the segment's outer
 * joint is moved so the segment clears it. Mirrors AzSpringBone#collide.
 */
function collideSpring(p, colliders, particleRadius, groundY) {
  for (let j = 1; j < p.length; j++) {
    for (const c of colliders) {
      const reach = c.radius + particleRadius;
      const coreEnd = c.capsule ? c.b : c.a;
      const [sAlong, tAlong] = closestSegmentParams(p[j - 1], p[j], c.a, coreEnd);
      const onChain = p[j - 1].clone().lerp(p[j], sAlong);
      const onCore = c.a.clone().lerp(coreEnd, tAlong);
      const away = onChain.clone().sub(onCore);
      const dist = away.length();
      if (dist >= reach) continue;
      if (dist < 1e-6) away.set(0, 1, 0);
      else away.divideScalar(dist);
      // Moving the outer joint by d moves the contact point by s * d; the root end of the
      // segment is handled by the segment before it.
      p[j].add(away.multiplyScalar((reach - dist) / Math.max(sAlong, 0.25)));
    }
    if (groundY !== null && p[j].y < groundY + particleRadius) p[j].y = groundY + particleRadius;
  }
}

/**
 * AzSpringBone: damped particles, each pulled towards its animated position relative to the
 * particle before it, held at segment length; the bones are then aimed at them.
 */
function runSpring(spring) {
  const bones = spring.bones.map(findBone);
  if (bones.some(b => !b?.mesh) || !bones.length || spring.preview?.enabled === false) return;
  const meshes = bones.map(b => b.mesh);
  const tip = spring.tip;
  const count = meshes.length + (tip ? 1 : 0);

  const chainPoint = j => (j < meshes.length ? worldPosition(meshes[j]) : pointOnBone(meshes[meshes.length - 1], tip));
  const targets = [];
  for (let j = 0; j < count; j++) targets.push(chainPoint(j));

  const colliders = springColliders(spring);
  const particleRadius = Math.max(0, Number(spring.radius) || 0);
  // The ground is the model's origin: the entity's feet.
  const groundY = spring.ground ? modelToWorld([0, 0, 0]).y : null;

  const time = Timeline.time || 0;
  let state = springStates.get(spring.id);
  const fresh = !state || state.count !== count;
  const delta = fresh ? 0 : (time - state.time) * TICKS_PER_SECOND;

  if (fresh || delta < 0 || delta > 10) {
    state = {
      count,
      time,
      position: targets.map(t => t.clone()),
      velocity: targets.map(() => new THREE.Vector3()),
    };
    collideSpring(state.position, colliders, particleRadius, groundY);
    springStates.set(spring.id, state);
  } else {
    const stiffness = Math.min(1, Math.max(0, Number(spring.stiffness) || 0));
    const damping = Math.min(1, Math.max(0, Number(spring.damping) || 0));
    const gravity = (Number(spring.gravity) || 0) * PIXELS_PER_BLOCK;
    const p = state.position;
    const v = state.velocity;
    p[0].copy(targets[0]);

    let remaining = delta;
    while (remaining > 1e-4) {
      const dt = Math.min(remaining, 1);
      const keep = Math.max(0, 1 - damping * dt);
      const previous = p.map(x => x.clone());

      for (let j = 1; j < count; j++) {
        // Each joint springs towards where the animation puts it relative to the joint
        // before it, so lag builds up along the chain and it bends and whips instead of
        // swinging as one rigid piece.
        const rest = targets[j].clone().sub(targets[j - 1]).add(p[j - 1]);
        v[j].add(rest.sub(p[j]).multiplyScalar(stiffness * dt));
        v[j].y -= gravity * dt;
        v[j].multiplyScalar(keep);
        p[j].add(v[j].clone().multiplyScalar(dt));
      }

      // Hold every segment at its animated length and push joints out of colliders; alternated so
      // the chain ends up both the right length and outside the colliders.
      const passes = colliders.length || groundY !== null ? 3 : 1;
      for (let pass = 0; pass < passes; pass++) {
        for (let j = 1; j < count; j++) {
          const rest = targets[j].distanceTo(targets[j - 1]);
          const dir = p[j].clone().sub(p[j - 1]);
          const length = dir.length();
          if (length > 1e-6) p[j].copy(p[j - 1]).add(dir.multiplyScalar(rest / length));
        }
        collideSpring(p, colliders, particleRadius, groundY);
      }

      // Derive velocity from the corrected motion, so contact slides and settles instead of bouncing.
      for (let j = 1; j < count; j++) v[j].copy(p[j]).sub(previous[j]).divideScalar(dt);

      remaining -= dt;
    }
    state.time = time;
  }

  const constraints = constraintsFor(spring.bones);
  for (let i = 0; i < count - 1; i++) {
    aim(meshes[i], chainPoint(i + 1), state.position[i + 1]);
    if (constraints[i]) applyConstraint(bones[i], constraints[i]);
  }
}

function runStandaloneConstraints() {
  for (const c of RigStore.rig.constraints) {
    if (!c.standalone) continue;
    const bone = findBone(c.bone);
    if (bone) applyConstraint(bone, c);
  }
}

function runModifiers() {
  if (!isActive() || !PreviewSettings.modifiers || !Animator?.open) return;
  const rig = RigStore.rig;

  const jobs = [
    ...rig.ikChains.map(c => ({ priority: Number(c.priority) || 0, run: () => runIkChain(c) })),
    ...rig.lookAts.map(l => ({ priority: Number(l.priority) || 0, run: () => runLookAt(l) })),
    ...rig.springBones.map(s => ({ priority: Number(s.priority) || 0, run: () => runSpring(s) })),
  ];
  if (rig.constraints.some(c => c.standalone)) jobs.push({ priority: 1000, run: runStandaloneConstraints });

  // AzureLib runs modifiers in ascending priority, then in the order they were added.
  jobs.map((job, i) => ({ ...job, i }))
    .sort((a, b) => a.priority - b.priority || a.i - b.i)
    .forEach(job => {
      try {
        job.run();
      } catch (e) {
        console.warn('[AzureLib Rig] Preview failed for a modifier', e);
      }
    });
}

export const BlendPreview = {
  active: null,
  inputX: 0,
  inputY: 0,

  start(blendSpace) {
    this.active = blendSpace;
    this.refresh();
  },

  stop() {
    this.active = null;
    this.refresh();
  },

  refresh() {
    try { if (Animator?.open) Animator.preview(); } catch (_) { /* not in animate mode */ }
  },

  weights() {
    return this.active ? blendSpaceWeights(this.active, this.inputX, this.inputY) : [];
  },

  display() {
    if (!this.active) return false;
    const weights = this.weights();
    const blend = {};
    const animations = [];

    this.active.samples.forEach((sample, i) => {
      const animation = Animation.all.find(a => a.name === sample.animation);
      if (!animation || !(weights[i] > 0)) return;
      if (blend[animation.uuid] === undefined) {
        blend[animation.uuid] = 0;
        animations.push(animation);
      }
      blend[animation.uuid] += weights[i];
    });

    if (!animations.length) return false;
    Animator.showDefaultPose(true);
    Animator.stackAnimations(animations, false, blend);
    return true;
  },
};

let handlers = null;
let unsubscribe = null;

export function markOverlayDirty() {
  overlay.dirty = true;
}

export function registerRigPreview() {
  if (handlers) return;

  handlers = {
    frame: () => {
      if (isActive() && Animator?.open && BlendPreview.active) BlendPreview.display();
      runModifiers();
    },
    render: () => syncOverlay(),
    dirty: () => { overlay.dirty = true; },
    resetSprings: () => springStates.clear(),
    leaveAnimate: () => { if (BlendPreview.active) BlendPreview.stop(); },
  };

  unsubscribe = RigStore.onChange(() => {
    overlay.dirty = true;
    springStates.clear();
  });

  Blockbench.on('display_animation_frame', handlers.frame);
  Blockbench.on('render_frame', handlers.render);
  Blockbench.on('finished_edit', handlers.dirty);
  Blockbench.on('load_project', handlers.dirty);
  Blockbench.on('select_project', handlers.dirty);
  Blockbench.on('select_animation', handlers.resetSprings);
  Blockbench.on('unselect_mode', handlers.leaveAnimate);
  Blockbench.on('unselect_project', handlers.leaveAnimate);
}

export function unregisterRigPreview() {
  if (!handlers) return;
  BlendPreview.stop();
  Blockbench.removeListener('display_animation_frame', handlers.frame);
  Blockbench.removeListener('render_frame', handlers.render);
  Blockbench.removeListener('finished_edit', handlers.dirty);
  Blockbench.removeListener('load_project', handlers.dirty);
  Blockbench.removeListener('select_project', handlers.dirty);
  Blockbench.removeListener('select_animation', handlers.resetSprings);
  Blockbench.removeListener('unselect_mode', handlers.leaveAnimate);
  Blockbench.removeListener('unselect_project', handlers.leaveAnimate);
  unsubscribe?.();
  unsubscribe = null;
  handlers = null;
  clearOverlay();
  overlay.root?.parent?.remove(overlay.root);
  overlay.root = null;
}
