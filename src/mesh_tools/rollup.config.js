// import terser from "@rollup/plugin-terser";
import jsonc from "rollup-plugin-jsonc";
import copy from "rollup-plugin-copy";
import globImport from "rollup-plugin-glob-import";

export default {
  input: "src/index.js",
  output: [
    {
      file: "../../plugins/mesh_tools/mesh_tools.js",
      format: "iife",
    },
  ],
  plugins: [
    jsonc(),
    globImport(),
    // terser(),
    copy({
      targets: [{ src: "src/info.md", dest: "../../plugins/mesh_tools" }],
    }),
  ],
};
