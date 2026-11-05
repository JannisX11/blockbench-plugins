/**
 * AzureLib Animator — Blockbench Plugin Entry
 * -------------------------------------------
 * Registers the AzureLib animation format and editor utilities.
 *
 * © 2025 AzureDoom — MIT License
 */

import semverCoerce from 'semver/functions/coerce.js';
import semverSatisfies from 'semver/functions/satisfies.js';
import pkg from './package.json' assert { type: 'json' };
import {
  initializeAnimationUI,
  unloadAnimationUI
} from './animation/azure-animation-ui.js';
import {
  registerKeyframeOverrides,
  unregisterKeyframeOverrides
} from './animation/azure-keyframes.js';
import AzureConfig, {
  TYPE_OPTIONS,
  onSettingsChanged
} from './core/azure-settings.js';
import codec, {
  registerAzureCodec,
  unregisterAzureCodec,
  maybeExportItemJson,
  maybeImportItemJson
} from './core/azure-codec.js';
import { restoreOverrides } from './core/azure-utils.js';
import { registerRig, unregisterRig } from './rig/azure-rig.js';

const { version, blockbenchConfig } = pkg;
const RANGE = `${blockbenchConfig.min_version} - ${blockbenchConfig.max_version}`;
if (!semverSatisfies(semverCoerce(Blockbench.version), RANGE)) {
  alert(`AzureLib Animator supports Blockbench ${RANGE}. Update for best results.`);
}

(function () {
  let exportAction, exportDisplay, importDisplay, settingsButton;

  Plugin.register('azurelib_utils', {
    title: 'AzureLib Animator',
    author: 'AzureDoom, Eliot Lash, Gecko, McHorse',
    icon: 'azureicon.png',
    description: 'Create animated blocks, items, entity, and armor using the AzureLib library and plugin. This is a fork of Geckolib and cross compatibility will not be promised in the future.',
    tags: ['Minecraft: Java Edition'],
    version: '2.3.0',
    variant: 'both',
    min_version: '4.8.0',
    website: 'https://wiki.azuredoom.com/',
    await_loading: true,
    creation_date: '2023-04-04',
    new_repository_format: true,
    contributes: {
      formats: ['azure_model']
    },
    has_changelog: true,
    onload() {
      registerAzureCodec();
      initializeAnimationUI();
      registerKeyframeOverrides();
      registerRig();
      console.log('[AzureLib] Animator loaded');
	  
      Blockbench.on('ready', () => {
        setTimeout(() => {
          if (!Keyframe.prototype._azurePatched) {
            console.log('[AzureLib] Reattaching keyframe overrides after ready()');
            registerKeyframeOverrides();
          }
        }, 0);
      });

      // Auto show settings for Azure model
      Blockbench.on('new_project', () => {
        if (Format?.id === 'azure_model') {
          setTimeout(() => {
            try {
              Interface.dialog?.close();
            } catch {}
            new Dialog({
              id: 'azurelib_model_settings',
              title: 'AzureLib Model Settings',
              width: 540,
              lines: [
                `<b class="tl"><a href="https://wiki.azuredoom.com/">AzureLib</a> Animator v${version}</b>`,
                '<p>Select your model type to begin.</p>',
              ],
              form: {
                objectType: {
                  label: 'Object Type',
                  type: 'select',
                  default: AzureConfig.objectType,
                  options: TYPE_OPTIONS,
                },
              },
              onConfirm(form) {
                Object.assign(AzureConfig, form);
                onSettingsChanged();
              },
            }).show();
          }, 150);
        }
      });

      exportAction = new Action({
        id: 'export_AzureLib_model',
        name: 'Export AzureLib .geo Model',
        icon: 'archive',
        description: 'Export your .geo model for AzureLib.',
        category: 'file',
        condition: () => Format.id === 'azure_model',
        click: () => codec.export(),
      });
      MenuBar.addAction(exportAction, 'file.export');

      exportDisplay = new Action({
        id: 'export_AzureLib_display',
        name: 'Export AzureLib Display Settings',
        icon: 'icon-bb_interface',
        category: 'file',
        description: 'Export display settings for AzureLib.',
        condition: () => Format.id === 'azure_model',
        click: maybeExportItemJson,
      });
      MenuBar.addAction(exportDisplay, 'file.export');

      importDisplay = new Action({
        id: 'import_AzureLib_display',
        name: 'Import AzureLib Display Settings',
        icon: 'icon-bow',
        category: 'file',
        condition: () => Format.id === 'azure_model',
        click: maybeImportItemJson,
      });
      MenuBar.addAction(importDisplay, 'file.import');

      settingsButton = new Action('azurelib_settings', {
        name: 'AzureLib Model Settings',
        description: 'Change model type',
        icon: 'info',
        condition: () => Format.id === 'azure_model',
        click: () => {
          const dialog = new Dialog({
            id: 'project',
            title: 'AzureLib Model Settings',
            width: 540,
            lines: [
              `<b class="tl"><a href="https://wiki.azuredoom.com/">AzureLib</a> Animator v${version}</b>`,
            ],
            form: {
              objectType: {
                label: 'Object Type',
                type: 'select',
                default: AzureConfig.objectType,
                options: TYPE_OPTIONS,
              },
            },
            onConfirm: result => {
              Object.assign(AzureConfig, result);
              onSettingsChanged();
              dialog.hide();
            },
          });
          dialog.show();
        },
      });
      MenuBar.addAction(settingsButton, 'file.1');
    },
    onunload() {
      exportAction.delete();
      exportDisplay.delete();
      importDisplay.delete();
      settingsButton.delete();
      unregisterRig();
      unregisterKeyframeOverrides();
      unloadAnimationUI();
      unregisterAzureCodec();
      restoreOverrides();
      console.log('[AzureLib] Animator unloaded.');
    },
  });
})();
