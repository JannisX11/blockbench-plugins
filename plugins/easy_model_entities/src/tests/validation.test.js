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

  test('rejects dimensions larger than the mod accepts', () => {
    const s = fixtureSettings();
    s.dimensions = {width: 9, height: 12, eyeHeight: 1};
    const result = Validator.validateSettings(s,
        {hasModel: true, hasTexture: true});
    expect(codes(result.errors).filter(
        (c) => c === 'INVALID_DIMENSIONS').length).toBe(2);
  });

  test('rejects movement values outside the mod range', () => {
    const s = fixtureSettings();
    s.movement = {speed: 3, stepHeight: -0.5, gravity: true};
    const result = Validator.validateSettings(s,
        {hasModel: true, hasTexture: true});
    expect(codes(result.errors).filter(
        (c) => c === 'INVALID_MOVEMENT').length).toBe(2);
  });

  test('rejects negative attributes', () => {
    const s = fixtureSettings();
    s.attributes = {maxHealth: -1, movementSpeed: -1, followRange: -1};
    const result = Validator.validateSettings(s,
        {hasModel: true, hasTexture: true});
    expect(codes(result.errors).filter(
        (c) => c === 'INVALID_ATTRIBUTES').length).toBe(3);
  });

  test('rejects a non-positive scale and negative render settings', () => {
    const s = fixtureSettings();
    s.rendering.scale = 0;
    s.rendering.shadowRadius = -0.5;
    s.rendering.visibleBoundsWidth = -1;
    const result = Validator.validateSettings(s,
        {hasModel: true, hasTexture: true});
    expect(codes(result.errors).filter(
        (c) => c === 'INVALID_RENDER_SETTINGS').length).toBe(3);
  });

  test('rejects negative animation settings', () => {
    const s = fixtureSettings();
    s.animation.swingSpeed = -1;
    s.animation.idleStrength = -1;
    const result = Validator.validateSettings(s,
        {hasModel: true, hasTexture: true});
    expect(codes(result.errors).filter(
        (c) => c === 'INVALID_ANIMATION_SETTINGS').length).toBe(2);
  });

  test('rejects NaN/Infinity dimensions', () => {
    const s = fixtureSettings();
    s.dimensions = {width: NaN, height: Infinity, eyeHeight: 0.5};
    const result = Validator.validateSettings(s,
        {hasModel: true, hasTexture: true});
    expect(codes(result.errors)).toContain('INVALID_NUMERIC');
  });

  test('blocks the export on texture resolution issues', () => {
    const result = Validator.validateSettings(fixtureSettings(), {
      hasModel: true,
      hasTexture: true,
      boneNames: QUADRUPED_BONES,
      textureIssues: [
        {code: 'INVALID_TEXTURE_LOCATION', message: 'bad location'}]
    });
    expect(result.valid).toBe(false);
    expect(codes(result.errors)).toContain('INVALID_TEXTURE_LOCATION');
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
      animationCount: 33,
      boneNames: QUADRUPED_BONES
    });
    expect(result.valid).toBe(true);
    expect(codes(result.warnings)).toEqual(
        expect.arrayContaining(
            ['SOFT_TEXTURE_SIZE', 'SOFT_MODEL_SIZE', 'SOFT_CUBE_COUNT',
              'SOFT_BONE_COUNT', 'SOFT_HIERARCHY_DEPTH',
              'SOFT_ANIMATION_COUNT'])
    );
  });

  test('accepts up to 64 animations and up to 32 without warning', () => {
    const resultFor = (animationCount) => Validator.validateSettings(
        fixtureSettings(), {
          hasModel: true,
          hasTexture: true,
          animationCount: animationCount,
          boneNames: QUADRUPED_BONES
        });
    expect(codes(resultFor(32).warnings)).not.toContain('SOFT_ANIMATION_COUNT');
    expect(resultFor(64).valid).toBe(true);
  });

  test('rejects more animations than the mod accepts', () => {
    const result = Validator.validateSettings(fixtureSettings(), {
      hasModel: true,
      hasTexture: true,
      animationCount: 65,
      boneNames: QUADRUPED_BONES
    });
    expect(result.valid).toBe(false);
    expect(codes(result.errors)).toContain('HIGH_ANIMATION_COUNT');
  });

  test('numbered variants and the shoulder clip are not custom clips', () => {
    const result = Validator.validateSettings(fixtureSettings(), {
      hasModel: true,
      hasTexture: true,
      animations: [
        {name: 'idle', channels: ['rotation'], hasExpression: false},
        {name: 'idle_2', channels: ['rotation'], hasExpression: false},
        {name: 'Walk 3', channels: ['rotation'], hasExpression: false},
        {name: 'shoulder', channels: ['rotation'], hasExpression: false}
      ],
      boneNames: QUADRUPED_BONES
    });
    expect(codes(result.warnings)).not.toContain('CUSTOM_ANIMATION_CLIP');
  });

  test('the shoulder clip is a custom clip for block entities', () => {
    const settings = fixtureSettings();
    settings.modelType = 'block_entity';
    const result = Validator.validateSettings(settings, {
      hasModel: true,
      hasTexture: true,
      animations: [{name: 'shoulder', channels: [], hasExpression: false}]
    });
    expect(codes(result.warnings)).toContain('CUSTOM_ANIMATION_CLIP');
  });

  test('lists all custom clips in a single warning', () => {
    const result = Validator.validateSettings(fixtureSettings(), {
      hasModel: true,
      hasTexture: true,
      animations: [
        {name: 'wave', channels: [], hasExpression: false},
        {name: 'idle', channels: [], hasExpression: false},
        {name: 'point', channels: [], hasExpression: false}
      ],
      boneNames: QUADRUPED_BONES
    });
    const customClipWarnings = result.warnings.filter(
        (warning) => warning.code === 'CUSTOM_ANIMATION_CLIP');
    expect(customClipWarnings).toHaveLength(1);
    expect(customClipWarnings[0].message).toContain('wave, point');
  });

  test.each([
    ['opacity above 1', (s) => s.rendering.opacity = 1.5,
      'INVALID_RENDER_SETTINGS'],
    ['negative opacity', (s) => s.rendering.opacity = -0.1,
      'INVALID_RENDER_SETTINGS'],
    ['unknown variant mode', (s) => s.animation.variantMode = 'shuffle',
      'INVALID_ANIMATION_SETTINGS'],
    ['unknown animation mode', (s) => s.animation.mode = 'always',
      'INVALID_ANIMATION_SETTINGS'],
    ['unknown gait', (s) => s.animation.gait = 'canter',
      'INVALID_ANIMATION_SETTINGS'],
    ['unknown behavior mode', (s) => s.behavior.mode = 'wander',
      'INVALID_BEHAVIOR_SETTINGS'],
    ['unknown body type', (s) => s.host.bodyType = 'serpent',
      'INVALID_HOST_SETTINGS'],
    ['unknown movement type', (s) => s.host.movementType = 'air',
      'INVALID_HOST_SETTINGS'],
    ['zero variant weight', (s) => s.animation.variantWeights = {idle_2: 0},
      'INVALID_ANIMATION_SETTINGS'],
    ['negative variant weight',
      (s) => s.animation.variantWeights = {idle_2: -1},
      'INVALID_ANIMATION_SETTINGS'],
    ['NaN variant weight', (s) => s.animation.variantWeights = {idle_2: NaN},
      'INVALID_NUMERIC'],
    ['NaN shoulder offset', (s) => s.shoulder = {offset: [0, NaN, 0], scale: 1},
      'INVALID_NUMERIC'],
    ['zero shoulder scale', (s) => s.shoulder = {offset: [0, 0, 0], scale: 0},
      'INVALID_RENDER_SETTINGS'],
    ['negative shoulder scale',
      (s) => s.shoulder = {offset: [0, 0, 0], scale: -1},
      'INVALID_RENDER_SETTINGS']
  ])('rejects %s, which would drop the profile in the mod',
      (label, mutate, expectedCode) => {
        const settings = fixtureSettings();
        mutate(settings);
        const result = Validator.validateSettings(settings, {
          hasModel: true,
          hasTexture: true,
          boneNames: QUADRUPED_BONES
        });
        expect(result.valid).toBe(false);
        expect(codes(result.errors)).toEqual([expectedCode]);
      });

  test('ignores variant weights when variants are disabled', () => {
    const s = fixtureSettings();
    s.animation.variantMode = 'none';
    s.animation.variantWeights = {idle_2: 0};
    const result = Validator.validateSettings(s,
        {hasModel: true, hasTexture: true});
    expect(codes(result.errors)).not.toContain('INVALID_ANIMATION_SETTINGS');
  });

  test('standard animation clips produce no warnings', () => {
    const result = Validator.validateSettings(fixtureSettings(), {
      hasModel: true,
      hasTexture: true,
      animationCount: 3,
      animations: [
        {name: 'idle', channels: ['rotation'], hasExpression: false},
        {
          name: 'WALK',
          channels: ['rotation', 'position'],
          hasExpression: false
        },
        {name: 'sit', channels: ['rotation'], hasExpression: false}
      ],
      boneNames: QUADRUPED_BONES
    });
    expect(result.valid).toBe(true);
    expect(result.warnings).toHaveLength(0);
  });

  test('warns about custom clips and animations the mod drops', () => {
    const result = Validator.validateSettings(fixtureSettings(), {
      hasModel: true,
      hasTexture: true,
      animationCount: 3,
      animations: [
        {name: 'dance', channels: ['rotation'], hasExpression: false},
        {name: 'walk', channels: ['rotation'], hasExpression: true},
        {name: 'idle', channels: ['rotation', 'scale'], hasExpression: false}
      ],
      boneNames: QUADRUPED_BONES
    });
    expect(result.valid).toBe(true);
    expect(codes(result.warnings)).toEqual(
        expect.arrayContaining(
            ['CUSTOM_ANIMATION_CLIP', 'UNSUPPORTED_ANIMATION_EXPRESSION',
              'UNSUPPORTED_ANIMATION_CHANNEL'])
    );
  });

  test('warns when the preset silences the clips of the project', () => {
    const s = fixtureSettings();
    s.presetType = 'statue';
    s.host.bodyType = 'static';
    s.animation.mode = 'none';
    const result = Validator.validateSettings(s, {
      hasModel: true,
      hasTexture: true,
      animations: [{name: 'idle'}, {name: 'walk'}]
    });
    expect(result.valid).toBe(true);
    expect(codes(result.warnings)).toContain('ANIMATIONS_NEVER_PLAYED');
    expect(result.warnings.find(
        (warning) => warning.code === 'ANIMATIONS_NEVER_PLAYED').message)
    .toContain('idle, walk');
  });

  test('animated presets with clips produce no animation warning', () => {
    const result = Validator.validateSettings(fixtureSettings(), {
      hasModel: true,
      hasTexture: true,
      boneNames: QUADRUPED_BONES,
      animations: [{name: 'idle'}]
    });
    expect(codes(result.warnings)).not.toContain('ANIMATIONS_NEVER_PLAYED');
  });

  test('warns about textures that stay a reference', () => {
    const result = Validator.validateSettings(fixtureSettings(), {
      hasModel: true,
      hasTexture: true,
      boneNames: QUADRUPED_BONES,
      referencedTextures: ['othermod:textures/entity/thing.png']
    });
    expect(result.valid).toBe(true);
    expect(codes(result.warnings)).toContain('EXTERNAL_TEXTURE_REFERENCE');
  });

  test('warns about animation names that only differ in case or spaces', () => {
    const result = Validator.validateSettings(fixtureSettings(), {
      hasModel: true,
      hasTexture: true,
      boneNames: QUADRUPED_BONES,
      animations: [{name: 'walk'}, {name: ' Walk'}, {name: 'idle'}]
    });
    const duplicates = result.warnings.filter(
        (warning) => warning.code === 'DUPLICATE_ANIMATION_NAME');
    expect(duplicates).toHaveLength(1);
    expect(duplicates[0].message).toContain('walk');
    expect(duplicates[0].message).not.toContain('idle');
  });

  test('blocks the export for missing body parts per body type', () => {
    const result = Validator.validateSettings(fixtureSettings(),
        {hasModel: true, hasTexture: true, boneNames: ['root', 'body']});
    expect(result.valid).toBe(false);
    expect(codes(result.errors).filter(
        (code) => code === 'MISSING_BODY_PART')).toHaveLength(5);
  });

  test('includes geometry issues when geometry is provided', () => {
    const result = Validator.validateSettings(fixtureSettings(), {
      hasModel: true,
      hasTexture: true,
      boneNames: QUADRUPED_BONES,
      geometry: {unsupportedElements: ['tail (mesh)'], hiddenNodes: ['eye']}
    });
    expect(codes(result.errors)).toContain('UNSUPPORTED_ELEMENT');
    expect(codes(result.warnings)).toContain('HIDDEN_ELEMENT');
  });
});

describe('validateModelLoad', () => {
  test('keeps only problems that stop the mod from showing the model', () => {
    const settings = fixtureSettings();
    settings.namespace = 'Bad NS';
    settings.rendering.opacity = 2;
    const errors = Validator.validateModelLoad(settings, {
      hasModel: true,
      hasTexture: false,
      textureIssues: [{code: 'INVALID_TEXTURE_LOCATION', message: 'slot 1'}],
      animationCount: 65,
      cubeCount: 1000,
      boneNames: QUADRUPED_BONES.filter((name) => name !== 'head'),
      geometry: {rootCubes: ['loose'], hiddenNodes: ['hidden']}
    });
    expect(codes(errors)).toEqual(['MISSING_TEXTURE',
      'INVALID_TEXTURE_LOCATION', 'HIGH_ANIMATION_COUNT', 'MISSING_BODY_PART',
      'CUBE_OUTSIDE_GROUP']);
  });
});

describe('getMissingBodyParts', () => {
  test('static body type requires no parts', () => {
    expect(Validator.getMissingBodyParts('static', [])).toEqual([]);
  });

  test('unknown body types require no parts', () => {
    expect(Validator.getMissingBodyParts('unknown', [])).toEqual([]);
  });

  test('aquatic requires only body, root is optional', () => {
    expect(Validator.getMissingBodyParts('aquatic', [])).toEqual(['body']);
  });

  test('biped matches part names trimmed and case-insensitively like the mod',
      () => {
        expect(Validator.getMissingBodyParts('biped',
            [' Head', 'BODY ', 'Left_Arm', 'right_arm', 'left_leg',
              'RIGHT_LEG'])).toEqual([]);
      });
});

describe('validateGeometry', () => {
  function validate(geometry) {
    return Validator.validateGeometry(geometry);
  }

  test('empty geometry produces no issues', () => {
    expect(validate({})).toEqual({errors: [], warnings: []});
  });

  test.each([
    ['UNSUPPORTED_ELEMENT', 'unsupportedElements'],
    ['CUBE_OUTSIDE_GROUP', 'rootCubes']
  ])('reports %s as error', (code, key) => {
    const result = validate({[key]: ['part']});
    expect(codes(result.errors)).toEqual([code]);
    expect(result.errors[0].message).toContain('part');
    expect(result.warnings).toEqual([]);
  });

  test.each([
    ['FACE_UV_ROTATION_IGNORED', 'rotatedFaceCubes'],
    ['PER_TEXTURE_UV_SIZE', 'customUvSizeTextures'],
    ['HIDDEN_ELEMENT', 'hiddenNodes']
  ])('reports %s as warning', (code, key) => {
    const result = validate({[key]: ['part']});
    expect(codes(result.warnings)).toEqual([code]);
    expect(result.warnings[0].message).toContain('part');
    expect(result.errors).toEqual([]);
  });

  test('warns about mixed face textures only in the eme_entity format', () => {
    expect(codes(validate({
      formatId: 'eme_entity',
      mixedTextureCubes: ['part']
    }).warnings)).toEqual(['MIXED_TEXTURES_PER_CUBE']);
    expect(validate({
      formatId: 'modded_entity',
      mixedTextureCubes: ['part']
    }).warnings).toEqual([]);
  });

  test('warns about group names that only differ in case or spaces', () => {
    const result = validate(
        {exportedGroupNames: ['Head', ' head', 'body', 'BODY', 'tail']});
    expect(codes(result.warnings)).toEqual(['DUPLICATE_GROUP_NAME']);
    expect(result.warnings[0].message).toContain('head, body');
    expect(result.warnings[0].message).not.toContain('tail');
    expect(result.errors).toEqual([]);
  });

  test('unique group names produce no warning', () => {
    expect(validate({exportedGroupNames: ['root', 'head', 'body']}))
    .toEqual({errors: [], warnings: []});
  });

  test('shortens long name lists', () => {
    const names = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const message = validate({hiddenNodes: names}).warnings[0].message;
    expect(message).toContain('a, b, c, d, e and 2 more');
    expect(message).not.toContain(', f');
  });
});

describe('validateOutputPath', () => {
  test('accepts a clean relative path', () => {
    expect(Validator.validateOutputPath(
        'data/example/profiles/lizard.json').valid).toBe(true);
  });

  test('rejects traversal and absolute paths', () => {
    expect(Validator.validateOutputPath('../../etc/passwd').code).toBe(
        'PATH_TRAVERSAL');
    expect(Validator.validateOutputPath('/etc/passwd').code).toBe(
        'ABSOLUTE_PATH');
    expect(Validator.validateOutputPath('C:/Windows/system32').code).toBe(
        'ABSOLUTE_PATH');
  });
});
