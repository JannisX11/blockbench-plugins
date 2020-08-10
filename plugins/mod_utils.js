(function() {

var mappingsKey = "mod_utils.has_mappings";
var selectedMappingsKey = "mod_utils.selected_mappings";

function isValidVersion(){
	var versions = Blockbench.version.split(".");
	return versions[0] >= 3 && versions [1] >= 1;
}

function loadZipToJson(importType){
	/*Undo.initEdit({
		outliner: true,
		uv_mode: true,
		elements: Outliner.elements,
		textures: textures
	});*/
	ElecDialogs.showOpenDialog(
		currentwindow,
		{
			title: '',
			dontAddToRecent: true,
			filters: [{
				name: '',
				extensions: [importType.extension]
			}]
		},
		files => {
			if (!files) return;
			fs.readFile(files[0], (err, data) => {
					if (err) return;
					var loadedZip = new JSZip().loadAsync(data);
					loadedZip.then(zip => {
						zip.file(importType.file).async("string")
						.then(json => {
							importType.import(json);
						});
						
						if(importType == ImportTypeEnum.TBL){
							var imgFile = zip.file(importType.texture).async("base64").then(img => {
								var texture = new Texture().fromDataURL('data:image/png;base64,' + img);
							
								texture.add();
							});
						}else{
							var imgFile = zip.file(importType.texture).forEach(pr => {
								pr.async("base64").then(img => {
									var texture = new Texture().fromDataURL('data:image/png;base64,' + img);
								
									texture.add();
								});
							});
						}
					});
			});
		}
	);
	//Undo.finishEdit("Model Import");
}

var ImportTypeEnum = {
	TBL: {
		extension: 'tbl',
		file: 'model.json',
		texture: 'texture.png',
		import: loadTabulaModel
	},
	TCN: {
		extension: 'tcn',
		file: 'model.xml',
		texture: /\.png/,
		import: loadTechneModel
	}
}

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

var Mappings = {
	mcp: {
		createCube: "Block.makeCuboidShape",
		combine: "VoxelShapes.combineAndSimplify",
		booleanFunction: "IBooleanFunction",
	},
	yarn: {
		createCube: "Block.createCuboidShape",
		combine: "VoxelShapes.combineAndSimplify",
		booleanFunction: "BooleanBiFunction",
	}
}


/** ---------- Help ---------- */

var helpDialog = new Dialog({
	id: 'mod_utils_help_dialog',
	title: 'Help - Mod Utils',
	width: 800,
	lines: [
		'<style> .modUtilHelpTabs { position: relative; min-height: 200px; /* This part sucks */ clear: both; margin: 25px 0; } .modUtilsHelpTab { float: left; } .modUtilsHelpTab label { background: var(--color-ui); padding: 10px; border: 1px solid #ccc; margin-left: -1px; position: relative; left: 1px; } .modUtilsHelpTab [type=radio] { display: none; } .modUtilsContent { position: absolute; top: 28px; left: 0; background: var(--color-ui); right: 0; bottom: 0; padding: 20px; border: 1px solid #ccc; height: auto; overflow: auto; } [type=radio]:checked ~ label { background: var(--color-button); border-bottom: 1px solid white; z-index: 2; } [type=radio]:checked ~ label ~ .modUtilsContent { z-index: 1; } </style> <div class="modUtilHelpTabs"> <div class="modUtilsHelpTab"> <input type="radio" id="tab-1" name="tab-group-1" checked> <label for="tab-1">VoxelShapes</label> <div class="modUtilsContent"> <p> In order to use the VoxelShape exporter, you first need to create a new Group, called "VoxelShapes". All cubes that you create within this group, will be added to the voxelShape trough the OR BooleanFunction. Additionally you can add sub groups with the name equaling the BooleanFunctions shown in the image bellow. The first cube in such a group does represent the red cube, all other ones will be combined with an OR BooleanFunction first. </p> <img src="https://dark-roleplay.net/files/VoxelShapeGuideCropped.png" width="100%" height="auto" /> </div> </div> <div class="modUtilsHelpTab"> <input type="radio" id="tab-2" name="tab-group-1"> <label for="tab-2">Tabula Import</label> <div class="modUtilsContent"> <p>In order to import a Tabula Model, you need to create a new Modded Entity. Now the Point "Import Tabula Model (.tbl)" should be available in your import menu.</p> </div> </div> <div class="modUtilsHelpTab"> <input type="radio" id="tab-3" name="tab-group-1"> <label for="tab-3">Techne Import</label> <div class="modUtilsContent"> <p>Techne Import is only Available in Modded Entity Mode. A new Menu entry under "File > Import > Import Techne Model (.tcn)" should be available.</p> </div> </div> </div>'
	],
	singleButton: true
});

var modUtilsHelp = new Action({
	id: 'mod_utils.help',
	name: "Mod Utils",
	icon: 'help',
	description: 'Opens a Small Help window',
	category: 'help',
	condition: () => true,
	click: function (event) {
		helpDialog.show();
	}
});

/** ---------- Import - Techne ---------- */


var importTechne = new Action({
	id: 'import_techne',
	name: "Import Techne Model (.tcn)",
	icon: 'flip_to_back',
	description: 'Import a Techne Model',
	category: 'file',
	condition: () => Format.id === Formats.modded_entity.id,
	click: function (event) {
		loadZipToJson(ImportTypeEnum.TCN);
	}
});

function loadTechneModel(data) {

	reader = new DOMParser();
	var xml = reader.parseFromString(data, "text/xml");

	var model = xml.getElementsByTagName("Model")[0];
	
	name = xml.getElementsByTagName("ProjectName")[0].childNodes[0].nodeValue;
	textureSizes = xml.getElementsByTagName("TextureSize")[0].childNodes[0].nodeValue;

	Project.name = name;
	Project.texture_width = textureSizes.slice(0, textureSizes.indexOf(","));
	Project.texture_height = textureSizes.slice(textureSizes.indexOf(",") + 1, textureSizes.length);
	
	var shapes = model.getElementsByTagName("Geometry")[0].getElementsByTagName("Shape");
	var rootGroup = new Group("root").addTo();
	rootGroup.init();

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
		group.init();
		
		var cube = new Cube(
			{
				shade: mirror,
				name: shape.getAttribute("name"),
				from: [position[0] + offset[0], position[1] - size[1] - offset[1], position[2] + offset[2]],
				to: [position[0] + size[0] + offset[0], position[1] - offset[1], position[2] + offset[2] + size[2]],
				uv_offset: [uv[0],  uv[1]],
			}
		).addTo(group);
		cube.init();
	}
	Canvas.updateAll()
}

/** ---------- Import - Tabula ---------- */

var importTabula = new Action({
	id: 'import_tabula',
	name: "Import Tabula Model (.tbl)",
	icon: 'flip_to_back',
	description: 'Import a Tabula Model',
	category: 'file',
	condition: () => Format.id === Formats.modded_entity.id,
	click: function (event) {
		loadZipToJson(ImportTypeEnum.TBL);
	}
});

function loadTabulaModel(data) {
	Undo.initEdit({
		outliner: true,
		bitmap: true,
		uv_mode: true
	});
	var json = JSON.parse(data);
	
	var version = json.projVersion || 0;

	switch(version){
		case 5:
			Project.name = json.modelName;
			Project.texture_width = json.texWidth;
			Project.texture_height = json.texHeight;
			json.parts.forEach(part => readTblBone(part, version, null));
			Blockbench.showMessageBox({
				title: "Warning",
				message: "You imported a version 5 Tabula Model.\nThis Format has some functions which are not supported by Blockbench, for this reason some things might have broken on import."
			});
			break;
		default:
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
			rootGroup.init();
			json.cubes.forEach(cube => readTblBone(cube, version, rootGroup));
			break;
	}
	

	Undo.finishEdit('Import Tabula Model');
	Canvas.updateAll();
}

function readTblBone(json, version, parentGroup){
	var group;
	switch(version){
		case 5:
			group = new Group({
				name: json.name,
				origin: [(parentGroup == null ? 0 : parentGroup.origin[0]) + json.rotPX, (parentGroup == null ?  + 24 : parentGroup.origin[1]) - json.rotPY, (parentGroup == null ? 0 : parentGroup.origin[2]) + json.rotPZ],
				rotation: [-json.rotAX, json.rotAY, json.rotAZ]
			});
			break;
		default:
			group = new Group({
				name: json.name,
				origin: [parentGroup.origin[0] + json.position[0], parentGroup.origin[1] - json.position[1], parentGroup.origin[2] + json.position[2]],
				rotation: [-json.rotation[0], json.rotation[1], json.rotation[2]],
			});
			break;
	}
	if(parentGroup) group.addTo(parentGroup);
	group.init();

	switch(version){
		case 5:
			if(json.children) json.children.forEach(bone => readTblBone(bone, version, group));
			if(json.boxes) json.boxes.forEach(cube => readTblCube(cube, version, group, json));
			break;
		default:
			if(json.children) json.children.forEach(bone => readTblBone(cubebone, version, group));
			readTblCube(json, version, group);
			break;
	}
}

function readTblCube(json, version, parentGroup, extra){
	var cube;
	switch(version){
		case 5:
			var pos = [json.posX, json.posY, json.posZ];
			var dim = [json.dimX, json.dimY, json.dimZ];
			cube = new Cube({
				shade: json.mirror,
				name: json.name,
				from: [parentGroup.origin[0] + pos[0], parentGroup.origin[1] -  pos[1] - dim[1], parentGroup.origin[2] +  pos[2]],
				to: [parentGroup.origin[0] + pos[0] + dim[0], parentGroup.origin[1] - pos[1], parentGroup.origin[2] +  pos[2] + dim[2]],
				uv_offset: [extra.texOffX + json.texOffX, extra.texOffY + json.texOffY]
			});
			break;
		default:
			cube = new Cube({
				shade: json.txMirror,
				name: json.name,
				from: [parentGroup.origin[0] + json.offset[0], parentGroup.origin[1] -  json.offset[1] - json.dimensions[1], parentGroup.origin[2] +  json.offset[2]],
				to: [parentGroup.origin[0] + json.offset[0] + json.dimensions[0], parentGroup.origin[1] - json.offset[1], parentGroup.origin[2] +  json.offset[2] + json.dimensions[2]],
				uv_offset: [json.txOffset[0],  json.txOffset[1]],
			});
			break;
	}
	if(parentGroup) cube.addTo(parentGroup);
	cube.init();
}

/** ---------- Export - VoxelShape ---------- */

var exportVoxelShapeAction = new Action({
	id: 'export_voxelshape',
	name: 'Export Voxelshape (1.14+ Modded Minecraft)',
	icon: 'flip_to_back',
	description: 'Export a VoxelShape (Block Hitbox 1.14+ Modded only)',
	category: 'file',
	condition: () => Format.id === Formats.java_block.id,
	click: function (event) {
		if(!Blockbench.hasFlag(mappingsKey))
			exportVoxelShapeDialog.show();
		else
			exportVoxelShape();
	}
});

var exportVoxelShapeDialog = new Dialog({
	id: 'export_voxelshape',
	title: 'VoxelShape Exporter',
	form: {
			mappings: {label: 'Mappings', type: 'select', options: {
				mcp: 'MCP',
				yarn: 'Yarn'
			}, default: 'mcp'}
	},
	onConfirm: function(formData) {
		this.hide();
		Blockbench.addFlag(mappingsKey);
		if(mappings === 'yarn')
			Blockbench.addFlag(selectedMappingsKey);
		
		exportVoxelShape();
	}
});

function exportVoxelShape(){
	var mappings = !Blockbench.hasFlag(selectedMappingsKey) ? Mappings.mcp : Mappings.yarn;
	
	var voxelShapeGroup = searchVoxelShapeGroup(Outliner.elements);

	if(voxelShapeGroup === undefined) return;

	var output = generateShape(voxelShapeGroup, mappings);
	
	var path = Blockbench.export({
		extensions: ['java', 'txt'],
		name: 'VoxelShape',
		content: output,
	})
	Blockbench.showQuickMessage('The VoxelShape was successfully exportet!', 1000);
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
	var rGroup;
	Group.all.forEach(
		group => {
			if(group.name === "VoxelShapes")
			rGroup = group;
		}
	)
	return rGroup;
}

// var helpMenu;

Plugin.register('mod_utils', {
	title: 'Mod Utils',
	author: 'JTK222',
	icon: 'fa-cubes',
	description: '',
	version: '1.5',
	variant: 'desktop',

	onload() {
		if(isValidVersion){

			// helpMenu = new BarMenu('help', []);
			// helpMenu.label.textContent = 'Help';
			// MenuBar.update();
			
			MenuBar.addAction(exportVoxelShapeAction, 'file.export');
			MenuBar.addAction(importTabula, 'file.import');
			MenuBar.addAction(importTechne, 'file.import');
			MenuBar.addAction(modUtilsHelp, 'help');
		}
	},
	onunload() {
		if(isValidVersion){
			exportVoxelShapeAction.delete();
			importTabula.delete();
			importTechne.delete();
			modUtilsHelp.delete();

			// helpMenu.hide();
		}
	},
	oninstall(){},
	onuninstall() {}
});

})();