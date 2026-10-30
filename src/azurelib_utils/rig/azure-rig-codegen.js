/**
 * AzureLib Animator — Rig Code Generation
 * ---------------------------------------
 * Turns the rig definitions into Java code for Azurelib: the entity's hitbox set and
 * socket constants, the animator's pose modifiers (IK, look-at, spring bones,
 * constraints) and blend spaces, and the renderer's attachment layer.
 *
 * © 2026 AzureDoom — MIT License
 */

/**
 * AzureLib branches the generator can target. `root` is the default package
 * root (overridable per project); `mojmap` marks branches on Mojang's mapped
 * names, which share the entity accessors used by blend-space inputs.
 */
export const TARGETS = {
  v26_3: { label: '26.3', root: 'mod.azure.azurelib.common', mojmap: true },
  v1_21_1: { label: '1.21.1', root: 'mod.azure.azurelib.common', mojmap: true },
  v1_20_1: { label: '1.20.1', root: 'mod.azure.azurelib.common', mojmap: true },
  v1_18: { label: '1.18.2', root: 'mod.azure.azurelib', mojmap: true },
  legacy: { label: '1.12.2 / 1.7.10', root: 'mod.azure.azurelib', mojmap: false },
  beta: { label: 'Beta 1.7.3 (Ornithe / StationAPI)', root: 'mod.azure.azurelib', mojmap: false },
};

/** Target id -> label, for select inputs. */
export const CODEGEN_TARGETS = Object.fromEntries(Object.entries(TARGETS).map(([id, t]) => [id, t.label]));

/** Older saved projects used `modern` for 1.21.x. */
export function normalizeTarget(target) {
  if (target === 'modern') return 'v1_21_1';
  return TARGETS[target] ? target : 'v1_21_1';
}

export const BLEND_INPUTS = {
  speed: 'Horizontal speed (blocks/second)',
  forward: 'Forward speed (blocks/second)',
  strafe: 'Strafe speed, right positive (blocks/second)',
  pitch: 'Look pitch (degrees)',
  custom: 'Custom (fill in by hand)',
};

const DEFAULT_OPTIONS = {
  target: 'v1_21_1',
  packageRoot: '',
  entityClass: 'ExampleEntity',
  indent: '    ',
};

export function jf(value) {
  const n = Number(value) || 0;
  if (Number.isInteger(n)) return String(n);
  return `${parseFloat(n.toFixed(4))}F`;
}

function jd(value) {
  const n = Number(value) || 0;
  return Number.isInteger(n) ? String(n) : String(parseFloat(n.toFixed(4)));
}

export function js(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

export function constantName(value) {
  const cleaned = String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();
  return /^[0-9]/.test(cleaned) ? `_${cleaned}` : cleaned || 'UNNAMED';
}

const isZero = v => !v || v.every(n => !Number(n));
const vecArgs = v => v.map(jf).join(', ');

function packageRoot(target, override) {
  return (override || '').trim() || TARGETS[normalizeTarget(target)].root;
}

const isMojmap = target => TARGETS[normalizeTarget(target)].mojmap;

function importsBlock(target, names, override) {
  const root = packageRoot(target, override);
  const paths = {
    AzHitboxSet: `${root}.hitbox.AzHitboxSet`,
    AzHitboxHolder: `${root}.hitbox.AzHitboxHolder`,
    AzBoneSocket: `${root}.socket.AzBoneSocket`,
    AzAttachment: `${root}.socket.AzAttachment`,
    AzAttachmentLayer: `${root}.socket.AzAttachmentLayer`,
    AzPoseModifierRegistry: `${root}.animation.pose.AzPoseModifierRegistry`,
    AzBoneConstraint: `${root}.animation.pose.AzBoneConstraint`,
    AzBoneConstraints: `${root}.animation.pose.AzBoneConstraints`,
    AzIkChain: `${root}.animation.pose.ik.AzIkChain`,
    AzIkSolvers: `${root}.animation.pose.ik.AzIkSolvers`,
    AzIkTargets: `${root}.animation.pose.ik.AzIkTargets`,
    AzLookAt: `${root}.animation.pose.ik.AzLookAt`,
    AzSpringBone: `${root}.animation.pose.secondary.AzSpringBone`,
    AzSpringCollider: `${root}.animation.pose.secondary.AzSpringCollider`,
    AzBlendSpace1D: `${root}.animation.blend.AzBlendSpace1D`,
    AzBlendSpace2D: `${root}.animation.blend.AzBlendSpace2D`,
    AzAnimationControllerContainer: `${root}.animation.controller.AzAnimationControllerContainer`,
    Mth: isMojmap(target) ? 'net.minecraft.util.Mth' : `${root}.util.math.Mth`,
    Mc: `${root}.platform.mc.Mc`,
    UUID: 'java.util.UUID',
  };
  return [...new Set(names)]
    .filter(n => paths[n])
    .map(n => `import ${paths[n]};`)
    .sort()
    .join('\n');
}

function section(title, imports, body) {
  return { title, imports, body: body.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n' };
}

function hitboxCall(h, ind) {
  const options = [];

  if (h.role === 'INTERACT') options.push('.interact()');
  if (h.role === 'ANCHOR') options.push('.anchor()');
  if (!h.fit) {
    const [x, y, z] = h.size;
    options.push(x === y && y === z ? `.size(${jf(x)})` : `.size(${vecArgs(h.size)})`);
  }
  if (!isZero(h.offset)) options.push(`.offset(${vecArgs(h.offset)})`);
  if (Number(h.inflate)) options.push(`.inflate(${jf(h.inflate)})`);
  if (h.anchorAtPivot) options.push('.anchorAtPivot()');
  if (Number(h.damageMultiplier) !== 1 && h.role === 'COMBAT') options.push(`.damageMultiplier(${jf(h.damageMultiplier)})`);
  for (const tag of h.tags || []) options.push(`.tag(${js(tag)})`);

  const sameName = h.name === h.bone;

  if (!options.length) {
    return sameName ? `${ind}.add(${js(h.bone)})` : `${ind}.add(${js(h.name)}, ${js(h.bone)}, h -> h)`;
  }

  const lambda = `h -> h${options.join('')}`;
  return sameName ? `${ind}.add(${js(h.bone)}, ${lambda})` : `${ind}.add(${js(h.name)}, ${js(h.bone)}, ${lambda})`;
}

function socketExpression(s) {
  const parts = [s.locator ? `AzBoneSocket.locator(${js(s.locator)})` : `AzBoneSocket.bone(${js(s.name)}, ${js(s.bone)})`];
  if (!isZero(s.offset)) parts.push(`.offset(${vecArgs(s.offset)})`);
  if (!isZero(s.rotation)) parts.push(`.rotation(${vecArgs(s.rotation)})`);
  if (s.serverHitbox) parts.push(`.serverHitbox(${js(s.serverHitbox)})`);
  parts.push('.build()');
  return parts.join('');
}

function socketName(s) {
  return s.locator || s.name;
}

export function generateEntitySection(rig, options = {}) {
  const o = { ...DEFAULT_OPTIONS, ...options };
  const ind = o.indent;
  const lines = [];
  const imports = [];

  if (rig.sockets.length) {
    imports.push('AzBoneSocket');
    lines.push(`${ind}// Bone sockets: find them with AzBoneSockets.resolve(this, SOCKET, partialTick, transform).`);
    for (const s of rig.sockets) {
      lines.push(`${ind}public static final AzBoneSocket ${constantName(socketName(s))} = ${socketExpression(s)};`);
    }
    lines.push('');
  }

  const anchorSockets = rig.sockets.filter(s => s.serverHitbox && !s.locator
    && !rig.hitboxes.some(h => h.name === s.serverHitbox));

  if (rig.hitboxes.length || anchorSockets.length) {
    imports.push('AzHitboxSet', 'AzHitboxHolder');
    lines.push(`${ind}private static final AzHitboxSet HITBOXES = AzHitboxSet.builder()`);
    for (const h of rig.hitboxes) lines.push(hitboxCall(h, `${ind}${ind}`));
    for (const s of anchorSockets) {
      lines.push(`${ind}${ind}.add(${constantName(socketName(s))}.toAnchorHitbox()) // Server-side position for the ${js(socketName(s))} socket.`);
    }
    if (rig.hitboxOptions.keepEntityBox) lines.push(`${ind}${ind}.keepEntityBox(true)`);
    if (rig.hitboxOptions.clientOnly) lines.push(`${ind}${ind}.clientOnly()`);
    lines.push(`${ind}${ind}.build();`);
    lines.push('');
    lines.push(`${ind}// ${o.entityClass} implements AzHitboxHolder`);
    lines.push(`${ind}@Override`);
    lines.push(`${ind}public AzHitboxSet getHitboxSet() {`);
    lines.push(`${ind}${ind}return HITBOXES;`);
    lines.push(`${ind}}`);
  }

  for (const s of rig.sockets.filter(s => s.serverHitbox && s.locator)) {
    lines.push('');
    lines.push(`${ind}// TODO: socket ${js(socketName(s))} follows a locator, so add its anchor hitbox ${js(s.serverHitbox)} yourself:`);
    lines.push(`${ind}//   AzHitbox.builder(${js(s.serverHitbox)}, "<locator's bone>").anchor().anchorAtPivot().offset(<locator offset>).size(1).build()`);
  }

  if (!lines.length) return null;
  return section(`${o.entityClass} (entity)`, importsBlock(o.target, imports, o.packageRoot), lines.join('\n'));
}

function constraintExpression(c) {
  switch (c.type) {
    case 'hinge_x': return `AzBoneConstraints.hingeX(${js(c.bone)}, ${jf(c.min[0])}, ${jf(c.max[0])})`;
    case 'hinge_y': return `AzBoneConstraints.hingeY(${js(c.bone)}, ${jf(c.min[1])}, ${jf(c.max[1])})`;
    case 'hinge_z': return `AzBoneConstraints.hingeZ(${js(c.bone)}, ${jf(c.min[2])}, ${jf(c.max[2])})`;
    default:
      return `AzBoneConstraints.limit(${js(c.bone)}, ${jf(c.min[0])}, ${jf(c.max[0])}, ${jf(c.min[1])}, ${jf(c.max[1])}, ${jf(c.min[2])}, ${jf(c.max[2])})`;
  }
}

function constraintField(c) {
  return `${constantName(c.bone)}_LIMIT`;
}

function colliderField(c) {
  return `${constantName(c.id)}_COLLIDER`;
}

function colliderExpression(c) {
  if (c.shape === 'capsule') {
    return `AzSpringCollider.capsule(${js(c.bone)}, ${vecArgs(c.start)}, ${vecArgs(c.end)}, ${jf(c.radius)})`;
  }
  return `AzSpringCollider.sphere(${js(c.bone)}, ${vecArgs(c.start)}, ${jf(c.radius)})`;
}

function ikTargetExpression(t, entityClass) {
  switch (t.type) {
    case 'ground': return `AzIkTargets.ground(${jf(t.stepUp)}, ${jf(t.stepDown)})`;
    case 'entity_eyes': return `AzIkTargets.entityEyes(entity -> null /* TODO: return the (synced) entity to look at */)`;
    case 'world': return `AzIkTargets.world((entity, partialTick) -> null /* TODO: return the world position */)`;
    case 'model': return `AzIkTargets.<${entityClass}>model(${vecArgs(t.point)})`;
    default: return 'null /* TODO: target */';
  }
}

function resolvedSolver(chain) {
  if (chain.solver !== 'auto') return chain.solver;
  return chain.bones.length === 2 || chain.bones.length === 3 ? 'two_bone' : 'ccd';
}

function modifierTail(entry, defaultPriority = 0) {
  const tail = [];
  if (Number(entry.priority) !== defaultPriority) tail.push(`.priority(${Math.round(Number(entry.priority) || 0)})`);
  if (entry.weight !== undefined && Number(entry.weight) !== 1) tail.push(`.defaultWeight(${jd(entry.weight)})`);
  return tail.join('');
}

export function generatePoseModifierSection(rig, options = {}) {
  const o = { ...DEFAULT_OPTIONS, ...options };
  const ind = o.indent;
  const E = o.entityClass;
  const imports = new Set();
  const fields = [];
  const body = [];

  const constraintsByBone = new Map(rig.constraints.map(c => [c.bone, c]));
  const collidersById = new Map((rig.colliders || []).map(c => [c.id, c]));
  const usedColliders = new Set();
  const usedConstraints = new Set();
  const constraintRefs = bones => bones
    .filter(b => constraintsByBone.has(b))
    .map(b => {
      usedConstraints.add(b);
      return constraintField(constraintsByBone.get(b));
    });

  for (const c of rig.ikChains) {
    imports.add('AzIkChain').add('AzIkTargets');
    const lines = [`modifiers.add(${js(c.id)}, AzIkChain.<${E}>builder(${c.bones.map(js).join(', ')})`];
    if (!isZero(c.effector)) lines.push(`.effector(${vecArgs(c.effector)})`);

    const solver = resolvedSolver(c);
    if (solver === 'two_bone' && (c.solver !== 'auto' || c.pole)) {
      imports.add('AzIkSolvers');
      lines.push(`.solver(AzIkSolvers.twoBone()${c.pole ? `.pole(${vecArgs(c.pole)})` : ''})`);
    } else if (solver === 'ccd' && (c.solver !== 'auto' || c.iterations !== 10 || Number(c.tolerance) !== 0.1)) {
      imports.add('AzIkSolvers');
      lines.push(`.solver(AzIkSolvers.ccd(${Math.max(1, Math.round(c.iterations))}, ${jf(c.tolerance)}))`);
    }

    lines.push(`.target(${ikTargetExpression(c.target, E)})`);
    const refs = constraintRefs(c.bones);
    if (refs.length) lines.push(`.constraint(${refs.join(', ')})`);
    lines.push(`.build())${modifierTail(c)};`);
    body.push(lines.join(`\n${ind}${ind}${ind}`));
  }

  for (const l of rig.lookAts) {
    imports.add('AzLookAt').add('AzIkTargets');
    const lines = [`modifiers.add(${js(l.id)}, AzLookAt.<${E}>builder(${l.bones.map(js).join(', ')})`];
    const [fx, fy, fz] = l.forward;
    if (fx !== 0 || fy !== 0 || fz !== -1) lines.push(`.forward(${vecArgs(l.forward)})`);
    lines.push(`.target(${ikTargetExpression(l.target, E)})`);
    const refs = constraintRefs(l.bones);
    if (refs.length) lines.push(`.constraint(${refs.join(', ')})`);
    lines.push(`.build())${modifierTail(l)};`);
    body.push(lines.join(`\n${ind}${ind}${ind}`));
  }

  for (const s of rig.springBones) {
    imports.add('AzSpringBone');
    const lines = [`modifiers.add(${js(s.id)}, AzSpringBone.<${E}>chain(${s.bones.map(js).join(', ')})`];
    if (s.tip) lines.push(`.tip(${vecArgs(s.tip)})`);
    lines.push(`.stiffness(${jf(s.stiffness)})`);
    lines.push(`.damping(${jf(s.damping)})`);
    if (Number(s.gravity)) lines.push(`.gravity(${jf(s.gravity)})`);
    if (Number(s.inertia) !== 1) lines.push(`.inertia(${jf(s.inertia)})`);
    const refs = constraintRefs(s.bones);
    if (refs.length) lines.push(`.constraint(${refs.join(', ')})`);
    const colliders = (s.colliders || []).map(id => collidersById.get(id)).filter(Boolean);
    if (colliders.length) {
      colliders.forEach(c => usedColliders.add(c.id));
      lines.push(`.collider(${colliders.map(colliderField).join(', ')})`);
    }
    if (Number(s.radius) > 0) lines.push(`.radius(${jf(s.radius)})`);
    if (s.ground) lines.push('.ground(true)');
    lines.push(`.build())${modifierTail(s)};`);
    body.push(lines.join(`\n${ind}${ind}${ind}`));
  }

  const standalone = rig.constraints.filter(c => c.standalone);
  if (standalone.length) {
    standalone.forEach(c => usedConstraints.add(c.bone));
    body.push(`// Clamp the final pose (after animation and every other modifier).\n${ind}${ind}modifiers.add("bone_limits", AzBoneConstraints.modifier(${standalone.map(constraintField).join(', ')})).priority(1000);`);
  }

  for (const c of rig.constraints) {
    if (!usedConstraints.has(c.bone)) continue;
    imports.add('AzBoneConstraint').add('AzBoneConstraints');
    fields.push(`${ind}private static final AzBoneConstraint ${constraintField(c)} = ${constraintExpression(c)};`);
  }

  for (const c of rig.colliders || []) {
    if (!usedColliders.has(c.id)) continue;
    imports.add('AzSpringCollider');
    fields.push(`${ind}private static final AzSpringCollider ${colliderField(c)} = ${colliderExpression(c)};`);
  }

  if (!body.length) return null;
  imports.add('AzPoseModifierRegistry');

  const text = [
    ...fields,
    fields.length ? '' : null,
    `${ind}@Override`,
    `${ind}protected void registerPoseModifiers(AzPoseModifierRegistry<${E}> modifiers) {`,
    body.map(b => `${ind}${ind}${b}`).join('\n\n'),
    `${ind}}`,
  ].filter(l => l !== null).join('\n');

  return section(`${E}Animator: pose modifiers`, importsBlock(o.target, [...imports], o.packageRoot), text);
}

function blendInputExpression(kind, target, used) {
  const modern = isMojmap(target);
  switch (kind) {
    case 'speed':
      if (modern) return 'entity.getDeltaMovement().horizontalDistance() * 20';
      if (target === 'beta') return 'Math.sqrt(Mc.velocityX(entity) * Mc.velocityX(entity) + Mc.velocityZ(entity) * Mc.velocityZ(entity)) * 20';
      return 'Math.sqrt(entity.motionX * entity.motionX + entity.motionZ * entity.motionZ) * 20';
    case 'forward':
      used.add('forward');
      return 'entity.getForwardSpeed()';
    case 'strafe':
      used.add('strafe');
      return 'entity.getStrafeSpeed()';
    case 'pitch':
      if (modern) return 'entity.getViewXRot(partialTick)';
      if (target === 'beta') return 'Mth.lerp(partialTick, Mc.prevPitch(entity), Mc.pitch(entity))';
      return 'Mth.lerp(partialTick, entity.prevRotationPitch, entity.rotationPitch)';
    default:
      return '0 /* TODO: input */';
  }
}

function speedHelpers(target, used, ind) {
  if (!used.size) return '';
  const modern = isMojmap(target);
  const yaw = modern ? 'yBodyRot' : target === 'beta' ? 'Mc.bodyYaw(this)' : 'renderYawOffset';
  const mx = modern ? 'getDeltaMovement().x' : target === 'beta' ? 'Mc.velocityX(this)' : 'motionX';
  const mz = modern ? 'getDeltaMovement().z' : target === 'beta' ? 'Mc.velocityZ(this)' : 'motionZ';
  const out = [`${ind}// Add to your entity class; used by the blend space inputs.`];
  if (used.has('forward')) {
    out.push(`${ind}public double getForwardSpeed() {`);
    out.push(`${ind}${ind}double yaw = Math.toRadians(${yaw});`);
    out.push(`${ind}${ind}return (-Math.sin(yaw) * ${mx} + Math.cos(yaw) * ${mz}) * 20;`);
    out.push(`${ind}}`);
  }
  if (used.has('strafe')) {
    out.push(`${ind}public double getStrafeSpeed() {`);
    out.push(`${ind}${ind}double yaw = Math.toRadians(${yaw});`);
    out.push(`${ind}${ind}return -(Math.cos(yaw) * ${mx} + Math.sin(yaw) * ${mz}) * 20;`);
    out.push(`${ind}}`);
  }
  return out.join('\n');
}

export function generateBlendSpaceSection(rig, options = {}) {
  const o = { ...DEFAULT_OPTIONS, ...options };
  const ind = o.indent;
  const E = o.entityClass;
  if (!rig.blendSpaces.length) return null;

  const imports = new Set(['AzAnimationControllerContainer']);
  const used = new Set();
  const blocks = [];

  for (const b of rig.blendSpaces) {
    const two = b.dimensions === 2;
    imports.add(two ? 'AzBlendSpace2D' : 'AzBlendSpace1D');
    const x = blendInputExpression(b.input.x, o.target, used);
    const lines = [`${two ? 'AzBlendSpace2D' : 'AzBlendSpace1D'}.builder(this, ${js(b.name)})`];

    if (two) {
      const y = blendInputExpression(b.input.y, o.target, used);
      lines.push(`.input((entity, partialTick) -> ${x}, (entity, partialTick) -> ${y})`);
    } else {
      lines.push(`.input((entity, partialTick) -> ${x})`);
    }

    const samples = two ? b.samples : b.samples.slice().sort((a, c) => a.x - c.x);
    for (const s of samples) {
      lines.push(two ? `.sample(${jd(s.x)}, ${jd(s.y)}, ${js(s.animation)})` : `.sample(${jd(s.x)}, ${js(s.animation)})`);
    }
    if (Number(b.smoothing) > 0) lines.push(`.smoothing(${jd(b.smoothing)})`);
    if (b.syncPhase === false) lines.push('.syncPhase(false)');
    lines.push('.build()');
    lines.push('.addTo(container);');
    blocks.push(lines.join(`\n${ind}${ind}${ind}`));

    for (const kind of [b.input.x, two ? b.input.y : null]) {
      if (kind === 'pitch' && !isMojmap(o.target)) imports.add('Mth');
      if ((kind === 'speed' || kind === 'pitch') && o.target === 'beta') imports.add('Mc');
    }
  }
  if (o.target === 'beta' && used.size) imports.add('Mc');

  const text = [
    `${ind}@Override`,
    `${ind}public void registerControllers(AzAnimationControllerContainer<${E}> container) {`,
    `${ind}${ind}// Blend spaces are layered like controllers: add those that go on top after them.`,
    blocks.map(b => `${ind}${ind}${b}`).join('\n\n'),
    `${ind}}`,
  ].join('\n');

  const helpers = speedHelpers(o.target, used, ind);
  return section(`${E}Animator: blend spaces`, importsBlock(o.target, [...imports], o.packageRoot), helpers ? `${text}\n\n${helpers}` : text);
}

export function generateAttachmentSection(rig, options = {}) {
  const o = { ...DEFAULT_OPTIONS, ...options };
  const ind = o.indent;
  const E = o.entityClass;
  if (!rig.sockets.length) return null;

  const lines = [
    `${ind}// In your renderer config builder:`,
    `${ind}.addRenderLayer(`,
    `${ind}${ind}new AzAttachmentLayer<UUID, ${E}>()`,
  ];
  for (const s of rig.sockets) {
    lines.push(`${ind}${ind}${ind}.attach(${E}.${constantName(socketName(s))}, (context, bone) -> {`);
    lines.push(`${ind}${ind}${ind}${ind}// TODO: draw at the ${js(socketName(s))} socket, or use AzAttachment.item(...) / AzAttachment.block(...)`);
    lines.push(`${ind}${ind}${ind}})`);
  }
  lines.push(`${ind})`);

  return section(`${E}Renderer: attachments`, importsBlock(o.target, ['AzAttachmentLayer', 'AzAttachment', 'UUID'], o.packageRoot), lines.join('\n'));
}

export function generateAll(rig, options = {}) {
  options = { ...options, target: normalizeTarget(options.target) };
  return [
    generateEntitySection(rig, options),
    generatePoseModifierSection(rig, options),
    generateBlendSpaceSection(rig, options),
    generateAttachmentSection(rig, options),
  ].filter(Boolean);
}

export function generateText(rig, options = {}) {
  const o = { ...DEFAULT_OPTIONS, ...options, target: normalizeTarget(options.target) };
  const sections = generateAll(rig, o);
  if (!sections.length) return '// Nothing to generate yet: add hitboxes, sockets, IK, spring bones or blend spaces first.\n';

  return [
    `// Generated by the AzureLib Animator Blockbench plugin for AzureLib ${CODEGEN_TARGETS[o.target]} (${packageRoot(o.target, o.packageRoot)}).`,
    '// Paste each section into the class named in its header.',
    '',
    ...sections.map(s => [
      `// ===== ${s.title} =====`,
      s.imports,
      '',
      s.body,
    ].join('\n')),
  ].join('\n');
}
