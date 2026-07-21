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

const {ResourceLocation} = require('./ResourceLocation');

const ASSETS_PATTERN = /assets\/([a-z0-9_.-]+)\/textures\/(.+?)(?:\.png)?$/i;

function stripPng(value) {
  return value.replace(/\.png$/i, '');
}

function trimSlashes(value) {
  return value.replace(/^\/+|\/+$/g, '');
}

function customFileName(settings, index) {
  return index === 0
      ? `${settings.profileId}.png`
      : `${settings.profileId}_${index}.png`;
}

function customLocation(settings, index) {
  return `${settings.namespace}:textures/entity/${customFileName(settings,
      index)}`;
}

function parseExternalLocation(descriptor) {
  const namespace = String(descriptor.namespace || '').trim().toLowerCase();
  if (namespace) {
    const folder = trimSlashes(String(descriptor.folder || '').trim());
    const name = stripPng(String(descriptor.name || '').trim()).toLowerCase();
    if (!name) {
      return null;
    }
    const rest = folder ? `${folder.toLowerCase()}/${name}` : name;

    return `${namespace}:textures/${rest}.png`;
  }

  const path = String(descriptor.path || '').replace(/\\/g, '/');
  const match = path.match(ASSETS_PATTERN);
  if (match && match[1].toLowerCase() === 'minecraft') {
    return `minecraft:textures/${match[2].toLowerCase()}.png`;
  }

  return null;
}

function describeTextureSource(descriptor) {
  const location = parseExternalLocation(descriptor);
  return location
      ? {label: location.replace(':textures/', ':').replace(/\.png$/i, '')}
      : {label: 'Custom Texture'};
}

function resolveTextures(descriptors, settings) {
  const textures = {};
  const packed = [];
  const issues = [];
  const resolvedIndices = new Set();
  let texture = null;

  (descriptors || []).forEach((descriptor, position) => {
    const index = Number.isInteger(descriptor.index) ? descriptor.index
        : position;
    if (resolvedIndices.has(index)) {
      issues.push({
        code: 'DUPLICATE_TEXTURE_INDEX',
        message: `Texture slot ${index} is assigned more than once`
      });
      return;
    }

    const externalLocation = parseExternalLocation(descriptor);
    if (externalLocation
        && !ResourceLocation.isValidResourceLocation(externalLocation)) {
      issues.push({
        code: 'INVALID_TEXTURE_LOCATION',
        message: `Texture slot ${index} points to the invalid location `
            + `${externalLocation}, check its namespace and folder`
      });
      return;
    }

    resolvedIndices.add(index);
    const location = externalLocation || customLocation(settings, index);
    if (!externalLocation) {
      packed.push({
        fileName: customFileName(settings, index),
        bytes: descriptor.bytes
      });
    }

    if (index === 0) {
      texture = location;
    } else {
      textures[index] = location;
    }
  });

  if (!texture && resolvedIndices.size > 0) {
    issues.push({
      code: 'MISSING_TEXTURE_INDEX',
      message: 'Texture slot 0 is missing, the model has no primary texture'
    });
  }

  return {texture, textures, packed, issues};
}

module.exports = {
  resolveTextures,
  parseExternalLocation,
  describeTextureSource
};
