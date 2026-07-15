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

const {buildServerProfile} = require('./serverProfile');
const {buildRenderProfile} = require('./renderProfile');
const {buildDataPackMcmeta, buildResourcePackMcmeta} = require('./packMeta');
const {buildReadme} = require('./readme');
const {hashString} = require('../utils/hash');

function toJson(value) {
  return JSON.stringify(value, null, 2) + '\n';
}

function stampVersion(serverProfile, renderProfile) {
  if (!serverProfile) {
    return;
  }

  const version = hashString(toJson(serverProfile));
  serverProfile.version = version;
  renderProfile.version = version;
}

function buildProfiles(settings, textureResolution) {
  const serverProfile = buildServerProfile(settings);
  const renderProfile = buildRenderProfile(settings, textureResolution);
  stampVersion(serverProfile, renderProfile);

  return {serverProfile, renderProfile};
}

function dataPaths(settings) {
  const namespace = settings.namespace;
  const id = settings.profileId;
  const modelType = settings.modelType || 'entity';

  return {
    profile: `data/${namespace}/easy_model_entities/profiles/${modelType}/${id}.json`,
    renderProfile:
        `assets/${namespace}/easy_model_entities/render_profiles/${modelType}/${id}.json`,
    model: `assets/${namespace}/easy_model_entities/models/${id}.bbmodel`
  };
}

function textureFiles(settings, textureResolution) {
  const namespace = settings.namespace;
  const packed = (textureResolution && textureResolution.packed) || [];

  return packed.map((entry) => ({
    path: `assets/${namespace}/textures/entity/${entry.fileName}`,
    content: entry.bytes,
    binary: true
  }));
}

function datapackFiles(settings, serverProfile) {
  return [
    {
      path: 'pack.mcmeta', content: toJson(buildDataPackMcmeta(settings)),
      binary: false
    },
    {
      path: dataPaths(settings).profile, content: toJson(serverProfile),
      binary: false
    }
  ];
}

function resourcepackFiles(settings, renderProfile, options) {
  const paths = dataPaths(settings);
  return [
    {
      path: 'pack.mcmeta', content: toJson(buildResourcePackMcmeta(settings)),
      binary: false
    },
    {path: paths.renderProfile, content: toJson(renderProfile), binary: false},
    {path: paths.model, content: options.modelBytes, binary: true},
    ...textureFiles(settings, options.textureResolution)
  ];
}

function packFileNames(settings) {
  return {
    datapack: `${settings.profileId}_datapack.zip`,
    resourcepack: `${settings.profileId}_resourcepack.zip`
  };
}

function buildPackBundle(settings, options) {
  const opts = options || {};
  const {serverProfile, renderProfile} = buildProfiles(settings,
      opts.textureResolution);
  const fileNames = packFileNames(settings);

  return {
    readme: {
      path: 'README.md', content: buildReadme(settings, fileNames),
      binary: false
    },
    datapack: datapackFiles(settings, serverProfile),
    resourcepack: resourcepackFiles(settings, renderProfile, opts),
    datapackFileName: fileNames.datapack,
    resourcepackFileName: fileNames.resourcepack,
    serverProfile,
    renderProfile
  };
}

function buildModProjectFiles(settings, options) {
  const opts = options || {};
  const renderProfile = buildRenderProfile(settings, opts.textureResolution);
  const paths = dataPaths(settings);

  const files = [];
  const serverProfile = settings.modelOnly ? null : buildServerProfile(
      settings);
  stampVersion(serverProfile, renderProfile);
  if (serverProfile) {
    files.push({
      path: paths.profile, content: toJson(serverProfile),
      binary: false
    });
  }

  files.push(
      {
        path: paths.renderProfile, content: toJson(renderProfile),
        binary: false
      },
      {path: paths.model, content: opts.modelBytes, binary: true},
      ...textureFiles(settings, opts.textureResolution));

  return {files, serverProfile, renderProfile};
}

module.exports = {
  buildPackBundle,
  buildModProjectFiles
};
