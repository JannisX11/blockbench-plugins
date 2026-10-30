/**
 * AzureLib Animator — Rig Panel
 * ------------------------------
 * The "AzureLib Rig" panel: create and edit hitboxes, sockets, IK chains,
 * look-at chains, constraints, spring bones and blend spaces; toggle their
 * viewport preview; validate the rig; and generate AzureLib code.
 *
 * Every edit goes through RigStore.edit, so it is undoable and saved with the
 * project.
 *
 * © 2026 AzureDoom — MIT License
 */

import {
  RigStore,
  HITBOX_ROLES,
  IK_TARGETS,
  IK_SOLVERS,
  CONSTRAINT_TYPES,
  newHitbox,
  newSocket,
  newIkChain,
  newLookAt,
  newConstraint,
  newSpringBone,
  newCollider,
  newBlendSpace,
  validateRig,
} from './azure-rig-state.js';
import { TARGETS, CODEGEN_TARGETS, BLEND_INPUTS, generateText, normalizeTarget } from './azure-rig-codegen.js';
import { PreviewSettings, BlendPreview, hitboxBox } from './azure-rig-preview.js';
import { blendSpaceRange } from './azure-rig-math.js';

/** Selected bones from every selection source Blockbench has used (4.x and 5.x, Edit and Animate). */
function selectedGroups() {
  const sources = [
    ...(Outliner.selected || []),
    ...(Array.isArray(Group.selected) ? Group.selected : [Group.selected]),
    ...(Group.multi_selected || []),
    ...Group.all.filter(g => g.selected),
  ];
  return [...new Set(sources)].filter(el => el instanceof Group);
}

function selectedLocators() {
  if (typeof Locator === 'undefined') return [];
  return [...new Set([...(Outliner.selected || []), ...Locator.all.filter(l => l.selected)])]
    .filter(el => el instanceof Locator);
}

function depth(group) {
  let d = 0;
  for (let node = group.parent; node && node !== 'root'; node = node.parent) d++;
  return d;
}

/**
 * Bones for a chain from the selection, root first: several selected bones in
 * hierarchy order, or one selected bone plus its single-child descendants.
 */
function chainFromSelection() {
  const selected = selectedGroups();
  if (selected.length >= 2) return selected.slice().sort((a, b) => depth(a) - depth(b)).map(g => g.name);
  if (selected.length === 1) {
    const chain = [selected[0]];
    for (;;) {
      const kids = (chain[chain.length - 1].children || []).filter(c => c instanceof Group);
      if (kids.length !== 1) break;
      chain.push(kids[0]);
    }
    return chain.map(g => g.name);
  }
  return [];
}

function uniqueId(base, taken) {
  const used = new Set(taken);
  if (!used.has(base)) return base;
  for (let i = 2; ; i++) if (!used.has(`${base}_${i}`)) return `${base}_${i}`;
}

function modifierIds() {
  const r = RigStore.rig;
  return [...r.ikChains, ...r.lookAts, ...r.springBones].map(x => x.id);
}

const parseBones = text => String(text || '').split(/[\s,>]+/).map(s => s.trim()).filter(Boolean);
const toNumber = (v, fallback = 0) => (Number.isFinite(Number(v)) ? Number(v) : fallback);
const vec = v => [0, 1, 2].map(i => toNumber(v?.[i]));

const boneOptions = () => Object.fromEntries([['', '—'], ...Group.all.map(g => [g.name, g.name])]);
const locatorOptions = () => Object.fromEntries([['', '—'], ...(typeof Locator !== 'undefined' ? Locator.all : []).map(l => [l.name, l.name])]);
const animationOptions = () => Object.fromEntries((typeof Animation !== 'undefined' ? Animation.all : []).map(a => [a.name, a.name]));

function openForm(title, form, onConfirm, lines = []) {
  new Dialog({
    id: 'azurelib_rig_edit',
    title,
    width: 520,
    lines,
    form,
    onConfirm(result) {
      onConfirm(result);
    },
  }).show();
}

function editHitbox(index) {
  const h = RigStore.rig.hitboxes[index];
  openForm(`Hitbox: ${h.name}`, {
    name: { label: 'Name', type: 'text', value: h.name },
    bone: { label: 'Bone', type: 'select', options: boneOptions(), value: h.bone },
    role: { label: 'Role', type: 'select', options: Object.fromEntries(HITBOX_ROLES.map(r => [r, r.charAt(0) + r.slice(1).toLowerCase()])), value: h.role },
    fit: { label: 'Fit to bone cubes', type: 'checkbox', value: h.fit },
    size: { label: 'Size (pixels)', type: 'vector', dimensions: 3, value: h.size, condition: f => !f.fit },
    offset: { label: 'Offset (pixels)', type: 'vector', dimensions: 3, value: h.offset },
    inflate: { label: 'Inflate (pixels)', type: 'number', value: h.inflate, step: 0.25 },
    anchorAtPivot: { label: 'Center on pivot', type: 'checkbox', value: h.anchorAtPivot },
    damageMultiplier: { label: 'Damage multiplier', type: 'number', value: h.damageMultiplier, step: 0.1, min: 0, condition: f => f.role === 'COMBAT' },
    tags: { label: 'Tags (comma separated)', type: 'text', value: h.tags.join(', ') },
  }, r => RigStore.edit('Edit hitbox', rig => {
    Object.assign(rig.hitboxes[index], {
      name: r.name.trim() || r.bone,
      bone: r.bone,
      role: r.role,
      fit: r.fit,
      size: vec(r.size),
      offset: vec(r.offset),
      inflate: toNumber(r.inflate),
      anchorAtPivot: r.anchorAtPivot,
      damageMultiplier: toNumber(r.damageMultiplier, 1),
      tags: r.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
  }), ['<p>Hitboxes follow their bone. Without a size, AzureLib fits the box to the bone\'s own cubes.</p>']);
}

function editSocket(index) {
  const s = RigStore.rig.sockets[index];
  openForm(`Socket: ${s.locator || s.name}`, {
    follows: { label: 'Follows', type: 'select', options: { bone: 'A bone', locator: 'A Blockbench locator' }, value: s.locator ? 'locator' : 'bone' },
    name: { label: 'Name', type: 'text', value: s.name, condition: f => f.follows === 'bone' },
    bone: { label: 'Bone', type: 'select', options: boneOptions(), value: s.bone || '', condition: f => f.follows === 'bone' },
    locator: { label: 'Locator', type: 'select', options: locatorOptions(), value: s.locator || '', condition: f => f.follows === 'locator' },
    offset: { label: 'Offset (pixels, bone axes)', type: 'vector', dimensions: 3, value: s.offset },
    rotation: { label: 'Rotation (degrees)', type: 'vector', dimensions: 3, value: s.rotation },
    serverHitbox: { label: 'Server anchor hitbox', type: 'text', value: s.serverHitbox, placeholder: 'e.g. muzzle_anchor (optional)' },
  }, r => RigStore.edit('Edit socket', rig => {
    const target = rig.sockets[index];
    const isLocator = r.follows === 'locator';
    Object.assign(target, {
      name: isLocator ? r.locator : (r.name.trim() || 'socket'),
      bone: isLocator ? null : r.bone,
      locator: isLocator ? r.locator : null,
      offset: vec(r.offset),
      rotation: vec(r.rotation),
      serverHitbox: r.serverHitbox.trim(),
    });
  }), ['<p>The arrow in the viewport is the socket\'s front (-Z); the short arrow is up. A server anchor hitbox lets the server resolve the socket too.</p>']);
}

function targetForm(t, kinds) {
  return {
    targetType: { label: 'Target', type: 'select', options: Object.fromEntries(kinds.map(k => [k, IK_TARGETS[k]])), value: t.type },
    stepUp: { label: 'Max step up (blocks)', type: 'number', value: t.stepUp ?? 0.5, step: 0.05, condition: f => f.targetType === 'ground' },
    stepDown: { label: 'Max step down (blocks)', type: 'number', value: t.stepDown ?? 0.75, step: 0.05, condition: f => f.targetType === 'ground' },
    targetPoint: { label: 'Model point (pixels)', type: 'vector', dimensions: 3, value: t.point, condition: f => f.targetType === 'model' },
  };
}

function previewForm(p, allowGround) {
  const modes = { off: 'Off', point: 'Fixed point', locator: 'Follow a locator' };
  if (allowGround) modes.ground = 'Ground (raised by offset)';
  return {
    _preview: { type: 'info', text: '<b>Viewport preview</b> (Animate mode)' },
    previewMode: { label: 'Preview target', type: 'select', options: modes, value: p.enabled === false ? 'off' : p.mode },
    groundHeight: { label: 'Ground offset (pixels)', type: 'number', value: p.groundHeight ?? 0, condition: f => f.previewMode === 'ground' },
    previewPoint: { label: 'Point (pixels)', type: 'vector', dimensions: 3, value: p.point, condition: f => f.previewMode === 'point' },
    previewLocator: { label: 'Locator', type: 'select', options: locatorOptions(), value: p.locator || '', condition: f => f.previewMode === 'locator' },
  };
}

function readPreview(r) {
  return {
    enabled: r.previewMode !== 'off',
    mode: r.previewMode === 'off' ? 'point' : r.previewMode,
    groundHeight: toNumber(r.groundHeight),
    point: vec(r.previewPoint),
    locator: r.previewLocator || '',
  };
}

function readTarget(r) {
  return { type: r.targetType, stepUp: toNumber(r.stepUp, 0.5), stepDown: toNumber(r.stepDown, 0.75), point: vec(r.targetPoint) };
}

function editIkChain(index) {
  const c = RigStore.rig.ikChains[index];
  openForm(`IK chain: ${c.id}`, {
    id: { label: 'Modifier id', type: 'text', value: c.id },
    bones: { label: 'Bones (root first)', type: 'text', value: c.bones.join(', ') },
    effector: { label: 'Effector (pixels from last bone pivot)', type: 'vector', dimensions: 3, value: c.effector },
    solver: { label: 'Solver', type: 'select', options: IK_SOLVERS, value: c.solver },
    usePole: { label: 'Use pole (two-bone)', type: 'checkbox', value: !!c.pole, condition: f => f.solver !== 'ccd' },
    pole: { label: 'Pole (model pixels)', type: 'vector', dimensions: 3, value: c.pole || [0, 8, -20], condition: f => f.usePole && f.solver !== 'ccd' },
    iterations: { label: 'Iterations', type: 'number', value: c.iterations, min: 1, max: 64, condition: f => f.solver !== 'two_bone' },
    tolerance: { label: 'Tolerance (pixels)', type: 'number', value: c.tolerance, step: 0.05, condition: f => f.solver !== 'two_bone' },
    ...targetForm(c.target, ['ground', 'entity_eyes', 'world', 'model']),
    priority: { label: 'Priority', type: 'number', value: c.priority },
    weight: { label: 'Default weight', type: 'number', value: c.weight, min: 0, max: 1, step: 0.05 },
    ...previewForm(c.preview, true),
  }, r => RigStore.edit('Edit IK chain', rig => {
    Object.assign(rig.ikChains[index], {
      id: r.id.trim() || c.id,
      bones: parseBones(r.bones),
      effector: vec(r.effector),
      solver: r.solver,
      pole: r.usePole && r.solver !== 'ccd' ? vec(r.pole) : null,
      iterations: Math.max(1, Math.round(toNumber(r.iterations, 10))),
      tolerance: toNumber(r.tolerance, 0.1),
      target: readTarget(r),
      priority: Math.round(toNumber(r.priority)),
      weight: Math.min(1, Math.max(0, toNumber(r.weight, 1))),
      preview: readPreview(r),
    });
  }), ['<p>Constraints on chain bones are applied by the solver automatically.</p>']);
}

function editLookAt(index) {
  const l = RigStore.rig.lookAts[index];
  openForm(`Look-at: ${l.id}`, {
    id: { label: 'Modifier id', type: 'text', value: l.id },
    bones: { label: 'Bones (root first, last one faces the target)', type: 'text', value: l.bones.join(', ') },
    forward: { label: 'Forward (last bone axes)', type: 'vector', dimensions: 3, value: l.forward },
    ...targetForm(l.target, ['entity_eyes', 'world', 'model']),
    priority: { label: 'Priority', type: 'number', value: l.priority },
    weight: { label: 'Default weight', type: 'number', value: l.weight, min: 0, max: 1, step: 0.05 },
    ...previewForm(l.preview, false),
  }, r => RigStore.edit('Edit look-at', rig => {
    Object.assign(rig.lookAts[index], {
      id: r.id.trim() || l.id,
      bones: parseBones(r.bones),
      forward: vec(r.forward),
      target: readTarget(r),
      priority: Math.round(toNumber(r.priority)),
      weight: Math.min(1, Math.max(0, toNumber(r.weight, 1))),
      preview: readPreview(r),
    });
  }));
}

function editConstraint(index) {
  const c = RigStore.rig.constraints[index];
  openForm(`Constraint: ${c.bone}`, {
    bone: { label: 'Bone', type: 'select', options: boneOptions(), value: c.bone },
    type: { label: 'Type', type: 'select', options: CONSTRAINT_TYPES, value: c.type },
    min: { label: 'Min (degrees)', type: 'vector', dimensions: 3, value: c.min },
    max: { label: 'Max (degrees)', type: 'vector', dimensions: 3, value: c.max },
    standalone: { label: 'Also clamp the final pose', type: 'checkbox', value: c.standalone },
  }, r => RigStore.edit('Edit constraint', rig => {
    Object.assign(rig.constraints[index], {
      bone: r.bone,
      type: r.type,
      min: vec(r.min),
      max: vec(r.max),
      standalone: r.standalone,
    });
  }), ['<p>Degrees relative to the bone\'s rest pose, with the signs of the exported animation file: for X and Y that\'s the opposite of what Blockbench 5 shows on keyframes (Z is the same). Hinges use only their own axis. IK, look-at and spring bones on this bone respect it; "clamp the final pose" also clamps the animation itself.</p>']);
}

function editSpring(index) {
  const s = RigStore.rig.springBones[index];
  openForm(`Spring bones: ${s.id}`, {
    id: { label: 'Modifier id', type: 'text', value: s.id },
    bones: { label: 'Bones (root first)', type: 'text', value: s.bones.join(', ') },
    useTip: { label: 'Last bone swings (tip)', type: 'checkbox', value: !!s.tip },
    tip: { label: 'Tip (pixels from last bone pivot)', type: 'vector', dimensions: 3, value: s.tip || [0, 0, 4], condition: f => f.useTip },
    stiffness: { label: 'Stiffness (0–1)', type: 'number', value: s.stiffness, min: 0, max: 1, step: 0.05 },
    damping: { label: 'Damping (0–1)', type: 'number', value: s.damping, min: 0, max: 1, step: 0.05 },
    gravity: { label: 'Gravity (blocks/tick²)', type: 'number', value: s.gravity, step: 0.001 },
    inertia: { label: 'Inertia (0–1)', type: 'number', value: s.inertia, min: 0, max: 1, step: 0.05 },
    priority: { label: 'Priority', type: 'number', value: s.priority },
    colliders: { label: 'Colliders (comma separated ids)', type: 'text', value: (s.colliders || []).join(', ') },
    radius: { label: 'Chain radius (pixels)', type: 'number', value: s.radius || 0, min: 0, step: 0.25 },
    ground: { label: 'Stay above the ground', type: 'checkbox', value: !!s.ground },
    previewEnabled: { label: 'Preview while animating', type: 'checkbox', value: s.preview?.enabled !== false },
  }, r => RigStore.edit('Edit spring bones', rig => {
    Object.assign(rig.springBones[index], {
      id: r.id.trim() || s.id,
      bones: parseBones(r.bones),
      tip: r.useTip ? vec(r.tip) : null,
      stiffness: Math.min(1, Math.max(0, toNumber(r.stiffness, 0.2))),
      damping: Math.min(1, Math.max(0, toNumber(r.damping, 0.25))),
      gravity: toNumber(r.gravity),
      inertia: Math.min(1, Math.max(0, toNumber(r.inertia, 1))),
      priority: Math.round(toNumber(r.priority, 200)),
      colliders: parseBones(r.colliders),
      radius: Math.max(0, toNumber(r.radius)),
      ground: r.ground,
      preview: { enabled: r.previewEnabled },
    });
  }), [
    '<p>The first bone follows the animation and anchors the chain. Play the animation to see the swing; inertia only affects entities moving in game.</p>',
    `<p>Colliders here: ${RigStore.rig.colliders.length ? RigStore.rig.colliders.map(c => `<code>${c.id}</code>`).join(', ') : '<i>none yet; add them in the Colliders section</i>'}. The chain radius is roughly how thick the chain is; it keeps it off colliders and the ground.</p>`,
  ]);
}

function editCollider(index) {
  const c = RigStore.rig.colliders[index];
  openForm(`Collider: ${c.id}`, {
    id: { label: 'Id', type: 'text', value: c.id },
    bone: { label: 'Bone', type: 'select', options: boneOptions(), value: c.bone },
    shape: { label: 'Shape', type: 'select', options: { sphere: 'Sphere', capsule: 'Capsule' }, value: c.shape },
    start: { label: 'Centre (pixels)', type: 'vector', dimensions: 3, value: c.start, condition: f => f.shape === 'sphere' },
    capStart: { label: 'Start (pixels)', type: 'vector', dimensions: 3, value: c.start, condition: f => f.shape === 'capsule' },
    end: { label: 'End (pixels)', type: 'vector', dimensions: 3, value: c.end, condition: f => f.shape === 'capsule' },
    radius: { label: 'Radius (pixels)', type: 'number', value: c.radius, min: 0.1, step: 0.25 },
  }, r => RigStore.edit('Edit collider', rig => {
    const oldId = rig.colliders[index].id;
    const id = r.id.trim() || oldId;
    Object.assign(rig.colliders[index], {
      id,
      bone: r.bone,
      shape: r.shape,
      start: vec(r.shape === 'capsule' ? r.capStart : r.start),
      end: vec(r.shape === 'capsule' ? r.end : r.start),
      radius: Math.max(0.1, toNumber(r.radius, 2)),
    });
    // Keep spring chains pointing at a renamed collider.
    if (id !== oldId) {
      for (const sb of rig.springBones) sb.colliders = (sb.colliders || []).map(x => (x === oldId ? id : x));
    }
  }), ['<p>Positions are pixels from the bone\'s pivot along its axes. Spring chains that list this collider swing around it instead of through it.</p>']);
}

function samplesToText(b) {
  return b.samples.map(s => (b.dimensions === 2 ? `${s.x}, ${s.y}, ${s.animation}` : `${s.x}, ${s.animation}`)).join('\n');
}

function textToSamples(text, dimensions) {
  return String(text || '').split('\n').map(line => line.split(',').map(p => p.trim())).filter(p => p.length >= 2 && p[p.length - 1])
    .map(p => (dimensions === 2
      ? { x: toNumber(p[0]), y: toNumber(p[1]), animation: p.slice(2).join(',') }
      : { x: toNumber(p[0]), y: 0, animation: p.slice(1).join(',') }));
}

function editBlendSpace(index) {
  const b = RigStore.rig.blendSpaces[index];
  const animations = Object.keys(animationOptions());
  openForm(`Blend space: ${b.name}`, {
    name: { label: 'Name', type: 'text', value: b.name },
    dimensions: { label: 'Dimensions', type: 'select', options: { 1: '1D', 2: '2D' }, value: String(b.dimensions) },
    inputX: { label: 'Input (X)', type: 'select', options: BLEND_INPUTS, value: b.input.x },
    inputY: { label: 'Input (Y)', type: 'select', options: BLEND_INPUTS, value: b.input.y, condition: f => String(f.dimensions) === '2' },
    samples: { label: 'Samples', type: 'textarea', value: samplesToText(b), height: 120, placeholder: '1D: position, animation\n2D: x, y, animation' },
    smoothing: { label: 'Input smoothing (ticks)', type: 'number', value: b.smoothing, min: 0, step: 0.5 },
    syncPhase: { label: 'Sync phase', type: 'checkbox', value: b.syncPhase },
  }, r => RigStore.edit('Edit blend space', rig => {
    const dimensions = String(r.dimensions) === '2' ? 2 : 1;
    Object.assign(rig.blendSpaces[index], {
      name: r.name.trim() || b.name,
      dimensions,
      input: { x: r.inputX, y: r.inputY },
      samples: textToSamples(r.samples, dimensions),
      smoothing: Math.max(0, toNumber(r.smoothing)),
      syncPhase: r.syncPhase,
    });
  }), [`<p>One sample per line: <code>position, animation</code> for 1D, <code>x, y, animation</code> for 2D. Animations here: ${animations.length ? animations.map(a => `<code>${a}</code>`).join(', ') : '<i>none yet</i>'}.</p>`]);
}

function requireBones(names, what) {
  if (names.length) return true;
  Blockbench.showQuickMessage(`Select the bone(s) for the ${what} first.`, 2500);
  return false;
}

function fitCollider(bone) {
  const box = hitboxBox({ bone, fit: true, size: [0, 0, 0], offset: [0, 0, 0], inflate: 0, anchorAtPivot: false });
  if (!box) return { shape: 'sphere', start: [0, 0, 0], end: [0, 0, 0], radius: 2 };
  const round = v => Math.round(v * 100) / 100;
  const center = [box.center.x, box.center.y, box.center.z];
  const half = [box.half.x, box.half.y, box.half.z];
  const axis = half.indexOf(Math.max(...half));
  const radius = Math.max(...half.filter((_, i) => i !== axis));
  const reach = half[axis] - radius;
  if (reach < 0.5) {
    return { shape: 'sphere', start: center.map(round), end: center.map(round), radius: round(Math.max(...half)) };
  }
  const start = center.slice();
  const end = center.slice();
  start[axis] -= reach;
  end[axis] += reach;
  return { shape: 'capsule', start: start.map(round), end: end.map(round), radius: round(radius) };
}

const Add = {
  hitbox() {
    const groups = selectedGroups();
    if (!requireBones(groups, 'hitbox')) return;
    RigStore.edit('Add hitbox', rig => {
      for (const g of groups) {
        const h = newHitbox(g.name);
        h.name = uniqueId(g.name, rig.hitboxes.map(x => x.name));
        rig.hitboxes.push(h);
      }
    });
  },

  socket() {
    const locators = selectedLocators();
    const groups = selectedGroups();
    if (!locators.length && !groups.length) {
      Blockbench.showQuickMessage('Select a locator, or a bone to put the socket on.', 2500);
      return;
    }
    RigStore.edit('Add socket', rig => {
      const taken = () => rig.sockets.map(s => s.locator || s.name);
      for (const l of locators) {
        if (!rig.sockets.some(s => s.locator === l.name)) rig.sockets.push(newSocket(l.name, { locator: l.name }));
      }
      if (!locators.length) {
        for (const g of groups) rig.sockets.push(newSocket(uniqueId(`${g.name}_socket`, taken()), { bone: g.name }));
      }
    });
  },

  allLocators() {
    const locators = typeof Locator !== 'undefined' ? Locator.all : [];
    if (!locators.length) {
      Blockbench.showQuickMessage('This model has no locators.', 2000);
      return;
    }
    RigStore.edit('Add sockets for locators', rig => {
      for (const l of locators) {
        if (!rig.sockets.some(s => s.locator === l.name)) rig.sockets.push(newSocket(l.name, { locator: l.name }));
      }
    });
  },

  ikChain() {
    const bones = chainFromSelection();
    if (!requireBones(bones, 'IK chain')) return;
    RigStore.edit('Add IK chain', rig => {
      rig.ikChains.push(newIkChain(uniqueId(`${bones[0]}_ik`, modifierIds()), bones));
    });
    editIkChain(RigStore.rig.ikChains.length - 1);
  },

  lookAt() {
    const bones = chainFromSelection();
    if (!requireBones(bones, 'look-at')) return;
    RigStore.edit('Add look-at', rig => {
      rig.lookAts.push(newLookAt(uniqueId(`${bones[bones.length - 1]}_look`, modifierIds()), bones));
    });
  },

  constraint() {
    const groups = selectedGroups();
    if (!requireBones(groups, 'constraint')) return;
    RigStore.edit('Add constraint', rig => {
      for (const g of groups) {
        if (!rig.constraints.some(c => c.bone === g.name)) rig.constraints.push(newConstraint(g.name));
      }
    });
  },

  spring() {
    const bones = chainFromSelection();
    if (!requireBones(bones, 'spring chain')) return;
    RigStore.edit('Add spring bones', rig => {
      rig.springBones.push(newSpringBone(uniqueId(`${bones[0]}_spring`, modifierIds()), bones));
    });
  },

  collider() {
    const groups = selectedGroups();
    if (!requireBones(groups, 'collider')) return;
    RigStore.edit('Add collider', rig => {
      for (const g of groups) {
        const c = newCollider(uniqueId(g.name, rig.colliders.map(x => x.id)), g.name);
        Object.assign(c, fitCollider(g.name));
        rig.colliders.push(c);
      }
    });
  },

  blendSpace() {
    RigStore.edit('Add blend space', rig => {
      rig.blendSpaces.push(newBlendSpace(uniqueId('locomotion', rig.blendSpaces.map(b => b.name))));
    });
    editBlendSpace(RigStore.rig.blendSpaces.length - 1);
  },
};

export function showValidation() {
  const issues = validateRig();
  new Dialog({
    id: 'azurelib_rig_validation',
    title: 'AzureLib Rig Check',
    width: 560,
    lines: [issues.length
      ? `<ul style="padding-left:18px;line-height:1.6">${issues.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`
      : '<p>No problems found.</p>'],
    buttons: ['dialog.close'],
  }).show();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

export function showCodeExport() {
  const rig = RigStore.rig;
  const issues = validateRig();

  new Dialog({
    id: 'azurelib_rig_codegen',
    title: 'Generate AzureLib Code',
    width: 560,
    lines: issues.length
      ? [`<p style="color:var(--color-warning, #e8b400)">${issues.length} problem(s) found. The code is generated anyway; run <b>Check Rig</b> to see them.</p>`]
      : [],
    form: {
      target: { label: 'AzureLib branch', type: 'select', options: CODEGEN_TARGETS, value: normalizeTarget(rig.codegen.target) },
      entityClass: { label: 'Animatable class', type: 'text', value: rig.codegen.entityClass },
      packageRoot: { label: 'Package root', type: 'text', value: rig.codegen.packageRoot || '', placeholder: 'Leave blank for the branch default' },
      _roots: {
        type: 'info',
        text: `Defaults: ${Object.values(TARGETS).map(t => `${t.label} <code>${t.root}</code>`).join(', ')}.`,
      },
    },
    onConfirm(form) {
      const entityClass = (form.entityClass || '').trim().replace(/[^A-Za-z0-9_$]/g, '') || 'ExampleEntity';
      const packageRoot = (form.packageRoot || '').trim().replace(/[^A-Za-z0-9_.]/g, '').replace(/^[.]+|[.]+$/g, '');
      RigStore.edit('Code generation settings', r => { r.codegen = { target: form.target, entityClass, packageRoot }; });
      const text = generateText(RigStore.rig, { target: form.target, entityClass, packageRoot });
      showCodeResult(text, entityClass);
    },
  }).show();
}

function showCodeResult(text, entityClass) {
  const dialog = new Dialog({
    id: 'azurelib_rig_code',
    title: 'AzureLib Code',
    width: 900,
    form: {
      code: { type: 'textarea', value: text, height: 460 },
    },
    buttons: ['Copy', 'Save .java', 'dialog.close'],
    onButton(index) {
      if (index === 0) {
        const copy = navigator.clipboard?.writeText?.(text);
        if (copy) {
          copy.then(() => Blockbench.showQuickMessage('Copied to clipboard', 1500));
        } else {
          Blockbench.showQuickMessage('Clipboard unavailable; select the text and copy it instead.', 2500);
        }
        return false;
      }
      if (index === 1) {
        Blockbench.export({
          type: 'Java Source',
          extensions: ['java'],
          name: `${entityClass}Rig`,
          content: text,
        });
        return false;
      }
      return true;
    },
  });
  dialog.show();
}

const PANEL_ID = 'azurelib_rig';
const STYLE_ID = 'azurelib-rig-style';

let panel = null;
let actions = [];
let unsubscribe = null;
let onModeChange = null;
let onModelChange = null;

const PANEL_CSS = `
.azl-rig { padding: 4px 6px 8px; font-size: 12px; line-height: 1.35; }
.azl-rig .azl-bar { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; flex-wrap: wrap; }
.azl-rig .azl-spacer { flex: 1; }
.azl-rig .azl-btn {
  height: 22px; min-width: 0; padding: 0 8px; font-size: 12px; line-height: 22px;
  border-radius: 4px; background: var(--color-button); color: var(--color-text); cursor: pointer;
}
.azl-rig .azl-btn:hover { background: var(--color-accent); color: var(--color-accent_text); }
.azl-rig .azl-badge {
  display: inline-block; margin-left: 4px; padding: 0 5px; border-radius: 8px; font-size: 10px; line-height: 15px;
  background: var(--color-warning, #e8b400); color: #000;
}
.azl-rig .azl-chip {
  padding: 0 6px; height: 20px; line-height: 20px; border-radius: 10px; font-size: 11px; cursor: pointer;
  border: 1px solid var(--color-border); color: var(--color-subtle_text); user-select: none;
}
.azl-rig .azl-chip.on { border-color: var(--color-accent); color: var(--color-text); }
.azl-rig .azl-hint { color: var(--color-subtle_text); padding: 2px 4px 6px; }
.azl-rig .azl-head {
  display: flex; align-items: center; gap: 4px; height: 22px; padding: 0 4px; margin-top: 2px;
  border-radius: 4px; cursor: pointer; user-select: none;
}
.azl-rig .azl-head:hover { background: var(--color-button); }
.azl-rig .azl-caret { width: 10px; color: var(--color-subtle_text); font-size: 10px; }
.azl-rig .azl-title { font-weight: 600; }
.azl-rig .azl-count { color: var(--color-subtle_text); font-size: 11px; }
.azl-rig .azl-add, .azl-rig .azl-del {
  width: 18px; height: 18px; line-height: 17px; text-align: center; border-radius: 3px; cursor: pointer;
  color: var(--color-subtle_text); font-size: 15px;
}
.azl-rig .azl-add:hover { background: var(--color-accent); color: var(--color-accent_text); }
.azl-rig .azl-add.small { width: auto; padding: 0 4px; font-size: 11px; }
.azl-rig .azl-row {
  display: flex; align-items: center; gap: 6px; height: 21px; padding: 0 4px 0 18px; border-radius: 4px; cursor: pointer;
}
.azl-rig .azl-row:hover { background: var(--color-button); }
.azl-rig .azl-dot { width: 8px; height: 8px; border-radius: 2px; flex: none; }
.azl-rig .azl-name { flex: none; max-width: 55%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.azl-rig .azl-detail { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--color-subtle_text); font-size: 11px; }
.azl-rig .azl-detail.warn { color: var(--color-warning, #e8b400); }
.azl-rig .azl-del { visibility: hidden; }
.azl-rig .azl-row:hover .azl-del { visibility: visible; }
.azl-rig .azl-del:hover { color: var(--color-close, #e66); }
.azl-rig .azl-sub { padding: 2px 4px 4px 18px; color: var(--color-subtle_text); font-size: 11px; }
.azl-rig .azl-sub label { margin-right: 10px; cursor: pointer; }
.azl-rig .azl-sub input[type=range] { width: 100%; height: 16px; margin: 0; }
.azl-rig .azl-weights { display: flex; flex-wrap: wrap; gap: 2px 10px; margin-top: 2px; }
`;

function injectStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = PANEL_CSS;
  document.head.appendChild(style);
}

function removeStyle() {
  document.getElementById(STYLE_ID)?.remove();
}

const SECTIONS = [
  { key: 'hitboxes', title: 'Hitboxes', add: 'hitbox', addTitle: 'Add a hitbox to each selected bone' },
  { key: 'sockets', title: 'Sockets', add: 'socket', addTitle: 'Add a socket for the selected locator or bone' },
  { key: 'ikChains', title: 'IK chains', add: 'ikChain', addTitle: 'Add an IK chain from the selected bones (root → tip, or just the root)' },
  { key: 'lookAts', title: 'Look-at', add: 'lookAt', addTitle: 'Add a look-at from the selected bones (e.g. neck, head)' },
  { key: 'constraints', title: 'Constraints', add: 'constraint', addTitle: 'Add a rotation limit to each selected bone' },
  { key: 'springBones', title: 'Spring bones', add: 'spring', addTitle: 'Add a spring chain from the selected bones (root → tip, or just the root)' },
  { key: 'colliders', title: 'Colliders', add: 'collider', addTitle: 'Add a collider fitted to each selected bone, for spring bones to swing around' },
  { key: 'blendSpaces', title: 'Blend spaces', add: 'blendSpace', addTitle: 'Add a blend space' },
];

const EDITORS = {
  hitboxes: editHitbox,
  sockets: editSocket,
  ikChains: editIkChain,
  lookAts: editLookAt,
  constraints: editConstraint,
  springBones: editSpring,
  colliders: editCollider,
  blendSpaces: editBlendSpace,
};

const SECTION_COLORS = {
  sockets: '#ff55ff',
  ikChains: '#00ff88',
  lookAts: '#44aaff',
  constraints: '#ff9900',
  springBones: '#aa66ff',
  colliders: '#ff8a3d',
  blendSpaces: '#ffaa00',
};

/** Which sections are expanded; null means "open if it has entries". Kept for the session. */
const sectionOpen = Object.fromEntries(SECTIONS.map(sec => [sec.key, null]));

function registerPanel() {
  injectStyle();

  panel = new Panel(PANEL_ID, {
    name: 'AzureLib Rig',
    icon: 'accessibility_new',
    display_condition: { modes: ['edit', 'animate'], formats: ['azure_model'] },
    default_position: {
      slot: 'right_bar',
      float_position: [0, 0],
      float_size: [320, 480],
      height: 360,
      folded: false,
      attached_to: 'outliner',
    },
    component: {
      name: 'azl-rig-panel',
      data() {
        return {
          rig: RigStore.rig,
          preview: PreviewSettings,
          sections: SECTIONS,
          open: sectionOpen,
          blend: { index: -1, x: 0, y: 0 },
          version: 0,
          mode: typeof Modes !== 'undefined' && Modes.selected ? Modes.selected.id : '',
        };
      },
      mounted() {
        this._off = RigStore.onChange(rig => {
          this.rig = rig;
          if (this.blend.index >= rig.blendSpaces.length) this.stopBlend();
          this.version++;
        });
      },
      beforeDestroy() {
        this._off?.();
      },
      computed: {
        boneSet() { this.version; return new Set(Group.all.map(g => g.name)); },
        locatorSet() { this.version; return new Set((typeof Locator !== 'undefined' ? Locator.all : []).map(l => l.name)); },
        issueCount() { this.version; return validateRig(this.rig).length; },
        isEmpty() { return SECTIONS.every(sec => !this.rig[sec.key].length); },
        isAnimate() { return this.mode === 'animate'; },
        blendRange() {
          const b = this.blend.index >= 0 ? this.rig.blendSpaces[this.blend.index] : null;
          return b ? blendSpaceRange(b) : { x: [0, 1], y: [0, 1] };
        },
        blendWeights() { this.blend.x; this.blend.y; this.blend.index; return BlendPreview.weights(); },
      },
      methods: {
        isOpen(key) {
          const state = this.open[key];
          return state === null ? this.rig[key].length > 0 : state;
        },
        toggle(key) {
          this.open[key] = !this.isOpen(key);
        },
        add(kind, key) {
          Add[kind]();
          if (key) this.open[key] = true;
        },
        remove(key, index) {
          if (key === 'blendSpaces' && this.blend.index === index) this.stopBlend();
          RigStore.edit('Remove entry', rig => {
            const [removed] = rig[key].splice(index, 1);
            // Spring chains stop using a removed collider.
            if (key === 'colliders' && removed) {
              for (const sb of rig.springBones) sb.colliders = (sb.colliders || []).filter(id => id !== removed.id);
            }
          });
        },
        edit(key, index) {
          EDITORS[key](index);
        },
        missing(names) { return names.filter(n => !this.boneSet.has(n)); },
        color(key, item) {
          if (key !== 'hitboxes') return SECTION_COLORS[key];
          if (item.role === 'INTERACT') return '#55ffff';
          if (item.role === 'ANCHOR') return '#ffff55';
          if (item.damageMultiplier > 1) return '#ff5555';
          if (item.damageMultiplier < 1) return '#5599ff';
          return '#55ff55';
        },
        label(key, item) {
          if (key === 'hitboxes') return item.name;
          if (key === 'sockets') return item.locator || item.name;
          if (key === 'constraints') return item.bone;
          if (key === 'blendSpaces') return item.name;
          return item.id;
        },
        detail(key, item) {
          switch (key) {
            case 'hitboxes': {
              const parts = [];
              if (item.name !== item.bone) parts.push(item.bone);
              if (item.role !== 'COMBAT') parts.push(item.role.toLowerCase());
              else if (item.damageMultiplier !== 1) parts.push(`×${item.damageMultiplier}`);
              if (!item.fit) parts.push(item.size.join('×'));
              return parts.join(' · ');
            }
            case 'sockets': return [item.locator ? 'locator' : item.bone, item.serverHitbox ? 'server' : ''].filter(Boolean).join(' · ');
            case 'ikChains': return `${item.bones.length} bones · ${item.target.type.replace('_', ' ')}`;
            case 'lookAts': return item.bones.join(' › ');
            case 'constraints': return `${item.type.replace('_', ' ')}${item.standalone ? ' · clamps pose' : ''}`;
            case 'springBones': {
              const extras = [];
              if ((item.colliders || []).length) extras.push(`${item.colliders.length} collider${item.colliders.length === 1 ? '' : 's'}`);
              if (item.ground) extras.push('ground');
              return [`${item.bones.length} bones`, ...extras].join(' · ');
            }
            case 'colliders': return `${item.shape} · ${item.bone} · r${item.radius}`;
            case 'blendSpaces': return `${item.dimensions}D · ${item.samples.length} samples`;
            default: return '';
          }
        },
        warning(key, item) {
          this.version;
          switch (key) {
            case 'hitboxes':
              if (!this.boneSet.has(item.bone)) return `missing bone ${item.bone}`;
              return hitboxBox(item) ? '' : 'empty box';
            case 'sockets':
              if (item.locator) return this.locatorSet.has(item.locator) ? '' : 'missing locator';
              return this.boneSet.has(item.bone) ? '' : `missing bone ${item.bone}`;
            case 'constraints':
              return this.boneSet.has(item.bone) ? '' : 'missing bone';
            case 'colliders':
              return this.boneSet.has(item.bone) ? '' : `missing bone ${item.bone}`;
            case 'ikChains':
            case 'lookAts':
            case 'springBones': {
              const gone = this.missing(item.bones);
              if (gone.length) return `missing ${gone.join(', ')}`;
              const known = new Set(this.rig.colliders.map(c => c.id));
              const unknown = (item.colliders || []).filter(id => !known.has(id));
              return unknown.length ? `unknown collider ${unknown.join(', ')}` : '';
            }
            default:
              return '';
          }
        },
        togglePreview(key) {
          PreviewSettings[key] = !PreviewSettings[key];
          if (Animator?.open) { try { Animator.preview(); } catch (_) { /* ignore */ } }
        },
        toggleBlend(index) {
          if (this.blend.index === index) {
            this.stopBlend();
            return;
          }
          const b = this.rig.blendSpaces[index];
          const range = blendSpaceRange(b);
          this.blend.index = index;
          this.blend.x = Math.max(range.x[0], Math.min(range.x[1], this.blend.x));
          this.blend.y = Math.max(range.y[0], Math.min(range.y[1], this.blend.y));
          BlendPreview.inputX = this.blend.x;
          BlendPreview.inputY = this.blend.y;
          BlendPreview.start(b);
        },
        stopBlend() {
          this.blend.index = -1;
          BlendPreview.stop();
        },
        setBlendInput() {
          BlendPreview.inputX = Number(this.blend.x);
          BlendPreview.inputY = Number(this.blend.y);
          BlendPreview.refresh();
        },
        toggleOption(key) {
          RigStore.edit('Hitbox set options', rig => { rig.hitboxOptions[key] = !rig.hitboxOptions[key]; });
        },
        check() { showValidation(); },
        generate() { showCodeExport(); },
        pct(v) { return `${Math.round((v || 0) * 100)}%`; },
      },
      template: `
<div class="azl-rig">
  <div class="azl-bar">
    <span class="azl-btn" @click="generate()" title="Generate AzureLib Java for this rig">Code</span>
    <span class="azl-btn" @click="check()" title="Check the rig against the model">Check<span v-if="issueCount" class="azl-badge">{{ issueCount }}</span></span>
    <span class="azl-spacer"></span>
    <span class="azl-chip" :class="{on: preview.hitboxes}" @click="togglePreview('hitboxes')" title="Show hitboxes in the viewport">Boxes</span>
    <span class="azl-chip" :class="{on: preview.sockets}" @click="togglePreview('sockets')" title="Show sockets in the viewport">Sockets</span>
    <span class="azl-chip" :class="{on: preview.colliders}" @click="togglePreview('colliders')" title="Show spring colliders in the viewport">Colliders</span>
    <span class="azl-chip" :class="{on: preview.modifiers}" @click="togglePreview('modifiers')" title="Run IK, look-at, spring bones and constraints while animating">Pose</span>
  </div>
  <div v-if="isEmpty" class="azl-hint">Select bones or locators, then press + on a section.</div>

  <div v-for="sec in sections" :key="sec.key">
    <div class="azl-head" @click="toggle(sec.key)" :title="sec.addTitle">
      <span class="azl-caret">{{ isOpen(sec.key) ? '▼' : '▶' }}</span>
      <span class="azl-title">{{ sec.title }}</span>
      <span class="azl-count" v-if="rig[sec.key].length">{{ rig[sec.key].length }}</span>
      <span class="azl-spacer"></span>
      <span v-if="sec.key === 'sockets'" class="azl-add small" title="Add a socket for every locator" @click.stop="add('allLocators', sec.key)">all</span>
      <span class="azl-add" :title="sec.addTitle" @click.stop="add(sec.add, sec.key)">+</span>
    </div>

    <template v-if="isOpen(sec.key)">
      <div v-for="(item, i) in rig[sec.key]" :key="sec.key + i">
        <div class="azl-row" @click="edit(sec.key, i)" title="Click to edit">
          <span class="azl-dot" :style="{background: color(sec.key, item)}"></span>
          <span class="azl-name">{{ label(sec.key, item) }}</span>
          <span class="azl-detail" :class="{warn: !!warning(sec.key, item)}">{{ warning(sec.key, item) || detail(sec.key, item) }}</span>
          <span v-if="sec.key === 'blendSpaces' && isAnimate" class="azl-add" :title="blend.index === i ? 'Stop preview' : 'Preview'" @click.stop="toggleBlend(i)">{{ blend.index === i ? '■' : '▶' }}</span>
          <span class="azl-del" title="Remove" @click.stop="remove(sec.key, i)">×</span>
        </div>
        <div v-if="sec.key === 'blendSpaces' && blend.index === i" class="azl-sub">
          <div>X {{ Number(blend.x).toFixed(2) }}</div>
          <input type="range" :min="blendRange.x[0]" :max="blendRange.x[1]" step="0.01" v-model.number="blend.x" @input="setBlendInput()">
          <template v-if="item.dimensions === 2">
            <div>Y {{ Number(blend.y).toFixed(2) }}</div>
            <input type="range" :min="blendRange.y[0]" :max="blendRange.y[1]" step="0.01" v-model.number="blend.y" @input="setBlendInput()">
          </template>
          <div class="azl-weights">
            <span v-for="(s, j) in item.samples" :key="j">{{ s.animation }} {{ pct(blendWeights[j]) }}</span>
          </div>
          <div style="margin-top:2px">Press play to see motion. Samples share one timeline here; in game, phase sync keeps cycles in step.</div>
        </div>
      </div>
      <div v-if="sec.key === 'hitboxes' && rig.hitboxes.length" class="azl-sub">
        <label><input type="checkbox" :checked="rig.hitboxOptions.keepEntityBox" @change="toggleOption('keepEntityBox')"> keep entity box</label>
        <label><input type="checkbox" :checked="rig.hitboxOptions.clientOnly" @change="toggleOption('clientOnly')"> client only</label>
      </div>
    </template>
  </div>
</div>`,
    },
  });
}

function registerActions() {
  actions = [
    new Action('azurelib_rig_generate_code', {
      name: 'Generate AzureLib Rig Code',
      description: 'Generate AzureLib Java for the hitboxes, sockets, IK, spring bones and blend spaces in this model',
      icon: 'code',
      category: 'file',
      condition: () => Format?.id === 'azure_model',
      click: () => showCodeExport(),
    }),
    new Action('azurelib_rig_validate', {
      name: 'Check AzureLib Rig',
      description: 'Check the AzureLib rig against the model',
      icon: 'rule',
      category: 'file',
      condition: () => Format?.id === 'azure_model',
      click: () => showValidation(),
    }),
  ];
  MenuBar.addAction(actions[0], 'file.export');
  MenuBar.addAction(actions[1], 'file.export');
}

export function registerRigPanel() {
  if (panel) return;
  registerPanel();
  registerActions();
  unsubscribe = RigStore.onChange(() => panel?.inside_vue?.$forceUpdate?.());

  onModeChange = event => {
    const vue = panel?.inside_vue;
    if (!vue) return;
    vue.mode = event?.mode?.id || '';
    if (vue.mode !== 'animate' && vue.blend.index >= 0) vue.stopBlend();
  };
  Blockbench.on('select_mode', onModeChange);

  onModelChange = () => {
    const vue = panel?.inside_vue;
    if (vue) vue.version++;
  };
  Blockbench.on('finished_edit', onModelChange);
  Blockbench.on('select_project', onModelChange);
}

export function unregisterRigPanel() {
  unsubscribe?.();
  unsubscribe = null;
  if (onModeChange) Blockbench.removeListener('select_mode', onModeChange);
  if (onModelChange) {
    Blockbench.removeListener('finished_edit', onModelChange);
    Blockbench.removeListener('select_project', onModelChange);
  }
  onModeChange = null;
  onModelChange = null;
  for (const action of actions) action.delete();
  actions = [];
  panel?.delete();
  panel = null;
  removeStyle();
}
