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
    dataFormat: 15,
    resourceFormat: 15,
    enabled: true
  },
  {
    id: '1.21.1',
    label: 'Minecraft 1.21.1',
    dataFormat: 48,
    resourceFormat: 34,
    enabled: false
  },
  {
    id: '1.21.11',
    label: 'Minecraft 1.21.11',
    dataFormat: null,
    resourceFormat: null,
    enabled: false
  },
  {
    id: '26.1.2',
    label: 'Minecraft 26.1.2',
    dataFormat: null,
    resourceFormat: null,
    enabled: false
  }
];

function getVersions() {
  return VERSIONS.map((version) => ({...version}));
}

function getVersion(id) {
  return VERSIONS.find((version) => version.id === id) || null;
}

function getEnabledVersions() {
  return getVersions().filter((version) => version.enabled);
}

function getDefaultVersionId() {
  return DEFAULT_VERSION_ID;
}

function getPackFormats(id) {
  const version = getVersion(id);
  if (!version?.enabled) {
    return null;
  }
  return {
    dataFormat: version.dataFormat,
    resourceFormat: version.resourceFormat
  };
}

module.exports = {
  getVersions,
  getEnabledVersions,
  getDefaultVersionId,
  getPackFormats
};
