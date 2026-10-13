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

describe('collectTextures', () => {
  const emptyPixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAA'
      + 'DUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

  function texture(id, name) {
    return {
      id, name, namespace: '', folder: 'block', path: '',
      getBase64: () => emptyPixel
    };
  }

  afterEach(() => {
    delete global.Texture;
  });

  test('uses the slot position as index, not the Blockbench texture id', () => {
    global.Texture = {all: [texture('2', 'dawn_sparrow.png')]};

    expect(BlockbenchAdapter.collectTextures().map(
        (descriptor) => descriptor.index)).toEqual([0]);
  });

  test('numbers multiple textures by slot position regardless of their ids',
      () => {
        global.Texture = {
          all: [texture('chest_texture', 'normal.png'),
            texture('7', 'disguised_chestling.png')]
        };

        expect(BlockbenchAdapter.collectTextures().map(
            (descriptor) => descriptor.index)).toEqual([0, 1]);
      });

  test('returns an empty list when no textures are loaded', () => {
    expect(BlockbenchAdapter.collectTextures()).toEqual([]);
  });
});

describe('getModelStats geometry', () => {
  function cube(name, properties) {
    return {type: 'cube', name, faces: {}, ...properties};
  }

  function group(name, properties) {
    return {type: 'group', name, ...properties};
  }

  afterEach(() => {
    delete global.Outliner;
    delete global.Group;
    delete global.Texture;
    delete global.Format;
    delete global.Project;
  });

  test('collects the elements the mod cannot load or ignores', () => {
    const body = group('body', {visibility: false});
    const loose = cube('loose', {inflate: 0.5});
    const turned = cube('turned', {
      faces: {north: {rotation: 45, texture: 0}, south: {texture: 1}}
    });
    const squared = cube('squared', {faces: {north: {rotation: 270}}});
    const tail = {type: 'mesh', name: 'tail'};
    global.Format = {id: 'eme_entity', per_texture_uv_size: true};
    global.Project = {texture_width: 64, texture_height: 64};
    global.Outliner = {
      root: [body, loose],
      elements: [loose, turned, squared, tail]
    };
    global.Group = {all: [body]};
    global.Texture = {
      all: [
        {name: 'skin.png', uv_width: 32, uv_height: 64},
        {name: 'glass.png'}
      ]
    };

    expect(BlockbenchAdapter.getModelStats().geometry).toEqual({
      formatId: 'eme_entity',
      unsupportedElements: ['tail (mesh)'],
      rootCubes: ['loose'],
      rotatedFaceCubes: ['turned'],
      mixedTextureCubes: ['turned'],
      customUvSizeTextures: ['skin.png'],
      hiddenNodes: ['body'],
      exportedGroupNames: ['body']
    });
  });

  test(
      'leaves groups with export false and their children out of the group names',
      () => {
        const hidden = group('hidden', {export: false});
        const child = group('child', {parent: hidden});
        const head = group('head', {parent: 'root'});
        global.Group = {all: [hidden, child, head]};

        expect(BlockbenchAdapter.getModelStats().geometry.exportedGroupNames)
        .toEqual(['head']);
      });

  test('counts only exported groups as body parts', () => {
    const hidden = group('body', {export: false});
    const head = group('head', {parent: 'root'});
    global.Group = {all: [hidden, head]};

    expect(BlockbenchAdapter.getModelLoadStats().boneNames).toEqual(['head']);
  });

  test('ignores per texture UV sizes in formats without them', () => {
    global.Format = {id: 'modded_entity'};
    global.Project = {texture_width: 64, texture_height: 64};
    global.Texture = {all: [{name: 'skin.png', uv_width: 32, uv_height: 32}]};

    expect(BlockbenchAdapter.getModelStats().geometry.customUvSizeTextures)
    .toEqual([]);
  });

  test('reports no geometry issues without a loaded model', () => {
    const geometry = BlockbenchAdapter.getModelStats().geometry;

    expect(geometry.unsupportedElements).toEqual([]);
    expect(geometry.rootCubes).toEqual([]);
    expect(geometry.hiddenNodes).toEqual([]);
  });

  test('measures the model file size from the compiled project', () => {
    global.Codecs = {project: {compile: () => '{"name":"lizard"}'}};

    try {
      expect(BlockbenchAdapter.getModelFileSize()).toBe(17);
    } finally {
      delete global.Codecs;
    }
  });

  test('collects the model stats without compiling the project', () => {
    const compile = jest.fn(() => '{}');
    global.Codecs = {project: {compile}};

    try {
      BlockbenchAdapter.getModelStats();
      expect(compile).not.toHaveBeenCalled();
    } finally {
      delete global.Codecs;
    }
  });
});

describe('wrapInRootBone', () => {
  let createdGroups;
  let finishedEdits;

  function node(type, name) {
    return {
      type, name, parent: 'root',
      addTo(parent) {
        this.parent = parent;
      }
    };
  }

  beforeEach(() => {
    createdGroups = [];
    finishedEdits = [];
    global.Undo = {
      initEdit: () => {
      },
      finishEdit: (label) => finishedEdits.push(label)
    };
    global.Canvas = {
      updateAll: () => {
      }
    };
    global.Group = class {
      constructor(data) {
        Object.assign(this, data, {type: 'group'});
      }

      init() {
        createdGroups.push(this);
        return this;
      }
    };
  });

  afterEach(() => {
    delete global.Outliner;
    delete global.Undo;
    delete global.Canvas;
    delete global.Group;
  });

  test('moves all top-level nodes into a new root group', () => {
    const body = node('group', 'body');
    const loose = node('cube', 'loose');
    global.Outliner = {root: [body, loose]};

    BlockbenchAdapter.wrapInRootBone('Wrap in root bone');

    expect(createdGroups).toHaveLength(1);
    expect(createdGroups[0].name).toBe('root');
    expect(createdGroups[0].origin).toEqual([0, 0, 0]);
    expect(body.parent).toBe(createdGroups[0]);
    expect(loose.parent).toBe(createdGroups[0]);
    expect(finishedEdits).toEqual(['Wrap in root bone']);
  });

  test('reuses an existing top-level root group regardless of case', () => {
    const root = node('group', ' Root');
    const loose = node('cube', 'loose');
    global.Outliner = {root: [root, loose]};

    BlockbenchAdapter.wrapInRootBone('Wrap in root bone');

    expect(createdGroups).toHaveLength(0);
    expect(root.parent).toBe('root');
    expect(loose.parent).toBe(root);
  });
});
