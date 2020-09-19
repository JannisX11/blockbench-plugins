const makeOptions = arr => Object.fromEntries(arr.map(x => [x, x]));

export const MOD_SDK_1_15_FORGE = 'Forge 1.12 - 1.16';
export const MOD_SDK_1_15_FABRIC = 'Fabric 1.15 - 1.16';
export const MOD_SDKS = [MOD_SDK_1_15_FORGE, MOD_SDK_1_15_FABRIC];
export const MOD_SDK_OPTIONS = makeOptions(MOD_SDKS);

export const OBJ_TYPE_MISC = 'OBJ_TYPE_MISC';
export const OBJ_TYPE_ITEM = 'OBJ_TYPE_ITEM';
export const OBJ_TYPE_OPTIONS = {
  OBJ_TYPE_MISC: 'Entity/Armor',
  OBJ_TYPE_ITEM: 'Item Stack',
};

export const GECKO_SETTINGS_DEFAULT = {
  formatVersion: 2,
  modSDK: MOD_SDK_1_15_FORGE,
  objectType: OBJ_TYPE_MISC,
  entityType: 'Entity',
  javaPackage: 'com.example.mod',
  animFileNamespace: 'MODID',
  animFilePath: 'animations/ANIMATIONFILE.json',
};
Object.freeze(GECKO_SETTINGS_DEFAULT);

let geckoSettings = Object.assign({}, GECKO_SETTINGS_DEFAULT);

export function onSettingsChanged() {
  Format.display_mode = geckoSettings.objectType === OBJ_TYPE_ITEM;
  Modes.selected.select();
}

export default geckoSettings;