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

const {MODEL_TYPE_ENTITY, presetDefaults} = require('./presetTypes');
const {getDefaultVersionId} = require('./versionMatrix');

const DEFAULT_PRESET = 'statue';
const DEFAULT_PROFILE_ID = 'entity';

const IDENTITY_KEYS = [
  'modelType',
  'presetType',
  'namespace',
  'profileId',
  'targetVersion'
];

const MODEL_SETTING_KEYS = [
  ...IDENTITY_KEYS,
  'customize',
  'includeExternalTextures',
  'host',
  'dimensions',
  'movement',
  'behavior',
  'attributes',
  'rendering',
  'animation',
  'shoulder',
  'lastExportedVersion',
  'lastExportedTargetVersion'
];

function pickKeys(settings, keys) {
  return Object.fromEntries(keys
  .filter((key) => settings[key] !== undefined)
  .map((key) => [key, settings[key]]));
}

function deepMerge(target, source) {
  const result = Array.isArray(target) ? target.slice() : ({
    ...target
  });
  Object.keys(source).forEach((key) => {
    const value = source[key];
    if (isPlainObject(value)) {
      result[key] = deepMerge(result[key] || {}, value);
    } else if (Array.isArray(value)) {
      result[key] = value.slice();
    } else {
      result[key] = value;
    }
  });

  return result;
}

function getDefaults() {
  return deepMerge(presetDefaults(DEFAULT_PRESET), {
    namespace: 'example_org',
    profileId: DEFAULT_PROFILE_ID,
    targetVersion: getDefaultVersionId(),
    customize: false,
    includeExternalTextures: true
  });
}

function applyTemplate(presetType, modelType) {
  return deepMerge(getDefaults(),
      presetDefaults(presetType, modelType || MODEL_TYPE_ENTITY));
}

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function differenceFrom(template, value) {
  if (isPlainObject(value) && isPlainObject(template)) {
    const difference = {};
    Object.keys(value).forEach((key) => {
      const changed = differenceFrom(template[key], value[key]);
      if (changed !== undefined) {
        difference[key] = changed;
      }
    });

    return Object.keys(difference).length > 0 ? difference : undefined;
  }

  return JSON.stringify(value) === JSON.stringify(template)
      ? undefined : value;
}

function presetTemplate(settings) {
  return applyTemplate(settings.presetType || DEFAULT_PRESET,
      settings.modelType);
}

// Identity keys are kept even at their default, so a changed plugin default
// never retargets an existing project.
function compactModelSettings(settings) {
  const picked = pickKeys(settings, MODEL_SETTING_KEYS);

  return {
    ...pickKeys(picked, IDENTITY_KEYS),
    ...differenceFrom(presetTemplate(picked), picked)
  };
}

function expandModelSettings(storedSettings) {
  return deepMerge(presetTemplate(storedSettings), storedSettings);
}

module.exports = {
  DEFAULT_PRESET,
  DEFAULT_PROFILE_ID,
  getDefaults,
  applyTemplate,
  deepMerge,
  compactModelSettings,
  expandModelSettings
};
