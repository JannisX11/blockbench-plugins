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
