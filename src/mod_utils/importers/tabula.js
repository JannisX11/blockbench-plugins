function loadTabulaModel(data) {
	Undo.initEdit({
		outliner: true,
		bitmap: true,
		uv_mode: true
	});
	let json = JSON.parse(data);
	
	let version = json.projVersion || 0;

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
			let rootGroup = new Group(
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
	let group;
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
	let cube;
	switch(version){
		case 5:
			let pos = [json.posX, json.posY, json.posZ];
			let dim = [json.dimX, json.dimY, json.dimZ];
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
function loadTabulaModel2(data) {
	Undo.initEdit({
		outliner: true,
		bitmap: true,
		uv_mode: true,
	});
	let json = JSON.parse(data);
	
	let version = json.projVersion || 0;

	if(version != 2){
		Blockbench.showMessageBox({
			title: "Warning",
			message: "You are importing an unsupported version of Tabula files, if you experience any issues, please report them and provide your model file so we can try to fix them."
		});
	}
	Project.name = json.modelName;
	Project.texture_width = json.textureWidth;
	Project.texture_height = json.textureHeight;
	let rootGroup = new Group(
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
		let group = null;
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
	let cubeObj = null;
	
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

	let cube = new Cube(cubeObj);
	if(parentGroup) cube.addTo(parentGroup);
	cube.init();
}

function loadZipToJson(isTabulaV2){
	/*Undo.initEdit({
		outliner: true,
		uv_mode: true,
		elements: Outliner.elements,
		textures: textures
	});*/	

	Blockbench.import({
		type: 'Tabula File (tbl)',
		extensions: [tbl],
		readtype: 'binary'
	}, (files) => {
		let data = files[0].content;
		let loadedZip = new JSZip().loadAsync(data);
		loadedZip.then(zip => {
			zip.file("model.json").async("string")
			.then(json => {
				if(isTabulaV2)
					loadTabulaModel2();
				else
					loadTabulaModel();
				importType.import(json);
			});
			
			if(!isTabulaV2){
				if(zip.file("texture.png"))
					zip.file("texture.png").async("base64").then(img => {
						let texture = new Texture().fromDataURL('data:image/png;base64,' + img);
					
						texture.add();
					});
			}else{
				if(zip.file("texture.png"))
					zip.file("texture.png").forEach(pr => {
						pr.async("base64").then(img => {
							let texture = new Texture().fromDataURL('data:image/png;base64,' + img);
						
							texture.add();
						});
					});
			}
		});
	});
	//Undo.finishEdit("Model Import");
}

export const importTabula = new Action({
	id: 'import_tabula',
	name: "Import Tabula Model (.tbl)",
	icon: 'flip_to_back',
	description: 'Import a Tabula Model',
	category: 'file',
	condition: () => Format.id === Formats.modded_entity.id,
	click: function (event) {
		loadZipToJson(false);
	}
});

export const importTabulaV2 = {
	act: new Action({
		id: 'import_tabula_2',
		name: "Import Tabula Model - Better but Experimental (.tbl)",
		icon: 'flip_to_back',
		description: 'Experimental - Import a Tabula Model, may produce a better result, but does not support all tabula file format versions. If you have broken results please report those issues.',
		category: 'file',
		condition: () => Format.id === Formats.modded_entity.id,
		click: function (event) {
			loadZipToJson(true);
		}
	}),
	baseFunc: loadTabulaModel2,
};