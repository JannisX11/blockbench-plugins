/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/actions/ExportAsResourcepackAction.js":
/*!***************************************************!*\
  !*** ./src/actions/ExportAsResourcepackAction.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dialogues_ExportAsResourcepackDialogue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dialogues/ExportAsResourcepackDialogue */ "./src/dialogues/ExportAsResourcepackDialogue.js");
/**
 * @author: BurnGemios3643 alias patatoe02#1499
 * GitHub: https://github.com/leopoldhub
 */


const SelectInfosAction = (callin = () => {}, callback = () => {}) =>
	new Action({
		id: 'export_action',
		name: 'Export as resourcepack model',
		icon: 'source',
		description: 'Export as resourcepack model',
		category: 'file',
		condition: () => Format.id === 'java_block',
		click: function (ev) {
			Object(_dialogues_ExportAsResourcepackDialogue__WEBPACK_IMPORTED_MODULE_0__["default"])(callin, callback).show();
		},
	});

/* harmony default export */ __webpack_exports__["default"] = (SelectInfosAction);


/***/ }),

/***/ "./src/dialogues/ExportAsResourcepackDialogue.js":
/*!*******************************************************!*\
  !*** ./src/dialogues/ExportAsResourcepackDialogue.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * @author: BurnGemios3643 alias patatoe02#1499
 * GitHub: https://github.com/leopoldhub
 */
const SelectInfosDialogue = (callin = () => {}, callback = () => {}) =>
	new Dialog({
		id: 'select_settings',
		title: 'Pack Settings',
		draggable: true,
		form: {
			pack_version: {
				label: 'Pack Version',
				type: 'select',
				options: {
					1: '1.8',
					2: '1.9-1.10',
					3: '1.11-1.12',
					4: '1.13-1.14',
					5: '1.15-1.16.1',
					6: '1.16.2-1.16.5',
					7: '1.17+',
				},
				value: callin().pack_version,
			},
			pack_name: {
				label: 'Pack Name',
				type: 'input',
				value: callin().pack_name,
			},
			pack_description: {
				label: 'Pack Description',
				type: 'textarea',
				value: callin().pack_description,
			},
			enable_credits: {
				label: 'Enable Credits',
				type: 'select',
				options: {
					0: 'false',
					1: 'true',
				},
				value: callin().enable_credits,
			},
			pack_credits: {
				label: 'Pack Credits',
				type: 'input',
				placeholder: 'keep empty for default credits',
				value: callin().pack_credits,
			},
			model_type: {
				label: 'Model type',
				type: 'select',
				options: {
					block: 'block',
					item: 'item',
				},
				value: callin().model_type,
			},
			model_id: {
				label: 'Model id',
				type: 'input',
				value: callin().model_id,
			},
		},
		onConfirm: function (data) {
			callback(data);
			this.hide();
		},
	});

/* harmony default export */ __webpack_exports__["default"] = (SelectInfosDialogue);


/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _actions_ExportAsResourcepackAction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions/ExportAsResourcepackAction */ "./src/actions/ExportAsResourcepackAction.js");
/**
 * @author: BurnGemios3643 alias patatoe02#1499
 * GitHub: https://github.com/leopoldhub
 */


const menuExportAsResourcepackAction = Object(_actions_ExportAsResourcepackAction__WEBPACK_IMPORTED_MODULE_0__["default"])(
	() => {
		return {
			pack_version: getPackVersion(),
			pack_name: getPackName(),
			pack_description: getPackDescription(),
			enable_credits: isEnableCredit() ? '1' : '0',
			pack_credits: getPackCredits(),
			model_type: getModelType(),
			model_id: getModelId(),
		};
	},
	data => {
		setPackVersion(data.pack_version);
		setPackName(data.pack_name);
		setPackDescription(data.pack_description);
		setEnableCredit(data.enable_credits != 0);
		setPackCredits(data.pack_credits);
		setModelType(data.model_type);
		setModelId(data.model_id);
		exportResourcePack();
	}
);

Plugin.register('resourcepack_creator', {
	title: 'Resourcepack Creator',
	author: 'BurnGemios3643',
	icon: 'source',
	description: 'Create custom models and export them as resourcepack',
	version: '1.0.0',
	variant: 'both',
	onload() {
		MenuBar.addAction(menuExportAsResourcepackAction, 'file.export');
	},
	onunload() {
		this.onuninstall();
	},
	onuninstall() {
		menuExportAsResourcepackAction.delete();
	},
});

let pack_version = 1;

function setPackVersion(version = 1) {
	pack_version = version;
}

function getPackVersion() {
	return pack_version;
}

let pack_name = 'resourcepack';

function setPackName(name = pack_name) {
	pack_name = name;
}

function getPackName() {
	return pack_name;
}

let pack_description = 'my resourcepack';

function setPackDescription(description = pack_description) {
	pack_description = description;
}

function getPackDescription() {
	return pack_description;
}

let enable_credits = true;

function setEnableCredit(enable = enable_credits) {
	enable_credits = enable;
}

function isEnableCredit() {
	return enable_credits;
}

let pack_credits = '';

function setPackCredits(credits = pack_credits) {
	pack_credits = credits;
}

function getPackCredits() {
	return pack_credits;
}

let model_type = 'block';

function setModelType(type = model_type) {
	model_type = type;
}

function getModelType() {
	return model_type;
}

let model_id = 'stone';

function setModelId(id = model_id) {
	model_id = id;
}

function getModelId() {
	return model_id;
}

const paths = {
	block: {
		model: 'assets/minecraft/models/block',
		textures: 'assets/minecraft/textures/blocks',
	},
	item: {
		model: 'assets/minecraft/models/item',
		textures: 'assets/minecraft/textures/items',
	},
};

function exportResourcePack() {
	Screencam.cleanCanvas({ width: 100, height: 100 }, base64 => {
		let packZip = new JSZip();
		packZip.file('pack.png', base64.split(',')[1], { base64: true });

		const manifestObject = {
			pack: {
				description: getPackDescription(),
				pack_format: parseInt(getPackVersion()),
			},
		};
		const animTextureObject = { animation: { frametime: 2 } };
		packZip.file('pack.mcmeta', JSON.stringify(manifestObject, null, '\t'));

		const modelfolder = packZipFolderParser(
			packZip,
			paths[getModelType()].model
		);
		const texturesfolder = packZipFolderParser(
			packZip,
			paths[getModelType()].textures
		);

		const texturesspecpath = paths[getModelType()].textures
			.split('/')
			.slice(-1)
			.pop();

		for (let i = 0; i < textures.length; i++) {
			textures[i].name = `texture_${getModelId()}_${i}.png`;
			textures[i].folder = texturesspecpath;
			textures[i].namespace = 'minecraft';
			if (textures[i].frameCount > 1) {
				texturesfolder.file(
					`texture_${getModelId()}_${i}.png`,
					JSON.stringify(animTextureObject, null, '\t')
				);
			}
			texturesfolder.file(
				`texture_${getModelId()}_${i}.png`,
				textures[i].getBase64(),
				{ base64: true }
			);
		}

		const data = JSON.parse(Codecs.java_block.compile());
		data.credit =
			pack_credits.length > 0
				? pack_credits
				: data.credit +
				  ' and exported with Resourcepack Creator by BurnGemios3643 alias patatoe02#1499';
		data.credit = isEnableCredit() ? data.credit : undefined;

		modelfolder.file(`${getModelId()}.json`, JSON.stringify(data, null, '\t'));

		packZip.generateAsync({ type: 'blob' }).then(content => {
			Blockbench.export({
				type: 'Zip Archive',
				extensions: ['zip'],
				name: getPackName(),
				content: content,
				savetype: 'zip',
			});
		});
	});
}

function packZipFolderParser(packZip, path) {
	const splitpath = path.split('/');
	let folder = packZip;
	let pathpart;
	while ((pathpart = splitpath.shift())) {
		folder = folder.folder(pathpart);
	}
	return folder;
}


/***/ })

/******/ });
//# sourceMappingURL=resourcepack_creator.js.map