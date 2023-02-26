(function() {
    var button;
    var lastOptions = {};
    var sides = {
        north: "front",
        south: "back",
        west: "left",
        east: "right",
        up: "top",
        down: "bottom"
    };

    /* Model exporter code */

    function createHierarchy(objects)
    {
        var groups = {};

        for (let i = 0; i < objects.length; i++)
        {
            var object = objects[i];

            if (object.type === "group")
            {
                groups[object.name] = createModelGroup(object, groups);
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

            if (face)
            {
                var uv = face.uv.slice();

                if (key === "up" || key === "down")
                {
                    var newUv = uv.slice();

                    newUv[0] = uv[2];
                    newUv[1] = uv[3];
                    newUv[2] = uv[0];
                    newUv[3] = uv[1];
                    uv = newUv;
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
            var u = face.uv[k];

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
        var output = {
             animations: {}
         };

         if (lastOptions.model)
         {
             output.model = {
                 groups: createHierarchy(Outliner.root),
                 texture: [Project.texture_width, Project.texture_height]
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
        var createCubes;

        createCubes = function (objects)
        {
            var groups = [];
            var cubes = [];

            for (let i = 0; i < objects.length; i++)
            {
                var object = objects[i];

                if (object.type === "group")
                {
                    groups.push(object);
                }
                else if (object.type === "cube")
                {
                    cubes.push(object);
                }
            }

            if (cubes.length > 0)
            {
                var result = [];

                for (let i = 0; i < cubes.length; i++)
                {
                    result.push(createCube(cubes[i]));
                }

                return result;
            }

            for (let i = 0; i < groups.length; i++)
            {
                var result = createCubes(groups[i].children);

                if (result)
                {
                    return result;
                }
            }

            return false;
        }

        return createCubes(Outliner.root);
    }

    /* Bootstrap */

    var bbsCodec = new Codec("bbs_model", {
        name: "BBS model",
        extension: "json",
        remember: false,
        compile(options) {
            return autoStringify(compile());
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
                label: "Copy first group",
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
        title: "BBS model exporter",
        author: "McHorse",
        description: "Adds a model exporter which allows to export models in BBS model format",
        icon: "fa-file-export",
        version: "1.1.1",
        variant: "both",
        onload() {
            button = new Action("bbs_exporter", {
                name: "Export BBS model",
                category: "file",
                description: "Export model as a BBS (.json) model",
                icon: "fa-file-export",
                click() {
                    exportDialog.show();
                }
            });

            MenuBar.addAction(button, "file.export");
        },
        onunload() {
            button.delete();
        }
    });
})();