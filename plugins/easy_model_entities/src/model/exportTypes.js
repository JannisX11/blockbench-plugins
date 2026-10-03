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

const EXPORT_TYPE_PACKS = 'packs';
const EXPORT_TYPE_RESOURCE_PACK = 'resource_pack';
const EXPORT_TYPE_DATA_PACK = 'data_pack';
const EXPORT_TYPE_MOD_PROJECT = 'mod_project';
const EXPORT_TYPE_MODEL_ONLY = 'model_only';

const ZIP_EXPORT_TYPES = [EXPORT_TYPE_PACKS, EXPORT_TYPE_RESOURCE_PACK,
  EXPORT_TYPE_DATA_PACK];

function isZipExport(exportType) {
  return ZIP_EXPORT_TYPES.includes(exportType);
}

function includesDataPack(exportType) {
  return exportType !== EXPORT_TYPE_RESOURCE_PACK;
}

function includesResourcePack(exportType) {
  return exportType !== EXPORT_TYPE_DATA_PACK;
}

function isSinglePackExport(exportType) {
  return exportType === EXPORT_TYPE_RESOURCE_PACK
      || exportType === EXPORT_TYPE_DATA_PACK;
}

module.exports = {
  EXPORT_TYPE_PACKS,
  EXPORT_TYPE_RESOURCE_PACK,
  EXPORT_TYPE_DATA_PACK,
  EXPORT_TYPE_MOD_PROJECT,
  EXPORT_TYPE_MODEL_ONLY,
  isZipExport,
  includesDataPack,
  includesResourcePack,
  isSinglePackExport
};
