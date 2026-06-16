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

const {
  getVersions,
  getEnabledVersions,
  getDefaultVersionId,
  getPackFormats
} = require('../model/versionMatrix');

describe('versionMatrix', () => {
  test('default version is 1.20.1 and enabled', () => {
    expect(getDefaultVersionId()).toBe('1.20.1');
    const enabled = getEnabledVersions().map((v) => v.id);
    expect(enabled).toEqual(['1.20.1']);
  });

  test('exposes the full selectable version list', () => {
    expect(getVersions().map((v) => v.id)).toEqual(
        ['1.20.1', '1.21.1', '1.21.11', '26.1.2']);
  });

  test('1.20.1 maps to pack_format 15 / 15', () => {
    expect(getPackFormats('1.20.1')).toEqual(
        {dataFormat: 15, resourceFormat: 15});
  });

  test('disabled versions return no pack formats', () => {
    expect(getPackFormats('1.21.1')).toBeNull();
    expect(getPackFormats('does-not-exist')).toBeNull();
  });
});
