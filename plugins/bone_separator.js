(function() {
    Plugin.register('bone_separator', {
        title: 'Bone Separator Export',
        icon: 'fa-bone',
        author: 'Malik12tree',
        description: 'Exports bones separately and puts them in a resource pack automatically(useful for datapack-ers with animating)',
        min_version: '3.0.0',
        variant: "desktop",
        tags:["Minecraft: Java Edition"],
        onload() {
            SBaction = new Action("export_bones", {
                name: "Export Bones",
                description: "export bones...",
                icon: "fa-bone",
                condition: () => Format.id === "java_block",
                click: function(){
                    BSDialog = new Dialog({
                        title: 'Bone Separator Export',
                        id: 'BSdial',
                        resizable: true,
                        width: 50,
                        form:{
                            BSPackName : {label: "Pack Name", type: "text", value: "MyPack"},
                            BSPackDisc : {label: "Pack Description", type: "text", value: "MyDescription"},
                            BSPath : {label: "Path", type: "text", value: "custom/bones"},
                        },
                        onConfirm(out){
                            let p = 0;
                            for (let t = 0; t < Group.all.length; t++) {
                                for (let q = 0; q < Group.all[t].children.length; q++) {
                                    if (!Group.all[t].children[q].isParent) {
                                        p++
                                    }
                                }
                            }
                            if (p === Cube.all.length) {
                                BSdialConfirm(out);
                            } else{
                                Blockbench.showMessageBox({
                                    title: "Warning!",
                                    icon: "warning",
                                    message: `${Cube.all.length - p} Cube(s) aren't in a bone! They can't be exported. Do you wish to continue?`,
                                    buttons: ["dialog.continue", "dialog.cancel"],
                                    confirm: 0,
                                    cancel: 1,
                                }, function (btn) {
                                    if (btn === 0) {
                                        BSdialConfirm(out);
                                    }
                                });
                            }
                        }
                    }).show();

                }
            })
            MenuBar.addAction(SBaction, "file.export");
        },
        onunload() {
            SBaction.delete();
        }
    });
})()

function BSdialConfirm(out) {
    saveTextures();
    var BSzipRP = new JSZip();
    // let packDisc = {
    //     "pack": {
    //       "pack_format": 7,
    //       "description": "Tutorial Resource Pack"
    //     }
    //   }
    var packMeta = BSzipRP.file("pack.mcmeta", `{\n  "pack": {\n    "pack_format": 7,\n    "description": "${out.BSPackDisc}"\n}`);
    ExportBS(BSzipRP, out.BSPath);

    if (isApp) {
        BSzipRP.generateAsync({type: 'blob'}).then(content => {
            Blockbench.export({
                type: 'Zip/Zip Archive',
                extensions: ['zip'],
                name: out.BSPackName,
                content: content,
                savetype: 'zip'
            });
        });
    } else{
        BSzipRP.generateAsync({type: 'blob'}).then(contentWeb => {
            saveAs(out.BSPackName, contentWeb)
        });
    }
}

function ExportBS(zip, packPath) {
    //if one line
    let BSlineType = 0;
    if (settings.minifiedout.value === false) {
        BSlineType = 2
    } else{
        BSlineType = 0
    }
    let codecJsonBS = JSON.parse(Format.codec.compile());
    if (codecJsonBS["textures"]) {
        // console.log("texture")
        for (let f = 0; f < textures.length; f++) {
            var BStextures = zip.file(["assets/minecraft/textures/" + textures[f].folder + "/" + textures[f].name], textures[f].getBase64(), {base64: true});
        }
    }

    for (let i = 0; i < Group.all.length; i++) {
        //reset
        codecJsonBS["elements"] = [];
        codecJsonBS["groups"] = [];
        let BSchild = [];
        let k = 0;
        let g = 0;
        //
        for (let c = 0; c < Group.all[i].children.length; c++) {
            k++
            if (!Group.all[i].children[c].isParent) {
                BSchild.push(c)
                codecJsonBS["groups"].push({
                    "name" : Group.all[i].name,
                    "origin": [Group.all[i].origin[0], Group.all[i].origin[1], Group.all[i].origin[2]],
                    "color": Group.all[i].color,
                    "children" : BSchild,
                });
                //fix group duplication
                if (k == (Group.all[i].children.length - g) - 1) {
                    codecJsonBS["groups"] = [codecJsonBS["groups"][0]]
                }

                let thisElement = Group.all[i].children[c];
                //Group.all[0].children[0];
                let northTex = thisElement.faces.north.getTexture();
                let southTex = thisElement.faces.south.getTexture();
                let westTex = thisElement.faces.west.getTexture();
                let eastTex = thisElement.faces.east.getTexture();
                let upTex = thisElement.faces.up.getTexture();
                let downTex = thisElement.faces.down.getTexture();
                let Tex_id = [northTex.id, southTex.id, westTex.id, eastTex.id, upTex.id, downTex.id]
                if (Tex_id[0] === undefined) {
                    Tex_id[0] = "missing"
                }
                if (Tex_id[1] === undefined) {
                    Tex_id[1] = "missing"
                }
                if (Tex_id[2] === undefined) {
                    Tex_id[2] = "missing"
                }
                if (Tex_id[3] === undefined) {
                    Tex_id[3] = "missing"
                }
                if (Tex_id[4] === undefined) {
                    Tex_id[4] = "missing"
                }
                if (Tex_id[5] === undefined) {
                    Tex_id[5] = "missing"
                }

                // rotation //22.5 || - 22.5 || 45|| -45
                let axisBS = "";
                let rBS = 0;
                if (thisElement.rotation[0] == 22.5||thisElement.rotation[0] == -22.5||thisElement.rotation[0] == 45||thisElement.rotation[0] == -45) {
                    axisBS = "x";
                    rBS = 0;
                } else if (thisElement.rotation[1] == 22.5||thisElement.rotation[1] == -22.5||thisElement.rotation[1] == 45||thisElement.rotation[1] == -45) {
                    axisBS = "y";
                    rBS = 1;
                } else if (thisElement.rotation[2] == 22.5||thisElement.rotation[2] == -22.5||thisElement.rotation[2] == 45||thisElement.rotation[2] == -45) {
                    axisBS = "z";
                    rBS = 2;
                } else {
                    axisBS = "y";
                    rBS = 1;
                }
                //

                codecJsonBS["elements"].push({
                    "from": thisElement.from,
                    "to": thisElement.to,
                    "rotation": {"angle": thisElement.rotation[rBS], "axis": axisBS, "origin":thisElement.origin},
                    "color" : thisElement.color,
                    "faces":{
                        "north": {"texture": "#" + Tex_id[0], "uv": thisElement.faces.north.uv, "rotation": thisElement.faces.north.rotation, "cullface": thisElement.faces.north.cullface, "rotation": thisElement.faces.north.tintindex},
                        "south": {"texture": "#" + Tex_id[1], "uv": thisElement.faces.south.uv, "rotation": thisElement.faces.south.rotation, "cullface": thisElement.faces.south.cullface, "tintindex": thisElement.faces.south.tintindex},
                        "west": {"texture": "#" + Tex_id[2], "uv": thisElement.faces.west.uv, "rotation": thisElement.faces.west.rotation, "cullface": thisElement.faces.west.cullface, "tintindex": thisElement.faces.west.tintindex},
                        "east": {"texture": "#" + Tex_id[3], "uv": thisElement.faces.east.uv, "rotation": thisElement.faces.east.rotation, "cullface": thisElement.faces.east.cullface, "tintindex": thisElement.faces.east.tintindex},
                        "up": {"texture": "#" + Tex_id[4], "uv": thisElement.faces.up.uv, "rotation": thisElement.faces.up.rotation, "cullface": thisElement.faces.up.cullface, "tintindex": thisElement.faces.up.tintindex},
                        "down": {"texture": "#" + Tex_id[5], "uv": thisElement.faces.down.uv, "rotation": thisElement.faces.down.rotation, "cullface": thisElement.faces.down.cullface, "tintindex": thisElement.faces.down.tintindex}
                    }
                });
            } else{
                g++
            }
        }
        let codecStringBS = JSON.stringify(codecJsonBS, null, BSlineType);
        // console.log(codecStringBS)
        var boneFile = zip.file([`assets/minecraft/models/${packPath}/bone_${Group.all[i].name}${i}.json`], codecStringBS);
    }
}
