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

// Mirrors de.markusbordihn.easymodelentities.profile.ModelPresetType and the
// per-preset defaults derived by EasyModelProfileParser / ModelRenderProfileParser.
// This file is the single source of truth the plugin uses to compute minimal
// (diff-based) profiles, so it must stay in sync with the mod.

const SCHEMA_VERSION = '0.1.0';

// Mirrors de.markusbordihn.easymodelentities.data.profile.ModelType.
const MODEL_TYPE_ENTITY = 'entity';
const MODEL_TYPE_BLOCK_ENTITY = 'block_entity';
const MODEL_TYPES = [MODEL_TYPE_ENTITY, MODEL_TYPE_BLOCK_ENTITY];

const GROUND_ENTITY = 'easy_model_entities:ground_entity';
const STATIC_ENTITY = 'easy_model_entities:static_entity';

const FALLBACK_DIMENSIONS = {width: 0.6, height: 1.8, eyeHeight: 1.62};
const BLOCK_ENTITY_DIMENSIONS = {width: 1.0, height: 1.0, eyeHeight: 0.5};

// All ModelPresetType values in serialized form.
const PRESET_TYPES = [
  'custom',
  'static',
  'statue',
  'humanoid_still',
  'humanoid_wandering',
  'quadruped_still',
  'quadruped_wandering',
  'aquatic_still',
  'aquatic_swimming',
  'winged_still',
  'winged_wandering',
  'winged_humanoid_still',
  'winged_humanoid_wandering',
  'arthropod_still',
  'arthropod_wandering',
  'cuboid_still',
  'cuboid_hopping',
  'floating_still'
];

// All ModelBlockEntityPresetType values in serialized form.
const BLOCK_ENTITY_PRESET_TYPES = [
  'static',
  'ticking',
  'animated',
  'animated_randomly'
];

// Presets the mod marks as stable for pack authors; experimental ones are hidden
// in the UI behind the "Show experimental presets" setting.
const STABLE_PRESET_TYPES = new Set([
  'static',
  'statue',
  'humanoid_still',
  'humanoid_wandering',
  'quadruped_still',
  'quadruped_wandering',
  // Block entity stable presets.
  'animated',
  'animated_randomly'
]);

// Presets selectable as a starting point in the UI (custom handled separately).
const SELECTABLE_PRESET_TYPES = PRESET_TYPES.filter((id) => id !== 'custom');

function isStablePreset(presetType) {
  return STABLE_PRESET_TYPES.has(presetType);
}

function isCustom(presetType) {
  return presetType === 'custom';
}

function isStill(presetType) {
  return String(presetType).endsWith('_still');
}

function isMoving(presetType) {
  return String(presetType).endsWith('_wandering')
      || presetType === 'aquatic_swimming'
      || presetType === 'cuboid_hopping';
}

function bodyType(presetType) {
  switch (presetType) {
    case 'humanoid_still':
    case 'humanoid_wandering':
      return 'biped';
    case 'quadruped_still':
    case 'quadruped_wandering':
      return 'quadruped';
    case 'aquatic_still':
    case 'aquatic_swimming':
      return 'aquatic';
    case 'winged_still':
    case 'winged_wandering':
      return 'winged';
    case 'winged_humanoid_still':
    case 'winged_humanoid_wandering':
      return 'winged_humanoid';
    case 'arthropod_still':
    case 'arthropod_wandering':
      return 'arthropod';
    case 'cuboid_still':
    case 'cuboid_hopping':
      return 'cuboid';
    case 'floating_still':
      return 'floating';
    default:
      return 'static';
  }
}

function movementType(presetType) {
  return isMoving(presetType) ? 'ground' : 'static';
}

function entityType(presetType) {
  return isMoving(presetType) || presetType === 'static' ? GROUND_ENTITY
      : STATIC_ENTITY;
}

function presetDimensions(presetType) {
  switch (presetType) {
    case 'quadruped_still':
    case 'quadruped_wandering':
      return {width: 0.9, height: 0.9, eyeHeight: 0.6};
    case 'aquatic_still':
    case 'aquatic_swimming':
      return {width: 0.7, height: 0.4, eyeHeight: 0.25};
    case 'winged_still':
    case 'winged_wandering':
      return {width: 0.6, height: 0.9, eyeHeight: 0.6};
    case 'winged_humanoid_still':
    case 'winged_humanoid_wandering':
      return {width: 0.6, height: 0.8, eyeHeight: 0.6};
    case 'arthropod_still':
    case 'arthropod_wandering':
      return {width: 1.4, height: 0.9, eyeHeight: 0.45};
    case 'cuboid_still':
    case 'cuboid_hopping':
    case 'floating_still':
      return {width: 1.0, height: 1.0, eyeHeight: 0.5};
    default:
      return {...FALLBACK_DIMENSIONS};
  }
}

// Shadow radius the mod derives per render preset (ModelRenderSettings).
function presetShadowRadius(presetType) {
  switch (presetType) {
    case 'quadruped_still':
    case 'quadruped_wandering':
      return 0.45;
    case 'aquatic_still':
    case 'aquatic_swimming':
    case 'winged_still':
    case 'winged_wandering':
    case 'winged_humanoid_still':
    case 'winged_humanoid_wandering':
      return 0.25;
    case 'arthropod_still':
    case 'arthropod_wandering':
      return 0.7;
    case 'cuboid_still':
    case 'cuboid_hopping':
    case 'floating_still':
      return 0.5;
    default:
      return 0.3;
  }
}

// Behavior mode the mod derives for a preset, given the resolved movement type
// (only relevant for the custom preset where movement type can vary).
function behaviorModeFor(presetType, move) {
  if (isMoving(presetType)) {
    return 'ambient';
  }

  if (isStill(presetType)) {
    return 'idle_only';
  }

  if (presetType === 'custom') {
    return move === 'ground' ? 'idle_only' : 'static';
  }

  return 'static';
}

function behaviorMode(presetType) {
  return behaviorModeFor(presetType, movementType(presetType));
}

// Movement defaults the mod derives from the resolved movement type.
function movementDefaults(presetType, move) {
  const ground = move === 'ground';
  return {
    speed: ground ? 0.22 : 0,
    stepHeight: ground ? 0.6 : 0,
    gravity: presetType === 'static' || ground
  };
}

function animationMode(presetType) {
  return presetType === 'custom' || presetType === 'static'
  || presetType === 'statue' ? 'none' : 'automatic';
}

// Animation mode the mod derives for a block entity preset.
function blockEntityAnimationMode(presetType) {
  switch (presetType) {
    case 'animated':
      return 'automatic';
    case 'animated_randomly':
      return 'random_idle';
    default:
      return 'none';
  }
}

// Block entities ignore movement/behavior/attributes; the host is always a
// static cuboid block.
function blockEntityPresetDefaults(presetType) {
  return {
    schemaVersion: SCHEMA_VERSION,
    modelType: MODEL_TYPE_BLOCK_ENTITY,
    presetType: presetType,
    host: {entityType: '', movementType: 'static', bodyType: 'static'},
    dimensions: {...BLOCK_ENTITY_DIMENSIONS},
    movement: {speed: 0, stepHeight: 0, gravity: false},
    behavior: {mode: 'static', lookAtPlayers: false, randomStroll: false},
    attributes: {maxHealth: 10, movementSpeed: 0, followRange: 16},
    rendering: {scale: 1, shadowRadius: 0.5},
    animation: {
      mode: blockEntityAnimationMode(presetType),
      swingSpeed: 1,
      walkSpeedMultiplier: 1
    }
  };
}

function presetDefaults(presetType, modelType) {
  if (modelType === MODEL_TYPE_BLOCK_ENTITY) {
    return blockEntityPresetDefaults(presetType);
  }

  const move = movementType(presetType);
  const ground = move === 'ground';
  const speed = ground ? 0.22 : 0;
  const mode = behaviorMode(presetType);

  return {
    schemaVersion: SCHEMA_VERSION,
    modelType: MODEL_TYPE_ENTITY,
    presetType: presetType,
    host: {
      entityType: entityType(presetType),
      movementType: move,
      bodyType: bodyType(presetType)
    },
    dimensions: presetDimensions(presetType),
    movement: {
      speed: speed,
      stepHeight: ground ? 0.6 : 0,
      gravity: presetType === 'static' || ground
    },
    behavior: {
      mode: mode,
      lookAtPlayers: mode === 'idle_only' || mode === 'ambient',
      randomStroll: ground && mode === 'ambient'
    },
    attributes: {maxHealth: 10, movementSpeed: speed, followRange: 16},
    rendering: {scale: 1, shadowRadius: presetShadowRadius(presetType)},
    animation: {
      mode: animationMode(presetType),
      swingSpeed: 1,
      walkSpeedMultiplier: 1
    }
  };
}

module.exports = {
  SCHEMA_VERSION,
  MODEL_TYPE_ENTITY,
  MODEL_TYPE_BLOCK_ENTITY,
  PRESET_TYPES,
  BLOCK_ENTITY_PRESET_TYPES,
  SELECTABLE_PRESET_TYPES,
  isStablePreset,
  isCustom,
  bodyType,
  behaviorModeFor,
  movementDefaults,
  animationMode,
  presetDimensions,
  presetShadowRadius,
  presetDefaults
};
