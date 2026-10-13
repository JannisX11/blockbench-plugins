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

const {
  MODEL_TYPE_ENTITY,
  MODEL_TYPE_BLOCK_ENTITY
} = require('../model/presetTypes');
const {EXPORT_TYPE_DATA_PACK} = require('../model/exportTypes');
const {Validator} = require('../model/Validator');
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
  variantModeOptions,
  versionOptions
} = require('./exportDialogOptions');
const {
  settingsToForm,
  variantWeightKey,
  activeModelType,
  activePreset,
  presetFormValues,
  resolveExportSettings
} = require('./exportSettingsMapping');

function selectField(options) {
  return {type: 'select', options: options};
}

function numberField(step, min, max) {
  return Object.fromEntries(
      Object.entries({type: 'number', step: step, min: min, max: max})
      .filter(([, value]) => value !== undefined));
}

function advancedSections(limits, variantClips) {
  return [
    {
      name: 'host', visibility: 'entity', fields: {
        hostEntityType: selectField(hostEntityTypeOptions()),
        movementType: selectField(movementTypeOptions()),
        bodyType: selectField(bodyTypeOptions())
      }
    },
    {
      name: 'dimensions', visibility: 'server', fields: {
        width: numberField(0.1, limits.minDimension, limits.maxDimension),
        height: numberField(0.1, limits.minDimension, limits.maxDimension),
        eyeHeight: numberField(0.1, 0, limits.maxDimension)
      }
    },
    {
      name: 'movement', visibility: 'entity', fields: {
        speed: numberField(0.01, 0, limits.maxMovementSpeed),
        stepHeight: numberField(0.1, 0, limits.maxStepHeight),
        gravity: {type: 'checkbox'}
      }
    },
    {
      name: 'behavior', visibility: 'entity', fields: {
        behaviorMode: selectField(behaviorModeOptions())
      }
    },
    {
      name: 'attributes', visibility: 'entity', fields: {
        maxHealth: numberField(0.5, 0),
        movementSpeed: numberField(0.01, 0),
        followRange: numberField(1, 0)
      }
    },
    {
      name: 'rendering', visibility: 'render', fields: {
        scale: numberField(0.1, limits.minDimension),
        shadowRadius: numberField(0.1, 0),
        visibleBoundsWidth: numberField(0.1, 0),
        visibleBoundsHeight: numberField(0.1, 0),
        visibleBoundsOffsetX: numberField(0.1),
        visibleBoundsOffsetY: numberField(0.1),
        visibleBoundsOffsetZ: numberField(0.1),
        opacity: numberField(0.05, 0, 1)
      }
    },
    {
      name: 'animation', visibility: 'render', fields: {
        animationMode: selectField(animationModeOptions()),
        swingSpeed: numberField(0.1, 0),
        walkSpeedMultiplier: numberField(0.1, 0),
        idleStrength: numberField(0.1, 0),
        gait: selectField(gaitOptions()),
        variantMode: selectField(variantModeOptions())
      }
    },
    {
      name: 'variantWeights', visibility: 'render',
      when: (form) => form.variantMode !== 'none',
      fields: Object.fromEntries(variantClips.map((clipName, index) => [
        variantWeightKey(index),
        {label: t('eme.field.variantWeight', clipName), ...numberField(0.1, 0)}
      ]))
    },
    {
      name: 'shoulder', visibility: 'renderEntity', fields: {
        shoulderOffsetX: numberField(0.1),
        shoulderOffsetY: numberField(0.1),
        shoulderOffsetZ: numberField(0.1),
        shoulderScale: numberField(0.1, limits.minDimension)
      }
    }
  ].filter((section) => Object.keys(section.fields).length > 0);
}

function issueSection(title, issues) {
  if (!issues || issues.length === 0) {
    return [];
  }

  const lines = issues.map((issue) => `- ${issue.message}`).join('\n');

  return [`**${title}**\n\n${lines}`];
}

function issueFields(state) {
  const issues = state.geometryIssues || {};
  const sections = [
    ...issueSection(t('eme.dialog.blockingIssues'), issues.errors),
    ...issueSection(t('eme.dialog.warnings'), issues.warnings)
  ];
  const fields = {};
  if (sections.length > 0) {
    fields.geometry_issues = {type: 'info', text: sections.join('\n\n')};
  }
  if (state.onWrapInRootBone) {
    fields.wrap_in_root_bone = {
      type: 'buttons',
      buttons: [t('eme.action.wrapInRootBone')],
      click: () => state.onWrapInRootBone()
    };
  }

  return fields;
}

function buildFormConfig(settings, ui) {
  const limits = Validator.LIMITS;
  const state = ui || {};
  const variantClips = state.variantClips || [];
  const values = settingsToForm(settings, variantClips);
  const allowCustomize = !!state.showCustomization;

  const standalone = (form) => form.exportType !== 'model_only';
  const blockEntitySelected = (form) =>
      standalone(form) && form.modelType === MODEL_TYPE_BLOCK_ENTITY;
  const customizeOn = (form) => allowCustomize && !!form.customize;
  const showServer = (form) => customizeOn(form) && standalone(form);
  const showEntity = (form) => showServer(form) && !blockEntitySelected(form);
  const showRender = customizeOn;

  const experimental = !!state.experimental;
  const entityValue = state.preset || 'statue';
  const blockValue = state.blockPreset || 'static';

  const config = {
    ...issueFields(state),
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

  if (state.hasExternalTextures) {
    config.includeExternalTextures = {
      label: t('eme.field.includeExternalTextures'),
      description: t('eme.field.includeExternalTexturesDescription'),
      type: 'checkbox',
      value: settings.includeExternalTextures !== false,
      condition: (form) => form.exportType !== EXPORT_TYPE_DATA_PACK
    };
  }

  if (allowCustomize) {
    config.customize = {
      label: t('eme.field.customize'),
      type: 'checkbox',
      value: !!state.customize
    };
  }

  const visibility = {
    entity: showEntity,
    server: showServer,
    render: showRender,
    renderEntity: (form) => showRender(form) && !blockEntitySelected(form)
  };
  for (const section of advancedSections(limits, variantClips)) {
    const sectionVisible = visibility[section.visibility];
    const condition = section.when
        ? (form) => sectionVisible(form) && section.when(form) : sectionVisible;
    config[`${section.name}_header`] = {
      type: 'info',
      text: `### ${t(`eme.section.${section.name}`)}`,
      condition: condition
    };
    for (const [key, field] of Object.entries(section.fields)) {
      config[key] = {
        label: t(`eme.field.${key}`),
        ...field,
        value: values[key],
        condition: condition
      };
    }
  }

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
      ...options,
      onWrapInRootBone: options.onWrapInRootBone ? () => {
        const form = dialog.getFormResult();
        dialog.hide();
        options.onWrapInRootBone(form);
      } : undefined
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
          modelDimensions, visibleBounds, options.variantClips);
      options.onExport(finalSettings);
    }
  });
  dialog.show();
  if (options.formValues) {
    dialog.setFormValues(options.formValues, false);
    lastKey = `${activeModelType(options.formValues)}|${activePreset(
        options.formValues)}`;
  }

  return dialog;
}

module.exports = {
  buildFormConfig,
  openExportDialog
};
