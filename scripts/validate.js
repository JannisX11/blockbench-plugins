import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import { compareVersions } from "compare-versions";
import PLUGINS_JSON_META from '../plugins.json' with {type: "json"};
import imageSize from "image-size";

const Errors = [];
function logError(error) {
	console.error(error);
	Errors.push(error);
	process.exitCode = 1;
}

let PLUGIN_ID = process.argv[2];
let CHANGED_FILES = process.env.CHANGED_FILES;
console.log('changes', typeof CHANGED_FILES, CHANGED_FILES);
if (CHANGED_FILES) {
	console.log('changes', typeof CHANGED_FILES, CHANGED_FILES);
	//let changes = CHANGED_FILES.split('\n');
}

if (!PLUGIN_ID) {
	logError("Plugin ID is not specified");
	process.exit();
}
if (!PLUGIN_ID.match(/^[a-z][a-z0-9_]+$/)) {
	logError(`Plugin ID "${PLUGIN_ID}" is not valid snake case`);
}

let json_meta = PLUGINS_JSON_META[PLUGIN_ID];
let id = '';
let source_meta = {};

if (!json_meta) {
	logError(`Plugin with ID "${PLUGIN_ID} not found in plugins.json"`);
	process.exit();
}

const NEW_FORMAT = (json_meta.min_version && compareVersions(json_meta.min_version, '4.8.0') != -1)
	|| json_meta.new_repository_format;
const BASE_PATH = path.join(import.meta.dirname, '..', NEW_FORMAT ? 'plugins/'+PLUGIN_ID : 'plugins');

let content_js = '';
try {
	content_js = fs.readFileSync(path.resolve(BASE_PATH, PLUGIN_ID + '.js'));
} catch (err) {
	logError("Could not find plugin source file at " + path.resolve(BASE_PATH, PLUGIN_ID + '.js'));
	process.exit();
}


/**
TODO:
icon file
icon size and resolution
semver
 */









const Plugin = {
	register(_id, _options) {
		id = _id;
		source_meta = _options;
	}
}
// Wildcard must be a function so it can be called
const wildcard = new Proxy(function () {}, {
	get(target, prop) {
		if (prop === Symbol.toPrimitive) {
			return () => '';
		}
		if (prop === 'toString') {
			return () => '';
		}
		if (prop === 'valueOf') {
			return () => '';
		}
		return wildcard;
	},
	apply(target, thisArg, args) {
		return wildcard; // calling it returns wildcard
	},
	construct(target, args) {
		return wildcard; // new wildcard() returns wildcard
	}
});
// Sandbox that pretends every global exists
const sandbox = new Proxy({
	Plugin,
	BBPlugin: Plugin,
}, {
	has() {
		return true; // "yes, this global exists"
	},
	get(target, prop) {
		if (prop in target) return target[prop];
		return wildcard;
	}
});

vm.createContext(sandbox);
vm.runInContext(content_js, sandbox);


if (!source_meta) {
	logError("Could not find metadata in source file");
	process.exit();
}

if (id != PLUGIN_ID) {
	logError(`Plugin ID "${PLUGIN_ID}" does not match value "${id}"`);
}

// Required fields check
const REQUIRED_FIELDS = ["title", "author", "icon", "description", "version"];
if (REQUIRED_FIELDS.some(key => !json_meta[key])) {
	let fields = REQUIRED_FIELDS.filter(key => !json_meta[key]).map(name => `"${name}"`);
	logError(`Required fields ${fields.join()} missing in plugins.json entry`);
}

// Metadata match
const KNOWN_FIELDS = [
	"title",
	"icon",
	"author",
	"description",
	"about",
	"tags",
	"items",
	"version",
	"variant",
	"min_version",
	"deprecation_note",
	"website",
	"repository",
	"bug_tracker",
	"await_loading",
	"creation_date",
];
let all_fields = new Set([...KNOWN_FIELDS, ...Object.keys(json_meta)]);
for (let key of all_fields) {
	const a = JSON.stringify(json_meta[key]);
	const b = JSON.stringify(source_meta[key]);
	if (a != b) {
		logError(`Metadata mismatch: "${key}" is set to ${a} in plugins.json and ${b} in JS file`);
	}
}

if (NEW_FORMAT && json_meta.about) {
	logError(`About text specified in meta data. In format version 4.8 or newer, about text should be in about.md`);
}

if (json_meta.has_changelog && !NEW_FORMAT) {
	logError("Changelog is not supported in legacy format");
}
if (json_meta.has_changelog) {let content_js = '';
	let changelog_path = path.resolve(BASE_PATH, 'changelog.json');
	try {
		let changelog_content = fs.readFileSync(changelog_path);
		JSON.parse(changelog_content)
	} catch (err) {
		logError("Could not load changelog: " + err);
		process.exit();
	}
}

if (json_meta.icon && (json_meta.icon.endsWith('.png') || json_meta.icon.endsWith('.svg'))) {
	let icon_path = path.resolve(BASE_PATH, json_meta.icon);
	if (!fs.existsSync(icon_path)) {
		logError(`Could not find icon at "${icon_path}"`);
	} else {
		let buffer = fs.readFileSync(icon_path);
		if (buffer.length > 12_000) {
			logError(`Icon is too large at ${buffer.length/1000} KB, maximum is 12 KB`);
		}
		if (json_meta.icon.endsWith('.png')) {
			let dimensions = imageSize(buffer);
			if (dimensions.width > 96 || dimensions.height > 96) {
				logError(`Icon size is larger than the limit of 96x96`);
			}
			if (dimensions.width != dimensions.height) {
				logError(`Icon is not square`);
			}
		}
	}
}



if (!process.exitCode) {
	console.log(`Plugin "${PLUGIN_ID}" passed validation with no errors!`);
}
