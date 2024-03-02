// import terser from "@rollup/plugin-terser";
import jsonc from "rollup-plugin-jsonc";
import globImport from "rollup-plugin-glob-import";
import nodeResolve from "rollup-plugin-node-resolve";
import aboutPlugin from "./builders/about.plugin.js";

/**
 * @type {import("rollup").RollupOptions}
 */
export default {
  input: "src/index.js",
  output: [
    {
      file: "../../plugins/mesh_tools/mesh_tools.js",
      format: "iife",
    },
  ],
  plugins: [
    nodeResolve(),
    jsonc(),
    globImport(),
    aboutPlugin,
  ],
};
