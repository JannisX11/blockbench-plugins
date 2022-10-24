import javaPackVersions from '../javaPackVersions';
import buildResourcepackArchive from '../services/buildResourcepackService';
import { setResourcepackFormDialogOptions } from '../services/resourcepackOptionsService';
import { ResourcepackOptions } from '../types';
import { saveArchive } from '../utils/archiveUtils';

export default class ExportResourcepackFormDialog extends Dialog {
  public constructor(options: ResourcepackOptions) {
    super({
      id: 'export-resourcepack-form-dialog',
      title: 'Export resourcepack',
      form: {
        resourcepackName: {
          label: 'Resourcepack Name',
          type: 'text',
          value: options.resourcepackName
        },
        resourcepackVersion: {
          label: 'Resourcepack Version',
          type: 'select',
          options: Object.fromEntries(
            Object.entries(javaPackVersions).map((a) => a.reverse())
          ),
          value: options.resourcepackVersion
        },
        resourcepackDescription: {
          label: 'Resourcepack Description',
          type: 'textarea',
          value: options.resourcepackDescription
        },
        enableResourcepackCredits: {
          label: 'Enable Credits',
          type: 'checkbox',
          value: options.enableResourcepackCredits
        },
        resourcepackCredits: {
          label: 'Resourcepack Credits',
          type: 'text',
          value: options.resourcepackCredits
        },
        modelType: {
          label: 'Model type',
          type: 'select',
          options: {
            block: 'block',
            item: 'item'
          },
          value: options.modelType
        },
        namespace: {
          label: 'Namespace',
          type: 'text',
          value: options.namespace
        },
        modelId: {
          label: 'Model id',
          type: 'text',
          value: options.modelId
        },
        enableAnimation: {
          label: 'Enable Animation',
          type: 'checkbox',
          value: options.enableAnimation
        },
        frameTime: {
          label: 'Time between frames',
          type: 'number',
          min: 1,
          value: options.frameTime
        },
        frameStart: {
          label: 'Starting frame',
          description:
            'must be inferior to the number of frames in your animation',
          type: 'number',
          min: 0,
          value: options.frameStart
        },
        interpolate: {
          label: 'Interpolate',
          description: 'generate "between-frames" if frametime > 1',
          type: 'checkbox',
          value: options.interpolate
        }
      },
      onConfirm: async (data) => {
        const formResult = data as ResourcepackOptions;
        setResourcepackFormDialogOptions(formResult);

        saveArchive(
          await buildResourcepackArchive(formResult),
          formResult.resourcepackName
        );
      }
    });
  }
}
