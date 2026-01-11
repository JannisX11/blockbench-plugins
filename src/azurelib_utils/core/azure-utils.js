/**
 * AzureLib Animator — Utility & Patching Layer
 * --------------------------------------------
 * Provides function override registration and restoration.
 * Replaces the old addMonkeypatch/removeMonkeypatch system.
 *
 * © 2025 AzureDoom — MIT License
 */

export const PatchRegistry = new Map();

/**
 * Register a new override on a target object.
 * Keeps a reference to the original method.
 */
export function injectOverride(symbol, path, key, newImpl) {
  const target = path ? symbol[path] : symbol;
  if (!PatchRegistry.has(symbol)) PatchRegistry.set(symbol, { _target: target });
  const entry = PatchRegistry.get(symbol);
  entry[key] = target[key];
  target[key] = newImpl;
}

/**
 * Restore all previously injected overrides.
 */
export function restoreOverrides() {
  PatchRegistry.forEach(entry => {
    Object.keys(entry).forEach(key => {
      if (key.startsWith('_')) return;
      entry._target[key] = entry[key];
    });
  });
  PatchRegistry.clear();
}

/**
 * Whether an easing type uses arguments.
 */
export const hasArgs = easing =>
  easing?.includes('Back') ||
  easing?.includes('Elastic') ||
  easing?.includes('Bounce') ||
  easing === 'step';

/**
 * Fallback Molang inverter for AzureLib standalone use.
 */
export function invertMolang(molang) {
  const OPEN = ['(', '[', '{'];
  const CLOSE = [')', ']', '}'];

  if (typeof molang === 'number') return -molang;
  if (molang === '' || molang === '0') return molang;

  if (!isNaN(parseFloat(molang)) && isFinite(molang)) {
    const val = parseFloat(molang);
    return (-val).toString();
  }

  let invert = true;
  let depth = 0;
  let lastOp;
  let result = '';

  for (let ch of molang) {
    if (!depth) {
      let op;
      let hadInput = true;

      if (ch === '-' && lastOp !== '*' && lastOp !== '/') {
        if (!invert && !lastOp) result += '+';
        invert = false;
        continue;
      } else if (ch === '+' && lastOp !== '*' && lastOp !== '/') {
        result += '-';
        invert = false;
        continue;
      } else if ('?:'.includes(ch)) {
        invert = true;
        op = ch;
      } else if (invert) {
        result += '-';
        invert = false;
      } else if ('+-*/&|'.includes(ch)) {
        op = ch;
      }

      lastOp = op || lastOp;
    }

    if (OPEN.includes(ch)) depth++;
    if (CLOSE.includes(ch)) depth--;

    result += ch;
  }

  return result;
}
