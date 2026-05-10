/**
 * AzureLib Animator — Unified Animation Tab
 * ------------------------------------------
 * Replaces the Minecraft Bedrock animation tab with a fully custom
 * AnimationCodec that supports both AzureLib custom easings AND
 * Bedrock catmullrom/lerp_mode keyframes in one unified JSON.
 *
 * Keyframe schema auto-detection:
 *   - AzureLib:  { "vector": [...], "easing": "easeInSine", "easingArgs": [...] }
 *   - Bedrock:   { "post": [...], "lerp_mode": "catmullrom" }
 *   - Both can coexist in the same animation file.
 *
 * Built on Blockbench's AnimationCodec API — no monkey-patching of
 * Animator.buildFile / Animator.loadFile, no hiding of built-in menu items.
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

/**
 * Stores top-level animation include metadata by source file path so we can
 * round-trip the user's custom include system without forcing a dedicated UI.
 *
 * Key: animation file path (or '' for unpathed/ephemeral files)
 * Value: normalised includes array
 */
const animationIncludesByPath = new Map();

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

function normalizeAnimationIncludes(includes) {
  if (!Array.isArray(includes) || !includes.length) return [];

  return includes
    .filter(entry => entry && typeof entry === 'object')
    .map(entry => ({
      file_id: String(entry.file_id || '').trim(),
      animations: Array.isArray(entry.animations)
        ? entry.animations
            .map(name => String(name || '').trim())
            .filter(Boolean)
        : [],
    }))
    .filter(entry => entry.file_id && entry.animations.length);
}

function cloneAnimationIncludes(includes) {
  return normalizeAnimationIncludes(includes).map(entry => ({
    file_id: entry.file_id,
    animations: [...entry.animations],
  }));
}

function getAnimationIncludesForPath(path) {
  return cloneAnimationIncludes(animationIncludesByPath.get(path || '') || []);
}

function setAnimationIncludesForPath(path, includes) {
  const key = path || '';
  const normal = normalizeAnimationIncludes(includes);
  if (normal.length) animationIncludesByPath.set(key, normal);
  else animationIncludesByPath.delete(key);
}

function applyAnimationIncludes(out, includes) {
  const normal = cloneAnimationIncludes(includes);
  if (normal.length) out.includes = normal;
  else delete out.includes;
  return out;
}


function getIncludesTargetPath() {
  const selected = Animation?.selected;
  if (selected) return selected.path || '';

  const uniquePaths = [...new Set(Animation.all.map(anim => anim.path || ''))];
  if (uniquePaths.length === 1) return uniquePaths[0];

  return '';
}

function getAnimationNamesForPath(path) {
  return Animation.all
    .filter(anim => (anim.path || '') === (path || '') && anim.name)
    .map(anim => anim.name)
    .sort((a, b) => a.localeCompare(b));
}

function findDuplicateIncludedAnimationNames(includes) {
  const seen = new Map();
  const duplicates = [];

  includes.forEach((entry, entryIndex) => {
    (entry.animations || []).forEach(name => {
      const key = String(name || '').trim();
      if (!key) return;

      const previous = seen.get(key);
      if (previous !== undefined) {
        duplicates.push({ name: key, firstIndex: previous, secondIndex: entryIndex });
      } else {
        seen.set(key, entryIndex);
      }
    });
  });

  return duplicates;
}

function showAnimationIncludesDialog() {
  const targetPath = getIncludesTargetPath();
  const current = getAnimationIncludesForPath(targetPath);
  const animationNames = getAnimationNamesForPath(targetPath);
  const fileLabel = targetPath || 'Unsaved animation file';

  const dialog = new Dialog({
    id: 'azl_animation_includes_editor',
    title: 'Edit Animation Includes',
    width: 760,
    component: {
      data() {
        return {
          targetPath,
          fileLabel,
          rows: current.length
            ? current.map(entry => ({
                file_id: entry.file_id,
                animations_text: entry.animations.join(', '),
              }))
            : [{ file_id: '', animations_text: '' }],
          animationNames,
          exampleAnimationNames: animationNames.join(', '),
        };
      },
      methods: {
        addRow() {
          this.rows.push({ file_id: '', animations_text: '' });
        },
        removeRow(index) {
          this.rows.splice(index, 1);
          if (!this.rows.length) this.addRow();
        },
      },
      template: `
        <div class="dialog_content azure_includes_dialog" style="display:flex;flex-direction:column;gap:12px;min-width:0;">
          <div style="min-width:0;">
            <p style="margin:0;"><strong>Editing file:</strong> <span style="word-break:break-all;">{{ fileLabel }}</span></p>
            <p style="margin:6px 0 0 0;opacity:0.8;">
              These entries are saved at the top level of the animation JSON as <code>includes</code>.
            </p>
            <p v-if="exampleAnimationNames" style="margin:6px 0 0 0;opacity:0.8;line-height:1.45;">
              Animations currently in this file: <code style="white-space:pre-wrap;word-break:break-word;">{{ exampleAnimationNames }}</code>
            </p>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <strong>Include Entries</strong>
            <button
              type="button"
              style="position:static;display:inline-flex;align-items:center;justify-content:center;padding:6px 12px;min-height:32px;white-space:nowrap;"
              @click="addRow()"
            >
              Add Include
            </button>
          </div>
          
          <div style="display:flex;flex-direction:column;gap:12px;max-height:420px;overflow:auto;padding-right:4px;min-width:0;">
            <div
              v-for="(row, index) in rows"
              :key="index"
              style="display:block;padding:12px;border:1px solid rgba(255,255,255,0.08);border-radius:8px;background:rgba(255,255,255,0.03);box-sizing:border-box;min-width:0;"
            >
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px;">
                <div style="font-weight:600;opacity:0.95;">Include {{ index + 1 }}</div>
                <button
                  type="button"
                  style="position:static;display:inline-flex;align-items:center;justify-content:center;padding:4px 10px;min-height:28px;white-space:nowrap;"
                  @click="removeRow(index)"
                >
                  Remove
                </button>
              </div>
          
              <div style="display:flex;flex-direction:column;gap:10px;min-width:0;">
                <label style="display:flex;flex-direction:column;gap:4px;width:100%;min-width:0;">
                  <span>File ID</span>
                  <input
                    type="text"
                    class="dark_bordered"
                    style="display:block;width:100%;min-width:0;max-width:100%;box-sizing:border-box;"
                    v-model="row.file_id"
                    placeholder="mod_id:path/to/other_animation.json"
                  />
                </label>
          
                <label style="display:flex;flex-direction:column;gap:4px;width:100%;min-width:0;">
                  <span>Animations (comma-separated)</span>
                  <textarea
                    class="dark_bordered"
                    rows="3"
                    style="display:block;width:100%;min-width:0;max-width:100%;resize:vertical;box-sizing:border-box;line-height:1.4;"
                    v-model="row.animations_text"
                    placeholder="animation_name_1, animation_name_2"
                  ></textarea>
                </label>
              </div>
            </div>
          </div>
        </div>
      `,
    },
    onConfirm() {
      const rows = dialog.content_vue?.rows || [];
      const normalized = normalizeAnimationIncludes(rows.map(row => ({
        file_id: row.file_id,
        animations: String(row.animations_text || '')
          .split(',')
          .map(name => name.trim())
          .filter(Boolean),
      })));

      const duplicates = findDuplicateIncludedAnimationNames(normalized);
      if (duplicates.length) {
        const preview = duplicates
          .slice(0, 6)
          .map(dup => `${dup.name} (entries ${dup.firstIndex + 1} and ${dup.secondIndex + 1})`)
          .join('\n');
      
        if (typeof Blockbench.showMessageBox === 'function') {
          Blockbench.showMessageBox({
            title: 'Duplicate Included Animations',
            message:
              'Each included animation name must be unique across all include entries.\n\n' +
              preview +
              (duplicates.length > 6 ? `\n…and ${duplicates.length - 6} more.` : ''),
          });
        } else {
          Blockbench.showQuickMessage('Duplicate included animation names detected.', 2400);
        }
      
        return false;
      }

      setAnimationIncludesForPath(targetPath, normalized);
      Blockbench.showQuickMessage(
        normalized.length
          ? `Saved ${normalized.length} animation include${normalized.length === 1 ? '' : 's'}.`
          : 'Cleared animation includes.',
        2000
      );
    },
  });

  dialog.show();
}

// ---------------------------------------------------------------------------
// Animation file builder (export)
// ---------------------------------------------------------------------------

/**
 * Serialise all open Animation objects into the unified AzureLib JSON structure.
 * Kept as a convenience for callers that want everything in the project.
 * The codec itself uses compileFile(animations) so it can scope by file path.
 */
export function buildAzureAnimationFile() {
  const out = applyAnimationIncludes({
    format_version: FORMAT_VERSION,
    animations: {},
  }, getAnimationIncludesForPath(''));

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
    const out = { pre: preVec, post: vec };
    if (kf.easing && kf.easing !== EASING_DEFAULT) out.easing = kf.easing;
    if (hasArgs(kf.easing) && Array.isArray(kf.easingArgs) && kf.easingArgs.length) {
      out.easingArgs = [...kf.easingArgs];
    }
    return out;
  }

  // --- AzureLib easing node (no Bedrock interpolation set) ---
  // Timed keyframes always use { "vector": [...] } form — never bare arrays.
  // Easing is only written when it differs from the default ('linear').
  // Easing is suppressed for Molang expression vectors (easing is meaningless there).
  const easing = kf.easing;
  const vecHasMolang = vec.some(v => typeof v === 'string' && isNaN(Number(v)));
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

  setAnimationIncludesForPath(file?.path, json.includes);

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
    saved_name: name,
    loop: src.loop === true ? 'loop' : src.loop === 'hold_on_last_frame' ? 'hold' : src.loop || 'once',
    override: !!src.override_previous_animation,
    anim_time_update: typeof src.anim_time_update === 'string'
      ? src.anim_time_update.replace(/;(?!$)/, ';\n')
      : src.anim_time_update || '',
    blend_weight: typeof src.blend_weight === 'string'
      ? src.blend_weight.replace(/;(?!$)/, ';\n')
      : src.blend_weight || '',
    length: Number(src.animation_length || 0),
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

function toNum(v) {
  if (typeof v !== 'string') return v;
  const n = Number(v);
  return isNaN(n) ? v : n;  // Molang → keep string; numeric string → number
}

function coerceVec(vec) {
  return vec.map(toNum);
}

function parseKeyframeData(data, channel, time) {
  // --- 1. Plain array ---
  if (Array.isArray(data)) {
    const vec = applyFlipOnLoad(coerceVec(data), channel);
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
    const vec = applyFlipOnLoad(coerceVec(rawVec), channel);
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
      const pre = applyFlipOnLoad(coerceVec(preRaw), channel);
      data_points.push({ x: pre[0], y: pre[1], z: pre[2] });
    }

    const postVec = postRaw ? applyFlipOnLoad(coerceVec(postRaw), channel) : [0, 0, 0];
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
  const x = toNum(data.x ?? 0);
  const y = toNum(data.y ?? 0);
  const z = toNum(data.z ?? 0);
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
// Pretty-printer (kept from the original — formats arrays inline)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// AnimationCodec — the public-facing format integration
// ---------------------------------------------------------------------------

/**
 * Filesystem helpers — only used in the desktop app. Guarded so the codec
 * still works in the web build (where save/reload-by-path are no-ops).
 */
const _fs = (typeof require === 'function' && typeof isApp !== 'undefined' && isApp)
  ? require('fs')
  : null;

/**
 * Try to recover a previously written file's JSON (for in-place merges).
 * Returns null if the file is missing or unparseable, never throws.
 */
function _readExistingAnimationFile(path) {
  if (!_fs || !path) return null;
  try {
    if (!_fs.existsSync(path)) return null;
    const raw = _fs.readFileSync(path, 'utf-8');
    const parsed = typeof autoParseJSON === 'function'
      ? autoParseJSON(raw, false)
      : JSON.parse(raw);
    return (parsed && typeof parsed.animations === 'object') ? parsed : null;
  } catch (_) {
    return null;
  }
}

/**
 * Lazily-created codec instance.
 *
 * IMPORTANT:
 * Do not construct AnimationCodec at module load, because the blockbench-plugins
 * validator evaluates the bundle in a VM before the full app/runtime exists.
 */
export let azureAnimationCodec = null;

export function createAzureAnimationCodec() {
  if (azureAnimationCodec) return azureAnimationCodec;

  if (typeof AnimationCodec === 'undefined') {
    console.warn('[AzureLib] AnimationCodec API is unavailable in this Blockbench version.');
    return null;
  }

  azureAnimationCodec = new AnimationCodec(AZURE_ANIM_FORMAT_ID, {
    multiple_per_file: true,

    // ---- Import side ---------------------------------------------------

    pickFile() {
      Blockbench.import({
        resource_id: 'azure_animation',
        type: 'AzureLib Animation',
        extensions: ['json'],
        readtype: 'text',
        multiple: true,
      }, async (files) => {
        if (!files || !files.length) return;
        for (const file of files) {
          await this.importFile(file);
        }
      });
    },

    importFile(file, auto_loaded) {
      let parsed;
      try {
        parsed = typeof autoParseJSON === 'function'
          ? autoParseJSON(file.content, false)
          : JSON.parse(file.content);
      } catch (error) {
        console.error('[AzureLib] Failed to parse animation file:', error);
        Blockbench.showQuickMessage('[AzureLib] Failed to parse animation file.');
        return [];
      }

      file.json = parsed;
      return this.loadFile(file, null, auto_loaded);
    },

    loadFile(file, animation_filter, auto_loaded) {
      const json = file?.json || (
        typeof autoParseJSON === 'function'
          ? autoParseJSON(file.content, false)
          : JSON.parse(file.content)
      );

      if (!json || typeof json.animations !== 'object') {
        Blockbench.showQuickMessage('[AzureLib] No animations found in file.');
        return [];
      }

      const path = file.path || '';
      setAnimationIncludesForPath(path, json.includes || []);

      const created = [];

      for (const [name, animData] of Object.entries(json.animations)) {
        if (Array.isArray(animation_filter) && animation_filter.length && !animation_filter.includes(name)) {
          continue;
        }

        // Delegate to parseAnimation which correctly handles bone UUID assignment,
        // channel parsing (including numeric coercion and flip-on-load), and effects.
        const anim = parseAnimation(name, animData, path);
        anim.saved = true;
        created.push(anim);
      }

      if (!auto_loaded && created.length) {
        Animation.selected = created[0];
      }

      return created;
    },

    // ---- Export side ---------------------------------------------------

    compileFile(animations = Animation.all) {
      const scoped = Array.isArray(animations) ? animations : Animation.all;
      const path = scoped.length ? (scoped[0].path || '') : '';
      const out = applyAnimationIncludes({
        format_version: FORMAT_VERSION,
        animations: {},
      }, getAnimationIncludesForPath(path));

      for (const anim of scoped) {
        if (!anim?.name) continue;
        out.animations[anim.name] = serializeAnimation(anim);
      }

      return out;
    },

    write(content, path) {
      return serializeAnimationJson(content);
    },

    /**
     * Save a single animation back into its source file while preserving
     * sibling animations and includes.
     */
    saveAnimation(animation, save_as) {
      const compileSingleFile = () => applyAnimationIncludes({
        format_version: FORMAT_VERSION,
        animations: {
          [animation.name]: serializeAnimation(animation),
        },
      }, getAnimationIncludesForPath(animation.path));

      if (!isApp || !animation.path || save_as) {
        Blockbench.export({
          resource_id: 'azure_animation',
          type: 'AzureLib Animation',
          extensions: ['json'],
          name: (Project?.geometry_name || Project?.name || 'animation') + '.animation',
          startpath: animation.path,
          content: serializeAnimationJson(compileSingleFile()),
        }, (real_path) => {
          const previousPath = animation.path || '';
          const includes = getAnimationIncludesForPath(previousPath);
          setAnimationIncludesForPath(real_path, includes);

          if (real_path !== previousPath && previousPath) {
            animationIncludesByPath.delete(previousPath);
          }

          animation.path = real_path;
          animation.saved = true;
          animation.saved_name = animation.name;
        });
        return;
      }

      let content = compileSingleFile();
      const existing = _readExistingAnimationFile(animation.path);

      if (existing) {
        const fresh = content.animations[animation.name];
        content = existing;

        if (animation.saved_name && animation.saved_name !== animation.name) {
          delete content.animations[animation.saved_name];
        }

        content.animations[animation.name] = fresh;
        applyAnimationIncludes(content, getAnimationIncludesForPath(animation.path));

        const fileKeys = Object.keys(content.animations);
        const projectKeys = Animation.all
          .filter(a => a.path === animation.path)
          .map(a => a.name);

        let changed = false;
        let cursor = 0;

        for (const key of projectKeys) {
          const at = fileKeys.indexOf(key);
          if (at === -1) continue;

          if (at < cursor) {
            fileKeys.splice(at, 1);
            fileKeys.splice(cursor, 0, key);
            changed = true;
          } else {
            cursor = at;
          }
        }

        if (changed) {
          const sorted = {};
          fileKeys.forEach(k => {
            sorted[k] = content.animations[k];
          });
          content.animations = sorted;
        }
      }

      Blockbench.writeFile(animation.path, {
        content: serializeAnimationJson(content),
      }, (real_path) => {
        animation.saved = true;
        animation.saved_name = animation.name;
        animation.path = real_path;
      });
    },

    /**
     * Export all animations that share the given path.
     */
    exportFile(path, save_as) {
      const filterPath = path || '';
      const animations = Animation.all.filter(a => (a.path || '') === filterPath);

      if (!save_as && isApp && path && _fs && _fs.existsSync(path)) {
        animations.forEach(a => {
          if (!a.saved) a.save();
        });
        return;
      }

      const content = serializeAnimationJson(this.compileFile(animations));

      Blockbench.export({
        resource_id: 'azure_animation',
        type: 'AzureLib Animation',
        extensions: ['json'],
        name: (Project?.geometry_name || Project?.name || 'animation') + '.animation',
        startpath: path,
        content,
      }, (real_path) => {
        const previousPath = filterPath || '';
        const includes = getAnimationIncludesForPath(previousPath);
        setAnimationIncludesForPath(real_path, includes);

        if (real_path !== previousPath && previousPath) {
          animationIncludesByPath.delete(previousPath);
        }

        animations.forEach(a => {
          a.path = real_path;
          a.saved = true;
          a.saved_name = a.name;
        });
      });
    },

    deleteAnimationFromFile(animation) {
      if (!_fs || !animation.path) return;

      const existing = _readExistingAnimationFile(animation.path);
      if (!existing || !existing.animations?.[animation.name]) return;

      delete existing.animations[animation.name];
      applyAnimationIncludes(existing, getAnimationIncludesForPath(animation.path));

      Blockbench.writeFile(animation.path, {
        content: serializeAnimationJson(existing),
      });
    },
  });

  return azureAnimationCodec;
}

// ---------------------------------------------------------------------------
// Legacy export wrappers — keep external callers working.
// ---------------------------------------------------------------------------

export function exportAzureAnimation() {
  const codec = createAzureAnimationCodec();
  if (!codec?.exportFile) return;

  const anyPath = Animation.all.find(a => a.path)?.path || '';
  codec.exportFile(anyPath, true);
}

export function importAzureAnimation() {
  const codec = createAzureAnimationCodec();
  codec?.pickFile?.();
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

let editAnimationIncludesAction = null;

export function registerAzureAnimationFormat() {
  const codec = createAzureAnimationCodec();
  if (!codec) {
    console.warn(
      '[AzureLib] AnimationCodec API is unavailable in this Blockbench version. ' +
      'Animation import/export will not work. Please update Blockbench.'
    );
    return;
  }

  if (!editAnimationIncludesAction) {
    editAnimationIncludesAction = new Action('azl_edit_animation_includes', {
      name: 'Edit Animation Includes',
      description: 'Edit AzureLib animation include entries for the current animation file',
      icon: 'playlist_add',
      category: 'animation',
      condition: () => Format?.id === 'azure_model' && Animator.open,
      click: () => showAnimationIncludesDialog(),
    });

    try {
      MenuBar.menus?.animation?.addAction(editAnimationIncludesAction);
    } catch (_) {}
  }

  if (!Formats?.azure_animation) {
    Formats.azure_animation = {
      id: AZURE_ANIM_FORMAT_ID,
      name: 'Azure Animation',
      animation_codec: codec,
    };
  }

  console.log('[AzureLib] Azure animation codec registered');
}

export function unregisterAzureAnimationFormat() {
  editAnimationIncludesAction?.delete();
  editAnimationIncludesAction = null;

  try {
    delete Formats?.azure_animation;
  } catch {}

  if (azureAnimationCodec && AnimationCodec?.codecs) {
    delete AnimationCodec.codecs[AZURE_ANIM_FORMAT_ID];
  }

  azureAnimationCodec = null;
  console.log('[AzureLib] Azure animation codec unregistered');
}