/**
 * ### Generate Normal Map
 * Generates a normal map from a height map texture
 * @param texture Height map texture
 * @param heightInAlpha Whether or not to store the height map in the alpha channel (Used in labPBR shaders for POM)
 * @returns Normal map texture or layer if successful, otherwise `null`
 */
export function createNormalMap(
  texture: Texture | TextureLayer,
  heightInAlpha = false
): Texture | TextureLayer | null {
  const textureCtx = texture.canvas.getContext("2d");

  if (!textureCtx) {
    return null;
  }

  const width = Math.max(
    texture.img.width ?? texture.canvas.width,
    Project ? Project.texture_width : 0,
    16
  );
  const height = Math.max(
    texture.img.height ?? texture.canvas.height,
    Project ? Project.texture_height : 0,
    16
  );

  const { data: textureData } = textureCtx.getImageData(0, 0, width, height);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const getHeight = (x: number, y: number): number => {
    const idx = (x + y * width) * 4;
    return textureData[idx] / 255;
  };

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(texture.img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);

  const data = imageData.data;

  const normalize = (v: number[]): number[] => {
    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / length, v[1] / length, v[2] / length];
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const left = getHeight(Math.max(x - 1, 0), y);
      const right = getHeight(Math.min(x + 1, width - 1), y);
      const top = getHeight(x, Math.max(y - 1, 0));
      const bottom = getHeight(x, Math.min(y + 1, height - 1));

      const dx = right - left;
      const dy = bottom - top;

      const normal = normalize([-dx, -dy, 1]);

      const idx = (y * width + x) * 4;
      data[idx] = ((normal[0] + 1) / 2) * 255;
      data[idx + 1] = ((normal[1] + 1) / 2) * 255;
      data[idx + 2] = ((normal[2] + 1) / 2) * 255;
      data[idx + 3] = heightInAlpha ? getHeight(x, y) * 255 : 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const dataUrl = canvas.toDataURL();

  const name = `${texture.name.replace(/_height(map)?/i, "")}_normal`;

  if (texture instanceof TextureLayer) {
    const normalMapLayer = new TextureLayer(
      {
        name,
        data_url: dataUrl,
        visible: true,
      },
      texture.texture
    );

    normalMapLayer.addForEditing();

    return normalMapLayer;
  }

  const normalMapTexture = new Texture({
    name,
    saved: false,
    particle: false,
  }).fromDataURL(dataUrl);

  if (Project) {
    normalMapTexture.add();
  }

  return normalMapTexture;
}

export function createAoMap(
  texture: Texture | TextureLayer
): Texture | TextureLayer | null {
  const textureCtx = texture.canvas.getContext("2d");

  if (!textureCtx) {
    return null;
  }

  const width = Math.max(
    texture.img.width ?? texture.canvas.width,
    Project ? Project.texture_width : 0,
    16
  );
  const height = Math.max(
    texture.img.height ?? texture.canvas.height,
    Project ? Project.texture_height : 0,
    16
  );

  const { data: textureData } = textureCtx.getImageData(0, 0, width, height);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const getHeight = (x: number, y: number): number => {
    const idx = (x + y * width) * 4;
    return textureData[idx] / 255;
  };

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(texture.img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);

  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const left = getHeight(Math.max(x - 1, 0), y);
      const right = getHeight(Math.min(x + 1, width - 1), y);
      const top = getHeight(x, Math.max(y - 1, 0));
      const bottom = getHeight(x, Math.min(y + 1, height - 1));

      const dx = right - left;
      const dy = bottom - top;

      const ao = Math.sqrt(dx * dx + dy * dy) * 255;

      const idx = (y * width + x) * 4;
      data[idx] = ao;
      data[idx + 1] = ao;
      data[idx + 2] = ao;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const dataUrl = canvas.toDataURL();

  const name = `${texture.name.replace(/_height(map)?/i, "")}_ao`;

  if (texture instanceof TextureLayer) {
    const aoMapLayer = new TextureLayer(
      {
        name,
        data_url: dataUrl,
        visible: true,
      },
      texture.texture
    );

    aoMapLayer.addForEditing();

    return aoMapLayer;
  }

  const aoMapTexture = new Texture({
    name,
    saved: false,
    particle: false,
    keep_size: false,
  }).fromDataURL(dataUrl);

  if (Project) {
    aoMapTexture.add();
  }

  return aoMapTexture;
}
