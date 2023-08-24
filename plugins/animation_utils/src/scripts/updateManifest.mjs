// @ts-check
import indentString from 'indent-string';
import path from 'path';
import fs from 'fs';
import eol from 'eol';
import * as url from 'url';
// @ts-ignore
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const PACKAGE_JSON_PATH = path.join(__dirname, '../package.json');
const PLUGINS_MANIFEST_PATH = path.join(__dirname, '..', '..',  '..', '..', 'plugins.json');

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

// console.log('manifest', manifest);

// console.log(`Wrote manifest to ${PACKAGE_MANIFEST_PATH}.`);