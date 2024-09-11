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

import {createBlockModelFromImage} from './imageToBlock';
import {readImageFile} from './imageReader';

let plugin = {
  title: 'Image to Blocks Model',
  icon: 'logo.png',
  author: 'Markus Bordihn (Kaworru)',
  tags: ["Minecraft", "Image", "Blocks"],
  version: '1.0.0',
  min_version: "4.10.4",
  description: 'Converts an image into a 3D block model based on pixels with various options',
  website: "https://github.com/MarkusBordihn/Blockbench-Plugin-Minecraft_Image_To_Blocks",
  repository: "https://github.com/MarkusBordihn/Blockbench-Plugin-Minecraft_Image_To_Blocks",
  bug_tracker: "https://github.com/MarkusBordihn/Blockbench-Plugin-Minecraft_Image_To_Blocks/issues",
  variant: 'both',
  has_changelog: true,
  onload() {

    if (BarItems['import_pixel_model']) {
      console.warn('Import Pixel Model already exists ...');
    }

    MenuBar.addAction(
        new Action({
          id: 'import_pixel_model',
          name: 'Import Image to Blocks Model',
          icon: 'photo',
          click: () => {
            new Dialog({
              id: 'import_pixel_dialog',
              title: 'Import Image to Blocks Model',
              form: {
                image: {
                  label: 'Texture Image',
                  type: 'file',
                  extensions: ['png', 'jpg', 'jpeg'],
                },
                useColorForMerging: {
                  label: 'Use Color Values for Merging',
                  type: 'checkbox',
                  value: false,
                },
                optimizeBlocks: {
                  label: 'Optimize Blocks',
                  type: 'checkbox',
                  value: true,
                },
                mappingTexture: {
                  label: 'Mapping Texture',
                  type: 'checkbox',
                  value: true,
                }
              },
              onConfirm(formData) {
                if (!formData.image) {
                  console.error('No image selected');
                  return;
                }

                let filePath = formData.image;
                console.info('Processing image...', filePath);

                readImageFile(filePath, (img) => {
                  createBlockModelFromImage(filePath, img,
                      formData.useColorForMerging, formData.optimizeBlocks,
                      formData.mappingTexture);
                });
              },
            }).show();
          },
        }),
        'file.import'
    );
  },
  onunload() {
    MenuBar.removeAction('import_pixel_model');
  },
};

Plugin.register('minecraft_image_to_blocks', plugin);