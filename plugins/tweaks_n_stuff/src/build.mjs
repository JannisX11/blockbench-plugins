import { build } from "esbuild";

const buildOptions = {
  entryPoints: ["./ts"],
  outfile: "../tweaks_n_stuff.js",
  format: "esm",
  bundle: true,
  minify: true,
};

await build({ ...buildOptions });
