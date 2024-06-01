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