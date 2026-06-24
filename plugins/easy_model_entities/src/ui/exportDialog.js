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
const {t} = require('../i18n/translations');
const {
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
} = require('./exportDialogOptions');

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
  // Remembered so a customized project reopens with its values (and target).
  settings.customize = !!form.customize;
  settings.exportType = exportType;
  settings.exportTarget = exportType === 'packs' ? 'packs' : 'mod_project';
  settings.modelOnly = exportType === 'model_only';

  return settings;
}

function advancedField(field, showCustomize) {
  return Object.assign({condition: showCustomize}, field);
}

function buildFormConfig(settings, ui) {
  const values = settingsToForm(settings);
  const state = ui || {};
  const allowCustomize = !!state.showCustomization;

  const standalone = (form) => form.exportType !== 'model_only';
  const blockEntitySelected = (form) =>
      standalone(form) && form.modelType === MODEL_TYPE_BLOCK_ENTITY;
  const customizeOn = (form) => allowCustomize && !!form.customize;
  // Server-profile advanced fields only make sense for a standalone datapack.
  const showServer = (form) => customizeOn(form) && standalone(form);
  // Host/movement/behavior/attributes only apply to standalone entities.
  const showEntity = (form) => showServer(form) && !blockEntitySelected(form);
  // Render-profile advanced fields apply to every export kind.
  const showRender = customizeOn;

  const experimental = !!state.experimental;
  const entityValue = state.preset || 'statue';
  const blockValue = state.blockPreset || 'static';

  const config = {
    exportType: {
      label: t('eme.field.exportType'),
      type: 'select',
      options: exportTypeOptions(),
      value: state.exportType || 'packs'
    },
    modelType: {
      label: t('eme.field.modelType'),
      type: 'select',
      options: modelTypeOptions(),
      value: state.modelType || MODEL_TYPE_ENTITY,
      condition: standalone
    },
    preset: {
      label: t('eme.field.preset'),
      type: 'select',
      options: presetOptions(MODEL_TYPE_ENTITY, experimental, entityValue),
      value: entityValue,
      condition: (form) => !blockEntitySelected(form)
    },
    blockPreset: {
      label: t('eme.field.preset'),
      type: 'select',
      options: presetOptions(MODEL_TYPE_BLOCK_ENTITY, experimental, blockValue),
      value: blockValue,
      condition: blockEntitySelected
    },
    namespace: {
      label: t('eme.field.namespace'),
      type: 'text',
      value: values.namespace,
      placeholder: 'your_mod_id'
    },
    profileId: {
      label: t('eme.field.profileId'), type: 'text',
      value: values.profileId
    },
    targetVersion: {
      label: t('eme.field.targetVersion'),
      type: 'select',
      options: versionOptions(),
      value: values.targetVersion
    }
  };

  if (allowCustomize) {
    config.customize = {
      label: t('eme.field.customize'),
      type: 'checkbox',
      value: !!state.customize
    };
  }

  Object.assign(config, {
    host_header: advancedField(
        {type: 'info', text: `### ${t('eme.section.host')}`}, showEntity),
    hostEntityType: advancedField({
      label: t('eme.field.hostEntityType'),
      type: 'select',
      options: hostEntityTypeOptions(),
      value: values.hostEntityType
    }, showEntity),
    movementType: advancedField({
      label: t('eme.field.movementType'),
      type: 'select',
      options: movementTypeOptions(),
      value: values.movementType
    }, showEntity),
    bodyType: advancedField({
      label: t('eme.field.bodyType'),
      type: 'select',
      options: bodyTypeOptions(),
      value: values.bodyType
    }, showEntity),

    dimensions_header: advancedField(
        {type: 'info', text: `### ${t('eme.section.dimensions')}`},
        showServer),
    width: advancedField(
        {
          label: t('eme.field.width'), type: 'number', value: values.width,
          step: 0.1
        }, showServer),
    height: advancedField(
        {
          label: t('eme.field.height'), type: 'number', value: values.height,
          step: 0.1
        }, showServer),
    eyeHeight: advancedField(
        {
          label: t('eme.field.eyeHeight'), type: 'number',
          value: values.eyeHeight, step: 0.1
        }, showServer),

    movement_header: advancedField(
        {type: 'info', text: `### ${t('eme.section.movement')}`}, showEntity),
    speed: advancedField(
        {
          label: t('eme.field.speed'), type: 'number', value: values.speed,
          step: 0.01
        }, showEntity),
    stepHeight: advancedField(
        {
          label: t('eme.field.stepHeight'), type: 'number',
          value: values.stepHeight, step: 0.1
        }, showEntity),
    gravity: advancedField(
        {
          label: t('eme.field.gravity'), type: 'checkbox',
          value: values.gravity
        }, showEntity),

    behavior_header: advancedField(
        {type: 'info', text: `### ${t('eme.section.behavior')}`}, showEntity),
    behaviorMode: advancedField({
      label: t('eme.field.behaviorMode'),
      type: 'select',
      options: behaviorModeOptions(),
      value: values.behaviorMode
    }, showEntity),

    attributes_header: advancedField(
        {type: 'info', text: `### ${t('eme.section.attributes')}`},
        showEntity),
    maxHealth: advancedField(
        {
          label: t('eme.field.maxHealth'), type: 'number',
          value: values.maxHealth, step: 0.5
        }, showEntity),
    movementSpeed: advancedField(
        {
          label: t('eme.field.movementSpeed'), type: 'number',
          value: values.movementSpeed, step: 0.01
        }, showEntity),
    followRange: advancedField(
        {
          label: t('eme.field.followRange'), type: 'number',
          value: values.followRange, step: 1
        }, showEntity),

    rendering_header: advancedField(
        {type: 'info', text: `### ${t('eme.section.rendering')}`},
        showRender),
    scale: advancedField(
        {
          label: t('eme.field.scale'), type: 'number', value: values.scale,
          step: 0.1
        }, showRender),
    shadowRadius: advancedField(
        {
          label: t('eme.field.shadowRadius'), type: 'number',
          value: values.shadowRadius, step: 0.1
        }, showRender),
    visibleBoundsWidth: advancedField(
        {
          label: t('eme.field.visibleBoundsWidth'), type: 'number',
          value: values.visibleBoundsWidth, step: 0.1
        }, showRender),
    visibleBoundsHeight: advancedField(
        {
          label: t('eme.field.visibleBoundsHeight'), type: 'number',
          value: values.visibleBoundsHeight, step: 0.1
        }, showRender),
    visibleBoundsOffsetX: advancedField(
        {
          label: t('eme.field.visibleBoundsOffsetX'), type: 'number',
          value: values.visibleBoundsOffsetX, step: 0.1
        }, showRender),
    visibleBoundsOffsetY: advancedField(
        {
          label: t('eme.field.visibleBoundsOffsetY'), type: 'number',
          value: values.visibleBoundsOffsetY, step: 0.1
        }, showRender),
    visibleBoundsOffsetZ: advancedField(
        {
          label: t('eme.field.visibleBoundsOffsetZ'), type: 'number',
          value: values.visibleBoundsOffsetZ, step: 0.1
        }, showRender),

    animation_header: advancedField(
        {type: 'info', text: `### ${t('eme.section.animation')}`},
        showRender),
    animationMode: advancedField({
      label: t('eme.field.animationMode'),
      type: 'select',
      options: animationModeOptions(),
      value: values.animationMode
    }, showRender),
    swingSpeed: advancedField(
        {
          label: t('eme.field.swingSpeed'), type: 'number',
          value: values.swingSpeed, step: 0.1
        }, showRender),
    walkSpeedMultiplier: advancedField(
        {
          label: t('eme.field.walkSpeedMultiplier'), type: 'number',
          value: values.walkSpeedMultiplier, step: 0.1
        }, showRender),
    idleStrength: advancedField(
        {
          label: t('eme.field.idleStrength'), type: 'number',
          value: values.idleStrength, step: 0.1
        }, showRender),
    gait: advancedField({
      label: t('eme.field.gait'),
      type: 'select',
      options: gaitOptions(),
      value: values.gait
    }, showRender)
  });

  return config;
}

function openExportDialog(options) {
  const settings = options.settings;
  const modelDimensions = options.modelDimensions;
  const visibleBounds = options.visibleBounds;
  let lastKey = `${activeModelType(options)}|${activePreset(options)}`;

  const dialog = new Dialog({
    id: 'eme_export_dialog',
    title: t('eme.dialog.title'),
    width: 560,
    form: buildFormConfig(settings, {
      preset: options.preset,
      blockPreset: options.blockPreset,
      modelType: options.modelType,
      exportType: options.exportType,
      customize: options.customize,
      showCustomization: options.showCustomization,
      experimental: options.experimental
    }),
    onFormChange(form) {
      const modelType = activeModelType(form);
      const preset = activePreset(form);
      const key = `${modelType}|${preset}`;
      if (key !== lastKey) {
        lastKey = key;
        if (modelType !== MODEL_TYPE_ENTITY || preset !== 'custom') {
          dialog.setFormValues(
              presetFormValues(preset, modelType, modelDimensions,
                  visibleBounds), false);
        }
      }
    },
    onConfirm(form) {
      const finalSettings = resolveExportSettings(form, settings,
          modelDimensions, visibleBounds);
      // Records that experimental presets were available for this export.
      finalSettings.experimental = !!options.experimental;
      options.onExport(finalSettings, finalSettings.exportTarget);
    }
  });
  dialog.show();

  return dialog;
}

module.exports = {
  presetOptions,
  settingsToForm,
  formToSettings,
  presetFormValues,
  resolveExportSettings,
  openExportDialog
};
