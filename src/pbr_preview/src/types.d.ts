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

// Extend Blockbench Project namespace
declare module "blockbench-types" {
  interface Project {
    pbr_materials: IPbrMaterials;
    bb_materials: Record<string, THREE.ShaderMaterial>;
  }
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
  exposureSlider: BarSlider;
  resetExposure: Action;
  generateMer: Action;
  generateNormal: Action;
  generateLabPbr: Action;
  decodeLabPbr: Action;
  materialBrushPanel: Panel;
  materialBrushTool: Tool;
  materialBrushPresets: BarSelect;
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
  [key: string]: Deletable;
}
