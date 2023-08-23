import { Original, addMonkeypatch, hasArgs } from './utils';
import { easingFunctions, EASING_DEFAULT, getEasingArgDefault } from './easing';
import Keyframe = Blockbench.Keyframe;

//#region Keyframe Mixins
export function loadKeyframeOverrides() {
  addMonkeypatch(Keyframe, "prototype", "getLerp", keyframeGetLerp);
  addMonkeypatch(Keyframe, "prototype", "getArray", keyframeGetArray);
  addMonkeypatch(Keyframe, "prototype", "getUndoCopy", keyframeGetUndoCopy);
  addMonkeypatch(Keyframe, "prototype", "extend", keyframeExtend);

  addMonkeypatch(BarItems.reverse_keyframes, null, "condition", reverseKeyframesCondition);
}

export function unloadKeyframeOverrides() {
  //No-op for now since monkeypatches are unloaded automatically
}

function lerp(start, stop, amt) {
  return amt * (stop - start) + start;
}

// eslint-disable-next-line no-unused-vars
function keyframeGetLerp(other, axis, amount, allow_expression) {
  const easing = other.easing || EASING_DEFAULT;
  if (Format.id !== "animated_entity_model") {
    return Original.get(Keyframe).getLerp.apply(this, arguments);
  }
  let easingFunc = easingFunctions[easing];
  if (hasArgs(easing)) {
    const arg1 = Array.isArray(other.easingArgs) && other.easingArgs.length > 0
      ? other.easingArgs[0]
      : getEasingArgDefault(other);
    // console.log(`keyframeGetLerp arg1: ${arg1}`);
    easingFunc = easingFunc.bind(null, arg1);
  }
  const easedAmount = easingFunc(amount); 
  const start = this.calc(axis);
  const stop = other.calc(axis);
  const result = lerp(start, stop, easedAmount);
  // console.log('keyframeGetLerp easing:', easing, 'arguments:', arguments, 'start:', start, 'stop:', stop, 'amount:', amount, 'easedAmount:', easedAmount, 'result:', result);
  if (Number.isNaN(result)) {
    throw new Error('batman');
  }
  return result;
}

function keyframeGetArray() {
  const { easing, easingArgs } = this;
  let result = Original.get(Keyframe).getArray.apply(this, arguments);
  if (Format.id === "animated_entity_model") {
    result = { vector: result, easing };
    if (hasArgs(easing)) result.easingArgs = easingArgs;
  }
//   console.log('keyframeGetArray arguments:', arguments, 'this:', this, 'result:', result);
  return result;
}

function keyframeGetUndoCopy() {
  const { easing, easingArgs } = this;
  const result = Original.get(Keyframe).getUndoCopy.apply(this, arguments);
  if (Format.id === "animated_entity_model") {
    Object.assign(result, { easing });
    if (hasArgs(easing)) result.easingArgs = easingArgs;
  }
//   console.log('keyframeGetUndoCopy arguments:', arguments, 'this:', this, 'result:', result);
  return result;
}

function keyframeExtend(dataIn) {
  const data = Object.assign({}, dataIn);
//   console.log('keyframeExtend 1 arguments:', arguments);
  if (Format.id === "animated_entity_model") {
    if (typeof data.values === 'object') {
      if (data.values.easing !== undefined) {
        Merge.string(this, data.values, 'easing');
      }
      if (Array.isArray(data.values.easingArgs)) {
        this.easingArgs = data.values.easingArgs;
      }
      if (!Array.isArray(data.values) && Array.isArray(data.values.vector)) {
        // Convert data to format expected by KeyframeExtendOriginal
        data.values = data.values.vector;
      }
    } else {
      if (data.easing !== undefined) {
          Merge.string(this, data, 'easing');
      }
      if (Array.isArray(data.easingArgs)) {
        this.easingArgs = data.easingArgs;
      }
    }
  }
  const result = Original.get(Keyframe).extend.apply(this, arguments);
//   console.log('keyframeExtend 2 arguments:', arguments, 'this:', this, 'result:', result);
  return result;
}

function reverseKeyframesCondition() {
  const res = Original.get(BarItems.reverse_keyframes).condition() && Format.id !== "animated_entity_model";
  // console.log('reverseKeyframesCondition original:',Original.get(BarItems.reverse_keyframes).condition(), 'res:', res);
  return res;
}

//#endregion Keyframe Mixins