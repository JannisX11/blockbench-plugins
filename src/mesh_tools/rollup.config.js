import terser from "@rollup/plugin-terser";
import jsonc from "rollup-plugin-jsonc";
import copy from "rollup-plugin-copy";
import globImport from "rollup-plugin-glob-import";
import nodeResolve from "@rollup/plugin-node-resolve";
import aboutPlugin from "./builders/about.plugin.js";
import commonjs from '@rollup/plugin-commonjs';

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
    globImport(),
    jsonc(),
    commonjs({sourceMap: false}),
    nodeResolve(),
    copy({
      targets: [
        { src: 'meta/*', dest: '../../plugins/mesh_tools' }
      ]
    }),
    // terser(),
    aboutPlugin,
  ],
};
