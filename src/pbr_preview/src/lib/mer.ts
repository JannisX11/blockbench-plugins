import PbrMaterial from "./PbrMaterials";
import { getSelectedTexture } from "./util";

/**
 * ### Export MER map
 * Generates a MER map from the currently selected texture and exports it as a PNG file
 * @param cb Callback function to run after the MER file is exported
 * @returns void
 */
export const exportMer = (
  baseName?: string,
  cb?: (filePath: string) => void
) => {
  const selected = getSelectedTexture() ?? Texture.getDefault();

  const mer = new PbrMaterial(
    selected.layers_enabled
      ? selected.layers
      : Project
        ? Project.textures
        : null,
    selected.uuid
  ).createMer(true);

  if (!mer) {
    throw new Error("Failed to generate MER map from selected texture.");
  }

  mer.toBlob(async (blob) => {
    if (!blob) {
      throw new Error("Failed to save MER map.");
    }

    const [name, startpath] = Project
      ? [
          baseName
            ? `${baseName}_mer`
            : `${selected.name ?? Project.getDisplayName()}_mer`,
          Project.export_path,
        ]
      : ["mer"];

    Blockbench.export(
      {
        content: await blob.arrayBuffer(),
        type: "PNG",
        name,
        extensions: ["png"],
        resource_id: "mer",
        savetype: "image",
        startpath,
      },
      cb
    );
  });
};
