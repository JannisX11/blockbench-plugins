/*
 * Copyright 2024 Markus Bordihn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

export function adjustProjectTextureSize(texture) {
  const {width: textureWidth, height: textureHeight} = texture;

  if (typeof Project !== 'undefined' && Project.texture_width !== undefined
      && Project.texture_height !== undefined) {
    if (Project.texture_width !== textureWidth || Project.texture_height
        !== textureHeight) {
      Project.texture_width = textureWidth;
      Project.texture_height = textureHeight;
      console.log(
          `Project texture size adjusted to ${textureWidth}x${textureHeight}.`);
    } else {
      console.log('The project texture size already matches the texture size.');
    }
  } else {
    console.error('Project or its properties are not defined.');
  }
}

export function createTextureFromImage(image, filePath, textureName) {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0);

  const texture = new Texture({source: filePath, name: textureName}).add(false);
  texture.width = canvas.width;
  texture.height = canvas.height;
  texture.updateSource(canvas.toDataURL('image/png'));

  return texture;
}

export function applyTextureToBlocks(blocks, group, texture) {
  const {width: textureWidth, height: textureHeight} = texture;

  blocks.forEach(({x, y, width, height, color, mirror_uv = false}) => {
    const cube = new Cube({
      from: [x, y, 0],
      to: [x + width, y + height, 1],
      color: new THREE.Color(`rgb(${color.r}, ${color.g}, ${color.b})`),
      faces: {
        north: {texture},
        south: {texture},
        east: {texture},
        west: {texture},
        up: {texture},
        down: {texture}
      },
      mirror_uv,
    });

    const u0 = x, u1 = x + width;
    const v0 = textureHeight - (y + height), v1 = textureHeight - y;
    const minPixelWidth = 1 / textureWidth;

    const eastU1 = (u1 - u0) < minPixelWidth ? u0 + minPixelWidth : u1;
    const westU0 = (u1 - u0) < minPixelWidth ? u1 - minPixelWidth : u0;
    const upV1 = (v1 - v0) < minPixelWidth ? v1 - minPixelWidth : v0;
    const downV0 = (v1 - v0) < minPixelWidth ? v0 + minPixelWidth : v1;

    cube.faces.north.uv = [u1, v0, u0, v1];
    cube.faces.south.uv = [u0, v0, u1, v1];
    cube.faces.east.uv = [eastU1, v0, eastU1 - 1, v1];
    cube.faces.west.uv = [westU0, v0, westU0 + 1, v1];
    cube.faces.up.uv = [u0, v0, u1, upV1 + 1];
    cube.faces.down.uv = [u0, downV0, u1, v1 - 1];

    cube.addTo(group).init();
  });
}