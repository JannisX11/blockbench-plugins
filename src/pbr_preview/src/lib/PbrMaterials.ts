import type { IChannel } from "../types";
import { CHANNELS, NA_CHANNEL } from "../constants";
import { three as THREE } from "../deps";

const getProjectTextures = (layers = true) => {
  const allTextures = Project ? Project.textures ?? Texture.all : Texture.all;

  if (!layers) {
    return allTextures;
  }

  return allTextures
    .filter((t: Texture) => t.layers_enabled && t.layers.length > 0)
    .flatMap((t: Texture) => t.layers);
};

/**
 * ### PBR Material
 * Class for handling PBR materials in Blockbench
 *
 * Uses a texture's layers to generate a PBR material,
 * or a project's textures if no layers are available.
 */
export default class PbrMaterial {
  private _scope: Array<Texture | TextureLayer>;
  private _materialUuid: string;

  constructor(
    scope: Array<Texture | TextureLayer> | null,
    materialUuid: string
  ) {
    this._scope = scope ?? getProjectTextures();
    this._materialUuid = materialUuid;
  }

  merToCanvas() {
    let emissiveMap = this.getTexture(CHANNELS.emissive);
    let roughnessMap = this.getTexture(CHANNELS.roughness);
    let metalnessMap = this.getTexture(CHANNELS.metalness);

    if (!emissiveMap && !roughnessMap && !metalnessMap) {
      const { metalness, emissive, roughness } = this.decodeMer();

      if (metalness) {
        metalnessMap = PbrMaterial.makePixelatedCanvas(metalness);
      }

      if (emissive) {
        emissiveMap = PbrMaterial.makePixelatedCanvas(emissive);
      }

      if (roughness) {
        roughnessMap = PbrMaterial.makePixelatedCanvas(roughness);
      }
    }

    return {
      emissiveMap,
      roughnessMap,
      metalnessMap,
    };
  }

  getMaterial(options: THREE.MeshStandardMaterialParameters = {}) {
    // TODO: Don't lookup MER in Java projects
    const { emissiveMap, roughnessMap, metalnessMap } = this.merToCanvas();

    const normalMap = this.getTexture(CHANNELS.normal);

    return new THREE.MeshStandardMaterial({
      map:
        this.getTexture(CHANNELS.albedo) ??
        PbrMaterial.makePixelatedCanvas(
          TextureLayer.selected?.canvas ??
            Texture.all.find((t) => t.selected)?.canvas ??
            Texture.getDefault().canvas
        ),
      aoMap: this.getTexture(CHANNELS.ao),
      bumpMap: this.getTexture(CHANNELS.height),
      normalMap,
      normalScale: new THREE.Vector2(1, 1),
      metalnessMap,
      metalness: metalnessMap ? 1 : 0,
      roughnessMap,
      roughness: 1,
      emissiveMap,
      emissiveIntensity: emissiveMap ? 1 : 0,
      emissive: emissiveMap ? 0xffffff : 0,
      envMap: PreviewScene.active?.cubemap ?? null,
      envMapIntensity: 0.95,
      alphaTest: 0.1,
      transparent: true,
      ...options,
    });
  }

  saveTexture(channel: IChannel, texture: Texture | TextureLayer) {
    if (!Project) {
      return;
    }

    if (!Project.pbr_materials) {
      Project.pbr_materials = {};
    }

    if (!Project.pbr_materials[this._materialUuid]) {
      Project.pbr_materials[this._materialUuid] = {};
    }

    Project.pbr_materials[this._materialUuid][channel.id] = texture.uuid;
    texture.extend({ channel: channel.id });
  }

  /**
   * ### Find channel texture
   * @param name Channel to find
   * @param inference Whether or not to infer the texture based on the channel name
   * @returns The channel if it exists in the project, otherwise `null`
   */
  findTexture(
    name: string | IChannel,
    inference = true
  ): Texture | TextureLayer | null {
    if (!Project) {
      return null;
    }

    const materialChannel = this._scope.find(
      (t) => t.channel && (t.channel === name || t.channel === name.id)
    );

    if (materialChannel) {
      return materialChannel;
    }

    const channel = typeof name === "string" ? name : name.id;

    Project.pbr_materials ??= {};
    const materialData = Project.pbr_materials[this._materialUuid];

    // Don't infer the channel if it has already been assigned to NA_CHANNEL
    if (!materialData && inference && channel !== NA_CHANNEL) {
      const filenameRegex = new RegExp(`_*${channel}(\.[^.]+)?$`, "i");
      return this._scope.find((t) => filenameRegex.test(t.name)) ?? null;
    }

    const textureUuid = materialData?.[channel];

    if (!textureUuid) {
      return null;
    }

    return this._scope.find((t) => t.uuid === textureUuid) ?? null;
  }

  /**
   * Helper function to create a canvas texture with pixelated filtering
   * @param canvas Texture canvas source
   * @returns `THREE.CanvasTexture` with pixelated filtering
   */
  static makePixelatedCanvas(canvas: HTMLCanvasElement) {
    const texture = new THREE.CanvasTexture(
      canvas,
      undefined,
      undefined,
      undefined,
      THREE.NearestFilter,
      THREE.NearestFilter
    );

    texture.needsUpdate = true;

    return texture;
  }

  /**
   * Searches for a texture and creates a canvas element with the texture data if found
   * @param name The name of the texture to search for. Use a channel or a texture name or UUID
   * @param scope An array of textures to search in. Defaults to all textures in the project
   */
  getTexture(name: string | IChannel) {
    const texture = this.findTexture(name);
    return texture ? PbrMaterial.makePixelatedCanvas(texture.canvas) : null;
  }

  static extractChannel(
    texture: Texture | TextureLayer,
    channel: "r" | "g" | "b" | "a"
  ) {
    const canvas = texture.canvas;
    const width = canvas.width;
    const height = canvas.height;

    const ctx = canvas.getContext("2d");

    if (!ctx || !width || !height) {
      return null;
    }

    const channelCanvas = document.createElement("canvas");
    channelCanvas.width = width;
    channelCanvas.height = height;

    const channelCtx = channelCanvas.getContext("2d");

    if (!channelCtx) {
      return null;
    }

    const channelIdx = { r: 0, g: 1, b: 2, a: 3 }[channel];

    const { data } = ctx.getImageData(0, 0, width, height);

    const channelData = new Uint8ClampedArray(width * height * 4);

    for (let idx = 0; idx < data.length; idx += 4) {
      channelData[idx] = data[idx + channelIdx];
      channelData[idx + 1] = data[idx + channelIdx];
      channelData[idx + 2] = data[idx + channelIdx];
      channelData[idx + 3] = 255;
    }

    const imageData = new ImageData(channelData, width, height);

    channelCtx.putImageData(imageData, 0, 0);

    return channelCanvas;
  }

  decodeMer(emissiveThreshold = 1): {
    metalness?: HTMLCanvasElement | null;
    emissive?: HTMLCanvasElement | null;
    emissiveLevel?: HTMLCanvasElement | null;
    roughness?: HTMLCanvasElement | null;
    sss?: HTMLCanvasElement | null;
  } {
    const texture = this.findTexture("mer", true);

    if (!texture) {
      return {
        metalness: null,
        emissive: null,
        emissiveLevel: null,
        roughness: null,
        sss: null,
      };
    }

    const metalness = PbrMaterial.extractChannel(texture, "r");
    const emissiveLevel = PbrMaterial.extractChannel(texture, "g");
    const roughness = PbrMaterial.extractChannel(texture, "b");
    const sss = PbrMaterial.extractChannel(texture, "a");

    const emissive = document.createElement("canvas");
    emissive.width = texture.img.width ?? 16;
    emissive.height = texture.img.height ?? 16;

    // Use emissiveLevel as mask for getting emissive color from albedo channel
    const albedo = this.findTexture(CHANNELS.albedo);

    if (albedo) {
      emissive.width = albedo.img.width ?? 16;
      emissive.height = albedo.img.height ?? 16;
    }

    const emissiveCtx = emissive.getContext("2d");
    const emissiveLevelCtx = emissiveLevel?.getContext("2d");
    const albedoCtx = albedo?.canvas?.getContext("2d");

    if (!emissiveCtx || !albedoCtx || !emissiveLevelCtx) {
      return {
        metalness,
        emissive: emissiveLevel,
        roughness,
        sss,
      };
    }

    // Write the albedo color to the emissive canvas where the emissive level is greater than a certain threshold
    const albedoData = albedoCtx.getImageData(
      0,
      0,
      emissive.width,
      emissive.height
    );
    const emissiveLevelData = emissiveLevelCtx.getImageData(
      0,
      0,
      emissive.width,
      emissive.height
    );

    const emissiveData = new Uint8ClampedArray(
      emissive.width * emissive.height * 4
    );

    for (let idx = 0; idx < albedoData.data.length; idx += 4) {
      if (emissiveLevelData.data[idx] > emissiveThreshold) {
        emissiveData[idx] = albedoData.data[idx];
        emissiveData[idx + 1] = albedoData.data[idx + 1];
        emissiveData[idx + 2] = albedoData.data[idx + 2];
        emissiveData[idx + 3] = 255;
        continue;
      }

      emissiveData[idx] = 0;
      emissiveData[idx + 1] = 0;
      emissiveData[idx + 2] = 0;
      emissiveData[idx + 3] = 255;
    }

    emissiveCtx.putImageData(
      new ImageData(emissiveData, emissive.width, emissive.height),
      0,
      0
    );

    return {
      metalness,
      emissive,
      emissiveLevel,
      roughness,
      sss,
    };
  }

  createMer(inference = false) {
    const metalness = this.findTexture(CHANNELS.metalness, inference);
    const emissive = this.findTexture(CHANNELS.emissive, inference);
    const roughness = this.findTexture(CHANNELS.roughness, inference);
    const sss = this.findTexture("sss", false);

    const width = Math.max(
      metalness?.img.width ?? 0,
      emissive?.img.width ?? 0,
      roughness?.img.width ?? 0,
      Project ? Project.texture_width : 0,
      16
    );

    const height = Math.max(
      metalness?.img.height ?? 0,
      emissive?.img.height ?? 0,
      roughness?.img.height ?? 0,
      Project ? Project.texture_height : 0,
      16
    );

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    const metalnessCanvas = metalness?.img
      ? PbrMaterial.extractChannel(metalness, "r")
      : null;
    const emissiveCanvas = emissive?.img
      ? PbrMaterial.extractChannel(emissive, "g")
      : null;
    const roughnessCanvas = roughness?.img
      ? PbrMaterial.extractChannel(roughness, "b")
      : null;
    const sssCanvas =
      sss && sss?.img ? PbrMaterial.extractChannel(sss, "a") : null;

    const metalnessData =
      metalnessCanvas?.getContext("2d")?.getImageData(0, 0, width, height) ??
      new ImageData(width, height);
    const emissiveData =
      emissiveCanvas?.getContext("2d")?.getImageData(0, 0, width, height) ??
      new ImageData(width, height);
    const roughnessData =
      roughnessCanvas?.getContext("2d")?.getImageData(0, 0, width, height) ??
      new ImageData(width, height);
    const sssData =
      sssCanvas?.getContext("2d")?.getImageData(0, 0, width, height) ??
      new ImageData(
        new Uint8ClampedArray(width * height * 4).fill(255),
        width,
        height
      );

    const data = new Uint8ClampedArray(width * height * 4);

    for (let idx = 0; idx < data.length; idx += 4) {
      data[idx] = metalnessData.data[idx];
      data[idx + 1] = emissiveData.data[idx];
      data[idx + 2] = roughnessData.data[idx];
      data[idx + 3] = sssData.data[idx];
    }

    ctx.putImageData(new ImageData(data, width, height), 0, 0);

    return canvas;
  }

  createLabPbrOutput(inference = true) {
    const metalness = this.findTexture(CHANNELS.metalness, inference);
    const emissive = this.findTexture(CHANNELS.emissive, inference);
    const roughness = this.findTexture(CHANNELS.roughness, inference);
    const normal = this.findTexture(CHANNELS.normal, inference);
    const heightmap = this.findTexture(CHANNELS.height, inference);
    const ao = this.findTexture(CHANNELS.ao, false);
    const sss = this.findTexture("sss", true);
    const porosity = this.findTexture("porosity", true);

    const width = Math.max(
      metalness?.img.width ?? 0,
      emissive?.img.width ?? 0,
      roughness?.img.width ?? 0,
      Project ? Project.texture_width : 0,
      16
    );

    const height = Math.max(
      metalness?.img.height ?? 0,
      emissive?.img.height ?? 0,
      roughness?.img.height ?? 0,
      Project ? Project.texture_height : 0,
      16
    );

    const specularCanvas = document.createElement("canvas");
    specularCanvas.width = width;
    specularCanvas.height = height;

    const specularCtx = specularCanvas.getContext("2d");

    const normalMapCanvas = document.createElement("canvas");
    normalMapCanvas.width = width;
    normalMapCanvas.height = height;

    const normalMapCtx = normalMapCanvas.getContext("2d");

    if (!specularCtx || !normalMapCtx) {
      return null;
    }

    const specularData = new Uint8ClampedArray(width * height * 4);
    const normalData = new Uint8ClampedArray(width * height * 4);

    // Specular texture output "_s"
    // Red channel: Convert linear roughness to perceptual smoothness with: perceptualSmoothness = 1.0 - sqrt(roughness).
    // Green channel: Values from 0 to 229 represent F0. Stored linearly. Values from 230 to 255 represent various different metals.
    // Blue channel: Values from 0 to 64 represent porosity. Values from 65 to 255 represent subsurface scattering. Both porosity and subsurface scattering are stored linearly.
    // Alpha channel: It can have values ranging from 0 to 254; 0 being 0% emissiveness and 254 being 100%. Stored linearly.
    const metalnessCanvas = metalness?.canvas;
    const emissiveCanvas = emissive?.canvas;
    const roughnessCanvas = roughness?.canvas;
    const sssCanvas = sss?.canvas;
    const porosityCanvas = porosity?.canvas;

    const metalnessCtx = metalnessCanvas?.getContext("2d");
    const emissiveCtx = emissiveCanvas?.getContext("2d");
    const roughnessCtx = roughnessCanvas?.getContext("2d");
    const sssCtx = sssCanvas?.getContext("2d");
    const porosityCtx = porosityCanvas?.getContext("2d");

    const metalnessData = metalnessCtx?.getImageData(0, 0, width, height);
    const emissiveData = emissiveCtx?.getImageData(0, 0, width, height);
    const roughnessData = roughnessCtx?.getImageData(0, 0, width, height);
    const sssData = sssCtx?.getImageData(0, 0, width, height);
    const porosityData = porosityCtx?.getImageData(0, 0, width, height);

    for (let idx = 0; idx < specularData.length; idx += 4) {
      const smoothness = roughnessData
        ? 1.0 - Math.sqrt(roughnessData.data[idx] / 255)
        : 0;
      //   const f0 = Math.min(229, Math.max(0, Math.round(smoothness * 229)));

      // Convert metalness to F0
      const f0 = Math.min(
        229,
        Math.max(0, Math.round((metalnessData?.data[idx] ?? smoothness) * 229))
      );

      const porosity = porosityData?.data[idx];
      const sss = sssData?.data[idx];

      specularData[idx] = smoothness * 255;
      specularData[idx + 1] = f0;

      // Merge porosity and sss in blue channel because they are mutually exclusive
      specularData[idx + 2] = sss ?? porosity ?? 0;

      // Add emissive to alpha
      // But first convert emissive channel from color to grayscale

      if (!emissiveData) {
        specularData[idx + 3] = 255;
        continue;
      }

      const emissiveLevel = Math.round(
        (emissiveData?.data[idx] +
          emissiveData?.data[idx + 1] +
          emissiveData?.data[idx + 2]) /
          3
      );

      specularData[idx + 3] = emissiveLevel || 255;
    }

    specularCtx.putImageData(new ImageData(specularData, width, height), 0, 0);

    // Normal map output "_n"
    // AO is stored in blue channel
    // Height map is stored in alpha channel
    const normalCanvas = normal?.canvas;
    const aoCanvas = ao?.canvas;
    const heightmapCanvas = heightmap?.canvas;

    const normalCtx = normalCanvas?.getContext("2d");
    const aoCtx = aoCanvas?.getContext("2d");
    const heightmapCtx = heightmapCanvas?.getContext("2d");

    const normalMapData = normalCtx?.getImageData(0, 0, width, height);
    const aoData = aoCtx?.getImageData(0, 0, width, height);
    const heightmapData = heightmapCtx?.getImageData(0, 0, width, height);

    for (let idx = 0; idx < normalData.length; idx += 4) {
      normalData[idx] = normalMapData?.data[idx] ?? 0;
      normalData[idx + 1] = normalMapData?.data[idx + 1] ?? 0;
      normalData[idx + 2] = aoData?.data[idx + 2] ?? 255;
      normalData[idx + 3] = heightmapData?.data[idx + 3] || 255;
    }

    normalMapCtx.putImageData(new ImageData(normalData, width, height), 0, 0);

    return {
      specular: specularCanvas,
      normalMap: normalMapCanvas,
    };
  }

  decodeLabPbrNormal(texture: Texture | TextureLayer): {
    ao?: HTMLCanvasElement | null;
    normal?: HTMLCanvasElement | null;
    heightmap?: HTMLCanvasElement | null;
  } {
    const width = texture.img.width ?? 16;
    const height = texture.img.height ?? 16;

    const ctx = texture.canvas.getContext("2d");

    if (!ctx) {
      return {};
    }

    const aoCanvas = document.createElement("canvas");
    aoCanvas.width = width;
    aoCanvas.height = height;

    const normalCanvas = document.createElement("canvas");
    normalCanvas.width = width;
    normalCanvas.height = height;

    const heightmapCanvas = document.createElement("canvas");
    heightmapCanvas.width = width;
    heightmapCanvas.height = height;

    const aoCtx = aoCanvas.getContext("2d");
    const normalCtx = normalCanvas.getContext("2d");
    const heightmapCtx = heightmapCanvas.getContext("2d");

    const { data } = ctx.getImageData(0, 0, width, height);

    if (!data || !aoCtx || !normalCtx || !heightmapCtx) {
      return {};
    }

    const aoData = new Uint8ClampedArray(width * height * 4);
    const normalData = new Uint8ClampedArray(width * height * 4);
    const heightmapData = new Uint8ClampedArray(width * height * 4);

    for (let r = 0; r < data.length; r += 4) {
      const g = r + 1;
      const b = r + 2;
      const a = r + 3;

      aoData[r] = data[b];
      aoData[g] = data[b];
      aoData[b] = data[b];
      aoData[a] = 255;

      normalData[r] = data[r];
      normalData[g] = data[g];
      normalData[b] = 255;
      normalData[a] = 255;

      heightmapData[r] = data[a];
      heightmapData[g] = data[a];
      heightmapData[b] = data[a];
      heightmapData[a] = 255;
    }

    aoCtx.putImageData(new ImageData(aoData, width, height), 0, 0);
    normalCtx.putImageData(new ImageData(normalData, width, height), 0, 0);
    heightmapCtx.putImageData(
      new ImageData(heightmapData, width, height),
      0,
      0
    );

    return {
      ao: aoCanvas,
      normal: normalCanvas,
      heightmap: heightmapCanvas,
    };
  }

  decodeLabPbrSpecular(texture: Texture | TextureLayer): {
    metalness?: HTMLCanvasElement | null;
    emissive?: HTMLCanvasElement | null;
    roughness?: HTMLCanvasElement | null;
    sss?: HTMLCanvasElement | null;
    porosity?: HTMLCanvasElement | null;
  } {
    const width = texture.img.width ?? 16;
    const height = texture.img.height ?? 16;

    const ctx = texture.canvas.getContext("2d");

    if (!ctx) {
      return {};
    }
    const metalnessCanvas = document.createElement("canvas");
    metalnessCanvas.width = width;
    metalnessCanvas.height = height;

    const emissiveCanvas = document.createElement("canvas");
    emissiveCanvas.width = width;
    emissiveCanvas.height = height;

    const roughnessCanvas = document.createElement("canvas");
    roughnessCanvas.width = width;
    roughnessCanvas.height = height;

    const sssCanvas = document.createElement("canvas");
    sssCanvas.width = width;
    sssCanvas.height = height;

    const porosityCanvas = document.createElement("canvas");
    porosityCanvas.width = width;
    porosityCanvas.height = height;

    const metalnessCtx = metalnessCanvas.getContext("2d");
    const emissiveCtx = emissiveCanvas.getContext("2d");
    const roughnessCtx = roughnessCanvas.getContext("2d");
    const sssCtx = sssCanvas.getContext("2d");
    const porosityCtx = porosityCanvas.getContext("2d");

    const { data } = ctx.getImageData(0, 0, width, height);

    if (
      !data ||
      !metalnessCtx ||
      !emissiveCtx ||
      !roughnessCtx ||
      !sssCtx ||
      !porosityCtx
    ) {
      return {};
    }

    const metalnessData = new Uint8ClampedArray(width * height * 4);
    const emissiveData = new Uint8ClampedArray(width * height * 4);
    const roughnessData = new Uint8ClampedArray(width * height * 4);
    const sssData = new Uint8ClampedArray(width * height * 4);
    const porosityData = new Uint8ClampedArray(width * height * 4);

    for (let r = 0; r < data.length; r += 4) {
      // Roughness is inverted smoothness in red channel
      // Metalness is F0 in green channel
      // SSS and porosity are stored in blue channel linearly
      // Emissive is stored in alpha channel linearly

      const g = r + 1;
      const b = r + 2;
      const a = r + 3;

      roughnessData[r] = 255 - data[r];
      roughnessData[g] = 255 - data[r];
      roughnessData[b] = 255 - data[r];
      roughnessData[a] = 255;

      metalnessData[r] = data[g];
      metalnessData[g] = data[g];
      metalnessData[b] = data[g];
      metalnessData[a] = 255;

      emissiveData[r] = data[a];
      emissiveData[g] = data[a];
      emissiveData[b] = data[a];
      emissiveData[a] = 255;

      sssData[r] = 0;
      sssData[g] = 0;
      sssData[b] = 0;
      sssData[a] = 255;

      porosityData[r] = data[b];
      porosityData[g] = data[b];
      porosityData[b] = data[b];
      porosityData[a] = 255;

      if (data[b] < 65) {
        sssData[r] = data[b];
        sssData[g] = data[b];
        sssData[b] = data[b];
        sssData[a] = 255;

        porosityData[r] = 0;
        porosityData[g] = 0;
        porosityData[b] = 0;
        porosityData[a] = 255;
      }
    }

    metalnessCtx.putImageData(
      new ImageData(metalnessData, width, height),
      0,
      0
    );

    emissiveCtx.putImageData(new ImageData(emissiveData, width, height), 0, 0);

    roughnessCtx.putImageData(
      new ImageData(roughnessData, width, height),
      0,
      0
    );

    sssCtx.putImageData(new ImageData(sssData, width, height), 0, 0);

    porosityCtx.putImageData(new ImageData(porosityData, width, height), 0, 0);

    return {
      metalness: metalnessCanvas,
      emissive: emissiveCanvas,
      roughness: roughnessCanvas,
      sss: sssCanvas,
      porosity: porosityCanvas,
    };
  }

  createTexturesFromSpecular(texture: Texture | TextureLayer) {
    const maps = this.decodeLabPbrSpecular(texture);

    Object.entries(maps).forEach(([name, map]) => {
      if (map) {
        const textureMap = new Texture({
          name: `${texture.name}_${name}`,
          saved: false,
          particle: false,
          keep_size: false,
        }).fromDataURL(map.toDataURL());

        textureMap.add();
      }
    });

    return maps;
  }

  createTexturesFromNormal(texture: Texture | TextureLayer) {
    const maps = this.decodeLabPbrNormal(texture);

    Object.entries(maps).forEach(([name, map]) => {
      if (map) {
        const textureMap = new Texture({
          name: `${texture.name}_${name}`,
          saved: false,
          particle: false,
          keep_size: false,
        }).fromDataURL(map.toDataURL());

        textureMap.add();
      }
    });

    return maps;
  }

  /**
   * ### Generate Normal Map
   * Generates a normal map from a height map texture
   * @param texture Height map texture
   * @param heightInAlpha Whether or not to store the height map in the alpha channel (Used in labPBR shaders for POM)
   * @returns Normal map texture or layer if successful, otherwise `null`
   */
  createNormalMap(
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
      keep_size: false,
    }).fromDataURL(dataUrl);

    if (Project) {
      normalMapTexture.add();
    }

    return normalMapTexture;
  }

  createAoMap(texture: Texture | TextureLayer): Texture | TextureLayer | null {
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
}
