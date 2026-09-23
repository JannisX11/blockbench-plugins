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

  test('validates full resource locations', () => {
    expect(ResourceLocation.isValidResourceLocation('example:lizard')).toBe(
        true);
    expect(ResourceLocation.isValidResourceLocation(
        'easy_model_entities:ground_entity')).toBe(true);
    expect(ResourceLocation.isValidResourceLocation('no_colon')).toBe(false);
    expect(ResourceLocation.isValidResourceLocation('a:b:c')).toBe(false);
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

  test('falls back to "entity" for empty names', () => {
    expect(ResourceLocation.sanitizeProfileId('')).toBe('entity');
    expect(ResourceLocation.sanitizeProfileId('   ')).toBe('entity');
    expect(ResourceLocation.sanitizeProfileId(undefined)).toBe('entity');
    expect(ResourceLocation.sanitizeProfileId(null)).toBe('entity');
  });

  test('keeps dots that are not a model file extension', () => {
    expect(ResourceLocation.sanitizeProfileId('Stone Turtle v1.5')).toBe(
        'stone_turtle_v1.5');
    expect(ResourceLocation.sanitizeProfileId('turtle.json')).toBe('turtle');
  });

  test('transliterates umlauts and accents instead of dropping them', () => {
    expect(ResourceLocation.sanitizeProfileId('Bär')).toBe('baer');
    expect(ResourceLocation.sanitizeProfileId('Wächter Groß')).toBe(
        'waechter_gross');
    expect(ResourceLocation.sanitizeProfileId('Café Crème')).toBe('cafe_creme');
    expect(ResourceLocation.sanitizeProfileId('Blåhaj Øst')).toBe(
        'blaahaj_oest');
    expect(ResourceLocation.sanitizeProfileId('Ñandú')).toBe('nandu');
    expect(ResourceLocation.sanitizeProfileId('Cat & Dog')).toBe('cat_and_dog');
  });

  test('gives non latin names a stable and unique id', () => {
    const japanese = ResourceLocation.sanitizeProfileId('モデル');
    const cyrillic = ResourceLocation.sanitizeProfileId('Модель');
    const emoji = ResourceLocation.sanitizeProfileId('🐢');

    expect(ResourceLocation.isValidPath(japanese)).toBe(true);
    expect(ResourceLocation.isValidPath(cyrillic)).toBe(true);
    expect(ResourceLocation.isValidPath(emoji)).toBe(true);
    expect(new Set([japanese, cyrillic, emoji]).size).toBe(3);
    expect(ResourceLocation.sanitizeProfileId('モデル')).toBe(japanese);
  });

  test('every sanitized id is a valid path', () => {
    const names = [
      'My Model.bbmodel', '  --Cool!!Robot--  ', 'Bär', 'モデル', '🐢', '!!!',
      'a/../b', '///', 'ΑΒΓ αβγ', 'Ünïcødé Tëst', 'Ａｎｇｅｌ', 'İstanbul'
    ];
    names.forEach((name) => {
      expect(ResourceLocation.isValidPath(
          ResourceLocation.sanitizeProfileId(name))).toBe(true);
    });
  });
});

describe('sanitizeNamespace', () => {
  test('produces a valid namespace without slashes', () => {
    expect(ResourceLocation.sanitizeNamespace('Beispiel Örg')).toBe(
        'beispiel_oerg');
    expect(ResourceLocation.sanitizeNamespace('my/namespace')).toBe(
        'my_namespace');
    expect(ResourceLocation.isValidNamespace(
        ResourceLocation.sanitizeNamespace('モデル'))).toBe(true);
  });

  test('falls back to the default namespace', () => {
    expect(ResourceLocation.sanitizeNamespace('')).toBe('example_org');
    expect(ResourceLocation.sanitizeNamespace(undefined)).toBe('example_org');
  });
});
