/**
 * AzureLib Animator — Pose Modifier Weights
 * -----------------------------------------
 * Lets animations drive the per-entity pose layer weights of AzureLib's pose
 * modifiers (IK chains, look-ats, spring bones, bone limits) without Java:
 *
 *   • Per-animation weights: "while this animation plays, fade head_look to 0
 *     over 5 ticks, and fade it back over 5 ticks when it stops".
 *   • Weight tracks: real timeline keyframes (one row per modifier, value in
 *     X, 0 = off, 1 = full) with AzureLib easing, so a tail attack can switch
 *     the tail spring off exactly where the swing starts and back on after.
 *
 * Both are previewed in the viewport (the rig preview multiplies them in) and
 * written to the animation JSON as "pose_weights", which AzureLib turns into
 * poseLayer().setWeight / fadeWeight calls for the entity playing it.
 *
 * JSON (per animation):
 *   "pose_weights": {
 *     "head_look": { "weight": 0, "fade_in": 5, "fade_out": 5 },
 *     "tail": {
 *       "fade_out": 10,
 *       "keyframes": {
 *         "0": 1,
 *         "0.25": { "value": 0, "easing": "easeOutSine" },
 *         "1.1": { "value": 0, "interpolation": "step" },
 *         "1.5": 1
 *       }
 *     }
 *   }
 *
 * Times in "keyframes" are seconds like the rest of the file; fades are ticks
 * like fadeWeight. Defaults: weight 1, fade_in 0, fade_out 0, restore true.
 *
 * © 2026 AzureDoom — MIT License
 */

import { RigStore } from '../rig/azure-rig-state.js';
import { EASING_DEFAULT, easingRegistry, hasArgs, getEasingArgDefault } from './azure-easing.js';

export const POSE_PROP = 'azl_pose_weights';
export const POSE_ANIMATOR_TYPE = 'azl_pose_weight';
export const POSE_CHANNEL = 'azl_weight';

const TICKS_PER_SECOND = 20;
const isAzureFormat = () => typeof Format !== 'undefined' && Format?.id === 'azure_model';
const clamp01 = v => Math.min(1, Math.max(0, v));
const round = (v, p = 1e5) => Math.round(v * p) / p;

export function rigModifierIds(rig = RigStore.rig) {
  const ids = [
    ...rig.ikChains.map(c => c.id),
    ...rig.lookAts.map(l => l.id),
    ...rig.springBones.map(s => s.id),
  ];
  if (rig.constraints.some(c => c.standalone)) ids.push('bone_limits');
  return [...new Set(ids.filter(Boolean))];
}

export function rigDefaultWeight(id, rig = RigStore.rig) {
  const def = [...rig.ikChains, ...rig.lookAts, ...rig.springBones].find(x => x.id === id);
  const w = Number(def?.weight);
  return def && def.weight !== undefined && Number.isFinite(w) ? clamp01(w) : 1;
}

export function newPoseSetting() {
  return { weight: 1, fade_in: 0, fade_out: 0, restore: true };
}

function normalizeSetting(raw) {
  const d = newPoseSetting();
  if (!raw || typeof raw !== 'object') return d;
  const num = (v, fallback) => (Number.isFinite(Number(v)) ? Number(v) : fallback);
  return {
    weight: clamp01(num(raw.weight, d.weight)),
    fade_in: Math.max(0, num(raw.fade_in, d.fade_in)),
    fade_out: Math.max(0, num(raw.fade_out, d.fade_out)),
    restore: raw.restore !== false,
  };
}

export function getPoseSettings(anim) {
  const raw = anim?.[POSE_PROP];
  if (!raw) return {};
  let parsed;
  try {
    parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
  const out = {};
  if (parsed && typeof parsed === 'object') {
    for (const [id, setting] of Object.entries(parsed)) {
      if (id) out[id] = normalizeSetting(setting);
    }
  }
  return out;
}

export function setPoseSettings(anim, settings) {
  const clean = {};
  for (const [id, s] of Object.entries(settings || {})) {
    if (id) clean[id] = normalizeSetting(s);
  }
  anim[POSE_PROP] = Object.keys(clean).length ? JSON.stringify(clean) : '';
}

let PoseWeightAnimatorClass = null;

function definePoseWeightAnimator() {
  if (PoseWeightAnimatorClass) return PoseWeightAnimatorClass;
  if (typeof BoneAnimator === 'undefined') return null;

  class PoseWeightAnimator extends BoneAnimator {
    constructor(uuid, animation, name) {
      super(uuid, animation, name);
      this._name = name;
    }

    get name() { return this._name; }
    set name(value) { this._name = value; }

    getGroup() { return null; }
    getElement() { return null; }

    select() {
      return GeneralAnimator.prototype.select.call(this);
    }

    displayFrame() { /* weights are read by the rig preview, nothing to pose */ }
    doRender() { return false; }

    fillValues(keyframe, values) {
      let value;
      if (Array.isArray(values)) value = values[0];
      else if (typeof values === 'number' || typeof values === 'string') value = values;
      else if (values && typeof values === 'object' && 'x' in values) value = values.x;
      else value = round(sampleTrack(this, Timeline.time || 0) ?? 1, 1e4);

      keyframe.set('x', value);
      keyframe.set('y', 0);
      keyframe.set('z', 0);
    }
  }

  PoseWeightAnimator.prototype.type = POSE_ANIMATOR_TYPE;
  PoseWeightAnimator.prototype.channels = {
    [POSE_CHANNEL]: { name: 'Weight (X)', mutable: false, transform: true, max_data_points: 1 },
  };

  if (typeof Menu !== 'undefined') {
    PoseWeightAnimator.prototype.menu = new Menu([
      {
        name: 'Remove Weight Track',
        icon: 'delete',
        click(animator) {
          const anim = animator?.animation;
          if (!anim) return;
          Undo.initEdit({ animations: [anim] });
          removeTrack(anim, animator._name);
          anim.saved = false;
          Undo.finishEdit('Remove pose weight track');
          Animator.preview();
        },
      },
    ]);
  }

  PoseWeightAnimatorClass = PoseWeightAnimator;
  return PoseWeightAnimatorClass;
}

export function isPoseWeightAnimator(animator) {
  return !!animator && animator.type === POSE_ANIMATOR_TYPE;
}

export function getTracks(anim) {
  const out = {};
  for (const animator of Object.values(anim?.animators || {})) {
    if (isPoseWeightAnimator(animator)) out[animator._name] = animator;
  }
  return out;
}

export function getTrack(anim, id) {
  return getTracks(anim)[id] || null;
}

export function createTrack(anim, id, uuid = guid()) {
  const Cls = definePoseWeightAnimator();
  if (!Cls || !anim || !id) return null;
  const existing = getTrack(anim, id);
  if (existing) return existing;
  const animator = new Cls(uuid, anim, id);
  anim.animators = anim.animators || {};
  anim.animators[uuid] = animator;
  return animator;
}

export function removeTrack(anim, id) {
  const animator = getTrack(anim, id);
  if (!animator) return;
  for (const kf of animator.keyframes.slice()) {
    try { kf.remove(); } catch { /* already gone */ }
  }
  delete anim.animators[animator.uuid];
  removeFromTimeline(animator);
}

function removeFromTimeline(animator) {
  if (typeof Timeline === 'undefined' || !Array.isArray(Timeline.animators)) return;
  const i = Timeline.animators.indexOf(animator);
  if (i !== -1) Timeline.animators.splice(i, 1);
  if (Timeline.selected_animator === animator) Timeline.selected_animator = null;
}

export function addWeightKeyframe(animator, time, value, extra = {}) {
  return animator.addKeyframe({
    time,
    channel: POSE_CHANNEL,
    easing: extra.easing || EASING_DEFAULT,
    easingArgs: extra.easingArgs,
    interpolation: extra.interpolation,
    data_points: [{ x: value, y: 0, z: 0 }],
  });
}

function keyValue(kf) {
  try {
    const v = kf.calc('x');
    return Number.isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
}

export function sampleTrack(animator, t) {
  const kfs = (animator?.keyframes || []).filter(k => k.channel === POSE_CHANNEL).sort((a, b) => a.time - b.time);
  if (!kfs.length) return null;
  if (t <= kfs[0].time) return clamp01(keyValue(kfs[0]));
  const last = kfs[kfs.length - 1];
  if (t >= last.time) return clamp01(keyValue(last));

  let i = 0;
  while (i < kfs.length - 1 && kfs[i + 1].time <= t) i++;
  const before = kfs[i];
  const after = kfs[i + 1];
  if (before.interpolation === 'step') return clamp01(keyValue(before));

  const span = after.time - before.time;
  const local = span > 1e-9 ? (t - before.time) / span : 1;
  const easing = after.easing || EASING_DEFAULT;
  const fn = easingRegistry[easing] || easingRegistry.linear;
  let eased = hasArgs(easing)
    ? fn(local, Array.isArray(after.easingArgs) && after.easingArgs.length ? after.easingArgs[0] : getEasingArgDefault(easing))
    : fn(local);
  if (!Number.isFinite(eased)) eased = local;

  const a = keyValue(before);
  const b = keyValue(after);
  return clamp01(a + (b - a) * eased);
}

export function animationWeightAt(anim, id, time, defaultWeight) {
  if (!anim) return null;
  const setting = getPoseSettings(anim)[id];
  const track = getTrack(anim, id);
  const tracked = track ? sampleTrack(track, time) : null;
  const target = tracked ?? setting?.weight;
  if (target === undefined || target === null) return null;

  const fadeTicks = setting?.fade_in || 0;
  if (fadeTicks <= 0) return target;
  const progress = clamp01((time * TICKS_PER_SECOND) / fadeTicks);
  return defaultWeight + (target - defaultWeight) * progress;
}

export function previewWeight(id, defaultWeight) {
  const base = Number.isFinite(Number(defaultWeight)) ? clamp01(Number(defaultWeight)) : 1;
  if (!isAzureFormat() || typeof Animation === 'undefined') return base;
  const anim = Animation.selected;
  if (!anim) return base;
  const w = animationWeightAt(anim, id, Timeline?.time || 0, base);
  return w === null ? base : clamp01(w);
}

function exportKeyValue(kf) {
  const raw = kf.data_points?.[0]?.x;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed === '') return 0;
    const n = Number(trimmed);
    return Number.isNaN(n) ? raw : round(clamp01(n));
  }
  return round(clamp01(Number(raw) || 0));
}

export function writePoseWeightsJson(anim, obj, { orderedMap, normTime, roundTime }) {
  delete obj.pose_weights;
  const settings = getPoseSettings(anim);
  const tracks = getTracks(anim);
  const ids = [...new Set([...Object.keys(settings), ...Object.keys(tracks)])];
  if (!ids.length) return obj;

  const out = {};
  for (const id of ids) {
    const s = settings[id];
    const track = tracks[id];
    const keys = (track?.keyframes || []).filter(k => k.channel === POSE_CHANNEL).sort((a, b) => a.time - b.time);
    if (!s && !keys.length) continue;

    const node = {};
    if (s && !keys.length) node.weight = round(s.weight);
    if (s?.fade_in) node.fade_in = round(s.fade_in, 1e4);
    if (s?.fade_out) node.fade_out = round(s.fade_out, 1e4);
    if (s && s.restore === false) node.restore = false;

    if (keys.length) {
      node.keyframes = orderedMap(keys.map(kf => {
        const value = exportKeyValue(kf);
        const easing = kf.easing && kf.easing !== EASING_DEFAULT ? kf.easing : null;
        const step = kf.interpolation === 'step';
        if (!easing && !step) return [normTime(roundTime(kf.time)), value];
        const key = { value };
        if (easing) key.easing = easing;
        if (easing && hasArgs(easing) && Array.isArray(kf.easingArgs) && kf.easingArgs.length) key.easingArgs = [...kf.easingArgs];
        if (step) key.interpolation = 'step';
        return [normTime(roundTime(kf.time)), key];
      }));
    }
    out[id] = node;
  }

  if (Object.keys(out).length) obj.pose_weights = out;
  return obj;
}

export function readPoseWeightsJson(anim, src) {
  const data = src?.pose_weights;
  if (!data || typeof data !== 'object') return;

  const settings = {};
  for (const [id, node] of Object.entries(data)) {
    if (!id) continue;
    if (typeof node === 'number') {
      settings[id] = normalizeSetting({ weight: node });
      continue;
    }
    if (!node || typeof node !== 'object') continue;

    const keyframes = node.keyframes && typeof node.keyframes === 'object' ? node.keyframes : null;
    const hasSetting = ['weight', 'fade_in', 'fade_out', 'restore'].some(k => node[k] !== undefined);
    if (hasSetting) settings[id] = normalizeSetting(node);

    if (keyframes && Object.keys(keyframes).length) {
      const animator = createTrack(anim, id);
      if (!animator) continue;
      for (const [rawTime, entry] of Object.entries(keyframes)) {
        const time = parseFloat(rawTime);
        if (!Number.isFinite(time)) continue;
        if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
          addWeightKeyframe(animator, time, entry.value ?? 0, {
            easing: entry.easing,
            easingArgs: Array.isArray(entry.easingArgs) ? [...entry.easingArgs] : undefined,
            interpolation: entry.interpolation === 'step' ? 'step' : undefined,
          });
        } else {
          addWeightKeyframe(animator, time, Array.isArray(entry) ? entry[0] : entry);
        }
      }
    }
  }
  setPoseSettings(anim, settings);
}

let originalGetUndoCopy = null;
let originalExtend = null;

function wrappedGetUndoCopy(...args) {
  const copy = originalGetUndoCopy.apply(this, args);
  const tracks = Object.values(getTracks(this));
  if (copy && typeof copy === 'object') {
    if (copy.animators) {
      for (const key of Object.keys(copy.animators)) {
        if (copy.animators[key]?.type === POSE_ANIMATOR_TYPE) delete copy.animators[key];
      }
    }
    for (const animator of tracks) {
      if (!animator.keyframes.length) continue;
      copy.animators = copy.animators || {};
      copy.animators[animator.uuid] = {
        name: animator._name,
        type: POSE_ANIMATOR_TYPE,
        keyframes: animator.keyframes.map(kf => kf.getUndoCopy()),
      };
    }
  }
  return copy;
}

function wrappedExtend(data, ...rest) {
  if (!data || typeof data !== 'object' || !data.animators || typeof data.animators !== 'object') {
    return originalExtend.call(this, data, ...rest);
  }

  const mine = {};
  const others = {};
  for (const [key, blueprint] of Object.entries(data.animators)) {
    (blueprint?.type === POSE_ANIMATOR_TYPE ? mine : others)[key] = blueprint;
  }
  const result = originalExtend.call(this, { ...data, animators: others }, ...rest);

  for (const id of Object.keys(getTracks(this))) removeTrack(this, id);
  for (const [key, blueprint] of Object.entries(mine)) {
    const id = blueprint.name;
    if (!id) continue;
    const uuid = typeof isUUID === 'function' && isUUID(key) ? key : guid();
    const animator = createTrack(this, id, uuid);
    if (!animator) continue;
    for (const kf of blueprint.keyframes || []) animator.addKeyframe(kf, kf.uuid);
  }
  return result;
}

function showTracksInTimeline(anim = Animation.selected) {
  if (!isAzureFormat() || !anim || !Animator?.open) return;
  for (const animator of Object.values(getTracks(anim))) {
    try { animator.addToTimeline(true); } catch { /* timeline not ready */ }
  }
}

function onSelectAnimation() {
  setTimeout(() => showTracksInTimeline(), 0);
}

function showPoseWeightsDialog(anim = Animation.selected) {
  if (!anim) {
    Blockbench.showQuickMessage('Select an animation first.', 2000);
    return;
  }

  const settings = getPoseSettings(anim);
  const tracks = getTracks(anim);
  const rigIds = rigModifierIds();
  const ids = [...new Set([...rigIds, ...Object.keys(settings), ...Object.keys(tracks)])];

  const rows = ids.map(id => {
    const s = settings[id];
    const track = tracks[id];
    return {
      id,
      inRig: rigIds.includes(id),
      defaultWeight: rigDefaultWeight(id),
      enabled: !!s || !!track,
      weight: s ? s.weight : 0,
      fade_in: s ? s.fade_in : 0,
      fade_out: s ? s.fade_out : 0,
      restore: s ? s.restore : true,
      track: !!track,
      trackKeys: track ? track.keyframes.length : 0,
    };
  });

  const dialog = new Dialog({
    id: 'azl_pose_weights',
    title: `Pose Modifier Weights — ${anim.name}`,
    width: 860,
    component: {
      data() {
        return { rows, newId: '' };
      },
      methods: {
        addCustom() {
          const id = String(this.newId || '').trim();
          if (!id || this.rows.some(r => r.id === id)) return;
          this.rows.push({
            id, inRig: false, defaultWeight: 1, enabled: true, weight: 0,
            fade_in: 0, fade_out: 0, restore: true, track: false, trackKeys: 0,
          });
          this.newId = '';
        },
      },
      template: `
        <div class="dialog_content azl_pose_weights_dialog" style="display:flex;flex-direction:column;gap:10px;">
          <p style="margin:0;opacity:0.8;line-height:1.45;">
            While this animation plays, AzureLib sets each enabled modifier's pose layer weight
            (0 = off, 1 = full) for the entity playing it, fading over the given ticks, and fades it
            back to its default when the animation stops. A weight track replaces the fixed weight with
            timeline keyframes (one row per modifier; the value is X).
          </p>
          <div v-if="!rows.length" style="opacity:0.7;">
            No pose modifiers in the rig yet. Add IK, look-at or spring bones in the AzureLib Rig panel,
            or add an id registered in code below.
          </div>
          <table v-else style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="text-align:left;opacity:0.8;">
                <th style="padding:4px;">Modifier</th>
                <th style="padding:4px;">Use</th>
                <th style="padding:4px;">Weight</th>
                <th style="padding:4px;">Fade in (ticks)</th>
                <th style="padding:4px;">Fade out (ticks)</th>
                <th style="padding:4px;" title="Fade back to the default weight when the animation stops">Restore</th>
                <th style="padding:4px;">Weight track</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.id" style="border-top:1px solid rgba(255,255,255,0.08);">
                <td style="padding:4px;">
                  <code>{{ row.id }}</code>
                  <div style="font-size:0.85em;opacity:0.6;">{{ row.inRig ? ('default ' + row.defaultWeight) : 'code-registered' }}</div>
                </td>
                <td style="padding:4px;"><input type="checkbox" v-model="row.enabled"></td>
                <td style="padding:4px;">
                  <input type="number" class="dark_bordered" style="width:70px;" min="0" max="1" step="0.05"
                    v-model.number="row.weight" :disabled="!row.enabled || row.track">
                </td>
                <td style="padding:4px;">
                  <input type="number" class="dark_bordered" style="width:70px;" min="0" step="1"
                    v-model.number="row.fade_in" :disabled="!row.enabled">
                </td>
                <td style="padding:4px;">
                  <input type="number" class="dark_bordered" style="width:70px;" min="0" step="1"
                    v-model.number="row.fade_out" :disabled="!row.enabled || !row.restore">
                </td>
                <td style="padding:4px;"><input type="checkbox" v-model="row.restore" :disabled="!row.enabled"></td>
                <td style="padding:4px;">
                  <label style="display:flex;align-items:center;gap:6px;">
                    <input type="checkbox" v-model="row.track" :disabled="!row.enabled">
                    <span v-if="row.trackKeys" style="opacity:0.7;">{{ row.trackKeys }} key{{ row.trackKeys === 1 ? '' : 's' }}</span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="display:flex;gap:8px;align-items:center;">
            <input type="text" class="dark_bordered" style="flex:1;" v-model="newId"
              placeholder="Modifier id registered in Java (e.g. head_look)" @keydown.enter.prevent="addCustom()">
            <button type="button" style="position:static;padding:6px 12px;" @click="addCustom()">Add Id</button>
          </div>
        </div>
      `,
    },
    onConfirm() {
      const result = dialog.content_vue?.rows || [];
      const removing = result.filter(r => (!r.enabled || !r.track) && r.trackKeys > 0);
      if (removing.length && !confirm(`Delete the weight track${removing.length > 1 ? 's' : ''} for ${removing.map(r => r.id).join(', ')}?`)) {
        return false;
      }

      Undo.initEdit({ animations: [anim] });

      const next = {};
      for (const r of result) {
        if (!r.enabled) {
          removeTrack(anim, r.id);
          continue;
        }
        next[r.id] = { weight: r.weight, fade_in: r.fade_in, fade_out: r.fade_out, restore: r.restore };
        if (r.track && !getTrack(anim, r.id)) {
          const animator = createTrack(anim, r.id);
          if (animator) addWeightKeyframe(animator, 0, clamp01(Number(r.weight) || 0));
        } else if (!r.track) {
          removeTrack(anim, r.id);
        }
      }
      setPoseSettings(anim, next);
      anim.saved = false;

      Undo.finishEdit('Edit pose modifier weights');
      showTracksInTimeline(anim);
      Animator.preview();
    },
  });

  dialog.show();
}

let registered = false;
let property = null;
let action = null;
let contextMenuItem = null;
let addedPossibleChannel = false;

export function registerPoseWeights() {
  if (registered) return;
  registered = true;

  if (typeof Property !== 'undefined' && typeof Animation !== 'undefined') {
    property = new Property(Animation, 'string', POSE_PROP, { default: '' });
  }

  definePoseWeightAnimator();

  if (typeof Animator !== 'undefined' && Animator.possible_channels && !Animator.possible_channels[POSE_CHANNEL]) {
    Animator.possible_channels[POSE_CHANNEL] = true;
    addedPossibleChannel = true;
  }

  try {
    const filter = Timeline?.vue?.channels;
    if (filter && typeof filter === 'object' && filter[POSE_CHANNEL] === undefined) {
      if (typeof Vue !== 'undefined' && Vue.set) Vue.set(filter, POSE_CHANNEL, true);
      else filter[POSE_CHANNEL] = true;
    }
  } catch { /* older timeline */ }

  if (typeof Animation !== 'undefined') {
    originalGetUndoCopy = Animation.prototype.getUndoCopy;
    originalExtend = Animation.prototype.extend;
    Animation.prototype.getUndoCopy = wrappedGetUndoCopy;
    Animation.prototype.extend = wrappedExtend;
  }

  action = new Action('azl_pose_weights', {
    name: 'Pose Modifier Weights…',
    description: 'Set or keyframe how much IK, look-at and spring bones affect the pose while this animation plays',
    icon: 'tune',
    category: 'animation',
    condition: () => isAzureFormat() && !!Animator?.open,
    click: () => showPoseWeightsDialog(),
  });
  try { MenuBar.menus?.animation?.addAction(action); } catch { /* menu missing */ }

  const structure = Animation.prototype.menu?.structure;
  if (Array.isArray(structure)) {
    contextMenuItem = {
      name: 'Pose Modifier Weights…',
      id: 'azl_pose_weights_context',
      icon: 'tune',
      condition: () => isAzureFormat(),
      click: animation => showPoseWeightsDialog(animation),
    };
    structure.push(contextMenuItem);
  }

  Blockbench.on('select_animation', onSelectAnimation);
}

export function unregisterPoseWeights() {
  if (!registered) return;
  registered = false;

  Blockbench.removeListener('select_animation', onSelectAnimation);

  const structure = Animation.prototype.menu?.structure;
  if (contextMenuItem && Array.isArray(structure)) {
    const i = structure.indexOf(contextMenuItem);
    if (i !== -1) structure.splice(i, 1);
  }
  contextMenuItem = null;

  action?.delete();
  action = null;

  if (originalGetUndoCopy) Animation.prototype.getUndoCopy = originalGetUndoCopy;
  if (originalExtend) Animation.prototype.extend = originalExtend;
  originalGetUndoCopy = null;
  originalExtend = null;

  if (addedPossibleChannel) delete Animator.possible_channels[POSE_CHANNEL];
  addedPossibleChannel = false;

  property?.delete?.();
  property = null;
}
