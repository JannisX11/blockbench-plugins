
(function(){

    var menuButton;

    Plugin.register('voxel_shape_generator', {
        title: 'VoxelShape Generators',
        author: 'Spectre0987',
        description: 'Generates Voxel Shapes (Supports Mojang Mappings and MCP)',
        icon: 'bar_chart',
        version: '0.0.1',
        variant: 'both',
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
                    mcp: 'MCP'
                },
                default: 'MCP'
            }
        },
        onConfirm: function(form){

            var file = "";

            if(form.mappings === 'momap')
                file = generateMomapFile();
            else if(form.mappings === 'mcp'){
                file = generateMCPFile();
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

function generateMomapFile(){
    var data = "public VoxelShape makeShape(){\n\tVoxelShape shape = VoxelShapes.empty();\n";
    for(var i = 0; i< Cube.all.length; ++i){
        var cube = Cube.all[i];
        
        var from = cube.from;
        var to = cube.to;

        data += "\tshape = VoxelShapes.join(shape, VoxelShapes.box("
            .concat(formatVec3(from)).concat(", ")
            .concat(formatVec3(to))
            .concat("), IBooleanFunction.OR);\n");
    }
    data += "\n\treturn shape;\n}";
    return data;
}

function generateMCPFile(){
    var data = "public VoxelShape makeShape(){\n\tVoxelShape shape = VoxelShapes.empty();\n"

    for(var i = 0; i < Cube.all.length; ++i){
        var cube = Cube.all[i];

        data += "\tshape = VoxelShapes.combineAndSimplify(shape, VoxelShapes.create("
            .concat(formatVec3(cube.from)).concat(", ")
            .concat(formatVec3(cube.to))
            .concat(");\n");
    }
    data += "\n\treturn shape;\n}"
    return data;

}

function convertToBlockPercent(pixel){
    return pixel / 16.0;
}

function formatVec3(vector){
    return ""
        .concat(convertToBlockPercent(vector[0])).concat(", ")
        .concat(convertToBlockPercent(vector[1])).concat(", ")
        .concat(convertToBlockPercent(vector[2]));
}