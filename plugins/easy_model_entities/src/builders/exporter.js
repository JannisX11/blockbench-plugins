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

function toJson(value) {
  return JSON.stringify(value, null, 2) + '\n';
}

function buildProfiles(settings) {
  return {
    serverProfile: buildServerProfile(settings),
    renderProfile: buildRenderProfile(settings)
  };
}

function dataPaths(settings) {
  const ns = settings.namespace;
  const id = settings.profileId;
  // Server profiles live in an entity/ or block_entity/ subfolder. Models and
  // textures stay at the mod's auto-resolved default location so the render
  // profile never has to spell out a model/texture path.
  const modelType = settings.modelType || 'entity';
  return {
    profile: `data/${ns}/easy_model_entities/profiles/${modelType}/${id}.json`,
    renderProfile: `assets/${ns}/easy_model_entities/render_profiles/${id}.json`,
    model: `assets/${ns}/easy_model_entities/models/${id}.bbmodel`,
    texture: `assets/${ns}/textures/entity/${id}.png`
  };
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
    {path: paths.texture, content: options.textureBytes, binary: true}
  ];
}

// Bundle to wrap into the outer export ZIP: a ready-to-drop datapack.zip and
// resourcepack.zip plus an install README.
function buildPackBundle(settings, options) {
  const opts = options || {};
  const {serverProfile, renderProfile} = buildProfiles(settings);
  return {
    readme: {path: 'README.md', content: buildReadme(settings), binary: false},
    datapack: datapackFiles(settings, serverProfile),
    resourcepack: resourcepackFiles(settings, renderProfile, opts),
    serverProfile,
    renderProfile
  };
}

function buildModProjectFiles(settings, options) {
  const opts = options || {};
  const renderProfile = buildRenderProfile(settings);
  const paths = dataPaths(settings);

  const files = [];
  let serverProfile = null;
  // Model-only export (mod integration, e.g. the Mimic example): the mod ships
  // its own entity classes, so no server profile / data pack is written.
  if (!settings.modelOnly) {
    serverProfile = buildServerProfile(settings);
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
      {path: paths.texture, content: opts.textureBytes, binary: true});

  return {files, serverProfile, renderProfile};
}

module.exports = {
  buildPackBundle,
  buildModProjectFiles,
  dataPaths,
  datapackFiles,
  resourcepackFiles
};
