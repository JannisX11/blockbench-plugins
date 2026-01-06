/**
 * AzureLib Animator — Settings & Templates
 * ----------------------------------------
 * Defines runtime configuration, SDK targets, and automatic
 * template loading for armor models.
 *
 * © 2025 AzureDoom — MIT License
 */

import armorTemplate from '../templates/armorTemplate.json';

const makeOptions = list => Object.fromEntries(list.map(x => [x, x]));

export const SDK_FORGE = 'Forge 1.12 - 1.16';
export const SDK_FABRIC = 'Fabric 1.15 - 1.16';
export const SDK_OPTIONS = makeOptions([SDK_FORGE, SDK_FABRIC]);

export const TYPE_ENTITY = 'AZURE_ENTITY';
export const TYPE_ARMOR = 'AZURE_ARMOR';
export const TYPE_ITEMBLOCK = 'AZURE_ITEM_BLOCK';

export const TYPE_OPTIONS = {
  [TYPE_ENTITY]: 'Entity/Block/Item',
  [TYPE_ARMOR]: 'Armor',
};

export const DEFAULT_CONFIG = Object.freeze({
  formatVersion: 2,
  modSDK: SDK_FORGE,
  objectType: TYPE_ENTITY,
  entityType: 'Entity/Block/Item',
  javaPackage: 'com.example.mod',
  animFileNamespace: 'modid',
  animFilePath: 'animations/animation.json',
});

export const AzureConfig = Object.assign({}, DEFAULT_CONFIG);

/**
 * Applies configuration and injects armor templates when applicable.
 */
export function onSettingsChanged() {
  Modes.selected.select();

  if (AzureConfig.objectType === TYPE_ARMOR) {
    if (Outliner.root.length === 0) {
      Codecs.project.parse(armorTemplate);
      console.log('[AzureLib] Loaded armor template.');
    } else {
      alert(
        'Cannot apply Armor Template — please select Armor type in an empty project.'
      );
    }
  } else if (AzureConfig.objectType === TYPE_ENTITY) {
    Project.parent = 'builtin/entity';
  }
}

export default AzureConfig;
