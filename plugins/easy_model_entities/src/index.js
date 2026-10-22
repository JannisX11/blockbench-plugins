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
  expandModelSettings,
  applyTemplate,
  DEFAULT_PRESET,
  DEFAULT_PROFILE_ID
} = require('./model/templates');
const {
  MODEL_TYPE_ENTITY,
  MODEL_TYPE_BLOCK_ENTITY,
  variantClipNames
} = require('./model/presetTypes');
const {ModelDimensions} = require('./model/ModelDimensions');
const {VisibleBounds} = require('./model/VisibleBounds');
const {PresetDetector} = require('./model/PresetDetector');
const {ResourceLocation} = require('./utils/ResourceLocation');
const {resolveTextures} = require('./utils/TextureResolver');
const {patchTexturePanel, unpatchTexturePanel} = require('./ui/texturePanel');
const {Validator} = require('./model/Validator');
const {
  EXPORT_TYPE_PACKS,
  isSinglePackExport
} = require('./model/exportTypes');
const {performExport} = require('./exportFlow');
const {BlockbenchAdapter} = require('./BlockbenchAdapter');
const {openExportDialog} = require('./ui/exportDialog');
const {registerTranslations, t} = require('./i18n/translations');
const exportIconSvg = require('./resources/export_icon.svg');
const createIconSvg = require('./resources/create_icon.svg');
const {FORMAT_ID, registerEmeFormat, unregisterEmeFormat} = require(
    './format/EmeFormat');
const {registerEmeCodecHooks, unregisterEmeCodecHooks} = require(
    './format/EmeCodecHooks');
const {
  registerAnimationInheritance,
  unregisterAnimationInheritance
} = require('./animation/animationParentLink');

const MODDED_ENTITY_FORMAT_ID = 'modded_entity';
const EXPORT_FORMAT_IDS = [FORMAT_ID, MODDED_ENTITY_FORMAT_ID];
const STATIC_PRESET = 'statue';
const ACTION_ID = 'eme_export';
const VALIDATOR_CHECK_ID = 'eme_model_load';
const SETTING_NAMES = ['enable_customization', 'enable_experimental'];
const EXPORT_ICON = 'data:image/svg+xml,' + encodeURIComponent(exportIconSvg);
const CREATE_ICON = 'data:image/svg+xml,' + encodeURIComponent(createIconSvg);
let exportAction;
let modelLoadCheck;
let projectProperty;
const pluginSettings = new Map();

function settingEnabled(name) {
  return pluginSettings.get(name)?.value === true;
}

function resolveDialogState() {
  const storedSettings = BlockbenchAdapter.loadSettings();
  const stats = BlockbenchAdapter.getModelStats();
  const bounds = BlockbenchAdapter.getModelBounds();
  const visibleBounds = VisibleBounds.derive(BlockbenchAdapter.getModelCubes());

  let settings;
  let preset;
  let blockPreset;
  let modelType;
  let customize;
  let exportType;

  if (storedSettings) {
    settings = expandModelSettings(storedSettings);
    modelType = settings.modelType || MODEL_TYPE_ENTITY;
    customize = !!storedSettings.customize;
    exportType = storedSettings.exportType || EXPORT_TYPE_PACKS;
    if (modelType === MODEL_TYPE_BLOCK_ENTITY) {
      preset = 'custom';
      blockPreset = settings.presetType || 'static';
    } else {
      preset = settings.presetType || DEFAULT_PRESET;
      blockPreset = 'static';
    }
  } else {
    preset = PresetDetector.detectPresetType(stats, bounds);
    blockPreset = 'static';
    modelType = MODEL_TYPE_ENTITY;
    settings = applyTemplate(preset);
    customize = false;
    exportType = EXPORT_TYPE_PACKS;
  }

  const modelDimensions = ModelDimensions.deriveDimensions(bounds,
      settings.host.bodyType);
  if (!storedSettings) {
    ModelDimensions.applyModelDimensions(settings, modelDimensions);
  }

  const projectName = BlockbenchAdapter.getProjectName();
  if (projectName
      && (!settings.profileId || settings.profileId === DEFAULT_PROFILE_ID)) {
    settings.profileId = ResourceLocation.sanitizeProfileId(projectName);
  }

  VisibleBounds.applyVisibleBounds(settings, visibleBounds, {
    preserveExisting: !!storedSettings
  });

  return {
    settings, preset, blockPreset, modelType, customize, exportType,
    visibleBounds, modelDimensions,
    variantClips: variantClipNames(stats.animations),
    hasExternalTextures: (stats.externalTextures || []).length > 0,
    geometry: stats.geometry
  };
}

function formatIssues(issues) {
  return issues.map((issue) => `- ${issue.message}`).join('\n');
}

function pairingWarnings(settings) {
  if (!isSinglePackExport(settings.exportType)
      || settings.lastExportedVersion) {
    return [];
  }

  return [{
    code: 'NO_PAIRED_EXPORT',
    message: t('eme.validation.NO_PAIRED_EXPORT')
  }];
}

function targetVersionWarnings(settings) {
  if (!settings.lastExportedTargetVersion
      || settings.lastExportedTargetVersion === settings.targetVersion) {
    return [];
  }

  return [{
    code: 'TARGET_VERSION_CHANGED',
    message: t('eme.validation.TARGET_VERSION_CHANGED',
        settings.lastExportedTargetVersion, settings.targetVersion)
  }];
}

function runExport(settings) {
  BlockbenchAdapter.saveSettings(settings);
  const textureResolution = resolveTextures(
      BlockbenchAdapter.collectTextures(), settings);
  const result = Validator.validateSettings(settings, {
    ...BlockbenchAdapter.getModelStats(),
    modelFileSize: BlockbenchAdapter.getModelFileSize(),
    textureIssues: textureResolution.issues,
    referencedTextures: textureResolution.referencedOnly
  });
  const warnings = [...result.warnings, ...pairingWarnings(settings),
    ...targetVersionWarnings(settings)];

  if (!result.valid) {
    Blockbench.showMessageBox({
      title: t('eme.dialog.title'),
      message: `${t('eme.message.exportBlocked')}\n\n${formatIssues(
          result.errors)}`
    });
    return;
  }

  const doExport = () => performExport(settings, textureResolution);

  if (warnings.length > 0) {
    BlockbenchAdapter.confirm(t('eme.dialog.title'),
        `${t('eme.message.exportWarnings')}\n\n${formatIssues(
            warnings)}\n\n${t('eme.message.exportAnyway')}`,
        t('eme.button.export'), doExport);
  } else {
    doExport();
  }
}

function modelLoadErrors() {
  const stats = BlockbenchAdapter.getModelLoadStats();
  if (!stats.hasModel) {
    return [];
  }

  const storedSettings = BlockbenchAdapter.loadSettings();
  // Until a preset was exported, the body type is unknown; a static one skips
  // the body part check instead of reporting parts of a guessed preset.
  const settings = storedSettings ? expandModelSettings(storedSettings)
      : applyTemplate(STATIC_PRESET);
  const textureResolution = resolveTextures(
      BlockbenchAdapter.collectTextureLocations(), settings);

  return Validator.validateModelLoad(settings,
      {...stats, textureIssues: textureResolution.issues});
}

function wrapInRootBoneAndReopen(formValues) {
  BlockbenchAdapter.wrapInRootBone(t('eme.action.wrapInRootBone'));
  openDialog(formValues);
}

function openDialog(formValues) {
  if (!Project) {
    Blockbench.showQuickMessage(t('eme.message.openProjectFirst'), 1500);
    return;
  }

  const state = resolveDialogState();
  const geometryIssues = Validator.validateGeometry(state.geometry);
  const canWrapInRootBone = geometryIssues.errors.some(
      (issue) => issue.code === 'CUBE_OUTSIDE_GROUP');
  openExportDialog({
    ...state,
    showCustomization: settingEnabled('enable_customization'),
    experimental: settingEnabled('enable_experimental'),
    geometryIssues,
    formValues,
    onWrapInRootBone: canWrapInRootBone ? wrapInRootBoneAndReopen : undefined,
    onExport: runExport
  });
}

BBPlugin.register('easy_model_entities', {
  title: 'Easy Model Entities',
  icon: 'icon.png',
  author: 'Markus Bordihn',
  description: 'Export Blockbench models for the Easy Model Entities mod (Minecraft: Java Edition) as ready-to-install Data Pack and Resource Pack files.',
  tags: ['Minecraft: Java Edition', 'Format', 'Entity'],
  version: '1.1.0',
  min_version: '5.0.0',
  variant: 'desktop',
  await_loading: true,
  has_changelog: true,
  contributes: {
    formats: ['eme_entity']
  },
  website: 'https://www.curseforge.com/minecraft/mc-mods/easy-model-entities',
  repository: 'https://github.com/MarkusBordihn/BOs-Easy-Model-Entities',
  bug_tracker: 'https://github.com/MarkusBordihn/BOs-Easy-Model-Entities/issues',
  onload() {
    registerTranslations();
    registerEmeFormat(CREATE_ICON);
    registerEmeCodecHooks();

    projectProperty = new Property(ModelProject, 'object',
        BlockbenchAdapter.PROJECT_PROPERTY, {
          label: 'Easy Model Entities Settings',
          exposed: false,
          export: false,
          default: undefined
        });

    for (const name of SETTING_NAMES) {
      pluginSettings.set(name, new Setting(`eme_${name}`, {
        name: t(`eme.setting.${name}`),
        description: t(`eme.setting.${name}.description`),
        category: 'export',
        type: 'toggle',
        value: false
      }));
    }

    exportAction = new Action(ACTION_ID, {
      name: t('eme.action.export'),
      description: t('eme.action.exportDescription'),
      icon: EXPORT_ICON,
      condition: () => typeof Format !== 'undefined' && Format
          && EXPORT_FORMAT_IDS.includes(Format.id),
      click() {
        openDialog();
      }
    });

    MenuBar.addAction(exportAction, 'file.export');

    modelLoadCheck = BlockbenchAdapter.registerValidatorCheck(
        VALIDATOR_CHECK_ID, t('eme.validator.modelLoad'), EXPORT_FORMAT_IDS,
        modelLoadErrors);

    patchTexturePanel(FORMAT_ID);
    registerAnimationInheritance();
  },
  onunload() {
    unregisterAnimationInheritance();
    unpatchTexturePanel();
    unregisterEmeCodecHooks();
    unregisterEmeFormat();
    if (exportAction) {
      exportAction.delete();
    }
    if (modelLoadCheck) {
      modelLoadCheck.delete();
    }
    pluginSettings.forEach((setting) => setting.delete());
    pluginSettings.clear();
    if (projectProperty) {
      projectProperty.delete();
    }
  }
});
