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
  resolveTextures
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
});

describe('resolveTextures', () => {
  test('single custom texture maps to the default path and is packed', () => {
    const result = resolveTextures(
        [{
          index: 0, namespace: '', folder: '', name: '', path: '',
          bytes: BYTES
        }],
        SETTINGS);
    expect(result.texture).toBeNull();
    expect(result.textures).toEqual({});
    expect(result.packed).toEqual([{fileName: 'lizard.png', bytes: BYTES}]);
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
  });
});
