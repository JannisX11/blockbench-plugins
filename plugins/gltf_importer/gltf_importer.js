(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // plugin/GLTFLoader.js
  var GLTFLoader_exports = {};
  var init_GLTFLoader = __esm({
    "plugin/GLTFLoader.js"() {
      (function() {
        class GLTFLoader extends THREE.Loader {
          constructor(manager) {
            super(manager);
            this.dracoLoader = null;
            this.ktx2Loader = null;
            this.meshoptDecoder = null;
            this.pluginCallbacks = [];
            this.register(function(parser) {
              return new GLTFMaterialsClearcoatExtension(parser);
            });
            this.register(function(parser) {
              return new GLTFTextureBasisUExtension(parser);
            });
            this.register(function(parser) {
              return new GLTFTextureWebPExtension(parser);
            });
            this.register(function(parser) {
              return new GLTFMaterialsTransmissionExtension(parser);
            });
            this.register(function(parser) {
              return new GLTFMaterialsVolumeExtension(parser);
            });
            this.register(function(parser) {
              return new GLTFMaterialsIorExtension(parser);
            });
            this.register(function(parser) {
              return new GLTFMaterialsSpecularExtension(parser);
            });
            this.register(function(parser) {
              return new GLTFLightsExtension(parser);
            });
            this.register(function(parser) {
              return new GLTFMeshoptCompression(parser);
            });
          }
          load(url, onLoad, onProgress, onError) {
            const scope = this;
            let resourcePath;
            if (this.resourcePath !== "") {
              resourcePath = this.resourcePath;
            } else if (this.path !== "") {
              resourcePath = this.path;
            } else {
              resourcePath = THREE.LoaderUtils.extractUrlBase(url);
            }
            this.manager.itemStart(url);
            const _onError = function(e) {
              if (onError) {
                onError(e);
              } else {
                console.error(e);
              }
              scope.manager.itemError(url);
              scope.manager.itemEnd(url);
            };
            const loader = new THREE.FileLoader(this.manager);
            loader.setPath(this.path);
            loader.setResponseType("arraybuffer");
            loader.setRequestHeader(this.requestHeader);
            loader.setWithCredentials(this.withCredentials);
            loader.load(url, function(data) {
              try {
                scope.parse(data, resourcePath, function(gltf) {
                  onLoad(gltf);
                  scope.manager.itemEnd(url);
                }, _onError);
              } catch (e) {
                _onError(e);
              }
            }, onProgress, _onError);
          }
          setDRACOLoader(dracoLoader) {
            this.dracoLoader = dracoLoader;
            return this;
          }
          setDDSLoader() {
            throw new Error('THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".');
          }
          setKTX2Loader(ktx2Loader) {
            this.ktx2Loader = ktx2Loader;
            return this;
          }
          setMeshoptDecoder(meshoptDecoder) {
            this.meshoptDecoder = meshoptDecoder;
            return this;
          }
          register(callback) {
            if (this.pluginCallbacks.indexOf(callback) === -1) {
              this.pluginCallbacks.push(callback);
            }
            return this;
          }
          unregister(callback) {
            if (this.pluginCallbacks.indexOf(callback) !== -1) {
              this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(callback), 1);
            }
            return this;
          }
          parse(data, path, onLoad, onError) {
            let content;
            const extensions = {};
            const plugins = {};
            if (typeof data === "string") {
              content = data;
            } else {
              const magic = THREE.LoaderUtils.decodeText(new Uint8Array(data, 0, 4));
              if (magic === BINARY_EXTENSION_HEADER_MAGIC) {
                try {
                  extensions[EXTENSIONS.KHR_BINARY_GLTF] = new GLTFBinaryExtension(data);
                } catch (error) {
                  if (onError) onError(error);
                  return;
                }
                content = extensions[EXTENSIONS.KHR_BINARY_GLTF].content;
              } else {
                content = THREE.LoaderUtils.decodeText(new Uint8Array(data));
              }
            }
            const json = JSON.parse(content);
            if (json.asset === void 0 || json.asset.version[0] < 2) {
              if (onError) onError(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
              return;
            }
            const parser = new GLTFParser(json, {
              path: path || this.resourcePath || "",
              crossOrigin: this.crossOrigin,
              requestHeader: this.requestHeader,
              manager: this.manager,
              ktx2Loader: this.ktx2Loader,
              meshoptDecoder: this.meshoptDecoder
            });
            parser.fileLoader.setRequestHeader(this.requestHeader);
            for (let i = 0; i < this.pluginCallbacks.length; i++) {
              const plugin = this.pluginCallbacks[i](parser);
              plugins[plugin.name] = plugin;
              extensions[plugin.name] = true;
            }
            if (json.extensionsUsed) {
              for (let i = 0; i < json.extensionsUsed.length; ++i) {
                const extensionName = json.extensionsUsed[i];
                const extensionsRequired = json.extensionsRequired || [];
                switch (extensionName) {
                  case EXTENSIONS.KHR_MATERIALS_UNLIT:
                    extensions[extensionName] = new GLTFMaterialsUnlitExtension();
                    break;
                  case EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS:
                    extensions[extensionName] = new GLTFMaterialsPbrSpecularGlossinessExtension();
                    break;
                  case EXTENSIONS.KHR_DRACO_MESH_COMPRESSION:
                    extensions[extensionName] = new GLTFDracoMeshCompressionExtension(json, this.dracoLoader);
                    break;
                  case EXTENSIONS.KHR_TEXTURE_TRANSFORM:
                    extensions[extensionName] = new GLTFTextureTransformExtension();
                    break;
                  case EXTENSIONS.KHR_MESH_QUANTIZATION:
                    extensions[extensionName] = new GLTFMeshQuantizationExtension();
                    break;
                  default:
                    if (extensionsRequired.indexOf(extensionName) >= 0 && plugins[extensionName] === void 0) {
                      console.warn('THREE.GLTFLoader: Unknown extension "' + extensionName + '".');
                    }
                }
              }
            }
            parser.setExtensions(extensions);
            parser.setPlugins(plugins);
            parser.parse(onLoad, onError);
          }
        }
        function GLTFRegistry() {
          let objects = {};
          return {
            get: function(key) {
              return objects[key];
            },
            add: function(key, object) {
              objects[key] = object;
            },
            remove: function(key) {
              delete objects[key];
            },
            removeAll: function() {
              objects = {};
            }
          };
        }
        const EXTENSIONS = {
          KHR_BINARY_GLTF: "KHR_binary_glTF",
          KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
          KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
          KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
          KHR_MATERIALS_IOR: "KHR_materials_ior",
          KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS: "KHR_materials_pbrSpecularGlossiness",
          KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
          KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
          KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
          KHR_MATERIALS_VOLUME: "KHR_materials_volume",
          KHR_TEXTURE_BASISU: "KHR_texture_basisu",
          KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
          KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
          EXT_TEXTURE_WEBP: "EXT_texture_webp",
          EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression"
        };
        class GLTFLightsExtension {
          constructor(parser) {
            this.parser = parser;
            this.name = EXTENSIONS.KHR_LIGHTS_PUNCTUAL;
            this.cache = {
              refs: {},
              uses: {}
            };
          }
          _markDefs() {
            const parser = this.parser;
            const nodeDefs = this.parser.json.nodes || [];
            for (let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
              const nodeDef = nodeDefs[nodeIndex];
              if (nodeDef.extensions && nodeDef.extensions[this.name] && nodeDef.extensions[this.name].light !== void 0) {
                parser._addNodeRef(this.cache, nodeDef.extensions[this.name].light);
              }
            }
          }
          _loadLight(lightIndex) {
            const parser = this.parser;
            const cacheKey = "light:" + lightIndex;
            let dependency = parser.cache.get(cacheKey);
            if (dependency) return dependency;
            const json = parser.json;
            const extensions = json.extensions && json.extensions[this.name] || {};
            const lightDefs = extensions.lights || [];
            const lightDef = lightDefs[lightIndex];
            let lightNode;
            const color = new THREE.Color(16777215);
            if (lightDef.color !== void 0) color.fromArray(lightDef.color);
            const range = lightDef.range !== void 0 ? lightDef.range : 0;
            switch (lightDef.type) {
              case "directional":
                lightNode = new THREE.DirectionalLight(color);
                lightNode.target.position.set(0, 0, -1);
                lightNode.add(lightNode.target);
                break;
              case "point":
                lightNode = new THREE.PointLight(color);
                lightNode.distance = range;
                break;
              case "spot":
                lightNode = new THREE.SpotLight(color);
                lightNode.distance = range;
                lightDef.spot = lightDef.spot || {};
                lightDef.spot.innerConeAngle = lightDef.spot.innerConeAngle !== void 0 ? lightDef.spot.innerConeAngle : 0;
                lightDef.spot.outerConeAngle = lightDef.spot.outerConeAngle !== void 0 ? lightDef.spot.outerConeAngle : Math.PI / 4;
                lightNode.angle = lightDef.spot.outerConeAngle;
                lightNode.penumbra = 1 - lightDef.spot.innerConeAngle / lightDef.spot.outerConeAngle;
                lightNode.target.position.set(0, 0, -1);
                lightNode.add(lightNode.target);
                break;
              default:
                throw new Error("THREE.GLTFLoader: Unexpected light type: " + lightDef.type);
            }
            lightNode.position.set(0, 0, 0);
            lightNode.decay = 2;
            if (lightDef.intensity !== void 0) lightNode.intensity = lightDef.intensity;
            lightNode.name = parser.createUniqueName(lightDef.name || "light_" + lightIndex);
            dependency = Promise.resolve(lightNode);
            parser.cache.add(cacheKey, dependency);
            return dependency;
          }
          createNodeAttachment(nodeIndex) {
            const self2 = this;
            const parser = this.parser;
            const json = parser.json;
            const nodeDef = json.nodes[nodeIndex];
            const lightDef = nodeDef.extensions && nodeDef.extensions[this.name] || {};
            const lightIndex = lightDef.light;
            if (lightIndex === void 0) return null;
            return this._loadLight(lightIndex).then(function(light) {
              return parser._getNodeRef(self2.cache, lightIndex, light);
            });
          }
        }
        class GLTFMaterialsUnlitExtension {
          constructor() {
            this.name = EXTENSIONS.KHR_MATERIALS_UNLIT;
          }
          getMaterialType() {
            return THREE.MeshBasicMaterial;
          }
          extendParams(materialParams, materialDef, parser) {
            const pending = [];
            materialParams.color = new THREE.Color(1, 1, 1);
            materialParams.opacity = 1;
            const metallicRoughness = materialDef.pbrMetallicRoughness;
            if (metallicRoughness) {
              if (Array.isArray(metallicRoughness.baseColorFactor)) {
                const array = metallicRoughness.baseColorFactor;
                materialParams.color.fromArray(array);
                materialParams.opacity = array[3];
              }
              if (metallicRoughness.baseColorTexture !== void 0) {
                pending.push(parser.assignTexture(materialParams, "map", metallicRoughness.baseColorTexture));
              }
            }
            return Promise.all(pending);
          }
        }
        class GLTFMaterialsClearcoatExtension {
          constructor(parser) {
            this.parser = parser;
            this.name = EXTENSIONS.KHR_MATERIALS_CLEARCOAT;
          }
          getMaterialType(materialIndex) {
            const parser = this.parser;
            const materialDef = parser.json.materials[materialIndex];
            if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;
            return THREE.MeshPhysicalMaterial;
          }
          extendMaterialParams(materialIndex, materialParams) {
            const parser = this.parser;
            const materialDef = parser.json.materials[materialIndex];
            if (!materialDef.extensions || !materialDef.extensions[this.name]) {
              return Promise.resolve();
            }
            const pending = [];
            const extension = materialDef.extensions[this.name];
            if (extension.clearcoatFactor !== void 0) {
              materialParams.clearcoat = extension.clearcoatFactor;
            }
            if (extension.clearcoatTexture !== void 0) {
              pending.push(parser.assignTexture(materialParams, "clearcoatMap", extension.clearcoatTexture));
            }
            if (extension.clearcoatRoughnessFactor !== void 0) {
              materialParams.clearcoatRoughness = extension.clearcoatRoughnessFactor;
            }
            if (extension.clearcoatRoughnessTexture !== void 0) {
              pending.push(parser.assignTexture(materialParams, "clearcoatRoughnessMap", extension.clearcoatRoughnessTexture));
            }
            if (extension.clearcoatNormalTexture !== void 0) {
              pending.push(parser.assignTexture(materialParams, "clearcoatNormalMap", extension.clearcoatNormalTexture));
              if (extension.clearcoatNormalTexture.scale !== void 0) {
                const scale = extension.clearcoatNormalTexture.scale;
                materialParams.clearcoatNormalScale = new THREE.Vector2(scale, -scale);
              }
            }
            return Promise.all(pending);
          }
        }
        class GLTFMaterialsTransmissionExtension {
          constructor(parser) {
            this.parser = parser;
            this.name = EXTENSIONS.KHR_MATERIALS_TRANSMISSION;
          }
          getMaterialType(materialIndex) {
            const parser = this.parser;
            const materialDef = parser.json.materials[materialIndex];
            if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;
            return THREE.MeshPhysicalMaterial;
          }
          extendMaterialParams(materialIndex, materialParams) {
            const parser = this.parser;
            const materialDef = parser.json.materials[materialIndex];
            if (!materialDef.extensions || !materialDef.extensions[this.name]) {
              return Promise.resolve();
            }
            const pending = [];
            const extension = materialDef.extensions[this.name];
            if (extension.transmissionFactor !== void 0) {
              materialParams.transmission = extension.transmissionFactor;
            }
            if (extension.transmissionTexture !== void 0) {
              pending.push(parser.assignTexture(materialParams, "transmissionMap", extension.transmissionTexture));
            }
            return Promise.all(pending);
          }
        }
        class GLTFMaterialsVolumeExtension {
          constructor(parser) {
            this.parser = parser;
            this.name = EXTENSIONS.KHR_MATERIALS_VOLUME;
          }
          getMaterialType(materialIndex) {
            const parser = this.parser;
            const materialDef = parser.json.materials[materialIndex];
            if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;
            return THREE.MeshPhysicalMaterial;
          }
          extendMaterialParams(materialIndex, materialParams) {
            const parser = this.parser;
            const materialDef = parser.json.materials[materialIndex];
            if (!materialDef.extensions || !materialDef.extensions[this.name]) {
              return Promise.resolve();
            }
            const pending = [];
            const extension = materialDef.extensions[this.name];
            materialParams.thickness = extension.thicknessFactor !== void 0 ? extension.thicknessFactor : 0;
            if (extension.thicknessTexture !== void 0) {
              pending.push(parser.assignTexture(materialParams, "thicknessMap", extension.thicknessTexture));
            }
            materialParams.attenuationDistance = extension.attenuationDistance || 0;
            const colorArray = extension.attenuationColor || [1, 1, 1];
            materialParams.attenuationTint = new THREE.Color(colorArray[0], colorArray[1], colorArray[2]);
            return Promise.all(pending);
          }
        }
        class GLTFMaterialsIorExtension {
          constructor(parser) {
            this.parser = parser;
            this.name = EXTENSIONS.KHR_MATERIALS_IOR;
          }
          getMaterialType(materialIndex) {
            const parser = this.parser;
            const materialDef = parser.json.materials[materialIndex];
            if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;
            return THREE.MeshPhysicalMaterial;
          }
          extendMaterialParams(materialIndex, materialParams) {
            const parser = this.parser;
            const materialDef = parser.json.materials[materialIndex];
            if (!materialDef.extensions || !materialDef.extensions[this.name]) {
              return Promise.resolve();
            }
            const extension = materialDef.extensions[this.name];
            materialParams.ior = extension.ior !== void 0 ? extension.ior : 1.5;
            return Promise.resolve();
          }
        }
        class GLTFMaterialsSpecularExtension {
          constructor(parser) {
            this.parser = parser;
            this.name = EXTENSIONS.KHR_MATERIALS_SPECULAR;
          }
          getMaterialType(materialIndex) {
            const parser = this.parser;
            const materialDef = parser.json.materials[materialIndex];
            if (!materialDef.extensions || !materialDef.extensions[this.name]) return null;
            return THREE.MeshPhysicalMaterial;
          }
          extendMaterialParams(materialIndex, materialParams) {
            const parser = this.parser;
            const materialDef = parser.json.materials[materialIndex];
            if (!materialDef.extensions || !materialDef.extensions[this.name]) {
              return Promise.resolve();
            }
            const pending = [];
            const extension = materialDef.extensions[this.name];
            materialParams.specularIntensity = extension.specularFactor !== void 0 ? extension.specularFactor : 1;
            if (extension.specularTexture !== void 0) {
              pending.push(parser.assignTexture(materialParams, "specularIntensityMap", extension.specularTexture));
            }
            const colorArray = extension.specularColorFactor || [1, 1, 1];
            materialParams.specularTint = new THREE.Color(colorArray[0], colorArray[1], colorArray[2]);
            if (extension.specularColorTexture !== void 0) {
              pending.push(parser.assignTexture(materialParams, "specularTintMap", extension.specularColorTexture).then(function(texture) {
                texture.encoding = THREE.sRGBEncoding;
              }));
            }
            return Promise.all(pending);
          }
        }
        class GLTFTextureBasisUExtension {
          constructor(parser) {
            this.parser = parser;
            this.name = EXTENSIONS.KHR_TEXTURE_BASISU;
          }
          loadTexture(textureIndex) {
            const parser = this.parser;
            const json = parser.json;
            const textureDef = json.textures[textureIndex];
            if (!textureDef.extensions || !textureDef.extensions[this.name]) {
              return null;
            }
            const extension = textureDef.extensions[this.name];
            const source = json.images[extension.source];
            const loader = parser.options.ktx2Loader;
            if (!loader) {
              if (json.extensionsRequired && json.extensionsRequired.indexOf(this.name) >= 0) {
                throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
              } else {
                return null;
              }
            }
            return parser.loadTextureImage(textureIndex, source, loader);
          }
        }
        class GLTFTextureWebPExtension {
          constructor(parser) {
            this.parser = parser;
            this.name = EXTENSIONS.EXT_TEXTURE_WEBP;
            this.isSupported = null;
          }
          loadTexture(textureIndex) {
            const name = this.name;
            const parser = this.parser;
            const json = parser.json;
            const textureDef = json.textures[textureIndex];
            if (!textureDef.extensions || !textureDef.extensions[name]) {
              return null;
            }
            const extension = textureDef.extensions[name];
            const source = json.images[extension.source];
            let loader = parser.textureLoader;
            if (source.uri) {
              const handler = parser.options.manager.getHandler(source.uri);
              if (handler !== null) loader = handler;
            }
            return this.detectSupport().then(function(isSupported) {
              if (isSupported) return parser.loadTextureImage(textureIndex, source, loader);
              if (json.extensionsRequired && json.extensionsRequired.indexOf(name) >= 0) {
                throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");
              }
              return parser.loadTexture(textureIndex);
            });
          }
          detectSupport() {
            if (!this.isSupported) {
              this.isSupported = new Promise(function(resolve) {
                const image = new Image();
                image.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
                image.onload = image.onerror = function() {
                  resolve(image.height === 1);
                };
              });
            }
            return this.isSupported;
          }
        }
        class GLTFMeshoptCompression {
          constructor(parser) {
            this.name = EXTENSIONS.EXT_MESHOPT_COMPRESSION;
            this.parser = parser;
          }
          loadBufferView(index) {
            const json = this.parser.json;
            const bufferView = json.bufferViews[index];
            if (bufferView.extensions && bufferView.extensions[this.name]) {
              const extensionDef = bufferView.extensions[this.name];
              const buffer = this.parser.getDependency("buffer", extensionDef.buffer);
              const decoder = this.parser.options.meshoptDecoder;
              if (!decoder || !decoder.supported) {
                if (json.extensionsRequired && json.extensionsRequired.indexOf(this.name) >= 0) {
                  throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
                } else {
                  return null;
                }
              }
              return Promise.all([buffer, decoder.ready]).then(function(res) {
                const byteOffset = extensionDef.byteOffset || 0;
                const byteLength = extensionDef.byteLength || 0;
                const count = extensionDef.count;
                const stride = extensionDef.byteStride;
                const result = new ArrayBuffer(count * stride);
                const source = new Uint8Array(res[0], byteOffset, byteLength);
                decoder.decodeGltfBuffer(new Uint8Array(result), count, stride, source, extensionDef.mode, extensionDef.filter);
                return result;
              });
            } else {
              return null;
            }
          }
        }
        const BINARY_EXTENSION_HEADER_MAGIC = "glTF";
        const BINARY_EXTENSION_HEADER_LENGTH = 12;
        const BINARY_EXTENSION_CHUNK_TYPES = {
          JSON: 1313821514,
          BIN: 5130562
        };
        class GLTFBinaryExtension {
          constructor(data) {
            this.name = EXTENSIONS.KHR_BINARY_GLTF;
            this.content = null;
            this.body = null;
            const headerView = new DataView(data, 0, BINARY_EXTENSION_HEADER_LENGTH);
            this.header = {
              magic: THREE.LoaderUtils.decodeText(new Uint8Array(data.slice(0, 4))),
              version: headerView.getUint32(4, true),
              length: headerView.getUint32(8, true)
            };
            if (this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC) {
              throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
            } else if (this.header.version < 2) {
              throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
            }
            const chunkContentsLength = this.header.length - BINARY_EXTENSION_HEADER_LENGTH;
            const chunkView = new DataView(data, BINARY_EXTENSION_HEADER_LENGTH);
            let chunkIndex = 0;
            while (chunkIndex < chunkContentsLength) {
              const chunkLength = chunkView.getUint32(chunkIndex, true);
              chunkIndex += 4;
              const chunkType = chunkView.getUint32(chunkIndex, true);
              chunkIndex += 4;
              if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON) {
                const contentArray = new Uint8Array(data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength);
                this.content = THREE.LoaderUtils.decodeText(contentArray);
              } else if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN) {
                const byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
                this.body = data.slice(byteOffset, byteOffset + chunkLength);
              }
              chunkIndex += chunkLength;
            }
            if (this.content === null) {
              throw new Error("THREE.GLTFLoader: JSON content not found.");
            }
          }
        }
        class GLTFDracoMeshCompressionExtension {
          constructor(json, dracoLoader) {
            if (!dracoLoader) {
              throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
            }
            this.name = EXTENSIONS.KHR_DRACO_MESH_COMPRESSION;
            this.json = json;
            this.dracoLoader = dracoLoader;
            this.dracoLoader.preload();
          }
          decodePrimitive(primitive, parser) {
            const json = this.json;
            const dracoLoader = this.dracoLoader;
            const bufferViewIndex = primitive.extensions[this.name].bufferView;
            const gltfAttributeMap = primitive.extensions[this.name].attributes;
            const threeAttributeMap = {};
            const attributeNormalizedMap = {};
            const attributeTypeMap = {};
            for (const attributeName in gltfAttributeMap) {
              const threeAttributeName = ATTRIBUTES[attributeName] || attributeName.toLowerCase();
              threeAttributeMap[threeAttributeName] = gltfAttributeMap[attributeName];
            }
            for (const attributeName in primitive.attributes) {
              const threeAttributeName = ATTRIBUTES[attributeName] || attributeName.toLowerCase();
              if (gltfAttributeMap[attributeName] !== void 0) {
                const accessorDef = json.accessors[primitive.attributes[attributeName]];
                const componentType = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
                attributeTypeMap[threeAttributeName] = componentType;
                attributeNormalizedMap[threeAttributeName] = accessorDef.normalized === true;
              }
            }
            return parser.getDependency("bufferView", bufferViewIndex).then(function(bufferView) {
              return new Promise(function(resolve) {
                dracoLoader.decodeDracoFile(bufferView, function(geometry) {
                  for (const attributeName in geometry.attributes) {
                    const attribute = geometry.attributes[attributeName];
                    const normalized = attributeNormalizedMap[attributeName];
                    if (normalized !== void 0) attribute.normalized = normalized;
                  }
                  resolve(geometry);
                }, threeAttributeMap, attributeTypeMap);
              });
            });
          }
        }
        class GLTFTextureTransformExtension {
          constructor() {
            this.name = EXTENSIONS.KHR_TEXTURE_TRANSFORM;
          }
          extendTexture(texture, transform) {
            if (transform.texCoord !== void 0) {
              console.warn('THREE.GLTFLoader: Custom UV sets in "' + this.name + '" extension not yet supported.');
            }
            if (transform.offset === void 0 && transform.rotation === void 0 && transform.scale === void 0) {
              return texture;
            }
            texture = texture.clone();
            if (transform.offset !== void 0) {
              texture.offset.fromArray(transform.offset);
            }
            if (transform.rotation !== void 0) {
              texture.rotation = transform.rotation;
            }
            if (transform.scale !== void 0) {
              texture.repeat.fromArray(transform.scale);
            }
            texture.needsUpdate = true;
            return texture;
          }
        }
        class GLTFMeshStandardSGMaterial extends THREE.MeshStandardMaterial {
          constructor(params) {
            super();
            this.isGLTFSpecularGlossinessMaterial = true;
            const specularMapParsFragmentChunk = ["#ifdef USE_SPECULARMAP", "	uniform sampler2D specularMap;", "#endif"].join("\n");
            const glossinessMapParsFragmentChunk = ["#ifdef USE_GLOSSINESSMAP", "	uniform sampler2D glossinessMap;", "#endif"].join("\n");
            const specularMapFragmentChunk = ["vec3 specularFactor = specular;", "#ifdef USE_SPECULARMAP", "	vec4 texelSpecular = texture2D( specularMap, vUv );", "	texelSpecular = sRGBToLinear( texelSpecular );", "	// reads channel RGB, compatible with a glTF Specular-Glossiness (RGBA) texture", "	specularFactor *= texelSpecular.rgb;", "#endif"].join("\n");
            const glossinessMapFragmentChunk = ["float glossinessFactor = glossiness;", "#ifdef USE_GLOSSINESSMAP", "	vec4 texelGlossiness = texture2D( glossinessMap, vUv );", "	// reads channel A, compatible with a glTF Specular-Glossiness (RGBA) texture", "	glossinessFactor *= texelGlossiness.a;", "#endif"].join("\n");
            const lightPhysicalFragmentChunk = ["PhysicalMaterial material;", "material.diffuseColor = diffuseColor.rgb * ( 1. - max( specularFactor.r, max( specularFactor.g, specularFactor.b ) ) );", "vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );", "float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );", "material.roughness = max( 1.0 - glossinessFactor, 0.0525 ); // 0.0525 corresponds to the base mip of a 256 cubemap.", "material.roughness += geometryRoughness;", "material.roughness = min( material.roughness, 1.0 );", "material.specularColor = specularFactor;"].join("\n");
            const uniforms = {
              specular: {
                value: new THREE.Color().setHex(16777215)
              },
              glossiness: {
                value: 1
              },
              specularMap: {
                value: null
              },
              glossinessMap: {
                value: null
              }
            };
            this._extraUniforms = uniforms;
            this.onBeforeCompile = function(shader) {
              for (const uniformName in uniforms) {
                shader.uniforms[uniformName] = uniforms[uniformName];
              }
              shader.fragmentShader = shader.fragmentShader.replace("uniform float roughness;", "uniform vec3 specular;").replace("uniform float metalness;", "uniform float glossiness;").replace("#include <roughnessmap_pars_fragment>", specularMapParsFragmentChunk).replace("#include <metalnessmap_pars_fragment>", glossinessMapParsFragmentChunk).replace("#include <roughnessmap_fragment>", specularMapFragmentChunk).replace("#include <metalnessmap_fragment>", glossinessMapFragmentChunk).replace("#include <lights_physical_fragment>", lightPhysicalFragmentChunk);
            };
            Object.defineProperties(this, {
              specular: {
                get: function() {
                  return uniforms.specular.value;
                },
                set: function(v) {
                  uniforms.specular.value = v;
                }
              },
              specularMap: {
                get: function() {
                  return uniforms.specularMap.value;
                },
                set: function(v) {
                  uniforms.specularMap.value = v;
                  if (v) {
                    this.defines.USE_SPECULARMAP = "";
                  } else {
                    delete this.defines.USE_SPECULARMAP;
                  }
                }
              },
              glossiness: {
                get: function() {
                  return uniforms.glossiness.value;
                },
                set: function(v) {
                  uniforms.glossiness.value = v;
                }
              },
              glossinessMap: {
                get: function() {
                  return uniforms.glossinessMap.value;
                },
                set: function(v) {
                  uniforms.glossinessMap.value = v;
                  if (v) {
                    this.defines.USE_GLOSSINESSMAP = "";
                    this.defines.USE_UV = "";
                  } else {
                    delete this.defines.USE_GLOSSINESSMAP;
                    delete this.defines.USE_UV;
                  }
                }
              }
            });
            delete this.metalness;
            delete this.roughness;
            delete this.metalnessMap;
            delete this.roughnessMap;
            this.setValues(params);
          }
          copy(source) {
            super.copy(source);
            this.specularMap = source.specularMap;
            this.specular.copy(source.specular);
            this.glossinessMap = source.glossinessMap;
            this.glossiness = source.glossiness;
            delete this.metalness;
            delete this.roughness;
            delete this.metalnessMap;
            delete this.roughnessMap;
            return this;
          }
        }
        class GLTFMaterialsPbrSpecularGlossinessExtension {
          constructor() {
            this.name = EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS;
            this.specularGlossinessParams = ["color", "map", "lightMap", "lightMapIntensity", "aoMap", "aoMapIntensity", "emissive", "emissiveIntensity", "emissiveMap", "bumpMap", "bumpScale", "normalMap", "normalMapType", "displacementMap", "displacementScale", "displacementBias", "specularMap", "specular", "glossinessMap", "glossiness", "alphaMap", "envMap", "envMapIntensity", "refractionRatio"];
          }
          getMaterialType() {
            return GLTFMeshStandardSGMaterial;
          }
          extendParams(materialParams, materialDef, parser) {
            const pbrSpecularGlossiness = materialDef.extensions[this.name];
            materialParams.color = new THREE.Color(1, 1, 1);
            materialParams.opacity = 1;
            const pending = [];
            if (Array.isArray(pbrSpecularGlossiness.diffuseFactor)) {
              const array = pbrSpecularGlossiness.diffuseFactor;
              materialParams.color.fromArray(array);
              materialParams.opacity = array[3];
            }
            if (pbrSpecularGlossiness.diffuseTexture !== void 0) {
              pending.push(parser.assignTexture(materialParams, "map", pbrSpecularGlossiness.diffuseTexture));
            }
            materialParams.emissive = new THREE.Color(0, 0, 0);
            materialParams.glossiness = pbrSpecularGlossiness.glossinessFactor !== void 0 ? pbrSpecularGlossiness.glossinessFactor : 1;
            materialParams.specular = new THREE.Color(1, 1, 1);
            if (Array.isArray(pbrSpecularGlossiness.specularFactor)) {
              materialParams.specular.fromArray(pbrSpecularGlossiness.specularFactor);
            }
            if (pbrSpecularGlossiness.specularGlossinessTexture !== void 0) {
              const specGlossMapDef = pbrSpecularGlossiness.specularGlossinessTexture;
              pending.push(parser.assignTexture(materialParams, "glossinessMap", specGlossMapDef));
              pending.push(parser.assignTexture(materialParams, "specularMap", specGlossMapDef));
            }
            return Promise.all(pending);
          }
          createMaterial(materialParams) {
            const material = new GLTFMeshStandardSGMaterial(materialParams);
            material.fog = true;
            material.color = materialParams.color;
            material.map = materialParams.map === void 0 ? null : materialParams.map;
            material.lightMap = null;
            material.lightMapIntensity = 1;
            material.aoMap = materialParams.aoMap === void 0 ? null : materialParams.aoMap;
            material.aoMapIntensity = 1;
            material.emissive = materialParams.emissive;
            material.emissiveIntensity = 1;
            material.emissiveMap = materialParams.emissiveMap === void 0 ? null : materialParams.emissiveMap;
            material.bumpMap = materialParams.bumpMap === void 0 ? null : materialParams.bumpMap;
            material.bumpScale = 1;
            material.normalMap = materialParams.normalMap === void 0 ? null : materialParams.normalMap;
            material.normalMapType = THREE.TangentSpaceNormalMap;
            if (materialParams.normalScale) material.normalScale = materialParams.normalScale;
            material.displacementMap = null;
            material.displacementScale = 1;
            material.displacementBias = 0;
            material.specularMap = materialParams.specularMap === void 0 ? null : materialParams.specularMap;
            material.specular = materialParams.specular;
            material.glossinessMap = materialParams.glossinessMap === void 0 ? null : materialParams.glossinessMap;
            material.glossiness = materialParams.glossiness;
            material.alphaMap = null;
            material.envMap = materialParams.envMap === void 0 ? null : materialParams.envMap;
            material.envMapIntensity = 1;
            material.refractionRatio = 0.98;
            return material;
          }
        }
        class GLTFMeshQuantizationExtension {
          constructor() {
            this.name = EXTENSIONS.KHR_MESH_QUANTIZATION;
          }
        }
        class GLTFCubicSplineInterpolant extends THREE.Interpolant {
          constructor(parameterPositions, sampleValues, sampleSize, resultBuffer) {
            super(parameterPositions, sampleValues, sampleSize, resultBuffer);
          }
          copySampleValue_(index) {
            const result = this.resultBuffer, values = this.sampleValues, valueSize = this.valueSize, offset = index * valueSize * 3 + valueSize;
            for (let i = 0; i !== valueSize; i++) {
              result[i] = values[offset + i];
            }
            return result;
          }
        }
        GLTFCubicSplineInterpolant.prototype.beforeStart_ = GLTFCubicSplineInterpolant.prototype.copySampleValue_;
        GLTFCubicSplineInterpolant.prototype.afterEnd_ = GLTFCubicSplineInterpolant.prototype.copySampleValue_;
        GLTFCubicSplineInterpolant.prototype.interpolate_ = function(i1, t0, t, t1) {
          const result = this.resultBuffer;
          const values = this.sampleValues;
          const stride = this.valueSize;
          const stride2 = stride * 2;
          const stride3 = stride * 3;
          const td = t1 - t0;
          const p = (t - t0) / td;
          const pp = p * p;
          const ppp = pp * p;
          const offset1 = i1 * stride3;
          const offset0 = offset1 - stride3;
          const s2 = -2 * ppp + 3 * pp;
          const s3 = ppp - pp;
          const s0 = 1 - s2;
          const s1 = s3 - pp + p;
          for (let i = 0; i !== stride; i++) {
            const p0 = values[offset0 + i + stride];
            const m0 = values[offset0 + i + stride2] * td;
            const p1 = values[offset1 + i + stride];
            const m1 = values[offset1 + i] * td;
            result[i] = s0 * p0 + s1 * m0 + s2 * p1 + s3 * m1;
          }
          return result;
        };
        const _q = new THREE.Quaternion();
        class GLTFCubicSplineQuaternionInterpolant extends GLTFCubicSplineInterpolant {
          interpolate_(i1, t0, t, t1) {
            const result = super.interpolate_(i1, t0, t, t1);
            _q.fromArray(result).normalize().toArray(result);
            return result;
          }
        }
        const WEBGL_CONSTANTS = {
          FLOAT: 5126,
          //FLOAT_MAT2: 35674,
          FLOAT_MAT3: 35675,
          FLOAT_MAT4: 35676,
          FLOAT_VEC2: 35664,
          FLOAT_VEC3: 35665,
          FLOAT_VEC4: 35666,
          LINEAR: 9729,
          REPEAT: 10497,
          SAMPLER_2D: 35678,
          POINTS: 0,
          LINES: 1,
          LINE_LOOP: 2,
          LINE_STRIP: 3,
          TRIANGLES: 4,
          TRIANGLE_STRIP: 5,
          TRIANGLE_FAN: 6,
          UNSIGNED_BYTE: 5121,
          UNSIGNED_SHORT: 5123
        };
        const WEBGL_COMPONENT_TYPES = {
          5120: Int8Array,
          5121: Uint8Array,
          5122: Int16Array,
          5123: Uint16Array,
          5125: Uint32Array,
          5126: Float32Array
        };
        const WEBGL_FILTERS = {
          9728: THREE.NearestFilter,
          9729: THREE.LinearFilter,
          9984: THREE.NearestMipmapNearestFilter,
          9985: THREE.LinearMipmapNearestFilter,
          9986: THREE.NearestMipmapLinearFilter,
          9987: THREE.LinearMipmapLinearFilter
        };
        const WEBGL_WRAPPINGS = {
          33071: THREE.ClampToEdgeWrapping,
          33648: THREE.MirroredRepeatWrapping,
          10497: THREE.RepeatWrapping
        };
        const WEBGL_TYPE_SIZES = {
          "SCALAR": 1,
          "VEC2": 2,
          "VEC3": 3,
          "VEC4": 4,
          "MAT2": 4,
          "MAT3": 9,
          "MAT4": 16
        };
        const ATTRIBUTES = {
          POSITION: "position",
          NORMAL: "normal",
          TANGENT: "tangent",
          TEXCOORD_0: "uv",
          TEXCOORD_1: "uv2",
          COLOR_0: "color",
          WEIGHTS_0: "skinWeight",
          JOINTS_0: "skinIndex"
        };
        const PATH_PROPERTIES = {
          scale: "scale",
          translation: "position",
          rotation: "quaternion",
          weights: "morphTargetInfluences"
        };
        const INTERPOLATION = {
          CUBICSPLINE: void 0,
          // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
          // keyframe track will be initialized with a default interpolation type, then modified.
          LINEAR: THREE.InterpolateLinear,
          STEP: THREE.InterpolateDiscrete
        };
        const ALPHA_MODES = {
          OPAQUE: "OPAQUE",
          MASK: "MASK",
          BLEND: "BLEND"
        };
        function resolveURL(url, path) {
          if (typeof url !== "string" || url === "") return "";
          if (/^https?:\/\//i.test(path) && /^\//.test(url)) {
            path = path.replace(/(^https?:\/\/[^\/]+).*/i, "$1");
          }
          if (/^(https?:)?\/\//i.test(url)) return url;
          if (/^data:.*,.*$/i.test(url)) return url;
          if (/^blob:.*$/i.test(url)) return url;
          return path + url;
        }
        function createDefaultMaterial(cache) {
          if (cache["DefaultMaterial"] === void 0) {
            cache["DefaultMaterial"] = new THREE.MeshStandardMaterial({
              color: 16777215,
              emissive: 0,
              metalness: 1,
              roughness: 1,
              transparent: false,
              depthTest: true,
              side: THREE.FrontSide
            });
          }
          return cache["DefaultMaterial"];
        }
        function addUnknownExtensionsToUserData(knownExtensions, object, objectDef) {
          for (const name in objectDef.extensions) {
            if (knownExtensions[name] === void 0) {
              object.userData.gltfExtensions = object.userData.gltfExtensions || {};
              object.userData.gltfExtensions[name] = objectDef.extensions[name];
            }
          }
        }
        function assignExtrasToUserData(object, gltfDef) {
          if (gltfDef.extras !== void 0) {
            if (typeof gltfDef.extras === "object") {
              Object.assign(object.userData, gltfDef.extras);
            } else {
              console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + gltfDef.extras);
            }
          }
        }
        function addMorphTargets(geometry, targets, parser) {
          let hasMorphPosition = false;
          let hasMorphNormal = false;
          for (let i = 0, il = targets.length; i < il; i++) {
            const target = targets[i];
            if (target.POSITION !== void 0) hasMorphPosition = true;
            if (target.NORMAL !== void 0) hasMorphNormal = true;
            if (hasMorphPosition && hasMorphNormal) break;
          }
          if (!hasMorphPosition && !hasMorphNormal) return Promise.resolve(geometry);
          const pendingPositionAccessors = [];
          const pendingNormalAccessors = [];
          for (let i = 0, il = targets.length; i < il; i++) {
            const target = targets[i];
            if (hasMorphPosition) {
              const pendingAccessor = target.POSITION !== void 0 ? parser.getDependency("accessor", target.POSITION) : geometry.attributes.position;
              pendingPositionAccessors.push(pendingAccessor);
            }
            if (hasMorphNormal) {
              const pendingAccessor = target.NORMAL !== void 0 ? parser.getDependency("accessor", target.NORMAL) : geometry.attributes.normal;
              pendingNormalAccessors.push(pendingAccessor);
            }
          }
          return Promise.all([Promise.all(pendingPositionAccessors), Promise.all(pendingNormalAccessors)]).then(function(accessors) {
            const morphPositions = accessors[0];
            const morphNormals = accessors[1];
            if (hasMorphPosition) geometry.morphAttributes.position = morphPositions;
            if (hasMorphNormal) geometry.morphAttributes.normal = morphNormals;
            geometry.morphTargetsRelative = true;
            return geometry;
          });
        }
        function updateMorphTargets(mesh, meshDef) {
          mesh.updateMorphTargets();
          if (meshDef.weights !== void 0) {
            for (let i = 0, il = meshDef.weights.length; i < il; i++) {
              mesh.morphTargetInfluences[i] = meshDef.weights[i];
            }
          }
          if (meshDef.extras && Array.isArray(meshDef.extras.targetNames)) {
            const targetNames = meshDef.extras.targetNames;
            if (mesh.morphTargetInfluences.length === targetNames.length) {
              mesh.morphTargetDictionary = {};
              for (let i = 0, il = targetNames.length; i < il; i++) {
                mesh.morphTargetDictionary[targetNames[i]] = i;
              }
            } else {
              console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
            }
          }
        }
        function createPrimitiveKey(primitiveDef) {
          const dracoExtension = primitiveDef.extensions && primitiveDef.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION];
          let geometryKey;
          if (dracoExtension) {
            geometryKey = "draco:" + dracoExtension.bufferView + ":" + dracoExtension.indices + ":" + createAttributesKey(dracoExtension.attributes);
          } else {
            geometryKey = primitiveDef.indices + ":" + createAttributesKey(primitiveDef.attributes) + ":" + primitiveDef.mode;
          }
          return geometryKey;
        }
        function createAttributesKey(attributes) {
          let attributesKey = "";
          const keys = Object.keys(attributes).sort();
          for (let i = 0, il = keys.length; i < il; i++) {
            attributesKey += keys[i] + ":" + attributes[keys[i]] + ";";
          }
          return attributesKey;
        }
        function getNormalizedComponentScale(constructor) {
          switch (constructor) {
            case Int8Array:
              return 1 / 127;
            case Uint8Array:
              return 1 / 255;
            case Int16Array:
              return 1 / 32767;
            case Uint16Array:
              return 1 / 65535;
            default:
              throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
          }
        }
        class GLTFParser {
          constructor(json = {}, options = {}) {
            this.json = json;
            this.extensions = {};
            this.plugins = {};
            this.options = options;
            this.cache = new GLTFRegistry();
            this.associations = /* @__PURE__ */ new Map();
            this.primitiveCache = {};
            this.meshCache = {
              refs: {},
              uses: {}
            };
            this.cameraCache = {
              refs: {},
              uses: {}
            };
            this.lightCache = {
              refs: {},
              uses: {}
            };
            this.textureCache = {};
            this.nodeNamesUsed = {};
            if (typeof createImageBitmap !== "undefined" && /Firefox/.test(navigator.userAgent) === false) {
              this.textureLoader = new THREE.ImageBitmapLoader(this.options.manager);
            } else {
              this.textureLoader = new THREE.TextureLoader(this.options.manager);
            }
            this.textureLoader.setCrossOrigin(this.options.crossOrigin);
            this.textureLoader.setRequestHeader(this.options.requestHeader);
            this.fileLoader = new THREE.FileLoader(this.options.manager);
            this.fileLoader.setResponseType("arraybuffer");
            if (this.options.crossOrigin === "use-credentials") {
              this.fileLoader.setWithCredentials(true);
            }
          }
          setExtensions(extensions) {
            this.extensions = extensions;
          }
          setPlugins(plugins) {
            this.plugins = plugins;
          }
          parse(onLoad, onError) {
            const parser = this;
            const json = this.json;
            const extensions = this.extensions;
            this.cache.removeAll();
            this._invokeAll(function(ext) {
              return ext._markDefs && ext._markDefs();
            });
            Promise.all(this._invokeAll(function(ext) {
              return ext.beforeRoot && ext.beforeRoot();
            })).then(function() {
              return Promise.all([parser.getDependencies("scene"), parser.getDependencies("animation"), parser.getDependencies("camera")]);
            }).then(function(dependencies) {
              const result = {
                scene: dependencies[0][json.scene || 0],
                scenes: dependencies[0],
                animations: dependencies[1],
                cameras: dependencies[2],
                asset: json.asset,
                parser,
                userData: {}
              };
              addUnknownExtensionsToUserData(extensions, result, json);
              assignExtrasToUserData(result, json);
              Promise.all(parser._invokeAll(function(ext) {
                return ext.afterRoot && ext.afterRoot(result);
              })).then(function() {
                onLoad(result);
              });
            }).catch(onError);
          }
          /**
           * Marks the special nodes/meshes in json for efficient parse.
           */
          _markDefs() {
            const nodeDefs = this.json.nodes || [];
            const skinDefs = this.json.skins || [];
            const meshDefs = this.json.meshes || [];
            for (let skinIndex = 0, skinLength = skinDefs.length; skinIndex < skinLength; skinIndex++) {
              const joints = skinDefs[skinIndex].joints;
              for (let i = 0, il = joints.length; i < il; i++) {
                nodeDefs[joints[i]].isBone = true;
              }
            }
            for (let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
              const nodeDef = nodeDefs[nodeIndex];
              if (nodeDef.mesh !== void 0) {
                this._addNodeRef(this.meshCache, nodeDef.mesh);
                if (nodeDef.skin !== void 0) {
                  meshDefs[nodeDef.mesh].isSkinnedMesh = true;
                }
              }
              if (nodeDef.camera !== void 0) {
                this._addNodeRef(this.cameraCache, nodeDef.camera);
              }
            }
          }
          /**
           * Counts references to shared node / THREE.Object3D resources. These resources
           * can be reused, or "instantiated", at multiple nodes in the scene
           * hierarchy. THREE.Mesh, Camera, and Light instances are instantiated and must
           * be marked. Non-scenegraph resources (like Materials, Geometries, and
           * Textures) can be reused directly and are not marked here.
           *
           * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
           */
          _addNodeRef(cache, index) {
            if (index === void 0) return;
            if (cache.refs[index] === void 0) {
              cache.refs[index] = cache.uses[index] = 0;
            }
            cache.refs[index]++;
          }
          /** Returns a reference to a shared resource, cloning it if necessary. */
          _getNodeRef(cache, index, object) {
            if (cache.refs[index] <= 1) return object;
            const ref = object.clone();
            ref.name += "_instance_" + cache.uses[index]++;
            return ref;
          }
          _invokeOne(func) {
            const extensions = Object.values(this.plugins);
            extensions.push(this);
            for (let i = 0; i < extensions.length; i++) {
              const result = func(extensions[i]);
              if (result) return result;
            }
            return null;
          }
          _invokeAll(func) {
            const extensions = Object.values(this.plugins);
            extensions.unshift(this);
            const pending = [];
            for (let i = 0; i < extensions.length; i++) {
              const result = func(extensions[i]);
              if (result) pending.push(result);
            }
            return pending;
          }
          /**
           * Requests the specified dependency asynchronously, with caching.
           * @param {string} type
           * @param {number} index
           * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
           */
          getDependency(type, index) {
            const cacheKey = type + ":" + index;
            let dependency = this.cache.get(cacheKey);
            if (!dependency) {
              switch (type) {
                case "scene":
                  dependency = this.loadScene(index);
                  break;
                case "node":
                  dependency = this.loadNode(index);
                  break;
                case "mesh":
                  dependency = this._invokeOne(function(ext) {
                    return ext.loadMesh && ext.loadMesh(index);
                  });
                  break;
                case "accessor":
                  dependency = this.loadAccessor(index);
                  break;
                case "bufferView":
                  dependency = this._invokeOne(function(ext) {
                    return ext.loadBufferView && ext.loadBufferView(index);
                  });
                  break;
                case "buffer":
                  dependency = this.loadBuffer(index);
                  break;
                case "material":
                  dependency = this._invokeOne(function(ext) {
                    return ext.loadMaterial && ext.loadMaterial(index);
                  });
                  break;
                case "texture":
                  dependency = this._invokeOne(function(ext) {
                    return ext.loadTexture && ext.loadTexture(index);
                  });
                  break;
                case "skin":
                  dependency = this.loadSkin(index);
                  break;
                case "animation":
                  dependency = this.loadAnimation(index);
                  break;
                case "camera":
                  dependency = this.loadCamera(index);
                  break;
                default:
                  throw new Error("Unknown type: " + type);
              }
              this.cache.add(cacheKey, dependency);
            }
            return dependency;
          }
          /**
           * Requests all dependencies of the specified type asynchronously, with caching.
           * @param {string} type
           * @return {Promise<Array<Object>>}
           */
          getDependencies(type) {
            let dependencies = this.cache.get(type);
            if (!dependencies) {
              const parser = this;
              const defs = this.json[type + (type === "mesh" ? "es" : "s")] || [];
              dependencies = Promise.all(defs.map(function(def, index) {
                return parser.getDependency(type, index);
              }));
              this.cache.add(type, dependencies);
            }
            return dependencies;
          }
          /**
           * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
           * @param {number} bufferIndex
           * @return {Promise<ArrayBuffer>}
           */
          loadBuffer(bufferIndex) {
            const bufferDef = this.json.buffers[bufferIndex];
            const loader = this.fileLoader;
            if (bufferDef.type && bufferDef.type !== "arraybuffer") {
              throw new Error("THREE.GLTFLoader: " + bufferDef.type + " buffer type is not supported.");
            }
            if (bufferDef.uri === void 0 && bufferIndex === 0) {
              return Promise.resolve(this.extensions[EXTENSIONS.KHR_BINARY_GLTF].body);
            }
            const options = this.options;
            return new Promise(function(resolve, reject) {
              loader.load(resolveURL(bufferDef.uri, options.path), resolve, void 0, function() {
                reject(new Error('THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".'));
              });
            });
          }
          /**
           * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
           * @param {number} bufferViewIndex
           * @return {Promise<ArrayBuffer>}
           */
          loadBufferView(bufferViewIndex) {
            const bufferViewDef = this.json.bufferViews[bufferViewIndex];
            return this.getDependency("buffer", bufferViewDef.buffer).then(function(buffer) {
              const byteLength = bufferViewDef.byteLength || 0;
              const byteOffset = bufferViewDef.byteOffset || 0;
              return buffer.slice(byteOffset, byteOffset + byteLength);
            });
          }
          /**
           * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
           * @param {number} accessorIndex
           * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
           */
          loadAccessor(accessorIndex) {
            const parser = this;
            const json = this.json;
            const accessorDef = this.json.accessors[accessorIndex];
            if (accessorDef.bufferView === void 0 && accessorDef.sparse === void 0) {
              return Promise.resolve(null);
            }
            const pendingBufferViews = [];
            if (accessorDef.bufferView !== void 0) {
              pendingBufferViews.push(this.getDependency("bufferView", accessorDef.bufferView));
            } else {
              pendingBufferViews.push(null);
            }
            if (accessorDef.sparse !== void 0) {
              pendingBufferViews.push(this.getDependency("bufferView", accessorDef.sparse.indices.bufferView));
              pendingBufferViews.push(this.getDependency("bufferView", accessorDef.sparse.values.bufferView));
            }
            return Promise.all(pendingBufferViews).then(function(bufferViews) {
              const bufferView = bufferViews[0];
              const itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
              const TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
              const elementBytes = TypedArray.BYTES_PER_ELEMENT;
              const itemBytes = elementBytes * itemSize;
              const byteOffset = accessorDef.byteOffset || 0;
              const byteStride = accessorDef.bufferView !== void 0 ? json.bufferViews[accessorDef.bufferView].byteStride : void 0;
              const normalized = accessorDef.normalized === true;
              let array, bufferAttribute;
              if (byteStride && byteStride !== itemBytes) {
                const ibSlice = Math.floor(byteOffset / byteStride);
                const ibCacheKey = "InterleavedBuffer:" + accessorDef.bufferView + ":" + accessorDef.componentType + ":" + ibSlice + ":" + accessorDef.count;
                let ib = parser.cache.get(ibCacheKey);
                if (!ib) {
                  array = new TypedArray(bufferView, ibSlice * byteStride, accessorDef.count * byteStride / elementBytes);
                  ib = new THREE.InterleavedBuffer(array, byteStride / elementBytes);
                  parser.cache.add(ibCacheKey, ib);
                }
                bufferAttribute = new THREE.InterleavedBufferAttribute(ib, itemSize, byteOffset % byteStride / elementBytes, normalized);
              } else {
                if (bufferView === null) {
                  array = new TypedArray(accessorDef.count * itemSize);
                } else {
                  array = new TypedArray(bufferView, byteOffset, accessorDef.count * itemSize);
                }
                bufferAttribute = new THREE.BufferAttribute(array, itemSize, normalized);
              }
              if (accessorDef.sparse !== void 0) {
                const itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
                const TypedArrayIndices = WEBGL_COMPONENT_TYPES[accessorDef.sparse.indices.componentType];
                const byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
                const byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;
                const sparseIndices = new TypedArrayIndices(bufferViews[1], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices);
                const sparseValues = new TypedArray(bufferViews[2], byteOffsetValues, accessorDef.sparse.count * itemSize);
                if (bufferView !== null) {
                  bufferAttribute = new THREE.BufferAttribute(bufferAttribute.array.slice(), bufferAttribute.itemSize, bufferAttribute.normalized);
                }
                for (let i = 0, il = sparseIndices.length; i < il; i++) {
                  const index = sparseIndices[i];
                  bufferAttribute.setX(index, sparseValues[i * itemSize]);
                  if (itemSize >= 2) bufferAttribute.setY(index, sparseValues[i * itemSize + 1]);
                  if (itemSize >= 3) bufferAttribute.setZ(index, sparseValues[i * itemSize + 2]);
                  if (itemSize >= 4) bufferAttribute.setW(index, sparseValues[i * itemSize + 3]);
                  if (itemSize >= 5) throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse THREE.BufferAttribute.");
                }
              }
              return bufferAttribute;
            });
          }
          /**
           * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
           * @param {number} textureIndex
           * @return {Promise<THREE.Texture>}
           */
          loadTexture(textureIndex) {
            const json = this.json;
            const options = this.options;
            const textureDef = json.textures[textureIndex];
            const source = json.images[textureDef.source];
            let loader = this.textureLoader;
            if (source.uri) {
              const handler = options.manager.getHandler(source.uri);
              if (handler !== null) loader = handler;
            }
            return this.loadTextureImage(textureIndex, source, loader);
          }
          loadTextureImage(textureIndex, source, loader) {
            const parser = this;
            const json = this.json;
            const options = this.options;
            const textureDef = json.textures[textureIndex];
            const cacheKey = (source.uri || source.bufferView) + ":" + textureDef.sampler;
            if (this.textureCache[cacheKey]) {
              return this.textureCache[cacheKey];
            }
            const URL = self.URL || self.webkitURL;
            let sourceURI = source.uri || "";
            let isObjectURL = false;
            let hasAlpha = true;
            const isJPEG = sourceURI.search(/\.jpe?g($|\?)/i) > 0 || sourceURI.search(/^data\:image\/jpeg/) === 0;
            if (source.mimeType === "image/jpeg" || isJPEG) hasAlpha = false;
            if (source.bufferView !== void 0) {
              sourceURI = parser.getDependency("bufferView", source.bufferView).then(function(bufferView) {
                if (source.mimeType === "image/png") {
                  const colorType = new DataView(bufferView, 25, 1).getUint8(0, false);
                  hasAlpha = colorType === 6 || colorType === 4 || colorType === 3;
                }
                isObjectURL = true;
                const blob = new Blob([bufferView], {
                  type: source.mimeType
                });
                sourceURI = URL.createObjectURL(blob);
                return sourceURI;
              });
            } else if (source.uri === void 0) {
              throw new Error("THREE.GLTFLoader: Image " + textureIndex + " is missing URI and bufferView");
            }
            const promise = Promise.resolve(sourceURI).then(function(sourceURI2) {
              return new Promise(function(resolve, reject) {
                let onLoad = resolve;
                if (loader.isImageBitmapLoader === true) {
                  onLoad = function(imageBitmap) {
                    const texture = new THREE.Texture(imageBitmap);
                    texture.needsUpdate = true;
                    resolve(texture);
                  };
                }
                loader.load(resolveURL(sourceURI2, options.path), onLoad, void 0, reject);
              });
            }).then(function(texture) {
              if (isObjectURL === true) {
                URL.revokeObjectURL(sourceURI);
              }
              texture.flipY = false;
              if (textureDef.name) texture.name = textureDef.name;
              if (!hasAlpha) texture.format = THREE.RGBFormat;
              const samplers = json.samplers || {};
              const sampler = samplers[textureDef.sampler] || {};
              texture.magFilter = WEBGL_FILTERS[sampler.magFilter] || THREE.LinearFilter;
              texture.minFilter = WEBGL_FILTERS[sampler.minFilter] || THREE.LinearMipmapLinearFilter;
              texture.wrapS = WEBGL_WRAPPINGS[sampler.wrapS] || THREE.RepeatWrapping;
              texture.wrapT = WEBGL_WRAPPINGS[sampler.wrapT] || THREE.RepeatWrapping;
              parser.associations.set(texture, {
                type: "textures",
                index: textureIndex
              });
              return texture;
            }).catch(function() {
              console.error("THREE.GLTFLoader: Couldn't load texture", sourceURI);
              return null;
            });
            this.textureCache[cacheKey] = promise;
            return promise;
          }
          /**
           * Asynchronously assigns a texture to the given material parameters.
           * @param {Object} materialParams
           * @param {string} mapName
           * @param {Object} mapDef
           * @return {Promise<Texture>}
           */
          assignTexture(materialParams, mapName, mapDef) {
            const parser = this;
            return this.getDependency("texture", mapDef.index).then(function(texture) {
              if (mapDef.texCoord !== void 0 && mapDef.texCoord != 0 && !(mapName === "aoMap" && mapDef.texCoord == 1)) {
                console.warn("THREE.GLTFLoader: Custom UV set " + mapDef.texCoord + " for texture " + mapName + " not yet supported.");
              }
              if (parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM]) {
                const transform = mapDef.extensions !== void 0 ? mapDef.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM] : void 0;
                if (transform) {
                  const gltfReference = parser.associations.get(texture);
                  texture = parser.extensions[EXTENSIONS.KHR_TEXTURE_TRANSFORM].extendTexture(texture, transform);
                  parser.associations.set(texture, gltfReference);
                }
              }
              materialParams[mapName] = texture;
              return texture;
            });
          }
          /**
           * Assigns final material to a THREE.Mesh, THREE.Line, or THREE.Points instance. The instance
           * already has a material (generated from the glTF material options alone)
           * but reuse of the same glTF material may require multiple threejs materials
           * to accommodate different primitive types, defines, etc. New materials will
           * be created if necessary, and reused from a cache.
           * @param  {Object3D} mesh THREE.Mesh, THREE.Line, or THREE.Points instance.
           */
          assignFinalMaterial(mesh) {
            const geometry = mesh.geometry;
            let material = mesh.material;
            const useVertexTangents = geometry.attributes.tangent !== void 0;
            const useVertexColors = geometry.attributes.color !== void 0;
            const useFlatShading = geometry.attributes.normal === void 0;
            if (mesh.isPoints) {
              const cacheKey = "PointsMaterial:" + material.uuid;
              let pointsMaterial = this.cache.get(cacheKey);
              if (!pointsMaterial) {
                pointsMaterial = new THREE.PointsMaterial();
                THREE.Material.prototype.copy.call(pointsMaterial, material);
                pointsMaterial.color.copy(material.color);
                pointsMaterial.map = material.map;
                pointsMaterial.sizeAttenuation = false;
                this.cache.add(cacheKey, pointsMaterial);
              }
              material = pointsMaterial;
            } else if (mesh.isLine) {
              const cacheKey = "LineBasicMaterial:" + material.uuid;
              let lineMaterial = this.cache.get(cacheKey);
              if (!lineMaterial) {
                lineMaterial = new THREE.LineBasicMaterial();
                THREE.Material.prototype.copy.call(lineMaterial, material);
                lineMaterial.color.copy(material.color);
                this.cache.add(cacheKey, lineMaterial);
              }
              material = lineMaterial;
            }
            if (useVertexTangents || useVertexColors || useFlatShading) {
              let cacheKey = "ClonedMaterial:" + material.uuid + ":";
              if (material.isGLTFSpecularGlossinessMaterial) cacheKey += "specular-glossiness:";
              if (useVertexTangents) cacheKey += "vertex-tangents:";
              if (useVertexColors) cacheKey += "vertex-colors:";
              if (useFlatShading) cacheKey += "flat-shading:";
              let cachedMaterial = this.cache.get(cacheKey);
              if (!cachedMaterial) {
                cachedMaterial = material.clone();
                if (useVertexColors) cachedMaterial.vertexColors = true;
                if (useFlatShading) cachedMaterial.flatShading = true;
                if (useVertexTangents) {
                  if (cachedMaterial.normalScale) cachedMaterial.normalScale.y *= -1;
                  if (cachedMaterial.clearcoatNormalScale) cachedMaterial.clearcoatNormalScale.y *= -1;
                }
                this.cache.add(cacheKey, cachedMaterial);
                this.associations.set(cachedMaterial, this.associations.get(material));
              }
              material = cachedMaterial;
            }
            if (material.aoMap && geometry.attributes.uv2 === void 0 && geometry.attributes.uv !== void 0) {
              geometry.setAttribute("uv2", geometry.attributes.uv);
            }
            mesh.material = material;
          }
          getMaterialType() {
            return THREE.MeshStandardMaterial;
          }
          /**
           * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
           * @param {number} materialIndex
           * @return {Promise<Material>}
           */
          loadMaterial(materialIndex) {
            const parser = this;
            const json = this.json;
            const extensions = this.extensions;
            const materialDef = json.materials[materialIndex];
            let materialType;
            const materialParams = {};
            const materialExtensions = materialDef.extensions || {};
            const pending = [];
            if (materialExtensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS]) {
              const sgExtension = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS];
              materialType = sgExtension.getMaterialType();
              pending.push(sgExtension.extendParams(materialParams, materialDef, parser));
            } else if (materialExtensions[EXTENSIONS.KHR_MATERIALS_UNLIT]) {
              const kmuExtension = extensions[EXTENSIONS.KHR_MATERIALS_UNLIT];
              materialType = kmuExtension.getMaterialType();
              pending.push(kmuExtension.extendParams(materialParams, materialDef, parser));
            } else {
              const metallicRoughness = materialDef.pbrMetallicRoughness || {};
              materialParams.color = new THREE.Color(1, 1, 1);
              materialParams.opacity = 1;
              if (Array.isArray(metallicRoughness.baseColorFactor)) {
                const array = metallicRoughness.baseColorFactor;
                materialParams.color.fromArray(array);
                materialParams.opacity = array[3];
              }
              if (metallicRoughness.baseColorTexture !== void 0) {
                pending.push(parser.assignTexture(materialParams, "map", metallicRoughness.baseColorTexture));
              }
              materialParams.metalness = metallicRoughness.metallicFactor !== void 0 ? metallicRoughness.metallicFactor : 1;
              materialParams.roughness = metallicRoughness.roughnessFactor !== void 0 ? metallicRoughness.roughnessFactor : 1;
              if (metallicRoughness.metallicRoughnessTexture !== void 0) {
                pending.push(parser.assignTexture(materialParams, "metalnessMap", metallicRoughness.metallicRoughnessTexture));
                pending.push(parser.assignTexture(materialParams, "roughnessMap", metallicRoughness.metallicRoughnessTexture));
              }
              materialType = this._invokeOne(function(ext) {
                return ext.getMaterialType && ext.getMaterialType(materialIndex);
              });
              pending.push(Promise.all(this._invokeAll(function(ext) {
                return ext.extendMaterialParams && ext.extendMaterialParams(materialIndex, materialParams);
              })));
            }
            if (materialDef.doubleSided === true) {
              materialParams.side = THREE.DoubleSide;
            }
            const alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;
            if (alphaMode === ALPHA_MODES.BLEND) {
              materialParams.transparent = true;
              materialParams.depthWrite = false;
            } else {
              materialParams.format = THREE.RGBFormat;
              materialParams.transparent = false;
              if (alphaMode === ALPHA_MODES.MASK) {
                materialParams.alphaTest = materialDef.alphaCutoff !== void 0 ? materialDef.alphaCutoff : 0.5;
              }
            }
            if (materialDef.normalTexture !== void 0 && materialType !== THREE.MeshBasicMaterial) {
              pending.push(parser.assignTexture(materialParams, "normalMap", materialDef.normalTexture));
              materialParams.normalScale = new THREE.Vector2(1, -1);
              if (materialDef.normalTexture.scale !== void 0) {
                materialParams.normalScale.set(materialDef.normalTexture.scale, -materialDef.normalTexture.scale);
              }
            }
            if (materialDef.occlusionTexture !== void 0 && materialType !== THREE.MeshBasicMaterial) {
              pending.push(parser.assignTexture(materialParams, "aoMap", materialDef.occlusionTexture));
              if (materialDef.occlusionTexture.strength !== void 0) {
                materialParams.aoMapIntensity = materialDef.occlusionTexture.strength;
              }
            }
            if (materialDef.emissiveFactor !== void 0 && materialType !== THREE.MeshBasicMaterial) {
              materialParams.emissive = new THREE.Color().fromArray(materialDef.emissiveFactor);
            }
            if (materialDef.emissiveTexture !== void 0 && materialType !== THREE.MeshBasicMaterial) {
              pending.push(parser.assignTexture(materialParams, "emissiveMap", materialDef.emissiveTexture));
            }
            return Promise.all(pending).then(function() {
              let material;
              if (materialType === GLTFMeshStandardSGMaterial) {
                material = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].createMaterial(materialParams);
              } else {
                material = new materialType(materialParams);
              }
              if (materialDef.name) material.name = materialDef.name;
              if (material.map) material.map.encoding = THREE.sRGBEncoding;
              if (material.emissiveMap) material.emissiveMap.encoding = THREE.sRGBEncoding;
              assignExtrasToUserData(material, materialDef);
              parser.associations.set(material, {
                type: "materials",
                index: materialIndex
              });
              if (materialDef.extensions) addUnknownExtensionsToUserData(extensions, material, materialDef);
              return material;
            });
          }
          /** When THREE.Object3D instances are targeted by animation, they need unique names. */
          createUniqueName(originalName) {
            const sanitizedName = THREE.PropertyBinding.sanitizeNodeName(originalName || "");
            let name = sanitizedName;
            for (let i = 1; this.nodeNamesUsed[name]; ++i) {
              name = sanitizedName + "_" + i;
            }
            this.nodeNamesUsed[name] = true;
            return name;
          }
          /**
           * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
           *
           * Creates BufferGeometries from primitives.
           *
           * @param {Array<GLTF.Primitive>} primitives
           * @return {Promise<Array<BufferGeometry>>}
           */
          loadGeometries(primitives) {
            const parser = this;
            const extensions = this.extensions;
            const cache = this.primitiveCache;
            function createDracoPrimitive(primitive) {
              return extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(primitive, parser).then(function(geometry) {
                return addPrimitiveAttributes(geometry, primitive, parser);
              });
            }
            const pending = [];
            for (let i = 0, il = primitives.length; i < il; i++) {
              const primitive = primitives[i];
              const cacheKey = createPrimitiveKey(primitive);
              const cached = cache[cacheKey];
              if (cached) {
                pending.push(cached.promise);
              } else {
                let geometryPromise;
                if (primitive.extensions && primitive.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]) {
                  geometryPromise = createDracoPrimitive(primitive);
                } else {
                  geometryPromise = addPrimitiveAttributes(new THREE.BufferGeometry(), primitive, parser);
                }
                cache[cacheKey] = {
                  primitive,
                  promise: geometryPromise
                };
                pending.push(geometryPromise);
              }
            }
            return Promise.all(pending);
          }
          /**
           * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
           * @param {number} meshIndex
           * @return {Promise<Group|Mesh|SkinnedMesh>}
           */
          loadMesh(meshIndex) {
            const parser = this;
            const json = this.json;
            const extensions = this.extensions;
            const meshDef = json.meshes[meshIndex];
            const primitives = meshDef.primitives;
            const pending = [];
            for (let i = 0, il = primitives.length; i < il; i++) {
              const material = primitives[i].material === void 0 ? createDefaultMaterial(this.cache) : this.getDependency("material", primitives[i].material);
              pending.push(material);
            }
            pending.push(parser.loadGeometries(primitives));
            return Promise.all(pending).then(function(results) {
              const materials = results.slice(0, results.length - 1);
              const geometries = results[results.length - 1];
              const meshes = [];
              for (let i = 0, il = geometries.length; i < il; i++) {
                const geometry = geometries[i];
                const primitive = primitives[i];
                let mesh;
                const material = materials[i];
                if (primitive.mode === WEBGL_CONSTANTS.TRIANGLES || primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP || primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN || primitive.mode === void 0) {
                  mesh = meshDef.isSkinnedMesh === true ? new THREE.SkinnedMesh(geometry, material) : new THREE.Mesh(geometry, material);
                  if (mesh.isSkinnedMesh === true && !mesh.geometry.attributes.skinWeight.normalized) {
                    mesh.normalizeSkinWeights();
                  }
                  if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) {
                    mesh.geometry = toTrianglesDrawMode(mesh.geometry, THREE.TriangleStripDrawMode);
                  } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) {
                    mesh.geometry = toTrianglesDrawMode(mesh.geometry, THREE.TriangleFanDrawMode);
                  }
                } else if (primitive.mode === WEBGL_CONSTANTS.LINES) {
                  mesh = new THREE.LineSegments(geometry, material);
                } else if (primitive.mode === WEBGL_CONSTANTS.LINE_STRIP) {
                  mesh = new THREE.Line(geometry, material);
                } else if (primitive.mode === WEBGL_CONSTANTS.LINE_LOOP) {
                  mesh = new THREE.LineLoop(geometry, material);
                } else if (primitive.mode === WEBGL_CONSTANTS.POINTS) {
                  mesh = new THREE.Points(geometry, material);
                } else {
                  throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + primitive.mode);
                }
                if (Object.keys(mesh.geometry.morphAttributes).length > 0) {
                  updateMorphTargets(mesh, meshDef);
                }
                mesh.name = parser.createUniqueName(meshDef.name || "mesh_" + meshIndex);
                assignExtrasToUserData(mesh, meshDef);
                if (primitive.extensions) addUnknownExtensionsToUserData(extensions, mesh, primitive);
                parser.assignFinalMaterial(mesh);
                meshes.push(mesh);
              }
              if (meshes.length === 1) {
                return meshes[0];
              }
              const group = new THREE.Group();
              for (let i = 0, il = meshes.length; i < il; i++) {
                group.add(meshes[i]);
              }
              return group;
            });
          }
          /**
           * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
           * @param {number} cameraIndex
           * @return {Promise<THREE.Camera>}
           */
          loadCamera(cameraIndex) {
            let camera;
            const cameraDef = this.json.cameras[cameraIndex];
            const params = cameraDef[cameraDef.type];
            if (!params) {
              console.warn("THREE.GLTFLoader: Missing camera parameters.");
              return;
            }
            if (cameraDef.type === "perspective") {
              camera = new THREE.PerspectiveCamera(THREE.MathUtils.radToDeg(params.yfov), params.aspectRatio || 1, params.znear || 1, params.zfar || 2e6);
            } else if (cameraDef.type === "orthographic") {
              camera = new THREE.OrthographicCamera(-params.xmag, params.xmag, params.ymag, -params.ymag, params.znear, params.zfar);
            }
            if (cameraDef.name) camera.name = this.createUniqueName(cameraDef.name);
            assignExtrasToUserData(camera, cameraDef);
            return Promise.resolve(camera);
          }
          /**
           * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
           * @param {number} skinIndex
           * @return {Promise<Object>}
           */
          loadSkin(skinIndex) {
            const skinDef = this.json.skins[skinIndex];
            const skinEntry = {
              joints: skinDef.joints
            };
            if (skinDef.inverseBindMatrices === void 0) {
              return Promise.resolve(skinEntry);
            }
            return this.getDependency("accessor", skinDef.inverseBindMatrices).then(function(accessor) {
              skinEntry.inverseBindMatrices = accessor;
              return skinEntry;
            });
          }
          /**
           * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
           * @param {number} animationIndex
           * @return {Promise<AnimationClip>}
           */
          loadAnimation(animationIndex) {
            const json = this.json;
            const animationDef = json.animations[animationIndex];
            const pendingNodes = [];
            const pendingInputAccessors = [];
            const pendingOutputAccessors = [];
            const pendingSamplers = [];
            const pendingTargets = [];
            for (let i = 0, il = animationDef.channels.length; i < il; i++) {
              const channel = animationDef.channels[i];
              const sampler = animationDef.samplers[channel.sampler];
              const target = channel.target;
              const name = target.node !== void 0 ? target.node : target.id;
              const input = animationDef.parameters !== void 0 ? animationDef.parameters[sampler.input] : sampler.input;
              const output = animationDef.parameters !== void 0 ? animationDef.parameters[sampler.output] : sampler.output;
              pendingNodes.push(this.getDependency("node", name));
              pendingInputAccessors.push(this.getDependency("accessor", input));
              pendingOutputAccessors.push(this.getDependency("accessor", output));
              pendingSamplers.push(sampler);
              pendingTargets.push(target);
            }
            return Promise.all([Promise.all(pendingNodes), Promise.all(pendingInputAccessors), Promise.all(pendingOutputAccessors), Promise.all(pendingSamplers), Promise.all(pendingTargets)]).then(function(dependencies) {
              const nodes = dependencies[0];
              const inputAccessors = dependencies[1];
              const outputAccessors = dependencies[2];
              const samplers = dependencies[3];
              const targets = dependencies[4];
              const tracks = [];
              for (let i = 0, il = nodes.length; i < il; i++) {
                const node = nodes[i];
                const inputAccessor = inputAccessors[i];
                const outputAccessor = outputAccessors[i];
                const sampler = samplers[i];
                const target = targets[i];
                if (node === void 0) continue;
                node.updateMatrix();
                node.matrixAutoUpdate = true;
                let TypedKeyframeTrack;
                switch (PATH_PROPERTIES[target.path]) {
                  case PATH_PROPERTIES.weights:
                    TypedKeyframeTrack = THREE.NumberKeyframeTrack;
                    break;
                  case PATH_PROPERTIES.rotation:
                    TypedKeyframeTrack = THREE.QuaternionKeyframeTrack;
                    break;
                  case PATH_PROPERTIES.position:
                  case PATH_PROPERTIES.scale:
                  default:
                    TypedKeyframeTrack = THREE.VectorKeyframeTrack;
                    break;
                }
                const targetName = node.name ? node.name : node.uuid;
                const interpolation = sampler.interpolation !== void 0 ? INTERPOLATION[sampler.interpolation] : THREE.InterpolateLinear;
                const targetNames = [];
                if (PATH_PROPERTIES[target.path] === PATH_PROPERTIES.weights) {
                  node.traverse(function(object) {
                    if (object.isMesh === true && object.morphTargetInfluences) {
                      targetNames.push(object.name ? object.name : object.uuid);
                    }
                  });
                } else {
                  targetNames.push(targetName);
                }
                let outputArray = outputAccessor.array;
                if (outputAccessor.normalized) {
                  const scale = getNormalizedComponentScale(outputArray.constructor);
                  const scaled = new Float32Array(outputArray.length);
                  for (let j = 0, jl = outputArray.length; j < jl; j++) {
                    scaled[j] = outputArray[j] * scale;
                  }
                  outputArray = scaled;
                }
                for (let j = 0, jl = targetNames.length; j < jl; j++) {
                  const track = new TypedKeyframeTrack(targetNames[j] + "." + PATH_PROPERTIES[target.path], inputAccessor.array, outputArray, interpolation);
                  if (sampler.interpolation === "CUBICSPLINE") {
                    track.createInterpolant = function InterpolantFactoryMethodGLTFCubicSpline(result) {
                      const interpolantType = this instanceof THREE.QuaternionKeyframeTrack ? GLTFCubicSplineQuaternionInterpolant : GLTFCubicSplineInterpolant;
                      return new interpolantType(this.times, this.values, this.getValueSize() / 3, result);
                    };
                    track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;
                  }
                  tracks.push(track);
                }
              }
              const name = animationDef.name ? animationDef.name : "animation_" + animationIndex;
              return new THREE.AnimationClip(name, void 0, tracks);
            });
          }
          createNodeMesh(nodeIndex) {
            const json = this.json;
            const parser = this;
            const nodeDef = json.nodes[nodeIndex];
            if (nodeDef.mesh === void 0) return null;
            return parser.getDependency("mesh", nodeDef.mesh).then(function(mesh) {
              const node = parser._getNodeRef(parser.meshCache, nodeDef.mesh, mesh);
              if (nodeDef.weights !== void 0) {
                node.traverse(function(o) {
                  if (!o.isMesh) return;
                  for (let i = 0, il = nodeDef.weights.length; i < il; i++) {
                    o.morphTargetInfluences[i] = nodeDef.weights[i];
                  }
                });
              }
              return node;
            });
          }
          /**
           * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
           * @param {number} nodeIndex
           * @return {Promise<Object3D>}
           */
          loadNode(nodeIndex) {
            const json = this.json;
            const extensions = this.extensions;
            const parser = this;
            const nodeDef = json.nodes[nodeIndex];
            const nodeName = nodeDef.name ? parser.createUniqueName(nodeDef.name) : "";
            return (function() {
              const pending = [];
              const meshPromise = parser._invokeOne(function(ext) {
                return ext.createNodeMesh && ext.createNodeMesh(nodeIndex);
              });
              if (meshPromise) {
                pending.push(meshPromise);
              }
              if (nodeDef.camera !== void 0) {
                pending.push(parser.getDependency("camera", nodeDef.camera).then(function(camera) {
                  return parser._getNodeRef(parser.cameraCache, nodeDef.camera, camera);
                }));
              }
              parser._invokeAll(function(ext) {
                return ext.createNodeAttachment && ext.createNodeAttachment(nodeIndex);
              }).forEach(function(promise) {
                pending.push(promise);
              });
              return Promise.all(pending);
            })().then(function(objects) {
              let node;
              if (nodeDef.isBone === true) {
                node = new THREE.Bone();
              } else if (objects.length > 1) {
                node = new THREE.Group();
              } else if (objects.length === 1) {
                node = objects[0];
              } else {
                node = new THREE.Object3D();
              }
              if (node !== objects[0]) {
                for (let i = 0, il = objects.length; i < il; i++) {
                  node.add(objects[i]);
                }
              }
              if (nodeDef.name) {
                node.userData.name = nodeDef.name;
                node.name = nodeName;
              }
              assignExtrasToUserData(node, nodeDef);
              if (nodeDef.extensions) addUnknownExtensionsToUserData(extensions, node, nodeDef);
              if (nodeDef.matrix !== void 0) {
                const matrix = new THREE.Matrix4();
                matrix.fromArray(nodeDef.matrix);
                node.applyMatrix4(matrix);
              } else {
                if (nodeDef.translation !== void 0) {
                  node.position.fromArray(nodeDef.translation);
                }
                if (nodeDef.rotation !== void 0) {
                  node.quaternion.fromArray(nodeDef.rotation);
                }
                if (nodeDef.scale !== void 0) {
                  node.scale.fromArray(nodeDef.scale);
                }
              }
              parser.associations.set(node, {
                type: "nodes",
                index: nodeIndex
              });
              return node;
            });
          }
          /**
           * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
           * @param {number} sceneIndex
           * @return {Promise<Group>}
           */
          loadScene(sceneIndex) {
            const json = this.json;
            const extensions = this.extensions;
            const sceneDef = this.json.scenes[sceneIndex];
            const parser = this;
            const scene = new THREE.Group();
            if (sceneDef.name) scene.name = parser.createUniqueName(sceneDef.name);
            assignExtrasToUserData(scene, sceneDef);
            if (sceneDef.extensions) addUnknownExtensionsToUserData(extensions, scene, sceneDef);
            const nodeIds = sceneDef.nodes || [];
            const pending = [];
            for (let i = 0, il = nodeIds.length; i < il; i++) {
              pending.push(buildNodeHierachy(nodeIds[i], scene, json, parser));
            }
            return Promise.all(pending).then(function() {
              return scene;
            });
          }
        }
        function buildNodeHierachy(nodeId, parentObject, json, parser) {
          const nodeDef = json.nodes[nodeId];
          return parser.getDependency("node", nodeId).then(function(node) {
            if (nodeDef.skin === void 0) return node;
            let skinEntry;
            return parser.getDependency("skin", nodeDef.skin).then(function(skin) {
              skinEntry = skin;
              const pendingJoints = [];
              for (let i = 0, il = skinEntry.joints.length; i < il; i++) {
                pendingJoints.push(parser.getDependency("node", skinEntry.joints[i]));
              }
              return Promise.all(pendingJoints);
            }).then(function(jointNodes) {
              node.traverse(function(mesh) {
                if (!mesh.isMesh) return;
                const bones = [];
                const boneInverses = [];
                for (let j = 0, jl = jointNodes.length; j < jl; j++) {
                  const jointNode = jointNodes[j];
                  if (jointNode) {
                    bones.push(jointNode);
                    const mat = new THREE.Matrix4();
                    if (skinEntry.inverseBindMatrices !== void 0) {
                      mat.fromArray(skinEntry.inverseBindMatrices.array, j * 16);
                    }
                    boneInverses.push(mat);
                  } else {
                    console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', skinEntry.joints[j]);
                  }
                }
                mesh.bind(new THREE.Skeleton(bones, boneInverses), mesh.matrixWorld);
              });
              return node;
            });
          }).then(function(node) {
            parentObject.add(node);
            const pending = [];
            if (nodeDef.children) {
              const children = nodeDef.children;
              for (let i = 0, il = children.length; i < il; i++) {
                const child = children[i];
                pending.push(buildNodeHierachy(child, node, json, parser));
              }
            }
            return Promise.all(pending);
          });
        }
        function computeBounds(geometry, primitiveDef, parser) {
          const attributes = primitiveDef.attributes;
          const box = new THREE.Box3();
          if (attributes.POSITION !== void 0) {
            const accessor = parser.json.accessors[attributes.POSITION];
            const min = accessor.min;
            const max = accessor.max;
            if (min !== void 0 && max !== void 0) {
              box.set(new THREE.Vector3(min[0], min[1], min[2]), new THREE.Vector3(max[0], max[1], max[2]));
              if (accessor.normalized) {
                const boxScale = getNormalizedComponentScale(WEBGL_COMPONENT_TYPES[accessor.componentType]);
                box.min.multiplyScalar(boxScale);
                box.max.multiplyScalar(boxScale);
              }
            } else {
              console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
              return;
            }
          } else {
            return;
          }
          const targets = primitiveDef.targets;
          if (targets !== void 0) {
            const maxDisplacement = new THREE.Vector3();
            const vector = new THREE.Vector3();
            for (let i = 0, il = targets.length; i < il; i++) {
              const target = targets[i];
              if (target.POSITION !== void 0) {
                const accessor = parser.json.accessors[target.POSITION];
                const min = accessor.min;
                const max = accessor.max;
                if (min !== void 0 && max !== void 0) {
                  vector.setX(Math.max(Math.abs(min[0]), Math.abs(max[0])));
                  vector.setY(Math.max(Math.abs(min[1]), Math.abs(max[1])));
                  vector.setZ(Math.max(Math.abs(min[2]), Math.abs(max[2])));
                  if (accessor.normalized) {
                    const boxScale = getNormalizedComponentScale(WEBGL_COMPONENT_TYPES[accessor.componentType]);
                    vector.multiplyScalar(boxScale);
                  }
                  maxDisplacement.max(vector);
                } else {
                  console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
                }
              }
            }
            box.expandByVector(maxDisplacement);
          }
          geometry.boundingBox = box;
          const sphere = new THREE.Sphere();
          box.getCenter(sphere.center);
          sphere.radius = box.min.distanceTo(box.max) / 2;
          geometry.boundingSphere = sphere;
        }
        function addPrimitiveAttributes(geometry, primitiveDef, parser) {
          const attributes = primitiveDef.attributes;
          const pending = [];
          function assignAttributeAccessor(accessorIndex, attributeName) {
            return parser.getDependency("accessor", accessorIndex).then(function(accessor) {
              geometry.setAttribute(attributeName, accessor);
            });
          }
          for (const gltfAttributeName in attributes) {
            const threeAttributeName = ATTRIBUTES[gltfAttributeName] || gltfAttributeName.toLowerCase();
            if (threeAttributeName in geometry.attributes) continue;
            pending.push(assignAttributeAccessor(attributes[gltfAttributeName], threeAttributeName));
          }
          if (primitiveDef.indices !== void 0 && !geometry.index) {
            const accessor = parser.getDependency("accessor", primitiveDef.indices).then(function(accessor2) {
              geometry.setIndex(accessor2);
            });
            pending.push(accessor);
          }
          assignExtrasToUserData(geometry, primitiveDef);
          computeBounds(geometry, primitiveDef, parser);
          return Promise.all(pending).then(function() {
            return primitiveDef.targets !== void 0 ? addMorphTargets(geometry, primitiveDef.targets, parser) : geometry;
          });
        }
        function toTrianglesDrawMode(geometry, drawMode) {
          let index = geometry.getIndex();
          if (index === null) {
            const indices = [];
            const position = geometry.getAttribute("position");
            if (position !== void 0) {
              for (let i = 0; i < position.count; i++) {
                indices.push(i);
              }
              geometry.setIndex(indices);
              index = geometry.getIndex();
            } else {
              console.error("THREE.GLTFLoader.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.");
              return geometry;
            }
          }
          const numberOfTriangles = index.count - 2;
          const newIndices = [];
          if (drawMode === THREE.TriangleFanDrawMode) {
            for (let i = 1; i <= numberOfTriangles; i++) {
              newIndices.push(index.getX(0));
              newIndices.push(index.getX(i));
              newIndices.push(index.getX(i + 1));
            }
          } else {
            for (let i = 0; i < numberOfTriangles; i++) {
              if (i % 2 === 0) {
                newIndices.push(index.getX(i));
                newIndices.push(index.getX(i + 1));
                newIndices.push(index.getX(i + 2));
              } else {
                newIndices.push(index.getX(i + 2));
                newIndices.push(index.getX(i + 1));
                newIndices.push(index.getX(i));
              }
            }
          }
          if (newIndices.length / 3 !== numberOfTriangles) {
            console.error("THREE.GLTFLoader.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
          }
          const newGeometry = geometry.clone();
          newGeometry.setIndex(newIndices);
          return newGeometry;
        }
        THREE.GLTFLoader = GLTFLoader;
      })();
    }
  });

  // plugin/defer.ts
  var deferred = [];
  function defer(lambda) {
    deferred.push(lambda);
  }
  function deferDelete(deletable) {
    defer(() => deletable.delete());
    return deletable;
  }
  function runDeferred() {
    for (let lambda of deferred.reverse())
      lambda();
  }

  // plugin/parse_gltf.ts
  if (THREE["GLTFLoader"] == void 0)
    init_GLTFLoader();
  async function parseGltf(file) {
    let loadingManager = new THREE.LoadingManager();
    fixStupidRelativePathBug(loadingManager, file);
    let gltfLoader = createGltfLoader(loadingManager);
    let gltf = await parseGltfWithLoader(gltfLoader, file);
    return gltf;
  }
  function createGltfLoader(loadingManager = void 0) {
    let _GLTFLoaderClass = THREE["GLTFLoader"];
    let loader = new _GLTFLoaderClass(loadingManager);
    return loader;
  }
  function parseGltfWithLoader(loader, file) {
    return new Promise((resolve, reject) => loader.parse(file.content, PathModule.dirname(file.path), resolve, reject));
  }
  function fixStupidRelativePathBug(loadingManager, file) {
    loadingManager.setURLModifier((url) => {
      let basePathWithoutSep = PathModule.dirname(file.path);
      let basePathWithSlash = basePathWithoutSep + PathModule.sep;
      if (url.startsWith(basePathWithoutSep) && !url.startsWith(basePathWithSlash))
        return url.replace(basePathWithoutSep, basePathWithSlash);
      return url;
    });
  }

  // plugin/util.ts
  function isPluginInstalled(pluginId) {
    return Plugins.installed.some((p) => p.id === pluginId);
  }
  function showPlugin(pluginId) {
    Plugins.dialog.component.data.selected_plugin = Plugins.all.find((p) => p.id === pluginId);
    Plugins.dialog.show();
  }
  function valuesAndIndices(array) {
    return array.map((v, i) => [v, i]);
  }
  async function imageBitmapToDataUri(imageBitmap, type = "image/png", quality) {
    let canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    let ctx = canvas.getContext("2d");
    if (ctx == void 0)
      throw new Error("Failed to get 2D context");
    ctx.drawImage(imageBitmap, 0, 0);
    return canvas.toDataURL(type, quality);
  }

  // plugin/vector_hash_map.ts
  var VectorHashMap = class {
    backingMap;
    constructor() {
      this.backingMap = {};
    }
    has(key) {
      return this.getKeyValuePair(key) != void 0;
    }
    get(key) {
      return this.getKeyValuePair(key)?.[1];
    }
    set(key, value) {
      let bucket = this.getBucket(key);
      if (bucket == void 0) {
        this.backingMap[this.getHashCode(key)] = [[key, value]];
        return;
      }
      let keyValuePair = this.getKeyValuePair(key);
      if (keyValuePair == void 0) {
        bucket.push([key, value]);
        return;
      }
      keyValuePair[1] = value;
    }
    remove(key) {
      this.getBucket(key)?.remove(this.getKeyValuePair(key));
    }
    getHashCode(key) {
      let hash = 2166136261;
      for (let component of key) {
        let component32 = component | 0;
        for (let i = 0; i < 4; i++) {
          let byte = component32 >>> i * 8 & 255;
          hash ^= byte;
          hash = Math.imul(hash, 16777619);
        }
      }
      return hash >>> 0;
    }
    getBucket(key) {
      return this.backingMap[this.getHashCode(key)];
    }
    getKeyValuePair(key) {
      return this.getBucket(key)?.find(([k, v]) => k.every((c, i) => c === key[i]));
    }
  };

  // plugin/import_gltf.ts
  async function importGltf(options) {
    console.log("options", options);
    let gltf = await parseGltf(options.file);
    let sceneRoot = gltf.scene;
    console.log("gltf", gltf);
    let rootGroup = Outliner.root.find((n) => n instanceof Group);
    let content = {
      groups: [],
      elements: [],
      textures: [],
      animations: [],
      uvOutOfBounds: false,
      usesRepeatingWrapMode: false,
      unsupportedArmatures: false,
      texturesById: {}
    };
    Undo.initEdit({
      outliner: true,
      selection: true,
      group: rootGroup,
      elements: content.elements,
      textures: content.textures,
      animations: content.animations
    });
    await importTextures(gltf, options, content);
    importNode(sceneRoot, options, content);
    content.usesRepeatingWrapMode = gltf.parser.json.samplers.some((s) => s.wrapS == void 0 || s.wrapT == void 0 || s.wrapS === 10497 || s.wrapT === 10497);
    console.log("content", content);
    Undo.finishEdit("Import glTF");
    console.log(`Imported glTF with ${content.groups.length} groups, ${content.elements.length} elements, ${content.textures.length} textures and ${content.animations.length} animations.`);
    return content;
  }
  async function importTextures(gltf, options, content) {
    let textureCache = gltf.parser.textureCache;
    for (let [cacheKey, threeTexturePromise] of Object.entries(textureCache)) {
      let bbTexture = new Texture();
      let threeTexture = await threeTexturePromise;
      let cacheKeySource = cacheKey.substring(0, cacheKey.indexOf(":"));
      if (isStringNumber(cacheKeySource)) {
        if (!(threeTexture.image instanceof ImageBitmap)) {
          console.warn("Imported texture has unknown format: ", threeTexture.image);
          bbTexture.remove();
          return;
        }
        let dataUri = await imageBitmapToDataUri(threeTexture.image, "image/png", 1);
        bbTexture.fromDataURL(dataUri);
      } else if (cacheKeySource.startsWith("data:")) {
        bbTexture.fromDataURL(cacheKeySource);
      } else {
        let absoluteTexturePath = PathModule.join(PathModule.dirname(options.file.path), cacheKeySource);
        bbTexture.fromPath(absoluteTexturePath);
      }
      bbTexture.add(false);
      content.texturesById[threeTexture.uuid] = bbTexture;
      content.textures.push(bbTexture);
    }
  }
  function importNode(node, options, content) {
    switch (node.type) {
      case "Group":
        if (node.parent != void 0)
          return importMeshPrimitives(node, node.children, options, content);
      // else it's the root, treat as group
      // fall through...
      case "Object3D":
        return importGroup(node, options, content);
      case "Mesh":
      case "SkinnedMesh":
        return importSingleMesh(node, options, content);
      default:
        console.warn(`[gltf_importer]: Skipping unknown node type "${node.type}"`);
        return null;
    }
  }
  function importGroup(node, options, content) {
    let isRoot = node.parent == void 0;
    let group = null;
    if (options.groups && !isRoot) {
      group = new Group({
        name: node.name,
        // TODO: what if its empty? what if its duplicate?
        origin: node.getWorldPosition(new THREE.Vector3()).multiplyScalar(options.scale).toArray(),
        // TODO: global position ignoring rotations
        rotation: node.rotation.toArray()
        // TODO:
      }).init();
      content.groups.push(group);
      group.openUp();
    }
    for (let child of node.children) {
      let result = importNode(child, options, content);
      result?.addTo(group ?? "root");
    }
    return group;
  }
  function importSingleMesh(node, options, content) {
    return importMeshPrimitives(node, [node], options, content);
  }
  function importMeshPrimitives(node, primitives, options, content) {
    let mesh = new Mesh({
      name: node.name,
      // TODO: what if its empty? what if its duplicate?
      origin: node.getWorldPosition(new THREE.Vector3()).multiplyScalar(options.scale).toArray(),
      // TODO: global position ignoring rotations
      rotation: node.rotation.toArray(),
      vertices: {}
      // TODO:
    });
    content.elements.push(mesh);
    let primitiveTextures = primitives.map((p) => content.texturesById[p.material?.map?.uuid]);
    let uniqueVertices = [];
    let uniqueVertexIndices = new VectorHashMap();
    let primitiveToUniqueVertexIndices = [];
    for (let [primitive, primitiveIndex] of valuesAndIndices(primitives)) {
      primitiveToUniqueVertexIndices[primitiveIndex] = [];
      for (let vertexIndex = 0; vertexIndex < primitive.geometry.attributes.position.count; vertexIndex++) {
        let x = primitive.geometry.attributes.position.array[vertexIndex * 3];
        let y = primitive.geometry.attributes.position.array[vertexIndex * 3 + 1];
        let z = primitive.geometry.attributes.position.array[vertexIndex * 3 + 2];
        x *= options.scale;
        y *= options.scale;
        z *= options.scale;
        let vertex = [x, y, z];
        if (!uniqueVertexIndices.has(vertex)) {
          let newUniqueVertexIndex = uniqueVertices.push(vertex) - 1;
          uniqueVertexIndices.set(vertex, newUniqueVertexIndex);
        }
        primitiveToUniqueVertexIndices[primitiveIndex].push(uniqueVertexIndices.get(vertex));
      }
    }
    let vertexKeys = Array.from({ length: uniqueVertices.length }, () => bbuid(4));
    mesh.vertices = Object.fromEntries(uniqueVertices.map((v, i) => [vertexKeys[i], v]));
    let faces = [];
    for (let [primitive, primitiveIndex] of valuesAndIndices(primitives)) {
      for (let faceIndex = 0; faceIndex < primitive.geometry.index.count; faceIndex++) {
        let texture = primitiveTextures[primitiveIndex];
        let uvWidth = texture?.uv_width ?? Project.texture_width;
        let uvHeight = texture?.uv_height ?? Project.texture_height;
        let uvComponents = primitive.geometry.attributes.uv.array;
        let v1Idx = primitive.geometry.index.array[faceIndex * 3];
        let v2Idx = primitive.geometry.index.array[faceIndex * 3 + 1];
        let v3Idx = primitive.geometry.index.array[faceIndex * 3 + 2];
        let v1Uv = [uvComponents[v1Idx * 2], uvComponents[v1Idx * 2 + 1]];
        let v2Uv = [uvComponents[v2Idx * 2], uvComponents[v2Idx * 2 + 1]];
        let v3Uv = [uvComponents[v3Idx * 2], uvComponents[v3Idx * 2 + 1]];
        let v1UvScaled = [v1Uv[0] * uvWidth, v1Uv[1] * uvHeight];
        let v2UvScaled = [v2Uv[0] * uvWidth, v2Uv[1] * uvHeight];
        let v3UvScaled = [v3Uv[0] * uvWidth, v3Uv[1] * uvHeight];
        let v1Key = vertexKeys[primitiveToUniqueVertexIndices[primitiveIndex][v1Idx]];
        let v2Key = vertexKeys[primitiveToUniqueVertexIndices[primitiveIndex][v2Idx]];
        let v3Key = vertexKeys[primitiveToUniqueVertexIndices[primitiveIndex][v3Idx]];
        faces.push(new MeshFace(mesh, {
          vertices: [v1Key, v2Key, v3Key],
          uv: {
            [v1Key]: v1UvScaled,
            [v2Key]: v2UvScaled,
            [v3Key]: v3UvScaled
          },
          texture
        }));
        content.uvOutOfBounds ||= [...v1Uv, ...v2Uv, ...v3Uv].some((x) => x < 0 || x > 1);
      }
    }
    mesh.addFaces(...faces);
    mesh.init();
    return mesh;
  }

  // plugin/plugin.ts
  BBPlugin.register("gltf_importer", {
    title: "glTF Importer",
    author: "0x13F",
    description: "Import .GLTF and .GLB models",
    icon: "icon.png",
    creation_date: "//TODO:",
    version: "1.0.0",
    variant: "desktop",
    min_version: "4.12.6",
    has_changelog: false,
    tags: ["Format: Generic Model", "Importer"],
    repository: "https://github.com/JannisX11/blockbench-plugins/tree/master/plugins/gltf_importer",
    onload() {
      deferDelete(new Action("import_gltf", {
        name: "Import glTF Model",
        icon: "icon-gltf",
        category: "file",
        condition: {
          modes: ["edit"],
          method: () => Format?.meshes
        },
        click() {
          importGltfDialog.show();
        }
      }));
      let importMenu = MenuBar.menus.file.structure.find((x) => x["id"] === "import");
      let importMenuChildren = importMenu.children;
      let objImportItemIndex = importMenuChildren.findIndex((x) => (typeof x === "string" ? x : x["id"]).startsWith("import_obj"));
      importMenuChildren.splice(objImportItemIndex, 0, "import_gltf");
      defer(() => importMenuChildren.splice(importMenuChildren.indexOf("import_gltf"), 1));
      let importGltfDialog = deferDelete(new Dialog("import_gltf_dialog", {
        title: "Import glTF",
        form: {
          ["file"]: {
            type: "file",
            label: "glTF File",
            return_as: "file",
            extensions: ["gltf", "glb"],
            resource_id: "gltf",
            filetype: "glTF Model",
            readtype: "buffer"
          },
          ["scale"]: {
            type: "number",
            label: "Scale",
            value: Settings.get("model_export_scale")
          },
          ["groups"]: {
            type: "checkbox",
            label: "Import Groups",
            value: false
          },
          ["cameras"]: {
            type: "checkbox",
            label: "Import Cameras",
            value: false
          },
          ["animations"]: {
            type: "checkbox",
            label: "Import Animations",
            value: false
          }
        },
        onConfirm(options) {
          if (options.file == void 0)
            return false;
          if (options.cameras && !isPluginInstalled("cameras")) {
            warnAboutCameras();
            return false;
          }
          importGltf(options).then(async (content) => {
            if (content.unsupportedArmatures)
              await warnAboutUnsupportedArmatures();
            if (content.usesRepeatingWrapMode && content.uvOutOfBounds)
              warnAboutRepeatingTextures();
          });
        }
      }));
    },
    onunload() {
      runDeferred();
    }
  });
  function warnAboutUnsupportedArmatures() {
    return new Promise((resolve, reject) => {
      Blockbench.showMessageBox({
        title: "Armatures not supported",
        message: "The imported glTF model makes use of armatures. The version of Blockbench you are currently using does not support armatures. If you want to import armatures from models, please update to the lastest version of Blockbench.",
        icon: "warning",
        width: 520
      }, () => resolve());
    });
  }
  function warnAboutRepeatingTextures() {
    if (isPluginInstalled("repeating_textures")) {
      if (!Settings.get("repeating_textures")) {
        Blockbench.showMessageBox({
          title: "Repeating Textures not enabled",
          message: "The imported glTF model makes use of repeating textures. Repeating textures is are currently disabled. Would you like to enable them now?",
          icon: "warning",
          width: 520,
          buttons: ["dialog.yes", "dialog.no"]
        }, (result) => {
          if (result === 0) {
            BarItems["toggle_repeating_textures"].trigger();
            Blockbench.showQuickMessage("Repeating Textures enabled");
          }
        });
      }
    } else {
      Blockbench.showMessageBox({
        title: "Repeating Textures plugin not installed",
        message: 'The imported glTF model makes use of repeating textures. Blockbench does not support this by default, so the model may appear incorrect. Would you like to install the "Repeating Textures" plugin to fix this?',
        icon: "warning",
        width: 520,
        buttons: ["dialog.yes", "dialog.no"]
      }, (result) => {
        if (result === 0)
          showPlugin("repeating_textures");
      });
    }
  }
  function warnAboutCameras() {
    Blockbench.showMessageBox({
      title: "Cameras plugin not installed",
      message: 'You have chosen to import cameras, but the "Cameras" plugin is not currently installed. Would you like to install the "Cameras" plugin now?',
      icon: "warning",
      width: 520,
      buttons: ["dialog.yes", "dialog.no"]
    }, (result) => {
      if (result === 0)
        showPlugin("cameras");
    });
  }
})();
