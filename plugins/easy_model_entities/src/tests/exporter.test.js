const {buildPackBundle, buildModProjectFiles} = require('../builders/exporter');
const {applyTemplate} = require('../model/templates');
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
      'assets/example/easy_model_entities/render_profiles/lizard.json',
      'assets/example/textures/entity/lizard.png',
      'pack.mcmeta'
    ].sort());
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
      'profiles carry model_type, preset_type, render link, no obsolete fields',
      () => {
        const server = JSON.parse(fileByPath(bundle.datapack,
            ENTITY_PROFILE_PATH).content);
        const render = JSON.parse(fileByPath(bundle.resourcepack,
            'assets/example/easy_model_entities/render_profiles/lizard.json')
            .content);
        expect(server.model_type).toBe('entity');
        expect(server.preset_type).toBe('quadruped_wandering');
        expect(server.schema_version).toBe('0.1.0');
        expect(server.client.render_profile).toBe('example:lizard');
        expect(render.preset_type).toBe('quadruped_wandering');
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

  test('writes model and texture bytes unchanged as binary entries', () => {
    const opts = fixtureExportOptions();
    const model = fileByPath(bundle.resourcepack,
        'assets/example/easy_model_entities/models/lizard.bbmodel');
    const texture = fileByPath(bundle.resourcepack,
        'assets/example/textures/entity/lizard.png');
    expect(model.binary).toBe(true);
    expect(model.content).toBe(opts.modelBytes);
    expect(texture.binary).toBe(true);
    expect(texture.content).toBe(opts.textureBytes);
  });
});

describe('buildModProjectFiles', () => {
  test('emits data and assets paths without pack.mcmeta', () => {
    const {files} = buildModProjectFiles(fixtureSettings(),
        fixtureExportOptions());
    expect(files.map((f) => f.path)).toEqual([
      ENTITY_PROFILE_PATH,
      'assets/example/easy_model_entities/render_profiles/lizard.json',
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
        const {files, serverProfile} = buildModProjectFiles(modelOnlySettings(),
            fixtureExportOptions());
        expect(serverProfile).toBeNull();
        expect(files.map((f) => f.path)).toEqual([
          'assets/example/easy_model_entities/render_profiles/chestling.json',
          'assets/example/easy_model_entities/models/chestling.bbmodel',
          'assets/example/textures/entity/chestling.png'
        ]);
        expect(files.some((f) => f.path.includes('/profiles/'))).toBe(false);
      });
});

describe('block entity export uses the block_entity subfolder', () => {
  function blockSettings() {
    const settings = applyTemplate('animated_randomly', 'block_entity');
    settings.namespace = 'example';
    settings.profileId = 'shrine';
    return settings;
  }

  test('server profile lands under profiles/block_entity', () => {
    const {files} = buildModProjectFiles(blockSettings(),
        fixtureExportOptions());
    expect(files.map((f) => f.path)).toContain(
        'data/example/easy_model_entities/profiles/block_entity/shrine.json');
  });
});
