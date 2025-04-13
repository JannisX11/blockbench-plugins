import {GECKOLIB_MODEL_ID, GeckoModelType, PROPERTY_MODEL_TYPE, SETTING_ALWAYS_SHOW_DISPLAY} from "./constants";

const VALID_NAMESPACE_PATTERN = new RegExp('^[_\\-.a-z0-9]+$')
const VALID_PATH_PATTERN = new RegExp('^[_\\-/.a-z0-9]+$')
export const Monkeypatches = new Map();

/**
 * Add what is effectively an override of another javascript function in a target object.
 * <p>
 * The patched function should call the original first and operate on the result to ensure compatibility
 * </p>
 *
 * @param symbol The target object
 * @param path The property of the target to access, or null to access the root target itself
 * @param functionKey The name of the function to replace
 * @param newFunction The function to patch in to replace the target
 */
export const addMonkeypatch = (symbol, path, functionKey, newFunction) => {
  const pathAccessor = path ? symbol[path] : symbol;

  if (!Monkeypatches.get(symbol))
    Monkeypatches.set(symbol, { _pathAccessor: pathAccessor });

  Monkeypatches.get(symbol)[functionKey] = pathAccessor[functionKey];
  pathAccessor[functionKey] = newFunction;
};

/**
 * Remove all previously added monkeypatches, reverting their operation to prior to the patch
 */
export const removeMonkeypatches = () => {
  Monkeypatches.forEach(symbol => {
    Object.keys(symbol).forEach(functionKey => {
      if (functionKey.startsWith('_'))
        return;

      symbol._pathAccessor[functionKey] = symbol[functionKey];
    });
  });
  Monkeypatches.clear();
}

/**
 * Wrap a callback object with a conditional check on the project being a GeckoLib project, for safety
 */
export const onlyIfGeckoLib = (callback: (data: object) => void) => {
  return e => {
    if (isGeckoLibModel())
      callback(e)
  }
}

/**
 * Add an event listener to Blockbench's event callback system.
 * <p>
 * This should be done in <code>codec.ts#loadCodec</code> or in the plugin creation in <code>index.ts</code>
 */
export const addEventListener = (eventName: EventName, callback: (data: object) => void) => {
  Blockbench.on(eventName, callback)
}

/**
 * Remove a previously registered event listener from Blockbench's event callback system.
 * <p>
 * All registered event listeners should be removed when the plugin or codec is unloaded
 */
export const removeEventListener = (eventName: EventName, callback: (data: object) => void) => {
  Blockbench.removeListener(eventName, callback)
}

/**
 * Add a callback to a codec to be called after the task has been completed
 * <p>
 * This should be done in <code>codec.ts#loadCodec</code> or in the plugin creation in <code>index.ts</code>
 */
export const addCodecCallback = (codec: Codec, taskName: string, callback: (data: object) => void) => {
  codec.on(taskName, callback);
}

/**
 * Helper function that allows instantiation of an object and simultaneous property-modification without needing a local variable
 */
export function make<T>(obj: T, consumer: (obj2: T) => void): T {
  consumer(obj);

  return obj;
}

/**
 * Remove a previously added codec task completion callback
 * <p>
 * All registered coded callbacks should be removed when the plugin or codec is unloaded
 */
export const removeCodecCallback = (codec: Codec, taskName: string, callback: (data: object) => void) => {
  codec.removeListener(taskName, callback);
}

/**
 * Whether a given string is a valid ResourceLocation path for Minecraft
 */
export const isValidPath = (path: string) => {
  return VALID_PATH_PATTERN.test(path)
}

/**
 * Whether a given string is a valid ResourceLocation namespace for Minecraft
 */
export const isValidNamespace = (namespace: string) => {
  return VALID_NAMESPACE_PATTERN.test(namespace)
}

/**
 * Whether a map-like object has no defined keys or values
 */
export const isEmpty = (object = {}) => Object.keys(object).length === 0;

/**
 * Whether the currently focussed model is a GeckoLib model
 */
export const isGeckoLibModel = () => Format.id === GECKOLIB_MODEL_ID;

/**
 * Whether the current project is a GeckoLib model that has or uses item render perspective transforms
 */
export const hasModelDisplaySettings = () => isGeckoLibModel() && Project && ((Project[PROPERTY_MODEL_TYPE] === GeckoModelType.ITEM || !isEmpty(Project.display_settings)) || settings[SETTING_ALWAYS_SHOW_DISPLAY].value);