(function () {
    let button;
    Plugin.register('quick_box_uv_layout', {
        title: 'Quick Box-UV Layout',
        author: 'Manuel-3',
        description: 'Button that changes UV of a Per-face cube into Box-UV layout.',
        icon: 'calendar_view_month',
        version: '0.0.1',
        variant: 'both',
        onload() {
            button = new Action('quick_box_uv_layout', {
                name: 'Quick Box-UV Layout',
                description: 'Changes UV into Box-UV layout.',
                icon: 'calendar_view_month',
                click: function () {
                    Undo.initEdit({ elements: Cube.selected });

                    if (Project.box_uv) Project.box_uv = false;

                    Cube.selected.forEach(cube => {
                        const x = cube.size(0, true);
                        const y = cube.size(1, true);
                        const z = cube.size(2, true);

                        cube.faces['north'].uv = [z, z, z + x, z + y];
                        cube.faces['east'].uv = [0, z, z, z + y];
                        cube.faces['west'].uv = [z + x, z, z + x + z, z + y];
                        cube.faces['south'].uv = [z + x + z, z, z + x + z + x, z + y];
                        cube.faces['up'].uv = [z, 0, z + x, z];
                        cube.faces['down'].uv = [z + x, 0, z + x + x, z];
                    });
                    Undo.finishEdit('convert to box-uv layout');
                }
            });
            Toolbars.uv_editor.add(button);
        },
        onunload() {
            button.delete();
        }
    });
})();
