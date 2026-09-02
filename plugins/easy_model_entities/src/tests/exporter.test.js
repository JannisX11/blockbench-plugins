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

const {buildPackBundle, buildModProjectFiles} = require('../builders/exporter');
const {applyTemplate} = require('../model/templates');
const {resolveTextures} = require('../utils/TextureResolver');
const {fixtureSettings, fixtureExportOptions} = require('./fixtureData');

function fileByPath(files, filePath) {
  return files.find((file) => file.path === filePath);
}

const ENTITY_PROFILE_PATH =
    'data/example/easy_model_entities/profiles/entity/lizard.json';

describe('buildPackBundle', () => {
  const bundle = buildPackBundle(fixtureSettings(), fixtureExportOptions());

  test('wraps a README plus datapack and resourcepack file lists', () => {
    expect(bundle.readme.path).toBe('README.md');
    expect(bundle.datapack.map((f) => f.path).sort()).toEqual([
      ENTITY_PROFILE_PATH,
      'pack.mcmeta'
    ]);
    expect(bundle.resourcepack.map((f) => f.path).sort()).toEqual([
      'assets/example/easy_model_entities/models/lizard.bbmodel',
      'assets/example/easy_model_entities/render_profiles/entity/lizard.json',
      'assets/example/textures/entity/lizard.png',
      'pack.mcmeta'
    ].sort());
  });

  test('exposes profile-id-prefixed inner pack file names', () => {
    expect(bundle.datapackFileName).toBe('lizard_datapack.zip');
    expect(bundle.resourcepackFileName).toBe('lizard_resourcepack.zip');
  });

  test('README mentions the mod, Java Edition and both packs', () => {
    const readme = bundle.readme.content;
    expect(readme).toContain('Easy Model Entities');
    expect(readme).toContain('Minecraft: Java Edition');
    expect(readme).toContain('resourcepacks');
    expect(readme).toContain('datapacks');
    expect(readme).toContain('example:entity/lizard');
  });

  test(
      'profiles carry model_type, preset_type, aligned model ref, no obsolete fields',
      () => {
        const server = JSON.parse(fileByPath(bundle.datapack,
            ENTITY_PROFILE_PATH).content);
        const render = JSON.parse(fileByPath(bundle.resourcepack,
            'assets/example/easy_model_entities/render_profiles/entity/lizard.json')
            .content);
        expect(server.model_type).toBe('entity');
        expect(server.preset_type).toBe('quadruped_wandering');
        expect(server.schema_version).toBe('0.2.0');
        expect(server.client).toBeUndefined();
        expect(render.preset_type).toBe('quadruped_wandering');
        expect(render.model).toBe('example:easy_model_entities/models/lizard');
        expect(server.host).toBeUndefined();
        expect(server.pack_pair).toBeUndefined();
        expect(server.id).toBeUndefined();
        expect(render.pack_pair).toBeUndefined();
      });

  test('pack.mcmeta carries a pack format without pair metadata', () => {
    const meta = JSON.parse(fileByPath(bundle.datapack, 'pack.mcmeta').content);
    expect(meta.pack.pack_format).toBe(15);
    expect(meta.easy_model_entities).toBeUndefined();
  });

  test('resource pack export omits the data pack and the bundle README', () => {
    const settings = fixtureSettings();
    settings.exportType = 'resource_pack';
    const singlePack = buildPackBundle(settings, fixtureExportOptions());

    expect(singlePack.datapack).toBeNull();
    expect(singlePack.readme).toBeNull();
    expect(singlePack.resourcepack.map((file) => file.path)).toContain(
        'assets/example/textures/entity/lizard.png');
  });

  test('data pack export omits the resource pack and the bundle README', () => {
    const settings = fixtureSettings();
    settings.exportType = 'data_pack';
    const singlePack = buildPackBundle(settings, fixtureExportOptions());

    expect(singlePack.resourcepack).toBeNull();
    expect(singlePack.readme).toBeNull();
    expect(singlePack.datapack.map((file) => file.path)).toContain(
        ENTITY_PROFILE_PATH);
  });

  test('single pack exports keep the version of the complete export', () => {
    const settings = fixtureSettings();
    const complete = buildPackBundle(settings, fixtureExportOptions());
    settings.exportType = 'resource_pack';
    const resourceOnly = buildPackBundle(settings, fixtureExportOptions());

    expect(resourceOnly.renderProfile.version).toBe(
        complete.serverProfile.version);
  });

  test('a data pack export keeps pairing after the entity data changed', () => {
    const settings = fixtureSettings();
    const paired = buildPackBundle(settings, fixtureExportOptions())
        .serverProfile.version;

    settings.lastExportedVersion = paired;
    settings.exportType = 'data_pack';
    settings.dimensions = {...settings.dimensions, height: 3.25};
    const dataOnly = buildPackBundle(settings, fixtureExportOptions());

    expect(dataOnly.serverProfile.dimensions.height).toBe(3.25);
    expect(dataOnly.serverProfile.version).toBe(paired);
  });

  test('a complete export mints a new version when the entity data changed',
      () => {
        const settings = fixtureSettings();
        const paired = buildPackBundle(settings, fixtureExportOptions())
            .serverProfile.version;

        settings.lastExportedVersion = paired;
        settings.dimensions = {...settings.dimensions, height: 3.25};
        const complete = buildPackBundle(settings, fixtureExportOptions());

        expect(complete.serverProfile.version).not.toBe(paired);
        expect(complete.renderProfile.version).toBe(
            complete.serverProfile.version);
      });

  test('writes model and texture bytes unchanged as binary entries', () => {
    const opts = fixtureExportOptions();
    const model = fileByPath(bundle.resourcepack,
        'assets/example/easy_model_entities/models/lizard.bbmodel');
    const texture = fileByPath(bundle.resourcepack,
        'assets/example/textures/entity/lizard.png');
    expect(model.binary).toBe(true);
    expect(model.content).toBe(opts.modelBytes);
    expect(texture.binary).toBe(true);
    expect(texture.content).toBe(opts.textureResolution.packed[0].bytes);
  });
});

describe('buildModProjectFiles', () => {
  test('emits data and assets paths without pack.mcmeta', () => {
    const {files} = buildModProjectFiles(fixtureSettings(),
        fixtureExportOptions());
    expect(files.map((f) => f.path)).toEqual([
      ENTITY_PROFILE_PATH,
      'assets/example/easy_model_entities/render_profiles/entity/lizard.json',
      'assets/example/easy_model_entities/models/lizard.bbmodel',
      'assets/example/textures/entity/lizard.png'
    ]);
    expect(files.some((f) => f.path.endsWith('pack.mcmeta'))).toBe(false);
  });

  test('mod project profile JSON equals the bundle profile JSON', () => {
    const mod = buildModProjectFiles(fixtureSettings(), fixtureExportOptions());
    const bundle = buildPackBundle(fixtureSettings(), fixtureExportOptions());
    const modProfile = fileByPath(mod.files, ENTITY_PROFILE_PATH).content;
    const bundleProfile = fileByPath(bundle.datapack, ENTITY_PROFILE_PATH)
        .content;
    expect(modProfile).toBe(bundleProfile);
  });
});

describe('model-only export (mod integration)', () => {
  function modelOnlySettings() {
    const settings = applyTemplate('cuboid_still');
    settings.namespace = 'example';
    settings.profileId = 'chestling';
    settings.modelOnly = true;
    return settings;
  }

  test('writes only render profile, model and texture (no server profile)',
      () => {
        const settings = modelOnlySettings();
        const {files, serverProfile} = buildModProjectFiles(settings,
            fixtureExportOptions(settings));
        expect(serverProfile).toBeNull();
        expect(files.map((f) => f.path)).toEqual([
          'assets/example/easy_model_entities/render_profiles/entity/chestling.json',
          'assets/example/easy_model_entities/models/chestling.bbmodel',
          'assets/example/textures/entity/chestling.png'
        ]);
        expect(files.some((f) => f.path.includes('/profiles/'))).toBe(false);
      });

  test('leaves the render profile version-less (mod owns the contract)', () => {
    const settings = modelOnlySettings();
    const {renderProfile} = buildModProjectFiles(settings,
        fixtureExportOptions(settings));
    expect(renderProfile.version).toBeUndefined();
  });
});

describe('version stamp (server-relevant content hash)', () => {
  test('server and render profile share the same stamp', () => {
    const bundle = buildPackBundle(fixtureSettings(), fixtureExportOptions());
    expect(bundle.serverProfile.version).toMatch(/^[0-9a-f]{8}$/);
    expect(bundle.renderProfile.version).toBe(bundle.serverProfile.version);
  });

  test('a server-relevant change bumps the stamp', () => {
    const base = buildPackBundle(fixtureSettings(), fixtureExportOptions());
    const changed = fixtureSettings();
    changed.dimensions.width += 1;
    const next = buildPackBundle(changed, fixtureExportOptions());
    expect(next.serverProfile.version)
    .not.toBe(base.serverProfile.version);
  });

  test('a texture-only change keeps the stamp stable', () => {
    const settings = fixtureSettings();
    const base = buildPackBundle(settings, fixtureExportOptions());
    const extraTexture = resolveTextures([
      {
        index: 0, namespace: '', folder: '', name: '', path: '',
        bytes: Uint8Array.from([1])
      },
      {
        index: 1, namespace: 'minecraft', folder: 'entity/chest',
        name: 'normal.png', path: '', bytes: Uint8Array.from([1])
      }
    ], settings);
    const next = buildPackBundle(settings,
        {modelBytes: 'different', textureResolution: extraTexture});
    expect(next.serverProfile.version).toBe(base.serverProfile.version);
  });
});

describe('mixed vanilla + custom textures', () => {
  const PIXELS = Uint8Array.from([0x89, 0x50, 0x4e, 0x47]);

  function mixedOptions(settings) {
    const textureResolution = resolveTextures([
      {
        index: 0, namespace: 'minecraft', folder: 'entity/chest',
        name: 'normal.png', path: '', bytes: PIXELS
      },
      {
        index: 1, namespace: '', folder: 'block', name: 'eye_texture',
        path: '', bytes: PIXELS
      }
    ], settings);
    return {modelBytes: '{}', textureResolution};
  }

  test('packs only the custom texture and references the vanilla one', () => {
    const settings = fixtureSettings();
    const {files} = buildModProjectFiles(settings, mixedOptions(settings));
    const texturePaths = files.map((f) => f.path)
    .filter((p) => p.includes('/textures/'));
    expect(texturePaths).toEqual(
        ['assets/example/textures/entity/lizard_1.png']);

    const render = JSON.parse(fileByPath(files,
        'assets/example/easy_model_entities/render_profiles/entity/lizard.json')
        .content);
    expect(render.texture).toBe('minecraft:textures/entity/chest/normal.png');
    expect(render.textures).toEqual(
        {1: 'example:textures/entity/lizard_1.png'});
  });
});

describe('block entity export uses the block_entity subfolder', () => {
  function blockSettings() {
    const settings = applyTemplate('animated_randomly', 'block_entity');
    settings.namespace = 'example';
    settings.profileId = 'shrine';
    return settings;
  }

  test('server and render profiles land under the block_entity subfolder',
      () => {
        const settings = blockSettings();
        const {files} = buildModProjectFiles(settings,
            fixtureExportOptions(settings));
        const paths = files.map((f) => f.path);
        expect(paths).toContain(
            'data/example/easy_model_entities/profiles/block_entity/shrine.json');
        expect(paths).toContain(
            'assets/example/easy_model_entities/render_profiles/block_entity/shrine.json');
      });
});
