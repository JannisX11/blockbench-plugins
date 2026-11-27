// node_modules/mutf-8/dist/index.mjs
class MUtf8Decoder {
  #fatal;
  #ignoreBOM;
  #leavings = new Uint8Array(3);
  #leavingsLength = 0;
  get encoding() {
    return "mutf-8";
  }
  get fatal() {
    return this.#fatal;
  }
  get ignoreBOM() {
    return this.#ignoreBOM;
  }
  constructor(label = "mutf-8", options = {}) {
    const normalizedLabel = label.toLowerCase();
    if (normalizedLabel !== "mutf-8" && normalizedLabel !== "mutf8") {
      throw new RangeError(`MUtf8Decoder.constructor: '${label}' is not supported.`);
    }
    this.#fatal = options.fatal ?? false;
    this.#ignoreBOM = options.ignoreBOM ?? false;
  }
  decode(input, options = {}) {
    const stream = options.stream ?? false;
    const bytes = this.#toU8Array(input);
    const length = bytes.length;
    const codes = new Array(length);
    let bp = 0;
    let cp = 0;
    while (bp < length) {
      const b1 = bytes[bp++];
      if (!(b1 & 128) && b1 !== 0) {
        codes[cp++] = b1;
      } else if ((b1 & 224) === 192) {
        if (length <= bp) {
          if (stream) {
            this.#setLeavings(bytes, bp - 1);
            break;
          }
          codes[cp++] = this.#handleError();
          continue;
        }
        const b2 = bytes[bp++];
        if ((b2 & 192) !== 128) {
          codes[cp++] = this.#handleError();
          bp--;
          continue;
        }
        codes[cp++] = (b1 & 31) << 6 | b2 & 63;
      } else if ((b1 & 240) === 224) {
        if (length <= bp + 1) {
          if (stream) {
            this.#setLeavings(bytes, bp - 1);
            break;
          }
          codes[cp++] = this.#handleError();
          continue;
        }
        const b2 = bytes[bp++];
        if ((b2 & 192) !== 128) {
          codes[cp++] = this.#handleError();
          bp--;
          continue;
        }
        const b3 = bytes[bp++];
        if ((b3 & 192) !== 128) {
          codes[cp++] = this.#handleError();
          bp -= 2;
          continue;
        }
        if (bp === 3 && b1 === 239 && b2 === 187 && b3 === 191 && !this.ignoreBOM) {
          continue;
        }
        codes[cp++] = (b1 & 15) << 12 | (b2 & 63) << 6 | b3 & 63;
      } else {
        codes[cp++] = this.#handleError();
      }
    }
    return String.fromCharCode(...cp === codes.length ? codes : codes.slice(0, cp));
  }
  #toU8Array(input) {
    let bytes;
    if (input instanceof Uint8Array) {
      bytes = input;
    } else if ("buffer" in input) {
      bytes = new Uint8Array(input.buffer, input.byteOffset);
    } else {
      bytes = new Uint8Array(input);
    }
    if (!this.#leavingsLength) {
      return bytes;
    }
    const combined = new Uint8Array(this.#leavingsLength + bytes.byteLength);
    combined.set(this.#leavings.subarray(0, this.#leavingsLength));
    combined.set(bytes, this.#leavingsLength);
    this.#leavingsLength = 0;
    return combined;
  }
  #setLeavings(bytes, startIndex) {
    this.#leavings.set(bytes.subarray(startIndex));
    this.#leavingsLength = bytes.length - startIndex;
  }
  #handleError() {
    if (this.fatal) {
      throw new TypeError("MUtf8Decoder.decode: Decoding failed.");
    }
    return 65533;
  }
}

// node_modules/nbtify/dist/format.js
class NBTData {
  data;
  rootName;
  endian;
  compression;
  bedrockLevel;
  #byteOffset = null;
  constructor(data, options = {}) {
    if (data instanceof NBTData) {
      if (options.rootName === undefined) {
        options.rootName = data.rootName;
      }
      if (options.endian === undefined) {
        options.endian = data.endian;
      }
      if (options.compression === undefined) {
        options.compression = data.compression;
      }
      if (options.bedrockLevel === undefined) {
        options.bedrockLevel = data.bedrockLevel;
      }
      data = data.data;
    }
    const { rootName = "", endian = "big", compression = null, bedrockLevel = false } = options;
    this.data = data;
    this.rootName = rootName;
    this.endian = endian;
    this.compression = compression;
    this.bedrockLevel = bedrockLevel;
  }
  get byteOffset() {
    return this.#byteOffset;
  }
  set byteOffset(value) {
    this.#byteOffset = value;
  }
  get [Symbol.toStringTag]() {
    return "NBTData";
  }
}

// node_modules/nbtify/dist/primitive.js
var CustomInspect = Symbol.for("nodejs.util.inspect.custom");

class Int8 extends Number {
  constructor(value) {
    super(value << 24 >> 24);
  }
  valueOf() {
    return super.valueOf();
  }
  get [Symbol.toStringTag]() {
    return "Int8";
  }
  get [CustomInspect]() {
    return (_, { stylize }) => stylize(`${this.valueOf()}b`, "number");
  }
}

class Int16 extends Number {
  constructor(value) {
    super(value << 16 >> 16);
  }
  valueOf() {
    return super.valueOf();
  }
  get [Symbol.toStringTag]() {
    return "Int16";
  }
  get [CustomInspect]() {
    return (_, { stylize }) => stylize(`${this.valueOf()}s`, "number");
  }
}

class Int32 extends Number {
  constructor(value) {
    super(value | 0);
  }
  valueOf() {
    return super.valueOf();
  }
  get [Symbol.toStringTag]() {
    return "Int32";
  }
  get [CustomInspect]() {
    return () => this.valueOf();
  }
}

class Float32 extends Number {
  constructor(value) {
    super(value);
  }
  valueOf() {
    return super.valueOf();
  }
  get [Symbol.toStringTag]() {
    return "Float32";
  }
  get [CustomInspect]() {
    return (_, { stylize }) => stylize(`${this.valueOf()}f`, "number");
  }
}

// node_modules/nbtify/dist/tag.js
var TAG;
(function(TAG) {
  TAG[TAG["END"] = 0] = "END";
  TAG[TAG["BYTE"] = 1] = "BYTE";
  TAG[TAG["SHORT"] = 2] = "SHORT";
  TAG[TAG["INT"] = 3] = "INT";
  TAG[TAG["LONG"] = 4] = "LONG";
  TAG[TAG["FLOAT"] = 5] = "FLOAT";
  TAG[TAG["DOUBLE"] = 6] = "DOUBLE";
  TAG[TAG["BYTE_ARRAY"] = 7] = "BYTE_ARRAY";
  TAG[TAG["STRING"] = 8] = "STRING";
  TAG[TAG["LIST"] = 9] = "LIST";
  TAG[TAG["COMPOUND"] = 10] = "COMPOUND";
  TAG[TAG["INT_ARRAY"] = 11] = "INT_ARRAY";
  TAG[TAG["LONG_ARRAY"] = 12] = "LONG_ARRAY";
})(TAG || (TAG = {}));
Object.freeze(TAG);
var TAG_TYPE = Symbol("nbtify.tag.type");
function isTagType(type) {
  return typeof type === "number" && type in TAG;
}
function getTagType(value) {
  switch (true) {
    case value instanceof Int8:
    case typeof value === "boolean":
      return TAG.BYTE;
    case value instanceof Int16:
      return TAG.SHORT;
    case value instanceof Int32:
      return TAG.INT;
    case typeof value === "bigint":
      return TAG.LONG;
    case value instanceof Float32:
      return TAG.FLOAT;
    case typeof value === "number":
      return TAG.DOUBLE;
    case value instanceof Int8Array:
    case value instanceof Uint8Array:
      return TAG.BYTE_ARRAY;
    case typeof value === "string":
      return TAG.STRING;
    case value instanceof Array:
      return TAG.LIST;
    case value instanceof Int32Array:
    case value instanceof Uint32Array:
      return TAG.INT_ARRAY;
    case value instanceof BigInt64Array:
    case value instanceof BigUint64Array:
      return TAG.LONG_ARRAY;
    case (typeof value === "object" && value !== null):
      return TAG.COMPOUND;
    default:
      return null;
  }
}

// node_modules/nbtify/dist/compression.js
async function decompress(data, format) {
  const decompressionStream = new DecompressionStream(format);
  return pipeThroughCompressionStream(data, decompressionStream);
}
async function pipeThroughCompressionStream(data, { readable, writable }) {
  const writer = writable.getWriter();
  writer.write(data).catch(() => {});
  writer.close().catch(() => {});
  const chunks = [];
  let byteLength = 0;
  const iterator = readableStreamToAsyncIterable(readable);
  for await (const chunk of iterator) {
    chunks.push(chunk);
    byteLength += chunk.byteLength;
  }
  const result = new Uint8Array(byteLength);
  let byteOffset = 0;
  for (const chunk of chunks) {
    result.set(chunk, byteOffset);
    byteOffset += chunk.byteLength;
  }
  return result;
}
function readableStreamToAsyncIterable(readable) {
  if (typeof readable[Symbol.asyncIterator] === "undefined") {
    return readableStreamToAsyncGenerator(readable);
  }
  return readable;
}
async function* readableStreamToAsyncGenerator(readable) {
  const reader = readable.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done)
        return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

// node_modules/nbtify/dist/read.js
async function read(data, options = {}) {
  if (data instanceof Blob) {
    data = await data.arrayBuffer();
  }
  if (!("byteOffset" in data)) {
    data = new Uint8Array(data);
  }
  if (!(data instanceof Uint8Array)) {
    throw new TypeError("First parameter must be a Uint8Array, ArrayBuffer, SharedArrayBuffer, or Blob");
  }
  const reader = new NBTReader(data, options.endian !== "big", options.endian === "little-varint");
  let { rootName, endian, compression, bedrockLevel, strict = true } = options;
  if (rootName !== undefined && typeof rootName !== "boolean" && typeof rootName !== "string" && rootName !== null) {
    throw new TypeError("Root Name option must be a boolean, string, or null");
  }
  if (endian !== undefined && endian !== "big" && endian !== "little" && endian !== "little-varint") {
    throw new TypeError("Endian option must be a valid endian type");
  }
  if (compression !== undefined && compression !== "deflate" && compression !== "deflate-raw" && compression !== "gzip" && compression !== null) {
    throw new TypeError("Compression option must be a valid compression type");
  }
  if (bedrockLevel !== undefined && typeof bedrockLevel !== "boolean" && typeof bedrockLevel !== "number" && bedrockLevel !== null) {
    throw new TypeError("Bedrock Level option must be a boolean, number, or null");
  }
  if (typeof strict !== "boolean") {
    throw new TypeError("Strict option must be a boolean");
  }
  compression:
    if (compression === undefined) {
      switch (true) {
        case reader.hasGzipHeader():
          compression = "gzip";
          break compression;
        case reader.hasZlibHeader():
          compression = "deflate";
          break compression;
      }
      try {
        return await read(data, { ...options, compression: null });
      } catch (error) {
        try {
          return await read(data, { ...options, compression: "deflate-raw" });
        } catch {
          throw error;
        }
      }
    }
  if (endian === undefined) {
    try {
      return await read(data, { ...options, endian: "big" });
    } catch (error) {
      try {
        return await read(data, { ...options, endian: "little" });
      } catch {
        try {
          return await read(data, { ...options, endian: "little-varint" });
        } catch {
          throw error;
        }
      }
    }
  }
  if (rootName === undefined) {
    try {
      return await read(data, { ...options, rootName: true });
    } catch (error) {
      try {
        return await read(data, { ...options, rootName: false });
      } catch {
        throw error;
      }
    }
  }
  if (compression !== null) {
    data = await decompress(data, compression);
  }
  if (bedrockLevel === undefined) {
    bedrockLevel = reader.hasBedrockLevelHeader(endian);
  }
  return reader.readRoot({ rootName, endian, compression, bedrockLevel, strict });
}

class NBTReader {
  #byteOffset = 0;
  #data;
  #view;
  #littleEndian;
  #varint;
  #decoder = new MUtf8Decoder;
  constructor(data, littleEndian, varint) {
    this.#data = data;
    this.#view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    this.#littleEndian = littleEndian;
    this.#varint = varint;
  }
  hasGzipHeader() {
    const header = this.#view.getUint16(0, false);
    return header === 8075;
  }
  hasZlibHeader() {
    const header = this.#view.getUint8(0);
    return header === 120;
  }
  hasBedrockLevelHeader(endian) {
    if (endian !== "little" || this.#data.byteLength < 8)
      return false;
    const byteLength = this.#view.getUint32(4, true);
    return byteLength === this.#data.byteLength - 8;
  }
  #allocate(byteLength) {
    if (this.#byteOffset + byteLength > this.#data.byteLength) {
      throw new Error("Ran out of bytes to read, unexpectedly reached the end of the buffer");
    }
  }
  async readRoot({ rootName, endian, compression, bedrockLevel, strict }) {
    if (compression !== null) {
      this.#data = await decompress(this.#data, compression);
      this.#view = new DataView(this.#data.buffer);
    }
    if (bedrockLevel) {
      this.#readUnsignedInt();
      this.#readUnsignedInt();
    }
    const type = this.#readTagType();
    if (type !== TAG.LIST && type !== TAG.COMPOUND) {
      throw new Error(`Expected an opening List or Compound tag at the start of the buffer, encountered tag type '${type}'`);
    }
    const rootNameV = typeof rootName === "string" || rootName ? this.#readString() : null;
    if (typeof rootName === "string" && rootNameV !== rootName) {
      throw new Error(`Expected root name '${rootName}', encountered '${rootNameV}'`);
    }
    const root = this.#readTag(type);
    if (strict && this.#data.byteLength > this.#byteOffset) {
      const remaining = this.#data.byteLength - this.#byteOffset;
      throw new Error(`Encountered unexpected End tag at byte offset ${this.#byteOffset}, ${remaining} unread bytes remaining`);
    }
    const result = new NBTData(root, { rootName: rootNameV, endian, compression, bedrockLevel });
    if (!strict) {
      result.byteOffset = this.#byteOffset;
    }
    return result;
  }
  #readTag(type) {
    switch (type) {
      case TAG.END: {
        const remaining = this.#data.byteLength - this.#byteOffset;
        throw new Error(`Encountered unexpected End tag at byte offset ${this.#byteOffset}, ${remaining} unread bytes remaining`);
      }
      case TAG.BYTE:
        return this.#readByte();
      case TAG.SHORT:
        return this.#readShort();
      case TAG.INT:
        return this.#varint ? this.#readVarIntZigZag() : this.#readInt();
      case TAG.LONG:
        return this.#varint ? this.#readVarLongZigZag() : this.#readLong();
      case TAG.FLOAT:
        return this.#readFloat();
      case TAG.DOUBLE:
        return this.#readDouble();
      case TAG.BYTE_ARRAY:
        return this.#readByteArray();
      case TAG.STRING:
        return this.#readString();
      case TAG.LIST:
        return this.#readList();
      case TAG.COMPOUND:
        return this.#readCompound();
      case TAG.INT_ARRAY:
        return this.#readIntArray();
      case TAG.LONG_ARRAY:
        return this.#readLongArray();
      default:
        throw new Error(`Encountered unsupported tag type '${type}' at byte offset ${this.#byteOffset}`);
    }
  }
  #readTagType() {
    const type = this.#readUnsignedByte();
    if (!isTagType(type)) {
      throw new Error(`Encountered unsupported tag type '${type}' at byte offset ${this.#byteOffset}`);
    }
    return type;
  }
  #readUnsignedByte() {
    this.#allocate(1);
    const value = this.#view.getUint8(this.#byteOffset);
    this.#byteOffset += 1;
    return value;
  }
  #readByte(valueOf = false) {
    this.#allocate(1);
    const value = this.#view.getInt8(this.#byteOffset);
    this.#byteOffset += 1;
    return valueOf ? value : new Int8(value);
  }
  #readUnsignedShort() {
    this.#allocate(2);
    const value = this.#view.getUint16(this.#byteOffset, this.#littleEndian);
    this.#byteOffset += 2;
    return value;
  }
  #readShort(valueOf = false) {
    this.#allocate(2);
    const value = this.#view.getInt16(this.#byteOffset, this.#littleEndian);
    this.#byteOffset += 2;
    return valueOf ? value : new Int16(value);
  }
  #readUnsignedInt() {
    this.#allocate(4);
    const value = this.#view.getUint32(this.#byteOffset, this.#littleEndian);
    this.#byteOffset += 4;
    return value;
  }
  #readInt(valueOf = false) {
    this.#allocate(4);
    const value = this.#view.getInt32(this.#byteOffset, this.#littleEndian);
    this.#byteOffset += 4;
    return valueOf ? value : new Int32(value);
  }
  #readVarInt() {
    let value = 0;
    let shift = 0;
    let byte;
    while (true) {
      byte = this.#readByte(true);
      value |= (byte & 127) << shift;
      if ((byte & 128) === 0)
        break;
      shift += 7;
    }
    return value;
  }
  #readVarIntZigZag(valueOf = false) {
    let result = 0;
    let shift = 0;
    while (true) {
      this.#allocate(1);
      const byte = this.#readByte(true);
      result |= (byte & 127) << shift;
      if (!(byte & 128))
        break;
      shift += 7;
      if (shift > 63) {
        throw new Error(`VarInt size '${shift}' at byte offset ${this.#byteOffset} is too large`);
      }
    }
    const zigzag = (result << 63 >> 63 ^ result) >> 1 ^ result & 1 << 63;
    return valueOf ? zigzag : new Int32(zigzag);
  }
  #readLong() {
    this.#allocate(8);
    const value = this.#view.getBigInt64(this.#byteOffset, this.#littleEndian);
    this.#byteOffset += 8;
    return value;
  }
  #readVarLongZigZag() {
    let result = 0n;
    let shift = 0n;
    while (true) {
      this.#allocate(1);
      const byte = this.#readByte(true);
      result |= (BigInt(byte) & 0x7fn) << shift;
      if (!(byte & 128))
        break;
      shift += 7n;
      if (shift > 63n) {
        throw new Error(`VarLong size '${shift}' at byte offset ${this.#byteOffset} is too large`);
      }
    }
    const zigzag = result >> 1n ^ -(result & 1n);
    return zigzag;
  }
  #readFloat(valueOf = false) {
    this.#allocate(4);
    const value = this.#view.getFloat32(this.#byteOffset, this.#littleEndian);
    this.#byteOffset += 4;
    return valueOf ? value : new Float32(value);
  }
  #readDouble() {
    this.#allocate(8);
    const value = this.#view.getFloat64(this.#byteOffset, this.#littleEndian);
    this.#byteOffset += 8;
    return value;
  }
  #readByteArray() {
    const length = this.#varint ? this.#readVarIntZigZag(true) : this.#readInt(true);
    this.#allocate(length);
    const value = new Int8Array(this.#data.subarray(this.#byteOffset, this.#byteOffset + length));
    this.#byteOffset += length;
    return value;
  }
  #readString() {
    const length = this.#varint ? this.#readVarInt() : this.#readUnsignedShort();
    this.#allocate(length);
    const value = this.#decoder.decode(this.#data.subarray(this.#byteOffset, this.#byteOffset + length));
    this.#byteOffset += length;
    return value;
  }
  #readList() {
    const type = this.#readTagType();
    const length = this.#varint ? this.#readVarIntZigZag(true) : this.#readInt(true);
    const value = [];
    Object.defineProperty(value, TAG_TYPE, {
      configurable: true,
      enumerable: false,
      writable: true,
      value: type
    });
    for (let i = 0;i < length; i++) {
      const entry = this.#readTag(type);
      value.push(entry);
    }
    return value;
  }
  #readCompound() {
    const value = {};
    while (true) {
      const type = this.#readTagType();
      if (type === TAG.END)
        break;
      const name = this.#readString();
      const entry = this.#readTag(type);
      value[name] = entry;
    }
    return value;
  }
  #readIntArray() {
    const length = this.#varint ? this.#readVarIntZigZag(true) : this.#readInt(true);
    const value = new Int32Array(length);
    for (const i in value) {
      const entry = this.#readInt(true);
      value[i] = entry;
    }
    return value;
  }
  #readLongArray() {
    const length = this.#varint ? this.#readVarIntZigZag(true) : this.#readInt(true);
    const value = new BigInt64Array(length);
    for (const i in value) {
      const entry = this.#readLong();
      value[i] = entry;
    }
    return value;
  }
}

// src/structure.ts
class StructureImporter {
  static async fromBuffer(content) {
    const nbt = await read(new Uint8Array(content));
    return StructureImporter.parseRoot(nbt.data);
  }
  static parseRoot(root) {
    const sizeList = root["size"];
    const size = [
      Number(sizeList[0]),
      Number(sizeList[1]),
      Number(sizeList[2])
    ];
    const palette = root["palette"].map(StructureImporter.parsePaletteEntry);
    const blocks = root["blocks"].map(StructureImporter.parseBlock);
    return { size, palette, blocks };
  }
  static parsePaletteEntry(entry, index) {
    const name = entry["Name"] ?? entry["id"];
    if (typeof name !== "string" || !/^(?:[a-z0-9_.-]+:)?[a-z0-9_./-]+$/.test(name)) {
      throw new Error(`Invalid palette[${index}]: expected a block identifier in Name or id.`);
    }
    const propsTag = entry["Properties"] ?? entry["properties"];
    const properties = {};
    if (propsTag !== undefined) {
      if (getTagType(propsTag) !== TAG.COMPOUND) {
        throw new Error(`Invalid palette[${index}] (${name}): properties must be an NBT compound.`);
      }
      for (const [k, v] of Object.entries(propsTag)) {
        if (v !== undefined)
          properties[k] = String(v);
      }
    }
    return { name, properties };
  }
  static parseBlock(block) {
    const posList = block["pos"];
    const pos = [
      Number(posList[0]),
      Number(posList[1]),
      Number(posList[2])
    ];
    const state = Number(block["state"]);
    return { pos, state };
  }
}

// src/assets.ts
function readTextFile(path) {
  return new Promise((resolve, reject) => {
    Filesystem.readFile([path], { readtype: "text" }, (files) => {
      const file = files[0];
      if (!file?.content) {
        reject(new Error(`Cannot read: ${path}`));
        return;
      }
      resolve(file.content);
    });
  });
}
async function readJsonFile(path) {
  const text = await readTextFile(path);
  return JSON.parse(text);
}
function parseNamespace(id) {
  const colon = id.indexOf(":");
  if (colon === -1)
    return ["minecraft", id];
  return [id.slice(0, colon), id.slice(colon + 1)];
}
function blockstatePath(assetRoot, blockId) {
  const [ns, name] = parseNamespace(blockId);
  return `${assetRoot}/${ns}/blockstates/${name}.json`;
}
function modelPath(assetRoot, modelId) {
  const [ns, path] = parseNamespace(modelId);
  return `${assetRoot}/${ns}/models/${path}.json`;
}

// src/blockstate.ts
function resolveBlockstate(json, properties) {
  if ("variants" in json)
    return resolveVariants(json.variants, properties);
  if ("multipart" in json)
    return resolveMultipart(json.multipart, properties);
  return [];
}
function resolveVariants(variants, properties) {
  let bestKey = "";
  let bestScore = -1;
  for (const key of Object.keys(variants)) {
    if (key === "") {
      if (bestScore < 0) {
        bestKey = key;
        bestScore = 0;
      }
      continue;
    }
    const pairs = key.split(",");
    if (pairs.length <= bestScore)
      continue;
    const matches = pairs.every((pair) => {
      const eq = pair.indexOf("=");
      const val = properties[pair.slice(0, eq)];
      return val === undefined || val === pair.slice(eq + 1);
    });
    if (matches) {
      bestKey = key;
      bestScore = pairs.length;
    }
  }
  const entry = variants[bestKey];
  if (!entry)
    return [];
  const v = Array.isArray(entry) ? entry[0] : entry;
  return [{ model: v.model, x: v.x, y: v.y, uvlock: v.uvlock }];
}
function resolveMultipart(parts, properties) {
  const refs = [];
  for (const part of parts) {
    if (part.when && !matchesWhen(part.when, properties))
      continue;
    const v = Array.isArray(part.apply) ? part.apply[0] : part.apply;
    refs.push({ model: v.model, x: v.x, y: v.y, uvlock: v.uvlock });
  }
  return refs;
}
function matchesWhen(when, properties) {
  const orConditions = when.OR;
  if (Array.isArray(orConditions)) {
    return orConditions.some((cond) => matchesCondition(cond, properties));
  }
  return matchesCondition(when, properties);
}
function matchesCondition(cond, properties) {
  return Object.entries(cond).every(([k, v]) => v.split("|").includes(properties[k] ?? ""));
}

// src/model.ts
async function resolveModel(assetRoot, modelId, cache) {
  if (cache.has(modelId))
    return cache.get(modelId);
  const chain = await loadModelChain(assetRoot, modelId);
  const textures = {};
  for (let i = chain.length - 1;i >= 0; i--) {
    Object.assign(textures, chain[i].textures);
  }
  let elements = [];
  for (const model of chain) {
    if (model.elements?.length) {
      elements = model.elements.map((e) => parseElement(e, textures));
      break;
    }
  }
  const resolved = { elements };
  cache.set(modelId, resolved);
  return resolved;
}
function resolveTexVar(ref, textures) {
  let current = ref;
  const visited = new Set;
  while (current.startsWith("#")) {
    if (visited.has(current))
      return;
    visited.add(current);
    const next = textures[current.slice(1)];
    if (next === undefined)
      return;
    current = next;
  }
  return current;
}
function autoUV(from, to, face) {
  const [x1, y1, z1] = from;
  const [x2, y2, z2] = to;
  switch (face) {
    case "down":
      return [x1, z1, x2, z2];
    case "up":
      return [x1, z1, x2, z2];
    case "north":
      return [16 - x2, 16 - y2, 16 - x1, 16 - y1];
    case "south":
      return [x1, 16 - y2, x2, 16 - y1];
    case "west":
      return [z1, 16 - y2, z2, 16 - y1];
    case "east":
      return [16 - z2, 16 - y2, 16 - z1, 16 - y1];
    default:
      return [0, 0, 16, 16];
  }
}
function parseElement(e, textures) {
  const faces = {};
  for (const [dir, f] of Object.entries(e.faces ?? {})) {
    if (!f || !f.texture)
      continue;
    const resolved = resolveTexVar(f.texture, textures);
    if (!resolved)
      continue;
    const uv = f.uv ? [f.uv[0], f.uv[1], f.uv[2], f.uv[3]] : autoUV(e.from, e.to, dir);
    const faceData = { texture: resolved, uv };
    if (f.rotation !== undefined)
      faceData.rotation = f.rotation;
    if (f.tintindex !== undefined)
      faceData.tintindex = f.tintindex;
    faces[dir] = faceData;
  }
  const el = {
    from: [e.from[0], e.from[1], e.from[2]],
    to: [e.to[0], e.to[1], e.to[2]],
    faces
  };
  if (e.rotation) {
    const r = e.rotation;
    const axis = r.axis;
    if (axis === "x" || axis === "y" || axis === "z") {
      el.rotation = {
        origin: [r.origin[0], r.origin[1], r.origin[2]],
        axis,
        angle: r.angle
      };
    }
  }
  return el;
}
async function loadModelChain(assetRoot, startId) {
  const chain = [];
  let current = startId;
  const visited = new Set;
  while (current) {
    if (visited.has(current))
      break;
    visited.add(current);
    try {
      const json = await readJsonFile(modelPath(assetRoot, current));
      chain.push(json);
      current = json.parent;
    } catch {
      break;
    }
  }
  return chain;
}

// src/rotation.ts
var X_ROT_FIX_BLOCKS = new Set([
  "minecraft:oak_button",
  "minecraft:spruce_button",
  "minecraft:birch_button",
  "minecraft:jungle_button",
  "minecraft:acacia_button",
  "minecraft:dark_oak_button",
  "minecraft:mangrove_button",
  "minecraft:cherry_button",
  "minecraft:bamboo_button",
  "minecraft:crimson_button",
  "minecraft:warped_button",
  "minecraft:stone_button",
  "minecraft:polished_blackstone_button",
  "minecraft:lever"
]);
function rotY90([x, y, z]) {
  return [16 - z, y, x];
}
function rotX90([x, y, z]) {
  return [x, 16 - z, y];
}
function minmax(a, b) {
  return [
    [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.min(a[2], b[2])],
    [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.max(a[2], b[2])]
  ];
}
function axisUnderY90(axis, angle) {
  if (axis === "x")
    return { axis: "z", angle };
  if (axis === "z")
    return { axis: "x", angle: -angle };
  return { axis, angle };
}
function axisUnderX90(axis, angle) {
  if (axis === "y")
    return { axis: "z", angle };
  if (axis === "z")
    return { axis: "y", angle: -angle };
  return { axis, angle };
}
function rotateFacesX90(faces) {
  const r = {};
  if (faces.north !== undefined)
    r.up = faces.north;
  if (faces.up !== undefined)
    r.south = faces.up;
  if (faces.south !== undefined)
    r.down = faces.south;
  if (faces.down !== undefined)
    r.north = faces.down;
  if (faces.east !== undefined)
    r.east = faces.east;
  if (faces.west !== undefined)
    r.west = faces.west;
  return r;
}
function rotateFacesY90(faces) {
  const r = {};
  if (faces.north !== undefined)
    r.east = faces.north;
  if (faces.east !== undefined)
    r.south = faces.east;
  if (faces.south !== undefined)
    r.west = faces.south;
  if (faces.west !== undefined)
    r.north = faces.west;
  if (faces.up !== undefined)
    r.up = faces.up;
  if (faces.down !== undefined)
    r.down = faces.down;
  return r;
}
function applyBlockstateRotation(elements, ref, blockName) {
  const xSteps = Math.round((ref.x ?? 0) / 90) & 3;
  const ySteps = Math.round((ref.y ?? 0) / 90) & 3;
  if (!xSteps && !ySteps)
    return elements;
  return elements.map((el) => {
    let from = [...el.from];
    let to = [...el.to];
    let rotOrigin = el.rotation ? [...el.rotation.origin] : undefined;
    let rotAxis = el.rotation?.axis;
    let rotAngle = el.rotation?.angle;
    let faces = el.faces;
    for (let i = 0;i < xSteps; i++) {
      from = rotX90(from);
      to = rotX90(to);
      if (rotOrigin)
        rotOrigin = rotX90(rotOrigin);
      if (rotAxis !== undefined && rotAngle !== undefined)
        ({ axis: rotAxis, angle: rotAngle } = axisUnderX90(rotAxis, rotAngle));
      faces = rotateFacesX90(faces);
    }
    for (let i = 0;i < ySteps; i++) {
      from = rotY90(from);
      to = rotY90(to);
      if (rotOrigin)
        rotOrigin = rotY90(rotOrigin);
      if (rotAxis !== undefined && rotAngle !== undefined)
        ({ axis: rotAxis, angle: rotAngle } = axisUnderY90(rotAxis, rotAngle));
      faces = rotateFacesY90(faces);
    }
    if (xSteps > 0 && blockName && X_ROT_FIX_BLOCKS.has(blockName)) {
      for (let i = 0;i < 2; i++) {
        from = rotY90(from);
        to = rotY90(to);
        if (rotOrigin)
          rotOrigin = rotY90(rotOrigin);
        if (rotAxis !== undefined && rotAngle !== undefined)
          ({ axis: rotAxis, angle: rotAngle } = axisUnderY90(rotAxis, rotAngle));
        faces = rotateFacesY90(faces);
      }
    }
    const [nFrom, nTo] = minmax(from, to);
    return {
      from: nFrom,
      to: nTo,
      rotation: el.rotation && rotOrigin && rotAxis !== undefined && rotAngle !== undefined ? { origin: rotOrigin, axis: rotAxis, angle: rotAngle } : undefined,
      faces
    };
  });
}

// src/textures.ts
var textureCache = new Map;
var tintedTextureSet = new Set;
function clearTintedTextures() {
  tintedTextureSet.clear();
}
function getUsedTintedTextures() {
  return tintedTextureSet;
}
function texturePath(assetRoot, textureId) {
  const [ns, path] = parseNamespace(textureId);
  return `${assetRoot}/${ns}/textures/${path}.png`;
}
function getOrCreateTexture(assetRoot, textureId) {
  const absPath = texturePath(assetRoot, textureId);
  if (textureCache.has(absPath))
    return textureCache.get(absPath);
  const segments = textureId.split("/");
  const name = segments[segments.length - 1];
  const tex = new Texture({ name, path: absPath }).fromPath(absPath).add(false);
  textureCache.set(absPath, tex);
  return tex;
}
function getOrCreateTintedTexture(assetRoot, textureId, hexColor) {
  const absPath = texturePath(assetRoot, textureId);
  const cacheKey = `${absPath}|${hexColor}`;
  if (textureCache.has(cacheKey))
    return textureCache.get(cacheKey);
  const original = getOrCreateTexture(assetRoot, textureId);
  const r = parseInt(hexColor.slice(1, 3), 16) / 255;
  const g = parseInt(hexColor.slice(3, 5), 16) / 255;
  const b = parseInt(hexColor.slice(5, 7), 16) / 255;
  const segments = textureId.split("/");
  const name = segments[segments.length - 1];
  const tex = new Texture({ name }).add(false);
  tintedTextureSet.add(tex);
  textureCache.set(cacheKey, tex);
  const img = new Image;
  img.onload = () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0;i < d.length; i += 4) {
        d[i] = (d[i] ?? 0) * r;
        d[i + 1] = (d[i + 1] ?? 0) * g;
        d[i + 2] = (d[i + 2] ?? 0) * b;
      }
      ctx.putImageData(imageData, 0, 0);
      tex.fromDataURL(canvas.toDataURL("image/png"));
    } catch (error) {
      console.warn(`Failed to tint texture ${textureId}`, error);
    }
  };
  img.onerror = () => console.warn(`Failed to load texture for tinting: ${textureId}`);
  img.src = original.source;
  return tex;
}

// src/culling.ts
var TRANSPARENT_BLOCKS = new Set([
  "minecraft:glass",
  "minecraft:glass_pane",
  "minecraft:tinted_glass",
  "minecraft:white_stained_glass",
  "minecraft:white_stained_glass_pane",
  "minecraft:orange_stained_glass",
  "minecraft:orange_stained_glass_pane",
  "minecraft:magenta_stained_glass",
  "minecraft:magenta_stained_glass_pane",
  "minecraft:light_blue_stained_glass",
  "minecraft:light_blue_stained_glass_pane",
  "minecraft:yellow_stained_glass",
  "minecraft:yellow_stained_glass_pane",
  "minecraft:lime_stained_glass",
  "minecraft:lime_stained_glass_pane",
  "minecraft:pink_stained_glass",
  "minecraft:pink_stained_glass_pane",
  "minecraft:gray_stained_glass",
  "minecraft:gray_stained_glass_pane",
  "minecraft:light_gray_stained_glass",
  "minecraft:light_gray_stained_glass_pane",
  "minecraft:cyan_stained_glass",
  "minecraft:cyan_stained_glass_pane",
  "minecraft:purple_stained_glass",
  "minecraft:purple_stained_glass_pane",
  "minecraft:blue_stained_glass",
  "minecraft:blue_stained_glass_pane",
  "minecraft:brown_stained_glass",
  "minecraft:brown_stained_glass_pane",
  "minecraft:green_stained_glass",
  "minecraft:green_stained_glass_pane",
  "minecraft:red_stained_glass",
  "minecraft:red_stained_glass_pane",
  "minecraft:black_stained_glass",
  "minecraft:black_stained_glass_pane",
  "minecraft:oak_trapdoor",
  "minecraft:jungle_trapdoor",
  "minecraft:acacia_trapdoor",
  "minecraft:mangrove_trapdoor",
  "minecraft:cherry_trapdoor",
  "minecraft:bamboo_trapdoor",
  "minecraft:crimson_trapdoor",
  "minecraft:warped_trapdoor",
  "minecraft:iron_trapdoor",
  "minecraft:copper_trapdoor",
  "minecraft:exposed_copper_trapdoor",
  "minecraft:weathered_copper_trapdoor",
  "minecraft:oxidized_copper_trapdoor",
  "minecraft:waxed_copper_trapdoor",
  "minecraft:waxed_exposed_copper_trapdoor",
  "minecraft:waxed_weathered_copper_trapdoor",
  "minecraft:waxed_oxidized_copper_trapdoor",
  "minecraft:oak_leaves",
  "minecraft:spruce_leaves",
  "minecraft:birch_leaves",
  "minecraft:jungle_leaves",
  "minecraft:acacia_leaves",
  "minecraft:dark_oak_leaves",
  "minecraft:mangrove_leaves",
  "minecraft:mangrove_roots",
  "minecraft:cherry_leaves",
  "minecraft:pale_oak_leaves",
  "minecraft:azalea_leaves",
  "minecraft:flowering_azalea_leaves"
]);
var OPPOSITE = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
  up: "down",
  down: "up"
};
var DIR_OFFSET = {
  north: [0, 0, -1],
  south: [0, 0, 1],
  east: [1, 0, 0],
  west: [-1, 0, 0],
  up: [0, 1, 0],
  down: [0, -1, 0]
};
function posKey([x, y, z]) {
  return `${x},${y},${z}`;
}
function facePlanePos(el, dir) {
  switch (dir) {
    case "north":
      return el.from[2];
    case "south":
      return el.to[2];
    case "west":
      return el.from[0];
    case "east":
      return el.to[0];
    case "down":
      return el.from[1];
    case "up":
      return el.to[1];
  }
}
function faceRect(el, dir) {
  const [x1, y1, z1] = el.from;
  const [x2, y2, z2] = el.to;
  switch (dir) {
    case "north":
    case "south":
      return [x1, y1, x2, y2];
    case "west":
    case "east":
      return [z1, y1, z2, y2];
    case "down":
    case "up":
      return [x1, z1, x2, z2];
  }
}
function isFullyCovered(target, covers) {
  const [tu1, tv1, tu2, tv2] = target;
  if (tu1 >= tu2 || tv1 >= tv2)
    return true;
  for (const [cu1, cv1, cu2, cv2] of covers) {
    if (cu1 <= tu1 && cu2 >= tu2 && cv1 <= tv1 && cv2 >= tv2)
      return true;
  }
  const clipped = covers.map(([cu1, cv1, cu2, cv2]) => [
    Math.max(cu1, tu1),
    Math.max(cv1, tv1),
    Math.min(cu2, tu2),
    Math.min(cv2, tv2)
  ]).filter(([u1, v1, u2, v2]) => u1 < u2 && v1 < v2);
  if (!clipped.length)
    return false;
  const vs = new Set([tv1, tv2]);
  for (const [, v1, , v2] of clipped) {
    vs.add(v1);
    vs.add(v2);
  }
  const rows = [...vs].filter((v) => v >= tv1 && v < tv2).sort((a, b) => a - b);
  for (const v of rows) {
    const segs = clipped.filter(([, v1, , v2]) => v1 <= v && v2 > v).map(([u1, , u2]) => [u1, u2]);
    segs.sort(([a], [b]) => a - b);
    let covered = tu1;
    for (const [su, eu] of segs) {
      if (su > covered)
        return false;
      covered = Math.max(covered, eu);
    }
    if (covered < tu2)
      return false;
  }
  return true;
}
function buildPositionMap(blocks, paletteElements, palette) {
  const map = new Map;
  for (const block of blocks) {
    const els = paletteElements[block.state];
    const name = palette[block.state]?.name ?? "";
    if (els?.length)
      map.set(posKey(block.pos), { elements: els, name });
  }
  return map;
}
function cullFaces(elements, pos, posMap) {
  return elements.map((el) => {
    if (el.rotation && (el.rotation.axis === "x" || el.rotation.axis === "z")) {
      return el;
    }
    const newFaces = { ...el.faces };
    for (const dir of Object.keys(newFaces)) {
      const plane = facePlanePos(el, dir);
      if (plane !== 0 && plane !== 16)
        continue;
      const off = DIR_OFFSET[dir];
      const adjKey = posKey([pos[0] + off[0], pos[1] + off[1], pos[2] + off[2]]);
      const adj = posMap.get(adjKey);
      if (!adj)
        continue;
      if (TRANSPARENT_BLOCKS.has(adj.name))
        continue;
      const opp = OPPOSITE[dir];
      const adjBoundary = plane === 0 ? 16 : 0;
      const coverRects = adj.elements.filter((a) => facePlanePos(a, opp) === adjBoundary).map((a) => faceRect(a, opp));
      if (isFullyCovered(faceRect(el, dir), coverRects)) {
        delete newFaces[dir];
      }
    }
    return { ...el, faces: newFaces };
  });
}

// src/geometry.ts
async function buildStructure(structureName, data, assetRoot, scale, tintColor) {
  const modelCache = new Map;
  clearTintedTextures();
  Blockbench.setProgress(0);
  const paletteElements = await resolvePalette(data.palette, assetRoot, modelCache);
  const posMap = buildPositionMap(data.blocks, paletteElements, data.palette);
  const total = data.blocks.length;
  let facesCulled = 0;
  Undo.initEdit({ outliner: true, elements: [], textures: [] });
  const rootGroup = new Group({ name: structureName, origin: [0, 0, 0] });
  rootGroup.addTo().init();
  for (let bi = 0;bi < total; bi++) {
    const block = data.blocks[bi];
    const entry = data.palette[block.state];
    if (!entry)
      continue;
    const rawElements = paletteElements[block.state] ?? [];
    if (!rawElements.length)
      continue;
    const elements = cullFaces(rawElements, block.pos, posMap);
    facesCulled += countFaces(rawElements) - countFaces(elements);
    const visibleEls = elements.filter((e) => Object.keys(e.faces).length > 0);
    if (!visibleEls.length)
      continue;
    const blockName = entry.name.includes(":") ? entry.name.split(":")[1] : entry.name;
    if (visibleEls.length === 1) {
      makeCube(blockName, block.pos, visibleEls[0], scale, assetRoot, tintColor).addTo(rootGroup).init();
    } else {
      const blockGroup = new Group({ name: blockName, origin: [0, 0, 0] });
      blockGroup.addTo(rootGroup).init();
      for (const el of visibleEls) {
        makeCube(undefined, block.pos, el, scale, assetRoot, tintColor).addTo(blockGroup).init();
      }
    }
    if (bi % 100 === 0) {
      Blockbench.setProgress(0.3 + bi / total * 0.7);
      Blockbench.showQuickMessage(`Importing… ${bi}/${total} blocks`, 500);
      await new Promise((r) => setTimeout(r, 0));
    }
  }
  Undo.finishEdit(`Import structure: ${structureName}`);
  Canvas.updateAll();
  updateInterface();
  Blockbench.setProgress(1);
  Blockbench.showQuickMessage(`Done: ${total} blocks · ${data.size.join("×")} · ${facesCulled} faces culled`, 5000);
  setTimeout(() => Blockbench.setProgress(0), 1500);
}
function countFaces(elements) {
  return elements.reduce((n, e) => n + Object.keys(e.faces).length, 0);
}
function makeCube(name, blockPos, el, scale, assetRoot, tintColor) {
  const faceOptions = {};
  for (const dir of Object.keys(el.faces)) {
    const face = el.faces[dir];
    try {
      const useTint = face.tintindex !== undefined && tintColor !== undefined;
      const tex = useTint ? getOrCreateTintedTexture(assetRoot, face.texture, tintColor) : getOrCreateTexture(assetRoot, face.texture);
      const opts = { texture: tex, uv: face.uv, enabled: true };
      if (face.rotation !== undefined)
        opts.rotation = face.rotation;
      faceOptions[dir] = opts;
    } catch {}
  }
  const options = {
    name,
    from: toModel(blockPos, el.from, scale),
    to: toModel(blockPos, el.to, scale),
    autouv: 0,
    faces: faceOptions
  };
  if (el.rotation) {
    const r = el.rotation;
    options.origin = toModel(blockPos, r.origin, scale);
    options.rotation = [
      r.axis === "x" ? r.angle : 0,
      r.axis === "y" ? r.angle : 0,
      r.axis === "z" ? r.angle : 0
    ];
  }
  const cube = new Cube(options);
  for (const dir of Object.keys(cube.faces)) {
    if (!faceOptions[dir])
      cube.faces[dir].texture = null;
  }
  return cube;
}
async function resolvePalette(palette, assetRoot, modelCache) {
  const result = [];
  for (let i = 0;i < palette.length; i++) {
    result.push(await resolveEntryElements(palette[i], assetRoot, modelCache));
    Blockbench.setProgress(i / palette.length * 0.3);
    await new Promise((r) => setTimeout(r, 0));
  }
  return result;
}
async function resolveEntryElements(entry, assetRoot, modelCache) {
  let blockstateJson;
  try {
    blockstateJson = await readJsonFile(blockstatePath(assetRoot, entry.name));
  } catch {
    return [];
  }
  let refs;
  try {
    refs = resolveBlockstate(blockstateJson, entry.properties);
  } catch {
    return [];
  }
  const elements = [];
  for (const ref of refs) {
    try {
      const resolved = await resolveModel(assetRoot, ref.model, modelCache);
      const rotated = applyBlockstateRotation(resolved.elements, ref, entry.name);
      elements.push(...rotated);
    } catch {}
  }
  return elements;
}
function toModel(blockPos, local, scale) {
  return [
    (blockPos[0] * 16 + local[0]) / scale,
    (blockPos[1] * 16 + local[1]) / scale,
    (blockPos[2] * 16 + local[2]) / scale
  ];
}

// src/index.ts
var STORAGE_ASSET_ROOT = "stm_asset_root";
var STORAGE_SCALE = "stm_scale";
var STORAGE_TINT_PRESET = "stm_tint_preset";
var STORAGE_TINT_COLOR = "stm_tint_color";
var STORAGE_PACK_ROOT = "stm_pack_root";
var STORAGE_TINT_PATH = "stm_tint_path";
var TINT_PRESETS = {
  plains: "#79C05A",
  jungle: "#59C93C",
  swamp: "#6A7039",
  desert: "#BFB755",
  snowy: "#80B497"
};
function getAssetRoot() {
  return localStorage.getItem(STORAGE_ASSET_ROOT) ?? "";
}
function getScale() {
  return Number(localStorage.getItem(STORAGE_SCALE) ?? "16");
}
function getTintPreset() {
  return localStorage.getItem(STORAGE_TINT_PRESET) ?? "none";
}
function getTintCustomColor() {
  return localStorage.getItem(STORAGE_TINT_COLOR) ?? "#79C05A";
}
function getPackRoot() {
  return localStorage.getItem(STORAGE_PACK_ROOT) ?? "";
}
function getTintPath() {
  return localStorage.getItem(STORAGE_TINT_PATH) ?? "";
}
function getTintColor() {
  const preset = getTintPreset();
  if (preset === "none")
    return;
  if (preset === "custom")
    return getTintCustomColor();
  return TINT_PRESETS[preset];
}
function saveTintedTexturesToDisk(textures, packRoot, textureId) {
  const fs = requireNativeModule("fs");
  if (!fs) {
    Blockbench.showMessageBox({
      title: "File System Access Required",
      message: "Could not access the file system to save tinted textures."
    });
    return;
  }
  const path = requireNativeModule("path");
  const colon = textureId.indexOf(":");
  const namespace = colon >= 0 ? textureId.slice(0, colon) : "minecraft";
  const pathPrefix = colon >= 0 ? textureId.slice(colon + 1) : textureId;
  const targetDir = path.join(packRoot, "assets", namespace, "textures", "block", pathPrefix);
  fs.mkdirSync(targetDir, { recursive: true });
  for (const tex of textures) {
    const filePath = path.join(targetDir, `${tex.name}.png`);
    const src = tex.source;
    const base64 = src.slice(src.indexOf(",") + 1);
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0;i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    fs.writeFileSync(filePath, bytes);
    tex.fromPath(filePath);
  }
  Blockbench.showQuickMessage(`Saved ${textures.size} tinted texture${textures.size === 1 ? "" : "s"} to resource pack.`, 4000);
}
function showSaveTintedDialog(textures) {
  new Dialog({
    id: "stm_save_tinted",
    title: "Save Tinted Textures",
    lines: [
      `<p style="margin:0 0 4px">${textures.size} tinted texture${textures.size === 1 ? " was" : "s were"} generated. Provide a location in your resource pack to save them.</p>`
    ],
    form: {
      pack_root: {
        label: "Resource Pack Root",
        description: "Folder containing pack.mcmeta",
        type: "folder",
        value: getPackRoot()
      },
      texture_id: {
        label: "Target Texture Path",
        description: "Namespace and path prefix, e.g. example:ship/test",
        type: "text",
        value: getTintPath()
      }
    },
    onConfirm(result) {
      const packRoot = result["pack_root"];
      const textureId = result["texture_id"];
      if (!packRoot || !textureId) {
        Blockbench.showMessageBox({
          title: "Missing Input",
          message: "Both the resource pack root and texture path are required."
        });
        return;
      }
      localStorage.setItem(STORAGE_PACK_ROOT, packRoot);
      localStorage.setItem(STORAGE_TINT_PATH, textureId);
      try {
        saveTintedTexturesToDisk(textures, packRoot, textureId);
      } catch (err) {
        Blockbench.showMessageBox({
          title: "Save Error",
          message: String(err)
        });
      }
    }
  }).show();
}
var importAction;
var settingsAction;
var settingsDialog;
BBPlugin.register("structure_to_model", {
  title: "Structure to Model",
  author: "Mester",
  icon: "account_balance",
  description: "Converts Minecraft Java structures (.nbt) into a model.",
  version: "1.1.0",
  has_changelog: true,
  min_version: "5.0.0",
  variant: "desktop",
  tags: ["Minecraft: Java Edition", "Modeling", "Utility"],
  repository: "https://github.com/MesterMan03/structure-to-model",
  bug_tracker: "https://github.com/MesterMan03/structure-to-model/issues",
  creation_date: "2026/05/06",
  onload,
  onunload
});
function onload() {
  settingsDialog = new Dialog({
    id: "stm_settings",
    title: "Structure to Model Settings",
    form: {
      asset_root: {
        label: "Asset Root",
        description: "Path to the Minecraft assets folder (must contain blockstates/, models/, textures/)",
        type: "folder",
        value: getAssetRoot()
      },
      scale: {
        label: "Scale",
        description: "Divide world coordinates by this value. Scale 16 = 16 blocks fit in one model unit.",
        type: "number",
        value: getScale(),
        min: 1,
        step: 1
      },
      tint_preset: {
        label: "Tint Preset",
        description: "Biome tint color applied to leaves, grass, and other tinted block faces.",
        type: "select",
        value: getTintPreset(),
        options: {
          none: "None",
          plains: "Plains (#79C05A)",
          jungle: "Jungle (#59C93C)",
          swamp: "Swamp (#6A7039)",
          desert: "Desert / Savanna (#BFB755)",
          snowy: "Snowy Tundra (#80B497)",
          custom: "Custom…"
        }
      },
      tint_color: {
        label: "Custom Tint Color",
        description: "Used only when 'Custom…' is selected above.",
        type: "color",
        value: getTintCustomColor()
      }
    },
    onConfirm(result) {
      localStorage.setItem(STORAGE_ASSET_ROOT, result["asset_root"]);
      localStorage.setItem(STORAGE_SCALE, String(result["scale"]));
      localStorage.setItem(STORAGE_TINT_PRESET, result["tint_preset"]);
      localStorage.setItem(STORAGE_TINT_COLOR, result["tint_color"]);
      Blockbench.showQuickMessage("Settings saved.");
    }
  });
  settingsAction = new Action("stm_settings", {
    name: "STM: Settings",
    description: "Configure Structure to Model settings",
    icon: "settings",
    click: () => settingsDialog.show()
  });
  importAction = new Action("stm_import", {
    name: "STM: Import Structure",
    description: "Import a .nbt structure file and convert it to a model",
    icon: "file_open",
    click: () => {
      Filesystem.importFile({
        type: "Minecraft Structure",
        extensions: ["nbt"],
        readtype: "buffer"
      }, async (files) => {
        if (!files.length)
          return;
        const file = files[0];
        try {
          const assetRoot = getAssetRoot();
          if (!assetRoot) {
            Blockbench.showMessageBox({
              title: "Asset Root Not Set",
              message: "Set the asset root folder in Tools > STM: Settings before importing."
            });
            return;
          }
          const scale = getScale();
          const tintColor = getTintColor();
          const structureName = file.name.replace(/\.nbt$/i, "");
          const data = await StructureImporter.fromBuffer(file.content);
          Blockbench.showQuickMessage(`Building ${data.blocks.length} blocks…`);
          await buildStructure(structureName, data, assetRoot, scale, tintColor);
          const tintedTextures = getUsedTintedTextures();
          if (tintedTextures.size > 0) {
            showSaveTintedDialog(tintedTextures);
          }
        } catch (err) {
          Blockbench.showMessageBox({
            title: "Structure Import Error",
            message: String(err)
          });
        }
      });
    }
  });
  MenuBar.addAction(importAction, "tools");
  MenuBar.addAction(settingsAction, "tools");
}
function onunload() {
  importAction.delete();
  settingsAction.delete();
}
