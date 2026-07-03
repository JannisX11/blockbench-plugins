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
  settingsToForm,
  formToSettings,
  presetFormValues,
  resolveExportSettings
} = require('../ui/exportSettingsMapping');
const {presetOptions} = require('../ui/exportDialogOptions');
const {fixtureSettings} = require('./fixtureData');

const MODEL_DIMS = {width: 1, height: 2, eyeHeight: 1.8};

describe('exportDialog mapping', () => {
  test('settings survive a form round-trip', () => {
    const settings = fixtureSettings();
    const restored = formToSettings(settingsToForm(settings), settings);
    expect(restored).toEqual(settings);
  });

  test('form trims namespace and profile id', () => {
    const settings = fixtureSettings();
    const form = settingsToForm(settings);
    form.namespace = '  example  ';
    form.profileId = ' lizard ';
    const restored = formToSettings(form, settings);
    expect(restored.namespace).toBe('example');
    expect(restored.profileId).toBe('lizard');
  });
});

describe('presetOptions', () => {
  test('without experimental, every selectable preset is shown (custom hidden)',
      () => {
        const options = presetOptions('entity', false);
        expect(Object.keys(options)).toEqual([
          'static', 'statue', 'humanoid_still', 'humanoid_wandering',
          'quadruped_still', 'quadruped_wandering', 'aquatic_still',
          'aquatic_swimming', 'amphibious_still', 'amphibious_wandering',
          'winged_still', 'winged_wandering', 'winged_humanoid_still',
          'winged_humanoid_wandering', 'arthropod_still', 'arthropod_wandering',
          'cuboid_still', 'cuboid_hopping', 'floating_still'
        ]);
        expect(options.custom).toBeUndefined();
        expect(options.floating_still).toBeDefined();
      });

  test('experimental reveals custom on top of every selectable preset',
      () => {
        const options = presetOptions('entity', true);
        expect(Object.keys(options)[0]).toBe('custom');
        expect(Object.keys(options)).toHaveLength(20);
        expect(options.amphibious_wandering).toBeDefined();
        expect(options.floating_still).not.toMatch(/WIP/);
      });

  test('ensure keeps an already-selected experimental preset visible', () => {
    const options = presetOptions('entity', false, 'cuboid_still');
    expect(options.cuboid_still).toBeDefined();
    expect(options.custom).toBeUndefined();
  });

  test('block entity hides ticking unless experimental is on', () => {
    expect(Object.keys(presetOptions('block_entity', false))).toEqual(
        ['static', 'animated', 'animated_randomly']);
    expect(Object.keys(presetOptions('block_entity', true))).toEqual(
        ['static', 'ticking', 'animated', 'animated_randomly']);
  });
});

describe('presetFormValues', () => {
  test('returns advanced fields with model dimensions, no identity fields',
      () => {
        const values = presetFormValues('statue', 'entity', MODEL_DIMS);
        expect(values.bodyType).toBe('static');
        expect(values.animationMode).toBe('none');
        expect(values.width).toBe(1);
        expect(values.height).toBe(2);
        expect(values.namespace).toBeUndefined();
        expect(values.profileId).toBeUndefined();
        expect(values.targetVersion).toBeUndefined();
        expect(values.version).toBeUndefined();
      });
});

describe('resolveExportSettings', () => {
  const base = fixtureSettings();

  test(
      'built-in preset derives from template and model, ignoring hidden fields',
      () => {
        const form = {
          preset: 'statue',
          namespace: 'example.org',
          profileId: 'statue',
          targetVersion: '1.20.1',
          customize: false,
          width: 999,
          bodyType: 'biped'
        };
        const settings = resolveExportSettings(form, base, MODEL_DIMS);
        expect(settings.presetType).toBe('statue');
        expect(settings.host.bodyType).toBe('static');
        expect(settings.animation.mode).toBe('none');
        expect(settings.dimensions.width).toBe(1);
        expect(settings.dimensions.height).toBe(2);
        expect(settings.namespace).toBe('example.org');
        expect(settings.profileId).toBe('statue');
      });

  test('custom preset keeps the stored base settings', () => {
    const form = {
      preset: 'custom',
      namespace: 'example.org',
      profileId: 'lizard',
      targetVersion: '1.20.1',
      customize: false
    };
    const settings = resolveExportSettings(form, base, MODEL_DIMS);
    expect(settings.presetType).toBe('custom');
    expect(settings.dimensions).toEqual(base.dimensions);
    expect(settings.host).toEqual(base.host);
  });

  test('customize overlays advanced form fields', () => {
    const form = settingsToForm(fixtureSettings());
    form.preset = 'quadruped_wandering';
    form.customize = true;
    form.width = 3.5;
    form.maxHealth = 42;
    const settings = resolveExportSettings(form, base, MODEL_DIMS);
    expect(settings.dimensions.width).toBe(3.5);
    expect(settings.attributes.maxHealth).toBe(42);
  });

  test('standalone ZIP export maps to the packs target', () => {
    const form = {
      exportType: 'packs',
      modelType: 'entity',
      preset: 'statue',
      namespace: 'example',
      profileId: 'statue',
      targetVersion: '1.20.1'
    };
    const settings = resolveExportSettings(form, base, MODEL_DIMS);
    expect(settings.modelType).toBe('entity');
    expect(settings.exportTarget).toBe('packs');
    expect(settings.modelOnly).toBe(false);
  });

  test('block entity export uses the block preset and model type', () => {
    const form = {
      exportType: 'mod_project',
      modelType: 'block_entity',
      blockPreset: 'animated_randomly',
      namespace: 'example',
      profileId: 'shrine',
      targetVersion: '1.20.1'
    };
    const settings = resolveExportSettings(form, base, MODEL_DIMS);
    expect(settings.modelType).toBe('block_entity');
    expect(settings.presetType).toBe('animated_randomly');
    expect(settings.exportTarget).toBe('mod_project');
  });

  test('model-only export hides the data pack and forces mod project', () => {
    const form = {
      exportType: 'model_only',
      modelType: 'block_entity',
      preset: 'cuboid_still',
      namespace: 'example',
      profileId: 'chestling',
      targetVersion: '1.20.1'
    };
    const settings = resolveExportSettings(form, base, MODEL_DIMS);
    expect(settings.modelOnly).toBe(true);
    expect(settings.modelType).toBe('entity');
    expect(settings.presetType).toBe('cuboid_still');
    expect(settings.exportTarget).toBe('mod_project');
  });
});
