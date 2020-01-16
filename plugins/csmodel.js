(function() {

var import_action, export_action;


Plugin.register('csmodel', {
	title: 'CraftStudio Model Format',
	icon: 'star',
	author: 'JannisX11',
	description: 'Allows to import and export CraftStudio Models (.csmodel).',
	about: `To **import** a model from CraftStudio, go to the CraftStudio project settings and export a cspack file.
		Open this file in an archive manager (like 7zip) and extract the model file.
		Import the file into Blockbench using the import menu.
		\nTo **export** a file, export a .csmodel file from Blockbench and drop it into an existing .cspack file into the Models folder.
		Make sure it is using the same file name as the old model in the pack. Import the .cspack into CraftStudio and select the models you want to import.`,
	version: '0.1.0',
	variant: 'desktop',
	onload() {

		getNativeSize = function(cube, face) {
			var side = face.direction;
			var size = {};
			if (side == 'north' || side == 'south') {
				return [cube.size('0'),
					cube.size('1')]
			} else if (side == 'east' || side == 'west') {
				return [cube.size('2'),
					cube.size('1')]
			} else if (side == 'up' || side == 'down') {
				return [cube.size('0'),
					cube.size('2')]
			}
		}
		var textDecoder;

		class BinaryReader {
			constructor(buffer) {
				this.view = new DataView(buffer);
				this.cursor = 0;
				this.textDecoder = new TextDecoder();
			}
			ReadUInt8() {
				var val;
				val = this.view.getUint8(this.cursor);
				this.cursor += 1;
				return val;
			}
			ReadUInt16() {
				var val;
				val = this.view.getUint16(this.cursor, true);
				this.cursor += 2;
				return val;
			}
			ReadInt32() {
				var val;
				val = this.view.getInt32(this.cursor, true);
				this.cursor += 4;
				return val;
			}
			ReadUInt32() {
				var val;
				val = this.view.getUint32(this.cursor, true);
				this.cursor += 4;
				return val;
			}
			ReadFloat32() {
				var val;
				val = this.view.getFloat32(this.cursor, true);
				this.cursor += 4;
				return val;
			}
			ReadFloat64() {
				var val;
				val = this.view.getFloat64(this.cursor, true);
				this.cursor += 8;
				return val;
			}
			ReadBoolean() {
				return this.ReadUInt8() !== 0;
			}
			Read7BitEncodedInt() {
				var bitIndex, num, returnValue;
				returnValue = 0;
				bitIndex = 0;
				while (true) {
					if (bitIndex !== 35) {
						num = this.ReadUInt8();
						returnValue |= (num & 127) << bitIndex;
						bitIndex += 7;
					} else {
						throw new Error("Invalid 7-bit encoded int");
					}
					if ((num & 128) === 0) {
						break;
					}
				}
				return returnValue;
			}
			ReadString() {
				var length, val;
				length = this.Read7BitEncodedInt();
				val = this.DecodeString(new Uint8Array(this.view.buffer.slice(this.cursor, this.cursor + length)));
				this.cursor += length;
				return val;
			}
			ReadPoint() {
				return {
					x: this.ReadInt32(),
					y: this.ReadInt32()
				};
			}
			ReadVector2() {
				return new THREE.Vector2(this.ReadFloat32(), this.ReadFloat32());
			}
			ReadVector3() {
				return new THREE.Vector3(this.ReadFloat32(), this.ReadFloat32(), this.ReadFloat32());
			}
			ReadIntVector3() {
				return new THREE.Vector3(this.ReadInt32(), this.ReadInt32(), this.ReadInt32());
			}
			ReadQuaternion() {
				var w;
				w = this.ReadFloat32();
				return new THREE.Quaternion(this.ReadFloat32(), this.ReadFloat32(), this.ReadFloat32(), w);
			}
			ReadBytes(length) {
				var bytes;
				bytes = new Uint8Array(this.view.buffer.slice(this.cursor, this.cursor + length));
				this.cursor += length;
				return bytes;
			}
			DecodeString(array) {
				return this.textDecoder.decode(array);
			};
		};
		class BinaryWriter {
			constructor(minimal_length) {
				this.array = new Uint8Array(minimal_length);
				this.buffer = this.array.buffer;
				this.view = new DataView(this.buffer);
				this.cursor = 0;
				this.textEncoder = new TextEncoder();
			}
			expand(n) {
				var new_length = this.cursor+1+n;
				if (new_length > this.buffer.byteLength) {
					var oldArray = this.array;
					this.array = new Uint8Array(new_length);
					this.buffer = this.array.buffer;
					this.array.set(oldArray);
					this.view = new DataView(this.buffer)
				}
			}
			WriteUInt8(value) {
				this.expand(1);
				this.view.setUint8(this.cursor, value);
				this.cursor += 1;
			}
			WriteUInt16(value) {
				this.expand(2);
				this.view.setUint16(this.cursor, value, true);
				this.cursor += 2;
			}
			WriteInt32(value) {
				this.expand(4);
				this.view.setInt32(this.cursor, value, true);
				this.cursor += 4;
			}
			WriteUInt32(value) {
				this.expand(4);
				this.view.setUint32(this.cursor, value, true);
				this.cursor += 4;
			}
			WriteFloat32(value) {
				this.expand(4);
				this.view.setFloat32(this.cursor, value, true);
				this.cursor += 4;
			}
			WriteFloat64(value) {
				this.expand(8);
				this.view.setFloat64(this.cursor, value, true);
				this.cursor += 8;
			}
			WriteBoolean(value) {
				this.WriteUInt8(value ? 1 : 0)
			}
			Write7BitEncodedInt(value) {
				while (value >= 0x80) {
					this.WriteUInt8(value | 0x80);
					value = value >> 7;
				}
				this.WriteUInt8(value);
			}
			WriteString(string) {
				var array = this.EncodeString(string);
				this.Write7BitEncodedInt(array.byteLength);
				this.WriteBytes(array);
			}
			WritePoint(point) {
				this.expand(8);
				this.view.setInt32(this.cursor, point.x, true);
				this.cursor += 4;
				this.view.setInt32(this.cursor, point.y, true);
				this.cursor += 4;
			}
			WriteVector2(vector) {
				this.expand(8);
				this.view.setFloat32(this.cursor, vector.x, true);
				this.cursor += 4;
				this.view.setFloat32(this.cursor, vector.y, true);
				this.cursor += 4;
			}
			WriteVector3(vector) {
				this.expand(12);
				this.view.setFloat32(this.cursor, vector.x, true);
				this.cursor += 4;
				this.view.setFloat32(this.cursor, vector.y, true);
				this.cursor += 4;
				this.view.setFloat32(this.cursor, vector.z, true);
				this.cursor += 4;
			}
			WriteIntVector3(vector) {
				this.expand(12);
				this.view.setInt32(this.cursor, vector.x, true);
				this.cursor += 4;
				this.view.setInt32(this.cursor, vector.y, true);
				this.cursor += 4;
				this.view.setInt32(this.cursor, vector.z, true);
				this.cursor += 4;
			}
			WriteQuaternion(quat) {
				this.expand(16);
				this.view.setFloat32(this.cursor, quat.w, true);
				this.cursor += 4;
				this.view.setFloat32(this.cursor, quat.x, true);
				this.cursor += 4;
				this.view.setFloat32(this.cursor, quat.y, true);
				this.cursor += 4;
				this.view.setFloat32(this.cursor, quat.z, true);
				this.cursor += 4;
			}
			WriteBytes(array) {
				this.expand(array.byteLength);
				this.array.set(array, this.cursor);
				this.cursor += array.byteLength;
			}
			EncodeString(string) {
				return this.textEncoder.encode(string);
			}
		};


		var oppositeFaces = {
			'south': 'north',
			'north': 'south',
			'east': 'west',
			'down': 'up',
			'west': 'east',
			'up': 'down',
		}
		var faceAxes = {
			'north': 2,
			'east': 0,
			'up': 1,
			'south': 2,
			'west': 0,
			'down': 1,
		}


		var codec = new Codec('csmodel', {
			name: 'CraftStudio',
			extension: 'csmodel',
			remember: false,
			compile(options) {

				var writer = new BinaryWriter(100);
				var fake_cube = new Cube({
					from: [0, 0, 0],
					to: [0, 0, 0],
				})

				var ids = {};
				var id = -1;
				var offsets = {};

				writer.WriteUInt8(0);//asset type
				writer.WriteUInt16(5);//format version
				writer.WriteUInt16(0);//next unused node id
				writer.WriteUInt16(0);//node count

				function processGroup(group, parent) {
					//get main cube
					var main_cube;
					for (var child of group.children) {
						if (child instanceof Cube && child.rotation.allEqual(0)) {
							main_cube = child;
							break;
						}
					}
					if (!main_cube) {
						//add fake 0x0x0 cube
						processCube(group, parent);
					} else {
						processCube(main_cube, parent, group)
					}
					ids[group.uuid] = id;

					for (var child of group.children) {
						if (child instanceof Cube && child != main_cube) {
							processCube(child, group, false)
						} else if (child instanceof Group) {
							processGroup(child, group)
						}
					}
				}
				function processCube(obj, parent, group) {
					id++;
					var cube = (obj instanceof Cube) ? obj : fake_cube;
					if (group) obj = group

					writer.WriteUInt16(id);
					if (parent && ids[parent.uuid] !== undefined) {
						writer.WriteUInt16(ids[parent.uuid]);
					} else {
						writer.WriteUInt16(-1);
					}
					writer.WriteString(obj.name);
					var size = cube.size(undefined, true);
					var center = [
						cube.from[0] + size[0]/2,
						cube.from[1] + size[1]/2,
						cube.from[2] + size[2]/2,
					]
					var pivot = obj.origin
					var pos = new THREE.Vector3().fromArray(pivot);
					if (parent) {
						pos.sub(new THREE.Vector3().fromArray(parent.origin));
					} else {
						pos.add(new THREE.Vector3().fromArray(obj.origin));
					}
					if (parent && ids[parent.uuid]) {
						pos.sub(offsets[ids[parent.uuid]]);
					}
					var offset = new THREE.Vector3(center[0] - pivot[0], center[1] - pivot[1], center[2] - pivot[2]);
					var euler = new THREE.Euler().setFromDegreeArray(obj.rotation);
					var rotation = new THREE.Quaternion().setFromEuler(euler);
					var scale = new THREE.Vector3(
						((size[0]+2*cube.inflate) / size[0]) * (size[0] < 0 ?-1:1),
						((size[1]+2*cube.inflate) / size[1]) * (size[1] < 0 ?-1:1),
						((size[2]+2*cube.inflate) / size[2]) * (size[2] < 0 ?-1:1)
					);
					offsets[id] = new THREE.Vector3().copy(offset);

					writer.WriteVector3(pos.divideScalar(16));
					writer.WriteVector3(offset.divideScalar(16));
					writer.WriteVector3(scale);
					writer.WriteQuaternion(rotation);
					writer.WriteUInt16(Math.abs(size[0]));
					writer.WriteUInt16(Math.abs(size[1]));
					writer.WriteUInt16(Math.abs(size[2]));

					writer.WriteUInt8(2);

					for (var face_key in oppositeFaces) {
						var face = cube.faces[face_key];
						writer.WritePoint({
							x: face.uv[0],
							y: face.uv[1]
						})
					}
					for (var face_key in oppositeFaces) {
						var code = 0;
						var x_m = face_key != 'up' && face_key != 'down';
						var y_m = face_key != 'up';

						if (face.rotation == 90) code += 1;
						if (face.rotation == 180) code += 2;
						if (face.rotation == 270) code += 4;
						if (face.uv[0] > face.uv[2] != x_m) code += 8;
						if (face.uv[1] > face.uv[3] != y_m) code += 16;

						writer.WriteUInt8(code);
					}

				}
				Outliner.root.forEach(obj => {
					if (obj instanceof Group) {
						processGroup(obj);
					} else if (obj instanceof Cube) {
						processCube(obj)
					}
				})

				writer.view.setUint16(5, id+1, true);

				if (textures[0]) {
					var src = textures[0].getBase64();
				} else {
					var src = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVQ4T2P8////fwYKAOOoAQyjYcAwGgYMwyIMACUfP9Eb4ExuAAAAAElFTkSuQmCC'
				}
				var array = Uint8Array.from(atob(src), c => c.charCodeAt(0));
				writer.WriteUInt32(array.length);
				writer.WriteBytes(array);
				writer.WriteUInt16(0);


				return writer.array;
			},
			parse(model, path) {

				newProject(Formats.bedrock)

				var reader = new BinaryReader(model.buffer);

				var nodes = {};
				var face_info = {};
				var node_data = {};

				reader.ReadUInt8();//asset type
				reader.ReadUInt16();//format version
				reader.ReadUInt16();//next unused node id

				var node_count = reader.ReadUInt16();
				for (var i = 0; i < node_count; i++) {
					(function() {
						var id = reader.ReadUInt16();
						var parent_id = reader.ReadUInt16();
						var name = reader.ReadString();
						var pos = reader.ReadVector3().multiplyScalar(16);
						var offset = reader.ReadVector3().multiplyScalar(16);
						node_data[id] = {
							name,
							pos: new THREE.Vector3().copy(pos),
							offset: new THREE.Vector3().copy(offset)
						}
						var scale = reader.ReadVector3();
						var rotation = new THREE.Euler().setFromQuaternion(reader.ReadQuaternion(), 'ZYX').toArray();
						rotation.forEach((n, i) =>  {
							rotation[i] = Math.radToDeg(n);
						})
						var size = [
							reader.ReadUInt16() * scale.x,
							reader.ReadUInt16() * scale.y,
							reader.ReadUInt16() * scale.z
						]
						var uv_mode = reader.ReadUInt8();
						var faces = {
							south: 	{offset: reader.ReadPoint()},
							north: 	{offset: reader.ReadPoint()},
							east: 	{offset: reader.ReadPoint()},
							down: 	{offset: reader.ReadPoint()},
							west:	{offset: reader.ReadPoint()},
							up: 	{offset: reader.ReadPoint()},
						}
						faces.south.transform	= reader.ReadUInt8();
						faces.north.transform	= reader.ReadUInt8();
						faces.east.transform	= reader.ReadUInt8();
						faces.down.transform	= reader.ReadUInt8();
						faces.west.transform	= reader.ReadUInt8();
						faces.up.transform		= reader.ReadUInt8();

						if (nodes[parent_id]) {
							pos.add(new THREE.Vector3().fromArray(nodes[parent_id].origin))
							pos.add(node_data[parent_id].offset)
						}
						var from = [
							pos.x + offset.x - size[0]/2,
							pos.y + offset.y - size[1]/2,
							pos.z + offset.z - size[2]/2,
						]
						var to = [
							from[0] + size[0],
							from[1] + size[1],
							from[2] + size[2],
						]

						var cube = new Cube({
							name,
							origin: pos.toArray(),
							from, to,
							rotation
						}).init();
						nodes[id] = cube;
						face_info[cube.uuid] = faces;
						faces.scale = scale;
						faces.cube = cube;

						if (nodes[parent_id]) {
							var parent = nodes[parent_id];
							if (parent instanceof Cube) {
								var parent_cube = parent;
								parent = nodes[parent_id] = new Group({
									name: parent_cube.name, 
									origin: parent_cube.origin,
									rotation: parent_cube.rotation
								}).addTo(parent_cube).init();
								parent_cube.addTo(parent);
								parent_cube.extend({rotation: [0, 0, 0]})
							}
							cube.addTo(parent);
						}
					})()
				}

				var image = reader.ReadBytes(reader.ReadUInt32());
				var url = 'data:image/png;base64,'+ btoa(String.fromCharCode.apply(null, image));
				var tex = new Texture({name: 'texture'}).fromDataURL(url).add();
				tex.load_callback = function() {
					Project.texture_width = tex.width;
					Project.texture_height = tex.height;

					Project.box_uv = false;

					for (var uuid in face_info) {
						var info = face_info[uuid];
						var cube = info.cube;
						for (var face_key in cube.faces) {
							var face = cube.faces[face_key];
							face.extend({uv: [
								info[face_key].offset.x,
								info[face_key].offset.y,
								0, 0
							]});
							var native_size = getNativeSize(cube, face);
							face.uv_size = [
								native_size[0],
								native_size[1],
							]
							var code = info[face_key].transform;
							if (code >= 16) {
								var size = face.uv[3] - face.uv[1];
								face.uv[3] -= size*2;
								code -= 16;
							}
							if (code >= 8) {
								var size = face.uv[2] - face.uv[0];
								face.uv[2] -= size*2;
								code -= 8;
							}
							switch (code) {
								case 4: face.rotation = 270; break;
								case 2: face.rotation = 180; break;
								case 1: face.rotation = 90; break;
							}
						}
					}
					Canvas.updateAll()
				}

			}
		})

		import_action = new Action('import_csmodel', {
			name: 'Import CraftStudio Model',
			description: '',
			icon: 'star',
			category: 'file',
			click() {
				ElecDialogs.showOpenDialog(
				    currentwindow,
				    {
				        title: 'Import csmodel',
				        dontAddToRecent: true,
				        filters: [{
				            name: '',
				            extensions: ['csmodel']
				        }]
				    },
				function (files) {
				    if (!files) return;
				    fs.readFile(files[0], (err, data) => {
				        if (err) return;
				        codec.parse(data, files[0])
				    });
				});
			}
		})
		export_action = new Action('export_csmodel', {
			name: 'Export CraftStudio Model',
			description: '',
			icon: 'star',
			category: 'file',
			click() {
				codec.export();
			}
		})

		MenuBar.addAction(import_action, 'file.import')
		MenuBar.addAction(export_action, 'file.export')

	},
	onunload() {
		import_action.delete();
		export_action.delete();
	}
});

})()
