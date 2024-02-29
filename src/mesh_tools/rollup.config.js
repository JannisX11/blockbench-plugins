// import terser from "@rollup/plugin-terser";
import jsonc from "rollup-plugin-jsonc";
import copy from "rollup-plugin-copy";
import globImport from "rollup-plugin-glob-import";
import nodeResolve from 'rollup-plugin-node-resolve';

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
    // terser(),
    copy({
      targets: [{ src: "src/about.md", dest: "../../plugins/mesh_tools" }],
    }),
  ],
};
