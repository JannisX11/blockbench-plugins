import { registry, setups, teardowns } from "../../constants";
import { three as THREE } from "../../deps";
import { getOutputBaseName } from "../util";
import USDZExporter from "../io/UsdzExporter";

setups.push(() => {
  const usdz = new Codec("usdz", {
    extension: "usdz",
    name: "USDZ",
    remember: true,
    export_options: {},
    fileName() {
      return getOutputBaseName() + ".usdz";
    },
    async compile(compileOptions = {}) {
      if (!Project) {
        throw new Error("No project loaded");
      }

      const options = Object.assign(this.getExportOptions(), compileOptions);

      const exporter = new USDZExporter();
      const scene = new THREE.Scene();
      scene.name = "blockbench_export";
      scene.add(Project.model_3d);
      const result = await exporter.parse(scene);

      this.dispatchEvent("compile", { model: result, options });

      Canvas.scene.add(Project.model_3d);

      return result;
    },
    async export() {
      const content = await this.compile();
      Blockbench.export(
        {
          content,
          name: this.fileName(),
          startpath: this.startPath(),
          resource_id: "usdz",
          type: this.name,
          extensions: ["usdz"],
          savetype: "buffer",
        },
        (path) => this.afterDownload(path)
      );
    },
  });

  registry.exportUsdz = new Action("export_usdz", {
    category: "file",
    name: "Export USDZ",
    description: "Exports the current model as a USDZ file",
    icon: "file_download",
    async click() {
      if (!usdz) {
        return;
      }
      await usdz.export();
    },
  });

  registry.usdz = usdz;

  MenuBar.addAction(registry.exportUsdz, "file.export");
});

teardowns.push(() => {
  MenuBar.removeAction("file.export_usdz");
});
