import {
    addCodecCallback,
    addEventListener,
    addMonkeypatch, shouldShowDisplayPanel, isGeckoLibModel, Monkeypatches,
    onlyIfGeckoLib,
    removeCodecCallback,
    removeEventListener, removeMonkeypatches, determineModelType
} from "./utils";
import {GeckolibBoneAnimator} from "./keyframe";
import {
    BAKE_IN_BEZIER_KEYFRAMES,
    GeckoModelType,
    PROPERTY_FILEPATH_CACHE,
    PROPERTY_MODEL_TYPE, SETTING_ALWAYS_SHOW_DISPLAY,
    SETTING_REMEMBER_EXPORT_LOCATIONS
} from "./constants";
import {openProjectSettingsDialog} from "./codec";
import {GeckolibKeyframe} from "./easing";
import * as molang from "blockbench-types/generated/util/molang";

export function addEventListeners() {
    addCodecCallback(Codecs.project, 'parse', onlyIfGeckoLib(onProjectParse))
    addCodecCallback(Codecs.bedrock, 'compile', onlyIfGeckoLib(onBedrockCompile))
    addEventListener('select_mode', onlyIfGeckoLib(onModeSelect));
    addEventListener('select_project', onlyIfGeckoLib(onProjectSelect));
    addEventListener('update_project_settings', onlyIfGeckoLib(onSettingsChanged));
    addEventListener('save_project', onlyIfGeckoLib(onProjectSave));
    addMonkeypatch(Animator, null, "buildFile", monkeypatchAnimatorBuildFile);
    addMonkeypatch(Animator, null, "loadFile", monkeypatchAnimatorLoadFile);
    addMonkeypatch(Blockbench, null, "export", monkeypatchBlockbenchExport);
    addMonkeypatch(BarItems, 'project_window', "click", monkeypatchProjectWindowClick);
}

export function removeEventListeners() {
    removeCodecCallback(Codecs.project, 'parse', onlyIfGeckoLib(onProjectParse))
    removeCodecCallback(Codecs.bedrock, 'compile', onlyIfGeckoLib(onBedrockCompile))
    removeEventListener('select_mode', onlyIfGeckoLib(onModeSelect));
    removeEventListener('select_project', onlyIfGeckoLib(onProjectSelect));
    removeEventListener('update_project_settings', onlyIfGeckoLib(onSettingsChanged));
    removeMonkeypatches();
}

/**
 * When an existing GeckoLib project is being read from file
 */
function onProjectParse(e: any) {
    onSettingsChanged();

    if (!e.model[PROPERTY_MODEL_TYPE]) {
        e.model[PROPERTY_MODEL_TYPE] = determineModelType(e.model);
        Project.saved = false;
    }

    // Because the project hasn't had its model properties applied at this stage
    Format.display_mode = (e.model[PROPERTY_MODEL_TYPE] && e.model[PROPERTY_MODEL_TYPE] === GeckoModelType.ITEM) || settings[SETTING_ALWAYS_SHOW_DISPLAY].value;
}

/**
 * When the Blockbench project is being saved
 * <p>
 * Only called for GeckoLib projects
 */
function onProjectSave(e: {model: object, options: any }) {
    if (!e.model[PROPERTY_MODEL_TYPE])
        e.model[PROPERTY_MODEL_TYPE] = determineModelType(e.model);

    // Explicitly checked for undefined here because Blockbench attempts a save when removing the plugin
    if (settings[SETTING_REMEMBER_EXPORT_LOCATIONS] && !settings[SETTING_REMEMBER_EXPORT_LOCATIONS].value)
        e.model[PROPERTY_FILEPATH_CACHE] = {}
}

/**
 * When the GeckoLib project settings are changed, or a GeckoLib project is being opened or swapped to
 * <p>
 * Only called for GeckoLib projects
 */
function onSettingsChanged() {
    if (Modes.selected instanceof Mode)
        Modes.selected.select()

    Format.display_mode = shouldShowDisplayPanel();

    if (Project instanceof ModelProject && Project[PROPERTY_MODEL_TYPE] === GeckoModelType.ITEM && (!Project.parent || Project.parent !== 'builtin/entity')) {
        Project.parent = 'builtin/entity';
        Project.saved = false;
    }
}

/**
 * When opening a project tab, whether from an existing project, creating a new one, or swapping open tabs
 * <p>
 * Only called for GeckoLib projects
 */
function onProjectSelect() {
    onSettingsChanged()
}

/**
 * When selecting edit/paint/display/animate/etc
 * <p>
 * Only called for GeckoLib projects
 */
function onModeSelect(e: any) {
    // Offset the display emulator to account for GeckoLib's +0.51 manual offset
    // This is a legacy patch as Blockbench no longer does this internally
    if (e.mode.id == 'display')
        (Project as ModelProject).model_3d.position.y = 0;
}

/**
 * When the model geometry is being compiled for export
 * <p>
 * Only called for GeckoLib projects
 */
function onBedrockCompile(e: any) {
    // Remove display transforms from non-bedrock geometry
    e.model["minecraft:geometry"]?.forEach((geo: Map<string, any>) => delete geo["item_display_transforms"])

    // Force-suppress specific version advancement for non-bedrock models to prevent legacy version crashes until a better system is established
    switch (e.model.format_version) {
        case "1.14.0":
        case "1.21.0":
        case "1.21.20":
            e.model.format_version = "1.12.0"
            break;
        default:
            break;
    }
}

/**
 * When the project settings window is being opened, either via a new project or the File -> Project... menu item
 * <p>
 * The project <b><u>may not</u></b> be a GeckoLib project, so check it as necessary
 */
function monkeypatchProjectWindowClick() {
    if (isGeckoLibModel()) {
        openProjectSettingsDialog();
    }
    else {
       Monkeypatches.get(BarItems).click();
    }
}

/**
 * When any file is being exported to disk by Blockbench
 * <p>
 * The project <b><u>may not</u></b> be a GeckoLib project, so check it as necessary
 */
function monkeypatchBlockbenchExport(options, cb) {
    if (!isGeckoLibModel()) {
        Monkeypatches.get(Blockbench).export(options, cb);

        return;
    }

    if (Project instanceof ModelProject) {
        if (options.resource_id === 'animation' && options.type === 'JSON Animation') { // Animation JSON
            const fileName = Project.model_identifier && Project.model_identifier + ".animation";
            options.startpath = Project[PROPERTY_FILEPATH_CACHE].animation;
            const parentCallback = cb;
            cb = (file_path: string) => {
                if (parentCallback)
                    parentCallback(file_path);

                const oldPath = Project[PROPERTY_FILEPATH_CACHE].animation;
                Project[PROPERTY_FILEPATH_CACHE].animation = settings[SETTING_REMEMBER_EXPORT_LOCATIONS].value ? file_path : undefined;

                if (oldPath !== Project[PROPERTY_FILEPATH_CACHE].animation)
                    Project.saved = false;
            }

            if (fileName)
                options.name = fileName;
        }
        else if (options.resource_id === 'model' && options.type === 'Bedrock Model') { // Geo
            const fileName = Project.model_identifier && Project.model_identifier + ".geo";
            options.startpath = Project[PROPERTY_FILEPATH_CACHE].model;
            const parentWriter = options.custom_writer;
            const parentCallback = cb;

            if (parentWriter) {
                options.custom_writer = (content, filePath, callback) => {
                    parentWriter(content, filePath, callback);
                    callback(filePath)
                }
            }

            cb = file_path => {
                if (parentCallback)
                    parentCallback(file_path);

                const oldPath = Project[PROPERTY_FILEPATH_CACHE].model;
                Project[PROPERTY_FILEPATH_CACHE].model = settings[SETTING_REMEMBER_EXPORT_LOCATIONS].value ? file_path : undefined;

                if (oldPath !== Project[PROPERTY_FILEPATH_CACHE].model)
                    Project.saved = false;
            }

            if (fileName)
                options.name = fileName;
        }
    }

    Monkeypatches.get(Blockbench).export(options, cb);
}

/**
 * When the animation file is being loaded into the project
 * <p>
 * The project <b><u>may not</u></b> be a GeckoLib project, so check it as necessary
 */
function monkeypatchAnimatorLoadFile(file, exportingAnims) {
    // eslint-disable-next-line no-undef
    const json = file.json || autoParseJSON(file.content);
    const path = file.path;
    const new_animations = [];

    function geoLoopToBbLoop(jsonLoop) {
        if (jsonLoop) {
            if (typeof jsonLoop === 'boolean')
                return jsonLoop ? 'loop' : 'once'

            if (typeof jsonLoop === 'string') {
                if (jsonLoop === "hold_on_last_frame")
                    return 'hold'

                if (jsonLoop === "loop" || jsonLoop === "true")
                    return 'loop'
            }
        }

        return 'once'
    }

    function getKeyframeDataPoints(channel: string, source: any) {
        if (source instanceof Array)
            return invertAnimKeyframe(channel, [{x: source[0], y: source[1], z: source[2]}])

        if (['number', 'string'].includes(typeof source))
            return invertAnimKeyframe(channel, [{x: source, y: source, z: source}])

        if (typeof source == 'object') {
            if (source.vector)
                return getKeyframeDataPoints(channel, source.vector);

            const points = [];

            if (source.pre)
                points.push(getKeyframeDataPoints(channel, source.pre)[0])

            if (source.post)
                points.push(getKeyframeDataPoints(channel, source.post)[0])

            return points;
        }
    }

    // Because Blockbench now implicitly inverts rotation and position keyframes on export and import (??)
    function invertAnimKeyframe(channel: string, value: any) {
        if (channel != 'position' && channel != 'rotation')
            return value;

        if (value instanceof Array) {
            switch (value.length) {
                case 1: return [invertAnimKeyframe(channel, value[0])];
                case 3: return [invertAnimKeyframe(channel, value[0]), channel == 'rotation' ? invertAnimKeyframe(channel, value[1]) : value[1], value[2]];
                default: return value;
            }
        }
        else if (typeof value == 'object') {
            if (value.x)
                value.x = invertMolang(value.x);

            if (value.y && channel == 'rotation')
                value.y = invertMolang(value.y);

            return value;
        }

        return invertMolang(value);
    }

    if (json && typeof json.animations === 'object') {
        for (const animName in json.animations) {
            if (exportingAnims && !exportingAnims.includes(animName))
                continue;

            //Animation
            const animData = json.animations[animName]
            let animation: any = new Animation({
                name: animName,
                path,
                loop: geoLoopToBbLoop(animData.loop),
                override: animData.override_previous_animation,
                anim_time_update: (typeof animData.anim_time_update == 'string'
                    ? animData.anim_time_update.replace(/;(?!$)/, ';\n')
                    : animData.anim_time_update),
                blend_weight: (typeof animData.blend_weight == 'string'
                    ? animData.blend_weight.replace(/;(?!$)/, ';\n')
                    : animData.blend_weight),
                length: animData.animation_length
            } as any)

            animation = animation.add()

            //Bones
            if (animData.bones) {
                for (const boneName in animData.bones) {
                    const bone = animData.bones[boneName]
                    const lowercase_bone_name = boneName.toLowerCase();
                    const group = Group.all.find(group => group.name.toLowerCase() == lowercase_bone_name)
                    const uuid = group ? group.uuid : guid();

                    const boneAnimator = new GeckolibBoneAnimator(uuid, animation, boneName);
                    animation.animators[uuid] = boneAnimator;
                    //Channels
                    for (const channel in bone) {
                        if (Animator.possible_channels[channel]) {
                            if (typeof bone[channel] === 'string' || typeof bone[channel] === 'number' || bone[channel] instanceof Array) {
                                boneAnimator.addKeyframe({
                                    time: 0,
                                    channel,
                                    easing: bone[channel]["easing"],
                                    easingArgs: bone[channel]["easingArgs"],
                                    data_points: getKeyframeDataPoints(channel, bone[channel]),
                                })
                            }
                            else if (typeof bone[channel] === 'object' && bone[channel].post) {
                                boneAnimator.addKeyframe({
                                    time: 0,
                                    channel,
                                    easing: bone[channel].easing == "bezier" ? undefined : bone[channel].easing,
                                    easingArgs: bone[channel]["easingArgs"],
                                    interpolation: bone[channel].easing == "bezier" ? "bezier" : bone[channel].lerp_mode,
                                    data_points: getKeyframeDataPoints(channel, bone[channel]),
                                    bezier_right_time: bone[channel].right_time,
                                    bezier_left_time: bone[channel].left_time,
                                    bezier_left_value: bone[channel].left,
                                    bezier_right_value: bone[channel].right
                                });
                            }
                            else if (typeof bone[channel] === 'object') {
                                for (const timestamp in bone[channel]) {
                                    boneAnimator.addKeyframe({
                                        time: parseFloat(timestamp),
                                        channel,
                                        easing: bone[channel][timestamp].easing == "bezier" ? undefined : bone[channel][timestamp].easing,
                                        easingArgs: bone[channel][timestamp].easingArgs,
                                        interpolation: bone[channel][timestamp].easing == "bezier" ? "bezier" : bone[channel][timestamp].lerp_mode,
                                        data_points: getKeyframeDataPoints(channel, bone[channel][timestamp]),
                                        bezier_right_time: bone[channel][timestamp].right_time,
                                        bezier_left_time: bone[channel][timestamp].left_time,
                                        bezier_left_value: bone[channel][timestamp].left,
                                        bezier_right_value: bone[channel][timestamp].right
                                    });
                                }
                            }
                        }
                    }
                }
            }

            if (animData.sound_effects) {
                if (!animation.animators.effects)
                    animation.animators.effects = new EffectAnimator(null, animation, animName);

                for (const timestamp in animData.sound_effects) {
                    const sounds = animData.sound_effects[timestamp];

                    animation.animators.effects.addKeyframe({
                        channel: 'sound',
                        time: parseFloat(timestamp),
                        data_points: sounds instanceof Array ? sounds : [sounds]
                    })
                }
            }

            if (animData.particle_effects) {
                if (!animation.animators.effects)
                    animation.animators.effects = new EffectAnimator(null, animation, animName);

                for (const timestamp in animData.particle_effects) {
                    let particles = animData.particle_effects[timestamp];

                    if (!(particles instanceof Array))
                        particles = [particles];

                    particles.forEach(particle => {
                        if (particle)
                            particle.script = particle.pre_effect_script;
                    })

                    animation.animators.effects.addKeyframe({
                        channel: 'particle',
                        time: parseFloat(timestamp),
                        data_points: particles
                    })
                }
            }

            if (animData.timeline) {
                if (!animation.animators.effects)
                    animation.animators.effects = new EffectAnimator(null, animation, animName);

                for (const timestamp in animData.timeline) {
                    const entry = animData.timeline[timestamp];
                    const script = entry instanceof Array ? entry.join('\n') : entry;

                    animation.animators.effects.addKeyframe({
                        channel: 'timeline',
                        time: parseFloat(timestamp),
                        data_points: [{script}]
                    })
                }
            }

            animation.calculateSnappingFromKeyframes();

            if (!Animator.selected && Animator.open)
                animation.select()

            new_animations.push(animation)
        }
    }

    return new_animations
}

/**
 * When the animations JSON is being compiled for export
 * <p>
 * Makes sure bezier keyframes get exported correctly rather than being baked.
 */
function monkeypatchAnimatorBuildFile() {
    const bezierKeys:GeckolibKeyframe[] = [];

    if (isGeckoLibModel() && !settings[BAKE_IN_BEZIER_KEYFRAMES].value) {
        const arg = arguments[1][0];
        const animation = this.animations.find(anim => anim.name == arg);

        if (animation) {
            for (const uuid in animation.animators) {
                const animator = animation.animators[uuid];

                if (!animator.keyframes.length && !animator.rotation_global)
                    continue;

                if (animator.type == 'bone') {
                    for (const channel in Animator.possible_channels) {
                        if (!animator[channel]?.length)
                            continue;

                        const sorted_keyframes = animator[channel].slice().sort((a, b) => a.time - b.time);

                        sorted_keyframes.forEach((kf: GeckolibKeyframe) => {
                            if (kf.interpolation == "bezier") {
                                bezierKeys[bezierKeys.length] = kf;
                                kf.bezier = true;
                            }
                        });
                    }
                }
            }
        }
    }

    const result = Monkeypatches.get(Animator).buildFile.apply(this, arguments);

    if (isGeckoLibModel() && !settings[BAKE_IN_BEZIER_KEYFRAMES].value) {
        result.geckolib_format_version = 2

        bezierKeys.forEach((kf) => {
            kf.bezier = false;
            kf.easing = undefined;
        });
    }

    return result;
}