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

const {applyTemplate} = require('../model/templates');
const {resolveTextures} = require('../utils/TextureResolver');

const FIXTURE_MODEL_BYTES = '{"meta":{"format_version":"4.5"},"name":"lizard"}';
const FIXTURE_TEXTURE_BYTES = Uint8Array.from(
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function fixtureSettings() {
  const settings = applyTemplate('quadruped_wandering');
  settings.namespace = 'example';
  settings.profileId = 'lizard';

  return settings;
}

function fixtureTextureResolution(settings) {
  return resolveTextures([
    {
      index: 0, name: '', namespace: '', folder: '', path: '',
      bytes: FIXTURE_TEXTURE_BYTES
    }
  ], settings || fixtureSettings());
}

function fixtureExportOptions(settings) {
  return {
    modelBytes: FIXTURE_MODEL_BYTES,
    textureResolution: fixtureTextureResolution(settings)
  };
}

module.exports = {
  FIXTURE_MODEL_BYTES,
  FIXTURE_TEXTURE_BYTES,
  fixtureSettings,
  fixtureExportOptions
};
