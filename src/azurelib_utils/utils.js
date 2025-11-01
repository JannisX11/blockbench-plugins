/**
 * This module is a fork of the GeckoLib Animation Utils plugin and modified for use in the Azurelib fork.
 * Original source:
 * https://github.com/JannisX11/blockbench-plugins/tree/034ed058efa5b2847fb852e3b215aad372080dcf/src/animation_utils 
 * Copyright © 2024 Bernie-G. Licensed under the MIT License.
 * https://github.com/JannisX11/blockbench-plugins/blob/main/LICENSE
 */

import { EASING_OPTIONS } from './easing';

export const hasArgs = (easing = "") =>
  easing.includes("Back") ||
  easing.includes("Elastic") ||
  easing.includes("Bounce") ||
  easing === EASING_OPTIONS.step;

export const Original = new Map();
export const addMonkeypatch = (symbol, path, functionKey, newFunction) => {
  const pathAccessor = path ? symbol[path] : symbol;
  if(!Original.get(symbol)) Original.set(symbol, { _pathAccessor: pathAccessor });
  Original.get(symbol)[functionKey] = pathAccessor[functionKey];
  pathAccessor[functionKey] = newFunction;
};

export const removeMonkeypatches = () => {
  Original.forEach(symbol => {
    Object.keys(symbol).forEach(functionKey => {
      if(functionKey.startsWith('_')) return;
      symbol._pathAccessor[functionKey] = symbol[functionKey];
    });
  });
  Original.clear();
}

// Fallback implementation of Blockbench's invertMolang
function invertMolang(molang) {
    const BRACKET_OPEN = ['(', '[', '{'];
    const BRACKET_CLOSE = [')', ']', '}'];

    if (typeof molang === 'number') {
        return -molang;
    }
    if (molang === '' || molang === '0') return molang;

    // handle numeric strings
    if (!isNaN(parseFloat(molang)) && isFinite(molang)) {
        let val = parseFloat(molang);
        return (-val).toString();
    }

    let invert = true;
    let bracket_depth = 0;
    let last_operator;
    let result = '';

    for (let char of molang) {
        if (!bracket_depth) {
            let operator;
            let had_input = true;

            if (char === '-' && last_operator !== '*' && last_operator !== '/') {
                if (!invert && !last_operator) result += '+';
                invert = false;
                continue;
            } else if (char === ' ' || char === '\n') {
                had_input = false;
            } else if (char === '+' && last_operator !== '*' && last_operator !== '/') {
                result += '-';
                invert = false;
                continue;
            } else if ('?:'.includes(char)) {
                invert = true;
                operator = char;
            } else if (invert) {
                result += '-';
                invert = false;
            } else if ('+-*/&|'.includes(char)) {
                operator = char;
            }

            if (had_input) {
                last_operator = operator;
            }
        }

        if (['(', '[', '{'].includes(char)) {
            bracket_depth++;
        } else if ([')', ']', '}'].includes(char)) {
            bracket_depth--;
        }

        result += char;
    }

    return result;
}

export { invertMolang };