import type { IChannel, IRegistry } from "./types";
import { three as THREE } from "./deps";

export const NA_CHANNEL = "_NONE_";
export const CHANNELS: Record<IChannel["id"], IChannel> = {
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

/**
 * Collection of registered Blockbench UI elements
 * Used for component communication as well as to simplify cleanup
 */
export const registry: Partial<IRegistry> = {};

export const setups: Array<() => void> = [];
export const teardowns: Array<() => void> = [];
