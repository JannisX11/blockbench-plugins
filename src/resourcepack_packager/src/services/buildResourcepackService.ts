// eslint-disable-next-line import/no-extraneous-dependencies
import JSZip from 'jszip';
import { ResourcepackOptions } from '../types';
import { obtainBase64PackIcon } from '../utils/blockbenchUtils';
import {
  archiveManifest,
  archiveModel,
  archiveTextures,
  getNamespaceModelsFolder,
  getNamespaceTexturesFolder
} from '../utils/archiveUtils';

export default async function buildResourcepackArchive(
  options: ResourcepackOptions
): Promise<JSZip> {
  const archive = new JSZip();
  try {
    archive.file('pack.png', await obtainBase64PackIcon(), { base64: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('unable to add pack icon... reason: ', error);
  }

  archiveManifest(
    archive,
    options.resourcepackDescription,
    parseInt(options.resourcepackVersion, 10)
  );

  const texturesFolder = getNamespaceTexturesFolder(
    archive,
    options.namespace,
    options.modelType
  );

  const modelsFolder = getNamespaceModelsFolder(
    archive,
    options.namespace,
    options.modelType
  );

  archiveTextures(
    texturesFolder,
    options.namespace,
    options.modelType,
    options.modelId,
    options.frameTime,
    options.frameStart,
    options.interpolate
  );

  archiveModel(
    modelsFolder,
    options.modelId,
    options.enableResourcepackCredits,
    options.resourcepackCredits
  );

  return archive;
}
