var createOutlineAction;

Plugin.register('outline_creator', {
    icon: 'crop_square',
    title: 'Outline Creator',
    description: 'Creates stylistic outlines for cubes and meshes using negative scale values.',
    about: 'Select an element you want to create an outline for, go to the `Tools` menu and click on the `Create Outline` option.',
    author: 'Wither',
    version: '1.1.0',
    min_version: '4.2.0',
    variant: 'both',

    onload() {
        createOutlineAction = new Action({
            id: 'create_outline',
            name: 'Create Outline',
            icon: 'crop_square',
            description: 'Create an outline for selected elements',
            click(ev) {
                if (selected.length === 0) {
                    Blockbench.showMessageBox({
                        title: 'No valid elements selected',
                        icon: 'error',
                        message: 'You must select at least one cube or mesh!',
                        buttons: ['OK']
                    });
                }

                else if (!selected.find(el => el instanceof Cube || el instanceof Mesh)) {
                    Blockbench.showMessageBox({
                        title: 'Invalid elements',
                        icon: 'error',
                        message: 'You can only add outlines to cubes and meshes!',
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
    let newElements = [];

    // Cube handling
    for (const element of Cube.selected) {
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

        newElements.push(outline);
    }

    // Mesh handling
    for (const mesh of Mesh.selected) {
        mesh.duplicate();
        mesh.oldVertices = {};

        for (const key in mesh.vertices) {
            mesh.oldVertices[key] = mesh.vertices[key].slice();
        }

        mesh.forAllFaces(face => {
            face.invert();
        })

        mesh.resize(outline_thickness * 2, 0, false, false, true);
        mesh.resize(outline_thickness, 1, false, false, true);
        mesh.resize(outline_thickness * 2, 2, false, false, true);
        mesh.name = mesh.name + "_outline";
        
        newElements.push(mesh);
    }

    Canvas.updateView({
	elements: newElements,
	element_aspects: {transform: true, geometry: true},
    })

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
