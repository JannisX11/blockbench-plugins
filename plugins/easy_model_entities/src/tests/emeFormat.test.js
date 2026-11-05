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

const {BlockbenchAdapter} = require('../BlockbenchAdapter');
const {renderSides} = require('../format/EmeFormat');
const {registerEmeCodecHooks} = require('../format/EmeCodecHooks');
const {applyTemplate} = require('../model/templates');
const {EN, DE, t} = require('../i18n/translations');

describe('settings in the saved project', () => {
  const handlers = {};

  beforeEach(() => {
    global.Project = {};
    global.Format = {id: 'modded_entity'};
    global.Codecs = {
      project: {
        on: (event, handler) => {
          handlers[event] = handler;
        }
      }
    };
    registerEmeCodecHooks();
  });

  afterEach(() => {
    delete global.Project;
    delete global.Format;
    delete global.Codecs;
  });

  test('modded entity projects keep their settings through save and load',
      () => {
        const settings = {
          ...applyTemplate('aquatic_swimming'),
          namespace: 'example',
          profileId: 'fish'
        };
        BlockbenchAdapter.saveSettings(settings);
        const model = {meta: {model_format: 'modded_entity'}};
        handlers.compile({model});
        expect(model.emeSettings.movement).toBeUndefined();

        global.Project = {};
        handlers.parse({model});
        expect(BlockbenchAdapter.loadSettings()).toEqual({
          ...settings,
          customize: false,
          includeExternalTextures: true
        });
      });
});

describe('renderSides', () => {
  afterEach(() => {
    delete global.Project;
  });

  test('culls back faces for static models and new projects', () => {
    expect(renderSides()).toBe('front');
    global.Project = {
      [BlockbenchAdapter.PROJECT_PROPERTY]: {
        host: {bodyType: 'static'}
      }
    };
    expect(renderSides()).toBe('front');
  });

  test('renders both sides for animated body types', () => {
    global.Project = {
      [BlockbenchAdapter.PROJECT_PROPERTY]: {
        host: {bodyType: 'biped'}
      }
    };
    expect(renderSides()).toBe('double');
  });
});

describe('translations', () => {
  test('every English text has a German translation', () => {
    expect(Object.keys(DE).sort()).toEqual(Object.keys(EN).sort());
  });

  test('fills numbered placeholders', () => {
    expect(t('eme.validation.MISSING_BODY_PART', 'biped', 'head')).toContain(
        'biped');
    expect(t('eme.validation.more', 'a, b', 3)).toBe('a, b and 3 more');
  });
});
