
(function(){

    var menuButton;

    Plugin.register('voxel_shape_generator', {
        title: 'VoxelShape Generators',
        author: 'Spectre0987, Nyfaria',
        description: 'Generates Voxel Shapes (Supports MojMaps, MCP and Yarn)',
        icon: 'fa-cubes',
        version: '0.2.0',
        variant: 'both',
        tags: ["Minecraft: Java Edition"],
        onload(){
            menuButton = new Action("export_vs", {
                name : 'Export Voxel Shape',
                description : 'Exports VoxelShape to a mapping of your choice',
                icon : 'fa-file-export',
                click: function(){
                    
                    openMappingsBox();
                    
                }
            });

            MenuBar.addAction(menuButton, "file.export");
        },
        onunload(){
            menuButton.delete();
        }
    });

})();

function openMappingsBox(){
    new Dialog("select_mappings", {
        id: 'select_mappings',
        title: 'Select Mappings',
        form:{
            mappings:{
                label: 'Mappings',
                type: 'select',
                options: {
                    momap: 'Mojang Mappings',
                    mcp: 'MCP',
                    yarn: 'Yarn'
                }
            }
        },
        onConfirm: function(form){

            var file = "";

            if(form.mappings === 'momap')
                file = generateMomapFile(Format.centered_grid);
            else if(form.mappings === 'mcp'){
                file = generateMCPFile(Format.centered_grid);
            } else if(form.mappings === 'yarn') {
                file = generateYarnFile(Format.centered_grid);
            }

            this.hide();

            Blockbench.export({
                type : 'Voxel Shape File (.txt)',
                extensions: ['txt'],
                savetype: 'text',
                content: file
            });
        }
    })
    .show();
}

function generateMomapFile(centered){
    var data = "public VoxelShape makeShape(){\n\tVoxelShape shape = Shapes.empty();\n";
    for(var i = 0; i< Cube.all.length; ++i){
        var cube = Cube.all[i];
        
        var from = cube.from;
        var to = cube.to;

        data += "\tshape = Shapes.join(shape, Shapes.box("
            .concat(formatVec3(from, centered)).concat(", ")
            .concat(formatVec3(to, centered))
            .concat("), BooleanOp.OR);\n");
    }
    data += "\n\treturn shape;\n}";
    return data;
}

function generateYarnFile(centered){
    var data = "public VoxelShape makeShape(){\n\tVoxelShape shape = VoxelShapes.empty();\n";
    for(var i = 0; i< Cube.all.length; ++i){
        var cube = Cube.all[i];
        
        var from = cube.from;
        var to = cube.to;

        data += "\tshape = VoxelShapes.combine(shape, VoxelShapes.cuboid("
            .concat(formatVec3(from, centered)).concat(", ")
            .concat(formatVec3(to, centered))
            .concat("), BooleanBiFunction.OR);\n");
    }
    data += "\n\treturn shape;\n}";
    return data;
}

function generateMCPFile(centered){
    var data = "public VoxelShape makeShape(){\n\tVoxelShape shape = VoxelShapes.empty();\n"

    for(var i = 0; i < Cube.all.length; ++i){
        var cube = Cube.all[i];

        data += "\tshape = VoxelShapes.combineAndSimplify(shape, VoxelShapes.create("
            .concat(formatVec3(cube.from, centered)).concat(", ")
            .concat(formatVec3(cube.to, centered))
            .concat(");\n");
    }
    data += "\n\treturn shape;\n}"
    return data;
}

function convertToBlockPercent(pixel){
    return pixel / 16.0;
}

function formatVec3(vector, centered){
    var offset = centered ? 0.5 : 0;
    return ""
        .concat(convertToBlockPercent(vector[0]) + offset).concat(", ")
        .concat(convertToBlockPercent(vector[1])).concat(", ")
        .concat(convertToBlockPercent(vector[2]) + offset);
}
