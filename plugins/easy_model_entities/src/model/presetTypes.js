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

const SCHEMA_VERSION = '0.2.0';

const MODEL_TYPE_ENTITY = 'entity';
const MODEL_TYPE_BLOCK_ENTITY = 'block_entity';
const MODEL_TYPES = [MODEL_TYPE_ENTITY, MODEL_TYPE_BLOCK_ENTITY];

const BODY_TYPES = [
  'static',
  'biped',
  'quadruped',
  'aquatic',
  'amphibious',
  'winged',
  'winged_humanoid',
  'arthropod',
  'cuboid',
  'floating'
];

const MOVEMENT_TYPES = ['ground', 'water', 'amphibious', 'static'];
const BEHAVIOR_MODES = ['idle_only', 'ambient', 'static', 'external_owner'];
const ANIMATION_MODES = ['automatic', 'random_idle', 'none'];
const ANIMATION_CLIPS = ['idle', 'walk', 'swim', 'fly', 'hurt', 'death',
  'attack', 'sit'];
const ANIMATION_VARIANT_MODES = ['random', 'sequential', 'none'];
const SHOULDER_CLIP = 'shoulder';
const CLIP_VARIANT_SUFFIX = /^(.+?)[_ ]([1-9][0-9]*)$/;
const GAIT_TYPES = ['natural', 'feline', 'ungulate'];

const GROUND_ENTITY = 'easy_model_entities:ground_entity';
const STATIC_ENTITY = 'easy_model_entities:static_entity';
const AQUATIC_ENTITY = 'easy_model_entities:aquatic_entity';
const AMPHIBIOUS_ENTITY = 'easy_model_entities:amphibious_entity';
const HOST_ENTITY_TYPES = [GROUND_ENTITY, STATIC_ENTITY, AQUATIC_ENTITY,
  AMPHIBIOUS_ENTITY];

const FALLBACK_DIMENSIONS = {width: 0.6, height: 1.8, eyeHeight: 1.62};
const BLOCK_ENTITY_DIMENSIONS = {width: 1.0, height: 1.0, eyeHeight: 0.5};

const STATIC_FAMILY = {
  bodyType: 'static',
  dimensions: FALLBACK_DIMENSIONS,
  shadowRadius: 0.3
};
const PRESET_FAMILIES = new Map([
  ['humanoid', {...STATIC_FAMILY, bodyType: 'biped'}],
  ['quadruped', {
    bodyType: 'quadruped',
    dimensions: {width: 0.9, height: 0.9, eyeHeight: 0.6},
    shadowRadius: 0.45
  }],
  ['aquatic', {
    bodyType: 'aquatic',
    dimensions: {width: 0.7, height: 0.4, eyeHeight: 0.25},
    shadowRadius: 0.25
  }],
  ['amphibious', {
    bodyType: 'amphibious',
    dimensions: {width: 0.9, height: 0.6, eyeHeight: 0.4},
    shadowRadius: 0.45
  }],
  ['winged', {
    bodyType: 'winged',
    dimensions: {width: 0.6, height: 0.9, eyeHeight: 0.6},
    shadowRadius: 0.25
  }],
  ['winged_humanoid', {
    bodyType: 'winged_humanoid',
    dimensions: {width: 0.6, height: 0.8, eyeHeight: 0.6},
    shadowRadius: 0.25
  }],
  ['arthropod', {
    bodyType: 'arthropod',
    dimensions: {width: 1.4, height: 0.9, eyeHeight: 0.45},
    shadowRadius: 0.7
  }],
  ['cuboid', {
    bodyType: 'cuboid',
    dimensions: BLOCK_ENTITY_DIMENSIONS,
    shadowRadius: 0.5
  }],
  ['floating', {
    bodyType: 'floating',
    dimensions: BLOCK_ENTITY_DIMENSIONS,
    shadowRadius: 0.5
  }]
]);
const PRESET_MOTION_SUFFIX = /_(still|wandering|swimming|hopping)$/;

const DEFAULT_SPEEDS = new Map([['ground', 0.22], ['amphibious', 0.15],
  ['water', 0.1]]);
const BLOCK_ENTITY_ANIMATION_MODES = new Map([['animated', 'automatic'],
  ['animated_randomly', 'random_idle']]);

const DEFAULT_MAX_HEALTH = 10;
const DEFAULT_FOLLOW_RANGE = 16;

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
  'amphibious_still',
  'amphibious_wandering',
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

const BLOCK_ENTITY_PRESET_TYPES = [
  'static',
  'ticking',
  'animated',
  'animated_randomly'
];

const EXPERIMENTAL_PRESET_TYPES = new Set(['custom', 'ticking']);

const SELECTABLE_PRESET_TYPES = PRESET_TYPES.filter((id) => id !== 'custom');

function normalizeName(name) {
  return String(name || '').trim().toLowerCase();
}

function clipBaseName(clipName) {
  const match = CLIP_VARIANT_SUFFIX.exec(clipName);

  return match ? match[1] : clipName;
}

function isStandardClip(name) {
  return ANIMATION_CLIPS.includes(clipBaseName(normalizeName(name)));
}

function standardClipNames(animations) {
  return (animations || [])
  .map((animation) => normalizeName(animation.name))
  .filter(isStandardClip);
}

function variantClipNames(animations) {
  const clipNames = [...new Set((animations || [])
  .map((animation) => normalizeName(animation.name))
  .filter((clipName) => clipName.length > 0))];
  const groupSizes = new Map();
  clipNames.forEach((clipName) => {
    const baseName = clipBaseName(clipName);
    groupSizes.set(baseName, (groupSizes.get(baseName) ?? 0) + 1);
  });

  return clipNames.filter(
      (clipName) => groupSizes.get(clipBaseName(clipName)) > 1);
}

function isStablePreset(presetType) {
  return !EXPERIMENTAL_PRESET_TYPES.has(presetType);
}

function isCustom(presetType) {
  return presetType === 'custom';
}

function isCustomEntity(modelType, presetType) {
  return modelType !== MODEL_TYPE_BLOCK_ENTITY && isCustom(presetType);
}

function isStill(presetType) {
  return String(presetType).endsWith('_still');
}

function isMoving(presetType) {
  return String(presetType).endsWith('_wandering')
      || presetType === 'aquatic_swimming'
      || presetType === 'cuboid_hopping';
}

function presetFamily(presetType) {
  if (!PRESET_TYPES.includes(presetType)) {
    return STATIC_FAMILY;
  }

  return PRESET_FAMILIES.get(presetType.replace(PRESET_MOTION_SUFFIX, ''))
      || STATIC_FAMILY;
}

function bodyType(presetType) {
  return presetFamily(presetType).bodyType;
}

function isAquatic(presetType) {
  return presetType === 'aquatic_still' || presetType === 'aquatic_swimming';
}

function isAmphibious(presetType) {
  return presetType === 'amphibious_still'
      || presetType === 'amphibious_wandering';
}

function movementType(presetType) {
  if (isAquatic(presetType)) {
    return 'water';
  }
  if (isAmphibious(presetType)) {
    return 'amphibious';
  }

  return isMoving(presetType) ? 'ground' : 'static';
}

function entityType(presetType) {
  if (isAquatic(presetType)) {
    return AQUATIC_ENTITY;
  }
  if (isAmphibious(presetType)) {
    return AMPHIBIOUS_ENTITY;
  }

  return isMoving(presetType) || presetType === 'static' ? GROUND_ENTITY
      : STATIC_ENTITY;
}

function presetDimensions(presetType) {
  return {...presetFamily(presetType).dimensions};
}

function behaviorModeFor(presetType, move) {
  if (isMoving(presetType)) {
    return 'ambient';
  }

  if (isStill(presetType)) {
    return 'idle_only';
  }

  if (presetType === 'custom') {
    return move === 'ground' || move === 'amphibious' ? 'idle_only' : 'static';
  }

  return 'static';
}

function wandersByMovement(move) {
  return move === 'ground' || move === 'amphibious' || move === 'water';
}

function behaviorForMode(mode, move) {
  return {
    mode: mode,
    lookAtPlayers: mode === 'idle_only' || mode === 'ambient',
    randomStroll: wandersByMovement(move) && mode === 'ambient'
  };
}

function behaviorDefaults(presetType, move) {
  return behaviorForMode(behaviorModeFor(presetType, move), move);
}

function movementDefaults(presetType, move) {
  return {
    speed: DEFAULT_SPEEDS.get(move) ?? 0,
    stepHeight: move === 'ground' || move === 'amphibious' ? 0.6 : 0,
    gravity: presetType === 'static' || move !== 'static'
  };
}

function animationMode(presetType) {
  return presetType === 'custom' || presetType === 'static'
  || presetType === 'statue' ? 'none' : 'automatic';
}

function defaultRenderingSettings(presetType) {
  return {
    scale: 1,
    shadowRadius: presetFamily(presetType).shadowRadius,
    visibleBoundsWidth: 0,
    visibleBoundsHeight: 0,
    visibleBoundsOffset: [0, 0, 0],
    opacity: 1
  };
}

function defaultAnimationSettings(mode) {
  return {
    mode: mode,
    swingSpeed: 1,
    walkSpeedMultiplier: 1,
    idleStrength: 1,
    gait: 'natural',
    variantMode: 'random',
    variantWeights: {}
  };
}

function defaultShoulderSettings() {
  return {offset: [0, 0, 0], scale: 1};
}

function blockEntityPresetDefaults(presetType) {
  return {
    modelType: MODEL_TYPE_BLOCK_ENTITY,
    presetType: presetType,
    host: {entityType: '', movementType: 'static', bodyType: 'static'},
    dimensions: {...BLOCK_ENTITY_DIMENSIONS},
    movement: {speed: 0, stepHeight: 0, gravity: false},
    behavior: {mode: 'static', lookAtPlayers: false, randomStroll: false},
    attributes: {
      maxHealth: DEFAULT_MAX_HEALTH,
      movementSpeed: 0,
      followRange: DEFAULT_FOLLOW_RANGE
    },
    rendering: defaultRenderingSettings('cuboid_still'),
    animation: defaultAnimationSettings(
        BLOCK_ENTITY_ANIMATION_MODES.get(presetType) ?? 'none')
  };
}

function presetDefaults(presetType, modelType) {
  if (modelType === MODEL_TYPE_BLOCK_ENTITY) {
    return blockEntityPresetDefaults(presetType);
  }

  const move = movementType(presetType);
  const movement = movementDefaults(presetType, move);

  return {
    modelType: MODEL_TYPE_ENTITY,
    presetType: presetType,
    host: {
      entityType: entityType(presetType),
      movementType: move,
      bodyType: bodyType(presetType)
    },
    dimensions: presetDimensions(presetType),
    movement: movement,
    behavior: behaviorDefaults(presetType, move),
    attributes: {
      maxHealth: DEFAULT_MAX_HEALTH,
      movementSpeed: movement.speed,
      followRange: DEFAULT_FOLLOW_RANGE
    },
    rendering: defaultRenderingSettings(presetType),
    animation: defaultAnimationSettings(animationMode(presetType)),
    shoulder: defaultShoulderSettings()
  };
}

module.exports = {
  SCHEMA_VERSION,
  MODEL_TYPE_ENTITY,
  MODEL_TYPE_BLOCK_ENTITY,
  MODEL_TYPES,
  BODY_TYPES,
  MOVEMENT_TYPES,
  DEFAULT_MAX_HEALTH,
  DEFAULT_FOLLOW_RANGE,
  BEHAVIOR_MODES,
  PRESET_TYPES,
  BLOCK_ENTITY_PRESET_TYPES,
  ANIMATION_MODES,
  ANIMATION_CLIPS,
  ANIMATION_VARIANT_MODES,
  SHOULDER_CLIP,
  GAIT_TYPES,
  SELECTABLE_PRESET_TYPES,
  HOST_ENTITY_TYPES,
  normalizeName,
  isStandardClip,
  standardClipNames,
  variantClipNames,
  isStablePreset,
  isCustom,
  isCustomEntity,
  bodyType,
  behaviorForMode,
  behaviorDefaults,
  movementDefaults,
  animationMode,
  presetDefaults,
  defaultRenderingSettings,
  defaultAnimationSettings,
  defaultShoulderSettings
};
