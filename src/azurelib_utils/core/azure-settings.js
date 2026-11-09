/**
 * AzureLib Animator — Settings & Templates
 * ----------------------------------------
 * Defines runtime configuration, SDK targets, and automatic
 * template loading for armor models.
 *
 * © 2026 AzureDoom — MIT License
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

let _ghostModel = null;

function removeGhostPlayer() {
  if (_ghostModel) {
    scene.remove(_ghostModel);
    _ghostModel = null;
  }
}

function injectGhostPlayer() {
  removeGhostPlayer();

  // Use Blockbench's own display reference player model directly.
  // It's already built, skinned, and kept up to date by updateDisplaySkin().
  // We just clone its THREE.Object3D and add it to the edit mode scene.
  const refPlayer = displayReferenceObjects?.refmodels?.player;
  if (!refPlayer) {
    console.warn('[AzureLib] displayReferenceObjects.refmodels.player not available');
    return;
  }

  // Ensure the model is initialised (it lazy-builds on first Display tab visit)
  if (!refPlayer.initialized) {
    for (const model of refPlayer.models) {
      refPlayer.buildModel(model);
    }
    refPlayer.setModelVariant('steve');
    updateDisplaySkin?.();
    refPlayer.initialized = true;
  }

  // Clone so we don't disturb the Display tab's own copy
  _ghostModel = refPlayer.model.clone();

  _ghostModel.children.forEach(mesh => {
    mesh.rotation.set(0, 0, 0);
  });

  scene.add(_ghostModel);
  console.log('[AzureLib] Ghost player injected using display refmodel.');
}

/**
 * Applies configuration and injects armor templates when applicable.
 */
export function onSettingsChanged() {
  Modes.selected.select();

  if (AzureConfig.objectType === TYPE_ARMOR) {
    if (Outliner.root.length === 0) {
      Codecs.project.parse(armorTemplate);
      console.log('[AzureLib] Loaded armor template.');

      injectGhostPlayer();
      Blockbench.once('close_project', removeGhostPlayer);
      Blockbench.once('new_project', removeGhostPlayer);
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