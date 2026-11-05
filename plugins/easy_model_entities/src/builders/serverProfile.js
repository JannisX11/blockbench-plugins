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
  movementDefaults,
  behaviorDefaults,
  isCustomEntity,
  SCHEMA_VERSION,
  DEFAULT_MAX_HEALTH,
  DEFAULT_FOLLOW_RANGE,
  MODEL_TYPE_BLOCK_ENTITY,
  MODEL_TYPE_ENTITY
} = require('../model/presetTypes');
const {diffFlat, assignIfPresent} = require('./profileDiff');

function toDimensionsJson(values) {
  return {
    width: values.width,
    height: values.height,
    eye_height: values.eyeHeight
  };
}

function toMovementJson(values) {
  return {
    speed: values.speed,
    step_height: values.stepHeight,
    gravity: values.gravity
  };
}

function toBehaviorJson(values) {
  return {
    mode: values.mode,
    look_at_players: values.lookAtPlayers,
    random_stroll: values.randomStroll
  };
}

function toAttributesJson(values) {
  return {
    max_health: values.maxHealth,
    movement_speed: values.movementSpeed,
    follow_range: values.followRange
  };
}

function effectiveDefaults(settings) {
  const preset = settings.presetType;
  const movementType = settings.host.movementType;

  return {
    movement: toMovementJson(movementDefaults(preset, movementType)),
    behavior: toBehaviorJson(behaviorDefaults(preset, movementType)),
    attributes: toAttributesJson({
      maxHealth: DEFAULT_MAX_HEALTH,
      movementSpeed: settings.movement.speed,
      followRange: DEFAULT_FOLLOW_RANGE
    }),
    dimensions: toDimensionsJson(
        presetDefaults(preset, settings.modelType).dimensions)
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
  const values = toDimensionsJson(settings.dimensions);
  if (custom) {
    return values;
  }

  return diffFlat(values, defaults.dimensions);
}

function buildServerProfile(settings) {
  const modelType = settings.modelType || MODEL_TYPE_ENTITY;
  const blockEntity = modelType === MODEL_TYPE_BLOCK_ENTITY;
  const custom = isCustomEntity(modelType, settings.presetType);
  const defaults = effectiveDefaults(settings);

  const profile = {
    schema_version: SCHEMA_VERSION,
    model_type: modelType,
    preset_type: settings.presetType
  };

  if (!blockEntity) {
    assignIfPresent(profile, 'entity', buildEntity(settings, custom));
  }

  assignIfPresent(profile, 'dimensions',
      buildDimensions(settings, defaults, custom));

  if (!blockEntity) {
    assignIfPresent(profile, 'movement', diffFlat(
        toMovementJson(settings.movement), defaults.movement));
    assignIfPresent(profile, 'behavior', diffFlat(
        toBehaviorJson(settings.behavior), defaults.behavior));
    assignIfPresent(profile, 'attributes', diffFlat(
        toAttributesJson(settings.attributes), defaults.attributes));
  }

  return profile;
}

module.exports = {buildServerProfile};
