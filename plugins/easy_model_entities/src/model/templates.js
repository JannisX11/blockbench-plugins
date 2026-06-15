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
  SCHEMA_VERSION,
  PRESET_TYPES,
  BLOCK_ENTITY_PRESET_TYPES,
  SELECTABLE_PRESET_TYPES,
  MODEL_TYPE_ENTITY,
  presetDefaults
} = require('./presetTypes');

const DEFAULT_PRESET = 'statue';

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
    targetVersion: '1.20.1'
  });
}

// Full settings object for a preset type, including the identity fields. The
// model type disambiguates presets that exist for both entities and block
// entities (e.g. "static").
function applyTemplate(presetType, modelType) {
  return deepMerge(getDefaults(),
      presetDefaults(presetType, modelType || MODEL_TYPE_ENTITY));
}

module.exports = {
  SCHEMA_VERSION,
  DEFAULT_PRESET,
  PRESET_TYPES,
  BLOCK_ENTITY_PRESET_TYPES,
  SELECTABLE_PRESET_TYPES,
  getDefaults,
  applyTemplate,
  presetDefaults,
  deepMerge
};
