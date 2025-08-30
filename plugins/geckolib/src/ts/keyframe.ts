import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import {addMonkeypatch, Monkeypatches} from './utils';
import {
    EASING_DEFAULT,
    easingFunctions, type EasingKey,
    EasingProperties,
    GeckolibKeyframe,
    getEasingArgDefault, isArgsEasing,
    reverseEasing
} from './easing';
import {GECKOLIB_MODEL_ID} from "./constants";

export function loadKeyframeOverrides() {
    addMonkeypatch(Keyframe, "prototype", "getLerp", keyframeGetLerp);
    addMonkeypatch(Keyframe, "prototype", "compileBedrockKeyframe", keyframeCompileBedrock);
    addMonkeypatch(Keyframe, "prototype", "getUndoCopy", keyframeGetUndoCopy);
    addMonkeypatch(Keyframe, "prototype", "extend", keyframeExtend);

    addMonkeypatch(BarItems.reverse_keyframes, null, "click", onReverseKeyframes);
}

export function unloadKeyframeOverrides() {
    //No-op for now since monkeypatches are unloaded automatically
}

interface GeckolibKeyframeOptions extends KeyframeOptions {
    easing: EasingKey
    easingArgs: number[] | null | undefined
}

// This subclass isn't strictly needed at runtime but was required to appease the compiler due to our monkeypatch
export class GeckolibBoneAnimator extends BoneAnimator {
    public addKeyframe(data: GeckolibKeyframeOptions, uuid?: string): _Keyframe {
        const keyframe = super.addKeyframe(data, uuid);

        if (data.bezier_left_time)
            keyframe.bezier_left_time = data.bezier_left_time;

        if (data.bezier_right_time)
            keyframe.bezier_right_time = data.bezier_right_time;

        if (data.bezier_right_value)
            keyframe.bezier_right_value = data.bezier_right_value;

        if (data.bezier_left_value)
            keyframe.bezier_left_value = data.bezier_left_value;

        return keyframe;
    }
}

function lerp(start: number, stop: number, amt: number) {
    return amt * (stop - start) + start;
}

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
function keyframeGetLerp(other, axis, amount, allow_expression) {
    const easing = other.easing || EASING_DEFAULT;
    if (Format.id !== GECKOLIB_MODEL_ID) {
        return Monkeypatches.get(Keyframe).getLerp.apply(this, arguments);
    }
    let easingFunc = easingFunctions[easing];
    if (isArgsEasing(easing)) {
        const arg1 = Array.isArray(other.easingArgs) && other.easingArgs.length > 0
            ? other.easingArgs[0]
            : getEasingArgDefault(other);
        // console.log(`keyframeGetLerp arg1: ${arg1}`);
        easingFunc = easingFunc.bind(null, arg1);
    }
    const easedAmount = easingFunc(amount);
    const start = this.data_points.length == 1 ? this.calc(axis) : this.calc(axis, 1);
    const stop = other.calc(axis);
    const result = lerp(start, stop, easedAmount);
    // console.log('keyframeGetLerp easing:', easing, 'arguments:', arguments, 'start:', start, 'stop:', stop, 'amount:', amount, 'easedAmount:', easedAmount, 'result:', result);
    if (Number.isNaN(result)) {
        throw new Error('batman');
    }
    return result;
}

function geckolibGetArray(data_point: number = 0) {
    const {easing, easingArgs, getArray} = this;
    let result = getArray.apply(this, [data_point]);
    if ((this as GeckolibKeyframe).bezier) {
        result = {vector: result, easing: "bezier", left: this.bezier_left_value, left_time: this.bezier_left_time, right: this.bezier_right_value, right_time: this.bezier_right_time};
    } else if (Format.id === GECKOLIB_MODEL_ID) {
        if (this.data_points.length != 1)
            result = {pre: result, post: getArray.apply(this, [1]), easing};
        else result = {vector: result, easing};
        if (isArgsEasing(easing)) result.easingArgs = easingArgs;
    }
    return result;
}


function keyframeCompileBedrock() {
    if (Format.id !== GECKOLIB_MODEL_ID || !this.transform) {
        return Monkeypatches.get(Keyframe).compileBedrockKeyframe.apply(this, arguments);
    }

    if (this.interpolation == 'catmullrom') {
        const previous = this.getPreviousKeyframe.apply(this)
        const include_pre = (!previous && this.time > 0) || (previous && previous.interpolation != 'catmullrom')
        return {
            pre: include_pre ? geckolibGetArray.call(this,[0]) : undefined,
            post: geckolibGetArray.call(this,[include_pre ? 1 : 0]),
            lerp_mode: this.interpolation,
        }
    } else if (this.data_points.length == 1) {
        return geckolibGetArray.call(this)
    } else {
        return geckolibGetArray.call(this,[0])
    }
}

function keyframeGetUndoCopy() {
    const {easing, easingArgs} = this;
    const result = Monkeypatches.get(Keyframe).getUndoCopy.apply(this, arguments);
    if (Format.id === GECKOLIB_MODEL_ID) {
        Object.assign(result, {easing});
        if (isArgsEasing(easing)) result.easingArgs = easingArgs;
    }
//   console.log('keyframeGetUndoCopy arguments:', arguments, 'this:', this, 'result:', result);
    return result;
}

function keyframeExtend(dataIn) {
    const data = Object.assign({}, dataIn);
//   console.log('keyframeExtend 1 arguments:', arguments);
    if (Format.id === GECKOLIB_MODEL_ID) {
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
    const result = Monkeypatches.get(Keyframe).extend.apply(this, arguments);
//   console.log('keyframeExtend 2 arguments:', arguments, 'this:', this, 'result:', result);
    return result;
}

function onReverseKeyframes() {
    Monkeypatches.get(BarItems.reverse_keyframes).click.apply(this, arguments);
    // console.log('@@@ onReverseKeyframes selected:', Timeline.selected);
    // There's not really an easy way to merge our undo operation with the original one so we'll make a new one instead
    Undo.initEdit({keyframes: Timeline.selected})
    const kfByAnimator = groupBy(Timeline.selected, kf => kf.animator.uuid);
    const kfByAnimatorAndChannel = mapValues(
        kfByAnimator,
        keyframesForAnimator => groupBy(keyframesForAnimator, kf => kf.channel)
    );
    Object.keys(kfByAnimatorAndChannel).forEach(animatorUuid => {
        const animatorChannelGroups = kfByAnimatorAndChannel[animatorUuid];
        Object.keys(animatorChannelGroups).forEach(channel => {
            const channelKeyframes = animatorChannelGroups[channel];
            // Ensure keyframes are in temporal order. Not sure if this is already the case, but it couldn't hurt
            channelKeyframes.sort((kfA, kfB) => kfA.time - kfB.time);
            // Reverse easing direction
            const easingData: EasingProperties[] = channelKeyframes.map((kf: GeckolibKeyframe) => ({
                easing: reverseEasing(kf.easing),
                easingArgs: kf.easingArgs
            }));
            // console.log('@@@ onReverseKeyframes PRE animator:', animatorUuid, 'channel:', channel, 'channelKeyframes:', channelKeyframes, 'easingData:', easingData);
            // Shift easing data to the right by one keyframe
            channelKeyframes.forEach((kf: GeckolibKeyframe, i: number) => {
                if (i == 0) {
                    kf.easing = undefined;
                    kf.easingArgs = undefined;
                    return;
                }
                const newEasingData = easingData[i - 1];
                kf.easing = newEasingData.easing;
                kf.easingArgs = newEasingData.easingArgs;
            });
            // console.log('@@@ onReverseKeyframes POST animator:', animatorUuid, 'channel:', channel, 'channelKeyframes:', channelKeyframes);
        });
    });
    // console.log('@@@ kfByAnimator:', kfByAnimator, "\nkfByAnimatorAndChannel:", kfByAnimatorAndChannel);
    Undo.finishEdit('Reverse keyframe easing')
    updateKeyframeSelection();
    Animator.preview();
}