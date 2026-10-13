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

const contract = require('./fixtures/easy-model-api-0.2.0.json');
const {buildRenderProfile} = require('../builders/renderProfile');
const {buildServerProfile} = require('../builders/serverProfile');
const {Validator} = require('../model/Validator');
const {
  SCHEMA_VERSION,
  MODEL_TYPES,
  BODY_TYPES,
  MOVEMENT_TYPES,
  BEHAVIOR_MODES,
  PRESET_TYPES,
  BLOCK_ENTITY_PRESET_TYPES,
  ANIMATION_MODES,
  ANIMATION_VARIANT_MODES,
  ANIMATION_CLIPS,
  GAIT_TYPES,
  variantClipNames
} = require('../model/presetTypes');
const {applyTemplate} = require('../model/templates');

function sorted(values) {
  return values.slice().sort();
}

describe('mod API contract sync', () => {
  test('schema version matches the committed mod contract', () => {
    expect(SCHEMA_VERSION).toBe(contract.schema_version);
  });

  test('enum constants match the committed mod contract', () => {
    expect(sorted(MODEL_TYPES)).toEqual(sorted(contract.enums.model_types));
    expect(sorted(BODY_TYPES)).toEqual(sorted(contract.enums.body_types));
    expect(sorted(MOVEMENT_TYPES)).toEqual(
        sorted(contract.enums.movement_types));
    expect(sorted(BEHAVIOR_MODES)).toEqual(
        sorted(contract.enums.behavior_modes));
    expect(sorted(PRESET_TYPES)).toEqual(sorted(contract.enums.preset_types));
    expect(sorted(BLOCK_ENTITY_PRESET_TYPES)).toEqual(
        sorted(contract.enums.block_entity_preset_types));
    expect(sorted(ANIMATION_MODES)).toEqual(
        sorted(contract.enums.animation_modes));
    expect(sorted(ANIMATION_VARIANT_MODES)).toEqual(
        sorted(contract.enums.animation_variant_modes));
    expect(sorted(ANIMATION_CLIPS)).toEqual(
        sorted(contract.enums.animation_clips));
    expect(sorted(GAIT_TYPES)).toEqual(sorted(contract.enums.gaits));
  });

  test('validator budgets match the committed mod contract', () => {
    const budgets = Validator.BUDGETS;
    expect(budgets.maxModelFileSizeBytes).toBe(
        contract.budgets.max_model_file_size_bytes);
    expect(budgets.softModelFileSizeBytes).toBe(
        contract.budgets.soft_model_file_size_bytes);
    expect(budgets.maxTextureSize).toBe(contract.budgets.max_texture_size);
    expect(budgets.softTextureSize).toBe(contract.budgets.soft_texture_size);
    expect(budgets.maxBoneCount).toBe(contract.budgets.max_bone_count);
    expect(budgets.softBoneCount).toBe(contract.budgets.soft_bone_count);
    expect(budgets.maxCubeCount).toBe(contract.budgets.max_cube_count);
    expect(budgets.softCubeCount).toBe(contract.budgets.soft_cube_count);
    expect(budgets.maxHierarchyDepth).toBe(
        contract.budgets.max_hierarchy_depth);
    expect(budgets.softHierarchyDepth).toBe(
        contract.budgets.soft_hierarchy_depth);
    expect(budgets.maxAnimationCount).toBe(
        contract.budgets.max_animation_count);
    expect(budgets.softAnimationCount).toBe(
        contract.budgets.soft_animation_count);
  });
});

describe('animation variants and shoulder', () => {
  function variantSettings() {
    const settings = applyTemplate('humanoid_wandering');
    settings.namespace = 'example';
    settings.profileId = 'parrot_like';

    return settings;
  }

  test('variant clips are grouped like the mod groups them', () => {
    expect(variantClipNames([
      {name: 'Idle'}, {name: 'idle_2'}, {name: 'walk'}, {name: 'dance 1'},
      {name: 'dance 2'}, {name: 'jump_0'}, {name: ' '}, {name: 'idle_2'}
    ])).toEqual(['idle', 'idle_2', 'dance 1', 'dance 2']);
  });

  test('only non-default values are written', () => {
    const settings = variantSettings();
    settings.rendering.opacity = 0.5;
    settings.animation.variantMode = 'sequential';
    settings.animation.variantWeights = {' IDLE_2 ': 3, idle: 1};
    settings.shoulder = {offset: [0, 0.2, 0], scale: 1};
    const render = buildRenderProfile(settings);
    expect(render.rendering).toEqual({opacity: 0.5});
    expect(render.animation).toEqual(
        {variant_mode: 'sequential', variant_weights: {idle_2: 3}});
    expect(render.shoulder).toEqual({offset: [0, 0.2, 0]});
  });

  test('weights are dropped when variants are disabled', () => {
    const settings = variantSettings();
    settings.animation.variantMode = 'none';
    settings.animation.variantWeights = {idle_2: 3};
    expect(buildRenderProfile(settings).animation).toEqual(
        {variant_mode: 'none'});
  });

  test('block entities never write a shoulder', () => {
    const settings = applyTemplate('static', 'block_entity');
    settings.namespace = 'example';
    settings.profileId = 'shrine';
    settings.shoulder = {offset: [1, 1, 1], scale: 2};
    expect(buildRenderProfile(settings).shoulder).toBeUndefined();
  });
});

describe('mod example style stays minimal', () => {
  test('little_explorer style preset does not expand defaults', () => {
    const settings = applyTemplate('humanoid_wandering');
    settings.namespace = 'easy_model_entities_examples';
    settings.profileId = 'little_explorer';

    expect(buildServerProfile(settings)).toEqual({
      schema_version: '0.2.0',
      model_type: 'entity',
      preset_type: 'humanoid_wandering'
    });
    expect(buildRenderProfile(settings)).toEqual({
      schema_version: '0.2.0',
      preset_type: 'humanoid_wandering',
      model:
          'easy_model_entities_examples:easy_model_entities/models/little_explorer'
    });
  });

  test('shrine style block entity keeps the block render override', () => {
    const settings = applyTemplate('animated_randomly', 'block_entity');
    settings.namespace = 'easy_model_entities_examples';
    settings.profileId = 'shrine';

    expect(buildServerProfile(settings)).toEqual({
      schema_version: '0.2.0',
      model_type: 'block_entity',
      preset_type: 'animated_randomly'
    });
    expect(buildRenderProfile(settings)).toEqual({
      schema_version: '0.2.0',
      preset_type: 'static',
      model: 'easy_model_entities_examples:easy_model_entities/models/shrine',
      rendering: {shadow_radius: 0.5},
      animation: {mode: 'random_idle'}
    });
  });
});
