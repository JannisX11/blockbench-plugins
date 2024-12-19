(function() {
    var exportAction, importAction;
    var lastOptions = {};
    var sides = {
        north: "front",
        south: "back",
        west: "left",
        east: "right",
        up: "top",
        down: "bottom"
    };
    var sidesInverse = {
        front: "north",
        back: "south",
        left: "west",
        right: "east",
        top: "up",
        bottom: "down"
    };

    /* Model exporter code */

    function areThereObjects(objects)
    {
        for (let i = 0; i < objects.length; i++) 
        {
            if (objects[i].type === "group")
            {
                return true;
            }
        }

        return false;
    }

    function createHierarchy(objects)
    {
        var groups = {};
        var createAnchor = !areThereObjects(objects);

        if (createAnchor)
        {
            var group = new Group();

            group.children = objects;
            groups.anchor = createModelGroup(group, groups);
        }
        else
        {
            for (let i = 0; i < objects.length; i++)
            {
                var object = objects[i];
    
                if (object.type === "group")
                {
                    groups[object.name] = createModelGroup(object, groups);
                }
            }
        }

        return groups;
    }

    function createModelGroup(o, groups)
    {
        var group = {};
        var cubes = [];
        var meshes = [];

        group.origin = o.origin.slice();

        if (!o.rotation.allEqual(0))
        {
            group.rotate = o.rotation.slice();
        }

        if (typeof o.parent.name === "string")
        {
            group.parent = o.parent.name;
        }

        for (let i = 0; i < o.children.length; i++)
        {
            var object = o.children[i];

            if (object.type === "group")
            {
                groups[object.name] = createModelGroup(object, groups);
            }
            else if (object.type === "cube")
            {
                cubes.push(createCube(object));
            }
            else if (object.type === "mesh")
            {
                meshes.push(createMesh(object));
            }
        }

        if (cubes.length > 0)
        {
            group.cubes = cubes;
        }

        if (meshes.length > 0)
        {
            group.meshes = meshes;
        }

        return group;
    }

    function createCube(c)
    {
        var cube = {};
        var uvs = {};

        cube.origin = c.origin.slice();
        cube.from = c.from.slice();
        cube.size = c.size();

        if (c.inflate !== 0)
        {
            cube.offset = c.inflate;
        }

        if (!c.rotation.allEqual(0))
        {
            cube.rotate = c.rotation.slice();
        }

        Object.keys(CubeFace.opposite).forEach(key =>
        {
            var face = c.faces[key];

            if (face && face.texture !== null)
            {
                var uv = face.uv.slice();

                if (face.rotation !== 0)
                {
                    uv.push(face.rotation);
                }

                uvs[sides[key]] = uv;
            }
        });

        if (Object.keys(uvs).length > 0)
        {
            cube.uvs = uvs;
        }

        return cube;
    }

    function createMesh(c)
    {
        var mesh = {};
        var vertices = [];
        var uvs = [];

        var pushVertexKey = (k, f) =>
        {
            var v = c.vertices[k];
            var u = f.uv[k];

            vertices.push(v[0]);
            vertices.push(v[1]);
            vertices.push(v[2]);
            uvs.push(u[0]);
            uvs.push(u[1]);
        };

        mesh.origin = c.origin.slice();

        if (!c.rotation.allEqual(0))
        {
            mesh.rotate = c.rotation.slice();
        }

        for (var key in c.faces)
        {
            var face = c.faces[key];
            var vertexKeys = face.vertices;

            if (vertexKeys.length == 3)
            {
                for (var i = 0; i < vertexKeys.length; i++)
                {
                    pushVertexKey(vertexKeys[i], face);
                }
            }
            else if (vertexKeys.length == 4)
            {
                /* Triangulate a quad */
                var sorted = face.getSortedVertices();
                
                pushVertexKey(sorted[0], face);
                pushVertexKey(sorted[1], face);
                pushVertexKey(sorted[2], face);

                pushVertexKey(sorted[0], face);
                pushVertexKey(sorted[2], face);
                pushVertexKey(sorted[3], face);
            }
        }

        mesh.vertices = vertices;
        mesh.uvs = uvs;

        return mesh;
    }

    /* Animation exporting code */

    function createAnimation(a)
    {
        var animation = {
            groups: {}
        };

        animation.duration = a.length;

        for (let key in a.animators)
        {
            var animator = a.animators[key];
            var group = createAnimationGroup(animator);

            if (Object.keys(group).length > 0)
            {
                animation.groups[animator.name] = group;
            }
        }

        return animation;
    }

    function createAnimationGroup(a)
    {
        var group = {};
        var translate = createAnimationKeyframes(a.position);
        var scale = createAnimationKeyframes(a.scale);
        var rotate = createAnimationKeyframes(a.rotation);

        if (translate.length > 0) group.translate = translate;
        if (scale.length > 0) group.scale = scale;
        if (rotate.length > 0) group.rotate = rotate;

        return group;
    }

    function createAnimationKeyframes(g)
    {
        if (!g)
        {
            return [];
        }

        var keyframes = [];

        for (let i = 0; i < g.length; i++)
        {
            var keyframe = g[i];
            var data = keyframe.data_points[0];
            var out = [
                keyframe.time,
                keyframe.interpolation,
                getExpression(data, "x"), getExpression(data, "y"), getExpression(data, "z")
            ];

            keyframes.push(out);
        }

        return keyframes;
    }

    function getExpression(data, component)
    {
        var value = data[component] || 0;
        var parsed = parseFloat(value);

        if (!isNaN(value) && !isNaN(parsed))
        {
            return parsed;
        }

        if (typeof value === "string")
        {
            value = value.trim();

            if (!value)
            {
                return 0;
            }
        }

        return value;
    }

    function compile()
    {
        function findTextureSize()
        {
            var c = Cube.all;
            var keys = Object.keys(sides);

            for (var i = 0; i < c.length; i++)
            {
                var cube = c[i];

                for (var j = 0; j < keys.length; j++)
                {
                    var face = cube.faces[keys[j]];

                    if (face)
                    {
                        var textureUuid = face.texture;

                        for (var k = 0; k < Texture.all.length; k++)
                        {
                            var texture = Texture.all[k];

                            if (texture && texture.uuid == textureUuid)
                            {
                                return [texture.width, texture.height];
                            }
                        }
                    }
                }
            }

            return null;
        }

        var output = {
            version: "0.7.2",
            animations: {}
        };

        if (lastOptions.model)
        {
            var texture = [Project.texture_width, Project.texture_height];
            var textureSize = findTextureSize();

            if (textureSize)
            {
                texture = textureSize;
            }

            output.model = {
                groups: createHierarchy(Outliner.root),
                texture: texture
            };
        }

        if (lastOptions.animations)
        {
            Animation.all.forEach(animation =>
            {
                output.animations[animation.name] = createAnimation(animation);
            });
        }

        return output;
    }

    function compileFirstCubes()
    {
        var group = Group.selected;
        var cubes = [];

        if (group)
        {
            for (var child of group.children)
            {
                if (child.type === "cube")
                {
                    cubes.push(createCube(child));
                }
            }
        }

        return cubes;
    }

    /* Import */

    function importBBS(json)
    {
        Undo.initEdit({
            outliner: true,
            animations: []
        });

        try
        {
            if (json.model) importModel(json.model);
            if (json.animations) importAnimations(json.animations);
        }
        catch (e)
        {
            console.log(e);
        }

        Undo.finishEdit("Finished importing a BBS model");
        Canvas.updateAll();
    }

    function importAnimations(animations)
    {
        for (var key in animations)
        {
            var animationObject = animations[key];
            var data = {
                name: key,
                length: animationObject.duration
            };

            var animation = new Animation(data).add();
            var groupKeys = Object.keys(animationObject.groups);

            groupKeys.forEach(k => importGroup(k, animationObject.groups[k], animation));
        }
    }

    function importGroup(key, groupObject, animation)
    {
        var group = Group.all.find(o => o.name === key);

        if (!group)
        {
            return;
        }

        var animator = new BoneAnimator(group.uuid, animation, key);

        animation.animators[group.uuid] = animator;

        if (groupObject.translate) importChannel(animator, "position", groupObject.translate);
        if (groupObject.rotate) importChannel(animator, "rotation", groupObject.rotate);
        if (groupObject.scale) importChannel(animator, "scale", groupObject.scale);
    }

    function importChannel(animator, name, channel)
    {
        channel.forEach(kf => 
        {
            animator.addKeyframe({
                channel: name,
                time: kf[0],
                interpolation: kf[1],
                data_points: [{x: kf[2], y: kf[3], z: kf[4]}]
            });
        });
    }

    function importModel(model)
    {
        var texture = model.texture;
        var relations = {};
        var groups = {};

        Project.texture_width = texture[0];
        Project.texture_height = texture[1];

        for (var key in model.groups)
        {
            var groupObject = model.groups[key];
            var data = {
                name: key
            };

            if (groupObject.rotate) data.rotation = groupObject.rotate;
            if (groupObject.origin) data.origin = groupObject.origin;

            var group = new Group(data);

            group.init();

            if (groupObject.parent) relations[key] = groupObject.parent;
            if (groupObject.cubes) groupObject.cubes.forEach(v => importCube(v, group));
            if (groupObject.meshes) groupObject.meshes.forEach(v => importMesh(v, group));

            groups[key] = group;
        }

        for (var key in relations)
        {
            groups[key].addTo(groups[relations[key]]);
        }
    }

    function importCube(cubeObject, group)
    {
        var cube = new Cube({
            origin: cubeObject.origin || [0, 0, 0],
            from: cubeObject.from,
            to: [
                cubeObject.from[0] + cubeObject.size[0],
                cubeObject.from[1] + cubeObject.size[1],
                cubeObject.from[2] + cubeObject.size[2]
            ],
            rotation: cubeObject.rotate || [0, 0, 0],
            inflate: cubeObject.offset || 0
        });

        Object.keys(cubeObject.uvs).forEach(key =>
        {
            var uv = cubeObject.uvs[key];
            var face = cube.faces[sidesInverse[key]];

            face.uv = uv.slice(0, 4);

            if (uv.length >= 5)
            {
                face.rotation = uv[4];
            }
        });

        cube.init();
        cube.addTo(group);
    }

    function importMesh(meshObject, group)
    {
        var vertices = {};
        var faces = {};

        for (var i = 0, c = meshObject.vertices.length / 9; i < c; i++)
        {
            var a1 = [
                meshObject.vertices[i * 9],
                meshObject.vertices[i * 9 + 1],
                meshObject.vertices[i * 9 + 2]
            ];
            var a2 = [
                meshObject.vertices[i * 9 + 3],
                meshObject.vertices[i * 9 + 4],
                meshObject.vertices[i * 9 + 5]
            ];
            var a3 = [
                meshObject.vertices[i * 9 + 6],
                meshObject.vertices[i * 9 + 7],
                meshObject.vertices[i * 9 + 8]
            ];
            var key1 = bbuid(6);
            var key2 = bbuid(6);
            var key3 = bbuid(6);

            vertices[key1] = a1;
            vertices[key2] = a2;
            vertices[key3] = a3;

            var face = {
                uv: {},
                vertices: [key1, key2, key3]
            };

            face.uv[key1] = [meshObject.uvs[i * 6], meshObject.uvs[i * 6 + 1]];
            face.uv[key2] = [meshObject.uvs[i * 6 + 2], meshObject.uvs[i * 6 + 3]];
            face.uv[key3] = [meshObject.uvs[i * 6 + 4], meshObject.uvs[i * 6 + 5]];

            faces[bbuid(6)] = face;
        }

        var mesh = new Mesh({
            origin: meshObject.origin || [0, 0, 0],
            rotation: meshObject.rotate || [0, 0, 0],
            vertices: vertices,
            faces: faces
        });

        mesh.init();
        mesh.addTo(group);
    }

    /* Bootstrap */

    var bbsCodec = new Codec("bbs_model", {
        name: "BBS model",
        extension: "json",
        remember: false,
        compile(options) {
            return autoStringify(compile());
        },
        fileName() {
            var name = Project.name || "model";

            return name.endsWith("bbs") ? name : name + ".bbs";
        }
    });

    var exportDialog = new Dialog({
        id: "bbs_export_options",
        title: "BBS model exporter",
        form: {
            exportModel: {
                label: "Export model data",
                type: "checkbox",
                value: true
            },
            exportAnimations: {
                label: "Export animations",
                type: "checkbox",
                value: true
            },
            copyToBuffer: {
                label: "Copy to buffer",
                type: "checkbox",
                value: false
            },
            copyOnlyFirst: {
                label: "Copy first selected group",
                description: "When enabled, copies to the buffer only cubes from the first found group. This option is ignored when Copy to buffer option is disabled!",
                type: "checkbox",
                value: false
            }
        },
        onConfirm: function(formData) {
            this.hide();

            lastOptions.model = formData.exportModel;
            lastOptions.animations = formData.exportAnimations;

            if (formData.copyToBuffer)
            {
                var data = {};

                if (formData.copyOnlyFirst)
                {
                    data = compileFirstCubes();
                }
                else
                {
                    data = compile();
                }

                Clipbench.setText(autoStringify(data));
            }
            else
            {
                bbsCodec.export();
            }
        }
    });

    Plugin.register("bbs_exporter", {
        title: "BBS Model Ex/importer",
        author: "McHorse",
        description: "Adds actions to export/import models in BBS format, which is used by BBS machinima studio.",
        icon: "icon.png",
        version: "1.2.4",
        min_version: "4.8.0",
        variant: "both",
        has_changelog: true,
        onload() {
            exportAction = new Action("bbs_exporter", {
                name: "Export BBS model",
                category: "file",
                description: "Export model as a BBS (.bbs.json) model",
                icon: "fa-file-export",
                click() {
                    exportDialog.show();
                }
            });

            importAction = new Action("bbs_importer", {
                name: "Import BBS model",
                category: "file",
                description: "Import a BBS model (.bbs.json) model",
                icon: "fa-file-import",
                click() {
                    Blockbench.import({
                        extensions: ['bbs.json'],
                        type: 'BBS model',
                        readtype: 'text',
                    }, (files) => {
                        importBBS(JSON.parse(files[0].content));
                    });
                }
            });

            MenuBar.addAction(exportAction, "file.export");
            MenuBar.addAction(importAction, "file.import");
        },
        onunload() {
            exportAction.delete();
            importAction.delete();
        }
    });
})();