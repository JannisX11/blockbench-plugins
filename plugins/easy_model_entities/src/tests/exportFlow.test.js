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

const {
  describeExportError,
  performExport,
  zipExportName
} = require('../exportFlow');
const {BlockbenchAdapter} = require('../BlockbenchAdapter');
const {registerEmeCodecHooks} = require('../format/EmeCodecHooks');
const {FORMAT_ID} = require('../format/EmeFormat');
const {compactModelSettings} = require('../model/templates');
const {
  EXPORT_TYPE_MOD_PROJECT,
  EXPORT_TYPE_RESOURCE_PACK
} = require('../model/exportTypes');
const {LocalizedError, t} = require('../i18n/translations');
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
      exportType: EXPORT_TYPE_MOD_PROJECT
    };
  }

  test('exported model carries the settings of this very export', () => {
    const settings = modProjectSettings();
    performExport(settings,
        fixtureTextureResolution(settings));

    const exported = JSON.parse(fs.readFileSync(
        path.join(rootDir,
            'assets/example/easy_model_entities/models/lizard.bbmodel'),
        'utf8'));
    expect(exported.emeSettings).toEqual(
        compactModelSettings(BlockbenchAdapter.loadSettings()));
    expect(exported.emeSettings.presetType).toBe(settings.presetType);
    expect(exported.emeSettings.profileId).toBe('lizard');
    expect(exported.emeSettings.lastExportedVersion).toMatch(/^[0-9a-f]{8}$/);
  });

  test('stores the pairing version for the next single pack export', () => {
    const settings = modProjectSettings();
    performExport(settings,
        fixtureTextureResolution(settings));

    expect(BlockbenchAdapter.loadSettings().lastExportedVersion).toMatch(
        /^[0-9a-f]{8}$/);
    expect(BlockbenchAdapter.loadSettings().lastExportedTargetVersion).toBe(
        settings.targetVersion);
  });

  test('keeps the previous pairing when no files are written', () => {
    global.Blockbench.pickDirectory = () => null;
    const settings = modProjectSettings();
    performExport(settings,
        fixtureTextureResolution(settings));

    expect(BlockbenchAdapter.loadSettings().lastExportedVersion)
    .toBeUndefined();
    expect(BlockbenchAdapter.loadSettings().lastExportedTargetVersion)
    .toBeUndefined();
  });

  test('reports a failing pack export instead of throwing', async () => {
    const shownMessages = [];
    global.Blockbench.showMessageBox = (box) => shownMessages.push(box);
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    const settings = {
      ...fixtureSettings(),
      exportType: EXPORT_TYPE_RESOURCE_PACK,
      targetVersion: '0.0'
    };

    await performExport(settings, fixtureTextureResolution(settings));
    expect(shownMessages).toEqual([{
      title: t('eme.message.exportFailed'),
      message: t('eme.message.unsupportedTargetVersion', '0.0')
    }]);
    console.error.mockRestore();
  });

  test('an empty project property is not treated as stored settings', () => {
    global.Project = {[BlockbenchAdapter.PROJECT_PROPERTY]: {}};

    expect(BlockbenchAdapter.loadSettings()).toBeNull();
    expect(compileProject().emeSettings).toBeUndefined();
  });
});

describe('describeExportError', () => {
  test('shows a localized error as it is', () => {
    expect(describeExportError(
        new LocalizedError('eme.message.unsupportedTargetVersion', '1.0')))
    .toBe(t('eme.message.unsupportedTargetVersion', '1.0'));
  });

  test('explains a known file system error with the affected path', () => {
    const error = Object.assign(new Error('EBUSY: resource busy'),
        {code: 'EBUSY', path: 'C:/pack/lizard.json'});

    expect(describeExportError(error)).toBe(
        t('eme.error.fileInUse', 'C:/pack/lizard.json') + '\n\n'
        + t('eme.message.errorDetails', 'EBUSY: resource busy'));
  });

  test('asks to report anything unexpected with its details', () => {
    expect(describeExportError(new TypeError('boom'))).toBe(
        t('eme.message.unexpectedError', 'boom'));
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
