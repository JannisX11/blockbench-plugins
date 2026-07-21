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

const {ResourceLocation} = require('../utils/ResourceLocation');
const {
  PRESET_TYPES,
  BLOCK_ENTITY_PRESET_TYPES,
  ANIMATION_CLIPS,
  MODEL_TYPE_BLOCK_ENTITY
} = require('./presetTypes');

const SUPPORTED_ANIMATION_CHANNELS = new Set(['rotation', 'position']);

class Validator {
  static BUDGETS = {
    maxTextureSize: 2048,
    softTextureSize: 128,
    maxModelFileSizeBytes: 2 * 1024 * 1024,
    softModelFileSizeBytes: 1024 * 1024,
    maxCubeCount: 512,
    softCubeCount: 384,
    maxBoneCount: 128,
    softBoneCount: 96,
    maxHierarchyDepth: 32,
    softHierarchyDepth: 24,
    maxAnimationCount: 16
  };

  static REQUIRED_BODY_PARTS = {
    quadruped: ['root', 'body', 'head', 'front_left_leg', 'front_right_leg',
      'back_left_leg', 'back_right_leg'],
    biped: ['root', 'head', 'body', 'left_arm', 'right_arm', 'left_leg',
      'right_leg'],
    static: []
  };

  static #isFiniteNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
  }

  static #validateNumeric(errors, label, value) {
    if (!Validator.#isFiniteNumber(value)) {
      errors.push({
        code: 'INVALID_NUMERIC',
        message: `${label} must be a finite number`
      });
      return false;
    }

    return true;
  }

  static #warnIfOverBudget(warnings, value, soft, max, softWarning,
      maxWarning) {
    if (!Validator.#isFiniteNumber(value)) {
      return;
    }
    if (value > max) {
      warnings.push(maxWarning);
    } else if (value > soft) {
      warnings.push(softWarning);
    }
  }

  static validateSettings(settings, context) {
    const errors = [];
    const warnings = [];
    const ctx = context || {};

    if (!ResourceLocation.isValidNamespace(settings.namespace)) {
      errors.push({
        code: 'INVALID_NAMESPACE',
        message: `Invalid namespace: ${settings.namespace}`
      });
    }
    if (!ResourceLocation.isValidPath(settings.profileId)) {
      errors.push({
        code: 'INVALID_PROFILE_ID',
        message: `Invalid profile ID: ${settings.profileId}`
      });
    }

    const id = `${settings.namespace}:${settings.profileId}`;
    if (
        ResourceLocation.isValidNamespace(settings.namespace) &&
        ResourceLocation.isValidPath(settings.profileId) &&
        !ResourceLocation.isValidResourceLocation(id)
    ) {
      errors.push({
        code: 'INVALID_RESOURCE_LOCATION',
        message: `Invalid resource location: ${id}`
      });
    }
    const blockEntity = settings.modelType === MODEL_TYPE_BLOCK_ENTITY;
    if (!blockEntity
        && !ResourceLocation.isValidResourceLocation(
            settings.host.entityType)) {
      errors.push({
        code: 'INVALID_RESOURCE_LOCATION',
        message: `Invalid host entity type: ${settings.host.entityType}`
      });
    }
    const validPresets = blockEntity ? BLOCK_ENTITY_PRESET_TYPES : PRESET_TYPES;
    if (!validPresets.includes(settings.presetType)) {
      errors.push({
        code: 'INVALID_PRESET_TYPE',
        message: `Invalid preset type: ${settings.presetType}`
      });
    }

    const {width, height, eyeHeight} = settings.dimensions;
    const widthValid = Validator.#validateNumeric(errors, 'dimensions.width',
        width);
    const heightValid = Validator.#validateNumeric(errors, 'dimensions.height',
        height);
    const eyeValid = Validator.#validateNumeric(errors, 'dimensions.eye_height',
        eyeHeight);
    if (widthValid && width <= 0) {
      errors.push({
        code: 'INVALID_DIMENSIONS',
        message: 'width must be greater than 0'
      });
    }
    if (heightValid && height <= 0) {
      errors.push({
        code: 'INVALID_DIMENSIONS',
        message: 'height must be greater than 0'
      });
    }
    if (eyeValid && eyeHeight < 0) {
      errors.push({
        code: 'INVALID_DIMENSIONS',
        message: 'eye_height must not be negative'
      });
    }
    if (eyeValid && heightValid && eyeHeight > height) {
      errors.push({
        code: 'INVALID_DIMENSIONS',
        message: 'eye_height must not exceed height'
      });
    }

    Validator.#validateNumeric(errors, 'movement.speed',
        settings.movement.speed);
    Validator.#validateNumeric(errors, 'movement.step_height',
        settings.movement.stepHeight);

    if (ctx.hasModel === false) {
      errors.push(
          {code: 'MISSING_MODEL', message: 'No model present in project'});
    }
    if (ctx.hasTexture === false) {
      errors.push(
          {code: 'MISSING_TEXTURE', message: 'No texture present in project'});
    }
    (ctx.textureIssues || []).forEach((issue) => errors.push(issue));

    if (Validator.#isFiniteNumber(ctx.textureWidth)
        && Validator.#isFiniteNumber(ctx.textureHeight)) {
      const textureSize = Math.max(ctx.textureWidth, ctx.textureHeight);
      Validator.#warnIfOverBudget(warnings, textureSize,
          Validator.BUDGETS.softTextureSize, Validator.BUDGETS.maxTextureSize,
          {
            code: 'SOFT_TEXTURE_SIZE',
            message: `Texture larger than ${Validator.BUDGETS.softTextureSize}x${Validator.BUDGETS.softTextureSize}`
          },
          {
            code: 'LARGE_TEXTURE',
            message: `Texture larger than ${Validator.BUDGETS.maxTextureSize}x${Validator.BUDGETS.maxTextureSize}`
          });
    }
    Validator.#warnIfOverBudget(warnings, ctx.modelFileSize,
        Validator.BUDGETS.softModelFileSizeBytes,
        Validator.BUDGETS.maxModelFileSizeBytes,
        {
          code: 'SOFT_MODEL_SIZE',
          message: 'Model file larger than 1 MB'
        },
        {code: 'LARGE_MODEL', message: 'Model file larger than 2 MB'});
    Validator.#warnIfOverBudget(warnings, ctx.cubeCount,
        Validator.BUDGETS.softCubeCount, Validator.BUDGETS.maxCubeCount,
        {
          code: 'SOFT_CUBE_COUNT',
          message: `More than ${Validator.BUDGETS.softCubeCount} cubes`
        },
        {
          code: 'HIGH_CUBE_COUNT',
          message: `More than ${Validator.BUDGETS.maxCubeCount} cubes`
        });
    Validator.#warnIfOverBudget(warnings, ctx.boneCount,
        Validator.BUDGETS.softBoneCount, Validator.BUDGETS.maxBoneCount,
        {
          code: 'SOFT_BONE_COUNT',
          message: `More than ${Validator.BUDGETS.softBoneCount} bones`
        },
        {
          code: 'HIGH_BONE_COUNT',
          message: `More than ${Validator.BUDGETS.maxBoneCount} bones`
        });
    Validator.#warnIfOverBudget(warnings, ctx.hierarchyDepth,
        Validator.BUDGETS.softHierarchyDepth,
        Validator.BUDGETS.maxHierarchyDepth,
        {
          code: 'SOFT_HIERARCHY_DEPTH',
          message: `Hierarchy deeper than ${Validator.BUDGETS.softHierarchyDepth}`
        },
        {
          code: 'DEEP_HIERARCHY',
          message: `Hierarchy deeper than ${Validator.BUDGETS.maxHierarchyDepth}`
        });
    if (Validator.#isFiniteNumber(ctx.animationCount)
        && ctx.animationCount > Validator.BUDGETS.maxAnimationCount) {
      errors.push({
        code: 'HIGH_ANIMATION_COUNT',
        message: `More than ${Validator.BUDGETS.maxAnimationCount} animations; the mod refuses to load the model`
      });
    }

    (ctx.animations || []).forEach((animation) => {
      const name = String(animation.name || '').toLowerCase();
      if (!ANIMATION_CLIPS.includes(name)) {
        warnings.push({
          code: 'NON_STANDARD_ANIMATION',
          message: `Animation "${animation.name}" is not one of ${ANIMATION_CLIPS.join(
              ', ')} and is ignored by the mod`
        });
      }
      if (animation.hasExpression) {
        warnings.push({
          code: 'UNSUPPORTED_ANIMATION_EXPRESSION',
          message: `Animation "${animation.name}" uses expressions; the mod only supports numeric keyframes and drops the clip`
        });
      }
      (animation.channels || []).forEach((channel) => {
        if (!SUPPORTED_ANIMATION_CHANNELS.has(channel)) {
          warnings.push({
            code: 'UNSUPPORTED_ANIMATION_CHANNEL',
            message: `Animation "${animation.name}" uses the "${channel}" channel which is ignored by the mod`
          });
        }
      });
    });

    Validator.getMissingBodyParts(settings.host.bodyType,
        ctx.boneNames || []).forEach((part) => {
      warnings.push({
        code: 'MISSING_BODY_PART',
        message: `Missing recommended body part: ${part}`
      });
    });

    return {errors, warnings, valid: errors.length === 0};
  }

  static getMissingBodyParts(bodyType, boneNames) {
    const required = Validator.REQUIRED_BODY_PARTS[bodyType] || [];
    const present = new Set(
        (boneNames || []).map((name) => String(name).toLowerCase()));

    return required.filter((part) => !present.has(part));
  }

  static validateOutputPath(relativePath) {
    if (typeof relativePath !== 'string' || relativePath.length === 0) {
      return {
        valid: false,
        code: 'INVALID_OUTPUT_PATH',
        message: 'Empty output path'
      };
    }

    const normalized = relativePath.replaceAll('\\', '/');
    if (normalized.includes('..')) {
      return {
        valid: false,
        code: 'PATH_TRAVERSAL',
        message: 'Path traversal detected'
      };
    }

    if (/^([a-zA-Z]:\/|\/)/.test(normalized)) {
      return {
        valid: false,
        code: 'ABSOLUTE_PATH',
        message: 'Absolute paths are not allowed'
      };
    }

    return {valid: true, path: normalized};
  }
}

module.exports = {Validator};
