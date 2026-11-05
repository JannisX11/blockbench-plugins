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
const {buildFormConfig} = require('../ui/exportDialog');
const {fixtureSettings} = require('./fixtureData');
const {SCHEMA_VERSION} = require('../model/presetTypes');
const {applyTemplate} = require('../model/templates');
const {buildServerProfile} = require('../builders/serverProfile');
const {buildRenderProfile} = require('../builders/renderProfile');

const MODEL_DIMS = {width: 1, height: 2, eyeHeight: 1.8};

describe('buildFormConfig', () => {
  const config = buildFormConfig(fixtureSettings(), {showCustomization: true});
  const visibleKeys = (form) => Object.keys(config).filter((key) => {
    const condition = config[key].condition;
    return condition === undefined || condition(form);
  });

  test('keeps the field order of the dialog', () => {
    expect(Object.keys(config)).toEqual([
      'exportType', 'modelType', 'preset', 'blockPreset', 'namespace',
      'profileId', 'targetVersion', 'customize',
      'host_header', 'hostEntityType', 'movementType', 'bodyType',
      'dimensions_header', 'width', 'height', 'eyeHeight',
      'movement_header', 'speed', 'stepHeight', 'gravity',
      'behavior_header', 'behaviorMode',
      'attributes_header', 'maxHealth', 'movementSpeed', 'followRange',
      'rendering_header', 'scale', 'shadowRadius', 'visibleBoundsWidth',
      'visibleBoundsHeight', 'visibleBoundsOffsetX', 'visibleBoundsOffsetY',
      'visibleBoundsOffsetZ', 'opacity',
      'animation_header', 'animationMode', 'swingSpeed',
      'walkSpeedMultiplier', 'idleStrength', 'gait', 'variantMode',
      'shoulder_header', 'shoulderOffsetX', 'shoulderOffsetY',
      'shoulderOffsetZ', 'shoulderScale'
    ]);
  });

  test('block entities hide the entity-only sections', () => {
    const keys = visibleKeys(
        {exportType: 'packs', modelType: 'block_entity', customize: true});
    expect(keys).toContain('width');
    expect(keys).toContain('scale');
    expect(keys).not.toContain('hostEntityType');
    expect(keys).not.toContain('speed');
    expect(keys).not.toContain('maxHealth');
    expect(keys).not.toContain('shoulderScale');
  });

  test('model-only export shows only render sections', () => {
    const keys = visibleKeys(
        {exportType: 'model_only', modelType: 'entity', customize: true});
    expect(keys).toContain('scale');
    expect(keys).toContain('gait');
    expect(keys).toContain('shoulderScale');
    expect(keys).not.toContain('width');
    expect(keys).not.toContain('hostEntityType');
  });

  test('variant clips get a labelled weight field hidden without variants',
      () => {
        const settings = fixtureSettings();
        settings.animation.variantWeights = {idle_2: 3};
        const variantConfig = buildFormConfig(settings,
            {showCustomization: true, variantClips: ['idle', 'idle_2']});
        const form = {exportType: 'packs', customize: true};
        expect(variantConfig.variantWeight0.value).toBe(1);
        expect(variantConfig.variantWeight1.value).toBe(3);
        expect(variantConfig.variantWeight1.label).toContain('idle_2');
        expect(variantConfig.variantWeight0.condition(
            {...form, variantMode: 'random'})).toBe(true);
        expect(variantConfig.variantWeight0.condition(
            {...form, variantMode: 'none'})).toBe(false);
      });
});

describe('exportDialog mapping', () => {
  function formMappedSettings() {
    const {customize, includeExternalTextures, ...settings} = fixtureSettings();

    return settings;
  }

  test('settings survive a form round-trip', () => {
    const settings = formMappedSettings();
    const restored = formToSettings(settingsToForm(settings), settings);
    expect(restored).toEqual(settings);
  });

  test('variant weights survive a form round-trip', () => {
    const settings = formMappedSettings();
    settings.animation.variantWeights = {walk: 1, walk_2: 0.5};
    const variantClips = ['walk', 'walk_2'];
    const restored = formToSettings(settingsToForm(settings, variantClips),
        settings, variantClips);
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

  test('projects of older plugin versions export the current schema', () => {
    const form = {preset: 'custom', namespace: 'example', profileId: 'lizard'};
    const settings = resolveExportSettings(form,
        {...base, schemaVersion: '0.1.0'}, MODEL_DIMS);
    expect(buildServerProfile(settings).schema_version).toBe(SCHEMA_VERSION);
    expect(buildRenderProfile(settings).schema_version).toBe(SCHEMA_VERSION);
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

  test('customized behavior mode derives look and stroll flags', () => {
    const form = settingsToForm(applyTemplate('statue'));
    Object.assign(form, {
      preset: 'statue',
      customize: true,
      movementType: 'ground',
      behaviorMode: 'ambient'
    });
    const settings = resolveExportSettings(form, base, MODEL_DIMS);
    expect(settings.behavior).toEqual(
        {mode: 'ambient', lookAtPlayers: true, randomStroll: true});
    expect(buildServerProfile(settings).behavior).toEqual(
        {mode: 'ambient', look_at_players: true, random_stroll: true});
  });

  test('standalone ZIP export keeps the packs export type', () => {
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
    expect(settings.exportType).toBe('packs');
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
    expect(settings.exportType).toBe('mod_project');
  });

  test('model-only export forces the entity model type', () => {
    const form = {
      exportType: 'model_only',
      modelType: 'block_entity',
      preset: 'cuboid_still',
      namespace: 'example',
      profileId: 'chestling',
      targetVersion: '1.20.1'
    };
    const settings = resolveExportSettings(form, base, MODEL_DIMS);
    expect(settings.exportType).toBe('model_only');
    expect(settings.modelType).toBe('entity');
    expect(settings.presetType).toBe('cuboid_still');
  });

  test.each(['resource_pack', 'data_pack'])(
      'single pack export %s keeps its export type and the model type',
      (exportType) => {
        const form = {
          exportType,
          modelType: 'block_entity',
          blockPreset: 'static',
          namespace: 'example',
          profileId: 'shrine',
          targetVersion: '1.20.1'
        };
        const settings = resolveExportSettings(form, base, MODEL_DIMS);
        expect(settings.exportType).toBe(exportType);
        expect(settings.modelType).toBe('block_entity');
      });
});
