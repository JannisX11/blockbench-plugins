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

const fs = require('fs');
const os = require('os');
const path = require('path');

const {performExport, zipExportName} = require('../exportFlow');
const {BlockbenchAdapter} = require('../BlockbenchAdapter');
const {registerEmeCodecHooks} = require('../format/EmeCodecHooks');
const {FORMAT_ID} = require('../format/EmeFormat');
const {pickModelSettings} = require('../model/templates');
const {
  EXPORT_TYPE_MOD_PROJECT,
  EXPORT_TYPE_RESOURCE_PACK
} = require('../model/exportTypes');
const {fixtureSettings, fixtureTextureResolution} = require('./fixtureData');

function compileProject() {
  const event = {model: {}};
  compileHandlers.forEach((handler) => handler(event));

  return event.model;
}

let compileHandlers;
let rootDir;

beforeEach(() => {
  compileHandlers = [];
  rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eme-flow-'));
  global.Project = {};
  global.Format = {id: FORMAT_ID};
  global.Codecs = {
    project: {
      on: (event, handler) => {
        if (event === 'compile') {
          compileHandlers.push(handler);
        }
      },
      compile: () => JSON.stringify(compileProject())
    }
  };
  global.Blockbench = {
    showQuickMessage: () => {
    },
    showMessageBox: () => {
    },
    pickDirectory: () => rootDir
  };
  registerEmeCodecHooks();
});

afterEach(() => {
  fs.rmSync(rootDir, {recursive: true, force: true});
  delete global.Project;
  delete global.Format;
  delete global.Codecs;
  delete global.Blockbench;
});

describe('performExport', () => {
  function modProjectSettings() {
    return {
      ...fixtureSettings(),
      exportType: EXPORT_TYPE_MOD_PROJECT,
      exportTarget: EXPORT_TYPE_MOD_PROJECT
    };
  }

  test('exported model carries the settings of this very export', () => {
    const settings = modProjectSettings();
    performExport(settings, EXPORT_TYPE_MOD_PROJECT,
        fixtureTextureResolution(settings));

    const exported = JSON.parse(fs.readFileSync(
        path.join(rootDir,
            'assets/example/easy_model_entities/models/lizard.bbmodel'),
        'utf8'));
    expect(exported.emeSettings).toEqual(
        pickModelSettings(BlockbenchAdapter.loadSettings()));
    expect(exported.emeSettings.presetType).toBe(settings.presetType);
    expect(exported.emeSettings.profileId).toBe('lizard');
    expect(exported.emeSettings.lastExportedVersion).toMatch(/^[0-9a-f]{8}$/);
  });

  test('stores the pairing version for the next single pack export', () => {
    const settings = modProjectSettings();
    performExport(settings, EXPORT_TYPE_MOD_PROJECT,
        fixtureTextureResolution(settings));

    expect(BlockbenchAdapter.loadSettings().lastExportedVersion).toMatch(
        /^[0-9a-f]{8}$/);
  });

  test('an empty project property is not treated as stored settings', () => {
    global.Project = {[BlockbenchAdapter.PROJECT_PROPERTY]: {}};

    expect(BlockbenchAdapter.loadSettings()).toBeNull();
    expect(compileProject().emeSettings).toBeUndefined();
  });
});

describe('zipExportName', () => {
  test('names the single pack export after its pack type', () => {
    expect(zipExportName({
      namespace: 'example', profileId: 'lizard',
      exportType: EXPORT_TYPE_RESOURCE_PACK
    })).toBe('example_lizard_resourcepack');
  });
});
