import { GLTF } from './parse_gltf';
import { ImportOptions, ImportedContent } from './import_gltf';
import { eulerDegreesFromQuat } from './util';

/**
 * Converts glTF animations (THREE.AnimationClip) to Blockbench animations
 */
export async function importAnimations(
    gltf: GLTF,
    options: ImportOptions,
    content: ImportedContent,
    nodeToElementMap: Map<string, any>
): Promise<void> {
    let fps = (window as any).Project?.fps || 24;
    if (typeof fps !== 'number') fps = 24;

    const AnimationClass = (window as any).Animation;
    if (!AnimationClass) {
        console.error('[gltf_importer]: Blockbench Animation class not found!');
        return;
    }

    if (gltf.animations && gltf.animations.length > 0) {
        for (let i = 0; i < gltf.animations.length; i++) {
            const clip = gltf.animations[i];
            console.log(`[gltf_importer]: Processing glTF animation: "${clip.name || i}" (${clip.tracks.length} tracks)`);

            const bbAnimation = new AnimationClass({
                name: clip.name || `animation_${i}`,
                length: clip.duration || 0,
            }).add();

            if (typeof bbAnimation.init === 'function') bbAnimation.init();

            const project = (window as any).Project;
            if (project?.animations && !project.animations.includes(bbAnimation)) {
                project.animations.push(bbAnimation);
            }

            console.log(`[gltf_importer]: Created animation: "${bbAnimation.name}", length: ${bbAnimation.length}s`);

            for (const track of clip.tracks) {
                processTrack(track as any, bbAnimation, nodeToElementMap, fps, options);
            }

            if (getAnimatorCount(bbAnimation) > 0) {
                content.animations.push(bbAnimation);
            } else {
                console.warn(`[gltf_importer]: No matching elements found for animation "${bbAnimation.name}"`);
                bbAnimation.remove();
            }
        }
    }

    // Process embedded animations in nodes
    const sceneRoot = (gltf.scene as unknown as THREE.Group);
    if (sceneRoot) {
        sceneRoot.traverse((node: any) => {
            if (node.animations && node.animations.length > 0) {
                for (let i = 0; i < node.animations.length; i++) {
                    const clip = node.animations[i];
                    const bbAnimation = new AnimationClass({
                        name: clip.name || `${node.name || 'node'}_anim_${i}`,
                        length: clip.duration || 0,
                    }).add();

                    if (typeof bbAnimation.init === 'function') bbAnimation.init();

                    const project = (window as any).Project;
                    if (project?.animations && !project.animations.includes(bbAnimation)) {
                        project.animations.push(bbAnimation);
                    }

                    for (const track of clip.tracks) {
                        processTrack(track as any, bbAnimation, nodeToElementMap, fps, options);
                    }

                    if (getAnimatorCount(bbAnimation) > 0) {
                        content.animations.push(bbAnimation);
                    } else {
                        bbAnimation.remove();
                    }
                }
            }
        });
    }

    if (content.animations.length > 0) {
        setTimeout(() => {
            try {
                if (content.animations[0] && typeof content.animations[0].select === 'function') {
                    content.animations[0].select();
                }
            } catch (e) {}

            const Animator = (window as any).Animator;
            if (Animator) {
                if (typeof Animator.updateContent === 'function') Animator.updateContent();
                if (typeof Animator.updateApp === 'function') Animator.updateApp();
            }
            if ((window as any).Timeline?.update) (window as any).Timeline.update();
        }, 100);
    }
}

function getAnimatorCount(bbAnimation: any): number {
    if (!bbAnimation.animators) return 0;
    if (bbAnimation.animators instanceof Map) return bbAnimation.animators.size;
    return Object.keys(bbAnimation.animators).length;
}

function processTrack(
    track: any,
    bbAnimation: any,
    nodeToElementMap: Map<string, any>,
    fps: number,
    options: ImportOptions
): void {
    const trackNameParts = parseTrackName(track.name, nodeToElementMap);
    if (!trackNameParts) return;

    const { targetName, property, morphIndex } = trackNameParts;

    let element = nodeToElementMap.get(targetName);
    if (!element) {
        element = (window as any).Outliner?.all.find((el: any) => el.name === targetName);
    }

    if (!element) {
        const nodeIndexMatch = targetName.match(/^node_(\d+)$/);
        if (nodeIndexMatch) {
            const index = parseInt(nodeIndexMatch[1], 10);
            element = (window as any).Outliner?.all.find((el: any) =>
                (el.userData && el.userData.gltfIndex === index)
            );
        }
    }

    if (!element) return;

    let animator = getAnimatorForElement(element, bbAnimation);
    if (!animator) return;

    if (property === 'position') {
        const resting_local_pos = element.userData.gltfTranslation || [0, 0, 0];

        for (let i = 0; i < track.times.length; i++) {
            const gltf_pos = [
                track.values[i * 3] * options.scale,
                track.values[i * 3 + 1] * options.scale,
                track.values[i * 3 + 2] * options.scale
            ];

            // Keyframe value is the offset from the resting local glTF position
            const val = [
                Math.roundTo((gltf_pos[0] - resting_local_pos[0]), 4),
                Math.roundTo((gltf_pos[1] - resting_local_pos[1]), 4),
                Math.roundTo((gltf_pos[2] - resting_local_pos[2]), 4)
            ];
            addKeyframeToAnimator(animator, track.times[i], 'position', val);
        }
    } else if (property === 'rotation') {
        const resting_rotation = element.userData.gltfRotation || [0, 0, 0];

        const THREE = (window as any).THREE;
        for (let i = 0; i < track.times.length; i++) {
            const quat = new THREE.Quaternion(track.values[i * 4], track.values[i * 4 + 1], track.values[i * 4 + 2], track.values[i * 4 + 3]);
            const euler = eulerDegreesFromQuat(quat);

            // Keyframe value is the offset from the resting local glTF rotation
            const val = [
                Math.roundTo(euler.x - resting_rotation[0], 4),
                Math.roundTo(euler.y - resting_rotation[1], 4),
                Math.roundTo(euler.z - resting_rotation[2], 4)
            ];
            addKeyframeToAnimator(animator, track.times[i], 'rotation', val);
        }
    } else if (property === 'scale') {
        const resting_scale = element.userData.gltfScale || [1, 1, 1];
        for (let i = 0; i < track.times.length; i++) {
            const val = [
                Math.roundTo(track.values[i * 3] / resting_scale[0], 4),
                Math.roundTo(track.values[i * 3 + 1] / resting_scale[1], 4),
                Math.roundTo(track.values[i * 3 + 2] / resting_scale[2], 4)
            ];
            addKeyframeToAnimator(animator, track.times[i], 'scale', val);
        }
    } else if (property === 'morphTargetInfluences' || property === 'weights') {
        for (let i = 0; i < track.times.length; i++) {
            addKeyframeToAnimator(animator, track.times[i], `morph_${morphIndex || 0}`, Math.roundTo(track.values[i], 4));
        }
    }
}

function addKeyframeToAnimator(
    animator: any,
    time: number,
    property: string,
    value: any
): void {
    const KeyframeClass = (window as any).Keyframe;
    if (!animator) return;

    // Ensure animator structure is correct for the Keyframe constructor
    if (!animator.channels) animator.channels = {};
    if (!animator.channels[property]) {
        animator.channels[property] = {
            name: property,
            transform: ['position', 'rotation', 'scale'].includes(property),
            keyframes: []
        };
    }

    // Ensure the array for the channel exists on the animator object itself
    if (!Array.isArray(animator[property])) {
        animator[property] = [];
    }

    // Format data points for Blockbench KeyframeDataPoint.extend
    let data_point: any = {};
    if (Array.isArray(value) && value.length === 3) {
        data_point = { x: value[0].toString(), y: value[1].toString(), z: value[2].toString() };
    } else {
        data_point = { x: value.toString(), y: value.toString(), z: value.toString() };
    }

    const keyframe_data = {
        channel: property,
        time: time,
        data_points: [data_point]
    };

    // Use animator.addKeyframe if possible, as it's the safest way
    if (typeof animator.addKeyframe === 'function') {
        try {
            animator.addKeyframe(keyframe_data);
            return;
        } catch (e) {
            // Fall through
        }
    }

    // Fallback: Direct instantiation with the correct Blockbench signature: (data, uuid, animator)
    if (KeyframeClass) {
        try {
            const keyframe = new KeyframeClass(keyframe_data, null, animator);

            // Manual injection into the animator's channel array if not handled by constructor
            if (!animator[property].includes(keyframe)) {
                animator[property].push(keyframe);
            }
        } catch (e) {
            console.error(`[gltf_importer]: Keyframe creation failed for ${property}:`, e);
        }
    }
}

function getAnimatorForElement(element: any, bbAnimation: any): any {
    if (!element || !bbAnimation) return null;

    // Use the animation's own logic for getting or creating an animator if available
    if (typeof bbAnimation.getBoneAnimator === 'function') {
        try {
            return bbAnimation.getBoneAnimator(element);
        } catch (e) {}
    }

    // Fallback to manual discovery
    if (!bbAnimation.animators) {
        bbAnimation.animators = {};
    }

    let animator = null;
    const id = element.uuid;

    if (bbAnimation.animators instanceof Map) {
        animator = bbAnimation.animators.get(id);
    } else {
        animator = bbAnimation.animators[id];
    }

    if (!animator) {
        // Try to use the element's preferred animator class
        const AnimatorClass = element.constructor.animator || (window as any).GeneralAnimator || (window as any).BoneAnimator;
        if (typeof AnimatorClass === 'function') {
            console.log(`[gltf_importer]: Manually creating animator for ${element.name} using ${AnimatorClass.name}`);

            // Blockbench animator constructors often vary, but (uuid, animation) is common for BoneAnimators
            animator = new AnimatorClass(id, bbAnimation);

            if (!animator.animation) animator.animation = bbAnimation;

            if (bbAnimation.animators instanceof Map) {
                bbAnimation.animators.set(id, animator);
            } else {
                bbAnimation.animators[id] = animator;
            }

            if (typeof animator.init === 'function') animator.init();
        }
    }

    return animator;
}

function parseTrackName(trackName: string, nodeToElementMap: Map<string, any>): { targetName: string; property: string; morphIndex?: number } | null {
    const match = trackName.match(/(?:^|\.)(?:nodes|bones)\["?(.*?)"?\]\.(position|quaternion|scale|rotation|weights)/) ||
        trackName.match(/^(.+?)\.(position|quaternion|scale|rotation|weights)/);

    if (match) {
        let target = match[1];
        let property = match[2];
        if (/^\d+$/.test(target)) target = `node_${target}`;
        if (target.includes('.')) {
            const parts = target.split('.');
            target = nodeToElementMap.has(parts[0]) ? parts[0] : parts[parts.length-1];
        }
        return { targetName: target, property: property === 'quaternion' ? 'rotation' : property };
    }

    const morphMatch = trackName.match(/(?:^|\.)(?:nodes|bones)\["?(.*?)"?\]\.morphTargetInfluences\[(\d+)\]/) ||
        trackName.match(/^(.+?)\.morphTargetInfluences\[(\d+)\]/);
    if (morphMatch) {
        let target = morphMatch[1];
        if (/^\d+$/.test(target)) target = `node_${target}`;
        return { targetName: target, property: 'morphTargetInfluences', morphIndex: parseInt(morphMatch[2]) };
    }
    return null;
}