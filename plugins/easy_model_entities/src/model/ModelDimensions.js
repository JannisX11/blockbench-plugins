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
