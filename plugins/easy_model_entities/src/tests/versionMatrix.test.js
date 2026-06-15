const {
  getVersions,
  getEnabledVersions,
  getDefaultVersionId,
  getPackFormats
} = require('../model/versionMatrix');

describe('versionMatrix', () => {
  test('default version is 1.20.1 and enabled', () => {
    expect(getDefaultVersionId()).toBe('1.20.1');
    const enabled = getEnabledVersions().map((v) => v.id);
    expect(enabled).toEqual(['1.20.1']);
  });

  test('exposes the full selectable version list', () => {
    expect(getVersions().map((v) => v.id)).toEqual(
        ['1.20.1', '1.21.1', '1.21.11', '26.1.2']);
  });

  test('1.20.1 maps to pack_format 15 / 15', () => {
    expect(getPackFormats('1.20.1')).toEqual(
        {dataFormat: 15, resourceFormat: 15});
  });

  test('disabled versions return no pack formats', () => {
    expect(getPackFormats('1.21.1')).toBeNull();
    expect(getPackFormats('does-not-exist')).toBeNull();
  });
});
