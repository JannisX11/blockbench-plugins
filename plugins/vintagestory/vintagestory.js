(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name2 in all)
      __defProp(target, name2, { get: all[name2], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/util/native.ts
  function load_fs() {
    if (!fs_module && !fs_denied) {
      fs_module = requireNativeModule("fs");
      fs_denied = !fs_module;
    }
    if (!fs_module) throw new Error("File system access was denied. Reload the plugin to grant it.");
    return fs_module;
  }
  function get_env_game_path() {
    if (env_game_path === null) {
      env_game_path = requireNativeModule("process", {
        message: "Reads the VINTAGE_STORY environment variable to find your game folder."
      })?.env.VINTAGE_STORY;
    }
    return env_game_path;
  }
  function get_game_path() {
    return Settings.get("game_path") || get_env_game_path() || "";
  }
  var fs_module, fs_denied, fs, env_game_path;
  var init_native = __esm({
    "src/util/native.ts"() {
      fs_denied = false;
      fs = new Proxy({}, {
        get: (_target, key) => Reflect.get(load_fs(), key)
      });
      env_game_path = null;
    }
  });

  // src/util.ts
  function vector_equals(a, b) {
    for (let i = 0; i < 3; i++) {
      if (a[i] != b[i]) {
        return false;
      }
    }
    return true;
  }
  function vector_add(a, b) {
    const c = [0, 0, 0];
    for (let i = 0; i < a.length; i++) {
      c[i] = a[i] + b[i];
    }
    return c;
  }
  function vector_sub(a, b) {
    const c = [0, 0, 0];
    for (let i = 0; i < a.length; i++) {
      c[i] = a[i] - b[i];
    }
    return c;
  }
  function is_vs_project(project) {
    if (project && project.format.id === "formatVS") return true;
    else return false;
  }
  function zyx_to_xyz(rotation) {
    const euler = new THREE.Euler(
      THREE.MathUtils.degToRad(rotation[0]),
      THREE.MathUtils.degToRad(rotation[1]),
      THREE.MathUtils.degToRad(rotation[2]),
      "ZYX"
    );
    euler.reorder("XYZ");
    return [
      THREE.MathUtils.radToDeg(euler.x),
      THREE.MathUtils.radToDeg(euler.y),
      THREE.MathUtils.radToDeg(euler.z)
    ];
  }
  var path, fps, get_texture_location;
  var init_util = __esm({
    "src/util.ts"() {
      path = __toESM(__require("path"), 1);
      init_native();
      fps = 30;
      get_texture_location = function(domain, rel_path) {
        for (const base_mod_path of ["creative", "game", "survival"]) {
          const f = path.posix.format({
            root: get_game_path() + path.sep + "assets" + path.sep + base_mod_path + path.sep + "textures" + path.sep,
            name: rel_path,
            ext: ".png"
          });
          const exists = fs.existsSync(f);
          if (exists) {
            return f;
          }
        }
        return "";
      };
    }
  });

  // node_modules/json5/lib/unicode.js
  var require_unicode = __commonJS({
    "node_modules/json5/lib/unicode.js"(exports, module) {
      module.exports.Space_Separator = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/;
      module.exports.ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/;
      module.exports.ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;
    }
  });

  // node_modules/json5/lib/util.js
  var require_util = __commonJS({
    "node_modules/json5/lib/util.js"(exports, module) {
      var unicode = require_unicode();
      module.exports = {
        isSpaceSeparator(c) {
          return typeof c === "string" && unicode.Space_Separator.test(c);
        },
        isIdStartChar(c) {
          return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "$" || c === "_" || unicode.ID_Start.test(c));
        },
        isIdContinueChar(c) {
          return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "$" || c === "_" || c === "\u200C" || c === "\u200D" || unicode.ID_Continue.test(c));
        },
        isDigit(c) {
          return typeof c === "string" && /[0-9]/.test(c);
        },
        isHexDigit(c) {
          return typeof c === "string" && /[0-9A-Fa-f]/.test(c);
        }
      };
    }
  });

  // node_modules/json5/lib/parse.js
  var require_parse = __commonJS({
    "node_modules/json5/lib/parse.js"(exports, module) {
      var util = require_util();
      var source;
      var parseState;
      var stack;
      var pos;
      var line;
      var column;
      var token;
      var key;
      var root;
      module.exports = function parse(text, reviver) {
        source = String(text);
        parseState = "start";
        stack = [];
        pos = 0;
        line = 1;
        column = 0;
        token = void 0;
        key = void 0;
        root = void 0;
        do {
          token = lex();
          parseStates[parseState]();
        } while (token.type !== "eof");
        if (typeof reviver === "function") {
          return internalize({ "": root }, "", reviver);
        }
        return root;
      };
      function internalize(holder, name2, reviver) {
        const value = holder[name2];
        if (value != null && typeof value === "object") {
          if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
              const key2 = String(i);
              const replacement = internalize(value, key2, reviver);
              if (replacement === void 0) {
                delete value[key2];
              } else {
                Object.defineProperty(value, key2, {
                  value: replacement,
                  writable: true,
                  enumerable: true,
                  configurable: true
                });
              }
            }
          } else {
            for (const key2 in value) {
              const replacement = internalize(value, key2, reviver);
              if (replacement === void 0) {
                delete value[key2];
              } else {
                Object.defineProperty(value, key2, {
                  value: replacement,
                  writable: true,
                  enumerable: true,
                  configurable: true
                });
              }
            }
          }
        }
        return reviver.call(holder, name2, value);
      }
      var lexState;
      var buffer;
      var doubleQuote;
      var sign;
      var c;
      function lex() {
        lexState = "default";
        buffer = "";
        doubleQuote = false;
        sign = 1;
        for (; ; ) {
          c = peek();
          const token2 = lexStates[lexState]();
          if (token2) {
            return token2;
          }
        }
      }
      function peek() {
        if (source[pos]) {
          return String.fromCodePoint(source.codePointAt(pos));
        }
      }
      function read() {
        const c2 = peek();
        if (c2 === "\n") {
          line++;
          column = 0;
        } else if (c2) {
          column += c2.length;
        } else {
          column++;
        }
        if (c2) {
          pos += c2.length;
        }
        return c2;
      }
      var lexStates = {
        default() {
          switch (c) {
            case "	":
            case "\v":
            case "\f":
            case " ":
            case "\xA0":
            case "\uFEFF":
            case "\n":
            case "\r":
            case "\u2028":
            case "\u2029":
              read();
              return;
            case "/":
              read();
              lexState = "comment";
              return;
            case void 0:
              read();
              return newToken("eof");
          }
          if (util.isSpaceSeparator(c)) {
            read();
            return;
          }
          return lexStates[parseState]();
        },
        comment() {
          switch (c) {
            case "*":
              read();
              lexState = "multiLineComment";
              return;
            case "/":
              read();
              lexState = "singleLineComment";
              return;
          }
          throw invalidChar(read());
        },
        multiLineComment() {
          switch (c) {
            case "*":
              read();
              lexState = "multiLineCommentAsterisk";
              return;
            case void 0:
              throw invalidChar(read());
          }
          read();
        },
        multiLineCommentAsterisk() {
          switch (c) {
            case "*":
              read();
              return;
            case "/":
              read();
              lexState = "default";
              return;
            case void 0:
              throw invalidChar(read());
          }
          read();
          lexState = "multiLineComment";
        },
        singleLineComment() {
          switch (c) {
            case "\n":
            case "\r":
            case "\u2028":
            case "\u2029":
              read();
              lexState = "default";
              return;
            case void 0:
              read();
              return newToken("eof");
          }
          read();
        },
        value() {
          switch (c) {
            case "{":
            case "[":
              return newToken("punctuator", read());
            case "n":
              read();
              literal("ull");
              return newToken("null", null);
            case "t":
              read();
              literal("rue");
              return newToken("boolean", true);
            case "f":
              read();
              literal("alse");
              return newToken("boolean", false);
            case "-":
            case "+":
              if (read() === "-") {
                sign = -1;
              }
              lexState = "sign";
              return;
            case ".":
              buffer = read();
              lexState = "decimalPointLeading";
              return;
            case "0":
              buffer = read();
              lexState = "zero";
              return;
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
              buffer = read();
              lexState = "decimalInteger";
              return;
            case "I":
              read();
              literal("nfinity");
              return newToken("numeric", Infinity);
            case "N":
              read();
              literal("aN");
              return newToken("numeric", NaN);
            case '"':
            case "'":
              doubleQuote = read() === '"';
              buffer = "";
              lexState = "string";
              return;
          }
          throw invalidChar(read());
        },
        identifierNameStartEscape() {
          if (c !== "u") {
            throw invalidChar(read());
          }
          read();
          const u = unicodeEscape();
          switch (u) {
            case "$":
            case "_":
              break;
            default:
              if (!util.isIdStartChar(u)) {
                throw invalidIdentifier();
              }
              break;
          }
          buffer += u;
          lexState = "identifierName";
        },
        identifierName() {
          switch (c) {
            case "$":
            case "_":
            case "\u200C":
            case "\u200D":
              buffer += read();
              return;
            case "\\":
              read();
              lexState = "identifierNameEscape";
              return;
          }
          if (util.isIdContinueChar(c)) {
            buffer += read();
            return;
          }
          return newToken("identifier", buffer);
        },
        identifierNameEscape() {
          if (c !== "u") {
            throw invalidChar(read());
          }
          read();
          const u = unicodeEscape();
          switch (u) {
            case "$":
            case "_":
            case "\u200C":
            case "\u200D":
              break;
            default:
              if (!util.isIdContinueChar(u)) {
                throw invalidIdentifier();
              }
              break;
          }
          buffer += u;
          lexState = "identifierName";
        },
        sign() {
          switch (c) {
            case ".":
              buffer = read();
              lexState = "decimalPointLeading";
              return;
            case "0":
              buffer = read();
              lexState = "zero";
              return;
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
              buffer = read();
              lexState = "decimalInteger";
              return;
            case "I":
              read();
              literal("nfinity");
              return newToken("numeric", sign * Infinity);
            case "N":
              read();
              literal("aN");
              return newToken("numeric", NaN);
          }
          throw invalidChar(read());
        },
        zero() {
          switch (c) {
            case ".":
              buffer += read();
              lexState = "decimalPoint";
              return;
            case "e":
            case "E":
              buffer += read();
              lexState = "decimalExponent";
              return;
            case "x":
            case "X":
              buffer += read();
              lexState = "hexadecimal";
              return;
          }
          return newToken("numeric", sign * 0);
        },
        decimalInteger() {
          switch (c) {
            case ".":
              buffer += read();
              lexState = "decimalPoint";
              return;
            case "e":
            case "E":
              buffer += read();
              lexState = "decimalExponent";
              return;
          }
          if (util.isDigit(c)) {
            buffer += read();
            return;
          }
          return newToken("numeric", sign * Number(buffer));
        },
        decimalPointLeading() {
          if (util.isDigit(c)) {
            buffer += read();
            lexState = "decimalFraction";
            return;
          }
          throw invalidChar(read());
        },
        decimalPoint() {
          switch (c) {
            case "e":
            case "E":
              buffer += read();
              lexState = "decimalExponent";
              return;
          }
          if (util.isDigit(c)) {
            buffer += read();
            lexState = "decimalFraction";
            return;
          }
          return newToken("numeric", sign * Number(buffer));
        },
        decimalFraction() {
          switch (c) {
            case "e":
            case "E":
              buffer += read();
              lexState = "decimalExponent";
              return;
          }
          if (util.isDigit(c)) {
            buffer += read();
            return;
          }
          return newToken("numeric", sign * Number(buffer));
        },
        decimalExponent() {
          switch (c) {
            case "+":
            case "-":
              buffer += read();
              lexState = "decimalExponentSign";
              return;
          }
          if (util.isDigit(c)) {
            buffer += read();
            lexState = "decimalExponentInteger";
            return;
          }
          throw invalidChar(read());
        },
        decimalExponentSign() {
          if (util.isDigit(c)) {
            buffer += read();
            lexState = "decimalExponentInteger";
            return;
          }
          throw invalidChar(read());
        },
        decimalExponentInteger() {
          if (util.isDigit(c)) {
            buffer += read();
            return;
          }
          return newToken("numeric", sign * Number(buffer));
        },
        hexadecimal() {
          if (util.isHexDigit(c)) {
            buffer += read();
            lexState = "hexadecimalInteger";
            return;
          }
          throw invalidChar(read());
        },
        hexadecimalInteger() {
          if (util.isHexDigit(c)) {
            buffer += read();
            return;
          }
          return newToken("numeric", sign * Number(buffer));
        },
        string() {
          switch (c) {
            case "\\":
              read();
              buffer += escape2();
              return;
            case '"':
              if (doubleQuote) {
                read();
                return newToken("string", buffer);
              }
              buffer += read();
              return;
            case "'":
              if (!doubleQuote) {
                read();
                return newToken("string", buffer);
              }
              buffer += read();
              return;
            case "\n":
            case "\r":
              throw invalidChar(read());
            case "\u2028":
            case "\u2029":
              separatorChar(c);
              break;
            case void 0:
              throw invalidChar(read());
          }
          buffer += read();
        },
        start() {
          switch (c) {
            case "{":
            case "[":
              return newToken("punctuator", read());
          }
          lexState = "value";
        },
        beforePropertyName() {
          switch (c) {
            case "$":
            case "_":
              buffer = read();
              lexState = "identifierName";
              return;
            case "\\":
              read();
              lexState = "identifierNameStartEscape";
              return;
            case "}":
              return newToken("punctuator", read());
            case '"':
            case "'":
              doubleQuote = read() === '"';
              lexState = "string";
              return;
          }
          if (util.isIdStartChar(c)) {
            buffer += read();
            lexState = "identifierName";
            return;
          }
          throw invalidChar(read());
        },
        afterPropertyName() {
          if (c === ":") {
            return newToken("punctuator", read());
          }
          throw invalidChar(read());
        },
        beforePropertyValue() {
          lexState = "value";
        },
        afterPropertyValue() {
          switch (c) {
            case ",":
            case "}":
              return newToken("punctuator", read());
          }
          throw invalidChar(read());
        },
        beforeArrayValue() {
          if (c === "]") {
            return newToken("punctuator", read());
          }
          lexState = "value";
        },
        afterArrayValue() {
          switch (c) {
            case ",":
            case "]":
              return newToken("punctuator", read());
          }
          throw invalidChar(read());
        },
        end() {
          throw invalidChar(read());
        }
      };
      function newToken(type, value) {
        return {
          type,
          value,
          line,
          column
        };
      }
      function literal(s) {
        for (const c2 of s) {
          const p = peek();
          if (p !== c2) {
            throw invalidChar(read());
          }
          read();
        }
      }
      function escape2() {
        const c2 = peek();
        switch (c2) {
          case "b":
            read();
            return "\b";
          case "f":
            read();
            return "\f";
          case "n":
            read();
            return "\n";
          case "r":
            read();
            return "\r";
          case "t":
            read();
            return "	";
          case "v":
            read();
            return "\v";
          case "0":
            read();
            if (util.isDigit(peek())) {
              throw invalidChar(read());
            }
            return "\0";
          case "x":
            read();
            return hexEscape();
          case "u":
            read();
            return unicodeEscape();
          case "\n":
          case "\u2028":
          case "\u2029":
            read();
            return "";
          case "\r":
            read();
            if (peek() === "\n") {
              read();
            }
            return "";
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            throw invalidChar(read());
          case void 0:
            throw invalidChar(read());
        }
        return read();
      }
      function hexEscape() {
        let buffer2 = "";
        let c2 = peek();
        if (!util.isHexDigit(c2)) {
          throw invalidChar(read());
        }
        buffer2 += read();
        c2 = peek();
        if (!util.isHexDigit(c2)) {
          throw invalidChar(read());
        }
        buffer2 += read();
        return String.fromCodePoint(parseInt(buffer2, 16));
      }
      function unicodeEscape() {
        let buffer2 = "";
        let count = 4;
        while (count-- > 0) {
          const c2 = peek();
          if (!util.isHexDigit(c2)) {
            throw invalidChar(read());
          }
          buffer2 += read();
        }
        return String.fromCodePoint(parseInt(buffer2, 16));
      }
      var parseStates = {
        start() {
          if (token.type === "eof") {
            throw invalidEOF();
          }
          push();
        },
        beforePropertyName() {
          switch (token.type) {
            case "identifier":
            case "string":
              key = token.value;
              parseState = "afterPropertyName";
              return;
            case "punctuator":
              pop();
              return;
            case "eof":
              throw invalidEOF();
          }
        },
        afterPropertyName() {
          if (token.type === "eof") {
            throw invalidEOF();
          }
          parseState = "beforePropertyValue";
        },
        beforePropertyValue() {
          if (token.type === "eof") {
            throw invalidEOF();
          }
          push();
        },
        beforeArrayValue() {
          if (token.type === "eof") {
            throw invalidEOF();
          }
          if (token.type === "punctuator" && token.value === "]") {
            pop();
            return;
          }
          push();
        },
        afterPropertyValue() {
          if (token.type === "eof") {
            throw invalidEOF();
          }
          switch (token.value) {
            case ",":
              parseState = "beforePropertyName";
              return;
            case "}":
              pop();
          }
        },
        afterArrayValue() {
          if (token.type === "eof") {
            throw invalidEOF();
          }
          switch (token.value) {
            case ",":
              parseState = "beforeArrayValue";
              return;
            case "]":
              pop();
          }
        },
        end() {
        }
      };
      function push() {
        let value;
        switch (token.type) {
          case "punctuator":
            switch (token.value) {
              case "{":
                value = {};
                break;
              case "[":
                value = [];
                break;
            }
            break;
          case "null":
          case "boolean":
          case "numeric":
          case "string":
            value = token.value;
            break;
        }
        if (root === void 0) {
          root = value;
        } else {
          const parent = stack[stack.length - 1];
          if (Array.isArray(parent)) {
            parent.push(value);
          } else {
            Object.defineProperty(parent, key, {
              value,
              writable: true,
              enumerable: true,
              configurable: true
            });
          }
        }
        if (value !== null && typeof value === "object") {
          stack.push(value);
          if (Array.isArray(value)) {
            parseState = "beforeArrayValue";
          } else {
            parseState = "beforePropertyName";
          }
        } else {
          const current = stack[stack.length - 1];
          if (current == null) {
            parseState = "end";
          } else if (Array.isArray(current)) {
            parseState = "afterArrayValue";
          } else {
            parseState = "afterPropertyValue";
          }
        }
      }
      function pop() {
        stack.pop();
        const current = stack[stack.length - 1];
        if (current == null) {
          parseState = "end";
        } else if (Array.isArray(current)) {
          parseState = "afterArrayValue";
        } else {
          parseState = "afterPropertyValue";
        }
      }
      function invalidChar(c2) {
        if (c2 === void 0) {
          return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
        }
        return syntaxError(`JSON5: invalid character '${formatChar(c2)}' at ${line}:${column}`);
      }
      function invalidEOF() {
        return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
      }
      function invalidIdentifier() {
        column -= 5;
        return syntaxError(`JSON5: invalid identifier character at ${line}:${column}`);
      }
      function separatorChar(c2) {
        console.warn(`JSON5: '${formatChar(c2)}' in strings is not valid ECMAScript; consider escaping`);
      }
      function formatChar(c2) {
        const replacements = {
          "'": "\\'",
          '"': '\\"',
          "\\": "\\\\",
          "\b": "\\b",
          "\f": "\\f",
          "\n": "\\n",
          "\r": "\\r",
          "	": "\\t",
          "\v": "\\v",
          "\0": "\\0",
          "\u2028": "\\u2028",
          "\u2029": "\\u2029"
        };
        if (replacements[c2]) {
          return replacements[c2];
        }
        if (c2 < " ") {
          const hexString = c2.charCodeAt(0).toString(16);
          return "\\x" + ("00" + hexString).substring(hexString.length);
        }
        return c2;
      }
      function syntaxError(message) {
        const err = new SyntaxError(message);
        err.lineNumber = line;
        err.columnNumber = column;
        return err;
      }
    }
  });

  // node_modules/json5/lib/stringify.js
  var require_stringify = __commonJS({
    "node_modules/json5/lib/stringify.js"(exports, module) {
      var util = require_util();
      module.exports = function stringify(value, replacer, space) {
        const stack = [];
        let indent = "";
        let propertyList;
        let replacerFunc;
        let gap = "";
        let quote;
        if (replacer != null && typeof replacer === "object" && !Array.isArray(replacer)) {
          space = replacer.space;
          quote = replacer.quote;
          replacer = replacer.replacer;
        }
        if (typeof replacer === "function") {
          replacerFunc = replacer;
        } else if (Array.isArray(replacer)) {
          propertyList = [];
          for (const v of replacer) {
            let item;
            if (typeof v === "string") {
              item = v;
            } else if (typeof v === "number" || v instanceof String || v instanceof Number) {
              item = String(v);
            }
            if (item !== void 0 && propertyList.indexOf(item) < 0) {
              propertyList.push(item);
            }
          }
        }
        if (space instanceof Number) {
          space = Number(space);
        } else if (space instanceof String) {
          space = String(space);
        }
        if (typeof space === "number") {
          if (space > 0) {
            space = Math.min(10, Math.floor(space));
            gap = "          ".substr(0, space);
          }
        } else if (typeof space === "string") {
          gap = space.substr(0, 10);
        }
        return serializeProperty("", { "": value });
        function serializeProperty(key, holder) {
          let value2 = holder[key];
          if (value2 != null) {
            if (typeof value2.toJSON5 === "function") {
              value2 = value2.toJSON5(key);
            } else if (typeof value2.toJSON === "function") {
              value2 = value2.toJSON(key);
            }
          }
          if (replacerFunc) {
            value2 = replacerFunc.call(holder, key, value2);
          }
          if (value2 instanceof Number) {
            value2 = Number(value2);
          } else if (value2 instanceof String) {
            value2 = String(value2);
          } else if (value2 instanceof Boolean) {
            value2 = value2.valueOf();
          }
          switch (value2) {
            case null:
              return "null";
            case true:
              return "true";
            case false:
              return "false";
          }
          if (typeof value2 === "string") {
            return quoteString(value2, false);
          }
          if (typeof value2 === "number") {
            return String(value2);
          }
          if (typeof value2 === "object") {
            return Array.isArray(value2) ? serializeArray(value2) : serializeObject(value2);
          }
          return void 0;
        }
        function quoteString(value2) {
          const quotes = {
            "'": 0.1,
            '"': 0.2
          };
          const replacements = {
            "'": "\\'",
            '"': '\\"',
            "\\": "\\\\",
            "\b": "\\b",
            "\f": "\\f",
            "\n": "\\n",
            "\r": "\\r",
            "	": "\\t",
            "\v": "\\v",
            "\0": "\\0",
            "\u2028": "\\u2028",
            "\u2029": "\\u2029"
          };
          let product = "";
          for (let i = 0; i < value2.length; i++) {
            const c = value2[i];
            switch (c) {
              case "'":
              case '"':
                quotes[c]++;
                product += c;
                continue;
              case "\0":
                if (util.isDigit(value2[i + 1])) {
                  product += "\\x00";
                  continue;
                }
            }
            if (replacements[c]) {
              product += replacements[c];
              continue;
            }
            if (c < " ") {
              let hexString = c.charCodeAt(0).toString(16);
              product += "\\x" + ("00" + hexString).substring(hexString.length);
              continue;
            }
            product += c;
          }
          const quoteChar = quote || Object.keys(quotes).reduce((a, b) => quotes[a] < quotes[b] ? a : b);
          product = product.replace(new RegExp(quoteChar, "g"), replacements[quoteChar]);
          return quoteChar + product + quoteChar;
        }
        function serializeObject(value2) {
          if (stack.indexOf(value2) >= 0) {
            throw TypeError("Converting circular structure to JSON5");
          }
          stack.push(value2);
          let stepback = indent;
          indent = indent + gap;
          let keys = propertyList || Object.keys(value2);
          let partial = [];
          for (const key of keys) {
            const propertyString = serializeProperty(key, value2);
            if (propertyString !== void 0) {
              let member = serializeKey(key) + ":";
              if (gap !== "") {
                member += " ";
              }
              member += propertyString;
              partial.push(member);
            }
          }
          let final;
          if (partial.length === 0) {
            final = "{}";
          } else {
            let properties;
            if (gap === "") {
              properties = partial.join(",");
              final = "{" + properties + "}";
            } else {
              let separator = ",\n" + indent;
              properties = partial.join(separator);
              final = "{\n" + indent + properties + ",\n" + stepback + "}";
            }
          }
          stack.pop();
          indent = stepback;
          return final;
        }
        function serializeKey(key) {
          if (key.length === 0) {
            return quoteString(key, true);
          }
          const firstChar = String.fromCodePoint(key.codePointAt(0));
          if (!util.isIdStartChar(firstChar)) {
            return quoteString(key, true);
          }
          for (let i = firstChar.length; i < key.length; i++) {
            if (!util.isIdContinueChar(String.fromCodePoint(key.codePointAt(i)))) {
              return quoteString(key, true);
            }
          }
          return key;
        }
        function serializeArray(value2) {
          if (stack.indexOf(value2) >= 0) {
            throw TypeError("Converting circular structure to JSON5");
          }
          stack.push(value2);
          let stepback = indent;
          indent = indent + gap;
          let partial = [];
          for (let i = 0; i < value2.length; i++) {
            const propertyString = serializeProperty(String(i), value2);
            partial.push(propertyString !== void 0 ? propertyString : "null");
          }
          let final;
          if (partial.length === 0) {
            final = "[]";
          } else {
            if (gap === "") {
              let properties = partial.join(",");
              final = "[" + properties + "]";
            } else {
              let separator = ",\n" + indent;
              let properties = partial.join(separator);
              final = "[\n" + indent + properties + ",\n" + stepback + "]";
            }
          }
          stack.pop();
          indent = stepback;
          return final;
        }
      };
    }
  });

  // node_modules/json5/lib/index.js
  var require_lib = __commonJS({
    "node_modules/json5/lib/index.js"(exports, module) {
      var parse = require_parse();
      var stringify = require_stringify();
      var JSON55 = {
        parse,
        stringify
      };
      module.exports = JSON55;
    }
  });

  // src/attachments/presets.ts
  var presets_exports = {};
  __export(presets_exports, {
    GLINT_PRESET: () => GLINT_PRESET,
    PRESETS: () => PRESETS,
    VINTAGE_STORY_PRESET: () => VINTAGE_STORY_PRESET,
    getActiveSlotNames: () => getActiveSlotNames,
    inferClothingSlotFromPath: () => inferClothingSlotFromPath
  });
  function inferClothingSlotFromPath(filePath) {
    if (!filePath) return null;
    const normalizedPath = filePath.replace(/\\/g, "/").toLowerCase();
    const pathSegments = normalizedPath.split("/");
    if (pathSegments.includes("armor")) {
      const filename = pathSegments[pathSegments.length - 1].replace(/\.[^.]+$/, "");
      if (filename === "body") return "Armor Body";
      if (filename === "head") return "Armor Head";
      if (filename === "legs") return "Armor Legs";
    }
    for (let i = pathSegments.length - 1; i >= 0; i--) {
      const segment = pathSegments[i];
      if (PATH_TO_SLOT_MAPPINGS[segment]) {
        return PATH_TO_SLOT_MAPPINGS[segment];
      }
    }
    return null;
  }
  function getActiveSlotNames() {
    try {
      const presetKey = Settings.get("attachment_preset") || "vintage_story";
      if (presetKey === "custom") {
        const customSlots = Settings.get("attachment_custom_slots");
        if (customSlots && Array.isArray(customSlots) && customSlots.length > 0) {
          return customSlots;
        }
        return VINTAGE_STORY_PRESET.slots;
      }
      const preset = PRESETS[presetKey];
      if (preset) {
        return preset.slots;
      }
    } catch (e) {
      console.warn("Error getting attachment preset from settings:", e);
    }
    return VINTAGE_STORY_PRESET.slots;
  }
  var GLINT_PRESET, VINTAGE_STORY_PRESET, PRESETS, PATH_TO_SLOT_MAPPINGS;
  var init_presets = __esm({
    "src/attachments/presets.ts"() {
      GLINT_PRESET = {
        name: "Glint",
        description: "Glint character customization slots",
        slots: [
          "Outerwear",
          "Top",
          "Bottoms",
          "Shoes",
          "Gloves",
          "Headwear",
          "Eyebrows",
          "Eyes",
          "Nose",
          "Mouth",
          "FacialHair",
          "Earrings",
          "Ears",
          "FaceItem",
          "Hair"
        ]
      };
      VINTAGE_STORY_PRESET = {
        name: "Vintage Story",
        description: "Vintage Story Seraph clothing and armor slots",
        slots: [
          // Clothing slots
          "Arm",
          "Emblem",
          "Face",
          "Ears",
          "Hair",
          "Nose",
          "Foot",
          "Hand",
          "Head",
          "LowerBody",
          "Neck",
          "Shoulder",
          "UpperBody",
          "UpperBodyOver",
          "Waist",
          // Armor slots
          "Armor Body",
          "Armor Head",
          "Armor Legs"
        ]
      };
      PRESETS = {
        "glint": GLINT_PRESET,
        "vintage_story": VINTAGE_STORY_PRESET
      };
      PATH_TO_SLOT_MAPPINGS = {
        // Vintage Story clothing paths
        "upperbody": "UpperBody",
        "upperbodyover": "UpperBodyOver",
        "lowerbody": "LowerBody",
        "head": "Head",
        "face": "Face",
        "neck": "Neck",
        "shoulder": "Shoulder",
        "hand": "Hand",
        "foot": "Foot",
        "waist": "Waist",
        "arm": "Arm",
        "emblem": "Emblem",
        "faceitem": "FaceItem",
        // Glint paths
        "outerwear": "Outerwear",
        "top": "Top",
        "bottom": "Bottoms",
        "bottoms": "Bottoms",
        "boot": "Shoes",
        "boots": "Shoes",
        "shoes": "Shoes",
        "glove": "Gloves",
        "gloves": "Gloves",
        "headwear": "Headwear",
        "eyebrows": "Eyebrows",
        "eyes": "Eyes",
        "nose": "Nose",
        "mouth": "Mouth",
        "facialhair": "FacialHair",
        "earring": "Earrings",
        "earrings": "Earrings",
        "ears": "Ears",
        // Hair (shared)
        "hair": "Hair",
        "hair-base": "Hair",
        "hair-extra": "Hair",
        "hair-face": "Hair"
      };
    }
  });

  // src/property.ts
  function isFiniteVector(value, length) {
    return Array.isArray(value) && value.length === length && value.every((component) => typeof component === "number" && Number.isFinite(component));
  }
  function isNonEmptyRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length > 0;
  }
  function registerOptionalInternalProperty(targetClass, type, name2, validate) {
    return new Property(targetClass, type, name2, {
      exposed: false,
      condition(instance) {
        return validate(instance?.[name2], instance);
      },
      reset(instance) {
        delete instance[name2];
      },
      merge(instance, data) {
        const value = data?.[name2];
        if (!validate(value, data)) return;
        if (Array.isArray(value)) {
          instance[name2] = value.slice();
        } else if (value !== null && typeof value === "object") {
          instance[name2] = structuredClone(value);
        } else {
          instance[name2] = value;
        }
      }
    });
  }
  function registerStepParentTransformProperties(targetClass) {
    registerOptionalInternalProperty(
      targetClass,
      "boolean",
      "vs_step_parent_local",
      (value) => value === true
    );
    registerOptionalInternalProperty(
      targetClass,
      "boolean",
      "vs_has_step_parent_transform",
      (value) => value === true
    );
    for (const name2 of ["vs_step_parent_origin", "vs_step_parent_rotation"]) {
      registerOptionalInternalProperty(
        targetClass,
        "vector",
        name2,
        (value, container) => container?.vs_has_step_parent_transform === true && isFiniteVector(value, 3)
      );
    }
  }
  function registerPaletteSlotProperty(targetClass) {
    const property = new Property(targetClass, "number", "paletteSlot", {
      default: 0,
      label: "Palette Slot",
      exposed: true,
      options: PALETTE_SLOT_OPTIONS,
      inputs: {
        element_panel: {
          input: {
            label: "Palette Slot",
            type: "select",
            options: PALETTE_SLOT_OPTIONS
          }
        }
      }
    });
    return property;
  }
  function registerNoOutlineProperty(targetClass) {
    const property = new Property(targetClass, "boolean", "noOutline", {
      default: false,
      label: "No Outline",
      exposed: true,
      inputs: {
        element_panel: {
          input: {
            label: "No Outline",
            type: "checkbox"
          }
        }
      }
    });
    return property;
  }
  var VS_PROJECT_PROPS, PALETTE_SLOT_OPTIONS, VS_GROUP_PROPS, VS_CUBE_PROPS, VS_TEXTURE_PROPS, VS_LOCATOR_PROPS, VS_FACE_PROPS, isNonEmptyString;
  var init_property = __esm({
    "src/property.ts"() {
      for (const name2 of ["vs_code", "vs_onActivityStopped", "vs_onAnimationEnd", "vs_library_ref"]) {
        new Property(Blockbench.Animation, "string", name2, { exposed: false });
      }
      VS_PROJECT_PROPS = [
        new Property(ModelProject, "string", "backDropShape", { exposed: false }),
        new Property(ModelProject, "string", "collapsedPaths", { exposed: false }),
        new Property(ModelProject, "boolean", "allAngles", { exposed: false }),
        new Property(ModelProject, "boolean", "entityTextureMode", { exposed: false }),
        new Property(ModelProject, "boolean", "singleTexture", { exposed: false }),
        new Property(ModelProject, "boolean", "vsFormatConverted", { exposed: false })
      ];
      PALETTE_SLOT_OPTIONS = {
        "0": "0 - Inherit / Default",
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7"
      };
      VS_GROUP_PROPS = [
        new Property(Group, "string", "stepParentName", {
          default: "",
          label: "Step Parent",
          exposed: true,
          inputs: {
            element_panel: {
              input: {
                label: "Step Parent",
                type: "text"
              }
            }
          },
          onChange() {
            Canvas.updateAllBones();
            Canvas.updateAllPositions();
          }
        }),
        registerPaletteSlotProperty(Group),
        registerNoOutlineProperty(Group)
      ];
      new Property(Group, "string", "clothingSlot", {
        default: "",
        label: "Clothing Slot",
        exposed: true,
        options: () => {
          const { getActiveSlotNames: getActiveSlotNames2 } = (init_presets(), __toCommonJS(presets_exports));
          const slots = getActiveSlotNames2();
          const options = { "": "None" };
          slots.forEach((slot) => {
            options[slot] = slot;
          });
          return options;
        },
        inputs: {
          element_panel: {
            input: {
              label: "Clothing Slot",
              type: "select",
              options: () => {
                const { getActiveSlotNames: getActiveSlotNames2 } = (init_presets(), __toCommonJS(presets_exports));
                const slots = getActiveSlotNames2();
                const options = { "": "None" };
                slots.forEach((slot) => {
                  options[slot] = slot;
                });
                return options;
              }
            }
          }
        },
        onChange() {
          try {
            if (Interface.Panels?.attachments_panel?.vue) {
              Interface.Panels.attachments_panel.vue.updateAttachments();
            }
          } catch (e) {
            console.warn("Could not refresh attachments panel:", e);
          }
        }
      });
      new Property(Group, "boolean", "backdrop");
      registerStepParentTransformProperties(Group);
      registerOptionalInternalProperty(Group, "vector", "vs_group_from", (value) => isFiniteVector(value, 3));
      registerOptionalInternalProperty(Group, "vector", "vs_group_to", (value) => isFiniteVector(value, 3));
      registerOptionalInternalProperty(Group, "boolean", "vs_has_rotation_origin", (value) => value === true);
      registerOptionalInternalProperty(Group, "object", "vs_zero_size_faces", isNonEmptyRecord);
      registerOptionalInternalProperty(Group, "vector2", "vs_uv", (value) => isFiniteVector(value, 2));
      registerOptionalInternalProperty(Group, "object", "vs_extra_props", isNonEmptyRecord);
      VS_CUBE_PROPS = [
        new Property(Cube, "string", "stepParentName", {
          default: "",
          label: "Step Parent",
          exposed: true,
          inputs: {
            element_panel: {
              input: {
                label: "Step Parent",
                type: "text"
              }
            }
          },
          onChange() {
            Canvas.updateAllBones();
            Canvas.updateAllPositions();
          }
        }),
        registerPaletteSlotProperty(Cube),
        registerNoOutlineProperty(Cube),
        new Property(Cube, "boolean", "shade", {
          default: true,
          label: "Shade",
          exposed: true,
          inputs: {
            element_panel: {
              input: {
                label: "Shade",
                type: "checkbox"
              }
            }
          }
        }),
        new Property(Cube, "string", "climateColorMap", {
          default: "",
          label: "Climate Color Map",
          exposed: true,
          inputs: {
            element_panel: {
              input: {
                label: "Climate Color Map",
                type: "text"
              }
            }
          }
        }),
        new Property(Cube, "boolean", "gradientShade", {
          default: false,
          label: "Gradient Shade",
          exposed: true,
          inputs: {
            element_panel: {
              input: {
                label: "Gradient Shade",
                type: "checkbox"
              }
            }
          }
        }),
        new Property(Cube, "number", "renderPass", {
          default: -1,
          label: "Render Pass",
          exposed: true,
          options: {
            "-1": "Default",
            "0": "Opaque",
            "1": "OpaqueNoCull",
            "2": "BlendNoCull",
            "3": "Transparent",
            "4": "Liquid",
            "5": "TopSoil",
            "6": "Meta"
          },
          inputs: {
            element_panel: {
              input: {
                label: "Render Pass",
                type: "select",
                options: {
                  "-1": "Default",
                  "0": "Opaque",
                  "1": "OpaqueNoCull",
                  "2": "BlendNoCull",
                  "3": "Transparent",
                  "4": "Liquid",
                  "5": "TopSoil",
                  "6": "Meta"
                }
              }
            }
          }
        }),
        new Property(Cube, "string", "seasonColorMap", {
          default: "",
          label: "Season Color Map",
          exposed: true,
          inputs: {
            element_panel: {
              input: {
                label: "Season Color Map",
                type: "text"
              }
            }
          }
        }),
        new Property(Cube, "number", "unwrapMode", {
          default: 0,
          label: "Unwrap Mode",
          exposed: false
        }),
        new Property(Cube, "boolean", "autoUnwrap", {
          default: false,
          label: "Auto Unwrap",
          exposed: false
        }),
        new Property(Cube, "boolean", "disableRandomDrawOffset", {
          default: false,
          label: "Disable Random Draw Offset",
          exposed: false
        }),
        new Property(Cube, "number", "unwrapRotation", {
          default: 0,
          label: "Unwrap Rotation",
          exposed: false
        })
      ];
      new Property(Cube, "string", "clothingSlot", {
        default: "",
        label: "Clothing Slot",
        exposed: true,
        options: () => {
          const { getActiveSlotNames: getActiveSlotNames2 } = (init_presets(), __toCommonJS(presets_exports));
          const slots = getActiveSlotNames2();
          const options = { "": "None" };
          slots.forEach((slot) => {
            options[slot] = slot;
          });
          return options;
        },
        inputs: {
          element_panel: {
            input: {
              label: "Clothing Slot",
              type: "select",
              options: () => {
                const { getActiveSlotNames: getActiveSlotNames2 } = (init_presets(), __toCommonJS(presets_exports));
                const slots = getActiveSlotNames2();
                const options = { "": "None" };
                slots.forEach((slot) => {
                  options[slot] = slot;
                });
                return options;
              }
            }
          }
        },
        onChange() {
          try {
            if (Interface.Panels?.attachments_panel?.vue) {
              Interface.Panels.attachments_panel.vue.updateAttachments();
            }
          } catch (e) {
            console.warn("Could not refresh attachments panel:", e);
          }
        }
      });
      new Property(Cube, "boolean", "backdrop");
      registerStepParentTransformProperties(Cube);
      registerOptionalInternalProperty(Cube, "boolean", "vs_has_rotation_origin", (value) => value === true);
      registerOptionalInternalProperty(Cube, "vector2", "vs_uv", (value) => isFiniteVector(value, 2));
      registerOptionalInternalProperty(Cube, "object", "vs_extra_props", isNonEmptyRecord);
      VS_TEXTURE_PROPS = [
        new Property(Texture, "string", "textureLocation", {
          default: "",
          label: "Texture Location",
          exposed: true,
          inputs: {
            element_panel: {
              input: {
                label: "Texture Location",
                type: "text"
              }
            }
          }
        })
      ];
      VS_LOCATOR_PROPS = [
        new Property(Locator, "number", "rotationX", { default: 0 }),
        new Property(Locator, "number", "rotationY", { default: 0 }),
        new Property(Locator, "number", "rotationZ", { default: 0 })
      ];
      VS_FACE_PROPS = [
        new Property(CubeFace, "number", "glow"),
        new Property(CubeFace, "number", "reflectiveMode"),
        new Property(CubeFace, "array", "windMode"),
        new Property(CubeFace, "array", "windData"),
        new Property(CubeFace, "boolean", "autoUv", { default: false }),
        new Property(CubeFace, "boolean", "snapUv", { default: false })
      ];
      registerOptionalInternalProperty(CubeFace, "object", "vs_extra_props", isNonEmptyRecord);
      registerOptionalInternalProperty(Locator, "object", "vs_extra_props", isNonEmptyRecord);
      registerOptionalInternalProperty(ModelProject, "object", "vs_extra_props", isNonEmptyRecord);
      registerOptionalInternalProperty(ModelProject, "object", "vs_extra_editor_props", isNonEmptyRecord);
      registerOptionalInternalProperty(ModelProject, "object", "vs_textureSizes", isNonEmptyRecord);
      isNonEmptyString = (value) => typeof value === "string" && value !== "";
      registerOptionalInternalProperty(Animation, "string", "vs_code", isNonEmptyString);
      registerOptionalInternalProperty(Animation, "string", "vs_onActivityStopped", isNonEmptyString);
      registerOptionalInternalProperty(Animation, "string", "vs_onAnimationEnd", isNonEmptyString);
      registerOptionalInternalProperty(Animation, "string", "vs_library_ref", isNonEmptyString);
      registerOptionalInternalProperty(Animation, "object", "vs_extra_props", isNonEmptyRecord);
      registerOptionalInternalProperty(Animation, "object", "vs_extra_keyframe_props", isNonEmptyRecord);
      registerOptionalInternalProperty(Animation, "object", "vs_extra_element_props", isNonEmptyRecord);
    }
  });

  // src/preserved_props.ts
  function clone_json(value) {
    if (value === null || typeof value !== "object") return value;
    try {
      return structuredClone(value);
    } catch {
      return JSON.parse(JSON.stringify(value));
    }
  }
  function prop_names(props) {
    return props.map((prop) => prop.name);
  }
  function is_empty_record(value) {
    return !!value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0;
  }
  function editor_known_keys() {
    return new Set(prop_names(VS_PROJECT_PROPS));
  }
  function is_dropped_element_value(name2, value, on_group) {
    if (name2 === "shade") return on_group || value !== false;
    if (name2 === "noOutline") return false;
    if (name2 === "faces") return on_group && is_empty_record(value);
    if (ELEMENT_UNTRACKED_KEYS.has(name2)) return false;
    if (name2 === "rotationX" || name2 === "rotationY" || name2 === "rotationZ") return Number(value) === 0;
    if (value === void 0 || value === null || value === "" || value === false) return true;
    if (name2 === "renderPass") return Number(value) === -1;
    if (name2 === "unwrapMode" || name2 === "unwrapRotation" || name2 === "paletteSlot") {
      return Number(value) === 0;
    }
    return false;
  }
  function is_dropped_face_value(name2, value) {
    if (FACE_UNTRACKED_KEYS.has(name2)) return false;
    if (name2 === "enabled") return value !== false;
    if (value === void 0 || value === null || value === "" || value === false) return true;
    if (name2 === "windMode") return Array.isArray(value) && value.every((v) => v === -1);
    if (name2 === "windData" || name2 === "uv") return Array.isArray(value) && value.every((v) => v === 0);
    if (typeof value === "number") return value === 0;
    return false;
  }
  function collect_extras(source, known, is_dropped) {
    if (!source || typeof source !== "object" || Array.isArray(source)) return void 0;
    let extras;
    for (const [key, value] of Object.entries(source)) {
      if (value === void 0) continue;
      if (known.has(key) && !(is_dropped && is_dropped(key, value))) continue;
      if (!extras) extras = {};
      extras[key] = clone_json(value);
    }
    return extras;
  }
  function collect_element_extras(element, on_group = false) {
    return collect_extras(element, ELEMENT_KNOWN_KEYS, (name2, value) => is_dropped_element_value(name2, value, on_group));
  }
  function collect_face_extras(face) {
    return collect_extras(face, FACE_KNOWN_KEYS, is_dropped_face_value);
  }
  function collect_shape_extras(shape) {
    return collect_extras(shape, SHAPE_KNOWN_KEYS);
  }
  function collect_editor_extras(editor) {
    return collect_extras(editor, editor_known_keys());
  }
  function collect_attachment_point_extras(point) {
    return collect_extras(point, ATTACHMENT_POINT_KNOWN_KEYS);
  }
  function apply_extra_props(target, extras) {
    if (!extras || typeof extras !== "object" || Array.isArray(extras)) return target;
    const record = target;
    for (const [key, value] of Object.entries(extras)) {
      if (value === void 0) continue;
      if (Object.prototype.hasOwnProperty.call(record, key) && record[key] !== void 0) continue;
      record[key] = clone_json(value);
    }
    return target;
  }
  var ELEMENT_STRUCTURAL_KEYS, FACE_STRUCTURAL_KEYS, FACE_UNTRACKED_KEYS, ELEMENT_UNTRACKED_KEYS, ELEMENT_KNOWN_KEYS, FACE_KNOWN_KEYS, SHAPE_KNOWN_KEYS, ATTACHMENT_POINT_KNOWN_KEYS;
  var init_preserved_props = __esm({
    "src/preserved_props.ts"() {
      init_property();
      ELEMENT_STRUCTURAL_KEYS = [
        "name",
        "from",
        "to",
        "uv",
        "rotationOrigin",
        "rotationX",
        "rotationY",
        "rotationZ",
        "faces",
        "children",
        "attachmentpoints"
      ];
      FACE_STRUCTURAL_KEYS = ["texture", "uv", "rotation", "enabled"];
      FACE_UNTRACKED_KEYS = /* @__PURE__ */ new Set(["texture", "rotation"]);
      ELEMENT_UNTRACKED_KEYS = new Set(
        ELEMENT_STRUCTURAL_KEYS.filter((key) => !["rotationX", "rotationY", "rotationZ"].includes(key))
      );
      ELEMENT_KNOWN_KEYS = /* @__PURE__ */ new Set([
        ...ELEMENT_STRUCTURAL_KEYS,
        ...prop_names(VS_CUBE_PROPS),
        ...prop_names(VS_GROUP_PROPS)
      ]);
      FACE_KNOWN_KEYS = /* @__PURE__ */ new Set([
        ...FACE_STRUCTURAL_KEYS,
        ...prop_names(VS_FACE_PROPS)
      ]);
      SHAPE_KNOWN_KEYS = /* @__PURE__ */ new Set([
        "editor",
        "textureWidth",
        "textureHeight",
        "textureSizes",
        "textures",
        "elements",
        "animations",
        "animationLibraries"
      ]);
      ATTACHMENT_POINT_KNOWN_KEYS = /* @__PURE__ */ new Set([
        "code",
        "posX",
        "posY",
        "posZ",
        "rotationX",
        "rotationY",
        "rotationZ"
      ]);
    }
  });

  // src/export_model/locator.ts
  var locator_exports = {};
  __export(locator_exports, {
    process_locators: () => process_locators
  });
  function process_locators(parent, locators) {
    const attachmentPoints = [];
    if (locators.length === 0) {
      return attachmentPoints;
    }
    const parent_pos = parent ? parent.vs_group_from ?? parent.origin : [0, 0, 0];
    for (const locator of locators) {
      if (!locator.export) continue;
      const locator_pos = locator.from ?? locator.position ?? [0, 0, 0];
      const relative_pos = vector_sub(locator_pos, parent_pos);
      const rotation = [
        locator.rotationX || 0,
        locator.rotationY || 0,
        locator.rotationZ || 0
      ];
      const attachmentPoint = {
        code: locator.name,
        posX: relative_pos[0].toString(),
        posY: relative_pos[1].toString(),
        posZ: relative_pos[2].toString(),
        rotationX: rotation[0].toString(),
        rotationY: rotation[1].toString(),
        rotationZ: rotation[2].toString()
      };
      apply_extra_props(attachmentPoint, locator.vs_extra_props);
      attachmentPoints.push(attachmentPoint);
    }
    return attachmentPoints;
  }
  var init_locator = __esm({
    "src/export_model/locator.ts"() {
      init_util();
      init_preserved_props();
    }
  });

  // node_modules/ajv/dist/compile/codegen/code.js
  var require_code = __commonJS({
    "node_modules/ajv/dist/compile/codegen/code.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
      var _CodeOrName = class {
      };
      exports._CodeOrName = _CodeOrName;
      exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
      var Name = class extends _CodeOrName {
        constructor(s) {
          super();
          if (!exports.IDENTIFIER.test(s))
            throw new Error("CodeGen: name must be a valid identifier");
          this.str = s;
        }
        toString() {
          return this.str;
        }
        emptyStr() {
          return false;
        }
        get names() {
          return { [this.str]: 1 };
        }
      };
      exports.Name = Name;
      var _Code = class extends _CodeOrName {
        constructor(code) {
          super();
          this._items = typeof code === "string" ? [code] : code;
        }
        toString() {
          return this.str;
        }
        emptyStr() {
          if (this._items.length > 1)
            return false;
          const item = this._items[0];
          return item === "" || item === '""';
        }
        get str() {
          var _a;
          return (_a = this._str) !== null && _a !== void 0 ? _a : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
        }
        get names() {
          var _a;
          return (_a = this._names) !== null && _a !== void 0 ? _a : this._names = this._items.reduce((names, c) => {
            if (c instanceof Name)
              names[c.str] = (names[c.str] || 0) + 1;
            return names;
          }, {});
        }
      };
      exports._Code = _Code;
      exports.nil = new _Code("");
      function _(strs, ...args) {
        const code = [strs[0]];
        let i = 0;
        while (i < args.length) {
          addCodeArg(code, args[i]);
          code.push(strs[++i]);
        }
        return new _Code(code);
      }
      exports._ = _;
      var plus = new _Code("+");
      function str(strs, ...args) {
        const expr = [safeStringify(strs[0])];
        let i = 0;
        while (i < args.length) {
          expr.push(plus);
          addCodeArg(expr, args[i]);
          expr.push(plus, safeStringify(strs[++i]));
        }
        optimize(expr);
        return new _Code(expr);
      }
      exports.str = str;
      function addCodeArg(code, arg) {
        if (arg instanceof _Code)
          code.push(...arg._items);
        else if (arg instanceof Name)
          code.push(arg);
        else
          code.push(interpolate(arg));
      }
      exports.addCodeArg = addCodeArg;
      function optimize(expr) {
        let i = 1;
        while (i < expr.length - 1) {
          if (expr[i] === plus) {
            const res = mergeExprItems(expr[i - 1], expr[i + 1]);
            if (res !== void 0) {
              expr.splice(i - 1, 3, res);
              continue;
            }
            expr[i++] = "+";
          }
          i++;
        }
      }
      function mergeExprItems(a, b) {
        if (b === '""')
          return a;
        if (a === '""')
          return b;
        if (typeof a == "string") {
          if (b instanceof Name || a[a.length - 1] !== '"')
            return;
          if (typeof b != "string")
            return `${a.slice(0, -1)}${b}"`;
          if (b[0] === '"')
            return a.slice(0, -1) + b.slice(1);
          return;
        }
        if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
          return `"${a}${b.slice(1)}`;
        return;
      }
      function strConcat(c1, c2) {
        return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
      }
      exports.strConcat = strConcat;
      function interpolate(x) {
        return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
      }
      function stringify(x) {
        return new _Code(safeStringify(x));
      }
      exports.stringify = stringify;
      function safeStringify(x) {
        return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
      }
      exports.safeStringify = safeStringify;
      function getProperty(key) {
        return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
      }
      exports.getProperty = getProperty;
      function getEsmExportName(key) {
        if (typeof key == "string" && exports.IDENTIFIER.test(key)) {
          return new _Code(`${key}`);
        }
        throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
      }
      exports.getEsmExportName = getEsmExportName;
      function regexpCode(rx) {
        return new _Code(rx.toString());
      }
      exports.regexpCode = regexpCode;
    }
  });

  // node_modules/ajv/dist/compile/codegen/scope.js
  var require_scope = __commonJS({
    "node_modules/ajv/dist/compile/codegen/scope.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
      var code_1 = require_code();
      var ValueError = class extends Error {
        constructor(name2) {
          super(`CodeGen: "code" for ${name2} not defined`);
          this.value = name2.value;
        }
      };
      var UsedValueState;
      (function(UsedValueState2) {
        UsedValueState2[UsedValueState2["Started"] = 0] = "Started";
        UsedValueState2[UsedValueState2["Completed"] = 1] = "Completed";
      })(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
      exports.varKinds = {
        const: new code_1.Name("const"),
        let: new code_1.Name("let"),
        var: new code_1.Name("var")
      };
      var Scope = class {
        constructor({ prefixes, parent } = {}) {
          this._names = {};
          this._prefixes = prefixes;
          this._parent = parent;
        }
        toName(nameOrPrefix) {
          return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
        }
        name(prefix) {
          return new code_1.Name(this._newName(prefix));
        }
        _newName(prefix) {
          const ng = this._names[prefix] || this._nameGroup(prefix);
          return `${prefix}${ng.index++}`;
        }
        _nameGroup(prefix) {
          var _a, _b;
          if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) {
            throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
          }
          return this._names[prefix] = { prefix, index: 0 };
        }
      };
      exports.Scope = Scope;
      var ValueScopeName = class extends code_1.Name {
        constructor(prefix, nameStr) {
          super(nameStr);
          this.prefix = prefix;
        }
        setValue(value, { property, itemIndex }) {
          this.value = value;
          this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
        }
      };
      exports.ValueScopeName = ValueScopeName;
      var line = (0, code_1._)`\n`;
      var ValueScope = class extends Scope {
        constructor(opts) {
          super(opts);
          this._values = {};
          this._scope = opts.scope;
          this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
        }
        get() {
          return this._scope;
        }
        name(prefix) {
          return new ValueScopeName(prefix, this._newName(prefix));
        }
        value(nameOrPrefix, value) {
          var _a;
          if (value.ref === void 0)
            throw new Error("CodeGen: ref must be passed in value");
          const name2 = this.toName(nameOrPrefix);
          const { prefix } = name2;
          const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
          let vs = this._values[prefix];
          if (vs) {
            const _name = vs.get(valueKey);
            if (_name)
              return _name;
          } else {
            vs = this._values[prefix] = /* @__PURE__ */ new Map();
          }
          vs.set(valueKey, name2);
          const s = this._scope[prefix] || (this._scope[prefix] = []);
          const itemIndex = s.length;
          s[itemIndex] = value.ref;
          name2.setValue(value, { property: prefix, itemIndex });
          return name2;
        }
        getValue(prefix, keyOrRef) {
          const vs = this._values[prefix];
          if (!vs)
            return;
          return vs.get(keyOrRef);
        }
        scopeRefs(scopeName, values = this._values) {
          return this._reduceValues(values, (name2) => {
            if (name2.scopePath === void 0)
              throw new Error(`CodeGen: name "${name2}" has no value`);
            return (0, code_1._)`${scopeName}${name2.scopePath}`;
          });
        }
        scopeCode(values = this._values, usedValues, getCode) {
          return this._reduceValues(values, (name2) => {
            if (name2.value === void 0)
              throw new Error(`CodeGen: name "${name2}" has no value`);
            return name2.value.code;
          }, usedValues, getCode);
        }
        _reduceValues(values, valueCode, usedValues = {}, getCode) {
          let code = code_1.nil;
          for (const prefix in values) {
            const vs = values[prefix];
            if (!vs)
              continue;
            const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
            vs.forEach((name2) => {
              if (nameSet.has(name2))
                return;
              nameSet.set(name2, UsedValueState.Started);
              let c = valueCode(name2);
              if (c) {
                const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
                code = (0, code_1._)`${code}${def} ${name2} = ${c};${this.opts._n}`;
              } else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name2)) {
                code = (0, code_1._)`${code}${c}${this.opts._n}`;
              } else {
                throw new ValueError(name2);
              }
              nameSet.set(name2, UsedValueState.Completed);
            });
          }
          return code;
        }
      };
      exports.ValueScope = ValueScope;
    }
  });

  // node_modules/ajv/dist/compile/codegen/index.js
  var require_codegen = __commonJS({
    "node_modules/ajv/dist/compile/codegen/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
      var code_1 = require_code();
      var scope_1 = require_scope();
      var code_2 = require_code();
      Object.defineProperty(exports, "_", { enumerable: true, get: function() {
        return code_2._;
      } });
      Object.defineProperty(exports, "str", { enumerable: true, get: function() {
        return code_2.str;
      } });
      Object.defineProperty(exports, "strConcat", { enumerable: true, get: function() {
        return code_2.strConcat;
      } });
      Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
        return code_2.nil;
      } });
      Object.defineProperty(exports, "getProperty", { enumerable: true, get: function() {
        return code_2.getProperty;
      } });
      Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
        return code_2.stringify;
      } });
      Object.defineProperty(exports, "regexpCode", { enumerable: true, get: function() {
        return code_2.regexpCode;
      } });
      Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
        return code_2.Name;
      } });
      var scope_2 = require_scope();
      Object.defineProperty(exports, "Scope", { enumerable: true, get: function() {
        return scope_2.Scope;
      } });
      Object.defineProperty(exports, "ValueScope", { enumerable: true, get: function() {
        return scope_2.ValueScope;
      } });
      Object.defineProperty(exports, "ValueScopeName", { enumerable: true, get: function() {
        return scope_2.ValueScopeName;
      } });
      Object.defineProperty(exports, "varKinds", { enumerable: true, get: function() {
        return scope_2.varKinds;
      } });
      exports.operators = {
        GT: new code_1._Code(">"),
        GTE: new code_1._Code(">="),
        LT: new code_1._Code("<"),
        LTE: new code_1._Code("<="),
        EQ: new code_1._Code("==="),
        NEQ: new code_1._Code("!=="),
        NOT: new code_1._Code("!"),
        OR: new code_1._Code("||"),
        AND: new code_1._Code("&&"),
        ADD: new code_1._Code("+")
      };
      var Node = class {
        optimizeNodes() {
          return this;
        }
        optimizeNames(_names, _constants) {
          return this;
        }
      };
      var Def = class extends Node {
        constructor(varKind, name2, rhs) {
          super();
          this.varKind = varKind;
          this.name = name2;
          this.rhs = rhs;
        }
        render({ es5, _n }) {
          const varKind = es5 ? scope_1.varKinds.var : this.varKind;
          const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
          return `${varKind} ${this.name}${rhs};` + _n;
        }
        optimizeNames(names, constants) {
          if (!names[this.name.str])
            return;
          if (this.rhs)
            this.rhs = optimizeExpr(this.rhs, names, constants);
          return this;
        }
        get names() {
          return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
        }
      };
      var Assign = class extends Node {
        constructor(lhs, rhs, sideEffects) {
          super();
          this.lhs = lhs;
          this.rhs = rhs;
          this.sideEffects = sideEffects;
        }
        render({ _n }) {
          return `${this.lhs} = ${this.rhs};` + _n;
        }
        optimizeNames(names, constants) {
          if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
            return;
          this.rhs = optimizeExpr(this.rhs, names, constants);
          return this;
        }
        get names() {
          const names = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
          return addExprNames(names, this.rhs);
        }
      };
      var AssignOp = class extends Assign {
        constructor(lhs, op, rhs, sideEffects) {
          super(lhs, rhs, sideEffects);
          this.op = op;
        }
        render({ _n }) {
          return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
        }
      };
      var Label = class extends Node {
        constructor(label) {
          super();
          this.label = label;
          this.names = {};
        }
        render({ _n }) {
          return `${this.label}:` + _n;
        }
      };
      var Break = class extends Node {
        constructor(label) {
          super();
          this.label = label;
          this.names = {};
        }
        render({ _n }) {
          const label = this.label ? ` ${this.label}` : "";
          return `break${label};` + _n;
        }
      };
      var Throw = class extends Node {
        constructor(error) {
          super();
          this.error = error;
        }
        render({ _n }) {
          return `throw ${this.error};` + _n;
        }
        get names() {
          return this.error.names;
        }
      };
      var AnyCode = class extends Node {
        constructor(code) {
          super();
          this.code = code;
        }
        render({ _n }) {
          return `${this.code};` + _n;
        }
        optimizeNodes() {
          return `${this.code}` ? this : void 0;
        }
        optimizeNames(names, constants) {
          this.code = optimizeExpr(this.code, names, constants);
          return this;
        }
        get names() {
          return this.code instanceof code_1._CodeOrName ? this.code.names : {};
        }
      };
      var ParentNode = class extends Node {
        constructor(nodes = []) {
          super();
          this.nodes = nodes;
        }
        render(opts) {
          return this.nodes.reduce((code, n) => code + n.render(opts), "");
        }
        optimizeNodes() {
          const { nodes } = this;
          let i = nodes.length;
          while (i--) {
            const n = nodes[i].optimizeNodes();
            if (Array.isArray(n))
              nodes.splice(i, 1, ...n);
            else if (n)
              nodes[i] = n;
            else
              nodes.splice(i, 1);
          }
          return nodes.length > 0 ? this : void 0;
        }
        optimizeNames(names, constants) {
          const { nodes } = this;
          let i = nodes.length;
          while (i--) {
            const n = nodes[i];
            if (n.optimizeNames(names, constants))
              continue;
            subtractNames(names, n.names);
            nodes.splice(i, 1);
          }
          return nodes.length > 0 ? this : void 0;
        }
        get names() {
          return this.nodes.reduce((names, n) => addNames(names, n.names), {});
        }
      };
      var BlockNode = class extends ParentNode {
        render(opts) {
          return "{" + opts._n + super.render(opts) + "}" + opts._n;
        }
      };
      var Root = class extends ParentNode {
      };
      var Else = class extends BlockNode {
      };
      Else.kind = "else";
      var If = class _If extends BlockNode {
        constructor(condition, nodes) {
          super(nodes);
          this.condition = condition;
        }
        render(opts) {
          let code = `if(${this.condition})` + super.render(opts);
          if (this.else)
            code += "else " + this.else.render(opts);
          return code;
        }
        optimizeNodes() {
          super.optimizeNodes();
          const cond = this.condition;
          if (cond === true)
            return this.nodes;
          let e = this.else;
          if (e) {
            const ns = e.optimizeNodes();
            e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
          }
          if (e) {
            if (cond === false)
              return e instanceof _If ? e : e.nodes;
            if (this.nodes.length)
              return this;
            return new _If(not(cond), e instanceof _If ? [e] : e.nodes);
          }
          if (cond === false || !this.nodes.length)
            return void 0;
          return this;
        }
        optimizeNames(names, constants) {
          var _a;
          this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
          if (!(super.optimizeNames(names, constants) || this.else))
            return;
          this.condition = optimizeExpr(this.condition, names, constants);
          return this;
        }
        get names() {
          const names = super.names;
          addExprNames(names, this.condition);
          if (this.else)
            addNames(names, this.else.names);
          return names;
        }
      };
      If.kind = "if";
      var For = class extends BlockNode {
      };
      For.kind = "for";
      var ForLoop = class extends For {
        constructor(iteration) {
          super();
          this.iteration = iteration;
        }
        render(opts) {
          return `for(${this.iteration})` + super.render(opts);
        }
        optimizeNames(names, constants) {
          if (!super.optimizeNames(names, constants))
            return;
          this.iteration = optimizeExpr(this.iteration, names, constants);
          return this;
        }
        get names() {
          return addNames(super.names, this.iteration.names);
        }
      };
      var ForRange = class extends For {
        constructor(varKind, name2, from, to) {
          super();
          this.varKind = varKind;
          this.name = name2;
          this.from = from;
          this.to = to;
        }
        render(opts) {
          const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
          const { name: name2, from, to } = this;
          return `for(${varKind} ${name2}=${from}; ${name2}<${to}; ${name2}++)` + super.render(opts);
        }
        get names() {
          const names = addExprNames(super.names, this.from);
          return addExprNames(names, this.to);
        }
      };
      var ForIter = class extends For {
        constructor(loop, varKind, name2, iterable) {
          super();
          this.loop = loop;
          this.varKind = varKind;
          this.name = name2;
          this.iterable = iterable;
        }
        render(opts) {
          return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
        }
        optimizeNames(names, constants) {
          if (!super.optimizeNames(names, constants))
            return;
          this.iterable = optimizeExpr(this.iterable, names, constants);
          return this;
        }
        get names() {
          return addNames(super.names, this.iterable.names);
        }
      };
      var Func = class extends BlockNode {
        constructor(name2, args, async) {
          super();
          this.name = name2;
          this.args = args;
          this.async = async;
        }
        render(opts) {
          const _async = this.async ? "async " : "";
          return `${_async}function ${this.name}(${this.args})` + super.render(opts);
        }
      };
      Func.kind = "func";
      var Return = class extends ParentNode {
        render(opts) {
          return "return " + super.render(opts);
        }
      };
      Return.kind = "return";
      var Try = class extends BlockNode {
        render(opts) {
          let code = "try" + super.render(opts);
          if (this.catch)
            code += this.catch.render(opts);
          if (this.finally)
            code += this.finally.render(opts);
          return code;
        }
        optimizeNodes() {
          var _a, _b;
          super.optimizeNodes();
          (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNodes();
          (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
          return this;
        }
        optimizeNames(names, constants) {
          var _a, _b;
          super.optimizeNames(names, constants);
          (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
          (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names, constants);
          return this;
        }
        get names() {
          const names = super.names;
          if (this.catch)
            addNames(names, this.catch.names);
          if (this.finally)
            addNames(names, this.finally.names);
          return names;
        }
      };
      var Catch = class extends BlockNode {
        constructor(error) {
          super();
          this.error = error;
        }
        render(opts) {
          return `catch(${this.error})` + super.render(opts);
        }
      };
      Catch.kind = "catch";
      var Finally = class extends BlockNode {
        render(opts) {
          return "finally" + super.render(opts);
        }
      };
      Finally.kind = "finally";
      var CodeGen = class {
        constructor(extScope, opts = {}) {
          this._values = {};
          this._blockStarts = [];
          this._constants = {};
          this.opts = { ...opts, _n: opts.lines ? "\n" : "" };
          this._extScope = extScope;
          this._scope = new scope_1.Scope({ parent: extScope });
          this._nodes = [new Root()];
        }
        toString() {
          return this._root.render(this.opts);
        }
        // returns unique name in the internal scope
        name(prefix) {
          return this._scope.name(prefix);
        }
        // reserves unique name in the external scope
        scopeName(prefix) {
          return this._extScope.name(prefix);
        }
        // reserves unique name in the external scope and assigns value to it
        scopeValue(prefixOrName, value) {
          const name2 = this._extScope.value(prefixOrName, value);
          const vs = this._values[name2.prefix] || (this._values[name2.prefix] = /* @__PURE__ */ new Set());
          vs.add(name2);
          return name2;
        }
        getScopeValue(prefix, keyOrRef) {
          return this._extScope.getValue(prefix, keyOrRef);
        }
        // return code that assigns values in the external scope to the names that are used internally
        // (same names that were returned by gen.scopeName or gen.scopeValue)
        scopeRefs(scopeName) {
          return this._extScope.scopeRefs(scopeName, this._values);
        }
        scopeCode() {
          return this._extScope.scopeCode(this._values);
        }
        _def(varKind, nameOrPrefix, rhs, constant) {
          const name2 = this._scope.toName(nameOrPrefix);
          if (rhs !== void 0 && constant)
            this._constants[name2.str] = rhs;
          this._leafNode(new Def(varKind, name2, rhs));
          return name2;
        }
        // `const` declaration (`var` in es5 mode)
        const(nameOrPrefix, rhs, _constant) {
          return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
        }
        // `let` declaration with optional assignment (`var` in es5 mode)
        let(nameOrPrefix, rhs, _constant) {
          return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
        }
        // `var` declaration with optional assignment
        var(nameOrPrefix, rhs, _constant) {
          return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
        }
        // assignment code
        assign(lhs, rhs, sideEffects) {
          return this._leafNode(new Assign(lhs, rhs, sideEffects));
        }
        // `+=` code
        add(lhs, rhs) {
          return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
        }
        // appends passed SafeExpr to code or executes Block
        code(c) {
          if (typeof c == "function")
            c();
          else if (c !== code_1.nil)
            this._leafNode(new AnyCode(c));
          return this;
        }
        // returns code for object literal for the passed argument list of key-value pairs
        object(...keyValues) {
          const code = ["{"];
          for (const [key, value] of keyValues) {
            if (code.length > 1)
              code.push(",");
            code.push(key);
            if (key !== value || this.opts.es5) {
              code.push(":");
              (0, code_1.addCodeArg)(code, value);
            }
          }
          code.push("}");
          return new code_1._Code(code);
        }
        // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
        if(condition, thenBody, elseBody) {
          this._blockNode(new If(condition));
          if (thenBody && elseBody) {
            this.code(thenBody).else().code(elseBody).endIf();
          } else if (thenBody) {
            this.code(thenBody).endIf();
          } else if (elseBody) {
            throw new Error('CodeGen: "else" body without "then" body');
          }
          return this;
        }
        // `else if` clause - invalid without `if` or after `else` clauses
        elseIf(condition) {
          return this._elseNode(new If(condition));
        }
        // `else` clause - only valid after `if` or `else if` clauses
        else() {
          return this._elseNode(new Else());
        }
        // end `if` statement (needed if gen.if was used only with condition)
        endIf() {
          return this._endBlockNode(If, Else);
        }
        _for(node, forBody) {
          this._blockNode(node);
          if (forBody)
            this.code(forBody).endFor();
          return this;
        }
        // a generic `for` clause (or statement if `forBody` is passed)
        for(iteration, forBody) {
          return this._for(new ForLoop(iteration), forBody);
        }
        // `for` statement for a range of values
        forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
          const name2 = this._scope.toName(nameOrPrefix);
          return this._for(new ForRange(varKind, name2, from, to), () => forBody(name2));
        }
        // `for-of` statement (in es5 mode replace with a normal for loop)
        forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
          const name2 = this._scope.toName(nameOrPrefix);
          if (this.opts.es5) {
            const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
            return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
              this.var(name2, (0, code_1._)`${arr}[${i}]`);
              forBody(name2);
            });
          }
          return this._for(new ForIter("of", varKind, name2, iterable), () => forBody(name2));
        }
        // `for-in` statement.
        // With option `ownProperties` replaced with a `for-of` loop for object keys
        forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
          if (this.opts.ownProperties) {
            return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
          }
          const name2 = this._scope.toName(nameOrPrefix);
          return this._for(new ForIter("in", varKind, name2, obj), () => forBody(name2));
        }
        // end `for` loop
        endFor() {
          return this._endBlockNode(For);
        }
        // `label` statement
        label(label) {
          return this._leafNode(new Label(label));
        }
        // `break` statement
        break(label) {
          return this._leafNode(new Break(label));
        }
        // `return` statement
        return(value) {
          const node = new Return();
          this._blockNode(node);
          this.code(value);
          if (node.nodes.length !== 1)
            throw new Error('CodeGen: "return" should have one node');
          return this._endBlockNode(Return);
        }
        // `try` statement
        try(tryBody, catchCode, finallyCode) {
          if (!catchCode && !finallyCode)
            throw new Error('CodeGen: "try" without "catch" and "finally"');
          const node = new Try();
          this._blockNode(node);
          this.code(tryBody);
          if (catchCode) {
            const error = this.name("e");
            this._currNode = node.catch = new Catch(error);
            catchCode(error);
          }
          if (finallyCode) {
            this._currNode = node.finally = new Finally();
            this.code(finallyCode);
          }
          return this._endBlockNode(Catch, Finally);
        }
        // `throw` statement
        throw(error) {
          return this._leafNode(new Throw(error));
        }
        // start self-balancing block
        block(body, nodeCount) {
          this._blockStarts.push(this._nodes.length);
          if (body)
            this.code(body).endBlock(nodeCount);
          return this;
        }
        // end the current self-balancing block
        endBlock(nodeCount) {
          const len = this._blockStarts.pop();
          if (len === void 0)
            throw new Error("CodeGen: not in self-balancing block");
          const toClose = this._nodes.length - len;
          if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) {
            throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
          }
          this._nodes.length = len;
          return this;
        }
        // `function` heading (or definition if funcBody is passed)
        func(name2, args = code_1.nil, async, funcBody) {
          this._blockNode(new Func(name2, args, async));
          if (funcBody)
            this.code(funcBody).endFunc();
          return this;
        }
        // end function definition
        endFunc() {
          return this._endBlockNode(Func);
        }
        optimize(n = 1) {
          while (n-- > 0) {
            this._root.optimizeNodes();
            this._root.optimizeNames(this._root.names, this._constants);
          }
        }
        _leafNode(node) {
          this._currNode.nodes.push(node);
          return this;
        }
        _blockNode(node) {
          this._currNode.nodes.push(node);
          this._nodes.push(node);
        }
        _endBlockNode(N1, N2) {
          const n = this._currNode;
          if (n instanceof N1 || N2 && n instanceof N2) {
            this._nodes.pop();
            return this;
          }
          throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
        }
        _elseNode(node) {
          const n = this._currNode;
          if (!(n instanceof If)) {
            throw new Error('CodeGen: "else" without "if"');
          }
          this._currNode = n.else = node;
          return this;
        }
        get _root() {
          return this._nodes[0];
        }
        get _currNode() {
          const ns = this._nodes;
          return ns[ns.length - 1];
        }
        set _currNode(node) {
          const ns = this._nodes;
          ns[ns.length - 1] = node;
        }
      };
      exports.CodeGen = CodeGen;
      function addNames(names, from) {
        for (const n in from)
          names[n] = (names[n] || 0) + (from[n] || 0);
        return names;
      }
      function addExprNames(names, from) {
        return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
      }
      function optimizeExpr(expr, names, constants) {
        if (expr instanceof code_1.Name)
          return replaceName(expr);
        if (!canOptimize(expr))
          return expr;
        return new code_1._Code(expr._items.reduce((items, c) => {
          if (c instanceof code_1.Name)
            c = replaceName(c);
          if (c instanceof code_1._Code)
            items.push(...c._items);
          else
            items.push(c);
          return items;
        }, []));
        function replaceName(n) {
          const c = constants[n.str];
          if (c === void 0 || names[n.str] !== 1)
            return n;
          delete names[n.str];
          return c;
        }
        function canOptimize(e) {
          return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
        }
      }
      function subtractNames(names, from) {
        for (const n in from)
          names[n] = (names[n] || 0) - (from[n] || 0);
      }
      function not(x) {
        return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
      }
      exports.not = not;
      var andCode = mappend(exports.operators.AND);
      function and(...args) {
        return args.reduce(andCode);
      }
      exports.and = and;
      var orCode = mappend(exports.operators.OR);
      function or(...args) {
        return args.reduce(orCode);
      }
      exports.or = or;
      function mappend(op) {
        return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
      }
      function par(x) {
        return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
      }
    }
  });

  // node_modules/ajv/dist/compile/util.js
  var require_util2 = __commonJS({
    "node_modules/ajv/dist/compile/util.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
      var codegen_1 = require_codegen();
      var code_1 = require_code();
      function toHash(arr) {
        const hash = {};
        for (const item of arr)
          hash[item] = true;
        return hash;
      }
      exports.toHash = toHash;
      function alwaysValidSchema(it, schema2) {
        if (typeof schema2 == "boolean")
          return schema2;
        if (Object.keys(schema2).length === 0)
          return true;
        checkUnknownRules(it, schema2);
        return !schemaHasRules(schema2, it.self.RULES.all);
      }
      exports.alwaysValidSchema = alwaysValidSchema;
      function checkUnknownRules(it, schema2 = it.schema) {
        const { opts, self } = it;
        if (!opts.strictSchema)
          return;
        if (typeof schema2 === "boolean")
          return;
        const rules = self.RULES.keywords;
        for (const key in schema2) {
          if (!rules[key])
            checkStrictMode(it, `unknown keyword: "${key}"`);
        }
      }
      exports.checkUnknownRules = checkUnknownRules;
      function schemaHasRules(schema2, rules) {
        if (typeof schema2 == "boolean")
          return !schema2;
        for (const key in schema2)
          if (rules[key])
            return true;
        return false;
      }
      exports.schemaHasRules = schemaHasRules;
      function schemaHasRulesButRef(schema2, RULES) {
        if (typeof schema2 == "boolean")
          return !schema2;
        for (const key in schema2)
          if (key !== "$ref" && RULES.all[key])
            return true;
        return false;
      }
      exports.schemaHasRulesButRef = schemaHasRulesButRef;
      function schemaRefOrVal({ topSchemaRef, schemaPath }, schema2, keyword, $data) {
        if (!$data) {
          if (typeof schema2 == "number" || typeof schema2 == "boolean")
            return schema2;
          if (typeof schema2 == "string")
            return (0, codegen_1._)`${schema2}`;
        }
        return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
      }
      exports.schemaRefOrVal = schemaRefOrVal;
      function unescapeFragment(str) {
        return unescapeJsonPointer(decodeURIComponent(str));
      }
      exports.unescapeFragment = unescapeFragment;
      function escapeFragment(str) {
        return encodeURIComponent(escapeJsonPointer(str));
      }
      exports.escapeFragment = escapeFragment;
      function escapeJsonPointer(str) {
        if (typeof str == "number")
          return `${str}`;
        return str.replace(/~/g, "~0").replace(/\//g, "~1");
      }
      exports.escapeJsonPointer = escapeJsonPointer;
      function unescapeJsonPointer(str) {
        return str.replace(/~1/g, "/").replace(/~0/g, "~");
      }
      exports.unescapeJsonPointer = unescapeJsonPointer;
      function eachItem(xs, f) {
        if (Array.isArray(xs)) {
          for (const x of xs)
            f(x);
        } else {
          f(xs);
        }
      }
      exports.eachItem = eachItem;
      function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
        return (gen, from, to, toName) => {
          const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
          return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
        };
      }
      exports.mergeEvaluated = {
        props: makeMergeEvaluated({
          mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
            gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
          }),
          mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
            if (from === true) {
              gen.assign(to, true);
            } else {
              gen.assign(to, (0, codegen_1._)`${to} || {}`);
              setEvaluated(gen, to, from);
            }
          }),
          mergeValues: (from, to) => from === true ? true : { ...from, ...to },
          resultToName: evaluatedPropsToName
        }),
        items: makeMergeEvaluated({
          mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
          mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
          mergeValues: (from, to) => from === true ? true : Math.max(from, to),
          resultToName: (gen, items) => gen.var("items", items)
        })
      };
      function evaluatedPropsToName(gen, ps) {
        if (ps === true)
          return gen.var("props", true);
        const props = gen.var("props", (0, codegen_1._)`{}`);
        if (ps !== void 0)
          setEvaluated(gen, props, ps);
        return props;
      }
      exports.evaluatedPropsToName = evaluatedPropsToName;
      function setEvaluated(gen, props, ps) {
        Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
      }
      exports.setEvaluated = setEvaluated;
      var snippets = {};
      function useFunc(gen, f) {
        return gen.scopeValue("func", {
          ref: f,
          code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
        });
      }
      exports.useFunc = useFunc;
      var Type;
      (function(Type2) {
        Type2[Type2["Num"] = 0] = "Num";
        Type2[Type2["Str"] = 1] = "Str";
      })(Type || (exports.Type = Type = {}));
      function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
        if (dataProp instanceof codegen_1.Name) {
          const isNumber = dataPropType === Type.Num;
          return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
        }
        return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
      }
      exports.getErrorPath = getErrorPath;
      function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
        if (!mode)
          return;
        msg = `strict mode: ${msg}`;
        if (mode === true)
          throw new Error(msg);
        it.self.logger.warn(msg);
      }
      exports.checkStrictMode = checkStrictMode;
    }
  });

  // node_modules/ajv/dist/compile/names.js
  var require_names = __commonJS({
    "node_modules/ajv/dist/compile/names.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var names = {
        // validation function arguments
        data: new codegen_1.Name("data"),
        // data passed to validation function
        // args passed from referencing schema
        valCxt: new codegen_1.Name("valCxt"),
        // validation/data context - should not be used directly, it is destructured to the names below
        instancePath: new codegen_1.Name("instancePath"),
        parentData: new codegen_1.Name("parentData"),
        parentDataProperty: new codegen_1.Name("parentDataProperty"),
        rootData: new codegen_1.Name("rootData"),
        // root data - same as the data passed to the first/top validation function
        dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
        // used to support recursiveRef and dynamicRef
        // function scoped variables
        vErrors: new codegen_1.Name("vErrors"),
        // null or array of validation errors
        errors: new codegen_1.Name("errors"),
        // counter of validation errors
        this: new codegen_1.Name("this"),
        // "globals"
        self: new codegen_1.Name("self"),
        scope: new codegen_1.Name("scope"),
        // JTD serialize/parse name for JSON string and position
        json: new codegen_1.Name("json"),
        jsonPos: new codegen_1.Name("jsonPos"),
        jsonLen: new codegen_1.Name("jsonLen"),
        jsonPart: new codegen_1.Name("jsonPart")
      };
      exports.default = names;
    }
  });

  // node_modules/ajv/dist/compile/errors.js
  var require_errors = __commonJS({
    "node_modules/ajv/dist/compile/errors.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      var names_1 = require_names();
      exports.keywordError = {
        message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation`
      };
      exports.keyword$DataError = {
        message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`
      };
      function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
        const { it } = cxt;
        const { gen, compositeRule, allErrors } = it;
        const errObj = errorObjectCode(cxt, error, errorPaths);
        if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) {
          addError(gen, errObj);
        } else {
          returnErrors(it, (0, codegen_1._)`[${errObj}]`);
        }
      }
      exports.reportError = reportError;
      function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
        const { it } = cxt;
        const { gen, compositeRule, allErrors } = it;
        const errObj = errorObjectCode(cxt, error, errorPaths);
        addError(gen, errObj);
        if (!(compositeRule || allErrors)) {
          returnErrors(it, names_1.default.vErrors);
        }
      }
      exports.reportExtraError = reportExtraError;
      function resetErrorsCount(gen, errsCount) {
        gen.assign(names_1.default.errors, errsCount);
        gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
      }
      exports.resetErrorsCount = resetErrorsCount;
      function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
        if (errsCount === void 0)
          throw new Error("ajv implementation error");
        const err = gen.name("err");
        gen.forRange("i", errsCount, names_1.default.errors, (i) => {
          gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
          gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
          gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
          if (it.opts.verbose) {
            gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
            gen.assign((0, codegen_1._)`${err}.data`, data);
          }
        });
      }
      exports.extendErrors = extendErrors;
      function addError(gen, errObj) {
        const err = gen.const("err", errObj);
        gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
        gen.code((0, codegen_1._)`${names_1.default.errors}++`);
      }
      function returnErrors(it, errs) {
        const { gen, validateName, schemaEnv } = it;
        if (schemaEnv.$async) {
          gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
        } else {
          gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
          gen.return(false);
        }
      }
      var E = {
        keyword: new codegen_1.Name("keyword"),
        schemaPath: new codegen_1.Name("schemaPath"),
        // also used in JTD errors
        params: new codegen_1.Name("params"),
        propertyName: new codegen_1.Name("propertyName"),
        message: new codegen_1.Name("message"),
        schema: new codegen_1.Name("schema"),
        parentSchema: new codegen_1.Name("parentSchema")
      };
      function errorObjectCode(cxt, error, errorPaths) {
        const { createErrors } = cxt.it;
        if (createErrors === false)
          return (0, codegen_1._)`{}`;
        return errorObject(cxt, error, errorPaths);
      }
      function errorObject(cxt, error, errorPaths = {}) {
        const { gen, it } = cxt;
        const keyValues = [
          errorInstancePath(it, errorPaths),
          errorSchemaPath(cxt, errorPaths)
        ];
        extraErrorProps(cxt, error, keyValues);
        return gen.object(...keyValues);
      }
      function errorInstancePath({ errorPath }, { instancePath }) {
        const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
        return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
      }
      function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
        let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
        if (schemaPath) {
          schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
        }
        return [E.schemaPath, schPath];
      }
      function extraErrorProps(cxt, { params, message }, keyValues) {
        const { keyword, data, schemaValue, it } = cxt;
        const { opts, propertyName, topSchemaRef, schemaPath } = it;
        keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
        if (opts.messages) {
          keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
        }
        if (opts.verbose) {
          keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
        }
        if (propertyName)
          keyValues.push([E.propertyName, propertyName]);
      }
    }
  });

  // node_modules/ajv/dist/compile/validate/boolSchema.js
  var require_boolSchema = __commonJS({
    "node_modules/ajv/dist/compile/validate/boolSchema.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
      var errors_1 = require_errors();
      var codegen_1 = require_codegen();
      var names_1 = require_names();
      var boolError = {
        message: "boolean schema is false"
      };
      function topBoolOrEmptySchema(it) {
        const { gen, schema: schema2, validateName } = it;
        if (schema2 === false) {
          falseSchemaError(it, false);
        } else if (typeof schema2 == "object" && schema2.$async === true) {
          gen.return(names_1.default.data);
        } else {
          gen.assign((0, codegen_1._)`${validateName}.errors`, null);
          gen.return(true);
        }
      }
      exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
      function boolOrEmptySchema(it, valid) {
        const { gen, schema: schema2 } = it;
        if (schema2 === false) {
          gen.var(valid, false);
          falseSchemaError(it);
        } else {
          gen.var(valid, true);
        }
      }
      exports.boolOrEmptySchema = boolOrEmptySchema;
      function falseSchemaError(it, overrideAllErrors) {
        const { gen, data } = it;
        const cxt = {
          gen,
          keyword: "false schema",
          data,
          schema: false,
          schemaCode: false,
          schemaValue: false,
          params: {},
          it
        };
        (0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
      }
    }
  });

  // node_modules/ajv/dist/compile/rules.js
  var require_rules = __commonJS({
    "node_modules/ajv/dist/compile/rules.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getRules = exports.isJSONType = void 0;
      var _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
      var jsonTypes = new Set(_jsonTypes);
      function isJSONType(x) {
        return typeof x == "string" && jsonTypes.has(x);
      }
      exports.isJSONType = isJSONType;
      function getRules() {
        const groups = {
          number: { type: "number", rules: [] },
          string: { type: "string", rules: [] },
          array: { type: "array", rules: [] },
          object: { type: "object", rules: [] }
        };
        return {
          types: { ...groups, integer: true, boolean: true, null: true },
          rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
          post: { rules: [] },
          all: {},
          keywords: {}
        };
      }
      exports.getRules = getRules;
    }
  });

  // node_modules/ajv/dist/compile/validate/applicability.js
  var require_applicability = __commonJS({
    "node_modules/ajv/dist/compile/validate/applicability.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
      function schemaHasRulesForType({ schema: schema2, self }, type) {
        const group = self.RULES.types[type];
        return group && group !== true && shouldUseGroup(schema2, group);
      }
      exports.schemaHasRulesForType = schemaHasRulesForType;
      function shouldUseGroup(schema2, group) {
        return group.rules.some((rule) => shouldUseRule(schema2, rule));
      }
      exports.shouldUseGroup = shouldUseGroup;
      function shouldUseRule(schema2, rule) {
        var _a;
        return schema2[rule.keyword] !== void 0 || ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema2[kwd] !== void 0));
      }
      exports.shouldUseRule = shouldUseRule;
    }
  });

  // node_modules/ajv/dist/compile/validate/dataType.js
  var require_dataType = __commonJS({
    "node_modules/ajv/dist/compile/validate/dataType.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
      var rules_1 = require_rules();
      var applicability_1 = require_applicability();
      var errors_1 = require_errors();
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      var DataType;
      (function(DataType2) {
        DataType2[DataType2["Correct"] = 0] = "Correct";
        DataType2[DataType2["Wrong"] = 1] = "Wrong";
      })(DataType || (exports.DataType = DataType = {}));
      function getSchemaTypes(schema2) {
        const types = getJSONTypes(schema2.type);
        const hasNull = types.includes("null");
        if (hasNull) {
          if (schema2.nullable === false)
            throw new Error("type: null contradicts nullable: false");
        } else {
          if (!types.length && schema2.nullable !== void 0) {
            throw new Error('"nullable" cannot be used without "type"');
          }
          if (schema2.nullable === true)
            types.push("null");
        }
        return types;
      }
      exports.getSchemaTypes = getSchemaTypes;
      function getJSONTypes(ts) {
        const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
        if (types.every(rules_1.isJSONType))
          return types;
        throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
      }
      exports.getJSONTypes = getJSONTypes;
      function coerceAndCheckDataType(it, types) {
        const { gen, data, opts } = it;
        const coerceTo = coerceToTypes(types, opts.coerceTypes);
        const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
        if (checkTypes) {
          const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
          gen.if(wrongType, () => {
            if (coerceTo.length)
              coerceData(it, types, coerceTo);
            else
              reportTypeError(it);
          });
        }
        return checkTypes;
      }
      exports.coerceAndCheckDataType = coerceAndCheckDataType;
      var COERCIBLE = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
      function coerceToTypes(types, coerceTypes) {
        return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
      }
      function coerceData(it, types, coerceTo) {
        const { gen, data, opts } = it;
        const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
        const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
        if (opts.coerceTypes === "array") {
          gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
        }
        gen.if((0, codegen_1._)`${coerced} !== undefined`);
        for (const t of coerceTo) {
          if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") {
            coerceSpecificType(t);
          }
        }
        gen.else();
        reportTypeError(it);
        gen.endIf();
        gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
          gen.assign(data, coerced);
          assignParentData(it, coerced);
        });
        function coerceSpecificType(t) {
          switch (t) {
            case "string":
              gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
              return;
            case "number":
              gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
              return;
            case "integer":
              gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
              return;
            case "boolean":
              gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
              return;
            case "null":
              gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
              gen.assign(coerced, null);
              return;
            case "array":
              gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
          }
        }
      }
      function assignParentData({ gen, parentData, parentDataProperty }, expr) {
        gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
      }
      function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
        const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
        let cond;
        switch (dataType) {
          case "null":
            return (0, codegen_1._)`${data} ${EQ} null`;
          case "array":
            cond = (0, codegen_1._)`Array.isArray(${data})`;
            break;
          case "object":
            cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
            break;
          case "integer":
            cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
            break;
          case "number":
            cond = numCond();
            break;
          default:
            return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
        }
        return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
        function numCond(_cond = codegen_1.nil) {
          return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
        }
      }
      exports.checkDataType = checkDataType;
      function checkDataTypes(dataTypes, data, strictNums, correct) {
        if (dataTypes.length === 1) {
          return checkDataType(dataTypes[0], data, strictNums, correct);
        }
        let cond;
        const types = (0, util_1.toHash)(dataTypes);
        if (types.array && types.object) {
          const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
          cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
          delete types.null;
          delete types.array;
          delete types.object;
        } else {
          cond = codegen_1.nil;
        }
        if (types.number)
          delete types.integer;
        for (const t in types)
          cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
        return cond;
      }
      exports.checkDataTypes = checkDataTypes;
      var typeError = {
        message: ({ schema: schema2 }) => `must be ${schema2}`,
        params: ({ schema: schema2, schemaValue }) => typeof schema2 == "string" ? (0, codegen_1._)`{type: ${schema2}}` : (0, codegen_1._)`{type: ${schemaValue}}`
      };
      function reportTypeError(it) {
        const cxt = getTypeErrorContext(it);
        (0, errors_1.reportError)(cxt, typeError);
      }
      exports.reportTypeError = reportTypeError;
      function getTypeErrorContext(it) {
        const { gen, data, schema: schema2 } = it;
        const schemaCode = (0, util_1.schemaRefOrVal)(it, schema2, "type");
        return {
          gen,
          keyword: "type",
          data,
          schema: schema2.type,
          schemaCode,
          schemaValue: schemaCode,
          parentSchema: schema2,
          params: {},
          it
        };
      }
    }
  });

  // node_modules/ajv/dist/compile/validate/defaults.js
  var require_defaults = __commonJS({
    "node_modules/ajv/dist/compile/validate/defaults.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.assignDefaults = void 0;
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      function assignDefaults(it, ty) {
        const { properties, items } = it.schema;
        if (ty === "object" && properties) {
          for (const key in properties) {
            assignDefault(it, key, properties[key].default);
          }
        } else if (ty === "array" && Array.isArray(items)) {
          items.forEach((sch, i) => assignDefault(it, i, sch.default));
        }
      }
      exports.assignDefaults = assignDefaults;
      function assignDefault(it, prop, defaultValue) {
        const { gen, compositeRule, data, opts } = it;
        if (defaultValue === void 0)
          return;
        const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
        if (compositeRule) {
          (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
          return;
        }
        let condition = (0, codegen_1._)`${childData} === undefined`;
        if (opts.useDefaults === "empty") {
          condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
        }
        gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
      }
    }
  });

  // node_modules/ajv/dist/vocabularies/code.js
  var require_code2 = __commonJS({
    "node_modules/ajv/dist/vocabularies/code.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      var names_1 = require_names();
      var util_2 = require_util2();
      function checkReportMissingProp(cxt, prop) {
        const { gen, data, it } = cxt;
        gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
          cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
          cxt.error();
        });
      }
      exports.checkReportMissingProp = checkReportMissingProp;
      function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
        return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
      }
      exports.checkMissingProp = checkMissingProp;
      function reportMissingProp(cxt, missing) {
        cxt.setParams({ missingProperty: missing }, true);
        cxt.error();
      }
      exports.reportMissingProp = reportMissingProp;
      function hasPropFunc(gen) {
        return gen.scopeValue("func", {
          // eslint-disable-next-line @typescript-eslint/unbound-method
          ref: Object.prototype.hasOwnProperty,
          code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
        });
      }
      exports.hasPropFunc = hasPropFunc;
      function isOwnProperty(gen, data, property) {
        return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
      }
      exports.isOwnProperty = isOwnProperty;
      function propertyInData(gen, data, property, ownProperties) {
        const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
        return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
      }
      exports.propertyInData = propertyInData;
      function noPropertyInData(gen, data, property, ownProperties) {
        const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
        return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
      }
      exports.noPropertyInData = noPropertyInData;
      function allSchemaProperties(schemaMap) {
        return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
      }
      exports.allSchemaProperties = allSchemaProperties;
      function schemaProperties(it, schemaMap) {
        return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
      }
      exports.schemaProperties = schemaProperties;
      function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
        const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
        const valCxt = [
          [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
          [names_1.default.parentData, it.parentData],
          [names_1.default.parentDataProperty, it.parentDataProperty],
          [names_1.default.rootData, names_1.default.rootData]
        ];
        if (it.opts.dynamicRef)
          valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
        const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
        return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
      }
      exports.callValidateCode = callValidateCode;
      var newRegExp = (0, codegen_1._)`new RegExp`;
      function usePattern({ gen, it: { opts } }, pattern) {
        const u = opts.unicodeRegExp ? "u" : "";
        const { regExp } = opts.code;
        const rx = regExp(pattern, u);
        return gen.scopeValue("pattern", {
          key: rx.toString(),
          ref: rx,
          code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
        });
      }
      exports.usePattern = usePattern;
      function validateArray(cxt) {
        const { gen, data, keyword, it } = cxt;
        const valid = gen.name("valid");
        if (it.allErrors) {
          const validArr = gen.let("valid", true);
          validateItems(() => gen.assign(validArr, false));
          return validArr;
        }
        gen.var(valid, true);
        validateItems(() => gen.break());
        return valid;
        function validateItems(notValid) {
          const len = gen.const("len", (0, codegen_1._)`${data}.length`);
          gen.forRange("i", 0, len, (i) => {
            cxt.subschema({
              keyword,
              dataProp: i,
              dataPropType: util_1.Type.Num
            }, valid);
            gen.if((0, codegen_1.not)(valid), notValid);
          });
        }
      }
      exports.validateArray = validateArray;
      function validateUnion(cxt) {
        const { gen, schema: schema2, keyword, it } = cxt;
        if (!Array.isArray(schema2))
          throw new Error("ajv implementation error");
        const alwaysValid = schema2.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
        if (alwaysValid && !it.opts.unevaluated)
          return;
        const valid = gen.let("valid", false);
        const schValid = gen.name("_valid");
        gen.block(() => schema2.forEach((_sch, i) => {
          const schCxt = cxt.subschema({
            keyword,
            schemaProp: i,
            compositeRule: true
          }, schValid);
          gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
          const merged = cxt.mergeValidEvaluated(schCxt, schValid);
          if (!merged)
            gen.if((0, codegen_1.not)(valid));
        }));
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
      }
      exports.validateUnion = validateUnion;
    }
  });

  // node_modules/ajv/dist/compile/validate/keyword.js
  var require_keyword = __commonJS({
    "node_modules/ajv/dist/compile/validate/keyword.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
      var codegen_1 = require_codegen();
      var names_1 = require_names();
      var code_1 = require_code2();
      var errors_1 = require_errors();
      function macroKeywordCode(cxt, def) {
        const { gen, keyword, schema: schema2, parentSchema, it } = cxt;
        const macroSchema = def.macro.call(it.self, schema2, parentSchema, it);
        const schemaRef = useKeyword(gen, keyword, macroSchema);
        if (it.opts.validateSchema !== false)
          it.self.validateSchema(macroSchema, true);
        const valid = gen.name("valid");
        cxt.subschema({
          schema: macroSchema,
          schemaPath: codegen_1.nil,
          errSchemaPath: `${it.errSchemaPath}/${keyword}`,
          topSchemaRef: schemaRef,
          compositeRule: true
        }, valid);
        cxt.pass(valid, () => cxt.error(true));
      }
      exports.macroKeywordCode = macroKeywordCode;
      function funcKeywordCode(cxt, def) {
        var _a;
        const { gen, keyword, schema: schema2, parentSchema, $data, it } = cxt;
        checkAsyncKeyword(it, def);
        const validate = !$data && def.compile ? def.compile.call(it.self, schema2, parentSchema, it) : def.validate;
        const validateRef = useKeyword(gen, keyword, validate);
        const valid = gen.let("valid");
        cxt.block$data(valid, validateKeyword);
        cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
        function validateKeyword() {
          if (def.errors === false) {
            assignValid();
            if (def.modifying)
              modifyData(cxt);
            reportErrs(() => cxt.error());
          } else {
            const ruleErrs = def.async ? validateAsync() : validateSync();
            if (def.modifying)
              modifyData(cxt);
            reportErrs(() => addErrs(cxt, ruleErrs));
          }
        }
        function validateAsync() {
          const ruleErrs = gen.let("ruleErrs", null);
          gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
          return ruleErrs;
        }
        function validateSync() {
          const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
          gen.assign(validateErrs, null);
          assignValid(codegen_1.nil);
          return validateErrs;
        }
        function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
          const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
          const passSchema = !("compile" in def && !$data || def.schema === false);
          gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
        }
        function reportErrs(errors) {
          var _a2;
          gen.if((0, codegen_1.not)((_a2 = def.valid) !== null && _a2 !== void 0 ? _a2 : valid), errors);
        }
      }
      exports.funcKeywordCode = funcKeywordCode;
      function modifyData(cxt) {
        const { gen, data, it } = cxt;
        gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
      }
      function addErrs(cxt, errs) {
        const { gen } = cxt;
        gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
          gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
          (0, errors_1.extendErrors)(cxt);
        }, () => cxt.error());
      }
      function checkAsyncKeyword({ schemaEnv }, def) {
        if (def.async && !schemaEnv.$async)
          throw new Error("async keyword in sync schema");
      }
      function useKeyword(gen, keyword, result) {
        if (result === void 0)
          throw new Error(`keyword "${keyword}" failed to compile`);
        return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
      }
      function validSchemaType(schema2, schemaType, allowUndefined = false) {
        return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema2) : st === "object" ? schema2 && typeof schema2 == "object" && !Array.isArray(schema2) : typeof schema2 == st || allowUndefined && typeof schema2 == "undefined");
      }
      exports.validSchemaType = validSchemaType;
      function validateKeywordUsage({ schema: schema2, opts, self, errSchemaPath }, def, keyword) {
        if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
          throw new Error("ajv implementation error");
        }
        const deps = def.dependencies;
        if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema2, kwd))) {
          throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
        }
        if (def.validateSchema) {
          const valid = def.validateSchema(schema2[keyword]);
          if (!valid) {
            const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
            if (opts.validateSchema === "log")
              self.logger.error(msg);
            else
              throw new Error(msg);
          }
        }
      }
      exports.validateKeywordUsage = validateKeywordUsage;
    }
  });

  // node_modules/ajv/dist/compile/validate/subschema.js
  var require_subschema = __commonJS({
    "node_modules/ajv/dist/compile/validate/subschema.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      function getSubschema(it, { keyword, schemaProp, schema: schema2, schemaPath, errSchemaPath, topSchemaRef }) {
        if (keyword !== void 0 && schema2 !== void 0) {
          throw new Error('both "keyword" and "schema" passed, only one allowed');
        }
        if (keyword !== void 0) {
          const sch = it.schema[keyword];
          return schemaProp === void 0 ? {
            schema: sch,
            schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
            errSchemaPath: `${it.errSchemaPath}/${keyword}`
          } : {
            schema: sch[schemaProp],
            schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
            errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
          };
        }
        if (schema2 !== void 0) {
          if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) {
            throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
          }
          return {
            schema: schema2,
            schemaPath,
            topSchemaRef,
            errSchemaPath
          };
        }
        throw new Error('either "keyword" or "schema" must be passed');
      }
      exports.getSubschema = getSubschema;
      function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
        if (data !== void 0 && dataProp !== void 0) {
          throw new Error('both "data" and "dataProp" passed, only one allowed');
        }
        const { gen } = it;
        if (dataProp !== void 0) {
          const { errorPath, dataPathArr, opts } = it;
          const nextData = gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
          dataContextProps(nextData);
          subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
          subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
          subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
        }
        if (data !== void 0) {
          const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true);
          dataContextProps(nextData);
          if (propertyName !== void 0)
            subschema.propertyName = propertyName;
        }
        if (dataTypes)
          subschema.dataTypes = dataTypes;
        function dataContextProps(_nextData) {
          subschema.data = _nextData;
          subschema.dataLevel = it.dataLevel + 1;
          subschema.dataTypes = [];
          it.definedProperties = /* @__PURE__ */ new Set();
          subschema.parentData = it.data;
          subschema.dataNames = [...it.dataNames, _nextData];
        }
      }
      exports.extendSubschemaData = extendSubschemaData;
      function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
        if (compositeRule !== void 0)
          subschema.compositeRule = compositeRule;
        if (createErrors !== void 0)
          subschema.createErrors = createErrors;
        if (allErrors !== void 0)
          subschema.allErrors = allErrors;
        subschema.jtdDiscriminator = jtdDiscriminator;
        subschema.jtdMetadata = jtdMetadata;
      }
      exports.extendSubschemaMode = extendSubschemaMode;
    }
  });

  // node_modules/fast-deep-equal/index.js
  var require_fast_deep_equal = __commonJS({
    "node_modules/fast-deep-equal/index.js"(exports, module) {
      "use strict";
      module.exports = function equal(a, b) {
        if (a === b) return true;
        if (a && b && typeof a == "object" && typeof b == "object") {
          if (a.constructor !== b.constructor) return false;
          var length, i, keys;
          if (Array.isArray(a)) {
            length = a.length;
            if (length != b.length) return false;
            for (i = length; i-- !== 0; )
              if (!equal(a[i], b[i])) return false;
            return true;
          }
          if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
          if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
          if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
          keys = Object.keys(a);
          length = keys.length;
          if (length !== Object.keys(b).length) return false;
          for (i = length; i-- !== 0; )
            if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
          for (i = length; i-- !== 0; ) {
            var key = keys[i];
            if (!equal(a[key], b[key])) return false;
          }
          return true;
        }
        return a !== a && b !== b;
      };
    }
  });

  // node_modules/json-schema-traverse/index.js
  var require_json_schema_traverse = __commonJS({
    "node_modules/json-schema-traverse/index.js"(exports, module) {
      "use strict";
      var traverse3 = module.exports = function(schema2, opts, cb) {
        if (typeof opts == "function") {
          cb = opts;
          opts = {};
        }
        cb = opts.cb || cb;
        var pre = typeof cb == "function" ? cb : cb.pre || function() {
        };
        var post = cb.post || function() {
        };
        _traverse(opts, pre, post, schema2, "", schema2);
      };
      traverse3.keywords = {
        additionalItems: true,
        items: true,
        contains: true,
        additionalProperties: true,
        propertyNames: true,
        not: true,
        if: true,
        then: true,
        else: true
      };
      traverse3.arrayKeywords = {
        items: true,
        allOf: true,
        anyOf: true,
        oneOf: true
      };
      traverse3.propsKeywords = {
        $defs: true,
        definitions: true,
        properties: true,
        patternProperties: true,
        dependencies: true
      };
      traverse3.skipKeywords = {
        default: true,
        enum: true,
        const: true,
        required: true,
        maximum: true,
        minimum: true,
        exclusiveMaximum: true,
        exclusiveMinimum: true,
        multipleOf: true,
        maxLength: true,
        minLength: true,
        pattern: true,
        format: true,
        maxItems: true,
        minItems: true,
        uniqueItems: true,
        maxProperties: true,
        minProperties: true
      };
      function _traverse(opts, pre, post, schema2, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
        if (schema2 && typeof schema2 == "object" && !Array.isArray(schema2)) {
          pre(schema2, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
          for (var key in schema2) {
            var sch = schema2[key];
            if (Array.isArray(sch)) {
              if (key in traverse3.arrayKeywords) {
                for (var i = 0; i < sch.length; i++)
                  _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema2, i);
              }
            } else if (key in traverse3.propsKeywords) {
              if (sch && typeof sch == "object") {
                for (var prop in sch)
                  _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema2, prop);
              }
            } else if (key in traverse3.keywords || opts.allKeys && !(key in traverse3.skipKeywords)) {
              _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema2);
            }
          }
          post(schema2, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
        }
      }
      function escapeJsonPtr(str) {
        return str.replace(/~/g, "~0").replace(/\//g, "~1");
      }
    }
  });

  // node_modules/ajv/dist/compile/resolve.js
  var require_resolve = __commonJS({
    "node_modules/ajv/dist/compile/resolve.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
      var util_1 = require_util2();
      var equal = require_fast_deep_equal();
      var traverse3 = require_json_schema_traverse();
      var SIMPLE_INLINED = /* @__PURE__ */ new Set([
        "type",
        "format",
        "pattern",
        "maxLength",
        "minLength",
        "maxProperties",
        "minProperties",
        "maxItems",
        "minItems",
        "maximum",
        "minimum",
        "uniqueItems",
        "multipleOf",
        "required",
        "enum",
        "const"
      ]);
      function inlineRef(schema2, limit = true) {
        if (typeof schema2 == "boolean")
          return true;
        if (limit === true)
          return !hasRef(schema2);
        if (!limit)
          return false;
        return countKeys(schema2) <= limit;
      }
      exports.inlineRef = inlineRef;
      var REF_KEYWORDS = /* @__PURE__ */ new Set([
        "$ref",
        "$recursiveRef",
        "$recursiveAnchor",
        "$dynamicRef",
        "$dynamicAnchor"
      ]);
      function hasRef(schema2) {
        for (const key in schema2) {
          if (REF_KEYWORDS.has(key))
            return true;
          const sch = schema2[key];
          if (Array.isArray(sch) && sch.some(hasRef))
            return true;
          if (typeof sch == "object" && hasRef(sch))
            return true;
        }
        return false;
      }
      function countKeys(schema2) {
        let count = 0;
        for (const key in schema2) {
          if (key === "$ref")
            return Infinity;
          count++;
          if (SIMPLE_INLINED.has(key))
            continue;
          if (typeof schema2[key] == "object") {
            (0, util_1.eachItem)(schema2[key], (sch) => count += countKeys(sch));
          }
          if (count === Infinity)
            return Infinity;
        }
        return count;
      }
      function getFullPath(resolver, id = "", normalize2) {
        if (normalize2 !== false)
          id = normalizeId(id);
        const p = resolver.parse(id);
        return _getFullPath(resolver, p);
      }
      exports.getFullPath = getFullPath;
      function _getFullPath(resolver, p) {
        const serialized = resolver.serialize(p);
        return serialized.split("#")[0] + "#";
      }
      exports._getFullPath = _getFullPath;
      var TRAILING_SLASH_HASH = /#\/?$/;
      function normalizeId(id) {
        return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
      }
      exports.normalizeId = normalizeId;
      function resolveUrl(resolver, baseId, id) {
        id = normalizeId(id);
        return resolver.resolve(baseId, id);
      }
      exports.resolveUrl = resolveUrl;
      var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
      function getSchemaRefs(schema2, baseId) {
        if (typeof schema2 == "boolean")
          return {};
        const { schemaId, uriResolver } = this.opts;
        const schId = normalizeId(schema2[schemaId] || baseId);
        const baseIds = { "": schId };
        const pathPrefix = getFullPath(uriResolver, schId, false);
        const localRefs = {};
        const schemaRefs = /* @__PURE__ */ new Set();
        traverse3(schema2, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
          if (parentJsonPtr === void 0)
            return;
          const fullPath = pathPrefix + jsonPtr;
          let innerBaseId = baseIds[parentJsonPtr];
          if (typeof sch[schemaId] == "string")
            innerBaseId = addRef.call(this, sch[schemaId]);
          addAnchor.call(this, sch.$anchor);
          addAnchor.call(this, sch.$dynamicAnchor);
          baseIds[jsonPtr] = innerBaseId;
          function addRef(ref) {
            const _resolve = this.opts.uriResolver.resolve;
            ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
            if (schemaRefs.has(ref))
              throw ambiguos(ref);
            schemaRefs.add(ref);
            let schOrRef = this.refs[ref];
            if (typeof schOrRef == "string")
              schOrRef = this.refs[schOrRef];
            if (typeof schOrRef == "object") {
              checkAmbiguosRef(sch, schOrRef.schema, ref);
            } else if (ref !== normalizeId(fullPath)) {
              if (ref[0] === "#") {
                checkAmbiguosRef(sch, localRefs[ref], ref);
                localRefs[ref] = sch;
              } else {
                this.refs[ref] = fullPath;
              }
            }
            return ref;
          }
          function addAnchor(anchor) {
            if (typeof anchor == "string") {
              if (!ANCHOR.test(anchor))
                throw new Error(`invalid anchor "${anchor}"`);
              addRef.call(this, `#${anchor}`);
            }
          }
        });
        return localRefs;
        function checkAmbiguosRef(sch1, sch2, ref) {
          if (sch2 !== void 0 && !equal(sch1, sch2))
            throw ambiguos(ref);
        }
        function ambiguos(ref) {
          return new Error(`reference "${ref}" resolves to more than one schema`);
        }
      }
      exports.getSchemaRefs = getSchemaRefs;
    }
  });

  // node_modules/ajv/dist/compile/validate/index.js
  var require_validate = __commonJS({
    "node_modules/ajv/dist/compile/validate/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
      var boolSchema_1 = require_boolSchema();
      var dataType_1 = require_dataType();
      var applicability_1 = require_applicability();
      var dataType_2 = require_dataType();
      var defaults_1 = require_defaults();
      var keyword_1 = require_keyword();
      var subschema_1 = require_subschema();
      var codegen_1 = require_codegen();
      var names_1 = require_names();
      var resolve_1 = require_resolve();
      var util_1 = require_util2();
      var errors_1 = require_errors();
      function validateFunctionCode(it) {
        if (isSchemaObj(it)) {
          checkKeywords(it);
          if (schemaCxtHasRules(it)) {
            topSchemaObjCode(it);
            return;
          }
        }
        validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
      }
      exports.validateFunctionCode = validateFunctionCode;
      function validateFunction({ gen, validateName, schema: schema2, schemaEnv, opts }, body) {
        if (opts.code.es5) {
          gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
            gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema2, opts)}`);
            destructureValCxtES5(gen, opts);
            gen.code(body);
          });
        } else {
          gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema2, opts)).code(body));
        }
      }
      function destructureValCxt(opts) {
        return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
      }
      function destructureValCxtES5(gen, opts) {
        gen.if(names_1.default.valCxt, () => {
          gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
          gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
          gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
          gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
          if (opts.dynamicRef)
            gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
        }, () => {
          gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
          gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
          gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
          gen.var(names_1.default.rootData, names_1.default.data);
          if (opts.dynamicRef)
            gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
        });
      }
      function topSchemaObjCode(it) {
        const { schema: schema2, opts, gen } = it;
        validateFunction(it, () => {
          if (opts.$comment && schema2.$comment)
            commentKeyword(it);
          checkNoDefault(it);
          gen.let(names_1.default.vErrors, null);
          gen.let(names_1.default.errors, 0);
          if (opts.unevaluated)
            resetEvaluated(it);
          typeAndKeywords(it);
          returnResults(it);
        });
        return;
      }
      function resetEvaluated(it) {
        const { gen, validateName } = it;
        it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
        gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
        gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
      }
      function funcSourceUrl(schema2, opts) {
        const schId = typeof schema2 == "object" && schema2[opts.schemaId];
        return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
      }
      function subschemaCode(it, valid) {
        if (isSchemaObj(it)) {
          checkKeywords(it);
          if (schemaCxtHasRules(it)) {
            subSchemaObjCode(it, valid);
            return;
          }
        }
        (0, boolSchema_1.boolOrEmptySchema)(it, valid);
      }
      function schemaCxtHasRules({ schema: schema2, self }) {
        if (typeof schema2 == "boolean")
          return !schema2;
        for (const key in schema2)
          if (self.RULES.all[key])
            return true;
        return false;
      }
      function isSchemaObj(it) {
        return typeof it.schema != "boolean";
      }
      function subSchemaObjCode(it, valid) {
        const { schema: schema2, gen, opts } = it;
        if (opts.$comment && schema2.$comment)
          commentKeyword(it);
        updateContext(it);
        checkAsyncSchema(it);
        const errsCount = gen.const("_errs", names_1.default.errors);
        typeAndKeywords(it, errsCount);
        gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
      }
      function checkKeywords(it) {
        (0, util_1.checkUnknownRules)(it);
        checkRefsAndKeywords(it);
      }
      function typeAndKeywords(it, errsCount) {
        if (it.opts.jtd)
          return schemaKeywords(it, [], false, errsCount);
        const types = (0, dataType_1.getSchemaTypes)(it.schema);
        const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types);
        schemaKeywords(it, types, !checkedTypes, errsCount);
      }
      function checkRefsAndKeywords(it) {
        const { schema: schema2, errSchemaPath, opts, self } = it;
        if (schema2.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema2, self.RULES)) {
          self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
        }
      }
      function checkNoDefault(it) {
        const { schema: schema2, opts } = it;
        if (schema2.default !== void 0 && opts.useDefaults && opts.strictSchema) {
          (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
        }
      }
      function updateContext(it) {
        const schId = it.schema[it.opts.schemaId];
        if (schId)
          it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
      }
      function checkAsyncSchema(it) {
        if (it.schema.$async && !it.schemaEnv.$async)
          throw new Error("async schema in sync schema");
      }
      function commentKeyword({ gen, schemaEnv, schema: schema2, errSchemaPath, opts }) {
        const msg = schema2.$comment;
        if (opts.$comment === true) {
          gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
        } else if (typeof opts.$comment == "function") {
          const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
          const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
          gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
        }
      }
      function returnResults(it) {
        const { gen, schemaEnv, validateName, ValidationError, opts } = it;
        if (schemaEnv.$async) {
          gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
        } else {
          gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
          if (opts.unevaluated)
            assignEvaluated(it);
          gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
        }
      }
      function assignEvaluated({ gen, evaluated, props, items }) {
        if (props instanceof codegen_1.Name)
          gen.assign((0, codegen_1._)`${evaluated}.props`, props);
        if (items instanceof codegen_1.Name)
          gen.assign((0, codegen_1._)`${evaluated}.items`, items);
      }
      function schemaKeywords(it, types, typeErrors, errsCount) {
        const { gen, schema: schema2, data, allErrors, opts, self } = it;
        const { RULES } = self;
        if (schema2.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema2, RULES))) {
          gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
          return;
        }
        if (!opts.jtd)
          checkStrictTypes(it, types);
        gen.block(() => {
          for (const group of RULES.rules)
            groupKeywords(group);
          groupKeywords(RULES.post);
        });
        function groupKeywords(group) {
          if (!(0, applicability_1.shouldUseGroup)(schema2, group))
            return;
          if (group.type) {
            gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
            iterateKeywords(it, group);
            if (types.length === 1 && types[0] === group.type && typeErrors) {
              gen.else();
              (0, dataType_2.reportTypeError)(it);
            }
            gen.endIf();
          } else {
            iterateKeywords(it, group);
          }
          if (!allErrors)
            gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
        }
      }
      function iterateKeywords(it, group) {
        const { gen, schema: schema2, opts: { useDefaults } } = it;
        if (useDefaults)
          (0, defaults_1.assignDefaults)(it, group.type);
        gen.block(() => {
          for (const rule of group.rules) {
            if ((0, applicability_1.shouldUseRule)(schema2, rule)) {
              keywordCode(it, rule.keyword, rule.definition, group.type);
            }
          }
        });
      }
      function checkStrictTypes(it, types) {
        if (it.schemaEnv.meta || !it.opts.strictTypes)
          return;
        checkContextTypes(it, types);
        if (!it.opts.allowUnionTypes)
          checkMultipleTypes(it, types);
        checkKeywordTypes(it, it.dataTypes);
      }
      function checkContextTypes(it, types) {
        if (!types.length)
          return;
        if (!it.dataTypes.length) {
          it.dataTypes = types;
          return;
        }
        types.forEach((t) => {
          if (!includesType(it.dataTypes, t)) {
            strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
          }
        });
        narrowSchemaTypes(it, types);
      }
      function checkMultipleTypes(it, ts) {
        if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
          strictTypesError(it, "use allowUnionTypes to allow union type keyword");
        }
      }
      function checkKeywordTypes(it, ts) {
        const rules = it.self.RULES.all;
        for (const keyword in rules) {
          const rule = rules[keyword];
          if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
            const { type } = rule.definition;
            if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
              strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
            }
          }
        }
      }
      function hasApplicableType(schTs, kwdT) {
        return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
      }
      function includesType(ts, t) {
        return ts.includes(t) || t === "integer" && ts.includes("number");
      }
      function narrowSchemaTypes(it, withTypes) {
        const ts = [];
        for (const t of it.dataTypes) {
          if (includesType(withTypes, t))
            ts.push(t);
          else if (withTypes.includes("integer") && t === "number")
            ts.push("integer");
        }
        it.dataTypes = ts;
      }
      function strictTypesError(it, msg) {
        const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
        msg += ` at "${schemaPath}" (strictTypes)`;
        (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
      }
      var KeywordCxt = class {
        constructor(it, def, keyword) {
          (0, keyword_1.validateKeywordUsage)(it, def, keyword);
          this.gen = it.gen;
          this.allErrors = it.allErrors;
          this.keyword = keyword;
          this.data = it.data;
          this.schema = it.schema[keyword];
          this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
          this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
          this.schemaType = def.schemaType;
          this.parentSchema = it.schema;
          this.params = {};
          this.it = it;
          this.def = def;
          if (this.$data) {
            this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
          } else {
            this.schemaCode = this.schemaValue;
            if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
              throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
            }
          }
          if ("code" in def ? def.trackErrors : def.errors !== false) {
            this.errsCount = it.gen.const("_errs", names_1.default.errors);
          }
        }
        result(condition, successAction, failAction) {
          this.failResult((0, codegen_1.not)(condition), successAction, failAction);
        }
        failResult(condition, successAction, failAction) {
          this.gen.if(condition);
          if (failAction)
            failAction();
          else
            this.error();
          if (successAction) {
            this.gen.else();
            successAction();
            if (this.allErrors)
              this.gen.endIf();
          } else {
            if (this.allErrors)
              this.gen.endIf();
            else
              this.gen.else();
          }
        }
        pass(condition, failAction) {
          this.failResult((0, codegen_1.not)(condition), void 0, failAction);
        }
        fail(condition) {
          if (condition === void 0) {
            this.error();
            if (!this.allErrors)
              this.gen.if(false);
            return;
          }
          this.gen.if(condition);
          this.error();
          if (this.allErrors)
            this.gen.endIf();
          else
            this.gen.else();
        }
        fail$data(condition) {
          if (!this.$data)
            return this.fail(condition);
          const { schemaCode } = this;
          this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
        }
        error(append, errorParams, errorPaths) {
          if (errorParams) {
            this.setParams(errorParams);
            this._error(append, errorPaths);
            this.setParams({});
            return;
          }
          this._error(append, errorPaths);
        }
        _error(append, errorPaths) {
          ;
          (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
        }
        $dataError() {
          (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
        }
        reset() {
          if (this.errsCount === void 0)
            throw new Error('add "trackErrors" to keyword definition');
          (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
        }
        ok(cond) {
          if (!this.allErrors)
            this.gen.if(cond);
        }
        setParams(obj, assign) {
          if (assign)
            Object.assign(this.params, obj);
          else
            this.params = obj;
        }
        block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
          this.gen.block(() => {
            this.check$data(valid, $dataValid);
            codeBlock();
          });
        }
        check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
          if (!this.$data)
            return;
          const { gen, schemaCode, schemaType, def } = this;
          gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
          if (valid !== codegen_1.nil)
            gen.assign(valid, true);
          if (schemaType.length || def.validateSchema) {
            gen.elseIf(this.invalid$data());
            this.$dataError();
            if (valid !== codegen_1.nil)
              gen.assign(valid, false);
          }
          gen.else();
        }
        invalid$data() {
          const { gen, schemaCode, schemaType, def, it } = this;
          return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
          function wrong$DataType() {
            if (schemaType.length) {
              if (!(schemaCode instanceof codegen_1.Name))
                throw new Error("ajv implementation error");
              const st = Array.isArray(schemaType) ? schemaType : [schemaType];
              return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
            }
            return codegen_1.nil;
          }
          function invalid$DataSchema() {
            if (def.validateSchema) {
              const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
              return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
            }
            return codegen_1.nil;
          }
        }
        subschema(appl, valid) {
          const subschema = (0, subschema_1.getSubschema)(this.it, appl);
          (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
          (0, subschema_1.extendSubschemaMode)(subschema, appl);
          const nextContext = { ...this.it, ...subschema, items: void 0, props: void 0 };
          subschemaCode(nextContext, valid);
          return nextContext;
        }
        mergeEvaluated(schemaCxt, toName) {
          const { it, gen } = this;
          if (!it.opts.unevaluated)
            return;
          if (it.props !== true && schemaCxt.props !== void 0) {
            it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
          }
          if (it.items !== true && schemaCxt.items !== void 0) {
            it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
          }
        }
        mergeValidEvaluated(schemaCxt, valid) {
          const { it, gen } = this;
          if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
            gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
            return true;
          }
        }
      };
      exports.KeywordCxt = KeywordCxt;
      function keywordCode(it, keyword, def, ruleType) {
        const cxt = new KeywordCxt(it, def, keyword);
        if ("code" in def) {
          def.code(cxt, ruleType);
        } else if (cxt.$data && def.validate) {
          (0, keyword_1.funcKeywordCode)(cxt, def);
        } else if ("macro" in def) {
          (0, keyword_1.macroKeywordCode)(cxt, def);
        } else if (def.compile || def.validate) {
          (0, keyword_1.funcKeywordCode)(cxt, def);
        }
      }
      var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
      var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
      function getData($data, { dataLevel, dataNames, dataPathArr }) {
        let jsonPointer;
        let data;
        if ($data === "")
          return names_1.default.rootData;
        if ($data[0] === "/") {
          if (!JSON_POINTER.test($data))
            throw new Error(`Invalid JSON-pointer: ${$data}`);
          jsonPointer = $data;
          data = names_1.default.rootData;
        } else {
          const matches = RELATIVE_JSON_POINTER.exec($data);
          if (!matches)
            throw new Error(`Invalid JSON-pointer: ${$data}`);
          const up = +matches[1];
          jsonPointer = matches[2];
          if (jsonPointer === "#") {
            if (up >= dataLevel)
              throw new Error(errorMsg("property/index", up));
            return dataPathArr[dataLevel - up];
          }
          if (up > dataLevel)
            throw new Error(errorMsg("data", up));
          data = dataNames[dataLevel - up];
          if (!jsonPointer)
            return data;
        }
        let expr = data;
        const segments = jsonPointer.split("/");
        for (const segment of segments) {
          if (segment) {
            data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
            expr = (0, codegen_1._)`${expr} && ${data}`;
          }
        }
        return expr;
        function errorMsg(pointerType, up) {
          return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
        }
      }
      exports.getData = getData;
    }
  });

  // node_modules/ajv/dist/runtime/validation_error.js
  var require_validation_error = __commonJS({
    "node_modules/ajv/dist/runtime/validation_error.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var ValidationError = class extends Error {
        constructor(errors) {
          super("validation failed");
          this.errors = errors;
          this.ajv = this.validation = true;
        }
      };
      exports.default = ValidationError;
    }
  });

  // node_modules/ajv/dist/compile/ref_error.js
  var require_ref_error = __commonJS({
    "node_modules/ajv/dist/compile/ref_error.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var resolve_1 = require_resolve();
      var MissingRefError = class extends Error {
        constructor(resolver, baseId, ref, msg) {
          super(msg || `can't resolve reference ${ref} from id ${baseId}`);
          this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
          this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
        }
      };
      exports.default = MissingRefError;
    }
  });

  // node_modules/ajv/dist/compile/index.js
  var require_compile = __commonJS({
    "node_modules/ajv/dist/compile/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
      var codegen_1 = require_codegen();
      var validation_error_1 = require_validation_error();
      var names_1 = require_names();
      var resolve_1 = require_resolve();
      var util_1 = require_util2();
      var validate_1 = require_validate();
      var SchemaEnv = class {
        constructor(env) {
          var _a;
          this.refs = {};
          this.dynamicAnchors = {};
          let schema2;
          if (typeof env.schema == "object")
            schema2 = env.schema;
          this.schema = env.schema;
          this.schemaId = env.schemaId;
          this.root = env.root || this;
          this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema2 === null || schema2 === void 0 ? void 0 : schema2[env.schemaId || "$id"]);
          this.schemaPath = env.schemaPath;
          this.localRefs = env.localRefs;
          this.meta = env.meta;
          this.$async = schema2 === null || schema2 === void 0 ? void 0 : schema2.$async;
          this.refs = {};
        }
      };
      exports.SchemaEnv = SchemaEnv;
      function compileSchema(sch) {
        const _sch = getCompilingSchema.call(this, sch);
        if (_sch)
          return _sch;
        const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
        const { es5, lines } = this.opts.code;
        const { ownProperties } = this.opts;
        const gen = new codegen_1.CodeGen(this.scope, { es5, lines, ownProperties });
        let _ValidationError;
        if (sch.$async) {
          _ValidationError = gen.scopeValue("Error", {
            ref: validation_error_1.default,
            code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
          });
        }
        const validateName = gen.scopeName("validate");
        sch.validateName = validateName;
        const schemaCxt = {
          gen,
          allErrors: this.opts.allErrors,
          data: names_1.default.data,
          parentData: names_1.default.parentData,
          parentDataProperty: names_1.default.parentDataProperty,
          dataNames: [names_1.default.data],
          dataPathArr: [codegen_1.nil],
          // TODO can its length be used as dataLevel if nil is removed?
          dataLevel: 0,
          dataTypes: [],
          definedProperties: /* @__PURE__ */ new Set(),
          topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) } : { ref: sch.schema }),
          validateName,
          ValidationError: _ValidationError,
          schema: sch.schema,
          schemaEnv: sch,
          rootId,
          baseId: sch.baseId || rootId,
          schemaPath: codegen_1.nil,
          errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
          errorPath: (0, codegen_1._)`""`,
          opts: this.opts,
          self: this
        };
        let sourceCode;
        try {
          this._compilations.add(sch);
          (0, validate_1.validateFunctionCode)(schemaCxt);
          gen.optimize(this.opts.code.optimize);
          const validateCode = gen.toString();
          sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
          if (this.opts.code.process)
            sourceCode = this.opts.code.process(sourceCode, sch);
          const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
          const validate = makeValidate(this, this.scope.get());
          this.scope.value(validateName, { ref: validate });
          validate.errors = null;
          validate.schema = sch.schema;
          validate.schemaEnv = sch;
          if (sch.$async)
            validate.$async = true;
          if (this.opts.code.source === true) {
            validate.source = { validateName, validateCode, scopeValues: gen._values };
          }
          if (this.opts.unevaluated) {
            const { props, items } = schemaCxt;
            validate.evaluated = {
              props: props instanceof codegen_1.Name ? void 0 : props,
              items: items instanceof codegen_1.Name ? void 0 : items,
              dynamicProps: props instanceof codegen_1.Name,
              dynamicItems: items instanceof codegen_1.Name
            };
            if (validate.source)
              validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
          }
          sch.validate = validate;
          return sch;
        } catch (e) {
          delete sch.validate;
          delete sch.validateName;
          if (sourceCode)
            this.logger.error("Error compiling schema, function code:", sourceCode);
          throw e;
        } finally {
          this._compilations.delete(sch);
        }
      }
      exports.compileSchema = compileSchema;
      function resolveRef(root, baseId, ref) {
        var _a;
        ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
        const schOrFunc = root.refs[ref];
        if (schOrFunc)
          return schOrFunc;
        let _sch = resolve.call(this, root, ref);
        if (_sch === void 0) {
          const schema2 = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref];
          const { schemaId } = this.opts;
          if (schema2)
            _sch = new SchemaEnv({ schema: schema2, schemaId, root, baseId });
        }
        if (_sch === void 0)
          return;
        return root.refs[ref] = inlineOrCompile.call(this, _sch);
      }
      exports.resolveRef = resolveRef;
      function inlineOrCompile(sch) {
        if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
          return sch.schema;
        return sch.validate ? sch : compileSchema.call(this, sch);
      }
      function getCompilingSchema(schEnv) {
        for (const sch of this._compilations) {
          if (sameSchemaEnv(sch, schEnv))
            return sch;
        }
      }
      exports.getCompilingSchema = getCompilingSchema;
      function sameSchemaEnv(s1, s2) {
        return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
      }
      function resolve(root, ref) {
        let sch;
        while (typeof (sch = this.refs[ref]) == "string")
          ref = sch;
        return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
      }
      function resolveSchema(root, ref) {
        const p = this.opts.uriResolver.parse(ref);
        const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
        let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
        if (Object.keys(root.schema).length > 0 && refPath === baseId) {
          return getJsonPointer.call(this, p, root);
        }
        const id = (0, resolve_1.normalizeId)(refPath);
        const schOrRef = this.refs[id] || this.schemas[id];
        if (typeof schOrRef == "string") {
          const sch = resolveSchema.call(this, root, schOrRef);
          if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
            return;
          return getJsonPointer.call(this, p, sch);
        }
        if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
          return;
        if (!schOrRef.validate)
          compileSchema.call(this, schOrRef);
        if (id === (0, resolve_1.normalizeId)(ref)) {
          const { schema: schema2 } = schOrRef;
          const { schemaId } = this.opts;
          const schId = schema2[schemaId];
          if (schId)
            baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
          return new SchemaEnv({ schema: schema2, schemaId, root, baseId });
        }
        return getJsonPointer.call(this, p, schOrRef);
      }
      exports.resolveSchema = resolveSchema;
      var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
        "properties",
        "patternProperties",
        "enum",
        "dependencies",
        "definitions"
      ]);
      function getJsonPointer(parsedRef, { baseId, schema: schema2, root }) {
        var _a;
        if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/")
          return;
        for (const part of parsedRef.fragment.slice(1).split("/")) {
          if (typeof schema2 === "boolean")
            return;
          const partSchema = schema2[(0, util_1.unescapeFragment)(part)];
          if (partSchema === void 0)
            return;
          schema2 = partSchema;
          const schId = typeof schema2 === "object" && schema2[this.opts.schemaId];
          if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
            baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
          }
        }
        let env;
        if (typeof schema2 != "boolean" && schema2.$ref && !(0, util_1.schemaHasRulesButRef)(schema2, this.RULES)) {
          const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema2.$ref);
          env = resolveSchema.call(this, root, $ref);
        }
        const { schemaId } = this.opts;
        env = env || new SchemaEnv({ schema: schema2, schemaId, root, baseId });
        if (env.schema !== env.root.schema)
          return env;
        return void 0;
      }
    }
  });

  // node_modules/ajv/dist/refs/data.json
  var require_data = __commonJS({
    "node_modules/ajv/dist/refs/data.json"(exports, module) {
      module.exports = {
        $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
        description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
        type: "object",
        required: ["$data"],
        properties: {
          $data: {
            type: "string",
            anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }]
          }
        },
        additionalProperties: false
      };
    }
  });

  // node_modules/fast-uri/lib/scopedChars.js
  var require_scopedChars = __commonJS({
    "node_modules/fast-uri/lib/scopedChars.js"(exports, module) {
      "use strict";
      var HEX = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        a: 10,
        A: 10,
        b: 11,
        B: 11,
        c: 12,
        C: 12,
        d: 13,
        D: 13,
        e: 14,
        E: 14,
        f: 15,
        F: 15
      };
      module.exports = {
        HEX
      };
    }
  });

  // node_modules/fast-uri/lib/utils.js
  var require_utils = __commonJS({
    "node_modules/fast-uri/lib/utils.js"(exports, module) {
      "use strict";
      var { HEX } = require_scopedChars();
      var IPV4_REG = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u;
      function normalizeIPv4(host) {
        if (findToken(host, ".") < 3) {
          return { host, isIPV4: false };
        }
        const matches = host.match(IPV4_REG) || [];
        const [address] = matches;
        if (address) {
          return { host: stripLeadingZeros(address, "."), isIPV4: true };
        } else {
          return { host, isIPV4: false };
        }
      }
      function stringArrayToHexStripped(input, keepZero = false) {
        let acc = "";
        let strip = true;
        for (const c of input) {
          if (HEX[c] === void 0) return void 0;
          if (c !== "0" && strip === true) strip = false;
          if (!strip) acc += c;
        }
        if (keepZero && acc.length === 0) acc = "0";
        return acc;
      }
      function getIPV6(input) {
        let tokenCount = 0;
        const output = { error: false, address: "", zone: "" };
        const address = [];
        const buffer = [];
        let isZone = false;
        let endipv6Encountered = false;
        let endIpv6 = false;
        function consume() {
          if (buffer.length) {
            if (isZone === false) {
              const hex = stringArrayToHexStripped(buffer);
              if (hex !== void 0) {
                address.push(hex);
              } else {
                output.error = true;
                return false;
              }
            }
            buffer.length = 0;
          }
          return true;
        }
        for (let i = 0; i < input.length; i++) {
          const cursor = input[i];
          if (cursor === "[" || cursor === "]") {
            continue;
          }
          if (cursor === ":") {
            if (endipv6Encountered === true) {
              endIpv6 = true;
            }
            if (!consume()) {
              break;
            }
            tokenCount++;
            address.push(":");
            if (tokenCount > 7) {
              output.error = true;
              break;
            }
            if (i - 1 >= 0 && input[i - 1] === ":") {
              endipv6Encountered = true;
            }
            continue;
          } else if (cursor === "%") {
            if (!consume()) {
              break;
            }
            isZone = true;
          } else {
            buffer.push(cursor);
            continue;
          }
        }
        if (buffer.length) {
          if (isZone) {
            output.zone = buffer.join("");
          } else if (endIpv6) {
            address.push(buffer.join(""));
          } else {
            address.push(stringArrayToHexStripped(buffer));
          }
        }
        output.address = address.join("");
        return output;
      }
      function normalizeIPv6(host) {
        if (findToken(host, ":") < 2) {
          return { host, isIPV6: false };
        }
        const ipv6 = getIPV6(host);
        if (!ipv6.error) {
          let newHost = ipv6.address;
          let escapedHost = ipv6.address;
          if (ipv6.zone) {
            newHost += "%" + ipv6.zone;
            escapedHost += "%25" + ipv6.zone;
          }
          return { host: newHost, escapedHost, isIPV6: true };
        } else {
          return { host, isIPV6: false };
        }
      }
      function stripLeadingZeros(str, token) {
        let out = "";
        let skip = true;
        const l = str.length;
        for (let i = 0; i < l; i++) {
          const c = str[i];
          if (c === "0" && skip) {
            if (i + 1 <= l && str[i + 1] === token || i + 1 === l) {
              out += c;
              skip = false;
            }
          } else {
            if (c === token) {
              skip = true;
            } else {
              skip = false;
            }
            out += c;
          }
        }
        return out;
      }
      function findToken(str, token) {
        let ind = 0;
        for (let i = 0; i < str.length; i++) {
          if (str[i] === token) ind++;
        }
        return ind;
      }
      var RDS1 = /^\.\.?\//u;
      var RDS2 = /^\/\.(?:\/|$)/u;
      var RDS3 = /^\/\.\.(?:\/|$)/u;
      var RDS5 = /^\/?(?:.|\n)*?(?=\/|$)/u;
      function removeDotSegments(input) {
        const output = [];
        while (input.length) {
          if (input.match(RDS1)) {
            input = input.replace(RDS1, "");
          } else if (input.match(RDS2)) {
            input = input.replace(RDS2, "/");
          } else if (input.match(RDS3)) {
            input = input.replace(RDS3, "/");
            output.pop();
          } else if (input === "." || input === "..") {
            input = "";
          } else {
            const im2 = input.match(RDS5);
            if (im2) {
              const s = im2[0];
              input = input.slice(s.length);
              output.push(s);
            } else {
              throw new Error("Unexpected dot segment condition");
            }
          }
        }
        return output.join("");
      }
      function normalizeComponentEncoding(components, esc) {
        const func = esc !== true ? escape : unescape;
        if (components.scheme !== void 0) {
          components.scheme = func(components.scheme);
        }
        if (components.userinfo !== void 0) {
          components.userinfo = func(components.userinfo);
        }
        if (components.host !== void 0) {
          components.host = func(components.host);
        }
        if (components.path !== void 0) {
          components.path = func(components.path);
        }
        if (components.query !== void 0) {
          components.query = func(components.query);
        }
        if (components.fragment !== void 0) {
          components.fragment = func(components.fragment);
        }
        return components;
      }
      function recomposeAuthority(components) {
        const uriTokens = [];
        if (components.userinfo !== void 0) {
          uriTokens.push(components.userinfo);
          uriTokens.push("@");
        }
        if (components.host !== void 0) {
          let host = unescape(components.host);
          const ipV4res = normalizeIPv4(host);
          if (ipV4res.isIPV4) {
            host = ipV4res.host;
          } else {
            const ipV6res = normalizeIPv6(ipV4res.host);
            if (ipV6res.isIPV6 === true) {
              host = `[${ipV6res.escapedHost}]`;
            } else {
              host = components.host;
            }
          }
          uriTokens.push(host);
        }
        if (typeof components.port === "number" || typeof components.port === "string") {
          uriTokens.push(":");
          uriTokens.push(String(components.port));
        }
        return uriTokens.length ? uriTokens.join("") : void 0;
      }
      module.exports = {
        recomposeAuthority,
        normalizeComponentEncoding,
        removeDotSegments,
        normalizeIPv4,
        normalizeIPv6,
        stringArrayToHexStripped
      };
    }
  });

  // node_modules/fast-uri/lib/schemes.js
  var require_schemes = __commonJS({
    "node_modules/fast-uri/lib/schemes.js"(exports, module) {
      "use strict";
      var UUID_REG = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu;
      var URN_REG = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
      function isSecure(wsComponents) {
        return typeof wsComponents.secure === "boolean" ? wsComponents.secure : String(wsComponents.scheme).toLowerCase() === "wss";
      }
      function httpParse(components) {
        if (!components.host) {
          components.error = components.error || "HTTP URIs must have a host.";
        }
        return components;
      }
      function httpSerialize(components) {
        const secure = String(components.scheme).toLowerCase() === "https";
        if (components.port === (secure ? 443 : 80) || components.port === "") {
          components.port = void 0;
        }
        if (!components.path) {
          components.path = "/";
        }
        return components;
      }
      function wsParse(wsComponents) {
        wsComponents.secure = isSecure(wsComponents);
        wsComponents.resourceName = (wsComponents.path || "/") + (wsComponents.query ? "?" + wsComponents.query : "");
        wsComponents.path = void 0;
        wsComponents.query = void 0;
        return wsComponents;
      }
      function wsSerialize(wsComponents) {
        if (wsComponents.port === (isSecure(wsComponents) ? 443 : 80) || wsComponents.port === "") {
          wsComponents.port = void 0;
        }
        if (typeof wsComponents.secure === "boolean") {
          wsComponents.scheme = wsComponents.secure ? "wss" : "ws";
          wsComponents.secure = void 0;
        }
        if (wsComponents.resourceName) {
          const [path7, query] = wsComponents.resourceName.split("?");
          wsComponents.path = path7 && path7 !== "/" ? path7 : void 0;
          wsComponents.query = query;
          wsComponents.resourceName = void 0;
        }
        wsComponents.fragment = void 0;
        return wsComponents;
      }
      function urnParse(urnComponents, options) {
        if (!urnComponents.path) {
          urnComponents.error = "URN can not be parsed";
          return urnComponents;
        }
        const matches = urnComponents.path.match(URN_REG);
        if (matches) {
          const scheme = options.scheme || urnComponents.scheme || "urn";
          urnComponents.nid = matches[1].toLowerCase();
          urnComponents.nss = matches[2];
          const urnScheme = `${scheme}:${options.nid || urnComponents.nid}`;
          const schemeHandler = SCHEMES[urnScheme];
          urnComponents.path = void 0;
          if (schemeHandler) {
            urnComponents = schemeHandler.parse(urnComponents, options);
          }
        } else {
          urnComponents.error = urnComponents.error || "URN can not be parsed.";
        }
        return urnComponents;
      }
      function urnSerialize(urnComponents, options) {
        const scheme = options.scheme || urnComponents.scheme || "urn";
        const nid = urnComponents.nid.toLowerCase();
        const urnScheme = `${scheme}:${options.nid || nid}`;
        const schemeHandler = SCHEMES[urnScheme];
        if (schemeHandler) {
          urnComponents = schemeHandler.serialize(urnComponents, options);
        }
        const uriComponents = urnComponents;
        const nss = urnComponents.nss;
        uriComponents.path = `${nid || options.nid}:${nss}`;
        options.skipEscape = true;
        return uriComponents;
      }
      function urnuuidParse(urnComponents, options) {
        const uuidComponents = urnComponents;
        uuidComponents.uuid = uuidComponents.nss;
        uuidComponents.nss = void 0;
        if (!options.tolerant && (!uuidComponents.uuid || !UUID_REG.test(uuidComponents.uuid))) {
          uuidComponents.error = uuidComponents.error || "UUID is not valid.";
        }
        return uuidComponents;
      }
      function urnuuidSerialize(uuidComponents) {
        const urnComponents = uuidComponents;
        urnComponents.nss = (uuidComponents.uuid || "").toLowerCase();
        return urnComponents;
      }
      var http = {
        scheme: "http",
        domainHost: true,
        parse: httpParse,
        serialize: httpSerialize
      };
      var https = {
        scheme: "https",
        domainHost: http.domainHost,
        parse: httpParse,
        serialize: httpSerialize
      };
      var ws = {
        scheme: "ws",
        domainHost: true,
        parse: wsParse,
        serialize: wsSerialize
      };
      var wss = {
        scheme: "wss",
        domainHost: ws.domainHost,
        parse: ws.parse,
        serialize: ws.serialize
      };
      var urn = {
        scheme: "urn",
        parse: urnParse,
        serialize: urnSerialize,
        skipNormalize: true
      };
      var urnuuid = {
        scheme: "urn:uuid",
        parse: urnuuidParse,
        serialize: urnuuidSerialize,
        skipNormalize: true
      };
      var SCHEMES = {
        http,
        https,
        ws,
        wss,
        urn,
        "urn:uuid": urnuuid
      };
      module.exports = SCHEMES;
    }
  });

  // node_modules/fast-uri/index.js
  var require_fast_uri = __commonJS({
    "node_modules/fast-uri/index.js"(exports, module) {
      "use strict";
      var { normalizeIPv6, normalizeIPv4, removeDotSegments, recomposeAuthority, normalizeComponentEncoding } = require_utils();
      var SCHEMES = require_schemes();
      function normalize2(uri, options) {
        if (typeof uri === "string") {
          uri = serialize(parse(uri, options), options);
        } else if (typeof uri === "object") {
          uri = parse(serialize(uri, options), options);
        }
        return uri;
      }
      function resolve(baseURI, relativeURI, options) {
        const schemelessOptions = Object.assign({ scheme: "null" }, options);
        const resolved = resolveComponents(parse(baseURI, schemelessOptions), parse(relativeURI, schemelessOptions), schemelessOptions, true);
        return serialize(resolved, { ...schemelessOptions, skipEscape: true });
      }
      function resolveComponents(base, relative, options, skipNormalization) {
        const target = {};
        if (!skipNormalization) {
          base = parse(serialize(base, options), options);
          relative = parse(serialize(relative, options), options);
        }
        options = options || {};
        if (!options.tolerant && relative.scheme) {
          target.scheme = relative.scheme;
          target.userinfo = relative.userinfo;
          target.host = relative.host;
          target.port = relative.port;
          target.path = removeDotSegments(relative.path || "");
          target.query = relative.query;
        } else {
          if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
            target.userinfo = relative.userinfo;
            target.host = relative.host;
            target.port = relative.port;
            target.path = removeDotSegments(relative.path || "");
            target.query = relative.query;
          } else {
            if (!relative.path) {
              target.path = base.path;
              if (relative.query !== void 0) {
                target.query = relative.query;
              } else {
                target.query = base.query;
              }
            } else {
              if (relative.path.charAt(0) === "/") {
                target.path = removeDotSegments(relative.path);
              } else {
                if ((base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0) && !base.path) {
                  target.path = "/" + relative.path;
                } else if (!base.path) {
                  target.path = relative.path;
                } else {
                  target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
                }
                target.path = removeDotSegments(target.path);
              }
              target.query = relative.query;
            }
            target.userinfo = base.userinfo;
            target.host = base.host;
            target.port = base.port;
          }
          target.scheme = base.scheme;
        }
        target.fragment = relative.fragment;
        return target;
      }
      function equal(uriA, uriB, options) {
        if (typeof uriA === "string") {
          uriA = unescape(uriA);
          uriA = serialize(normalizeComponentEncoding(parse(uriA, options), true), { ...options, skipEscape: true });
        } else if (typeof uriA === "object") {
          uriA = serialize(normalizeComponentEncoding(uriA, true), { ...options, skipEscape: true });
        }
        if (typeof uriB === "string") {
          uriB = unescape(uriB);
          uriB = serialize(normalizeComponentEncoding(parse(uriB, options), true), { ...options, skipEscape: true });
        } else if (typeof uriB === "object") {
          uriB = serialize(normalizeComponentEncoding(uriB, true), { ...options, skipEscape: true });
        }
        return uriA.toLowerCase() === uriB.toLowerCase();
      }
      function serialize(cmpts, opts) {
        const components = {
          host: cmpts.host,
          scheme: cmpts.scheme,
          userinfo: cmpts.userinfo,
          port: cmpts.port,
          path: cmpts.path,
          query: cmpts.query,
          nid: cmpts.nid,
          nss: cmpts.nss,
          uuid: cmpts.uuid,
          fragment: cmpts.fragment,
          reference: cmpts.reference,
          resourceName: cmpts.resourceName,
          secure: cmpts.secure,
          error: ""
        };
        const options = Object.assign({}, opts);
        const uriTokens = [];
        const schemeHandler = SCHEMES[(options.scheme || components.scheme || "").toLowerCase()];
        if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(components, options);
        if (components.path !== void 0) {
          if (!options.skipEscape) {
            components.path = escape(components.path);
            if (components.scheme !== void 0) {
              components.path = components.path.split("%3A").join(":");
            }
          } else {
            components.path = unescape(components.path);
          }
        }
        if (options.reference !== "suffix" && components.scheme) {
          uriTokens.push(components.scheme, ":");
        }
        const authority = recomposeAuthority(components);
        if (authority !== void 0) {
          if (options.reference !== "suffix") {
            uriTokens.push("//");
          }
          uriTokens.push(authority);
          if (components.path && components.path.charAt(0) !== "/") {
            uriTokens.push("/");
          }
        }
        if (components.path !== void 0) {
          let s = components.path;
          if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
            s = removeDotSegments(s);
          }
          if (authority === void 0) {
            s = s.replace(/^\/\//u, "/%2F");
          }
          uriTokens.push(s);
        }
        if (components.query !== void 0) {
          uriTokens.push("?", components.query);
        }
        if (components.fragment !== void 0) {
          uriTokens.push("#", components.fragment);
        }
        return uriTokens.join("");
      }
      var hexLookUp = Array.from({ length: 127 }, (_v, k) => /[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(k)));
      function nonSimpleDomain(value) {
        let code = 0;
        for (let i = 0, len = value.length; i < len; ++i) {
          code = value.charCodeAt(i);
          if (code > 126 || hexLookUp[code]) {
            return true;
          }
        }
        return false;
      }
      var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
      function parse(uri, opts) {
        const options = Object.assign({}, opts);
        const parsed = {
          scheme: void 0,
          userinfo: void 0,
          host: "",
          port: void 0,
          path: "",
          query: void 0,
          fragment: void 0
        };
        const gotEncoding = uri.indexOf("%") !== -1;
        let isIP = false;
        if (options.reference === "suffix") uri = (options.scheme ? options.scheme + ":" : "") + "//" + uri;
        const matches = uri.match(URI_PARSE);
        if (matches) {
          parsed.scheme = matches[1];
          parsed.userinfo = matches[3];
          parsed.host = matches[4];
          parsed.port = parseInt(matches[5], 10);
          parsed.path = matches[6] || "";
          parsed.query = matches[7];
          parsed.fragment = matches[8];
          if (isNaN(parsed.port)) {
            parsed.port = matches[5];
          }
          if (parsed.host) {
            const ipv4result = normalizeIPv4(parsed.host);
            if (ipv4result.isIPV4 === false) {
              const ipv6result = normalizeIPv6(ipv4result.host);
              parsed.host = ipv6result.host.toLowerCase();
              isIP = ipv6result.isIPV6;
            } else {
              parsed.host = ipv4result.host;
              isIP = true;
            }
          }
          if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) {
            parsed.reference = "same-document";
          } else if (parsed.scheme === void 0) {
            parsed.reference = "relative";
          } else if (parsed.fragment === void 0) {
            parsed.reference = "absolute";
          } else {
            parsed.reference = "uri";
          }
          if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) {
            parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
          }
          const schemeHandler = SCHEMES[(options.scheme || parsed.scheme || "").toLowerCase()];
          if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
            if (parsed.host && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) {
              try {
                parsed.host = URL.domainToASCII(parsed.host.toLowerCase());
              } catch (e) {
                parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
              }
            }
          }
          if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
            if (gotEncoding && parsed.scheme !== void 0) {
              parsed.scheme = unescape(parsed.scheme);
            }
            if (gotEncoding && parsed.host !== void 0) {
              parsed.host = unescape(parsed.host);
            }
            if (parsed.path) {
              parsed.path = escape(unescape(parsed.path));
            }
            if (parsed.fragment) {
              parsed.fragment = encodeURI(decodeURIComponent(parsed.fragment));
            }
          }
          if (schemeHandler && schemeHandler.parse) {
            schemeHandler.parse(parsed, options);
          }
        } else {
          parsed.error = parsed.error || "URI can not be parsed.";
        }
        return parsed;
      }
      var fastUri = {
        SCHEMES,
        normalize: normalize2,
        resolve,
        resolveComponents,
        equal,
        serialize,
        parse
      };
      module.exports = fastUri;
      module.exports.default = fastUri;
      module.exports.fastUri = fastUri;
    }
  });

  // node_modules/ajv/dist/runtime/uri.js
  var require_uri = __commonJS({
    "node_modules/ajv/dist/runtime/uri.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var uri = require_fast_uri();
      uri.code = 'require("ajv/dist/runtime/uri").default';
      exports.default = uri;
    }
  });

  // node_modules/ajv/dist/core.js
  var require_core = __commonJS({
    "node_modules/ajv/dist/core.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
      var validate_1 = require_validate();
      Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
        return validate_1.KeywordCxt;
      } });
      var codegen_1 = require_codegen();
      Object.defineProperty(exports, "_", { enumerable: true, get: function() {
        return codegen_1._;
      } });
      Object.defineProperty(exports, "str", { enumerable: true, get: function() {
        return codegen_1.str;
      } });
      Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
        return codegen_1.stringify;
      } });
      Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
        return codegen_1.nil;
      } });
      Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
        return codegen_1.Name;
      } });
      Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
        return codegen_1.CodeGen;
      } });
      var validation_error_1 = require_validation_error();
      var ref_error_1 = require_ref_error();
      var rules_1 = require_rules();
      var compile_1 = require_compile();
      var codegen_2 = require_codegen();
      var resolve_1 = require_resolve();
      var dataType_1 = require_dataType();
      var util_1 = require_util2();
      var $dataRefSchema = require_data();
      var uri_1 = require_uri();
      var defaultRegExp = (str, flags) => new RegExp(str, flags);
      defaultRegExp.code = "new RegExp";
      var META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
      var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
        "validate",
        "serialize",
        "parse",
        "wrapper",
        "root",
        "schema",
        "keyword",
        "pattern",
        "formats",
        "validate$data",
        "func",
        "obj",
        "Error"
      ]);
      var removedOptions = {
        errorDataPath: "",
        format: "`validateFormats: false` can be used instead.",
        nullable: '"nullable" keyword is supported by default.',
        jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
        extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
        missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
        processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
        sourceCode: "Use option `code: {source: true}`",
        strictDefaults: "It is default now, see option `strict`.",
        strictKeywords: "It is default now, see option `strict`.",
        uniqueItems: '"uniqueItems" keyword is always validated.',
        unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
        cache: "Map is used as cache, schema object as key.",
        serialize: "Map is used as cache, schema object as key.",
        ajvErrors: "It is default now."
      };
      var deprecatedOptions = {
        ignoreKeywordsWithRef: "",
        jsPropertySyntax: "",
        unicode: '"minLength"/"maxLength" account for unicode characters by default.'
      };
      var MAX_EXPRESSION = 200;
      function requiredOptions(o) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
        const s = o.strict;
        const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
        const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
        const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
        const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
        return {
          strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
          strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
          strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
          strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
          strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
          code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
          loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
          loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
          meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
          messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
          inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
          schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
          addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
          validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
          validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
          unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
          int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
          uriResolver
        };
      }
      var Ajv2 = class {
        constructor(opts = {}) {
          this.schemas = {};
          this.refs = {};
          this.formats = {};
          this._compilations = /* @__PURE__ */ new Set();
          this._loading = {};
          this._cache = /* @__PURE__ */ new Map();
          opts = this.opts = { ...opts, ...requiredOptions(opts) };
          const { es5, lines } = this.opts.code;
          this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
          this.logger = getLogger(opts.logger);
          const formatOpt = opts.validateFormats;
          opts.validateFormats = false;
          this.RULES = (0, rules_1.getRules)();
          checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
          checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
          this._metaOpts = getMetaSchemaOptions.call(this);
          if (opts.formats)
            addInitialFormats.call(this);
          this._addVocabularies();
          this._addDefaultMetaSchema();
          if (opts.keywords)
            addInitialKeywords.call(this, opts.keywords);
          if (typeof opts.meta == "object")
            this.addMetaSchema(opts.meta);
          addInitialSchemas.call(this);
          opts.validateFormats = formatOpt;
        }
        _addVocabularies() {
          this.addKeyword("$async");
        }
        _addDefaultMetaSchema() {
          const { $data, meta, schemaId } = this.opts;
          let _dataRefSchema = $dataRefSchema;
          if (schemaId === "id") {
            _dataRefSchema = { ...$dataRefSchema };
            _dataRefSchema.id = _dataRefSchema.$id;
            delete _dataRefSchema.$id;
          }
          if (meta && $data)
            this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
        }
        defaultMeta() {
          const { meta, schemaId } = this.opts;
          return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
        }
        validate(schemaKeyRef, data) {
          let v;
          if (typeof schemaKeyRef == "string") {
            v = this.getSchema(schemaKeyRef);
            if (!v)
              throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
          } else {
            v = this.compile(schemaKeyRef);
          }
          const valid = v(data);
          if (!("$async" in v))
            this.errors = v.errors;
          return valid;
        }
        compile(schema2, _meta) {
          const sch = this._addSchema(schema2, _meta);
          return sch.validate || this._compileSchemaEnv(sch);
        }
        compileAsync(schema2, meta) {
          if (typeof this.opts.loadSchema != "function") {
            throw new Error("options.loadSchema should be a function");
          }
          const { loadSchema } = this.opts;
          return runCompileAsync.call(this, schema2, meta);
          async function runCompileAsync(_schema, _meta) {
            await loadMetaSchema.call(this, _schema.$schema);
            const sch = this._addSchema(_schema, _meta);
            return sch.validate || _compileAsync.call(this, sch);
          }
          async function loadMetaSchema($ref) {
            if ($ref && !this.getSchema($ref)) {
              await runCompileAsync.call(this, { $ref }, true);
            }
          }
          async function _compileAsync(sch) {
            try {
              return this._compileSchemaEnv(sch);
            } catch (e) {
              if (!(e instanceof ref_error_1.default))
                throw e;
              checkLoaded.call(this, e);
              await loadMissingSchema.call(this, e.missingSchema);
              return _compileAsync.call(this, sch);
            }
          }
          function checkLoaded({ missingSchema: ref, missingRef }) {
            if (this.refs[ref]) {
              throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
            }
          }
          async function loadMissingSchema(ref) {
            const _schema = await _loadSchema.call(this, ref);
            if (!this.refs[ref])
              await loadMetaSchema.call(this, _schema.$schema);
            if (!this.refs[ref])
              this.addSchema(_schema, ref, meta);
          }
          async function _loadSchema(ref) {
            const p = this._loading[ref];
            if (p)
              return p;
            try {
              return await (this._loading[ref] = loadSchema(ref));
            } finally {
              delete this._loading[ref];
            }
          }
        }
        // Adds schema to the instance
        addSchema(schema2, key, _meta, _validateSchema = this.opts.validateSchema) {
          if (Array.isArray(schema2)) {
            for (const sch of schema2)
              this.addSchema(sch, void 0, _meta, _validateSchema);
            return this;
          }
          let id;
          if (typeof schema2 === "object") {
            const { schemaId } = this.opts;
            id = schema2[schemaId];
            if (id !== void 0 && typeof id != "string") {
              throw new Error(`schema ${schemaId} must be string`);
            }
          }
          key = (0, resolve_1.normalizeId)(key || id);
          this._checkUnique(key);
          this.schemas[key] = this._addSchema(schema2, _meta, key, _validateSchema, true);
          return this;
        }
        // Add schema that will be used to validate other schemas
        // options in META_IGNORE_OPTIONS are alway set to false
        addMetaSchema(schema2, key, _validateSchema = this.opts.validateSchema) {
          this.addSchema(schema2, key, true, _validateSchema);
          return this;
        }
        //  Validate schema against its meta-schema
        validateSchema(schema2, throwOrLogError) {
          if (typeof schema2 == "boolean")
            return true;
          let $schema;
          $schema = schema2.$schema;
          if ($schema !== void 0 && typeof $schema != "string") {
            throw new Error("$schema must be a string");
          }
          $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
          if (!$schema) {
            this.logger.warn("meta-schema not available");
            this.errors = null;
            return true;
          }
          const valid = this.validate($schema, schema2);
          if (!valid && throwOrLogError) {
            const message = "schema is invalid: " + this.errorsText();
            if (this.opts.validateSchema === "log")
              this.logger.error(message);
            else
              throw new Error(message);
          }
          return valid;
        }
        // Get compiled schema by `key` or `ref`.
        // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
        getSchema(keyRef) {
          let sch;
          while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
            keyRef = sch;
          if (sch === void 0) {
            const { schemaId } = this.opts;
            const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
            sch = compile_1.resolveSchema.call(this, root, keyRef);
            if (!sch)
              return;
            this.refs[keyRef] = sch;
          }
          return sch.validate || this._compileSchemaEnv(sch);
        }
        // Remove cached schema(s).
        // If no parameter is passed all schemas but meta-schemas are removed.
        // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
        // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
        removeSchema(schemaKeyRef) {
          if (schemaKeyRef instanceof RegExp) {
            this._removeAllSchemas(this.schemas, schemaKeyRef);
            this._removeAllSchemas(this.refs, schemaKeyRef);
            return this;
          }
          switch (typeof schemaKeyRef) {
            case "undefined":
              this._removeAllSchemas(this.schemas);
              this._removeAllSchemas(this.refs);
              this._cache.clear();
              return this;
            case "string": {
              const sch = getSchEnv.call(this, schemaKeyRef);
              if (typeof sch == "object")
                this._cache.delete(sch.schema);
              delete this.schemas[schemaKeyRef];
              delete this.refs[schemaKeyRef];
              return this;
            }
            case "object": {
              const cacheKey = schemaKeyRef;
              this._cache.delete(cacheKey);
              let id = schemaKeyRef[this.opts.schemaId];
              if (id) {
                id = (0, resolve_1.normalizeId)(id);
                delete this.schemas[id];
                delete this.refs[id];
              }
              return this;
            }
            default:
              throw new Error("ajv.removeSchema: invalid parameter");
          }
        }
        // add "vocabulary" - a collection of keywords
        addVocabulary(definitions) {
          for (const def of definitions)
            this.addKeyword(def);
          return this;
        }
        addKeyword(kwdOrDef, def) {
          let keyword;
          if (typeof kwdOrDef == "string") {
            keyword = kwdOrDef;
            if (typeof def == "object") {
              this.logger.warn("these parameters are deprecated, see docs for addKeyword");
              def.keyword = keyword;
            }
          } else if (typeof kwdOrDef == "object" && def === void 0) {
            def = kwdOrDef;
            keyword = def.keyword;
            if (Array.isArray(keyword) && !keyword.length) {
              throw new Error("addKeywords: keyword must be string or non-empty array");
            }
          } else {
            throw new Error("invalid addKeywords parameters");
          }
          checkKeyword.call(this, keyword, def);
          if (!def) {
            (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
            return this;
          }
          keywordMetaschema.call(this, def);
          const definition = {
            ...def,
            type: (0, dataType_1.getJSONTypes)(def.type),
            schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
          };
          (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
          return this;
        }
        getKeyword(keyword) {
          const rule = this.RULES.all[keyword];
          return typeof rule == "object" ? rule.definition : !!rule;
        }
        // Remove keyword
        removeKeyword(keyword) {
          const { RULES } = this;
          delete RULES.keywords[keyword];
          delete RULES.all[keyword];
          for (const group of RULES.rules) {
            const i = group.rules.findIndex((rule) => rule.keyword === keyword);
            if (i >= 0)
              group.rules.splice(i, 1);
          }
          return this;
        }
        // Add format
        addFormat(name2, format) {
          if (typeof format == "string")
            format = new RegExp(format);
          this.formats[name2] = format;
          return this;
        }
        errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
          if (!errors || errors.length === 0)
            return "No errors";
          return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
        }
        $dataMetaSchema(metaSchema, keywordsJsonPointers) {
          const rules = this.RULES.all;
          metaSchema = JSON.parse(JSON.stringify(metaSchema));
          for (const jsonPointer of keywordsJsonPointers) {
            const segments = jsonPointer.split("/").slice(1);
            let keywords = metaSchema;
            for (const seg of segments)
              keywords = keywords[seg];
            for (const key in rules) {
              const rule = rules[key];
              if (typeof rule != "object")
                continue;
              const { $data } = rule.definition;
              const schema2 = keywords[key];
              if ($data && schema2)
                keywords[key] = schemaOrData(schema2);
            }
          }
          return metaSchema;
        }
        _removeAllSchemas(schemas, regex) {
          for (const keyRef in schemas) {
            const sch = schemas[keyRef];
            if (!regex || regex.test(keyRef)) {
              if (typeof sch == "string") {
                delete schemas[keyRef];
              } else if (sch && !sch.meta) {
                this._cache.delete(sch.schema);
                delete schemas[keyRef];
              }
            }
          }
        }
        _addSchema(schema2, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
          let id;
          const { schemaId } = this.opts;
          if (typeof schema2 == "object") {
            id = schema2[schemaId];
          } else {
            if (this.opts.jtd)
              throw new Error("schema must be object");
            else if (typeof schema2 != "boolean")
              throw new Error("schema must be object or boolean");
          }
          let sch = this._cache.get(schema2);
          if (sch !== void 0)
            return sch;
          baseId = (0, resolve_1.normalizeId)(id || baseId);
          const localRefs = resolve_1.getSchemaRefs.call(this, schema2, baseId);
          sch = new compile_1.SchemaEnv({ schema: schema2, schemaId, meta, baseId, localRefs });
          this._cache.set(sch.schema, sch);
          if (addSchema && !baseId.startsWith("#")) {
            if (baseId)
              this._checkUnique(baseId);
            this.refs[baseId] = sch;
          }
          if (validateSchema)
            this.validateSchema(schema2, true);
          return sch;
        }
        _checkUnique(id) {
          if (this.schemas[id] || this.refs[id]) {
            throw new Error(`schema with key or id "${id}" already exists`);
          }
        }
        _compileSchemaEnv(sch) {
          if (sch.meta)
            this._compileMetaSchema(sch);
          else
            compile_1.compileSchema.call(this, sch);
          if (!sch.validate)
            throw new Error("ajv implementation error");
          return sch.validate;
        }
        _compileMetaSchema(sch) {
          const currentOpts = this.opts;
          this.opts = this._metaOpts;
          try {
            compile_1.compileSchema.call(this, sch);
          } finally {
            this.opts = currentOpts;
          }
        }
      };
      Ajv2.ValidationError = validation_error_1.default;
      Ajv2.MissingRefError = ref_error_1.default;
      exports.default = Ajv2;
      function checkOptions(checkOpts, options, msg, log = "error") {
        for (const key in checkOpts) {
          const opt = key;
          if (opt in options)
            this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
        }
      }
      function getSchEnv(keyRef) {
        keyRef = (0, resolve_1.normalizeId)(keyRef);
        return this.schemas[keyRef] || this.refs[keyRef];
      }
      function addInitialSchemas() {
        const optsSchemas = this.opts.schemas;
        if (!optsSchemas)
          return;
        if (Array.isArray(optsSchemas))
          this.addSchema(optsSchemas);
        else
          for (const key in optsSchemas)
            this.addSchema(optsSchemas[key], key);
      }
      function addInitialFormats() {
        for (const name2 in this.opts.formats) {
          const format = this.opts.formats[name2];
          if (format)
            this.addFormat(name2, format);
        }
      }
      function addInitialKeywords(defs) {
        if (Array.isArray(defs)) {
          this.addVocabulary(defs);
          return;
        }
        this.logger.warn("keywords option as map is deprecated, pass array");
        for (const keyword in defs) {
          const def = defs[keyword];
          if (!def.keyword)
            def.keyword = keyword;
          this.addKeyword(def);
        }
      }
      function getMetaSchemaOptions() {
        const metaOpts = { ...this.opts };
        for (const opt of META_IGNORE_OPTIONS)
          delete metaOpts[opt];
        return metaOpts;
      }
      var noLogs = { log() {
      }, warn() {
      }, error() {
      } };
      function getLogger(logger) {
        if (logger === false)
          return noLogs;
        if (logger === void 0)
          return console;
        if (logger.log && logger.warn && logger.error)
          return logger;
        throw new Error("logger must implement log, warn and error methods");
      }
      var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
      function checkKeyword(keyword, def) {
        const { RULES } = this;
        (0, util_1.eachItem)(keyword, (kwd) => {
          if (RULES.keywords[kwd])
            throw new Error(`Keyword ${kwd} is already defined`);
          if (!KEYWORD_NAME.test(kwd))
            throw new Error(`Keyword ${kwd} has invalid name`);
        });
        if (!def)
          return;
        if (def.$data && !("code" in def || "validate" in def)) {
          throw new Error('$data keyword must have "code" or "validate" function');
        }
      }
      function addRule(keyword, definition, dataType) {
        var _a;
        const post = definition === null || definition === void 0 ? void 0 : definition.post;
        if (dataType && post)
          throw new Error('keyword with "post" flag cannot have "type"');
        const { RULES } = this;
        let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
        if (!ruleGroup) {
          ruleGroup = { type: dataType, rules: [] };
          RULES.rules.push(ruleGroup);
        }
        RULES.keywords[keyword] = true;
        if (!definition)
          return;
        const rule = {
          keyword,
          definition: {
            ...definition,
            type: (0, dataType_1.getJSONTypes)(definition.type),
            schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
          }
        };
        if (definition.before)
          addBeforeRule.call(this, ruleGroup, rule, definition.before);
        else
          ruleGroup.rules.push(rule);
        RULES.all[keyword] = rule;
        (_a = definition.implements) === null || _a === void 0 ? void 0 : _a.forEach((kwd) => this.addKeyword(kwd));
      }
      function addBeforeRule(ruleGroup, rule, before) {
        const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
        if (i >= 0) {
          ruleGroup.rules.splice(i, 0, rule);
        } else {
          ruleGroup.rules.push(rule);
          this.logger.warn(`rule ${before} is not defined`);
        }
      }
      function keywordMetaschema(def) {
        let { metaSchema } = def;
        if (metaSchema === void 0)
          return;
        if (def.$data && this.opts.$data)
          metaSchema = schemaOrData(metaSchema);
        def.validateSchema = this.compile(metaSchema, true);
      }
      var $dataRef = {
        $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
      };
      function schemaOrData(schema2) {
        return { anyOf: [schema2, $dataRef] };
      }
    }
  });

  // node_modules/ajv/dist/vocabularies/core/id.js
  var require_id = __commonJS({
    "node_modules/ajv/dist/vocabularies/core/id.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var def = {
        keyword: "id",
        code() {
          throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/core/ref.js
  var require_ref = __commonJS({
    "node_modules/ajv/dist/vocabularies/core/ref.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.callRef = exports.getValidate = void 0;
      var ref_error_1 = require_ref_error();
      var code_1 = require_code2();
      var codegen_1 = require_codegen();
      var names_1 = require_names();
      var compile_1 = require_compile();
      var util_1 = require_util2();
      var def = {
        keyword: "$ref",
        schemaType: "string",
        code(cxt) {
          const { gen, schema: $ref, it } = cxt;
          const { baseId, schemaEnv: env, validateName, opts, self } = it;
          const { root } = env;
          if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
            return callRootRef();
          const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
          if (schOrEnv === void 0)
            throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
          if (schOrEnv instanceof compile_1.SchemaEnv)
            return callValidate(schOrEnv);
          return inlineRefSchema(schOrEnv);
          function callRootRef() {
            if (env === root)
              return callRef(cxt, validateName, env, env.$async);
            const rootName = gen.scopeValue("root", { ref: root });
            return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
          }
          function callValidate(sch) {
            const v = getValidate(cxt, sch);
            callRef(cxt, v, sch, sch.$async);
          }
          function inlineRefSchema(sch) {
            const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
            const valid = gen.name("valid");
            const schCxt = cxt.subschema({
              schema: sch,
              dataTypes: [],
              schemaPath: codegen_1.nil,
              topSchemaRef: schName,
              errSchemaPath: $ref
            }, valid);
            cxt.mergeEvaluated(schCxt);
            cxt.ok(valid);
          }
        }
      };
      function getValidate(cxt, sch) {
        const { gen } = cxt;
        return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
      }
      exports.getValidate = getValidate;
      function callRef(cxt, v, sch, $async) {
        const { gen, it } = cxt;
        const { allErrors, schemaEnv: env, opts } = it;
        const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
        if ($async)
          callAsyncRef();
        else
          callSyncRef();
        function callAsyncRef() {
          if (!env.$async)
            throw new Error("async schema referenced by sync schema");
          const valid = gen.let("valid");
          gen.try(() => {
            gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
            addEvaluatedFrom(v);
            if (!allErrors)
              gen.assign(valid, true);
          }, (e) => {
            gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
            addErrorsFrom(e);
            if (!allErrors)
              gen.assign(valid, false);
          });
          cxt.ok(valid);
        }
        function callSyncRef() {
          cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
        }
        function addErrorsFrom(source) {
          const errs = (0, codegen_1._)`${source}.errors`;
          gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
          gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
        }
        function addEvaluatedFrom(source) {
          var _a;
          if (!it.opts.unevaluated)
            return;
          const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
          if (it.props !== true) {
            if (schEvaluated && !schEvaluated.dynamicProps) {
              if (schEvaluated.props !== void 0) {
                it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
              }
            } else {
              const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
              it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
            }
          }
          if (it.items !== true) {
            if (schEvaluated && !schEvaluated.dynamicItems) {
              if (schEvaluated.items !== void 0) {
                it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
              }
            } else {
              const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
              it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
            }
          }
        }
      }
      exports.callRef = callRef;
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/core/index.js
  var require_core2 = __commonJS({
    "node_modules/ajv/dist/vocabularies/core/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var id_1 = require_id();
      var ref_1 = require_ref();
      var core = [
        "$schema",
        "$id",
        "$defs",
        "$vocabulary",
        { keyword: "$comment" },
        "definitions",
        id_1.default,
        ref_1.default
      ];
      exports.default = core;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/limitNumber.js
  var require_limitNumber = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/limitNumber.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var ops = codegen_1.operators;
      var KWDs = {
        maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
        minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
        exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
        exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
      };
      var error = {
        message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
        params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
      };
      var def = {
        keyword: Object.keys(KWDs),
        type: "number",
        schemaType: "number",
        $data: true,
        error,
        code(cxt) {
          const { keyword, data, schemaCode } = cxt;
          cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/multipleOf.js
  var require_multipleOf = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/multipleOf.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var error = {
        message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
        params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
      };
      var def = {
        keyword: "multipleOf",
        type: "number",
        schemaType: "number",
        $data: true,
        error,
        code(cxt) {
          const { gen, data, schemaCode, it } = cxt;
          const prec = it.opts.multipleOfPrecision;
          const res = gen.let("res");
          const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
          cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/runtime/ucs2length.js
  var require_ucs2length = __commonJS({
    "node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      function ucs2length(str) {
        const len = str.length;
        let length = 0;
        let pos = 0;
        let value;
        while (pos < len) {
          length++;
          value = str.charCodeAt(pos++);
          if (value >= 55296 && value <= 56319 && pos < len) {
            value = str.charCodeAt(pos);
            if ((value & 64512) === 56320)
              pos++;
          }
        }
        return length;
      }
      exports.default = ucs2length;
      ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/limitLength.js
  var require_limitLength = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/limitLength.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      var ucs2length_1 = require_ucs2length();
      var error = {
        message({ keyword, schemaCode }) {
          const comp = keyword === "maxLength" ? "more" : "fewer";
          return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
        },
        params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
      };
      var def = {
        keyword: ["maxLength", "minLength"],
        type: "string",
        schemaType: "number",
        $data: true,
        error,
        code(cxt) {
          const { keyword, data, schemaCode, it } = cxt;
          const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
          const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
          cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/pattern.js
  var require_pattern = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/pattern.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var code_1 = require_code2();
      var codegen_1 = require_codegen();
      var error = {
        message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
        params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
      };
      var def = {
        keyword: "pattern",
        type: "string",
        schemaType: "string",
        $data: true,
        error,
        code(cxt) {
          const { data, $data, schema: schema2, schemaCode, it } = cxt;
          const u = it.opts.unicodeRegExp ? "u" : "";
          const regExp = $data ? (0, codegen_1._)`(new RegExp(${schemaCode}, ${u}))` : (0, code_1.usePattern)(cxt, schema2);
          cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/limitProperties.js
  var require_limitProperties = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/limitProperties.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var error = {
        message({ keyword, schemaCode }) {
          const comp = keyword === "maxProperties" ? "more" : "fewer";
          return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
        },
        params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
      };
      var def = {
        keyword: ["maxProperties", "minProperties"],
        type: "object",
        schemaType: "number",
        $data: true,
        error,
        code(cxt) {
          const { keyword, data, schemaCode } = cxt;
          const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
          cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/required.js
  var require_required = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/required.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var code_1 = require_code2();
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      var error = {
        message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
        params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
      };
      var def = {
        keyword: "required",
        type: "object",
        schemaType: "array",
        $data: true,
        error,
        code(cxt) {
          const { gen, schema: schema2, schemaCode, data, $data, it } = cxt;
          const { opts } = it;
          if (!$data && schema2.length === 0)
            return;
          const useLoop = schema2.length >= opts.loopRequired;
          if (it.allErrors)
            allErrorsMode();
          else
            exitOnErrorMode();
          if (opts.strictRequired) {
            const props = cxt.parentSchema.properties;
            const { definedProperties } = cxt.it;
            for (const requiredKey of schema2) {
              if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
                const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
                const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
                (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
              }
            }
          }
          function allErrorsMode() {
            if (useLoop || $data) {
              cxt.block$data(codegen_1.nil, loopAllRequired);
            } else {
              for (const prop of schema2) {
                (0, code_1.checkReportMissingProp)(cxt, prop);
              }
            }
          }
          function exitOnErrorMode() {
            const missing = gen.let("missing");
            if (useLoop || $data) {
              const valid = gen.let("valid", true);
              cxt.block$data(valid, () => loopUntilMissing(missing, valid));
              cxt.ok(valid);
            } else {
              gen.if((0, code_1.checkMissingProp)(cxt, schema2, missing));
              (0, code_1.reportMissingProp)(cxt, missing);
              gen.else();
            }
          }
          function loopAllRequired() {
            gen.forOf("prop", schemaCode, (prop) => {
              cxt.setParams({ missingProperty: prop });
              gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
            });
          }
          function loopUntilMissing(missing, valid) {
            cxt.setParams({ missingProperty: missing });
            gen.forOf(missing, schemaCode, () => {
              gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
              gen.if((0, codegen_1.not)(valid), () => {
                cxt.error();
                gen.break();
              });
            }, codegen_1.nil);
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/limitItems.js
  var require_limitItems = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/limitItems.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var error = {
        message({ keyword, schemaCode }) {
          const comp = keyword === "maxItems" ? "more" : "fewer";
          return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
        },
        params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
      };
      var def = {
        keyword: ["maxItems", "minItems"],
        type: "array",
        schemaType: "number",
        $data: true,
        error,
        code(cxt) {
          const { keyword, data, schemaCode } = cxt;
          const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
          cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/runtime/equal.js
  var require_equal = __commonJS({
    "node_modules/ajv/dist/runtime/equal.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var equal = require_fast_deep_equal();
      equal.code = 'require("ajv/dist/runtime/equal").default';
      exports.default = equal;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
  var require_uniqueItems = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/uniqueItems.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var dataType_1 = require_dataType();
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      var equal_1 = require_equal();
      var error = {
        message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
        params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
      };
      var def = {
        keyword: "uniqueItems",
        type: "array",
        schemaType: "boolean",
        $data: true,
        error,
        code(cxt) {
          const { gen, data, $data, schema: schema2, parentSchema, schemaCode, it } = cxt;
          if (!$data && !schema2)
            return;
          const valid = gen.let("valid");
          const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
          cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
          cxt.ok(valid);
          function validateUniqueItems() {
            const i = gen.let("i", (0, codegen_1._)`${data}.length`);
            const j = gen.let("j");
            cxt.setParams({ i, j });
            gen.assign(valid, true);
            gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
          }
          function canOptimize() {
            return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
          }
          function loopN(i, j) {
            const item = gen.name("item");
            const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
            const indices = gen.const("indices", (0, codegen_1._)`{}`);
            gen.for((0, codegen_1._)`;${i}--;`, () => {
              gen.let(item, (0, codegen_1._)`${data}[${i}]`);
              gen.if(wrongType, (0, codegen_1._)`continue`);
              if (itemTypes.length > 1)
                gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
              gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
                gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
                cxt.error();
                gen.assign(valid, false).break();
              }).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
            });
          }
          function loopN2(i, j) {
            const eql = (0, util_1.useFunc)(gen, equal_1.default);
            const outer = gen.name("outer");
            gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
              cxt.error();
              gen.assign(valid, false).break(outer);
            })));
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/const.js
  var require_const = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/const.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      var equal_1 = require_equal();
      var error = {
        message: "must be equal to constant",
        params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
      };
      var def = {
        keyword: "const",
        $data: true,
        error,
        code(cxt) {
          const { gen, data, $data, schemaCode, schema: schema2 } = cxt;
          if ($data || schema2 && typeof schema2 == "object") {
            cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
          } else {
            cxt.fail((0, codegen_1._)`${schema2} !== ${data}`);
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/enum.js
  var require_enum = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/enum.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      var equal_1 = require_equal();
      var error = {
        message: "must be equal to one of the allowed values",
        params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
      };
      var def = {
        keyword: "enum",
        schemaType: "array",
        $data: true,
        error,
        code(cxt) {
          const { gen, data, $data, schema: schema2, schemaCode, it } = cxt;
          if (!$data && schema2.length === 0)
            throw new Error("enum must have non-empty array");
          const useLoop = schema2.length >= it.opts.loopEnum;
          let eql;
          const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
          let valid;
          if (useLoop || $data) {
            valid = gen.let("valid");
            cxt.block$data(valid, loopEnum);
          } else {
            if (!Array.isArray(schema2))
              throw new Error("ajv implementation error");
            const vSchema = gen.const("vSchema", schemaCode);
            valid = (0, codegen_1.or)(...schema2.map((_x, i) => equalCode(vSchema, i)));
          }
          cxt.pass(valid);
          function loopEnum() {
            gen.assign(valid, false);
            gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
          }
          function equalCode(vSchema, i) {
            const sch = schema2[i];
            return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/validation/index.js
  var require_validation = __commonJS({
    "node_modules/ajv/dist/vocabularies/validation/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var limitNumber_1 = require_limitNumber();
      var multipleOf_1 = require_multipleOf();
      var limitLength_1 = require_limitLength();
      var pattern_1 = require_pattern();
      var limitProperties_1 = require_limitProperties();
      var required_1 = require_required();
      var limitItems_1 = require_limitItems();
      var uniqueItems_1 = require_uniqueItems();
      var const_1 = require_const();
      var enum_1 = require_enum();
      var validation = [
        // number
        limitNumber_1.default,
        multipleOf_1.default,
        // string
        limitLength_1.default,
        pattern_1.default,
        // object
        limitProperties_1.default,
        required_1.default,
        // array
        limitItems_1.default,
        uniqueItems_1.default,
        // any
        { keyword: "type", schemaType: ["string", "array"] },
        { keyword: "nullable", schemaType: "boolean" },
        const_1.default,
        enum_1.default
      ];
      exports.default = validation;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
  var require_additionalItems = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/additionalItems.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.validateAdditionalItems = void 0;
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      var error = {
        message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
        params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
      };
      var def = {
        keyword: "additionalItems",
        type: "array",
        schemaType: ["boolean", "object"],
        before: "uniqueItems",
        error,
        code(cxt) {
          const { parentSchema, it } = cxt;
          const { items } = parentSchema;
          if (!Array.isArray(items)) {
            (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
            return;
          }
          validateAdditionalItems(cxt, items);
        }
      };
      function validateAdditionalItems(cxt, items) {
        const { gen, schema: schema2, data, keyword, it } = cxt;
        it.items = true;
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        if (schema2 === false) {
          cxt.setParams({ len: items.length });
          cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
        } else if (typeof schema2 == "object" && !(0, util_1.alwaysValidSchema)(it, schema2)) {
          const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
          gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
          cxt.ok(valid);
        }
        function validateItems(valid) {
          gen.forRange("i", items.length, len, (i) => {
            cxt.subschema({ keyword, dataProp: i, dataPropType: util_1.Type.Num }, valid);
            if (!it.allErrors)
              gen.if((0, codegen_1.not)(valid), () => gen.break());
          });
        }
      }
      exports.validateAdditionalItems = validateAdditionalItems;
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/items.js
  var require_items = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/items.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.validateTuple = void 0;
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      var code_1 = require_code2();
      var def = {
        keyword: "items",
        type: "array",
        schemaType: ["object", "array", "boolean"],
        before: "uniqueItems",
        code(cxt) {
          const { schema: schema2, it } = cxt;
          if (Array.isArray(schema2))
            return validateTuple(cxt, "additionalItems", schema2);
          it.items = true;
          if ((0, util_1.alwaysValidSchema)(it, schema2))
            return;
          cxt.ok((0, code_1.validateArray)(cxt));
        }
      };
      function validateTuple(cxt, extraItems, schArr = cxt.schema) {
        const { gen, parentSchema, data, keyword, it } = cxt;
        checkStrictTuple(parentSchema);
        if (it.opts.unevaluated && schArr.length && it.items !== true) {
          it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
        }
        const valid = gen.name("valid");
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        schArr.forEach((sch, i) => {
          if ((0, util_1.alwaysValidSchema)(it, sch))
            return;
          gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
            keyword,
            schemaProp: i,
            dataProp: i
          }, valid));
          cxt.ok(valid);
        });
        function checkStrictTuple(sch) {
          const { opts, errSchemaPath } = it;
          const l = schArr.length;
          const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
          if (opts.strictTuples && !fullTuple) {
            const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
            (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
          }
        }
      }
      exports.validateTuple = validateTuple;
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
  var require_prefixItems = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/prefixItems.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var items_1 = require_items();
      var def = {
        keyword: "prefixItems",
        type: "array",
        schemaType: ["array"],
        before: "uniqueItems",
        code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/items2020.js
  var require_items2020 = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/items2020.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      var code_1 = require_code2();
      var additionalItems_1 = require_additionalItems();
      var error = {
        message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
        params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
      };
      var def = {
        keyword: "items",
        type: "array",
        schemaType: ["object", "boolean"],
        before: "uniqueItems",
        error,
        code(cxt) {
          const { schema: schema2, parentSchema, it } = cxt;
          const { prefixItems } = parentSchema;
          it.items = true;
          if ((0, util_1.alwaysValidSchema)(it, schema2))
            return;
          if (prefixItems)
            (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
          else
            cxt.ok((0, code_1.validateArray)(cxt));
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/contains.js
  var require_contains = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/contains.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      var error = {
        message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
        params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
      };
      var def = {
        keyword: "contains",
        type: "array",
        schemaType: ["object", "boolean"],
        before: "uniqueItems",
        trackErrors: true,
        error,
        code(cxt) {
          const { gen, schema: schema2, parentSchema, data, it } = cxt;
          let min;
          let max;
          const { minContains, maxContains } = parentSchema;
          if (it.opts.next) {
            min = minContains === void 0 ? 1 : minContains;
            max = maxContains;
          } else {
            min = 1;
          }
          const len = gen.const("len", (0, codegen_1._)`${data}.length`);
          cxt.setParams({ min, max });
          if (max === void 0 && min === 0) {
            (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
            return;
          }
          if (max !== void 0 && min > max) {
            (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
            cxt.fail();
            return;
          }
          if ((0, util_1.alwaysValidSchema)(it, schema2)) {
            let cond = (0, codegen_1._)`${len} >= ${min}`;
            if (max !== void 0)
              cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
            cxt.pass(cond);
            return;
          }
          it.items = true;
          const valid = gen.name("valid");
          if (max === void 0 && min === 1) {
            validateItems(valid, () => gen.if(valid, () => gen.break()));
          } else if (min === 0) {
            gen.let(valid, true);
            if (max !== void 0)
              gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
          } else {
            gen.let(valid, false);
            validateItemsWithCount();
          }
          cxt.result(valid, () => cxt.reset());
          function validateItemsWithCount() {
            const schValid = gen.name("_valid");
            const count = gen.let("count", 0);
            validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
          }
          function validateItems(_valid, block) {
            gen.forRange("i", 0, len, (i) => {
              cxt.subschema({
                keyword: "contains",
                dataProp: i,
                dataPropType: util_1.Type.Num,
                compositeRule: true
              }, _valid);
              block();
            });
          }
          function checkLimits(count) {
            gen.code((0, codegen_1._)`${count}++`);
            if (max === void 0) {
              gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
            } else {
              gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
              if (min === 1)
                gen.assign(valid, true);
              else
                gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
            }
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/dependencies.js
  var require_dependencies = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/dependencies.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      var code_1 = require_code2();
      exports.error = {
        message: ({ params: { property, depsCount, deps } }) => {
          const property_ies = depsCount === 1 ? "property" : "properties";
          return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
        },
        params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
        // TODO change to reference
      };
      var def = {
        keyword: "dependencies",
        type: "object",
        schemaType: "object",
        error: exports.error,
        code(cxt) {
          const [propDeps, schDeps] = splitDependencies(cxt);
          validatePropertyDeps(cxt, propDeps);
          validateSchemaDeps(cxt, schDeps);
        }
      };
      function splitDependencies({ schema: schema2 }) {
        const propertyDeps = {};
        const schemaDeps = {};
        for (const key in schema2) {
          if (key === "__proto__")
            continue;
          const deps = Array.isArray(schema2[key]) ? propertyDeps : schemaDeps;
          deps[key] = schema2[key];
        }
        return [propertyDeps, schemaDeps];
      }
      function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
        const { gen, data, it } = cxt;
        if (Object.keys(propertyDeps).length === 0)
          return;
        const missing = gen.let("missing");
        for (const prop in propertyDeps) {
          const deps = propertyDeps[prop];
          if (deps.length === 0)
            continue;
          const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
          cxt.setParams({
            property: prop,
            depsCount: deps.length,
            deps: deps.join(", ")
          });
          if (it.allErrors) {
            gen.if(hasProperty, () => {
              for (const depProp of deps) {
                (0, code_1.checkReportMissingProp)(cxt, depProp);
              }
            });
          } else {
            gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
            (0, code_1.reportMissingProp)(cxt, missing);
            gen.else();
          }
        }
      }
      exports.validatePropertyDeps = validatePropertyDeps;
      function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
        const { gen, data, keyword, it } = cxt;
        const valid = gen.name("valid");
        for (const prop in schemaDeps) {
          if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop]))
            continue;
          gen.if(
            (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties),
            () => {
              const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
              cxt.mergeValidEvaluated(schCxt, valid);
            },
            () => gen.var(valid, true)
            // TODO var
          );
          cxt.ok(valid);
        }
      }
      exports.validateSchemaDeps = validateSchemaDeps;
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
  var require_propertyNames = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/propertyNames.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      var error = {
        message: "property name must be valid",
        params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
      };
      var def = {
        keyword: "propertyNames",
        type: "object",
        schemaType: ["object", "boolean"],
        error,
        code(cxt) {
          const { gen, schema: schema2, data, it } = cxt;
          if ((0, util_1.alwaysValidSchema)(it, schema2))
            return;
          const valid = gen.name("valid");
          gen.forIn("key", data, (key) => {
            cxt.setParams({ propertyName: key });
            cxt.subschema({
              keyword: "propertyNames",
              data: key,
              dataTypes: ["string"],
              propertyName: key,
              compositeRule: true
            }, valid);
            gen.if((0, codegen_1.not)(valid), () => {
              cxt.error(true);
              if (!it.allErrors)
                gen.break();
            });
          });
          cxt.ok(valid);
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
  var require_additionalProperties = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var code_1 = require_code2();
      var codegen_1 = require_codegen();
      var names_1 = require_names();
      var util_1 = require_util2();
      var error = {
        message: "must NOT have additional properties",
        params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
      };
      var def = {
        keyword: "additionalProperties",
        type: ["object"],
        schemaType: ["boolean", "object"],
        allowUndefined: true,
        trackErrors: true,
        error,
        code(cxt) {
          const { gen, schema: schema2, parentSchema, data, errsCount, it } = cxt;
          if (!errsCount)
            throw new Error("ajv implementation error");
          const { allErrors, opts } = it;
          it.props = true;
          if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema2))
            return;
          const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
          const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
          checkAdditionalProperties();
          cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
          function checkAdditionalProperties() {
            gen.forIn("key", data, (key) => {
              if (!props.length && !patProps.length)
                additionalPropertyCode(key);
              else
                gen.if(isAdditional(key), () => additionalPropertyCode(key));
            });
          }
          function isAdditional(key) {
            let definedProp;
            if (props.length > 8) {
              const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
              definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
            } else if (props.length) {
              definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
            } else {
              definedProp = codegen_1.nil;
            }
            if (patProps.length) {
              definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
            }
            return (0, codegen_1.not)(definedProp);
          }
          function deleteAdditional(key) {
            gen.code((0, codegen_1._)`delete ${data}[${key}]`);
          }
          function additionalPropertyCode(key) {
            if (opts.removeAdditional === "all" || opts.removeAdditional && schema2 === false) {
              deleteAdditional(key);
              return;
            }
            if (schema2 === false) {
              cxt.setParams({ additionalProperty: key });
              cxt.error();
              if (!allErrors)
                gen.break();
              return;
            }
            if (typeof schema2 == "object" && !(0, util_1.alwaysValidSchema)(it, schema2)) {
              const valid = gen.name("valid");
              if (opts.removeAdditional === "failing") {
                applyAdditionalSchema(key, valid, false);
                gen.if((0, codegen_1.not)(valid), () => {
                  cxt.reset();
                  deleteAdditional(key);
                });
              } else {
                applyAdditionalSchema(key, valid);
                if (!allErrors)
                  gen.if((0, codegen_1.not)(valid), () => gen.break());
              }
            }
          }
          function applyAdditionalSchema(key, valid, errors) {
            const subschema = {
              keyword: "additionalProperties",
              dataProp: key,
              dataPropType: util_1.Type.Str
            };
            if (errors === false) {
              Object.assign(subschema, {
                compositeRule: true,
                createErrors: false,
                allErrors: false
              });
            }
            cxt.subschema(subschema, valid);
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/properties.js
  var require_properties = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/properties.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var validate_1 = require_validate();
      var code_1 = require_code2();
      var util_1 = require_util2();
      var additionalProperties_1 = require_additionalProperties();
      var def = {
        keyword: "properties",
        type: "object",
        schemaType: "object",
        code(cxt) {
          const { gen, schema: schema2, parentSchema, data, it } = cxt;
          if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) {
            additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
          }
          const allProps = (0, code_1.allSchemaProperties)(schema2);
          for (const prop of allProps) {
            it.definedProperties.add(prop);
          }
          if (it.opts.unevaluated && allProps.length && it.props !== true) {
            it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
          }
          const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema2[p]));
          if (properties.length === 0)
            return;
          const valid = gen.name("valid");
          for (const prop of properties) {
            if (hasDefault(prop)) {
              applyPropertySchema(prop);
            } else {
              gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
              applyPropertySchema(prop);
              if (!it.allErrors)
                gen.else().var(valid, true);
              gen.endIf();
            }
            cxt.it.definedProperties.add(prop);
            cxt.ok(valid);
          }
          function hasDefault(prop) {
            return it.opts.useDefaults && !it.compositeRule && schema2[prop].default !== void 0;
          }
          function applyPropertySchema(prop) {
            cxt.subschema({
              keyword: "properties",
              schemaProp: prop,
              dataProp: prop
            }, valid);
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
  var require_patternProperties = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/patternProperties.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var code_1 = require_code2();
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      var util_2 = require_util2();
      var def = {
        keyword: "patternProperties",
        type: "object",
        schemaType: "object",
        code(cxt) {
          const { gen, schema: schema2, data, parentSchema, it } = cxt;
          const { opts } = it;
          const patterns = (0, code_1.allSchemaProperties)(schema2);
          const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema2[p]));
          if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) {
            return;
          }
          const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
          const valid = gen.name("valid");
          if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
            it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
          }
          const { props } = it;
          validatePatternProperties();
          function validatePatternProperties() {
            for (const pat of patterns) {
              if (checkProperties)
                checkMatchingProperties(pat);
              if (it.allErrors) {
                validateProperties(pat);
              } else {
                gen.var(valid, true);
                validateProperties(pat);
                gen.if(valid);
              }
            }
          }
          function checkMatchingProperties(pat) {
            for (const prop in checkProperties) {
              if (new RegExp(pat).test(prop)) {
                (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
              }
            }
          }
          function validateProperties(pat) {
            gen.forIn("key", data, (key) => {
              gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
                const alwaysValid = alwaysValidPatterns.includes(pat);
                if (!alwaysValid) {
                  cxt.subschema({
                    keyword: "patternProperties",
                    schemaProp: pat,
                    dataProp: key,
                    dataPropType: util_2.Type.Str
                  }, valid);
                }
                if (it.opts.unevaluated && props !== true) {
                  gen.assign((0, codegen_1._)`${props}[${key}]`, true);
                } else if (!alwaysValid && !it.allErrors) {
                  gen.if((0, codegen_1.not)(valid), () => gen.break());
                }
              });
            });
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/not.js
  var require_not = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/not.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var util_1 = require_util2();
      var def = {
        keyword: "not",
        schemaType: ["object", "boolean"],
        trackErrors: true,
        code(cxt) {
          const { gen, schema: schema2, it } = cxt;
          if ((0, util_1.alwaysValidSchema)(it, schema2)) {
            cxt.fail();
            return;
          }
          const valid = gen.name("valid");
          cxt.subschema({
            keyword: "not",
            compositeRule: true,
            createErrors: false,
            allErrors: false
          }, valid);
          cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
        },
        error: { message: "must NOT be valid" }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/anyOf.js
  var require_anyOf = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/anyOf.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var code_1 = require_code2();
      var def = {
        keyword: "anyOf",
        schemaType: "array",
        trackErrors: true,
        code: code_1.validateUnion,
        error: { message: "must match a schema in anyOf" }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/oneOf.js
  var require_oneOf = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/oneOf.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      var error = {
        message: "must match exactly one schema in oneOf",
        params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
      };
      var def = {
        keyword: "oneOf",
        schemaType: "array",
        trackErrors: true,
        error,
        code(cxt) {
          const { gen, schema: schema2, parentSchema, it } = cxt;
          if (!Array.isArray(schema2))
            throw new Error("ajv implementation error");
          if (it.opts.discriminator && parentSchema.discriminator)
            return;
          const schArr = schema2;
          const valid = gen.let("valid", false);
          const passing = gen.let("passing", null);
          const schValid = gen.name("_valid");
          cxt.setParams({ passing });
          gen.block(validateOneOf);
          cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
          function validateOneOf() {
            schArr.forEach((sch, i) => {
              let schCxt;
              if ((0, util_1.alwaysValidSchema)(it, sch)) {
                gen.var(schValid, true);
              } else {
                schCxt = cxt.subschema({
                  keyword: "oneOf",
                  schemaProp: i,
                  compositeRule: true
                }, schValid);
              }
              if (i > 0) {
                gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
              }
              gen.if(schValid, () => {
                gen.assign(valid, true);
                gen.assign(passing, i);
                if (schCxt)
                  cxt.mergeEvaluated(schCxt, codegen_1.Name);
              });
            });
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/allOf.js
  var require_allOf = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/allOf.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var util_1 = require_util2();
      var def = {
        keyword: "allOf",
        schemaType: "array",
        code(cxt) {
          const { gen, schema: schema2, it } = cxt;
          if (!Array.isArray(schema2))
            throw new Error("ajv implementation error");
          const valid = gen.name("valid");
          schema2.forEach((sch, i) => {
            if ((0, util_1.alwaysValidSchema)(it, sch))
              return;
            const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
            cxt.ok(valid);
            cxt.mergeEvaluated(schCxt);
          });
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/if.js
  var require_if = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/if.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var util_1 = require_util2();
      var error = {
        message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
        params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
      };
      var def = {
        keyword: "if",
        schemaType: ["object", "boolean"],
        trackErrors: true,
        error,
        code(cxt) {
          const { gen, parentSchema, it } = cxt;
          if (parentSchema.then === void 0 && parentSchema.else === void 0) {
            (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
          }
          const hasThen = hasSchema(it, "then");
          const hasElse = hasSchema(it, "else");
          if (!hasThen && !hasElse)
            return;
          const valid = gen.let("valid", true);
          const schValid = gen.name("_valid");
          validateIf();
          cxt.reset();
          if (hasThen && hasElse) {
            const ifClause = gen.let("ifClause");
            cxt.setParams({ ifClause });
            gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
          } else if (hasThen) {
            gen.if(schValid, validateClause("then"));
          } else {
            gen.if((0, codegen_1.not)(schValid), validateClause("else"));
          }
          cxt.pass(valid, () => cxt.error(true));
          function validateIf() {
            const schCxt = cxt.subschema({
              keyword: "if",
              compositeRule: true,
              createErrors: false,
              allErrors: false
            }, schValid);
            cxt.mergeEvaluated(schCxt);
          }
          function validateClause(keyword, ifClause) {
            return () => {
              const schCxt = cxt.subschema({ keyword }, schValid);
              gen.assign(valid, schValid);
              cxt.mergeValidEvaluated(schCxt, valid);
              if (ifClause)
                gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
              else
                cxt.setParams({ ifClause: keyword });
            };
          }
        }
      };
      function hasSchema(it, keyword) {
        const schema2 = it.schema[keyword];
        return schema2 !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema2);
      }
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/thenElse.js
  var require_thenElse = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/thenElse.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var util_1 = require_util2();
      var def = {
        keyword: ["then", "else"],
        schemaType: ["object", "boolean"],
        code({ keyword, parentSchema, it }) {
          if (parentSchema.if === void 0)
            (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/applicator/index.js
  var require_applicator = __commonJS({
    "node_modules/ajv/dist/vocabularies/applicator/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var additionalItems_1 = require_additionalItems();
      var prefixItems_1 = require_prefixItems();
      var items_1 = require_items();
      var items2020_1 = require_items2020();
      var contains_1 = require_contains();
      var dependencies_1 = require_dependencies();
      var propertyNames_1 = require_propertyNames();
      var additionalProperties_1 = require_additionalProperties();
      var properties_1 = require_properties();
      var patternProperties_1 = require_patternProperties();
      var not_1 = require_not();
      var anyOf_1 = require_anyOf();
      var oneOf_1 = require_oneOf();
      var allOf_1 = require_allOf();
      var if_1 = require_if();
      var thenElse_1 = require_thenElse();
      function getApplicator(draft2020 = false) {
        const applicator = [
          // any
          not_1.default,
          anyOf_1.default,
          oneOf_1.default,
          allOf_1.default,
          if_1.default,
          thenElse_1.default,
          // object
          propertyNames_1.default,
          additionalProperties_1.default,
          dependencies_1.default,
          properties_1.default,
          patternProperties_1.default
        ];
        if (draft2020)
          applicator.push(prefixItems_1.default, items2020_1.default);
        else
          applicator.push(additionalItems_1.default, items_1.default);
        applicator.push(contains_1.default);
        return applicator;
      }
      exports.default = getApplicator;
    }
  });

  // node_modules/ajv/dist/vocabularies/format/format.js
  var require_format = __commonJS({
    "node_modules/ajv/dist/vocabularies/format/format.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var error = {
        message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
        params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
      };
      var def = {
        keyword: "format",
        type: ["number", "string"],
        schemaType: "string",
        $data: true,
        error,
        code(cxt, ruleType) {
          const { gen, data, $data, schema: schema2, schemaCode, it } = cxt;
          const { opts, errSchemaPath, schemaEnv, self } = it;
          if (!opts.validateFormats)
            return;
          if ($data)
            validate$DataFormat();
          else
            validateFormat();
          function validate$DataFormat() {
            const fmts = gen.scopeValue("formats", {
              ref: self.formats,
              code: opts.code.formats
            });
            const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
            const fType = gen.let("fType");
            const format = gen.let("format");
            gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
            cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
            function unknownFmt() {
              if (opts.strictSchema === false)
                return codegen_1.nil;
              return (0, codegen_1._)`${schemaCode} && !${format}`;
            }
            function invalidFmt() {
              const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
              const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
              return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
            }
          }
          function validateFormat() {
            const formatDef = self.formats[schema2];
            if (!formatDef) {
              unknownFormat();
              return;
            }
            if (formatDef === true)
              return;
            const [fmtType, format, fmtRef] = getFormat(formatDef);
            if (fmtType === ruleType)
              cxt.pass(validCondition());
            function unknownFormat() {
              if (opts.strictSchema === false) {
                self.logger.warn(unknownMsg());
                return;
              }
              throw new Error(unknownMsg());
              function unknownMsg() {
                return `unknown format "${schema2}" ignored in schema at path "${errSchemaPath}"`;
              }
            }
            function getFormat(fmtDef) {
              const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema2)}` : void 0;
              const fmt = gen.scopeValue("formats", { key: schema2, ref: fmtDef, code });
              if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
                return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._)`${fmt}.validate`];
              }
              return ["string", fmtDef, fmt];
            }
            function validCondition() {
              if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
                if (!schemaEnv.$async)
                  throw new Error("async format in sync schema");
                return (0, codegen_1._)`await ${fmtRef}(${data})`;
              }
              return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
            }
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/vocabularies/format/index.js
  var require_format2 = __commonJS({
    "node_modules/ajv/dist/vocabularies/format/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var format_1 = require_format();
      var format = [format_1.default];
      exports.default = format;
    }
  });

  // node_modules/ajv/dist/vocabularies/metadata.js
  var require_metadata = __commonJS({
    "node_modules/ajv/dist/vocabularies/metadata.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.contentVocabulary = exports.metadataVocabulary = void 0;
      exports.metadataVocabulary = [
        "title",
        "description",
        "default",
        "deprecated",
        "readOnly",
        "writeOnly",
        "examples"
      ];
      exports.contentVocabulary = [
        "contentMediaType",
        "contentEncoding",
        "contentSchema"
      ];
    }
  });

  // node_modules/ajv/dist/vocabularies/draft7.js
  var require_draft7 = __commonJS({
    "node_modules/ajv/dist/vocabularies/draft7.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var core_1 = require_core2();
      var validation_1 = require_validation();
      var applicator_1 = require_applicator();
      var format_1 = require_format2();
      var metadata_1 = require_metadata();
      var draft7Vocabularies = [
        core_1.default,
        validation_1.default,
        (0, applicator_1.default)(),
        format_1.default,
        metadata_1.metadataVocabulary,
        metadata_1.contentVocabulary
      ];
      exports.default = draft7Vocabularies;
    }
  });

  // node_modules/ajv/dist/vocabularies/discriminator/types.js
  var require_types = __commonJS({
    "node_modules/ajv/dist/vocabularies/discriminator/types.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DiscrError = void 0;
      var DiscrError;
      (function(DiscrError2) {
        DiscrError2["Tag"] = "tag";
        DiscrError2["Mapping"] = "mapping";
      })(DiscrError || (exports.DiscrError = DiscrError = {}));
    }
  });

  // node_modules/ajv/dist/vocabularies/discriminator/index.js
  var require_discriminator = __commonJS({
    "node_modules/ajv/dist/vocabularies/discriminator/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var codegen_1 = require_codegen();
      var types_1 = require_types();
      var compile_1 = require_compile();
      var ref_error_1 = require_ref_error();
      var util_1 = require_util2();
      var error = {
        message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
        params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
      };
      var def = {
        keyword: "discriminator",
        type: "object",
        schemaType: "object",
        error,
        code(cxt) {
          const { gen, data, schema: schema2, parentSchema, it } = cxt;
          const { oneOf } = parentSchema;
          if (!it.opts.discriminator) {
            throw new Error("discriminator: requires discriminator option");
          }
          const tagName = schema2.propertyName;
          if (typeof tagName != "string")
            throw new Error("discriminator: requires propertyName");
          if (schema2.mapping)
            throw new Error("discriminator: mapping is not supported");
          if (!oneOf)
            throw new Error("discriminator: requires oneOf keyword");
          const valid = gen.let("valid", false);
          const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
          gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
          cxt.ok(valid);
          function validateMapping() {
            const mapping = getMapping();
            gen.if(false);
            for (const tagValue in mapping) {
              gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
              gen.assign(valid, applyTagSchema(mapping[tagValue]));
            }
            gen.else();
            cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
            gen.endIf();
          }
          function applyTagSchema(schemaProp) {
            const _valid = gen.name("valid");
            const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
            cxt.mergeEvaluated(schCxt, codegen_1.Name);
            return _valid;
          }
          function getMapping() {
            var _a;
            const oneOfMapping = {};
            const topRequired = hasRequired(parentSchema);
            let tagRequired = true;
            for (let i = 0; i < oneOf.length; i++) {
              let sch = oneOf[i];
              if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
                const ref = sch.$ref;
                sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
                if (sch instanceof compile_1.SchemaEnv)
                  sch = sch.schema;
                if (sch === void 0)
                  throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
              }
              const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
              if (typeof propSch != "object") {
                throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
              }
              tagRequired = tagRequired && (topRequired || hasRequired(sch));
              addMappings(propSch, i);
            }
            if (!tagRequired)
              throw new Error(`discriminator: "${tagName}" must be required`);
            return oneOfMapping;
            function hasRequired({ required }) {
              return Array.isArray(required) && required.includes(tagName);
            }
            function addMappings(sch, i) {
              if (sch.const) {
                addMapping(sch.const, i);
              } else if (sch.enum) {
                for (const tagValue of sch.enum) {
                  addMapping(tagValue, i);
                }
              } else {
                throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
              }
            }
            function addMapping(tagValue, i) {
              if (typeof tagValue != "string" || tagValue in oneOfMapping) {
                throw new Error(`discriminator: "${tagName}" values must be unique strings`);
              }
              oneOfMapping[tagValue] = i;
            }
          }
        }
      };
      exports.default = def;
    }
  });

  // node_modules/ajv/dist/refs/json-schema-draft-07.json
  var require_json_schema_draft_07 = __commonJS({
    "node_modules/ajv/dist/refs/json-schema-draft-07.json"(exports, module) {
      module.exports = {
        $schema: "http://json-schema.org/draft-07/schema#",
        $id: "http://json-schema.org/draft-07/schema#",
        title: "Core schema meta-schema",
        definitions: {
          schemaArray: {
            type: "array",
            minItems: 1,
            items: { $ref: "#" }
          },
          nonNegativeInteger: {
            type: "integer",
            minimum: 0
          },
          nonNegativeIntegerDefault0: {
            allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }]
          },
          simpleTypes: {
            enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
          },
          stringArray: {
            type: "array",
            items: { type: "string" },
            uniqueItems: true,
            default: []
          }
        },
        type: ["object", "boolean"],
        properties: {
          $id: {
            type: "string",
            format: "uri-reference"
          },
          $schema: {
            type: "string",
            format: "uri"
          },
          $ref: {
            type: "string",
            format: "uri-reference"
          },
          $comment: {
            type: "string"
          },
          title: {
            type: "string"
          },
          description: {
            type: "string"
          },
          default: true,
          readOnly: {
            type: "boolean",
            default: false
          },
          examples: {
            type: "array",
            items: true
          },
          multipleOf: {
            type: "number",
            exclusiveMinimum: 0
          },
          maximum: {
            type: "number"
          },
          exclusiveMaximum: {
            type: "number"
          },
          minimum: {
            type: "number"
          },
          exclusiveMinimum: {
            type: "number"
          },
          maxLength: { $ref: "#/definitions/nonNegativeInteger" },
          minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
          pattern: {
            type: "string",
            format: "regex"
          },
          additionalItems: { $ref: "#" },
          items: {
            anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
            default: true
          },
          maxItems: { $ref: "#/definitions/nonNegativeInteger" },
          minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
          uniqueItems: {
            type: "boolean",
            default: false
          },
          contains: { $ref: "#" },
          maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
          minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
          required: { $ref: "#/definitions/stringArray" },
          additionalProperties: { $ref: "#" },
          definitions: {
            type: "object",
            additionalProperties: { $ref: "#" },
            default: {}
          },
          properties: {
            type: "object",
            additionalProperties: { $ref: "#" },
            default: {}
          },
          patternProperties: {
            type: "object",
            additionalProperties: { $ref: "#" },
            propertyNames: { format: "regex" },
            default: {}
          },
          dependencies: {
            type: "object",
            additionalProperties: {
              anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }]
            }
          },
          propertyNames: { $ref: "#" },
          const: true,
          enum: {
            type: "array",
            items: true,
            minItems: 1,
            uniqueItems: true
          },
          type: {
            anyOf: [
              { $ref: "#/definitions/simpleTypes" },
              {
                type: "array",
                items: { $ref: "#/definitions/simpleTypes" },
                minItems: 1,
                uniqueItems: true
              }
            ]
          },
          format: { type: "string" },
          contentMediaType: { type: "string" },
          contentEncoding: { type: "string" },
          if: { $ref: "#" },
          then: { $ref: "#" },
          else: { $ref: "#" },
          allOf: { $ref: "#/definitions/schemaArray" },
          anyOf: { $ref: "#/definitions/schemaArray" },
          oneOf: { $ref: "#/definitions/schemaArray" },
          not: { $ref: "#" }
        },
        default: true
      };
    }
  });

  // node_modules/ajv/dist/ajv.js
  var require_ajv = __commonJS({
    "node_modules/ajv/dist/ajv.js"(exports, module) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv = void 0;
      var core_1 = require_core();
      var draft7_1 = require_draft7();
      var discriminator_1 = require_discriminator();
      var draft7MetaSchema = require_json_schema_draft_07();
      var META_SUPPORT_DATA = ["/properties"];
      var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
      var Ajv2 = class extends core_1.default {
        _addVocabularies() {
          super._addVocabularies();
          draft7_1.default.forEach((v) => this.addVocabulary(v));
          if (this.opts.discriminator)
            this.addKeyword(discriminator_1.default);
        }
        _addDefaultMetaSchema() {
          super._addDefaultMetaSchema();
          if (!this.opts.meta)
            return;
          const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
          this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
          this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
        }
        defaultMeta() {
          return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
        }
      };
      exports.Ajv = Ajv2;
      module.exports = exports = Ajv2;
      module.exports.Ajv = Ajv2;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.default = Ajv2;
      var validate_1 = require_validate();
      Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
        return validate_1.KeywordCxt;
      } });
      var codegen_1 = require_codegen();
      Object.defineProperty(exports, "_", { enumerable: true, get: function() {
        return codegen_1._;
      } });
      Object.defineProperty(exports, "str", { enumerable: true, get: function() {
        return codegen_1.str;
      } });
      Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
        return codegen_1.stringify;
      } });
      Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
        return codegen_1.nil;
      } });
      Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
        return codegen_1.Name;
      } });
      Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
        return codegen_1.CodeGen;
      } });
      var validation_error_1 = require_validation_error();
      Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function() {
        return validation_error_1.default;
      } });
      var ref_error_1 = require_ref_error();
      Object.defineProperty(exports, "MissingRefError", { enumerable: true, get: function() {
        return ref_error_1.default;
      } });
    }
  });

  // package.json
  var name = "vintagestory";
  var package_default = {
    type: "module",
    name,
    title: "Vintage Story Format Support",
    description: "A Blockbench plugin that adds support for Vintage Story models",
    version: "0.12.3",
    author: {
      name: "Anego Studios",
      email: "office@anegostudios.com",
      url: "https://anegostudios.com"
    },
    contributors: [
      {
        name: "codename-B",
        url: "https://github.com/codename-B"
      },
      {
        name: "Darkluke1111",
        email: "darkluke1111@gmx.de",
        url: "https://github.com/Darkluke1111"
      }
    ],
    repository: {
      type: "git",
      url: "https://github.com/anegostudios/blockbenchplugin"
    },
    devDependencies: {
      "@types/json5": "^0.0.30",
      "@types/node": "^24.9.1",
      "blockbench-types": "https://github.com/SnaveSutit/blockbench-types.git",
      esbuild: "0.27.0",
      eslint: "^9.38.0",
      "eslint-plugin-only-warn": "^1.1.0",
      "eslint-plugin-vue": "^10.5.1",
      globals: "^16.4.0",
      jiti: "^2.6.1",
      tsx: "^4.20.6",
      typedoc: "^0.28.14",
      "typedoc-plugin-markdown": "^4.9.0",
      typescript: "^5.9.3",
      "typescript-eslint": "^8.46.2",
      "typescript-json-schema": "^0.65.1"
    },
    scripts: {
      gen_schema: "npx tsx src/buildtime_scripts/gen_schema.ts",
      build: "npx tsx ./esbuild.ts  --mode=prod",
      dev: "npx tsx ./esbuild.ts  --mode=dev",
      lint: "npx eslint .",
      gen_type_docs: "npx typedoc ./src/vs_shape_def.ts"
    },
    dependencies: {
      ajv: "^8.17.1",
      json5: "^2.2.3"
    }
  };

  // src/util/subscribable.ts
  var Subscribable = class {
    subscribers = /* @__PURE__ */ new Set();
    dispatching = false;
    /**
     * Subscribe to this subscribable.
     * @param callback The callback to be called when the subscribable is dispatched.
     * @param oneShot If true, the callback will be removed after it is called once.
     * @returns A function that can be called to unsubscribe the callback.
     */
    subscribe(callback, oneShot = false) {
      if (oneShot) {
        const wrappedCallback = (value) => {
          callback(value);
          this.subscribers.delete(wrappedCallback);
        };
        this.subscribers.add(wrappedCallback);
        return () => this.subscribers.delete(wrappedCallback);
      } else this.subscribers.add(callback);
      return () => this.subscribers.delete(callback);
    }
    /**
     * Dispatch a value to all subscribers.
     * @param value The value to be passed to the subscribers.
     */
    dispatch(value) {
      if (this.dispatching) return;
      this.dispatching = true;
      this.subscribers.forEach((callback) => callback(value));
      this.dispatching = false;
    }
  };

  // src/util/events.ts
  var PluginEvent = class _PluginEvent extends Subscribable {
    constructor(name2) {
      super();
      this.name = name2;
      _PluginEvent.events[name2] = this;
    }
    static events = {};
  };
  var events = {
    LOAD: new PluginEvent("load"),
    UNLOAD: new PluginEvent("unload"),
    INSTALL: new PluginEvent("install"),
    UNINSTALL: new PluginEvent("uninstall"),
    INJECT_MODS: new PluginEvent("injectMods"),
    EXTRACT_MODS: new PluginEvent("extractMods"),
    SELECT_PROJECT: new PluginEvent("selectProject"),
    UNSELECT_PROJECT: new PluginEvent("deselectProject"),
    LOAD_PROJECT: new PluginEvent("loadProject"),
    CONVERT_FORMAT: new PluginEvent("convert_format"),
    ADD_CUBE: new PluginEvent("add_cube"),
    ADD_GROUP: new PluginEvent("add_group"),
    UPDATE_FACES: new PluginEvent("update_faces"),
    SELECT_FORMAT: new PluginEvent("select_format")
  };
  function injectionHandler() {
    console.groupCollapsed(`Injecting BlockbenchMods added by '${name}'`);
    events.INJECT_MODS.dispatch();
    console.groupEnd();
  }
  function extractionHandler() {
    console.groupCollapsed(`Extracting BlockbenchMods added by '${name}'`);
    events.EXTRACT_MODS.dispatch();
    console.groupEnd();
  }
  events.LOAD.subscribe(injectionHandler);
  events.UNLOAD.subscribe(extractionHandler);
  events.INSTALL.subscribe(injectionHandler);
  events.UNINSTALL.subscribe(extractionHandler);
  Blockbench.on("select_project", ({ project }) => {
    events.SELECT_PROJECT.dispatch(project);
  });
  Blockbench.on("unselect_project", ({ project }) => {
    events.UNSELECT_PROJECT.dispatch(project);
  });
  Blockbench.on("load_project", ({ project }) => {
    events.LOAD_PROJECT.dispatch(project);
  });
  Blockbench.on("convert_format", (e) => {
    events.CONVERT_FORMAT.dispatch(e);
  });
  Blockbench.on("add_cube", ({ cube }) => {
    events.ADD_CUBE.dispatch(cube);
  });
  Blockbench.on("add_group", ({ group }) => {
    events.ADD_GROUP.dispatch(group);
  });
  Blockbench.on("update_faces", ({ node }) => {
    events.UPDATE_FACES.dispatch(node);
  });
  Blockbench.on("select_format", (e) => {
    events.SELECT_FORMAT.dispatch(e);
  });

  // src/util/moddingTools.ts
  var BlockbenchModInstallError = class extends Error {
    constructor(id, err) {
      super(`Mod '${id}' failed to install: ${err.message}` + (err.stack ? "\n" + err.stack : ""));
    }
  };
  var BlockbenchModUninstallError = class extends Error {
    constructor(id, err) {
      resetAllConsoleGroups();
      super(
        `Mod '${id}' failed to uninstall: ${err.message}` + (err.stack ? "\n" + err.stack : "")
      );
    }
  };
  function resetAllConsoleGroups() {
    for (let i = 0; i < 1e3; i++) {
      console.groupEnd();
    }
  }
  function createBlockbenchMod(id, context, inject, extract) {
    let installed = false;
    let extractContext;
    events.INJECT_MODS.subscribe(() => {
      console.log(`Injecting BBMod '${id}'`);
      try {
        if (installed) new Error("Mod is already installed!");
        extractContext = inject(context);
        installed = true;
      } catch (err) {
        throw new BlockbenchModInstallError(id, err);
      }
    });
    events.EXTRACT_MODS.subscribe(() => {
      console.log(`Extracting BBMod '${id}'`);
      try {
        if (!installed) new Error("Mod is not installed!");
        extract(extractContext);
        installed = false;
      } catch (err) {
        throw new BlockbenchModUninstallError(id, err);
      }
    });
  }
  function createAction(id, options) {
    const action = new Action(id, options);
    events.EXTRACT_MODS.subscribe(() => {
      action.delete();
    }, true);
    return action;
  }

  // src/debug_actions.ts
  init_util();
  var import_json5 = __toESM(require_lib(), 1);
  init_native();
  var path2 = requireNativeModule("path");
  var reExportAction = createAction(`${name}:reExport`, {
    name: "Reexport Test",
    icon: "fa-flask-vial",
    condition() {
      return is_vs_project(Project);
    },
    click: function() {
      new Dialog("folder_select", {
        title: "Select Folder",
        form: {
          select_folder: {
            label: "Select Folder to test",
            description: "This Action is made for testing. If you don't know what it does, you probably should not use it.",
            type: "folder"
          }
        },
        onConfirm(form_result) {
          const test_folder = form_result.select_folder;
          console.log(test_folder);
          const test_files = fs.readdirSync(test_folder, { encoding: "utf-8" });
          for (const test_file of test_files) {
            if (!test_file.endsWith(".json") || test_file.startsWith("reexport_")) continue;
            const input_path = path2.resolve(test_folder, test_file);
            const output_path = path2.resolve(test_folder, `reexport_${test_file}`);
            if (!fs?.statSync(input_path).isFile()) continue;
            console.log(`Processing: ${input_path} \u2192 ${output_path}`);
            try {
              Blockbench.readFile([input_path], {}, (files) => {
                try {
                  loadModelFile(files[0], []);
                  const reexport_content = Format.codec.compile();
                  fs.writeFileSync(output_path, reexport_content, "utf-8");
                  console.log(`Reexported: ${test_file}`);
                } catch (inner) {
                  console.error(`Error inside callback for ${test_file}:`, inner);
                }
              });
            } catch (e) {
              console.error(`Error reexporting ${test_file}:`, e);
            }
          }
        }
      }).show();
    }
  });
  MenuBar.addAction(reExportAction, "file");
  var debugAction = createAction(`${name}:printDebug`, {
    name: "Print Debug Info",
    icon: "icon",
    condition() {
      return is_vs_project(Project);
    },
    click: function() {
      console.log(Outliner.selected);
    }
  });
  MenuBar.addAction(debugAction, "edit");
  var FLOAT_EPSILON = 1e-3;
  function isVsEmpty(val) {
    if (val === void 0 || val === null) return true;
    if (val === false) return true;
    if (Array.isArray(val) && val.length === 0) return true;
    if (typeof val === "object" && val !== null && Object.keys(val).length === 0) return true;
    if (Array.isArray(val) && val.length === 2 && val[0] === 0 && val[1] === 0) return true;
    return false;
  }
  var VS_EMPTY_EQUIVALENT_KEYS = /* @__PURE__ */ new Set([
    "faces",
    "children",
    "attachmentpoints",
    "uv",
    "autoUnwrap",
    "disableRandomDrawOffset"
  ]);
  function deepCompare(a, b, path7) {
    const diffs = [];
    if (a === b) return diffs;
    if (a === void 0 && b === void 0) return diffs;
    if (a === null && b === null) return diffs;
    if (a == null || b == null) {
      diffs.push(`${path7}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
      return diffs;
    }
    if (typeof a === "number" && typeof b === "number") {
      if (Math.abs(a - b) > FLOAT_EPSILON) {
        diffs.push(`${path7}: ${a} vs ${b}`);
      }
      return diffs;
    }
    if (typeof a !== typeof b) {
      diffs.push(`${path7}: type ${typeof a} vs ${typeof b} (${JSON.stringify(a)} vs ${JSON.stringify(b)})`);
      return diffs;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      const maxLen = Math.max(a.length, b.length);
      if (a.length !== b.length) {
        diffs.push(`${path7}: array length ${a.length} vs ${b.length}`);
      }
      for (let i = 0; i < maxLen; i++) {
        diffs.push(...deepCompare(a[i], b[i], `${path7}[${i}]`));
      }
      return diffs;
    }
    if (typeof a === "object" && typeof b === "object") {
      const aObj = a;
      const bObj = b;
      const allKeys = /* @__PURE__ */ new Set([...Object.keys(aObj), ...Object.keys(bObj)]);
      for (const key of allKeys) {
        if (VS_EMPTY_EQUIVALENT_KEYS.has(key) && isVsEmpty(aObj[key]) && isVsEmpty(bObj[key])) {
          continue;
        }
        diffs.push(...deepCompare(aObj[key], bObj[key], `${path7}.${key}`));
      }
      return diffs;
    }
    if (typeof a === "string" && typeof b === "string") {
      const aNum = Number(a);
      const bNum = Number(b);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        if (Math.abs(aNum - bNum) > FLOAT_EPSILON) {
          diffs.push(`${path7}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
        }
        return diffs;
      }
    }
    if (a !== b) {
      diffs.push(`${path7}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
    }
    return diffs;
  }
  var roundTripDiffAction = createAction(`${name}:roundTripDiff`, {
    name: "Round-Trip Diff Test",
    icon: "fa-rotate",
    condition() {
      return is_vs_project(Project);
    },
    click: function() {
      new Dialog("roundtrip_diff", {
        title: "Round-Trip Diff Test",
        form: {
          select_folder: {
            label: "Select Folder to test",
            description: "Imports each VS shape file, re-exports it, and compares the JSON. Differences are logged to the console (F12).",
            type: "folder"
          }
        },
        onConfirm(form_result) {
          const test_folder = form_result.select_folder;
          const test_files = fs.readdirSync(test_folder, { encoding: "utf-8" });
          let totalFiles = 0;
          let totalDiffs = 0;
          for (const test_file of test_files) {
            if (!test_file.endsWith(".json") || test_file.includes("reexport_")) continue;
            const input_path = path2.resolve(test_folder, test_file);
            if (!fs.statSync(input_path).isFile()) continue;
            try {
              const originalContent = fs.readFileSync(input_path, "utf-8");
              const originalJson = import_json5.default.parse(originalContent);
              if (!originalJson.elements || !originalJson.textures) continue;
              totalFiles++;
              Blockbench.readFile([input_path], {}, (files) => {
                loadModelFile(files[0], []);
                const reexportContent = Format.codec.compile();
                const reexportJson = JSON.parse(reexportContent);
                const originalForCompare = { ...originalJson };
                const reexportForCompare = { ...reexportJson };
                delete originalForCompare.editor;
                delete reexportForCompare.editor;
                if (originalForCompare.animations) {
                  const animMap = {};
                  for (const a of originalForCompare.animations) animMap[a.name] = a;
                  originalForCompare.animations = animMap;
                }
                if (reexportForCompare.animations) {
                  const animMap = {};
                  for (const a of reexportForCompare.animations) animMap[a.name] = a;
                  reexportForCompare.animations = animMap;
                }
                const diffs = deepCompare(originalForCompare, reexportForCompare, "$");
                if (diffs.length > 0) {
                  totalDiffs += diffs.length;
                  console.group(`%c DIFFS in ${test_file} (${diffs.length} differences)`, "color: orange; font-weight: bold");
                  for (const diff of diffs.slice(0, 50)) {
                    console.warn(`  ${diff}`);
                  }
                  if (diffs.length > 50) {
                    console.warn(`  ... and ${diffs.length - 50} more`);
                  }
                  console.groupEnd();
                } else {
                  console.log(`%c OK: ${test_file}`, "color: green");
                }
              });
            } catch (e) {
              console.error(`Error testing ${test_file}:`, e);
            }
          }
          console.log(`%c Round-trip test complete: ${totalFiles} files tested`, "font-weight: bold");
        }
      }).show();
    }
  });
  MenuBar.addAction(roundTripDiffAction, "file");

  // icon.png
  var icon_default = "data:image/png;base64,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";

  // src/actions.ts
  init_util();

  // src/import.ts
  init_util();

  // src/import_model/group.ts
  init_util();
  init_property();
  init_preserved_props();

  // src/import_model/locator.ts
  init_util();
  init_preserved_props();
  function process_attachment_points(parent, object_space_pos, attachmentPoints, asBackdrop) {
    for (const ap of attachmentPoints) {
      const posX = parseFloat(ap.posX);
      const posY = parseFloat(ap.posY);
      const posZ = parseFloat(ap.posZ);
      const absolute_pos = vector_add(
        [posX, posY, posZ],
        parent.vs_group_from ?? parent.origin
      );
      const locator = new Locator({
        name: ap.code,
        from: absolute_pos
      });
      locator.rotationX = parseFloat(ap.rotationX) || 0;
      locator.rotationY = parseFloat(ap.rotationY) || 0;
      locator.rotationZ = parseFloat(ap.rotationZ) || 0;
      const extras = collect_attachment_point_extras(ap);
      if (extras) {
        locator.vs_extra_props = extras;
      }
      if (asBackdrop) {
        locator.locked = true;
      }
      locator.addTo(parent).init();
    }
  }

  // src/import_model/group.ts
  init_presets();
  function process_group(parent, object_space_pos, vsElement, asBackdrop, filePath) {
    const absolute_from = vector_add(vsElement.from, object_space_pos);
    const absolute_to = vector_add(vsElement.to, object_space_pos);
    const group = new Group({
      name: vsElement.name,
      origin: vector_add(vsElement.rotationOrigin ?? [0, 0, 0], object_space_pos),
      rotation: [vsElement.rotationX || 0, vsElement.rotationY || 0, vsElement.rotationZ || 0]
    });
    group.vs_group_from = absolute_from;
    group.vs_group_to = absolute_to;
    group.vs_has_rotation_origin = vsElement.rotationOrigin !== void 0;
    if (vsElement.faces && Object.keys(vsElement.faces).length > 0 && vector_equals(vsElement.from, vsElement.to)) {
      group.vs_zero_size_faces = vsElement.faces;
    }
    if (vsElement.uv) {
      group.vs_uv = vsElement.uv;
    }
    if (asBackdrop) {
      group.backdrop = true;
      group.locked = true;
    }
    for (const prop of VS_GROUP_PROPS) {
      const prop_name = prop.name;
      if (vsElement[prop_name] !== void 0) {
        group[prop_name] = vsElement[prop_name];
      }
    }
    for (const prop of VS_CUBE_PROPS) {
      const prop_name = prop.name;
      if (VS_GROUP_PROPS.some((groupProp) => groupProp.name === prop_name)) continue;
      if (prop_name === "shade") continue;
      if (vsElement[prop_name] !== void 0) {
        group[prop_name] = vsElement[prop_name];
      }
    }
    const extras = collect_element_extras(vsElement, true);
    if (extras) {
      group.vs_extra_props = extras;
    }
    if (vsElement.stepParentName && !group.clothingSlot && filePath && !parent) {
      const inferredSlot = getActiveSlotNames().includes(vsElement.stepParentName) ? vsElement.stepParentName : (init_presets(), __toCommonJS(presets_exports)).inferClothingSlotFromPath(filePath);
      if (inferredSlot) {
        group.clothingSlot = inferredSlot;
        console.log(`[Import] Inferred clothingSlot "${inferredSlot}" for group "${group.name}" from path`);
      }
    }
    group.addTo(parent ? parent : void 0).init();
    if (vsElement.attachmentpoints && vsElement.attachmentpoints.length > 0) {
      process_attachment_points(group, object_space_pos, vsElement.attachmentpoints, asBackdrop);
    }
    return group;
  }

  // src/import_model/cube.ts
  init_property();
  init_preserved_props();

  // src/vs_shape_def.ts
  var VS_Direction = /* @__PURE__ */ ((VS_Direction2) => {
    VS_Direction2["NORTH"] = "north";
    VS_Direction2["EAST"] = "east";
    VS_Direction2["SOUTH"] = "south";
    VS_Direction2["WEST"] = "west";
    VS_Direction2["UP"] = "up";
    VS_Direction2["DOWN"] = "down";
    return VS_Direction2;
  })(VS_Direction || {});

  // src/import_model/cube/faces.ts
  function process_faces(faces) {
    if (!faces) {
      return {};
    }
    const processed_faces = {};
    for (const direction of Object.values(VS_Direction)) {
      const faceData = faces[direction];
      if (faceData) {
        const texture_name = faceData.texture ? faceData.texture.substring(1) : null;
        let texture = Texture.all.find((t) => t.name === texture_name);
        if (!texture && texture_name) {
          texture = new Texture({
            name: texture_name
          });
          texture.fromDataURL(texture.getBase64()).add();
        }
        let rotation = faceData.rotation;
        if (direction === "down" /* DOWN */) {
          rotation = ((rotation || 0) + 180) % 360;
        }
        processed_faces[direction] = {
          texture,
          uv: faceData.uv,
          rotation,
          ...faceData.enabled === false && { enabled: false }
        };
      }
    }
    return processed_faces;
  }

  // src/import_model/cube/factory.ts
  init_util();
  init_property();
  init_preserved_props();
  function create_cube(object_space_pos, vsElement, faces) {
    const cube_options = {
      name: vsElement.name,
      from: vector_add(vsElement.from, object_space_pos),
      to: vector_add(vsElement.to, object_space_pos),
      uv_offset: vsElement.uv,
      shade: vsElement.shade ?? true,
      rotation: [vsElement.rotationX || 0, vsElement.rotationY || 0, vsElement.rotationZ || 0],
      origin: vector_add(vsElement.rotationOrigin ?? [0, 0, 0], object_space_pos),
      faces
    };
    const cube = new Cube(cube_options);
    cube.vs_has_rotation_origin = vsElement.rotationOrigin !== void 0;
    if (vsElement.uv) {
      cube.vs_uv = vsElement.uv;
    }
    for (const cube_prop of VS_CUBE_PROPS) {
      const prop_name = cube_prop.name;
      if (prop_name === "shade") continue;
      if (vsElement[prop_name] !== void 0) {
        cube[prop_name] = vsElement[prop_name];
      }
    }
    const extras = collect_element_extras(vsElement);
    if (extras) {
      cube.vs_extra_props = extras;
    }
    return cube;
  }

  // src/import_model/cube.ts
  function process_cube(parent, object_space_pos, vsElement, asBackdrop) {
    const processed_faces = process_faces(vsElement.faces);
    const cube = create_cube(object_space_pos, vsElement, processed_faces);
    cube.addTo(parent ? parent : void 0).init();
    if (asBackdrop) {
      cube.backdrop = true;
      cube.locked = true;
    }
    if (vsElement.faces) {
      for (const direction in vsElement.faces) {
        if (!vsElement.faces[direction] || !cube.faces[direction]) continue;
        for (const prop of VS_FACE_PROPS) {
          const prop_name = prop.name;
          const cube_face = cube.faces[direction];
          const element_face = vsElement.faces[direction];
          if (element_face[prop_name] !== void 0) {
            cube_face[prop_name] = element_face[prop_name];
          }
        }
        const face_extras = collect_face_extras(vsElement.faces[direction]);
        if (face_extras) {
          cube.faces[direction].vs_extra_props = face_extras;
        }
      }
    }
  }

  // src/import_model/traverse.ts
  init_util();

  // src/transform.ts
  init_util();

  // src/util/element_tree.ts
  function transform_tree(element, transformation) {
    const element_transformed = transformation(element);
    if (element_transformed.children) {
      element_transformed.children = element_transformed.children?.map((child) => transform_tree(child, transformation));
    }
    return element_transformed;
  }
  function visit_tree(element, visitor) {
    visitor(element);
    if (element.children) {
      element.children.forEach((child) => visit_tree(child, visitor));
    }
  }

  // src/transform.ts
  function has_geometry_with_hierarchy(element) {
    return has_geometry(element) && (has_children(element) || has_attachments(element));
  }
  function is_complex(element, animations) {
    return has_geometry_with_hierarchy(element) || has_geometry(element) && has_animation(element, animations);
  }
  function expand_complex_elements(shape) {
    shape.elements = shape.elements.map((root) => transform_tree(root, (element) => {
      if (is_complex(element, shape.animations || [])) {
        return expand_complex_element(element);
      } else {
        return element;
      }
    }));
    return shape;
  }
  function expand_complex_element(complex) {
    const new_parent = {
      ...complex,
      from: complex.from,
      to: complex.from,
      faces: void 0,
      name: `${complex.name}`,
      children: complex.children || []
    };
    const new_geometry = {
      ...complex,
      from: vector_sub(complex.from, complex.from),
      rotationOrigin: vector_sub(complex.from, complex.from),
      rotationX: void 0,
      rotationY: void 0,
      rotationZ: void 0,
      to: vector_sub(complex.to, complex.from),
      stepParentName: void 0,
      paletteSlot: void 0,
      noOutline: void 0,
      attachmentpoints: void 0,
      children: [],
      name: `${complex.name}_geo`
    };
    new_parent.children.push(new_geometry);
    return new_parent;
  }
  function has_children(element) {
    return element.children !== void 0 && element.children.length > 0;
  }
  function has_attachments(element) {
    return element.attachmentpoints !== void 0 && element.attachmentpoints.length > 0;
  }
  function has_geometry(element) {
    const has_geometry2 = element.faces !== void 0 && Object.keys(element.faces).length > 0 && !vector_equals(element.from, element.to);
    return has_geometry2;
  }
  function has_animation(element, animations) {
    return animations.some((animation) => {
      return animation.keyframes.some((kf) => {
        return Object.keys(kf.elements).includes(element.name);
      });
    });
  }

  // src/import_model/traverse.ts
  function traverse(parent, object_space_pos, vsElements, asBackdrop, filePath) {
    for (const vsElement of vsElements) {
      if (has_geometry(vsElement) && !has_children(vsElement) && !has_attachments(vsElement)) {
        process_cube(parent, object_space_pos, vsElement, asBackdrop);
      } else if (has_geometry(vsElement) && (has_children(vsElement) || has_attachments(vsElement))) {
        console.warn(`[VS Import] Element "${vsElement.name}" has geometry with children/attachments but wasn't expanded. Importing geometry and children separately.`);
        process_cube(parent, object_space_pos, vsElement, asBackdrop);
        const group = process_group(parent, object_space_pos, vsElement, asBackdrop, filePath);
        if (has_children(vsElement)) {
          traverse(group, vector_add(vsElement.from, object_space_pos), vsElement.children, asBackdrop, filePath);
        }
      } else {
        const group = process_group(parent, object_space_pos, vsElement, asBackdrop, filePath);
        if (has_children(vsElement)) {
          traverse(group, vector_add(vsElement.from, object_space_pos), vsElement.children, asBackdrop, filePath);
        }
      }
    }
  }

  // src/import_model.ts
  function import_model(shape, asBackdrop, filePath, options = {}) {
    const expanded = expand_complex_elements(shape);
    const applyOffset = Settings.get("vs_apply_model_offset") ?? true;
    const configuredOffset = applyOffset ? [-8, 0, -8] : [0, 0, 0];
    const offset = options.rootOffset ?? configuredOffset;
    traverse(null, offset, expanded.elements, asBackdrop, filePath);
  }

  // src/import_animation.ts
  init_util();

  // src/animation_library_paths.ts
  function normalize(p) {
    return p.replace(/\\/g, "/");
  }
  function split_reference(ref) {
    const trimmed = ref.trim();
    const idx = trimmed.indexOf(":");
    if (idx >= 0) {
      return { domain: trimmed.slice(0, idx), subpath: trimmed.slice(idx + 1) };
    }
    return { domain: void 0, subpath: trimmed };
  }
  function parse_model_location(modelPath) {
    const p = normalize(modelPath);
    const marker = "/assets/";
    const i = p.indexOf(marker);
    if (i < 0) return null;
    const after = p.slice(i + marker.length);
    const slash = after.indexOf("/");
    if (slash <= 0) return null;
    return { assetsRoot: p.slice(0, i) + "/assets", domain: after.slice(0, slash) };
  }
  function reference_to_candidate_paths(ref, modelPath) {
    const ctx = parse_model_location(modelPath);
    if (!ctx) return [];
    const { domain, subpath } = split_reference(ref);
    if (!subpath) return [];
    const domains = [];
    if (domain) {
      domains.push(domain);
    } else {
      domains.push(ctx.domain);
      if (ctx.domain !== "game") domains.push("game");
    }
    const seen = /* @__PURE__ */ new Set();
    const paths = [];
    for (const d of domains) {
      const candidate = `${ctx.assetsRoot}/${d}/animations/${subpath}.json`;
      if (!seen.has(candidate)) {
        seen.add(candidate);
        paths.push(candidate);
      }
    }
    return paths;
  }
  function path_to_reference(filePath) {
    const p = normalize(filePath);
    const marker = "/animations/";
    const i = p.indexOf(marker);
    if (i < 0) return null;
    const subpath = p.slice(i + marker.length).replace(/\.json$/i, "");
    if (!subpath) return null;
    const before = p.slice(0, i);
    const am = "/assets/";
    const ai = before.lastIndexOf(am);
    if (ai >= 0) {
      const domain = before.slice(ai + am.length).split("/")[0];
      if (domain) return `${domain}:${subpath}`;
    }
    return subpath;
  }
  function basename_no_ext(filePath) {
    const p = normalize(filePath);
    const base = p.slice(p.lastIndexOf("/") + 1);
    return base.replace(/\.json$/i, "");
  }

  // src/animation_particles.ts
  init_util();
  init_native();
  var nodePath = requireNativeModule("path");
  var resolvedEffects = /* @__PURE__ */ new Map();
  var namespacedEmitters = /* @__PURE__ */ new Set();
  function clear_particle_cache() {
    resolvedEffects.clear();
    namespacedEmitters.clear();
  }
  function clear_emitter_mirror(file) {
    const effect = Animator.particle_effects[file];
    if (!effect) return;
    const magnitude = Math.abs(WinterskyScene?.global_options?.scale ?? 1) || 1;
    for (const key of Object.keys(effect.emitters)) {
      const emitter = effect.emitters[key];
      for (const space of [emitter.local_space, emitter.global_space]) {
        if (!space) continue;
        const s = space.scale;
        if (s.x < 0 || s.y < 0 || s.z < 0) s.set(magnitude, magnitude, magnitude);
      }
    }
  }
  function ensure_emitter_namespaced(file) {
    if (namespacedEmitters.has(file)) {
      clear_emitter_mirror(file);
      return true;
    }
    try {
      Animator.loadParticleEmitter(file, namespace_components(fs.readFileSync(file, "utf-8")));
    } catch (e) {
      console.warn(`[VS Particles] Could not load emitter "${file}":`, e);
      return false;
    }
    namespacedEmitters.add(file);
    clear_emitter_mirror(file);
    return true;
  }
  function particle_file_for(effectCode) {
    const modelPath = Project?.save_path || Project?.export_path;
    if (!modelPath) return null;
    const ctx = parse_model_location(modelPath);
    if (!ctx) return null;
    const colon = effectCode.indexOf(":");
    const domain = colon >= 0 ? effectCode.slice(0, colon) : ctx.domain;
    const path7 = colon >= 0 ? effectCode.slice(colon + 1) : effectCode;
    if (!path7) return null;
    return nodePath.join(ctx.assetsRoot, domain, "particles", `${path7}.json`);
  }
  function resolve_particle_effect(effectCode) {
    const code = effectCode.trim();
    if (!code) return null;
    const cached = resolvedEffects.get(code);
    if (cached !== void 0) return cached;
    const file = particle_file_for(code);
    const resolved = file && fs.existsSync(file) && ensure_emitter_namespaced(file) ? file : null;
    resolvedEffects.set(code, resolved);
    return resolved;
  }
  function namespace_components(content) {
    const json = JSON.parse(content);
    const components = json?.particle_effect?.components;
    if (!components) return content;
    const namespaced = {};
    for (const [name2, value] of Object.entries(components)) {
      namespaced[name2.includes(":") ? name2 : `minecraft:${name2}`] = value;
    }
    json.particle_effect.components = mirror_motion(namespaced);
    return JSON.stringify(json);
  }
  function negate(value) {
    if (typeof value === "number") return -value;
    if (typeof value === "string" && value.trim()) return `-(${value})`;
    return value;
  }
  var MIRRORED_FIELDS = {
    "minecraft:particle_motion_dynamic": ["linear_acceleration"],
    "minecraft:particle_motion_parametric": ["relative_position", "direction"],
    "minecraft:particle_initial_speed": ["*"],
    "minecraft:emitter_shape_point": ["offset", "direction"],
    "minecraft:emitter_shape_sphere": ["offset", "direction"],
    "minecraft:emitter_shape_box": ["offset", "direction"],
    "minecraft:emitter_shape_disc": ["offset", "direction", "plane_normal"],
    "minecraft:emitter_shape_entity_aabb": ["direction"]
  };
  function mirror_motion(components) {
    for (const [name2, fields] of Object.entries(MIRRORED_FIELDS)) {
      const component = components[name2];
      if (!component) continue;
      if (fields[0] === "*") {
        if (Array.isArray(component)) components[name2] = component.map(negate);
        continue;
      }
      for (const field of fields) {
        if (Array.isArray(component[field])) component[field] = component[field].map(negate);
      }
    }
    return components;
  }
  function particle_data_point(effect, locator) {
    const file = resolve_particle_effect(effect);
    const dp = { effect, locator: locator || "" };
    if (file) dp.file = file;
    return dp;
  }
  Blockbench.on("load_project", () => {
    if (!is_vs_project(Project)) return;
    relink_particle_previews();
  });
  function ensure_particle_links(animator, relink = false) {
    let linked = 0;
    for (const keyframe of animator?.particle || []) {
      for (const dp of keyframe.data_points) {
        if (dp.file && !relink) {
          ensure_emitter_namespaced(dp.file);
          continue;
        }
        const file = resolve_particle_effect(dp.effect || "");
        if (file) {
          dp.file = file;
          linked++;
        } else if (relink) {
          if (dp.file && fs.existsSync(dp.file) && ensure_emitter_namespaced(dp.file)) linked++;
          else delete dp.file;
        }
      }
    }
    return linked;
  }
  function relink_particle_previews() {
    clear_particle_cache();
    let linked = 0;
    for (const animation of Blockbench.Animation.all) {
      linked += ensure_particle_links(animation.animators?.effects, true);
    }
    return linked;
  }

  // src/animation_sounds.ts
  init_util();
  init_native();
  var SOUND_EXTENSIONS = [".ogg", ".wav", ".mp3"];
  var SOUND_DEFAULTS = { vs_range: 32, vs_volume: 1, vs_pitch: 1, vs_chance: 1 };
  function onSoundKeyframe(dataPoint) {
    return dataPoint?.keyframe?.channel === "sound";
  }
  if (typeof KeyframeDataPoint !== "undefined") {
    for (const [key, value] of Object.entries(SOUND_DEFAULTS)) {
      const name2 = key.slice(3);
      new Property(KeyframeDataPoint, "number", key, {
        label: name2[0].toUpperCase() + name2.slice(1),
        exposed: true,
        default: value,
        condition: onSoundKeyframe
      });
    }
    new Property(KeyframeDataPoint, "boolean", "vs_looping", {
      label: "Looping",
      exposed: true,
      default: false,
      condition: onSoundKeyframe
    });
  }
  function readSoundOptions(dp) {
    const out = {};
    for (const key of ["range", "volume", "pitch", "chance"]) {
      const raw = dp[`vs_${key}`];
      if (raw === void 0 || raw === null || raw === "") continue;
      const value = Number(raw);
      if (!Number.isFinite(value) || value === SOUND_DEFAULTS[`vs_${key}`]) continue;
      out[key] = value;
    }
    if (dp.vs_looping === true) out.looping = true;
    return out;
  }
  function without_extension(path7) {
    for (const ext of SOUND_EXTENSIONS) {
      if (path7.toLowerCase().endsWith(ext)) return path7.slice(0, -ext.length);
    }
    return path7;
  }
  function sound_location_for_file(filePath) {
    const p = filePath.replace(/\\/g, "/");
    const match = /\/assets\/([^/]+)\/(sounds\/.+)$/.exec(p);
    if (!match) return null;
    return `${match[1]}:${without_extension(match[2])}`;
  }
  function sound_location_for_data_point(dp) {
    const effect = (dp.effect || "").trim();
    if (!effect) return dp.file ? sound_location_for_file(dp.file) : null;
    if (effect.includes(":") || effect.includes("/")) return effect;
    const fromFile = sound_location_for_file(dp.file || sound_file_for_location(effect) || "");
    if (!fromFile) return effect;
    const colon = fromFile.indexOf(":");
    const domain = fromFile.slice(0, colon);
    const folder = fromFile.slice(colon + 1).split("/").slice(0, -1).join("/");
    return folder ? `${domain}:${folder}/${effect}` : `${domain}:${effect}`;
  }
  function sound_from_data_point(dp) {
    const location = sound_location_for_data_point(dp);
    if (!location) return null;
    return { location, ...readSoundOptions(dp) };
  }
  function sound_file_for_location(location) {
    const modelPath = Project?.save_path || Project?.export_path;
    if (!modelPath) return null;
    const ctx = parse_model_location(modelPath);
    if (!ctx) return null;
    const colon = location.indexOf(":");
    const domain = colon >= 0 ? location.slice(0, colon) : ctx.domain;
    const path7 = (colon >= 0 ? location.slice(colon + 1) : location).replace(/^sounds\//, "");
    if (!path7) return null;
    const concrete = path7.split("*").join("1");
    const soundsRoot = `${ctx.assetsRoot}/${domain}/sounds`;
    for (const ext of SOUND_EXTENSIONS) {
      const candidate = `${soundsRoot}/${concrete}${ext}`;
      if (fs.existsSync(candidate)) return candidate;
    }
    return find_sound_by_name(soundsRoot, concrete.split("/").pop() ?? concrete);
  }
  function find_sound_by_name(dir, name2, depth = 0) {
    if (depth > 6 || !fs.existsSync(dir)) return null;
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return null;
    }
    for (const entry of entries) {
      if (entry.isFile() && SOUND_EXTENSIONS.some((ext) => entry.name.toLowerCase() === name2.toLowerCase() + ext)) {
        return `${dir}/${entry.name}`;
      }
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const found = find_sound_by_name(`${dir}/${entry.name}`, name2, depth + 1);
      if (found) return found;
    }
    return null;
  }
  function ensure_sound_links(animator, relink = false) {
    let linked = 0;
    for (const keyframe of animator?.sound || []) {
      for (const dp of keyframe.data_points) {
        if (dp.file && !relink) continue;
        const file = sound_file_for_location((dp.effect || "").trim());
        if (file) {
          dp.file = file;
          linked++;
        } else if (relink) {
          delete dp.file;
        }
      }
    }
    return linked;
  }
  function relink_sound_files() {
    let linked = 0;
    for (const animation of Blockbench.Animation.all) {
      linked += ensure_sound_links(animation.animators?.effects, true);
    }
    return linked;
  }
  Blockbench.on("load_project", () => {
    if (!is_vs_project(Project)) return;
    relink_sound_files();
  });
  function sound_data_point(sound) {
    const dp = { effect: sound.location };
    const file = sound_file_for_location(sound.location);
    if (file) dp.file = file;
    for (const key of ["range", "volume", "pitch", "chance"]) {
      if (sound[key] !== void 0) dp[`vs_${key}`] = sound[key];
    }
    if (sound.looping) dp.vs_looping = true;
    return dp;
  }

  // src/import_animation.ts
  init_preserved_props();
  function create_animation(vsAnimation, path7, saved_name) {
    const FPS = fps;
    const animationLength = vsAnimation.quantityframes / FPS;
    const onAnimationEnd = vsAnimation.onAnimationEnd ?? "Repeat";
    const animation = new Blockbench.Animation({
      name: vsAnimation.name,
      path: path7 || "",
      loop: onAnimationEnd === "Repeat" ? "loop" : onAnimationEnd === "Hold" ? "hold" : "once",
      length: animationLength,
      snapping: FPS
    }).add();
    if (path7) animation.path = path7;
    if (saved_name) {
      animation.saved_name = saved_name;
      animation.saved = true;
    }
    animation.vs_code = vsAnimation.code;
    animation.vs_onActivityStopped = vsAnimation.onActivityStopped ?? "Rewind";
    animation.vs_onAnimationEnd = onAnimationEnd;
    store_animation_extras(animation, vsAnimation);
    const channelFrames = buildChannelFrames(vsAnimation);
    vsAnimation.keyframes.forEach((vsKeyframe) => {
      if (vsKeyframe.particles && vsKeyframe.particles.length > 0) {
        const effects = getEffectAnimator(animation);
        effects.addKeyframe({
          channel: "particle",
          time: vsKeyframe.frame / FPS,
          data_points: vsKeyframe.particles.map((p) => particle_data_point(p.effect, p.atAttachmentPoint))
        });
      }
      if (vsKeyframe.sounds && vsKeyframe.sounds.length > 0) {
        getEffectAnimator(animation).addKeyframe({
          channel: "sound",
          time: vsKeyframe.frame / FPS,
          data_points: vsKeyframe.sounds.map((s) => sound_data_point(s))
        });
      }
      if (vsKeyframe.textures) {
        getEffectAnimator(animation).addKeyframe({
          channel: "timeline",
          time: vsKeyframe.frame / FPS,
          data_points: [{ script: `"textures": ${JSON.stringify(vsKeyframe.textures)}` }]
        });
      }
      for (const boneName in vsKeyframe.elements) {
        const transform = vsKeyframe.elements[boneName];
        let bone = Group.all.find((g) => g.name === boneName);
        if (!bone) {
          const cube = Cube.all.find((c) => c.name === boneName);
          if (cube) {
            bone = new Group(cube.getSaveCopy()).sortInBefore(cube).init();
            cube.name = `${boneName}_geo`;
            cube.rotation = [0, 0, 0];
            cube.stepParentName = "";
            cube.addTo(bone);
            Canvas.updateAllPositions();
          }
        }
        if (!bone) continue;
        const animator = animation.getBoneAnimator(bone);
        const frames = channelFrames[boneName];
        Object.keys(IMPORT_CHANNELS).forEach((channel) => {
          const opts = buildChannelKeyframeOptions(transform, channel, vsKeyframe.frame, frames[channel], FPS);
          if (opts) animator.addKeyframe(opts);
        });
      }
    });
    return animation;
  }
  function import_animations(animations) {
    animations.forEach((vsAnimation) => create_animation(vsAnimation));
  }
  function getEffectAnimator(animation) {
    const animators = animation.animators;
    if (animators.effects) return animators.effects;
    animators.effects = new EffectAnimator(animation);
    return animators.effects;
  }
  var IMPORT_CHANNELS = {
    rotation: {
      interp: "rotationInterp",
      value: ["rotationX", "rotationY", "rotationZ"],
      tangentIn: ["rotationTangentInX", "rotationTangentInY", "rotationTangentInZ"],
      tangentOut: ["rotationTangentOutX", "rotationTangentOutY", "rotationTangentOutZ"],
      widthIn: ["rotationTangentInWidthX", "rotationTangentInWidthY", "rotationTangentInWidthZ"],
      widthOut: ["rotationTangentOutWidthX", "rotationTangentOutWidthY", "rotationTangentOutWidthZ"],
      default: 0
    },
    position: {
      interp: "positionInterp",
      value: ["offsetX", "offsetY", "offsetZ"],
      tangentIn: ["offsetTangentInX", "offsetTangentInY", "offsetTangentInZ"],
      tangentOut: ["offsetTangentOutX", "offsetTangentOutY", "offsetTangentOutZ"],
      widthIn: ["offsetTangentInWidthX", "offsetTangentInWidthY", "offsetTangentInWidthZ"],
      widthOut: ["offsetTangentOutWidthX", "offsetTangentOutWidthY", "offsetTangentOutWidthZ"],
      default: 0
    },
    scale: {
      interp: "scaleInterp",
      value: ["stretchX", "stretchY", "stretchZ"],
      tangentIn: ["stretchTangentInX", "stretchTangentInY", "stretchTangentInZ"],
      tangentOut: ["stretchTangentOutX", "stretchTangentOutY", "stretchTangentOutZ"],
      widthIn: ["stretchTangentInWidthX", "stretchTangentInWidthY", "stretchTangentInWidthZ"],
      widthOut: ["stretchTangentOutWidthX", "stretchTangentOutWidthY", "stretchTangentOutWidthZ"],
      default: 1
    }
  };
  var ANIMATION_KNOWN_KEYS = /* @__PURE__ */ new Set([
    "name",
    "code",
    "quantityframes",
    "onActivityStopped",
    "onAnimationEnd",
    "keyframes"
  ]);
  var KEYFRAME_KNOWN_KEYS = /* @__PURE__ */ new Set(["frame", "elements", "textures", "particles", "sounds"]);
  var ANIMATION_KEY_KNOWN_KEYS = new Set(
    Object.keys(IMPORT_CHANNELS).flatMap((channel) => {
      const cfg = IMPORT_CHANNELS[channel];
      return [cfg.interp, ...cfg.value, ...cfg.tangentIn, ...cfg.tangentOut, ...cfg.widthIn, ...cfg.widthOut];
    })
  );
  function store_animation_extras(animation, vsAnimation) {
    const animationExtras = collect_extras(vsAnimation, ANIMATION_KNOWN_KEYS);
    if (animationExtras) animation.vs_extra_props = animationExtras;
    const keyframeExtras = {};
    const elementExtras = {};
    vsAnimation.keyframes.forEach((vsKeyframe) => {
      const frame = String(vsKeyframe.frame);
      const extras = collect_extras(vsKeyframe, KEYFRAME_KNOWN_KEYS);
      if (extras) keyframeExtras[frame] = extras;
      for (const boneName in vsKeyframe.elements) {
        const elemExtras = collect_extras(vsKeyframe.elements[boneName], ANIMATION_KEY_KNOWN_KEYS);
        if (!elemExtras) continue;
        (elementExtras[boneName] = elementExtras[boneName] || {})[frame] = elemExtras;
      }
    });
    if (Object.keys(keyframeExtras).length) animation.vs_extra_keyframe_props = keyframeExtras;
    if (Object.keys(elementExtras).length) animation.vs_extra_element_props = elementExtras;
  }
  function buildChannelFrames(vsAnimation) {
    const map = {};
    vsAnimation.keyframes.forEach((kf) => {
      for (const boneName in kf.elements) {
        const transform = kf.elements[boneName];
        const entry = map[boneName] || (map[boneName] = { rotation: [], position: [], scale: [] });
        Object.keys(IMPORT_CHANNELS).forEach((channel) => {
          if (IMPORT_CHANNELS[channel].value.some((k) => transform[k] != null)) {
            entry[channel].push(kf.frame);
          }
        });
      }
    });
    for (const boneName in map) {
      Object.keys(map[boneName]).forEach((channel) => map[boneName][channel].sort((a, b) => a - b));
    }
    return map;
  }
  function buildChannelKeyframeOptions(transform, channel, frame, channelFrames, fps2) {
    const cfg = IMPORT_CHANNELS[channel];
    if (!cfg.value.some((k) => transform[k] != null)) return null;
    const value = {
      x: transform[cfg.value[0]] ?? cfg.default,
      y: transform[cfg.value[1]] ?? cfg.default,
      z: transform[cfg.value[2]] ?? cfg.default
    };
    const bbInterp = mapInterpolation(transform[cfg.interp]);
    const opts = {
      interpolation: bbInterp,
      time: frame / fps2,
      channel,
      data_points: [{ x: value.x, y: value.y, z: value.z }]
    };
    if (bbInterp === "bezier") {
      const { outDur, inDur } = segmentDurations(channelFrames, frame);
      const right = reconstructHandle(transform, cfg.tangentOut, cfg.widthOut, outDur, 1, fps2);
      const left = reconstructHandle(transform, cfg.tangentIn, cfg.widthIn, inDur, -1, fps2);
      if (right) {
        opts.bezier_right_value = right.value;
        opts.bezier_right_time = right.time;
      }
      if (left) {
        opts.bezier_left_value = left.value;
        opts.bezier_left_time = left.time;
      }
    }
    return opts;
  }
  function segmentDurations(frames, frame) {
    const i = frames.indexOf(frame);
    if (i === -1) return { outDur: 0, inDur: 0 };
    const prev = i > 0 ? frames[i - 1] : null;
    const next = i < frames.length - 1 ? frames[i + 1] : null;
    return {
      outDur: next != null ? next - frame : 0,
      inDur: prev != null ? frame - prev : 0
    };
  }
  function reconstructHandle(transform, tangentFields, widthFields, segmentFrames, sign, fps2) {
    if (segmentFrames <= 0) return null;
    const defaultWidth = sign * segmentFrames / 3;
    const value = [0, 0, 0];
    const time = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      const wRaw = transform[widthFields[i]];
      const widthFrames = wRaw != null ? Number(wRaw) : defaultWidth;
      const tRaw = transform[tangentFields[i]];
      const tangent = tRaw != null ? Number(tRaw) : 0;
      time[i] = widthFrames / fps2;
      value[i] = widthFrames !== 0 ? tangent * widthFrames / segmentFrames : 0;
    }
    return { value, time };
  }
  function mapInterpolation(interp) {
    if (interp === "Bezier") return "bezier";
    if (interp === "Step") return "step";
    return "linear";
  }
  function clear_animations() {
    const all = Blockbench.Animation.all.slice();
    all.forEach((a) => a.remove(true));
    return all.length;
  }

  // src/import.ts
  init_property();
  init_preserved_props();

  // src/util/misc.ts
  var import_json52 = __toESM(require_lib(), 1);
  init_native();
  var path3 = requireNativeModule("path");
  function load_back_drop_shape(backDropShape) {
    Blockbench.read([get_shape_location(null, backDropShape)], {
      readtype: "text",
      errorbox: false
    }, (files) => {
      im(import_json52.default.parse(files[0].content), files[0].path, true);
    });
  }
  function get_shape_location(domain, rel_path) {
    for (const base_mod_path of ["creative", "game", "survival"]) {
      const f = path3.posix.format({
        root: get_game_path() + path3.sep + "assets" + path3.sep + base_mod_path + path3.sep + "shapes" + path3.sep,
        name: rel_path,
        ext: ".json"
      });
      const exists = fs.existsSync(f);
      if (exists) {
        return f;
      }
    }
    return "";
  }
  function is_backdrop_project() {
    return Group.all.some((g) => g.backdrop) || Cube.all.some((c) => c.backdrop);
  }

  // src/export_animation.ts
  init_util();
  init_preserved_props();
  function mapInterpolation2(bbMode) {
    if (!bbMode || bbMode === "linear") return { mode: null, isCatmull: false };
    if (bbMode === "bezier") return { mode: "Bezier", isCatmull: false };
    if (bbMode === "step") return { mode: "Step", isCatmull: false };
    if (bbMode === "catmullrom") return { mode: "Bezier", isCatmull: true };
    return { mode: null, isCatmull: false };
  }
  function applyBezierHandle(elem, valueDeltas, timeDeltas, segmentFrames, defaultWidthFrames, fps2, tangentFields, widthFields) {
    if (!valueDeltas || !timeDeltas || segmentFrames <= 0) return;
    for (let i = 0; i < 3; i++) {
      const widthFrames = Number(timeDeltas[i]) * fps2;
      if (widthFrames === 0) continue;
      const tangent = Number(valueDeltas[i]) * segmentFrames / widthFrames;
      if (tangent !== 0) elem[tangentFields[i]] = tangent;
      if (Math.abs(widthFrames - defaultWidthFrames) > 1e-9) elem[widthFields[i]] = widthFrames;
    }
  }
  function computeCatmullRomTangents(channelKfs, idx, axis, fps2) {
    const cur = channelKfs[idx];
    const prev = idx > 0 ? channelKfs[idx - 1] : null;
    const next = idx < channelKfs.length - 1 ? channelKfs[idx + 1] : null;
    const curFrame = Math.round(cur.time * fps2);
    const curVal = Number(cur.data_points[0][axis]);
    let slopePerFrame = 0;
    if (prev && next) {
      const prevFrame = Math.round(prev.time * fps2);
      const nextFrame = Math.round(next.time * fps2);
      const span = nextFrame - prevFrame;
      if (span > 0) {
        slopePerFrame = (Number(next.data_points[0][axis]) - Number(prev.data_points[0][axis])) / span;
      }
    } else if (next) {
      const nextFrame = Math.round(next.time * fps2);
      const span = nextFrame - curFrame;
      if (span > 0) slopePerFrame = (Number(next.data_points[0][axis]) - curVal) / span;
    } else if (prev) {
      const prevFrame = Math.round(prev.time * fps2);
      const span = curFrame - prevFrame;
      if (span > 0) slopePerFrame = (curVal - Number(prev.data_points[0][axis])) / span;
    }
    const outDur = next ? Math.max(0, Math.round(next.time * fps2) - curFrame) : 0;
    const inDur = prev ? Math.max(0, curFrame - Math.round(prev.time * fps2)) : 0;
    return { out: slopePerFrame * outDur, in: slopePerFrame * inDur };
  }
  function applyCatmullRomToKey(elem, channel, channelKfs, idx, fps2) {
    const fields = CHANNEL_FIELDS[channel];
    elem[fields.interp] = "Bezier";
    const tx = computeCatmullRomTangents(channelKfs, idx, "x", fps2);
    const ty = computeCatmullRomTangents(channelKfs, idx, "y", fps2);
    const tz = computeCatmullRomTangents(channelKfs, idx, "z", fps2);
    if (tx.out !== 0) elem[fields.tangentOutX] = tx.out;
    if (ty.out !== 0) elem[fields.tangentOutY] = ty.out;
    if (tz.out !== 0) elem[fields.tangentOutZ] = tz.out;
    if (tx.in !== 0) elem[fields.tangentInX] = tx.in;
    if (ty.in !== 0) elem[fields.tangentInY] = ty.in;
    if (tz.in !== 0) elem[fields.tangentInZ] = tz.in;
  }
  var CHANNEL_FIELDS = {
    position: {
      interp: "positionInterp",
      tangentInX: "offsetTangentInX",
      tangentInY: "offsetTangentInY",
      tangentInZ: "offsetTangentInZ",
      tangentOutX: "offsetTangentOutX",
      tangentOutY: "offsetTangentOutY",
      tangentOutZ: "offsetTangentOutZ",
      tangentInWidthX: "offsetTangentInWidthX",
      tangentInWidthY: "offsetTangentInWidthY",
      tangentInWidthZ: "offsetTangentInWidthZ",
      tangentOutWidthX: "offsetTangentOutWidthX",
      tangentOutWidthY: "offsetTangentOutWidthY",
      tangentOutWidthZ: "offsetTangentOutWidthZ"
    },
    rotation: {
      interp: "rotationInterp",
      tangentInX: "rotationTangentInX",
      tangentInY: "rotationTangentInY",
      tangentInZ: "rotationTangentInZ",
      tangentOutX: "rotationTangentOutX",
      tangentOutY: "rotationTangentOutY",
      tangentOutZ: "rotationTangentOutZ",
      tangentInWidthX: "rotationTangentInWidthX",
      tangentInWidthY: "rotationTangentInWidthY",
      tangentInWidthZ: "rotationTangentInWidthZ",
      tangentOutWidthX: "rotationTangentOutWidthX",
      tangentOutWidthY: "rotationTangentOutWidthY",
      tangentOutWidthZ: "rotationTangentOutWidthZ"
    },
    scale: {
      interp: "scaleInterp",
      tangentInX: "stretchTangentInX",
      tangentInY: "stretchTangentInY",
      tangentInZ: "stretchTangentInZ",
      tangentOutX: "stretchTangentOutX",
      tangentOutY: "stretchTangentOutY",
      tangentOutZ: "stretchTangentOutZ",
      tangentInWidthX: "stretchTangentInWidthX",
      tangentInWidthY: "stretchTangentInWidthY",
      tangentInWidthZ: "stretchTangentInWidthZ",
      tangentOutWidthX: "stretchTangentOutWidthX",
      tangentOutWidthY: "stretchTangentOutWidthY",
      tangentOutWidthZ: "stretchTangentOutWidthZ"
    }
  };
  function applyInterpolationToKey(elem, channel, kf, interp, channelKfs, idx, fps2) {
    const fields = CHANNEL_FIELDS[channel];
    elem[fields.interp] = interp;
    if (interp !== "Bezier") return;
    const curFrame = Math.round(kf.time * fps2);
    const prev = channelKfs && idx > 0 ? channelKfs[idx - 1] : null;
    const next = channelKfs && idx >= 0 && idx < channelKfs.length - 1 ? channelKfs[idx + 1] : null;
    const outDur = next ? Math.max(0, Math.round(next.time * fps2) - curFrame) : 0;
    const inDur = prev ? Math.max(0, curFrame - Math.round(prev.time * fps2)) : 0;
    if (outDur > 0) {
      applyBezierHandle(
        elem,
        kf.bezier_right_value,
        kf.bezier_right_time,
        outDur,
        outDur / 3,
        fps2,
        [fields.tangentOutX, fields.tangentOutY, fields.tangentOutZ],
        [fields.tangentOutWidthX, fields.tangentOutWidthY, fields.tangentOutWidthZ]
      );
    }
    if (inDur > 0) {
      applyBezierHandle(
        elem,
        kf.bezier_left_value,
        kf.bezier_left_time,
        inDur,
        -inDur / 3,
        fps2,
        [fields.tangentInX, fields.tangentInY, fields.tangentInZ],
        [fields.tangentInWidthX, fields.tangentInWidthY, fields.tangentInWidthZ]
      );
    }
  }
  var CHANNEL_AXIS_NEUTRALS = [
    [["offsetX", "offsetY", "offsetZ"], 0],
    [["rotationX", "rotationY", "rotationZ"], 0],
    [["stretchX", "stretchY", "stretchZ"], 1]
  ];
  function pad_partial_channels(elem) {
    for (const [axes, neutral] of CHANNEL_AXIS_NEUTRALS) {
      if (axes.some((axis) => elem[axis] !== void 0)) {
        for (const axis of axes) {
          if (elem[axis] === void 0) elem[axis] = neutral;
        }
      }
    }
  }
  function compile_animation(animation, catmullConverted) {
    if (is_backdrop_project()) return null;
    const keyframes = {};
    const fps2 = fps;
    const baseFrameCount = get_base_frame_quantity(animation);
    const animators = Object.values(animation.animators || {});
    let hadCatmullConversion = false;
    animators.forEach((animator) => {
      if (animator.type === "bone" && animator.keyframes && animator.keyframes.length > 0) {
        if (typeof NullObject !== "undefined" && NullObject.all?.some((n) => n.uuid === animator.uuid)) {
          return;
        }
        const bone_name = animator.name;
        const byChannel = { position: [], rotation: [], scale: [] };
        animator.keyframes.forEach((kf) => {
          if (kf.channel === "position" || kf.channel === "rotation" || kf.channel === "scale") {
            byChannel[kf.channel].push(kf);
          }
        });
        Object.keys(byChannel).forEach((ch) => byChannel[ch].sort((a, b) => a.time - b.time));
        const scaleNeedsAllKeys = byChannel.scale.some((kf) => mapInterpolation2(kf.interpolation).mode !== null || ["x", "y", "z"].some((axis) => Number(kf.data_points[0][axis]) !== 1));
        animator.keyframes.forEach((kf) => {
          const { mode: vsInterp, isCatmull } = mapInterpolation2(kf.interpolation);
          if (isCatmull) hadCatmullConversion = true;
          const frame = Math.round(kf.time * fps2);
          keyframes[frame] = keyframes[frame] || { frame, elements: {} };
          keyframes[frame].elements[bone_name] = keyframes[frame].elements[bone_name] || {};
          const elem = keyframes[frame].elements[bone_name];
          const dataPoint = kf.data_points[0];
          const value = { x: Number(dataPoint.x), y: Number(dataPoint.y), z: Number(dataPoint.z) };
          const channel = kf.channel;
          const channelKfs = channel in byChannel ? byChannel[channel] : null;
          const applyInterp = () => {
            if (!vsInterp) return;
            const idx = channelKfs ? channelKfs.indexOf(kf) : -1;
            if (isCatmull && channelKfs) {
              applyCatmullRomToKey(elem, channel, channelKfs, idx, fps2);
            } else {
              applyInterpolationToKey(elem, channel, kf, vsInterp, channelKfs, idx, fps2);
            }
          };
          switch (kf.channel) {
            case "rotation":
              elem.rotationX = value.x;
              elem.rotationY = value.y;
              elem.rotationZ = value.z;
              applyInterp();
              break;
            case "position":
              elem.offsetX = value.x;
              elem.offsetY = value.y;
              elem.offsetZ = value.z;
              applyInterp();
              break;
            case "scale":
              if (scaleNeedsAllKeys || value.x !== 1 || value.y !== 1 || value.z !== 1) {
                elem.stretchX = value.x;
                elem.stretchY = value.y;
                elem.stretchZ = value.z;
              }
              applyInterp();
              break;
          }
        });
      }
      if (animator.type === "effect" && animator.keyframes && animator.keyframes.length > 0) {
        animator.keyframes.forEach((kf) => {
          if (kf.channel === "timeline") {
            const script = kf.data_points[0]?.script;
            if (script) {
              const textures = parseTextureSwapScript(script);
              if (textures) {
                const frame = Math.round(kf.time * fps2);
                keyframes[frame] = keyframes[frame] || { frame, elements: {} };
                keyframes[frame].textures = textures;
              }
            }
          }
          if (kf.channel === "particle") {
            kf.data_points.forEach((dp) => {
              const effect = (dp.effect || "").trim();
              if (!effect) return;
              const frame = Math.round(kf.time * fps2);
              keyframes[frame] = keyframes[frame] || { frame, elements: {} };
              const particle = { effect };
              const locator = (dp.locator || "").trim();
              if (locator) particle.atAttachmentPoint = locator;
              (keyframes[frame].particles = keyframes[frame].particles || []).push(particle);
            });
          }
          if (kf.channel === "sound") {
            kf.data_points.forEach((dp) => {
              const sound = sound_from_data_point(dp);
              if (!sound) return;
              const frame = Math.round(kf.time * fps2);
              keyframes[frame] = keyframes[frame] || { frame, elements: {} };
              (keyframes[frame].sounds = keyframes[frame].sounds || []).push(sound);
            });
          }
        });
      }
    });
    normalize_terminal_keyframe(keyframes, baseFrameCount);
    for (const keyframe of Object.values(keyframes)) {
      const frame = String(keyframe.frame);
      apply_extra_props(keyframe, animation.vs_extra_keyframe_props?.[frame]);
      for (const [bone_name, elem] of Object.entries(keyframe.elements)) {
        apply_extra_props(elem, animation.vs_extra_element_props?.[bone_name]?.[frame]);
        pad_partial_channels(elem);
      }
    }
    for (const keyframe of Object.values(keyframes)) {
      const wrapped_elements = {};
      for (const [element, content] of Object.entries(keyframe.elements)) {
        wrapped_elements[element] = new oneLiner(content);
      }
      keyframe.elements = wrapped_elements;
      if (keyframe.particles) {
        keyframe.particles = keyframe.particles.map((p) => new oneLiner(p));
      }
      if (keyframe.sounds) {
        keyframe.sounds = keyframe.sounds.map((s) => new oneLiner(s));
      }
    }
    const storedCode = animation.vs_code;
    const storedOnActivityStopped = animation.vs_onActivityStopped;
    const storedOnAnimationEnd = animation.vs_onAnimationEnd;
    const loopToEnd = {
      loop: ["Repeat"],
      hold: ["Hold"],
      once: ["Stop", "EaseOut"]
    };
    const validEnds = loopToEnd[animation.loop] ?? loopToEnd.once;
    const onAnimationEnd = storedOnAnimationEnd && validEnds.includes(storedOnAnimationEnd) ? storedOnAnimationEnd : validEnds[0];
    const vsAnimation = {
      name: animation.name,
      code: storedCode || animation.name.toLowerCase().replace(/ /g, ""),
      quantityframes: get_frame_quantity(animation, keyframes),
      onActivityStopped: storedOnActivityStopped || "Rewind",
      onAnimationEnd,
      keyframes: Object.values(keyframes).sort((a, b) => a.frame - b.frame)
    };
    if (vsAnimation.quantityframes === 0 && vsAnimation.keyframes.length > 0) {
      const frame0 = vsAnimation.keyframes.find((kf) => kf.frame === 0);
      if (frame0) {
        const frame1 = JSON.parse(JSON.stringify(frame0));
        frame1.frame = 1;
        vsAnimation.keyframes.push(frame1);
        vsAnimation.quantityframes = 1;
      }
    }
    if (vsAnimation.onAnimationEnd === "Repeat" && vsAnimation.quantityframes > 0) {
      const lastFrame = vsAnimation.quantityframes - 1;
      const hasLastFrame = vsAnimation.keyframes.some((kf) => kf.frame === lastFrame);
      if (!hasLastFrame) {
        const frame0 = vsAnimation.keyframes.find((kf) => kf.frame === 0);
        if (frame0) {
          const virtualFrame = JSON.parse(JSON.stringify(frame0));
          virtualFrame.frame = lastFrame;
          delete virtualFrame.sounds;
          delete virtualFrame.particles;
          vsAnimation.keyframes.push(virtualFrame);
          vsAnimation.keyframes.sort((a, b) => a.frame - b.frame);
        }
      }
    }
    if (vsAnimation.keyframes.length === 0) return null;
    apply_extra_props(vsAnimation, animation.vs_extra_props);
    if (hadCatmullConversion && catmullConverted) catmullConverted.push(animation.name);
    return vsAnimation;
  }
  function compile_animation_library(animations, code, name2) {
    const catmullConverted = [];
    const compiled = animations.map((a) => compile_animation(a, catmullConverted)).filter((a) => a !== null);
    if (catmullConverted.length > 0) display_catmull_conversion_notice(catmullConverted);
    const library = { animations: compiled };
    if (code) library.code = code;
    if (name2) library.name = name2;
    return library;
  }
  function get_frame_quantity(animation, keyframes) {
    const quantityframes = get_base_frame_quantity(animation);
    const keyframe_frames = Object.keys(keyframes).map((kf) => parseInt(kf));
    if (keyframe_frames.length === 0) {
      return quantityframes;
    }
    const max_keyframe = Math.max(...keyframe_frames);
    if (max_keyframe >= quantityframes) {
      display_animation_length_warning(animation.name);
      return max_keyframe + 1;
    }
    return quantityframes;
  }
  function get_base_frame_quantity(animation) {
    return Math.max(1, Math.round(animation.length * fps));
  }
  function normalize_terminal_keyframe(keyframes, quantityframes) {
    const terminalFrame = quantityframes;
    const lastExportableFrame = quantityframes - 1;
    const terminalKeyframe = keyframes[terminalFrame];
    if (!terminalKeyframe) {
      return;
    }
    const previousKeyframe = keyframes[lastExportableFrame];
    if (previousKeyframe) {
      if (keyframe_contents_match(previousKeyframe, terminalKeyframe)) {
        delete keyframes[terminalFrame];
        return;
      }
      return;
    }
    const shiftedKeyframe = clone_keyframe(terminalKeyframe);
    shiftedKeyframe.frame = lastExportableFrame;
    keyframes[lastExportableFrame] = shiftedKeyframe;
    delete keyframes[terminalFrame];
  }
  function keyframe_contents_match(a, b) {
    return stable_keyframe_content(a) === stable_keyframe_content(b);
  }
  function stable_keyframe_content(keyframe) {
    return JSON.stringify({
      elements: sort_nested_object(keyframe.elements),
      textures: keyframe.textures ? sort_nested_object(keyframe.textures) : void 0,
      particles: keyframe.particles ? sort_nested_object(keyframe.particles) : void 0,
      sounds: keyframe.sounds ? sort_nested_object(keyframe.sounds) : void 0
    });
  }
  function sort_nested_object(value) {
    if (Array.isArray(value)) {
      return value.map(sort_nested_object);
    }
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, nestedValue]) => [key, sort_nested_object(nestedValue)])
      );
    }
    return value;
  }
  function clone_keyframe(keyframe) {
    return JSON.parse(JSON.stringify(keyframe));
  }
  function parseTextureSwapScript(script) {
    try {
      const trimmed = script.trim();
      const json = JSON.parse("{" + trimmed + "}");
      if (json.textures && typeof json.textures === "object") {
        return json.textures;
      }
    } catch {
    }
    return null;
  }
  function display_animation_length_warning(animation_name) {
    Blockbench.showMessageBox({
      title: "Animation Length Warning",
      message: `The animation "${animation_name}" has keyframes on or past the last frame. This may not animate correctly in Vintage Story. Consider moving the keyframes away from the last frame if you experience issues.`
    });
  }
  function display_catmull_conversion_notice(animation_names) {
    const animationList = animation_names.length === 1 ? `"${animation_names[0]}"` : animation_names.map((name2) => `"${name2}"`).join(", ");
    Blockbench.showMessageBox({
      title: "Catmull-Rom Converted to Bezier",
      message: `The following animation(s) had catmull-rom keyframes: ${animationList}

Vintage Story has no native catmull-rom mode, so these keyframes were exported as bezier with tangents computed from neighbouring keyframes. The curve is preserved (exact for uniform keyframe spacing, close otherwise). No action needed.`
    });
  }

  // src/animation_codec.ts
  var import_json53 = __toESM(require_lib(), 1);
  init_native();
  var libraryMeta = /* @__PURE__ */ new Map();
  function all_animations() {
    return Blockbench.Animation.all;
  }
  function default_animations_dir() {
    const modelPath = Project?.save_path || Project?.export_path;
    if (!modelPath) return void 0;
    const ctx = parse_model_location(modelPath);
    return ctx ? `${ctx.assetsRoot}/${ctx.domain}/animations` : void 0;
  }
  function build_library(path7, animations) {
    const meta = path7 ? libraryMeta.get(path7) : void 0;
    const stem = path7 ? basename_no_ext(path7) : void 0;
    const library = { animations };
    const code = meta?.code ?? stem;
    const name2 = meta?.name ?? stem;
    if (code) library.code = code;
    if (name2) library.name = name2;
    return library;
  }
  function read_library(path7) {
    if (!path7 || !fs.existsSync(path7)) return null;
    const library = import_json53.default.parse(fs.readFileSync(path7, "utf-8"));
    if (!Array.isArray(library.animations)) throw new Error(`Invalid animation library: ${path7}`);
    return library;
  }
  function load_file(file, animation_filter) {
    const json = file.json ?? import_json53.default.parse(file.content);
    const created = [];
    if (!Array.isArray(json.animations)) throw new Error(`Invalid animation library: ${file.path}`);
    libraryMeta.set(file.path, { code: json.code, name: json.name });
    for (const vsAnim of json.animations) {
      if (animation_filter && !animation_filter.includes(vsAnim.name)) continue;
      created.push(create_animation(vsAnim, file.path, vsAnim.name));
    }
    return created;
  }
  function compile_file(animations, compiled = compile_animation_library(animations).animations) {
    const path7 = animations[0]?.path;
    const sharedPath = path7 && animations.every((a) => a.path === path7) ? path7 : void 0;
    const library = read_library(sharedPath);
    if (!library) return build_library(sharedPath, compiled);
    if (sharedPath) libraryMeta.set(sharedPath, { code: library.code, name: library.name });
    const renamedFrom = /* @__PURE__ */ new Map();
    for (const a of animations) {
      if (a.saved_name && a.saved_name !== a.name) renamedFrom.set(a.name, a.saved_name);
    }
    for (const vsAnim of compiled) {
      const oldName = renamedFrom.get(vsAnim.name) ?? vsAnim.name;
      const idx = library.animations.findIndex((a) => a.name === oldName || a.name === vsAnim.name);
      if (idx >= 0) {
        library.animations[idx] = vsAnim;
        library.animations = library.animations.filter((a, i) => i === idx || a.name !== vsAnim.name);
      } else {
        library.animations.push(vsAnim);
      }
    }
    return library;
  }
  function pick_file() {
    Blockbench.import({
      resource_id: "vs_animation",
      type: "Vintage Story Animation",
      extensions: ["json"],
      multiple: true,
      startpath: default_animations_dir()
    }, (files) => {
      for (const file of files) {
        import_file(file);
      }
    });
  }
  function import_file(file) {
    Undo.initEdit({ animations: [], outliner: true, elements: Cube.all });
    const created = load_file(file);
    Undo.finishEdit("Import animations", { animations: created });
    return created;
  }
  function reload_animations(animations) {
    if (!animations.length) return;
    const path7 = animations[0].path;
    const json = import_json53.default.parse(fs.readFileSync(path7, "utf-8"));
    if (!Array.isArray(json.animations)) throw new Error(`Invalid animation library: ${path7}`);
    const selected = animations.find((a) => a.selected);
    Undo.initEdit({ animations, outliner: true, elements: Cube.all });
    animations.forEach((a) => a.remove(false, false));
    const created = load_file({ path: path7, json }, animations.map((a) => a.saved_name || a.name));
    for (const animation of created) {
      const previous = animations.find((a) => (a.saved_name || a.name) === animation.name);
      animation.vs_library_ref = previous.vs_library_ref;
      if (previous === selected) animation.select();
    }
    Undo.finishEdit("Reload animations", { animations: created });
  }
  function write_animation_to_library(animation) {
    const vsAnim = compile_animation(animation);
    if (!vsAnim) {
      Blockbench.showMessageBox({
        title: "Nothing to save",
        message: `Animation "${animation.name}" has no keyframes to export.`
      });
      return;
    }
    const path7 = animation.path;
    const library = compile_file([animation], [vsAnim]);
    Blockbench.writeFile(path7, { content: autoStringify(library) }, (real_path) => {
      animation.saved = true;
      animation.saved_name = animation.name;
      animation.path = real_path;
      Blockbench.showQuickMessage(`Saved "${animation.name}" to ${basename_no_ext(real_path)}.json`, 2e3);
    });
  }
  function save_animation(animation, save_as) {
    if (!animation.path || save_as) {
      Blockbench.export({
        resource_id: "vs_animation",
        type: "Vintage Story Animation",
        extensions: ["json"],
        name: animation.saved_name || animation.name,
        startpath: animation.path || default_animations_dir(),
        custom_writer: (_content, exportPath) => {
          if (!exportPath) return;
          animation.path = exportPath;
          delete animation.vs_library_ref;
          write_animation_to_library(animation);
        }
      });
      return;
    }
    write_animation_to_library(animation);
  }
  function export_file(path7, save_as) {
    const filterPath = path7 || "";
    const animations = all_animations().filter((a) => (a.path || "") === filterPath);
    if (animations.length === 0) return;
    if (!save_as && filterPath && fs.existsSync(filterPath)) {
      animations.forEach((a) => a.save());
      return;
    }
    Blockbench.export({
      resource_id: "vs_animation",
      type: "Vintage Story Animation",
      extensions: ["json"],
      name: filterPath && basename_no_ext(filterPath) || "animations",
      startpath: filterPath || default_animations_dir(),
      custom_writer: (_content, exportPath) => {
        if (!exportPath) return;
        animations.forEach((a) => {
          a.path = exportPath;
          delete a.vs_library_ref;
        });
        fs.writeFileSync(exportPath, autoStringify(compile_file(animations)));
        animations.forEach((a) => {
          a.saved = true;
          a.saved_name = a.name;
        });
      }
    });
  }
  function delete_animation_from_file(animation) {
    const path7 = animation.path;
    const library = read_library(path7);
    if (!library) return;
    const target = animation.saved_name ?? animation.name;
    library.animations = library.animations.filter((a) => a.name !== target);
    Blockbench.writeFile(path7, { content: autoStringify(library) });
  }
  function create_vs_animation_codec() {
    if (typeof AnimationCodec === "undefined") {
      console.error("[VS Plugin] This Blockbench version does not expose AnimationCodec; multi-file VS animation support is disabled. Update to Blockbench 5.x.");
      return void 0;
    }
    return new AnimationCodec("vintagestory", {
      multiple_per_file: true,
      pickFile: pick_file,
      importFile: import_file,
      loadFile: load_file,
      reloadFile: (path7) => reload_animations(all_animations().filter((a) => a.path === path7 && a.saved)),
      reloadAnimation: (animation) => reload_animations([animation]),
      compileAnimation: (animation) => compile_animation(animation),
      compileFile: compile_file,
      saveAnimation: save_animation,
      exportFile: export_file,
      deleteAnimationFromFile: delete_animation_from_file
    });
  }
  var vsAnimationCodec = create_vs_animation_codec();

  // src/import.ts
  init_native();
  function im(content, _path, asBackdrop) {
    if (!Project) {
      throw new Error("No project loaded during import");
    }
    Project.texture_width = content.textureWidth || 16;
    Project.texture_height = content.textureHeight || 16;
    if (content.textureSizes) {
      Project.vs_textureSizes = { ...content.textureSizes };
    }
    for (const name2 in content.textures) {
      const texturePath = get_texture_location(null, content.textures[name2]);
      const texture = new Texture({ name: name2, path: texturePath }).add().load();
      if (content.textureSizes && content.textureSizes[name2]) {
        texture.uv_width = content.textureSizes[name2][0];
        texture.uv_height = content.textureSizes[name2][1];
      }
      texture.textureLocation = content.textures[name2];
    }
    if (!asBackdrop) {
      if (content.editor) {
        for (const prop of VS_PROJECT_PROPS) {
          const prop_name = prop.name;
          Project[prop_name] = content.editor[prop_name];
        }
      }
      const shape_extras = collect_shape_extras(content);
      if (shape_extras) {
        Project.vs_extra_props = shape_extras;
      }
      const editor_extras = collect_editor_extras(content.editor);
      if (editor_extras) {
        Project.vs_extra_editor_props = editor_extras;
      }
      if (Project.backDropShape && Project.backDropShape !== "") {
        load_back_drop_shape(Project.backDropShape);
      }
    }
    import_model(content, asBackdrop, _path);
    if (content.animations) {
      import_animations(content.animations);
    }
    if (content.animationLibraries && content.animationLibraries.length > 0) {
      load_animation_libraries(content.animationLibraries, _path);
    }
  }
  function load_animation_libraries(refs, modelPath) {
    if (!vsAnimationCodec) return;
    for (const ref of refs) {
      const candidates = reference_to_candidate_paths(ref, modelPath);
      const filePath = candidates.find((p) => fs.existsSync(p));
      if (!filePath) {
        console.warn(`[VS Import] Animation library "${ref}" not found. Looked in: ${candidates.join(", ") || "(model is not inside an assets/<domain> tree)"}`);
        continue;
      }
      let fileContent;
      try {
        fileContent = fs.readFileSync(filePath, "utf-8");
      } catch (e) {
        console.error(`[VS Import] Failed to read animation library ${filePath}:`, e);
        continue;
      }
      const created = vsAnimationCodec.loadFile({ path: filePath, content: fileContent });
      for (const anim of created) {
        anim.vs_library_ref = ref;
      }
    }
  }

  // src/export_model/cube.ts
  init_property();
  init_preserved_props();

  // src/export_model/cube/faces.ts
  init_property();
  init_preserved_props();
  function transformUV(uv, rotation, direction) {
    if (direction === "down" /* DOWN */) {
      const correctedRotation = (rotation + 180) % 360;
      return { uv, rotation: correctedRotation };
    }
    return { uv, rotation };
  }
  function process_faces2(faces) {
    const processed_faces = {};
    for (const direction of Object.values(VS_Direction)) {
      const face = faces[direction];
      if (!face || !face.texture) {
        continue;
      }
      const faceTexture = face.texture;
      const isUvDefault = face.uv[0] === 0 && face.uv[1] === 0 && face.uv[2] === 0 && face.uv[3] === 0;
      const rotation = face.rotation || 0;
      const transformed = transformUV(face.uv, rotation, direction);
      const transformedUV = transformed.uv;
      const transformedRotation = transformed.rotation;
      const texture_name = get_texture_name(faceTexture);
      const processed_face = {
        texture: `#${texture_name}`,
        ...face.enabled === false && { enabled: false },
        ...!isUvDefault && { uv: transformedUV },
        ...transformedRotation !== 0 && { rotation: transformedRotation }
      };
      for (const prop of VS_FACE_PROPS) {
        const prop_name = prop.name;
        const value = face[prop_name];
        if (value === void 0 || value === null) continue;
        if (prop_name === "windMode") {
          if (Array.isArray(value) && value.every((v) => v === -1)) continue;
          processed_face[prop_name] = value;
          continue;
        }
        if (prop_name === "windData") {
          if (Array.isArray(value) && value.every((v) => v === 0)) continue;
          processed_face[prop_name] = value;
          continue;
        }
        if (typeof value === "number" && value === 0) continue;
        if (typeof value === "boolean" && value === false) continue;
        processed_face[prop_name] = value;
      }
      apply_extra_props(processed_face, face.vs_extra_props);
      processed_faces[direction] = new oneLiner(processed_face);
    }
    return processed_faces;
  }
  function get_texture_name(face_texture) {
    const texture = Texture.all.find((t) => t.uuid === face_texture);
    if (texture) {
      return texture.name;
    } else {
      console.error("Texture not found for UUID:", face_texture);
      return "missing_texture";
    }
  }

  // src/export_model/cube/factory.ts
  init_util();
  function create_VS_element(parent, node, parent_pos, offset, faces) {
    const converted_rotation = node.rotation;
    let from = vector_sub(node.from, parent_pos);
    let to = vector_sub(node.to, parent_pos);
    let rotationOrigin = vector_sub(node.origin, parent_pos);
    if (node.inflate && node.inflate !== 0) {
      from = [from[0] - node.inflate, from[1] - node.inflate, from[2] - node.inflate];
      to = [to[0] + node.inflate, to[1] + node.inflate, to[2] + node.inflate];
    }
    if (parent === null) {
      from = vector_add(from, offset);
      to = vector_add(to, offset);
      rotationOrigin = vector_add(rotationOrigin, offset);
    }
    const hasRotation = converted_rotation[0] !== 0 || converted_rotation[1] !== 0 || converted_rotation[2] !== 0;
    const includeRotationOrigin = hasRotation || node.vs_has_rotation_origin;
    return {
      name: node.name,
      from,
      to,
      ...includeRotationOrigin && { rotationOrigin },
      ...node.vs_uv ? { uv: node.vs_uv } : (node.uv_offset[0] !== 0 || node.uv_offset[1] !== 0) && { uv: node.uv_offset },
      faces,
      ...converted_rotation[0] !== 0 && { rotationX: converted_rotation[0] },
      ...converted_rotation[1] !== 0 && { rotationY: converted_rotation[1] },
      ...converted_rotation[2] !== 0 && { rotationZ: converted_rotation[2] }
    };
  }

  // src/export_model/cube.ts
  function process_cube2(parent, node, accu, offset, parent_from_override) {
    if (node.backdrop) {
      return;
    }
    const parent_pos = parent_from_override ? parent_from_override : parent ? parent.vs_group_from ?? parent.origin : [0, 0, 0];
    const reduced_faces = process_faces2(node.faces);
    const vsElement = create_VS_element(parent, node, parent_pos, offset, reduced_faces);
    for (const prop of VS_CUBE_PROPS) {
      const prop_name = prop.name;
      const value = node[prop_name];
      if (prop_name === "shade") {
        if (value !== true) {
          vsElement[prop_name] = value;
        }
        continue;
      }
      if (value !== void 0 && value !== null && value !== "" && value !== false) {
        const numValue = prop.type === "number" ? Number(value) : value;
        if (prop_name === "renderPass" && numValue === -1) {
          continue;
        }
        if (prop_name === "unwrapMode" && numValue === 0) {
          continue;
        }
        if (prop_name === "unwrapRotation" && numValue === 0) {
          continue;
        }
        if (prop_name === "paletteSlot" && numValue === 0) {
          continue;
        }
        vsElement[prop_name] = numValue;
      }
    }
    apply_extra_props(vsElement, node.vs_extra_props);
    accu.push(vsElement);
  }

  // src/export_model/group.ts
  init_util();
  init_property();
  init_preserved_props();
  init_locator();
  function get_parent_pos(parent, parent_from_override) {
    if (parent_from_override) {
      return parent_from_override;
    }
    if (!parent) return [0, 0, 0];
    return parent.vs_group_from ?? parent.origin;
  }
  function get_group_vs_from(node) {
    return node.vs_group_from ?? [...node.origin];
  }
  function get_group_vs_to(node) {
    return node.vs_group_to ?? [...node.origin];
  }
  function keeps_rotation_origin(node, element_from) {
    if (node.vs_has_rotation_origin !== false) return true;
    if (node.rotation.some((angle) => angle !== 0)) return true;
    return !vector_equals(node.origin, element_from);
  }
  function process_group2(parent, node, accu, offset, parent_from_override) {
    if (node.backdrop) {
      return;
    }
    const parent_pos = get_parent_pos(parent, parent_from_override);
    const converted_rotation = node.rotation;
    const node_vs_from = get_group_vs_from(node);
    const node_vs_to = get_group_vs_to(node);
    let from = vector_sub(node_vs_from, parent_pos);
    let to = vector_sub(node_vs_to, parent_pos);
    let rotationOrigin = vector_sub(node.origin, parent_pos);
    if (parent === null) {
      from = vector_add(from, offset);
      to = vector_add(to, offset);
      rotationOrigin = vector_add(rotationOrigin, offset);
    }
    const vsElement = {
      name: node.name,
      from,
      to,
      ...keeps_rotation_origin(node, node_vs_from) && { rotationOrigin },
      ...node.vs_uv ? { uv: node.vs_uv } : void 0,
      ...converted_rotation[0] !== 0 && { rotationX: converted_rotation[0] },
      ...converted_rotation[1] !== 0 && { rotationY: converted_rotation[1] },
      ...converted_rotation[2] !== 0 && { rotationZ: converted_rotation[2] },
      ...node.vs_zero_size_faces ? { faces: node.vs_zero_size_faces } : void 0,
      children: []
    };
    for (const prop of VS_GROUP_PROPS) {
      const prop_name = prop.name;
      const value = node[prop_name];
      if (value !== void 0 && value !== null && value !== "" && value !== false) {
        const exportedValue = prop.type === "number" ? Number(value) : value;
        if (prop_name === "paletteSlot" && exportedValue === 0) continue;
        vsElement[prop_name] = exportedValue;
      }
    }
    for (const prop of VS_CUBE_PROPS) {
      const prop_name = prop.name;
      if (VS_GROUP_PROPS.some((groupProp) => groupProp.name === prop_name)) continue;
      const value = node[prop_name];
      if (prop_name === "shade") {
        if (value !== void 0 && value !== true) {
          vsElement[prop_name] = value;
        }
        continue;
      }
      if (value !== void 0 && value !== null && value !== "" && value !== false) {
        const numValue = prop.type === "number" ? Number(value) : value;
        if (prop_name === "renderPass" && numValue === -1) continue;
        if (prop_name === "unwrapMode" && numValue === 0) continue;
        if (prop_name === "unwrapRotation" && numValue === 0) continue;
        if (prop_name === "paletteSlot" && numValue === 0) continue;
        vsElement[prop_name] = numValue;
      }
    }
    apply_extra_props(vsElement, node.vs_extra_props);
    const locators = node.children.filter((child) => child instanceof Locator && !(typeof NullObject !== "undefined" && child instanceof NullObject));
    if (locators.length > 0) {
      const attachmentPoints = process_locators(node, locators);
      if (attachmentPoints.length > 0) {
        vsElement.attachmentpoints = attachmentPoints;
      }
    }
    accu.push(vsElement);
    traverse2(node, node.children, vsElement.children, offset, node_vs_from);
  }
  function process_collapsed_group(parent, node, geoChild, accu, offset, parent_from_override) {
    if (node.backdrop) {
      return;
    }
    const parent_pos = get_parent_pos(parent, parent_from_override);
    const converted_rotation = node.rotation;
    let from = vector_sub(geoChild.from, parent_pos);
    let to = vector_sub(geoChild.to, parent_pos);
    if (geoChild.inflate && geoChild.inflate !== 0) {
      from = [from[0] - geoChild.inflate, from[1] - geoChild.inflate, from[2] - geoChild.inflate];
      to = [to[0] + geoChild.inflate, to[1] + geoChild.inflate, to[2] + geoChild.inflate];
    }
    let rotationOrigin = vector_sub(node.origin, parent_pos);
    if (parent === null) {
      from = vector_add(from, offset);
      to = vector_add(to, offset);
      rotationOrigin = vector_add(rotationOrigin, offset);
    }
    const reduced_faces = process_faces2(geoChild.faces);
    const vsElement = {
      name: node.name,
      from,
      to,
      ...keeps_rotation_origin(node, geoChild.from) && { rotationOrigin },
      ...geoChild.vs_uv ? { uv: geoChild.vs_uv } : (geoChild.uv_offset[0] !== 0 || geoChild.uv_offset[1] !== 0) && { uv: geoChild.uv_offset },
      ...converted_rotation[0] !== 0 && { rotationX: converted_rotation[0] },
      ...converted_rotation[1] !== 0 && { rotationY: converted_rotation[1] },
      ...converted_rotation[2] !== 0 && { rotationZ: converted_rotation[2] },
      faces: reduced_faces,
      children: []
    };
    for (const prop of VS_GROUP_PROPS) {
      const prop_name = prop.name;
      const value = node[prop_name];
      if (value !== void 0 && value !== null && value !== "" && value !== false) {
        const exportedValue = prop.type === "number" ? Number(value) : value;
        if (prop_name === "paletteSlot" && exportedValue === 0) continue;
        vsElement[prop_name] = exportedValue;
      }
    }
    const groupPaletteSlot = Number(node.paletteSlot) || 0;
    const geometryPaletteSlot = Number(geoChild.paletteSlot) || 0;
    if (groupPaletteSlot === 0 && geometryPaletteSlot !== 0) {
      vsElement.paletteSlot = geometryPaletteSlot;
    }
    if (!node.noOutline && geoChild.noOutline) {
      vsElement.noOutline = geoChild.noOutline;
    }
    for (const prop of VS_CUBE_PROPS) {
      const prop_name = prop.name;
      if (VS_GROUP_PROPS.some((groupProp) => groupProp.name === prop_name)) continue;
      const value = geoChild[prop_name];
      if (prop_name === "shade") {
        if (value !== true) {
          vsElement[prop_name] = value;
        }
        continue;
      }
      if (value !== void 0 && value !== null && value !== "" && value !== false) {
        const numValue = prop.type === "number" ? Number(value) : value;
        if (prop_name === "renderPass" && numValue === -1) {
          continue;
        }
        if (prop_name === "unwrapMode" && numValue === 0) {
          continue;
        }
        if (prop_name === "unwrapRotation" && numValue === 0) {
          continue;
        }
        if (prop_name === "paletteSlot" && numValue === 0) {
          continue;
        }
        vsElement[prop_name] = numValue;
      }
    }
    apply_extra_props(vsElement, geoChild.vs_extra_props);
    apply_extra_props(vsElement, node.vs_extra_props);
    const locators = node.children.filter((child) => child instanceof Locator && !(typeof NullObject !== "undefined" && child instanceof NullObject));
    if (locators.length > 0) {
      const attachmentPoints = process_locators(node, locators);
      if (attachmentPoints.length > 0) {
        vsElement.attachmentpoints = attachmentPoints;
      }
    }
    accu.push(vsElement);
    const otherChildren = node.children.filter(
      (child) => child !== geoChild
    );
    traverse2(node, otherChildren, vsElement.children, offset, geoChild.from);
  }

  // src/export_model/traverse.ts
  function traverse2(parent, nodes, accu, offset, parent_from_override) {
    const collapsedGeoCubes = /* @__PURE__ */ new Set();
    for (const node of nodes) {
      if (!node.export) continue;
      if (node instanceof Group) {
        const geoChild = find_geo_child(node);
        if (geoChild) {
          collapsedGeoCubes.add(geoChild);
        }
      }
    }
    for (const node of nodes) {
      if (!node.export) continue;
      if (node instanceof Group) {
        const geoChild = find_geo_child(node);
        if (geoChild) {
          process_collapsed_group(parent, node, geoChild, accu, offset, parent_from_override);
        } else {
          process_group2(parent, node, accu, offset, parent_from_override);
        }
      } else if (node instanceof Cube) {
        if (collapsedGeoCubes.has(node)) continue;
        process_cube2(parent, node, accu, offset, parent_from_override);
      }
    }
  }
  function find_geo_child(group) {
    const geoName = `${group.name}_geo`;
    return group.children.find(
      (child) => child instanceof Cube && child.name === geoName && child.export
    );
  }

  // src/export_model.ts
  function export_model() {
    const elements = [];
    const topLevelNodes = Outliner.root;
    const applyOffset = Settings.get("vs_apply_model_offset") ?? true;
    let offset = applyOffset ? [8, 0, 8] : [0, 0, 0];
    traverse2(null, topLevelNodes, elements, offset);
    return elements;
  }

  // src/export.ts
  init_property();
  init_preserved_props();

  // src/export_textures.ts
  init_native();
  var path4 = requireNativeModule("path");
  function warnTextureReadErrors(readErrors) {
    if (readErrors.size === 0) return;
    console.error("[VS Export] Unresolved texture search; unreadable folders:", readErrors);
    Blockbench.showQuickMessage("Some texture paths are unresolved and folders could not be searched. Check the exported texture references.", 5e3);
  }
  function resolveTextureLocation(projectPath, textureName, readErrors = /* @__PURE__ */ new Map()) {
    if (!projectPath || !textureName) {
      return "";
    }
    let texturesPath = null;
    const shapesIndex = projectPath.indexOf(path4.sep + "shapes" + path4.sep);
    if (shapesIndex !== -1) {
      const basePath = projectPath.substring(0, shapesIndex);
      texturesPath = path4.join(basePath, "textures");
    } else {
      const texturesIndex = projectPath.indexOf(path4.sep + "textures" + path4.sep);
      if (texturesIndex !== -1) {
        texturesPath = projectPath.substring(0, texturesIndex + path4.sep.length + "textures".length);
      } else {
        return "";
      }
    }
    if (!texturesPath) {
      return "";
    }
    const textureFile = findTextureFile(texturesPath, textureName, readErrors);
    if (!textureFile) return "";
    const relativePath = path4.relative(texturesPath, textureFile);
    const withoutExt = relativePath.replace(/\.[^.]+$/, "");
    return withoutExt.split(path4.sep).join("/");
  }
  function findTextureFile(dir, textureName, readErrors) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (error) {
      if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) {
        readErrors.set(dir, error);
      }
      return null;
    }
    for (const entry of entries) {
      const fullPath = path4.join(dir, entry.name);
      if (entry.isDirectory()) {
        const found = findTextureFile(fullPath, textureName, readErrors);
        if (found) return found;
      } else if (entry.isFile() && entry.name === textureName) {
        return fullPath;
      }
    }
    return null;
  }

  // src/export.ts
  init_native();
  var path5 = requireNativeModule("path");
  function saveTextureToFile(texture, textureDir, textureSubPath) {
    try {
      if (typeof texture.getDataURL !== "function") {
        console.warn(`Texture ${texture.name} does not have getDataURL method`);
        return "";
      }
      let filename = texture.name;
      if (!filename.match(/\.(png|jpg|jpeg)$/i)) {
        filename += ".png";
      }
      const fullTextureDir = path5.join(textureDir, textureSubPath);
      if (!fs.existsSync(fullTextureDir)) {
        fs.mkdirSync(fullTextureDir, { recursive: true });
      }
      const texturePath = path5.join(fullTextureDir, filename);
      const dataUrl = texture.getDataURL();
      if (!dataUrl) {
        console.warn(`Could not get data URL for texture: ${texture.name}`);
        return "";
      }
      const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      fs.writeFileSync(texturePath, buffer);
      const filenameWithoutExt = filename.replace(/\.[^.]+$/, "");
      const normalizedSubPath = textureSubPath.split(path5.sep).join("/");
      return normalizedSubPath ? `${normalizedSubPath}/${filenameWithoutExt}` : filenameWithoutExt;
    } catch (e) {
      console.error(`Failed to save texture ${texture.name}:`, e);
      return "";
    }
  }
  function ex(options) {
    if (!Project) {
      throw new Error("No project loaded during export");
    }
    const exportPath = options?.path || "";
    const exportDir = options?.exportDir || "";
    let textureBaseDir = exportDir;
    let textureSubPath = "";
    if (exportPath) {
      const shapesIndex = exportPath.indexOf(path5.sep + "shapes" + path5.sep);
      if (shapesIndex !== -1) {
        const basePath = exportPath.substring(0, shapesIndex);
        textureBaseDir = path5.join(basePath, "textures");
        const afterShapes = exportPath.substring(shapesIndex + path5.sep.length + "shapes".length + path5.sep.length);
        const lastSep = afterShapes.lastIndexOf(path5.sep);
        if (lastSep !== -1) {
          textureSubPath = afterShapes.substring(0, lastSep);
        }
        console.log(`VS folder structure detected:`);
        console.log(`  Export path: ${exportPath}`);
        console.log(`  Texture base dir: ${textureBaseDir}`);
        console.log(`  Texture subpath: ${textureSubPath}`);
      }
    }
    const textureSizes = {
      ...Project.vs_textureSizes || {}
    };
    for (const texture of Texture.all) {
      if (texture.uv_width && texture.uv_height) {
        textureSizes[texture.name] = [texture.uv_width, texture.uv_height];
      }
    }
    const textures = {};
    const unresolvedReadErrors = /* @__PURE__ */ new Map();
    for (const texture of Texture.all) {
      let location = texture.textureLocation || "";
      const readErrors = /* @__PURE__ */ new Map();
      if (!location || location === "") {
        location = resolveTextureLocation(Project.save_path, texture.name, readErrors);
        if ((!location || location === "") && texture.source) {
          location = resolveTextureLocation(texture.source, texture.name, readErrors);
        }
      }
      const exportTextures = Settings.get("vs_export_textures") || false;
      if ((!location || location === "") && exportDir && exportTextures) {
        location = saveTextureToFile(texture, textureBaseDir, textureSubPath);
      }
      textures[texture.name] = location || "";
      if (!location) readErrors.forEach((error, dir) => unresolvedReadErrors.set(dir, error));
    }
    const elements = export_model();
    const allAnimations = Blockbench.Animation.all;
    const inlineAnimations = compile_animation_library(allAnimations.filter((a) => !a.path)).animations;
    const libraryRefs = [];
    const seenRefs = /* @__PURE__ */ new Set();
    for (const animation of allAnimations) {
      if (!animation.path) continue;
      const ref = animation.vs_library_ref || path_to_reference(animation.path);
      if (ref && !seenRefs.has(ref)) {
        seenRefs.add(ref);
        libraryRefs.push(ref);
      }
    }
    const editor = {};
    for (const prop of VS_PROJECT_PROPS) {
      const prop_name = prop.name;
      editor[prop_name] = Project[prop_name];
    }
    apply_extra_props(editor, Project.vs_extra_editor_props);
    const data = {
      editor,
      textureWidth: Project.texture_width,
      textureHeight: Project.texture_height,
      textureSizes,
      textures,
      elements,
      animations: inlineAnimations
    };
    if (libraryRefs.length > 0) {
      data.animationLibraries = libraryRefs;
    }
    apply_extra_props(data, Project.vs_extra_props);
    warnTextureReadErrors(unresolvedReadErrors);
    return data;
  }

  // src/actions.ts
  init_native();
  var path6 = requireNativeModule("path");
  var export_action = createAction(`${name}:export_vs`, {
    name: "Export into VS Format",
    icon: icon_default,
    condition() {
      return is_vs_project(Project);
    },
    click: function() {
      if (!Project) {
        throw new Error("No project loaded during export");
      }
      Blockbench.export({
        name: Project.name,
        type: "json",
        extensions: ["json"],
        savetype: "text",
        custom_writer: (_content, exportPath) => {
          try {
            const exportDir = path6.dirname(exportPath);
            const data = ex({ path: exportPath, exportDir });
            const jsonContent = autoStringify(data);
            fs.writeFileSync(exportPath, jsonContent);
            Blockbench.showQuickMessage("Model and textures exported successfully");
          } catch (e) {
            console.error("[VS Export] Export failed:", e);
            Blockbench.showMessageBox({
              title: "VS Export Error",
              message: `Export failed: ${e instanceof Error ? e.message : String(e)}`
            });
          }
        }
      });
    }
  });
  MenuBar.addAction(export_action, "file.export");
  var import_action = createAction(`${name}:import_vs`, {
    name: "Import from VS Format",
    icon: icon_default,
    condition() {
      return is_vs_project(Project);
    },
    click: function() {
      Blockbench.import({
        type: "json",
        extensions: ["json"]
      }, function(files) {
        im(autoParseJSON(files[0].content), files[0].path, false);
      });
    }
  });
  MenuBar.addAction(import_action, "file.import");
  var import_backdrop_action = createAction(`${name}:import_backdrop_action`, {
    name: "Import Backdrop from VS Format",
    icon: icon_default,
    condition() {
      return is_vs_project(Project);
    },
    click: function() {
      Blockbench.import({
        type: "json",
        extensions: ["json"]
      }, function(files) {
        if (is_backdrop_project()) {
          Blockbench.showQuickMessage("There is already a backdrop in this project.");
        } else {
          im(autoParseJSON(files[0].content), files[0].path, true);
        }
      });
    }
  });
  MenuBar.addAction(import_backdrop_action, "file.import");

  // src/animation_actions.ts
  init_util();
  var clear_animations_action = createAction(`${name}:clear_animations_vs`, {
    name: "Clear All Animations",
    icon: "delete_sweep",
    condition() {
      return is_vs_project(Project);
    },
    click: function() {
      const total = Blockbench.Animation.all.length;
      if (total === 0) {
        Blockbench.showQuickMessage("No animations to clear");
        return;
      }
      if (!confirm(`Delete all ${total} animation${total === 1 ? "" : "s"} from this project?

This can be undone with Ctrl+Z.`)) {
        return;
      }
      const removed = clear_animations();
      Blockbench.showQuickMessage(`Cleared ${removed} animation${removed === 1 ? "" : "s"}`);
    }
  });
  MenuBar.addAction(clear_animations_action, "edit");
  var reload_vfx_action = createAction(`${name}:reload_vfx_previews`, {
    name: "Reload VFX Previews",
    icon: "auto_awesome",
    condition() {
      return is_vs_project(Project);
    },
    click: function() {
      const linked = relink_particle_previews();
      Blockbench.showQuickMessage(
        linked === 0 ? "No particle effects could be resolved" : `Linked ${linked} particle keyframe${linked === 1 ? "" : "s"}`
      );
    }
  });
  MenuBar.addAction(reload_vfx_action, "animation");

  // src/vintagestory.ts
  init_property();

  // src/mods/boneAnimatorMod.ts
  init_util();
  createBlockbenchMod(
    `${name}:bone_animator_mod`,
    {
      original: Blockbench.BoneAnimator.prototype.displayFrame,
      original_interpolate: Blockbench.BoneAnimator.prototype.interpolate
    },
    (context) => {
      Blockbench.BoneAnimator.prototype.interpolate = function(channel, allow_expression, axis) {
        const animation = this.animation;
        const keys = this[channel];
        const length = animation.length;
        if (!is_vs_project(Project) || !length || keys.length < 2) {
          return context.original_interpolate.call(this, channel, allow_expression, axis);
        }
        const lastFrameTime = Math.max(0, Math.round(length * fps) - 1) / fps;
        const time = animation.loop === "loop" ? animation.time : Math.min(animation.time, lastFrameTime);
        const times = keys.map((key) => key.time);
        const outsideKeys = time < Math.min(...times) || time > Math.max(...times);
        if (!outsideKeys && time === animation.time) {
          return context.original_interpolate.call(this, channel, allow_expression, axis);
        }
        const preview = Object.create(this, {
          animation: { value: Object.create(animation, { time: { value: time } }) }
        });
        if (outsideKeys) {
          const shifted = (offset) => keys.map(
            (key) => Object.create(key, { time: { value: key.time + offset } })
          );
          Object.defineProperty(preview, channel, {
            value: [...shifted(-length), ...keys, ...shifted(length)]
          });
        }
        return context.original_interpolate.call(preview, channel, allow_expression, axis);
      };
      Blockbench.BoneAnimator.prototype.displayFrame = function(multiplier = 1) {
        if (!is_vs_project(Project)) return context.original.call(this, multiplier);
        if (!this.doRender()) return;
        this.getGroup();
        Animator.MolangParser.context.animation = this.animation;
        const mesh = this.group.mesh;
        const offset = mesh.position.clone().sub(mesh.fix_position).applyQuaternion(mesh.quaternion.clone().invert()).divide(mesh.scale);
        if (!this.muted.rotation) this.displayRotation(this.interpolate("rotation"), multiplier);
        const scale = !this.muted.scale && this.interpolate("scale");
        if (scale) {
          if (this.animation.override) mesh.scale.set(1, 1, 1);
          mesh.scale.x = mesh.scale.x + (scale[0] - 1) * multiplier || 1e-5;
          mesh.scale.y = mesh.scale.y + (scale[1] - 1) * multiplier || 1e-5;
          mesh.scale.z = mesh.scale.z + (scale[2] - 1) * multiplier || 1e-5;
        }
        const position = this.interpolate("position");
        if (!this.muted.position && position) {
          if (this.animation.override) offset.set(0, 0, 0);
          offset.addScaledVector(new THREE.Vector3().fromArray(position), multiplier);
        }
        mesh.position.copy(mesh.fix_position).add(offset.multiply(mesh.scale).applyQuaternion(mesh.quaternion));
      };
      return context;
    },
    (context) => {
      Blockbench.BoneAnimator.prototype.displayFrame = context.original;
      Blockbench.BoneAnimator.prototype.interpolate = context.original_interpolate;
    }
  );

  // src/generated/vs_shape_schema.js
  var schema = {
    "description": "Interfaces that define the structure of Vintage Story shape files.\nRemember to run 'npm run gen_schema' after modifying this file to generate the updated JSON schema for validation.",
    "type": "object",
    "properties": {
      "editor": {
        "$ref": "#/definitions/VS_EditorSettings"
      },
      "textureWidth": {
        "type": "number"
      },
      "textureHeight": {
        "type": "number"
      },
      "textureSizes": {
        "$ref": "#/definitions/Record<string,[number,number]>"
      },
      "textures": {
        "$ref": "#/definitions/Record<string,string>"
      },
      "elements": {
        "type": "array",
        "items": {
          "$ref": "#/definitions/VS_Element"
        }
      },
      "animations": {
        "type": "array",
        "items": {
          "$ref": "#/definitions/VS_Animation"
        }
      },
      "animationLibraries": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    },
    "required": [
      "elements",
      "textures"
    ],
    "definitions": {
      "VS_EditorSettings": {
        "type": "object",
        "properties": {
          "backDropShape": {
            "type": "string"
          },
          "collapsedPaths": {
            "type": "string"
          },
          "allAngles": {
            "type": "boolean"
          },
          "entityTextureMode": {
            "type": "boolean"
          },
          "singleTexture": {
            "type": "boolean"
          }
        }
      },
      "Record<string,[number,number]>": {
        "type": "object"
      },
      "Record<string,string>": {
        "type": "object"
      },
      "VS_Element": {
        "description": "Json Attributes also include\nScaleX, ScaleY, ScaleZ\nbut they are not used by any VS shape files currently.",
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "from": {
            "type": "array",
            "items": [
              {
                "type": "number"
              },
              {
                "type": "number"
              },
              {
                "type": "number"
              }
            ],
            "minItems": 3,
            "maxItems": 3
          },
          "to": {
            "type": "array",
            "items": [
              {
                "type": "number"
              },
              {
                "type": "number"
              },
              {
                "type": "number"
              }
            ],
            "minItems": 3,
            "maxItems": 3
          },
          "unwrapMode": {
            "type": "number"
          },
          "unwrapRotation": {
            "type": "number"
          },
          "autoUnwrap": {
            "type": "boolean"
          },
          "disableRandomDrawOffset": {
            "type": "boolean"
          },
          "climateColorMap": {
            "type": "string"
          },
          "gradientShade": {
            "type": "boolean"
          },
          "renderPass": {
            "type": "number"
          },
          "paletteSlot": {
            "type": "number"
          },
          "noOutline": {
            "type": "boolean"
          },
          "seasonColorMap": {
            "type": "string"
          },
          "shade": {
            "type": "boolean"
          },
          "uv": {
            "type": "array",
            "items": [
              {
                "type": "number"
              },
              {
                "type": "number"
              }
            ],
            "minItems": 2,
            "maxItems": 2
          },
          "rotationOrigin": {
            "type": "array",
            "items": [
              {
                "type": "number"
              },
              {
                "type": "number"
              },
              {
                "type": "number"
              }
            ],
            "minItems": 3,
            "maxItems": 3
          },
          "rotationX": {
            "type": "number"
          },
          "rotationY": {
            "type": "number"
          },
          "rotationZ": {
            "type": "number"
          },
          "faces": {
            "$ref": "#/definitions/Partial<Record<VS_Direction,VS_Face>>"
          },
          "stepParentName": {
            "type": "string"
          },
          "attachmentpoints": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/VS_AttachmentPoint"
            }
          },
          "children": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/VS_Element"
            }
          }
        },
        "required": [
          "from",
          "name",
          "to"
        ]
      },
      "Partial<Record<VS_Direction,VS_Face>>": {
        "type": "object",
        "properties": {
          "north": {
            "$ref": "#/definitions/VS_Face"
          },
          "east": {
            "$ref": "#/definitions/VS_Face"
          },
          "south": {
            "$ref": "#/definitions/VS_Face"
          },
          "west": {
            "$ref": "#/definitions/VS_Face"
          },
          "up": {
            "$ref": "#/definitions/VS_Face"
          },
          "down": {
            "$ref": "#/definitions/VS_Face"
          }
        }
      },
      "VS_Face": {
        "type": "object",
        "properties": {
          "texture": {
            "type": "string"
          },
          "enabled": {
            "type": "boolean"
          },
          "glow": {
            "type": "number"
          },
          "reflectiveMode": {
            "enum": [
              0,
              1,
              2,
              3,
              4,
              5
            ],
            "type": "number"
          },
          "uv": {
            "type": "array",
            "items": [
              {
                "type": "number"
              },
              {
                "type": "number"
              },
              {
                "type": "number"
              },
              {
                "type": "number"
              }
            ],
            "minItems": 4,
            "maxItems": 4
          },
          "rotation": {
            "type": "number"
          },
          "autoUv": {
            "type": "boolean"
          },
          "snapUv": {
            "type": "boolean"
          },
          "windMode": {
            "type": "array",
            "items": [
              {
                "type": "number"
              },
              {
                "type": "number"
              },
              {
                "type": "number"
              },
              {
                "type": "number"
              }
            ],
            "minItems": 4,
            "maxItems": 4
          },
          "windData": {
            "type": "array",
            "items": [
              {
                "type": "number"
              },
              {
                "type": "number"
              },
              {
                "type": "number"
              },
              {
                "type": "number"
              }
            ],
            "minItems": 4,
            "maxItems": 4
          }
        },
        "required": [
          "texture"
        ]
      },
      "VS_AttachmentPoint": {
        "description": "In VS shape files, attachment point numeric values are stored as strings.\nOther numeric values in VS_Element (like from, to, rotation) are stored as actual numbers.",
        "type": "object",
        "properties": {
          "code": {
            "type": "string"
          },
          "posX": {
            "type": "string"
          },
          "posY": {
            "type": "string"
          },
          "posZ": {
            "type": "string"
          },
          "rotationX": {
            "type": "string"
          },
          "rotationY": {
            "type": "string"
          },
          "rotationZ": {
            "type": "string"
          }
        },
        "required": [
          "code",
          "posX",
          "posY",
          "posZ",
          "rotationX",
          "rotationY",
          "rotationZ"
        ]
      },
      "VS_Animation": {
        "description": "Json Attributes also include\nVersion\nbut they are not used by any VS shape files currently.",
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "code": {
            "type": "string"
          },
          "quantityframes": {
            "type": "number"
          },
          "onActivityStopped": {
            "enum": [
              "EaseOut",
              "PlayTillEnd",
              "Rewind",
              "Stop"
            ],
            "type": "string"
          },
          "onAnimationEnd": {
            "enum": [
              "EaseOut",
              "Hold",
              "Repeat",
              "Stop"
            ],
            "type": "string"
          },
          "easeAnimationSpeed": {
            "type": "boolean"
          },
          "keyframes": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/VS_Keyframe"
            }
          }
        },
        "required": [
          "code",
          "keyframes",
          "name",
          "quantityframes"
        ]
      },
      "VS_Keyframe": {
        "type": "object",
        "properties": {
          "frame": {
            "type": "number"
          },
          "elements": {
            "$ref": "#/definitions/Record<string,VS_AnimationKey>"
          },
          "textures": {
            "$ref": "#/definitions/Record<string,string>"
          },
          "particles": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/VS_AnimationParticle"
            }
          },
          "sounds": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/VS_AnimationSound"
            }
          }
        },
        "required": [
          "elements",
          "frame"
        ]
      },
      "Record<string,VS_AnimationKey>": {
        "type": "object"
      },
      "VS_AnimationParticle": {
        "description": "A one-shot particle effect trigger on a keyframe. Read by GlintMod's snowstorm\nparticle system (SnowstormAnimationParticles); the base game ignores it.",
        "type": "object",
        "properties": {
          "effect": {
            "description": 'Snowstorm particle effect identifier, e.g. "bruister_feathers"',
            "type": "string"
          },
          "atAttachmentPoint": {
            "description": "Attachment point (Blockbench locator) the effect spawns at; entity center when omitted",
            "type": "string"
          }
        },
        "required": [
          "effect"
        ]
      },
      "VS_AnimationSound": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string"
          },
          "range": {
            "type": "number"
          },
          "volume": {
            "type": "number"
          },
          "pitch": {
            "type": "number"
          },
          "chance": {
            "type": "number"
          },
          "looping": {
            "type": "boolean"
          }
        },
        "required": [
          "location"
        ]
      }
    },
    "$schema": "http://json-schema.org/draft-07/schema#"
  };

  // src/codec.ts
  var import_ajv = __toESM(require_ajv(), 1);
  var import_json54 = __toESM(require_lib(), 1);
  var codecVS = new Codec("codecVS", {
    name: "Vintage Story Codec",
    extension: "json",
    remember: true,
    load_filter: {
      extensions: ["json"],
      type: "text",
      condition(model) {
        const content = import_json54.default.parse(model);
        if (!content || typeof content !== "object") return false;
        if (!content.elements || !Array.isArray(content.elements)) return false;
        if (!content.textures || typeof content.textures !== "object") return false;
        return validate_json(content);
      }
    },
    compile(options) {
      try {
        return autoStringify(ex(options));
      } catch (e) {
        console.error("[VS Codec] Compile failed:", e);
        Blockbench.showMessageBox({
          title: "VS Export Error",
          message: `Failed to compile model: ${e instanceof Error ? e.message : String(e)}`
        });
        return void 0;
      }
    },
    parse(data, file_path, _add) {
      im(import_json54.default.parse(data), file_path, false);
    }
  });
  function validate_json(content) {
    const ajv = new import_ajv.default();
    const validate = ajv.compile(schema);
    const valid = validate(content);
    if (!valid) console.log(validate.errors);
    return valid;
  }

  // src/format_definition.ts
  function create_format() {
    const format = new ModelFormat("formatVS", {
      name: "Vintage Story Base Format",
      description: "Vintage Story Format",
      target: "Vintage Story",
      format_page: {
        content: [
          { type: "text", text: "Import, edit, and export models in the Vintage Story shape format, including animations and attachment points." },
          { type: "h3", text: "Getting started" },
          {
            type: "text",
            text: [
              "* Open a Vintage Story shape JSON file with **File > Open Model**.",
              "* Create a model with **File > New > Vintage Story Base Format**.",
              "* Use the Vintage Story actions in the **Import** and **Export** menus to exchange shape files.",
              "* The plugin also provides attachment tools and a **VS Face Properties** panel for glow, reflective mode, and wind properties."
            ].join("\n")
          },
          { type: "text", text: "[Source repository](https://github.com/anegostudios/blockbenchplugin) \xB7 [Report an issue](https://github.com/anegostudios/blockbenchplugin/issues)" }
        ]
      },
      codec: codecVS,
      icon: icon_default,
      box_uv: false,
      optional_box_uv: false,
      single_texture: false,
      single_texture_default: false,
      per_group_texture: false,
      per_texture_uv_size: true,
      model_identifier: false,
      legacy_editable_file_name: false,
      parent_model_id: false,
      //Use this for backdrops? false for now
      vertex_color_ambient_occlusion: false,
      animated_textures: false,
      // NOt sure if supported by VS
      bone_rig: true,
      centered_grid: true,
      rotate_cubes: true,
      stretch_cubes: false,
      integer_size: false,
      meshes: false,
      texture_meshes: false,
      locators: true,
      null_object: true,
      rotation_limit: false,
      rotation_snap: false,
      uv_rotation: true,
      java_face_properties: false,
      select_texture_for_particles: false,
      texture_mcmeta: false,
      bone_binding_expression: false,
      // Revisit for animation
      // Enables Blockbench's multi-file animation workflow: per-animation `path`/`saved_name`,
      // grouping by file in the ANIMATIONS panel, and per-file Save / Save All / Import.
      animation_files: true,
      texture_folder: true,
      image_editor: false,
      // Setting this to true removes the object outliner?!?!
      edit_mode: true,
      paint_mode: true,
      display_mode: false,
      // Only some Minecraft Skin stuff it seems
      animation_mode: true,
      pose_mode: false,
      animation_controllers: false,
      // VS has no animation-controller concept
      box_uv_float_size: false,
      java_cube_shading_properties: false,
      cullfaces: false,
      // Not sure if Vintage Story supports this
      render_sides: "double",
      euler_order: "XYZ",
      animation_loop_wrapping: true,
      quaternion_interpolation: false,
      per_animator_rotation_interpolation: false
    });
    codecVS.format = format;
    if (vsAnimationCodec) format.animation_codec = vsAnimationCodec;
    return format;
  }

  // src/mods/formatMod.ts
  var formatVS;
  createBlockbenchMod(
    `${name}:vs_format_mod`,
    {},
    (_context) => {
      formatVS = create_format();
      return;
    },
    (_context) => {
      formatVS?.delete();
    }
  );

  // src/mods/settingsMod.ts
  init_native();
  createBlockbenchMod(
    `${name}:vs_gamepath_settings_mod`,
    {},
    (_context) => {
      const setting = new Setting("game_path", {
        name: "Game Path",
        description: "The path to your Vintage Story game folder. This is the folder that contains the assets, mods and lib folders.",
        category: "general",
        type: "click",
        icon: "fa-folder-plus",
        value: "",
        click() {
          new Dialog("gamePathSelect", {
            title: "Select Game Path",
            form: {
              path: {
                label: "Path to your game folder",
                type: "folder",
                value: get_game_path()
              }
            },
            onConfirm(formResult) {
              setting.set(formResult.path);
              console.log("setting and saving");
              Settings.save();
            }
          }).show();
        }
      });
      return setting;
    },
    () => {
    }
  );
  createBlockbenchMod(
    `${name}:attachment_preset_settings_mod`,
    {},
    (_context) => {
      const presetSetting = new Setting("attachment_preset", {
        name: "Attachment Preset",
        description: "Choose the clothing/attachment slot system to use. Glint for Glint character customization, Vintage Story for Seraph models, or Custom for your own slots.",
        category: "general",
        type: "select",
        value: "glint",
        options: {
          glint: "Glint (Outerwear, Top, Bottoms, Boots, etc.)",
          vintage_story: "Vintage Story (Arm, Head, UpperBody, etc.)",
          custom: "Custom (configure your own slots)"
        },
        onChange() {
          try {
            if (Interface.Panels.attachments_panel && Interface.Panels.attachments_panel.vue) {
              Interface.Panels.attachments_panel.vue.updateAttachments();
            }
          } catch (e) {
            console.warn("Could not refresh attachments panel:", e);
          }
        }
      });
      return presetSetting;
    },
    () => {
    }
  );
  createBlockbenchMod(
    `${name}:attachment_custom_slots_settings_mod`,
    {},
    (_context) => {
      const customSlotsSetting = new Setting("attachment_custom_slots", {
        name: "Custom Attachment Slots",
        description: "Define custom slot names (one per line) when using Custom preset. Example: Head, Torso, Legs, etc.",
        category: "general",
        type: "click",
        icon: "fa-list",
        value: "",
        condition: () => Settings.get("attachment_preset") === "custom",
        click() {
          new Dialog("customSlotsEdit", {
            title: "Edit Custom Attachment Slots",
            form: {
              slots: {
                label: "Slot Names (one per line)",
                type: "textarea",
                value: (Settings.get("attachment_custom_slots") || []).join("\n")
              }
            },
            onConfirm(formResult) {
              const slots = formResult.slots.split("\n").map((s) => s.trim()).filter((s) => s.length > 0);
              customSlotsSetting.set(slots);
              Settings.save();
              try {
                if (Interface.Panels.attachments_panel && Interface.Panels.attachments_panel.vue) {
                  Interface.Panels.attachments_panel.vue.updateAttachments();
                }
              } catch (e) {
                console.warn("Could not refresh attachments panel:", e);
              }
            }
          }).show();
        }
      });
      return customSlotsSetting;
    },
    () => {
    }
  );
  createBlockbenchMod(
    `${name}:vs_model_offset_settings_mod`,
    {},
    (_context) => {
      const setting = new Setting("vs_apply_model_offset", {
        name: "Apply Model Offset",
        description: "Apply [8, 0, 8] offset to exported models for Vintage Story engine centering. Disable if your models are already positioned correctly.",
        category: "general",
        type: "toggle",
        value: true
      });
      return setting;
    },
    () => {
    }
  );
  createBlockbenchMod(
    `${name}:vs_export_textures_settings_mod`,
    {},
    (_context) => {
      const setting = new Setting("vs_export_textures", {
        name: "Export Texture Files",
        description: "Automatically save texture files to disk when exporting models. Disable to only include texture references in the JSON without saving the actual texture files.",
        category: "general",
        type: "toggle",
        value: false
      });
      return setting;
    },
    () => {
    }
  );

  // src/mods/legacyFormatConverterMod.ts
  init_util();
  createBlockbenchMod(
    `${name}:vs_legacy_format_converter_mod`,
    {},
    (_context) => {
      return events.LOAD_PROJECT.subscribe(onProjectLoad);
    },
    (context) => {
      context?.call(context);
    }
  );
  createBlockbenchMod(
    `${name}:vs_format_converter_mod`,
    {},
    (_context) => {
      return events.CONVERT_FORMAT.subscribe(convert_format);
    },
    (context) => {
      context?.call(context);
    }
  );
  var updateMeshRotationOrders = () => {
    if (!Project || !Project.format || Project.format.id !== "formatVS") return;
    Canvas.updateAllBones();
    Canvas.updateAllPositions();
    Canvas.updateAll();
    console.log("legacy converting!");
    Canvas.updateView({
      elements: Cube.all,
      element_aspects: {
        geometry: true,
        transform: true
      }
    });
    for (const group of Group.all) {
      if (group.mesh && group.mesh.rotation) {
        group.mesh.rotation.order = "XYZ";
        console.log("legacy converting group!");
      }
    }
    for (const cube of Cube.all) {
      if (cube.mesh && cube.mesh.rotation) {
        cube.mesh.rotation.order = "XYZ";
        console.log("legacy converting cube!");
      }
    }
    Canvas.updateAllBones();
    Canvas.updateAllPositions();
    Canvas.updateAll();
  };
  var convert_format = (event) => {
    if (event.format.id !== "formatVS") return;
    if (!Project) return;
    const old_euler_order = event.old_format?.euler_order || "ZYX";
    if (old_euler_order !== "XYZ") {
      for (const group of Group.all) {
        if (group.rotation && (group.rotation[0] !== 0 || group.rotation[1] !== 0 || group.rotation[2] !== 0)) {
          const old_rotation = [group.rotation[0], group.rotation[1], group.rotation[2]];
          const new_rotation = zyx_to_xyz(old_rotation);
          group.rotation = new_rotation;
        }
      }
      for (const cube of Cube.all) {
        if (cube.rotation && (cube.rotation[0] !== 0 || cube.rotation[1] !== 0 || cube.rotation[2] !== 0)) {
          const old_rotation = [cube.rotation[0], cube.rotation[1], cube.rotation[2]];
          const new_rotation = zyx_to_xyz(old_rotation);
          cube.rotation = new_rotation;
        }
      }
    }
    Project.vsFormatConverted = true;
    updateMeshRotationOrders();
  };
  var onProjectLoad = () => {
    setTimeout(() => {
      if (Project && Project.format && Project.format.id === "formatVS") {
        updateMeshRotationOrders();
      }
    }, 100);
  };

  // src/mods/nodePreviewControllerMod.ts
  init_util();

  // src/attachments/attachment_transform.ts
  var DEG_TO_RAD = Math.PI / 180;
  var RAD_TO_DEG = 180 / Math.PI;
  var CLEAN_EPSILON = 1e-7;
  function cleanNumber(value) {
    if (Math.abs(value) < CLEAN_EPSILON) return 0;
    const rounded = Math.round(value * 1e6) / 1e6;
    return Object.is(rounded, -0) ? 0 : rounded;
  }
  function eulerXYZToQuaternion(rotation) {
    const x = rotation[0] * DEG_TO_RAD / 2;
    const y = rotation[1] * DEG_TO_RAD / 2;
    const z = rotation[2] * DEG_TO_RAD / 2;
    const c1 = Math.cos(x), c2 = Math.cos(y), c3 = Math.cos(z);
    const s1 = Math.sin(x), s2 = Math.sin(y), s3 = Math.sin(z);
    return [
      s1 * c2 * c3 + c1 * s2 * s3,
      c1 * s2 * c3 - s1 * c2 * s3,
      c1 * c2 * s3 + s1 * s2 * c3,
      c1 * c2 * c3 - s1 * s2 * s3
    ];
  }
  function multiplyQuaternion(a, b) {
    const [ax, ay, az, aw] = a;
    const [bx, by, bz, bw] = b;
    return [
      ax * bw + aw * bx + ay * bz - az * by,
      ay * bw + aw * by + az * bx - ax * bz,
      az * bw + aw * bz + ax * by - ay * bx,
      aw * bw - ax * bx - ay * by - az * bz
    ];
  }
  function invertUnitQuaternion(q) {
    return [-q[0], -q[1], -q[2], q[3]];
  }
  function quaternionToEulerXYZ(q) {
    const [x, y, z, w] = q;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;
    const m11 = 1 - (yy + zz);
    const m12 = xy - wz;
    const m13 = xz + wy;
    const m22 = 1 - (xx + zz);
    const m23 = yz - wx;
    const m32 = yz + wx;
    const m33 = 1 - (xx + yy);
    const clampedM13 = Math.max(-1, Math.min(1, m13));
    let resultX;
    let resultZ;
    const resultY = Math.asin(clampedM13);
    if (Math.abs(clampedM13) < 0.9999999) {
      resultX = Math.atan2(-m23, m33);
      resultZ = Math.atan2(-m12, m11);
    } else {
      resultX = Math.atan2(m32, m22);
      resultZ = 0;
    }
    return [
      cleanNumber(resultX * RAD_TO_DEG),
      cleanNumber(resultY * RAD_TO_DEG),
      cleanNumber(resultZ * RAD_TO_DEG)
    ];
  }
  function composeEulerXYZ(rotations) {
    let result = [0, 0, 0, 1];
    for (const rotation of rotations) {
      result = multiplyQuaternion(result, eulerXYZToQuaternion(rotation));
    }
    return quaternionToEulerXYZ(result);
  }
  function relativeEulerXYZ(rotation, parentRotation) {
    const inverseParentRotation = invertUnitQuaternion(eulerXYZToQuaternion(parentRotation));
    return quaternionToEulerXYZ(multiplyQuaternion(
      inverseParentRotation,
      eulerXYZToQuaternion(rotation)
    ));
  }
  function subtractVector(a, b) {
    return [
      cleanNumber(a[0] - b[0]),
      cleanNumber(a[1] - b[1]),
      cleanNumber(a[2] - b[2])
    ];
  }
  function rebaseAttachmentRoot(root, socket) {
    return {
      from: subtractVector(root.from, socket.from),
      to: subtractVector(root.to, socket.from),
      rotationOrigin: subtractVector(root.rotationOrigin, socket.from),
      rotation: relativeEulerXYZ(root.rotation, socket.rotation)
    };
  }

  // src/mods/nodePreviewControllerMod.ts
  createBlockbenchMod(
    `${name}:node_preview_controller_mod`,
    {
      original: Blockbench.NodePreviewController.prototype.updateTransform
    },
    (inject_context) => {
      Blockbench.NodePreviewController.prototype.updateTransform = function(node) {
        if (is_vs_project(Project)) {
          if ((node instanceof Group || node instanceof Cube) && node.stepParentName && node.stepParentName !== "") {
            const stepParent = resolveStepParentTarget(node);
            const usesPhysicalParent = node.vs_step_parent_local !== true && stepParent instanceof Group && node.parent === stepParent;
            if (usesPhysicalParent || node.vs_step_parent_local !== true && !stepParent) {
              return inject_context.original.call(this, node);
            }
            return updateStepChildTransform(this, node, stepParent);
          }
          return inject_context.original.call(this, node);
        }
        return inject_context.original.call(this, node);
      };
      return inject_context;
    },
    (extract_context) => {
      Blockbench.NodePreviewController.prototype.updateTransform = extract_context.original;
    }
  );
  function updateStepChildTransform(controller, element, stepParent) {
    const mesh = element.mesh;
    if (element.getTypeBehavior("movable")) {
      let position = [...element.origin];
      if (stepParent) {
        if (element.vs_step_parent_local === true) {
          const parentFrom = getStepParentFrom(stepParent);
          position = [
            element.origin[0] + parentFrom[0] - stepParent.origin[0],
            element.origin[1] + parentFrom[1] - stepParent.origin[1],
            element.origin[2] + parentFrom[2] - stepParent.origin[2]
          ];
        } else {
          position = [
            element.origin[0] - stepParent.origin[0],
            element.origin[1] - stepParent.origin[1],
            element.origin[2] - stepParent.origin[2]
          ];
        }
      }
      mesh.position.set(position[0], position[1], position[2]);
    }
    if (element.getTypeBehavior("rotatable")) {
      const rotation = element.vs_step_parent_local === true || !stepParent ? [element.rotation?.[0] || 0, element.rotation?.[1] || 0, element.rotation?.[2] || 0] : relativeEulerXYZ(getElementBindRotation(element), getElementBindRotation(stepParent));
      mesh.rotation.x = Math.degToRad(rotation[0]);
      mesh.rotation.y = Math.degToRad(rotation[1]);
      mesh.rotation.z = Math.degToRad(rotation[2]);
    }
    if (element.getTypeBehavior("scalable")) {
      mesh.scale.x = element.scale[0] || 1e-7;
      mesh.scale.y = element.scale[1] || 1e-7;
      mesh.scale.z = element.scale[2] || 1e-7;
    }
    if ((element instanceof Cube || element instanceof Group) && element.stepParentName && element.stepParentName != "") {
      if (stepParent && stepParent !== element && stepParent.mesh !== element.mesh) {
        stepParent.mesh.add(element.mesh);
      } else {
        Project.model_3d.add(mesh);
      }
    }
    mesh.updateMatrixWorld();
    controller.dispatchEvent("update_transform", { element });
  }
  function isInElementSubtree(candidate, element) {
    let current = candidate;
    while (current instanceof Group || current instanceof Cube) {
      if (current === element) return true;
      current = current.parent;
    }
    return false;
  }
  function resolveStepParentTarget(element) {
    const name2 = element.stepParentName?.trim();
    if (!name2) return null;
    const attachmentSlot = element.clothingSlot?.trim();
    const groups = Group.all.filter(
      (candidate) => candidate.name === name2 && candidate !== element && !isInElementSubtree(candidate, element)
    );
    const preferredGroup = groups.find(
      (candidate) => !candidate.stepParentName?.trim() && (!candidate.clothingSlot?.trim() || candidate.clothingSlot?.trim() !== attachmentSlot)
    ) || groups.find(
      (candidate) => !candidate.clothingSlot?.trim() || candidate.clothingSlot?.trim() !== attachmentSlot
    ) || groups[0];
    if (preferredGroup) return preferredGroup;
    const cubes = Cube.all.filter(
      (candidate) => candidate.name === `${name2}_geo` && candidate !== element && !isInElementSubtree(candidate, element)
    );
    return cubes.find(
      (candidate) => !candidate.clothingSlot?.trim() || candidate.clothingSlot?.trim() !== attachmentSlot
    ) || cubes[0] || null;
  }
  function getStepParentFrom(stepParent) {
    if (stepParent instanceof Cube) return [...stepParent.from];
    if (Array.isArray(stepParent.vs_group_from) && stepParent.vs_group_from.length === 3) {
      return [...stepParent.vs_group_from];
    }
    const geoChild = stepParent.children.find(
      (child) => child instanceof Cube && child.name === `${stepParent.name}_geo`
    );
    return [...geoChild?.from || stepParent.origin];
  }
  function getElementBindRotation(element) {
    const chain = [];
    let current = element;
    while (current instanceof Group || current instanceof Cube) {
      chain.unshift([...current.rotation || [0, 0, 0]]);
      current = current.parent;
    }
    return composeEulerXYZ(chain);
  }

  // src/mods/effectAnimatorMod.ts
  init_util();
  var rewound = /* @__PURE__ */ new WeakSet();
  function is_end_of_single_shot(animator) {
    const animation = animator.animation;
    if (!animation || animation.loop !== "once" || animation.time > 0) {
      rewound.delete(animator);
      return false;
    }
    if (animator.last_displayed_time > 0) rewound.add(animator);
    return rewound.has(animator);
  }
  createBlockbenchMod(
    `${name}:effect_animator_mod`,
    {
      original: Blockbench.EffectAnimator.prototype.displayFrame
    },
    (inject_context) => {
      Blockbench.EffectAnimator.prototype.displayFrame = function(in_loop) {
        if (!is_vs_project(Project)) {
          return inject_context.original.call(this, in_loop);
        }
        ensure_particle_links(this);
        ensure_sound_links(this);
        if (!is_end_of_single_shot(this)) {
          return inject_context.original.call(this, in_loop);
        }
        const muted = this.muted;
        const previous = { sound: muted.sound, particle: muted.particle };
        muted.sound = true;
        muted.particle = true;
        try {
          return inject_context.original.call(this, in_loop);
        } finally {
          muted.sound = previous.sound;
          muted.particle = previous.particle;
        }
      };
      return inject_context;
    },
    (extract_context) => {
      Blockbench.EffectAnimator.prototype.displayFrame = extract_context.original;
    }
  );

  // src/attachments/discovery.ts
  function isStructuralParentOnly(node) {
    if (!(node instanceof Group)) return false;
    if (!node.children || node.children.length === 0) return false;
    if (node.clothingSlot && node.clothingSlot.trim() !== "") {
      return false;
    }
    const allChildrenAreAttachments = node.children.every((child) => {
      if (child instanceof Cube) {
        return child.clothingSlot && child.clothingSlot.trim() !== "";
      }
      if (child instanceof Group) {
        return child.clothingSlot && child.clothingSlot.trim() !== "" || isStructuralParentOnly(child);
      }
      return false;
    });
    return allChildrenAreAttachments;
  }
  function findAttachments() {
    const results = [];
    const slotMap = {};
    function getOrCreateBucket(slot) {
      if (!slotMap[slot]) {
        const newSection = { slot, elements: [] };
        slotMap[slot] = newSection;
        results.push(newSection);
      }
      return slotMap[slot];
    }
    function walk(node) {
      if ((node instanceof Group || node instanceof Cube) && node.clothingSlot && node.clothingSlot.trim() !== "") {
        const slot = node.clothingSlot.trim();
        let ancestor = node.parent;
        let inheritsFromAncestor = false;
        while (ancestor && ancestor instanceof Group) {
          const ancestorSlot = ancestor.clothingSlot?.trim();
          if (ancestorSlot === slot) {
            inheritsFromAncestor = true;
            break;
          }
          ancestor = ancestor.parent;
        }
        if (!inheritsFromAncestor && !isStructuralParentOnly(node)) {
          const bucket = getOrCreateBucket(slot);
          bucket.elements.push(node);
        }
      }
      if (Array.isArray(node.children)) {
        node.children.forEach(walk);
      }
    }
    (Outliner.root || []).forEach(walk);
    results.sort((a, b) => a.slot.localeCompare(b.slot));
    return results;
  }
  function isAttachment(node) {
    if (!node) return false;
    return !!(node instanceof Group || node instanceof Cube) && !!node.clothingSlot && node.clothingSlot.trim() !== "";
  }

  // src/attachments/export_attachment_vs.ts
  init_presets();
  init_property();
  init_util();

  // src/attachments/constants.ts
  var IMPORT_SETTLE_DELAY = 100;
  var DISCOVERY_DEBOUNCE_MS = 150;
  var QUICK_MESSAGE_DURATION = 3e3;

  // src/attachments/export_attachment_vs.ts
  init_preserved_props();
  init_native();
  var DEBUG = false;
  function logDebug(message, ...args) {
    if (DEBUG) console.log(message, ...args);
  }
  function isFiniteVector3(value) {
    return Array.isArray(value) && value.length === 3 && value.every((component) => typeof component === "number" && Number.isFinite(component));
  }
  function getElementBindRotation2(element) {
    const chain = [];
    let current = element;
    while (current instanceof Group || current instanceof Cube) {
      chain.unshift([...current.rotation || [0, 0, 0]]);
      current = current.parent;
    }
    return composeEulerXYZ(chain);
  }
  function getSocketFrom(group) {
    const storedFrom = group.vs_group_from;
    if (isFiniteVector3(storedFrom)) return [...storedFrom];
    const geoChild = group.children.find(
      (child) => child instanceof Cube && child.name === `${group.name}_geo`
    );
    return [...geoChild?.from || group.origin];
  }
  function isInAttachmentSubtree(candidate, attachmentRoot) {
    let current = candidate;
    while (current && current instanceof Group) {
      if (current === attachmentRoot) return true;
      current = current.parent;
    }
    return false;
  }
  function resolveStepParentFrame(element, stepParentName) {
    const attachmentSlot = element.clothingSlot?.trim();
    const candidates = Group.all.filter((candidate) => {
      if (candidate === element || candidate.name !== stepParentName) return false;
      if (isInAttachmentSubtree(candidate, element)) return false;
      return true;
    });
    const target = candidates.find(
      (candidate) => !candidate.stepParentName?.trim() && (!candidate.clothingSlot?.trim() || candidate.clothingSlot?.trim() !== attachmentSlot)
    ) || candidates.find(
      (candidate) => !candidate.clothingSlot?.trim() || candidate.clothingSlot?.trim() !== attachmentSlot
    ) || candidates[0];
    if (target) {
      return {
        from: getSocketFrom(target),
        rotation: getElementBindRotation2(target)
      };
    }
    if (element.vs_has_step_parent_transform && isFiniteVector3(element.vs_step_parent_origin) && isFiniteVector3(element.vs_step_parent_rotation)) {
      return {
        from: [...element.vs_step_parent_origin],
        rotation: [...element.vs_step_parent_rotation]
      };
    }
    return null;
  }
  function getGroupFrom(group) {
    return isFiniteVector3(group.vs_group_from) ? [...group.vs_group_from] : [...group.origin];
  }
  function getGroupTo(group) {
    return isFiniteVector3(group.vs_group_to) ? [...group.vs_group_to] : [...group.origin];
  }
  function getUsedTextureNames(elements) {
    const usedTextures = /* @__PURE__ */ new Set();
    elements.forEach((element) => {
      visit_tree(element, (elem) => {
        if (elem.faces) {
          Object.values(elem.faces).forEach((face) => {
            if (face.texture) {
              const textureName = face.texture.startsWith("#") ? face.texture.substring(1) : face.texture;
              usedTextures.add(textureName);
            }
          });
        }
      });
    });
    return usedTextures;
  }
  function cleanupUnusedTextures(data, usedTextureNames) {
    if (data.textureSizes) {
      for (const name2 of Object.keys(data.textureSizes)) {
        if (!usedTextureNames.has(name2)) {
          logDebug(`[VS Attachment Export] Removing unused textureSizes entry: "${name2}"`);
          delete data.textureSizes[name2];
        }
      }
      if (Object.keys(data.textureSizes).length === 0) {
        logDebug("[VS Attachment Export] Removing empty textureSizes object");
        delete data.textureSizes;
      }
    }
    if (data.textures) {
      for (const name2 of Object.keys(data.textures)) {
        if (!usedTextureNames.has(name2)) {
          logDebug(`[VS Attachment Export] Removing unused textures entry: "${name2}"`);
          delete data.textures[name2];
        }
      }
      if (Object.keys(data.textures).length === 0) {
        logDebug("[VS Attachment Export] Removing empty textures object");
        delete data.textures;
      }
    }
  }
  function populateTexturesFromProject(data, usedTextureNames) {
    for (const texture of Texture.all) {
      if (usedTextureNames && !usedTextureNames.has(texture.name)) {
        continue;
      }
      if (texture.getUVWidth() && texture.getUVHeight()) {
        data.textureSizes[texture.name] = [texture.uv_width, texture.uv_height];
      }
    }
    for (const texture of Texture.all) {
      if (usedTextureNames && !usedTextureNames.has(texture.name)) {
        continue;
      }
      let tmp = {};
      VS_TEXTURE_PROPS.find((p) => p.name === "textureLocation")?.copy(texture, tmp);
      data.textures[texture.name] = tmp.textureLocation;
    }
  }
  function getStepParentName(group) {
    if (group.stepParentName && group.stepParentName.trim() !== "") {
      if (DEBUG) console.log(`[getStepParentName] Using explicit stepParentName property: "${group.stepParentName}"`);
      return group.stepParentName;
    }
    const { name: name2 } = group;
    const lowerName = name2.toLowerCase();
    if (DEBUG) console.log(`[getStepParentName] Checking group: "${name2}"`);
    const mappings = Settings.get("attachment_stepparent_mappings") || {
      exactMatches: {},
      patternMatches: []
    };
    if (mappings.exactMatches && mappings.exactMatches[name2]) {
      const stepParent = mappings.exactMatches[name2];
      if (DEBUG) console.log(`[getStepParentName] Exact match found: "${name2}" \u2192 "${stepParent}"`);
      return stepParent;
    }
    if (mappings.patternMatches && Array.isArray(mappings.patternMatches)) {
      for (const pattern of mappings.patternMatches) {
        if (pattern.contains && lowerName.includes(pattern.contains.toLowerCase())) {
          if (pattern.endsWith) {
            if (lowerName.endsWith(pattern.endsWith.toLowerCase())) {
              if (DEBUG) console.log(`[getStepParentName] Pattern match (contains="${pattern.contains}", endsWith="${pattern.endsWith}"): "${name2}" \u2192 "${pattern.stepParent}"`);
              return pattern.stepParent;
            }
          } else if (pattern.default) {
            continue;
          } else if (pattern.stepParent) {
            if (DEBUG) console.log(`[getStepParentName] Pattern match (contains="${pattern.contains}"): "${name2}" \u2192 "${pattern.stepParent}"`);
            return pattern.stepParent;
          }
        }
      }
      for (const pattern of mappings.patternMatches) {
        if (pattern.contains && lowerName.includes(pattern.contains.toLowerCase()) && pattern.default) {
          if (DEBUG) console.log(`[getStepParentName] Pattern default match (contains="${pattern.contains}"): "${name2}" \u2192 "${pattern.default}"`);
          return pattern.default;
        }
      }
    }
    const activeSlotNames = getActiveSlotNames();
    const matches = activeSlotNames.filter(
      (slotName) => lowerName.endsWith(slotName.toLowerCase())
    );
    if (matches.length === 0) {
      if (DEBUG) console.warn(`[getStepParentName] No slot match found for "${name2}"`);
      return null;
    }
    if (matches.length > 1) {
      if (DEBUG) console.warn(`[getStepParentName] Multiple slot matches found for "${name2}": ${matches.join(", ")}`);
    }
    const slot = matches.reduce((a, b) => a.length >= b.length ? a : b);
    if (DEBUG) console.log(`[getStepParentName] Using slot: "${slot}"`);
    const stepParentName = name2.slice(0, -slot.length);
    if (DEBUG) console.log(`[getStepParentName] Derived stepParentName: "${stepParentName}"`);
    return stepParentName || null;
  }
  function process_attachment_group(parent, node, accu, offset, targetSlot, stepParentName, rootTransform) {
    if (node.backdrop) {
      return;
    }
    const parent_pos = parent ? getGroupFrom(parent) : [0, 0, 0];
    const converted_rotation = parent === null && rootTransform ? rootTransform.rotation : node.rotation;
    let from = vector_sub(getGroupFrom(node), parent_pos);
    let to = vector_sub(getGroupTo(node), parent_pos);
    let rotationOrigin = vector_sub(node.origin, parent_pos);
    if (parent === null && rootTransform) {
      from = [...rootTransform.from];
      to = [...rootTransform.to];
      rotationOrigin = [...rootTransform.rotationOrigin];
    } else if (parent === null) {
      from = vector_add(from, offset);
      to = vector_add(to, offset);
      rotationOrigin = vector_add(rotationOrigin, offset);
    }
    const vsElement = {
      name: node.name,
      from,
      to,
      rotationOrigin,
      ...node.vs_uv ? { uv: node.vs_uv } : void 0,
      ...converted_rotation[0] !== 0 && { rotationX: converted_rotation[0] },
      ...converted_rotation[1] !== 0 && { rotationY: converted_rotation[1] },
      ...converted_rotation[2] !== 0 && { rotationZ: converted_rotation[2] },
      ...node.vs_zero_size_faces ? { faces: node.vs_zero_size_faces } : void 0,
      children: []
    };
    for (const prop of VS_GROUP_PROPS) {
      const prop_name = prop.name;
      const value = prop_name === "stepParentName" && stepParentName ? stepParentName : node[prop_name];
      if (value !== void 0 && value !== null && value !== "" && value !== false) {
        const exportedValue = prop.type === "number" ? Number(value) : value;
        if (prop_name === "paletteSlot" && exportedValue === 0) continue;
        vsElement[prop_name] = exportedValue;
      }
    }
    for (const prop of VS_CUBE_PROPS) {
      const prop_name = prop.name;
      if (VS_GROUP_PROPS.some((groupProp) => groupProp.name === prop_name)) continue;
      const value = node[prop_name];
      if (prop_name === "shade") {
        if (value !== void 0 && value !== true) {
          vsElement[prop_name] = value;
        }
        continue;
      }
      if (value !== void 0 && value !== null && value !== "" && value !== false) {
        const exportedValue = prop.type === "number" ? Number(value) : value;
        if (prop_name === "renderPass" && exportedValue === -1) continue;
        if (prop_name === "unwrapMode" && exportedValue === 0) continue;
        if (prop_name === "unwrapRotation" && exportedValue === 0) continue;
        if (prop_name === "paletteSlot" && exportedValue === 0) continue;
        vsElement[prop_name] = exportedValue;
      }
    }
    apply_extra_props(vsElement, node.vs_extra_props);
    const locators = node.children.filter((child) => child instanceof Locator);
    if (locators.length > 0) {
      const { process_locators: process_locators2 } = (init_locator(), __toCommonJS(locator_exports));
      const attachmentPoints = process_locators2(node, locators);
      if (attachmentPoints.length > 0) {
        vsElement.attachmentpoints = attachmentPoints;
      }
    }
    accu.push(vsElement);
    const filteredChildren = (node.children || []).filter((child) => {
      if (!(child instanceof Group || child instanceof Cube)) return false;
      const childSlot = child.clothingSlot;
      return !childSlot || childSlot.trim() === "" || childSlot.trim() === targetSlot.trim();
    });
    logDebug(`[VS Attachment Export] Filtered children of "${node.name}": ${filteredChildren.length} of ${node.children.length} match slot "${targetSlot}"`);
    traverseAttachment(node, filteredChildren, vsElement.children, offset, targetSlot, void 0, void 0);
  }
  function traverseAttachment(parent, nodes, accu, offset, targetSlot, stepParentName, rootTransform) {
    for (const node of nodes) {
      if (!node.export) continue;
      if (!(node instanceof Group || node instanceof Cube)) continue;
      const nodeSlot = node.clothingSlot;
      const hasMatchingSlot = !nodeSlot || nodeSlot.trim() === "" || nodeSlot.trim() === targetSlot.trim();
      if (!hasMatchingSlot) {
        logDebug(`[VS Attachment Export] Skipping node "${node.name}" - slot "${nodeSlot || "(none)"}" doesn't match target "${targetSlot}"`);
        continue;
      }
      const isTopLevel = parent === null;
      const stepParentToUse = isTopLevel ? stepParentName : void 0;
      if (node instanceof Group) {
        process_attachment_group(parent, node, accu, offset, targetSlot, stepParentToUse, rootTransform);
      } else if (node instanceof Cube) {
        const originalStepParent = node.stepParentName;
        if (stepParentToUse && (!originalStepParent || originalStepParent.trim() === "")) {
          node.stepParentName = stepParentToUse;
        }
        process_cube2(parent, node, accu, offset);
        if (stepParentToUse) {
          node.stepParentName = originalStepParent;
        }
      }
    }
  }
  function findTopmostAttachmentRoot(element, clothingSlot) {
    let current = element.parent;
    let topmostCandidate = null;
    while (current && current instanceof Group) {
      const groupSlot = current.clothingSlot;
      const hasMatchingSlot = groupSlot && groupSlot.trim() !== "" && groupSlot === clothingSlot;
      if (hasMatchingSlot) {
        topmostCandidate = current;
      } else {
        break;
      }
      current = current.parent;
    }
    return topmostCandidate;
  }
  function exportAttachmentsVS(selection) {
    if (!Project) {
      Blockbench.showQuickMessage("Please open a project before exporting attachments.", QUICK_MESSAGE_DURATION);
      return;
    }
    if (!selection || selection.length === 0) {
      Blockbench.showQuickMessage("Please select one or more attachments to export.", QUICK_MESSAGE_DURATION);
      return;
    }
    const data = {
      textureWidth: Project.texture_width,
      textureHeight: Project.texture_height,
      textureSizes: {},
      textures: {},
      elements: [],
      animations: []
    };
    const modifiedGroups = [];
    const rootGroupsSet = /* @__PURE__ */ new Set();
    const processedElements = /* @__PURE__ */ new Set();
    for (const element of selection) {
      const myClothingSlot = element.clothingSlot;
      if (!myClothingSlot || myClothingSlot.trim() === "") {
        continue;
      }
      const topmostRoot = findTopmostAttachmentRoot(element, myClothingSlot);
      if (topmostRoot && topmostRoot instanceof Group) {
        if (!rootGroupsSet.has(topmostRoot)) {
          rootGroupsSet.add(topmostRoot);
          logDebug(`[VS Attachment Export] Found topmost root "${topmostRoot.name}" for element "${element.name}"`);
        }
        processedElements.add(element);
      } else if (element instanceof Group) {
        rootGroupsSet.add(element);
        processedElements.add(element);
      }
    }
    const orphanCubes = [];
    for (const element of selection) {
      if (processedElements.has(element)) continue;
      const myClothingSlot = element.clothingSlot;
      if (!myClothingSlot || myClothingSlot.trim() === "") continue;
      if (element instanceof Cube) {
        orphanCubes.push(element);
        logDebug(`[VS Attachment Export] Orphan cube found: "${element.name}"`);
      }
    }
    const rootAttachments = Array.from(rootGroupsSet).filter((group) => {
      const groupSlot = group.clothingSlot;
      const hasSlot = groupSlot && groupSlot.trim() !== "";
      if (!hasSlot) {
        logDebug(`[VS Attachment Export] Filtering out group "${group.name}" - no clothingSlot`);
      }
      return hasSlot;
    });
    logDebug(`[VS Attachment Export] Filtered ${selection.length} elements to ${rootAttachments.length} root groups and ${orphanCubes.length} orphan cubes`);
    let warnedMissingSocketTransform = false;
    try {
      rootAttachments.forEach((group) => {
        const originalStepParent = group.stepParentName;
        let stepParentName = getStepParentName(group);
        if (!stepParentName || stepParentName.trim() === "") {
          const groupClothingSlot2 = group.clothingSlot;
          let currentParent = group.parent;
          while (!stepParentName && currentParent && currentParent instanceof Group) {
            const parentClothingSlot = currentParent.clothingSlot;
            const parentHasDifferentSlot = !parentClothingSlot || parentClothingSlot.trim() === "" || parentClothingSlot !== groupClothingSlot2;
            if (parentHasDifferentSlot) {
              stepParentName = currentParent.name;
              logDebug(`[VS Attachment Export] Found step parent for "${group.name}": "${stepParentName}" (parent slot: "${parentClothingSlot || "(none)"}", attachment slot: "${groupClothingSlot2}")`);
              break;
            }
            currentParent = currentParent.parent;
          }
          if (!stepParentName && group.parent && group.parent instanceof Group) {
            stepParentName = group.parent.name;
            logDebug(`[VS Attachment Export] Using immediate parent as fallback step parent for "${group.name}": "${stepParentName}"`);
          }
        }
        if (stepParentName && stepParentName.trim() !== "") {
          if (!originalStepParent || originalStepParent.trim() === "") {
            group.stepParentName = stepParentName;
            modifiedGroups.push(group);
            logDebug(`[VS Attachment Export] Set stepParentName="${stepParentName}" on "${group.name}"`);
          }
        } else {
          if (DEBUG) console.warn(`Could not determine a step-parent for attachment: ${group.name}`);
        }
        let offset = [0, 0, 0];
        let rootTransform;
        if (!group.vs_step_parent_local && stepParentName) {
          const socketFrame = resolveStepParentFrame(group, stepParentName);
          if (socketFrame) {
            rootTransform = rebaseAttachmentRoot({
              from: getGroupFrom(group),
              to: getGroupTo(group),
              rotationOrigin: [...group.origin],
              rotation: getElementBindRotation2(group)
            }, socketFrame);
            logDebug(`[VS Attachment Export] Rebased "${group.name}" against "${stepParentName}": position [${rootTransform.rotationOrigin.join(", ")}], rotation [${rootTransform.rotation.join(", ")}]`);
          } else {
            offset = vector_sub(offset, group.origin);
            console.warn(`[VS Attachment Export] No distinct socket or stored socket transform found for "${group.name}" -> "${stepParentName}". Preserving legacy rotation.`);
            if (!warnedMissingSocketTransform) {
              warnedMissingSocketTransform = true;
              Blockbench.showQuickMessage("Some legacy attachments have no stored socket transform; rotation was preserved as authored.", 5e3);
            }
          }
        }
        const attachmentElements = [];
        const groupClothingSlot = group.clothingSlot || "";
        traverseAttachment(null, [group], attachmentElements, offset, groupClothingSlot, stepParentName, rootTransform);
        data.elements.push(...attachmentElements);
      });
      if (orphanCubes.length > 0) {
        logDebug(`[VS Attachment Export] Processing ${orphanCubes.length} orphan cubes`);
        const cubesBySlot = /* @__PURE__ */ new Map();
        orphanCubes.forEach((cube) => {
          const slot = cube.clothingSlot || "";
          if (!cubesBySlot.has(slot)) {
            cubesBySlot.set(slot, []);
          }
          cubesBySlot.get(slot).push(cube);
        });
        const orphanElements = [];
        orphanCubes.forEach((cube) => {
          let stepParentName = cube.stepParentName?.trim() || null;
          const cubeSlot = cube.clothingSlot || "";
          let currentParent = cube.parent;
          while (!stepParentName && currentParent && currentParent instanceof Group) {
            const parentClothingSlot = currentParent.clothingSlot;
            const parentHasDifferentSlot = !parentClothingSlot || parentClothingSlot.trim() === "" || parentClothingSlot !== cubeSlot;
            if (parentHasDifferentSlot) {
              stepParentName = currentParent.name;
              logDebug(`[VS Attachment Export] Found step parent for orphan cube "${cube.name}": "${stepParentName}" (parent slot: "${parentClothingSlot || "(none)"}", cube slot: "${cubeSlot}")`);
              break;
            }
            currentParent = currentParent.parent;
          }
          if (!stepParentName && cube.parent && cube.parent instanceof Group) {
            stepParentName = cube.parent.name;
            logDebug(`[VS Attachment Export] Using immediate parent as fallback step parent for orphan cube "${cube.name}": "${stepParentName}"`);
          }
          const originalStepParent = cube.stepParentName;
          if (stepParentName && (!originalStepParent || originalStepParent.trim() === "")) {
            cube.stepParentName = stepParentName;
          }
          const cubeElements = [];
          process_cube2(null, cube, cubeElements, [0, 0, 0]);
          const exportedCube = cubeElements[0];
          if (exportedCube && cube.vs_step_parent_local !== true && stepParentName) {
            const socketFrame = resolveStepParentFrame(cube, stepParentName);
            if (socketFrame) {
              const rootTransform = rebaseAttachmentRoot({
                from: [...cube.from],
                to: [...cube.to],
                rotationOrigin: [...cube.origin],
                rotation: getElementBindRotation2(cube)
              }, socketFrame);
              exportedCube.from = rootTransform.from;
              exportedCube.to = rootTransform.to;
              exportedCube.rotationOrigin = rootTransform.rotationOrigin;
              delete exportedCube.rotationX;
              delete exportedCube.rotationY;
              delete exportedCube.rotationZ;
              if (rootTransform.rotation[0] !== 0) exportedCube.rotationX = rootTransform.rotation[0];
              if (rootTransform.rotation[1] !== 0) exportedCube.rotationY = rootTransform.rotation[1];
              if (rootTransform.rotation[2] !== 0) exportedCube.rotationZ = rootTransform.rotation[2];
            } else {
              console.warn(`[VS Attachment Export] No distinct socket or stored socket transform found for cube "${cube.name}" -> "${stepParentName}"; preserving its model-space transform.`);
            }
          }
          orphanElements.push(...cubeElements);
          if (stepParentName) {
            cube.stepParentName = originalStepParent;
          }
        });
        data.elements.push(...orphanElements);
      }
    } finally {
      modifiedGroups.forEach((group) => {
        delete group.stepParentName;
      });
    }
    Blockbench.export({
      type: "Vintage Story Attachment",
      extensions: ["json"],
      name: `${selection[0].name}_attachment.json`,
      startpath: Project.save_path,
      custom_writer: (content, path7) => {
        logDebug(`[VS Attachment Export] Writing to path: ${path7}`);
        const usedTextureNames = getUsedTextureNames(data.elements);
        logDebug(`[VS Attachment Export] Used textures: ${Array.from(usedTextureNames).join(", ")}`);
        if (fs.existsSync(path7)) {
          logDebug("[VS Attachment Export] File exists, will overwrite");
          try {
            const existingContent = fs.readFileSync(path7, "utf8");
            const existingData = JSON.parse(existingContent);
            if (existingData.textureSizes) {
              for (const [name2, size] of Object.entries(existingData.textureSizes)) {
                if (usedTextureNames.has(name2)) {
                  data.textureSizes[name2] = size;
                }
              }
              logDebug("[VS Attachment Export] Preserved textureSizes from existing file (filtered to used textures)");
            }
            if (existingData.textures) {
              for (const [name2, location] of Object.entries(existingData.textures)) {
                if (usedTextureNames.has(name2)) {
                  data.textures[name2] = location;
                }
              }
              logDebug("[VS Attachment Export] Preserved textures from existing file (filtered to used textures)");
            }
          } catch (e) {
            console.error("[VS Attachment Export] Error reading existing file:", e);
            Blockbench.showQuickMessage("Warning: Existing file has invalid JSON. Using project textures instead.", 3e3);
            populateTexturesFromProject(data, usedTextureNames);
          }
        } else {
          logDebug("[VS Attachment Export] File does not exist, using project textures");
          populateTexturesFromProject(data, usedTextureNames);
        }
        cleanupUnusedTextures(data, usedTextureNames);
        const finalContent = autoStringify(data);
        try {
          fs.writeFileSync(path7, finalContent, "utf8");
          logDebug(`[VS Attachment Export] Successfully wrote file: ${path7}`);
          Blockbench.showQuickMessage(`Exported attachment to ${path7.split(/[/\\]/).pop()}`, 2e3);
        } catch (e) {
          console.error("[VS Attachment Export] Error writing file:", e);
          Blockbench.showQuickMessage(`Failed to write file: ${e instanceof Error ? e.message : String(e)}`, 5e3);
        }
      }
    });
  }

  // src/attachments/codec.ts
  function createExportCodec(selection = []) {
    function getElementBindRotation4(element) {
      const chain = [];
      let current = element;
      while (current instanceof Group || current instanceof Cube) {
        chain.unshift([...current.rotation || [0, 0, 0]]);
        current = current.parent;
      }
      return composeEulerXYZ(chain);
    }
    function getSocketFrom3(group) {
      const storedFrom = group.vs_group_from;
      if (Array.isArray(storedFrom) && storedFrom.length === 3) {
        return [...storedFrom];
      }
      const geoChild = group.children.find(
        (child) => child instanceof Cube && child.name === `${group.name}_geo`
      );
      return [...geoChild?.from || group.origin];
    }
    function compileGroupsFrom(rootGroups, undo, rootGroupUuids, parentNameMap, stepParentTransformMap, rootBindRotationMap) {
      const result = [];
      function iterate(array, save_array, isRoot = false) {
        for (const element of array) {
          if (element.type === "group") {
            const obj = element.compile(undo);
            if (isRoot && rootGroupUuids.has(element.uuid)) {
              const parentName = parentNameMap.get(element.uuid);
              if (!obj.stepParentName && parentName) {
                obj.stepParentName = parentName;
              }
              const transform = stepParentTransformMap.get(element.uuid);
              if (transform && !obj.vs_step_parent_local) {
                obj.vs_has_step_parent_transform = true;
                obj.vs_step_parent_origin = [...transform.from];
                obj.vs_step_parent_rotation = [...transform.rotation];
              }
              const rootBindRotation = rootBindRotationMap.get(element.uuid);
              if (rootBindRotation && !obj.vs_step_parent_local) {
                obj.rotation = [...rootBindRotation];
              }
            }
            if (element.children.length > 0) {
              iterate(element.children, obj.children, false);
            }
            save_array.push(obj);
          } else {
            save_array.push(element.uuid);
          }
        }
      }
      iterate(rootGroups, result, true);
      return result;
    }
    function collectAllElements(nodes) {
      const allElements = [];
      function traverse3(node) {
        allElements.push(node);
        if (node.children && node.children.length > 0) {
          node.children.forEach((child) => traverse3(child));
        }
      }
      nodes.forEach((node) => traverse3(node));
      return allElements;
    }
    function collectUsedTextureUuids(cubes) {
      const usedUuids = /* @__PURE__ */ new Set();
      for (const cube of cubes) {
        if (!cube.faces) continue;
        for (const faceKey in cube.faces) {
          const face = cube.faces[faceKey];
          if (face && face.texture !== void 0 && face.texture !== null) {
            const tex = Texture.all[face.texture] || Texture.all.find((t) => t.uuid === face.texture);
            if (tex) {
              usedUuids.add(tex.uuid);
            }
          }
        }
      }
      return usedUuids;
    }
    return new Codec("projectSelection", {
      name: "Blockbench Project Selection",
      extension: "bbmodel",
      remember: true,
      export() {
        if (!Project || selection.length === 0) return;
        Blockbench.export({
          resource_id: "model",
          type: this.name,
          extensions: [this.extension],
          name: `${selection[0].name}_attachment.bbmodel`,
          startpath: this.startPath(),
          content: this.compile(selection)
        });
      },
      compile(selection2, options) {
        if (!Project) throw new Error("Cannot export attachments without an open project.");
        if (!options) options = {};
        const model = {
          meta: {
            format_version: "4.5",
            model_format: Format.id,
            box_uv: Project.box_uv
          },
          resolution: {
            width: Project.texture_width || 16,
            height: Project.texture_height || 16
          },
          elements: [],
          outliner: []
        };
        const rootGroupUuids = /* @__PURE__ */ new Set();
        const rootElementUuids = /* @__PURE__ */ new Set();
        const parentNameMap = /* @__PURE__ */ new Map();
        const stepParentTransformMap = /* @__PURE__ */ new Map();
        const rootBindRotationMap = /* @__PURE__ */ new Map();
        selection2.forEach((el) => {
          if (el instanceof Group || el instanceof Cube) {
            rootElementUuids.add(el.uuid);
            if (el instanceof Group) rootGroupUuids.add(el.uuid);
            if (el.parent && el.parent instanceof Group) {
              parentNameMap.set(el.uuid, el.parent.name);
            }
            const stepParentName = el.stepParentName?.trim() || parentNameMap.get(el.uuid);
            if (stepParentName && !el.vs_step_parent_local) {
              rootBindRotationMap.set(el.uuid, getElementBindRotation4(el));
              const candidates = Group.all.filter((candidate) => {
                if (candidate === el || candidate.name !== stepParentName) return false;
                let current = candidate;
                while (current && current instanceof Group) {
                  if (current === el) return false;
                  current = current.parent;
                }
                return true;
              });
              const attachmentSlot = el.clothingSlot?.trim();
              const target = candidates.find((candidate) => {
                const candidateSlot = candidate.clothingSlot?.trim();
                return !candidateSlot || candidateSlot !== attachmentSlot;
              }) || candidates[0];
              if (target) {
                stepParentTransformMap.set(el.uuid, {
                  from: getSocketFrom3(target),
                  rotation: getElementBindRotation4(target)
                });
              }
            }
          }
        });
        const allElements = collectAllElements(selection2);
        const cubes = [];
        allElements.forEach((el) => {
          if (el instanceof Cube) {
            cubes.push(el);
            const saveCopy = el.getSaveCopy();
            if (rootElementUuids.has(el.uuid)) {
              const parentName = parentNameMap.get(el.uuid);
              if (!saveCopy.stepParentName && parentName) {
                saveCopy.stepParentName = parentName;
              }
              const transform = stepParentTransformMap.get(el.uuid);
              if (transform && !saveCopy.vs_step_parent_local) {
                saveCopy.vs_has_step_parent_transform = true;
                saveCopy.vs_step_parent_origin = [...transform.from];
                saveCopy.vs_step_parent_rotation = [...transform.rotation];
              }
              const rootBindRotation = rootBindRotationMap.get(el.uuid);
              if (rootBindRotation && !saveCopy.vs_step_parent_local) {
                saveCopy.rotation = [...rootBindRotation];
              }
            }
            model.elements.push(saveCopy);
          }
        });
        model.outliner = compileGroupsFrom(
          selection2,
          true,
          rootGroupUuids,
          parentNameMap,
          stepParentTransformMap,
          rootBindRotationMap
        );
        const usedTextureUuids = collectUsedTextureUuids(cubes);
        model.textures = [];
        Texture.all.forEach((tex) => {
          if (usedTextureUuids.has(tex.uuid)) {
            const t = tex.getUndoCopy();
            t.source = "data:image/png;base64," + tex.getBase64();
            t.mode = "bitmap";
            model.textures.push(t);
          }
        });
        return compileJSON(model);
      }
    });
  }

  // src/attachments/export_attachment_bb.ts
  var DEBUG2 = false;
  function exportAttachmentsBB(selection) {
    if (!selection || selection.length === 0) {
      Blockbench.showQuickMessage("Please select one or more attachments to export.", QUICK_MESSAGE_DURATION);
      return;
    }
    const bb_codec = createExportCodec(selection);
    bb_codec.export();
    if (DEBUG2) console.log("Exporting selected attachments to .bbmodel format...");
  }

  // src/attachments/delete_section.ts
  function collectAttachmentElements(element, rootElements) {
    const attachments2 = [];
    function traverse3(node) {
      if (rootElements.has(node)) {
        if (node instanceof Group && node.children) {
          node.children.forEach(traverse3);
        }
        return;
      }
      if (isAttachment(node)) {
        attachments2.push(node);
      }
      if (node instanceof Group && node.children) {
        node.children.forEach(traverse3);
      }
    }
    traverse3(element);
    return attachments2;
  }
  function identifyRootAttachmentGroups(elements) {
    const rootGroups = /* @__PURE__ */ new Set();
    elements.forEach((element) => {
      if (isAttachment(element)) {
        const parent = element.parent;
        if (!parent || !isAttachment(parent)) {
          rootGroups.add(element);
        }
      }
    });
    return rootGroups;
  }
  function deleteSectionSafe(elements) {
    if (!elements || elements.length === 0) {
      Blockbench.showQuickMessage("There are no attachments in this section to delete.", QUICK_MESSAGE_DURATION);
      return;
    }
    Undo.initEdit({ outliner: true });
    const rootGroups = identifyRootAttachmentGroups(elements);
    const allAttachments = /* @__PURE__ */ new Set();
    elements.forEach((element) => {
      const attachments2 = collectAttachmentElements(element, rootGroups);
      attachments2.forEach((att) => allAttachments.add(att));
    });
    if (allAttachments.size === 0) {
      Undo.finishEdit("Delete attachment(s)");
      Blockbench.showQuickMessage("No attachment elements found to delete.", QUICK_MESSAGE_DURATION);
      return;
    }
    allAttachments.forEach((attachment) => {
      attachment.remove();
    });
    Undo.finishEdit(`Delete (-) Root: ${allAttachments.size} attachment(s)`);
    Blockbench.dispatchEvent("attachments_changed", {});
    Blockbench.showQuickMessage(`Delete (-) Root: Deleted ${allAttachments.size} attachment(s) (root groups preserved)`, QUICK_MESSAGE_DURATION);
  }
  function deleteSection(elements) {
    if (!elements || elements.length === 0) {
      Blockbench.showQuickMessage("There are no attachments in this section to delete.", QUICK_MESSAGE_DURATION);
      return;
    }
    Undo.initEdit({ outliner: true });
    elements.forEach((element) => element.remove());
    Undo.finishEdit(`Delete ${elements.length} attachment(s)`);
    Blockbench.dispatchEvent("attachments_changed", {});
    Blockbench.showQuickMessage(`Deleted ${elements.length} attachment(s)`, QUICK_MESSAGE_DURATION);
  }

  // src/attachments/slot_helpers.ts
  function getSlotCategory(slot) {
    const lowerSlot = slot.toLowerCase();
    if (lowerSlot.includes("armor")) {
      return "armor";
    }
    const facialSlots = ["face", "eyes", "eyebrows", "nose", "mouth", "facialhair", "ears", "hair"];
    if (facialSlots.some((f) => lowerSlot.includes(f))) {
      return "facial";
    }
    const accessorySlots = ["earrings", "faceitem", "emblem", "neck"];
    if (accessorySlots.some((a) => lowerSlot.includes(a))) {
      return "accessory";
    }
    const clothingSlots = ["upperbody", "lowerbody", "top", "bottoms", "outerwear", "shoes", "boots", "gloves", "hand", "foot", "arm", "shoulder", "waist", "headwear"];
    if (clothingSlots.some((c) => lowerSlot.includes(c))) {
      return "clothing";
    }
    return "other";
  }
  function getSlotIcon(category) {
    switch (category) {
      case "armor":
        return "shield";
      case "facial":
        return "face";
      case "accessory":
        return "star";
      case "clothing":
        return "checkroom";
      default:
        return "label";
    }
  }
  function getSlotColor(category) {
    switch (category) {
      case "armor":
        return "#9c27b0";
      // Purple
      case "facial":
        return "#ff9800";
      // Orange
      case "accessory":
        return "#2196f3";
      // Blue
      case "clothing":
        return "#4caf50";
      // Green
      default:
        return "#757575";
    }
  }
  function getSlotInfo(slot) {
    const category = getSlotCategory(slot);
    return {
      category,
      icon: getSlotIcon(category),
      color: getSlotColor(category)
    };
  }
  function suggestSlotFromName(elementName, availableSlots) {
    const lowerName = elementName.toLowerCase();
    const nameMappings = {
      "hat": ["Headwear", "Head"],
      "cap": ["Headwear", "Head"],
      "helmet": ["Armor Head", "Headwear", "Head"],
      "shirt": ["Top", "UpperBody"],
      "top": ["Top", "UpperBody"],
      "pants": ["Bottoms", "LowerBody"],
      "trousers": ["Bottoms", "LowerBody"],
      "shoes": ["Shoes", "Foot"],
      "boots": ["Shoes", "Foot"],
      "gloves": ["Gloves", "Hand"],
      "eyes": ["Eyes", "Face"],
      "nose": ["Nose", "Face"],
      "mouth": ["Mouth", "Face"],
      "hair": ["Hair"],
      "earrings": ["Earrings", "Ears"],
      "jacket": ["Outerwear", "UpperBodyOver"],
      "coat": ["Outerwear", "UpperBodyOver"]
    };
    for (const [key, slots] of Object.entries(nameMappings)) {
      if (lowerName.includes(key)) {
        for (const slot of slots) {
          if (availableSlots.includes(slot)) {
            return slot;
          }
        }
      }
    }
    for (const slot of availableSlots) {
      const lowerSlot = slot.toLowerCase();
      if (lowerName.includes(lowerSlot) || lowerSlot.includes(lowerName)) {
        return slot;
      }
    }
    return null;
  }

  // src/attachments/panel.ts
  var DEBUG3 = false;
  var RECENT_IMPORT_THRESHOLD = 5 * 60 * 1e3;
  var recentImports = /* @__PURE__ */ new Map();
  function markAsRecentlyImported(element) {
    recentImports.set(element, Date.now());
    if (recentImports.size > 100) {
      const now = Date.now();
      for (const [el, time] of recentImports.entries()) {
        if (now - time > RECENT_IMPORT_THRESHOLD) {
          recentImports.delete(el);
        }
      }
    }
  }
  function isRecentlyImported(element) {
    const time = recentImports.get(element);
    if (!time) return false;
    return Date.now() - time < RECENT_IMPORT_THRESHOLD;
  }
  function debounce(fn, wait) {
    let timeout = null;
    return ((...args) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), wait);
    });
  }
  function getAllChildElements(element) {
    const elements = [];
    function traverse3(node) {
      elements.push(node);
      if (node instanceof Group && Array.isArray(node.children)) {
        node.children.forEach(traverse3);
      }
    }
    traverse3(element);
    return elements;
  }
  function walkOutliner(node, callback) {
    callback(node);
    if (node instanceof Group && Array.isArray(node.children)) {
      node.children.forEach((child) => walkOutliner(child, callback));
    }
  }
  function getElementDepth(element) {
    let depth = 0;
    let current = element.parent;
    while (current) {
      depth++;
      current = current.parent;
    }
    return depth;
  }
  function getMinDepth(elements) {
    if (elements.length === 0) return 0;
    return Math.min(...elements.map((el) => getElementDepth(el)));
  }
  function updateOutlinerSelection(elements) {
    Outliner.selected.empty();
    elements.forEach((element) => {
      Outliner.selected.safePush(element);
    });
    updateSelection();
  }
  var vuePanel = {
    template: `
        <div class="attachments-panel">
            <style>
                .attachments-panel {
                    padding: 0;
                }
                .attachment-section {
                    margin: 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
                .attachment-section:last-child {
                    border-bottom: none;
                }
                .attachment-section h2 {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 8px;
                    margin: 0;
                    cursor: pointer;
                    user-select: none;
                    position: relative;
                    font-size: 18px !important;
                    font-weight: 500;
                    min-height: 32px;
                }
                .attachments-panel .attachment-section h2 {
                    font-size: 18px !important;
                }
                .attachments-panel .attachment-section h2 * {
                    font-size: inherit !important;
                }
                .attachment-section h2:hover {
                    background: rgba(255, 255, 255, 0.05);
                }
                .expand_icon {
                    font-size: 18px !important;
                    width: 18px;
                    flex-shrink: 0;
                }
                .slot-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 3px;
                    padding: 1px 6px;
                    border-radius: 10px;
                    font-size: 18px !important;
                    font-weight: 500;
                    line-height: 1.3;
                    flex-shrink: 0;
                }
                .attachments-panel .attachment-section h2 .slot-badge {
                    font-size: 18px !important;
                }
                /* Override w3-css h2 styles specifically for our text span */
                .attachments-panel .slot-badge-text,
                .attachments-panel .attachment-section h2 .slot-badge .slot-badge-text,
                .attachments-panel .attachment-section h2 .slot-badge-text,
                .attachments-panel .attachment-section h2 span.slot-badge span.slot-badge-text {
                    font-size: 18px !important;
                    line-height: 1.3;
                    display: inline-block;
                }
                /* Maximum specificity to override w3-css */
                .attachments-panel .attachment-section h2 .slot-badge .slot-badge-text {
                    font-size: 18px !important;
                }
                .slot-icon {
                    font-size: 8px !important;
                }
                .attachment-section h2 .slot-badge .material-icons.slot-icon {
                    font-size: 8px !important;
                }
                .attachment-count {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 1px 5px;
                    border-radius: 8px;
                    font-size: 10px;
                    font-weight: 500;
                    margin-left: auto;
                    flex-shrink: 0;
                }
                .section-stats {
                    font-size: 8px;
                    color: rgba(255, 255, 255, 0.5);
                    margin-left: 4px;
                    flex-shrink: 0;
                }
                .section-buttons {
                    display: flex;
                    gap: 0;
                    margin-left: auto;
                    align-items: center;
                    flex-shrink: 0;
                }
                .section-buttons .material-icons {
                    width: 24px;
                    height: 24px;
                    min-width: 24px;
                    min-height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    border-radius: 0;
                    font-size: 16px;
                    transition: background 0.15s;
                    padding: 0;
                }
                .section-buttons .material-icons:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .section-buttons .material-icons:first-child {
                    border-top-left-radius: 3px;
                    border-bottom-left-radius: 3px;
                }
                .section-buttons .material-icons:last-child {
                    border-top-right-radius: 3px;
                    border-bottom-right-radius: 3px;
                }
                .section-buttons .action-group {
                    display: flex;
                    gap: 0;
                }
                .section-buttons .action-divider {
                    width: 1px;
                    height: 16px;
                    background: rgba(255, 255, 255, 0.15);
                    margin: 0 2px;
                    flex-shrink: 0;
                }
                .element-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    padding-left: 2px;
                }
                .element-item {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    padding: 1px 4px;
                    cursor: pointer;
                    font-size: 11px;
                    min-height: 18px;
                    position: relative;
                }
                .element-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                }
                .element-item.selected {
                    background: rgba(66, 165, 245, 0.2);
                }
                .element-icon {
                    font-size: 13px;
                    width: 14px;
                    text-align: center;
                    flex-shrink: 0;
                    margin-right: 2px;
                }
                .element-name {
                    flex: 1;
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .modified-indicator {
                    color: #ff9800;
                    font-size: 10px;
                    margin-left: 2px;
                    flex-shrink: 0;
                }
                .tooltip-content {
                    display: none;
                    position: absolute;
                    background: rgba(0, 0, 0, 0.95);
                    color: white;
                    padding: 6px 10px;
                    border-radius: 4px;
                    font-size: 11px;
                    z-index: 1000;
                    max-width: 280px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                    pointer-events: none;
                    top: 100%;
                    left: 0;
                    margin-top: 2px;
                }
                .section-header-wrapper {
                    position: relative;
                }
                .section-header-wrapper:hover .tooltip-content {
                    display: block;
                }
            </style>
            <div v-if="sections.every(s => s.elements.length === 0)" class="panel_placeholder">
                <i class="material-icons">folder</i>
                <p>No attachments found in model.</p>
                <p>Assign a "Clothing Slot" to a group or cube in the element panel.</p>
            </div>
            <div v-else>
                <div v-for="section in sections.filter(s => s.elements.length > 0)" :key="section.slot" class="attachment-section">
                    <div class="section-header-wrapper" style="position: relative;">
                        <h2 @click="toggleSection(section.slot)" :class="{ collapsed: !isSectionOpen(section.slot) }">
                            <i class="material-icons expand_icon">
                                {{ isSectionOpen(section.slot) ? 'arrow_drop_down' : 'arrow_right' }}
                            </i>
                            <span class="slot-badge" :style="{ backgroundColor: getSlotInfo(section.slot).color + '40', color: getSlotInfo(section.slot).color }">
                                <i class="material-icons slot-icon">{{ getSlotInfo(section.slot).icon }}</i>
                                <span class="slot-badge-text" style="font-size: 18px !important;">{{ section.slot }}: {{ section.elements.length }} {{ getSectionStats(section.elements) }}</span>
                            </span>
                            
                            <span class="section-buttons">
                                <i class="material-icons" @click.stop="selectSection(section.elements)" title="Select all elements in this section">select_all</i>
                                <i class="material-icons" @click.stop="toggleVisibility(section.elements, !getSectionVisibility(section.elements))" :title="getSectionVisibility(section.elements) ? 'Hide all elements in this section' : 'Show all elements in this section'">
                                    {{ getSectionVisibility(section.elements) ? 'visibility' : 'visibility_off' }}
                                </i>
                                <span class="action-divider"></span>
                                <i class="material-icons" @click.stop="exportBB(section.elements)" title="Export to .bbmodel">save</i>
                                <i class="material-icons" @click.stop="exportVS(section.elements)" title="Export as VS .json">file_download</i>
                                <span class="action-divider"></span>
                                <i class="material-icons" @click.stop="confirmDeleteMinusRoot(section.elements, section.slot)" title="Delete (-) Root: Delete attachments but preserve root groups" style="color: #4caf50;">remove_circle_outline</i>
                                <i class="material-icons" @click.stop="confirmDelete(section.elements, section.slot)" title="Delete all elements in this section (including root groups)" style="color: #f44336;">delete</i>
                            </span>
                        </h2>
                        <div class="tooltip-content">
                            <div><strong>{{ section.slot }}</strong></div>
                            <div style="margin-top: 4px; font-size: 11px; line-height: 1.4;">
                                <span v-for="(element, index) in getFlattenedElementList(section.elements).slice(0, 10)" :key="element.uuid">
                                    {{ element.name }}<span v-if="index < Math.min(section.elements.length, 10) - 1">, </span>
                                </span>
                                <span v-if="section.elements.length > 10" style="opacity: 0.7;">
                                    ... and {{ section.elements.length - 10 }} more
                                </span>
                            </div>
                        </div>
                    </div>
                    <div v-if="isSectionOpen(section.slot)" class="element-list">
                        <div v-for="element in section.elements" 
                            :key="element.uuid"
                            :class="{ selected: isSelected(element), 'recently-imported': isRecentlyImported(element) }"
                            class="element-item"
                            :style="{ paddingLeft: (getElementIndent(element, section.elements) * 12 + 4) + 'px' }"
                            @click="selectElement(element)"
                            :title="getElementTooltip(element)">
                            
                            <i class="material-icons element-icon" :style="{ color: element instanceof Group ? '#64b5f6' : '#81c784' }">
                                {{ getIcon(element) }}
                            </i>
                            <span class="element-name">
                                {{ element.name }}
                                <span v-if="isRecentlyImported(element)" class="modified-indicator" title="Recently imported">\u25CF</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: () => ({
      sections: [],
      openSections: [],
      hoveredSection: null
    }),
    methods: {
      /**
       * Gets slot information for styling
       */
      getSlotInfo(slot) {
        return getSlotInfo(slot);
      },
      /**
       * Gets section statistics (groups vs cubes) in format: (5 Groups, 2 Cubes)
       */
      getSectionStats(elements) {
        const groups = elements.filter((e) => e instanceof Group).length;
        const cubes = elements.filter((e) => e instanceof Cube).length;
        const parts = [];
        if (groups > 0) parts.push(`${groups} Group${groups !== 1 ? "s" : ""}`);
        if (cubes > 0) parts.push(`${cubes} Cube${cubes !== 1 ? "s" : ""}`);
        if (parts.length === 0) return "(0 items)";
        return `(${parts.join(", ")})`;
      },
      /**
       * Checks if element was recently imported
       */
      isRecentlyImported(element) {
        return isRecentlyImported(element);
      },
      /**
       * Gets tooltip text for an element
       */
      getElementTooltip(element) {
        const parts = [];
        parts.push(element.name || "Unnamed");
        if (element instanceof Group) {
          parts.push(`Group (${element.children?.length || 0} children)`);
        } else {
          parts.push("Cube");
        }
        if (element.clothingSlot) {
          parts.push(`Slot: ${element.clothingSlot}`);
        }
        if (element.stepParentName) {
          parts.push(`Step Parent: ${element.stepParentName}`);
        }
        return parts.join(" | ");
      },
      /**
       * Gets a flattened list of element names (for tooltip display).
       * @param elements Array of elements to flatten.
       * @returns Array of elements in a flat list.
       */
      getFlattenedElementList(elements) {
        return [...elements].sort((a, b) => {
          const nameA = (a.name || "").toLowerCase();
          const nameB = (b.name || "").toLowerCase();
          return nameA.localeCompare(nameB);
        });
      },
      /**
       * Calculates the indentation level for an element based on its depth in the hierarchy.
       * Indentation is normalized so the shallowest element starts at 0.
       * @param element The element to calculate indentation for.
       * @param allElements All elements in the section (to find min depth).
       * @returns The indentation level (0 = shallowest element, increases with relative depth).
       */
      getElementIndent(element, allElements) {
        const minDepth = getMinDepth(allElements);
        const elementDepth = getElementDepth(element);
        return elementDepth - minDepth;
      },
      /**
       * Exports the given elements to a .bbmodel file.
       * @param {Array<Group | Cube>} elements The elements to export.
       */
      exportBB(elements) {
        try {
          exportAttachmentsBB(elements);
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : String(e);
          Blockbench.showQuickMessage(`Export failed: ${errorMsg}`, QUICK_MESSAGE_DURATION);
          if (DEBUG3) console.error("Export BB error:", e);
        }
      },
      /**
       * Exports the given elements to a Vintage Story .json file.
       * @param {Array<Group | Cube>} elements The elements to export.
       */
      exportVS(elements) {
        try {
          exportAttachmentsVS(elements);
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : String(e);
          Blockbench.showQuickMessage(`Export failed: ${errorMsg}`, QUICK_MESSAGE_DURATION);
          if (DEBUG3) console.error("Export VS error:", e);
        }
      },
      /**
       * Confirms delete minus root (preserves root attachment groups and base model groups)
       */
      confirmDeleteMinusRoot(elements, slotName) {
        if (confirm(`Delete (-) Root in "${slotName}"?

This will delete attachment content but preserve:
- Base model groups (like "Ears")
- Root attachment groups (first level with clothingSlot)

This action cannot be undone.`)) {
          deleteSectionSafe(elements);
        }
      },
      /**
       * Confirms deletion before deleting section (original behavior - deletes everything)
       */
      confirmDelete(elements, slotName) {
        if (confirm(`Are you sure you want to delete all ${elements.length} attachment(s) in "${slotName}"?

This will delete everything including base model groups.

This action cannot be undone.`)) {
          deleteSection(elements);
        }
      },
      /**
       * Updates the list of attachments by calling the discovery function.
       */
      updateAttachments() {
        this.sections = findAttachments();
      },
      /**
       * Toggles the visibility of a section in the panel.
       * @param {string} slot The slot name of the section to toggle.
       */
      toggleSection(slot) {
        const index = this.openSections.indexOf(slot);
        if (index > -1) {
          this.openSections.splice(index, 1);
        } else {
          this.openSections.push(slot);
        }
      },
      /**
       * Checks if a section is open in the panel.
       * @param {string} slot The slot name of the section.
       * @returns {boolean} True if the section is open, false otherwise.
       */
      isSectionOpen(slot) {
        return this.openSections.includes(slot);
      },
      /**
       * Selects an element and all its children.
       * @param {Group | Cube} element The element to select.
       */
      selectElement(element) {
        const allChildren = getAllChildElements(element);
        updateOutlinerSelection(allChildren);
      },
      /**
       * Checks if an element is selected in the outliner.
       * @param {Group | Cube} element The element to check.
       * @returns {boolean} True if the element is selected, false otherwise.
       */
      isSelected(element) {
        return Outliner.selected.includes(element);
      },
      /**
       * Toggles the visibility of all given elements.
       * @param {Array<Group | Cube>} elements The elements to toggle visibility for.
       * @param {boolean} isVisible The desired visibility state.
       */
      toggleVisibility(elements, isVisible) {
        if (!elements || !Array.isArray(elements)) return;
        try {
          Undo.initEdit({ outliner: true });
          elements.forEach((element) => {
            if (!element) return;
            try {
              walkOutliner(element, (node) => {
                if (!node) return;
                if (typeof node.toggleVisibility === "function") {
                  if (node.visibility !== isVisible) node.toggleVisibility(isVisible);
                } else if ("visibility" in node) {
                  node.visibility = isVisible;
                }
              });
            } catch (e) {
              if (DEBUG3) console.warn("Error toggling visibility for element:", element?.name, e);
            }
          });
          Undo.finishEdit("Toggle visibility");
          Canvas.updateVisibility?.();
          Canvas.updateAll?.();
        } catch (e) {
          if (DEBUG3) console.error("Error in toggleVisibility:", e);
          Blockbench.showQuickMessage("Failed to toggle visibility", QUICK_MESSAGE_DURATION);
        }
      },
      /**
       * Selects all elements in a section.
       * @param {Array<Group | Cube>} elements The elements in the section.
       */
      selectSection(elements) {
        const allChildren = elements.flatMap((element) => getAllChildElements(element));
        updateOutlinerSelection(allChildren);
      },
      /**
       * Gets the visibility state of a section.
       * @param {Array<Group | Cube>} elements The elements in the section.
       * @returns {boolean} True if all elements are visible, false otherwise.
       */
      getSectionVisibility(elements) {
        return elements.every((element) => element.visibility);
      },
      /**
       * Gets the appropriate icon for an element.
       * @param {Group | Cube} element The element.
       * @returns {string} The icon name.
       */
      getIcon(element) {
        return element instanceof Group ? "folder" : "widgets";
      }
    },
    mounted() {
      this.refresh = debounce(() => this.updateAttachments(), DISCOVERY_DEBOUNCE_MS);
      this.updateAttachments();
      this._bbListeners = [
        ["update_outliner", this.refresh],
        ["load_project", this.refresh],
        ["select_project", this.refresh],
        ["new_project", this.refresh],
        ["update_selection", this.refresh],
        ["undo", this.refresh],
        ["redo", this.refresh],
        ["attachments_changed", this.refresh]
      ];
      this._bbListeners.forEach(([evt, fn]) => Blockbench.on(evt, fn));
    },
    beforeUnmount() {
      if (this._bbListeners) {
        this._bbListeners.forEach(([evt, fn]) => Blockbench.removeListener(evt, fn));
      }
    },
    // Vue 2 compatibility
    beforeDestroy() {
      if (this._bbListeners) {
        this._bbListeners.forEach(([evt, fn]) => Blockbench.removeListener(evt, fn));
      }
    }
  };
  function createAttachmentsPanel(actions) {
    const toolbar = new Toolbar("attachments_toolbar", {
      id: "attachments_toolbar",
      children: []
    });
    if (actions.importBB) {
      toolbar.add(actions.importBB);
    }
    if (actions.importVS) {
      toolbar.add(actions.importVS);
    }
    const panel2 = new Panel("attachments_panel", {
      id: "attachments_panel",
      name: "Attachments",
      condition: { formats: ["formatVS"] },
      icon: "attach_file",
      expand_button: false,
      default_side: "right",
      default_position: {
        slot: "right_bar",
        float_position: [0, 0],
        float_size: [300, 400],
        height: 400,
        folded: false
      },
      toolbars: [toolbar],
      component: vuePanel
    });
    Interface.Panels.attachments_panel = panel2;
    return panel2;
  }

  // src/util/json.ts
  function cleanJSONString(jsonString) {
    return jsonString.replace(/,(\s*[\]}])/g, "$1");
  }

  // src/attachments/post_import.ts
  init_presets();

  // src/attachments/dialogs.ts
  init_presets();
  var slotMemory = /* @__PURE__ */ new Map();
  function getRememberedSlot(filePath) {
    const pattern = extractFilePattern(filePath);
    return slotMemory.get(pattern) || null;
  }
  function rememberSlot(filePath, slot) {
    const pattern = extractFilePattern(filePath);
    slotMemory.set(pattern, slot);
    if (slotMemory.size > 100) {
      const firstKey = slotMemory.keys().next().value;
      slotMemory.delete(firstKey);
    }
  }
  function extractFilePattern(filePath) {
    const fileName = filePath.split(/[/\\]/).pop() || "";
    return fileName.replace(/\.[^.]+$/, "").replace(/\d+$/, "").toLowerCase();
  }
  function analyzeImportPreview(model) {
    const result = {
      elementCount: 0,
      groupCount: 0,
      cubeCount: 0,
      textureCount: 0,
      detectedSlots: [],
      elementNames: []
    };
    if (!model) return result;
    if (model.textures && Array.isArray(model.textures)) {
      result.textureCount = model.textures.length;
    } else if (model.textures && typeof model.textures === "object") {
      result.textureCount = Object.keys(model.textures).length;
    }
    const elements = model.elements || [];
    const groups = model.groups || [];
    const outliner = model.outliner || [];
    result.elementCount = elements.length + groups.length;
    result.cubeCount = elements.length;
    result.groupCount = groups.length;
    const nameSet = /* @__PURE__ */ new Set();
    function extractNames(item) {
      if (typeof item === "string") {
        return;
      }
      if (item && typeof item === "object") {
        if (item.name) nameSet.add(item.name);
        if (item.children && Array.isArray(item.children)) {
          item.children.forEach(extractNames);
        }
      }
    }
    outliner.forEach(extractNames);
    elements.forEach((el) => {
      if (el && el.name) nameSet.add(el.name);
    });
    groups.forEach((g) => {
      if (g && g.name) nameSet.add(g.name);
    });
    result.elementNames = Array.from(nameSet);
    const availableSlots = getActiveSlotNames();
    const detectedSlotsSet = /* @__PURE__ */ new Set();
    result.elementNames.forEach((name2) => {
      const suggested = suggestSlotFromName(name2, availableSlots);
      if (suggested) detectedSlotsSet.add(suggested);
    });
    result.detectedSlots = Array.from(detectedSlotsSet);
    return result;
  }
  function showClothingSlotDialog(inferredSlot, filePath, model) {
    return new Promise((resolve) => {
      const availableSlots = getActiveSlotNames();
      const fileName = filePath.split(/[/\\]/).pop() || "attachment";
      const preview = model ? analyzeImportPreview(model) : null;
      const rememberedSlot = getRememberedSlot(filePath);
      let defaultSlot = "";
      if (rememberedSlot && availableSlots.includes(rememberedSlot)) {
        defaultSlot = rememberedSlot;
      } else if (inferredSlot && availableSlots.includes(inferredSlot)) {
        defaultSlot = inferredSlot;
      } else if (preview && preview.detectedSlots.length > 0) {
        defaultSlot = preview.detectedSlots[0];
      }
      const options = {};
      availableSlots.forEach((slot) => {
        let label = slot;
        if (slot === rememberedSlot) label += " (remembered)";
        else if (slot === inferredSlot) label += " (detected from path)";
        else if (preview && preview.detectedSlots.includes(slot)) label += " (suggested)";
        options[slot] = label;
      });
      options[""] = "(None)";
      const previewHtml = preview ? `
            <div style="margin: 12px 0; padding: 12px; background: rgba(255, 255, 255, 0.05); border-radius: 4px;">
                <div style="font-weight: 500; margin-bottom: 8px;">Import Preview:</div>
                <div style="font-size: 12px; line-height: 1.6;">
                    <div>\u2022 ${preview.elementCount} element(s) (${preview.groupCount} groups, ${preview.cubeCount} cubes)</div>
                    <div>\u2022 ${preview.textureCount} texture(s)</div>
                    ${preview.detectedSlots.length > 0 ? `<div>\u2022 Detected slots: ${preview.detectedSlots.join(", ")}</div>` : ""}
                    ${preview.elementNames.length > 0 ? `<div style="margin-top: 8px; opacity: 0.8;">Elements: ${preview.elementNames.slice(0, 5).join(", ")}${preview.elementNames.length > 5 ? "..." : ""}</div>` : ""}
                </div>
            </div>
        ` : "";
      new Dialog({
        id: "clothing_slot_selector",
        title: "Import Attachment",
        component: {
          template: `
                    <div>
                        <p>Choose the clothing slot for imported elements from:</p>
                        <p style="font-weight: 500; margin: 8px 0;">${fileName}</p>
                        ${previewHtml}
                    </div>
                `
        },
        form: {
          clothing_slot: {
            label: "Clothing Slot",
            type: "select",
            options,
            value: defaultSlot
          },
          remember_choice: {
            label: "Remember this choice for similar files",
            type: "checkbox",
            value: !!rememberedSlot
          }
        },
        onConfirm(formData) {
          const selectedSlot = formData.clothing_slot;
          const rememberChoice = formData.remember_choice || false;
          if (rememberChoice && selectedSlot) {
            rememberSlot(filePath, selectedSlot);
          }
          resolve({
            slot: selectedSlot === "" ? null : selectedSlot,
            rememberChoice
          });
        },
        onCancel() {
          resolve({ slot: null, rememberChoice: false });
        }
      }).show();
    });
  }

  // src/util/outliner.ts
  function findGroupByName(name2, elements) {
    const target = (name2 || "").toLowerCase();
    if (!target) return null;
    for (const element of elements) {
      if (element instanceof Group) {
        if ((element.name || "").toLowerCase() === target) {
          return element;
        }
        const foundInChildren = findGroupByName(name2, element.children || []);
        if (foundInChildren) return foundInChildren;
      }
    }
    return null;
  }
  function findAllGroupsByName(name2, elements) {
    const target = (name2 || "").toLowerCase();
    if (!target) return [];
    const results = [];
    function search(elems) {
      for (const element of elems) {
        if (element instanceof Group) {
          if ((element.name || "").toLowerCase() === target) {
            results.push(element);
          }
          if (element.children && element.children.length) {
            search(element.children);
          }
        }
      }
    }
    search(elements);
    return results;
  }
  function stripNumericSuffix(name2) {
    if (!name2) return "";
    return name2.replace(/\d+$/, "");
  }
  function collectGroupsDepthFirst(elements, result = []) {
    for (const element of elements) {
      if (element instanceof Group) {
        result.push(element);
        if (element.children && element.children.length) {
          collectGroupsDepthFirst(element.children, result);
        }
      }
    }
    return result;
  }
  function isDescendantOf(node, possibleAncestor) {
    let current = node.parent;
    while (current) {
      if (current === possibleAncestor) return true;
      current = current.parent;
    }
    return false;
  }

  // src/attachments/post_import.ts
  var DEBUG4 = false;
  function findBestMatchingGroupBySlot(clothingSlot, groupName, existingElements) {
    if (!clothingSlot || !clothingSlot.trim()) return null;
    const normalizedSlot = clothingSlot.trim().toLowerCase();
    const normalizedName = groupName ? groupName.trim().toLowerCase() : "";
    let bestMatch = null;
    let exactNameMatch = null;
    function search(elements) {
      for (const element of elements) {
        if (element instanceof Group && existingElements.has(element)) {
          const elemSlot = (element.clothingSlot || "").trim().toLowerCase();
          if (elemSlot === normalizedSlot) {
            if (normalizedName && (element.name || "").trim().toLowerCase() === normalizedName) {
              exactNameMatch = element;
              return;
            }
            if (!bestMatch) bestMatch = element;
          }
        }
        if (element.children && element.children.length > 0) {
          search(element.children);
          if (exactNameMatch) return;
        }
      }
    }
    search(Outliner.root);
    return exactNameMatch || bestMatch;
  }
  function applyClothingSlot(newElements, slot, logPrefix) {
    if (DEBUG4) console.log(`[${logPrefix}] Applying slot "${slot}" to ${newElements.length} elements.`);
    const apply = (element) => {
      if (element instanceof Group || element instanceof Cube) {
        element.clothingSlot = slot;
      }
      if (element.children) {
        element.children.forEach(apply);
      }
    };
    const newElementsSet = new Set(newElements);
    const topLevel = newElements.filter((e) => !e.parent || !newElementsSet.has(e.parent));
    topLevel.forEach((element) => {
      apply(element);
      markAsRecentlyImported(element);
      element.children?.forEach((child) => markAsRecentlyImported(child));
    });
  }
  function isWithinStepParentAttachment(element, newElementsSet) {
    let current = element;
    while (current && newElementsSet.has(current)) {
      if (current.stepParentName?.trim()) return true;
      current = current.parent instanceof Group ? current.parent : null;
    }
    return false;
  }
  function mergePaletteSlot(source, target, logPrefix) {
    const sourceSlot = Number(source?.paletteSlot) || 0;
    const targetSlot = Number(target?.paletteSlot) || 0;
    if (sourceSlot === 0) return;
    if (targetSlot === 0) {
      target.paletteSlot = sourceSlot;
    } else if (targetSlot !== sourceSlot) {
      console.warn(`[${logPrefix}] Keeping paletteSlot ${targetSlot} on "${target.name}"; imported "${source.name}" requested ${sourceSlot}.`);
    }
  }
  function mergeNoOutline(source, target) {
    if (source.noOutline) {
      target.noOutline = true;
    }
  }
  function preserveInheritedPaletteOnChildren(source, children) {
    const sourceSlot = Number(source?.paletteSlot) || 0;
    if (sourceSlot === 0) return;
    children.forEach((child) => {
      if ((child instanceof Group || child instanceof Cube) && (Number(child.paletteSlot) || 0) === 0) {
        child.paletteSlot = sourceSlot;
      }
    });
  }
  function preserveInheritedNoOutlineOnChildren(source, children) {
    if (!source.noOutline) return;
    children.forEach((child) => {
      if ((child instanceof Group || child instanceof Cube) && !child.noOutline) {
        child.noOutline = true;
      }
    });
  }
  function materializePaletteInheritance(newElements, newElementsSet) {
    const roots = newElements.filter(
      (element) => (element instanceof Group || element instanceof Cube) && (!element.parent || !newElementsSet.has(element.parent))
    );
    const walk = (element, inheritedSlot) => {
      if (!(element instanceof Group || element instanceof Cube) || !newElementsSet.has(element)) return;
      const ownSlot = Number(element.paletteSlot) || 0;
      const effectiveSlot = ownSlot || inheritedSlot;
      if (ownSlot === 0 && inheritedSlot !== 0) {
        element.paletteSlot = inheritedSlot;
      }
      if (element instanceof Group) {
        element.children.forEach((child) => walk(child, effectiveSlot));
      }
    };
    roots.forEach((root) => walk(root, 0));
  }
  function materializeNoOutlineInheritance(newElements, newElementsSet) {
    const roots = newElements.filter(
      (element) => (element instanceof Group || element instanceof Cube) && (!element.parent || !newElementsSet.has(element.parent))
    );
    const walk = (element, inheritedNoOutline) => {
      if (!(element instanceof Group || element instanceof Cube) || !newElementsSet.has(element)) return;
      const ownNoOutline = element.noOutline === true;
      const effectiveNoOutline = ownNoOutline || inheritedNoOutline;
      if (!ownNoOutline && inheritedNoOutline) {
        element.noOutline = inheritedNoOutline;
      }
      if (element instanceof Group) {
        element.children.forEach((child) => walk(child, effectiveNoOutline));
      }
    };
    roots.forEach((root) => walk(root, false));
  }
  function smartMatchGroups(newElements, newElementsSet, existingElements, logPrefix) {
    const topLevelGroups = newElements.filter(
      (e) => e instanceof Group && (!e.parent || !newElementsSet.has(e.parent)) && !isWithinStepParentAttachment(e, newElementsSet)
    );
    let matchCount = 0;
    if (DEBUG4) console.log(`[${logPrefix}] Smart match: checking ${topLevelGroups.length} groups.`);
    for (const newGroup of topLevelGroups) {
      const slot = newGroup.clothingSlot?.trim();
      if (!slot) continue;
      const match = findBestMatchingGroupBySlot(slot, newGroup.name, existingElements);
      if (match) {
        if (DEBUG4) console.log(`[${logPrefix}] Matched "${newGroup.name}" -> "${match.name}" (slot: ${slot})`);
        mergePaletteSlot(newGroup, match, logPrefix);
        mergeNoOutline(newGroup, match);
        [...newGroup.children].forEach((child) => child.addTo(match));
        matchCount++;
        if (newGroup.children.length === 0) newGroup.remove();
      }
    }
    return matchCount;
  }
  function mergeHierarchicalGroups(newElements, newElementsSet, logPrefix) {
    if (DEBUG4) console.log(`[${logPrefix}] merging hierarchies.`);
    const allNewGroups = collectGroupsDepthFirst(newElements.filter((e) => e instanceof Group && newElementsSet.has(e)));
    for (let i = allNewGroups.length - 1; i >= 0; i--) {
      const newGroup = allNewGroups[i];
      if (!newElementsSet.has(newGroup)) continue;
      if (isWithinStepParentAttachment(newGroup, newElementsSet)) continue;
      const matches = findAllGroupsByName(newGroup.name, Outliner.root).filter((g) => !newElementsSet.has(g));
      if (matches.length > 0) {
        const target = matches[0];
        if (DEBUG4) console.log(`[${logPrefix}] Merging "${newGroup.name}" into "${target.name}"`);
        const movedChildren = [...newGroup.children];
        preserveInheritedPaletteOnChildren(newGroup, movedChildren);
        preserveInheritedNoOutlineOnChildren(newGroup, movedChildren);
        movedChildren.forEach((child) => child.addTo(target));
        if (newGroup.children.length === 0) {
          newGroup.remove();
          newElementsSet.delete(newGroup);
        }
      }
    }
  }
  function mergeGroupsByCommonSlot(newElements, newElementsSet, logPrefix) {
    if (DEBUG4) console.log(`[${logPrefix}] merging by common slot.`);
    const bySlot = /* @__PURE__ */ new Map();
    newElements.forEach((e) => {
      if (e instanceof Group && newElementsSet.has(e) && e.clothingSlot && !isWithinStepParentAttachment(e, newElementsSet)) {
        const slot = e.clothingSlot.trim();
        if (!bySlot.has(slot)) bySlot.set(slot, []);
        bySlot.get(slot).push(e);
      }
    });
    bySlot.forEach((groups, slot) => {
      if (groups.length < 2) return;
      groups.sort((a, b) => (a.name || "").length - (b.name || "").length);
      const base = groups[0];
      const baseName = (base.name || "").toLowerCase();
      if (!baseName) return;
      const targets = groups.slice(1).filter((g) => (g.name || "").toLowerCase().startsWith(baseName));
      if (targets.length === 0) return;
      const existMatches = findAllGroupsByName(base.name, Outliner.root).filter((g) => !newElementsSet.has(g));
      const finalTarget = existMatches[0] || base;
      if (finalTarget === base || !newElementsSet.has(finalTarget)) {
        targets.forEach((g) => {
          if (!newElementsSet.has(g)) return;
          if (DEBUG4) console.log(`[${logPrefix}] Merging "${g.name}" into "${finalTarget.name}" (slot: ${slot})`);
          mergePaletteSlot(g, finalTarget, logPrefix);
          mergeNoOutline(g, finalTarget);
          [...g.children].forEach((c) => c.addTo(finalTarget));
          if (g.children.length === 0) {
            g.remove();
            newElementsSet.delete(g);
          }
        });
      }
    });
  }
  function getElementBindRotation3(element) {
    const chain = [];
    let current = element;
    while (current instanceof Group || current instanceof Cube) {
      chain.unshift([...current.rotation || [0, 0, 0]]);
      current = current.parent;
    }
    return composeEulerXYZ(chain);
  }
  function isFiniteVector32(value) {
    return Array.isArray(value) && value.length === 3 && value.every((component) => typeof component === "number" && Number.isFinite(component));
  }
  function getSocketFrom2(group) {
    if (isFiniteVector32(group.vs_group_from)) return [...group.vs_group_from];
    const geoChild = group.children.find(
      (child) => child instanceof Cube && child.name === `${group.name}_geo`
    );
    return [...geoChild?.from || group.origin];
  }
  function translateVector(vector, delta) {
    if (!Array.isArray(vector) || vector.length < 3) return;
    vector[0] += delta[0];
    vector[1] += delta[1];
    vector[2] += delta[2];
  }
  function translateAttachmentSubtree(element, delta) {
    if (delta[0] === 0 && delta[1] === 0 && delta[2] === 0) return;
    if (element instanceof Group) {
      translateVector(element.origin, delta);
      translateVector(element.vs_group_from, delta);
      translateVector(element.vs_group_to, delta);
    } else if (element instanceof Cube) {
      translateVector(element.from, delta);
      translateVector(element.to, delta);
      translateVector(element.origin, delta);
    } else {
      translateVector(element?.from, delta);
    }
    element.children?.forEach((child) => translateAttachmentSubtree(child, delta));
  }
  function placeStepParentWrappers(newElements, newElementsSet, logPrefix) {
    if (DEBUG4) console.log(`[${logPrefix}] placing step-parent wrappers.`);
    newElements.forEach((element) => {
      const stepParent = element.stepParentName?.trim();
      if (!stepParent) return;
      if (!(element instanceof Group || element instanceof Cube)) return;
      if (element.vs_step_parent_local === true) {
        if (DEBUG4) console.log(`[${logPrefix}] Kept local wrapper "${element.name}" external to "${stepParent}".`);
        return;
      }
      const target = findAllGroupsByName(stepParent, Outliner.root).find(
        (group) => !newElementsSet.has(group) && group !== element && !isDescendantOf(group, element)
      );
      if (!target) {
        console.warn(`[${logPrefix}] Could not find external step parent "${stepParent}" for "${element.name}"; keeping its model-space transform.`);
        return;
      }
      const worldRotation = getElementBindRotation3(element);
      const liveSocketFrom = getSocketFrom2(target);
      const liveSocketRotation = getElementBindRotation3(target);
      const storedFrom = element.vs_step_parent_origin;
      const storedRotation = element.vs_step_parent_rotation;
      const hasStoredFrame = element.vs_has_step_parent_transform === true && isFiniteVector32(storedFrom) && isFiniteVector32(storedRotation);
      const authoredSocketFrom = hasStoredFrame ? [...storedFrom] : liveSocketFrom;
      const authoredSocketRotation = hasStoredFrame ? [...storedRotation] : liveSocketRotation;
      const localRotation = relativeEulerXYZ(worldRotation, authoredSocketRotation);
      const socketDelta = [
        liveSocketFrom[0] - authoredSocketFrom[0],
        liveSocketFrom[1] - authoredSocketFrom[1],
        liveSocketFrom[2] - authoredSocketFrom[2]
      ];
      translateAttachmentSubtree(element, socketDelta);
      element.rotation[0] = localRotation[0];
      element.rotation[1] = localRotation[1];
      element.rotation[2] = localRotation[2];
      element.vs_has_step_parent_transform = true;
      element.vs_step_parent_origin = [...liveSocketFrom];
      element.vs_step_parent_rotation = [...liveSocketRotation];
      if (element.parent !== target) {
        element.addTo(target);
      }
      if (DEBUG4) console.log(`[${logPrefix}] Placed "${element.name}" under "${target.name}" with local rotation [${localRotation.join(", ")}].`);
    });
  }
  function mergeDuplicateGroups(newElementsSet) {
    const toDelete = [];
    collectGroupsDepthFirst(Outliner.root).forEach((group) => {
      if (isWithinStepParentAttachment(group, newElementsSet)) return;
      const name2 = group.name || "";
      const base = stripNumericSuffix(name2);
      if (base !== name2 && base) {
        const original = findGroupByName(base, Outliner.root);
        if (original && original !== group) {
          [...group.children].forEach((child) => {
            if (child !== original && child.parent !== original && !isDescendantOf(original, child)) {
              child.addTo(original);
            }
          });
          toDelete.push(group);
        }
      }
    });
    toDelete.forEach((g) => g.remove());
  }
  async function processImportedAttachments(elementsBefore, filePath, logPrefix, model) {
    const elementsAfter = /* @__PURE__ */ new Set([...Group.all, ...Cube.all]);
    const newElements = [...elementsAfter].filter((e) => !elementsBefore.has(e));
    const newElementsSet = new Set(newElements);
    const inferred = inferClothingSlotFromPath(filePath);
    const result = await showClothingSlotDialog(inferred, filePath, model);
    const masterSlot = result.slot;
    if (!masterSlot) {
      if (DEBUG4) console.log(`[${logPrefix}] Import cancelled.`);
      newElements.forEach((e) => e.remove());
      Blockbench.showQuickMessage("Import cancelled", QUICK_MESSAGE_DURATION);
      return;
    }
    applyClothingSlot(newElements, masterSlot, logPrefix);
    materializePaletteInheritance(newElements, newElementsSet);
    materializeNoOutlineInheritance(newElements, newElementsSet);
    const matchCount = smartMatchGroups(newElements, newElementsSet, elementsBefore, logPrefix);
    if (matchCount > 0) {
      Blockbench.showQuickMessage(`Matched ${matchCount} groups`, QUICK_MESSAGE_DURATION);
    }
    mergeHierarchicalGroups(newElements, newElementsSet, logPrefix);
    mergeGroupsByCommonSlot(newElements, newElementsSet, logPrefix);
    placeStepParentWrappers(newElements, newElementsSet, logPrefix);
    mergeDuplicateGroups(newElementsSet);
    Undo.finishEdit(`Import attachment: ${filePath.split(/[/\\]/).pop()}`);
    Canvas.updateAll();
    if (typeof updateSelection === "function") updateSelection();
  }

  // src/attachments/texture_handler.ts
  init_util();

  // src/util/path.ts
  function extractFilename(pathOrLocation) {
    if (!pathOrLocation) return "";
    const normalized = pathOrLocation.replace(/\\/g, "/");
    const lastSegment = normalized.split("/").pop() || "";
    return lastSegment.replace(/\.[^.]+$/, "").toLowerCase();
  }

  // src/attachments/texture_handler.ts
  var DEBUG5 = false;
  function updateTextureUVSize(texture, name2, content) {
    if (content.textureSizes && content.textureSizes[name2]) {
      const [width, height] = content.textureSizes[name2];
      if (typeof width === "number" && typeof height === "number") {
        texture.uv_width = width;
        texture.uv_height = height;
        return true;
      }
    } else if (content.textureWidth && content.textureHeight) {
      texture.uv_width = content.textureWidth;
      texture.uv_height = content.textureHeight;
      return true;
    }
    return false;
  }
  function findExistingTextures(name2, textureLocation) {
    const normalizedLocation = textureLocation?.toLowerCase().replace(/\\/g, "/") || "";
    const locationFilename = extractFilename(textureLocation)?.toLowerCase() || "";
    const match = {};
    for (const texture of Texture.all) {
      if (match.byName && match.byLocation && match.byFilename) {
        break;
      }
      if (!match.byName && texture.name === name2) {
        match.byName = texture;
        continue;
      }
      if (!match.byLocation && normalizedLocation) {
        const texLoc = texture.textureLocation?.toLowerCase().replace(/\\/g, "/");
        if (texLoc && texLoc === normalizedLocation) {
          match.byLocation = texture;
        }
      }
      if (!match.byFilename && locationFilename) {
        const texName = (texture.name || "").toLowerCase().replace(/\.[^.]+$/, "");
        if (texName === locationFilename) {
          match.byFilename = texture;
          continue;
        }
        const pathFilename = texture.path ? extractFilename(texture.path)?.toLowerCase() : void 0;
        if (pathFilename === locationFilename) {
          match.byFilename = texture;
        }
      }
    }
    if (DEBUG5) {
      console.log(`[Import VS] Texture "${name2}" -> location: "${textureLocation}" (filename: "${locationFilename}")`);
      console.log(`[Import VS]   byName: ${match.byName?.name || "none"}`);
      console.log(`[Import VS]   byLocation: ${match.byLocation?.name || "none"}`);
      console.log(`[Import VS]   byFilename: ${match.byFilename?.name || "none"}`);
    }
    return match;
  }
  function createVSAttachmentTexture(name2, path7, textureLocation, content) {
    const texture = new Texture({ name: name2, path: path7 || void 0 }).add();
    texture.textureLocation = textureLocation;
    updateTextureUVSize(texture, name2, content);
    if (path7 && path7.length > 0 && !path7.startsWith("data:")) {
      texture.load();
    }
    return texture;
  }
  function handleExistingTextureByName(texture, name2, textureLocation, content, match) {
    if (!texture.textureLocation) {
      texture.textureLocation = textureLocation;
    }
    updateTextureUVSize(texture, name2, content);
    if (match.byLocation?.path) {
      texture.path = match.byLocation.path;
      texture.load();
    } else if (match.byFilename?.path) {
      texture.path = match.byFilename.path;
      texture.load();
    } else {
      const texturePath = get_texture_location(null, textureLocation);
      if (texturePath && texturePath.length > 0) {
        texture.path = texturePath;
        texture.load();
      }
    }
  }
  function handleExistingTextureByLocation(texture, name2, textureLocation, content) {
    if (texture.name === name2) {
      updateTextureUVSize(texture, name2, content);
    } else {
      createVSAttachmentTexture(name2, texture.path ?? "", textureLocation, content);
    }
  }
  function handleExistingTextureByFilename(texture, name2, textureLocation, locationFilename, content) {
    texture.name = name2;
    texture.textureLocation = textureLocation;
    updateTextureUVSize(texture, name2, content);
  }
  function handleVSTextures(content) {
    if (!content || !content.textures) {
      return;
    }
    for (const name2 in content.textures) {
      const textureLocation = content.textures[name2];
      if (!textureLocation || typeof textureLocation !== "string" || textureLocation.trim().length === 0) {
        continue;
      }
      const match = findExistingTextures(name2, textureLocation);
      const locationFilename = extractFilename(textureLocation) || "";
      if (match.byName) {
        handleExistingTextureByName(match.byName, name2, textureLocation, content, match);
      } else if (match.byLocation) {
        handleExistingTextureByLocation(match.byLocation, name2, textureLocation, content);
      } else if (match.byFilename) {
        handleExistingTextureByFilename(match.byFilename, name2, textureLocation, locationFilename, content);
      } else {
        const texturePath = get_texture_location(null, textureLocation);
        createVSAttachmentTexture(name2, texturePath, textureLocation, content);
      }
    }
  }

  // src/attachments/importer.ts
  var DEBUG6 = false;
  function logDebug2(message, ...args) {
    if (DEBUG6) console.log(message, ...args);
  }
  function isRecord(value) {
    return typeof value === "object" && value !== null;
  }
  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }
  function getErrorMessage(e) {
    if (e instanceof Error) return e.message;
    return String(e);
  }
  function buildUuidMap(items) {
    const map = /* @__PURE__ */ new Map();
    for (const item of asArray(items)) {
      const uuid = item.uuid;
      if (typeof uuid === "string") map.set(uuid, item);
    }
    return map;
  }
  function buildTextureMap(model) {
    const map = /* @__PURE__ */ new Map();
    for (const [oldIndex, texData] of asArray(model.textures).entries()) {
      const texName = typeof texData.name === "string" ? texData.name : void 0;
      const texPath = typeof texData.path === "string" ? texData.path : void 0;
      const existing = Texture.all.find(
        (t) => texName && t.name === texName || texPath && t.path && t.path === texPath
      );
      let texture = existing;
      if (!texture) {
        texture = new Texture(texData).add();
        if (typeof texData.textureLocation === "string") {
          texture.textureLocation = texData.textureLocation;
          logDebug2(`[Import BB] Set textureLocation: ${texData.textureLocation}`);
        }
        if (typeof texData.source === "string" && texData.source.length > 0) {
          texture.fromDataURL(texData.source);
          logDebug2(`[Import BB] Loaded texture from base64: ${texName ?? "(unnamed)"}`);
        } else if (typeof texPath === "string" && texPath.length > 0 && !texPath.startsWith("data:")) {
          texture.load();
          logDebug2(`[Import BB] Loaded texture from path: ${texName ?? texPath}`);
        }
        logDebug2(`[Import BB] Added texture: ${texName ?? "(unnamed)"}`);
      } else {
        if (typeof texData.uv_width === "number") texture.uv_width = texData.uv_width;
        if (typeof texData.uv_height === "number") texture.uv_height = texData.uv_height;
        if (typeof texData.textureLocation === "string" && !texture.textureLocation) {
          texture.textureLocation = texData.textureLocation;
          logDebug2(`[Import BB] Updated textureLocation: ${texData.textureLocation}`);
        }
        logDebug2(
          `[Import BB] Using existing texture: ${texture.name}, updated UV size to ${texture.uv_width}x${texture.uv_height}`
        );
      }
      map.set(oldIndex, texture);
      if (typeof texData.uuid === "string") map.set(texData.uuid, texture);
    }
    return map;
  }
  function remapCubeFaceTextures(cubeProps, textureMap) {
    const faces = cubeProps?.faces;
    if (!faces || !isRecord(faces)) return;
    for (const faceKey of Object.keys(faces)) {
      const face = faces[faceKey];
      if (!face || !isRecord(face)) continue;
      const textureRef = face.texture;
      if (textureRef === void 0 || textureRef === null) continue;
      const mapped = textureMap.get(textureRef);
      if (!mapped) continue;
      face.texture = mapped.uuid;
    }
  }
  function normalizePaletteSlot(value) {
    const slot = Number(value);
    return Number.isFinite(slot) && slot !== 0 ? slot : 0;
  }
  function createCubeFromElementData(elemData, parentGroup, textureMap, createdGroups, inheritedPaletteSlot = 0, inheritedNoOutline = false) {
    const cubeProps = { ...elemData };
    delete cubeProps.uuid;
    if (normalizePaletteSlot(cubeProps.paletteSlot) === 0 && inheritedPaletteSlot !== 0) {
      cubeProps.paletteSlot = inheritedPaletteSlot;
    }
    if (!cubeProps.noOutline && inheritedNoOutline) {
      cubeProps.noOutline = inheritedNoOutline;
    }
    remapCubeFaceTextures(cubeProps, textureMap);
    const cubeClothingSlot = cubeProps.clothingSlot;
    if (cubeClothingSlot && typeof cubeClothingSlot === "string" && cubeClothingSlot.trim() !== "") {
      let currentGroup = parentGroup;
      while (currentGroup && currentGroup instanceof Group && createdGroups.has(currentGroup)) {
        const existingSlot = currentGroup.clothingSlot;
        if (existingSlot && existingSlot.trim() !== "") {
          logDebug2(`[Import BB] Stopped propagation at group "${currentGroup.name}" which already has clothingSlot "${existingSlot}"`);
          break;
        }
        currentGroup.clothingSlot = cubeClothingSlot;
        logDebug2(`[Import BB] Propagated clothingSlot "${cubeClothingSlot}" from cube to group "${currentGroup.name}"`);
        currentGroup = currentGroup.parent;
      }
    }
    const cube = new Cube(cubeProps);
    cube.addTo(parentGroup).init();
    logDebug2(`[Import BB] Created cube: ${cube.name ?? "(unnamed)"}`);
  }
  function findExistingGroupByName(parentGroup, groupName) {
    if (!groupName) return null;
    const searchRoot = parentGroup ? parentGroup.children || [] : Outliner.root;
    for (const child of searchRoot) {
      if (child instanceof Group && (child.name || "").toLowerCase() === groupName.toLowerCase()) {
        return child;
      }
    }
    return null;
  }
  function getOrCreateGroup(groupSeed, parentGroup, createdGroups, inheritedPaletteSlot = 0, inheritedNoOutline = false) {
    const groupName = typeof groupSeed.name === "string" ? groupSeed.name : "";
    const hasExternalStepParent = typeof groupSeed.stepParentName === "string" && groupSeed.stepParentName.trim() !== "";
    const ownPaletteSlot = normalizePaletteSlot(groupSeed.paletteSlot);
    const childPaletteSlot = ownPaletteSlot || inheritedPaletteSlot;
    const ownNoOutline = groupSeed.noOutline === true;
    const childNoOutline = ownNoOutline || inheritedNoOutline;
    const existing = hasExternalStepParent ? null : findExistingGroupByName(parentGroup, groupName);
    if (existing) {
      logDebug2(`[Import BB] Merging into existing group: ${groupName}`);
      return { group: existing, childPaletteSlot, childNoOutline };
    }
    const groupProps = { ...groupSeed };
    delete groupProps.uuid;
    delete groupProps.children;
    if (ownPaletteSlot === 0 && inheritedPaletteSlot !== 0) {
      groupProps.paletteSlot = inheritedPaletteSlot;
    }
    if (!ownNoOutline && inheritedNoOutline) {
      groupProps.noOutline = inheritedNoOutline;
    }
    const group = new Group(groupProps);
    group.addTo(parentGroup).init();
    createdGroups.add(group);
    logDebug2(`[Import BB] Created new group: ${groupName || "(unnamed group)"}`);
    return { group, childPaletteSlot, childNoOutline };
  }
  function isCubeElement(value) {
    return isRecord(value) && typeof value.uuid === "string" && value.type === "cube";
  }
  function mergeVSAttachment(content, filePath) {
    const elementsBefore = /* @__PURE__ */ new Set([...Group.all, ...Cube.all]);
    handleVSTextures(content);
    import_model(content, false, filePath, { rootOffset: [0, 0, 0] });
    for (const element of [...Group.all, ...Cube.all]) {
      if (elementsBefore.has(element)) continue;
      const parentIsNew = element.parent instanceof Group && !elementsBefore.has(element.parent);
      if (!parentIsNew && element.stepParentName?.trim()) {
        element.vs_step_parent_local = true;
      }
    }
  }
  function mergeBBModel(content, _filePath) {
    try {
      if (!isRecord(content)) {
        Blockbench.showQuickMessage("Import failed: invalid .bbmodel content", 5e3);
        return;
      }
      const model = content;
      logDebug2(`[Import BB] Starting merge of .bbmodel attachment`);
      const textureMap = buildTextureMap(model);
      const elementByUuid = buildUuidMap(model.elements);
      const groupByUuid = buildUuidMap(model.groups);
      const createdGroups = /* @__PURE__ */ new Set();
      const processChildren = (children, parent, inheritedPaletteSlot = 0, inheritedNoOutline = false) => {
        for (const child of children) processOutlinerItem(child, parent, inheritedPaletteSlot, inheritedNoOutline);
      };
      const tryCreateCubeByUuid = (uuid, parent, inheritedPaletteSlot = 0, inheritedNoOutline = false) => {
        const elemData = elementByUuid.get(uuid);
        if (!isCubeElement(elemData)) return false;
        createCubeFromElementData(elemData, parent, textureMap, createdGroups, inheritedPaletteSlot, inheritedNoOutline);
        return true;
      };
      const tryProcessGroupByUuid = (uuid, node, parent, inheritedPaletteSlot = 0, inheritedNoOutline = false) => {
        const groupData = groupByUuid.get(uuid);
        if (!groupData) return false;
        const seed = { ...groupData, ...node };
        const { group: targetGroup, childPaletteSlot, childNoOutline } = getOrCreateGroup(seed, parent, createdGroups, inheritedPaletteSlot, inheritedNoOutline);
        const children = asArray(node.children);
        processChildren(children, targetGroup, childPaletteSlot, childNoOutline);
        return true;
      };
      const processUuidStringItem = (uuid, parent, inheritedPaletteSlot = 0, inheritedNoOutline = false) => {
        if (tryCreateCubeByUuid(uuid, parent, inheritedPaletteSlot, inheritedNoOutline)) return;
      };
      const processInlineGroupNode = (node, parent, inheritedPaletteSlot = 0, inheritedNoOutline = false) => {
        const { group: targetGroup, childPaletteSlot, childNoOutline } = getOrCreateGroup(node, parent, createdGroups, inheritedPaletteSlot, inheritedNoOutline);
        const children = asArray(node.children);
        processChildren(children, targetGroup, childPaletteSlot, childNoOutline);
      };
      const processObjectNode = (node, parent, inheritedPaletteSlot = 0, inheritedNoOutline = false) => {
        const uuid = typeof node.uuid === "string" ? node.uuid : void 0;
        if (uuid) {
          if (tryCreateCubeByUuid(uuid, parent, inheritedPaletteSlot, inheritedNoOutline)) return;
          if (tryProcessGroupByUuid(uuid, node, parent, inheritedPaletteSlot, inheritedNoOutline)) return;
        }
        processInlineGroupNode(node, parent, inheritedPaletteSlot, inheritedNoOutline);
      };
      const processOutlinerItem = (item, parent, inheritedPaletteSlot = 0, inheritedNoOutline = false) => {
        if (typeof item === "string") return processUuidStringItem(item, parent, inheritedPaletteSlot, inheritedNoOutline);
        if (!isRecord(item)) return;
        return processObjectNode(item, parent, inheritedPaletteSlot, inheritedNoOutline);
      };
      for (const item of asArray(model.outliner)) {
        processOutlinerItem(item, null);
      }
      Canvas.updateAll();
      logDebug2(`[Import BB] Merge complete. Groups: ${Group.all.length}, Cubes: ${Cube.all.length}`);
    } catch (e) {
      console.error("[Import BB] CRITICAL ERROR in mergeBBModel:", e);
      Blockbench.showQuickMessage(`Import failed: ${getErrorMessage(e)}`, 5e3);
    }
  }

  // src/attachments/actions.ts
  var DEBUG7 = false;
  function logDebug3(message, ...args) {
    if (DEBUG7) console.log(message, ...args);
  }
  function createImportAction(config) {
    return new Action(config.id, {
      name: config.name,
      icon: config.icon,
      category: "file",
      description: config.description,
      condition: { formats: ["formatVS"] },
      click: () => {
        Blockbench.import({
          resource_id: config.resource_id,
          extensions: config.extensions,
          type: config.type,
          multiple: true
        }, function(files) {
          if (!files || !files.length) return;
          Undo.initEdit({ outliner: true });
          const elementsBefore = /* @__PURE__ */ new Set([...Group.all, ...Cube.all]);
          files.forEach((file) => {
            try {
              const cleanedContent = cleanJSONString(file.content);
              const model = autoParseJSON(cleanedContent);
              if (!model || typeof model !== "object") {
                if (DEBUG7) console.error(`[${config.logPrefix}] Invalid model data in file:`, file.path);
                Blockbench.showQuickMessage(`Failed to import ${file.name}: Invalid JSON structure`, QUICK_MESSAGE_DURATION);
                return;
              }
              if (model.animations && Array.isArray(model.animations) && model.animations.length > 0) {
                logDebug3(`[${config.logPrefix}] Skipping`, model.animations.length, "animations from attachment file");
                delete model.animations;
              }
              config.mergeFn(model, file.path);
            } catch (err) {
              if (DEBUG7) console.error(`[${config.logPrefix}] Error importing file:`, file.path, err);
              const errorMsg = err instanceof Error ? err.message : String(err);
              Blockbench.showQuickMessage(`Failed to import ${file.name}: ${errorMsg}`, QUICK_MESSAGE_DURATION);
            }
          });
          const currentProject = Project;
          let firstModel = null;
          if (files.length > 0) {
            try {
              const cleanedContent = cleanJSONString(files[0].content);
              firstModel = autoParseJSON(cleanedContent);
            } catch (e) {
              if (DEBUG7) console.warn(`[${config.logPrefix}] Could not parse model for preview:`, e);
            }
          }
          setTimeout(async () => {
            if (!currentProject || Project !== currentProject) {
              if (DEBUG7) console.warn(`[${config.logPrefix}] Project changed or closed, skipping post-import processing`);
              return;
            }
            await processImportedAttachments(elementsBefore, files[0].path, config.logPrefix, firstModel);
          }, IMPORT_SETTLE_DELAY);
        });
      }
    });
  }
  function createActions() {
    const codec = createExportCodec();
    const importBBAction = createImportAction({
      id: "import_bb_attachment",
      name: "Import BB Attachment",
      description: "Import and automatically parent a .bbmodel attachment file",
      icon: "fa-file-import",
      resource_id: "model",
      extensions: [codec.extension],
      type: codec.name,
      logPrefix: "Import BB",
      mergeFn: (model, filePath) => mergeBBModel(model, filePath)
    });
    const importVSAction = createImportAction({
      id: "import_vs_attachment",
      name: "Import VS Attachment",
      description: "Import and automatically parent a .json attachment file",
      icon: "fa-file-import",
      extensions: ["json"],
      type: "Vintage Story Shape",
      logPrefix: "Import VS",
      mergeFn: (model, filePath) => mergeVSAttachment(model, filePath)
    });
    return {
      importBB: importBBAction,
      importVS: importVSAction
    };
  }

  // src/attachments.ts
  var deletables = [];
  var eventListeners = [];
  function init() {
    console.log("Initializing attachments module with in-memory storage...");
    const actions = createActions();
    const panel2 = createAttachmentsPanel(actions);
    deletables.push(actions.importBB, actions.importVS, panel2);
    const attachment_mode = new Mode("attachments", {
      name: "Attachments",
      condition: { formats: ["formatVS"] },
      onSelect: () => {
        panel2.moveTo("right_bar", Panels.vs_face_properties, true);
        findAttachments();
      }
    });
    deletables.push(attachment_mode);
    const loadProjectListener = () => {
      console.log("LOAD PROJECT EVENT TRIGGERED");
      setTimeout(() => {
        console.log("Load project timeout - finding attachments");
        findAttachments();
      }, 100);
    };
    const updateOutlinerListener = () => {
      console.log("\u{1F4DD} OUTLINER UPDATE EVENT TRIGGERED");
      findAttachments();
    };
    const addGroupListener = () => {
      console.log("\u2795 ADD GROUP EVENT TRIGGERED");
      findAttachments();
    };
    Blockbench.on("load_project", loadProjectListener);
    Blockbench.on("update_outliner", updateOutlinerListener);
    Blockbench.on("add_group", addGroupListener);
    eventListeners.push(
      { event: "load_project", listener: loadProjectListener },
      { event: "update_outliner", listener: updateOutlinerListener },
      { event: "add_group", listener: addGroupListener }
    );
    window.debugFindAttachments = () => {
      console.log("Manual debug trigger");
      findAttachments();
    };
    console.log("Attachments module initialized successfully");
    console.log("Available debug functions:");
    console.log("- window.debugFindAttachments() - manually trigger attachment search");
  }
  function cleanup() {
    console.log("Attachments module cleaning up...");
    const failures = [];
    deletables = deletables.filter((item) => {
      try {
        item.delete();
        return false;
      } catch (error) {
        failures.push({ resource: item, error });
        return true;
      }
    });
    eventListeners = eventListeners.filter(({ event, listener }) => {
      try {
        Blockbench.removeListener(event, listener);
        console.log(`Removed ${event} listener`);
        return false;
      } catch (error) {
        failures.push({ resource: event, error });
        return true;
      }
    });
    if (window.debugFindAttachments) {
      delete window.debugFindAttachments;
    }
    if (failures.length) {
      console.error("Attachments module cleanup incomplete:", failures);
      Blockbench.showQuickMessage("Could not fully unload attachments. Restart Blockbench to finish cleanup.", 5e3);
      return false;
    }
    console.log("Attachments module cleanup complete");
    return true;
  }
  var attachments = {
    init,
    cleanup,
    isAttachment
  };

  // src/mods/attachmentsMod.ts
  events.LOAD.subscribe(() => {
    attachments.init();
  });
  events.UNLOAD.subscribe(() => {
    attachments.cleanup();
  });

  // src/panels/vs_face_panel.ts
  var WIND_MODE_OPTIONS = {
    "-1": "Default",
    "0": "NoWind",
    "1": "WeakWind",
    "2": "NormalWind",
    "3": "Leaves",
    "4": "Bend",
    "5": "TallBend",
    "6": "Water",
    "7": "ExtraWeakWind",
    "8": "Fruit",
    "9": "WeakWindNoBend",
    "10": "Vines",
    "11": "Seaweed",
    "12": "WaterWaves",
    "13": "WeakWindReducedAlpha"
  };
  var REFLECTIVE_MODE_OPTIONS = {
    "0": "Not reflective",
    "1": "Weakly random reflective",
    "2": "Weakly reflective",
    "3": "Strongly reflective",
    "4": "Sparkly",
    "5": "Mild"
  };
  var FACE_DIRECTIONS = ["north", "east", "south", "west", "up", "down"];
  var FACE_LABELS = {
    north: "N",
    east: "E",
    south: "S",
    west: "W",
    up: "U",
    down: "D"
  };
  var FACE_COLORS = {
    north: "rgb(143,154,204)",
    east: "rgb(204,143,143)",
    south: "rgb(143,154,204)",
    west: "rgb(204,143,143)",
    up: "rgb(187,255,179)",
    down: "rgb(131,179,125)"
  };
  function getFaceVertices(cube, direction) {
    const [x1, y1, z1] = cube.from;
    const [x2, y2, z2] = cube.to;
    switch (direction) {
      case "north":
        return [[x1, y1, z1], [x1, y2, z1], [x2, y2, z1], [x2, y1, z1]];
      case "east":
        return [[x2, y1, z1], [x2, y2, z1], [x2, y2, z2], [x2, y1, z2]];
      case "south":
        return [[x1, y1, z2], [x2, y1, z2], [x2, y2, z2], [x1, y2, z2]];
      case "west":
        return [[x1, y1, z1], [x1, y1, z2], [x1, y2, z2], [x1, y2, z1]];
      case "up":
        return [[x1, y2, z1], [x1, y2, z2], [x2, y2, z2], [x2, y2, z1]];
      case "down":
        return [[x1, y1, z1], [x2, y1, z1], [x2, y1, z2], [x1, y1, z2]];
      default:
        return [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
    }
  }
  function computeWindData(cube, direction) {
    const vertices = getFaceVertices(cube, direction);
    const result = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      const pos = vertices[i];
      const localPos = new THREE.Vector3(
        pos[0] - cube.origin[0],
        pos[1] - cube.origin[1],
        pos[2] - cube.origin[2]
      );
      if (cube.mesh) {
        cube.mesh.updateMatrixWorld();
        const worldPos = cube.mesh.localToWorld(localPos);
        result[i] = Math.trunc(worldPos.y / 16);
      } else {
        result[i] = Math.trunc(pos[1] / 16);
      }
    }
    return result;
  }
  var vertexDot = null;
  function createVertexDot() {
    if (vertexDot) return vertexDot;
    const geo = new THREE.SphereGeometry(0.5, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 16729156, depthTest: false, transparent: true, opacity: 0.9 });
    vertexDot = new THREE.Mesh(geo, mat);
    vertexDot.renderOrder = 999;
    vertexDot.visible = false;
    return vertexDot;
  }
  function showVertexDot(cube, direction, vertexIndex) {
    const dot = createVertexDot();
    const vertices = getFaceVertices(cube, direction);
    const pos = vertices[vertexIndex];
    if (!pos) return;
    const localPos = new THREE.Vector3(
      pos[0] - cube.origin[0],
      pos[1] - cube.origin[1],
      pos[2] - cube.origin[2]
    );
    if (cube.mesh) {
      cube.mesh.updateMatrixWorld();
      const worldPos = cube.mesh.localToWorld(localPos);
      dot.position.copy(worldPos);
    } else {
      dot.position.set(pos[0], pos[1], pos[2]);
    }
    dot.visible = true;
    if (!dot.parent) {
      Canvas.scene.add(dot);
    }
  }
  function hideVertexDot() {
    if (vertexDot) {
      vertexDot.visible = false;
    }
  }
  function removeVertexDot() {
    if (vertexDot) {
      if (vertexDot.parent) vertexDot.parent.remove(vertexDot);
      vertexDot.geometry.dispose();
      vertexDot.material.dispose();
      vertexDot = null;
    }
  }
  function createFacePanelData() {
    return {
      selectedCube: null,
      selectedFaceName: "north",
      applyToAll: false,
      glow: 0,
      reflectiveMode: "0",
      windMode: [-1, -1, -1, -1],
      windData: [0, 0, 0, 0],
      windModeOptions: WIND_MODE_OPTIONS,
      reflectiveModeOptions: REFLECTIVE_MODE_OPTIONS,
      faceDirections: FACE_DIRECTIONS,
      faceLabels: FACE_LABELS,
      faceColors: FACE_COLORS,
      _listeners: []
    };
  }
  var vueComponent = {
    template: `
        <div>
            <p v-if="!selectedCube" class="vs_fp_message">Select a cube to edit face properties</p>
            <div v-else>
                <div class="vs_fp_header">
                    <div class="vs_fp_face_buttons">
                        <div v-for="dir in faceDirections" :key="dir"
                            class="vs_fp_face_btn" :class="{ active: selectedFaceName === dir }"
                            :style="{ '--face-color': faceColors[dir] }"
                            @click="selectFace(dir)">{{ faceLabels[dir] }}</div>
                    </div>
                    <label class="vs_fp_apply_all">
                        <input type="checkbox" v-model="applyToAll"> All
                    </label>
                </div>

                <div class="vs_fp_section">
                    <label class="vs_fp_label">Glow Level (0-255)</label>
                    <input type="number" class="dark_bordered" min="0" max="255" step="1"
                        :value="glow" @input="setGlow($event.target.value)">
                </div>

                <div class="vs_fp_section">
                    <label class="vs_fp_label">Reflective Mode</label>
                    <select class="dark_bordered" :value="reflectiveMode" @change="setReflectiveMode($event.target.value)">
                        <option v-for="(label, value) in reflectiveModeOptions" :value="value" :key="value">{{ label }}</option>
                    </select>
                </div>

                <div class="vs_fp_section" v-for="i in 4" :key="'wm'+i">
                    <label class="vs_fp_label">Wind Mode {{ i }}</label>
                    <select class="dark_bordered" :value="getWindModeComponent(i-1)" @change="setWindModeComponent(i-1, $event.target.value)"
                        @mouseenter="highlightVertex(i-1)" @mouseleave="clearVertex()"
                        @focus="highlightVertex(i-1)" @blur="clearVertex()">
                        <option v-for="(label, value) in windModeOptions" :value="value" :key="value">{{ label }}</option>
                    </select>
                </div>

                <div class="vs_fp_section">
                    <label class="vs_fp_label">Wind Data</label>
                    <input type="text" class="dark_bordered" :value="windDataDisplay" disabled>
                </div>
            </div>
        </div>
    `,
    data: createFacePanelData,
    computed: {
      windDataDisplay() {
        return this.windData.join(", ");
      }
    },
    methods: {
      getSelectedFace() {
        if (!this.selectedCube || !this.selectedFaceName) return null;
        return this.selectedCube.faces[this.selectedFaceName];
      },
      getTargetFaces() {
        const cube = this.selectedCube;
        if (!cube) return [];
        if (this.applyToAll) {
          return FACE_DIRECTIONS.filter((d) => cube.faces[d]).map((d) => ({ face: cube.faces[d], direction: d }));
        }
        const face = this.getSelectedFace();
        if (!face) return [];
        return [{ face, direction: this.selectedFaceName }];
      },
      selectFace(direction) {
        this.selectedFaceName = direction;
        this.loadFromFace();
      },
      highlightVertex(index) {
        if (this.selectedCube && this.selectedFaceName) {
          showVertexDot(this.selectedCube, this.selectedFaceName, index);
        }
      },
      clearVertex() {
        hideVertexDot();
      },
      setGlow(value) {
        const num = Math.max(0, Math.min(255, parseInt(value) || 0));
        this.glow = num;
        for (const { face } of this.getTargetFaces()) {
          face.glow = num;
        }
      },
      setReflectiveMode(value) {
        const num = parseInt(value) || 0;
        this.reflectiveMode = String(num);
        for (const { face } of this.getTargetFaces()) {
          face.reflectiveMode = num;
        }
      },
      getWindModeComponent(index) {
        return String(this.windMode[index] ?? -1);
      },
      setWindModeComponent(index, value) {
        const num = parseInt(value);
        this.windMode[index] = num;
        this.windMode = [...this.windMode];
        for (const { face, direction } of this.getTargetFaces()) {
          if (!face.windMode) {
            face.windMode = [-1, -1, -1, -1];
          }
          face.windMode[index] = num;
          if (this.selectedCube) {
            const autoData = computeWindData(this.selectedCube, direction);
            if (autoData[0] !== 0 || autoData[1] !== 0 || autoData[2] !== 0 || autoData[3] !== 0) {
              face.windData = autoData;
            } else {
              face.windData = void 0;
            }
          }
          if (face.windMode.every((v) => v === -1)) {
            face.windMode = void 0;
            face.windData = void 0;
          }
        }
        this.updateWindDataDisplay();
      },
      updateWindDataDisplay() {
        const face = this.getSelectedFace();
        if (face && face.windData) {
          this.windData = [...face.windData];
        } else if (this.selectedCube && this.selectedFaceName) {
          this.windData = computeWindData(this.selectedCube, this.selectedFaceName);
        } else {
          this.windData = [0, 0, 0, 0];
        }
      },
      loadFromFace() {
        const face = this.getSelectedFace();
        if (!face) {
          this.glow = 0;
          this.reflectiveMode = "0";
          this.windMode = [-1, -1, -1, -1];
          this.windData = [0, 0, 0, 0];
          return;
        }
        this.glow = face.glow || 0;
        this.reflectiveMode = String(face.reflectiveMode || 0);
        this.windMode = face.windMode ? [...face.windMode] : [-1, -1, -1, -1];
        this.updateWindDataDisplay();
      },
      updateSelection() {
        hideVertexDot();
        const selected = Cube.selected;
        if (!selected || selected.length === 0) {
          this.selectedCube = null;
          this.selectedFaceName = "north";
          return;
        }
        this.selectedCube = selected[0];
        this.loadFromFace();
      }
    },
    mounted() {
      this.updateSelection();
      const onSelectionUpdate = () => this.updateSelection();
      Blockbench.on("update_selection", onSelectionUpdate);
      this._listeners = [
        () => Blockbench.removeListener("update_selection", onSelectionUpdate)
      ];
    },
    beforeDestroy() {
      hideVertexDot();
      for (const unsub of this._listeners) {
        unsub();
      }
    }
  };
  var panel = null;
  createBlockbenchMod(
    `${name}:vs_face_panel`,
    {},
    () => {
      panel = new Panel("vs_face_properties", {
        id: "vs_face_properties",
        name: "VS Face Properties",
        icon: "grain",
        expand_button: false,
        default_side: "right",
        condition: () => Format?.id === "formatVS",
        default_position: {
          slot: "right_bar",
          float_position: [0, 0],
          float_size: [300, 300],
          height: 300,
          folded: false
        },
        component: vueComponent
      });
      const style = document.createElement("style");
      style.id = "vs-face-panel-styles";
      style.textContent = `
            .vs_fp_message {
                padding: 8px;
                color: var(--color-subtle_text);
                text-align: center;
            }
            .vs_fp_header {
                display: flex;
                align-items: center;
                padding: 4px 8px;
                border-bottom: 1px solid var(--color-border);
                margin-bottom: 6px;
                gap: 6px;
            }
            .vs_fp_face_buttons {
                display: flex;
                gap: 2px;
                flex: 1;
            }
            .vs_fp_face_btn {
                flex: 1;
                text-align: center;
                padding: 3px 0;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
                border-radius: 3px;
                color: var(--face-color);
                background: var(--color-back);
                border: 1px solid var(--color-border);
                transition: background 0.1s;
            }
            .vs_fp_face_btn:hover {
                background: var(--color-button);
            }
            .vs_fp_face_btn.active {
                background: var(--color-button);
                border-color: var(--face-color);
                box-shadow: 0 0 0 1px var(--face-color);
            }
            .vs_fp_apply_all {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 12px;
                cursor: pointer;
                white-space: nowrap;
            }
            .vs_fp_section {
                padding: 2px 8px;
                margin-bottom: 4px;
            }
            .vs_fp_label {
                display: block;
                font-size: 12px;
                color: var(--color-subtle_text);
                margin-bottom: 2px;
            }
            .vs_fp_section input[type="number"],
            .vs_fp_section input[type="text"],
            .vs_fp_section select {
                width: 100%;
                box-sizing: border-box;
            }
        `;
      document.head.appendChild(style);
      return { panel, style };
    },
    (context) => {
      context.panel?.delete();
      removeVertexDot();
      const style = document.getElementById("vs-face-panel-styles");
      if (style) style.remove();
    }
  );

  // src/vintagestory.ts
  BBPlugin.register(package_default.name, {
    title: package_default.title,
    icon: "icon.png",
    author: package_default.author.name,
    contributors: package_default.contributors.map((x) => x.name),
    description: package_default.description,
    version: package_default.version,
    variant: "desktop",
    min_version: "5.0.0",
    repository: package_default.repository.url,
    tags: ["Vintage Story"],
    onload() {
      events.LOAD.dispatch();
    },
    onunload() {
      events.UNLOAD.dispatch();
    },
    oninstall() {
      events.INSTALL.dispatch();
    },
    onuninstall() {
      events.UNINSTALL.dispatch();
    }
  });
})();
