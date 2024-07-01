(() => {
    let codec, export_action_block_minimized, export_action_block_maximized, import_action_block, dialog, originalJavaBlockCond, lastOccuranceOfSequenceInArray
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
      version: "1.3.0",
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
            compile(){
                let replacePostProcess = []

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

                    replacePostProcess.push(
                        cube.localBounds, 
                        cube.faces.localNegX,
                        cube.faces.localPosX,
                        cube.faces.localNegY,
                        cube.faces.localPosY,
                        cube.faces.localNegZ,
                        cube.faces.localPosZ,
                    )
                    
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

                //JSON.stringify({"textures": textures, "cuboids": cuboids}, undefined, options.maximize ? 4 : undefined)

                

                  return stringifyJSON({"textures": textures, "cuboids": cuboids})
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

        codec_animation = new Codec("cosmic_reach_entity_animation_codec", {
            name: "Cosmic Reach Entity Animation",
            extension: "json",
            load_filter: {type: "json", extensions: ["json"]},
            parse(rawJSONstring, path){
                let contents
                if(typeof rawJSONstring === 'string'){
                    contents = JSON.parse(rawJSONstring)
                }else if(rawJSONstring instanceof Object && !(rawJSONstring instanceof Array)){
                    contents = rawJSONstring
                }else{
                    throw "Unable to convert file data to Object"
                }

                let bones = []
                function compileGroup(obj){
                    bones[obj.name] = {
                        self: obj,
                        parent: null
                    }
                    for(let child of obj.children){
                        if(child instanceof Group){
                            compileGroup(child)
                        }
                    }
                }
                Outliner.root.forEach(obj => {
					if (obj instanceof Group) {
						compileGroup(obj);
					} else if (obj instanceof Cube) {
						//compileCube(obj)
					}
				})

                
                for(let animation_name of Object.keys(contents.animations)){
                    let animation = contents.animations[animation_name]
                    let animationobj = new Animation({
                        name: animation_name,
                        loop: animation.loop ? "loop" : "once",
                        length: animation.animation_length
                    })
                    for(let bone_name of Object.keys(animation.bones)){
                        let bone = animation.bones[bone_name]
                        let animator = animationobj.getBoneAnimator(bones[bone_name].self)
                        for(let channel_name of Object.keys(bone)){
                            let channel = bone[channel_name]
                            if(channel instanceof Array){
                                animator.addKeyframe({time: 0, channel: channel_name, data_points: [
                                    vectorFromArrayToObject(channel, true)
                                ]})
                            }else if(channel instanceof Object){
                                for(let timekey of Object.keys(channel)){
                                    let time = Number(timekey)
                                    let keyframedata = channel[timekey]
                                    
                                    if(Array.isArray(keyframedata)){
                                        animator.addKeyframe({time: time, channel: channel_name, interpolation: "linear", data_points: [
                                            vectorFromArrayToObject(keyframedata, true)
                                        ]})
                                    }else if(keyframedata instanceof Object){
                                        
                                        if(keyframedata.pre){
                                            animator.addKeyframe({time: time, channel: channel_name, interpolation: "bezier", data_points: [
                                                vectorFromArrayToObject(keyframedata.pre, true)
                                            ]})
                                        }
                                        if(keyframedata.post){
                                            animator.addKeyframe({time: time, channel: channel_name, interpolation: "bezier", data_points: [
                                                vectorFromArrayToObject(keyframedata.post, true)
                                            ]})
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    animationobj.add()
                }

            },

            compile(){
                let animations = {}
                for(let anim of Project.animations){
                    let animation = {
                        loop: anim.loop === "loop",
                        animation_length: anim.length
                    }
                    let bones = {}
                    for(let animatorEntry of Object.entries(anim.animators)){
                        let animator = animatorEntry[1]
                        let bone = {}
                        if(animator.position.length == 1){
                            if(animator.position[0].data_points.length == 1){
                                if(animator.position[0].time == 0){
                                    let data_point = animator.position[0].data_points[0]
                                    bone.position = [data_point.x, data_point.y, data_point.z].map((n) => Number(n))
                                }
                            }
                        }else if(animator.position.length > 0){
                            bone.position = {}
                            for(let keyframe of animator.position){
                                if(!keyframe.data_points.length) continue
                                if(keyframe.interpolation === "bezier"){
                                    bone.position[keyframe.time.toString()] = {
                                        "post": [keyframe.data_points[0].x, keyframe.data_points[0].y, keyframe.data_points[0].z].map((n) => Number(n)),
                                        "lerp_mode": "catmullrom"
                                    }
                                }else{
                                    bone.position[keyframe.time.toString()] = [keyframe.data_points[0].x, keyframe.data_points[0].y, keyframe.data_points[0].z].map((n) => Number(n))
                                }
                            }
                        }
                        if(animator.rotation.length == 1){
                            if(animator.rotation[0].data_points.length == 1){
                                if(animator.rotation[0].time == 0){
                                    let data_point = animator.rotation[0].data_points[0]
                                    bone.rotation = [data_point.x, data_point.y, data_point.z].map((n) => Number(n))
                                }
                            }
                        }else if(animator.rotation.length > 0){
                            bone.rotation = {}
                            for(let keyframe of animator.rotation){
                                if(!keyframe.data_points.length) continue
                                if(keyframe.interpolation === "bezier"){
                                    bone.rotation[keyframe.time.toString()] = {
                                        "post": [keyframe.data_points[0].x, keyframe.data_points[0].y, keyframe.data_points[0].z].map((n) => Number(n)),
                                        "lerp_mode": "catmullrom"
                                    }
                                }else{
                                    bone.rotation[keyframe.time.toString()] = [keyframe.data_points[0].x, keyframe.data_points[0].y, keyframe.data_points[0].z].map((n) => Number(n))
                                }
                            }
                        }
                        if(animator.scale.length == 1){
                            if(animator.scale[0].data_points.length == 1){
                                if(animator.scale[0].time == 0){
                                    let data_point = animator.scale[0].data_points[0]
                                    bone.scale = [data_point.x, data_point.y, data_point.z].map((n) => Number(n))
                                }
                            }
                        }else if(animator.scale.length > 0){
                            bone.scale = {}
                            for(let keyframe of animator.scale){
                                if(!keyframe.data_points.length) continue
                                if(keyframe.interpolation === "bezier"){
                                    bone.scale[keyframe.time.toString()] = {
                                        "post": [keyframe.data_points[0].x, keyframe.data_points[0].y, keyframe.data_points[0].z].map((n) => Number(n)),
                                        "lerp_mode": "catmullrom"
                                    }
                                }else{
                                    bone.scale[keyframe.time.toString()] = [keyframe.data_points[0].x, keyframe.data_points[0].y, keyframe.data_points[0].z].map((n) => Number(n))
                                }
                            }
                        }
                        if(bone.position){
                            bones[animator.group.name] = {position: bone.position}
                        }
                        if(bone.rotation){
                            if(bones[animator.group.name] === undefined){
                                bones[animator.group.name] = {}
                            }
                            if(bones[animator.group.name].rotation === undefined){
                                bones[animator.group.name].rotation = null
                            }
                            bones[animator.group.name].rotation = bone.rotation
                        }
                        if(bone.scale){
                            if(bones[animator.group.name] === undefined){
                                bones[animator.group.name] = {}
                            }
                            if(bones[animator.group.name].scale === undefined){
                                bones[animator.group.name].scale = null
                            }
                            bones[animator.group.name].scale = bone.scale
                        }
                    }
                    animation.bones = bones
                    animations[anim.name] = animation
                }
                return stringifyJSON({animations: animations})
            }
        })
        
        codec_entity = new Codec("cosmic_reach_entity_model_codec", {
            name: "Cosmic Reach Entity",
            extension: "json",
            remember: false,
            load_filter: {type: "json", extensions: ["json"],
            condition: (model) => {
                return model.id && model.texture_width && model.texture_height && model.bones
            }},
            format: new ModelFormat("cosmic_reach_entity_model", {
                id: "cosmic_reach_entity_model",
                icon: icon64,
                name: "Cosmic Reach Entity Model",
                description: "Entiy model format used by the game Cosmic Reach",
                show_on_start_screen: true,
                target: ["json"],
    
                vertex_color_ambient_occlusion: true,
                rotate_cubes: true,
                rotation_limit: false,
                rotation_snap: true,
                uv_rotation: false,
                box_uv: true,
                java_face_properties: true,
                centered_grid: true,
                edit_mode: true,
                rotate_cubes: true,
                box_uv: true,
                single_texture: true,
                bone_rig: true,
                centered_grid: true,
                animated_textures: true,
                animation_files: true,
                animation_mode: true,
                animation_controllers: true,
                bone_binding_expression: true,
                locators: true,
    
                new() {
                    newProject(this)
                }
            }),
            compile(){
                let bones = []
                
                function compileCube(obj){
                    let cube = {
                        origin: obj.from,
                        size: [obj.to[0] - obj.from[0], obj.to[1] - obj.from[1], obj.to[2] - obj.from[2]],
                        uv: obj.uv_offset
                    }
                    if(!vectorIsEqualToVector(obj.origin, [0, 0, 0])){
                        cube.pivot = obj.origin
                    }
                    if(!vectorIsEqualToVector(obj.rotation, [0, 0, 0])){
                        cube.rotation = obj.rotation
                    }
                    if(obj.inflate != 0){
                        cube.inflate = obj.inflate
                    }
                    return cube
                }
                function compileGroup(obj){
                    /*group.children.forEach(obj => {
                        if (obj instanceof Group) {
                            compileGroup(obj);
                            } else if (obj instanceof Cube) {
                                compileCube(obj)
                                }
                                })*/
                    let newBone = {
                        name: obj.name,
                        pivot: obj.origin
                    }
                    if((obj.rotation[0] !== 0)||(obj.rotation[1] !== 0)||(obj.rotation[2] !== 0)){
                        newBone.rotation = obj.rotation
                    }

                    if(obj.parent != "root"){
                        newBone.parent = obj.parent.name
                    }
                    for(let child of obj.children){
                        if(child instanceof Group){
                            compileGroup(child)
                        }else if(child instanceof Cube){
                            if(newBone.cubes === undefined){
                                newBone.cubes = []
                            }
                            newBone.cubes.push(compileCube(child))
                        }
                    }
                    bones.push(newBone)
                }

                Outliner.root.forEach(obj => {
					if (obj instanceof Group) {
						compileGroup(obj);
					} else if (obj instanceof Cube) {
						//compileCube(obj)
					}
				})

                //
                return stringifyJSON({id: name, texture_width: Project.texture_width, texture_height: Project.texture_height, bones: bones})
            },

            parse(rawJSONstring, path, cuboidsOnly = false){
                let data
                if(typeof rawJSONstring === 'string'){
                    data = JSON.parse(rawJSONstring)
                }else if(rawJSONstring instanceof Object && !(rawJSONstring instanceof Array)){
                    data = rawJSONstring
                }else{
                    throw "Unable to convert file data to Object"
                }

                Project.texture_width = data.texture_width || 16
                Project.texture_height = data.texture_height || 16

                Project.name = data.id || ""

                bones = {}
                for(let bone of data.bones){
                    let group = new Group((({ cubes, parent, ...o }) => o)(bone)).init()
                    group.origin = bone.pivot
                    if(bone.cubes){
                        for(let cube of bone.cubes){
                            let newCube = new Cube({
                                uv_offset: cube.uv,
                                from: cube.origin,
                                size: cube.size,
                                rotation: cube.rotation,
                                origin: cube.pivot,
                                inflate: cube.inflate
                            })
                            newCube.addTo(group).init()
                        }
                    }
                    bones[bone.name] = {"self": group, "parent": bone.parent}
                }
                for(let bone of Object.keys(bones)){
                    b = bones[bone]
                    if(b.parent){
                        b.self.addTo(bones[b.parent].self)
                    }else{
                        b.self.addTo("root")
                    }
                }

                let patharr = path.split(/[\\\/]/g)

                
                //patharr = patharr.slice(0, patharr.length - 1)

                //
                
                let root = lastOccuranceOfSequenceInArray(patharr, ["models", "entities"])

                let animpatharr = [...patharr.slice(undefined, root - 1), "animations", ...patharr.slice(root)]
                animpatharr[animpatharr.length - 1] = animpatharr[animpatharr.length - 1].replace(/\.json$/gi, ".animation.json").replace(/^model_/gi, "")
                let animpath = animpatharr.join("/")
                Blockbench.read(animpath, {
                    extensions: ['json'],
                    type: 'Cosmic Reach Entity Model',
                    readtype: 'text',
                    resource_id: 'json'
                }, files => {
                    try{
                        let contents = JSON.parse(files[0].content)
                        codec_animation.parse(contents, animpath)
                    }catch(error){
                        dialog.lines = `<div>
                            <h1>Unable to import animations of the model.</h1>
                            <p>${error}</p>
                        </div>`.split("\n")
                        dialog.show()
                    }
                })

            }
        })
        
        import_action_block = new Action('import_cosmic_reach_model', {
            name: 'Import Cosmic Reach Block Model',
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

        export_action_block = new Action('export_cosmic_reach_model', {
                    name: 'Export Cosmic Reach Block Model',
                    description: '',
                    icon: icon64,
                    category: 'file',
                    /*side_menu: new Menu("export_cosmic_reach_model_sidemenu", [
                        new Action('export_cosmic_reach_model', {
                        name: 'Export minimized',
                        description: '',
                        icon: icon64,
                        category: 'file',
                        structure: [
                            
                        ],
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
                    }),
                    new Action('export_cosmic_reach_model_maximized', {
                        name: 'Export maximized',
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
                    }),
                    
                        
                    ]),*/
                    click() {
                        try{
                            codec.export({maximize: settings.cosmic_reach_maximize_block_models.value, parent: undefined});
                        }catch(error){
                            dialog.lines = `<div>
                                <h1>Unable to export file.</h1>
                                <p>${error}</p>
                            </div>`.split("\n")
                            dialog.show()
                        }
                    }
                })
        //export_action_block_maximized = 
        export_action_block_aschild = new Action('export_cosmic_reach_model_aschild', {
                        name: 'Export Cosmic Reach Block Child Model',
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
                                        codec.export({maximize: settings.cosmic_reach_maximize_block_children_models.value, parent: result.name});
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

        MenuBar.addAction(import_action_block, 'file.import')
        MenuBar.addAction(export_action_block, 'file.export')
        /*MenuBar.addAction(export_action_block_minimized, 'file.export')
        MenuBar.addAction(export_action_block_maximized, 'file.export')*/
        MenuBar.addAction(export_action_block_aschild, 'file.export')

        import_action_entity = new Action('import_cosmic_reach_entity_model', {
            name: 'Import Cosmic Reach Entity Model',
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
                    /*try{*/
                        codec_entity.parse(files[0].content, files[0].path);
                        Canvas.updateAll()
                    /*}catch(error){
                        dialog.lines = `<div>
                            <h1>Unable to import file.</h1>
                            <p>${error}</p>
                        </div>`.split("\n")
                        dialog.show()
                    }*/
                })
            }
        })
        export_action_entity = new Action('export_cosmic_reach_entity_model', {
            name: 'Export Cosmic Reach Entity Model',
            description: '',
            icon: icon64,
            category: 'file',
            /*children: side_menu: new Menu("export_cosmic_reach_entity_model_side_menu",[new Action('export_cosmic_reach_entity_model_minimized', {
                name: 'Export minimized',
                description: '',
                icon: icon64,
                category: 'file',
                side_menu: new Menu("export_cosmic_reach_entity_model_side_menu",[]),
                click() {
                    try{
                        codec_entity.export({maximize: true});
                    }catch(error){
                        dialog.lines = `<div>
                            <h1>Unable to export file.</h1>
                            <p>${error}</p>
                        </div>`.split("\n")
                        dialog.show()
                    }
                }
            }),new Action('export_cosmic_reach_entity_model_maximized', {
                name: 'Export maximized',
                description: '',
                icon: icon64,
                category: 'file',
                side_menu: new Menu("export_cosmic_reach_entity_model_side_menu",[]),
                click() {
                    try{
                        codec_entity.export({maximize: false});
                    }catch(error){
                        dialog.lines = `<div>
                            <h1>Unable to export file.</h1>
                            <p>${error}</p>
                        </div>`.split("\n")
                        dialog.show()
                    }
                }
            }),]),*/
            click() {
                try{
                    codec_entity.export({maximize: settings.cosmic_reach_maximize_entity_models.value});
                }catch(error){
                    dialog.lines = `<div>
                        <h1>Unable to export file.</h1>
                        <p>${error}</p>
                    </div>`.split("\n")
                    dialog.show()
                }
            }
        })

        MenuBar.addAction(import_action_entity, 'file.import')
        MenuBar.addAction(export_action_entity, 'file.export')

        import_action_entity_animation = new Action('import_cosmic_reach_entity_animation', {
            name: 'Import Cosmic Reach Entity Animation',
            description: '',
            icon: icon64,
            category: 'file',
            click() {
                Blockbench.import({
                    extensions: ['json'],
                    type: 'Cosmic Reach Animation',
                    readtype: 'text',
                    resource_id: 'json'
                }, files => {
                    try{
                        codec_animation.parse(files[0].content, files[0].path);
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
        export_action_entity_animation = new Action('export_cosmic_reach_entity_animation', {
            name: 'Export Cosmic Reach Entity Animation',
            description: '',
            icon: icon64,
            category: 'file',
            click() {
                try{
                    codec_animation.export({maximize: settings.cosmic_reach_maximize_entity_animations.value});
                }catch(error){
                    dialog.lines = `<div>
                        <h1>Unable to export file.</h1>
                        <p>${error}</p>
                    </div>`.split("\n")
                    dialog.show()
                }
            }
        })

        
        MenuBar.addAction(import_action_entity_animation, 'file.import')
        MenuBar.addAction(export_action_entity_animation, 'file.export')

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
        vectorFromArrayToObject = (vectorArray, isString = false) => {
            return isString ? {x: vectorArray[0].toString(), y: vectorArray[1].toString(), z: vectorArray[2].toString()} : {x: vectorArray[0], y: vectorArray[1], z: vectorArray[2]}
        }

        vectorIsEqualToVector = (vectorA, vectorB) => {
            return (vectorA[0] == vectorB[0]) && (vectorA[1] == vectorB[1]) && (vectorA[2] == vectorB[2])
        }

        function stringifyJSON(obj, exclude = [], space = "\t", excluder = (obj) => {
            if(Array.isArray(obj)){
                return obj.every(Number.isFinite)
            }else if(obj instanceof Object){
                return obj.uv !== undefined
            }
            return false
          }) {
            let recur = (obj, spacing, inarray, islastinarray = false) => {
              let txt = '';
          
              if (inarray) {
                if (Array.isArray(obj)) {        
                  txt += '[';
          
                  for(let i=0;i<obj.length;i++) {
                    var islast = i === (obj.length - 1)
                    
                    txt += recur(obj[i], spacing + space, true, islast);
                  };
          
                  txt = txt.substr(0, Math.max(1,txt.length - 2)) + ']';
                  
                } else if (typeof obj === 'object' && obj !== null) {
                    if(excluder(obj)){
                        txt += JSON.stringify(obj)
                    }else{
                        txt += '{' + recur(obj, spacing + space, false) + '\n' + spacing + '}';
                    }
                } else if (typeof obj === 'string') {
                  txt += obj.replaceAll(/\"/g, '\\"') + '"';
                } else {
                  txt += obj;
                };
                
                
                return txt + (islastinarray ? '  ' : ", ") + (excluder(obj) ? "\n" + spacing : "");
                
              } else {
                for (let key of Object.keys(obj)) {
                  if ((exclude.indexOf(key) !== -1)||(excluder(obj[key]))) {
                    txt += '\n' + spacing + '"' + key + '": ' + JSON.stringify(obj[key]);
                  } else if (Array.isArray(obj[key])) {
                    txt += '\n' + spacing + '"' + key + '": [';
                    
                    for(let i=0;i<obj[key].length;i++) {
                        var islast = i === (obj[key].length - 1)
                        
                      txt += recur(obj[key][i], spacing + space, true, islast);
                    };
                    
                    txt = txt.substr(0, Math.max(1,txt.length - 2)) + ']';
                    
                  } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    txt += '\n' + spacing + '"' + key + '": {' + recur(obj[key], spacing + space, false) + '\n' + spacing + '}';
                  } else if (typeof obj[key] === 'string') {
                    txt += '\n' + spacing + '"' + key + '": "' + obj[key].replaceAll(/\"/g, '\\"') + '"';
                  } else {
                    txt += '\n' + spacing + '"' + key + '": ' + obj[key];
                  };
                  
                  txt += ',';
                };
                
                return txt.substr(0, txt.length - 1);
              };
          
            };
            return (Array.isArray(obj) ? '[' + recur(obj, space, true) + '\n' + ']' : '{' + recur(obj, space, false) + '\n' + '}');
          };
      },


      onunload() {
		import_action_block.delete();
		export_action_block.delete();
		/*export_action_block_maximized.delete();
		export_action_block_minimized.delete();*/
		export_action_block_aschild.delete();
		import_action_entity.delete();
		export_action_entity.delete();

        import_action_entity_animation.delete();
        export_action_entity_animation.delete();
        Codecs.java_block.load_filter.condition = originalJavaBlockCond
      }
    })
  })()
