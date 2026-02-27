(function() {
    let export_action;
    let add_hitbox_action;
    let import_reference_action;
    let original_conditions = {};

    const HITBOX_FORMAT_ID = 'hytale_hitbox';

    const actions_to_hide = [
        'import_project',
        'import_bbmodel',
        'import_obj',
        'import_gltf',
        'import_image',
        'extrude_texture'
    ];

    function generateHitboxTexture() {
        const canvas = document.createElement('canvas');
        const size = 128;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, size, size);

        ctx.strokeStyle = '#ff0000';
        const lineWidth = 2;
        ctx.lineWidth = lineWidth;

        const offset = lineWidth / 2;
        ctx.strokeRect(offset, offset, size - lineWidth, size - lineWidth);

        return canvas.toDataURL('image/png');
    }

    BBPlugin.register('hytale_hitbox_helper', {
        title: 'Hytale Hitbox Helper',
        author: 'Marck.A.A',
        icon: 'icon.png',
        description: 'Tool to create easy Hytale hitboxes exportable to JSON.',
        min_version: '4.8.0',
        version: '1.0.1',
        variant: 'both',
        onload() {
            const format = new ModelFormat(HITBOX_FORMAT_ID, {
                name: 'Hytale Hitbox',
                description: 'A simple format for creating Hytale hitboxes, exportable to JSON.',
                icon: 'icon-format_hytale',
                category: 'hytale',
                target: 'Hytale',
                block_size: 32,
                centered_grid: true,

                optional_box_uv: true,
                box_uv: false,
                single_texture: false,
                uv_rotation: true,
                per_texture_uv_size: true,

                bone_rig: true,
                rotate_cubes: false,

                onActivation() {
                    document.body.classList.add('hytale_hitbox_mode');
                    let existing_tex = Texture.all.find(t => t.id === 'hitbox_wireframe_tex');
                    if (existing_tex) {
                        existing_tex.fromDataURL(generateHitboxTexture());
                    }
                    Blockbench.showQuickMessage("Hytale Hitbox Mode Active");
                },
                onDeactivation() {
                    document.body.classList.remove('hytale_hitbox_mode');
                }
            });

            Blockbench.addCSS(`
                body.hytale_hitbox_mode #panel_textures,
                body.hytale_hitbox_mode #panel_uv {
                    display: none !important;
                }
            `);

            actions_to_hide.forEach(action_id => {
                if (BarItems[action_id]) {
                    original_conditions[action_id] = BarItems[action_id].condition;
                    BarItems[action_id].condition = () => {
                        if (Format.id === HITBOX_FORMAT_ID) return false;
                        return Condition(original_conditions[action_id]);
                    };
                }
            });

            import_reference_action = new Action('import_hytale_reference', {
                name: 'Import Reference (.blockymodel)',
                icon: 'fa-file-import',
                category: 'file',
                condition: () => Format.id === HITBOX_FORMAT_ID,
                click: function() {
                    Blockbench.import({
                        extensions: ['blockymodel'],
                        type: 'Blockymodel Reference',
                        readtype: 'text',
                        multiple: true
                    }, function(files) {
                        if (!files || files.length === 0) return;

                        if (!Codecs.blockymodel) {
                            Blockbench.showMessageBox({
                                title: 'Missing Plugin',
                                message: 'The official Hytale plugin is required to read .blockymodel files.'
                            });
                            return;
                        }

                        let imported_root_groups = [];
                        let original_id = Format.id;

                        Undo.initEdit({outliner: true});

                        Format.id = 'hytale_prop';

                        files.forEach(file => {
                            try {
                                let json = JSON.parse(file.content);
                                let content = Codecs.blockymodel.parse(json, file.path, { import_to_current_project: true });

                                if (content && content.new_groups) {
                                    let new_groups = content.new_groups;
                                    let imported_tex = content.new_textures && content.new_textures.length > 0 ? content.new_textures[0] : null;

                                    new_groups.forEach(g => {
                                        if (!new_groups.includes(g.parent)) {
                                            imported_root_groups.push(g);
                                        }

                                        if (imported_tex) {
                                            g.children.forEach(child => {
                                                if (child instanceof Cube) {
                                                    for (const key in child.faces) {
                                                        child.faces[key].texture = imported_tex.uuid;
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            } catch (err) {
                                console.error("Error importing file:", file.name, err);
                            }
                        });

                        Format.id = original_id;

                        if (imported_root_groups.length > 0) {
                            Undo.finishEdit('Import Reference (Base)');

                            setTimeout(() => {
                                Undo.initEdit({outliner: true, elements: [], groups: []});
                                unselectAll();

                                let ref_group = Group.all.find(g => g.name.toLowerCase() === 'reference');
                                if (!ref_group) {
                                    ref_group = new Group({
                                        name: 'reference',
                                        isOpen: true
                                    }).init();
                                }

                                imported_root_groups.forEach(g => {
                                    g.addTo(ref_group);
                                });

                                unselectAll();
                                Undo.finishEdit('Format Reference');
                                Canvas.updateAllFaces();
                                Blockbench.showQuickMessage('Reference imported, textured and grouped!');
                            }, 50);
                        } else {
                            Undo.cancelEdit();
                        }
                    });
                }
            });

            add_hitbox_action = new Action('add_hytale_hitbox', {
                name: 'Add Hitbox',
                icon: 'fa-cube',
                category: 'edit',
                condition: () => Format.id === HITBOX_FORMAT_ID,
                click: function() {
                    let hitbox_texture = Texture.all.find(t => t.id === 'hitbox_wireframe_tex');

                    if (!hitbox_texture) {
                        hitbox_texture = new Texture({
                            id: 'hitbox_wireframe_tex',
                            name: 'Hitbox Wireframe'
                        }).add();

                        hitbox_texture.fromDataURL(generateHitboxTexture());
                    }

                    const mesh = new Cube({
                        name: 'hitbox',
                        color: 2,
                        from: [-16, 0, -16],
                        to: [16, 32, 16],
                        autouv: 0
                    });

                    for (const key in mesh.faces) {
                        mesh.faces[key].texture = hitbox_texture.uuid;
                        mesh.faces[key].uv = [0, 0, 16, 16];
                    }

                    mesh.init();

                    Undo.initEdit({elements: [mesh], textures: [hitbox_texture], outliner: true});
                    Undo.finishEdit('Add Hytale Hitbox');

                    Canvas.updateAllFaces();
                }
            });

            BarItems.add_element.side_menu.addAction(add_hitbox_action);
            MenuBar.menus.file.addAction(import_reference_action, 'import');

            export_action = new Action('export_hytale_hitbox', {
                name: 'Export Hytale Hitbox (.json)',
                icon: 'fa-file-export',
                category: 'file',
                condition: () => Format.id === HITBOX_FORMAT_ID,
                click: function() {
                    exportHytaleHitbox();
                }
            });

            MenuBar.menus.file.addAction(export_action, 'export');
        },
        onunload() {
            actions_to_hide.forEach(action_id => {
                if (BarItems[action_id] && original_conditions[action_id] !== undefined) {
                    BarItems[action_id].condition = original_conditions[action_id];
                }
            });

            export_action.delete();
            add_hitbox_action.delete();
            import_reference_action.delete();
        }
    });

    function exportHytaleHitbox() {
        const hitboxes = Cube.all.filter(cube =>
            cube.name.toLowerCase() === 'hitbox' && cube.export
        );

        if (hitboxes.length === 0) {
            Blockbench.showMessageBox({
                title: 'No Hitboxes found',
                message: 'No elements called "hitbox" were found to export.'
            });
            return;
        }

        let json_output = {
            "Boxes": []
        };

        hitboxes.forEach(cube => {
            json_output.Boxes.push({
                "Min": {
                    "X": (cube.from[0] + 16) / 32,
                    "Y": cube.from[1] / 32,
                    "Z": (cube.from[2] + 16) / 32
                },
                "Max": {
                    "X": (cube.to[0] + 16) / 32,
                    "Y": cube.to[1] / 32,
                    "Z": (cube.to[2] + 16) / 32
                }
            });
        });

        const content = JSON.stringify(json_output, null, 2);

        Blockbench.export({
            type: 'JSON Model',
            extensions: ['json'],
            name: Project.name || 'hitbox',
            content: content,
            resource_id: 'hytale_hitbox'
        });
    }

})();