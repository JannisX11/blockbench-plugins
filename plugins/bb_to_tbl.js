(function () {
    var button;

    function groupToFolder(group) {
        var cubes = [];
        var childrens = [];
        group.children.forEach(children => {
            if (children instanceof Cube) {
                if (children.selected)
                    console.log(children);
                if (!cube.mirror_uv && children.rotation[0] == 0 && children.rotation[1] == 0 && children.rotation[2] == 0)
                    cubes.push(cubeToTblCube(children));
                else
                    childrens.push(cubeToFolder(children))
            }
            if (children instanceof Group) childrens.push(groupToFolder(children));
        });
        var folder = {
            texWidth: Project.texture_width,
            texHeight: Project.texture_height,
            matchProject: true,
            texOffX: 0,
            texOffY: 0,
            rotPX: group.origin[0] - (group.parent instanceof Group ? group.parent.origin[0] : 0),
            rotPY: (group.parent instanceof Group ? group.parent.origin[1] : 24) - group.origin[1],
            rotPZ: group.origin[2] - (group.parent instanceof Group ? group.parent.origin[2] : 0),
            rotAX: -group.rotation[0],
            rotAY: group.rotation[1],
            rotAZ: -group.rotation[2],
            mirror: !group.mirror_uv,
            showModel: group.visibility,
            boxes: cubes,
            children: childrens,
            identifier: "",
            name: group.name,
        }
        return folder;
    }

    function cubeToFolder(cube) {
        var folder = {
            texWidth: Project.texture_width,
            texHeight: Project.texture_height,
            matchProject: true,
            texOffX: 0,
            texOffY: 0,
            rotPX: cube.origin[0] - cube.parent.origin[0],
            rotPY: cube.parent.origin[1] - cube.origin[1],
            rotPZ: cube.origin[2] - cube.parent.origin[2],
            rotAX: -cube.rotation[0],
            rotAY: cube.rotation[1],
            rotAZ: -cube.rotation[2],
            mirror: !cube.mirror_uv,
            showModel: cube.visibility,
            boxes: [cubeToTblCube(cube, cube)],
            children: [],
            identifier: "",
            name: cube.name,
        }
        if (cube.selected)
            console.log(folder);
        return folder;
    }

    function cubeToTblCube(cube, parent) {
        if(!parent)
            parent = cube.parent;
        var tblCube = {
            posX: cube.from[0] - parent.origin[0],
            posY: parent.origin[1] - cube.to[1],
            posZ: cube.from[2] - parent.origin[2],
            dimX: cube.to[0] - cube.from[0],
            dimY: cube.to[1] - cube.from[1],
            dimZ: cube.to[2] - cube.from[2],
            expandX: cube.inflate,
            expandY: cube.inflate,
            expandZ: cube.inflate,
            texOffX: cube.uv_offset[0],
            texOffY: cube.uv_offset[1],
            identifier: "",
            name: cube.name,
        }
        return tblCube;
    }

    Plugin.register('bb_to_tbl', {
        title: 'Tabula Exporter',
        author: 'grillo78',
        description: 'This plugin allows modded entity models to export as .tbl files.',
        icon: 'bar_chart',
        version: '1.0',
        variant: 'both',
        onload() {
            console.log("Loaded BB to TBL plugin");
            button = new Action('bb_to_tbl', {
                name: 'Export to Tabula',
                description: 'Export the actual model to tabula saves format.',
                icon: 'bar_chart',
                category: "file",
                condition: () => Format.id === Formats.modded_entity.id,
                click: function () {
                    var parts = [];
                    Project.outliner.forEach(element => {
                        if (element.export)
                            parts.push(groupToFolder(element));
                    });
                    var outputBody = {
                        author: "",
                        projectVersion: 5,
                        notes: [],
                        scaleX: 1.0,
                        scaleY: 1.0,
                        scaleZ: 1.0,
                        texWidth: Project.texture_width,
                        texHeight: Project.texture_height,
                        textureFile: "texture.png",
                        parts: parts,
                        identifier: "",
                        name: Project.name,
                    }
                    var zip = new JSZip();
                    zip.file("model.json", JSON.stringify(outputBody));
                    var tex = Texture.getDefault();
                    zip.file("texture.png", tex.getBase64(), {
                        base64: true
                    });
                    zip.generateAsync({
                            type: "blob"
                        })
                        .then(function (content) {

                            Blockbench.export({
                                savetype: "zip",
                                extensions: ['tbl'],
                                name: 'model.tbl',
                                content: content,
                            });
                        });
                }
            });
            MenuBar.addAction(button, 'file.export');
        },
        onunload() {
            button.delete();
        }
    });
})();