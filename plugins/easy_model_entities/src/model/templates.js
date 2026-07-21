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

const MODEL_SETTING_KEYS = [
  'schemaVersion',
  'modelType',
  'presetType',
  'namespace',
  'profileId',
  'targetVersion',
  'customize',
  'host',
  'dimensions',
  'movement',
  'behavior',
  'attributes',
  'rendering',
  'animation',
  'lastExportedVersion'
];

function pickModelSettings(settings) {
  if (!settings || typeof settings !== 'object') {
    return settings;
  }

  const picked = {};
  MODEL_SETTING_KEYS.forEach((key) => {
    if (settings[key] !== undefined) {
      picked[key] = settings[key];
    }
  });

  return picked;
}

function deepMerge(target, source) {
  const result = Array.isArray(target) ? target.slice() : ({
    ...target
  });
  Object.keys(source).forEach((key) => {
    const value = source[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
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
    profileId: 'entity',
    targetVersion: getDefaultVersionId()
  });
}

function applyTemplate(presetType, modelType) {
  return deepMerge(getDefaults(),
      presetDefaults(presetType, modelType || MODEL_TYPE_ENTITY));
}

module.exports = {
  DEFAULT_PRESET,
  getDefaults,
  applyTemplate,
  deepMerge,
  pickModelSettings
};
