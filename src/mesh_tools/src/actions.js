import _ACTIONS from '../assets/actions.json';
import { PLUGIN_ID } from './globals.js';
export const ACTIONS = _ACTIONS;

const CONDITIONS = {
  MESH: {
    modes: ["edit"],
    features: ["meshes"],
  },
  OBJECT_MODE: {
    modes: ["edit"],
    features: ["meshes"],
    method: () =>
      Mesh.selected.length && BarItems["selection_mode"].value == "object",
  },
  NON_OBJECT_MODE: {
    modes: ["edit"],
    features: ["meshes"],
    method: () =>
      Mesh.selected.length && BarItems["selection_mode"].value != "object",
  },
}


export const qualifyName = (id) => (id == "_" ? id : `@${PLUGIN_ID}/${id}`);

/**
 *
 * @param {keyof ACTIONS} id
 * @param {?Function} click
 * @returns {Action}
 */
export function action(id, click) {
  console.assert(id in ACTIONS, id);

  const options = Object.assign({ click }, ACTIONS[id]);
  options.plugin = PLUGIN_ID;

  if (options.children) {
    // TODO qualify with parents
    options.children = options.children.map(qualifyName);
  }
  if (typeof options.condition == 'string') {
    options.condition = CONDITIONS[options.condition];
  }
  if (options.selection_mode) {
    const oldCondition = options.condition;
    options.condition = () =>
      Mesh.selected.length &&
      (options.selection_mode instanceof Array
        ? options.selection_mode.includes(BarItems["selection_mode"].value)
        : BarItems["selection_mode"].value == options.selection_mode) &&
      Condition(oldCondition);
  }
  if (options.keybind) {
    options.keybind = new Keybind(options.keybind);
  }
  return new Action(qualifyName(id), options);
}
