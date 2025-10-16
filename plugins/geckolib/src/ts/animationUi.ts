import uniq from 'lodash/uniq';
import {addMonkeypatch} from './utils';
import {EASING_OPTIONS, EASING_DEFAULT, getEasingArgDefault, parseEasingArg, GeckolibKeyframe, isArgsEasing} from './easing';
import {GECKOLIB_MODEL_ID} from "./constants";

const easingRegExp = /^ease(InOut|In|Out)?([\w]+)$/;

export const loadAnimationUI = () => {
  Blockbench.on('display_animation_frame', displayAnimationFrameCallback);
  Blockbench.on('update_keyframe_selection', updateKeyframeSelectionCallback);
  Blockbench.on('render_frame', renderFrameCallback)

  addMonkeypatch(window, null, "updateKeyframeEasing", updateKeyframeEasing);
  addMonkeypatch(window, null, "updateKeyframeEasingArg", updateKeyframeEasingArg);
};

export const unloadAnimationUI = () => {
  Blockbench.removeListener('display_animation_frame', displayAnimationFrameCallback);
  Blockbench.removeListener('update_keyframe_selection', updateKeyframeSelectionCallback);
  Blockbench.removeListener('render_frame', renderFrameCallback);
};

export const displayAnimationFrameCallback = (/*...args*/) => {
  // const keyframe = $('#keyframe');
  // console.log('displayAnimationFrameCallback:', args, 'keyframe:', keyframe); // keyframe is null here
};

export function renderFrameCallback() {
  if (Format.id !== GECKOLIB_MODEL_ID) return
  Timeline.keyframes.forEach((kf: GeckolibKeyframe) => {
    if (kf.interpolation != "linear" && kf.easing != undefined) {
      kf.easing = undefined
      kf.easingArgs = undefined
      window.updateKeyframeSelection();
    }
    if (kf.interpolation === "step") {
      kf.interpolation = "linear"
      if (kf.data_points.length == 1) addDataPoint()
      window.updateKeyframeSelection();
    }
    updateKeyframeIcon(kf)
  })
  const addPrePostButton = document.querySelector<HTMLElement>('#keyframe_type_label > div');
  if (addPrePostButton) addPrePostButton.hidden = true;
}

export function updateKeyframeEasing(value) {
  Undo.initEdit({keyframes: Timeline.selected}) 
  // var axis = $(obj).attr('axis');
  // const value = $(obj).val();
  // console.log('updateKeyframeEasing value:', value, 'obj:', obj); 
  if (value === "-") return;
  Timeline.selected.forEach((kf: GeckolibKeyframe) => {
    kf.easing = value;
    kf.easingArgs = undefined;
    kf.interpolation = 'linear';
  })
  window.updateKeyframeSelection(); // Ensure easingArg display is updated
  // Animator.preview();
  Undo.finishEdit('edit keyframe easing')
}

export function updateKeyframeEasingArg(obj) {
  Undo.initEdit({keyframes: Timeline.selected}) 
  if ($(obj).val() === "-") return;
  // console.log('updateKeyframeEasingArg value:', $(obj).val(), 'obj:', obj); 
  Timeline.selected.forEach((kf: GeckolibKeyframe) => {
    const value = parseEasingArg(kf, ($(obj).val() as string).trim());
    kf.easingArgs = [value];
    // obj.value = value;
  })
  Undo.finishEdit('edit keyframe easing argument')
}

export const updateKeyframeSelectionCallback = (/*...args*/) => {
    $('#keyframe_bar_easing').remove()
    $('#keyframe_bar_easing_type').remove()
    $('#keyframe_bar_easing_arg1').remove()

    let multi_channel = false; //eslint-disable-line @typescript-eslint/no-unused-vars
    let channel: boolean | string | number = false;
    Timeline.selected.forEach((kf) => {
      if (channel === false) {
        channel = kf.channel
      } else if (channel !== kf.channel) {
        multi_channel = true
      }
    })

    Timeline.keyframes.forEach((kf: GeckolibKeyframe) => {
      updateKeyframe(kf)
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

    const isFirstInChannel = (kf: _Keyframe) => keyframesByChannel.get(kf.animator)[kf.channel].indexOf(kf) < 1;

    if (Timeline.selected.length && Format.id === GECKOLIB_MODEL_ID) {
      if (Timeline.selected.every(kf => kf.animator instanceof BoneAnimator && !isFirstInChannel(kf))) {
        const displayedEasing = getMultiSelectValue('easing', EASING_DEFAULT, 'null');

        const convertEasingTypeToId = (easing, easingType, inputEasingOrType) => {
          const easingTypeToTypeId = type => {
            let finalEasingType = "In";

            if (type === "out") {
              finalEasingType = "Out";
            } else if (type === "inout") {
              finalEasingType = "InOut";
            }

            return finalEasingType;
          };

          let finalEasing = 'ease';

          if (inputEasingOrType === "in" || inputEasingOrType === "out" || inputEasingOrType === "inout") {
              const finalEasingType = easingTypeToTypeId(inputEasingOrType)

              finalEasing += finalEasingType + easing.substring(0, 1).toUpperCase() + easing.substring(1);
            } else if (inputEasingOrType === "linear" || inputEasingOrType == "step") {
              finalEasing = inputEasingOrType;
            } else {
              const finalEasingType = easingTypeToTypeId(easingType);

              finalEasing += finalEasingType + inputEasingOrType.substring(0, 1).toUpperCase() + inputEasingOrType.substring(1);
            }

            return finalEasing;
        };

        const addEasingTypeIcons = (bar, easingType, title) => {
          const div = document.createElement("div");
          div.innerHTML = getIcon(easingType);
          div.id = "kf_easing_type_" + easingType;
          div.setAttribute("style", "stroke:var(--color-text);margin:0px;padding:3px;width:30px;height:30px");
          div.setAttribute("title", title);
          div.onclick = () => {
            const selectedEasing = $(".selected_kf_easing");
            const selectedEasingType = $(".selected_kf_easing_type");

            const keySelectedEasing = selectedEasing.attr("id").substring(15);
            const keySelectedEasingType = selectedEasingType.length <= 0 ? "in" : selectedEasingType.attr("id").substring(15);

            const currentEasing = convertEasingTypeToId(keySelectedEasing, keySelectedEasingType, keySelectedEasing);
            const finalEasing = convertEasingTypeToId(keySelectedEasing, keySelectedEasingType, easingType);

            if (finalEasing != currentEasing) {
            //   console.log("Changed from " + currentEasing + " to " + finalEasing);
              updateKeyframeEasing(finalEasing);
            }
          };
          bar.appendChild(div);
        };

        const keyframePanel = document.getElementById('panel_keyframe');

        if (keyframePanel) {
            let easingBar: HTMLElement = document.createElement('div');


            keyframePanel.appendChild(easingBar);
            easingBar.outerHTML = `<div class="bar flex" style="flex-wrap: wrap" id="keyframe_bar_easing">
                <label class="tl" style="font-weight: bolder; min-width: 47px;">Easing</label>
            </div>`;
            easingBar = document.getElementById('keyframe_bar_easing');

            addEasingTypeIcons(easingBar, "linear", "Switch to Linear easing");
            addEasingTypeIcons(easingBar, "step", "Switch to Step easing");
            addEasingTypeIcons(easingBar, "sine", "Switch to Sine easing");
            addEasingTypeIcons(easingBar, "quad", "Switch to Quadratic easing");
            addEasingTypeIcons(easingBar, "cubic", "Switch to Cubic easing");
            addEasingTypeIcons(easingBar, "quart", "Switch to Quartic easing");
            addEasingTypeIcons(easingBar, "quint", "Switch to Quntic easing");
            addEasingTypeIcons(easingBar, "expo", "Switch to Exponential easing");
            addEasingTypeIcons(easingBar, "circ", "Switch to Circle easing");
            addEasingTypeIcons(easingBar, "back", "Switch to Back easing");
            addEasingTypeIcons(easingBar, "elastic", "Switch to Elastic easing");
            addEasingTypeIcons(easingBar, "bounce", "Switch to Bounce easing");


            const keyEasing = getEasingInterpolation(displayedEasing);
            const keyEasingElement = document.getElementById("kf_easing_type_" + keyEasing);

            keyEasingElement.style.stroke = "var(--color-accent)";
            keyEasingElement.classList.add('selected_kf_easing');

            if (!(keyEasing === "linear" || keyEasing == "step")) {
                let easingTypeBar: HTMLElement = document.createElement('div');
                keyframePanel.appendChild(easingTypeBar);
                easingTypeBar.outerHTML = `<div class="bar flex" id="keyframe_bar_easing_type">
            <label class="tl" style="font-weight: bolder; min-width: 47px;">Type</label>
          </div>`;
                easingTypeBar = document.getElementById('keyframe_bar_easing_type');

                addEasingTypeIcons(easingTypeBar, "in", "Switch to In easing type");
                addEasingTypeIcons(easingTypeBar, "out", "Switch to Out easing type");
                addEasingTypeIcons(easingTypeBar, "inout", "Switch to In/Out easing type");

                const keyEasingType = getEasingType(displayedEasing);
                const keyEasingTypeElement = document.getElementById("kf_easing_type_" + keyEasingType);

                keyEasingTypeElement.style.stroke = "var(--color-accent)";
                keyEasingTypeElement.classList.add('selected_kf_easing_type');
            }

            if (keyEasing !== "linear")
                document.getElementById('panel_keyframe').querySelector('div.bb-select').textContent = "GeckoLib"

            const getEasingArgLabel = (kf: GeckolibKeyframe) => {
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
            if (Timeline.selected.every((kf: GeckolibKeyframe) => isArgsEasing(kf.easing)) && easingArgLabel !== null) {
                const argDefault = getMultiSelectValue(getEasingArgDefault, null, null);
                const [displayedValue] = getMultiSelectValue('easingArgs', [argDefault], [argDefault]);
                let scaleBar: HTMLElement = document.createElement('div');
                keyframePanel.appendChild(scaleBar);
                scaleBar.outerHTML = `<div class="bar flex" id="keyframe_bar_easing_arg1">
                  <label class="tl" style="font-weight: bolder; min-width: 90px;">${easingArgLabel}</label>
                  <input type="number" id="keyframe_easing_scale" class="dark_bordered code keyframe_input tab_target" value="${displayedValue}" oninput="updateKeyframeEasingArg(this)" style="flex: 1; margin-right: 9px;">
                </div>`;
                scaleBar = document.getElementById('keyframe_bar_easing_arg1');
            }
        }
    }
  }
};

const getEasingInterpolation = (name: string) => {
  const matches = name.match(easingRegExp);

  if (matches) {
    return matches[2].toLowerCase();
  }

  return name;
};

const getEasingType = (name: string) => {
  const matches = name.match(easingRegExp);

  if (matches) {
    return matches[1].toLowerCase();
  }

  return "in";
};

const updateKeyframe = (kf: GeckolibKeyframe) => {
  if (kf.data_points.length != 1 && kf.interpolation !== "linear") {
    removeLastDataPoint()
  }
}

const updateKeyframeIcon = (kf: GeckolibKeyframe) => {
  const element = document.getElementById(kf.uuid);

  if (element && element.children && kf.easing)
    element.children[0].className = 'easing-' + kf.easing.split(/\.?(?=[A-Z])/).join('_').toLowerCase().replace("ease_", "")
}

const addDataPoint = () => {
  Undo.initEdit({keyframes: Timeline.selected})
  Timeline.selected.forEach(kf => {
    if (kf.data_points.length < kf.animator.channels[kf.channel].max_data_points) {
      kf.data_points.push(new KeyframeDataPoint(kf))
      kf.data_points.last().extend(kf.data_points[0])
    }
  })
  Animator.preview()
  Undo.finishEdit('Add keyframe data point')
}

const removeLastDataPoint = () => {
  Undo.initEdit({keyframes: Timeline.selected})
  Timeline.selected.forEach(kf => {
    if (kf.data_points.length >= 2) {
      kf.data_points.remove(kf.data_points.last());
    }
  })
  Animator.preview()
  Undo.finishEdit('Remove keyframe data point')
}

const getIcon = (name: string) => {
  switch(name) {
    case "back":
      return '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,295.94165 c 3.17500003,0 4.23333333,2.91041 5.29166663,-4.7625" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>';
    case "bounce":
      return '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,296.47081 c 0.26458333,-0.26458 0.52916673,-0.26458 0.79375003,0 0.5291666,-0.52916 0.5291666,-0.52916 1.0583333,0 0.79375,-2.11666 1.5875,-2.11666 2.38125,0 0.2645833,-4.23333 1.0583333,-5.29165 1.0583333,-5.29165" style="fill:none;stroke-width:0.52899998;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>';
    case "circ":
      return '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="M 0.52916667,296.47081 C 5.8208333,295.67706 5.8208333,293.82498 5.8208333,291.17915" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>';
    case "cubic":
      return '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="M 0.52916667,296.47081 C 3.175,296.47081 4.7625,293.82498 5.8208333,291.17915" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>';
    case "elastic":
      return '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,295.67706 c 0.79375003,0 0.79375003,-0.26458 1.32291663,-0.26458 0.5291667,0 0.79375,0.52917 1.3229167,0.52917 0.5291667,0 1.0094474,-1.83865 1.3229167,-0.79375 0.79375,2.64583 1.3229166,1.32292 1.3229166,-3.96874" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>';
    case "expo":
    case "in":
      return '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,296.47081 c 4.23333333,0 5.29166663,-1.05833 5.29166663,-5.29166" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>';
    case "inout":
      return '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,296.47081 c 5.55625003,0 -0.26458334,-5.29166 5.29166663,-5.29166" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>';
    case "out":
      return '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,296.47081 c 0,-4.23333 1.05833333,-5.29166 5.29166663,-5.29166" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>';
    case "quad":
      return '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="M 0.52916667,296.47081 C 3.175,296.47081 4.7625,293.03123 5.8208333,291.17915" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>';
    case "quart":
      return '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,296.47081 c 3.17500003,0 4.23333333,-2.64583 5.29166663,-5.29166" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>';
    case "quint":
      return '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,296.47081 c 3.43958333,0 4.23333333,-1.85208 5.29166663,-5.29166" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>';
    case "sine":
      return '<svg width="24" height="24" viewBox="0 0 6.3499999 6.3500002"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,296.47081 c 1.32291663,0 4.23333333,-3.43958 5.29166663,-5.29166" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>';
    case "step":
      return '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,296.47081 0,-1.32291 H 1.8520833 v -1.32292 H 3.175 v -1.32292 h 1.3229167 v -1.32291 l 1.3229166,1e-5" style="fill:none;stroke-width:0.52899998;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>';
    default: // linear
      return '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="M 0.52916667,296.47081 5.8208333,291.17915" style="fill:none;stroke-width:0.52916667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>';
  }
};