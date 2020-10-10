import semver from 'semver';
import { version } from './package.json';
import { loadAnimationUI, unloadAnimationUI } from './animationUi';
import { removeMonkeypatches } from './utils';
import { loadKeyframeOverrides, unloadKeyframeOverrides } from './keyframe';
import geckoSettings, { OBJ_TYPE_OPTIONS, onSettingsChanged, OBJ_TYPE_BLOCK_ITEM } from './settings';
import codec, { loadCodec, unloadCodec, maybeExportItemJson } from './codec';

(function () {
  const MIN_BLOCKBENCH_VERSION = "3.6.6";
  let exportAction;
  let exportDisplayAction;
  let button;

  Plugin.register("animation_utils", {
    name: "GeckoLib Animation Utils",
    author: "Eliot Lash, Gecko",
    title: "GeckoLib Animation Utils",
    description:
      `This plugin lets you create animated java entities with GeckoLib. This plugin requires Blockbench ${MIN_BLOCKBENCH_VERSION}. Learn about GeckoLib here: https://github.com/bernie-g/geckolib`,
    icon: "movie_filter",
    version,
    min_version: MIN_BLOCKBENCH_VERSION,
    variant: "both",
    onload() {
      loadCodec();
      loadAnimationUI();
      loadKeyframeOverrides();

      if (!semver.satisfies(semver.coerce(Blockbench.version), '^3.6.6')) {
        alert('GeckoLib Animation Utils currently only supports Blockbench 3.6.x. Please ensure you are using this version of Blockbench to avoid bugs and undefined behavior.');
      }

      exportAction = new Action({
        id: "export_geckolib_model",
        name: "Export GeckoLib Model",
        icon: "archive",
        description:
          "Export your java animated model as a model for GeckoLib.",
        category: "file",
        condition: () => Format.id === "animated_entity_model",
        click: function () {
          codec.export();
        },
      });
      MenuBar.addAction(exportAction, "file.export");

      exportDisplayAction = new Action({
        id: "export_geckolib_display",
        name: "Export GeckoLib Display Settings",
        icon: "icon-bb_interface",
        description:
          "Export your java animated model display settings for GeckoLib.",
        category: "file",
        condition: () => Format.id === "animated_entity_model" && geckoSettings.objectType === OBJ_TYPE_BLOCK_ITEM,
        click: maybeExportItemJson,
      });
      MenuBar.addAction(exportDisplayAction, "file.export");

      button = new Action('gecko_settings', {
        name: 'GeckoLib Model Settings...',
        description: 'Configure animated model.',
        icon: 'info',
        condition: () => Format.id === "animated_entity_model",
        click: function () {
          var dialog = new Dialog({
            id: 'project',
            title: 'GeckoLib Model Settings',
            width: 540,
            lines: [`<b class="tl"><a href="https://github.com/bernie-g/geckolib">GeckoLib</a> Animation Utils v${version}</b>`],
            form: {
              objectType: {label: 'Object Type', type: 'select', default: geckoSettings.objectType, options: OBJ_TYPE_OPTIONS},
              // modSDK: {label: 'Modding SDK', type: 'select', default: geckoSettings.modSDK, options: MOD_SDK_OPTIONS},
              // entityType: {label: 'Entity Type', value: geckoSettings.entityType},
              // javaPackage: {label: 'Java Package', value: geckoSettings.javaPackage},
              // animFileNamespace: {label: 'Animation File Namespace', value: geckoSettings.animFileNamespace},
              // animFilePath: {label: 'Animation File Path', value: geckoSettings.animFilePath},
            },
            onConfirm: function(formResult) {
              Object.assign(geckoSettings, formResult);
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
  });
})();
