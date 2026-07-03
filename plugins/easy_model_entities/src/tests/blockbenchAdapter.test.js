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

const fs = require('fs');
const os = require('os');
const path = require('path');

const {BlockbenchAdapter} = require('../BlockbenchAdapter');

describe('writeToDirectory', () => {
  let rootDir;

  beforeEach(() => {
    rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eme-test-'));
  });

  afterEach(() => {
    fs.rmSync(rootDir, {recursive: true, force: true});
  });

  test('writes files below the output root', () => {
    BlockbenchAdapter.writeToDirectory(rootDir,
        [{path: 'data/example/profile.json', content: '{}'}]);
    expect(fs.readFileSync(
        path.join(rootDir, 'data/example/profile.json'), 'utf8')).toBe('{}');
  });

  test('rejects path traversal', () => {
    expect(() => BlockbenchAdapter.writeToDirectory(rootDir,
        [{path: '../escape.json', content: '{}'}])).toThrow('PATH_TRAVERSAL');
    expect(fs.existsSync(path.join(rootDir, '..', 'escape.json'))).toBe(false);
  });

  test('rejects absolute paths', () => {
    expect(() => BlockbenchAdapter.writeToDirectory(rootDir,
        [{path: 'C:/escape.json', content: '{}'}])).toThrow('ABSOLUTE_PATH');
  });
});
