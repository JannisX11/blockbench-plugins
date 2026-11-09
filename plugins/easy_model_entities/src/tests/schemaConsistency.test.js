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

const {applyTemplate, deepMerge} = require('../model/templates');
const {SELECTABLE_PRESET_TYPES} = require('../model/presetTypes');
const {buildServerProfile} = require('../builders/serverProfile');
const {buildRenderProfile} = require('../builders/renderProfile');

function withId(settings) {
  settings.namespace = 'example';
  settings.profileId = 'lizard';
  return settings;
}

describe('preset defaults mirror the mod (minimal output)', () => {
  describe.each(SELECTABLE_PRESET_TYPES)('%s', (preset) => {
    const settings = withId(applyTemplate(preset));

    test('server profile reduces to identity only', () => {
      expect(buildServerProfile(settings)).toEqual({
        schema_version: '0.2.0',
        model_type: 'entity',
        preset_type: preset
      });
    });

    test('render profile reduces to schema_version, preset_type and model',
        () => {
          expect(buildRenderProfile(settings)).toEqual({
            schema_version: '0.2.0',
            preset_type: preset,
            model: 'example:easy_model_entities/models/lizard'
          });
        });
  });
});

describe('custom preset writes the mod-required entity and dimensions', () => {
  const settings = withId(applyTemplate('custom'));

  test('server profile includes the full entity block and dimensions', () => {
    const profile = buildServerProfile(settings);
    expect(profile.model_type).toBe('entity');
    expect(profile.preset_type).toBe('custom');
    expect(profile.entity).toEqual({
      type: 'easy_model_entities:static_entity',
      movement_type: 'static',
      body_type: 'static'
    });
    expect(profile.dimensions).toEqual(
        {width: 0.6, height: 1.8, eye_height: 1.62});
  });

  test('render profile includes the required body_type', () => {
    expect(buildRenderProfile(settings).body_type).toBe('static');
  });
});

describe('block entity profiles', () => {
  function blockSettings(preset) {
    const settings = applyTemplate(preset, 'block_entity');
    settings.namespace = 'example';
    settings.profileId = 'shrine';
    return settings;
  }

  test('server profile carries model_type and no entity behavior',
      () => {
        const profile = buildServerProfile(blockSettings('animated_randomly'));
        expect(profile).toEqual({
          schema_version: '0.2.0',
          model_type: 'block_entity',
          preset_type: 'animated_randomly'
        });
        expect(profile.entity).toBeUndefined();
        expect(profile.movement).toBeUndefined();
        expect(profile.behavior).toBeUndefined();
        expect(profile.attributes).toBeUndefined();
      });

  test('render profile uses the static render preset with mapped animation',
      () => {
        const render = buildRenderProfile(blockSettings('animated_randomly'));
        expect(render.preset_type).toBe('static');
        expect(render.body_type).toBeUndefined();
        expect(render.animation.mode).toBe('random_idle');
      });

  test('static block entity emits no animation override', () => {
    const render = buildRenderProfile(blockSettings('static'));
    expect(render.preset_type).toBe('static');
    expect(render.animation).toBeUndefined();
  });
});

describe('customized settings emit only the deviating values', () => {
  const settings = deepMerge(withId(applyTemplate('quadruped_wandering')), {
    dimensions: {width: 1.2, height: 0.85, eyeHeight: 0.6},
    movement: {speed: 0.06, stepHeight: 0.4, gravity: true},
    attributes: {maxHealth: 12, movementSpeed: 0.06, followRange: 12}
  });

  test('server profile contains the stone turtle overrides only', () => {
    expect(buildServerProfile(settings)).toEqual({
      schema_version: '0.2.0',
      model_type: 'entity',
      preset_type: 'quadruped_wandering',
      dimensions: {width: 1.2, height: 0.85},
      movement: {speed: 0.06, step_height: 0.4},
      attributes: {max_health: 12, follow_range: 12}
    });
  });
});
