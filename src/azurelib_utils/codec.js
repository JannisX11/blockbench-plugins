/**
 * This module is a fork of the GeckoLib Animation Utils plugin and modified for use in the Azurelib fork.
 * Original source:
 * https://github.com/JannisX11/blockbench-plugins/tree/034ed058efa5b2847fb852e3b215aad372080dcf/src/animation_utils 
 * Copyright © 2024 Bernie-G. Licensed under the MIT License.
 * https://github.com/JannisX11/blockbench-plugins/blob/main/LICENSE
 */

import omit from 'lodash/omit';
import azurelibSettings, {AZURELIB_SETTINGS_DEFAULT, onSettingsChanged} from './settings';
import {addMonkeypatch, Original} from './utils';
import { invertMolang as localInvertMolang } from './utils';

const invertMolang = globalThis.invertMolang || localInvertMolang;

let hasShownConversionNotice = false;

/* eslint-disable no-useless-escape */

//#region Codec Helpers / Export Settings

export function loadCodec() {
    // The actual Codec is automatically registered by superclass constructor
    Codecs.project.on('compile', onProjectCompile);
    Codecs.project.on('parse', onProjectParse);
    Codecs.bedrock.on('compile', onBedrockCompile);
    addMonkeypatch(Animator, null, "buildFile", animatorBuildFile);
    addMonkeypatch(Animator, null, "loadFile", animatorLoadFile);
	
    Blockbench.on('close_project', () => {
        Object.assign(azurelibSettings, AZURELIB_SETTINGS_DEFAULT);
        hasShownConversionNotice = false;
        console.log('[AzureLib] Project closed → reset settings to defaults');
    });
    
    Blockbench.on('new_project', () => {
        Object.assign(azurelibSettings, AZURELIB_SETTINGS_DEFAULT);
        hasShownConversionNotice = false;
        console.log('[AzureLib] New project → defaults restored');
    });
}

export function unloadCodec() {
    Codecs.project.events.compile.remove(onProjectCompile)
    Codecs.project.events.parse.remove(onProjectParse)
    Codecs.bedrock.events.compile.remove(onBedrockCompile)
    format.delete();
}

function onModeSelect(e) {
    if (e.mode.id === 'display' && Format.id === 'azure_model') {
        Project.model_3d.position.y = 0;
    }
}

function onProjectCompile(e) {
    if (Format.id !== "azure_model") return;

    if (azurelibSettings.objectType === "AZURE_ITEM_BLOCK") {
        azurelibSettings.objectType = "AZURE_ENTITY";
        azurelibSettings.entityType = "Entity/Block/Item";
    }
    e.model.azurelibSettings = azurelibSettings;
}

function onProjectParse(e) {
    const model = e.model || {};
    const metaFormat = model?.meta?.model_format || model?.model_format;
    
    if (metaFormat !== "azure_model") return;
    
    const settings = model.azurelibSettings;
    if (settings && typeof settings === "object") {
      const wasDeprecatedType = settings.objectType === "AZURE_ITEM_BLOCK";
    
      Object.assign(azurelibSettings, omit(settings, ["formatVersion"]));
    
      if (wasDeprecatedType) {
        console.warn("[AzureLib] Converting deprecated AZURE_ITEM_BLOCK to AZURE_ENTITY");
        azurelibSettings.objectType = "AZURE_ENTITY";
        azurelibSettings.entityType = "Entity/Block/Item";
      }
    
      console.log("[AzureLib] Loaded settings for", azurelibSettings.objectType);
    
      if (wasDeprecatedType && !hasShownConversionNotice) {
        hasShownConversionNotice = true;
        Blockbench.showMessageBox({
          title: 'AzureLib Conversion Notice',
          message:
            'This project used the old "Block/Item" model type.\n\nIt has been automatically updated to the new "Entity/Block/Item" type (AZURE_ENTITY).',
          buttons: ['OK']
        });
      }
    
      onSettingsChanged();
    } else {
      if (e.model?.meta?.model_format === "azure_model" && !e.model.azurelibSettings) {
        console.debug("[AzureLib] Azure model detected but no settings yet — likely early parse.");
      }
    }
}

function onBedrockCompile(e) {
    if (Format.id !== "azure_model") return;

    const geometry = e.model?.["minecraft:geometry"];
    if (geometry) {
        geometry.forEach((geo) => {
            delete geo.item_display_transforms;
        });
    }
}

function animatorBuildFile() {
    const res = Original.get(Animator).buildFile.apply(this, arguments);

    if (Format.id !== "azure_model") return res;

    Object.assign(res, {
        'azurelib_format_version': azurelibSettings.formatVersion,
    });

    const animations = res.animations;
    if (!animations) return res;

    // helper function for inverting arrays
    const flipArray = (array, channel) => {
        if (!Array.isArray(array)) return array;

        if (channel === 'position') {
            array[0] = invertMolang(array[0]);
        }
        if (channel === 'rotation') {
            array[0] = invertMolang(array[0]);
            array[1] = invertMolang(array[1]);
        }
        return array;
    };

    for (const animation in animations) {
        const bones = animations[animation]?.bones;
        if (!bones) continue;

        for (const boneName in bones) {
            const bone = bones[boneName];
            for (const animationGroupType in bone) { // ← This is your channel name
                const animationGroup = bone[animationGroupType];
                for (const timestamp in animationGroup) {
                    const keyframe = animationGroup[timestamp];
                    
                    if (!keyframe) continue;

                    if (keyframe["lerp_mode"]) delete keyframe["lerp_mode"];

                    let bedrockKeyframeData = keyframe["pre"] || keyframe["post"];
                    if (bedrockKeyframeData) {
                        Object.assign(keyframe, bedrockKeyframeData);
                    }
                    delete keyframe["pre"];
                    delete keyframe["post"];
												
                    // Apply inversion fix (Blockbench 5.0+ compatibility)
					if (Blockbench.isNewerThan('4.99')) {
                        if (Array.isArray(keyframe)) {
                            flipArray(keyframe, animationGroupType);
                        } else if (Array.isArray(keyframe.vector)) {
                            keyframe.vector = flipArray(keyframe.vector, animationGroupType);
                        } else if (
                            keyframe.x !== undefined ||
                            keyframe.y !== undefined ||
                            keyframe.z !== undefined
                        ) {
                            // handle object-style keyframes
                            if (animationGroupType === 'rotation') {
                                keyframe.x = invertMolang(keyframe.x);
                                keyframe.y = invertMolang(keyframe.y);
                            } else if (animationGroupType === 'position') {
                                keyframe.x = invertMolang(keyframe.x);
                            }
                        }
					}
                }
            }
        }
    }

    return res;
}

function animatorLoadFile(file, animation_filter) {
    if (Format?.id !== "azure_model") {
        return Original.get(Animator).loadFile.apply(this, arguments);
    }
    var json = file.json || autoParseJSON(file.content);
    let path = file.path;
    let new_animations = [];
    if (!json || typeof json.animations !== 'object') return new_animations;
    
    function getKeyframeDataPoints(source, channel) {
        const applyFlip = (vec, channel) => {
            if (!vec) return vec;
            if (channel === 'position') {
                vec.x = invertMolang(vec.x);
            } else if (channel === 'rotation') {
                vec.x = invertMolang(vec.x);
                vec.y = invertMolang(vec.y);
            }
            return vec;
        };
    
        // Apply inversion fix (Blockbench 5.0+ compatibility)
        if (Array.isArray(source) && Blockbench.isNewerThan('4.99')) {
            let vec = { x: source[0], y: source[1], z: source[2] };
            applyFlip(vec, channel);
            return [vec];
        } else if (typeof source === 'number' || typeof source === 'string') {
            return [{ x: source, y: source, z: source }];
        } else if (source && typeof source === 'object') {
            if (Array.isArray(source.vector)) {
                return getKeyframeDataPoints(source.vector, channel);
            }
            let points = [];
            if (source.pre) {
                points.push(getKeyframeDataPoints(source.pre, channel)[0]);
            }
            if (source.post) {
                const postPoint = getKeyframeDataPoints(source.post, channel)[0];
                if (!(Array.isArray(source.pre) && Array.isArray(source.post) && source.post.equals && source.post.equals(source.pre))) {
                    points.push(postPoint);
                } else if (!points.length) {
                    points.push(postPoint);
                }
            }
            return points.length ? points : undefined;
        }
        return undefined;
    }
    
    for (var ani_name in json.animations) {
        if (animation_filter && !animation_filter.includes(ani_name)) continue;
    
        var a = json.animations[ani_name];
        var animation = new Animation({
            name: ani_name,
            path,
            loop: a.loop && (a.loop == 'hold_on_last_frame' ? 'hold' : 'loop'),
            override: a.override_previous_animation,
            anim_time_update: (typeof a.anim_time_update == 'string'
                ? a.anim_time_update.replace(/;(?!$)/, ';\n')
                : a.anim_time_update),
            blend_weight: (typeof a.blend_weight == 'string'
                ? a.blend_weight.replace(/;(?!$)/, ';\n')
                : a.blend_weight),
            length: a.animation_length
        }).add();
    
        if (a.bones) {
            for (var bone_name in a.bones) {
                var b = a.bones[bone_name];
                let lowercase_bone_name = bone_name.toLowerCase();
                var group = Group.all.find(group => group.name.toLowerCase() == lowercase_bone_name);
                let uuid = group ? group.uuid : guid();
    
                var ba = new BoneAnimator(uuid, animation, bone_name);
                animation.animators[uuid] = ba;
    
                for (var channel in b) {
                    if (!Animator.possible_channels[channel]) continue;
    
                    const src = b[channel];
                    const addKF = (time, srcObj) => {
                        const kf_points = getKeyframeDataPoints(srcObj, channel);
                        if (!kf_points) return;
    
                        ba.addKeyframe({
                            time,
                            channel,
                            easing: srcObj?.easing ?? (src?.easing),
                            easingArgs: Array.isArray(srcObj?.easingArgs) ? srcObj.easingArgs : (Array.isArray(src?.easingArgs) ? src.easingArgs : undefined),
                            interpolation: srcObj?.lerp_mode,
                            uniform: !(Array.isArray(srcObj) || Array.isArray(srcObj?.vector)),
                            data_points: kf_points,
                        });
                    };
    
                    if (typeof src === 'string' || typeof src === 'number' || Array.isArray(src)) {
                        addKF(0, src);
    
                    } else if (src && typeof src === 'object') {
                        if (src.post || src.pre || src.vector !== undefined) {
                            addKF(0, src);
                        } else {
                            for (var timestamp in src) {
                                const node = src[timestamp];
                                addKF(parseFloat(timestamp), node);
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
            for (var ts0 in a.sound_effects) {
                var sounds = a.sound_effects[ts0];
                if (!Array.isArray(sounds)) sounds = [sounds];
                animation.animators.effects.addKeyframe({
                    channel: 'sound',
                    time: parseFloat(ts0),
                    data_points: sounds
                });
            }
        }
        if (a.particle_effects) {
            if (!animation.animators.effects) {
                animation.animators.effects = new EffectAnimator(animation);
            }
            for (var ts1 in a.particle_effects) {
                var particles = a.particle_effects[ts1];
                if (!Array.isArray(particles)) particles = [particles];
                particles.forEach(particle => {
                    if (particle) particle.script = particle.pre_effect_script;
                });
                animation.animators.effects.addKeyframe({
                    channel: 'particle',
                    time: parseFloat(ts1),
                    data_points: particles
                });
            }
        }
        if (a.timeline) {
            if (!animation.animators.effects) {
                animation.animators.effects = new EffectAnimator(animation);
            }
            for (var ts2 in a.timeline) {
                var entry = a.timeline[ts2];
                var script = Array.isArray(entry) ? entry.join('\n') : entry;
                animation.animators.effects.addKeyframe({
                    channel: 'timeline',
                    time: parseFloat(ts2),
                    data_points: [{ script }]
                });
            }
        }
    
        animation.calculateSnappingFromKeyframes();
        if (!Animation.selected && Animator.open) {
            animation.select();
        }
        new_animations.push(animation);
    }
    return new_animations;
}

//#endregion Codec Helpers / Export Settings

//#region Codec / ModelFormat
export function maybeExportItemJson(options = {}, as) {
    function checkExport(key, condition) {
        key = options[key]
        if (key === undefined) {
            return condition;
        } else {
            return key
        }
    }

    const blockmodel = {}
    if (checkExport('comment', settings.credit.value)) {
        blockmodel.credit = settings.credit.value
    }
    blockmodel.parent = 'builtin/entity'
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
        var new_display = {}
        var entries = 0;
        for (var i in DisplayMode.slots) {
		    var key = DisplayMode.slots[i]
		    if (DisplayMode.slots.hasOwnProperty(i) && Project.display_settings[key] && Project.display_settings[key].export) {
		        new_display[key] = Project.display_settings[key].export()
		        entries++;
            }
        }
        if (entries) {
            blockmodel.display = new_display
			const SUBTRACT_Y = 1.5; 

			for (const [slot, value] of Object.entries(new_display)) {
			  const tr = value && value.translation;
			  if (Array.isArray(tr)) {
			    const y = Number(tr[1]) || 0;
			    tr[1] = Math.round((y - SUBTRACT_Y) * 100) / 100;
			  }
			}
        }
    }
    if (Project.textures && checkExport("textures", Object.keys(Project.textures).length >= 1)) {
        for (const tex of Object.values(Project.textures)) {
            if (tex.particle || Object.keys(Project.textures).length === 1) {
                let name = tex.name;

                if (name.indexOf(".png") > -1) {
                    name = name.substring(0, name.indexOf(".png"));
                }

                if (!tex.particle && !isValidPath(name)) {
                    continue;
                }

                blockmodel.textures = {
                    particle: name
                };

                break;
            }
        }
    }

    function isValidPath(path) {
        const pattern = new RegExp('^[_\\-/.a-z0-9]+$');

        return pattern.test(path);
    }


    const blockmodelString = JSON.stringify(blockmodel, null, 2);
    var scope = codec;
    let path = azurelibSettings.itemModelPath;

    Blockbench.export({
        resource_id: 'model',
        type: Codecs.java_block.name,
        extensions: ['json'],
        name: scope.fileName().replace(".geo", ".item"),
        startpath: path,
        content: blockmodelString,
    }, (real_path) => {
        azurelibSettings.itemModelPath = real_path;
    });

    return this;
}

var codec = Codecs.bedrock;

var format = new ModelFormat({
    id: "azure_model",
    name: "AzureLib Animated Model",
    category: "minecraft",
    description: "Animated Model for Java mods using AzureLib",
    icon: "view_in_ar",
    rotate_cubes: true,
    box_uv: true,
    optional_box_uv: true,
    single_texture: true,
    bone_rig: true,
    centered_grid: true,
    animated_textures: true,
    select_texture_for_particles: true,
    animation_mode: true,
    animation_files: true,
    locators: true,
    codec: Codecs.project, // This sets what codec is used for File -> Save. We want to use bbmodel.
    display_mode: true, // This may be dynamically turned on by settings
    onActivation: function () {
    }
})

export default codec; // This is used for plugin "Export Animated Model" menu item

//#endregion Codec / ModelFormat