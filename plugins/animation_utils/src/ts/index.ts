import semverCoerce from 'semver/functions/coerce';
import semverSatisfies from 'semver/functions/satisfies';
import packageJson from '../package.json';
import { loadAnimationUI, unloadAnimationUI } from './animationUi';
import {hasModelDisplaySettings, isEmpty, isGeckoLibModel, isValidNamespace, make} from './utils';
import { loadKeyframeOverrides, unloadKeyframeOverrides } from './keyframe';
import codec, {buildDisplaySettingsJson, format} from './codec';
import {
    GeckoFilepathCache,
    GECKOLIB_MODEL_ID,
    GeckoModelType, PROPERTY_FILEPATH_CACHE, PROPERTY_MODEL_TYPE, PROPERTY_MODID,
    SETTING_ALWAYS_SHOW_DISPLAY, SETTING_AUTO_PARTICLE_TEXTURE, SETTING_CONVERT_BEDROCK_ANIMATIONS,
    SETTING_DEFAULT_MODID,
    SETTING_REMEMBER_EXPORT_LOCATIONS,
} from "./constants";
import {addEventListeners, removeEventListeners} from "./events";

const { version, blockbenchConfig } = packageJson;

const SUPPORTED_BB_VERSION_RANGE = `${blockbenchConfig.min_version} - ${blockbenchConfig.max_version}`;

if (!semverSatisfies(semverCoerce(Blockbench.version), SUPPORTED_BB_VERSION_RANGE))
  alert(`GeckoLib Animation Utils currently only supports Blockbench ${SUPPORTED_BB_VERSION_RANGE}. Please ensure you are using this version of Blockbench to avoid bugs and undefined behavior.`);

// Register the plugin and define what it adds
(function () {
  let pluginSettings: Setting[];
  let pluginProperties: Property[];
  let pluginMenuItems: { action: Action, menuCategory: string }[];

  BBPlugin.register("animation_utils", Object.assign(
      {},
      blockbenchConfig as typeof blockbenchConfig & { variant: 'both' },
      {
        name: blockbenchConfig.title,
        version,
        await_loading: true,
        onload() {
          addEventListeners();
          loadAnimationUI();
          loadKeyframeOverrides();

          pluginSettings = createPluginSettings();
          pluginProperties = createPluginProperties();
          pluginMenuItems = createPluginMenuItems();

          for (const menuItem of pluginMenuItems as { action: Action, menuCategory: string }[]) {
            MenuBar.addAction(menuItem.action, menuItem.menuCategory);
          }

          console.log("Loaded GeckoLib plugin")
        },
        onunload() {
          for (const setting of pluginSettings) {
            setting.delete();
          }

          for (const property of pluginProperties) {
            property.delete();
          }

          for (const menuItem of pluginMenuItems) {
            menuItem.action.delete();
          }

          unloadKeyframeOverrides();
          unloadAnimationUI();
          removeEventListeners()
          format.delete();
          console.clear();
        },
      }
  ));
})();

/**
 * Create and return the plugin's settings.
 * <p>
 * These are found in the Settings panel in the plugin info window
 */
function createPluginSettings(): Setting[] {
  return [
    new Setting(SETTING_AUTO_PARTICLE_TEXTURE, {
      value: true,
      category: "export",
      name: "Auto-compute block/item particle texture",
      description: "Attempt to auto-compute the particle texture for a GeckoLib block/item model if one isn't already specified when exporting the display settings json"
    }),
    new Setting(SETTING_CONVERT_BEDROCK_ANIMATIONS, {
      value: true,
      category: "export",
      name: "Convert bedrock animations on export",
      description: "Automatically convert bedrock-format animations to GeckoLib-compatible animations when exporting, if relevant. May have a performance improvement on larger projects"
    }),
    new Setting(SETTING_ALWAYS_SHOW_DISPLAY, {
      value: false,
      category: "edit",
      name: "Always show display tab",
      description: "Force the Display tab to always show, even when not an Item type model"
    }),
    new Setting(SETTING_REMEMBER_EXPORT_LOCATIONS, {
      value: true,
      category: "export",
      name: "Remember file export locations",
      description: "Remember where you export model/display/animation files to for re-use. Stores the file paths in the bbmodel project file."
    }),
    make(
        new Setting(SETTING_DEFAULT_MODID, {
          // The below is absolutely disgusting, but I have no choice because this is a bug in Blockbench's API
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          type: 'text',
          value: "",
          category: "export",
          name: "Default Mod ID",
          description: "Default Mod ID for models (if applicable)"
        }),
        setting => {
          setting.onChange = function() {
            const invalidNamespaceChar = new RegExp('[^_\\-.a-z0-9]+', 'g')
            const pseudoWhitepaceChar = new RegExp('[\\s&-]+', 'g')

            this.master_value = this.master_value.toLowerCase().replace(pseudoWhitepaceChar, "_").replace(invalidNamespaceChar, "")

            return {};
          }
        }
    )
  ];
}

/**
 * Create and return the plugin's properties.
 * <p>
 * These are metadata values stored in the project, usually used in project settings windows
 */
function createPluginProperties(): Property[] {
  return [
      make(
          new Property(ModelProject, "string", PROPERTY_MODID, {
              label: "Mod ID",
              condition: {
                  formats: [GECKOLIB_MODEL_ID]
              },
              values: [],
              merge_validation: isValidNamespace
          }),
          property => {
            property['placeholder'] = 'my_modid';
            property['description'] = 'The modid of the mod this model is for';
            property.getDefault = function() {
              return settings[SETTING_DEFAULT_MODID].value;
            };
          }
      ),
      make(
          new Property(ModelProject, "enum", PROPERTY_MODEL_TYPE, {
              label: "Model Type",
              condition: {
                  formats: [GECKOLIB_MODEL_ID]
              },
              exposed: false,
              options: GeckoModelType,
              values: Object.values(GeckoModelType)
          }),
          property => {
            property['description'] = 'The type of GeckoLib object this model is for. Leave as the default value if unsure';
          }
      ),
      make(
          new Property(ModelProject, "instance", PROPERTY_FILEPATH_CACHE, {
              label: "GeckoLib Filepath Cache",
              condition: {
                  formats: [GECKOLIB_MODEL_ID]
              },
              exposed: false,
              values: []
          }),
          property => {
              property.default = {} as GeckoFilepathCache;
          }
      )
  ];
}

/**
 * Create and return the plugin's menu items
 * <p>
 * These are added to Blockbench's menu bar or submenus
 */
function createPluginMenuItems(): { action: Action, menuCategory: string }[] {
  return [
    {
      action: new Action("export_geckolib_model", {
        name: "Export GeckoLib Model",
        icon: "archive",
        description: "Export your model geometry as a model for GeckoLib.",
        category: "file",
        condition: () => isGeckoLibModel(),
        click: function () {
          codec.export();
        },
      }),
      menuCategory: 'file.export'
    },
    {
      action: new Action("export_geckolib_display", {
        name: "Export GeckoLib Display Settings",
        icon: "icon-bb_interface",
        description: "Export your item/block display settings for GeckoLib.",
        category: "file",
        condition: () => isGeckoLibModel() && hasModelDisplaySettings(),
        click: buildDisplaySettingsJson,
      }),
      menuCategory: 'file.export'
    },
    {
      action: new Action("export_geckolib_animations", {
        name: "Export GeckoLib Animations",
        icon: "movie",
        description: "Export your model animations for GeckoLib.",
        category: "file",
        condition: () => isGeckoLibModel() && !isEmpty(AnimationItem.all) && typeof BarItems['export_animation_file'] === 'object',
        click: e => (BarItems['export_animation_file'] as Action).trigger(e),
      }),
      menuCategory: 'file.export'
    }
  ];
}
