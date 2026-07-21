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
  buildDataPackMcmeta,
  buildResourcePackMcmeta
} = require('../builders/packMeta');

describe('packMeta', () => {
  test('legacy versions emit a single integer pack_format', () => {
    expect(buildDataPackMcmeta({targetVersion: '1.20.1'}).pack)
    .toMatchObject({pack_format: 15});
    expect(buildResourcePackMcmeta({targetVersion: '1.21.1'}).pack)
    .toMatchObject({pack_format: 34});
    expect(buildDataPackMcmeta({targetVersion: '1.20.1'}).pack.min_format)
    .toBeUndefined();
  });

  test('1.21.11 emits pack_format plus min/max format ranges', () => {
    const data = buildDataPackMcmeta({targetVersion: '1.21.11'}).pack;
    expect(data.pack_format).toBe(94);
    expect(data.min_format).toEqual([94, 1]);
    expect(data.max_format).toEqual([94, 1]);

    const resource = buildResourcePackMcmeta({targetVersion: '1.21.11'}).pack;
    expect(resource.pack_format).toBe(75);
    expect(resource.min_format).toEqual([75, 0]);
    expect(resource.max_format).toEqual([75, 0]);
  });

  test('26.1.2 emits pack_format plus min/max format ranges', () => {
    const data = buildDataPackMcmeta({targetVersion: '26.1.2'}).pack;
    expect(data.pack_format).toBe(101);
    expect(data.min_format).toEqual([101, 1]);
    expect(data.max_format).toEqual([101, 1]);

    const resource = buildResourcePackMcmeta({targetVersion: '26.1.2'}).pack;
    expect(resource.pack_format).toBe(84);
    expect(resource.min_format).toEqual([84, 0]);
    expect(resource.max_format).toEqual([84, 0]);
  });

  test('unknown versions throw', () => {
    expect(() => buildDataPackMcmeta({targetVersion: 'nope'})).toThrow();
  });
});
