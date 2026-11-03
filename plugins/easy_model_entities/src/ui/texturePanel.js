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

const {describeTextureSource} = require('../utils/TextureResolver');

let patchedVue = null;
let originalGetDescription = null;

function texturesPanelVue() {
  const panel = (typeof Panels !== 'undefined' && Panels.textures)
      || (typeof Interface !== 'undefined' && Interface.Panels
          && Interface.Panels.textures);

  return (panel && panel.inside_vue) || null;
}

function patchTexturePanel(formatId) {
  const vue = texturesPanelVue();
  if (!vue || typeof vue.getDescription !== 'function'
      || originalGetDescription) {
    return;
  }

  const original = vue.getDescription.bind(vue);
  patchedVue = vue;
  originalGetDescription = original;
  vue.getDescription = function (texture) {
    const base = original(texture);
    try {
      if (typeof Format !== 'undefined' && Format && Format.id === formatId) {
        const {label} = describeTextureSource({
          namespace: texture.namespace,
          folder: texture.folder,
          name: texture.name,
          path: texture.path
        });

        return `${base} - ${label}`;
      }
    } catch (error) {
    }

    return base;
  };
}

function unpatchTexturePanel() {
  if (patchedVue && originalGetDescription) {
    patchedVue.getDescription = originalGetDescription;
  }
  patchedVue = null;
  originalGetDescription = null;
}

module.exports = {patchTexturePanel, unpatchTexturePanel};
