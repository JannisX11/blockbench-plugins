# Joint Pain

## Development

### Local development setup

from `src/` run:
```sh
npm install
npm run build
```

In Blockbench install from file `../gltf_importer.js`.

Watch for changes using `npm run dev`.

### Package patches

This project uses `patch-package` to add fixes to the `blockbench-types` library.
These should be applied automatically when running `npm install`, but you can apply the patch manually by running `npx patch-package`.
The patch file is located at `patches/blockbench-types+5.0.0-beta.0.patch`.
To change the patch file, make changes in your `node_modules/blockbench-types` directory, then run `npm run patch` to regenerate the patch file.
