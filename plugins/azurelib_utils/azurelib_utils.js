/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 2:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetAllKeys = __webpack_require__(2199),
    getSymbols = __webpack_require__(4664),
    keys = __webpack_require__(5950);

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),

/***/ 79:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var listCacheClear = __webpack_require__(3702),
    listCacheDelete = __webpack_require__(80),
    listCacheGet = __webpack_require__(4739),
    listCacheHas = __webpack_require__(8655),
    listCacheSet = __webpack_require__(1175);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),

/***/ 80:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(6025);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),

/***/ 104:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var MapCache = __webpack_require__(3661);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;


/***/ }),

/***/ 144:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(3908)
const parse = (version, options, throwErrors = false) => {
  if (version instanceof SemVer) {
    return version
  }
  try {
    return new SemVer(version, options)
  } catch (er) {
    if (!throwErrors) {
      return null
    }
    throw er
  }
}

module.exports = parse


/***/ }),

/***/ 179:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayMap = __webpack_require__(4932),
    baseClone = __webpack_require__(9999),
    baseUnset = __webpack_require__(9931),
    castPath = __webpack_require__(1769),
    copyObject = __webpack_require__(1791),
    customOmitClone = __webpack_require__(3138),
    flatRest = __webpack_require__(8816),
    getAllKeysIn = __webpack_require__(3349);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable property paths of `object` that are not omitted.
 *
 * **Note:** This method is considerably slower than `_.pick`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = flatRest(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = arrayMap(paths, function(path) {
    path = castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object, getAllKeysIn(object), result);
  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
  }
  var length = paths.length;
  while (length--) {
    baseUnset(result, paths[length]);
  }
  return result;
});

module.exports = omit;


/***/ }),

/***/ 181:
/***/ ((module) => {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;


/***/ }),

/***/ 259:
/***/ ((module) => {

"use strict";

module.exports = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value
    }
  }
}


/***/ }),

/***/ 289:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(2651);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),

/***/ 294:
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),

/***/ 346:
/***/ ((module) => {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ 361:
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),

/***/ 392:
/***/ ((module) => {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),

/***/ 560:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(3908)
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

module.exports = compare


/***/ }),

/***/ 659:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(1873);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ 695:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTimes = __webpack_require__(8096),
    isArguments = __webpack_require__(2428),
    isArray = __webpack_require__(6449),
    isBuffer = __webpack_require__(3656),
    isIndex = __webpack_require__(361),
    isTypedArray = __webpack_require__(7167);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  loadAzureLib: () => (/* binding */ loadAzureLib),
  unloadAzureLib: () => (/* binding */ unloadAzureLib)
});

// EXTERNAL MODULE: ./node_modules/semver/functions/coerce.js
var coerce = __webpack_require__(6170);
var coerce_default = /*#__PURE__*/__webpack_require__.n(coerce);
// EXTERNAL MODULE: ./node_modules/semver/functions/satisfies.js
var satisfies = __webpack_require__(7638);
var satisfies_default = /*#__PURE__*/__webpack_require__.n(satisfies);
;// ./package.json
const package_namespaceObject = /*#__PURE__*/JSON.parse('{"rE":"2.3.0","Ug":{"title":"AzureLib Animator","author":"AzureDoom, Eliot Lash, Gecko, McHorse","icon":"azureicon.png","description":"Create models, textures, and animations for AzureLib-powered mods using Bedrock-style tools.","min_version":"4.8.0","max_version":"15.0.0","new_repository_format":true,"await_loading":true,"variant":"both","creation_date":"2023-04-04","contributes":{"formats":["azure_model"]},"has_changelog":true,"website":"https://wiki.azuredoom.com/","tags":["Minecraft: Java Edition"]}}');
// EXTERNAL MODULE: ./node_modules/lodash/lodash.js
var lodash = __webpack_require__(2543);
;// ./animation/azure-easing.js
/**
 * AzureLib Animator — Easing Definitions
 * --------------------------------------
 * Provides the easing function registry and argument parsing logic
 * used for interpolating animated keyframes in AzureLib.
 *
 * © 2026 AzureDoom — MIT License
 */



// ---------------------------------------------------------------------------
// Constants and types
// ---------------------------------------------------------------------------

/**
 * Enumeration of supported easing functions.
 * Matches AzureLib's Java easing mappings for full parity.
 */
const EASING_TYPES = {
  linear: 'linear',
  step: 'step',
  easeInSine: 'easeInSine',
  easeOutSine: 'easeOutSine',
  easeInOutSine: 'easeInOutSine',
  easeInQuad: 'easeInQuad',
  easeOutQuad: 'easeOutQuad',
  easeInOutQuad: 'easeInOutQuad',
  easeInCubic: 'easeInCubic',
  easeOutCubic: 'easeOutCubic',
  easeInOutCubic: 'easeInOutCubic',
  easeInQuart: 'easeInQuart',
  easeOutQuart: 'easeOutQuart',
  easeInOutQuart: 'easeInOutQuart',
  easeInQuint: 'easeInQuint',
  easeOutQuint: 'easeOutQuint',
  easeInOutQuint: 'easeInOutQuint',
  easeInExpo: 'easeInExpo',
  easeOutExpo: 'easeOutExpo',
  easeInOutExpo: 'easeInOutExpo',
  easeInCirc: 'easeInCirc',
  easeOutCirc: 'easeOutCirc',
  easeInOutCirc: 'easeInOutCirc',
  easeInBack: 'easeInBack',
  easeOutBack: 'easeOutBack',
  easeInOutBack: 'easeInOutBack',
  easeInElastic: 'easeInElastic',
  easeOutElastic: 'easeOutElastic',
  easeInOutElastic: 'easeInOutElastic',
  easeInBounce: 'easeInBounce',
  easeOutBounce: 'easeOutBounce',
  easeInOutBounce: 'easeInOutBounce',
};

/** Default easing for new keyframes. */
const EASING_DEFAULT = EASING_TYPES.linear;

/** Default argument for easing functions that use one. */
const DEFAULT_ARG = 1;

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

/**
 * Compute an eased value between 0 and 1 based on an easing type.
 * @param {string} easingName
 * @param {number} t - normalized time (0..1)
 * @param {number} [arg] - optional argument
 * @returns {number}
 */
function applyEasing(easingName, t, arg = DEFAULT_ARG) {
  const ease = easingRegistry[easingName] || easingRegistry.linear;
  return ease(t, arg);
}

/**
 * Return whether a given easing type expects a numeric argument.
 * @param {string} easingName
 * @returns {boolean}
 */
function hasArgs(easingName) {
  return (
    easingName?.includes('Back') ||
    easingName?.includes('Elastic') ||
    easingName?.includes('Bounce') ||
    easingName === 'step'
  );
}

/**
 * Returns the default argument for a given easing.
 * @param {string} easingName
 * @returns {number}
 */
function getEasingArgDefault(easingName) {
  if (!hasArgs(easingName)) return DEFAULT_ARG;
  if (easingName?.includes('Back')) return 1.70158;
  if (easingName?.includes('Elastic')) return 1;
  if (easingName?.includes('Bounce')) return 1;
  if (easingName === 'step') return 4;
  return DEFAULT_ARG;
}

/**
 * Parses an argument from user input, falling back to defaults if invalid.
 * @param {object} keyframe
 * @param {string} input
 * @returns {number}
 */
function parseEasingArg(keyframe, input) {
  const num = parseFloat(input);
  if (isNaN(num)) return getEasingArgDefault(keyframe.easing);
  const arg = Math.max(-9999, Math.min(9999, num));
  return arg;
}

// ---------------------------------------------------------------------------
// Easing function implementations
// ---------------------------------------------------------------------------

const PI = Math.PI;
const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = (2 * PI) / 3;
const c5 = (2 * PI) / 4.5;

const bounceOut = x => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
};

/**
 * The easing registry maps an easing name → function.
 * Each function takes `(t, arg?)` and returns eased t.
 */
const easingRegistry = {
  linear: t => t,

  step: (t, n = 4) => Math.floor((0,lodash.clamp)(t * n, 0, n - 1)) / (n - 1),

  easeInSine: t => 1 - Math.cos((t * PI) / 2),
  easeOutSine: t => Math.sin((t * PI) / 2),
  easeInOutSine: t => -(Math.cos(PI * t) - 1) / 2,

  easeInQuad: t => t * t,
  easeOutQuad: t => 1 - (1 - t) * (1 - t),
  easeInOutQuad: t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),

  easeInCubic: t => t * t * t,
  easeOutCubic: t => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: t =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,

  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - Math.pow(1 - t, 4),
  easeInOutQuart: t =>
    t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,

  easeInQuint: t => t * t * t * t * t,
  easeOutQuint: t => 1 - Math.pow(1 - t, 5),
  easeInOutQuint: t =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2,

  easeInExpo: t => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  easeOutExpo: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: t =>
    t === 0
      ? 0
      : t === 1
      ? 1
      : t < 0.5
      ? Math.pow(2, 20 * t - 10) / 2
      : (2 - Math.pow(2, -20 * t + 10)) / 2,

  easeInCirc: t => 1 - Math.sqrt(1 - Math.pow(t, 2)),
  easeOutCirc: t => Math.sqrt(1 - Math.pow(t - 1, 2)),
  easeInOutCirc: t =>
    t < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2,

  easeInBack: (t, s = c1) => c3 * t * t * t - s * t * t,
  easeOutBack: (t, s = c1) =>
    1 + c3 * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
  easeInOutBack: (t, s = c1) =>
    t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2,

  easeInElastic: (t, p = 1) =>
    t === 0
      ? 0
      : t === 1
      ? 1
      : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4 * p),

  easeOutElastic: (t, p = 1) =>
    t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4 * p) + 1,

  easeInOutElastic: (t, p = 1) =>
    t === 0
      ? 0
      : t === 1
      ? 1
      : t < 0.5
      ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5 * p)) / 2
      : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5 * p)) / 2 +
        1,

  easeInBounce: t => 1 - bounceOut(1 - t),
  easeOutBounce: bounceOut,
  easeInOutBounce: t =>
    t < 0.5
      ? (1 - bounceOut(1 - 2 * t)) / 2
      : (1 + bounceOut(2 * t - 1)) / 2,
};

/* harmony default export */ const azure_easing = ((/* unused pure expression or super */ null && (easingRegistry)));

;// ./animation/azure-animation-ui.js
/**
 * AzureLib Animator — Unified Animation UI
 * ----------------------------------------
 * Custom animation panel that replaces the Minecraft Bedrock animation tab.
 * Supports AzureLib custom easings and Bedrock lerp_mode (catmullrom/linear)
 * in one unified interface.
 *
 * UI features:
 *   - Easing family picker (Azure easings: sine, quad, cubic … + linear/step)
 *   - In / Out / InOut type toggle
 *   - Numeric argument input for Back/Elastic/Bounce/Step
 *   - Bedrock catmullrom toggle (sets interpolation, not easing)
 *   - All controls update all selected keyframes atomically via the undo system
 *
 * © 2026 AzureDoom — MIT License
 */





// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

let _uiListeners = false;

function initializeAnimationUI() {
  if (_uiListeners) return;

  Blockbench.on('display_animation_frame', _onFrame);
  Blockbench.on('update_keyframe_selection', refreshKeyframeUI);

  // Expose handlers globally so inline HTML oninput/onclick can call them
  window._azureApplyEasing       = applyKeyframeEasing;
  window._azureApplyEasingArg    = applyEasingArgument;
  window._azureToggleCatmullrom  = toggleCatmullrom;  // kept for compat
  window._azureSetInterpolation   = setInterpolation;

  // Suppress Blockbench's stock interpolation selector in Azure format
  _patchStockInterpolationBar();

  _uiListeners = true;
  console.log('[AzureLib] Animation UI initialised');
}

function unloadAnimationUI() {
  if (!_uiListeners) return;

  Blockbench.removeListener('display_animation_frame', _onFrame);
  Blockbench.removeListener('update_keyframe_selection', refreshKeyframeUI);

  delete window._azureApplyEasing;
  delete window._azureApplyEasingArg;
  delete window._azureToggleCatmullrom;

  _cleanupKeyframePanel();
  _uiListeners = false;
}

// ---------------------------------------------------------------------------
// Keyframe panel refresh (main entry point)
// ---------------------------------------------------------------------------

const PANEL_BARS = [
  'azl_bar_catmullrom',
  'azl_bar_easing',
  'azl_bar_easing_azure',
  'azl_bar_easing_type',
  'azl_bar_easing_arg',
];

function refreshKeyframeUI() {
  _cleanupKeyframePanel();

  // Only show Azure controls when our format is active
  if (Format?.id !== 'azure_model') return;

  // Show/hide the stock pre/post toggle button
  const addPrePost = document.querySelector('#keyframe_type_label > div');
  if (addPrePost) addPrePost.hidden = true;

  const selected = Timeline.selected;
  if (!selected || !selected.length) return;

  const keyframesByChannel = _groupByChannel(Timeline.keyframes);
  const firstInChannel = kf => {
    const ch = keyframesByChannel.get(kf.animator)?.[kf.channel] || [];
    return ch.indexOf(kf) < 1;
  };

  // Only render for bone keyframes that are not the first in their channel
  if (!selected.every(kf => kf.animator instanceof BoneAnimator && !firstInChannel(kf))) return;

  const panel = document.getElementById('panel_keyframe');
  if (!panel) return;

  _renderInterpolationBar(panel, selected);
  _renderEasingBar(panel, selected);
}

// ---------------------------------------------------------------------------
// Bedrock interpolation bar
// Blockbench stores these as kf.interpolation:
//   undefined / null → AzureLib easing mode (our default)
//   'catmullrom'     → Bedrock smooth spline (BB "Smooth")
//   'bezier'         → Bezier curves (BB "Bezier")
//   'step'           → Discrete step (BB "Step")
// ---------------------------------------------------------------------------

/**
 * All Blockbench-native interpolation modes we expose.
 * Selecting any of these sets kf.interpolation and clears kf.easing.
 * "Azure Easing" is our own mode — clears interpolation, uses kf.easing instead.
 */
const BB_INTERP_MODES = [
  { id: null,          label: 'Azure Easing', title: 'Use AzureLib custom easing (see section below)' },
  { id: 'catmullrom',  label: 'Smooth',        title: 'Bedrock catmullrom spline (BB: Smooth)' },
  { id: 'bezier',      label: 'Bezier',        title: 'Bezier curve interpolation (BB: Bezier)' },
  { id: 'step',        label: 'Step',          title: 'Discrete step / hold (BB: Step)' },
];

function _renderInterpolationBar(panel, selected) {
  // Read the shared interpolation across selected keyframes.
  // null/undefined/'linear' all mean "Azure easing mode" — 'linear' is our internal
  // sentinel used to keep Blockbench's BarSelect happy (it rejects undefined).
  const normalizeInterp = kf => {
    const v = kf.interpolation;
    return (!v || v === 'linear') ? null : v;
  };
  const currentInterp = _readMulti(selected, normalizeInterp, null, '(mixed)');

  const bar = _createBar('azl_bar_catmullrom', panel);

  // Section heading — plain text, no background, matches BB's own keyframe labels
  const heading = document.createElement('p');
  heading.style.cssText = 'min-width:100%;margin:4px 0 2px 0;padding: 0 0 0 10px;color:var(--color-text);';
  heading.textContent = 'Interpolation';
  bar.appendChild(heading);

  for (const { id, label, title } of BB_INTERP_MODES) {
    const isActive = (currentInterp === id);
    const btn = document.createElement('button');
    btn.id = 'azl_btn_interp_' + (id ?? 'azure');
    btn.className = 'dark_bordered';
    btn.textContent = label;
    btn.title = title;
    btn.style.cssText = `padding:2px 10px;margin:1px;cursor:pointer;${isActive ? 'color:var(--color-accent);border-color:var(--color-accent);' : ''}`;
    btn.onclick = () => window._azureSetInterpolation(id);
    bar.appendChild(btn);
  }
}

// ---------------------------------------------------------------------------
// Easing bar
// ---------------------------------------------------------------------------

/**
 * AzureLib easing families (custom Java-side easings).
 * "linear" and "step" are special-cased (no In/Out/InOut variants).
 */
const AZURE_EASING_FAMILIES = [
  { id: 'linear',  label: 'Linear'  },
  { id: 'step',    label: 'Step'    },
  { id: 'sine',    label: 'Sine'    },
  { id: 'quad',    label: 'Quad'    },
  { id: 'cubic',   label: 'Cubic'   },
  { id: 'quart',   label: 'Quart'   },
  { id: 'quint',   label: 'Quint'   },
  { id: 'expo',    label: 'Expo'    },
  { id: 'circ',    label: 'Circ'    },
  { id: 'back',    label: 'Back'    },
  { id: 'elastic', label: 'Elastic' },
  { id: 'bounce',  label: 'Bounce'  },
];

const EASING_TYPES_LIST = [
  { id: 'in',    label: 'In'    },
  { id: 'out',   label: 'Out'   },
  { id: 'inout', label: 'In/Out'},
];

function _renderEasingBar(panel, selected) {
  // Don't show Azure easing picker when all selected have a Bedrock interpolation mode.
  // 'linear' is our internal sentinel for Azure easing mode (not a real Bedrock interp),
  // so it must NOT be treated as a Bedrock mode here.
  const isBedrock = kf => !!kf.interpolation && kf.interpolation !== 'linear';
  const allBedrock = selected.every(isBedrock);

  const displayedEasing = _readMulti(selected, kf => kf.easing, EASING_DEFAULT, '(mixed)');
  const currentFamily   = _easingFamilyOf(displayedEasing);
  const currentType     = _easingTypeOf(displayedEasing);

  // --- Section header ---
  const headerBar = _createBar('azl_bar_easing', panel);
  const easingHeading = document.createElement('p');
  easingHeading.style.cssText = 'min-width:100%;margin:4px 0 2px 0;padding: 0 0 0 10px;color:var(--color-text);';
  easingHeading.textContent = 'AzureLib Easings';
  headerBar.appendChild(easingHeading);

  // --- Azure easing family buttons (icon + label inside each button) ---
  const azureRow = _createBar('azl_bar_easing_azure', panel);
  azureRow.style.flexWrap = 'wrap';

  for (const { id, label } of AZURE_EASING_FAMILIES) {
    const isSelected = !allBedrock && (id === currentFamily);
    const icon = EASING_ICONS[id] || '';
    const btn = document.createElement('button');
    btn.id = `azl_kf_easing_${id}`;
    btn.className = 'dark_bordered';
    btn.title = `Switch to ${label} easing`;
    btn.style.cssText = `
      padding: 2px 6px;
      margin: 1px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 3px;
      ${isSelected ? 'color:var(--color-accent);border-color:var(--color-accent);' : ''}
    `;
    btn.innerHTML = `${icon}<span>${label}</span>`;
    btn.onclick = () => {
      const nextEasing = _assembleEasingId(id, currentType);
      applyKeyframeEasing(nextEasing);
    };
    azureRow.appendChild(btn);
  }

  // --- Type (In / Out / In/Out) row — only for families with variants ---
  if (!allBedrock && currentFamily !== 'linear' && currentFamily !== 'step') {
    const typeBar = _createBar('azl_bar_easing_type', panel);
    const typeHeading = document.createElement('p');
    typeHeading.style.cssText = 'min-width:100%;margin:4px 0 2px 0;padding:0;color:var(--color-text);';
    typeHeading.textContent = 'Type';
    typeBar.appendChild(typeHeading);

    for (const { id, label } of EASING_TYPES_LIST) {
      const isActive = (id === currentType);
      const btn = document.createElement('button');
      btn.id = `azl_kf_type_${id}`;
      btn.className = 'dark_bordered';
      btn.textContent = label;
      btn.style.cssText = `
        padding: 2px 10px;
        margin: 1px;
        cursor: pointer;
        ${isActive ? 'color:var(--color-accent);border-color:var(--color-accent);' : ''}
      `;
      btn.onclick = () => {
        const nextEasing = _assembleEasingId(currentFamily, id);
        applyKeyframeEasing(nextEasing);
      };
      typeBar.appendChild(btn);
    }
  }

  // --- Argument row (for Back/Elastic/Bounce/Step) ---
  if (selected.every(kf => hasArgs(kf.easing))) {
    const argLabel = _getArgLabel(selected[0].easing);
    const defaultArg = getEasingArgDefault(selected[0].easing);
    const currentArg = _readMulti(
      selected,
      kf => (Array.isArray(kf.easingArgs) && kf.easingArgs.length ? kf.easingArgs[0] : defaultArg),
      defaultArg,
      defaultArg,
    );

    const argBar = _createBar('azl_bar_easing_arg', panel);
    argBar.innerHTML = `
      <p style="margin:4px 0 2px 0;padding:0;color:var(--color-text);min-width:90px;">${argLabel}</p>
      <input
        type="number"
        id="azl_easing_arg_input"
        class="dark_bordered code keyframe_input tab_target"
        value="${currentArg}"
        oninput="window._azureApplyEasingArg(this)"
        style="flex:1;margin-right:9px;">`;
  }
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

/**
 * Apply an easing name to all selected keyframes.
 * @param {string} easingId - e.g. 'easeInSine', 'linear', 'step'
 */
function applyKeyframeEasing(easingId) {
  if (!easingId || easingId === '-') return;
  Undo.initEdit({ keyframes: Timeline.selected });

  Timeline.selected.forEach(kf => {
    kf.easing = easingId;
    // Switching to an Azure easing clears any Bedrock interpolation mode.
    // Use 'linear' (not undefined) so BB's BarSelect keyframe_interpolation stays valid.
    if (kf.interpolation && kf.interpolation !== 'linear') kf.interpolation = 'linear';
  });

  Undo.finishEdit('Set keyframe easing');
  refreshKeyframeUI();
}

/**
 * Apply the numeric easing argument from the input field.
 * @param {HTMLInputElement} el
 */
function applyEasingArgument(el) {
  const raw = $(el).val();
  if (raw === '' || raw === '-') return;
  Undo.initEdit({ keyframes: Timeline.selected });

  Timeline.selected.forEach(kf => {
    kf.easingArgs = [parseEasingArg(kf, String(raw).trim())];
  });

  Undo.finishEdit('Set keyframe easing argument');
}

/**
 * Set a Blockbench-native interpolation mode on all selected keyframes.
 * @param {string|null} mode - 'catmullrom' | 'bezier' | 'step' | null
 *   null means "Azure easing mode" — clears interpolation so kf.easing takes over.
 */
function setInterpolation(mode) {
  Undo.initEdit({ keyframes: Timeline.selected });

  Timeline.selected.forEach(kf => {
    if (mode === null || mode === undefined) {
      // Azure easing mode: use 'linear' sentinel (not undefined) so BB's BarSelect stays valid.
      kf.interpolation = 'linear';
    } else {
      // Bedrock interpolation: set mode, clear Azure easing
      kf.interpolation = mode;
      kf.easing = EASING_DEFAULT;
      kf.easingArgs = undefined;
    }
  });

  Undo.finishEdit('Set keyframe interpolation');
  refreshKeyframeUI();
}

/** @deprecated use setInterpolation — kept for backward compatibility */
function toggleCatmullrom(forceValue) {
  setInterpolation(forceValue === false ? null : 'catmullrom');
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function _onFrame() { /* reserved */ }

function _createBar(id, parent) {
  const el = document.createElement('div');
  el.id = id;
  el.className = 'bar flex';
  el.style.flexWrap = 'wrap';
  el.style.alignItems = 'center';
  el.style.gap = '2px';
  el.style.marginTop = '4px';
  parent.appendChild(el);
  return el;
}

function _cleanupKeyframePanel() {
  PANEL_BARS.forEach(id => document.getElementById(id)?.remove());
  const prePost = document.querySelector('#keyframe_type_label > div');
  if (prePost) prePost.hidden = false;
}

function _groupByChannel(keyframes) {
  const map = new Map();
  for (const kf of keyframes) {
    if (!map.has(kf.animator)) map.set(kf.animator, {});
    const ch = map.get(kf.animator);
    if (!ch[kf.channel]) ch[kf.channel] = [];
    ch[kf.channel].push(kf);
    ch[kf.channel].sort((a, b) => a.time - b.time);
  }
  return map;
}

/**
 * Read a value from all selected keyframes.
 * If all values are equal, return it; otherwise return `conflict`.
 */
function _readMulti(selected, selector, def, conflict) {
  const fn = typeof selector === 'function' ? selector : kf => kf[selector];
  if (selected.length === 0) return def;
  if (selected.length === 1) return fn(selected[0]) ?? def;
  const values = (0,lodash.uniq)(selected.map(fn));
  return values.length === 1 ? values[0] : conflict;
}

/**
 * Extract the easing family from a full easing name.
 * 'easeInOutSine' → 'sine', 'linear' → 'linear'
 */
function _easingFamilyOf(name) {
  if (!name || name === 'linear') return 'linear';
  if (name === 'step') return 'step';
  const m = String(name).match(/^ease(?:InOut|In|Out)([\w]+)$/i);
  return m ? m[1].toLowerCase() : name.toLowerCase();
}

/**
 * Extract the easing type (in/out/inout) from a full easing name.
 * 'easeInOutSine' → 'inout', 'easeOutBounce' → 'out', 'easeInQuad' → 'in'
 */
function _easingTypeOf(name) {
  const m = String(name).match(/^ease(InOut|In|Out)/i);
  if (!m) return 'in';
  const raw = m[1].toLowerCase();
  return raw === 'inout' ? 'inout' : raw;
}

/**
 * Assemble a full easing ID from family + type.
 * ('sine', 'out') → 'easeOutSine'
 * ('linear', *) → 'linear'
 * ('step', *) → 'step'
 */
function _assembleEasingId(family, type) {
  if (family === 'linear') return 'linear';
  if (family === 'step') return 'step';
  const typeStr = type === 'inout' ? 'InOut' : type === 'out' ? 'Out' : 'In';
  return `ease${typeStr}${family.charAt(0).toUpperCase()}${family.slice(1)}`;
}

function _getArgLabel(easing) {
  if (!easing) return 'Arg';
  if (easing.includes('Back')) return 'Overshoot';
  if (easing.includes('Elastic')) return 'Bounciness';
  if (easing.includes('Bounce')) return 'Bounciness';
  if (easing === 'step') return 'Steps';
  return 'Arg';
}

function _patchStockInterpolationBar() {
  if (!BarItems.keyframe_interpolation) return;
  const orig = BarItems.keyframe_interpolation.condition;
  BarItems.keyframe_interpolation.condition = function (...args) {
    if (Format?.id === 'azure_model') return false;
    return typeof orig === 'function' ? orig.apply(this, args) : true;
  };
}

// ---------------------------------------------------------------------------
// SVG easing curve icons (inline)
// ---------------------------------------------------------------------------

const EASING_ICONS = {
  linear:  '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="M 0.53,5.82 5.82,0.53" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  step:    '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="m 0.53,5.82 0,-1.32 H 1.85 v -1.32 H 3.17 v -1.33 h 1.32 v -1.32 l 1.33,1e-5" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  sine:    '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="M 0.53,5.82 C 1.85,5.82 4.76,2.38 5.82,0.53" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  quad:    '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="M 0.53,5.82 C 3.17,5.82 4.76,3.04 5.82,0.53" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  cubic:   '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="M 0.53,5.82 C 3.17,5.82 4.76,3.82 5.82,0.53" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  quart:   '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="m 0.53,5.82 c 3.17,0 4.23,-2.64 5.29,-5.29" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  quint:   '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="m 0.53,5.82 c 3.44,0 4.23,-1.85 5.29,-5.29" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  expo:    '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="m 0.53,5.82 c 4.23,0 5.29,-1.06 5.29,-5.29" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  circ:    '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="M 0.53,5.82 C 5.82,4.97 5.82,3.17 5.82,0.53" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  back:    '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="m 0.53,5.29 c 3.17,0 4.23,2.91 5.29,-4.76" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  elastic: '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="m 0.53,5.15 c 0.79,0 0.79,-0.26 1.32,-0.26 0.53,0 0.79,0.53 1.32,0.53 0.53,0 1.01,-1.84 1.32,-0.79 0.79,2.64 1.32,1.32 1.32,-3.97" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
  bounce:  '<svg viewBox="0 0 6.35 6.35" height="20" width="20"><path d="m 0.53,5.82 c 0.26,-0.26 0.53,-0.26 0.79,0 0.53,-0.53 0.53,-0.53 1.06,0 0.79,-2.12 1.59,-2.12 2.38,0 0.26,-4.23 1.06,-5.29 1.06,-5.29" style="fill:none;stroke:currentColor;stroke-width:0.53"/></svg>',
};

;// ./core/azure-utils.js
/**
 * AzureLib Animator — Utility & Patching Layer
 * --------------------------------------------
 * Provides function override registration and restoration.
 * Replaces the old addMonkeypatch/removeMonkeypatch system.
 *
 * © 2026 AzureDoom — MIT License
 */

const PatchRegistry = new Map();

/**
 * Register a new override on a target object.
 * Keeps a reference to the original method.
 */
function injectOverride(symbol, path, key, newImpl) {
  const target = path ? symbol[path] : symbol;
  if (!PatchRegistry.has(symbol)) PatchRegistry.set(symbol, { _target: target });
  const entry = PatchRegistry.get(symbol);
  entry[key] = target[key];
  target[key] = newImpl;
}

/**
 * Restore all previously injected overrides.
 */
function restoreOverrides() {
  PatchRegistry.forEach(entry => {
    Object.keys(entry).forEach(key => {
      if (key.startsWith('_')) return;
      entry._target[key] = entry[key];
    });
  });
  PatchRegistry.clear();
}

/**
 * Whether an easing type uses arguments.
 */
const azure_utils_hasArgs = easing =>
  easing?.includes('Back') ||
  easing?.includes('Elastic') ||
  easing?.includes('Bounce') ||
  easing === 'step';

/**
 * Fallback Molang inverter for AzureLib standalone use.
 */
function invertMolang(molang) {
  const OPEN = ['(', '[', '{'];
  const CLOSE = [')', ']', '}'];

  if (typeof molang === 'number') return -molang;
  if (molang === '' || molang === '0') return molang;

  if (!isNaN(parseFloat(molang)) && isFinite(molang)) {
    const val = parseFloat(molang);
    return (-val).toString();
  }

  let invert = true;
  let depth = 0;
  let lastOp;
  let result = '';

  for (let ch of molang) {
    if (!depth) {
      let op;
      let hadInput = true;

      if (ch === '-' && lastOp !== '*' && lastOp !== '/') {
        if (!invert && !lastOp) result += '+';
        invert = false;
        continue;
      } else if (ch === '+' && lastOp !== '*' && lastOp !== '/') {
        result += '-';
        invert = false;
        continue;
      } else if ('?:'.includes(ch)) {
        invert = true;
        op = ch;
      } else if (invert) {
        result += '-';
        invert = false;
      } else if ('+-*/&|'.includes(ch)) {
        op = ch;
      }

      lastOp = op || lastOp;
    }

    if (OPEN.includes(ch)) depth++;
    if (CLOSE.includes(ch)) depth--;

    result += ch;
  }

  return result;
}

;// ./animation/azure-keyframes.js
/**
 * AzureLib Animator — Keyframe Interpolation & Overrides
 * ------------------------------------------------------
 * Adds easing-aware keyframe interpolation and export behaviour
 * for AzureLib's unified animation format.
 *
 * Both AzureLib easing nodes ({ vector, easing, easingArgs }) and
 * Bedrock spline nodes ({ post, pre?, lerp_mode }) are handled here.
 *
 * © 2026 AzureDoom — MIT License
 */




let ORIG = null;
let ORIG_REVERSE_CONDITION = null;
let PATCHED = false;

// ---------------------------------------------------------------------------
// Capture originals once
// ---------------------------------------------------------------------------

function captureOriginalsOnce() {
  if (ORIG) return;
  ORIG = {
    getLerp: Keyframe.prototype.getLerp,
    compileBedrockKeyframe: Keyframe.prototype.compileBedrockKeyframe,
    getUndoCopy: Keyframe.prototype.getUndoCopy,
    extend: Keyframe.prototype.extend,
  };
  try {
    ORIG_REVERSE_CONDITION = BarItems.reverse_keyframes?.condition || null;
  } catch {
    ORIG_REVERSE_CONDITION = null;
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

function registerKeyframeOverrides() {
  if (PATCHED) return;
  captureOriginalsOnce();

  if (!Keyframe.prototype._azurePatched) {
    Keyframe.prototype.getLerp              = getLerpOverride;
    Keyframe.prototype.compileBedrockKeyframe = compileBedrockKeyframe;
    Keyframe.prototype.getUndoCopy          = getUndoCopy;
    Keyframe.prototype.extend               = extendKeyframe;
    Keyframe.prototype._azurePatched        = true;
  }

  if (BarItems.reverse_keyframes && !BarItems.reverse_keyframes._azurePatched) {
    if (!ORIG_REVERSE_CONDITION) ORIG_REVERSE_CONDITION = BarItems.reverse_keyframes.condition;
    BarItems.reverse_keyframes.condition = reverseCondition;
    BarItems.reverse_keyframes._azurePatched = true;
  }

  // Hook Blockbench's playback dispatcher so Azure-easing segments are
  // actually interpolated. Without this, kf.interpolation === 'linear'
  // (our marker for "Azure easing mode") would use BB's plain linear branch
  // and ignore any Azure easing curve set on the keyframe.
  Blockbench.on('interpolate_keyframes', azureInterpolateListener);

  PATCHED = true;
}

function unregisterKeyframeOverrides() {
  if (!PATCHED || !ORIG) return;
  try {
    if (Keyframe.prototype._azurePatched) {
      Keyframe.prototype.getLerp              = ORIG.getLerp;
      Keyframe.prototype.compileBedrockKeyframe = ORIG.compileBedrockKeyframe;
      Keyframe.prototype.getUndoCopy          = ORIG.getUndoCopy;
      Keyframe.prototype.extend               = ORIG.extend;
      delete Keyframe.prototype._azurePatched;
    }
    if (BarItems.reverse_keyframes?._azurePatched && ORIG_REVERSE_CONDITION) {
      BarItems.reverse_keyframes.condition = ORIG_REVERSE_CONDITION;
      delete BarItems.reverse_keyframes._azurePatched;
    }
    try { Blockbench.removeListener('interpolate_keyframes', azureInterpolateListener); } catch { /* noop */ }
  } finally {
    PATCHED = false;
  }
}

// ---------------------------------------------------------------------------
// interpolate_keyframes listener — drives Azure-easing playback
// ---------------------------------------------------------------------------
//
// Blockbench's BoneAnimator.interpolate dispatches this event before its
// own interpolation switch. If a listener returns { value: [x, y, z] }
// the dispatcher returns that array directly and the built-in
// linear/catmullrom/bezier branches are skipped.
//
// We use this for Azure-easing segments (kf.interpolation falsy or 'linear')
// — without it, kf.interpolation === undefined doesn't match any of BB's
// built-in branches and BoneAnimator.interpolate falls off the end without
// returning a value, freezing the bone between keyframes.
//
// Returning undefined from the listener leaves BB's normal dispatch in
// place, which is what we want for catmullrom/bezier/step segments.

function azureInterpolateListener(args) {
  if (Format?.id !== 'azure_model') return;

  const before = args && args.keyframe_before;
  const after  = args && args.keyframe_after;
  if (!before || !after) return;

  // Only handle Azure-easing segments. Anything that names a BB-native
  // interpolation mode (catmullrom / bezier / step) is left to BB.
  // 'linear' is treated as Azure-eligible because that's the default value
  // BB stamps onto fresh keyframes — and it's also semantically a no-op
  // when the easing happens to be plain linear.
  const azureEligible = mode => !mode || mode === 'linear';
  if (!azureEligible(before.interpolation) || !azureEligible(after.interpolation)) return;

  // Defer to BB when either side carries molang expressions — the eased
  // numeric path can't preserve string expressions and would silently
  // change behaviour. (Safe: BB's linear→linear branch handles this case.)
  if (before.has_expressions || after.has_expressions) return;

  // Resolve easing from the destination keyframe. AzureLib reads easing
  // off the "to" keyframe, mirroring the Java runtime.
  const easing = after.easing || EASING_DEFAULT;
  const fn = easingRegistry[easing] || easingRegistry.linear;

  let eased;
  if (azure_utils_hasArgs(easing)) {
    const arg = (Array.isArray(after.easingArgs) && after.easingArgs.length)
      ? after.easingArgs[0]
      : getEasingArgDefault(easing);
    eased = fn(args.t, arg);
  } else {
    eased = fn(args.t);
  }

  if (typeof eased !== 'number' || Number.isNaN(eased)) return;

  // Match the data_point selection used by Keyframe.prototype.getLerp:
  // earlier-in-time kf uses dp 1 if it has multiple, later kf uses dp 0.
  // before.time < after.time is guaranteed here by BoneAnimator.interpolate.
  const beforeDP = (before.data_points.length > 1) ? 1 : 0;
  const afterDP  = 0;

  const value = ['x', 'y', 'z'].map(axis => {
    const a = before.calc(axis, beforeDP);
    const b = after.calc(axis, afterDP);
    return a + (b - a) * eased;
  });

  return { value };
}

// ---------------------------------------------------------------------------
// getLerp — easing-aware interpolation
// ---------------------------------------------------------------------------
//
// Reachable in two situations:
//   1. BoneAnimator.interpolate's linear-only branch (only when both kfs
//      have interpolation === 'linear'). With the event listener above,
//      that branch is short-circuited for Azure-easing segments, so this
//      path mostly handles plain linear→linear segments at runtime.
//   2. The keyframe optimizer in animation.js (~line 1462) uses the same
//      linear-only gate during bake/optimize and calls getLerp directly.
//      We honour Azure easing there too so optimized output matches
//      playback behaviour.

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getLerpOverride(other, axis, t) {
  if (Format?.id !== 'azure_model') {
    return ORIG.getLerp.apply(this, arguments);
  }

  // Defer to Blockbench for explicit Bedrock spline/bezier/step modes.
  // Note: 'linear' is intentionally NOT in this list — we want to apply
  // the Azure easing curve when one is set, even if the kf carries
  // BB's default interpolation === 'linear' marker.
  if (other.interpolation === 'catmullrom' ||
      other.interpolation === 'bezier'     ||
      other.interpolation === 'step') {
    return ORIG.getLerp.apply(this, arguments);
  }

  const easing = other.easing || EASING_DEFAULT;

  // Plain linear with no custom easing → BB's original implementation
  // is fine and preserves its allow_expression fast-path.
  if (easing === EASING_DEFAULT && (!other.easingArgs || !other.easingArgs.length)) {
    return ORIG.getLerp.apply(this, arguments);
  }

  let func = easingRegistry[easing] || easingRegistry.linear;

  if (azure_utils_hasArgs(easing)) {
    const arg = Array.isArray(other.easingArgs) && other.easingArgs.length
      ? other.easingArgs[0]
      : getEasingArgDefault(easing);
    func = func.bind(null, arg);
  }

  const eased = func(t);
  const start = this.calc(axis);
  const stop  = other.calc(axis);
  const result = lerp(start, stop, eased);

  if (Number.isNaN(result)) throw new Error('[AzureLib] Invalid easing result');
  return result;
}

// ---------------------------------------------------------------------------
// compileBedrockKeyframe — unified serialiser
// ---------------------------------------------------------------------------

function compileBedrockKeyframe() {
  if (Format?.id !== 'azure_model') {
    return ORIG.compileBedrockKeyframe.apply(this, arguments);
  }

  const base = ORIG.compileBedrockKeyframe.apply(this, arguments);
  const cloneArray = arr => Array.isArray(arr) ? [...arr] : arr;

  // --- Bedrock lerp_mode keyframes (linear / catmullrom): keep pre/post/lerp_mode ---
  if (this.interpolation === 'catmullrom') {
    const siblings = this.animator?.keyframes?.filter(k => k.channel === this.channel) || [];
    const channelIsEasing = siblings.some(k => k.easing && k.easing !== EASING_DEFAULT);
    if (!channelIsEasing) {
      const lerpMode = 'catmullrom';
      if (base && typeof base === 'object') {
        return {
          ...(base.pre !== undefined ? { pre: cloneArray(base.pre) } : {}),
          post:      cloneArray(base.post || base),
          lerp_mode: lerpMode,
        };
      }
      return { post: cloneArray(base), lerp_mode: lerpMode };
    }
  }

  // --- Bezier keyframes: Blockbench handles pre/post natively, pass through ---
  if (this.interpolation === 'bezier') {
    if (base && typeof base === 'object') {
      return {
        ...(base.pre  !== undefined ? { pre:  cloneArray(base.pre)  } : {}),
        ...(base.post !== undefined ? { post: cloneArray(base.post) } : {}),
      };
    }
    return base;
  }

  // --- Step transition: keep pre/post pair ---
  const prev = this.getPreviousKeyframe?.();
  if (this.data_points.length === 1 && prev && prev.interpolation === 'step') {
    if (base && typeof base === 'object') {
      return {
        ...(base.pre  !== undefined ? { pre:  cloneArray(base.pre)  } : {}),
        ...(base.post !== undefined ? { post: cloneArray(base.post) } : {}),
      };
    }
    return base;
  }

  // --- If Blockbench emitted explicit pre/post transition data, keep raw ---
  if (
    base && typeof base === 'object' && !Array.isArray(base) &&
    (base.pre !== undefined || base.post !== undefined)
  ) {
    const out = {
      ...(base.pre       !== undefined ? { pre:       cloneArray(base.pre)       } : {}),
      ...(base.post      !== undefined ? { post:      cloneArray(base.post)      } : {}),
      ...(base.lerp_mode !== undefined ? { lerp_mode: base.lerp_mode             } : {}),
    };
    if (this.easing && this.easing !== EASING_DEFAULT) out.easing = this.easing;
    if (azure_utils_hasArgs(this.easing) && Array.isArray(this.easingArgs) && this.easingArgs.length) {
      out.easingArgs = [...this.easingArgs];
    }
    return out;
  }

  // --- AzureLib easing node ---
  const withAzureVectorNode = value => {
    // Already an object with extra fields? (e.g. existing easing data)
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const out = { ...value };
      if (out.easing === undefined && this.easing !== undefined) {
        out.easing = this.easing;
      }
      if (out.easingArgs === undefined && azure_utils_hasArgs(this.easing) &&
          Array.isArray(this.easingArgs) && this.easingArgs.length) {
        out.easingArgs = [...this.easingArgs];
      }
      return out;
    }

    // Plain array → Azure node
    const out = { vector: cloneArray(value) };
    if (this.easing && this.easing !== EASING_DEFAULT) {
      out.easing = this.easing;
    }
    if (azure_utils_hasArgs(this.easing) && Array.isArray(this.easingArgs) && this.easingArgs.length) {
      out.easingArgs = [...this.easingArgs];
    }

    // Flatten to plain array if there are no extra fields
    if (!out.easing && !out.easingArgs) {
      return out.vector;
    }
    return out;
  };

  return withAzureVectorNode(base);
}

// ---------------------------------------------------------------------------
// getUndoCopy — preserve easing state in undo history
// ---------------------------------------------------------------------------

function getUndoCopy() {
  const base = ORIG.getUndoCopy.apply(this, arguments);
  if (Format?.id === 'azure_model') {
    base.easing = this.easing;
    base.interpolation = this.interpolation;
    if (azure_utils_hasArgs(this.easing)) base.easingArgs = this.easingArgs ? [...this.easingArgs] : undefined;
  }
  return base;
}

// ---------------------------------------------------------------------------
// extend — parse keyframe data on load
// ---------------------------------------------------------------------------

function extendKeyframe(dataIn) {
  const data = Object.assign({}, dataIn);

  if (Format?.id !== 'azure_model') {
    return ORIG.extend.apply(this, [data]);
  }

  const cloneVec = (vec, fallback = [0, 0, 0]) => {
    if (!Array.isArray(vec)) return [...fallback];
    return [
      vec[0] !== undefined ? vec[0] : fallback[0],
      vec[1] !== undefined ? vec[1] : fallback[1],
      vec[2] !== undefined ? vec[2] : fallback[2],
    ];
  };

  const unwrapNode = value => {
    if (Array.isArray(value)) {
      return { vector: cloneVec(value) };
    }
    if (value && typeof value === 'object') {
      const out = {};
      if (value.easing       !== undefined) out.easing       = value.easing;
      if (value.interpolation !== undefined) out.interpolation = value.interpolation;
      if (Array.isArray(value.easingArgs))   out.easingArgs   = [...value.easingArgs];
      if (Array.isArray(value.vector))       { out.vector = cloneVec(value.vector); return out; }
      if ('x' in value && 'y' in value && 'z' in value) {
        out.vector = cloneVec([value.x, value.y, value.z]); return out;
      }
    }
    return { vector: null };
  };

  const valuesNode = unwrapNode(data.values);
  const preNode    = unwrapNode(data.pre);
  const postNode   = unwrapNode(data.post);

  // Apply easing from whichever node carries it
  const easingSource = valuesNode.easing ?? data.easing ?? postNode.easing;
  if (easingSource !== undefined)     this.easing      = easingSource;

  // Apply interpolation only for explicit Bedrock modes (catmullrom / bezier / step).
  // We intentionally IGNORE data.interpolation === 'linear' from Blockbench core because
  // 'linear' is Blockbench's own default interp label and would shadow our Azure easing.
  // 'linear' as a Bedrock lerp_mode is set via data.lerp_mode, not data.interpolation.
  // Only store Blockbench-native interpolation modes that we explicitly support.
  // We intentionally ignore data.interpolation === 'linear' (Blockbench's own default)
  // because it would shadow Azure easings. lerp_mode:'linear' from JSON is also dropped —
  // it is handled by AzureLib's own linear easing instead.
  const BEDROCK_INTERP_MODES = new Set(['catmullrom', 'bezier', 'step']);
  let rawInterp = data.interpolation ?? postNode.interpolation;
  // Prefer explicit lerp_mode from JSON over Blockbench's data.interpolation default
  if (data.lerp_mode !== undefined && data.lerp_mode !== 'linear') rawInterp = data.lerp_mode;

  if (rawInterp !== undefined && BEDROCK_INTERP_MODES.has(rawInterp)) {
    this.interpolation = rawInterp;
  } else {
    this.interpolation = 'linear';
  }

  const easingArgsSource = valuesNode.easingArgs ?? data.easingArgs ?? postNode.easingArgs;
  if (easingArgsSource !== undefined) this.easingArgs   = [...easingArgsSource];

  // Strip Azure/Bedrock wrappers before handing off to Blockbench core
  const plain = Object.assign({}, data);
  ['values', 'pre', 'post'].forEach(key => {
    if (plain[key] && typeof plain[key] === 'object' && !Array.isArray(plain[key])) {
      delete plain[key];
    }
  });

  const result = ORIG.extend.apply(this, [plain]);

  // Re-hydrate axis data explicitly
  const ensurePoint = idx => {
    if (!Array.isArray(this.data_points)) this.data_points = [];
    if (!this.data_points[idx]) this.data_points[idx] = {};
    return this.data_points[idx];
  };

  const toNum = v => {
    if (typeof v !== 'string') return v;
    const n = Number(v);
    return isNaN(n) ? v : n;  // Molang → keep string; numeric string → number
  };
  const writeVector = (point, vec) => {
    if (!vec) return;
    point.x = toNum(vec[0]);
    point.y = toNum(vec[1]);
    point.z = toNum(vec[2]);
    delete point.vector;
  };

  if (preNode.vector && postNode.vector) {
    writeVector(ensurePoint(0), preNode.vector);
    writeVector(ensurePoint(1), postNode.vector);
  } else if (preNode.vector) {
    writeVector(ensurePoint(0), preNode.vector);
  } else if (!preNode.vector && postNode.vector && this.interpolation === 'catmullrom') {
    writeVector(ensurePoint(0), postNode.vector);
  } else if (valuesNode.vector) {
    writeVector(ensurePoint(0), valuesNode.vector);
  } else if (postNode.vector) {
    writeVector(ensurePoint(0), postNode.vector);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Reverse keyframes guard
// ---------------------------------------------------------------------------

function reverseCondition() {
  if (reverseCondition._inAzureCall) return false;
  try {
    reverseCondition._inAzureCall = true;
    if (!ORIG_REVERSE_CONDITION || typeof ORIG_REVERSE_CONDITION !== 'function') return false;
    const result = ORIG_REVERSE_CONDITION.call(BarItems.reverse_keyframes);
    return result && Format?.id !== 'azure_model';
  } finally {
    reverseCondition._inAzureCall = false;
  }
}

/* harmony default export */ const azure_keyframes = ({ registerKeyframeOverrides, unregisterKeyframeOverrides });

;// ./templates/armorTemplate.json
const armorTemplate_namespaceObject = /*#__PURE__*/JSON.parse('{"meta":{"format_version":"3.2","model_format":"azure_model","box_uv":true},"name":"CustomArmor","geo_name":"CustomArmor","resolution":{"width":64,"height":64},"elements":[{"name":"armorHead_layer1","from":[-4,24,-4],"to":[4,32,4],"inflate":0.75,"autouv":0,"color":1,"export":true,"locked":false,"origin":[0,24,0],"uv_offset":[0,0],"uuid":"a1000001-0000-0000-0000-000000000001"},{"name":"armorHead_layer2","from":[-4,24,-4],"to":[4,32,4],"inflate":1,"autouv":0,"color":1,"export":true,"locked":false,"origin":[0,24,0],"uv_offset":[32,0],"uuid":"a1000002-0000-0000-0000-000000000002"},{"name":"armorBody_cube","from":[-4,12,-2],"to":[4,24,2],"inflate":0.75,"autouv":0,"color":2,"export":true,"locked":false,"origin":[0,24,0],"uv_offset":[4,16],"uuid":"a2000001-0000-0000-0000-000000000001"},{"name":"armorRightArm_cube","from":[-8,12,-2],"to":[-4,24,2],"inflate":0.7,"autouv":0,"color":4,"export":true,"locked":false,"origin":[-5,22,0],"uv_offset":[4,32],"uuid":"a4000001-0000-0000-0000-000000000001"},{"name":"armorLeftArm_cube","from":[4,12,-2],"to":[8,24,2],"inflate":0.7,"autouv":0,"color":4,"export":true,"locked":false,"mirror_uv":true,"origin":[5,22,0],"uv_offset":[20,32],"uuid":"a5000001-0000-0000-0000-000000000001"},{"name":"armorLeftLeg_cube","from":[0,0,-2],"to":[4,12,2],"inflate":0.5,"autouv":0,"color":5,"export":true,"locked":false,"mirror_uv":true,"origin":[-2,12,0],"uv_offset":[20,48],"uuid":"a6000001-0000-0000-0000-000000000001"},{"name":"armorLeftBoot_cube","from":[0,0,-2],"to":[4,12,2],"inflate":0.7,"autouv":0,"color":5,"export":true,"locked":false,"mirror_uv":true,"origin":[-2,12,0],"uv_offset":[20,64],"uuid":"a6000002-0000-0000-0000-000000000002"},{"name":"armorRightLeg_cube","from":[-4,0,-2],"to":[0,12,2],"inflate":0.5,"autouv":0,"color":5,"export":true,"locked":false,"origin":[2,12,0],"uv_offset":[4,48],"uuid":"a7000001-0000-0000-0000-000000000001"},{"name":"armorRightBoot_cube","from":[-4,0,-2],"to":[0,12,2],"inflate":0.7,"autouv":0,"color":5,"export":true,"locked":false,"origin":[2,12,0],"uv_offset":[4,64],"uuid":"a7000002-0000-0000-0000-000000000002"}],"outliner":[{"name":"bipedHead","uuid":"d340b6fa-56aa-9c0f-3560-7a067643b77d","export":true,"isOpen":true,"visibility":true,"autouv":0,"origin":[0,24,0],"children":[{"name":"armorHead","uuid":"6ab88dea-c816-d2bb-6be9-05ed7838da97","export":true,"isOpen":true,"visibility":true,"autouv":0,"origin":[0,24,0],"children":["a1000001-0000-0000-0000-000000000001","a1000002-0000-0000-0000-000000000002"]}]},{"name":"bipedBody","uuid":"ce5b366c-fd87-41ae-9a73-e0a4d4b05f8d","export":true,"isOpen":true,"visibility":true,"autouv":0,"origin":[0,24,0],"children":[{"name":"armorBody","uuid":"282fcdbb-8ea9-4a13-4154-f2ed20d696c8","export":true,"isOpen":true,"visibility":true,"autouv":0,"origin":[0,24,0],"children":["a2000001-0000-0000-0000-000000000001"]}]},{"name":"bipedRightArm","uuid":"d8113cc7-7e10-0930-259e-b8e4211ce9da","export":true,"isOpen":true,"visibility":true,"autouv":0,"origin":[5,22,0],"children":[{"name":"armorRightArm","uuid":"c5300e23-fd2f-b56c-3552-45d6650e11c6","export":true,"isOpen":true,"visibility":true,"autouv":0,"origin":[5,22,0],"children":["a4000001-0000-0000-0000-000000000001"]}]},{"name":"bipedLeftArm","uuid":"3b8901e8-3420-0834-51eb-76d64ff2ae8f","export":true,"isOpen":true,"visibility":true,"autouv":0,"origin":[-5,22,0],"children":[{"name":"armorLeftArm","uuid":"b0d41a53-f4ce-53c1-f899-5a2048c90ac2","export":true,"isOpen":true,"visibility":true,"autouv":0,"origin":[-5,22,0],"children":["a5000001-0000-0000-0000-000000000001"]}]},{"name":"bipedWaist","uuid":"d8125cc7-7e10-0930-259e-b8e4211ce9da","export":true,"isOpen":true,"visibility":true,"autouv":0,"origin":[0,12,0],"children":[{"name":"armorWaist","uuid":"c9000e23-fd2f-b56c-3552-45d6650e11c6","export":true,"isOpen":true,"visibility":true,"autouv":0,"origin":[0,12,0],"children":[]}]},{"name":"bipedLeftLeg","uuid":"37231be7-a8ef-22ca-7fea-40aed58003bb","export":true,"isOpen":true,"visibility":true,"autouv":0,"origin":[-2,12,0],"children":[{"name":"armorLeftLeg","uuid":"e4b19746-2d17-1f56-befe-00718165ae50","export":true,"isOpen":true,"visibility":true,"autouv":0,"origin":[-2,12,0],"children":["a6000001-0000-0000-0000-000000000001"]},{"name":"armorLeftBoot","uuid":"9fe26b9a-ad66-9e6b-2fa2-4168e333b4be","export":true,"isOpen":true,"visibility":true,"autouv":0,"origin":[-2,12,0],"children":["a6000002-0000-0000-0000-000000000002"]}]},{"name":"bipedRightLeg","uuid":"45c031a5-b6be-e0a7-5454-b45d07f28429","export":true,"isOpen":true,"visibility":true,"autouv":0,"origin":[2,12,0],"children":[{"name":"armorRightLeg","uuid":"60238f18-e74b-c863-cb45-2e2f162221bd","export":true,"isOpen":true,"visibility":true,"autouv":0,"origin":[2,12,0],"children":["a7000001-0000-0000-0000-000000000001"]},{"name":"armorRightBoot","uuid":"eb3db34b-ccfe-dae9-ac4d-4e22c3222f70","export":true,"isOpen":true,"visibility":true,"autouv":0,"origin":[2,12,0],"children":["a7000002-0000-0000-0000-000000000002"]}]}],"textures":[]}');
;// ./core/azure-settings.js
/**
 * AzureLib Animator — Settings & Templates
 * ----------------------------------------
 * Defines runtime configuration, SDK targets, and automatic
 * template loading for armor models.
 *
 * © 2026 AzureDoom — MIT License
 */



const makeOptions = list => Object.fromEntries(list.map(x => [x, x]));

const SDK_FORGE = 'Forge 1.12 - 1.16';
const SDK_FABRIC = 'Fabric 1.15 - 1.16';
const SDK_OPTIONS = makeOptions([SDK_FORGE, SDK_FABRIC]);

const TYPE_ENTITY = 'AZURE_ENTITY';
const TYPE_ARMOR = 'AZURE_ARMOR';
const TYPE_ITEMBLOCK = 'AZURE_ITEM_BLOCK';

const TYPE_OPTIONS = {
  [TYPE_ENTITY]: 'Entity/Block/Item',
  [TYPE_ARMOR]: 'Armor',
};

const DEFAULT_CONFIG = Object.freeze({
  formatVersion: 2,
  modSDK: SDK_FORGE,
  objectType: TYPE_ENTITY,
  entityType: 'Entity/Block/Item',
  javaPackage: 'com.example.mod',
  animFileNamespace: 'modid',
  animFilePath: 'animations/animation.json',
});

const AzureConfig = Object.assign({}, DEFAULT_CONFIG);

let _ghostModel = null;

function removeGhostPlayer() {
  if (_ghostModel) {
    scene.remove(_ghostModel);
    _ghostModel = null;
  }
}

function injectGhostPlayer() {
  removeGhostPlayer();

  // Use Blockbench's own display reference player model directly.
  // It's already built, skinned, and kept up to date by updateDisplaySkin().
  // We just clone its THREE.Object3D and add it to the edit mode scene.
  const refPlayer = displayReferenceObjects?.refmodels?.player;
  if (!refPlayer) {
    console.warn('[AzureLib] displayReferenceObjects.refmodels.player not available');
    return;
  }

  // Ensure the model is initialised (it lazy-builds on first Display tab visit)
  if (!refPlayer.initialized) {
    for (const model of refPlayer.models) {
      refPlayer.buildModel(model);
    }
    refPlayer.setModelVariant('steve');
    updateDisplaySkin?.();
    refPlayer.initialized = true;
  }

  // Clone so we don't disturb the Display tab's own copy
  _ghostModel = refPlayer.model.clone();

  _ghostModel.children.forEach(mesh => {
    mesh.rotation.set(0, 0, 0);
  });

  scene.add(_ghostModel);
  console.log('[AzureLib] Ghost player injected using display refmodel.');
}

/**
 * Applies configuration and injects armor templates when applicable.
 */
function onSettingsChanged() {
  Modes.selected.select();

  if (AzureConfig.objectType === TYPE_ARMOR) {
    if (Outliner.root.length === 0) {
      Codecs.project.parse(armorTemplate_namespaceObject);
      console.log('[AzureLib] Loaded armor template.');

      injectGhostPlayer();
      Blockbench.once('close_project', removeGhostPlayer);
      Blockbench.once('new_project', removeGhostPlayer);
    } else {
      alert(
        'Cannot apply Armor Template — please select Armor type in an empty project.'
      );
    }
  } else if (AzureConfig.objectType === TYPE_ENTITY) {
    Project.parent = 'builtin/entity';
  }
}

/* harmony default export */ const azure_settings = (AzureConfig);
// EXTERNAL MODULE: ./node_modules/lodash/omit.js
var omit = __webpack_require__(179);
var omit_default = /*#__PURE__*/__webpack_require__.n(omit);
;// ./animation/azure-playback.js
/**
 * AzureLib Animator — Play Behaviors
 * ----------------------------------
 * Adds AzureLib's play behaviors (ping-pong, repeat X times, freeze on frame) next to Blockbench's own loop modes,
 * only while an AzureLib model is open:
 *
 *   - the stock Animation Properties dialog gets the extra Loop Mode options plus their settings
 *   - the animation right-click "Loop Mode" submenu gets the extra options
 *   - timeline playback previews them for real (ping-pong plays back and forth, repeat stops after its plays,
 *     freeze stops at its frame)
 *   - the animation JSON gets the fields AzureLib reads, so mods don't need AzCommands for them
 *
 * JSON written per animation (read by AzAnimationDefaults on the mod side):
 *   "loop": true | "hold_on_last_frame" | "ping_pong" | "repeat_x_times" | "freeze_on_frame"   (omitted = play once)
 *   "repeat_times": 3        only with repeat_x_times
 *   "freeze_at": 1.25        only with freeze_on_frame, in seconds like every other time in the file
 *
 * © 2026 AzureDoom — MIT License
 */
const PROP_BEHAVIOR = 'azl_play_behavior';
const PROP_REPEAT = 'azl_repeat_times';
const PROP_FREEZE = 'azl_freeze_at';

const DEFAULT_REPEAT_TIMES = 2;

const PLAY_BEHAVIORS = {
  play_once:          { label: 'menu.animation.loop.once', native: 'once', option: 'once',            extended: false },
  hold_on_last_frame: { label: 'menu.animation.loop.hold', native: 'hold', option: 'hold',            extended: false },
  loop:               { label: 'menu.animation.loop.loop', native: 'loop', option: 'loop',            extended: false },
  ping_pong:          { label: 'Ping-Pong',                native: 'loop', option: 'ping_pong',       extended: true  },
  repeat_x_times:     { label: 'Repeat',                   native: 'loop', option: 'repeat_x_times',  extended: true  },
  freeze_on_frame:    { label: 'Freeze',                   native: 'hold', option: 'freeze_on_frame', extended: true  },
};

const NATIVE_TO_BEHAVIOR = { once: 'play_once', loop: 'loop', hold: 'hold_on_last_frame' };
const OPTION_TO_BEHAVIOR = Object.fromEntries(Object.entries(PLAY_BEHAVIORS).map(([id, def]) => [def.option, id]));

const isAzureFormat = () => Format?.id === 'azure_model';
const roundSeconds = t => Math.round(t * 1e6) / 1e6;

function isCustomBehavior(name) {
  return typeof name === 'string' && name !== '' && !PLAY_BEHAVIORS[name];
}

function getPlayBehavior(anim) {
  const extended = anim?.[PROP_BEHAVIOR];
  const def = PLAY_BEHAVIORS[extended];

  if (def?.extended && anim.loop === def.native) return extended;

  if (isCustomBehavior(extended) && anim.loop === 'once') return extended;

  return NATIVE_TO_BEHAVIOR[anim?.loop] || 'play_once';
}

function getRepeatTimes(anim) {
  const value = Number(anim?.[PROP_REPEAT]);
  return Number.isFinite(value) && value >= 1 ? Math.round(value) : DEFAULT_REPEAT_TIMES;
}

function getFreezeAt(anim) {
  const value = Number(anim?.[PROP_FREEZE]);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function hasFreezeAt(anim) {
  const value = Number(anim?.[PROP_FREEZE]);
  return Number.isFinite(value) && value >= 0;
}

function repeatPlayCount(repeatTimes) {
  return Math.max(1, Math.round(repeatTimes));
}

function applyPlayBehavior(anim, behavior, { repeatTimes, freezeAt } = {}) {
  if (isCustomBehavior(behavior)) {
    anim.loop = 'once';
    anim[PROP_BEHAVIOR] = behavior;
    return;
  }

  const def = PLAY_BEHAVIORS[behavior] || PLAY_BEHAVIORS.play_once;

  anim.loop = def.native;
  anim[PROP_BEHAVIOR] = def.extended ? behavior : '';

  if (repeatTimes !== undefined) anim[PROP_REPEAT] = Math.max(1, Math.round(Number(repeatTimes) || 1));
  if (freezeAt !== undefined) anim[PROP_FREEZE] = Math.max(0, Number(freezeAt) || 0);
}

function playbackDiffers(anim, behavior, repeatTimes, freezeAt) {
  if (getPlayBehavior(anim) !== behavior) return true;
  if (behavior === 'repeat_x_times' && getRepeatTimes(anim) !== Math.max(1, Math.round(Number(repeatTimes) || 1))) return true;
  if (behavior === 'freeze_on_frame' && (!hasFreezeAt(anim) || getFreezeAt(anim) !== Math.max(0, Number(freezeAt) || 0))) return true;
  return false;
}

function setPlayBehaviorWithUndo(anim, behavior, settings = {}) {
  Undo.initEdit({ animations: [anim] });
  applyPlayBehavior(anim, behavior, settings);
  anim.saved = false;
  Undo.finishEdit('Change animation loop mode');
  resetPreviewClock();
  Animator.preview();
}

function writePlaybackJson(anim, obj) {
  const behavior = getPlayBehavior(anim);

  delete obj.loop;
  delete obj.repeat_times;
  delete obj.freeze_at;

  switch (behavior) {
    case 'play_once':
      break;
    case 'loop':
      obj.loop = true;
      break;
    case 'repeat_x_times':
      obj.loop = behavior;
      obj.repeat_times = getRepeatTimes(anim);
      break;
    case 'freeze_on_frame':
      obj.loop = behavior;
      obj.freeze_at = roundSeconds(getFreezeAt(anim));
      break;
    default:
      obj.loop = behavior;
  }

  return obj;
}

function readPlaybackJson(src) {
  const loop = typeof src?.loop === 'string' ? src.loop.trim() : src?.loop;
  let behavior;

  if (loop === true) behavior = 'loop';
  else if (loop === false || loop === undefined || loop === null || loop === '') behavior = 'play_once';
  else if (loop === 'once') behavior = 'play_once';
  else if (loop === 'hold') behavior = 'hold_on_last_frame';
  else if (PLAY_BEHAVIORS[loop]) behavior = loop;
  else if (isCustomBehavior(loop)) {
    return { loop: 'once', [PROP_BEHAVIOR]: loop };
  } else {
    behavior = 'play_once';
  }

  const def = PLAY_BEHAVIORS[behavior];
  const fields = {
    loop: def.native,
    [PROP_BEHAVIOR]: def.extended ? behavior : '',
  };

  if (src?.repeat_times !== undefined) fields[PROP_REPEAT] = Math.max(1, Math.round(Number(src.repeat_times) || 1));
  if (src?.freeze_at !== undefined) fields[PROP_FREEZE] = Math.max(0, Number(src.freeze_at) || 0);

  return fields;
}

function assignPlaybackFields(anim, fields) {
  for (const [key, value] of Object.entries(fields)) {
    anim[key] = value;
  }
}

let originalPropertiesDialog = null;
let pendingDialogEdit = null;

function wrappedPropertiesDialog(...args) {
  if (!isAzureFormat() || typeof Dialog === 'undefined') {
    return originalPropertiesDialog.apply(this, args);
  }

  const animation = this;
  const proto = Dialog.prototype;
  const originalShow = proto.show;

  proto.show = function (...showArgs) {
    if (this.id === 'animation_properties' && !this._azlInjected) {
      this._azlInjected = true;
      try {
        injectPlaybackIntoDialog(this, animation);
      } catch (error) {
        console.error('[AzureLib] Failed to extend animation properties dialog', error);
      }
    }
    return originalShow.apply(this, showArgs);
  };

  try {
    return originalPropertiesDialog.apply(this, args);
  } finally {
    proto.show = originalShow;
  }
}

function injectPlaybackIntoDialog(dialog, animation) {
  const config = dialog.form_config;
  if (!config?.loop) return;

  const current = getPlayBehavior(animation);
  const options = {};
  for (const def of Object.values(PLAY_BEHAVIORS)) options[def.option] = def.label;
  if (isCustomBehavior(current)) options[current] = `Custom: ${current}`;

  const currentOption = PLAY_BEHAVIORS[current]?.option ?? current;
  const isRepeat = form => form.loop === 'repeat_x_times';
  const isFreeze = form => form.loop === 'freeze_on_frame';

  const playbackFields = {
    azl_repeat_times: {
      label: 'Repeat Count',
      type: 'number',
      value: getRepeatTimes(animation),
      min: 1,
      step: 1,
      condition: isRepeat,
      description: 'How many times the animation plays in total. Same value as AzCommand setRepeatAmount.'
    },
    azl_freeze_at: {
      label: 'Freeze At',
      type: 'number',
      value: hasFreezeAt(animation) ? getFreezeAt(animation) : roundSeconds(Timeline.time || 0),
      min: 0,
      step: 0.05,
      condition: isFreeze,
      description: 'Time in seconds where the animation stops and holds.',
    },
    azl_freeze_playhead: {
      type: 'buttons',
      buttons: ['Use Playhead Time'],
      condition: isFreeze,
      click() {
        dialog.setFormValues({ azl_freeze_at: roundSeconds(Timeline.time || 0) });
      },
    },
  };

  const rebuilt = {};
  for (const [key, value] of Object.entries(config)) {
    rebuilt[key] = key === 'loop' ? { ...value, options, value: currentOption } : value;
    if (key === 'loop') Object.assign(rebuilt, playbackFields);
  }
  dialog.form_config = rebuilt;

  const originalConfirm = dialog.onConfirm;

  dialog.onConfirm = (formResult, event) => {
    const behavior = OPTION_TO_BEHAVIOR[formResult.loop] ?? formResult.loop;
    const def = PLAY_BEHAVIORS[behavior];
    const edit = {
      animation,
      behavior,
      settings: {
        repeatTimes: behavior === 'repeat_x_times' ? formResult.azl_repeat_times : undefined,
        freezeAt: behavior === 'freeze_on_frame' ? formResult.azl_freeze_at : undefined,
      },
      applied: false,
    };

    const nativeResult = { ...formResult, loop: def ? def.native : 'once' };
    delete nativeResult.azl_repeat_times;
    delete nativeResult.azl_freeze_at;
    delete nativeResult.azl_freeze_playhead;

    pendingDialogEdit = edit;
    try {
      return originalConfirm?.(nativeResult, event);
    } finally {
      pendingDialogEdit = null;
      if (!edit.applied
        && playbackDiffers(animation, behavior, edit.settings.repeatTimes, edit.settings.freezeAt)) {
        setPlayBehaviorWithUndo(animation, behavior, edit.settings);
      }
    }
  };
}

function onEditAnimationProperties({ animation } = {}) {
  const edit = pendingDialogEdit;
  if (!edit || edit.animation !== animation) return;

  applyPlayBehavior(animation, edit.behavior, edit.settings);
  edit.applied = true;
  resetPreviewClock();
}

const injectedMenuItems = [];
const wrappedNativeMenuItems = [];

const radioIcon = selected => (selected ? 'far.fa-dot-circle' : 'far.fa-circle');

function findLoopSubmenu() {
  const structure = Animation.prototype.menu?.structure;
  if (!Array.isArray(structure)) return null;
  return structure.find(item => item && typeof item === 'object' && item.name === 'menu.animation.loop') || null;
}

function injectLoopMenu() {
  const loopMenu = findLoopSubmenu();
  if (!loopMenu || !Array.isArray(loopMenu.children)) {
    console.warn('[AzureLib] Animation loop submenu not found; extended loop modes are only in the properties dialog');
    return;
  }

  const nativeByLabel = {
    'menu.animation.loop.once': 'play_once',
    'menu.animation.loop.hold': 'hold_on_last_frame',
    'menu.animation.loop.loop': 'loop',
  };

  for (const item of loopMenu.children) {
    const behavior = nativeByLabel[item?.name];
    if (!behavior) continue;

    const original = { icon: item.icon, click: item.click };
    wrappedNativeMenuItems.push({ item, original });

    item.icon = animation => (isAzureFormat()
      ? radioIcon(getPlayBehavior(animation) === behavior)
      : (typeof original.icon === 'function' ? original.icon(animation) : original.icon));

    item.click = (animation, event) => (isAzureFormat()
      ? setPlayBehaviorFromMenu(animation, behavior)
      : original.click?.(animation, event));
  }

  for (const behavior of ['ping_pong', 'repeat_x_times', 'freeze_on_frame']) {
    const def = PLAY_BEHAVIORS[behavior];
    const menuItem = {
      name: def.label === 'Repeat' ? 'Repeat X Times' : def.label === 'Freeze' ? 'Freeze on Frame' : def.label,
      id: `azl_loop_${behavior}`,
      icon: animation => radioIcon(getPlayBehavior(animation) === behavior),
      condition: () => isAzureFormat(),
      click: animation => setPlayBehaviorFromMenu(animation, behavior),
    };
    loopMenu.children.push(menuItem);
    injectedMenuItems.push({ loopMenu, menuItem });
  }
}

function setPlayBehaviorFromMenu(animation, behavior) {
  if (!animation || getPlayBehavior(animation) === behavior) return;

  const settings = behavior === 'freeze_on_frame' && !hasFreezeAt(animation)
    ? { freezeAt: roundSeconds(Timeline.time || 0) }
    : {};

  setPlayBehaviorWithUndo(animation, behavior, settings);
}

function restoreLoopMenu() {
  for (const { loopMenu, menuItem } of injectedMenuItems) {
    const index = loopMenu.children.indexOf(menuItem);
    if (index !== -1) loopMenu.children.splice(index, 1);
  }
  injectedMenuItems.length = 0;

  for (const { item, original } of wrappedNativeMenuItems) {
    item.icon = original.icon;
    item.click = original.click;
  }
  wrappedNativeMenuItems.length = 0;
}

let originalTimelineLoop = null;
let previewClock = null;

function resetPreviewClock() {
  previewClock = null;
}

function getPreviewBehavior(anim) {
  if (!isAzureFormat() || !anim || !(anim.length > 0)) return null;
  if (anim.anim_time_update) return null;
  if (Timeline.custom_range?.[1]) return null;

  const behavior = getPlayBehavior(anim);
  return PLAY_BEHAVIORS[behavior]?.extended ? behavior : null;
}

function startPreviewClock(anim, behavior) {
  const length = anim.length;
  const time = Timeline.time || 0;

  switch (behavior) {
    case 'freeze_on_frame': {
      const freezeAt = Math.min(getFreezeAt(anim), length);
      if (time >= freezeAt - 1e-4) {
        Timeline.setTime(0);
        return 0;
      }
      return time;
    }
    case 'repeat_x_times':
      if (time >= length - 1e-4) {
        Timeline.setTime(0);
        return 0;
      }
      return time;
    default:
      return time;
  }
}

function previewDelta() {
  const now = performance.now();
  let delta = (now - Timeline.last_frame_timecode) / 1000;
  if (delta < 0) delta += 1;
  Timeline.last_frame_timecode = now;
  return Math.clamp(delta, 0, 0.1) * ((Timeline.playback_speed ?? 100) / 100);
}

function stopPreview(time, keepPose) {
  Timeline.setTime(time);
  Animator.preview(false);
  Timeline.pause();
  previewClock = null;
  if (!keepPose) Animator.preview();
}

function wrappedTimelineLoop(...args) {
  const anim = Animation.selected;
  const behavior = getPreviewBehavior(anim);

  if (!behavior) {
    previewClock = null;
    return originalTimelineLoop.apply(this, args);
  }

  if (previewClock === null) previewClock = startPreviewClock(anim, behavior);
  previewClock += previewDelta();

  const length = anim.length;
  const looped = !!BarItems.looped_animation_playback?.value;

  switch (behavior) {
    case 'ping_pong': {
      const cycle = previewClock % (2 * length);
      Timeline.setTime(cycle <= length ? cycle : 2 * length - cycle);
      Animator.preview(true);
      return;
    }

    case 'repeat_x_times': {
      const total = repeatPlayCount(getRepeatTimes(anim)) * length;

      if (previewClock >= total) {
        if (looped) {
          previewClock %= total;
        } else {
          stopPreview(0, false);
          return;
        }
      }

      Timeline.setTime(previewClock % length);
      Animator.preview(true);
      return;
    }

    case 'freeze_on_frame': {
      const freezeAt = Math.min(getFreezeAt(anim), length);

      if (previewClock >= freezeAt) {
        if (looped) {
          previewClock = 0;
          Timeline.setTime(0);
          Animator.preview(true);
        } else {
          stopPreview(freezeAt, true);
        }
        return;
      }

      Timeline.setTime(previewClock);
      Animator.preview(true);
    }
  }
}

function onTimelinePlay() {
  previewClock = null;
}

let properties = [];
let registered = false;

function registerPlayBehaviors() {
  if (registered) return;
  registered = true;

  if (typeof Property !== 'undefined') {
    properties = [
      new Property(Animation, 'string', PROP_BEHAVIOR, { default: '' }),
      new Property(Animation, 'number', PROP_REPEAT, { default: DEFAULT_REPEAT_TIMES }),
      new Property(Animation, 'number', PROP_FREEZE, { default: -1 }),
    ];
  }

  if (typeof Animation.prototype.propertiesDialog === 'function') {
    originalPropertiesDialog = Animation.prototype.propertiesDialog;
    Animation.prototype.propertiesDialog = wrappedPropertiesDialog;
  }

  try {
    injectLoopMenu();
  } catch (error) {
    console.error('[AzureLib] Failed to extend animation loop menu', error);
  }

  if (typeof Timeline?.loop === 'function') {
    originalTimelineLoop = Timeline.loop;
    Timeline.loop = wrappedTimelineLoop;
  }

  Blockbench.on('edit_animation_properties', onEditAnimationProperties);
  Blockbench.on('timeline_play', onTimelinePlay);
}

function unregisterPlayBehaviors() {
  if (!registered) return;
  registered = false;

  Blockbench.removeListener('edit_animation_properties', onEditAnimationProperties);
  Blockbench.removeListener('timeline_play', onTimelinePlay);

  if (originalTimelineLoop) {
    Timeline.loop = originalTimelineLoop;
    originalTimelineLoop = null;
  }
  previewClock = null;

  restoreLoopMenu();

  if (originalPropertiesDialog) {
    Animation.prototype.propertiesDialog = originalPropertiesDialog;
    originalPropertiesDialog = null;
  }

  properties.forEach(property => property.delete?.());
  properties = [];
}

;// ./animation/azure-animation-tab.js
/**
 * AzureLib Animator — Unified Animation Tab
 * ------------------------------------------
 * Replaces the Minecraft Bedrock animation tab with a fully custom
 * AnimationCodec that supports both AzureLib custom easings AND
 * Bedrock catmullrom/lerp_mode keyframes in one unified JSON.
 *
 * Keyframe schema auto-detection:
 *   - AzureLib:  { "vector": [...], "easing": "easeInSine", "easingArgs": [...] }
 *   - Bedrock:   { "post": [...], "lerp_mode": "catmullrom" }
 *   - Both can coexist in the same animation file.
 *
 * Built on Blockbench's AnimationCodec API — no monkey-patching of
 * Animator.buildFile / Animator.loadFile, no hiding of built-in menu items.
 *
 * © 2026 AzureDoom — MIT License
 */





// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const AZURE_ANIM_FORMAT_ID = 'azure_animation';
const FORMAT_VERSION = '1.8.0';

/**
 * Stores top-level animation include metadata by source file path so we can
 * round-trip the user's custom include system without forcing a dedicated UI.
 *
 * Key: animation file path (or '' for unpathed/ephemeral files)
 * Value: normalised includes array
 */
const animationIncludesByPath = new Map();

/** Bedrock lerp modes that this plugin understands natively. */
const BEDROCK_LERP_MODES = new Set(['linear', 'catmullrom']);

/** AzureLib easing names that map 1:1 to Bedrock lerp_mode on export. */
const AZURE_TO_BEDROCK_LERP = {
  linear: 'linear',
  // catmullrom is set via interpolation='catmullrom', not easing field
};

// ---------------------------------------------------------------------------
// Schema detection helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if a keyframe object uses the Bedrock pre/post/lerp_mode schema.
 */
function isBedrockKeyframe(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  return obj.lerp_mode !== undefined || obj.pre !== undefined || obj.post !== undefined;
}

/**
 * Returns true if a keyframe object uses the AzureLib { vector, easing } schema.
 */
function isAzureKeyframe(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  return obj.vector !== undefined || obj.easing !== undefined;
}

/**
 * Unwrap a value to a plain [x, y, z] array, handling all known wrapping forms.
 */
function unwrapToArray(v) {
  if (Array.isArray(v)) return v;
  if (v && typeof v === 'object') {
    if (Array.isArray(v.vector)) return v.vector;
    if (v.vector && typeof v.vector === 'object' && Array.isArray(v.vector.vector)) return v.vector.vector;
  }
  return null;
}

/**
 * Normalise a time key string: "0.0" → "0", "1.000" → "1", "0.5" stays.
 */
function normTime(t) {
  return String(t).replace(/^(-?\d+)\.0+$/, '$1');
}

const KEY_ORDER = Symbol('azureKeyOrder');

function orderedMap(entries) {
  const obj = Object.fromEntries(entries);
  Object.defineProperty(obj, KEY_ORDER, {
    value: entries.map(([k]) => k),
    enumerable: false,
    configurable: true,
  });
  return obj;
}

function normalizeAnimationIncludes(includes) {
  if (!Array.isArray(includes) || !includes.length) return [];

  return includes
    .filter(entry => entry && typeof entry === 'object')
    .map(entry => ({
      file_id: String(entry.file_id || '').trim(),
      animations: Array.isArray(entry.animations)
        ? entry.animations
            .map(name => String(name || '').trim())
            .filter(Boolean)
        : [],
    }))
    .filter(entry => entry.file_id && entry.animations.length);
}

function cloneAnimationIncludes(includes) {
  return normalizeAnimationIncludes(includes).map(entry => ({
    file_id: entry.file_id,
    animations: [...entry.animations],
  }));
}

function getAnimationIncludesForPath(path) {
  return cloneAnimationIncludes(animationIncludesByPath.get(path || '') || []);
}

function setAnimationIncludesForPath(path, includes) {
  const key = path || '';
  const normal = normalizeAnimationIncludes(includes);
  if (normal.length) animationIncludesByPath.set(key, normal);
  else animationIncludesByPath.delete(key);
}

function applyAnimationIncludes(out, includes) {
  const normal = cloneAnimationIncludes(includes);
  if (normal.length) out.includes = normal;
  else delete out.includes;
  return out;
}


function getIncludesTargetPath() {
  const selected = Animation?.selected;
  if (selected) return selected.path || '';

  const uniquePaths = [...new Set(Animation.all.map(anim => anim.path || ''))];
  if (uniquePaths.length === 1) return uniquePaths[0];

  return '';
}

function getAnimationNamesForPath(path) {
  return Animation.all
    .filter(anim => (anim.path || '') === (path || '') && anim.name)
    .map(anim => anim.name)
    .sort((a, b) => a.localeCompare(b));
}

function findDuplicateIncludedAnimationNames(includes) {
  const seen = new Map();
  const duplicates = [];

  includes.forEach((entry, entryIndex) => {
    (entry.animations || []).forEach(name => {
      const key = String(name || '').trim();
      if (!key) return;

      const previous = seen.get(key);
      if (previous !== undefined) {
        duplicates.push({ name: key, firstIndex: previous, secondIndex: entryIndex });
      } else {
        seen.set(key, entryIndex);
      }
    });
  });

  return duplicates;
}

function showAnimationIncludesDialog() {
  const targetPath = getIncludesTargetPath();
  const current = getAnimationIncludesForPath(targetPath);
  const animationNames = getAnimationNamesForPath(targetPath);
  const fileLabel = targetPath || 'Unsaved animation file';

  const dialog = new Dialog({
    id: 'azl_animation_includes_editor',
    title: 'Edit Animation Includes',
    width: 760,
    component: {
      data() {
        return {
          targetPath,
          fileLabel,
          rows: current.length
            ? current.map(entry => ({
                file_id: entry.file_id,
                animations_text: entry.animations.join(', '),
              }))
            : [{ file_id: '', animations_text: '' }],
          animationNames,
          exampleAnimationNames: animationNames.join(', '),
        };
      },
      methods: {
        addRow() {
          this.rows.push({ file_id: '', animations_text: '' });
        },
        removeRow(index) {
          this.rows.splice(index, 1);
          if (!this.rows.length) this.addRow();
        },
      },
      template: `
        <div class="dialog_content azure_includes_dialog" style="display:flex;flex-direction:column;gap:12px;min-width:0;">
          <div style="min-width:0;">
            <p style="margin:0;"><strong>Editing file:</strong> <span style="word-break:break-all;">{{ fileLabel }}</span></p>
            <p style="margin:6px 0 0 0;opacity:0.8;">
              These entries are saved at the top level of the animation JSON as <code>includes</code>.
            </p>
            <p v-if="exampleAnimationNames" style="margin:6px 0 0 0;opacity:0.8;line-height:1.45;">
              Animations currently in this file: <code style="white-space:pre-wrap;word-break:break-word;">{{ exampleAnimationNames }}</code>
            </p>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <strong>Include Entries</strong>
            <button
              type="button"
              style="position:static;display:inline-flex;align-items:center;justify-content:center;padding:6px 12px;min-height:32px;white-space:nowrap;"
              @click="addRow()"
            >
              Add Include
            </button>
          </div>
          
          <div style="display:flex;flex-direction:column;gap:12px;max-height:420px;overflow:auto;padding-right:4px;min-width:0;">
            <div
              v-for="(row, index) in rows"
              :key="index"
              style="display:block;padding:12px;border:1px solid rgba(255,255,255,0.08);border-radius:8px;background:rgba(255,255,255,0.03);box-sizing:border-box;min-width:0;"
            >
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px;">
                <div style="font-weight:600;opacity:0.95;">Include {{ index + 1 }}</div>
                <button
                  type="button"
                  style="position:static;display:inline-flex;align-items:center;justify-content:center;padding:4px 10px;min-height:28px;white-space:nowrap;"
                  @click="removeRow(index)"
                >
                  Remove
                </button>
              </div>
          
              <div style="display:flex;flex-direction:column;gap:10px;min-width:0;">
                <label style="display:flex;flex-direction:column;gap:4px;width:100%;min-width:0;">
                  <span>File ID</span>
                  <input
                    type="text"
                    class="dark_bordered"
                    style="display:block;width:100%;min-width:0;max-width:100%;box-sizing:border-box;"
                    v-model="row.file_id"
                    placeholder="mod_id:path/to/other_animation.json"
                  />
                </label>
          
                <label style="display:flex;flex-direction:column;gap:4px;width:100%;min-width:0;">
                  <span>Animations (comma-separated)</span>
                  <textarea
                    class="dark_bordered"
                    rows="3"
                    style="display:block;width:100%;min-width:0;max-width:100%;resize:vertical;box-sizing:border-box;line-height:1.4;"
                    v-model="row.animations_text"
                    placeholder="animation_name_1, animation_name_2"
                  ></textarea>
                </label>
              </div>
            </div>
          </div>
        </div>
      `,
    },
    onConfirm() {
      const rows = dialog.content_vue?.rows || [];
      const normalized = normalizeAnimationIncludes(rows.map(row => ({
        file_id: row.file_id,
        animations: String(row.animations_text || '')
          .split(',')
          .map(name => name.trim())
          .filter(Boolean),
      })));

      const duplicates = findDuplicateIncludedAnimationNames(normalized);
      if (duplicates.length) {
        const preview = duplicates
          .slice(0, 6)
          .map(dup => `${dup.name} (entries ${dup.firstIndex + 1} and ${dup.secondIndex + 1})`)
          .join('\n');
      
        if (typeof Blockbench.showMessageBox === 'function') {
          Blockbench.showMessageBox({
            title: 'Duplicate Included Animations',
            message:
              'Each included animation name must be unique across all include entries.\n\n' +
              preview +
              (duplicates.length > 6 ? `\n…and ${duplicates.length - 6} more.` : ''),
          });
        } else {
          Blockbench.showQuickMessage('Duplicate included animation names detected.', 2400);
        }
      
        return false;
      }

      setAnimationIncludesForPath(targetPath, normalized);
      Blockbench.showQuickMessage(
        normalized.length
          ? `Saved ${normalized.length} animation include${normalized.length === 1 ? '' : 's'}.`
          : 'Cleared animation includes.',
        2000
      );
    },
  });

  dialog.show();
}

// ---------------------------------------------------------------------------
// Animation file builder (export)
// ---------------------------------------------------------------------------

/**
 * Serialise all open Animation objects into the unified AzureLib JSON structure.
 * Kept as a convenience for callers that want everything in the project.
 * The codec itself uses compileFile(animations) so it can scope by file path.
 */
function buildAzureAnimationFile() {
  const out = applyAnimationIncludes({
    format_version: FORMAT_VERSION,
    animations: {},
  }, getAnimationIncludesForPath(''));

  for (const anim of Animation.all) {
    if (!anim.name) continue;
    const animOut = serializeAnimation(anim);
    out.animations[anim.name] = animOut;
  }

  return out;
}

function serializeAnimation(anim) {
  const obj = {};

  writePlaybackJson(anim, obj);

  if (anim.override) obj.override_previous_animation = true;
  if (anim.anim_time_update) obj.anim_time_update = anim.anim_time_update.replace(/;\n/g, ';');
  if (anim.blend_weight) obj.blend_weight = anim.blend_weight.replace(/;\n/g, ';');
  if (anim.length) obj.animation_length = Math.round(anim.length * 1e6) / 1e6;

  const bones = {};
  const effects = anim.animators.effects;
  const boneAnimators = Object.values(anim.animators).filter(a => a instanceof BoneAnimator);

  for (const boneAnim of boneAnimators) {
    const boneName = boneAnim.name;
    const boneOut = {};

    for (const channel of ['position', 'rotation', 'scale']) {
      const keyframes = boneAnim.keyframes.filter(kf => kf.channel === channel);
      if (!keyframes.length) continue;

      // Sort by time
      keyframes.sort((a, b) => a.time - b.time);

      if (keyframes.length === 1) {
        // Constant value — AzureLib format: { "vector": [...] }
        // Easing and easingArgs sit alongside vector at the same level (not nested).
        const kf = keyframes[0];
        const vec = extractKeyframeVector(kf, channel, true);
        const node = { vector: vec };
        const easing = kf.easing;
        if (easing && easing !== EASING_DEFAULT) node.easing = easing;
        if (hasArgs(easing) && Array.isArray(kf.easingArgs) && kf.easingArgs.length) {
          node.easingArgs = [...kf.easingArgs];
        }
        boneOut[channel] = node;
      } else {
        const channelIsEasing = keyframes.some(
            kf => kf.easing && kf.easing !== EASING_DEFAULT
        );

        const entries = keyframes.map(kf => {
          const t = normTime(roundTime(kf.time));
          const serialized = serializeKeyframe(kf, channel, keyframes, channelIsEasing);
          return [t, serialized];
        });
        boneOut[channel] = orderedMap(entries);
      }
    }

    if (Object.keys(boneOut).length) {
      bones[boneName] = boneOut;
    }
  }

  if (Object.keys(bones).length) obj.bones = bones;

  // Effects (sound/particle/timeline)
  if (effects && Array.isArray(effects.keyframes) && effects.keyframes.length) {
    const soundEntries = [];
    const particleEntries = [];
    const timelineEntries = [];

    const sortedEffectKeyframes = [...effects.keyframes].sort((a, b) => a.time - b.time);

    for (const kf of sortedEffectKeyframes) {
      const t = normTime(roundTime(kf.time));
      if (kf.channel === 'sound') {
        const pts = (kf.data_points || []).map(p => {
          const effect = typeof p === 'string' ? p : p.effect;
          if (!effect) return null;
          const o = { effect };
          if (p.locator !== undefined) o.locator = p.locator;
          if (p.script !== undefined) o.script = p.script;
          return o;
        }).filter(Boolean);
        if (pts.length === 1) soundEntries.push([t, pts[0]]);
        else if (pts.length > 1) soundEntries.push([t, pts]);
      } else if (kf.channel === 'particle') {
        const pts = (kf.data_points || []).map(p => {
          const o = {};
          if (p.effect) o.effect = p.effect;
          if (p.locator !== undefined) o.locator = p.locator;
          if (p.script !== undefined) o.script = p.script;
          return Object.keys(o).length ? o : null;
        }).filter(Boolean);
        if (pts.length === 1) particleEntries.push([t, pts[0]]);
        else if (pts.length > 1) particleEntries.push([t, pts]);
      } else if (kf.channel === 'timeline') {
        const script = (kf.data_points?.[0]?.script) || '';
        if (script) timelineEntries.push([t, script]);
      }
    }

    if (soundEntries.length) obj.sound_effects = orderedMap(soundEntries);
    if (particleEntries.length) obj.particle_effects = orderedMap(particleEntries);
    if (timelineEntries.length) obj.timeline = orderedMap(timelineEntries);
  }

  return obj;
}

/**
 * Map Blockbench interpolation mode → Bedrock lerp_mode string.
 * 'linear' in BB is called 'linear' in Bedrock JSON.
 * 'catmullrom' in BB is called 'catmullrom' in Bedrock JSON.
 * 'bezier' uses Blockbench's own pre/post pair format.
 * 'step' uses a pre/post pair where pre = previous value.
 */
const BB_INTERP_TO_LERP_MODE = {
  catmullrom: 'catmullrom',
  // bezier and step are handled structurally (pre/post pairs), not via lerp_mode
};

/**
 * Serialise a single keyframe into its JSON representation.
 *
 * Bedrock interpolation modes (kf.interpolation is set):
 *   'linear'     → { post: [...], lerp_mode: 'linear' }
 *   'catmullrom' → { post: [...], lerp_mode: 'catmullrom' }   (+ pre if available)
 *   'bezier'     → { pre: [...], post: [...] }                 (Blockbench bezier handles pre/post natively)
 *   'step'       → { pre: [...], post: [...] }                 (discrete hold)
 *
 * AzureLib easing mode (kf.interpolation is undefined/null):
 *   With easing   → { vector: [...], easing: "easeInSine", easingArgs?: [...] }
 *   No easing     → [x, y, z]   (plain array shorthand)
 */
function serializeKeyframe(kf, channel, allKeyframes, channelIsEasing = false) {
  const vec    = extractKeyframeVector(kf, channel, true);
  const interp = kf.interpolation;

  // --- Bedrock lerp_mode-based keyframes (linear / catmullrom) ---
  if (interp === 'catmullrom' && !channelIsEasing) {
    const node = { post: vec, lerp_mode: 'catmullrom' };
    const preVec = extractKeyframePreVector(kf, channel);
    if (preVec) node.pre = preVec;
    return node;
  }

  // --- Bezier keyframes: always have explicit pre/post control points ---
  if (interp === 'bezier') {
    const preVec = extractKeyframePreVector(kf, channel);
    return preVec
      ? { pre: preVec, post: vec }
      : { post: vec };
  }

  // --- Step / discrete hold: emit pre (previous value) + post (this value) ---
  if (interp === 'step') {
    const prevKf = getPreviousKeyframe(kf, allKeyframes);
    const preVec = extractKeyframePreVector(kf, channel)
      || (prevKf ? extractKeyframeVector(prevKf, channel, true) : null);
    return preVec ? { pre: preVec, post: vec } : { post: vec };
  }

  // --- Transition into a step keyframe: emit pre/post pair at this boundary ---
  const prevKf = getPreviousKeyframe(kf, allKeyframes);
  if (prevKf && prevKf.interpolation === 'step') {
    const preVec = extractKeyframePreVector(kf, channel)
      || extractKeyframeVector(prevKf, channel, true);
    const out = { pre: preVec, post: vec };
    if (kf.easing && kf.easing !== EASING_DEFAULT) out.easing = kf.easing;
    if (hasArgs(kf.easing) && Array.isArray(kf.easingArgs) && kf.easingArgs.length) {
      out.easingArgs = [...kf.easingArgs];
    }
    return out;
  }

  // --- AzureLib easing node (no Bedrock interpolation set) ---
  // Timed keyframes always use { "vector": [...] } form — never bare arrays.
  // Easing is only written when it differs from the default ('linear').
  // Easing is suppressed for Molang expression vectors (easing is meaningless there).
  const easing = kf.easing;
  const vecHasMolang = vec.some(v => typeof v === 'string' && isNaN(Number(v)));
  const writeEasing  = easing && easing !== EASING_DEFAULT && !vecHasMolang;
  const writeArgs    = writeEasing && hasArgs(easing) && Array.isArray(kf.easingArgs) && kf.easingArgs.length;

  const node = { vector: vec };
  if (writeEasing) node.easing = easing;
  if (writeArgs)   node.easingArgs = [...kf.easingArgs];
  return node;
}

/**
 * Invert a single axis value only when needed for BB 5.0+ coordinate fix.
 * Numeric zero stays as numeric 0 (not converted to string "0").
 * Molang strings are inverted via invertMolang.
 * Non-zero numbers are negated directly.
 */
function safeInvert(v) {
  v = normalizeAxisValue(v);
  if (typeof v === 'string') return invertMolang(v);
  if (typeof v === 'number') return v === 0 ? 0 : -v;
  return v;
}

function normalizeAxisValue(v) {
  // Treat empty UI values as real numeric zero
  if (v === null || v === undefined) return 0;

  if (typeof v === 'string') {
    const trimmed = v.trim();

    // This catches '', '\n', '   ', etc.
    if (trimmed === '') return 0;

    // Preserve Molang expressions, but convert numeric strings
    const n = Number(trimmed);
    return Number.isNaN(n) ? v : n;
  }

  return v;
}

function extractKeyframeVector(kf, channel, applyInversion) {
  const dp = kf.data_points?.[kf.data_points.length > 1 ? 1 : 0] || kf.data_points?.[0];
  if (!dp) return [0, 0, 0];

  let x = normalizeAxisValue(dp.x);
  let y = normalizeAxisValue(dp.y);
  let z = normalizeAxisValue(dp.z);

  if (applyInversion && Blockbench.isNewerThan('4.99')) {
    if (channel === 'rotation') { x = safeInvert(x); y = safeInvert(y); }
    else if (channel === 'position') { x = safeInvert(x); }
  }

  return [roundVal(x), roundVal(y), roundVal(z)];
}

function extractKeyframePreVector(kf, channel) {
  if (!kf.data_points || kf.data_points.length < 2) return null;
  const dp = kf.data_points[0];

  let x = normalizeAxisValue(dp.x);
  let y = normalizeAxisValue(dp.y);
  let z = normalizeAxisValue(dp.z);

  if (Blockbench.isNewerThan('4.99')) {
    if (channel === 'rotation') { x = safeInvert(x); y = safeInvert(y); }
    else if (channel === 'position') { x = safeInvert(x); }
  }

  return [roundVal(x), roundVal(y), roundVal(z)];
}

function getPreviousKeyframe(kf, allKeyframes) {
  const idx = allKeyframes.indexOf(kf);
  return idx > 0 ? allKeyframes[idx - 1] : null;
}

function roundTime(t) {
  return Math.round(t * 1e6) / 1e6;
}

function roundVal(v) {
  if (typeof v === 'number') return Math.round(v * 1e5) / 1e5;
  return v;
}

// ---------------------------------------------------------------------------
// Animation file loader (import)
// ---------------------------------------------------------------------------

/**
 * Parse a unified AzureLib/Bedrock animation JSON file and create
 * Animation + BoneAnimator + Keyframe objects in Blockbench.
 */
function loadAzureAnimationFile(file, filter) {
  const json = file.json || (typeof autoParseJSON === 'function' ? autoParseJSON(file.content) : JSON.parse(file.content));
  if (!json || typeof json.animations !== 'object') return [];

  setAnimationIncludesForPath(file?.path, json.includes);

  const animsOut = [];

  for (const name in json.animations) {
    if (filter && !filter.includes(name)) continue;
    const src = json.animations[name];
    const anim = parseAnimation(name, src, file.path);
    animsOut.push(anim);
  }

  return animsOut;
}

function parseAnimation(name, src, filePath) {
  const playback = readPlaybackJson(src);
  const anim = new Animation({
    name,
    path: filePath,
    saved_name: name,
    ...playback,
    override: !!src.override_previous_animation,
    anim_time_update: typeof src.anim_time_update === 'string'
      ? src.anim_time_update.replace(/;(?!$)/, ';\n')
      : src.anim_time_update || '',
    blend_weight: typeof src.blend_weight === 'string'
      ? src.blend_weight.replace(/;(?!$)/, ';\n')
      : src.blend_weight || '',
    length: Number(src.animation_length || 0),
  }).add();

  assignPlaybackFields(anim, playback);

  // Effects
  if (src.sound_effects || src.particle_effects || src.timeline || src.instructions) {
    const effectsAnim = ensureEffectsAnimator(anim);
    parseEffects(effectsAnim, src);
  }

  // Bones
  if (src.bones) {
    for (const boneName in src.bones) {
      const bone = src.bones[boneName];
      const group = Group.all.find(g => g.name.toLowerCase() === boneName.toLowerCase());
      const uuid = group ? group.uuid : guid();
      const boneAnim = new BoneAnimator(uuid, anim, boneName);
      anim.animators[uuid] = boneAnim;

      for (const channel in bone) {
        if (!Animator.possible_channels[channel]) continue;
        parseChannel(boneAnim, channel, bone[channel]);
      }
    }
  }

  anim.calculateSnappingFromKeyframes?.();
  if (!Animation.selected && Animator.open) anim.select();

  return anim;
}

function parseChannel(boneAnim, channel, channelData) {
  if (!channelData) return;

  const addKf = (time, data) => {
    const parsed = parseKeyframeData(data, channel, time);
    if (!parsed) return;

    boneAnim.addKeyframe({
      time,
      channel,
      easing: parsed.easing,
      easingArgs: parsed.easingArgs,
      interpolation: parsed.interpolation,
      uniform: parsed.uniform,
      data_points: parsed.data_points,
    });
  };

  // Shorthand constant value (array or { vector: [...] })
  if (Array.isArray(channelData) || (channelData.vector !== undefined && Object.keys(channelData).length <= 3)) {
    const vec = unwrapToArray(channelData) || channelData;
    if (Array.isArray(vec)) {
      addKf(0, vec);
      return;
    }
  }

  // Check if the whole channel object is a single keyframe with lerp_mode/pre/post/vector
  if (
    channelData.lerp_mode !== undefined ||
    channelData.pre !== undefined ||
    channelData.post !== undefined ||
    (channelData.vector !== undefined && typeof channelData.vector !== 'object')
  ) {
    addKf(0, channelData);
    return;
  }

  // Normal timed keyframes map: { "0.0": {...}, "0.5": {...}, ... }
  for (const rawT in channelData) {
    const time = parseFloat(rawT);
    const entry = channelData[rawT];
    addKf(time, entry);
  }
}

/**
 * Converts a raw JSON keyframe entry into a normalised data structure
 * that Blockbench's Keyframe system can consume.
 * Handles all three forms:
 *   1. Plain array          [x, y, z]
 *   2. AzureLib node        { vector, easing?, easingArgs? }
 *   3. Bedrock spline node  { post, pre?, lerp_mode }
 */

function toNum(v) {
  if (typeof v !== 'string') return v;
  const n = Number(v);
  return isNaN(n) ? v : n;  // Molang → keep string; numeric string → number
}

function coerceVec(vec) {
  return vec.map(toNum);
}

function parseKeyframeData(data, channel, time) {
  // --- 1. Plain array ---
  if (Array.isArray(data)) {
    const vec = applyFlipOnLoad(coerceVec(data), channel);
    return {
      easing: EASING_DEFAULT,
      easingArgs: undefined,
      interpolation: undefined,
      uniform: false,
      data_points: [{ x: vec[0], y: vec[1], z: vec[2] }],
    };
  }

  if (!data || typeof data !== 'object') return null;

  // --- 2. AzureLib node (has vector or easing) ---
  if (isAzureKeyframe(data) && !isBedrockKeyframe(data)) {
    const rawVec = unwrapToArray(data.vector || data) || [0, 0, 0];
    const vec = applyFlipOnLoad(coerceVec(rawVec), channel);
    return {
      easing: data.easing || EASING_DEFAULT,
      easingArgs: Array.isArray(data.easingArgs) && data.easingArgs.length ? data.easingArgs : undefined,
      interpolation: undefined,
      uniform: false,
      data_points: [{ x: vec[0], y: vec[1], z: vec[2] }],
    };
  }

  // --- 3. Bedrock interpolation node (has lerp_mode, pre, or post) ---
  if (isBedrockKeyframe(data)) {
    // Map JSON lerp_mode strings back to Blockbench interpolation identifiers
    const lerp = data.lerp_mode;
    const interpolation =
      lerp === 'catmullrom' ? 'catmullrom' :
      // lerp_mode:'linear' treated as no special interpolation — AzureLib linear easing handles it
      lerp === 'linear'     ? undefined      :
      // pre/post without lerp_mode is bezier in Blockbench's own format
      (data.pre !== undefined || data.post !== undefined) ? 'bezier' :
      undefined;
    const data_points = [];

    const postRaw = unwrapToArray(data.post);
    const preRaw = unwrapToArray(data.pre);

    if (preRaw) {
      const pre = applyFlipOnLoad(coerceVec(preRaw), channel);
      data_points.push({ x: pre[0], y: pre[1], z: pre[2] });
    }

    const postVec = postRaw ? applyFlipOnLoad(coerceVec(postRaw), channel) : [0, 0, 0];
    data_points.push({ x: postVec[0], y: postVec[1], z: postVec[2] });

    return {
      easing: EASING_DEFAULT,
      easingArgs: undefined,
      interpolation,
      uniform: false,
      data_points: data_points.length ? data_points : [{ x: 0, y: 0, z: 0 }],
    };
  }

  // Fallback — treat as raw vector object
  const x = toNum(data.x ?? 0);
  const y = toNum(data.y ?? 0);
  const z = toNum(data.z ?? 0);
  return {
    easing: EASING_DEFAULT,
    easingArgs: undefined,
    interpolation: undefined,
    uniform: false,
    data_points: [{ x, y, z }],
  };
}

function applyFlipOnLoad(vec, channel) {
  if (!Blockbench.isNewerThan('4.99')) return vec;
  const v = [...vec];
  if (channel === 'rotation') {
    v[0] = invertMolang(v[0]);
    v[1] = invertMolang(v[1]);
  } else if (channel === 'position') {
    v[0] = invertMolang(v[0]);
  }
  return v;
}

function parseEffects(effectsAnim, src) {
  if (src.sound_effects) {
    for (const t in src.sound_effects) {
      let sounds = src.sound_effects[t];
      if (!Array.isArray(sounds)) sounds = [sounds];
      const pts = sounds.filter(Boolean).map(s => (typeof s === 'string' ? { effect: s } : { ...s }));
      effectsAnim.addKeyframe({ channel: 'sound', time: parseFloat(t), data_points: pts });
    }
  }

  if (src.particle_effects) {
    for (const t in src.particle_effects) {
      let particles = src.particle_effects[t];
      if (!Array.isArray(particles)) particles = [particles];
      const pts = particles.filter(Boolean).map(p => {
        const o = { ...p };
        if (o.pre_effect_script && !o.script) o.script = o.pre_effect_script;
        return o;
      });
      effectsAnim.addKeyframe({ channel: 'particle', time: parseFloat(t), data_points: pts });
    }
  }

  const timeline = src.timeline || src.instructions;
  if (timeline) {
    for (const t in timeline) {
      const entry = timeline[t];
      const script = Array.isArray(entry) ? entry.join('\n') : entry;
      effectsAnim.addKeyframe({ channel: 'timeline', time: parseFloat(t), data_points: [{ script }] });
    }
  }
}

function ensureEffectsAnimator(anim) {
  if (!anim.animators.effects) {
    anim.animators.effects = new EffectAnimator(anim);
  }
  return anim.animators.effects;
}

// ---------------------------------------------------------------------------
// Pretty-printer (kept from the original — formats arrays inline)
// ---------------------------------------------------------------------------

/**
 * Recursive stringifier used in place of JSON.stringify() for the top-level
 * object.
 *
 * The ONLY reason this exists instead of a plain JSON.stringify(obj, null,
 * '\t') call: JS object key enumeration always places integer-index-looking
 * keys ("0", "3") ahead of non-integer keys ("1.5"), in ascending numeric
 * order, regardless of insertion order. Keyframe time maps mix whole-number
 * and fractional time keys, so a correctly time-sorted entry list like
 * "0", "1.5", "3" gets silently re-emitted as "0", "3", "1.5" by
 * JSON.stringify. AzureLib's runtime loader trusts file order rather than
 * re-sorting on load, so that reorder becomes a real, silent timeline
 * corruption (a segment that runs backwards and a bone that freezes).
 *
 * This function walks the object tree itself and, for any object tagged
 * with KEY_ORDER (via orderedMap()), emits keys in that explicit order
 * instead of using Object.keys()/JSON.stringify's native enumeration.
 * Everything else behaves like a normal pretty-printed JSON.stringify.
 */
function orderedStringify(value, indent, currentIndent) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  const childIndent = currentIndent + indent;

  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    const items = value.map(v => childIndent + orderedStringify(v, indent, childIndent));
    return '[\n' + items.join(',\n') + '\n' + currentIndent + ']';
  }

  const keys = value[KEY_ORDER] || Object.keys(value);
  if (!keys.length) return '{}';
  const items = keys.map(k =>
    childIndent + JSON.stringify(k) + ': ' + orderedStringify(value[k], indent, childIndent)
  );
  return '{\n' + items.join(',\n') + '\n' + currentIndent + '}';
}

/**
 * JSON serialiser that pretty-prints with tabs but keeps arrays compact on one line.
 * This matches the original Bedrock/AzureLib animation file format exactly.
 */
function serializeAnimationJson(obj) {
  // First pass: order-preserving pretty-print (see orderedStringify above —
  // this replaces a plain JSON.stringify(obj, null, '\t') specifically to
  // avoid its integer-key reordering behaviour on keyframe time maps).
  const raw = orderedStringify(obj, '\t', '');
  // Second pass: collapse arrays that contain only numbers/strings onto one line.
  // Matches [ followed by whitespace+values+whitespace ] across newlines.
  return raw.replace(
    /\[\s*([\s\S]*?)\s*\]/g,
    (match, inner) => {
      // Only collapse if every element is a number or a quoted string (no nested objects/arrays)
      const trimmed = inner.trim();
      if (!trimmed) return '[]';
      // Check that the inner content has no { or [ — i.e. it's a flat value array
      if (/[{\[\]]/.test(trimmed)) return match;
      // Collapse: replace all internal whitespace/newlines/tabs between values with ', '
      const items = trimmed.split(/,\s*/).map(s => s.trim());
      return '[' + items.join(', ') + ']';
    }
  );
}

// ---------------------------------------------------------------------------
// AnimationCodec — the public-facing format integration
// ---------------------------------------------------------------------------

/**
 * Filesystem helpers — only used in the desktop app. Guarded so the codec
 * still works in the web build (where save/reload-by-path are no-ops).
 */
const _fs = ( true && typeof isApp !== 'undefined' && isApp)
  ? __webpack_require__(9896)
  : null;

/**
 * Try to recover a previously written file's JSON (for in-place merges).
 * Returns null if the file is missing or unparseable, never throws.
 */
function _readExistingAnimationFile(path) {
  if (!_fs || !path) return null;
  try {
    if (!_fs.existsSync(path)) return null;
    const raw = _fs.readFileSync(path, 'utf-8');
    const parsed = typeof autoParseJSON === 'function'
      ? autoParseJSON(raw, false)
      : JSON.parse(raw);
    return (parsed && typeof parsed.animations === 'object') ? parsed : null;
  } catch (_) {
    return null;
  }
}

/**
 * Lazily-created codec instance.
 *
 * IMPORTANT:
 * Do not construct AnimationCodec at module load, because the blockbench-plugins
 * validator evaluates the bundle in a VM before the full app/runtime exists.
 */
let azureAnimationCodec = null;

function createAzureAnimationCodec() {
  if (azureAnimationCodec) return azureAnimationCodec;

  if (typeof AnimationCodec === 'undefined') {
    console.warn('[AzureLib] AnimationCodec API is unavailable in this Blockbench version.');
    return null;
  }

  azureAnimationCodec = new AnimationCodec(AZURE_ANIM_FORMAT_ID, {
    multiple_per_file: true,

    // ---- Import side ---------------------------------------------------

    pickFile() {
      Blockbench.import({
        resource_id: 'azure_animation',
        type: 'AzureLib Animation',
        extensions: ['json'],
        readtype: 'text',
        multiple: true,
      }, async (files) => {
        if (!files || !files.length) return;
        for (const file of files) {
          await this.importFile(file);
        }
      });
    },

    importFile(file, auto_loaded) {
      let parsed;
      try {
        parsed = typeof autoParseJSON === 'function'
          ? autoParseJSON(file.content, false)
          : JSON.parse(file.content);
      } catch (error) {
        console.error('[AzureLib] Failed to parse animation file:', error);
        Blockbench.showQuickMessage('[AzureLib] Failed to parse animation file.');
        return [];
      }

      file.json = parsed;
      return this.loadFile(file, null, auto_loaded);
    },

    loadFile(file, animation_filter, auto_loaded) {
      const json = file?.json || (
        typeof autoParseJSON === 'function'
          ? autoParseJSON(file.content, false)
          : JSON.parse(file.content)
      );

      if (!json || typeof json.animations !== 'object') {
        Blockbench.showQuickMessage('[AzureLib] No animations found in file.');
        return [];
      }

      const path = file.path || '';
      setAnimationIncludesForPath(path, json.includes || []);

      const created = [];

      for (const [name, animData] of Object.entries(json.animations)) {
        if (Array.isArray(animation_filter) && animation_filter.length && !animation_filter.includes(name)) {
          continue;
        }

        // Delegate to parseAnimation which correctly handles bone UUID assignment,
        // channel parsing (including numeric coercion and flip-on-load), and effects.
        const anim = parseAnimation(name, animData, path);
        anim.saved = true;
        created.push(anim);
      }

      if (!auto_loaded && created.length) {
        Animation.selected = created[0];
      }

      return created;
    },

    // ---- Export side ---------------------------------------------------

    compileFile(animations = Animation.all) {
      const scoped = Array.isArray(animations) ? animations : Animation.all;
      const path = scoped.length ? (scoped[0].path || '') : '';
      const out = applyAnimationIncludes({
        format_version: FORMAT_VERSION,
        animations: {},
      }, getAnimationIncludesForPath(path));

      for (const anim of scoped) {
        if (!anim?.name) continue;
        out.animations[anim.name] = serializeAnimation(anim);
      }

      return out;
    },

    write(content, path) {
      return serializeAnimationJson(content);
    },

    /**
     * Save a single animation back into its source file while preserving
     * sibling animations and includes.
     */
    saveAnimation(animation, save_as) {
      const compileSingleFile = () => applyAnimationIncludes({
        format_version: FORMAT_VERSION,
        animations: {
          [animation.name]: serializeAnimation(animation),
        },
      }, getAnimationIncludesForPath(animation.path));

      if (!isApp || !animation.path || save_as) {
        Blockbench.export({
          resource_id: 'azure_animation',
          type: 'AzureLib Animation',
          extensions: ['json'],
          name: (Project?.geometry_name || Project?.name || 'animation') + '.animation',
          startpath: animation.path,
          content: serializeAnimationJson(compileSingleFile()),
        }, (real_path) => {
          const previousPath = animation.path || '';
          const includes = getAnimationIncludesForPath(previousPath);
          setAnimationIncludesForPath(real_path, includes);

          if (real_path !== previousPath && previousPath) {
            animationIncludesByPath.delete(previousPath);
          }

          animation.path = real_path;
          animation.saved = true;
          animation.saved_name = animation.name;
        });
        return;
      }

      let content = compileSingleFile();
      const existing = _readExistingAnimationFile(animation.path);

      if (existing) {
        const fresh = content.animations[animation.name];
        content = existing;

        if (animation.saved_name && animation.saved_name !== animation.name) {
          delete content.animations[animation.saved_name];
        }

        content.animations[animation.name] = fresh;
        applyAnimationIncludes(content, getAnimationIncludesForPath(animation.path));

        const fileKeys = Object.keys(content.animations);
        const projectKeys = Animation.all
          .filter(a => a.path === animation.path)
          .map(a => a.name);

        let changed = false;
        let cursor = 0;

        for (const key of projectKeys) {
          const at = fileKeys.indexOf(key);
          if (at === -1) continue;

          if (at < cursor) {
            fileKeys.splice(at, 1);
            fileKeys.splice(cursor, 0, key);
            changed = true;
          } else {
            cursor = at;
          }
        }

        if (changed) {
          const sorted = {};
          fileKeys.forEach(k => {
            sorted[k] = content.animations[k];
          });
          content.animations = sorted;
        }
      }

      Blockbench.writeFile(animation.path, {
        content: serializeAnimationJson(content),
      }, (real_path) => {
        animation.saved = true;
        animation.saved_name = animation.name;
        animation.path = real_path;
      });
    },

    /**
     * Export all animations that share the given path.
     */
    exportFile(path, save_as) {
      const filterPath = path || '';
      const animations = Animation.all.filter(a => (a.path || '') === filterPath);

      if (!save_as && isApp && path && _fs && _fs.existsSync(path)) {
        animations.forEach(a => {
          if (!a.saved) a.save();
        });
        return;
      }

      const content = serializeAnimationJson(this.compileFile(animations));

      Blockbench.export({
        resource_id: 'azure_animation',
        type: 'AzureLib Animation',
        extensions: ['json'],
        name: (Project?.geometry_name || Project?.name || 'animation') + '.animation',
        startpath: path,
        content,
      }, (real_path) => {
        const previousPath = filterPath || '';
        const includes = getAnimationIncludesForPath(previousPath);
        setAnimationIncludesForPath(real_path, includes);

        if (real_path !== previousPath && previousPath) {
          animationIncludesByPath.delete(previousPath);
        }

        animations.forEach(a => {
          a.path = real_path;
          a.saved = true;
          a.saved_name = a.name;
        });
      });
    },

    deleteAnimationFromFile(animation) {
      if (!_fs || !animation.path) return;

      const existing = _readExistingAnimationFile(animation.path);
      if (!existing || !existing.animations?.[animation.name]) return;

      delete existing.animations[animation.name];
      applyAnimationIncludes(existing, getAnimationIncludesForPath(animation.path));

      Blockbench.writeFile(animation.path, {
        content: serializeAnimationJson(existing),
      });
    },
  });

  return azureAnimationCodec;
}

// ---------------------------------------------------------------------------
// Legacy export wrappers — keep external callers working.
// ---------------------------------------------------------------------------

function exportAzureAnimation() {
  const codec = createAzureAnimationCodec();
  if (!codec?.exportFile) return;

  const anyPath = Animation.all.find(a => a.path)?.path || '';
  codec.exportFile(anyPath, true);
}

function importAzureAnimation() {
  const codec = createAzureAnimationCodec();
  codec?.pickFile?.();
}

// ---------------------------------------------------------------------------
// "Export" menu override
// ---------------------------------------------------------------------------

/**
 * Blockbench's built-in "Export" action (id: export_animation_file, defined
 * in animations/animation.js) is core code we can't edit. It calls
 * codec.compileFile(animations) — our own, correctly time-sorted and
 * KEY_ORDER-tagged builder — but then stringifies the result with its own
 * autoStringify(), which knows nothing about our KEY_ORDER tagging. Plain
 * JS object enumeration (which autoStringify ultimately relies on) always
 * places integer-index-looking string keys ("0", "1", "2") ahead of
 * non-integer ones ("0.125", "0.375") in ascending numeric order,
 * regardless of insertion order — so fractional keyframe times get
 * silently reordered on export, even though compileFile() built them in
 * the right order to begin with.
 *
 * "Save All Animations" never hits this because it calls codec.exportFile()
 * directly, which already runs content through our own
 * serializeAnimationJson() (which does respect KEY_ORDER via
 * orderedStringify()).
 *
 * We can't change what autoStringify does, and we can't edit the core
 * action. So when our format is active, we swap the action's click handler
 * for a re-implementation of the exact same picker dialog that serializes
 * with serializeAnimationJson() instead. Any other format's Export click
 * falls straight through to the original, untouched.
 */
let originalExportAnimationClick = null;

function isAzureCodecActive() {
  const codec = (typeof AnimationCodec !== 'undefined' && AnimationCodec.getCodec)
    ? AnimationCodec.getCodec()
    : null;
  return !!codec && codec === azureAnimationCodec;
}

function showAzureAnimationExportDialog() {
  const form = {};
  let keys = [];
  let animations = Animation.all.slice();

  if (Condition(Animation.properties.path.condition)) {
    animations.sort((a1, a2) => (a1.path ?? a1.name).hashCode() - (a2.path ?? a2.name).hashCode());
  }

  animations.forEach(animation => {
    const key = animation.name;
    keys.push(key);
    form[key.hashCode()] = { label: key, type: 'checkbox', value: true };
  });

  const dialog = new Dialog({
    id: 'azl_animation_export',
    title: 'dialog.animation_export.title',
    form,
    onConfirm(form_result) {
      dialog.hide();
      const selectedKeys = keys.filter(key => form_result[key.hashCode()]);
      const selectedAnimations = Animation.all.filter(a => selectedKeys.includes(a.name));
      const codec = azureAnimationCodec || AnimationCodec.getCodec() || AnimationCodec.codecs.bedrock;
      const content = codec.compileFile(selectedAnimations);

      Blockbench.export({
        resource_id: 'animation',
        type: 'JSON Animation',
        extensions: ['json'],
        name: (Project.geometry_name || 'model') + '.animation',
        content: serializeAnimationJson(content),
      });
    },
  });

  form.select_all_none = {
    type: 'buttons',
    buttons: ['generic.select_all', 'generic.select_none'],
    click(index) {
      const values = {};
      keys.forEach(key => { values[key.hashCode()] = (index === 0); });
      dialog.setFormValues(values);
    },
  };

  dialog.show();
}

function patchExportAnimationAction() {
  if (originalExportAnimationClick) return;
  const action = typeof BarItems !== 'undefined' ? BarItems.export_animation_file : null;
  if (!action) return;

  originalExportAnimationClick = action.click;

  action.click = function azureExportAnimationOverride(...args) {
    if (!isAzureCodecActive()) {
      return originalExportAnimationClick.apply(this, args);
    }
    showAzureAnimationExportDialog();
  };
}

function unpatchExportAnimationAction() {
  const action = typeof BarItems !== 'undefined' ? BarItems.export_animation_file : null;
  if (action && originalExportAnimationClick) {
    action.click = originalExportAnimationClick;
  }
  originalExportAnimationClick = null;
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

let editAnimationIncludesAction = null;

function registerAzureAnimationFormat() {

  const codec = createAzureAnimationCodec();
  if (!codec) {
    console.warn(
      '[AzureLib] AnimationCodec API is unavailable in this Blockbench version. ' +
      'Animation import/export will not work. Please update Blockbench.'
    );
    return;
  }

  patchExportAnimationAction();
  registerPlayBehaviors();

  if (!editAnimationIncludesAction) {
    editAnimationIncludesAction = new Action('azl_edit_animation_includes', {
      name: 'Edit Animation Includes',
      description: 'Edit AzureLib animation include entries for the current animation file',
      icon: 'playlist_add',
      category: 'animation',
      condition: () => Format?.id === 'azure_model' && Animator.open,
      click: () => showAnimationIncludesDialog(),
    });

    try {
      MenuBar.menus?.animation?.addAction(editAnimationIncludesAction);
    } catch (_) {}
  }

  if (!Formats?.azure_animation) {
    Formats.azure_animation = {
      id: AZURE_ANIM_FORMAT_ID,
      name: 'Azure Animation',
      animation_codec: codec,
    };
  }

  console.log('[AzureLib] Azure animation codec registered');
}

function unregisterAzureAnimationFormat() {

  unpatchExportAnimationAction();
  unregisterPlayBehaviors();

  editAnimationIncludesAction?.delete();
  editAnimationIncludesAction = null;

  try {
    delete Formats?.azure_animation;
  } catch {}

  if (azureAnimationCodec && AnimationCodec?.codecs) {
    delete AnimationCodec.codecs[AZURE_ANIM_FORMAT_ID];
  }

  azureAnimationCodec = null;
  console.log('[AzureLib] Azure animation codec unregistered');
}
;// ./core/azure-codec.js
/**
 * AzureLib Animator — Codec & Format Registration
 * -----------------------------------------------
 * Defines the Blockbench model format for AzureLib (.geo / .animation)
 * and handles project load, save, and import/export utilities.
 *
 * Animation handling is fully owned by azure-animation-tab.js.
 * The animation codec is now created lazily at runtime so validation
 * does not execute AnimationCodec construction during module evaluation.
 *
 * © 2026 AzureDoom — MIT License
 */








const azure_codec_invertMolang = globalThis.invertMolang || invertMolang;
const OFFSET_Y = 8.0; // BB changed how it's grid is centered in like 4.8 so this is needed.

let hasNotifiedConversion = false;
let azureCodecRegistered = false;
let format = null;

function getBedrockCodec() {
  return globalThis.Codecs?.bedrock || null;
}

function getProjectCodec() {
  return globalThis.Codecs?.project || null;
}

function ensureAzureFormat() {
  if (format) return format;

  if (typeof ModelFormat === 'undefined' || !globalThis.Codecs?.project) {
    console.warn('[AzureLib] ModelFormat or Codecs.project unavailable');
    return null;
  }

  format = new ModelFormat({
    id: 'azure_model',
    name: 'AzureLib Animated Model',
    category: 'minecraft',
    description: 'Animated model for Java mods using AzureLib.',
    icon: 'view_in_ar',
    rotate_cubes: true,
    box_uv: true,
    optional_box_uv: true,
    single_texture: false,
    bone_rig: true,
    centered_grid: true,
    animated_textures: true,
    select_texture_for_particles: true,
    animation_mode: true,
    animation_files: true,
    animation_codec: undefined,
    locators: true,
    codec: getProjectCodec(),
    display_mode: true,
    onActivation() {},
  });

  return format;
}

function getAzureFormat() {
  return format;
}

// ---------------------------------------------------------------------------
// Lifecycle registration
// ---------------------------------------------------------------------------

function registerAzureCodec() {
  if (azureCodecRegistered) return;
  azureCodecRegistered = true;

  const projectCodec = globalThis.Codecs?.project;
  const bedrockCodec = globalThis.Codecs?.bedrock;
  const azureFormat = ensureAzureFormat();

  if (!projectCodec || !bedrockCodec || !azureFormat) {
    console.warn('[AzureLib] Required codec APIs are unavailable');
    return;
  }

  projectCodec.on('compile', handleProjectCompile);
  projectCodec.on('parse', handleProjectParse);
  bedrockCodec.on('compile', handleBedrockCompile);

  registerAzureAnimationFormat();
  azureFormat.animation_codec = createAzureAnimationCodec() || undefined;

  registerKeyframeOverrides();
  initializeAnimationUI();

  Blockbench.on('close_project', resetDefaults);
  Blockbench.on('new_project', resetDefaults);

  console.log('[AzureLib] Azure codec registered (AnimationCodec-backed)');
}

function unregisterAzureCodec() {
  if (!azureCodecRegistered) return;
  azureCodecRegistered = false;

  const projectCodec = globalThis.Codecs?.project;
  const bedrockCodec = globalThis.Codecs?.bedrock;

  projectCodec?.events?.compile?.remove?.(handleProjectCompile);
  projectCodec?.events?.parse?.remove?.(handleProjectParse);
  bedrockCodec?.events?.compile?.remove?.(handleBedrockCompile);

  unloadAnimationUI();
  unregisterKeyframeOverrides();
  unregisterAzureAnimationFormat();

  if (format) {
    format.animation_codec = undefined;
  }

  console.log('[AzureLib] Azure codec unregistered');
}

function resetDefaults() {
  Object.assign(azure_settings, DEFAULT_CONFIG);
  hasNotifiedConversion = false;
  console.log('[AzureLib] Settings reset to defaults');
}

// ---------------------------------------------------------------------------
// Project compile/parse hooks
// ---------------------------------------------------------------------------

function handleProjectCompile(event) {
  if (Format?.id !== 'azure_model') return;

  if (azure_settings.objectType === 'AZURE_ITEM_BLOCK') {
    azure_settings.objectType = 'AZURE_ENTITY';
    azure_settings.entityType = 'Entity/Block/Item';
  }

  event.model.azurelibSettings = azure_settings;
}

function handleProjectParse(event) {
  const model = event.model || {};
  const formatId = model?.meta?.model_format || model?.model_format;
  if (formatId !== 'azure_model') return;

  const settings = model.azurelibSettings;
  if (settings && typeof settings === 'object') {
    const wasDeprecated = settings.objectType === 'AZURE_ITEM_BLOCK';
    Object.assign(azure_settings, omit_default()(settings, ['formatVersion']));

    if (wasDeprecated) {
      azure_settings.objectType = 'AZURE_ENTITY';
      azure_settings.entityType = 'Entity/Block/Item';
      console.warn('[AzureLib] Converted deprecated AZURE_ITEM_BLOCK -> AZURE_ENTITY');
    }

    onSettingsChanged();

    if (wasDeprecated && !hasNotifiedConversion) {
      hasNotifiedConversion = true;
      Blockbench.showMessageBox({
        title: 'AzureLib Conversion',
        message:
          'This project used an older "Block/Item" type.\n\nIt has been updated to the unified "Entity/Block/Item" type (AZURE_ENTITY).',
        buttons: ['OK'],
      });
    }
  } else if (formatId === 'azure_model' && !model.azurelibSettings) {
    console.debug('[AzureLib] Azure model detected but no settings loaded yet.');
  }

  if (Blockbench.isNewerThan('4.99') && model.animations) {
    console.log('[AzureLib] Applying legacy animation inversion fix for Blockbench 5.0+');
    for (const [, anim] of Object.entries(model.animations)) {
      for (const bone of Object.values(anim.bones || {})) {
        for (const [channel, frames] of Object.entries(bone)) {
          if (channel === 'rotation' || channel === 'position') {
            for (const kf of Object.values(frames)) {
              if (kf?.vector) {
                if (channel === 'rotation') {
                  kf.vector[0] = azure_codec_invertMolang(kf.vector[0]);
                  kf.vector[1] = azure_codec_invertMolang(kf.vector[1]);
                } else if (channel === 'position') {
                  kf.vector[0] = azure_codec_invertMolang(kf.vector[0]);
                }
              }
            }
          }
        }
      }
    }
  }
}

function handleBedrockCompile(event) {
  if (Format?.id !== 'azure_model') return;

  const geometry = event.model?.['minecraft:geometry'];
  if (geometry) {
    geometry.forEach(geo => {
      delete geo.item_display_transforms;
    });
  }
}

// ---------------------------------------------------------------------------
// Export helpers
// ---------------------------------------------------------------------------

function maybeExportItemJson(options = {}, as) {
  const should = (key, fallback) => (options[key] === undefined ? fallback : options[key]);
  const model = {};
  const bedrockCodec = getBedrockCodec();

  if (should('comment', settings.credit.value)) model.credit = settings.credit.value;
  model.parent = 'builtin/entity';

  if (should('ambientocclusion', Project.ambientocclusion === false)) model.ambientocclusion = false;
  if (Project.texture_width !== 16 || Project.texture_height !== 16) {
    model.texture_size = [Project.texture_width, Project.texture_height];
  }
  if (should('front_gui_light', Project.front_gui_light)) model.gui_light = 'front';
  if (should('overrides', Project.overrides)) model.overrides = Project.overrides;

  if (should('display', Object.keys(Project.display_settings).length >= 1)) {
    const display = {};
    for (const key in DisplayMode.slots) {
      const slot = DisplayMode.slots[key];
      if (DisplayMode.slots.hasOwnProperty(key) && Project.display_settings[slot]?.export) {
        display[slot] = Project.display_settings[slot].export();
      }
    }
    if (Object.keys(display).length) {
      model.display = display;
      for (const [, data] of Object.entries(display)) {
        if (Array.isArray(data?.translation)) {
          data.translation = [
            data.translation[0],
            Math.round((Number(data.translation[1] || 0) - OFFSET_Y) * 100) / 100,
            data.translation[2],
          ];
        }
      }
    }
  }

  if (Project.textures && should('textures', Object.keys(Project.textures).length >= 1)) {
    for (const tex of Object.values(Project.textures)) {
      if (tex.particle || Object.keys(Project.textures).length === 1) {
        const name = tex.name.replace('.png', '');
        if (/^[-._a-z0-9/]+$/.test(name)) {
          model.textures = { particle: name };
          break;
        }
      }
    }
  }

  const jsonStr = JSON.stringify(model, null, 2);
  const path = azure_settings.itemModelPath;

  Blockbench.export({
    resource_id: 'model',
    type: Codecs.java_block.name,
    extensions: ['json'],
    name: (bedrockCodec?.fileName?.() || 'model.geo').replace('.geo', '.item'),
    startpath: path,
    content: jsonStr,
  }, realPath => {
    azure_settings.itemModelPath = realPath;
  });

  return this;
}

function maybeImportItemJson() {
  Blockbench.import({
    resource_id: 'model',
    type: 'json',
    extensions: ['json'],
    readtype: 'text',
    multiple: false,
  }, files => {
    if (!files?.[0]) return;

    let json;
    try {
      json = JSON.parse(files[0].content);
    } catch {
      return Blockbench.showQuickMessage('[AzureLib] Invalid JSON file.');
    }

    if (json.parent !== 'builtin/entity' || typeof json.display !== 'object') {
      return Blockbench.showQuickMessage('[AzureLib] Not a valid AzureLib display file.');
    }

    Project.display_settings = {};

    for (const [slot, data] of Object.entries(json.display)) {
      if (!DisplayMode.slots.includes(slot)) continue;

      const rotation = Array.isArray(data.rotation) ? data.rotation.slice() : [0, 0, 0];
      const translation = Array.isArray(data.translation) ? data.translation.slice() : [0, 0, 0];
      const scale = Array.isArray(data.scale) ? data.scale.slice() : [1, 1, 1];

      translation[1] = Math.round((Number(translation[1] || 0) + OFFSET_Y) * 100) / 100;

      const slotObj = new DisplaySlot(slot);
      Object.assign(slotObj, { rotation, translation, scale });
      Project.display_settings[slot] = slotObj;
    }

    Project.saved = false;
    DisplayMode.vue.$forceUpdate();
    DisplayMode.updateDisplayBase();
    Blockbench.showQuickMessage('[AzureLib] Display settings imported.');
  });
}

/* harmony default export */ const azure_codec = (getBedrockCodec());
;// ./rig/azure-rig-state.js
/**
 * AzureLib Animator — Rig Definitions
 * ------------------------------------
 * Project-persisted definitions for AzureLib's runtime rig features:
 * bone hitboxes, bone sockets, IK chains, look-at chains, bone constraints,
 * spring bones and blend spaces.
 *
 * © 2026 AzureDoom — MIT License
 */

const RIG_VERSION = 1;

const HITBOX_ROLES = ['COMBAT', 'INTERACT', 'ANCHOR'];

const IK_TARGETS = {
  bone: 'Animated bone',
  ground: 'Ground (foot placement)',
  entity_eyes: 'Another entity\'s eyes',
  world: 'World position (code)',
  model: 'Fixed model point',
};

const IK_SOLVERS = {
  auto: 'Auto (two-bone for 2–3 bones, else CCD)',
  two_bone: 'Two-bone',
  ccd: 'CCD',
};

const CONSTRAINT_TYPES = {
  limit: 'Limit (all axes)',
  hinge_x: 'Hinge X',
  hinge_y: 'Hinge Y',
  hinge_z: 'Hinge Z',
};

/** A fresh, empty rig. */
function emptyRig() {
  return {
    version: RIG_VERSION,
    codegen: { target: 'v1_21_1', entityClass: 'ExampleEntity', packageRoot: '' },
    hitboxOptions: { keepEntityBox: false, clientOnly: false },
    hitboxes: [],
    sockets: [],
    ikChains: [],
    lookAts: [],
    constraints: [],
    springBones: [],
    colliders: [],
    blendSpaces: [],
  };
}

function newHitbox(bone) {
  return {
    name: bone,
    bone,
    role: 'COMBAT',
    fit: true,
    size: [4, 4, 4],
    offset: [0, 0, 0],
    inflate: 0,
    anchorAtPivot: false,
    damageMultiplier: 1,
    tags: [],
  };
}

function newSocket(name, { bone = null, locator = null } = {}) {
  return {
    name,
    bone,
    locator,
    offset: [0, 0, 0],
    rotation: [0, 0, 0],
    serverHitbox: '',
  };
}

function newIkChain(id, bones) {
  return {
    id,
    bones,
    effector: [0, 0, 0],
    solver: 'auto',
    pole: null,
    iterations: 10,
    tolerance: 0.1,
    target: { type: 'ground', stepUp: 0.5, stepDown: 0.75, point: [0, 0, 0], bone: '' },
    priority: 50,
    weight: 1,
    preview: { enabled: true, mode: 'ground', groundHeight: 0, locator: '', point: [0, 0, -16] },
  };
}

function newLookAt(id, bones) {
  return {
    id,
    bones,
    forward: [0, 0, -1],
    target: { type: 'entity_eyes', point: [0, 0, 0], bone: '' },
    priority: 40,
    weight: 1,
    preview: { enabled: true, mode: 'point', locator: '', point: [0, 24, -32] },
  };
}

function newConstraint(bone) {
  return {
    bone,
    type: 'limit',
    min: [-45, -45, -45],
    max: [45, 45, 45],
    standalone: false,
  };
}

function newSpringBone(id, bones) {
  return {
    id,
    bones,
    tip: null,
    stiffness: 0.2,
    damping: 0.25,
    gravity: 0,
    inertia: 1,
    priority: 200,
    colliders: [],
    radius: 0,
    ground: false,
    preview: { enabled: true },
  };
}

/** A spring collider; positions are pixels from the bone's pivot along its axes, as for sockets. */
function newCollider(id, bone) {
  return {
    id,
    bone,
    shape: 'sphere',
    start: [0, 0, 0],
    end: [0, 0, 0],
    radius: 2,
  };
}

function newBlendSpace(name) {
  return {
    name,
    dimensions: 1,
    input: { x: 'speed', y: 'forward' },
    samples: [],
    smoothing: 0,
    syncPhase: true,
  };
}

const listeners = new Set();

const RigStore = {
  rig: emptyRig(),

  onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  notify() {
    for (const fn of listeners) {
      try { fn(this.rig); } catch (e) { console.error('[AzureLib Rig] listener failed', e); }
    }
  },

  set(rig) {
    this.rig = normalizeRig(rig);
    this.notify();
  },

  reset() {
    this.set(emptyRig());
  },

  snapshot() {
    return JSON.parse(JSON.stringify(this.rig));
  },

  edit(name, mutate) {
    const before = this.snapshot();
    mutate(this.rig);
    const after = this.snapshot();

    if (JSON.stringify(before) === JSON.stringify(after)) return;

    try {
      Undo.initEdit({});
      Undo.finishEdit(`AzureLib Rig: ${name}`);
      const entry = Undo.history?.[Undo.index - 1];
      if (entry) undoSnapshots.set(entry, { before, after });
    } catch (e) {
      console.warn('[AzureLib Rig] Could not record undo step', e);
    }

    if (typeof Project !== 'undefined' && Project) Project.saved = false;
    this.notify();
  },
};

// ---------------------------------------------------------------------------
// Normalisation: tolerate older or hand-edited data
// ---------------------------------------------------------------------------

function vec3(value, fallback) {
  if (!Array.isArray(value) || value.length < 3) return fallback.slice();
  return [0, 1, 2].map(i => (Number.isFinite(Number(value[i])) ? Number(value[i]) : fallback[i]));
}

function list(value) {
  return Array.isArray(value) ? value.filter(v => v && typeof v === 'object') : [];
}

function normalizeRig(raw) {
  const base = emptyRig();
  if (!raw || typeof raw !== 'object') return base;

  base.codegen = { ...base.codegen, ...(raw.codegen || {}) };
  if (base.codegen.target === 'modern') base.codegen.target = 'v1_21_1';
  base.hitboxOptions = { ...base.hitboxOptions, ...(raw.hitboxOptions || {}) };

  base.hitboxes = list(raw.hitboxes).map(h => ({
    ...newHitbox(h.bone || ''),
    ...h,
    size: vec3(h.size, [4, 4, 4]),
    offset: vec3(h.offset, [0, 0, 0]),
    tags: Array.isArray(h.tags) ? h.tags.map(String) : [],
    role: HITBOX_ROLES.includes(h.role) ? h.role : 'COMBAT',
  }));

  base.sockets = list(raw.sockets).map(s => ({
    ...newSocket(s.name || 'socket'),
    ...s,
    offset: vec3(s.offset, [0, 0, 0]),
    rotation: vec3(s.rotation, [0, 0, 0]),
  }));

  base.ikChains = list(raw.ikChains).map(c => {
    const d = newIkChain(c.id || 'ik', Array.isArray(c.bones) ? c.bones : []);
    return {
      ...d,
      ...c,
      effector: vec3(c.effector, [0, 0, 0]),
      pole: Array.isArray(c.pole) ? vec3(c.pole, [0, 0, 0]) : null,
      target: { ...d.target, ...(c.target || {}), point: vec3(c.target?.point, [0, 0, 0]) },
      preview: { ...d.preview, ...(c.preview || {}), point: vec3(c.preview?.point, d.preview.point) },
    };
  });

  base.lookAts = list(raw.lookAts).map(l => {
    const d = newLookAt(l.id || 'look', Array.isArray(l.bones) ? l.bones : []);
    return {
      ...d,
      ...l,
      forward: vec3(l.forward, [0, 0, -1]),
      target: { ...d.target, ...(l.target || {}), point: vec3(l.target?.point, [0, 0, 0]) },
      preview: { ...d.preview, ...(l.preview || {}), point: vec3(l.preview?.point, d.preview.point) },
    };
  });

  base.constraints = list(raw.constraints).map(c => ({
    ...newConstraint(c.bone || ''),
    ...c,
    min: vec3(c.min, [-45, -45, -45]),
    max: vec3(c.max, [45, 45, 45]),
  }));

  base.springBones = list(raw.springBones).map(s => {
    const d = newSpringBone(s.id || 'spring', Array.isArray(s.bones) ? s.bones : []);
    return {
      ...d,
      ...s,
      tip: Array.isArray(s.tip) ? vec3(s.tip, [0, 0, 0]) : null,
      colliders: Array.isArray(s.colliders) ? s.colliders.map(String) : [],
      radius: Math.max(0, Number(s.radius) || 0),
      ground: !!s.ground,
      preview: { ...d.preview, ...(s.preview || {}) },
    };
  });

  base.colliders = list(raw.colliders).map(c => ({
    ...newCollider(c.id || 'collider', c.bone || ''),
    ...c,
    shape: c.shape === 'capsule' ? 'capsule' : 'sphere',
    start: vec3(c.start, [0, 0, 0]),
    end: vec3(c.end, [0, 0, 0]),
    radius: Number(c.radius) > 0 ? Number(c.radius) : 2,
  }));

  base.blendSpaces = list(raw.blendSpaces).map(b => ({
    ...newBlendSpace(b.name || 'blend'),
    ...b,
    input: { x: 'speed', y: 'forward', ...(b.input || {}) },
    samples: list(b.samples).map(s => ({
      x: Number(s.x) || 0,
      y: Number(s.y) || 0,
      animation: String(s.animation || ''),
    })),
  }));

  return base;
}

function boneNames() {
  return (typeof Group !== 'undefined' ? Group.all : []).map(g => g.name);
}

function locatorNames() {
  return (typeof Locator !== 'undefined' ? Locator.all : []).map(l => l.name);
}

function findBone(name) {
  return (typeof Group !== 'undefined' ? Group.all : []).find(g => g.name === name) || null;
}

function isDescendant(child, ancestor) {
  for (let node = child?.parent; node && node !== 'root'; node = node.parent) {
    if (node === ancestor) return true;
  }
  return false;
}

function validateRig(rig = RigStore.rig) {
  const issues = [];
  const bones = new Set(boneNames());
  const locators = new Set(locatorNames());

  const checkChain = (kind, id, names) => {
    if (!names.length) {
      issues.push(`${kind} "${id}" has no bones.`);
      return;
    }
    for (const n of names) {
      if (!bones.has(n)) issues.push(`${kind} "${id}": bone "${n}" doesn't exist.`);
    }
    for (let i = 1; i < names.length; i++) {
      const parent = findBone(names[i - 1]);
      const child = findBone(names[i]);
      if (parent && child && !isDescendant(child, parent)) {
        issues.push(`${kind} "${id}": "${names[i]}" isn't under "${names[i - 1]}"; list bones root first, each inside the one before.`);
      }
    }
  };

  const seenHitboxes = new Set();
  for (const h of rig.hitboxes) {
    if (!bones.has(h.bone)) issues.push(`Hitbox "${h.name}": bone "${h.bone}" doesn't exist.`);
    if (seenHitboxes.has(h.name)) issues.push(`Hitbox name "${h.name}" is used twice.`);
    seenHitboxes.add(h.name);
    if (!h.fit && h.size.every(v => !v) && !h.inflate) issues.push(`Hitbox "${h.name}" has no size.`);
    if (h.fit) {
      const bone = findBone(h.bone);
      const hasCubes = bone?.children?.some(c => typeof Cube !== 'undefined' && c instanceof Cube);
      if (bone && !hasCubes) issues.push(`Hitbox "${h.name}" fits bone "${h.bone}", which has no cubes of its own; give it a size.`);
    }
  }

  const seenSockets = new Set();
  for (const s of rig.sockets) {
    if (seenSockets.has(s.name)) issues.push(`Socket name "${s.name}" is used twice.`);
    seenSockets.add(s.name);
    if (s.locator && !locators.has(s.locator)) issues.push(`Socket "${s.name}": locator "${s.locator}" doesn't exist.`);
    if (!s.locator && !bones.has(s.bone)) issues.push(`Socket "${s.name}": bone "${s.bone}" doesn't exist.`);
    if (s.serverHitbox && s.locator) issues.push(`Socket "${s.name}" follows a locator, so its server hitbox must be added by hand (toAnchorHitbox() only works for bone sockets).`);
  }

  const locatorCounts = {};
  for (const l of locatorNames()) locatorCounts[l] = (locatorCounts[l] || 0) + 1;
  for (const [name, count] of Object.entries(locatorCounts)) {
    if (count > 1) issues.push(`Locator name "${name}" is used ${count} times; AzureLib resolves the first one it finds.`);
  }

  const checkBoneTarget = (kind, id, target, chainBones) => {
    if (target?.type !== 'bone') return;
    if (!target.bone) {
      issues.push(`${kind} "${id}": pick the bone to follow.`);
      return;
    }
    if (!bones.has(target.bone)) {
      issues.push(`${kind} "${id}": target bone "${target.bone}" doesn't exist.`);
      return;
    }
    const targetBone = findBone(target.bone);
    const driven = chainBones.map(findBone).filter(Boolean);
    if (chainBones.includes(target.bone) || driven.some(b => isDescendant(targetBone, b))) {
      issues.push(`${kind} "${id}": target bone "${target.bone}" is part of the chain it drives; move it under a bone outside the chain.`);
    }
  };

  for (const c of rig.ikChains) {
    checkChain('IK chain', c.id, c.bones);
    checkBoneTarget('IK chain', c.id, c.target, c.bones);
    const solver = c.solver === 'auto' ? (c.bones.length === 2 || c.bones.length === 3 ? 'two_bone' : 'ccd') : c.solver;
    if (solver === 'two_bone' && c.bones.length < 2) issues.push(`IK chain "${c.id}": the two-bone solver needs at least 2 bones.`);
  }
  for (const l of rig.lookAts) {
    checkChain('Look-at', l.id, l.bones);
    checkBoneTarget('Look-at', l.id, l.target, l.bones);
  }
  for (const s of rig.springBones) checkChain('Spring bone', s.id, s.bones);

  for (const c of rig.constraints) {
    if (!bones.has(c.bone)) issues.push(`Constraint on "${c.bone}": bone doesn't exist.`);
  }

  const colliderIds = new Set();
  for (const c of rig.colliders || []) {
    if (colliderIds.has(c.id)) issues.push(`Collider id "${c.id}" is used twice.`);
    colliderIds.add(c.id);
    if (!bones.has(c.bone)) issues.push(`Collider "${c.id}": bone "${c.bone}" doesn't exist.`);
    if (!(Number(c.radius) > 0)) issues.push(`Collider "${c.id}" needs a radius above 0.`);
  }
  for (const s of rig.springBones) {
    for (const id of s.colliders || []) {
      if (!colliderIds.has(id)) issues.push(`Spring bone "${s.id}": collider "${id}" doesn't exist.`);
    }
    for (const id of s.colliders || []) {
      const c = (rig.colliders || []).find(x => x.id === id);
      if (c && s.bones.includes(c.bone)) issues.push(`Spring bone "${s.id}": collider "${id}" is on one of its own bones, so the chain would always be pushed by itself.`);
    }
  }

  const animations = new Set((typeof Animation !== 'undefined' ? Animation.all : []).map(a => a.name));
  for (const b of rig.blendSpaces) {
    if (b.samples.length < 2) issues.push(`Blend space "${b.name}" needs at least 2 samples.`);
    for (const s of b.samples) {
      if (!animations.has(s.animation)) issues.push(`Blend space "${b.name}": animation "${s.animation}" doesn't exist in this project.`);
    }
  }

  const ids = {};
  for (const x of [...rig.ikChains, ...rig.lookAts, ...rig.springBones]) ids[x.id] = (ids[x.id] || 0) + 1;
  if (rig.constraints.some(c => c.standalone)) ids.bone_limits = (ids.bone_limits || 0) + 1;
  for (const [id, n] of Object.entries(ids)) {
    if (n > 1) issues.push(`Pose modifier id "${id}" is used ${n} times; AzureLib requires unique ids.`);
  }

  return issues;
}

const undoSnapshots = new WeakMap();
let handlers = null;

function registerRigState() {
  if (handlers) return;

  handlers = {
    compile: event => {
      if (Format?.id !== 'azure_model') return;
      event.model.azurelibRig = RigStore.snapshot();
    },
    parsed: event => {
      const model = event?.model || {};
      RigStore.set(model.azurelibRig || emptyRig());
    },
    reset: () => RigStore.reset(),
    undo: event => {
      const snap = undoSnapshots.get(event?.entry);
      if (snap) RigStore.set(snap.before);
    },
    redo: event => {
      const snap = undoSnapshots.get(event?.entry);
      if (snap) RigStore.set(snap.after);
    },
    select: event => {
      // Switching tabs: the store mirrors the selected project's rig.
      const project = event?.project || Project;
      RigStore.set(project?.azurelibRig || emptyRig());
    },
    unselect: event => {
      const project = event?.project || Project;
      if (project) project.azurelibRig = RigStore.snapshot();
    },
  };

  Codecs.project.on('compile', handlers.compile);
  Codecs.project.on('parsed', handlers.parsed);
  Blockbench.on('new_project', handlers.reset);
  Blockbench.on('undo', handlers.undo);
  Blockbench.on('redo', handlers.redo);
  Blockbench.on('unselect_project', handlers.unselect);
  Blockbench.on('select_project', handlers.select);
}

function unregisterRigState() {
  if (!handlers) return;
  Codecs.project.events?.compile?.remove?.(handlers.compile);
  Codecs.project.events?.parsed?.remove?.(handlers.parsed);
  Blockbench.removeListener('new_project', handlers.reset);
  Blockbench.removeListener('undo', handlers.undo);
  Blockbench.removeListener('redo', handlers.redo);
  Blockbench.removeListener('unselect_project', handlers.unselect);
  Blockbench.removeListener('select_project', handlers.select);
  handlers = null;
}

;// ./rig/azure-rig-math.js
/**
 * AzureLib Animator — Rig Math
 * -----------------------------
 * Ports of AzureLib's runtime weight math (AzBlendWeights), so blend-space
 * previews in Blockbench mix animations with exactly the weights the game will.
 *
 * © 2026 AzureDoom — MIT License
 */

/**
 * 1D weights: the input is clamped to the samples' range and split linearly
 * between the two samples around it. Positions must be ascending.
 */
function linearWeights(positions, input) {
  const n = positions.length;
  const dest = new Array(n).fill(0);

  if (n === 0) return dest;

  if (n === 1 || input <= positions[0]) {
    dest[0] = 1;
    return dest;
  }

  if (input >= positions[n - 1]) {
    dest[n - 1] = 1;
    return dest;
  }

  for (let i = 0; i < n - 1; i++) {
    const from = positions[i];
    const to = positions[i + 1];

    if (input <= to) {
      const span = to - from;
      const t = span <= 0 ? 1 : (input - from) / span;
      dest[i] = 1 - t;
      dest[i + 1] = t;
      return dest;
    }
  }

  dest[n - 1] = 1;
  return dest;
}

/**
 * 2D weights by gradient band interpolation (freeform cartesian), as
 * AzBlendWeights.gradientBand: the input on a sample plays that sample alone.
 */
function gradientBandWeights(xs, ys, x, y) {
  const n = xs.length;
  const dest = new Array(n).fill(0);

  if (n === 0) return dest;

  let total = 0;

  for (let i = 0; i < n; i++) {
    let weight = 1;
    const px = x - xs[i];
    const py = y - ys[i];

    for (let j = 0; j < n && weight > 0; j++) {
      if (i === j) continue;

      const ex = xs[j] - xs[i];
      const ey = ys[j] - ys[i];
      const lengthSq = ex * ex + ey * ey;

      if (lengthSq <= 0) continue;

      const h = 1 - (px * ex + py * ey) / lengthSq;
      weight = Math.min(weight, Math.max(0, Math.min(1, h)));
    }

    dest[i] = weight;
    total += weight;
  }

  if (total > 0) {
    for (let i = 0; i < n; i++) dest[i] /= total;
    return dest;
  }

  let nearest = 0;
  let best = Infinity;

  for (let i = 0; i < n; i++) {
    const dx = x - xs[i];
    const dy = y - ys[i];
    const d = dx * dx + dy * dy;
    dest[i] = 0;

    if (d < best) {
      best = d;
      nearest = i;
    }
  }

  dest[nearest] = 1;
  return dest;
}

/**
 * Sample weights for a blend space definition at the given input, with the
 * samples in the same order as {@code blendSpace.samples}.
 */
function blendSpaceWeights(blendSpace, inputX, inputY = 0) {
  const samples = blendSpace.samples || [];

  if (blendSpace.dimensions === 2) {
    return gradientBandWeights(samples.map(s => s.x), samples.map(s => s.y), inputX, inputY);
  }

  // 1D: AzureLib sorts samples by position; weight in sorted order, then map back.
  const order = samples.map((s, i) => i).sort((a, b) => samples[a].x - samples[b].x);
  const sorted = linearWeights(order.map(i => samples[i].x), inputX);
  const weights = new Array(samples.length).fill(0);
  order.forEach((sampleIndex, sortedIndex) => { weights[sampleIndex] = sorted[sortedIndex]; });
  return weights;
}

/** The input range a blend space covers, for preview sliders. */
function blendSpaceRange(blendSpace) {
  const samples = blendSpace.samples || [];
  const range = (values) => {
    if (!values.length) return [0, 1];
    let min = Math.min(...values);
    let max = Math.max(...values);
    if (min === max) { min -= 1; max += 1; }
    return [min, max];
  };
  return { x: range(samples.map(s => s.x)), y: range(samples.map(s => s.y)) };
}

;// ./rig/azure-rig-preview.js
/**
 * AzureLib Animator — Rig Preview
 * --------------------------------
 * Shows AzureLib's runtime rig features in the Blockbench viewport:
 *
 *   • Hitboxes, fitted the way AzureLib fits them (the AABB of the bone's own
 *     cubes around its pivot, or an explicit size), coloured like F3 + B.
 *   • Sockets, as a forward arrow (the socket's -Z) and an up arrow.
 *   • Spring colliders, as orange wireframe spheres and capsules.
 *   • In Animate mode, the pose modifiers run on top of the animation every
 *     frame, in AzureLib's priority order, with the same solvers the game
 *     uses: two-bone and CCD IK, look-at, spring bones and constraints.
 *   • Blend spaces, by stacking their samples at AzureLib's weights (without
 *     touching the animations' own playing state or blend weights).
 *
 * The preview never writes keyframes or project data.
 *
 * © 2026 AzureDoom — MIT License
 */




const DEG = Math.PI / 180;
const TICKS_PER_SECOND = 20;
const PIXELS_PER_BLOCK = 16;

const COLOR_COMBAT = 0x55ff55;
const COLOR_STRONG = 0xff5555;
const COLOR_WEAK = 0x5599ff;
const COLOR_INTERACT = 0x55ffff;
const COLOR_ANCHOR = 0xffff55;
const COLOR_SOCKET = 0xff55ff;
const COLOR_SOCKET_UP = 0xaa66ff;
const COLOR_TARGET = 0xffaa00;
const COLOR_COLLIDER = 0xff8a3d;

/** Runtime-only preview switches (not saved with the project). */
const PreviewSettings = {
  hitboxes: true,
  sockets: true,
  colliders: true,
  modifiers: true,
};

function isActive() {
  return typeof Format !== 'undefined' && Format?.id === 'azure_model' && typeof Project !== 'undefined' && !!Project;
}

function azure_rig_preview_findBone(name) {
  return Group.all.find(g => g.name === name) || null;
}

function findLocator(name) {
  return (typeof Locator !== 'undefined' ? Locator.all : []).find(l => l.name === name) || null;
}

function boneMesh(name) {
  return azure_rig_preview_findBone(name)?.mesh || null;
}

function worldPosition(object, target = new THREE.Vector3()) {
  object.updateWorldMatrix(true, false);
  return target.setFromMatrixPosition(object.matrixWorld);
}

/** Model-space point (Blockbench pixels from the model origin) to world space. */
function modelToWorld(point) {
  const v = new THREE.Vector3(point[0], point[1], point[2]);
  const root = Project?.model_3d;
  if (root) {
    root.updateWorldMatrix(true, false);
    v.applyMatrix4(root.matrixWorld);
  }
  return v;
}

/** A Blockbench rotation in degrees as a quaternion, applied Z, then Y, then X like bone rotations. */
function bbRotation(degrees) {
  return new THREE.Quaternion().setFromEuler(
    new THREE.Euler(degrees[0] * DEG, degrees[1] * DEG, degrees[2] * DEG, 'ZYX'),
  );
}

const overlay = {
  root: null,
  hitboxes: [],
  sockets: [],
  colliders: [],
  dirty: true,
};

function ensureOverlayRoot() {
  if (overlay.root) return overlay.root;
  overlay.root = new THREE.Object3D();
  overlay.root.name = 'azurelib_rig_overlay';
  return overlay.root;
}

function attachOverlayRoot() {
  const root = ensureOverlayRoot();
  const scene = typeof Canvas !== 'undefined' ? Canvas.scene : null;
  if (scene && root.parent !== scene) scene.add(root);
}

function clearOverlay() {
  for (const item of [...overlay.hitboxes, ...overlay.sockets, ...overlay.colliders]) {
    item.object.parent?.remove(item.object);
    item.object.traverse(o => {
      o.geometry?.dispose?.();
      o.material?.dispose?.();
    });
  }
  overlay.hitboxes = [];
  overlay.sockets = [];
  overlay.colliders = [];
}

function hitboxColor(h) {
  if (h.role === 'INTERACT') return COLOR_INTERACT;
  if (h.role === 'ANCHOR') return COLOR_ANCHOR;
  if (h.damageMultiplier > 1) return COLOR_STRONG;
  if (h.damageMultiplier < 1) return COLOR_WEAK;
  return COLOR_COMBAT;
}

/**
 * The hitbox's box in bone space, like AzHitboxClientHooks#fitBoneSpaceBox:
 * bounds of the bone's own cubes around its pivot, explicit size centred on
 * the cubes (or the pivot with anchorAtPivot), plus offset and inflate.
 * Returns {center, half} in pixels, or null when the box would be empty.
 */
function hitboxBox(h) {
  const bone = azure_rig_preview_findBone(h.bone);
  const mesh = bone?.mesh;
  if (!mesh) return null;

  const bounds = new THREE.Box3();
  mesh.updateWorldMatrix(true, false);
  const toBone = new THREE.Matrix4().copy(mesh.matrixWorld).invert();

  for (const child of bone.children || []) {
    if (!(child instanceof Cube) || !child.mesh?.geometry) continue;
    const geometry = child.mesh.geometry;
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    child.mesh.updateWorldMatrix(true, false);
    const local = new THREE.Matrix4().multiplyMatrices(toBone, child.mesh.matrixWorld);
    const { min, max } = geometry.boundingBox;
    for (let i = 0; i < 8; i++) {
      bounds.expandByPoint(new THREE.Vector3(
        i & 1 ? max.x : min.x,
        i & 2 ? max.y : min.y,
        i & 4 ? max.z : min.z,
      ).applyMatrix4(local));
    }
  }

  const hasCubes = !bounds.isEmpty();
  const center = new THREE.Vector3();
  const half = new THREE.Vector3();

  if (hasCubes && !h.anchorAtPivot) bounds.getCenter(center);

  if (h.fit) {
    if (!hasCubes) return null;
    bounds.getSize(half).multiplyScalar(0.5);
  } else {
    half.set(h.size[0] / 2, h.size[1] / 2, h.size[2] / 2);
  }

  const inflate = Number(h.inflate) || 0;
  half.set(Math.max(0, half.x + inflate), Math.max(0, half.y + inflate), Math.max(0, half.z + inflate));
  if (half.x === 0 && half.y === 0 && half.z === 0) return null;

  // Offsets are Blockbench pixels along the bone's axes; in Blockbench space no axis is mirrored.
  center.add(new THREE.Vector3(h.offset[0], h.offset[1], h.offset[2]));
  return { center, half };
}

function makeBoxLines(color) {
  const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
  const material = new THREE.LineBasicMaterial({ color, depthTest: false, transparent: true, opacity: 0.9 });
  const lines = new THREE.LineSegments(geometry, material);
  lines.renderOrder = 999;
  lines.matrixAutoUpdate = false;
  return lines;
}

function makeArrow(direction, color, length) {
  const arrow = new THREE.ArrowHelper(direction, new THREE.Vector3(), length, color, length * 0.3, length * 0.18);
  arrow.traverse(o => {
    if (o.material) {
      o.material.depthTest = false;
      o.material.transparent = true;
    }
    o.renderOrder = 999;
  });
  return arrow;
}

/**
 * Wireframe for a spring collider in its bone's space (pixels): three rings around each end and,
 * for a capsule, four lines joining the ends.
 */
function colliderLinePoints(c) {
  const a = new THREE.Vector3(c.start[0], c.start[1], c.start[2]);
  const capsule = c.shape === 'capsule';
  const b = capsule ? new THREE.Vector3(c.end[0], c.end[1], c.end[2]) : a.clone();
  const r = Math.max(0.01, Number(c.radius) || 0);
  const points = [];
  const segments = 24;
  const ring = (center, u, v) => {
    for (let i = 0; i < segments; i++) {
      const t0 = (i / segments) * Math.PI * 2;
      const t1 = ((i + 1) / segments) * Math.PI * 2;
      for (const t of [t0, t1]) {
        points.push(center.x + (u.x * Math.cos(t) + v.x * Math.sin(t)) * r,
          center.y + (u.y * Math.cos(t) + v.y * Math.sin(t)) * r,
          center.z + (u.z * Math.cos(t) + v.z * Math.sin(t)) * r);
      }
    }
  };
  const X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0), Z = new THREE.Vector3(0, 0, 1);
  for (const center of capsule ? [a, b] : [a]) {
    ring(center, X, Y);
    ring(center, X, Z);
    ring(center, Y, Z);
  }
  if (capsule) {
    const axis = b.clone().sub(a);
    if (axis.lengthSq() > 1e-12) {
      axis.normalize();
      const helper = Math.abs(axis.y) < 0.9 ? Y : X;
      const u = new THREE.Vector3().crossVectors(axis, helper).normalize();
      const v = new THREE.Vector3().crossVectors(axis, u).normalize();
      for (const side of [u, v, u.clone().multiplyScalar(-1), v.clone().multiplyScalar(-1)]) {
        points.push(a.x + side.x * r, a.y + side.y * r, a.z + side.z * r, b.x + side.x * r, b.y + side.y * r, b.z + side.z * r);
      }
    }
  }
  return points;
}

function makeColliderLines(c) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(colliderLinePoints(c), 3));
  const material = new THREE.LineBasicMaterial({ color: COLOR_COLLIDER, depthTest: false, transparent: true, opacity: 0.85 });
  const lines = new THREE.LineSegments(geometry, material);
  lines.renderOrder = 999;
  lines.matrixAutoUpdate = false;
  return lines;
}

function makeSocketGizmo() {
  const group = new THREE.Object3D();
  group.add(makeArrow(new THREE.Vector3(0, 0, -1), COLOR_SOCKET, 4));
  group.add(makeArrow(new THREE.Vector3(0, 1, 0), COLOR_SOCKET_UP, 2));
  group.matrixAutoUpdate = false;
  return group;
}

function rebuildOverlay() {
  clearOverlay();
  overlay.dirty = false;
  if (!isActive()) return;

  const root = ensureOverlayRoot();
  const rig = RigStore.rig;

  for (const h of rig.hitboxes) {
    const object = makeBoxLines(hitboxColor(h));
    root.add(object);
    overlay.hitboxes.push({ def: h, object, box: null });
  }

  for (const s of rig.sockets) {
    const object = makeSocketGizmo();
    root.add(object);
    overlay.sockets.push({ def: s, object });
  }

  for (const c of rig.colliders || []) {
    const object = makeColliderLines(c);
    root.add(object);
    overlay.colliders.push({ def: c, object });
  }
}

/** Socket frame in world space: bone pivot, plus locator and socket offset, then locator and socket rotation. */
function socketWorldMatrix(s) {
  let bone = s.locator ? null : azure_rig_preview_findBone(s.bone);
  let localPosition = new THREE.Vector3(s.offset[0], s.offset[1], s.offset[2]);
  let rotation = bbRotation(s.rotation);

  if (s.locator) {
    const locator = findLocator(s.locator);
    if (!locator) return null;
    bone = locator.parent instanceof Group ? locator.parent : null;
    const origin = bone ? bone.origin : [0, 0, 0];
    localPosition.add(new THREE.Vector3(
      locator.position[0] - origin[0],
      locator.position[1] - origin[1],
      locator.position[2] - origin[2],
    ));
    rotation = bbRotation(locator.rotation || [0, 0, 0]).multiply(rotation);
  }

  const parent = bone?.mesh || Project?.model_3d;
  if (!parent) return null;
  parent.updateWorldMatrix(true, false);

  return new THREE.Matrix4()
    .copy(parent.matrixWorld)
    .multiply(new THREE.Matrix4().compose(localPosition, rotation, new THREE.Vector3(1, 1, 1)));
}

function syncOverlay() {
  if (!isActive()) {
    if (overlay.root) overlay.root.visible = false;
    return;
  }

  // Creates the overlay root on first use and keeps it in the scene.
  attachOverlayRoot();
  overlay.root.visible = true;
  if (overlay.dirty) rebuildOverlay();

  const parentInverse = new THREE.Matrix4();
  overlay.root.parent?.updateWorldMatrix(true, false);
  if (overlay.root.parent) parentInverse.copy(overlay.root.parent.matrixWorld).invert();

  for (const item of overlay.hitboxes) {
    const mesh = boneMesh(item.def.bone);
    const box = PreviewSettings.hitboxes && mesh ? hitboxBox(item.def) : null;
    item.object.visible = !!box;
    if (!box) continue;
    item.object.matrix.copy(parentInverse)
      .multiply(mesh.matrixWorld)
      .multiply(new THREE.Matrix4().compose(box.center, new THREE.Quaternion(), box.half.clone().multiplyScalar(2)));
  }

  for (const item of overlay.colliders) {
    const mesh = PreviewSettings.colliders ? boneMesh(item.def.bone) : null;
    item.object.visible = !!mesh;
    if (!mesh) continue;
    mesh.updateWorldMatrix(true, false);
    item.object.matrix.copy(parentInverse).multiply(mesh.matrixWorld);
  }

  for (const item of overlay.sockets) {
    const matrix = PreviewSettings.sockets ? socketWorldMatrix(item.def) : null;
    item.object.visible = !!matrix;
    if (!matrix) continue;
    item.object.matrix.copy(parentInverse).multiply(matrix);
  }
}

function restRotation(bone) {
  const mesh = bone.mesh;
  if (mesh?.fix_rotation) return mesh.fix_rotation;
  const r = bone.rotation || [0, 0, 0];
  return new THREE.Euler(r[0] * DEG, r[1] * DEG, r[2] * DEG, 'ZYX');
}

/** Turns a bone about its pivot by a world-space rotation. */
function rotateWorld(mesh, worldDelta) {
  const parentQuat = new THREE.Quaternion();
  mesh.parent.updateWorldMatrix(true, false);
  mesh.parent.getWorldQuaternion(parentQuat);
  const local = parentQuat.clone().invert().multiply(worldDelta).multiply(parentQuat);
  mesh.quaternion.premultiply(local);
  mesh.updateMatrixWorld(true);
}

/** Turns a bone so the direction to {@code from} points at {@code to}, by {@code fraction} of the turn. */
function aim(mesh, from, to, fraction = 1) {
  const pivot = worldPosition(mesh);
  const u = from.clone().sub(pivot);
  const v = to.clone().sub(pivot);
  if (u.lengthSq() < 1e-8 || v.lengthSq() < 1e-8) return false;
  u.normalize();
  v.normalize();
  if (u.dot(v) > 1 - 1e-9) return false;

  let q = new THREE.Quaternion().setFromUnitVectors(u, v);
  if (fraction < 1) q = new THREE.Quaternion().slerp(q, fraction);
  rotateWorld(mesh, q);
  return true;
}

/** A point fixed to a bone, in Blockbench pixels from its pivot, in world space. */
function pointOnBone(mesh, offset) {
  mesh.updateWorldMatrix(true, false);
  return new THREE.Vector3(offset[0], offset[1], offset[2]).applyMatrix4(mesh.matrixWorld);
}

function directionOnBone(mesh, direction) {
  const q = new THREE.Quaternion();
  mesh.updateWorldMatrix(true, false);
  mesh.getWorldQuaternion(q);
  return new THREE.Vector3(direction[0], direction[1], direction[2]).normalize().applyQuaternion(q);
}

function wrapAngle(a) {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

/**
 * Clamps a bone's rotation relative to its rest pose. Limits are keyframe
 * degrees; keyframes land on the mesh with X and Y negated (as in AzureLib),
 * so the mesh ranges for X and Y are [-max, -min].
 */
function applyConstraint(bone, c) {
  const mesh = bone.mesh;
  if (!mesh) return;
  const rest = restRotation(bone);
  const ranges = {
    x: [-c.max[0] * DEG, -c.min[0] * DEG],
    y: [-c.max[1] * DEG, -c.min[1] * DEG],
    z: [c.min[2] * DEG, c.max[2] * DEG],
  };
  if (c.type === 'hinge_x') { ranges.y = [0, 0]; ranges.z = [0, 0]; }
  if (c.type === 'hinge_y') { ranges.x = [0, 0]; ranges.z = [0, 0]; }
  if (c.type === 'hinge_z') { ranges.x = [0, 0]; ranges.y = [0, 0]; }

  const euler = new THREE.Euler().setFromQuaternion(mesh.quaternion, 'ZYX');
  for (const axis of ['x', 'y', 'z']) {
    const offset = wrapAngle(euler[axis] - rest[axis]);
    const [min, max] = ranges[axis];
    euler[axis] = rest[axis] + Math.min(max, Math.max(min, offset));
  }
  mesh.quaternion.setFromEuler(euler);
  mesh.updateMatrixWorld(true);
}

function constraintsFor(boneNames) {
  const byBone = new Map(RigStore.rig.constraints.map(c => [c.bone, c]));
  return boneNames.map(n => byBone.get(n) || null);
}

function resolvedSolver(chain) {
  if (chain.solver !== 'auto') return chain.solver;
  return chain.bones.length === 2 || chain.bones.length === 3 ? 'two_bone' : 'ccd';
}

/** AzIkSolvers.twoBone: bend the middle joint, swing the root, then twist towards the pole. */
function solveTwoBone(bones, effector, target, constraints, pole) {
  const [upper, lower] = bones.map(b => b.mesh);
  const last = bones[bones.length - 1].mesh;
  const a = worldPosition(upper);
  const b = worldPosition(lower);
  const c = pointOnBone(last, effector);
  const upperLen = a.distanceTo(b);
  const lowerLen = b.distanceTo(c);
  if (upperLen < 1e-5 || lowerLen < 1e-5) return;

  const reach = Math.min(upperLen + lowerLen - 1e-4, Math.max(Math.abs(upperLen - lowerLen) + 1e-4, a.distanceTo(target)));
  const u = a.clone().sub(b);
  const v = c.clone().sub(b);
  let axis = new THREE.Vector3().crossVectors(u, v);
  if (axis.lengthSq() < 1e-12) {
    axis = directionOnBone(upper, [1, 0, 0]);
  }
  axis.normalize();

  const current = Math.acos(Math.min(1, Math.max(-1, u.dot(v) / (upperLen * lowerLen))));
  const desired = Math.acos(Math.min(1, Math.max(-1, (upperLen * upperLen + lowerLen * lowerLen - reach * reach) / (2 * upperLen * lowerLen))));
  rotateWorld(lower, new THREE.Quaternion().setFromAxisAngle(axis, desired - current));
  if (constraints[1]) applyConstraint(bones[1], constraints[1]);

  aim(upper, pointOnBone(last, effector), target);
  if (constraints[0]) applyConstraint(bones[0], constraints[0]);

  if (pole) {
    const root = worldPosition(upper);
    const k = target.clone().sub(root);
    if (k.lengthSq() < 1e-10) return;
    k.normalize();
    const knee = worldPosition(lower).sub(root);
    const toPole = modelToWorld(pole).sub(root);
    knee.sub(k.clone().multiplyScalar(knee.dot(k)));
    toPole.sub(k.clone().multiplyScalar(toPole.dot(k)));
    if (knee.lengthSq() < 1e-10 || toPole.lengthSq() < 1e-10) return;
    const angle = Math.atan2(k.dot(new THREE.Vector3().crossVectors(knee, toPole)), knee.dot(toPole));
    rotateWorld(upper, new THREE.Quaternion().setFromAxisAngle(k, angle));
    if (constraints[0]) applyConstraint(bones[0], constraints[0]);
  }
}

/** AzIkSolvers.ccd: every pass turns each bone, tip first, to point the effector at the target. */
function solveCcd(bones, effector, target, constraints, iterations, tolerance) {
  const last = bones[bones.length - 1].mesh;
  for (let it = 0; it < iterations; it++) {
    for (let i = bones.length - 1; i >= 0; i--) {
      aim(bones[i].mesh, pointOnBone(last, effector), target);
      if (constraints[i]) applyConstraint(bones[i], constraints[i]);
    }
    if (pointOnBone(last, effector).distanceTo(target) <= tolerance) return;
  }
}

/** Where a chain's preview target is this frame, in world space, or null to skip. */
function previewTarget(entry, effectorWorld) {
  if (entry.target?.type === 'bone') {
    const mesh = entry.target.bone ? boneMesh(entry.target.bone) : null;
    return mesh ? pointOnBone(mesh, entry.target.point || [0, 0, 0]) : null;
  }

  const p = entry.preview || {};
  if (p.enabled === false || p.mode === 'off') return null;

  if (p.mode === 'locator') {
    const locator = findLocator(p.locator);
    return locator?.mesh ? worldPosition(locator.mesh) : null;
  }

  if (p.mode === 'ground') {
    // AzIkTargets.ground keeps the animated foot height but measures it from the
    // ground under the foot: with flat preview ground raised by groundHeight,
    // the foot moves up by that much.
    return effectorWorld.clone().add(new THREE.Vector3(0, Number(p.groundHeight) || 0, 0));
  }

  return modelToWorld(p.point || [0, 0, 0]);
}

/** Captures bone rotations so a modifier's result can be blended in by its weight. */
function captureRotations(meshes) {
  return meshes.map(m => m.quaternion.clone());
}

function blendRotations(meshes, before, weight) {
  if (weight >= 1) return;
  meshes.forEach((m, i) => m.quaternion.copy(before[i].clone().slerp(m.quaternion.clone(), Math.max(0, weight))));
  meshes.forEach(m => m.updateMatrixWorld(true));
}

function runIkChain(chain) {
  const bones = chain.bones.map(azure_rig_preview_findBone);
  if (bones.some(b => !b?.mesh) || !bones.length) return;
  const meshes = bones.map(b => b.mesh);
  const last = meshes[meshes.length - 1];
  const target = previewTarget(chain, pointOnBone(last, chain.effector));
  if (!target) return;

  const before = captureRotations(meshes);
  const constraints = constraintsFor(chain.bones);
  const solver = resolvedSolver(chain);

  if (solver === 'two_bone' && bones.length >= 2) {
    solveTwoBone(bones, chain.effector, target, constraints, chain.pole);
  } else {
    solveCcd(bones, chain.effector, target, constraints, Math.max(1, chain.iterations | 0), Math.max(0.001, Number(chain.tolerance) || 0.1));
  }

  blendRotations(meshes, before, Number(chain.weight) || 0);
}

function runLookAt(look) {
  const bones = look.bones.map(azure_rig_preview_findBone);
  if (bones.some(b => !b?.mesh) || !bones.length) return;
  const meshes = bones.map(b => b.mesh);
  const head = meshes[meshes.length - 1];
  const target = previewTarget(look, worldPosition(head));
  if (!target) return;

  const before = captureRotations(meshes);
  const constraints = constraintsFor(look.bones);
  const last = meshes.length - 1;

  for (let i = 0; i <= last; i++) {
    const headPos = worldPosition(head);
    const distance = headPos.distanceTo(target);
    if (distance < 1e-4) break;
    const aimPoint = directionOnBone(head, look.forward).multiplyScalar(distance).add(headPos);
    aim(meshes[i], aimPoint, target, 1 / (last - i + 1));
    if (constraints[i]) applyConstraint(bones[i], constraints[i]);
  }

  blendRotations(meshes, before, Number(look.weight) || 0);
}

const springStates = new Map();

/**
 * A spring chain's colliders in world space for this frame: [{a, b, radius, capsule}], with the
 * radius in pixels. Mirrors AzSpringBone#updateColliders.
 */
function springColliders(spring) {
  const byId = new Map((RigStore.rig.colliders || []).map(c => [c.id, c]));
  const out = [];
  for (const id of spring.colliders || []) {
    const c = byId.get(id);
    const mesh = c && boneMesh(c.bone);
    if (!mesh) continue;
    const capsule = c.shape === 'capsule';
    out.push({
      a: pointOnBone(mesh, c.start),
      b: pointOnBone(mesh, capsule ? c.end : c.start),
      radius: Math.max(0, Number(c.radius) || 0),
      capsule,
    });
  }
  return out;
}

/** Closest points between segments p0-p1 and a-b: returns [s, t], the parameters along each. */
function closestSegmentParams(p0, p1, a, b) {
  const d1 = p1.clone().sub(p0);
  const d2 = b.clone().sub(a);
  const r = p0.clone().sub(a);
  const aa = d1.dot(d1);
  const ee = d2.dot(d2);
  const ff = d2.dot(r);
  let s;
  let t;

  if (aa <= 1e-12 && ee <= 1e-12) return [0, 0];
  if (aa <= 1e-12) return [0, Math.max(0, Math.min(1, ff / ee))];

  const c = d1.dot(r);
  if (ee <= 1e-12) {
    s = Math.max(0, Math.min(1, -c / aa));
    t = 0;
  } else {
    const bb = d1.dot(d2);
    const denom = aa * ee - bb * bb;
    s = denom > 1e-12 ? Math.max(0, Math.min(1, (bb * ff - c * ee) / denom)) : 0;
    t = (bb * s + ff) / ee;
    if (t < 0) {
      t = 0;
      s = Math.max(0, Math.min(1, -c / aa));
    } else if (t > 1) {
      t = 1;
      s = Math.max(0, Math.min(1, (bb - c) / aa));
    }
  }
  return [s, t];
}

/**
 * Pushes the chain out of the colliders and above the ground. Each segment is tested against
 * each collider's core, so thin colliders can't slip between two joints; the segment's outer
 * joint is moved so the segment clears it. Mirrors AzSpringBone#collide.
 */
function collideSpring(p, colliders, particleRadius, groundY) {
  for (let j = 1; j < p.length; j++) {
    for (const c of colliders) {
      const reach = c.radius + particleRadius;
      const coreEnd = c.capsule ? c.b : c.a;
      const [sAlong, tAlong] = closestSegmentParams(p[j - 1], p[j], c.a, coreEnd);
      const onChain = p[j - 1].clone().lerp(p[j], sAlong);
      const onCore = c.a.clone().lerp(coreEnd, tAlong);
      const away = onChain.clone().sub(onCore);
      const dist = away.length();
      if (dist >= reach) continue;
      if (dist < 1e-6) away.set(0, 1, 0);
      else away.divideScalar(dist);
      // Moving the outer joint by d moves the contact point by s * d; the root end of the
      // segment is handled by the segment before it.
      p[j].add(away.multiplyScalar((reach - dist) / Math.max(sAlong, 0.25)));
    }
    if (groundY !== null && p[j].y < groundY + particleRadius) p[j].y = groundY + particleRadius;
  }
}

/**
 * AzSpringBone: damped particles, each pulled towards its animated position relative to the
 * particle before it, held at segment length; the bones are then aimed at them.
 */
function runSpring(spring) {
  const bones = spring.bones.map(azure_rig_preview_findBone);
  if (bones.some(b => !b?.mesh) || !bones.length || spring.preview?.enabled === false) return;
  const meshes = bones.map(b => b.mesh);
  const tip = spring.tip;
  const count = meshes.length + (tip ? 1 : 0);

  const chainPoint = j => (j < meshes.length ? worldPosition(meshes[j]) : pointOnBone(meshes[meshes.length - 1], tip));
  const targets = [];
  for (let j = 0; j < count; j++) targets.push(chainPoint(j));

  const colliders = springColliders(spring);
  const particleRadius = Math.max(0, Number(spring.radius) || 0);
  // The ground is the model's origin: the entity's feet.
  const groundY = spring.ground ? modelToWorld([0, 0, 0]).y : null;

  const time = Timeline.time || 0;
  const now = performance.now();
  const playing = !!Timeline.playing;
  let state = springStates.get(spring.id);
  const fresh = !state || state.count !== count;

  // While playback runs, step by real time (scaled by the playback speed), so looping back to
  // the start of the animation or the loop range doesn't count as going backwards. When
  // scrubbing, step by timeline time, and reset on a jump backwards or a big jump forwards.
  let delta = 0;
  if (!fresh) {
    delta = playing && state.playing
      ? ((now - state.wall) / 1000) * TICKS_PER_SECOND * ((Timeline.playback_speed ?? 100) / 100)
      : (time - state.time) * TICKS_PER_SECOND;
  }

  if (fresh || delta < 0 || delta > 10) {
    state = {
      count,
      time,
      wall: now,
      playing,
      position: targets.map(t => t.clone()),
      velocity: targets.map(() => new THREE.Vector3()),
    };
    collideSpring(state.position, colliders, particleRadius, groundY);
    springStates.set(spring.id, state);
  } else {
    const stiffness = Math.min(1, Math.max(0, Number(spring.stiffness) || 0));
    const damping = Math.min(1, Math.max(0, Number(spring.damping) || 0));
    const gravity = (Number(spring.gravity) || 0) * PIXELS_PER_BLOCK;
    const p = state.position;
    const v = state.velocity;
    p[0].copy(targets[0]);

    let remaining = delta;
    while (remaining > 1e-4) {
      const dt = Math.min(remaining, 1);
      const keep = Math.max(0, 1 - damping * dt);
      const previous = p.map(x => x.clone());

      for (let j = 1; j < count; j++) {
        // Each joint springs towards where the animation puts it relative to the joint
        // before it, so lag builds up along the chain and it bends and whips instead of
        // swinging as one rigid piece.
        const rest = targets[j].clone().sub(targets[j - 1]).add(p[j - 1]);
        v[j].add(rest.sub(p[j]).multiplyScalar(stiffness * dt));
        v[j].y -= gravity * dt;
        v[j].multiplyScalar(keep);
        p[j].add(v[j].clone().multiplyScalar(dt));
      }

      // Hold every segment at its animated length and push joints out of colliders; alternated so
      // the chain ends up both the right length and outside the colliders.
      const passes = colliders.length || groundY !== null ? 3 : 1;
      for (let pass = 0; pass < passes; pass++) {
        for (let j = 1; j < count; j++) {
          const rest = targets[j].distanceTo(targets[j - 1]);
          const dir = p[j].clone().sub(p[j - 1]);
          const length = dir.length();
          if (length > 1e-6) p[j].copy(p[j - 1]).add(dir.multiplyScalar(rest / length));
        }
        collideSpring(p, colliders, particleRadius, groundY);
      }

      // Derive velocity from the corrected motion, so contact slides and settles instead of bouncing.
      for (let j = 1; j < count; j++) v[j].copy(p[j]).sub(previous[j]).divideScalar(dt);

      remaining -= dt;
    }
    state.time = time;
    state.wall = now;
    state.playing = playing;
  }

  const constraints = constraintsFor(spring.bones);
  for (let i = 0; i < count - 1; i++) {
    aim(meshes[i], chainPoint(i + 1), state.position[i + 1]);
    if (constraints[i]) applyConstraint(bones[i], constraints[i]);
  }
}

function runStandaloneConstraints() {
  for (const c of RigStore.rig.constraints) {
    if (!c.standalone) continue;
    const bone = azure_rig_preview_findBone(c.bone);
    if (bone) applyConstraint(bone, c);
  }
}

function runModifiers() {
  if (!isActive() || !PreviewSettings.modifiers || !Animator?.open) return;
  const rig = RigStore.rig;

  const jobs = [
    ...rig.ikChains.map(c => ({ priority: Number(c.priority) || 0, run: () => runIkChain(c) })),
    ...rig.lookAts.map(l => ({ priority: Number(l.priority) || 0, run: () => runLookAt(l) })),
    ...rig.springBones.map(s => ({ priority: Number(s.priority) || 0, run: () => runSpring(s) })),
  ];
  if (rig.constraints.some(c => c.standalone)) jobs.push({ priority: 1000, run: runStandaloneConstraints });

  // AzureLib runs modifiers in ascending priority, then in the order they were added.
  jobs.map((job, i) => ({ ...job, i }))
    .sort((a, b) => a.priority - b.priority || a.i - b.i)
    .forEach(job => {
      try {
        job.run();
      } catch (e) {
        console.warn('[AzureLib Rig] Preview failed for a modifier', e);
      }
    });
}

const BlendPreview = {
  active: null,
  inputX: 0,
  inputY: 0,

  start(blendSpace) {
    this.active = blendSpace;
    this.refresh();
  },

  stop() {
    this.active = null;
    this.refresh();
  },

  refresh() {
    try { if (Animator?.open) Animator.preview(); } catch (_) { /* not in animate mode */ }
  },

  weights() {
    return this.active ? blendSpaceWeights(this.active, this.inputX, this.inputY) : [];
  },

  display() {
    if (!this.active) return false;
    const weights = this.weights();
    const blend = {};
    const animations = [];

    this.active.samples.forEach((sample, i) => {
      const animation = Animation.all.find(a => a.name === sample.animation);
      if (!animation || !(weights[i] > 0)) return;
      if (blend[animation.uuid] === undefined) {
        blend[animation.uuid] = 0;
        animations.push(animation);
      }
      blend[animation.uuid] += weights[i];
    });

    if (!animations.length) return false;
    Animator.showDefaultPose(true);
    Animator.stackAnimations(animations, false, blend);
    return true;
  },
};

let azure_rig_preview_handlers = null;
let unsubscribe = null;

function markOverlayDirty() {
  overlay.dirty = true;
}

function registerRigPreview() {
  if (azure_rig_preview_handlers) return;

  azure_rig_preview_handlers = {
    frame: () => {
      if (isActive() && Animator?.open && BlendPreview.active) BlendPreview.display();
      runModifiers();
    },
    render: () => syncOverlay(),
    dirty: () => { overlay.dirty = true; },
    resetSprings: () => springStates.clear(),
    leaveAnimate: () => { if (BlendPreview.active) BlendPreview.stop(); },
  };

  unsubscribe = RigStore.onChange(() => {
    overlay.dirty = true;
    springStates.clear();
  });

  Blockbench.on('display_animation_frame', azure_rig_preview_handlers.frame);
  Blockbench.on('render_frame', azure_rig_preview_handlers.render);
  Blockbench.on('finished_edit', azure_rig_preview_handlers.dirty);
  Blockbench.on('load_project', azure_rig_preview_handlers.dirty);
  Blockbench.on('select_project', azure_rig_preview_handlers.dirty);
  Blockbench.on('select_animation', azure_rig_preview_handlers.resetSprings);
  Blockbench.on('unselect_mode', azure_rig_preview_handlers.leaveAnimate);
  Blockbench.on('unselect_project', azure_rig_preview_handlers.leaveAnimate);
}

function unregisterRigPreview() {
  if (!azure_rig_preview_handlers) return;
  BlendPreview.stop();
  Blockbench.removeListener('display_animation_frame', azure_rig_preview_handlers.frame);
  Blockbench.removeListener('render_frame', azure_rig_preview_handlers.render);
  Blockbench.removeListener('finished_edit', azure_rig_preview_handlers.dirty);
  Blockbench.removeListener('load_project', azure_rig_preview_handlers.dirty);
  Blockbench.removeListener('select_project', azure_rig_preview_handlers.dirty);
  Blockbench.removeListener('select_animation', azure_rig_preview_handlers.resetSprings);
  Blockbench.removeListener('unselect_mode', azure_rig_preview_handlers.leaveAnimate);
  Blockbench.removeListener('unselect_project', azure_rig_preview_handlers.leaveAnimate);
  unsubscribe?.();
  unsubscribe = null;
  azure_rig_preview_handlers = null;
  clearOverlay();
  overlay.root?.parent?.remove(overlay.root);
  overlay.root = null;
}

;// ./rig/azure-rig-codegen.js
/**
 * AzureLib Animator — Rig Code Generation
 * ---------------------------------------
 * Turns the rig definitions into Java code for Azurelib: the entity's hitbox set and
 * socket constants, the animator's pose modifiers (IK, look-at, spring bones,
 * constraints) and blend spaces, and the renderer's attachment layer.
 *
 * © 2026 AzureDoom — MIT License
 */

/**
 * AzureLib branches the generator can target. `root` is the default package
 * root (overridable per project); `mojmap` marks branches on Mojang's mapped
 * names, which share the entity accessors used by blend-space inputs.
 */
const TARGETS = {
  v26_3: { label: '26.3', root: 'mod.azure.azurelib.common', mojmap: true },
  v1_21_1: { label: '1.21.1', root: 'mod.azure.azurelib.common', mojmap: true },
  v1_20_1: { label: '1.20.1', root: 'mod.azure.azurelib.common', mojmap: true },
  v1_18: { label: '1.18.2', root: 'mod.azure.azurelib', mojmap: true },
  legacy: { label: '1.12.2 / 1.7.10', root: 'mod.azure.azurelib', mojmap: false },
  beta: { label: 'Beta 1.7.3 (Ornithe / StationAPI)', root: 'mod.azure.azurelib', mojmap: false },
};

/** Target id -> label, for select inputs. */
const CODEGEN_TARGETS = Object.fromEntries(Object.entries(TARGETS).map(([id, t]) => [id, t.label]));

/** Older saved projects used `modern` for 1.21.x. */
function normalizeTarget(target) {
  if (target === 'modern') return 'v1_21_1';
  return TARGETS[target] ? target : 'v1_21_1';
}

const BLEND_INPUTS = {
  speed: 'Horizontal speed (blocks/second)',
  forward: 'Forward speed (blocks/second)',
  strafe: 'Strafe speed, right positive (blocks/second)',
  pitch: 'Look pitch (degrees)',
  custom: 'Custom (fill in by hand)',
};

const DEFAULT_OPTIONS = {
  target: 'v1_21_1',
  packageRoot: '',
  entityClass: 'ExampleEntity',
  indent: '    ',
};

function jf(value) {
  const n = Number(value) || 0;
  if (Number.isInteger(n)) return String(n);
  return `${parseFloat(n.toFixed(4))}F`;
}

function jd(value) {
  const n = Number(value) || 0;
  return Number.isInteger(n) ? String(n) : String(parseFloat(n.toFixed(4)));
}

function js(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function constantName(value) {
  const cleaned = String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();
  return /^[0-9]/.test(cleaned) ? `_${cleaned}` : cleaned || 'UNNAMED';
}

const isZero = v => !v || v.every(n => !Number(n));
const vecArgs = v => v.map(jf).join(', ');

function packageRoot(target, override) {
  return (override || '').trim() || TARGETS[normalizeTarget(target)].root;
}

const isMojmap = target => TARGETS[normalizeTarget(target)].mojmap;

function importsBlock(target, names, override) {
  const root = packageRoot(target, override);
  const paths = {
    AzHitboxSet: `${root}.hitbox.AzHitboxSet`,
    AzHitboxHolder: `${root}.hitbox.AzHitboxHolder`,
    AzBoneSocket: `${root}.socket.AzBoneSocket`,
    AzAttachment: `${root}.socket.AzAttachment`,
    AzAttachmentLayer: `${root}.socket.AzAttachmentLayer`,
    AzPoseModifierRegistry: `${root}.animation.pose.AzPoseModifierRegistry`,
    AzBoneConstraint: `${root}.animation.pose.AzBoneConstraint`,
    AzBoneConstraints: `${root}.animation.pose.AzBoneConstraints`,
    AzIkChain: `${root}.animation.pose.ik.AzIkChain`,
    AzIkSolvers: `${root}.animation.pose.ik.AzIkSolvers`,
    AzIkTargets: `${root}.animation.pose.ik.AzIkTargets`,
    AzLookAt: `${root}.animation.pose.ik.AzLookAt`,
    AzSpringBone: `${root}.animation.pose.secondary.AzSpringBone`,
    AzSpringCollider: `${root}.animation.pose.secondary.AzSpringCollider`,
    AzBlendSpace1D: `${root}.animation.blend.AzBlendSpace1D`,
    AzBlendSpace2D: `${root}.animation.blend.AzBlendSpace2D`,
    AzAnimationControllerContainer: `${root}.animation.controller.AzAnimationControllerContainer`,
    Mth: isMojmap(target) ? 'net.minecraft.util.Mth' : `${root}.util.math.Mth`,
    Mc: `${root}.platform.mc.Mc`,
    UUID: 'java.util.UUID',
  };
  return [...new Set(names)]
    .filter(n => paths[n])
    .map(n => `import ${paths[n]};`)
    .sort()
    .join('\n');
}

function section(title, imports, body) {
  return { title, imports, body: body.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n' };
}

function hitboxCall(h, ind) {
  const options = [];

  if (h.role === 'INTERACT') options.push('.interact()');
  if (h.role === 'ANCHOR') options.push('.anchor()');
  if (!h.fit) {
    const [x, y, z] = h.size;
    options.push(x === y && y === z ? `.size(${jf(x)})` : `.size(${vecArgs(h.size)})`);
  }
  if (!isZero(h.offset)) options.push(`.offset(${vecArgs(h.offset)})`);
  if (Number(h.inflate)) options.push(`.inflate(${jf(h.inflate)})`);
  if (h.anchorAtPivot) options.push('.anchorAtPivot()');
  if (Number(h.damageMultiplier) !== 1 && h.role === 'COMBAT') options.push(`.damageMultiplier(${jf(h.damageMultiplier)})`);
  for (const tag of h.tags || []) options.push(`.tag(${js(tag)})`);

  const sameName = h.name === h.bone;

  if (!options.length) {
    return sameName ? `${ind}.add(${js(h.bone)})` : `${ind}.add(${js(h.name)}, ${js(h.bone)}, h -> h)`;
  }

  const lambda = `h -> h${options.join('')}`;
  return sameName ? `${ind}.add(${js(h.bone)}, ${lambda})` : `${ind}.add(${js(h.name)}, ${js(h.bone)}, ${lambda})`;
}

function socketExpression(s) {
  const parts = [s.locator ? `AzBoneSocket.locator(${js(s.locator)})` : `AzBoneSocket.bone(${js(s.name)}, ${js(s.bone)})`];
  if (!isZero(s.offset)) parts.push(`.offset(${vecArgs(s.offset)})`);
  if (!isZero(s.rotation)) parts.push(`.rotation(${vecArgs(s.rotation)})`);
  if (s.serverHitbox) parts.push(`.serverHitbox(${js(s.serverHitbox)})`);
  parts.push('.build()');
  return parts.join('');
}

function socketName(s) {
  return s.locator || s.name;
}

function generateEntitySection(rig, options = {}) {
  const o = { ...DEFAULT_OPTIONS, ...options };
  const ind = o.indent;
  const lines = [];
  const imports = [];

  if (rig.sockets.length) {
    imports.push('AzBoneSocket');
    lines.push(`${ind}// Bone sockets: find them with AzBoneSockets.resolve(this, SOCKET, partialTick, transform).`);
    for (const s of rig.sockets) {
      lines.push(`${ind}public static final AzBoneSocket ${constantName(socketName(s))} = ${socketExpression(s)};`);
    }
    lines.push('');
  }

  const anchorSockets = rig.sockets.filter(s => s.serverHitbox && !s.locator
    && !rig.hitboxes.some(h => h.name === s.serverHitbox));

  if (rig.hitboxes.length || anchorSockets.length) {
    imports.push('AzHitboxSet', 'AzHitboxHolder');
    lines.push(`${ind}private static final AzHitboxSet HITBOXES = AzHitboxSet.builder()`);
    for (const h of rig.hitboxes) lines.push(hitboxCall(h, `${ind}${ind}`));
    for (const s of anchorSockets) {
      lines.push(`${ind}${ind}.add(${constantName(socketName(s))}.toAnchorHitbox()) // Server-side position for the ${js(socketName(s))} socket.`);
    }
    if (rig.hitboxOptions.keepEntityBox) lines.push(`${ind}${ind}.keepEntityBox(true)`);
    if (rig.hitboxOptions.clientOnly) lines.push(`${ind}${ind}.clientOnly()`);
    lines.push(`${ind}${ind}.build();`);
    lines.push('');
    lines.push(`${ind}// ${o.entityClass} implements AzHitboxHolder`);
    lines.push(`${ind}@Override`);
    lines.push(`${ind}public AzHitboxSet getHitboxSet() {`);
    lines.push(`${ind}${ind}return HITBOXES;`);
    lines.push(`${ind}}`);
  }

  for (const s of rig.sockets.filter(s => s.serverHitbox && s.locator)) {
    lines.push('');
    lines.push(`${ind}// TODO: socket ${js(socketName(s))} follows a locator, so add its anchor hitbox ${js(s.serverHitbox)} yourself:`);
    lines.push(`${ind}//   AzHitbox.builder(${js(s.serverHitbox)}, "<locator's bone>").anchor().anchorAtPivot().offset(<locator offset>).size(1).build()`);
  }

  if (!lines.length) return null;
  return section(`${o.entityClass} (entity)`, importsBlock(o.target, imports, o.packageRoot), lines.join('\n'));
}

function constraintExpression(c) {
  switch (c.type) {
    case 'hinge_x': return `AzBoneConstraints.hingeX(${js(c.bone)}, ${jf(c.min[0])}, ${jf(c.max[0])})`;
    case 'hinge_y': return `AzBoneConstraints.hingeY(${js(c.bone)}, ${jf(c.min[1])}, ${jf(c.max[1])})`;
    case 'hinge_z': return `AzBoneConstraints.hingeZ(${js(c.bone)}, ${jf(c.min[2])}, ${jf(c.max[2])})`;
    default:
      return `AzBoneConstraints.limit(${js(c.bone)}, ${jf(c.min[0])}, ${jf(c.max[0])}, ${jf(c.min[1])}, ${jf(c.max[1])}, ${jf(c.min[2])}, ${jf(c.max[2])})`;
  }
}

function constraintField(c) {
  return `${constantName(c.bone)}_LIMIT`;
}

function colliderField(c) {
  return `${constantName(c.id)}_COLLIDER`;
}

function colliderExpression(c) {
  if (c.shape === 'capsule') {
    return `AzSpringCollider.capsule(${js(c.bone)}, ${vecArgs(c.start)}, ${vecArgs(c.end)}, ${jf(c.radius)})`;
  }
  return `AzSpringCollider.sphere(${js(c.bone)}, ${vecArgs(c.start)}, ${jf(c.radius)})`;
}

function ikTargetExpression(t, entityClass) {
  switch (t.type) {
    case 'ground': return `AzIkTargets.ground(${jf(t.stepUp)}, ${jf(t.stepDown)})`;
    case 'entity_eyes': return `AzIkTargets.entityEyes(entity -> null /* TODO: return the (synced) entity to look at */)`;
    case 'world': return `AzIkTargets.world((entity, partialTick) -> null /* TODO: return the world position */)`;
    case 'model': return `AzIkTargets.<${entityClass}>model(${vecArgs(t.point)})`;
    case 'bone':
      return isZero(t.point)
        ? `AzIkTargets.<${entityClass}>bone(${js(t.bone || '')})`
        : `AzIkTargets.<${entityClass}>bone(${js(t.bone || '')}, ${vecArgs(t.point)})`;
    default: return 'null /* TODO: target */';
  }
}

function azure_rig_codegen_resolvedSolver(chain) {
  if (chain.solver !== 'auto') return chain.solver;
  return chain.bones.length === 2 || chain.bones.length === 3 ? 'two_bone' : 'ccd';
}

function modifierTail(entry, defaultPriority = 0) {
  const tail = [];
  if (Number(entry.priority) !== defaultPriority) tail.push(`.priority(${Math.round(Number(entry.priority) || 0)})`);
  if (entry.weight !== undefined && Number(entry.weight) !== 1) tail.push(`.defaultWeight(${jd(entry.weight)})`);
  return tail.join('');
}

function generatePoseModifierSection(rig, options = {}) {
  const o = { ...DEFAULT_OPTIONS, ...options };
  const ind = o.indent;
  const E = o.entityClass;
  const imports = new Set();
  const fields = [];
  const body = [];

  const constraintsByBone = new Map(rig.constraints.map(c => [c.bone, c]));
  const collidersById = new Map((rig.colliders || []).map(c => [c.id, c]));
  const usedColliders = new Set();
  const usedConstraints = new Set();
  const constraintRefs = bones => bones
    .filter(b => constraintsByBone.has(b))
    .map(b => {
      usedConstraints.add(b);
      return constraintField(constraintsByBone.get(b));
    });

  for (const c of rig.ikChains) {
    imports.add('AzIkChain').add('AzIkTargets');
    const lines = [`modifiers.add(${js(c.id)}, AzIkChain.<${E}>builder(${c.bones.map(js).join(', ')})`];
    if (!isZero(c.effector)) lines.push(`.effector(${vecArgs(c.effector)})`);

    const solver = azure_rig_codegen_resolvedSolver(c);
    if (solver === 'two_bone' && (c.solver !== 'auto' || c.pole)) {
      imports.add('AzIkSolvers');
      lines.push(`.solver(AzIkSolvers.twoBone()${c.pole ? `.pole(${vecArgs(c.pole)})` : ''})`);
    } else if (solver === 'ccd' && (c.solver !== 'auto' || c.iterations !== 10 || Number(c.tolerance) !== 0.1)) {
      imports.add('AzIkSolvers');
      lines.push(`.solver(AzIkSolvers.ccd(${Math.max(1, Math.round(c.iterations))}, ${jf(c.tolerance)}))`);
    }

    lines.push(`.target(${ikTargetExpression(c.target, E)})`);
    const refs = constraintRefs(c.bones);
    if (refs.length) lines.push(`.constraint(${refs.join(', ')})`);
    lines.push(`.build())${modifierTail(c)};`);
    body.push(lines.join(`\n${ind}${ind}${ind}`));
  }

  for (const l of rig.lookAts) {
    imports.add('AzLookAt').add('AzIkTargets');
    const lines = [`modifiers.add(${js(l.id)}, AzLookAt.<${E}>builder(${l.bones.map(js).join(', ')})`];
    const [fx, fy, fz] = l.forward;
    if (fx !== 0 || fy !== 0 || fz !== -1) lines.push(`.forward(${vecArgs(l.forward)})`);
    lines.push(`.target(${ikTargetExpression(l.target, E)})`);
    const refs = constraintRefs(l.bones);
    if (refs.length) lines.push(`.constraint(${refs.join(', ')})`);
    lines.push(`.build())${modifierTail(l)};`);
    body.push(lines.join(`\n${ind}${ind}${ind}`));
  }

  for (const s of rig.springBones) {
    imports.add('AzSpringBone');
    const lines = [`modifiers.add(${js(s.id)}, AzSpringBone.<${E}>chain(${s.bones.map(js).join(', ')})`];
    if (s.tip) lines.push(`.tip(${vecArgs(s.tip)})`);
    lines.push(`.stiffness(${jf(s.stiffness)})`);
    lines.push(`.damping(${jf(s.damping)})`);
    if (Number(s.gravity)) lines.push(`.gravity(${jf(s.gravity)})`);
    if (Number(s.inertia) !== 1) lines.push(`.inertia(${jf(s.inertia)})`);
    const refs = constraintRefs(s.bones);
    if (refs.length) lines.push(`.constraint(${refs.join(', ')})`);
    const colliders = (s.colliders || []).map(id => collidersById.get(id)).filter(Boolean);
    if (colliders.length) {
      colliders.forEach(c => usedColliders.add(c.id));
      lines.push(`.collider(${colliders.map(colliderField).join(', ')})`);
    }
    if (Number(s.radius) > 0) lines.push(`.radius(${jf(s.radius)})`);
    if (s.ground) lines.push('.ground(true)');
    lines.push(`.build())${modifierTail(s)};`);
    body.push(lines.join(`\n${ind}${ind}${ind}`));
  }

  const standalone = rig.constraints.filter(c => c.standalone);
  if (standalone.length) {
    standalone.forEach(c => usedConstraints.add(c.bone));
    body.push(`// Clamp the final pose (after animation and every other modifier).\n${ind}${ind}modifiers.add("bone_limits", AzBoneConstraints.modifier(${standalone.map(constraintField).join(', ')})).priority(1000);`);
  }

  for (const c of rig.constraints) {
    if (!usedConstraints.has(c.bone)) continue;
    imports.add('AzBoneConstraint').add('AzBoneConstraints');
    fields.push(`${ind}private static final AzBoneConstraint ${constraintField(c)} = ${constraintExpression(c)};`);
  }

  for (const c of rig.colliders || []) {
    if (!usedColliders.has(c.id)) continue;
    imports.add('AzSpringCollider');
    fields.push(`${ind}private static final AzSpringCollider ${colliderField(c)} = ${colliderExpression(c)};`);
  }

  if (!body.length) return null;
  imports.add('AzPoseModifierRegistry');

  const text = [
    ...fields,
    fields.length ? '' : null,
    `${ind}@Override`,
    `${ind}protected void registerPoseModifiers(AzPoseModifierRegistry<${E}> modifiers) {`,
    body.map(b => `${ind}${ind}${b}`).join('\n\n'),
    `${ind}}`,
  ].filter(l => l !== null).join('\n');

  return section(`${E}Animator: pose modifiers`, importsBlock(o.target, [...imports], o.packageRoot), text);
}

function blendInputExpression(kind, target, used) {
  const modern = isMojmap(target);
  switch (kind) {
    case 'speed':
      if (modern) return 'entity.getDeltaMovement().horizontalDistance() * 20';
      if (target === 'beta') return 'Math.sqrt(Mc.velocityX(entity) * Mc.velocityX(entity) + Mc.velocityZ(entity) * Mc.velocityZ(entity)) * 20';
      return 'Math.sqrt(entity.motionX * entity.motionX + entity.motionZ * entity.motionZ) * 20';
    case 'forward':
      used.add('forward');
      return 'entity.getForwardSpeed()';
    case 'strafe':
      used.add('strafe');
      return 'entity.getStrafeSpeed()';
    case 'pitch':
      if (modern) return 'entity.getViewXRot(partialTick)';
      if (target === 'beta') return 'Mth.lerp(partialTick, Mc.prevPitch(entity), Mc.pitch(entity))';
      return 'Mth.lerp(partialTick, entity.prevRotationPitch, entity.rotationPitch)';
    default:
      return '0 /* TODO: input */';
  }
}

function speedHelpers(target, used, ind) {
  if (!used.size) return '';
  const modern = isMojmap(target);
  const yaw = modern ? 'yBodyRot' : target === 'beta' ? 'Mc.bodyYaw(this)' : 'renderYawOffset';
  const mx = modern ? 'getDeltaMovement().x' : target === 'beta' ? 'Mc.velocityX(this)' : 'motionX';
  const mz = modern ? 'getDeltaMovement().z' : target === 'beta' ? 'Mc.velocityZ(this)' : 'motionZ';
  const out = [`${ind}// Add to your entity class; used by the blend space inputs.`];
  if (used.has('forward')) {
    out.push(`${ind}public double getForwardSpeed() {`);
    out.push(`${ind}${ind}double yaw = Math.toRadians(${yaw});`);
    out.push(`${ind}${ind}return (-Math.sin(yaw) * ${mx} + Math.cos(yaw) * ${mz}) * 20;`);
    out.push(`${ind}}`);
  }
  if (used.has('strafe')) {
    out.push(`${ind}public double getStrafeSpeed() {`);
    out.push(`${ind}${ind}double yaw = Math.toRadians(${yaw});`);
    out.push(`${ind}${ind}return -(Math.cos(yaw) * ${mx} + Math.sin(yaw) * ${mz}) * 20;`);
    out.push(`${ind}}`);
  }
  return out.join('\n');
}

function generateBlendSpaceSection(rig, options = {}) {
  const o = { ...DEFAULT_OPTIONS, ...options };
  const ind = o.indent;
  const E = o.entityClass;
  if (!rig.blendSpaces.length) return null;

  const imports = new Set(['AzAnimationControllerContainer']);
  const used = new Set();
  const blocks = [];

  for (const b of rig.blendSpaces) {
    const two = b.dimensions === 2;
    imports.add(two ? 'AzBlendSpace2D' : 'AzBlendSpace1D');
    const x = blendInputExpression(b.input.x, o.target, used);
    const lines = [`${two ? 'AzBlendSpace2D' : 'AzBlendSpace1D'}.builder(this, ${js(b.name)})`];

    if (two) {
      const y = blendInputExpression(b.input.y, o.target, used);
      lines.push(`.input((entity, partialTick) -> ${x}, (entity, partialTick) -> ${y})`);
    } else {
      lines.push(`.input((entity, partialTick) -> ${x})`);
    }

    const samples = two ? b.samples : b.samples.slice().sort((a, c) => a.x - c.x);
    for (const s of samples) {
      lines.push(two ? `.sample(${jd(s.x)}, ${jd(s.y)}, ${js(s.animation)})` : `.sample(${jd(s.x)}, ${js(s.animation)})`);
    }
    if (Number(b.smoothing) > 0) lines.push(`.smoothing(${jd(b.smoothing)})`);
    if (b.syncPhase === false) lines.push('.syncPhase(false)');
    lines.push('.build()');
    lines.push('.addTo(container);');
    blocks.push(lines.join(`\n${ind}${ind}${ind}`));

    for (const kind of [b.input.x, two ? b.input.y : null]) {
      if (kind === 'pitch' && !isMojmap(o.target)) imports.add('Mth');
      if ((kind === 'speed' || kind === 'pitch') && o.target === 'beta') imports.add('Mc');
    }
  }
  if (o.target === 'beta' && used.size) imports.add('Mc');

  const text = [
    `${ind}@Override`,
    `${ind}public void registerControllers(AzAnimationControllerContainer<${E}> container) {`,
    `${ind}${ind}// Blend spaces are layered like controllers: add those that go on top after them.`,
    blocks.map(b => `${ind}${ind}${b}`).join('\n\n'),
    `${ind}}`,
  ].join('\n');

  const helpers = speedHelpers(o.target, used, ind);
  return section(`${E}Animator: blend spaces`, importsBlock(o.target, [...imports], o.packageRoot), helpers ? `${text}\n\n${helpers}` : text);
}

function generateAttachmentSection(rig, options = {}) {
  const o = { ...DEFAULT_OPTIONS, ...options };
  const ind = o.indent;
  const E = o.entityClass;
  if (!rig.sockets.length) return null;

  const lines = [
    `${ind}// In your renderer config builder:`,
    `${ind}.addRenderLayer(`,
    `${ind}${ind}new AzAttachmentLayer<UUID, ${E}>()`,
  ];
  for (const s of rig.sockets) {
    lines.push(`${ind}${ind}${ind}.attach(${E}.${constantName(socketName(s))}, (context, bone) -> {`);
    lines.push(`${ind}${ind}${ind}${ind}// TODO: draw at the ${js(socketName(s))} socket, or use AzAttachment.item(...) / AzAttachment.block(...)`);
    lines.push(`${ind}${ind}${ind}})`);
  }
  lines.push(`${ind})`);

  return section(`${E}Renderer: attachments`, importsBlock(o.target, ['AzAttachmentLayer', 'AzAttachment', 'UUID'], o.packageRoot), lines.join('\n'));
}

function generateAll(rig, options = {}) {
  options = { ...options, target: normalizeTarget(options.target) };
  return [
    generateEntitySection(rig, options),
    generatePoseModifierSection(rig, options),
    generateBlendSpaceSection(rig, options),
    generateAttachmentSection(rig, options),
  ].filter(Boolean);
}

function generateText(rig, options = {}) {
  const o = { ...DEFAULT_OPTIONS, ...options, target: normalizeTarget(options.target) };
  const sections = generateAll(rig, o);
  if (!sections.length) return '// Nothing to generate yet: add hitboxes, sockets, IK, spring bones or blend spaces first.\n';

  return [
    `// Generated by the AzureLib Animator Blockbench plugin for AzureLib ${CODEGEN_TARGETS[o.target]} (${packageRoot(o.target, o.packageRoot)}).`,
    '// Paste each section into the class named in its header.',
    '',
    ...sections.map(s => [
      `// ===== ${s.title} =====`,
      s.imports,
      '',
      s.body,
    ].join('\n')),
  ].join('\n');
}

;// ./rig/azure-rig-panel.js
/**
 * AzureLib Animator — Rig Panel
 * ------------------------------
 * The "AzureLib Rig" panel: create and edit hitboxes, sockets, IK chains,
 * look-at chains, constraints, spring bones and blend spaces; toggle their
 * viewport preview; validate the rig; and generate AzureLib code.
 *
 * Every edit goes through RigStore.edit, so it is undoable and saved with the
 * project.
 *
 * © 2026 AzureDoom — MIT License
 */






/** Selected bones from every selection source Blockbench has used (4.x and 5.x, Edit and Animate). */
function selectedGroups() {
  const sources = [
    ...(Outliner.selected || []),
    ...(Array.isArray(Group.selected) ? Group.selected : [Group.selected]),
    ...(Group.multi_selected || []),
    ...Group.all.filter(g => g.selected),
  ];
  return [...new Set(sources)].filter(el => el instanceof Group);
}

function selectedLocators() {
  if (typeof Locator === 'undefined') return [];
  return [...new Set([...(Outliner.selected || []), ...Locator.all.filter(l => l.selected)])]
    .filter(el => el instanceof Locator);
}

function depth(group) {
  let d = 0;
  for (let node = group.parent; node && node !== 'root'; node = node.parent) d++;
  return d;
}

/**
 * Bones for a chain from the selection, root first: several selected bones in
 * hierarchy order, or one selected bone plus its single-child descendants.
 */
function chainFromSelection() {
  const selected = selectedGroups();
  if (selected.length >= 2) return selected.slice().sort((a, b) => depth(a) - depth(b)).map(g => g.name);
  if (selected.length === 1) {
    const chain = [selected[0]];
    for (;;) {
      const kids = (chain[chain.length - 1].children || []).filter(c => c instanceof Group);
      if (kids.length !== 1) break;
      chain.push(kids[0]);
    }
    return chain.map(g => g.name);
  }
  return [];
}

function uniqueId(base, taken) {
  const used = new Set(taken);
  if (!used.has(base)) return base;
  for (let i = 2; ; i++) if (!used.has(`${base}_${i}`)) return `${base}_${i}`;
}

function modifierIds() {
  const r = RigStore.rig;
  return [...r.ikChains, ...r.lookAts, ...r.springBones].map(x => x.id);
}

const parseBones = text => String(text || '').split(/[\s,>]+/).map(s => s.trim()).filter(Boolean);
const toNumber = (v, fallback = 0) => (Number.isFinite(Number(v)) ? Number(v) : fallback);
const vec = v => [0, 1, 2].map(i => toNumber(v?.[i]));

const boneOptions = () => Object.fromEntries([['', '—'], ...Group.all.map(g => [g.name, g.name])]);
const locatorOptions = () => Object.fromEntries([['', '—'], ...(typeof Locator !== 'undefined' ? Locator.all : []).map(l => [l.name, l.name])]);
const animationOptions = () => Object.fromEntries((typeof Animation !== 'undefined' ? Animation.all : []).map(a => [a.name, a.name]));

function openForm(title, form, onConfirm, lines = []) {
  new Dialog({
    id: 'azurelib_rig_edit',
    title,
    width: 520,
    lines,
    form,
    onConfirm(result) {
      onConfirm(result);
    },
  }).show();
}

function editHitbox(index) {
  const h = RigStore.rig.hitboxes[index];
  openForm(`Hitbox: ${h.name}`, {
    name: { label: 'Name', type: 'text', value: h.name },
    bone: { label: 'Bone', type: 'select', options: boneOptions(), value: h.bone },
    role: { label: 'Role', type: 'select', options: Object.fromEntries(HITBOX_ROLES.map(r => [r, r.charAt(0) + r.slice(1).toLowerCase()])), value: h.role },
    fit: { label: 'Fit to bone cubes', type: 'checkbox', value: h.fit },
    size: { label: 'Size (pixels)', type: 'vector', dimensions: 3, value: h.size, condition: f => !f.fit },
    offset: { label: 'Offset (pixels)', type: 'vector', dimensions: 3, value: h.offset },
    inflate: { label: 'Inflate (pixels)', type: 'number', value: h.inflate, step: 0.25 },
    anchorAtPivot: { label: 'Center on pivot', type: 'checkbox', value: h.anchorAtPivot },
    damageMultiplier: { label: 'Damage multiplier', type: 'number', value: h.damageMultiplier, step: 0.1, min: 0, condition: f => f.role === 'COMBAT' },
    tags: { label: 'Tags (comma separated)', type: 'text', value: h.tags.join(', ') },
  }, r => RigStore.edit('Edit hitbox', rig => {
    Object.assign(rig.hitboxes[index], {
      name: r.name.trim() || r.bone,
      bone: r.bone,
      role: r.role,
      fit: r.fit,
      size: vec(r.size),
      offset: vec(r.offset),
      inflate: toNumber(r.inflate),
      anchorAtPivot: r.anchorAtPivot,
      damageMultiplier: toNumber(r.damageMultiplier, 1),
      tags: r.tags.split(',').map(t => t.trim()).filter(Boolean),
    });
  }), ['<p>Hitboxes follow their bone. Without a size, AzureLib fits the box to the bone\'s own cubes.</p>']);
}

function editHitboxes(indices) {
  const list = indices.map(i => RigStore.rig.hitboxes[i]).filter(Boolean);
  if (!list.length) return;
  const names = list.map(h => h.name);
  const keep = { '': '(unchanged)' };
  const roles = { ...keep, ...Object.fromEntries(HITBOX_ROLES.map(r => [r, r.charAt(0) + r.slice(1).toLowerCase()])) };
  const allTags = [...new Set(list.flatMap(h => h.tags || []))];

  openForm(`Edit ${list.length} hitboxes`, {
    role: { label: 'Role', type: 'select', options: roles, value: '' },
    damageMultiplier: { label: 'Damage multiplier', type: 'text', value: '', placeholder: '(unchanged)' },
    inflate: { label: 'Inflate (pixels)', type: 'text', value: '', placeholder: '(unchanged)' },
    sizing: { label: 'Size', type: 'select', options: { '': '(unchanged)', fit: 'Fit to bone cubes', size: 'Set a size' }, value: '' },
    size: { label: 'Size (pixels)', type: 'vector', dimensions: 3, value: [4, 4, 4], condition: f => f.sizing === 'size' },
    anchorAtPivot: { label: 'Center on pivot', type: 'select', options: { '': '(unchanged)', on: 'On', off: 'Off' }, value: '' },
    clearTags: { label: 'Remove all existing tags first', type: 'checkbox', value: false },
    addTags: { label: 'Add tags (comma separated)', type: 'text', value: '' },
    removeTags: { label: 'Remove tags (comma separated)', type: 'text', value: '', placeholder: allTags.join(', ') },
  }, r => {
    const number = text => {
      const t = String(text ?? '').trim();
      if (!t) return undefined;
      const n = Number(t);
      return Number.isFinite(n) ? n : undefined;
    };
    const tagList = text => String(text || '').split(',').map(t => t.trim()).filter(Boolean);
    const damage = number(r.damageMultiplier);
    const inflate = number(r.inflate);
    const add = tagList(r.addTags);
    const remove = new Set(tagList(r.removeTags));

    RigStore.edit(`Edit ${list.length} hitboxes`, rig => {
      for (const i of indices) {
        const h = rig.hitboxes[i];
        if (!h) continue;
        if (r.role) h.role = r.role;
        if (damage !== undefined) h.damageMultiplier = Math.max(0, damage);
        if (inflate !== undefined) h.inflate = inflate;
        if (r.sizing === 'fit') h.fit = true;
        if (r.sizing === 'size') { h.fit = false; h.size = vec(r.size); }
        if (r.anchorAtPivot) h.anchorAtPivot = r.anchorAtPivot === 'on';
        let tags = r.clearTags ? [] : (h.tags || []).filter(t => !remove.has(t));
        for (const t of add) if (!tags.includes(t)) tags.push(t);
        h.tags = tags;
      }
    });
  }, [`<p>Editing ${names.length > 8 ? `${names.slice(0, 8).join(', ')} and ${names.length - 8} more` : names.join(', ')}. Fields left as they are keep each hitbox\'s own value.</p>`]);
}

function editSocket(index) {
  const s = RigStore.rig.sockets[index];
  openForm(`Socket: ${s.locator || s.name}`, {
    follows: { label: 'Follows', type: 'select', options: { bone: 'A bone', locator: 'A Blockbench locator' }, value: s.locator ? 'locator' : 'bone' },
    name: { label: 'Name', type: 'text', value: s.name, condition: f => f.follows === 'bone' },
    bone: { label: 'Bone', type: 'select', options: boneOptions(), value: s.bone || '', condition: f => f.follows === 'bone' },
    locator: { label: 'Locator', type: 'select', options: locatorOptions(), value: s.locator || '', condition: f => f.follows === 'locator' },
    offset: { label: 'Offset (pixels, bone axes)', type: 'vector', dimensions: 3, value: s.offset },
    rotation: { label: 'Rotation (degrees)', type: 'vector', dimensions: 3, value: s.rotation },
    serverHitbox: { label: 'Server anchor hitbox', type: 'text', value: s.serverHitbox, placeholder: 'e.g. muzzle_anchor (optional)' },
  }, r => RigStore.edit('Edit socket', rig => {
    const target = rig.sockets[index];
    const isLocator = r.follows === 'locator';
    Object.assign(target, {
      name: isLocator ? r.locator : (r.name.trim() || 'socket'),
      bone: isLocator ? null : r.bone,
      locator: isLocator ? r.locator : null,
      offset: vec(r.offset),
      rotation: vec(r.rotation),
      serverHitbox: r.serverHitbox.trim(),
    });
  }), ['<p>The arrow in the viewport is the socket\'s front (-Z); the short arrow is up. A server anchor hitbox lets the server resolve the socket too.</p>']);
}

function targetForm(t, kinds) {
  return {
    targetType: { label: 'Target', type: 'select', options: Object.fromEntries(kinds.map(k => [k, IK_TARGETS[k]])), value: t.type },
    stepUp: { label: 'Max step up (blocks)', type: 'number', value: t.stepUp ?? 0.5, step: 0.05, condition: f => f.targetType === 'ground' },
    stepDown: { label: 'Max step down (blocks)', type: 'number', value: t.stepDown ?? 0.75, step: 0.05, condition: f => f.targetType === 'ground' },
    targetPoint: { label: 'Model point (pixels)', type: 'vector', dimensions: 3, value: t.point, condition: f => f.targetType === 'model' },
    targetBone: { label: 'Bone to follow', type: 'select', options: boneOptions(), value: t.bone || '', condition: f => f.targetType === 'bone' },
    boneOffset: { label: 'Offset from its pivot (pixels)', type: 'vector', dimensions: 3, value: t.type === 'bone' ? t.point : [0, 0, 0], condition: f => f.targetType === 'bone' },
    _boneHint: { type: 'info', text: 'Use an empty bone outside this chain and animate its position; the limb reaches for it.', condition: f => f.targetType === 'bone' },
  };
}

function previewForm(p, allowGround) {
  const modes = { off: 'Off', point: 'Fixed point', locator: 'Follow a locator' };
  if (allowGround) modes.ground = 'Ground (raised by offset)';
  return {
    _preview: { type: 'info', text: '<b>Viewport preview</b> (Animate mode)' },
    _previewBone: { type: 'info', text: 'The preview follows the bone itself.', condition: f => f.targetType === 'bone' },
    previewMode: { label: 'Preview target', type: 'select', options: modes, value: p.enabled === false ? 'off' : p.mode, condition: f => f.targetType !== 'bone' },
    groundHeight: { label: 'Ground offset (pixels)', type: 'number', value: p.groundHeight ?? 0, condition: f => f.targetType !== 'bone' && f.previewMode === 'ground' },
    previewPoint: { label: 'Point (pixels)', type: 'vector', dimensions: 3, value: p.point, condition: f => f.targetType !== 'bone' && f.previewMode === 'point' },
    previewLocator: { label: 'Locator', type: 'select', options: locatorOptions(), value: p.locator || '', condition: f => f.targetType !== 'bone' && f.previewMode === 'locator' },
  };
}

function readPreview(r) {
  return {
    enabled: r.previewMode !== 'off',
    mode: r.previewMode === 'off' ? 'point' : r.previewMode,
    groundHeight: toNumber(r.groundHeight),
    point: vec(r.previewPoint),
    locator: r.previewLocator || '',
  };
}

function readTarget(r) {
  const bone = r.targetType === 'bone';
  return {
    type: r.targetType,
    stepUp: toNumber(r.stepUp, 0.5),
    stepDown: toNumber(r.stepDown, 0.75),
    point: vec(bone ? r.boneOffset : r.targetPoint),
    bone: bone ? (r.targetBone || '') : '',
  };
}

function editIkChain(index) {
  const c = RigStore.rig.ikChains[index];
  openForm(`IK chain: ${c.id}`, {
    id: { label: 'Modifier id', type: 'text', value: c.id },
    bones: { label: 'Bones (root first)', type: 'text', value: c.bones.join(', ') },
    effector: { label: 'Effector (pixels from last bone pivot)', type: 'vector', dimensions: 3, value: c.effector },
    solver: { label: 'Solver', type: 'select', options: IK_SOLVERS, value: c.solver },
    usePole: { label: 'Use pole (two-bone)', type: 'checkbox', value: !!c.pole, condition: f => f.solver !== 'ccd' },
    pole: { label: 'Pole (model pixels)', type: 'vector', dimensions: 3, value: c.pole || [0, 8, -20], condition: f => f.usePole && f.solver !== 'ccd' },
    iterations: { label: 'Iterations', type: 'number', value: c.iterations, min: 1, max: 64, condition: f => f.solver !== 'two_bone' },
    tolerance: { label: 'Tolerance (pixels)', type: 'number', value: c.tolerance, step: 0.05, condition: f => f.solver !== 'two_bone' },
    ...targetForm(c.target, ['ground', 'bone', 'entity_eyes', 'world', 'model']),
    priority: { label: 'Priority', type: 'number', value: c.priority },
    weight: { label: 'Default weight', type: 'number', value: c.weight, min: 0, max: 1, step: 0.05 },
    ...previewForm(c.preview, true),
  }, r => RigStore.edit('Edit IK chain', rig => {
    Object.assign(rig.ikChains[index], {
      id: r.id.trim() || c.id,
      bones: parseBones(r.bones),
      effector: vec(r.effector),
      solver: r.solver,
      pole: r.usePole && r.solver !== 'ccd' ? vec(r.pole) : null,
      iterations: Math.max(1, Math.round(toNumber(r.iterations, 10))),
      tolerance: toNumber(r.tolerance, 0.1),
      target: readTarget(r),
      priority: Math.round(toNumber(r.priority)),
      weight: Math.min(1, Math.max(0, toNumber(r.weight, 1))),
      preview: readPreview(r),
    });
  }), ['<p>Constraints on chain bones are applied by the solver automatically.</p>']);
}

function editLookAt(index) {
  const l = RigStore.rig.lookAts[index];
  openForm(`Look-at: ${l.id}`, {
    id: { label: 'Modifier id', type: 'text', value: l.id },
    bones: { label: 'Bones (root first, last one faces the target)', type: 'text', value: l.bones.join(', ') },
    forward: { label: 'Forward (last bone axes)', type: 'vector', dimensions: 3, value: l.forward },
    ...targetForm(l.target, ['entity_eyes', 'bone', 'world', 'model']),
    priority: { label: 'Priority', type: 'number', value: l.priority },
    weight: { label: 'Default weight', type: 'number', value: l.weight, min: 0, max: 1, step: 0.05 },
    ...previewForm(l.preview, false),
  }, r => RigStore.edit('Edit look-at', rig => {
    Object.assign(rig.lookAts[index], {
      id: r.id.trim() || l.id,
      bones: parseBones(r.bones),
      forward: vec(r.forward),
      target: readTarget(r),
      priority: Math.round(toNumber(r.priority)),
      weight: Math.min(1, Math.max(0, toNumber(r.weight, 1))),
      preview: readPreview(r),
    });
  }));
}

function editConstraint(index) {
  const c = RigStore.rig.constraints[index];
  openForm(`Constraint: ${c.bone}`, {
    bone: { label: 'Bone', type: 'select', options: boneOptions(), value: c.bone },
    type: { label: 'Type', type: 'select', options: CONSTRAINT_TYPES, value: c.type },
    min: { label: 'Min (degrees)', type: 'vector', dimensions: 3, value: c.min },
    max: { label: 'Max (degrees)', type: 'vector', dimensions: 3, value: c.max },
    standalone: { label: 'Also clamp the final pose', type: 'checkbox', value: c.standalone },
  }, r => RigStore.edit('Edit constraint', rig => {
    Object.assign(rig.constraints[index], {
      bone: r.bone,
      type: r.type,
      min: vec(r.min),
      max: vec(r.max),
      standalone: r.standalone,
    });
  }), ['<p>Degrees relative to the bone\'s rest pose, with the signs of the exported animation file: for X and Y that\'s the opposite of what Blockbench 5 shows on keyframes (Z is the same). Hinges use only their own axis. IK, look-at and spring bones on this bone respect it; "clamp the final pose" also clamps the animation itself.</p>']);
}

function editSpring(index) {
  const s = RigStore.rig.springBones[index];
  openForm(`Spring bones: ${s.id}`, {
    id: { label: 'Modifier id', type: 'text', value: s.id },
    bones: { label: 'Bones (root first)', type: 'text', value: s.bones.join(', ') },
    useTip: { label: 'Last bone swings (tip)', type: 'checkbox', value: !!s.tip },
    tip: { label: 'Tip (pixels from last bone pivot)', type: 'vector', dimensions: 3, value: s.tip || [0, 0, 4], condition: f => f.useTip },
    stiffness: { label: 'Stiffness (0–1)', type: 'number', value: s.stiffness, min: 0, max: 1, step: 0.05 },
    damping: { label: 'Damping (0–1)', type: 'number', value: s.damping, min: 0, max: 1, step: 0.05 },
    gravity: { label: 'Gravity (blocks/tick²)', type: 'number', value: s.gravity, step: 0.001 },
    inertia: { label: 'Inertia (0–1)', type: 'number', value: s.inertia, min: 0, max: 1, step: 0.05 },
    priority: { label: 'Priority', type: 'number', value: s.priority },
    colliders: { label: 'Colliders (comma separated ids)', type: 'text', value: (s.colliders || []).join(', ') },
    radius: { label: 'Chain radius (pixels)', type: 'number', value: s.radius || 0, min: 0, step: 0.25 },
    ground: { label: 'Stay above the ground', type: 'checkbox', value: !!s.ground },
    previewEnabled: { label: 'Preview while animating', type: 'checkbox', value: s.preview?.enabled !== false },
  }, r => RigStore.edit('Edit spring bones', rig => {
    Object.assign(rig.springBones[index], {
      id: r.id.trim() || s.id,
      bones: parseBones(r.bones),
      tip: r.useTip ? vec(r.tip) : null,
      stiffness: Math.min(1, Math.max(0, toNumber(r.stiffness, 0.2))),
      damping: Math.min(1, Math.max(0, toNumber(r.damping, 0.25))),
      gravity: toNumber(r.gravity),
      inertia: Math.min(1, Math.max(0, toNumber(r.inertia, 1))),
      priority: Math.round(toNumber(r.priority, 200)),
      colliders: parseBones(r.colliders),
      radius: Math.max(0, toNumber(r.radius)),
      ground: r.ground,
      preview: { enabled: r.previewEnabled },
    });
  }), [
    '<p>The first bone follows the animation and anchors the chain. Play the animation to see the swing; inertia only affects entities moving in game.</p>',
    `<p>Colliders here: ${RigStore.rig.colliders.length ? RigStore.rig.colliders.map(c => `<code>${c.id}</code>`).join(', ') : '<i>none yet; add them in the Colliders section</i>'}. The chain radius is roughly how thick the chain is; it keeps it off colliders and the ground.</p>`,
  ]);
}

function editCollider(index) {
  const c = RigStore.rig.colliders[index];
  openForm(`Collider: ${c.id}`, {
    id: { label: 'Id', type: 'text', value: c.id },
    bone: { label: 'Bone', type: 'select', options: boneOptions(), value: c.bone },
    shape: { label: 'Shape', type: 'select', options: { sphere: 'Sphere', capsule: 'Capsule' }, value: c.shape },
    start: { label: 'Centre (pixels)', type: 'vector', dimensions: 3, value: c.start, condition: f => f.shape === 'sphere' },
    capStart: { label: 'Start (pixels)', type: 'vector', dimensions: 3, value: c.start, condition: f => f.shape === 'capsule' },
    end: { label: 'End (pixels)', type: 'vector', dimensions: 3, value: c.end, condition: f => f.shape === 'capsule' },
    radius: { label: 'Radius (pixels)', type: 'number', value: c.radius, min: 0.1, step: 0.25 },
  }, r => RigStore.edit('Edit collider', rig => {
    const oldId = rig.colliders[index].id;
    const id = r.id.trim() || oldId;
    Object.assign(rig.colliders[index], {
      id,
      bone: r.bone,
      shape: r.shape,
      start: vec(r.shape === 'capsule' ? r.capStart : r.start),
      end: vec(r.shape === 'capsule' ? r.end : r.start),
      radius: Math.max(0.1, toNumber(r.radius, 2)),
    });
    // Keep spring chains pointing at a renamed collider.
    if (id !== oldId) {
      for (const sb of rig.springBones) sb.colliders = (sb.colliders || []).map(x => (x === oldId ? id : x));
    }
  }), ['<p>Positions are pixels from the bone\'s pivot along its axes. Spring chains that list this collider swing around it instead of through it.</p>']);
}

function samplesToText(b) {
  return b.samples.map(s => (b.dimensions === 2 ? `${s.x}, ${s.y}, ${s.animation}` : `${s.x}, ${s.animation}`)).join('\n');
}

function textToSamples(text, dimensions) {
  return String(text || '').split('\n').map(line => line.split(',').map(p => p.trim())).filter(p => p.length >= 2 && p[p.length - 1])
    .map(p => (dimensions === 2
      ? { x: toNumber(p[0]), y: toNumber(p[1]), animation: p.slice(2).join(',') }
      : { x: toNumber(p[0]), y: 0, animation: p.slice(1).join(',') }));
}

function editBlendSpace(index) {
  const b = RigStore.rig.blendSpaces[index];
  const animations = Object.keys(animationOptions());
  openForm(`Blend space: ${b.name}`, {
    name: { label: 'Name', type: 'text', value: b.name },
    dimensions: { label: 'Dimensions', type: 'select', options: { 1: '1D', 2: '2D' }, value: String(b.dimensions) },
    inputX: { label: 'Input (X)', type: 'select', options: BLEND_INPUTS, value: b.input.x },
    inputY: { label: 'Input (Y)', type: 'select', options: BLEND_INPUTS, value: b.input.y, condition: f => String(f.dimensions) === '2' },
    samples: { label: 'Samples', type: 'textarea', value: samplesToText(b), height: 120, placeholder: '1D: position, animation\n2D: x, y, animation' },
    smoothing: { label: 'Input smoothing (ticks)', type: 'number', value: b.smoothing, min: 0, step: 0.5 },
    syncPhase: { label: 'Sync phase', type: 'checkbox', value: b.syncPhase },
  }, r => RigStore.edit('Edit blend space', rig => {
    const dimensions = String(r.dimensions) === '2' ? 2 : 1;
    Object.assign(rig.blendSpaces[index], {
      name: r.name.trim() || b.name,
      dimensions,
      input: { x: r.inputX, y: r.inputY },
      samples: textToSamples(r.samples, dimensions),
      smoothing: Math.max(0, toNumber(r.smoothing)),
      syncPhase: r.syncPhase,
    });
  }), [`<p>One sample per line: <code>position, animation</code> for 1D, <code>x, y, animation</code> for 2D. Animations here: ${animations.length ? animations.map(a => `<code>${a}</code>`).join(', ') : '<i>none yet</i>'}.</p>`]);
}

function requireBones(names, what) {
  if (names.length) return true;
  Blockbench.showQuickMessage(`Select the bone(s) for the ${what} first.`, 2500);
  return false;
}

function fitCollider(bone) {
  const box = hitboxBox({ bone, fit: true, size: [0, 0, 0], offset: [0, 0, 0], inflate: 0, anchorAtPivot: false });
  if (!box) return { shape: 'sphere', start: [0, 0, 0], end: [0, 0, 0], radius: 2 };
  const round = v => Math.round(v * 100) / 100;
  const center = [box.center.x, box.center.y, box.center.z];
  const half = [box.half.x, box.half.y, box.half.z];
  const axis = half.indexOf(Math.max(...half));
  const radius = Math.max(...half.filter((_, i) => i !== axis));
  const reach = half[axis] - radius;
  if (reach < 0.5) {
    return { shape: 'sphere', start: center.map(round), end: center.map(round), radius: round(Math.max(...half)) };
  }
  const start = center.slice();
  const end = center.slice();
  start[axis] -= reach;
  end[axis] += reach;
  return { shape: 'capsule', start: start.map(round), end: end.map(round), radius: round(radius) };
}

const Add = {
  hitbox() {
    const groups = selectedGroups();
    if (!requireBones(groups, 'hitbox')) return;
    RigStore.edit('Add hitbox', rig => {
      for (const g of groups) {
        const h = newHitbox(g.name);
        h.name = uniqueId(g.name, rig.hitboxes.map(x => x.name));
        rig.hitboxes.push(h);
      }
    });
  },

  socket() {
    const locators = selectedLocators();
    const groups = selectedGroups();
    if (!locators.length && !groups.length) {
      Blockbench.showQuickMessage('Select a locator, or a bone to put the socket on.', 2500);
      return;
    }
    RigStore.edit('Add socket', rig => {
      const taken = () => rig.sockets.map(s => s.locator || s.name);
      for (const l of locators) {
        if (!rig.sockets.some(s => s.locator === l.name)) rig.sockets.push(newSocket(l.name, { locator: l.name }));
      }
      if (!locators.length) {
        for (const g of groups) rig.sockets.push(newSocket(uniqueId(`${g.name}_socket`, taken()), { bone: g.name }));
      }
    });
  },

  allLocators() {
    const locators = typeof Locator !== 'undefined' ? Locator.all : [];
    if (!locators.length) {
      Blockbench.showQuickMessage('This model has no locators.', 2000);
      return;
    }
    RigStore.edit('Add sockets for locators', rig => {
      for (const l of locators) {
        if (!rig.sockets.some(s => s.locator === l.name)) rig.sockets.push(newSocket(l.name, { locator: l.name }));
      }
    });
  },

  ikChain() {
    const bones = chainFromSelection();
    if (!requireBones(bones, 'IK chain')) return;
    RigStore.edit('Add IK chain', rig => {
      rig.ikChains.push(newIkChain(uniqueId(`${bones[0]}_ik`, modifierIds()), bones));
    });
    editIkChain(RigStore.rig.ikChains.length - 1);
  },

  lookAt() {
    const bones = chainFromSelection();
    if (!requireBones(bones, 'look-at')) return;
    RigStore.edit('Add look-at', rig => {
      rig.lookAts.push(newLookAt(uniqueId(`${bones[bones.length - 1]}_look`, modifierIds()), bones));
    });
  },

  constraint() {
    const groups = selectedGroups();
    if (!requireBones(groups, 'constraint')) return;
    RigStore.edit('Add constraint', rig => {
      for (const g of groups) {
        if (!rig.constraints.some(c => c.bone === g.name)) rig.constraints.push(newConstraint(g.name));
      }
    });
  },

  spring() {
    const bones = chainFromSelection();
    if (!requireBones(bones, 'spring chain')) return;
    RigStore.edit('Add spring bones', rig => {
      rig.springBones.push(newSpringBone(uniqueId(`${bones[0]}_spring`, modifierIds()), bones));
    });
  },

  collider() {
    const groups = selectedGroups();
    if (!requireBones(groups, 'collider')) return;
    RigStore.edit('Add collider', rig => {
      for (const g of groups) {
        const c = newCollider(uniqueId(g.name, rig.colliders.map(x => x.id)), g.name);
        Object.assign(c, fitCollider(g.name));
        rig.colliders.push(c);
      }
    });
  },

  blendSpace() {
    RigStore.edit('Add blend space', rig => {
      rig.blendSpaces.push(newBlendSpace(uniqueId('locomotion', rig.blendSpaces.map(b => b.name))));
    });
    editBlendSpace(RigStore.rig.blendSpaces.length - 1);
  },
};

function showValidation() {
  const issues = validateRig();
  new Dialog({
    id: 'azurelib_rig_validation',
    title: 'AzureLib Rig Check',
    width: 560,
    lines: [issues.length
      ? `<ul style="padding-left:18px;line-height:1.6">${issues.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`
      : '<p>No problems found.</p>'],
    buttons: ['dialog.close'],
  }).show();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function showCodeExport() {
  const rig = RigStore.rig;
  const issues = validateRig();

  new Dialog({
    id: 'azurelib_rig_codegen',
    title: 'Generate AzureLib Code',
    width: 560,
    lines: issues.length
      ? [`<p style="color:var(--color-warning, #e8b400)">${issues.length} problem(s) found. The code is generated anyway; run <b>Check Rig</b> to see them.</p>`]
      : [],
    form: {
      target: { label: 'AzureLib branch', type: 'select', options: CODEGEN_TARGETS, value: normalizeTarget(rig.codegen.target) },
      entityClass: { label: 'Animatable class', type: 'text', value: rig.codegen.entityClass },
      packageRoot: { label: 'Package root', type: 'text', value: rig.codegen.packageRoot || '', placeholder: 'Leave blank for the branch default' },
      _roots: {
        type: 'info',
        text: `Defaults: ${Object.values(TARGETS).map(t => `${t.label} <code>${t.root}</code>`).join(', ')}.`,
      },
    },
    onConfirm(form) {
      const entityClass = (form.entityClass || '').trim().replace(/[^A-Za-z0-9_$]/g, '') || 'ExampleEntity';
      const packageRoot = (form.packageRoot || '').trim().replace(/[^A-Za-z0-9_.]/g, '').replace(/^[.]+|[.]+$/g, '');
      RigStore.edit('Code generation settings', r => { r.codegen = { target: form.target, entityClass, packageRoot }; });
      const text = generateText(RigStore.rig, { target: form.target, entityClass, packageRoot });
      showCodeResult(text, entityClass);
    },
  }).show();
}

function showCodeResult(text, entityClass) {
  const dialog = new Dialog({
    id: 'azurelib_rig_code',
    title: 'AzureLib Code',
    width: 900,
    form: {
      code: { type: 'textarea', value: text, height: 460 },
    },
    buttons: ['Copy', 'Save .java', 'dialog.close'],
    onButton(index) {
      if (index === 0) {
        const copy = navigator.clipboard?.writeText?.(text);
        if (copy) {
          copy.then(() => Blockbench.showQuickMessage('Copied to clipboard', 1500));
        } else {
          Blockbench.showQuickMessage('Clipboard unavailable; select the text and copy it instead.', 2500);
        }
        return false;
      }
      if (index === 1) {
        Blockbench.export({
          type: 'Java Source',
          extensions: ['java'],
          name: `${entityClass}Rig`,
          content: text,
        });
        return false;
      }
      return true;
    },
  });
  dialog.show();
}

const PANEL_ID = 'azurelib_rig';
const STYLE_ID = 'azurelib-rig-style';

let panel = null;
let actions = [];
let azure_rig_panel_unsubscribe = null;
let onModeChange = null;
let onModelChange = null;

const PANEL_CSS = `
.azl-rig {
  padding: 4px 6px 0; font-size: 12px; line-height: 1.35;
  display: flex; flex-direction: column; flex: 1 1 auto; height: 100%; min-height: 0; box-sizing: border-box;
}
.azl-rig .azl-scroll { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding-bottom: 8px; }
.azl-rig .azl-row.selected { background: var(--color-selected, rgba(70, 130, 255, .25)); }
.azl-rig .azl-row.selected:hover { background: var(--color-selected, rgba(70, 130, 255, .32)); }
.azl-rig .azl-selbar {
  display: flex; align-items: center; gap: 4px; margin: 2px 0 2px 18px; padding: 2px 6px; border-radius: 4px;
  background: var(--color-button); font-size: 11px;
}
.azl-rig .azl-selbar .azl-btn { height: 18px; line-height: 18px; padding: 0 6px; font-size: 11px; }
.azl-rig .azl-bar { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; flex-wrap: wrap; flex: none; }
.azl-rig .azl-spacer { flex: 1; }
.azl-rig .azl-btn {
  height: 22px; min-width: 0; padding: 0 8px; font-size: 12px; line-height: 22px;
  border-radius: 4px; background: var(--color-button); color: var(--color-text); cursor: pointer;
}
.azl-rig .azl-btn:hover { background: var(--color-accent); color: var(--color-accent_text); }
.azl-rig .azl-badge {
  display: inline-block; margin-left: 4px; padding: 0 5px; border-radius: 8px; font-size: 10px; line-height: 15px;
  background: var(--color-warning, #e8b400); color: #000;
}
.azl-rig .azl-chip {
  padding: 0 6px; height: 20px; line-height: 20px; border-radius: 10px; font-size: 11px; cursor: pointer;
  border: 1px solid var(--color-border); color: var(--color-subtle_text); user-select: none;
}
.azl-rig .azl-chip.on { border-color: var(--color-accent); color: var(--color-text); }
.azl-rig .azl-hint { color: var(--color-subtle_text); padding: 2px 4px 6px; }
.azl-rig .azl-head {
  display: flex; align-items: center; gap: 4px; height: 22px; padding: 0 4px; margin-top: 2px;
  border-radius: 4px; cursor: pointer; user-select: none;
}
.azl-rig .azl-head:hover { background: var(--color-button); }
.azl-rig .azl-caret { width: 10px; color: var(--color-subtle_text); font-size: 10px; }
.azl-rig .azl-title { font-weight: 600; }
.azl-rig .azl-count { color: var(--color-subtle_text); font-size: 11px; }
.azl-rig .azl-add, .azl-rig .azl-del {
  width: 18px; height: 18px; line-height: 17px; text-align: center; border-radius: 3px; cursor: pointer;
  color: var(--color-subtle_text); font-size: 15px;
}
.azl-rig .azl-add:hover { background: var(--color-accent); color: var(--color-accent_text); }
.azl-rig .azl-add.small { width: auto; padding: 0 4px; font-size: 11px; }
.azl-rig .azl-row {
  display: flex; align-items: center; gap: 6px; height: 21px; padding: 0 4px 0 18px; border-radius: 4px; cursor: pointer;
}
.azl-rig .azl-row:hover { background: var(--color-button); }
.azl-rig .azl-dot { width: 8px; height: 8px; border-radius: 2px; flex: none; }
.azl-rig .azl-name { flex: none; max-width: 55%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.azl-rig .azl-detail { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--color-subtle_text); font-size: 11px; }
.azl-rig .azl-detail.warn { color: var(--color-warning, #e8b400); }
.azl-rig .azl-del { visibility: hidden; }
.azl-rig .azl-row:hover .azl-del { visibility: visible; }
.azl-rig .azl-del:hover { color: var(--color-close, #e66); }
.azl-rig .azl-sub { padding: 2px 4px 4px 18px; color: var(--color-subtle_text); font-size: 11px; }
.azl-rig .azl-sub label { margin-right: 10px; cursor: pointer; }
.azl-rig .azl-sub input[type=range] { width: 100%; height: 16px; margin: 0; }
.azl-rig .azl-weights { display: flex; flex-wrap: wrap; gap: 2px 10px; margin-top: 2px; }
`;

function injectStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = PANEL_CSS;
  document.head.appendChild(style);
}

function removeStyle() {
  document.getElementById(STYLE_ID)?.remove();
}

const SECTIONS = [
  { key: 'hitboxes', title: 'Hitboxes', add: 'hitbox', addTitle: 'Add a hitbox to each selected bone' },
  { key: 'sockets', title: 'Sockets', add: 'socket', addTitle: 'Add a socket for the selected locator or bone' },
  { key: 'ikChains', title: 'IK chains', add: 'ikChain', addTitle: 'Add an IK chain from the selected bones (root → tip, or just the root)' },
  { key: 'lookAts', title: 'Look-at', add: 'lookAt', addTitle: 'Add a look-at from the selected bones (e.g. neck, head)' },
  { key: 'constraints', title: 'Constraints', add: 'constraint', addTitle: 'Add a rotation limit to each selected bone' },
  { key: 'springBones', title: 'Spring bones', add: 'spring', addTitle: 'Add a spring chain from the selected bones (root → tip, or just the root)' },
  { key: 'colliders', title: 'Colliders', add: 'collider', addTitle: 'Add a collider fitted to each selected bone, for spring bones to swing around' },
  { key: 'blendSpaces', title: 'Blend spaces', add: 'blendSpace', addTitle: 'Add a blend space' },
];

const EDITORS = {
  hitboxes: editHitbox,
  sockets: editSocket,
  ikChains: editIkChain,
  lookAts: editLookAt,
  constraints: editConstraint,
  springBones: editSpring,
  colliders: editCollider,
  blendSpaces: editBlendSpace,
};

const SECTION_COLORS = {
  sockets: '#ff55ff',
  ikChains: '#00ff88',
  lookAts: '#44aaff',
  constraints: '#ff9900',
  springBones: '#aa66ff',
  colliders: '#ff8a3d',
  blendSpaces: '#ffaa00',
};

/** Which sections are expanded; null means "open if it has entries". Kept for the session. */
const sectionOpen = Object.fromEntries(SECTIONS.map(sec => [sec.key, null]));

function registerPanel() {
  injectStyle();

  panel = new Panel(PANEL_ID, {
    name: 'AzureLib Rig',
    icon: 'accessibility_new',
    display_condition: { modes: ['edit', 'animate'], formats: ['azure_model'] },
    default_position: {
      slot: 'right_bar',
      float_position: [0, 0],
      float_size: [320, 480],
      height: 360,
      folded: false,
      attached_to: 'outliner',
    },
    component: {
      name: 'azl-rig-panel',
      data() {
        return {
          rig: RigStore.rig,
          preview: PreviewSettings,
          sections: SECTIONS,
          open: sectionOpen,
          blend: { index: -1, x: 0, y: 0 },
          sel: { key: null, items: [], anchor: null, count: 0 },
          version: 0,
          mode: typeof Modes !== 'undefined' && Modes.selected ? Modes.selected.id : '',
        };
      },
      mounted() {
        this._off = RigStore.onChange(rig => {
          this.rig = rig;
          if (this.blend.index >= rig.blendSpaces.length) this.stopBlend();
          // Entries added or removed: the selected indices would point at the wrong rows.
          if (this.sel.key && rig[this.sel.key].length !== this.sel.count) this.clearSelection();
          this.version++;
        });
      },
      beforeDestroy() {
        this._off?.();
      },
      computed: {
        boneSet() { this.version; return new Set(Group.all.map(g => g.name)); },
        locatorSet() { this.version; return new Set((typeof Locator !== 'undefined' ? Locator.all : []).map(l => l.name)); },
        issueCount() { this.version; return validateRig(this.rig).length; },
        isEmpty() { return SECTIONS.every(sec => !this.rig[sec.key].length); },
        isAnimate() { return this.mode === 'animate'; },
        blendRange() {
          const b = this.blend.index >= 0 ? this.rig.blendSpaces[this.blend.index] : null;
          return b ? blendSpaceRange(b) : { x: [0, 1], y: [0, 1] };
        },
        blendWeights() { this.blend.x; this.blend.y; this.blend.index; return BlendPreview.weights(); },
      },
      methods: {
        isOpen(key) {
          const state = this.open[key];
          return state === null ? this.rig[key].length > 0 : state;
        },
        toggle(key) {
          this.open[key] = !this.isOpen(key);
        },
        add(kind, key) {
          Add[kind]();
          if (key) this.open[key] = true;
        },
        rowClick(key, index, event) {
          const toggle = event.ctrlKey || event.metaKey;
          const range = event.shiftKey;
          if (!toggle && !range) {
            this.clearSelection();
            this.edit(key, index);
            return;
          }
          if (this.sel.key !== key) {
            this.sel.key = key;
            this.sel.items = [];
            this.sel.anchor = null;
          }
          this.sel.count = this.rig[key].length;
          if (range && this.sel.anchor !== null) {
            const from = Math.min(this.sel.anchor, index);
            const to = Math.max(this.sel.anchor, index);
            for (let i = from; i <= to; i++) if (!this.sel.items.includes(i)) this.sel.items.push(i);
          } else {
            const at = this.sel.items.indexOf(index);
            if (at >= 0) this.sel.items.splice(at, 1);
            else this.sel.items.push(index);
            this.sel.anchor = index;
          }
          if (!this.sel.items.length) this.clearSelection();
        },
        isSelected(key, index) {
          return this.sel.key === key && this.sel.items.includes(index);
        },
        clearSelection() {
          this.sel.key = null;
          this.sel.items = [];
          this.sel.anchor = null;
          this.sel.count = 0;
        },
        selectAll(key) {
          this.sel.key = key;
          this.sel.items = this.rig[key].map((_, i) => i);
          this.sel.count = this.rig[key].length;
        },
        bulkEdit() {
          if (this.sel.key === 'hitboxes') editHitboxes(this.sel.items.slice().sort((a, b) => a - b));
        },
        bulkDelete() {
          const key = this.sel.key;
          const indices = this.sel.items.slice().sort((a, b) => b - a);
          if (!key || !indices.length) return;
          if (key === 'blendSpaces' && indices.includes(this.blend.index)) this.stopBlend();
          this.clearSelection();
          RigStore.edit(`Remove ${indices.length} entries`, rig => {
            for (const i of indices) {
              const [removed] = rig[key].splice(i, 1);
              // Spring chains stop using a removed collider.
              if (key === 'colliders' && removed) {
                for (const sb of rig.springBones) sb.colliders = (sb.colliders || []).filter(id => id !== removed.id);
              }
            }
          });
        },
        remove(key, index) {
          if (key === 'blendSpaces' && this.blend.index === index) this.stopBlend();
          RigStore.edit('Remove entry', rig => {
            const [removed] = rig[key].splice(index, 1);
            // Spring chains stop using a removed collider.
            if (key === 'colliders' && removed) {
              for (const sb of rig.springBones) sb.colliders = (sb.colliders || []).filter(id => id !== removed.id);
            }
          });
        },
        edit(key, index) {
          EDITORS[key](index);
        },
        missing(names) { return names.filter(n => !this.boneSet.has(n)); },
        color(key, item) {
          if (key !== 'hitboxes') return SECTION_COLORS[key];
          if (item.role === 'INTERACT') return '#55ffff';
          if (item.role === 'ANCHOR') return '#ffff55';
          if (item.damageMultiplier > 1) return '#ff5555';
          if (item.damageMultiplier < 1) return '#5599ff';
          return '#55ff55';
        },
        label(key, item) {
          if (key === 'hitboxes') return item.name;
          if (key === 'sockets') return item.locator || item.name;
          if (key === 'constraints') return item.bone;
          if (key === 'blendSpaces') return item.name;
          return item.id;
        },
        detail(key, item) {
          switch (key) {
            case 'hitboxes': {
              const parts = [];
              if (item.name !== item.bone) parts.push(item.bone);
              if (item.role !== 'COMBAT') parts.push(item.role.toLowerCase());
              else if (item.damageMultiplier !== 1) parts.push(`×${item.damageMultiplier}`);
              if (!item.fit) parts.push(item.size.join('×'));
              return parts.join(' · ');
            }
            case 'sockets': return [item.locator ? 'locator' : item.bone, item.serverHitbox ? 'server' : ''].filter(Boolean).join(' · ');
            case 'ikChains': return `${item.bones.length} bones · ${item.target.type === 'bone' ? `follows ${item.target.bone || '?'}` : item.target.type.replace('_', ' ')}`;
            case 'lookAts': return item.bones.join(' › ');
            case 'constraints': return `${item.type.replace('_', ' ')}${item.standalone ? ' · clamps pose' : ''}`;
            case 'springBones': {
              const extras = [];
              if ((item.colliders || []).length) extras.push(`${item.colliders.length} collider${item.colliders.length === 1 ? '' : 's'}`);
              if (item.ground) extras.push('ground');
              return [`${item.bones.length} bones`, ...extras].join(' · ');
            }
            case 'colliders': return `${item.shape} · ${item.bone} · r${item.radius}`;
            case 'blendSpaces': return `${item.dimensions}D · ${item.samples.length} samples`;
            default: return '';
          }
        },
        warning(key, item) {
          this.version;
          switch (key) {
            case 'hitboxes':
              if (!this.boneSet.has(item.bone)) return `missing bone ${item.bone}`;
              return hitboxBox(item) ? '' : 'empty box';
            case 'sockets':
              if (item.locator) return this.locatorSet.has(item.locator) ? '' : 'missing locator';
              return this.boneSet.has(item.bone) ? '' : `missing bone ${item.bone}`;
            case 'constraints':
              return this.boneSet.has(item.bone) ? '' : 'missing bone';
            case 'colliders':
              return this.boneSet.has(item.bone) ? '' : `missing bone ${item.bone}`;
            case 'ikChains':
            case 'lookAts':
            case 'springBones': {
              const gone = this.missing(item.bones);
              if (gone.length) return `missing ${gone.join(', ')}`;
              const known = new Set(this.rig.colliders.map(c => c.id));
              const unknown = (item.colliders || []).filter(id => !known.has(id));
              return unknown.length ? `unknown collider ${unknown.join(', ')}` : '';
            }
            default:
              return '';
          }
        },
        togglePreview(key) {
          PreviewSettings[key] = !PreviewSettings[key];
          if (Animator?.open) { try { Animator.preview(); } catch (_) { /* ignore */ } }
        },
        toggleBlend(index) {
          if (this.blend.index === index) {
            this.stopBlend();
            return;
          }
          const b = this.rig.blendSpaces[index];
          const range = blendSpaceRange(b);
          this.blend.index = index;
          this.blend.x = Math.max(range.x[0], Math.min(range.x[1], this.blend.x));
          this.blend.y = Math.max(range.y[0], Math.min(range.y[1], this.blend.y));
          BlendPreview.inputX = this.blend.x;
          BlendPreview.inputY = this.blend.y;
          BlendPreview.start(b);
        },
        stopBlend() {
          this.blend.index = -1;
          BlendPreview.stop();
        },
        setBlendInput() {
          BlendPreview.inputX = Number(this.blend.x);
          BlendPreview.inputY = Number(this.blend.y);
          BlendPreview.refresh();
        },
        toggleOption(key) {
          RigStore.edit('Hitbox set options', rig => { rig.hitboxOptions[key] = !rig.hitboxOptions[key]; });
        },
        check() { showValidation(); },
        generate() { showCodeExport(); },
        pct(v) { return `${Math.round((v || 0) * 100)}%`; },
      },
      template: `
<div class="azl-rig">
  <div class="azl-bar">
    <span class="azl-btn" @click="generate()" title="Generate AzureLib Java for this rig">Code</span>
    <span class="azl-btn" @click="check()" title="Check the rig against the model">Check<span v-if="issueCount" class="azl-badge">{{ issueCount }}</span></span>
    <span class="azl-spacer"></span>
    <span class="azl-chip" :class="{on: preview.hitboxes}" @click="togglePreview('hitboxes')" title="Show hitboxes in the viewport">Boxes</span>
    <span class="azl-chip" :class="{on: preview.sockets}" @click="togglePreview('sockets')" title="Show sockets in the viewport">Sockets</span>
    <span class="azl-chip" :class="{on: preview.colliders}" @click="togglePreview('colliders')" title="Show spring colliders in the viewport">Colliders</span>
    <span class="azl-chip" :class="{on: preview.modifiers}" @click="togglePreview('modifiers')" title="Run IK, look-at, spring bones and constraints while animating">Pose</span>
  </div>
  <div class="azl-scroll">
  <div v-if="isEmpty" class="azl-hint">Select bones or locators, then press + on a section.</div>

  <div v-for="sec in sections" :key="sec.key">
    <div class="azl-head" @click="toggle(sec.key)" :title="sec.addTitle">
      <span class="azl-caret">{{ isOpen(sec.key) ? '▼' : '▶' }}</span>
      <span class="azl-title">{{ sec.title }}</span>
      <span class="azl-count" v-if="rig[sec.key].length">{{ rig[sec.key].length }}</span>
      <span class="azl-spacer"></span>
      <span v-if="sec.key === 'sockets'" class="azl-add small" title="Add a socket for every locator" @click.stop="add('allLocators', sec.key)">all</span>
      <span class="azl-add" :title="sec.addTitle" @click.stop="add(sec.add, sec.key)">+</span>
    </div>

    <template v-if="isOpen(sec.key)">
      <div v-if="sel.key === sec.key" class="azl-selbar">
        <span>{{ sel.items.length }} selected</span>
        <span class="azl-spacer"></span>
        <span v-if="sec.key === 'hitboxes'" class="azl-btn" @click="bulkEdit()" title="Edit the selected hitboxes together">Edit</span>
        <span class="azl-btn" @click="selectAll(sec.key)" title="Select every entry in this section">All</span>
        <span class="azl-btn" @click="bulkDelete()" title="Remove the selected entries">Delete</span>
        <span class="azl-btn" @click="clearSelection()" title="Clear the selection">×</span>
      </div>
      <div v-for="(item, i) in rig[sec.key]" :key="sec.key + i">
        <div class="azl-row" :class="{selected: isSelected(sec.key, i)}" @click="rowClick(sec.key, i, $event)" title="Click to edit · Ctrl/⌘-click or Shift-click to select several">
          <span class="azl-dot" :style="{background: color(sec.key, item)}"></span>
          <span class="azl-name">{{ label(sec.key, item) }}</span>
          <span class="azl-detail" :class="{warn: !!warning(sec.key, item)}">{{ warning(sec.key, item) || detail(sec.key, item) }}</span>
          <span v-if="sec.key === 'blendSpaces' && isAnimate" class="azl-add" :title="blend.index === i ? 'Stop preview' : 'Preview'" @click.stop="toggleBlend(i)">{{ blend.index === i ? '■' : '▶' }}</span>
          <span class="azl-del" title="Remove" @click.stop="remove(sec.key, i)">×</span>
        </div>
        <div v-if="sec.key === 'blendSpaces' && blend.index === i" class="azl-sub">
          <div>X {{ Number(blend.x).toFixed(2) }}</div>
          <input type="range" :min="blendRange.x[0]" :max="blendRange.x[1]" step="0.01" v-model.number="blend.x" @input="setBlendInput()">
          <template v-if="item.dimensions === 2">
            <div>Y {{ Number(blend.y).toFixed(2) }}</div>
            <input type="range" :min="blendRange.y[0]" :max="blendRange.y[1]" step="0.01" v-model.number="blend.y" @input="setBlendInput()">
          </template>
          <div class="azl-weights">
            <span v-for="(s, j) in item.samples" :key="j">{{ s.animation }} {{ pct(blendWeights[j]) }}</span>
          </div>
          <div style="margin-top:2px">Press play to see motion. Samples share one timeline here; in game, phase sync keeps cycles in step.</div>
        </div>
      </div>
      <div v-if="sec.key === 'hitboxes' && rig.hitboxes.length" class="azl-sub">
        <label><input type="checkbox" :checked="rig.hitboxOptions.keepEntityBox" @change="toggleOption('keepEntityBox')"> keep entity box</label>
        <label><input type="checkbox" :checked="rig.hitboxOptions.clientOnly" @change="toggleOption('clientOnly')"> client only</label>
      </div>
    </template>
  </div>
  </div>
</div>`,
    },
  });
}

function registerActions() {
  actions = [
    new Action('azurelib_rig_generate_code', {
      name: 'Generate AzureLib Rig Code',
      description: 'Generate AzureLib Java for the hitboxes, sockets, IK, spring bones and blend spaces in this model',
      icon: 'code',
      category: 'file',
      condition: () => Format?.id === 'azure_model',
      click: () => showCodeExport(),
    }),
    new Action('azurelib_rig_validate', {
      name: 'Check AzureLib Rig',
      description: 'Check the AzureLib rig against the model',
      icon: 'rule',
      category: 'file',
      condition: () => Format?.id === 'azure_model',
      click: () => showValidation(),
    }),
  ];
  MenuBar.addAction(actions[0], 'file.export');
  MenuBar.addAction(actions[1], 'file.export');
}

function registerRigPanel() {
  if (panel) return;
  registerPanel();
  registerActions();
  azure_rig_panel_unsubscribe = RigStore.onChange(() => panel?.inside_vue?.$forceUpdate?.());

  onModeChange = event => {
    const vue = panel?.inside_vue;
    if (!vue) return;
    vue.mode = event?.mode?.id || '';
    if (vue.mode !== 'animate' && vue.blend.index >= 0) vue.stopBlend();
  };
  Blockbench.on('select_mode', onModeChange);

  onModelChange = () => {
    const vue = panel?.inside_vue;
    if (vue) vue.version++;
  };
  Blockbench.on('finished_edit', onModelChange);
  Blockbench.on('select_project', onModelChange);
}

function unregisterRigPanel() {
  azure_rig_panel_unsubscribe?.();
  azure_rig_panel_unsubscribe = null;
  if (onModeChange) Blockbench.removeListener('select_mode', onModeChange);
  if (onModelChange) {
    Blockbench.removeListener('finished_edit', onModelChange);
    Blockbench.removeListener('select_project', onModelChange);
  }
  onModeChange = null;
  onModelChange = null;
  for (const action of actions) action.delete();
  actions = [];
  panel?.delete();
  panel = null;
  removeStyle();
}

;// ./rig/azure-rig.js
/**
 * AzureLib Animator — Rig Features
 * --------------------------------
 * Entry point for AzureLib's runtime rig features in Blockbench: hitboxes,
 * sockets, runtime IK, look-at, constraints, spring bones and blend spaces.
 *
 * © 2026 AzureDoom — MIT License
 */





let azure_rig_registered = false;

function registerRig() {
  if (azure_rig_registered) return;
  azure_rig_registered = true;
  registerRigState();
  registerRigPreview();
  registerRigPanel();
}

function unregisterRig() {
  if (!azure_rig_registered) return;
  azure_rig_registered = false;
  unregisterRigPanel();
  unregisterRigPreview();
  unregisterRigState();
}

;// ./runtime.js
/**
 * AzureLib Animator — Blockbench Plugin Entry
 * -------------------------------------------
 * Registers the AzureLib animation format and editor utilities.
 *
 * © 2026 AzureDoom — MIT License
 */











const { /* version */ "rE": version, /* blockbenchConfig */ "Ug": blockbenchConfig } = package_namespaceObject;
const RANGE = `${blockbenchConfig.min_version} - ${blockbenchConfig.max_version}`;
if (!satisfies_default()(coerce_default()(Blockbench.version), RANGE)) {
  alert(`AzureLib Animator supports Blockbench ${RANGE}. Update for best results.`);
}

let exportAction, exportDisplay, importDisplay, settingsButton;

function loadAzureLib() {
      registerAzureCodec();
      initializeAnimationUI();
      registerKeyframeOverrides();
      registerRig();
      console.log('[AzureLib] Animator loaded');
	  
      Blockbench.on('ready', () => {
        setTimeout(() => {
          if (!Keyframe.prototype._azurePatched) {
            console.log('[AzureLib] Reattaching keyframe overrides after ready()');
            registerKeyframeOverrides();
          }
        }, 0);
      });

      // Auto show settings for Azure model
      Blockbench.on('new_project', () => {
        if (Format?.id === 'azure_model') {
          setTimeout(() => {
            try {
              Interface.dialog?.close();
            } catch {}
            new Dialog({
              id: 'azurelib_model_settings',
              title: 'AzureLib Model Settings',
              width: 540,
              lines: [
                `<b class="tl"><a href="https://wiki.azuredoom.com/">AzureLib</a> Animator v${version}</b>`,
                '<p>Select your model type to begin.</p>',
              ],
              form: {
                objectType: {
                  label: 'Object Type',
                  type: 'select',
                  default: azure_settings.objectType,
                  options: TYPE_OPTIONS,
                },
              },
              onConfirm(form) {
                Object.assign(azure_settings, form);
                onSettingsChanged();
              },
            }).show();
          }, 150);
        }
      });

      exportAction = new Action({
        id: 'export_AzureLib_model',
        name: 'Export AzureLib .geo Model',
        icon: 'archive',
        description: 'Export your .geo model for AzureLib.',
        category: 'file',
        condition: () => Format.id === 'azure_model',
        click: () => azure_codec.export(),
      });
      MenuBar.addAction(exportAction, 'file.export');

      exportDisplay = new Action({
        id: 'export_AzureLib_display',
        name: 'Export AzureLib Display Settings',
        icon: 'icon-bb_interface',
        category: 'file',
        description: 'Export display settings for AzureLib.',
        condition: () => Format.id === 'azure_model',
        click: maybeExportItemJson,
      });
      MenuBar.addAction(exportDisplay, 'file.export');

      importDisplay = new Action({
        id: 'import_AzureLib_display',
        name: 'Import AzureLib Display Settings',
        icon: 'icon-bow',
        category: 'file',
        condition: () => Format.id === 'azure_model',
        click: maybeImportItemJson,
      });
      MenuBar.addAction(importDisplay, 'file.import');

      settingsButton = new Action('azurelib_settings', {
        name: 'AzureLib Model Settings',
        description: 'Change model type',
        icon: 'info',
        condition: () => Format.id === 'azure_model',
        click: () => {
          const dialog = new Dialog({
            id: 'project',
            title: 'AzureLib Model Settings',
            width: 540,
            lines: [
              `<b class="tl"><a href="https://wiki.azuredoom.com/">AzureLib</a> Animator v${version}</b>`,
            ],
            form: {
              objectType: {
                label: 'Object Type',
                type: 'select',
                default: azure_settings.objectType,
                options: TYPE_OPTIONS,
              },
            },
            onConfirm: result => {
              Object.assign(azure_settings, result);
              onSettingsChanged();
              dialog.hide();
            },
          });
          dialog.show();
        },
      });
      MenuBar.addAction(settingsButton, 'file.1');
    }

    function unloadAzureLib() {
      exportAction.delete();
      exportDisplay.delete();
      importDisplay.delete();
      settingsButton.delete();
      unregisterRig();
      unregisterKeyframeOverrides();
      unloadAnimationUI();
      unregisterAzureCodec();
      restoreOverrides();
      console.log('[AzureLib] Animator unloaded.');
    }


/***/ }),

/***/ 938:
/***/ ((module) => {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),

/***/ 945:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(79),
    Map = __webpack_require__(8223),
    MapCache = __webpack_require__(3661);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),

/***/ 1033:
/***/ ((module) => {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ }),

/***/ 1042:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(6110);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ 1123:
/***/ ((module) => {

const numeric = /^[0-9]+$/
const compareIdentifiers = (a, b) => {
  const anum = numeric.test(a)
  const bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a)

module.exports = {
  compareIdentifiers,
  rcompareIdentifiers,
}


/***/ }),

/***/ 1175:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(6025);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),

/***/ 1331:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(2552),
    getPrototype = __webpack_require__(8879),
    isObjectLike = __webpack_require__(346);

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;


/***/ }),

/***/ 1420:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(79);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),

/***/ 1549:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hashClear = __webpack_require__(2032),
    hashDelete = __webpack_require__(3862),
    hashGet = __webpack_require__(6721),
    hashHas = __webpack_require__(2749),
    hashSet = __webpack_require__(5749);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),

/***/ 1769:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArray = __webpack_require__(6449),
    isKey = __webpack_require__(8586),
    stringToPath = __webpack_require__(1802),
    toString = __webpack_require__(3222);

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ }),

/***/ 1791:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assignValue = __webpack_require__(6547),
    baseAssignValue = __webpack_require__(3360);

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),

/***/ 1802:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var memoizeCapped = __webpack_require__(2224);

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),

/***/ 1811:
/***/ ((module) => {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ }),

/***/ 1873:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(9325);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ 1882:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(2552),
    isObject = __webpack_require__(3805);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),

/***/ 1961:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(9653);

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;


/***/ }),

/***/ 2032:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(1042);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),

/***/ 2111:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const eq = __webpack_require__(4641)
const neq = __webpack_require__(3999)
const gt = __webpack_require__(5580)
const gte = __webpack_require__(4089)
const lt = __webpack_require__(7059)
const lte = __webpack_require__(5200)

const cmp = (a, op, b, loose) => {
  switch (op) {
    case '===':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a === b

    case '!==':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError(`Invalid operator: ${op}`)
  }
}
module.exports = cmp


/***/ }),

/***/ 2199:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(4528),
    isArray = __webpack_require__(6449);

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),

/***/ 2224:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var memoize = __webpack_require__(104);

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;


/***/ }),

/***/ 2271:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(1791),
    getSymbols = __webpack_require__(4664);

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;


/***/ }),

/***/ 2428:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsArguments = __webpack_require__(7534),
    isObjectLike = __webpack_require__(346);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),

/***/ 2543:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.17.21';

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Error message constants. */
  var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.',
      FUNC_ERROR_TEXT = 'Expected a function',
      INVALID_TEMPL_VAR_ERROR_TEXT = 'Invalid `variable` option passed into `_.template`';

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** Used to compose bitmasks for cloning. */
  var CLONE_DEEP_FLAG = 1,
      CLONE_FLAT_FLAG = 2,
      CLONE_SYMBOLS_FLAG = 4;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG = 1,
      WRAP_BIND_KEY_FLAG = 2,
      WRAP_CURRY_BOUND_FLAG = 4,
      WRAP_CURRY_FLAG = 8,
      WRAP_CURRY_RIGHT_FLAG = 16,
      WRAP_PARTIAL_FLAG = 32,
      WRAP_PARTIAL_RIGHT_FLAG = 64,
      WRAP_ARY_FLAG = 128,
      WRAP_REARG_FLAG = 256,
      WRAP_FLIP_FLAG = 512;

  /** Used as default options for `_.truncate`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2,
      LAZY_WHILE_FLAG = 3;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER = 1.7976931348623157e+308,
      NAN = 0 / 0;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295,
      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

  /** Used to associate wrap methods with their bit flags. */
  var wrapFlags = [
    ['ary', WRAP_ARY_FLAG],
    ['bind', WRAP_BIND_FLAG],
    ['bindKey', WRAP_BIND_KEY_FLAG],
    ['curry', WRAP_CURRY_FLAG],
    ['curryRight', WRAP_CURRY_RIGHT_FLAG],
    ['flip', WRAP_FLIP_FLAG],
    ['partial', WRAP_PARTIAL_FLAG],
    ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
    ['rearg', WRAP_REARG_FLAG]
  ];

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      asyncTag = '[object AsyncFunction]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      domExcTag = '[object DOMException]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      nullTag = '[object Null]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]',
      weakMapTag = '[object WeakMap]',
      weakSetTag = '[object WeakSet]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
      reUnescapedHtml = /[&<>"']/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
      reHasRegExpChar = RegExp(reRegExpChar.source);

  /** Used to match leading whitespace. */
  var reTrimStart = /^\s+/;

  /** Used to match a single whitespace character. */
  var reWhitespace = /\s/;

  /** Used to match wrap detail comments. */
  var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
      reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
      reSplitDetails = /,? & /;

  /** Used to match words composed of alphanumeric characters. */
  var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

  /**
   * Used to validate the `validate` option in `_.template` variable.
   *
   * Forbids characters which could potentially change the meaning of the function argument definition:
   * - "()," (modification of function parameters)
   * - "=" (default value)
   * - "[]{}" (destructuring of function parameters)
   * - "/" (beginning of a comment)
   * - whitespace
   */
  var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Used to match
   * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to match Latin Unicode letters (excluding mathematical operators). */
  var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to compose unicode character classes. */
  var rsAstralRange = '\\ud800-\\udfff',
      rsComboMarksRange = '\\u0300-\\u036f',
      reComboHalfMarksRange = '\\ufe20-\\ufe2f',
      rsComboSymbolsRange = '\\u20d0-\\u20ff',
      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
      rsDingbatRange = '\\u2700-\\u27bf',
      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rsPunctuationRange = '\\u2000-\\u206f',
      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      rsVarRange = '\\ufe0e\\ufe0f',
      rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

  /** Used to compose unicode capture groups. */
  var rsApos = "['\u2019]",
      rsAstral = '[' + rsAstralRange + ']',
      rsBreak = '[' + rsBreakRange + ']',
      rsCombo = '[' + rsComboRange + ']',
      rsDigits = '\\d+',
      rsDingbat = '[' + rsDingbatRange + ']',
      rsLower = '[' + rsLowerRange + ']',
      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
      rsFitz = '\\ud83c[\\udffb-\\udfff]',
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsUpper = '[' + rsUpperRange + ']',
      rsZWJ = '\\u200d';

  /** Used to compose unicode regexes. */
  var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
      rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
      rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
      rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
      reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
      rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

  /** Used to match apostrophes. */
  var reApos = RegExp(rsApos, 'g');

  /**
   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
   */
  var reComboMark = RegExp(rsCombo, 'g');

  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

  /** Used to match complex or compound words. */
  var reUnicodeWord = RegExp([
    rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
    rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
    rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
    rsUpper + '+' + rsOptContrUpper,
    rsOrdUpper,
    rsOrdLower,
    rsDigits,
    rsEmoji
  ].join('|'), 'g');

  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

  /** Used to detect strings that need a more robust regexp to match words. */
  var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'Buffer', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
    'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap',
    '_', 'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
  cloneableTags[boolTag] = cloneableTags[dateTag] =
  cloneableTags[float32Tag] = cloneableTags[float64Tag] =
  cloneableTags[int8Tag] = cloneableTags[int16Tag] =
  cloneableTags[int32Tag] = cloneableTags[mapTag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[setTag] =
  cloneableTags[stringTag] = cloneableTags[symbolTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map Latin Unicode letters to basic Latin letters. */
  var deburredLetters = {
    // Latin-1 Supplement block.
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss',
    // Latin Extended-A block.
    '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
    '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
    '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
    '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
    '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
    '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
    '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
    '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
    '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
    '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
    '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
    '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
    '\u0134': 'J',  '\u0135': 'j',
    '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
    '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
    '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
    '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
    '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
    '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
    '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
    '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
    '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
    '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
    '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
    '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
    '\u0163': 't',  '\u0165': 't', '\u0167': 't',
    '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
    '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
    '\u0174': 'W',  '\u0175': 'w',
    '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
    '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
    '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
    '\u0132': 'IJ', '\u0133': 'ij',
    '\u0152': 'Oe', '\u0153': 'oe',
    '\u0149': "'n", '\u017f': 's'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Built-in method references without a dependency on `root`. */
  var freeParseFloat = parseFloat,
      freeParseInt = parseInt;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Detect free variable `exports`. */
  var freeExports =  true && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule && freeModule.require && freeModule.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  /* Node.js helper references. */
  var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
      nodeIsDate = nodeUtil && nodeUtil.isDate,
      nodeIsMap = nodeUtil && nodeUtil.isMap,
      nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
      nodeIsSet = nodeUtil && nodeUtil.isSet,
      nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  /*--------------------------------------------------------------------------*/

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * A specialized version of `baseAggregator` for arrays.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} setter The function to set `accumulator` values.
   * @param {Function} iteratee The iteratee to transform keys.
   * @param {Object} accumulator The initial aggregated object.
   * @returns {Function} Returns `accumulator`.
   */
  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.forEachRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEachRight(array, iteratee) {
    var length = array == null ? 0 : array.length;

    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   */
  function arrayEvery(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf(array, value, 0) > -1;
  }

  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array == null ? 0 : array.length;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.reduceRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the last element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
    var length = array == null ? 0 : array.length;
    if (initAccum && length) {
      accumulator = array[--length];
    }
    while (length--) {
      accumulator = iteratee(accumulator, array[length], length, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets the size of an ASCII `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  var asciiSize = baseProperty('length');

  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function asciiToArray(string) {
    return string.split('');
  }

  /**
   * Splits an ASCII `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function asciiWords(string) {
    return string.match(reAsciiWord) || [];
  }

  /**
   * The base implementation of methods like `_.findKey` and `_.findLastKey`,
   * without support for iteratee shorthands, which iterates over `collection`
   * using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFindKey(collection, predicate, eachFunc) {
    var result;
    eachFunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = key;
        return false;
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    return value === value
      ? strictIndexOf(array, value, fromIndex)
      : baseFindIndex(array, baseIsNaN, fromIndex);
  }

  /**
   * This function is like `baseIndexOf` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOfWith(array, value, fromIndex, comparator) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (comparator(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */
  function baseIsNaN(value) {
    return value !== value;
  }

  /**
   * The base implementation of `_.mean` and `_.meanBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the mean.
   */
  function baseMean(array, iteratee) {
    var length = array == null ? 0 : array.length;
    return length ? (baseSum(array, iteratee) / length) : NAN;
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyOf(object) {
    return function(key) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of
   *  `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection) {
      accumulator = initAccum
        ? (initAccum = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * The base implementation of `_.sortBy` which uses `comparer` to define the
   * sort order of `array` and replaces criteria objects with their corresponding
   * values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */
  function baseSortBy(array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * The base implementation of `_.sum` and `_.sumBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the sum.
   */
  function baseSum(array, iteratee) {
    var result,
        index = -1,
        length = array.length;

    while (++index < length) {
      var current = iteratee(array[index]);
      if (current !== undefined) {
        result = result === undefined ? current : (result + current);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
   * of key-value pairs for `object` corresponding to the property names of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the key-value pairs.
   */
  function baseToPairs(object, props) {
    return arrayMap(props, function(key) {
      return [key, object[key]];
    });
  }

  /**
   * The base implementation of `_.trim`.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} Returns the trimmed string.
   */
  function baseTrim(string) {
    return string
      ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
      : string;
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */
  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */
  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Gets the number of `placeholder` occurrences in `array`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} placeholder The placeholder to search for.
   * @returns {number} Returns the placeholder count.
   */
  function countHolders(array, placeholder) {
    var length = array.length,
        result = 0;

    while (length--) {
      if (array[length] === placeholder) {
        ++result;
      }
    }
    return result;
  }

  /**
   * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
   * letters to basic Latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  var deburrLetter = basePropertyOf(deburredLetters);

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  var escapeHtmlChar = basePropertyOf(htmlEscapes);

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Checks if `string` contains Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
   */
  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }

  /**
   * Checks if `string` contains a word composed of Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a word is found, else `false`.
   */
  function hasUnicodeWord(string) {
    return reHasUnicodeWord.test(string);
  }

  /**
   * Converts `iterator` to an array.
   *
   * @private
   * @param {Object} iterator The iterator to convert.
   * @returns {Array} Returns the converted array.
   */
  function iteratorToArray(iterator) {
    var data,
        result = [];

    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }
    return result;
  }

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === PLACEHOLDER) {
        array[index] = PLACEHOLDER;
        result[resIndex++] = index;
      }
    }
    return result;
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /**
   * Converts `set` to its value-value pairs.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the value-value pairs.
   */
  function setToPairs(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = [value, value];
    });
    return result;
  }

  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * A specialized version of `_.lastIndexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictLastIndexOf(array, value, fromIndex) {
    var index = fromIndex + 1;
    while (index--) {
      if (array[index] === value) {
        return index;
      }
    }
    return index;
  }

  /**
   * Gets the number of symbols in `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the string size.
   */
  function stringSize(string) {
    return hasUnicode(string)
      ? unicodeSize(string)
      : asciiSize(string);
  }

  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function stringToArray(string) {
    return hasUnicode(string)
      ? unicodeToArray(string)
      : asciiToArray(string);
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedEndIndex(string) {
    var index = string.length;

    while (index-- && reWhitespace.test(string.charAt(index))) {}
    return index;
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

  /**
   * Gets the size of a Unicode `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  function unicodeSize(string) {
    var result = reUnicode.lastIndex = 0;
    while (reUnicode.test(string)) {
      ++result;
    }
    return result;
  }

  /**
   * Converts a Unicode `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function unicodeToArray(string) {
    return string.match(reUnicode) || [];
  }

  /**
   * Splits a Unicode `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function unicodeWords(string) {
    return string.match(reUnicodeWord) || [];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the `context` object.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Util
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // Create a suped-up `defer` in Node.js.
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  var runInContext = (function runInContext(context) {
    context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));

    /** Built-in constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = context['__core-js_shared__'];

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Used to infer the `Object` constructor. */
    var objectCtorString = funcToString.call(Object);

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? context.Buffer : undefined,
        Symbol = context.Symbol,
        Uint8Array = context.Uint8Array,
        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
        getPrototype = overArg(Object.getPrototypeOf, Object),
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice,
        spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined,
        symIterator = Symbol ? Symbol.iterator : undefined,
        symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    var defineProperty = (function() {
      try {
        var func = getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    /** Mocked built-ins. */
    var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout,
        ctxNow = Date && Date.now !== root.Date.now && Date.now,
        ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeFloor = Math.floor,
        nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
        nativeIsFinite = context.isFinite,
        nativeJoin = arrayProto.join,
        nativeKeys = overArg(Object.keys, Object),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = Date.now,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeReverse = arrayProto.reverse;

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(context, 'DataView'),
        Map = getNative(context, 'Map'),
        Promise = getNative(context, 'Promise'),
        Set = getNative(context, 'Set'),
        WeakMap = getNative(context, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Used to lookup unminified function names. */
    var realNames = {};

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
        symbolToString = symbolProto ? symbolProto.toString : undefined;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit method
     * chain sequences. Methods that operate on and return arrays, collections,
     * and functions can be chained together. Methods that retrieve a single value
     * or may return a primitive value will automatically end the chain sequence
     * and return the unwrapped value. Otherwise, the value must be unwrapped
     * with `_#value`.
     *
     * Explicit chain sequences, which must be unwrapped with `_#value`, may be
     * enabled using `_.chain`.
     *
     * The execution of chained methods is lazy, that is, it's deferred until
     * `_#value` is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion.
     * Shortcut fusion is an optimization to merge iteratee calls; this avoids
     * the creation of intermediate arrays and can greatly reduce the number of
     * iteratee executions. Sections of a chain sequence qualify for shortcut
     * fusion if the section is applied to an array and iteratees accept only
     * one argument. The heuristic for whether a section qualifies for shortcut
     * fusion is subject to change.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
     * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
     * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
     * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
     * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
     * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
     * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
     * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
     * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
     * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
     * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
     * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
     * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
     * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
     * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
     * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
     * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
     * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
     * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
     * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
     * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
     * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
     * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
     * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
     * `zipObject`, `zipObjectDeep`, and `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
     * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
     * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
     * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
     * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
     * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
     * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
     * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
     * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
     * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
     * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
     * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
     * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
     * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
     * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
     * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
     * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
     * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
     * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
     * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
     * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
     * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
     * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
     * `upperFirst`, `value`, and `words`
     *
     * @name _
     * @constructor
     * @category Seq
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // Returns an unwrapped value.
     * wrapped.reduce(_.add);
     * // => 6
     *
     * // Returns a wrapped value.
     * var squares = wrapped.map(square);
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} proto The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(proto) {
        if (!isObject(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object;
        object.prototype = undefined;
        return result;
      };
    }());

    /**
     * The function whose prototype chain sequence wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable explicit method chain sequences.
     */
    function LodashWrapper(value, chainAll) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__chain__ = !!chainAll;
      this.__index__ = 0;
      this.__values__ = undefined;
    }

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB) as well as ES2015 template strings. Change the
     * following template settings to use alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type {Object}
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type {string}
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type {Object}
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type {Function}
         */
        '_': lodash
      }
    };

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;
    lodash.prototype.constructor = lodash;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @constructor
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = MAX_ARRAY_LENGTH;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = copyArray(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = copyArray(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = copyArray(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || (!isRight && arrLength == length && takeCount == length)) {
        return baseWrapperValue(array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    // Ensure `LazyWrapper` is an instance of `baseLodash`.
    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache;
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.sample` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @returns {*} Returns the random element.
     */
    function arraySample(array) {
      var length = array.length;
      return length ? array[baseRandom(0, length - 1)] : undefined;
    }

    /**
     * A specialized version of `_.sampleSize` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function arraySampleSize(array, n) {
      return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
    }

    /**
     * A specialized version of `_.shuffle` for arrays.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function arrayShuffle(array) {
      return shuffleSelf(copyArray(array));
    }

    /**
     * This function is like `assignValue` except that it doesn't assign
     * `undefined` values.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignMergeValue(object, key, value) {
      if ((value !== undefined && !eq(object[key], value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Aggregates elements of `collection` on `accumulator` with keys transformed
     * by `iteratee` and values set by `setter`.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform keys.
     * @param {Object} accumulator The initial aggregated object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseAggregator(collection, setter, iteratee, accumulator) {
      baseEach(collection, function(value, key, collection) {
        setter(accumulator, value, iteratee(value), collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }

    /**
     * The base implementation of `_.assignIn` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssignIn(object, source) {
      return object && copyObject(source, keysIn(source), object);
    }

    /**
     * The base implementation of `assignValue` and `assignMergeValue` without
     * value checks.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function baseAssignValue(object, key, value) {
      if (key == '__proto__' && defineProperty) {
        defineProperty(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    /**
     * The base implementation of `_.at` without support for individual paths.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {string[]} paths The property paths to pick.
     * @returns {Array} Returns the picked elements.
     */
    function baseAt(object, paths) {
      var index = -1,
          length = paths.length,
          result = Array(length),
          skip = object == null;

      while (++index < length) {
        result[index] = skip ? undefined : get(object, paths[index]);
      }
      return result;
    }

    /**
     * The base implementation of `_.clamp` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     */
    function baseClamp(number, lower, upper) {
      if (number === number) {
        if (upper !== undefined) {
          number = number <= upper ? number : upper;
        }
        if (lower !== undefined) {
          number = number >= lower ? number : lower;
        }
      }
      return number;
    }

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Deep clone
     *  2 - Flatten inherited properties
     *  4 - Clone symbols
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, bitmask, customizer, key, object, stack) {
      var result,
          isDeep = bitmask & CLONE_DEEP_FLAG,
          isFlat = bitmask & CLONE_FLAT_FLAG,
          isFull = bitmask & CLONE_SYMBOLS_FLAG;

      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = (isFlat || isFunc) ? {} : initCloneObject(value);
          if (!isDeep) {
            return isFlat
              ? copySymbolsIn(value, baseAssignIn(result, value))
              : copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      if (isSet(value)) {
        value.forEach(function(subValue) {
          result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
        });
      } else if (isMap(value)) {
        value.forEach(function(subValue, key) {
          result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
        });
      }

      var keysFunc = isFull
        ? (isFlat ? getAllKeysIn : getAllKeys)
        : (isFlat ? keysIn : keys);

      var props = isArr ? undefined : keysFunc(value);
      arrayEach(props || value, function(subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
      });
      return result;
    }

    /**
     * The base implementation of `_.conforms` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     */
    function baseConforms(source) {
      var props = keys(source);
      return function(object) {
        return baseConformsTo(object, source, props);
      };
    }

    /**
     * The base implementation of `_.conformsTo` which accepts `props` to check.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     */
    function baseConformsTo(object, source, props) {
      var length = props.length;
      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (length--) {
        var key = props[length],
            predicate = source[key],
            value = object[key];

        if ((value === undefined && !(key in object)) || !predicate(value)) {
          return false;
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts `args`
     * to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Array} args The arguments to provide to `func`.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * The base implementation of methods like `_.difference` without support
     * for excluding multiple arrays or iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          isCommon = true,
          length = array.length,
          result = [],
          valuesLength = values.length;

      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      }
      else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee == null ? value : iteratee(value);

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (!includes(values, computed, comparator)) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * The base implementation of methods like `_.max` and `_.min` which accepts a
     * `comparator` to determine the extremum value.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The iteratee invoked per iteration.
     * @param {Function} comparator The comparator used to compare values.
     * @returns {*} Returns the extremum value.
     */
    function baseExtremum(array, iteratee, comparator) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index],
            current = iteratee(value);

        if (current != null && (computed === undefined
              ? (current === current && !isSymbol(current))
              : comparator(current, computed)
            )) {
          var computed = current,
              result = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = toInteger(start);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : toInteger(end);
      if (end < 0) {
        end += length;
      }
      end = start > end ? 0 : toLength(end);
      while (start < end) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with support for restricting flattening.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {number} depth The maximum recursion depth.
     * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
     * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1,
          length = array.length;

      predicate || (predicate = isFlattenable);
      result || (result = []);

      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForOwn` which iterates over `object`
     * properties returned by `keysFunc` and invokes `iteratee` for each property.
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forOwn` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return object && baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from `props`.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the function names.
     */
    function baseFunctions(object, props) {
      return arrayFilter(props, function(key) {
        return isFunction(object[key]);
      });
    }

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = castPath(path, object);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * The base implementation of `_.gt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     */
    function baseGt(value, other) {
      return value > other;
    }

    /**
     * The base implementation of `_.has` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHas(object, key) {
      return object != null && hasOwnProperty.call(object, key);
    }

    /**
     * The base implementation of `_.hasIn` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }

    /**
     * The base implementation of `_.inRange` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to check.
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     */
    function baseInRange(number, start, end) {
      return number >= nativeMin(start, end) && number < nativeMax(start, end);
    }

    /**
     * The base implementation of methods like `_.intersection`, without support
     * for iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of shared values.
     */
    function baseIntersection(arrays, iteratee, comparator) {
      var includes = comparator ? arrayIncludesWith : arrayIncludes,
          length = arrays[0].length,
          othLength = arrays.length,
          othIndex = othLength,
          caches = Array(othLength),
          maxLength = Infinity,
          result = [];

      while (othIndex--) {
        var array = arrays[othIndex];
        if (othIndex && iteratee) {
          array = arrayMap(array, baseUnary(iteratee));
        }
        maxLength = nativeMin(array.length, maxLength);
        caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
          ? new SetCache(othIndex && array)
          : undefined;
      }
      array = arrays[0];

      var index = -1,
          seen = caches[0];

      outer:
      while (++index < length && result.length < maxLength) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (!(seen
              ? cacheHas(seen, computed)
              : includes(result, computed, comparator)
            )) {
          othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if (!(cache
                  ? cacheHas(cache, computed)
                  : includes(arrays[othIndex], computed, comparator))
                ) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.invert` and `_.invertBy` which inverts
     * `object` with values transformed by `iteratee` and set by `setter`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform values.
     * @param {Object} accumulator The initial inverted object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseInverter(object, setter, iteratee, accumulator) {
      baseForOwn(object, function(value, key, object) {
        setter(accumulator, iteratee(value), key, object);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.invoke` without support for individual
     * method arguments.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function baseInvoke(object, path, args) {
      path = castPath(path, object);
      object = parent(object, path);
      var func = object == null ? object : object[toKey(last(path))];
      return func == null ? undefined : apply(func, object, args);
    }

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }

    /**
     * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     */
    function baseIsArrayBuffer(value) {
      return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
    }

    /**
     * The base implementation of `_.isDate` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     */
    function baseIsDate(value) {
      return isObjectLike(value) && baseGetTag(value) == dateTag;
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Unordered comparison
     *  2 - Partial comparison
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = objIsArr ? arrayTag : getTag(object),
          othTag = othIsArr ? arrayTag : getTag(other);

      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;

      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return (objIsArr || isTypedArray(object))
          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new Stack);
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack);
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }

    /**
     * The base implementation of `_.isMap` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     */
    function baseIsMap(value) {
      return isObjectLike(value) && getTag(value) == mapTag;
    }

    /**
     * The base implementation of `_.isMatch` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Array} matchData The property names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack;
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === undefined
                ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
                : result
              )) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * The base implementation of `_.isRegExp` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     */
    function baseIsRegExp(value) {
      return isObjectLike(value) && baseGetTag(value) == regexpTag;
    }

    /**
     * The base implementation of `_.isSet` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     */
    function baseIsSet(value) {
      return isObjectLike(value) && getTag(value) == setTag;
    }

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike(value) &&
        isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }

    /**
     * The base implementation of `_.iteratee`.
     *
     * @private
     * @param {*} [value=_.identity] The value to convert to an iteratee.
     * @returns {Function} Returns the iteratee.
     */
    function baseIteratee(value) {
      // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
      // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
      if (typeof value == 'function') {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == 'object') {
        return isArray(value)
          ? baseMatchesProperty(value[0], value[1])
          : baseMatches(value);
      }
      return property(value);
    }

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn(object) {
      if (!isObject(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object),
          result = [];

      for (var key in object) {
        if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.lt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     */
    function baseLt(value, other) {
      return value < other;
    }

    /**
     * The base implementation of `_.map` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatchesProperty(path, srcValue) {
      if (isKey(path) && isStrictComparable(srcValue)) {
        return matchesStrictComparable(toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get(object, path);
        return (objValue === undefined && objValue === srcValue)
          ? hasIn(object, path)
          : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
    }

    /**
     * The base implementation of `_.merge` without support for multiple sources.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        stack || (stack = new Stack);
        if (isObject(srcValue)) {
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        }
        else {
          var newValue = customizer
            ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
            : undefined;

          if (newValue === undefined) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = safeGet(object, key),
          srcValue = safeGet(source, key),
          stacked = stack.get(srcValue);

      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer
        ? customizer(objValue, srcValue, (key + ''), object, source, stack)
        : undefined;

      var isCommon = newValue === undefined;

      if (isCommon) {
        var isArr = isArray(srcValue),
            isBuff = !isArr && isBuffer(srcValue),
            isTyped = !isArr && !isBuff && isTypedArray(srcValue);

        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray(objValue)) {
            newValue = objValue;
          }
          else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          }
          else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue, true);
          }
          else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue, true);
          }
          else {
            newValue = [];
          }
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          }
          else if (!isObject(objValue) || isFunction(objValue)) {
            newValue = initCloneObject(srcValue);
          }
        }
        else {
          isCommon = false;
        }
      }
      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack['delete'](srcValue);
      }
      assignMergeValue(object, key, newValue);
    }

    /**
     * The base implementation of `_.nth` which doesn't coerce arguments.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {number} n The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     */
    function baseNth(array, n) {
      var length = array.length;
      if (!length) {
        return;
      }
      n += n < 0 ? length : 0;
      return isIndex(n, length) ? array[n] : undefined;
    }

    /**
     * The base implementation of `_.orderBy` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {string[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseOrderBy(collection, iteratees, orders) {
      if (iteratees.length) {
        iteratees = arrayMap(iteratees, function(iteratee) {
          if (isArray(iteratee)) {
            return function(value) {
              return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
            }
          }
          return iteratee;
        });
      } else {
        iteratees = [identity];
      }

      var index = -1;
      iteratees = arrayMap(iteratees, baseUnary(getIteratee()));

      var result = baseMap(collection, function(value, key, collection) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.pick` without support for individual
     * property identifiers.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @returns {Object} Returns the new object.
     */
    function basePick(object, paths) {
      return basePickBy(object, paths, function(value, path) {
        return hasIn(object, path);
      });
    }

    /**
     * The base implementation of  `_.pickBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @param {Function} predicate The function invoked per property.
     * @returns {Object} Returns the new object.
     */
    function basePickBy(object, paths, predicate) {
      var index = -1,
          length = paths.length,
          result = {};

      while (++index < length) {
        var path = paths[index],
            value = baseGet(object, path);

        if (predicate(value, path)) {
          baseSet(result, castPath(path, object), value);
        }
      }
      return result;
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }

    /**
     * The base implementation of `_.pullAllBy` without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     */
    function basePullAll(array, values, iteratee, comparator) {
      var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
          index = -1,
          length = values.length,
          seen = array;

      if (array === values) {
        values = copyArray(values);
      }
      if (iteratee) {
        seen = arrayMap(array, baseUnary(iteratee));
      }
      while (++index < length) {
        var fromIndex = 0,
            value = values[index],
            computed = iteratee ? iteratee(value) : value;

        while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
          if (seen !== array) {
            splice.call(seen, fromIndex, 1);
          }
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * indexes or capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0,
          lastIndex = length - 1;

      while (length--) {
        var index = indexes[length];
        if (length == lastIndex || index !== previous) {
          var previous = index;
          if (isIndex(index)) {
            splice.call(array, index, 1);
          } else {
            baseUnset(array, index);
          }
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for returning
     * floating-point numbers.
     *
     * @private
     * @param {number} lower The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the random number.
     */
    function baseRandom(lower, upper) {
      return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
    }

    /**
     * The base implementation of `_.range` and `_.rangeRight` which doesn't
     * coerce arguments.
     *
     * @private
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @param {number} step The value to increment or decrement by.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the range of numbers.
     */
    function baseRange(start, end, step, fromRight) {
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
      }
      return result;
    }

    /**
     * The base implementation of `_.repeat` which doesn't coerce arguments.
     *
     * @private
     * @param {string} string The string to repeat.
     * @param {number} n The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     */
    function baseRepeat(string, n) {
      var result = '';
      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        if (n) {
          string += string;
        }
      } while (n);

      return result;
    }

    /**
     * The base implementation of `_.rest` which doesn't validate or coerce arguments.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     */
    function baseRest(func, start) {
      return setToString(overRest(func, start, identity), func + '');
    }

    /**
     * The base implementation of `_.sample`.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     */
    function baseSample(collection) {
      return arraySample(values(collection));
    }

    /**
     * The base implementation of `_.sampleSize` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function baseSampleSize(collection, n) {
      var array = values(collection);
      return shuffleSelf(array, baseClamp(n, 0, array.length));
    }

    /**
     * The base implementation of `_.set`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseSet(object, path, value, customizer) {
      if (!isObject(object)) {
        return object;
      }
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = toKey(path[index]),
            newValue = value;

        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          return object;
        }

        if (index != lastIndex) {
          var objValue = nested[key];
          newValue = customizer ? customizer(objValue, key, nested) : undefined;
          if (newValue === undefined) {
            newValue = isObject(objValue)
              ? objValue
              : (isIndex(path[index + 1]) ? [] : {});
          }
        }
        assignValue(nested, key, newValue);
        nested = nested[key];
      }
      return object;
    }

    /**
     * The base implementation of `setData` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `setToString` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var baseSetToString = !defineProperty ? identity : function(func, string) {
      return defineProperty(func, 'toString', {
        'configurable': true,
        'enumerable': false,
        'value': constant(string),
        'writable': true
      });
    };

    /**
     * The base implementation of `_.shuffle`.
     *
     * @private
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function baseShuffle(collection) {
      return shuffleSelf(values(collection));
    }

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
     * performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndex(array, value, retHighest) {
      var low = 0,
          high = array == null ? low : array.length;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if (computed !== null && !isSymbol(computed) &&
              (retHighest ? (computed <= value) : (computed < value))) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return baseSortedIndexBy(array, value, identity, retHighest);
    }

    /**
     * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
     * which invokes `iteratee` for `value` and each element of `array` to compute
     * their sort ranking. The iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The iteratee invoked per element.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndexBy(array, value, iteratee, retHighest) {
      var low = 0,
          high = array == null ? 0 : array.length;
      if (high === 0) {
        return 0;
      }

      value = iteratee(value);
      var valIsNaN = value !== value,
          valIsNull = value === null,
          valIsSymbol = isSymbol(value),
          valIsUndefined = value === undefined;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            othIsDefined = computed !== undefined,
            othIsNull = computed === null,
            othIsReflexive = computed === computed,
            othIsSymbol = isSymbol(computed);

        if (valIsNaN) {
          var setLow = retHighest || othIsReflexive;
        } else if (valIsUndefined) {
          setLow = othIsReflexive && (retHighest || othIsDefined);
        } else if (valIsNull) {
          setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
        } else if (valIsSymbol) {
          setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
        } else if (othIsNull || othIsSymbol) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
     * support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseSortedUniq(array, iteratee) {
      var index = -1,
          length = array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        if (!index || !eq(computed, seen)) {
          var seen = computed;
          result[resIndex++] = value === 0 ? 0 : value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.toNumber` which doesn't ensure correct
     * conversions of binary, hexadecimal, or octal string values.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     */
    function baseToNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      return +value;
    }

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isArray(value)) {
        // Recursively convert values (susceptible to call stack limits).
        return arrayMap(value, baseToString) + '';
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * The base implementation of `_.uniqBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseUniq(array, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          length = array.length,
          isCommon = true,
          result = [],
          seen = result;

      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      }
      else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache;
      }
      else {
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (!includes(seen, computed, comparator)) {
          if (seen !== result) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.unset`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The property path to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     */
    function baseUnset(object, path) {
      path = castPath(path, object);
      object = parent(object, path);
      return object == null || delete object[toKey(last(path))];
    }

    /**
     * The base implementation of `_.update`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to update.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseUpdate(object, path, updater, customizer) {
      return baseSet(object, path, updater(baseGet(object, path)), customizer);
    }

    /**
     * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
     * without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) &&
        predicate(array[index], index, array)) {}

      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to perform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      return arrayReduce(actions, function(result, action) {
        return action.func.apply(action.thisArg, arrayPush([result], action.args));
      }, result);
    }

    /**
     * The base implementation of methods like `_.xor`, without support for
     * iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of values.
     */
    function baseXor(arrays, iteratee, comparator) {
      var length = arrays.length;
      if (length < 2) {
        return length ? baseUniq(arrays[0]) : [];
      }
      var index = -1,
          result = Array(length);

      while (++index < length) {
        var array = arrays[index],
            othIndex = -1;

        while (++othIndex < length) {
          if (othIndex != index) {
            result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
          }
        }
      }
      return baseUniq(baseFlatten(result, 1), iteratee, comparator);
    }

    /**
     * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
     *
     * @private
     * @param {Array} props The property identifiers.
     * @param {Array} values The property values.
     * @param {Function} assignFunc The function to assign values.
     * @returns {Object} Returns the new object.
     */
    function baseZipObject(props, values, assignFunc) {
      var index = -1,
          length = props.length,
          valsLength = values.length,
          result = {};

      while (++index < length) {
        var value = index < valsLength ? values[index] : undefined;
        assignFunc(result, props[index], value);
      }
      return result;
    }

    /**
     * Casts `value` to an empty array if it's not an array like object.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array|Object} Returns the cast array-like object.
     */
    function castArrayLikeObject(value) {
      return isArrayLikeObject(value) ? value : [];
    }

    /**
     * Casts `value` to `identity` if it's not a function.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Function} Returns cast function.
     */
    function castFunction(value) {
      return typeof value == 'function' ? value : identity;
    }

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {Object} [object] The object to query keys on.
     * @returns {Array} Returns the cast property path array.
     */
    function castPath(value, object) {
      if (isArray(value)) {
        return value;
      }
      return isKey(value, object) ? [value] : stringToPath(toString(value));
    }

    /**
     * A `baseRest` alias which can be replaced with `identity` by module
     * replacement plugins.
     *
     * @private
     * @type {Function}
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    var castRest = baseRest;

    /**
     * Casts `array` to a slice if it's needed.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {number} start The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the cast slice.
     */
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === undefined ? length : end;
      return (!start && end >= length) ? array : baseSlice(array, start, end);
    }

    /**
     * A simple wrapper around the global [`clearTimeout`](https://mdn.io/clearTimeout).
     *
     * @private
     * @param {number|Object} id The timer id or timeout object of the timer to clear.
     */
    var clearTimeout = ctxClearTimeout || function(id) {
      return root.clearTimeout(id);
    };

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length,
          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

      buffer.copy(result);
      return result;
    }

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }

    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    /**
     * Compares values to sort them in ascending order.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {number} Returns the sort order indicator for `value`.
     */
    function compareAscending(value, other) {
      if (value !== other) {
        var valIsDefined = value !== undefined,
            valIsNull = value === null,
            valIsReflexive = value === value,
            valIsSymbol = isSymbol(value);

        var othIsDefined = other !== undefined,
            othIsNull = other === null,
            othIsReflexive = other === other,
            othIsSymbol = isSymbol(other);

        if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
            (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
            (valIsNull && othIsDefined && othIsReflexive) ||
            (!valIsDefined && othIsReflexive) ||
            !valIsReflexive) {
          return 1;
        }
        if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
            (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
            (othIsNull && valIsDefined && valIsReflexive) ||
            (!othIsDefined && valIsReflexive) ||
            !othIsReflexive) {
          return -1;
        }
      }
      return 0;
    }

    /**
     * Used by `_.orderBy` to compare multiple properties of a value to another
     * and stable sort them.
     *
     * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
     * specify an order of "desc" for descending or "asc" for ascending sort order
     * of corresponding values.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {boolean[]|string[]} orders The order to sort by for each property.
     * @returns {number} Returns the sort order indicator for `object`.
     */
    function compareMultiple(object, other, orders) {
      var index = -1,
          objCriteria = object.criteria,
          othCriteria = other.criteria,
          length = objCriteria.length,
          ordersLength = orders.length;

      while (++index < length) {
        var result = compareAscending(objCriteria[index], othCriteria[index]);
        if (result) {
          if (index >= ordersLength) {
            return result;
          }
          var order = orders[index];
          return result * (order == 'desc' ? -1 : 1);
        }
      }
      // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
      // that causes it, under certain circumstances, to provide the same value for
      // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
      // for more details.
      //
      // This also ensures a stable sort in V8 and other engines.
      // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
      return object.index - other.index;
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersLength = holders.length,
          leftIndex = -1,
          leftLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(leftLength + rangeLength),
          isUncurried = !isCurried;

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[holders[argsIndex]] = args[argsIndex];
        }
      }
      while (rangeLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersIndex = -1,
          holdersLength = holders.length,
          rightIndex = -1,
          rightLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(rangeLength + rightLength),
          isUncurried = !isCurried;

      while (++argsIndex < rangeLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[offset + holders[holdersIndex]] = args[argsIndex++];
        }
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined;

        if (newValue === undefined) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }

    /**
     * Copies own symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }

    /**
     * Copies own and inherited symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbolsIn(source, object) {
      return copyObject(source, getSymbolsIn(source), object);
    }

    /**
     * Creates a function like `_.groupBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} [initializer] The accumulator object initializer.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee) {
        var func = isArray(collection) ? arrayAggregator : baseAggregator,
            accumulator = initializer ? initializer() : {};

        return func(collection, setter, getIteratee(iteratee, 2), accumulator);
      };
    }

    /**
     * Creates a function like `_.assign`.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index = -1,
            length = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined,
            guard = length > 2 ? sources[2] : undefined;

        customizer = (assigner.length > 3 && typeof customizer == 'function')
          ? (length--, customizer)
          : undefined;

        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length,
            index = fromRight ? length : -1,
            iterable = Object(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;

        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` to invoke it with the optional `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createBind(func, bitmask, thisArg) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.lowerFirst`.
     *
     * @private
     * @param {string} methodName The name of the `String` case method to use.
     * @returns {Function} Returns the new case function.
     */
    function createCaseFirst(methodName) {
      return function(string) {
        string = toString(string);

        var strSymbols = hasUnicode(string)
          ? stringToArray(string)
          : undefined;

        var chr = strSymbols
          ? strSymbols[0]
          : string.charAt(0);

        var trailing = strSymbols
          ? castSlice(strSymbols, 1).join('')
          : string.slice(1);

        return chr[methodName]() + trailing;
      };
    }

    /**
     * Creates a function like `_.camelCase`.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtor(Ctor) {
      return function() {
        // Use a `switch` statement to work with class constructors. See
        // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a function that wraps `func` to enable currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {number} arity The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCurry(func, bitmask, arity) {
      var Ctor = createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length,
            placeholder = getHolder(wrapper);

        while (index--) {
          args[index] = arguments[index];
        }
        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
          ? []
          : replaceHolders(args, placeholder);

        length -= holders.length;
        if (length < arity) {
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, undefined,
            args, holders, undefined, undefined, arity - length);
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return apply(fn, this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} findIndexFunc The function to find the collection index.
     * @returns {Function} Returns the new find function.
     */
    function createFind(findIndexFunc) {
      return function(collection, predicate, fromIndex) {
        var iterable = Object(collection);
        if (!isArrayLike(collection)) {
          var iteratee = getIteratee(predicate, 3);
          collection = keys(collection);
          predicate = function(key) { return iteratee(iterable[key], key, iterable); };
        }
        var index = findIndexFunc(collection, predicate, fromIndex);
        return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
      };
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return flatRest(function(funcs) {
        var length = funcs.length,
            index = length,
            prereq = LodashWrapper.prototype.thru;

        if (fromRight) {
          funcs.reverse();
        }
        while (index--) {
          var func = funcs[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
            var wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? index : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) &&
                data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) &&
                !data[4].length && data[9] == 1
              ) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func))
              ? wrapper[funcName]()
              : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 && isArray(value)) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      });
    }

    /**
     * Creates a function that wraps `func` to invoke it with optional `this`
     * binding of `thisArg`, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided
     *  to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & WRAP_ARY_FLAG,
          isBind = bitmask & WRAP_BIND_FLAG,
          isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
          isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
          isFlip = bitmask & WRAP_FLIP_FLAG,
          Ctor = isBindKey ? undefined : createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length;

        while (index--) {
          args[index] = arguments[index];
        }
        if (isCurried) {
          var placeholder = getHolder(wrapper),
              holdersCount = countHolders(args, placeholder);
        }
        if (partials) {
          args = composeArgs(args, partials, holders, isCurried);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
        }
        length -= holdersCount;
        if (isCurried && length < arity) {
          var newHolders = replaceHolders(args, placeholder);
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, thisArg,
            args, newHolders, argPos, ary, arity - length
          );
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        length = args.length;
        if (argPos) {
          args = reorder(args, argPos);
        } else if (isFlip && length > 1) {
          args.reverse();
        }
        if (isAry && ary < length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtor(fn);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.invertBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} toIteratee The function to resolve iteratees.
     * @returns {Function} Returns the new inverter function.
     */
    function createInverter(setter, toIteratee) {
      return function(object, iteratee) {
        return baseInverter(object, setter, toIteratee(iteratee), {});
      };
    }

    /**
     * Creates a function that performs a mathematical operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @param {number} [defaultValue] The value used for `undefined` arguments.
     * @returns {Function} Returns the new mathematical operation function.
     */
    function createMathOperation(operator, defaultValue) {
      return function(value, other) {
        var result;
        if (value === undefined && other === undefined) {
          return defaultValue;
        }
        if (value !== undefined) {
          result = value;
        }
        if (other !== undefined) {
          if (result === undefined) {
            return other;
          }
          if (typeof value == 'string' || typeof other == 'string') {
            value = baseToString(value);
            other = baseToString(other);
          } else {
            value = baseToNumber(value);
            other = baseToNumber(other);
          }
          result = operator(value, other);
        }
        return result;
      };
    }

    /**
     * Creates a function like `_.over`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over iteratees.
     * @returns {Function} Returns the new over function.
     */
    function createOver(arrayFunc) {
      return flatRest(function(iteratees) {
        iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
        return baseRest(function(args) {
          var thisArg = this;
          return arrayFunc(iteratees, function(iteratee) {
            return apply(iteratee, thisArg, args);
          });
        });
      });
    }

    /**
     * Creates the padding for `string` based on `length`. The `chars` string
     * is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {number} length The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padding for `string`.
     */
    function createPadding(length, chars) {
      chars = chars === undefined ? ' ' : baseToString(chars);

      var charsLength = chars.length;
      if (charsLength < 2) {
        return charsLength ? baseRepeat(chars, length) : chars;
      }
      var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
      return hasUnicode(chars)
        ? castSlice(stringToArray(result), 0, length).join('')
        : result.slice(0, length);
    }

    /**
     * Creates a function that wraps `func` to invoke it with the `this` binding
     * of `thisArg` and `partials` prepended to the arguments it receives.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to
     *  the new function.
     * @returns {Function} Returns the new wrapped function.
     */
    function createPartial(func, bitmask, thisArg, partials) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength),
            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        return apply(fn, isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.range` or `_.rangeRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new range function.
     */
    function createRange(fromRight) {
      return function(start, end, step) {
        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
          end = step = undefined;
        }
        // Ensure the sign of `-0` is preserved.
        start = toFinite(start);
        if (end === undefined) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
        return baseRange(start, end, step, fromRight);
      };
    }

    /**
     * Creates a function that performs a relational operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @returns {Function} Returns the new relational operation function.
     */
    function createRelationalOperation(operator) {
      return function(value, other) {
        if (!(typeof value == 'string' && typeof other == 'string')) {
          value = toNumber(value);
          other = toNumber(other);
        }
        return operator(value, other);
      };
    }

    /**
     * Creates a function that wraps `func` to continue currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {Function} wrapFunc The function to create the `func` wrapper.
     * @param {*} placeholder The placeholder value.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
      var isCurry = bitmask & WRAP_CURRY_FLAG,
          newHolders = isCurry ? holders : undefined,
          newHoldersRight = isCurry ? undefined : holders,
          newPartials = isCurry ? partials : undefined,
          newPartialsRight = isCurry ? undefined : partials;

      bitmask |= (isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG);
      bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);

      if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
        bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
      }
      var newData = [
        func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
        newHoldersRight, argPos, ary, arity
      ];

      var result = wrapFunc.apply(undefined, newData);
      if (isLaziable(func)) {
        setData(result, newData);
      }
      result.placeholder = placeholder;
      return setWrapToString(result, func, bitmask);
    }

    /**
     * Creates a function like `_.round`.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        number = toNumber(number);
        precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
        if (precision && nativeIsFinite(number)) {
          // Shift with exponential notation to avoid floating-point issues.
          // See [MDN](https://mdn.io/round#Examples) for more details.
          var pair = (toString(number) + 'e').split('e'),
              value = func(pair[0] + 'e' + (+pair[1] + precision));

          pair = (toString(value) + 'e').split('e');
          return +(pair[0] + 'e' + (+pair[1] - precision));
        }
        return func(number);
      };
    }

    /**
     * Creates a set object of `values`.
     *
     * @private
     * @param {Array} values The values to add to the set.
     * @returns {Object} Returns the new set.
     */
    var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
      return new Set(values);
    };

    /**
     * Creates a `_.toPairs` or `_.toPairsIn` function.
     *
     * @private
     * @param {Function} keysFunc The function to get the keys of a given object.
     * @returns {Function} Returns the new pairs function.
     */
    function createToPairs(keysFunc) {
      return function(object) {
        var tag = getTag(object);
        if (tag == mapTag) {
          return mapToArray(object);
        }
        if (tag == setTag) {
          return setToPairs(object);
        }
        return baseToPairs(object, keysFunc(object));
      };
    }

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags.
     *    1 - `_.bind`
     *    2 - `_.bindKey`
     *    4 - `_.curry` or `_.curryRight` of a bound function
     *    8 - `_.curry`
     *   16 - `_.curryRight`
     *   32 - `_.partial`
     *   64 - `_.partialRight`
     *  128 - `_.rearg`
     *  256 - `_.ary`
     *  512 - `_.flip`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
      arity = arity === undefined ? arity : toInteger(arity);
      length -= holders ? holders.length : 0;

      if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func);

      var newData = [
        func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
        argPos, ary, arity
      ];

      if (data) {
        mergeData(newData, data);
      }
      func = newData[0];
      bitmask = newData[1];
      thisArg = newData[2];
      partials = newData[3];
      holders = newData[4];
      arity = newData[9] = newData[9] === undefined
        ? (isBindKey ? 0 : func.length)
        : nativeMax(newData[9] - length, 0);

      if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
        bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
      }
      if (!bitmask || bitmask == WRAP_BIND_FLAG) {
        var result = createBind(func, bitmask, thisArg);
      } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
        result = createCurry(func, bitmask, arity);
      } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
        result = createPartial(func, bitmask, thisArg, partials);
      } else {
        result = createHybrid.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setWrapToString(setter(result, newData), func, bitmask);
    }

    /**
     * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
     * of source objects to the destination object for all destination properties
     * that resolve to `undefined`.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to assign.
     * @param {Object} object The parent object of `objValue`.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsAssignIn(objValue, srcValue, key, object) {
      if (objValue === undefined ||
          (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
        return srcValue;
      }
      return objValue;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
     * objects into destination objects that are passed thru.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to merge.
     * @param {Object} object The parent object of `objValue`.
     * @param {Object} source The parent object of `srcValue`.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
      if (isObject(objValue) && isObject(srcValue)) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, objValue);
        baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
        stack['delete'](srcValue);
      }
      return objValue;
    }

    /**
     * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
     * objects.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {string} key The key of the property to inspect.
     * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
     */
    function customOmitClone(value) {
      return isPlainObject(value) ? undefined : value;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Check that cyclic values are equal.
      var arrStacked = stack.get(array);
      var othStacked = stack.get(other);
      if (arrStacked && othStacked) {
        return arrStacked == other && othStacked == array;
      }
      var index = -1,
          result = true,
          seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

      stack.set(array, other);
      stack.set(other, array);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!arraySome(other, function(othValue, othIndex) {
                if (!cacheHas(seen, othIndex) &&
                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
        case numberTag:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return eq(+object, +other);

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack['delete'](object);
          return result;

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          objProps = getAllKeys(object),
          objLength = objProps.length,
          othProps = getAllKeys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      // Check that cyclic values are equal.
      var objStacked = stack.get(object);
      var othStacked = stack.get(other);
      if (objStacked && othStacked) {
        return objStacked == other && othStacked == object;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseRest` which flattens the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    function flatRest(func) {
      return setToString(overRest(func, undefined, flatten), func + '');
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /**
     * Creates an array of own and inherited enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeysIn(object) {
      return baseGetAllKeys(object, keysIn, getSymbolsIn);
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = (func.name + ''),
          array = realNames[result],
          length = hasOwnProperty.call(realNames, result) ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the argument placeholder value for `func`.
     *
     * @private
     * @param {Function} func The function to inspect.
     * @returns {*} Returns the placeholder value.
     */
    function getHolder(func) {
      var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
      return object.placeholder;
    }

    /**
     * Gets the appropriate "iteratee" function. If `_.iteratee` is customized,
     * this function returns the custom method, otherwise it returns `baseIteratee`.
     * If arguments are provided, the chosen function is invoked with them and
     * its result is returned.
     *
     * @private
     * @param {*} [value] The value to convert to an iteratee.
     * @param {number} [arity] The arity of the created iteratee.
     * @returns {Function} Returns the chosen function or its result.
     */
    function getIteratee() {
      var result = lodash.iteratee || iteratee;
      result = result === iteratee ? baseIteratee : result;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Gets the property names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = keys(object),
          length = result.length;

      while (length--) {
        var key = result[length],
            value = object[key];

        result[length] = [key, value, isStrictComparable(value)];
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag),
          tag = value[symToStringTag];

      try {
        value[symToStringTag] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    /**
     * Creates an array of the own and inherited enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
      var result = [];
      while (object) {
        arrayPush(result, getSymbols(object));
        object = getPrototype(object);
      }
      return result;
    };

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (Map && getTag(new Map) != mapTag) ||
        (Promise && getTag(Promise.resolve()) != promiseTag) ||
        (Set && getTag(new Set) != setTag) ||
        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Extracts wrapper details from the `source` body comment.
     *
     * @private
     * @param {string} source The source to inspect.
     * @returns {Array} Returns the wrapper details.
     */
    function getWrapDetails(source) {
      var match = source.match(reWrapDetails);
      return match ? match[1].split(reSplitDetails) : [];
    }

    /**
     * Checks if `path` exists on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @param {Function} hasFunc The function to check properties.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     */
    function hasPath(object, path, hasFunc) {
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          result = false;

      while (++index < length) {
        var key = toKey(path[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result || ++index != length) {
        return result;
      }
      length = object == null ? 0 : object.length;
      return !!length && isLength(length) && isIndex(key, length) &&
        (isArray(object) || isArguments(object));
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = new array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return (typeof object.constructor == 'function' && !isPrototype(object))
        ? baseCreate(getPrototype(object))
        : {};
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case dataViewTag:
          return cloneDataView(object, isDeep);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return new Ctor;

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return new Ctor;

        case symbolTag:
          return cloneSymbol(object);
      }
    }

    /**
     * Inserts wrapper `details` in a comment at the top of the `source` body.
     *
     * @private
     * @param {string} source The source to modify.
     * @returns {Array} details The details to insert.
     * @returns {string} Returns the modified source.
     */
    function insertWrapDetails(source, details) {
      var length = details.length;
      if (!length) {
        return source;
      }
      var lastIndex = length - 1;
      details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
      details = details.join(length > 2 ? ', ' : ' ');
      return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
    }

    /**
     * Checks if `value` is a flattenable `arguments` object or array.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
     */
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) ||
        !!(spreadableSymbol && value && value[spreadableSymbol]);
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * Checks if the given arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
     *  else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
            ? (isArrayLike(object) && isIndex(index, object.length))
            : (type == 'string' && index in object)
          ) {
        return eq(object[index], value);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
     *  else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func),
          other = lodash[funcName];

      if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
        return false;
      }
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /**
     * Checks if `func` is capable of being masked.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `func` is maskable, else `false`.
     */
    var isMaskable = coreJsData ? isFunction : stubFalse;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * A specialized version of `matchesProperty` for source values suitable
     * for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue &&
          (srcValue !== undefined || (key in Object(object)));
      };
    }

    /**
     * A specialized version of `_.memoize` which clears the memoized function's
     * cache when it exceeds `MAX_MEMOIZE_SIZE`.
     *
     * @private
     * @param {Function} func The function to have its output memoized.
     * @returns {Function} Returns the new memoized function.
     */
    function memoizeCapped(func) {
      var result = memoize(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });

      var cache = result.cache;
      return result;
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers used to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and
     * `_.rearg` modify function arguments, making the order in which they are
     * executed important, preventing the merging of metadata. However, we make
     * an exception for a safe combined case where curried functions have `_.ary`
     * and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);

      var isCombo =
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_CURRY_FLAG)) ||
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_REARG_FLAG) && (data[7].length <= source[8])) ||
        ((srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG));

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & WRAP_BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : value;
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = value;
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & WRAP_ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * This function is like
     * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * except that it includes inherited enumerable properties.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    /**
     * A specialized version of `baseRest` which transforms the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @param {Function} transform The rest array transform.
     * @returns {Function} Returns the new function.
     */
    function overRest(func, start, transform) {
      start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return apply(func, this, otherArgs);
      };
    }

    /**
     * Gets the parent value at `path` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path to get the parent value of.
     * @returns {*} Returns the parent value.
     */
    function parent(object, path) {
      return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = copyArray(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function safeGet(object, key) {
      if (key === 'constructor' && typeof object[key] === 'function') {
        return;
      }

      if (key == '__proto__') {
        return;
      }

      return object[key];
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity
     * function to avoid garbage collection pauses in V8. See
     * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = shortOut(baseSetData);

    /**
     * A simple wrapper around the global [`setTimeout`](https://mdn.io/setTimeout).
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    var setTimeout = ctxSetTimeout || function(func, wait) {
      return root.setTimeout(func, wait);
    };

    /**
     * Sets the `toString` method of `func` to return `string`.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var setToString = shortOut(baseSetToString);

    /**
     * Sets the `toString` method of `wrapper` to mimic the source of `reference`
     * with wrapper details in a comment at the top of the source body.
     *
     * @private
     * @param {Function} wrapper The function to modify.
     * @param {Function} reference The reference function.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Function} Returns `wrapper`.
     */
    function setWrapToString(wrapper, reference, bitmask) {
      var source = (reference + '');
      return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
    }

    /**
     * Creates a function that'll short out and invoke `identity` instead
     * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
     * milliseconds.
     *
     * @private
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new shortable function.
     */
    function shortOut(func) {
      var count = 0,
          lastCalled = 0;

      return function() {
        var stamp = nativeNow(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(undefined, arguments);
      };
    }

    /**
     * A specialized version of `_.shuffle` which mutates and sets the size of `array`.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @param {number} [size=array.length] The size of `array`.
     * @returns {Array} Returns `array`.
     */
    function shuffleSelf(array, size) {
      var index = -1,
          length = array.length,
          lastIndex = length - 1;

      size = size === undefined ? length : size;
      while (++index < size) {
        var rand = baseRandom(index, lastIndex),
            value = array[rand];

        array[rand] = array[index];
        array[index] = value;
      }
      array.length = size;
      return array;
    }

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath = memoizeCapped(function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46 /* . */) {
        result.push('');
      }
      string.replace(rePropName, function(match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
      if (typeof value == 'string' || isSymbol(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Updates wrapper `details` based on `bitmask` flags.
     *
     * @private
     * @returns {Array} details The details to modify.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Array} Returns `details`.
     */
    function updateWrapDetails(details, bitmask) {
      arrayEach(wrapFlags, function(pair) {
        var value = '_.' + pair[0];
        if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
          details.push(value);
        }
      });
      return details.sort();
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      if (wrapper instanceof LazyWrapper) {
        return wrapper.clone();
      }
      var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
      result.__actions__ = copyArray(wrapper.__actions__);
      result.__index__  = wrapper.__index__;
      result.__values__ = wrapper.__values__;
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `array` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the new array of chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
        size = 1;
      } else {
        size = nativeMax(toInteger(size), 0);
      }
      var length = array == null ? 0 : array.length;
      if (!length || size < 1) {
        return [];
      }
      var index = 0,
          resIndex = 0,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[resIndex++] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * Creates a new array concatenating `array` with any additional arrays
     * and/or values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to concatenate.
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var other = _.concat(array, 2, [3], [[4]]);
     *
     * console.log(other);
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    function concat() {
      var length = arguments.length;
      if (!length) {
        return [];
      }
      var args = Array(length - 1),
          array = arguments[0],
          index = length;

      while (index--) {
        args[index - 1] = arguments[index];
      }
      return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
    }

    /**
     * Creates an array of `array` values not included in the other given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * **Note:** Unlike `_.pullAll`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.without, _.xor
     * @example
     *
     * _.difference([2, 1], [2, 3]);
     * // => [1]
     */
    var difference = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `iteratee` which
     * is invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * **Note:** Unlike `_.pullAllBy`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var differenceBy = baseRest(function(array, values) {
      var iteratee = last(values);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `comparator`
     * which is invoked to compare elements of `array` to `values`. The order and
     * references of result values are determined by the first array. The comparator
     * is invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.pullAllWith`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     *
     * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }]
     */
    var differenceWith = baseRest(function(array, values) {
      var comparator = last(values);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator)
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.dropRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropRightWhile(users, ['active', false]);
     * // => objects for ['barney']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropRightWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.dropWhile(users, function(o) { return !o.active; });
     * // => objects for ['pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropWhile(users, ['active', false]);
     * // => objects for ['pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8, 10], '*', 1, 3);
     * // => [4, '*', '*', 10]
     */
    function fill(array, value, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(o) { return o.user == 'barney'; });
     * // => 0
     *
     * // The `_.matches` iteratee shorthand.
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findIndex(users, ['active', false]);
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.findIndex(users, 'active');
     * // => 2
     */
    function findIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index);
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
     * // => 2
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastIndex(users, ['active', false]);
     * // => 2
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    function findLastIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length - 1;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = fromIndex < 0
          ? nativeMax(length + index, 0)
          : nativeMin(index, length - 1);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index, true);
    }

    /**
     * Flattens `array` a single level deep.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, [3, [4]], 5]]);
     * // => [1, 2, [3, [4]], 5]
     */
    function flatten(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, 1) : [];
    }

    /**
     * Recursively flattens `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, [3, [4]], 5]]);
     * // => [1, 2, 3, 4, 5]
     */
    function flattenDeep(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, INFINITY) : [];
    }

    /**
     * Recursively flatten `array` up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * var array = [1, [2, [3, [4]], 5]];
     *
     * _.flattenDepth(array, 1);
     * // => [1, 2, [3, [4]], 5]
     *
     * _.flattenDepth(array, 2);
     * // => [1, 2, 3, [4], 5]
     */
    function flattenDepth(array, depth) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(array, depth);
    }

    /**
     * The inverse of `_.toPairs`; this method returns an object composed
     * from key-value `pairs`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} pairs The key-value pairs.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.fromPairs([['a', 1], ['b', 2]]);
     * // => { 'a': 1, 'b': 2 }
     */
    function fromPairs(pairs) {
      var index = -1,
          length = pairs == null ? 0 : pairs.length,
          result = {};

      while (++index < length) {
        var pair = pairs[index];
        result[pair[0]] = pair[1];
      }
      return result;
    }

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias first
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.head([1, 2, 3]);
     * // => 1
     *
     * _.head([]);
     * // => undefined
     */
    function head(array) {
      return (array && array.length) ? array[0] : undefined;
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it's used as the
     * offset from the end of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // Search from the `fromIndex`.
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     */
    function indexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseIndexOf(array, value, index);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 0, -1) : [];
    }

    /**
     * Creates an array of unique values that are included in all given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersection([2, 1], [2, 3]);
     * // => [2]
     */
    var intersection = baseRest(function(arrays) {
      var mapped = arrayMap(arrays, castArrayLikeObject);
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped)
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `iteratee`
     * which is invoked for each element of each `arrays` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [2.1]
     *
     * // The `_.property` iteratee shorthand.
     * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }]
     */
    var intersectionBy = baseRest(function(arrays) {
      var iteratee = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      if (iteratee === last(mapped)) {
        iteratee = undefined;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `comparator`
     * which is invoked to compare elements of `arrays`. The order and references
     * of result values are determined by the first array. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.intersectionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }]
     */
    var intersectionWith = baseRest(function(arrays) {
      var comparator = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      comparator = typeof comparator == 'function' ? comparator : undefined;
      if (comparator) {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, undefined, comparator)
        : [];
    });

    /**
     * Converts all elements in `array` into a string separated by `separator`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to convert.
     * @param {string} [separator=','] The element separator.
     * @returns {string} Returns the joined string.
     * @example
     *
     * _.join(['a', 'b', 'c'], '~');
     * // => 'a~b~c'
     */
    function join(array, separator) {
      return array == null ? '' : nativeJoin.call(array, separator);
    }

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array == null ? 0 : array.length;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // Search from the `fromIndex`.
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
      }
      return value === value
        ? strictLastIndexOf(array, value, index)
        : baseFindIndex(array, baseIsNaN, index, true);
    }

    /**
     * Gets the element at index `n` of `array`. If `n` is negative, the nth
     * element from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.11.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=0] The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     *
     * _.nth(array, 1);
     * // => 'b'
     *
     * _.nth(array, -2);
     * // => 'c';
     */
    function nth(array, n) {
      return (array && array.length) ? baseNth(array, toInteger(n)) : undefined;
    }

    /**
     * Removes all given values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
     * to remove elements from an array by predicate.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pull(array, 'a', 'c');
     * console.log(array);
     * // => ['b', 'b']
     */
    var pull = baseRest(pullAll);

    /**
     * This method is like `_.pull` except that it accepts an array of values to remove.
     *
     * **Note:** Unlike `_.difference`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pullAll(array, ['a', 'c']);
     * console.log(array);
     * // => ['b', 'b']
     */
    function pullAll(array, values) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values)
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `iteratee` which is
     * invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The iteratee is invoked with one argument: (value).
     *
     * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
     *
     * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
     * console.log(array);
     * // => [{ 'x': 2 }]
     */
    function pullAllBy(array, values, iteratee) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, getIteratee(iteratee, 2))
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `comparator` which
     * is invoked to compare elements of `array` to `values`. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
     *
     * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
     * console.log(array);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
     */
    function pullAllWith(array, values, comparator) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, undefined, comparator)
        : array;
    }

    /**
     * Removes elements from `array` corresponding to `indexes` and returns an
     * array of removed elements.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     * var pulled = _.pullAt(array, [1, 3]);
     *
     * console.log(array);
     * // => ['a', 'c']
     *
     * console.log(pulled);
     * // => ['b', 'd']
     */
    var pullAt = flatRest(function(array, indexes) {
      var length = array == null ? 0 : array.length,
          result = baseAt(array, indexes);

      basePullAt(array, arrayMap(indexes, function(index) {
        return isIndex(index, length) ? +index : index;
      }).sort(compareAscending));

      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is invoked
     * with three arguments: (value, index, array).
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
     * to pull elements from an array by value.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getIteratee(predicate, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Reverses `array` so that the first element becomes the last, the second
     * element becomes the second to last, and so on.
     *
     * **Note:** This method mutates `array` and is based on
     * [`Array#reverse`](https://mdn.io/Array/reverse).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.reverse(array);
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function reverse(array) {
      return array == null ? array : nativeReverse.call(array);
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of
     * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
     * returned.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      else {
        start = start == null ? 0 : toInteger(start);
        end = end === undefined ? length : toInteger(end);
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     */
    function sortedIndex(array, value) {
      return baseSortedIndex(array, value);
    }

    /**
     * This method is like `_.sortedIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedIndexBy(objects, { 'x': 4 }, 'x');
     * // => 0
     */
    function sortedIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
    }

    /**
     * This method is like `_.indexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedIndexOf([4, 5, 5, 5, 6], 5);
     * // => 1
     */
    function sortedIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value);
        if (index < length && eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 5, 5, 5, 6], 5);
     * // => 4
     */
    function sortedLastIndex(array, value) {
      return baseSortedIndex(array, value, true);
    }

    /**
     * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 1
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
     * // => 1
     */
    function sortedLastIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
    }

    /**
     * This method is like `_.lastIndexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
     * // => 3
     */
    function sortedLastIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value, true) - 1;
        if (eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.uniq` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniq([1, 1, 2]);
     * // => [1, 2]
     */
    function sortedUniq(array) {
      return (array && array.length)
        ? baseSortedUniq(array)
        : [];
    }

    /**
     * This method is like `_.uniqBy` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
     * // => [1.1, 2.3]
     */
    function sortedUniqBy(array, iteratee) {
      return (array && array.length)
        ? baseSortedUniq(array, getIteratee(iteratee, 2))
        : [];
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.tail([1, 2, 3]);
     * // => [2, 3]
     */
    function tail(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 1, length) : [];
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      if (!(array && array.length)) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.takeRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeRightWhile(users, ['active', false]);
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeRightWhile(users, 'active');
     * // => []
     */
    function takeRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.takeWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeWhile(users, ['active', false]);
     * // => objects for ['barney', 'fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeWhile(users, 'active');
     * // => []
     */
    function takeWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all given arrays using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([2], [1, 2]);
     * // => [2, 1]
     */
    var union = baseRest(function(arrays) {
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
    });

    /**
     * This method is like `_.union` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which uniqueness is computed. Result values are chosen from the first
     * array in which the value occurs. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.unionBy([2.1], [1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    var unionBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.union` except that it accepts `comparator` which
     * is invoked to compare elements of `arrays`. Result values are chosen from
     * the first array in which the value occurs. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.unionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var unionWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurrence of each element
     * is kept. The order of result values is determined by the order they occur
     * in the array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     */
    function uniq(array) {
      return (array && array.length) ? baseUniq(array) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * uniqueness is computed. The order of result values is determined by the
     * order they occur in the array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniqBy(array, iteratee) {
      return (array && array.length) ? baseUniq(array, getIteratee(iteratee, 2)) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `comparator` which
     * is invoked to compare elements of `array`. The order of result values is
     * determined by the order they occur in the array.The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.uniqWith(objects, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
     */
    function uniqWith(array, comparator) {
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return (array && array.length) ? baseUniq(array, undefined, comparator) : [];
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @since 1.2.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     *
     * _.unzip(zipped);
     * // => [['a', 'b'], [1, 2], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var length = 0;
      array = arrayFilter(array, function(group) {
        if (isArrayLikeObject(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      return baseTimes(length, function(index) {
        return arrayMap(array, baseProperty(index));
      });
    }

    /**
     * This method is like `_.unzip` except that it accepts `iteratee` to specify
     * how regrouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  regrouped values.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee) {
      if (!(array && array.length)) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      return arrayMap(result, function(group) {
        return apply(iteratee, undefined, group);
      });
    }

    /**
     * Creates an array excluding all given values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.pull`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.xor
     * @example
     *
     * _.without([2, 1, 2, 3], 1, 2);
     * // => [3]
     */
    var without = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the
     * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the given arrays. The order of result values is determined by the order
     * they occur in the arrays.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.without
     * @example
     *
     * _.xor([2, 1], [2, 3]);
     * // => [1, 3]
     */
    var xor = baseRest(function(arrays) {
      return baseXor(arrayFilter(arrays, isArrayLikeObject));
    });

    /**
     * This method is like `_.xor` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which by which they're compared. The order of result values is determined
     * by the order they occur in the arrays. The iteratee is invoked with one
     * argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2, 3.4]
     *
     * // The `_.property` iteratee shorthand.
     * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var xorBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.xor` except that it accepts `comparator` which is
     * invoked to compare elements of `arrays`. The order of result values is
     * determined by the order they occur in the arrays. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.xorWith(objects, others, _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var xorWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
    });

    /**
     * Creates an array of grouped elements, the first of which contains the
     * first elements of the given arrays, the second of which contains the
     * second elements of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     */
    var zip = baseRest(unzip);

    /**
     * This method is like `_.fromPairs` except that it accepts two arrays,
     * one of property identifiers and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 0.4.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject(['a', 'b'], [1, 2]);
     * // => { 'a': 1, 'b': 2 }
     */
    function zipObject(props, values) {
      return baseZipObject(props || [], values || [], assignValue);
    }

    /**
     * This method is like `_.zipObject` except that it supports property paths.
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
     * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
     */
    function zipObjectDeep(props, values) {
      return baseZipObject(props || [], values || [], baseSet);
    }

    /**
     * This method is like `_.zip` except that it accepts `iteratee` to specify
     * how grouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  grouped values.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
     *   return a + b + c;
     * });
     * // => [111, 222]
     */
    var zipWith = baseRest(function(arrays) {
      var length = arrays.length,
          iteratee = length > 1 ? arrays[length - 1] : undefined;

      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
      return unzipWith(arrays, iteratee);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` wrapper instance that wraps `value` with explicit method
     * chain sequences enabled. The result of such sequences must be unwrapped
     * with `_#value`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Seq
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _
     *   .chain(users)
     *   .sortBy('age')
     *   .map(function(o) {
     *     return o.user + ' is ' + o.age;
     *   })
     *   .head()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor
     * is invoked with one argument; (value). The purpose of this method is to
     * "tap into" a method chain sequence in order to modify intermediate results.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    // Mutate input array.
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     * The purpose of this method is to "pass thru" values replacing intermediate
     * results in a method chain sequence.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor) {
      return interceptor(value);
    }

    /**
     * This method is the wrapper version of `_.at`.
     *
     * @name at
     * @memberOf _
     * @since 1.0.0
     * @category Seq
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _(object).at(['a[0].b.c', 'a[1]']).value();
     * // => [3, 4]
     */
    var wrapperAt = flatRest(function(paths) {
      var length = paths.length,
          start = length ? paths[0] : 0,
          value = this.__wrapped__,
          interceptor = function(object) { return baseAt(object, paths); };

      if (length > 1 || this.__actions__.length ||
          !(value instanceof LazyWrapper) || !isIndex(start)) {
        return this.thru(interceptor);
      }
      value = value.slice(start, +start + (length ? 1 : 0));
      value.__actions__.push({
        'func': thru,
        'args': [interceptor],
        'thisArg': undefined
      });
      return new LodashWrapper(value, this.__chain__).thru(function(array) {
        if (length && !array.length) {
          array.push(undefined);
        }
        return array;
      });
    });

    /**
     * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
     *
     * @name chain
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // A sequence without explicit chaining.
     * _(users).head();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // A sequence with explicit chaining.
     * _(users)
     *   .chain()
     *   .head()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chain sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * Gets the next value on a wrapped object following the
     * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
     *
     * @name next
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the next iterator value.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 1 }
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 2 }
     *
     * wrapped.next();
     * // => { 'done': true, 'value': undefined }
     */
    function wrapperNext() {
      if (this.__values__ === undefined) {
        this.__values__ = toArray(this.value());
      }
      var done = this.__index__ >= this.__values__.length,
          value = done ? undefined : this.__values__[this.__index__++];

      return { 'done': done, 'value': value };
    }

    /**
     * Enables the wrapper to be iterable.
     *
     * @name Symbol.iterator
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped[Symbol.iterator]() === wrapped;
     * // => true
     *
     * Array.from(wrapped);
     * // => [1, 2]
     */
    function wrapperToIterator() {
      return this;
    }

    /**
     * Creates a clone of the chain sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @param {*} value The value to plant.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2]).map(square);
     * var other = wrapped.plant([3, 4]);
     *
     * other.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        clone.__index__ = 0;
        clone.__values__ = undefined;
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * This method is the wrapper version of `_.reverse`.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({
          'func': thru,
          'args': [reverse],
          'thisArg': undefined
        });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(reverse);
    }

    /**
     * Executes the chain sequence to resolve the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @since 0.1.0
     * @alias toJSON, valueOf
     * @category Seq
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the number of times the key was returned by `iteratee`. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': 1, '6': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        ++result[key];
      } else {
        baseAssignValue(result, key, 1);
      }
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * Iteration is stopped once `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * **Note:** This method returns `true` for
     * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
     * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
     * elements of empty collections.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.every(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, guard) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * **Note:** Unlike `_.remove`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.reject
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, { 'age': 36, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.filter(users, 'active');
     * // => objects for ['barney']
     *
     * // Combining several predicates using `_.overEvery` or `_.overSome`.
     * _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
     * // => objects for ['fred', 'barney']
     */
    function filter(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.find(users, function(o) { return o.age < 40; });
     * // => object for 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.find(users, { 'age': 1, 'active': true });
     * // => object for 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.find(users, ['active', false]);
     * // => object for 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.find(users, 'active');
     * // => object for 'barney'
     */
    var find = createFind(findIndex);

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=collection.length-1] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    var findLast = createFind(findLastIndex);

    /**
     * Creates a flattened array of values by running each element in `collection`
     * thru `iteratee` and flattening the mapped results. The iteratee is invoked
     * with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [n, n];
     * }
     *
     * _.flatMap([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMap(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), 1);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDeep([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMapDeep(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), INFINITY);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDepth([1, 2], duplicate, 2);
     * // => [[1, 1], [2, 2]]
     */
    function flatMapDepth(collection, iteratee, depth) {
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(map(collection, iteratee), depth);
    }

    /**
     * Iterates over elements of `collection` and invokes `iteratee` for each element.
     * The iteratee is invoked with three arguments: (value, index|key, collection).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length"
     * property are iterated like arrays. To avoid this behavior use `_.forIn`
     * or `_.forOwn` for object iteration.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias each
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEachRight
     * @example
     *
     * _.forEach([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `1` then `2`.
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forEach(collection, iteratee) {
      var func = isArray(collection) ? arrayEach : baseEach;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @alias eachRight
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEach
     * @example
     *
     * _.forEachRight([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `2` then `1`.
     */
    function forEachRight(collection, iteratee) {
      var func = isArray(collection) ? arrayEachRight : baseEachRight;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The order of grouped values
     * is determined by the order they occur in `collection`. The corresponding
     * value of each key is an array of elements responsible for generating the
     * key. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': [4.2], '6': [6.1, 6.3] }
     *
     * // The `_.property` iteratee shorthand.
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        baseAssignValue(result, key, [value]);
      }
    });

    /**
     * Checks if `value` is in `collection`. If `collection` is a string, it's
     * checked for a substring of `value`, otherwise
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * is used for equality comparisons. If `fromIndex` is negative, it's used as
     * the offset from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {boolean} Returns `true` if `value` is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'a': 1, 'b': 2 }, 1);
     * // => true
     *
     * _.includes('abcd', 'bc');
     * // => true
     */
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection)
        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
    }

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `path` is a function, it's invoked
     * for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke each method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invokeMap([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invokeMap = baseRest(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
      });
      return result;
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the last element responsible for generating the key. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var array = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.keyBy(array, function(o) {
     *   return String.fromCharCode(o.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.keyBy(array, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     */
    var keyBy = createAggregator(function(result, value, key) {
      baseAssignValue(result, key, value);
    });

    /**
     * Creates an array of values by running each element in `collection` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
     * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
     * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
     * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * _.map([4, 8], square);
     * // => [16, 64]
     *
     * _.map({ 'a': 4, 'b': 8 }, square);
     * // => [16, 64] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee) {
      var func = isArray(collection) ? arrayMap : baseMap;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.sortBy` except that it allows specifying the sort
     * orders of the iteratees to sort by. If `orders` is unspecified, all values
     * are sorted in ascending order. Otherwise, specify an order of "desc" for
     * descending or "asc" for ascending sort order of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @param {string[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // Sort by `user` in ascending order and by `age` in descending order.
     * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
     */
    function orderBy(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      orders = guard ? undefined : orders;
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseOrderBy(collection, iteratees, orders);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, the second of which
     * contains elements `predicate` returns falsey for. The predicate is
     * invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * _.partition(users, function(o) { return o.active; });
     * // => objects for [['fred'], ['barney', 'pebbles']]
     *
     * // The `_.matches` iteratee shorthand.
     * _.partition(users, { 'age': 1, 'active': false });
     * // => objects for [['pebbles'], ['barney', 'fred']]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.partition(users, ['active', false]);
     * // => objects for [['barney', 'pebbles'], ['fred']]
     *
     * // The `_.property` iteratee shorthand.
     * _.partition(users, 'active');
     * // => objects for [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` thru `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not given, the first element of `collection` is used as the initial
     * value. The iteratee is invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
     * and `sortBy`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduceRight
     * @example
     *
     * _.reduce([1, 2], function(sum, n) {
     *   return sum + n;
     * }, 0);
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     *   return result;
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
     */
    function reduce(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduce : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduce
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduceRight : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
    }

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.filter
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * _.reject(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.reject(users, { 'age': 40, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.reject(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.reject(users, 'active');
     * // => objects for ['barney']
     */
    function reject(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, negate(getIteratee(predicate, 3)));
    }

    /**
     * Gets a random element from `collection`.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     */
    function sample(collection) {
      var func = isArray(collection) ? arraySample : baseSample;
      return func(collection);
    }

    /**
     * Gets `n` random elements at unique keys from `collection` up to the
     * size of `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @param {number} [n=1] The number of elements to sample.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the random elements.
     * @example
     *
     * _.sampleSize([1, 2, 3], 2);
     * // => [3, 1]
     *
     * _.sampleSize([1, 2, 3], 4);
     * // => [2, 3, 1]
     */
    function sampleSize(collection, n, guard) {
      if ((guard ? isIterateeCall(collection, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      var func = isArray(collection) ? arraySampleSize : baseSampleSize;
      return func(collection, n);
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      var func = isArray(collection) ? arrayShuffle : baseShuffle;
      return func(collection);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable string keyed properties for objects.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the collection size.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      if (collection == null) {
        return 0;
      }
      if (isArrayLike(collection)) {
        return isString(collection) ? stringSize(collection) : collection.length;
      }
      var tag = getTag(collection);
      if (tag == mapTag || tag == setTag) {
        return collection.size;
      }
      return baseKeys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * Iteration is stopped once `predicate` returns truthy. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.some(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, guard) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection thru each iteratee. This method
     * performs a stable sort, that is, it preserves the original sort order of
     * equal elements. The iteratees are invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 30 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.sortBy(users, [function(o) { return o.user; }]);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
     *
     * _.sortBy(users, ['user', 'age']);
     * // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
     */
    var sortBy = baseRest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => Logs the number of milliseconds it took for the deferred invocation.
     */
    var now = ctxNow || function() {
      return root.Date.now();
    };

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it's called `n` or more times.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => Logs 'done saving!' after the two async saves have completed.
     */
    function after(n, func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that invokes `func`, with up to `n` arguments,
     * ignoring any additional arguments.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      n = guard ? undefined : n;
      n = (func && n == null) ? func.length : n;
      return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it's called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery(element).on('click', _.before(5, addContactToList));
     * // => Allows adding up to 4 contacts to the list.
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and `partials` prepended to the arguments it receives.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * function greet(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * }
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = baseRest(function(func, thisArg, partials) {
      var bitmask = WRAP_BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bind));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Creates a function that invokes the method at `object[key]` with `partials`
     * prepended to the arguments it receives.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist. See
     * [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Function
     * @param {Object} object The object to invoke the method on.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = baseRest(function(object, key, partials) {
      var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bindKey));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts arguments of `func` and either invokes
     * `func` returning its result, if at least `arity` number of arguments have
     * been provided, or returns a function that accepts the remaining `func`
     * arguments, and so on. The arity of `func` may be specified if `func.length`
     * is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    function curry(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrap(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curry.placeholder;
      return result;
    }

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    function curryRight(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curryRight.placeholder;
      return result;
    }

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide `options` to indicate whether `func` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent
     * calls to the debounced function return the result of the last `func`
     * invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
      var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function invokeFunc(time) {
        var args = lastArgs,
            thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }

      function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
      }

      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            timeWaiting = wait - timeSinceLastCall;

        return maxing
          ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
          : timeWaiting;
      }

      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
      }

      function timerExpired() {
        var time = now();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
      }

      function trailingEdge(time) {
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
      }

      function cancel() {
        if (timerId !== undefined) {
          clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
      }

      function flush() {
        return timerId === undefined ? result : trailingEdge(now());
      }

      function debounced() {
        var time = now(),
            isInvoking = shouldInvoke(time);

        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
          if (timerId === undefined) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            // Handle invocations in a tight loop.
            clearTimeout(timerId);
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === undefined) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // => Logs 'deferred' after one millisecond.
     */
    var defer = baseRest(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => Logs 'later' after one second.
     */
    var delay = baseRest(function(func, wait, args) {
      return baseDelay(func, toNumber(wait) || 0, args);
    });

    /**
     * Creates a function that invokes `func` with arguments reversed.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to flip arguments for.
     * @returns {Function} Returns the new flipped function.
     * @example
     *
     * var flipped = _.flip(function() {
     *   return _.toArray(arguments);
     * });
     *
     * flipped('a', 'b', 'c', 'd');
     * // => ['d', 'c', 'b', 'a']
     */
    function flip(func) {
      return createWrap(func, WRAP_FLIP_FLAG);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache);
      return memoized;
    }

    // Expose `MapCache`.
    memoize.Cache = MapCache;

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new negated function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        var args = arguments;
        switch (args.length) {
          case 0: return !predicate.call(this);
          case 1: return !predicate.call(this, args[0]);
          case 2: return !predicate.call(this, args[0], args[1]);
          case 3: return !predicate.call(this, args[0], args[1], args[2]);
        }
        return !predicate.apply(this, args);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first invocation. The `func` is
     * invoked with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // => `createApplication` is invoked once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with its arguments transformed.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms=[_.identity]]
     *  The argument transforms.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var func = _.overArgs(function(x, y) {
     *   return [x, y];
     * }, [square, doubled]);
     *
     * func(9, 3);
     * // => [81, 6]
     *
     * func(10, 5);
     * // => [100, 10]
     */
    var overArgs = castRest(function(func, transforms) {
      transforms = (transforms.length == 1 && isArray(transforms[0]))
        ? arrayMap(transforms[0], baseUnary(getIteratee()))
        : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));

      var funcsLength = transforms.length;
      return baseRest(function(args) {
        var index = -1,
            length = nativeMin(args.length, funcsLength);

        while (++index < length) {
          args[index] = transforms[index].call(this, args[index]);
        }
        return apply(func, this, args);
      });
    });

    /**
     * Creates a function that invokes `func` with `partials` prepended to the
     * arguments it receives. This method is like `_.bind` except it does **not**
     * alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 0.2.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // Partially applied with placeholders.
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partial));
      return createWrap(func, WRAP_PARTIAL_FLAG, undefined, partials, holders);
    });

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to the arguments it receives.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // Partially applied with placeholders.
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partialRight));
      return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined, partials, holders);
    });

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified `indexes` where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, [2, 0, 1]);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     */
    var rearg = flatRest(function(func, indexes) {
      return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as
     * an array.
     *
     * **Note:** This method is based on the
     * [rest parameter](https://mdn.io/rest_parameters).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.rest(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function rest(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start === undefined ? start : toInteger(start);
      return baseRest(func, start);
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * create function and an array of arguments much like
     * [`Function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
     *
     * **Note:** This method is based on the
     * [spread operator](https://mdn.io/spread_operator).
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @param {number} [start=0] The start position of the spread.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start == null ? 0 : nativeMax(toInteger(start), 0);
      return baseRest(function(args) {
        var array = args[start],
            otherArgs = castSlice(args, 0, start);

        if (array) {
          arrayPush(otherArgs, array);
        }
        return apply(func, this, otherArgs);
      });
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed `func` invocations and a `flush` method to
     * immediately invoke them. Provide `options` to indicate whether `func`
     * should be invoked on the leading and/or trailing edge of the `wait`
     * timeout. The `func` is invoked with the last arguments provided to the
     * throttled function. Subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the throttled function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=true]
     *  Specify invoking on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // Avoid excessively updating the position while scrolling.
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
     * jQuery(element).on('click', throttled);
     *
     * // Cancel the trailing throttled invocation.
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, {
        'leading': leading,
        'maxWait': wait,
        'trailing': trailing
      });
    }

    /**
     * Creates a function that accepts up to one argument, ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.unary(parseInt));
     * // => [6, 8, 10]
     */
    function unary(func) {
      return ary(func, 1);
    }

    /**
     * Creates a function that provides `value` to `wrapper` as its first
     * argument. Any additional arguments provided to the function are appended
     * to those provided to the `wrapper`. The wrapper is invoked with the `this`
     * binding of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} [wrapper=identity] The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      return partial(castFunction(wrapper), value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Casts `value` as an array if it's not one.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Lang
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the cast array.
     * @example
     *
     * _.castArray(1);
     * // => [1]
     *
     * _.castArray({ 'a': 1 });
     * // => [{ 'a': 1 }]
     *
     * _.castArray('abc');
     * // => ['abc']
     *
     * _.castArray(null);
     * // => [null]
     *
     * _.castArray(undefined);
     * // => [undefined]
     *
     * _.castArray();
     * // => []
     *
     * var array = [1, 2, 3];
     * console.log(_.castArray(array) === array);
     * // => true
     */
    function castArray() {
      if (!arguments.length) {
        return [];
      }
      var value = arguments[0];
      return isArray(value) ? value : [value];
    }

    /**
     * Creates a shallow clone of `value`.
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
     * and supports cloning arrays, array buffers, booleans, date objects, maps,
     * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
     * arrays. The own enumerable properties of `arguments` objects are cloned
     * as plain objects. An empty object is returned for uncloneable values such
     * as error objects, functions, DOM nodes, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to clone.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeep
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var shallow = _.clone(objects);
     * console.log(shallow[0] === objects[0]);
     * // => true
     */
    function clone(value) {
      return baseClone(value, CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.clone` except that it accepts `customizer` which
     * is invoked to produce the cloned value. If `customizer` returns `undefined`,
     * cloning is handled by the method instead. The `customizer` is invoked with
     * up to four arguments; (value [, index|key, object, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeepWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * }
     *
     * var el = _.cloneWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 0
     */
    function cloneWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.cloneWith` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the deep cloned value.
     * @see _.cloneWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * }
     *
     * var el = _.cloneDeepWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 20
     */
    function cloneDeepWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * Checks if `object` conforms to `source` by invoking the predicate
     * properties of `source` with the corresponding property values of `object`.
     *
     * **Note:** This method is equivalent to `_.conforms` when `source` is
     * partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 1; } });
     * // => true
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 2; } });
     * // => false
     */
    function conformsTo(object, source) {
      return source == null || baseConformsTo(object, source, keys(source));
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     * @see _.lt
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    var gt = createRelationalOperation(baseGt);

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to
     *  `other`, else `false`.
     * @see _.lte
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    var gte = createRelationalOperation(function(value, other) {
      return value >= other;
    });

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee');
    };

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is classified as an `ArrayBuffer` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     * @example
     *
     * _.isArrayBuffer(new ArrayBuffer(2));
     * // => true
     *
     * _.isArrayBuffer(new Array(2));
     * // => false
     */
    var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        (isObjectLike(value) && baseGetTag(value) == boolTag);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

    /**
     * Checks if `value` is likely a DOM element.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
    }

    /**
     * Checks if `value` is an empty object, collection, map, or set.
     *
     * Objects are considered empty if they have no own enumerable string keyed
     * properties.
     *
     * Array-like values such as `arguments` objects, arrays, buffers, strings, or
     * jQuery-like collections are considered empty if they have a `length` of `0`.
     * Similarly, maps and sets are considered empty if they have a `size` of `0`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (value == null) {
        return true;
      }
      if (isArrayLike(value) &&
          (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
            isBuffer(value) || isTypedArray(value) || isArguments(value))) {
        return !value.length;
      }
      var tag = getTag(value);
      if (tag == mapTag || tag == setTag) {
        return !value.size;
      }
      if (isPrototype(value)) {
        return !baseKeys(value).length;
      }
      for (var key in value) {
        if (hasOwnProperty.call(value, key)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are compared by strict equality, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }

    /**
     * This method is like `_.isEqual` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with up to
     * six arguments: (objValue, othValue [, index|key, object, other, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, othValue) {
     *   if (isGreeting(objValue) && isGreeting(othValue)) {
     *     return true;
     *   }
     * }
     *
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqualWith(array, other, customizer);
     * // => true
     */
    function isEqualWith(value, other, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      if (!isObjectLike(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == errorTag || tag == domExcTag ||
        (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value));
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on
     * [`Number.isFinite`](https://mdn.io/Number/isFinite).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(3);
     * // => true
     *
     * _.isFinite(Number.MIN_VALUE);
     * // => true
     *
     * _.isFinite(Infinity);
     * // => false
     *
     * _.isFinite('3');
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /**
     * Checks if `value` is an integer.
     *
     * **Note:** This method is based on
     * [`Number.isInteger`](https://mdn.io/Number/isInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
     * @example
     *
     * _.isInteger(3);
     * // => true
     *
     * _.isInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isInteger(Infinity);
     * // => false
     *
     * _.isInteger('3');
     * // => false
     */
    function isInteger(value) {
      return typeof value == 'number' && value == toInteger(value);
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `Map` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     * @example
     *
     * _.isMap(new Map);
     * // => true
     *
     * _.isMap(new WeakMap);
     * // => false
     */
    var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

    /**
     * Performs a partial deep comparison between `object` and `source` to
     * determine if `object` contains equivalent property values.
     *
     * **Note:** This method is equivalent to `_.matches` when `source` is
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.isMatch(object, { 'b': 2 });
     * // => true
     *
     * _.isMatch(object, { 'b': 1 });
     * // => false
     */
    function isMatch(object, source) {
      return object === source || baseIsMatch(object, source, getMatchData(source));
    }

    /**
     * This method is like `_.isMatch` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with five
     * arguments: (objValue, srcValue, index|key, object, source).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, srcValue) {
     *   if (isGreeting(objValue) && isGreeting(srcValue)) {
     *     return true;
     *   }
     * }
     *
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatchWith(object, source, customizer);
     * // => true
     */
    function isMatchWith(object, source, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseIsMatch(object, source, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is based on
     * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
     * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
     * `undefined` and other non-number values.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some
      // ActiveX objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a pristine native function.
     *
     * **Note:** This method can't reliably detect native functions in the presence
     * of the core-js package because core-js circumvents this kind of detection.
     * Despite multiple requests, the core-js maintainer has made it clear: any
     * attempt to fix the detection will be obstructed. As a result, we're left
     * with little choice but to throw an error. Unfortunately, this also affects
     * packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
     * which rely on core-js.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (isMaskable(value)) {
        throw new Error(CORE_ERROR_TEXT);
      }
      return baseIsNative(value);
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is `null` or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
     * @example
     *
     * _.isNil(null);
     * // => true
     *
     * _.isNil(void 0);
     * // => true
     *
     * _.isNil(NaN);
     * // => false
     */
    function isNil(value) {
      return value == null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
     * classified as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(3);
     * // => true
     *
     * _.isNumber(Number.MIN_VALUE);
     * // => true
     *
     * _.isNumber(Infinity);
     * // => true
     *
     * _.isNumber('3');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        (isObjectLike(value) && baseGetTag(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * @static
     * @memberOf _
     * @since 0.8.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
      return typeof Ctor == 'function' && Ctor instanceof Ctor &&
        funcToString.call(Ctor) == objectCtorString;
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

    /**
     * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
     * double precision number which isn't the result of a rounded unsafe integer.
     *
     * **Note:** This method is based on
     * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
     * @example
     *
     * _.isSafeInteger(3);
     * // => true
     *
     * _.isSafeInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isSafeInteger(Infinity);
     * // => false
     *
     * _.isSafeInteger('3');
     * // => false
     */
    function isSafeInteger(value) {
      return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is classified as a `Set` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     * @example
     *
     * _.isSet(new Set);
     * // => true
     *
     * _.isSet(new WeakSet);
     * // => false
     */
    var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a string, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' ||
        (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    /**
     * Checks if `value` is classified as a `WeakMap` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
     * @example
     *
     * _.isWeakMap(new WeakMap);
     * // => true
     *
     * _.isWeakMap(new Map);
     * // => false
     */
    function isWeakMap(value) {
      return isObjectLike(value) && getTag(value) == weakMapTag;
    }

    /**
     * Checks if `value` is classified as a `WeakSet` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak set, else `false`.
     * @example
     *
     * _.isWeakSet(new WeakSet);
     * // => true
     *
     * _.isWeakSet(new Set);
     * // => false
     */
    function isWeakSet(value) {
      return isObjectLike(value) && baseGetTag(value) == weakSetTag;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     * @see _.gt
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    var lt = createRelationalOperation(baseLt);

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to
     *  `other`, else `false`.
     * @see _.gte
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    var lte = createRelationalOperation(function(value, other) {
      return value <= other;
    });

    /**
     * Converts `value` to an array.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * _.toArray({ 'a': 1, 'b': 2 });
     * // => [1, 2]
     *
     * _.toArray('abc');
     * // => ['a', 'b', 'c']
     *
     * _.toArray(1);
     * // => []
     *
     * _.toArray(null);
     * // => []
     */
    function toArray(value) {
      if (!value) {
        return [];
      }
      if (isArrayLike(value)) {
        return isString(value) ? stringToArray(value) : copyArray(value);
      }
      if (symIterator && value[symIterator]) {
        return iteratorToArray(value[symIterator]());
      }
      var tag = getTag(value),
          func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

      return func(value);
    }

    /**
     * Converts `value` to a finite number.
     *
     * @static
     * @memberOf _
     * @since 4.12.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted number.
     * @example
     *
     * _.toFinite(3.2);
     * // => 3.2
     *
     * _.toFinite(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toFinite(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toFinite('3.2');
     * // => 3.2
     */
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }

    /**
     * Converts `value` to an integer.
     *
     * **Note:** This method is loosely based on
     * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toInteger(3.2);
     * // => 3
     *
     * _.toInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toInteger(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toInteger('3.2');
     * // => 3
     */
    function toInteger(value) {
      var result = toFinite(value),
          remainder = result % 1;

      return result === result ? (remainder ? result - remainder : result) : 0;
    }

    /**
     * Converts `value` to an integer suitable for use as the length of an
     * array-like object.
     *
     * **Note:** This method is based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toLength(3.2);
     * // => 3
     *
     * _.toLength(Number.MIN_VALUE);
     * // => 0
     *
     * _.toLength(Infinity);
     * // => 4294967295
     *
     * _.toLength('3.2');
     * // => 3
     */
    function toLength(value) {
      return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
    }

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = baseTrim(value);
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable string
     * keyed properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }

    /**
     * Converts `value` to a safe integer. A safe integer can be compared and
     * represented correctly.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toSafeInteger(3.2);
     * // => 3
     *
     * _.toSafeInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toSafeInteger(Infinity);
     * // => 9007199254740991
     *
     * _.toSafeInteger('3.2');
     * // => 3
     */
    function toSafeInteger(value) {
      return value
        ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
        : (value === 0 ? value : 0);
    }

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      return value == null ? '' : baseToString(value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable string keyed properties of source objects to the
     * destination object. Source objects are applied from left to right.
     * Subsequent sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object` and is loosely based on
     * [`Object.assign`](https://mdn.io/Object/assign).
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assignIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assign({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'c': 3 }
     */
    var assign = createAssigner(function(object, source) {
      if (isPrototype(source) || isArrayLike(source)) {
        copyObject(source, keys(source), object);
        return;
      }
      for (var key in source) {
        if (hasOwnProperty.call(source, key)) {
          assignValue(object, key, source[key]);
        }
      }
    });

    /**
     * This method is like `_.assign` except that it iterates over own and
     * inherited source properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assign
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assignIn({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
     */
    var assignIn = createAssigner(function(object, source) {
      copyObject(source, keysIn(source), object);
    });

    /**
     * This method is like `_.assignIn` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extendWith
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignInWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keysIn(source), object, customizer);
    });

    /**
     * This method is like `_.assign` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignInWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keys(source), object, customizer);
    });

    /**
     * Creates an array of values corresponding to `paths` of `object`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Array} Returns the picked values.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _.at(object, ['a[0].b.c', 'a[1]']);
     * // => [3, 4]
     */
    var at = flatRest(baseAt);

    /**
     * Creates an object that inherits from the `prototype` object. If a
     * `properties` object is given, its own enumerable string keyed properties
     * are assigned to the created object.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties == null ? result : baseAssign(result, properties);
    }

    /**
     * Assigns own and inherited enumerable string keyed properties of source
     * objects to the destination object for all destination properties that
     * resolve to `undefined`. Source objects are applied from left to right.
     * Once a property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaultsDeep
     * @example
     *
     * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var defaults = baseRest(function(object, sources) {
      object = Object(object);

      var index = -1;
      var length = sources.length;
      var guard = length > 2 ? sources[2] : undefined;

      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        length = 1;
      }

      while (++index < length) {
        var source = sources[index];
        var props = keysIn(source);
        var propsIndex = -1;
        var propsLength = props.length;

        while (++propsIndex < propsLength) {
          var key = props[propsIndex];
          var value = object[key];

          if (value === undefined ||
              (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
            object[key] = source[key];
          }
        }
      }

      return object;
    });

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaults
     * @example
     *
     * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
     * // => { 'a': { 'b': 2, 'c': 3 } }
     */
    var defaultsDeep = baseRest(function(args) {
      args.push(undefined, customDefaultsMerge);
      return apply(mergeWith, undefined, args);
    });

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(o) { return o.age < 40; });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // The `_.matches` iteratee shorthand.
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    function findKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(o) { return o.age < 40; });
     * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    function findLastKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
    }

    /**
     * Iterates over own and inherited enumerable string keyed properties of an
     * object and invokes `iteratee` for each property. The iteratee is invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forInRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
     */
    function forIn(object, iteratee) {
      return object == null
        ? object
        : baseFor(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
     */
    function forInRight(object, iteratee) {
      return object == null
        ? object
        : baseForRight(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * Iterates over own enumerable string keyed properties of an object and
     * invokes `iteratee` for each property. The iteratee is invoked with three
     * arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwnRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forOwn(object, iteratee) {
      return object && baseForOwn(object, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
     */
    function forOwnRight(object, iteratee) {
      return object && baseForOwnRight(object, getIteratee(iteratee, 3));
    }

    /**
     * Creates an array of function property names from own enumerable properties
     * of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functionsIn
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functions(new Foo);
     * // => ['a', 'b']
     */
    function functions(object) {
      return object == null ? [] : baseFunctions(object, keys(object));
    }

    /**
     * Creates an array of function property names from own and inherited
     * enumerable properties of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functions
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functionsIn(new Foo);
     * // => ['a', 'b', 'c']
     */
    function functionsIn(object) {
      return object == null ? [] : baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined`, the `defaultValue` is returned in its place.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': 2 } };
     * var other = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b');
     * // => true
     *
     * _.has(object, ['a', 'b']);
     * // => true
     *
     * _.has(other, 'a');
     * // => false
     */
    function has(object, path) {
      return object != null && hasPath(object, path, baseHas);
    }

    /**
     * Checks if `path` is a direct or inherited property of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.hasIn(object, 'a');
     * // => true
     *
     * _.hasIn(object, 'a.b');
     * // => true
     *
     * _.hasIn(object, ['a', 'b']);
     * // => true
     *
     * _.hasIn(object, 'b');
     * // => false
     */
    function hasIn(object, path) {
      return object != null && hasPath(object, path, baseHasIn);
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite
     * property assignments of previous values.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Object
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     */
    var invert = createInverter(function(result, value, key) {
      if (value != null &&
          typeof value.toString != 'function') {
        value = nativeObjectToString.call(value);
      }

      result[value] = key;
    }, constant(identity));

    /**
     * This method is like `_.invert` except that the inverted object is generated
     * from the results of running each element of `object` thru `iteratee`. The
     * corresponding inverted value of each inverted key is an array of keys
     * responsible for generating the inverted value. The iteratee is invoked
     * with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Object
     * @param {Object} object The object to invert.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invertBy(object);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     *
     * _.invertBy(object, function(value) {
     *   return 'group' + value;
     * });
     * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
     */
    var invertBy = createInverter(function(result, value, key) {
      if (value != null &&
          typeof value.toString != 'function') {
        value = nativeObjectToString.call(value);
      }

      if (hasOwnProperty.call(result, value)) {
        result[value].push(key);
      } else {
        result[value] = [key];
      }
    }, getIteratee);

    /**
     * Invokes the method at `path` of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
     *
     * _.invoke(object, 'a[0].b.c.slice', 1, 3);
     * // => [2, 3]
     */
    var invoke = baseRest(baseInvoke);

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * string keyed property of `object` thru `iteratee`. The iteratee is invoked
     * with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapValues
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    function mapKeys(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, iteratee(value, key, object), value);
      });
      return result;
    }

    /**
     * Creates an object with the same keys as `object` and values generated
     * by running each own enumerable string keyed property of `object` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapKeys
     * @example
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * _.mapValues(users, function(o) { return o.age; });
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     *
     * // The `_.property` iteratee shorthand.
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    function mapValues(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, key, iteratee(value, key, object));
      });
      return result;
    }

    /**
     * This method is like `_.assign` except that it recursively merges own and
     * inherited enumerable string keyed properties of source objects into the
     * destination object. Source properties that resolve to `undefined` are
     * skipped if a destination value exists. Array and plain object properties
     * are merged recursively. Other objects and value types are overridden by
     * assignment. Source objects are applied from left to right. Subsequent
     * sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {
     *   'a': [{ 'b': 2 }, { 'd': 4 }]
     * };
     *
     * var other = {
     *   'a': [{ 'c': 3 }, { 'e': 5 }]
     * };
     *
     * _.merge(object, other);
     * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
     */
    var merge = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });

    /**
     * This method is like `_.merge` except that it accepts `customizer` which
     * is invoked to produce the merged values of the destination and source
     * properties. If `customizer` returns `undefined`, merging is handled by the
     * method instead. The `customizer` is invoked with six arguments:
     * (objValue, srcValue, key, object, source, stack).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   if (_.isArray(objValue)) {
     *     return objValue.concat(srcValue);
     *   }
     * }
     *
     * var object = { 'a': [1], 'b': [2] };
     * var other = { 'a': [3], 'b': [4] };
     *
     * _.mergeWith(object, other, customizer);
     * // => { 'a': [1, 3], 'b': [2, 4] }
     */
    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
      baseMerge(object, source, srcIndex, customizer);
    });

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable property paths of `object` that are not omitted.
     *
     * **Note:** This method is considerably slower than `_.pick`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to omit.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omit(object, ['a', 'c']);
     * // => { 'b': '2' }
     */
    var omit = flatRest(function(object, paths) {
      var result = {};
      if (object == null) {
        return result;
      }
      var isDeep = false;
      paths = arrayMap(paths, function(path) {
        path = castPath(path, object);
        isDeep || (isDeep = path.length > 1);
        return path;
      });
      copyObject(object, getAllKeysIn(object), result);
      if (isDeep) {
        result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
      }
      var length = paths.length;
      while (length--) {
        baseUnset(result, paths[length]);
      }
      return result;
    });

    /**
     * The opposite of `_.pickBy`; this method creates an object composed of
     * the own and inherited enumerable string keyed properties of `object` that
     * `predicate` doesn't return truthy for. The predicate is invoked with two
     * arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omitBy(object, _.isNumber);
     * // => { 'b': '2' }
     */
    function omitBy(object, predicate) {
      return pickBy(object, negate(getIteratee(predicate)));
    }

    /**
     * Creates an object composed of the picked `object` properties.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pick(object, ['a', 'c']);
     * // => { 'a': 1, 'c': 3 }
     */
    var pick = flatRest(function(object, paths) {
      return object == null ? {} : basePick(object, paths);
    });

    /**
     * Creates an object composed of the `object` properties `predicate` returns
     * truthy for. The predicate is invoked with two arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pickBy(object, _.isNumber);
     * // => { 'a': 1, 'c': 3 }
     */
    function pickBy(object, predicate) {
      if (object == null) {
        return {};
      }
      var props = arrayMap(getAllKeysIn(object), function(prop) {
        return [prop];
      });
      predicate = getIteratee(predicate);
      return basePickBy(object, props, function(value, path) {
        return predicate(value, path[0]);
      });
    }

    /**
     * This method is like `_.get` except that if the resolved value is a
     * function it's invoked with the `this` binding of its parent object and
     * its result is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a[0].b.c3', 'default');
     * // => 'default'
     *
     * _.result(object, 'a[0].b.c3', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      path = castPath(path, object);

      var index = -1,
          length = path.length;

      // Ensure the loop is entered when path is empty.
      if (!length) {
        length = 1;
        object = undefined;
      }
      while (++index < length) {
        var value = object == null ? undefined : object[toKey(path[index])];
        if (value === undefined) {
          index = length;
          value = defaultValue;
        }
        object = isFunction(value) ? value.call(object) : value;
      }
      return object;
    }

    /**
     * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
     * it's created. Arrays are created for missing index properties while objects
     * are created for all other missing properties. Use `_.setWith` to customize
     * `path` creation.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, ['x', '0', 'y', 'z'], 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      return object == null ? object : baseSet(object, path, value);
    }

    /**
     * This method is like `_.set` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.setWith(object, '[0][1]', 'a', Object);
     * // => { '0': { '1': 'a' } }
     */
    function setWith(object, path, value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseSet(object, path, value, customizer);
    }

    /**
     * Creates an array of own enumerable string keyed-value pairs for `object`
     * which can be consumed by `_.fromPairs`. If `object` is a map or set, its
     * entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entries
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairs(new Foo);
     * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
     */
    var toPairs = createToPairs(keys);

    /**
     * Creates an array of own and inherited enumerable string keyed-value pairs
     * for `object` which can be consumed by `_.fromPairs`. If `object` is a map
     * or set, its entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entriesIn
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairsIn(new Foo);
     * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
     */
    var toPairsIn = createToPairs(keysIn);

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable string keyed properties thru `iteratee`, with each invocation
     * potentially mutating the `accumulator` object. If `accumulator` is not
     * provided, a new object with the same `[[Prototype]]` will be used. The
     * iteratee is invoked with four arguments: (accumulator, value, key, object).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * }, []);
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function transform(object, iteratee, accumulator) {
      var isArr = isArray(object),
          isArrLike = isArr || isBuffer(object) || isTypedArray(object);

      iteratee = getIteratee(iteratee, 4);
      if (accumulator == null) {
        var Ctor = object && object.constructor;
        if (isArrLike) {
          accumulator = isArr ? new Ctor : [];
        }
        else if (isObject(object)) {
          accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
        }
        else {
          accumulator = {};
        }
      }
      (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Removes the property at `path` of `object`.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 7 } }] };
     * _.unset(object, 'a[0].b.c');
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     *
     * _.unset(object, ['a', '0', 'b', 'c']);
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     */
    function unset(object, path) {
      return object == null ? true : baseUnset(object, path);
    }

    /**
     * This method is like `_.set` except that accepts `updater` to produce the
     * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
     * is invoked with one argument: (value).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.update(object, 'a[0].b.c', function(n) { return n * n; });
     * console.log(object.a[0].b.c);
     * // => 9
     *
     * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
     * console.log(object.x[0].y.z);
     * // => 0
     */
    function update(object, path, updater) {
      return object == null ? object : baseUpdate(object, path, castFunction(updater));
    }

    /**
     * This method is like `_.update` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.updateWith(object, '[0][1]', _.constant('a'), Object);
     * // => { '0': { '1': 'a' } }
     */
    function updateWith(object, path, updater, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
    }

    /**
     * Creates an array of the own enumerable string keyed property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return object == null ? [] : baseValues(object, keys(object));
    }

    /**
     * Creates an array of the own and inherited enumerable string keyed property
     * values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return object == null ? [] : baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Clamps `number` within the inclusive `lower` and `upper` bounds.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Number
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     * @example
     *
     * _.clamp(-10, -5, 5);
     * // => -5
     *
     * _.clamp(10, -5, 5);
     * // => 5
     */
    function clamp(number, lower, upper) {
      if (upper === undefined) {
        upper = lower;
        lower = undefined;
      }
      if (upper !== undefined) {
        upper = toNumber(upper);
        upper = upper === upper ? upper : 0;
      }
      if (lower !== undefined) {
        lower = toNumber(lower);
        lower = lower === lower ? lower : 0;
      }
      return baseClamp(toNumber(number), lower, upper);
    }

    /**
     * Checks if `n` is between `start` and up to, but not including, `end`. If
     * `end` is not specified, it's set to `start` with `start` then set to `0`.
     * If `start` is greater than `end` the params are swapped to support
     * negative ranges.
     *
     * @static
     * @memberOf _
     * @since 3.3.0
     * @category Number
     * @param {number} number The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     * @see _.range, _.rangeRight
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     *
     * _.inRange(-3, -2, -6);
     * // => true
     */
    function inRange(number, start, end) {
      start = toFinite(start);
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = toFinite(end);
      }
      number = toNumber(number);
      return baseInRange(number, start, end);
    }

    /**
     * Produces a random number between the inclusive `lower` and `upper` bounds.
     * If only one argument is provided a number between `0` and the given number
     * is returned. If `floating` is `true`, or either `lower` or `upper` are
     * floats, a floating-point number is returned instead of an integer.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Number
     * @param {number} [lower=0] The lower bound.
     * @param {number} [upper=1] The upper bound.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(lower, upper, floating) {
      if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
        upper = floating = undefined;
      }
      if (floating === undefined) {
        if (typeof upper == 'boolean') {
          floating = upper;
          upper = undefined;
        }
        else if (typeof lower == 'boolean') {
          floating = lower;
          lower = undefined;
        }
      }
      if (lower === undefined && upper === undefined) {
        lower = 0;
        upper = 1;
      }
      else {
        lower = toFinite(lower);
        if (upper === undefined) {
          upper = lower;
          lower = 0;
        } else {
          upper = toFinite(upper);
        }
      }
      if (lower > upper) {
        var temp = lower;
        lower = upper;
        upper = temp;
      }
      if (floating || lower % 1 || upper % 1) {
        var rand = nativeRandom();
        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
      }
      return baseRandom(lower, upper);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar--');
     * // => 'fooBar'
     *
     * _.camelCase('__FOO_BAR__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? capitalize(word) : word);
    });

    /**
     * Converts the first character of `string` to upper case and the remaining
     * to lower case.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('FRED');
     * // => 'Fred'
     */
    function capitalize(string) {
      return upperFirst(toString(string).toLowerCase());
    }

    /**
     * Deburrs `string` by converting
     * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
     * letters to basic Latin letters and removing
     * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = toString(string);
      return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search up to.
     * @returns {boolean} Returns `true` if `string` ends with `target`,
     *  else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = toString(string);
      target = baseToString(target);

      var length = string.length;
      position = position === undefined
        ? length
        : baseClamp(toInteger(position), 0, length);

      var end = position;
      position -= target.length;
      return position >= 0 && string.slice(position, end) == target;
    }

    /**
     * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
     * corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional
     * characters use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value. See
     * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * When working with HTML you should always
     * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
     * XSS vectors.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      string = toString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
     * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https://lodash\.com/\)'
     */
    function escapeRegExp(string) {
      string = toString(string);
      return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : string;
    }

    /**
     * Converts `string` to
     * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__FOO_BAR__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Converts `string`, as space separated words, to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.lowerCase('--Foo-Bar--');
     * // => 'foo bar'
     *
     * _.lowerCase('fooBar');
     * // => 'foo bar'
     *
     * _.lowerCase('__FOO_BAR__');
     * // => 'foo bar'
     */
    var lowerCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toLowerCase();
    });

    /**
     * Converts the first character of `string` to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.lowerFirst('Fred');
     * // => 'fred'
     *
     * _.lowerFirst('FRED');
     * // => 'fRED'
     */
    var lowerFirst = createCaseFirst('toLowerCase');

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      if (!length || strLength >= length) {
        return string;
      }
      var mid = (length - strLength) / 2;
      return (
        createPadding(nativeFloor(mid), chars) +
        string +
        createPadding(nativeCeil(mid), chars)
      );
    }

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padEnd('abc', 6);
     * // => 'abc   '
     *
     * _.padEnd('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padEnd('abc', 3);
     * // => 'abc'
     */
    function padEnd(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (string + createPadding(length - strLength, chars))
        : string;
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padStart('abc', 6);
     * // => '   abc'
     *
     * _.padStart('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padStart('abc', 3);
     * // => 'abc'
     */
    function padStart(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (createPadding(length - strLength, chars) + string)
        : string;
    }

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a
     * hexadecimal, in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the
     * [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix=10] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      if (guard || radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=1] The number of times to repeat the string.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n, guard) {
      if ((guard ? isIterateeCall(string, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      return baseRepeat(toString(string), n);
    }

    /**
     * Replaces matches for `pattern` in `string` with `replacement`.
     *
     * **Note:** This method is based on
     * [`String#replace`](https://mdn.io/String/replace).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to modify.
     * @param {RegExp|string} pattern The pattern to replace.
     * @param {Function|string} replacement The match replacement.
     * @returns {string} Returns the modified string.
     * @example
     *
     * _.replace('Hi Fred', 'Fred', 'Barney');
     * // => 'Hi Barney'
     */
    function replace() {
      var args = arguments,
          string = toString(args[0]);

      return args.length < 3 ? string : string.replace(args[1], args[2]);
    }

    /**
     * Converts `string` to
     * [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--FOO-BAR--');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Splits `string` by `separator`.
     *
     * **Note:** This method is based on
     * [`String#split`](https://mdn.io/String/split).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to split.
     * @param {RegExp|string} separator The separator pattern to split by.
     * @param {number} [limit] The length to truncate results to.
     * @returns {Array} Returns the string segments.
     * @example
     *
     * _.split('a-b-c', '-', 2);
     * // => ['a', 'b']
     */
    function split(string, separator, limit) {
      if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
        separator = limit = undefined;
      }
      limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;
      if (!limit) {
        return [];
      }
      string = toString(string);
      if (string && (
            typeof separator == 'string' ||
            (separator != null && !isRegExp(separator))
          )) {
        separator = baseToString(separator);
        if (!separator && hasUnicode(string)) {
          return castSlice(stringToArray(string), 0, limit);
        }
      }
      return string.split(separator, limit);
    }

    /**
     * Converts `string` to
     * [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @since 3.1.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar--');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__FOO_BAR__');
     * // => 'FOO BAR'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + upperFirst(word);
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`,
     *  else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = toString(string);
      position = position == null
        ? 0
        : baseClamp(toInteger(position), 0, string.length);

      target = baseToString(target);
      return string.slice(position, position + target.length) == target;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is given, it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options={}] The options object.
     * @param {RegExp} [options.escape=_.templateSettings.escape]
     *  The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
     *  The "evaluate" delimiter.
     * @param {Object} [options.imports=_.templateSettings.imports]
     *  An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
     *  The "interpolate" delimiter.
     * @param {string} [options.sourceURL='lodash.templateSources[n]']
     *  The sourceURL of the compiled template.
     * @param {string} [options.variable='obj']
     *  The data object variable name.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // Use the "interpolate" delimiter to create a compiled template.
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // Use the HTML "escape" delimiter to escape data property values.
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the internal `print` function in "evaluate" delimiters.
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // Use the ES template literal delimiter as an "interpolate" delimiter.
     * // Disable support by replacing the "interpolate" delimiter.
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // Use backslashes to treat delimiters as plain text.
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // Use the `imports` option to import `jQuery` as `jq`.
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the `sourceURL` option to specify a custom sourceURL for the template.
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
     *
     * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // Use custom template delimiters.
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // Use the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and stack traces.
     * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, guard) {
      // Based on John Resig's `tmpl` implementation
      // (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      string = toString(string);
      options = assignInWith({}, options, settings, customDefaultsAssignIn);

      var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      // The sourceURL gets injected into the source that's eval-ed, so be careful
      // to normalize all kinds of whitespace, so e.g. newlines (and unicode versions of it) can't sneak in
      // and escape the comment, thus injecting code that gets evaled.
      var sourceURL = '//# sourceURL=' +
        (hasOwnProperty.call(options, 'sourceURL')
          ? (options.sourceURL + '').replace(/\s/g, ' ')
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products needs `match` returned in
        // order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = hasOwnProperty.call(options, 'variable') && options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Throw an error if a forbidden character was found in `variable`, to prevent
      // potential command injection attacks.
      else if (reForbiddenIdentifierChars.test(variable)) {
        throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
      }

      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source)
          .apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Converts `string`, as a whole, to lower case just like
     * [String#toLowerCase](https://mdn.io/toLowerCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.toLower('--Foo-Bar--');
     * // => '--foo-bar--'
     *
     * _.toLower('fooBar');
     * // => 'foobar'
     *
     * _.toLower('__FOO_BAR__');
     * // => '__foo_bar__'
     */
    function toLower(value) {
      return toString(value).toLowerCase();
    }

    /**
     * Converts `string`, as a whole, to upper case just like
     * [String#toUpperCase](https://mdn.io/toUpperCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.toUpper('--foo-bar--');
     * // => '--FOO-BAR--'
     *
     * _.toUpper('fooBar');
     * // => 'FOOBAR'
     *
     * _.toUpper('__foo_bar__');
     * // => '__FOO_BAR__'
     */
    function toUpper(value) {
      return toString(value).toUpperCase();
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return baseTrim(string);
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          chrSymbols = stringToArray(chars),
          start = charsStartIndex(strSymbols, chrSymbols),
          end = charsEndIndex(strSymbols, chrSymbols) + 1;

      return castSlice(strSymbols, start, end).join('');
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimEnd('  abc  ');
     * // => '  abc'
     *
     * _.trimEnd('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimEnd(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.slice(0, trimmedEndIndex(string) + 1);
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;

      return castSlice(strSymbols, 0, end).join('');
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimStart('  abc  ');
     * // => 'abc  '
     *
     * _.trimStart('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimStart(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(reTrimStart, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          start = charsStartIndex(strSymbols, stringToArray(chars));

      return castSlice(strSymbols, start).join('');
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object} [options={}] The options object.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.truncate('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function truncate(string, options) {
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (isObject(options)) {
        var separator = 'separator' in options ? options.separator : separator;
        length = 'length' in options ? toInteger(options.length) : length;
        omission = 'omission' in options ? baseToString(options.omission) : omission;
      }
      string = toString(string);

      var strLength = string.length;
      if (hasUnicode(string)) {
        var strSymbols = stringToArray(string);
        strLength = strSymbols.length;
      }
      if (length >= strLength) {
        return string;
      }
      var end = length - stringSize(omission);
      if (end < 1) {
        return omission;
      }
      var result = strSymbols
        ? castSlice(strSymbols, 0, end).join('')
        : string.slice(0, end);

      if (separator === undefined) {
        return result + omission;
      }
      if (strSymbols) {
        end += (result.length - end);
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              substring = result;

          if (!separator.global) {
            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            var newEnd = match.index;
          }
          result = result.slice(0, newEnd === undefined ? end : newEnd);
        }
      } else if (string.indexOf(baseToString(separator), end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
     * their corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional
     * HTML entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @since 0.6.0
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = toString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Converts `string`, as space separated words, to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.upperCase('--foo-bar');
     * // => 'FOO BAR'
     *
     * _.upperCase('fooBar');
     * // => 'FOO BAR'
     *
     * _.upperCase('__foo_bar__');
     * // => 'FOO BAR'
     */
    var upperCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toUpperCase();
    });

    /**
     * Converts the first character of `string` to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.upperFirst('fred');
     * // => 'Fred'
     *
     * _.upperFirst('FRED');
     * // => 'FRED'
     */
    var upperFirst = createCaseFirst('toUpperCase');

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      string = toString(string);
      pattern = guard ? undefined : pattern;

      if (pattern === undefined) {
        return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
      }
      return string.match(pattern) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Function} func The function to attempt.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // Avoid throwing errors for invalid selectors.
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = baseRest(function(func, args) {
      try {
        return apply(func, undefined, args);
      } catch (e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method.
     *
     * **Note:** This method doesn't set the "length" property of bound functions.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} methodNames The object method names to bind.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'click': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view, ['click']);
     * jQuery(element).on('click', view.click);
     * // => Logs 'clicked docs' when clicked.
     */
    var bindAll = flatRest(function(object, methodNames) {
      arrayEach(methodNames, function(key) {
        key = toKey(key);
        baseAssignValue(object, key, bind(object[key], object));
      });
      return object;
    });

    /**
     * Creates a function that iterates over `pairs` and invokes the corresponding
     * function of the first predicate to return truthy. The predicate-function
     * pairs are invoked with the `this` binding and arguments of the created
     * function.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Array} pairs The predicate-function pairs.
     * @returns {Function} Returns the new composite function.
     * @example
     *
     * var func = _.cond([
     *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
     *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
     *   [_.stubTrue,                      _.constant('no match')]
     * ]);
     *
     * func({ 'a': 1, 'b': 2 });
     * // => 'matches A'
     *
     * func({ 'a': 0, 'b': 1 });
     * // => 'matches B'
     *
     * func({ 'a': '1', 'b': '2' });
     * // => 'no match'
     */
    function cond(pairs) {
      var length = pairs == null ? 0 : pairs.length,
          toIteratee = getIteratee();

      pairs = !length ? [] : arrayMap(pairs, function(pair) {
        if (typeof pair[1] != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        return [toIteratee(pair[0]), pair[1]];
      });

      return baseRest(function(args) {
        var index = -1;
        while (++index < length) {
          var pair = pairs[index];
          if (apply(pair[0], this, args)) {
            return apply(pair[1], this, args);
          }
        }
      });
    }

    /**
     * Creates a function that invokes the predicate properties of `source` with
     * the corresponding property values of a given object, returning `true` if
     * all predicates return truthy, else `false`.
     *
     * **Note:** The created function is equivalent to `_.conformsTo` with
     * `source` partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 2, 'b': 1 },
     *   { 'a': 1, 'b': 2 }
     * ];
     *
     * _.filter(objects, _.conforms({ 'b': function(n) { return n > 1; } }));
     * // => [{ 'a': 1, 'b': 2 }]
     */
    function conforms(source) {
      return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new constant function.
     * @example
     *
     * var objects = _.times(2, _.constant({ 'a': 1 }));
     *
     * console.log(objects);
     * // => [{ 'a': 1 }, { 'a': 1 }]
     *
     * console.log(objects[0] === objects[1]);
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Checks `value` to determine whether a default value should be returned in
     * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
     * or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Util
     * @param {*} value The value to check.
     * @param {*} defaultValue The default value.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * _.defaultTo(1, 10);
     * // => 1
     *
     * _.defaultTo(undefined, 10);
     * // => 10
     */
    function defaultTo(value, defaultValue) {
      return (value == null || value !== value) ? defaultValue : value;
    }

    /**
     * Creates a function that returns the result of invoking the given functions
     * with the `this` binding of the created function, where each successive
     * invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flowRight
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow([_.add, square]);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the given functions from right to left.
     *
     * @static
     * @since 3.0.0
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flow
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight([square, _.add]);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * This method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that invokes `func` with the arguments of the created
     * function. If `func` is a property name, the created function returns the
     * property value for a given element. If `func` is an array or object, the
     * created function returns `true` for elements that contain the equivalent
     * source properties, otherwise it returns `false`.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Util
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
     * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, _.iteratee(['user', 'fred']));
     * // => [{ 'user': 'fred', 'age': 40 }]
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, _.iteratee('user'));
     * // => ['barney', 'fred']
     *
     * // Create custom iteratee shorthands.
     * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
     *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
     *     return func.test(string);
     *   };
     * });
     *
     * _.filter(['abc', 'def'], /ef/);
     * // => ['def']
     */
    function iteratee(func) {
      return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between a given
     * object and `source`, returning `true` if the given object has equivalent
     * property values, else `false`.
     *
     * **Note:** The created function is equivalent to `_.isMatch` with `source`
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * **Note:** Multiple values can be checked by combining several matchers
     * using `_.overSome`
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
     * // => [{ 'a': 4, 'b': 5, 'c': 6 }]
     *
     * // Checking for several possible values
     * _.filter(objects, _.overSome([_.matches({ 'a': 1 }), _.matches({ 'a': 4 })]));
     * // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between the
     * value at `path` of a given object to `srcValue`, returning `true` if the
     * object value is equivalent, else `false`.
     *
     * **Note:** Partial comparisons will match empty array and empty object
     * `srcValue` values against any array or object value, respectively. See
     * `_.isEqual` for a list of supported value comparisons.
     *
     * **Note:** Multiple values can be checked by combining several matchers
     * using `_.overSome`
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.find(objects, _.matchesProperty('a', 4));
     * // => { 'a': 4, 'b': 5, 'c': 6 }
     *
     * // Checking for several possible values
     * _.filter(objects, _.overSome([_.matchesProperty('a', 1), _.matchesProperty('a', 4)]));
     * // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that invokes the method at `path` of a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': _.constant(2) } },
     *   { 'a': { 'b': _.constant(1) } }
     * ];
     *
     * _.map(objects, _.method('a.b'));
     * // => [2, 1]
     *
     * _.map(objects, _.method(['a', 'b']));
     * // => [2, 1]
     */
    var method = baseRest(function(path, args) {
      return function(object) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path of `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = baseRest(function(object, args) {
      return function(path) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * Adds all own enumerable string keyed function properties of a source
     * object to the destination object. If `object` is a function, then methods
     * are added to its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      var props = keys(source),
          methodNames = baseFunctions(source, props);

      if (options == null &&
          !(isObject(source) && (methodNames.length || !props.length))) {
        options = source;
        source = object;
        object = this;
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
          isFunc = isFunction(object);

      arrayEach(methodNames, function(methodName) {
        var func = source[methodName];
        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = function() {
            var chainAll = this.__chain__;
            if (chain || chainAll) {
              var result = object(this.__wrapped__),
                  actions = result.__actions__ = copyArray(this.__actions__);

              actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
              result.__chain__ = chainAll;
              return result;
            }
            return func.apply(object, arrayPush([this.value()], arguments));
          };
        }
      });

      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      if (root._ === this) {
        root._ = oldDash;
      }
      return this;
    }

    /**
     * This method returns `undefined`.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Util
     * @example
     *
     * _.times(2, _.noop);
     * // => [undefined, undefined]
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function that gets the argument at index `n`. If `n` is negative,
     * the nth argument from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [n=0] The index of the argument to return.
     * @returns {Function} Returns the new pass-thru function.
     * @example
     *
     * var func = _.nthArg(1);
     * func('a', 'b', 'c', 'd');
     * // => 'b'
     *
     * var func = _.nthArg(-2);
     * func('a', 'b', 'c', 'd');
     * // => 'c'
     */
    function nthArg(n) {
      n = toInteger(n);
      return baseRest(function(args) {
        return baseNth(args, n);
      });
    }

    /**
     * Creates a function that invokes `iteratees` with the arguments it receives
     * and returns their results.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.over([Math.max, Math.min]);
     *
     * func(1, 2, 3, 4);
     * // => [4, 1]
     */
    var over = createOver(arrayMap);

    /**
     * Creates a function that checks if **all** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * Following shorthands are possible for providing predicates.
     * Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
     * Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overEvery([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => false
     *
     * func(NaN);
     * // => false
     */
    var overEvery = createOver(arrayEvery);

    /**
     * Creates a function that checks if **any** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * Following shorthands are possible for providing predicates.
     * Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
     * Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overSome([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => true
     *
     * func(NaN);
     * // => false
     *
     * var matchesFunc = _.overSome([{ 'a': 1 }, { 'a': 2 }])
     * var matchesPropertyFunc = _.overSome([['a', 1], ['a', 2]])
     */
    var overSome = createOver(arraySome);

    /**
     * Creates a function that returns the value at `path` of a given object.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': 2 } },
     *   { 'a': { 'b': 1 } }
     * ];
     *
     * _.map(objects, _.property('a.b'));
     * // => [2, 1]
     *
     * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the value at a given path of `object`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return object == null ? undefined : baseGet(object, path);
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
     * `start` is specified without an `end` or `step`. If `end` is not specified,
     * it's set to `start` with `start` then set to `0`.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.rangeRight
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(-4);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    var range = createRange();

    /**
     * This method is like `_.range` except that it populates values in
     * descending order.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.range
     * @example
     *
     * _.rangeRight(4);
     * // => [3, 2, 1, 0]
     *
     * _.rangeRight(-4);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 5);
     * // => [4, 3, 2, 1]
     *
     * _.rangeRight(0, 20, 5);
     * // => [15, 10, 5, 0]
     *
     * _.rangeRight(0, -4, -1);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.rangeRight(0);
     * // => []
     */
    var rangeRight = createRange(true);

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    /**
     * This method returns a new empty object.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Object} Returns the new empty object.
     * @example
     *
     * var objects = _.times(2, _.stubObject);
     *
     * console.log(objects);
     * // => [{}, {}]
     *
     * console.log(objects[0] === objects[1]);
     * // => false
     */
    function stubObject() {
      return {};
    }

    /**
     * This method returns an empty string.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {string} Returns the empty string.
     * @example
     *
     * _.times(2, _.stubString);
     * // => ['', '']
     */
    function stubString() {
      return '';
    }

    /**
     * This method returns `true`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `true`.
     * @example
     *
     * _.times(2, _.stubTrue);
     * // => [true, true]
     */
    function stubTrue() {
      return true;
    }

    /**
     * Invokes the iteratee `n` times, returning an array of the results of
     * each invocation. The iteratee is invoked with one argument; (index).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.times(3, String);
     * // => ['0', '1', '2']
     *
     *  _.times(4, _.constant(0));
     * // => [0, 0, 0, 0]
     */
    function times(n, iteratee) {
      n = toInteger(n);
      if (n < 1 || n > MAX_SAFE_INTEGER) {
        return [];
      }
      var index = MAX_ARRAY_LENGTH,
          length = nativeMin(n, MAX_ARRAY_LENGTH);

      iteratee = getIteratee(iteratee);
      n -= MAX_ARRAY_LENGTH;

      var result = baseTimes(length, iteratee);
      while (++index < n) {
        iteratee(index);
      }
      return result;
    }

    /**
     * Converts `value` to a property path array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {*} value The value to convert.
     * @returns {Array} Returns the new property path array.
     * @example
     *
     * _.toPath('a.b.c');
     * // => ['a', 'b', 'c']
     *
     * _.toPath('a[0].b.c');
     * // => ['a', '0', 'b', 'c']
     */
    function toPath(value) {
      if (isArray(value)) {
        return arrayMap(value, toKey);
      }
      return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
    }

    /**
     * Generates a unique ID. If `prefix` is given, the ID is appended to it.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {string} [prefix=''] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return toString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {number} augend The first number in an addition.
     * @param {number} addend The second number in an addition.
     * @returns {number} Returns the total.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    var add = createMathOperation(function(augend, addend) {
      return augend + addend;
    }, 0);

    /**
     * Computes `number` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Divide two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} dividend The first number in a division.
     * @param {number} divisor The second number in a division.
     * @returns {number} Returns the quotient.
     * @example
     *
     * _.divide(6, 4);
     * // => 1.5
     */
    var divide = createMathOperation(function(dividend, divisor) {
      return dividend / divisor;
    }, 1);

    /**
     * Computes `number` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Computes the maximum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => undefined
     */
    function max(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseGt)
        : undefined;
    }

    /**
     * This method is like `_.max` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.maxBy(objects, function(o) { return o.n; });
     * // => { 'n': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.maxBy(objects, 'n');
     * // => { 'n': 2 }
     */
    function maxBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseGt)
        : undefined;
    }

    /**
     * Computes the mean of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the mean.
     * @example
     *
     * _.mean([4, 2, 8, 6]);
     * // => 5
     */
    function mean(array) {
      return baseMean(array, identity);
    }

    /**
     * This method is like `_.mean` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be averaged.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the mean.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.meanBy(objects, function(o) { return o.n; });
     * // => 5
     *
     * // The `_.property` iteratee shorthand.
     * _.meanBy(objects, 'n');
     * // => 5
     */
    function meanBy(array, iteratee) {
      return baseMean(array, getIteratee(iteratee, 2));
    }

    /**
     * Computes the minimum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => undefined
     */
    function min(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseLt)
        : undefined;
    }

    /**
     * This method is like `_.min` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.minBy(objects, function(o) { return o.n; });
     * // => { 'n': 1 }
     *
     * // The `_.property` iteratee shorthand.
     * _.minBy(objects, 'n');
     * // => { 'n': 1 }
     */
    function minBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseLt)
        : undefined;
    }

    /**
     * Multiply two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} multiplier The first number in a multiplication.
     * @param {number} multiplicand The second number in a multiplication.
     * @returns {number} Returns the product.
     * @example
     *
     * _.multiply(6, 4);
     * // => 24
     */
    var multiply = createMathOperation(function(multiplier, multiplicand) {
      return multiplier * multiplicand;
    }, 1);

    /**
     * Computes `number` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Subtract two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {number} minuend The first number in a subtraction.
     * @param {number} subtrahend The second number in a subtraction.
     * @returns {number} Returns the difference.
     * @example
     *
     * _.subtract(6, 4);
     * // => 2
     */
    var subtract = createMathOperation(function(minuend, subtrahend) {
      return minuend - subtrahend;
    }, 0);

    /**
     * Computes the sum of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 2, 8, 6]);
     * // => 20
     */
    function sum(array) {
      return (array && array.length)
        ? baseSum(array, identity)
        : 0;
    }

    /**
     * This method is like `_.sum` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be summed.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the sum.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.sumBy(objects, function(o) { return o.n; });
     * // => 20
     *
     * // The `_.property` iteratee shorthand.
     * _.sumBy(objects, 'n');
     * // => 20
     */
    function sumBy(array, iteratee) {
      return (array && array.length)
        ? baseSum(array, getIteratee(iteratee, 2))
        : 0;
    }

    /*------------------------------------------------------------------------*/

    // Add methods that return wrapped values in chain sequences.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.assignIn = assignIn;
    lodash.assignInWith = assignInWith;
    lodash.assignWith = assignWith;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.castArray = castArray;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.concat = concat;
    lodash.cond = cond;
    lodash.conforms = conforms;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.differenceBy = differenceBy;
    lodash.differenceWith = differenceWith;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatMap = flatMap;
    lodash.flatMapDeep = flatMapDeep;
    lodash.flatMapDepth = flatMapDepth;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flattenDepth = flattenDepth;
    lodash.flip = flip;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.fromPairs = fromPairs;
    lodash.functions = functions;
    lodash.functionsIn = functionsIn;
    lodash.groupBy = groupBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.intersectionBy = intersectionBy;
    lodash.intersectionWith = intersectionWith;
    lodash.invert = invert;
    lodash.invertBy = invertBy;
    lodash.invokeMap = invokeMap;
    lodash.iteratee = iteratee;
    lodash.keyBy = keyBy;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.mergeWith = mergeWith;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.negate = negate;
    lodash.nthArg = nthArg;
    lodash.omit = omit;
    lodash.omitBy = omitBy;
    lodash.once = once;
    lodash.orderBy = orderBy;
    lodash.over = over;
    lodash.overArgs = overArgs;
    lodash.overEvery = overEvery;
    lodash.overSome = overSome;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pickBy = pickBy;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAll = pullAll;
    lodash.pullAllBy = pullAllBy;
    lodash.pullAllWith = pullAllWith;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rangeRight = rangeRight;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.reverse = reverse;
    lodash.sampleSize = sampleSize;
    lodash.set = set;
    lodash.setWith = setWith;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortedUniq = sortedUniq;
    lodash.sortedUniqBy = sortedUniqBy;
    lodash.split = split;
    lodash.spread = spread;
    lodash.tail = tail;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.toArray = toArray;
    lodash.toPairs = toPairs;
    lodash.toPairsIn = toPairsIn;
    lodash.toPath = toPath;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.unary = unary;
    lodash.union = union;
    lodash.unionBy = unionBy;
    lodash.unionWith = unionWith;
    lodash.uniq = uniq;
    lodash.uniqBy = uniqBy;
    lodash.uniqWith = uniqWith;
    lodash.unset = unset;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.update = update;
    lodash.updateWith = updateWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.without = without;
    lodash.words = words;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.xorBy = xorBy;
    lodash.xorWith = xorWith;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipObjectDeep = zipObjectDeep;
    lodash.zipWith = zipWith;

    // Add aliases.
    lodash.entries = toPairs;
    lodash.entriesIn = toPairsIn;
    lodash.extend = assignIn;
    lodash.extendWith = assignInWith;

    // Add methods to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add methods that return unwrapped values in chain sequences.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clamp = clamp;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.cloneDeepWith = cloneDeepWith;
    lodash.cloneWith = cloneWith;
    lodash.conformsTo = conformsTo;
    lodash.deburr = deburr;
    lodash.defaultTo = defaultTo;
    lodash.divide = divide;
    lodash.endsWith = endsWith;
    lodash.eq = eq;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.floor = floor;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.hasIn = hasIn;
    lodash.head = head;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.invoke = invoke;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isArrayBuffer = isArrayBuffer;
    lodash.isArrayLike = isArrayLike;
    lodash.isArrayLikeObject = isArrayLikeObject;
    lodash.isBoolean = isBoolean;
    lodash.isBuffer = isBuffer;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isEqualWith = isEqualWith;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isInteger = isInteger;
    lodash.isLength = isLength;
    lodash.isMap = isMap;
    lodash.isMatch = isMatch;
    lodash.isMatchWith = isMatchWith;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNil = isNil;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isObjectLike = isObjectLike;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isSafeInteger = isSafeInteger;
    lodash.isSet = isSet;
    lodash.isString = isString;
    lodash.isSymbol = isSymbol;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.isWeakMap = isWeakMap;
    lodash.isWeakSet = isWeakSet;
    lodash.join = join;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lowerCase = lowerCase;
    lodash.lowerFirst = lowerFirst;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.maxBy = maxBy;
    lodash.mean = mean;
    lodash.meanBy = meanBy;
    lodash.min = min;
    lodash.minBy = minBy;
    lodash.stubArray = stubArray;
    lodash.stubFalse = stubFalse;
    lodash.stubObject = stubObject;
    lodash.stubString = stubString;
    lodash.stubTrue = stubTrue;
    lodash.multiply = multiply;
    lodash.nth = nth;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padEnd = padEnd;
    lodash.padStart = padStart;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.replace = replace;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.sample = sample;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedIndexBy = sortedIndexBy;
    lodash.sortedIndexOf = sortedIndexOf;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.sortedLastIndexBy = sortedLastIndexBy;
    lodash.sortedLastIndexOf = sortedLastIndexOf;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.subtract = subtract;
    lodash.sum = sum;
    lodash.sumBy = sumBy;
    lodash.template = template;
    lodash.times = times;
    lodash.toFinite = toFinite;
    lodash.toInteger = toInteger;
    lodash.toLength = toLength;
    lodash.toLower = toLower;
    lodash.toNumber = toNumber;
    lodash.toSafeInteger = toSafeInteger;
    lodash.toString = toString;
    lodash.toUpper = toUpper;
    lodash.trim = trim;
    lodash.trimEnd = trimEnd;
    lodash.trimStart = trimStart;
    lodash.truncate = truncate;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.upperCase = upperCase;
    lodash.upperFirst = upperFirst;

    // Add aliases.
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.first = head;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!hasOwnProperty.call(lodash.prototype, methodName)) {
          source[methodName] = func;
        }
      });
      return source;
    }()), { 'chain': false });

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type {string}
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        n = n === undefined ? 1 : nativeMax(toInteger(n), 0);

        var result = (this.__filtered__ && !index)
          ? new LazyWrapper(this)
          : this.clone();

        if (result.__filtered__) {
          result.__takeCount__ = nativeMin(n, result.__takeCount__);
        } else {
          result.__views__.push({
            'size': nativeMin(n, MAX_ARRAY_LENGTH),
            'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
          });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee) {
        var result = this.clone();
        result.__iteratees__.push({
          'iteratee': getIteratee(iteratee, 3),
          'type': type
        });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.head` and `_.last`.
    arrayEach(['head', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
    arrayEach(['initial', 'tail'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.find = function(predicate) {
      return this.filter(predicate).head();
    };

    LazyWrapper.prototype.findLast = function(predicate) {
      return this.reverse().find(predicate);
    };

    LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
      if (typeof path == 'function') {
        return new LazyWrapper(this);
      }
      return this.map(function(value) {
        return baseInvoke(value, path, args);
      });
    });

    LazyWrapper.prototype.reject = function(predicate) {
      return this.filter(negate(getIteratee(predicate)));
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = toInteger(start);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = toInteger(end);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate) {
      return this.reverse().takeWhile(predicate).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(MAX_ARRAY_LENGTH);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
          isTaker = /^(?:head|last)$/.test(methodName),
          lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
          retUnwrapped = isTaker || /^find/.test(methodName);

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var value = this.__wrapped__,
            args = isTaker ? [1] : arguments,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        var interceptor = function(value) {
          var result = lodashFunc.apply(lodash, arrayPush([value], args));
          return (isTaker && chainAll) ? result[0] : result;
        };

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var chainAll = this.__chain__,
            isHybrid = !!this.__actions__.length,
            isUnwrapped = retUnwrapped && !chainAll,
            onlyLazy = isLazy && !isHybrid;

        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
          return new LodashWrapper(result, chainAll);
        }
        if (isUnwrapped && onlyLazy) {
          return func.apply(this, args);
        }
        result = this.thru(interceptor);
        return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
      };
    });

    // Add `Array` methods to `lodash.prototype`.
    arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
      var func = arrayProto[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:pop|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          var value = this.value();
          return func.apply(isArray(value) ? value : [], args);
        }
        return this[chainName](function(value) {
          return func.apply(isArray(value) ? value : [], args);
        });
      };
    });

    // Map minified method names to their real names.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = lodashFunc.name + '';
        if (!hasOwnProperty.call(realNames, key)) {
          realNames[key] = [];
        }
        realNames[key].push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybrid(undefined, WRAP_BIND_KEY_FLAG).name] = [{
      'name': 'wrapper',
      'func': undefined
    }];

    // Add methods to `LazyWrapper`.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chain sequence methods to the `lodash` wrapper.
    lodash.prototype.at = wrapperAt;
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.next = wrapperNext;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    // Add lazy aliases.
    lodash.prototype.first = lodash.prototype.head;

    if (symIterator) {
      lodash.prototype[symIterator] = wrapperToIterator;
    }
    return lodash;
  });

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Some AMD build optimizers, like r.js, check for condition patterns like:
  if (true) {
    // Expose Lodash on the global object to prevent errors when Lodash is
    // loaded by a script tag in the presence of an AMD loader.
    // See http://requirejs.org/docs/errors.html#mismatch for more details.
    // Use `_.noConflict` to remove Lodash from the global object.
    root._ = _;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return _;
    }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
  // Check for `exports` after `define` in case a build optimizer adds it.
  else // removed by dead control flow
{}
}.call(this));


/***/ }),

/***/ 2552:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(1873),
    getRawTag = __webpack_require__(659),
    objectToString = __webpack_require__(9350);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ 2651:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isKeyable = __webpack_require__(4218);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),

/***/ 2749:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(1042);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),

/***/ 2804:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(6110),
    root = __webpack_require__(9325);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),

/***/ 2865:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseSetToString = __webpack_require__(9570),
    shortOut = __webpack_require__(1811);

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ }),

/***/ 2903:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(3805),
    isPrototype = __webpack_require__(5527),
    nativeKeysIn = __webpack_require__(181);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;


/***/ }),

/***/ 2949:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(2651);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),

/***/ 3007:
/***/ ((module) => {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),

/***/ 3040:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Hash = __webpack_require__(1549),
    ListCache = __webpack_require__(79),
    Map = __webpack_require__(8223);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),

/***/ 3120:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(4528),
    isFlattenable = __webpack_require__(5891);

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;


/***/ }),

/***/ 3138:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isPlainObject = __webpack_require__(1331);

/**
 * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
 * objects.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {string} key The key of the property to inspect.
 * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
 */
function customOmitClone(value) {
  return isPlainObject(value) ? undefined : value;
}

module.exports = customOmitClone;


/***/ }),

/***/ 3199:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(6110),
    root = __webpack_require__(9325);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),

/***/ 3201:
/***/ ((module) => {

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;


/***/ }),

/***/ 3222:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseToString = __webpack_require__(7556);

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),

/***/ 3243:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(6110);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),

/***/ 3290:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(9325);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;


/***/ }),

/***/ 3345:
/***/ ((module) => {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),

/***/ 3349:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetAllKeys = __webpack_require__(2199),
    getSymbolsIn = __webpack_require__(6375),
    keysIn = __webpack_require__(7241);

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;


/***/ }),

/***/ 3360:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defineProperty = __webpack_require__(3243);

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),

/***/ 3488:
/***/ ((module) => {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),

/***/ 3605:
/***/ ((module) => {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),

/***/ 3650:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(4335);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),

/***/ 3656:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(9325),
    stubFalse = __webpack_require__(9935);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;


/***/ }),

/***/ 3661:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var mapCacheClear = __webpack_require__(3040),
    mapCacheDelete = __webpack_require__(7670),
    mapCacheGet = __webpack_require__(289),
    mapCacheHas = __webpack_require__(4509),
    mapCacheSet = __webpack_require__(2949);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),

/***/ 3702:
/***/ ((module) => {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),

/***/ 3729:
/***/ ((module) => {

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;


/***/ }),

/***/ 3736:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(1873);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;


/***/ }),

/***/ 3805:
/***/ ((module) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ 3838:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(1791),
    keysIn = __webpack_require__(7241);

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;


/***/ }),

/***/ 3862:
/***/ ((module) => {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),

/***/ 3904:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ANY = Symbol('SemVer ANY')
// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return ANY
  }

  constructor (comp, options) {
    options = parseOptions(options)

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }

    comp = comp.trim().split(/\s+/).join(' ')
    debug('comparator', comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)

    if (this.semver === ANY) {
      this.value = ''
    } else {
      this.value = this.operator + this.semver.version
    }

    debug('comp', this)
  }

  parse (comp) {
    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    const m = comp.match(r)

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : ''
    if (this.operator === '=') {
      this.operator = ''
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug('Comparator.test', version, this.options.loose)

    if (this.semver === ANY || version === ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    return cmp(version, this.operator, this.semver, this.options)
  }

  intersects (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new Range(comp.value, options).test(this.value)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new Range(this.value, options).test(comp.semver)
    }

    options = parseOptions(options)

    // Special cases where nothing can possibly be lower
    if (options.includePrerelease &&
      (this.value === '<0.0.0-0' || comp.value === '<0.0.0-0')) {
      return false
    }
    if (!options.includePrerelease &&
      (this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0'))) {
      return false
    }

    // Same direction increasing (> or >=)
    if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
      return true
    }
    // Same direction decreasing (< or <=)
    if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
      return true
    }
    // same SemVer and both sides are inclusive (<= or >=)
    if (
      (this.semver.version === comp.semver.version) &&
      this.operator.includes('=') && comp.operator.includes('=')) {
      return true
    }
    // opposite directions less than
    if (cmp(this.semver, '<', comp.semver, options) &&
      this.operator.startsWith('>') && comp.operator.startsWith('<')) {
      return true
    }
    // opposite directions greater than
    if (cmp(this.semver, '>', comp.semver, options) &&
      this.operator.startsWith('<') && comp.operator.startsWith('>')) {
      return true
    }
    return false
  }
}

module.exports = Comparator

const parseOptions = __webpack_require__(8587)
const { safeRe: re, t } = __webpack_require__(9718)
const cmp = __webpack_require__(2111)
const debug = __webpack_require__(7272)
const SemVer = __webpack_require__(3908)
const Range = __webpack_require__(8311)


/***/ }),

/***/ 3908:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const debug = __webpack_require__(7272)
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __webpack_require__(6874)
const { safeRe: re, t } = __webpack_require__(9718)

const parseOptions = __webpack_require__(8587)
const { compareIdentifiers } = __webpack_require__(1123)
class SemVer {
  constructor (version, options) {
    options = parseOptions(options)

    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
          version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`)
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      )
    }

    debug('SemVer', version, options)
    this.options = options
    this.loose = !!options.loose
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease

    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version

    // these are actually numbers
    this.major = +m[1]
    this.minor = +m[2]
    this.patch = +m[3]

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = []
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      })
    }

    this.build = m[5] ? m[5].split('.') : []
    this.format()
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug('SemVer.compare', this.version, this.options, other)
    if (!(other instanceof SemVer)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer(other, this.options)
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    )
  }

  comparePre (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0
    do {
      const a = this.prerelease[i]
      const b = other.prerelease[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    let i = 0
    do {
      const a = this.build[i]
      const b = other.build[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier, identifierBase) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor = 0
        this.major++
        this.inc('pre', identifier, identifierBase)
        break
      case 'preminor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor++
        this.inc('pre', identifier, identifierBase)
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0
        this.inc('patch', identifier, identifierBase)
        this.inc('pre', identifier, identifierBase)
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier, identifierBase)
        }
        this.inc('pre', identifier, identifierBase)
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++
        }
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++
        }
        this.patch = 0
        this.prerelease = []
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++
        }
        this.prerelease = []
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre': {
        const base = Number(identifierBase) ? 1 : 0

        if (!identifier && identifierBase === false) {
          throw new Error('invalid increment argument: identifier is empty')
        }

        if (this.prerelease.length === 0) {
          this.prerelease = [base]
        } else {
          let i = this.prerelease.length
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++
              i = -2
            }
          }
          if (i === -1) {
            // didn't increment anything
            if (identifier === this.prerelease.join('.') && identifierBase === false) {
              throw new Error('invalid increment argument: identifier already exists')
            }
            this.prerelease.push(base)
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          let prerelease = [identifier, base]
          if (identifierBase === false) {
            prerelease = [identifier]
          }
          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = prerelease
            }
          } else {
            this.prerelease = prerelease
          }
        }
        break
      }
      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.raw = this.format()
    if (this.build.length) {
      this.raw += `+${this.build.join('.')}`
    }
    return this
  }
}

module.exports = SemVer


/***/ }),

/***/ 3999:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(560)
const neq = (a, b, loose) => compare(a, b, loose) !== 0
module.exports = neq


/***/ }),

/***/ 4089:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(560)
const gte = (a, b, loose) => compare(a, b, loose) >= 0
module.exports = gte


/***/ }),

/***/ 4218:
/***/ ((module) => {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),

/***/ 4335:
/***/ ((module) => {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),

/***/ 4394:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(2552),
    isObjectLike = __webpack_require__(346);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),

/***/ 4509:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(2651);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),

/***/ 4528:
/***/ ((module) => {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),

/***/ 4641:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(560)
const eq = (a, b, loose) => compare(a, b, loose) === 0
module.exports = eq


/***/ }),

/***/ 4664:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayFilter = __webpack_require__(9770),
    stubArray = __webpack_require__(3345);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),

/***/ 4733:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(1791),
    keys = __webpack_require__(5950);

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;


/***/ }),

/***/ 4739:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(6025);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),

/***/ 4840:
/***/ ((module) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;


/***/ }),

/***/ 4894:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(1882),
    isLength = __webpack_require__(294);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),

/***/ 4901:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(2552),
    isLength = __webpack_require__(294),
    isObjectLike = __webpack_require__(346);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),

/***/ 4932:
/***/ ((module) => {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),

/***/ 5083:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(1882),
    isMasked = __webpack_require__(7296),
    isObject = __webpack_require__(3805),
    toSource = __webpack_require__(7473);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),

/***/ 5160:
/***/ ((module) => {

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;


/***/ }),

/***/ 5200:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(560)
const lte = (a, b, loose) => compare(a, b, loose) <= 0
module.exports = lte


/***/ }),

/***/ 5288:
/***/ ((module) => {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),

/***/ 5481:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(9325);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ 5527:
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),

/***/ 5529:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseCreate = __webpack_require__(9344),
    getPrototype = __webpack_require__(8879),
    isPrototype = __webpack_require__(5527);

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


/***/ }),

/***/ 5580:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(560)
const gt = (a, b, loose) => compare(a, b, loose) > 0
module.exports = gt


/***/ }),

/***/ 5749:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(1042);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),

/***/ 5861:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DataView = __webpack_require__(3199),
    Map = __webpack_require__(8223),
    Promise = __webpack_require__(2804),
    Set = __webpack_require__(6545),
    WeakMap = __webpack_require__(8303),
    baseGetTag = __webpack_require__(2552),
    toSource = __webpack_require__(7473);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),

/***/ 5891:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(1873),
    isArguments = __webpack_require__(2428),
    isArray = __webpack_require__(6449);

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;


/***/ }),

/***/ 5950:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(695),
    baseKeys = __webpack_require__(8984),
    isArrayLike = __webpack_require__(4894);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),

/***/ 5970:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseFlatten = __webpack_require__(3120);

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;


/***/ }),

/***/ 6009:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var freeGlobal = __webpack_require__(4840);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;


/***/ }),

/***/ 6025:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var eq = __webpack_require__(5288);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),

/***/ 6038:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getTag = __webpack_require__(5861),
    isObjectLike = __webpack_require__(346);

/** `Object#toString` result references. */
var setTag = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}

module.exports = baseIsSet;


/***/ }),

/***/ 6110:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsNative = __webpack_require__(5083),
    getValue = __webpack_require__(392);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),

/***/ 6169:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(9653);

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;


/***/ }),

/***/ 6170:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const SemVer = __webpack_require__(3908)
const parse = __webpack_require__(144)
const { safeRe: re, t } = __webpack_require__(9718)

const coerce = (version, options) => {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  let match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    let next
    while ((next = re[t.COERCERTL].exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
            next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null) {
    return null
  }

  return parse(`${match[2]}.${match[3] || '0'}.${match[4] || '0'}`, options)
}
module.exports = coerce


/***/ }),

/***/ 6189:
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;


/***/ }),

/***/ 6375:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(4528),
    getPrototype = __webpack_require__(8879),
    getSymbols = __webpack_require__(4664),
    stubArray = __webpack_require__(3345);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;


/***/ }),

/***/ 6449:
/***/ ((module) => {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),

/***/ 6545:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(6110),
    root = __webpack_require__(9325);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),

/***/ 6547:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseAssignValue = __webpack_require__(3360),
    eq = __webpack_require__(5288);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),

/***/ 6721:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(1042);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),

/***/ 6757:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var apply = __webpack_require__(1033);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ }),

/***/ 6874:
/***/ ((module) => {

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0'

const MAX_LENGTH = 256
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
/* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16

// Max safe length for a build identifier. The max length minus 6 characters for
// the shortest version with a build 0.0.0+BUILD.
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6

const RELEASE_TYPES = [
  'major',
  'premajor',
  'minor',
  'preminor',
  'patch',
  'prepatch',
  'prerelease',
]

module.exports = {
  MAX_LENGTH,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER,
  RELEASE_TYPES,
  SEMVER_SPEC_VERSION,
  FLAG_INCLUDE_PRERELEASE: 0b001,
  FLAG_LOOSE: 0b010,
}


/***/ }),

/***/ 7059:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const compare = __webpack_require__(560)
const lt = (a, b, loose) => compare(a, b, loose) < 0
module.exports = lt


/***/ }),

/***/ 7167:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsTypedArray = __webpack_require__(4901),
    baseUnary = __webpack_require__(7301),
    nodeUtil = __webpack_require__(6009);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),

/***/ 7199:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(9653),
    cloneDataView = __webpack_require__(6169),
    cloneRegExp = __webpack_require__(3201),
    cloneSymbol = __webpack_require__(3736),
    cloneTypedArray = __webpack_require__(1961);

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return new Ctor;

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return new Ctor;

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;


/***/ }),

/***/ 7217:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(79),
    stackClear = __webpack_require__(1420),
    stackDelete = __webpack_require__(938),
    stackGet = __webpack_require__(3605),
    stackHas = __webpack_require__(9817),
    stackSet = __webpack_require__(945);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),

/***/ 7241:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(695),
    baseKeysIn = __webpack_require__(2903),
    isArrayLike = __webpack_require__(4894);

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;


/***/ }),

/***/ 7272:
/***/ ((module) => {

const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {}

module.exports = debug


/***/ }),

/***/ 7296:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var coreJsData = __webpack_require__(5481);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),

/***/ 7301:
/***/ ((module) => {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),

/***/ 7334:
/***/ ((module) => {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ }),

/***/ 7422:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var castPath = __webpack_require__(1769),
    toKey = __webpack_require__(7797);

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;


/***/ }),

/***/ 7473:
/***/ ((module) => {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),

/***/ 7534:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(2552),
    isObjectLike = __webpack_require__(346);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),

/***/ 7556:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(1873),
    arrayMap = __webpack_require__(4932),
    isArray = __webpack_require__(6449),
    isSymbol = __webpack_require__(4394);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),

/***/ 7638:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Range = __webpack_require__(8311)
const satisfies = (version, range, options) => {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}
module.exports = satisfies


/***/ }),

/***/ 7670:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(2651);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),

/***/ 7730:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsMap = __webpack_require__(9172),
    baseUnary = __webpack_require__(7301),
    nodeUtil = __webpack_require__(6009);

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

module.exports = isMap;


/***/ }),

/***/ 7797:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isSymbol = __webpack_require__(4394);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;


/***/ }),

/***/ 7828:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(9325);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),

/***/ 8090:
/***/ ((module) => {

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

module.exports = last;


/***/ }),

/***/ 8096:
/***/ ((module) => {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),

/***/ 8223:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(6110),
    root = __webpack_require__(9325);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ 8303:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(6110),
    root = __webpack_require__(9325);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),

/***/ 8311:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// hoisted class for cyclic dependency
class Range {
  constructor (range, options) {
    options = parseOptions(options)

    if (range instanceof Range) {
      if (
        range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease
      ) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }

    if (range instanceof Comparator) {
      // just put it in the set and return
      this.raw = range.value
      this.set = [[range]]
      this.format()
      return this
    }

    this.options = options
    this.loose = !!options.loose
    this.includePrerelease = !!options.includePrerelease

    // First reduce all whitespace as much as possible so we do not have to rely
    // on potentially slow regexes like \s*. This is then stored and used for
    // future error messages as well.
    this.raw = range
      .trim()
      .split(/\s+/)
      .join(' ')

    // First, split on ||
    this.set = this.raw
      .split('||')
      // map the range to a 2d array of comparators
      .map(r => this.parseRange(r.trim()))
      // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(c => c.length)

    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${this.raw}`)
    }

    // if we have any that are not the null set, throw out null sets.
    if (this.set.length > 1) {
      // keep the first one, in case they're all null sets
      const first = this.set[0]
      this.set = this.set.filter(c => !isNullSet(c[0]))
      if (this.set.length === 0) {
        this.set = [first]
      } else if (this.set.length > 1) {
        // if we have any that are *, then the range is just *
        for (const c of this.set) {
          if (c.length === 1 && isAny(c[0])) {
            this.set = [c]
            break
          }
        }
      }
    }

    this.format()
  }

  format () {
    this.range = this.set
      .map((comps) => comps.join(' ').trim())
      .join('||')
      .trim()
    return this.range
  }

  toString () {
    return this.range
  }

  parseRange (range) {
    // memoize range parsing for performance.
    // this is a very hot path, and fully deterministic.
    const memoOpts =
      (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) |
      (this.options.loose && FLAG_LOOSE)
    const memoKey = memoOpts + ':' + range
    const cached = cache.get(memoKey)
    if (cached) {
      return cached
    }

    const loose = this.options.loose
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease))
    debug('hyphen replace', range)

    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
    debug('comparator trim', range)

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[t.TILDETRIM], tildeTrimReplace)
    debug('tilde trim', range)

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[t.CARETTRIM], caretTrimReplace)
    debug('caret trim', range)

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    let rangeList = range
      .split(' ')
      .map(comp => parseComparator(comp, this.options))
      .join(' ')
      .split(/\s+/)
      // >=0.0.0 is equivalent to *
      .map(comp => replaceGTE0(comp, this.options))

    if (loose) {
      // in loose mode, throw out any that are not valid comparators
      rangeList = rangeList.filter(comp => {
        debug('loose invalid filter', comp, this.options)
        return !!comp.match(re[t.COMPARATORLOOSE])
      })
    }
    debug('range list', rangeList)

    // if any comparators are the null set, then replace with JUST null set
    // if more than one comparator, remove any * comparators
    // also, don't include the same comparator more than once
    const rangeMap = new Map()
    const comparators = rangeList.map(comp => new Comparator(comp, this.options))
    for (const comp of comparators) {
      if (isNullSet(comp)) {
        return [comp]
      }
      rangeMap.set(comp.value, comp)
    }
    if (rangeMap.size > 1 && rangeMap.has('')) {
      rangeMap.delete('')
    }

    const result = [...rangeMap.values()]
    cache.set(memoKey, result)
    return result
  }

  intersects (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }

    return this.set.some((thisComparators) => {
      return (
        isSatisfiable(thisComparators, options) &&
        range.set.some((rangeComparators) => {
          return (
            isSatisfiable(rangeComparators, options) &&
            thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options)
              })
            })
          )
        })
      )
    })
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test (version) {
    if (!version) {
      return false
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  }
}

module.exports = Range

const LRU = __webpack_require__(9749)
const cache = new LRU({ max: 1000 })

const parseOptions = __webpack_require__(8587)
const Comparator = __webpack_require__(3904)
const debug = __webpack_require__(7272)
const SemVer = __webpack_require__(3908)
const {
  safeRe: re,
  t,
  comparatorTrimReplace,
  tildeTrimReplace,
  caretTrimReplace,
} = __webpack_require__(9718)
const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = __webpack_require__(6874)

const isNullSet = c => c.value === '<0.0.0-0'
const isAny = c => c.value === ''

// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options) => {
  let result = true
  const remainingComparators = comparators.slice()
  let testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every((otherComparator) => {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options) => {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

const isX = id => !id || id.toLowerCase() === 'x' || id === '*'

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
const replaceTildes = (comp, options) => {
  return comp
    .trim()
    .split(/\s+/)
    .map((c) => replaceTilde(c, options))
    .join(' ')
}

const replaceTilde = (comp, options) => {
  const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('tilde', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0-0
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0-0
      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
const replaceCarets = (comp, options) => {
  return comp
    .trim()
    .split(/\s+/)
    .map((c) => replaceCaret(c, options))
    .join(' ')
}

const replaceCaret = (comp, options) => {
  debug('caret', comp, options)
  const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  const z = options.includePrerelease ? '-0' : ''
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('caret', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      if (M === '0') {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`
      }
    }

    debug('caret return', ret)
    return ret
  })
}

const replaceXRanges = (comp, options) => {
  debug('replaceXRanges', comp, options)
  return comp
    .split(/\s+/)
    .map((c) => replaceXRange(c, options))
    .join(' ')
}

const replaceXRange = (comp, options) => {
  comp = comp.trim()
  const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    const xM = isX(M)
    const xm = xM || isX(m)
    const xp = xm || isX(p)
    const anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      if (gtlt === '<') {
        pr = '-0'
      }

      ret = `${gtlt + M}.${m}.${p}${pr}`
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options) => {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp
    .trim()
    .replace(re[t.STAR], '')
}

const replaceGTE0 = (comp, options) => {
  debug('replaceGTE0', comp, options)
  return comp
    .trim()
    .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) => {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? '-0' : ''}`
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`
  } else if (fpr) {
    from = `>=${from}`
  } else {
    from = `>=${from}${incPr ? '-0' : ''}`
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`
  } else {
    to = `<=${to}`
  }

  return `${from} ${to}`.trim()
}

const testSet = (set, version, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (let i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === Comparator.ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}


/***/ }),

/***/ 8440:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsSet = __webpack_require__(6038),
    baseUnary = __webpack_require__(7301),
    nodeUtil = __webpack_require__(6009);

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

module.exports = isSet;


/***/ }),

/***/ 8586:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArray = __webpack_require__(6449),
    isSymbol = __webpack_require__(4394);

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ }),

/***/ 8587:
/***/ ((module) => {

// parse out just the options we care about
const looseOption = Object.freeze({ loose: true })
const emptyOpts = Object.freeze({ })
const parseOptions = options => {
  if (!options) {
    return emptyOpts
  }

  if (typeof options !== 'object') {
    return looseOption
  }

  return options
}
module.exports = parseOptions


/***/ }),

/***/ 8655:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(6025);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),

/***/ 8799:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist (list) {
  var self = this
  if (!(self instanceof Yallist)) {
    self = new Yallist()
  }

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item)
    })
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i])
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next
  var prev = node.prev

  if (next) {
    next.prev = prev
  }

  if (prev) {
    prev.next = next
  }

  if (node === this.head) {
    this.head = next
  }
  if (node === this.tail) {
    this.tail = prev
  }

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null

  return next
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var head = this.head
  node.list = this
  node.next = head
  if (head) {
    head.prev = node
  }

  this.head = node
  if (!this.tail) {
    this.tail = node
  }
  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) {
    tail.next = node
  }

  this.tail = node
  if (!this.head) {
    this.head = node
  }
  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value
  this.tail = this.tail.prev
  if (this.tail) {
    this.tail.next = null
  } else {
    this.head = null
  }
  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value
  this.head = this.head.next
  if (this.head) {
    this.head.prev = null
  } else {
    this.tail = null
  }
  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc
  var walker = this.head
  if (arguments.length > 1) {
    acc = initial
  } else if (this.head) {
    walker = this.head.next
    acc = this.head.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc
  var walker = this.tail
  if (arguments.length > 1) {
    acc = initial
  } else if (this.tail) {
    walker = this.tail.prev
    acc = this.tail.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next
  }

  var ret = []
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value)
    walker = this.removeNode(walker)
  }
  if (walker === null) {
    walker = this.tail
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i])
  }
  return ret;
}

Yallist.prototype.reverse = function () {
  var head = this.head
  var tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self)

  if (inserted.next === null) {
    self.tail = inserted
  }
  if (inserted.prev === null) {
    self.head = inserted
  }

  self.length++

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else {
    this.prev = null
  }

  if (next) {
    next.prev = this
    this.next = next
  } else {
    this.next = null
  }
}

try {
  // add if support for Symbol.iterator is present
  __webpack_require__(259)(Yallist)
} catch (er) {}


/***/ }),

/***/ 8816:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var flatten = __webpack_require__(5970),
    overRest = __webpack_require__(6757),
    setToString = __webpack_require__(2865);

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

module.exports = flatRest;


/***/ }),

/***/ 8879:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(4335);

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),

/***/ 8948:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(1791),
    getSymbolsIn = __webpack_require__(6375);

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;


/***/ }),

/***/ 8969:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGet = __webpack_require__(7422),
    baseSlice = __webpack_require__(5160);

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}

module.exports = parent;


/***/ }),

/***/ 8984:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isPrototype = __webpack_require__(5527),
    nativeKeys = __webpack_require__(3650);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),

/***/ 9172:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getTag = __webpack_require__(5861),
    isObjectLike = __webpack_require__(346);

/** `Object#toString` result references. */
var mapTag = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

module.exports = baseIsMap;


/***/ }),

/***/ 9325:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(4840);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ 9344:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(3805);

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),

/***/ 9350:
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ 9570:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var constant = __webpack_require__(7334),
    defineProperty = __webpack_require__(3243),
    identity = __webpack_require__(3488);

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ }),

/***/ 9653:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Uint8Array = __webpack_require__(7828);

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;


/***/ }),

/***/ 9718:
/***/ ((module, exports, __webpack_require__) => {

const {
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_LENGTH,
} = __webpack_require__(6874)
const debug = __webpack_require__(7272)
exports = module.exports = {}

// The actual regexps go on exports.re
const re = exports.re = []
const safeRe = exports.safeRe = []
const src = exports.src = []
const t = exports.t = {}
let R = 0

const LETTERDASHNUMBER = '[a-zA-Z0-9-]'

// Replace some greedy regex tokens to prevent regex dos issues. These regex are
// used internally via the safeRe object since all inputs in this library get
// normalized first to trim and collapse all extra whitespace. The original
// regexes are exported for userland consumption and lower level usage. A
// future breaking change could export the safer regex only with a note that
// all input should have extra whitespace removed.
const safeRegexReplacements = [
  ['\\s', 1],
  ['\\d', MAX_LENGTH],
  [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH],
]

const makeSafeRegex = (value) => {
  for (const [token, max] of safeRegexReplacements) {
    value = value
      .split(`${token}*`).join(`${token}{0,${max}}`)
      .split(`${token}+`).join(`${token}{1,${max}}`)
  }
  return value
}

const createToken = (name, value, isGlobal) => {
  const safe = makeSafeRegex(value)
  const index = R++
  debug(name, index, value)
  t[name] = index
  src[index] = value
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined)
  safeRe[index] = new RegExp(safe, isGlobal ? 'g' : undefined)
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*')
createToken('NUMERICIDENTIFIERLOOSE', '\\d+')

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`)

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`)

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`)

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`)

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`)

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`)

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`)

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', `${LETTERDASHNUMBER}+`)

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`)

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`)

createToken('FULL', `^${src[t.FULLPLAIN]}$`)

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`)

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`)

createToken('GTLT', '((?:<|>)?=?)')

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`)
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`)

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`)

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`)

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`)
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`)

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCE', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:$|[^\\d])`)
createToken('COERCERTL', src[t.COERCE], true)

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)')

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true)
exports.tildeTrimReplace = '$1~'

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`)
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`)

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)')

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true)
exports.caretTrimReplace = '$1^'

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`)
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`)

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`)
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`)

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true)
exports.comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`)

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`)

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*')
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$')
createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$')


/***/ }),

/***/ 9749:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// A linked list to keep track of recently-used-ness
const Yallist = __webpack_require__(8799)

const MAX = Symbol('max')
const LENGTH = Symbol('length')
const LENGTH_CALCULATOR = Symbol('lengthCalculator')
const ALLOW_STALE = Symbol('allowStale')
const MAX_AGE = Symbol('maxAge')
const DISPOSE = Symbol('dispose')
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet')
const LRU_LIST = Symbol('lruList')
const CACHE = Symbol('cache')
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet')

const naiveLength = () => 1

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
  constructor (options) {
    if (typeof options === 'number')
      options = { max: options }

    if (!options)
      options = {}

    if (options.max && (typeof options.max !== 'number' || options.max < 0))
      throw new TypeError('max must be a non-negative number')
    // Kind of weird to have a default max of Infinity, but oh well.
    const max = this[MAX] = options.max || Infinity

    const lc = options.length || naiveLength
    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc
    this[ALLOW_STALE] = options.stale || false
    if (options.maxAge && typeof options.maxAge !== 'number')
      throw new TypeError('maxAge must be a number')
    this[MAX_AGE] = options.maxAge || 0
    this[DISPOSE] = options.dispose
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false
    this.reset()
  }

  // resize the cache when the max changes.
  set max (mL) {
    if (typeof mL !== 'number' || mL < 0)
      throw new TypeError('max must be a non-negative number')

    this[MAX] = mL || Infinity
    trim(this)
  }
  get max () {
    return this[MAX]
  }

  set allowStale (allowStale) {
    this[ALLOW_STALE] = !!allowStale
  }
  get allowStale () {
    return this[ALLOW_STALE]
  }

  set maxAge (mA) {
    if (typeof mA !== 'number')
      throw new TypeError('maxAge must be a non-negative number')

    this[MAX_AGE] = mA
    trim(this)
  }
  get maxAge () {
    return this[MAX_AGE]
  }

  // resize the cache when the lengthCalculator changes.
  set lengthCalculator (lC) {
    if (typeof lC !== 'function')
      lC = naiveLength

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC
      this[LENGTH] = 0
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
        this[LENGTH] += hit.length
      })
    }
    trim(this)
  }
  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  get length () { return this[LENGTH] }
  get itemCount () { return this[LRU_LIST].length }

  rforEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev
      forEachStep(this, fn, walker, thisp)
      walker = prev
    }
  }

  forEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next
      forEachStep(this, fn, walker, thisp)
      walker = next
    }
  }

  keys () {
    return this[LRU_LIST].toArray().map(k => k.key)
  }

  values () {
    return this[LRU_LIST].toArray().map(k => k.value)
  }

  reset () {
    if (this[DISPOSE] &&
        this[LRU_LIST] &&
        this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value))
    }

    this[CACHE] = new Map() // hash of items by key
    this[LRU_LIST] = new Yallist() // list of items in order of use recency
    this[LENGTH] = 0 // length of items in the list
  }

  dump () {
    return this[LRU_LIST].map(hit =>
      isStale(this, hit) ? false : {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter(h => h)
  }

  dumpLru () {
    return this[LRU_LIST]
  }

  set (key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE]

    if (maxAge && typeof maxAge !== 'number')
      throw new TypeError('maxAge must be a number')

    const now = maxAge ? Date.now() : 0
    const len = this[LENGTH_CALCULATOR](value, key)

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key))
        return false
      }

      const node = this[CACHE].get(key)
      const item = node.value

      // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking
      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET])
          this[DISPOSE](key, item.value)
      }

      item.now = now
      item.maxAge = maxAge
      item.value = value
      this[LENGTH] += len - item.length
      item.length = len
      this.get(key)
      trim(this)
      return true
    }

    const hit = new Entry(key, value, len, now, maxAge)

    // oversized objects fall out of cache automatically.
    if (hit.length > this[MAX]) {
      if (this[DISPOSE])
        this[DISPOSE](key, value)

      return false
    }

    this[LENGTH] += hit.length
    this[LRU_LIST].unshift(hit)
    this[CACHE].set(key, this[LRU_LIST].head)
    trim(this)
    return true
  }

  has (key) {
    if (!this[CACHE].has(key)) return false
    const hit = this[CACHE].get(key).value
    return !isStale(this, hit)
  }

  get (key) {
    return get(this, key, true)
  }

  peek (key) {
    return get(this, key, false)
  }

  pop () {
    const node = this[LRU_LIST].tail
    if (!node)
      return null

    del(this, node)
    return node.value
  }

  del (key) {
    del(this, this[CACHE].get(key))
  }

  load (arr) {
    // reset the cache
    this.reset()

    const now = Date.now()
    // A previous serialized cache has the most recent items first
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l]
      const expiresAt = hit.e || 0
      if (expiresAt === 0)
        // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v)
      else {
        const maxAge = expiresAt - now
        // dont add already expired items
        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge)
        }
      }
    }
  }

  prune () {
    this[CACHE].forEach((value, key) => get(this, key, false))
  }
}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key)
  if (node) {
    const hit = node.value
    if (isStale(self, hit)) {
      del(self, node)
      if (!self[ALLOW_STALE])
        return undefined
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET])
          node.value.now = Date.now()
        self[LRU_LIST].unshiftNode(node)
      }
    }
    return hit.value
  }
}

const isStale = (self, hit) => {
  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
    return false

  const diff = Date.now() - hit.now
  return hit.maxAge ? diff > hit.maxAge
    : self[MAX_AGE] && (diff > self[MAX_AGE])
}

const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail;
      self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev
      del(self, walker)
      walker = prev
    }
  }
}

const del = (self, node) => {
  if (node) {
    const hit = node.value
    if (self[DISPOSE])
      self[DISPOSE](hit.key, hit.value)

    self[LENGTH] -= hit.length
    self[CACHE].delete(hit.key)
    self[LRU_LIST].removeNode(node)
  }
}

class Entry {
  constructor (key, value, length, now, maxAge) {
    this.key = key
    this.value = value
    this.length = length
    this.now = now
    this.maxAge = maxAge || 0
  }
}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    if (!self[ALLOW_STALE])
      hit = undefined
  }
  if (hit)
    fn.call(thisp, hit.value, hit.key, self)
}

module.exports = LRUCache


/***/ }),

/***/ 9770:
/***/ ((module) => {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),

/***/ 9817:
/***/ ((module) => {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),

/***/ 9896:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 9931:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var castPath = __webpack_require__(1769),
    last = __webpack_require__(8090),
    parent = __webpack_require__(8969),
    toKey = __webpack_require__(7797);

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = castPath(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey(last(path))];
}

module.exports = baseUnset;


/***/ }),

/***/ 9935:
/***/ ((module) => {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),

/***/ 9999:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stack = __webpack_require__(7217),
    arrayEach = __webpack_require__(3729),
    assignValue = __webpack_require__(6547),
    baseAssign = __webpack_require__(4733),
    baseAssignIn = __webpack_require__(3838),
    cloneBuffer = __webpack_require__(3290),
    copyArray = __webpack_require__(3007),
    copySymbols = __webpack_require__(2271),
    copySymbolsIn = __webpack_require__(8948),
    getAllKeys = __webpack_require__(2),
    getAllKeysIn = __webpack_require__(3349),
    getTag = __webpack_require__(5861),
    initCloneArray = __webpack_require__(6189),
    initCloneByTag = __webpack_require__(7199),
    initCloneObject = __webpack_require__(5529),
    isArray = __webpack_require__(6449),
    isBuffer = __webpack_require__(3656),
    isMap = __webpack_require__(7730),
    isObject = __webpack_require__(3805),
    isSet = __webpack_require__(8440),
    keys = __webpack_require__(5950),
    keysIn = __webpack_require__(7241);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
Plugin.register('azurelib_utils', {
    title: 'AzureLib Animator',
    author: 'AzureDoom, Eliot Lash, Gecko, McHorse',
    icon: 'azureicon.png',
    description: 'Create models, textures, and animations for AzureLib-powered mods using Bedrock-style tools.',
    tags: ['Minecraft: Java Edition'],
    version: '2.3.0',
    variant: 'both',
    min_version: '4.8.0',
    website: 'https://wiki.azuredoom.com/',
    await_loading: true,
    creation_date: '2023-04-04',
    new_repository_format: true,
    contributes: {
      formats: ['azure_model']
    },
    has_changelog: true,
  
    onload() {
      const { loadAzureLib } = __webpack_require__(814);
      loadAzureLib();
    },
  
    onunload() {
      const { unloadAzureLib } = __webpack_require__(814);
      unloadAzureLib();
    }
  });
/******/ })()
;