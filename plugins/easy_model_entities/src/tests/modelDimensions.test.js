const {ModelDimensions} = require('../model/ModelDimensions');

describe('deriveDimensions', () => {
  test('derives blocks from pixel bounds and uses the widest horizontal extent',
      () => {
        const bounds = {minX: 0, minY: 0, minZ: 0, maxX: 16, maxY: 32, maxZ: 8};
        const dims = ModelDimensions.deriveDimensions(bounds, 'biped');
        expect(dims.width).toBe(1); // 16px / 16
        expect(dims.height).toBe(2); // 32px / 16
        expect(dims.eyeHeight).toBe(1.8); // 2 * 0.9 (biped)
        expect(dims.visibleBoundsOffset).toEqual([0.0, 1, 0.0]);
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

  test('does not share the fallback offset array instance', () => {
    const a = ModelDimensions.deriveDimensions(null, 'biped');
    a.visibleBoundsOffset[0] = 99;
    expect(ModelDimensions.FALLBACK.visibleBoundsOffset[0]).toBe(0.0);
  });
});

describe('applyModelDimensions', () => {
  const dims = {
    width: 1,
    height: 2,
    eyeHeight: 1.8,
    visibleBoundsWidth: 1.1,
    visibleBoundsHeight: 2.2,
    visibleBoundsOffset: [0.0, 1, 0.0]
  };

  function settings() {
    return {
      dimensions: {width: 0, height: 0, eyeHeight: 0},
      rendering: {
        visibleBoundsWidth: 0,
        visibleBoundsHeight: 0,
        visibleBoundsOffset: [0, 0, 0]
      }
    };
  }

  test('overlays dimensions and visible bounds', () => {
    const result = ModelDimensions.applyModelDimensions(settings(), dims);
    expect(result.dimensions).toEqual({width: 1, height: 2, eyeHeight: 1.8});
    expect(result.rendering.visibleBoundsWidth).toBe(1.1);
    expect(result.rendering.visibleBoundsOffset).toEqual([0.0, 1, 0.0]);
  });

  test('does not share the offset array with the source', () => {
    const result = ModelDimensions.applyModelDimensions(settings(), dims);
    result.rendering.visibleBoundsOffset[0] = 99;
    expect(dims.visibleBoundsOffset[0]).toBe(0.0);
  });

  test('returns settings unchanged when no dimensions are given', () => {
    const input = settings();
    expect(ModelDimensions.applyModelDimensions(input, null)).toBe(input);
  });
});
