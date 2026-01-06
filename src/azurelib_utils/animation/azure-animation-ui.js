/**
 * AzureLib Animator — Animation UI
 * --------------------------------
 * Provides Blockbench UI enhancements for AzureLib animated models:
 * - Easing picker with type (in/out/inout) and argument inputs
 * - Selection-driven keyframe toolbar rendering
 * - Safe runtime monkeypatches with automatic cleanup
 *
 * © 2025 AzureDoom — MIT License
 */

import { uniq } from 'lodash';
import { injectOverride, PatchRegistry, hasArgs } from '../core/azure-utils';
import {
  EASING_TYPES,
  EASING_DEFAULT,
  getEasingArgDefault,
  parseEasingArg,
} from './azure-easing';

// ---------------------------------------------------------------------------
// Public lifecycle
// ---------------------------------------------------------------------------

/**
 * Wire up timeline/UI events and apply safe overrides used by AzureLib models.
 */
export const initializeAnimationUI = () => {
  Blockbench.on('display_animation_frame', onDisplayAnimationFrame);
  Blockbench.on('update_keyframe_selection', refreshKeyframeUI);

  // Provide globally callable handlers used by the toolbar inputs
  injectOverride(window, null, 'updateKeyframeEasing', applyKeyframeEasing);
  injectOverride(window, null, 'updateKeyframeEasingArg', applyEasingArgument);

  // Hide/disable Blockbench's stock interpolation control when Azure format is active
  injectOverride(
    BarItems.keyframe_interpolation,
    null,
    'condition',
    () => Format.id !== 'azure_model' && PatchRegistry.get(BarItems.keyframe_interpolation).condition()
  );
};

/**
 * Undo event wiring and overrides.
 */
export const unloadAnimationUI = () => {
  Blockbench.removeListener('display_animation_frame', onDisplayAnimationFrame);
  Blockbench.removeListener('update_keyframe_selection', refreshKeyframeUI);
};

// ---------------------------------------------------------------------------
// Global UI callbacks (event handlers / monkeypatched functions)
// ---------------------------------------------------------------------------

/** Frame render hook (reserved for future use). */
export const onDisplayAnimationFrame = () => {
  // No-op; kept for parity and future diagnostics
};

/**
 * Called by UI buttons to apply an easing name to all selected keyframes.
 * @param {string} easingId
 */
export function applyKeyframeEasing(easingId) {
  Undo.initEdit({ keyframes: Timeline.selected });
  if (easingId === '-') return;

  Timeline.selected.forEach(kf => {
    kf.easing = easingId;
  });

  // Ensure easing argument field updates to reflect the new easing
  if (typeof window.updateKeyframeSelection === 'function') {
    window.updateKeyframeSelection();
  }
  Undo.finishEdit('edit keyframe easing');
}

/**
 * Called by the numeric input to apply the easing argument.
 * @param {HTMLInputElement} el
 */
export function applyEasingArgument(el) {
  Undo.initEdit({ keyframes: Timeline.selected });
  const raw = $(el).val();
  if (raw === '-') return;

  const trimmed = String(raw).trim();
  Timeline.selected.forEach(kf => {
    const parsed = parseEasingArg(kf, trimmed);
    kf.easingArgs = [parsed];
  });

  Undo.finishEdit('edit keyframe easing argument');
}

/**
 * Rebuilds the easing UI for current selection when using the Azure model format.
 */
export const refreshKeyframeUI = () => {
  // Clear previous custom bars
  $('#keyframe_bar_easing').remove();
  $('#keyframe_bar_easing_type').remove();
  $('#keyframe_bar_easing_arg1').remove();

  // Hide pre/post UI toggle button in Azure format (kept consistent with prior behavior)
  const addPrePostButton = document.querySelector('#keyframe_type_label > div');
  if (addPrePostButton) addPrePostButton.hidden = Format.id === 'azure_model';

  if (!Timeline.selected.length || Format.id !== 'azure_model') return;

  // Build quick lookup: keyframes grouped and ordered by animator+channel
  const keyframesByChannel = Timeline.keyframes.reduce((acc, kf) => {
    if (!acc.has(kf.animator)) acc.set(kf.animator, {});
    const ch = acc.get(kf.animator);
    if (!ch[kf.channel]) ch[kf.channel] = [];
    ch[kf.channel].push(kf);
    ch[kf.channel].sort((a, b) => (a.time === b.time ? 0 : a.time < b.time ? -1 : 1));
    return acc;
  }, new Map());

  const firstInChannel = kf => keyframesByChannel.get(kf.animator)[kf.channel].indexOf(kf) < 1;

  // Only render when all selected are bone keyframes and not the first in their channel
  const validSelection =
    Timeline.selected.every(kf => kf.animator instanceof BoneAnimator && !firstInChannel(kf));
  if (!validSelection) return;

  // Read a "multi-select" value (collapses to conflict token if not uniform)
  const readMulti = (selector, def, conflict) => {
    const selectorFn =
      typeof selector === 'function' ? selector : x => (x?.[selector] === undefined ? def : x[selector]);

    if (Timeline.selected.length > 1) {
      const values = uniq(Timeline.selected.map(selectorFn));
      return values.length === 1 ? values[0] : conflict;
    }
    return selectorFn(Timeline.selected[0]) ?? def;
  };

  const displayedEasing = readMulti('easing', EASING_DEFAULT, 'null');

  // --- Build the primary Easing bar
  const keyframePanel = document.getElementById('panel_keyframe');
  if (!keyframePanel) return;

  let easingBar = document.createElement('div');
  keyframePanel.appendChild(easingBar);
  easingBar.outerHTML = `
    <div class="bar flex" style="flex-wrap: wrap" id="keyframe_bar_easing">
      <label class="tl" style="font-weight: bolder; min-width: 47px;">Easing</label>
    </div>`;
  easingBar = document.getElementById('keyframe_bar_easing');

  // Create easing icon buttons
  const easingButtons = [
    ['linear', 'Switch to Linear easing'],
    ['step', 'Switch to Step easing'],
    ['sine', 'Switch to Sine easing'],
    ['quad', 'Switch to Quadratic easing'],
    ['cubic', 'Switch to Cubic easing'],
    ['quart', 'Switch to Quartic easing'],
    ['quint', 'Switch to Quintic easing'],
    ['expo', 'Switch to Exponential easing'],
    ['circ', 'Switch to Circular easing'],
    ['back', 'Switch to Back easing'],
    ['elastic', 'Switch to Elastic easing'],
    ['bounce', 'Switch to Bounce easing'],
  ];

  easingButtons.forEach(([id, title]) => {
    appendIconButton(easingBar, id, title, () => {
      const selectedEasing = $('.selected_kf_easing');
      const selectedType = $('.selected_kf_easing_type');

      const currentKey = selectedEasing.attr('id')?.substring(15) || 'linear';
      const currentTypeKey = selectedType.length ? selectedType.attr('id').substring(15) : 'in';

      const currentFull = assembleEasingId(currentKey, currentTypeKey, currentKey);
      const nextFull = assembleEasingId(currentKey, currentTypeKey, id);

      if (currentFull !== nextFull) {
        applyKeyframeEasing(nextFull);
      }
    });
  });

  // Highlight current easing
  const mainId = easingInterpolationOf(displayedEasing);
  const mainBtn = document.getElementById('kf_easing_type_' + mainId);
  if (mainBtn) {
    mainBtn.style.stroke = 'var(--color-accent)';
    mainBtn.classList.add('selected_kf_easing');
  }

  // If the main easing is not linear/step, render type (in/out/inout) toggles
  if (!(mainId === 'linear' || mainId === 'step')) {
    let typeBar = document.createElement('div');
    keyframePanel.appendChild(typeBar);
    typeBar.outerHTML = `
      <div class="bar flex" id="keyframe_bar_easing_type">
        <label class="tl" style="font-weight: bolder; min-width: 47px;">Type</label>
      </div>`;
    typeBar = document.getElementById('keyframe_bar_easing_type');

    [
      ['in', 'Switch to In easing type'],
      ['out', 'Switch to Out easing type'],
      ['inout', 'Switch to In/Out easing type'],
    ].forEach(([id, title]) => {
      appendIconButton(typeBar, id, title, () => {
        const selectedEasing = $('.selected_kf_easing');
        const key = selectedEasing.attr('id')?.substring(15) || mainId;
        const currentType = easingTypeOf(displayedEasing);
        const currentFull = assembleEasingId(key, currentType, key);
        const nextFull = assembleEasingId(key, currentType, id);
        if (currentFull !== nextFull) {
          applyKeyframeEasing(nextFull);
        }
      });
    });

    const activeType = easingTypeOf(displayedEasing);
    const activeTypeBtn = document.getElementById('kf_easing_type_' + activeType);
    if (activeTypeBtn) {
      activeTypeBtn.style.stroke = 'var(--color-accent)';
      activeTypeBtn.classList.add('selected_kf_easing_type');
    }
  }

  // If the easing supports a numeric argument, render an input
  const argLabel = readMulti(getArgLabelForKeyframe, null, null);
  if (Timeline.selected.every(kf => hasArgs(kf.easing)) && argLabel !== null) {
    const defaultArg = readMulti(getEasingArgDefault, null, null);
    const [initialValue] = readMulti('easingArgs', [defaultArg], [defaultArg]);

    let argBar = document.createElement('div');
    keyframePanel.appendChild(argBar);
    argBar.outerHTML = `
      <div class="bar flex" id="keyframe_bar_easing_arg1">
        <label class="tl" style="font-weight: bolder; min-width: 90px;">${argLabel}</label>
        <input type="number" id="keyframe_easing_scale" class="dark_bordered code keyframe_input tab_target"
               value="${initialValue}" oninput="updateKeyframeEasingArg(this)" style="flex: 1; margin-right: 9px;">
      </div>`;
  }
};

// ---------------------------------------------------------------------------
// Helpers — ID assembly, parsing, UI and icons
// ---------------------------------------------------------------------------

/**
 * Normalize an easing ID from parts and/or a requested change.
 * - Accepts "linear" / "step" directly
 * - Otherwise produces strings like "easeInCubic", "easeOutSine", "easeInOutBack"
 */
function assembleEasingId(currentEasingName, currentType, requested) {
  const toTypeId = t => (t === 'out' ? 'Out' : t === 'inout' ? 'InOut' : 'In');

  // Direct linear/step
  if (requested === 'linear' || requested === 'step') return requested;

  // If the request is a type toggle, preserve the easing family
  if (requested === 'in' || requested === 'out' || requested === 'inout') {
    const typeId = toTypeId(requested);
    const family = capFirst(currentEasingName);
    return `ease${typeId}${family}`;
  }

  // Otherwise change easing family, keep current type
  const typeId = toTypeId(currentType);
  const family = capFirst(requested);
  return `ease${typeId}${family}`;
}

/** Return "sine", "quad", "linear", etc. */
function easingInterpolationOf(name) {
  const m = String(name).match(/^ease(?:InOut|In|Out)?([\w]+)$/);
  return m ? m[1].toLowerCase() : name;
}

/** Return "in", "out", or "inout" (default "in" for unknown). */
function easingTypeOf(name) {
  const m = String(name).match(/^ease(InOut|In|Out)?/);
  if (m && m[1]) return m[1].toLowerCase();
  return 'in';
}

function capFirst(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function appendIconButton(bar, key, title, onClick) {
  const div = document.createElement('div');
  div.innerHTML = ICONS[key] || ICONS.linear;
  div.id = 'kf_easing_type_' + key;
  div.setAttribute('style', 'stroke:var(--color-text);margin:0;padding:3px;width:30px;height:30px');
  div.setAttribute('title', title);
  div.onclick = onClick;
  bar.appendChild(div);
}

/** Derive label for the argument input field based on easing kind. */
function getArgLabelForKeyframe(kf) {
  switch (kf.easing) {
    case EASING_TYPES.easeInBack:
    case EASING_TYPES.easeOutBack:
    case EASING_TYPES.easeInOutBack:
      return 'Overshoot';
    case EASING_TYPES.easeInElastic:
    case EASING_TYPES.easeOutElastic:
    case EASING_TYPES.easeInOutElastic:
    case EASING_TYPES.easeInBounce:
    case EASING_TYPES.easeOutBounce:
    case EASING_TYPES.easeInOutBounce:
      return 'Bounciness';
    case EASING_TYPES.step:
      return 'Steps';
    default:
      return 'N/A';
  }
}

// ---------------------------------------------------------------------------
// SVG icon map (inline, no external assets)
// ---------------------------------------------------------------------------

const ICONS = {
  back:
    '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,295.94165 c 3.17500003,0 4.23333333,2.91041 5.29166663,-4.7625" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>',
  bounce:
    '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,296.47081 c 0.26458333,-0.26458 0.52916673,-0.26458 0.79375003,0 0.5291666,-0.52916 0.5291666,-0.52916 1.0583333,0 0.79375,-2.11666 1.5875,-2.11666 2.38125,0 0.2645833,-4.23333 1.0583333,-5.29165 1.0583333,-5.29165" style="fill:none;stroke-width:0.52899998;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>',
  circ:
    '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="M 0.52916667,296.47081 C 5.8208333,295.67706 5.8208333,293.82498 5.8208333,291.17915" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>',
  cubic:
    '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="M 0.52916667,296.47081 C 3.175,296.47081 4.7625,293.82498 5.8208333,291.17915" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>',
  elastic:
    '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,295.67706 c 0.79375003,0 0.79375003,-0.26458 1.32291663,-0.26458 0.5291667,0 0.79375,0.52917 1.3229167,0.52917 0.5291667,0 1.0094474,-1.83865 1.3229167,-0.79375 0.79375,2.64583 1.3229166,1.32292 1.3229166,-3.96874" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>',
  expo:
    '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,296.47081 c 4.23333333,0 5.29166663,-1.05833 5.29166663,-5.29166" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>',
  in:
    '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,296.47081 c 4.23333333,0 5.29166663,-1.05833 5.29166663,-5.29166" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>',
  inout:
    '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,296.47081 c 5.55625003,0 -0.26458334,-5.29166 5.29166663,-5.29166" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>',
  out:
    '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,296.47081 c 0,-4.23333 1.05833333,-5.29166 5.29166663,-5.29166" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>',
  quad:
    '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="M 0.52916667,296.47081 C 3.175,296.47081 4.7625,293.03123 5.8208333,291.17915" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>',
  quart:
    '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,296.47081 c 3.17500003,0 4.23333333,-2.64583 5.29166663,-5.29166" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>',
  quint:
    '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,296.47081 c 3.43958333,0 4.23333333,-1.85208 5.29166663,-5.29166" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>',
  sine:
    '<svg width="24" height="24" viewBox="0 0 6.3499999 6.3500002"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,296.47081 c 1.32291663,0 4.23333333,-3.43958 5.29166663,-5.29166" style="fill:none;stroke-width:0.5291667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>',
  step:
    '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="m 0.52916667,296.47081 0,-1.32291 H 1.8520833 v -1.32292 H 3.175 v -1.32292 h 1.3229167 v -1.32291 l 1.3229166,1e-5" style="fill:none;stroke-width:0.52899998;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>',
  linear:
    '<svg viewBox="0 0 6.3499999 6.3500002" height="24" width="24"><g transform="translate(0,-290.64998)"><path d="M 0.52916667,296.47081 5.8208333,291.17915" style="fill:none;stroke-width:0.52916667;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/></g></svg>',
};
