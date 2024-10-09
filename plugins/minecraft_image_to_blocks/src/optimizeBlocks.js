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

export function optimizeBlocks(matrix, useColorForMerging) {
  const mergedBlocks = [];
  const width = matrix[0].length;
  const height = matrix.length;
  const visited = Array.from({length: height}, () => Array(width).fill(false));

  const compareColors = (color1, color2) =>
      color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;

  const findBlockSize = (x, y, color) => {
    let blockWidth = 0, blockHeight = 0;

    while (x + blockWidth < width && matrix[y][x + blockWidth] &&
    (!useColorForMerging || compareColors(matrix[y][x + blockWidth], color))) {
      blockWidth++;
    }

    while (y + blockHeight < height && matrix[y + blockHeight][x] &&
    (!useColorForMerging || compareColors(matrix[y + blockHeight][x], color))) {
      if (!Array.from({length: blockWidth},
          (_, i) => matrix[y + blockHeight][x + i])
      .every(cell => cell && (!useColorForMerging || compareColors(cell,
          color)))) {
        break;
      }
      blockHeight++;
    }

    return {blockWidth, blockHeight};
  };

  const removeFullyContainedBlocks = newBlock =>
      mergedBlocks.filter(existingBlock =>
          !(existingBlock.x >= newBlock.x &&
              existingBlock.y >= newBlock.y &&
              existingBlock.x + existingBlock.width <= newBlock.x
              + newBlock.width &&
              existingBlock.y + existingBlock.height <= newBlock.y
              + newBlock.height)
      );

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!visited[y][x] && matrix[y][x]) {
        const color = matrix[y][x];
        const {blockWidth, blockHeight} = findBlockSize(x, y, color);

        const newBlock = {
          x, y, width: blockWidth, height: blockHeight,
          color: useColorForMerging ? color : {r: 255, g: 255, b: 255},
        };

        mergedBlocks.splice(0, mergedBlocks.length,
            ...removeFullyContainedBlocks(newBlock));
        mergedBlocks.push(newBlock);

        for (let i = y; i < y + blockHeight; i++) {
          for (let j = x; j < x + blockWidth; j++) {
            visited[i][j] = true;
          }
        }
      }
    }
  }

  return mergedBlocks;
}