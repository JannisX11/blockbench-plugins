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

const {getPackFormats} = require('../model/versionMatrix');

function buildPack(descriptor, description) {
  const pack = {pack_format: descriptor.packFormat};
  if (descriptor.minFormat) {
    pack.min_format = descriptor.minFormat;
  }
  if (descriptor.maxFormat) {
    pack.max_format = descriptor.maxFormat;
  }
  pack.description = description;

  return {pack};
}

function buildMcmeta(settings, kind, description) {
  const formats = getPackFormats(settings.targetVersion);
  if (!formats) {
    throw new Error(
        `Unsupported or disabled target version: ${settings.targetVersion}`);
  }
  return buildPack(formats[kind], description);
}

function buildDataPackMcmeta(settings) {
  return buildMcmeta(settings, 'data',
      'Easy Model Entities server profiles');
}

function buildResourcePackMcmeta(settings) {
  return buildMcmeta(settings, 'resource',
      'Easy Model Entities render assets');
}

module.exports = {buildDataPackMcmeta, buildResourcePackMcmeta};
