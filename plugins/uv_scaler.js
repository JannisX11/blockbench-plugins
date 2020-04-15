(function() {
    var button;

    Plugin.register('uv_scaler', {
        title: 'UV Scaler',
        author: 'dragonmaster95',
        description: 'Use this plugin to scale UVs of certain elements/faces. This does NOT work with box uv!',
        icon: 'aspect_ratio',
        version: '1.0.0',
        variant: 'both',
        onload() {

            //Default values
            if (localStorage.getItem('uv_scaler#xScale') == null) localStorage.setItem('uv_scaler#xScale',1);
            if (localStorage.getItem('uv_scaler#yScale') == null) localStorage.setItem('uv_scaler#yScale',1);
            if (localStorage.getItem('uv_scaler#scaleAll') == null) localStorage.setItem('uv_scaler#scaleAll','selected');
            if (localStorage.getItem('uv_scaler#side') == null) localStorage.setItem('uv_scaler#side','all');

            button = new Action('scale_uv', {
                name: 'UV Scaler',
                description: 'Use this plugin to scale UVs of certain elements/faces. Does NOT work with box uv!',
                icon: 'aspect_ratio',
                click: function() {
                    if (Project.box_uv) {
                        Blockbench.showMessageBox({
                            title: "Error",
                            message: `This plugin cannot be used on a project that uses Box UV.
                            To disable Box UV, go to File > Project and make sure the "Box UV" option is not ticked.
                            (Disclaimer: This is NOT possible in all formats!)`
                        });
                        return;
                    }
                    console.log();
                    var lines = [
                        {
                            label: 'Scale X',
                            node: '<input class="dark_bordered half" type="number" min=0 id="xScale" value="'+localStorage.getItem('uv_scaler#xScale')+'" inline="true">'
                        },
                        {
                            label: 'Scale Y',
                            node: '<input class="dark_bordered half" type="number" min=0 id="yScale" value="'+localStorage.getItem('uv_scaler#yScale')+'" inline="true">'
                        },
                        {
                            label: 'Affect only selected elements',
                            node: '<input type="checkbox" id="selectedElements" '+localStorage.getItem('uv_scaler#scaleAll')+'>'
                        },
                        {
                            label: 'Affected side',
                            node: '<select class="dark_bordered half" id="uv_scaler_faces" type="select">' +
                                '<option value="all">All</option>'+
                                '<option value="north">North</option>' +
                                '<option value="east">East</option>' +
                                '<option value="south">South</option>' +
                                '<option value="west">West</option>' +
                                '<option value="up">Up</option>' +
                                '<option value="down">Down</option>'+
                                '</select>'
                        }
                    ]
                    var dialog = new Dialog({
                        id: 'uv_scaler',
                        title: 'UV Scaler',
                        draggable: true,
                        lines: lines,
                        onConfirm: function()
                        {
                            let xScale = $('.dialog#uv_scaler input#xScale').val();
                            let yScale = $('.dialog#uv_scaler input#yScale').val();
                            let scaleAll = $('.dialog#uv_scaler input#selectedElements').is(':checked');
                            let side = $('.dialog#uv_scaler select#uv_scaler_faces').val();


                            if (xScale < 0 || yScale < 0) {
                                Blockbench.showMessageBox({
                                    title: "Warning",
                                    message: `This plugin currently does not support negative scale values.
                            If you want to flip/mirror UVs please use the "UV Mirror X/Y" tools.
                            (You might need to add them to one of your toolbars by clicking the 3 dots next to it to find them)`
                                });
                                this.hide();
                                return;
                            }

                            localStorage.setItem('uv_scaler#xScale',xScale);
                            localStorage.setItem('uv_scaler#yScale',yScale);
                            scaleAll ? localStorage.setItem('uv_scaler#scaleAll','checked') : localStorage.setItem('uv_scaler#scaleAll','');;
                            localStorage.setItem('uv_scaler#side',side);

                            if (!scaleAll) {
                                Undo.initEdit({elements: Cube.all});
                                Cube.all.forEach(function(obj) {
                                    scaleUVs(obj, xScale, yScale, side);
                                });
                            } else {
                                Undo.initEdit({elements: Cube.selected});
                                Cube.selected.forEach(function(obj) {
                                    scaleUVs(obj, xScale, yScale, side);
                                });
                            }
                            Canvas.updateAllUVs();
                            Canvas.updateAllFaces();
                            main_uv.displayFrame();
                            this.hide();
                            Undo.finishEdit('scaled UVs');
                        }
                    })
                    dialog.show();

                    let sideSelector = document.getElementById('uv_scaler_faces');
                    sideSelector.value = localStorage.getItem('uv_scaler#side');

                }
            });
            MenuBar.addAction(button, 'filter');
        },
        onunload() {
            button.delete();
            localStorage.removeItem('uv_scaler#xScale');
            localStorage.removeItem('uv_scaler#yScale');
            localStorage.removeItem('uv_scaler#scaleAll');
            localStorage.removeItem('uv_scaler#side');
        }
    });

    function scaleUVs(obj, xScale, yScale, side) {
        if (side === 'all') {
            for (var face in obj.faces) {
                scaleFaces(xScale, yScale, obj.faces, face);
            }
        } else {
            scaleFaces(xScale, yScale, obj.faces, side);
        }
    }

    function scaleFaces(xScale, yScale, faces, side) {
        let cache = [0,0,0,0];
        let sizeX = (faces[side].uv[2] - faces[side].uv[0]) * xScale
        if (sizeX > Project.texture_width) sizeX = Project.texture_width;
        if (sizeX < -Project.texture_width) sizeX = -Project.texture_width;
        if (xScale > Project.texture_width) xScale = Project.texture_width;
        if (xScale < -Project.texture_width) xScale = -Project.texture_width;

        let sizeY = (faces[side].uv[3] - faces[side].uv[1]) * yScale
        if (sizeY > Project.texture_height) sizeY = Project.texture_height;
        if (sizeY < -Project.texture_height) sizeY = -Project.texture_height;
        if (yScale > Project.texture_height) yScale = Project.texture_height;
        if (yScale < -Project.texture_height) yScale = -Project.texture_height;


        cache = faces[side].uv[2] * xScale;
        if (cache > Project.texture_width) {
            cache = Project.texture_width;
            faces[side].uv[0] = cache - sizeX;
        } else if (cache < 0) {
            cache = 0;
            faces[side].uv[0] = -sizeX;
        }
        else faces[side].uv[0] = cache - sizeX;
        faces[side].uv[2] = cache;

        cache = faces[side].uv[3] * yScale;
        if (cache > Project.texture_height) {
            cache = Project.texture_height;
            faces[side].uv[1] = Project.texture_height - sizeY;
        } else if (cache < 0) {
            cache = 0;
            faces[side].uv[1] = -sizeY;
        }
        else faces[side].uv[1] = cache - sizeY;
        faces[side].uv[3] = cache;

        /*
        for (let i = 0; i<4; i++) {
            if (i == 0 || i == 2) {
                cache[i] = faces[side].uv[i] * xScale;
                if (i==2 && cache[i] > Project.texture_width) {
                    cache[2] = Project.texture_width;
                    faces[side].uv[0] = Project.texture_width - sizeX;
                } else if (cache[2] < 0) {
                    cache[2] = 0;
                    faces[side].uv[0] = -sizeX;
                }
            }
            else {
                cache[i] = faces[side].uv[i] * yScale;
                if (cache[3] > Project.texture_height) {
                    cache[3] = Project.texture_height;
                    faces[side].uv[1] = Project.texture_height - sizeY;
                } else if (cache[3] < 0) {
                    cache[3] = 0;
                    faces[side].uv[1] = -sizeY;
                }
            }
            if (cache[i] < 0) cache[i] = 0;
            faces[side].uv[i] = cache[i];
        }*/
    }
})();
