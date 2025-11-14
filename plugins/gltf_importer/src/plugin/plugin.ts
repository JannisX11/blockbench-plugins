import { defer, deferDelete, runDeferred } from './defer';
import { importGltf, ImportOptions } from './import_gltf';
import { isPluginInstalled, showPlugin } from './util';

// MARK: 🟥 plugin
BBPlugin.register('gltf_importer', {

    title:         'glTF Importer',
    author:        '0x13F',
    description:   'Import .GLTF and .GLB models',
    icon:          'icon.png',
    creation_date: '2025-09-25',
    version:       '1.1.0',
    variant:       'desktop',
    min_version:   '4.12.6',
    has_changelog: false,   
    tags:          [ 'Format: Generic Model', 'Importer' ],
	repository:    'https://github.com/JannisX11/blockbench-plugins/tree/master/plugins/gltf_importer',

    onload() {
        
        // MARK: 🟩   action
        deferDelete(new Action('import_gltf', {
            name: 'Import glTF Model',
            icon: 'icon-gltf',
            category: 'file',
            condition: {
                modes: ['edit'],
                method: () => Format?.meshes,
            },
            click() {
                importGltfDialog.show();
            },
        }));
        // Insert import action into import menu before OBJ
        let importMenu = MenuBar.menus.file.structure.find(x => x['id'] === 'import') as CustomMenuItem;
        let importMenuChildren = importMenu.children as MenuItem[];
        let objImportItemIndex = importMenuChildren.findIndex(x => (typeof x === 'string' ? x : x['id']).startsWith('import_obj'));
        importMenuChildren.splice(objImportItemIndex, 0, 'import_gltf');
        defer(() => importMenuChildren.splice(importMenuChildren.indexOf('import_gltf'), 1));

        // MARK: 🟩   dialog

        type ImportGltfFormResult = {
            file?: Filesystem.FileResult,
            scale: number,
            groups: boolean,
            cameras: boolean,
            animations: boolean,
            quads: boolean,
        };
        let importGltfDialog = deferDelete(new Dialog('import_gltf_dialog', {
            title: 'Import glTF',
    
            form: {
                ['file']: {
                    type: 'file',
                    label: 'glTF File',
                    return_as: 'file',
                    extensions: ['gltf', 'glb'],
                    resource_id: 'gltf',
                    filetype: 'glTF Model',
                    readtype: 'buffer',
                },
                ['scale']: {
                    type: 'number',
                    label: 'Scale',
                    value: Settings.get('model_export_scale'),
                },
                ['groups']: {
                    type: 'checkbox',
                    label: 'Import Groups',
                    value: false,
                },
                // TODO: enable
                // ['cameras']: {
                //     type: 'checkbox',
                //     label: 'Import Cameras',
                //     value: isPluginInstalled('cameras'),
                // },
                // ['animations']: {
                //     type: 'checkbox',
                //     label: 'Import Animations',
                //     value: true,
                // },
                // ['quads']: {
                //     type: 'checkbox',
                //     label: 'Merge Quads',
                //     value: true,
                // },
                ['info_sep']: '_',
                ['info']: {
                    type: 'info',
                    text: 'It is currently not possible to import armatures, animations or cameras.',
                },
            },
    
            onConfirm(formOptions: ImportGltfFormResult) {
                if (formOptions.file == undefined)
                    return false;

                let importOptions: ImportOptions = {
                    file: formOptions.file!,
                    scale: formOptions.scale,
                    groups: formOptions.groups,
                    cameras: formOptions.cameras,
                    animations: formOptions.animations,
                    mergeQuads: formOptions.quads,
                    undoable: true,
                    selectResult: true,
                }

                // Return early if the model contains cameras to import but it's not installed
                if (formOptions.cameras && !isPluginInstalled('cameras'))
                    importOptions.cameras = 'NOT_INSTALLED';

                importGltf(importOptions)
                    .then(async content => {

                        if (content === 'UNSUPPORTED_CAMERAS') {
                            importGltfDialog.show();
                            warnAboutCameras();
                            return;
                        } 

                        if (content.unsupportedArmatures)
                            await warnAboutUnsupportedArmatures();

                        if (content.usesRepeatingWrapMode && content.uvOutOfBounds)
                            warnAboutRepeatingTextures();
                    });

            },
        }));

        // Allow other plugins to access the import function
        window['importGltf'] = importGltf;
        defer(() => delete window['importGltf']);

    },

    onunload() {
        runDeferred();
    },
});

// MARK: 🟥 warnings

function warnAboutUnsupportedArmatures(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        Blockbench.showMessageBox({
            title: 'Armatures not supported',
            message: 'The imported glTF model makes use of armatures. '
                + 'The version of Blockbench you are currently using does not support armatures. '
                + 'If you want to import armatures from models, please update to the lastest version of Blockbench.',
            icon: 'warning',
            width: 520,
        }, () => resolve());
    });
}

function warnAboutRepeatingTextures() {
    if (isPluginInstalled('repeating_textures')) {
        if (!Settings.get('repeating_textures')) {
            // Installed but disabled, suggest enabling
            Blockbench.showMessageBox({
                title: 'Repeating Textures not enabled',
                message: 'The imported glTF model makes use of repeating textures. '
                    + 'Repeating textures is are currently disabled. '
                    + 'Would you like to enable them now?',
                icon: 'warning',
                width: 520,
                buttons: ['dialog.yes', 'dialog.no'],
            }, (result: number) => {
                if (result === 0) {
                    (BarItems['toggle_repeating_textures'] as Action).trigger();
                    Blockbench.showQuickMessage('Repeating Textures enabled');
                }
            });
        }
    // Not installed, suggest installing
    } else {
        Blockbench.showMessageBox({
            title: 'Repeating Textures plugin not installed',
            message: 'The imported glTF model makes use of repeating textures. '
                + 'Blockbench does not support this by default, so the model may appear incorrect. '
                + 'Would you like to install the "Repeating Textures" plugin to fix this?',
            icon: 'warning',
            width: 520,
            buttons: ['dialog.yes', 'dialog.no'],
        }, (result: number) => {
            if (result === 0)
                showPlugin('repeating_textures');
        });
    }
}

function warnAboutCameras() {
    Blockbench.showMessageBox({
        title: 'Cameras plugin not installed',
        message: 'The imported glTF model contains cameras which you have chosen to import, '
            + 'but the "Cameras" plugin is not currently installed. '
            + 'Would you like to install the "Cameras" plugin now?',
        icon: 'warning',
        width: 520,
        buttons: ['dialog.yes', 'dialog.no'],
    }, (result: number) => {
        if (result === 0)
            showPlugin('cameras');
    });
}
