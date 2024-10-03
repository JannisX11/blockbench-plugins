import type { ILightrParams } from "../types";
/**
 * Adapted from Lightr by phosphoer
 * @see https://github.com/phosphoer/lightr
 */
export class Lightr {
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

        const len = Math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2);
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
          intensity = Math.min(1, Math.max(this.minLightIntensity, intensity));

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
