import { CHANNELS, registry, setups, teardowns } from "../../constants";
import { three as THREE } from "../../deps";
import { getOutputBaseName } from "../util";
import USDZExporter from "../io/UsdzExporter";
import { applyPbrMaterial } from "../applyPbrMaterial";
import PbrMaterial from "../PbrMaterials";
import { createNormalMap } from "../normalMap";

setups.push(() => {
  const usdz = new Codec("usdz", {
    extension: "usdz",
    name: "USDZ",
    remember: true,
    export_options: {
      normal_type: {
        type: "select",
        label: "Normal Map Type",
        default: "opengl",
        options: {
          opengl: "OpenGL",
          directx: "DirectX",
        },
      },
    },
    fileName() {
      return getOutputBaseName() + ".usdz";
    },
    async compile(compileOptions = {}) {
      if (!Project) {
        throw new Error("No project loaded");
      }
      const options = Object.assign(this.getExportOptions(), compileOptions);

      Project.textures.forEach((texture) => {
        if (!texture.material) {
          return;
        }

        const mat = new PbrMaterial(texture.layers, texture.uuid);
        const normal = mat.findTexture("normal", true);

        if (!normal) {
          return;
        }

        const normalMap = createNormalMap(normal, options.normal_type);

        if (normalMap) {
          mat.saveTexture(CHANNELS.normal, normalMap);
        }
      });

      applyPbrMaterial();

      const exporter = new USDZExporter();
      const scene = new THREE.Scene();

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

  registry.exportUsdz = new Action("export_usdz", {
    category: "file",
    name: "Export USDZ",
    description: "Exports the current model as a USDZ file",
    icon: "stacks",
    async click() {
      if (!usdz) {
        return;
      }
      const options = await usdz.promptExportOptions();
      await usdz.export(options);
    },
  });

  registry.usdz = usdz;

  MenuBar.addAction(registry.exportUsdz, "file.export");
});

teardowns.push(() => {
  MenuBar.removeAction("file.export_usdz");
});
