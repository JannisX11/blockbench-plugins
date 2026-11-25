import { realpathSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { build } from "esbuild"

// The build script that ships in the plugin repository as
// plugins/blockbench_workshop/src/build.mjs, next to the TypeScript sources and
// protocol.ts (a copy of packages/blockbench-protocol). Anyone can rebuild the
// bundle there with `npm install && npm run build`. The monorepo builds with
// these same options from the same layout (../build.mjs), so both produce the
// same bytes.
export const buildOptions = {
  entryPoints: ["plugin.ts"],
  bundle: true,
  format: "iife",
  target: "es2022",
  minify: false,
  keepNames: true,
  legalComments: "inline",
  alias: { "@workspace/blockbench-protocol": "./protocol.ts" },
  banner: {
    js: "// Blockbench Workshop plugin. Readable bundle of src/: run `npm install && npm run build` there to rebuild it.",
  },
}

if (
  process.argv[1] &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
)
  await build({
    ...buildOptions,
    absWorkingDir: fileURLToPath(new URL(".", import.meta.url)),
    outfile: "../blockbench_workshop.js",
  })
