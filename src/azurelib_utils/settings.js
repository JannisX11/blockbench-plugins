/**
 * This module is a fork of the GeckoLib Animation Utils plugin and modified for use in the Azurelib fork.
 * Original source:
 * https://github.com/JannisX11/blockbench-plugins/tree/034ed058efa5b2847fb852e3b215aad372080dcf/src/animation_utils 
 * Copyright © 2024 Bernie-G. Licensed under the MIT License.
 * https://github.com/JannisX11/blockbench-plugins/blob/main/LICENSE
 */

import armorTemplate from './armorTemplate.json';

const makeOptions = arr => Object.fromEntries(arr.map(x => [x, x]));

export const MOD_SDK_1_15_FORGE = 'Forge 1.12 - 1.16';
export const MOD_SDK_1_15_FABRIC = 'Fabric 1.15 - 1.16';
export const MOD_SDKS = [MOD_SDK_1_15_FORGE, MOD_SDK_1_15_FABRIC];
export const MOD_SDK_OPTIONS = makeOptions(MOD_SDKS);

export const AZURE_ENTITY = 'AZURE_ENTITY';
export const AZURE_ARMOR = 'AZURE_ARMOR';
export const AZURE_ITEM_BLOCK = 'AZURE_ITEM_BLOCK';
export const OBJ_TYPE_OPTIONS = {
  [AZURE_ENTITY]: 'Entity/Block/Item',
  [AZURE_ARMOR]: 'Armor'
};

export const AZURELIB_SETTINGS_DEFAULT = {
  formatVersion: 2,
  modSDK: MOD_SDK_1_15_FORGE,
  objectType: AZURE_ENTITY,
  entityType: 'Entity/Block/Item',
  javaPackage: 'com.example.mod',
  animFileNamespace: 'MODID',
  animFilePath: 'animations/ANIMATIONFILE.json',
};
Object.freeze(AZURELIB_SETTINGS_DEFAULT);

let azurelibSettings = Object.assign({}, AZURELIB_SETTINGS_DEFAULT);

export function onSettingsChanged() {
  Modes.selected.select();
  switch(azurelibSettings.objectType) {
    case AZURE_ARMOR: {
      if(Outliner.root.length === 0) {
        Codecs.project.parse(armorTemplate);
      } else {
        alert('Unable to load Armor Template as this would overwrite the current model. Please select Armor type on an empty project if you want to use the Armor Template.');
      }
      break;
    } case AZURE_ENTITY: {
      Project.parent = 'builtin/entity';
      break;
    }
  }
}

export default azurelibSettings;