import { CHANNELS, registry, setups, teardowns } from "../../constants";
import { exportMer } from "../mer";
import PbrMaterial from "../PbrMaterials";
import { getOutputBaseName } from "../util";

const createTextureSetDialog = () => {
  if (!Project) {
    return;
  }
  Project.textures.forEach((t) => {
    const mat = new PbrMaterial(null, t.uuid);

    const projectNormalMap = mat.findTexture(CHANNELS.normal, false);
    const projectHeightMap = mat.findTexture(CHANNELS.height, false);
    const projectColorMap = mat.findTexture(CHANNELS.albedo, false);
    const projectMetalnessMap = mat.findTexture(
      CHANNELS.metalness,
      false
    )?.name;
    const projectEmissiveMap = mat.findTexture(CHANNELS.emissive, false)?.name;
    const projectRoughnessMap = mat.findTexture(
      CHANNELS.roughness,
      false
    )?.name;

    const form: DialogOptions["form"] = {};

    if (!projectColorMap) {
      form.baseColor = {
        type: "color",
        label: "Base Color",
        value: "#ff00ff",
      };
    }

    if (!projectMetalnessMap && !projectEmissiveMap && !projectRoughnessMap) {
      form.metalness = {
        label: "Metalness",
        type: "range",
        min: 0,
        max: 255,
        step: 1,
        value: 0,
      };

      form.emissive = {
        label: "Emissive",
        type: "range",
        min: 0,
        max: 255,
        step: 1,
        value: 0,
      };

      form.roughness = {
        label: "Roughness",
        type: "range",
        min: 0,
        max: 255,
        step: 1,
        value: 0,
      };
    }

    if (projectNormalMap) {
      form.depthMap = {
        type: "checkbox",
        label: "Normal Map",
        value: "normal",
      };
    }

    if (projectHeightMap) {
      form.depthMap = {
        type: "checkbox",
        label: "Height Map",
        value: "heightmap",
      };
    }

    if (projectNormalMap && projectHeightMap) {
      form.depthMap = {
        type: "radio",
        label: "Depth Map",
        options: {
          normal: "Normal Map",
          heightmap: "Height",
        },
        value: "normal",
      };
    }

    registry.textureSetDialog = new Dialog("texture_set", {
      id: "texture_set",
      title: "Create Texture Set JSON",
      buttons: ["Create", "Cancel"],
      form,
      cancelIndex: 1,
      onConfirm(formResult: Record<string, any>) {
        const baseName = getOutputBaseName();

        const hasMer =
          projectMetalnessMap || projectEmissiveMap || projectRoughnessMap;

        const textureSet: {
          format_version: string;
          "minecraft:texture_set": {
            color: string;
            metalness_emissive_roughness: [number, number, number];
            normal?: string;
            heightmap?: string;
          };
        } = {
          format_version: "1.16.100",
          "minecraft:texture_set": {
            color:
              (projectColorMap
                ? baseName // pathToName(projectColorMap.name, false)
                : formResult.baseColor?.toHexString()) ?? baseName,
            metalness_emissive_roughness: [
              formResult.metalness ?? 0,
              formResult.emissive ?? 0,
              formResult.roughness ?? 255,
            ],
          },
        };

        if (
          (formResult.depthMap === "normal" && projectNormalMap) ||
          (!projectHeightMap && projectNormalMap)
        ) {
          textureSet["minecraft:texture_set"].normal = `${baseName}_normal`;
        } else if (
          (!projectNormalMap || formResult.depthMap === "heightmap") &&
          projectHeightMap
        ) {
          textureSet["minecraft:texture_set"].heightmap =
            `${baseName}_heightmap`;
        }

        const exportDepthMap = (cb: () => void) => {
          if (!formResult.depthMap) {
            return cb();
          }

          const useNormalMap =
            formResult.depthMap === "normal" ||
            (formResult.depthMap && !projectHeightMap);

          const depthMap = useNormalMap ? projectNormalMap : projectHeightMap;

          if (!depthMap) {
            return cb();
          }

          Blockbench.export(
            {
              content: depthMap.canvas.toDataURL() ?? "",
              type: "PNG",
              name: `${baseName}_${useNormalMap ? "normal" : "heightmap"}`,
              extensions: ["png"],
              resource_id: formResult.depthMap,
              startpath: Project.export_path,
              savetype: "image",
            },
            (filePath) => {
              textureSet["minecraft:texture_set"][
                useNormalMap ? "normal" : "heightmap"
              ] = pathToName(filePath, false);
              cb();
            }
          );
        };

        const exportBaseColor = (cb: () => void) => {
          if (!projectColorMap) {
            return cb();
          }

          Blockbench.export(
            {
              content: projectColorMap.canvas.toDataURL(),
              extensions: ["png"],
              type: "PNG",
              name: baseName,
              startpath: Project.export_path,
              savetype: "image",
            },
            (filePath) => {
              textureSet["minecraft:texture_set"].color = pathToName(
                filePath,
                false
              );
              cb();
            }
          );
        };

        const exportTextureSet = () =>
          exportDepthMap(() => {
            exportBaseColor(() => {
              Blockbench.export(
                {
                  content: JSON.stringify(textureSet, null, 2),
                  type: "JSON",
                  name: `${baseName}.texture_set`,
                  extensions: ["json"],
                  resource_id: "texture_set",
                  startpath: Project.export_path,
                  savetype: "text",
                },
                () => {
                  Blockbench.showQuickMessage("Texture set created", 2000);
                  registry.textureSetDialog?.hide();
                }
              );
            });
          });

        if (hasMer) {
          try {
            exportMer(baseName, (filePath) => {
              textureSet["minecraft:texture_set"].metalness_emissive_roughness =
                pathToName(filePath, false);
              exportTextureSet();
            });
          } catch (err) {
            console.warn("Failed to export MER map:", err);
            Blockbench.showStatusMessage("Failed to export MER map", 3000);
          }
          return;
        }

        exportTextureSet();
      },
    });

    return registry.textureSetDialog.show();
  });
};

setups.push(() => {
  registry.createTextureSet = new Action("create_texture_set", {
    name: "Create Texture Set",
    icon: "layers",
    description:
      "Creates a texture set JSON file. Generates a MER when metalness, emissive, or roughness channels are set.",
    click() {
      createTextureSetDialog();
    },
    condition: {
      formats: ["bedrock", "bedrock_block"],
      project: true,
    },
  });

  MenuBar.addAction(registry.createTextureSet, "file.export");
});

teardowns.push(() => {
  MenuBar.removeAction(`file.export.create_texture_set`);
});
