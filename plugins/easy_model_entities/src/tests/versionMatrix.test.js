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
  test('default version is 1.20.1; all four versions are enabled', () => {
    expect(getDefaultVersionId()).toBe('1.20.1');
    const enabled = getEnabledVersions().map((v) => v.id);
    expect(enabled).toEqual(['1.20.1', '1.21.1', '1.21.11', '26.1.2']);
  });

  test('exposes the full selectable version list', () => {
    expect(getVersions().map((v) => v.id)).toEqual(
        ['1.20.1', '1.21.1', '1.21.11', '26.1.2']);
  });

  test('legacy versions use a single integer pack_format', () => {
    expect(getPackFormats('1.20.1')).toEqual(
        {data: {packFormat: 15}, resource: {packFormat: 15}});
    expect(getPackFormats('1.21.1')).toEqual(
        {data: {packFormat: 48}, resource: {packFormat: 34}});
  });

  test('1.21.11 uses the min/max format scheme', () => {
    expect(getPackFormats('1.21.11')).toEqual({
      data: {packFormat: 94, minFormat: [94, 1], maxFormat: [94, 1]},
      resource: {packFormat: 75, minFormat: [75, 0], maxFormat: [75, 0]}
    });
  });

  test('26.1.2 uses the min/max format scheme', () => {
    expect(getPackFormats('26.1.2')).toEqual({
      data: {packFormat: 101, minFormat: [101, 1], maxFormat: [101, 1]},
      resource: {packFormat: 84, minFormat: [84, 0], maxFormat: [84, 0]}
    });
  });

  test('unknown versions return no pack formats', () => {
    expect(getPackFormats('does-not-exist')).toBeNull();
  });
});
