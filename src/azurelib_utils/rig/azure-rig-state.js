/**
 * AzureLib Animator — Rig Definitions
 * ------------------------------------
 * Project-persisted definitions for AzureLib's runtime rig features:
 * bone hitboxes, bone sockets, IK chains, look-at chains, bone constraints,
 * spring bones and blend spaces.
 *
 * © 2026 AzureDoom — MIT License
 */

export const RIG_VERSION = 1;

export const HITBOX_ROLES = ['COMBAT', 'INTERACT', 'ANCHOR'];

export const IK_TARGETS = {
  ground: 'Ground (foot placement)',
  entity_eyes: 'Another entity\'s eyes',
  world: 'World position (code)',
  model: 'Fixed model point',
};

export const IK_SOLVERS = {
  auto: 'Auto (two-bone for 2–3 bones, else CCD)',
  two_bone: 'Two-bone',
  ccd: 'CCD',
};

export const CONSTRAINT_TYPES = {
  limit: 'Limit (all axes)',
  hinge_x: 'Hinge X',
  hinge_y: 'Hinge Y',
  hinge_z: 'Hinge Z',
};

/** A fresh, empty rig. */
export function emptyRig() {
  return {
    version: RIG_VERSION,
    codegen: { target: 'v1_21_1', entityClass: 'ExampleEntity', packageRoot: '' },
    hitboxOptions: { keepEntityBox: false, clientOnly: false },
    hitboxes: [],
    sockets: [],
    ikChains: [],
    lookAts: [],
    constraints: [],
    springBones: [],
    colliders: [],
    blendSpaces: [],
  };
}

export function newHitbox(bone) {
  return {
    name: bone,
    bone,
    role: 'COMBAT',
    fit: true,
    size: [4, 4, 4],
    offset: [0, 0, 0],
    inflate: 0,
    anchorAtPivot: false,
    damageMultiplier: 1,
    tags: [],
  };
}

export function newSocket(name, { bone = null, locator = null } = {}) {
  return {
    name,
    bone,
    locator,
    offset: [0, 0, 0],
    rotation: [0, 0, 0],
    serverHitbox: '',
  };
}

export function newIkChain(id, bones) {
  return {
    id,
    bones,
    effector: [0, 0, 0],
    solver: 'auto',
    pole: null,
    iterations: 10,
    tolerance: 0.1,
    target: { type: 'ground', stepUp: 0.5, stepDown: 0.75, point: [0, 0, 0] },
    priority: 50,
    weight: 1,
    preview: { enabled: true, mode: 'ground', groundHeight: 0, locator: '', point: [0, 0, -16] },
  };
}

export function newLookAt(id, bones) {
  return {
    id,
    bones,
    forward: [0, 0, -1],
    target: { type: 'entity_eyes', point: [0, 0, 0] },
    priority: 40,
    weight: 1,
    preview: { enabled: true, mode: 'point', locator: '', point: [0, 24, -32] },
  };
}

export function newConstraint(bone) {
  return {
    bone,
    type: 'limit',
    min: [-45, -45, -45],
    max: [45, 45, 45],
    standalone: false,
  };
}

export function newSpringBone(id, bones) {
  return {
    id,
    bones,
    tip: null,
    stiffness: 0.2,
    damping: 0.25,
    gravity: 0,
    inertia: 1,
    priority: 200,
    colliders: [],
    radius: 0,
    ground: false,
    preview: { enabled: true },
  };
}

/** A spring collider; positions are pixels from the bone's pivot along its axes, as for sockets. */
export function newCollider(id, bone) {
  return {
    id,
    bone,
    shape: 'sphere',
    start: [0, 0, 0],
    end: [0, 0, 0],
    radius: 2,
  };
}

export function newBlendSpace(name) {
  return {
    name,
    dimensions: 1,
    input: { x: 'speed', y: 'forward' },
    samples: [],
    smoothing: 0,
    syncPhase: true,
  };
}

const listeners = new Set();

export const RigStore = {
  rig: emptyRig(),

  onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  notify() {
    for (const fn of listeners) {
      try { fn(this.rig); } catch (e) { console.error('[AzureLib Rig] listener failed', e); }
    }
  },

  set(rig) {
    this.rig = normalizeRig(rig);
    this.notify();
  },

  reset() {
    this.set(emptyRig());
  },

  snapshot() {
    return JSON.parse(JSON.stringify(this.rig));
  },

  edit(name, mutate) {
    const before = this.snapshot();
    mutate(this.rig);
    const after = this.snapshot();

    if (JSON.stringify(before) === JSON.stringify(after)) return;

    try {
      Undo.initEdit({});
      Undo.finishEdit(`AzureLib Rig: ${name}`);
      const entry = Undo.history?.[Undo.index - 1];
      if (entry) undoSnapshots.set(entry, { before, after });
    } catch (e) {
      console.warn('[AzureLib Rig] Could not record undo step', e);
    }

    if (typeof Project !== 'undefined' && Project) Project.saved = false;
    this.notify();
  },
};

// ---------------------------------------------------------------------------
// Normalisation: tolerate older or hand-edited data
// ---------------------------------------------------------------------------

function vec3(value, fallback) {
  if (!Array.isArray(value) || value.length < 3) return fallback.slice();
  return [0, 1, 2].map(i => (Number.isFinite(Number(value[i])) ? Number(value[i]) : fallback[i]));
}

function list(value) {
  return Array.isArray(value) ? value.filter(v => v && typeof v === 'object') : [];
}

export function normalizeRig(raw) {
  const base = emptyRig();
  if (!raw || typeof raw !== 'object') return base;

  base.codegen = { ...base.codegen, ...(raw.codegen || {}) };
  if (base.codegen.target === 'modern') base.codegen.target = 'v1_21_1';
  base.hitboxOptions = { ...base.hitboxOptions, ...(raw.hitboxOptions || {}) };

  base.hitboxes = list(raw.hitboxes).map(h => ({
    ...newHitbox(h.bone || ''),
    ...h,
    size: vec3(h.size, [4, 4, 4]),
    offset: vec3(h.offset, [0, 0, 0]),
    tags: Array.isArray(h.tags) ? h.tags.map(String) : [],
    role: HITBOX_ROLES.includes(h.role) ? h.role : 'COMBAT',
  }));

  base.sockets = list(raw.sockets).map(s => ({
    ...newSocket(s.name || 'socket'),
    ...s,
    offset: vec3(s.offset, [0, 0, 0]),
    rotation: vec3(s.rotation, [0, 0, 0]),
  }));

  base.ikChains = list(raw.ikChains).map(c => {
    const d = newIkChain(c.id || 'ik', Array.isArray(c.bones) ? c.bones : []);
    return {
      ...d,
      ...c,
      effector: vec3(c.effector, [0, 0, 0]),
      pole: Array.isArray(c.pole) ? vec3(c.pole, [0, 0, 0]) : null,
      target: { ...d.target, ...(c.target || {}), point: vec3(c.target?.point, [0, 0, 0]) },
      preview: { ...d.preview, ...(c.preview || {}), point: vec3(c.preview?.point, d.preview.point) },
    };
  });

  base.lookAts = list(raw.lookAts).map(l => {
    const d = newLookAt(l.id || 'look', Array.isArray(l.bones) ? l.bones : []);
    return {
      ...d,
      ...l,
      forward: vec3(l.forward, [0, 0, -1]),
      target: { ...d.target, ...(l.target || {}), point: vec3(l.target?.point, [0, 0, 0]) },
      preview: { ...d.preview, ...(l.preview || {}), point: vec3(l.preview?.point, d.preview.point) },
    };
  });

  base.constraints = list(raw.constraints).map(c => ({
    ...newConstraint(c.bone || ''),
    ...c,
    min: vec3(c.min, [-45, -45, -45]),
    max: vec3(c.max, [45, 45, 45]),
  }));

  base.springBones = list(raw.springBones).map(s => {
    const d = newSpringBone(s.id || 'spring', Array.isArray(s.bones) ? s.bones : []);
    return {
      ...d,
      ...s,
      tip: Array.isArray(s.tip) ? vec3(s.tip, [0, 0, 0]) : null,
      colliders: Array.isArray(s.colliders) ? s.colliders.map(String) : [],
      radius: Math.max(0, Number(s.radius) || 0),
      ground: !!s.ground,
      preview: { ...d.preview, ...(s.preview || {}) },
    };
  });

  base.colliders = list(raw.colliders).map(c => ({
    ...newCollider(c.id || 'collider', c.bone || ''),
    ...c,
    shape: c.shape === 'capsule' ? 'capsule' : 'sphere',
    start: vec3(c.start, [0, 0, 0]),
    end: vec3(c.end, [0, 0, 0]),
    radius: Number(c.radius) > 0 ? Number(c.radius) : 2,
  }));

  base.blendSpaces = list(raw.blendSpaces).map(b => ({
    ...newBlendSpace(b.name || 'blend'),
    ...b,
    input: { x: 'speed', y: 'forward', ...(b.input || {}) },
    samples: list(b.samples).map(s => ({
      x: Number(s.x) || 0,
      y: Number(s.y) || 0,
      animation: String(s.animation || ''),
    })),
  }));

  return base;
}

export function boneNames() {
  return (typeof Group !== 'undefined' ? Group.all : []).map(g => g.name);
}

export function locatorNames() {
  return (typeof Locator !== 'undefined' ? Locator.all : []).map(l => l.name);
}

function findBone(name) {
  return (typeof Group !== 'undefined' ? Group.all : []).find(g => g.name === name) || null;
}

function isDescendant(child, ancestor) {
  for (let node = child?.parent; node && node !== 'root'; node = node.parent) {
    if (node === ancestor) return true;
  }
  return false;
}

export function validateRig(rig = RigStore.rig) {
  const issues = [];
  const bones = new Set(boneNames());
  const locators = new Set(locatorNames());

  const checkChain = (kind, id, names) => {
    if (!names.length) {
      issues.push(`${kind} "${id}" has no bones.`);
      return;
    }
    for (const n of names) {
      if (!bones.has(n)) issues.push(`${kind} "${id}": bone "${n}" doesn't exist.`);
    }
    for (let i = 1; i < names.length; i++) {
      const parent = findBone(names[i - 1]);
      const child = findBone(names[i]);
      if (parent && child && !isDescendant(child, parent)) {
        issues.push(`${kind} "${id}": "${names[i]}" isn't under "${names[i - 1]}"; list bones root first, each inside the one before.`);
      }
    }
  };

  const seenHitboxes = new Set();
  for (const h of rig.hitboxes) {
    if (!bones.has(h.bone)) issues.push(`Hitbox "${h.name}": bone "${h.bone}" doesn't exist.`);
    if (seenHitboxes.has(h.name)) issues.push(`Hitbox name "${h.name}" is used twice.`);
    seenHitboxes.add(h.name);
    if (!h.fit && h.size.every(v => !v) && !h.inflate) issues.push(`Hitbox "${h.name}" has no size.`);
    if (h.fit) {
      const bone = findBone(h.bone);
      const hasCubes = bone?.children?.some(c => typeof Cube !== 'undefined' && c instanceof Cube);
      if (bone && !hasCubes) issues.push(`Hitbox "${h.name}" fits bone "${h.bone}", which has no cubes of its own; give it a size.`);
    }
  }

  const seenSockets = new Set();
  for (const s of rig.sockets) {
    if (seenSockets.has(s.name)) issues.push(`Socket name "${s.name}" is used twice.`);
    seenSockets.add(s.name);
    if (s.locator && !locators.has(s.locator)) issues.push(`Socket "${s.name}": locator "${s.locator}" doesn't exist.`);
    if (!s.locator && !bones.has(s.bone)) issues.push(`Socket "${s.name}": bone "${s.bone}" doesn't exist.`);
    if (s.serverHitbox && s.locator) issues.push(`Socket "${s.name}" follows a locator, so its server hitbox must be added by hand (toAnchorHitbox() only works for bone sockets).`);
  }

  const locatorCounts = {};
  for (const l of locatorNames()) locatorCounts[l] = (locatorCounts[l] || 0) + 1;
  for (const [name, count] of Object.entries(locatorCounts)) {
    if (count > 1) issues.push(`Locator name "${name}" is used ${count} times; AzureLib resolves the first one it finds.`);
  }

  for (const c of rig.ikChains) {
    checkChain('IK chain', c.id, c.bones);
    const solver = c.solver === 'auto' ? (c.bones.length === 2 || c.bones.length === 3 ? 'two_bone' : 'ccd') : c.solver;
    if (solver === 'two_bone' && c.bones.length < 2) issues.push(`IK chain "${c.id}": the two-bone solver needs at least 2 bones.`);
  }
  for (const l of rig.lookAts) checkChain('Look-at', l.id, l.bones);
  for (const s of rig.springBones) checkChain('Spring bone', s.id, s.bones);

  for (const c of rig.constraints) {
    if (!bones.has(c.bone)) issues.push(`Constraint on "${c.bone}": bone doesn't exist.`);
  }

  const colliderIds = new Set();
  for (const c of rig.colliders || []) {
    if (colliderIds.has(c.id)) issues.push(`Collider id "${c.id}" is used twice.`);
    colliderIds.add(c.id);
    if (!bones.has(c.bone)) issues.push(`Collider "${c.id}": bone "${c.bone}" doesn't exist.`);
    if (!(Number(c.radius) > 0)) issues.push(`Collider "${c.id}" needs a radius above 0.`);
  }
  for (const s of rig.springBones) {
    for (const id of s.colliders || []) {
      if (!colliderIds.has(id)) issues.push(`Spring bone "${s.id}": collider "${id}" doesn't exist.`);
    }
    for (const id of s.colliders || []) {
      const c = (rig.colliders || []).find(x => x.id === id);
      if (c && s.bones.includes(c.bone)) issues.push(`Spring bone "${s.id}": collider "${id}" is on one of its own bones, so the chain would always be pushed by itself.`);
    }
  }

  const animations = new Set((typeof Animation !== 'undefined' ? Animation.all : []).map(a => a.name));
  for (const b of rig.blendSpaces) {
    if (b.samples.length < 2) issues.push(`Blend space "${b.name}" needs at least 2 samples.`);
    for (const s of b.samples) {
      if (!animations.has(s.animation)) issues.push(`Blend space "${b.name}": animation "${s.animation}" doesn't exist in this project.`);
    }
  }

  const ids = {};
  for (const x of [...rig.ikChains, ...rig.lookAts, ...rig.springBones]) ids[x.id] = (ids[x.id] || 0) + 1;
  if (rig.constraints.some(c => c.standalone)) ids.bone_limits = (ids.bone_limits || 0) + 1;
  for (const [id, n] of Object.entries(ids)) {
    if (n > 1) issues.push(`Pose modifier id "${id}" is used ${n} times; AzureLib requires unique ids.`);
  }

  return issues;
}

const undoSnapshots = new WeakMap();
let handlers = null;

export function registerRigState() {
  if (handlers) return;

  handlers = {
    compile: event => {
      if (Format?.id !== 'azure_model') return;
      event.model.azurelibRig = RigStore.snapshot();
    },
    parsed: event => {
      const model = event?.model || {};
      RigStore.set(model.azurelibRig || emptyRig());
    },
    reset: () => RigStore.reset(),
    undo: event => {
      const snap = undoSnapshots.get(event?.entry);
      if (snap) RigStore.set(snap.before);
    },
    redo: event => {
      const snap = undoSnapshots.get(event?.entry);
      if (snap) RigStore.set(snap.after);
    },
    select: event => {
      // Switching tabs: the store mirrors the selected project's rig.
      const project = event?.project || Project;
      RigStore.set(project?.azurelibRig || emptyRig());
    },
    unselect: event => {
      const project = event?.project || Project;
      if (project) project.azurelibRig = RigStore.snapshot();
    },
  };

  Codecs.project.on('compile', handlers.compile);
  Codecs.project.on('parsed', handlers.parsed);
  Blockbench.on('new_project', handlers.reset);
  Blockbench.on('undo', handlers.undo);
  Blockbench.on('redo', handlers.redo);
  Blockbench.on('unselect_project', handlers.unselect);
  Blockbench.on('select_project', handlers.select);
}

export function unregisterRigState() {
  if (!handlers) return;
  Codecs.project.events?.compile?.remove?.(handlers.compile);
  Codecs.project.events?.parsed?.remove?.(handlers.parsed);
  Blockbench.removeListener('new_project', handlers.reset);
  Blockbench.removeListener('undo', handlers.undo);
  Blockbench.removeListener('redo', handlers.redo);
  Blockbench.removeListener('unselect_project', handlers.unselect);
  Blockbench.removeListener('select_project', handlers.select);
  handlers = null;
}
