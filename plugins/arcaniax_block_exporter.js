(function() {
	
	var geometry_name;
	var geometry_name_fancy;
	var bbMinSize = 0;
	var bbMaxOffset = 8;
	var bbMaxSize = 16;
	var color;
	var folderLocation;
	let options = {};
	let collision = [16, 16, 16];
	let collisionOffset = [0, 0, 0];
	
	const fs = require('fs');
	
	var preview;
	
	
	// SETS UP THE PREVIEW FOR THE COLLISION
	function setupPreview(){
		
		if (preview!=null){
			scene.remove(preview);
		}
		
		var minY = 0.001;
		
		var offsetX = Math.max(Math.min(collisionOffset[0], bbMaxOffset),-bbMaxOffset);
		var offsetY = Math.max(Math.min(collisionOffset[1], bbMaxSize), bbMinSize);
		var offsetZ = Math.max(Math.min(collisionOffset[2], bbMaxOffset),-bbMaxOffset);
		
		var x = Math.max(Math.min(collision[0],bbMaxSize-Math.abs(offsetX*2)),bbMinSize);
		var y = Math.max(Math.min(collision[1],bbMaxSize-offsetY),bbMinSize);
		var z = Math.max(Math.min(collision[2],bbMaxSize-Math.abs(offsetZ*2)),bbMinSize);
		
		
		const geo = new THREE.BoxBufferGeometry( x, y, z);
		const object = new THREE.Mesh( geo, new THREE.MeshBasicMaterial( 0x69db6d ) );
		object.position.x += offsetX;
		object.position.y = y/2 + minY + offsetY;
		object.position.z += offsetZ;
		const box = new THREE.BoxHelper( object, 0x69db6d );
		scene.add( box );
		
		preview = box;
	}
	
	
	// ESTIMATES BOUNDING BOX
	function estimateBoundingBox(){
		const max = {x:-Infinity,y:-Infinity,z:-Infinity};
		const min = {x:Infinity,y:Infinity,z:Infinity};
		const size = {x:-Infinity,y:-Infinity,z:-Infinity};
		Object.values(Canvas.meshes).map(mesh=>{
			const bh = new THREE.BoxHelper(mesh,new THREE.MeshBasicMaterial())
			bh.geometry.computeBoundingBox();
			max.x = Math.max(max.x,bh.geometry.boundingBox.max.x);
			max.y = Math.max(max.y,bh.geometry.boundingBox.max.y);
			max.z = Math.max(max.z,bh.geometry.boundingBox.max.z);
			min.x = Math.min(min.x,bh.geometry.boundingBox.min.x);
			min.y = Math.min(min.y,bh.geometry.boundingBox.min.y);
			min.z = Math.min(min.z,bh.geometry.boundingBox.min.z);
		});
		max.x = Math.min(max.x,8);
		max.y = Math.min(max.y,16);
		max.z = Math.min(max.z,8);
		min.x = Math.max(min.x,-8);
		min.y = Math.max(min.y,0);
		min.z = Math.max(min.z,-8);
		
		
		
		size.x = Math.abs(max.x-min.x);
		size.y = (max.y-Math.max(min.y, 0));
		size.z = Math.abs(max.z-min.z);
		
		collision[0] = Math.max(Math.min(size.x, bbMaxSize),bbMinSize).toFixed(1);
		collision[1] = Math.max(Math.min(size.y, bbMaxSize),bbMinSize).toFixed(1);
		collision[2] = Math.max(Math.min(size.z, bbMaxSize),bbMinSize).toFixed(1);
		
		collisionOffset[0] = Math.max(Math.min((max.x+min.x)/2, bbMaxSize),-bbMaxSize).toFixed(1);
		collisionOffset[1] = Math.max(Math.min(min.y, bbMaxSize),bbMinSize).toFixed(1);
		collisionOffset[2] = Math.max(Math.min((max.z+min.z)/2, bbMaxSize),-bbMaxSize).toFixed(1);
	}
	
	
	// HIDES THE PREVIEW FOR THE COLLISION
	function hidePreview(){
		if (preview!=null){
			scene.remove(preview);
		}
		preview = null;
	}
	
	
	function getDialog(){
		
		estimateBoundingBox();
		
		geometry_name = Project.geometry_name;
		if (geometry_name!=null&&geometry_name!=""){
			geometry_name_fancy = geometry_name.replace(/_/g, ' ');
		    geometry_name_fancy = geometry_name_fancy[0].toUpperCase() + geometry_name_fancy.slice(1);
		}
		
		
		var dialog = new Dialog({
					id: 'bedrock_block_export',
					title: 'Bedrock Block Exporter',
					form: {
						id: {label: 'Identifier', type: 'input', value: "project_name:" + geometry_name, placeholder: "project_name:block_name"},
						file_name: {label: 'File name', type: 'input', value: geometry_name, placeholder: "File name"},
						name: {label: 'Name', type: 'input', value: geometry_name_fancy, placeholder: "Block name"},
						alpha: {label: 'Texture options', type: 'select', options: {opaque: 'Opaque', alpha_test: 'Alpha Test (Transparent)', blend: 'Blend (Translucent)', double_sided: 'Double Sided (Mirrored)'}, default:'Opaque'},
						collision_settings: {label: 'Collision Settings', type: 'checkbox', value: false},
						collision: {label: 'Size', type: 'vector', value: collision, min:0, max:16, step:0.5, condition: (formData) => formData.collision_settings},
						collisionOffset: {label: 'Offset', type: 'vector', value: collisionOffset, min:-16, max:16.0, step:0.5, condition: (formData) => formData.collision_settings},
						entity_collision: {label: 'Entity Collision', type: 'checkbox', value: true, condition: (formData) => formData.collision_settings},
						export_loc: {label: 'Export Location', value: folderLocation, type: 'folder'}
						
					},
					onConfirm: function(formData) {
						hidePreview();
						if (typeof formData.export_loc != 'undefined'){
							folderLocation = formData.export_loc;
							exportBlock(formData);
						}
						this.hide();
					},
					onCancel: function(formData) {
						hidePreview();
						this.hide();
					}
				});
		dialog.updateFormConditions = function() {
			Dialog.prototype.updateFormConditions.call(dialog);
			collision = dialog.getFormResult().collision;
			collisionOffset = dialog.getFormResult().collisionOffset;
			setupPreview();
		}
		return dialog;
	}
	
	function exportBlock(formData){
		makeFolder(folderLocation);
		
		var bp = folderLocation+"\\" + formData.name + " BP";
		var rp = folderLocation+"\\" + formData.name + " RP";
		
		var blockBehaviors = bp + "\\" + "blocks";
		var lang = rp + "\\" + "texts";
		var textures = rp + "\\" + "textures";
		var models = rp + "\\" + "models";
		var blockModels = rp + "\\" + "models" + "\\" + "blocks";
		var blockTextures = rp + "\\textures\\" + "blocks";
		
		makeFolder(bp);
		makeFolder(rp);
		makeFolder(blockBehaviors);
		makeFolder(lang);
		makeFolder(textures);
		makeFolder(blockTextures);
		makeFolder(models);
		makeFolder(blockModels);
		
		createManifests(bp, rp, formData);
		createBehaviorFile(blockBehaviors, formData);
		saveModel(blockModels, formData);
		saveTexture(blockTextures, formData);
		addTranslation(lang, formData);
		addTextureMapping(textures, formData);
		
		Blockbench.showQuickMessage('Block was exported successfully!', 5000);
	}
	
	function makeFolder(dir){
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
	}
	
	function saveModel(dir, formData){
		fs.writeFile(dir + "\\" + formData.file_name +".geo.json", Format.codec.compile() , onError);
	}
	
	function createManifests(bp, rp, formData){
		fs.writeFile(bp + "\\manifest.json", getBehaviorManifest(formData) , onError);
		fs.writeFile(rp + "\\manifest.json", getResourceManifest(formData) , onError);
	}
	
	function addTranslation(dir, formData){
		var translationPrefix = "tile." + formData.id + ".name=";
		var translation = translationPrefix + formData.name;
		
		fs.writeFile(dir + "\\en_US.lang", translation , onError);
		fs.writeFile(dir + "\\languages.lang", getDefaultLanguages() , onError);
	}
	
	function getDefaultLanguages(){
		return `["en_US"]`;
	}
	
	function addTextureMapping(dir, formData){
		fs.writeFile(dir + "\\terrain_texture.json", getTerrainTextureFormat(formData) , onError);
	}
	
	function saveTexture(dir, formData){
		if (textures[0]){
			var base64 = textures[0].getBase64();
			var base64Data = base64.replace(/^data:image\/png;base64,/, "");

			fs.writeFile(dir + "\\" + formData.file_name + ".png", base64Data, 'base64', onError );
		}
	}
	
	function createBehaviorFile(dir, formData){
		fs.writeFile(dir + "\\" + formData.file_name + '.behavior.json', getBehaviorFormat(formData) , onError);
	}
	
	function checkFolders(dir){
		var bp = dir+"\\behavior_packs";
		var rp = dir+"\\resource_packs";
		if (fs.existsSync(bp)&&fs.existsSync(rp)) {
			if (hasDirectory(rp)){
				if (hasDirectory(bp)){
				  return true;
				}
			}
		}
		return false;
	}
	
	function hasDirectory(dir){
		var bool = false;
		fs.readdirSync(dir).forEach(file => {
		  if (fs.lstatSync(dir + "\\" + file).isDirectory() ){
			  bool = true;
		  }
		});
		return bool;
	}
	
	function getFirstDirectory(dir){
		var returnFile = "";
		fs.readdirSync(dir).forEach(file => {
		  if (fs.lstatSync(dir + "\\" + file).isDirectory() ){
			  returnFile = file;
		  }
		});
		return dir + "\\" + returnFile;
	}
	
	
	function getResourceManifest(formData){
		var name = formData.name;
		var uuid1 = generateUUID();
		var uuid2 = generateUUID();
		var json =
`{
  "format_version": 2,
  "header": {
    "description": "` + name + ` Resource Pack",
    "name": "` + name + ` RP",
    "uuid": "` + uuid1 + `",
    "version": [1, 0, 0],
    "min_engine_version": [1, 14, 0]
  },
  "modules": [{
    "description": "` + name + ` Resource Pack",
    "type": "resources",
    "uuid": "` + uuid2 + `",
    "version": [1, 0, 0]
  }]
}`;
		return json;
	}
	
	function getBehaviorManifest(formData){
		var name = formData.name;
		var uuid1 = generateUUID();
		var uuid2 = generateUUID();
		var json =
`{
  "format_version": 1,
  "header": {
    "description": "` + name + ` Behavior Pack",
    "name": "` + name + ` BP",
    "uuid": "` + uuid1 + `",
    "version": [1, 0, 0]
  },
  "modules": [{
    "description": "${name} Behavior Pack",
    "version": [ 1, 0, 0 ],
    "uuid": "` + uuid2 + `",
    "type": "data"
  }]
}`;
		return json;
	}
	
	function getTerrainTextureFormat(formData){
		var file_name = formData.file_name;
				var json =
`{
  "resource_pack_name": "vanilla",
  "texture_name": "atlas.terrain",
  "padding": 8,
  "num_mip_levels": 4,
  "texture_data": {
    "` + file_name + `": { 
	  "textures": "textures/blocks/` + file_name + `"
	}
  }
}`;
		return json;
	}
	
	function generateUUID() { // Public Domain/MIT
		var d = new Date().getTime();//Timestamp
		var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16;//random number between 0 and 16
			if(d > 0){//Use timestamp until depleted
				r = (d + r)%16 | 0;
				d = Math.floor(d/16);
			} else {//Use microseconds since page-load if supported
				r = (d2 + r)%16 | 0;
				d2 = Math.floor(d2/16);
			}
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
	}
	
	function getBehaviorFormat(formData){
		var alpha = "";
		var offset_entity = "";
		var size_entity = "";
		var offset_pick = "";
		var size_pick = "";
		
		alpha = formData.alpha;
		
		if (!formData.entity_collision){
			offset_entity = "0, 0, 0";
			size_entity = "0, 0, 0";
		}
		else{
			offset_entity = getOffset();
			size_entity = getSize();
		}
		offset_pick = getOffset();
		size_pick = getSize();
		
		return getBehaviorRaw(formData, alpha, offset_entity, size_entity, offset_pick, size_pick);
	}
	
	function getOffset(){
		var x = Math.max(Math.min(collisionOffset[0], bbMaxOffset),-bbMaxOffset);
		var y = Math.max(Math.min(collisionOffset[1], bbMaxSize), bbMinSize);
		var z = Math.max(Math.min(collisionOffset[2], bbMaxOffset),-bbMaxOffset);
		
		x = x - Math.max(Math.min(collision[0],bbMaxSize-Math.abs(x*2)),bbMinSize)/2;
		z = z - Math.max(Math.min(collision[2],bbMaxSize-Math.abs(z*2)),bbMinSize)/2;
		
		return x + ", " + y + ", " + z;
	}
	
	function getSize(){
		var offsetX = Math.max(Math.min(collisionOffset[0], bbMaxOffset),-bbMaxOffset);
		var offsetY = Math.max(Math.min(collisionOffset[1], bbMaxSize), bbMinSize);
		var offsetZ = Math.max(Math.min(collisionOffset[2], bbMaxOffset),-bbMaxOffset);
		
		var x = Math.max(Math.min(collision[0],bbMaxSize-Math.abs(offsetX*2)),bbMinSize);
		var y = Math.max(Math.min(collision[1],bbMaxSize-offsetY),bbMinSize);
		var z = Math.max(Math.min(collision[2],bbMaxSize-Math.abs(offsetZ*2)),bbMinSize);
		
		return x + ", " + y + ", " + z;
	}
	
	function getBehaviorRaw(formData, alpha, offset_entity, size_entity, offset_pick, size_pick){
		var json =
`{
  "format_version": "1.16.100",
  "minecraft:block": {
    "description": {
      "identifier": "${formData.id}"
    },
    "components": {
      "minecraft:destroy_time": 4.0,
      "minecraft:friction": 0.6,
	  "minecraft:block_light_emission": 0.0,
      "minecraft:block_light_absorption": 0.0,
	  "minecraft:entity_collision": {
		"origin": [${offset_entity}],
		"size": [${size_entity}]
	  },
	  "minecraft:pick_collision": {
		"origin": [${offset_pick}],
		"size": [${size_pick}]
	  },
	  "minecraft:geometry": "geometry.${formData.file_name}",
      "minecraft:material_instances" : {
        "*" : {
          "texture": "${formData.file_name}",
          "render_method": "${alpha}"
        }
      }
    }
  }
}`;
		return json;
	}
	
	function onError(err)
		{
			if (err)
			{
				console.log('File Writing Error: ', err);
			}
		}
	
	var export_action;
	
	Plugin.register('arcaniax_block_exporter', {
		title: 'Bedrock Block Exporter',
		icon: 'icon-format_block',
		author: 'Arcaniax',
		description: 'Helps making new Bedrock blocks (requires experimental mode)',
		version: '0.1.1',
		variant: 'both',

		onload() {
			export_action = new Action({
				id: 'block_exporter',
				name: 'Bedrock Block Exporter',
				icon: 'icon-format_block',
				category: 'filter',
				click: function(ev) {
					getDialog().show();
					$('#blackout').hide(0);
					setupPreview();
				}
			});

			MenuBar.addAction(export_action, 'filter');
		},
		onunload() {
			this.onuninstall();
		},
		onuninstall() {
			export_action.delete();
		}
	})
})()
