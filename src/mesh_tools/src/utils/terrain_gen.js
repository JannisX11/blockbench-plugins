import { action } from "../actions.js";

export class TerrainGen {
  static styles = {
    Earth: [
      { blend: 0.5, height: 0.2, color: new THREE.Color(0.13, 0.36, 0.89) },
      {
        blend: 0.2,
        height: 0.375,
        color: new THREE.Color(0.9, 0.86, 0.36),
      },
      {
        blend: 0.3,
        height: 0.5,
        color: new THREE.Color(0.15, 0.87, 0.113),
      },
      { blend: 1, height: 1, color: new THREE.Color(0.113, 0.87, 0.137) },
    ],
    EarthMountains: [
      { blend: 0.5, height: 0.2, color: new THREE.Color(0.13, 0.36, 0.89) },
      {
        blend: 0.2,
        height: 0.375,
        color: new THREE.Color(0.9, 0.86, 0.36),
      },
      {
        blend: 0.3,
        height: 0.5,
        color: new THREE.Color(0.15, 0.87, 0.113),
      },
      { blend: 1, height: 0.6, color: new THREE.Color(0.113, 0.87, 0.137) },
      { blend: 0.1, height: 1, color: new THREE.Color(0.39, 0.28, 0.12) },
    ],
    Grass: [
      { blend: 1, height: 0.2, color: new THREE.Color(0.69, 1, 0.11) },
      { blend: 1, height: 0.375, color: new THREE.Color(0.51, 1, 0.14) },
      {
        blend: 1,
        height: 0.375,
        color: new THREE.Color(0.17, 0.63, 0.054),
      },
    ],
    Desert: [
      { blend: 0, height: 0, color: new THREE.Color(0.54, 0.42, 0.17) },
      { blend: 0.9, height: 1, color: new THREE.Color(0.79, 0.56, 0.25) },
    ],
    Ice: [
      { blend: 0, height: 0, color: new THREE.Color(0.45, 0.68, 0.86) },
      { blend: 1, height: 0.5, color: new THREE.Color(0.58, 0.77, 0.89) },
      { blend: 1, height: 0.75, color: new THREE.Color(0.83, 0.94, 0.97) },
      { blend: 1, height: 1, color: new THREE.Color(0.61, 0.84, 0.94) },
    ],
    Mask: [
      { blend: 0, height: 0, color: new THREE.Color(0, 0, 0) },
      { blend: 1, height: 1, color: new THREE.Color(1, 1, 1) },
    ],
  };
  /**
   * @type {Array<TerrainGen>}
   */
  static all = [];
  static timeWhenDialogWasOpened = 0;
  static genTexture(
    width,
    height,
    noise,
    style = this.styles.Earth,
    asTexture = true
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    for (let y = height - 1; y >= 0; y--) {
      for (let x = width - 1; x >= 0; x--) {
        const currentHeight = Math.clamp(noise[[x, y]], 0, style.last().height);
        for (let i = 0; i < style.length; i++) {
          if (currentHeight <= style[i].height) {
            let s2 = style[Math.clamp(i - 1, 0, Infinity)];
            let percent =
              1 -
              THREE.Math.inverseLerp(s2.height, style[i].height, currentHeight);
            let color = style[i].color
              .clone()
              .lerp(s2.color, percent * style[i].blend);
            ctx.fillStyle = `rgb(${color.r * 255},${color.g * 255},${
              color.b * 255
            })`;
            ctx.fillRect(x, y, 1, 1);
            break;
          }
        }
      }
    }
    if (!asTexture) {
      return canvas.toDataURL();
    }
    const _texture = new Texture({ saved: false }).fromDataURL(
      canvas.toDataURL()
    );
    _texture.add();
    return _texture;
  }
  constructor(data) {
    this.name = data.name;
    this.codeName = data.name.toLowerCase().replaceAll(" ", "_");
    this.settings = data.settings;
    this.suggested = data.suggested || {};
    /**
     * @type {Function}
     */
    this.noise = data.noise;

    TerrainGen.all.push(this);
  }
}
