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
  getDefaults,
  deepMerge,
  applyTemplate,
  DEFAULT_PRESET
} = require('./model/templates');
const {
  MODEL_TYPE_ENTITY,
  MODEL_TYPE_BLOCK_ENTITY
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

const MODDED_ENTITY_FORMAT_ID = 'modded_entity';
const ACTION_ID = 'eme_export';
const SETTING_ID = 'eme_enable_customization';
const EXPERIMENTAL_SETTING_ID = 'eme_enable_experimental';
const EXPORT_ICON = 'data:image/svg+xml,' + encodeURIComponent(exportIconSvg);
const CREATE_ICON = 'data:image/svg+xml,' + encodeURIComponent(createIconSvg);
let exportAction;
let projectProperty;
let customizationSetting;
let experimentalSetting;

function settingEnabled(setting) {
  return !!setting && typeof setting.value === 'boolean' && setting.value;
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
    settings = deepMerge(getDefaults(), storedSettings);
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
      && (!settings.profileId || settings.profileId
          === getDefaults().profileId)) {
    settings.profileId = ResourceLocation.sanitizeProfileId(projectName);
  }

  VisibleBounds.applyVisibleBounds(settings, visibleBounds, {
    preserveExisting: !!storedSettings
  });

  return {
    settings, preset, blockPreset, modelType, customize, exportType,
    visibleBounds, modelDimensions,
    hasExternalTextures: (stats.externalTextures || []).length > 0
  };
}

function formatIssues(issues) {
  return issues.map((issue) => `• ${issue.message}`).join('\n');
}

function pairingWarnings(settings) {
  if (!isSinglePackExport(settings.exportType)
      || settings.lastExportedVersion) {
    return [];
  }

  return [{
    code: 'NO_PAIRED_EXPORT',
    message: 'This project has no earlier export to pair with, so the single '
        + 'pack may not match the installed one. Export both packs instead'
  }];
}

function runExport(settings, target) {
  const textureResolution = resolveTextures(
      BlockbenchAdapter.collectTextures(), settings);
  const result = Validator.validateSettings(settings, {
    ...BlockbenchAdapter.getModelStats(),
    textureIssues: textureResolution.issues,
    referencedTextures: textureResolution.referencedOnly
  });
  const warnings = [...result.warnings, ...pairingWarnings(settings)];

  if (!result.valid) {
    Blockbench.showMessageBox({
      title: t('eme.dialog.title'),
      message: 'Export blocked. Please fix the following issues:\n\n'
          + formatIssues(result.errors)
    });
    return;
  }

  const doExport = () => performExport(settings, target, textureResolution);

  if (warnings.length > 0) {
    Blockbench.showMessageBox(
        {
          title: t('eme.dialog.title'),
          message: 'The following warnings were found:\n\n' + formatIssues(
              warnings) + '\n\nExport anyway?',
          buttons: ['Export', 'Cancel'],
          confirm: 0,
          cancel: 1
        },
        (button) => {
          if (button === 0) {
            doExport();
          }
        }
    );
  } else {
    doExport();
  }
}

function openDialog() {
  if (!Project) {
    Blockbench.showQuickMessage('Open a project first', 1500);
    return;
  }

  const state = resolveDialogState();
  openExportDialog({
    settings: state.settings,
    preset: state.preset,
    blockPreset: state.blockPreset,
    modelType: state.modelType,
    customize: state.customize,
    exportType: state.exportType,
    showCustomization: settingEnabled(customizationSetting),
    experimental: settingEnabled(experimentalSetting),
    modelDimensions: state.modelDimensions,
    visibleBounds: state.visibleBounds,
    hasExternalTextures: state.hasExternalTextures,
    onExport: runExport
  });
}

BBPlugin.register('easy_model_entities', {
  title: 'Easy Model Entities',
  icon: 'icon.png',
  author: 'Markus Bordihn',
  description: 'Export Blockbench models for the Easy Model Entities mod (Minecraft: Java Edition) as ready-to-install Data Pack and Resource Pack files.',
  tags: ['Minecraft: Java Edition', 'Format', 'Entity'],
  version: '1.0.0',
  min_version: '4.9.0',
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
          default: undefined
        });

    customizationSetting = new Setting(SETTING_ID, {
      name: t('eme.setting.enable_customization'),
      category: 'export',
      type: 'toggle',
      value: false
    });

    experimentalSetting = new Setting(EXPERIMENTAL_SETTING_ID, {
      name: t('eme.setting.enable_experimental'),
      category: 'export',
      type: 'toggle',
      value: false
    });

    exportAction = new Action(ACTION_ID, {
      name: t('eme.action.export'),
      description: t('eme.action.exportDescription'),
      icon: EXPORT_ICON,
      condition: () => typeof Format !== 'undefined' && Format
          && (Format.id === FORMAT_ID || Format.id === MODDED_ENTITY_FORMAT_ID),
      click() {
        openDialog();
      }
    });

    MenuBar.addAction(exportAction, 'file.export');

    patchTexturePanel(FORMAT_ID);
  },
  onunload() {
    unpatchTexturePanel();
    unregisterEmeCodecHooks();
    unregisterEmeFormat();
    if (exportAction) {
      exportAction.delete();
    }
    if (customizationSetting) {
      customizationSetting.delete();
    }
    if (experimentalSetting) {
      experimentalSetting.delete();
    }
    if (projectProperty) {
      projectProperty.delete();
    }
  }
});
