import { easingFunctions, EASING_OPTIONS, EASING_DEFAULT, getEasingArgDefault, parseEasingArg } from './Easing';

(function () {
  //#region Helper Functions
  function F(num) {
    var s = trimFloatNumber(num) + "";
    if (!s.includes(".")) {
      s += ".0";
    }
    return s + "F";
  }
  function I(num) {
    return Math.floor(num);
  }

  function lerp(start, stop, amt) {
    return amt * (stop - start) + start;
  };

  function uniq(arr) {
    return arr.reduce((acc, val) => {
      if (!acc.includes(val)) {
        return [...acc, val];
      }
      return acc;
    }, []);
  }

  function compose(...fns) {
     return x => fns.reduceRight((y, f) => f(y), x);
  }

  //#region Codec Helpers / Export Settings
  const MOD_SDK_1_15_FORGE = 'Forge 1.12 - 1.16';
  const MOD_SDK_1_15_FABRIC = 'Fabric 1.15 - 1.16';
  const MOD_SDKS = [MOD_SDK_1_15_FORGE, MOD_SDK_1_15_FABRIC];
  const MOD_SDK_OPTIONS = Object.fromEntries(MOD_SDKS.map(x => [x, x]));

  const GECKO_SETTINGS_DEFAULT = {
    modSDK: MOD_SDK_1_15_FORGE,
    entityType: 'Entity',
    javaPackage: 'com.example.mod',
    animFileNamespace: 'MODID',
    animFilePath: 'animations/ANIMATIONFILE.json',
  };
  Object.freeze(GECKO_SETTINGS_DEFAULT);

  let geckoSettings = Object.assign({}, GECKO_SETTINGS_DEFAULT);

  const getImports = () => {
    switch(geckoSettings.modSDK) {
      case MOD_SDK_1_15_FORGE:
        return `import net.minecraft.util.ResourceLocation;
import software.bernie.geckolib.animation.model.AnimatedEntityModel;
import software.bernie.geckolib.animation.render.AnimatedModelRenderer;`;
      case MOD_SDK_1_15_FABRIC:
        return `import software.bernie.geckolib.forgetofabric.ResourceLocation;
import software.bernie.geckolib.animation.model.AnimatedEntityModel;
import software.bernie.geckolib.animation.model.AnimatedModelRenderer;`;
      default:
        throw new Error(`Unrecognized mod SDK:`, geckoSettings.modSDK);
    }
  };

  const compileCallback = (e) => {
    e.model.geckoSettings = geckoSettings;
    // console.log(`compileCallback model:`, e.model);
  };

  const parseCallback = (e) => {
    // console.log(`parseCallback:`, e);
    if (e.model && typeof e.model.geckoSettings === 'object') {
      Object.assign(geckoSettings, e.model.geckoSettings);
    } else {
      geckoSettings = Object.assign({}, GECKO_SETTINGS_DEFAULT);
    }
  };

  //#endregion Codec Helpers / Export Settings

  //#region Global Animation UI Handlers
  const displayAnimationFrameCallback = (...args) => {
    // const keyframe = $('#keyframe');
    // console.log('displayAnimationFrameCallback:', args, 'keyframe:', keyframe); // keyframe is null here
  };

  const hasArgs = (easing = "") =>
    easing.includes("Back") ||
    easing.includes("Elastic") ||
    easing.includes("Bounce") ||
    easing === EASING_OPTIONS.step;

  function updateKeyframeEasing(obj) {
    // var axis = $(obj).attr('axis');
    const value = $(obj).val();
    // console.log('updateKeyframeEasing value:', value, 'obj:', obj); 
    if (value === "-") return;
    Timeline.selected.forEach((kf) => {
      kf.easing = value;
    })
    updateKeyframeSelection(); // Ensure easingArg display is updated
    // Animator.preview();
  }

  function updateKeyframeEasingArg(obj) {
    if ($(obj).val() === "-") return;
    // console.log('updateKeyframeEasingArg value:', $(obj).val(), 'obj:', obj); 
    Timeline.selected.forEach((kf) => {
      const value = parseEasingArg(kf, $(obj).val().trim());
      kf.easingArgs = [value];
      // obj.value = value;
    })
  }

  const updateKeyframeSelectionCallback = (...args) => {
      $('#keyframe_bar_easing').remove()

      var multi_channel = false;
      var channel = false;
      Timeline.selected.forEach((kf) => {
        if (channel === false) {
          channel = kf.channel
        } else if (channel !== kf.channel) {
          multi_channel = true
        }
      })

      const getMultiSelectValue = (selector, defaultValue, conflictValue) => {
        const selectorFunction = typeof selector === 'function' 
          ? selector
          : x => (x[selector] === undefined ? defaultValue : x[selector]);

        if (Timeline.selected.length > 1) {
          const uniqSelected = uniq(Timeline.selected.map(selectorFunction));
          if (uniqSelected.length === 1) {
            return uniqSelected[0];
          } else {
            return conflictValue;
          }
        } else {
          return selectorFunction(Timeline.selected[0]) || defaultValue;
        }
      };

      const keyframesByChannel = Timeline.keyframes.reduce((acc, kf) => {
        // Dear god I miss lodash
        if (!acc.has(kf.animator)) acc.set(kf.animator, {});
        const animatorChannels = acc.get(kf.animator);
        if (!animatorChannels[kf.channel]) animatorChannels[kf.channel] = [];
        animatorChannels[kf.channel].push(kf);
        animatorChannels[kf.channel].sort((a, b) => {
          if (a.time < b.time) return -1;
          if (a.time > b.time) return 1;
          return 0;
        });
        return acc;
      }, new Map());

      const isFirstInChannel = kf => keyframesByChannel.get(kf.animator)[kf.channel].indexOf(kf) < 1;

      if (Timeline.selected.length && Format.id === "animated_entity_model") {
        if (Timeline.selected.every(kf => kf.animator instanceof BoneAnimator && !isFirstInChannel(kf))) {
          const displayedEasing = getMultiSelectValue('easing', EASING_DEFAULT, 'null');

          const keyframe = document.getElementById('keyframe');
          let easingBar = document.createElement('div');
          keyframe.appendChild(easingBar);
          easingBar.outerHTML = `<div class="bar flex" id="keyframe_bar_easing">
            <label class="tl" style="font-weight: bolder; min-width: 47px;">Easing</label>
          </div>`;
          easingBar = document.getElementById('keyframe_bar_easing');

          let sel = document.createElement('select');
          easingBar.appendChild(sel);
          sel.outerHTML = `<select class="focusable_input" id="keyframe_easing" style="flex: 1; margin-right: 9px;" oninput="updateKeyframeEasing(this)"></select>`;
          sel = document.getElementById('keyframe_easing');

          const easingOptions = displayedEasing !== "null"
            ? EASING_OPTIONS
            : Object.assign({}, { null: "-" }, EASING_OPTIONS);
          for (var key in easingOptions) {
            var name = easingOptions[key];
            const option = document.createElement('option')
            sel.appendChild(option);
            option.outerHTML = `<option id="${key}" ${displayedEasing === key ? 'selected' : ''}>${name}</option>`;
          }

          const getEasingArgLabel = (kf) => {
            switch(kf.easing) {
              case EASING_OPTIONS.easeInBack:
              case EASING_OPTIONS.easeOutBack:
              case EASING_OPTIONS.easeInOutBack:
                return 'Overshoot';
              case EASING_OPTIONS.easeInElastic:
              case EASING_OPTIONS.easeOutElastic:
              case EASING_OPTIONS.easeInOutElastic:
              case EASING_OPTIONS.easeInBounce:
              case EASING_OPTIONS.easeOutBounce:
              case EASING_OPTIONS.easeInOutBounce:
                return 'Bounciness';
              case EASING_OPTIONS.step:
                return 'Steps';
              default:
                return 'N/A';
            }
          };
          const easingArgLabel = getMultiSelectValue(getEasingArgLabel, null, null);
          if (Timeline.selected.every(kf => hasArgs(kf.easing)) && easingArgLabel !== null) {
            const argDefault = getMultiSelectValue(getEasingArgDefault, null, null);
            const [displayedValue] = getMultiSelectValue('easingArgs', [argDefault], [argDefault]);
            let scaleBar = document.createElement('div');
            keyframe.appendChild(scaleBar);
            scaleBar.outerHTML = `<div class="bar flex" id="keyframe_bar_easing_arg1">
              <label class="tl" style="font-weight: bolder; min-width: 90px;">${easingArgLabel}</label>
              <input type="number" id="keyframe_easing_scale" class="dark_bordered code keyframe_input tab_target" value="${displayedValue}" oninput="updateKeyframeEasingArg(this)" style="flex: 1; margin-right: 9px;">
            </div>`;
            scaleBar = document.getElementById('keyframe_bar_easing_arg1');
          }

          // console.log('easingBar:', easingBar, 'keyframe:', keyframe);
      }
    }
  };

  //#endregion Global Animation UI Handlers

  //#region Keyframe Mixins
  const Original = new Map();
  const addMonkeypatch = (symbol, path, functionKey, newFunction) => {
    const pathAccessor = path ? symbol[path] : symbol;
    if(!Original.get(symbol)) Original.set(symbol, { _pathAccessor: pathAccessor });
    Original.get(symbol)[functionKey] = pathAccessor[functionKey];
    pathAccessor[functionKey] = newFunction;
  };
  const removeMonkeypatches = () => {
    Original.forEach(symbol => {
      Object.keys(symbol).forEach(functionKey => {
        if(functionKey.startsWith('_')) return;
        symbol._pathAccessor[functionKey] = symbol[functionKey];
      });
    });
    Original.clear();
  }
  function keyframeGetLerp(other, axis, amount, allow_expression) {
      const easing = other.easing || EASING_DEFAULT;
      if (Format.id !== "animated_entity_model") {
        return Original.get(Keyframe).getLerp.apply(this, arguments);
      }
      let easingFunc = easingFunctions[easing];
      if (hasArgs(easing)) {
        const arg1 = Array.isArray(other.easingArgs) && other.easingArgs.length > 0
          ? other.easingArgs[0]
          : getEasingArgDefault(other);
        // console.log(`keyframeGetLerp arg1: ${arg1}`);
        easingFunc = easingFunc.bind(null, arg1);
      }
      const easedAmount = easingFunc(amount); 
      const start = this.calc(axis);
      const stop = other.calc(axis);
      const result = lerp(start, stop, easedAmount);
      // console.log('keyframeGetLerp easing:', easing, 'arguments:', arguments, 'start:', start, 'stop:', stop, 'amount:', amount, 'easedAmount:', easedAmount, 'result:', result);
      if (Number.isNaN(result)) {
        throw new Error('batman');
      }
      return result;
  }

  function keyframeGetArray() {
      const { easing, easingArgs } = this;
      let result = Original.get(Keyframe).getArray.apply(this, arguments);
      if (Format.id === "animated_entity_model") {
        result = { vector: result, easing };
        if (hasArgs(easing)) result.easingArgs = easingArgs;
      }
      // console.log('keyframeGetArray arguments:', arguments, 'this:', this, 'result:', result);
      return result;
  }

  function keyframeGetUndoCopy() {
      const { easing, easingArgs } = this;
      const result = Original.get(Keyframe).getUndoCopy.apply(this, arguments);
      if (Format.id === "animated_entity_model") {
        Object.assign(result, { easing });
        if (hasArgs(easing)) result.easingArgs = easingArgs;
      }
      // console.log('keyframeGetUndoCopy arguments:', arguments, 'this:', this, 'result:', result);
      return result;
  }

  function keyframeExtend(data) {
    if (Format.id === "animated_entity_model") {
      if (typeof data.values === 'object') {
        if (data.values.easing !== undefined) {
          Merge.string(this, data.values, 'easing');
        }
        if (Array.isArray(data.values.easingArgs)) {
          this.easingArgs = data.values.easingArgs;
        }
        // Convert data to format expected by KeyframeExtendOriginal
        data.values = data.values.vector;
      } else {
        if (data.easing !== undefined) {
            Merge.string(this, data, 'easing');
        }
        if (Array.isArray(data.easingArgs)) {
          this.easingArgs = data.easingArgs;
        }
      }
    }
    const result = Original.get(Keyframe).extend.apply(this, arguments);
    // console.log('keyframeExtend arguments:', arguments, 'this:', this, 'result:', result);
    return result;
  }

  function reverseKeyframesCondition() {
    const res = Original.get(BarItems.reverse_keyframes).condition() && Format.id !== "animated_entity_model";
    // console.log('reverseKeyframesCondition original:',Original.get(BarItems.reverse_keyframes).condition(), 'res:', res);
    return res;
  }

  //#endregion Keyframe Mixins

  //#region Plugin Definition
  const PLUGIN_VERSION = "2.0.0";
  const MIN_BLOCKBENCH_VERSION = "3.6";
  let exportAction;
  let button;
  let holdMenu;
  let holdMenuConditionOriginal;

  Plugin.register("animation_utils", {
    name: "GeckoLib Animation Utils",
    author: "Eliot Lash, Gecko",
    title: "GeckoLib Animation Utils",
    description:
      `This plugin lets you create animated java entities with GeckoLib. This plugin requires Blockbench ${MIN_BLOCKBENCH_VERSION} or higher. Learn about GeckoLib here: https://github.com/bernie-g/geckolib`,
    icon: "movie_filter",
    version: PLUGIN_VERSION,
    min_version: MIN_BLOCKBENCH_VERSION,
    variant: "both",
    onload() {
      Codecs.project.on('compile', compileCallback);
      Codecs.project.on('parse', parseCallback);
      Blockbench.on('display_animation_frame', displayAnimationFrameCallback);
      Blockbench.on('update_keyframe_selection', updateKeyframeSelectionCallback);

      addMonkeypatch(Keyframe, "prototype", "getLerp", keyframeGetLerp);
      addMonkeypatch(Keyframe, "prototype", "getArray", keyframeGetArray);
      addMonkeypatch(Keyframe, "prototype", "getUndoCopy", keyframeGetUndoCopy);
      addMonkeypatch(Keyframe, "prototype", "extend", keyframeExtend);

      addMonkeypatch(BarItems.reverse_keyframes, null, "condition", reverseKeyframesCondition);
      
      addMonkeypatch(global, null, "updateKeyframeEasing", updateKeyframeEasing);
      addMonkeypatch(global, null, "updateKeyframeEasingArg", updateKeyframeEasingArg);

      holdMenu = Animation.prototype.menu.structure.find(x => x.name === 'menu.animation.loop')
        .children.find(x => x.name === 'menu.animation.loop.hold');
      holdMenuConditionOriginal = holdMenu.condition;
      holdMenu.condition = () => Format.id !== "animated_entity_model";

      exportAction = new Action({
        id: "export_animated_entity_model",
        name: "Export Animated Java Entity",
        icon: "archive",
        description:
          "Export your java animated model as a model for GeckoLib.",
        category: "file",
        condition: () => Format.id === "animated_entity_model",
        click: function () {
          codec.export();
        },
      });
      MenuBar.addAction(exportAction, "file.export");

      button = new Action('gecko_settings', {
        name: 'Animated Entity Settings...',
        description: 'Customize animated entity export.',
        icon: 'info',
        condition: () => Format.id === "animated_entity_model",
        click: function () {
          var dialog = new Dialog({
            id: 'project',
            title: 'Animated Entity Settings',
            width: 540,
            lines: [`<b class="tl"><a href="https://github.com/bernie-g/geckolib">GeckoLib</a> Animation Utils v${PLUGIN_VERSION}</b>`],
            form: {
              modSDK: {label: 'Modding SDK', type: 'select', default: geckoSettings.modSDK, options: MOD_SDK_OPTIONS},
              entityType: {label: 'Entity Type', value: geckoSettings.entityType },
              javaPackage: {label: 'Java Package', value: geckoSettings.javaPackage},
              animFileNamespace: {label: 'Animation File Namespace', value: geckoSettings.animFileNamespace},
              animFilePath: {label: 'Animation File Path', value: geckoSettings.animFilePath},
            },
            onConfirm: function(formResult) {
              Object.assign(geckoSettings, formResult);
              dialog.hide()
            }
          })
          dialog.show()
        }
      });
      MenuBar.addAction(button, 'file.1');
    },
    onunload() {
      Codecs.project.events.compile.remove(compileCallback)
      Codecs.project.events.parse.remove(parseCallback)
      Blockbench.removeListener('display_animation_frame', displayAnimationFrameCallback);
      Blockbench.removeListener('update_keyframe_selection', updateKeyframeSelectionCallback);
      exportAction.delete();
      button.delete();
      removeMonkeypatches();
      holdMenu.condition = holdMenuConditionOriginal;
      console.clear();
    },
  });
  //#endregion Plugin Definition

  //#region Codec / ModelFormat
  const Templates = {
    "1.15": {
      name: "1.15",
      flip_y: true,
      integer_size: false,
      file: `// Made with Blockbench %(bb_version)
// Exported for Minecraft version 1.12.2 or 1.15.2 (same format for both) for entity models animated with GeckoLib
// Paste this class into your mod and follow the documentation for GeckoLib to use animations. You can find the documentation here: https://github.com/bernie-g/geckolib
// Blockbench plugin created by Gecko
package %(javaPackage);

%(imports)

public class %(identifier) extends AnimatedEntityModel<%(entityType)> {

    %(fields)

    public %(identifier)()
    {
        textureWidth = %(texture_width);
    textureHeight = %(texture_height);
    %(content)

    %(renderers)
  }


    @Override
    public ResourceLocation getAnimationFileLocation()
    {
        return new ResourceLocation("%(animFileNamespace)", "%(animFilePath)");
    }
}`,
      field: `private final AnimatedModelRenderer %(bone);`,

      bone: `%(bone) = new AnimatedModelRenderer(this);
%(bone).setRotationPoint(%(x), %(y), %(z));
?(has_parent)%(parent).addChild(%(bone));
?(has_rotation)setRotationAngle(%(bone), %(rx), %(ry), %(rz));
%(cubes)
%(bone).setModelRendererName(\"%(bone)\");
this.registerModelRenderer(%(bone));`,
      renderer: `this.rootBones.add(%(bone));`,
      cube: `%(bone).setTextureOffset(%(uv_x), %(uv_y)).addBox(%(x), %(y), %(z), %(dx), %(dy), %(dz), %(inflate), %(mirror));`,
    },

    get(key, version = Project.modded_entity_version) {
      let temp = Templates[version][key];
      if (typeof temp === "string") temp = temp.replace(/\t\t\t/g, "");
      return temp;
    },
    keepLine(line) {
      return line.replace(/\?\(\w+\)/, "");
    },
    getVariableRegex(name) {
      return new RegExp(`%\\(${name}\\)`, "g");
    },
  };

  function getIdentifier() {
    return (
      Project.geometry_name.replace(/[\s-]+/g, "_") ||
      "animated_entity_model"
    );
  }

  var codec = new Codec("animated_entity_model", {
    name: "Animated Java Class",
    extension: "java",
    remember: true,
    compile(options) {
      let R = Templates.getVariableRegex;
      let identifier = getIdentifier();

      let all_groups = getAllGroups();
      let loose_cubes = [];
      Cube.all.forEach((cube) => {
        if (cube.parent == "root") loose_cubes.push(cube);
      });
      if (loose_cubes.length) {
        all_groups.push({
          name: "bb_main",
          rotation: [0, 0, 0],
          origin: [0, 0, 0],
          parent: "root",
          children: loose_cubes,
        });
      }

      let model = Templates.get("file");

      model = model.replace(R("bb_version"), Blockbench.version);

      model = model.replace(R("javaPackage"), geckoSettings.javaPackage);
      model = model.replace(R("imports"), getImports());

      model = model.replace(R("identifier"), identifier);
      model = model.replace(R("entityType"), geckoSettings.entityType);

      model = model.replace(R("texture_width"), Project.texture_width);
      model = model.replace(R("texture_height"), Project.texture_height);

      model = model.replace(R("animFileNamespace"), geckoSettings.animFileNamespace);
      model = model.replace(R("animFilePath"), geckoSettings.animFilePath);

      model = model.replace(R("fields"), () => {
        let group_snippets = [];
        for (var group of all_groups) {
          if (group instanceof Group === false || !group.export)
            continue;
          let snippet = Templates.get("field").replace(
            R("bone"),
            group.name
          );
          group_snippets.push(snippet);
        }
        return group_snippets.join("\n\t");
      });

      model = model.replace(R("content"), () => {
        let group_snippets = [];
        for (var group of all_groups) {
          if (group instanceof Group === false || !group.export)
            continue;
          let snippet = Templates.get("bone")

            .replace(R("bone"), group.name)

            .replace(
              /\n\?\(has_rotation\).+/,
              group.rotation.allEqual(0) ? "" : Templates.keepLine
            );

          snippet = snippet
            .replace(R("rx"), F(Math.degToRad(-group.rotation[0])))
            .replace(R("ry"), F(Math.degToRad(-group.rotation[1])))
            .replace(R("rz"), F(Math.degToRad(group.rotation[2])));

          var origin = group.origin.slice();
          if (group.parent instanceof Group) {
            origin.V3_subtract(group.parent.origin);
          }
          origin[0] *= -1;
          if (Templates.get("flip_y")) {
            origin[1] *= -1;
            if (group.parent instanceof Group === false) {
              origin[1] += 24;
            }
          }

          snippet = snippet
            .replace(R("x"), F(origin[0]))
            .replace(R("y"), F(origin[1]))
            .replace(R("z"), F(origin[2]))

            .replace(
              /\n\?\(has_parent\).+/,
              group.parent instanceof Group
                ? Templates.keepLine
                : ""
            )
            .replace(R("parent"), group.parent.name)

            .replace(R("cubes"), () => {
              let cube_snippets = [];
              for (var cube of group.children) {
                if (
                  cube instanceof Cube === false ||
                  !cube.export
                )
                  continue;

                let c_snippet = Templates.get("cube")
                  .replace(R("bone"), group.name)

                  .replace(R("uv_x"), I(cube.uv_offset[0]))
                  .replace(R("uv_y"), I(cube.uv_offset[1]))

                  .replace(R("inflate"), F(cube.inflate))
                  .replace(R("mirror"), cube.mirror_uv);

                if (Templates.get("flip_y")) {
                  c_snippet = c_snippet
                    .replace(
                      R("x"),
                      F(group.origin[0] - cube.to[0])
                    )
                    .replace(
                      R("y"),
                      F(
                        -cube.from[1] -
                          cube.size(1) +
                          group.origin[1]
                      )
                    )
                    .replace(
                      R("z"),
                      F(cube.from[2] - group.origin[2])
                    );
                } else {
                  c_snippet = c_snippet
                    .replace(
                      R("x"),
                      F(group.origin[0] - cube.to[0])
                    )
                    .replace(
                      R("y"),
                      F(cube.from[1] - group.origin[1])
                    )
                    .replace(
                      R("z"),
                      F(cube.from[2] - group.origin[2])
                    );
                }
                if (Templates.get("integer_size")) {
                  c_snippet = c_snippet
                    .replace(R("dx"), I(cube.size(0, true)))
                    .replace(R("dy"), I(cube.size(1, true)))
                    .replace(
                      R("dz"),
                      I(cube.size(2, true))
                    );
                } else {
                  c_snippet = c_snippet
                    .replace(R("dx"), F(cube.size(0, true)))
                    .replace(R("dy"), F(cube.size(1, true)))
                    .replace(
                      R("dz"),
                      F(cube.size(2, true))
                    );
                }

                cube_snippets.push(c_snippet);
              }
              return cube_snippets.join("\n");
            })
            .replace(/\n/g, "\n\t\t");

          group_snippets.push(snippet);
        }
        return group_snippets.join("\n\n\t\t");
      });

      model = model.replace(R("renderers"), () => {
        let group_snippets = [];
        for (var group of all_groups) {
          if (group instanceof Group === false || !group.export)
            continue;
          if (
            !Templates.get("render_subgroups") &&
            group.parent instanceof Group
          )
            continue;

          let snippet = Templates.get("renderer").replace(
            R("bone"),
            group.name
          );
          group_snippets.push(snippet);
        }
        return group_snippets.join("\n\t\t");
      });

      this.dispatchEvent("compile", { model, options });
      return model;
    },
    parse(model, path, add) {
      this.dispatchEvent("parse", { model });

      var lines = [];
      model.split("\n").forEach((l) => {
        l = l
          .replace(/\/\*[^(\*\/)]*\*\/|\/\/.*/g, "")
          .trim()
          .replace(/;$/, "");
        if (l) {
          lines.push(l);
        }
      });

      function parseScheme(scheme, input) {
        scheme = scheme
          .replace(/\(/g, "\\(")
          .replace(/\)/g, "\\)")
          .replace(/\./g, "\\.");
        var parts = scheme.split("$");
        var regexstring = "";
        var results = [];
        var location = 0;
        var i = 0;
        for (var part of parts) {
          if (i == 0) {
            var partmatch = new RegExp("^" + part).exec(input);
            if (partmatch == null) return;

            location = partmatch[0].length;
          } else {
            var key = part.substr(0, 1);
            part = part.substr(1);
            var key_regex = "";
            switch (key) {
              case "v":
                key_regex = "^[a-zA-Z_][a-zA-Z0-9_]+";
                break;
              case "i":
                key_regex = "^-?\\d+";
                break;
              case "f":
                key_regex = "^-?\\d+\\.?\\d*F";
                break;
              case "d":
                key_regex = "^-?\\d+\\.?\\d*";
                break;
              case "b":
                key_regex = "^true|false";
                break;
            }
            var partmatch = new RegExp(key_regex + part).exec(
              input.substr(location)
            );
            if (partmatch == null) return;

            var variable = new RegExp(key_regex).exec(
              input.substr(location)
            )[0];
            switch (key) {
              case "v":
                results.push(variable);
                break;
              case "i":
                results.push(parseInt(variable));
                break;
              case "f":
                results.push(
                  parseFloat(variable.replace(/F$/, ""))
                );
                break;
              case "d":
                results.push(
                  parseFloat(variable.replace(/F$/, ""))
                );
                break;
              case "b":
                results.push(variable == "true");
                break;
            }
            location += partmatch[0].length;
          }

          i++;
        }
        match = results;
        return true;
      }
      var scope = 0,
        bones = {},
        geo_name,
        match,
        last_uv;

      lines.forEach((line) => {
        if (scope == 0) {
          if (/^public class/.test(line)) {
            scope = 1;
            geo_name = line.split(/[\s<>()\.]+/g)[2];
          }
        } else if (scope == 1) {
          line = line
            .replace(/public |static |final |private |void /g, "")
            .trim();
          if (
            line.substr(0, 13) == "AnimatedModelRenderer" ||
            line.substr(0, 13) == "RendererModel"
          ) {
            let name = line.split(" ")[1];
            bones[name] = new Group({
              name,
              origin: [0, 24, 0],
            }).init();
          } else if (line.substr(0, geo_name.length) == geo_name) {
            scope = 2;
          }
        } else if (scope == 2) {
          line = line.replace(/^this\./, "");
          match = undefined;

          if (line == "}") {
            scope--;
          } else if (parseScheme("textureWidth = $i", line)) {
            Project.texture_width = match[0];
          } else if (parseScheme("textureHeight = $i", line)) {
            Project.texture_height = match[0];
          } else if (parseScheme("super($v, $i, $i)", line)) {
            Project.texture_width = match[1];
            Project.texture_height = match[2];
          } else if (
            parseScheme(
              "AnimatedModelRenderer $v = new AnimatedModelRenderer(this, $i, $i)",
              line
            ) ||
            parseScheme(
              "RendererModel $v = new RendererModel(this, $i, $i)",
              line
            ) ||
            parseScheme(
              "$v = new AnimatedModelRenderer(this, $i, $i)",
              line
            ) ||
            parseScheme(
              "$v = new RendererModel(this, $i, $i)",
              line
            )
          ) {
            if (!bones[match[0]]) {
              bones[match[0]] = new Group({
                name: match[0],
                origin: [0, 24, 0],
              }).init();
            }
            last_uv = [match[1], match[2]];
          } else if (
            parseScheme(
              "$v = new AnimatedModelRenderer(this)",
              line
            )
          ) {
            // Blockbench for 1.15
            if (!bones[match[0]]) {
              bones[match[0]] = new Group({
                name: match[0],
                origin: [0, 0, 0],
              }).init();
            }
          } else if (
            parseScheme("$v.setRotationPoint($f, $f, $f)", line)
          ) {
            var bone = bones[match[0]];
            if (bone) {
              bone.extend({
                origin: [-match[1], 24 - match[2], match[3]],
              });
              bone.children.forEach((cube) => {
                if (cube instanceof Cube) {
                  cube.from[0] += bone.origin[0];
                  cube.to[0] += bone.origin[0];
                  cube.from[1] += bone.origin[1] - 24;
                  cube.to[1] += bone.origin[1] - 24;
                  cube.from[2] += bone.origin[2];
                  cube.to[2] += bone.origin[2];
                }
              });
            }
          } else if (
            parseScheme(
              "$v.addChild($v)",
              line.replace(/\(this\./g, "(")
            )
          ) {
            var child = bones[match[1]],
              parent = bones[match[0]];
            child.addTo(parent);
            child.origin.V3_add(parent.origin);
            child.origin[1] -= 24;

            child.children.forEach((cube) => {
              if (cube instanceof Cube) {
                cube.from[0] += parent.origin[0];
                cube.to[0] += parent.origin[0];
                cube.from[1] += parent.origin[1] - 24;
                cube.to[1] += parent.origin[1] - 24;
                cube.from[2] += parent.origin[2];
                cube.to[2] += parent.origin[2];
              }
            });
          }

          //Cubes
          else if (
            parseScheme(
              "$v.cubeList.add(new ModelBox($v, $i, $i, $f, $f, $f, $i, $i, $i, $f, $b))",
              line
            )
          ) {
            var group = bones[match[0]];
            var cube = new Cube({
              name: match[0],
              uv_offset: [match[2], match[3]],
              from: [
                group.origin[0] - match[4] - match[7],
                group.origin[1] - match[5] - match[8],
                group.origin[2] + match[6],
              ],
              inflate: match[10],
              mirror_uv: match[11],
            });
            cube.extend({
              to: [
                cube.from[0] + Math.floor(match[7]),
                cube.from[1] + Math.floor(match[8]),
                cube.from[2] + Math.floor(match[9]),
              ],
            });
            cube.addTo(bones[match[0]]).init();
          } else if (
            parseScheme(
              "$v.addBox($f, $f, $f, $i, $i, $i)",
              line
            ) ||
            parseScheme(
              "$v.addBox($f, $f, $f, $i, $i, $i, $v)",
              line
            ) ||
            parseScheme(
              "$v.addBox($f, $f, $f, $i, $i, $i, $f)",
              line
            )
          ) {
            var group = bones[match[0]];
            var cube = new Cube({
              name: match[0],
              uv_offset: last_uv,
              from: [
                group.origin[0] - match[1] - match[4],
                group.origin[1] - match[2] - match[5],
                group.origin[2] + match[3],
              ],
              inflate: typeof match[7] == "number" ? match[7] : 0,
              mirror_uv: group.mirror_uv,
            });
            cube.extend({
              to: [
                cube.from[0] + Math.floor(match[4]),
                cube.from[1] + Math.floor(match[5]),
                cube.from[2] + Math.floor(match[6]),
              ],
            });
            cube.addTo(bones[match[0]]).init();
          } else if (
            parseScheme(
              "$v.setTextureOffset($i, $i).addBox($f, $f, $f, $f, $f, $f, $f, $b)",
              line
            )
          ) {
            var group = bones[match[0]];
            var cube = new Cube({
              name: match[0],
              uv_offset: [match[1], match[2]],
              from: [
                group.origin[0] - match[3] - match[6],
                group.origin[1] - match[4] - match[7],
                group.origin[2] + match[5],
              ],
              inflate: match[9],
              mirror_uv: match[10],
            });
            cube.extend({
              to: [
                cube.from[0] + Math.floor(match[6]),
                cube.from[1] + Math.floor(match[7]),
                cube.from[2] + Math.floor(match[8]),
              ],
            });
            cube.addTo(bones[match[0]]).init();
          }

          //Rotation
          else if (
            parseScheme("setRotationAngle($v, $f, $f, $f)", line)
          ) {
            //blockbench
            var group = bones[match[0]];
            if (group) {
              group.extend({
                rotation: [
                  -Math.radToDeg(match[1]),
                  -Math.radToDeg(match[2]),
                  Math.radToDeg(match[3]),
                ],
              });
            }
          } else if (
            parseScheme("setRotation($v, $f, $f, $f)", line)
          ) {
            //cubik
            var group = bones[match[0]];
            if (group) {
              group.extend({
                rotation: [
                  -Math.radToDeg(match[1]),
                  -Math.radToDeg(match[2]),
                  Math.radToDeg(match[3]),
                ],
              });
            }
          } else if (
            parseScheme("setRotateAngle($v, $f, $f, $f)", line)
          ) {
            //tabula
            var group = bones[match[0]];
            if (group) {
              group.extend({
                rotation: [
                  -Math.radToDeg(match[1]),
                  -Math.radToDeg(match[2]),
                  Math.radToDeg(match[3]),
                ],
              });
            }
          } else if (parseScheme("$v.rotateAngleX = $f", line)) {
            //default
            var group = bones[match[0]];
            if (group) {
              group.rotation[0] = -Math.radToDeg(match[1]);
            }
          } else if (parseScheme("$v.rotateAngleY = $f", line)) {
            //default
            var group = bones[match[0]];
            if (group) {
              group.rotation[1] = -Math.radToDeg(match[1]);
            }
          } else if (parseScheme("$v.rotateAngleZ = $f", line)) {
            //default
            var group = bones[match[0]];
            if (group) {
              group.rotation[2] = Math.radToDeg(match[1]);
            }
          } else if (parseScheme("$v.mirror = $b", line)) {
            var group = bones[match[0]];
            group.mirror_uv = match[1];
            group.children.forEach((cube) => {
              cube.mirror_uv = match[1];
            });
          }
        }
      });
      Canvas.updateAll();
    },
    fileName() {
      return getIdentifier();
    },
  });
  codec.templates = Templates;

  var format = new ModelFormat({
    id: "animated_entity_model",
    name: "Animated Java Entity",
    description: "Animated Entity for Java mods using GeckoLib",
    icon: "icon-format_java",
    codec,
    box_uv: true,
    single_texture: true,
    bone_rig: true,
    centered_grid: true,
    integer_size: true,
    animation_mode: true,
  });
  //Object.defineProperty(format, 'integer_size', {get: _ => Templates.get('integer_size')})
  codec.format = format;

  //#endregion Codec / ModelFormat
})();
