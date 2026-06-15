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
  bodyType,
  animationMode,
  presetRenderBounds,
  isCustom,
  MODEL_TYPE_BLOCK_ENTITY
} = require('../model/presetTypes');
const {diffFlat, assignIfPresent} = require('./profileDiff');

// Block entities render as a static cuboid block, so they always use the
// "static" render preset regardless of their server-side block entity preset.
function renderPresetType(settings) {
  return settings.modelType === MODEL_TYPE_BLOCK_ENTITY
      ? 'static' : settings.presetType;
}

function buildModelReference(settings) {
  return `${settings.namespace}:easy_model_entities/models/${settings.profileId}`;
}

function buildTextureReference(settings) {
  return `${settings.namespace}:textures/entity/${settings.profileId}.png`;
}

function buildRendering(settings) {
  const [boundsWidth, boundsHeight, boundsOffsetY, shadowRadius] =
      presetRenderBounds(renderPresetType(settings));
  return diffFlat({
    scale: settings.rendering.scale,
    shadow_radius: settings.rendering.shadowRadius,
    visible_bounds_width: settings.rendering.visibleBoundsWidth,
    visible_bounds_height: settings.rendering.visibleBoundsHeight,
    visible_bounds_offset: settings.rendering.visibleBoundsOffset.slice()
  }, {
    scale: 1,
    shadow_radius: shadowRadius,
    visible_bounds_width: boundsWidth,
    visible_bounds_height: boundsHeight,
    visible_bounds_offset: [0, boundsOffsetY, 0]
  });
}

function buildAnimation(settings) {
  const defaultMode = animationMode(renderPresetType(settings));
  const animation = diffFlat({
    mode: settings.animation.mode,
    swing_speed: settings.animation.swingSpeed,
    walk_speed_multiplier: settings.animation.walkSpeedMultiplier
  }, {
    mode: defaultMode,
    swing_speed: 1,
    walk_speed_multiplier: 1
  });
  // Animation timing is meaningless when animation is disabled.
  if (settings.animation.mode === 'none') {
    delete animation.swing_speed;
    delete animation.walk_speed_multiplier;
  }
  return animation;
}

function buildRenderProfile(settings) {
  const renderPreset = renderPresetType(settings);
  const custom = settings.modelType !== MODEL_TYPE_BLOCK_ENTITY
      && isCustom(settings.presetType);
  const profile = {
    schema_version: settings.schemaVersion,
    preset_type: renderPreset
  };
  if (settings.version) {
    profile.version = settings.version;
  }

  if (custom || settings.host.bodyType !== bodyType(renderPreset)) {
    profile.body_type = settings.host.bodyType;
  }

  // model and texture follow the mod's conventional default path
  // (namespace:easy_model_entities/models/id and namespace:textures/entity/id.png),
  // so they are omitted and resolved automatically by the mod.

  assignIfPresent(profile, 'rendering', buildRendering(settings));
  assignIfPresent(profile, 'animation', buildAnimation(settings));

  return profile;
}

module.exports = {
  buildRenderProfile,
  buildModelReference,
  buildTextureReference
};
