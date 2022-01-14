(function () {
  var menuButton;

  //Credits to Spectre0987

  Plugin.register("voxel_shape_fabric_generator", {
    title: "VoxelShape Fabric Generator",
    author: "CyberStefNef",
    description: "Generates Voxel Shapes for Fabric",
    icon: "bar_chart",
    version: "0.0.1",
    variant: "both",
    tags: ["Minecraft: Java Edition"],
    onload() {
      menuButton = new Action("export_vs", {
        name: "Export Voxel Shape for Fabric",
        description: "Exports VoxelShape to Fabric Code",
        icon: "fa-file-export",
        click: function () {
          file = generateFabricFile(Format.centered_grid);
          Blockbench.export({
            type: "Voxel Shape File",
            extensions: ["java", "txt"],
            savetype: "java",
            content: file,
          });
        },
      });

      MenuBar.addAction(menuButton, "file.export");
    },
    onunload() {
      menuButton.delete();
    },
  });

  function generateFabricFile(centered) {
    var data =
      "public VoxelShape makeShape(){\n\tVoxelShape shape = VoxelShapes.empty();\n";

    for (var i = 0; i < Cube.all.length; ++i) {
      var cube = Cube.all[i];

      data += "\tshape = VoxelShapes.union(shape, VoxelShapes.cuboid("
        .concat(formatVec3(cube.from, centered))
        .concat(", ")
        .concat(formatVec3(cube.to, centered))
        .concat("));\n");
    }
    data += "\n\treturn shape;\n}";
    return data;
  }

  function convertToBlockPercent(pixel) {
    return pixel / 16.0;
  }

  function formatVec3(vector, centered) {
    var offset = centered ? 0.5 : 0;
    return ""
      .concat(convertToBlockPercent(vector[0]) + offset)
      .concat(", ")
      .concat(convertToBlockPercent(vector[1]))
      .concat(", ")
      .concat(convertToBlockPercent(vector[2]) + offset);
  }
})();
