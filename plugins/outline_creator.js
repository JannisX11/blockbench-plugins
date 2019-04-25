var plugin_data = {
    id: 'outline_creator',
    icon: 'crop_square',
    title: 'Outline Creator',
    description: 'Creates stylistic outlines for cubes using negative scale values.',
    about: 'To use the plugin, select an element you want to create an outline for, go to the Filter menu and click on the Create Outline option.',
    author: 'Wither',
    version: '1.0.1',
    min_version: '2.6.0',
    variant: 'both'
};

MenuBar.addAction(new Action({
    id: 'create_outline',
    name: 'Create Outline',
    icon: 'crop_square',
    description: 'Create an outline for selected cubes',
    click: function(ev) {
        if(selected.length != 0) {
            outlineSettings.show();
        }
        else {
            Blockbench.showMessageBox({
                title: 'Error!',
                icon: 'error',
                message: 'You must select at least one cube!',
                buttons: ['OK']
    
            });
        }
    }
}), 'filter');

function createOutline(outline_thickness) {
    Undo.initEdit({cubes: Blockbench.elements, outliner: true});
    selected.forEach(element => {
        var outline = new Cube({
            name: `${element.name}_outline`, 
            from:[element.to[0] + outline_thickness, element.to[1] + outline_thickness, element.to[2] + outline_thickness], 
            to:[element.from[0] - outline_thickness, element.from[1] - outline_thickness, element.from[2] - outline_thickness],
            rotation: element.rotation,
            origin: element.origin,
            faces: {
                north: {
                    uv: element.faces.south.uv,
                    texture: element.faces.south.texture,
                    rotation: 180,
                    cullface: element.faces.south.cullface
                },
                south: {
                    uv: element.faces.north.uv,
                    texture: element.faces.north.texture,
                    rotation: 180,
                    cullface: element.faces.north.cullface
                },
                west: {
                    uv: element.faces.east.uv,
                    texture: element.faces.east.texture,
                    rotation: 180,
                    cullface: element.faces.east.cullface
                },
                east: {
                    uv: element.faces.west.uv,
                    texture: element.faces.west.texture,
                    rotation: 180,
                    cullface: element.faces.west.cullface
                },
                up: {
                    uv: element.faces.down.uv,
                    texture: element.faces.down.texture,
                    rotation: 180,
                    cullface: element.faces.down.cullface
                },
                down: {
                    uv: element.faces.up.uv,
                    texture: element.faces.up.texture,
                    rotation: 180,
                    cullface: element.faces.up.cullface
                }
            }
        }).addTo();
        Blockbench.elements.push(outline);
    });
    Canvas.updateAll();
    Undo.finishEdit('Created outlines');
}

var outlineSettings = new Dialog({
    title: 'Outline Settings',
    id: 'outline_settings',
    form: {
        thickness: {label: 'Thickness', type: 'number', value: 0.1, min: 0, step: 0.1}
    },
    onConfirm: function(formResult) {
        outlineSettings.hide();
        createOutline(formResult.thickness);
    }
});

onUninstall = function() {
    MenuBar.removeAction('filter.create_outline');
}
