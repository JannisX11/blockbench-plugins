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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/skin_packager.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/generate_pack.js":
/*!******************************!*\
  !*** ./src/generate_pack.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_uninstall_register__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/uninstall_register */ "./src/util/uninstall_register.js");


// https://docs.microsoft.com/en-us/minecraft/creator/documents/packagingaskinpack

const BoneTypes = {
	body: 'base',
	head: 'base',
	hat: 'clothing',
	helmet: 'armor',
	rightArm: 'base',
	rightSleeve: 'clothing',
	rightArmArmor: 'armor',
	rightItem: 'item',
	leftArm: 'base',
	leftSleeve: 'clothing',
	leftArmArmor: 'armor',
	leftItem: 'item',
	jacket: 'clothing',
	bodyArmor: 'armor',
	waist: 'armor_offset',
	rightLeg: 'base',
	rightPants: 'clothing',
	rightLeggings: 'armor',
	rightBoot: 'armor',
	leftLeg: 'base',
	leftPants: 'clothing',
	leftLeggings: 'armor',
	leftBoot: 'armor',
}

const FormValues = {};
const SkinData = [];

function isProjectSlim(project) {
	let arm_cube = project.elements.find(el => el instanceof Cube && el.name.includes('Right Arm'));
	return arm_cube && arm_cube.size(0) < 3.8;
}

Object(_util_uninstall_register__WEBPACK_IMPORTED_MODULE_0__["registerRemovable"])(Blockbench.addCSS(`
	.skin_pack_export_list > div {
		padding-left: 90px;
		display: flex;
	}
	.skin_pack_export_list > div > label {
		flex-grow: 1;
		width: 0;
	}
	.skin_pack_export_list > div > label.checkbox {
		flex-grow: 0;
		width: 34px;
		text-align: center;
	}
	.skin_pack_export_list li {
		display: flex;
		align-items: center;
	}
	.skin_pack_export_list li.disabled_skin {
		opacity: 0.5;
	}
	.skin_pack_export_list li > * {
		margin: 2px;
		object-fit: contain;
	}
	.skin_pack_export_list li input[type=checkbox] {
		text-align: center;
		min-width: 30px;
	}
	.skin_pack_export_list li input[type=text] {
		flex-grow: 1;
	}
	.skin_pack_export_list .skin_drag_handle {
		flex-grow: 0;
		cursor: move;
		padding-top: 6px;
	}
	.skin_pack_export_list li img {
		transition: transform 100ms ease;
		transform-origin: left;
	}
	.skin_pack_export_list li:not(.disabled_skin) img:hover {
		transform: scale(4);
		background-color: var(--color-back);
		border: 0.25px solid var(--color-accent);
	}
`));

function cleanTextureName(name) {
	return name.replace(/\.png$/i, '')
}

function selectSkinsForExport() {
	let uuids = [];
	ModelProject.all.forEach(project => {
		if (project.format.id !== 'minecraft_skin_geometry' && project.format.id !== 'skin') return;
		if (!project.textures[0]) return;

		if (project.format.id === 'minecraft_skin_geometry') {
			let data = SkinData.find(s => s.uuid == project.uuid);
			if (!data) {
				data = {
					uuid: project.uuid,
					export: true,
					slim: project.minecraft_skin_slim,
					free: false
				};
				SkinData.push(data)
			}
			data.thumbnail = project.thumbnail || project.textures[0].source;
			data.name = project.name;
			data.id = project.geometry_name;
			uuids.push(project.uuid);

		} else {
			let multi = project.textures.length > 1;
			project.textures.forEach((texture, i) => {
				let uuid = project.uuid + '-' + texture.uuid;
				let data = SkinData.find(s => s.uuid == uuid);
				if (!data) {
					data = {
						uuid: uuid,
						export: true,
						slim: isProjectSlim(project),
						free: false,
						name: multi ? cleanTextureName(texture.name) : project.name,
						id: multi ? cleanTextureName(texture.name).replace(/\s+/g, '') : project.geometry_name,
					};
					SkinData.push(data);
				}
				data.texture = texture;
				data.thumbnail = texture.source;
				if (!multi) data.name = project.name;
				if (!multi) data.id = project.geometry_name;
				uuids.push(data.uuid);
			})
		}
	})
	SkinData.forEachReverse((skin) => {
		if (!uuids.includes(skin.uuid)) {
			SkinData.remove(skin);
		}
	})

	let dialog = new Dialog({
		id: 'skin_pack_export',
		title: 'Export Skin Pack',
		width: 700,
		form: {
			name: {label: 'Pack Name', type: 'text', value: FormValues.name},
			id: {label: 'Pack Identifier', type: 'text', value: FormValues.id},
			uuid: {label: 'UUID', type: 'text', value: FormValues.uuid || guid()},
			regenerate_uuid: {label: ' ', nocolon: true, type: 'buttons', buttons: ['Regenerate UUID'], click(index) {
				dialog.setFormValues({uuid: guid()});
			}},
			separator: '_'
		},
		component: {
			data() {return {
				skins: SkinData
			}},
			methods: {
				changeMeta(skin, uuid, key, event) {
					let project = ModelProject.all.find(p => p.uuid == uuid || (p.textures.length == 1 && uuid == p.uuid + '-' + p.textures[0].uuid));
					if (project) {
						if (key == 'id') {
							project.geometry_name = skin.id;
						} else {
							project.name = skin.name;
						}
						project.saved = false;
					}
				},
				sort(event) {
					var item = this.skins.splice(event.oldIndex, 1)[0];
					this.skins.splice(event.newIndex, 0, item);
				},
				drop(event) {},
			},
			template: `
				<div class="skin_pack_export_list">
					<div>
						<label>ID</label>
						<label>Name</label>
						<label class="checkbox">Slim</label>
						<label class="checkbox">Free</label>
					</div>
					<ul v-sortable="{onUpdate: sort, onEnd: drop, animation: 160, handle: '.skin_drag_handle'}">
						<li v-for="skin in skins" :key="skin.uuid" :class="{disabled_skin: !skin.export}">
							<div class="skin_drag_handle"><i class="material-icons">drag_handle</i></div>
							<input type="checkbox" v-model="skin.export" :style="{color: skin.export ? 'var(--color-accent)' : 'unset'}">
							<img :src="skin.thumbnail" width="48px" height="48px" />
							<input type="text" class="dark_bordered" v-model="skin.id" @input="changeMeta(skin, skin.id, 'id', $event)">
							<input type="text" class="dark_bordered" v-model="skin.name" @input="changeMeta(skin, skin.id, 'name', $event)">
							<input type="checkbox" v-model="skin.slim">
							<input type="checkbox" v-model="skin.free">
						</li>
					</ul>
				</div>
			`
		},
		onConfirm(formResult) {
			FormValues.id = formResult.id;
			FormValues.name = formResult.name;
			FormValues.uuid = formResult.uuid;
			generatePack({
				id: formResult.id,
				name: formResult.name,
				uuid: formResult.uuid,
			})
		}
	}).show();
}



async function generatePack(options) {
	let archive = new JSZip();

	let geometries = {};
	let skins = [];
	let translations = [
		`skinpack.${options.id}=${options.name}`
	];

	for (let skin of SkinData) {
		let uuid = skin.uuid;
		console.log(skin, uuid)
		if (!skin.export) continue;
		let project = ModelProject.all.find(p => uuid.substring(0, p.uuid.length) == p.uuid);
		console.log(project)
		if (!project) continue;

		let geometry_name = (project.format.id == 'minecraft_skin_geometry') && `geometry.${options.id}.${skin.id}`;

		// Meta
		let meta = {
			localization_name: skin.id,
			geometry: geometry_name || `geometry.humanoid.${skin.slim ? 'customSlim' : 'custom'}`,
			texture: `${skin.id}.png`,
			type: skin.free ? 'free' : 'paid',
		};
		skins.push(meta);

		// Text
		translations.push(`skin.${options.id}.${skin.id}=${skin.name}`);

		// Image
		let texture = skin.texture || project.selected_texture || project.textures[0];
		archive.file(`${skin.id}.png`, texture.getBase64(), {base64: true});

		// Geo
		if (geometry_name) {
			project.select();
			if (!Modes.animate) {
				Modes.options.edit.select();
			}
			let model = Codecs.bedrock_old.compile({raw: true});
			let {bones} = model;
			
			delete model.visible_bounds_width;
			delete model.visible_bounds_height;
			delete model.visible_bounds_offset;
			delete model.bones;

			model.META_ModelVersion = '1.0.6';
			model.rigtype = skin.slim ? 'slim' : 'normal';
			model.animationArmsDown = project.skin_geo_flag_armsdown;
			model.animationArmsOutFront = project.skin_geo_flag_armsoutfront;
			model.animationStatueOfLibertyArms = project.skin_geo_flag_statueoflibertyarms;
			model.animationSingleArmAnimation = project.skin_geo_flag_singlearmanimation;
			model.animationStationaryLegs = project.skin_geo_flag_stationarylegs;
			model.animationSingleLegAnimation = project.skin_geo_flag_singleleganimation;
			model.animationNoHeadBob = project.skin_geo_flag_noheadbob;
			model.animationDontShowArmor = project.skin_geo_flag_dontshowarmor;
			model.animationUpsideDown = project.skin_geo_flag_upsidedown;
			model.animationInvertedCrouch = project.skin_geo_flag_invertedcrouch;
			model.bones = bones;

			bones.forEach(bone => {
				if (BoneTypes[bone.name]) {
					bone.META_BoneType = BoneTypes[bone.name];
				}
			})

			geometries[geometry_name] = model;
		}
	}

	let manifest = {
		format_version: 1,
		header: {
			name: "pack.name",
			version: [1, 0, 0],
			uuid: options.uuid || guid()
		},
		modules: [
			{
				version: [1, 0, 0],
				type: "skin_pack",
				uuid: guid()
			}
		]
	};
	let languages = ["en_US"];

	if (Object.keys(geometries).length) archive.file('geometry.json', compileJSON(geometries));
	archive.file('skins.json', compileJSON({skins}));
	archive.file('manifest.json', compileJSON(manifest));
	archive.file('texts/en_US.lang', translations.join('\n'));
	archive.file('texts/languages.json', compileJSON(languages));

	let blob = await archive.generateAsync({type: 'blob'});

	
	Blockbench.export({
		type: 'Zip Archive',
		extensions: ['zip'],
		name: options.name,
		content: blob,
		savetype: 'zip'
	})
}

if (!BarItems.export_minecraft_skin_pack) {
	let export_action = new Action('export_minecraft_skin_pack', {
		name: 'Export Skin Pack',
		icon: 'folder_shared',
		click() {
			selectSkinsForExport();
		}
	})
	MenuBar.addAction(export_action, 'file.export');
	Object(_util_uninstall_register__WEBPACK_IMPORTED_MODULE_0__["registerRemovable"])(export_action);
}


/***/ }),

/***/ "./src/skin_packager.js":
/*!******************************!*\
  !*** ./src/skin_packager.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _generate_pack__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./generate_pack */ "./src/generate_pack.js");
/* harmony import */ var _util_uninstall_register__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/uninstall_register */ "./src/util/uninstall_register.js");




BBPlugin.register('skin_packager', {
	title: 'Minecraft Skin Pack Packager',
	author: 'JannisX11',
	icon: 'icon-player',
	description: 'Create Skin Packs for the Minecraft Marketplace',
	tags: ['Minecraft: Bedrock Edition', 'Minecraft Marketplace'],
	about: 'Generates skin packs for the Minecraft Marketplace.\nAll textures in all open tabs count as skins. You can load individual skins into Blockbench via **File** > **Import Minecraft Skins**.\n'+
		`You can also create new skins via **New** > **Minecraft Skin**, in the File menu or on the start screen.\n`+
		`Export a skin pack via **File** > **Export** > **Export Skin Pack**.`,
	version: "0.1.2",
	min_version: '3.7.0',
	variant: 'both',
	await_loading: true,
	onload() {

		let import_action = new Action('import_minecraft_skins', {
			icon: 'folder',
			name: 'Import Minecraft Skins',
			description: 'Import a batch of Minecraft skins',
			click() {
				Blockbench.import({
					resource_id: 'texture',
					extensions: ['png'],
					type: 'Minecraft Skin',
					readtype: 'image',
					multiple: true,
				}, files => {
					files.forEach(file => {
						let parts = file.name.replace(/\.png$/i, '').split(/[-_.]/);
						let alex_hints = ['s', 'a', 'f', 'slim', 'alex', 'female'];
						let is_alex = alex_hints.includes(parts[0]) || alex_hints.includes(parts.last());
	
						newProject(Formats.skin);
						let preset = is_alex ? Formats.skin.presets.alex : Formats.skin.presets.steve;
						let model = JSON.parse(preset.model || (preset.model_bedrock));
						Codecs.skin_model.parse(model, 16, null, true, true);

						Project.name = parts
							.filter((part, i) => !alex_hints.includes(part) || (i && i !== parts.length-1) || part.toLowerCase() == 'female')
							.map(part => part.substring(0, 1).toUpperCase() + part.substring(1))
							.join(' ');
						Project.geometry_name = file.name.replace(/\.png$/i, '');
						
						Texture.all[0].remove(true);
						new Texture({name: file.name}).fromFile(file).add(false);

						Outliner.elements.forEach(element => {
							if (element.visibility === false) element.visibility = true;
						})
						Canvas.updateVisibility()
					})
				})
			}
		});
		MenuBar.menus.file.addAction(import_action, 5)
		Object(_util_uninstall_register__WEBPACK_IMPORTED_MODULE_1__["registerRemovable"])(import_action)

	},
	onunload() {
		Object(_util_uninstall_register__WEBPACK_IMPORTED_MODULE_1__["deleteRemovables"])();
	}
})


/***/ }),

/***/ "./src/util/uninstall_register.js":
/*!****************************************!*\
  !*** ./src/util/uninstall_register.js ***!
  \****************************************/
/*! exports provided: registerRemovable, deleteRemovables */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerRemovable", function() { return registerRemovable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteRemovables", function() { return deleteRemovables; });
const removables = [];

function registerRemovable(item) {
	removables.push(item);
}
function deleteRemovables() {
	removables.forEach(item => {
		if (typeof item.delete == 'function') item.delete();
	})
	removables.splice(0, Infinity);
}




/***/ })

/******/ });