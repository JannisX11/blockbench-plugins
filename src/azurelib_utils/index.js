import semverCoerce from 'semver/functions/coerce';
import semverSatisfies from 'semver/functions/satisfies';
import { version, blockbenchConfig } from './package.json';
import { loadAnimationUI, unloadAnimationUI } from './animationUi';
import { removeMonkeypatches } from './utils';
import { loadKeyframeOverrides, unloadKeyframeOverrides } from './keyframe';
import azurelibSettings, { OBJ_TYPE_OPTIONS, onSettingsChanged, OBJ_TYPE_BLOCK_ITEM } from './settings';
import codec, { loadCodec, unloadCodec, maybeExportItemJson } from './codec';

const SUPPORTED_BB_VERSION_RANGE = `${blockbenchConfig.min_version} - ${blockbenchConfig.max_version}`;
if (!semverSatisfies(semverCoerce(Blockbench.version), SUPPORTED_BB_VERSION_RANGE)) {
  alert(`AzureLib Animation currently only supports Blockbench ${SUPPORTED_BB_VERSION_RANGE}. Please ensure you are using this version of Blockbench to avoid bugs and undefined behavior.`);
}

(function () {
  let exportAction;
  let exportDisplayAction;
  let button;

  Plugin.register("azurelib_utils", Object.assign(
    {},
    blockbenchConfig,
    {
      name: blockbenchConfig.title,
      version,
      await_loading: true,
      onload() {
        loadCodec();
        loadAnimationUI();
        loadKeyframeOverrides();
        console.log("Loaded AzureLib plugin")
        exportAction = new Action({
          id: "export_AzureLib_model",
          name: "Export AzureLib Model",
          icon: "archive",
          description:
            "Export your java animated model as a model for AzureLib.",
          category: "file",
          condition: () => Format.id === "animated_entity_model",
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
            "Export your java animated model display settings for AzureLib.",
          category: "file",
          condition: () => Format.id === "animated_entity_model" && azurelibSettings.objectType === OBJ_TYPE_BLOCK_ITEM,
          click: maybeExportItemJson,
        });
        MenuBar.addAction(exportDisplayAction, "file.export");

        button = new Action('azurelib_settings', {
          name: 'AzureLib Model Settings...',
          description: 'Configure animated model.',
          icon: 'info',
          condition: () => Format.id === "animated_entity_model",
          click: function () {
            var dialog = new Dialog({
              id: 'project',
              title: 'AzureLib Model Settings',
              width: 540,
              lines: [`<b class="tl"><a href="https://www.azuredoom.com">AzureLib</a> Animation Utils v${version}</b>`],
              form: {
                objectType: {label: 'Object Type', type: 'select', default: azurelibSettings.objectType, options: OBJ_TYPE_OPTIONS},
                // modSDK: {label: 'Modding SDK', type: 'select', default: azurelibSettings.modSDK, options: MOD_SDK_OPTIONS},
                // entityType: {label: 'Entity Type', value: azurelibSettings.entityType},
                // javaPackage: {label: 'Java Package', value: azurelibSettings.javaPackage},
                // animFileNamespace: {label: 'Animation File Namespace', value: azurelibSettings.animFileNamespace},
                // animFilePath: {label: 'Animation File Path', value: azurelibSettings.animFilePath},
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
