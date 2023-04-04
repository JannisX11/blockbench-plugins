const fs = require('fs');
const eol = require('eol');
const { version, blockbenchConfig } = require('../package.json');
const PACKAGE_MANIFEST_PATH = '../../plugins.json';
const manifest = require(`../${PACKAGE_MANIFEST_PATH}`);

// console.log({ version, blockbenchConfig });

Object.assign(
  manifest.azurelib_utils,
  { version },
  blockbenchConfig,
);

fs.writeFileSync(PACKAGE_MANIFEST_PATH, eol.crlf(JSON.stringify(manifest, null, '\t')));

// console.log('manifest', manifest);

console.log(`Wrote manifest to ${PACKAGE_MANIFEST_PATH}.`);