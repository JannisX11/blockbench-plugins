import { registry, setups, teardowns, CHANNELS } from "../../constants";
import type { Channel, IBbMat } from "../../types";
import PbrMaterial from "../PbrMaterials";

const FORMAT_VERSION = "1.0.0";

setups.push(() => {
  registry.bbmat = new Codec("material", {
    name: "Blockbench Material",
    extension: "bbmat",
    remember: false,
    load_filter: {
      extensions: ["bbmat"],
      type: "json",
    },
    compile(options) {
      if (!Texture.selected?.material || !Texture.selected?.layers_enabled) {
        return;
      }

      const channels = Texture.selected.layers.map((layer: TextureLayer) => {
        const channel = layer.channel;
        const map = layer.canvas.toDataURL();
        return [channel, map];
      });

      const pbrMaterial = new PbrMaterial(
        Texture.selected.layers,
        Texture.selected.uuid
      );

      channels.push(["preview", pbrMaterial.renderMaterialPreview()]);

      return JSON.stringify({
        version: FORMAT_VERSION,
        channels: Object.fromEntries(channels),
      });
    },
    parse(content, path) {
      content = typeof content === "string" ? JSON.parse(content) : content;
      const version = content.version;

      if (version !== FORMAT_VERSION) {
        return {};
      }

      return content.channels as IBbMat["channels"];
    },
    load(content, file, add) {
      if (!Project) {
        return;
      }

      const data = this.parse(
        content,
        file.path
      ) as unknown as IBbMat["channels"];

      const channelKeys = Object.keys(data);

      if (!channelKeys.length) {
        throw new Error("No valid channels found in the material");
      }

      let baseColor =
        data[CHANNELS.albedo.id as Channel] ?? data[channelKeys[0] as Channel];

      if (channelKeys.includes("preview")) {
        baseColor = data["preview"];
      }

      const material = new Texture({
        name: pathToName(file.name),
        saved: true,
        particle: false,
        source: baseColor,
        layers_enabled: true,
      });
      material.extend({ material: true });

      const layers = channelKeys
        .map((channel) => {
          if (!(channel in CHANNELS)) {
            return null;
          }

          const map = data[channel as Channel];
          const layer = new TextureLayer(
            {
              name: channel,
              data_url: map,
              visible: true,
            },
            material
          );

          layer.extend({ channel });

          return layer;
        })
        .filter(Boolean) as TextureLayer[];

      if (!layers.length) {
        throw new Error("No valid channel layers found in the material");
      }

      if (!baseColor) {
        material.fromDataURL(layers[0].canvas.toDataURL());
      }

      material.add().select();

      layers.forEach((layer) => {
        layer.addForEditing();
        material.width = Math.max(material.width, layer.img.width);
        material.height = Math.max(material.height, layer.img.height);
      });
      material.updateChangesAfterEdit();
    },
    export() {
      Blockbench.export(
        {
          resource_id: "material",
          type: this.name,
          extensions: [this.extension],
          name: `${Texture.selected?.name ?? this.fileName ?? "material"}.bbmat`,
          startpath: this.startPath(),
          content: this.compile(),
        },
        (path) => this.afterDownload(path)
      );
    },
  });

  registry.bbMatExport = new Action("export_bbmat", {
    icon: "stacks",
    name: "Save as .bbmat",
    category: "file",
    condition: {
      project: true,
      selected: {
        texture: true,
      },
      method() {
        return Texture.selected?.material;
      },
    },
    click() {
      if (!registry.bbmat?.write || !registry.bbmat?.compile) {
        return;
      }

      //   const content = registry.bbmat.compile();

      //   if (isApp && Project) {
      //     registry.bbmat.write(
      //       content,
      //       Project.save_path.replace(
      //         /\/[^\\\/]\.bbmodel$/i,
      //         `/${Texture.selected.name ?? "material"}.bbmat`
      //       )
      //     );
      //     return;
      //   }

      if (registry.bbmat.export) {
        registry.bbmat.export();
      }
    },
  });

  registry.bbMatImport = new Action("import_bbmat", {
    icon: "stacks",
    name: "Import .bbmat",
    category: "file",
    condition: {
      project: true,
    },
    click() {
      Blockbench.import(
        {
          extensions: ["bbmat"],
          type: "json",
          title: "Import .bbmat",
          multiple: true,
        },
        (files) => {
          if (!registry.bbmat?.load) {
            return;
          }

          files.forEach((file) => {
            registry.bbmat!.load!(file.content, file, true);
          });
        }
      );
    },
  });

  registry.bbmat.export_action = registry.bbMatExport;
  Texture.prototype.menu.addAction(registry.bbMatExport);
  MenuBar.addAction(registry.bbMatImport, "file.import");
});

teardowns.push(() => {
  Texture.prototype.menu.removeAction("export_bbmat");
  MenuBar.removeAction("file.import.import_bbmat");
});
