var AxisEnum = {
	X: 0,
	Y: 1,
	Z: 2,
	size: 3,
	properties: {
		0: {name: "X-Axis", value: 0, code: "x"},
		1: {name: "Y-Axis", value: 1, code: "y"},
		2: {name: "Z-Axis", value: 2, code: "z"},
	}
}

var plugin_data = {
    id: "mod_utils",
    title: "Mod Utils",
    icon: "present_to_all",
    author: "JTK222 (Maintainer) & Wither (For the Techne importer)",
    description: "A few handy utilities for Modders",
	about: `
	Usage guides can be found here: https://dark-roleplay.net/html/other/blockbench/mod_utils/mod_utils.php<br/>
	(Sorry, making this link useable closes BB)
	`, 
    version: "1.3",
    variant: "both"
}

/* --- Techne Importer ---*/
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
	
/* --- Tabula Importer ---*/
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

/* --- VoxelShape Exporter ---*/
	var VoxelShapeMethods = {
		forge: {
			createCube: "Block.makeCuboidShape",
			combine: "VoxelShapes.combineAndSimplify",
			booleanFunction: "IBooleanFunction",
		},
		fabric: {
			createCube: "Block.createCuboidShape",
			combine: "VoxelShapes.combineAndSimplify",
			booleanFunction: "BooleanBiFunction",
		}
	}

	MenuBar.addAction(new Action({
		id: "export_voxelshape",
		name: "Export Voxelshape",
		category: "file",
		icon: "layers",
		click: function (event) {
			var mappings_selector = new Dialog({
				title: 'Generate VoxelShapes',
				id: 'slice_settings',
				lines: ['Use Fabric Mappings: <input value="false" type="checkbox" id="useFabricMappings" style="float:right;" > <br/><br/>'],
				draggable: true, 
				onConfirm() {
					mappings_selector.hide();
					generateVoxelShape(Boolean(document.getElementById("useFabricMappings").checked));
				}
			});
			mappings_selector.show();
		}
	}), "file.export");

	function generateVoxelShape(useFabricMappings){
		var voxelShapeGroup = searchVoxelShapeGroup(TreeElements);
		if(voxelShapeGroup === undefined) return;
		
		var mappings;
		console.log(useFabricMappings);
		if(useFabricMappings == true) mappings = VoxelShapeMethods.fabric;
		else mappings = VoxelShapeMethods.forge;

		var output = generateShape(voxelShapeGroup, mappings);
		
		clipboard.writeText(output, "selection");
			Blockbench.showQuickMessage('The output was successfully saved to your clipboard.');
	}

	function generateShape(group, mappings){
		var operation = group.name.toUpperCase();
		if(operation === "VOXELSHAPES"){
			operation = "OR";
		}
		
		var method = [];
		
		for(var i = 0; i < group.children.length; i++){
			var child = group.children[i];
			if(child instanceof Group){
				method.push(generateShape(child, mappings));
			}else{
				method.push(mappings.createCube + "(" + child.from[0] + ", " + child.from[1] + ", " + child.from[2] + ", " + child.to[0] + ", " + child.to[1] + ", " + child.to[2] + ")");
			}
		}
		
		
		var useStream = operation === "OR" && group.children.length > 2;
		
		if(useStream){
			var output = "Stream.of(\n";
			
			for(var i = 0; i < method.length; i++){
				if(i == method.length -1){
					output = output + method[i] + "\n";
				}else{
					output = output + method[i] + ",\n";
				}
			}
			
			output = output + ").reduce((v1, v2) -> {return " + mappings.combine + "(v1, v2, " + mappings.booleanFunction + "." + operation + ");});";
			
			return output;
		}else{
			var output = method[method.length - 1];
			for(var i = method.length - 2; i >= 0; i--){
				output = mappings.combine + "(" + method[i] + ", " + output+ ", " + mappings.booleanFunction + "." + operation + ")";
			}
			return output;
		}
	}

	function searchVoxelShapeGroup(elements){
		for(var i = 0; i < elements.length; i++){
			if(elements[i] instanceof Group){
				var group = elements[i];
				if(group.name === "VoxelShapes"){
					return group;
				}
			}
		}
	}

/* --- Slicer --- */
/*
MenuBar.addAction(new Action({
    id: "slice_model",
    name: "Slice Model",
    category: "edit",
	icon: "present_to_all",
    click: function (event) {
		slice_window();
	}
}), "edit");

function slice_window() {
	var axisSelection = `Select axis for slice operation: 
				<select style="color:var(--color-text); float:right;" id="axis">`
				
	for(var i = 0; i < AxisEnum.size; i++){
		axisSelection = axisSelection + `<option value="` + AxisEnum.properties[i].value +  `">&nbsp;` + AxisEnum.properties[i].name +  `&nbsp;</option>`;
	}
	
	axisSelection = axisSelection + `</select><br/>`;
	
    var slice_settings = new Dialog({
        title: 'Slice Settings', id: 'shape_selector', lines: [axisSelection, 'Value to cut at: <input value=16 min=-16 max=32 type="number" id="value"style="background-color:var(--color-back);  float:right;" > <br/>'], draggable: true, 
		onConfirm() {
            slice_settings.hide();
			performCut(parseInt(document.getElementById("axis").value), parseFloat(document.getElementById("value").value));
        }
    });
    slice_settings.show();
}

function performCut(axis, value){
	console.log(axis);
	console.log(value);
	
	var elements = Blockbench.elements;
	if (false) {
		elements = selected;
	}
	
	aspects = {"cubes": elements};
	//Undo.initEdit(aspects);
	
	var size = elements.length;
	for(var i=0; i < size; i++) {
		var cube = elements[i];
		var needsSlice = cube.from[axis] < value && cube.to[axis] > value;
		
		console.log(needsSlice);
		
		if(needsSlice){
			var from2;
			var to1;
			
			var newCube = new Cube(cube);
			
			cube.to[axis] = value;
			newCube.from[axis] = value;

			newCube.init();
			
			//Canvas.adaptObjectPosition(cube);
			//Canvas.adaptObjectPosition(newCube);
		}
	}
			
	Canvas.updateAll();
}
*/

onUninstall = function () {
    MenuBar.removeAction("file.import.import_techne")
    MenuBar.removeAction("file.import.import_tabula")
    MenuBar.removeAction("file.export.export_voxelshape")
    //MenuBar.removeAction("edit.slice_model")
}