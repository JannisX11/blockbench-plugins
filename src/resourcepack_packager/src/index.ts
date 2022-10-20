/**
 * @author leopoldhub
 * @discord patatoe02#1499
 * @github https://github.com/leopoldhub
 */

/// <reference types="blockbench-types" />

import ExportResourcepackMenuAction from './elements/ExportResourcepackMenuAction';
import pluginEmitter from './pluginEmitter';

(() => {
  pluginEmitter.on('load', () => {
    const exportResourcepackMenuAction = new ExportResourcepackMenuAction();
    MenuBar.addAction(exportResourcepackMenuAction, 'file.export');
    pluginEmitter.once('unload', () => {
      try {
        exportResourcepackMenuAction.delete();
      } catch (e) {}
    });
  });

  Plugin.register('resourcepack_packager', {
    title: 'Resourcepack Packager',
    author: 'leopoldhub',
    description: 'Export your java models and texture into a resourcepack',
    icon: 'fa-file-zipper',
    tags: ['Minecraft: Java Edition', 'Resourcepack', 'Exporter'],
    variant: 'both',
    version: '1.0.0',
    oninstall: () => {
      pluginEmitter.emit('install');
    },
    onload: () => {
      pluginEmitter.emit('load');
    },
    onuninstall: () => {
      pluginEmitter.emit('uninstall');
    },
    onunload: () => {
      pluginEmitter.emit('unload');
    }
  } as unknown as PluginData);
})();
