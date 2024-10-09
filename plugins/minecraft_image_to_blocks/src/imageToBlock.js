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

import {getFileNameFromPath} from "./fileUtils";
import {
  adjustProjectTextureSize,
  applyTextureToBlocks,
  createTextureFromImage
} from "./textureUtils";
import {optimizeBlocks} from "./optimizeBlocks";

export function createBlockModelFromImage(
    filePath,
    image, useColorForMerging,
    shouldOptimizeBlocks,
    shouldMapTexture) {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");

  ctx.save();
  ctx.translate(0, canvas.height);
  ctx.scale(1, -1);
  ctx.drawImage(image, 0, 0);

  const {data: pixels} = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixelMatrix = Array.from({length: canvas.height}, (_, y) =>
      Array.from({length: canvas.width}, (_, x) => {
        const [r, g, b, a] = pixels.slice((y * canvas.width + x) * 4,
            (y * canvas.width + x) * 4 + 4);
        return a > 0 ? {r, g, b} : null;
      })
  );

  const blocks = shouldOptimizeBlocks
      ? optimizeBlocks(pixelMatrix, useColorForMerging)
      : getBlocks(pixelMatrix, useColorForMerging);

  const fileName = getFileNameFromPath(filePath).toLowerCase();
  const group = new Group({name: fileName}).init();

  if (shouldMapTexture) {
    const texture = createTextureFromImage(image, filePath,
        `${fileName}_texture`);
    adjustProjectTextureSize(texture);
    applyTextureToBlocks(blocks, group, texture);
  } else {
    mapBlocksToCubes(blocks, group);
  }

  Canvas.updateAll();
  Blockbench.showQuickMessage("Block model created successfully!", 2000);
}

function mapBlocksToCubes(blocks, group) {
  blocks.forEach(({x, y, width, height, color}) => {
    new Cube({
      from: [x, y, 0],
      to: [x + width, y + height, 1],
      color: new THREE.Color(`rgb(${color.r}, ${color.g}, ${color.b})`),
    }).addTo(group).init();
  });
}

function getBlocks(matrix, useColorForMerging) {
  const blocks = [];
  const visited = Array.from({length: matrix.length},
      () => Array(matrix[0].length).fill(false));

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[0].length; x++) {
      if (!visited[y][x] && matrix[y][x]) {
        const color = matrix[y][x];
        blocks.push({
          x, y, width: 1, height: 1,
          color: useColorForMerging ? color : {r: 255, g: 255, b: 255},
        });
        visited[y][x] = true;
      }
    }
  }
  return blocks;
}