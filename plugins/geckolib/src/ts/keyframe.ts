import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import {addMonkeypatch, Monkeypatches} from './utils';
import {
    EASING_DEFAULT,
    easingFunctions,
    type EasingKey,
    EasingProperties,
    GeckolibKeyframe,
    getEasingArgDefault,
    isArgsEasing,
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
    if (Format.id !== GECKOLIB_MODEL_ID)
        return Monkeypatches.get(Keyframe).getLerp.apply(this, arguments);

    const easing = other.easing || EASING_DEFAULT;
    let easingFunc = easingFunctions[easing];

    if (isArgsEasing(easing)) {
        const easingValue = Array.isArray(other.easingArgs) && other.easingArgs.length > 0
            ? other.easingArgs[0]
            : getEasingArgDefault(other);
        easingFunc = easingFunc.bind(null, easingValue);
    }

    const easedAmount = easingFunc(amount);
    const start = this.data_points.length == 1 ? this.calc(axis) : this.calc(axis, 1);
    const stop = other.calc(axis);
    const result = lerp(start, stop, easedAmount);

    if (Number.isNaN(result))
        throw new Error('batman');

    return result;
}

// Calculate GeckoLib's keyframe values in place of the built-in Bedrock compiler.
// Additionally, invert the keyframe to match Blockbench's internal handling
function geckolibGetArray(data_point: number, channel: string) {
    const {easing, easingArgs, getArray} = this;
    let result = getArray.apply(this, [data_point]);

    if ((this as GeckolibKeyframe).bezier) {
        result = {vector: result, easing: "bezier", left: this.bezier_left_value, left_time: this.bezier_left_time, right: this.bezier_right_value, right_time: this.bezier_right_time};
    }
    else if (Format.id === GECKOLIB_MODEL_ID) {
        if (this.data_points.length != 1) {
            const postResult = getArray.apply(this, [1]);

            if (!easing && result[0] === postResult[0] && result[1] === postResult[1] && result[2] === postResult[2]) {
                result = {vector: result, easing};
            }
            else {
                result = {
                    pre: checkAndPatchKeyframeValues(result, channel),
                    post: checkAndPatchKeyframeValues(getArray.apply(this, [1]), channel), easing
                };
            }
        }
        else {
            result = {vector: result, easing};
        }

        if (isArgsEasing(easing))
            result.easingArgs = easingArgs;
    }

    if (result.vector)
        result.vector = checkAndPatchKeyframeValues(result.vector, channel);

    return result;
}

// Invert the molang value to match Blockbench's internal handling
// Also swap out empty molang queries because Blockbench now sends them as empty quotes for some reason
function checkAndPatchKeyframeValues(vector: any[], channel: string) {
    for (let i = 0; i <= 2; i++) {
        if (vector[i] === "")
            vector[i] = 0;
    }
    
    if (channel === 'rotation' || channel === 'position') {
        vector[0] = invertMolang(vector[0]);

        if (channel === 'rotation')
            vector[1] = invertMolang(vector[1]);
    }
    
    return vector;
}

// Replace the bedrock keyframe compilation with a custom handler
function keyframeCompileBedrock() {
    if (Format.id !== GECKOLIB_MODEL_ID || !this.transform)
        return Monkeypatches.get(Keyframe).compileBedrockKeyframe.apply(this, arguments);

    if (this.interpolation == 'catmullrom') {
        const previous = this.getPreviousKeyframe.apply(this);
        const include_pre = (!previous && this.time > 0) || (previous && previous.interpolation != 'catmullrom');

        return {
            pre: include_pre ? geckolibGetArray.call(this, [0], this.channel) : undefined,
            post: geckolibGetArray.call(this, [include_pre ? 1 : 0], this.channel),
            lerp_mode: this.interpolation,
        }
    }

    if (this.data_points.length == 1)
        return geckolibGetArray.call(this, 0, this.channel);

    return geckolibGetArray.call(this, [0], this.channel);
}

function keyframeGetUndoCopy() {
    const {easing, easingArgs} = this;
    const result = Monkeypatches.get(Keyframe).getUndoCopy.apply(this, arguments);

    if (Format.id === GECKOLIB_MODEL_ID) {
        Object.assign(result, {easing});

        if (isArgsEasing(easing))
            result.easingArgs = easingArgs;
    }

    return result;
}

// Append GeckoLib data to Keyframes when constructed
function keyframeExtend(dataIn) {
    const data = Object.assign({}, dataIn);

    if (Format.id === GECKOLIB_MODEL_ID) {
        if (typeof data.values === 'object') {
            if (data.values.easing !== undefined)
                Merge.string(this, data.values, 'easing');

            if (Array.isArray(data.values.easingArgs))
                this.easingArgs = data.values.easingArgs;

            if (!Array.isArray(data.values) && Array.isArray(data.values.vector)) {
                // Convert data to format expected by KeyframeExtendOriginal
                data.values = data.values.vector;
            }
        }
        else {
            if (data.easing !== undefined)
                Merge.string(this, data, 'easing');

            if (Array.isArray(data.easingArgs))
                this.easingArgs = data.easingArgs;
        }
    }

    return Monkeypatches.get(Keyframe).extend.apply(this, arguments);
}

// Inject GeckoLib support for the reverse keyframes feature
function onReverseKeyframes() {
    Monkeypatches.get(BarItems.reverse_keyframes).click.apply(this, arguments);

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
        });
    });

    Undo.finishEdit('Reverse keyframe easing')
    updateKeyframeSelection();
    Animator.preview();
}