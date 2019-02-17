var plugin_data = {
    id: "mod_model_format_importer",
    title: "Mod Model Format Importer",
    icon: "present_to_all",
    author: "Wither & JTK222 (Maintainer)",
    description: "Imports files made with the Techne or Tabula modeller.",
	about: "First you need to change the file extension to .zip, this step is the same for .tcn and .tbl files. Now you can unzip those into another folder. For .tcn you can import the .xml file. And for .tbl you can import the contained .json file. You need to import and apply the textures manually.", 
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

MenuBar.addAction(new Action({
    id: "import_tabula",
    name: "Import Tabula File",
    category: "file",
	icon: "present_to_all",
    click: function (event) {
        Blockbench.import({
            extensions: ["json"],
            type: "Tabula Model"
        }, function (files) {
            loadTabulaModel(files[0].content, files[0].path)
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
	var rootGroup = new Group("root").addTo();
	
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

function loadTabulaModel(model, path) {
    entityMode.join()

	var json = $.getJSON(path, function(json) {
		console.log(json); // this will show the info it in firebug console
		
		Project.name = json.modelName;
		Project.texture_width = json.textureWidth;
		Project.texture_height = json.textureHeight;
		
		
		var rootGroup = new Group(
			{
				name: "root",
				origin: [0, 24, 0],
				rotation: [0, 0, 0],
			}
			).addTo();
		
		loadCubes(json.cubes, rootGroup);


		Canvas.updateAll();
	});
}

function loadCubes(array, parentGroup){
	var i;
	for (i = 0; i < array.length; i++) {
		var obj = array[i];
		if(typeof obj === "undefined") return;
		console.log(obj);
	
		var group = new Group(
			{
				name: obj.name,
				origin: [parentGroup.origin[0] + obj.position[0], parentGroup.origin[1] - obj.position[1], parentGroup.origin[2] + obj.position[2]],
				rotation: [-obj.rotation[0], obj.rotation[1], obj.rotation[2]],
			}
		).addTo(parentGroup);
		
		var cube = new Cube(
			{
				shade: obj.txMirror,
				name: obj.name,
				from: [group.origin[0] + obj.offset[0], group.origin[1] -  obj.offset[1] - obj.dimensions[1], group.origin[2] +  obj.offset[2]],
				to: [group.origin[0] + obj.offset[0] + obj.dimensions[0], group.origin[1] - obj.offset[1], group.origin[2] +  obj.offset[2] + obj.dimensions[2]],
				uv_offset: [obj.txOffset[0],  obj.txOffset[1]],
			}
		).addTo(group);
		Blockbench.elements.push(cube);
		
		if(obj.hasOwnProperty("children")){
			var children = obj.children
			loadCubes(children, group);
		}
	};
}

onUninstall = function () {
    MenuBar.removeAction("file.import.import_techne")
    MenuBar.removeAction("file.import.import_tabula")
}