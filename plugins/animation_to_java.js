(function () {
  var menuButton;

  Plugin.register("animation_to_java", {
    title: "Animation to Java Converter",
    author: "MG,Vincent_Huto(PR),DailyCraft(PR)",
    description:
      "Converts Blockbench animations to Java code for the new 1.19 keyframe system",
    icon: "fa-cube",
    version: "1.1.2",
    variant: "both",
    about:
      "This plugin exports your blockbench animations as java code to be used for the new 1.19 keyframe system. Please note that this system does not support Molang or step interpolation",
    tags: ["Minecraft: Java Edition"],
    onload() {
      Formats.modded_entity.animation_mode = true
      menuButton = new Action("export_animation_to_java", {
        name: "Export Animations to Java",
        description: "Exports animations to Java code",
        icon: "fa-file-export",
        condition: () => Format.animation_mode,
        click: function () {
          var file = generateFile();
          Blockbench.export({
            type: "Text File",
            extensions: ["txt"],
            savetype: "text",
            content: file,
          });
        },
      });
      MenuBar.addAction(menuButton, "file.export");
    },
    onunload() {
      Formats.modded_entity.animation_mode = false
      menuButton.delete();
    },
  });
})();

function generateFile() {
  let outfileText = "";

  for (const animation of Animation.all) {
    outfileText += `\npublic static final AnimationDefinition ${animation.name
      .replaceAll(".", "_")
      .replace("animation_", "")
      .toUpperCase()} = AnimationDefinition.Builder.withLength(${animation.length
      }f)`;
    if (animation.loop === "loop") {
      outfileText += ".looping()";
    }
    for (const id in animation.animators) {
      const boneAnimator = animation.animators[id];
      if (!(boneAnimator instanceof BoneAnimator)) continue;

      let posKeyArray = [];
      let rotKeyArray = [];
      let scaleKeyArray = [];

      if (boneAnimator.position.length) {
        outfileText += `.addAnimation("${boneAnimator._name}",\n new AnimationChannel(AnimationChannel.Targets.POSITION`;
        //Sorts by time to ensure ordering
        for (const keyFrame of boneAnimator.position) {
          posKeyArray.push(keyFrame);
        }
        posKeyArray.sort((a, b) => a.time - b.time)

        for (const keyFrame of posKeyArray) {
          var { x, y, z } = keyFrame.data_points[0];
          outfileText += `, \n new Keyframe(${round2(keyFrame.time)
            }f, KeyframeAnimations.posVec(${round2(x)}f, ${round2(y)}f, ${round2(z)}f), AnimationChannel.Interpolations.${keyFrame.interpolation.toUpperCase()})`;
        }
        outfileText += "))";
      }
      if (boneAnimator.rotation.length) {
        outfileText += `.addAnimation("${boneAnimator._name}",\n new AnimationChannel(AnimationChannel.Targets.ROTATION`;
        //Sorts by time to ensure ordering
        for (const keyFrame of boneAnimator.rotation) {
          rotKeyArray.push(keyFrame);
        }
        rotKeyArray.sort((a, b) => a.time - b.time)

        for (const keyFrame of rotKeyArray) {
          var { x, y, z } = keyFrame.data_points[0];
          outfileText += `,\n new Keyframe(${round2(keyFrame.time)
            }f, KeyframeAnimations.degreeVec(${round2(x)}f, ${round2(y)}f, ${round2(z)}f), AnimationChannel.Interpolations.${keyFrame.interpolation.toUpperCase()})`;
        }
        outfileText += "))";
      }
      if (boneAnimator.scale.length) {
        outfileText += `.addAnimation("${boneAnimator._name}", \n new AnimationChannel(AnimationChannel.Targets.SCALE`;
        //Sorts by time to ensure ordering
        for (const keyFrame of boneAnimator.scale) {
          scaleKeyArray.push(keyFrame);
        }
        scaleKeyArray.sort((a, b) => a.time - b.time)

        for (const keyFrame of scaleKeyArray) {
          var { x, y, z } = keyFrame.data_points[0];
          outfileText += `,\n new Keyframe(${round2(keyFrame.time)
            }f, KeyframeAnimations.scaleVec(${round2(x)}f, ${round2(y)}f, ${round2(z)}f), AnimationChannel.Interpolations.${keyFrame.interpolation.toUpperCase()})`;
        }
        outfileText += "))";
      }
    }
    outfileText += ".build();";
  }
  return outfileText;
}

function round2(x) {
  return Math.round((Number(x) + Number.EPSILON) * 100) / 100;
}
