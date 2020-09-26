import omit from 'lodash/omit';
import geckoSettings, { MOD_SDK_1_15_FABRIC, MOD_SDK_1_15_FORGE, GECKO_SETTINGS_DEFAULT, onSettingsChanged } from './settings';
import { Original, addMonkeypatch } from './utils';

/* eslint-disable no-useless-escape */
//#region Codec Helpers / Export Settings

export function loadCodec() {
  // The actual Codec is automatically registered by superclass constructor
  Codecs.project.on('compile', onProjectCompile);
  Codecs.project.on('parse', onProjectParse);
  Codecs.bedrock.on('compile', onBedrockCompile);
  addMonkeypatch(Animator, null, "buildFile", animatorBuildFile);
  addMonkeypatch(Animator, null, "loadFile", animatorLoadFile);
}

export function unloadCodec() {
  Codecs.project.events.compile.remove(onProjectCompile)
  Codecs.project.events.parse.remove(onProjectParse)
  Codecs.bedrock.events.compile.remove(onBedrockCompile)
  format.delete();
}

function onProjectCompile(e) {
  if (Format.id !== "animated_entity_model") return;
  e.model.geckoSettings = geckoSettings;
  // console.log(`compileCallback model:`, e.model);
}

function onProjectParse(e) {
  // console.log(`onProjectParse:`, e);
  if (e.model && typeof e.model.geckoSettings === 'object') {
    Object.assign(geckoSettings, omit(e.model.geckoSettings, ['formatVersion']));
  } else {
    Object.assign(geckoSettings, GECKO_SETTINGS_DEFAULT);
  }
  onSettingsChanged();
}

function onBedrockCompile(e) {
  console.log('onBedrockCompile e:', e);
  maybeExportItemJson(e.options);
}

function animatorBuildFile() {
  const res = Original.get(Animator).buildFile.apply(this, arguments);
  Object.assign(
    res,
    {
      'geckolib_format_version': geckoSettings.formatVersion,
    }
  );
  // console.log('animatorBuildFile res:', res);
  return res;
}

function animatorLoadFile() {
  // Currently no modifications are needed
  return Original.get(Animator).loadFile.apply(this, arguments);
}

//#endregion Codec Helpers / Export Settings

//#region Codec / ModelFormat
function maybeExportItemJson(options = {}, as) {
  function checkExport(key, condition) {
    key = options[key]
    if (key === undefined) {
      return condition;
    } else {
      return key
    }
  }
  const blockmodel = {}
  if (checkExport('comment', settings.credit.value)) {
    blockmodel.credit = settings.credit.value
  }
  if (checkExport('parent', Project.parent != '')) {
    blockmodel.parent = Project.parent
  }
  if (checkExport('ambientocclusion', Project.ambientocclusion === false)) {
    blockmodel.ambientocclusion = false
  }
  if (Project.texture_width !== 16 || Project.texture_height !== 16) {
    blockmodel.texture_size = [Project.texture_width, Project.texture_height]
  }
  if (checkExport('front_gui_light', Project.front_gui_light)) {
    blockmodel.gui_light = 'front';
  }
  if (checkExport('overrides', Project.overrides)) {
    blockmodel.overrides = Project.overrides;
  }
  if (checkExport('display', Object.keys(display).length >= 1)) {
    var new_display = {}
    var entries = 0;
    for (var i in DisplayMode.slots) {
      var key = DisplayMode.slots[i]
      if (Object.prototype.hasOwnProperty.call(DisplayMode.slots, i) && display[key] && display[key].export) {
        new_display[key] = display[key].export()
        entries++;
      }
    }
    if (entries) {
      blockmodel.display = new_display
    }
  }
  
  const blockmodelString = JSON.stringify(blockmodel, null, 2);

  var scope = codec;

  let path = geckoSettings.itemModelPath;
  // regular export
  if (isApp && !path) {
    path = (scope.startPath() || ModelMeta.export_path).replace(".geo", ".item");
  }
  Blockbench.export({
    resource_id: 'model',
    type: Codecs.java_block.name,
    extensions: ['json'],
    name: scope.fileName().replace(".geo", ".item"),
    startpath: path,
    content: blockmodelString,
  }, (real_path) => {
    geckoSettings.itemModelPath = real_path;
  });

  return this;
}

var codec = Codecs.bedrock;

var format = new ModelFormat({
  id: "animated_entity_model",
  name: "GeckoLib Animated Model",
  description: "Animated Model for Java mods using GeckoLib",
  icon: "icon-format_java",
	rotate_cubes: true,
	box_uv: true,
	optional_box_uv: true,
	single_texture: true,
	bone_rig: true,
	centered_grid: true,
	animated_textures: true,
	animation_mode: true,
	locators: true,
  codec: Codecs.project, // This sets what codec is used for File -> Save. We want to use bbmodel.
  display_mode: false, // This may be dynamically turned on by settings
	onActivation: function () {
	}
})

//Object.defineProperty(format, 'integer_size', {get: _ => Templates.get('integer_size')})
// codec.format = format; // This sets the default format for the codec

export default codec; // This is used for plugin "Export Animated Model" menu item

//#endregion Codec / ModelFormat