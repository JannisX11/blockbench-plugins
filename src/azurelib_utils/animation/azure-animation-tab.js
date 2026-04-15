/**
 * AzureLib Animator — Unified Animation Tab
 * ------------------------------------------
 * Replaces the Minecraft Bedrock animation tab with a fully custom
 * AnimationFormat that supports both AzureLib custom easings AND
 * Bedrock catmullrom/lerp_mode keyframes in one unified JSON.
 *
 * Keyframe schema auto-detection:
 *   - AzureLib:  { "vector": [...], "easing": "easeInSine", "easingArgs": [...] }
 *   - Bedrock:   { "post": [...], "lerp_mode": "catmullrom" }
 *   - Both can coexist in the same animation file.
 *
 * © 2025 AzureDoom — MIT License
 */

import { EASING_TYPES, EASING_DEFAULT, easingRegistry, hasArgs, getEasingArgDefault, parseEasingArg } from './azure-easing.js';
import { invertMolang } from '../core/azure-utils.js';
import { IKManager } from './azure-ik.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const AZURE_ANIM_FORMAT_ID = 'azure_animation';
export const FORMAT_VERSION = '1.8.0';

/** Bedrock lerp modes that this plugin understands natively. */
const BEDROCK_LERP_MODES = new Set(['linear', 'catmullrom']);

/** AzureLib easing names that map 1:1 to Bedrock lerp_mode on export. */
const AZURE_TO_BEDROCK_LERP = {
  linear: 'linear',
  // catmullrom is set via interpolation='catmullrom', not easing field
};

// ---------------------------------------------------------------------------
// Schema detection helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if a keyframe object uses the Bedrock pre/post/lerp_mode schema.
 */
function isBedrockKeyframe(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  return obj.lerp_mode !== undefined || obj.pre !== undefined || obj.post !== undefined;
}

/**
 * Returns true if a keyframe object uses the AzureLib { vector, easing } schema.
 */
function isAzureKeyframe(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  return obj.vector !== undefined || obj.easing !== undefined;
}

/**
 * Unwrap a value to a plain [x, y, z] array, handling all known wrapping forms.
 */
function unwrapToArray(v) {
  if (Array.isArray(v)) return v;
  if (v && typeof v === 'object') {
    if (Array.isArray(v.vector)) return v.vector;
    if (v.vector && typeof v.vector === 'object' && Array.isArray(v.vector.vector)) return v.vector.vector;
  }
  return null;
}

/**
 * Normalise a time key string: "0.0" → "0", "1.000" → "1", "0.5" stays.
 */
function normTime(t) {
  return String(t).replace(/^(-?\d+)\.0+$/, '$1');
}

// ---------------------------------------------------------------------------
// Animation file builder (export)
// ---------------------------------------------------------------------------

/**
 * Serialise all open Animation objects into the unified AzureLib JSON structure.
 * Called by Animator.buildFile when our format is active.
 */
export function buildAzureAnimationFile() {
  const out = {
    format_version: FORMAT_VERSION,
    animations: {},
  };

  for (const anim of Animation.all) {
    if (!anim.name) continue;
    const animOut = serializeAnimation(anim);
    out.animations[anim.name] = animOut;
  }

  return out;
}

function serializeAnimation(anim) {
  const obj = {};

  if (anim.loop === 'loop') obj.loop = true;
  else if (anim.loop === 'hold') obj.loop = 'hold_on_last_frame';
  else if (anim.loop) obj.loop = anim.loop;

  if (anim.override) obj.override_previous_animation = true;
  if (anim.anim_time_update) obj.anim_time_update = anim.anim_time_update.replace(/;\n/g, ';');
  if (anim.blend_weight) obj.blend_weight = anim.blend_weight.replace(/;\n/g, ';');
  if (anim.length) obj.animation_length = Math.round(anim.length * 1e6) / 1e6;

  const bones = {};
  const effects = anim.animators.effects;
  const boneAnimators = Object.values(anim.animators).filter(a => a instanceof BoneAnimator);

  for (const boneAnim of boneAnimators) {
    const boneName = boneAnim.name;
    const boneOut = {};

    for (const channel of ['position', 'rotation', 'scale']) {
      const keyframes = boneAnim.keyframes.filter(kf => kf.channel === channel);
      if (!keyframes.length) continue;

      // Sort by time
      keyframes.sort((a, b) => a.time - b.time);

      if (keyframes.length === 1) {
        // Constant value — AzureLib format: { "vector": [...] }
        // Easing and easingArgs sit alongside vector at the same level (not nested).
        const kf = keyframes[0];
        const vec = extractKeyframeVector(kf, channel, true);
        const node = { vector: vec };
        const easing = kf.easing;
        if (easing && easing !== EASING_DEFAULT) node.easing = easing;
        if (hasArgs(easing) && Array.isArray(kf.easingArgs) && kf.easingArgs.length) {
          node.easingArgs = [...kf.easingArgs];
        }
        boneOut[channel] = node;
      } else {
        const channelOut = {};
        for (const kf of keyframes) {
          const t = normTime(roundTime(kf.time));
          channelOut[t] = serializeKeyframe(kf, channel, keyframes);
        }
        boneOut[channel] = channelOut;
      }
    }

    if (Object.keys(boneOut).length) {
      bones[boneName] = boneOut;
    }
  }

  if (Object.keys(bones).length) obj.bones = bones;

  // Effects (sound/particle/timeline)
  if (effects && Array.isArray(effects.keyframes) && effects.keyframes.length) {
    const sounds = {};
    const particles = {};
    const timeline = {};

    for (const kf of effects.keyframes) {
      const t = normTime(roundTime(kf.time));
      if (kf.channel === 'sound') {
        const pts = (kf.data_points || []).map(p => (typeof p === 'string' ? { effect: p } : { ...p })).filter(p => p.effect);
        if (pts.length === 1) sounds[t] = pts[0];
        else if (pts.length > 1) sounds[t] = pts;
      } else if (kf.channel === 'particle') {
        const pts = (kf.data_points || []).map(p => {
          const o = {};
          if (p.effect) o.effect = p.effect;
          if (p.locator !== undefined) o.locator = p.locator;
          if (p.script !== undefined) o.script = p.script;
          return Object.keys(o).length ? o : null;
        }).filter(Boolean);
        if (pts.length === 1) particles[t] = pts[0];
        else if (pts.length > 1) particles[t] = pts;
      } else if (kf.channel === 'timeline') {
        const script = (kf.data_points?.[0]?.script) || '';
        if (script) timeline[t] = script;
      }
    }

    if (Object.keys(sounds).length) obj.sound_effects = sounds;
    if (Object.keys(particles).length) obj.particle_effects = particles;
    if (Object.keys(timeline).length) obj.timeline = timeline;
  }

  return obj;
}

/**
 * Map Blockbench interpolation mode → Bedrock lerp_mode string.
 * 'linear' in BB is called 'linear' in Bedrock JSON.
 * 'catmullrom' in BB is called 'catmullrom' in Bedrock JSON.
 * 'bezier' uses Blockbench's own pre/post pair format.
 * 'step' uses a pre/post pair where pre = previous value.
 */
const BB_INTERP_TO_LERP_MODE = {
  catmullrom: 'catmullrom',
  // bezier and step are handled structurally (pre/post pairs), not via lerp_mode
};

/**
 * Serialise a single keyframe into its JSON representation.
 *
 * Bedrock interpolation modes (kf.interpolation is set):
 *   'linear'     → { post: [...], lerp_mode: 'linear' }
 *   'catmullrom' → { post: [...], lerp_mode: 'catmullrom' }   (+ pre if available)
 *   'bezier'     → { pre: [...], post: [...] }                 (Blockbench bezier handles pre/post natively)
 *   'step'       → { pre: [...], post: [...] }                 (discrete hold)
 *
 * AzureLib easing mode (kf.interpolation is undefined/null):
 *   With easing   → { vector: [...], easing: "easeInSine", easingArgs?: [...] }
 *   No easing     → [x, y, z]   (plain array shorthand)
 */
function serializeKeyframe(kf, channel, allKeyframes) {
  const vec    = extractKeyframeVector(kf, channel, true);
  const interp = kf.interpolation;

  // --- Bedrock lerp_mode-based keyframes (linear / catmullrom) ---
  if (interp === 'catmullrom') {
    const node = { post: vec, lerp_mode: 'catmullrom' };
    const preVec = extractKeyframePreVector(kf, channel);
    if (preVec) node.pre = preVec;
    return node;
  }

  // --- Bezier keyframes: always have explicit pre/post control points ---
  if (interp === 'bezier') {
    const preVec = extractKeyframePreVector(kf, channel);
    return preVec
      ? { pre: preVec, post: vec }
      : { post: vec };
  }

  // --- Step / discrete hold: emit pre (previous value) + post (this value) ---
  if (interp === 'step') {
    const prevKf = getPreviousKeyframe(kf, allKeyframes);
    const preVec = extractKeyframePreVector(kf, channel)
      || (prevKf ? extractKeyframeVector(prevKf, channel, true) : null);
    return preVec ? { pre: preVec, post: vec } : { post: vec };
  }

  // --- Transition into a step keyframe: emit pre/post pair at this boundary ---
  const prevKf = getPreviousKeyframe(kf, allKeyframes);
  if (prevKf && prevKf.interpolation === 'step') {
    const preVec = extractKeyframePreVector(kf, channel)
      || extractKeyframeVector(prevKf, channel, true);
    return { pre: preVec, post: vec };
  }

  // --- AzureLib easing node (no Bedrock interpolation set) ---
  // Timed keyframes always use { "vector": [...] } form — never bare arrays.
  // Easing is only written when it differs from the default ('linear').
  // Easing is suppressed for Molang expression vectors (easing is meaningless there).
  const easing = kf.easing;
  const vecHasMolang = vec.some(v => typeof v === 'string');
  const writeEasing  = easing && easing !== EASING_DEFAULT && !vecHasMolang;
  const writeArgs    = writeEasing && hasArgs(easing) && Array.isArray(kf.easingArgs) && kf.easingArgs.length;

  const node = { vector: vec };
  if (writeEasing) node.easing = easing;
  if (writeArgs)   node.easingArgs = [...kf.easingArgs];
  return node;
}

/**
 * Invert a single axis value only when needed for BB 5.0+ coordinate fix.
 * Numeric zero stays as numeric 0 (not converted to string "0").
 * Molang strings are inverted via invertMolang.
 * Non-zero numbers are negated directly.
 */
function safeInvert(v) {
  if (typeof v === 'string') return invertMolang(v);
  if (typeof v === 'number') return v === 0 ? 0 : -v;
  return v;
}

function extractKeyframeVector(kf, channel, applyInversion) {
  const dp = kf.data_points?.[kf.data_points.length > 1 ? 1 : 0] || kf.data_points?.[0];
  if (!dp) return [0, 0, 0];

  let x = dp.x ?? 0;
  let y = dp.y ?? 0;
  let z = dp.z ?? 0;

  if (applyInversion && Blockbench.isNewerThan('4.99')) {
    if (channel === 'rotation') { x = safeInvert(x); y = safeInvert(y); }
    else if (channel === 'position') { x = safeInvert(x); }
  }

  return [roundVal(x), roundVal(y), roundVal(z)];
}

function extractKeyframePreVector(kf, channel) {
  if (!kf.data_points || kf.data_points.length < 2) return null;
  const dp = kf.data_points[0];

  let x = dp.x ?? 0;
  let y = dp.y ?? 0;
  let z = dp.z ?? 0;

  if (Blockbench.isNewerThan('4.99')) {
    if (channel === 'rotation') { x = safeInvert(x); y = safeInvert(y); }
    else if (channel === 'position') { x = safeInvert(x); }
  }

  return [roundVal(x), roundVal(y), roundVal(z)];
}

function getPreviousKeyframe(kf, allKeyframes) {
  const idx = allKeyframes.indexOf(kf);
  return idx > 0 ? allKeyframes[idx - 1] : null;
}

function roundTime(t) {
  return Math.round(t * 1e6) / 1e6;
}

function roundVal(v) {
  if (typeof v === 'number') return Math.round(v * 1e5) / 1e5;
  return v;
}

// ---------------------------------------------------------------------------
// Animation file loader (import)
// ---------------------------------------------------------------------------

/**
 * Parse a unified AzureLib/Bedrock animation JSON file and create
 * Animation + BoneAnimator + Keyframe objects in Blockbench.
 */
export function loadAzureAnimationFile(file, filter) {
  const json = file.json || (typeof autoParseJSON === 'function' ? autoParseJSON(file.content) : JSON.parse(file.content));
  if (!json || typeof json.animations !== 'object') return [];

  const animsOut = [];

  for (const name in json.animations) {
    if (filter && !filter.includes(name)) continue;
    const src = json.animations[name];
    const anim = parseAnimation(name, src, file.path);
    animsOut.push(anim);
  }

  return animsOut;
}

function parseAnimation(name, src, filePath) {
  const anim = new Animation({
    name,
    path: filePath,
    loop: src.loop === true ? 'loop' : src.loop === 'hold_on_last_frame' ? 'hold' : src.loop,
    override: src.override_previous_animation,
    anim_time_update: typeof src.anim_time_update === 'string'
      ? src.anim_time_update.replace(/;(?!$)/, ';\n')
      : src.anim_time_update,
    blend_weight: typeof src.blend_weight === 'string'
      ? src.blend_weight.replace(/;(?!$)/, ';\n')
      : src.blend_weight,
    length: src.animation_length,
  }).add();

  // Effects
  if (src.sound_effects || src.particle_effects || src.timeline || src.instructions) {
    const effectsAnim = ensureEffectsAnimator(anim);
    parseEffects(effectsAnim, src);
  }

  // Bones
  if (src.bones) {
    for (const boneName in src.bones) {
      const bone = src.bones[boneName];
      const group = Group.all.find(g => g.name.toLowerCase() === boneName.toLowerCase());
      const uuid = group ? group.uuid : guid();
      const boneAnim = new BoneAnimator(uuid, anim, boneName);
      anim.animators[uuid] = boneAnim;

      for (const channel in bone) {
        if (!Animator.possible_channels[channel]) continue;
        parseChannel(boneAnim, channel, bone[channel]);
      }
    }
  }

  anim.calculateSnappingFromKeyframes?.();
  if (!Animation.selected && Animator.open) anim.select();

  return anim;
}

function parseChannel(boneAnim, channel, channelData) {
  if (!channelData) return;

  const addKf = (time, data) => {
    const parsed = parseKeyframeData(data, channel, time);
    if (!parsed) return;

    boneAnim.addKeyframe({
      time,
      channel,
      easing: parsed.easing,
      easingArgs: parsed.easingArgs,
      interpolation: parsed.interpolation,
      uniform: parsed.uniform,
      data_points: parsed.data_points,
    });
  };

  // Shorthand constant value (array or { vector: [...] })
  if (Array.isArray(channelData) || (channelData.vector !== undefined && Object.keys(channelData).length <= 3)) {
    const vec = unwrapToArray(channelData) || channelData;
    if (Array.isArray(vec)) {
      addKf(0, vec);
      return;
    }
  }

  // Check if the whole channel object is a single keyframe with lerp_mode/pre/post/vector
  if (
    channelData.lerp_mode !== undefined ||
    channelData.pre !== undefined ||
    channelData.post !== undefined ||
    (channelData.vector !== undefined && typeof channelData.vector !== 'object')
  ) {
    addKf(0, channelData);
    return;
  }

  // Normal timed keyframes map: { "0.0": {...}, "0.5": {...}, ... }
  for (const rawT in channelData) {
    const time = parseFloat(rawT);
    const entry = channelData[rawT];
    addKf(time, entry);
  }
}

/**
 * Converts a raw JSON keyframe entry into a normalised data structure
 * that Blockbench's Keyframe system can consume.
 * Handles all three forms:
 *   1. Plain array          [x, y, z]
 *   2. AzureLib node        { vector, easing?, easingArgs? }
 *   3. Bedrock spline node  { post, pre?, lerp_mode }
 */
function parseKeyframeData(data, channel, time) {
  // --- 1. Plain array ---
  if (Array.isArray(data)) {
    const vec = applyFlipOnLoad(data, channel);
    return {
      easing: EASING_DEFAULT,
      easingArgs: undefined,
      interpolation: undefined,
      uniform: false,
      data_points: [{ x: vec[0], y: vec[1], z: vec[2] }],
    };
  }

  if (!data || typeof data !== 'object') return null;

  // --- 2. AzureLib node (has vector or easing) ---
  if (isAzureKeyframe(data) && !isBedrockKeyframe(data)) {
    const rawVec = unwrapToArray(data.vector || data) || [0, 0, 0];
    const vec = applyFlipOnLoad(rawVec, channel);
    return {
      easing: data.easing || EASING_DEFAULT,
      easingArgs: Array.isArray(data.easingArgs) && data.easingArgs.length ? data.easingArgs : undefined,
      interpolation: undefined,
      uniform: false,
      data_points: [{ x: vec[0], y: vec[1], z: vec[2] }],
    };
  }

  // --- 3. Bedrock interpolation node (has lerp_mode, pre, or post) ---
  if (isBedrockKeyframe(data)) {
    // Map JSON lerp_mode strings back to Blockbench interpolation identifiers
    const lerp = data.lerp_mode;
    const interpolation =
      lerp === 'catmullrom' ? 'catmullrom' :
      // lerp_mode:'linear' treated as no special interpolation — AzureLib linear easing handles it
      lerp === 'linear'     ? undefined      :
      // pre/post without lerp_mode is bezier in Blockbench's own format
      (data.pre !== undefined || data.post !== undefined) ? 'bezier' :
      undefined;
    const data_points = [];

    const postRaw = unwrapToArray(data.post);
    const preRaw = unwrapToArray(data.pre);

    if (preRaw) {
      const pre = applyFlipOnLoad(preRaw, channel);
      data_points.push({ x: pre[0], y: pre[1], z: pre[2] });
    }

    const postVec = postRaw ? applyFlipOnLoad(postRaw, channel) : [0, 0, 0];
    data_points.push({ x: postVec[0], y: postVec[1], z: postVec[2] });

    return {
      easing: EASING_DEFAULT,
      easingArgs: undefined,
      interpolation,
      uniform: false,
      data_points: data_points.length ? data_points : [{ x: 0, y: 0, z: 0 }],
    };
  }

  // Fallback — treat as raw vector object
  const x = data.x ?? 0;
  const y = data.y ?? 0;
  const z = data.z ?? 0;
  return {
    easing: EASING_DEFAULT,
    easingArgs: undefined,
    interpolation: undefined,
    uniform: false,
    data_points: [{ x, y, z }],
  };
}

function applyFlipOnLoad(vec, channel) {
  if (!Blockbench.isNewerThan('4.99')) return vec;
  const v = [...vec];
  if (channel === 'rotation') {
    v[0] = invertMolang(v[0]);
    v[1] = invertMolang(v[1]);
  } else if (channel === 'position') {
    v[0] = invertMolang(v[0]);
  }
  return v;
}

function parseEffects(effectsAnim, src) {
  if (src.sound_effects) {
    for (const t in src.sound_effects) {
      let sounds = src.sound_effects[t];
      if (!Array.isArray(sounds)) sounds = [sounds];
      const pts = sounds.filter(Boolean).map(s => (typeof s === 'string' ? { effect: s } : { ...s }));
      effectsAnim.addKeyframe({ channel: 'sound', time: parseFloat(t), data_points: pts });
    }
  }

  if (src.particle_effects) {
    for (const t in src.particle_effects) {
      let particles = src.particle_effects[t];
      if (!Array.isArray(particles)) particles = [particles];
      const pts = particles.filter(Boolean).map(p => {
        const o = { ...p };
        if (o.pre_effect_script && !o.script) o.script = o.pre_effect_script;
        return o;
      });
      effectsAnim.addKeyframe({ channel: 'particle', time: parseFloat(t), data_points: pts });
    }
  }

  const timeline = src.timeline || src.instructions;
  if (timeline) {
    for (const t in timeline) {
      const entry = timeline[t];
      const script = Array.isArray(entry) ? entry.join('\n') : entry;
      effectsAnim.addKeyframe({ channel: 'timeline', time: parseFloat(t), data_points: [{ script }] });
    }
  }
}

function ensureEffectsAnimator(anim) {
  if (!anim.animators.effects) {
    anim.animators.effects = new EffectAnimator(anim);
  }
  return anim.animators.effects;
}

// ---------------------------------------------------------------------------
// Export / Import helpers (called by codec save hooks and menu actions)
// ---------------------------------------------------------------------------

let _exportAction = null;
let _importAction = null;

/**
 * Export all open animations as a unified AzureLib JSON file.
 * Called by the codec when the user saves/exports.
 */
/**
 * JSON serialiser that pretty-prints with tabs but keeps arrays compact on one line.
 * This matches the original Bedrock/AzureLib animation file format exactly.
 */
function serializeAnimationJson(obj) {
  // First pass: standard pretty-print
  const raw = JSON.stringify(obj, null, '\t');
  // Second pass: collapse arrays that contain only numbers/strings onto one line.
  // Matches [ followed by whitespace+values+whitespace ] across newlines.
  return raw.replace(
    /\[\s*([\s\S]*?)\s*\]/g,
    (match, inner) => {
      // Only collapse if every element is a number or a quoted string (no nested objects/arrays)
      const trimmed = inner.trim();
      if (!trimmed) return '[]';
      // Check that the inner content has no { or [ — i.e. it's a flat value array
      if (/[{\[\]]/.test(trimmed)) return match;
      // Collapse: replace all internal whitespace/newlines/tabs between values with ', '
      const items = trimmed.split(/,\s*/).map(s => s.trim());
      return '[' + items.join(', ') + ']';
    }
  );
}

export function exportAzureAnimation() {
  const json = buildAzureAnimationFile();
  const content = serializeAnimationJson(json);
  const defaultPath = Animation.all.find(a => a.path)?.path || '';

  Blockbench.export({
    resource_id: 'azure_animation',
    type: 'AzureLib Animation',
    extensions: ['json'],
    name: (Project?.name || 'animation') + '.animation',
    startpath: defaultPath,
    content,
  }, path => {
    Animation.all.forEach(a => { if (!a.path) a.path = path; });
    Blockbench.showQuickMessage('Animation exported!', 1500);
  });
}

/**
 * Open a file picker and import one or more AzureLib animation JSON files.
 */
export function importAzureAnimation() {
  Blockbench.import({
    resource_id: 'azure_animation',
    type: 'AzureLib Animation',
    extensions: ['json'],
    readtype: 'text',
    multiple: true,
  }, files => {
    if (!files || !files.length) return;
    Undo.initEdit({ animations: [] });
    const added = [];
    for (const f of files) {
      try {
        f.json = typeof autoParseJSON === 'function'
          ? autoParseJSON(f.content)
          : JSON.parse(f.content);
        added.push(...loadAzureAnimationFile(f));
      } catch (e) {
        console.error('[AzureLib] Failed to parse animation file:', f.name, e);
        Blockbench.showQuickMessage(`Failed to load ${f.name}`, 2000);
      }
    }
    Undo.finishEdit('Import AzureLib animations', { animations: added });
  });
}

// ---------------------------------------------------------------------------
// Registration — hooks Animator; adds Export/Import actions to Animation menu
// ---------------------------------------------------------------------------

/**
 * The exact menu label strings Blockbench uses for animation import/export.
 * We match by name at runtime so we don't depend on internal BarItem IDs.
 */
const BUILTIN_ANIM_LABELS = new Set([
  'Import Animations',
  'Export Animations...',
  'Save All Animations',
]);

// Map of label → { item, originalCondition } for patched items
const _patchedBuiltins = new Map();

/**
 * Hide Blockbench's built-in animation Import/Export menu entries when the
 * AzureLib format is active. Matches by display name since internal IDs vary
 * across Blockbench versions.
 */
function _hideBuiltinAnimationActions() {
  for (const [id, item] of Object.entries(BarItems)) {
    if (!item || _patchedBuiltins.has(id)) continue;
    const label = item.name ?? item.label ?? '';
    if (!BUILTIN_ANIM_LABELS.has(label)) continue;

    const orig = item.condition;
    _patchedBuiltins.set(id, { item, orig });
    item.condition = (...args) => {
      if (Format?.id === 'azure_model') return false;
      return typeof orig === 'function' ? orig(...args) : orig ?? true;
    };
  }
}

function _restoreBuiltinAnimationActions() {
  for (const [id, { item, orig }] of _patchedBuiltins) {
    item.condition = orig;
  }
  _patchedBuiltins.clear();
}

export function registerAzureAnimationFormat() {
  // Hook Animator so our serialiser/parser run when azure_model is active
  _hookAnimator();

  // Register FABRIK IK system
  // IKManager.register();

  // Hide the built-in export/import actions for our format
  _hideBuiltinAnimationActions();

  // Import before Export
  _importAction = new Action('azure_import_animation', {
    name: 'Import AzureLib Animation',
    description: 'Load a unified AzureLib + Bedrock animation JSON',
    icon: 'file_download',
    category: 'animation',
    condition: () => Format?.id === 'azure_model' && Animator.open,
    click: importAzureAnimation,
  });

  _exportAction = new Action('azure_export_animation', {
    name: 'Export AzureLib Animation',
    description: 'Save animations as a unified AzureLib + Bedrock JSON',
    icon: 'file_upload',
    category: 'animation',
    condition: () => Format?.id === 'azure_model' && Animator.open,
    click: exportAzureAnimation,
  });

  // Add our actions to the Animation menu (import first, then export)
  try {
    MenuBar.menus?.animation?.addAction?.(_importAction);
    MenuBar.menus?.animation?.addAction?.(_exportAction);
  } catch (_) {}

  console.log('[AzureLib] Azure animation format registered');
}

export function unregisterAzureAnimationFormat() {
  _unhookAnimator();
  _restoreBuiltinAnimationActions();
  // IKManager.unregister();

  try { _exportAction?.delete(); } catch (_) {}
  try { _importAction?.delete(); } catch (_) {}
  _exportAction = null;
  _importAction = null;

  console.log('[AzureLib] Azure animation format unregistered');
}

// ---------------------------------------------------------------------------
// Animator hook (overrides buildFile / loadFile for our format)
// ---------------------------------------------------------------------------

let _origBuildFile = null;
let _origLoadFile = null;
let _hooked = false;

function _hookAnimator() {
  if (_hooked) return;
  _origBuildFile = Animator.buildFile;
  _origLoadFile = Animator.loadFile;

  Animator.buildFile = function (...args) {
    if (Format?.id === 'azure_model') {
      return buildAzureAnimationFile();
    }
    return _origBuildFile.apply(this, args);
  };

  Animator.loadFile = function (file, filter) {
    if (Format?.id === 'azure_model') {
      return loadAzureAnimationFile(file, filter);
    }
    return _origLoadFile.call(this, file, filter);
  };

  _hooked = true;
}

function _unhookAnimator() {
  if (!_hooked) return;
  if (_origBuildFile) Animator.buildFile = _origBuildFile;
  if (_origLoadFile) Animator.loadFile = _origLoadFile;
  _hooked = false;
}
