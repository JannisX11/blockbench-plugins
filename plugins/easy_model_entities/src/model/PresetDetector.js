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
