(() => {
    let codec, export_action_minimized, export_action_maximized, import_action, dialog, originalJavaBlockCond, lastOccuranceOfSequenceInArray
    const id = "cosmic_reach_model_editor"
    const name = "Cosmic Reach Model Editor"
    const icon = "icon.png"
    const icon64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAATxJREFUWIXtV6EOwjAQvREUAYFCowlBIkhm2LegMXwFho/gM8DMTS/T0ygEBDvE8pL1saNlWdIKnlmvaa+9d+/WNlqtd5WIyHgSSxPTUSJ94v66GPbzkYqIyKDXVTog2iTnqtnBkS/mM8OOl98dprlpF+XNsJkJ7wwM0UDkiBiRrrftE48n0z7s28dn19ofmCnKeh0w4Z8BqBEM2CIHbFoA2E9RirGefwbQQO55x8i1LeLsatrIOWsjzet1UB3hMKDBVRNdEQ4DrqrWNME514B5qIZwGABsqv9VE6gOMMR+vTPw38CHBljF2h+OgX7WBmx82V84DGgRMLQ6d60KZjAcBjRoOXedZ2MmHAZwPuMOh51rOWc1a+rn8XxL9s8Av4g451oOXcfxWQAEcyv+v4wi7XWM90Jf0Px7Z+ANxOF3G0qPE9EAAAAASUVORK5CYII="
    Plugin.register(id, {
      title: name,
      icon: "icon.png",
      author: "Z. Hoeshin",
      description: "Allows creating, editing, importing and exporting Cosmic Reach block models.",
      tags: ["Cosmic Reach"],
      version: "1.2.0",
      min_version: "4.8.0",
      creation_date: "2024-04-19",
      variant: "both",
      new_repository_format: true,
      has_changelog: true,
      onload() {
	originalJavaBlockCond = Codecs.java_block.load_filter.condition
        Codecs.java_block.load_filter.condition = (model) => {
			return !model.cuboids && originalJavaBlockCond(model);
		}

        dialog = new Dialog("cosmic_reach_model_errormessage", {
            id: "cosmic_reach_model_dialog_error",
            title: "Something went wrong...",
            buttons: [],
            lines: [],
        })

        codec = new Codec("cosmic_reach_block_model_codec", {
            name: "Cosmic Reach",
            extension: "json",
            remember: false,
            load_filter: {type: "json", extensions: ["json"],
              condition: (model) => {
                  return model.cuboids || model.textures;
              }
            },
            format: new ModelFormat("cosmic_reach_model", {
                id: "cosmic_reach_model",
                icon: icon64,
                name: "Cosmic Reach Model",
                description: "Model format used by the game Cosmic Reach",
                show_on_start_screen: true,
                target: ["json"],
    
                vertex_color_ambient_occlusion: true,
                /*rotate_cubes: true,
                rotation_limit: true,
                rotation_snap: true,*/
                uv_rotation: true,
                java_face_properties: true,
                
                edit_mode: true,
    
                new() {
                    newProject(this)
                    Project.texture_width = 16
                    Project.texture_height = 16
                }
            }),
            async export(options = {}) {
                if (Object.keys(this.export_options).length) {
                    let result = await this.promptExportOptions();
                    if (result === null) return;
                }
                Blockbench.export({
                    resource_id: 'model',
                    type: this.name,
                    extensions: [this.extension],
                    name: this.fileName(),
                    startpath: this.startPath(),
                    content: this.compile(options),
                    custom_writer: isApp ? (a, b) => this.write(a, b) : null,
                }, path => this.afterDownload(path))
            },
            compile(options={maximize: false}){
                let facenamesbb = ["up", "down", "north", "south", "east", "west"]
                let facenamescr = ["localPosY", "localNegY", "localNegZ", "localPosZ", "localPosX", "localNegX"]
            
                cuboids = []
                texturesUsed = []
                texturesFilesUsed = []
                textures = {}

                function compileCube(obj){
                    let uvs = {}
                    for(let f of Object.keys(obj.faces)){
                        let uv = obj.faces[f].uv

                        let texture = Texture.all.filter((x) => {return x.uuid == obj.faces[f].texture})[0]
                        texture = (texture === undefined) ? "empty.png" : texture.name

                        let face = obj.faces[f]

                        uvs[f] = [uv[0], uv[1], uv[2], uv[3], face, texture]

                        texturesUsed.push(texture)
                    }
                    
                    let cube = {
                        "localBounds": [...obj.from, ...obj.to],
                        "faces":
                        {
                            "localNegX": {"uv": uvs.west.slice(0, 4), "ambientocclusion": uvs.west[4].tint === 0,
                            "cullFace": uvs.west[4].cullFace !== "", "texture": uvs.west[5]},
                            "localPosX": {"uv": uvs.east.slice(0, 4), "ambientocclusion":  uvs.east[4].tint === 0,
                            "cullFace": uvs.east[4].cullFace !== "", "texture": uvs.east[5]},

                            "localNegY": {"uv": uvs.down.slice(0, 4), "ambientocclusion":  uvs.down[4].tint === 0,
                            "cullFace": uvs.down[4].cullFace !== "", "texture": uvs.down[5]},
                            "localPosY": {"uv": uvs.up.slice(0, 4), "ambientocclusion":  uvs.up[4].tint === 0,
                            "cullFace": uvs.up[4].cullFace !== "", "texture": uvs.up[5]},

                            "localNegZ": {"uv": uvs.north.slice(0, 4), "ambientocclusion":  uvs.north[4].tint === 0,
                            "cullFace": uvs.north[4].cullFace !== "", "texture": uvs.north[5]},
                            "localPosZ": {"uv": uvs.south.slice(0, 4), "ambientocclusion":  uvs.south[4].tint === 0,
                            "cullFace": uvs.south[4].cullFace !== "", "texture": uvs.south[5]}
                        }
                    }
                    
                    for(let f = 0; f < 6; f++){
                        if(uvs[facenamesbb[f]][4].rotation > 0){
                            cube.faces[facenamescr[f]].uvRotation = uvs[facenamesbb[f]][4].rotation
                        }
                    }

                    cuboids.push(cube)
                }
                function compileGroup(group){
                    group.children.forEach(obj => {
					if (obj instanceof Group) {
						compileGroup(obj);
					} else if (obj instanceof Cube) {
						compileCube(obj)
					}
				})
                }

                Outliner.root.forEach(obj => {
					if (obj instanceof Group) {
						compileGroup(obj);
					} else if (obj instanceof Cube) {
						compileCube(obj)
					}
				})

                for(let i = 0; i < texturesUsed.length; i++){
                    if(texturesUsed[i] == null){
                        continue
                    }
                    const name = texturesUsed[i]
                    textures[name] = { "fileName": name }
                }

                if(options.parent !== undefined){
                    return JSON.stringify({"textures": textures, "parent": options.parent}, undefined, 4)
                }
                return JSON.stringify({"textures": textures, "cuboids": cuboids}, undefined, options.maximize ? 4 : undefined)
            },

            parse(rawJSONstring, path, cuboidsOnly = false){
                let loadedTextures = {}

                let patharr = path.split(/[\\\/]/g)
                patharr = patharr.slice(0, patharr.length - 1)

                let root = lastOccuranceOfSequenceInArray(patharr, ["models", "blocks"])

                let facenamesbb = ["up", "down", "north", "south", "east", "west"]
                let facenamescr = ["localPosY", "localNegY", "localNegZ", "localPosZ", "localPosX", "localNegX"]

                let allTexturesSpecified = false

                let data
                if(typeof rawJSONstring === 'string'){
                    data = JSON.parse(rawJSONstring)
                }else if(rawJSONstring instanceof Object && !(rawJSONstring instanceof Array)){
                    data = rawJSONstring
                }else{
                    throw "Unable to convert file data to Object"
                }

                if(cuboidsOnly){
                    if(data.cuboids === undefined){
                        if(data.parent === undefined){
                            return []
                        }else{
                            let p = data.parent
                            Blockbench.read([...patharr.slice(undefined, root - 1), "models", "blocks", p + (/\.json$/gui.test(p) ? "" : ".json")].join("/"), {
                                extensions: ['json'],
                                type: 'Cosmic Reach Model',
                                readtype: 'text',
                                resource_id: 'json'
                            }, files => {
                                try{
                                    let cuboids = codec.parse(files[0].content, files[0].path, true);
                                    if(data.cuboids === undefined){
                                        data.cuboids = []
                                    }
                                    if(cuboids !== undefined){
                                        for(let c of cuboids){
                                            data.cuboids.push(c)
                                        }
                                    }
                                    return data.cuboids
                                }catch(error){
                                    return []
                                }
                            })
                        }
                    }
                    return data.cuboids
                }

                if(data.textures === undefined){
                    data.textures = {}
                }

                for(let t of Object.keys(data.textures)){
                    let newtexture = new Texture().fromPath([...patharr.slice(undefined, root - 1), "textures", "blocks", data.textures[t].fileName].join("/"))
                    newtexture.name = data.textures[t].fileName
                    loadedTextures[t] = newtexture.add()
                }
                
                if(Texture.all.length > 0) {
                    setTimeout(() => {
                        Project.texture_width = Texture.all[0].width
                        Project.texture_height = Texture.all[0].height
                    }, 50);
                }

                if(data.cuboids === undefined){
                    if(data.parent === undefined){
                        throw Error(`No cuboids found in file ${path}`)
                    }else{
                        let p = data.parent
                        Blockbench.read([...patharr.slice(undefined, root - 1), "models", "blocks", p + (/\.json$/gui.test(p) ? "" : ".json")].join("/"), {
                            extensions: ['json'],
                            type: 'Cosmic Reach Model',
                            readtype: 'text',
                            resource_id: 'json'
                        }, files => {
                            try{
                                let cuboids = codec.parse(files[0].content, files[0].path, true);
                                if(data.cuboids === undefined){
                                    data.cuboids = []
                                }
                                if(cuboids !== undefined){
                                    for(let c of cuboids){
                                        data.cuboids.push(c)
                                    }
                                }
                                dialog.lines = `<div>
                                    <h1>Model is a child of '${p}'.</h1>
                                    <p>Loaded parent with textures from the model file</p>
                                </div>`.split("\n")
                                dialog.show()
                            }catch(error){
                                dialog.lines = `<div>
                                    <h1>Unable to import parent of the model.</h1>
                                    <p>${error}</p>
                                </div>`.split("\n")
                                dialog.show()
                            }
                        })
                    }
                }

                if(data.textures["all"] != undefined){
                    allTexturesSpecified = true
                }

                function getFaceUV(cuboid, face, uv){
                    return cuboid.faces[face].uv[uv]
                }

                function setUVforFace(cube, cuboid, facenamebb, facenamecr){
                    texture = allTexturesSpecified ? data.textures["all"] : data.textures[cuboid.faces[facenamecr].texture]
                    cube.faces[facenamebb].uv =[getFaceUV(cuboid, facenamecr, 0),
                                                getFaceUV(cuboid, facenamecr, 1),
                                                getFaceUV(cuboid, facenamecr, 2),
                                                getFaceUV(cuboid, facenamecr, 3)]
                    cube.faces[facenamebb].texture = Texture.all.filter((x) => {return x.name == texture.fileName})[0]
                }

                for(let cuboid of data.cuboids){
                    let from = cuboid.localBounds.slice(0, 3)
                    let to = cuboid.localBounds.slice(3, 6)

                    let cube = new Cube({from: from, to: to})
                    for(let i = 0; i < 6; i++){
                        try{
                            let texture = loadedTextures[allTexturesSpecified ? "all" : cuboid.faces[facenamescr[i]].texture]
                            setUVforFace(cube, cuboid, facenamesbb[i], facenamescr[i])
                            cube.faces[facenamesbb[i]].texture = texture
                        }catch(error){
                            console.error(error)
                        }
                        cube.faces[facenamesbb[i]].cullface = cuboid.faces[facenamescr[i]].cullFace ? facenamesbb[i] : ""
                        cube.faces[facenamesbb[i]].tint = cuboid.faces[facenamescr[i]].ambientocclusion ? 0 : -1
                    }
                    cube.addTo(Group.all.last()).init()
                }
                
                setTimeout(() => {
                    Canvas.updateAll()
                }, 50);

                return true;
            }
        })

        
        import_action = new Action('import_cosmic_reach_model', {
            name: 'Import Cosmic Reach Model',
            description: '',
            icon: icon64,
            category: 'file',
            click() {
                Blockbench.import({
                    extensions: ['json'],
                    type: 'Cosmic Reach Model',
                    readtype: 'text',
                    resource_id: 'json'
                }, files => {
                    try{
                        codec.parse(files[0].content, files[0].path);
                        Canvas.updateAll()
                    }catch(error){
                        dialog.lines = `<div>
                            <h1>Unable to import file.</h1>
                            <p>${error}</p>
                        </div>`.split("\n")
                        dialog.show()
                    }
                })
            }
        })

        export_action_minimized = new Action('export_cosmic_reach_model_minimized', {
                    name: 'Export Cosmic Reach Model (minimized)',
                    description: '',
                    icon: icon64,
                    category: 'file',
                    click() {
                        try{
                            codec.export({maximize: false, parent: undefined});
                        }catch(error){
                            dialog.lines = `<div>
                                <h1>Unable to export file.</h1>
                                <p>${error}</p>
                            </div>`.split("\n")
                            dialog.show()
                        }
                    }
                })
        export_action_maximized = new Action('export_cosmic_reach_model_maximized', {
                    name: 'Export Cosmic Reach Model (maximized)',
                    description: '',
                    icon: icon64,
                    category: 'file',
                    click() {
                        try{
                            codec.export({maximize: true, parent: undefined});
                        }catch(error){
                            dialog.lines = `<div>
                                <h1>Unable to export file.</h1>
                                <p>${error}</p>
                            </div>`.split("\n")
                            dialog.show()
                        }
                    }
                })
        export_action_aschild = new Action('export_cosmic_reach_model_aschild', {
            name: 'Export Cosmic Reach Model (Child)',
            description: '',
            icon: icon64,
            category: 'file',
            click() {
                try{
                    new Dialog("cosmic_reach_model_exportaschildmodeldialog", {
                        id: "cosmic_reach_model_dialog_aschild",
                        title: "Export model as a child",
                        form: {
                            name: {
                                label: "Parent name",
                                value: Project._name
                            }
                        },
                        onConfirm: result => {
                            codec.export({maximize: true, parent: result.name});
                        }
                    }).show()
                }catch(error){
                    dialog.lines = `<div>
                        <h1>Unable to export file.</h1>
                        <p>${error}</p>
                    </div>`.split("\n")
                    dialog.show()
                }
            }
        })

        MenuBar.addAction(import_action, 'file.import')
        MenuBar.addAction(export_action_minimized, 'file.export')
        MenuBar.addAction(export_action_maximized, 'file.export')
        MenuBar.addAction(export_action_aschild, 'file.export')


        lastOccuranceOfSequenceInArray = (array, sequence) => {
            let count = 0
            
            for(let i = array.length - 1; i >= 0; i--) {
                if(array[i] === sequence[sequence.length - count - 1]){
                    count ++
                    if(count === sequence.length - 1){
                        return i
                    }
                }
            }
            return -1
        }
      },
      onunload() {
		import_action.delete();
		export_action_maximized.delete();
		export_action_minimized.delete();
		export_action_aschild.delete();
        Codecs.java_block.load_filter.condition = originalJavaBlockCond
      }
    })
  })()
