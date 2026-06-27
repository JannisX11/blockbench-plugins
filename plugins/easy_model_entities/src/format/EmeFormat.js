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

const FORMAT_ID = 'eme_entity';

let emeFormat = null;

function toModelIdentifier(name) {
  return name.trim().toLowerCase()
  .replace(/\s+/g, '_')
  .replace(/[^a-z0-9_]/g, '')
  .replace(/_+/g, '_')
  .replace(/^_|_$/g, '');
}

function registerEmeFormat(icon) {
  if (emeFormat) {
    return;
  }

  emeFormat = new ModelFormat(FORMAT_ID, {
    name: 'Easy Model Entity',
    category: 'minecraft',
    description: 'Entity model for the Easy Model Entities mod (Minecraft: Java Edition).',
    icon: icon || 'pets',
    rotate_cubes: true,
    box_uv: true,
    optional_box_uv: true,
    single_texture: false,
    texture_folder: true,
    bone_rig: true,
    centered_grid: true,
    animated_textures: false,
    animation_mode: true,
    animation_files: false,
    java_edition_mapping: false,
    model_identifier: true,
    locators: true,
    codec: Codecs.project,
    onActivation() {
      if (Project && !Project.model_identifier && Project.name) {
        Project.model_identifier = toModelIdentifier(Project.name);
      }
    },
    onDeactivation() {
    },
  });
}

function unregisterEmeFormat() {
  if (emeFormat) {
    emeFormat.delete();
    emeFormat = null;
  }
}

module.exports = {FORMAT_ID, registerEmeFormat, unregisterEmeFormat};
