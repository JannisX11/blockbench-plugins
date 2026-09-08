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

const {BlockbenchAdapter} = require('./BlockbenchAdapter');
const {
  buildPackBundle,
  buildModProjectFiles,
  pairingVersion
} = require('./builders/exporter');
const {
  EXPORT_TYPE_RESOURCE_PACK,
  EXPORT_TYPE_DATA_PACK,
  EXPORT_TYPE_MOD_PROJECT
} = require('./model/exportTypes');

function zipExportName(settings) {
  const base = `${settings.namespace}_${settings.profileId}`;
  if (settings.exportType === EXPORT_TYPE_RESOURCE_PACK) {
    return `${base}_resourcepack`;
  }

  if (settings.exportType === EXPORT_TYPE_DATA_PACK) {
    return `${base}_datapack`;
  }

  return `${base}_eme`;
}

function exportToZip(settings, options) {
  return BlockbenchAdapter.exportPackBundle(
      buildPackBundle(settings, options), zipExportName(settings))
  .then(() => {
    Blockbench.showQuickMessage('Easy Model Entities packs exported', 1500);
  })
  .catch((error) => {
    Blockbench.showMessageBox({title: 'Export failed', message: String(error)});
  });
}

function exportToModProject(settings, options) {
  const rootDir = BlockbenchAdapter.pickDirectory(
      'Select src/main/resources directory');
  if (!rootDir) {
    return;
  }

  const {files} = buildModProjectFiles(settings, options);
  const existing = BlockbenchAdapter.listExistingFiles(rootDir, files);

  const write = () => {
    try {
      BlockbenchAdapter.writeToDirectory(rootDir, files);
      Blockbench.showQuickMessage(
          'Easy Model Entities files written to mod project', 1500);
    } catch (error) {
      Blockbench.showMessageBox(
          {title: 'Export failed', message: String(error)});
    }
  };

  if (existing.length > 0) {
    Blockbench.showMessageBox(
        {
          title: 'Overwrite existing files?',
          message: `${existing.length} file(s) already exist and will be overwritten:\n\n`
              + existing.join('\n'),
          buttons: ['Overwrite', 'Cancel'],
          confirm: 0,
          cancel: 1
        },
        (button) => {
          if (button === 0) {
            write();
          }
        }
    );
  } else {
    write();
  }
}

function performExport(settings, target, textureResolution) {
  BlockbenchAdapter.saveSettings({
    ...settings,
    lastExportedVersion: pairingVersion(settings)
  });

  const options = {
    modelBytes: BlockbenchAdapter.getModelBytes(),
    textureResolution
  };

  if (target === EXPORT_TYPE_MOD_PROJECT) {
    return exportToModProject(settings, options);
  }

  return exportToZip(settings, options);
}

module.exports = {performExport, zipExportName};
