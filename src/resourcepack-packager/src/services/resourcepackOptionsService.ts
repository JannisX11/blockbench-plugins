import javaPackVersions from '../javaPackVersions';
import { ResourcepackOptions } from '../types';

let savedResourcepackFormDialogOptions: ResourcepackOptions | undefined;

export function getDefaultResourcepackFormDialogOptions(): ResourcepackOptions {
  return {
    resourcepackName: 'blockbench-pack',
    resourcepackDescription: '',
    enableResourcepackCredits: true,
    resourcepackCredits:
      'Created with Blockbench [Exported as resourcepack with the "resourcepack-packager" plugin]',
    resourcepackVersion: Object.values(javaPackVersions)
      .reverse()[0]
      .toString(),
    namespace: 'minecraft',
    modelId: 'stone',
    modelType: 'block',
    enableAnimation: true,
    frameTime: 1,
    frameStart: 0,
    interpolate: false
  };
}

export function getResourcepackFormDialogOptions(): ResourcepackOptions {
  savedResourcepackFormDialogOptions ||=
    getDefaultResourcepackFormDialogOptions();
  return savedResourcepackFormDialogOptions;
}

export function setResourcepackFormDialogOptions(
  options: ResourcepackOptions
): void {
  savedResourcepackFormDialogOptions = options;
}

export function resetResourcepackFormDialogOptions(): void {
  savedResourcepackFormDialogOptions = undefined;
}
