import * as esbuild from "esbuild";
import { copy } from 'esbuild-plugin-copy';
import FastGlob from "fast-glob";
import fs from "fs/promises";
import * as jsonc from "jsonc-parser";
import path from "path";
import { aboutPlugin } from "./plugins/about.plugin.js";

const watch = process.argv.includes("--watch");
const sourcemap = process.argv.includes("--sourcemap");

const context = await esbuild.context({
  entryPoints: ["src/index.js"],
  outfile: "../../plugins/mesh_tools/mesh_tools.js",
  bundle: true,
  minify: true,
  sourcemap,
  format: "iife",
  loader: {
    ".js": "js",
    ".ts": "ts",
  },
  external: ["three"],
  alias: {
    three: "./src/shims/three.shim.ts",
  },
  logLevel: "info",
  plugins: [
    copy({
      assets: {
        from: ["./meta/*"],
        to: ["../../plugins/mesh_tools"],
      },
      watch: true,
    }),
    aboutPlugin({ actionsPath: "assets/actions.json" }),
    jsoncPlugin(),
    globImportPlugin(),
  ],
});

if (watch) {
  await context.watch();
} else {
  await context.rebuild();
  await context.dispose();
}

/**
 *
 * @returns {import("esbuild").Plugin}
 */
function globImportPlugin() {
  // from esbuild-plugin-import-glob (modified)
  return {
    name: "glob-import",
    setup: (build) => {
      build.onResolve({ filter: /\*/ }, async (args) => {
        if (args.resolveDir === "") {
          return;
        }

        return {
          path: path.join(args.resolveDir, args.path),
          namespace: "glob-import",
          pluginData: {
            path: args.path,
            resolveDir: args.resolveDir,
          },
        };
      });
      build.onLoad({ filter: /.*/, namespace: "glob-import" }, async (args) => {
        const files = (
          await FastGlob(args.pluginData.path, {
            cwd: args.pluginData.resolveDir,
          })
        ).sort();

        const importerCode = `
			${files
        .map((module, index) => `import * as module${index} from './${module}'`)
        .join(";")}
	
			const modules = {
      ${files
        .map((module, index) => `[${JSON.stringify(module)}]: module${index}`)
        .join(",")}
      };
	
			export default modules;
		  `;

        return {
          contents: importerCode,
          resolveDir: args.pluginData.resolveDir,
        };
      });
    },
  };
}

/**
 *
 * @returns {import("esbuild").Plugin}
 */
function jsoncPlugin() {
  return {
    name: "jsonc",
    setup(build) {
      build.onLoad({ filter: /\.jsonc$/ }, async (args) => {
        const content = await fs.readFile(args.path, "utf8");
        const parsed = jsonc.parse(content);
        return {
          contents: JSON.stringify(parsed),
          loader: "json",
        };
      });
    },
  };
}
