/**
 * AzureLib Animator — Keyframe Interpolation & Overrides
 * ------------------------------------------------------
 * Adds easing-aware keyframe interpolation and export behavior
 * for AzureLib’s animation format.
 *
 * © 2025 AzureDoom — MIT License
 */

import { hasArgs } from '../core/azure-utils.js';
import { easingRegistry, EASING_DEFAULT, getEasingArgDefault } from './azure-easing.js';

let ORIG = null;
let ORIG_REVERSE_CONDITION = null;
let PATCHED = false;

/**
 * Capture original methods only once to avoid recursion loops.
 */
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

/**
 * Apply all AzureLib-specific keyframe patches safely.
 */
export function registerKeyframeOverrides() {
  if (PATCHED) return;
  captureOriginalsOnce();

  if (!Keyframe.prototype._azurePatched) {
    Keyframe.prototype.getLerp = getLerpOverride;
    Keyframe.prototype.compileBedrockKeyframe = compileBedrockKeyframe;
    Keyframe.prototype.getUndoCopy = getUndoCopy;
    Keyframe.prototype.extend = extendKeyframe;
    Keyframe.prototype._azurePatched = true;
  }

  if (BarItems.reverse_keyframes && !BarItems.reverse_keyframes._azurePatched) {
    if (!ORIG_REVERSE_CONDITION) ORIG_REVERSE_CONDITION = BarItems.reverse_keyframes.condition;
    BarItems.reverse_keyframes.condition = reverseCondition;
    BarItems.reverse_keyframes._azurePatched = true;
  }

  PATCHED = true;
}

/**
 * Unregister (restore) patched methods safely.
 */
export function unregisterKeyframeOverrides() {
  if (!PATCHED || !ORIG) return;
  try {
    if (Keyframe.prototype._azurePatched) {
      Keyframe.prototype.getLerp = ORIG.getLerp;
      Keyframe.prototype.compileBedrockKeyframe = ORIG.compileBedrockKeyframe;
      Keyframe.prototype.getUndoCopy = ORIG.getUndoCopy;
      Keyframe.prototype.extend = ORIG.extend;
      delete Keyframe.prototype._azurePatched;
    }
    if (BarItems.reverse_keyframes && BarItems.reverse_keyframes._azurePatched && ORIG_REVERSE_CONDITION) {
      BarItems.reverse_keyframes.condition = ORIG_REVERSE_CONDITION;
      delete BarItems.reverse_keyframes._azurePatched;
    }
  } finally {
    PATCHED = false;
  }
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Override for easing-aware interpolation.
 */
function getLerpOverride(other, axis, t) {
  if (Format.id !== 'azure_model') {
    return ORIG.getLerp.apply(this, arguments);
  }

  const easing = other.easing || EASING_DEFAULT;
  let func = easingRegistry[easing] || easingRegistry.linear;

  if (hasArgs(easing)) {
    const arg = Array.isArray(other.easingArgs) && other.easingArgs.length
      ? other.easingArgs[0]
      : getEasingArgDefault(easing);
    func = func.bind(null, arg);
  }

  const eased = func(t);
  const start = this.calc(axis);
  const stop = other.calc(axis);
  const result = lerp(start, stop, eased);

  if (Number.isNaN(result)) throw new Error('[AzureLib] Invalid easing result');
  return result;
}

/**
 * Override for exporting keyframes with easing data.
 */
function compileBedrockKeyframe() {
  // Always run our serializer when exporting Azure animations
  if (Format.id !== 'azure_model') {
    return ORIG.compileBedrockKeyframe.apply(this, arguments);
  }

  const getArray = (dp) => {
    const vector = this.getArray(dp); // Blockbench's native vector for this datapoint
    const out = Array.isArray(vector)
      ? { vector }
      : { vector: [vector.x, vector.y, vector.z] };

    // Persist easing onto the serialized node
    if (this.easing && this.easing !== 'linear') out.easing = this.easing;
    if (hasArgs(this.easing) && Array.isArray(this.easingArgs) && this.easingArgs.length) {
      out.easingArgs = [...this.easingArgs];
    }
    return out;
  };

  const prev = this.getPreviousKeyframe?.();

  if (this.interpolation === 'catmullrom') {
    const includePre = (!prev && this.time > 0) || (prev && prev.interpolation !== 'catmullrom');
    return {
      pre: includePre ? getArray(0) : undefined,
      post: getArray(includePre ? 1 : 0),
      lerp_mode: this.interpolation,
    };
  }

  if (this.data_points.length === 1) {
    if (prev && prev.interpolation === 'step') {
      return { pre: getArray.call(prev, 1), post: getArray() };
    }
    return getArray();
  }

  return { pre: getArray(0), post: getArray(1) };
}

/**
 * Override for undo system — preserve easing state.
 */
function getUndoCopy() {
  const base = ORIG.getUndoCopy.apply(this, arguments);
  if (Format.id === 'azure_model') {
    base.easing = this.easing;
    if (hasArgs(this.easing)) base.easingArgs = this.easingArgs;
  }
  return base;
}

/**
 * Safe keyframe extend override (prevents recursion).
 */
function extendKeyframe(dataIn) {
  const data = Object.assign({}, dataIn);

  if (Format.id === 'azure_model') {
    if (typeof data.values === 'object') {
      if (data.values.easing !== undefined) this.easing = data.values.easing;
      if (Array.isArray(data.values.easingArgs)) this.easingArgs = data.values.easingArgs;

      if (!Array.isArray(data.values) && Array.isArray(data.values.vector)) {
        data.values = data.values.vector;
      }
    } else {
      if (data.easing !== undefined) this.easing = data.easing;
      if (Array.isArray(data.easingArgs)) this.easingArgs = data.easingArgs;
    }
  }

  return ORIG.extend.apply(this, [data]);
}

/**
 * Reverse keyframes guard for Azure format.
 */
function reverseCondition() {
  if (reverseCondition._inAzureCall) return false;
  try {
    reverseCondition._inAzureCall = true;
    if (!ORIG_REVERSE_CONDITION || typeof ORIG_REVERSE_CONDITION !== 'function') return false;
    const result = ORIG_REVERSE_CONDITION.call(BarItems.reverse_keyframes);
    return result && Format.id !== 'azure_model';
  } finally {
    reverseCondition._inAzureCall = false;
  }
}

export default { registerKeyframeOverrides, unregisterKeyframeOverrides };
