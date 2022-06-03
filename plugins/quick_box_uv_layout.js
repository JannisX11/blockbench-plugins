(function () {
    let button;
    Plugin.register('quick_box_uv_layout', {
        title: 'Quick Box-UV Layout',
        author: 'Manuel-3',
        description: 'Button that changes UV of a Per-face cube into Box-UV layout.',
        about: 'This plugin simply adds a button that rearranges your individual Per-face UV rectangles in the same way Box-UV mode would. This is handy if you want to use the standard Box-UV format, but also have the flexibility of Per-face UV mode.',
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
                        const h = cube.uv_offset[0];
                        const v = cube.uv_offset[1];
                        const x = cube.size(0, true);
                        const y = cube.size(1, true);
                        const z = cube.size(2, true);

                        cube.faces['north'].uv = [h + z, v + z, h + z + x, v + z + y];
                        cube.faces['east'].uv = [h, v + z, h + z, v + z + y];
                        cube.faces['west'].uv = [h + z + x, v + z, h + z + x + z, v + z + y];
                        cube.faces['south'].uv = [h + z + x + z, v + z, h + z + x + z + x, v + z + y];
                        cube.faces['up'].uv = [h+ z + x, v + z, h + z, v];
                        cube.faces['down'].uv = [h + z + x + x, v, h + z + x, v + z];
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
