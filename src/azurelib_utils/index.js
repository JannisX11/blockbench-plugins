/**
 * This module is a fork of the GeckoLib Animation Utils plugin and modified for use in the Azurelib fork.
 * Original source:
 * https://github.com/JannisX11/blockbench-plugins/tree/034ed058efa5b2847fb852e3b215aad372080dcf/src/animation_utils 
 * Copyright © 2024 Bernie-G. Licensed under the MIT License.
 * https://github.com/JannisX11/blockbench-plugins/blob/main/LICENSE
 */

import semverCoerce from 'semver/functions/coerce';
import semverSatisfies from 'semver/functions/satisfies';
import { version, blockbenchConfig } from './package.json';
import { loadAnimationUI, unloadAnimationUI } from './animationUi';
import { removeMonkeypatches } from './utils';
import { loadKeyframeOverrides, unloadKeyframeOverrides } from './keyframe';
import azurelibSettings, { OBJ_TYPE_OPTIONS, onSettingsChanged } from './settings';
import codec, { loadCodec, unloadCodec, maybeExportItemJson, maybeImportItemJson  } from './codec';

const SUPPORTED_BB_VERSION_RANGE = `${blockbenchConfig.min_version} - ${blockbenchConfig.max_version}`;
if (!semverSatisfies(semverCoerce(Blockbench.version), SUPPORTED_BB_VERSION_RANGE)) {
  alert(`AzureLib Animation currently only supports Blockbench ${SUPPORTED_BB_VERSION_RANGE}. Please ensure you are using this version of Blockbench to avoid bugs and undefined behavior.`);
}

(function () {
  let exportAction;
  let exportDisplayAction;
  let importDisplayAction;
  let button;

  Plugin.register("azurelib_utils", Object.assign(
    {},
    blockbenchConfig,
    {
      version,
      await_loading: true,
      onload() {
        loadCodec();
        loadAnimationUI();
        loadKeyframeOverrides();
        console.log("Loaded AzureLib plugin")
		
        // Intercept new project creation for AzureLib format
        Blockbench.on('new_project', () => {
          if (Format?.id === "azure_model") {
            setTimeout(() => {
              if (Interface && Interface.dialog && Interface.dialog.close) {
                try {
                  Interface.dialog.close();
                  console.log("[AzureLib] Closed default Project Settings dialog");
                } catch (err) {
                  console.warn("[AzureLib] Could not close Project Settings dialog:", err);
                }
              }
        
              new Dialog({
                id: 'azurelib_model_settings',
                title: 'AzureLib Model Settings',
                width: 540,
                lines: [
                  `<b class="tl"><a href="https://wiki.azuredoom.com/">AzureLib</a> Animation Utils v${version}</b>`,
                  '<p>Select your model type to get started.</p>'
                ],
                form: {
                  objectType: {
                    label: 'Object Type',
                    type: 'select',
                    default: azurelibSettings.objectType,
                    options: OBJ_TYPE_OPTIONS
                  },
                },
                onConfirm(formResult) {
                  Object.assign(azurelibSettings, formResult);
                  onSettingsChanged();
                }
              }).show();
        
            }, 150);
          }
        });
		
        exportAction = new Action({
          id: "export_AzureLib_model",
          name: "Export AzureLib .geo Model",
          icon: "archive",
          description:
            "Export your .geo model for AzureLib.",
          category: "file",
          condition: () => Format.id === "azure_model",
          click: function () {
            codec.export();
          },
        });
        MenuBar.addAction(exportAction, "file.export");

        exportDisplayAction = new Action({
          id: "export_AzureLib_display",
          name: "Export AzureLib Display Settings",
          icon: "icon-bb_interface",
          description:
            "Export your display settings file for AzureLib Item/Blocks.",
          category: "file",
          condition: () => Format.id === "azure_model",
          click: maybeExportItemJson,
        });
        MenuBar.addAction(exportDisplayAction, "file.export");

        importDisplayAction = new Action({
            id: "import_AzureLib_display",
            name: "Import AzureLib Display Settings",
            icon: "icon-bow",
            description: "Import Display Settings into the display tab.",
            category: "file",
            condition: () => Format.id === "azure_model",
            click: maybeImportItemJson,
        });
        MenuBar.addAction(importDisplayAction, "file.import");

        button = new Action('azurelib_settings', {
          name: 'AzureLib Model Settings',
          description: 'Change model type.',
          icon: 'info',
          condition: () => Format.id === "azure_model",
          click: function () {
            var dialog = new Dialog({
              id: 'project',
              title: 'AzureLib Model Settings',
              width: 540,
              lines: [`<b class="tl"><a href="https://wiki.azuredoom.com/">AzureLib</a> Animation Utils v${version}</b>`],
              form: {
                objectType: {label: 'Object Type', type: 'select', default: azurelibSettings.objectType, options: OBJ_TYPE_OPTIONS},
              },
              onConfirm: function(formResult) {
                Object.assign(azurelibSettings, formResult);
                onSettingsChanged();
                dialog.hide()
              }
            })
            dialog.show()
          }
        });
        MenuBar.addAction(button, 'file.1');
      },
      onunload() {
        exportAction.delete();
        exportDisplayAction.delete();
        importDisplayAction.delete();
        button.delete();
        unloadKeyframeOverrides();
        unloadAnimationUI();
        unloadCodec();
        removeMonkeypatches();
        console.clear(); // eslint-disable-line no-console
      },
    }
  ));
})();
