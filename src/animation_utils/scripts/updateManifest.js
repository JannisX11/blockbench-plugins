(async () => {
  const indentString = (await import('indent-string')).default;
  const path = require('path');
  const fs = require('fs');
  const eol = require('eol');
  const url = require('url');
  // @ts-ignore

  const PACKAGE_JSON_PATH = './package.json'
  const PLUGINS_MANIFEST_PATH = '../../plugins.json'

  const pluginsString = fs.readFileSync(PLUGINS_MANIFEST_PATH, { encoding: 'utf8' });
  const pluginsObj = JSON.parse(pluginsString);

  const packageJsonString = fs.readFileSync(PACKAGE_JSON_PATH, { encoding: 'utf8' });
  const { version, blockbenchConfig } = JSON.parse(packageJsonString);

  // console.log({ version, blockbenchConfig });

  const newAnimationUtilsManifest = Object.assign(
    {},
    pluginsObj.animation_utils,
    { version },
    blockbenchConfig,
  );
  const newAnimationUtilsManifestString =
    indentString(
      JSON.stringify(newAnimationUtilsManifest, null, '\t'),
      1,
      { indent: '\t' }
    )
    .trimStart();

  const newPluginsString = pluginsString.replace(/("animation_utils":\s*)({[\s\S.]*?})/, `$1${newAnimationUtilsManifestString}`);

  fs.writeFileSync(PLUGINS_MANIFEST_PATH, eol.lf(newPluginsString));
})();