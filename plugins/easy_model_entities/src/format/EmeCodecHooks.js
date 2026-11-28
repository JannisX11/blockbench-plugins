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
const {
  compactModelSettings,
  expandModelSettings
} = require('../model/templates');

const EME_SETTINGS_KEY = 'emeSettings';

function handleCompile(event) {
  const settings = BlockbenchAdapter.loadSettings();
  if (!settings) {
    return;
  }

  const compactSettings = compactModelSettings(settings);
  if (Object.keys(compactSettings).length > 0) {
    event.model[EME_SETTINGS_KEY] = compactSettings;
  }
}

function handleParse(event) {
  const settings = event.model?.[EME_SETTINGS_KEY];
  if (settings && typeof settings === 'object') {
    BlockbenchAdapter.saveSettings(expandModelSettings(settings));
  }
}

function registerEmeCodecHooks() {
  Codecs.project.on('compile', handleCompile);
  Codecs.project.on('parse', handleParse);
}

function unregisterEmeCodecHooks() {
  Codecs.project.events?.compile?.remove?.(handleCompile);
  Codecs.project.events?.parse?.remove?.(handleParse);
}

module.exports = {registerEmeCodecHooks, unregisterEmeCodecHooks};
