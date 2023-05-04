(function () {
    let menuButton;

    Plugin.register("animation_to_java", {
        title: "Animation to Java Converter",
        author: "MG, Vincent_Huto(PR), DailyCraft(PR), MarcusSlover(PR)",
        description:
            "Converts Blockbench animations to Java code for the new 1.19+ keyframe system.",
        icon: "fa-cube",
        version: "1.2.2",
        variant: "both",
        about:
            "This plugin exports your Blockbench animations as Java code to be used for the new 1.19+ keyframe system. Please note that this system does not support Molang or step interpolation.",
        tags: ["Minecraft: Java Edition"],
        onload() {
            Formats.modded_entity.animation_mode = true
            menuButton = new Action("export_animation_to_java", {
                name: "Export Animations to Java",
                description: "Exports animations to Java code",
                icon: "fa-file-export",
                condition: () => Format.animation_mode,
                click() {
                    mapToExport();
                },
            });
            MenuBar.addAction(menuButton, "file.export");
        },
        onunload() {
            Formats.modded_entity.animation_mode = false
            menuButton.delete();
        },
    });

    /**
     * The mappings for the mojang mappings.
     */
    const animation_mojang_mappings = {
        definition: {
            name: "AnimationDefinition",
            builder: "Builder",
        },
        add: "addAnimation",
        loop: "looping",
        length: "withLength",
        channel: {
            name: "AnimationChannel",
            targets: {
                position: {
                    name: "Targets.POSITION",
                    vector: "KeyframeAnimations.posVec"
                },
                rotation: {
                    name: "Targets.ROTATION",
                    vector: "KeyframeAnimations.degreeVec"
                },
                scale: {
                    name: "Targets.SCALE",
                    vector: "KeyframeAnimations.scaleVec"
                }
            },
            interpolations: {
                linear: "Interpolations.LINEAR",
                cubic: "Interpolations.CATMULLROM"
            }
        }
    }

    /**
     * The mappings for the yarn mappings.
     */
    const animation_yarn_mappings = {
        definition: {
            name: "Animation",
            builder: "Builder",
        },
        add: "addBoneAnimation",
        loop: "looping",
        length: "create",
        channel: {
            name: "Transformation",
            targets: {
                position: {
                    name: "Targets.TRANSLATE",
                    vector: "AnimationHelper.createTranslationalVector"
                },
                rotation: {
                    name: "Targets.ROTATE",
                    vector: "AnimationHelper.createRotationalVector"
                },
                scale: {
                    name: "Targets.SCALE",
                    vector: "AnimationHelper.createScalingVector"
                }
            },
            interpolations: {
                linear: "Interpolations.LINEAR",
                cubic: "Interpolations.CUBIC"
            }
        }
    }

    /**
     * Asks the user for the mappings to use and then generates the file.
     */
    function mapToExport() {
        new Dialog("select_mappings", {
            id: "select_mappings",
            title: "Select Mappings",
            form: {
                mappings: {
                    label: "Mappings",
                    type: "select",
                    options: {
                        mojang: "Mojang",
                        yarn: "Yarn",
                    },
                    default: "mojang",
                },
            },
            onConfirm(form) {
                let data;
                if (form.mappings === "mojang") {
                    data = generateFile(animation_mojang_mappings);
                } else {
                    data = generateFile(animation_yarn_mappings);
                }
                Blockbench.export({
                    type: "Text File",
                    extensions: ["txt"],
                    savetype: "text",
                    content: data,
                });
                this.hide();
            },
        }).show();
    }

    /**
     * Transforms the interpolation to the correct format.
     * @param interpolation The interpolation to transform.
     * @param mappings The mappings to use.
     * @returns {string|*} The transformed interpolation.
     */
    function transformInterpolation(interpolation, mappings) {
        if (interpolation === "LINEAR") {
            return mappings.channel.interpolations.linear;
        } else if (interpolation === "CUBIC" || interpolation === "CATMULLROM") {
            return mappings.channel.interpolations.cubic;
        }
    }

    /**
     * Generates the file from the given mappings.
     * @param mapping The mappings to use.
     * @returns {string} The generated file.
     */
    function generateFile(mapping) {
        let outfileText = "";

        const definition = mapping.definition.name;
        const builder = mapping.definition.builder;
        const length = mapping.length;
        const loop = mapping.loop;
        const add = mapping.add;
        const channel = mapping.channel.name;
        const targets = mapping.channel.targets;

        for (const animation of Animation.all) {
            outfileText += `\npublic static final ${definition} ${animation.name
                .replaceAll(".", "_")
                .replace("animation_", "")
                .toUpperCase()} = ${definition}.${builder}.${length}(${animation.length
            }f)`;
            if (animation.loop === "loop") {
                outfileText += `.${loop}()`;
            }
            for (const id in animation.animators) {
                const boneAnimator = animation.animators[id];
                if (!(boneAnimator instanceof BoneAnimator)) continue;

                let posKeyArray = [];
                let rotKeyArray = [];
                let scaleKeyArray = [];

                // Position
                if (boneAnimator.position.length) {
                    outfileText += `\n.${add}("${boneAnimator.name}",\n\tnew ${channel}(${channel}.${targets.position.name}`;
                    //Sorts by time to ensure ordering
                    for (const keyFrame of boneAnimator.position) {
                        posKeyArray.push(keyFrame);
                    }
                    posKeyArray.sort((a, b) => a.time - b.time)

                    for (const keyFrame of posKeyArray) {
                        const {x = 0.0, y = 0.0, z = 0.0} = keyFrame.data_points[0];
                        const interpolation = transformInterpolation(keyFrame.interpolation.toUpperCase(), mapping);
                        outfileText += `, \n\t\tnew Keyframe(${keyFrame.time
                        }f, ${targets.position.vector}(${round2(x)}f, ${round2(y)}f, ${round2(z)}f),\n\t\t\t${channel}.${interpolation})`;
                    }
                    outfileText += "))";
                }

                // Rotation
                if (boneAnimator.rotation.length) {
                    outfileText += `\n.${add}("${boneAnimator.name}",\n\tnew ${channel}(${channel}.${targets.rotation.name}`;
                    //Sorts by time to ensure ordering
                    for (const keyFrame of boneAnimator.rotation) {
                        rotKeyArray.push(keyFrame);
                    }
                    rotKeyArray.sort((a, b) => a.time - b.time)

                    for (const keyFrame of rotKeyArray) {
                        const {x = 0.0, y = 0.0, z = 0.0} = keyFrame.data_points[0];
                        const interpolation = transformInterpolation(keyFrame.interpolation.toUpperCase(), mapping);
                        outfileText += `,\n\t\tnew Keyframe(${keyFrame.time
                        }f, ${targets.rotation.vector}(${round2(x)}f, ${round2(y)}f, ${round2(z)}f),\n\t\t\t${channel}.${interpolation})`;
                    }
                    outfileText += "))";
                }

                // Scale
                if (boneAnimator.scale.length) {
                    outfileText += `\n.${add}("${boneAnimator.name}",\n\tnew ${channel}(${channel}.${targets.scale.name}`;
                    //Sorts by time to ensure ordering
                    for (const keyFrame of boneAnimator.scale) {
                        scaleKeyArray.push(keyFrame);
                    }
                    scaleKeyArray.sort((a, b) => a.time - b.time)

                    for (const keyFrame of scaleKeyArray) {
                        const {x = 0.0, y = 0.0, z = 0.0} = keyFrame.data_points[0];
                        const interpolation = transformInterpolation(keyFrame.interpolation.toUpperCase(), mapping);
                        outfileText += `,\n\t\tnew Keyframe(${keyFrame.time
                        }f, ${targets.scale.vector}(${round2(x)}f, ${round2(y)}f, ${round2(z)}f),\n\t\t\t${channel}.${interpolation})`;
                    }
                    outfileText += "))";
                }
            }
            outfileText += ".build();"
        }
        return outfileText.replaceAll("66666666666", "67").replaceAll("33333333333", "34");
    }

    function round2(n) {
        return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
    }
})();
