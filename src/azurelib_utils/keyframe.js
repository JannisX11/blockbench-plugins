import { Original, addMonkeypatch, hasArgs } from './utils';
import { easingFunctions, EASING_DEFAULT, getEasingArgDefault } from './easing';

//#region Keyframe Mixins
export function loadKeyframeOverrides() {
  addMonkeypatch(Keyframe, "prototype", "getLerp", keyframeGetLerp);
  addMonkeypatch(Keyframe, "prototype", "compileBedrockKeyframe", keyframeCompileBedrock);
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
  if (Format.id !== "azure_model") {
    return Original.get(Keyframe).getLerp.apply(this, arguments);
  }
  let easingFunc = easingFunctions[easing];
  if (hasArgs(easing)) {
    const arg1 = Array.isArray(other.easingArgs) && other.easingArgs.length > 0
      ? other.easingArgs[0]
      : getEasingArgDefault(other);
    easingFunc = easingFunc.bind(null, arg1);
  }
  const easedAmount = easingFunc(amount); 
  const start = this.calc(axis);
  const stop = other.calc(axis);
  const result = lerp(start, stop, easedAmount);
  if (Number.isNaN(result)) {
    throw new Error('batman');
  }
  return result;
}

function azurelibGetArray(data_point = 0) {
    const { easing, easingArgs, getArray } = this;
    let result = getArray.call(this, data_point);

    if (Format.id === "azure_model") {
        result = { vector: result, easing };
        if (hasArgs(easing)) {
            result.easingArgs = easingArgs;
        }
    }

    return result;
}

function keyframeCompileBedrock() {
    if (Format.id !== "azure_model" || !this.transform) {
        return Original.get(Keyframe).compileBedrockKeyframe.apply(this, arguments);
    }

    const previousKeyframe = this.getPreviousKeyframe.bind(this);

    if (this.interpolation === 'catmullrom') {
        const previous = previousKeyframe();
        const includePre = (!previous && this.time > 0) || (previous && previous.interpolation !== 'catmullrom');

        return {
            pre: includePre ? azurelibGetArray.call(this, 0) : undefined,
            post: azurelibGetArray.call(this, includePre ? 1 : 0),
            lerp_mode: this.interpolation,
        };
    }

    if (this.data_points.length === 1) {
        const previous = previousKeyframe();

        if (previous && previous.interpolation === 'step') {
            return new oneLiner({
                pre: azurelibGetArray.call(previous, 1),
                post: azurelibGetArray.call(this),
            });
        } else {
            return azurelibGetArray.call(this);
        }
    }

    return new oneLiner({
        pre: azurelibGetArray.call(this, 0),
        post: azurelibGetArray.call(this, 1),
    });
}

function keyframeGetUndoCopy() {
  const { easing, easingArgs } = this;
  const result = Original.get(Keyframe).getUndoCopy.apply(this, arguments);
  if (Format.id === "azure_model") {
    Object.assign(result, { easing });
    if (hasArgs(easing)) result.easingArgs = easingArgs;
  }
  return result;
}

function keyframeExtend(dataIn) {
  const data = Object.assign({}, dataIn);
  if (Format.id === "azure_model") {
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
  return result;
}

function reverseKeyframesCondition() {
  const res = Original.get(BarItems.reverse_keyframes).condition() && Format.id !== "azure_model";
  return res;
}

//#endregion Keyframe Mixins