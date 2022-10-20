// eslint-disable-next-line import/no-extraneous-dependencies
import JSZip from 'jszip';
import { ModelType } from '../types';
import {
  buildManifest,
  createTextureAnimation,
  compileJavaBlockCodec
} from './blockbenchUtils';
import { createIncrementalArray, cutAndSwapArray } from './arrayUtils';
import { hardDefineProperty, hardObtainProperty } from './objectUtils';

export function getNamespaceAssetsFolder(archive: JSZip, namespace: string) {
  return archive.folder('assets')?.folder(namespace);
}

export function getNamespaceModelsFolder(
  archive: JSZip,
  namespace: string,
  modelType: ModelType
): JSZip {
  return getNamespaceAssetsFolder(archive, namespace)
    ?.folder('models')
    ?.folder(modelType) as JSZip;
}

export function getNamespaceTexturesFolder(
  archive: JSZip,
  namespace: string,
  modelType: ModelType
): JSZip {
  return getNamespaceAssetsFolder(archive, namespace)
    ?.folder('textures')
    ?.folder(modelType) as JSZip;
}

export function archiveManifest(
  archive: JSZip,
  resourcepackDescription: string,
  resourcepackVersion: number
) {
  archive.file(
    'pack.mcmeta',
    // @ts-ignore
    autoStringify(buildManifest(resourcepackDescription, resourcepackVersion))
  );
}

export function archiveTextures(
  archiveTexturesFolder: JSZip,
  namespace: string,
  modelType: ModelType,
  modelId: string,
  frameTime: number,
  frameStart: number,
  interpolate: boolean
) {
  const texturesFolder = archiveTexturesFolder.folder(modelId);
  Texture.all.forEach((texture) => {
    const textureName = `${hardObtainProperty(texture, 'name')}.png`;
    if (texture.frameCount && texture.frameCount > 1) {
      let framesOrder = createIncrementalArray(texture.frameCount as number);
      framesOrder = cutAndSwapArray(framesOrder, frameStart);
      texturesFolder?.file(
        `${textureName}.mcmeta`,
        // @ts-ignore
        autoStringify(
          createTextureAnimation(frameTime, framesOrder, interpolate)
        )
      );
    }

    hardDefineProperty(texture, 'folder', `${modelType}/${modelId}`);
    hardDefineProperty(texture, 'namespace', namespace);

    texturesFolder?.file(textureName, texture.getBase64(), {
      base64: true
    });
  });
}

export function archiveModel(
  archiveModelsFolder: JSZip,
  modelId: string,
  enableResourcepackCredits: boolean = false,
  resourcepackCredits: string = ''
) {
  archiveModelsFolder?.file(
    `${modelId}.json`,
    // @ts-ignore
    autoStringify(
      compileJavaBlockCodec(enableResourcepackCredits, resourcepackCredits)
    )
  );
}

export function saveArchive(archive: JSZip, name: string) {
  return archive.generateAsync({ type: 'blob' }).then(async (content) => {
    Blockbench.export({
      type: 'Zip Archive',
      extensions: ['zip'],
      name,
      content,
      savetype: 'zip'
    } as unknown as any);
  });
}
