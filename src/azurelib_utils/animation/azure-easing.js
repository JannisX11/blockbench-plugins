/**
 * AzureLib Animator — Easing Definitions
 * --------------------------------------
 * Provides the easing function registry and argument parsing logic
 * used for interpolating animated keyframes in AzureLib.
 *
 * © 2025 AzureDoom — MIT License
 */

import { clamp } from 'lodash';

// ---------------------------------------------------------------------------
// Constants and types
// ---------------------------------------------------------------------------

/**
 * Enumeration of supported easing functions.
 * Matches AzureLib's Java easing mappings for full parity.
 */
export const EASING_TYPES = {
  linear: 'linear',
  step: 'step',
  easeInSine: 'easeInSine',
  easeOutSine: 'easeOutSine',
  easeInOutSine: 'easeInOutSine',
  easeInQuad: 'easeInQuad',
  easeOutQuad: 'easeOutQuad',
  easeInOutQuad: 'easeInOutQuad',
  easeInCubic: 'easeInCubic',
  easeOutCubic: 'easeOutCubic',
  easeInOutCubic: 'easeInOutCubic',
  easeInQuart: 'easeInQuart',
  easeOutQuart: 'easeOutQuart',
  easeInOutQuart: 'easeInOutQuart',
  easeInQuint: 'easeInQuint',
  easeOutQuint: 'easeOutQuint',
  easeInOutQuint: 'easeInOutQuint',
  easeInExpo: 'easeInExpo',
  easeOutExpo: 'easeOutExpo',
  easeInOutExpo: 'easeInOutExpo',
  easeInCirc: 'easeInCirc',
  easeOutCirc: 'easeOutCirc',
  easeInOutCirc: 'easeInOutCirc',
  easeInBack: 'easeInBack',
  easeOutBack: 'easeOutBack',
  easeInOutBack: 'easeInOutBack',
  easeInElastic: 'easeInElastic',
  easeOutElastic: 'easeOutElastic',
  easeInOutElastic: 'easeInOutElastic',
  easeInBounce: 'easeInBounce',
  easeOutBounce: 'easeOutBounce',
  easeInOutBounce: 'easeInOutBounce',
};

/** Default easing for new keyframes. */
export const EASING_DEFAULT = EASING_TYPES.linear;

/** Default argument for easing functions that use one. */
export const DEFAULT_ARG = 1;

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

/**
 * Compute an eased value between 0 and 1 based on an easing type.
 * @param {string} easingName
 * @param {number} t - normalized time (0..1)
 * @param {number} [arg] - optional argument
 * @returns {number}
 */
export function applyEasing(easingName, t, arg = DEFAULT_ARG) {
  const ease = easingRegistry[easingName] || easingRegistry.linear;
  return ease(t, arg);
}

/**
 * Return whether a given easing type expects a numeric argument.
 * @param {string} easingName
 * @returns {boolean}
 */
export function hasArgs(easingName) {
  return (
    easingName?.includes('Back') ||
    easingName?.includes('Elastic') ||
    easingName?.includes('Bounce') ||
    easingName === 'step'
  );
}

/**
 * Returns the default argument for a given easing.
 * @param {string} easingName
 * @returns {number}
 */
export function getEasingArgDefault(easingName) {
  if (!hasArgs(easingName)) return DEFAULT_ARG;
  if (easingName?.includes('Back')) return 1.70158;
  if (easingName?.includes('Elastic')) return 1;
  if (easingName?.includes('Bounce')) return 1;
  if (easingName === 'step') return 4;
  return DEFAULT_ARG;
}

/**
 * Parses an argument from user input, falling back to defaults if invalid.
 * @param {object} keyframe
 * @param {string} input
 * @returns {number}
 */
export function parseEasingArg(keyframe, input) {
  const num = parseFloat(input);
  if (isNaN(num)) return getEasingArgDefault(keyframe.easing);
  const arg = Math.max(-9999, Math.min(9999, num));
  return arg;
}

// ---------------------------------------------------------------------------
// Easing function implementations
// ---------------------------------------------------------------------------

const PI = Math.PI;
const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = (2 * PI) / 3;
const c5 = (2 * PI) / 4.5;

const bounceOut = x => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
};

/**
 * The easing registry maps an easing name → function.
 * Each function takes `(t, arg?)` and returns eased t.
 */
export const easingRegistry = {
  linear: t => t,

  step: (t, n = 4) => Math.floor(clamp(t * n, 0, n - 1)) / (n - 1),

  easeInSine: t => 1 - Math.cos((t * PI) / 2),
  easeOutSine: t => Math.sin((t * PI) / 2),
  easeInOutSine: t => -(Math.cos(PI * t) - 1) / 2,

  easeInQuad: t => t * t,
  easeOutQuad: t => 1 - (1 - t) * (1 - t),
  easeInOutQuad: t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),

  easeInCubic: t => t * t * t,
  easeOutCubic: t => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: t =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,

  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - Math.pow(1 - t, 4),
  easeInOutQuart: t =>
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,

  easeInQuint: t => t * t * t * t * t,
  easeOutQuint: t => 1 - Math.pow(1 - t, 5),
  easeInOutQuint: t =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2,

  easeInExpo: t => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  easeOutExpo: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: t =>
    t === 0
      ? 0
      : t === 1
      ? 1
      : t < 0.5
      ? Math.pow(2, 20 * t - 10) / 2
      : (2 - Math.pow(2, -20 * t + 10)) / 2,

  easeInCirc: t => 1 - Math.sqrt(1 - Math.pow(t, 2)),
  easeOutCirc: t => Math.sqrt(1 - Math.pow(t - 1, 2)),
  easeInOutCirc: t =>
    t < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2,

  easeInBack: (t, s = c1) => c3 * t * t * t - s * t * t,
  easeOutBack: (t, s = c1) =>
    1 + c3 * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
  easeInOutBack: (t, s = c1) =>
    t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2,

  easeInElastic: (t, p = 1) =>
    t === 0
      ? 0
      : t === 1
      ? 1
      : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4 * p),

  easeOutElastic: (t, p = 1) =>
    t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4 * p) + 1,

  easeInOutElastic: (t, p = 1) =>
    t === 0
      ? 0
      : t === 1
      ? 1
      : t < 0.5
      ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5 * p)) / 2
      : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5 * p)) / 2 +
        1,

  easeInBounce: t => 1 - bounceOut(1 - t),
  easeOutBounce: bounceOut,
  easeInOutBounce: t =>
    t < 0.5
      ? (1 - bounceOut(1 - 2 * t)) / 2
      : (1 + bounceOut(2 * t - 1)) / 2,
};

export default easingRegistry;
