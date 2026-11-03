/**
 * AzureLib Animator — Play Behaviors
 * ----------------------------------
 * Adds AzureLib's play behaviors (ping-pong, repeat X times, freeze on frame) next to Blockbench's own loop modes,
 * only while an AzureLib model is open:
 *
 *   - the stock Animation Properties dialog gets the extra Loop Mode options plus their settings
 *   - the animation right-click "Loop Mode" submenu gets the extra options
 *   - timeline playback previews them for real (ping-pong plays back and forth, repeat stops after its plays,
 *     freeze stops at its frame)
 *   - the animation JSON gets the fields AzureLib reads, so mods don't need AzCommands for them
 *
 * JSON written per animation (read by AzAnimationDefaults on the mod side):
 *   "loop": true | "hold_on_last_frame" | "ping_pong" | "repeat_x_times" | "freeze_on_frame"   (omitted = play once)
 *   "repeat_times": 3        only with repeat_x_times
 *   "freeze_at": 1.25        only with freeze_on_frame, in seconds like every other time in the file
 *
 * © 2026 AzureDoom — MIT License
 */
const PROP_BEHAVIOR = 'azl_play_behavior';
const PROP_REPEAT = 'azl_repeat_times';
const PROP_FREEZE = 'azl_freeze_at';

const DEFAULT_REPEAT_TIMES = 2;

export const PLAY_BEHAVIORS = {
  play_once:          { label: 'menu.animation.loop.once', native: 'once', option: 'once',            extended: false },
  hold_on_last_frame: { label: 'menu.animation.loop.hold', native: 'hold', option: 'hold',            extended: false },
  loop:               { label: 'menu.animation.loop.loop', native: 'loop', option: 'loop',            extended: false },
  ping_pong:          { label: 'Ping-Pong',                native: 'loop', option: 'ping_pong',       extended: true  },
  repeat_x_times:     { label: 'Repeat',                   native: 'loop', option: 'repeat_x_times',  extended: true  },
  freeze_on_frame:    { label: 'Freeze',                   native: 'hold', option: 'freeze_on_frame', extended: true  },
};

const NATIVE_TO_BEHAVIOR = { once: 'play_once', loop: 'loop', hold: 'hold_on_last_frame' };
const OPTION_TO_BEHAVIOR = Object.fromEntries(Object.entries(PLAY_BEHAVIORS).map(([id, def]) => [def.option, id]));

const isAzureFormat = () => Format?.id === 'azure_model';
const roundSeconds = t => Math.round(t * 1e6) / 1e6;

function isCustomBehavior(name) {
  return typeof name === 'string' && name !== '' && !PLAY_BEHAVIORS[name];
}

export function getPlayBehavior(anim) {
  const extended = anim?.[PROP_BEHAVIOR];
  const def = PLAY_BEHAVIORS[extended];

  if (def?.extended && anim.loop === def.native) return extended;

  if (isCustomBehavior(extended) && anim.loop === 'once') return extended;

  return NATIVE_TO_BEHAVIOR[anim?.loop] || 'play_once';
}

export function getRepeatTimes(anim) {
  const value = Number(anim?.[PROP_REPEAT]);
  return Number.isFinite(value) && value >= 1 ? Math.round(value) : DEFAULT_REPEAT_TIMES;
}

export function getFreezeAt(anim) {
  const value = Number(anim?.[PROP_FREEZE]);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function hasFreezeAt(anim) {
  const value = Number(anim?.[PROP_FREEZE]);
  return Number.isFinite(value) && value >= 0;
}

export function repeatPlayCount(repeatTimes) {
  return Math.max(1, Math.round(repeatTimes));
}

function applyPlayBehavior(anim, behavior, { repeatTimes, freezeAt } = {}) {
  if (isCustomBehavior(behavior)) {
    anim.loop = 'once';
    anim[PROP_BEHAVIOR] = behavior;
    return;
  }

  const def = PLAY_BEHAVIORS[behavior] || PLAY_BEHAVIORS.play_once;

  anim.loop = def.native;
  anim[PROP_BEHAVIOR] = def.extended ? behavior : '';

  if (repeatTimes !== undefined) anim[PROP_REPEAT] = Math.max(1, Math.round(Number(repeatTimes) || 1));
  if (freezeAt !== undefined) anim[PROP_FREEZE] = Math.max(0, Number(freezeAt) || 0);
}

function playbackDiffers(anim, behavior, repeatTimes, freezeAt) {
  if (getPlayBehavior(anim) !== behavior) return true;
  if (behavior === 'repeat_x_times' && getRepeatTimes(anim) !== Math.max(1, Math.round(Number(repeatTimes) || 1))) return true;
  if (behavior === 'freeze_on_frame' && (!hasFreezeAt(anim) || getFreezeAt(anim) !== Math.max(0, Number(freezeAt) || 0))) return true;
  return false;
}

function setPlayBehaviorWithUndo(anim, behavior, settings = {}) {
  Undo.initEdit({ animations: [anim] });
  applyPlayBehavior(anim, behavior, settings);
  anim.saved = false;
  Undo.finishEdit('Change animation loop mode');
  resetPreviewClock();
  Animator.preview();
}

export function writePlaybackJson(anim, obj) {
  const behavior = getPlayBehavior(anim);

  delete obj.loop;
  delete obj.repeat_times;
  delete obj.freeze_at;

  switch (behavior) {
    case 'play_once':
      break;
    case 'loop':
      obj.loop = true;
      break;
    case 'repeat_x_times':
      obj.loop = behavior;
      obj.repeat_times = getRepeatTimes(anim);
      break;
    case 'freeze_on_frame':
      obj.loop = behavior;
      obj.freeze_at = roundSeconds(getFreezeAt(anim));
      break;
    default:
      obj.loop = behavior;
  }

  return obj;
}

export function readPlaybackJson(src) {
  const loop = typeof src?.loop === 'string' ? src.loop.trim() : src?.loop;
  let behavior;

  if (loop === true) behavior = 'loop';
  else if (loop === false || loop === undefined || loop === null || loop === '') behavior = 'play_once';
  else if (loop === 'once') behavior = 'play_once';
  else if (loop === 'hold') behavior = 'hold_on_last_frame';
  else if (PLAY_BEHAVIORS[loop]) behavior = loop;
  else if (isCustomBehavior(loop)) {
    return { loop: 'once', [PROP_BEHAVIOR]: loop };
  } else {
    behavior = 'play_once';
  }

  const def = PLAY_BEHAVIORS[behavior];
  const fields = {
    loop: def.native,
    [PROP_BEHAVIOR]: def.extended ? behavior : '',
  };

  if (src?.repeat_times !== undefined) fields[PROP_REPEAT] = Math.max(1, Math.round(Number(src.repeat_times) || 1));
  if (src?.freeze_at !== undefined) fields[PROP_FREEZE] = Math.max(0, Number(src.freeze_at) || 0);

  return fields;
}

export function assignPlaybackFields(anim, fields) {
  for (const [key, value] of Object.entries(fields)) {
    anim[key] = value;
  }
}

let originalPropertiesDialog = null;
let pendingDialogEdit = null;

function wrappedPropertiesDialog(...args) {
  if (!isAzureFormat() || typeof Dialog === 'undefined') {
    return originalPropertiesDialog.apply(this, args);
  }

  const animation = this;
  const proto = Dialog.prototype;
  const originalShow = proto.show;

  proto.show = function (...showArgs) {
    if (this.id === 'animation_properties' && !this._azlInjected) {
      this._azlInjected = true;
      try {
        injectPlaybackIntoDialog(this, animation);
      } catch (error) {
        console.error('[AzureLib] Failed to extend animation properties dialog', error);
      }
    }
    return originalShow.apply(this, showArgs);
  };

  try {
    return originalPropertiesDialog.apply(this, args);
  } finally {
    proto.show = originalShow;
  }
}

function injectPlaybackIntoDialog(dialog, animation) {
  const config = dialog.form_config;
  if (!config?.loop) return;

  const current = getPlayBehavior(animation);
  const options = {};
  for (const def of Object.values(PLAY_BEHAVIORS)) options[def.option] = def.label;
  if (isCustomBehavior(current)) options[current] = `Custom: ${current}`;

  const currentOption = PLAY_BEHAVIORS[current]?.option ?? current;
  const isRepeat = form => form.loop === 'repeat_x_times';
  const isFreeze = form => form.loop === 'freeze_on_frame';

  const playbackFields = {
    azl_repeat_times: {
      label: 'Repeat Count',
      type: 'number',
      value: getRepeatTimes(animation),
      min: 1,
      step: 1,
      condition: isRepeat,
      description: 'How many times the animation plays in total. Same value as AzCommand setRepeatAmount.'
    },
    azl_freeze_at: {
      label: 'Freeze At',
      type: 'number',
      value: hasFreezeAt(animation) ? getFreezeAt(animation) : roundSeconds(Timeline.time || 0),
      min: 0,
      step: 0.05,
      condition: isFreeze,
      description: 'Time in seconds where the animation stops and holds.',
    },
    azl_freeze_playhead: {
      type: 'buttons',
      buttons: ['Use Playhead Time'],
      condition: isFreeze,
      click() {
        dialog.setFormValues({ azl_freeze_at: roundSeconds(Timeline.time || 0) });
      },
    },
  };

  const rebuilt = {};
  for (const [key, value] of Object.entries(config)) {
    rebuilt[key] = key === 'loop' ? { ...value, options, value: currentOption } : value;
    if (key === 'loop') Object.assign(rebuilt, playbackFields);
  }
  dialog.form_config = rebuilt;

  const originalConfirm = dialog.onConfirm;

  dialog.onConfirm = (formResult, event) => {
    const behavior = OPTION_TO_BEHAVIOR[formResult.loop] ?? formResult.loop;
    const def = PLAY_BEHAVIORS[behavior];
    const edit = {
      animation,
      behavior,
      settings: {
        repeatTimes: behavior === 'repeat_x_times' ? formResult.azl_repeat_times : undefined,
        freezeAt: behavior === 'freeze_on_frame' ? formResult.azl_freeze_at : undefined,
      },
      applied: false,
    };

    const nativeResult = { ...formResult, loop: def ? def.native : 'once' };
    delete nativeResult.azl_repeat_times;
    delete nativeResult.azl_freeze_at;
    delete nativeResult.azl_freeze_playhead;

    pendingDialogEdit = edit;
    try {
      return originalConfirm?.(nativeResult, event);
    } finally {
      pendingDialogEdit = null;
      if (!edit.applied
        && playbackDiffers(animation, behavior, edit.settings.repeatTimes, edit.settings.freezeAt)) {
        setPlayBehaviorWithUndo(animation, behavior, edit.settings);
      }
    }
  };
}

function onEditAnimationProperties({ animation } = {}) {
  const edit = pendingDialogEdit;
  if (!edit || edit.animation !== animation) return;

  applyPlayBehavior(animation, edit.behavior, edit.settings);
  edit.applied = true;
  resetPreviewClock();
}

const injectedMenuItems = [];
const wrappedNativeMenuItems = [];

const radioIcon = selected => (selected ? 'far.fa-dot-circle' : 'far.fa-circle');

function findLoopSubmenu() {
  const structure = Animation.prototype.menu?.structure;
  if (!Array.isArray(structure)) return null;
  return structure.find(item => item && typeof item === 'object' && item.name === 'menu.animation.loop') || null;
}

function injectLoopMenu() {
  const loopMenu = findLoopSubmenu();
  if (!loopMenu || !Array.isArray(loopMenu.children)) {
    console.warn('[AzureLib] Animation loop submenu not found; extended loop modes are only in the properties dialog');
    return;
  }

  const nativeByLabel = {
    'menu.animation.loop.once': 'play_once',
    'menu.animation.loop.hold': 'hold_on_last_frame',
    'menu.animation.loop.loop': 'loop',
  };

  for (const item of loopMenu.children) {
    const behavior = nativeByLabel[item?.name];
    if (!behavior) continue;

    const original = { icon: item.icon, click: item.click };
    wrappedNativeMenuItems.push({ item, original });

    item.icon = animation => (isAzureFormat()
      ? radioIcon(getPlayBehavior(animation) === behavior)
      : (typeof original.icon === 'function' ? original.icon(animation) : original.icon));

    item.click = (animation, event) => (isAzureFormat()
      ? setPlayBehaviorFromMenu(animation, behavior)
      : original.click?.(animation, event));
  }

  for (const behavior of ['ping_pong', 'repeat_x_times', 'freeze_on_frame']) {
    const def = PLAY_BEHAVIORS[behavior];
    const menuItem = {
      name: def.label === 'Repeat' ? 'Repeat X Times' : def.label === 'Freeze' ? 'Freeze on Frame' : def.label,
      id: `azl_loop_${behavior}`,
      icon: animation => radioIcon(getPlayBehavior(animation) === behavior),
      condition: () => isAzureFormat(),
      click: animation => setPlayBehaviorFromMenu(animation, behavior),
    };
    loopMenu.children.push(menuItem);
    injectedMenuItems.push({ loopMenu, menuItem });
  }
}

function setPlayBehaviorFromMenu(animation, behavior) {
  if (!animation || getPlayBehavior(animation) === behavior) return;

  const settings = behavior === 'freeze_on_frame' && !hasFreezeAt(animation)
    ? { freezeAt: roundSeconds(Timeline.time || 0) }
    : {};

  setPlayBehaviorWithUndo(animation, behavior, settings);
}

function restoreLoopMenu() {
  for (const { loopMenu, menuItem } of injectedMenuItems) {
    const index = loopMenu.children.indexOf(menuItem);
    if (index !== -1) loopMenu.children.splice(index, 1);
  }
  injectedMenuItems.length = 0;

  for (const { item, original } of wrappedNativeMenuItems) {
    item.icon = original.icon;
    item.click = original.click;
  }
  wrappedNativeMenuItems.length = 0;
}

let originalTimelineLoop = null;
let previewClock = null;

function resetPreviewClock() {
  previewClock = null;
}

function getPreviewBehavior(anim) {
  if (!isAzureFormat() || !anim || !(anim.length > 0)) return null;
  if (anim.anim_time_update) return null;
  if (Timeline.custom_range?.[1]) return null;

  const behavior = getPlayBehavior(anim);
  return PLAY_BEHAVIORS[behavior]?.extended ? behavior : null;
}

function startPreviewClock(anim, behavior) {
  const length = anim.length;
  const time = Timeline.time || 0;

  switch (behavior) {
    case 'freeze_on_frame': {
      const freezeAt = Math.min(getFreezeAt(anim), length);
      if (time >= freezeAt - 1e-4) {
        Timeline.setTime(0);
        return 0;
      }
      return time;
    }
    case 'repeat_x_times':
      if (time >= length - 1e-4) {
        Timeline.setTime(0);
        return 0;
      }
      return time;
    default:
      return time;
  }
}

function previewDelta() {
  const now = performance.now();
  let delta = (now - Timeline.last_frame_timecode) / 1000;
  if (delta < 0) delta += 1;
  Timeline.last_frame_timecode = now;
  return Math.clamp(delta, 0, 0.1) * ((Timeline.playback_speed ?? 100) / 100);
}

function stopPreview(time, keepPose) {
  Timeline.setTime(time);
  Animator.preview(false);
  Timeline.pause();
  previewClock = null;
  if (!keepPose) Animator.preview();
}

function wrappedTimelineLoop(...args) {
  const anim = Animation.selected;
  const behavior = getPreviewBehavior(anim);

  if (!behavior) {
    previewClock = null;
    return originalTimelineLoop.apply(this, args);
  }

  if (previewClock === null) previewClock = startPreviewClock(anim, behavior);
  previewClock += previewDelta();

  const length = anim.length;
  const looped = !!BarItems.looped_animation_playback?.value;

  switch (behavior) {
    case 'ping_pong': {
      const cycle = previewClock % (2 * length);
      Timeline.setTime(cycle <= length ? cycle : 2 * length - cycle);
      Animator.preview(true);
      return;
    }

    case 'repeat_x_times': {
      const total = repeatPlayCount(getRepeatTimes(anim)) * length;

      if (previewClock >= total) {
        if (looped) {
          previewClock %= total;
        } else {
          stopPreview(0, false);
          return;
        }
      }

      Timeline.setTime(previewClock % length);
      Animator.preview(true);
      return;
    }

    case 'freeze_on_frame': {
      const freezeAt = Math.min(getFreezeAt(anim), length);

      if (previewClock >= freezeAt) {
        if (looped) {
          previewClock = 0;
          Timeline.setTime(0);
          Animator.preview(true);
        } else {
          stopPreview(freezeAt, true);
        }
        return;
      }

      Timeline.setTime(previewClock);
      Animator.preview(true);
    }
  }
}

function onTimelinePlay() {
  previewClock = null;
}

let properties = [];
let registered = false;

export function registerPlayBehaviors() {
  if (registered) return;
  registered = true;

  if (typeof Property !== 'undefined') {
    properties = [
      new Property(Animation, 'string', PROP_BEHAVIOR, { default: '' }),
      new Property(Animation, 'number', PROP_REPEAT, { default: DEFAULT_REPEAT_TIMES }),
      new Property(Animation, 'number', PROP_FREEZE, { default: -1 }),
    ];
  }

  if (typeof Animation.prototype.propertiesDialog === 'function') {
    originalPropertiesDialog = Animation.prototype.propertiesDialog;
    Animation.prototype.propertiesDialog = wrappedPropertiesDialog;
  }

  try {
    injectLoopMenu();
  } catch (error) {
    console.error('[AzureLib] Failed to extend animation loop menu', error);
  }

  if (typeof Timeline?.loop === 'function') {
    originalTimelineLoop = Timeline.loop;
    Timeline.loop = wrappedTimelineLoop;
  }

  Blockbench.on('edit_animation_properties', onEditAnimationProperties);
  Blockbench.on('timeline_play', onTimelinePlay);
}

export function unregisterPlayBehaviors() {
  if (!registered) return;
  registered = false;

  Blockbench.removeListener('edit_animation_properties', onEditAnimationProperties);
  Blockbench.removeListener('timeline_play', onTimelinePlay);

  if (originalTimelineLoop) {
    Timeline.loop = originalTimelineLoop;
    originalTimelineLoop = null;
  }
  previewClock = null;

  restoreLoopMenu();

  if (originalPropertiesDialog) {
    Animation.prototype.propertiesDialog = originalPropertiesDialog;
    originalPropertiesDialog = null;
  }

  properties.forEach(property => property.delete?.());
  properties = [];
}
