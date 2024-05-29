(function() {
    var separator;
    var actionExportGroup;
    var originalExportFunction;
    BBPlugin.register('outliner_group_exporter', {
        title: 'Group Exporter',
        author: 'MrCrayfish',
        icon: 'icon.png',
        description: 'A simple plugin to allow you to export a group from the outliner as a model. Only cubes inside the group will be exported.',
        tags: ['Minecraft Java Edition'],
        version: '0.0.1',
        min_version: '4.10.1',
        variant: 'both',
        onload() {
            // Add translations
            window.Language.addTranslations('en', {
                'action.export_outliner_group': "Export"
            });

            // Setup action and separator
            separator = new MenuSeparator('export');
            actionExportGroup = new Action('export_outliner_group', {
                icon: 'insert_drive_file',
                category: 'export',
                // Only allow on java_block format or custom formats that can support it (e.g. ones that use Cubes)
                condition: () => Format.id === 'java_block' || Format.allowOutlinerGroupExporting,
                children() {
                    return MenuBar.menus.file.structure.find(menu => menu.id === 'export')?.children;
                }
            });

            // Append the separator and action to group menu
            Group.prototype.menu.addAction(separator);
            Group.prototype.menu.addAction(actionExportGroup);

            let restrictCubes = (restrict) => {
                if(!restrict)
                    return;

                // Get the top parent group
                let group = getCurrentGroup();

                // If none selected, just return
                if(!group) {
                    return;
                }

                // Find children cubes in the group
                let selectedCubes = [];
                group.forEachChild(cube => {
                    selectedCubes.push(cube);
                }, Cube, false);

                // Update export flag on all cubes
                Cube.all.forEach(cube => {
                    cube.export = selectedCubes.includes(cube);
                });
            }

            // Resets the export flag on all cubes
            let resetCubes = (restrict) => {
                if(!restrict)
                    return;
                Cube.all.forEach(cube => {
                    cube.export = true;
                });
            }

            // Override export function
            originalExportFunction = Codec.prototype.export;
            Codec.prototype.export = async function () {
                // Check if the menu is open. Is this okay for web/mobile app?
                let restrict = actionExportGroup.menu_node.classList.contains("opened");
                restrictCubes(restrict); 
                originalExportFunction.call(this);
                resetCubes(restrict);
            };
        },
        onunload() {
            // Clean up
            Codec.prototype.export = originalExportFunction;
            Group.prototype.menu.removeAction(separator);
            Group.prototype.menu.removeAction(actionExportGroup);
            actionExportGroup.delete();
        }
    });
})()