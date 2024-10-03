export type Channel =
  | "albedo"
  | "metalness"
  | "emissive"
  | "roughness"
  | "height"
  | "normal"
  | "ao";

export interface IChannel {
  label: string;
  description: string;
  map: string;
  id: string;
  icon?: string;
  default?: THREE.Color;
  regex?: RegExp;
}

export interface ILightrParams {
  lightHeight?: number;
  ambientLight?: [number, number, number];
  minLightIntensity?: number;
  lightDiffuse?: [number, number, number];
}

export interface IPbrMaterials {
  [materialUuid: string]: {
    [channelId: string]: string;
  };
}

export interface IBbMat {
  version: number;
  channels: Record<Channel | "preview", string>;
}

export interface IRegistry {
  bakeTexturesAction: Action;
  bakeTexturesDialog: Dialog;
  brushEmissiveColor: ColorPicker;
  brushHeightSlider: NumSlider;
  brushMetalnessSlider: NumSlider;
  brushRoughnessSlider: NumSlider;
  channelMenu: Menu;
  channelProp: Property;
  createMaterialTexture: Action;
  createTextureSet: Action;
  decodeMer: Action;
  displaySettingsPanel: Panel;
  exposureSlider: NumSlider;
  resetExposure: Action;
  generateMer: Action;
  generateNormal: Action;
  generateAo: Action;
  generateLabPbr: Action;
  decodeLabPbr: Action;
  materialBrushPanel: Panel;
  materialBrushTool: Tool;
  openChannelMenu: Action;
  pbrMaterialsProp: Property;
  projectMaterialsProp: Property;
  projectPbrModeProp: Property;
  setBrushMaterial: Action;
  showChannelMenu: Action;
  textureChannelProp: Property;
  textureSetDialog: Dialog;
  toggleCorrectLights: Toggle;
  togglePbr: Toggle;
  tonemappingSelect: BarSelect;
  unassignChannel: Action;
  userMaterialBrushPresets: Dialog;
  exportUsdz: Action;
  usdz: Codec;
  bbmat: Codec;
  bbMatExport: Action;
  bbMatImport: Action;
  [key: string]: Deletable;
}
