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

const {presetDefaults} = require('../model/presetTypes');
const {applyTemplate, pickModelSettings} = require('../model/templates');
const {buildRenderProfile} = require('../builders/renderProfile');
const {VisibleBounds} = require('../model/VisibleBounds');

describe('amphibious / aquatic mapping mirrors the mod', () => {
  test('amphibious_wandering uses the amphibious host and movement defaults',
      () => {
        const d = presetDefaults('amphibious_wandering');
        expect(d.host).toEqual({
          entityType: 'easy_model_entities:amphibious_entity',
          movementType: 'amphibious',
          bodyType: 'amphibious'
        });
        expect(d.movement).toEqual(
            {speed: 0.15, stepHeight: 0.6, gravity: true});
        expect(d.behavior).toMatchObject(
            {mode: 'ambient', randomStroll: true});
        expect(d.dimensions).toEqual({width: 0.9, height: 0.6, eyeHeight: 0.4});
      });

  test('aquatic presets use the water host and movement defaults', () => {
    const swimming = presetDefaults('aquatic_swimming');
    expect(swimming.host.entityType).toBe('easy_model_entities:aquatic_entity');
    expect(swimming.host.movementType).toBe('water');
    expect(swimming.movement).toEqual(
        {speed: 0.1, stepHeight: 0, gravity: true});
    expect(swimming.behavior).toMatchObject(
        {mode: 'ambient', randomStroll: true});

    const still = presetDefaults('aquatic_still');
    expect(still.host.movementType).toBe('water');
    expect(still.behavior.mode).toBe('idle_only');
  });
});

describe('pickModelSettings keeps reopen-critical settings', () => {
  test('keeps customize / targetVersion and drops export-only keys', () => {
    const full = {
      ...applyTemplate('humanoid_wandering'),
      targetVersion: '1.21.11',
      customize: true,
      exportType: 'packs',
      exportTarget: 'packs',
      modelOnly: false,
      experimental: true,
      lastExportedVersion: 'abc123'
    };
    const picked = pickModelSettings(full);
    expect(picked.targetVersion).toBe('1.21.11');
    expect(picked.customize).toBe(true);
    expect(picked.lastExportedVersion).toBe('abc123');
    expect(picked.exportType).toBeUndefined();
    expect(picked.exportTarget).toBeUndefined();
    expect(picked.modelOnly).toBeUndefined();
    expect(picked.experimental).toBeUndefined();
    expect(picked.schemaVersion).toBe('0.2.0');
    expect(picked.presetType).toBe('humanoid_wandering');
    expect(picked.host).toEqual(full.host);
    expect(picked.rendering).toEqual(full.rendering);
    expect(picked.animation).toEqual(full.animation);
  });
});

describe('render profile emits the new optional fields when non-default',
    () => {
      test('gait, idle_strength and visible_bounds are written', () => {
        const settings = applyTemplate('humanoid_wandering');
        settings.rendering.visibleBoundsWidth = 2;
        settings.rendering.visibleBoundsHeight = 3;
        settings.animation.idleStrength = 1.5;
        settings.animation.gait = 'feline';

        const render = buildRenderProfile(settings, null);
        expect(render.rendering.visible_bounds_width).toBe(2);
        expect(render.rendering.visible_bounds_height).toBe(3);
        expect(render.rendering.visible_bounds_offset).toBeUndefined();
        expect(render.animation.idle_strength).toBe(1.5);
        expect(render.animation.gait).toBe('feline');
      });

      test('defaults (natural gait, idle 1, zero bounds) stay omitted', () => {
        const render = buildRenderProfile(applyTemplate('humanoid_wandering'),
            null);
        // Every value matches the preset defaults, so neither section is written.
        expect(render.rendering).toBeUndefined();
        expect(render.animation).toBeUndefined();
      });
    });

describe('VisibleBounds', () => {
  test('derives a conservative box from a single cube', () => {
    expect(VisibleBounds.derive([{from: [-8, 0, -8], to: [8, 16, 8]}]))
    .toEqual({width: 1, height: 1, offset: [0, 0, 0]});
  });

  test('includes thin / far protrusions instead of trimming them', () => {
    const cubes = [
      {from: [0, 0, 0], to: [16, 16, 16]},
      {from: [7, 16, 8], to: [8, 48, 9]}
    ];
    const derived = VisibleBounds.derive(cubes);
    expect(derived.height).toBe(3);
    expect(derived.width).toBe(1);
    expect(derived.offset).toEqual([0.5, 0, 0.5]);
  });

  test('empty geometry falls back to vanilla culling (0 / 0)', () => {
    expect(VisibleBounds.derive([])).toEqual(
        {width: 0, height: 0, offset: [0, 0, 0]});
  });

  test('applyVisibleBounds can preserve a saved manual override', () => {
    const settings = applyTemplate('humanoid_wandering');
    settings.rendering.visibleBoundsWidth = 2;
    settings.rendering.visibleBoundsHeight = 3;
    settings.rendering.visibleBoundsOffset = [0, 1, 0];

    VisibleBounds.applyVisibleBounds(settings,
        {width: 1, height: 1, offset: [0, 0, 0]},
        {preserveExisting: true});

    expect(settings.rendering.visibleBoundsWidth).toBe(2);
    expect(settings.rendering.visibleBoundsHeight).toBe(3);
    expect(settings.rendering.visibleBoundsOffset).toEqual([0, 1, 0]);
  });
});
