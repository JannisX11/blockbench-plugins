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