var createOutlineAction;

Plugin.register('outline_creator', {
    icon: 'crop_square',
    title: 'Outline Creator',
    description: 'Creates stylistic outlines for cubes and meshes using negative scale values.',
    about: 'Select an element you want to create an outline for, go to the `Tools` menu and click on the `Create Outline` option.',
    author: 'Wither',
	contributors: ["SirJain", "CppJavaCoder", "JannisX11"],
    version: '1.2.0',
    min_version: '4.2.0',
    variant: 'both',

    onload() {
        createOutlineAction = new Action({
            id: 'create_outline',
            name: 'Create Outline',
            icon: 'crop_square',
            description: 'Create an outline for selected elements',
            click(ev) {
                if (Outliner.selected.length === 0) {
                    Blockbench.showMessageBox({
                        title: 'No valid elements selected',
                        icon: 'error',
                        message: 'You must select at least one cube or mesh!',
                        buttons: ['OK']
                    });
                }

                else if (!Outliner.selected.find(el => el instanceof Cube || el instanceof Mesh)) {
                    Blockbench.showMessageBox({
                        title: 'Invalid elements',
                        icon: 'error',
                        message: 'You can only add outlines to cubes and meshes!',
                        buttons: ['OK']
                    });
                }

                else {
                    let texture_options = {};
                    let outline_texture = Texture.all.find(tex => {
                        return tex.render_sides == 'front';
                    })
                    if (outline_texture) {
                        texture_options.outline_texture = outline_texture.name;
                    }
                    if (!Format.single_texture) {
                        texture_options.generate = 'Generate Texture';
                    }
                    for (let element of Outliner.selected) {
                        if (!(element instanceof Cube || element instanceof Mesh)) continue;
                        let texture = element.faces[Object.keys(element.faces)[0]].getTexture();
                        if (texture instanceof Texture) texture_options.current = texture.name;
                    }
                    new Dialog({
                        title: 'Outline Settings',
                        id: 'outline_settings',
                        form: {
                            thickness: {label: 'Thickness', type: 'number', value: 0.1, min: 0, step: 0.1},
                            texture: {label: 'Texture', type: 'select', options: texture_options},
                            color: {
                                label: 'data.color',
                                type: 'color',
                                colorpicker: TextureGenerator.background_color,
                                toggle_enabled: true,
                                toggle_default: true,
                                condition: result => result.texture == 'generate'
                            },
                        },
                        onConfirm(formResult) {
                            createOutline(formResult);
                        }
                    }).show();
                }
            }
        });
        MenuBar.addAction(createOutlineAction, 'tools');
    },
    onunload() {
        createOutlineAction.delete();
    }
})

function createOutline(options) {
    let outline_thickness = options.thickness;
    let textures = [];
    Undo.initEdit({elements: Outliner.elements, outliner: true, textures, selected_texture: true});

    // Texture
    let texture;
    if (options.texture == 'generate') {
		texture = new Texture({
			internal: true,
			keep_size: true,
			name: 'outline.png',
            wrap_mode: 'clamp',
            render_sides: 'front'
		})
        let canvas = document.createElement('canvas');
        canvas.width = canvas.height = 16;
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = new tinycolor(options.color ?? '#000000').toRgbString();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        texture.fromDataURL(canvas.toDataURL()).add(false).select();
        texture.uv_width = canvas.width;
        texture.uv_height = canvas.height;
        textures.push(texture);

    } else if (options.texture == 'outline_texture') {
        texture = Texture.all.find(tex => {
            return tex.render_sides == 'front';
        })
    }

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
                    texture: texture ? texture.uuid : element.faces.south.texture,
                    rotation: 180,
                    cullface: element.faces.south.cullface
                },
                south: {
                    uv: element.faces.north.uv,
                    texture: texture ? texture.uuid : element.faces.north.texture,
                    rotation: 180,
                    cullface: element.faces.north.cullface
                },
                west: {
                    uv: element.faces.east.uv,
                    texture: texture ? texture.uuid : element.faces.east.texture,
                    rotation: 180,
                    cullface: element.faces.east.cullface
                },
                east: {
                    uv: element.faces.west.uv,
                    texture: texture ? texture.uuid : element.faces.west.texture,
                    rotation: 180,
                    cullface: element.faces.west.cullface
                },
                up: {
                    uv: element.faces.down.uv,
                    texture: texture ? texture.uuid : element.faces.down.texture,
                    rotation: 180,
                    cullface: element.faces.down.cullface
                },
                down: {
                    uv: element.faces.up.uv,
                    texture: texture ? texture.uuid : element.faces.up.texture,
                    rotation: 180,
                    cullface: element.faces.up.cullface
                }
            }
        });
        outline.addTo(element.parent);
        outline.init();
    }

    // Mesh handling
    for (const mesh of Mesh.selected) {
        let outline = mesh.duplicate();

        const oldShading = outline.shading;
        outline.shading = "smooth";
        // calculateNormals() only works with smooth shading???
        const normals = outline.calculateNormals();

        outline.shading = oldShading;

        outline.forAllFaces(face => {
            face.invert();
            if (texture) face.texture = texture.uuid;
        })

        for (const key in outline.vertices) {
            const v = outline.vertices[key];
            const n = normals[key];
            if (!n) continue;
            const normalizeBy = Math.abs(n[0])+Math.abs(n[1])+Math.abs(n[2]);

            v[0] += (n[0]/normalizeBy) * (outline_thickness * 2);
            v[1] += (n[1]/normalizeBy) * (outline_thickness * 2);
            v[2] += (n[2]/normalizeBy) * (outline_thickness * 2);
        }
        outline.name += "_outline";
    }

    Canvas.updateView({
	    elements: Outliner.selected,
	    element_aspects: {transform: true, geometry: true, faces: true},
    })

    Undo.finishEdit('Created outlines');
}

