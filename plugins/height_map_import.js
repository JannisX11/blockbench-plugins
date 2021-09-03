
(function() {
    Plugin.register('height_map_import', {
        title: 'Height Map Importer',
        icon: 'line_weight',
        author: 'Malik12tree',
        description: 'Imports Height Maps.',
        min_version: '3.0.0', 
        variant: 'both',
        onload() {
            HMIaction = new Action("import_height_map", {
                name: "Import Height Map",
                description: "choose height map file",
                icon: "line_weight",
                click: function(){
                    if (!Project.box_uv) {
                        let canvas = document.createElement('canvas');
                        let ctx = canvas.getContext('2d');
                        hmImport(canvas, ctx);
                    } else{
                        Blockbench.showMessageBox({
                            title: 'UnSupported UV-Mode',
                            icon: 'error',
                            message: 'This Plugin only supports **Per-face Uv**  UV Mode.',
                        });
                    }

                }
            })
            MenuBar.addAction(HMIaction, "file.import");
        },
        onunload() {
            HMIaction.delete();
        }
    });
})()


function hmImport(canvas, ctx) {
    Blockbench.import({
        extensions: ['png'],
        type: 'PNG Image File',
        readtype: 'binary',
    }, (file) => {
        let imgPath = file[0].path
        let imgName = file[0].name

        var img = new Image();
        img.src = imgPath
        const axis_options = {
            x: "X",
            y: "Y",
            z: "Z"
        }
        img.onload = function () {
            let imgWidth = img.width
            let imgHeight = img.height
            let k = 0;
            canvas.width = imgWidth;
            canvas.height = imgHeight;
            // alert(imgPath + "----" + imgName);
            
            let pixels = [
                v = [],
                a = []
            ]
            
            var hmDialog = new Dialog({
                id: 'hmD',
                title: 'Height Map Settings',
                lines: [
                    'Note: RGB/RGBA images will automatically get gray-scaled.' +
                    '<p>Strength:'+
                    ' <input type="range" id="strength_range"value="255" min="0" max="255" oninput="$(\'label#strength_value\').text(\' \'+parseInt($(\'input#strength_range\').val()))" style="top: 10px; position:relative;">' +
                    '<label id="strength_value"> 255 </label>' +
                    '<p/>'
                ],
                form:{
                    black_alpha: {label: "Remove Black Areas?", type: "checkbox", value: 1},
                    facing: {label: "Axis", type:"select", options:axis_options}
                },
                onConfirm(out){
                    var strength = $('input#strength_range').val().valueOf();
                    var black_alpha = out.black_alpha
                    let ba = -1;
                    if (black_alpha === true) {
                        ba = 0
                    } else {
                        ba = -1
                    }
                    var facing = out.facing

                    
                    ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
                    var pxData = ctx.getImageData(0, 0, imgWidth, imgHeight);
                    var data = pxData.data;
                    // console.log(data)
                    
                    for (let i = 0; i < data.length; i+=4) {
                        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                        // console.log(avg)
                        pixels[0].push(avg); // value and greyscale incase of color
                        pixels[1].push(data[i + 3]); //alpha
                    }
                    // console.log(pixels)

                    let added_cubes = [];
                    var hmGroup = new Group('Height Map').init();
                    var hmTexture = new Texture().fromPath((imgPath)).add()
                    Undo.initEdit({outliner: true, elements: [], textures: [] , bitmap: true, selection: true, group: hmGroup});

                    for (let w = 0; w < imgWidth; w++) {
                        for (let h = 0; h < imgHeight; h++) {
                            k++
                            //black_alpha === true && pixels[0][k] === 0||
                            if (pixels[1][k] === 255 &&pixels[0][k] > ba) {
                                var pxcube = new Cube({
                                name: `Height Cube`,
                                origin: [-(imgWidth / (imgWidth / 2)), imgHeight/ 2, 0],
                                from:[-10 + w, 0 + h, 0 ],
                                to:[-9 + w, 1 + h, pixels[0][k] * (strength / 10000)],
                                color: (pixels[0][k] * (strength / 10000)).toFixed(),
                                rotation: [0,90,0],
                                faces: {
                                    north: {
                                        uv:  [0 + w, 1+ h, 1 + w, 2 + h],
                                        texture: hmTexture,
                                    },
                                    south: {
                                        uv: [0 + w, 1+ h, 1 + w, 2 + h],
                                        texture: hmTexture,
                                    },
                                    west: {
                                        uv: [0 + w, 1+ h, 1 + w, 2 + h],
                                        texture: hmTexture,
                                    },
                                    east: {
                                        uv: [0 + w, 1+ h, 1 + w, 2 + h],
                                        texture: hmTexture,
                                    },
                                    up: {
                                        uv: [0 + w, 1+ h, 1 + w, 2 + h],
                                        texture: hmTexture,
                                    },
                                    down: {
                                        uv: [0 + w, 1+ h, 1 + w, 2 + h],
                                        texture: hmTexture,
                                    }
                                }
                                })
                                if (facing === 'y') {
                                    pxcube.rotation = [-90,0,0]
                                }
                                if (facing === 'z') {
                                    pxcube.rotation = [0,0,0]
                                }
                                pxcube.addTo(hmGroup).init()
                                added_cubes.push(pxcube)                     
                            }   
                        }                                
                    }
                    Undo.finishEdit('Imported Height Map', {outliner: true, elements: added_cubes, textures: [hmTexture] , bitmap: true, selection: true, group: hmGroup});
                }
            }).show()

    }
})
}
