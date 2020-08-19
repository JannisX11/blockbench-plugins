/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./animationUi.js":
/*!************************!*\
  !*** ./animationUi.js ***!
  \************************/
/*! exports provided: loadAnimationUI, unloadAnimationUI, displayAnimationFrameCallback, updateKeyframeEasing, updateKeyframeEasingArg, updateKeyframeSelectionCallback */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadAnimationUI", function() { return loadAnimationUI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unloadAnimationUI", function() { return unloadAnimationUI; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "displayAnimationFrameCallback", function() { return displayAnimationFrameCallback; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateKeyframeEasing", function() { return updateKeyframeEasing; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateKeyframeEasingArg", function() { return updateKeyframeEasingArg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateKeyframeSelectionCallback", function() { return updateKeyframeSelectionCallback; });
/* harmony import */ var lodash_uniq__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/uniq */ "./node_modules/lodash/uniq.js");
/* harmony import */ var lodash_uniq__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_uniq__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./utils.js");
/* harmony import */ var _easing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./easing */ "./easing.js");




let holdMenu;
let holdMenuConditionOriginal;

const loadAnimationUI = () => {
  Blockbench.on('display_animation_frame', displayAnimationFrameCallback);
  Blockbench.on('update_keyframe_selection', updateKeyframeSelectionCallback);

  Object(_utils__WEBPACK_IMPORTED_MODULE_1__["addMonkeypatch"])(global, null, "updateKeyframeEasing", updateKeyframeEasing);
  Object(_utils__WEBPACK_IMPORTED_MODULE_1__["addMonkeypatch"])(global, null, "updateKeyframeEasingArg", updateKeyframeEasingArg);

  holdMenu = Animation.prototype.menu.structure.find(x => x.name === 'menu.animation.loop')
    .children.find(x => x.name === 'menu.animation.loop.hold');
  holdMenuConditionOriginal = holdMenu.condition;
  holdMenu.condition = () => Format.id !== "animated_entity_model";
};

const unloadAnimationUI = () => {
  Blockbench.removeListener('display_animation_frame', displayAnimationFrameCallback);
  Blockbench.removeListener('update_keyframe_selection', updateKeyframeSelectionCallback);
  holdMenu.condition = holdMenuConditionOriginal;
};

//#region Global Animation UI Handlers
const displayAnimationFrameCallback = (...args) => {
  // const keyframe = $('#keyframe');
  // console.log('displayAnimationFrameCallback:', args, 'keyframe:', keyframe); // keyframe is null here
};

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
    const value = Object(_easing__WEBPACK_IMPORTED_MODULE_2__["parseEasingArg"])(kf, $(obj).val().trim());
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
        const uniqSelected = lodash_uniq__WEBPACK_IMPORTED_MODULE_0___default()(Timeline.selected.map(selectorFunction));
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
        const displayedEasing = getMultiSelectValue('easing', _easing__WEBPACK_IMPORTED_MODULE_2__["EASING_DEFAULT"], 'null');

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
          ? _easing__WEBPACK_IMPORTED_MODULE_2__["EASING_OPTIONS"]
          : Object.assign({}, { null: "-" }, _easing__WEBPACK_IMPORTED_MODULE_2__["EASING_OPTIONS"]);
        for (var key in easingOptions) {
          var name = easingOptions[key];
          const option = document.createElement('option')
          sel.appendChild(option);
          option.outerHTML = `<option id="${key}" ${displayedEasing === key ? 'selected' : ''}>${name}</option>`;
        }

        const getEasingArgLabel = (kf) => {
          switch(kf.easing) {
            case _easing__WEBPACK_IMPORTED_MODULE_2__["EASING_OPTIONS"].easeInBack:
            case _easing__WEBPACK_IMPORTED_MODULE_2__["EASING_OPTIONS"].easeOutBack:
            case _easing__WEBPACK_IMPORTED_MODULE_2__["EASING_OPTIONS"].easeInOutBack:
              return 'Overshoot';
            case _easing__WEBPACK_IMPORTED_MODULE_2__["EASING_OPTIONS"].easeInElastic:
            case _easing__WEBPACK_IMPORTED_MODULE_2__["EASING_OPTIONS"].easeOutElastic:
            case _easing__WEBPACK_IMPORTED_MODULE_2__["EASING_OPTIONS"].easeInOutElastic:
            case _easing__WEBPACK_IMPORTED_MODULE_2__["EASING_OPTIONS"].easeInBounce:
            case _easing__WEBPACK_IMPORTED_MODULE_2__["EASING_OPTIONS"].easeOutBounce:
            case _easing__WEBPACK_IMPORTED_MODULE_2__["EASING_OPTIONS"].easeInOutBounce:
              return 'Bounciness';
            case _easing__WEBPACK_IMPORTED_MODULE_2__["EASING_OPTIONS"].step:
              return 'Steps';
            default:
              return 'N/A';
          }
        };
        const easingArgLabel = getMultiSelectValue(getEasingArgLabel, null, null);
        if (Timeline.selected.every(kf => Object(_utils__WEBPACK_IMPORTED_MODULE_1__["hasArgs"])(kf.easing)) && easingArgLabel !== null) {
          const argDefault = getMultiSelectValue(_easing__WEBPACK_IMPORTED_MODULE_2__["getEasingArgDefault"], null, null);
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

/***/ }),

/***/ "./codec.js":
/*!******************!*\
  !*** ./codec.js ***!
  \******************/
/*! exports provided: loadCodec, unloadCodec */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadCodec", function() { return loadCodec; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unloadCodec", function() { return unloadCodec; });
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settings */ "./settings.js");

//#region Codec Helpers / Export Settings

function loadCodec() {
  // The actual Codec is automatically registered by superclass constructor
  Codecs.project.on('compile', compileCallback);
  Codecs.project.on('parse', parseCallback);
}

function unloadCodec() {
  Codecs.project.events.compile.remove(compileCallback)
  Codecs.project.events.parse.remove(parseCallback)
}

function compileCallback(e) {
  if (Format.id !== "animated_entity_model") return;
  e.model.geckoSettings = _settings__WEBPACK_IMPORTED_MODULE_0__["default"];
  // console.log(`compileCallback model:`, e.model);
};

function parseCallback(e) {
  // console.log(`parseCallback:`, e);
  if (e.model && typeof e.model.geckoSettings === 'object') {
    Object.assign(_settings__WEBPACK_IMPORTED_MODULE_0__["default"], e.model.geckoSettings);
  } else {
    Object.assign(_settings__WEBPACK_IMPORTED_MODULE_0__["default"], _settings__WEBPACK_IMPORTED_MODULE_0__["GECKO_SETTINGS_DEFAULT"]);
  }
};

const getImports = () => {
  switch(_settings__WEBPACK_IMPORTED_MODULE_0__["default"].modSDK) {
    case _settings__WEBPACK_IMPORTED_MODULE_0__["MOD_SDK_1_15_FORGE"]:
      return `import net.minecraft.util.ResourceLocation;
import software.bernie.geckolib.animation.model.AnimatedEntityModel;
import software.bernie.geckolib.animation.render.AnimatedModelRenderer;`;
    case _settings__WEBPACK_IMPORTED_MODULE_0__["MOD_SDK_1_15_FABRIC"]:
      return `import software.bernie.geckolib.forgetofabric.ResourceLocation;
import software.bernie.geckolib.animation.model.AnimatedEntityModel;
import software.bernie.geckolib.animation.render.AnimatedModelRenderer;`;
    default:
      throw new Error(`Unrecognized mod SDK:`, _settings__WEBPACK_IMPORTED_MODULE_0__["default"].modSDK);
  }
};

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

//#endregion Codec Helpers / Export Settings

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

    model = model.replace(R("javaPackage"), _settings__WEBPACK_IMPORTED_MODULE_0__["default"].javaPackage);
    model = model.replace(R("imports"), getImports());

    model = model.replace(R("identifier"), identifier);
    model = model.replace(R("entityType"), _settings__WEBPACK_IMPORTED_MODULE_0__["default"].entityType);

    model = model.replace(R("texture_width"), Project.texture_width);
    model = model.replace(R("texture_height"), Project.texture_height);

    model = model.replace(R("animFileNamespace"), _settings__WEBPACK_IMPORTED_MODULE_0__["default"].animFileNamespace);
    model = model.replace(R("animFilePath"), _settings__WEBPACK_IMPORTED_MODULE_0__["default"].animFilePath);

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

const format = new ModelFormat({
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

/***/ }),

/***/ "./easing.js":
/*!*******************!*\
  !*** ./easing.js ***!
  \*******************/
/*! exports provided: easingFunctions, EASING_OPTIONS, EASING_DEFAULT, getEasingArgDefault, parseEasingArg */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "easingFunctions", function() { return easingFunctions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EASING_OPTIONS", function() { return EASING_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EASING_DEFAULT", function() { return EASING_DEFAULT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEasingArgDefault", function() { return getEasingArgDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseEasingArg", function() { return parseEasingArg; });
// The MIT license notice below applies to the function findIntervalBorderIndex
/* The MIT License (MIT)

Copyright (c) 2015 Boris Chumichev

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 *
 * Utilizes bisection method to search an interval to which
 * point belongs to, then returns an index of left or right
 * border of the interval
 *
 * @param {Number} point
 * @param {Array} intervals
 * @param {Boolean} useRightBorder
 * @returns {Number}
 */
function findIntervalBorderIndex(point, intervals, useRightBorder) {
  //If point is beyond given intervals
  if (point < intervals[0])
    return 0
  if (point > intervals[intervals.length - 1])
    return intervals.length - 1
  //If point is inside interval
  //Start searching on a full range of intervals
  var indexOfNumberToCompare = 0;
  var leftBorderIndex = 0;
  var rightBorderIndex = intervals.length - 1
  //Reduce searching range till it find an interval point belongs to using binary search
  while (rightBorderIndex - leftBorderIndex !== 1) {
    indexOfNumberToCompare = leftBorderIndex + Math.floor((rightBorderIndex - leftBorderIndex) / 2)
    point >= intervals[indexOfNumberToCompare] ?
      leftBorderIndex = indexOfNumberToCompare :
      rightBorderIndex = indexOfNumberToCompare
  }
  return useRightBorder ? rightBorderIndex : leftBorderIndex
}

function stepRange(steps, stop = 1) {
  if (steps < 2) throw new Error("steps must be > 2, got:" + steps);
  const stepLength = stop / steps;
  return Array.from({
    length: steps
  }, (_, i) => i * stepLength);
};

// The MIT license notice below applies to the Easing class
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
class Easing {
    /**
     * A stepping function, returns 1 for any positive value of `n`.
     */
    static step0(n) {
        return n > 0 ? 1 : 0;
    }
    /**
     * A stepping function, returns 1 if `n` is greater than or equal to 1.
     */
    static step1(n) {
        return n >= 1 ? 1 : 0;
    }
    /**
     * A linear function, `f(t) = t`. Position correlates to elapsed time one to
     * one.
     *
     * http://cubic-bezier.com/#0,0,1,1
     */
    static linear(t) {
        return t;
    }
    /**
     * A simple inertial interaction, similar to an object slowly accelerating to
     * speed.
     *
     * http://cubic-bezier.com/#.42,0,1,1
     */
    // static ease(t) {
    //     if (!ease) {
    //         ease = Easing.bezier(0.42, 0, 1, 1);
    //     }
    //     return ease(t);
    // }
    /**
     * A quadratic function, `f(t) = t * t`. Position equals the square of elapsed
     * time.
     *
     * http://easings.net/#easeInQuad
     */
    static quad(t) {
        return t * t;
    }
    /**
     * A cubic function, `f(t) = t * t * t`. Position equals the cube of elapsed
     * time.
     *
     * http://easings.net/#easeInCubic
     */
    static cubic(t) {
        return t * t * t;
    }
    /**
     * A power function. Position is equal to the Nth power of elapsed time.
     *
     * n = 4: http://easings.net/#easeInQuart
     * n = 5: http://easings.net/#easeInQuint
     */
    static poly(n) {
        return (t) => Math.pow(t, n);
    }
    /**
     * A sinusoidal function.
     *
     * http://easings.net/#easeInSine
     */
    static sin(t) {
        return 1 - Math.cos((t * Math.PI) / 2);
    }
    /**
     * A circular function.
     *
     * http://easings.net/#easeInCirc
     */
    static circle(t) {
        return 1 - Math.sqrt(1 - t * t);
    }
    /**
     * An exponential function.
     *
     * http://easings.net/#easeInExpo
     */
    static exp(t) {
        return Math.pow(2, 10 * (t - 1));
    }
    /**
     * A simple elastic interaction, similar to a spring oscillating back and
     * forth.
     *
     * Default bounciness is 1, which overshoots a little bit once. 0 bounciness
     * doesn't overshoot at all, and bounciness of N > 1 will overshoot about N
     * times.
     *
     * http://easings.net/#easeInElastic
     */
    static elastic(bounciness = 1) {
        const p = bounciness * Math.PI;
        return t => 1 - Math.pow(Math.cos((t * Math.PI) / 2), 3) * Math.cos(t * p);
    }
    /**
     * Use with `Animated.parallel()` to create a simple effect where the object
     * animates back slightly as the animation starts.
     *
     * Wolfram Plot:
     *
     * - http://tiny.cc/back_default (s = 1.70158, default)
     */
    static back(s = 1.70158) {
        return t => t * t * ((s + 1) * t - s);
    }
    /**
     * Provides a simple bouncing effect.
     *
     * Props to Waterded#6455 for making the bounce adjustable and GiantLuigi4#6616 for helping clean it up
     * using min instead of ternaries
     * http://easings.net/#easeInBounce
     */
    static bounce(k = 0.5) {
      const q = x => (121 / 16) * x * x;
      const w = x => ((121 / 4) * k) * Math.pow(x - (6 / 11), 2) + 1 - k;
      const r = x => 121 * k * k * Math.pow(x - (9 / 11), 2) + 1 - k * k;
      const t = x => 484 * k * k * k * Math.pow(x - (10.5 / 11), 2) + 1 - k * k * k;
      return x => Math.min(q(x), w(x), r(x), t(x));
    }

    /**
     * Provides a cubic bezier curve, equivalent to CSS Transitions'
     * `transition-timing-function`.
     *
     * A useful tool to visualize cubic bezier curves can be found at
     * http://cubic-bezier.com/
     */
    // static bezier(x1, y1, x2, y2) {
    //     const _bezier = require('./bezier');
    //     return _bezier(x1, y1, x2, y2);
    // }
    /**
     * Runs an easing function forwards.
     */
    static in(easing) {
        return easing;
    }
    /**
     * Runs an easing function backwards.
     */
    static out(easing) {
        return t => 1 - easing(1 - t);
    }
    /**
     * Makes any easing function symmetrical. The easing function will run
     * forwards for half of the duration, then backwards for the rest of the
     * duration.
     */
    static inOut(easing) {
        return t => {
            if (t < 0.5) {
                return easing(t * 2) / 2;
            }
            return 1 - easing((1 - t) * 2) / 2;
        };
    }
}

const quart = Easing.poly(4);
const quint = Easing.poly(5);
const back = (direction, scalar, t) =>
  direction(Easing.back(1.70158 * scalar))(t);
const elastic = (direction, bounciness, t) =>
  direction(Easing.elastic(bounciness))(t);
const bounce = (direction, bounciness, t) =>
  direction(Easing.bounce(bounciness))(t);

const easingFunctions = {
  linear: Easing.linear,
  step(steps, x) {
    const intervals = stepRange(steps);
    return intervals[findIntervalBorderIndex(x, intervals, false)];
  },
  easeInQuad: Easing.in(Easing.quad),
  easeOutQuad: Easing.out(Easing.quad),
  easeInOutQuad: Easing.inOut(Easing.quad),
  easeInCubic: Easing.in(Easing.cubic),
  easeOutCubic: Easing.out(Easing.cubic),
  easeInOutCubic: Easing.inOut(Easing.cubic),
  easeInQuart: Easing.in(quart),
  easeOutQuart: Easing.out(quart),
  easeInOutQuart: Easing.inOut(quart),
  easeInQuint: Easing.in(quint),
  easeOutQuint: Easing.out(quint),
  easeInOutQuint: Easing.inOut(quint),
  easeInSine: Easing.in(Easing.sin),
  easeOutSine: Easing.out(Easing.sin),
  easeInOutSine: Easing.inOut(Easing.sin),
  easeInExpo: Easing.in(Easing.exp),
  easeOutExpo: Easing.out(Easing.exp),
  easeInOutExpo: Easing.inOut(Easing.exp),
  easeInCirc: Easing.in(Easing.circle),
  easeOutCirc: Easing.out(Easing.circle),
  easeInOutCirc: Easing.inOut(Easing.circle),
  easeInBack: back.bind(null, Easing.in),
  easeOutBack: back.bind(null, Easing.out),
  easeInOutBack: back.bind(null, Easing.inOut),
  easeInElastic: elastic.bind(null, Easing.in),
  easeOutElastic: elastic.bind(null, Easing.out),
  easeInOutElastic: elastic.bind(null, Easing.inOut),
  easeInBounce: bounce.bind(null, Easing.in),
  easeOutBounce: bounce.bind(null, Easing.out),
  easeInOutBounce: bounce.bind(null, Easing.inOut),
};

// Object with the same keys as easingFunctions and values of the stringified key names
const EASING_OPTIONS = Object.fromEntries(
  Object.entries(easingFunctions).map(entry => ([entry[0], entry[0]]))
);
Object.freeze(EASING_OPTIONS);
const EASING_DEFAULT = 'linear';

const getEasingArgDefault = kf => {
  switch (kf.easing) {
    case EASING_OPTIONS.easeInBack:
    case EASING_OPTIONS.easeOutBack:
    case EASING_OPTIONS.easeInOutBack:
    case EASING_OPTIONS.easeInElastic:
    case EASING_OPTIONS.easeOutElastic:
    case EASING_OPTIONS.easeInOutElastic:
      return 1;
    case EASING_OPTIONS.easeInBounce:
    case EASING_OPTIONS.easeOutBounce:
    case EASING_OPTIONS.easeInOutBounce:
      return 0.5;
    case EASING_OPTIONS.step:
      return 5;
    default:
      return null;
  }
};

const parseEasingArg = (kf, value) => {
  switch(kf.easing) {
    case EASING_OPTIONS.easeInBack:
    case EASING_OPTIONS.easeOutBack:
    case EASING_OPTIONS.easeInOutBack:
    case EASING_OPTIONS.easeInElastic:
    case EASING_OPTIONS.easeOutElastic:
    case EASING_OPTIONS.easeInOutElastic:
    case EASING_OPTIONS.easeInBounce:
    case EASING_OPTIONS.easeOutBounce:
    case EASING_OPTIONS.easeInOutBounce:
      return parseFloat(value);
    case EASING_OPTIONS.step:
      return Math.max(parseInt(value, 10), 2);
    default:
      return parseInt(value, 10);
  }
};


/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./package.json */ "./package.json");
var _package_json__WEBPACK_IMPORTED_MODULE_0___namespace = /*#__PURE__*/__webpack_require__.t(/*! ./package.json */ "./package.json", 1);
/* harmony import */ var _animationUi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./animationUi */ "./animationUi.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./utils.js");
/* harmony import */ var _keyframe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./keyframe */ "./keyframe.js");
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./settings */ "./settings.js");
/* harmony import */ var _codec__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./codec */ "./codec.js");







(function () {
  const MIN_BLOCKBENCH_VERSION = "3.6";
  let exportAction;
  let button;

  Plugin.register("animation_utils", {
    name: "GeckoLib Animation Utils",
    author: "Eliot Lash, Gecko",
    title: "GeckoLib Animation Utils",
    description:
      `This plugin lets you create animated java entities with GeckoLib. This plugin requires Blockbench ${MIN_BLOCKBENCH_VERSION} or higher. Learn about GeckoLib here: https://github.com/bernie-g/geckolib`,
    icon: "movie_filter",
    version: _package_json__WEBPACK_IMPORTED_MODULE_0__["version"],
    min_version: MIN_BLOCKBENCH_VERSION,
    variant: "both",
    onload() {
      Object(_codec__WEBPACK_IMPORTED_MODULE_5__["loadCodec"])();
      Object(_animationUi__WEBPACK_IMPORTED_MODULE_1__["loadAnimationUI"])();
      Object(_keyframe__WEBPACK_IMPORTED_MODULE_3__["addKeyframeMonkeypatches"])();

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
            lines: [`<b class="tl"><a href="https://github.com/bernie-g/geckolib">GeckoLib</a> Animation Utils v${_package_json__WEBPACK_IMPORTED_MODULE_0__["version"]}</b>`],
            form: {
              modSDK: {label: 'Modding SDK', type: 'select', default: _settings__WEBPACK_IMPORTED_MODULE_4__["default"].modSDK, options: _settings__WEBPACK_IMPORTED_MODULE_4__["MOD_SDK_OPTIONS"]},
              entityType: {label: 'Entity Type', value: _settings__WEBPACK_IMPORTED_MODULE_4__["default"].entityType },
              javaPackage: {label: 'Java Package', value: _settings__WEBPACK_IMPORTED_MODULE_4__["default"].javaPackage},
              animFileNamespace: {label: 'Animation File Namespace', value: _settings__WEBPACK_IMPORTED_MODULE_4__["default"].animFileNamespace},
              animFilePath: {label: 'Animation File Path', value: _settings__WEBPACK_IMPORTED_MODULE_4__["default"].animFilePath},
            },
            onConfirm: function(formResult) {
              Object.assign(_settings__WEBPACK_IMPORTED_MODULE_4__["default"], formResult);
              dialog.hide()
            }
          })
          dialog.show()
        }
      });
      MenuBar.addAction(button, 'file.1');
    },
    onunload() {
      Object(_codec__WEBPACK_IMPORTED_MODULE_5__["unloadCodec"])();
      exportAction.delete();
      button.delete();
      Object(_animationUi__WEBPACK_IMPORTED_MODULE_1__["unloadAnimationUI"])();
      Object(_utils__WEBPACK_IMPORTED_MODULE_2__["removeMonkeypatches"])();
      console.clear();
    },
  });
})();


/***/ }),

/***/ "./keyframe.js":
/*!*********************!*\
  !*** ./keyframe.js ***!
  \*********************/
/*! exports provided: addKeyframeMonkeypatches */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addKeyframeMonkeypatches", function() { return addKeyframeMonkeypatches; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./utils.js");
/* harmony import */ var _easing__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./easing */ "./easing.js");



//#region Keyframe Mixins
function addKeyframeMonkeypatches() {
  Object(_utils__WEBPACK_IMPORTED_MODULE_0__["addMonkeypatch"])(Keyframe, "prototype", "getLerp", keyframeGetLerp);
  Object(_utils__WEBPACK_IMPORTED_MODULE_0__["addMonkeypatch"])(Keyframe, "prototype", "getArray", keyframeGetArray);
  Object(_utils__WEBPACK_IMPORTED_MODULE_0__["addMonkeypatch"])(Keyframe, "prototype", "getUndoCopy", keyframeGetUndoCopy);
  Object(_utils__WEBPACK_IMPORTED_MODULE_0__["addMonkeypatch"])(Keyframe, "prototype", "extend", keyframeExtend);

  Object(_utils__WEBPACK_IMPORTED_MODULE_0__["addMonkeypatch"])(BarItems.reverse_keyframes, null, "condition", reverseKeyframesCondition);
}

function lerp(start, stop, amt) {
  return amt * (stop - start) + start;
};

function keyframeGetLerp(other, axis, amount, allow_expression) {
  const easing = other.easing || _easing__WEBPACK_IMPORTED_MODULE_1__["EASING_DEFAULT"];
  if (Format.id !== "animated_entity_model") {
    return _utils__WEBPACK_IMPORTED_MODULE_0__["Original"].get(Keyframe).getLerp.apply(this, arguments);
  }
  let easingFunc = _easing__WEBPACK_IMPORTED_MODULE_1__["easingFunctions"][easing];
  if (Object(_utils__WEBPACK_IMPORTED_MODULE_0__["hasArgs"])(easing)) {
    const arg1 = Array.isArray(other.easingArgs) && other.easingArgs.length > 0
      ? other.easingArgs[0]
      : Object(_easing__WEBPACK_IMPORTED_MODULE_1__["getEasingArgDefault"])(other);
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
  let result = _utils__WEBPACK_IMPORTED_MODULE_0__["Original"].get(Keyframe).getArray.apply(this, arguments);
  if (Format.id === "animated_entity_model") {
    result = { vector: result, easing };
    if (Object(_utils__WEBPACK_IMPORTED_MODULE_0__["hasArgs"])(easing)) result.easingArgs = easingArgs;
  }
  console.log('keyframeGetArray arguments:', arguments, 'this:', this, 'result:', result);
  return result;
}

function keyframeGetUndoCopy() {
  const { easing, easingArgs } = this;
  const result = _utils__WEBPACK_IMPORTED_MODULE_0__["Original"].get(Keyframe).getUndoCopy.apply(this, arguments);
  if (Format.id === "animated_entity_model") {
    Object.assign(result, { easing });
    if (Object(_utils__WEBPACK_IMPORTED_MODULE_0__["hasArgs"])(easing)) result.easingArgs = easingArgs;
  }
  // console.log('keyframeGetUndoCopy arguments:', arguments, 'this:', this, 'result:', result);
  return result;
}

function keyframeExtend(dataIn) {
  const data = Object.assign({}, dataIn);
  if (Format.id === "animated_entity_model") {
    if (typeof data.values === 'object') {
      if (data.values.easing !== undefined) {
        Merge.string(this, data.values, 'easing');
      }
      if (Array.isArray(data.values.easingArgs)) {
        this.easingArgs = data.values.easingArgs;
      }
      if (!Array.isArray(data.values) && Array.isArray(data.values.vector)) {
        // Convert data to format expected by KeyframeExtendOriginal
        data.values = data.values.vector;
      }
    } else {
      if (data.easing !== undefined) {
          Merge.string(this, data, 'easing');
      }
      if (Array.isArray(data.easingArgs)) {
        this.easingArgs = data.easingArgs;
      }
    }
  }
  const result = _utils__WEBPACK_IMPORTED_MODULE_0__["Original"].get(Keyframe).extend.apply(this, arguments);
  console.log('keyframeExtend arguments:', arguments, 'this:', this, 'result:', result);
  return result;
}

function reverseKeyframesCondition() {
  const res = _utils__WEBPACK_IMPORTED_MODULE_0__["Original"].get(BarItems.reverse_keyframes).condition() && Format.id !== "animated_entity_model";
  // console.log('reverseKeyframesCondition original:',Original.get(BarItems.reverse_keyframes).condition(), 'res:', res);
  return res;
}

//#endregion Keyframe Mixins

/***/ }),

/***/ "./node_modules/lodash/_Hash.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_Hash.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(/*! ./_hashClear */ "./node_modules/lodash/_hashClear.js"),
    hashDelete = __webpack_require__(/*! ./_hashDelete */ "./node_modules/lodash/_hashDelete.js"),
    hashGet = __webpack_require__(/*! ./_hashGet */ "./node_modules/lodash/_hashGet.js"),
    hashHas = __webpack_require__(/*! ./_hashHas */ "./node_modules/lodash/_hashHas.js"),
    hashSet = __webpack_require__(/*! ./_hashSet */ "./node_modules/lodash/_hashSet.js");

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),

/***/ "./node_modules/lodash/_ListCache.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_ListCache.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(/*! ./_listCacheClear */ "./node_modules/lodash/_listCacheClear.js"),
    listCacheDelete = __webpack_require__(/*! ./_listCacheDelete */ "./node_modules/lodash/_listCacheDelete.js"),
    listCacheGet = __webpack_require__(/*! ./_listCacheGet */ "./node_modules/lodash/_listCacheGet.js"),
    listCacheHas = __webpack_require__(/*! ./_listCacheHas */ "./node_modules/lodash/_listCacheHas.js"),
    listCacheSet = __webpack_require__(/*! ./_listCacheSet */ "./node_modules/lodash/_listCacheSet.js");

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),

/***/ "./node_modules/lodash/_Map.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/_Map.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ "./node_modules/lodash/_MapCache.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_MapCache.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(/*! ./_mapCacheClear */ "./node_modules/lodash/_mapCacheClear.js"),
    mapCacheDelete = __webpack_require__(/*! ./_mapCacheDelete */ "./node_modules/lodash/_mapCacheDelete.js"),
    mapCacheGet = __webpack_require__(/*! ./_mapCacheGet */ "./node_modules/lodash/_mapCacheGet.js"),
    mapCacheHas = __webpack_require__(/*! ./_mapCacheHas */ "./node_modules/lodash/_mapCacheHas.js"),
    mapCacheSet = __webpack_require__(/*! ./_mapCacheSet */ "./node_modules/lodash/_mapCacheSet.js");

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),

/***/ "./node_modules/lodash/_Set.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/_Set.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),

/***/ "./node_modules/lodash/_SetCache.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_SetCache.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(/*! ./_MapCache */ "./node_modules/lodash/_MapCache.js"),
    setCacheAdd = __webpack_require__(/*! ./_setCacheAdd */ "./node_modules/lodash/_setCacheAdd.js"),
    setCacheHas = __webpack_require__(/*! ./_setCacheHas */ "./node_modules/lodash/_setCacheHas.js");

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ }),

/***/ "./node_modules/lodash/_Symbol.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_Symbol.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ "./node_modules/lodash/_arrayIncludes.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_arrayIncludes.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIndexOf = __webpack_require__(/*! ./_baseIndexOf */ "./node_modules/lodash/_baseIndexOf.js");

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;


/***/ }),

/***/ "./node_modules/lodash/_arrayIncludesWith.js":
/*!***************************************************!*\
  !*** ./node_modules/lodash/_arrayIncludesWith.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

module.exports = arrayIncludesWith;


/***/ }),

/***/ "./node_modules/lodash/_assocIndexOf.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_assocIndexOf.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(/*! ./eq */ "./node_modules/lodash/eq.js");

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),

/***/ "./node_modules/lodash/_baseFindIndex.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_baseFindIndex.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;


/***/ }),

/***/ "./node_modules/lodash/_baseGetTag.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseGetTag.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ "./node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__(/*! ./_objectToString */ "./node_modules/lodash/_objectToString.js");

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ "./node_modules/lodash/_baseIndexOf.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_baseIndexOf.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(/*! ./_baseFindIndex */ "./node_modules/lodash/_baseFindIndex.js"),
    baseIsNaN = __webpack_require__(/*! ./_baseIsNaN */ "./node_modules/lodash/_baseIsNaN.js"),
    strictIndexOf = __webpack_require__(/*! ./_strictIndexOf */ "./node_modules/lodash/_strictIndexOf.js");

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

module.exports = baseIndexOf;


/***/ }),

/***/ "./node_modules/lodash/_baseIsNaN.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseIsNaN.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

module.exports = baseIsNaN;


/***/ }),

/***/ "./node_modules/lodash/_baseIsNative.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseIsNative.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(/*! ./isFunction */ "./node_modules/lodash/isFunction.js"),
    isMasked = __webpack_require__(/*! ./_isMasked */ "./node_modules/lodash/_isMasked.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    toSource = __webpack_require__(/*! ./_toSource */ "./node_modules/lodash/_toSource.js");

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),

/***/ "./node_modules/lodash/_baseUniq.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseUniq.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(/*! ./_SetCache */ "./node_modules/lodash/_SetCache.js"),
    arrayIncludes = __webpack_require__(/*! ./_arrayIncludes */ "./node_modules/lodash/_arrayIncludes.js"),
    arrayIncludesWith = __webpack_require__(/*! ./_arrayIncludesWith */ "./node_modules/lodash/_arrayIncludesWith.js"),
    cacheHas = __webpack_require__(/*! ./_cacheHas */ "./node_modules/lodash/_cacheHas.js"),
    createSet = __webpack_require__(/*! ./_createSet */ "./node_modules/lodash/_createSet.js"),
    setToArray = __webpack_require__(/*! ./_setToArray */ "./node_modules/lodash/_setToArray.js");

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseUniq;


/***/ }),

/***/ "./node_modules/lodash/_cacheHas.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_cacheHas.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ }),

/***/ "./node_modules/lodash/_coreJsData.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_coreJsData.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ "./node_modules/lodash/_createSet.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_createSet.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Set = __webpack_require__(/*! ./_Set */ "./node_modules/lodash/_Set.js"),
    noop = __webpack_require__(/*! ./noop */ "./node_modules/lodash/noop.js"),
    setToArray = __webpack_require__(/*! ./_setToArray */ "./node_modules/lodash/_setToArray.js");

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

module.exports = createSet;


/***/ }),

/***/ "./node_modules/lodash/_freeGlobal.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_freeGlobal.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;


/***/ }),

/***/ "./node_modules/lodash/_getMapData.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_getMapData.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isKeyable = __webpack_require__(/*! ./_isKeyable */ "./node_modules/lodash/_isKeyable.js");

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),

/***/ "./node_modules/lodash/_getNative.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getNative.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(/*! ./_baseIsNative */ "./node_modules/lodash/_baseIsNative.js"),
    getValue = __webpack_require__(/*! ./_getValue */ "./node_modules/lodash/_getValue.js");

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),

/***/ "./node_modules/lodash/_getRawTag.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getRawTag.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ "./node_modules/lodash/_getValue.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_getValue.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),

/***/ "./node_modules/lodash/_hashClear.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_hashClear.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),

/***/ "./node_modules/lodash/_hashDelete.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_hashDelete.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),

/***/ "./node_modules/lodash/_hashGet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashGet.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),

/***/ "./node_modules/lodash/_hashHas.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashHas.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),

/***/ "./node_modules/lodash/_hashSet.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/_hashSet.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "./node_modules/lodash/_nativeCreate.js");

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),

/***/ "./node_modules/lodash/_isKeyable.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_isKeyable.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),

/***/ "./node_modules/lodash/_isMasked.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_isMasked.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(/*! ./_coreJsData */ "./node_modules/lodash/_coreJsData.js");

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),

/***/ "./node_modules/lodash/_listCacheClear.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_listCacheClear.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),

/***/ "./node_modules/lodash/_listCacheDelete.js":
/*!*************************************************!*\
  !*** ./node_modules/lodash/_listCacheDelete.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),

/***/ "./node_modules/lodash/_listCacheGet.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheGet.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),

/***/ "./node_modules/lodash/_listCacheHas.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheHas.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_listCacheSet.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_listCacheSet.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "./node_modules/lodash/_assocIndexOf.js");

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheClear.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_mapCacheClear.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(/*! ./_Hash */ "./node_modules/lodash/_Hash.js"),
    ListCache = __webpack_require__(/*! ./_ListCache */ "./node_modules/lodash/_ListCache.js"),
    Map = __webpack_require__(/*! ./_Map */ "./node_modules/lodash/_Map.js");

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheDelete.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_mapCacheDelete.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheGet.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheGet.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheHas.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheHas.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_mapCacheSet.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_mapCacheSet.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ "./node_modules/lodash/_getMapData.js");

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),

/***/ "./node_modules/lodash/_nativeCreate.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash/_nativeCreate.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "./node_modules/lodash/_getNative.js");

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ "./node_modules/lodash/_objectToString.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_objectToString.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ "./node_modules/lodash/_root.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_root.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ "./node_modules/lodash/_setCacheAdd.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_setCacheAdd.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ }),

/***/ "./node_modules/lodash/_setCacheHas.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/_setCacheHas.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ }),

/***/ "./node_modules/lodash/_setToArray.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_setToArray.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;


/***/ }),

/***/ "./node_modules/lodash/_strictIndexOf.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash/_strictIndexOf.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = strictIndexOf;


/***/ }),

/***/ "./node_modules/lodash/_toSource.js":
/*!******************************************!*\
  !*** ./node_modules/lodash/_toSource.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),

/***/ "./node_modules/lodash/eq.js":
/*!***********************************!*\
  !*** ./node_modules/lodash/eq.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),

/***/ "./node_modules/lodash/isFunction.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/isFunction.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js");

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),

/***/ "./node_modules/lodash/isObject.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isObject.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ "./node_modules/lodash/noop.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/noop.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;


/***/ }),

/***/ "./node_modules/lodash/uniq.js":
/*!*************************************!*\
  !*** ./node_modules/lodash/uniq.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseUniq = __webpack_require__(/*! ./_baseUniq */ "./node_modules/lodash/_baseUniq.js");

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each element
 * is kept. The order of result values is determined by the order they occur
 * in the array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length) ? baseUniq(array) : [];
}

module.exports = uniq;


/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, private, description, main, scripts, author, license, sideEffects, devDependencies, dependencies, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"name\":\"animation_utils\",\"version\":\"2.0.2\",\"private\":true,\"description\":\"GeckoLib Animation Utils\",\"main\":\"index.js\",\"scripts\":{\"build\":\"webpack\",\"watch\":\"webpack --watch --mode=development\",\"test\":\"echo \\\"Error: no test specified\\\" && exit 1\"},\"author\":\"Eliot Lash, Gecko\",\"license\":\"MIT\",\"sideEffects\":[\"./index.js\"],\"devDependencies\":{\"webpack\":\"4.43.0\",\"webpack-cli\":\"3.3.12\"},\"dependencies\":{\"lodash\":\"4.17.19\"}}");

/***/ }),

/***/ "./settings.js":
/*!*********************!*\
  !*** ./settings.js ***!
  \*********************/
/*! exports provided: MOD_SDK_1_15_FORGE, MOD_SDK_1_15_FABRIC, MOD_SDKS, MOD_SDK_OPTIONS, GECKO_SETTINGS_DEFAULT, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MOD_SDK_1_15_FORGE", function() { return MOD_SDK_1_15_FORGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MOD_SDK_1_15_FABRIC", function() { return MOD_SDK_1_15_FABRIC; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MOD_SDKS", function() { return MOD_SDKS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MOD_SDK_OPTIONS", function() { return MOD_SDK_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GECKO_SETTINGS_DEFAULT", function() { return GECKO_SETTINGS_DEFAULT; });
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

/* harmony default export */ __webpack_exports__["default"] = (geckoSettings);

/***/ }),

/***/ "./utils.js":
/*!******************!*\
  !*** ./utils.js ***!
  \******************/
/*! exports provided: hasArgs, Original, addMonkeypatch, removeMonkeypatches */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasArgs", function() { return hasArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Original", function() { return Original; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addMonkeypatch", function() { return addMonkeypatch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeMonkeypatches", function() { return removeMonkeypatches; });
/* harmony import */ var _easing__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./easing */ "./easing.js");


const hasArgs = (easing = "") =>
  easing.includes("Back") ||
  easing.includes("Elastic") ||
  easing.includes("Bounce") ||
  easing === _easing__WEBPACK_IMPORTED_MODULE_0__["EASING_OPTIONS"].step;

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

/***/ })

/******/ });