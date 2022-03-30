(function() {
    class RenderLayer {
        constructor(name, title) {
            this.name = name
            this.title = title
        }
    }

    const NONE = "None"
    const LAYERS = [
        new RenderLayer("solid", "Solid"),
        new RenderLayer("translucent", "Translucent")
    ]

    var layerGroups = {}
    var useMultiLayer = false

    Codecs.java_block.on('compile', event => {
        // if we're not doing a multi-layer export, return
        if (!useMultiLayer) return;
        event.model.loader = "forge:multi-layer"
        event.model.layers = {}
        delete event.model.elements
        function computeCube(list, s) {
            if (s.export == false) return;
            //Create Element
            var element = {}
            if ((event.options.cube_name !== false && !settings.minifiedout.value) || event.options.cube_name === true) {
                if (s.name !== 'cube') {
                    element.name = s.name
                }
            }
            element.from = s.from.slice();
            element.to = s.to.slice();
            if (s.inflate) {
                for (var i = 0; i < 3; i++) {
                    element.from[i] -= s.inflate;
                    element.to[i] += s.inflate;
                }
            }
            if (s.shade === false) {
                element.shade = false
            }
            if (!s.rotation.allEqual(0) || !s.origin.allEqual(8)) {
                var axis = s.rotationAxis()||'y';
                element.rotation = new oneLiner({
                    angle: s.rotation[getAxisNumber(axis)],
                    axis,
                    origin: s.origin
                })
            }
            if (s.rescale) {
                if (element.rotation) {
                    element.rotation.rescale = true
                } else {
                    element.rotation = new oneLiner({
                        angle: 0,
                        axis: s.rotation_axis||'y',
                        origin: s.origin,
                        rescale: true
                    })
                }

            }
            if (s.rotation.positiveItems() >= 2) {
                element.rotated = s.rotation
            }
            var element_has_texture
            var e_faces = {}
            for (var face in s.faces) {
                if (s.faces.hasOwnProperty(face)) {
                    if (s.faces[face].texture !== null) {
                        var tag = new oneLiner()
                        if (s.faces[face].enabled !== false) {
                            tag.uv = s.faces[face].uv.slice();
                            tag.uv.forEach((n, i) => {
                                tag.uv[i] = n * 16 / UVEditor.getResolution(i%2);
                            })
                        }
                        if (s.faces[face].rotation) {
                            tag.rotation = s.faces[face].rotation
                        }
                        if (s.faces[face].texture) {
                            var tex = s.faces[face].getTexture()
                            if (tex) {
                                tag.texture = '#' + tex.id
                                // in the future we should dynamically map textures
                                // to each layer
                                //textures_used.safePush(tex)
                            }
                            element_has_texture = true
                        }
                        if (!tag.texture) {
                            tag.texture = '#missing'
                        }
                        if (s.faces[face].cullface) {
                            tag.cullface = s.faces[face].cullface
                        }
                        if (s.faces[face].tint >= 0) {
                            tag.tintindex = s.faces[face].tint
                        }
                        e_faces[face] = tag
                    }
                }
            }
            //Gather Textures
            if (!element_has_texture) {
                element.color = s.color
            }
            element.faces = e_faces

            function inVd(n) {
                return n < -16 || n > 32;
            }
            if (inVd(element.from[0]) ||
            inVd(element.from[1]) ||
            inVd(element.from[2]) ||
            inVd(element.to[0]) ||
            inVd(element.to[1]) ||
            inVd(element.to[2])
        ) {
            overflow_cubes.push(s);
        }
        if (Object.keys(element.faces).length) {
            list.push(element)
        }
    }

    function iterate(list, arr) {
        var i = 0;
        if (!arr || !arr.length) {
            return;
        }
        for (i = 0; i < arr.length; i++) {
            if (arr[i].type === 'cube') {
                computeCube(list, arr[i])
            } else if (arr[i].type === 'group') {
                iterate(list, arr[i].children)
            }
        }
    }

    function createModel(layer) {
        if (!(layer.name in layerGroups)) {
            return
        }

        group = null
        for (var i = 0; i < Outliner.root.length; i++) {
            if (layerGroups[layer.name] == Outliner.root[i].name) {
                group = Outliner.root[i]
                break
            }
        }
        layerElements = []
        iterate(layerElements, [group])
        model = {}
        if ('parent' in event.model) {
            model.parent = event.model.parent
        }
        model.textures = event.model.textures
        model.elements = layerElements
        event.model.layers[layer.name] = model
    }

    LAYERS.forEach(l => createModel(l))
    useMultiLayer = false
})

function getDialog() {
    var groups = {};
    groups[NONE] = "None";
    Outliner.root.forEach(function(s) {
        if (s instanceof Group) {
            groups[s.name] = s.name;
        }
    });
    var optionsForm = {};
    LAYERS.forEach(l => {
        optionsForm[l.name] = {
            label: l.title,
            type: 'select',
            options: groups
        }
    });
    return new Dialog({
        id: 'multilayer-dialog',
        title: 'Multi-Layer JSON Model',
        form: optionsForm,
        lines: [
            '<p>Choose the group to apply to each render layer.</p>'
        ],
        onConfirm: function (formData) {
            this.hide();
            LAYERS.forEach(l => {
                if (formData[l.name] !== NONE) {
                    layerGroups[l.name] = formData[l.name];
                }
            });
            useMultiLayer = true
            Codecs.java_block.export();
        }
    });
}

Plugin.register('multi-layer', {
    title: 'Multi-Layer',
    icon: 'layers',
    author: 'aidancbrady',
    description: 'Allows exporting in Forge\'s multi-layer model format.',
    tags: ["Minecraft: Java Edition"],
    version: '1.0',
    variant: 'both',
    onload() {
        action = new Action({
            id: 'export_multilayer',
            name: 'Export Multi-Layer Model',
            icon: 'layers',
            description: 'Exports a model in the Forge multi-layer format.',
            category: 'file',
            condition: _ => Format.id === 'java_block',
            click: () => {
                layerRenders = {};
                getDialog().show();
            }
        })
        MenuBar.addAction(action, 'file.export');
    },
    onunload() {
        action.delete()
    }
})
})()
