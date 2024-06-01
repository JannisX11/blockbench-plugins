/**
 * @author jasonjgardner
 * @discord jason.gardner
 * @github https://github.com/jasonjgardner
 */
/// <reference types="three" />
/// <reference path="../../../types/index.d.ts" />

interface IPbrMaterials {
  [materialUuid: string]: {
    [channelId: string]: string;
  };
}

type Channel =
  | "albedo"
  | "metalness"
  | "emissive"
  | "roughness"
  | "height"
  | "normal"
  | "ao";

interface IChannel {
  label: string;
  description: string;
  map: string;
  id: string;
  icon?: string;
  default?: THREE.Color;
}

interface ILightrParams {
  lightHeight?: number;
  ambientLight?: [number, number, number];
  minLightIntensity?: number;
  lightDiffuse?: [number, number, number];
}

(() => {
  let decodeMer: Action;
  let createTextureSet: Action;
  let generateMer: Action;
  let generateNormal: Action;
  let unassignChannel: Action;
  let createMaterialTexture: Action;
  let bakeTexturesAction: Action;
  let bakeTexturesDialog: Dialog;
  let togglePbr: Toggle;
  let displaySettingsPanel: Panel;
  let textureSetDialog: Dialog;
  let textureChannelProp: Property;
  let channelProp: Property;
  let channelMenu: Menu;
  let showChannelMenu: Action;
  let exposureSlider: BarSlider;
  let tonemappingSelect: BarSelect;
  let toggleCorrectLights: Toggle;
  let pbrMaterialsProp: Property;
  let projectMaterialsProp: Property;
  let projectPbrModeProp: Property;
  let materialBrushPanel: Panel;
  let materialBrushTool: Tool;
  let setBrushMaterial: Action;
  let brushMetalnessSlider: NumSlider;
  let brushRoughnessSlider: NumSlider;
  let brushEmissiveColor: ColorPicker;
  let brushHeightSlider: NumSlider;
  let openChannelMenu: Action;

  const channelActions: Record<IChannel["id"], Action> = {};

  const PLUGIN_ID = "pbr_preview";
  const PLUGIN_VERSION = "1.0.0";
  const NA_CHANNEL = "_NONE_";
  const CHANNELS: Record<IChannel["id"], IChannel> = {
    albedo: {
      id: "albedo",
      label: "Albedo",
      description: "The color of the material",
      map: "map",
      icon: "tonality",
      default: new THREE.Color(0xffffff),
    },
    metalness: {
      id: "metalness",
      label: "Metalness",
      description: "The material's metalness map",
      map: "metalnessMap",
      icon: "brightness_6",
      default: new THREE.Color(0),
    },
    emissive: {
      id: "emissive",
      label: "Emissive",
      description: "The material's emissive map",
      map: "emissiveMap",
      icon: "wb_twilight",
      default: new THREE.Color(0),
    },
    roughness: {
      id: "roughness",
      label: "Roughness",
      description: "The material's roughness map",
      map: "roughnessMap",
      icon: "grain",
      default: new THREE.Color(0xffffff),
    },
    height: {
      id: "height",
      label: "Height",
      description: "The material's height map",
      map: "bumpMap",
      icon: "landscape",
      default: new THREE.Color(0xffffff),
    },
    normal: {
      id: "normal",
      label: "Normal",
      description: "The material's normal map",
      map: "normalMap",
      icon: "looks",
      default: new THREE.Color("rgb(128, 128, 255)"),
    },
    ao: {
      id: "ao",
      label: "Ambient Occlusion",
      description: "The material's ambient occlusion map",
      map: "aoMap",
      icon: "motion_mode",
      default: new THREE.Color(0xffffff),
    },
  };

  const getProjectTextures = (layers = true) => {
    const allTextures = Project ? Project.textures ?? Texture.all : Texture.all;

    if (!layers) {
      return allTextures;
    }

    return allTextures
      .filter((t: Texture) => t.layers_enabled && t.layers.length > 0)
      .flatMap((t: Texture) => t.layers);
  };

  //
  // Classes
  //

  /**
   * ### PBR Material
   * Class for handling PBR materials in Blockbench
   *
   * Uses a texture's layers to generate a PBR material,
   * or a project's textures if no layers are available.
   */
  class PbrMaterial {
    private _scope: Array<Texture | TextureLayer>;
    private _materialUuid: string;

    constructor(
      scope: Array<Texture | TextureLayer> | null,
      materialUuid: string,
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
      const { emissiveMap, roughnessMap, metalnessMap } = this.merToCanvas();

      const mat = new THREE.MeshStandardMaterial({
        map:
          this.getTexture(CHANNELS.albedo) ??
          PbrMaterial.makePixelatedCanvas(
            TextureLayer.selected?.canvas ??
              Texture.all.find((t) => t.selected)?.canvas ??
              Texture.getDefault().canvas,
          ),
        aoMap: this.getTexture(CHANNELS.ao),
        bumpMap: this.getTexture(CHANNELS.height),
        metalnessMap,
        metalness: metalnessMap ? 1 : 0,
        roughnessMap,
        roughness: 1,
        emissiveMap,
        emissiveIntensity: emissiveMap ? 1 : 0,
        emissive: emissiveMap ? 0xffffff : 0,
        envMap: PreviewScene.active?.cubemap ?? null,
        envMapIntensity: 1,
        alphaTest: 0.5,
        ...options,
      });

      const normalMap = this.getTexture(CHANNELS.normal);

      if (normalMap) {
        mat.normalMap = normalMap;
        mat.normalScale = new THREE.Vector2(1, 1);
      }

      return mat;
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
      inference = true,
    ): Texture | TextureLayer | null {
      if (!Project) {
        return null;
      }

      const materialChannel = this._scope.find(
        (t) => t.channel && (t.channel === name || t.channel === name.id),
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
        THREE.NearestFilter,
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
      channel: "r" | "g" | "b" | "a",
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
        emissive.height,
      );
      const emissiveLevelData = emissiveLevelCtx.getImageData(
        0,
        0,
        emissive.width,
        emissive.height,
      );

      const emissiveData = new Uint8ClampedArray(
        emissive.width * emissive.height * 4,
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
        0,
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
        16,
      );

      const height = Math.max(
        metalness?.img.height ?? 0,
        emissive?.img.height ?? 0,
        roughness?.img.height ?? 0,
        Project ? Project.texture_height : 0,
        16,
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
          height,
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

    /**
     * ### Generate Normal Map
     * Generates a normal map from a height map texture
     * @param texture Height map texture
     * @param heightInAlpha Whether or not to store the height map in the alpha channel (Used in labPBR shaders for POM)
     * @returns Normal map texture or layer if successful, otherwise `null`
     */
    static createNormalMap(
      texture: Texture | TextureLayer,
      heightInAlpha = false,
    ): Texture | TextureLayer | null {
      const textureCtx = texture.canvas.getContext("2d");

      if (!textureCtx) {
        return null;
      }

      const width = Math.max(
        texture.img.width ?? texture.canvas.width,
        Project ? Project.texture_width : 0,
        16,
      );
      const height = Math.max(
        texture.img.height ?? texture.canvas.height,
        Project ? Project.texture_height : 0,
        16,
      );

      const { data: textureData } = textureCtx.getImageData(
        0,
        0,
        width,
        height,
      );

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
          texture.texture,
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
  }

  /**
   * ### Material Brush
   * Class for painting across multiple TextureLayers in a Texture
   * Used to iterate over PBR channels and apply a brush value to each layer
   * at the same UV coordinates
   */
  class MaterialBrush {
    private _colors: Record<IChannel["id"], THREE.Color>;

    constructor({ colors }: { colors?: Record<IChannel["id"], THREE.Color> }) {
      this._colors = {
        ...Object.fromEntries(
          Object.keys(CHANNELS).map((key) => [
            key,
            CHANNELS[key].default ?? new THREE.Color(0xffffff00),
          ]),
        ),
        ...colors,
      };
    }

    get colors() {
      return this._colors;
    }

    set colors(colors: Record<IChannel["id"], THREE.Color>) {
      this._colors = { ...this._colors, ...colors };
    }

    getChannel(channel: IChannel["id"]) {
      return this._colors[channel];
    }

    static makeLinearColor(value: number) {
      const clamped = Math.min(1, Math.max(0, value));
      return new THREE.Color(clamped, clamped, clamped).convertSRGBToLinear();
    }

    static fromSettings() {
      const metalnessValue = Number(brushMetalnessSlider.get());
      const roughnessValue = Number(brushRoughnessSlider.get());
      const emissiveValue = brushEmissiveColor.get().toString();
      const heightValue = Number(brushHeightSlider.get());
      const currentColor = ColorPanel.get();

      const colors = {
        [CHANNELS.albedo.id]: new THREE.Color(currentColor),
        [CHANNELS.metalness.id]: MaterialBrush.makeLinearColor(metalnessValue),
        [CHANNELS.roughness.id]: MaterialBrush.makeLinearColor(roughnessValue),
        [CHANNELS.emissive.id]: new THREE.Color(emissiveValue ?? "#000000"),
        [CHANNELS.height.id]: MaterialBrush.makeLinearColor(heightValue),
        [CHANNELS.normal.id]:
          CHANNELS.normal.default ?? new THREE.Color("#8080ff"),
      };

      return new MaterialBrush({ colors });
    }
  }

  /**
   * Adapted from Lightr by phosphoer
   * @see https://github.com/phosphoer/lightr
   */
  class Lightr {
    lightHeight: number;
    ambientLight: [number, number, number];
    minLightIntensity: number;
    lightDiffuse: [number, number, number];

    constructor({
      lightHeight = 0.66,
      ambientLight = [0.1, 0.1, 0.1],
      minLightIntensity = 0.0,
      lightDiffuse = [1, 1, 1],
    }: ILightrParams = {}) {
      this.lightHeight = lightHeight;
      this.ambientLight = ambientLight;
      this.minLightIntensity = minLightIntensity;
      this.lightDiffuse = lightDiffuse;
    }

    bake(
      numDirs: number,
      diffuseMap: HTMLImageElement | HTMLCanvasElement,
      normalMap: HTMLImageElement | HTMLCanvasElement,
    ): HTMLCanvasElement[] {
      const canvasDiffuse =
        diffuseMap instanceof HTMLCanvasElement
          ? diffuseMap
          : this.createCanvas(diffuseMap.width, diffuseMap.height);
      const canvasNormals =
        normalMap instanceof HTMLCanvasElement
          ? normalMap
          : this.createCanvas(normalMap.width, normalMap.height);

      const contextDiffuse = canvasDiffuse.getContext("2d")!;
      const contextNormals = canvasNormals.getContext("2d")!;

      contextDiffuse.drawImage(diffuseMap, 0, 0);
      contextNormals.drawImage(normalMap, 0, 0);

      const bufferDiffuse = contextDiffuse.getImageData(
        0,
        0,
        diffuseMap.width,
        diffuseMap.height,
      );
      const bufferNormals = contextNormals.getImageData(
        0,
        0,
        normalMap.width,
        normalMap.height,
      );

      const bakedImages: HTMLCanvasElement[] = [];
      const normals: [number, number, number][][] = [];

      for (let x = 0; x < bufferNormals.width; ++x) {
        normals[x] = [];
        for (let y = 0; y < bufferNormals.height; ++y) {
          const idx = (x + y * bufferNormals.width) * 4;

          const normal = [
            (bufferNormals.data[idx + 0] / 255 - 0.5) * 2,
            (bufferNormals.data[idx + 1] / 255 - 0.5) * 2,
            (bufferNormals.data[idx + 2] / 255 - 0.5) * 2,
          ];

          const len = Math.sqrt(
            normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2,
          );
          normals[x][y] = [normal[0] / len, normal[1] / len, normal[2] / len];
        }
      }

      const bakeDirection = (dir: number): HTMLCanvasElement => {
        const canvas = this.createCanvas(diffuseMap.width, diffuseMap.height);
        const context = canvas.getContext("2d")!;
        const buffer = context.getImageData(0, 0, canvas.width, canvas.height);

        const lightDir = [Math.cos(dir), Math.sin(dir), this.lightHeight];

        for (let x = 0; x < bufferNormals.width; ++x) {
          for (let y = 0; y < bufferNormals.height; ++y) {
            const normal = normals[x][y];
            const index = (x + y * bufferNormals.width) * 4;
            const diffuse = [
              bufferDiffuse.data[index + 0] / 255,
              bufferDiffuse.data[index + 1] / 255,
              bufferDiffuse.data[index + 2] / 255,
              bufferDiffuse.data[index + 3],
            ];

            let intensity =
              normal[0] * lightDir[0] +
              normal[1] * lightDir[1] +
              normal[2] * lightDir[2];
            intensity = Math.min(
              1,
              Math.max(this.minLightIntensity, intensity),
            );

            const out = [
              intensity * diffuse[0] * this.lightDiffuse[0] +
                this.ambientLight[0],
              intensity * diffuse[1] * this.lightDiffuse[1] +
                this.ambientLight[1],
              intensity * diffuse[2] * this.lightDiffuse[2] +
                this.ambientLight[2],
              diffuse[3],
            ];

            buffer.data[index + 0] = Math.floor(out[0] * 255);
            buffer.data[index + 1] = Math.floor(out[1] * 255);
            buffer.data[index + 2] = Math.floor(out[2] * 255);
            buffer.data[index + 3] = out[3];
          }
        }

        context.putImageData(buffer, 0, 0);
        return canvas;
      };

      for (let i = 0; i < numDirs; ++i) {
        const lightDir = ((Math.PI * 2) / numDirs) * i;
        bakedImages.push(bakeDirection(lightDir));
      }

      return bakedImages;
    }

    private createCanvas(width: number, height: number): HTMLCanvasElement {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      return canvas;
    }
  }

  channelProp = new Property(TextureLayer, "enum", "channel", {
    default: NA_CHANNEL,
    values: Object.keys(CHANNELS).map((key) => CHANNELS[key].id),
    label: "PBR Channel",
    exposed: false,
  });

  textureChannelProp = new Property(Texture, "enum", "channel", {
    default: NA_CHANNEL,
    values: Object.keys(CHANNELS).map((key) => CHANNELS[key].id),
    label: "PBR Channel",
    exposed: false,
  });

  // @ts-expect-error "object" is a valid type for a property
  pbrMaterialsProp = new Property(ModelProject, "object", "pbr_materials", {
    default: {},
    exposed: false,
    label: "PBR Materials",
  });

  // @ts-expect-error "object" is a valid type for a property
  projectMaterialsProp = new Property(ModelProject, "object", "bb_materials", {
    default: {},
    exposed: false,
    label: "Project Materials",
  });

  projectPbrModeProp = new Property(ModelProject, "boolean", "pbr_active", {
    default: false,
    exposed: true,
    values: [],
    label: "PBR Mode",
  });

  //
  // Functions
  //

  /**
   * ### Export MER map
   * Generates a MER map from the currently selected texture and exports it as a PNG file
   * @param cb Callback function to run after the MER file is exported
   * @returns void
   */
  const exportMer = (baseName?: string, cb?: (filePath: string) => void) => {
    const selected = Project
      ? Project.selected_texture
      : Texture.all.find((t) => t.selected);

    if (!selected) {
      return;
    }

    const mer = new PbrMaterial(
      selected.layers_enabled
        ? selected.layers
        : Project
          ? Project.textures
          : null,
      selected.uuid,
    ).createMer(false);

    if (!mer) {
      return;
    }

    mer.toBlob(async (blob) => {
      if (!blob) {
        return;
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
        cb,
      );
    });
  };

  /**
   * ### Apply PBR Material
   * Iterates over all faces in the project and applies a PBR material to each face
   * @param materialParams Parameters to extend the base material with
   * @returns `THREE.MeshStandardMaterial` with PBR textures applied
   */
  const applyPbrMaterial = (
    materialParams?: THREE.MeshStandardMaterialParameters,
  ) => {
    // Don't overwrite placeholder material in Edit and Paint mode
    if (!Project || Texture.all.length === 0) {
      return;
    }

    let materialsSet = false;

    Project.elements.forEach((item) => {
      if (!(item instanceof Cube)) {
        return;
      }

      Object.keys(item.faces).forEach((key) => {
        const face = item.faces[key];
        const texture = face.getTexture();

        if (!texture) {
          return;
        }

        const projectMaterial = Project.materials[texture.uuid];

        if (
          projectMaterial.isShaderMaterial &&
          !Project.bb_materials[texture.uuid]
        ) {
          Project.bb_materials[texture.uuid] = projectMaterial;
        }

        const material = new PbrMaterial(
          texture.layers_enabled
            ? texture.layers.filter((layer) => layer.visible) ?? null
            : Project.textures,
          texture.uuid,
        ).getMaterial(materialParams);

        Project.materials[texture.uuid] =
          THREE.ShaderMaterial.prototype.copy.call(material, projectMaterial);

        Canvas.updateAllFaces(texture);
        materialsSet = true;
      });
    });

    Project.pbr_active = materialsSet;
  };

  /**
   * ### Disable PBR
   * Reverts all faces in the project to their original materials
   * @returns void
   */
  const disablePbr = () => {
    if (!Project || !Project.bb_materials) {
      return;
    }

    Project.elements.forEach((item) => {
      if (!(item instanceof Cube)) {
        return;
      }

      Object.keys(item.faces).forEach((key) => {
        const face = item.faces[key];
        const texture = face.getTexture();

        if (!texture) {
          return;
        }

        const projectMaterial = Project.bb_materials[texture.uuid];

        if (!projectMaterial) {
          return;
        }

        Project.materials[texture.uuid] = projectMaterial;
      });
    });

    Project.pbr_active = false;
    Canvas.updateAll();
  };

  const colorDataUrl = (color: THREE.Color, src?: HTMLCanvasElement) => {
    const canvas = src ?? document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    const width = Math.max(Project ? Project.texture_width : 16, 16);
    const height = Math.max(Project ? Project.texture_height : 16, 16);

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
    ctx.fillRect(0, 0, width, height);

    return canvas.toDataURL();
  };

  const bakeTextures = (
    params: ILightrParams,
    directions = 8,
    blendEmissive = false,
  ) => {
    if (!Project) {
      return;
    }

    const selected = Project.selected_texture;

    if (!selected) {
      return;
    }

    const mat = new PbrMaterial(
      selected.layers_enabled ? selected.layers : Project.textures,
      selected.uuid,
    );

    const texture = mat.findTexture(CHANNELS.albedo);
    const normalMap = mat.findTexture(CHANNELS.normal);

    if (!texture || !normalMap) {
      return;
    }

    const lightr = new Lightr(params);
    const bakedImages = lightr.bake(
      directions,
      texture.canvas,
      normalMap.canvas,
    );

    const bakedTexture = new Texture({
      name: `${texture.name}_baked`,
      saved: false,
      particle: false,
      keep_size: false,
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

  //
  // UI Components
  //

  const createTextureSetDialog = () => {
    if (!Project) {
      return;
    }
    const scope = getProjectTextures();
    Project.textures.forEach((t) => {
      const mat = new PbrMaterial(scope, t.uuid);

      const projectNormalMap = mat.findTexture(CHANNELS.normal, false);
      const projectHeightMap = mat.findTexture(CHANNELS.height, false);
      const projectColorMap = mat.findTexture(CHANNELS.albedo, false);
      const projectMetalnessMap = mat.findTexture(
        CHANNELS.metalness,
        false,
      )?.name;
      const projectEmissiveMap = mat.findTexture(
        CHANNELS.emissive,
        false,
      )?.name;
      const projectRoughnessMap = mat.findTexture(
        CHANNELS.roughness,
        false,
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

      textureSetDialog = new Dialog(`${PLUGIN_ID}_texture_set`, {
        id: `${PLUGIN_ID}_texture_set`,
        title: "Create Texture Set JSON",
        buttons: ["Create", "Cancel"],
        form,
        onConfirm(formResult: Record<string, any>) {
          const baseName =
            Project.model_identifier.length > 0
              ? Project.model_identifier
              : Project.getDisplayName();

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
              },
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
                  false,
                );
                cb();
              },
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
                    textureSetDialog.hide();
                  },
                );
              });
            });

          if (hasMer) {
            exportMer(baseName, (filePath) => {
              textureSet["minecraft:texture_set"].metalness_emissive_roughness =
                pathToName(filePath, false);
              exportTextureSet();
            });
            return;
          }

          exportTextureSet();
        },
        cancelIndex: 1,
      });

      textureSetDialog.show();

      return textureSetDialog;
    });
  };

  //
  // Events
  //

  /**
   * List of Blockbench events which trigger a PBR material update
   */
  const subscribeToEvents: EventName[] = [
    "undo",
    "redo",
    "add_texture",
    "finish_edit",
    "finished_edit",
    "load_project",
    "select_preview_scene",
    "change_texture_path",
    "select_project",
  ];

  /**
   * Conditionally triggers the PBR material update based on the `pbr_active` setting
   * @returns void
   */
  const renderPbrScene = () =>
    Project && Project.pbr_active && applyPbrMaterial();

  const enableListeners = () => {
    subscribeToEvents.forEach((event) => {
      Blockbench.addListener(event as EventName, renderPbrScene);
    });
  };

  const disableListeners = () => {
    subscribeToEvents.forEach((event) => {
      Blockbench.removeListener(event as EventName, renderPbrScene);
    });
  };

  //
  // Setup
  //

  const onload = () => {
    //
    // Controls
    //

    tonemappingSelect = new BarSelect("display_settings_tone_mapping", {
      category: "preview",
      name: "Tone Mapping",
      description: "Changes the tone mapping of the preview",
      type: "select",
      default_value: THREE.NoToneMapping,
      value: Preview.selected.renderer.toneMapping ?? THREE.NoToneMapping,
      icon: "monochrome_photos",
      options: {
        [THREE.NoToneMapping]: "None",
        [THREE.LinearToneMapping]: "Linear",
        [THREE.ReinhardToneMapping]: "Reinhard",
        [THREE.CineonToneMapping]: "Cineon",
        [THREE.ACESFilmicToneMapping]: "ACES",
      },
      onChange({ value }) {
        const currentExposure = Number(exposureSlider.get());
        Preview.all.forEach((preview) => {
          preview.renderer.toneMapping = Number(value) as THREE.ToneMapping;
          preview.renderer.toneMappingExposure = currentExposure;
        });

        Preview.selected.renderer.toneMapping = Number(
          value,
        ) as THREE.ToneMapping;
        Preview.selected.renderer.toneMappingExposure = currentExposure;

        Blockbench.showQuickMessage(
          `Tone mapping set to ${this.getNameFor(value)}`,
          2000,
        );

        if (!togglePbr.value) {
          togglePbr.set(true);
        }

        applyPbrMaterial();
      },
    });

    exposureSlider = new BarSlider("display_settings_exposure", {
      category: "preview",
      name: "Exposure",
      description: "Adjusts the exposure of the scene",
      type: "number",
      value: 1,
      icon: "exposure",
      step: 0.1,
      min: -2,
      max: 2,
      // condition: () => Number(tonemappingSelect.get()) !== THREE.NoToneMapping,
      onBefore() {
        if (Number(tonemappingSelect.get()) === THREE.NoToneMapping) {
          // @ts-expect-error `.change()` does not require an Event for its value
          tonemappingSelect.change(THREE.LinearToneMapping.toString());
        }
        togglePbr.set(true);
      },
      onChange({ value }) {
        const exposureValue = Math.max(-2, Math.min(2, Number(value)));
        Preview.all.forEach((preview) => {
          preview.renderer.toneMappingExposure = exposureValue;
        });

        Preview.selected.renderer.toneMappingExposure = exposureValue;
      },
      onAfter() {
        applyPbrMaterial();
      },
    });

    bakeTexturesDialog = new Dialog(`${PLUGIN_ID}_bake_textures`, {
      id: `${PLUGIN_ID}_bake_textures`,
      title: "Bake Textures",
      buttons: ["Bake", "Cancel"],
      form: {
        ambientLight: {
          type: "color",
          label: "Ambient Light",
          value: "#1f1f1f",
        },
        lightDiffuse: {
          type: "color",
          label: "Light Diffuse",
          value: "#ffffff",
        },
        lightHeight: {
          type: "range",
          label: "Light Height",
          min: 0,
          max: 1,
          step: 0.01,
          value: 0.66,
        },
        minLightIntensity: {
          type: "range",
          label: "Minimum Light Intensity",
          min: 0,
          max: 1,
          step: 0.01,
          value: 0,
        },
        directions: {
          type: "number",
          label: "Directions",
          value: 8,
          min: 1,
          max: 360,
          step: 1,
        },
        blendEmissive: {
          type: "checkbox",
          label: "Blend Emissive",
          value: false,
        },
      },
      onConfirm(formResult: Record<string, any>) {
        const ambientLight = new THREE.Color(
          formResult.ambientLight.toString(),
        );
        const lightDiffuse = new THREE.Color(
          formResult.lightDiffuse.toString(),
        );
        bakeTextures(
          {
            ambientLight: [ambientLight.r, ambientLight.g, ambientLight.b],
            lightDiffuse: [lightDiffuse.r, lightDiffuse.g, lightDiffuse.b],
            lightHeight: Number(formResult.lightHeight),
            minLightIntensity: Number(formResult.minLightIntensity),
          },
          formResult.directions ?? 8,
          formResult.blendEmissive ?? false,
        );
      },
    });

    //
    // Actions
    //

    bakeTexturesAction = new Action(`${PLUGIN_ID}_bake_textures`, {
      icon: "cake",
      name: "Bake Textures",
      description: "Bakes textures for the selected PBR material",
      click() {
        bakeTexturesDialog.show();
      },
    });

    generateNormal = new Action(`${PLUGIN_ID}_generate_normal`, {
      icon: "altitude",
      name: "Generate Normal Map",
      description: "Generates a normal map from the height map",
      condition: () =>
        (TextureLayer.selected || Texture.all.find((t) => t.selected)) !==
        undefined,
      click() {
        const texture: Texture | TextureLayer =
          TextureLayer.selected ??
          (!!Project && Project.selected_texture
            ? Project.selected_texture.selected_layer ??
              Project.selected_texture
            : Texture.getDefault());

        if (!texture) {
          return;
        }

        const mat = new PbrMaterial(
          texture instanceof Texture && texture.layers_enabled
            ? texture.layers
            : getProjectTextures(),
          texture.uuid,
        );

        const normalMap = PbrMaterial.createNormalMap(texture);

        if (normalMap) {
          mat.saveTexture(CHANNELS.normal, normalMap);
          normalMap.select();
          Blockbench.showQuickMessage("Normal map generated", 2000);
          return;
        }

        Blockbench.showQuickMessage("Failed to generate normal map", 2000);
      },
    });

    generateMer = new Action(`${PLUGIN_ID}_create_mer`, {
      icon: "lightbulb_circle",
      name: "Export MER",
      description:
        "Exports a texture map from the metalness, emissive, and roughness channels. (For use in Bedrock resource packs.)",
      condition: {
        formats: ["bedrock_block", "bedrock_entity"],
        project: true,
      },
      click() {
        exportMer();
      },
    });

    decodeMer = new Action(`${PLUGIN_ID}_decode_mer`, {
      icon: "arrow_split",
      name: "Decode MER",
      description:
        "Decodes a MER texture map into metalness, emissive, and roughness channels",
      condition: () =>
        !!Project &&
        Project.selected_texture !== null &&
        !Project.selected_texture.layers_enabled,
      click() {
        const selected =
          TextureLayer.selected?.texture ??
          Texture.all.find((t) => t.selected) ??
          Texture.getDefault();

        const mat = new PbrMaterial(
          selected.layers_enabled ? selected.layers : [selected],
          selected.uuid,
        );

        const mer = mat.decodeMer();
        const merChannels = [
          CHANNELS.metalness,
          CHANNELS.emissive,
          CHANNELS.roughness,
        ];

        Undo.initEdit({ textures: [selected] });
        selected.activateLayers(true);

        merChannels.forEach((channel) => {
          const key = channel.id as keyof typeof mer;
          const canvas = mer[key];

          if (!canvas) {
            Blockbench.showStatusMessage(
              `Failed to decode ${channel.label} channel`,
              3000,
            );
            return;
          }

          const layer = new TextureLayer(
            {
              name: `${selected?.name}_${key}`,
              data_url: canvas.toDataURL(),
            },
            selected,
          );

          mat.saveTexture(channel, layer);

          layer.addForEditing();
        });

        Undo.finishEdit("Decode MER");
      },
    });

    createTextureSet = new Action(`${PLUGIN_ID}_create_texture_set`, {
      name: "Create Texture Set",
      icon: "layers",
      description:
        "Creates a texture set JSON file. Generates a MER when metalness, emissive, or roughness channels are set.",
      click() {
        createTextureSetDialog();
      },
      condition: {
        formats: ["bedrock_block", "bedrock_entity"],
        project: true,
      },
    });

    createMaterialTexture = new Action(`${PLUGIN_ID}_create_material_texture`, {
      icon: "stacks",
      name: "Create Material Texture",
      description: "Creates a new texture for a PBR material",
      click() {
        if (!Project) {
          return;
        }

        const texture = new Texture({
          name: "New Material",
          saved: false,
          particle: false,
          keep_size: false,
          layers_enabled: true,
        });

        const filler = colorDataUrl(new THREE.Color(0x808080));

        if (!filler) {
          return;
        }

        texture.fromDataURL(filler).add().select();

        // Create PBR channels as texture layers for the new texture
        Object.keys(CHANNELS).forEach((key) => {
          const channel = CHANNELS[key];

          const layer = new TextureLayer(
            {
              name: channel.label,
              visible: true,
            },
            texture,
          );

          layer.setSize(
            Project.texture_width ?? texture.width,
            Project.texture_height ?? texture.height,
          );

          const data = colorDataUrl(
            channel.default ?? new THREE.Color(0),
            layer.canvas,
          );

          if (data) {
            layer.texture.fromDataURL(data);
          }

          layer.extend({ channel: channel.id });

          layer.addForEditing();
        });
      },
    });

    Object.entries(CHANNELS).forEach(([key, channel]) => {
      channelActions[key] = new Action(`${PLUGIN_ID}_assign_channel_${key}`, {
        icon: channel.icon ?? "tv_options_edit_channels",
        name: `Assign to ${channel.label.toLocaleLowerCase()} channel`,
        description: `Assign the selected layer to the ${channel.label} channel`,
        category: "textures",
        condition: () =>
          Modes.paint &&
          (TextureLayer.selected ||
            (Project && Project.selected_texture !== null)),
        click(e) {
          const layer =
            TextureLayer.selected ??
            (Project ? Project.selected_texture : null);

          if (!layer || !Project) {
            return;
          }

          Undo.initEdit({ layers: [layer] });

          layer.extend({ channel: channel.id });

          const texture = layer instanceof TextureLayer ? layer.texture : layer;

          texture.updateChangesAfterEdit();

          if (!Project.pbr_materials[texture.uuid]) {
            Project.pbr_materials[texture.uuid] = {};
          }

          // If the layer uuid is already assigned to another channel, unassign it first
          Object.entries(Project.pbr_materials[texture.uuid]).forEach(
            ([assignedChannel, assignedLayerUuid]) => {
              if (assignedLayerUuid === layer.uuid) {
                delete Project.pbr_materials[texture.uuid][assignedChannel];
                layer.channel = NA_CHANNEL;
              }
            },
          );

          Project.pbr_materials[texture.uuid][key] = layer.uuid;

          Undo.finishEdit("Change channel assignment");

          Blockbench.showQuickMessage(
            `Assigned "${layer.name}" to ${channel.label} channel`,
            2000,
          );

          applyPbrMaterial();
        },
      });
    });

    unassignChannel = new Action(`${PLUGIN_ID}_unassign_channel`, {
      icon: "cancel",
      name: "Unassign Channel",
      description: "Unassign the selected layer from the channel",
      category: "textures",
      condition: () => {
        if (!Modes.paint) {
          return false;
        }

        if (TextureLayer.selected) {
          return (
            TextureLayer.selected.channel !== NA_CHANNEL ||
            !TextureLayer.selected.channel
          );
        }

        if (!Project) {
          return false;
        }

        const texture = Project.selected_texture;

        return (
          texture !== null &&
          (texture.channel !== NA_CHANNEL || !texture.channel)
        );
      },
      click() {
        const layer =
          TextureLayer.selected ?? (Project ? Project.selected_texture : null);

        if (!layer || !Project) {
          return;
        }

        Undo.initEdit({ layers: [layer] });

        const texture = layer instanceof TextureLayer ? layer.texture : layer;
        const prevChannel = layer.channel;

        Project.pbr_materials[texture.uuid] = {};

        layer.channel = NA_CHANNEL;

        texture.updateChangesAfterEdit();
        Undo.finishEdit("Unassign channel");

        Blockbench.showQuickMessage(
          `Unassigned "${layer.name}" from ${prevChannel} channel`,
          2000,
        );

        applyPbrMaterial();
      },
    });

    togglePbr = new Toggle("toggle_pbr", {
      name: "PBR Preview",
      description: "Toggle PBR Preview",
      icon: "panorama_photosphere",
      category: "view",
      default: false,
      click() {},
      onChange(value) {
        if (value) {
          applyPbrMaterial();
          enableListeners();

          Blockbench.showQuickMessage("PBR Preview is now enabled");

          return;
        }
        disablePbr();
        disableListeners();

        Blockbench.showQuickMessage("PBR Preview is now disabled");
      },
    });

    toggleCorrectLights = new Toggle(`${PLUGIN_ID}_correct_lights`, {
      category: "preview",
      name: "Correct Lights",
      description: "Corrects the lighting in the preview",
      icon: "fluorescent",
      default: false,
      onChange(value) {
        Preview.all.forEach((preview) => {
          preview.renderer.physicallyCorrectLights = value;
        });

        Preview.selected.renderer.physicallyCorrectLights = value;

        Blockbench.showQuickMessage(
          `Physically corrected lighting is now ${value ? "enabled" : "disabled"}`,
          2000,
        );

        if (value) {
          togglePbr.set(true);
        }

        applyPbrMaterial();
      },
      click() {},
    });

    //
    // Tools
    //

    brushMetalnessSlider = new NumSlider("slider_brush_metalness", {
      category: "paint",
      name: "Metalness",
      description: "Adjust the metalness of the brush",
      settings: {
        min: 0,
        max: 1,
        step: 0.01,
        default: 0,
      },
      condition: () => {
        if (!Project) {
          return false;
        }

        const texture = Project.selected_texture;

        if (!texture?.layers_enabled) {
          return false;
        }

        return (
          texture.layers.find(
            ({ channel }) => channel === CHANNELS.metalness.id,
          ) !== undefined
        );
      },
    });

    brushRoughnessSlider = new NumSlider("slider_brush_roughness", {
      category: "paint",
      name: "Roughness",
      description: "Adjust the roughness of the brush",
      settings: {
        min: 0,
        max: 1,
        step: 0.01,
        default: 1,
      },
      condition: () => {
        if (!Project) {
          return false;
        }

        const texture = Project.selected_texture;

        if (!texture?.layers_enabled) {
          return false;
        }

        return (
          texture.layers.find(
            ({ channel }) => channel === CHANNELS.roughness.id,
          ) !== undefined
        );
      },
    });

    brushEmissiveColor = new ColorPicker("brush_emissive_color", {
      category: "paint",
      name: "Emissive",
      description: "Adjust the emissive color of the brush",
      value: "#000000",
      condition: () => {
        if (!Project) {
          return false;
        }

        const texture = Project.selected_texture;

        if (!texture?.layers_enabled) {
          return false;
        }

        return (
          texture.layers.find(
            ({ channel }) => channel === CHANNELS.emissive.id,
          ) !== undefined
        );
      },
    });

    brushHeightSlider = new NumSlider("slider_brush_height", {
      category: "paint",
      name: "Height",
      description: "Adjust the height of the brush",
      settings: {
        min: 0,
        max: 1,
        step: 0.01,
        default: 0.5,
      },
      condition: () => {
        if (!Project) {
          return false;
        }

        const texture = Project.selected_texture;

        if (!texture?.layers_enabled) {
          return false;
        }

        return (
          texture.layers.find(
            ({ channel }) => channel === CHANNELS.height.id,
          ) !== undefined
        );
      },
    });

    materialBrushTool = new Tool("material_brush", {
      name: "Material Brush",
      description: "Paints across multiple texture layers",
      icon: "view_in_ar",
      paintTool: true,
      cursor: "cell",
      condition: () =>
        Modes.paint &&
        !!Project &&
        Project.selected_texture &&
        Project.selected_texture.layers_enabled,
      brush: {
        blend_modes: false,
        shapes: true,
        size: true,
        softness: true,
        opacity: true,
        offset_even_radius: true,
        floor_coordinates: true,
        changePixel(x, y, px, alpha, { size, softness, texture }) {
          const mat = MaterialBrush.fromSettings();

          const matChannels = Object.keys(mat.colors);

          let rgba = px;

          texture.layers.forEach((layer) => {
            if (!layer.visible || !matChannels.includes(layer.channel)) {
              return;
            }

            const fill = mat.getChannel(layer.channel);

            if (!fill) {
              return;
            }

            // TODO: Let softness affect the brush

            layer.ctx.fillStyle = fill.getStyle();
            layer.ctx.fillRect(size * x, size * y, size, size);

            if (layer.selected) {
              rgba = {
                r: fill.r * 255,
                g: fill.g * 255,
                b: fill.b * 255,
                a: alpha * 255,
              };
            }
          });

          return rgba;
        },
      },
      onCanvasClick(data) {
        Painter.startPaintToolCanvas(data, data.event);
      },
      onSelect() {
        applyPbrMaterial();
      },
      click() {
        applyPbrMaterial();
      },
    });

    //
    // UI
    //

    channelMenu = new Menu(
      `${PLUGIN_ID}_channel_menu`,
      [
        ...Object.keys(CHANNELS).map(
          (key) => `${PLUGIN_ID}_assign_channel_${key}`,
        ),
        ...[`${PLUGIN_ID}_unassign_channel`],
      ],
      {
        onOpen() {
          applyPbrMaterial();
        },
      },
    );

    openChannelMenu = new Action("pbr_channel_menu", {
      name: "Assign to PBR Channel",
      icon: "texture",
      click(event) {
        channelMenu.open(event as MouseEvent);
      },
      children: [...Object.values(channelActions), unassignChannel],
    });

    showChannelMenu = new Action(`${PLUGIN_ID}_show_channel_menu`, {
      icon: "texture",
      name: "Assign to PBR Channel",
      description: "Assign the selected layer to a channel",
      category: "textures",
      condition: () =>
        Modes.paint &&
        (TextureLayer.selected ||
          (Project && Project.selected_texture !== null)),
      click(event) {
        channelMenu.open(event as MouseEvent);
      },
    });

    displaySettingsPanel = new Panel(`${PLUGIN_ID}_display_settings`, {
      name: "PBR Settings",
      id: `${PLUGIN_ID}_display_settings_panel`,
      icon: "display_settings",
      toolbars: [
        new Toolbar(`${PLUGIN_ID}_controls_toolbar`, {
          id: `${PLUGIN_ID}_controls_toolbar`,
          children: [
            "toggle_pbr",
            `${PLUGIN_ID}_correct_lights`,
            `${PLUGIN_ID}_create_material_texture`,
            `${PLUGIN_ID}_show_channel_menu`,
          ],
          name: "PBR",
        }),
        new Toolbar(`${PLUGIN_ID}_display_settings_toolbar`, {
          id: `${PLUGIN_ID}_display_settings_toolbar`,
          children: [
            "display_settings_tone_mapping",
            "display_settings_exposure",
          ],
          name: "Display Settings",
        }),
      ],
      display_condition: {
        modes: ["edit", "paint", "animate"],
        project: true,
      },
      component: {},
      expand_button: true,
      growable: false,
      onFold() {},
      onResize() {},
      default_side: "left",
      default_position: {
        slot: "left_bar",
        float_position: [0, 0],
        float_size: [400, 300],
        height: 300,
        folded: false,
      },
      insert_after: "textures",
      insert_before: "color",
    });

    materialBrushPanel = new Panel(`${PLUGIN_ID}_material_brush_panel`, {
      name: "Material Brush",
      id: `${PLUGIN_ID}_material_brush_panel`,
      icon: "view_in_ar",
      toolbars: [
        new Toolbar(`${PLUGIN_ID}_material_brush_toolbar`, {
          id: `${PLUGIN_ID}_material_brush_toolbar`,
          children: [
            "material_brush",
            "slider_brush_metalness",
            "slider_brush_roughness",
            "brush_emissive_color",
            "slider_brush_height",
          ],
          name: "Material Brush",
        }),
      ],
      display_condition: {
        modes: ["paint"],
        project: true,
      },
      component: {},
      expand_button: true,
      growable: false,
      onFold() {},
      onResize() {},
      default_side: "right",
      default_position: {
        slot: "right_bar",
        float_position: [0, 0],
        float_size: [400, 300],
        height: 300,
        folded: false,
      },
      insert_after: "color",
      insert_before: "outliner",
    });

    MenuBar.addAction(generateMer, "file.export");
    MenuBar.addAction(generateNormal, "tools");
    MenuBar.addAction(decodeMer, "tools");
    MenuBar.addAction(createTextureSet, "file.export");
    MenuBar.addAction(togglePbr, "view");
    MenuBar.addAction(toggleCorrectLights, "preview");
    MenuBar.addAction(createMaterialTexture, "tools");
    MenuBar.addAction(bakeTexturesAction, "tools");
    MenuBar.addAction(materialBrushTool, "tools.0");

    MenuBar.addAction(openChannelMenu, "image.0");
  };

  //
  // Teardown
  //
  const onunload = () => {
    Object.entries(channelActions).forEach(([key, action]) => {
      action.delete();
    });

    MenuBar.removeAction(`file.export.${PLUGIN_ID}_create_mer`);
    MenuBar.removeAction(`file.export.${PLUGIN_ID}_create_texture_set`);
    MenuBar.removeAction(`tools.${PLUGIN_ID}_generate_normal`);
    disableListeners();

    displaySettingsPanel?.delete();
    textureSetDialog?.delete();
    createMaterialTexture?.delete();
    generateMer?.delete();
    generateNormal?.delete();
    togglePbr?.delete();
    decodeMer?.delete();
    bakeTexturesAction?.delete();
    bakeTexturesDialog?.delete();
    createTextureSet?.delete();
    textureChannelProp?.delete();
    channelProp?.delete();
    showChannelMenu?.delete();
    exposureSlider?.delete();
    tonemappingSelect?.delete();
    toggleCorrectLights?.delete();
    unassignChannel?.delete();
    projectMaterialsProp?.delete();
    pbrMaterialsProp?.delete();
    projectPbrModeProp?.delete();
    materialBrushTool?.delete();
    materialBrushPanel?.delete();
    setBrushMaterial?.delete();
    brushMetalnessSlider?.delete();
    brushRoughnessSlider?.delete();
    brushEmissiveColor?.delete();
    brushHeightSlider?.delete();
    openChannelMenu?.delete();
  };

  //
  // Plugin Registration
  //

  BBPlugin.register(PLUGIN_ID, {
    version: PLUGIN_VERSION,
    title: "PBR Features",
    author: "Jason J. Gardner",
    description:
      "Create RTX/Deferred Rendering textures in Blockbench. Adds support for previewing PBR materials and exporting them in Minecraft-compatible formats.",
    tags: ["PBR", "RTX", "Deferred Rendering"],
    icon: "icon.png",
    variant: "both",
    await_loading: true,
    new_repository_format: true,
    repository: "https://github.com/jasonjgardner/blockbench-plugins",
    has_changelog: true,
    min_version: "4.10.1",
    onload,
    onunload,
  });
})();
