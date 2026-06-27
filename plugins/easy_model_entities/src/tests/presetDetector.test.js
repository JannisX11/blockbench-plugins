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

const {PresetDetector} = require('../model/PresetDetector');

function stats(boneNames) {
  return {boneNames};
}

describe('PresetDetector.detectPresetType', () => {
  test('detects a quadruped from front/back legs', () => {
    expect(PresetDetector.detectPresetType(
        stats(['root', 'body', 'head', 'front_left_leg', 'back_right_leg'])))
    .toBe('quadruped_still');
  });

  test('detects four legs without front/back naming', () => {
    expect(PresetDetector.detectPresetType(
        stats(['leg1', 'leg2', 'leg3', 'leg4']))).toBe('quadruped_still');
  });

  test('detects a humanoid from arms', () => {
    expect(PresetDetector.detectPresetType(
        stats(['root', 'head', 'body', 'left_arm', 'right_arm', 'left_leg'])))
    .toBe('humanoid_still');
  });

  test('detects winged from wing bones', () => {
    expect(PresetDetector.detectPresetType(
        stats(['body', 'left_wing', 'right_wing']))).toBe('winged_still');
  });

  test('detects winged humanoid when wings and arms are present', () => {
    expect(PresetDetector.detectPresetType(
        stats(['body', 'left_arm', 'right_arm', 'left_wing', 'right_wing'])))
    .toBe('winged_humanoid_still');
  });

  test('detects aquatic from fins', () => {
    expect(PresetDetector.detectPresetType(
        stats(['body', 'dorsal_fin', 'tail_fin']))).toBe('aquatic_still');
  });

  test('detects arthropod from six or more legs', () => {
    expect(PresetDetector.detectPresetType(
        stats(['leg1', 'leg2', 'leg3', 'leg4', 'leg5', 'leg6']))).toBe(
        'arthropod_still');
  });

  test('matches bone names case-insensitively', () => {
    expect(PresetDetector.detectPresetType(stats(['Left_Arm', 'RIGHT_ARM'])))
    .toBe('humanoid_still');
  });

  test('uses cube-like bounds to suggest cuboid when no limbs', () => {
    const bounds = {minX: 0, minY: 0, minZ: 0, maxX: 16, maxY: 16, maxZ: 16};
    expect(PresetDetector.detectPresetType(stats(['root', 'body']), bounds))
    .toBe('cuboid_still');
  });

  test('falls back to statue without limbs or usable bounds', () => {
    expect(PresetDetector.detectPresetType(stats(['root', 'body', 'head'])))
    .toBe('statue');
    expect(PresetDetector.detectPresetType(stats([]))).toBe('statue');
    expect(PresetDetector.detectPresetType(stats(undefined))).toBe('statue');
  });

  test('detect returns a human readable reason', () => {
    const result = PresetDetector.detect(stats(['front_left_leg']));
    expect(result.presetType).toBe('quadruped_still');
    expect(typeof result.reason).toBe('string');
  });
});
