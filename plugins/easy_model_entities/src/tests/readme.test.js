const {buildReadme} = require('../builders/readme');
const {fixtureSettings} = require('./fixtureData');

describe('buildReadme', () => {
  const readme = buildReadme(fixtureSettings());

  test('states the mod requirement and Java Edition target', () => {
    expect(readme).toContain('Easy Model Entities');
    expect(readme).toContain('Minecraft: Java Edition');
    expect(readme).toMatch(/mod .*installed|installed .*mod/i);
  });

  test('explains where to install both packs as ready-to-use ZIPs', () => {
    expect(readme).toContain('resourcepacks');
    expect(readme).toContain('saves/<world>/datapacks');
    expect(readme).toContain('resourcepack.zip');
    expect(readme).toContain('datapack.zip');
    expect(readme).toContain('Resource Pack');
    expect(readme).toContain('Data Pack');
  });

  test('references the profile id', () => {
    expect(readme).toContain('example:lizard');
  });

  test('names the target Minecraft version', () => {
    expect(readme).toContain('Minecraft: Java Edition 1.20.1');
  });
});
