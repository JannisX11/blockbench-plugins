var nbt = new function() {

	'use strict';

	if (typeof ArrayBuffer === 'undefined') {
		throw new Error('Missing required type ArrayBuffer');
	}
	if (typeof DataView === 'undefined') {
		throw new Error('Missing required type DataView');
	}
	if (typeof Uint8Array === 'undefined') {
		throw new Error('Missing required type Uint8Array');
	}

	/** @exports nbt */

	var nbt = this;
	//var zlib = typeof require !== 'undefined' ? require('zlib') : window.zlib;

	/**
	 * A mapping from type names to NBT type numbers.
	 * {@link module:nbt.Writer} and {@link module:nbt.Reader}
	 * have correspoding methods (e.g. {@link module:nbt.Writer#int})
	 * for every type.
	 *
	 * @type Object<string, number>
	 * @see module:nbt.tagTypeNames */
	nbt.tagTypes = {
		'end': 0,
		'byte': 1,
		'short': 2,
		'int': 3,
		'long': 4,
		'float': 5,
		'double': 6,
		'byteArray': 7,
		'string': 8,
		'list': 9,
		'compound': 10,
		'intArray': 11
	};

	/**
	 * A mapping from NBT type numbers to type names.
	 *
	 * @type Object<number, string>
	 * @see module:nbt.tagTypes */
	nbt.tagTypeNames = {};
	(function() {
		for (var typeName in nbt.tagTypes) {
			if (nbt.tagTypes.hasOwnProperty(typeName)) {
				nbt.tagTypeNames[nbt.tagTypes[typeName]] = typeName;
			}
		}
	})();

	function hasGzipHeader(data) {
		var head = new Uint8Array(data.slice(0, 2));
		return head.length === 2 && head[0] === 0x1f && head[1] === 0x8b;
	}

	function encodeUTF8(str) {
		var array = [], i, c;
		for (i = 0; i < str.length; i++) {
			c = str.charCodeAt(i);
			if (c < 0x80) {
				array.push(c);
			} else if (c < 0x800) {
				array.push(0xC0 | c >> 6);
				array.push(0x80 | c         & 0x3F);
			} else if (c < 0x10000) {
				array.push(0xE0 |  c >> 12);
				array.push(0x80 | (c >>  6) & 0x3F);
				array.push(0x80 |  c        & 0x3F);
			} else {
				array.push(0xF0 | (c >> 18) & 0x07);
				array.push(0x80 | (c >> 12) & 0x3F);
				array.push(0x80 | (c >>  6) & 0x3F);
				array.push(0x80 |  c        & 0x3F);
			}
		}
		return array;
	}

	function decodeUTF8(array) {
		var codepoints = [], i;
		for (i = 0; i < array.length; i++) {
			if ((array[i] & 0x80) === 0) {
				codepoints.push(array[i] & 0x7F);
			} else if (i+1 < array.length &&
						(array[i]   & 0xE0) === 0xC0 &&
						(array[i+1] & 0xC0) === 0x80) {
				codepoints.push(
					((array[i]   & 0x1F) << 6) |
					( array[i+1] & 0x3F));
			} else if (i+2 < array.length &&
						(array[i]   & 0xF0) === 0xE0 &&
						(array[i+1] & 0xC0) === 0x80 &&
						(array[i+2] & 0xC0) === 0x80) {
				codepoints.push(
					((array[i]   & 0x0F) << 12) |
					((array[i+1] & 0x3F) <<  6) |
					( array[i+2] & 0x3F));
			} else if (i+3 < array.length &&
						(array[i]   & 0xF8) === 0xF0 &&
						(array[i+1] & 0xC0) === 0x80 &&
						(array[i+2] & 0xC0) === 0x80 &&
						(array[i+3] & 0xC0) === 0x80) {
				codepoints.push(
					((array[i]   & 0x07) << 18) |
					((array[i+1] & 0x3F) << 12) |
					((array[i+2] & 0x3F) <<  6) |
					( array[i+3] & 0x3F));
			}
		}
		return String.fromCharCode.apply(null, codepoints);
	}

	/* Not all environments, in particular PhantomJS, supply
	   Uint8Array.slice() */
	function sliceUint8Array(array, begin, end) {
		if ('slice' in array) {
			return array.slice(begin, end);
		} else {
			return new Uint8Array([].slice.call(array, begin, end));
		}
	}

	/**
	 * In addition to the named writing methods documented below,
	 * the same methods are indexed by the NBT type number as well,
	 * as shown in the example below.
	 *
	 * @constructor
	 * @see module:nbt.Reader
	 *
	 * @example
	 * var writer = new nbt.Writer();
	 *
	 * // all equivalent
	 * writer.int(42);
	 * writer[3](42);
	 * writer(nbt.tagTypes.int)(42);
	 *
	 * // overwrite the second int
	 * writer.offset = 0;
	 * writer.int(999);
	 *
	 * return writer.buffer; */
	nbt.Writer = function() {
		var self = this;

		/* Will be resized (x2) on write if necessary. */
		var buffer = new ArrayBuffer(1024);

		/* These are recreated when the buffer is */
		var dataView = new DataView(buffer);
		var arrayView = new Uint8Array(buffer);

		/**
		 * The location in the buffer where bytes are written or read.
		 * This increases after every write, but can be freely changed.
		 * The buffer will be resized when necessary.
		 *
		 * @type number */
		this.offset = 0;

		// Ensures that the buffer is large enough to write `size` bytes
		// at the current `self.offset`.
		function accommodate(size) {
			var requiredLength = self.offset + size;
			if (buffer.byteLength >= requiredLength) {
				return;
			}

			var newLength = buffer.byteLength;
			while (newLength < requiredLength) {
				newLength *= 2;
			}

			var newBuffer = new ArrayBuffer(newLength);
			var newArrayView = new Uint8Array(newBuffer);
			newArrayView.set(arrayView);

			// If there's a gap between the end of the old buffer
			// and the start of the new one, we need to zero it out
			if (self.offset > buffer.byteLength) {
				newArrayView.fill(0, buffer.byteLength, self.offset);
			}

			buffer = newBuffer;
			dataView = new DataView(newBuffer);
			arrayView = new Uint8Array(newBuffer);
		}

		function write(dataType, size, value) {
			accommodate(size);
			dataView['set' + dataType](self.offset, value);
			self.offset += size;
			return self;
		}

		/**
		 * Returns the writen data as a slice from the internal buffer,
		 * cutting off any padding at the end.
		 *
		 * @returns {ArrayBuffer} a [0, offset] slice of the interal buffer */
		this.getData = function() {
			accommodate(0);  /* make sure the offset is inside the buffer */
			return buffer.slice(0, self.offset);
		};

		/**
		 * @method module:nbt.Writer#byte
		 * @param {number} value - a signed byte
		 * @returns {module:nbt.Writer} itself */
		this[nbt.tagTypes.byte] = write.bind(this, 'Int8', 1);

		/**
		 * @method module:nbt.Writer#ubyte
		 * @param {number} value - an unsigned byte
		 * @returns {module:nbt.Writer} itself */
		this.ubyte = write.bind(this, 'Uint8', 1);

		/**
		 * @method module:nbt.Writer#short
		 * @param {number} value - a signed 16-bit integer
		 * @returns {module:nbt.Writer} itself */
		this[nbt.tagTypes.short] = write.bind(this, 'Int16', 2);

		/**
		 * @method module:nbt.Writer#int
		 * @param {number} value - a signed 32-bit integer
		 * @returns {module:nbt.Writer} itself */
		this[nbt.tagTypes.int] = write.bind(this, 'Int32', 4);

		/**
		 * @method module:nbt.Writer#float
		 * @param {number} value - a signed 32-bit float
		 * @returns {module:nbt.Writer} itself */
		this[nbt.tagTypes.float] = write.bind(this, 'Float32', 4);

		/**
		 * @method module:nbt.Writer#float
		 * @param {number} value - a signed 64-bit float
		 * @returns {module:nbt.Writer} itself */
		this[nbt.tagTypes.double] = write.bind(this, 'Float64', 8);

		/**
		 * As JavaScript does not support 64-bit integers natively, this
		 * method takes an array of two 32-bit integers that make up the
		 * upper and lower halves of the long.
		 *
		 * @method module:nbt.Writer#long
		 * @param {Array.<number>} value - [upper, lower]
		 * @returns {module:nbt.Writer} itself */
		this[nbt.tagTypes.long] = function(value) {
			self.int(value[0]);
			self.int(value[1]);
			return self;
		};

		/**
		 * @method module:nbt.Writer#byteArray
		 * @param {Array.<number>|Uint8Array|Buffer} value
		 * @returns {module:nbt.Writer} itself */
		this[nbt.tagTypes.byteArray] = function(value) {
			this.int(value.length);
			accommodate(value.length);
			arrayView.set(value, this.offset);
			this.offset += value.length;
			return this;
		};

		/**
		 * @method module:nbt.Writer#intArray
		 * @param {Array.<number>} value
		 * @returns {module:nbt.Writer} itself */
		this[nbt.tagTypes.intArray] = function(value) {
			this.int(value.length);
			var i;
			for (i = 0; i < value.length; i++) {
				this.int(value[i]);
			}
			return this;
		};

		/**
		 * @method module:nbt.Writer#string
		 * @param {string} value
		 * @returns {module:nbt.Writer} itself */
		this[nbt.tagTypes.string] = function(value) {
			var bytes = encodeUTF8(value);
			this.short(bytes.length);
			accommodate(bytes.length);
			arrayView.set(bytes, this.offset);
			this.offset += bytes.length;
			return this;
		};

		/**
		 * @method module:nbt.Writer#list
		 * @param {Object} value
		 * @param {number} value.type - the NBT type number
		 * @param {Array} value.value - an array of values
		 * @returns {module:nbt.Writer} itself */
		this[nbt.tagTypes.list] = function(value) {
			this.byte(nbt.tagTypes[value.type]);
			this.int(value.value.length);
			var i;
			for (i = 0; i < value.value.length; i++) {
				this[value.type](value.value[i]);
			}
			return this;
		};

		/**
		 * @method module:nbt.Writer#compound
		 * @param {Object} value - a key/value map
		 * @param {Object} value.KEY
		 * @param {string} value.KEY.type - the NBT type number
		 * @param {Object} value.KEY.value - a value matching the type
		 * @returns {module:nbt.Writer} itself
		 *
		 * @example
		 * writer.compound({
		 * foo: { type: 'int', value: 12 },
		 * bar: { type: 'string', value: 'Hello, World!' }
		 * }); */
		this[nbt.tagTypes.compound] = function(value) {
			var self = this;
			Object.keys(value).map(function (key) {
				self.byte(nbt.tagTypes[value[key].type]);
				self.string(key);
				self[value[key].type](value[key].value);
			});
			this.byte(nbt.tagTypes.end);
			return self;
		};

		var typeName;
		for (typeName in nbt.tagTypes) {
			if (nbt.tagTypes.hasOwnProperty(typeName)) {
				this[typeName] = this[nbt.tagTypes[typeName]];
			}
		}
	};

	/**
	 * In addition to the named writing methods documented below,
	 * the same methods are indexed by the NBT type number as well,
	 * as shown in the example below.
	 *
	 * @constructor
	 * @see module:nbt.Writer
	 *
	 * @example
	 * var reader = new nbt.Reader(buf);
	 * int x = reader.int();
	 * int y = reader[3]();
	 * int z = reader[nbt.tagTypes.int](); */
	nbt.Reader = function(buffer) {
		if (!buffer) { throw new Error('Argument "buffer" is falsy'); }

		var self = this;

		/**
		 * The current location in the buffer. Can be freely changed
		 * within the bounds of the buffer.
		 *
		 * @type number */
		this.offset = 0;

		var arrayView = new Uint8Array(buffer);
		var dataView = new DataView(arrayView.buffer);

		function read(dataType, size) {
			var val = dataView['get' + dataType](self.offset);
			self.offset += size;
			return val;
		}

		/**
		 * @method module:nbt.Reader#byte
		 * @returns {number} the read byte */
		this[nbt.tagTypes.byte] = read.bind(this, 'Int8', 1);

		/**
		 * @method module:nbt.Reader#byte
		 * @returns {number} the read unsigned byte */
		this.ubyte = read.bind(this, 'Uint8', 1);

		/**
		 * @method module:nbt.Reader#short
		 * @returns {number} the read signed 16-bit short  */
		this[nbt.tagTypes.short] = read.bind(this, 'Int16', 2);

		/**
		 * @method module:nbt.Reader#int
		 * @returns {number} the read signed 32-bit integer */
		this[nbt.tagTypes.int] = read.bind(this, 'Int32', 4);

		/**
		 * @method module:nbt.Reader#float
		 * @returns {number} the read signed 32-bit float */
		this[nbt.tagTypes.float] = read.bind(this, 'Float32', 4);

		/**
		 * @method module:nbt.Reader#double
		 * @returns {number} the read signed 64-bit float */
		this[nbt.tagTypes.double] = read.bind(this, 'Float64', 8);

		/**
		 * As JavaScript does not not natively support 64-bit
		 * integers, the value is returned as an array of two
		 * 32-bit integers, the upper and the lower.
		 *
		 * @method module:nbt.Reader#long
		 * @returns {Array.<number>} [upper, lower] */
		this[nbt.tagTypes.long] = function() {
			return [this.int(), this.int()];
		};

		/**
		 * @method module:nbt.Reader#byteArray
		 * @returns {Array.<number>} the read array */
		this[nbt.tagTypes.byteArray] = function() {
			var length = this.int();
			var bytes = [];
			var i;
			for (i = 0; i < length; i++) {
				bytes.push(this.byte());
			}
			return bytes;
		};

		/**
		 * @method module:nbt.Reader#intArray
		 * @returns {Array.<number>} the read array of 32-bit ints */
		this[nbt.tagTypes.intArray] = function() {
			var length = this.int();
			var ints = [];
			var i;
			for (i = 0; i < length; i++) {
				ints.push(this.int());
			}
			return ints;
		};

		/**
		 * @method module:nbt.Reader#string
		 * @returns {string} the read string */
		this[nbt.tagTypes.string] = function() {
			var length = this.short();
			var slice = sliceUint8Array(arrayView, this.offset,
				this.offset + length);
			this.offset += length;
			return decodeUTF8(slice);
		};

		/**
		 * @method module:nbt.Reader#list
		 * @returns {{type: string, value: Array}}
		 *
		 * @example
		 * reader.list();
		 * // -> { type: 'string', values: ['foo', 'bar'] } */
		this[nbt.tagTypes.list] = function() {
			var type = this.byte();
			var length = this.int();
			var values = [];
			var i;
			for (i = 0; i < length; i++) {
				values.push(this[type]());
			}
			return { type: nbt.tagTypeNames[type], value: values };
		};

		/**
		 * @method module:nbt.Reader#compound
		 * @returns {Object.<string, { type: string, value }>}
		 *
		 * @example
		 * reader.compound();
		 * // -> { foo: { type: int, value: 42 },
		 * //      bar: { type: string, value: 'Hi!' }} */
		this[nbt.tagTypes.compound] = function() {
			var values = {};
			while (true) {
				var type = this.byte();
				if (type === nbt.tagTypes.end) {
					break;
				}
				var name = this.string();
				var value = this[type]();
				values[name] = { type: nbt.tagTypeNames[type], value: value };
			}
			return values;
		};

		var typeName;
		for (typeName in nbt.tagTypes) {
			if (nbt.tagTypes.hasOwnProperty(typeName)) {
				this[typeName] = this[nbt.tagTypes[typeName]];
			}
		}
	};

	/**
	 * @param {Object} value - a named compound
	 * @param {string} value.name - the top-level name
	 * @param {Object} value.value - a compound
	 * @returns {ArrayBuffer}
	 *
	 * @see module:nbt.parseUncompressed
	 * @see module:nbt.Writer#compound
	 *
	 * @example
	 * nbt.writeUncompressed({
	 * name: 'My Level',
	 * value: {
	 * foo: { type: int, value: 12 },
	 * bar: { type: string, value: 'Hi!' }
	 * }
	 * }); */
	nbt.writeUncompressed = function(value) {
		if (!value) { throw new Error('Argument "value" is falsy'); }

		var writer = new nbt.Writer();

		writer.byte(nbt.tagTypes.compound);
		writer.string(value.name);
		writer.compound(value.value);

		return writer.getData();
	};

	/**
	 * @param {ArrayBuffer|Buffer} data - an uncompressed NBT archive
	 * @returns {{name: string, value: Object.<string, Object>}}
	 * a named compound
	 *
	 * @see module:nbt.parse
	 * @see module:nbt.writeUncompressed
	 *
	 * @example
	 * nbt.readUncompressed(buf);
	 * // -> { name: 'My Level',
	 * //      value: { foo: { type: int, value: 42 },
	 * //               bar: { type: string, value: 'Hi!' }}} */
	nbt.parseUncompressed = function(data) {
		if (!data) { throw new Error('Argument "data" is falsy'); }

		var reader = new nbt.Reader(data);

		var type = reader.byte();
		if (type !== nbt.tagTypes.compound) {
			throw new Error('Top tag should be a compound');
		}

		return {
			name: reader.string(),
			value: reader.compound()
		};
	};

	/**
	 * @callback parseCallback
	 * @param {Object} error
	 * @param {Object} result - a named compound
	 * @param {string} result.name - the top-level name
	 * @param {Object} result.value - the top-level compound */

	/**
	 * This accepts both gzipped and uncompressd NBT archives.
	 * If the archive is uncompressed, the callback will be
	 * called directly from this method. For gzipped files, the
	 * callback is async.
	 *
	 * For use in the browser, window.zlib must be defined to decode
	 * compressed archives. It will be passed a Buffer if the type is
	 * available, or an Uint8Array otherwise.
	 *
	 * @param {ArrayBuffer|Buffer} data - gzipped or uncompressed data
	 * @param {parseCallback} callback
	 *
	 * @see module:nbt.parseUncompressed
	 * @see module:nbt.Reader#compound
	 *
	 * @example
	 * nbt.parse(buf, function(error, results) {
	 * if (error) {
	 * throw error;
	 * }
	 * console.log(result.name);
	 * console.log(result.value.foo);
	 * }); */
	nbt.parse = function(data, callback) {
		if (!data) { throw new Error('Argument "data" is falsy'); }

		var self = this;

		if (!hasGzipHeader(data)) {
			callback(null, self.parseUncompressed(data));
		} else if (!zlib) {
			console.log(zlib)
			callback(new Error('NBT archive is compressed but zlib is not ' +
				'available'), null);
		} else {
			/* zlib.gunzip take a Buffer, at least in Node, so try to convert
			   if possible. */
			var buffer;
			if (data.length) {
				buffer = data;
			} else if (typeof Buffer !== 'undefined') {
				buffer = new Buffer(data);
			} else {
				/* In the browser? Unknown zlib library. Let's settle for
				   Uint8Array and see what happens. */
				buffer = new Uint8Array(data);
			}

			zlib.gunzip(buffer, function(error, uncompressed) {
				if (error) {
					callback(error, null);
				} else {
					callback(null, self.parseUncompressed(uncompressed));
				}
			});
		}
	}
}
Blockbench.nbt_lib = nbt

let fs;
function getFS() {
	if (fs) return fs;
	fs = require('fs');
	return fs;
}

let zlib;
// 🛠️ FIX 2: Explicitly define Node.js modules for desktop environment 
// (Blockbench 5.0 often stops making these global)
if (!Blockbench.isWeb) {
	zlib = require('zlib');
} else {
	$.getScript('https://rawgit.com/nodeca/pako/master/dist/pako.js', function() {
		window.zlib = pako
	})
}

var structure_importer_resourepackCount = 0

function structure_importer_selectResourcePath(button) {
	buttonNumber = button.id.split("-")[1]

	let path = Blockbench.pickDirectory({
		title: 'Select the "assets" folder of a resource pack',
		resource_id: 'mc_structure'
	})
	document.getElementById("structure_importer_path_input-" + String(buttonNumber)).value = path;
}

function structure_importer_addResourcePack() {
	structure_importer_resourepackCount += 1
	var node = document.createElement("P")
	node.id = "structure_importer_path-" + String(structure_importer_resourepackCount)
	var input = document.createElement("INPUT")
	input.type = "text"
	input.value = "Enter path to assets folder here"
	input.id = "structure_importer_path_input-" + String(structure_importer_resourepackCount)
	var button = document.createElement("BUTTON")
	button.innerHTML = "Browse"
	button.id = "structure_importer_path_button-" + String(structure_importer_resourepackCount)
	button.onclick = function() {
		structure_importer_selectResourcePath(this)
	}
	var removeButton = document.createElement("BUTTON")
	removeButton.innerHTML = "Remove"
	removeButton.id = "structure_importer_path_remove-" + String(structure_importer_resourepackCount)
	removeButton.onclick = function() {
		buttonNumber = this.id.split("-")[1]
		var buttonToRemove = document.getElementById("structure_importer_path-" + String(buttonNumber))
		buttonToRemove.parentNode.removeChild(buttonToRemove)
	}
	node.appendChild(document.createTextNode("Resource Pack: "))
	node.appendChild(input)
	node.appendChild(button)
	node.appendChild(removeButton)
	var addButton = document.getElementById("structure_importer_add")
	addButton.parentNode.insertBefore(node, addButton)
}

// ❌ Removed: function structure_importer_updateSize (Still commented out from previous fix)
/*
function structure_importer_updateSize() {
	var filePath = document.getElementById("file").files[0].path
	var data = zlib.gunzipSync(fs.readFileSync(filePath))
	nbt.parse(data, function (a, b) {
		var sizeNBT = b.value.size.value.value
		var size = document.getElementById("structure_importer_size")
		size.innerHTML = "Size: " + String(sizeNBT[0]) + "x" + String(sizeNBT[1]) + "x" + String(sizeNBT[2])
		var scale = document.getElementById("scale")
		scale.value = 2**Math.ceil(Math.log2(Math.max(sizeNBT[0], sizeNBT[1], sizeNBT[2])))
	})
}
*/

function structure_importer_run(ev) {
	function importStructureFile(cb) {
		if (Blockbench.isWeb) {
			fileLoaderLoad('.nbt', false, function() {
				hideDialog()
				var file = $('#file_upload').get(0).files[0]
				var reader = new FileReader()
				reader.onload = function() {
					var data = zlib.ungzip(this.result)

					nbt.parse(data, function(error, data) {
						if (error) throw error
						legacyStructureImporter(data)
					})
				}
				if (file) {
					reader.readAsArrayBuffer(file)
				}
			})
			$('#file_folder').val('')
		} else {
			structure_importer_resourepackCount = 0
			var dialog = new Dialog({title:'Import Structure', id:'structure_importer_options', lines:[
				'<p>Scale: <input type="number" id="scale" value=16></p>',
				'<p>Use legacy structure importer: <input type="checkbox" id="structure_importer_legacy"></p>',
				'<p>Vanilla assets: <input type="text" value="Enter path to assets folder here" id="structure_importer_path_input-0"><button id="structure_importer_path_button-0" onclick="structure_importer_selectResourcePath(this)">Browse</button></p>',
				'<button onclick="structure_importer_addResourcePack()" id="structure_importer_add">Add resourcepack'
				],
				"onConfirm": function(data) {
					var paths = []
					for (var i = 0; i <= structure_importer_resourepackCount; i++) {
						var path = $("#structure_importer_path_input-" + String(i))
						if (path.length >= 1) {
							paths.push(path[0].value)
						}
					}
					
					var useLegacy = $("#structure_importer_legacy")[0].checked
					var pathsValid = false
					for (var i = 0; i < paths.length; i++) {
						if (paths[i] != "Enter path to assets folder here" && paths[i] != "undefined") {
							pathsValid = true
							break
						}
					}
					if (!pathsValid && !useLegacy) {
						Blockbench.showMessage("Error: no assets folder provided", "center")
						throw "Error: no assets folder provided"
					}
					
					var structureBuilder = new StructureBuilder()
					structureBuilder.scale = $("#scale")[0].value
					structureBuilder.assetPaths = paths
					
					dialog.hide()
					
					// ✅ FIX 1: Use asynchronous import
					Blockbench.import({
						type: "NBT structure",
						extensions: ["nbt", "dat"],
						title: "Pick an NBT structure file",
						readtype: "binary" // Important: tells BB to load the file as a buffer
					}, (files) => {
						if (files.length === 0) {
							Blockbench.showMessage("Error: no files were picked", "center")
							throw "Error: no files were picked"
						}

						var fileData = files[0].content; // The loaded binary data

						// nbt.parse will now check for the gzip header and use the asynchronous zlib.gunzip
						nbt.parse(fileData, (error, data) => {
							if (error) {
								Blockbench.showMessage("Error parsing NBT file: " + error.message, "center");
								console.error(error);
								return;
							}
							
							if (!useLegacy) {
								structureBuilder.buildStructure(data)
							}
							else {
								legacyStructureImporter(data)
							}
						});
					});
				}
			})
			dialog.show()
		}
	}

	importStructureFile()
	
	function legacyStructureImporter(file) {
		file = file.value

		var group = new Group('structure').init().addTo()

		var blocks = file.blocks.value.value
		var palette = file.palette.value.value
		var calculated_blocks = []
		var max_size = 16
		var i = 0

		while (i < blocks.length) {
			var blockType = palette[blocks[i].state.value].Name.value
			if (blocks[i].pos && 
				blockType !== 'minecraft:air' &&
				blockType !== 'minecraft:tallgrass' &&
				blockType !== 'minecraft:double_plant'
			) {
				var size = [0, 0, 0, 1, 1, 1]

				if (blockType === 'minecraft:carpet' || blockType.includes('repeater') || blockType.includes('comparator')) {
					//clearFaces(blocks[i].pos, ['down'])

					size = [0, 0, 0, 1, 0.0625, 1]

				} else if (blockType === 'minecraft:chest') {

					size = [0.0625, 0, 0.0625, 0.9375, 0.9375, 0.9375]

				} else if (blockType.includes('torch')) {

					size = [0.4, 0, 0.4, 0.6, 0.8, 0.6]

				} else if (blockType.includes('flower')) {

					size = [0.4, 0, 0.4, 0.6, 0.5, 0.6]

				} else if (blockType.includes('slab')) {
					var half;
					if (
						palette[blocks[i].state.value] &&
						palette[blocks[i].state.value].Properties &&
						palette[blocks[i].state.value].Properties.value.half
					) {
						half = palette[blocks[i].state.value].Properties.value.half.value
					}
					if (half === 'top') {
						//clearFaces(blocks[i].pos, ['up'])
						size = [0, 0.5, 0, 1, 1, 1]

					} else if (half === 'bottom') {
						//clearFaces(blocks[i].pos, ['down'])
						size = [0, 0, 0, 1, 0.5, 1]

					} else {
						//clearFaces(blocks[i].pos, ['north', 'east', 'south', 'west', 'up', 'down'])

						size = [0, 0, 0, 1, 1, 1]

					}
				} else {
					//clearFaces(blocks[i].pos, ['north', 'east', 'south', 'west', 'up', 'down'])

					size = [0, 0, 0, 1, 1, 1]

				}
				//Add Block Position Offset
				for (si = 0; si<6; si++) {
					size[si] += blocks[i].pos.value.value[si%3]
				}
				calculated_blocks.push({
					pos: size,
					name: blockType.replace('minecraft:', '')
				})

				max_size = Math.max(max_size, size[0], size[3], size[1], size[4], size[2], size[5])
			}
			i++;
		}

		//Print Into Canvas
		var size_multiplier = 1
		max_size = max_size/16

		if (max_size > 1) {

			if (max_size <= 2) {
				size_multiplier = 0.5

			} else if (max_size <= 4) {
				size_multiplier = 0.25

			} else if (max_size <= 8) {
				size_multiplier = 0.125

			} else {
				size_multiplier = 0.0625
			}
			//Adapt Grid
			settings.edit_size.value = 16 / size_multiplier
			saveSettings()
		}

		calculated_blocks.forEach(function(cbl) {
			if (size_multiplier !== 1) {
				cbl.pos.forEach(function(p, ip) {
					cbl.pos[ip] = p * size_multiplier
				})
			}
			var cube = new Cube().extend({
				from: [cbl.pos[0], cbl.pos[1], cbl.pos[2]],
				to:   [cbl.pos[3], cbl.pos[4], cbl.pos[5]],
				name: cbl.name,
				display: {
					autouv: false
				}
			}).addTo(group)
			for (var face in cube.faces) {
				if (cube.faces.hasOwnProperty(face)) {
					cube.faces[face].uv = [0, 0, 16, 16]
				}
			}
			// elements.push(cube)
			cube.init()
			i++;
		})
		Canvas.updateAll()
		
	}
}

window.structure_importer_selectResourcePath = structure_importer_selectResourcePath;
window.structure_importer_addResourcePack = structure_importer_addResourcePack;
// window.structure_importer_updateSize = structure_importer_updateSize;
window.structure_importer_run = structure_importer_run;


Plugin.register("structure_importer", {
title: 'Structure Importer',  
author: "JannisX11 & Krozi",
icon: "account_balance",
description: "Import structure files generated by structure blocks in Minecraft Java",
version: "2.1.6",
min_version: "3.7.0",
variant: 'desktop',
onload() {

//Adds an entry to the plugin menu
MenuBar.addAction(new Action({
	id: "structure_importer",
	name: "Structure file",
	icon: "account_balance",
	description: "Import a structure file",
	category: "filter",
	click: structure_importer_run
}), "file.import")

MenuBar.addAction(new Action({
	id: "structure_importer",
	name: "Import Structure",
	icon: "account_balance",
	description: "Import a structure file",
	category: "filter",
	click: structure_importer_run
}), "filter")

},

onunload() {
	MenuBar.removeAction("file.import.structure_importer")
	MenuBar.removeAction("filter.structure_importer")
	MenuBar.removeAction("structure_importer")
	delete StructureBuilder
}
})

var StructureBuilder = class {
	constructor() {
		this.assetPaths = []
		this.allFaces = ["north", "east", "south", "west", "up", "down"]
		this.textureVariables = {}
		this.palette = []
		this.paletteCulling = []
		this.group = new Group('structure').init().addTo()
		this.texturesAdded = []
		this.culling = []
		this.scale = 16
		this.solid = [
			"stone",
			"granite",
			"polished_granite",
			"diorite",
			"polished_diorite",
			"andesite",
			"polished_andesite",
			"grass_block",
			"dirt",
			"coarse_dirt",
			"podzol",
			"cobblestone",
			"oak_planks",
			"spruce_planks",
			"birch_planks",
			"jungle_planks",
			"acacia_planks",
			"dark_oak_planks",
			"bedrock",
			"sand",
			"red_sand",
			"gravel",
			"gold_ore",
			"iron_ore",
			"coal_ore",
			"oak_log",
			"spruce_log",
			"birch_log",
			"jungle_log",
			"acacia_log",
			"dark_oak_log",
			"stripped_spruce_log",
			"stripped_birch_log",
			"stripped_jungle_log",
			"stripped_acacia_log",
			"stripped_dark_oak_log",
			"stripped_oak_log",
			"oak_wood",
			"spruce_wood",
			"birch_wood",
			"jungle_wood",
			"acacia_wood",
			"dark_oak_wood",
			"stripped_oak_wood",
			"stripped_spruce_wood",
			"stripped_birch_wood",
			"stripped_jungle_wood",
			"stripped_acacia_wood",
			"stripped_dark_oak_wood",
			"sponge",
			"wet_sponge",
			"lapis_ore",
			"lapis_block",
			"dispenser",
			"sandstone",
			"chiseled_sandstone",
			"cut_sandstone",
			"note_block",
			"sticky_piston",
			"white_wool",
			"orange_wool",
			"magenta_wool",
			"light_blue_wool",
			"yellow_wool",
			"lime_wool",
			"pink_wool",
			"gray_wool",
			"light_gray_wool",
			"cyan_wool",
			"purple_wool",
			"blue_wool",
			"brown_wool",
			"green_wool",
			"red_wool",
			"black_wool",
			"white_concrete",
			"orange_concrete",
			"magenta_concrete",
			"light_blue_concrete",
			"yellow_concrete",
			"lime_concrete",
			"pink_concrete",
			"gray_concrete",
			"light_gray_concrete",
			"cyan_concrete",
			"purple_concrete",
			"blue_concrete",
			"brown_concrete",
			"green_concrete",
			"red_concrete",
			"black_concrete",
			"white_concrete_powder",
			"orange_concrete_powder",
			"magenta_concrete_powder",
			"light_blue_concrete_powder",
			"yellow_concrete_powder",
			"lime_concrete_powder",
			"pink_concrete_powder",
			"gray_concrete_powder",
			"light_gray_concrete_powder",
			"cyan_concrete_powder",
			"purple_concrete_powder",
			"blue_concrete_powder",
			"brown_concrete_powder",
			"green_concrete_powder",
			"red_concrete_powder",
			"black_concrete_powder",
			"gold_block",
			"iron_block",
			"bricks",
			"tnt",
			"bookshelf",
			"mossy_cobblestone",
			"obsidian",
			"diamond_ore",
			"diamond_block",
			"crafting_table",
			"furnace",
			"redstone_ore",
			"snow_block",
			"clay",
			"jukebox",
			"pumpkin",
			"netherrack",
			"soul_sand",
			"glowstone",
			"carved_pumpkin",
			"jack_o_lantern",
			"infested_stone",
			"infested_cobblestone",
			"infested_stone_bricks",
			"infested_mossy_stone_bricks",
			"infested_cracked_stone_bricks",
			"infested_chiseled_stone_bricks",
			"stone_bricks",
			"mossy_stone_bricks",
			"cracked_stone_bricks",
			"chiseled_stone_bricks",
			"brown_mushroom_block",
			"red_mushroom_block",
			"melon",
			"mycelium",
			"nether_bricks",
			"end_stone",
			"redstone_lamp",
			"emerald_ore",
			"emerald_block",
			"command_block",
			"redstone_block",
			"nether_quartz_ore",
			"quartz_block",
			"chiseled_quartz_block",
			"quartz_pillar",
			"dropper",
			"white_terracotta",
			"orange_terracotta",
			"magenta_terracotta",
			"light_blue_terracotta",
			"yellow_terracotta",
			"lime_terracotta",
			"pink_terracotta",
			"gray_terracotta",
			"light_gray_terracotta",
			"cyan_terracotta",
			"purple_terracotta",
			"blue_terracotta",
			"brown_terracotta",
			"green_terracotta",
			"red_terracotta",
			"black_terracotta",
			"prismarine",
			"prismarine_bricks",
			"dark_prismarine",
			"sea_lantern",
			"hay_block",
			"terracotta",
			"coal_block",
			"packed_ice",
			"red_sandstone",
			"chiseled_red_sandstone",
			"cut_red_sandstone",
			"smooth_stone",
			"smooth_sandstone",
			"smooth_quartz",
			"smooth_red_sandstone",
			"purpur_block",
			"purpur_pillar",
			"end_stone_bricks",
			"repeating_command_block",
			"chain_command_block",
			"magma_block",
			"nether_wart_block",
			"red_nether_bricks",
			"bone_block",
			"observer",
			"white_glazed_terracotta",
			"orange_glazed_terracotta",
			"magenta_glazed_terracotta",
			"light_blue_glazed_terracotta",
			"tube_coral_block",
			"brain_coral_block",
			"bubble_coral_block",
			"fire_coral_block",
			"horn_coral_block",
			"dead_tube_coral_block",
			"dead_brain_coral_block",
			"dead_bubble_coral_block",
			"dead_fire_coral_block",
			"dead_horn_coral_block",
			"blue_ice",
			"dried_kelp_block",
			"barrel",
			"blast_furnace",
			"cartography_table",
			"fletching_table",
			"composter",
			"structure_block",
			"jigsaw",
			"loom",
			"smithing_table",
			"smoker",
			"bee_nest",
			"beehive",
			"honeycomb_block",
			"ancient_debris",
			"basalt",
			"polished_basalt",
			"blackstone",
			"gilded_blackstone",
			"polished_blackstone",
			"chiseled_polished_blackstone",
			"polished_blackstone_bricks",
			"cracked_polished_blackstone_bricks",
			"netherite_block",
			"chiseled_nether_bricks",
			"cracked_nether_bricks",
			"crimson_nylium",
			"warped_nylium",
			"crimson_planks",
			"warped_planks",
			"crimson_stem",
			"warped_stem",
			"stripped_crimson_stem",
			"stripped_warped_stem",
			"crying_obsidian",
			"crimson_hyphae",
			"warped_hyphae",
			"stripped_crimson_hyphae",
			"stripped_warped_hyphae",
			"lodestone",
			"nether_gold_ore",
			"quartz_bricks",
			"respawn_anchor",
			"shroomlight",
			"soul_soil",
			"target",
			"warped_wart_block"
		]
		this.cullSelf = [
			"glass",
			"glass_pane",
			"white_stained_glass",
			"orange_stained_glass",
			"magenta_stained_glass",
			"light_blue_stained_glass",
			"yellow_stained_glass",
			"lime_stained_glass",
			"pink_stained_glass",
			"gray_stained_glass",
			"light_gray_stained_glass",
			"cyan_stained_glass",
			"purple_stained_glass",
			"blue_stained_glass",
			"brown_stained_glass",
			"green_stained_glass",
			"red_stained_glass",
			"black_stained_glass",
			"white_stained_glass_pane",
			"orange_stained_glass_pane",
			"magenta_stained_glass_pane",
			"light_blue_stained_glass_pane",
			"yellow_stained_glass_pane",
			"lime_stained_glass_pane",
			"pink_stained_glass_pane",
			"gray_stained_glass_pane",
			"light_gray_stained_glass_pane",
			"cyan_stained_glass_pane",
			"purple_stained_glass_pane",
			"blue_stained_glass_pane",
			"brown_stained_glass_pane",
			"green_stained_glass_pane",
			"red_stained_glass_pane",
			"black_stained_glass_pane",
			"ice",
			"cactus",
			"iron_bars",
			"slime_block",
			"honey_block"
		]
		this.cullSelfGroup = [
			[
				"oak_fence",
				"spruce_fence",
				"birch_fence",
				"jungle_fence",
				"acacia_fence",
				"dark_oak_fence"
			],
			[
				"cobblestone_wall",
				"mossy_cobblestone_wall",
				"brick_wall",
				"prismarine_wall",
				"red_sandstone_wall",
				"mossy_stone_brick_wall",
				"granite_wall",
				"stone_brick_wall",
				"nether_brick_wall",
				"andesite_wall",
				"red_nether_brick_wall",
				"sandstone_wall",
				"end_stone_brick_wall",
				"diorite_wall",
				"blackstone_wall",
				"polished_blackstone_brick_wall",
				"polished_blackstone_wall"
			]
		]
		this.slabs = [
			"stone_slab",
			"smooth_stone_slab",
			"stone_brick_slab",
			"sandstone_slab",
			"acacia_slab",
			"birch_slab",
			"dark_oak_slab",
			"jungle_slab",
			"oak_slab",
			"spruce_slab",
			"purpur_slab",
			"quartz_slab",
			"red_sandstone_slab",
			"brick_slab",
			"cobblestone_slab",
			"nether_brick_slab",
			"petrified_oak_slab",
			"prismarine_slab",
			"prismarine_brick_slab",
			"dark_prismarine_slab",
			"polished_granite_slab",
			"smooth_red_sandstone_slab",
			"mossy_stone_brick_slab",
			"polished_diorite_slab",
			"mossy_cobblestone_slab",
			"end_stone_brick_slab",
			"smooth_sandstone_slab",
			"smooth_quartz_slab",
			"granite_slab",
			"andesite_slab",
			"red_nether_brick_slab",
			"polished_andesite_slab",
			"diorite_slab",
			"cut_red_sandstone_slab",
			"cut_sandstone_slab",
			"blackstone_slab",
			"polished_blackstone_slab",
			"polished_blackstone_brick_slab"
		]
		this.flatBlocks = {
			"farmland": 15,
			"daylight_detector": 6,
			"grass_path": 15,
			"white_carpet": 1,
			"orange_carpet": 1,
			"magenta_carpet": 1,
			"light_blue_carpet": 1,
			"yellow_carpet": 1,
			"lime_carpet": 1,
			"pink_carpet": 1,
			"gray_carpet": 1,
			"light_gray_carpet": 1,
			"cyan_carpet": 1,
			"purple_carpet": 1,
			"blue_carpet": 1,
			"brown_carpet": 1,
			"green_carpet": 1,
			"red_carpet": 1,
			"black_carpet": 1,
			"repeater": 2,
			"comparator": 2,
			"enchanting_table": 12,
			"end_portal_frame": 13,
			"lectern": 2
		}
	}
	
	buildStructure(file) {
		Undo.initEdit({"elements": [], "uv_only": false, "textures": []})
		for (var i = 0; i < this.assetPaths.length; i++) {
			this.assetPaths[i] = this.getAssetsPath(this.assetPaths[i])
		}
		file = file.value
		var palette = file.palette.value.value
		var blocks = file.blocks.value.value
		for (var i = 0; i < palette.length; i++) {
			var blockId = palette[i].Name.value
			var blockstates = {}
			if (Object.keys(palette[i]).indexOf("Properties") >= 0) {
				var properties = Object.keys(palette[i].Properties.value)
				for (var j = 0; j < properties.length; j++) {
					blockstates[properties[j]] = palette[i].Properties.value[properties[j]].value
				}
			}
			this.loadBlockstate(blockId, blockstates)
			this.paletteCulling.push(this.getCullingType(blockId, blockstates))
		}
		var size = file.size.value.value
		for (var x = 0; x < size[0]; x++) {
			var plane = []
			for (var y = 0; y < size[1]; y++) {
				plane.push(Array(size[2]))
			}
			this.culling.push(plane)
		}
		for (var i = 0; i < blocks.length; i++) {
			this.culling[blocks[i].pos.value.value[0]][blocks[i].pos.value.value[1]][blocks[i].pos.value.value[2]] = this.paletteCulling[blocks[i].state.value]
		}
		for (var i = 0; i < blocks.length; i++) {
			var x = blocks[i].pos.value.value[0]
			var y = blocks[i].pos.value.value[1]
			var z = blocks[i].pos.value.value[2]
			var cullingData = this.culling[x][y][z]
			var cullSides = {"west": false, "east": false, "down": false, "up": false, "north": false, "south": false}
			if (x > 0) cullSides.west = this.doCulling(cullingData, this.culling[x-1][y][z], "west")
			if (x < size[0]-1) cullSides.east = this.doCulling(cullingData, this.culling[x+1][y][z], "east")
			if (y > 0) cullSides.down = this.doCulling(cullingData, this.culling[x][y-1][z], "down")
			if (y < size[1]-1) cullSides.up = this.doCulling(cullingData, this.culling[x][y+1][z], "up")
			if (z > 0) cullSides.north = this.doCulling(cullingData, this.culling[x][y][z-1], "north")
			if (z < size[2]-1) cullSides.south = this.doCulling(cullingData, this.culling[x][y][z+1], "south")
			this.addModel(blocks[i].state.value, cullSides, [x*16/this.scale, y*16/this.scale, z*16/this.scale], 1/this.scale)
		}
		Canvas.updateAll()
		Undo.finishEdit("structure_importer", {"elements": this.group.children, "uv_only": false, "textures": this.texturesAdded})
	}
	
	getAssetsPath(path) {
		let fs = getFS();
		// path = path.replace("/", "\\")
		if (path.endsWith(osfs + "assets")) return path
		if (fs.existsSync(path + osfs + "assets")) return path + osfs + "assets"
		if (path.indexOf(osfs + "assets" + osfs) >= 0) return path.slice(0, path.indexOf(osfs + "assets" + osfs) + 7)
		return path
	}
	
	getCullingType(blockId, blockstates) {
		blockId = blockId.slice(blockId.indexOf(":") + 1)
		if (this.solid.indexOf(blockId) >= 0) {
			return {"type": "solid"}
		}
		if (Object.keys(this.flatBlocks).indexOf(blockId) >= 0) {
			return {"type": "slab", "height": this.flatBlocks[blockId]}
		}
		if (this.slabs.indexOf(blockId) >= 0) {
			if (blockstates.type == "bottom") {
				return {"type": "slab", "height": 8}
			}
			if (blockstates.type == "top") {
				return {"type": "inverse_slab", "height": 8}
			}
			if (blockstates.type == "double") {
				return {"type": "solid"}
			}
		}
		if (blockId == "snow") {
			if (blockstates.layers == 8) {
				return {"type": "solid"}
			}
			return {"type": "slab", "height": blockstates.layers * 2}
		}
		if (this.cullSelf.indexOf(blockId) >= 0) {
			return {"type": "selfcull", "id": blockId}
		}
		for (var i = 0; i < this.cullSelfGroup.length; i++) {
			if (this.cullSelfGroup[i].indexOf(blockId) >= 0) {
				return {"type": "selfcull", "id": "GROUP" + String(i)}
			}
		}
		return {"type": "none"}
	}
	
	doCulling(tile, neighbour, side) {
		if (neighbour == undefined || neighbour.type == "none") {
			return false
		}
		if (neighbour.type == "solid") {
			return true
		}
		if (neighbour.type == "selfcull" && tile.type == "selfcull" && tile.id == neighbour.id) {
			return true
		}
		if (neighbour.type == "slab") {
			if (side == "up") {
				return true
			}
			if (tile.type == "slab" && side != "down" && tile.height <= neighbour.height) {
				return true
			}
		}
		if (neighbour.type == "inverse_slab") {
			if (side == "down") {
				return true
			}
			if (tile.type == "inverse_slab" && side != "up" && tile.height <= neighbour.height) {
				return true
			}
		}
		return false
	}
	
	getResourcePath(object_type, localPath) {
		let fs = getFS();
		var namespace = "minecraft"
		var parts = localPath.split(":")
		if (parts.length > 1) {
			namespace = parts[0]
			localPath = parts[1]
		}
		localPath = localPath.replace("/", osfs)
		for (var i = this.assetPaths.length - 1; i >= 0; i--) {
			var fullPath = this.assetPaths[i] + osfs + namespace + osfs + object_type + osfs + localPath
			if (fs.existsSync(fullPath)) {
				return fullPath
			}
		}
		Blockbench.showMessage("Error: File not found: " + localPath, "center")
		throw "Error: File not found: " + localPath
	}
	
	loadBlockstate(blockId, blockstates) {
		let fs = getFS();
		var fullPath = this.getResourcePath("blockstates", blockId + ".json")
		var data = JSON.parse(fs.readFileSync(fullPath, "utf8"))
		if (Object.keys(data).indexOf("variants") >= 0) {
			var variants = Object.keys(data.variants)
			for (var i=0; i < variants.length; i++) {
				var variant = variants[i]
				if (variant == "") {
					this.palette.push(this.loadRotatedModel(data.variants[""]))
				}
				var repeat = true
				var start = 0
				while (repeat) {
					var equalSign = variant.indexOf("=", start)
					var comma = variant.indexOf(",", start)
					if (comma == -1) {
						comma = variant.length
						repeat = false
					}
					var state = variant.slice(start, equalSign)
					var value = variant.slice(equalSign + 1, comma)
					if (blockstates[state] != value) {
						repeat = false
					}
					else if (!repeat) {
						this.palette.push(this.loadRotatedModel(data.variants[variant]))
					}
					else {
						start = comma + 1
					}
				}
			}
		}
		if (Object.keys(data).indexOf("multipart") >= 0) {
			var model = []
			for (var i = 0; i < data.multipart.length; i++) {
				var part = data.multipart[i]
				if (Object.keys(part).indexOf("when") == -1) {
					model = model.concat(this.loadRotatedModel(part.apply))
				}
				else {
					var match
					if (Object.keys(part.when).indexOf("OR") >= 0) {
						match = false
						for (var j = 0; j < part.when.OR.length; j++) {
							match = match || this.matchBlockstates(part.when.OR[j], blockstates)
						}
					}
					else {
						match = this.matchBlockstates(part.when, blockstates)
					}
					if (match) {
						model = model.concat(this.loadRotatedModel(part.apply))
					}
				}
			}
			this.palette.push(model)
		}
	}
	
	matchBlockstates(when, blockstates) {
		var states = Object.keys(when)
		var match = true
		for (var j = 0; j < states.length; j++) {
			var values = String(when[states[j]]).split("|")
			if (values.indexOf(blockstates[states[j]]) == -1) {
				match = false
			}
		}
		return match
	}
	
	loadRotatedModel(data) {
		if (data.model == undefined) {
			return this.loadRotatedModel(data[0])
		}
		var uvlock = typeof data.uvlock != "undefined" && data.uvlock
		var cubes = this.loadModel(data.model)
		if (data.x) {
			this.rollCubes(cubes, 0, -data.x, uvlock)
		}
		if (data.y) {
			this.rollCubes(cubes, 1, data.y, uvlock)
		}
		return cubes
	}
	
	
	rollCubes(cubes, axis, angle, uvlock) {
		// Taken and modified from https://github.com/JannisX11/blockbench/blob/master/js/elements.js
		function rotateCoord(array) {
			var a, b;
			array.forEach(function(s, i) {
				if (i == axis) {
				} else {
					if (a == undefined) {
						a = s - 8
						b = i
					} else {
						array[b] = s - 8
						array[b] = 8 - array[b]
						array[i] = 8 + a;
					}
				}
			})
			return array
		}
		function rotateUVFace(number, iterations) {
			if (!number) number = 0;
			number += iterations * 90;
			return number % 360;
		}
		function rotateUV(uv, times) {
			for (var i = 0; i < times; i++) {
				var temp = uv[0]
				uv[0] = uv[1]
				uv[1] = 16 - uv[2]
				uv[2] = uv[3]
				uv[3] = 16 - temp
			}
		}
		
		var steps = (angle % 360) / 90
		if (steps < 0) {
			steps = steps + 4
		}
		for (var cubeIndex = 0; cubeIndex < cubes.length; cubeIndex++) {
			var cube = cubes[cubeIndex]
			for (var repeat = 0; repeat < steps; repeat++) {
				//Swap coordinate thingy
				[cube.from[2], cube.to[2]] = [cube.to[2], cube.from[2]]
				cube.from = rotateCoord(cube.from, 1)
				cube.to = rotateCoord(cube.to, 1)
				if (cube.origin && [8, 8, 8] != cube.origin) {
					cube.origin = rotateCoord(cube.origin, 1)
				}
				if (axis === 0) {
					if (uvlock) {
						rotateUV(cube.faces.west.uv, 3)
						rotateUV(cube.faces.east.uv, 1)
						rotateUV(cube.faces.north.uv, 2)
						rotateUV(cube.faces.down.uv, 2)
					}
					else {
						cube.faces.west.rotation = rotateUVFace(cube.faces.west.rotation, 1)
						cube.faces.east.rotation = rotateUVFace(cube.faces.east.rotation, 3)
						cube.faces.north.rotation= rotateUVFace(cube.faces.north.rotation, 2)
						cube.faces.down.rotation = rotateUVFace(cube.faces.down.rotation, 2)
					}

					var temp = cube.faces.north
					cube.faces.north = cube.faces.down
					cube.faces.down = cube.faces.south
					cube.faces.south = cube.faces.up
					cube.faces.up = temp
					
					for (var i = 0; i < 6; i++) {
						cube.faces[this.allFaces[i]].cullface = {"down": "north", "south": "down", "up": "south", "north": "up", "east": "east", "west": "west"}[cube.faces[this.allFaces[i]].cullface]
					}

				} else if (axis === 1) {
					if (uvlock) {
						rotateUV(cube.faces.up.uv, 3)
						rotateUV(cube.faces.down.uv, 1)
					}
					else {
						cube.faces.up.rotation= rotateUVFace(cube.faces.up.rotation, 1)
						cube.faces.down.rotation = rotateUVFace(cube.faces.down.rotation, 3)
					}

					var temp = cube.faces.north
					cube.faces.north = cube.faces.west
					cube.faces.west = cube.faces.south
					cube.faces.south = cube.faces.east
					cube.faces.east = temp
					
					for (var i = 0; i < 6; i++) {
						cube.faces[this.allFaces[i]].cullface = {"west": "north", "south": "west", "east": "south", "north": "east", "up": "up", "down": "down"}[cube.faces[this.allFaces[i]].cullface]
					}
				}

				if (cube.rotation) {
					//Fine Rotations
					var i = 0;
					var temp_rot = undefined;
					var temp_i = undefined;
					while (i < 3) {
						if (i !== axis) {
							if (temp_rot === undefined) {
								temp_rot = cube.rotation[i]
								temp_i = i
							} else {
								cube.rotation[temp_i] = -cube.rotation[i]
								cube.rotation[i] = temp_rot
							}
						}
						i++;
					}
				}
			}
		}
	}
	
	
	loadModel(model, textures = {}) {
		let fs = getFS();
		var cubes = []
		var path = this.getResourcePath("models", model + ".json")
		var data = JSON.parse(fs.readFileSync(path, "utf8"))
		if (Object.keys(data).indexOf("textures") >= 0) {
			var newTextureList = Object.keys(data.textures)
			var oldTextureList = Object.keys(textures)
			for (var i=0; i < newTextureList.length; i++) {
				textures[newTextureList[i]] = data.textures[newTextureList[i]]
				for (var j=0; j < oldTextureList.length; j++) {
					if (data.textures[newTextureList[i]] == "#" + oldTextureList[j]) {
						textures[newTextureList[i]] = textures[oldTextureList[j]]
						break
					}
				}
			}
		}
		if (Object.keys(data).indexOf("elements") >= 0) {
			for (var i=0; i < data.elements.length; i++) {
				var element = data.elements[i]
				var cube = {"faces": {"north": {}, "east": {}, "south": {}, "west": {}, "up": {}, "down": {}}}
				cube.from = element.from
				cube.to = element.to
				if (element.rotation && element.rotation.axis != 0) {
					cube.rotation = [0, 0, 0]
					cube.rotation[{"x": 0, "y": 1, "z": 2}[element.rotation.axis]] = element.rotation.angle
					cube.origin = element.rotation.origin
					cube.rescale = element.rotation.rescale
				}
				cube.shade = element.shade
				for (var faceIndex=0; faceIndex < this.allFaces.length; faceIndex++) {
					var face = this.allFaces[faceIndex]
					if (face in element.faces) {
						cube.faces[face].texture = this.getTextureVariable(textures[this.removeHashtag(element.faces[face].texture)])
						cube.faces[face].rotation = element.faces[face].rotation
						cube.faces[face].cullface = element.faces[face].cullface
						cube.faces[face].tint = element.faces[face].tintindex != null
						if ("uv" in element.faces[face]) {
							cube.faces[face].uv = element.faces[face].uv
						}
						else {
							switch (faceIndex) {
								case 0:
									cube.faces[face].uv = [16-cube.to[0], 16-cube.to[1], 16-cube.from[0], 16-cube.from[1]]
									break
								case 1:
									cube.faces[face].uv = [16-cube.to[2], 16-cube.to[1], 16-cube.from[2], 16-cube.from[1]]
									break
								case 2:
									cube.faces[face].uv = [cube.from[0], 16-cube.to[1], cube.to[0], 16-cube.from[1]]
									break
								case 3:
									cube.faces[face].uv = [cube.from[2], 16-cube.to[1], cube.to[2], 16-cube.from[1]]
									break
								case 4:
									cube.faces[face].uv = [cube.from[0], cube.from[2], cube.to[0], cube.to[2]]
									break
								case 5:
									cube.faces[face].uv = [cube.from[0], 16-cube.to[2], cube.to[0], 16-cube.from[2]]
									break
							}
						}
					}
					else {
						cube.faces[face].texture = null
						cube.faces[face].uv = [0, 0, 16, 16]
					}
				}
				cubes.push(cube)
			}
		}
		else if (Object.keys(data).indexOf("parent") >= 0) {
			return this.loadModel(data.parent, textures)
		}
		return cubes
	}
	
	getTextureVariable(path) {
		if (path in this.textureVariables) {
			return this.textureVariables[path]
		}
		else {
			var texture = new Texture().fromPath(this.getResourcePath("textures", path + ".png")).add(false)
			this.texturesAdded.push(texture)
			var variable = texture.uuid
			this.textureVariables[path] = variable
			return variable
		}
	}
	
	removeHashtag(texture) {
		if (texture.charAt(0) == "#") {
			return texture.slice(1)
		}
		return texture
	}
	
	addModel(state, cullsides, position, scale) {
		var cubes = this.palette[state]
		for (var i=0; i < cubes.length; i++) {
			var cube = new Cube()
			cube.autouv = 0
			if (cubes[i].rotation) {
				cube.rotation = cubes[i].rotation
				cube.rescale = cubes[i].rescale
			}
			for (var j=0; j<3; j++) {
				cube.from[j] = cubes[i].from[j] * scale + position[j]
				cube.to[j] = cubes[i].to[j] * scale + position[j]
				if (cubes[i].origin) {
					cube.origin[j] = cubes[i].origin[j] * scale + position[j]
				}
			}
			cube.shade = cubes[i].shade
			var cubeVisible = false
			for (var faceIndex=0; faceIndex < this.allFaces.length; faceIndex++) {
				var face = this.allFaces[faceIndex]
				if (! cullsides[cubes[i].faces[face].cullface] && cubes[i].faces[face].texture != null) {
					cube.faces[face].texture = cubes[i].faces[face].texture
					cube.faces[face].uv = cubes[i].faces[face].uv
					cube.faces[face].rotation = cubes[i].faces[face].rotation
					cube.faces[face].tint = cubes[i].faces[face].tint
					cubeVisible = true
				}
				else {
					cube.faces[face].texture = null
				}
			}
			if (cubeVisible) {
				cube.init()
				// elements.push(cube)
				cube.addTo(this.group)
			}
		}
	}
}
