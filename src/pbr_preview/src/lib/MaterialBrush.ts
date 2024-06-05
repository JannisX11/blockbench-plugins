import type { IChannel } from "../types";
import { CHANNELS, registry } from "../constants";
import { three as THREE } from "../deps";

/**
 * ### Material Brush
 * Class for painting across multiple TextureLayers in a Texture
 * Used to iterate over PBR channels and apply a brush value to each layer
 * at the same UV coordinates
 */
export class MaterialBrush {
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

  toString() {
    const colors = Object.entries(this._colors).map(([key, color]) => [
      key,
      color.getHexString(),
    ]);
    return JSON.stringify(colors);
  }

  getChannel(channel: IChannel["id"]) {
    return this._colors[channel];
  }

  static makeLinearColor(value: number) {
    const clamped = Math.min(1, Math.max(0, value));
    return new THREE.Color(clamped, clamped, clamped).convertSRGBToLinear();
  }

  static fromSettings() {
    const defaultEmissive = "#000000";
    const metalnessValue = Number(registry.brushMetalnessSlider?.get());
    const roughnessValue = Number(registry.brushRoughnessSlider?.get() ?? 1);
    const emissiveValue = (
      registry.brushEmissiveColor?.get() ?? defaultEmissive
    ).toString();
    const heightValue = Number(registry.brushHeightSlider?.get());
    // @ts-expect-error ColorPanel global is not typed
    const currentColor = ColorPanel.get();

    const colors = {
      [CHANNELS.albedo.id]: new THREE.Color(currentColor),
      [CHANNELS.metalness.id]: MaterialBrush.makeLinearColor(metalnessValue),
      [CHANNELS.roughness.id]: MaterialBrush.makeLinearColor(roughnessValue),
      [CHANNELS.emissive.id]: new THREE.Color(emissiveValue ?? defaultEmissive),
      [CHANNELS.height.id]: MaterialBrush.makeLinearColor(heightValue),
      [CHANNELS.normal.id]:
        CHANNELS.normal.default ?? new THREE.Color("#8080ff"),
    };

    return new MaterialBrush({ colors });
  }
}
