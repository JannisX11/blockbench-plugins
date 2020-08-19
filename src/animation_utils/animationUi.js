import uniq from 'lodash/uniq';
import { addMonkeypatch, hasArgs } from './utils';
import { EASING_OPTIONS, EASING_DEFAULT, getEasingArgDefault, parseEasingArg } from './easing';

let holdMenu;
let holdMenuConditionOriginal;

export const loadAnimationUI = () => {
  Blockbench.on('display_animation_frame', displayAnimationFrameCallback);
  Blockbench.on('update_keyframe_selection', updateKeyframeSelectionCallback);

  addMonkeypatch(global, null, "updateKeyframeEasing", updateKeyframeEasing);
  addMonkeypatch(global, null, "updateKeyframeEasingArg", updateKeyframeEasingArg);

  holdMenu = Animation.prototype.menu.structure.find(x => x.name === 'menu.animation.loop')
    .children.find(x => x.name === 'menu.animation.loop.hold');
  holdMenuConditionOriginal = holdMenu.condition;
  holdMenu.condition = () => Format.id !== "animated_entity_model";
};

export const unloadAnimationUI = () => {
  Blockbench.removeListener('display_animation_frame', displayAnimationFrameCallback);
  Blockbench.removeListener('update_keyframe_selection', updateKeyframeSelectionCallback);
  holdMenu.condition = holdMenuConditionOriginal;
};

//#region Global Animation UI Handlers
export const displayAnimationFrameCallback = (...args) => {
  // const keyframe = $('#keyframe');
  // console.log('displayAnimationFrameCallback:', args, 'keyframe:', keyframe); // keyframe is null here
};

export function updateKeyframeEasing(obj) {
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

export function updateKeyframeEasingArg(obj) {
  if ($(obj).val() === "-") return;
  // console.log('updateKeyframeEasingArg value:', $(obj).val(), 'obj:', obj); 
  Timeline.selected.forEach((kf) => {
    const value = parseEasingArg(kf, $(obj).val().trim());
    kf.easingArgs = [value];
    // obj.value = value;
  })
}

export const updateKeyframeSelectionCallback = (...args) => {
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