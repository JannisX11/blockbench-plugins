import USDZExporter from "./USDZExporter";

let exportUsdz: Action | null = null;

function getOutputBaseName() {
  if (!Project) {
    // @ts-ignore Blockbench globals
    return pathToName(Texture.selected?.name ?? "texture");
  }

  return Project.model_identifier.length > 0
    ? Project.model_identifier
    : Project.getDisplayName();
}

export function setup() {
  const usdz = new Codec("usdz", {
    extension: "usdz",
    name: "USDZ",
    remember: true,
    fileName() {
      return getOutputBaseName() + ".usdz";
    },
    async compile(compileOptions = {}) {
      if (!Project) {
        throw new Error("No project loaded");
      }
      const options = Object.assign(this.export_options ?? {}, compileOptions);

      const exporter = new USDZExporter();
      const scene = new window.THREE.Scene();

      scene.name = "blockbench_export";
      scene.add(Project.model_3d);

      const result = await exporter.parse(scene);

      this.dispatchEvent("compile", { model: result, options });

      Canvas.scene.add(Project.model_3d);

      return result;
    },
    async export(options = {}) {
      const content = await this.compile(options);
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

  exportUsdz = new Action("export_usdz", {
    category: "file",
    name: "Export USDZ",
    description: "Exports the current model as a USDZ file",
    icon: "stacks",
    async click() {
      if (!usdz) {
        return;
      }

      usdz.export();
    },
  });

  MenuBar.addAction(exportUsdz, "file.export");
}

export function teardown() {
  MenuBar.removeAction("file.export.export_usdz");
  exportUsdz?.delete();
}