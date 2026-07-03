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
  MODEL_TYPE_BLOCK_ENTITY
} = require('../model/presetTypes');
const {ModelDimensions} = require('../model/ModelDimensions');
const {VisibleBounds} = require('../model/VisibleBounds');

function settingsToForm(settings) {
  const offset = settings.rendering.visibleBoundsOffset || [0, 0, 0];

  return {
    namespace: settings.namespace,
    profileId: settings.profileId,
    targetVersion: settings.targetVersion,
    hostEntityType: settings.host.entityType,
    movementType: settings.host.movementType,
    bodyType: settings.host.bodyType,
    width: settings.dimensions.width,
    height: settings.dimensions.height,
    eyeHeight: settings.dimensions.eyeHeight,
    speed: settings.movement.speed,
    stepHeight: settings.movement.stepHeight,
    gravity: settings.movement.gravity,
    behaviorMode: settings.behavior.mode,
    maxHealth: settings.attributes.maxHealth,
    movementSpeed: settings.attributes.movementSpeed,
    followRange: settings.attributes.followRange,
    scale: settings.rendering.scale,
    shadowRadius: settings.rendering.shadowRadius,
    visibleBoundsWidth: settings.rendering.visibleBoundsWidth ?? 0,
    visibleBoundsHeight: settings.rendering.visibleBoundsHeight ?? 0,
    visibleBoundsOffsetX: offset[0],
    visibleBoundsOffsetY: offset[1],
    visibleBoundsOffsetZ: offset[2],
    animationMode: settings.animation.mode,
    swingSpeed: settings.animation.swingSpeed,
    walkSpeedMultiplier: settings.animation.walkSpeedMultiplier,
    idleStrength: settings.animation.idleStrength ?? 1,
    gait: settings.animation.gait || 'natural'
  };
}

function formToSettings(form, base) {
  return {
    schemaVersion: base.schemaVersion,
    modelType: base.modelType,
    presetType: base.presetType,
    namespace: String(form.namespace || '').trim(),
    profileId: String(form.profileId || '').trim(),
    targetVersion: base.targetVersion,
    host: {
      entityType: form.hostEntityType,
      movementType: form.movementType,
      bodyType: form.bodyType
    },
    dimensions: {
      width: Number(form.width),
      height: Number(form.height),
      eyeHeight: Number(form.eyeHeight)
    },
    movement: {
      speed: Number(form.speed),
      stepHeight: Number(form.stepHeight),
      gravity: !!form.gravity
    },
    behavior: {
      mode: form.behaviorMode,
      lookAtPlayers: base.behavior ? base.behavior.lookAtPlayers : true,
      randomStroll: base.behavior ? base.behavior.randomStroll : false
    },
    attributes: {
      maxHealth: Number(form.maxHealth),
      movementSpeed: Number(form.movementSpeed),
      followRange: Number(form.followRange)
    },
    rendering: {
      scale: Number(form.scale),
      shadowRadius: Number(form.shadowRadius),
      visibleBoundsWidth: Number(form.visibleBoundsWidth),
      visibleBoundsHeight: Number(form.visibleBoundsHeight),
      visibleBoundsOffset: [
        Number(form.visibleBoundsOffsetX),
        Number(form.visibleBoundsOffsetY),
        Number(form.visibleBoundsOffsetZ)
      ]
    },
    animation: {
      mode: form.animationMode,
      swingSpeed: Number(form.swingSpeed),
      walkSpeedMultiplier: Number(form.walkSpeedMultiplier),
      idleStrength: Number(form.idleStrength),
      gait: form.gait
    }
  };
}

function activeModelType(form) {
  return form.exportType === 'model_only'
      ? MODEL_TYPE_ENTITY : (form.modelType || MODEL_TYPE_ENTITY);
}

function activePreset(form) {
  return activeModelType(form) === MODEL_TYPE_BLOCK_ENTITY
      ? (form.blockPreset || 'static') : (form.preset || 'custom');
}

function presetFormValues(presetType, modelType, modelDimensions,
    visibleBounds) {
  const settings = ModelDimensions.applyModelDimensions(
      applyTemplate(presetType, modelType), modelDimensions);
  VisibleBounds.applyVisibleBounds(settings, visibleBounds);
  const form = settingsToForm(settings);
  delete form.namespace;
  delete form.profileId;
  delete form.targetVersion;

  return form;
}

function resolveExportSettings(form, base, modelDimensions, visibleBounds) {
  const exportType = form.exportType || 'packs';
  const modelType = activeModelType(form);
  const preset = activePreset(form);

  let settings;
  if (modelType !== MODEL_TYPE_BLOCK_ENTITY && preset === 'custom') {
    settings = deepMerge(getDefaults(), base);
  } else {
    settings = ModelDimensions.applyModelDimensions(
        applyTemplate(preset, modelType), modelDimensions);
    VisibleBounds.applyVisibleBounds(settings, visibleBounds);
  }

  settings.schemaVersion = base.schemaVersion || settings.schemaVersion;
  settings.modelType = modelType;
  settings.presetType = preset;
  settings.namespace = String(form.namespace || '').trim();
  settings.profileId = String(form.profileId || '').trim();
  settings.targetVersion = form.targetVersion;

  if (form.customize) {
    settings = formToSettings(form, settings);
  }
  settings.customize = !!form.customize;
  settings.exportType = exportType;
  settings.exportTarget = exportType === 'packs' ? 'packs' : 'mod_project';
  settings.modelOnly = exportType === 'model_only';

  return settings;
}

module.exports = {
  settingsToForm,
  formToSettings,
  activeModelType,
  activePreset,
  presetFormValues,
  resolveExportSettings
};
