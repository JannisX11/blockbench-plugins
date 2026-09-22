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
  var fs, path, fps, get_texture_location;
  var init_util = __esm({
    "src/util.ts"() {
      fs = __toESM(__require("fs"), 1);
      path = __toESM(__require("path"), 1);
      fps = 30;
      get_texture_location = function(domain, rel_path) {
        for (const base_mod_path of ["creative", "game", "survival"]) {
          const f = path.posix.format({
            root: Settings.get("game_path") + path.sep + "assets" + path.sep + base_mod_path + path.sep + "textures" + path.sep,
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
      var JSON54 = {
        parse,
        stringify
      };
      module.exports = JSON54;
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
      attachmentPoints.push(attachmentPoint);
    }
    return attachmentPoints;
  }
  var init_locator = __esm({
    "src/export_model/locator.ts"() {
      init_util();
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
        constructor(env2) {
          var _a;
          this.refs = {};
          this.dynamicAnchors = {};
          let schema2;
          if (typeof env2.schema == "object")
            schema2 = env2.schema;
          this.schema = env2.schema;
          this.schemaId = env2.schemaId;
          this.root = env2.root || this;
          this.baseId = (_a = env2.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema2 === null || schema2 === void 0 ? void 0 : schema2[env2.schemaId || "$id"]);
          this.schemaPath = env2.schemaPath;
          this.localRefs = env2.localRefs;
          this.meta = env2.meta;
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
        let env2;
        if (typeof schema2 != "boolean" && schema2.$ref && !(0, util_1.schemaHasRulesButRef)(schema2, this.RULES)) {
          const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema2.$ref);
          env2 = resolveSchema.call(this, root, $ref);
        }
        const { schemaId } = this.opts;
        env2 = env2 || new SchemaEnv({ schema: schema2, schemaId, root, baseId });
        if (env2.schema !== env2.root.schema)
          return env2;
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
          const [path8, query] = wsComponents.resourceName.split("?");
          wsComponents.path = path8 && path8 !== "/" ? path8 : void 0;
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
          const { baseId, schemaEnv: env2, validateName, opts, self } = it;
          const { root } = env2;
          if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
            return callRootRef();
          const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
          if (schOrEnv === void 0)
            throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
          if (schOrEnv instanceof compile_1.SchemaEnv)
            return callValidate(schOrEnv);
          return inlineRefSchema(schOrEnv);
          function callRootRef() {
            if (env2 === root)
              return callRef(cxt, validateName, env2, env2.$async);
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
        const { allErrors, schemaEnv: env2, opts } = it;
        const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
        if ($async)
          callAsyncRef();
        else
          callSyncRef();
        function callAsyncRef() {
          if (!env2.$async)
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
    version: "0.12.1",
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
  var path2 = requireNativeModule("path");
  var fs2 = requireNativeModule("fs");
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
          const test_files = fs2.readdirSync(test_folder, { encoding: "utf-8" });
          for (const test_file of test_files) {
            if (!test_file.endsWith(".json") || test_file.startsWith("reexport_")) continue;
            const input_path = path2.resolve(test_folder, test_file);
            const output_path = path2.resolve(test_folder, `reexport_${test_file}`);
            if (!fs2?.statSync(input_path).isFile()) continue;
            console.log(`Processing: ${input_path} \u2192 ${output_path}`);
            try {
              Blockbench.readFile([input_path], {}, (files) => {
                try {
                  loadModelFile(files[0], []);
                  const reexport_content = Format.codec.compile();
                  fs2.writeFileSync(output_path, reexport_content, "utf-8");
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
  function deepCompare(a, b, path8) {
    const diffs = [];
    if (a === b) return diffs;
    if (a === void 0 && b === void 0) return diffs;
    if (a === null && b === null) return diffs;
    if (a == null || b == null) {
      diffs.push(`${path8}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
      return diffs;
    }
    if (typeof a === "number" && typeof b === "number") {
      if (Math.abs(a - b) > FLOAT_EPSILON) {
        diffs.push(`${path8}: ${a} vs ${b}`);
      }
      return diffs;
    }
    if (typeof a !== typeof b) {
      diffs.push(`${path8}: type ${typeof a} vs ${typeof b} (${JSON.stringify(a)} vs ${JSON.stringify(b)})`);
      return diffs;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      const maxLen = Math.max(a.length, b.length);
      if (a.length !== b.length) {
        diffs.push(`${path8}: array length ${a.length} vs ${b.length}`);
      }
      for (let i = 0; i < maxLen; i++) {
        diffs.push(...deepCompare(a[i], b[i], `${path8}[${i}]`));
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
        diffs.push(...deepCompare(aObj[key], bObj[key], `${path8}.${key}`));
      }
      return diffs;
    }
    if (typeof a === "string" && typeof b === "string") {
      const aNum = Number(a);
      const bNum = Number(b);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        if (Math.abs(aNum - bNum) > FLOAT_EPSILON) {
          diffs.push(`${path8}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
        }
        return diffs;
      }
    }
    if (a !== b) {
      diffs.push(`${path8}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
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
          const test_files = fs2.readdirSync(test_folder, { encoding: "utf-8" });
          let totalFiles = 0;
          let filesWithDiffs = 0;
          let totalDiffs = 0;
          for (const test_file of test_files) {
            if (!test_file.endsWith(".json") || test_file.includes("reexport_")) continue;
            const input_path = path2.resolve(test_folder, test_file);
            if (!fs2.statSync(input_path).isFile()) continue;
            try {
              const originalContent = fs2.readFileSync(input_path, "utf-8");
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
                  filesWithDiffs++;
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

  // src/actions.ts
  init_util();

  // src/import.ts
  init_util();

  // src/import_model/group.ts
  init_util();

  // src/property.ts
  var VS_PROJECT_PROPS = [
    new Property(ModelProject, "string", "backDropShape", { exposed: false }),
    new Property(ModelProject, "string", "collapsedPaths", { exposed: false }),
    new Property(ModelProject, "boolean", "allAngles", { exposed: false }),
    new Property(ModelProject, "boolean", "entityTextureMode", { exposed: false }),
    new Property(ModelProject, "boolean", "singleTexture", { exposed: false }),
    new Property(ModelProject, "boolean", "vsFormatConverted", { exposed: false })
  ];
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
  var PALETTE_SLOT_OPTIONS = {
    "0": "0 - Inherit / Default",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7"
  };
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
  var VS_GROUP_PROPS = [
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
    registerPaletteSlotProperty(Group)
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
  var VS_CUBE_PROPS = [
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
  var VS_TEXTURE_PROPS = [
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
  var VS_LOCATOR_PROPS = [
    new Property(Locator, "number", "rotationX", { default: 0 }),
    new Property(Locator, "number", "rotationY", { default: 0 }),
    new Property(Locator, "number", "rotationZ", { default: 0 })
  ];
  var VS_FACE_PROPS = [
    // @ts-expect-error: CubeFace is not in blockbench types for Property
    new Property(CubeFace, "number", "glow"),
    // @ts-expect-error: CubeFace is not in blockbench types for Property
    new Property(CubeFace, "number", "reflectiveMode"),
    // @ts-expect-error: CubeFace is not in blockbench types for Property
    new Property(CubeFace, "array", "windMode"),
    // @ts-expect-error: CubeFace is not in blockbench types for Property
    new Property(CubeFace, "array", "windData"),
    // @ts-expect-error: CubeFace is not in blockbench types for Property
    new Property(CubeFace, "boolean", "autoUv", { default: false }),
    // @ts-expect-error: CubeFace is not in blockbench types for Property
    new Property(CubeFace, "boolean", "snapUv", { default: false })
  ];

  // src/import_model/locator.ts
  init_util();
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
      origin: vsElement.rotationOrigin ? vector_add(vsElement.rotationOrigin, object_space_pos) : absolute_from,
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
  function create_cube(object_space_pos, vsElement, faces) {
    const cube_options = {
      name: vsElement.name,
      from: vector_add(vsElement.from, object_space_pos),
      to: vector_add(vsElement.to, object_space_pos),
      uv_offset: vsElement.uv,
      shade: vsElement.shade ?? true,
      rotation: [vsElement.rotationX || 0, vsElement.rotationY || 0, vsElement.rotationZ || 0],
      origin: vsElement.rotationOrigin ? vector_add(vsElement.rotationOrigin, object_space_pos) : vector_add(vsElement.from, object_space_pos),
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
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      to: vector_sub(complex.to, complex.from),
      stepParentName: void 0,
      paletteSlot: void 0,
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
  function create_animation(vsAnimation, path8, saved_name) {
    const FPS = fps;
    const animationLength = vsAnimation.quantityframes / FPS;
    const isLooping = vsAnimation.onAnimationEnd === "Repeat";
    const animation = new Animation({
      //@ts-expect-error: Blockbench overwrites libdom's Animation type with its own Animation Class, but TypeScript doesn't include a way to overwrite UMD global types.
      name: vsAnimation.name,
      loop: isLooping ? "loop" : vsAnimation.onAnimationEnd === "Hold" ? "hold" : "once",
      length: animationLength,
      snapping: FPS
    }).add();
    if (path8) animation.path = path8;
    if (saved_name) {
      animation.saved_name = saved_name;
      animation.saved = true;
    }
    animation.vs_code = vsAnimation.code;
    animation.vs_onActivityStopped = vsAnimation.onActivityStopped;
    animation.vs_onAnimationEnd = vsAnimation.onAnimationEnd;
    const channelFrames = buildChannelFrames(vsAnimation);
    vsAnimation.keyframes.forEach((vsKeyframe) => {
      if (vsKeyframe.particles && vsKeyframe.particles.length > 0) {
        const effects = getEffectAnimator(animation);
        effects.addKeyframe({
          channel: "particle",
          time: vsKeyframe.frame / FPS,
          data_points: vsKeyframe.particles.map((p) => ({ effect: p.effect, locator: p.atAttachmentPoint || "" }))
        });
      }
      for (const boneName in vsKeyframe.elements) {
        const transform = vsKeyframe.elements[boneName];
        const bone = Group.all.find((g) => g.name === boneName);
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
    animators.effects = new EffectAnimator(null, animation, "Effects");
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
    const all = Animation.all.slice();
    all.forEach((a) => a.remove(true));
    return all.length;
  }

  // src/util/misc.ts
  var import_json52 = __toESM(require_lib(), 1);
  var path3 = requireNativeModule("path");
  var fs3 = requireNativeModule("fs");
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
        root: Settings.get("game_path") + path3.sep + "assets" + path3.sep + base_mod_path + path3.sep + "shapes" + path3.sep,
        name: rel_path,
        ext: ".json"
      });
      const exists = fs3.existsSync(f);
      if (exists) {
        return f;
      }
    }
    return "";
  }
  function is_backdrop_project() {
    return Group.all.some((g) => g.backdrop) || Cube.all.some((c) => c.backdrop);
  }

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

  // src/export_animation.ts
  init_util();
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
        const scaleNeedsAllKeys = byChannel.scale.some((kf) => mapInterpolation2(kf.interpolation).mode !== null);
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
              if (scaleNeedsAllKeys || value.x !== 1) elem.stretchX = value.x;
              if (scaleNeedsAllKeys || value.y !== 1) elem.stretchY = value.y;
              if (scaleNeedsAllKeys || value.z !== 1) elem.stretchZ = value.z;
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
        });
      }
    });
    normalize_terminal_keyframe(keyframes, baseFrameCount);
    for (const keyframe of Object.values(keyframes)) {
      const wrapped_elements = {};
      for (const [element, content] of Object.entries(keyframe.elements)) {
        wrapped_elements[element] = new oneLiner(content);
      }
      keyframe.elements = wrapped_elements;
      if (keyframe.particles) {
        keyframe.particles = keyframe.particles.map((p) => new oneLiner(p));
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
    const onAnimationEnd = validEnds.includes(storedOnAnimationEnd) ? storedOnAnimationEnd : validEnds[0];
    const vsAnimation = {
      name: animation.name,
      code: storedCode || animation.name.toLowerCase().replace(/ /g, ""),
      quantityframes: get_frame_quantity(animation, keyframes),
      onActivityStopped: storedOnActivityStopped || "EaseOut",
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
          vsAnimation.keyframes.push(virtualFrame);
          vsAnimation.keyframes.sort((a, b) => a.frame - b.frame);
        }
      }
    }
    if (vsAnimation.keyframes.length === 0) return null;
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
      particles: keyframe.particles ? sort_nested_object(keyframe.particles) : void 0
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
  var fs4 = requireNativeModule("fs");
  var libraryMeta = /* @__PURE__ */ new Map();
  function all_animations() {
    return Animation.all;
  }
  function default_animations_dir() {
    const modelPath = Project?.save_path || Project?.export_path;
    if (!modelPath) return void 0;
    const ctx = parse_model_location(modelPath);
    return ctx ? `${ctx.assetsRoot}/${ctx.domain}/animations` : void 0;
  }
  function build_library(path8, animations) {
    const meta = path8 ? libraryMeta.get(path8) : void 0;
    const stem = path8 ? basename_no_ext(path8) : void 0;
    const library = { animations };
    const code = meta?.code ?? stem;
    const name2 = meta?.name ?? stem;
    if (code) library.code = code;
    if (name2) library.name = name2;
    return library;
  }
  function load_file(file, animation_filter) {
    const json = file.json ?? autoParseJSON(file.content);
    const created = [];
    if (!json || !Array.isArray(json.animations)) return created;
    libraryMeta.set(file.path, { code: json.code, name: json.name });
    for (const vsAnim of json.animations) {
      if (animation_filter && !animation_filter.includes(vsAnim.name)) continue;
      created.push(create_animation(vsAnim, file.path, vsAnim.name));
    }
    return created;
  }
  function compile_file(animations) {
    const path8 = animations[0]?.path;
    const compiled = compile_animation_library(animations).animations;
    return build_library(path8, compiled);
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
    return load_file(file);
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
    const path8 = animation.path;
    let existing = null;
    if (fs4.existsSync(path8)) {
      try {
        existing = autoParseJSON(fs4.readFileSync(path8, "utf-8"));
      } catch (e) {
        console.error("[VS Animation Codec] Failed to read existing library, overwriting:", e);
        existing = null;
      }
    }
    let library;
    if (existing && Array.isArray(existing.animations)) {
      library = existing;
      libraryMeta.set(path8, { code: existing.code, name: existing.name });
      const oldName = animation.saved_name ?? vsAnim.name;
      const idx = library.animations.findIndex((a) => a.name === oldName || a.name === vsAnim.name);
      if (idx >= 0) {
        library.animations[idx] = vsAnim;
        library.animations = library.animations.filter((a, i) => i === idx || a.name !== vsAnim.name);
      } else {
        library.animations.push(vsAnim);
      }
    } else {
      library = build_library(path8, [vsAnim]);
    }
    Blockbench.writeFile(path8, { content: autoStringify(library) }, (real_path) => {
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
          write_animation_to_library(animation);
        }
      });
      return;
    }
    write_animation_to_library(animation);
  }
  function export_file(path8, save_as) {
    const filterPath = path8 || "";
    const animations = all_animations().filter((a) => (a.path || "") === filterPath);
    if (animations.length === 0) return;
    if (!save_as && filterPath && fs4.existsSync(filterPath)) {
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
        });
        fs4.writeFileSync(exportPath, autoStringify(compile_file(animations)));
        animations.forEach((a) => {
          a.saved = true;
          a.saved_name = a.name;
        });
      }
    });
  }
  function delete_animation_from_file(animation) {
    const path8 = animation.path;
    if (!path8 || !fs4.existsSync(path8)) return;
    let library = null;
    try {
      library = autoParseJSON(fs4.readFileSync(path8, "utf-8"));
    } catch (e) {
      console.error("[VS Animation Codec] Failed to read library for deletion:", e);
      return;
    }
    if (!library || !Array.isArray(library.animations)) return;
    const target = animation.saved_name ?? animation.name;
    library.animations = library.animations.filter((a) => a.name !== target);
    Blockbench.writeFile(path8, { content: autoStringify(library) });
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
      compileAnimation: (animation) => compile_animation(animation),
      compileFile: compile_file,
      saveAnimation: save_animation,
      exportFile: export_file,
      deleteAnimationFromFile: delete_animation_from_file
    });
  }
  var vsAnimationCodec = create_vs_animation_codec();

  // src/import.ts
  var fs5 = requireNativeModule("fs");
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
      const filePath = candidates.find((p) => fs5.existsSync(p));
      if (!filePath) {
        console.warn(`[VS Import] Animation library "${ref}" not found. Looked in: ${candidates.join(", ") || "(model is not inside an assets/<domain> tree)"}`);
        continue;
      }
      let fileContent;
      try {
        fileContent = fs5.readFileSync(filePath, "utf-8");
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

  // src/export_model/cube/faces.ts
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
    accu.push(vsElement);
  }

  // src/export_model/group.ts
  init_util();
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
    const hasRotation = converted_rotation[0] !== 0 || converted_rotation[1] !== 0 || converted_rotation[2] !== 0;
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
    const hasRotation = converted_rotation[0] !== 0 || converted_rotation[1] !== 0 || converted_rotation[2] !== 0;
    const vsElement = {
      name: node.name,
      from,
      to,
      rotationOrigin,
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

  // src/export_textures.ts
  var fs6 = requireNativeModule("fs");
  var path4 = requireNativeModule("path");
  function resolveTextureLocation(projectPath, textureName) {
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
    if (!fs6.existsSync(texturesPath)) {
      return "";
    }
    const textureFile = findTextureFile(texturesPath, textureName);
    if (!textureFile) return "";
    const relativePath = path4.relative(texturesPath, textureFile);
    const withoutExt = relativePath.replace(/\.[^.]+$/, "");
    return withoutExt.split(path4.sep).join("/");
  }
  function findTextureFile(dir, textureName) {
    try {
      const entries = fs6.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path4.join(dir, entry.name);
        if (entry.isDirectory()) {
          const found = findTextureFile(fullPath, textureName);
          if (found) return found;
        } else if (entry.isFile() && entry.name === textureName) {
          return fullPath;
        }
      }
    } catch (e) {
    }
    return null;
  }

  // src/export.ts
  var fs7 = requireNativeModule("fs");
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
      if (!fs7.existsSync(fullTextureDir)) {
        fs7.mkdirSync(fullTextureDir, { recursive: true });
      }
      const texturePath = path5.join(fullTextureDir, filename);
      const dataUrl = texture.getDataURL();
      if (!dataUrl) {
        console.warn(`Could not get data URL for texture: ${texture.name}`);
        return "";
      }
      const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      fs7.writeFileSync(texturePath, buffer);
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
    for (const texture of Texture.all) {
      let location = texture.textureLocation || "";
      if (!location || location === "") {
        location = resolveTextureLocation(Project.save_path, texture.name);
        if ((!location || location === "") && texture.source) {
          location = resolveTextureLocation(texture.source, texture.name);
        }
      }
      const exportTextures = Settings.get("vs_export_textures") || false;
      if ((!location || location === "") && exportDir && exportTextures) {
        location = saveTextureToFile(texture, textureBaseDir, textureSubPath);
      }
      textures[texture.name] = location || "";
    }
    const elements = export_model();
    const allAnimations = Animation.all;
    const inlineAnimations = compile_animation_library(allAnimations.filter((a) => !a.path)).animations;
    const libraryRefs = [];
    const seenRefs = /* @__PURE__ */ new Set();
    for (const animation of allAnimations) {
      if (!animation.path) continue;
      const ref = animation.vs_library_ref ?? path_to_reference(animation.path);
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
    return data;
  }

  // src/actions.ts
  var fs8 = requireNativeModule("fs");
  var path6 = requireNativeModule("path");
  var export_action = createAction(`${name}:export_vs`, {
    name: "Export into VS Format",
    icon: "icon.png",
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
            fs8.writeFileSync(exportPath, jsonContent);
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
    icon: "icon.png",
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
    icon: "icon.png",
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
      const total = Animation.all.length;
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

  // src/mods/boneAnimatorMod.ts
  init_util();
  createBlockbenchMod(
    `${name}:bone_animator_mod`,
    {
      original: Blockbench.BoneAnimator.prototype.displayFrame,
      additional_function: Blockbench.BoneAnimator.prototype.flippedDisplayPosition
    },
    (context) => {
      Blockbench.BoneAnimator.prototype.displayFrame = function(multiplier = 1) {
        if (is_vs_project(Project)) {
          if (!this.doRender()) return;
          this.getGroup();
          Animator.MolangParser.context.animation = this.animation;
          const rotation = this.interpolate("rotation");
          const position = this.interpolate("position");
          if (!this.muted.rotation) this.displayRotation(rotation, multiplier);
          if (!this.muted.position) {
            this.flippedDisplayPosition(position, rotation, multiplier);
          }
          if (!this.muted.scale) this.displayScale(this.interpolate("scale"), multiplier);
          return;
        }
        return context.original.call(this, multiplier);
      };
      Blockbench.BoneAnimator.prototype.flippedDisplayPosition = function(position, rotation, multiplier) {
        if (!rotation) {
          this.displayPosition(position, multiplier);
        } else {
          if (position) {
            const vec = position.V3_toThree().applyEuler(new THREE.Euler(
              THREE.MathUtils.degToRad(rotation[0]),
              THREE.MathUtils.degToRad(rotation[1]),
              THREE.MathUtils.degToRad(rotation[2])
              //@ts-expect-error: Missing in type --- IGNORE ---
            ), Format.euler_order);
            this.displayPosition(vec.toArray(), multiplier);
          }
        }
      };
      return context;
    },
    (context) => {
      Blockbench.BoneAnimator.prototype.flippedDisplayPosition = context.additional_function;
      Blockbench.BoneAnimator.prototype.displayFrame = context.original;
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
            "$ref": "#/definitions/VS_OnActivityStopped"
          },
          "onAnimationEnd": {
            "$ref": "#/definitions/VS_OnAnimationEnd"
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
          "onActivityStopped",
          "onAnimationEnd",
          "quantityframes"
        ]
      },
      "VS_OnActivityStopped": {
        "enum": [
          "EaseOut",
          "PlayTillEnd",
          "Rewind",
          "Stop"
        ],
        "type": "string"
      },
      "VS_OnAnimationEnd": {
        "enum": [
          "EaseOut",
          "Hold",
          "Repeat",
          "Stop"
        ],
        "type": "string"
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
      }
    },
    "$schema": "http://json-schema.org/draft-07/schema#"
  };

  // src/codec.ts
  var import_ajv = __toESM(require_ajv(), 1);
  var import_json53 = __toESM(require_lib(), 1);
  var codecVS = new Codec("codecVS", {
    name: "Vintage Story Codec",
    extension: "json",
    remember: true,
    load_filter: {
      extensions: ["json"],
      type: "text",
      condition(model) {
        const content = import_json53.default.parse(model);
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
      im(import_json53.default.parse(data), file_path, false);
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
      codec: codecVS,
      icon: "icon.png",
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
      //@ts-expect-error: Missing in type --- IGNORE ---
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
  var process = __toESM(__require("process"), 1);
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
        value: Settings.get("asset_path") || process.env.VINTAGE_STORY || "",
        click() {
          new Dialog("gamePathSelect", {
            title: "Select Game Path",
            form: {
              path: {
                label: "Path to your game folder",
                type: "folder",
                value: Settings.get("game_path") || process.env.VINTAGE_STORY || ""
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
    (context) => {
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
    (context) => {
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
    (context) => {
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
        type: "checkbox",
        value: true
      });
      return setting;
    },
    (context) => {
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
        type: "checkbox",
        value: false
      });
      return setting;
    },
    (context) => {
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
    return (node instanceof Group || node instanceof Cube) && node.clothingSlot && node.clothingSlot.trim() !== "";
  }

  // src/attachments/export_attachment_vs.ts
  init_presets();
  init_util();

  // src/attachments/constants.ts
  var IMPORT_SETTLE_DELAY = 100;
  var DISCOVERY_DEBOUNCE_MS = 150;
  var QUICK_MESSAGE_DURATION = 3e3;

  // src/attachments/export_attachment_vs.ts
  var fs9 = requireNativeModule("fs");
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
      custom_writer: (content, path8) => {
        logDebug(`[VS Attachment Export] Writing to path: ${path8}`);
        const usedTextureNames = getUsedTextureNames(data.elements);
        logDebug(`[VS Attachment Export] Used textures: ${Array.from(usedTextureNames).join(", ")}`);
        if (fs9.existsSync(path8)) {
          logDebug("[VS Attachment Export] File exists, will overwrite");
          try {
            const existingContent = fs9.readFileSync(path8, "utf8");
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
          fs9.writeFileSync(path8, finalContent, "utf8");
          logDebug(`[VS Attachment Export] Successfully wrote file: ${path8}`);
          Blockbench.showQuickMessage(`Exported attachment to ${path8.split(/[/\\]/).pop()}`, 2e3);
        } catch (e) {
          console.error("[VS Attachment Export] Error writing file:", e);
          Blockbench.showQuickMessage(`Failed to write file: ${e instanceof Error ? e.message : String(e)}`, 5e3);
        }
      }
    });
  }

  // src/attachments/codec.ts
  function createExportCodec() {
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
      export(selection) {
        Blockbench.export({
          resource_id: "model",
          type: this.name,
          extensions: [this.extension],
          name: `${selection[0].name}_attachment.bbmodel`,
          startpath: this.startPath(),
          content: this.compile(selection)
        });
      },
      compile(selection, options) {
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
        selection.forEach((el) => {
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
        const allElements = collectAllElements(selection);
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
          selection,
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
    const bb_codec = createExportCodec();
    bb_codec.export(selection);
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
    Undo.initEdit({ outliner: true }, `Delete (-) Root`);
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
    Undo.initEdit({ outliner: true }, `Delete ${elements.length} attachment(s)`);
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
          this.isExporting = true;
          exportAttachmentsBB(elements);
          setTimeout(() => {
            this.isExporting = false;
          }, 100);
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : String(e);
          Blockbench.showQuickMessage(`Export failed: ${errorMsg}`, QUICK_MESSAGE_DURATION);
          if (DEBUG3) console.error("Export BB error:", e);
          this.isExporting = false;
        }
      },
      /**
       * Exports the given elements to a Vintage Story .json file.
       * @param {Array<Group | Cube>} elements The elements to export.
       */
      exportVS(elements) {
        try {
          this.isExporting = true;
          exportAttachmentsVS(elements);
          setTimeout(() => {
            this.isExporting = false;
          }, 100);
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : String(e);
          Blockbench.showQuickMessage(`Export failed: ${errorMsg}`, QUICK_MESSAGE_DURATION);
          if (DEBUG3) console.error("Export VS error:", e);
          this.isExporting = false;
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
          Undo.initEdit({ outliner: true }, `Toggle visibility: ${elements.length} element(s)`);
          elements.forEach((element) => {
            if (!element) return;
            try {
              this._walk(element, (node) => {
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
       * Traverses a node and its children, applying a callback to each.
       * @param {object} node The node to start traversal from.
       * @param {function} callback The function to apply to each node.
       */
      _walk(node, callback) {
        callback(node);
        if (node instanceof Group && Array.isArray(node.children)) {
          node.children.forEach((child) => this._walk(child, callback));
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
      children: []
    });
    if (actions.importBB) {
      toolbar.add(actions.importBB);
    }
    if (actions.importVS) {
      toolbar.add(actions.importVS);
    }
    const panel2 = new Panel("attachments_panel", {
      name: "Attachments",
      icon: "attach_file",
      default_position: {
        slot: "right_bar",
        float_position: [0, 0],
        float_size: [300, 400],
        height: 400
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
  function preserveInheritedPaletteOnChildren(source, children) {
    const sourceSlot = Number(source?.paletteSlot) || 0;
    if (sourceSlot === 0) return;
    children.forEach((child) => {
      if ((child instanceof Group || child instanceof Cube) && (Number(child.paletteSlot) || 0) === 0) {
        child.paletteSlot = sourceSlot;
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
      const hasStoredFrame = element.vs_has_step_parent_transform === true && isFiniteVector32(element.vs_step_parent_origin) && isFiniteVector32(element.vs_step_parent_rotation);
      const authoredSocketFrom = hasStoredFrame ? [...element.vs_step_parent_origin] : liveSocketFrom;
      const authoredSocketRotation = hasStoredFrame ? [...element.vs_step_parent_rotation] : liveSocketRotation;
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
  function mergeDuplicateGroups(newElementsSet, logPrefix) {
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
    const matchCount = smartMatchGroups(newElements, newElementsSet, elementsBefore, logPrefix);
    if (matchCount > 0) {
      Blockbench.showQuickMessage(`Matched ${matchCount} groups`, QUICK_MESSAGE_DURATION);
    }
    mergeHierarchicalGroups(newElements, newElementsSet, logPrefix);
    mergeGroupsByCommonSlot(newElements, newElementsSet, logPrefix);
    placeStepParentWrappers(newElements, newElementsSet, logPrefix);
    mergeDuplicateGroups(newElementsSet, logPrefix);
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
        const pathFilename = extractFilename(texture.path)?.toLowerCase();
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
  function createVSAttachmentTexture(name2, path8, textureLocation, content) {
    const texture = new Texture({ name: name2, path: path8 || void 0 }).add();
    texture.textureLocation = textureLocation;
    updateTextureUVSize(texture, name2, content);
    if (path8 && path8.length > 0 && !path8.startsWith("data:")) {
      texture.load();
    }
    return texture;
  }
  function handleExistingTextureByName(texture, name2, textureLocation, content, match) {
    if (!texture.textureLocation) {
      texture.textureLocation = textureLocation;
    }
    updateTextureUVSize(texture, name2, content);
    if (!texture.loaded) {
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
  }
  function handleExistingTextureByLocation(texture, name2, textureLocation, content) {
    if (texture.name === name2) {
      updateTextureUVSize(texture, name2, content);
    } else {
      createVSAttachmentTexture(name2, texture.path, textureLocation, content);
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
  function createCubeFromElementData(elemData, parentGroup, textureMap, createdGroups, inheritedPaletteSlot = 0) {
    const cubeProps = { ...elemData };
    delete cubeProps.uuid;
    if (normalizePaletteSlot(cubeProps.paletteSlot) === 0 && inheritedPaletteSlot !== 0) {
      cubeProps.paletteSlot = inheritedPaletteSlot;
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
  function getOrCreateGroup(groupSeed, parentGroup, createdGroups, inheritedPaletteSlot = 0) {
    const groupName = typeof groupSeed.name === "string" ? groupSeed.name : "";
    const hasExternalStepParent = typeof groupSeed.stepParentName === "string" && groupSeed.stepParentName.trim() !== "";
    const ownPaletteSlot = normalizePaletteSlot(groupSeed.paletteSlot);
    const childPaletteSlot = ownPaletteSlot || inheritedPaletteSlot;
    const existing = hasExternalStepParent ? null : findExistingGroupByName(parentGroup, groupName);
    if (existing) {
      logDebug2(`[Import BB] Merging into existing group: ${groupName}`);
      return { group: existing, childPaletteSlot };
    }
    const groupProps = { ...groupSeed };
    delete groupProps.uuid;
    delete groupProps.children;
    if (ownPaletteSlot === 0 && inheritedPaletteSlot !== 0) {
      groupProps.paletteSlot = inheritedPaletteSlot;
    }
    const group = new Group(groupProps);
    group.addTo(parentGroup).init();
    createdGroups.add(group);
    logDebug2(`[Import BB] Created new group: ${groupName || "(unnamed group)"}`);
    return { group, childPaletteSlot };
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
      const processChildren = (children, parent, inheritedPaletteSlot = 0) => {
        for (const child of children) processOutlinerItem(child, parent, inheritedPaletteSlot);
      };
      const tryCreateCubeByUuid = (uuid, parent, inheritedPaletteSlot = 0) => {
        const elemData = elementByUuid.get(uuid);
        if (!isCubeElement(elemData)) return false;
        createCubeFromElementData(elemData, parent, textureMap, createdGroups, inheritedPaletteSlot);
        return true;
      };
      const tryProcessGroupByUuid = (uuid, node, parent, inheritedPaletteSlot = 0) => {
        const groupData = groupByUuid.get(uuid);
        if (!groupData) return false;
        const seed = { ...groupData, ...node };
        const { group: targetGroup, childPaletteSlot } = getOrCreateGroup(seed, parent, createdGroups, inheritedPaletteSlot);
        const children = asArray(node.children);
        processChildren(children, targetGroup, childPaletteSlot);
        return true;
      };
      const processUuidStringItem = (uuid, parent, inheritedPaletteSlot = 0) => {
        if (tryCreateCubeByUuid(uuid, parent, inheritedPaletteSlot)) return;
      };
      const processInlineGroupNode = (node, parent, inheritedPaletteSlot = 0) => {
        const { group: targetGroup, childPaletteSlot } = getOrCreateGroup(node, parent, createdGroups, inheritedPaletteSlot);
        const children = asArray(node.children);
        processChildren(children, targetGroup, childPaletteSlot);
      };
      const processObjectNode = (node, parent, inheritedPaletteSlot = 0) => {
        const uuid = typeof node.uuid === "string" ? node.uuid : void 0;
        if (uuid) {
          if (tryCreateCubeByUuid(uuid, parent, inheritedPaletteSlot)) return;
          if (tryProcessGroupByUuid(uuid, node, parent, inheritedPaletteSlot)) return;
        }
        processInlineGroupNode(node, parent, inheritedPaletteSlot);
      };
      const processOutlinerItem = (item, parent, inheritedPaletteSlot = 0) => {
        if (typeof item === "string") return processUuidStringItem(item, parent, inheritedPaletteSlot);
        if (!isRecord(item)) return;
        return processObjectNode(item, parent, inheritedPaletteSlot);
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
      click: () => {
        Blockbench.import({
          resource_id: config.resource_id,
          extensions: config.extensions,
          type: config.type,
          multiple: true
        }, function(files) {
          if (!files || !files.length) return;
          const fileName = files[0]?.name || "attachment";
          Undo.initEdit({ outliner: true }, `Import attachment: ${fileName}`);
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
      onSelect: () => {
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
    deletables.forEach((item) => {
      try {
        item.delete();
      } catch (e) {
        console.log(e);
      }
    });
    deletables = [];
    eventListeners.forEach(({ event, listener }) => {
      Blockbench.removeListener(event, listener);
      console.log(`Removed ${event} listener`);
    });
    eventListeners = [];
    if (window.debugFindAttachments) {
      delete window.debugFindAttachments;
    }
    console.log("Attachments module cleanup complete");
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
    if (vertexDot) return;
    const geo = new THREE.SphereGeometry(0.5, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 16729156, depthTest: false, transparent: true, opacity: 0.9 });
    vertexDot = new THREE.Mesh(geo, mat);
    vertexDot.renderOrder = 999;
    vertexDot.visible = false;
  }
  function showVertexDot(cube, direction, vertexIndex) {
    createVertexDot();
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
      vertexDot.position.copy(worldPos);
    } else {
      vertexDot.position.set(pos[0], pos[1], pos[2]);
    }
    vertexDot.visible = true;
    if (!vertexDot.parent) {
      Canvas.scene.add(vertexDot);
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
    data() {
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
    },
    computed: {
      windDataDisplay() {
        return this.windData.join(", ");
      }
    },
    methods: {
      getSelectedFace() {
        const self = this;
        if (!self.selectedCube || !self.selectedFaceName) return null;
        return self.selectedCube.faces[self.selectedFaceName];
      },
      getTargetFaces() {
        const self = this;
        if (!self.selectedCube) return [];
        if (self.applyToAll) {
          return FACE_DIRECTIONS.filter((d) => self.selectedCube.faces[d]).map((d) => ({ face: self.selectedCube.faces[d], direction: d }));
        }
        const face = self.getSelectedFace();
        if (!face) return [];
        return [{ face, direction: self.selectedFaceName }];
      },
      selectFace(direction) {
        const self = this;
        self.selectedFaceName = direction;
        self.loadFromFace();
      },
      highlightVertex(index) {
        const self = this;
        if (self.selectedCube && self.selectedFaceName) {
          showVertexDot(self.selectedCube, self.selectedFaceName, index);
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
        const self = this;
        const num = parseInt(value);
        self.windMode[index] = num;
        self.windMode = [...self.windMode];
        for (const { face, direction } of self.getTargetFaces()) {
          if (!face.windMode) {
            face.windMode = [-1, -1, -1, -1];
          }
          face.windMode[index] = num;
          if (self.selectedCube) {
            const autoData = computeWindData(self.selectedCube, direction);
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
        self.updateWindDataDisplay();
      },
      updateWindDataDisplay() {
        const self = this;
        const face = self.getSelectedFace();
        if (face && face.windData) {
          self.windData = [...face.windData];
        } else if (self.selectedCube && self.selectedFaceName) {
          self.windData = computeWindData(self.selectedCube, self.selectedFaceName);
        } else {
          self.windData = [0, 0, 0, 0];
        }
      },
      loadFromFace() {
        const self = this;
        const face = self.getSelectedFace();
        if (!face) {
          self.glow = 0;
          self.reflectiveMode = "0";
          self.windMode = [-1, -1, -1, -1];
          self.windData = [0, 0, 0, 0];
          return;
        }
        self.glow = face.glow || 0;
        self.reflectiveMode = String(face.reflectiveMode || 0);
        self.windMode = face.windMode ? [...face.windMode] : [-1, -1, -1, -1];
        self.updateWindDataDisplay();
      },
      updateSelection() {
        const self = this;
        hideVertexDot();
        const selected = Cube.selected;
        if (!selected || selected.length === 0) {
          self.selectedCube = null;
          self.selectedFaceName = "north";
          return;
        }
        self.selectedCube = selected[0];
        self.loadFromFace();
      }
    },
    mounted() {
      const self = this;
      self.updateSelection();
      const onSelectionUpdate = () => self.updateSelection();
      Blockbench.on("update_selection", onSelectionUpdate);
      self._listeners = [
        () => Blockbench.removeListener("update_selection", onSelectionUpdate)
      ];
    },
    beforeDestroy() {
      const self = this;
      hideVertexDot();
      for (const unsub of self._listeners) {
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
        name: "VS Face Properties",
        icon: "grain",
        condition: () => Format?.id === "formatVS",
        default_position: {
          slot: "right_bar",
          float_position: [0, 0],
          float_size: [300, 300],
          height: 300
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
  var fs10 = requireNativeModule("fs");
  var path7 = requireNativeModule("path");
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
    about: package_default.description,
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
