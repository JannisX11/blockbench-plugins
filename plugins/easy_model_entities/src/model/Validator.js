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
  ANIMATION_MODES,
  ANIMATION_VARIANT_MODES,
  BEHAVIOR_MODES,
  BODY_TYPES,
  GAIT_TYPES,
  MOVEMENT_TYPES,
  SHOULDER_CLIP,
  MODEL_TYPE_BLOCK_ENTITY,
  normalizeName,
  isStandardClip,
  standardClipNames
} = require('./presetTypes');
const {t} = require('../i18n/translations');

const SUPPORTED_ANIMATION_CHANNELS = new Set(['rotation', 'position']);
const ANY_FINITE = [-Number.MAX_VALUE, Number.MAX_VALUE];
const NON_NEGATIVE = [0, Number.MAX_VALUE];
const POSITIVE = 'positive';

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
    maxAnimationCount: 64,
    softAnimationCount: 32
  };

  static LIMITS = {
    minDimension: 0.01,
    maxDimension: 8,
    maxMovementSpeed: 2,
    maxStepHeight: 2
  };

  static REQUIRED_BODY_PARTS = {
    biped: ['head', 'body', 'left_arm', 'right_arm', 'left_leg', 'right_leg'],
    quadruped: ['body', 'head', 'front_left_leg', 'front_right_leg',
      'back_left_leg', 'back_right_leg'],
    aquatic: ['body'],
    amphibious: ['body'],
    winged: ['body', 'head', 'left_wing', 'right_wing'],
    winged_humanoid: ['body', 'head', 'left_arm', 'right_arm', 'left_wing',
      'right_wing'],
    arthropod: ['body', 'head', 'front_left_leg', 'front_right_leg',
      'middle_front_left_leg', 'middle_front_right_leg',
      'middle_back_left_leg', 'middle_back_right_leg', 'back_left_leg',
      'back_right_leg'],
    cuboid: ['body'],
    floating: ['body'],
    static: []
  };

  static MAX_LISTED_NAMES = 5;

  static MODEL_LOAD_ERROR_CODES = new Set(['MISSING_TEXTURE',
    'INVALID_TEXTURE_LOCATION', 'DUPLICATE_TEXTURE_INDEX',
    'MISSING_TEXTURE_INDEX', 'HIGH_ANIMATION_COUNT', 'MISSING_BODY_PART',
    'UNSUPPORTED_ELEMENT', 'CUBE_OUTSIDE_GROUP']);

  static #isFiniteNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
  }

  static #validateNumeric(errors, label, value) {
    if (!Validator.#isFiniteNumber(value)) {
      errors.push({
        code: 'INVALID_NUMERIC',
        message: t('eme.validation.INVALID_NUMERIC', label)
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
      message: t('eme.validation.range', label, minimum, maximum)
    });
  }

  static #validatePositive(errors, code, label, value) {
    if (!Validator.#validateNumeric(errors, label, value) || value > 0) {
      return;
    }

    errors.push({code: code, message: t('eme.validation.positive', label)});
  }

  static #choiceChecks(settings) {
    const {host, behavior, animation} = settings;

    return [
      ['INVALID_HOST_SETTINGS', 'entity.body_type', host.bodyType, BODY_TYPES],
      ['INVALID_HOST_SETTINGS', 'entity.movement_type', host.movementType,
        MOVEMENT_TYPES],
      ['INVALID_BEHAVIOR_SETTINGS', 'behavior.mode', behavior?.mode,
        BEHAVIOR_MODES],
      ['INVALID_ANIMATION_SETTINGS', 'animation.mode', animation.mode,
        ANIMATION_MODES],
      ['INVALID_ANIMATION_SETTINGS', 'animation.gait', animation.gait,
        GAIT_TYPES],
      ['INVALID_ANIMATION_SETTINGS', 'animation.variant_mode',
        animation.variantMode, ANIMATION_VARIANT_MODES]
    ];
  }

  static #numericChecks(settings) {
    const limits = Validator.LIMITS;
    const {dimensions, movement, attributes, rendering, animation} = settings;
    const dimensionRange = [limits.minDimension, limits.maxDimension];
    const maxEyeHeight = Number.isFinite(dimensions.height)
        ? dimensions.height : limits.maxDimension;

    return [
      ['INVALID_DIMENSIONS', 'dimensions.width', dimensions.width,
        dimensionRange],
      ['INVALID_DIMENSIONS', 'dimensions.height', dimensions.height,
        dimensionRange],
      ['INVALID_DIMENSIONS', 'dimensions.eye_height', dimensions.eyeHeight,
        [0, maxEyeHeight]],
      ['INVALID_MOVEMENT', 'movement.speed', movement.speed,
        [0, limits.maxMovementSpeed]],
      ['INVALID_MOVEMENT', 'movement.step_height', movement.stepHeight,
        [0, limits.maxStepHeight]],
      ['INVALID_ATTRIBUTES', 'attributes.max_health', attributes.maxHealth,
        NON_NEGATIVE],
      ['INVALID_ATTRIBUTES', 'attributes.movement_speed',
        attributes.movementSpeed, NON_NEGATIVE],
      ['INVALID_ATTRIBUTES', 'attributes.follow_range', attributes.followRange,
        NON_NEGATIVE],
      ['INVALID_RENDER_SETTINGS', 'rendering.scale', rendering.scale,
        POSITIVE],
      ['INVALID_RENDER_SETTINGS', 'rendering.shadow_radius',
        rendering.shadowRadius, NON_NEGATIVE],
      ['INVALID_RENDER_SETTINGS', 'rendering.visible_bounds_width',
        rendering.visibleBoundsWidth ?? 0, NON_NEGATIVE],
      ['INVALID_RENDER_SETTINGS', 'rendering.visible_bounds_height',
        rendering.visibleBoundsHeight ?? 0, NON_NEGATIVE],
      ['INVALID_ANIMATION_SETTINGS', 'animation.swing_speed',
        animation.swingSpeed, NON_NEGATIVE],
      ['INVALID_ANIMATION_SETTINGS', 'animation.walk_speed_multiplier',
        animation.walkSpeedMultiplier, NON_NEGATIVE],
      ['INVALID_ANIMATION_SETTINGS', 'animation.idle_strength',
        animation.idleStrength ?? 1, NON_NEGATIVE],
      ['INVALID_RENDER_SETTINGS', 'rendering.opacity', rendering.opacity ?? 1,
        [0, 1]],
      ...Validator.#variantWeightChecks(animation),
      ...Validator.#shoulderChecks(settings)
    ];
  }

  static #variantWeightChecks(animation) {
    if (animation.variantMode === 'none') {
      return [];
    }

    return Object.entries(animation.variantWeights || {}).map(
        ([clipName, weight]) => ['INVALID_ANIMATION_SETTINGS',
          `animation.variant_weights.${clipName}`, weight, POSITIVE]);
  }

  static #shoulderChecks(settings) {
    if (settings.modelType === MODEL_TYPE_BLOCK_ENTITY || !settings.shoulder) {
      return [];
    }

    const offset = settings.shoulder.offset || [0, 0, 0];

    return [
      ...['x', 'y', 'z'].map((axis, index) => ['INVALID_RENDER_SETTINGS',
        `shoulder.offset.${axis}`, offset[index], ANY_FINITE]),
      ['INVALID_RENDER_SETTINGS', 'shoulder.scale',
        settings.shoulder.scale ?? 1, POSITIVE]
    ];
  }

  static #budgetChecks(context) {
    const budgets = Validator.BUDGETS;
    const textureSize = Validator.#isFiniteNumber(context.textureWidth)
    && Validator.#isFiniteNumber(context.textureHeight)
        ? Math.max(context.textureWidth, context.textureHeight) : undefined;
    const bytesPerMegabyte = 1024 * 1024;

    return [
      [textureSize, budgets.softTextureSize, budgets.maxTextureSize,
        'SOFT_TEXTURE_SIZE', 'LARGE_TEXTURE',
        (limit) => t('eme.validation.budget.textureSize', limit)],
      [context.modelFileSize, budgets.softModelFileSizeBytes,
        budgets.maxModelFileSizeBytes, 'SOFT_MODEL_SIZE', 'LARGE_MODEL',
        (limit) => t('eme.validation.budget.modelSize',
            limit / bytesPerMegabyte)],
      [context.cubeCount, budgets.softCubeCount, budgets.maxCubeCount,
        'SOFT_CUBE_COUNT', 'HIGH_CUBE_COUNT',
        (limit) => t('eme.validation.budget.cubeCount', limit)],
      [context.boneCount, budgets.softBoneCount, budgets.maxBoneCount,
        'SOFT_BONE_COUNT', 'HIGH_BONE_COUNT',
        (limit) => t('eme.validation.budget.boneCount', limit)],
      [context.hierarchyDepth, budgets.softHierarchyDepth,
        budgets.maxHierarchyDepth, 'SOFT_HIERARCHY_DEPTH', 'DEEP_HIERARCHY',
        (limit) => t('eme.validation.budget.hierarchyDepth', limit)]
    ];
  }

  static #formatNames(names) {
    const listed = names.slice(0, Validator.MAX_LISTED_NAMES).join(', ');
    const remaining = names.length - Validator.MAX_LISTED_NAMES;

    return remaining > 0 ? t('eme.validation.more', listed, remaining)
        : listed;
  }

  static #pushNamed(issues, code, names) {
    if (names && names.length > 0) {
      issues.push({
        code: code,
        message: t(`eme.validation.${code}`, Validator.#formatNames(names))
      });
    }
  }

  static #duplicateNames(names) {
    const seen = new Set();
    const duplicates = new Set();
    (names || []).map(normalizeName).filter(Boolean).forEach((name) => {
      if (seen.has(name)) {
        duplicates.add(name);
      } else {
        seen.add(name);
      }
    });

    return [...duplicates];
  }

  static validateGeometry(geometry) {
    const errors = [];
    const warnings = [];

    Validator.#pushNamed(errors, 'UNSUPPORTED_ELEMENT',
        geometry.unsupportedElements);
    Validator.#pushNamed(errors, 'CUBE_OUTSIDE_GROUP', geometry.rootCubes);
    Validator.#pushNamed(warnings, 'FACE_UV_ROTATION_IGNORED',
        geometry.rotatedFaceCubes);
    Validator.#pushNamed(warnings, 'PER_TEXTURE_UV_SIZE',
        geometry.customUvSizeTextures);
    // The mod binds every modded_entity cube to texture 0, so only eme_entity
    // keeps a texture per cube that a mix on its faces can contradict.
    if (geometry.formatId === 'eme_entity') {
      Validator.#pushNamed(warnings, 'MIXED_TEXTURES_PER_CUBE',
          geometry.mixedTextureCubes);
    }
    Validator.#pushNamed(warnings, 'HIDDEN_ELEMENT', geometry.hiddenNodes);
    Validator.#pushNamed(warnings, 'DUPLICATE_GROUP_NAME',
        Validator.#duplicateNames(geometry.exportedGroupNames));

    return {errors, warnings};
  }

  static validateSettings(settings, context) {
    const errors = [];
    const warnings = [];
    const ctx = context || {};

    if (!ResourceLocation.isValidNamespace(settings.namespace)) {
      errors.push({
        code: 'INVALID_NAMESPACE',
        message: t('eme.validation.INVALID_NAMESPACE', settings.namespace,
            ResourceLocation.sanitizeNamespace(settings.namespace))
      });
    }
    if (!ResourceLocation.isValidPath(settings.profileId)) {
      errors.push({
        code: 'INVALID_PROFILE_ID',
        message: t('eme.validation.INVALID_PROFILE_ID', settings.profileId,
            ResourceLocation.sanitizeProfileId(settings.profileId))
      });
    }
    const blockEntity = settings.modelType === MODEL_TYPE_BLOCK_ENTITY;
    if (!blockEntity
        && !ResourceLocation.isValidResourceLocation(
            settings.host.entityType)) {
      errors.push({
        code: 'INVALID_RESOURCE_LOCATION',
        message: t('eme.validation.INVALID_RESOURCE_LOCATION',
            settings.host.entityType)
      });
    }
    const validPresets = blockEntity ? BLOCK_ENTITY_PRESET_TYPES : PRESET_TYPES;
    if (!validPresets.includes(settings.presetType)) {
      errors.push({
        code: 'INVALID_PRESET_TYPE',
        message: t('eme.validation.INVALID_PRESET_TYPE', settings.presetType)
      });
    }

    for (const [code, label, value, range] of Validator.#numericChecks(
        settings)) {
      if (range === POSITIVE) {
        Validator.#validatePositive(errors, code, label, value);
      } else {
        Validator.#validateRange(errors, code, label, value, ...range);
      }
    }
    for (const [code, field, value, choices] of Validator.#choiceChecks(
        settings)) {
      if (value !== undefined && !choices.includes(value)) {
        errors.push({
          code: code,
          message: t('eme.validation.choice', field, choices.join(', '))
        });
      }
    }

    if (ctx.hasModel === false) {
      errors.push({
        code: 'MISSING_MODEL',
        message: t('eme.validation.MISSING_MODEL')
      });
    }
    if (ctx.hasTexture === false) {
      errors.push({
        code: 'MISSING_TEXTURE',
        message: t('eme.validation.MISSING_TEXTURE')
      });
    }
    (ctx.textureIssues || []).forEach((issue) => errors.push(issue));

    const referencedTextures = ctx.referencedTextures || [];
    if (referencedTextures.length > 0) {
      warnings.push({
        code: 'EXTERNAL_TEXTURE_REFERENCE',
        message: t('eme.validation.EXTERNAL_TEXTURE_REFERENCE',
            referencedTextures.join(', '),
            t('eme.field.includeExternalTextures'))
      });
    }

    for (const [value, soft, max, softCode, maxCode, describe]
        of Validator.#budgetChecks(ctx)) {
      if (!Validator.#isFiniteNumber(value)) {
        continue;
      }
      if (value > max) {
        warnings.push({code: maxCode, message: describe(max)});
      } else if (value > soft) {
        warnings.push({code: softCode, message: describe(soft)});
      }
    }
    const budgets = Validator.BUDGETS;
    if (Validator.#isFiniteNumber(ctx.animationCount)
        && ctx.animationCount > budgets.maxAnimationCount) {
      errors.push({
        code: 'HIGH_ANIMATION_COUNT',
        message: t('eme.validation.HIGH_ANIMATION_COUNT',
            budgets.maxAnimationCount)
      });
    } else if (Validator.#isFiniteNumber(ctx.animationCount)
        && ctx.animationCount > budgets.softAnimationCount) {
      warnings.push({
        code: 'SOFT_ANIMATION_COUNT',
        message: t('eme.validation.SOFT_ANIMATION_COUNT',
            budgets.softAnimationCount)
      });
    }

    Validator.#pushNamed(warnings, 'DUPLICATE_ANIMATION_NAME',
        Validator.#duplicateNames(
            (ctx.animations || []).map((animation) => animation.name)));
    (ctx.animations || []).forEach((animation) => {
      const name = normalizeName(animation.name);
      const shoulderClip = !blockEntity && name === SHOULDER_CLIP;
      if (!isStandardClip(name) && !shoulderClip) {
        warnings.push({
          code: 'CUSTOM_ANIMATION_CLIP',
          message: t('eme.validation.CUSTOM_ANIMATION_CLIP', animation.name,
              ANIMATION_CLIPS.join(', '))
        });
      }
      if (animation.hasExpression) {
        warnings.push({
          code: 'UNSUPPORTED_ANIMATION_EXPRESSION',
          message: t('eme.validation.UNSUPPORTED_ANIMATION_EXPRESSION',
              animation.name)
        });
      }
      (animation.channels || []).forEach((channel) => {
        if (!SUPPORTED_ANIMATION_CHANNELS.has(channel)) {
          warnings.push({
            code: 'UNSUPPORTED_ANIMATION_CHANNEL',
            message: t('eme.validation.UNSUPPORTED_ANIMATION_CHANNEL',
                animation.name, channel)
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
        message: t('eme.validation.ANIMATIONS_NEVER_PLAYED',
            settings.presetType, clipNames.join(', '))
      });
    }

    Validator.getMissingBodyParts(settings.host.bodyType,
        ctx.boneNames || []).forEach((part) => {
      errors.push({
        code: 'MISSING_BODY_PART',
        message: t('eme.validation.MISSING_BODY_PART', settings.host.bodyType,
            part)
      });
    });

    if (ctx.geometry) {
      const geometryResult = Validator.validateGeometry(ctx.geometry);
      errors.push(...geometryResult.errors);
      warnings.push(...geometryResult.warnings);
    }

    return {errors, warnings, valid: errors.length === 0};
  }

  static validateModelLoad(settings, context) {
    return Validator.validateSettings(settings, context).errors.filter(
        (issue) => Validator.MODEL_LOAD_ERROR_CODES.has(issue.code));
  }

  static getMissingBodyParts(bodyType, boneNames) {
    const required = Validator.REQUIRED_BODY_PARTS[bodyType] || [];
    const present = new Set((boneNames || []).map(normalizeName));

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
