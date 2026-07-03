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
  presetDefaults,
  presetDimensions,
  movementDefaults,
  behaviorModeFor,
  wandersByMovement,
  isCustom,
  DEFAULT_MAX_HEALTH,
  DEFAULT_FOLLOW_RANGE,
  MODEL_TYPE_BLOCK_ENTITY,
  MODEL_TYPE_ENTITY
} = require('../model/presetTypes');
const {diffFlat, assignIfPresent} = require('./profileDiff');

function effectiveDefaults(settings) {
  const preset = settings.presetType;
  const movementType = settings.host.movementType;
  const movement = movementDefaults(preset, movementType);
  const mode = behaviorModeFor(preset, movementType);

  return {
    movement: {
      speed: movement.speed,
      step_height: movement.stepHeight,
      gravity: movement.gravity
    },
    behavior: {
      mode: mode,
      look_at_players: mode === 'idle_only' || mode === 'ambient',
      random_stroll: wandersByMovement(movementType) && mode === 'ambient'
    },
    attributes: {
      max_health: DEFAULT_MAX_HEALTH,
      movement_speed: settings.movement.speed,
      follow_range: DEFAULT_FOLLOW_RANGE
    },
    dimensions: settings.modelType === MODEL_TYPE_BLOCK_ENTITY
        ? presetDefaults(preset, MODEL_TYPE_BLOCK_ENTITY).dimensions
        : presetDimensions(preset)
  };
}

function buildEntity(settings, custom) {
  if (!custom) {
    return {};
  }

  const host = settings.host;

  return {
    type: host.entityType,
    movement_type: host.movementType,
    body_type: host.bodyType
  };
}

function buildDimensions(settings, defaults, custom) {
  const values = {
    width: settings.dimensions.width,
    height: settings.dimensions.height,
    eye_height: settings.dimensions.eyeHeight
  };
  if (custom) {
    return values;
  }

  return diffFlat(values, {
    width: defaults.dimensions.width,
    height: defaults.dimensions.height,
    eye_height: defaults.dimensions.eyeHeight
  });
}

function buildServerProfile(settings) {
  const modelType = settings.modelType || MODEL_TYPE_ENTITY;
  const blockEntity = modelType === MODEL_TYPE_BLOCK_ENTITY;
  const custom = !blockEntity && isCustom(settings.presetType);
  const defaults = effectiveDefaults(settings);

  const profile = {
    schema_version: settings.schemaVersion,
    model_type: modelType,
    preset_type: settings.presetType
  };

  profile.client = {
    render_profile: `${settings.namespace}:${settings.profileId}`
  };

  if (!blockEntity) {
    assignIfPresent(profile, 'entity', buildEntity(settings, custom));
  }

  assignIfPresent(profile, 'dimensions',
      buildDimensions(settings, defaults, custom));

  if (!blockEntity) {
    assignIfPresent(profile, 'movement', diffFlat({
      speed: settings.movement.speed,
      step_height: settings.movement.stepHeight,
      gravity: settings.movement.gravity
    }, defaults.movement));

    assignIfPresent(profile, 'behavior', diffFlat({
      mode: settings.behavior.mode,
      look_at_players: settings.behavior.lookAtPlayers,
      random_stroll: settings.behavior.randomStroll
    }, defaults.behavior));

    assignIfPresent(profile, 'attributes', diffFlat({
      max_health: settings.attributes.maxHealth,
      movement_speed: settings.attributes.movementSpeed,
      follow_range: settings.attributes.followRange
    }, defaults.attributes));
  }

  return profile;
}

module.exports = {buildServerProfile};
