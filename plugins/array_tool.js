(function() {
    var open_menu;

    Plugin.register('array_tool', {
        title: 'Array tool',
        author: 'Malik12tree',
        description: 'A Plugin that adds an Array tool that creates an array of copies of the base object, with each copy being offset from the previous one in any of a number of possible ways.',
        icon: 'reorder',
        version: '0.0.1',
        variant: 'both',
        onload() {
            open_menu = new Action('array', {
                name: 'Array Tool',
                description: 'choose array settings',
                icon: 'reorder',
                click: function() { 
                    if(selected.length != 0) {
                    var array = new Dialog({
                        id: 'array_settings_dailog',
                        title: 'Array Settings',
                        form: {
                            array_count: {label: 'Array Count', type: "number", value: 1, min: 0, step: 1},
                            array_offset: {label: "Array Offset", type: "vector", value: [1,1,1], step: 0.25},
                        },
                        onConfirm: function(formResult) {
                            Undo.initEdit({elements: Outliner.elements});
                                array.hide();
                                for (var m = 0; m < formResult.array_count; m++) {
                                    array_confirm(formResult.array_offset, m);
                                }
                                Undo.finishEdit('Confirmed Array Dialog');
                        }
                    }).show()
                }
                else {
                    Blockbench.showMessageBox({
                        title: 'Error!',
                        icon: 'error_outline',
                        message: 'You must select at least one cube!',
                        buttons: ['ok']
            
                    });
                }
            }
            });
            MenuBar.addAction(open_menu, 'filter')
        },
        onunload() {
            open_menu.delete();
        }
        
    });

})();   

function array_confirm(array_offset, m) {
    Undo.initEdit({elements: Outliner.elements});
    selected.forEach(selected_cubes => {
        var array_cube = new Cube({
            name: `${selected_cubes.name}_array`,
            rotation: selected_cubes.rotation,
            origin: selected_cubes.origin,
            from:[selected_cubes.to[0] + array_offset[0] + m * array_offset[0], selected_cubes.to[1] + array_offset[1] + m * array_offset[1], selected_cubes.to[2] + array_offset[2] + m * array_offset[2]], 
            to:[selected_cubes.from[0] + array_offset[0] + m * array_offset[0], selected_cubes.from[1] + array_offset[1] + m * array_offset[1], selected_cubes.from[2] + array_offset[2] + m * array_offset[2]],
            color: selected_cubes.color,
            faces: {
                north: {
                    uv: selected_cubes.faces.south.uv,
                    texture: selected_cubes.faces.south.texture,
                    rotation: 180,
                    cullface: selected_cubes.faces.south.cullface
                },
                south: {
                    uv: selected_cubes.faces.north.uv,
                    texture: selected_cubes.faces.north.texture,
                    rotation: 180,
                    cullface: selected_cubes.faces.north.cullface
                },
                west: {
                    uv: selected_cubes.faces.east.uv,
                    texture: selected_cubes.faces.east.texture,
                    rotation: 180,
                    cullface: selected_cubes.faces.east.cullface
                },
                east: {
                    uv: selected_cubes.faces.west.uv,
                    texture: selected_cubes.faces.west.texture,
                    rotation: 180,
                    cullface: selected_cubes.faces.west.cullface
                },
                up: {
                    uv: selected_cubes.faces.down.uv,
                    texture: selected_cubes.faces.down.texture,
                    rotation: 180,
                    cullface: selected_cubes.faces.down.cullface
                },
                down: {
                    uv: selected_cubes.faces.up.uv,
                    texture: selected_cubes.faces.up.texture,
                    rotation: 180,
                    cullface: selected_cubes.faces.up.cullface
                }
            }
        }).init()
    });
        Undo.finishEdit('Created Array');
}