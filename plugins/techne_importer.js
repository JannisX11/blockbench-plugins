var plugin_data = {
    id: "techne_importer",
    title: "Techne Importer",
    icon: "present_to_all",
    author: "Wither & JTK222 (Maintainer)",
    description: "Imports files made with the Techne modeller.",
	about: "In order to import a file from Techne, you need to unzip it. (Change the file extension to '.zip' when it doesn't work directly.) You can now import the '.xml', the texture needs to be imported seperatly.", 
    version: "1.0",
    variant: "both"
}

MenuBar.addAction(new Action({
    id: "import_techne",
    name: "Import Techne File",
    category: "file",
	icon: "present_to_all",
    click: function (event) {
        Blockbench.import({
            extensions: ["xml"],
            type: "Techne Model"
        }, function (files) {
            loadTechneModel(files[0].content, files[0].path)
        })
    }
}), "file.import");

function loadTechneModel(model, path) {
    entityMode.join()

    reader = new DOMParser();
    var xml = reader.parseFromString(model, "text/xml");

	var model = xml.getElementsByTagName("Model")[0];
	
	name = xml.getElementsByTagName("ProjectName")[0].childNodes[0].nodeValue;
    textureSizes = xml.getElementsByTagName("TextureSize")[0].childNodes[0].nodeValue;

    Project.name = name;
    Project.texture_width = textureSizes.slice(0, textureSizes.indexOf(","));
    Project.texture_height = textureSizes.slice(textureSizes.indexOf(",") + 1, textureSizes.length);
	
	var shapes = model.getElementsByTagName("Geometry")[0].getElementsByTagName("Shape");
	var rootGroup = new Group("root").addTo()
	
	for(var i = 0; i < shapes.length; i++){
	  	var shape = shapes[i];
		
		offset = JSON.parse("[" + shape.getElementsByTagName("Offset")[0].childNodes[0].nodeValue + "]");
		position = JSON.parse("[" + shape.getElementsByTagName("Position")[0].childNodes[0].nodeValue + "]");
		position[1] = 24 - position[1];
		rotation = JSON.parse("[" + shape.getElementsByTagName("Rotation")[0].childNodes[0].nodeValue + "]");
		size = JSON.parse("[" + shape.getElementsByTagName("Size")[0].childNodes[0].nodeValue + "]");
		uv = JSON.parse("[" + shape.getElementsByTagName("TextureOffset")[0].childNodes[0].nodeValue + "]");
		mirror = shape.getElementsByTagName("TextureOffset")[0].childNodes[0].nodeValue === "True";
		
		var group = new Group(
			{
				name: shape.getAttribute("name"),
				origin: [position[0], position[1], position[2]],
				rotation: [-rotation[0], rotation[1], rotation[2]],
			}
		).addTo(rootGroup);
		
        var cube = new Cube(
			{
				shade: mirror,
				name: shape.getAttribute("name"),
				from: [position[0] + offset[0], position[1] - size[1] - offset[1], position[2] + offset[2]],
				to: [position[0] + size[0] + offset[0], position[1] - offset[1], position[2] + offset[2] + size[2]],
				uv_offset: [uv[0],  uv[1]],
			}
		).addTo(group);
        Blockbench.elements.push(cube);
   }

    Canvas.updateAll();
}

onUninstall = function () {
    MenuBar.removeAction("file.import.import_techne")
}