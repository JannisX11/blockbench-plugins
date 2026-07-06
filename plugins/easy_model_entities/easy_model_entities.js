/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 833
(module, __unused_webpack_exports, __webpack_require__) {

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

const {Validator} = __webpack_require__(229);

class BlockbenchAdapter {
  static PROJECT_PROPERTY = 'eme_export';

  static #base64ToBytes(base64) {
    const clean = String(base64).replace(/^data:[^,]*,/, '');
    const binary =
        typeof atob === 'function' ? atob(clean) : Buffer.from(clean,
            'base64').toString('binary');
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.codePointAt(i) & 0xff;
    }

    return bytes;
  }

  static #firstTexture() {
    if (typeof Texture === 'undefined') {
      return null;
    }

    return Texture.getDefault?.() || Texture.all?.[0] || null;
  }

  static #textureIndex(texture, position) {
    const id = parseInt(texture?.id, 10);

    return Number.isInteger(id) && id >= 0 ? id : position;
  }

  static collectTextures() {
    if (typeof Texture === 'undefined' || !Texture.all) {
      return [];
    }

    return Texture.all.map((texture, position) => ({
      index: BlockbenchAdapter.#textureIndex(texture, position),
      name: texture.name || '',
      namespace: texture.namespace || '',
      folder: texture.folder || '',
      path: texture.path || '',
      bytes: BlockbenchAdapter.#base64ToBytes(texture.getBase64())
    }));
  }

  static #isNumericValue(value) {
    if (typeof value === 'number') {
      return Number.isFinite(value);
    }

    return typeof value === 'string' && value.trim() !== ''
        && Number.isFinite(Number(value));
  }

  static #summarizeAnimation(animation) {
    const channels = new Set();
    let hasExpression = false;

    Object.values(animation.animators || {}).forEach((animator) => {
      (animator.keyframes || []).forEach((keyframe) => {
        if (keyframe.channel) {
          channels.add(keyframe.channel);
        }
        (keyframe.data_points || []).forEach((point) => {
          ['x', 'y', 'z'].forEach((axis) => {
            const value = point?.[axis];
            if (value !== undefined && value !== null
                && !BlockbenchAdapter.#isNumericValue(value)) {
              hasExpression = true;
            }
          });
        });
      });
    });

    return {
      name: animation.name || '',
      channels: [...channels],
      hasExpression: hasExpression
    };
  }

  static getModelStats() {
    const cubes = typeof Cube !== 'undefined' && Cube.all ? Cube.all : [];
    const groups = typeof Group !== 'undefined' && Group.all ? Group.all : [];
    const animations =
        typeof Animation !== 'undefined' && Animation.all ? Animation.all : [];
    const texture = BlockbenchAdapter.#firstTexture();

    let maxDepth = 0;
    groups.forEach((group) => {
      let depth = 1;
      let parent = group.parent;
      while (parent && parent !== 'root' && typeof parent === 'object') {
        depth += 1;
        parent = parent.parent;
      }
      if (depth > maxDepth) {
        maxDepth = depth;
      }
    });

    return {
      hasModel: cubes.length > 0 || groups.length > 0,
      hasTexture: !!texture,
      cubeCount: cubes.length,
      boneCount: groups.length,
      animationCount: animations.length,
      animations: animations.map(
          (animation) => BlockbenchAdapter.#summarizeAnimation(animation)),
      hierarchyDepth: maxDepth,
      boneNames: groups.map((group) => group.name),
      textureWidth: texture ? texture.width : undefined,
      textureHeight: texture ? texture.height : undefined
    };
  }

  static getModelBytes() {
    return Codecs.project.compile({raw: false});
  }

  static getModelBounds() {
    const cubes = typeof Cube !== 'undefined' && Cube.all ? Cube.all : [];
    if (cubes.length === 0) {
      return null;
    }

    const bounds = {
      minX: Infinity,
      minY: Infinity,
      minZ: Infinity,
      maxX: -Infinity,
      maxY: -Infinity,
      maxZ: -Infinity
    };
    cubes.forEach((cube) => {
      const from = cube.from || [0, 0, 0];
      const to = cube.to || [0, 0, 0];
      bounds.minX = Math.min(bounds.minX, from[0], to[0]);
      bounds.minY = Math.min(bounds.minY, from[1], to[1]);
      bounds.minZ = Math.min(bounds.minZ, from[2], to[2]);
      bounds.maxX = Math.max(bounds.maxX, from[0], to[0]);
      bounds.maxY = Math.max(bounds.maxY, from[1], to[1]);
      bounds.maxZ = Math.max(bounds.maxZ, from[2], to[2]);
    });

    return bounds;
  }

  static getModelCubes() {
    const cubes = typeof Cube !== 'undefined' && Cube.all ? Cube.all : [];

    return cubes.map((cube) => ({
      from: (cube.from || [0, 0, 0]).slice(),
      to: (cube.to || [0, 0, 0]).slice()
    }));
  }

  static getProjectName() {
    if (typeof Project === 'undefined' || !Project) {
      return '';
    }

    if (Project.geometry_name) {
      return Project.geometry_name;
    }

    if (Project.name) {
      return Project.name;
    }

    if (typeof Project.getDisplayName === 'function') {
      return Project.getDisplayName(false);
    }
    return '';
  }

  static loadSettings() {
    if (typeof Project === 'undefined' || !Project) {
      return null;
    }

    const stored = Project[BlockbenchAdapter.PROJECT_PROPERTY];
    if (stored && typeof stored === 'object') {
      return structuredClone(stored);
    }

    return null;
  }

  static saveSettings(settings) {
    if (typeof Project !== 'undefined' && Project) {
      Project[BlockbenchAdapter.PROJECT_PROPERTY] = structuredClone(
          settings);
      if (typeof Blockbench !== 'undefined' && Blockbench.dispatchEvent) {
        Blockbench.dispatchEvent('eme_settings_saved', {settings});
      }
    }
  }

  static #zipToUint8(files) {
    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.path, file.content);
    });

    return zip.generateAsync({type: 'uint8array'});
  }

  static exportPackBundle(bundle, name) {
    return Promise.all([
      BlockbenchAdapter.#zipToUint8(bundle.datapack),
      BlockbenchAdapter.#zipToUint8(bundle.resourcepack)
    ]).then(([datapackZip, resourcepackZip]) => {
      const outer = new JSZip();
      outer.file(bundle.readme.path, bundle.readme.content);
      outer.file(bundle.datapackFileName || 'datapack.zip', datapackZip);
      outer.file(bundle.resourcepackFileName || 'resourcepack.zip',
          resourcepackZip);
      return outer.generateAsync({type: 'blob'});
    }).then((content) => {
      return new Promise((resolve) => {
        Blockbench.export(
            {
              type: 'Zip Archive',
              extensions: ['zip'],
              name: name,
              content: content,
              savetype: 'zip'
            },
            (path) => resolve(path)
        );
      });
    });
  }

  static listExistingFiles(rootDir, files) {
    const fs = __webpack_require__(896);
    const path = __webpack_require__(928);

    return files
    .map((file) => path.join(rootDir, file.path))
    .filter((fullPath) => fs.existsSync(fullPath));
  }

  static writeToDirectory(rootDir, files) {
    const fs = __webpack_require__(896);
    const path = __webpack_require__(928);
    files.forEach((file) => {
      const result = Validator.validateOutputPath(rootDir, file.path);
      if (!result.valid) {
        throw new Error(`${result.code}: ${result.message} (${file.path})`);
      }
      const fullPath = path.join(rootDir, file.path);
      fs.mkdirSync(path.dirname(fullPath), {recursive: true});
      const data =
          file.binary && file.content instanceof Uint8Array ? Buffer.from(
              file.content) : file.content;
      fs.writeFileSync(fullPath, data);
    });
  }

  static pickDirectory(title) {
    return Blockbench.pickDirectory(
        {title: title, resource_id: 'eme_mod_project'});
  }
}

module.exports = {BlockbenchAdapter};


/***/ },

/***/ 869
(module, __unused_webpack_exports, __webpack_require__) {

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

const {buildServerProfile} = __webpack_require__(790);
const {buildRenderProfile} = __webpack_require__(255);
const {buildDataPackMcmeta, buildResourcePackMcmeta} = __webpack_require__(600);
const {buildReadme} = __webpack_require__(250);
const {hashString} = __webpack_require__(803);

function toJson(value) {
  return JSON.stringify(value, null, 2) + '\n';
}

// The version stamp is a content hash of the server profile, i.e. of exactly
// the server-relevant settings (type, preset, dimensions, behavior, …) and not
// of the model geometry or textures. Both profiles receive the same stamp so
// the mod's server/client parity check always matches; it only changes when a
// server-relevant setting changes. Model-only exports have no server profile
// and stay version-less (the mod's own runtime contract owns the version).
function stampVersion(serverProfile, renderProfile) {
  if (!serverProfile) {
    return;
  }

  const version = hashString(toJson(serverProfile));
  serverProfile.version = version;
  renderProfile.version = version;
}

function buildProfiles(settings, textureResolution) {
  const serverProfile = buildServerProfile(settings);
  const renderProfile = buildRenderProfile(settings, textureResolution);
  stampVersion(serverProfile, renderProfile);

  return {serverProfile, renderProfile};
}

function dataPaths(settings) {
  const namespace = settings.namespace;
  const id = settings.profileId;
  const modelType = settings.modelType || 'entity';

  return {
    profile: `data/${namespace}/easy_model_entities/profiles/${modelType}/${id}.json`,
    renderProfile:
        `assets/${namespace}/easy_model_entities/render_profiles/${modelType}/${id}.json`,
    model: `assets/${namespace}/easy_model_entities/models/${id}.bbmodel`
  };
}

function textureFiles(settings, textureResolution) {
  const namespace = settings.namespace;
  const packed = (textureResolution && textureResolution.packed) || [];

  return packed.map((entry) => ({
    path: `assets/${namespace}/textures/entity/${entry.fileName}`,
    content: entry.bytes,
    binary: true
  }));
}

function datapackFiles(settings, serverProfile) {
  return [
    {
      path: 'pack.mcmeta', content: toJson(buildDataPackMcmeta(settings)),
      binary: false
    },
    {
      path: dataPaths(settings).profile, content: toJson(serverProfile),
      binary: false
    }
  ];
}

function resourcepackFiles(settings, renderProfile, options) {
  const paths = dataPaths(settings);
  return [
    {
      path: 'pack.mcmeta', content: toJson(buildResourcePackMcmeta(settings)),
      binary: false
    },
    {path: paths.renderProfile, content: toJson(renderProfile), binary: false},
    {path: paths.model, content: options.modelBytes, binary: true},
    ...textureFiles(settings, options.textureResolution)
  ];
}

function packFileNames(settings) {
  return {
    datapack: `${settings.profileId}_datapack.zip`,
    resourcepack: `${settings.profileId}_resourcepack.zip`
  };
}

function buildPackBundle(settings, options) {
  const opts = options || {};
  const {serverProfile, renderProfile} = buildProfiles(settings,
      opts.textureResolution);
  const fileNames = packFileNames(settings);

  return {
    readme: {
      path: 'README.md', content: buildReadme(settings, fileNames),
      binary: false
    },
    datapack: datapackFiles(settings, serverProfile),
    resourcepack: resourcepackFiles(settings, renderProfile, opts),
    datapackFileName: fileNames.datapack,
    resourcepackFileName: fileNames.resourcepack,
    serverProfile,
    renderProfile
  };
}

function buildModProjectFiles(settings, options) {
  const opts = options || {};
  const renderProfile = buildRenderProfile(settings, opts.textureResolution);
  const paths = dataPaths(settings);

  const files = [];
  const serverProfile = settings.modelOnly ? null : buildServerProfile(
      settings);
  stampVersion(serverProfile, renderProfile);
  if (serverProfile) {
    files.push({
      path: paths.profile, content: toJson(serverProfile),
      binary: false
    });
  }

  files.push(
      {
        path: paths.renderProfile, content: toJson(renderProfile),
        binary: false
      },
      {path: paths.model, content: opts.modelBytes, binary: true},
      ...textureFiles(settings, opts.textureResolution));

  return {files, serverProfile, renderProfile};
}

module.exports = {
  buildPackBundle,
  buildModProjectFiles
};


/***/ },

/***/ 600
(module, __unused_webpack_exports, __webpack_require__) {

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

const {getPackFormats} = __webpack_require__(954);

function buildPack(descriptor, description) {
  const pack = {pack_format: descriptor.packFormat};
  if (descriptor.minFormat) {
    pack.min_format = descriptor.minFormat;
  }
  if (descriptor.maxFormat) {
    pack.max_format = descriptor.maxFormat;
  }
  pack.description = description;

  return {pack};
}

function buildMcmeta(settings, kind, description) {
  const formats = getPackFormats(settings.targetVersion);
  if (!formats) {
    throw new Error(
        `Unsupported or disabled target version: ${settings.targetVersion}`);
  }
  return buildPack(formats[kind], description);
}

function buildDataPackMcmeta(settings) {
  return buildMcmeta(settings, 'data',
      'Easy Model Entities server profiles');
}

function buildResourcePackMcmeta(settings) {
  return buildMcmeta(settings, 'resource',
      'Easy Model Entities render assets');
}

module.exports = {buildDataPackMcmeta, buildResourcePackMcmeta};


/***/ },

/***/ 640
(module) {

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

// Helpers to emit minimal (diff-based) profiles: only values that deviate from
// the defaults the mod derives from preset_type are written.

function valuesDiffer(a, b) {
  if (Array.isArray(a) || Array.isArray(b)) {
    return JSON.stringify(a) !== JSON.stringify(b);
  }

  return a !== b;
}

function diffFlat(values, defaults) {
  const result = {};
  Object.keys(values).forEach((key) => {
    if (valuesDiffer(values[key], defaults[key])) {
      result[key] = values[key];
    }
  });

  return result;
}

function isEmpty(object) {
  return !object || Object.keys(object).length === 0;
}

function assignIfPresent(target, key, section) {
  if (!isEmpty(section)) {
    target[key] = section;
  }
}

module.exports = {diffFlat, assignIfPresent};


/***/ },

/***/ 250
(module, __unused_webpack_exports, __webpack_require__) {

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

const {ResourceLocation} = __webpack_require__(20);
const TEMPLATE = __webpack_require__(377);

function buildReadme(settings, fileNames) {
  const id = ResourceLocation.buildResourceLocation(settings.namespace,
      settings.profileId);
  const modelType = settings.modelType || 'entity';
  const serverProfileId = ResourceLocation.buildResourceLocation(
      settings.namespace, `${modelType}/${settings.profileId}`);
  const names = fileNames || {
    datapack: `${settings.profileId}_datapack.zip`,
    resourcepack: `${settings.profileId}_resourcepack.zip`
  };

  return TEMPLATE
  .replaceAll('{{id}}', id)
  .replaceAll('{{serverProfileId}}', serverProfileId)
  .replaceAll('{{mcVersion}}',
      `Minecraft: Java Edition ${settings.targetVersion}`)
  .replaceAll('{{folderName}}', `${settings.namespace}_eme`)
  .replaceAll('{{datapackFile}}', names.datapack)
  .replaceAll('{{resourcepackFile}}', names.resourcepack);
}

module.exports = {buildReadme};


/***/ },

/***/ 255
(module, __unused_webpack_exports, __webpack_require__) {

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
  bodyType,
  animationMode,
  defaultRenderingSettings,
  defaultAnimationSettings,
  isCustom,
  MODEL_TYPE_BLOCK_ENTITY
} = __webpack_require__(151);
const {diffFlat, assignIfPresent} = __webpack_require__(640);

function renderPresetType(settings) {
  return settings.modelType === MODEL_TYPE_BLOCK_ENTITY
      ? 'static' : settings.presetType;
}

function toRenderingJson(values) {
  return {
    scale: values.scale,
    shadow_radius: values.shadowRadius,
    visible_bounds_width: values.visibleBoundsWidth ?? 0,
    visible_bounds_height: values.visibleBoundsHeight ?? 0,
    visible_bounds_offset: values.visibleBoundsOffset || [0, 0, 0]
  };
}

function buildRendering(settings) {
  return diffFlat(toRenderingJson(settings.rendering),
      toRenderingJson(defaultRenderingSettings(renderPresetType(settings))));
}

function toAnimationJson(values) {
  return {
    mode: values.mode,
    swing_speed: values.swingSpeed,
    walk_speed_multiplier: values.walkSpeedMultiplier,
    idle_strength: values.idleStrength ?? 1,
    gait: values.gait || 'natural'
  };
}

function buildAnimation(settings) {
  const defaults = defaultAnimationSettings(
      animationMode(renderPresetType(settings)));
  const animation = diffFlat(toAnimationJson(settings.animation),
      toAnimationJson(defaults));

  if (settings.animation.mode === 'none') {
    delete animation.swing_speed;
    delete animation.walk_speed_multiplier;
    delete animation.idle_strength;
    delete animation.gait;
  }

  return animation;
}

function buildRenderProfile(settings, textureResolution) {
  const renderPreset = renderPresetType(settings);
  const custom = settings.modelType !== MODEL_TYPE_BLOCK_ENTITY
      && isCustom(settings.presetType);
  const profile = {
    schema_version: settings.schemaVersion,
    preset_type: renderPreset
  };

  if (custom || settings.host.bodyType !== bodyType(renderPreset)) {
    profile.body_type = settings.host.bodyType;
  }

  profile.model =
      `${settings.namespace}:easy_model_entities/models/${settings.profileId}`;

  if (textureResolution && textureResolution.texture) {
    profile.texture = textureResolution.texture;
  }
  assignIfPresent(profile, 'textures',
      textureResolution && textureResolution.textures);

  assignIfPresent(profile, 'rendering', buildRendering(settings));
  assignIfPresent(profile, 'animation', buildAnimation(settings));

  return profile;
}

module.exports = {
  buildRenderProfile
};


/***/ },

/***/ 790
(module, __unused_webpack_exports, __webpack_require__) {

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
  presetDefaults,
  presetDimensions,
  movementDefaults,
  behaviorModeFor,
  wandersByMovement,
  isCustom,
  DEFAULT_MAX_HEALTH,
  DEFAULT_FOLLOW_RANGE,
  MODEL_TYPE_BLOCK_ENTITY,
  MODEL_TYPE_ENTITY
} = __webpack_require__(151);
const {diffFlat, assignIfPresent} = __webpack_require__(640);

function effectiveDefaults(settings) {
  const preset = settings.presetType;
  const movementType = settings.host.movementType;
  const movement = movementDefaults(preset, movementType);
  const mode = behaviorModeFor(preset, movementType);

  return {
    movement: {
      speed: movement.speed,
      step_height: movement.stepHeight,
      gravity: movement.gravity
    },
    behavior: {
      mode: mode,
      look_at_players: mode === 'idle_only' || mode === 'ambient',
      random_stroll: wandersByMovement(movementType) && mode === 'ambient'
    },
    attributes: {
      max_health: DEFAULT_MAX_HEALTH,
      movement_speed: settings.movement.speed,
      follow_range: DEFAULT_FOLLOW_RANGE
    },
    dimensions: settings.modelType === MODEL_TYPE_BLOCK_ENTITY
        ? presetDefaults(preset, MODEL_TYPE_BLOCK_ENTITY).dimensions
        : presetDimensions(preset)
  };
}

function buildEntity(settings, custom) {
  if (!custom) {
    return {};
  }

  const host = settings.host;

  return {
    type: host.entityType,
    movement_type: host.movementType,
    body_type: host.bodyType
  };
}

function buildDimensions(settings, defaults, custom) {
  const values = {
    width: settings.dimensions.width,
    height: settings.dimensions.height,
    eye_height: settings.dimensions.eyeHeight
  };
  if (custom) {
    return values;
  }

  return diffFlat(values, {
    width: defaults.dimensions.width,
    height: defaults.dimensions.height,
    eye_height: defaults.dimensions.eyeHeight
  });
}

function buildServerProfile(settings) {
  const modelType = settings.modelType || MODEL_TYPE_ENTITY;
  const blockEntity = modelType === MODEL_TYPE_BLOCK_ENTITY;
  const custom = !blockEntity && isCustom(settings.presetType);
  const defaults = effectiveDefaults(settings);

  const profile = {
    schema_version: settings.schemaVersion,
    model_type: modelType,
    preset_type: settings.presetType
  };

  if (!blockEntity) {
    assignIfPresent(profile, 'entity', buildEntity(settings, custom));
  }

  assignIfPresent(profile, 'dimensions',
      buildDimensions(settings, defaults, custom));

  if (!blockEntity) {
    assignIfPresent(profile, 'movement', diffFlat({
      speed: settings.movement.speed,
      step_height: settings.movement.stepHeight,
      gravity: settings.movement.gravity
    }, defaults.movement));

    assignIfPresent(profile, 'behavior', diffFlat({
      mode: settings.behavior.mode,
      look_at_players: settings.behavior.lookAtPlayers,
      random_stroll: settings.behavior.randomStroll
    }, defaults.behavior));

    assignIfPresent(profile, 'attributes', diffFlat({
      max_health: settings.attributes.maxHealth,
      movement_speed: settings.attributes.movementSpeed,
      follow_range: settings.attributes.followRange
    }, defaults.attributes));
  }

  return profile;
}

module.exports = {buildServerProfile};


/***/ },

/***/ 670
(module, __unused_webpack_exports, __webpack_require__) {

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

const {BlockbenchAdapter} = __webpack_require__(833);
const {pickModelSettings} = __webpack_require__(668);
const {FORMAT_ID} = __webpack_require__(995);

const EME_SETTINGS_KEY = 'emeSettings';

function handleCompile(event) {
  if (Format?.id !== FORMAT_ID) {
    return;
  }

  const settings = BlockbenchAdapter.loadSettings();
  if (settings) {
    event.model[EME_SETTINGS_KEY] = pickModelSettings(settings);
  }
}

function handleParse(event) {
  const formatId = event.model?.meta?.model_format || event.model?.model_format;
  if (formatId !== FORMAT_ID) {
    return;
  }

  const settings = event.model[EME_SETTINGS_KEY];
  if (settings && typeof settings === 'object') {
    BlockbenchAdapter.saveSettings(settings);
  }
}

function registerEmeCodecHooks() {
  Codecs.project.on('compile', handleCompile);
  Codecs.project.on('parse', handleParse);
}

function unregisterEmeCodecHooks() {
  Codecs.project.events?.compile?.remove?.(handleCompile);
  Codecs.project.events?.parse?.remove?.(handleParse);
}

module.exports = {registerEmeCodecHooks, unregisterEmeCodecHooks};


/***/ },

/***/ 995
(module) {

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

const FORMAT_ID = 'eme_entity';

let emeFormat = null;

function toModelIdentifier(name) {
  return name.trim().toLowerCase()
  .replace(/\s+/g, '_')
  .replace(/[^a-z0-9_]/g, '')
  .replace(/_+/g, '_')
  .replace(/^_|_$/g, '');
}

function registerEmeFormat(icon) {
  if (emeFormat) {
    return;
  }

  emeFormat = new ModelFormat(FORMAT_ID, {
    name: 'Easy Model Entity',
    category: 'minecraft',
    description: 'Entity model for the Easy Model Entities mod (Minecraft: Java Edition).',
    icon: icon || 'pets',
    rotate_cubes: true,
    box_uv: true,
    optional_box_uv: true,
    single_texture: false,
    texture_folder: true,
    bone_rig: true,
    centered_grid: true,
    animated_textures: false,
    animation_mode: true,
    animation_files: false,
    java_edition_mapping: false,
    model_identifier: true,
    locators: true,
    codec: Codecs.project,
    onActivation() {
      if (Project && !Project.model_identifier && Project.name) {
        Project.model_identifier = toModelIdentifier(Project.name);
      }
    }
  });
}

function unregisterEmeFormat() {
  if (emeFormat) {
    emeFormat.delete();
    emeFormat = null;
  }
}

module.exports = {FORMAT_ID, registerEmeFormat, unregisterEmeFormat};


/***/ },

/***/ 16
(module) {

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

// Descriptive, human-readable labels so users see e.g. "Quadruped (4 legs,
// ground, standing)" instead of the cryptic "quadruped_still". Registered with
// Blockbench's translation system; falls back to English outside Blockbench.

const EN = {
  'eme.dialog.title': 'Easy Model Entities Export',
  'eme.field.preset': 'Preset',
  'eme.field.namespace': 'Namespace (mod id)',
  'eme.field.profileId': 'Profile ID',
  'eme.field.targetVersion': 'Minecraft Version',
  'eme.field.exportType': 'Export Type',
  'eme.field.modelType': 'Type',
  'eme.field.customize': 'Customize settings',
  'eme.field.hostEntityType': 'Host Entity Type',
  'eme.field.movementType': 'Movement Type',
  'eme.field.bodyType': 'Body Type',
  'eme.field.width': 'Width',
  'eme.field.height': 'Height',
  'eme.field.eyeHeight': 'Eye Height',
  'eme.field.speed': 'Speed',
  'eme.field.stepHeight': 'Step Height',
  'eme.field.gravity': 'Gravity',
  'eme.field.behaviorMode': 'Behavior Mode',
  'eme.field.maxHealth': 'Max Health',
  'eme.field.movementSpeed': 'Movement Speed',
  'eme.field.followRange': 'Follow Range',
  'eme.field.scale': 'Scale',
  'eme.field.shadowRadius': 'Shadow Radius',
  'eme.field.visibleBoundsWidth': 'Visible Bounds Width (0 = auto)',
  'eme.field.visibleBoundsHeight': 'Visible Bounds Height (0 = auto)',
  'eme.field.visibleBoundsOffsetX': 'Visible Bounds Offset X',
  'eme.field.visibleBoundsOffsetY': 'Visible Bounds Offset Y',
  'eme.field.visibleBoundsOffsetZ': 'Visible Bounds Offset Z',
  'eme.field.animationMode': 'Animation Mode',
  'eme.field.swingSpeed': 'Swing Speed',
  'eme.field.walkSpeedMultiplier': 'Walk Speed Multiplier',
  'eme.field.idleStrength': 'Idle Strength',
  'eme.field.gait': 'Gait',
  'eme.section.host': 'Host',
  'eme.section.dimensions': 'Dimensions',
  'eme.section.movement': 'Movement',
  'eme.section.behavior': 'Behavior',
  'eme.section.attributes': 'Attributes',
  'eme.section.rendering': 'Rendering',
  'eme.section.animation': 'Animation',
  'eme.setting.enable_customization': 'Show advanced customization (Easy Model Entities)',
  'eme.setting.enable_experimental': 'Show experimental presets (Easy Model Entities)',
  'eme.preset.custom': 'Custom (manual settings)',
  'eme.preset.static': 'Static (no animation, no movement)',
  'eme.preset.statue': 'Statue (display, no movement)',
  'eme.preset.ticking': 'Ticking (server + client tick)',
  'eme.preset.animated': 'Animated (continuous animation)',
  'eme.preset.animated_randomly': 'Animated randomly (random idle bursts)',
  'eme.preset.humanoid_still': 'Humanoid (2 legs, standing)',
  'eme.preset.humanoid_wandering': 'Humanoid (2 legs, wandering)',
  'eme.preset.quadruped_still': 'Quadruped (4 legs, ground, standing)',
  'eme.preset.quadruped_wandering': 'Quadruped (4 legs, ground, wandering)',
  'eme.preset.aquatic_still': 'Aquatic (fish, still)',
  'eme.preset.aquatic_swimming': 'Aquatic (fish, swimming)',
  'eme.preset.amphibious_still': 'Amphibious (land/water, still)',
  'eme.preset.amphibious_wandering': 'Amphibious (land/water, wandering)',
  'eme.preset.winged_still': 'Winged (bird, perched)',
  'eme.preset.winged_wandering': 'Winged (bird, flying)',
  'eme.preset.winged_humanoid_still': 'Winged humanoid (standing)',
  'eme.preset.winged_humanoid_wandering': 'Winged humanoid (wandering)',
  'eme.preset.arthropod_still': 'Arthropod (insect/spider, still)',
  'eme.preset.arthropod_wandering': 'Arthropod (insect/spider, wandering)',
  'eme.preset.cuboid_still': 'Cuboid (block shape, still)',
  'eme.preset.cuboid_hopping': 'Cuboid (block shape, hopping)',
  'eme.preset.floating_still': 'Floating (hovering, still)',
  'eme.body.static': 'Static',
  'eme.body.biped': 'Biped (2 legs)',
  'eme.body.quadruped': 'Quadruped (4 legs)',
  'eme.body.aquatic': 'Aquatic',
  'eme.body.amphibious': 'Amphibious',
  'eme.body.winged': 'Winged',
  'eme.body.winged_humanoid': 'Winged humanoid',
  'eme.body.arthropod': 'Arthropod',
  'eme.body.cuboid': 'Cuboid',
  'eme.body.floating': 'Floating',
  'eme.movement.ground': 'Ground',
  'eme.movement.water': 'Water',
  'eme.movement.amphibious': 'Amphibious',
  'eme.movement.static': 'Static',
  'eme.gait.natural': 'Natural',
  'eme.gait.feline': 'Feline (light, quick)',
  'eme.gait.ungulate': 'Ungulate (heavy, slow)',
  'eme.behavior.idle_only': 'Idle only',
  'eme.behavior.ambient': 'Ambient (wanders)',
  'eme.behavior.static': 'Static',
  'eme.behavior.external_owner': 'External owner',
  'eme.animation.automatic': 'Automatic',
  'eme.animation.random_idle': 'Random idle',
  'eme.animation.none': 'None',
  'eme.entity.ground_entity': 'Ground entity',
  'eme.entity.static_entity': 'Static entity',
  'eme.entity.aquatic_entity': 'Aquatic entity',
  'eme.entity.amphibious_entity': 'Amphibious entity',
  'eme.modelType.entity': 'Entity',
  'eme.modelType.block_entity': 'Block Entity',
  'eme.exportType.packs': 'Standalone: Data Pack + Resource Pack (ZIP)',
  'eme.exportType.mod_project': 'Standalone: write into mod project',
  'eme.exportType.model_only': 'Model only: mod integration (no data pack)'
};

const DE = {
  'eme.dialog.title': 'Easy Model Entities Export',
  'eme.field.preset': 'Vorlage',
  'eme.field.namespace': 'Namespace (Mod-ID)',
  'eme.field.profileId': 'Profil-ID',
  'eme.field.targetVersion': 'Minecraft-Version',
  'eme.field.exportType': 'Export-Typ',
  'eme.field.modelType': 'Typ',
  'eme.field.customize': 'Einstellungen anpassen',
  'eme.field.hostEntityType': 'Host-Entität',
  'eme.field.movementType': 'Bewegungsart',
  'eme.field.bodyType': 'Körpertyp',
  'eme.field.width': 'Breite',
  'eme.field.height': 'Höhe',
  'eme.field.eyeHeight': 'Augenhöhe',
  'eme.field.speed': 'Geschwindigkeit',
  'eme.field.stepHeight': 'Schritthöhe',
  'eme.field.gravity': 'Schwerkraft',
  'eme.field.behaviorMode': 'Verhaltensmodus',
  'eme.field.maxHealth': 'Maximale Lebenspunkte',
  'eme.field.movementSpeed': 'Bewegungsgeschwindigkeit',
  'eme.field.followRange': 'Folgereichweite',
  'eme.field.scale': 'Skalierung',
  'eme.field.shadowRadius': 'Schattenradius',
  'eme.field.visibleBoundsWidth': 'Sichtbarkeitsbox-Breite (0 = auto)',
  'eme.field.visibleBoundsHeight': 'Sichtbarkeitsbox-Höhe (0 = auto)',
  'eme.field.visibleBoundsOffsetX': 'Sichtbarkeitsbox-Versatz X',
  'eme.field.visibleBoundsOffsetY': 'Sichtbarkeitsbox-Versatz Y',
  'eme.field.visibleBoundsOffsetZ': 'Sichtbarkeitsbox-Versatz Z',
  'eme.field.animationMode': 'Animationsmodus',
  'eme.field.swingSpeed': 'Schwunggeschwindigkeit',
  'eme.field.walkSpeedMultiplier': 'Geh-Geschwindigkeitsfaktor',
  'eme.field.idleStrength': 'Leerlauf-Intensität',
  'eme.field.gait': 'Gangart',
  'eme.section.host': 'Host',
  'eme.section.dimensions': 'Abmessungen',
  'eme.section.movement': 'Bewegung',
  'eme.section.behavior': 'Verhalten',
  'eme.section.attributes': 'Attribute',
  'eme.section.rendering': 'Darstellung',
  'eme.section.animation': 'Animation',
  'eme.setting.enable_customization': 'Erweiterte Anpassung anzeigen (Easy Model Entities)',
  'eme.setting.enable_experimental': 'Experimentelle Presets anzeigen (Easy Model Entities)',
  'eme.preset.custom': 'Benutzerdefiniert (manuelle Einstellungen)',
  'eme.preset.static': 'Statisch (keine Animation, keine Bewegung)',
  'eme.preset.statue': 'Statue (Anzeige, keine Bewegung)',
  'eme.preset.ticking': 'Tickend (Server- + Client-Tick)',
  'eme.preset.animated': 'Animiert (durchgehende Animation)',
  'eme.preset.animated_randomly': 'Zufällig animiert (zufällige Leerlauf-Schübe)',
  'eme.preset.humanoid_still': 'Humanoid (2 Beine, stehend)',
  'eme.preset.humanoid_wandering': 'Humanoid (2 Beine, umherlaufend)',
  'eme.preset.quadruped_still': 'Vierbeiner (4 Beine, Boden, stehend)',
  'eme.preset.quadruped_wandering': 'Vierbeiner (4 Beine, Boden, umherlaufend)',
  'eme.preset.aquatic_still': 'Wassertier (Fisch, ruhend)',
  'eme.preset.aquatic_swimming': 'Wassertier (Fisch, schwimmend)',
  'eme.preset.amphibious_still': 'Amphibie (Land/Wasser, ruhend)',
  'eme.preset.amphibious_wandering': 'Amphibie (Land/Wasser, umherlaufend)',
  'eme.preset.winged_still': 'Geflügelt (Vogel, sitzend)',
  'eme.preset.winged_wandering': 'Geflügelt (Vogel, fliegend)',
  'eme.preset.winged_humanoid_still': 'Geflügelter Humanoid (stehend)',
  'eme.preset.winged_humanoid_wandering': 'Geflügelter Humanoid (umherlaufend)',
  'eme.preset.arthropod_still': 'Gliederfüßer (Insekt/Spinne, ruhend)',
  'eme.preset.arthropod_wandering': 'Gliederfüßer (Insekt/Spinne, umherlaufend)',
  'eme.preset.cuboid_still': 'Quaderförmig (blockartig, ruhend)',
  'eme.preset.cuboid_hopping': 'Quaderförmig (blockartig, hüpfend)',
  'eme.preset.floating_still': 'Schwebend (ruhend)',
  'eme.body.static': 'Statisch',
  'eme.body.biped': 'Zweibeiner (2 Beine)',
  'eme.body.quadruped': 'Vierbeiner (4 Beine)',
  'eme.body.aquatic': 'Wassertier',
  'eme.body.amphibious': 'Amphibie',
  'eme.body.winged': 'Geflügelt',
  'eme.body.winged_humanoid': 'Geflügelter Humanoid',
  'eme.body.arthropod': 'Gliederfüßer',
  'eme.body.cuboid': 'Quaderförmig',
  'eme.body.floating': 'Schwebend',
  'eme.movement.ground': 'Boden',
  'eme.movement.water': 'Wasser',
  'eme.movement.amphibious': 'Amphibisch',
  'eme.movement.static': 'Statisch',
  'eme.gait.natural': 'Natürlich',
  'eme.gait.feline': 'Katzenartig (leicht, schnell)',
  'eme.gait.ungulate': 'Huftier (schwer, langsam)',
  'eme.behavior.idle_only': 'Nur Leerlauf',
  'eme.behavior.ambient': 'Umgebung (läuft umher)',
  'eme.behavior.static': 'Statisch',
  'eme.behavior.external_owner': 'Externer Besitzer',
  'eme.animation.automatic': 'Automatisch',
  'eme.animation.random_idle': 'Zufälliger Leerlauf',
  'eme.animation.none': 'Keine',
  'eme.entity.ground_entity': 'Boden-Entität',
  'eme.entity.static_entity': 'Statische Entität',
  'eme.entity.aquatic_entity': 'Wasser-Entität',
  'eme.entity.amphibious_entity': 'Amphibien-Entität',
  'eme.modelType.entity': 'Entität',
  'eme.modelType.block_entity': 'Block-Entität',
  'eme.exportType.packs': 'Standalone: Data Pack + Resource Pack (ZIP)',
  'eme.exportType.mod_project': 'Standalone: in Mod-Projekt schreiben',
  'eme.exportType.model_only': 'Nur Modell: Mod-Integration (kein Data Pack)'
};

function registerTranslations() {
  if (typeof Language !== 'undefined' && typeof Language.addTranslations
      === 'function') {
    Language.addTranslations('en', EN);
    Language.addTranslations('de', DE);
  }
}

// Resolves a key via Blockbench's tl() when available, otherwise English.
function t(key) {
  if (typeof tl === 'function') {
    const translated = tl(key);
    if (translated && translated !== key) {
      return translated;
    }
  }

  return EN[key] || key;
}

module.exports = {EN, DE, registerTranslations, t};


/***/ },

/***/ 763
(module) {

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

class ModelDimensions {
  static PIXELS_PER_BLOCK = 16;
  static FALLBACK = {
    width: 0.6,
    height: 0.8,
    eyeHeight: 0.5
  };

  static #EYE_HEIGHT_FACTOR = {biped: 0.9, quadruped: 0.8, static: 0.85};

  static #round(value) {
    return Math.round(value * 1000) / 1000;
  }

  static #isUsableBounds(bounds) {
    if (!bounds) {
      return false;
    }

    return ['minX', 'minY', 'minZ', 'maxX', 'maxY', 'maxZ'].every(
        (key) => Number.isFinite(bounds[key]));
  }

  static deriveDimensions(bounds, bodyType) {
    if (!ModelDimensions.#isUsableBounds(bounds)) {
      return {...ModelDimensions.FALLBACK};
    }

    const width = Math.max(
        Math.max(0, bounds.maxX - bounds.minX),
        Math.max(0, bounds.maxZ - bounds.minZ)
    ) / ModelDimensions.PIXELS_PER_BLOCK;
    const height = Math.max(0, bounds.maxY - bounds.minY)
        / ModelDimensions.PIXELS_PER_BLOCK;

    if (width <= 0 || height <= 0) {
      return {...ModelDimensions.FALLBACK};
    }

    const eyeHeightFactor = ModelDimensions.#EYE_HEIGHT_FACTOR[bodyType]
        ?? ModelDimensions.#EYE_HEIGHT_FACTOR.static;

    return {
      width: ModelDimensions.#round(width),
      height: ModelDimensions.#round(height),
      eyeHeight: ModelDimensions.#round(height * eyeHeightFactor)
    };
  }

  static applyModelDimensions(settings, modelDimensions) {
    if (!modelDimensions) {
      return settings;
    }

    settings.dimensions.width = modelDimensions.width;
    settings.dimensions.height = modelDimensions.height;
    settings.dimensions.eyeHeight = modelDimensions.eyeHeight;
    return settings;
  }
}

module.exports = {ModelDimensions};


/***/ },

/***/ 858
(module) {

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

class PresetDetector {
  static #CUBE_RATIO = 1.4;

  static #names(stats) {
    const boneNames = (stats && stats.boneNames) || [];
    return boneNames.map((name) => String(name).toLowerCase());
  }

  static #any(names, ...needles) {
    return names.some(
        (name) => needles.some((needle) => name.includes(needle)));
  }

  static #count(names, needle) {
    return names.filter((name) => name.includes(needle)).length;
  }

  static #extents(bounds) {
    if (!bounds) {
      return null;
    }

    if (!['minX', 'minY', 'minZ', 'maxX', 'maxY', 'maxZ'].every(
        (key) => Number.isFinite(bounds[key]))) {
      return null;
    }

    return {
      x: Math.max(0, bounds.maxX - bounds.minX),
      y: Math.max(0, bounds.maxY - bounds.minY),
      z: Math.max(0, bounds.maxZ - bounds.minZ)
    };
  }

  static detect(stats, bounds) {
    const names = PresetDetector.#names(stats);
    const hasWings = PresetDetector.#any(names, 'wing');
    const hasArms = PresetDetector.#any(names, 'arm');
    const legCount = PresetDetector.#count(names, 'leg');
    const hasFrontBackLegs = names.some(
        (name) => name.includes('leg')
            && (name.includes('front') || name.includes('back')));

    if (hasWings) {
      return hasArms
          ? {presetType: 'winged_humanoid_still', reason: 'wings + arms'}
          : {presetType: 'winged_still', reason: 'wing bones'};
    }

    if (PresetDetector.#any(names, 'fin', 'fluke', 'fish')) {
      return {presetType: 'aquatic_still', reason: 'fin/fish bones'};
    }

    if (legCount >= 6 || PresetDetector.#any(names, 'spider', 'insect',
        'mandible')) {
      return {presetType: 'arthropod_still', reason: 'six or more legs'};
    }

    if (hasFrontBackLegs || legCount === 4) {
      return {presetType: 'quadruped_still', reason: 'four legs (front/back)'};
    }

    if (hasArms) {
      return {presetType: 'humanoid_still', reason: 'arm bones'};
    }

    const extents = PresetDetector.#extents(bounds);
    if (extents && extents.x > 0 && extents.y > 0 && extents.z > 0) {
      if (Math.max(extents.x, extents.y, extents.z) / Math.min(extents.x,
          extents.y, extents.z) <= PresetDetector.#CUBE_RATIO) {
        return {presetType: 'cuboid_still', reason: 'cube-like proportions'};
      }
      if (extents.y < Math.max(extents.x, extents.z) * 0.5) {
        return {presetType: 'aquatic_still', reason: 'flat proportions'};
      }
    }

    return {presetType: 'statue', reason: 'no distinguishing limbs'};
  }

  static detectPresetType(stats, bounds) {
    return PresetDetector.detect(stats, bounds).presetType;
  }
}

module.exports = {PresetDetector};


/***/ },

/***/ 229
(module, __unused_webpack_exports, __webpack_require__) {

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

const {ResourceLocation} = __webpack_require__(20);
const {
  PRESET_TYPES,
  BLOCK_ENTITY_PRESET_TYPES,
  ANIMATION_CLIPS,
  MODEL_TYPE_BLOCK_ENTITY
} = __webpack_require__(151);

const SUPPORTED_ANIMATION_CHANNELS = new Set(['rotation', 'position']);

class Validator {
  static BUDGETS = {
    maxTextureSize: 2048,
    softTextureSize: 128,
    maxModelFileSizeBytes: 2 * 1024 * 1024,
    softModelFileSizeBytes: 1024 * 1024,
    maxCubeCount: 512,
    softCubeCount: 384,
    maxBoneCount: 128,
    softBoneCount: 96,
    maxHierarchyDepth: 32,
    softHierarchyDepth: 24,
    maxAnimationCount: 16
  };

  static REQUIRED_BODY_PARTS = {
    quadruped: ['root', 'body', 'head', 'front_left_leg', 'front_right_leg',
      'back_left_leg', 'back_right_leg'],
    biped: ['root', 'head', 'body', 'left_arm', 'right_arm', 'left_leg',
      'right_leg'],
    static: []
  };

  static #isFiniteNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
  }

  static #validateNumeric(errors, label, value) {
    if (!Validator.#isFiniteNumber(value)) {
      errors.push({
        code: 'INVALID_NUMERIC',
        message: `${label} must be a finite number`
      });
      return false;
    }

    return true;
  }

  static #warnIfOverBudget(warnings, value, soft, max, softWarning,
      maxWarning) {
    if (!Validator.#isFiniteNumber(value)) {
      return;
    }
    if (value > max) {
      warnings.push(maxWarning);
    } else if (value > soft) {
      warnings.push(softWarning);
    }
  }

  static validateSettings(settings, context) {
    const errors = [];
    const warnings = [];
    const ctx = context || {};

    if (!ResourceLocation.isValidNamespace(settings.namespace)) {
      errors.push({
        code: 'INVALID_NAMESPACE',
        message: `Invalid namespace: ${settings.namespace}`
      });
    }
    if (!ResourceLocation.isValidPath(settings.profileId)) {
      errors.push({
        code: 'INVALID_PROFILE_ID',
        message: `Invalid profile ID: ${settings.profileId}`
      });
    }

    const id = `${settings.namespace}:${settings.profileId}`;
    if (
        ResourceLocation.isValidNamespace(settings.namespace) &&
        ResourceLocation.isValidPath(settings.profileId) &&
        !ResourceLocation.isValidResourceLocation(id)
    ) {
      errors.push({
        code: 'INVALID_RESOURCE_LOCATION',
        message: `Invalid resource location: ${id}`
      });
    }
    const blockEntity = settings.modelType === MODEL_TYPE_BLOCK_ENTITY;
    if (!blockEntity
        && !ResourceLocation.isValidResourceLocation(
            settings.host.entityType)) {
      errors.push({
        code: 'INVALID_RESOURCE_LOCATION',
        message: `Invalid host entity type: ${settings.host.entityType}`
      });
    }
    const validPresets = blockEntity ? BLOCK_ENTITY_PRESET_TYPES : PRESET_TYPES;
    if (!validPresets.includes(settings.presetType)) {
      errors.push({
        code: 'INVALID_PRESET_TYPE',
        message: `Invalid preset type: ${settings.presetType}`
      });
    }

    const {width, height, eyeHeight} = settings.dimensions;
    const widthValid = Validator.#validateNumeric(errors, 'dimensions.width',
        width);
    const heightValid = Validator.#validateNumeric(errors, 'dimensions.height',
        height);
    const eyeValid = Validator.#validateNumeric(errors, 'dimensions.eye_height',
        eyeHeight);
    if (widthValid && width <= 0) {
      errors.push({
        code: 'INVALID_DIMENSIONS',
        message: 'width must be greater than 0'
      });
    }
    if (heightValid && height <= 0) {
      errors.push({
        code: 'INVALID_DIMENSIONS',
        message: 'height must be greater than 0'
      });
    }
    if (eyeValid && eyeHeight < 0) {
      errors.push({
        code: 'INVALID_DIMENSIONS',
        message: 'eye_height must not be negative'
      });
    }
    if (eyeValid && heightValid && eyeHeight > height) {
      errors.push({
        code: 'INVALID_DIMENSIONS',
        message: 'eye_height must not exceed height'
      });
    }

    Validator.#validateNumeric(errors, 'movement.speed',
        settings.movement.speed);
    Validator.#validateNumeric(errors, 'movement.step_height',
        settings.movement.stepHeight);

    if (ctx.hasModel === false) {
      errors.push(
          {code: 'MISSING_MODEL', message: 'No model present in project'});
    }
    if (ctx.hasTexture === false) {
      errors.push(
          {code: 'MISSING_TEXTURE', message: 'No texture present in project'});
    }

    if (Validator.#isFiniteNumber(ctx.textureWidth)
        && Validator.#isFiniteNumber(ctx.textureHeight)) {
      const textureSize = Math.max(ctx.textureWidth, ctx.textureHeight);
      Validator.#warnIfOverBudget(warnings, textureSize,
          Validator.BUDGETS.softTextureSize, Validator.BUDGETS.maxTextureSize,
          {
            code: 'SOFT_TEXTURE_SIZE',
            message: `Texture larger than ${Validator.BUDGETS.softTextureSize}x${Validator.BUDGETS.softTextureSize}`
          },
          {
            code: 'LARGE_TEXTURE',
            message: `Texture larger than ${Validator.BUDGETS.maxTextureSize}x${Validator.BUDGETS.maxTextureSize}`
          });
    }
    Validator.#warnIfOverBudget(warnings, ctx.modelFileSize,
        Validator.BUDGETS.softModelFileSizeBytes,
        Validator.BUDGETS.maxModelFileSizeBytes,
        {
          code: 'SOFT_MODEL_SIZE',
          message: 'Model file larger than 1 MB'
        },
        {code: 'LARGE_MODEL', message: 'Model file larger than 2 MB'});
    Validator.#warnIfOverBudget(warnings, ctx.cubeCount,
        Validator.BUDGETS.softCubeCount, Validator.BUDGETS.maxCubeCount,
        {
          code: 'SOFT_CUBE_COUNT',
          message: `More than ${Validator.BUDGETS.softCubeCount} cubes`
        },
        {
          code: 'HIGH_CUBE_COUNT',
          message: `More than ${Validator.BUDGETS.maxCubeCount} cubes`
        });
    Validator.#warnIfOverBudget(warnings, ctx.boneCount,
        Validator.BUDGETS.softBoneCount, Validator.BUDGETS.maxBoneCount,
        {
          code: 'SOFT_BONE_COUNT',
          message: `More than ${Validator.BUDGETS.softBoneCount} bones`
        },
        {
          code: 'HIGH_BONE_COUNT',
          message: `More than ${Validator.BUDGETS.maxBoneCount} bones`
        });
    Validator.#warnIfOverBudget(warnings, ctx.hierarchyDepth,
        Validator.BUDGETS.softHierarchyDepth,
        Validator.BUDGETS.maxHierarchyDepth,
        {
          code: 'SOFT_HIERARCHY_DEPTH',
          message: `Hierarchy deeper than ${Validator.BUDGETS.softHierarchyDepth}`
        },
        {
          code: 'DEEP_HIERARCHY',
          message: `Hierarchy deeper than ${Validator.BUDGETS.maxHierarchyDepth}`
        });
    if (Validator.#isFiniteNumber(ctx.animationCount)
        && ctx.animationCount > Validator.BUDGETS.maxAnimationCount) {
      errors.push({
        code: 'HIGH_ANIMATION_COUNT',
        message: `More than ${Validator.BUDGETS.maxAnimationCount} animations; the mod refuses to load the model`
      });
    }

    (ctx.animations || []).forEach((animation) => {
      const name = String(animation.name || '').toLowerCase();
      if (!ANIMATION_CLIPS.includes(name)) {
        warnings.push({
          code: 'NON_STANDARD_ANIMATION',
          message: `Animation "${animation.name}" is not one of ${ANIMATION_CLIPS.join(
              ', ')} and is ignored by the mod`
        });
      }
      if (animation.hasExpression) {
        warnings.push({
          code: 'UNSUPPORTED_ANIMATION_EXPRESSION',
          message: `Animation "${animation.name}" uses expressions; the mod only supports numeric keyframes and drops the clip`
        });
      }
      (animation.channels || []).forEach((channel) => {
        if (!SUPPORTED_ANIMATION_CHANNELS.has(channel)) {
          warnings.push({
            code: 'UNSUPPORTED_ANIMATION_CHANNEL',
            message: `Animation "${animation.name}" uses the "${channel}" channel which is ignored by the mod`
          });
        }
      });
    });

    Validator.getMissingBodyParts(settings.host.bodyType,
        ctx.boneNames || []).forEach((part) => {
      warnings.push({
        code: 'MISSING_BODY_PART',
        message: `Missing recommended body part: ${part}`
      });
    });

    return {errors, warnings, valid: errors.length === 0};
  }

  static getMissingBodyParts(bodyType, boneNames) {
    const required = Validator.REQUIRED_BODY_PARTS[bodyType] || [];
    const present = new Set(
        (boneNames || []).map((name) => String(name).toLowerCase()));

    return required.filter((part) => !present.has(part));
  }

  static validateOutputPath(outputRoot, relativePath) {
    if (typeof relativePath !== 'string' || relativePath.length === 0) {
      return {
        valid: false,
        code: 'INVALID_OUTPUT_PATH',
        message: 'Empty output path'
      };
    }

    const normalized = relativePath.replaceAll('\\', '/');
    if (normalized.includes('..')) {
      return {
        valid: false,
        code: 'PATH_TRAVERSAL',
        message: 'Path traversal detected'
      };
    }

    if (/^([a-zA-Z]:\/|\/)/.test(normalized)) {
      return {
        valid: false,
        code: 'ABSOLUTE_PATH',
        message: 'Absolute paths are not allowed'
      };
    }

    return {valid: true, root: outputRoot, path: normalized};
  }
}

module.exports = {Validator};


/***/ },

/***/ 508
(module) {

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

class VisibleBounds {
  static PIXELS_PER_BLOCK = 16;

  static #empty() {
    return {width: 0, height: 0, offset: [0, 0, 0]};
  }

  static #round(value) {
    return Math.round(value * 1000) / 1000;
  }

  static #usableCubes(cubes) {
    if (!Array.isArray(cubes)) {
      return [];
    }

    return cubes.filter((cube) =>
        cube && Array.isArray(cube.from) && Array.isArray(cube.to)
        && cube.from.length === 3 && cube.to.length === 3
        && [...cube.from, ...cube.to].every((value) => Number.isFinite(value)));
  }

  static #bounds(cubes) {
    const bounds = {
      min: [Infinity, Infinity, Infinity],
      max: [-Infinity, -Infinity, -Infinity]
    };
    cubes.forEach((cube) => {
      for (let axis = 0; axis < 3; axis++) {
        bounds.min[axis] = Math.min(bounds.min[axis], cube.from[axis],
            cube.to[axis]);
        bounds.max[axis] = Math.max(bounds.max[axis], cube.from[axis],
            cube.to[axis]);
      }
    });

    return bounds;
  }

  static derive(cubes) {
    const usable = VisibleBounds.#usableCubes(cubes);
    if (usable.length === 0) {
      return VisibleBounds.#empty();
    }

    const ppb = VisibleBounds.PIXELS_PER_BLOCK;
    const bounds = VisibleBounds.#bounds(usable);
    const xExtent = bounds.max[0] - bounds.min[0];
    const yExtent = bounds.max[1] - bounds.min[1];
    const zExtent = bounds.max[2] - bounds.min[2];
    const width = Math.max(xExtent, zExtent) / ppb;
    const height = yExtent / ppb;

    if (width <= 0 || height <= 0) {
      return VisibleBounds.#empty();
    }

    return {
      width: VisibleBounds.#round(width),
      height: VisibleBounds.#round(height),
      offset: [
        VisibleBounds.#round(((bounds.min[0] + bounds.max[0]) / 2) / ppb),
        VisibleBounds.#round(bounds.min[1] / ppb),
        VisibleBounds.#round(((bounds.min[2] + bounds.max[2]) / 2) / ppb)
      ]
    };
  }

  static hasVisibleBounds(settings) {
    const rendering = settings && settings.rendering;
    return !!rendering && rendering.visibleBoundsWidth > 0
        && rendering.visibleBoundsHeight > 0;
  }

  static applyVisibleBounds(settings, derived, options) {
    if (!derived || !settings || !settings.rendering) {
      return settings;
    }
    if (options?.preserveExisting && VisibleBounds.hasVisibleBounds(settings)) {
      return settings;
    }

    settings.rendering.visibleBoundsWidth = derived.width;
    settings.rendering.visibleBoundsHeight = derived.height;
    settings.rendering.visibleBoundsOffset = derived.offset.slice();
    return settings;
  }
}

module.exports = {VisibleBounds};


/***/ },

/***/ 151
(module) {

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

// Mirrors de.markusbordihn.easymodelentities.profile.ModelPresetType.

const SCHEMA_VERSION = '0.2.0';

const MODEL_TYPE_ENTITY = 'entity';
const MODEL_TYPE_BLOCK_ENTITY = 'block_entity';
const MODEL_TYPES = [MODEL_TYPE_ENTITY, MODEL_TYPE_BLOCK_ENTITY];

const BODY_TYPES = [
  'static',
  'biped',
  'quadruped',
  'aquatic',
  'amphibious',
  'winged',
  'winged_humanoid',
  'arthropod',
  'cuboid',
  'floating'
];

const MOVEMENT_TYPES = ['ground', 'water', 'amphibious', 'static'];
const BEHAVIOR_MODES = ['idle_only', 'ambient', 'static', 'external_owner'];
const ANIMATION_MODES = ['automatic', 'random_idle', 'none'];
const ANIMATION_CLIPS = ['idle', 'walk', 'swim', 'fly'];
const GAIT_TYPES = ['natural', 'feline', 'ungulate'];

const GROUND_ENTITY = 'easy_model_entities:ground_entity';
const STATIC_ENTITY = 'easy_model_entities:static_entity';
const AQUATIC_ENTITY = 'easy_model_entities:aquatic_entity';
const AMPHIBIOUS_ENTITY = 'easy_model_entities:amphibious_entity';

const FALLBACK_DIMENSIONS = {width: 0.6, height: 1.8, eyeHeight: 1.62};
const BLOCK_ENTITY_DIMENSIONS = {width: 1.0, height: 1.0, eyeHeight: 0.5};

const DEFAULT_MAX_HEALTH = 10;
const DEFAULT_FOLLOW_RANGE = 16;

const PRESET_TYPES = [
  'custom',
  'static',
  'statue',
  'humanoid_still',
  'humanoid_wandering',
  'quadruped_still',
  'quadruped_wandering',
  'aquatic_still',
  'aquatic_swimming',
  'amphibious_still',
  'amphibious_wandering',
  'winged_still',
  'winged_wandering',
  'winged_humanoid_still',
  'winged_humanoid_wandering',
  'arthropod_still',
  'arthropod_wandering',
  'cuboid_still',
  'cuboid_hopping',
  'floating_still'
];

const BLOCK_ENTITY_PRESET_TYPES = [
  'static',
  'ticking',
  'animated',
  'animated_randomly'
];

const STABLE_PRESET_TYPES = new Set([
  'static',
  'statue',
  'humanoid_still',
  'humanoid_wandering',
  'quadruped_still',
  'quadruped_wandering',
  'aquatic_still',
  'aquatic_swimming',
  'amphibious_still',
  'amphibious_wandering',
  'winged_still',
  'winged_wandering',
  'winged_humanoid_still',
  'winged_humanoid_wandering',
  'arthropod_still',
  'arthropod_wandering',
  'cuboid_still',
  'cuboid_hopping',
  'floating_still',
  // Block entity stable presets.
  'animated',
  'animated_randomly'
]);

const SELECTABLE_PRESET_TYPES = PRESET_TYPES.filter((id) => id !== 'custom');

function isStablePreset(presetType) {
  return STABLE_PRESET_TYPES.has(presetType);
}

function isCustom(presetType) {
  return presetType === 'custom';
}

function isStill(presetType) {
  return String(presetType).endsWith('_still');
}

function isMoving(presetType) {
  return String(presetType).endsWith('_wandering')
      || presetType === 'aquatic_swimming'
      || presetType === 'cuboid_hopping';
}

function bodyType(presetType) {
  switch (presetType) {
    case 'humanoid_still':
    case 'humanoid_wandering':
      return 'biped';
    case 'quadruped_still':
    case 'quadruped_wandering':
      return 'quadruped';
    case 'aquatic_still':
    case 'aquatic_swimming':
      return 'aquatic';
    case 'amphibious_still':
    case 'amphibious_wandering':
      return 'amphibious';
    case 'winged_still':
    case 'winged_wandering':
      return 'winged';
    case 'winged_humanoid_still':
    case 'winged_humanoid_wandering':
      return 'winged_humanoid';
    case 'arthropod_still':
    case 'arthropod_wandering':
      return 'arthropod';
    case 'cuboid_still':
    case 'cuboid_hopping':
      return 'cuboid';
    case 'floating_still':
      return 'floating';
    default:
      return 'static';
  }
}

function isAquatic(presetType) {
  return presetType === 'aquatic_still' || presetType === 'aquatic_swimming';
}

function isAmphibious(presetType) {
  return presetType === 'amphibious_still'
      || presetType === 'amphibious_wandering';
}

function movementType(presetType) {
  if (isAquatic(presetType)) {
    return 'water';
  }
  if (isAmphibious(presetType)) {
    return 'amphibious';
  }

  return isMoving(presetType) ? 'ground' : 'static';
}

function entityType(presetType) {
  if (isAquatic(presetType)) {
    return AQUATIC_ENTITY;
  }
  if (isAmphibious(presetType)) {
    return AMPHIBIOUS_ENTITY;
  }

  return isMoving(presetType) || presetType === 'static' ? GROUND_ENTITY
      : STATIC_ENTITY;
}

function presetDimensions(presetType) {
  switch (presetType) {
    case 'quadruped_still':
    case 'quadruped_wandering':
      return {width: 0.9, height: 0.9, eyeHeight: 0.6};
    case 'aquatic_still':
    case 'aquatic_swimming':
      return {width: 0.7, height: 0.4, eyeHeight: 0.25};
    case 'amphibious_still':
    case 'amphibious_wandering':
      return {width: 0.9, height: 0.6, eyeHeight: 0.4};
    case 'winged_still':
    case 'winged_wandering':
      return {width: 0.6, height: 0.9, eyeHeight: 0.6};
    case 'winged_humanoid_still':
    case 'winged_humanoid_wandering':
      return {width: 0.6, height: 0.8, eyeHeight: 0.6};
    case 'arthropod_still':
    case 'arthropod_wandering':
      return {width: 1.4, height: 0.9, eyeHeight: 0.45};
    case 'cuboid_still':
    case 'cuboid_hopping':
    case 'floating_still':
      return {width: 1.0, height: 1.0, eyeHeight: 0.5};
    default:
      return {...FALLBACK_DIMENSIONS};
  }
}

function presetShadowRadius(presetType) {
  switch (presetType) {
    case 'quadruped_still':
    case 'quadruped_wandering':
    case 'amphibious_still':
    case 'amphibious_wandering':
      return 0.45;
    case 'aquatic_still':
    case 'aquatic_swimming':
    case 'winged_still':
    case 'winged_wandering':
    case 'winged_humanoid_still':
    case 'winged_humanoid_wandering':
      return 0.25;
    case 'arthropod_still':
    case 'arthropod_wandering':
      return 0.7;
    case 'cuboid_still':
    case 'cuboid_hopping':
    case 'floating_still':
      return 0.5;
    default:
      return 0.3;
  }
}

function behaviorModeFor(presetType, move) {
  if (isMoving(presetType)) {
    return 'ambient';
  }

  if (isStill(presetType)) {
    return 'idle_only';
  }

  if (presetType === 'custom') {
    return move === 'ground' || move === 'amphibious' ? 'idle_only' : 'static';
  }

  return 'static';
}

function behaviorMode(presetType) {
  return behaviorModeFor(presetType, movementType(presetType));
}

function wandersByMovement(move) {
  return move === 'ground' || move === 'amphibious' || move === 'water';
}

function defaultSpeed(move) {
  switch (move) {
    case 'ground':
      return 0.22;
    case 'amphibious':
      return 0.15;
    case 'water':
      return 0.1;
    default:
      return 0;
  }
}

function movementDefaults(presetType, move) {
  return {
    speed: defaultSpeed(move),
    stepHeight: move === 'ground' || move === 'amphibious' ? 0.6 : 0,
    gravity: presetType === 'static' || move !== 'static'
  };
}

function animationMode(presetType) {
  return presetType === 'custom' || presetType === 'static'
  || presetType === 'statue' ? 'none' : 'automatic';
}

function blockEntityAnimationMode(presetType) {
  switch (presetType) {
    case 'animated':
      return 'automatic';
    case 'animated_randomly':
      return 'random_idle';
    default:
      return 'none';
  }
}

function defaultRenderingSettings(presetType) {
  return {
    scale: 1,
    shadowRadius: presetShadowRadius(presetType),
    visibleBoundsWidth: 0,
    visibleBoundsHeight: 0,
    visibleBoundsOffset: [0, 0, 0]
  };
}

function defaultAnimationSettings(mode) {
  return {
    mode: mode,
    swingSpeed: 1,
    walkSpeedMultiplier: 1,
    idleStrength: 1,
    gait: 'natural'
  };
}

function blockEntityPresetDefaults(presetType) {
  return {
    schemaVersion: SCHEMA_VERSION,
    modelType: MODEL_TYPE_BLOCK_ENTITY,
    presetType: presetType,
    host: {entityType: '', movementType: 'static', bodyType: 'static'},
    dimensions: {...BLOCK_ENTITY_DIMENSIONS},
    movement: {speed: 0, stepHeight: 0, gravity: false},
    behavior: {mode: 'static', lookAtPlayers: false, randomStroll: false},
    attributes: {
      maxHealth: DEFAULT_MAX_HEALTH,
      movementSpeed: 0,
      followRange: DEFAULT_FOLLOW_RANGE
    },
    rendering: defaultRenderingSettings('cuboid_still'),
    animation: defaultAnimationSettings(blockEntityAnimationMode(presetType))
  };
}

function presetDefaults(presetType, modelType) {
  if (modelType === MODEL_TYPE_BLOCK_ENTITY) {
    return blockEntityPresetDefaults(presetType);
  }

  const move = movementType(presetType);
  const movement = movementDefaults(presetType, move);
  const mode = behaviorMode(presetType);

  return {
    schemaVersion: SCHEMA_VERSION,
    modelType: MODEL_TYPE_ENTITY,
    presetType: presetType,
    host: {
      entityType: entityType(presetType),
      movementType: move,
      bodyType: bodyType(presetType)
    },
    dimensions: presetDimensions(presetType),
    movement: {
      speed: movement.speed,
      stepHeight: movement.stepHeight,
      gravity: movement.gravity
    },
    behavior: {
      mode: mode,
      lookAtPlayers: mode === 'idle_only' || mode === 'ambient',
      randomStroll: wandersByMovement(move) && mode === 'ambient'
    },
    attributes: {
      maxHealth: DEFAULT_MAX_HEALTH,
      movementSpeed: movement.speed,
      followRange: DEFAULT_FOLLOW_RANGE
    },
    rendering: defaultRenderingSettings(presetType),
    animation: defaultAnimationSettings(animationMode(presetType))
  };
}

module.exports = {
  SCHEMA_VERSION,
  MODEL_TYPE_ENTITY,
  MODEL_TYPE_BLOCK_ENTITY,
  MODEL_TYPES,
  BODY_TYPES,
  MOVEMENT_TYPES,
  DEFAULT_MAX_HEALTH,
  DEFAULT_FOLLOW_RANGE,
  BEHAVIOR_MODES,
  PRESET_TYPES,
  BLOCK_ENTITY_PRESET_TYPES,
  ANIMATION_MODES,
  ANIMATION_CLIPS,
  GAIT_TYPES,
  SELECTABLE_PRESET_TYPES,
  isStablePreset,
  isCustom,
  bodyType,
  behaviorModeFor,
  movementDefaults,
  wandersByMovement,
  animationMode,
  presetDimensions,
  presetShadowRadius,
  presetDefaults,
  defaultRenderingSettings,
  defaultAnimationSettings
};


/***/ },

/***/ 668
(module, __unused_webpack_exports, __webpack_require__) {

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

const {MODEL_TYPE_ENTITY, presetDefaults} = __webpack_require__(151);
const {getDefaultVersionId} = __webpack_require__(954);

const DEFAULT_PRESET = 'statue';

const MODEL_SETTING_KEYS = [
  'schemaVersion',
  'modelType',
  'presetType',
  'namespace',
  'profileId',
  'targetVersion',
  'customize',
  'host',
  'dimensions',
  'movement',
  'behavior',
  'attributes',
  'rendering',
  'animation'
];

function pickModelSettings(settings) {
  if (!settings || typeof settings !== 'object') {
    return settings;
  }

  const picked = {};
  MODEL_SETTING_KEYS.forEach((key) => {
    if (settings[key] !== undefined) {
      picked[key] = settings[key];
    }
  });

  return picked;
}

function deepMerge(target, source) {
  const result = Array.isArray(target) ? target.slice() : ({
    ...target
  });
  Object.keys(source).forEach((key) => {
    const value = source[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = deepMerge(result[key] || {}, value);
    } else if (Array.isArray(value)) {
      result[key] = value.slice();
    } else {
      result[key] = value;
    }
  });

  return result;
}

function getDefaults() {
  return deepMerge(presetDefaults(DEFAULT_PRESET), {
    namespace: 'example_org',
    profileId: 'entity',
    targetVersion: getDefaultVersionId()
  });
}

function applyTemplate(presetType, modelType) {
  return deepMerge(getDefaults(),
      presetDefaults(presetType, modelType || MODEL_TYPE_ENTITY));
}

module.exports = {
  DEFAULT_PRESET,
  getDefaults,
  applyTemplate,
  deepMerge,
  pickModelSettings
};


/***/ },

/***/ 954
(module) {

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

const DEFAULT_VERSION_ID = '1.20.1';

const VERSIONS = [
  {
    id: '1.20.1',
    label: 'Minecraft 1.20.1',
    data: {packFormat: 15},
    resource: {packFormat: 15},
    enabled: true
  },
  {
    id: '1.21.1',
    label: 'Minecraft 1.21.1',
    data: {packFormat: 48},
    resource: {packFormat: 34},
    enabled: true
  },
  {
    id: '1.21.11',
    label: 'Minecraft 1.21.11',
    data: {packFormat: 94, minFormat: [94, 1], maxFormat: [94, 1]},
    resource: {packFormat: 75, minFormat: [75, 0], maxFormat: [75, 0]},
    enabled: true
  },
  {
    id: '26.1.2',
    label: 'Minecraft 26.1.2',
    data: {packFormat: 101, minFormat: [101, 1], maxFormat: [101, 1]},
    resource: {packFormat: 84, minFormat: [84, 0], maxFormat: [84, 0]},
    enabled: true
  }
];

function getVersions() {
  return VERSIONS.map((version) => ({...version}));
}

function getVersion(id) {
  return VERSIONS.find((version) => version.id === id) || null;
}

function getDefaultVersionId() {
  return DEFAULT_VERSION_ID;
}

function getPackFormats(id) {
  const version = getVersion(id);
  if (!version?.enabled || !version.data || !version.resource) {
    return null;
  }
  return {
    data: version.data,
    resource: version.resource
  };
}

module.exports = {
  getVersions,
  getDefaultVersionId,
  getPackFormats
};


/***/ },

/***/ 924
(module, __unused_webpack_exports, __webpack_require__) {

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
  MODEL_TYPE_ENTITY,
  MODEL_TYPE_BLOCK_ENTITY
} = __webpack_require__(151);
const {t} = __webpack_require__(16);
const {
  presetOptions,
  modelTypeOptions,
  exportTypeOptions,
  hostEntityTypeOptions,
  movementTypeOptions,
  bodyTypeOptions,
  gaitOptions,
  behaviorModeOptions,
  animationModeOptions,
  versionOptions
} = __webpack_require__(664);
const {
  settingsToForm,
  activeModelType,
  activePreset,
  presetFormValues,
  resolveExportSettings
} = __webpack_require__(807);

function advancedField(field, showCustomize) {
  return Object.assign({condition: showCustomize}, field);
}

function buildFormConfig(settings, ui) {
  const values = settingsToForm(settings);
  const state = ui || {};
  const allowCustomize = !!state.showCustomization;

  const standalone = (form) => form.exportType !== 'model_only';
  const blockEntitySelected = (form) =>
      standalone(form) && form.modelType === MODEL_TYPE_BLOCK_ENTITY;
  const customizeOn = (form) => allowCustomize && !!form.customize;
  const showServer = (form) => customizeOn(form) && standalone(form);
  const showEntity = (form) => showServer(form) && !blockEntitySelected(form);
  const showRender = customizeOn;

  const experimental = !!state.experimental;
  const entityValue = state.preset || 'statue';
  const blockValue = state.blockPreset || 'static';

  const config = {
    exportType: {
      label: t('eme.field.exportType'),
      type: 'select',
      options: exportTypeOptions(),
      value: state.exportType || 'packs'
    },
    modelType: {
      label: t('eme.field.modelType'),
      type: 'select',
      options: modelTypeOptions(),
      value: state.modelType || MODEL_TYPE_ENTITY,
      condition: standalone
    },
    preset: {
      label: t('eme.field.preset'),
      type: 'select',
      options: presetOptions(MODEL_TYPE_ENTITY, experimental, entityValue),
      value: entityValue,
      condition: (form) => !blockEntitySelected(form)
    },
    blockPreset: {
      label: t('eme.field.preset'),
      type: 'select',
      options: presetOptions(MODEL_TYPE_BLOCK_ENTITY, experimental, blockValue),
      value: blockValue,
      condition: blockEntitySelected
    },
    namespace: {
      label: t('eme.field.namespace'),
      type: 'text',
      value: values.namespace,
      placeholder: 'your_mod_id'
    },
    profileId: {
      label: t('eme.field.profileId'), type: 'text',
      value: values.profileId
    },
    targetVersion: {
      label: t('eme.field.targetVersion'),
      type: 'select',
      options: versionOptions(),
      value: values.targetVersion
    }
  };

  if (allowCustomize) {
    config.customize = {
      label: t('eme.field.customize'),
      type: 'checkbox',
      value: !!state.customize
    };
  }

  Object.assign(config, {
    host_header: advancedField(
        {type: 'info', text: `### ${t('eme.section.host')}`}, showEntity),
    hostEntityType: advancedField({
      label: t('eme.field.hostEntityType'),
      type: 'select',
      options: hostEntityTypeOptions(),
      value: values.hostEntityType
    }, showEntity),
    movementType: advancedField({
      label: t('eme.field.movementType'),
      type: 'select',
      options: movementTypeOptions(),
      value: values.movementType
    }, showEntity),
    bodyType: advancedField({
      label: t('eme.field.bodyType'),
      type: 'select',
      options: bodyTypeOptions(),
      value: values.bodyType
    }, showEntity),

    dimensions_header: advancedField(
        {type: 'info', text: `### ${t('eme.section.dimensions')}`},
        showServer),
    width: advancedField(
        {
          label: t('eme.field.width'), type: 'number', value: values.width,
          step: 0.1
        }, showServer),
    height: advancedField(
        {
          label: t('eme.field.height'), type: 'number', value: values.height,
          step: 0.1
        }, showServer),
    eyeHeight: advancedField(
        {
          label: t('eme.field.eyeHeight'), type: 'number',
          value: values.eyeHeight, step: 0.1
        }, showServer),

    movement_header: advancedField(
        {type: 'info', text: `### ${t('eme.section.movement')}`}, showEntity),
    speed: advancedField(
        {
          label: t('eme.field.speed'), type: 'number', value: values.speed,
          step: 0.01
        }, showEntity),
    stepHeight: advancedField(
        {
          label: t('eme.field.stepHeight'), type: 'number',
          value: values.stepHeight, step: 0.1
        }, showEntity),
    gravity: advancedField(
        {
          label: t('eme.field.gravity'), type: 'checkbox',
          value: values.gravity
        }, showEntity),

    behavior_header: advancedField(
        {type: 'info', text: `### ${t('eme.section.behavior')}`}, showEntity),
    behaviorMode: advancedField({
      label: t('eme.field.behaviorMode'),
      type: 'select',
      options: behaviorModeOptions(),
      value: values.behaviorMode
    }, showEntity),

    attributes_header: advancedField(
        {type: 'info', text: `### ${t('eme.section.attributes')}`},
        showEntity),
    maxHealth: advancedField(
        {
          label: t('eme.field.maxHealth'), type: 'number',
          value: values.maxHealth, step: 0.5
        }, showEntity),
    movementSpeed: advancedField(
        {
          label: t('eme.field.movementSpeed'), type: 'number',
          value: values.movementSpeed, step: 0.01
        }, showEntity),
    followRange: advancedField(
        {
          label: t('eme.field.followRange'), type: 'number',
          value: values.followRange, step: 1
        }, showEntity),

    rendering_header: advancedField(
        {type: 'info', text: `### ${t('eme.section.rendering')}`},
        showRender),
    scale: advancedField(
        {
          label: t('eme.field.scale'), type: 'number', value: values.scale,
          step: 0.1
        }, showRender),
    shadowRadius: advancedField(
        {
          label: t('eme.field.shadowRadius'), type: 'number',
          value: values.shadowRadius, step: 0.1
        }, showRender),
    visibleBoundsWidth: advancedField(
        {
          label: t('eme.field.visibleBoundsWidth'), type: 'number',
          value: values.visibleBoundsWidth, step: 0.1
        }, showRender),
    visibleBoundsHeight: advancedField(
        {
          label: t('eme.field.visibleBoundsHeight'), type: 'number',
          value: values.visibleBoundsHeight, step: 0.1
        }, showRender),
    visibleBoundsOffsetX: advancedField(
        {
          label: t('eme.field.visibleBoundsOffsetX'), type: 'number',
          value: values.visibleBoundsOffsetX, step: 0.1
        }, showRender),
    visibleBoundsOffsetY: advancedField(
        {
          label: t('eme.field.visibleBoundsOffsetY'), type: 'number',
          value: values.visibleBoundsOffsetY, step: 0.1
        }, showRender),
    visibleBoundsOffsetZ: advancedField(
        {
          label: t('eme.field.visibleBoundsOffsetZ'), type: 'number',
          value: values.visibleBoundsOffsetZ, step: 0.1
        }, showRender),

    animation_header: advancedField(
        {type: 'info', text: `### ${t('eme.section.animation')}`},
        showRender),
    animationMode: advancedField({
      label: t('eme.field.animationMode'),
      type: 'select',
      options: animationModeOptions(),
      value: values.animationMode
    }, showRender),
    swingSpeed: advancedField(
        {
          label: t('eme.field.swingSpeed'), type: 'number',
          value: values.swingSpeed, step: 0.1
        }, showRender),
    walkSpeedMultiplier: advancedField(
        {
          label: t('eme.field.walkSpeedMultiplier'), type: 'number',
          value: values.walkSpeedMultiplier, step: 0.1
        }, showRender),
    idleStrength: advancedField(
        {
          label: t('eme.field.idleStrength'), type: 'number',
          value: values.idleStrength, step: 0.1
        }, showRender),
    gait: advancedField({
      label: t('eme.field.gait'),
      type: 'select',
      options: gaitOptions(),
      value: values.gait
    }, showRender)
  });

  return config;
}

function openExportDialog(options) {
  const settings = options.settings;
  const modelDimensions = options.modelDimensions;
  const visibleBounds = options.visibleBounds;
  let lastKey = `${activeModelType(options)}|${activePreset(options)}`;

  const dialog = new Dialog({
    id: 'eme_export_dialog',
    title: t('eme.dialog.title'),
    width: 560,
    form: buildFormConfig(settings, {
      preset: options.preset,
      blockPreset: options.blockPreset,
      modelType: options.modelType,
      exportType: options.exportType,
      customize: options.customize,
      showCustomization: options.showCustomization,
      experimental: options.experimental
    }),
    onFormChange(form) {
      const modelType = activeModelType(form);
      const preset = activePreset(form);
      const key = `${modelType}|${preset}`;
      if (key !== lastKey) {
        lastKey = key;
        if (modelType !== MODEL_TYPE_ENTITY || preset !== 'custom') {
          dialog.setFormValues(
              presetFormValues(preset, modelType, modelDimensions,
                  visibleBounds), false);
        }
      }
    },
    onConfirm(form) {
      const finalSettings = resolveExportSettings(form, settings,
          modelDimensions, visibleBounds);
      finalSettings.experimental = !!options.experimental;
      options.onExport(finalSettings, finalSettings.exportTarget);
    }
  });
  dialog.show();

  return dialog;
}

module.exports = {
  openExportDialog
};


/***/ },

/***/ 664
(module, __unused_webpack_exports, __webpack_require__) {

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

const {getVersions} = __webpack_require__(954);
const {
  SELECTABLE_PRESET_TYPES,
  BLOCK_ENTITY_PRESET_TYPES,
  MOVEMENT_TYPES,
  BODY_TYPES,
  GAIT_TYPES,
  BEHAVIOR_MODES,
  ANIMATION_MODES,
  isStablePreset,
  MODEL_TYPE_ENTITY,
  MODEL_TYPE_BLOCK_ENTITY
} = __webpack_require__(151);
const {t} = __webpack_require__(16);

function optionsFromEnum(values, prefix) {
  const options = {};
  values.forEach((id) => {
    options[id] = t(`${prefix}.${id}`);
  });

  return options;
}

function presetLabel(id) {
  return id === 'custom' ? t('eme.preset.custom') : t(`eme.preset.${id}`);
}

function entityPresetIds(experimental) {
  return experimental
      ? ['custom', ...SELECTABLE_PRESET_TYPES]
      : SELECTABLE_PRESET_TYPES.filter(isStablePreset);
}

function blockPresetIds(experimental) {
  return experimental
      ? [...BLOCK_ENTITY_PRESET_TYPES]
      : BLOCK_ENTITY_PRESET_TYPES.filter(isStablePreset);
}

function presetOptions(modelType, experimental, ensure) {
  const ids = modelType === MODEL_TYPE_BLOCK_ENTITY
      ? blockPresetIds(experimental) : entityPresetIds(experimental);
  if (ensure && !ids.includes(ensure)) {
    ids.push(ensure);
  }
  const options = {};
  ids.forEach((id) => {
    options[id] = presetLabel(id);
  });

  return options;
}

function modelTypeOptions() {
  return {
    [MODEL_TYPE_ENTITY]: t('eme.modelType.entity'),
    [MODEL_TYPE_BLOCK_ENTITY]: t('eme.modelType.block_entity')
  };
}

function exportTypeOptions() {
  return {
    packs: t('eme.exportType.packs'),
    mod_project: t('eme.exportType.mod_project'),
    model_only: t('eme.exportType.model_only')
  };
}

function hostEntityTypeOptions() {
  return {
    'easy_model_entities:ground_entity': t('eme.entity.ground_entity'),
    'easy_model_entities:static_entity': t('eme.entity.static_entity'),
    'easy_model_entities:aquatic_entity': t('eme.entity.aquatic_entity'),
    'easy_model_entities:amphibious_entity': t('eme.entity.amphibious_entity')
  };
}

function movementTypeOptions() {
  return optionsFromEnum(MOVEMENT_TYPES, 'eme.movement');
}

function bodyTypeOptions() {
  return optionsFromEnum(BODY_TYPES, 'eme.body');
}

function gaitOptions() {
  return optionsFromEnum(GAIT_TYPES, 'eme.gait');
}

function behaviorModeOptions() {
  return optionsFromEnum(BEHAVIOR_MODES, 'eme.behavior');
}

function animationModeOptions() {
  return optionsFromEnum(ANIMATION_MODES, 'eme.animation');
}

function versionOptions() {
  const options = {};
  getVersions().forEach((version) => {
    options[version.id] = version.enabled ? version.label
        : `${version.label} (coming soon)`;
  });

  return options;
}

module.exports = {
  presetOptions,
  modelTypeOptions,
  exportTypeOptions,
  hostEntityTypeOptions,
  movementTypeOptions,
  bodyTypeOptions,
  gaitOptions,
  behaviorModeOptions,
  animationModeOptions,
  versionOptions
};


/***/ },

/***/ 807
(module, __unused_webpack_exports, __webpack_require__) {

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

const {getDefaults, applyTemplate, deepMerge} = __webpack_require__(668);
const {
  MODEL_TYPE_ENTITY,
  MODEL_TYPE_BLOCK_ENTITY
} = __webpack_require__(151);
const {ModelDimensions} = __webpack_require__(763);
const {VisibleBounds} = __webpack_require__(508);

function settingsToForm(settings) {
  const offset = settings.rendering.visibleBoundsOffset || [0, 0, 0];

  return {
    namespace: settings.namespace,
    profileId: settings.profileId,
    targetVersion: settings.targetVersion,
    hostEntityType: settings.host.entityType,
    movementType: settings.host.movementType,
    bodyType: settings.host.bodyType,
    width: settings.dimensions.width,
    height: settings.dimensions.height,
    eyeHeight: settings.dimensions.eyeHeight,
    speed: settings.movement.speed,
    stepHeight: settings.movement.stepHeight,
    gravity: settings.movement.gravity,
    behaviorMode: settings.behavior.mode,
    maxHealth: settings.attributes.maxHealth,
    movementSpeed: settings.attributes.movementSpeed,
    followRange: settings.attributes.followRange,
    scale: settings.rendering.scale,
    shadowRadius: settings.rendering.shadowRadius,
    visibleBoundsWidth: settings.rendering.visibleBoundsWidth ?? 0,
    visibleBoundsHeight: settings.rendering.visibleBoundsHeight ?? 0,
    visibleBoundsOffsetX: offset[0],
    visibleBoundsOffsetY: offset[1],
    visibleBoundsOffsetZ: offset[2],
    animationMode: settings.animation.mode,
    swingSpeed: settings.animation.swingSpeed,
    walkSpeedMultiplier: settings.animation.walkSpeedMultiplier,
    idleStrength: settings.animation.idleStrength ?? 1,
    gait: settings.animation.gait || 'natural'
  };
}

function formToSettings(form, base) {
  return {
    schemaVersion: base.schemaVersion,
    modelType: base.modelType,
    presetType: base.presetType,
    namespace: String(form.namespace || '').trim(),
    profileId: String(form.profileId || '').trim(),
    targetVersion: base.targetVersion,
    host: {
      entityType: form.hostEntityType,
      movementType: form.movementType,
      bodyType: form.bodyType
    },
    dimensions: {
      width: Number(form.width),
      height: Number(form.height),
      eyeHeight: Number(form.eyeHeight)
    },
    movement: {
      speed: Number(form.speed),
      stepHeight: Number(form.stepHeight),
      gravity: !!form.gravity
    },
    behavior: {
      mode: form.behaviorMode,
      lookAtPlayers: base.behavior ? base.behavior.lookAtPlayers : true,
      randomStroll: base.behavior ? base.behavior.randomStroll : false
    },
    attributes: {
      maxHealth: Number(form.maxHealth),
      movementSpeed: Number(form.movementSpeed),
      followRange: Number(form.followRange)
    },
    rendering: {
      scale: Number(form.scale),
      shadowRadius: Number(form.shadowRadius),
      visibleBoundsWidth: Number(form.visibleBoundsWidth),
      visibleBoundsHeight: Number(form.visibleBoundsHeight),
      visibleBoundsOffset: [
        Number(form.visibleBoundsOffsetX),
        Number(form.visibleBoundsOffsetY),
        Number(form.visibleBoundsOffsetZ)
      ]
    },
    animation: {
      mode: form.animationMode,
      swingSpeed: Number(form.swingSpeed),
      walkSpeedMultiplier: Number(form.walkSpeedMultiplier),
      idleStrength: Number(form.idleStrength),
      gait: form.gait
    }
  };
}

function activeModelType(form) {
  return form.exportType === 'model_only'
      ? MODEL_TYPE_ENTITY : (form.modelType || MODEL_TYPE_ENTITY);
}

function activePreset(form) {
  return activeModelType(form) === MODEL_TYPE_BLOCK_ENTITY
      ? (form.blockPreset || 'static') : (form.preset || 'custom');
}

function presetFormValues(presetType, modelType, modelDimensions,
    visibleBounds) {
  const settings = ModelDimensions.applyModelDimensions(
      applyTemplate(presetType, modelType), modelDimensions);
  VisibleBounds.applyVisibleBounds(settings, visibleBounds);
  const form = settingsToForm(settings);
  delete form.namespace;
  delete form.profileId;
  delete form.targetVersion;

  return form;
}

function resolveExportSettings(form, base, modelDimensions, visibleBounds) {
  const exportType = form.exportType || 'packs';
  const modelType = activeModelType(form);
  const preset = activePreset(form);

  let settings;
  if (modelType !== MODEL_TYPE_BLOCK_ENTITY && preset === 'custom') {
    settings = deepMerge(getDefaults(), base);
  } else {
    settings = ModelDimensions.applyModelDimensions(
        applyTemplate(preset, modelType), modelDimensions);
    VisibleBounds.applyVisibleBounds(settings, visibleBounds);
  }

  settings.schemaVersion = base.schemaVersion || settings.schemaVersion;
  settings.modelType = modelType;
  settings.presetType = preset;
  settings.namespace = String(form.namespace || '').trim();
  settings.profileId = String(form.profileId || '').trim();
  settings.targetVersion = form.targetVersion;

  if (form.customize) {
    settings = formToSettings(form, settings);
  }
  settings.customize = !!form.customize;
  settings.exportType = exportType;
  settings.exportTarget = exportType === 'packs' ? 'packs' : 'mod_project';
  settings.modelOnly = exportType === 'model_only';

  return settings;
}

module.exports = {
  settingsToForm,
  formToSettings,
  activeModelType,
  activePreset,
  presetFormValues,
  resolveExportSettings
};


/***/ },

/***/ 317
(module, __unused_webpack_exports, __webpack_require__) {

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

const {describeTextureSource} = __webpack_require__(834);

let patchedVue = null;
let originalGetDescription = null;

function texturesPanelVue() {
  const panel = (typeof Panels !== 'undefined' && Panels.textures)
      || (typeof Interface !== 'undefined' && Interface.Panels
          && Interface.Panels.textures);

  return (panel && panel.inside_vue) || null;
}

function patchTexturePanel(formatId) {
  const vue = texturesPanelVue();
  if (!vue || typeof vue.getDescription !== 'function'
      || originalGetDescription) {
    return;
  }

  const original = vue.getDescription.bind(vue);
  patchedVue = vue;
  originalGetDescription = original;
  vue.getDescription = function (texture) {
    const base = original(texture);
    try {
      if (typeof Format !== 'undefined' && Format && Format.id === formatId) {
        const {label} = describeTextureSource({
          namespace: texture.namespace,
          folder: texture.folder,
          name: texture.name,
          path: texture.path
        });

        return `${base} - ${label}`;
      }
    } catch (error) {
      // Display nicety only; never break the panel render.
    }

    return base;
  };
}

function unpatchTexturePanel() {
  if (patchedVue && originalGetDescription) {
    patchedVue.getDescription = originalGetDescription;
  }
  patchedVue = null;
  originalGetDescription = null;
}

module.exports = {patchTexturePanel, unpatchTexturePanel};


/***/ },

/***/ 20
(module) {

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

class ResourceLocation {
  static #NAMESPACE_PATTERN = /^[a-z0-9_.-]+$/;
  static #PATH_PATTERN = /^[a-z0-9_./-]+$/;

  static isValidNamespace(namespace) {
    return typeof namespace === 'string'
        && ResourceLocation.#NAMESPACE_PATTERN.test(namespace);
  }

  static isValidPath(path) {
    return typeof path === 'string' && ResourceLocation.#PATH_PATTERN.test(path)
        && !path.includes('..');
  }

  static isValidResourceLocation(value) {
    if (typeof value !== 'string' || !value.includes(':')) {
      return false;
    }
    const parts = value.split(':');
    if (parts.length !== 2) {
      return false;
    }
    return ResourceLocation.isValidNamespace(parts[0])
        && ResourceLocation.isValidPath(parts[1]);
  }

  static parseResourceLocation(value) {
    if (!ResourceLocation.isValidResourceLocation(value)) {
      return null;
    }
    const parts = value.split(':');
    return {namespace: parts[0], path: parts[1]};
  }

  static buildResourceLocation(namespace, path) {
    return `${namespace}:${path}`;
  }

  // e.g. "My Model.bbmodel" -> "my_model"
  static sanitizeProfileId(name) {
    const base = String(name || '')
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_./-]+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^[_./-]+|[_./-]+$/g, '');
    return base.length > 0 ? base : 'entity';
  }
}

module.exports = {ResourceLocation};


/***/ },

/***/ 834
(module) {

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

// Resolves Blockbench textures to mod resource locations. A texture that lives
// under an existing assets/<ns>/textures tree (vanilla or another mod) is only
// referenced; everything else is a custom texture packed as a PNG file.

const ASSETS_PATTERN = /assets\/([a-z0-9_.-]+)\/textures\/(.+?)(?:\.png)?$/i;

function stripPng(value) {
  return value.replace(/\.png$/i, '');
}

function trimSlashes(value) {
  return value.replace(/^\/+|\/+$/g, '');
}

function defaultTextureLocation(settings) {
  return `${settings.namespace}:textures/entity/${settings.profileId}.png`;
}

function customFileName(settings, index) {
  return index === 0
      ? `${settings.profileId}.png`
      : `${settings.profileId}_${index}.png`;
}

function customLocation(settings, index) {
  return `${settings.namespace}:textures/entity/${customFileName(settings,
      index)}`;
}

function parseExternalLocation(descriptor) {
  const namespace = String(descriptor.namespace || '').trim().toLowerCase();
  if (namespace) {
    const folder = trimSlashes(String(descriptor.folder || '').trim());
    const name = stripPng(String(descriptor.name || '').trim()).toLowerCase();
    if (!name) {
      return null;
    }
    const rest = folder ? `${folder.toLowerCase()}/${name}` : name;

    return `${namespace}:textures/${rest}.png`;
  }

  const path = String(descriptor.path || '').replace(/\\/g, '/');
  const match = path.match(ASSETS_PATTERN);
  if (match && match[1].toLowerCase() === 'minecraft') {
    return `minecraft:textures/${match[2].toLowerCase()}.png`;
  }

  return null;
}

function describeTextureSource(descriptor) {
  const location = parseExternalLocation(descriptor);
  return location
      ? {
        external: true, label: location.replace(':textures/', ':').replace(
            /\.png$/i, '')
      }
      : {external: false, label: 'Custom Texture'};
}

function resolveTextures(descriptors, settings) {
  const defaultLocation = defaultTextureLocation(settings);
  const textures = {};
  const packed = [];
  let texture = null;

  (descriptors || []).forEach((descriptor, position) => {
    const index = Number.isInteger(descriptor.index) ? descriptor.index
        : position;
    let location = parseExternalLocation(descriptor);
    if (!location) {
      location = customLocation(settings, index);
      packed.push({
        fileName: customFileName(settings, index),
        bytes: descriptor.bytes
      });
    }

    if (index === 0) {
      if (location !== defaultLocation) {
        texture = location;
      }
    } else {
      textures[index] = location;
    }
  });

  return {texture, textures, packed};
}

module.exports = {
  resolveTextures,
  parseExternalLocation,
  describeTextureSource
};


/***/ },

/***/ 803
(module) {

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

// Deterministic, dependency-free 32-bit FNV-1a hash rendered as 8 hex chars.
// Used to derive a stable content version stamp without requiring node crypto.
function hashString(value) {
  let hash = 0x811c9dc5;
  const text = String(value);
  for (let i = 0; i < text.length; i++) {
    hash ^= text.codePointAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(16).padStart(8, '0');
}

module.exports = {hashString};


/***/ },

/***/ 734
(module) {

"use strict";
module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg width=\"100%\" height=\"100%\" viewBox=\"0 0 100 100\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" xmlns:serif=\"http://www.serif.com/\" style=\"fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;\"><g><g id=\"Area\"><path d=\"M49.867,41.792l32.433,-17.042l0,47.275l-32.433,16.492l0,-46.725Z\" style=\"fill:#8cc63f;fill-rule:nonzero;\"/></g></g><g id=\"Cube\"><g><path d=\"M49.867,8.258l32.433,16.492l0,47.275l-32.433,16.492\" style=\"fill:none;fill-rule:nonzero;stroke:#231f20;stroke-width:8.79px;\"/></g><g><path d=\"M17.433,24.75l32.433,17.042\" style=\"fill:none;fill-rule:nonzero;stroke:#231f20;stroke-width:8.79px;stroke-dasharray:12.092,12.092;\"/></g><g><path d=\"M17.433,24.75l0,47.275l32.433,16.492l-0,-46.725\" style=\"fill:none;fill-rule:nonzero;stroke:#231f20;stroke-width:8.79px;stroke-dasharray:12.092,12.092;\"/></g><g><path d=\"M17.792,23.913l32.075,-15.654\" style=\"fill:none;fill-rule:nonzero;stroke:#231f20;stroke-width:8.96px;\"/></g><g><path d=\"M48.913,40.679l32.075,-15.654\" style=\"fill:none;fill-rule:nonzero;stroke:#231f20;stroke-width:8.96px;\"/></g></g></svg>";

/***/ },

/***/ 448
(module) {

"use strict";
module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg width=\"100%\" height=\"100%\" viewBox=\"0 0 100 100\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xml:space=\"preserve\" xmlns:serif=\"http://www.serif.com/\" style=\"fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;\"><g><g id=\"Area\"><path d=\"M37.367,41.792l32.433,-17.041l0,47.275l-32.433,16.491l0,-46.726Z\" style=\"fill:#8cc63f;fill-rule:nonzero;\"/></g></g><g id=\"Cube\"><g><path d=\"M37.367,8.26l32.433,16.491l0,47.275l-32.433,16.491\" style=\"fill:none;fill-rule:nonzero;stroke:#231f20;stroke-width:8.8px;\"/></g><g><path d=\"M4.934,24.751l32.433,17.041\" style=\"fill:none;fill-rule:nonzero;stroke:#231f20;stroke-width:8.8px;stroke-dasharray:12.094,12.094;\"/></g><g><path d=\"M4.934,24.751l0,47.275l32.433,16.491l0,-46.726\" style=\"fill:none;fill-rule:nonzero;stroke:#231f20;stroke-width:8.8px;stroke-dasharray:12.094,12.094;\"/></g><g><path d=\"M5.291,23.914l32.077,-15.653\" style=\"fill:none;fill-rule:nonzero;stroke:#231f20;stroke-width:8.96px;\"/></g><g><path d=\"M36.411,40.679l32.077,-15.653\" style=\"fill:none;fill-rule:nonzero;stroke:#231f20;stroke-width:8.96px;\"/></g></g><g id=\"Arrow\"><g><path d=\"M59.257,55.222l35.05,0\" style=\"fill:none;fill-rule:nonzero;stroke:#00652e;stroke-width:8.8px;\"/></g><g><path d=\"M81.113,40.143l13.193,15.079l-11.934,13.298\" style=\"fill:none;fill-rule:nonzero;stroke:#00652e;stroke-width:8.8px;\"/></g></g></svg>";

/***/ },

/***/ 377
(module) {

"use strict";
module.exports = "# {{id}} - Easy Model Entities pack\n\nGenerated by the **Easy Model Entities Exporter** Blockbench plugin for the **Easy Model Entities**\nmod on **{{mcVersion}}**.\n\n> **Beta:** The exporter is still in beta. The pack format may change in a future version, so you\n> might need to re-export this pack after updating the plugin or the mod.\n\nThis archive contains two ready-to-use packs that belong together. Their file names are prefixed\nwith the model id so several exported packs can live in the same folder without overwriting each\nother:\n\n- `{{datapackFile}}`: the server-side entity profile (gameplay data)\n- `{{resourcepackFile}}`: the model, texture and render profile (visuals)\n\nProfile ID: `{{serverProfileId}}`\n\n## Model Format\n\nThis pack was exported using the **Easy Model Entity** format (`eme_entity`), which is provided by\nthis plugin and tailored specifically for the Easy Model Entities mod. If you need to re-edit the\nmodel, open it in Blockbench and select **Easy Model Entity** as the format. Alternatively, the\nstandard **Modded Entity** format (built into Blockbench) is also supported and can be exported\nwith the same plugin.\n\n## Requirements\n\nYou need the **Easy Model Entities** mod installed for **{{mcVersion}}** (Forge or Fabric).\nWithout the mod these files do nothing. Get the mod from:\n\n- [CurseForge](https://www.curseforge.com/minecraft/mc-mods/easy-model-entities)\n- [Modrinth](https://modrinth.com/mod/easy-model-entities)\n\nInstall it like any other mod before using this pack.\n\n## Installation\n\nYou do not need to unpack anything — just move the two ZIP files into the right folders.\n\n### 1. Resource Pack (visuals, client side)\n\nMove `{{resourcepackFile}}` into your Minecraft resourcepacks folder:\n\n- Windows: `%appdata%\\.minecraft\\resourcepacks\\`\n- Linux: `~/.minecraft/resourcepacks/`\n- macOS: `~/Library/Application Support/minecraft/resourcepacks/`\n\nThen start Minecraft and enable the pack under **Options > Resource Packs**.\n\n### 2. Data Pack (gameplay, world / server side)\n\nMove `{{datapackFile}}` into your world's `datapacks` folder:\n\n- Single player: `.minecraft/saves/<world>/datapacks/`\n- Dedicated server: `<server folder>/world/datapacks/`\n\nLoad the world (or run `/reload` in game). On a dedicated server the Easy Model Entities mod must be\ninstalled on the server as well.\n\n> Install **both** packs. The data pack defines the entity, the resource pack provides its model and\n> texture.\n";

/***/ },

/***/ 896
(module) {

"use strict";
module.exports = require("fs");

/***/ },

/***/ 928
(module) {

"use strict";
module.exports = require("path");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
} = __webpack_require__(668);
const {ModelDimensions} = __webpack_require__(763);
const {VisibleBounds} = __webpack_require__(508);
const {PresetDetector} = __webpack_require__(858);
const {ResourceLocation} = __webpack_require__(20);
const {resolveTextures} = __webpack_require__(834);
const {patchTexturePanel, unpatchTexturePanel} = __webpack_require__(317);
const {Validator} = __webpack_require__(229);
const {buildPackBundle, buildModProjectFiles} = __webpack_require__(869);
const {BlockbenchAdapter} = __webpack_require__(833);
const {openExportDialog} = __webpack_require__(924);
const {registerTranslations, t} = __webpack_require__(16);
const exportIconSvg = __webpack_require__(448);
const createIconSvg = __webpack_require__(734);
const {FORMAT_ID, registerEmeFormat, unregisterEmeFormat} = __webpack_require__(
    995);
const {registerEmeCodecHooks, unregisterEmeCodecHooks} = __webpack_require__(
    670);

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
  const visibleBounds = VisibleBounds.derive(BlockbenchAdapter.getModelCubes());

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
    visibleBounds,
    modelDimensions: ModelDimensions.deriveDimensions(bounds,
        settings.host.bodyType)
  };
}

function formatIssues(issues) {
  return issues.map((issue) => `• ${issue.message}`).join('\n');
}

function runExport(settings, target) {
  const textureResolution = resolveTextures(
      BlockbenchAdapter.collectTextures(), settings);
  const result = Validator.validateSettings(settings,
      BlockbenchAdapter.getModelStats());

  if (!result.valid) {
    Blockbench.showMessageBox({
      title: t('eme.dialog.title'),
      message: 'Export blocked. Please fix the following issues:\n\n'
          + formatIssues(result.errors)
    });
    return;
  }

  const doExport = () => performExport(settings, target, textureResolution);

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

function performExport(settings, target, textureResolution) {
  const options = {
    modelBytes: BlockbenchAdapter.getModelBytes(),
    textureResolution
  };

  BlockbenchAdapter.saveSettings(settings);

  if (target === 'mod_project') {
    exportToModProject(settings, options);
  } else {
    exportToZip(settings, options);
  }
}

function exportToZip(settings, options) {
  BlockbenchAdapter.exportPackBundle(
      buildPackBundle(settings, options),
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
    visibleBounds: state.visibleBounds,
    onExport: runExport
  });
}

BBPlugin.register('easy_model_entities', {
  title: 'Easy Model Entities',
  icon: 'icon.png',
  author: 'Markus Bordihn',
  description: 'Export Blockbench models for the Easy Model Entities mod (Minecraft: Java Edition) as ready-to-install Data Pack and Resource Pack files.',
  tags: ['Minecraft: Java Edition', 'Format', 'Exporter', 'Entity'],
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
      name: 'Export Easy Model Entity Pack',
      description: 'Export the current project as Easy Model Entities Data Pack and Resource Pack.',
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

/******/ })()
;