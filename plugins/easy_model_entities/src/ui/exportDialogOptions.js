/*
 * Copyright 2026 Markus Bordihn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const {getVersions} = require('../model/versionMatrix');
const {
  SELECTABLE_PRESET_TYPES,
  BLOCK_ENTITY_PRESET_TYPES,
  MOVEMENT_TYPES,
  BODY_TYPES,
  GAIT_TYPES,
  BEHAVIOR_MODES,
  ANIMATION_MODES,
  ANIMATION_VARIANT_MODES,
  HOST_ENTITY_TYPES,
  MODEL_TYPES,
  isStablePreset,
  MODEL_TYPE_BLOCK_ENTITY
} = require('../model/presetTypes');
const {
  EXPORT_TYPE_PACKS,
  EXPORT_TYPE_RESOURCE_PACK,
  EXPORT_TYPE_DATA_PACK,
  EXPORT_TYPE_MOD_PROJECT,
  EXPORT_TYPE_MODEL_ONLY
} = require('../model/exportTypes');
const {t} = require('../i18n/translations');

function optionsFromEnum(values, prefix) {
  const options = {};
  values.forEach((id) => {
    options[id] = t(`${prefix}.${id.split(':').pop()}`);
  });

  return options;
}

function presetOptions(modelType, experimental, ensure) {
  const presetIds = modelType === MODEL_TYPE_BLOCK_ENTITY
      ? BLOCK_ENTITY_PRESET_TYPES : ['custom', ...SELECTABLE_PRESET_TYPES];
  const ids = presetIds.filter(
      (presetId) => experimental || isStablePreset(presetId));
  if (ensure && !ids.includes(ensure)) {
    ids.push(ensure);
  }

  return optionsFromEnum(ids, 'eme.preset');
}

function modelTypeOptions() {
  return optionsFromEnum(MODEL_TYPES, 'eme.modelType');
}

function exportTypeOptions() {
  return optionsFromEnum([EXPORT_TYPE_PACKS, EXPORT_TYPE_RESOURCE_PACK,
        EXPORT_TYPE_DATA_PACK, EXPORT_TYPE_MOD_PROJECT, EXPORT_TYPE_MODEL_ONLY],
      'eme.exportType');
}

function hostEntityTypeOptions() {
  return optionsFromEnum(HOST_ENTITY_TYPES, 'eme.entity');
}

function movementTypeOptions() {
  return optionsFromEnum(MOVEMENT_TYPES, 'eme.movement');
}

function bodyTypeOptions() {
  return optionsFromEnum(BODY_TYPES, 'eme.body');
}

function gaitOptions() {
  return optionsFromEnum(GAIT_TYPES, 'eme.gait');
}

function behaviorModeOptions() {
  return optionsFromEnum(BEHAVIOR_MODES, 'eme.behavior');
}

function animationModeOptions() {
  return optionsFromEnum(ANIMATION_MODES, 'eme.animation');
}

function variantModeOptions() {
  return optionsFromEnum(ANIMATION_VARIANT_MODES, 'eme.variant');
}

function versionOptions() {
  const options = {};
  getVersions().forEach((version) => {
    options[version.id] = version.enabled ? version.label
        : `${version.label} (coming soon)`;
  });

  return options;
}

module.exports = {
  presetOptions,
  modelTypeOptions,
  exportTypeOptions,
  hostEntityTypeOptions,
  movementTypeOptions,
  bodyTypeOptions,
  gaitOptions,
  behaviorModeOptions,
  animationModeOptions,
  variantModeOptions,
  versionOptions
};
