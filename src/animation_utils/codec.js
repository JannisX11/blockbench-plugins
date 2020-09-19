import omit from 'lodash/omit';
import geckoSettings, { MOD_SDK_1_15_FABRIC, MOD_SDK_1_15_FORGE, GECKO_SETTINGS_DEFAULT, onSettingsChanged } from './settings';
import { Original, addMonkeypatch } from './utils';

/* eslint-disable no-useless-escape */
//#region Codec Helpers / Export Settings

export function loadCodec() {
  // The actual Codec is automatically registered by superclass constructor
  Codecs.project.on('compile', compileCallback);
  Codecs.project.on('parse', parseCallback);
  addMonkeypatch(Animator, null, "buildFile", animatorBuildFile);
  addMonkeypatch(Animator, null, "loadFile", animatorLoadFile);
}

export function unloadCodec() {
  Codecs.project.events.compile.remove(compileCallback)
  Codecs.project.events.parse.remove(parseCallback)
}

function compileCallback(e) {
  if (Format.id !== "animated_entity_model") return;
  e.model.geckoSettings = geckoSettings;
  // console.log(`compileCallback model:`, e.model);
}

function parseCallback(e) {
  console.log(`parseCallback:`, e);
  if (e.model && typeof e.model.geckoSettings === 'object') {
    Object.assign(geckoSettings, omit(e.model.geckoSettings, ['formatVersion']));
  } else {
    Object.assign(geckoSettings, GECKO_SETTINGS_DEFAULT);
  }
  onSettingsChanged();
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

const getImports = () => {
  switch(geckoSettings.modSDK) {
    case MOD_SDK_1_15_FORGE:
      return `import net.minecraft.util.ResourceLocation;
import software.bernie.geckolib.animation.model.AnimatedEntityModel;
import software.bernie.geckolib.animation.render.AnimatedModelRenderer;`;
    case MOD_SDK_1_15_FABRIC:
      return `import software.bernie.geckolib.forgetofabric.ResourceLocation;
import software.bernie.geckolib.animation.model.AnimatedEntityModel;
import software.bernie.geckolib.animation.render.AnimatedModelRenderer;`;
    default:
      throw new Error(`Unrecognized mod SDK:`, geckoSettings.modSDK);
  }
};

function F(num) {
  var s = window.trimFloatNumber(num) + "";
  if (!s.includes(".")) {
    s += ".0";
  }
  return s + "F";
}

function I(num) {
  return Math.floor(num);
}

//#endregion Codec Helpers / Export Settings

//#region Codec / ModelFormat
const Templates = {
  "1.15": {
    name: "1.15",
    flip_y: true,
    integer_size: false,
    file: `// Made with Blockbench %(bb_version)
// Exported for Minecraft version 1.12.2 or 1.15.2 (same format for both) for entity models animated with GeckoLib
// Paste this class into your mod and follow the documentation for GeckoLib to use animations. You can find the documentation here: https://github.com/bernie-g/geckolib
// Blockbench plugin created by Gecko
package %(javaPackage);

%(imports)

public class %(identifier) extends AnimatedEntityModel<%(entityType)> {

  %(fields)

  public %(identifier)()
  {
      textureWidth = %(texture_width);
  textureHeight = %(texture_height);
  %(content)

  %(renderers)
}


  @Override
  public ResourceLocation getAnimationFileLocation()
  {
      return new ResourceLocation("%(animFileNamespace)", "%(animFilePath)");
  }
}`,
    field: `private final AnimatedModelRenderer %(bone);`,

    bone: `%(bone) = new AnimatedModelRenderer(this);
%(bone).setRotationPoint(%(x), %(y), %(z));
?(has_parent)%(parent).addChild(%(bone));
?(has_rotation)setRotationAngle(%(bone), %(rx), %(ry), %(rz));
%(cubes)
%(bone).setModelRendererName(\"%(bone)\");
this.registerModelRenderer(%(bone));`,
    renderer: `this.rootBones.add(%(bone));`,
    cube: `%(bone).setTextureOffset(%(uv_x), %(uv_y)).addBox(%(x), %(y), %(z), %(dx), %(dy), %(dz), %(inflate), %(mirror));`,
  },

  get(key, version = Project.modded_entity_version) {
    let temp = Templates[version][key];
    if (typeof temp === "string") temp = temp.replace(/\t\t\t/g, "");
    return temp;
  },
  keepLine(line) {
    return line.replace(/\?\(\w+\)/, "");
  },
  getVariableRegex(name) {
    return new RegExp(`%\\(${name}\\)`, "g");
  },
};

function getIdentifier() {
  return (
    Project.geometry_name.replace(/[\s-]+/g, "_") ||
    "animated_entity_model"
  );
}

const codec = new Codec("animated_entity_model", {
  name: "Animated Java Class",
  extension: "java",
  remember: true,
  compile(options = {}) {
    let R = Templates.getVariableRegex;
    let identifier = getIdentifier();

    let all_groups = window.getAllGroups();
    let loose_cubes = [];
    Cube.all.forEach((cube) => {
      if (cube.parent == "root") loose_cubes.push(cube);
    });
    if (loose_cubes.length) {
      all_groups.push({
        name: "bb_main",
        rotation: [0, 0, 0],
        origin: [0, 0, 0],
        parent: "root",
        children: loose_cubes,
      });
    }

    let model = Templates.get("file");

    model = model.replace(R("bb_version"), Blockbench.version);

    model = model.replace(R("javaPackage"), geckoSettings.javaPackage);
    model = model.replace(R("imports"), getImports());

    model = model.replace(R("identifier"), identifier);
    model = model.replace(R("entityType"), geckoSettings.entityType);

    model = model.replace(R("texture_width"), Project.texture_width);
    model = model.replace(R("texture_height"), Project.texture_height);

    model = model.replace(R("animFileNamespace"), geckoSettings.animFileNamespace);
    model = model.replace(R("animFilePath"), geckoSettings.animFilePath);

    model = model.replace(R("fields"), () => {
      let group_snippets = [];
      for (const group of all_groups) {
        if (group instanceof Group === false || !group.export)
          continue;
        let snippet = Templates.get("field").replace(
          R("bone"),
          group.name
        );
        group_snippets.push(snippet);
      }
      return group_snippets.join("\n\t");
    });

    model = model.replace(R("content"), () => {
      let group_snippets = [];
      for (const group of all_groups) {
        if (group instanceof Group === false || !group.export)
          continue;
        let snippet = Templates.get("bone")

          .replace(R("bone"), group.name)

          .replace(
            /\n\?\(has_rotation\).+/,
            group.rotation.allEqual(0) ? "" : Templates.keepLine
          );

        snippet = snippet
          .replace(R("rx"), F(Math.degToRad(-group.rotation[0])))
          .replace(R("ry"), F(Math.degToRad(-group.rotation[1])))
          .replace(R("rz"), F(Math.degToRad(group.rotation[2])));

        var origin = group.origin.slice();
        if (group.parent instanceof Group) {
          origin.V3_subtract(group.parent.origin);
        }
        origin[0] *= -1;
        if (Templates.get("flip_y")) {
          origin[1] *= -1;
          if (group.parent instanceof Group === false) {
            origin[1] += 24;
          }
        }

        snippet = snippet
          .replace(R("x"), F(origin[0]))
          .replace(R("y"), F(origin[1]))
          .replace(R("z"), F(origin[2]))

          .replace(
            /\n\?\(has_parent\).+/,
            group.parent instanceof Group
              ? Templates.keepLine
              : ""
          )
          .replace(R("parent"), group.parent.name)

          .replace(R("cubes"), () => {
            let cube_snippets = [];
            for (var cube of group.children) {
              if (
                cube instanceof Cube === false ||
                !cube.export
              )
                continue;

              let c_snippet = Templates.get("cube")
                .replace(R("bone"), group.name)

                .replace(R("uv_x"), I(cube.uv_offset[0]))
                .replace(R("uv_y"), I(cube.uv_offset[1]))

                .replace(R("inflate"), F(cube.inflate))
                .replace(R("mirror"), cube.mirror_uv);

              if (Templates.get("flip_y")) {
                c_snippet = c_snippet
                  .replace(
                    R("x"),
                    F(group.origin[0] - cube.to[0])
                  )
                  .replace(
                    R("y"),
                    F(
                      -cube.from[1] -
                        cube.size(1) +
                        group.origin[1]
                    )
                  )
                  .replace(
                    R("z"),
                    F(cube.from[2] - group.origin[2])
                  );
              } else {
                c_snippet = c_snippet
                  .replace(
                    R("x"),
                    F(group.origin[0] - cube.to[0])
                  )
                  .replace(
                    R("y"),
                    F(cube.from[1] - group.origin[1])
                  )
                  .replace(
                    R("z"),
                    F(cube.from[2] - group.origin[2])
                  );
              }
              if (Templates.get("integer_size")) {
                c_snippet = c_snippet
                  .replace(R("dx"), I(cube.size(0, true)))
                  .replace(R("dy"), I(cube.size(1, true)))
                  .replace(
                    R("dz"),
                    I(cube.size(2, true))
                  );
              } else {
                c_snippet = c_snippet
                  .replace(R("dx"), F(cube.size(0, true)))
                  .replace(R("dy"), F(cube.size(1, true)))
                  .replace(
                    R("dz"),
                    F(cube.size(2, true))
                  );
              }

              cube_snippets.push(c_snippet);
            }
            return cube_snippets.join("\n");
          })
          .replace(/\n/g, "\n\t\t");

        group_snippets.push(snippet);
      }
      return group_snippets.join("\n\n\t\t");
    });

    model = model.replace(R("renderers"), () => {
      let group_snippets = [];
      for (const group of all_groups) {
        if (group instanceof Group === false || !group.export)
          continue;
        if (
          !Templates.get("render_subgroups") &&
          group.parent instanceof Group
        )
          continue;

        let snippet = Templates.get("renderer").replace(
          R("bone"),
          group.name
        );
        group_snippets.push(snippet);
      }
      return group_snippets.join("\n\t\t");
    });

    maybeExportItemJson.bind(this, options)();

    this.dispatchEvent("compile", { model, options });
    return model;
  },
  // eslint-disable-next-line no-unused-vars
  parse(model, path, add) {
    alert("Loading animated models from .java files is not supported. Please use 'Save Project' to keep your work as a .bbmodel file and then export to Java when needed.");
  },
  fileName() {
    return getIdentifier();
  },
});
codec.templates = Templates;

function maybeExportItemJson(options, as) {
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
      if (DisplayMode.slots.hasOwnProperty(i) && display[key] && display[key].export) {
        new_display[key] = display[key].export()
        entries++;
      }
    }
    if (entries) {
      blockmodel.display = new_display
    }
  }
  
  const blockmodelString = JSON.stringify(blockmodel, null, 2);

  var scope = this; // Dear god why is this needed

  let path = geckoSettings.itemModelPath;
  // regular export
  if (isApp && !path) {
    path = (scope.startPath() || ModelMeta.export_path).replace(".java", ".json");
  }
  Blockbench.export({
    resource_id: 'model',
    type: Codecs.java_block.name,
    extensions: ['json'],
    name: scope.fileName(),
    startpath: path,
    content: blockmodelString,
  }, (real_path) => {
    geckoSettings.itemModelPath = real_path;
  });

  return this;
}

const format = new ModelFormat({
  id: "animated_entity_model",
  name: "Animated Java Entity",
  description: "Animated Entity for Java mods using GeckoLib",
  icon: "icon-format_java",
  codec,
  box_uv: true,
  single_texture: true,
  bone_rig: true,
  centered_grid: true,
  integer_size: true,
  animation_mode: true,
  display_mode: false, // This may be dynamically turned on by settings
});
//Object.defineProperty(format, 'integer_size', {get: _ => Templates.get('integer_size')})
codec.format = format;

export default codec;

//#endregion Codec / ModelFormat