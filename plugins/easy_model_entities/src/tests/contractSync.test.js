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

const contract = require('./fixtures/easy-model-api-0.1.0.json');
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
  GAIT_TYPES
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
  });
});

describe('mod example style stays minimal', () => {
  test('little_explorer style preset does not expand defaults', () => {
    const settings = applyTemplate('humanoid_wandering');
    settings.namespace = 'easy_model_entities_examples';
    settings.profileId = 'little_explorer';

    expect(buildServerProfile(settings)).toEqual({
      schema_version: '0.1.0',
      model_type: 'entity',
      preset_type: 'humanoid_wandering',
      client: {render_profile: 'easy_model_entities_examples:little_explorer'}
    });
    expect(buildRenderProfile(settings)).toEqual({
      schema_version: '0.1.0',
      preset_type: 'humanoid_wandering'
    });
  });

  test('shrine style block entity keeps the block render override', () => {
    const settings = applyTemplate('animated_randomly', 'block_entity');
    settings.namespace = 'easy_model_entities_examples';
    settings.profileId = 'shrine';

    expect(buildServerProfile(settings)).toEqual({
      schema_version: '0.1.0',
      model_type: 'block_entity',
      preset_type: 'animated_randomly',
      client: {render_profile: 'easy_model_entities_examples:shrine'}
    });
    expect(buildRenderProfile(settings)).toEqual({
      schema_version: '0.1.0',
      preset_type: 'static',
      rendering: {shadow_radius: 0.5},
      animation: {mode: 'random_idle'}
    });
  });
});
