const {
  getDefaults,
  applyTemplate,
  DEFAULT_PRESET,
  PRESET_TYPES,
  SELECTABLE_PRESET_TYPES,
  deepMerge
} = require('../model/templates');
const {presetDefaults} = require('../model/presetTypes');

describe('templates', () => {
  test('exposes the 18 mod preset types', () => {
    expect(PRESET_TYPES).toHaveLength(18);
    expect(PRESET_TYPES).toContain('custom');
    expect(PRESET_TYPES).toContain('quadruped_wandering');
    expect(PRESET_TYPES).toContain('floating_still');
  });

  test('selectable presets exclude custom', () => {
    expect(SELECTABLE_PRESET_TYPES).not.toContain('custom');
    expect(SELECTABLE_PRESET_TYPES).toHaveLength(17);
  });

  test('getDefaults carries identity fields and the default preset', () => {
    const d = getDefaults();
    expect(d.namespace).toBe('example_org');
    expect(d.profileId).toBe('entity');
    expect(d.targetVersion).toBe('1.20.1');
    expect(d.presetType).toBe(DEFAULT_PRESET);
  });

  test('getDefaults returns an independent copy', () => {
    const a = getDefaults();
    a.dimensions.width = 99;
    expect(getDefaults().dimensions.width).not.toBe(99);
  });

  test('applyTemplate merges preset defaults onto the identity fields', () => {
    const s = applyTemplate('humanoid_wandering');
    expect(s.namespace).toBe('example_org');
    expect(s.presetType).toBe('humanoid_wandering');
    expect(s.host).toEqual({
      entityType: 'easy_model_entities:ground_entity',
      movementType: 'ground',
      bodyType: 'biped'
    });
    expect(s.behavior.mode).toBe('ambient');
    expect(s.animation.mode).toBe('automatic');
  });

  test('still presets are static hosts that idle', () => {
    const s = applyTemplate('quadruped_still');
    expect(s.host.movementType).toBe('static');
    expect(s.host.entityType).toBe('easy_model_entities:static_entity');
    expect(s.behavior.mode).toBe('idle_only');
    expect(s.movement.speed).toBe(0);
  });

  test('statue disables movement and animation', () => {
    const s = applyTemplate('statue');
    expect(s.host.bodyType).toBe('static');
    expect(s.behavior.mode).toBe('static');
    expect(s.animation.mode).toBe('none');
  });
});

describe('presetDefaults', () => {
  test.each(SELECTABLE_PRESET_TYPES)(
      'produces a complete settings object for %s',
      (preset) => {
        const d = presetDefaults(preset);
        expect(d.presetType).toBe(preset);
        expect(d.host.bodyType).toBeTruthy();
        expect(Number.isFinite(d.dimensions.width)).toBe(true);
        expect(Number.isFinite(d.dimensions.height)).toBe(true);
        expect(d.dimensions.eyeHeight).toBeLessThanOrEqual(d.dimensions.height);
      });

  test('moving presets enable ground movement and ambient strolling', () => {
    const d = presetDefaults('quadruped_wandering');
    expect(d.host.movementType).toBe('ground');
    expect(d.movement.speed).toBe(0.22);
    expect(d.behavior).toMatchObject(
        {mode: 'ambient', lookAtPlayers: true, randomStroll: true});
  });

  test('deepMerge overrides nested values and copies arrays', () => {
    const merged = deepMerge(presetDefaults('cuboid_still'),
        {rendering: {scale: 2}});
    expect(merged.rendering.scale).toBe(2);
    expect(merged.rendering.visibleBoundsOffset).toEqual([0, 0.5, 0]);
  });
});
