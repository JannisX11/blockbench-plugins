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

const {Validator} = require('./model/Validator');
const {normalizeName} = require('./model/presetTypes');
const {parseExternalLocation} = require('./utils/TextureResolver');
const {LocalizedError, t} = require('./i18n/translations');

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
    const fs = require('fs');
    const path = require('path');

    return files
    .map((file) => path.join(rootDir, file.path))
    .filter((fullPath) => fs.existsSync(fullPath));
  }

  static writeToDirectory(rootDir, files) {
    const fs = require('fs');
    const path = require('path');
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
