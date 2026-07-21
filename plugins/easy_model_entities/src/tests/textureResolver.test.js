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
  parseExternalLocation,
  resolveTextures,
  describeTextureSource
} = require('../utils/TextureResolver');

const SETTINGS = {namespace: 'example', profileId: 'lizard'};
const BYTES = Uint8Array.from([1, 2, 3]);

describe('parseExternalLocation', () => {
  test('derives from an assets path', () => {
    expect(parseExternalLocation({
      path: 'C:/mc/assets/minecraft/textures/entity/chest/normal.png'
    })).toBe('minecraft:textures/entity/chest/normal.png');
  });

  test('derives from namespace + folder + name', () => {
    expect(parseExternalLocation({
      namespace: 'minecraft', folder: 'entity/chest', name: 'normal.png'
    })).toBe('minecraft:textures/entity/chest/normal.png');
  });

  test('treats a foreign mod namespace as external', () => {
    expect(parseExternalLocation({
      namespace: 'othermod', folder: 'entity', name: 'thing'
    })).toBe('othermod:textures/entity/thing.png');
  });

  test('returns null for an empty namespace and no assets path', () => {
    expect(parseExternalLocation({
      namespace: '', folder: 'block', name: 'eye_texture', path: ''
    })).toBeNull();
  });

  test('keeps a non-minecraft assets path custom when no namespace is set',
      () => {
        expect(parseExternalLocation({
          namespace: '', folder: 'block', name: 'disguised_chestling',
          path: 'D:/x/assets/easy_model_entities_examples/textures/entity/'
              + 'disguised_chestling_1.png'
        })).toBeNull();
      });
});

describe('describeTextureSource', () => {
  test('labels a no-namespace texture as custom', () => {
    expect(describeTextureSource({
      namespace: '', folder: 'block', name: 'disguised_chestling.png', path: ''
    })).toEqual({label: 'Custom Texture'});
  });

  test('labels a namespaced texture with its compact location', () => {
    expect(describeTextureSource({
      namespace: 'minecraft', folder: 'entity/chest', name: 'normal.png'
    })).toEqual({label: 'minecraft:entity/chest/normal'});
  });
});

describe('resolveTextures', () => {
  test('single custom texture is packed and referenced explicitly', () => {
    const result = resolveTextures(
        [{
          index: 0, namespace: '', folder: '', name: '', path: '',
          bytes: BYTES
        }],
        SETTINGS);
    expect(result.texture).toBe('example:textures/entity/lizard.png');
    expect(result.textures).toEqual({});
    expect(result.packed).toEqual([{fileName: 'lizard.png', bytes: BYTES}]);
    expect(result.issues).toEqual([]);
  });

  test('foreign-namespace index 0 is referenced, not packed', () => {
    const result = resolveTextures(
        [{
          index: 0, namespace: 'othermod', folder: 'entity', name: 'thing',
          path: '', bytes: BYTES
        }],
        SETTINGS);
    expect(result.texture).toBe('othermod:textures/entity/thing.png');
    expect(result.textures).toEqual({});
    expect(result.packed).toEqual([]);
    expect(result.issues).toEqual([]);
  });

  test('packs a custom index 1 that lives under a non-minecraft assets tree',
      () => {
        const result = resolveTextures([
          {
            index: 0, namespace: 'minecraft', folder: 'entity/chest',
            name: 'normal.png', path: '', bytes: BYTES
          },
          {
            index: 1, namespace: '', folder: 'block',
            name: 'disguised_chestling.png',
            path: 'D:/x/assets/easy_model_entities_examples/textures/entity/'
                + 'disguised_chestling_1.png',
            bytes: BYTES
          }
        ], SETTINGS);

        expect(result.texture).toBe(
            'minecraft:textures/entity/chest/normal.png');
        expect(result.textures).toEqual(
            {1: 'example:textures/entity/lizard_1.png'});
        expect(result.packed).toEqual(
            [{fileName: 'lizard_1.png', bytes: BYTES}]);
      });

  test('mixes a vanilla index 0 with a custom index 1', () => {
    const result = resolveTextures([
      {
        index: 0, namespace: 'minecraft', folder: 'entity/chest',
        name: 'normal.png', path: '', bytes: BYTES
      },
      {
        index: 1, namespace: '', folder: 'block', name: 'eye_texture',
        path: '', bytes: BYTES
      }
    ], SETTINGS);

    expect(result.texture).toBe('minecraft:textures/entity/chest/normal.png');
    expect(result.textures).toEqual(
        {1: 'example:textures/entity/lizard_1.png'});
    expect(result.packed).toEqual(
        [{fileName: 'lizard_1.png', bytes: BYTES}]);
    expect(result.issues).toEqual([]);
  });

  test('mixes a custom index 0 with a vanilla index 1', () => {
    const result = resolveTextures([
      {
        index: 0, namespace: '', folder: 'block', name: 'body', path: '',
        bytes: BYTES
      },
      {
        index: 1, namespace: 'minecraft', folder: 'entity/chest',
        name: 'normal.png', path: '', bytes: BYTES
      }
    ], SETTINGS);

    expect(result.texture).toBe('example:textures/entity/lizard.png');
    expect(result.textures).toEqual(
        {1: 'minecraft:textures/entity/chest/normal.png'});
    expect(result.packed).toEqual([{fileName: 'lizard.png', bytes: BYTES}]);
    expect(result.issues).toEqual([]);
  });

  test('reports a texture location with an unusable namespace', () => {
    const result = resolveTextures(
        [{
          index: 0, namespace: 'My Mod', folder: 'entity', name: 'thing',
          path: '', bytes: BYTES
        }],
        SETTINGS);

    expect(result.texture).toBeNull();
    expect(result.issues.map((issue) => issue.code)).toEqual(
        ['INVALID_TEXTURE_LOCATION']);
  });

  test('reports a duplicate texture slot instead of overwriting it', () => {
    const result = resolveTextures([
      {
        index: 1, namespace: 'minecraft', folder: 'entity/chest',
        name: 'normal.png', path: '', bytes: BYTES
      },
      {
        index: 1, namespace: 'othermod', folder: 'entity', name: 'thing',
        path: '', bytes: BYTES
      }
    ], SETTINGS);

    expect(result.textures).toEqual(
        {1: 'minecraft:textures/entity/chest/normal.png'});
    expect(result.issues.map((issue) => issue.code)).toEqual(
        ['DUPLICATE_TEXTURE_INDEX', 'MISSING_TEXTURE_INDEX']);
  });

  test('reports a model that has no texture in slot 0', () => {
    const result = resolveTextures(
        [{
          index: 1, namespace: 'othermod', folder: 'entity', name: 'thing',
          path: '', bytes: BYTES
        }],
        SETTINGS);

    expect(result.texture).toBeNull();
    expect(result.issues.map((issue) => issue.code)).toEqual(
        ['MISSING_TEXTURE_INDEX']);
  });

  test('reports nothing for a project without any texture', () => {
    expect(resolveTextures([], SETTINGS).issues).toEqual([]);
  });
});
