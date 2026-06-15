const {ResourceLocation} = require('../utils/ResourceLocation');

describe('resourceLocation', () => {
  test('accepts valid namespaces', () => {
    expect(ResourceLocation.isValidNamespace('example')).toBe(true);
    expect(ResourceLocation.isValidNamespace('easy_model_entities')).toBe(true);
    expect(ResourceLocation.isValidNamespace('mod.id-1')).toBe(true);
  });

  test('rejects invalid namespaces', () => {
    expect(ResourceLocation.isValidNamespace('Example')).toBe(false);
    expect(ResourceLocation.isValidNamespace('with space')).toBe(false);
    expect(ResourceLocation.isValidNamespace('')).toBe(false);
    expect(ResourceLocation.isValidNamespace('a/b')).toBe(false);
  });

  test('paths allow slashes but reject traversal', () => {
    expect(ResourceLocation.isValidPath('models/lizard')).toBe(true);
    expect(ResourceLocation.isValidPath('lizard')).toBe(true);
    expect(ResourceLocation.isValidPath('../escape')).toBe(false);
    expect(ResourceLocation.isValidPath('Upper')).toBe(false);
  });

  test('validates and parses full resource locations', () => {
    expect(ResourceLocation.isValidResourceLocation('example:lizard')).toBe(
        true);
    expect(ResourceLocation.isValidResourceLocation(
        'easy_model_entities:ground_entity')).toBe(true);
    expect(ResourceLocation.isValidResourceLocation('no_colon')).toBe(false);
    expect(ResourceLocation.isValidResourceLocation('a:b:c')).toBe(false);
    expect(ResourceLocation.parseResourceLocation('example:lizard')).toEqual(
        {namespace: 'example', path: 'lizard'});
    expect(ResourceLocation.parseResourceLocation('bad')).toBeNull();
  });
});

describe('sanitizeProfileId', () => {
  test('strips extension, lowercases and replaces invalid characters', () => {
    expect(ResourceLocation.sanitizeProfileId('My Model.bbmodel')).toBe(
        'my_model');
    expect(ResourceLocation.sanitizeProfileId('Stone Turtle')).toBe(
        'stone_turtle');
    expect(ResourceLocation.sanitizeProfileId('Lizard')).toBe('lizard');
  });

  test('collapses repeats and trims separators, result is a valid path', () => {
    const id = ResourceLocation.sanitizeProfileId('  --Cool!!Robot--  ');
    expect(id).toBe('cool_robot');
    expect(ResourceLocation.isValidPath(id)).toBe(true);
  });

  test('falls back to "entity" for empty or unusable names', () => {
    expect(ResourceLocation.sanitizeProfileId('')).toBe('entity');
    expect(ResourceLocation.sanitizeProfileId('!!!')).toBe('entity');
    expect(ResourceLocation.sanitizeProfileId(undefined)).toBe('entity');
  });
});
