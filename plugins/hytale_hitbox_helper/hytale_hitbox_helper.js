(function() {
    let export_action;
    let add_hitbox_action;

    const HITBOX_FORMAT_ID = 'hytale_hitbox';

    BBPlugin.register('hytale_hitbox_helper', {
        title: 'Hytale Hitbox Helper',
        author: 'Marck.A.A',
        icon: 'icon.png',
        description: 'Tool to create easy Hytale hitboxes exportable to JSON.',
		min_version: '4.8.0',
        version: '1.0.0',
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
                box_uv: false,
                optional_box_uv: false,
                single_texture: false,
                rotate_cubes: false,
                
                onActivation() {
                    document.body.classList.add('hytale_hitbox_mode');
                    const viewMode = BarItems['view_mode'];
                    if (viewMode) {
                        viewMode.value = 'wireframe';
                        viewMode.onChange();
                    }
                    Blockbench.showQuickMessage("Hytale Hitbox Mode Active");
                },
                onDeactivation() {
                    BarItems['view_mode'].value = 'textured';
                    BarItems['view_mode'].onChange();
                    document.body.classList.remove('hytale_hitbox_mode');
                }
            });

            Blockbench.addCSS(`
                body.hytale_hitbox_mode #panel_textures,
                body.hytale_hitbox_mode #panel_uv {
                    display: none !important;
                }
            `);


            add_hitbox_action = new Action('add_hytale_hitbox', {
                name: 'Add Hitbox',
                icon: 'fa-cube',
                category: 'edit',
                condition: () => Format.id === HITBOX_FORMAT_ID,
                click: function() {
                    const mesh = new Cube({
                        name: 'hitbox',
                        color: 2, 
                        from: [-16, 0, -16], 
                        to: [16, 32, 16],
                    }).init();
                    
                    mesh.mesh.material.transparent = true;
                    mesh.mesh.material.opacity = 0.5;
                    
                    Undo.initEdit({elements: [mesh], outliner: true});
                    Undo.finishEdit('Add Hytale Hitbox');
                }
            });

            BarItems.add_element.side_menu.addAction(add_hitbox_action);

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
            export_action.delete();
            add_hitbox_action.delete();
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