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
  isZipExport
} = require('./model/exportTypes');
const {LocalizedError, t} = require('./i18n/translations');

const FILE_SYSTEM_ERROR_KEYS = {
  EACCES: 'eme.error.noPermission',
  EPERM: 'eme.error.noPermission',
  EBUSY: 'eme.error.fileInUse',
  ENOSPC: 'eme.error.diskFull',
  EROFS: 'eme.error.readOnly',
  ENOENT: 'eme.error.notFound'
};

function describeExportError(error) {
  if (error instanceof LocalizedError) {
    return error.message;
  }

  const fileSystemKey = FILE_SYSTEM_ERROR_KEYS[error?.code];
  if (fileSystemKey && error.path) {
    return t(fileSystemKey, error.path) + '\n\n'
        + t('eme.message.errorDetails', error.message);
  }

  return t('eme.message.unexpectedError', error?.message || String(error));
}

function showExportError(error) {
  console.error('[Easy Model Entities] Export failed:', error);
  Blockbench.showMessageBox({
    title: t('eme.message.exportFailed'),
    message: describeExportError(error)
  });
}

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

function exportToZip(settings, options, onWritten) {
  return Promise.resolve()
  .then(() => BlockbenchAdapter.exportPackBundle(
      buildPackBundle(settings, options), zipExportName(settings)))
  .then(() => {
    onWritten();
    Blockbench.showQuickMessage(t('eme.message.packsExported'), 1500);
  })
  .catch(showExportError);
}

function exportToModProject(settings, options, onWritten) {
  const rootDir = BlockbenchAdapter.pickDirectory(
      t('eme.message.selectResourcesDirectory'));
  if (!rootDir) {
    return;
  }

  let files;
  let existing;
  try {
    files = buildModProjectFiles(settings, options).files;
    existing = BlockbenchAdapter.listExistingFiles(rootDir, files);
  } catch (error) {
    showExportError(error);
    return;
  }

  const write = () => {
    try {
      BlockbenchAdapter.writeToDirectory(rootDir, files);
      onWritten();
      Blockbench.showQuickMessage(t('eme.message.modProjectWritten'), 1500);
    } catch (error) {
      showExportError(error);
    }
  };

  if (existing.length > 0) {
    BlockbenchAdapter.confirm(t('eme.message.overwriteTitle'),
        t('eme.message.overwriteFiles', existing.length) + '\n\n'
        + existing.map((file) => `- \`${file}\``).join('\n'),
        t('eme.button.overwrite'), write);
  } else {
    write();
  }
}

function performExport(settings, textureResolution) {
  const exportedSettings = {
    ...settings,
    lastExportedVersion: pairingVersion(settings),
    lastExportedTargetVersion: settings.targetVersion
  };
  // The exported model has to embed the pairing of this export, while the
  // project keeps it only once the files are written.
  BlockbenchAdapter.saveSettings(exportedSettings);
  const options = {
    modelBytes: BlockbenchAdapter.getModelBytes(),
    textureResolution
  };
  BlockbenchAdapter.saveSettings(settings);
  const onWritten = () => BlockbenchAdapter.saveSettings(exportedSettings);

  if (isZipExport(settings.exportType)) {
    return exportToZip(settings, options, onWritten);
  }

  return exportToModProject(settings, options, onWritten);
}

module.exports = {describeExportError, performExport, zipExportName};
