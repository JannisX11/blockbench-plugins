var createOutlineAction;

Plugin.register('outline_creator', {
    icon: 'crop_square',
    title: 'Outline Creator',
    description: 'Creates stylistic outlines for cubes using negative scale values.',
    about: 'Select an element you want to create an outline for, go to the `Tools` menu and click on the `Create Outline` option.\n<b>Note: This plugin only works on cubes!</b>',
    author: 'Wither',
    version: '1.0.3',
    min_version: '4.2.0',
    variant: 'both',

    onload() {
        createOutlineAction = new Action({
            id: 'create_outline',
            name: 'Create Outline',
            icon: 'crop_square',
            description: 'Create an outline for selected cubes',
            click(ev) {
                if (selected.length === 0) {
                    Blockbench.showMessageBox({
                        title: 'No elements selected',
                        icon: 'error',
                        message: 'You must select at least one cube!',
                        buttons: ['OK']
                    });
                }

                else if (!selected.find(el => el instanceof Cube)) {
                    Blockbench.showMessageBox({
                        title: 'Invalid elements',
                        icon: 'error',
                        message: 'You can only add outlines to cubes!',
                        buttons: ['OK']
                    });
                }

                else {
                    outlineSettings.show();
                }
            }
        });
        MenuBar.addAction(createOutlineAction, 'tools');
    },
    onunload() {
        createOutlineAction.delete();
    }
})

function createOutline(outline_thickness) {
    Undo.initEdit({elements: Outliner.elements, outliner: true});

    for (const element of selected) {
        if (!(element instanceof Cube)) {
            Blockbench.showQuickMessage("Skipped over invalid element(s)...", 1500)
            continue;
        }

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
        }).init();
    };
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
