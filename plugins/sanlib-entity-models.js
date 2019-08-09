var plugin_data = {
	id: 'sanlib_entity_models',
	title: "SanLib Entity Model Import & Export",
	icon: "domain",
	author: "SanAndreasP",
	description: "Import and export entity models used by SanLib",
	variant: "both",
	min_version: "3.0.0",
	__loaded: false,
    onload() {
		if( this.__loaded ) return;
		
		this.__loaded = true;
		MenuBar.addAction(new Action({
			id: "sanlib_entity",
			name: "Open SanLib Entity Model",
			icon: "brightness_7",
			category: "file",
			click: function(event) {
				Blockbench.import({
					extensions: ["json"],
					type: "SanLib Entity Model"
				}, function(files) {
					loadFile(files[0].content, files[0].path)
				});
			}
		}), "file.import");

		MenuBar.addAction(new Action({
			id: "sanlib_entity_parent",
			name: "Import SanLib Entity Parent Model",
			icon: "brightness_5",
			category: "file",
			click: function(event) {
				Blockbench.import({
					extensions: ["json"],
					type: "SanLib Entity Parent Model"
				}, function(files) {
					var newCubes = {};
					var data = JSON.parse(files[0].content);
					newCubes = joinCubeList(data.cubes, newCubes);
					loadFile("{}", files[0].path, Object.keys(newCubes).map(function(key) { return newCubes[key].cube; }));
				});
			}
		}), "file.import");

		MenuBar.addAction(new Action({
			id: "sanlib_entity",
			name: "SanLib Entity Model",
			icon: "brightness_7",
			category: "file",
			click: function(event) {
				saveFile();
			}
		}), "file.export");
    },
	onunload() {
		this.onuninstall();
	},
	onuninstall() {
		Blockbench.showMessage("Unloaded SanLib Plugin", "status_bar");
		MenuBar.removeAction("file.import.sanlib_entity");
		MenuBar.removeAction("file.import.sanlib_entity_parent");
		MenuBar.removeAction("file.export.sanlib_entity");
	}
};

Plugin.register(plugin_data.id, plugin_data);

function loadFile(content, path, parentCubes) {
	if( !parentCubes ) {
		newProject(Formats['modded_entity'], true);
	}
	
	var data = JSON.parse(content);
	var cubes = joinCubeList(parentCubes || [], joinCubeList(data.cubes));
	if( !parentCubes ) {
		if( data.parent ) {
			if( Blockbench.isMobile || Blockbench.isWeb || !path ) {
				Blockbench.import({
					extensions: ["json"],
					type: "SanLib Parent Entity Model"
				}, function(files) {
					var newData = data;
					var newCubes = {};
					while( newData.parent ) {
						newData = JSON.parse(files[0].content);
						newCubes = joinCubeList(newData.cubes, newCubes);
					}
					loadFile(content, path, Object.keys(newCubes).map(function(key) { return newCubes[key].cube; }));
					
					Project.parent = data.parent;
				});
				return;
			} else {
				var newData = data;
				while( newData.parent ) {
					newData = JSON.parse(fs.readFileSync(getAssetPath(path, newData.parent)));
					cubes = joinCubeList(newData.cubes, cubes);
				}
				
				Project.parent = data.parent;
			}
		} else {
			Project.parent = null;
		}
	}
	
	if( !parentCubes ) {
		Project.name = data.name || extractFileName(path || "unknown_model");
	}
	
	var cubeNames = Object.keys(cubes);
	if( cubeNames.length < 2 ) {
		console.warn('sanlib-entity-models.loadFile: no cubes defined.')
		return;
	}
	
	if( !parentCubes ) {
		Project.texture_width = cubes.__firstCube.textureWidth;
		Project.texture_height = cubes.__firstCube.textureHeight;
	}
	
	if( data.texture && !(Blockbench.isMobile || Blockbench.isWeb) ) {
		var texture = new Texture().fromPath(getAssetPath(path, data.texture));
		if( texture && !texture.error && fs.existsSync(texture.path) ) {
			texturelist.textures.push(texture);
		}
	}
	
	var rootGroups = {};
	
	for( var cubeName of cubeNames ) {
		var cubeData = cubes[cubeName].cube;
		if( !cubeData ) continue;
		
		var cubeGroup = new Group({
			name: cubeData.boxName,
			origin: [cubeData.rotationPointX || 0, -(cubeData.rotationPointY || 0), cubeData.rotationPointZ || 0],
			rotation: [-(cubeData.rotateAngleX || 0) * 180.0 / Math.PI, (cubeData.rotateAngleY || 0) * 180.0 / Math.PI, (cubeData.rotateAngleZ || 0) * 180.0 / Math.PI]
		});
		rootGroups[cubeData.boxName] = cubeGroup;
		
		if( !cubeData.parentBox ) {
			cubeGroup.addTo().init();
		}
	}

	for( var cubeName of cubeNames ) {
		var cubeData = cubes[cubeName].cube;
		if( !cubeData ) continue;
		
		var cubeGroup = rootGroups[cubeData.boxName];
		var parentGroup = {origin: [0, 0, 0]};
		if( cubeData.parentBox && cubeData.parentBox in rootGroups ) {
			parentGroup = rootGroups[cubeData.parentBox]
			cubeGroup.addTo(parentGroup).init();
		}
		
		var x = (cubeData.rotationPointX || 0) + (cubeData.offsetX || 0) + parentGroup.origin[0];
		var y = -(cubeData.rotationPointY || 0) - (cubeData.offsetY || 0) - parentGroup.origin[1];
		var z = (cubeData.rotationPointZ || 0) + (cubeData.offsetZ || 0) + parentGroup.origin[2];
		
		var cube = new Cube({
			mirror_uv: cubeData.mirror,
			name: (cubes[cubeName].parent ? "PARENT:" : "") + cubeData.boxName,
			from: [x, y - cubeData.sizeY, z],
			to: [x + cubeData.sizeX, y, z + cubeData.sizeZ],
			uv_offset: [cubeData.textureX || 0, cubeData.textureY || 0],
			visibility: !cubeData.isHidden
		}).addTo(cubeGroup).init();
		
		Outliner.elements.push(cube);
		Canvas.addCube(cube);
	}
	
	Canvas.updateAll();
}

function saveFile() {
	var data = {}
	
	if( (typeof Project.parent === 'string' || Project.parent instanceof String) ) {
		data["parent"] = Project.parent.toString();
	}
	
	if( texturelist.textures.length > 0 ) {
		var rl = getResourceLocation(texturelist.textures[0].path);
		if( rl ) {
			data["texture"] = rl;
		}
	}
	
	data["cubes"] = [];
	var fltCubes = {};
	
	for( olCube of Outliner.elements ) {
		if( olCube instanceof Cube && !olCube.name.match(/^parent:/i) ) {
			fltCubes[olCube.uuid] = olCube;
		}
	}
	for( olCubeId of Object.keys(fltCubes) ) {
		var olCube = fltCubes[olCubeId];
		if( olCube instanceof Cube ) {
			var parentGroup = {origin: [0, 0, 0], dummy: true};
			if( olCube.parent instanceof Group ) {
				if( olCube.parent.name !== olCube.name ) {
					parentGroup = olCube.parent
				} else if( olCube.parent.parent instanceof Group && olCube.parent.parent.name !== "root" ) {
					parentGroup = olCube.parent.parent
				}
			
				var cubeData = {};
				
				var rotationPoints = olCube.parent.origin;
				var offset = [olCube.from[0] - rotationPoints[0] - parentGroup.origin[0],
							  -(olCube.to[1] - rotationPoints[1] - parentGroup.origin[1]),
							  olCube.from[2] - rotationPoints[2] - parentGroup.origin[2]];
				var size = [olCube.to[0] - olCube.from[0],
							olCube.to[1] - olCube.from[1],
							olCube.to[2] - olCube.from[2]];
							
				cubeData["boxName"] = olCube.name;
				cubeData["sizeX"] = size[0];
				cubeData["sizeY"] = size[1];
				cubeData["sizeZ"] = size[2];
				cubeData["textureX"] = olCube.uv_offset[0];
				cubeData["textureY"] = olCube.uv_offset[1];
				cubeData["textureWidth"] = Project.texture_width;
				cubeData["textureHeight"] = Project.texture_height;
				cubeData["offsetX"] = offset[0];
				cubeData["offsetY"] = offset[1];
				cubeData["offsetZ"] = offset[2];
				
				if( olCube.mirror_uv ) cubeData["mirror"] = true;
				if( olCube.parent.origin[0] != 0.0 ) cubeData["rotationPointX"] = olCube.parent.origin[0];
				if( olCube.parent.origin[1] != 0.0 ) cubeData["rotationPointY"] = -olCube.parent.origin[1];
				if( olCube.parent.origin[2] != 0.0 ) cubeData["rotationPointZ"] = olCube.parent.origin[2];
				if( olCube.parent.rotation[0] != 0.0 ) cubeData["rotateAngleX"] = -olCube.parent.rotation[0] * Math.PI / 180.0;
				if( olCube.parent.rotation[1] != 0.0 ) cubeData["rotateAngleY"] = olCube.parent.rotation[1] * Math.PI / 180.0;
				if( olCube.parent.rotation[2] != 0.0 ) cubeData["rotateAngleZ"] = olCube.parent.rotation[2] * Math.PI / 180.0;
				if( !olCube.visibility ) cubeData["isHidden"] = true;
				if( !parentGroup.dummy ) cubeData["parentBox"] = parentGroup.name;
				
				data["cubes"].push(cubeData);
			}
		}
	}
	
	Blockbench.export({
                type: 'SanLib Entity Model',
                extensions: ['json'],
                name: Project.name !== '' ? Project.name : 'entity_model',
                content: JSON.stringify(data, null, 2),
                savetype: 'json'
            });
}

function joinCubeList(currCubes, mainCubes) {
	if( !currCubes ) {
		return {};
	}
	
	if( !mainCubes ) {
		mainCubes = {__firstCube: null};
		for( var cube of currCubes ) {
			mainCubes[cube.boxName] = {cube: cube, parent: false};
			if( mainCubes.__firstCube === null ) {
				mainCubes.__firstCube = cube;
			}
		}
	} else {
		for( var cube of currCubes ) {
			if( !(cube.boxName in mainCubes) ) {
				mainCubes[cube.boxName] = {cube: cube, parent: true};
			}
		}
	}
		
	return mainCubes;
}

function extractFileName(path) {
	return path.split('\\').pop().split('/').pop();
}

function getAssetPath(path, resourceLocation) {
	var p = path.split('\\').join('/');
	return p.substr(0, p.lastIndexOf('assets/') + 7) + resourceLocation.replace(':', '/');
}

function getResourceLocation(path) {
	var p = path.split('\\').join('/');
	var assetPos = p.lastIndexOf('assets/');
	return assetPos >= 0 ? p.substr(assetPos + 7).replace(/\//, ":") : null;
}

plugin_data.onload();

onUninstall = plugin_data.onuninstall;
