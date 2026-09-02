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
  defaultRenderingSettings,
  defaultAnimationSettings,
  isCustom,
  MODEL_TYPE_BLOCK_ENTITY
} = require('../model/presetTypes');
const {diffFlat, assignIfPresent} = require('./profileDiff');

function renderPresetType(settings) {
  return settings.modelType === MODEL_TYPE_BLOCK_ENTITY
      ? 'static' : settings.presetType;
}

function toRenderingJson(values) {
  return {
    scale: values.scale,
    shadow_radius: values.shadowRadius,
    visible_bounds_width: values.visibleBoundsWidth ?? 0,
    visible_bounds_height: values.visibleBoundsHeight ?? 0,
    visible_bounds_offset: values.visibleBoundsOffset || [0, 0, 0]
  };
}

function buildRendering(settings) {
  return diffFlat(toRenderingJson(settings.rendering),
      toRenderingJson(defaultRenderingSettings(renderPresetType(settings))));
}

function toAnimationJson(values) {
  return {
    mode: values.mode,
    swing_speed: values.swingSpeed,
    walk_speed_multiplier: values.walkSpeedMultiplier,
    idle_strength: values.idleStrength ?? 1,
    gait: values.gait || 'natural'
  };
}

function buildAnimation(settings) {
  const defaults = defaultAnimationSettings(
      animationMode(renderPresetType(settings)));
  const animation = diffFlat(toAnimationJson(settings.animation),
      toAnimationJson(defaults));

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

  profile.model =
      `${settings.namespace}:easy_model_entities/models/${settings.profileId}`;

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
