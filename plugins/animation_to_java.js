(function () {
  var menuButton;

  Plugin.register("animation_to_java", {
    title: "Animation to Java Converter",
    author: "MG",
    description:
      "Converts Blockbench animations to Java code for the new 1.19 keyframe system",
    icon: "fa-cube",
    version: "1.0.0",
    variant: "both",
    about:
      "This plugin exports your blockbench animations as java code to be used for the new 1.19 keyframe system. Please note that this system does not support Molang or step interpolation",
    tags: ["Minecraft: Java Edition"],
    onload() {
      if (!Format.animation_mode) {
        return;
      }
      menuButton = new Action("export_animation_to_java", {
        name: "Export Animations to Java",
        description: "Exports animations to Java code",
        icon: "fa-file-export",
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
      .toUpperCase()} = AnimationDefinition.Builder.withLength(${
      animation.length
    }f)`;
    if (animation.loop === "loop") {
      outfileText += ".looping()";
    }
    for (const id in animation.animators) {
      const boneAnimator = animation.animators[id];
      if (boneAnimator.position.length) {
        outfileText += `.addAnimation("${boneAnimator._name}", new AnimationChannel(AnimationChannel.Targets.POSITION`;
        for (const keyFrame of boneAnimator.scale) {
          const { x, y, z } = keyFrame.data_points[0];
          outfileText += `, new Keyframe(${
            keyFrame.time
          }f, KeyframeAnimations.posVec(${x}f, ${y}f, ${z}f), AnimationChannel.Interpolations.${keyFrame.interpolation.toUpperCase()})`;
        }
        outfileText += "))";
      }
      if (boneAnimator.rotation.length) {
        outfileText += `.addAnimation("${boneAnimator._name}", new AnimationChannel(AnimationChannel.Targets.ROTATION`;
        for (const keyFrame of boneAnimator.rotation) {
          const { x, y, z } = keyFrame.data_points[0];
          outfileText += `, new Keyframe(${
            keyFrame.time
          }f, KeyframeAnimations.degreeVec(${x}f, ${y}f, ${z}f), AnimationChannel.Interpolations.${keyFrame.interpolation.toUpperCase()})`;
        }
        outfileText += "))";
      }
      if (boneAnimator.scale.length) {
        outfileText += `.addAnimation("${boneAnimator._name}", new AnimationChannel(AnimationChannel.Targets.SCALE`;
        for (const keyFrame of boneAnimator.scale) {
          const { x, y, z } = keyFrame.data_points[0];
          outfileText += `, new Keyframe(${
            keyFrame.time
          }f, KeyframeAnimations.scaleVec(${x}f, ${y}f, ${z}f), AnimationChannel.Interpolations.${keyFrame.interpolation.toUpperCase()})`;
        }
        outfileText += "))";
      }
    }
    outfileText += ".build();";
  }
  return outfileText;
}
