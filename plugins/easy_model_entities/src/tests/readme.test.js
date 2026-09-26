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

const {buildReadme} = require('../builders/readme');
const {fixtureSettings} = require('./fixtureData');

describe('buildReadme', () => {
  const readme = buildReadme(fixtureSettings(), {
    datapack: 'lizard_datapack.zip',
    resourcepack: 'lizard_resourcepack.zip'
  });

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

  test('names the profile-id-prefixed pack files', () => {
    expect(readme).toContain('lizard_datapack.zip');
    expect(readme).toContain('lizard_resourcepack.zip');
  });

  test('links to the CurseForge and Modrinth distribution pages', () => {
    expect(readme).toContain(
        'https://www.curseforge.com/minecraft/mc-mods/easy-model-entities');
    expect(readme).toContain(
        'https://modrinth.com/mod/easy-model-entities');
  });

  test('references the profile id', () => {
    expect(readme).toContain('example:lizard');
  });

  test('names the target Minecraft version', () => {
    expect(readme).toContain('Minecraft: Java Edition 1.20.1');
  });
});
