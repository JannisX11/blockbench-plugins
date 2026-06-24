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
  isStablePreset,
  MODEL_TYPE_ENTITY,
  MODEL_TYPE_BLOCK_ENTITY
} = require('../model/presetTypes');
const {t} = require('../i18n/translations');

function presetLabel(id) {
  return id === 'custom' ? t('eme.preset.custom') : t(`eme.preset.${id}`);
}

function entityPresetIds(experimental) {
  return experimental
      ? ['custom', ...SELECTABLE_PRESET_TYPES]
      : SELECTABLE_PRESET_TYPES.filter(isStablePreset);
}

function blockPresetIds(experimental) {
  return experimental
      ? BLOCK_ENTITY_PRESET_TYPES.slice()
      : BLOCK_ENTITY_PRESET_TYPES.filter(isStablePreset);
}

// Experimental (WIP) presets are hidden unless the experimental setting is on.
function presetOptions(modelType, experimental, ensure) {
  const ids = modelType === MODEL_TYPE_BLOCK_ENTITY
      ? blockPresetIds(experimental) : entityPresetIds(experimental);
  if (ensure && !ids.includes(ensure)) {
    ids.push(ensure);
  }
  const options = {};
  ids.forEach((id) => {
    options[id] = presetLabel(id);
  });

  return options;
}

function modelTypeOptions() {
  return {
    [MODEL_TYPE_ENTITY]: t('eme.modelType.entity'),
    [MODEL_TYPE_BLOCK_ENTITY]: t('eme.modelType.block_entity')
  };
}

function exportTypeOptions() {
  return {
    packs: t('eme.exportType.packs'),
    mod_project: t('eme.exportType.mod_project'),
    model_only: t('eme.exportType.model_only')
  };
}

function hostEntityTypeOptions() {
  return {
    'easy_model_entities:ground_entity': t('eme.entity.ground_entity'),
    'easy_model_entities:static_entity': t('eme.entity.static_entity'),
    'easy_model_entities:aquatic_entity': t('eme.entity.aquatic_entity'),
    'easy_model_entities:amphibious_entity': t('eme.entity.amphibious_entity')
  };
}

function movementTypeOptions() {
  return {
    ground: t('eme.movement.ground'),
    water: t('eme.movement.water'),
    amphibious: t('eme.movement.amphibious'),
    static: t('eme.movement.static')
  };
}

function bodyTypeOptions() {
  return {
    static: t('eme.body.static'),
    biped: t('eme.body.biped'),
    quadruped: t('eme.body.quadruped'),
    aquatic: t('eme.body.aquatic'),
    amphibious: t('eme.body.amphibious'),
    winged: t('eme.body.winged'),
    winged_humanoid: t('eme.body.winged_humanoid'),
    arthropod: t('eme.body.arthropod'),
    cuboid: t('eme.body.cuboid'),
    floating: t('eme.body.floating')
  };
}

function gaitOptions() {
  return {
    natural: t('eme.gait.natural'),
    feline: t('eme.gait.feline'),
    ungulate: t('eme.gait.ungulate')
  };
}

function behaviorModeOptions() {
  return {
    idle_only: t('eme.behavior.idle_only'),
    ambient: t('eme.behavior.ambient'),
    static: t('eme.behavior.static'),
    external_owner: t('eme.behavior.external_owner')
  };
}

function animationModeOptions() {
  return {
    automatic: t('eme.animation.automatic'),
    random_idle: t('eme.animation.random_idle'),
    none: t('eme.animation.none')
  };
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
  versionOptions
};
