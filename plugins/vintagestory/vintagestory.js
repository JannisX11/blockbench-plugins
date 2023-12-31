(function () {
    var codec;

    var import_action;
    var export_action;

    var setting_gamepath;

    var autosettings = [];
    var namespace = {}

    BBPlugin.register('vintagestory', {
        title: "Vintage Story",
        author: "Malik12tree",
        icon: "park",
        description: "Export and import of Vintage Story shapes",
        tags: ["Vintage Story"],
        version: "1.0.1",
        min_version: "4.9.2",
        variant: "both",
        await_loading: true,
        creation_date: "2023-12-22",
        onload() {
            setting_gamepath = new Setting('vs_gamepath', {
                name: 'Vintage Story game folder',
                description: 'Set this to the install path',
                category: 'defaults',
                value: process.env.APPDATA.replaceAll('\\', '/') + '/Vintagestory',
                type: 'text',
            });

            var format = new ModelFormat('vintagestory', {
                id: "vintagestorymodel",
                name: 'Vintage Story Model',
                description: 'Model Format for VS specific features',
                animated_textures: false,
                animation_files: false,
                animation_mode: true,
                bone_binding_expression: false,
                bone_rig: true,
                box_uv: false,
                category: 'general',
                centered_grid: false,
                display_mode: false,
                edit_mode: true,
                icon: 'park',
                image_editor: false,
                integer_size: false,
                java_face_properties: true,
                locators: true,
                meshes: false,
                model_identifier: false,
                optional_box_uv: false,
                paint_mode: true,
                parent_model_id: false,
                pose_mode: false,
                rotate_cubes: true,
                rotation_limit: false,
                select_texture_for_particles: false,
                show_on_start_screen: true,
                single_texture: false,
                target: ['Vintage Story'],
                texture_folder: true,
                texture_meshes: false,
                uv_rotation: true,
                vertex_color_ambient_occlusion: false,
            });

            codec = new Codec('vintagestory', {
                name: 'Vintage Story Block/Item Model',
                remember: true,
                extension: 'json',
                format: format,
                load_filter: {
                    type: 'json',
                    extensions: ['json'],
                    condition(model) {
                        return model.elements;
                    }
                },
                compile(exportOptions) {
                    const axis = ["x", "y", "z"];
                    const faces = ["north", "east", "south", "west", "up", "down",];
                    const channels = ["rotation", "position", "scale"];

                    let vs_model_json = {
                        textureWidth: Project.texture_width,
                        textureHeight: Project.texture_height,
                        textureSizes: {},
                        textures: {},
                        elements: [],
                        animations: []
                    };

                    // Textures
                    if (Project.textures.length > 0) {
                        let TFS = "" // Texture Folder Suffix
                        let NSS = "" // Namespace Suffix

                        for (let i = 0; i < Project.textures.length; i++) {
                            if (Project.textures[i].folder) {
                                TFS = "/";
                            } else {
                                TFS = "";
                            }
                            if (Project.textures[i].namespace) {
                                NSS = ":";
                            } else {
                                NSS = "";
                            }

                            eval(`vs_model_json.textureSizes["${Project.textures[i].id}"] = [${Project.textures[i].width}, ${Project.textures[i].height}]`);
                            vs_model_json.textures[Project.textures[i].id] = Project.textures[i].namespace.replace("survival", "game") + NSS + Project.textures[i].folder + TFS + Project.textures[i].name.replace(".png", "");
                        }
                    }

                    // Elements 
                    for (let obj of Outliner.root) {
                        createElement(vs_model_json.elements, obj);
                    }

                    function createElement(elements, obj) {
                        if (!obj.export) return;

                        if (obj.type === "cube") {
                            let element = {
                                name: obj.name,
                                from: [obj.from[0], obj.from[1], obj.from[2]],
                                to: [obj.to[0], obj.to[1], obj.to[2]],
                                rotationOrigin: [obj.origin[0], obj.origin[1], obj.origin[2]],
                                faces: {
                                    north: { texture: "#null", uv: [0, 0, 0, 0] },
                                    east: { texture: "#null", uv: [0, 0, 0, 0] },
                                    south: { texture: "#null", uv: [0, 0, 0, 0] },
                                    west: { texture: "#null", uv: [0, 0, 0, 0] },
                                    up: { texture: "#null", uv: [0, 0, 0, 0] },
                                    down: { texture: "#null", uv: [0, 0, 0, 0] }
                                },
                            };

                            if (obj.rotation[0] != 0)
                                element.rotationX = obj.rotation[0]
                            if (obj.rotation[1] != 0)
                                element.rotationY = obj.rotation[1]
                            if (obj.rotation[2] != 0)
                                element.rotationZ = obj.rotation[2]

                            // Handle faces
                            for (let face of faces) {
                                // Face texture
                                if (obj.faces[face].texture) {
                                    var texture = Project.textures.find(e => e.uuid == obj.faces[face].texture)
                                    if (texture) {
                                        element.faces[face].texture = "#" + texture.id;
                                    }
                                    else {
                                        console.log("Texture not found")
                                    }
                                }

                                // Face UV
                                element.faces[face].uv = [obj.faces[face].uv[0], obj.faces[face].uv[1], obj.faces[face].uv[2], obj.faces[face].uv[3]];

                                // Face rotation
                                if (obj.faces[face].rotation !== 0) {
                                    element.faces[face].rotation = obj.faces[face].rotation;
                                }
                            };

                            elements.push(element);
                        }
                        else if (obj.type == "group") {
                            // Don't export empty groups
                            var hasChildren =
                                obj.children != undefined &&
                                obj.children != null &&
                                obj.children.length > 0;

                            if (!hasChildren)
                                return;

                            // TODO: check for child cube with the same name so it can be collapsed
                            // or just take the first cube, it doesnt matter?

                            let element = {
                                name: obj.name,
                                from: [0, 0, 0],
                                to: [0, 0, 0],
                                rotationOrigin: [obj.origin[0], obj.origin[1], obj.origin[2]],
                                faces: {
                                    north: { texture: "#null", uv: [0, 0, 0, 0] },
                                    east: { texture: "#null", uv: [0, 0, 0, 0] },
                                    south: { texture: "#null", uv: [0, 0, 0, 0] },
                                    west: { texture: "#null", uv: [0, 0, 0, 0] },
                                    up: { texture: "#null", uv: [0, 0, 0, 0] },
                                    down: { texture: "#null", uv: [0, 0, 0, 0] }
                                },
                                children: []
                            };

                            if (obj.rotation[0] != 0)
                                element.rotationX = obj.rotation[0]
                            if (obj.rotation[1] != 0)
                                element.rotationY = obj.rotation[1]
                            if (obj.rotation[2] != 0)
                                element.rotationZ = obj.rotation[2]

                            elements.push(element);

                            for (let child of obj.children) {
                                createElement(element.children, child);
                            }
                        }
                    }

                    //Animation
                    for (let i = 0; i < Animation.all.length; i++) {
                        let animation = Animation.all[i];

                        const snap_time = (1 / Math.clamp(animation.snapping, 1, 120)).toFixed(4) * 1;

                        let animators = []
                        Object.keys(animation.animators).forEach(key => {
                            animators.push(animation.animators[key]);
                        });

                        let anim = {
                            name: animation.name,
                            code: (animation.name).toLowerCase().replace(" ", "_"),
                            onActivityStopped: "EaseOut",
                            onAnimationEnd: "Repeat",
                            quantityframes: (animation.length * 30).toFixed() * 1,
                            keyframes: [
                            ],
                        }

                        // loop mode
                        if (animation.loop === "hold") {
                            anim.onAnimationEnd = "Hold"
                        } else if (animation.loop === "once") {
                            anim.onAnimationEnd = "Stop"
                        }

                        animators.forEach(animator => {
                            let newKfs = [];

                            channels.forEach(channel => {
                                if (animator.group !== undefined && animator[channel].length > 0) {
                                    var keyframes_sorted = animator[channel].slice().sort((a, b) => a.time - b.time);
                                    for (let k = 0; k <= keyframes_sorted.last().time + 0.5; k += snap_time) {
                                        const timeIndex = Math.trunc(k * 10000) / 10000;

                                        //target kf
                                        const findingKF = animator[channel].find(kf => getRangeBool(kf.time, timeIndex - .02, timeIndex + .02));
                                        if (findingKF !== undefined) {
                                            const tIndex = newKfs.findIndex(e => e.find(f => f.time == findingKF.time));

                                            if (tIndex !== -1) {
                                                newKfs[tIndex].push(findingKF);
                                            } else {
                                                newKfs.push([findingKF]);
                                            }
                                        }
                                    }
                                }
                            });

                            newKfs.forEach((frame, indexf) => {
                                let keyframe = {
                                    frame: ((frame[0].time * 29).toFixed() * 1),
                                    elements: {
                                    }
                                }
                                const groupC = [animator.group]

                                for (let g = 0; g < groupC.length; g++) {
                                    let elemA = {};

                                    if (animator.keyframes.length > 0) {
                                        frame.forEach(kf => {
                                            axis.forEach(a => {
                                                var mult = 1;

                                                if (kf.channel == "position" && a == "x")
                                                    mult = -1;

                                                if (kf.channel == "rotation" && a != "z")
                                                    mult = -1

                                                elemA[kf.channel.replace("position", "offset").replace("scale", "stretch") + a.toUpperCase()] = kf.data_points[0][a] * mult;
                                            });
                                        });
                                        // 30 is fps VS uses for anims
                                        if (anim.keyframes.find(e => e.frame === (frame[0].time * 29).toFixed() * 1) !== undefined) {
                                            anim.keyframes.find(e => e.frame === (frame[0].time * 29).toFixed() * 1).elements[groupC[g].name] = elemA;
                                        } else {
                                            keyframe.elements[groupC[g].name] = elemA;
                                        }
                                    }
                                }
                                if (anim.keyframes.find(e => e.frame === (frame[0].time * 29).toFixed() * 1) === undefined) {
                                    anim.keyframes.push(keyframe);
                                }
                            });
                        });

                        anim.keyframes.sort((a, b) => a.frame - b.frame);
                        vs_model_json.animations.push(anim);
                    }

                    return autoStringify(vs_model_json);
                },
                parse(model, path, add) {

                    // Setup undo
                    var new_elements = [];
                    var new_textures = [];
                    //Undo.initEdit()//{ elements: new_elements, textures: new_textures }) //outliner: true, 

                    // New group
                    Project.added_models++;
                    var root_group = new Group(pathToName(path, false)).init().addTo();

                    // Texture sizes
                    if (model.texture_size instanceof Array && !add) {
                        Project.texture_width = Math.clamp(parseInt(model.texture_size[0]), 1, Infinity)
                        Project.texture_height = Math.clamp(parseInt(model.texture_size[1]), 1, Infinity)
                    }

                    // Get existing textures
                    var texture_ids = {}
                    Project.textures.forEach(tex => {
                        texture_ids[tex.id] = tex
                    })

                    // Resolve new textures
                    if (model.textures) {
                        for (var key in model.textures) {
                            // Check if texture has already been loaded
                            var existingTexture = Project.textures.find(e => e.id == key)
                            if (existingTexture)
                                continue;

                            // Create a new texture
                            var texture = new Texture().add()
                            texture.id = key

                            // Update game namespace from settings
                            namespace["game"] = settings.vs_gamepath.value.replaceAll('\\', '/') + "/assets/survival/textures"

                            // Update blank/relative namespace if we're in an assets folder
                            if (path.includes("assets")) {
                                var blankNSArr = []
                                for (var fragment of path.replaceAll('\\', '/').split('/')) {
                                    if (fragment == "shapes") {
                                        break;
                                    }
                                    blankNSArr.push(fragment)
                                }
                                namespace[""] = blankNSArr.join('/') + "/textures"
                            }

                            // Find namespace
                            var link = model.textures[key]
                            var spaces = link.split(':')
                            if (spaces.length > 1) {
                                texture.namespace = spaces[0]
                                link = spaces[1]
                            }
                            else {
                                texture.namespace = ""
                            }

                            // Load texture
                            var fullPath = "file:///" + namespace[texture.namespace] + "/" + link + ".png"
                            texture = texture.fromPath(fullPath)

                            // Find folder
                            var pathArr = link.split('/')
                            pathArr.pop()
                            texture.folder = pathArr.join('/')

                            // Record
                            new_textures.push(texture);
                            texture_ids[key] = texture
                        }

                        //Select Last Texture
                        if (Texture.all.length > 0) {
                            Texture.all.last().select();
                        }
                    }

                    // Resolve elements
                    for (let element of model.elements) {
                        parseElement(element, root_group, [0, 0, 0], new_elements, new_textures);
                    }

                    // Read animations
                    for (let modelAni of model.animations) {
                        var newAnimation = new Animation()
                        newAnimation.name = modelAni.name
                        newAnimation.length = modelAni.quantityframes / 30
                        if (modelAni.onAnimationEnd === "Stop")
                            newAnimation.loop = "once"
                        else if (modelAni.onAnimationEnd === "Hold")
                            newAnimation.loop = "hold"
                        newAnimation.add()
                        Animation.selected = newAnimation

                        let boneAnimators = {}

                        for (let modelKf of modelAni.keyframes) {
                            Object.keys(modelKf.elements).forEach((bonename) => {

                                var boneAnimator = boneAnimators[bonename]
                                if (boneAnimator == undefined) {
                                    console.log("adding new boneanimator " + bonename + " to " + newAnimation.name)
                                    let uuid = guid();
                                    boneAnimator = new BoneAnimator(uuid, newAnimation, bonename)
                                    boneAnimators[bonename] = boneAnimator
                                    newAnimation.animators[uuid] = boneAnimator
                                }
                                else {
                                    console.log(bonename + " already exists")
                                }

                                var frame = modelKf.frame / 29 // is this an off-by-one error in the export?
                                var modelBone = modelKf.elements[bonename]

                                if (modelBone.offsetX != undefined) {
                                    var val = { x: modelBone.offsetX, y: modelBone.offsetY, z: modelBone.offsetZ }
                                    var kf = boneAnimator.createKeyframe(val, frame, "position", false, false)
                                }
                                if (modelBone.rotationX != undefined) {
                                    var val = { x: modelBone.rotationX, y: modelBone.rotationY, z: modelBone.rotationZ }
                                    var kf = boneAnimator.createKeyframe(val, frame, "rotation", false, false)
                                }
                            })
                        }
                    }

                    function parseElement(element, group, parentPositionOrigin, new_elements, new_textures) {
                        // From/to
                        let from = [element.from[0] + parentPositionOrigin[0], element.from[1] + parentPositionOrigin[1], element.from[2] + parentPositionOrigin[2]];
                        let to = [element.to[0] + parentPositionOrigin[0], element.to[1] + parentPositionOrigin[1], element.to[2] + parentPositionOrigin[2]];

                        // Rotation origin
                        let rotationOrigin = [0, 0, 0]
                        if (element.rotationOrigin) {
                            rotationOrigin = [
                                element.rotationOrigin[0],
                                element.rotationOrigin[1],
                                element.rotationOrigin[2]
                            ];
                        }

                        // Rotation
                        let rotation = [
                            element.rotationX == undefined ? 0 : element.rotationX,
                            element.rotationY == undefined ? 0 : element.rotationY,
                            element.rotationZ == undefined ? 0 : element.rotationZ
                        ];

                        // Check for children
                        var hasChildren =
                            element.children != undefined &&
                            element.children != null &&
                            element.children.length > 0;

                        var isZeroSize =
                            from[0] == to[0] &&
                            from[1] == to[1] &&
                            from[2] == to[2];

                        // Create group and descend children if required
                        var parent_group = group;
                        if (hasChildren) {
                            parent_group = new Group().extend({
                                name: element.name,
                                origin: rotationOrigin,
                                rotation: rotation
                            }).init().addTo(group);

                            new_elements.push(parent_group)

                            for (let child_element of element.children) {
                                parseElement(child_element, parent_group, from, new_elements, new_textures);
                            }
                        }

                        // If the cube is a dummy for animations, ignore it.
                        if (!isZeroSize) {
                            // Create cube
                            let new_cube = new Cube({
                                name: element.name,
                                from: from,
                                to: to,
                                origin: rotationOrigin,
                                rotation: rotation
                            })

                            // Faces
                            if (element.faces) {
                                for (var key in element.faces) {
                                    var read_face = element.faces[key];
                                    var new_face = new_cube.faces[key];
                                    if (read_face === undefined) {
                                        new_face.texture = null
                                        new_face.uv = [0, 0, 0, 0]
                                    } else {
                                        if (typeof read_face.uv === 'object') {
                                            new_face.uv.forEach((n, i) => {
                                                new_face.uv[i] = read_face.uv[i] * UVEditor.getResolution(i % 2) / 16;
                                            })
                                        }
                                        if (read_face.texture === '#null') {
                                            new_face.texture = false;
                                        } else if (read_face.texture) {
                                            var id = read_face.texture.replace(/^#/, '')
                                            if (texture_ids[id])
                                                new_face.texture = texture_ids[id].uuid;
                                            else
                                                console.log("Cannot resolve texture id " + id)
                                        }
                                    }
                                }
                            }

                            // Done
                            new_cube.init().addTo(parent_group)
                            new_elements.push(new_cube)
                        }
                    }

                    //Undo.finishEdit("vsimporter")//, { "elements": new_elements, "textures": new_textures });
                    Validator.validate()
                }
            });

            format.codec = codec

            import_action = new Action('import_vsmodel', {
                id: "import_vintagestory",
                name: 'Import Vintage Story Shape',
                icon: 'park',
                category: 'file',
                click() {
                    Blockbench.import({
                        type: 'Vintage Story Shape',
                        extensions: ['json'],
                        type: codec.name,
                        readtype: 'text',
                    }, files => {
                        files.forEach(file => {
                            codec.parse(autoParseJSON(file.content), file.path, true)
                        })
                    })
                }
            })

            export_action = new Action('export_vsmodel', {
                id: "export_vintagestory",
                name: 'Export Vintage Story Shape',
                type: codec.name,
                icon: 'park',
                category: 'file',
                condition: () => { return Format.id == format.id },
                click() {
                    codec.export()
                }
            });

            MenuBar.addAction(import_action, 'file.import');
            MenuBar.addAction(export_action, 'file.export');
        },
        onunload() {
            codec.format.delete();
            codec.delete();

            import_action.delete()
            export_action.delete()

            setting_gamepath.delete()
            autosettings.forEach(setting => { setting.delete() })
        }
    })

    function getRangeBool(x, min, max) {
        return x >= min && x <= max;
    }
})()
