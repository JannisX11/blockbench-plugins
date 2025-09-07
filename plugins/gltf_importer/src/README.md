# Joint Pain

A plugin to import glTF models into Blockbench.
The approach is to use THREE.js GLTFLoader to import the glTF into
a THREE.js scene, which we then use to create new objects in Blockbench.

## Development

### Local development setup

From `plugins/gltf_importer/src/` run:
```sh
npm install
npm run build
```

Watch for changes using `npm run dev`.

In Blockbench install from file `../gltf_importer.js`.

### Package patches

This project uses `patch-package` to add fixes to the `blockbench-types` package.
These should be applied automatically when running `npm install`, but you can apply the patch manually by running `npx patch-package`.
The patch file is located at `patches/blockbench-types+5.0.0-beta.0.patch`.
To change the patch file, make changes in your `node_modules/blockbench-types` directory, then run `npm run patch` to regenerate the patch file.
