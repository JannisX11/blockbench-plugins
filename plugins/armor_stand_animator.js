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
    return Number((Math.ceil(time / 0.05) * 0.05).toFixed(2));
}

function getNextKey(dict, currentKey) {
    let keys = Object.keys(dict);
    return keys[keys.indexOf(String(currentKey)) + 1];
} 

function generatePackFromAnimation(animationContents, animationName, configData, loopMode) {
    let zip = new JSZip();

    // Load in config data and filter invalid characters
    packName = configData.packName.replace(/[^a-z0-9_.]/g, "");
    animationName = animationName.replace(/[^a-zA-Z0-9_.]/g, '_').slice(0, 15);

    let workingDir = `${packName}/functions`;
    // This needs to be run manually by the user
    zip.file(`${workingDir}/init.mcfunction`, `scoreboard objectives add ${animationName.slice(0, 10)}.timer dummy`)
    
    zip.file(`${workingDir}/create.mcfunction`, `summon minecraft:armor_stand ~ ~ ~ {Tags:["${configData.entityTag}"],NoBasePlate:1b,ShowArms:1b,Pose:{LeftArm:[0f,0f,0f],RightArm:[0f,0f,0f],LeftLeg:[0f,0f,0f],RightLeg:[0f,0f,0f]}}`)
    let isFirstFrame = true;
    // Iterate through keyframes
    for ([keyframeTime, keyframeContents] of Object.entries(animationContents)) {
        let nextKeyframeTime = getNextKey(animationContents, keyframeTime);
        let differenceBetweenNextAndCurrentKeyframe = Number(nextKeyframeTime) - Number(keyframeTime);

        // Generate commands for this keyframe
        let commands = [];
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

        // Create the function as the start function instead of frame 0
        if (isFirstFrame) {
            zip.file(`${workingDir}/start.mcfunction`, `data merge entity @s {Pose:{Head:[0f,0f,0f],LeftArm:[0f,0f,0f],RightArm:[0f,0f,0f],LeftLeg:[0f,0f,0f],RightLeg:[0f,0f,0f]}}\nscoreboard players set @s ${animationName.slice(0, 10)}.timer ${keyframeTime}\nschedule function ${packName}:search/${keyframeTime} ${differenceBetweenNextAndCurrentKeyframe}t append`)
            isFirstFrame = false;
        }

        // Generates the functions needed for each frame (2 functions per frame, scheduling each other)
        zip.file(`${workingDir}/search/${keyframeTime}.mcfunction`, `execute as @e[tag=${configData.entityTag},scores={${animationName.slice(0, 10)}.timer=${keyframeTime}}]${includePositionalContext ? " at @s" : ""} run function ${packName}:frames/${keyframeTime}`);
        // This check is needed because otherwise the last frame will have something like "scoreboard players set ....timer undefined " and "schedule function ... NaNt append". It also lets us add the loop code.
        if (nextKeyframeTime) {
            zip.file(`${workingDir}/frames/${keyframeTime}.mcfunction`, `${commands.join("\n")}\nscoreboard players set @s ${animationName.slice(0, 10)}.timer ${nextKeyframeTime}\nschedule function ${packName}:search/${nextKeyframeTime} ${differenceBetweenNextAndCurrentKeyframe}t append`);
        } else {
            let extraCommands = [];
            if (loopMode === "loop") {
                extraCommands.push(`scoreboard players set @s ${animationName.slice(0, 10)}.timer -13`, `schedule function ${packName}:delay_for_loop 1t`);
                zip.file(`${workingDir}/delay_for_loop.mcfunction`, `execute as @e[tag=${configData.entityTag},scores={${animationName.slice(0, 10)}.timer=-13}] run function ${packName}:start`);
            }
            // "once" and "hold" loop modes are ignored since the animation stops on its own
            zip.file(`${workingDir}/frames/${keyframeTime}.mcfunction`, `${commands.join("\n")}\n${extraCommands.join("\n")}`);
        }
    }
    
    zip.generateAsync({type: "blob"}).then(content => {
        Blockbench.export({
            startpath: ModelMeta.export_path,
            type: "Zip Archive",
            extensions: ["zip"],
            name: animationName,
            content: content,
            savetype: "zip"
        })
    });
}

(function() {
    Plugin.register("armor_stand_animator", {
        title: "Armor Stand Animator",
        author: "DoubleFelix",
        description: "Provides an interface to animate armor stands which is converted to a data pack",
        tags: ["Minecraft: Java Edition"],
        icon: "fa-forward",
        version: "1.0.0",
        variant: "both",
        onload() {
            // Both actions are globals
            createArmorStandAction = new Action("create_armor_stand", {
                name: "Create Armor Stand Model",
                description: "Creates an armor stand model, complete with bones and textures",
                icon: "person_add",
                click: function() {
                    // 1x1 pixel texture as base64
                    let armorStandTexture = new Texture({
                        name: "as_texture",
                        mode: "bitmap",
                        source: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAMSURBVBhXY5hZFQQAAxUBZgs8yDQAAAAASUVORK5CYII="
                    });
                    armorStandTexture.add();
                    armorStandTexture.load();

                    // Hardcoded positions and sizes
                    let armorStand = new Group({name: "armor_stand", origin: [0, 0, 0], isOpen: true}).init();
                    let headBone = new Group({name: "head_bone", origin: [0, 21.5, 0], isOpen: true}).addTo(armorStand).init();
                    let headCube = new Cube({name: "head", from: [-1, 23, -1], to: [1, 29, 1], isOpen: true}).addTo(headBone).init();
                    let leftArmBone = new Group({name: "left_arm_bone", origin: [6.25, 21.25, 0], isOpen: true}).addTo(armorStand).init();
                    let leftArmCube = new Cube({name: "left_arm", from: [5, 11, -1], to: [7, 23, 1], isOpen: true}).addTo(leftArmBone).init();
                    let rightArmBone = new Group({name: "right_arm_bone", origin: [-6.25, 21.25, 0], isOpen: true}).addTo(armorStand).init();
                    let rightArmCube = new Cube({name: "right_arm", from: [-7, 11, -1], to: [-5, 23, 1], isOpen: true}).addTo(rightArmBone).init();
                    let bodyBone = new Group({name: "body_bone", origin: [0, 23.5, 0], isOpen: true}).addTo(armorStand).init();
                    let leftRibCube = new Cube({name: "left_rib", from: [1, 13, -1], to: [3, 20, 1], isOpen: true}).addTo(bodyBone).init();
                    let rightRibCube = new Cube({name: "right_rib", from: [-3, 13, -1], to: [-1, 20, 1], isOpen: true}).addTo(bodyBone).init();
                    let collarCube = new Cube({name: "collar", from: [-6, 20, -1.5], to: [6, 23, 1.5], isOpen: true}).addTo(bodyBone).init();
                    let hipCube = new Cube({name: "hip", from: [-4, 11, -1], to: [4, 13, 1], isOpen: true}).addTo(bodyBone).init();
                    let leftLegBone = new Group({name: "left_leg_bone", origin: [2, 12, 0], isOpen: true}).addTo(armorStand).init();
                    let leftLegCube = new Cube({name: "left_leg", from: [1, 0, -1], to: [3, 11, 1], isOpen: true}).addTo(leftLegBone).init();
                    let rightLegBone = new Group({name: "right_leg_bone", origin: [-2, 12, 0], isOpen: true}).addTo(armorStand).init();
                    let rightLegCube = new Cube({name: "right_leg", from: [-3, 0, -1], to: [-1, 11, 1], isOpen: true}).addTo(rightLegBone).init();

                    headCube.applyTexture(armorStandTexture, true);
                    leftArmCube.applyTexture(armorStandTexture, true);
                    rightArmCube.applyTexture(armorStandTexture, true);
                    leftRibCube.applyTexture(armorStandTexture, true);
                    rightRibCube.applyTexture(armorStandTexture, true);
                    collarCube.applyTexture(armorStandTexture, true);
                    hipCube.applyTexture(armorStandTexture, true);
                    leftLegCube.applyTexture(armorStandTexture, true);
                    rightLegCube.applyTexture(armorStandTexture, true);

                }
            });

            exportAnimationAction = new Action("export_animation", {
                name: "Export Armor Stand Animation",
                description: "Exports the animation to a data pack",
                icon: "file_download",
                click: function() {
                    let startTime = new Date();

                    if (Modes.selected.name != "Animate") {
                        Blockbench.showQuickMessage("The animate menu must be open", 2000);
                        return;
                    }

                    // Fetch the selected animation by checking which one as the selected property 
                    let selectedAnimation = Animator.animations.find(q => (q.selected === true));

                    // Set the start delay to 0 if it doesn't exist
                    let animationStartDelay = selectedAnimation.startDelay;
                    animationStartDelay = typeof animationStartDelay === "number" ? animationStartDelay : 0;

                    if (selectedAnimation === undefined) {
                        Blockbench.showQuickMessage("You must select an animation to export", 2000);
                        return;
                    }

                    // Check snapping values
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
    
                        new Dialog("exportAnimationOptions", {
                            title: "Export Animation",
                            form: {
                                blockUnitScale: {type: "number", label: "Block/Unit Ratio", value: 0.0625, min: 0.015625, max: 16, step: 0.1}, // Default value is 16 units to 1 block, minimum value is 64 units to 1 block
                                timeScale: {type: "number", label: "Time Scale", value: 1, min: 0.1, max: 100, step: 0.1},
                                packName: {type: "textarea", label: "Pack Name", value: selectedAnimation.name, height: 30},
                                entityTag: {type: "text", label: "Entity Tag", value: selectedAnimation.name, height: 30},
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
     
                                    // Scale is ignored since it can't be used
                                }
                                this.hide();
                                
                                generatePackFromAnimation(animationContent, selectedAnimation.name, formData, selectedAnimation.loop, startTime)
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

                    Blockbench.setStatusBarText(`Animation exported in ${(new Date() - startTime)/100} seconds`);
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