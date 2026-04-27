/**
 * AzureLib Animator — Keyframe Interpolation & Overrides
 * ------------------------------------------------------
 * Adds easing-aware keyframe interpolation and export behaviour
 * for AzureLib's unified animation format.
 *
 * Both AzureLib easing nodes ({ vector, easing, easingArgs }) and
 * Bedrock spline nodes ({ post, pre?, lerp_mode }) are handled here.
 *
 * © 2025 AzureDoom — MIT License
 */

import { hasArgs } from '../core/azure-utils.js';
import { easingRegistry, EASING_DEFAULT, getEasingArgDefault } from './azure-easing.js';

let ORIG = null;
let ORIG_REVERSE_CONDITION = null;
let PATCHED = false;

// ---------------------------------------------------------------------------
// Capture originals once
// ---------------------------------------------------------------------------

function captureOriginalsOnce() {
  if (ORIG) return;
  ORIG = {
    getLerp: Keyframe.prototype.getLerp,
    compileBedrockKeyframe: Keyframe.prototype.compileBedrockKeyframe,
    getUndoCopy: Keyframe.prototype.getUndoCopy,
    extend: Keyframe.prototype.extend,
  };
  try {
    ORIG_REVERSE_CONDITION = BarItems.reverse_keyframes?.condition || null;
  } catch {
    ORIG_REVERSE_CONDITION = null;
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

export function registerKeyframeOverrides() {
  if (PATCHED) return;
  captureOriginalsOnce();

  if (!Keyframe.prototype._azurePatched) {
    Keyframe.prototype.getLerp              = getLerpOverride;
    Keyframe.prototype.compileBedrockKeyframe = compileBedrockKeyframe;
    Keyframe.prototype.getUndoCopy          = getUndoCopy;
    Keyframe.prototype.extend               = extendKeyframe;
    Keyframe.prototype._azurePatched        = true;
  }

  if (BarItems.reverse_keyframes && !BarItems.reverse_keyframes._azurePatched) {
    if (!ORIG_REVERSE_CONDITION) ORIG_REVERSE_CONDITION = BarItems.reverse_keyframes.condition;
    BarItems.reverse_keyframes.condition = reverseCondition;
    BarItems.reverse_keyframes._azurePatched = true;
  }

  // Hook Blockbench's playback dispatcher so Azure-easing segments are
  // actually interpolated. Without this, kf.interpolation === 'linear'
  // (our marker for "Azure easing mode") would use BB's plain linear branch
  // and ignore any Azure easing curve set on the keyframe.
  Blockbench.on('interpolate_keyframes', azureInterpolateListener);

  PATCHED = true;
}

export function unregisterKeyframeOverrides() {
  if (!PATCHED || !ORIG) return;
  try {
    if (Keyframe.prototype._azurePatched) {
      Keyframe.prototype.getLerp              = ORIG.getLerp;
      Keyframe.prototype.compileBedrockKeyframe = ORIG.compileBedrockKeyframe;
      Keyframe.prototype.getUndoCopy          = ORIG.getUndoCopy;
      Keyframe.prototype.extend               = ORIG.extend;
      delete Keyframe.prototype._azurePatched;
    }
    if (BarItems.reverse_keyframes?._azurePatched && ORIG_REVERSE_CONDITION) {
      BarItems.reverse_keyframes.condition = ORIG_REVERSE_CONDITION;
      delete BarItems.reverse_keyframes._azurePatched;
    }
    try { Blockbench.removeListener('interpolate_keyframes', azureInterpolateListener); } catch { /* noop */ }
  } finally {
    PATCHED = false;
  }
}

// ---------------------------------------------------------------------------
// interpolate_keyframes listener — drives Azure-easing playback
// ---------------------------------------------------------------------------
//
// Blockbench's BoneAnimator.interpolate dispatches this event before its
// own interpolation switch. If a listener returns { value: [x, y, z] }
// the dispatcher returns that array directly and the built-in
// linear/catmullrom/bezier branches are skipped.
//
// We use this for Azure-easing segments (kf.interpolation falsy or 'linear')
// — without it, kf.interpolation === undefined doesn't match any of BB's
// built-in branches and BoneAnimator.interpolate falls off the end without
// returning a value, freezing the bone between keyframes.
//
// Returning undefined from the listener leaves BB's normal dispatch in
// place, which is what we want for catmullrom/bezier/step segments.

function azureInterpolateListener(args) {
  if (Format?.id !== 'azure_model') return;

  const before = args && args.keyframe_before;
  const after  = args && args.keyframe_after;
  if (!before || !after) return;

  // Only handle Azure-easing segments. Anything that names a BB-native
  // interpolation mode (catmullrom / bezier / step) is left to BB.
  // 'linear' is treated as Azure-eligible because that's the default value
  // BB stamps onto fresh keyframes — and it's also semantically a no-op
  // when the easing happens to be plain linear.
  const azureEligible = mode => !mode || mode === 'linear';
  if (!azureEligible(before.interpolation) || !azureEligible(after.interpolation)) return;

  // Defer to BB when either side carries molang expressions — the eased
  // numeric path can't preserve string expressions and would silently
  // change behaviour. (Safe: BB's linear→linear branch handles this case.)
  if (before.has_expressions || after.has_expressions) return;

  // Resolve easing from the destination keyframe. AzureLib reads easing
  // off the "to" keyframe, mirroring the Java runtime.
  const easing = after.easing || EASING_DEFAULT;
  const fn = easingRegistry[easing] || easingRegistry.linear;

  let eased;
  if (hasArgs(easing)) {
    const arg = (Array.isArray(after.easingArgs) && after.easingArgs.length)
      ? after.easingArgs[0]
      : getEasingArgDefault(easing);
    eased = fn(args.t, arg);
  } else {
    eased = fn(args.t);
  }

  if (typeof eased !== 'number' || Number.isNaN(eased)) return;

  // Match the data_point selection used by Keyframe.prototype.getLerp:
  // earlier-in-time kf uses dp 1 if it has multiple, later kf uses dp 0.
  // before.time < after.time is guaranteed here by BoneAnimator.interpolate.
  const beforeDP = (before.data_points.length > 1) ? 1 : 0;
  const afterDP  = 0;

  const value = ['x', 'y', 'z'].map(axis => {
    const a = before.calc(axis, beforeDP);
    const b = after.calc(axis, afterDP);
    return a + (b - a) * eased;
  });

  return { value };
}

// ---------------------------------------------------------------------------
// getLerp — easing-aware interpolation
// ---------------------------------------------------------------------------
//
// Reachable in two situations:
//   1. BoneAnimator.interpolate's linear-only branch (only when both kfs
//      have interpolation === 'linear'). With the event listener above,
//      that branch is short-circuited for Azure-easing segments, so this
//      path mostly handles plain linear→linear segments at runtime.
//   2. The keyframe optimizer in animation.js (~line 1462) uses the same
//      linear-only gate during bake/optimize and calls getLerp directly.
//      We honour Azure easing there too so optimized output matches
//      playback behaviour.

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getLerpOverride(other, axis, t) {
  if (Format?.id !== 'azure_model') {
    return ORIG.getLerp.apply(this, arguments);
  }

  // Defer to Blockbench for explicit Bedrock spline/bezier/step modes.
  // Note: 'linear' is intentionally NOT in this list — we want to apply
  // the Azure easing curve when one is set, even if the kf carries
  // BB's default interpolation === 'linear' marker.
  if (other.interpolation === 'catmullrom' ||
      other.interpolation === 'bezier'     ||
      other.interpolation === 'step') {
    return ORIG.getLerp.apply(this, arguments);
  }

  const easing = other.easing || EASING_DEFAULT;

  // Plain linear with no custom easing → BB's original implementation
  // is fine and preserves its allow_expression fast-path.
  if (easing === EASING_DEFAULT && (!other.easingArgs || !other.easingArgs.length)) {
    return ORIG.getLerp.apply(this, arguments);
  }

  let func = easingRegistry[easing] || easingRegistry.linear;

  if (hasArgs(easing)) {
    const arg = Array.isArray(other.easingArgs) && other.easingArgs.length
      ? other.easingArgs[0]
      : getEasingArgDefault(easing);
    func = func.bind(null, arg);
  }

  const eased = func(t);
  const start = this.calc(axis);
  const stop  = other.calc(axis);
  const result = lerp(start, stop, eased);

  if (Number.isNaN(result)) throw new Error('[AzureLib] Invalid easing result');
  return result;
}

// ---------------------------------------------------------------------------
// compileBedrockKeyframe — unified serialiser
// ---------------------------------------------------------------------------

function compileBedrockKeyframe() {
  if (Format?.id !== 'azure_model') {
    return ORIG.compileBedrockKeyframe.apply(this, arguments);
  }

  const base = ORIG.compileBedrockKeyframe.apply(this, arguments);
  const cloneArray = arr => Array.isArray(arr) ? [...arr] : arr;

  // --- Bedrock lerp_mode keyframes (linear / catmullrom): keep pre/post/lerp_mode ---
  if (this.interpolation === 'catmullrom') {
    const lerpMode = 'catmullrom';
    if (base && typeof base === 'object') {
      return {
        ...(base.pre !== undefined ? { pre: cloneArray(base.pre) } : {}),
        post:      cloneArray(base.post || base),
        lerp_mode: lerpMode,
      };
    }
    return { post: cloneArray(base), lerp_mode: lerpMode };
  }

  // --- Bezier keyframes: Blockbench handles pre/post natively, pass through ---
  if (this.interpolation === 'bezier') {
    if (base && typeof base === 'object') {
      return {
        ...(base.pre  !== undefined ? { pre:  cloneArray(base.pre)  } : {}),
        ...(base.post !== undefined ? { post: cloneArray(base.post) } : {}),
      };
    }
    return base;
  }

  // --- Step transition: keep pre/post pair ---
  const prev = this.getPreviousKeyframe?.();
  if (this.data_points.length === 1 && prev && prev.interpolation === 'step') {
    if (base && typeof base === 'object') {
      return {
        ...(base.pre  !== undefined ? { pre:  cloneArray(base.pre)  } : {}),
        ...(base.post !== undefined ? { post: cloneArray(base.post) } : {}),
      };
    }
    return base;
  }

  // --- If Blockbench emitted explicit pre/post transition data, keep raw ---
  if (
    base && typeof base === 'object' && !Array.isArray(base) &&
    (base.pre !== undefined || base.post !== undefined)
  ) {
    const out = {
      ...(base.pre       !== undefined ? { pre:       cloneArray(base.pre)       } : {}),
      ...(base.post      !== undefined ? { post:      cloneArray(base.post)      } : {}),
      ...(base.lerp_mode !== undefined ? { lerp_mode: base.lerp_mode             } : {}),
    };
    if (this.easing && this.easing !== EASING_DEFAULT) out.easing = this.easing;
    if (hasArgs(this.easing) && Array.isArray(this.easingArgs) && this.easingArgs.length) {
      out.easingArgs = [...this.easingArgs];
    }
    return out;
  }

  // --- AzureLib easing node ---
  const withAzureVectorNode = value => {
    // Already an object with extra fields? (e.g. existing easing data)
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const out = { ...value };
      if (out.easing === undefined && this.easing !== undefined) {
        out.easing = this.easing;
      }
      if (out.easingArgs === undefined && hasArgs(this.easing) &&
          Array.isArray(this.easingArgs) && this.easingArgs.length) {
        out.easingArgs = [...this.easingArgs];
      }
      return out;
    }

    // Plain array → Azure node
    const out = { vector: cloneArray(value) };
    if (this.easing && this.easing !== EASING_DEFAULT) {
      out.easing = this.easing;
    }
    if (hasArgs(this.easing) && Array.isArray(this.easingArgs) && this.easingArgs.length) {
      out.easingArgs = [...this.easingArgs];
    }

    // Flatten to plain array if there are no extra fields
    if (!out.easing && !out.easingArgs) {
      return out.vector;
    }
    return out;
  };

  return withAzureVectorNode(base);
}

// ---------------------------------------------------------------------------
// getUndoCopy — preserve easing state in undo history
// ---------------------------------------------------------------------------

function getUndoCopy() {
  const base = ORIG.getUndoCopy.apply(this, arguments);
  if (Format?.id === 'azure_model') {
    base.easing = this.easing;
    base.interpolation = this.interpolation;
    if (hasArgs(this.easing)) base.easingArgs = this.easingArgs ? [...this.easingArgs] : undefined;
  }
  return base;
}

// ---------------------------------------------------------------------------
// extend — parse keyframe data on load
// ---------------------------------------------------------------------------

function extendKeyframe(dataIn) {
  const data = Object.assign({}, dataIn);

  if (Format?.id !== 'azure_model') {
    return ORIG.extend.apply(this, [data]);
  }

  const cloneVec = (vec, fallback = [0, 0, 0]) => {
    if (!Array.isArray(vec)) return [...fallback];
    return [
      vec[0] !== undefined ? vec[0] : fallback[0],
      vec[1] !== undefined ? vec[1] : fallback[1],
      vec[2] !== undefined ? vec[2] : fallback[2],
    ];
  };

  const unwrapNode = value => {
    if (Array.isArray(value)) {
      return { vector: cloneVec(value) };
    }
    if (value && typeof value === 'object') {
      const out = {};
      if (value.easing       !== undefined) out.easing       = value.easing;
      if (value.interpolation !== undefined) out.interpolation = value.interpolation;
      if (Array.isArray(value.easingArgs))   out.easingArgs   = [...value.easingArgs];
      if (Array.isArray(value.vector))       { out.vector = cloneVec(value.vector); return out; }
      if ('x' in value && 'y' in value && 'z' in value) {
        out.vector = cloneVec([value.x, value.y, value.z]); return out;
      }
    }
    return { vector: null };
  };

  const valuesNode = unwrapNode(data.values);
  const preNode    = unwrapNode(data.pre);
  const postNode   = unwrapNode(data.post);

  // Apply easing from whichever node carries it
  const easingSource = valuesNode.easing ?? data.easing ?? postNode.easing;
  if (easingSource !== undefined)     this.easing      = easingSource;

  // Apply interpolation only for explicit Bedrock modes (catmullrom / bezier / step).
  // We intentionally IGNORE data.interpolation === 'linear' from Blockbench core because
  // 'linear' is Blockbench's own default interp label and would shadow our Azure easing.
  // 'linear' as a Bedrock lerp_mode is set via data.lerp_mode, not data.interpolation.
  // Only store Blockbench-native interpolation modes that we explicitly support.
  // We intentionally ignore data.interpolation === 'linear' (Blockbench's own default)
  // because it would shadow Azure easings. lerp_mode:'linear' from JSON is also dropped —
  // it is handled by AzureLib's own linear easing instead.
  const BEDROCK_INTERP_MODES = new Set(['catmullrom', 'bezier', 'step']);
  let rawInterp = data.interpolation ?? postNode.interpolation;
  // Prefer explicit lerp_mode from JSON over Blockbench's data.interpolation default
  if (data.lerp_mode !== undefined && data.lerp_mode !== 'linear') rawInterp = data.lerp_mode;

  if (rawInterp !== undefined && BEDROCK_INTERP_MODES.has(rawInterp)) {
    this.interpolation = rawInterp;
  } else {
    this.interpolation = 'linear';
  }

  const easingArgsSource = valuesNode.easingArgs ?? data.easingArgs ?? postNode.easingArgs;
  if (easingArgsSource !== undefined) this.easingArgs   = [...easingArgsSource];

  // Strip Azure/Bedrock wrappers before handing off to Blockbench core
  const plain = Object.assign({}, data);
  ['values', 'pre', 'post'].forEach(key => {
    if (plain[key] && typeof plain[key] === 'object' && !Array.isArray(plain[key])) {
      delete plain[key];
    }
  });

  const result = ORIG.extend.apply(this, [plain]);

  // Re-hydrate axis data explicitly
  const ensurePoint = idx => {
    if (!Array.isArray(this.data_points)) this.data_points = [];
    if (!this.data_points[idx]) this.data_points[idx] = {};
    return this.data_points[idx];
  };

  const toNum = v => {
    if (typeof v !== 'string') return v;
    const n = Number(v);
    return isNaN(n) ? v : n;  // Molang → keep string; numeric string → number
  };
  const writeVector = (point, vec) => {
    if (!vec) return;
    point.x = toNum(vec[0]);
    point.y = toNum(vec[1]);
    point.z = toNum(vec[2]);
    delete point.vector;
  };

  if (preNode.vector && postNode.vector) {
    writeVector(ensurePoint(0), preNode.vector);
    writeVector(ensurePoint(1), postNode.vector);
  } else if (preNode.vector) {
    writeVector(ensurePoint(0), preNode.vector);
  } else if (!preNode.vector && postNode.vector && this.interpolation === 'catmullrom') {
    writeVector(ensurePoint(0), postNode.vector);
  } else if (valuesNode.vector) {
    writeVector(ensurePoint(0), valuesNode.vector);
  } else if (postNode.vector) {
    writeVector(ensurePoint(0), postNode.vector);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Reverse keyframes guard
// ---------------------------------------------------------------------------

function reverseCondition() {
  if (reverseCondition._inAzureCall) return false;
  try {
    reverseCondition._inAzureCall = true;
    if (!ORIG_REVERSE_CONDITION || typeof ORIG_REVERSE_CONDITION !== 'function') return false;
    const result = ORIG_REVERSE_CONDITION.call(BarItems.reverse_keyframes);
    return result && Format?.id !== 'azure_model';
  } finally {
    reverseCondition._inAzureCall = false;
  }
}

export default { registerKeyframeOverrides, unregisterKeyframeOverrides };
