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

const DEFAULT_VERSION_ID = '1.20.1';

const VERSIONS = [
  {
    id: '1.20.1',
    label: 'Minecraft 1.20.1',
    data: {packFormat: 15},
    resource: {packFormat: 15},
    enabled: true
  },
  {
    id: '1.21.1',
    label: 'Minecraft 1.21.1',
    data: {packFormat: 48},
    resource: {packFormat: 34},
    enabled: true
  },
  {
    id: '1.21.11',
    label: 'Minecraft 1.21.11',
    data: {packFormat: 94, minFormat: [94, 1], maxFormat: [94, 1]},
    resource: {packFormat: 75, minFormat: [75, 0], maxFormat: [75, 0]},
    enabled: true
  },
  {
    id: '26.1.2',
    label: 'Minecraft 26.1.2',
    data: {packFormat: 101, minFormat: [101, 1], maxFormat: [101, 1]},
    resource: {packFormat: 84, minFormat: [84, 0], maxFormat: [84, 0]},
    enabled: true
  },
  {
    id: '26.2',
    label: 'Minecraft 26.2',
    data: {packFormat: 101, minFormat: [101, 1], maxFormat: [101, 1]},
    resource: {packFormat: 84, minFormat: [84, 0], maxFormat: [84, 0]},
    enabled: true
  }
];

function getVersions() {
  return VERSIONS.map((version) => ({...version}));
}

function getVersion(id) {
  return VERSIONS.find((version) => version.id === id) || null;
}

function getDefaultVersionId() {
  return DEFAULT_VERSION_ID;
}

function getPackFormats(id) {
  const version = getVersion(id);
  if (!version?.enabled || !version.data || !version.resource) {
    return null;
  }
  return {
    data: version.data,
    resource: version.resource
  };
}

module.exports = {
  getVersions,
  getDefaultVersionId,
  getPackFormats
};
