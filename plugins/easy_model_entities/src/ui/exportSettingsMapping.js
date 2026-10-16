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

const {getDefaults, applyTemplate, deepMerge} = require('../model/templates');
const {
  MODEL_TYPE_ENTITY,
  MODEL_TYPE_BLOCK_ENTITY,
  behaviorForMode,
  isCustomEntity
} = require('../model/presetTypes');
const {
  EXPORT_TYPE_PACKS,
  EXPORT_TYPE_MODEL_ONLY
} = require('../model/exportTypes');
const {ModelDimensions} = require('../model/ModelDimensions');
const {VisibleBounds} = require('../model/VisibleBounds');

const keepValue = (value) => value;

const FORM_FIELDS = [
  ['hostEntityType', 'host.entityType', keepValue],
  ['movementType', 'host.movementType', keepValue],
  ['bodyType', 'host.bodyType', keepValue],
  ['width', 'dimensions.width', Number],
  ['height', 'dimensions.height', Number],
  ['eyeHeight', 'dimensions.eyeHeight', Number],
  ['speed', 'movement.speed', Number],
  ['stepHeight', 'movement.stepHeight', Number],
  ['gravity', 'movement.gravity', Boolean],
  ['behaviorMode', 'behavior.mode', keepValue],
  ['maxHealth', 'attributes.maxHealth', Number],
  ['movementSpeed', 'attributes.movementSpeed', Number],
  ['followRange', 'attributes.followRange', Number],
  ['scale', 'rendering.scale', Number],
  ['shadowRadius', 'rendering.shadowRadius', Number],
  ['visibleBoundsWidth', 'rendering.visibleBoundsWidth', Number],
  ['visibleBoundsHeight', 'rendering.visibleBoundsHeight', Number],
  ['opacity', 'rendering.opacity', Number],
  ['animationMode', 'animation.mode', keepValue],
  ['swingSpeed', 'animation.swingSpeed', Number],
  ['walkSpeedMultiplier', 'animation.walkSpeedMultiplier', Number],
  ['idleStrength', 'animation.idleStrength', Number],
  ['gait', 'animation.gait', keepValue],
  ['variantMode', 'animation.variantMode', keepValue],
  ['shoulderScale', 'shoulder.scale', Number]
];

const VECTOR_FIELDS = [
  ['rendering.visibleBoundsOffset',
    ['visibleBoundsOffsetX', 'visibleBoundsOffsetY', 'visibleBoundsOffsetZ']],
  ['shoulder.offset',
    ['shoulderOffsetX', 'shoulderOffsetY', 'shoulderOffsetZ']]
];

function variantWeightKey(index) {
  return `variantWeight${index}`;
}

function settingsToForm(settings, variantClips) {
  const form = {
    namespace: settings.namespace,
    profileId: settings.profileId,
    targetVersion: settings.targetVersion
  };
  for (const [key, path] of FORM_FIELDS) {
    const [section, field] = path.split('.');
    form[key] = settings[section][field];
  }
  for (const [path, keys] of VECTOR_FIELDS) {
    const [section, field] = path.split('.');
    keys.forEach((key, axis) => {
      form[key] = settings[section][field][axis];
    });
  }
  (variantClips || []).forEach((clipName, index) => {
    form[variantWeightKey(index)] =
        settings.animation.variantWeights[clipName] ?? 1;
  });

  return form;
}

function formToSettings(form, base, variantClips) {
  const settings = {
    modelType: base.modelType,
    presetType: base.presetType,
    namespace: String(form.namespace || '').trim(),
    profileId: String(form.profileId || '').trim(),
    targetVersion: base.targetVersion,
    host: {},
    dimensions: {},
    movement: {},
    behavior: {},
    attributes: {},
    rendering: {},
    animation: {},
    shoulder: {}
  };
  for (const [key, path, convert] of FORM_FIELDS) {
    const [section, field] = path.split('.');
    settings[section][field] = convert(form[key]);
  }
  for (const [path, keys] of VECTOR_FIELDS) {
    const [section, field] = path.split('.');
    settings[section][field] = keys.map((key) => Number(form[key]));
  }
  settings.behavior = behaviorForMode(settings.behavior.mode,
      settings.host.movementType);
  settings.animation.variantWeights = Object.fromEntries(
      (variantClips || []).map((clipName, index) =>
          [clipName, Number(form[variantWeightKey(index)])]));

  return settings;
}

function activeModelType(form) {
  return form.exportType === EXPORT_TYPE_MODEL_ONLY
      ? MODEL_TYPE_ENTITY : (form.modelType || MODEL_TYPE_ENTITY);
}

function activePreset(form) {
  return activeModelType(form) === MODEL_TYPE_BLOCK_ENTITY
      ? (form.blockPreset || 'static') : (form.preset || 'custom');
}

function presetKey(form) {
  return `${activeModelType(form)}|${activePreset(form)}`;
}

function presetSettings(presetType, modelType, modelDimensions,
    visibleBounds) {
  const settings = ModelDimensions.applyModelDimensions(
      applyTemplate(presetType, modelType), modelDimensions);
  VisibleBounds.applyVisibleBounds(settings, visibleBounds);

  return settings;
}

function presetFormValues(presetType, modelType, modelDimensions,
    visibleBounds) {
  const form = settingsToForm(presetSettings(presetType, modelType,
      modelDimensions, visibleBounds));
  delete form.namespace;
  delete form.profileId;
  delete form.targetVersion;

  return form;
}

function resolveExportSettings(form, base, modelDimensions, visibleBounds,
    variantClips) {
  const modelType = activeModelType(form);
  const preset = activePreset(form);

  let settings = isCustomEntity(modelType, preset)
      ? deepMerge(getDefaults(), base)
      : presetSettings(preset, modelType, modelDimensions, visibleBounds);

  settings.modelType = modelType;
  settings.presetType = preset;
  settings.namespace = String(form.namespace || '').trim();
  settings.profileId = String(form.profileId || '').trim();
  settings.targetVersion = form.targetVersion;

  if (form.customize) {
    settings = formToSettings(form, settings, variantClips);
  }
  settings.customize = !!form.customize;
  settings.includeExternalTextures = form.includeExternalTextures !== false;
  settings.lastExportedVersion = base.lastExportedVersion;
  settings.lastExportedTargetVersion = base.lastExportedTargetVersion;
  settings.exportType = form.exportType || EXPORT_TYPE_PACKS;

  return settings;
}

module.exports = {
  variantWeightKey,
  settingsToForm,
  formToSettings,
  activeModelType,
  activePreset,
  presetKey,
  presetFormValues,
  resolveExportSettings
};
