/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/BamoAdvancedProperties.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/BamoAdvancedProperties.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _util_OptionArrays_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/OptionArrays.js */ "./src/util/OptionArrays.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      step: "start",
      rotationTypes: _util_OptionArrays_js__WEBPACK_IMPORTED_MODULE_0__.rotationTypes,
      soundOptions: _util_OptionArrays_js__WEBPACK_IMPORTED_MODULE_0__.soundOptions,
      materialOptions: _util_OptionArrays_js__WEBPACK_IMPORTED_MODULE_0__.materialOptions,
      transparencyOptions: _util_OptionArrays_js__WEBPACK_IMPORTED_MODULE_0__.transparencyOptions,
      tabOptions: _util_OptionArrays_js__WEBPACK_IMPORTED_MODULE_0__.tabOptions,
      particleOptions: _util_OptionArrays_js__WEBPACK_IMPORTED_MODULE_0__.particleOptions,
      customTypeOptions: _util_OptionArrays_js__WEBPACK_IMPORTED_MODULE_0__.customTypeOptions,
      parentData: this.$parent.$data
    };
  },
  methods: {
    Textures: function Textures() {
      return Texture.all;
    },
    createJSON: function createJSON() {
      this.$parent.createJSON();
    },
    changePage: function changePage(event, page) {
      if (this.parentData.properties.displayName == "") {
        this.parentData.error = "name";
      } else {
        if (this.step == "types" && page == "physical" || this.step == "physical" && page == "types") {
          if (this.parentData.properties.types.block) {
            page = "variant";
          } else {
            page = "custom";
          }
        }

        this.parentData.error = "";
        this.step = page;
      }
    },
    toggleType: function toggleType(event, type) {
      if (this.parentData.properties.types.custom && type == "custom") {
        this.parentData.properties.types.block = false;
        this.parentData.properties.types.stair = false;
        this.parentData.properties.types.slab = false;
        this.parentData.properties.types.wall = false;
        return;
      }

      if (this.parentData.properties.types.block && type == "block") {
        this.parentData.properties.types.custom = false;
        return;
      }
    },
    reset: function reset(event) {
      this.parentData.error = "";
      this.step = "start";
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/BamoBaseComponent.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/BamoBaseComponent.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.for-each.js */ "./node_modules/core-js/modules/es.array.for-each.js");
/* harmony import */ var core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.object.keys.js */ "./node_modules/core-js/modules/es.object.keys.js");
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.string.split.js */ "./node_modules/core-js/modules/es.string.split.js");
/* harmony import */ var core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.array.slice.js */ "./node_modules/core-js/modules/es.array.slice.js");
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_date_to_string_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.date.to-string.js */ "./node_modules/core-js/modules/es.date.to-string.js");
/* harmony import */ var core_js_modules_es_date_to_string_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_date_to_string_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.regexp.to-string.js */ "./node_modules/core-js/modules/es.regexp.to-string.js");
/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.symbol.js */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es.symbol.description.js */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator.js */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/es.array.iterator.js */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! core-js/modules/es.string.iterator.js */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _util_OptionArrays_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../util/OptionArrays.js */ "./src/util/OptionArrays.js");
/* harmony import */ var _util_GenStates_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../util/GenStates.js */ "./src/util/GenStates.js");
/* harmony import */ var _util_GenDataFiles_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../util/GenDataFiles.js */ "./src/util/GenDataFiles.js");
/* harmony import */ var _util_Utils_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../util/Utils.js */ "./src/util/Utils.js");
/* harmony import */ var _util_Settings_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../util/Settings.js */ "./src/util/Settings.js");
/* harmony import */ var _BamoAdvancedProperties_vue__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./BamoAdvancedProperties.vue */ "./src/components/BamoAdvancedProperties.vue");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
























/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    BamoAdvancedProperties: _BamoAdvancedProperties_vue__WEBPACK_IMPORTED_MODULE_22__["default"]
  },
  data: function data() {
    return {
      step: "start",
      error: "",
      rotationTypes: _util_OptionArrays_js__WEBPACK_IMPORTED_MODULE_17__.rotationTypes,
      soundOptions: _util_OptionArrays_js__WEBPACK_IMPORTED_MODULE_17__.soundOptions,
      materialOptions: _util_OptionArrays_js__WEBPACK_IMPORTED_MODULE_17__.materialOptions,
      transparencyOptions: _util_OptionArrays_js__WEBPACK_IMPORTED_MODULE_17__.transparencyOptions,
      tabOptions: _util_OptionArrays_js__WEBPACK_IMPORTED_MODULE_17__.tabOptions,
      particleOptions: _util_OptionArrays_js__WEBPACK_IMPORTED_MODULE_17__.particleOptions,
      customTypeOptions: _util_OptionArrays_js__WEBPACK_IMPORTED_MODULE_17__.customTypeOptions,
      properties: _util_Settings_js__WEBPACK_IMPORTED_MODULE_21__.BAMO_SETTINGS_DEFAULT,
      lastID: "",
      swap: false
    };
  },
  methods: {
    updateValues: function updateValues() {
      if (Project.uuid != this.lastID) {
        this.properties = _util_Settings_js__WEBPACK_IMPORTED_MODULE_21__["default"][Project.uuid];
        this.lastID = Project.uuid;
        this.swap = true;
        this.reset(null);
      } // Initialize the textures if not done so yet


      if (this.properties.variant["default"].all == "") {
        this.properties.variant["default"].all = Texture.all[0].name;
        this.properties.variant.stair.top = Texture.all[0].name;
        this.properties.variant.stair.bottom = Texture.all[0].name;
        this.properties.variant.stair.side = Texture.all[0].name;
        this.properties.variant.slab.top = Texture.all[0].name;
        this.properties.variant.slab.bottom = Texture.all[0].name;
        this.properties.variant.slab.side = Texture.all[0].name;
        this.properties.variant.wall.wall = Texture.all[0].name;
      }
    },
    Textures: function Textures() {
      return Texture.all;
    },
    changePage: function changePage(event, page) {
      if (this.properties.displayName == "") {
        this.error = "name";
      } else {
        if (this.step == "types" && page == "physical" || this.step == "physical" && page == "types") {
          if (this.properties.types.block) {
            page = "variant";
          }
        }

        this.error = "";
        this.step = page;
      }
    },
    toggleType: function toggleType(event, type) {
      if (this.properties.types.custom && type == "custom") {
        this.properties.types.block = false;
        this.properties.types.stair = false;
        this.properties.types.slab = false;
        this.properties.types.wall = false;
        return;
      }

      if (this.properties.types.block && type == "block") {
        this.properties.types.custom = false;
        return;
      }
    },
    reset: function reset(event) {
      this.error = "";
      this.step = "start";
    },
    createJSON: function createJSON(event) {
      var _this = this;

      // Ensure a name is set
      if (this.properties.displayName == "") {
        this.error = "name";
        return;
      } // Ensure a particle texture is set


      var part = false;
      Texture.all.forEach(function (tx) {
        if (tx.particle == true) {
          part = true;
        }
      });

      if (part == false) {
        Blockbench.showMessageBox({
          buttons: ["Ok"],
          title: "Error",
          message: "Please ensure you have set a particle texture"
        });
        return;
      }

      var zip = new JSZip(); // Trim invalid chars from the name

      var packName = (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.cleanFileName)(this.properties.displayName); // Define folder locations

      var objFolder = settings.minecraftFolder.value + "\\bamopacks\\" + packName + "\\objects\\";
      var blockstatesFolder = settings.minecraftFolder.value + "\\bamopacks\\" + packName + "\\assets\\" + this.properties.namespace + "\\blockstates\\";
      var blockModelsFolder = settings.minecraftFolder.value + "\\bamopacks\\" + packName + "\\assets\\" + this.properties.namespace + "\\models\\block\\";
      var itemModelsFolder = settings.minecraftFolder.value + "\\bamopacks\\" + packName + "\\assets\\" + this.properties.namespace + "\\models\\item\\";
      var dataFolder = settings.minecraftFolder.value + "\\bamopacks\\" + packName + "\\data\\";
      var blockTextureFolderVersion = this.properties.version == "1.20.1" ? "block" : "blocks";
      var blockTexturesFolder = settings.minecraftFolder.value + "\\bamopacks\\" + packName + "\\assets\\" + this.properties.namespace + "\\textures\\" + blockTextureFolderVersion + "\\"; // Create the folders if they dont exist

      var folderList = [objFolder, blockstatesFolder, blockModelsFolder, itemModelsFolder, blockTexturesFolder, dataFolder];

      var fs = __webpack_require__(/*! fs */ "fs");

      folderList.forEach(function (folder) {
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, {
            recursive: true
          });
        }
      }); // Create mcmeta file
      // Format ID is 15 for 1.20.1, 8 for 1.18.2, and 6 for 1.16.5

      var formatID = this.properties.version == "1.20.1" ? 15 : this.properties.version == "1.18.2" ? 8 : 6;
      var mcmetaData = {
        "pack": {
          "pack_format": formatID,
          "description": "Resource Pack for BAMO test files"
        }
      };
      fs.writeFile(settings.minecraftFolder.value + "\\bamopacks\\" + packName + "\\pack.mcmeta", JSON.stringify(mcmetaData), "utf8", function (err) {
        if (err != null) {
          console.log("Error generating mcmeta file:", err);
        }
      });
      zip.file("pack.mcmeta", JSON.stringify(mcmetaData)); // Generate block name from the displayname

      var blockName = (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.cleanFileName)(this.properties.displayName); //generate the list of blocks to be exported

      var blockList = [];
      var codecData = Format.codec.compile(); // Custom Block

      if (this.properties.types.custom) {
        // Pull the model data from the codec
        var modelData = JSON.parse(codecData);
        modelData["parent"] = "block/block";
        var stateData = ""; // Create blockstates data

        if (this.properties.rotType == "y_axis") {
          stateData = JSON.stringify({
            "variants": {
              "facing=north": {
                "model": this.properties.namespace + ":block/" + blockName
              },
              "facing=east": {
                "model": this.properties.namespace + ":block/" + blockName,
                "y": 90
              },
              "facing=south": {
                "model": this.properties.namespace + ":block/" + blockName,
                "y": 180
              },
              "facing=west": {
                "model": this.properties.namespace + ":block/" + blockName,
                "y": 270
              }
            }
          });
        } else {
          stateData = JSON.stringify({
            "variants": {
              "": {
                "model": this.properties.namespace + ":block/" + blockName
              }
            }
          });
        }

        var textureData = {}; // Setup texture dict

        ns = this.properties.namespace;
        Object.keys(modelData.textures).forEach(function (key) {
          var comp;
          var partCheck;

          if (_typeof(modelData.textures[key]) === 'object') {
            comp = modelData.textures[key]["id"];
            partCheck = modelData.textures[key].particle;
          } else if (typeof modelData.textures[key] === 'string') {
            comp = key;
            partCheck = key == "particle";
          }

          Texture.all.forEach(function (tx) {
            if (tx.id == comp || partCheck && tx.particle == true) {
              if (tx.namespace == "") {
                textureData[key] = ns + ":" + blockTextureFolderVersion + "/" + (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.cleanFileName)(tx.name.split(".")[0]);
              } else {
                textureData[key] = tx.namespace + ":" + tx.folder + "/" + (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.cleanFileName)(tx.name.split(".")[0]);
              }
            }
          });
        }); // Looting file

        var lootData = (0,_util_GenDataFiles_js__WEBPACK_IMPORTED_MODULE_19__.genLootTable)(this.properties.namespace, blockName);
        var lootTags = dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\" + blockName + ".json";
        fs.mkdirSync(dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\", {
          recursive: true
        });
        fs.writeFile(lootTags, lootData, "utf8", function (err) {
          if (err != null) {
            console.log("Error found when writing custom block looting file:", err);
          }
        });
        zip.file("data/" + this.properties.namespace + "/loot_tables/blocks/" + blockName + ".json", lootData); // Stonecutting Table Recipes

        (0,_util_GenDataFiles_js__WEBPACK_IMPORTED_MODULE_19__.genStonecuttingRecipes)(this.properties, blockName, dataFolder, zip);
        modelData.textures = textureData;
        var boxList = [];
        modelData.elements.forEach(function (model) {
          boxList.push([model["from"], model["to"]]);
        });
        blockList.push({
          "name": blockName,
          "types": [],
          "model": modelData,
          "state": stateData,
          "hitbox": boxList
        });
      } // Regular Block


      if (this.properties.types.block) {
        var modelData = {};
        modelData["credit"] = codecData["credit"];
        modelData["parent"] = "block/cube_all";
        modelData["textures"] = {
          "all": (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.dictFromTexture)(this.properties.variant["default"].all, this.properties.namespace),
          "particle": (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.dictFromTexture)("particle", this.properties.namespace)
        }; // Looting file

        var lootData = (0,_util_GenDataFiles_js__WEBPACK_IMPORTED_MODULE_19__.genLootTable)(this.properties.namespace, blockName);
        var lootTags = dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\" + blockName + ".json";
        fs.mkdirSync(dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\", {
          recursive: true
        });
        fs.writeFile(lootTags, lootData, "utf8", function (err) {
          if (err != null) {
            console.log("Error found when writing wall tags:", err);
          }
        });
        zip.file("data/" + this.properties.namespace + "/loot_tables/blocks/" + blockName + ".json", lootData); // Stonecutting Table Recipes

        (0,_util_GenDataFiles_js__WEBPACK_IMPORTED_MODULE_19__.genStonecuttingRecipes)(this.properties, blockName, dataFolder, zip);
        var state = JSON.stringify({
          "variants": {
            "": {
              "model": this.properties.namespace + ":block/" + blockName
            }
          }
        });
        var typeList = [];
        if (this.properties.types.stair) typeList.push("stairs");
        if (this.properties.types.slab) typeList.push("slab");
        if (this.properties.types.wall) typeList.push("wall");
        blockList.push({
          "name": blockName,
          "types": typeList,
          "state": state,
          "model": modelData,
          "hitbox": []
        });
      } // Stair Block


      if (this.properties.types.stair) {
        var name = blockName + "_stairs";
        var modelData = {};
        modelData["credit"] = codecData["credit"];
        modelData["parent"] = "minecraft:block/stairs";
        modelData["textures"] = {
          "top": (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.dictFromTexture)(this.properties.variant.stair.top, this.properties.namespace),
          "bottom": (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.dictFromTexture)(this.properties.variant.stair.bottom, this.properties.namespace),
          "side": (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.dictFromTexture)(this.properties.variant.stair.side, this.properties.namespace),
          "particle": (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.dictFromTexture)("particle", this.properties.namespace)
        }; // Looting file

        var lootData = (0,_util_GenDataFiles_js__WEBPACK_IMPORTED_MODULE_19__.genLootTable)(this.properties.namespace, name);
        var lootTags = dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\" + name + ".json";
        fs.mkdirSync(dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\", {
          recursive: true
        });
        fs.writeFile(lootTags, lootData, "utf8", function (err) {
          if (err != null) {
            console.log("Error found when writing wall tags:", err);
          }
        });
        zip.file("data/" + this.properties.namespace + "/loot_tables/blocks/" + name + ".json", lootData); // Stonecutting Table Recipes

        (0,_util_GenDataFiles_js__WEBPACK_IMPORTED_MODULE_19__.genStonecuttingRecipes)(this.properties, name, dataFolder, zip); // Write state

        var state = (0,_util_GenStates_js__WEBPACK_IMPORTED_MODULE_18__.genStairState)(this.properties.namespace, "block/" + name, "block/" + name + "_outer", "block/" + name + "_inner");
        fs.writeFile(blockstatesFolder + "\\" + name + ".json", state, "utf8", function (err) {
          if (err != null) {
            console.log("Error generating blockstate:", err);
          }
        });
        zip.file("assets/" + this.properties.namespace + "/blockstates/" + name + ".json", state); // write the 4 stair models
        // Base

        fs.writeFile(blockModelsFolder + "\\" + name + ".json", JSON.stringify(modelData), "utf8", function (err) {
          if (err != null) {
            console.log("Error Found writing block model data:", err);
          }
        });
        zip.file("assets/" + this.properties.namespace + "/models/block/" + name + ".json", JSON.stringify(modelData)); // Item

        fs.writeFile(itemModelsFolder + "\\" + name + ".json", JSON.stringify(modelData), "utf8", function (err) {
          if (err != null) {
            console.log("Error Found writing item model data:", err);
          }
        });
        zip.file("assets/" + this.properties.namespace + "/models/item/" + name + ".json", JSON.stringify(modelData)); // Inner

        modelData["parent"] = "minecraft:block/inner_stairs";
        fs.writeFile(blockModelsFolder + "\\" + name + "_inner.json", JSON.stringify(modelData), "utf8", function (err) {
          if (err != null) {
            console.log("Error Found writing block model data:", err);
          }
        });
        zip.file("assets/" + this.properties.namespace + "/models/block/" + name + "_inner.json", JSON.stringify(modelData)); // Outer

        modelData["parent"] = "minecraft:block/outer_stairs";
        fs.writeFile(blockModelsFolder + "\\" + name + "_outer.json", JSON.stringify(modelData), "utf8", function (err) {
          if (err != null) {
            console.log("Error Found writing block model data:", err);
          }
        });
        zip.file("assets/" + this.properties.namespace + "/models/block/" + name + "_outer.json", JSON.stringify(modelData));
      }

      if (this.properties.types.slab) {
        var name = blockName + "_slab";
        var modelData = {};
        modelData["credit"] = codecData["credit"];
        modelData["parent"] = "minecraft:block/slab";
        modelData["textures"] = {
          "top": (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.dictFromTexture)(this.properties.variant.slab.top, this.properties.namespace),
          "bottom": (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.dictFromTexture)(this.properties.variant.slab.bottom, this.properties.namespace),
          "side": (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.dictFromTexture)(this.properties.variant.slab.side, this.properties.namespace),
          "particle": (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.dictFromTexture)("particle", this.properties.namespace)
        }; // Looting file

        var lootData = (0,_util_GenDataFiles_js__WEBPACK_IMPORTED_MODULE_19__.genLootTable)(this.properties.namespace, name);
        var lootTags = dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\" + name + ".json";
        fs.mkdirSync(dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\", {
          recursive: true
        });
        fs.writeFile(lootTags, lootData, "utf8", function (err) {
          if (err != null) {
            console.log("Error found when writing wall tags:", err);
          }
        });
        zip.file("data/" + this.properties.namespace + "/loot_tables/blocks/" + name + ".json", lootData); // Stonecutting Table Recipes

        (0,_util_GenDataFiles_js__WEBPACK_IMPORTED_MODULE_19__.genStonecuttingRecipes)(this.properties, name, dataFolder, zip); // Write State

        var state = {
          "variants": {
            "type=bottom": {
              "model": this.properties.namespace + ":block/" + name
            },
            "type=double": {
              "model": this.properties.namespace + ":block/" + blockName
            },
            "type=top": {
              "model": this.properties.namespace + ":block/" + name + "_top"
            }
          }
        };
        fs.writeFile(blockstatesFolder + "\\" + name + ".json", JSON.stringify(state), "utf8", function (err) {
          if (err != null) {
            console.log("Error generating blockstate:", err);
          }
        });
        zip.file("assets/" + this.properties.namespace + "/blockstates/" + name + ".json", JSON.stringify(state)); // Write the 3 slab models
        // Base

        fs.writeFile(blockModelsFolder + "\\" + name + ".json", JSON.stringify(modelData), "utf8", function (err) {
          if (err != null) {
            console.log("Error Found writing block model data:", err);
          }
        });
        zip.file("assets/" + this.properties.namespace + "/models/block/" + name + ".json", JSON.stringify(modelData)); // Item

        fs.writeFile(itemModelsFolder + "\\" + name + ".json", JSON.stringify(modelData), "utf8", function (err) {
          if (err != null) {
            console.log("Error Found writing item model data:", err);
          }
        });
        zip.file("assets/" + this.properties.namespace + "/models/item/" + name + ".json", JSON.stringify(modelData)); // Top

        modelData["parent"] = "minecraft:block/slab_top";
        fs.writeFile(blockModelsFolder + "\\" + name + "_top.json", JSON.stringify(modelData), "utf8", function (err) {
          if (err != null) {
            console.log("Error Found writing block model data:", err);
          }
        });
        zip.file("assets/" + this.properties.namespace + "/models/block/" + name + "_top.json", JSON.stringify(modelData));
      }

      if (this.properties.types.wall) {
        var name = blockName + "_wall";
        var modelData = {};
        modelData["credit"] = codecData["credit"];
        modelData["parent"] = "minecraft:block/template_wall_post";
        modelData["textures"] = {
          "wall": (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.dictFromTexture)(this.properties.variant.wall.wall, this.properties.namespace),
          "particle": (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.dictFromTexture)("particle", this.properties.namespace)
        }; // Looting file

        var lootData = (0,_util_GenDataFiles_js__WEBPACK_IMPORTED_MODULE_19__.genLootTable)(this.properties.namespace, name);
        var lootTags = dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\" + name + ".json";
        fs.mkdirSync(dataFolder + this.properties.namespace + "\\loot_tables\\blocks\\", {
          recursive: true
        });
        fs.writeFile(lootTags, lootData, "utf8", function (err) {
          if (err != null) {
            console.log("Error found when writing wall tags:", err);
          }
        });
        zip.file("data/" + this.properties.namespace + "/loot_tables/blocks/" + name + ".json", lootData); // Stonecutting Table Recipes

        (0,_util_GenDataFiles_js__WEBPACK_IMPORTED_MODULE_19__.genStonecuttingRecipes)(this.properties, name, dataFolder, zip); // Write State

        var state = (0,_util_GenStates_js__WEBPACK_IMPORTED_MODULE_18__.genWallState)(this.properties.namespace, "block/" + name + "_post", "block/" + name + "_side", "block/" + name + "_side_tall");
        fs.writeFile(blockstatesFolder + "\\" + name + ".json", state, "utf8", function (err) {
          if (err != null) {
            console.log("Error generating blockstate:", err);
          }
        });
        zip.file("assets/" + this.properties.namespace + "/blockstates/" + name + ".json", state); // Write the 4  wall models
        // Base

        fs.writeFile(blockModelsFolder + "\\" + name + "_post.json", JSON.stringify(modelData), "utf8", function (err) {
          if (err != null) {
            console.log("Error Found writing block model data:", err);
          }
        });
        zip.file("assets/" + this.properties.namespace + "/models/block/" + name + "_post.json", JSON.stringify(modelData)); // Item

        modelData["parent"] = "minecraft:block/wall_inventory";
        fs.writeFile(itemModelsFolder + "\\" + name + ".json", JSON.stringify(modelData), "utf8", function (err) {
          if (err != null) {
            console.log("Error Found writing item model data:", err);
          }
        });
        zip.file("assets/" + this.properties.namespace + "/models/item/" + name + ".json", JSON.stringify(modelData)); // Side

        modelData["parent"] = "minecraft:block/template_wall_side";
        fs.writeFile(blockModelsFolder + "\\" + name + "_side.json", JSON.stringify(modelData), "utf8", function (err) {
          if (err != null) {
            console.log("Error Found writing block model data:", err);
          }
        });
        zip.file("assets/" + this.properties.namespace + "/models/block/" + name + "_side.json", JSON.stringify(modelData)); // Side Tall

        modelData["parent"] = "minecraft:block/template_wall_side_tall";
        fs.writeFile(blockModelsFolder + "\\" + name + "_side_tall.json", JSON.stringify(modelData), "utf8", function (err) {
          if (err != null) {
            console.log("Error Found writing item model data:", err);
          }
        });
        zip.file("assets/" + this.properties.namespace + "/models/block/" + name + "_side_tall.json", JSON.stringify(modelData)); // Deal with the tags

        var wallTags = dataFolder + "minecraft\\tags\\blocks\\walls.json";
        var tagVal = this.properties.namespace + ":" + name;
        fs.mkdirSync(dataFolder + "minecraft\\tags\\blocks\\", {
          recursive: true
        });
        var tagData = {
          "replace": false,
          "values": [tagVal]
        };
        fs.writeFile(wallTags, JSON.stringify(tagData), "utf8", function (err) {
          if (err != null) {
            console.log("Error found when writing wall tags:", err);
          }
        });
        zip.file("data/minecraft/tags/blocks/walls.json", JSON.stringify(tagData));
      }

      var modelData = JSON.parse(codecData);
      var ns = this.properties.namespace;
      var animated = this.properties.animated; // Copy texture files

      Texture.all.forEach(function (tx) {
        var image;

        if (tx.namespace != "minecraft") {
          if (tx.img.currentSrc.slice(0, 4) == "data") {
            image = nativeImage.createFromDataURL(tx.img.currentSrc).toPNG();
          } else if (tx.img.currentSrc.slice(0, 4) == "file") {
            image = nativeImage.createFromPath(tx.source.replace(/\?\d+$/, '')).toPNG();
          }

          fs.writeFile(blockTexturesFolder + "\\" + (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.cleanFileName)(tx.name), image, function (err) {
            if (err != null) {
              console.log("Error Found writing texture data:", err);
            }
          });
          zip.file("assets/" + ns + "/textures/" + blockTextureFolderVersion + "/" + (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.cleanFileName)(tx.name), image);

          if (animated) {
            fs.writeFile(blockTexturesFolder + "\\" + (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.cleanFileName)(tx.name) + ".mcmeta", '{"animation" : {}}', function (err) {
              if (err != null) {
                console.log("Error Found writing animation data:", err);
              }
            });
            zip.file("assets/" + ns + "/textures/" + blockTextureFolderVersion + "/" + (0,_util_Utils_js__WEBPACK_IMPORTED_MODULE_20__.cleanFileName)(tx.name) + ".mcmeta", '{"animation" : {}}');
          }
        }
      });
      /*console.log("Block List:")
      console.log(blockList)*/

      blockList.forEach(function (block) {
        // Generate Mining file
        var mineableData = (0,_util_GenDataFiles_js__WEBPACK_IMPORTED_MODULE_19__.genMineableTag)(_this.properties.namespace, block["name"], block["types"]);
        var mineableTags = dataFolder + "minecraft\\tags\\blocks\\mineable\\pickaxe.json";
        fs.mkdirSync(dataFolder + "minecraft\\tags\\blocks\\mineable", {
          recursive: true
        });
        fs.writeFile(mineableTags, mineableData, "utf8", function (err) {
          if (err != null) {
            console.log("Error found when writing wall tags:", err);
          }
        });
        zip.file("data/minecraft/tags/blocks/mineable/pickaxe.json", mineableData); // Write state file

        fs.writeFile(blockstatesFolder + "\\" + block["name"] + ".json", block["state"], "utf8", function (err) {
          if (err != null) {
            console.log("Error generating blockstate:", err);
          }
        });
        zip.file("assets/" + _this.properties.namespace + "/blockstates/" + block["name"] + ".json", block["state"]); // Write model files

        fs.writeFile(blockModelsFolder + "\\" + block["name"] + ".json", JSON.stringify(block["model"]), "utf8", function (err) {
          if (err != null) {
            console.log("Error Found writing block model data:", err);
          }
        });
        zip.file("assets/" + _this.properties.namespace + "/models/block/" + block["name"] + ".json", JSON.stringify(block["model"]));
        fs.writeFile(itemModelsFolder + "\\" + block["name"] + ".json", JSON.stringify(block["model"]), "utf8", function (err) {
          if (err != null) {
            console.log("Error Found writing item model data:", err);
          }
        });
        zip.file("assets/" + _this.properties.namespace + "/models/item/" + block["name"] + ".json", JSON.stringify(block["model"])); // Write block properties file

        var data = {
          "displayName": _this.properties.displayName.replace(/[^a-zA-Z\d\s._]/g, ''),
          "typeList": block["types"],
          "material": _this.properties.material,
          "blastRes": _this.properties.blastRes,
          "slip": _this.properties.slip,
          "gravity": _this.properties.gravity,
          "rotType": _this.properties.rotType,
          "sounds": _this.properties.sounds,
          "lum": _this.properties.lum,
          "maxStack": _this.properties.maxStack,
          "fireproof": _this.properties.fireproof,
          "creativeTab": _this.properties.creativeTab,
          "transparency": _this.properties.transparency,
          "hitbox": block["hitbox"],
          "hitboxBuffer": _this.properties.bufferedHitbox ? _this.properties.hitboxBuffer.toString() : "",
          "blockType": _this.properties.types.customType,
          "particleType": _this.properties.particles ? _this.properties.particleType : "",
          "particlePos": [_this.properties.particlePos.x / 16.0, _this.properties.particlePos.y / 16.0, _this.properties.particlePos.z / 16.0],
          "particleSpread": [_this.properties.particleSpread.x / 8.0, _this.properties.particleSpread.y / 8.0, _this.properties.particleSpread.z / 8.0],
          "particleVel": [_this.properties.particleVel.x, _this.properties.particleVel.y, _this.properties.particleVel.z],
          "nameGenType": "3.3" // Allows for names where " " is replaced with "_" to coexist with the older "" system

        };
        fs.writeFile(objFolder + "\\" + block["name"] + ".json", JSON.stringify(data), "utf8", function (err) {
          if (err != null) {
            console.log("Error writing block properties:", err);
          }
        });
        zip.file("objects/" + block["name"] + ".json", JSON.stringify(data));
        /*console.log("Object File Contents:")
        console.log(data)*/
      });
      zip.generateAsync({
        type: "nodebuffer"
      }).then(function (content) {
        fs.writeFile(settings.minecraftFolder.value + "\\bamopacks\\" + packName + ".zip", content, function (err) {});
      });
      fs.rm(settings.minecraftFolder.value + "\\bamopacks\\" + packName, {
        recursive: true
      }, function (err) {});
      console.log("BAMO data saved in folder at location " + settings.minecraftFolder.value + "\\bamopacks\\" + packName);
      var e = open_interface;
      e.hide();
    }
  },
  watch: {
    properties: {
      handler: function handler(val) {
        if (this.swap == false) {
          Project.saved = false;
        } else {
          this.swap = false;
        }
      },
      deep: true
    }
  }
});

/***/ }),

/***/ "./src/util/Codec.js":
/*!***************************!*\
  !*** ./src/util/Codec.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "loadCodec": () => (/* binding */ loadCodec),
/* harmony export */   "unloadCodec": () => (/* binding */ unloadCodec)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.object.assign.js */ "./node_modules/core-js/modules/es.object.assign.js");
/* harmony import */ var core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.concat.js */ "./node_modules/core-js/modules/es.array.concat.js");
/* harmony import */ var core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ "./node_modules/core-js/modules/es.array.includes.js");
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.array.find.js */ "./node_modules/core-js/modules/es.array.find.js");
/* harmony import */ var core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.array.for-each.js */ "./node_modules/core-js/modules/es.array.for-each.js");
/* harmony import */ var core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.symbol.js */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.symbol.description.js */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator.js */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es.array.iterator.js */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/es.string.iterator.js */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _Settings__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./Settings */ "./src/util/Settings.js");
















function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }


function loadCodec() {
  Codecs.project.on('compile', onProjectCompile);
  Codecs.project.on('parse', onProjectParse);
  Blockbench.on('close_project', onCloseProject);
}
function unloadCodec() {
  Codecs.project.events.compile.remove(onProjectCompile);
  Codecs.project.events.parse.remove(onProjectParse);
  format["delete"]();
}

function onProjectCompile(e) {
  if (format.id !== "bamo_model") return;
  e.model.bamoSettings = _Settings__WEBPACK_IMPORTED_MODULE_15__["default"][Project.uuid];
}

function onProjectParse(e) {
  if (format.id !== "bamo_model") return;

  if (e.model && _typeof(e.model.bamoSettings) === 'object') {
    var placeholder = Object.assign({}, _Settings__WEBPACK_IMPORTED_MODULE_15__.BAMO_SETTINGS_DEFAULT);
    _Settings__WEBPACK_IMPORTED_MODULE_15__["default"][Project.uuid] = Object.assign(placeholder, e.model.bamoSettings);
  } else {
    _Settings__WEBPACK_IMPORTED_MODULE_15__["default"][Project.uuid] = Object.assign({}, _Settings__WEBPACK_IMPORTED_MODULE_15__.BAMO_SETTINGS_DEFAULT);
    _Settings__WEBPACK_IMPORTED_MODULE_15__["default"][Project.uuid].displayName = Project.name;
  }

  console.log(_Settings__WEBPACK_IMPORTED_MODULE_15__["default"][Project.uuid]);
}

function onCloseProject() {
  if (format.id !== "bamo_model") return;
  delete _Settings__WEBPACK_IMPORTED_MODULE_15__["default"][Project.uuid];
}

var codec = Codecs.java_block;
var format = new ModelFormat({
  id: "bamo_model",
  name: "BAMO model",
  category: "minecraft",
  description: "A format for storing models to be exported for the BAMO mod",
  icon: "view_in_ar",
  target: 'Minecraft: Java Edition',
  format_page: {
    content: [{
      type: 'h3',
      text: tl('mode.start.format.informations')
    }, {
      text: "* ".concat(tl('format.java_block.info.rotation'), "\n\t\t\t\t\t* ").concat(tl('format.java_block.info.size'), "\n\t\t\t\t\t* ").concat(tl('format.java_block.info.animation')).replace(/\t+/g, '')
    }]
  },
  render_sides: function render_sides() {
    if (Modes.display && ['thirdperson_righthand', 'thirdperson_lefthand', 'head'].includes(display_slot)) {
      return 'double';
    } else {
      return 'front';
    }
  },
  model_identifier: false,
  parent_model_id: true,
  vertex_color_ambient_occlusion: true,
  rotate_cubes: true,
  rotation_limit: true,
  optional_box_uv: true,
  uv_rotation: true,
  java_face_properties: true,
  animated_textures: true,
  select_texture_for_particles: true,
  display_mode: true,
  texture_folder: true,
  cube_size_limiter: {
    coordinate_limits: [-16, 32],
    test: function test(cube) {
      var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var from = values.from || cube.from;
      var to = values.to || cube.to;
      var inflate = values.inflate == undefined ? cube.inflate : values.inflate;
      return undefined !== from.find(function (v, i) {
        return to[i] + inflate > 32 || to[i] + inflate < -16 || from[i] - inflate > 32 || from[i] - inflate < -16;
      });
    },
    move: function move(cube) {
      var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var from = values.from || cube.from;
      var to = values.to || cube.to;
      var inflate = values.inflate == undefined ? cube.inflate : values.inflate;
      [0, 1, 2].forEach(function (ax) {
        var overlap = to[ax] + inflate - 32;

        if (overlap > 0) {
          //If positive site overlaps
          from[ax] -= overlap;
          to[ax] -= overlap;

          if (16 + from[ax] - inflate < 0) {
            from[ax] = -16 + inflate;
          }
        } else {
          overlap = from[ax] - inflate + 16;

          if (overlap < 0) {
            from[ax] -= overlap;
            to[ax] -= overlap;

            if (to[ax] + inflate > 32) {
              to[ax] = 32 - inflate;
            }
          }
        }
      });
    },
    clamp: function clamp(cube) {
      var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var from = values.from || cube.from;
      var to = values.to || cube.to;
      var inflate = values.inflate == undefined ? cube.inflate : values.inflate;
      [0, 1, 2].forEach(function (ax) {
        from[ax] = Math.clamp(from[ax] - inflate, -16, 32) + inflate;
        to[ax] = Math.clamp(to[ax] + inflate, -16, 32) - inflate;
      });
    }
  },
  codec: codec
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (codec);

/***/ }),

/***/ "./src/util/GenDataFiles.js":
/*!**********************************!*\
  !*** ./src/util/GenDataFiles.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "genLootTable": () => (/* binding */ genLootTable),
/* harmony export */   "genMineableTag": () => (/* binding */ genMineableTag),
/* harmony export */   "genStonecuttingRecipe": () => (/* binding */ genStonecuttingRecipe),
/* harmony export */   "genStonecuttingRecipes": () => (/* binding */ genStonecuttingRecipes),
/* harmony export */   "genStonecuttingReverseRecipe": () => (/* binding */ genStonecuttingReverseRecipe)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.concat.js */ "./node_modules/core-js/modules/es.array.concat.js");
/* harmony import */ var core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.for-each.js */ "./node_modules/core-js/modules/es.array.for-each.js");
/* harmony import */ var core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_3__);




function genLootTable(namespace, block) {
  return "{\n    \"type\": \"minecraft:block\",\n    \"pools\": [\n        {\n            \"rolls\": 1,\n            \"entries\": [\n                {\n                    \"type\": \"minecraft:item\",\n                    \"name\": \"".concat(namespace, ":").concat(block, "\"\n                }\n            ],\n            \"conditions\": []\n        }\n    ]\n}");
}
function genMineableTag(namespace, block, variants) {
  if (variants.length == 0) {
    return "{\n    \"replace\": false,\n    \"values\": [\n        \"".concat(namespace, ":").concat(block, "\"\n    ]\n}");
  } else {
    var tagValues = ["".concat(namespace, ":").concat(block)];
    variants.forEach(function (v) {
      tagValues.push("".concat(namespace, ":").concat(block, "_").concat(v));
    });
    var data = {
      "replace": false,
      "values": tagValues
    };
    return JSON.stringify(data);
  }
}
function genStonecuttingRecipes(properties, blockName, dataFolder, zip) {
  console.log(properties);

  if (properties.genScRecipe) {
    var stData = genStonecuttingRecipe(properties.namespace, blockName);
    var stDir = dataFolder + properties.namespace + "\\recipes\\";
    fs.mkdirSync(stDir, {
      recursive: true
    });
    fs.writeFile(stDir + blockName + ".json", stData, "utf8", function (err) {
      if (err != null) {
        console.log("Error found when writing custom block stonecutting recipe:", err);
      }
    });
    zip.file("data/" + properties.namespace + "/recipes/" + blockName + ".json", stData);
  }

  if (properties.genReversableScRecipe) {
    var stData = genStonecuttingReverseRecipe(properties.namespace, blockName);
    var stDir = dataFolder + properties.namespace + "\\recipes\\";
    fs.mkdirSync(stDir, {
      recursive: true
    });
    fs.writeFile(stDir + blockName + "_rv.json", stData, "utf8", function (err) {
      if (err != null) {
        console.log("Error found when writing custom block stonecutting recipe:", err);
      }
    });
    zip.file("data/" + properties.namespace + "/recipes/" + blockName + "_rv.json", stData);
  }
}
function genStonecuttingRecipe(namespace, block) {
  return "\n    {\n        \"type\": \"minecraft:stonecutting\",\n        \"ingredient\": {\n            \"item\": \"bamo:bamo_crate\"\n        },\n        \"result\": \"".concat(namespace, ":").concat(block, "\",\n        \"count\": 1\n    }");
}
function genStonecuttingReverseRecipe(namespace, block) {
  return "\n    {\n        \"type\": \"minecraft:stonecutting\",\n        \"ingredient\": {\n            \"item\": \"".concat(namespace, ":").concat(block, "\"\n        },\n        \"result\": \"bamo:bamo_crate\",\n        \"count\": 1\n    }");
}

/***/ }),

/***/ "./src/util/GenStates.js":
/*!*******************************!*\
  !*** ./src/util/GenStates.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "genStairState": () => (/* binding */ genStairState),
/* harmony export */   "genWallState": () => (/* binding */ genWallState)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.concat.js */ "./node_modules/core-js/modules/es.array.concat.js");
/* harmony import */ var core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_0__);

function genStairState(namespace, model, outer, inner) {
  return "\n    {\n        \"variants\": {\n            \"facing=east,half=bottom,shape=straight\": { \"model\": \"".concat(namespace, ":").concat(model, "\" },\n            \"facing=west,half=bottom,shape=straight\": { \"model\": \"").concat(namespace, ":").concat(model, "\", \"y\": 180, \"uvlock\": true },\n            \"facing=south,half=bottom,shape=straight\": { \"model\": \"").concat(namespace, ":").concat(model, "\", \"y\": 90, \"uvlock\": true },\n            \"facing=north,half=bottom,shape=straight\": { \"model\": \"").concat(namespace, ":").concat(model, "\", \"y\": 270, \"uvlock\": true },\n\n            \"facing=east,half=top,shape=straight\": { \"model\": \"").concat(namespace, ":").concat(model, "\", \"x\": 180, \"uvlock\": true },\n            \"facing=west,half=top,shape=straight\": { \"model\": \"").concat(namespace, ":").concat(model, "\", \"x\": 180, \"y\": 180, \"uvlock\": true },\n            \"facing=south,half=top,shape=straight\": { \"model\": \"").concat(namespace, ":").concat(model, "\", \"x\": 180, \"y\": 90, \"uvlock\": true },\n            \"facing=north,half=top,shape=straight\": { \"model\": \"").concat(namespace, ":").concat(model, "\", \"x\": 180, \"y\": 270, \"uvlock\": true },\n            \n            \"facing=east,half=bottom,shape=outer_right\": { \"model\": \"").concat(namespace, ":").concat(outer, "\" },\n            \"facing=west,half=bottom,shape=outer_right\": { \"model\": \"").concat(namespace, ":").concat(outer, "\", \"y\": 180, \"uvlock\": true },\n            \"facing=south,half=bottom,shape=outer_right\": { \"model\": \"").concat(namespace, ":").concat(outer, "\", \"y\": 90, \"uvlock\": true },\n            \"facing=north,half=bottom,shape=outer_right\": { \"model\": \"").concat(namespace, ":").concat(outer, "\", \"y\": 270, \"uvlock\": true },\n\n            \"facing=east,half=bottom,shape=outer_left\": { \"model\": \"").concat(namespace, ":").concat(outer, "\", \"y\": 270, \"uvlock\": true },\n            \"facing=west,half=bottom,shape=outer_left\": { \"model\": \"").concat(namespace, ":").concat(outer, "\", \"y\": 90, \"uvlock\": true },\n            \"facing=south,half=bottom,shape=outer_left\": { \"model\": \"").concat(namespace, ":").concat(outer, "\" },\n            \"facing=north,half=bottom,shape=outer_left\": { \"model\": \"").concat(namespace, ":").concat(outer, "\", \"y\": 180, \"uvlock\": true },\n\n            \"facing=east,half=bottom,shape=inner_right\": { \"model\": \"").concat(namespace, ":").concat(inner, "\" },\n            \"facing=west,half=bottom,shape=inner_right\": { \"model\": \"").concat(namespace, ":").concat(inner, "\", \"y\": 180, \"uvlock\": true },\n            \"facing=south,half=bottom,shape=inner_right\": { \"model\": \"").concat(namespace, ":").concat(inner, "\", \"y\": 90, \"uvlock\": true },\n            \"facing=north,half=bottom,shape=inner_right\": { \"model\": \"").concat(namespace, ":").concat(inner, "\", \"y\": 270, \"uvlock\": true },\n\n            \"facing=east,half=bottom,shape=inner_left\": { \"model\": \"").concat(namespace, ":").concat(inner, "\", \"y\": 270, \"uvlock\": true },\n            \"facing=west,half=bottom,shape=inner_left\": { \"model\": \"").concat(namespace, ":").concat(inner, "\", \"y\": 90, \"uvlock\": true },\n            \"facing=south,half=bottom,shape=inner_left\": { \"model\": \"").concat(namespace, ":").concat(inner, "\" },\n            \"facing=north,half=bottom,shape=inner_left\": { \"model\": \"").concat(namespace, ":").concat(inner, "\", \"y\": 180, \"uvlock\": true },\n           \n            \"facing=east,half=top,shape=outer_left\": { \"model\": \"").concat(namespace, ":").concat(outer, "\", \"x\": 180, \"uvlock\": true },\n            \"facing=west,half=top,shape=outer_left\": { \"model\": \"").concat(namespace, ":").concat(outer, "\", \"x\": 180, \"y\": 180, \"uvlock\": true },\n            \"facing=south,half=top,shape=outer_left\": { \"model\": \"").concat(namespace, ":").concat(outer, "\", \"x\": 180, \"y\": 90, \"uvlock\": true },\n            \"facing=north,half=top,shape=outer_left\": { \"model\": \"").concat(namespace, ":").concat(outer, "\", \"x\": 180, \"y\": 270, \"uvlock\": true },\n\n            \"facing=east,half=top,shape=outer_right\": { \"model\": \"").concat(namespace, ":").concat(outer, "\", \"x\": 180, \"y\": 90, \"uvlock\": true },\n            \"facing=west,half=top,shape=outer_right\": { \"model\": \"").concat(namespace, ":").concat(outer, "\", \"x\": 180, \"y\": 270, \"uvlock\": true },\n            \"facing=south,half=top,shape=outer_right\": { \"model\": \"").concat(namespace, ":").concat(outer, "\", \"x\": 180, \"y\": 180, \"uvlock\": true },\n            \"facing=north,half=top,shape=outer_right\": { \"model\": \"").concat(namespace, ":").concat(outer, "\", \"x\": 180, \"uvlock\": true },\n\n            \"facing=east,half=top,shape=inner_left\": { \"model\": \"").concat(namespace, ":").concat(inner, "\", \"x\": 180, \"uvlock\": true },\n            \"facing=west,half=top,shape=inner_left\": { \"model\": \"").concat(namespace, ":").concat(inner, "\", \"x\": 180, \"y\": 180, \"uvlock\": true },\n            \"facing=south,half=top,shape=inner_left\": { \"model\": \"").concat(namespace, ":").concat(inner, "\", \"x\": 180, \"y\": 90, \"uvlock\": true },\n            \"facing=north,half=top,shape=inner_left\": { \"model\": \"").concat(namespace, ":").concat(inner, "\", \"x\": 180, \"y\": 270, \"uvlock\": true },\n\n            \"facing=east,half=top,shape=inner_right\": { \"model\": \"").concat(namespace, ":").concat(inner, "\", \"x\": 180, \"y\": 90, \"uvlock\": true },\n            \"facing=west,half=top,shape=inner_right\": { \"model\": \"").concat(namespace, ":").concat(inner, "\", \"x\": 180, \"y\": 270, \"uvlock\": true },\n            \"facing=south,half=top,shape=inner_right\": { \"model\": \"").concat(namespace, ":").concat(inner, "\", \"x\": 180, \"y\": 180, \"uvlock\": true },\n            \"facing=north,half=top,shape=inner_right\": { \"model\": \"").concat(namespace, ":").concat(inner, "\", \"x\": 180, \"uvlock\": true }\n        }\n    }");
}
function genWallState(namespace, post, side, tall) {
  return "{\n        \"multipart\":[\n            {\"when\":{\"up\":\"true\"},\"apply\":{\"model\":\"".concat(namespace, ":").concat(post, "\"}},\n            {\"when\":{\"north\":\"low\"},\"apply\":{\"model\":\"").concat(namespace, ":").concat(side, "\",\"uvlock\":true}},\n            {\"when\":{\"east\":\"low\"},\"apply\":{\"model\":\"").concat(namespace, ":").concat(side, "\",\"y\":90,\"uvlock\":true}},\n            {\"when\":{\"south\":\"low\"},\"apply\":{\"model\":\"").concat(namespace, ":").concat(side, "\",\"y\":180,\"uvlock\":true}},\n            {\"when\":{\"west\":\"low\"},\"apply\":{\"model\":\"").concat(namespace, ":").concat(side, "\",\"y\":270,\"uvlock\":true}},\n            {\"when\":{\"north\":\"tall\"},\"apply\":{\"model\":\"").concat(namespace, ":").concat(tall, "\",\"uvlock\":true}},\n            {\"when\":{\"east\":\"tall\"},\"apply\":{\"model\":\"").concat(namespace, ":").concat(tall, "\",\"y\":90,\"uvlock\":true}},\n            {\"when\":{\"south\":\"tall\"},\"apply\":{\"model\":\"").concat(namespace, ":").concat(tall, "\",\"y\":180,\"uvlock\":true}},\n            {\"when\":{\"west\":\"tall\"},\"apply\":{\"model\":\"").concat(namespace, ":").concat(tall, "\",\"y\":270,\"uvlock\":true}}\n        ]\n    }");
}

/***/ }),

/***/ "./src/util/OptionArrays.js":
/*!**********************************!*\
  !*** ./src/util/OptionArrays.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "customTypeOptions": () => (/* binding */ customTypeOptions),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "materialOptions": () => (/* binding */ materialOptions),
/* harmony export */   "particleOptions": () => (/* binding */ particleOptions),
/* harmony export */   "rotationTypes": () => (/* binding */ rotationTypes),
/* harmony export */   "soundOptions": () => (/* binding */ soundOptions),
/* harmony export */   "tabOptions": () => (/* binding */ tabOptions),
/* harmony export */   "transparencyOptions": () => (/* binding */ transparencyOptions)
/* harmony export */ });
var rotationTypes = ["default", //"axis",
//"y_axis_player",
"y_axis" //"all_player",
//"all",
];
var soundOptions = ["Grass", "Glass", "Gravel", "Honey", "Metal", "Sand", "Snow", "Stone", "Wool", "Wood", "Ancient Debris", "Anvil", "Bamboo", "Bamboo Sapling", "Basalt", "Bone Brick", "Chain", "Coral Block", "Crop", "Fungus", "Gilded Blackstone", "Hard Crop", "Ladder", "Lantern", "Lily Pad", "Lodestone", "Netherite Block", "Netherrack", "Nether Bricks", "Nether Gold Ore", "Nether Ore", "Nether Sprouts", "Nether Wart", "Nylium", "Roots", "Scaffolding", "Shroomlight", "Slime Block", "Soul Sand", "Stem", "Sweet Berry Bush", "Twisting Vines", "Vine", "Wart Block", "Weeping Vines", "Wet Grass"];
var materialOptions = ["Dirt", "Air", "Bamboo", "Bamboo Sapling", "Barrier", "Bubble Column", "Buildable Glass", "Cactus", "Cake", "Clay", "Coral", "Cloth Decoration", "Decoration", "Egg", "Explosive", "Fire", "Glass", "Grass", "Heavy Metal", "Ice", "Ice Solid", "Lava", "Leaves", "Metal", "Nether Wood", "Piston", "Plant", "Portal", "Replaceable Plant", "Replaceable Fireproof Plant", "Replaceable Water Plant", "Sand", "Shulker Shell", "Snow", "Sponge", "Stone", "Structural Air", "Top Snow", "Vegetable", "Water", "Water Plant", "Web", "Wood", "Wool"];
var transparencyOptions = ["Solid", "Translucent", "Cutout", "Cutout (Mipped)"];
var tabOptions = ["Building Blocks", "Brewing", "Combat", "Food", "Decorations", "Misc", "Redstone", "Tools", "Transportation"];
var particleOptions = ["Ambient Entity Effect", "Angry Villager", "Ash", "Bubble", "Bubble Pop", "Campfire Smoke", "Cloud", "Composter", "Crimson Spore", "Crit", "Damage Indicator", "Dolphin", "Dripping Dripstone Lava", "Dripping Dripstone Water", "Dripping Honey", "Dripping Lava", "Dripping Obsidian Tear", "Dripping Water", "Elder Guardian", "Electric Spark", "Enchant", "Enchanted Hit", "End Rod", "Entity Effect", "Explosion", "Falling Dripstone Lava", "Falling Dripstone Water", "Falling Honey", "Falling Lava", "Falling Nectar", "Falling Obsidian Tear", "Falling Spore Blossom", "Falling Water", "Firework", "Fishing", "Flame", "Flash", "Glow", "Glow Squid Ink", "Happy Villager", "Heart", "Slime Item", "Snowball item", "Landing Honey", "Landing Lava", "Landing Obsidian Tear", "Lava", "Mycelium", "Nautilus", "Note", "Rain", "Reverse Portal", "Scrape", "Small Flame", "Snowflake", "Soul", "Soulfire Flame", "Spore Blossom Air", "Sweep Attack", "Totem of Undying", "Undewater", "Warped Spore", "Wax off", "Wax On", "White Ash", "Witch"];
var customTypeOptions = ["Default", "Flower"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  rotationTypes: rotationTypes,
  soundOptions: soundOptions,
  materialOptions: materialOptions,
  transparencyOptions: transparencyOptions,
  tabOptions: tabOptions,
  customTypeOptions: customTypeOptions
});

/***/ }),

/***/ "./src/util/Settings.js":
/*!******************************!*\
  !*** ./src/util/Settings.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BAMO_SETTINGS_DEFAULT": () => (/* binding */ BAMO_SETTINGS_DEFAULT),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_object_freeze_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.object.freeze.js */ "./node_modules/core-js/modules/es.object.freeze.js");
/* harmony import */ var core_js_modules_es_object_freeze_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_freeze_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.object.assign.js */ "./node_modules/core-js/modules/es.object.assign.js");
/* harmony import */ var core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_1__);


var BAMO_SETTINGS_DEFAULT = {
  displayName: "",
  namespace: "bamo",
  version: "1.20.1",
  typeList: [],
  material: "Dirt",
  blastRes: 6,
  slip: 0.6,
  gravity: false,
  rotType: "default",
  sounds: "Grass",
  lum: 0,
  maxStack: 64,
  fireproof: true,
  creativeTab: "Building Blocks",
  transparency: "Solid",
  blockType: "Default",
  types: {
    custom: true,
    customType: "Default",
    block: false,
    stair: false,
    slab: false,
    wall: false
  },
  variant: {
    "default": {
      all: ""
    },
    stair: {
      top: "",
      bottom: "",
      side: "",
      particle: ""
    },
    slab: {
      top: "",
      bottom: "",
      side: "",
      particle: ""
    },
    wall: {
      wall: "",
      particle: ""
    }
  },
  particles: false,
  particleType: "Rain",
  particlePos: {
    x: 8,
    y: 8,
    z: 8
  },
  particleSpread: {
    x: 1,
    y: 1,
    z: 1
  },
  particleVel: {
    x: 0.1,
    y: 0.1,
    z: 0.1
  },
  bufferedHitbox: true,
  hitboxBuffer: 0.5,
  genScRecipe: true,
  genReversableScRecipe: true,
  animated: false
};
Object.freeze(BAMO_SETTINGS_DEFAULT);
var bamoSettings = {};
bamoSettings[""] = Object.assign({}, BAMO_SETTINGS_DEFAULT);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (bamoSettings);

/***/ }),

/***/ "./src/util/Utils.js":
/*!***************************!*\
  !*** ./src/util/Utils.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cleanFileName": () => (/* binding */ cleanFileName),
/* harmony export */   "dictFromTexture": () => (/* binding */ dictFromTexture)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.for-each.js */ "./node_modules/core-js/modules/es.array.for-each.js");
/* harmony import */ var core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.string.split.js */ "./node_modules/core-js/modules/es.string.split.js");
/* harmony import */ var core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "./node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_6__);







function dictFromTexture(image, ns, name) {
  var ret = "";
  Texture.all.forEach(function (tx) {
    if (tx.name == image || image == "particle" && tx.particle == true) {
      if (tx.namespace == "") {
        ret = ns + ":blocks/" + name + "_" + cleanFileName(tx.name.split(".")[0]);
      } else {
        ret = tx.namespace + ":" + tx.folder + "/" + cleanFileName(tx.name.split(".")[0]);
      }
    }
  });
  return ret;
}
function cleanFileName(name) {
  return name.replace(/[^a-zA-Z\d\s._]/g, '').replace(/\s+/g, "_").toLowerCase();
}

/***/ }),

/***/ "./node_modules/core-js/internals/a-callable.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/a-callable.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ "./node_modules/core-js/internals/a-constructor.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/a-constructor.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js/internals/is-constructor.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");

var $TypeError = TypeError;

// `Assert: IsConstructor(argument) is true`
module.exports = function (argument) {
  if (isConstructor(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a constructor');
};


/***/ }),

/***/ "./node_modules/core-js/internals/a-possible-prototype.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/a-possible-prototype.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ "./node_modules/core-js/internals/add-to-unscopables.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/add-to-unscopables.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "./node_modules/core-js/internals/advance-string-index.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/advance-string-index.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var charAt = (__webpack_require__(/*! ../internals/string-multibyte */ "./node_modules/core-js/internals/string-multibyte.js").charAt);

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};


/***/ }),

/***/ "./node_modules/core-js/internals/an-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/an-object.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-buffer-non-extensible.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/array-buffer-non-extensible.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// FF26- bug: ArrayBuffers are non-extensible, but Object.isExtensible does not report it
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = fails(function () {
  if (typeof ArrayBuffer == 'function') {
    var buffer = new ArrayBuffer(8);
    // eslint-disable-next-line es-x/no-object-isextensible, es-x/no-object-defineproperty -- safe
    if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', { value: 8 });
  }
});


/***/ }),

/***/ "./node_modules/core-js/internals/array-for-each.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/array-for-each.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $forEach = (__webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").forEach);
var arrayMethodIsStrict = __webpack_require__(/*! ../internals/array-method-is-strict */ "./node_modules/core-js/internals/array-method-is-strict.js");

var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
module.exports = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es-x/no-array-prototype-foreach -- safe
} : [].forEach;


/***/ }),

/***/ "./node_modules/core-js/internals/array-includes.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/array-includes.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-iteration.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/array-iteration.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var arraySpeciesCreate = __webpack_require__(/*! ../internals/array-species-create */ "./node_modules/core-js/internals/array-species-create.js");

var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var length = lengthOfArrayLike(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-method-has-species-support.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js/internals/array-method-has-species-support.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js/internals/engine-v8-version.js");

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-method-is-strict.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/array-method-is-strict.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-slice-simple.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/array-slice-simple.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js/internals/create-property.js");

var $Array = Array;
var max = Math.max;

module.exports = function (O, start, end) {
  var length = lengthOfArrayLike(O);
  var k = toAbsoluteIndex(start, length);
  var fin = toAbsoluteIndex(end === undefined ? length : end, length);
  var result = $Array(max(fin - k, 0));
  for (var n = 0; k < fin; k++, n++) createProperty(result, n, O[k]);
  result.length = n;
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-slice.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/array-slice.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = uncurryThis([].slice);


/***/ }),

/***/ "./node_modules/core-js/internals/array-species-constructor.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/array-species-constructor.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js/internals/is-array.js");
var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js/internals/is-constructor.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var SPECIES = wellKnownSymbol('species');
var $Array = Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? $Array : C;
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-species-create.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/array-species-create.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arraySpeciesConstructor = __webpack_require__(/*! ../internals/array-species-constructor */ "./node_modules/core-js/internals/array-species-constructor.js");

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/classof-raw.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/classof-raw.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ "./node_modules/core-js/internals/classof.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/classof.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js/internals/to-string-tag-support.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/copy-constructor-properties.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/copy-constructor-properties.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var ownKeys = __webpack_require__(/*! ../internals/own-keys */ "./node_modules/core-js/internals/own-keys.js");
var getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/correct-prototype-getter.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/correct-prototype-getter.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es-x/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ "./node_modules/core-js/internals/create-iterator-constructor.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-iterator-constructor.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var IteratorPrototype = (__webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js/internals/iterators-core.js").IteratorPrototype);
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-non-enumerable-property.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/create-non-enumerable-property.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-property-descriptor.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-property-descriptor.js ***!
  \**********************************************************************/
/***/ ((module) => {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-property.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/create-property.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-built-in.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/define-built-in.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var makeBuiltIn = __webpack_require__(/*! ../internals/make-built-in */ "./node_modules/core-js/internals/make-built-in.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    if (!options.unsafe) delete O[key];
    else if (O[key]) simple = true;
    if (simple) O[key] = value;
    else createNonEnumerableProperty(O, key, value);
  } return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-global-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/define-global-property.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-iterator.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/define-iterator.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");
var FunctionName = __webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js/internals/function-name.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var createIteratorConstructor = __webpack_require__(/*! ../internals/create-iterator-constructor */ "./node_modules/core-js/internals/create-iterator-constructor.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");
var IteratorsCore = __webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js/internals/iterators-core.js");

var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return call(nativeIterator, this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
  }
  Iterators[NAME] = defaultIterator;

  return methods;
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-well-known-symbol.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/define-well-known-symbol.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var path = __webpack_require__(/*! ../internals/path */ "./node_modules/core-js/internals/path.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var wrappedWellKnownSymbolModule = __webpack_require__(/*! ../internals/well-known-symbol-wrapped */ "./node_modules/core-js/internals/well-known-symbol-wrapped.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!hasOwn(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};


/***/ }),

/***/ "./node_modules/core-js/internals/descriptors.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/descriptors.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),

/***/ "./node_modules/core-js/internals/document-create-element.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/document-create-element.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ "./node_modules/core-js/internals/does-not-exceed-safe-integer.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/does-not-exceed-safe-integer.js ***!
  \************************************************************************/
/***/ ((module) => {

var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/dom-iterables.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/dom-iterables.js ***!
  \*********************************************************/
/***/ ((module) => {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),

/***/ "./node_modules/core-js/internals/dom-token-list-prototype.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/dom-token-list-prototype.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
var documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");

var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;

module.exports = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;


/***/ }),

/***/ "./node_modules/core-js/internals/engine-user-agent.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-user-agent.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),

/***/ "./node_modules/core-js/internals/engine-v8-version.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-v8-version.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js/internals/engine-user-agent.js");

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ "./node_modules/core-js/internals/enum-bug-keys.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/enum-bug-keys.js ***!
  \*********************************************************/
/***/ ((module) => {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ "./node_modules/core-js/internals/export.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/export.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js").f);
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");
var copyConstructorProperties = __webpack_require__(/*! ../internals/copy-constructor-properties */ "./node_modules/core-js/internals/copy-constructor-properties.js");
var isForced = __webpack_require__(/*! ../internals/is-forced */ "./node_modules/core-js/internals/is-forced.js");

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/fails.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/internals/fails.js ***!
  \*************************************************/
/***/ ((module) => {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4` since it's moved to entry points
__webpack_require__(/*! ../modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var regexpExec = __webpack_require__(/*! ../internals/regexp-exec */ "./node_modules/core-js/internals/regexp-exec.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");

var SPECIES = wellKnownSymbol('species');
var RegExpPrototype = RegExp.prototype;

module.exports = function (KEY, exec, FORCED, SHAM) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    FORCED
  ) {
    var uncurriedNativeRegExpMethod = uncurryThis(/./[SYMBOL]);
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      var uncurriedNativeMethod = uncurryThis(nativeMethod);
      var $exec = regexp.exec;
      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };
        }
        return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };
      }
      return { done: false };
    });

    defineBuiltIn(String.prototype, KEY, methods[0]);
    defineBuiltIn(RegExpPrototype, SYMBOL, methods[1]);
  }

  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
};


/***/ }),

/***/ "./node_modules/core-js/internals/freezing.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/freezing.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  // eslint-disable-next-line es-x/no-object-isextensible, es-x/no-object-preventextensions -- required for testing
  return Object.isExtensible(Object.preventExtensions({}));
});


/***/ }),

/***/ "./node_modules/core-js/internals/function-apply.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/function-apply.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es-x/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ }),

/***/ "./node_modules/core-js/internals/function-bind-context.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind-context.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-bind-native.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind-native.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  // eslint-disable-next-line es-x/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ "./node_modules/core-js/internals/function-call.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-call.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-name.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-name.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var bind = FunctionPrototype.bind;
var call = FunctionPrototype.call;
var uncurryThis = NATIVE_BIND && bind.bind(call, call);

module.exports = NATIVE_BIND ? function (fn) {
  return fn && uncurryThis(fn);
} : function (fn) {
  return fn && function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-built-in.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/get-built-in.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-method.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/get-method.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return func == null ? undefined : aCallable(func);
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-substitution.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/get-substitution.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");

var floor = Math.floor;
var charAt = uncurryThis(''.charAt);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

// `GetSubstitution` abstract operation
// https://tc39.es/ecma262/#sec-getsubstitution
module.exports = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace(replacement, symbols, function (match, ch) {
    var capture;
    switch (charAt(ch, 0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return stringSlice(str, 0, position);
      case "'": return stringSlice(str, tailPos);
      case '<':
        capture = namedCaptures[stringSlice(ch, 1, -1)];
        break;
      default: // \d\d?
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? charAt(ch, 1) : captures[f - 1] + charAt(ch, 1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};


/***/ }),

/***/ "./node_modules/core-js/internals/global.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/global.js ***!
  \**************************************************/
/***/ ((module) => {

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es-x/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ "./node_modules/core-js/internals/has-own-property.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/has-own-property.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es-x/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ "./node_modules/core-js/internals/hidden-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/hidden-keys.js ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js/internals/html.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/html.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ "./node_modules/core-js/internals/ie8-dom-define.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/ie8-dom-define.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var createElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js/internals/indexed-object.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/indexed-object.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ "./node_modules/core-js/internals/inspect-source.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/inspect-source.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ "./node_modules/core-js/internals/internal-metadata.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/internal-metadata.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);
var getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js");
var getOwnPropertyNamesExternalModule = __webpack_require__(/*! ../internals/object-get-own-property-names-external */ "./node_modules/core-js/internals/object-get-own-property-names-external.js");
var isExtensible = __webpack_require__(/*! ../internals/object-is-extensible */ "./node_modules/core-js/internals/object-is-extensible.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");
var FREEZING = __webpack_require__(/*! ../internals/freezing */ "./node_modules/core-js/internals/freezing.js");

var REQUIRED = false;
var METADATA = uid('meta');
var id = 0;

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + id++, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!hasOwn(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!hasOwn(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZING && REQUIRED && isExtensible(it) && !hasOwn(it, METADATA)) setMetadata(it);
  return it;
};

var enable = function () {
  meta.enable = function () { /* empty */ };
  REQUIRED = true;
  var getOwnPropertyNames = getOwnPropertyNamesModule.f;
  var splice = uncurryThis([].splice);
  var test = {};
  test[METADATA] = 1;

  // prevent exposing of metadata key
  if (getOwnPropertyNames(test).length) {
    getOwnPropertyNamesModule.f = function (it) {
      var result = getOwnPropertyNames(it);
      for (var i = 0, length = result.length; i < length; i++) {
        if (result[i] === METADATA) {
          splice(result, i, 1);
          break;
        }
      } return result;
    };

    $({ target: 'Object', stat: true, forced: true }, {
      getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
    });
  }
};

var meta = module.exports = {
  enable: enable,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;


/***/ }),

/***/ "./node_modules/core-js/internals/internal-state.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/internal-state.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var NATIVE_WEAK_MAP = __webpack_require__(/*! ../internals/native-weak-map */ "./node_modules/core-js/internals/native-weak-map.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var shared = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = uncurryThis(store.get);
  var wmhas = uncurryThis(store.has);
  var wmset = uncurryThis(store.set);
  set = function (it, metadata) {
    if (wmhas(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget(store, it) || {};
  };
  has = function (it) {
    return wmhas(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-array.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/is-array.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es-x/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) == 'Array';
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-callable.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/is-callable.js ***!
  \*******************************************************/
/***/ ((module) => {

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-constructor.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/is-constructor.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");

var noop = function () { /* empty */ };
var empty = [];
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;


/***/ }),

/***/ "./node_modules/core-js/internals/is-forced.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-forced.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ "./node_modules/core-js/internals/is-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-object.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-pure.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/is-pure.js ***!
  \***************************************************/
/***/ ((module) => {

module.exports = false;


/***/ }),

/***/ "./node_modules/core-js/internals/is-regexp.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-regexp.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-symbol.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-symbol.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ "./node_modules/core-js/internals/iterators-core.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/iterators-core.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es-x/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),

/***/ "./node_modules/core-js/internals/iterators.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/iterators.js ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js/internals/length-of-array-like.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/length-of-array-like.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/make-built-in.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/make-built-in.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js/internals/function-name.js").CONFIGURABLE);
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (String(name).slice(0, 7) === 'Symbol(') {
    name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    defineProperty(value, 'name', { value: name, configurable: true });
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ "./node_modules/core-js/internals/math-trunc.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/math-trunc.js ***!
  \******************************************************/
/***/ ((module) => {

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es-x/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ "./node_modules/core-js/internals/native-symbol-registry.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/native-symbol-registry.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/native-symbol */ "./node_modules/core-js/internals/native-symbol.js");

/* eslint-disable es-x/no-symbol -- safe */
module.exports = NATIVE_SYMBOL && !!Symbol['for'] && !!Symbol.keyFor;


/***/ }),

/***/ "./node_modules/core-js/internals/native-symbol.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/native-symbol.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable es-x/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js/internals/engine-v8-version.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ "./node_modules/core-js/internals/native-weak-map.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/native-weak-map.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(inspectSource(WeakMap));


/***/ }),

/***/ "./node_modules/core-js/internals/object-assign.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/object-assign.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js/internals/object-keys.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js/internals/object-get-own-property-symbols.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js/internals/object-property-is-enumerable.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");

// eslint-disable-next-line es-x/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
var defineProperty = Object.defineProperty;
var concat = uncurryThis([].concat);

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
module.exports = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es-x/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || call(propertyIsEnumerable, S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ }),

/***/ "./node_modules/core-js/internals/object-create.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/object-create.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var definePropertiesModule = __webpack_require__(/*! ../internals/object-define-properties */ "./node_modules/core-js/internals/object-define-properties.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");
var html = __webpack_require__(/*! ../internals/html */ "./node_modules/core-js/internals/html.js");
var documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es-x/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-define-properties.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-properties.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js/internals/v8-prototype-define-bug.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js/internals/object-keys.js");

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es-x/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-define-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-property.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js/internals/v8-prototype-define-bug.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");

var $TypeError = TypeError;
// eslint-disable-next-line es-x/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-descriptor.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-descriptor.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js/internals/object-property-is-enumerable.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");

// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-names-external.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-names-external.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable es-x/no-object-getownpropertynames -- safe */
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var $getOwnPropertyNames = (__webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js").f);
var arraySlice = __webpack_require__(/*! ../internals/array-slice-simple */ "./node_modules/core-js/internals/array-slice-simple.js");

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return arraySlice(windowNames);
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && classof(it) == 'Window'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-names.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-names.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es-x/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-symbols.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-symbols.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-prototype-of.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(/*! ../internals/correct-prototype-getter */ "./node_modules/core-js/internals/correct-prototype-getter.js");

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es-x/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-is-extensible.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/object-is-extensible.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var ARRAY_BUFFER_NON_EXTENSIBLE = __webpack_require__(/*! ../internals/array-buffer-non-extensible */ "./node_modules/core-js/internals/array-buffer-non-extensible.js");

// eslint-disable-next-line es-x/no-object-isextensible -- safe
var $isExtensible = Object.isExtensible;
var FAILS_ON_PRIMITIVES = fails(function () { $isExtensible(1); });

// `Object.isExtensible` method
// https://tc39.es/ecma262/#sec-object.isextensible
module.exports = (FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE) ? function isExtensible(it) {
  if (!isObject(it)) return false;
  if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) == 'ArrayBuffer') return false;
  return $isExtensible ? $isExtensible(it) : true;
} : $isExtensible;


/***/ }),

/***/ "./node_modules/core-js/internals/object-is-prototype-of.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-is-prototype-of.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ "./node_modules/core-js/internals/object-keys-internal.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys-internal.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var indexOf = (__webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js/internals/array-includes.js").indexOf);
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es-x/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-property-is-enumerable.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-property-is-enumerable.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ "./node_modules/core-js/internals/object-set-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-set-prototype-of.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable no-proto -- safe */
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var aPossiblePrototype = __webpack_require__(/*! ../internals/a-possible-prototype */ "./node_modules/core-js/internals/a-possible-prototype.js");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es-x/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
    setter = uncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ "./node_modules/core-js/internals/object-to-string.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/object-to-string.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js/internals/to-string-tag-support.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),

/***/ "./node_modules/core-js/internals/ordinary-to-primitive.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/ordinary-to-primitive.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "./node_modules/core-js/internals/own-keys.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/own-keys.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js/internals/object-get-own-property-symbols.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ "./node_modules/core-js/internals/path.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/path.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

module.exports = global;


/***/ }),

/***/ "./node_modules/core-js/internals/regexp-exec-abstract.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-exec-abstract.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var regexpExec = __webpack_require__(/*! ../internals/regexp-exec */ "./node_modules/core-js/internals/regexp-exec.js");

var $TypeError = TypeError;

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (isCallable(exec)) {
    var result = call(exec, R, S);
    if (result !== null) anObject(result);
    return result;
  }
  if (classof(R) === 'RegExp') return call(regexpExec, R, S);
  throw $TypeError('RegExp#exec called on incompatible receiver');
};


/***/ }),

/***/ "./node_modules/core-js/internals/regexp-exec.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-exec.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");
var regexpFlags = __webpack_require__(/*! ../internals/regexp-flags */ "./node_modules/core-js/internals/regexp-flags.js");
var stickyHelpers = __webpack_require__(/*! ../internals/regexp-sticky-helpers */ "./node_modules/core-js/internals/regexp-sticky-helpers.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var getInternalState = (__webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js").get);
var UNSUPPORTED_DOT_ALL = __webpack_require__(/*! ../internals/regexp-unsupported-dot-all */ "./node_modules/core-js/internals/regexp-unsupported-dot-all.js");
var UNSUPPORTED_NCG = __webpack_require__(/*! ../internals/regexp-unsupported-ncg */ "./node_modules/core-js/internals/regexp-unsupported-ncg.js");

var nativeReplace = shared('native-string-replace', String.prototype.replace);
var nativeExec = RegExp.prototype.exec;
var patchedExec = nativeExec;
var charAt = uncurryThis(''.charAt);
var indexOf = uncurryThis(''.indexOf);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  call(nativeExec, re1, 'a');
  call(nativeExec, re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

if (PATCH) {
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState(re);
    var str = toString(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = call(patchedExec, raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = call(regexpFlags, re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = replace(flags, 'y', '');
      if (indexOf(flags, 'g') === -1) {
        flags += 'g';
      }

      strCopy = stringSlice(str, re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt(str, re.lastIndex - 1) !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = call(nativeExec, sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = stringSlice(match.input, charsAdded);
        match[0] = stringSlice(match[0], charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      call(nativeReplace, match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) {
      match.groups = object = create(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "./node_modules/core-js/internals/regexp-flags.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-flags.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.hasIndices) result += 'd';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/regexp-get-flags.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-get-flags.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var regExpFlags = __webpack_require__(/*! ../internals/regexp-flags */ "./node_modules/core-js/internals/regexp-flags.js");

var RegExpPrototype = RegExp.prototype;

module.exports = function (R) {
  var flags = R.flags;
  return flags === undefined && !('flags' in RegExpPrototype) && !hasOwn(R, 'flags') && isPrototypeOf(RegExpPrototype, R)
    ? call(regExpFlags, R) : flags;
};


/***/ }),

/***/ "./node_modules/core-js/internals/regexp-sticky-helpers.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-sticky-helpers.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
var $RegExp = global.RegExp;

var UNSUPPORTED_Y = fails(function () {
  var re = $RegExp('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

// UC Browser bug
// https://github.com/zloirock/core-js/issues/1008
var MISSED_STICKY = UNSUPPORTED_Y || fails(function () {
  return !$RegExp('a', 'y').sticky;
});

var BROKEN_CARET = UNSUPPORTED_Y || fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = $RegExp('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

module.exports = {
  BROKEN_CARET: BROKEN_CARET,
  MISSED_STICKY: MISSED_STICKY,
  UNSUPPORTED_Y: UNSUPPORTED_Y
};


/***/ }),

/***/ "./node_modules/core-js/internals/regexp-unsupported-dot-all.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-unsupported-dot-all.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
var $RegExp = global.RegExp;

module.exports = fails(function () {
  var re = $RegExp('.', 's');
  return !(re.dotAll && re.exec('\n') && re.flags === 's');
});


/***/ }),

/***/ "./node_modules/core-js/internals/regexp-unsupported-ncg.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-unsupported-ncg.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
var $RegExp = global.RegExp;

module.exports = fails(function () {
  var re = $RegExp('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});


/***/ }),

/***/ "./node_modules/core-js/internals/require-object-coercible.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/require-object-coercible.js ***!
  \********************************************************************/
/***/ ((module) => {

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-to-string-tag.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/set-to-string-tag.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwn(target, TO_STRING_TAG)) {
    defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/shared-key.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/shared-key.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ "./node_modules/core-js/internals/shared-store.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/shared-store.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),

/***/ "./node_modules/core-js/internals/shared.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/shared.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.22.8',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.22.8/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ "./node_modules/core-js/internals/species-constructor.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/species-constructor.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var aConstructor = __webpack_require__(/*! ../internals/a-constructor */ "./node_modules/core-js/internals/a-constructor.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aConstructor(S);
};


/***/ }),

/***/ "./node_modules/core-js/internals/string-multibyte.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/string-multibyte.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);

var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),

/***/ "./node_modules/core-js/internals/symbol-define-to-primitive.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/symbol-define-to-primitive.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");

module.exports = function () {
  var Symbol = getBuiltIn('Symbol');
  var SymbolPrototype = Symbol && Symbol.prototype;
  var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

  if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
    // `Symbol.prototype[@@toPrimitive]` method
    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
    // eslint-disable-next-line no-unused-vars -- required for .length
    defineBuiltIn(SymbolPrototype, TO_PRIMITIVE, function (hint) {
      return call(valueOf, this);
    }, { arity: 1 });
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-absolute-index.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-absolute-index.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-indexed-object.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-indexed-object.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-integer-or-infinity.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/to-integer-or-infinity.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var trunc = __webpack_require__(/*! ../internals/math-trunc */ "./node_modules/core-js/internals/math-trunc.js");

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-length.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-length.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-object.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-primitive.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/to-primitive.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var ordinaryToPrimitive = __webpack_require__(/*! ../internals/ordinary-to-primitive */ "./node_modules/core-js/internals/ordinary-to-primitive.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-property-key.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/to-property-key.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js/internals/to-primitive.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-string-tag-support.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/to-string-tag-support.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ "./node_modules/core-js/internals/to-string.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-string.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ "./node_modules/core-js/internals/try-to-string.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/try-to-string.js ***!
  \*********************************************************/
/***/ ((module) => {

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/uid.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/internals/uid.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ "./node_modules/core-js/internals/use-symbol-as-uid.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/use-symbol-as-uid.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable es-x/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/native-symbol */ "./node_modules/core-js/internals/native-symbol.js");

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ "./node_modules/core-js/internals/v8-prototype-define-bug.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/v8-prototype-define-bug.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});


/***/ }),

/***/ "./node_modules/core-js/internals/well-known-symbol-wrapped.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/well-known-symbol-wrapped.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

exports.f = wellKnownSymbol;


/***/ }),

/***/ "./node_modules/core-js/internals/well-known-symbol.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/well-known-symbol.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/native-symbol */ "./node_modules/core-js/internals/native-symbol.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var symbolFor = Symbol && Symbol['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    var description = 'Symbol.' + name;
    if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.concat.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.concat.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js/internals/is-array.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var doesNotExceedSafeInteger = __webpack_require__(/*! ../internals/does-not-exceed-safe-integer */ "./node_modules/core-js/internals/does-not-exceed-safe-integer.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js/internals/create-property.js");
var arraySpeciesCreate = __webpack_require__(/*! ../internals/array-species-create */ "./node_modules/core-js/internals/array-species-create.js");
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js/internals/array-method-has-species-support.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js/internals/engine-v8-version.js");

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.es/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  concat: function concat(arg) {
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = lengthOfArrayLike(E);
        doesNotExceedSafeInteger(n + len);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        doesNotExceedSafeInteger(n + 1);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.find.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.find.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $find = (__webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").find);
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js/internals/add-to-unscopables.js");

var FIND = 'find';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

// `Array.prototype.find` method
// https://tc39.es/ecma262/#sec-array.prototype.find
$({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND);


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.for-each.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.for-each.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var forEach = __webpack_require__(/*! ../internals/array-for-each */ "./node_modules/core-js/internals/array-for-each.js");

// `Array.prototype.forEach` method
// https://tc39.es/ecma262/#sec-array.prototype.foreach
// eslint-disable-next-line es-x/no-array-prototype-foreach -- safe
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.includes.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.includes.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $includes = (__webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js/internals/array-includes.js").includes);
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js/internals/add-to-unscopables.js");

// FF99+ bug
var BROKEN_ON_SPARSE = fails(function () {
  return !Array(1).includes();
});

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.iterator.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.iterator.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js/internals/add-to-unscopables.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);
var defineIterator = __webpack_require__(/*! ../internals/define-iterator */ "./node_modules/core-js/internals/define-iterator.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
var values = Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

// V8 ~ Chrome 45- bug
if (!IS_PURE && DESCRIPTORS && values.name !== 'values') try {
  defineProperty(values, 'name', { value: 'values' });
} catch (error) { /* empty */ }


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.slice.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.slice.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js/internals/is-array.js");
var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js/internals/is-constructor.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js/internals/create-property.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var arrayMethodHasSpeciesSupport = __webpack_require__(/*! ../internals/array-method-has-species-support */ "./node_modules/core-js/internals/array-method-has-species-support.js");
var un$Slice = __webpack_require__(/*! ../internals/array-slice */ "./node_modules/core-js/internals/array-slice.js");

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

var SPECIES = wellKnownSymbol('species');
var $Array = Array;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = lengthOfArrayLike(O);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (isConstructor(Constructor) && (Constructor === $Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === $Array || Constructor === undefined) {
        return un$Slice(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? $Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.date.to-string.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.date.to-string.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

// TODO: Remove from `core-js@4`
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");

var DatePrototype = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var un$DateToString = uncurryThis(DatePrototype[TO_STRING]);
var getTime = uncurryThis(DatePrototype.getTime);

// `Date.prototype.toString` method
// https://tc39.es/ecma262/#sec-date.prototype.tostring
if (String(new Date(NaN)) != INVALID_DATE) {
  defineBuiltIn(DatePrototype, TO_STRING, function toString() {
    var value = getTime(this);
    // eslint-disable-next-line no-self-compare -- NaN check
    return value === value ? un$DateToString(this) : INVALID_DATE;
  });
}


/***/ }),

/***/ "./node_modules/core-js/modules/es.function.name.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es.function.name.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var FUNCTION_NAME_EXISTS = (__webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js/internals/function-name.js").EXISTS);
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);

var FunctionPrototype = Function.prototype;
var functionToString = uncurryThis(FunctionPrototype.toString);
var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
var regExpExec = uncurryThis(nameRE.exec);
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !FUNCTION_NAME_EXISTS) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return regExpExec(nameRE, functionToString(this))[1];
      } catch (error) {
        return '';
      }
    }
  });
}


/***/ }),

/***/ "./node_modules/core-js/modules/es.json.stringify.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.json.stringify.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var apply = __webpack_require__(/*! ../internals/function-apply */ "./node_modules/core-js/internals/function-apply.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js/internals/is-array.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");
var arraySlice = __webpack_require__(/*! ../internals/array-slice */ "./node_modules/core-js/internals/array-slice.js");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/native-symbol */ "./node_modules/core-js/internals/native-symbol.js");

var $stringify = getBuiltIn('JSON', 'stringify');
var exec = uncurryThis(/./.exec);
var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var replace = uncurryThis(''.replace);
var numberToString = uncurryThis(1.0.toString);

var tester = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;

var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL || fails(function () {
  var symbol = getBuiltIn('Symbol')();
  // MS Edge converts symbol values to JSON as {}
  return $stringify([symbol]) != '[null]'
    // WebKit converts symbol values to JSON as null
    || $stringify({ a: symbol }) != '{}'
    // V8 throws on boxed symbols
    || $stringify(Object(symbol)) != '{}';
});

// https://github.com/tc39/proposal-well-formed-stringify
var ILL_FORMED_UNICODE = fails(function () {
  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
    || $stringify('\uDEAD') !== '"\\udead"';
});

var stringifyWithSymbolsFix = function (it, replacer) {
  var args = arraySlice(arguments);
  var $replacer = replacer;
  if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
  if (!isArray(replacer)) replacer = function (key, value) {
    if (isCallable($replacer)) value = call($replacer, this, key, value);
    if (!isSymbol(value)) return value;
  };
  args[1] = replacer;
  return apply($stringify, null, args);
};

var fixIllFormed = function (match, offset, string) {
  var prev = charAt(string, offset - 1);
  var next = charAt(string, offset + 1);
  if ((exec(low, match) && !exec(hi, next)) || (exec(hi, match) && !exec(low, prev))) {
    return '\\u' + numberToString(charCodeAt(match, 0), 16);
  } return match;
};

if ($stringify) {
  // `JSON.stringify` method
  // https://tc39.es/ecma262/#sec-json.stringify
  $({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = arraySlice(arguments);
      var result = apply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace(result, tester, fixIllFormed) : result;
    }
  });
}


/***/ }),

/***/ "./node_modules/core-js/modules/es.object.assign.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.assign.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var assign = __webpack_require__(/*! ../internals/object-assign */ "./node_modules/core-js/internals/object-assign.js");

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es-x/no-object-assign -- required for testing
$({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== assign }, {
  assign: assign
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.object.freeze.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.freeze.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var FREEZING = __webpack_require__(/*! ../internals/freezing */ "./node_modules/core-js/internals/freezing.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var onFreeze = (__webpack_require__(/*! ../internals/internal-metadata */ "./node_modules/core-js/internals/internal-metadata.js").onFreeze);

// eslint-disable-next-line es-x/no-object-freeze -- safe
var $freeze = Object.freeze;
var FAILS_ON_PRIMITIVES = fails(function () { $freeze(1); });

// `Object.freeze` method
// https://tc39.es/ecma262/#sec-object.freeze
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !FREEZING }, {
  freeze: function freeze(it) {
    return $freeze && isObject(it) ? $freeze(onFreeze(it)) : it;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.object.get-own-property-symbols.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.get-own-property-symbols.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/native-symbol */ "./node_modules/core-js/internals/native-symbol.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js/internals/object-get-own-property-symbols.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");

// V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
var FORCED = !NATIVE_SYMBOL || fails(function () { getOwnPropertySymbolsModule.f(1); });

// `Object.getOwnPropertySymbols` method
// https://tc39.es/ecma262/#sec-object.getownpropertysymbols
$({ target: 'Object', stat: true, forced: FORCED }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    var $getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject(it)) : [];
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.object.keys.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.keys.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var nativeKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js/internals/object-keys.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.object.to-string.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.object.to-string.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js/internals/to-string-tag-support.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var toString = __webpack_require__(/*! ../internals/object-to-string */ "./node_modules/core-js/internals/object-to-string.js");

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  defineBuiltIn(Object.prototype, 'toString', toString, { unsafe: true });
}


/***/ }),

/***/ "./node_modules/core-js/modules/es.regexp.exec.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/es.regexp.exec.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var exec = __webpack_require__(/*! ../internals/regexp-exec */ "./node_modules/core-js/internals/regexp-exec.js");

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.regexp.to-string.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es.regexp.to-string.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var PROPER_FUNCTION_NAME = (__webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js/internals/function-name.js").PROPER);
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var $toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var getRegExpFlags = __webpack_require__(/*! ../internals/regexp-get-flags */ "./node_modules/core-js/internals/regexp-get-flags.js");

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var n$ToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return n$ToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = PROPER_FUNCTION_NAME && n$ToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  defineBuiltIn(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var pattern = $toString(R.source);
    var flags = $toString(getRegExpFlags(R));
    return '/' + pattern + '/' + flags;
  }, { unsafe: true });
}


/***/ }),

/***/ "./node_modules/core-js/modules/es.string.iterator.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es.string.iterator.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var charAt = (__webpack_require__(/*! ../internals/string-multibyte */ "./node_modules/core-js/internals/string-multibyte.js").charAt);
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var defineIterator = __webpack_require__(/*! ../internals/define-iterator */ "./node_modules/core-js/internals/define-iterator.js");

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: toString(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.string.replace.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.string.replace.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var apply = __webpack_require__(/*! ../internals/function-apply */ "./node_modules/core-js/internals/function-apply.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fixRegExpWellKnownSymbolLogic = __webpack_require__(/*! ../internals/fix-regexp-well-known-symbol-logic */ "./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");
var advanceStringIndex = __webpack_require__(/*! ../internals/advance-string-index */ "./node_modules/core-js/internals/advance-string-index.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var getSubstitution = __webpack_require__(/*! ../internals/get-substitution */ "./node_modules/core-js/internals/get-substitution.js");
var regExpExec = __webpack_require__(/*! ../internals/regexp-exec-abstract */ "./node_modules/core-js/internals/regexp-exec-abstract.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var REPLACE = wellKnownSymbol('replace');
var max = Math.max;
var min = Math.min;
var concat = uncurryThis([].concat);
var push = uncurryThis([].push);
var stringIndexOf = uncurryThis(''.indexOf);
var stringSlice = uncurryThis(''.slice);

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
  return 'a'.replace(/./, '$0') === '$0';
})();

// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
  return ''.replace(re, '$<a>') !== '7';
});

// @@replace logic
fixRegExpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.es/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : getMethod(searchValue, REPLACE);
      return replacer
        ? call(replacer, searchValue, O, replaceValue)
        : call(nativeReplace, toString(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
    function (string, replaceValue) {
      var rx = anObject(this);
      var S = toString(string);

      if (
        typeof replaceValue == 'string' &&
        stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
        stringIndexOf(replaceValue, '$<') === -1
      ) {
        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
        if (res.done) return res.value;
      }

      var functionalReplace = isCallable(replaceValue);
      if (!functionalReplace) replaceValue = toString(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;

        push(results, result);
        if (!global) break;

        var matchStr = toString(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = toString(result[0]);
        var position = max(min(toIntegerOrInfinity(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) push(captures, maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = concat([matched], captures, position, S);
          if (namedCaptures !== undefined) push(replacerArgs, namedCaptures);
          var replacement = toString(apply(replaceValue, undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += stringSlice(S, nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + stringSlice(S, nextSourcePosition);
    }
  ];
}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);


/***/ }),

/***/ "./node_modules/core-js/modules/es.string.split.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/es.string.split.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var apply = __webpack_require__(/*! ../internals/function-apply */ "./node_modules/core-js/internals/function-apply.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fixRegExpWellKnownSymbolLogic = __webpack_require__(/*! ../internals/fix-regexp-well-known-symbol-logic */ "./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js");
var isRegExp = __webpack_require__(/*! ../internals/is-regexp */ "./node_modules/core-js/internals/is-regexp.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");
var speciesConstructor = __webpack_require__(/*! ../internals/species-constructor */ "./node_modules/core-js/internals/species-constructor.js");
var advanceStringIndex = __webpack_require__(/*! ../internals/advance-string-index */ "./node_modules/core-js/internals/advance-string-index.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var arraySlice = __webpack_require__(/*! ../internals/array-slice-simple */ "./node_modules/core-js/internals/array-slice-simple.js");
var callRegExpExec = __webpack_require__(/*! ../internals/regexp-exec-abstract */ "./node_modules/core-js/internals/regexp-exec-abstract.js");
var regexpExec = __webpack_require__(/*! ../internals/regexp-exec */ "./node_modules/core-js/internals/regexp-exec.js");
var stickyHelpers = __webpack_require__(/*! ../internals/regexp-sticky-helpers */ "./node_modules/core-js/internals/regexp-sticky-helpers.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
var MAX_UINT32 = 0xFFFFFFFF;
var min = Math.min;
var $push = [].push;
var exec = uncurryThis(/./.exec);
var push = uncurryThis($push);
var stringSlice = uncurryThis(''.slice);

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  // eslint-disable-next-line regexp/no-empty-group -- required for testing
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

// @@split logic
fixRegExpWellKnownSymbolLogic('split', function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    // eslint-disable-next-line regexp/no-empty-group -- required for testing
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = toString(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) {
        return call(nativeSplit, string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = call(regexpExec, separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          push(output, stringSlice(string, lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) apply($push, output, arraySlice(match, 1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !exec(separatorCopy, '')) push(output, '');
      } else push(output, stringSlice(string, lastLastIndex));
      return output.length > lim ? arraySlice(output, 0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : call(nativeSplit, this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.es/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : getMethod(separator, SPLIT);
      return splitter
        ? call(splitter, separator, O, limit)
        : call(internalSplit, toString(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (string, limit) {
      var rx = anObject(this);
      var S = toString(string);
      var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);

      if (res.done) return res.value;

      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (UNSUPPORTED_Y ? 'g' : 'y');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(UNSUPPORTED_Y ? '^(?:' + rx.source + ')' : rx, flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
        var z = callRegExpExec(splitter, UNSUPPORTED_Y ? stringSlice(S, q) : S);
        var e;
        if (
          z === null ||
          (e = min(toLength(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          push(A, stringSlice(S, p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            push(A, z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      push(A, stringSlice(S, p));
      return A;
    }
  ];
}, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);


/***/ }),

/***/ "./node_modules/core-js/modules/es.symbol.constructor.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/es.symbol.constructor.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/native-symbol */ "./node_modules/core-js/internals/native-symbol.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");
var $toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var nativeObjectCreate = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js/internals/object-keys.js");
var getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js");
var getOwnPropertyNamesExternal = __webpack_require__(/*! ../internals/object-get-own-property-names-external */ "./node_modules/core-js/internals/object-get-own-property-names-external.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js/internals/object-get-own-property-symbols.js");
var getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var definePropertiesModule = __webpack_require__(/*! ../internals/object-define-properties */ "./node_modules/core-js/internals/object-define-properties.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js/internals/object-property-is-enumerable.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var wrappedWellKnownSymbolModule = __webpack_require__(/*! ../internals/well-known-symbol-wrapped */ "./node_modules/core-js/internals/well-known-symbol-wrapped.js");
var defineWellKnownSymbol = __webpack_require__(/*! ../internals/define-well-known-symbol */ "./node_modules/core-js/internals/define-well-known-symbol.js");
var defineSymbolToPrimitive = __webpack_require__(/*! ../internals/symbol-define-to-primitive */ "./node_modules/core-js/internals/symbol-define-to-primitive.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var $forEach = (__webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").forEach);

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';

var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);

var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var SymbolPrototype = $Symbol && $Symbol[PROTOTYPE];
var TypeError = global.TypeError;
var QObject = global.QObject;
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var push = uncurryThis([].push);

var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var WellKnownSymbolsStore = shared('wks');

// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPropertyKey(P);
  anObject(Attributes);
  if (hasOwn(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!hasOwn(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (hasOwn(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || call($propertyIsEnumerable, properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPropertyKey(V);
  var enumerable = call(nativePropertyIsEnumerable, this, P);
  if (this === ObjectPrototype && hasOwn(AllSymbols, P) && !hasOwn(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !hasOwn(this, P) || !hasOwn(AllSymbols, P) || hasOwn(this, HIDDEN) && this[HIDDEN][P]
    ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPropertyKey(P);
  if (it === ObjectPrototype && hasOwn(AllSymbols, key) && !hasOwn(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && hasOwn(AllSymbols, key) && !(hasOwn(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!hasOwn(AllSymbols, key) && !hasOwn(hiddenKeys, key)) push(result, key);
  });
  return result;
};

var $getOwnPropertySymbols = function (O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (hasOwn(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn(ObjectPrototype, key))) {
      push(result, AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (isPrototypeOf(SymbolPrototype, this)) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : $toString(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) call(setter, ObjectPrototypeSymbols, value);
      if (hasOwn(this, HIDDEN) && hasOwn(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  SymbolPrototype = $Symbol[PROTOTYPE];

  defineBuiltIn(SymbolPrototype, 'toString', function toString() {
    return getInternalState(this).tag;
  });

  defineBuiltIn($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  definePropertiesModule.f = $defineProperties;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty(SymbolPrototype, 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      defineBuiltIn(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }
}

$({ global: true, constructor: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames
});

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
defineSymbolToPrimitive();

// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;


/***/ }),

/***/ "./node_modules/core-js/modules/es.symbol.description.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/es.symbol.description.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// `Symbol.prototype.description` getter
// https://tc39.es/ecma262/#sec-symbol.prototype.description

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);
var copyConstructorProperties = __webpack_require__(/*! ../internals/copy-constructor-properties */ "./node_modules/core-js/internals/copy-constructor-properties.js");

var NativeSymbol = global.Symbol;
var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

if (DESCRIPTORS && isCallable(NativeSymbol) && (!('description' in SymbolPrototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString(arguments[0]);
    var result = isPrototypeOf(SymbolPrototype, this)
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };

  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  SymbolWrapper.prototype = SymbolPrototype;
  SymbolPrototype.constructor = SymbolWrapper;

  var NATIVE_SYMBOL = String(NativeSymbol('test')) == 'Symbol(test)';
  var symbolToString = uncurryThis(SymbolPrototype.toString);
  var symbolValueOf = uncurryThis(SymbolPrototype.valueOf);
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  var replace = uncurryThis(''.replace);
  var stringSlice = uncurryThis(''.slice);

  defineProperty(SymbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = symbolValueOf(this);
      var string = symbolToString(symbol);
      if (hasOwn(EmptyStringDescriptionStore, symbol)) return '';
      var desc = NATIVE_SYMBOL ? stringSlice(string, 7, -1) : replace(string, regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $({ global: true, constructor: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}


/***/ }),

/***/ "./node_modules/core-js/modules/es.symbol.for.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/es.symbol.for.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var NATIVE_SYMBOL_REGISTRY = __webpack_require__(/*! ../internals/native-symbol-registry */ "./node_modules/core-js/internals/native-symbol-registry.js");

var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');

// `Symbol.for` method
// https://tc39.es/ecma262/#sec-symbol.for
$({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
  'for': function (key) {
    var string = toString(key);
    if (hasOwn(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = getBuiltIn('Symbol')(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.symbol.iterator.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es.symbol.iterator.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var defineWellKnownSymbol = __webpack_require__(/*! ../internals/define-well-known-symbol */ "./node_modules/core-js/internals/define-well-known-symbol.js");

// `Symbol.iterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');


/***/ }),

/***/ "./node_modules/core-js/modules/es.symbol.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/modules/es.symbol.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
__webpack_require__(/*! ../modules/es.symbol.constructor */ "./node_modules/core-js/modules/es.symbol.constructor.js");
__webpack_require__(/*! ../modules/es.symbol.for */ "./node_modules/core-js/modules/es.symbol.for.js");
__webpack_require__(/*! ../modules/es.symbol.key-for */ "./node_modules/core-js/modules/es.symbol.key-for.js");
__webpack_require__(/*! ../modules/es.json.stringify */ "./node_modules/core-js/modules/es.json.stringify.js");
__webpack_require__(/*! ../modules/es.object.get-own-property-symbols */ "./node_modules/core-js/modules/es.object.get-own-property-symbols.js");


/***/ }),

/***/ "./node_modules/core-js/modules/es.symbol.key-for.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.symbol.key-for.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var NATIVE_SYMBOL_REGISTRY = __webpack_require__(/*! ../internals/native-symbol-registry */ "./node_modules/core-js/internals/native-symbol-registry.js");

var SymbolToStringRegistry = shared('symbol-to-string-registry');

// `Symbol.keyFor` method
// https://tc39.es/ecma262/#sec-symbol.keyfor
$({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(tryToString(sym) + ' is not a symbol');
    if (hasOwn(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/web.dom-collections.for-each.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/modules/web.dom-collections.for-each.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var DOMIterables = __webpack_require__(/*! ../internals/dom-iterables */ "./node_modules/core-js/internals/dom-iterables.js");
var DOMTokenListPrototype = __webpack_require__(/*! ../internals/dom-token-list-prototype */ "./node_modules/core-js/internals/dom-token-list-prototype.js");
var forEach = __webpack_require__(/*! ../internals/array-for-each */ "./node_modules/core-js/internals/array-for-each.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");

var handlePrototype = function (CollectionPrototype) {
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  if (DOMIterables[COLLECTION_NAME]) {
    handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype);
  }
}

handlePrototype(DOMTokenListPrototype);


/***/ }),

/***/ "./node_modules/core-js/modules/web.dom-collections.iterator.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/modules/web.dom-collections.iterator.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var DOMIterables = __webpack_require__(/*! ../internals/dom-iterables */ "./node_modules/core-js/internals/dom-iterables.js");
var DOMTokenListPrototype = __webpack_require__(/*! ../internals/dom-token-list-prototype */ "./node_modules/core-js/internals/dom-token-list-prototype.js");
var ArrayIteratorMethods = __webpack_require__(/*! ../modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype, COLLECTION_NAME);
}

handlePrototype(DOMTokenListPrototype, 'DOMTokenList');


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/BamoAdvancedProperties.vue?vue&type=style&index=0&id=018d13b4&scoped=true&lang=css&":
/*!**********************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/BamoAdvancedProperties.vue?vue&type=style&index=0&id=018d13b4&scoped=true&lang=css& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_bamo_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./bamo.css */ "./node_modules/css-loader/dist/cjs.js!./src/components/bamo.css");
// Imports



var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_bamo_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, " ", "",{"version":3,"sources":[],"names":[],"mappings":"","sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/components/bamo.css":
/*!***********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/components/bamo.css ***!
  \***********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\r\n#BAMO .dialog_content {\r\n    margin: 0;\r\n} \r\n\r\n#BAMO .wizardWrapper {\r\n    display: flex; \r\n    flex-direction: row;\r\n    height: 100%;\r\n} \r\n\r\n#BAMO .wizardPage {\r\n    width: 100%; \r\n    padding: 12px 20px;\r\n} \r\n\r\n#BAMO .headerLabel {\r\n    font-size: 20px; \r\n    display: inline-block\r\n} \r\n\r\n#BAMO .headerDescription {\r\n    color: white;\r\n} \r\n\r\n#BAMO input[type='text'] {\r\n    display: block; \r\n    width: 100%; \r\n    height: auto; \r\n    padding: 4px 8px; \r\n    border: 1px solid black;\r\n} \r\n\r\n#BAMO input[type='number']{\r\n    display: inline-block; \r\n    width: 50px; \r\n    height: auto; \r\n    border: 1px solid black; \r\n    padding-left: 4px; \r\n    margin-right: 8px; \r\n    text-align: right;\r\n} \r\n\r\n#BAMO input[type='checkbox'] {\r\n    padding-right: 8px;\r\n} \r\n\r\n#BAMO select {\r\n    width: 100%; \r\n    height: auto; \r\n    padding: 4px 8px;\r\n    border: 1px solid black; \r\n} \r\n\r\n#BAMOsideBar {\r\n    border-right: 2px solid black;\r\n    width: 175px;\r\n} \r\n\r\n#BAMOsideBar li {\r\n    width: 100%; \r\n    padding: 8px 20px; \r\n    cursor: pointer;\r\n} \r\n\r\n#BAMOsideBar li.selected {\r\n    width: 100%; \r\n    padding: 8px 20px; \r\n    border-right: 4px solid green; \r\n    cursor: default;\r\n    background-color: gray;\r\n} \r\n\r\n#BAMOsideBar li.sideBarHeader {\r\n    width: 100%;\r\n    padding: 2px 10px;\r\n    font-size: 12px;\r\n    cursor: default;\r\n}\r\n\r\nul.settingsList li {\r\n    padding: 8px 0;\r\n}\r\n\t", "",{"version":3,"sources":["webpack://./src/components/bamo.css"],"names":[],"mappings":";AACA;IACI,SAAS;AACb;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,YAAY;AAChB;;AAEA;IACI,WAAW;IACX,kBAAkB;AACtB;;AAEA;IACI,eAAe;IACf;AACJ;;AAEA;IACI,YAAY;AAChB;;AAEA;IACI,cAAc;IACd,WAAW;IACX,YAAY;IACZ,gBAAgB;IAChB,uBAAuB;AAC3B;;AAEA;IACI,qBAAqB;IACrB,WAAW;IACX,YAAY;IACZ,uBAAuB;IACvB,iBAAiB;IACjB,iBAAiB;IACjB,iBAAiB;AACrB;;AAEA;IACI,kBAAkB;AACtB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,gBAAgB;IAChB,uBAAuB;AAC3B;;AAEA;IACI,6BAA6B;IAC7B,YAAY;AAChB;;AAEA;IACI,WAAW;IACX,iBAAiB;IACjB,eAAe;AACnB;;AAEA;IACI,WAAW;IACX,iBAAiB;IACjB,6BAA6B;IAC7B,eAAe;IACf,sBAAsB;AAC1B;;AAEA;IACI,WAAW;IACX,iBAAiB;IACjB,eAAe;IACf,eAAe;AACnB;;AAEA;IACI,cAAc;AAClB","sourcesContent":["\r\n#BAMO .dialog_content {\r\n    margin: 0;\r\n} \r\n\r\n#BAMO .wizardWrapper {\r\n    display: flex; \r\n    flex-direction: row;\r\n    height: 100%;\r\n} \r\n\r\n#BAMO .wizardPage {\r\n    width: 100%; \r\n    padding: 12px 20px;\r\n} \r\n\r\n#BAMO .headerLabel {\r\n    font-size: 20px; \r\n    display: inline-block\r\n} \r\n\r\n#BAMO .headerDescription {\r\n    color: white;\r\n} \r\n\r\n#BAMO input[type='text'] {\r\n    display: block; \r\n    width: 100%; \r\n    height: auto; \r\n    padding: 4px 8px; \r\n    border: 1px solid black;\r\n} \r\n\r\n#BAMO input[type='number']{\r\n    display: inline-block; \r\n    width: 50px; \r\n    height: auto; \r\n    border: 1px solid black; \r\n    padding-left: 4px; \r\n    margin-right: 8px; \r\n    text-align: right;\r\n} \r\n\r\n#BAMO input[type='checkbox'] {\r\n    padding-right: 8px;\r\n} \r\n\r\n#BAMO select {\r\n    width: 100%; \r\n    height: auto; \r\n    padding: 4px 8px;\r\n    border: 1px solid black; \r\n} \r\n\r\n#BAMOsideBar {\r\n    border-right: 2px solid black;\r\n    width: 175px;\r\n} \r\n\r\n#BAMOsideBar li {\r\n    width: 100%; \r\n    padding: 8px 20px; \r\n    cursor: pointer;\r\n} \r\n\r\n#BAMOsideBar li.selected {\r\n    width: 100%; \r\n    padding: 8px 20px; \r\n    border-right: 4px solid green; \r\n    cursor: default;\r\n    background-color: gray;\r\n} \r\n\r\n#BAMOsideBar li.sideBarHeader {\r\n    width: 100%;\r\n    padding: 2px 10px;\r\n    font-size: 12px;\r\n    cursor: default;\r\n}\r\n\r\nul.settingsList li {\r\n    padding: 8px 0;\r\n}\r\n\t"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/to-string-loader/src/to-string.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/BamoAdvancedProperties.vue?vue&type=style&index=0&id=018d13b4&scoped=true&lang=css&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/to-string-loader/src/to-string.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/BamoAdvancedProperties.vue?vue&type=style&index=0&id=018d13b4&scoped=true&lang=css& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


        var result = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BamoAdvancedProperties.vue?vue&type=style&index=0&id=018d13b4&scoped=true&lang=css& */ "./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/BamoAdvancedProperties.vue?vue&type=style&index=0&id=018d13b4&scoped=true&lang=css&");

        if (result && result.__esModule) {
            result = result.default;
        }

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),

/***/ "./src/components/bamo.css":
/*!*********************************!*\
  !*** ./src/components/bamo.css ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


        var result = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./bamo.css */ "./node_modules/css-loader/dist/cjs.js!./src/components/bamo.css");

        if (result && result.__esModule) {
            result = result.default;
        }

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),

/***/ "./src/components/BamoAdvancedProperties.vue":
/*!***************************************************!*\
  !*** ./src/components/BamoAdvancedProperties.vue ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BamoAdvancedTemplate_html_vue_type_template_id_018d13b4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BamoAdvancedTemplate.html?vue&type=template&id=018d13b4&scoped=true& */ "./src/components/BamoAdvancedTemplate.html?vue&type=template&id=018d13b4&scoped=true&");
/* harmony import */ var _BamoAdvancedProperties_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BamoAdvancedProperties.vue?vue&type=script&lang=js& */ "./src/components/BamoAdvancedProperties.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



function injectStyles (context) {
  
  var style0 = __webpack_require__(/*! ./BamoAdvancedProperties.vue?vue&type=style&index=0&id=018d13b4&scoped=true&lang=css& */ "./src/components/BamoAdvancedProperties.vue?vue&type=style&index=0&id=018d13b4&scoped=true&lang=css&")
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _BamoAdvancedProperties_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _BamoAdvancedTemplate_html_vue_type_template_id_018d13b4_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render,
  _BamoAdvancedTemplate_html_vue_type_template_id_018d13b4_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  injectStyles,
  "018d13b4",
  "0908dd08"
  
)

component.options.__file = "src/components/BamoAdvancedProperties.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/BamoBaseComponent.vue":
/*!**********************************************!*\
  !*** ./src/components/BamoBaseComponent.vue ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BamoBaseComponent_vue_vue_type_template_id_2d170b0b___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BamoBaseComponent.vue?vue&type=template&id=2d170b0b& */ "./src/components/BamoBaseComponent.vue?vue&type=template&id=2d170b0b&");
/* harmony import */ var _BamoBaseComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BamoBaseComponent.vue?vue&type=script&lang=js& */ "./src/components/BamoBaseComponent.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _BamoBaseComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _BamoBaseComponent_vue_vue_type_template_id_2d170b0b___WEBPACK_IMPORTED_MODULE_0__.render,
  _BamoBaseComponent_vue_vue_type_template_id_2d170b0b___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  "48575ee9"
  
)

component.options.__file = "src/components/BamoBaseComponent.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/components/BamoAdvancedProperties.vue?vue&type=script&lang=js&":
/*!****************************************************************************!*\
  !*** ./src/components/BamoAdvancedProperties.vue?vue&type=script&lang=js& ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BamoAdvancedProperties_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BamoAdvancedProperties.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/BamoAdvancedProperties.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BamoAdvancedProperties_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/BamoBaseComponent.vue?vue&type=script&lang=js&":
/*!***********************************************************************!*\
  !*** ./src/components/BamoBaseComponent.vue?vue&type=script&lang=js& ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BamoBaseComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BamoBaseComponent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/BamoBaseComponent.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BamoBaseComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/components/BamoAdvancedProperties.vue?vue&type=style&index=0&id=018d13b4&scoped=true&lang=css&":
/*!************************************************************************************************************!*\
  !*** ./src/components/BamoAdvancedProperties.vue?vue&type=style&index=0&id=018d13b4&scoped=true&lang=css& ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_to_string_loader_src_to_string_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BamoAdvancedProperties_vue_vue_type_style_index_0_id_018d13b4_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/to-string-loader/src/to-string.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BamoAdvancedProperties.vue?vue&type=style&index=0&id=018d13b4&scoped=true&lang=css& */ "./node_modules/to-string-loader/src/to-string.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/BamoAdvancedProperties.vue?vue&type=style&index=0&id=018d13b4&scoped=true&lang=css&");
/* harmony import */ var _node_modules_to_string_loader_src_to_string_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BamoAdvancedProperties_vue_vue_type_style_index_0_id_018d13b4_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_to_string_loader_src_to_string_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BamoAdvancedProperties_vue_vue_type_style_index_0_id_018d13b4_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _node_modules_to_string_loader_src_to_string_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BamoAdvancedProperties_vue_vue_type_style_index_0_id_018d13b4_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _node_modules_to_string_loader_src_to_string_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_BamoAdvancedProperties_vue_vue_type_style_index_0_id_018d13b4_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);


/***/ }),

/***/ "./src/components/BamoBaseComponent.vue?vue&type=template&id=2d170b0b&":
/*!*****************************************************************************!*\
  !*** ./src/components/BamoBaseComponent.vue?vue&type=template&id=2d170b0b& ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BamoBaseComponent_vue_vue_type_template_id_2d170b0b___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BamoBaseComponent_vue_vue_type_template_id_2d170b0b___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BamoBaseComponent_vue_vue_type_template_id_2d170b0b___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BamoBaseComponent.vue?vue&type=template&id=2d170b0b& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/BamoBaseComponent.vue?vue&type=template&id=2d170b0b&");


/***/ }),

/***/ "./src/components/BamoAdvancedTemplate.html?vue&type=template&id=018d13b4&scoped=true&":
/*!*********************************************************************************************!*\
  !*** ./src/components/BamoAdvancedTemplate.html?vue&type=template&id=018d13b4&scoped=true& ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_BamoAdvancedTemplate_html_vue_type_template_id_018d13b4_scoped_true___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_BamoAdvancedTemplate_html_vue_type_template_id_018d13b4_scoped_true___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_BamoAdvancedTemplate_html_vue_type_template_id_018d13b4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./BamoAdvancedTemplate.html?vue&type=template&id=018d13b4&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./src/components/BamoAdvancedTemplate.html?vue&type=template&id=018d13b4&scoped=true&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/BamoBaseComponent.vue?vue&type=template&id=2d170b0b&":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/components/BamoBaseComponent.vue?vue&type=template&id=2d170b0b& ***!
  \********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [_c("BamoAdvancedProperties")], 1)
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./src/components/BamoAdvancedTemplate.html?vue&type=template&id=018d13b4&scoped=true&":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./src/components/BamoAdvancedTemplate.html?vue&type=template&id=018d13b4&scoped=true& ***!
  \*************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { attrs: { id: "BAMO" } }, [
    _c("div", { staticClass: "wizardWrapper" }, [
      _c("ul", { attrs: { id: "BAMOsideBar" } }, [
        _c(
          "li",
          {
            class: { selected: _vm.step == "start" },
            on: {
              click: function ($event) {
                $event.preventDefault()
                return _vm.changePage($event, "start")
              },
            },
          },
          [_vm._v("\r\n                Start\r\n            ")]
        ),
        _vm._v(" "),
        _c("li", { staticClass: "sideBarHeader" }, [_vm._v("Blocks")]),
        _vm._v(" "),
        _c(
          "li",
          {
            class: { selected: _vm.step == "types" },
            on: {
              click: function ($event) {
                $event.preventDefault()
                return _vm.changePage($event, "types")
              },
            },
          },
          [_vm._v("\r\n                Block Types\r\n            ")]
        ),
        _vm._v(" "),
        _vm.parentData.properties.types.custom
          ? _c(
              "li",
              {
                class: { selected: _vm.step == "custom" },
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "custom")
                  },
                },
              },
              [_vm._v("\r\n                Custom Block\r\n            ")]
            )
          : _vm._e(),
        _vm._v(" "),
        _vm.parentData.properties.types.block
          ? _c(
              "li",
              {
                class: { selected: _vm.step == "variant" },
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "variant")
                  },
                },
              },
              [_vm._v("\r\n                Variants\r\n            ")]
            )
          : _vm._e(),
        _vm._v(" "),
        _c("li", { staticClass: "sideBarHeader" }, [_vm._v("Properties")]),
        _vm._v(" "),
        _c(
          "li",
          {
            class: { selected: _vm.step == "physical" },
            on: {
              click: function ($event) {
                $event.preventDefault()
                return _vm.changePage($event, "physical")
              },
            },
          },
          [_vm._v("\r\n                Physical\r\n            ")]
        ),
        _vm._v(" "),
        _c(
          "li",
          {
            class: { selected: _vm.step == "advPhys" },
            on: {
              click: function ($event) {
                $event.preventDefault()
                return _vm.changePage($event, "advPhys")
              },
            },
          },
          [_vm._v("\r\n                Adv Physical\r\n            ")]
        ),
        _vm._v(" "),
        _c(
          "li",
          {
            class: { selected: _vm.step == "particles" },
            on: {
              click: function ($event) {
                $event.preventDefault()
                return _vm.changePage($event, "particles")
              },
            },
          },
          [_vm._v("\r\n                Particles\r\n            ")]
        ),
        _vm._v(" "),
        _c(
          "li",
          {
            class: { selected: _vm.step == "datapack" },
            on: {
              click: function ($event) {
                $event.preventDefault()
                return _vm.changePage($event, "datapack")
              },
            },
          },
          [_vm._v("\r\n                Datapack\r\n            ")]
        ),
        _vm._v(" "),
        _c(
          "li",
          {
            class: { selected: _vm.step == "other" },
            on: {
              click: function ($event) {
                $event.preventDefault()
                return _vm.changePage($event, "other")
              },
            },
          },
          [_vm._v("\r\n                Other\r\n            ")]
        ),
        _vm._v(" "),
         false
          ? 0
          : _vm._e(),
        _vm._v(" "),
         false
          ? 0
          : _vm._e(),
      ]),
      _vm._v(" "),
      _vm.step == "start"
        ? _c("div", { staticClass: "wizardPage" }, [
            _c(
              "h1",
              { staticStyle: { padding: "0", "text-align": "center" } },
              [_vm._v("BAMO Exporter")]
            ),
            _vm._v(" "),
            _c("p", { attrs: { align: "center" } }, [
              _vm._v(
                'Click "Export" at any time to export the model. Any unmodified properties will be set to the default values for a dirt block. Changes will persist until Blockbench is closed.'
              ),
            ]),
            _vm._v(" "),
            _c("ul", { staticClass: "settingsList" }, [
              _c("li", [
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Display Name"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v(
                    "The (unique) name of the block as will be seen in Minecraft"
                  ),
                ]),
                _vm._v(" "),
                _vm.error == "name"
                  ? _c("p", { staticStyle: { color: "red" } }, [
                      _vm._v("Block display name cannot be blank"),
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.$parent.$data.properties.displayName,
                      expression: "$parent.$data.properties.displayName",
                    },
                  ],
                  staticClass: "dark_bordered",
                  attrs: { type: "text", placeholder: "Name of the Block" },
                  domProps: { value: _vm.$parent.$data.properties.displayName },
                  on: {
                    input: function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(
                        _vm.$parent.$data.properties,
                        "displayName",
                        $event.target.value
                      )
                    },
                  },
                }),
              ]),
              _vm._v(" "),
              _c("li", [
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Minecraft Version"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v(" The version of minecraft to export for"),
                ]),
                _vm._v(" "),
                _c(
                  "select",
                  {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.$parent.$data.properties.version,
                        expression: "$parent.$data.properties.version",
                      },
                    ],
                    staticClass: "dark_bordered",
                    on: {
                      change: function ($event) {
                        var $$selectedVal = Array.prototype.filter
                          .call($event.target.options, function (o) {
                            return o.selected
                          })
                          .map(function (o) {
                            var val = "_value" in o ? o._value : o.value
                            return val
                          })
                        _vm.$set(
                          _vm.$parent.$data.properties,
                          "version",
                          $event.target.multiple
                            ? $$selectedVal
                            : $$selectedVal[0]
                        )
                      },
                    },
                  },
                  [
                    _c("option", { attrs: { disabled: "", value: "" } }, [
                      _vm._v("Please select"),
                    ]),
                    _vm._v(" "),
                    _c("option", [_vm._v("1.20.1")]),
                    _vm._v(" "),
                    _c("option", [_vm._v("1.18.2")]),
                    _vm._v(" "),
                    _c("option", [_vm._v("1.16.5")]),
                  ]
                ),
              ]),
            ]),
            _c("br"),
            _vm._v(" "),
            _c(
              "button",
              {
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "types")
                  },
                },
              },
              [_vm._v("Continue")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticStyle: { float: "right" },
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.createJSON.apply(null, arguments)
                  },
                },
              },
              [_vm._v("Export")]
            ),
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.step == "types"
        ? _c("div", { staticClass: "wizardPage" }, [
            _c(
              "h1",
              { staticStyle: { padding: "0", "text-align": "center" } },
              [_vm._v("Block Types")]
            ),
            _vm._v(" "),
            _c("ul", { staticClass: "settingsList" }, [
              _c("li", [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.$parent.$data.properties.types.custom,
                      expression: "$parent.$data.properties.types.custom",
                    },
                  ],
                  attrs: { type: "checkbox" },
                  domProps: {
                    checked: Array.isArray(
                      _vm.$parent.$data.properties.types.custom
                    )
                      ? _vm._i(
                          _vm.$parent.$data.properties.types.custom,
                          null
                        ) > -1
                      : _vm.$parent.$data.properties.types.custom,
                  },
                  on: {
                    change: [
                      function ($event) {
                        var $$a = _vm.$parent.$data.properties.types.custom,
                          $$el = $event.target,
                          $$c = $$el.checked ? true : false
                        if (Array.isArray($$a)) {
                          var $$v = null,
                            $$i = _vm._i($$a, $$v)
                          if ($$el.checked) {
                            $$i < 0 &&
                              _vm.$set(
                                _vm.$parent.$data.properties.types,
                                "custom",
                                $$a.concat([$$v])
                              )
                          } else {
                            $$i > -1 &&
                              _vm.$set(
                                _vm.$parent.$data.properties.types,
                                "custom",
                                $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                              )
                          }
                        } else {
                          _vm.$set(
                            _vm.$parent.$data.properties.types,
                            "custom",
                            $$c
                          )
                        }
                      },
                      function ($event) {
                        return _vm.toggleType($event, "custom")
                      },
                    ],
                  },
                }),
                _vm._v(" "),
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Custom Block"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v("Block with a custom model and hitbox"),
                ]),
              ]),
              _vm._v(" "),
              _vm.$parent.$data.properties.types.custom
                ? _c("li", { staticStyle: { "padding-left": "20px" } }, [
                    _c("div", { staticClass: "headerLabel" }, [
                      _vm._v("Custom Block Type"),
                    ]),
                    _vm._v(" "),
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value:
                              _vm.$parent.$data.properties.types.customType,
                            expression:
                              "$parent.$data.properties.types.customType",
                          },
                        ],
                        staticClass: "dark_bordered",
                        on: {
                          change: function ($event) {
                            var $$selectedVal = Array.prototype.filter
                              .call($event.target.options, function (o) {
                                return o.selected
                              })
                              .map(function (o) {
                                var val = "_value" in o ? o._value : o.value
                                return val
                              })
                            _vm.$set(
                              _vm.$parent.$data.properties.types,
                              "customType",
                              $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            )
                          },
                        },
                      },
                      _vm._l(_vm.customTypeOptions, function (op) {
                        return _c("option", { key: op }, [_vm._v(_vm._s(op))])
                      }),
                      0
                    ),
                  ])
                : _vm._e(),
              _vm._v(" "),
              _c("li", [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.$parent.$data.properties.types.block,
                      expression: "$parent.$data.properties.types.block",
                    },
                  ],
                  attrs: { type: "checkbox" },
                  domProps: {
                    checked: Array.isArray(
                      _vm.$parent.$data.properties.types.block
                    )
                      ? _vm._i(_vm.$parent.$data.properties.types.block, null) >
                        -1
                      : _vm.$parent.$data.properties.types.block,
                  },
                  on: {
                    change: [
                      function ($event) {
                        var $$a = _vm.$parent.$data.properties.types.block,
                          $$el = $event.target,
                          $$c = $$el.checked ? true : false
                        if (Array.isArray($$a)) {
                          var $$v = null,
                            $$i = _vm._i($$a, $$v)
                          if ($$el.checked) {
                            $$i < 0 &&
                              _vm.$set(
                                _vm.$parent.$data.properties.types,
                                "block",
                                $$a.concat([$$v])
                              )
                          } else {
                            $$i > -1 &&
                              _vm.$set(
                                _vm.$parent.$data.properties.types,
                                "block",
                                $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                              )
                          }
                        } else {
                          _vm.$set(
                            _vm.$parent.$data.properties.types,
                            "block",
                            $$c
                          )
                        }
                      },
                      function ($event) {
                        return _vm.toggleType($event, "block")
                      },
                    ],
                  },
                }),
                _vm._v(" "),
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Standard Block"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v("1x1 block with identical textures on all faces"),
                ]),
              ]),
              _vm._v(" "),
              _vm.$parent.$data.properties.types.block
                ? _c("li", { staticStyle: { "padding-left": "20px" } }, [
                    _c("div", { staticClass: "headerLabel" }, [
                      _vm._v("Texture"),
                    ]),
                    _vm._v(" "),
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value:
                              _vm.$parent.$data.properties.variant.default.all,
                            expression:
                              "$parent.$data.properties.variant.default.all",
                          },
                        ],
                        staticClass: "dark_bordered",
                        on: {
                          change: function ($event) {
                            var $$selectedVal = Array.prototype.filter
                              .call($event.target.options, function (o) {
                                return o.selected
                              })
                              .map(function (o) {
                                var val = "_value" in o ? o._value : o.value
                                return val
                              })
                            _vm.$set(
                              _vm.$parent.$data.properties.variant.default,
                              "all",
                              $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            )
                          },
                        },
                      },
                      _vm._l(_vm.Textures(), function (op) {
                        return _c("option", { key: op }, [
                          _vm._v(_vm._s(op.name)),
                        ])
                      }),
                      0
                    ),
                  ])
                : _vm._e(),
            ]),
            _c("br"),
            _vm._v(" "),
            _c(
              "button",
              {
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "start")
                  },
                },
              },
              [_vm._v("Previous")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "physical")
                  },
                },
              },
              [_vm._v("Continue")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticStyle: { float: "right" },
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.createJSON.apply(null, arguments)
                  },
                },
              },
              [_vm._v("Export")]
            ),
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.step == "custom"
        ? _c("div", { staticClass: "wizardPage" }, [
            _c(
              "h1",
              { staticStyle: { padding: "0", "text-align": "center" } },
              [_vm._v("Custom Block Properties")]
            ),
            _vm._v(" "),
            _c("ul", { staticClass: "settingsList" }, [
              _c("li", [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.$parent.$data.properties.bufferedHitbox,
                      expression: "$parent.$data.properties.bufferedHitbox",
                    },
                  ],
                  attrs: { type: "checkbox" },
                  domProps: {
                    checked: Array.isArray(
                      _vm.$parent.$data.properties.bufferedHitbox
                    )
                      ? _vm._i(
                          _vm.$parent.$data.properties.bufferedHitbox,
                          null
                        ) > -1
                      : _vm.$parent.$data.properties.bufferedHitbox,
                  },
                  on: {
                    change: function ($event) {
                      var $$a = _vm.$parent.$data.properties.bufferedHitbox,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false
                      if (Array.isArray($$a)) {
                        var $$v = null,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 &&
                            _vm.$set(
                              _vm.$parent.$data.properties,
                              "bufferedHitbox",
                              $$a.concat([$$v])
                            )
                        } else {
                          $$i > -1 &&
                            _vm.$set(
                              _vm.$parent.$data.properties,
                              "bufferedHitbox",
                              $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                            )
                        }
                      } else {
                        _vm.$set(
                          _vm.$parent.$data.properties,
                          "bufferedHitbox",
                          $$c
                        )
                      }
                    },
                  },
                }),
                _vm._v(" "),
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Simplified Hitbox"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v(
                    "Reduces the hitbox of the block to a single box encompasing the entire block. Use this if your model has rotated blocks, is mostly planes, or who's hitbox is otherwise messy"
                  ),
                ]),
              ]),
              _vm._v(" "),
              _vm.$parent.$data.properties.bufferedHitbox
                ? _c("li", { staticStyle: { "padding-left": "20px" } }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.number",
                          value: _vm.$parent.$data.properties.hitboxBuffer,
                          expression: "$parent.$data.properties.hitboxBuffer",
                          modifiers: { number: true },
                        },
                      ],
                      staticClass: "dark_bordered",
                      attrs: {
                        type: "number",
                        min: "0",
                        max: "16",
                        step: "0.1",
                      },
                      domProps: {
                        value: _vm.$parent.$data.properties.hitboxBuffer,
                      },
                      on: {
                        input: function ($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.$parent.$data.properties,
                            "hitboxBuffer",
                            _vm._n($event.target.value)
                          )
                        },
                        blur: function ($event) {
                          return _vm.$forceUpdate()
                        },
                      },
                    }),
                    _vm._v(" "),
                    _c("div", { staticClass: "headerLabel" }, [
                      _vm._v("Hitbox Buffer"),
                    ]),
                    _vm._v(" "),
                    _c("p", { staticClass: "headerDescription" }, [
                      _vm._v("Closest distance of hitbox to model edge"),
                    ]),
                  ])
                : _vm._e(),
            ]),
            _c("br"),
            _vm._v(" "),
            _c(
              "button",
              {
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "start")
                  },
                },
              },
              [_vm._v("Previous")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "physical")
                  },
                },
              },
              [_vm._v("Continue")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticStyle: { float: "right" },
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.createJSON.apply(null, arguments)
                  },
                },
              },
              [_vm._v("Export")]
            ),
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.step == "variant"
        ? _c("div", { staticClass: "wizardPage" }, [
            _c(
              "h1",
              { staticStyle: { padding: "0", "text-align": "center" } },
              [_vm._v("Variant Blocks")]
            ),
            _vm._v(" "),
            _c("ul", { staticClass: "settingsList" }, [
              _c("li", [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.$parent.$data.properties.types.stair,
                      expression: "$parent.$data.properties.types.stair",
                    },
                  ],
                  attrs: { type: "checkbox" },
                  domProps: {
                    checked: Array.isArray(
                      _vm.$parent.$data.properties.types.stair
                    )
                      ? _vm._i(_vm.$parent.$data.properties.types.stair, null) >
                        -1
                      : _vm.$parent.$data.properties.types.stair,
                  },
                  on: {
                    change: function ($event) {
                      var $$a = _vm.$parent.$data.properties.types.stair,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false
                      if (Array.isArray($$a)) {
                        var $$v = null,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 &&
                            _vm.$set(
                              _vm.$parent.$data.properties.types,
                              "stair",
                              $$a.concat([$$v])
                            )
                        } else {
                          $$i > -1 &&
                            _vm.$set(
                              _vm.$parent.$data.properties.types,
                              "stair",
                              $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                            )
                        }
                      } else {
                        _vm.$set(
                          _vm.$parent.$data.properties.types,
                          "stair",
                          $$c
                        )
                      }
                    },
                  },
                }),
                _vm._v(" "),
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Create Stair Block"),
                ]),
              ]),
              _vm._v(" "),
              _vm.$parent.$data.properties.types.stair
                ? _c("li", { staticStyle: { "padding-left": "20px" } }, [
                    _c("div", { staticClass: "headerLabel" }, [
                      _vm._v("Top Texture"),
                    ]),
                    _vm._v(" "),
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value:
                              _vm.$parent.$data.properties.variant.stair.top,
                            expression:
                              "$parent.$data.properties.variant.stair.top",
                          },
                        ],
                        staticClass: "dark_bordered",
                        on: {
                          change: function ($event) {
                            var $$selectedVal = Array.prototype.filter
                              .call($event.target.options, function (o) {
                                return o.selected
                              })
                              .map(function (o) {
                                var val = "_value" in o ? o._value : o.value
                                return val
                              })
                            _vm.$set(
                              _vm.$parent.$data.properties.variant.stair,
                              "top",
                              $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            )
                          },
                        },
                      },
                      _vm._l(_vm.Textures(), function (op) {
                        return _c("option", { key: op }, [
                          _vm._v(_vm._s(op.name)),
                        ])
                      }),
                      0
                    ),
                  ])
                : _vm._e(),
              _vm._v(" "),
              _vm.$parent.$data.properties.types.stair
                ? _c("li", { staticStyle: { "padding-left": "20px" } }, [
                    _c("div", { staticClass: "headerLabel" }, [
                      _vm._v("Bottom Texture"),
                    ]),
                    _vm._v(" "),
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value:
                              _vm.$parent.$data.properties.variant.stair.bottom,
                            expression:
                              "$parent.$data.properties.variant.stair.bottom",
                          },
                        ],
                        staticClass: "dark_bordered",
                        on: {
                          change: function ($event) {
                            var $$selectedVal = Array.prototype.filter
                              .call($event.target.options, function (o) {
                                return o.selected
                              })
                              .map(function (o) {
                                var val = "_value" in o ? o._value : o.value
                                return val
                              })
                            _vm.$set(
                              _vm.$parent.$data.properties.variant.stair,
                              "bottom",
                              $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            )
                          },
                        },
                      },
                      _vm._l(_vm.Textures(), function (op) {
                        return _c("option", { key: op }, [
                          _vm._v(_vm._s(op.name)),
                        ])
                      }),
                      0
                    ),
                  ])
                : _vm._e(),
              _vm._v(" "),
              _vm.$parent.$data.properties.types.stair
                ? _c("li", { staticStyle: { "padding-left": "20px" } }, [
                    _c("div", { staticClass: "headerLabel" }, [
                      _vm._v("Side Texture"),
                    ]),
                    _vm._v(" "),
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value:
                              _vm.$parent.$data.properties.variant.stair.side,
                            expression:
                              "$parent.$data.properties.variant.stair.side",
                          },
                        ],
                        staticClass: "dark_bordered",
                        on: {
                          change: function ($event) {
                            var $$selectedVal = Array.prototype.filter
                              .call($event.target.options, function (o) {
                                return o.selected
                              })
                              .map(function (o) {
                                var val = "_value" in o ? o._value : o.value
                                return val
                              })
                            _vm.$set(
                              _vm.$parent.$data.properties.variant.stair,
                              "side",
                              $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            )
                          },
                        },
                      },
                      _vm._l(_vm.Textures(), function (op) {
                        return _c("option", { key: op }, [
                          _vm._v(_vm._s(op.name)),
                        ])
                      }),
                      0
                    ),
                  ])
                : _vm._e(),
              _vm._v(" "),
              _c("li", [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.$parent.$data.properties.types.slab,
                      expression: "$parent.$data.properties.types.slab",
                    },
                  ],
                  attrs: { type: "checkbox" },
                  domProps: {
                    checked: Array.isArray(
                      _vm.$parent.$data.properties.types.slab
                    )
                      ? _vm._i(_vm.$parent.$data.properties.types.slab, null) >
                        -1
                      : _vm.$parent.$data.properties.types.slab,
                  },
                  on: {
                    change: function ($event) {
                      var $$a = _vm.$parent.$data.properties.types.slab,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false
                      if (Array.isArray($$a)) {
                        var $$v = null,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 &&
                            _vm.$set(
                              _vm.$parent.$data.properties.types,
                              "slab",
                              $$a.concat([$$v])
                            )
                        } else {
                          $$i > -1 &&
                            _vm.$set(
                              _vm.$parent.$data.properties.types,
                              "slab",
                              $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                            )
                        }
                      } else {
                        _vm.$set(
                          _vm.$parent.$data.properties.types,
                          "slab",
                          $$c
                        )
                      }
                    },
                  },
                }),
                _vm._v(" "),
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Create Slab Block"),
                ]),
              ]),
              _vm._v(" "),
              _vm.$parent.$data.properties.types.slab
                ? _c("li", { staticStyle: { "padding-left": "20px" } }, [
                    _c("div", { staticClass: "headerLabel" }, [
                      _vm._v("Top Texture"),
                    ]),
                    _vm._v(" "),
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value:
                              _vm.$parent.$data.properties.variant.slab.top,
                            expression:
                              "$parent.$data.properties.variant.slab.top",
                          },
                        ],
                        staticClass: "dark_bordered",
                        on: {
                          change: function ($event) {
                            var $$selectedVal = Array.prototype.filter
                              .call($event.target.options, function (o) {
                                return o.selected
                              })
                              .map(function (o) {
                                var val = "_value" in o ? o._value : o.value
                                return val
                              })
                            _vm.$set(
                              _vm.$parent.$data.properties.variant.slab,
                              "top",
                              $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            )
                          },
                        },
                      },
                      _vm._l(_vm.Textures(), function (op) {
                        return _c("option", { key: op }, [
                          _vm._v(_vm._s(op.name)),
                        ])
                      }),
                      0
                    ),
                  ])
                : _vm._e(),
              _vm._v(" "),
              _vm.$parent.$data.properties.types.slab
                ? _c("li", { staticStyle: { "padding-left": "20px" } }, [
                    _c("div", { staticClass: "headerLabel" }, [
                      _vm._v("Bottom Texture"),
                    ]),
                    _vm._v(" "),
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value:
                              _vm.$parent.$data.properties.variant.slab.bottom,
                            expression:
                              "$parent.$data.properties.variant.slab.bottom",
                          },
                        ],
                        staticClass: "dark_bordered",
                        on: {
                          change: function ($event) {
                            var $$selectedVal = Array.prototype.filter
                              .call($event.target.options, function (o) {
                                return o.selected
                              })
                              .map(function (o) {
                                var val = "_value" in o ? o._value : o.value
                                return val
                              })
                            _vm.$set(
                              _vm.$parent.$data.properties.variant.slab,
                              "bottom",
                              $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            )
                          },
                        },
                      },
                      _vm._l(_vm.Textures(), function (op) {
                        return _c("option", { key: op }, [
                          _vm._v(_vm._s(op.name)),
                        ])
                      }),
                      0
                    ),
                  ])
                : _vm._e(),
              _vm._v(" "),
              _vm.$parent.$data.properties.types.slab
                ? _c("li", { staticStyle: { "padding-left": "20px" } }, [
                    _c("div", { staticClass: "headerLabel" }, [
                      _vm._v("Side Texture"),
                    ]),
                    _vm._v(" "),
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value:
                              _vm.$parent.$data.properties.variant.slab.side,
                            expression:
                              "$parent.$data.properties.variant.slab.side",
                          },
                        ],
                        staticClass: "dark_bordered",
                        on: {
                          change: function ($event) {
                            var $$selectedVal = Array.prototype.filter
                              .call($event.target.options, function (o) {
                                return o.selected
                              })
                              .map(function (o) {
                                var val = "_value" in o ? o._value : o.value
                                return val
                              })
                            _vm.$set(
                              _vm.$parent.$data.properties.variant.slab,
                              "side",
                              $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            )
                          },
                        },
                      },
                      _vm._l(_vm.Textures(), function (op) {
                        return _c("option", { key: op }, [
                          _vm._v(_vm._s(op.name)),
                        ])
                      }),
                      0
                    ),
                  ])
                : _vm._e(),
              _vm._v(" "),
              _c("li", [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.$parent.$data.properties.types.wall,
                      expression: "$parent.$data.properties.types.wall",
                    },
                  ],
                  attrs: { type: "checkbox" },
                  domProps: {
                    checked: Array.isArray(
                      _vm.$parent.$data.properties.types.wall
                    )
                      ? _vm._i(_vm.$parent.$data.properties.types.wall, null) >
                        -1
                      : _vm.$parent.$data.properties.types.wall,
                  },
                  on: {
                    change: function ($event) {
                      var $$a = _vm.$parent.$data.properties.types.wall,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false
                      if (Array.isArray($$a)) {
                        var $$v = null,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 &&
                            _vm.$set(
                              _vm.$parent.$data.properties.types,
                              "wall",
                              $$a.concat([$$v])
                            )
                        } else {
                          $$i > -1 &&
                            _vm.$set(
                              _vm.$parent.$data.properties.types,
                              "wall",
                              $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                            )
                        }
                      } else {
                        _vm.$set(
                          _vm.$parent.$data.properties.types,
                          "wall",
                          $$c
                        )
                      }
                    },
                  },
                }),
                _vm._v(" "),
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Create Wall Block"),
                ]),
              ]),
              _vm._v(" "),
              _vm.$parent.$data.properties.types.wall
                ? _c("li", { staticStyle: { "padding-left": "20px" } }, [
                    _c("div", { staticClass: "headerLabel" }, [
                      _vm._v("Wall Texture"),
                    ]),
                    _vm._v(" "),
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value:
                              _vm.$parent.$data.properties.variant.wall.wall,
                            expression:
                              "$parent.$data.properties.variant.wall.wall",
                          },
                        ],
                        staticClass: "dark_bordered",
                        on: {
                          change: function ($event) {
                            var $$selectedVal = Array.prototype.filter
                              .call($event.target.options, function (o) {
                                return o.selected
                              })
                              .map(function (o) {
                                var val = "_value" in o ? o._value : o.value
                                return val
                              })
                            _vm.$set(
                              _vm.$parent.$data.properties.variant.wall,
                              "wall",
                              $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            )
                          },
                        },
                      },
                      _vm._l(_vm.Textures(), function (op) {
                        return _c("option", { key: op }, [
                          _vm._v(_vm._s(op.name)),
                        ])
                      }),
                      0
                    ),
                  ])
                : _vm._e(),
            ]),
            _c("br"),
            _vm._v(" "),
            _c(
              "button",
              {
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "types")
                  },
                },
              },
              [_vm._v("Previous")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "physical")
                  },
                },
              },
              [_vm._v("Continue")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticStyle: { float: "right" },
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.createJSON.apply(null, arguments)
                  },
                },
              },
              [_vm._v("Export")]
            ),
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.step == "physical"
        ? _c("div", { staticClass: "wizardPage" }, [
            _c(
              "h1",
              { staticStyle: { padding: "0", "text-align": "center" } },
              [_vm._v("Physical Properties")]
            ),
            _vm._v(" "),
            _c("ul", { staticClass: "settingsList" }, [
              _c("li", [
                _c("div", { staticClass: "headerLabel" }, [_vm._v("Material")]),
                _vm._v(" "),
                _vm._m(0),
                _vm._v(" "),
                _c(
                  "select",
                  {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.$parent.$data.properties.material,
                        expression: "$parent.$data.properties.material",
                      },
                    ],
                    staticClass: "dark_bordered",
                    on: {
                      change: function ($event) {
                        var $$selectedVal = Array.prototype.filter
                          .call($event.target.options, function (o) {
                            return o.selected
                          })
                          .map(function (o) {
                            var val = "_value" in o ? o._value : o.value
                            return val
                          })
                        _vm.$set(
                          _vm.$parent.$data.properties,
                          "material",
                          $event.target.multiple
                            ? $$selectedVal
                            : $$selectedVal[0]
                        )
                      },
                    },
                  },
                  _vm._l(_vm.materialOptions, function (op) {
                    return _c("option", { key: op }, [_vm._v(_vm._s(op))])
                  }),
                  0
                ),
              ]),
              _vm._v(" "),
              _c("li", [
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Block Sounds"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v(
                    "Sets the sounds made when the custom block is stepped on/broken/etc to match the listed block"
                  ),
                ]),
                _vm._v(" "),
                _c(
                  "select",
                  {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.$parent.$data.properties.sounds,
                        expression: "$parent.$data.properties.sounds",
                      },
                    ],
                    staticClass: "dark_bordered",
                    on: {
                      change: function ($event) {
                        var $$selectedVal = Array.prototype.filter
                          .call($event.target.options, function (o) {
                            return o.selected
                          })
                          .map(function (o) {
                            var val = "_value" in o ? o._value : o.value
                            return val
                          })
                        _vm.$set(
                          _vm.$parent.$data.properties,
                          "sounds",
                          $event.target.multiple
                            ? $$selectedVal
                            : $$selectedVal[0]
                        )
                      },
                    },
                  },
                  _vm._l(_vm.soundOptions, function (op) {
                    return _c("option", { key: op }, [_vm._v(_vm._s(op))])
                  }),
                  0
                ),
              ]),
              _vm._v(" "),
              _c("li", [
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Transparency"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v(
                    "The transparency style of the block. Models with partially transparent textures should be set to Cutout"
                  ),
                ]),
                _vm._v(" "),
                _c(
                  "select",
                  {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.$parent.$data.properties.transparency,
                        expression: "$parent.$data.properties.transparency",
                      },
                    ],
                    staticClass: "dark_bordered",
                    on: {
                      change: function ($event) {
                        var $$selectedVal = Array.prototype.filter
                          .call($event.target.options, function (o) {
                            return o.selected
                          })
                          .map(function (o) {
                            var val = "_value" in o ? o._value : o.value
                            return val
                          })
                        _vm.$set(
                          _vm.$parent.$data.properties,
                          "transparency",
                          $event.target.multiple
                            ? $$selectedVal
                            : $$selectedVal[0]
                        )
                      },
                    },
                  },
                  _vm._l(_vm.transparencyOptions, function (tr) {
                    return _c("option", { key: tr }, [_vm._v(_vm._s(tr))])
                  }),
                  0
                ),
              ]),
              _vm._v(" "),
              _c("li", [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.$parent.$data.properties.gravity,
                      expression: "$parent.$data.properties.gravity",
                    },
                  ],
                  attrs: { type: "checkbox" },
                  domProps: {
                    checked: Array.isArray(_vm.$parent.$data.properties.gravity)
                      ? _vm._i(_vm.$parent.$data.properties.gravity, null) > -1
                      : _vm.$parent.$data.properties.gravity,
                  },
                  on: {
                    change: function ($event) {
                      var $$a = _vm.$parent.$data.properties.gravity,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false
                      if (Array.isArray($$a)) {
                        var $$v = null,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 &&
                            _vm.$set(
                              _vm.$parent.$data.properties,
                              "gravity",
                              $$a.concat([$$v])
                            )
                        } else {
                          $$i > -1 &&
                            _vm.$set(
                              _vm.$parent.$data.properties,
                              "gravity",
                              $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                            )
                        }
                      } else {
                        _vm.$set(_vm.$parent.$data.properties, "gravity", $$c)
                      }
                    },
                  },
                }),
                _vm._v(" "),
                _c("div", { staticClass: "headerLabel" }, [_vm._v("Gravity")]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v(
                    "Determines if the block falls due to gravity (No effect for non-default custom blocks)"
                  ),
                ]),
              ]),
            ]),
            _vm._v(" "),
            _c(
              "button",
              {
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "types")
                  },
                },
              },
              [_vm._v("Previous")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "advPhys")
                  },
                },
              },
              [_vm._v("Continue")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticStyle: { float: "right" },
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.createJSON.apply(null, arguments)
                  },
                },
              },
              [_vm._v("Export")]
            ),
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.step == "advPhys"
        ? _c("div", { staticClass: "wizardPage" }, [
            _c(
              "h1",
              { staticStyle: { padding: "0", "text-align": "center" } },
              [_vm._v("Advanced Physical Properties")]
            ),
            _vm._v(" "),
            _c("ul", { staticClass: "settingsList" }, [
              _c("li", [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.number",
                      value: _vm.$parent.$data.properties.lum,
                      expression: "$parent.$data.properties.lum",
                      modifiers: { number: true },
                    },
                  ],
                  staticClass: "dark_bordered",
                  attrs: { type: "number", min: "0", max: "15" },
                  domProps: { value: _vm.$parent.$data.properties.lum },
                  on: {
                    input: function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(
                        _vm.$parent.$data.properties,
                        "lum",
                        _vm._n($event.target.value)
                      )
                    },
                    blur: function ($event) {
                      return _vm.$forceUpdate()
                    },
                  },
                }),
                _vm._v(" "),
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Luminance"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v(
                    "The light level of the block. Ranges from 0 to 15. Torches default at 14"
                  ),
                ]),
              ]),
              _vm._v(" "),
              _c("li", [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.number",
                      value: _vm.$parent.$data.properties.blastRes,
                      expression: "$parent.$data.properties.blastRes",
                      modifiers: { number: true },
                    },
                  ],
                  staticClass: "dark_bordered",
                  attrs: { type: "number", min: "0" },
                  domProps: { value: _vm.$parent.$data.properties.blastRes },
                  on: {
                    input: function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(
                        _vm.$parent.$data.properties,
                        "blastRes",
                        _vm._n($event.target.value)
                      )
                    },
                    blur: function ($event) {
                      return _vm.$forceUpdate()
                    },
                  },
                }),
                _vm._v(" "),
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Blast Resistance"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v(
                    "How resistant the block is to explosions. Most blocks fall between 0.1 and 9"
                  ),
                ]),
              ]),
              _vm._v(" "),
              _c("li", [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.number",
                      value: _vm.$parent.$data.properties.slip,
                      expression: "$parent.$data.properties.slip",
                      modifiers: { number: true },
                    },
                  ],
                  staticClass: "dark_bordered",
                  attrs: { type: "number", min: "0", step: "0.1" },
                  domProps: { value: _vm.$parent.$data.properties.slip },
                  on: {
                    input: function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(
                        _vm.$parent.$data.properties,
                        "slip",
                        _vm._n($event.target.value)
                      )
                    },
                    blur: function ($event) {
                      return _vm.$forceUpdate()
                    },
                  },
                }),
                _vm._v(" "),
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Slipperiness"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v(
                    "How much you slide when crossing the block. Default is 0.6 and reaches 0.989 for blue ice"
                  ),
                ]),
              ]),
              _vm._v(" "),
              _c("li", [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.$parent.$data.properties.fireproof,
                      expression: "$parent.$data.properties.fireproof",
                    },
                  ],
                  attrs: { type: "checkbox" },
                  domProps: {
                    checked: Array.isArray(
                      _vm.$parent.$data.properties.fireproof
                    )
                      ? _vm._i(_vm.$parent.$data.properties.fireproof, null) >
                        -1
                      : _vm.$parent.$data.properties.fireproof,
                  },
                  on: {
                    change: function ($event) {
                      var $$a = _vm.$parent.$data.properties.fireproof,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false
                      if (Array.isArray($$a)) {
                        var $$v = null,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 &&
                            _vm.$set(
                              _vm.$parent.$data.properties,
                              "fireproof",
                              $$a.concat([$$v])
                            )
                        } else {
                          $$i > -1 &&
                            _vm.$set(
                              _vm.$parent.$data.properties,
                              "fireproof",
                              $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                            )
                        }
                      } else {
                        _vm.$set(_vm.$parent.$data.properties, "fireproof", $$c)
                      }
                    },
                  },
                }),
                _vm._v(" "),
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Fireproof"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v("Determines if the block will burn"),
                ]),
              ]),
            ]),
            _vm._v(" "),
            _c(
              "button",
              {
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "physical")
                  },
                },
              },
              [_vm._v("Previous")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "particles")
                  },
                },
              },
              [_vm._v("Continue")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticStyle: { float: "right" },
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.createJSON.apply(null, arguments)
                  },
                },
              },
              [_vm._v("Export")]
            ),
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.step == "particles"
        ? _c("div", { staticClass: "wizardPage" }, [
            _c(
              "h1",
              { staticStyle: { padding: "0", "text-align": "center" } },
              [_vm._v("Particles")]
            ),
            _vm._v(" "),
            _c("ul", { staticClass: "settingsList" }, [
              _c("li", [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.parentData.properties.particles,
                      expression: "parentData.properties.particles",
                    },
                  ],
                  attrs: { type: "checkbox" },
                  domProps: {
                    checked: Array.isArray(_vm.parentData.properties.particles)
                      ? _vm._i(_vm.parentData.properties.particles, null) > -1
                      : _vm.parentData.properties.particles,
                  },
                  on: {
                    change: function ($event) {
                      var $$a = _vm.parentData.properties.particles,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false
                      if (Array.isArray($$a)) {
                        var $$v = null,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 &&
                            _vm.$set(
                              _vm.parentData.properties,
                              "particles",
                              $$a.concat([$$v])
                            )
                        } else {
                          $$i > -1 &&
                            _vm.$set(
                              _vm.parentData.properties,
                              "particles",
                              $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                            )
                        }
                      } else {
                        _vm.$set(_vm.parentData.properties, "particles", $$c)
                      }
                    },
                  },
                }),
                _vm._v(" "),
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Emit Particles (WIP)"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v(
                    "Enables particle emission. Still in active development"
                  ),
                ]),
              ]),
              _vm._v(" "),
              _vm.parentData.properties.particles
                ? _c("li", [
                    _c("div", { staticClass: "headerLabel" }, [
                      _vm._v("Particle"),
                    ]),
                    _vm._v(" "),
                    _c("p", { staticClass: "headerDescription" }, [
                      _vm._v("Which particle will be emitted"),
                    ]),
                    _vm._v(" "),
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.parentData.properties.particleType,
                            expression: "parentData.properties.particleType",
                          },
                        ],
                        staticClass: "dark_bordered",
                        on: {
                          change: function ($event) {
                            var $$selectedVal = Array.prototype.filter
                              .call($event.target.options, function (o) {
                                return o.selected
                              })
                              .map(function (o) {
                                var val = "_value" in o ? o._value : o.value
                                return val
                              })
                            _vm.$set(
                              _vm.parentData.properties,
                              "particleType",
                              $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            )
                          },
                        },
                      },
                      _vm._l(_vm.particleOptions, function (op) {
                        return _c("option", { key: op }, [_vm._v(_vm._s(op))])
                      }),
                      0
                    ),
                  ])
                : _vm._e(),
              _vm._v(" "),
              _vm.parentData.properties.particles
                ? _c("li", [
                    _c("div", { staticClass: "headerLabel" }, [
                      _vm._v("Particle Spawn Position"),
                    ]),
                    _vm._v(" "),
                    _c("p", { staticClass: "headerDescription" }, [
                      _vm._v("Spawn point of the particles (between 0 and 16)"),
                    ]),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.parentData.properties.particlePos.x,
                          expression: "parentData.properties.particlePos.x",
                        },
                      ],
                      attrs: { type: "number", min: "0", max: "16" },
                      domProps: {
                        value: _vm.parentData.properties.particlePos.x,
                      },
                      on: {
                        input: function ($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.parentData.properties.particlePos,
                            "x",
                            $event.target.value
                          )
                        },
                      },
                    }),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.parentData.properties.particlePos.y,
                          expression: "parentData.properties.particlePos.y",
                        },
                      ],
                      attrs: { type: "number", min: "0", max: "16" },
                      domProps: {
                        value: _vm.parentData.properties.particlePos.y,
                      },
                      on: {
                        input: function ($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.parentData.properties.particlePos,
                            "y",
                            $event.target.value
                          )
                        },
                      },
                    }),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.parentData.properties.particlePos.z,
                          expression: "parentData.properties.particlePos.z",
                        },
                      ],
                      attrs: { type: "number", min: "0", max: "16" },
                      domProps: {
                        value: _vm.parentData.properties.particlePos.z,
                      },
                      on: {
                        input: function ($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.parentData.properties.particlePos,
                            "z",
                            $event.target.value
                          )
                        },
                      },
                    }),
                  ])
                : _vm._e(),
              _vm._v(" "),
              _vm.parentData.properties.particles
                ? _c("li", [
                    _c("div", { staticClass: "headerLabel" }, [
                      _vm._v("Particle Spread"),
                    ]),
                    _vm._v(" "),
                    _c("p", { staticClass: "headerDescription" }, [
                      _vm._v("Spread of particles in blocks"),
                    ]),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.parentData.properties.particleSpread.x,
                          expression: "parentData.properties.particleSpread.x",
                        },
                      ],
                      attrs: { type: "number", min: "0" },
                      domProps: {
                        value: _vm.parentData.properties.particleSpread.x,
                      },
                      on: {
                        input: function ($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.parentData.properties.particleSpread,
                            "x",
                            $event.target.value
                          )
                        },
                      },
                    }),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.parentData.properties.particleSpread.y,
                          expression: "parentData.properties.particleSpread.y",
                        },
                      ],
                      attrs: { type: "number", min: "0" },
                      domProps: {
                        value: _vm.parentData.properties.particleSpread.y,
                      },
                      on: {
                        input: function ($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.parentData.properties.particleSpread,
                            "y",
                            $event.target.value
                          )
                        },
                      },
                    }),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.parentData.properties.particleSpread.z,
                          expression: "parentData.properties.particleSpread.z",
                        },
                      ],
                      attrs: { type: "number", min: "0" },
                      domProps: {
                        value: _vm.parentData.properties.particleSpread.z,
                      },
                      on: {
                        input: function ($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.parentData.properties.particleSpread,
                            "z",
                            $event.target.value
                          )
                        },
                      },
                    }),
                  ])
                : _vm._e(),
              _vm._v(" "),
              _vm.parentData.properties.particles
                ? _c("li", [
                    _c("div", { staticClass: "headerLabel" }, [
                      _vm._v("Particle Velocity"),
                    ]),
                    _vm._v(" "),
                    _c("p", { staticClass: "headerDescription" }, [
                      _vm._v("Velocity of particles in blocks per tick"),
                    ]),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.parentData.properties.particleVel.x,
                          expression: "parentData.properties.particleVel.x",
                        },
                      ],
                      attrs: { type: "number" },
                      domProps: {
                        value: _vm.parentData.properties.particleVel.x,
                      },
                      on: {
                        input: function ($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.parentData.properties.particleVel,
                            "x",
                            $event.target.value
                          )
                        },
                      },
                    }),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.parentData.properties.particleVel.y,
                          expression: "parentData.properties.particleVel.y",
                        },
                      ],
                      attrs: { type: "number" },
                      domProps: {
                        value: _vm.parentData.properties.particleVel.y,
                      },
                      on: {
                        input: function ($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.parentData.properties.particleVel,
                            "y",
                            $event.target.value
                          )
                        },
                      },
                    }),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.parentData.properties.particleVel.z,
                          expression: "parentData.properties.particleVel.z",
                        },
                      ],
                      attrs: { type: "number" },
                      domProps: {
                        value: _vm.parentData.properties.particleVel.z,
                      },
                      on: {
                        input: function ($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.parentData.properties.particleVel,
                            "z",
                            $event.target.value
                          )
                        },
                      },
                    }),
                  ])
                : _vm._e(),
            ]),
            _vm._v(" "),
            _c("br"),
            _vm._v(" "),
            _c(
              "button",
              {
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "advPhys")
                  },
                },
              },
              [_vm._v("Previous")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "datapack")
                  },
                },
              },
              [_vm._v("Continue")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticStyle: { float: "right" },
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.createJSON.apply(null, arguments)
                  },
                },
              },
              [_vm._v("Export")]
            ),
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.step == "datapack"
        ? _c("div", { staticClass: "wizardPage" }, [
            _c(
              "h1",
              { staticStyle: { padding: "0", "text-align": "center" } },
              [_vm._v("Datapack Properties")]
            ),
            _vm._v(" "),
            _c("ul", { staticClass: "settingsList" }, [
              _c("li", [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.parentData.properties.genScRecipe,
                      expression: "parentData.properties.genScRecipe",
                    },
                  ],
                  attrs: { type: "checkbox" },
                  domProps: {
                    checked: Array.isArray(
                      _vm.parentData.properties.genScRecipe
                    )
                      ? _vm._i(_vm.parentData.properties.genScRecipe, null) > -1
                      : _vm.parentData.properties.genScRecipe,
                  },
                  on: {
                    change: function ($event) {
                      var $$a = _vm.parentData.properties.genScRecipe,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false
                      if (Array.isArray($$a)) {
                        var $$v = null,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 &&
                            _vm.$set(
                              _vm.parentData.properties,
                              "genScRecipe",
                              $$a.concat([$$v])
                            )
                        } else {
                          $$i > -1 &&
                            _vm.$set(
                              _vm.parentData.properties,
                              "genScRecipe",
                              $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                            )
                        }
                      } else {
                        _vm.$set(_vm.parentData.properties, "genScRecipe", $$c)
                      }
                    },
                  },
                }),
                _vm._v(" "),
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Generate Recipe"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v("Creates a recipe for creating this block"),
                ]),
              ]),
              _vm._v(" "),
              _c("li", { staticStyle: { "padding-left": "20px" } }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.parentData.properties.genReversableScRecipe,
                      expression: "parentData.properties.genReversableScRecipe",
                    },
                  ],
                  attrs: { type: "checkbox" },
                  domProps: {
                    checked: Array.isArray(
                      _vm.parentData.properties.genReversableScRecipe
                    )
                      ? _vm._i(
                          _vm.parentData.properties.genReversableScRecipe,
                          null
                        ) > -1
                      : _vm.parentData.properties.genReversableScRecipe,
                  },
                  on: {
                    change: function ($event) {
                      var $$a = _vm.parentData.properties.genReversableScRecipe,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false
                      if (Array.isArray($$a)) {
                        var $$v = null,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 &&
                            _vm.$set(
                              _vm.parentData.properties,
                              "genReversableScRecipe",
                              $$a.concat([$$v])
                            )
                        } else {
                          $$i > -1 &&
                            _vm.$set(
                              _vm.parentData.properties,
                              "genReversableScRecipe",
                              $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                            )
                        }
                      } else {
                        _vm.$set(
                          _vm.parentData.properties,
                          "genReversableScRecipe",
                          $$c
                        )
                      }
                    },
                  },
                }),
                _vm._v(" "),
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Make recipe reverseable"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v("Creates a recipe that reverse the above"),
                ]),
              ]),
            ]),
            _vm._v(" "),
            _c("br"),
            _vm._v(" "),
            _c(
              "button",
              {
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "particles")
                  },
                },
              },
              [_vm._v("Previous")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "other")
                  },
                },
              },
              [_vm._v("Continue")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticStyle: { float: "right" },
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.createJSON.apply(null, arguments)
                  },
                },
              },
              [_vm._v("Export")]
            ),
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.step == "other"
        ? _c("div", { staticClass: "wizardPage" }, [
            _c(
              "h1",
              { staticStyle: { padding: "0", "text-align": "center" } },
              [_vm._v("Other Properties")]
            ),
            _vm._v(" "),
            _c("ul", { staticClass: "settingsList" }, [
              _c("li", [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.number",
                      value: _vm.$parent.$data.properties.maxStack,
                      expression: "$parent.$data.properties.maxStack",
                      modifiers: { number: true },
                    },
                  ],
                  staticClass: "dark_bordered",
                  attrs: { type: "number", min: "0" },
                  domProps: { value: _vm.$parent.$data.properties.maxStack },
                  on: {
                    input: function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(
                        _vm.$parent.$data.properties,
                        "maxStack",
                        _vm._n($event.target.value)
                      )
                    },
                    blur: function ($event) {
                      return _vm.$forceUpdate()
                    },
                  },
                }),
                _vm._v(" "),
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Max Stack Size"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v("The maximum number the block in a stack"),
                ]),
              ]),
              _vm._v(" "),
              _c("li", [
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Creative Tab"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v(
                    "Which tab on the creative inventory menu the block will be added to"
                  ),
                ]),
                _vm._v(" "),
                _c(
                  "select",
                  {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.$parent.$data.properties.creativeTab,
                        expression: "$parent.$data.properties.creativeTab",
                      },
                    ],
                    staticClass: "dark_bordered",
                    on: {
                      change: function ($event) {
                        var $$selectedVal = Array.prototype.filter
                          .call($event.target.options, function (o) {
                            return o.selected
                          })
                          .map(function (o) {
                            var val = "_value" in o ? o._value : o.value
                            return val
                          })
                        _vm.$set(
                          _vm.$parent.$data.properties,
                          "creativeTab",
                          $event.target.multiple
                            ? $$selectedVal
                            : $$selectedVal[0]
                        )
                      },
                    },
                  },
                  _vm._l(_vm.tabOptions, function (op) {
                    return _c("option", { key: op }, [_vm._v(_vm._s(op))])
                  }),
                  0
                ),
              ]),
              _vm._v(" "),
              _c("li", [
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Rotation Type"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v("if y_axis, faces the player when placed"),
                ]),
                _vm._v(" "),
                _c(
                  "select",
                  {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.$parent.$data.properties.rotType,
                        expression: "$parent.$data.properties.rotType",
                      },
                    ],
                    staticClass: "dark_bordered",
                    on: {
                      change: function ($event) {
                        var $$selectedVal = Array.prototype.filter
                          .call($event.target.options, function (o) {
                            return o.selected
                          })
                          .map(function (o) {
                            var val = "_value" in o ? o._value : o.value
                            return val
                          })
                        _vm.$set(
                          _vm.$parent.$data.properties,
                          "rotType",
                          $event.target.multiple
                            ? $$selectedVal
                            : $$selectedVal[0]
                        )
                      },
                    },
                  },
                  _vm._l(_vm.rotationTypes, function (op) {
                    return _c("option", { key: op }, [_vm._v(_vm._s(op))])
                  }),
                  0
                ),
              ]),
              _vm._v(" "),
              _c("li", [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.parentData.properties.animated,
                      expression: "parentData.properties.animated",
                    },
                  ],
                  attrs: { type: "checkbox" },
                  domProps: {
                    checked: Array.isArray(_vm.parentData.properties.animated)
                      ? _vm._i(_vm.parentData.properties.animated, null) > -1
                      : _vm.parentData.properties.animated,
                  },
                  on: {
                    change: function ($event) {
                      var $$a = _vm.parentData.properties.animated,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false
                      if (Array.isArray($$a)) {
                        var $$v = null,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 &&
                            _vm.$set(
                              _vm.parentData.properties,
                              "animated",
                              $$a.concat([$$v])
                            )
                        } else {
                          $$i > -1 &&
                            _vm.$set(
                              _vm.parentData.properties,
                              "animated",
                              $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                            )
                        }
                      } else {
                        _vm.$set(_vm.parentData.properties, "animated", $$c)
                      }
                    },
                  },
                }),
                _vm._v(" "),
                _c("div", { staticClass: "headerLabel" }, [
                  _vm._v("Animated Textures (WIP)"),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "headerDescription" }, [
                  _vm._v(
                    "Enables texture animations. Currently only recommended for single texture models"
                  ),
                ]),
              ]),
            ]),
            _vm._v(" "),
            _c("br"),
            _vm._v(" "),
            _c(
              "button",
              {
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.changePage($event, "datapack")
                  },
                },
              },
              [_vm._v("Previous")]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticStyle: { float: "right" },
                on: {
                  click: function ($event) {
                    $event.preventDefault()
                    return _vm.createJSON.apply(null, arguments)
                  },
                },
              },
              [_vm._v("Export")]
            ),
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.step == "settings"
        ? _c("div", { staticClass: "wizardPage" }, [
            _c(
              "h1",
              { staticStyle: { padding: "0", "text-align": "center" } },
              [_vm._v("BAMO Export Settings")]
            ),
            _vm._v(" "),
            _vm._m(1),
          ])
        : _vm._e(),
    ]),
  ])
}
var staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", { staticClass: "headerDescription" }, [
      _vm._v(
        "Sets default properties to match those of the listed block. For a list of properties each block has, see the "
      ),
      _c(
        "a",
        { attrs: { href: "https://minecraft.fandom.com/wiki/Materials" } },
        [_vm._v("Minecraft wiki")]
      ),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("ul", { staticClass: "settingsList" }, [
      _c("li", [
        _c("div", { staticClass: "headerLabel" }, [_vm._v("Set Namespace")]),
        _vm._v(" "),
        _c("p", { staticClass: "headerDescription" }, [_vm._v("WIP")]),
      ]),
      _vm._v(" "),
      _c("li", [
        _c("div", { staticClass: "headerLabel" }, [
          _vm._v("Only export textures currently used"),
        ]),
        _vm._v(" "),
        _c("p", { staticClass: "headerDescription" }, [_vm._v("WIP")]),
      ]),
      _vm._v(" "),
      _c("li", [
        _c("div", { staticClass: "headerLabel" }, [_vm._v("reuse model file")]),
        _vm._v(" "),
        _c("p", { staticClass: "headerDescription" }, [_vm._v("WIP")]),
      ]),
      _vm._v(" "),
      _c("li", [
        _c("div", { staticClass: "headerLabel" }, [
          _vm._v("show warning if model with same name exists"),
        ]),
        _vm._v(" "),
        _c("p", { staticClass: "headerDescription" }, [_vm._v("WIP")]),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "headerLabel",
            staticStyle: { "padding-left": "40px" },
          },
          [_vm._v("Only do this if file is closed/new file loaded")]
        ),
      ]),
    ])
  },
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ normalizeComponent)
/* harmony export */ });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

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
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_date_to_string_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.date.to-string.js */ "./node_modules/core-js/modules/es.date.to-string.js");
/* harmony import */ var core_js_modules_es_date_to_string_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_date_to_string_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "./node_modules/core-js/modules/es.object.to-string.js");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.regexp.to-string.js */ "./node_modules/core-js/modules/es.regexp.to-string.js");
/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.function.name.js */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.object.assign.js */ "./node_modules/core-js/modules/es.object.assign.js");
/* harmony import */ var core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.symbol.js */ "./node_modules/core-js/modules/es.symbol.js");
/* harmony import */ var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.symbol.description.js */ "./node_modules/core-js/modules/es.symbol.description.js");
/* harmony import */ var core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.symbol.iterator.js */ "./node_modules/core-js/modules/es.symbol.iterator.js");
/* harmony import */ var core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_iterator_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.array.iterator.js */ "./node_modules/core-js/modules/es.array.iterator.js");
/* harmony import */ var core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.string.iterator.js */ "./node_modules/core-js/modules/es.string.iterator.js");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _components_BamoBaseComponent_vue__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/BamoBaseComponent.vue */ "./src/components/BamoBaseComponent.vue");
/* harmony import */ var _util_Codec__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./util/Codec */ "./src/util/Codec.js");
/* harmony import */ var _util_Settings__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./util/Settings */ "./src/util/Settings.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
















var css = (__webpack_require__(/*! ./components/bamo.css */ "./src/components/bamo.css").toString)();

var btn;
var exportWindow;
var cssData;
var minecraftFolder;
Plugin.register('bamo', {
  title: 'BAMO Exporter',
  author: 'Ryytikki',
  description: 'Create custom Minecraft blocks without having to write a single line of code when paired with the BAMO mod. https://www.curseforge.com/minecraft/mc-mods/bamo-block-and-move-on',
  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAN6SURBVDhPJZJrTJtVGMd/b99CYUOgLTA6oKV1HWvHitwnGyZzW7INw5RIXBbjjJc598WpM+oXxz6a+JFETVzch8XEaGKcM9lCNIToqGDHTSiXAV2h5VZKW6illPb1fV/Pyck5Oec5z/O/PMKHv5yVtFotO7spIpENQMBYYSQ4HcBgMGAymViPhIlFo5ABnU5HPB5naWkJh8OBBo1ANBPDrCvBnm/GVWlnpmOUwnI9ceFf/n7kwWU8QH15NXvy84ilN9XENpuNdG4GjbPKxmzHEFXHqvhne5bJ2BOyCrIoOFhI5PISznonvpw1BEGg9dkGNt5dxpfwkyzcYfHyHMIZa4nkuPQR499+jiaZQ/2fzYy1PUIryuA0GvZ069l8aRlzn5OpE4O0nj2Ce8CPLkvkiMuEcOfjDmlsch67rZzW6krevvEDV187zvjcMjnZWoaGAghPCaRCcawXr5E99B2NLju37g1Qbd2HaCnK6xqZX6PWXsZMcJ1cXZqSIj0PBqbwr0ZIaTLUHSxDX5yP5/d7WCtMzAbWKTXkceH5GoSRL69Id3qG2N7ZJZNMYLlwk+CPN8nK3cvrZ+rZTWf45tdB9azQUs7Nhy0MjPupshQjZglSl+wdb5xr4PDTZYRHethv2kcoKjswtYgki3ffPUVR4V4WQjE240kCa1EanRWk0xLi1fbmrpXwFsOPg2rwuG8di0lPdCvBqKyDIM+2FgeSBF7fKhkpoyJ5MDBNtlZEtBbnd9UfKqdncEYOhWxZ3d88j1X+TY4KNXg2EGI5vKm+XTz1jCxeKcGlVVxVZrmR5KHwVBR99XStKkx5cQHd751XkfR5JnmrrVFd7okFxmQUD0emKeu8gXfah3D7+ouSYpmSRBElntjhVN0Bvvi+j9O1ZnrFFo4m+siI2QRWo/wx5uPNF5oYlJNMBGMIn3a2SO4JP++cP8rDUR819lI2EylO1Nj46q4bfa4GSdSxlUhSmJerAFbpXGlvVotqFPuUz57JRWS6DAdSBFc26Pf6Oeaykkhr6B2e4/orz6n79k6Kay8fp3dkHrd3AeHW++3S5JNVFdrtTzr5+ud+vAsh6ioN9HmXZS3a1ardP/VzssHOX7L/SpKGQxXqvdjWZO8KhqJ8dukk92UnzKUGtOkkxnMfYAyPEk2mZUeiaqMtrESotpWyv6iA/4vO8x8IAITQHDgPDwAAAABJRU5ErkJggg==',
  tags: ['Minecraft: Java Edition'],
  version: '0.5.0',
  variant: 'desktop',
  onload: function onload() {
    (0,_util_Codec__WEBPACK_IMPORTED_MODULE_12__.loadCodec)(); // Setting that holds the resource pack folder location

    minecraftFolder = new Setting('minecraftFolder', {
      name: 'Minecraft Folder Location',
      description: 'Location of the Minecraft folder on your PC',
      category: 'export',
      type: 'text',
      value: ''
    }); // Export button in menu

    btn = new Action('bamo', {
      name: 'BAMO Exporter',
      description: 'Exports a block for the BAMO mod',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAN6SURBVDhPJZJrTJtVGMd/b99CYUOgLTA6oKV1HWvHitwnGyZzW7INw5RIXBbjjJc598WpM+oXxz6a+JFETVzch8XEaGKcM9lCNIToqGDHTSiXAV2h5VZKW6illPb1fV/Pyck5Oec5z/O/PMKHv5yVtFotO7spIpENQMBYYSQ4HcBgMGAymViPhIlFo5ABnU5HPB5naWkJh8OBBo1ANBPDrCvBnm/GVWlnpmOUwnI9ceFf/n7kwWU8QH15NXvy84ilN9XENpuNdG4GjbPKxmzHEFXHqvhne5bJ2BOyCrIoOFhI5PISznonvpw1BEGg9dkGNt5dxpfwkyzcYfHyHMIZa4nkuPQR499+jiaZQ/2fzYy1PUIryuA0GvZ069l8aRlzn5OpE4O0nj2Ce8CPLkvkiMuEcOfjDmlsch67rZzW6krevvEDV187zvjcMjnZWoaGAghPCaRCcawXr5E99B2NLju37g1Qbd2HaCnK6xqZX6PWXsZMcJ1cXZqSIj0PBqbwr0ZIaTLUHSxDX5yP5/d7WCtMzAbWKTXkceH5GoSRL69Id3qG2N7ZJZNMYLlwk+CPN8nK3cvrZ+rZTWf45tdB9azQUs7Nhy0MjPupshQjZglSl+wdb5xr4PDTZYRHethv2kcoKjswtYgki3ffPUVR4V4WQjE240kCa1EanRWk0xLi1fbmrpXwFsOPg2rwuG8di0lPdCvBqKyDIM+2FgeSBF7fKhkpoyJ5MDBNtlZEtBbnd9UfKqdncEYOhWxZ3d88j1X+TY4KNXg2EGI5vKm+XTz1jCxeKcGlVVxVZrmR5KHwVBR99XStKkx5cQHd751XkfR5JnmrrVFd7okFxmQUD0emKeu8gXfah3D7+ouSYpmSRBElntjhVN0Bvvi+j9O1ZnrFFo4m+siI2QRWo/wx5uPNF5oYlJNMBGMIn3a2SO4JP++cP8rDUR819lI2EylO1Nj46q4bfa4GSdSxlUhSmJerAFbpXGlvVotqFPuUz57JRWS6DAdSBFc26Pf6Oeaykkhr6B2e4/orz6n79k6Kay8fp3dkHrd3AeHW++3S5JNVFdrtTzr5+ud+vAsh6ioN9HmXZS3a1ardP/VzssHOX7L/SpKGQxXqvdjWZO8KhqJ8dukk92UnzKUGtOkkxnMfYAyPEk2mZUeiaqMtrESotpWyv6iA/4vO8x8IAITQHDgPDwAAAABJRU5ErkJggg==',
      click: function click() {
        if (Project.name != undefined) {
          if (Texture.all.length == 0) {
            Blockbench.showMessageBox({
              buttons: ["Ok"],
              title: "Error",
              message: "Please create a texture"
            });
            return;
          } // If the bamoSettings for the file havent been generated, generate


          if (_typeof(_util_Settings__WEBPACK_IMPORTED_MODULE_13__["default"][Project.uuid]) !== 'object') {
            _util_Settings__WEBPACK_IMPORTED_MODULE_13__["default"][Project.uuid] = Object.assign({}, _util_Settings__WEBPACK_IMPORTED_MODULE_13__.BAMO_SETTINGS_DEFAULT);
            _util_Settings__WEBPACK_IMPORTED_MODULE_13__["default"][Project.uuid].displayName = Project.name;
          }

          if (Settings.get('minecraftFolder') != undefined && Settings.get('minecraftFolder') != '') {
            exportWindow.show();
            exportWindow.content_vue.updateValues();
          } else {
            Blockbench.showMessageBox({
              buttons: ["Ok"],
              title: "Error",
              message: "You must set your Minecraft folder location under Settings->Export"
            });
          }
        } else {
          Blockbench.showMessageBox({
            buttons: ["Ok"],
            title: "Error",
            message: "Please ensure your file is saved before exporting. If you see this for a saved file, reload it and try again"
          });
        }
      }
    });
    MenuBar.addAction(btn, 'tools'); // Dialog that opens when you click the button1
    // See the BamoComponent object for details

    exportWindow = new Dialog('BAMOExportWindow', {
      id: "BAMO",
      title: 'BAMO Exporter',
      component: _components_BamoBaseComponent_vue__WEBPACK_IMPORTED_MODULE_11__["default"],
      buttons: [],
      padding: !1,
      width: 720,
      height: 620
    });
    cssData = Blockbench.addCSS(css);
  },
  onunload: function onunload() {
    btn["delete"]();
    minecraftFolder["delete"](); //cssData.delete();

    (0,_util_Codec__WEBPACK_IMPORTED_MODULE_12__.unloadCodec)();
  }
});
})();

/******/ })()
;
//# sourceMappingURL=bamo.js.map