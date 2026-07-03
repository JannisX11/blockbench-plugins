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
