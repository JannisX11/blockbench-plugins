// Based off of https://github.com/JannisX11/blockbench-plugins/blob/master/plugins/animation_to_java.js
(function () {
    var menuButton;

    Plugin.register("animation_to_jsonea", {
        title: "Animation to JsonEA Converter",
        author: "Gaming32",
        description: "Converts Blockbench animations to the json format for the Json Entity Animation mod",
        icon: "fa-cube",
        tags: ["Animation", "Minecraft: Java Edition"],
        variant: "both",
        version: "1.0.0",
        onload() {
            Formats.modded_entity.animation_mode = true;
            menuButton = new Action("export_animation_to_jsonea", {
                name: "Export Animations to JsonEA",
                description: "Export Animations to Json Entity Animation format",
                icon: "fa-file-export",
                condition: () => Format.animation_mode,
                click() {
                    const animation = Animation.selected;
                    if (animation == null) return;
                    Blockbench.export({
                        type: "Json Files",
                        extensions: ["json"],
                        name: `${animation.name.replaceAll(".", "_").replace("animation_", "")}.json`,
                        resource_id: "jsonea",
                        savetype: "text",
                        content: JSON.stringify(generateJson(animation))
                    });
                }
            });
            MenuBar.addAction(menuButton, "file.export");
        },
        onunload() {
            menuButton.delete();
        }
    });
})();

function generateJson(animation) {
    const result = {
        length: animation.length,
        animations: []
    };
    if (animation.loop == "loop") {
        result.loop = true;
    }
    for (const id in animation.animators) {
        const boneAnimator = animation.animators[id];
        if (!(boneAnimator instanceof BoneAnimator)) continue;
        if (boneAnimator.position.length) {
            result.animations.push(generateKeyframes(boneAnimator.name, "position", boneAnimator.position));
        }
        if (boneAnimator.rotation.length) {
            result.animations.push(generateKeyframes(boneAnimator.name, "rotation", boneAnimator.rotation));
        }
        if (boneAnimator.scale.length) {
            result.animations.push(generateKeyframes(boneAnimator.name, "scale", boneAnimator.scale));
        }
    }
    return result;
}

function generateKeyframes(bone, target, keyframes) {
    const animData = {
        bone,
        target,
        keyframes: []
    };
    for (const keyframe of [...keyframes].sort((a, b) => a.time - b.time)) {
        animData.keyframes.push({
            timestamp: keyframe.time,
            target: [
                keyframe.get("x"),
                keyframe.get("y"),
                keyframe.get("z"),
            ],
            interpolation: keyframe.interpolation
        });
    }
    return animData;
}
