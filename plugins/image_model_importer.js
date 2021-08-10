Plugin.register('image_model_importer', {
    title: 'Image Model Importer',
    author: 'Malik12tree',
    description: 'Turns image files into 3d model.',
    icon: 'image',
    version: '0.0.1',
    variant: 'both',
    onload() {
        ImageModelImport = new Action('imi', {
            name: 'Import Image Model',
            description: 'import an image to Turn it into a 3d model.',
            icon: 'image',
            click: function() {
                if(!Project.box_uv){
                    ImportImageModel();
                } else {
                    Blockbench.showMessageBox({
                        title: 'Error!',
                        icon: 'error',
                        message: 'This Plugin only supports Per-face UV mode.',
                        buttons: ['OK']
            
                    });
                }

            }
        });
        MenuBar.addAction(ImageModelImport, 'file.import')
    },
    onunload() {
        ImageModelImport.delete();
    }
    
});

            //import files
    function ImportImageModel() {
        var added_elements = []
        var added_textures = []
        var added_elements_ = []
        var XCubes = []
        //Alpha Cube?
        var AlphaCube_ = []

        Undo.initEdit({elements: added_elements_, textures: added_textures,outliner: true, selection: true, uv_mode: true});
        Blockbench.import({
            extensions: ['png'],
            type: 'PNG File',
            readtype: 'binary',
        }, (files) => {

            //file name & path
            var imgfilename = files[0].name.replace(/\.[^/.]+$/, '')
            var imgfilepath = files[0].path

            //new texture
            var imgtexture = new Texture({
                name: imgfilename
            }).fromPath(`${imgfilepath}`).add()
            added_textures.push(imgtexture);

            //height & width
            var img = new Image();
            img.src = imgfilepath;
            img.onload = function(){
            var imgWidth = img.width;
            var imgHeight = img.height;

            Project.texture_width = imgWidth;
            Project.texture_height = imgHeight;

            var imggroup = new Group(imgfilename).init();

            //X cubes
            for (var Xloop = -1; Xloop < imgWidth; Xloop++) {
                    var cubeX = new Cube({
                        name: `${imgfilename}`,
                        from: [-8 + 1 + Xloop * 1, imgHeight - 1, 0],
                        to: [-7 + 1 + Xloop * 1, imgHeight, 1],
                        faces: {
                            south: {
                                uv: [0 + 1 + Xloop * 1, 0, 1 + 1 + Xloop * 1, 1],
                                texture: imgtexture,
                            },
                            north: {
                                uv: [0 + 1 + Xloop * 1, 0, 1 + 1 + Xloop * 1, 1],
                                texture: imgtexture,
                            },
                            east: {
                                uv: [0 + 1 + Xloop * 1, 0, 1 + 1 + Xloop * 1, 1],
                                texture: imgtexture,
                            },
                            west: {
                                uv: [0 + 1 + Xloop * 1, 0, 1 + 1 + Xloop * 1, 1],
                                texture: imgtexture,
                            },
                            down: {
                                uv: [0 + 1 + Xloop * 1, 0, 1 + 1 + Xloop * 1, 1],
                                texture: imgtexture,
                            },
                            up: {
                                uv: [0 + 1 + Xloop * 1, 0, 1 + 1 + Xloop * 1, 1],
                                texture: imgtexture,
                            }
                        }
                    }).addTo(imggroup).init();
                    added_elements.push(cubeX);
                    XCubes.push(cubeX);
                    AlphaCube_.push(cubeX);

            }
            XCubes.forEach(addedxcubes => {
                for (var Yloop = -1; Yloop < imgHeight; Yloop++) {
                    if(Yloop < imgHeight - 1) {
                        var cubeY = new Cube({
                            name: `${imgfilename}`,
                            from: [addedxcubes.from[0], addedxcubes.from[1] - 1 - Yloop *1, addedxcubes.from[2]],
                            to: [addedxcubes.to[0], addedxcubes.to[1] - 1 - Yloop *1, addedxcubes.to[2]],
                            faces: {
                                south: {
                                    uv: [addedxcubes.faces.south.uv[0], addedxcubes.faces.south.uv[1] + 1 + Yloop * 1, addedxcubes.faces.south.uv[2], addedxcubes.faces.south.uv[3] + 1 + Yloop * 1],
                                    texture: imgtexture,
                                },
                                north: {
                                    uv: [addedxcubes.faces.north.uv[0], addedxcubes.faces.north.uv[1] + 1 + Yloop * 1, addedxcubes.faces.north.uv[2], addedxcubes.faces.north.uv[3] + 1 + Yloop * 1],
                                    texture: imgtexture,
                                },
                                east: {
                                    uv: [addedxcubes.faces.east.uv[0], addedxcubes.faces.east.uv[1] + 1 + Yloop * 1, addedxcubes.faces.east.uv[2], addedxcubes.faces.east.uv[3] + 1 + Yloop * 1],
                                    texture: imgtexture,
                                },
                                west: {
                                    uv: [addedxcubes.faces.west.uv[0], addedxcubes.faces.west.uv[1] + 1 + Yloop * 1, addedxcubes.faces.west.uv[2], addedxcubes.faces.west.uv[3] + 1 + Yloop * 1],
                                    texture: imgtexture,
                                },
                                down: {
                                    uv: [addedxcubes.faces.down.uv[0], addedxcubes.faces.down.uv[1] + 1 + Yloop * 1, addedxcubes.faces.down.uv[2], addedxcubes.faces.down.uv[3] + 1 + Yloop * 1],
                                    texture: imgtexture,
                                },
                                up: {
                                    uv: [addedxcubes.faces.up.uv[0], addedxcubes.faces.up.uv[1] + 1 + Yloop * 1, addedxcubes.faces.up.uv[2], addedxcubes.faces.up.uv[3] + 1 + Yloop * 1],
                                    texture: imgtexture,
                                }
                            }
                        }).addTo(imggroup).init();
                        added_elements.push(cubeY);
                        AlphaCube_.push(cubeY);
                    }
    
                }

                //very cool "math"
                var canvas = document.createElement("canvas");
		        canvas.width = imgWidth;
		        canvas.height= imgHeight;
		        var context = canvas.getContext("2d");
                context.drawImage(img, 0, 0)

                AlphaCube_.forEach(cube => {
                    var pixelData = context.getImageData(cube.faces.south.uv[0], cube.faces.south.uv[1], cube.faces.south.uv[2], cube.faces.south.uv[3])
                    var data = pixelData.data;
                    if (data[3] == 0) {
                        cube.remove();
                    } else {
                        added_elements_.push(cube);
                    }
                })
            })



            Undo.finishEdit('Imported Image Model', {elements: added_elements_, textures: added_textures,outliner: true, selection: true, uv_mode: true});
            }
        })
    }
