import { build } from "esbuild";

const buildOptions = {
  entryPoints: ["./ts"],
  outfile: "../../plugins/tweaks_n_stuff/tweaks_n_stuff.js",
  format: "esm",
  bundle: true,
  minify: true,
};

await build({ ...buildOptions });
