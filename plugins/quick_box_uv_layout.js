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

                    // Horizontal and vertical offset
                    let h = 0;
                    let v = 0;

                    // If box-uv then convert to per-face
                    if (Project.box_uv) Project.box_uv = false;

                    Cube.selected.forEach(cube => {
                        // Get cube size
                        const x = cube.size(0, true);
                        const y = cube.size(1, true);
                        const z = cube.size(2, true);

                        // Get the required offset by looking at the top left corner of the up face
                        h = cube.faces['up'].uv[2] - z;
                        v = cube.faces['up'].uv[3];

                        // Set individual faces position and size
                        // Note that up face is flipped on both axes and down face is flipped on the horizontal axis
                        cube.faces['north'].uv = [h + z, v + z, h + z + x, v + z + y];
                        cube.faces['east'].uv = [h, v + z, h + z, v + z + y];
                        cube.faces['west'].uv = [h + z + x, v + z, h + z + x + z, v + z + y];
                        cube.faces['south'].uv = [h + z + x + z, v + z, h + z + x + z + x, v + z + y];
                        cube.faces['up'].uv = [h+ z + x, v + z, h + z, v];
                        cube.faces['down'].uv = [h + z + x + x, v, h + z + x, v + z];
                    });
                    Undo.finishEdit('convert to box-uv layout');
                    // Update view to make the changes show
                    Canvas.updateView({elements: Cube.selected, element_aspects: {uv: true}});
                }
            });
            Toolbars.uv_editor.add(button);
        },
        onunload() {
            button.delete();
        }
    });
})();
