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

const {Validator} = require('../model/Validator');
const {fixtureSettings} = require('./fixtureData');

function codes(list) {
  return list.map((entry) => entry.code);
}

const QUADRUPED_BONES = ['root', 'body', 'head', 'front_left_leg',
  'front_right_leg', 'back_left_leg', 'back_right_leg'];

describe('validateSettings', () => {
  test('valid default settings produce no errors', () => {
    const result = Validator.validateSettings(fixtureSettings(), {
      hasModel: true,
      hasTexture: true,
      boneNames: QUADRUPED_BONES
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('rejects invalid namespace and profile id', () => {
    const s = fixtureSettings();
    s.namespace = 'Bad NS';
    s.profileId = '../escape';
    const result = Validator.validateSettings(s,
        {hasModel: true, hasTexture: true});
    expect(result.valid).toBe(false);
    expect(codes(result.errors)).toEqual(
        expect.arrayContaining(['INVALID_NAMESPACE', 'INVALID_PROFILE_ID']));
  });

  test('rejects an unknown preset type', () => {
    const s = fixtureSettings();
    s.presetType = 'bogus';
    const result = Validator.validateSettings(s,
        {hasModel: true, hasTexture: true});
    expect(codes(result.errors)).toContain('INVALID_PRESET_TYPE');
  });

  test('rejects non-positive dimensions and eye height above height', () => {
    const s = fixtureSettings();
    s.dimensions = {width: 0, height: -1, eyeHeight: 5};
    const result = Validator.validateSettings(s,
        {hasModel: true, hasTexture: true});
    expect(codes(result.errors).filter(
        (c) => c === 'INVALID_DIMENSIONS').length).toBeGreaterThanOrEqual(2);
  });

  test('rejects NaN/Infinity dimensions', () => {
    const s = fixtureSettings();
    s.dimensions = {width: NaN, height: Infinity, eyeHeight: 0.5};
    const result = Validator.validateSettings(s,
        {hasModel: true, hasTexture: true});
    expect(codes(result.errors)).toContain('INVALID_NUMERIC');
  });

  test('flags missing model and texture', () => {
    const result = Validator.validateSettings(fixtureSettings(),
        {hasModel: false, hasTexture: false});
    expect(codes(result.errors)).toEqual(
        expect.arrayContaining(['MISSING_MODEL', 'MISSING_TEXTURE']));
  });

  test('allows multiple textures without warning', () => {
    const result = Validator.validateSettings(fixtureSettings(), {
      hasModel: true,
      hasTexture: true,
      boneNames: QUADRUPED_BONES
    });
    expect(result.valid).toBe(true);
    expect(codes(result.warnings)).not.toContain('MULTIPLE_TEXTURES');
  });

  test('warns about performance budgets without blocking', () => {
    const result = Validator.validateSettings(fixtureSettings(), {
      hasModel: true,
      hasTexture: true,
      textureWidth: 4096,
      textureHeight: 4096,
      modelFileSize: 5 * 1024 * 1024,
      cubeCount: 1000,
      boneCount: 200,
      hierarchyDepth: 50,
      boneNames: QUADRUPED_BONES
    });
    expect(result.valid).toBe(true);
    expect(codes(result.warnings)).toEqual(
        expect.arrayContaining(
            ['LARGE_TEXTURE', 'LARGE_MODEL', 'HIGH_CUBE_COUNT',
              'HIGH_BONE_COUNT', 'DEEP_HIERARCHY'])
    );
  });

  test('warns about soft performance budgets without blocking', () => {
    const result = Validator.validateSettings(fixtureSettings(), {
      hasModel: true,
      hasTexture: true,
      textureWidth: 256,
      textureHeight: 128,
      modelFileSize: 1536 * 1024,
      cubeCount: 400,
      boneCount: 100,
      hierarchyDepth: 25,
      animationCount: 16,
      boneNames: QUADRUPED_BONES
    });
    expect(result.valid).toBe(true);
    expect(codes(result.warnings)).toEqual(
        expect.arrayContaining(
            ['SOFT_TEXTURE_SIZE', 'SOFT_MODEL_SIZE', 'SOFT_CUBE_COUNT',
              'SOFT_BONE_COUNT', 'SOFT_HIERARCHY_DEPTH'])
    );
    expect(codes(result.warnings)).not.toContain('HIGH_ANIMATION_COUNT');
  });

  test('rejects more animations than the mod accepts', () => {
    const result = Validator.validateSettings(fixtureSettings(), {
      hasModel: true,
      hasTexture: true,
      animationCount: 17,
      boneNames: QUADRUPED_BONES
    });
    expect(result.valid).toBe(false);
    expect(codes(result.errors)).toContain('HIGH_ANIMATION_COUNT');
  });

  test('standard animation clips produce no warnings', () => {
    const result = Validator.validateSettings(fixtureSettings(), {
      hasModel: true,
      hasTexture: true,
      animationCount: 2,
      animations: [
        {name: 'idle', channels: ['rotation'], hasExpression: false},
        {name: 'WALK', channels: ['rotation', 'position'], hasExpression: false}
      ],
      boneNames: QUADRUPED_BONES
    });
    expect(result.valid).toBe(true);
    expect(result.warnings).toHaveLength(0);
  });

  test('warns about animations the mod ignores or drops', () => {
    const result = Validator.validateSettings(fixtureSettings(), {
      hasModel: true,
      hasTexture: true,
      animationCount: 3,
      animations: [
        {name: 'attack', channels: ['rotation'], hasExpression: false},
        {name: 'walk', channels: ['rotation'], hasExpression: true},
        {name: 'idle', channels: ['rotation', 'scale'], hasExpression: false}
      ],
      boneNames: QUADRUPED_BONES
    });
    expect(result.valid).toBe(true);
    expect(codes(result.warnings)).toEqual(
        expect.arrayContaining(
            ['NON_STANDARD_ANIMATION', 'UNSUPPORTED_ANIMATION_EXPRESSION',
              'UNSUPPORTED_ANIMATION_CHANNEL'])
    );
  });

  test('warns about missing body parts per body type', () => {
    const result = Validator.validateSettings(fixtureSettings(),
        {hasModel: true, hasTexture: true, boneNames: ['root', 'body']});
    expect(codes(result.warnings).filter(
        (c) => c === 'MISSING_BODY_PART').length).toBeGreaterThan(0);
  });
});

describe('getMissingBodyParts', () => {
  test('static body type requires no parts', () => {
    expect(Validator.getMissingBodyParts('static', [])).toEqual([]);
  });

  test('unknown body types require no parts', () => {
    expect(Validator.getMissingBodyParts('aquatic', [])).toEqual([]);
  });

  test('biped reports missing limbs case-insensitively', () => {
    expect(Validator.getMissingBodyParts('biped',
        ['ROOT', 'Head', 'Body'])).toEqual([
      'left_arm',
      'right_arm',
      'left_leg',
      'right_leg'
    ]);
  });
});

describe('validateOutputPath', () => {
  test('accepts a clean relative path', () => {
    expect(Validator.validateOutputPath('/root',
        'data/example/profiles/lizard.json').valid).toBe(true);
  });

  test('rejects traversal and absolute paths', () => {
    expect(Validator.validateOutputPath('/root', '../../etc/passwd').code).toBe(
        'PATH_TRAVERSAL');
    expect(Validator.validateOutputPath('/root', '/etc/passwd').code).toBe(
        'ABSOLUTE_PATH');
    expect(
        Validator.validateOutputPath('/root', 'C:/Windows/system32').code).toBe(
        'ABSOLUTE_PATH');
  });
});
