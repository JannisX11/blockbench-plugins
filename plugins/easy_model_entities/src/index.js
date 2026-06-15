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
const {ModelDimensions} = require('./model/ModelDimensions');
const {PresetDetector} = require('./model/PresetDetector');
const {ResourceLocation} = require('./utils/ResourceLocation');
const {Validator} = require('./model/Validator');
const {buildPackBundle, buildModProjectFiles} = require('./builders/exporter');
const {BlockbenchAdapter} = require('./BlockbenchAdapter');
const {openExportDialog} = require('./ui/exportDialog');
const {registerTranslations, t} = require('./i18n/translations');
const actionIconSvg = require('./resources/action_icon.svg');

const ACTION_ID = 'eme_export';
const SETTING_ID = 'eme_enable_customization';
const EXPERIMENTAL_SETTING_ID = 'eme_enable_experimental';
const ACTION_ICON = 'data:image/svg+xml,' + encodeURIComponent(actionIconSvg);
let exportAction;
let projectProperty;
let customizationSetting;
let experimentalSetting;

function customizationEnabled() {
  if (customizationSetting && typeof customizationSetting.value === 'boolean') {
    return customizationSetting.value;
  }
  return false;
}

function experimentalEnabled() {
  if (experimentalSetting && typeof experimentalSetting.value === 'boolean') {
    return experimentalSetting.value;
  }
  return false;
}

function resolveDialogState() {
  const storedSettings = BlockbenchAdapter.loadSettings();
  const stats = BlockbenchAdapter.getModelStats();
  const bounds = BlockbenchAdapter.getModelBounds();

  let settings;
  let preset;
  let blockPreset;
  let modelType;
  let customize;
  let exportType;

  if (storedSettings) {
    settings = deepMerge(getDefaults(), storedSettings);
    modelType = settings.modelType || 'entity';
    customize = !!storedSettings.customize;
    exportType = storedSettings.exportType
        || (storedSettings.exportTarget === 'mod_project' ? 'mod_project'
            : 'packs');
    if (modelType === 'block_entity') {
      preset = 'custom';
      blockPreset = settings.presetType || 'static';
    } else {
      preset = settings.presetType || DEFAULT_PRESET;
      blockPreset = 'static';
    }
  } else {
    preset = PresetDetector.detectPresetType(stats, bounds);
    blockPreset = 'static';
    modelType = 'entity';
    settings = applyTemplate(preset);
    ModelDimensions.applyModelDimensions(settings,
        ModelDimensions.deriveDimensions(bounds, settings.host.bodyType));
    customize = false;
    exportType = 'packs';
    const projectName = BlockbenchAdapter.getProjectName();
    if (projectName) {
      settings.profileId = ResourceLocation.sanitizeProfileId(projectName);
    }
  }

  const modelDimensions = ModelDimensions.deriveDimensions(bounds,
      settings.host.bodyType);
  return {
    settings, preset, blockPreset, modelType, customize, exportType,
    modelDimensions
  };
}

function formatIssues(issues) {
  return issues.map((issue) => `• ${issue.message}`).join('\n');
}

function collectContext() {
  const stats = BlockbenchAdapter.getModelStats();
  return Object.assign({}, stats, {
    textureCount: BlockbenchAdapter.getTextureCount(),
    visibleBoundsManual: true
  });
}

function runExport(settings, target) {
  const context = collectContext();
  const result = Validator.validateSettings(settings, context);

  if (!result.valid) {
    Blockbench.showMessageBox({
      title: t('eme.dialog.title'),
      message: 'Export blocked. Please fix the following issues:\n\n'
          + formatIssues(result.errors)
    });
    return;
  }

  const doExport = () => performExport(settings, target);

  if (result.warnings.length > 0) {
    Blockbench.showMessageBox(
        {
          title: t('eme.dialog.title'),
          message: 'The following warnings were found:\n\n' + formatIssues(
              result.warnings) + '\n\nExport anyway?',
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

function performExport(settings, target) {
  const options = {
    modelBytes: BlockbenchAdapter.getModelBytes(),
    textureBytes: BlockbenchAdapter.getTextureBytes()
  };

  BlockbenchAdapter.saveSettings(settings);

  if (target === 'mod_project') {
    exportToModProject(settings, options);
  } else {
    exportToZip(settings, options);
  }
}

function exportToZip(settings, options) {
  const bundle = buildPackBundle(settings, options);
  BlockbenchAdapter.exportPackBundle(bundle,
      `${settings.namespace}_${settings.profileId}_eme`)
  .then(() => {
    Blockbench.showQuickMessage('Easy Model Entities packs exported', 1500);
  })
  .catch((error) => {
    Blockbench.showMessageBox({title: 'Export failed', message: String(error)});
  });
}

function exportToModProject(settings, options) {
  const rootDir = BlockbenchAdapter.pickDirectory(
      'Select src/main/resources directory');
  if (!rootDir) {
    return;
  }

  const {files} = buildModProjectFiles(settings, options);
  const existing = BlockbenchAdapter.listExistingFiles(rootDir, files);

  const write = () => {
    try {
      BlockbenchAdapter.writeToDirectory(rootDir, files);
      Blockbench.showQuickMessage(
          'Easy Model Entities files written to mod project', 1500);
    } catch (error) {
      Blockbench.showMessageBox(
          {title: 'Export failed', message: String(error)});
    }
  };

  if (existing.length > 0) {
    Blockbench.showMessageBox(
        {
          title: 'Overwrite existing files?',
          message: `${existing.length} file(s) already exist and will be overwritten:\n\n`
              + existing.join('\n'),
          buttons: ['Overwrite', 'Cancel'],
          confirm: 0,
          cancel: 1
        },
        (button) => {
          if (button === 0) {
            write();
          }
        }
    );
  } else {
    write();
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
    showCustomization: customizationEnabled(),
    experimental: experimentalEnabled(),
    modelDimensions: state.modelDimensions,
    onExport: runExport
  });
}

BBPlugin.register('easy_model_entities', {
  title: 'Easy Model Entities Exporter',
  icon: 'icon.png',
  author: 'Markus Bordihn',
  description: 'Export Blockbench models for the Easy Model Entities mod (Minecraft: Java Edition) as ready-to-install Data Pack and Resource Pack files.',
  tags: ['Minecraft: Java Edition', 'Exporter', 'Entity'],
  version: '0.1.0',
  min_version: '4.9.0',
  variant: 'desktop',
  has_changelog: true,
  website: 'https://github.com/MarkusBordihn/BOs-Easy-Model-Entities',
  repository: 'https://github.com/MarkusBordihn/BOs-Easy-Model-Entities',
  bug_tracker: 'https://github.com/MarkusBordihn/BOs-Easy-Model-Entities/issues',
  onload() {
    registerTranslations();

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
      name: 'Export Easy Model Entities Pack',
      description: 'Export the current project as Easy Model Entities Data Pack and Resource Pack.',
      icon: ACTION_ICON,
      click() {
        openDialog();
      }
    });

    MenuBar.addAction(exportAction, 'file.export');
  },
  onunload() {
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
