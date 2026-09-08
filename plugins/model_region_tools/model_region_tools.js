(function() {
    'use strict';

    const PLUGIN_ID = 'model_region_tools';
    const PLUGIN_VERSION = '1.0.0';

    let region_select_action;
    let delete_selected_action;

    Plugin.register(PLUGIN_ID, {
        title: 'Model Region Tools',
        author: 'HorrorGirl',
        description: 'Инструменты для выделения области модели непосредственно в 3D-вьюпорте.',
        icon: 'select_all',
        version: PLUGIN_VERSION,
        variant: 'both',

        onload() {
            // Инструмент выбора области
            region_select_action = new Action('model_region_tools_region_select', {
                name: 'Region Select',
                description: 'Выделение области модели непосредственно в 3D-вьюпорте.',
                icon: 'crop_free',
                click() {
                    Blockbench.showQuickMessage(
                        'Model Region Tools 1.0.0: Region Select'
                    );
                }
            });

            // Удаление выбранных элементов
            delete_selected_action = new Action('model_region_tools_delete_selected', {
                name: 'Delete Selected',
                description: 'Удалить выбранные элементы модели.',
                icon: 'delete',
                click() {
                    if (typeof Outliner !== 'undefined' && Outliner.selected) {
                        const selected = Outliner.selected.slice();

                        if (selected.length) {
                            Undo.initEdit({
                                elements: selected
                            });

                            selected.forEach(element => {
                                if (typeof element.remove === 'function') {
                                    element.remove();
                                }
                            });

                            Undo.finishEdit('Delete selected elements');

                            if (typeof Canvas !== 'undefined' && Canvas.updateView) {
                                Canvas.updateView({
                                    elements: selected
                                });
                            }

                            Blockbench.showQuickMessage(
                                'Удалено элементов: ' + selected.length
                            );
                        } else {
                            Blockbench.showQuickMessage(
                                'Нет выбранных элементов'
                            );
                        }
                    }
                }
            });

            // Добавляем действия в меню Tools
            MenuBar.addAction(region_select_action, 'tools');
            MenuBar.addAction(delete_selected_action, 'tools');

            Blockbench.showQuickMessage(
                'Model Region Tools 1.0.0 загружен'
            );
        },

        onunload() {
            if (region_select_action) {
                region_select_action.delete();
            }

            if (delete_selected_action) {
                delete_selected_action.delete();
            }
        }
    });
})();