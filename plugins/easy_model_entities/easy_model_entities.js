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
const {normalizeName} = __webpack_require__(151);
const {parseExternalLocation} = __webpack_require__(834);
const {LocalizedError, t} = __webpack_require__(16);

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

  static #allOf(typeName) {
    return globalThis[typeName]?.all || [];
  }

  static #firstTexture() {
    if (typeof Texture === 'undefined') {
      return null;
    }

    return Texture.getDefault?.() || Texture.all?.[0] || null;
  }

  static #describeTexture(texture, position) {
    return {
      index: position,
      name: texture.name || '',
      namespace: texture.namespace || '',
      folder: texture.folder || '',
      path: texture.path || ''
    };
  }

  static collectTextureLocations() {
    return BlockbenchAdapter.#allOf('Texture').map((texture, position) =>
        BlockbenchAdapter.#describeTexture(texture, position));
  }

  static collectTextures() {
    return BlockbenchAdapter.#allOf('Texture').map((texture, position) => ({
      ...BlockbenchAdapter.#describeTexture(texture, position),
      bytes: BlockbenchAdapter.#base64ToBytes(texture.getBase64())
    }));
  }

  static #externalTextureLocations() {
    return BlockbenchAdapter.collectTextureLocations()
    .map(parseExternalLocation)
    .filter((location) => location && !location.startsWith('minecraft:'));
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

  static #outlinerList(key) {
    return typeof Outliner !== 'undefined' && Outliner[key] ? Outliner[key]
        : [];
  }

  static #hasUnsupportedFaceRotation(cube) {
    return Object.values(cube.faces || {}).some(
        (face) => !!face?.rotation && face.rotation % 90 !== 0);
  }

  static #hasMixedFaceTextures(cube) {
    const faceTextures = Object.values(cube.faces || {})
    .map((face) => face?.texture)
    .filter((faceTexture) => faceTexture !== null && faceTexture !== undefined
        && faceTexture !== false);

    return new Set(faceTextures).size > 1;
  }

  static #hasCustomUvSize(texture) {
    return typeof Format !== 'undefined' && !!Format?.per_texture_uv_size
        && ((texture.uv_width ?? Project.texture_width)
            !== Project.texture_width
            || (texture.uv_height ?? Project.texture_height)
            !== Project.texture_height);
  }

  static #collectGeometry() {
    const elements = BlockbenchAdapter.#outlinerList('elements');
    const rootNodes = BlockbenchAdapter.#outlinerList('root');
    const groups = BlockbenchAdapter.#allOf('Group');
    const textures = BlockbenchAdapter.#allOf('Texture');
    const cubes = elements.filter((element) => element.type === 'cube');
    const names = (list) => list.map((node) => node.name || '');

    return {
      formatId: typeof Format !== 'undefined' && Format ? Format.id : '',
      unsupportedElements: elements
      .filter((element) => element.type !== 'cube')
      .map((element) => `${element.name || ''} (${element.type})`),
      rootCubes: names(rootNodes.filter((node) => node.type === 'cube')),
      rotatedFaceCubes: names(cubes.filter(
          (cube) => BlockbenchAdapter.#hasUnsupportedFaceRotation(cube))),
      mixedTextureCubes: names(cubes.filter(
          (cube) => BlockbenchAdapter.#hasMixedFaceTextures(cube))),
      customUvSizeTextures: names(textures.filter(
          (texture) => BlockbenchAdapter.#hasCustomUvSize(texture))),
      hiddenNodes: names([...groups, ...elements].filter(
          (node) => node.visibility === false)),
      exportedGroupNames: names(groups.filter(
          (group) => BlockbenchAdapter.#isExported(group)))
    };
  }

  static #isExported(node) {
    for (let current = node; current && typeof current === 'object';
        current = current.parent) {
      if (current.export === false) {
        return false;
      }
    }

    return true;
  }

  static getModelFileSize() {
    if (typeof Codecs === 'undefined' || !Codecs.project) {
      return undefined;
    }

    return String(BlockbenchAdapter.getModelBytes()).length;
  }

  static getModelLoadStats() {
    const cubes = BlockbenchAdapter.#allOf('Cube');
    const groups = BlockbenchAdapter.#allOf('Group');
    const animations = BlockbenchAdapter.#allOf('Animation');
    const geometry = BlockbenchAdapter.#collectGeometry();

    return {
      hasModel: cubes.length > 0 || groups.length > 0,
      hasTexture: !!BlockbenchAdapter.#firstTexture(),
      animationCount: animations.length,
      boneNames: geometry.exportedGroupNames,
      geometry: geometry
    };
  }

  static getModelStats() {
    const cubes = BlockbenchAdapter.#allOf('Cube');
    const groups = BlockbenchAdapter.#allOf('Group');
    const animations = BlockbenchAdapter.#allOf('Animation');
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
      ...BlockbenchAdapter.getModelLoadStats(),
      cubeCount: cubes.length,
      boneCount: groups.length,
      animations: animations.map(
          (animation) => BlockbenchAdapter.#summarizeAnimation(animation)),
      hierarchyDepth: maxDepth,
      externalTextures: BlockbenchAdapter.#externalTextureLocations(),
      textureWidth: texture ? texture.width : undefined,
      textureHeight: texture ? texture.height : undefined
    };
  }

  static wrapInRootBone(undoLabel) {
    const rootNodes = [...BlockbenchAdapter.#outlinerList('root')];
    Undo.initEdit({outliner: true});
    const root = rootNodes.find(
            (node) => node.type === 'group' && normalizeName(node.name) === 'root')
        || new Group({name: 'root', origin: [0, 0, 0]}).init();
    rootNodes
    .filter((node) => node !== root)
    .forEach((node) => node.addTo(root));
    Canvas.updateAll();
    Undo.finishEdit(undoLabel);
  }

  static getModelBytes() {
    return Codecs.project.compile({raw: false});
  }

  static getModelBounds() {
    const cubes = BlockbenchAdapter.#allOf('Cube');
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
    return BlockbenchAdapter.#allOf('Cube').map((cube) => ({
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
    if (stored && typeof stored === 'object' && Object.keys(stored).length
        > 0) {
      return structuredClone(stored);
    }

    return null;
  }

  static saveSettings(settings) {
    if (typeof Project !== 'undefined' && Project) {
      Project[BlockbenchAdapter.PROJECT_PROPERTY] = structuredClone(
          settings);
      if (typeof Canvas !== 'undefined' && Canvas.updateRenderSides) {
        Canvas.updateRenderSides();
      }
    }
  }

  static #zipTo(files, outputType) {
    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.path, file.content);
    });

    return zip.generateAsync({type: outputType});
  }

  static #bundleBlob(bundle) {
    if (!bundle.datapack) {
      return BlockbenchAdapter.#zipTo(bundle.resourcepack, 'blob');
    }

    if (!bundle.resourcepack) {
      return BlockbenchAdapter.#zipTo(bundle.datapack, 'blob');
    }

    return Promise.all([
      BlockbenchAdapter.#zipTo(bundle.datapack, 'uint8array'),
      BlockbenchAdapter.#zipTo(bundle.resourcepack, 'uint8array')
    ]).then(([datapackZip, resourcepackZip]) => {
      const outer = new JSZip();
      outer.file(bundle.readme.path, bundle.readme.content);
      outer.file(bundle.datapackFileName || 'datapack.zip', datapackZip);
      outer.file(bundle.resourcepackFileName || 'resourcepack.zip',
          resourcepackZip);
      return outer.generateAsync({type: 'blob'});
    });
  }

  static exportPackBundle(bundle, name) {
    return BlockbenchAdapter.#bundleBlob(bundle).then((content) => {
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
      const result = Validator.validateOutputPath(file.path);
      if (!result.valid) {
        throw new LocalizedError(`eme.validation.${result.code}`, file.path);
      }
      const fullPath = path.join(rootDir, file.path);
      fs.mkdirSync(path.dirname(fullPath), {recursive: true});
      const data =
          file.binary && file.content instanceof Uint8Array ? Buffer.from(
              file.content) : file.content;
      fs.writeFileSync(fullPath, data);
    });
  }

  static confirm(title, message, confirmLabel, onConfirm) {
    Blockbench.showMessageBox(
        {
          title: title,
          message: message,
          buttons: [confirmLabel, t('eme.button.cancel')],
          confirm: 0,
          cancel: 1
        },
        (button) => {
          if (button === 0) {
            onConfirm();
          }
        }
    );
  }

  static pickDirectory(title) {
    return Blockbench.pickDirectory(
        {title: title, resource_id: 'eme_mod_project'});
  }

  static registerValidatorCheck(id, name, formatIds, collectErrors) {
    const check = new ValidatorCheck(id, {
      update_triggers: ['update_selection', 'add_texture'],
      condition: {formats: formatIds},
      run() {
        collectErrors().forEach((issue) => this.fail({message: issue.message}));
      }
    });
    check.name = name;

    return check;
  }
}

module.exports = {BlockbenchAdapter};


/***/ },

/***/ 44
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

const {normalizeName} = __webpack_require__(151);
const {hashString} = __webpack_require__(803);

const PARENT_FINGERPRINT = 'eme_parent_fingerprint';

const STATUS = Object.freeze({
  CURRENT: 'current',
  PARENT_CHANGED: 'parentChanged',
  LOCAL_CHANGED: 'localChanged',
  BOTH_CHANGED: 'bothChanged',
  NEW_IN_PARENT: 'newInParent',
  REMOVED_LOCALLY: 'removedLocally',
  MISSING_IN_PARENT: 'missingInParent'
});

const PRESELECTED_STATUSES = new Set(
    [STATUS.PARENT_CHANGED, STATUS.NEW_IN_PARENT]);
const PARENT_UPDATE_STATUSES = new Set(
    [STATUS.PARENT_CHANGED, STATUS.BOTH_CHANGED, STATUS.NEW_IN_PARENT]);
const LOCAL_CHANGE_STATUSES = new Set(
    [STATUS.LOCAL_CHANGED, STATUS.BOTH_CHANGED]);

const BEZIER_FIELDS = ['bezier_linked', 'bezier_left_time',
  'bezier_left_value', 'bezier_right_time', 'bezier_right_value'];
const MOLANG_FIELDS = ['anim_time_update', 'blend_weight', 'start_delay',
  'loop_delay'];

function canonicalValue(value) {
  if (typeof value === 'number') {
    return Number(value.toFixed(4));
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed !== '' && Number.isFinite(Number(trimmed))) {
      return Number(Number(trimmed).toFixed(4));
    }

    return trimmed;
  }

  if (Array.isArray(value)) {
    return value.map(canonicalValue);
  }

  return value ?? '';
}

function canonicalObject(object) {
  return Object.fromEntries(Object.keys(object || {}).sort()
  .map((key) => [key, canonicalValue(object[key])]));
}

function canonicalKeyframe(keyframe) {
  const interpolation = keyframe.interpolation || 'linear';
  const canonical = {
    channel: keyframe.channel,
    time: canonicalValue(keyframe.time),
    interpolation: interpolation,
    data_points: (keyframe.data_points || []).map(canonicalObject)
  };
  if (interpolation === 'bezier') {
    BEZIER_FIELDS.forEach((field) => {
      canonical[field] = canonicalValue(keyframe[field]);
    });
  }

  return canonical;
}

function compareKeyframes(first, second) {
  if (first.channel !== second.channel) {
    return first.channel < second.channel ? -1 : 1;
  }

  return first.time - second.time;
}

function isBone(animator) {
  return !animator.type || animator.type === 'bone';
}

function isKnownBone(animator, boneNames) {
  return !boneNames || !isBone(animator)
      || boneNames.has(normalizeName(animator.name));
}

function animatedAnimators(animation) {
  return Object.values(animation.animators || {})
  .filter((animator) => (animator.keyframes || []).length > 0);
}

function canonicalAnimators(animation, boneNames) {
  const animators = {};
  animatedAnimators(animation)
  .filter((animator) => isKnownBone(animator, boneNames))
  .forEach((animator) => {
    animators[`${animator.type || 'bone'}:${normalizeName(animator.name)}`] =
        JSON.stringify({
          rotation_global: !!animator.rotation_global,
          quaternion_interpolation: !!animator.quaternion_interpolation,
          keyframes: animator.keyframes.map(canonicalKeyframe).sort(
              compareKeyframes)
        });
  });

  return animators;
}

function canonicalSettings(animation) {
  const settings = {
    length: canonicalValue(animation.length),
    loop: animation.loop || 'once',
    override: !!animation.override
  };
  MOLANG_FIELDS.forEach((field) => {
    settings[field] = canonicalValue(animation[field]);
  });

  return settings;
}

function fingerprintAnimation(animation, boneNames) {
  const animators = canonicalAnimators(animation, boneNames);

  return hashString(JSON.stringify({
    settings: canonicalSettings(animation),
    animators: Object.keys(animators).sort().map(
        (key) => [key, animators[key]])
  }));
}

function boneNameSet(bones) {
  return new Set(bones.map((bone) => normalizeName(bone.name)));
}

function describeDifferences(parentAnimation, childAnimation, boneNames) {
  const parentAnimators = canonicalAnimators(parentAnimation, boneNames);
  const childAnimators = canonicalAnimators(childAnimation, boneNames);
  const keys = new Set(
      [...Object.keys(parentAnimators), ...Object.keys(childAnimators)]);
  const bones = [...keys]
  .filter((key) => parentAnimators[key] !== childAnimators[key])
  .map((key) => key.slice(key.indexOf(':') + 1))
  .sort();
  const parentSettings = canonicalSettings(parentAnimation);
  const childSettings = canonicalSettings(childAnimation);
  const settings = Object.keys(parentSettings)
  .filter((field) => parentSettings[field] !== childSettings[field])
  .map((field) => ({
    field: field,
    local: childSettings[field],
    parent: parentSettings[field]
  }));

  return {bones, settings};
}

function missingBones(parentAnimation, bones) {
  const boneNames = boneNameSet(bones);

  return animatedAnimators(parentAnimation)
  .filter((animator) => !isKnownBone(animator, boneNames))
  .map((animator) => String(animator.name || ''));
}

function isInherited(animation, groupName) {
  return !!animation[PARENT_FINGERPRINT]
      && (animation.group_name || '') === groupName;
}

function inheritedStatus(parent, child, boneNames) {
  const parentFingerprint = fingerprintAnimation(parent, boneNames);
  const childFingerprint = fingerprintAnimation(child, boneNames);
  if (parentFingerprint === childFingerprint) {
    return STATUS.CURRENT;
  }

  if (parentFingerprint === child[PARENT_FINGERPRINT]) {
    return STATUS.LOCAL_CHANGED;
  }

  return childFingerprint === child[PARENT_FINGERPRINT]
      ? STATUS.PARENT_CHANGED : STATUS.BOTH_CHANGED;
}

function compareWithParent(
    {parentAnimations, childAnimations, knownNames, groupName, bones}) {
  const boneNames = boneNameSet(bones);
  const known = new Set(knownNames || []);
  const childrenByName = new Map(
      childAnimations.map((animation) => [animation.name, animation]));
  const parentNames = new Set(parentAnimations.map((parent) => parent.name));

  const entries = parentAnimations
  .map((parent) => ({parent, child: childrenByName.get(parent.name)}))
  .filter(({child}) => !child || isInherited(child, groupName))
  .map(({parent, child}) => {
    const entry = {
      name: parent.name,
      parent: parent,
      child: child,
      missingBones: missingBones(parent, bones)
    };
    if (!child) {
      return {
        ...entry,
        status: known.has(parent.name) ? STATUS.REMOVED_LOCALLY
            : STATUS.NEW_IN_PARENT
      };
    }

    const status = inheritedStatus(parent, child, boneNames);

    return {
      ...entry,
      status: status,
      differences: status === STATUS.CURRENT ? null
          : describeDifferences(parent, child, boneNames)
    };
  });

  childAnimations
  .filter((child) => isInherited(child, groupName)
      && !parentNames.has(child.name))
  .forEach((child) => entries.push({
    name: child.name,
    child: child,
    missingBones: [],
    status: STATUS.MISSING_IN_PARENT
  }));

  return entries;
}

function remapAnimators(animators, bones) {
  const byUuid = new Map(bones.map((bone) => [bone.uuid, bone]));
  const byName = new Map(bones.map((bone) => [normalizeName(bone.name), bone]));
  const remapped = {};
  Object.entries(animators || {}).forEach(([key, animator]) => {
    if (!isBone(animator)) {
      remapped[key] = animator;
      return;
    }

    const bone = byUuid.get(key) || byName.get(normalizeName(animator.name));
    if (bone) {
      remapped[bone.uuid] = {...animator, name: bone.name};
    }
  });

  return remapped;
}

function createInheritedAnimation(parentAnimation, groupName, bones) {
  const data = structuredClone(parentAnimation);
  delete data.uuid;
  delete data.selected;
  data.animators = remapAnimators(data.animators, bones);
  data.group_name = groupName;
  data[PARENT_FINGERPRINT] = fingerprintAnimation(parentAnimation,
      boneNameSet(bones));

  return data;
}

function needsParentUpdate(entries) {
  return entries.some((entry) => PARENT_UPDATE_STATUSES.has(entry.status));
}

module.exports = {
  PARENT_FINGERPRINT,
  STATUS,
  PRESELECTED_STATUSES,
  LOCAL_CHANGE_STATUSES,
  fingerprintAnimation,
  boneNameSet,
  missingBones,
  isInherited,
  compareWithParent,
  remapAnimators,
  createInheritedAnimation,
  needsParentUpdate
};


/***/ },

/***/ 982
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

const path = __webpack_require__(928);
const {BlockbenchAdapter} = __webpack_require__(833);
const {FORMAT_ID} = __webpack_require__(995);
const {t} = __webpack_require__(16);
const {
  PARENT_FINGERPRINT,
  STATUS,
  PRESELECTED_STATUSES,
  LOCAL_CHANGE_STATUSES,
  fingerprintAnimation,
  boneNameSet,
  missingBones,
  isInherited,
  compareWithParent,
  createInheritedAnimation,
  needsParentUpdate
} = __webpack_require__(44);

const LINK_KEY = 'emeAnimationParent';
const PROJECT_LINK = 'eme_animation_parent';
const MESSAGE_DURATION = 4000;

const checkedParentTimes = new WeakMap();
const savedStates = new WeakMap();
const warnedAnimations = new Set();
const registrations = [];
let fingerprintProperty;
let parentAction;
let syncAction;
let animationMenuItem;
let groupMenuItem;
let nativeFileSystem;

// Blockbench 5 asks the user for every fs request of a plugin, so only an action the user started
// may ask; background checks use the module only once it was granted.
function getFileSystem(askPermission) {
  if (!nativeFileSystem) {
    nativeFileSystem = requireNativeModule('fs', askPermission
        ? {message: t('eme.inherit.permission')}
        : {show_permission_dialog: false});
  }

  return nativeFileSystem;
}

function isEmeFormat() {
  return typeof Format !== 'undefined' && Format?.id === FORMAT_ID;
}

function getLink(project = Project) {
  return project?.[PROJECT_LINK] || null;
}

function isLinked() {
  return isEmeFormat() && !!getLink();
}

function parentPathOf(project) {
  const link = getLink(project);
  if (!link || !project.save_path) {
    return null;
  }

  return path.resolve(path.dirname(project.save_path), link.path);
}

function groupNameOf(parentPath) {
  return path.basename(parentPath, path.extname(parentPath));
}

function samePath(first, second) {
  const normalize = (file) => SystemInfo.platform === 'win32'
      ? path.resolve(file).toLowerCase() : path.resolve(file);

  return normalize(first) === normalize(second);
}

function showMessage(key, ...params) {
  Blockbench.showQuickMessage(t(key, ...params), MESSAGE_DURATION);
}

function readParentAnimations(parentPath) {
  const model = JSON.parse(
      getFileSystem(true).readFileSync(parentPath, 'utf-8'));

  return Array.isArray(model.animations) ? model.animations : [];
}

function projectBones() {
  return Group.all.map((group) => ({uuid: group.uuid, name: group.name}));
}

// A check the user did not start stays silent when the parent is missing and skips a parent that
// has not changed since the last check, so switching tabs never asks twice.
function compareProjectWithParent(userStarted) {
  const parentPath = isEmeFormat() && parentPathOf(Project);
  const fs = parentPath && getFileSystem(userStarted);
  if (!fs) {
    return null;
  }

  if (!fs.existsSync(parentPath)) {
    if (userStarted) {
      showMessage('eme.inherit.parentMissing', getLink().path);
    }
    return null;
  }

  const modified = fs.statSync(parentPath).mtimeMs;
  if (!userStarted && checkedParentTimes.get(Project) === modified) {
    return null;
  }

  checkedParentTimes.set(Project, modified);
  try {
    return {
      parentPath: parentPath,
      entries: compareWithParent({
        parentAnimations: readParentAnimations(parentPath),
        childAnimations: Animation.all.map(
            (animation) => animation.getUndoCopy({}, true)),
        knownNames: getLink().known,
        groupName: groupNameOf(parentPath),
        bones: projectBones()
      })
    };
  } catch (error) {
    console.error(error);
    showMessage('eme.inherit.parentUnreadable', groupNameOf(parentPath));
    return null;
  }
}

function moveAnimation(animation, index) {
  const animations = Animation.all;
  animations.splice(animations.indexOf(animation), 1);
  animations.splice(index, 0, animation);
}

function applyEntries(entries, parentPath) {
  const groupName = groupNameOf(parentPath);
  const bones = projectBones();
  const replaced = entries.map((entry) => entry.child && Animation.all.find(
      (animation) => animation.uuid === entry.child.uuid));
  const selectedName = Animation.selected?.name;

  Undo.initEdit({animations: replaced.filter(Boolean)});
  const added = entries.map((entry, index) => {
    const existing = replaced[index];
    const position = existing ? Animation.all.indexOf(existing) : -1;
    existing?.remove(false, false);
    const animation = new Animation(
        createInheritedAnimation(entry.parent, groupName, bones)).add(false);
    if (position >= 0) {
      moveAnimation(animation, position);
    }

    return animation;
  });
  Undo.finishEdit(t('eme.inherit.undoSync'), {animations: added});
  added.find((animation) => animation.name === selectedName)?.select();

  const link = getLink();
  link.known = [...new Set([...link.known,
    ...entries.map((entry) => entry.name)])];
}

function applyWithConfirmation(entries, parentPath) {
  const overwritten = entries
  .filter((entry) => LOCAL_CHANGE_STATUSES.has(entry.status))
  .map((entry) => entry.name);
  const apply = () => {
    applyEntries(entries, parentPath);
    showMessage('eme.inherit.updated', entries.length);
  };

  if (overwritten.length > 0) {
    BlockbenchAdapter.confirm(t('eme.inherit.title'),
        t('eme.inherit.overwriteLocal', overwritten.join(', ')),
        t('eme.inherit.button.replace'), apply);
  } else {
    apply();
  }
}

function describeEntry(entry) {
  const parts = [];
  if (entry.differences?.bones.length) {
    parts.push(t('eme.inherit.detail.bones',
        entry.differences.bones.join(', ')));
  }
  (entry.differences?.settings || []).forEach((setting) => {
    parts.push(t('eme.inherit.detail.setting', setting.field,
        setting.local, setting.parent));
  });
  if (entry.missingBones.length) {
    parts.push(t('eme.inherit.detail.missingBones',
        entry.missingBones.join(', ')));
  }

  return parts.join('. ');
}

function syncFormField(entry) {
  const label = `${entry.name}: ${t(`eme.inherit.status.${entry.status}`)}`;
  if (entry.status === STATUS.MISSING_IN_PARENT) {
    return {type: 'info', text: label};
  }

  return {
    label: label,
    type: 'checkbox',
    value: PRESELECTED_STATUSES.has(entry.status),
    description: describeEntry(entry) || undefined
  };
}

function showSyncDialog({parentPath, entries}) {
  const groupName = groupNameOf(parentPath);
  const changed = entries.filter((entry) => entry.status !== STATUS.CURRENT);
  if (changed.length === 0) {
    showMessage('eme.inherit.upToDate', groupName);
    return;
  }

  const form = {intro: {type: 'info', text: t('eme.inherit.syncInfo')}};
  changed.forEach((entry, index) => {
    form[`animation_${index}`] = syncFormField(entry);
  });
  new Dialog({
    id: 'eme_animation_sync',
    title: t('eme.inherit.syncTitle', groupName),
    width: 600,
    form: form,
    buttons: [t('eme.inherit.button.apply'), t('eme.button.cancel')],
    onConfirm(result) {
      const chosen = changed.filter(
          (entry, index) => result[`animation_${index}`] === true);
      if (chosen.length > 0) {
        applyWithConfirmation(chosen, parentPath);
      }
    }
  }).show();
}

function openSyncDialog() {
  const comparison = compareProjectWithParent(true);
  if (comparison) {
    showSyncDialog(comparison);
  }
}

function takeFromParent(animation) {
  const comparison = compareProjectWithParent(true);
  if (!comparison) {
    return;
  }

  const {parentPath, entries} = comparison;
  const entry = entries.find(
      (candidate) => candidate.child?.uuid === animation.uuid);
  if (!entry || entry.status === STATUS.MISSING_IN_PARENT) {
    showMessage('eme.inherit.notInParent', animation.name,
        groupNameOf(parentPath));
  } else if (entry.status === STATUS.CURRENT) {
    showMessage('eme.inherit.animationUpToDate', animation.name);
  } else {
    applyWithConfirmation([entry], parentPath);
  }
}

function checkParent(project, userStarted) {
  if (project !== Project) {
    return;
  }

  const comparison = compareProjectWithParent(userStarted);
  if (!comparison || !needsParentUpdate(comparison.entries)) {
    return;
  }

  const countOf = (...statuses) => comparison.entries.filter(
      (entry) => statuses.includes(entry.status)).length;
  Blockbench.showMessageBox({
    title: t('eme.inherit.title'),
    message: t('eme.inherit.parentUpdated',
        groupNameOf(comparison.parentPath),
        countOf(STATUS.PARENT_CHANGED, STATUS.BOTH_CHANGED),
        countOf(STATUS.NEW_IN_PARENT)),
    buttons: [t('eme.inherit.button.openSync'), t('eme.inherit.button.later')],
    confirm: 0,
    cancel: 1
  }, (button) => {
    if (button === 0) {
      showSyncDialog(comparison);
    }
  });
}

function reportLinked(entries, parentPath) {
  const bones = projectBones();
  const missing = [...new Set(
      entries.flatMap((entry) => missingBones(entry.parent, bones)))];
  if (missing.length > 0) {
    Blockbench.showMessageBox({
      title: t('eme.inherit.title'),
      message: t('eme.inherit.linkedMissingBones', entries.length,
          groupNameOf(parentPath), missing.join(', '))
    });
  } else {
    showMessage('eme.inherit.linked', entries.length, groupNameOf(parentPath));
  }
}

function linkParent(parentPath) {
  if (samePath(parentPath, Project.save_path)) {
    showMessage('eme.inherit.linkSelf');
    return;
  }

  const fs = getFileSystem(true);
  if (!fs) {
    return;
  }

  let parentAnimations;
  try {
    parentAnimations = readParentAnimations(parentPath);
  } catch (error) {
    console.error(error);
    showMessage('eme.inherit.parentUnreadable', groupNameOf(parentPath));
    return;
  }
  if (parentAnimations.length === 0) {
    showMessage('eme.inherit.parentEmpty', groupNameOf(parentPath));
    return;
  }

  const boneNames = boneNameSet(projectBones());
  const entries = parentAnimations.map((parent) => ({
    name: parent.name,
    parent: parent,
    child: Animation.all.find((animation) => animation.name === parent.name)
  }));
  const replaced = entries
  .filter((entry) => entry.child
      && fingerprintAnimation(entry.child.getUndoCopy(), boneNames)
      !== fingerprintAnimation(entry.parent, boneNames))
  .map((entry) => entry.name);
  const link = () => {
    Project[PROJECT_LINK] = {
      path: path.relative(path.dirname(Project.save_path), parentPath)
      .split(path.sep).join('/'),
      known: []
    };
    applyEntries(entries, parentPath);
    checkedParentTimes.set(Project, fs.statSync(parentPath).mtimeMs);
    reportLinked(entries, parentPath);
  };

  if (replaced.length > 0) {
    BlockbenchAdapter.confirm(t('eme.inherit.title'),
        t('eme.inherit.linkReplaces', groupNameOf(parentPath),
            replaced.join(', ')),
        t('eme.inherit.button.replace'), link);
  } else {
    link();
  }
}

function unlinkParent() {
  const groupName = groupNameOf(getLink().path);
  BlockbenchAdapter.confirm(t('eme.inherit.title'),
      t('eme.inherit.unlinkConfirm', groupName),
      t('eme.inherit.button.unlink'), () => {
        const inherited = Animation.all.filter(
            (animation) => isInherited(animation, groupName));
        Undo.initEdit({animations: inherited});
        inherited.forEach((animation) => {
          animation[PARENT_FINGERPRINT] = '';
          animation.group_name = '';
        });
        Undo.finishEdit(t('eme.inherit.button.unlink'),
            {animations: inherited});
        delete Project[PROJECT_LINK];
        Project.saved = false;
        showMessage('eme.inherit.unlinked', groupName);
      });
}

function openParentDialog() {
  if (!Project?.save_path) {
    showMessage('eme.inherit.saveFirst');
    return;
  }

  const currentParent = parentPathOf(Project) || '';
  new Dialog({
    id: 'eme_animation_parent',
    title: t('eme.inherit.parentDialogTitle'),
    width: 560,
    form: {
      info: {type: 'info', text: t('eme.inherit.parentDialogInfo')},
      parent: {
        label: t('eme.inherit.parentModel'),
        type: 'file',
        extensions: ['bbmodel'],
        filetype: 'Blockbench Model',
        value: currentParent
      }
    },
    onConfirm(result) {
      const chosen = String(result.parent || '').trim();
      if (!chosen) {
        if (getLink()) {
          unlinkParent();
        }
      } else if (currentParent && samePath(chosen, currentParent)) {
        openSyncDialog();
      } else {
        linkParent(chosen);
      }
    }
  }).show();
}

function findChildModels(parentPath) {
  const fs = getFileSystem(false);
  if (!fs) {
    return [];
  }

  const folder = path.dirname(parentPath);

  return fs.readdirSync(folder)
  .filter((file) => file.endsWith('.bbmodel'))
  .map((file) => path.join(folder, file))
  .filter((file) => !samePath(file, parentPath))
  .filter((file) => {
    try {
      const text = fs.readFileSync(file, 'utf-8');
      if (!text.includes(LINK_KEY)) {
        return false;
      }

      const linkPath = JSON.parse(text)[LINK_KEY]?.path;
      return typeof linkPath === 'string'
          && samePath(path.resolve(folder, linkPath), parentPath);
    } catch (error) {
      console.warn(`[Easy Model Entities] Skipped unreadable ${file}:`, error);
      return false;
    }
  })
  .map((file) => path.basename(file, '.bbmodel'));
}

function notifyChildModels(project) {
  try {
    const children = findChildModels(project.save_path);
    if (children.length > 0) {
      Blockbench.showToastNotification({
        text: t('eme.inherit.childrenNotified', children.join(', ')),
        icon: 'sync',
        expire: 6000
      });
    }
  } catch (error) {
    console.error(error);
  }
}

function handleSavedStateChanged({project, saved}) {
  const wasUnsaved = savedStates.get(project) === false;
  savedStates.set(project, saved);
  if (saved && wasUnsaved && project.save_path
      && project.format?.id === FORMAT_ID) {
    notifyChildModels(project);
  }
}

function editedAnimations(aspects) {
  const before = Undo.current_save?.aspects?.animations || [];
  const edited = (aspects?.animations || []).filter(
      (animation) => before.includes(animation));
  if (aspects?.keyframes?.length && Animation.selected) {
    edited.push(Animation.selected);
  }

  return edited;
}

// A sync adds new animation objects and an unlink clears the fingerprint first, so neither of
// them triggers this warning.
function handleFinishEdit({aspects}) {
  if (!isLinked()) {
    return;
  }

  const groupName = groupNameOf(getLink().path);
  const animation = editedAnimations(aspects).find(
      (candidate) => isInherited(candidate, groupName)
          && !warnedAnimations.has(candidate.uuid));
  if (animation) {
    warnedAnimations.add(animation.uuid);
    showMessage('eme.inherit.editWarning', animation.name, groupName);
  }
}

function handleCompile({model}) {
  if (isLinked()) {
    model[LINK_KEY] = getLink();
  }
}

function handleParse({model}) {
  const link = model?.[LINK_KEY];
  if (typeof link?.path === 'string' && link.path) {
    Project[PROJECT_LINK] = {
      path: link.path,
      known: Array.isArray(link.known) ? link.known : []
    };
  }
}

function handleParsed() {
  const project = Project;
  setTimeout(() => checkParent(project, true), 0);
}

function registerAnimationInheritance() {
  // Blockbench's default merge skips a property whose condition fails, and this condition reads the
  // animation's own value, so without the custom merge a new animation would never load it.
  fingerprintProperty = new Property(Animation, 'string', PARENT_FINGERPRINT, {
    condition: (animation) => !!animation?.[PARENT_FINGERPRINT],
    merge(animation, data) {
      animation[PARENT_FINGERPRINT] =
          typeof data[PARENT_FINGERPRINT] === 'string'
              ? data[PARENT_FINGERPRINT] : '';
    }
  });

  parentAction = new Action('eme_animation_parent', {
    name: t('eme.inherit.action.parent'),
    description: t('eme.inherit.action.parentDescription'),
    icon: 'account_tree',
    condition: isEmeFormat,
    click: openParentDialog
  });
  syncAction = new Action('eme_animation_sync', {
    name: t('eme.inherit.action.sync'),
    description: t('eme.inherit.action.syncDescription'),
    icon: 'sync',
    condition: isLinked,
    click: openSyncDialog
  });
  MenuBar.addAction(parentAction, 'animation.#file');
  MenuBar.addAction(syncAction, 'animation.#file');

  animationMenuItem = {
    id: 'eme_animation_take_parent',
    name: t('eme.inherit.action.takeFromParent'),
    icon: 'sync',
    condition: (animation) => isLinked() && !!animation
        && isInherited(animation, groupNameOf(getLink().path)),
    click: takeFromParent
  };
  groupMenuItem = {
    id: 'eme_animation_sync_group',
    name: t('eme.inherit.action.sync'),
    icon: 'sync',
    condition: (groupName) => isLinked()
        && groupName === groupNameOf(getLink().path),
    click: openSyncDialog
  };
  Animation.prototype.menu.addAction(animationMenuItem);
  Animation.prototype.group_menu?.addAction(groupMenuItem);

  registrations.push(
      Codecs.project.on('compile', handleCompile),
      Codecs.project.on('parse', handleParse),
      Codecs.project.on('parsed', handleParsed),
      Blockbench.on('select_project',
          ({project}) => checkParent(project, false)),
      Blockbench.on('finish_edit', handleFinishEdit),
      Blockbench.on('saved_state_changed', handleSavedStateChanged));
}

function unregisterAnimationInheritance() {
  registrations.splice(0).forEach((registration) => registration?.delete?.());
  if (animationMenuItem) {
    Animation.prototype.menu.removeAction(animationMenuItem);
    Animation.prototype.group_menu?.removeAction(groupMenuItem);
  }
  parentAction?.delete();
  syncAction?.delete();
  fingerprintProperty?.delete();
  parentAction = null;
  syncAction = null;
  animationMenuItem = null;
  groupMenuItem = null;
  fingerprintProperty = null;
}

module.exports = {
  registerAnimationInheritance,
  unregisterAnimationInheritance
};


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
const {MODEL_TYPE_ENTITY} = __webpack_require__(151);
const {
  EXPORT_TYPE_PACKS,
  EXPORT_TYPE_MODEL_ONLY,
  includesDataPack,
  includesResourcePack,
  isSinglePackExport
} = __webpack_require__(984);

function toJson(value) {
  return JSON.stringify(value, null, 2) + '\n';
}

function jsonFile(path, value) {
  return {path: path, content: toJson(value), binary: false};
}

function pairingVersion(settings, serverProfile) {
  if (isSinglePackExport(settings.exportType) && settings.lastExportedVersion) {
    return settings.lastExportedVersion;
  }

  return hashString(toJson(serverProfile || buildServerProfile(settings)));
}

function stampVersion(settings, serverProfile, renderProfile) {
  if (!serverProfile) {
    return;
  }

  const version = pairingVersion(settings, serverProfile);
  serverProfile.version = version;
  renderProfile.version = version;
}

function buildProfiles(settings, textureResolution) {
  const serverProfile = buildServerProfile(settings);
  const renderProfile = buildRenderProfile(settings, textureResolution);
  stampVersion(settings, serverProfile, renderProfile);

  return {serverProfile, renderProfile};
}

function dataPaths(settings) {
  const namespace = settings.namespace;
  const id = settings.profileId;
  const modelType = settings.modelType || MODEL_TYPE_ENTITY;

  return {
    profile: `data/${namespace}/easy_model_entities/profiles/${modelType}/${id}.json`,
    renderProfile:
        `assets/${namespace}/easy_model_entities/render_profiles/${modelType}/${id}.json`,
    model: `assets/${namespace}/easy_model_entities/models/${id}.bbmodel`
  };
}

function textureFiles(textureResolution) {
  const packed = (textureResolution && textureResolution.packed) || [];

  return packed.map((entry) => ({
    path: entry.path,
    content: entry.bytes,
    binary: true
  }));
}

function datapackFiles(settings, serverProfile) {
  return [
    jsonFile('pack.mcmeta', buildDataPackMcmeta(settings)),
    jsonFile(dataPaths(settings).profile, serverProfile)
  ];
}

function resourcepackFiles(settings, renderProfile, options) {
  const paths = dataPaths(settings);
  return [
    jsonFile('pack.mcmeta', buildResourcePackMcmeta(settings)),
    jsonFile(paths.renderProfile, renderProfile),
    {path: paths.model, content: options.modelBytes, binary: true},
    ...textureFiles(options.textureResolution)
  ];
}

function packFileNames(settings) {
  return {
    datapack: `${settings.profileId}_datapack.zip`,
    resourcepack: `${settings.profileId}_resourcepack.zip`
  };
}

function buildPackBundle(settings, options) {
  const {serverProfile, renderProfile} = buildProfiles(settings,
      options.textureResolution);
  const exportType = settings.exportType || EXPORT_TYPE_PACKS;
  const fileNames = packFileNames(settings);
  const withDataPack = includesDataPack(exportType);
  const withResourcePack = includesResourcePack(exportType);

  return {
    readme: withDataPack && withResourcePack ? {
      path: 'README.md', content: buildReadme(settings, fileNames),
      binary: false
    } : null,
    datapack: withDataPack ? datapackFiles(settings, serverProfile) : null,
    resourcepack: withResourcePack
        ? resourcepackFiles(settings, renderProfile, options) : null,
    datapackFileName: fileNames.datapack,
    resourcepackFileName: fileNames.resourcepack,
    serverProfile,
    renderProfile
  };
}

function buildModProjectFiles(settings, options) {
  const renderProfile = buildRenderProfile(settings,
      options.textureResolution);
  const paths = dataPaths(settings);

  const files = [];
  const serverProfile = settings.exportType === EXPORT_TYPE_MODEL_ONLY
      ? null : buildServerProfile(settings);
  stampVersion(settings, serverProfile, renderProfile);
  if (serverProfile) {
    files.push(jsonFile(paths.profile, serverProfile));
  }

  files.push(
      jsonFile(paths.renderProfile, renderProfile),
      {path: paths.model, content: options.modelBytes, binary: true},
      ...textureFiles(options.textureResolution));

  return {files, serverProfile, renderProfile};
}

module.exports = {
  buildPackBundle,
  buildModProjectFiles,
  pairingVersion
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
const {LocalizedError} = __webpack_require__(16);

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
    throw new LocalizedError('eme.message.unsupportedTargetVersion',
        settings.targetVersion);
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
const {MIN_MOD_VERSION} = __webpack_require__(954);
const {MODEL_TYPE_ENTITY} = __webpack_require__(151);
const TEMPLATE = __webpack_require__(377);

function buildReadme(settings, fileNames) {
  const id = ResourceLocation.buildResourceLocation(settings.namespace,
      settings.profileId);
  const modelType = settings.modelType || MODEL_TYPE_ENTITY;
  const serverProfileId = ResourceLocation.buildResourceLocation(
      settings.namespace, `${modelType}/${settings.profileId}`);
  return TEMPLATE
  .replaceAll('{{id}}', id)
  .replaceAll('{{serverProfileId}}', serverProfileId)
  .replaceAll('{{mcVersion}}',
      `Minecraft: Java Edition ${settings.targetVersion}`)
  .replaceAll('{{modVersion}}', MIN_MOD_VERSION)
  .replaceAll('{{datapackFile}}', fileNames.datapack)
  .replaceAll('{{resourcepackFile}}', fileNames.resourcepack);
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
  defaultShoulderSettings,
  normalizeName,
  isCustomEntity,
  SCHEMA_VERSION,
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
    visible_bounds_width: values.visibleBoundsWidth,
    visible_bounds_height: values.visibleBoundsHeight,
    visible_bounds_offset: values.visibleBoundsOffset,
    opacity: values.opacity
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
    idle_strength: values.idleStrength,
    gait: values.gait,
    variant_mode: values.variantMode
  };
}

function variantWeightsJson(variantWeights) {
  return Object.fromEntries(Object.entries(variantWeights)
  .map(([clipName, weight]) => [normalizeName(clipName), weight])
  .filter(([clipName, weight]) => clipName.length > 0 && weight !== 1));
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
  if (settings.animation.variantMode !== 'none') {
    assignIfPresent(animation, 'variant_weights',
        variantWeightsJson(settings.animation.variantWeights));
  }

  return animation;
}

function buildShoulder(settings) {
  if (settings.modelType === MODEL_TYPE_BLOCK_ENTITY) {
    return {};
  }

  return diffFlat(settings.shoulder, defaultShoulderSettings());
}

function buildRenderProfile(settings, textureResolution) {
  const renderPreset = renderPresetType(settings);
  const custom = isCustomEntity(settings.modelType, settings.presetType);
  const profile = {
    schema_version: SCHEMA_VERSION,
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
  assignIfPresent(profile, 'shoulder', buildShoulder(settings));

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
  movementDefaults,
  behaviorDefaults,
  isCustomEntity,
  SCHEMA_VERSION,
  DEFAULT_MAX_HEALTH,
  DEFAULT_FOLLOW_RANGE,
  MODEL_TYPE_BLOCK_ENTITY,
  MODEL_TYPE_ENTITY
} = __webpack_require__(151);
const {diffFlat, assignIfPresent} = __webpack_require__(640);

function toDimensionsJson(values) {
  return {
    width: values.width,
    height: values.height,
    eye_height: values.eyeHeight
  };
}

function toMovementJson(values) {
  return {
    speed: values.speed,
    step_height: values.stepHeight,
    gravity: values.gravity
  };
}

function toBehaviorJson(values) {
  return {
    mode: values.mode,
    look_at_players: values.lookAtPlayers,
    random_stroll: values.randomStroll
  };
}

function toAttributesJson(values) {
  return {
    max_health: values.maxHealth,
    movement_speed: values.movementSpeed,
    follow_range: values.followRange
  };
}

function effectiveDefaults(settings) {
  const preset = settings.presetType;
  const movementType = settings.host.movementType;

  return {
    movement: toMovementJson(movementDefaults(preset, movementType)),
    behavior: toBehaviorJson(behaviorDefaults(preset, movementType)),
    attributes: toAttributesJson({
      maxHealth: DEFAULT_MAX_HEALTH,
      movementSpeed: settings.movement.speed,
      followRange: DEFAULT_FOLLOW_RANGE
    }),
    dimensions: toDimensionsJson(
        presetDefaults(preset, settings.modelType).dimensions)
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
  const values = toDimensionsJson(settings.dimensions);
  if (custom) {
    return values;
  }

  return diffFlat(values, defaults.dimensions);
}

function buildServerProfile(settings) {
  const modelType = settings.modelType || MODEL_TYPE_ENTITY;
  const blockEntity = modelType === MODEL_TYPE_BLOCK_ENTITY;
  const custom = isCustomEntity(modelType, settings.presetType);
  const defaults = effectiveDefaults(settings);

  const profile = {
    schema_version: SCHEMA_VERSION,
    model_type: modelType,
    preset_type: settings.presetType
  };

  if (!blockEntity) {
    assignIfPresent(profile, 'entity', buildEntity(settings, custom));
  }

  assignIfPresent(profile, 'dimensions',
      buildDimensions(settings, defaults, custom));

  if (!blockEntity) {
    assignIfPresent(profile, 'movement', diffFlat(
        toMovementJson(settings.movement), defaults.movement));
    assignIfPresent(profile, 'behavior', diffFlat(
        toBehaviorJson(settings.behavior), defaults.behavior));
    assignIfPresent(profile, 'attributes', diffFlat(
        toAttributesJson(settings.attributes), defaults.attributes));
  }

  return profile;
}

module.exports = {buildServerProfile};


/***/ },

/***/ 579
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
const {
  buildPackBundle,
  buildModProjectFiles,
  pairingVersion
} = __webpack_require__(869);
const {
  EXPORT_TYPE_RESOURCE_PACK,
  EXPORT_TYPE_DATA_PACK,
  isZipExport
} = __webpack_require__(984);
const {LocalizedError, t} = __webpack_require__(16);

const FILE_SYSTEM_ERROR_KEYS = {
  EACCES: 'eme.error.noPermission',
  EPERM: 'eme.error.noPermission',
  EBUSY: 'eme.error.fileInUse',
  ENOSPC: 'eme.error.diskFull',
  EROFS: 'eme.error.readOnly',
  ENOENT: 'eme.error.notFound'
};

function describeExportError(error) {
  if (error instanceof LocalizedError) {
    return error.message;
  }

  const fileSystemKey = FILE_SYSTEM_ERROR_KEYS[error?.code];
  if (fileSystemKey && error.path) {
    return t(fileSystemKey, error.path) + '\n\n'
        + t('eme.message.errorDetails', error.message);
  }

  return t('eme.message.unexpectedError', error?.message || String(error));
}

function showExportError(error) {
  console.error('[Easy Model Entities] Export failed:', error);
  Blockbench.showMessageBox({
    title: t('eme.message.exportFailed'),
    message: describeExportError(error)
  });
}

function zipExportName(settings) {
  const base = `${settings.namespace}_${settings.profileId}`;
  if (settings.exportType === EXPORT_TYPE_RESOURCE_PACK) {
    return `${base}_resourcepack`;
  }

  if (settings.exportType === EXPORT_TYPE_DATA_PACK) {
    return `${base}_datapack`;
  }

  return `${base}_eme`;
}

function exportToZip(settings, options, onWritten) {
  return Promise.resolve()
  .then(() => BlockbenchAdapter.exportPackBundle(
      buildPackBundle(settings, options), zipExportName(settings)))
  .then(() => {
    onWritten();
    Blockbench.showQuickMessage(t('eme.message.packsExported'), 1500);
  })
  .catch(showExportError);
}

function exportToModProject(settings, options, onWritten) {
  const rootDir = BlockbenchAdapter.pickDirectory(
      t('eme.message.selectResourcesDirectory'));
  if (!rootDir) {
    return;
  }

  let files;
  let existing;
  try {
    files = buildModProjectFiles(settings, options).files;
    existing = BlockbenchAdapter.listExistingFiles(rootDir, files);
  } catch (error) {
    showExportError(error);
    return;
  }

  const write = () => {
    try {
      BlockbenchAdapter.writeToDirectory(rootDir, files);
      onWritten();
      Blockbench.showQuickMessage(t('eme.message.modProjectWritten'), 1500);
    } catch (error) {
      showExportError(error);
    }
  };

  if (existing.length > 0) {
    BlockbenchAdapter.confirm(t('eme.message.overwriteTitle'),
        t('eme.message.overwriteFiles', existing.length) + '\n\n'
        + existing.map((file) => `- \`${file}\``).join('\n'),
        t('eme.button.overwrite'), write);
  } else {
    write();
  }
}

function performExport(settings, textureResolution) {
  const exportedSettings = {
    ...settings,
    lastExportedVersion: pairingVersion(settings),
    lastExportedTargetVersion: settings.targetVersion
  };
  // The exported model has to embed the pairing of this export, while the
  // project keeps it only once the files are written.
  BlockbenchAdapter.saveSettings(exportedSettings);
  const options = {
    modelBytes: BlockbenchAdapter.getModelBytes(),
    textureResolution
  };
  BlockbenchAdapter.saveSettings(settings);
  const onWritten = () => BlockbenchAdapter.saveSettings(exportedSettings);

  if (isZipExport(settings.exportType)) {
    return exportToZip(settings, options, onWritten);
  }

  return exportToModProject(settings, options, onWritten);
}

module.exports = {describeExportError, performExport, zipExportName};


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
const {
  compactModelSettings,
  expandModelSettings
} = __webpack_require__(668);

const EME_SETTINGS_KEY = 'emeSettings';

function handleCompile(event) {
  const settings = BlockbenchAdapter.loadSettings();
  if (!settings) {
    return;
  }

  const compactSettings = compactModelSettings(settings);
  if (Object.keys(compactSettings).length > 0) {
    event.model[EME_SETTINGS_KEY] = compactSettings;
  }
}

function handleParse(event) {
  const settings = event.model?.[EME_SETTINGS_KEY];
  if (settings && typeof settings === 'object') {
    BlockbenchAdapter.saveSettings(expandModelSettings(settings));
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

const FORMAT_ID = 'eme_entity';

let emeFormat = null;

function toModelIdentifier(name) {
  return name.trim().toLowerCase()
  .replace(/\s+/g, '_')
  .replace(/[^a-z0-9_]/g, '')
  .replace(/_+/g, '_')
  .replace(/^_|_$/g, '');
}

function renderSides() {
  const bodyType = BlockbenchAdapter.loadSettings()?.host?.bodyType || 'static';

  return bodyType === 'static' ? 'front' : 'double';
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
    uv_rotation: true,
    single_texture: false,
    texture_folder: true,
    bone_rig: true,
    centered_grid: true,
    animated_textures: false,
    animation_mode: true,
    animation_files: false,
    java_edition_mapping: false,
    model_identifier: true,
    locators: false,
    render_sides: renderSides,
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

module.exports = {
  FORMAT_ID,
  renderSides,
  registerEmeFormat,
  unregisterEmeFormat
};


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

const EN = {
  'eme.dialog.title': 'Easy Model Entities Export',
  'eme.action.export': 'Export Easy Model Entity',
  'eme.action.exportDescription': 'Export the current project for Easy Model Entities.',
  'eme.field.preset': 'Preset',
  'eme.field.namespace': 'Namespace (mod id)',
  'eme.field.profileId': 'Profile ID',
  'eme.field.targetVersion': 'Minecraft Version',
  'eme.field.exportType': 'Export Type',
  'eme.field.modelType': 'Type',
  'eme.field.customize': 'Customize settings',
  'eme.field.includeExternalTextures': 'Include external textures',
  'eme.field.includeExternalTexturesDescription':
      'Copies textures from other mods into this export. Turn it off to only '
      + 'point to them. Vanilla minecraft: textures are never copied.',
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
  'eme.field.opacity': 'Opacity (0 - 1)',
  'eme.field.animationMode': 'Animation Mode',
  'eme.field.swingSpeed': 'Swing Speed',
  'eme.field.walkSpeedMultiplier': 'Walk Speed Multiplier',
  'eme.field.idleStrength': 'Idle Strength',
  'eme.field.gait': 'Gait',
  'eme.field.variantMode': 'Animation Variants',
  'eme.field.variantWeight': 'Weight of %0',
  'eme.field.shoulderOffsetX': 'Shoulder Offset X',
  'eme.field.shoulderOffsetY': 'Shoulder Offset Y',
  'eme.field.shoulderOffsetZ': 'Shoulder Offset Z',
  'eme.field.shoulderScale': 'Shoulder Scale',
  'eme.section.host': 'Host',
  'eme.section.dimensions': 'Dimensions',
  'eme.section.movement': 'Movement',
  'eme.section.behavior': 'Behavior',
  'eme.section.attributes': 'Attributes',
  'eme.section.rendering': 'Rendering',
  'eme.section.animation': 'Animation',
  'eme.section.variantWeights': 'Animation Variant Weights',
  'eme.section.shoulder': 'Shoulder',
  'eme.setting.enable_customization': 'Show advanced customization (Easy Model Entities)',
  'eme.setting.enable_customization.description':
      'Shows more settings in the export dialog, like size, movement, '
      + 'behavior, rendering and animation.',
  'eme.setting.enable_experimental': 'Show experimental presets (Easy Model Entities)',
  'eme.setting.enable_experimental.description':
      'Adds the custom preset and presets that are not finished yet.',
  'eme.preset.custom': 'Custom (manual settings)',
  'eme.preset.static': 'Static (no animation, no movement)',
  'eme.preset.statue': 'Statue (display, no movement)',
  'eme.preset.ticking': 'Ticking (server + client tick)',
  'eme.preset.animated': 'Animated (continuous animation)',
  'eme.preset.animated_randomly': 'Animated randomly (moves now and then)',
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
  'eme.variant.random': 'Random',
  'eme.variant.sequential': 'Sequential',
  'eme.variant.none': 'None (base clip only)',
  'eme.entity.ground_entity': 'Ground entity',
  'eme.entity.static_entity': 'Static entity',
  'eme.entity.aquatic_entity': 'Aquatic entity',
  'eme.entity.amphibious_entity': 'Amphibious entity',
  'eme.modelType.entity': 'Entity',
  'eme.modelType.block_entity': 'Block Entity',
  'eme.exportType.packs': 'Complete: Data Pack + Resource Pack (ZIP)',
  'eme.exportType.resource_pack': 'Update: Resource Pack only (ZIP)',
  'eme.exportType.data_pack': 'Update: Data Pack only (ZIP)',
  'eme.exportType.mod_project': 'Standalone: write into mod project',
  'eme.exportType.model_only': 'Model only: mod integration (no data pack)',
  'eme.dialog.blockingIssues': 'Blocks the export',
  'eme.dialog.warnings': 'Warnings',
  'eme.action.wrapInRootBone': 'Wrap in root bone',
  'eme.validator.modelLoad': 'Easy Model Entities: model loads in the mod',
  'eme.message.exportBlocked': 'The export is blocked. Please fix these problems first:',
  'eme.message.exportWarnings': 'Please check these warnings:',
  'eme.message.exportAnyway': 'Export anyway?',
  'eme.message.overwriteTitle': 'Overwrite existing files?',
  'eme.message.overwriteFiles': '%0 file(s) already exist and will be overwritten:',
  'eme.button.export': 'Export',
  'eme.button.cancel': 'Cancel',
  'eme.button.overwrite': 'Overwrite',
  'eme.validation.more': '%0 and %1 more',
  'eme.validation.UNSUPPORTED_ELEMENT':
      'The mod can only load cubes and shows a pink box instead. Remove or '
      + 'replace: %0',
  'eme.validation.CUBE_OUTSIDE_GROUP':
      'Cubes must be inside a group, or the mod does not load the model. Move '
      + 'them into a group or click "Wrap in root bone": %0',
  'eme.validation.MISSING_BODY_PART':
      'The body type %0 needs a group named "%1". Without it, the mod shows a '
      + 'pink box',
  'eme.validation.FACE_UV_ROTATION_IGNORED':
      'Face textures can only be rotated in 90 degree steps. These cubes show '
      + 'the texture unrotated: %0',
  'eme.validation.PER_TEXTURE_UV_SIZE':
      'The mod uses the UV size of the project for all textures. Check these '
      + 'textures: %0',
  'eme.validation.MIXED_TEXTURES_PER_CUBE':
      'The mod supports only one texture per cube. These cubes use more than '
      + 'one: %0',
  'eme.validation.HIDDEN_ELEMENT':
      'Hidden parts are still shown in game: %0',
  'eme.validation.DUPLICATE_GROUP_NAME':
      'Some groups have the same name. Upper and lower case and spaces at the '
      + 'start or end do not count. The mod cannot tell these groups apart in '
      + 'animations and for held items: %0',
  'eme.validation.DUPLICATE_ANIMATION_NAME':
      'Some animations have the same name. Upper and lower case and spaces at '
      + 'the start or end do not count. The mod only keeps the last one: %0',
  'eme.validation.TARGET_VERSION_CHANGED':
      'The last export was for Minecraft %0, this one is for Minecraft %1. '
      + 'Packs for different versions do not work together',
  'eme.validation.NO_PAIRED_EXPORT':
      'This project was never exported with both packs, so this pack may not '
      + 'fit the one you installed. Export both packs instead',
  'eme.validation.INVALID_NUMERIC': '%0 must be a number',
  'eme.validation.range': '%0 must be between %1 and %2',
  'eme.validation.positive': '%0 must be greater than 0',
  'eme.validation.choice': '%0 must be one of %1',
  'eme.validation.budget.textureSize': 'Texture larger than %0x%0',
  'eme.validation.budget.modelSize': 'Model file larger than %0 MB',
  'eme.validation.budget.cubeCount': 'More than %0 cubes',
  'eme.validation.budget.boneCount': 'More than %0 bones',
  'eme.validation.budget.hierarchyDepth':
      'Groups nested more than %0 levels deep',
  'eme.validation.INVALID_NAMESPACE': 'Invalid namespace "%0". Try "%1"',
  'eme.validation.INVALID_PROFILE_ID': 'Invalid profile ID "%0". Try "%1"',
  'eme.validation.INVALID_RESOURCE_LOCATION': 'Invalid host entity type: %0',
  'eme.validation.INVALID_PRESET_TYPE': 'Invalid preset type: %0',
  'eme.validation.MISSING_MODEL': 'The project has no model',
  'eme.validation.MISSING_TEXTURE': 'The project has no texture',
  'eme.validation.EXTERNAL_TEXTURE_REFERENCE':
      'These textures are not part of the export: %0. Install the mod or pack '
      + 'they come from, or turn on "%1"',
  'eme.validation.HIGH_ANIMATION_COUNT':
      'More than %0 animations. The mod does not load the model',
  'eme.validation.SOFT_ANIMATION_COUNT': 'More than %0 animations',
  'eme.validation.CUSTOM_ANIMATION_CLIP':
      'These animations never play on their own, only by command: %0. Names '
      + 'that play on their own: %1 and numbered variants like idle_2',
  'eme.validation.UNSUPPORTED_ANIMATION_EXPRESSION':
      'Animation "%0" uses formulas in keyframes. The mod only supports plain '
      + 'numbers and skips this animation',
  'eme.validation.UNSUPPORTED_ANIMATION_CHANNEL':
      'Animation "%0" uses the "%1" channel. The mod ignores it',
  'eme.validation.ANIMATIONS_NEVER_PLAYED':
      'The preset %0 has no animations, so these never play: %1. Pick an '
      + 'animated preset',
  'eme.validation.DUPLICATE_TEXTURE_INDEX':
      'Texture slot %0 is assigned more than once',
  'eme.validation.INVALID_TEXTURE_LOCATION':
      'Texture slot %0 points to the invalid location %1, check its namespace '
      + 'and folder',
  'eme.validation.MISSING_TEXTURE_INDEX':
      'Texture slot 0 is missing, the model has no primary texture',
  'eme.validation.INVALID_OUTPUT_PATH': 'A file to write has no path',
  'eme.validation.PATH_TRAVERSAL':
      'The path %0 leads outside the selected folder',
  'eme.validation.ABSOLUTE_PATH':
      'The path %0 must be relative to the selected folder',
  'eme.texture.custom': 'Custom Texture',
  'eme.message.openProjectFirst': 'Open a project first',
  'eme.message.packsExported': 'Easy Model Entities packs exported',
  'eme.message.modProjectWritten':
      'Easy Model Entities files written to mod project',
  'eme.message.exportFailed': 'Export failed',
  'eme.message.unsupportedTargetVersion':
      'Minecraft %0 is not supported as target version. Choose another one in '
      + 'the export dialog',
  'eme.message.unexpectedError':
      'Something unexpected went wrong. If this happens again, please report '
      + 'it with these details:\n\n%0',
  'eme.message.errorDetails': 'Details: %0',
  'eme.error.noPermission':
      'No permission to write %0. Choose another folder or check the folder '
      + 'permissions',
  'eme.error.fileInUse':
      '%0 is in use by another program. Close it and try again',
  'eme.error.diskFull': 'Not enough disk space to write %0',
  'eme.error.readOnly': '%0 is on a read-only drive',
  'eme.error.notFound':
      'The folder for %0 no longer exists. Choose the folder again',
  'eme.message.selectResourcesDirectory': 'Select src/main/resources directory',
  'eme.inherit.title': 'Inherited Animations',
  'eme.inherit.permission':
      'Reads the parent model to keep inherited animations in sync',
  'eme.inherit.action.parent': 'Inherit Animations...',
  'eme.inherit.action.parentDescription':
      'Takes over the animations of a parent model and keeps them in sync.',
  'eme.inherit.action.sync': 'Sync Inherited Animations...',
  'eme.inherit.action.syncDescription':
      'Compares the inherited animations with the parent model.',
  'eme.inherit.action.takeFromParent': 'Take From Parent',
  'eme.inherit.parentDialogTitle': 'Inherit Animations',
  'eme.inherit.parentDialogInfo':
      'Choose a parent model. Its animations are copied into this model as '
      + 'their own group and saved with it, so the mod still reads them. '
      + 'Clear the field to unlink the parent.',
  'eme.inherit.parentModel': 'Parent Model',
  'eme.inherit.syncTitle': 'Sync With %0',
  'eme.inherit.syncInfo':
      'Checked animations are replaced by the version of the parent model. '
      + 'Unchecked animations stay as they are.',
  'eme.inherit.status.parentChanged': 'changed in parent',
  'eme.inherit.status.localChanged': 'changed here',
  'eme.inherit.status.bothChanged': 'changed here and in parent',
  'eme.inherit.status.newInParent': 'new in parent',
  'eme.inherit.status.removedLocally': 'deleted here',
  'eme.inherit.status.missingInParent': 'no longer in parent, stays here',
  'eme.inherit.detail.bones': 'Bones: %0',
  'eme.inherit.detail.setting': '%0: %1 here, %2 in parent',
  'eme.inherit.detail.missingBones': 'Bones missing in this model: %0',
  'eme.inherit.overwriteLocal':
      'Your changes to %0 will be replaced by the parent version.',
  'eme.inherit.linkReplaces':
      'These animations differ from %0 and will be replaced: %1',
  'eme.inherit.unlinkConfirm':
      'Unlink %0? The animations stay in this model as normal animations.',
  'eme.inherit.button.apply': 'Apply',
  'eme.inherit.button.replace': 'Replace',
  'eme.inherit.button.unlink': 'Unlink',
  'eme.inherit.button.openSync': 'Open Sync',
  'eme.inherit.button.later': 'Later',
  'eme.inherit.undoSync': 'Sync inherited animations',
  'eme.inherit.saveFirst': 'Save the model first, the parent is stored '
      + 'relative to it',
  'eme.inherit.linkSelf': 'A model cannot be its own parent',
  'eme.inherit.parentMissing': 'Parent model %0 not found',
  'eme.inherit.parentUnreadable': 'Parent model %0 could not be read',
  'eme.inherit.parentEmpty': 'Parent model %0 has no animations',
  'eme.inherit.linked': '%0 animations inherited from %1',
  'eme.inherit.linkedMissingBones':
      '%0 animations inherited from %1. These bones do not exist in this '
      + 'model and are skipped: %2',
  'eme.inherit.unlinked': '%0 unlinked',
  'eme.inherit.upToDate': 'All animations match %0',
  'eme.inherit.animationUpToDate': '%0 already matches the parent',
  'eme.inherit.notInParent': '%0 does not exist in %1',
  'eme.inherit.updated': '%0 animations updated',
  'eme.inherit.parentUpdated':
      'The parent model %0 has changed: %1 changed and %2 new animations.',
  'eme.inherit.childrenNotified':
      'These models inherit animations from this one and will offer the '
      + 'update when opened: %0',
  'eme.inherit.editWarning':
      '%0 is inherited from %1, a sync can replace this change',
};

const DE = {
  'eme.dialog.title': 'Easy Model Entities Export',
  'eme.action.export': 'Easy Model Entity exportieren',
  'eme.action.exportDescription': 'Exportiert das aktuelle Projekt für Easy Model Entities.',
  'eme.field.preset': 'Vorlage',
  'eme.field.namespace': 'Namespace (Mod-ID)',
  'eme.field.profileId': 'Profil-ID',
  'eme.field.targetVersion': 'Minecraft-Version',
  'eme.field.exportType': 'Export-Typ',
  'eme.field.modelType': 'Typ',
  'eme.field.customize': 'Einstellungen anpassen',
  'eme.field.includeExternalTextures': 'Externe Texturen mitliefern',
  'eme.field.includeExternalTexturesDescription':
      'Kopiert Texturen aus anderen Mods in diesen Export. Ausgeschaltet wird '
      + 'nur auf sie verwiesen. Vanilla-Texturen (minecraft:) werden nie '
      + 'kopiert.',
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
  'eme.field.opacity': 'Deckkraft (0 - 1)',
  'eme.field.animationMode': 'Animationsmodus',
  'eme.field.swingSpeed': 'Schwunggeschwindigkeit',
  'eme.field.walkSpeedMultiplier': 'Geh-Geschwindigkeitsfaktor',
  'eme.field.idleStrength': 'Leerlauf-Intensität',
  'eme.field.gait': 'Gangart',
  'eme.field.variantMode': 'Animationsvarianten',
  'eme.field.variantWeight': 'Gewichtung von %0',
  'eme.field.shoulderOffsetX': 'Schulter-Versatz X',
  'eme.field.shoulderOffsetY': 'Schulter-Versatz Y',
  'eme.field.shoulderOffsetZ': 'Schulter-Versatz Z',
  'eme.field.shoulderScale': 'Schulter-Skalierung',
  'eme.section.host': 'Host',
  'eme.section.dimensions': 'Abmessungen',
  'eme.section.movement': 'Bewegung',
  'eme.section.behavior': 'Verhalten',
  'eme.section.attributes': 'Attribute',
  'eme.section.rendering': 'Darstellung',
  'eme.section.animation': 'Animation',
  'eme.section.variantWeights': 'Gewichtung der Animationsvarianten',
  'eme.section.shoulder': 'Schulter',
  'eme.setting.enable_customization': 'Erweiterte Anpassung anzeigen (Easy Model Entities)',
  'eme.setting.enable_customization.description':
      'Zeigt im Export-Dialog weitere Einstellungen, etwa Größe, Bewegung, '
      + 'Verhalten, Darstellung und Animation.',
  'eme.setting.enable_experimental': 'Experimentelle Vorlagen anzeigen (Easy Model Entities)',
  'eme.setting.enable_experimental.description':
      'Zeigt die benutzerdefinierte Vorlage und Vorlagen, die noch nicht '
      + 'fertig sind.',
  'eme.preset.custom': 'Benutzerdefiniert (manuelle Einstellungen)',
  'eme.preset.static': 'Statisch (keine Animation, keine Bewegung)',
  'eme.preset.statue': 'Statue (Anzeige, keine Bewegung)',
  'eme.preset.ticking': 'Tickend (Server- + Client-Tick)',
  'eme.preset.animated': 'Animiert (durchgehende Animation)',
  'eme.preset.animated_randomly': 'Zufällig animiert (bewegt sich ab und zu)',
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
  'eme.variant.random': 'Zufällig',
  'eme.variant.sequential': 'Der Reihe nach',
  'eme.variant.none': 'Keine (nur Basis-Clip)',
  'eme.entity.ground_entity': 'Boden-Entität',
  'eme.entity.static_entity': 'Statische Entität',
  'eme.entity.aquatic_entity': 'Wasser-Entität',
  'eme.entity.amphibious_entity': 'Amphibien-Entität',
  'eme.modelType.entity': 'Entität',
  'eme.modelType.block_entity': 'Block-Entität',
  'eme.exportType.packs': 'Komplett: Data Pack + Resource Pack (ZIP)',
  'eme.exportType.resource_pack': 'Update: Nur Resource Pack (ZIP)',
  'eme.exportType.data_pack': 'Update: Nur Data Pack (ZIP)',
  'eme.exportType.mod_project': 'Standalone: in Mod-Projekt schreiben',
  'eme.exportType.model_only': 'Nur Modell: Mod-Integration (kein Data Pack)',
  'eme.dialog.blockingIssues': 'Blockiert den Export',
  'eme.dialog.warnings': 'Warnungen',
  'eme.action.wrapInRootBone': 'In Root-Bone einpacken',
  'eme.validator.modelLoad': 'Easy Model Entities: Modell lädt im Mod',
  'eme.message.exportBlocked': 'Der Export ist blockiert. Bitte behebe zuerst diese Probleme:',
  'eme.message.exportWarnings': 'Bitte prüfe diese Warnungen:',
  'eme.message.exportAnyway': 'Trotzdem exportieren?',
  'eme.message.overwriteTitle': 'Vorhandene Dateien überschreiben?',
  'eme.message.overwriteFiles': '%0 Datei(en) sind bereits vorhanden und werden überschrieben:',
  'eme.button.export': 'Exportieren',
  'eme.button.cancel': 'Abbrechen',
  'eme.button.overwrite': 'Überschreiben',
  'eme.validation.more': '%0 und %1 weitere',
  'eme.validation.UNSUPPORTED_ELEMENT':
      'Der Mod kann nur Würfel laden und zeigt stattdessen eine pinke Box. '
      + 'Entfernen oder ersetzen: %0',
  'eme.validation.CUBE_OUTSIDE_GROUP':
      'Würfel müssen in einer Gruppe liegen, sonst lädt der Mod das Modell '
      + 'nicht. Verschiebe sie in eine Gruppe oder klicke auf "In Root-Bone '
      + 'einpacken": %0',
  'eme.validation.MISSING_BODY_PART':
      'Der Körpertyp %0 braucht eine Gruppe mit dem Namen "%1". Ohne sie zeigt '
      + 'der Mod eine pinke Box',
  'eme.validation.FACE_UV_ROTATION_IGNORED':
      'Texturen auf Flächen lassen sich nur in 90-Grad-Schritten drehen. Diese '
      + 'Würfel zeigen die Textur ungedreht: %0',
  'eme.validation.PER_TEXTURE_UV_SIZE':
      'Der Mod nutzt für alle Texturen die UV-Größe des Projekts. Prüfe diese '
      + 'Texturen: %0',
  'eme.validation.MIXED_TEXTURES_PER_CUBE':
      'Der Mod kann nur eine Textur pro Würfel. Diese Würfel nutzen mehrere: %0',
  'eme.validation.HIDDEN_ELEMENT':
      'Ausgeblendete Teile sind im Spiel trotzdem zu sehen: %0',
  'eme.validation.DUPLICATE_GROUP_NAME':
      'Einige Gruppen haben denselben Namen. Groß- und Kleinschreibung und '
      + 'Leerzeichen am Anfang oder Ende zählen nicht. Der Mod kann diese '
      + 'Gruppen bei Animationen und gehaltenen Items nicht unterscheiden: %0',
  'eme.validation.DUPLICATE_ANIMATION_NAME':
      'Einige Animationen haben denselben Namen. Groß- und Kleinschreibung und '
      + 'Leerzeichen am Anfang oder Ende zählen nicht. Der Mod behält nur die '
      + 'letzte: %0',
  'eme.validation.TARGET_VERSION_CHANGED':
      'Der letzte Export war für Minecraft %0, dieser ist für Minecraft %1. '
      + 'Packs für verschiedene Versionen passen nicht zusammen',
  'eme.validation.NO_PAIRED_EXPORT':
      'Dieses Projekt wurde noch nie mit beiden Packs exportiert. Dieses Pack '
      + 'passt deshalb vielleicht nicht zum installierten. Exportiere lieber '
      + 'beide Packs',
  'eme.validation.INVALID_NUMERIC': '%0 muss eine Zahl sein',
  'eme.validation.range': '%0 muss zwischen %1 und %2 liegen',
  'eme.validation.positive': '%0 muss größer als 0 sein',
  'eme.validation.choice': '%0 muss einer dieser Werte sein: %1',
  'eme.validation.budget.textureSize': 'Textur größer als %0x%0',
  'eme.validation.budget.modelSize': 'Modelldatei größer als %0 MB',
  'eme.validation.budget.cubeCount': 'Mehr als %0 Würfel',
  'eme.validation.budget.boneCount': 'Mehr als %0 Bones',
  'eme.validation.budget.hierarchyDepth':
      'Gruppen sind mehr als %0 Ebenen tief verschachtelt',
  'eme.validation.INVALID_NAMESPACE':
      'Ungültiger Namespace "%0". Versuche "%1"',
  'eme.validation.INVALID_PROFILE_ID':
      'Ungültige Profil-ID "%0". Versuche "%1"',
  'eme.validation.INVALID_RESOURCE_LOCATION': 'Ungültige Host-Entität: %0',
  'eme.validation.INVALID_PRESET_TYPE': 'Ungültige Vorlage: %0',
  'eme.validation.MISSING_MODEL': 'Das Projekt hat kein Modell',
  'eme.validation.MISSING_TEXTURE': 'Das Projekt hat keine Textur',
  'eme.validation.EXTERNAL_TEXTURE_REFERENCE':
      'Diese Texturen sind nicht Teil des Exports: %0. Installiere den Mod '
      + 'oder das Pack, aus dem sie stammen, oder schalte "%1" ein',
  'eme.validation.HIGH_ANIMATION_COUNT':
      'Mehr als %0 Animationen. Der Mod lädt das Modell nicht',
  'eme.validation.SOFT_ANIMATION_COUNT': 'Mehr als %0 Animationen',
  'eme.validation.CUSTOM_ANIMATION_CLIP':
      'Diese Animationen starten nie von selbst, nur per Befehl: %0. Von '
      + 'selbst starten: %1 und nummerierte Varianten wie idle_2',
  'eme.validation.UNSUPPORTED_ANIMATION_EXPRESSION':
      'Die Animation "%0" nutzt Formeln in Keyframes. Der Mod unterstützt nur '
      + 'einfache Zahlen und überspringt diese Animation',
  'eme.validation.UNSUPPORTED_ANIMATION_CHANNEL':
      'Die Animation "%0" nutzt den Kanal "%1". Der Mod ignoriert ihn',
  'eme.validation.ANIMATIONS_NEVER_PLAYED':
      'Die Vorlage %0 hat keine Animationen, daher laufen diese nie: %1. '
      + 'Wähle eine animierte Vorlage',
  'eme.validation.DUPLICATE_TEXTURE_INDEX':
      'Textur-Slot %0 ist mehrfach belegt',
  'eme.validation.INVALID_TEXTURE_LOCATION':
      'Textur-Slot %0 verweist auf den ungültigen Ort %1. Prüfe Namespace und '
      + 'Ordner',
  'eme.validation.MISSING_TEXTURE_INDEX':
      'Textur-Slot 0 fehlt, das Modell hat keine Haupttextur',
  'eme.validation.INVALID_OUTPUT_PATH':
      'Eine zu schreibende Datei hat keinen Pfad',
  'eme.validation.PATH_TRAVERSAL':
      'Der Pfad %0 führt aus dem gewählten Ordner heraus',
  'eme.validation.ABSOLUTE_PATH':
      'Der Pfad %0 muss relativ zum gewählten Ordner sein',
  'eme.texture.custom': 'Eigene Textur',
  'eme.message.openProjectFirst': 'Öffne zuerst ein Projekt',
  'eme.message.packsExported': 'Easy Model Entities Packs exportiert',
  'eme.message.modProjectWritten':
      'Easy Model Entities Dateien in das Mod-Projekt geschrieben',
  'eme.message.exportFailed': 'Export fehlgeschlagen',
  'eme.message.unsupportedTargetVersion':
      'Minecraft %0 wird als Zielversion nicht unterstützt. Wähle im '
      + 'Export-Dialog eine andere',
  'eme.message.unexpectedError':
      'Etwas Unerwartetes ist schiefgelaufen. Wenn das erneut passiert, melde '
      + 'es bitte mit diesen Details:\n\n%0',
  'eme.message.errorDetails': 'Details: %0',
  'eme.error.noPermission':
      'Keine Berechtigung, %0 zu schreiben. Wähle einen anderen Ordner oder '
      + 'prüfe die Ordnerrechte',
  'eme.error.fileInUse':
      '%0 wird von einem anderen Programm verwendet. Schließe es und versuche '
      + 'es erneut',
  'eme.error.diskFull': 'Nicht genug Speicherplatz, um %0 zu schreiben',
  'eme.error.readOnly': '%0 liegt auf einem schreibgeschützten Laufwerk',
  'eme.error.notFound':
      'Der Ordner für %0 existiert nicht mehr. Wähle den Ordner erneut',
  'eme.message.selectResourcesDirectory': 'Ordner src/main/resources auswählen',
  'eme.inherit.title': 'Geerbte Animationen',
  'eme.inherit.permission':
      'Liest das Parent-Modell, um geerbte Animationen abzugleichen',
  'eme.inherit.action.parent': 'Animationen erben...',
  'eme.inherit.action.parentDescription':
      'Übernimmt die Animationen eines Parent-Modells und hält sie synchron.',
  'eme.inherit.action.sync': 'Geerbte Animationen abgleichen...',
  'eme.inherit.action.syncDescription':
      'Vergleicht die geerbten Animationen mit dem Parent-Modell.',
  'eme.inherit.action.takeFromParent': 'Vom Parent übernehmen',
  'eme.inherit.parentDialogTitle': 'Animationen erben',
  'eme.inherit.parentDialogInfo':
      'Wähle ein Parent-Modell. Seine Animationen werden als eigene Gruppe in '
      + 'dieses Modell kopiert und mitgespeichert, der Mod liest sie also '
      + 'weiterhin. Leere das Feld, um die Verknüpfung zu lösen.',
  'eme.inherit.parentModel': 'Parent-Modell',
  'eme.inherit.syncTitle': 'Abgleich mit %0',
  'eme.inherit.syncInfo':
      'Markierte Animationen werden durch die Version des Parent-Modells '
      + 'ersetzt. Nicht markierte bleiben unverändert.',
  'eme.inherit.status.parentChanged': 'im Parent geändert',
  'eme.inherit.status.localChanged': 'hier geändert',
  'eme.inherit.status.bothChanged': 'hier und im Parent geändert',
  'eme.inherit.status.newInParent': 'neu im Parent',
  'eme.inherit.status.removedLocally': 'hier gelöscht',
  'eme.inherit.status.missingInParent': 'nicht mehr im Parent, bleibt hier',
  'eme.inherit.detail.bones': 'Bones: %0',
  'eme.inherit.detail.setting': '%0: hier %1, im Parent %2',
  'eme.inherit.detail.missingBones': 'In diesem Modell fehlende Bones: %0',
  'eme.inherit.overwriteLocal':
      'Deine Änderungen an %0 werden durch die Parent-Version ersetzt.',
  'eme.inherit.linkReplaces':
      'Diese Animationen weichen von %0 ab und werden ersetzt: %1',
  'eme.inherit.unlinkConfirm':
      '%0 lösen? Die Animationen bleiben als normale Animationen in diesem '
      + 'Modell.',
  'eme.inherit.button.apply': 'Übernehmen',
  'eme.inherit.button.replace': 'Ersetzen',
  'eme.inherit.button.unlink': 'Lösen',
  'eme.inherit.button.openSync': 'Abgleich öffnen',
  'eme.inherit.button.later': 'Später',
  'eme.inherit.undoSync': 'Geerbte Animationen abgleichen',
  'eme.inherit.saveFirst': 'Speichere das Modell zuerst, der Parent wird '
      + 'relativ dazu gespeichert',
  'eme.inherit.linkSelf': 'Ein Modell kann nicht sein eigener Parent sein',
  'eme.inherit.parentMissing': 'Parent-Modell %0 nicht gefunden',
  'eme.inherit.parentUnreadable': 'Parent-Modell %0 konnte nicht gelesen '
      + 'werden',
  'eme.inherit.parentEmpty': 'Parent-Modell %0 hat keine Animationen',
  'eme.inherit.linked': '%0 Animationen von %1 geerbt',
  'eme.inherit.linkedMissingBones':
      '%0 Animationen von %1 geerbt. Diese Bones gibt es in diesem Modell '
      + 'nicht, sie werden übersprungen: %2',
  'eme.inherit.unlinked': '%0 gelöst',
  'eme.inherit.upToDate': 'Alle Animationen stimmen mit %0 überein',
  'eme.inherit.animationUpToDate': '%0 stimmt bereits mit dem Parent überein',
  'eme.inherit.notInParent': '%0 gibt es in %1 nicht',
  'eme.inherit.updated': '%0 Animationen aktualisiert',
  'eme.inherit.parentUpdated':
      'Das Parent-Modell %0 wurde geändert: %1 geänderte und %2 neue '
      + 'Animationen.',
  'eme.inherit.childrenNotified':
      'Diese Modelle erben Animationen von diesem und bieten das Update beim '
      + 'Öffnen an: %0',
  'eme.inherit.editWarning':
      '%0 ist von %1 geerbt, ein Abgleich kann diese Änderung ersetzen',
};

function registerTranslations() {
  if (typeof Language !== 'undefined' && typeof Language.addTranslations
      === 'function') {
    Language.addTranslations('en', EN);
    Language.addTranslations('de', DE);
  }
}

function translate(key) {
  if (typeof tl === 'function') {
    const translated = tl(key);
    if (translated && translated !== key) {
      return translated;
    }
  }

  return EN[key] || key;
}

function t(key, ...params) {
  return params.reduce(
      (text, param, index) => text.replaceAll(`%${index}`, String(param)),
      translate(key));
}

class LocalizedError extends Error {
  constructor(key, ...params) {
    super(t(key, ...params));
    this.name = 'LocalizedError';
  }
}

module.exports = {EN, DE, LocalizedError, registerTranslations, t};


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

  static round(value) {
    return Math.round(value * 1000) / 1000;
  }

  static extentsOf(bounds) {
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

  static deriveDimensions(bounds, bodyType) {
    const extents = ModelDimensions.extentsOf(bounds);
    if (!extents) {
      return {...ModelDimensions.FALLBACK};
    }

    const width = Math.max(extents.x, extents.z)
        / ModelDimensions.PIXELS_PER_BLOCK;
    const height = extents.y / ModelDimensions.PIXELS_PER_BLOCK;

    if (width <= 0 || height <= 0) {
      return {...ModelDimensions.FALLBACK};
    }

    const eyeHeightFactor = ModelDimensions.#EYE_HEIGHT_FACTOR[bodyType]
        ?? ModelDimensions.#EYE_HEIGHT_FACTOR.static;

    return {
      width: ModelDimensions.round(width),
      height: ModelDimensions.round(height),
      eyeHeight: ModelDimensions.round(height * eyeHeightFactor)
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

const {standardClipNames, normalizeName} = __webpack_require__(151);
const {ModelDimensions} = __webpack_require__(763);

class PresetDetector {
  static #CUBE_RATIO = 1.4;
  static #ANIMATED_FALLBACK_PRESET = 'floating_still';

  static #names(stats) {
    const boneNames = (stats && stats.boneNames) || [];
    return boneNames.map(normalizeName);
  }

  static #any(names, ...needles) {
    return names.some(
        (name) => needles.some((needle) => name.includes(needle)));
  }

  static #count(names, needle) {
    return names.filter((name) => name.includes(needle)).length;
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

    const extents = ModelDimensions.extentsOf(bounds);
    if (extents && extents.x > 0 && extents.y > 0 && extents.z > 0) {
      if (Math.max(extents.x, extents.y, extents.z) / Math.min(extents.x,
          extents.y, extents.z) <= PresetDetector.#CUBE_RATIO) {
        return {presetType: 'cuboid_still', reason: 'cube-like proportions'};
      }
      if (extents.y < Math.max(extents.x, extents.z) * 0.5) {
        return {presetType: 'aquatic_still', reason: 'flat proportions'};
      }
    }

    if (standardClipNames(stats && stats.animations).length > 0) {
      return {
        presetType: PresetDetector.#ANIMATED_FALLBACK_PRESET,
        reason: 'animation clips without distinguishing limbs'
      };
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
  ANIMATION_MODES,
  ANIMATION_VARIANT_MODES,
  BEHAVIOR_MODES,
  BODY_TYPES,
  GAIT_TYPES,
  MOVEMENT_TYPES,
  SHOULDER_CLIP,
  MODEL_TYPE_BLOCK_ENTITY,
  normalizeName,
  isStandardClip,
  standardClipNames
} = __webpack_require__(151);
const {t} = __webpack_require__(16);

const SUPPORTED_ANIMATION_CHANNELS = new Set(['rotation', 'position']);
const ANY_FINITE = [-Number.MAX_VALUE, Number.MAX_VALUE];
const NON_NEGATIVE = [0, Number.MAX_VALUE];
const POSITIVE = 'positive';

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
    maxAnimationCount: 64,
    softAnimationCount: 32
  };

  static LIMITS = {
    minDimension: 0.01,
    maxDimension: 8,
    maxMovementSpeed: 2,
    maxStepHeight: 2
  };

  static REQUIRED_BODY_PARTS = {
    biped: ['head', 'body', 'left_arm', 'right_arm', 'left_leg', 'right_leg'],
    quadruped: ['body', 'head', 'front_left_leg', 'front_right_leg',
      'back_left_leg', 'back_right_leg'],
    aquatic: ['body'],
    amphibious: ['body'],
    winged: ['body', 'head', 'left_wing', 'right_wing'],
    winged_humanoid: ['body', 'head', 'left_arm', 'right_arm', 'left_wing',
      'right_wing'],
    arthropod: ['body', 'head', 'front_left_leg', 'front_right_leg',
      'middle_front_left_leg', 'middle_front_right_leg',
      'middle_back_left_leg', 'middle_back_right_leg', 'back_left_leg',
      'back_right_leg'],
    cuboid: ['body'],
    floating: ['body'],
    static: []
  };

  static MAX_LISTED_NAMES = 5;

  static MODEL_LOAD_ERROR_CODES = new Set(['MISSING_TEXTURE',
    'INVALID_TEXTURE_LOCATION', 'DUPLICATE_TEXTURE_INDEX',
    'MISSING_TEXTURE_INDEX', 'HIGH_ANIMATION_COUNT', 'MISSING_BODY_PART',
    'UNSUPPORTED_ELEMENT', 'CUBE_OUTSIDE_GROUP']);

  static #isFiniteNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
  }

  static #validateNumeric(errors, label, value) {
    if (!Validator.#isFiniteNumber(value)) {
      errors.push({
        code: 'INVALID_NUMERIC',
        message: t('eme.validation.INVALID_NUMERIC', label)
      });
      return false;
    }

    return true;
  }

  static #validateRange(errors, code, label, value, minimum, maximum) {
    if (!Validator.#validateNumeric(errors, label, value)
        || (value >= minimum && value <= maximum)) {
      return;
    }

    errors.push({
      code: code,
      message: t('eme.validation.range', label, minimum, maximum)
    });
  }

  static #validatePositive(errors, code, label, value) {
    if (!Validator.#validateNumeric(errors, label, value) || value > 0) {
      return;
    }

    errors.push({code: code, message: t('eme.validation.positive', label)});
  }

  static #choiceChecks(settings) {
    const {host, behavior, animation} = settings;

    return [
      ['INVALID_HOST_SETTINGS', 'entity.body_type', host.bodyType, BODY_TYPES],
      ['INVALID_HOST_SETTINGS', 'entity.movement_type', host.movementType,
        MOVEMENT_TYPES],
      ['INVALID_BEHAVIOR_SETTINGS', 'behavior.mode', behavior?.mode,
        BEHAVIOR_MODES],
      ['INVALID_ANIMATION_SETTINGS', 'animation.mode', animation.mode,
        ANIMATION_MODES],
      ['INVALID_ANIMATION_SETTINGS', 'animation.gait', animation.gait,
        GAIT_TYPES],
      ['INVALID_ANIMATION_SETTINGS', 'animation.variant_mode',
        animation.variantMode, ANIMATION_VARIANT_MODES]
    ];
  }

  static #numericChecks(settings) {
    const limits = Validator.LIMITS;
    const {dimensions, movement, attributes, rendering, animation} = settings;
    const dimensionRange = [limits.minDimension, limits.maxDimension];
    const maxEyeHeight = Number.isFinite(dimensions.height)
        ? dimensions.height : limits.maxDimension;

    return [
      ['INVALID_DIMENSIONS', 'dimensions.width', dimensions.width,
        dimensionRange],
      ['INVALID_DIMENSIONS', 'dimensions.height', dimensions.height,
        dimensionRange],
      ['INVALID_DIMENSIONS', 'dimensions.eye_height', dimensions.eyeHeight,
        [0, maxEyeHeight]],
      ['INVALID_MOVEMENT', 'movement.speed', movement.speed,
        [0, limits.maxMovementSpeed]],
      ['INVALID_MOVEMENT', 'movement.step_height', movement.stepHeight,
        [0, limits.maxStepHeight]],
      ['INVALID_ATTRIBUTES', 'attributes.max_health', attributes.maxHealth,
        NON_NEGATIVE],
      ['INVALID_ATTRIBUTES', 'attributes.movement_speed',
        attributes.movementSpeed, NON_NEGATIVE],
      ['INVALID_ATTRIBUTES', 'attributes.follow_range', attributes.followRange,
        NON_NEGATIVE],
      ['INVALID_RENDER_SETTINGS', 'rendering.scale', rendering.scale,
        POSITIVE],
      ['INVALID_RENDER_SETTINGS', 'rendering.shadow_radius',
        rendering.shadowRadius, NON_NEGATIVE],
      ['INVALID_RENDER_SETTINGS', 'rendering.visible_bounds_width',
        rendering.visibleBoundsWidth ?? 0, NON_NEGATIVE],
      ['INVALID_RENDER_SETTINGS', 'rendering.visible_bounds_height',
        rendering.visibleBoundsHeight ?? 0, NON_NEGATIVE],
      ['INVALID_ANIMATION_SETTINGS', 'animation.swing_speed',
        animation.swingSpeed, NON_NEGATIVE],
      ['INVALID_ANIMATION_SETTINGS', 'animation.walk_speed_multiplier',
        animation.walkSpeedMultiplier, NON_NEGATIVE],
      ['INVALID_ANIMATION_SETTINGS', 'animation.idle_strength',
        animation.idleStrength ?? 1, NON_NEGATIVE],
      ['INVALID_RENDER_SETTINGS', 'rendering.opacity', rendering.opacity ?? 1,
        [0, 1]],
      ...Validator.#variantWeightChecks(animation),
      ...Validator.#shoulderChecks(settings)
    ];
  }

  static #variantWeightChecks(animation) {
    if (animation.variantMode === 'none') {
      return [];
    }

    return Object.entries(animation.variantWeights || {}).map(
        ([clipName, weight]) => ['INVALID_ANIMATION_SETTINGS',
          `animation.variant_weights.${clipName}`, weight, POSITIVE]);
  }

  static #shoulderChecks(settings) {
    if (settings.modelType === MODEL_TYPE_BLOCK_ENTITY || !settings.shoulder) {
      return [];
    }

    const offset = settings.shoulder.offset || [0, 0, 0];

    return [
      ...['x', 'y', 'z'].map((axis, index) => ['INVALID_RENDER_SETTINGS',
        `shoulder.offset.${axis}`, offset[index], ANY_FINITE]),
      ['INVALID_RENDER_SETTINGS', 'shoulder.scale',
        settings.shoulder.scale ?? 1, POSITIVE]
    ];
  }

  static #budgetChecks(context) {
    const budgets = Validator.BUDGETS;
    const textureSize = Validator.#isFiniteNumber(context.textureWidth)
    && Validator.#isFiniteNumber(context.textureHeight)
        ? Math.max(context.textureWidth, context.textureHeight) : undefined;
    const bytesPerMegabyte = 1024 * 1024;

    return [
      [textureSize, budgets.softTextureSize, budgets.maxTextureSize,
        'SOFT_TEXTURE_SIZE', 'LARGE_TEXTURE',
        (limit) => t('eme.validation.budget.textureSize', limit)],
      [context.modelFileSize, budgets.softModelFileSizeBytes,
        budgets.maxModelFileSizeBytes, 'SOFT_MODEL_SIZE', 'LARGE_MODEL',
        (limit) => t('eme.validation.budget.modelSize',
            limit / bytesPerMegabyte)],
      [context.cubeCount, budgets.softCubeCount, budgets.maxCubeCount,
        'SOFT_CUBE_COUNT', 'HIGH_CUBE_COUNT',
        (limit) => t('eme.validation.budget.cubeCount', limit)],
      [context.boneCount, budgets.softBoneCount, budgets.maxBoneCount,
        'SOFT_BONE_COUNT', 'HIGH_BONE_COUNT',
        (limit) => t('eme.validation.budget.boneCount', limit)],
      [context.hierarchyDepth, budgets.softHierarchyDepth,
        budgets.maxHierarchyDepth, 'SOFT_HIERARCHY_DEPTH', 'DEEP_HIERARCHY',
        (limit) => t('eme.validation.budget.hierarchyDepth', limit)]
    ];
  }

  static #formatNames(names) {
    const listed = names.slice(0, Validator.MAX_LISTED_NAMES).join(', ');
    const remaining = names.length - Validator.MAX_LISTED_NAMES;

    return remaining > 0 ? t('eme.validation.more', listed, remaining)
        : listed;
  }

  static #pushNamed(issues, code, names, ...params) {
    if (names && names.length > 0) {
      issues.push({
        code: code,
        message: t(`eme.validation.${code}`, Validator.#formatNames(names),
            ...params)
      });
    }
  }

  static #duplicateNames(names) {
    const seen = new Set();
    const duplicates = new Set();
    (names || []).map(normalizeName).filter(Boolean).forEach((name) => {
      if (seen.has(name)) {
        duplicates.add(name);
      } else {
        seen.add(name);
      }
    });

    return [...duplicates];
  }

  static validateGeometry(geometry) {
    const errors = [];
    const warnings = [];

    Validator.#pushNamed(errors, 'UNSUPPORTED_ELEMENT',
        geometry.unsupportedElements);
    Validator.#pushNamed(errors, 'CUBE_OUTSIDE_GROUP', geometry.rootCubes);
    Validator.#pushNamed(warnings, 'FACE_UV_ROTATION_IGNORED',
        geometry.rotatedFaceCubes);
    Validator.#pushNamed(warnings, 'PER_TEXTURE_UV_SIZE',
        geometry.customUvSizeTextures);
    // The mod binds every modded_entity cube to texture 0, so only eme_entity
    // keeps a texture per cube that a mix on its faces can contradict.
    if (geometry.formatId === 'eme_entity') {
      Validator.#pushNamed(warnings, 'MIXED_TEXTURES_PER_CUBE',
          geometry.mixedTextureCubes);
    }
    Validator.#pushNamed(warnings, 'HIDDEN_ELEMENT', geometry.hiddenNodes);
    Validator.#pushNamed(warnings, 'DUPLICATE_GROUP_NAME',
        Validator.#duplicateNames(geometry.exportedGroupNames));

    return {errors, warnings};
  }

  static validateSettings(settings, context) {
    const errors = [];
    const warnings = [];
    const ctx = context || {};

    if (!ResourceLocation.isValidNamespace(settings.namespace)) {
      errors.push({
        code: 'INVALID_NAMESPACE',
        message: t('eme.validation.INVALID_NAMESPACE', settings.namespace,
            ResourceLocation.sanitizeNamespace(settings.namespace))
      });
    }
    if (!ResourceLocation.isValidPath(settings.profileId)) {
      errors.push({
        code: 'INVALID_PROFILE_ID',
        message: t('eme.validation.INVALID_PROFILE_ID', settings.profileId,
            ResourceLocation.sanitizeProfileId(settings.profileId))
      });
    }
    const blockEntity = settings.modelType === MODEL_TYPE_BLOCK_ENTITY;
    if (!blockEntity
        && !ResourceLocation.isValidResourceLocation(
            settings.host.entityType)) {
      errors.push({
        code: 'INVALID_RESOURCE_LOCATION',
        message: t('eme.validation.INVALID_RESOURCE_LOCATION',
            settings.host.entityType)
      });
    }
    const validPresets = blockEntity ? BLOCK_ENTITY_PRESET_TYPES : PRESET_TYPES;
    if (!validPresets.includes(settings.presetType)) {
      errors.push({
        code: 'INVALID_PRESET_TYPE',
        message: t('eme.validation.INVALID_PRESET_TYPE', settings.presetType)
      });
    }

    for (const [code, label, value, range] of Validator.#numericChecks(
        settings)) {
      if (range === POSITIVE) {
        Validator.#validatePositive(errors, code, label, value);
      } else {
        Validator.#validateRange(errors, code, label, value, ...range);
      }
    }
    for (const [code, field, value, choices] of Validator.#choiceChecks(
        settings)) {
      if (value !== undefined && !choices.includes(value)) {
        errors.push({
          code: code,
          message: t('eme.validation.choice', field, choices.join(', '))
        });
      }
    }

    if (ctx.hasModel === false) {
      errors.push({
        code: 'MISSING_MODEL',
        message: t('eme.validation.MISSING_MODEL')
      });
    }
    if (ctx.hasTexture === false) {
      errors.push({
        code: 'MISSING_TEXTURE',
        message: t('eme.validation.MISSING_TEXTURE')
      });
    }
    (ctx.textureIssues || []).forEach((issue) => errors.push(issue));

    const referencedTextures = ctx.referencedTextures || [];
    if (referencedTextures.length > 0) {
      warnings.push({
        code: 'EXTERNAL_TEXTURE_REFERENCE',
        message: t('eme.validation.EXTERNAL_TEXTURE_REFERENCE',
            referencedTextures.join(', '),
            t('eme.field.includeExternalTextures'))
      });
    }

    for (const [value, soft, max, softCode, maxCode, describe]
        of Validator.#budgetChecks(ctx)) {
      if (!Validator.#isFiniteNumber(value)) {
        continue;
      }
      if (value > max) {
        warnings.push({code: maxCode, message: describe(max)});
      } else if (value > soft) {
        warnings.push({code: softCode, message: describe(soft)});
      }
    }
    const budgets = Validator.BUDGETS;
    if (Validator.#isFiniteNumber(ctx.animationCount)
        && ctx.animationCount > budgets.maxAnimationCount) {
      errors.push({
        code: 'HIGH_ANIMATION_COUNT',
        message: t('eme.validation.HIGH_ANIMATION_COUNT',
            budgets.maxAnimationCount)
      });
    } else if (Validator.#isFiniteNumber(ctx.animationCount)
        && ctx.animationCount > budgets.softAnimationCount) {
      warnings.push({
        code: 'SOFT_ANIMATION_COUNT',
        message: t('eme.validation.SOFT_ANIMATION_COUNT',
            budgets.softAnimationCount)
      });
    }

    Validator.#pushNamed(warnings, 'DUPLICATE_ANIMATION_NAME',
        Validator.#duplicateNames(
            (ctx.animations || []).map((animation) => animation.name)));
    Validator.#pushNamed(warnings, 'CUSTOM_ANIMATION_CLIP',
        (ctx.animations || []).filter((animation) => {
          const name = normalizeName(animation.name);
          const shoulderClip = !blockEntity && name === SHOULDER_CLIP;

          return !isStandardClip(name) && !shoulderClip;
        }).map((animation) => animation.name), ANIMATION_CLIPS.join(', '));
    (ctx.animations || []).forEach((animation) => {
      if (animation.hasExpression) {
        warnings.push({
          code: 'UNSUPPORTED_ANIMATION_EXPRESSION',
          message: t('eme.validation.UNSUPPORTED_ANIMATION_EXPRESSION',
              animation.name)
        });
      }
      (animation.channels || []).forEach((channel) => {
        if (!SUPPORTED_ANIMATION_CHANNELS.has(channel)) {
          warnings.push({
            code: 'UNSUPPORTED_ANIMATION_CHANNEL',
            message: t('eme.validation.UNSUPPORTED_ANIMATION_CHANNEL',
                animation.name, channel)
          });
        }
      });
    });

    const clipNames = standardClipNames(ctx.animations);
    if (!blockEntity && clipNames.length > 0
        && (settings.animation.mode === 'none'
            || settings.host.bodyType === 'static')) {
      warnings.push({
        code: 'ANIMATIONS_NEVER_PLAYED',
        message: t('eme.validation.ANIMATIONS_NEVER_PLAYED',
            settings.presetType, clipNames.join(', '))
      });
    }

    Validator.getMissingBodyParts(settings.host.bodyType,
        ctx.boneNames || []).forEach((part) => {
      errors.push({
        code: 'MISSING_BODY_PART',
        message: t('eme.validation.MISSING_BODY_PART', settings.host.bodyType,
            part)
      });
    });

    if (ctx.geometry) {
      const geometryResult = Validator.validateGeometry(ctx.geometry);
      errors.push(...geometryResult.errors);
      warnings.push(...geometryResult.warnings);
    }

    return {errors, warnings, valid: errors.length === 0};
  }

  static validateModelLoad(settings, context) {
    return Validator.validateSettings(settings, context).errors.filter(
        (issue) => Validator.MODEL_LOAD_ERROR_CODES.has(issue.code));
  }

  static getMissingBodyParts(bodyType, boneNames) {
    const required = Validator.REQUIRED_BODY_PARTS[bodyType] || [];
    const present = new Set((boneNames || []).map(normalizeName));

    return required.filter((part) => !present.has(part));
  }

  static validateOutputPath(relativePath) {
    if (typeof relativePath !== 'string' || relativePath.length === 0) {
      return {
        valid: false,
        code: 'INVALID_OUTPUT_PATH',
        message: t('eme.validation.INVALID_OUTPUT_PATH')
      };
    }

    const normalized = relativePath.replaceAll('\\', '/');
    if (normalized.includes('..')) {
      return {
        valid: false,
        code: 'PATH_TRAVERSAL',
        message: t('eme.validation.PATH_TRAVERSAL', relativePath)
      };
    }

    if (/^([a-zA-Z]:\/|\/)/.test(normalized)) {
      return {
        valid: false,
        code: 'ABSOLUTE_PATH',
        message: t('eme.validation.ABSOLUTE_PATH', relativePath)
      };
    }

    return {valid: true, path: normalized};
  }
}

module.exports = {Validator};


/***/ },

/***/ 508
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

const {ModelDimensions} = __webpack_require__(763);

class VisibleBounds {
  static #empty() {
    return {width: 0, height: 0, offset: [0, 0, 0]};
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

    const pixelsPerBlock = ModelDimensions.PIXELS_PER_BLOCK;
    const round = ModelDimensions.round;
    const bounds = VisibleBounds.#bounds(usable);
    const xExtent = bounds.max[0] - bounds.min[0];
    const yExtent = bounds.max[1] - bounds.min[1];
    const zExtent = bounds.max[2] - bounds.min[2];
    const width = Math.max(xExtent, zExtent) / pixelsPerBlock;
    const height = yExtent / pixelsPerBlock;

    if (width <= 0 || height <= 0) {
      return VisibleBounds.#empty();
    }

    return {
      width: round(width),
      height: round(height),
      offset: [
        round(((bounds.min[0] + bounds.max[0]) / 2) / pixelsPerBlock),
        round(bounds.min[1] / pixelsPerBlock),
        round(((bounds.min[2] + bounds.max[2]) / 2) / pixelsPerBlock)
      ]
    };
  }

  static #hasVisibleBounds(settings) {
    const rendering = settings && settings.rendering;
    return !!rendering && rendering.visibleBoundsWidth > 0
        && rendering.visibleBoundsHeight > 0;
  }

  static applyVisibleBounds(settings, derived, options) {
    if (!derived || !settings || !settings.rendering) {
      return settings;
    }
    if (options?.preserveExisting && VisibleBounds.#hasVisibleBounds(
        settings)) {
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

/***/ 984
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

const EXPORT_TYPE_PACKS = 'packs';
const EXPORT_TYPE_RESOURCE_PACK = 'resource_pack';
const EXPORT_TYPE_DATA_PACK = 'data_pack';
const EXPORT_TYPE_MOD_PROJECT = 'mod_project';
const EXPORT_TYPE_MODEL_ONLY = 'model_only';

const ZIP_EXPORT_TYPES = [EXPORT_TYPE_PACKS, EXPORT_TYPE_RESOURCE_PACK,
  EXPORT_TYPE_DATA_PACK];

function isZipExport(exportType) {
  return ZIP_EXPORT_TYPES.includes(exportType);
}

function includesDataPack(exportType) {
  return exportType !== EXPORT_TYPE_RESOURCE_PACK;
}

function includesResourcePack(exportType) {
  return exportType !== EXPORT_TYPE_DATA_PACK;
}

function isSinglePackExport(exportType) {
  return exportType === EXPORT_TYPE_RESOURCE_PACK
      || exportType === EXPORT_TYPE_DATA_PACK;
}

module.exports = {
  EXPORT_TYPE_PACKS,
  EXPORT_TYPE_RESOURCE_PACK,
  EXPORT_TYPE_DATA_PACK,
  EXPORT_TYPE_MOD_PROJECT,
  EXPORT_TYPE_MODEL_ONLY,
  isZipExport,
  includesDataPack,
  includesResourcePack,
  isSinglePackExport
};


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
const ANIMATION_CLIPS = ['idle', 'walk', 'swim', 'fly', 'hurt', 'death',
  'attack', 'sit'];
const ANIMATION_VARIANT_MODES = ['random', 'sequential', 'none'];
const SHOULDER_CLIP = 'shoulder';
const CLIP_VARIANT_SUFFIX = /^(.+?)[_ ]([1-9][0-9]*)$/;
const GAIT_TYPES = ['natural', 'feline', 'ungulate'];

const GROUND_ENTITY = 'easy_model_entities:ground_entity';
const STATIC_ENTITY = 'easy_model_entities:static_entity';
const AQUATIC_ENTITY = 'easy_model_entities:aquatic_entity';
const AMPHIBIOUS_ENTITY = 'easy_model_entities:amphibious_entity';
const HOST_ENTITY_TYPES = [GROUND_ENTITY, STATIC_ENTITY, AQUATIC_ENTITY,
  AMPHIBIOUS_ENTITY];

const FALLBACK_DIMENSIONS = {width: 0.6, height: 1.8, eyeHeight: 1.62};
const BLOCK_ENTITY_DIMENSIONS = {width: 1.0, height: 1.0, eyeHeight: 0.5};

const STATIC_FAMILY = {
  bodyType: 'static',
  dimensions: FALLBACK_DIMENSIONS,
  shadowRadius: 0.3
};
const PRESET_FAMILIES = new Map([
  ['humanoid', {...STATIC_FAMILY, bodyType: 'biped'}],
  ['quadruped', {
    bodyType: 'quadruped',
    dimensions: {width: 0.9, height: 0.9, eyeHeight: 0.6},
    shadowRadius: 0.45
  }],
  ['aquatic', {
    bodyType: 'aquatic',
    dimensions: {width: 0.7, height: 0.4, eyeHeight: 0.25},
    shadowRadius: 0.25
  }],
  ['amphibious', {
    bodyType: 'amphibious',
    dimensions: {width: 0.9, height: 0.6, eyeHeight: 0.4},
    shadowRadius: 0.45
  }],
  ['winged', {
    bodyType: 'winged',
    dimensions: {width: 0.6, height: 0.9, eyeHeight: 0.6},
    shadowRadius: 0.25
  }],
  ['winged_humanoid', {
    bodyType: 'winged_humanoid',
    dimensions: {width: 0.6, height: 0.8, eyeHeight: 0.6},
    shadowRadius: 0.25
  }],
  ['arthropod', {
    bodyType: 'arthropod',
    dimensions: {width: 1.4, height: 0.9, eyeHeight: 0.45},
    shadowRadius: 0.7
  }],
  ['cuboid', {
    bodyType: 'cuboid',
    dimensions: BLOCK_ENTITY_DIMENSIONS,
    shadowRadius: 0.5
  }],
  ['floating', {
    bodyType: 'floating',
    dimensions: BLOCK_ENTITY_DIMENSIONS,
    shadowRadius: 0.5
  }]
]);
const PRESET_MOTION_SUFFIX = /_(still|wandering|swimming|hopping)$/;

const DEFAULT_SPEEDS = new Map([['ground', 0.22], ['amphibious', 0.15],
  ['water', 0.1]]);
const BLOCK_ENTITY_ANIMATION_MODES = new Map([['animated', 'automatic'],
  ['animated_randomly', 'random_idle']]);

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

const EXPERIMENTAL_PRESET_TYPES = new Set(['custom', 'ticking']);

const SELECTABLE_PRESET_TYPES = PRESET_TYPES.filter((id) => id !== 'custom');

function normalizeName(name) {
  return String(name || '').trim().toLowerCase();
}

function clipBaseName(clipName) {
  const match = CLIP_VARIANT_SUFFIX.exec(clipName);

  return match ? match[1] : clipName;
}

function isStandardClip(name) {
  return ANIMATION_CLIPS.includes(clipBaseName(normalizeName(name)));
}

function standardClipNames(animations) {
  return (animations || [])
  .map((animation) => normalizeName(animation.name))
  .filter(isStandardClip);
}

function variantClipNames(animations) {
  const clipNames = [...new Set((animations || [])
  .map((animation) => normalizeName(animation.name))
  .filter((clipName) => clipName.length > 0))];
  const groupSizes = new Map();
  clipNames.forEach((clipName) => {
    const baseName = clipBaseName(clipName);
    groupSizes.set(baseName, (groupSizes.get(baseName) ?? 0) + 1);
  });

  return clipNames.filter(
      (clipName) => groupSizes.get(clipBaseName(clipName)) > 1);
}

function isStablePreset(presetType) {
  return !EXPERIMENTAL_PRESET_TYPES.has(presetType);
}

function isCustom(presetType) {
  return presetType === 'custom';
}

function isCustomEntity(modelType, presetType) {
  return modelType !== MODEL_TYPE_BLOCK_ENTITY && isCustom(presetType);
}

function isStill(presetType) {
  return String(presetType).endsWith('_still');
}

function isMoving(presetType) {
  return String(presetType).endsWith('_wandering')
      || presetType === 'aquatic_swimming'
      || presetType === 'cuboid_hopping';
}

function presetFamily(presetType) {
  if (!PRESET_TYPES.includes(presetType)) {
    return STATIC_FAMILY;
  }

  return PRESET_FAMILIES.get(presetType.replace(PRESET_MOTION_SUFFIX, ''))
      || STATIC_FAMILY;
}

function bodyType(presetType) {
  return presetFamily(presetType).bodyType;
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
  return {...presetFamily(presetType).dimensions};
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

function wandersByMovement(move) {
  return move === 'ground' || move === 'amphibious' || move === 'water';
}

function behaviorForMode(mode, move) {
  return {
    mode: mode,
    lookAtPlayers: mode === 'idle_only' || mode === 'ambient',
    randomStroll: wandersByMovement(move) && mode === 'ambient'
  };
}

function behaviorDefaults(presetType, move) {
  return behaviorForMode(behaviorModeFor(presetType, move), move);
}

function movementDefaults(presetType, move) {
  return {
    speed: DEFAULT_SPEEDS.get(move) ?? 0,
    stepHeight: move === 'ground' || move === 'amphibious' ? 0.6 : 0,
    gravity: presetType === 'static' || move !== 'static'
  };
}

function animationMode(presetType) {
  return presetType === 'custom' || presetType === 'static'
  || presetType === 'statue' ? 'none' : 'automatic';
}

function defaultRenderingSettings(presetType) {
  return {
    scale: 1,
    shadowRadius: presetFamily(presetType).shadowRadius,
    visibleBoundsWidth: 0,
    visibleBoundsHeight: 0,
    visibleBoundsOffset: [0, 0, 0],
    opacity: 1
  };
}

function defaultAnimationSettings(mode) {
  return {
    mode: mode,
    swingSpeed: 1,
    walkSpeedMultiplier: 1,
    idleStrength: 1,
    gait: 'natural',
    variantMode: 'random',
    variantWeights: {}
  };
}

function defaultShoulderSettings() {
  return {offset: [0, 0, 0], scale: 1};
}

function blockEntityPresetDefaults(presetType) {
  return {
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
    animation: defaultAnimationSettings(
        BLOCK_ENTITY_ANIMATION_MODES.get(presetType) ?? 'none')
  };
}

function presetDefaults(presetType, modelType) {
  if (modelType === MODEL_TYPE_BLOCK_ENTITY) {
    return blockEntityPresetDefaults(presetType);
  }

  const move = movementType(presetType);
  const movement = movementDefaults(presetType, move);

  return {
    modelType: MODEL_TYPE_ENTITY,
    presetType: presetType,
    host: {
      entityType: entityType(presetType),
      movementType: move,
      bodyType: bodyType(presetType)
    },
    dimensions: presetDimensions(presetType),
    movement: movement,
    behavior: behaviorDefaults(presetType, move),
    attributes: {
      maxHealth: DEFAULT_MAX_HEALTH,
      movementSpeed: movement.speed,
      followRange: DEFAULT_FOLLOW_RANGE
    },
    rendering: defaultRenderingSettings(presetType),
    animation: defaultAnimationSettings(animationMode(presetType)),
    shoulder: defaultShoulderSettings()
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
  ANIMATION_VARIANT_MODES,
  SHOULDER_CLIP,
  GAIT_TYPES,
  SELECTABLE_PRESET_TYPES,
  HOST_ENTITY_TYPES,
  normalizeName,
  isStandardClip,
  standardClipNames,
  variantClipNames,
  isStablePreset,
  isCustom,
  isCustomEntity,
  bodyType,
  behaviorForMode,
  behaviorDefaults,
  movementDefaults,
  animationMode,
  presetDefaults,
  defaultRenderingSettings,
  defaultAnimationSettings,
  defaultShoulderSettings
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
const DEFAULT_PROFILE_ID = 'entity';

const IDENTITY_KEYS = [
  'modelType',
  'presetType',
  'namespace',
  'profileId',
  'targetVersion'
];

const MODEL_SETTING_KEYS = [
  ...IDENTITY_KEYS,
  'customize',
  'includeExternalTextures',
  'host',
  'dimensions',
  'movement',
  'behavior',
  'attributes',
  'rendering',
  'animation',
  'shoulder',
  'lastExportedVersion',
  'lastExportedTargetVersion'
];

function pickKeys(settings, keys) {
  return Object.fromEntries(keys
  .filter((key) => settings[key] !== undefined)
  .map((key) => [key, settings[key]]));
}

function deepMerge(target, source) {
  const result = Array.isArray(target) ? target.slice() : ({
    ...target
  });
  Object.keys(source).forEach((key) => {
    const value = source[key];
    if (isPlainObject(value)) {
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
    profileId: DEFAULT_PROFILE_ID,
    targetVersion: getDefaultVersionId(),
    customize: false,
    includeExternalTextures: true
  });
}

function applyTemplate(presetType, modelType) {
  return deepMerge(getDefaults(),
      presetDefaults(presetType, modelType || MODEL_TYPE_ENTITY));
}

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function differenceFrom(template, value) {
  if (isPlainObject(value) && isPlainObject(template)) {
    const difference = {};
    Object.keys(value).forEach((key) => {
      const changed = differenceFrom(template[key], value[key]);
      if (changed !== undefined) {
        difference[key] = changed;
      }
    });

    return Object.keys(difference).length > 0 ? difference : undefined;
  }

  return JSON.stringify(value) === JSON.stringify(template)
      ? undefined : value;
}

function presetTemplate(settings) {
  return applyTemplate(settings.presetType || DEFAULT_PRESET,
      settings.modelType);
}

// Identity keys are kept even at their default, so a changed plugin default
// never retargets an existing project.
function compactModelSettings(settings) {
  const picked = pickKeys(settings, MODEL_SETTING_KEYS);

  return {
    ...pickKeys(picked, IDENTITY_KEYS),
    ...differenceFrom(presetTemplate(picked), picked)
  };
}

function expandModelSettings(storedSettings) {
  return deepMerge(presetTemplate(storedSettings), storedSettings);
}

module.exports = {
  DEFAULT_PRESET,
  DEFAULT_PROFILE_ID,
  getDefaults,
  applyTemplate,
  deepMerge,
  compactModelSettings,
  expandModelSettings
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

const DEFAULT_VERSION_ID = '1.21.1';
const MIN_MOD_VERSION = '2.5.0';

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
  },
  {
    id: '26.2',
    label: 'Minecraft 26.2',
    data: {packFormat: 107, minFormat: [107, 1], maxFormat: [107, 1]},
    resource: {packFormat: 88, minFormat: [88, 0], maxFormat: [88, 0]},
    enabled: true
  },
  {
    id: '26.3',
    label: 'Minecraft 26.3',
    data: {packFormat: 121, minFormat: [121, 0], maxFormat: [121, 0]},
    resource: {packFormat: 97, minFormat: [97, 1], maxFormat: [97, 1]},
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
  MIN_MOD_VERSION,
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
  MODEL_TYPE_BLOCK_ENTITY,
  isCustomEntity
} = __webpack_require__(151);
const {
  EXPORT_TYPE_PACKS,
  EXPORT_TYPE_DATA_PACK,
  EXPORT_TYPE_MODEL_ONLY
} = __webpack_require__(984);
const {Validator} = __webpack_require__(229);
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
  variantModeOptions,
  versionOptions
} = __webpack_require__(664);
const {
  settingsToForm,
  variantWeightKey,
  activeModelType,
  activePreset,
  presetKey,
  presetFormValues,
  resolveExportSettings
} = __webpack_require__(807);

function selectField(options) {
  return {type: 'select', options: options};
}

function numberField(step, min, max) {
  return Object.fromEntries(
      Object.entries({type: 'number', step: step, min: min, max: max})
      .filter(([, value]) => value !== undefined));
}

function advancedSections(limits, variantClips) {
  return [
    {
      name: 'host', visibility: 'entity', fields: {
        hostEntityType: selectField(hostEntityTypeOptions()),
        movementType: selectField(movementTypeOptions()),
        bodyType: selectField(bodyTypeOptions())
      }
    },
    {
      name: 'dimensions', visibility: 'server', fields: {
        width: numberField(0.1, limits.minDimension, limits.maxDimension),
        height: numberField(0.1, limits.minDimension, limits.maxDimension),
        eyeHeight: numberField(0.1, 0, limits.maxDimension)
      }
    },
    {
      name: 'movement', visibility: 'entity', fields: {
        speed: numberField(0.01, 0, limits.maxMovementSpeed),
        stepHeight: numberField(0.1, 0, limits.maxStepHeight),
        gravity: {type: 'checkbox'}
      }
    },
    {
      name: 'behavior', visibility: 'entity', fields: {
        behaviorMode: selectField(behaviorModeOptions())
      }
    },
    {
      name: 'attributes', visibility: 'entity', fields: {
        maxHealth: numberField(0.5, 0),
        movementSpeed: numberField(0.01, 0),
        followRange: numberField(1, 0)
      }
    },
    {
      name: 'rendering', visibility: 'render', fields: {
        scale: numberField(0.1, limits.minDimension),
        shadowRadius: numberField(0.1, 0),
        visibleBoundsWidth: numberField(0.1, 0),
        visibleBoundsHeight: numberField(0.1, 0),
        visibleBoundsOffsetX: numberField(0.1),
        visibleBoundsOffsetY: numberField(0.1),
        visibleBoundsOffsetZ: numberField(0.1),
        opacity: numberField(0.05, 0, 1)
      }
    },
    {
      name: 'animation', visibility: 'render', fields: {
        animationMode: selectField(animationModeOptions()),
        swingSpeed: numberField(0.1, 0),
        walkSpeedMultiplier: numberField(0.1, 0),
        idleStrength: numberField(0.1, 0),
        gait: selectField(gaitOptions()),
        variantMode: selectField(variantModeOptions())
      }
    },
    {
      name: 'variantWeights', visibility: 'render',
      when: (form) => form.variantMode !== 'none',
      fields: Object.fromEntries(variantClips.map((clipName, index) => [
        variantWeightKey(index),
        {label: t('eme.field.variantWeight', clipName), ...numberField(0.1, 0)}
      ]))
    },
    {
      name: 'shoulder', visibility: 'renderEntity', fields: {
        shoulderOffsetX: numberField(0.1),
        shoulderOffsetY: numberField(0.1),
        shoulderOffsetZ: numberField(0.1),
        shoulderScale: numberField(0.1, limits.minDimension)
      }
    }
  ].filter((section) => Object.keys(section.fields).length > 0);
}

function issueSection(title, issues) {
  if (!issues || issues.length === 0) {
    return [];
  }

  const lines = issues.map((issue) => `- ${issue.message}`).join('\n');

  return [`**${title}**\n\n${lines}`];
}

function issueFields(state) {
  const issues = state.geometryIssues || {};
  const sections = [
    ...issueSection(t('eme.dialog.blockingIssues'), issues.errors),
    ...issueSection(t('eme.dialog.warnings'), issues.warnings)
  ];
  const fields = {};
  if (sections.length > 0) {
    fields.geometry_issues = {type: 'info', text: sections.join('\n\n')};
  }
  if (state.onWrapInRootBone) {
    fields.wrap_in_root_bone = {
      type: 'buttons',
      buttons: [t('eme.action.wrapInRootBone')],
      click: () => state.onWrapInRootBone()
    };
  }

  return fields;
}

function buildFormConfig(settings, ui) {
  const limits = Validator.LIMITS;
  const state = ui || {};
  const variantClips = state.variantClips || [];
  const values = settingsToForm(settings, variantClips);
  const allowCustomize = !!state.showCustomization;

  const standalone = (form) => form.exportType !== EXPORT_TYPE_MODEL_ONLY;
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
    ...issueFields(state),
    exportType: {
      label: t('eme.field.exportType'),
      type: 'select',
      options: exportTypeOptions(),
      value: state.exportType || EXPORT_TYPE_PACKS
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

  if (state.hasExternalTextures) {
    config.includeExternalTextures = {
      label: t('eme.field.includeExternalTextures'),
      description: t('eme.field.includeExternalTexturesDescription'),
      type: 'checkbox',
      value: settings.includeExternalTextures !== false,
      condition: (form) => form.exportType !== EXPORT_TYPE_DATA_PACK
    };
  }

  if (allowCustomize) {
    config.customize = {
      label: t('eme.field.customize'),
      type: 'checkbox',
      value: !!state.customize
    };
  }

  const visibility = {
    entity: showEntity,
    server: showServer,
    render: showRender,
    renderEntity: (form) => showRender(form) && !blockEntitySelected(form)
  };
  for (const section of advancedSections(limits, variantClips)) {
    const sectionVisible = visibility[section.visibility];
    const condition = section.when
        ? (form) => sectionVisible(form) && section.when(form) : sectionVisible;
    config[`${section.name}_header`] = {
      type: 'info',
      text: `### ${t(`eme.section.${section.name}`)}`,
      condition: condition
    };
    for (const [key, field] of Object.entries(section.fields)) {
      config[key] = {
        label: t(`eme.field.${key}`),
        ...field,
        value: values[key],
        condition: condition
      };
    }
  }

  return config;
}

function openExportDialog(options) {
  const settings = options.settings;
  const modelDimensions = options.modelDimensions;
  const visibleBounds = options.visibleBounds;
  let lastKey = presetKey(options);

  const dialog = new Dialog({
    id: 'eme_export_dialog',
    title: t('eme.dialog.title'),
    width: 560,
    form: buildFormConfig(settings, {
      ...options,
      onWrapInRootBone: options.onWrapInRootBone ? () => {
        const form = dialog.getFormResult();
        dialog.hide();
        options.onWrapInRootBone(form);
      } : undefined
    }),
    onFormChange(form) {
      const key = presetKey(form);
      if (key !== lastKey) {
        lastKey = key;
        const modelType = activeModelType(form);
        const preset = activePreset(form);
        if (!isCustomEntity(modelType, preset)) {
          dialog.setFormValues(
              presetFormValues(preset, modelType, modelDimensions,
                  visibleBounds), false);
        }
      }
    },
    onConfirm(form) {
      const finalSettings = resolveExportSettings(form, settings,
          modelDimensions, visibleBounds, options.variantClips);
      options.onExport(finalSettings);
    }
  });
  dialog.show();
  if (options.formValues) {
    dialog.setFormValues(options.formValues, false);
    lastKey = presetKey(options.formValues);
  }

  return dialog;
}

module.exports = {
  buildFormConfig,
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
  ANIMATION_VARIANT_MODES,
  HOST_ENTITY_TYPES,
  MODEL_TYPES,
  isStablePreset,
  MODEL_TYPE_BLOCK_ENTITY
} = __webpack_require__(151);
const {
  EXPORT_TYPE_PACKS,
  EXPORT_TYPE_RESOURCE_PACK,
  EXPORT_TYPE_DATA_PACK,
  EXPORT_TYPE_MOD_PROJECT,
  EXPORT_TYPE_MODEL_ONLY
} = __webpack_require__(984);
const {t} = __webpack_require__(16);

function optionsFromEnum(values, prefix) {
  const options = {};
  values.forEach((id) => {
    options[id] = t(`${prefix}.${id.split(':').pop()}`);
  });

  return options;
}

function presetOptions(modelType, experimental, ensure) {
  const presetIds = modelType === MODEL_TYPE_BLOCK_ENTITY
      ? BLOCK_ENTITY_PRESET_TYPES : ['custom', ...SELECTABLE_PRESET_TYPES];
  const ids = presetIds.filter(
      (presetId) => experimental || isStablePreset(presetId));
  if (ensure && !ids.includes(ensure)) {
    ids.push(ensure);
  }

  return optionsFromEnum(ids, 'eme.preset');
}

function modelTypeOptions() {
  return optionsFromEnum(MODEL_TYPES, 'eme.modelType');
}

function exportTypeOptions() {
  return optionsFromEnum([EXPORT_TYPE_PACKS, EXPORT_TYPE_RESOURCE_PACK,
        EXPORT_TYPE_DATA_PACK, EXPORT_TYPE_MOD_PROJECT, EXPORT_TYPE_MODEL_ONLY],
      'eme.exportType');
}

function hostEntityTypeOptions() {
  return optionsFromEnum(HOST_ENTITY_TYPES, 'eme.entity');
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

function variantModeOptions() {
  return optionsFromEnum(ANIMATION_VARIANT_MODES, 'eme.variant');
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
  variantModeOptions,
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
  MODEL_TYPE_BLOCK_ENTITY,
  behaviorForMode,
  isCustomEntity
} = __webpack_require__(151);
const {
  EXPORT_TYPE_PACKS,
  EXPORT_TYPE_MODEL_ONLY
} = __webpack_require__(984);
const {ModelDimensions} = __webpack_require__(763);
const {VisibleBounds} = __webpack_require__(508);

const keepValue = (value) => value;

const FORM_FIELDS = [
  ['hostEntityType', 'host.entityType', keepValue],
  ['movementType', 'host.movementType', keepValue],
  ['bodyType', 'host.bodyType', keepValue],
  ['width', 'dimensions.width', Number],
  ['height', 'dimensions.height', Number],
  ['eyeHeight', 'dimensions.eyeHeight', Number],
  ['speed', 'movement.speed', Number],
  ['stepHeight', 'movement.stepHeight', Number],
  ['gravity', 'movement.gravity', Boolean],
  ['behaviorMode', 'behavior.mode', keepValue],
  ['maxHealth', 'attributes.maxHealth', Number],
  ['movementSpeed', 'attributes.movementSpeed', Number],
  ['followRange', 'attributes.followRange', Number],
  ['scale', 'rendering.scale', Number],
  ['shadowRadius', 'rendering.shadowRadius', Number],
  ['visibleBoundsWidth', 'rendering.visibleBoundsWidth', Number],
  ['visibleBoundsHeight', 'rendering.visibleBoundsHeight', Number],
  ['opacity', 'rendering.opacity', Number],
  ['animationMode', 'animation.mode', keepValue],
  ['swingSpeed', 'animation.swingSpeed', Number],
  ['walkSpeedMultiplier', 'animation.walkSpeedMultiplier', Number],
  ['idleStrength', 'animation.idleStrength', Number],
  ['gait', 'animation.gait', keepValue],
  ['variantMode', 'animation.variantMode', keepValue],
  ['shoulderScale', 'shoulder.scale', Number]
];

const VECTOR_FIELDS = [
  ['rendering.visibleBoundsOffset',
    ['visibleBoundsOffsetX', 'visibleBoundsOffsetY', 'visibleBoundsOffsetZ']],
  ['shoulder.offset',
    ['shoulderOffsetX', 'shoulderOffsetY', 'shoulderOffsetZ']]
];

function variantWeightKey(index) {
  return `variantWeight${index}`;
}

function settingsToForm(settings, variantClips) {
  const form = {
    namespace: settings.namespace,
    profileId: settings.profileId,
    targetVersion: settings.targetVersion
  };
  for (const [key, path] of FORM_FIELDS) {
    const [section, field] = path.split('.');
    form[key] = settings[section][field];
  }
  for (const [path, keys] of VECTOR_FIELDS) {
    const [section, field] = path.split('.');
    keys.forEach((key, axis) => {
      form[key] = settings[section][field][axis];
    });
  }
  (variantClips || []).forEach((clipName, index) => {
    form[variantWeightKey(index)] =
        settings.animation.variantWeights[clipName] ?? 1;
  });

  return form;
}

function formToSettings(form, base, variantClips) {
  const settings = {
    modelType: base.modelType,
    presetType: base.presetType,
    namespace: String(form.namespace || '').trim(),
    profileId: String(form.profileId || '').trim(),
    targetVersion: base.targetVersion,
    host: {},
    dimensions: {},
    movement: {},
    behavior: {},
    attributes: {},
    rendering: {},
    animation: {},
    shoulder: {}
  };
  for (const [key, path, convert] of FORM_FIELDS) {
    const [section, field] = path.split('.');
    settings[section][field] = convert(form[key]);
  }
  for (const [path, keys] of VECTOR_FIELDS) {
    const [section, field] = path.split('.');
    settings[section][field] = keys.map((key) => Number(form[key]));
  }
  settings.behavior = behaviorForMode(settings.behavior.mode,
      settings.host.movementType);
  settings.animation.variantWeights = Object.fromEntries(
      (variantClips || []).map((clipName, index) =>
          [clipName, Number(form[variantWeightKey(index)])]));

  return settings;
}

function activeModelType(form) {
  return form.exportType === EXPORT_TYPE_MODEL_ONLY
      ? MODEL_TYPE_ENTITY : (form.modelType || MODEL_TYPE_ENTITY);
}

function activePreset(form) {
  return activeModelType(form) === MODEL_TYPE_BLOCK_ENTITY
      ? (form.blockPreset || 'static') : (form.preset || 'custom');
}

function presetKey(form) {
  return `${activeModelType(form)}|${activePreset(form)}`;
}

function presetSettings(presetType, modelType, modelDimensions,
    visibleBounds) {
  const settings = ModelDimensions.applyModelDimensions(
      applyTemplate(presetType, modelType), modelDimensions);
  VisibleBounds.applyVisibleBounds(settings, visibleBounds);

  return settings;
}

function presetFormValues(presetType, modelType, modelDimensions,
    visibleBounds) {
  const form = settingsToForm(presetSettings(presetType, modelType,
      modelDimensions, visibleBounds));
  delete form.namespace;
  delete form.profileId;
  delete form.targetVersion;

  return form;
}

function resolveExportSettings(form, base, modelDimensions, visibleBounds,
    variantClips) {
  const modelType = activeModelType(form);
  const preset = activePreset(form);

  let settings = isCustomEntity(modelType, preset)
      ? deepMerge(getDefaults(), base)
      : presetSettings(preset, modelType, modelDimensions, visibleBounds);

  settings.modelType = modelType;
  settings.presetType = preset;
  settings.namespace = String(form.namespace || '').trim();
  settings.profileId = String(form.profileId || '').trim();
  settings.targetVersion = form.targetVersion;

  if (form.customize) {
    settings = formToSettings(form, settings, variantClips);
  }
  settings.customize = !!form.customize;
  settings.includeExternalTextures = form.includeExternalTextures !== false;
  settings.lastExportedVersion = base.lastExportedVersion;
  settings.lastExportedTargetVersion = base.lastExportedTargetVersion;
  settings.exportType = form.exportType || EXPORT_TYPE_PACKS;

  return settings;
}

module.exports = {
  variantWeightKey,
  settingsToForm,
  formToSettings,
  activeModelType,
  activePreset,
  presetKey,
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

const {hashString} = __webpack_require__(803);

class ResourceLocation {
  static #NAMESPACE_PATTERN = /^[a-z0-9_.-]+$/;
  static #PATH_PATTERN = /^[a-z0-9_./-]+$/;
  static #MODEL_EXTENSION_PATTERN = /\.(bbmodel|json|gltf|glb|obj|geo)$/i;
  static #COMBINING_MARK_PATTERN = /[\u0300-\u036f]/g;
  static #TRANSLITERATIONS = new Map(Object.entries({
    'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss', 'å': 'aa', 'æ': 'ae',
    'ø': 'oe', 'œ': 'oe', 'þ': 'th', 'ð': 'dh', 'đ': 'd', 'ł': 'l',
    'ı': 'i', 'ĳ': 'ij', 'ŋ': 'ng', '&': '_and_', '+': '_plus_'
  }));

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

  static buildResourceLocation(namespace, path) {
    return `${namespace}:${path}`;
  }

  static transliterate(value) {
    let transliterated = '';
    for (const character of String(value ?? '').toLowerCase()) {
      const replacement = ResourceLocation.#TRANSLITERATIONS.get(character);
      transliterated += replacement ?? character;
    }

    return transliterated.normalize('NFKD')
    .replace(ResourceLocation.#COMBINING_MARK_PATTERN, '');
  }

  static sanitizeProfileId(name) {
    const rawName = String(name ?? '').trim();
    const base = ResourceLocation.transliterate(
        rawName.replace(ResourceLocation.#MODEL_EXTENSION_PATTERN, ''))
    .replace(/[^a-z0-9_./-]+/g, '_')
    .replace(/_{2,}/g, '_')
    .split('/')
    .filter((segment) => segment !== '' && segment !== '.' && segment !== '..')
    .join('/')
    .replace(/^[_./-]+|[_./-]+$/g, '');
    if (base.length > 0) {
      return base;
    }

    return rawName.length > 0 ? `model_${hashString(rawName)}` : 'entity';
  }

  static sanitizeNamespace(namespace) {
    const base = ResourceLocation.transliterate(namespace)
    .replace(/[^a-z0-9_.-]+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^[_.-]+|[_.-]+$/g, '');
    return base.length > 0 ? base : 'example_org';
  }
}

module.exports = {ResourceLocation};


/***/ },

/***/ 834
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

const {normalizeName} = __webpack_require__(151);
const {ResourceLocation} = __webpack_require__(20);
const {t} = __webpack_require__(16);

const ASSETS_PATTERN = /assets\/([a-z0-9_.-]+)\/textures\/(.+?)(?:\.png)?$/i;

function stripPng(value) {
  return value.replace(/\.png$/i, '');
}

function trimSlashes(value) {
  return value.replace(/^\/+|\/+$/g, '');
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
  const namespace = normalizeName(descriptor.namespace);
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

function packPath(location) {
  const [namespace, resourcePath] = location.split(':');

  return `assets/${namespace}/${resourcePath}`;
}

function exportLocation(externalLocation, settings) {
  return `${settings.namespace}:${externalLocation.split(':')[1]}`;
}

function describeTextureSource(descriptor) {
  const location = parseExternalLocation(descriptor);
  return location
      ? {label: location.replace(':textures/', ':').replace(/\.png$/i, '')}
      : {label: t('eme.texture.custom')};
}

function resolveTextures(descriptors, settings) {
  const textures = {};
  const packed = [];
  const issues = [];
  const referencedOnly = [];
  const resolvedIndices = new Set();
  const includeExternal = settings.includeExternalTextures !== false;
  const slotIndex = (descriptor, position) =>
      Number.isInteger(descriptor.index) ? descriptor.index : position;
  const reservedPaths = new Set((descriptors || []).map(
      (descriptor, position) => packPath(
          customLocation(settings, slotIndex(descriptor, position)))));
  let texture = null;

  (descriptors || []).forEach((descriptor, position) => {
    const index = slotIndex(descriptor, position);
    if (resolvedIndices.has(index)) {
      issues.push({
        code: 'DUPLICATE_TEXTURE_INDEX',
        message: t('eme.validation.DUPLICATE_TEXTURE_INDEX', index)
      });
      return;
    }

    const externalLocation = parseExternalLocation(descriptor);
    if (externalLocation
        && !ResourceLocation.isValidResourceLocation(externalLocation)) {
      issues.push({
        code: 'INVALID_TEXTURE_LOCATION',
        message: t('eme.validation.INVALID_TEXTURE_LOCATION', index,
            externalLocation)
      });
      return;
    }

    resolvedIndices.add(index);
    const vanilla = Boolean(externalLocation)
        && externalLocation.startsWith('minecraft:');
    let location = externalLocation || customLocation(settings, index);
    if (externalLocation && includeExternal && !vanilla) {
      location = exportLocation(externalLocation, settings);
      if (reservedPaths.has(packPath(location))) {
        location = customLocation(settings, index);
      }
      reservedPaths.add(packPath(location));
    }
    if (!externalLocation || (includeExternal && !vanilla)) {
      packed.push({path: packPath(location), bytes: descriptor.bytes});
    } else if (!vanilla) {
      referencedOnly.push(location);
    }

    if (index === 0) {
      texture = location;
    } else {
      textures[index] = location;
    }
  });

  if (!texture && resolvedIndices.size > 0) {
    issues.push({
      code: 'MISSING_TEXTURE_INDEX',
      message: t('eme.validation.MISSING_TEXTURE_INDEX')
    });
  }

  return {texture, textures, packed, referencedOnly, issues};
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
module.exports = "# {{id}} - Easy Model Entities pack\n\nA Blockbench model you can spawn as an entity in Minecraft. Made with the **Easy Model Entities**\nBlockbench plugin for **{{mcVersion}}**.\n\n> **Note:** This is an early release. If you update the plugin or the mod, you may need to export\n> this pack again.\n\nProfile ID: `{{serverProfileId}}`\n\n## What you need\n\nThe **Easy Model Entities** mod, version **{{modVersion}} or newer**, for **{{mcVersion}}**\n(Forge, NeoForge or Fabric). Without the mod these files do nothing. With an older mod version the\nmodel can look wrong or show up as a pink box.\n\n- [CurseForge](https://www.curseforge.com/minecraft/mc-mods/easy-model-entities)\n- [Modrinth](https://modrinth.com/mod/easy-model-entities)\n\nInstall it like any other mod. In multiplayer, the server needs it too.\n\n## Installation\n\nThere are two files. Do not unpack them, just move them into the right folder:\n\n- `{{datapackFile}}`: the entity itself (size, movement, behavior)\n- `{{resourcepackFile}}`: how it looks (model, texture, animations)\n\n### 1. Resource Pack\n\nMove `{{resourcepackFile}}` into your resourcepacks folder:\n\n- Windows: `%appdata%\\.minecraft\\resourcepacks\\`\n- Linux: `~/.minecraft/resourcepacks/`\n- macOS: `~/Library/Application Support/minecraft/resourcepacks/`\n\nStart Minecraft and turn it on under **Options > Resource Packs**.\n\n### 2. Data Pack\n\nMove `{{datapackFile}}` into the datapacks folder of your world:\n\n- Single player: `.minecraft/saves/<world>/datapacks/`\n- Server: `<server folder>/world/datapacks/`\n\nLoad the world. If it is already open, run `/reload`.\n\n> **Install both.** With only the resource pack, you cannot spawn the model. With only the data\n> pack, the entity shows up as a pink box.\n\n## Using it in game\n\nOpen the creative inventory. Entities are in the **Easy Model Entities** tab, block entities in\n**Easy Model Block Entities**. Use the spawn item like a spawn egg.\n\n## Using it with Easy NPC\n\nEasy NPC only needs the resource pack. You need the data pack only for the spawn items, for\n`/summon` and for the entities and blocks of Easy Model Entities.\n\n## What this model can do\n\nMovement and behavior come from a preset built into the mod, for example wandering, swimming,\nflying or standing still. The preset was chosen when the pack was exported.\n\nAnimations come from the clips in the Blockbench project. These names play on their own:\n\n| Clip     | When it plays        |\n|----------|----------------------|\n| `idle`   | standing still       |\n| `walk`   | moving on the ground |\n| `swim`   | moving in water      |\n| `fly`    | flying               |\n| `attack` | attacking            |\n| `sit`    | sitting or riding    |\n| `hurt`   | taking damage        |\n| `death`  | dying                |\n\n- `shoulder` plays while the model sits on a player's shoulder. Without it, `sit` or `idle` is used.\n- Numbered clips like `idle_2` or `walk 3` are variants. The mod picks one of them each time.\n- Clips with other names only play by command, for example\n  `/easy_model_entities animation play entity <targets> <clip>`.\n- A model without any of these clips is shown without animation.\n\n## Updating this pack\n\nChanged only the model, texture or animations? Export only the resource pack again and replace that\nfile. Changed size or movement? Export only the data pack. The new pack still fits the one you\ninstalled. If you changed both, export both packs again and replace both files.\n\n## Troubleshooting\n\nThe model is a pink box or does not show up? Run this command in game:\n\n```\n/easy_model_entities debug_profile {{serverProfileId}}\n```\n\nIt shows what is wrong with the profile and the model. Errors are also written to\n`logs/latest.log` in your Minecraft folder. Search the file for `{{serverProfileId}}`.\n";

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
  expandModelSettings,
  applyTemplate,
  DEFAULT_PRESET,
  DEFAULT_PROFILE_ID
} = __webpack_require__(668);
const {
  MODEL_TYPE_ENTITY,
  MODEL_TYPE_BLOCK_ENTITY,
  variantClipNames
} = __webpack_require__(151);
const {ModelDimensions} = __webpack_require__(763);
const {VisibleBounds} = __webpack_require__(508);
const {PresetDetector} = __webpack_require__(858);
const {ResourceLocation} = __webpack_require__(20);
const {resolveTextures} = __webpack_require__(834);
const {patchTexturePanel, unpatchTexturePanel} = __webpack_require__(317);
const {Validator} = __webpack_require__(229);
const {
  EXPORT_TYPE_PACKS,
  isSinglePackExport
} = __webpack_require__(984);
const {performExport} = __webpack_require__(579);
const {BlockbenchAdapter} = __webpack_require__(833);
const {openExportDialog} = __webpack_require__(924);
const {registerTranslations, t} = __webpack_require__(16);
const exportIconSvg = __webpack_require__(448);
const createIconSvg = __webpack_require__(734);
const {FORMAT_ID, registerEmeFormat, unregisterEmeFormat} = __webpack_require__(
    995);
const {registerEmeCodecHooks, unregisterEmeCodecHooks} = __webpack_require__(
    670);
const {
  registerAnimationInheritance,
  unregisterAnimationInheritance
} = __webpack_require__(982);

const MODDED_ENTITY_FORMAT_ID = 'modded_entity';
const EXPORT_FORMAT_IDS = [FORMAT_ID, MODDED_ENTITY_FORMAT_ID];
const STATIC_PRESET = 'statue';
const ACTION_ID = 'eme_export';
const VALIDATOR_CHECK_ID = 'eme_model_load';
const SETTING_NAMES = ['enable_customization', 'enable_experimental'];
const EXPORT_ICON = 'data:image/svg+xml,' + encodeURIComponent(exportIconSvg);
const CREATE_ICON = 'data:image/svg+xml,' + encodeURIComponent(createIconSvg);
let exportAction;
let modelLoadCheck;
let projectProperty;
const pluginSettings = new Map();

function settingEnabled(name) {
  return pluginSettings.get(name)?.value === true;
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
    settings = expandModelSettings(storedSettings);
    modelType = settings.modelType || MODEL_TYPE_ENTITY;
    customize = !!storedSettings.customize;
    exportType = storedSettings.exportType || EXPORT_TYPE_PACKS;
    if (modelType === MODEL_TYPE_BLOCK_ENTITY) {
      preset = 'custom';
      blockPreset = settings.presetType || 'static';
    } else {
      preset = settings.presetType || DEFAULT_PRESET;
      blockPreset = 'static';
    }
  } else {
    preset = PresetDetector.detectPresetType(stats, bounds);
    blockPreset = 'static';
    modelType = MODEL_TYPE_ENTITY;
    settings = applyTemplate(preset);
    customize = false;
    exportType = EXPORT_TYPE_PACKS;
  }

  const modelDimensions = ModelDimensions.deriveDimensions(bounds,
      settings.host.bodyType);
  if (!storedSettings) {
    ModelDimensions.applyModelDimensions(settings, modelDimensions);
  }

  const projectName = BlockbenchAdapter.getProjectName();
  if (projectName
      && (!settings.profileId || settings.profileId === DEFAULT_PROFILE_ID)) {
    settings.profileId = ResourceLocation.sanitizeProfileId(projectName);
  }

  VisibleBounds.applyVisibleBounds(settings, visibleBounds, {
    preserveExisting: !!storedSettings
  });

  return {
    settings, preset, blockPreset, modelType, customize, exportType,
    visibleBounds, modelDimensions,
    variantClips: variantClipNames(stats.animations),
    hasExternalTextures: (stats.externalTextures || []).length > 0,
    geometry: stats.geometry
  };
}

function formatIssues(issues) {
  return issues.map((issue) => `- ${issue.message}`).join('\n');
}

function pairingWarnings(settings) {
  if (!isSinglePackExport(settings.exportType)
      || settings.lastExportedVersion) {
    return [];
  }

  return [{
    code: 'NO_PAIRED_EXPORT',
    message: t('eme.validation.NO_PAIRED_EXPORT')
  }];
}

function targetVersionWarnings(settings) {
  if (!settings.lastExportedTargetVersion
      || settings.lastExportedTargetVersion === settings.targetVersion) {
    return [];
  }

  return [{
    code: 'TARGET_VERSION_CHANGED',
    message: t('eme.validation.TARGET_VERSION_CHANGED',
        settings.lastExportedTargetVersion, settings.targetVersion)
  }];
}

function runExport(settings) {
  BlockbenchAdapter.saveSettings(settings);
  const textureResolution = resolveTextures(
      BlockbenchAdapter.collectTextures(), settings);
  const result = Validator.validateSettings(settings, {
    ...BlockbenchAdapter.getModelStats(),
    modelFileSize: BlockbenchAdapter.getModelFileSize(),
    textureIssues: textureResolution.issues,
    referencedTextures: textureResolution.referencedOnly
  });
  const warnings = [...result.warnings, ...pairingWarnings(settings),
    ...targetVersionWarnings(settings)];

  if (!result.valid) {
    Blockbench.showMessageBox({
      title: t('eme.dialog.title'),
      message: `${t('eme.message.exportBlocked')}\n\n${formatIssues(
          result.errors)}`
    });
    return;
  }

  const doExport = () => performExport(settings, textureResolution);

  if (warnings.length > 0) {
    BlockbenchAdapter.confirm(t('eme.dialog.title'),
        `${t('eme.message.exportWarnings')}\n\n${formatIssues(
            warnings)}\n\n${t('eme.message.exportAnyway')}`,
        t('eme.button.export'), doExport);
  } else {
    doExport();
  }
}

function modelLoadErrors() {
  const stats = BlockbenchAdapter.getModelLoadStats();
  if (!stats.hasModel) {
    return [];
  }

  const storedSettings = BlockbenchAdapter.loadSettings();
  // Until a preset was exported, the body type is unknown; a static one skips
  // the body part check instead of reporting parts of a guessed preset.
  const settings = storedSettings ? expandModelSettings(storedSettings)
      : applyTemplate(STATIC_PRESET);
  const textureResolution = resolveTextures(
      BlockbenchAdapter.collectTextureLocations(), settings);

  return Validator.validateModelLoad(settings,
      {...stats, textureIssues: textureResolution.issues});
}

function wrapInRootBoneAndReopen(formValues) {
  BlockbenchAdapter.wrapInRootBone(t('eme.action.wrapInRootBone'));
  openDialog(formValues);
}

function openDialog(formValues) {
  if (!Project) {
    Blockbench.showQuickMessage(t('eme.message.openProjectFirst'), 1500);
    return;
  }

  const state = resolveDialogState();
  const geometryIssues = Validator.validateGeometry(state.geometry);
  const canWrapInRootBone = geometryIssues.errors.some(
      (issue) => issue.code === 'CUBE_OUTSIDE_GROUP');
  openExportDialog({
    ...state,
    showCustomization: settingEnabled('enable_customization'),
    experimental: settingEnabled('enable_experimental'),
    geometryIssues,
    formValues,
    onWrapInRootBone: canWrapInRootBone ? wrapInRootBoneAndReopen : undefined,
    onExport: runExport
  });
}

BBPlugin.register('easy_model_entities', {
  title: 'Easy Model Entities',
  icon: 'icon.png',
  author: 'Markus Bordihn',
  description: 'Export Blockbench models for the Easy Model Entities mod (Minecraft: Java Edition) as ready-to-install Data Pack and Resource Pack files.',
  tags: ['Minecraft: Java Edition', 'Format', 'Entity'],
  version: '1.1.0',
  min_version: '5.0.0',
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
          export: false,
          default: undefined
        });

    for (const name of SETTING_NAMES) {
      pluginSettings.set(name, new Setting(`eme_${name}`, {
        name: t(`eme.setting.${name}`),
        description: t(`eme.setting.${name}.description`),
        category: 'export',
        type: 'toggle',
        value: false
      }));
    }

    exportAction = new Action(ACTION_ID, {
      name: t('eme.action.export'),
      description: t('eme.action.exportDescription'),
      icon: EXPORT_ICON,
      condition: () => typeof Format !== 'undefined' && Format
          && EXPORT_FORMAT_IDS.includes(Format.id),
      click() {
        openDialog();
      }
    });

    MenuBar.addAction(exportAction, 'file.export');

    modelLoadCheck = BlockbenchAdapter.registerValidatorCheck(
        VALIDATOR_CHECK_ID, t('eme.validator.modelLoad'), EXPORT_FORMAT_IDS,
        modelLoadErrors);

    patchTexturePanel(FORMAT_ID);
    registerAnimationInheritance();
  },
  onunload() {
    unregisterAnimationInheritance();
    unpatchTexturePanel();
    unregisterEmeCodecHooks();
    unregisterEmeFormat();
    if (exportAction) {
      exportAction.delete();
    }
    if (modelLoadCheck) {
      modelLoadCheck.delete();
    }
    pluginSettings.forEach((setting) => setting.delete());
    pluginSettings.clear();
    if (projectProperty) {
      projectProperty.delete();
    }
  }
});

/******/ })()
;