import { version } from './package.json';
import { loadAnimationUI, unloadAnimationUI } from './animationUi';
import { removeMonkeypatches } from './utils';
import { loadKeyframeOverrides, unloadKeyframeOverrides } from './keyframe';
import geckoSettings, { MOD_SDK_OPTIONS } from './settings';
import codec, { loadCodec, unloadCodec } from './codec';

(function () {
  const MIN_BLOCKBENCH_VERSION = "3.6.6";
  let exportAction;
  let button;

  Plugin.register("animation_utils", {
    name: "GeckoLib Animation Utils",
    author: "Eliot Lash, Gecko",
    title: "GeckoLib Animation Utils",
    description:
      `This plugin lets you create animated java entities with GeckoLib. This plugin requires Blockbench ${MIN_BLOCKBENCH_VERSION} or higher. Learn about GeckoLib here: https://github.com/bernie-g/geckolib`,
    icon: "movie_filter",
    version,
    min_version: MIN_BLOCKBENCH_VERSION,
    variant: "both",
    onload() {
      loadCodec();
      loadAnimationUI();
      loadKeyframeOverrides();

      exportAction = new Action({
        id: "export_animated_entity_model",
        name: "Export Animated Java Entity",
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

      button = new Action('gecko_settings', {
        name: 'Animated Entity Settings...',
        description: 'Customize animated entity export.',
        icon: 'info',
        condition: () => Format.id === "animated_entity_model",
        click: function () {
          var dialog = new Dialog({
            id: 'project',
            title: 'Animated Entity Settings',
            width: 540,
            lines: [`<b class="tl"><a href="https://github.com/bernie-g/geckolib">GeckoLib</a> Animation Utils v${version}</b>`],
            form: {
              modSDK: {label: 'Modding SDK', type: 'select', default: geckoSettings.modSDK, options: MOD_SDK_OPTIONS},
              entityType: {label: 'Entity Type', value: geckoSettings.entityType },
              javaPackage: {label: 'Java Package', value: geckoSettings.javaPackage},
              animFileNamespace: {label: 'Animation File Namespace', value: geckoSettings.animFileNamespace},
              animFilePath: {label: 'Animation File Path', value: geckoSettings.animFilePath},
            },
            onConfirm: function(formResult) {
              Object.assign(geckoSettings, formResult);
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
      button.delete();
      unloadKeyframeOverrides();
      unloadAnimationUI();
      unloadCodec();
      removeMonkeypatches();
      console.clear(); // eslint-disable-line no-console
    },
  });
})();
