// TODO Make into custom model format, allow multiple armor stands in one animation

// Credit to Misode for this (I did some, you can view the wizardry he pulled over here (https://github.com/misode/vscode-nbt/blob/master/src/common/Snbt.ts))
window.SNBT = (function () {
    function SNBT() {}
    SNBT.stringify = function (type, data) {
        switch (type) {
            case "compound": return Object.keys(data).length === 0 ? "{}": 
                "{" + Object.entries(data).map(function (_a) {
                    let key = _a[0], value = _a[1];
                    return (key + ": " + SNBT.stringify(value.type, value.value));
                }).join(',') + "}";
            case "list": return data.value.length === 0 ? "[]": 
                SNBT.isCompact(data.type) ? 
                    "[" + SNBT.stringifyEntries(data.type, data.value, ", ") + "]" : 
                    "[" + SNBT.stringifyEntries(data.type, data.value, ',') + "]";
            case "floatList": return "[" + SNBT.stringifyEntries("float", data, ", ") + "]";
            case "string": return "\"" + data.replace(/(\\|")/g, "\\$1") + "\"";
            case "byte": return data + "b";
            case "double": return data + "d";
            case "float": return data + "f";
            case "short": return data + "s";
            case "int": return "" + data;
            case "long": return SNBT.stringifyLong(data) + "L";
            default: return "null";
        }
    };
    SNBT.stringifyLong = function (value) {
        SNBT.dataView.setInt32(0, Number(value[0]));
        SNBT.dataView.setInt32(4, Number(value[1]));
        return "" + SNBT.dataView.getBigInt64(0);
    };
    SNBT.stringifyEntries = function (type, values, join) {
        return values.map(function (v) {
            return ("" + SNBT.stringify(type, v));
        }).join(join);
    };
    SNBT.isCompact = function (type) {
        return type === 'byte' || type === 'double' || type === 'float' || type === 'short' || type === 'int' || type === 'long';
    };
    SNBT.bytes = new Uint8Array(8);
    SNBT.dataView = new DataView(SNBT.bytes.buffer);
    return SNBT;
}());

function roundKeyframeTime(time) {
    return Number((Math.ceil(time.toFixed(2) / 0.05) * 0.05).toFixed(2));
}

function getNextKey(dict, currentKey) {
    let keys = Object.keys(dict);
    return keys[keys.indexOf(String(currentKey)) + 1];
} 

function getRootBoneNameDifferentiator(boneName, numberCheck) {
    // Try to find an existing armor stand root bone
    let primaryArmorStandBone = Outliner.root.find(q => (q.name === (numberCheck === 0 ? boneName : `${boneName}${numberCheck}`)));
    // If it didn't exist, return the name (and the differentiator if it wasn't 0) as a string
    if (!primaryArmorStandBone) {
        return numberCheck === 0 ? boneName : `${boneName}${numberCheck}`;
    } else {
        // Otherwise, check the next number
        return getRootBoneNameDifferentiator(boneName, numberCheck + 1);
    }
}

function generatePackFromAnimation(animationContents, animationName, configData, loopMode) {
    let zip = new JSZip();

    // Load in config data and filter invalid characters
    let packName = configData.packName.replace(/[^a-z0-9_.]/g, "");
    animationName = animationName.replace(/[^a-zA-Z0-9_.]/g, '_');

    let timerObjectiveName = `${animationName}.timer`;
    let isPausedObjectiveName = `${animationName}.is_paused`;


    // Set the working DIR depending on whether or not we're generating a pack namespace or a full pack
    let workingDir;
    if (configData.generationMode === "namespace") {
        workingDir = `${packName}/functions`;
    } else if (configData.generationMode === "data_pack") {
        // Generate the extra files needed for it to be a pack
        zip.file(`pack.mcmeta`, 
            `{
                "pack": {
                    "pack_format": 7,
                    "description": "Armor Stand Animation: ${packName}"
                }
            }`
        );

        zip.file(`data/minecraft/tags/functions/load.json`,
            `{
                "values": [
                    "${packName}:init"
                ]
            }`
        );

        workingDir = `data/${packName}/functions`;
    }

    // If playback control is enabled (pause/play), generate each function
    if (configData.playbackControl) { 
        // Just invert the timer score and mark it as paused
        zip.file(`${workingDir}/pause.mcfunction`, `scoreboard players operation @s ${timerObjectiveName} *= #-1 ${isPausedObjectiveName}\nscoreboard players set @s ${isPausedObjectiveName} 1`);

        // Re-invert the timer score, and begin the search at the correct frame
        resumeCommands = `scoreboard players operation @s ${timerObjectiveName} *= #-1 ${isPausedObjectiveName}`;
        Object.keys(animationContents).slice().reverse().forEach(
            item => resumeCommands += `\nexecute if score @s ${isPausedObjectiveName} matches 1 if score @s ${timerObjectiveName} matches ${item} run function ${packName}:search/${item}`
        );

        zip.file(`${workingDir}/resume.mcfunction`, resumeCommands); 
    }

    // Stop the animation by setting it into an invalid frame number
    zip.file(`${workingDir}/stop.mcfunction`, `scoreboard players set @s ${timerObjectiveName} -2147483646`);

    // Add the necessary timer objective, plus is paused objective and -1 constant if playback control is enabled
    initCommands = `scoreboard objectives add ${timerObjectiveName} dummy`;
    if (configData.playbackControl) { initCommands += `\nscoreboard players set #-1 ${isPausedObjectiveName} -1\nscoreboard objectives add ${isPausedObjectiveName} dummy`; }
    zip.file(`${workingDir}/init.mcfunction`, initCommands);
    
    // Armor stand creation function
    zip.file(`${workingDir}/create.mcfunction`, `summon minecraft:armor_stand ~ ~ ~ {Tags:["${configData.entityTag}"], NoBasePlate:1b, ShowArms:1b, Pose:{LeftArm:[0f, 0f, 0f], RightArm:[0f, 0f, 0f], LeftLeg:[0f, 0f, 0f], RightLeg:[0f, 0f, 0f]}}`);
    
    // This is needed since we need to create the start function if this is the first frame, and it can't be hardcoded since the start frame doesn't have to be frame 1
    let isFirstFrame = true;

    // Iterate through each keyframe in the data
    for ([keyframeTime, keyframeContents] of Object.entries(animationContents)) {
        // Used to calculate how long we should wait
        let nextKeyframeTime = getNextKey(animationContents, keyframeTime);
        let differenceBetweenNextAndCurrentKeyframe = Number(nextKeyframeTime) - Number(keyframeTime);

        // Generate commands for this keyframe
        let commands = [];
        // Set to true if the armor stand moves that frame. Marks if we need to include "at @s" in the execute command
        let includePositionalContext = false;
        if ("pos" in keyframeContents) {
            includePositionalContext = true;
            commands.push(`teleport @s ~${keyframeContents.pos.map(q => q * configData.blockUnitScale).join(" ~")}`);
        }
        if ("rot" in keyframeContents) {
            let outputNbt = {};
            let boneNameToKey = {
                head: "Head",
                leftArm: "LeftArm",
                rightArm: "RightArm",
                body: "Body",
                leftLeg: "LeftLeg",
                rightLeg: "RightLeg"
            };
            // For every limb and its rotation, generate the NBT
            for ([boneName, boneRotation] of Object.entries(keyframeContents.rot)) {
                if (boneName !== "main") {
                    outputNbt.Pose ??= {type: "compound", value: {}};
                    outputNbt.Pose.value[boneNameToKey[boneName]] = {type: "floatList", value: boneRotation};
                } else {
                    outputNbt.Rotation = {type: "floatList", value: boneRotation};
                }

            }
            commands.push(`data merge entity @s ${window.SNBT.stringify("compound", outputNbt)}`);
        }

        // Make sure there are some commands to add
        if (commands.length === 0) { continue; }

        // Create the start function
        if (isFirstFrame) {
            zip.file(`${workingDir}/start.mcfunction`, `data merge entity @s {Pose:{Head:[0f, 0f, 0f], LeftArm:[0f, 0f, 0f], RightArm:[0f, 0f, 0f], LeftLeg:[0f, 0f, 0f], RightLeg:[0f, 0f, 0f]}}\nscoreboard players set @s ${timerObjectiveName} ${keyframeTime}\nschedule function ${packName}:search/${keyframeTime} ${differenceBetweenNextAndCurrentKeyframe}t append`);
            isFirstFrame = false;
        }

        // Generates the functions needed for each frame (2 functions per frame, scheduling each other)
        searchCommands = `execute as @e[tag=${configData.entityTag},scores={${timerObjectiveName}=${keyframeTime}}]${includePositionalContext ? " at @s" : ""} run function ${packName}:frames/${keyframeTime}`;
        if (configData.playbackControl) { searchCommands += `\nscoreboard players set @s ${isPausedObjectiveName} 0`; }
        zip.file(`${workingDir}/search/${keyframeTime}.mcfunction`, searchCommands);
        
        // This check is needed because otherwise the last frame will have something like "scoreboard players set ....timer undefined " and "schedule function ... NaNt append". It also lets us add the loop code.
        if (nextKeyframeTime) {
            zip.file(`${workingDir}/frames/${keyframeTime}.mcfunction`, `${commands.join("\n")}\nscoreboard players set @s ${timerObjectiveName} ${nextKeyframeTime}\nschedule function ${packName}:search/${nextKeyframeTime} ${differenceBetweenNextAndCurrentKeyframe}t append`);
        } else {
            let extraCommands = [];
            if (loopMode === "loop") {
                extraCommands.push(`scoreboard players set @s ${timerObjectiveName} -2147483648`, `schedule function ${packName}:delay_for_loop 1t`);
                zip.file(`${workingDir}/delay_for_loop.mcfunction`, `scoreboard players set @e[tag=${configData.entityTag},scores={${timerObjectiveName}=-2147483648}] instrument1.timer 0\nfunction ${packName}:search/0`);
            }
            // "once" and "hold" loop modes are ignored since the animation stops on its own
            zip.file(`${workingDir}/frames/${keyframeTime}.mcfunction`, `${commands.join("\n")}\n${extraCommands.join("\n")}`);
        }
    }
    
    // Export the completed data pack
    zip.generateAsync({type: "blob"}).then(content => {
        Blockbench.export({
            startpath: Project.export_path,
            type: "Zip Archive",
            extensions: ["zip"],
            name: animationName,
            content: content,
            savetype: "zip"
        });
    });
}

(function() {
    Plugin.register("armor_stand_animator", {
        title: "Armor Stand Animator",
        author: "DoubleFelix",
        description: "Provides an interface to animate armor stands which is converted to a data pack",
        tags: ["Minecraft: Java Edition"],
        icon: "fa-forward",
        version: "1.1.0",
        variant: "both",
        onload() {
            // Both actions are globals
            createArmorStandAction = new Action("create_armor_stand", {
                name: "Create Armor Stand Model",
                description: "Creates an armor stand model, complete with bones and textures",
                icon: "person_add",
                click: function() {
                    new Dialog("createArmorStandOptions", {
                        title: "Create Armor Stand Model",
                        form: {
                            includeBasePlate: {type: "checkbox", label: "Include Base Plate", value: false},
                            armorStandName: {type: "text", label: "Armor Stand Name", value: getRootBoneNameDifferentiator("armor_stand", 0)},
                        },
                        onConfirm: function(formData) {
                            // Set UV width and height
                            Project.texture_width = 48;
                            Project.texture_height = 25;

                            // Returns undefined if it couldn't find the texture
                            let armorStandTexture = Texture.all.find(q => (q.name === "armor_stand"));
                            // If a texture with that name does not exist, create it
                            if (!armorStandTexture) {
                                armorStandTexture = new Texture({
                                    name: "armor_stand",
                                    mode: "bitmap",
                                    source: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAZCAMAAAE3eG3dAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABCUExURQAAAMKdYriUX5+ETcagZ7SQWn5iN6+PVZZ0QWdQLKKCUamJWHNeOYeHh4CAgKioqLCwsJ2dnaOjo3h4eJKSkgAAAEcA5fkAAAAWdFJOU////////////////////////////wAB0sDkAAAACXBIWXMAAA7AAAAOwAFq1okJAAACBklEQVQoU32T7ZakIAxECYi0M6PS9OT9X3VvBe3t/bM5GsHKRyWB5G7ZPTXPOXvKPvZu6XyOcXawXMAeS8kVk70PtzR6H+dIDeSW5D++HwePW0tmvo/B42aEcC+5hHEqTZ8pqWWzXGvJxqa6y30nQFGAHgK1BKsRomh8nqfSjwG7BS/3xVazUBGXYJYL64WCCC59IUEm2JSNN1QmoYg1qO0EP8+pKT03qDRRp/Dez6ndWyuZ8tWa/Rz9HFPjgfHMgShtxL/kL12ohorfAIXs1/ofoQ7VZIUSKAm9XACbBlhqrlatVfYTkLoLu+p0/zKAb6WLEV2P5t5yItLDPca9T33VAYpLp9H9NTUexnSEulMyHZk6WlJSgaTPYTF86SBv6i45GFpXq6R1sPDQHBX6PDlTGi1Yf3YdvGWp0a4pUb6GiRfybuotnBLRus+XbNfME15zNZFb0uOxbtu2wmuWxTuVLWWxBbVc3Z5CzwsZOI0IGHhYSt7OYXlJUnRl0cXioK8Niiirc1srW+Z3mcfw7Os+qv+X+v2DHTeIoluJGnZaKOHsHp9rYfQfDrmJ0qq6w4Gu65oj++damOxkyKzDMZp3DIx4mdP+uRam3tCdxyz6yvCaNhru63MtDLNVA0iiJm/91AV7wgOr38+1MDrfMrc0QS2S6OeBvH45zccu9V4LgwWG2/YHQJY6amRT2pAAAAAASUVORK5CYII=",
                                    width: 48,
                                    height: 25
                                });
                                armorStandTexture.add();
                                armorStandTexture.load();
                            }

                            let armorStand = new Group({name: formData.armorStandName, origin: [0, 0, 0], isOpen: true}).init();

                            let headBone = new Group({name: "head_bone", origin: [0, 21.5, 0], isOpen: true}).addTo(armorStand).init();
                            let headCube = new Cube({name: "head", from: [-1, 23, -1], to: [1, 29, 1], uv_offset: [0, 1]}).addTo(headBone).init();

                            let leftArmBone = new Group({name: "left_arm_bone", origin: [6.25, 21.25, 0], isOpen: true}).addTo(armorStand).init();
                            let leftArmCube = new Cube({name: "left_arm", from: [5, 11, -1], to: [7, 23, 1], uv_offset: [40, 10]}).addTo(leftArmBone).init();
                            let rightArmBone = new Group({name: "right_arm_bone", origin: [-6.25, 21.25, 0], isOpen: true}).addTo(armorStand).init();
                            let rightArmCube = new Cube({name: "right_arm", from: [-7, 11, -1], to: [-5, 23, 1], uv_offset: [40, 10]}).addTo(rightArmBone).init();

                            let bodyBone = new Group({name: "body_bone", origin: [0, 23.5, 0], isOpen: true}).addTo(armorStand).init();
                            let leftRibCube = new Cube({name: "left_rib", from: [1, 13, -1], to: [3, 20, 1], uv_offset: [0, 1]}).addTo(bodyBone).init();
                            let rightRibCube = new Cube({name: "right_rib", from: [-3, 13, -1], to: [-1, 20, 1], uv_offset: [0, 1]}).addTo(bodyBone).init();
                            let collarCube = new Cube({name: "collar", from: [-6, 20, -1.5], to: [6, 23, 1.5], uv_offset: [9, 5]}).addTo(bodyBone).init();
                            let hipCube = new Cube({name: "hip", from: [-4, 11, -1], to: [4, 13, 1], uv_offset: [14, 0]}).addTo(bodyBone).init();

                            let leftLegBone = new Group({name: "left_leg_bone", origin: [2, 12, 0], isOpen: true}).addTo(armorStand).init();
                            let leftLegCube = new Cube({name: "left_leg", from: [1, 0.5, -1], to: [3, 11, 1], uv_offset: [0, 11]}).addTo(leftLegBone).init();
                            let rightLegBone = new Group({name: "right_leg_bone", origin: [-2, 12, 0], isOpen: true}).addTo(armorStand).init();
                            let rightLegCube = new Cube({name: "right_leg", from: [-3, 0.5, -1], to: [-1, 11, 1], uv_offset: [0, 11]}).addTo(rightLegBone).init();

                            let cubesToApplyTexturesTo = [headCube, leftArmCube, rightArmCube, leftRibCube, rightRibCube, collarCube, hipCube, leftLegCube, rightLegCube];

                            if (formData.includeBasePlate) {
                                let plate = new Cube({name: "plate", from: [-6, 0, -6], to: [6, 1, 6], uv_offset: [0, 12]}).addTo(armorStand).init();
                                cubesToApplyTexturesTo.push(plate);
                            }

                            for (let cube of cubesToApplyTexturesTo) {
                                cube.applyTexture(armorStandTexture, true);
                            }

                            this.hide();
                        }
                    }).show();

                    // TODO new texture and new model

                    // Hardcoded positions and sizes



                }
            });

            exportAnimationAction = new Action("export_animation", {
                name: "Export Armor Stand Animation",
                description: "Exports the animation to a data pack",
                icon: "file_download",
                click: function() {
                    let startTime = new Date();

                    // Fetch the selected animation by checking which one has the selected property 
                    let selectedAnimation = Animator.animations.find(q => (q.selected === true));

                    // Set the start delay to 0 if it wasn't defined by the user
                    let animationStartDelay = selectedAnimation.startDelay;
                    animationStartDelay = typeof animationStartDelay === "number" ? animationStartDelay : 0;

                    // If no animation is selected, show an error
                    if (selectedAnimation === undefined) {
                        Blockbench.showQuickMessage("You must select an animation to export", 2000);
                        return;
                    }

                    // Check snapping values and their validity
                    let waitingForSnappingWarning = false;
                    let shouldReturn = false;
                    if (selectedAnimation.snapping > 20 || selectedAnimation.snapping % 10 !== 0) {
                        waitingForSnappingWarning = true;
                        Blockbench.showMessageBox({
                            title: "Warning",
                            message: "The snapping value of this animation is 10 or 20. All keyframe times will be rounded up to the nearest 50th millisecond. Do you wish to continue?",
                            icon: "warning",
                            buttons: ["Yes", "No"],
                            confirm: 0,
                            cancel: 1,
                        }, function (buttonIndex) {
                            if (buttonIndex === 0) {
                                waitingForSnappingWarning = false;
                            } else if (buttonIndex === 1) {
                                shouldReturn = true;
                            }
                        });

                        // Returning where the "shouldReturn = true;" is will cause it to exit the callback function, not this one.
                        if (shouldReturn) { return; }
                    }

                    // Wrapper function for the warning check done below
                    function makeAnimation() {
                        // Bind all the bone objects to variables
                        let bones = Object.values(selectedAnimation.animators);
                        let parentBone = bones.find(q => (q.name === "armor_stand"));
                        let headBone = bones.find(q => (q.name === "head_bone"));
                        let leftArmBone = bones.find(q => (q.name === "left_arm_bone"));
                        let rightArmBone = bones.find(q => (q.name === "right_arm_bone"));
                        let bodyBone = bones.find(q => (q.name === "body_bone"));
                        let leftLegBone = bones.find(q => (q.name === "left_leg_bone"));
                        let rightLegBone = bones.find(q => (q.name === "right_leg_bone"));
    
                        // Remove the animation. prefix (it is added by blockbench by default) if it exists
                        animationName = selectedAnimation.name.startsWith("animation.") ? selectedAnimation.name.slice(10) : selectedAnimation.name;

                        new Dialog("exportAnimationOptions", {
                            title: "Export Animation",
                            form: {
                                // Default value is 16 units to 1 block, minimum value is 64 units to 1 block
                                blockUnitScale: {type: "number", label: "Block/Unit Ratio", value: 0.0625, min: 0.015625, max: 16, step: 0.1}, 
                                // How frames are turned into tick times. A time scale of 0.5 will make the exported animation play at half speed.
                                timeScale: {type: "number", label: "Time Scale", value: 1, min: 0.1, max: 100, step: 0.1},
                                // The name of the pack namespace, and the data pack folder (if generateMode is data_pack)
                                packName: {type: "text", label: "Pack Name", value: animationName, height: 30},
                                // The tag that the entity should have. Should be unique per animation.
                                entityTag: {type: "text", label: "Entity Tag", value: animationName, height: 30},
                                // Whether or not the behavior for pausing and resuming the animation should be added to the data pack
                                playbackControl: {type: "checkbox", label: "Enable Pause/Play Control", value: true},
                                // Whether or not the animation should be exported as a data pack or namespace (useful for integrating into one pack)
                                generationMode: {type: "select", label: "Generation Mode", options: {data_pack: "Complete Data Pack", namespace: "Data Pack Namespace"}}
                            },
                            onConfirm: function(formData) {
                                // Loop through each bone and construct JSON data sorted by keyframe, then by rotation or position, then by bone
                                let animationContent = {};
                                for ([boneObj, boneName] of [
                                    [parentBone, "main"],
                                    [headBone, "head"],
                                    [leftArmBone, "leftArm"],
                                    [rightArmBone, "rightArm"],
                                    [bodyBone, "body"],
                                    [leftLegBone, "leftLeg"],
                                    [rightLegBone, "rightLeg"]
                                ]) {
                                    // Show warning if the user modifies the position of any non-parent bone
                                    if (boneObj.position.length > 0 && boneName !== "main") {
                                        let positionWarning = Blockbench.showToastNotification({
                                            text: "The animation includes a keyframe which modifies the position of a bone that is not \"armor_stand\". Positional animations for armor stand limbs are not supported and will not be included in the exported animation.",
                                            icon: "error",
                                            expire: 10000,
                                            click: function() {
                                                positionWarning.delete();
                                            }
                                        });
                                    }
    
                                    // Show warning if the user modifies the scale of the armor stand in any way
                                    if (boneObj.scale.length > 0) {
                                        let scaleWarning = Blockbench.showToastNotification({
                                            text: "The animation includes a keyframe which modifies the scale of a bone. Scale animations are not supported and will not be included in the exported animation.",
                                            icon: "error",
                                            expire: 10000,
                                            click: function() {
                                                scaleWarning.delete();
                                            }
                                        });
                                    }

                                    let shouldDisplayXZRotationWarning = false;
                                    if (boneName === "main") {
                                        // Functionality is essentially the same when using .entries, but we need index for position calculation
                                        for ([index, keyframe] of boneObj.position.entries()) {
                                            let keyframeData = keyframe.data_points[0]; 
                                            // Round the keyframe timer up to the nearest increment of 0.05, multiply it by 20 to turn it into ticks, and implement the starting delay
                                            keyframeTime = (roundKeyframeTime(keyframe.time) + animationStartDelay) * 20 * formData.timeScale;
                                            animationContent[keyframeTime] ??= {};
                                            // If we couldn't find a previous keyframe, then set the positions to 0 so the below calculation doesn't change the current keyframe
                                            let previousKeyframe = boneObj.position[index - 1];
                                            let previousKeyframeData = previousKeyframe ? previousKeyframe.data_points[0] : {x: 0, y: 0, z: 0};
                                            animationContent[keyframeTime].pos = [(keyframeData.x - previousKeyframeData.x).toString(), (keyframeData.y - previousKeyframeData.y).toString(), (keyframeData.z - previousKeyframeData.z).toString()]; 
                                        }

                                        // Handle armor stand base rotation
                                        for (keyframe of boneObj.rotation) {
                                            let keyframeData = keyframe.data_points[0]; 
                                            if (!shouldDisplayXZRotationWarning && (keyframeData.x != 0 || keyframeData.z != 0)) {
                                                shouldDisplayXZRotationWarning = true;
                                            }
                                            keyframeTime = (roundKeyframeTime(keyframe.time) + animationStartDelay) * 20 * formData.timeScale;
                                            animationContent[keyframeTime] ??= {};
                                            animationContent[keyframeTime].rot ??= {};
                                            animationContent[keyframeTime].rot.main = [keyframeData.y.toString()]; 
                                        }
                                    } else {
                                        for (keyframe of boneObj.rotation) {
                                            let keyframeData = keyframe.data_points[0]; 
                                            keyframeTime = (roundKeyframeTime(keyframe.time) + animationStartDelay) * 20 * formData.timeScale;
                                            animationContent[keyframeTime] ??= {};
                                            animationContent[keyframeTime].rot ??= {};
                                            // Invert X and Z rotation since minecraft is weird
                                            animationContent[keyframeTime].rot[boneName] = [(keyframeData.x * -1).toString(), keyframeData.y.toString(), (keyframeData.z * -1).toString()]; 
                                        }
                                    }

                                    // Display a warning if the user tries to modify any non-Y axis of the main armor stand bone
                                    if (shouldDisplayXZRotationWarning) {
                                        let rotationWarning = Blockbench.showToastNotification({
                                            text: "The animation includes a keyframe which modifies the X or Z rotation of the \"armor_stand\" bone. Rotations for the \"armor_stand\" bone on the X and Z axis are not supported and will not be included in the exported animation.",
                                            icon: "error",
                                            expire: 10000,
                                            click: function() {
                                                rotationWarning.delete();
                                            }
                                        });
                                    }
                                }
                                this.hide();

                                generatePackFromAnimation(animationContent, animationName, formData, selectedAnimation.loop, startTime)
                            }
                        }).show();
                    }

                    // Repeatedly poll to see if the snapping warning is gone, and if it is, then generate the animation.
                    function checkSnappingWarningCompletion() {
                        if (waitingForSnappingWarning) {
                            setTimeout(checkSnappingWarningCompletion, 250);
                        } else {
                            makeAnimation();
                        }
                    }
                    checkSnappingWarningCompletion();

                    Blockbench.setStatusBarText(`Animation exported in ${(new Date() - startTime) / 100} seconds`);
                }
            });
            MenuBar.addAction(createArmorStandAction, "filter");
            MenuBar.addAction(exportAnimationAction, "filter");
        },
        onunload() {
            createArmorStandAction.delete();
            exportAnimationAction.delete();
        }
    });
})(); 