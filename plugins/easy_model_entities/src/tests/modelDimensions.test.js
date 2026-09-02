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

const {ModelDimensions} = require('../model/ModelDimensions');

describe('deriveDimensions', () => {
  test('derives blocks from pixel bounds and uses the widest horizontal extent',
      () => {
        const bounds = {minX: 0, minY: 0, minZ: 0, maxX: 16, maxY: 32, maxZ: 8};
        const dims = ModelDimensions.deriveDimensions(bounds, 'biped');
        expect(dims.width).toBe(1); // 16px / 16
        expect(dims.height).toBe(2); // 32px / 16
        expect(dims.eyeHeight).toBe(1.8); // 2 * 0.9 (biped)
      });

  test('eye height factor depends on body type', () => {
    const bounds = {minX: 0, minY: 0, minZ: 0, maxX: 16, maxY: 16, maxZ: 16};
    expect(ModelDimensions.deriveDimensions(bounds, 'biped').eyeHeight).toBe(
        0.9);
    expect(
        ModelDimensions.deriveDimensions(bounds, 'quadruped').eyeHeight).toBe(
        0.8);
    expect(ModelDimensions.deriveDimensions(bounds, 'static').eyeHeight).toBe(
        0.85);
  });

  test('falls back for missing, empty or degenerate bounds', () => {
    expect(ModelDimensions.deriveDimensions(null, 'biped')).toEqual(
        ModelDimensions.FALLBACK);
    expect(ModelDimensions.deriveDimensions(
        {minX: NaN, minY: 0, minZ: 0, maxX: 1, maxY: 1, maxZ: 1},
        'biped')).toEqual(ModelDimensions.FALLBACK);
    expect(ModelDimensions.deriveDimensions(
        {minX: 5, minY: 5, minZ: 5, maxX: 5, maxY: 5, maxZ: 5},
        'biped')).toEqual(ModelDimensions.FALLBACK);
  });
});

describe('applyModelDimensions', () => {
  const dims = {width: 1, height: 2, eyeHeight: 1.8};

  function settings() {
    return {dimensions: {width: 0, height: 0, eyeHeight: 0}};
  }

  test('overlays dimensions', () => {
    const result = ModelDimensions.applyModelDimensions(settings(), dims);
    expect(result.dimensions).toEqual({width: 1, height: 2, eyeHeight: 1.8});
  });

  test('returns settings unchanged when no dimensions are given', () => {
    const input = settings();
    expect(ModelDimensions.applyModelDimensions(input, null)).toBe(input);
  });
});
