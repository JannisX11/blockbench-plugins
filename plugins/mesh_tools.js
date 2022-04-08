
(function () {
	// this plugin just contain random stuff all combined together. dont judge.
	// !warning, terrible code ahead!
	let MeshToolsAction;
	let GensAction;
	Plugin.register('mesh_tools', {
		title: 'MTools',
		icon: 'fas.fa-vector-square',
		author: 'Malik12tree',
		description: 'Adds helpful Modeling Tools, Operators and Generators for Meshs!',
		version: '1.0.0',
		variant: "desktop", /* if ur wondering, 
		from the end of `Children > Action > Click > Mesh.selected.forEach` block, 
		I believe jquery thinks "bbFace" is a normal variable, and the delete operator will throw an error in strict mode
		*/
		tags: ["Format: Generic Model"],
		onload() {
			var condition = { modes: ['edit'], features: ['meshes'], method: () => (Mesh.selected.length && BarItems.selection_mode.value != "object") };
			
			window.gradient256 = {};
			for (let x = 0; x < 256; x++) {
				window.gradient256[[x,0]] = x/255;
			}
			
			let _m_ = new THREE.Mesh();
			function otherDirections(vector = new THREE.Vector3(), normalize=true) {
				// may not be the best way, this all i can think about
				_m_.lookAt(vector);
				
				let x = new THREE.Vector3(1).applyQuaternion( _m_.quaternion )
				let y = new THREE.Vector3(0,1).applyQuaternion( _m_.quaternion )
				return {x,y,z:vector.normalize()}
			}
			function rotationFromDir(vector) {
				_m_.lookAt(vector);
				return _m_.rotation;
			}
			function normalOfTri(A,B,C) {	
			return new THREE.Vector3(
				A.y * B.z - A.z * B.y,
				A.z * B.x - A.x * B.z,
				A.x * B.y - A.y * B.x
			)
			}
			function compileRGB(s) {
				let string = "";
				for (let i = 4; i < s.length-1; i++) {
					string+=s[i];
				}
				string = string.split(',');
				return new THREE.Color(string[0]/255,string[1]/255,string[2]/255);
			}
			let TerrainGenAction;
			class TerrainGen{
				static styles = {
					Earth: [
						{blend: .5, height: .2, 	color: 	new THREE.Color(.13, .36, .89)},
						{blend: .2, height: .375, 	color: 	new THREE.Color(.9, .86, .36)},
						{blend: .3, height: .5, 	color: 	new THREE.Color(.15, .87, .113)},
						{blend: 1, height: 1, 		color: 		new THREE.Color(.113, .87, .137)},
					],
					EarthMountains: [
						{blend: .5, height: .2, 	color: 	new THREE.Color(.13, .36, .89)},
						{blend: .2, height: .375, 	color: 	new THREE.Color(.9, .86, .36)},
						{blend: .3, height: .5, 	color: 	new THREE.Color(.15, .87, .113)},
						{blend: 1, height: .6, 		color: 		new THREE.Color(.113, .87, .137)},
						{blend: .1, height: 1, 		color: 		new THREE.Color(.39, .28, .12)},
					],
					Desert: [
						{blend: 0, height: 0, 	color: 	new THREE.Color(0.54, 0.42, 0.17)},
						{blend: .9, height: 1, 	color: 	new THREE.Color(0.79, 0.56, 0.25)}
					],
					Ice: [
						{blend: 0, height: 0, 	color: 	new THREE.Color(0.45, 0.68, 0.86)},
						{blend: 1, height: .5, 	color: 	new THREE.Color(0.58, 0.77, 0.89)},
						{blend: 1, height: .75, 	color: 	new THREE.Color(0.83, 0.94, 0.97)},
						{blend: 1, height: 1, 	color: 	new THREE.Color(0.61, 0.84, 0.94)}
					],
					Mask: [
						{blend: 0, height: 0, 	color: 	new THREE.Color(0,0,0)},
						{blend: 1, height: 1, 	color: 	new THREE.Color(1,1,1)},
					],
				};
				/**
				 * @type {Array<TerrainGen>}
				 */
				static all = [];
				static init(){
					let styleOpts = {};
					for (const key in TerrainGen.styles) {
						// const style = TerrainGen.styles[key];
						styleOpts[key] = key;
					}
					let settingsCombined = {};
					let form = {
						style : {label: "Style", type:"select"},
						terrain : {label: "Terrain Type", type:"select"},
						// `max` key is unnecessary since the pc would explode before figuring the clamping
						width : {label: "Width", 	type:"number", value: 32, min: 1, max: 255},
						height : {label: "Height", 	type:"number", value: 32, min: 1, max: 255},
						suggested : {label: "Update Suggested Settings", type:"checkbox", value: true},
						_:"_",
						multiplier : {label: "Height Multiplier", type:"number", value: 5, max: Infinity},
						falloff : {label: "FallOff Map", type:"checkbox", value: false},
						__:"_",
					}
					form.style.options = styleOpts;
					form.style.options.custom = "Custom";
					let options = {};
					for (let i = 0; i < TerrainGen.all.length; i++) {
						const currentGen = TerrainGen.all[i];
						options[currentGen.codeName] = currentGen.name;
						
						for (const key in currentGen.settings) {
							const currentSettingVal = currentGen.settings[key];
							if (settingsCombined[key]) {
								settingsCombined[key].push(currentGen.codeName)
							} else { settingsCombined[key] = [currentGen.codeName] }
							// form[key] = {label: key type: 'number', min: 0, value: currentSettingVal, condition: ({terrain} = {}) => settingsCombined[key].includes(terrain)}
							currentSettingVal.condition = ({terrain} = {}) => settingsCombined[key].includes(terrain)
							form[key] = currentSettingVal
						}
					}
					form.terrain.options = options;

					//
					TerrainGenAction = new Action("terrain_action", {
						name: "Terrain",
						description: "Generates Terrain procedurally with fully customized settings",
						icon: "terrain",
						click: function() {
							let typeBeforeUpdate;
							new Dialog({
								title: 'Terrain Settings',
								id: 'terrain_settings',
								form,
								onConfirm: function(_out) {
									perlin.seed() // reset perlin memmory
									let style = TerrainGen.styles[_out.style];
									if (_out.style == 'custom') {
										let cs = localStorage.mt_customStyle;
										if (!cs) Blockbench.showQuickMessage("No Custom Style found, 'Earth' is used instead.", 2000)
										
										let custom = JSON.parse(cs);
										custom.forEach(h => {
											h.color = compileRGB(h.col)
										});
										style = custom;
									}
									let falloff = _out.falloff;
									let terrain = TerrainGen.all.find(e => e.codeName == _out.terrain);
									function runEdit(out, amended) {
										out.falloff = falloff;
										let elements = [];
										let textures = [];
										Undo.initEdit({elements, textures, selection: true}, amended);
										
										let map = terrain.noise(out);
										let topLeftX = .5-out.width/2
										let topLeftY = .5-out.height/2
										
										let mesh = new Mesh({vertices:{}});
										let t = TerrainGen.genTexture(out.width,out.height, map, style, out.blending);
										
										let addedVertices = new Array(out.width*out.height);
										let vertexIndex = 0;
										for (let j = out.height-1; j >= 0; j--) {										
											for (let i = out.width-1; i >= 0; i--) {
												let x=i+topLeftX
												let y=j+topLeftY
												let z= map[ [i,j] ]*out.multiplier +1;
												
												let vertex = [x,z,y];
												addedVertices[vertexIndex] = mesh.addVertices(vertex)[0];
												vertexIndex++;
											}
										}
										vertexIndex = 0;
										for (let y = out.height-1; y >= 0; y--) {							
											for (let x = out.width-1; x >= 0; x--) {
												if (x > 0 && y > 0) {
													let indices = [vertexIndex,vertexIndex+1,vertexIndex+out.width+1,vertexIndex+out.width]
													
													let uv = {};
													uv[addedVertices[indices[0]]] = [(x-1)	/ out.width * (Project._texture_width+0),		(y-1)	/ out.height * (Project._texture_height+0)];
													uv[addedVertices[indices[1]]] = [x		/ out.width * (Project._texture_width+0),	(y-1)	/ out.height * (Project._texture_height+0)];
													uv[addedVertices[indices[2]]] = [x		/ out.width * (Project._texture_width+0),	y	/ out.height * (Project._texture_height+0)];
													uv[addedVertices[indices[3]]] = [(x-1)	/ out.width * (Project._texture_width+0),		y	/ out.height * (Project._texture_height+0)];
													
													let face = new MeshFace( mesh, {
														vertices: [
															addedVertices[indices[3]],
															addedVertices[indices[2]],
															addedVertices[indices[1]],
															addedVertices[indices[0]],
														],uv, texture: t.uuid
													})
													let key = mesh.addFaces(face);
													
													// procces were we want to remove distorted faces that get distorted from sorting problems
													// a quick fix is to triangulate the face
													let sortedVertices = face.getSortedVertices();
													for (let i = 0; i < 4; i++) {
														const vertexA = mesh.vertices[sortedVertices[i]];
														const vertexB = mesh.vertices[sortedVertices[(i+1)%4]];
														
														let dirToB = [vertexB[0] - vertexA[0], vertexB[2] - vertexA[2]];
														
														let daigonalCheck = (dirToB[0] && dirToB[1] == 0) || (dirToB[1] && dirToB[0] == 0);
														if (!daigonalCheck) {
															delete mesh.faces[key];
															
															let face1 = new MeshFace( mesh, {
																vertices: [
																	addedVertices[indices[3]],
																	addedVertices[indices[2]],
																	addedVertices[indices[0]],
																],uv, texture: t.uuid
															})
															let face2 = new MeshFace( mesh, {
																vertices: [
																	addedVertices[indices[1]],
																	addedVertices[indices[0]],
																	addedVertices[indices[2]],
																],uv, texture: t.uuid
															})
															mesh.addFaces(face1);
															mesh.addFaces(face2);
															
															break;
														}
													}
												}
												vertexIndex++;
											}
										}
										mesh.init();
										
										// mesh.applyTexture(t, true);
										
										elements.push(mesh);
										mesh.select();
										textures.push(t);
										Undo.finishEdit('Generate Terrain Mesh');
									}
									runEdit(_out, false);
									let _form_ = {};
									form.width.value = _out.width; form.height.value = _out.height; form.multiplier.value = _out.multiplier;
									_form_.width = form.width;
									_form_.height = form.height;
									_form_.multiplier = form.multiplier;
									for (const key in terrain.settings) {
										// terrain.settings[key].value = _out[key];
										let c = {};
										for (const _key in terrain.settings[key]) {
											if (_key != 'condition') {
												c[_key] = terrain.settings[key][_key];
											}
										}
										_form_[key] = c;
									}
									
									Undo.amendEdit(_form_, form => {
										runEdit(form, true);
									})
								},
								onFormChange(data){
									if (!data.suggested) return;
									if (data.terrain == typeBeforeUpdate) return; // stop call stack

									let selected = TerrainGen.all.find(e => e.codeName == data.terrain);
									typeBeforeUpdate = data.terrain;

									this.setFormValues(selected.suggested);
									
								}
							}).show();
						}
					});
				}
				static genTexture(width,height,noise, style = this.styles.Earth, asTexture = true){	

					let canvas = document.createElement('canvas');
					canvas.width = width;
					canvas.height = height;
					let ctx = canvas.getContext('2d');
					for (let y = height-1; y >= 0; y--) {						
						for (let x = width-1; x >= 0; x--) {						
							let currentHeight = Math.clamp(noise[ [x,y] ], 0, style.last().height);
							for (let i = 0; i < style.length; i++) {
								if (currentHeight <= style[i].height) {
									let s2 = style[Math.clamp(i-1, 0, Infinity)];
									let percent = 1-THREE.Math.inverseLerp(s2.height, style[i].height, currentHeight);
									let color = style[i].color.clone().lerp(s2.color, percent*(style[i].blend));
									ctx.fillStyle = `rgb(${color.r*255},${color.g*255},${color.b*255})`;
									// ctx.fillStyle = style[i].color;
									ctx.fillRect(x,y, 1,1);
									break;
								}
							}
						}
					}
					if (!asTexture) {
						return canvas.toDataURL();
					}
					let _texture = new Texture({saved: false}).fromDataURL(canvas.toDataURL());
					_texture.add();
					return _texture;
				}
				constructor(data){
					this.name = data.name;
					this.codeName = data.name.toLowerCase().replaceAll(" ", "_");
					this.settings = data.settings;
					this.suggested = data.suggested || {};
					/**
				 	* @type {Function}
				 	*/
					this.noise = data.noise;
					
					TerrainGen.all.push(this);
				}
			}

			// Math Functions =>
			function sm(v) {
				let a = 3;
				let b = 2.7;
				return Math.pow(v, a) / (Math.pow(v,a) + Math.pow(b-b*v, a)); // unefficient
			}
			function falloffMap(i,j, width, height, v) { // not loops for efficency
				let x = i / width * 2 - 1;
				let y = j / height * 2 - 1;
				return sm(Math.max(Math.abs(x), Math.abs(y)));
			}
			// source : https://github.com/joeiddon/perlin/blob/master/perlin.js
			// 3d modifcations ahead
			let perlin = {
				rand_vect: function(){
						let x = (Math.random() - .5) * 2;
						let y = (Math.random() - .5) * 2;
						let z = (Math.random() - .5) * 2;
						return {x,y,z};
					},
				dot_prod_grid: function(x, y, z, vx, vy, vz){
					let g_vect;
					let d_vect = {x: x - vx, y: y - vy, z: z - vz};
					if (this.gradients[[vx,vy,vz]]){
						g_vect = this.gradients[[vx,vy,vz]];
					} else {
						g_vect = this.rand_vect();
						this.gradients[[vx,vy,vz]] = g_vect;
					}
					return d_vect.x * g_vect.x + d_vect.y * g_vect.y + d_vect.z * g_vect.z;
				},
				smootherstep: function(x){
					return 6*x**5 - 15*x**4 + 10*x**3;
				},
				interp: function(x, a, b){
					return a + this.smootherstep(x) * (b-a);
				},
				seed: function(){
					this.gradients = {};
					this.memory = {};
				},
				get: function(x, y, z=0) {
					if (this.memory.hasOwnProperty([x,y,z]))
						return this.memory[[x,y,z]];
					let xf = Math.floor(x);
					let yf = Math.floor(y);
					let zf = Math.floor(z);
					//interpolate
					let tl = this.dot_prod_grid(x, y,z, xf,   yf  , zf);
					let tr = this.dot_prod_grid(x, y,z, xf+1, yf  , zf);
					let xt = this.interp(x-xf, tl, tr);
					
					let bl = this.dot_prod_grid(x, y,z, xf,   yf+1, zf);
					let br = this.dot_prod_grid(x, y,z, xf+1, yf+1, zf);
					let xb = this.interp(x-xf, bl, br);
					
					
					let tlz = this.dot_prod_grid(x, y,z, xf,   yf  , zf+1);
					let trz = this.dot_prod_grid(x, y,z, xf+1, yf  , zf+1);
					let xtz = this.interp(x-xf, tlz, trz);
			
					let blz = this.dot_prod_grid(x, y,z, xf,   yf+1, zf+1);
					let brz = this.dot_prod_grid(x, y,z, xf+1, yf+1, zf+1);
					let xbz = this.interp(x-xf, blz, brz);
					
					let vy = this.interp(y-yf, xt, xb);
					let vy2 = this.interp(y-yf, xtz, xbz);
					
					let v = this.interp(z-zf, vy, vy2);
					this.memory[[x,y,z]] = v;
					return v;
				}
			}

			// https://easings.net/#easeInOutSine
			function easeInOutSine(x) {
				return -(Math.cos(Math.PI * x) - 1) / 2;
			}

			// end
			/**
			 * @todo Hills
			 */

			new TerrainGen({
				name: 'Open Terrain',
				settings: {
					time: {label: 'Time', type: 'number', min: 0, value: 0, step: 1},
					scale: {label: 'Scale', type: 'number', min: 0, value: 15},
					octaves: {label: 'Octaves', type: 'number', min: 0, value: 5},
					persistance: {label: 'Persistancy', type: 'number', min: 0, max: 1, step: .1,value: .4},
					lacunarity: {label: 'lacunarity', type: 'number', min: 0, value: 2},
					min: {label: 'Min Level', type: 'number', min: 0, max: .9, step: .1,value: .1},
				},
				noise: function(s, m = false) {
					if (s.scale <= 0) s.scale = 1E-6
					let map = {};

					let MaxHeight = 0;
					let MinHeight = 0;
					for (let y = s.height-1; y >= 0; y--) {
						for (let x = s.width-1; x >= 0; x--) {
							let amplitude = 1;
							let frequency = 1;
							let noiseHeight = 0;

							for (let i = 0; i < s.octaves; i++) {
								let sampX = x / s.scale * frequency;
								let sampY = y / s.scale * frequency;
								let val = perlin.get(sampX, sampY, s.time);
								noiseHeight += val * amplitude;
								amplitude*= s.persistance;
								frequency*= s.lacunarity;
							}
							if (noiseHeight > MaxHeight) {
								MaxHeight = noiseHeight;
							} else if(noiseHeight < MinHeight) {
								MinHeight = noiseHeight;
							}
							map[ [x,y] ] = noiseHeight;
						}
					}
					for (let y = s.height-1; y >= 0; y--) {
						for (let x = s.width-1; x >= 0; x--) {
							map[ [x,y] ] = THREE.Math.inverseLerp(MinHeight, MaxHeight, map[ [x,y] ]);
							// custom functions
							if (m) map[ [x,y] ] = eval(m);
							// falloff
							let f = falloffMap(x,y, s.width, s.height);
							if (s.falloff) map[ [x,y] ] = Math.clamp(map[ [x,y] ] - f, 0,1);
							// min/max level
							if (s.min || s.max) {
								const min = s.min != undefined ? s.min: 0;
								const max = s.max != undefined ? s.max: 1;
								
								map[ [x,y] ] = Math.clamp(THREE.MathUtils.mapLinear(easeInOutSine(map[ [x,y] ]), min, max, 0,1),0,1); // color ramp: ease
							}
						}
					}
					return map;
				}
			});
			new TerrainGen({
				name: 'Valley',
				settings: {
					time: {label: 'Time', type: 'number', min: 0, value: 0, step: 1},
					scale: {label: 'Scale', type: 'number', min: 0, value: 15},
					octaves: {label: 'Octaves', type: 'number', min: 0, value: 5},
					persistance: {label: 'Persistancy', type: 'number', min: 0, max: 1, step: .1,value: .4},
					lacunarity: {label: 'lacunarity', type: 'number', min: 0, value: 2},
				},
				suggested: {
					style: "EarthMountains"
				},
				noise: function(s) {
					s.min = 0;
					let noise = TerrainGen.all[0].noise(s, `1-Math.abs((map[ [x,y] ]-.5)*2)`);
					return noise;
				}
			});
			new TerrainGen({
				name: 'Mesa',
				settings: {
					time: {label: 'Time', type: 'number', min: 0, value: 0, step: 1},
					scale: {label: 'Scale', type: 'number', min: 0, value: 15},
					octaves: {label: 'Octaves', type: 'number', min: 0, value: 5},
					persistance: {label: 'Persistancy', type: 'number', min: 0, max: 1, step: .1,value: .4},
					lacunarity: {label: 'lacunarity', type: 'number', min: 0, value: 2}
				},
				suggested: {
					falloff: true,
					style: "Desert"
				},
				noise: function(s) {
					s.max = .75;
					s.min = 0;
					let noise = TerrainGen.all[0].noise(s);
					return noise;
				}
			});
			TerrainGen.init();
			let children = [];
			let UVchildren = [];
			let generators = [];
			
			children.push(
				new Action("to_sphere", {
					name: "To Sphere",
					description: "Cast selected vertices to a sphere with an influence",
					icon: "change_circle",
					condition,
					click: function() {
						function runEdit(amended, influence = 100){
							Undo.initEdit({elements: Mesh.selected, selection: true}, amended);
							/* selected meshes */
							Mesh.selected.forEach(mesh => {
								let center = [0,0,0];
								let selectedV = mesh.getSelectedVertices();
								let positions = [];
								let size = [0,0,0];
								selectedV.forEach(key => {
									positions.push(mesh.vertices[key]);
									center.V3_add(mesh.vertices[key]);
								});
								center.V3_divide(selectedV.length);
								
								for (let i = 0; i < 3; i++) {
									positions.sort((a, b) => a[i] - b[i]);
									size[i] = positions.last()[i] - positions[0][i];
								}
								size.V3_divide(2);
								selectedV.forEach(key => {
									let vertex = mesh.vertices[key];
									let spherePosition = vertex.V3_subtract(center).V3_toThree().normalize().toArray().V3_multiply(size).V3_add(center).V3_toThree();
									let finalP = vertex.V3_add(center).V3_toThree().lerp(spherePosition, influence/100).toArray();
									mesh.vertices[key] = finalP;
								});
							});
							Undo.finishEdit('spherize mesh selection')
							Canvas.updateView({elements: Mesh.selected, element_aspects: {geometry: true, uv: true, faces: true}, selection: true})
						}
						runEdit(false, 100);
						Undo.amendEdit({
							influence: {type: 'number', value: 100, label: 'Influence', min:0, max:100},
						}, form => {
							runEdit(true, form.influence);
						})
					}
				})
			);
			children.push("_");

			children.push(
				new Action("poke", {
					name: "Poke Faces",
					description: "Creates a fan out of a face",
					icon: "control_camera",
					condition,
					click: function() {
						function runEdit(amended, depth = 0){
							Undo.initEdit({elements: Mesh.selected, selection: true}, amended);
							/* selected meshes */
							Mesh.selected.forEach(mesh => {
								/* selected faces */
								
								mesh.getSelectedFaces().forEach(face => {
									let _face = mesh.faces[face];
									
									/* center vertex creation */
									var am = _face.getNormal(true).V3_multiply(depth);
									let centerVertex = mesh.addVertices(_face.getCenter().V3_add(am))[0];
									Project.selected_vertices[mesh.uuid].push(centerVertex);

									/* faces creation */
									let SortedV = _face.getSortedVertices();
									for (let i = 0; i < SortedV.length; i++) {
										const vertexA = SortedV[i];
										const vertexB = SortedV[(i+1) % SortedV.length];
										let new_face = new MeshFace(mesh, _face).extend({
											vertices: [
												vertexA,
												vertexB,
												centerVertex,
											]
										});
										new_face.uv[centerVertex] = getFaceUVCenter(_face);
										Project.selected_faces.push(mesh.addFaces(new_face));
									}
									delete mesh.faces[face];
	
								});
							});
							Undo.finishEdit('Poke mesh face selection')
							Canvas.updateView({elements: Mesh.selected, element_aspects: {geometry: true, uv: true, faces: true}, selection: true})
						}
						runEdit(false);
						Undo.amendEdit({
							depth: {type: 'number', value: 0, label: 'Depth'},
						}, form => {
							runEdit(true, form.depth);
						})
					}
				})
			);
			function FixedVec(vec) { return [(vec[0].toFixed(5)*1), (vec[1].toFixed(5)*1), (vec[2].toFixed(5)*1)]; }
			function VectorCollinearity(v1, v2) {
				let cross = new THREE.Vector3(...FixedVec(v1)).cross(new THREE.Vector3(...FixedVec(v2)));
				return cross.x == 0 && cross.y == 0 && cross.z == 0;
			}
			children.push(
				new Action("tris_to_quad", {
					name: "Triangles To Quad",
					description: "Trys to dissolve adjacent triangles into a quad",
					icon: `fas.fa-external-link-square-alt`,
					condition,
					click: function() {
						/*MIND PLAN: 	For each triangle, check if the adjacent triangle have the same Normal; 
						then create the future quad, if the normal of the quad is also eqaul to the triangles, Accepted */
						Undo.initEdit({elements: Mesh.selected, selection: true});
						/* selected meshes */
						Mesh.selected.forEach(mesh => {
							/* selected faces */
							mesh.getSelectedFaces().forEach(_face => {
								let face = mesh.faces[_face];
								if (face && face.vertices.length == 3) {
									let adjacentFaces = [];
									for (let i = 0; i < 3; i++) {
										const currentAjcFace = face.getAdjacentFace(i);
										adjacentFaces.push(currentAjcFace);
										if (!currentAjcFace || currentAjcFace.face.vertices.length != 3) continue;
										if (i != 0 && adjacentFaces.last().key == adjacentFaces[i].key) break;
										
										// Check Normals
										if (currentAjcFace.face.isSelected() && VectorCollinearity(currentAjcFace.face.getNormal(true), face.getNormal(true))) {
											const currentVertices = currentAjcFace.face.getSortedVertices();
											const uniqueVertex = face.getSortedVertices().filter(function(obj) { return currentVertices.indexOf(obj) == -1; })[0];
											
											let new_quad = new MeshFace(mesh, {
												vertices : [
													...currentVertices,
													uniqueVertex,
												]
											});
											if (VectorCollinearity(new_quad.getNormal(true), face.getNormal(true))) {
												let u;
												// find unique uv key
												for (let j = 0; j < new_quad.vertices.length; j++) {
													if (face.uv[new_quad.vertices[j]] == undefined) {
														u = new_quad.vertices[j];
														break;	
													}
												}
												new_quad.uv = face.uv;
												new_quad.uv[u] = currentAjcFace.face.uv[u];
												new_quad.texture = face.texture;
												mesh.addFaces(new_quad)
												delete mesh.faces[currentAjcFace.key];
												delete mesh.faces[_face];
											}
										}
									}
									
								}
							});
						});
						Undo.finishEdit('Tris To Quads execute')
						Canvas.updateView({elements: Mesh.selected, element_aspects: {geometry: true, uv: true, faces: true}, selection: true})
					}
				})
			);
			
			function getAdjacentVertices(arr, index){
				return [
					arr[(index+1 + arr.length) % arr.length],
					arr[index],
					arr[(index-1 + arr.length) % arr.length],
				]
			}
			function sign(p1,p2,p3) { return (p1[0] - p3[0]) * (p2[2] - p3[2]) - (p2[0] - p3[0]) * (p1[2] - p3[2]);}
			function PointInTri(point, triangle) {
				let d1,d2,d3, has_neg, has_pos;
				d1 = sign(point, triangle[0],triangle[1]);
				d2 = sign(point, triangle[1],triangle[2]);
				d3 = sign(point, triangle[2],triangle[0]);
				has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
				has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
				return !(has_neg && has_pos)
			}

			function cross(pointA, pointB) {
				return (pointA[0]*pointB[1] - pointA[1]*pointB[0]);
			}
			function dot(pointA, pointB) {
				return (pointA[0]*pointB[0] + pointA[1]*pointB[1]);
			}
			// Earcut algorithm
			function Triangulate(polygon, normal) {
				/* found out that BB only supports quads/tris
				polygons. but im gonna keep it just incase one day it does*/
				let vertices = polygon;
				let indexs = [];
				let triangles = [];
				if (normal[1] >= 0) {
					// winding order thing
					vertices.reverse();
				}
				for (let i = 0; i < vertices.length; i++) indexs.push(i);
				let si = 0;
				// 1000 is a safety limit just incase yk.
				while (indexs.length > 3 && si <= 1000) {
					for (let i = 0; i < indexs.length; i++) {
						let earlyIndexs = getAdjacentVertices(indexs, i);
						let CurrentTri = [vertices[earlyIndexs[0]],vertices[earlyIndexs[1]],vertices[earlyIndexs[2]]];
						/* y axis matter and doesnt. 
						so we need to project the face/vertices to an xz plane*/
						if (normal != null) {
							CurrentTri[0] = CurrentTri[0].V3_toThree().projectOnPlane(normal.V3_toThree()).toArray();
							CurrentTri[1] = CurrentTri[1].V3_toThree().projectOnPlane(normal.V3_toThree()).toArray();
							CurrentTri[2] = CurrentTri[2].V3_toThree().projectOnPlane(normal.V3_toThree()).toArray();
							CurrentTri[0][1] = 0, CurrentTri[1][1] = 0, CurrentTri[2][1] = 0;
						}
						// CHECK 1: if angle BAC (were "A" is the current vertex) is convex (< 180deg)
						let pointA = [CurrentTri[2][0] - CurrentTri[1][0], CurrentTri[2][2] - CurrentTri[1][2]];
						let pointB = [CurrentTri[0][0] - CurrentTri[1][0], CurrentTri[0][2] - CurrentTri[1][2]];
						// if (pointA[0] == 0 && pointA[1] == 0) {
						// 	pointA = [0,1];
						// }
						// if (pointB[0] == 0 && pointB[1] == 0) {
						// 	pointB = [0,1];
						// }
						// let angle = Math.radToDeg(Math.acos((pointA[0]*pointB[0] + pointA[1]*pointB[1]) / (length(pointA[0], pointA[1]) * length(pointB[0], pointB[1]))));
						let crossP = cross(pointA, pointB);
						if (crossP <= 0) {
							// CHECK 2: if any of the vertices isnt inside the current triangle
							let inTri = false;
							for (let j = 0; j < indexs.length; j++) {
								if (earlyIndexs[0] == j || earlyIndexs[1] == j || earlyIndexs[2] == j) continue;
								if (PointInTri(vertices[j], CurrentTri)) {
									inTri = true;
									break;
								}
							}
							if (!inTri) {
								// Accepted; remove the current vertex and add a tri to the array
								triangles.push(earlyIndexs.sort((a,b) => b - a))
								indexs.splice(i,1);
								break;
							}
						}
					}
					si++;
				}
				triangles.push(indexs.slice().sort((a,b) => b - a))
				return triangles;
			}
			children.push(
				new Action("triangulate", {
					name: "Triangulate Faces",
					description: "Cuttes a face into triangles (might not work if face have holes)",
					icon: "pie_chart_outline",
					condition,
					click: function() {
						Undo.initEdit({elements: Mesh.selected, selection: true});
						/* selected meshes */
						Mesh.selected.forEach(mesh => {
							/* selected faces */
							mesh.getSelectedFaces().forEach(key => {
								let face = mesh.faces[key];
								let SortedV = face.getSortedVertices();
								if(!(SortedV.length <= 3)) {
									let triangles = Triangulate(SortedV.map(a => { return mesh.vertices[a]; }), face.getNormal(true));
									// create faces
									for (let i = 0; i < triangles.length; i++) {
										let new_face = new MeshFace(mesh, face).extend({
											vertices: [
												SortedV[triangles[i][0]],
												SortedV[triangles[i][2]],
												SortedV[triangles[i][1]],
											]
										})
										mesh.addFaces(new_face)
									};
									delete mesh.faces[key];
								}
							});
						});
						Undo.finishEdit('Triangulate mesh face selection')
						Canvas.updateView({elements: Mesh.selected, element_aspects: {geometry: true, uv: true, faces: true}, selection: true})
					}
				})
			);

			children.push("_");

			function WorldToScreen(x, y, z, camera, width, height) {
				// https://stackoverflow.com/a/27448966/16079500
				var p = new THREE.Vector3(x, y, z);
				var vector = p.project(camera);
		
				vector.x = (vector.x + 1) / 2 * width;
				vector.y = -(vector.y - 1) / 2 * height;
		
				return vector;
			}
			UVchildren.push(
				new Action("uv_project_view", {
					name: "Project From View",
					description: "Projects the selected faces to the UV map from the camera",
					icon: "view_in_ar",
					click: function() {
						Undo.initEdit({elements: Mesh.selected, selection: true, uv_only: true, uv_mode: true});
						// using a cheaty technique to keep the aspect correct
						let bResolution = [Project._texture_width, Project._texture_height];
						let Cwidth = Transformer.canvas.width;
						let Cheight = Transformer.canvas.height;
						/* selected meshes */
						// TextureGenerator.changeProjectResolution(Math.ceil(Cwidth / 16), Math.ceil(Cheight / 16));
						Mesh.selected.forEach(mesh => {
							/* selected faces */
							mesh.getSelectedFaces().forEach(key => {
								mesh.faces[key].vertices.forEach(Vkey => {
									let xy = WorldToScreen(mesh.vertices[Vkey][0], mesh.vertices[Vkey][1], mesh.vertices[Vkey][2], Transformer.camera, Cwidth, Cheight);
									mesh.faces[key].uv[Vkey] = [
										((xy.x / Cwidth)  * Math.min(bResolution[0], bResolution[1])) * (Cwidth/Cheight),
										((xy.y / Cheight) * Math.min(bResolution[0], bResolution[1]))
									];
								})
							});
						});
						// TextureGenerator.changeProjectResolution(...bResolution);
						Undo.finishEdit('Unwrap mesh face selection uv from view', {uv_only: true, uv_mode: true})
						Canvas.updateView({elements: Mesh.selected, element_aspects: {geometry: true, uv: true, faces: true}, selection: true})
						updateSelection();
					}
				})
			);
			UVchildren.push("_");
			function getEqualRes() {
				return Math.min(Project._texture_width, Project._texture_height);
			}
			UVchildren.push(
				new Action("uv_turnaround_projection", {
					name: "Cubic Projection",
					description: "Unwraps the UV map from the 6 sides of a cube",
					icon: "open_with",
					click: function() {
						/* selected meshes */
						function runEdit(margin, amend, split) {
							Undo.initEdit({elements: Mesh.selected, selection: true, uv_only: true, uv_mode: true}, amend);
							Mesh.selected.forEach(mesh => {
								if (mesh.getSelectedFaces().length) {
									let positions = [];
									let selectionBound = {min: [0,0,0], max: [0,0,0]}
									let gatheredDirs = {"1,0,0": [],"-1,0,0": [],"0,1,0": [],"0,-1,0": [],"0,0,1": [],"0,0,-1": []}
									/* selected faces */
									mesh.getSelectedFaces().forEach(key => {
										let face = mesh.faces[key];
										let normal = face.getNormal(true);
										face.vertices.forEach(Vkey => { positions.push(mesh.vertices[Vkey]) });
										// choose its direction
										let d0 = normal[0];
										let d1 = normal[1];
										let d2 = normal[2];
										let finalDir = [0,0,0];
										/* chooses the furthest from 0 ( there should be one )*/
										let furthest = Math.max(Math.abs(normal[0]), Math.abs(normal[1]), Math.abs(normal[2]));
										if (furthest == d0 * Math.sign(normal[0])) 		 {finalDir = [Math.sign(d0), 0, 0];}
											else if (furthest == d1 * Math.sign(normal[1])) {finalDir = [0, Math.sign(d1), 0];} 
											else if (furthest == d2 * Math.sign(normal[2])) {finalDir = [0, 0, Math.sign(d2)];}

										if (face.vertices.length >= 3) {
											gatheredDirs[finalDir.toString()].push(key);
										}
									});
									for (let i = 0; i < 3; i++) {
										positions.sort((a, b) => b[i] - a[i]);
										selectionBound.max[i] = positions[0][i] + .0001;
										selectionBound.min[i] = positions.last()[i] - positions[0][i] + .0001;
									}
									let x = 0;
									let S_res = getEqualRes();
									let _margin = 1 - (margin/100);
									for (const key in gatheredDirs) {
										x++;
										gatheredDirs[key].forEach(Fkey => {
											let face = mesh.faces[Fkey];
											let I = key.replace("-", "").replaceAll(",", "");
											I = I == "100"? [2,1]: I == "010"? [0,2]: [0,1];
											face.vertices.forEach(Vkey => {
												let uv = [
													(((selectionBound.max[I[0]] - mesh.vertices[Vkey][I[0]]) + .0001) * _margin) / -selectionBound.min[I[0]],
													(((selectionBound.max[I[1]] - mesh.vertices[Vkey][I[1]]) + .0001) * _margin) / -selectionBound.min[I[1]],
												]
												if (split) {
													// work with normalised values
													uv[0] *= .33;
													uv[1] *= .33;
													// remove the safety number
													uv[0] -= .0001;
													uv[1] -= .0001;
		
													uv[0] += (x % 3) * .33;
													uv[1] += x > 3 ? .33: 0;
												}
												
												// scale to project res
												uv[0] *= S_res;
												uv[1] *= S_res;
												
												mesh.faces[Fkey].uv[Vkey] = uv;
											});
										});
									}
								}
							});
							Undo.finishEdit('Unwrap mesh face selection (cubic projection)', {uv_only: true, uv_mode: true})
							Canvas.updateView({elements: Mesh.selected, element_aspects: {geometry: true, uv: true, faces: true}, selection: true})
							updateSelection();
						}
						runEdit(.1, false, true);
						Undo.amendEdit({
							margin: {type: 'number', value: 0, label: 'margin', min: 0, max: 100},
							split: {type: 'number', label: 'Split', value: 1, min: 0, max: 1},
						}, form => {
							runEdit(form.margin, true, form.split);
						})
					}
				})
			);

			children.push(
				new Action("uv_mapping", {
					name: "UV Mapping",
					icon: "map",
					children: UVchildren,
					condition,
				})
			);
			function test(v3) {
				return [v3[0],v3[1]];
			}
			function getFaceUVCenter(face){
				let uv = face.uv;
				let center = [0,0,0];
				let i = 0;
				for (const key in uv) {
					const currentPT = uv[key];
					center.V3_add(currentPT);
					i++;
				}
				center.V3_divide(i+1E-5);
				return test(center);
			}
			let operatorsCondition = { modes: ['edit'], features: ['meshes'], method: () => (Mesh.selected.length && BarItems.selection_mode.value == "object") };

			children.push(
				new Action("subdivide", {
					name: "Subdivide",
					icon: "content_cut",
					condition: operatorsCondition,
					click(){
						Undo.initEdit({elements: Mesh.selected, selection:true})
						//https://en.wikipedia.org/wiki/Catmull–Clark_subdivision_surface
						// custom data, just for manging other data easily
						class CMFace {
							/**
							 * @type Array<CMFace>
							 */
							static all = [];
							constructor(bbFace,key){
								this.key = key;
								this.bbFace = bbFace;
								this.facePoint = bbFace.getCenter();
								this.uuid = guid();
								this.facePointKey = bbFace.mesh.addVertices(this.facePoint)[0];
								this.edgePoints = [];// should be called edges
								this.vertices = []; // store sorted vertices before editing vertices positions and causing BB sorting problems
								CMFace.all.push(this);
							}
							for(vertex){
								return this.bbFace.vertices.includes(vertex);
							}
						}
						class CMEdge {
							/**
							 * @type Array<CMEdge>
							 */
							static all = [];
							constructor(a,b, edgePoint, center){
								this.vertexA = a;
								this.vertexB = b;
								this.uuid = guid();
								this.center = center;
								this.edgePoint = edgePoint;
								CMEdge.all.push(this);
							}
							equals(other){
								return 	(other.vertexA == this.vertexA && other.vertexB == this.vertexB) ||
										(other.vertexA == this.vertexB && other.vertexB == this.vertexA)
							}
							equalsV(a,b){
								return 	(a == this.vertexA && b == this.vertexB) ||
										(a == this.vertexB && b == this.vertexA)
							}
							equalsU(other){
								return this.uuid == other.uuid;
							}
							for(vertex){
								return (this.vertexA == vertex || this.vertexB == vertex);
							}
						}
						Mesh.selected.forEach(mesh => {
							CMEdge.all = []; CMFace.all = [];
							let originalVertices = Object.keys(mesh.vertices);
							let faces = mesh.faces;
							for (let key in faces) {
								let face = faces[key];
								
								let vertices = face.getSortedVertices();
								let len = vertices.length;
								if (len < 3) {
									continue;
								}
								let _face = new CMFace(face, key);
								_face.vertices = vertices;
								
								for (let i = 0; i < len; i++) {
									const a = vertices[i];	
									const b = vertices[(i+1)%len];
									let center = mesh.vertices[a].slice().V3_add(mesh.vertices[b]).V3_divide(2);
									
									let earlyEdge = CMEdge.all.find(e => e.equalsV(a,b));
									if (!earlyEdge) {
										let e = new CMEdge(a,b,null, center);
										_face.edgePoints.push(e);
									} else {
										_face.edgePoints.push(earlyEdge);
									}
								}
							}

							let lll = CMEdge.all.length;
							for (let i = 0; i < lll; i++) {
								let edge = CMEdge.all[i];
								let averagedP = [0,0,0];
								let llll = CMFace.all.length;
								let k = 0;
								for (let j = 0; j < llll; j++) {
									const face = CMFace.all[j];
									if (face.edgePoints.find(e => edge.equalsU(e))) {
										averagedP.V3_add(face.facePoint);
										k++;
									}
								};
								if (k < 2) {
									edge.edgePoint = edge.center;
								} else {
									edge.edgePoint = averagedP.V3_divide(k);
									edge.edgePoint.V3_add(edge.center).V3_divide(2);
								}
								edge.edgePointKey = mesh.addVertices(edge.edgePoint)[0];
							}

							let originalL = originalVertices.length;
							for (let index = 0; index < originalL;index++) {
								let key = originalVertices[index];
								let P = mesh.vertices[key]; // originalPoint;
								
								let F = [0,0,0]; // The average of touching face points
								let l = CMFace.all.length;
								let tlength = 0;
								let atleastFace = false;
								for (let i = 0; i < l; i++) {
									const face = CMFace.all[i];
									if (face.for(key)) {F.V3_add(face.facePoint);atleastFace=true; tlength++;}
								}
								if (!atleastFace) {
									continue;
								}
								F = F.V3_divide(tlength);

								let R = [0,0,0]; // The average of touching edge points
								l = CMEdge.all.length;
								let elength = 0;
								for (let i = 0; i < l; i++) {
									const edge = CMEdge.all[i];
									if (edge.for(key)) {R.V3_add(edge.center); elength++;}
								}
								R = R.V3_divide(elength);

								if (elength != tlength) {
									P.V3_add(R).V3_divide(2);
								} else {
									for (let i = 0; i < 3; i++) {
										P[i] = 	(F[i] + 
												(2*R[i]) + 
												((tlength - 3)*P[i])) / 
												tlength;
									}
								}
								mesh.vertices[key] = P;
							}

							let Cfaces = CMFace.all;
							let facesLength = Cfaces.length;
							for (let i = 0; i < facesLength; i++) {
								const currentFace = Cfaces[i];
								let bbFace = currentFace.bbFace;
								let vertices = currentFace.vertices;
								let verticesLen = vertices.length;

								for (let j = 0; j < verticesLen; j++) {
									const vertexA = vertices[j];
									const vertexB = vertices[(j+1)%verticesLen];
									const vertexBeforeA = vertices[((j-1)+verticesLen)%verticesLen];
									/*
									   -->
									c -- b -- z
									|	 |	  | |
									d -- a -- y v
									|	 |    |
									x -- w -- u
									*/

									let a = currentFace.facePointKey;
									let b = currentFace.edgePoints.find(e => e.equalsV(vertexA,vertexB)).edgePointKey;
									let c = vertexA;
									let d = currentFace.edgePoints.find(e => e.equalsV(vertexA,vertexBeforeA)).edgePointKey;
							
									let newFace = new MeshFace(mesh, bbFace).extend({vertices: [d,c,b,a]});

									// uv center point
									newFace.uv[currentFace.facePointKey] = getFaceUVCenter(bbFace);
									
									
									// uv edges
									let bPoint = [0,0,0].V3_add(bbFace.uv[vertexA]).V3_add(bbFace.uv[vertexB]);
									bPoint.V3_divide(2);

									let dPoint = [0,0,0].V3_add(bbFace.uv[vertexA]).V3_add(bbFace.uv[vertexBeforeA]);
									dPoint.V3_divide(2);
									
									newFace.uv[b] = test(bPoint);
									newFace.uv[d] = test(dPoint);
									//

									mesh.addFaces(newFace);
								}
								delete mesh.faces[currentFace.key];
							}
						});
						Undo.finishEdit("Subdivide selected meshs");
						Canvas.updateView({elements: Mesh.selected, element_aspects: {geometry: true, uv: true, faces: true}, selection: true})
					}
				})
			);
			class MTEdge {
				/**
				 * @type Array<MTEdge>
				 */
				static all = [];
				static reset(){
					MTEdge.all = [];
				}
				constructor(a,b, data){
					this.vertexA = a;
					this.vertexB = b;
					this.faces = [];
					this.indices = data.indices;
					this.center = data ? data.center: null;
					MTEdge.all.push(this);
				}
				equals(other){
					return 	(other.vertexA == this.vertexA && other.vertexB == this.vertexB) ||
							(other.vertexA == this.vertexB && other.vertexB == this.vertexA)
				}
				equalsV(a,b){
					return 	(a == this.vertexA && b == this.vertexB) ||
							(a == this.vertexB && b == this.vertexA)
				}
			}
			children.push(
				new Action("split_edges", {
					name: "Split Edges",
					icon: "vertical_split",
					description: "splits edges by an angle threshold",
					condition: operatorsCondition,
					click(){
						function runEdit(angle = 30,amend = false) {
							angle = Math.degToRad(angle)
							Undo.initEdit({elements: Mesh.selected, selection:true}, amend)
							Mesh.selected.forEach(mesh => {
								MTEdge.reset();

								let faces = mesh.faces;
								for (const key in faces) {
									let face = faces[key];

									let vertices = face.getSortedVertices();
									let len = vertices.length;
									if (len <= 2) continue; 
									for (let i = 0; i < len; i++) {
										const a = vertices[i];	
										const b = vertices[(i+1)%len];
										let center = mesh.vertices[a].slice().V3_add(mesh.vertices[b]).V3_divide(2);
										
										let earlyEdge = MTEdge.all.find(e => e.equalsV(a,b));
										if (!earlyEdge) {
											// indices in the non sorted order
											let indices = [];
											indices[0] = face.vertices.findIndex(vkey => vkey == a);
											indices[1] = face.vertices.findIndex(vkey => vkey == b);
											
											let e = new MTEdge(a,b, {center, indices});
											e.faces = [face];
										} else {
											if (earlyEdge.faces.length >= 2) {
												Blockbench.showQuickMessage("Error: non-manifold meshs are not allowed", 2000);
												throw new Error("non-manifold meshs are not allowed");
											}
											earlyEdge.faces.push(face);
										}
									}
								}
								
								let edgesLength = MTEdge.all.length; // skip calculating length each iteration
								for (let i = 0; i < edgesLength; i++) {
									let edge = MTEdge.all[i];
									if (edge.faces.length < 2) continue;

									/*
										ANGLE BETWEEN FACES

										   /θ\
										  /   \
									  f1 /     \ f2
										/       \
									*/

									let face1 = edge.faces[0];
									let face2 = edge.faces[1];
									// Duplicate code!!
									let disp1 = new THREE.Vector3().subVectors(face1.getCenter().V3_toThree(), edge.center.V3_toThree());
									let disp2 = new THREE.Vector3().subVectors(face2.getCenter().V3_toThree(), edge.center.V3_toThree());
									
									let theta = disp1.angleTo(disp2);

									// splitting process
									
									// saved indices since: faces update, edge vertices doesnt
									if (theta <= angle) {
										
										let newVertices = mesh.addVertices(mesh.vertices[edge.vertexA],mesh.vertices[edge.vertexB]);
										let indexA = edge.indices[0];
										let indexB = edge.indices[1];

										face1.uv[newVertices[0]] = face1.uv[edge.vertexA];
										face1.uv[newVertices[1]] = face1.uv[edge.vertexB];
										face1.vertices[indexA] = newVertices[0];
										face1.vertices[indexB] = newVertices[1];
									}
								}
							});
							Undo.finishEdit("split edges");
							Canvas.updateView({elements: Mesh.selected, element_aspects: {geometry: true, uv: true, faces: true}, selection: true})				
						}
						runEdit(180);
						Undo.amendEdit({
							angle: {label: "Angle", value: 180, min:0,max:180}
						}, form => {
							runEdit(form.angle, true);
						})
					}
				})
			);
			children.push("_");
			children.push(
				new Action("scatter", {
					name: "Scatter",
					description: "scatters selected meshs on the active mesh",
					icon: "scatter_plot",
					condition: operatorsCondition,
					click: function() {
						if (Mesh.selected.length < 2) {
							Blockbench.showQuickMessage('Error: must selected atleast two meshs');
							return;
						};
						let mesh = Mesh.selected.last();
						mesh.unselect();
			
						let group = new Group({name:"instances_on_"+mesh.name});
						group.init();

						function runEdit(density, amend=false) {
							let meshs = [];
							Undo.initEdit({elements: meshs, selection: true, group}, amend);

							let tmesh = mesh.mesh; // threejs mesh
				
				
							let faces = tmesh.geometry.getIndex();
							let vertices = tmesh.geometry.getAttribute('position');
							let l = faces.count;
							
							let selected = Mesh.selected;
							for (let d = 0; d < density; d++) {
								let i = Math.round((Math.random()*l)/3)*3; // random face index
								let t0 = new THREE.Vector3(
									vertices.getX(faces.getX(i)),
									vertices.getY(faces.getX(i)),
									vertices.getZ(faces.getX(i))
								);
								let t1 = new THREE.Vector3(
									vertices.getX(faces.getY(i)),
									vertices.getY(faces.getY(i)),
									vertices.getZ(faces.getY(i))
								);
								let t2 = new THREE.Vector3(
									vertices.getX(faces.getZ(i)),
									vertices.getY(faces.getZ(i)),
									vertices.getZ(faces.getZ(i))
								);

								
								tmesh.localToWorld( t0 );
								tmesh.localToWorld( t1 );
								tmesh.localToWorld( t2 );

								// f*ed up midpoint theroem
								let pointA = new THREE.Vector3().lerpVectors(t0,     t1,         Math.random());
								let pointB = new THREE.Vector3().lerpVectors(t0,     t2,         Math.random());
								let pointF = new THREE.Vector3().lerpVectors(pointA, pointB,     Math.random());
											
								let finalPoint = pointF;
								// scatter on points
								let otherMesh = selected[Math.floor(selected.length * Math.random())].duplicate();
								
								otherMesh.removeFromParent();
								otherMesh.parent = 'root';
								Outliner.root.push(otherMesh);

								let rotation = rotationFromDir(normalOfTri(t0,t1,t2));
								otherMesh.rotation = [Math.radToDeg(rotation.x),Math.radToDeg(rotation.y),Math.radToDeg(rotation.z)];
								otherMesh.origin = finalPoint.toArray();
								
								otherMesh.addTo(group);
								meshs.push(otherMesh);
							}
							Undo.finishEdit('scatter meshs');
							Canvas.updatePositions();
						}
						runEdit(3);
						
						Undo.amendEdit({
							density: {type: 'number', value: 3, label: 'Density', min: 0, max: 100},
						}, form => {
							runEdit(form.density, true);
						})
					}
				})
			);
			children.push(
				new Action("_array", {
					name: "Array",
					icon: "fas.fa-layer-group",
					description: "duplicates the object by a count while offsetting it by an offset",
					condition: operatorsCondition,
					click(){
						/**
						 * 
						 * @param {THREE.Vector3} offset _
						 */
						let selected = Mesh.selected;
						selected.forEach(mesh => { mesh.mesh.geometry.computeBoundingBox() });
						function runEdit(offset = [1,0,0],count = 1,amend = false) {
							offset = offset.V3_toThree();
							
							let elements = [];
							Undo.initEdit({elements, selection:true}, amend)
							selected.forEach(mesh => {
								let bounding = new THREE.Vector3();
								mesh.mesh.geometry.boundingBox.getSize(bounding)
								// let offset = _offset.clone();
								for (let i = 0; i < count; i++) {
									let newMesh = mesh.duplicate();
									newMesh.moveVector(offset.clone().multiplyScalar(i+1).clone().multiply(bounding));
									elements.push(newMesh);
								}
							});
							Undo.finishEdit("array selected meshs");
							//Canvas.updateView({elements: Mesh.selected, element_aspects: {geometry: true, uv: true, faces: true}, selection: true})				
						}
						runEdit();
						Undo.amendEdit({
							// shame vector input
							x: {type: 'number', value: 1, label: 'OffsetX', step:.1},
							y: {type: 'number', value: 0, label: 'OffsetY', step:.1},
							z: {type: 'number', value: 0, label: 'OffsetZ', step:.1},
							count: {type: 'number', value: 1, label: 'Count', min:0, max:50},
						}, form => {
							runEdit([form.x,form.y,form.z], form.count, true);
						})
					}
				})
			);
			generators.push(TerrainGenAction);
			generators.push(
				new Action("terrainse", {
					name: "Terrain Style Editor",
					icon: "draw",
					click(){
						let customStyle;
						new Dialog({
							title: "Terrain Generator Style Editor",
							buttons: ['Save', 'Cancel'],
							confirmEnabled: false,
							cancelIndex: 1,
							width: 650,
							onButton(i){
								if (i == 0) {
									localStorage.setItem('mt_customStyle', JSON.stringify(customStyle))
								}
							},
							lines: 
								[`
								<style>
									.tgseLevel {
										background-color: var(--color-back);
										border-top: 2px solid var(--color-ui);
										cursor: move;
										padding: 5px;
									}
									#tgse_levels{
										max-height: 250px;
										overflow-y: auto;
									}
								</style>
								<div class="dialog_bar form_bar form_bar_t">
									<label class="name_space_left">Result: </label>
									<canvas id="tgseCanvas" style="background:white" width="256", height="25"></canvas>
								</div>
								<div class="dialog_bar form_bar form_bar_t"> <button id="tgse_addlevel"><b>+</b> Add level</button> </div>
								<ul id="tgse_levels" class="ui-sortable">
								</ul>
								`],
						}).show();
						/**
						 * @type HTMLCanvasElement 
						 */
						let canvas = $('#tgseCanvas')[0];
						let ctx = canvas.getContext('2d');
						// UI PART
						let c = function(s) { return $(document.createElement(s)) }
						$("#tgse_levels").sortable({
							stop(){ computeMTStyle() }
						});
						$("#tgse_addlevel")[0].onclick = function(v,col,b, t=true) {
							let level = c("li");
							let deleteBtn = c('span').append(`<i class="material-icons icon tool" style="float:right">delete</i>`);
							let color = (new ColorPicker({
								label: false,
								name:"Color",
								private: true,
								color: col || "#fff",
							}));
							color.jq.spectrum({
								preferredFormat: "hex",
								color: col || "#fff",
								showInput: true,
								maxSelectionSize: 128,
								resetText: tl('generic.reset'),
								cancelText: tl('dialog.cancel'),
								chooseText: tl('dialog.confirm'),
								// !! EVERYTHING !!
								hide: function() 	{ computeMTStyle() },
								change: function()  { computeMTStyle() },
								move: function() 	{ computeMTStyle() },
							})
							let height = c('input').attr({type:"number",min:0,max:100,step:.5,value:typeof v == "number"?v:100}).addClass('dark_bordered focusable_input');
							let blending = c('input').attr({type:"number",min:0,max:100,step:.5,value:typeof b == "number"?b:100}).addClass('dark_bordered focusable_input');
							
							height[0].oninput = function() { computeMTStyle(); }
							blending[0].oninput = function() { computeMTStyle(); }
							deleteBtn[0].onclick = function() {
								ctx.clearRect(0,0,256,25);
								level.remove(); 
								computeMTStyle();
							};
							level
							.addClass("tgseLevel")
							.append(deleteBtn)
							.append(color.getNode())
							.append('&nbsp;&nbsp;')
							.append(c('label').text("At height percent of: "))
							.append('&nbsp;&nbsp;')
							.append(height)
							.append('&nbsp;&nbsp;')
							.append(c('label').text("With blending as: "))
							.append('&nbsp;&nbsp;')
							.append(blending)
							;
							
							$("#tgse_levels").append(level[0])
							if (t) {
								computeMTStyle();
							}
						}
						let cs = localStorage.mt_customStyle;								
						if (cs) {
							let custom = JSON.parse(cs);
							custom.forEach(h => {
								$("#tgse_addlevel")[0].onclick(h.height*100, h.col, h.blend*100);
							});
						} else {
							$("#tgse_addlevel")[0].onclick(0, "#f00", 0, false);
							$("#tgse_addlevel")[0].onclick(50, "#0f0", 100, false);
							$("#tgse_addlevel")[0].onclick(100, "#00f", 100);
						}

						// COMPILING part
						
						function computeMTStyle() {
							let children = $("#tgse_levels").children();
							customStyle = [];
							const l = children.length;
							for (let i = 0; i < l; i++) {
								const child = children.eq(i);
								const childChildren = child.children();
								
								let currentHeight = childChildren.eq(3).val()*1;
								let currentBlend = childChildren.eq(5).val()*1;
								let currentColor = childChildren.find('.sp-preview-inner').css('background-color');
								customStyle.push({
									height: currentHeight/100,
									col: currentColor,
									color: compileRGB(currentColor),
									blend: currentBlend/100
								});
							}
							// !uneffiecent code ahead!
							let image = new Image(256,1);
							image.src = TerrainGen.genTexture(256,1,window.gradient256, customStyle, false);
							image.onload=function() {
								ctx.drawImage(image, 0,0, 256, 25);
							}
						}
					}
				})
			);
			generators.push("_");
			/**
			 * 
			 * @param {THREE.BufferGeometry} geometry geometry should be non-indexed
			 */
			function GeometryThreeToBB(geometry) {
				let mesh = new Mesh({vertices:{}});
				
				let vertices = geometry.getAttribute('position');
				let vertexLength = vertices.count;

				let newVertices = [];
				let positions = {}; // remove duplicate vertices on the go
				for (let i = 0; i < vertexLength; i++) {
					let v = [
						vertices.getX(i),
						vertices.getY(i),
						vertices.getZ(i)
					]
					// Object[myArray] is litterly saying: Object[myArray.toString()]: Object[`${myArray[0]},${myArray[1]},${myArray[2]}`]
					if (positions[v]) {
						newVertices.push(positions[v].key)
					} else {
						newVertices.push(
							mesh.addVertices(v)[0]
						)
						positions[v] = {v, key: newVertices.last()};	
					}
				}
				for (let i = 0; i < vertexLength; i+=3) {
					let face = new MeshFace(mesh, {
						vertices: [
							newVertices[i+0],
							newVertices[i+1],
							newVertices[i+2]
						]
					});
					mesh.addFaces(face);
				}
				return mesh;
			}
			// https://base64.guru/developers/javascript/examples/unicode-strings
			// fix stupid bug with unicodes
			function utoa(data) {
				return btoa(unescape(encodeURIComponent(data)));
			}
			generators.push(
				new Action("textmesh", {
					name: "Text Mesh",
					icon: "format_size",
					click(){
						new Dialog ({
							title: "Generate Text",
							lines: [
								`<style>
								#mt_typeface {
									display: flex;
									left: 20px;
									right: 0;
									gap: 5px;
									cursor: pointer;
								}
								#mt_typeface:hover {
									color: var(--color-light);
								}
								</style>`,
								`<a id="mt_typeface" class=""><i class="material-icons">spellcheck</i><span style="text-decoration: underline;">TypeFace converter</span></a>`,
								`<i>when converting, <strong>disable</strong> "Reverse font direction"</i>`
								
							],
							form: {
								text: {label:"Text", type:'textarea', value:"My text"},
								file: {label:"Typeface Font", type:'file', extensions: ['json'],filetype: 'JSON', readtype:"text"},
								size: {label:"Size", type:"number", value:8,min:0},
								height: {label:"Thickness", type:"number", value:2,min:0},
								curveSegments: {label:"Resoultion", type:"number", value:1,min:0},
								_: "_",
								bevelThickness: {label:"bevelThickness", type:"number", value:0,min:0},
								bevelSize:{label:"bevelSize", type:"number", value:8,min:0},
								bevelOffset:{label:"bevelOffset", type:"number", value:0,min:0},
								bevelSegments :{label:"bevelSegments", type:"number", value:1,min:0},
							},
							onConfirm(out){
								if (!out.file) {
									throw new Error("Not a valid font file");
								}
								let base64 = "data:text/plain;base64," + utoa(this.form.file.content);
								const loader = new THREE.FontLoader();

								loader.load(base64, function ( font ) {
									function runEdit(s, amended=false) {
										let elements = [];
										Undo.initEdit({elements, selection: true}, amended);
										const geometry = new THREE.TextGeometry( out.text, {
											font: 			font,
											size: 			s.size,
											height: 		s.height,
											curveSegments: 	s.curveSegments,
											bevelEnabled: 	s.bevelThickness > 0,
											bevelThickness: s.bevelThickness/16,
											bevelSize: 		s.bevelSize/16,
											bevelOffset: 	s.bevelOffset/16,
											bevelSegments: 	s.bevelSegments
										});
										let mesh = GeometryThreeToBB(geometry);										
										
										mesh.init();
										elements.push(mesh);
										mesh.select();
										Undo.finishEdit('Generate Mesh');
									}
									runEdit(out);

									Undo.amendEdit({
										size: {label:"Size", type:"number", value:8,min:0},
										height: {label:"Thickness", type:"number", value:2,min:0},
										curveSegments: {label:"Resoultion", type:"number", value:1,min:0},
										bevelThickness: {label:"bevelThickness", type:"number", value:0,min:0},
										bevelSize:{label:"bevelSize", type:"number", value:8,min:0},
										bevelOffset:{label:"bevelOffset", type:"number", value:0,min:0},
										bevelSegments :{label:"bevelSegments", type:"number", value:1,min:0},
									}, form => {
										runEdit(form,true)
									})
								});
							}
						}).show();
						$("#mt_typeface")[0].onclick = function() {
							Blockbench.openLink("http://gero3.github.io/facetype.js/");
						}
					}
				})
			);

			GensAction = new Action("meshtools_gens", {
				name: "MTools Generate",
				icon: "fas.fa-vector-square",
				children: generators,
			});
			MeshToolsAction = new Action("meshtools", {
				name: "MTools",
				icon: "fas.fa-vector-square",
				children,
			});
			Mesh.prototype.menu.addAction(MeshToolsAction);
			MenuBar.addAction(GensAction, 'filter');
		},
		onunload() {
			MeshToolsAction.delete();
			GensAction.delete();
			Mesh.prototype.menu.removeAction("meshtools");
		},
	});
})()