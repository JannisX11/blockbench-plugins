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
  MODEL_TYPE_BLOCK_ENTITY,
  standardClipNames
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

  static LIMITS = {
    minDimension: 0.01,
    maxDimension: 8,
    maxMovementSpeed: 2,
    maxStepHeight: 2
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

  static #validateRange(errors, code, label, value, minimum, maximum) {
    if (!Validator.#validateNumeric(errors, label, value)
        || (value >= minimum && value <= maximum)) {
      return;
    }

    errors.push({
      code: code,
      message: `${label} must be between ${minimum} and ${maximum}`
    });
  }

  static #validateNonNegative(errors, code, label, value) {
    Validator.#validateRange(errors, code, label, value, 0,
        Number.MAX_VALUE);
  }

  static #validatePositive(errors, code, label, value) {
    if (!Validator.#validateNumeric(errors, label, value) || value > 0) {
      return;
    }

    errors.push({code: code, message: `${label} must be greater than 0`});
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
        message: `Invalid namespace: ${settings.namespace}, use for example `
            + `${ResourceLocation.sanitizeNamespace(settings.namespace)}`
      });
    }
    if (!ResourceLocation.isValidPath(settings.profileId)) {
      errors.push({
        code: 'INVALID_PROFILE_ID',
        message: `Invalid profile ID: ${settings.profileId}, use for example `
            + `${ResourceLocation.sanitizeProfileId(settings.profileId)}`
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

    const limits = Validator.LIMITS;
    const {width, height, eyeHeight} = settings.dimensions;
    Validator.#validateRange(errors, 'INVALID_DIMENSIONS', 'dimensions.width',
        width, limits.minDimension, limits.maxDimension);
    Validator.#validateRange(errors, 'INVALID_DIMENSIONS', 'dimensions.height',
        height, limits.minDimension, limits.maxDimension);
    Validator.#validateRange(errors, 'INVALID_DIMENSIONS',
        'dimensions.eye_height', eyeHeight, 0,
        Number.isFinite(height) ? height : limits.maxDimension);

    Validator.#validateRange(errors, 'INVALID_MOVEMENT', 'movement.speed',
        settings.movement.speed, 0, limits.maxMovementSpeed);
    Validator.#validateRange(errors, 'INVALID_MOVEMENT',
        'movement.step_height', settings.movement.stepHeight, 0,
        limits.maxStepHeight);

    Validator.#validateNonNegative(errors, 'INVALID_ATTRIBUTES',
        'attributes.max_health', settings.attributes.maxHealth);
    Validator.#validateNonNegative(errors, 'INVALID_ATTRIBUTES',
        'attributes.movement_speed', settings.attributes.movementSpeed);
    Validator.#validateNonNegative(errors, 'INVALID_ATTRIBUTES',
        'attributes.follow_range', settings.attributes.followRange);

    const rendering = settings.rendering;
    Validator.#validatePositive(errors, 'INVALID_RENDER_SETTINGS',
        'rendering.scale', rendering.scale);
    Validator.#validateNonNegative(errors, 'INVALID_RENDER_SETTINGS',
        'rendering.shadow_radius', rendering.shadowRadius);
    Validator.#validateNonNegative(errors, 'INVALID_RENDER_SETTINGS',
        'rendering.visible_bounds_width', rendering.visibleBoundsWidth ?? 0);
    Validator.#validateNonNegative(errors, 'INVALID_RENDER_SETTINGS',
        'rendering.visible_bounds_height', rendering.visibleBoundsHeight ?? 0);

    const animation = settings.animation;
    Validator.#validateNonNegative(errors, 'INVALID_ANIMATION_SETTINGS',
        'animation.swing_speed', animation.swingSpeed);
    Validator.#validateNonNegative(errors, 'INVALID_ANIMATION_SETTINGS',
        'animation.walk_speed_multiplier', animation.walkSpeedMultiplier);
    Validator.#validateNonNegative(errors, 'INVALID_ANIMATION_SETTINGS',
        'animation.idle_strength', animation.idleStrength ?? 1);

    if (ctx.hasModel === false) {
      errors.push(
          {code: 'MISSING_MODEL', message: 'No model present in project'});
    }
    if (ctx.hasTexture === false) {
      errors.push(
          {code: 'MISSING_TEXTURE', message: 'No texture present in project'});
    }
    (ctx.textureIssues || []).forEach((issue) => errors.push(issue));

    const referencedTextures = ctx.referencedTextures || [];
    if (referencedTextures.length > 0) {
      warnings.push({
        code: 'EXTERNAL_TEXTURE_REFERENCE',
        message: `${referencedTextures.join(
                ', ')} stays a reference and is not `
            + 'part of the export; the mod or pack providing it has to be '
            + 'installed, or enable "Include external textures"'
      });
    }

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
          code: 'CUSTOM_ANIMATION_CLIP',
          message: `Animation "${animation.name}" is not one of ${ANIMATION_CLIPS.join(
              ', ')} and is never played automatically; it can only be played by name via command or API`
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

    const clipNames = standardClipNames(ctx.animations);
    if (!blockEntity && clipNames.length > 0
        && (settings.animation.mode === 'none'
            || settings.host.bodyType === 'static')) {
      warnings.push({
        code: 'ANIMATIONS_NEVER_PLAYED',
        message: `The preset ${settings.presetType} renders without animation, `
            + `so the mod never plays ${clipNames.join(
                ', ')}; pick an animated `
            + 'preset instead'
      });
    }

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
