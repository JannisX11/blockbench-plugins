// @ts-check
import indentString from 'indent-string';
import path from 'path';
import fs from 'fs';
import eol from 'eol';
import * as url from 'url';

// Identify key file paths
// @ts-ignore
const PLUGIN_SRC_PATH = url.fileURLToPath(new URL('.', import.meta.url));
const PACKAGE_JSON_PATH = path.join(PLUGIN_SRC_PATH, '../package.json');
const PLUGINS_MANIFEST_PATH = path.join(PLUGIN_SRC_PATH, '..', '..',  '..', '..', 'plugins.json');

// Extract plugins.json contents
const pluginsJsonRaw = fs.readFileSync(PLUGINS_MANIFEST_PATH, { encoding: 'utf8' });
const pluginsJson = JSON.parse(pluginsJsonRaw);

// Extract package.json
const packageJsonRaw = fs.readFileSync(PACKAGE_JSON_PATH, { encoding: 'utf8' });
const packageJson = JSON.parse(packageJsonRaw);

// Update plugins.json manifest entry for plugin
packageJson.pluginOptions.version = packageJson.version;
const newManifest = Object.assign({},
  pluginsJson.geckolib,
  packageJson.pluginOptions
);
const newManifestString =
  indentString(
    JSON.stringify(newManifest, null, '\t'),
    1,
    { indent: '\t' }
  )
  .trimStart();

// Write updated plugins.json
const newPluginsString = pluginsJsonRaw.replace(/("geckolib":\s*)({[\s\S.]*?})/, `$1${newManifestString}`);

fs.writeFileSync(PLUGINS_MANIFEST_PATH, eol.lf(newPluginsString));