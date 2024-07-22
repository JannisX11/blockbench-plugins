import type { ILightrParams } from "../types";
import { CHANNELS } from "../constants";
import PbrMaterial from "./PbrMaterials";
import { Lightr } from "./Lightr";

export const bakeTextures = (
  params: ILightrParams,
  directions = 8,
  blendEmissive = false,
) => {
  if (!Project) {
    return;
  }

  const selected = Project.selected_texture ?? Texture.getDefault();

  const mat = new PbrMaterial(
    selected.layers_enabled ? selected.layers : Project.textures,
    selected.uuid,
  );

  const texture = mat.findTexture(CHANNELS.albedo);

  if (!texture) {
    Blockbench.showStatusMessage(
      "Can not bake without a base color assigned.",
      3000,
    );
    return;
  }

  let normalMap = mat.findTexture(CHANNELS.normal);

  // TODO: Generate normal map automatically when needed and possible
  //   const heightmap = mat.findTexture(CHANNELS.height);
  //   if (!normalMap && heightmap) {
  //     normalMap = PbrMaterial.createNormalMap(heightmap, false);
  //   }

  if (!normalMap) {
    Blockbench.showStatusMessage(
      "Can not bake without a normal map assigned.",
      3000,
    );
    return;
  }

  const lightr = new Lightr(params);
  const bakedImages = lightr.bake(directions, texture.canvas, normalMap.canvas);

  const bakedTexture = new Texture({
    name: `${texture.name}_baked`,
    saved: false,
    particle: false,
    keep_size: false,
    // @ts-expect-error Layers enabled can be set here
    layers_enabled: true,
  }).fromDataURL(bakedImages[0].toDataURL());

  const addEmissive = blendEmissive
    ? (canvas: HTMLCanvasElement) => {
        const emissive = mat.findTexture(CHANNELS.emissive);

        if (!emissive) {
          return canvas;
        }

        const emissiveCanvas = emissive.canvas;
        const emissiveCtx = emissiveCanvas.getContext("2d");

        if (!emissiveCtx) {
          return canvas;
        }

        const width = Math.max(
          canvas.width,
          emissiveCanvas.width,
          Project ? Project.texture_width : 16,
        );
        const height = Math.max(
          canvas.height,
          emissiveCanvas.height,
          Project ? Project.texture_height : 16,
        );

        const mergedCanvas = document.createElement("canvas");
        mergedCanvas.width = width;
        mergedCanvas.height = height;

        const mergedCtx = mergedCanvas.getContext("2d");

        if (!mergedCtx) {
          return canvas;
        }

        mergedCtx.drawImage(canvas, 0, 0);
        mergedCtx.globalCompositeOperation = "screen";
        mergedCtx.drawImage(emissiveCanvas, 0, 0);

        return mergedCanvas;
      }
    : (canvas: HTMLCanvasElement) => canvas;

  bakedImages.forEach((image, idx) => {
    const layer = new TextureLayer(
      {
        name: `baked_${idx + 1}`,
        data_url: addEmissive(image).toDataURL(),
      },
      bakedTexture,
    );

    layer.addForEditing();
  });

  bakedTexture.add().select();

  Blockbench.showQuickMessage("Textures baked 🥐", 2000);
};
