export const MOD_SDK_1_15_FORGE = 'Forge 1.12 - 1.16';
export const MOD_SDK_1_15_FABRIC = 'Fabric 1.15 - 1.16';
export const MOD_SDKS = [MOD_SDK_1_15_FORGE, MOD_SDK_1_15_FABRIC];
export const MOD_SDK_OPTIONS = Object.fromEntries(MOD_SDKS.map(x => [x, x]));

export const GECKO_SETTINGS_DEFAULT = {
  modSDK: MOD_SDK_1_15_FORGE,
  entityType: 'Entity',
  javaPackage: 'com.example.mod',
  animFileNamespace: 'MODID',
  animFilePath: 'animations/ANIMATIONFILE.json',
};
Object.freeze(GECKO_SETTINGS_DEFAULT);

let geckoSettings = Object.assign({}, GECKO_SETTINGS_DEFAULT);

export default geckoSettings;