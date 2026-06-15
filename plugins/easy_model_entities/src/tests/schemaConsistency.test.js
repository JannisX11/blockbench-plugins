const {applyTemplate, deepMerge, SELECTABLE_PRESET_TYPES} = require(
    '../model/templates');
const {buildServerProfile} = require('../builders/serverProfile');
const {buildRenderProfile} = require('../builders/renderProfile');

function withId(settings) {
  settings.namespace = 'example';
  settings.profileId = 'lizard';
  return settings;
}

// If the plugin's preset defaults exactly mirror the mod's, an unmodified
// preset must reduce to just the model_type, preset_type and the required
// client.render_profile link (the mod fills in every other value from
// preset_type), proving the two stay in sync.
describe('preset defaults mirror the mod (minimal output)', () => {
  describe.each(SELECTABLE_PRESET_TYPES)('%s', (preset) => {
    const settings = withId(applyTemplate(preset));

    test('server profile reduces to identity + render link', () => {
      expect(buildServerProfile(settings)).toEqual({
        schema_version: '0.1.0',
        model_type: 'entity',
        preset_type: preset,
        client: {render_profile: 'example:lizard'}
      });
    });

    test('render profile reduces to schema_version + preset_type', () => {
      expect(buildRenderProfile(settings)).toEqual({
        schema_version: '0.1.0',
        preset_type: preset
      });
    });
  });
});

describe('custom preset writes the mod-required entity and dimensions', () => {
  const settings = withId(applyTemplate('custom'));

  test('server profile includes the full entity block and dimensions', () => {
    const profile = buildServerProfile(settings);
    expect(profile.model_type).toBe('entity');
    expect(profile.preset_type).toBe('custom');
    expect(profile.entity).toEqual({
      type: 'easy_model_entities:static_entity',
      movement_type: 'static',
      body_type: 'static'
    });
    expect(profile.dimensions).toEqual(
        {width: 0.6, height: 1.8, eye_height: 1.62});
  });

  test('render profile includes the required body_type', () => {
    expect(buildRenderProfile(settings).body_type).toBe('static');
  });
});

describe('block entity profiles', () => {
  function blockSettings(preset) {
    const settings = applyTemplate(preset, 'block_entity');
    settings.namespace = 'example';
    settings.profileId = 'shrine';
    return settings;
  }

  test('server profile carries model_type, render link and no entity behavior',
      () => {
        const profile = buildServerProfile(blockSettings('animated_randomly'));
        expect(profile).toEqual({
          schema_version: '0.1.0',
          model_type: 'block_entity',
          preset_type: 'animated_randomly',
          client: {render_profile: 'example:shrine'}
        });
        expect(profile.entity).toBeUndefined();
        expect(profile.movement).toBeUndefined();
        expect(profile.behavior).toBeUndefined();
        expect(profile.attributes).toBeUndefined();
      });

  test('render profile uses the static render preset with mapped animation',
      () => {
        const render = buildRenderProfile(blockSettings('animated_randomly'));
        expect(render.preset_type).toBe('static');
        expect(render.body_type).toBeUndefined();
        expect(render.animation.mode).toBe('random_idle');
      });

  test('static block entity emits no animation override', () => {
    const render = buildRenderProfile(blockSettings('static'));
    expect(render.preset_type).toBe('static');
    expect(render.animation).toBeUndefined();
  });
});

describe('customized settings emit only the deviating values', () => {
  const settings = deepMerge(withId(applyTemplate('quadruped_wandering')), {
    version: 'demo-stone-turtle-v4',
    dimensions: {width: 1.2, height: 0.85, eyeHeight: 0.6},
    movement: {speed: 0.06, stepHeight: 0.4, gravity: true},
    attributes: {maxHealth: 12, movementSpeed: 0.06, followRange: 12}
  });

  test('server profile contains the stone turtle overrides only', () => {
    expect(buildServerProfile(settings)).toEqual({
      schema_version: '0.1.0',
      model_type: 'entity',
      preset_type: 'quadruped_wandering',
      version: 'demo-stone-turtle-v4',
      client: {render_profile: 'example:lizard'},
      dimensions: {width: 1.2, height: 0.85},
      movement: {speed: 0.06, step_height: 0.4},
      attributes: {max_health: 12, follow_range: 12}
    });
  });
});
