import omit from 'lodash/omit';
import geckoSettings, {GECKO_SETTINGS_DEFAULT, onSettingsChanged} from './settings';
import {addMonkeypatch, Original} from './utils';
import type { EasingKey } from './easing';

interface GeckolibKeyframeOptions extends KeyframeOptions {
  easing: EasingKey
  easingArgs: number[] | null | undefined
}

// This subclass isn't strictly needed at runtime but was required to appease the compiler due to our monkeypatch
class GeckolibBoneAnimator extends BoneAnimator {
    public addKeyframe(data: GeckolibKeyframeOptions, uuid?: string): _Keyframe {
        return super.addKeyframe(data, uuid);
    }
}

/* eslint-disable no-useless-escape */

//#region Codec Helpers / Export Settings

export function loadCodec() {
    // The actual Codec is automatically registered by superclass constructor
    Codecs.project.on('compile', onProjectCompile);
    Codecs.project.on('parse', onProjectParse);
    Codecs.bedrock.on('compile', onBedrockCompile);
    addMonkeypatch(Animator, null, "buildFile", animatorBuildFile);
    addMonkeypatch(Animator, null, "loadFile", animatorLoadFile);
}

export function unloadCodec() {
    Codecs.project.removeListener('compile', onProjectCompile);
    Codecs.project.removeListener('parse', onProjectParse);
    Codecs.bedrock.removeListener('compile', onBedrockCompile);
    format.delete();
}

function onProjectCompile(e: any) {
    if (Format.id !== "animated_entity_model") return;
    e.model.geckoSettings = geckoSettings;
    // console.log(`compileCallback model:`, e.model);
}

function onProjectParse(e: any) {
    // console.log(`onProjectParse:`, e);
    if (e.model && typeof e.model.geckoSettings === 'object') {
        Object.assign(geckoSettings, omit(e.model.geckoSettings, ['formatVersion']));
    } else {
        Object.assign(geckoSettings, GECKO_SETTINGS_DEFAULT);
    }
    onSettingsChanged();
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onBedrockCompile(e: any) {
    // console.log('onBedrockCompile e:', e);
    // maybeExportItemJson(e.options);
}

function animatorBuildFile() {
    const res = Original.get(Animator).buildFile.apply(this, arguments);
    if (Format.id === "animated_entity_model") {
        Object.assign(
            res,
            {
                'geckolib_format_version': geckoSettings.formatVersion,
            }
        );
    }
    // console.log('animatorBuildFile res:', res);
    return res;
}

function getKeyframeDataPoints(source: any) {
    if (source instanceof Array) {
        return [{
            x: source[0],
            y: source[1],
            z: source[2],
        }]
    } else if (['number', 'string'].includes(typeof source)) {
        return [{
            x: source, y: source, z: source
        }]
    } else if (typeof source == 'object') {
        if(source.vector)
        {
            return getKeyframeDataPoints(source.vector);
        }
        const points = [];
        if (source.pre) {
            points.push(getKeyframeDataPoints(source.pre)[0])
        }
        if (source.post) {
            points.push(getKeyframeDataPoints(source.post)[0])
        }
        return points;
    }
}

function animatorLoadFile(file, animation_filter) {
    // Currently no modifications are needed
    // eslint-disable-next-line no-undef
    const json = file.json || autoParseJSON(file.content);
    const path = file.path;
    const new_animations = [];
    if (json && typeof json.animations === 'object') {
        for (const ani_name in json.animations) {
            if (animation_filter && !animation_filter.includes(ani_name)) continue;
            //Animation
            const a = json.animations[ani_name]
            const animation = new Blockbench.Animation({
                name: ani_name,
                path,
                // TODO: Make sure it's OK to disable this line
                // loop: a.loop && (a.loop == 'hold_on_last_frame' ? 'hold' : 'loop'),
                loop: a.loop,
                override: a.override_previous_animation,
                anim_time_update: (typeof a.anim_time_update == 'string'
                    ? a.anim_time_update.replace(/;(?!$)/, ';\n')
                    : a.anim_time_update),
                blend_weight: (typeof a.blend_weight == 'string'
                    ? a.blend_weight.replace(/;(?!$)/, ';\n')
                    : a.blend_weight),
                length: a.animation_length
            }).add()
            //Bones
            if (a.bones) {
                for (const bone_name in a.bones) {
                    const b = a.bones[bone_name]
                    const lowercase_bone_name = bone_name.toLowerCase();
                    const group = Group.all.find(group => group.name.toLowerCase() == lowercase_bone_name)
                    const uuid = group ? group.uuid : guid();
                    let ga : GeneralAnimator; // eslint-disable-line @typescript-eslint/no-unused-vars

                    const ba = new GeckolibBoneAnimator(uuid, animation, bone_name);
                    animation.animators[uuid] = ba;
                    //Channels
                    for (const channel in b) {
                        if (Animator.possible_channels[channel]) {
                            if (typeof b[channel] === 'string' || typeof b[channel] === 'number' || b[channel] instanceof Array) {
                                ba.addKeyframe({
                                    time: 0,
                                    channel,
                                    easing: b[channel].easing,
                                    easingArgs: b[channel].easingArgs,
                                    data_points: getKeyframeDataPoints(b[channel]),
                                })
                            } else if (typeof b[channel] === 'object' && b[channel].post) {
                                ba.addKeyframe({
                                    time: 0,
                                    channel,
                                    easing: b[channel].easing,
                                    easingArgs: b[channel].easingArgs,
                                    interpolation: b[channel].lerp_mode,
                                    data_points: getKeyframeDataPoints(b[channel]),
                                });
                            } else if (typeof b[channel] === 'object') {
                                for (const timestamp in b[channel]) {
                                    ba.addKeyframe({
                                        time: parseFloat(timestamp),
                                        channel,
                                        easing: b[channel][timestamp].easing,
                                        easingArgs: b[channel][timestamp].easingArgs,
                                        interpolation: b[channel][timestamp].lerp_mode,
                                        data_points: getKeyframeDataPoints(b[channel][timestamp]),
                                    });
                                }
                            }
                        }
                    }
                }
            }
            if (a.sound_effects) {
                if (!animation.animators.effects) {
                    animation.animators.effects = new EffectAnimator(animation);
                }
                for (const timestamp0 in a.sound_effects) {
                    let sounds = a.sound_effects[timestamp0];
                    if (sounds instanceof Array === false) sounds = [sounds];
                    animation.animators.effects.addKeyframe({
                        channel: 'sound',
                        time: parseFloat(timestamp0),
                        data_points: sounds
                    })
                }
            }
            if (a.particle_effects) {
                if (!animation.animators.effects) {
                    animation.animators.effects = new EffectAnimator(animation);
                }
                for (const timestamp1 in a.particle_effects) {
                    let particles = a.particle_effects[timestamp1];
                    if (particles instanceof Array === false) particles = [particles];
                    particles.forEach(particle => {
                        if (particle) particle.script = particle.pre_effect_script;
                    })
                    animation.animators.effects.addKeyframe({
                        channel: 'particle',
                        time: parseFloat(timestamp1),
                        data_points: particles
                    })
                }
            }
            if (a.timeline) {
                if (!animation.animators.effects) {
                    animation.animators.effects = new EffectAnimator(animation);
                }
                for (const timestamp2 in a.timeline) {
                    const entry = a.timeline[timestamp2];
                    const script = entry instanceof Array ? entry.join('\n') : entry;
                    animation.animators.effects.addKeyframe({
                        channel: 'timeline',
                        time: parseFloat(timestamp2),
                        data_points: [{script}]
                    })
                }
            }
            animation.calculateSnappingFromKeyframes();
            if (!Blockbench.Animation.selected && Animator.open) {
                animation.select()
            }
            new_animations.push(animation)
        }
    }
    return new_animations
}

//#endregion Codec Helpers / Export Settings

//#region Codec / ModelFormat
export function maybeExportItemJson(options = {}) {
    function checkExport(key, condition) {
        key = options[key]
        if (key === undefined) {
            return condition;
        } else {
            return key
        }
    }

    if (!Project) return;

    const blockmodel: any = {}
    if (checkExport('comment', settings.credit.value)) {
        blockmodel.credit = settings.credit.value
    }
    if (checkExport('parent', Project.parent != '')) {
        blockmodel.parent = Project.parent
    }
    if (checkExport('ambientocclusion', Project.ambientocclusion === false)) {
        blockmodel.ambientocclusion = false
    }
    if (Project.texture_width !== 16 || Project.texture_height !== 16) {
        blockmodel.texture_size = [Project.texture_width, Project.texture_height]
    }
    if (checkExport('front_gui_light', Project.front_gui_light)) {
        blockmodel.gui_light = 'front';
    }
    if (checkExport('overrides', Project.overrides)) {
        blockmodel.overrides = Project.overrides;
    }
    if (checkExport('display', Object.keys(Project.display_settings).length >= 1)) {
        const new_display = {}
        let entries = 0;
        for (const i in DisplayMode.slots) {
            const key = DisplayMode.slots[i]
            // eslint-disable-next-line no-prototype-builtins
            if (DisplayMode.slots.hasOwnProperty(i) && Project.display_settings[key] && Project.display_settings[key].export) {
                new_display[key] = Project.display_settings[key].export()
                entries++;
            }
        }
        if (entries) {
            blockmodel.display = new_display
        }
    }

    const blockmodelString = JSON.stringify(blockmodel, null, 2);

    const scope = codec;

    const path = geckoSettings.itemModelPath;

    Blockbench.export({
        resource_id: 'model',
        type: Codecs.java_block.name,
        extensions: ['json'],
        name: scope.fileName().replace(".geo", ".item"),
        startpath: path,
        content: blockmodelString,
    }, (real_path) => {
        geckoSettings.itemModelPath = real_path;
    });

    return this;
}

const codec = Codecs.bedrock;

const format = new ModelFormat({
    id: "animated_entity_model",
    name: "GeckoLib Animated Model",
    category: "minecraft",
    description: "Animated Model for Java mods using GeckoLib",
    icon: "view_in_ar",
    rotate_cubes: true,
    box_uv: true,
    optional_box_uv: true,
    single_texture: true,
    bone_rig: true,
    centered_grid: true,
    animated_textures: true,
    animation_mode: true,
    animation_files: true,
    locators: true,
    codec: Codecs.project, // This sets what codec is used for File -> Save. We want to use bbmodel.
    display_mode: false, // This may be dynamically turned on by settings
    onActivation: function () {
    }
})

//Object.defineProperty(format, 'integer_size', {get: _ => Templates.get('integer_size')})
// codec.format = format; // This sets the default format for the codec

export default codec; // This is used for plugin "Export Animated Model" menu item

//#endregion Codec / ModelFormat