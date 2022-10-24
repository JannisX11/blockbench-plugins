import pluginEmitter from '../pluginEmitter';
import { getResourcepackFormDialogOptions } from '../services/resourcepackOptionsService';
import ExportResourcepackFormDialog from './ExportResourcepackFormDialog';

export default class ExportResourcepackMenuAction extends Action {
  public exportResourcepackFormDialog = new ExportResourcepackFormDialog(
    getResourcepackFormDialogOptions()
  );

  public constructor() {
    super('export-resourcepack-menu-action', {
      name: 'Export resourcepack',
      icon: 'fa-file-zipper',
      click: () => {
        this.exportResourcepackFormDialog.show();
      },
      condition: () => Format.id === 'java_block'
    });

    pluginEmitter.once('unload', this.exportResourcepackFormDialog.delete);
  }
}
