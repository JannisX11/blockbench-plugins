(function() {
var type;
var bipedScale;
var bipedParent = {bipedHead:'head', bipedBody:'chest', bipedRightArm:'right_arm', bipedLeftArm:'left_arm', bipedRightLeg:'right_leg', bipedLeftLeg:'left_leg'};

var threeCoreCodec = new Codec('threecore_model', {
	name: 'ThreeCore Model',
	extension: 'json',
	remember: false,
	compile(options) {
		var model = {
			type: type,
			scale: bipedScale,
			texture_width: Project.texture_width,
			texture_height: Project.texture_height
		};
		
		var cubes = [];
		Outliner.root.forEach(obj => {
			if (obj.type === 'cube') {
				cubes.push(createCube(obj));
			} else {
				var cube = recurvBBGroup(obj, createCubeFromGroup(obj, true));
				
				// if type is biped, and cube's name is a biped part
				if (type === 'threecore:biped' && bipedParent.hasOwnProperty(cube.name)) {
					if (cube.hasOwnProperty('children')) {
						// go through the biped part's children and add parent property
						cube.children.forEach(childCube => {
							childCube.parent = bipedParent[cube.name];
							cubes.push(childCube);
						});
					}
				} else {
					cubes.push(cube);
				}
			}
		});
		
		model.cubes = cubes;
		return autoStringify(model);
	}
});

var dialog = new Dialog({
	id: 'threecore_dialog',
	title: 'ThreeCore JSON Model',
	form: {
		modelType: {
			label: 'Model Type',
			type: 'select',
			options: {
				threecore_default: 'threecore:default',
				threecore_biped: 'threecore:biped'
			}
		},
		bipedScale: {
			label: 'Biped Scale',
			type: 'number',
			value: 0.00,
			min: 0,
			max: 1,
			step: 0.1
		}
	},
	lines: [
		'<p>When you are done exporting your model, you need to put it in your addonpack, the path should be: <i>assets\/&ltnamespace&gt\/models\/entity\/</i></p>'
	],
	onConfirm: function (formData) {
		this.hide();
		bipedScale = formData.bipedScale;
		type = formData.modelType.replace('_', ':');
		threeCoreCodec.export();
	}
});

var filterMenuItem = {
	id: 'filter_threecore',
	name: 'ThreeCore Exporter',
	icon: 'looks_3',
	condition: () => Format.id === 'modded_entity',
	children: [
		{
			name: 'Generate Steve model',
			icon: 'icon-player',
			click: function () {
				generateBipedModel(false);
			}
		},
		{
			name: 'Generate Alex model',
			icon: 'icon-player',
			click: function () {
				generateBipedModel(true);
			}
		}
	]
};
var exportAction;

Plugin.register('threecore_exporter', {
	title: 'ThreeCore Exporter',
	author: 'Lucraft, Spyeedy',
	icon: 'looks_3',
	description: 'Let\'s you export your models in the json entity model format for the ThreeCore mod!',
	version: '1.0.1',
	variant: 'both',
	min_version: '3.3.0',
	onload() {
		exportAction = new Action({
			id: 'export_threecore',
			name: 'Export ThreeCore entity model',
			icon: 'archive',
			description: 'Let\'s you export your models in the json entity model format for the ThreeCore mod!',
			category: 'file',
			condition: () => Format.id === 'modded_entity',
			click: function () {
				dialog.show();
			}
		});
		
		MenuBar.addAction(exportAction, 'file.export');
		MenuBar.addAction(filterMenuItem, 'filter');
	},
	onunload() {
		exportAction.delete();
		MenuBar.removeAction('filter.filter_threecore');
		console.clear();
	}
});

// --- Util ---
function dummyCube() {
	return {
		name: "",
		scale: 0.0,
		mirror: false,
		texture_offset: [0, 0],
		offset: [0.0, 0.0, 0.0],
		rotation_point: [0.0, 0.0, 0.0],
		size: [0, 0, 0],
		rotation: [0.0, 0.0, 0.0]
	}
}

function createCube(obj) {	
	var cube = dummyCube();
	cube.name = obj.name;
	cube.scale = obj.inflate;
	cube.mirror = obj.mirror_uv;
	cube.texture_offset[0] = Math.floor(obj.uv_offset[0]);
	cube.texture_offset[1] = Math.floor(obj.uv_offset[1]);
	cube.offset[0] = -obj.to[0];
	cube.offset[1] = 24-obj.to[1];
	cube.offset[2] = obj.from[2];
	cube.size[0] = obj.size(0, true);
	cube.size[1] = obj.size(1, true);
	cube.size[2] = obj.size(2, true);
	
	return cube;
}

function createCubeFromGroup(group, isRoot) {
	var cube = dummyCube();
	
	cube.name = group.name;
	cube.rotation_point[0] = -group.origin[0];
	cube.rotation_point[1] = -group.origin[1] + (isRoot ? 24 : 0);
	cube.rotation_point[2] = group.origin[2];
	cube.rotation[0] = -group.rotation[0];
	cube.rotation[1] = -group.rotation[1];
	cube.rotation[2] = group.rotation[2];
	
	return cube;
}

function combineCubeIntoGroup(groupObj, groupCube, cube, cubeObj) {
	groupCube.scale = cube.scale;
	groupCube.mirror = cube.mirror;
	groupCube.texture_offset = cube.texture_offset;
	groupCube.size = cube.size;
	cube.offset[0] += groupObj.origin[0];
	cube.offset[1] = (-cubeObj.from[1] - cubeObj.size(1, true) + groupObj.origin[1]);
	cube.offset[2] -= groupCube.rotation_point[2];
	groupCube.offset = cube.offset;
	
	return groupCube;
}

function parentCubeToGroup(groupCube, cube) {
	cube.offset[0] -= groupCube.rotation_point[0];
	cube.offset[1] -= groupCube.rotation_point[1];
	cube.offset[2] -= groupCube.rotation_point[2];
	
	return cube;
}

function parentGroup2ToGroup1(parentObj, group) {
	group.rotation_point[0] += parentObj.origin[0];
	group.rotation_point[1] += parentObj.origin[1];
	group.rotation_point[2] -= parentObj.origin[2];
	return group;
}

// obj and cube are always of groups
function recurvBBGroup(obj, cube) {
	if (obj.children.length > 0) {
				
		obj.children.forEach(childObj => {
			if (childObj.type !== 'cube') {
				var childGroupCube = parentGroup2ToGroup1(obj, createCubeFromGroup(childObj));
				childGroupCube = recurvBBGroup(childObj, childGroupCube);
					
				if (cube.children == null)
					cube.children = []
				
				cube.children.push(childGroupCube);
			} else {
				var childCube = createCube(childObj);
				
				if (childCube.name === cube.name) {
					cube = combineCubeIntoGroup(obj, cube, childCube, childObj);
				} else {
					if (cube.children == null)
						cube.children = []
					
					childCube = parentCubeToGroup(cube, childCube);
					cube.children.push(childCube);
				}
			}
		});
	}
	return cube;
}

function generateBipedModel(isAlex) {
	Blockbench.showMessageBox({
		title: 'Warning!',
		message: 'Do not change or delete any auto-generated parts\' name. If you chose "threecore:biped" as the type during export, the auto-generated part will be ignored as a parent for it\'s children parts'
	});
	
	Undo.initEdit({outliner:true, elements:Outliner.elements});
	
	var group;
	
	// Player Head, size 8, 8, 8
	group = new Group({
		name: 'bipedHead',
		origin: [0, 24, 0]
	}).init();
	new Cube({
		name: 'bipedHead',
		from: [-4, 24, -4],
		to: [4, 32, 4],
		uv_offset: [0, 0]
	}).addTo(group).init();
	group.openUp();
	
	// Player Body, size 8, 12, 4
	group = new Group({
		name: 'bipedBody',
		origin: [0, 24, 0]
	}).init();
	new Cube({
		name: 'bipedBody',
		from: [-4, 12, -2],
		to: [4, 24, 2],
		uv_offset: [16, 16]
	}).addTo(group).init();
	group.openUp();
	
	const armOriginY = isAlex ? 21.5 : 22;
	const armOffY = isAlex ? 11.5 : 12;
	// Player Right Arm, size 4 or 3, 12, 4
	group = new Group({
		name: 'bipedRightArm',
		origin: [5, armOriginY, 0]
	}).init();
	new Cube({
		name: 'bipedRightArm',
		from: [4, armOffY, -2],
		to: [isAlex? 7 : 8, armOffY+12, 2],
		uv_offset: [40, 16]
	}).addTo(group).init();
	group.openUp();
	
	// Player Left Arm, size 4 or 3, 12, 4
	group = new Group({
		name: 'bipedLeftArm',
		origin: [-5, armOriginY, 0]
	}).init();
	new Cube({
		name: 'bipedLeftArm',
		from: [isAlex ? -7 : -8, armOffY, -2],
		to: [-4, armOffY+12, 2],
		uv_offset: [32, 48]
	}).addTo(group).init();
	group.openUp();
	
	// Player Right Leg, size 4, 12, 4
	group = new Group({
		name: 'bipedRightLeg',
		origin: [1.9, 12, 0]
	}).init();
	new Cube({
		name: 'bipedRightLeg',
		from: [-0.1, 0, -2],
		to: [3.9, 12, 2],
		uv_offset: [0, 16]
	}).addTo(group).init();
	group.openUp();
	
	// Player Left Leg, size 4, 12, 4
	group = new Group({
		name: 'bipedLeftLeg',
		origin: [-1.9, 12, 0]
	}).init();
	new Cube({
		name: 'bipedLeftLeg',
		from: [-3.9, 0, -2],
		to: [0.1, 12, 2],
		uv_offset: [16, 48]
	}).addTo(group).init();
	group.openUp();
	
	Canvas.updateAll()
	
	Undo.finishEdit('generate threecore biped model');
}

})()