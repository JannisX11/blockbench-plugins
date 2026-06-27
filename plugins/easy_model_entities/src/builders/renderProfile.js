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
  presetShadowRadius,
  isCustom,
  MODEL_TYPE_BLOCK_ENTITY
} = require('../model/presetTypes');
const {diffFlat, assignIfPresent} = require('./profileDiff');

function renderPresetType(settings) {
  return settings.modelType === MODEL_TYPE_BLOCK_ENTITY
      ? 'static' : settings.presetType;
}

function buildRendering(settings) {
  const rendering = settings.rendering;
  return diffFlat({
    scale: rendering.scale,
    shadow_radius: rendering.shadowRadius,
    visible_bounds_width: rendering.visibleBoundsWidth ?? 0,
    visible_bounds_height: rendering.visibleBoundsHeight ?? 0,
    visible_bounds_offset: rendering.visibleBoundsOffset || [0, 0, 0]
  }, {
    scale: 1,
    shadow_radius: presetShadowRadius(renderPresetType(settings)),
    visible_bounds_width: 0,
    visible_bounds_height: 0,
    visible_bounds_offset: [0, 0, 0]
  });
}

function buildAnimation(settings) {
  const defaultMode = animationMode(renderPresetType(settings));
  const animation = diffFlat({
    mode: settings.animation.mode,
    swing_speed: settings.animation.swingSpeed,
    walk_speed_multiplier: settings.animation.walkSpeedMultiplier,
    idle_strength: settings.animation.idleStrength ?? 1,
    gait: settings.animation.gait || 'natural'
  }, {
    mode: defaultMode,
    swing_speed: 1,
    walk_speed_multiplier: 1,
    idle_strength: 1,
    gait: 'natural'
  });

  // Animation timing is meaningless when animation is disabled.
  if (settings.animation.mode === 'none') {
    delete animation.swing_speed;
    delete animation.walk_speed_multiplier;
    delete animation.idle_strength;
    delete animation.gait;
  }

  return animation;
}

function buildRenderProfile(settings, textureResolution) {
  const renderPreset = renderPresetType(settings);
  const custom = settings.modelType !== MODEL_TYPE_BLOCK_ENTITY
      && isCustom(settings.presetType);
  const profile = {
    schema_version: settings.schemaVersion,
    preset_type: renderPreset
  };

  if (custom || settings.host.bodyType !== bodyType(renderPreset)) {
    profile.body_type = settings.host.bodyType;
  }

  if (textureResolution && textureResolution.texture) {
    profile.texture = textureResolution.texture;
  }
  assignIfPresent(profile, 'textures',
      textureResolution && textureResolution.textures);

  assignIfPresent(profile, 'rendering', buildRendering(settings));
  assignIfPresent(profile, 'animation', buildAnimation(settings));

  return profile;
}

module.exports = {
  buildRenderProfile
};
