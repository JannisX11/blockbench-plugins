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
}

(() => {
  let decodeMer: Action;
  let createTextureSet: Action;
  let generateMer: Action;
  let generateNormal: Action;
  let unassignChannel: Action;
  let togglePbr: Toggle;
  let pbrDisplaySetting: Setting;
  let displaySettingsPanel: Panel;
  let textureSetDialog: Dialog;
  let channelProp: Property;
  let channelMenu: Menu;
  let showChannelMenu: Action;
  let exposureSlider: BarSlider;
  let tonemappingSelect: BarSelect;
  let toggleCorrectLights: Toggle;
  let exposureSetting: Setting;
  let correctLightsSetting: Setting;
  let tonemappingSetting: Setting;
  let pbrMaterialsProp: Property;
  let projectMaterialsProp: Property;
  let projectPbrModeProp: Property;

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
    },
    metalness: {
      id: "metalness",
      label: "Metalness",
      description: "The material's metalness map",
      map: "metalnessMap",
      icon: "brightness_6",
    },
    emissive: {
      id: "emissive",
      label: "Emissive",
      description: "The material's emissive map",
      map: "emissiveMap",
      icon: "wb_twilight",
    },
    roughness: {
      id: "roughness",
      label: "Roughness",
      description: "The material's roughness map",
      map: "roughnessMap",
      icon: "grain",
    },
    height: {
      id: "height",
      label: "Height",
      description: "The material's height map",
      map: "bumpMap",
      icon: "landscape",
    },
    normal: {
      id: "normal",
      label: "Normal",
      description: "The material's normal map",
      map: "normalMap",
      icon: "looks",
    },
    ao: {
      id: "ao",
      label: "Ambient Occlusion",
      description: "The material's ambient occlusion map",
      map: "aoMap",
      icon: "motion_mode",
    },
  };

  const getProjectTextures = (layers = true) => {
    const allTextures = Project ? Project.textures ?? Texture.all : Texture.all;

    if (!layers) {
      return allTextures;
    }

    return allTextures
      .filter((t: Texture) => t.layers.length > 0)
      .flatMap((t: Texture) => t.layers);
  };

  //
  // Classes
  //

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

      return new THREE.MeshStandardMaterial({
        map:
          this.getTexture(CHANNELS.albedo) ??
          PbrMaterial.makePixelatedCanvas(
            TextureLayer.selected?.canvas ??
              Texture.all.find((t) => t.selected)?.canvas ??
              Texture.all[0].canvas,
          ),
        aoMap: this.getTexture(CHANNELS.ao),
        normalMap: this.getTexture(CHANNELS.normal),
        bumpMap: this.getTexture(CHANNELS.height),
        metalnessMap,
        // metalness: metalnessMap ? 1 : 0,
        roughnessMap,
        // roughness: roughnessMap ? 1 : 0,
        emissiveMap,
        emissiveIntensity: emissiveMap ? 1 : 0,
        emissive: emissiveMap ? 0xffffff : 0,
        envMap: PreviewScene.active?.cubemap ?? null,
        envMapIntensity: 1,
        alphaTest: 0.5,
        ...options,
      });
    }

    saveTexture(channel: IChannel, { uuid, extend }: Texture | TextureLayer) {
      if (!Project) {
        return;
      }

      if (!Project.pbr_materials) {
        Project.pbr_materials = {};
      }

      if (!Project.pbr_materials[this._materialUuid]) {
        Project.pbr_materials[this._materialUuid] = {};
      }

      Project.pbr_materials[this._materialUuid][channel.id] = uuid;
      extend({ channel: channel.id });
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

      if (!materialData && inference) {
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

    decodeMer(emissiveThreshold = 25.5): {
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

      const width = Math.max(texture.img.width ?? texture.canvas.width, 16);
      const height = Math.max(texture.img.height ?? texture.canvas.height, 16);

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
          },
          texture.texture,
        );
        texture.texture.layers.push(normalMapLayer);

        return normalMapLayer;
      }

      const normalMapTexture = new Texture({
        name,
        saved: false,
        particle: false,
        keep_size: true,
      }).fromDataURL(dataUrl);

      if (Project) {
        Project.textures.push(normalMapTexture);
      }

      return normalMapTexture;
    }
  }

  channelProp = new Property(TextureLayer, "enum", "channel", {
    default: NA_CHANNEL,
    values: Object.keys(CHANNELS).map((key) => CHANNELS[key].id),
    label: "PBR Channel",
    exposed: false,
  });

  pbrMaterialsProp = new Property(ModelProject, "object", "pbr_materials", {
    default: {},
    exposed: false,
    label: "PBR Materials",
  });

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

  /**
   * ### Export MER map
   * Generates a MER map from the currently selected texture and exports it as a PNG file
   * @param cb Callback function to run after the MER file is exported
   * @returns void
   */
  const exportMer = (cb?: (filePath: string) => void) => {
    const selected = Texture.all.find((t) => t.selected);

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
            `${selected.name ?? Project.getDisplayName()}_mer`,
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
      (Texture.all.length === 0 && Modes.id !== `${PLUGIN_ID}_mode`)
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

      const projectNormalMap = mat.findTexture(CHANNELS.normal, false)?.name;
      const projectHeightMap = mat.findTexture(CHANNELS.height, false)?.name;
      const projectColorMap = mat.findTexture(CHANNELS.albedo, false)?.name;
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
            format_version: "1.16.200",
            "minecraft:texture_set": {
              color:
                (projectColorMap
                  ? pathToName(projectColorMap, false)
                  : formResult.baseColor?.toHexString()) ?? baseName,
              metalness_emissive_roughness: [
                formResult.metalness ?? 0,
                formResult.emissive ?? 0,
                formResult.roughness ?? 255,
              ],
            },
          };

          if (formResult.depthMap === "normal" && projectNormalMap) {
            textureSet["minecraft:texture_set"].normal = pathToName(
              projectNormalMap,
              false,
            );
          } else if (
            (!projectNormalMap || formResult.depthMap === "heightmap") &&
            projectHeightMap
          ) {
            textureSet["minecraft:texture_set"].heightmap = pathToName(
              projectHeightMap,
              false,
            );
          }

          const exportTextureSet = () =>
            Blockbench.export(
              {
                content: JSON.stringify(textureSet, null, 2),
                type: "JSON",
                name: `${baseName}.texture_set`,
                extensions: ["json"],
                resource_id: "texture_set",
                startpath: Project.export_path,
              },
              () => {
                Blockbench.showQuickMessage("Texture set created", 2000);
                textureSetDialog.hide();
              },
            );

          if (hasMer) {
            exportMer((filePath) => {
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
    // Settings
    //
    pbrDisplaySetting = new Setting("pbr_active", {
      category: "preview",
      name: "Enable PBR Preview",
      description: "Enables PBR preview in the editor",
      type: "toggle",
      default_value: false,
      icon: "tonality",
      launch_setting: true,
      onChange(value) {
        if (value) {
          applyPbrMaterial();
          enableListeners();
          return;
        }
        disablePbr();
        disableListeners();
      },
    });

    correctLightsSetting = new Setting("display_settings_correct_lights", {
      category: "preview",
      name: "Correct Lights",
      description: "Corrects the lighting in the preview for PBR materials",
      type: "toggle",
      default_value: false,
      icon: "light_mode",
      condition: () => !!Project,
      onChange(value) {
        Preview.selected.renderer.physicallyCorrectLights = value;

        applyPbrMaterial();
      },
    });

    tonemappingSetting = new Setting("display_settings_tone_mapping", {
      category: "preview",
      name: "Tone Mapping",
      description: "Changes the tone mapping of the preview",
      type: "select",
      default_value: THREE.NoToneMapping,
      value: THREE.NoToneMapping,
      icon: "palette",
      options: {
        [THREE.NoToneMapping]: "None",
        [THREE.LinearToneMapping]: "Linear",
        [THREE.ReinhardToneMapping]: "Reinhard",
        [THREE.CineonToneMapping]: "Cineon",
        [THREE.ACESFilmicToneMapping]: "ACES",
      },
      onChange(value) {
        Preview.selected.renderer.toneMapping = Number(
          value,
        ) as THREE.ToneMapping;

        applyPbrMaterial();
      },
    });

    exposureSetting = new Setting("display_settings_exposure", {
      category: "preview",
      name: "Exposure",
      description: "Adjusts the exposure of the scene",
      type: "number",
      default_value: 1,
      icon: "exposure",
      step: 0.1,
      min: -2,
      max: 2,
      // condition: () =>
      //   Project &&
      //   Project.pbr_active &&
      //   Preview.selected.renderer.toneMapping !== THREE.NoToneMapping,
      onChange(value) {
        Preview.selected.renderer.toneMappingExposure = Math.max(
          -2,
          Math.min(2, Number(value)),
        );
      },
    });

    //
    // Actions
    //

    generateNormal = new Action(`${PLUGIN_ID}_generate_normal`, {
      icon: "altitude",
      name: "Generate Normal Map",
      description: "Generates a normal map from the height map",
      condition: () =>
        (TextureLayer.selected || Texture.all.find((t) => t.selected)) !==
        undefined,
      click() {
        const selected =
          TextureLayer.selected ?? Texture.all.find((t) => t.selected);
        const mat = new PbrMaterial(getProjectTextures(), selected.uuid);

        const texture =
          TextureLayer.selected ??
          Texture.all.find((t) => t.selected) ??
          mat.findTexture(CHANNELS.height, true);

        if (!texture) {
          Blockbench.showQuickMessage("No height map found", 2000);
          return;
        }

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
      condition: () => Format.id == "bedrock",
      click() {
        exportMer();
      },
    });

    decodeMer = new Action(`${PLUGIN_ID}_decode_mer`, {
      icon: "arrow_split",
      name: "Decode MER",
      description:
        "Decodes a MER texture map into metalness, emissive, and roughness channels",
      condition: () => Format.id == "bedrock",
      click() {
        const projectTextures = getProjectTextures();
        const selected =
          TextureLayer.selected?.texture ?? Texture.all.find((t) => t.selected);

        const mat = new PbrMaterial(
          projectTextures,
          (selected ?? projectTextures[0]).uuid,
        );

        const mer = mat.decodeMer();
        const merChannels = [
          CHANNELS.metalness,
          CHANNELS.emissive,
          CHANNELS.roughness,
        ];

        merChannels.forEach((channel) => {
          const key = channel.id as keyof typeof mer;
          const canvas = mer[key];

          if (!canvas) {
            return;
          }

          const layer = new TextureLayer(
            {
              name: `${selected?.name}_${key}`,
              data_url: canvas.toDataURL(),
            },
            selected.layers_enabled ? selected.texture : selected,
          );
          // projectTextures.push(layer);
          mat.saveTexture(channel, layer);
        });
      },
    });

    createTextureSet = new Action(`${PLUGIN_ID}_create_texture_set`, {
      name: "Create Texture Set",
      icon: "layers",
      description:
        "Creates a texture set JSON file. Generates a MER when metalness, emissive, or roughness channels are set.",
      condition: () => Format.id == "bedrock",
      click() {
        createTextureSetDialog();
      },
    });

    Object.entries(CHANNELS).forEach(([key, channel]) => {
      channelActions[key] = new Action(`${PLUGIN_ID}_assign_channel_${key}`, {
        icon: channel.icon ?? "tv_options_edit_channels",
        name: `Assign to ${channel.label.toLocaleLowerCase()} channel`,
        description: `Assign the selected layer to the ${channel.label} channel`,
        category: "textures",
        condition: () => Modes.paint && TextureLayer.selected,
        click(e) {
          const layer = TextureLayer.selected;

          if (!layer || !Project) {
            return;
          }

          Undo.initEdit({ layers: [layer] });

          layer.extend({ channel: key });

          const texture = layer.texture;

          texture.updateChangesAfterEdit();

          if (!Project.pbr_materials[texture.uuid]) {
            Project.pbr_materials[texture.uuid] = {};
          }

          // If the layer uuid is already assigned to another channel, unassign it first
          Object.entries(Project.pbr_materials[texture.uuid]).forEach(
            ([assignedChannel, assignedLayerUuid]) => {
              if (assignedLayerUuid === layer.uuid) {
                delete Project.pbr_materials[texture.uuid][assignedChannel];
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
      click() {
        const layer = TextureLayer.selected;

        if (!layer || !Project) {
          return;
        }

        Undo.initEdit({ layers: [layer] });

        const { texture, channel } = layer;

        texture.updateChangesAfterEdit();

        Project.pbr_materials[texture.uuid] = {};

        layer.channel = NA_CHANNEL;
        Undo.finishEdit("Unassign channel");

        Blockbench.showQuickMessage(
          `Unassigned "${layer.name}" from ${channel} channel`,
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
      condition: () => (Project && Project.textures.length > 0) === true,
      linked_setting: "pbr_active",
      default: false,
      click() {},
      onChange(value) {
        Blockbench.showQuickMessage(
          `PBR Preview is now ${value ? "enabled" : "disabled"}`,
          2000,
        );
      },
    });

    toggleCorrectLights = new Toggle(`${PLUGIN_ID}_correct_lights`, {
      category: "preview",
      name: "Correct Lights",
      description: "Corrects the lighting in the preview",
      icon: "fluorescent",
      linked_setting: "display_settings_correct_lights",
      default: false,
      onChange(value) {
        Blockbench.showQuickMessage(
          `Physically corrected lighting is now ${value ? "enabled" : "disabled"}`,
          2000,
        );
      },
      click() {},
    });

    exposureSlider = new BarSlider(`${PLUGIN_ID}_exposure`, {
      category: "preview",
      name: "Exposure",
      description: "Adjusts the exposure of the scene",
      icon: "exposure",
      min: -2,
      max: 2,
      step: 0.1,
      value: Settings.get("display_settings_exposure") ?? 1,
      display_condition: {
        modes: ["edit", "paint", "animate"],
        project: true,
      },
      onChange({ value }) {
        exposureSetting.set(value);
      },
    });

    exposureSlider.addLabel(true, exposureSlider);

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

    showChannelMenu = new Action(`${PLUGIN_ID}_show_channel_menu`, {
      icon: "texture",
      name: "Assign to PBR Channel",
      description: "Assign the selected layer to a channel",
      category: "textures",
      condition: () => Modes.paint && TextureLayer.selected,
      click(event) {
        channelMenu.open(event as MouseEvent);
      },
    });

    tonemappingSelect = new BarSelect(`${PLUGIN_ID}_tonemapping`, {
      category: "preview",
      name: "Tone Mapping",
      description: "Select the tone mapping function",
      icon: "palette",
      value: THREE.NoToneMapping,
      linked_setting: "display_settings_tone_mapping",
      options: {
        [THREE.NoToneMapping]: {
          name: "No Tone Mapping",
          icon: "invert_colors_off",
        },
        [THREE.LinearToneMapping]: {
          name: "Linear",
          icon: "linear_scale",
        },
        [THREE.ReinhardToneMapping]: {
          name: "Reinhard",
          icon: "brightness_medium",
        },
        [THREE.CineonToneMapping]: {
          name: "Cineon",
          icon: "brightness_high",
        },
        [THREE.ACESFilmicToneMapping]: {
          name: "ACES",
          icon: "brightness_auto",
        },
      },
      onChange({ value }) {
        tonemappingSetting.set(value);

        applyPbrMaterial();
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
            `${PLUGIN_ID}_show_channel_menu`,
          ],
          name: "PBR",
        }),
        new Toolbar(`${PLUGIN_ID}_display_settings_toolbar`, {
          id: `${PLUGIN_ID}_display_settings_toolbar`,
          children: [`${PLUGIN_ID}_tonemapping`, `${PLUGIN_ID}_exposure`],
          // condition: () => Project && Project.pbr_active,
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
      insert_before: "paint",
    });

    MenuBar.addAction(generateMer, "file.export");
    MenuBar.addAction(generateNormal, "tools");
    MenuBar.addAction(decodeMer, "tools");
    MenuBar.addAction(createTextureSet, "file.export");
    MenuBar.addAction(togglePbr, "view");
    MenuBar.addAction(toggleCorrectLights, "preview");

    Object.entries(channelActions).forEach(([key, action], idx) => {
      MenuBar.addAction(action, `image.${idx}`);
    });

    enableListeners();
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
    pbrDisplaySetting?.delete();
    generateMer?.delete();
    generateNormal?.delete();
    togglePbr?.delete();
    decodeMer?.delete();
    createTextureSet?.delete();
    channelProp?.delete();
    showChannelMenu?.delete();
    exposureSetting?.delete();
    exposureSlider?.delete();
    tonemappingSelect?.delete();
    toggleCorrectLights?.delete();
    correctLightsSetting?.delete();
    tonemappingSetting?.delete();
    deactivatePbr?.delete();
    unassignChannel?.delete();
    projectMaterialsProp?.delete();
    pbrMaterialsProp?.delete();
    projectPbrModeProp?.delete();
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
