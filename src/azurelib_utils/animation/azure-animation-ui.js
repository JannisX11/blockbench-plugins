/**
 * AzureLib Animator — Unified Animation UI
 * ----------------------------------------
 * Custom animation panel that replaces the Minecraft Bedrock animation tab.
 * Supports AzureLib custom easings and Bedrock lerp_mode (catmullrom/linear)
 * in one unified interface.
 *
 * UI features:
 *   - Easing family picker (Azure easings: sine, quad, cubic … + linear/step)
 *   - In / Out / InOut type toggle
 *   - Numeric argument input for Back/Elastic/Bounce/Step
 *   - Bedrock catmullrom toggle (sets interpolation, not easing)
 *   - All controls update all selected keyframes atomically via the undo system
 *
 * © 2025 AzureDoom — MIT License
 */

import { uniq } from 'lodash';
import { injectOverride, PatchRegistry } from '../core/azure-utils.js';
import {
  EASING_TYPES,
  EASING_DEFAULT,
  getEasingArgDefault,
  parseEasingArg,
  hasArgs,
} from './azure-easing.js';

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

let _uiListeners = false;

export function initializeAnimationUI() {
  if (_uiListeners) return;

  Blockbench.on('display_animation_frame', _onFrame);
  Blockbench.on('update_keyframe_selection', refreshKeyframeUI);

  // Expose handlers globally so inline HTML oninput/onclick can call them
  window._azureApplyEasing       = applyKeyframeEasing;
  window._azureApplyEasingArg    = applyEasingArgument;
  window._azureToggleCatmullrom  = toggleCatmullrom;  // kept for compat
  window._azureSetInterpolation   = setInterpolation;

  // Suppress Blockbench's stock interpolation selector in Azure format
  _patchStockInterpolationBar();

  _uiListeners = true;
  console.log('[AzureLib] Animation UI initialised');
}

export function unloadAnimationUI() {
  if (!_uiListeners) return;

  Blockbench.removeListener('display_animation_frame', _onFrame);
  Blockbench.removeListener('update_keyframe_selection', refreshKeyframeUI);

  delete window._azureApplyEasing;
  delete window._azureApplyEasingArg;
  delete window._azureToggleCatmullrom;

  _cleanupKeyframePanel();
  _uiListeners = false;
}

// ---------------------------------------------------------------------------
// Keyframe panel refresh (main entry point)
// ---------------------------------------------------------------------------

const PANEL_BARS = [
  'azl_bar_catmullrom',
  'azl_bar_easing',
  'azl_bar_easing_azure',
  'azl_bar_easing_type',
  'azl_bar_easing_arg',
];

export function refreshKeyframeUI() {
  _cleanupKeyframePanel();

  // Only show Azure controls when our format is active
  if (Format?.id !== 'azure_model') return;

  // Show/hide the stock pre/post toggle button
  const addPrePost = document.querySelector('#keyframe_type_label > div');
  if (addPrePost) addPrePost.hidden = true;

  const selected = Timeline.selected;
  if (!selected || !selected.length) return;

  const keyframesByChannel = _groupByChannel(Timeline.keyframes);
  const firstInChannel = kf => {
    const ch = keyframesByChannel.get(kf.animator)?.[kf.channel] || [];
    return ch.indexOf(kf) < 1;
  };

  // Only render for bone keyframes that are not the first in their channel
  if (!selected.every(kf => kf.animator instanceof BoneAnimator && !firstInChannel(kf))) return;

  const panel = document.getElementById('panel_keyframe');
  if (!panel) return;

  _renderInterpolationBar(panel, selected);
  _renderEasingBar(panel, selected);
}

// ---------------------------------------------------------------------------
// Bedrock interpolation bar
// Blockbench stores these as kf.interpolation:
//   undefined / null → AzureLib easing mode (our default)
//   'catmullrom'     → Bedrock smooth spline (BB "Smooth")
//   'bezier'         → Bezier curves (BB "Bezier")
//   'step'           → Discrete step (BB "Step")
// ---------------------------------------------------------------------------

/**
 * All Blockbench-native interpolation modes we expose.
 * Selecting any of these sets kf.interpolation and clears kf.easing.
 * "Azure Easing" is our own mode — clears interpolation, uses kf.easing instead.
 */
const BB_INTERP_MODES = [
  { id: null,          label: 'Azure Easing', title: 'Use AzureLib custom easing (see section below)' },
  { id: 'catmullrom',  label: 'Smooth',        title: 'Bedrock catmullrom spline (BB: Smooth)' },
  { id: 'bezier',      label: 'Bezier',        title: 'Bezier curve interpolation (BB: Bezier)' },
  { id: 'step',        label: 'Step',          title: 'Discrete step / hold (BB: Step)' },
];

function _renderInterpolationBar(panel, selected) {
  // Read the shared interpolation across selected keyframes.
  // null/undefined both mean "Azure easing mode".
  const currentInterp = _readMulti(
    selected,
    kf => kf.interpolation ?? null,
    null,
    '(mixed)',
  );

  const bar = _createBar('azl_bar_catmullrom', panel);

  // Section heading — plain text, no background, matches BB's own keyframe labels
  const heading = document.createElement('p');
  heading.style.cssText = 'min-width:100%;margin:4px 0 2px 0;padding:0;color:var(--color-text);';
  heading.textContent = 'Interpolation';
  bar.appendChild(heading);

  for (const { id, label, title } of BB_INTERP_MODES) {
    const isActive = (currentInterp === id);
    const btn = document.createElement('button');
    btn.id = 'azl_btn_interp_' + (id ?? 'azure');
    btn.className = 'dark_bordered';
    btn.textContent = label;
    btn.title = title;
    btn.style.cssText = `padding:2px 10px;margin:1px;cursor:pointer;${isActive ? 'color:var(--color-accent);border-color:var(--color-accent);' : ''}`;
    btn.onclick = () => window._azureSetInterpolation(id);
    bar.appendChild(btn);
  }
}

// ---------------------------------------------------------------------------
// Easing bar
// ---------------------------------------------------------------------------

/**
 * AzureLib easing families (custom Java-side easings).
 * "linear" and "step" are special-cased (no In/Out/InOut variants).
 */
const AZURE_EASING_FAMILIES = [
  { id: 'linear',  label: 'Linear'  },
  { id: 'step',    label: 'Step'    },
  { id: 'sine',    label: 'Sine'    },
  { id: 'quad',    label: 'Quad'    },
  { id: 'cubic',   label: 'Cubic'   },
  { id: 'quart',   label: 'Quart'   },
  { id: 'quint',   label: 'Quint'   },
  { id: 'expo',    label: 'Expo'    },
  { id: 'circ',    label: 'Circ'    },
  { id: 'back',    label: 'Back'    },
  { id: 'elastic', label: 'Elastic' },
  { id: 'bounce',  label: 'Bounce'  },
];

const EASING_TYPES_LIST = [
  { id: 'in',    label: 'In'    },
  { id: 'out',   label: 'Out'   },
  { id: 'inout', label: 'In/Out'},
];

function _renderEasingBar(panel, selected) {
  // Don't show Azure easing picker when all selected have a Bedrock interpolation mode.
  // (If interpolation is set, easing is irrelevant for those keyframes.)
  const allBedrock = selected.every(kf => !!kf.interpolation);
  const allCatmullrom = allBedrock; // alias kept for the checks below

  const displayedEasing = _readMulti(selected, kf => kf.easing, EASING_DEFAULT, '(mixed)');
  const currentFamily   = _easingFamilyOf(displayedEasing);
  const currentType     = _easingTypeOf(displayedEasing);

  // --- Section header ---
  const headerBar = _createBar('azl_bar_easing', panel);
  const easingHeading = document.createElement('p');
  easingHeading.style.cssText = 'min-width:100%;margin:4px 0 2px 0;padding:0;color:var(--color-text);';
  easingHeading.textContent = 'AzureLib Easings';
  headerBar.appendChild(easingHeading);

  // --- Azure easing family buttons (icon + label inside each button) ---
  const azureRow = _createBar('azl_bar_easing_azure', panel);
  azureRow.style.flexWrap = 'wrap';

  for (const { id, label } of AZURE_EASING_FAMILIES) {
    const isSelected = !allCatmullrom && (id === currentFamily);
    const icon = EASING_ICONS[id] || '';
    const btn = document.createElement('button');
    btn.id = `azl_kf_easing_${id}`;
    btn.className = 'dark_bordered';
    btn.title = `Switch to ${label} easing`;
    btn.style.cssText = `
      padding: 2px 6px;
      margin: 1px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 3px;
      ${isSelected ? 'color:var(--color-accent);border-color:var(--color-accent);' : ''}
    `;
    btn.innerHTML = `${icon}<span>${label}</span>`;
    btn.onclick = () => {
      const nextEasing = _assembleEasingId(id, currentType);
      applyKeyframeEasing(nextEasing);
    };
    azureRow.appendChild(btn);
  }

  // --- Type (In / Out / In/Out) row — only for families with variants ---
  if (!allCatmullrom && currentFamily !== 'linear' && currentFamily !== 'step') {
    const typeBar = _createBar('azl_bar_easing_type', panel);
    const typeHeading = document.createElement('p');
    typeHeading.style.cssText = 'min-width:100%;margin:4px 0 2px 0;padding:0;color:var(--color-text);';
    typeHeading.textContent = 'Type';
    typeBar.appendChild(typeHeading);

    for (const { id, label } of EASING_TYPES_LIST) {
      const isActive = (id === currentType);
      const btn = document.createElement('button');
      btn.id = `azl_kf_type_${id}`;
      btn.className = 'dark_bordered';
      btn.textContent = label;
      btn.style.cssText = `
        padding: 2px 10px;
        margin: 1px;
        cursor: pointer;
        ${isActive ? 'color:var(--color-accent);border-color:var(--color-accent);' : ''}
      `;
      btn.onclick = () => {
        const nextEasing = _assembleEasingId(currentFamily, id);
        applyKeyframeEasing(nextEasing);
      };
      typeBar.appendChild(btn);
    }
  }

  // --- Argument row (for Back/Elastic/Bounce/Step) ---
  if (selected.every(kf => hasArgs(kf.easing))) {
    const argLabel = _getArgLabel(selected[0].easing);
    const defaultArg = getEasingArgDefault(selected[0].easing);
    const currentArg = _readMulti(
      selected,
      kf => (Array.isArray(kf.easingArgs) && kf.easingArgs.length ? kf.easingArgs[0] : defaultArg),
      defaultArg,
      defaultArg,
    );

    const argBar = _createBar('azl_bar_easing_arg', panel);
    argBar.innerHTML = `
      <p style="margin:4px 0 2px 0;padding:0;color:var(--color-text);min-width:90px;">${argLabel}</p>
      <input
        type="number"
        id="azl_easing_arg_input"
        class="dark_bordered code keyframe_input tab_target"
        value="${currentArg}"
        oninput="window._azureApplyEasingArg(this)"
        style="flex:1;margin-right:9px;">`;
  }
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

/**
 * Apply an easing name to all selected keyframes.
 * @param {string} easingId - e.g. 'easeInSine', 'linear', 'step'
 */
export function applyKeyframeEasing(easingId) {
  if (!easingId || easingId === '-') return;
  Undo.initEdit({ keyframes: Timeline.selected });

  Timeline.selected.forEach(kf => {
    kf.easing = easingId;
    // Switching to an Azure easing clears any Bedrock interpolation mode
    if (kf.interpolation) kf.interpolation = undefined;
  });

  Undo.finishEdit('Set keyframe easing');
  refreshKeyframeUI();
}

/**
 * Apply the numeric easing argument from the input field.
 * @param {HTMLInputElement} el
 */
export function applyEasingArgument(el) {
  const raw = $(el).val();
  if (raw === '' || raw === '-') return;
  Undo.initEdit({ keyframes: Timeline.selected });

  Timeline.selected.forEach(kf => {
    kf.easingArgs = [parseEasingArg(kf, String(raw).trim())];
  });

  Undo.finishEdit('Set keyframe easing argument');
}

/**
 * Set a Blockbench-native interpolation mode on all selected keyframes.
 * @param {string|null} mode - 'catmullrom' | 'bezier' | 'step' | null
 *   null means "Azure easing mode" — clears interpolation so kf.easing takes over.
 */
export function setInterpolation(mode) {
  Undo.initEdit({ keyframes: Timeline.selected });

  Timeline.selected.forEach(kf => {
    if (mode === null || mode === undefined) {
      // Azure easing mode: clear BB interpolation
      kf.interpolation = undefined;
    } else {
      // Bedrock interpolation: set mode, clear Azure easing
      kf.interpolation = mode;
      kf.easing = EASING_DEFAULT;
      kf.easingArgs = undefined;
    }
  });

  Undo.finishEdit('Set keyframe interpolation');
  refreshKeyframeUI();
}

/** @deprecated use setInterpolation — kept for backward compatibility */
export function toggleCatmullrom(forceValue) {
  setInterpolation(forceValue === false ? null : 'catmullrom');
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function _onFrame() { /* reserved */ }

function _createBar(id, parent) {
  const el = document.createElement('div');
  el.id = id;
  el.className = 'bar flex';
  el.style.flexWrap = 'wrap';
  el.style.alignItems = 'center';
  el.style.gap = '2px';
  el.style.marginTop = '4px';
  parent.appendChild(el);
  return el;
}

function _cleanupKeyframePanel() {
  PANEL_BARS.forEach(id => document.getElementById(id)?.remove());
  const prePost = document.querySelector('#keyframe_type_label > div');
  if (prePost) prePost.hidden = false;
}

function _groupByChannel(keyframes) {
  const map = new Map();
  for (const kf of keyframes) {
    if (!map.has(kf.animator)) map.set(kf.animator, {});
    const ch = map.get(kf.animator);
    if (!ch[kf.channel]) ch[kf.channel] = [];
    ch[kf.channel].push(kf);
    ch[kf.channel].sort((a, b) => a.time - b.time);
  }
  return map;
}

/**
 * Read a value from all selected keyframes.
 * If all values are equal, return it; otherwise return `conflict`.
 */
function _readMulti(selected, selector, def, conflict) {
  const fn = typeof selector === 'function' ? selector : kf => kf[selector];
  if (selected.length === 0) return def;
  if (selected.length === 1) return fn(selected[0]) ?? def;
  const values = uniq(selected.map(fn));
  return values.length === 1 ? values[0] : conflict;
}

/**
 * Extract the easing family from a full easing name.
 * 'easeInOutSine' → 'sine', 'linear' → 'linear'
 */
function _easingFamilyOf(name) {
  if (!name || name === 'linear') return 'linear';
  if (name === 'step') return 'step';
  const m = String(name).match(/^ease(?:InOut|In|Out)([\w]+)$/i);
  return m ? m[1].toLowerCase() : name.toLowerCase();
}

/**
 * Extract the easing type (in/out/inout) from a full easing name.
 * 'easeInOutSine' → 'inout', 'easeOutBounce' → 'out', 'easeInQuad' → 'in'
 */
function _easingTypeOf(name) {
  const m = String(name).match(/^ease(InOut|In|Out)/i);
  if (!m) return 'in';
  const raw = m[1].toLowerCase();
  return raw === 'inout' ? 'inout' : raw;
}

/**
 * Assemble a full easing ID from family + type.
 * ('sine', 'out') → 'easeOutSine'
 * ('linear', *) → 'linear'
 * ('step', *) → 'step'
 */
function _assembleEasingId(family, type) {
  if (family === 'linear') return 'linear';
  if (family === 'step') return 'step';
  const typeStr = type === 'inout' ? 'InOut' : type === 'out' ? 'Out' : 'In';
  return `ease${typeStr}${family.charAt(0).toUpperCase()}${family.slice(1)}`;
}

function _getArgLabel(easing) {
  if (!easing) return 'Arg';
  if (easing.includes('Back')) return 'Overshoot';
  if (easing.includes('Elastic')) return 'Bounciness';
  if (easing.includes('Bounce')) return 'Bounciness';
  if (easing === 'step') return 'Steps';
  return 'Arg';
}

function _patchStockInterpolationBar() {
  if (!BarItems.keyframe_interpolation) return;
  const orig = BarItems.keyframe_interpolation.condition;
  BarItems.keyframe_interpolation.condition = function (...args) {
    if (Format?.id === 'azure_model') return false;
    return typeof orig === 'function' ? orig.apply(this, args) : true;
  };
}

// ---------------------------------------------------------------------------
// SVG easing curve icons (inline)
// ---------------------------------------------------------------------------

const EASING_ICONS = {
  linear:  '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="M 0.53,5.82 5.82,0.53" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  step:    '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="m 0.53,5.82 0,-1.32 H 1.85 v -1.32 H 3.17 v -1.33 h 1.32 v -1.32 l 1.33,1e-5" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  sine:    '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="M 0.53,5.82 C 1.85,5.82 4.76,2.38 5.82,0.53" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  quad:    '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="M 0.53,5.82 C 3.17,5.82 4.76,3.04 5.82,0.53" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  cubic:   '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="M 0.53,5.82 C 3.17,5.82 4.76,3.82 5.82,0.53" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  quart:   '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="m 0.53,5.82 c 3.17,0 4.23,-2.64 5.29,-5.29" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  quint:   '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="m 0.53,5.82 c 3.44,0 4.23,-1.85 5.29,-5.29" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  expo:    '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="m 0.53,5.82 c 4.23,0 5.29,-1.06 5.29,-5.29" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  circ:    '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="M 0.53,5.82 C 5.82,4.97 5.82,3.17 5.82,0.53" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  back:    '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="m 0.53,5.29 c 3.17,0 4.23,2.91 5.29,-4.76" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  elastic: '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="m 0.53,5.15 c 0.79,0 0.79,-0.26 1.32,-0.26 0.53,0 0.79,0.53 1.32,0.53 0.53,0 1.01,-1.84 1.32,-0.79 0.79,2.64 1.32,1.32 1.32,-3.97" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  bounce:  '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="m 0.53,5.82 c 0.26,-0.26 0.53,-0.26 0.79,0 0.53,-0.53 0.53,-0.53 1.06,0 0.79,-2.12 1.59,-2.12 2.38,0 0.26,-4.23 1.06,-5.29 1.06,-5.29" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
};
