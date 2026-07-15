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

const ASSETS_PATTERN = /assets\/([a-z0-9_.-]+)\/textures\/(.+?)(?:\.png)?$/i;

function stripPng(value) {
  return value.replace(/\.png$/i, '');
}

function trimSlashes(value) {
  return value.replace(/^\/+|\/+$/g, '');
}

function defaultTextureLocation(settings) {
  return `${settings.namespace}:textures/entity/${settings.profileId}.png`;
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
      ? {
        external: true, label: location.replace(':textures/', ':').replace(
            /\.png$/i, '')
      }
      : {external: false, label: 'Custom Texture'};
}

function resolveTextures(descriptors, settings) {
  const defaultLocation = defaultTextureLocation(settings);
  const textures = {};
  const packed = [];
  let texture = null;

  (descriptors || []).forEach((descriptor, position) => {
    const index = Number.isInteger(descriptor.index) ? descriptor.index
        : position;
    let location = parseExternalLocation(descriptor);
    if (!location) {
      location = customLocation(settings, index);
      packed.push({
        fileName: customFileName(settings, index),
        bytes: descriptor.bytes
      });
    }

    if (index === 0) {
      if (location !== defaultLocation) {
        texture = location;
      }
    } else {
      textures[index] = location;
    }
  });

  return {texture, textures, packed};
}

module.exports = {
  resolveTextures,
  parseExternalLocation,
  describeTextureSource
};
