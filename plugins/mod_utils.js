/**
MIT License

Copyright (c) 2022 JTK222

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
**/

(function() {

var mappingsKey = "mod_utils.has_mappings";
var omitVoxelShapesGroup = "mod_utils.omitVoxelShapesGroup";

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

	Blockbench.import({
		type: importType.extension + ' File',
		extensions: [importType.extension],
		readtype: 'binary'
	}, (files) => {
		let data = files[0].content;
		var loadedZip = new JSZip().loadAsync(data);
		loadedZip.then(zip => {
			zip.file(importType.file).async("string")
			.then(json => {
				console.log(importType);
				importType.import(json);
			});
			
			if(importType == ImportTypeEnum.TBL){
				if(zip.file(importType.texture))
					zip.file(importType.texture).async("base64").then(img => {
						var texture = new Texture().fromDataURL('data:image/png;base64,' + img);
					
						texture.add();
					});
			}else{
				if(zip.file(importType.texture))
					zip.file(importType.texture).forEach(pr => {
						pr.async("base64").then(img => {
							var texture = new Texture().fromDataURL('data:image/png;base64,' + img);
						
							texture.add();
						});
					});
			}
		});
	});
	//Undo.finishEdit("Model Import");
}

var ImportTypeEnum = {
	TBL: {
		extension: 'tbl',
		file: 'model.json',
		texture: 'texture.png',
		import: loadTabulaModel
	},
	TBL2: {
		extension: 'tbl',
		file: 'model.json',
		texture: 'texture.png',
		import: null
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
        mojmaps: {
            createCube: "Block.box",
            combine: "VoxelShapes.join",
            booleanFunction: "IBooleanFunction",
            key: "mod_utils.selected_mappings.mojmaps",
        },
        mcp: {
            createCube: "Block.makeCuboidShape",
            combine: "VoxelShapes.combineAndSimplify",
            booleanFunction: "IBooleanFunction",
            key: "mod_utils.selected_mappings.mcp",
        },
        yarn: {
            createCube: "Block.createCuboidShape",
            combine: "VoxelShapes.combineAndSimplify",
            booleanFunction: "BooleanBiFunction",
            key: "mod_utils.selected_mappings.yarn",
        },
        parchment: {
            createCube: "Block.box",
            combine: "Shapes.join",
            booleanFunction: "BooleanOp",
            key: "mod_utils.selected_mappings.parchment",
        },
    };

/** ---------- Help ---------- */

var helpDialog = new Dialog({
	id: 'mod_utils_help_dialog',
	title: 'Help - Mod Utils',
	width: 800,
	lines: [
		`<style>
		.modUtilHelpTabs {
			position: relative;
			min-height: 400px; /* This part sucks */
			clear: both;
			margin: 25px 0;
		}
		.modUtilsHelpTab {
			float: left;
		}
		.modUtilsHelpTab label {
			background: var(--color-ui);
			padding: 10px;
			border: 1px solid #ccc;
			margin-left: -1px;
			position: relative;
			left: 1px;
		}
		.modUtilsHelpTab [type="radio"] {
			display: none;
		}
		.modUtilsContent {
			position: absolute;
			top: 28px;
			left: 0;
			background: var(--color-ui);
			right: 0;
			bottom: 0;
			padding: 20px;
			border: 1px solid #ccc;
			height: auto;
			overflow: auto;
		}
		[type="radio"]:checked ~ label {
			background: var(--color-button);
			border-bottom: 1px solid white;
			z-index: 2;
		}
		[type="radio"]:checked ~ label ~ .modUtilsContent {
			z-index: 1;
		}
	</style>
	<div class="modUtilHelpTabs">
		<div class="modUtilsHelpTab">
			<input type="radio" id="tab-1" name="tab-group-1" checked />
			<label for="tab-1">VoxelShapes</label>
			<div class="modUtilsContent">
				<p>
					In order to use the VoxelShape exporter, you first need to
					create a new Group, called "VoxelShapes". All cubes that you
					create within this group, will be added to the voxelShape trough
					the OR BooleanFunction. Additionally you can add sub groups with
					the name equaling the BooleanFunctions shown in the image
					bellow. The first cube in such a group does represent the red
					cube, all other ones will be combined with an OR BooleanFunction
					first.
				</p>
				<img
					src="https://raw.githubusercontent.com/JannisX11/blockbench-plugins/master/src/mod_utils/voxel_shape_guide.png"
					width="100%"
					height="auto"
				/>
			</div>
		</div>
		<div class="modUtilsHelpTab">
			<input type="radio" id="tab-2" name="tab-group-1" />
			<label for="tab-2">Tabula Import</label>
			<div class="modUtilsContent">
				<p>
					In order to import a Tabula Model, you need to create a new
					Modded Entity. Now the Point "Import Tabula Model (.tbl)" should
					be available in your import menu.
				</p>
			</div>
		</div>
		<div class="modUtilsHelpTab">
			<input type="radio" id="tab-3" name="tab-group-1" />
			<label for="tab-3">Techne Import</label>
			<div class="modUtilsContent">
				<p>
					Techne Import is only Available in Modded Entity Mode. A new
					Menu entry under "File > Import > Import Techne Model (.tcn)"
					should be available.
				</p>
			</div>
		</div>
	</div>`
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
				mirror_uv: mirror,
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
				rotation: [-json.rotAX, json.rotAY, -json.rotAZ]
			});
			break;
		case 2:
			group = new Group({
				name: json.name,
				origin: [parentGroup.origin[0] + json.position[0], parentGroup.origin[1] - json.position[1], parentGroup.origin[2] + json.position[2]],
				rotation: [-json.rotation[0], json.rotation[1], -json.rotation[2]],
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
			if(json.children) json.children.forEach(bone => readTblBone(bone, version, group));
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
				mirror_uv: extra.mirror,
				name: json.name,
				from: [parentGroup.origin[0] + pos[0], parentGroup.origin[1] -  pos[1] - dim[1], parentGroup.origin[2] +  pos[2]],
				to: [parentGroup.origin[0] + pos[0] + dim[0], parentGroup.origin[1] - pos[1], parentGroup.origin[2] +  pos[2] + dim[2]],
				uv_offset: [extra.texOffX + json.texOffX, extra.texOffY + json.texOffY]
			});
			break;
		default:
			cube = new Cube({
				mirror_uv: json.txMirror,
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

/** ---------- Import Tabula Model v2 --------- */
var importTabula2Obj = (function (){

	function loadTabulaModel2(data) {
		Undo.initEdit({
			outliner: true,
			bitmap: true,
			uv_mode: true,
		});
		var json = JSON.parse(data);
		
		var version = json.projVersion || 0;

		if(version != 2){
			Blockbench.showMessageBox({
				title: "Warning",
				message: "You are importing an unsuported version of Tabula files, if you experience any issues, please report them and provide your model file so we can try to fix them."
			});
		}
		Project.name = json.modelName;
		Project.texture_width = json.textureWidth;
		Project.texture_height = json.textureHeight;
		var rootGroup = new Group(
			{
				name: json.modelName,
				origin: [0, 24, 0],
				rotation: [0, 0, 0],
			}
		).addTo();
		rootGroup.init();
		json.cubes.forEach(cube => parseTbl(cube, version, rootGroup));
		
	
		Undo.finishEdit('Import Tabula Model', {
			outliner: true,
			bitmap: true,
			uv_mode: true,
		});
		Canvas.updateAll();
	}

	function parseTbl(json, version, parentGroup){
		if((json.children && json.children.length > 1) || !parentGroup){
			var group = null;
			switch(version){
				case 2:
					group = new Group({
						name: json.name,
						origin: [parentGroup.origin[0] + json.position[0], parentGroup.origin[1] - json.position[1], parentGroup.origin[2] + json.position[2]],
						rotation: [-json.rotation[0], json.rotation[1], -json.rotation[2]],
					});
					if(parentGroup) group.addTo(parentGroup);
					group.init();
					createCube(json, group, false);
					if(json.children) json.children.forEach(bone => parseTbl(bone, version, group));
					break;
				default: break;
			}
		}else{
			createCube(json, parentGroup, true);
		}
	}

	function createCube(json, parentGroup, useRotation){
		var cubeObj = null;
		
		if(!useRotation)
			cubeObj = {
				mirror_uv: json.txMirror,
				name: json.name,
				from: [parentGroup.origin[0] + json.offset[0], parentGroup.origin[1] -  json.offset[1] - json.dimensions[1], parentGroup.origin[2] +  json.offset[2]],
				to: [parentGroup.origin[0] + json.offset[0] + json.dimensions[0], parentGroup.origin[1] - json.offset[1], parentGroup.origin[2] +  json.offset[2] + json.dimensions[2]],
				uv_offset: [json.txOffset[0],  json.txOffset[1]],
				origin: [parentGroup.origin[0], parentGroup.origin[1], parentGroup.origin[2]],
			};
		else
			cubeObj = {
				mirror_uv: json.txMirror,
				name: json.name,
				from: [
					parentGroup.origin[0] + json.position[0] + json.offset[0],
					parentGroup.origin[1] - json.position[1] - json.offset[1] - json.dimensions[1],
					parentGroup.origin[2] + json.position[2] + json.offset[2]
				],
				to: [
					parentGroup.origin[0] + json.position[0] + json.offset[0] + json.dimensions[0],
					parentGroup.origin[1] - json.position[1] - json.offset[1],
					parentGroup.origin[2] + json.position[2] + json.offset[2] + json.dimensions[2]
				],
				uv_offset: [json.txOffset[0],  json.txOffset[1]],
				origin: [parentGroup.origin[0] + json.position[0], parentGroup.origin[1] - json.position[1], parentGroup.origin[2] + json.position[2]],
				rotation: [-json.rotation[0], json.rotation[1], -json.rotation[2]],
			};

		var cube = new Cube(cubeObj);
		if(parentGroup) cube.addTo(parentGroup);
		cube.init();
	}

	return {
		act: new Action({
			id: 'import_tabula_2',
			name: "Import Tabula Model - Better but Experimental (.tbl)",
			icon: 'flip_to_back',
			description: 'Experimental - Import a Tabula Model, may produce a better result, but does not support all tabula file format versions. If you have broken results please report those issues.',
			category: 'file',
			condition: () => Format.id === Formats.modded_entity.id,
			click: function (event) {
				loadZipToJson(ImportTypeEnum.TBL2);
			}
		}),
		baseFunc: loadTabulaModel2,
	};
})();

var importTabula2 = importTabula2Obj.act;
ImportTypeEnum.TBL2.import = importTabula2Obj.baseFunc;

/** ---------- Export - VoxelShape ---------- */

    var exportVoxelShapeAction = new Action({
        id: "export_voxelshape",
        name: "Export Voxelshape (1.14+ Modded Minecraft)",
        icon: "flip_to_back",
        description: "Export a VoxelShape (Block Hitbox 1.14+ Modded only)",
        category: "file",
        condition: () => Format.id === Formats.java_block.id,
        click: function (event) {
            if (event.shiftKey || !Blockbench.hasFlag(mappingsKey)) {
                resetFlags();
                exportVoxelShapeDialog.show();
            } else exportVoxelShape(undefined);
        },
    });

    var exportVoxelShapeDialog = new Dialog({
        id: "export_voxelshape",
        title: "VoxelShape Exporter",
		buttons: ["Confirm", "Cancel", "Advanced Settings"],
		confirmIndex: 0,
		cancelIndex: 1,
        form: {
            mappings: {
                label: "Mappings",
                type: "select",
                options: {
                    mojmaps: "MojMaps (Mojang's Offical Mappings)",
                    mcp: "MCP",
                    yarn: "Yarn",
                    parchment: "Parchment",
                },
                value: "mojmaps",
				description: "Select the mappings being used by your development environment",
            },
            rememberSettings: {
                label: "Remember settings",
                type: "checkbox",
                value: true,
                description:
                    "This will remember these settings and you won't be prompted again.\nTo access this menu again, hold shift while selecting the export option.",
            },
        },
        onConfirm: function (formData) {
            this.hide();

            if (formData.rememberSettings) {
                Blockbench.addFlag(mappingsKey);
                Blockbench.addFlag(Mappings[formData.mappings].key);
            }

            exportVoxelShape(Mappings[formData.mappings]);
        },
		onButton(index, event) {
			if (index !== 2) return;
			
			var advancedSettingsDialog = new Dialog({
				id: "voxelshape_advanced_settings",
				title: "Advanced Settings",
				lines: [
					`
					<style>
						h1, p {
							margin: 0%;
						}
					</style>
					<h1>WARNING</h1>
					<p>Disabling this setting can and will severly harm your model's performance. This setting should only be used for basic models and/or for prototyping. For the proper way of doing this, please look at the help section.</p>
					<br>
					`,
				],
				form: {
					onlyIncludeVoxelShapesGroup: {
						label: '"VoxelShapes" required',
						type: "checkbox",
						value: !Blockbench.hasFlag(omitVoxelShapesGroup),
						description: 'Only the cubes in the group named "VoxelShapes" will be used.\nIf not enabled, all cubes in the project will be used.',
					},
				},
				part_order: ["lines", "form", "component"],
				onConfirm(formData) {
					if (!formData.onlyIncludeVoxelShapesGroup) Blockbench.addFlag(omitVoxelShapesGroup); else Blockbench.removeFlag(omitVoxelShapesGroup);
					exportVoxelShapeDialog.show();
				},
				onCancel() {
					exportVoxelShapeDialog.show();
				}
			})
			advancedSettingsDialog.show()
		}
    });

    function exportVoxelShape(mappings) {
        if (mappings === undefined) {
            if (Blockbench.hasFlag(Mappings.mojmaps.key)) {
                mappings = Mappings.mojmaps;
            } else if (Blockbench.hasFlag(Mappings.mcp.key)) {
                mappings = Mappings.mcp;
            } else if (Blockbench.hasFlag(Mappings.yarn.key)) {
                mappings = Mappings.yarn;
            } else if (Blockbench.hasFlag(Mappings.parchment.key)) {
                mappings = Mappings.parchment;
            } else {
                exportVoxelShapeDialog.show();
                return;
            }
        }

		var output;
        if (!Blockbench.hasFlag(omitVoxelShapesGroup)) {
			var voxelShapeGroup = searchVoxelShapeGroup(Outliner.elements);
            if (voxelShapeGroup === undefined) {
                Blockbench.showMessageBox({
                    buttons: ["ok"],
                    confirm: 0,
                    title: "Error - VoxelShape Export",
                    message:
                        'You are missing the "VoxelShapes" group,\nwhich is required to export a voxel Shape.\nCheck out the Help menu for further instructions.',
                });
				resetFlags()
                return;
            }
			output = generateShape(voxelShapeGroup, mappings);
        } else {
			output = generateShape(undefined, mappings)
		}
		
		//code repurposed from CodeView plugin
		outputViewDialog = new Dialog({
			title: 'VoxelShape Output',
			id: 'output_view',
			resizable: true,
			width: 650,
			singleButton: true,
			component: {
				components: {VuePrismEditor},
				data: {
					text: ''
				},
				methods: {
					copyText() {
						navigator.clipboard.writeText(this.text);
						Blockbench.showQuickMessage(
							"Copied!",
							1000
						);
					},
					exportFile() {
						var path = Blockbench.export({
							extensions: ["java", "txt"],
							name: "VoxelShape",
							content: output,
						});
						Blockbench.showQuickMessage(
							"The VoxelShape was successfully exported!",
							1000
						);
					}
				},
				template: `
					<div>
						<vue-prism-editor id="code-view-output" v-model="text" language="java" style="height: 25em;" :line-numbers="true" />
						<button @click="copyText()" style="width: 49%; margin: 0 auto; display: inline;">Copy</button>
						<button @click="exportFile()" style="width: 49%; margin: 0 auto; display: inline;">Export</button>
					</div>
				`
			}
        });
        outputViewDialog.component.data.text = output;
		outputViewDialog.show();
    }

    function generateShape(group, mappings) {
		var elements = []
		elements = group === undefined ? Outliner.elements : group.children;
        var operation = group.name[0] === '$' ? group.name.substring(1).toUpperCase() : "OR";
        if (operation === "VOXELSHAPES" || group === undefined) {
            operation = "OR";
        }

        var method = [];

        for (var i = 0; i < elements.length; i++) {
            var child = elements[i];
            if (child instanceof Group) {
                method.push(generateShape(child, mappings));
            } else {
                method.push(
                    mappings.createCube +
                        "(" +
                        child.from[0] +
                        ", " +
                        child.from[1] +
                        ", " +
                        child.from[2] +
                        ", " +
                        child.to[0] +
                        ", " +
                        child.to[1] +
                        ", " +
                        child.to[2] +
                        ")"
                );
            }
        }

        var useStream = operation === "OR" && elements.length > 2;

        if (useStream) {
            var output = "Stream.of(\n";

            for (var i = 0; i < method.length; i++) {
                if (i == method.length - 1) {
                    output = output + method[i] + "\n";
                } else {
                    output = output + method[i] + ",\n";
                }
            }

            output =
                output +
                ").reduce((v1, v2) -> " +
                mappings.combine +
                "(v1, v2, " +
                mappings.booleanFunction +
                "." +
                operation +
                ")).get();";

            return output;
        } else {
            var output = method[method.length - 1];
            for (var i = method.length - 2; i >= 0; i--) {
                output =
                    mappings.combine +
                    "(" +
                    method[i] +
                    ", " +
                    output +
                    ", " +
                    mappings.booleanFunction +
                    "." +
                    operation +
                    ")";
            }
            return output;
        }
    }

    function searchVoxelShapeGroup(elements) {
        var rGroup;
        Group.all.forEach((group) => {
            if (group.name === "VoxelShapes") rGroup = group;
        });
        return rGroup;
    }

    function resetFlags() {
        Blockbench.removeFlag(mappingsKey);
        Blockbench.removeFlag(Mappings.mojmaps.key);
        Blockbench.removeFlag(Mappings.mcp.key);
        Blockbench.removeFlag(Mappings.yarn.key);
        Blockbench.removeFlag(Mappings.parchment.key);
        Blockbench.removeFlag(omitVoxelShapesGroup);
    }

// var helpMenu;

Plugin.register('mod_utils', {
	title: 'Mod Utils',
	author: 'JTK222 (Maintainer), Wither (For the original Techne importer), Ocraftyone (VoxelShape improvements)',
	icon: 'fa-cubes',
	description: 'Allows importing Tabula files, and exporting VoxelShapes',
    tags: ["Minecraft: Java Edition"],
	version: '1.7.1',
	variant: 'desktop',

	onload() {
		if(isValidVersion){

			// helpMenu = new BarMenu('help', []);
			// helpMenu.label.textContent = 'Help';
			// MenuBar.update();
			
			MenuBar.addAction(exportVoxelShapeAction, 'file.export');
			MenuBar.addAction(importTabula2, 'file.import');
			MenuBar.addAction(importTabula, 'file.import');
			MenuBar.addAction(importTechne, 'file.import');
			MenuBar.addAction(modUtilsHelp, 'help');
		}
	},
	onunload() {
		if(isValidVersion){
			exportVoxelShapeAction.delete();
			importTabula.delete();
			importTabula2.delete();
			importTechne.delete();
			modUtilsHelp.delete();

			// helpMenu.hide();
		}
	},
	oninstall(){},
	onuninstall() {}
});

})();