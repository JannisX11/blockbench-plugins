(function () {
	function F(num) {
		var s = trimFloatNumber(num) + "";
		if (!s.includes(".")) {
			s += ".0";
		}
		return s + "F";
	}
	function I(num) {
		return Math.floor(num);
	}

	// For monkeypatching constructors from https://github.com/jamesallardice/patchwork.js
	const patch = (function () {
    /*jshint evil: true */

    "use strict";

    var global = new Function("return this;")(), // Get a reference to the global object
        fnProps = Object.getOwnPropertyNames(Function); // Get the own ("static") properties of the Function constructor

    return function (original, originalRef, patches) {

        var ref = global[originalRef] = original, // Maintain a reference to the original constructor as a new property on the global object
            args = [],
            newRef, // This will be the new patched constructor
            i;

        patches.called = patches.called || originalRef; // If we are not patching static calls just pass them through to the original function

        for (i = 0; i < original.length; i++) { // Match the arity of the original constructor
            args[i] = "a" + i; // Give the arguments a name (native constructors don't care, but user-defined ones will break otherwise)
        }

        if (patches.constructed) { // This string is evaluated to create the patched constructor body in the case that we are patching newed calls
            args.push("'use strict'; return (!!this ? " + patches.constructed + " : " + patches.called + ").apply(null, arguments);"); 
        } else { // This string is evaluated to create the patched constructor body in the case that we are only patching static calls
            args.push("'use strict'; return (!!this ? new (Function.prototype.bind.apply(" + originalRef + ", [{}].concat([].slice.call(arguments))))() : " + patches.called + ".apply(null, arguments));");
        }

        newRef = new (Function.prototype.bind.apply(Function, [{}].concat(args)))(); // Create a new function to wrap the patched constructor
        newRef.prototype = original.prototype; // Keep a reference to the original prototype to ensure instances of the patch appear as instances of the original
        newRef.prototype.constructor = newRef; // Ensure the constructor of patched instances is the patched constructor

        Object.getOwnPropertyNames(ref).forEach(function (property) { // Add any "static" properties of the original constructor to the patched one
            if (fnProps.indexOf(property) < 0) { // Don't include static properties of Function since the patched constructor will already have them
                newRef[property] = ref[property];
            }
        });

        return newRef; // Return the patched constructor
    };

}());

	// const MOD_SDK_1_15_FORGE = '1.15 - Forge';
	// const MOD_SDK_1_15_FABRIC = '1.15 - Fabric';
	// const MOD_SDKS = [MOD_SDK_1_15_FORGE, MOD_SDK_1_15_FABRIC];
	// const MOD_SDK_OPTIONS = Object.fromEntries(MOD_SDKS.map(x => [x, x]));

	const EASING_OPTIONS = {
		linear: "linear",
		easeInSine: "easeInSine",
		easeOutSine: "easeOutSine",
		easeInOutSine: "easeInOutSine",
		easeInQuad: "easeInQuad",
		easeOutQuad: "easeOutQuad",
		easeInOutQuad: "easeInOutQuad",
		easeInCubic: "easeInCubic",
		easeOutCubic: "easeOutCubic",
		easeInOutCubic: "easeInOutCubic",
		easeInQuart: "easeInQuart",
		easeOutQuart: "easeOutQuart",
		easeInOutQuart: "easeInOutQuart",
		easeInQuint: "easeInQuint",
		easeOutQuint: "easeOutQuint",
		easeInOutQuint: "easeInOutQuint",
		easeInExpo: "easeInExpo",
		easeOutExpo: "easeOutExpo",
		easeInOutExpo: "easeInOutExpo",
		easeInCirc: "easeInCirc",
		easeOutCirc: "easeOutCirc",
		easeInOutCirc: "easeInOutCirc",
		easeInBack: "easeInBack",
		easeOutBack: "easeOutBack",
		easeInOutBack: "easeInOutBack",
		easeInElastic: "easeInElastic",
		easeOutElastic: "easeOutElastic",
		easeInOutElastic: "easeInOutElastic",
		easeInBounce: "easeInBounce",
		easeOutBounce: "easeOutBounce",
		easeInOutBounce: "easeInOutBounce",
	};
	Object.freeze(EASING_OPTIONS);
	const EASING_DEFAULT = 'linear';

	const geckoSettingsDefault = {
		// modSDK: MOD_SDK_1_15_FORGE,
		entityType: 'Entity',
		javaPackage: 'com.example.mod',
		animFileNamespace: 'MODID',
		animFilePath: 'animations/ANIMATIONFILE.json',
	};
	Object.freeze(geckoSettingsDefault);

	let geckoSettings = Object.assign({}, geckoSettingsDefault);

	const getImports = () => {
		// switch(geckoSettings.modSDK) {
		// 	case MOD_SDK_1_15_FORGE:
		// 		return ``;
		// 	case MOD_SDK_1_15_FABRIC:
		// 		return ``;
		// 	default:
		// 		throw new Error(`Unrecognized mod SDK:`, geckoSettings.modSDK);
		// }
		return `import software.bernie.geckolib.animation.model.AnimatedEntityModel;
import software.bernie.geckolib.animation.model.AnimatedModelRenderer;
import software.bernie.geckolib.forgetofabric.ResourceLocation;`;
	};

	const compileCallback = (e) => {
		e.model.geckoSettings = geckoSettings;
		// console.log(`compileCallback model:`, e.model);
	};

	const parseCallback = (e) => {
		console.log(`parseCallback:`, e);
		if (e.model && typeof e.model.geckoSettings === 'object') {
			geckoSettings = e.model.geckoSettings;
		} else {
			geckoSettings = Object.assign({}, geckoSettingsDefault);
		}
	};

	const displayAnimationFrameCallback = (...args) => {
		// const keyframe = $('#keyframe');
		// console.log('displayAnimationFrameCallback:', args, 'keyframe:', keyframe); // keyframe is null here
	};

	function updateKeyframeEasing(obj) {
		console.log('updateKeyframeEasing:', obj); 
		// var axis = $(obj).attr('axis');
		var value = $(obj).val();
		Timeline.selected.forEach(function(kf) {
			// kf.set(axis, value);
			kf.easing = value;
		})
		// Animator.preview();
	}

	const updateKeyframeSelectionCallback = (...args) => {
			$('#keyframe_bar_easing').remove()

			var multi_channel = false;
			var channel = false;
			Timeline.selected.forEach((kf) => {
				if (channel === false) {
					channel = kf.channel
				} else if (channel !== kf.channel) {
					multi_channel = true
				}
			})

			if (Timeline.selected.length && !multi_channel && Format.id === "animated_entity_model") {
				var first = Timeline.selected[0]

				if (first.animator instanceof BoneAnimator) {
					// function _gt(axis) {
					// 	var n = first.get(axis);
					// 	if (typeof n == 'number') return trimFloatNumber(n);
					// 	return n;
					// }
					const keyframe = document.getElementById('keyframe');
					// console.log(`updateKeyframeSelection:`, args, ' keyframe:', keyframe);
					// const easingBar = $(`<div class="bar flex" id="keyframe_bar_easing">
					// 	<label class="tl" style="font-weight: bolder; min-width: 47px;">Easing</label>
					// </div>`);
					let easingBar = document.createElement('div');
					keyframe.appendChild(easingBar);
					easingBar.outerHTML = `<div class="bar flex" id="keyframe_bar_easing">
						<label class="tl" style="font-weight: bolder; min-width: 47px;">Easing</label>
					</div>`;
					easingBar = document.getElementById('keyframe_bar_easing');

					// var el = $(`<div class="bar_select half"><select class="focusable_input" id="${form_id}"></select></div>`)
					// const el = $(`<select class="focusable_input" id="keyframe_easing" style="flex: 1; margin-right: 9px;"></select>`)
					// const sel = el.find('select')
					let sel = document.createElement('select');
					easingBar.appendChild(sel);
					sel.outerHTML = `<select class="focusable_input" id="keyframe_easing" style="flex: 1; margin-right: 9px;" oninput="updateKeyframeEasing(this)"></select>`;
					sel = document.getElementById('keyframe_easing');
					for (var key in EASING_OPTIONS) {
						var name = EASING_OPTIONS[key];
						const option = document.createElement('option')
						sel.appendChild(option);
						// option.outerHTML = `<option id="${key}" ${first.easing || EASING_DEFAULT === key ? 'selected' : ''}>${name}</option>`;
						option.outerHTML = `<option id="${key}" ${(first.easing || EASING_DEFAULT) === key ? 'selected' : ''}>${name}</option>`;
					}
					// easingBar.append(el)
						// <input type="text" id="keyframe_easing" axis="easing" class="dark_bordered code keyframe_input tab_target" style="flex: 1; margin-right: 9px;" oninput="updateKeyframeEasing(this)"></input>
					console.log('easingBar:', easingBar, 'keyframe:', keyframe);
					// $('#keyframe_bar_easing input').val(first.easing || '');
			}
		}
	};

	const KeyframeGetArrayOriginal = Keyframe.prototype.getArray;
	function keyframeGetArray() {
			const easing = this.easing;
			let result = KeyframeGetArrayOriginal.apply(this, arguments);
			if (Format.id === "animated_entity_model") result = { vector: result, easing };
			console.log('keyframeGetArray arguments:', arguments, 'this:', this, 'result:', result);
			return result;
	}

	const KeyframeGetUndoCopyOriginal = Keyframe.prototype.getUndoCopy;
	function keyframeGetUndoCopy() {
			const easing = this.easing;
			const result = KeyframeGetUndoCopyOriginal.apply(this, arguments);
			if (Format.id === "animated_entity_model") Object.assign(result, { easing });
			console.log('keyframeGetUndoCopy arguments:', arguments, 'this:', this, 'result:', result);
			return result;
	}

	const KeyframeExtendOriginal = Keyframe.prototype.extend;
	function keyframeExtend(data) {
		if (Format.id === "animated_entity_model") {
			if (typeof data.values === 'object') {
				if (data.values.easing !== undefined) {
					Merge.string(this, data.values, 'easing');
					// Convert data to format expected by KeyframeExtendOriginal
					data.values = data.values.vector;
				}
			} else if (data.easing !== undefined) {
					Merge.string(this, data, 'easing');
			}
		}
		const result = KeyframeExtendOriginal.apply(this, arguments);
		console.log('keyframeExtend arguments:', arguments, 'this:', this, 'result:', result);
		return result;
	}

	function keyframeConstructor(data, uuid) {
			// const result = new (Function.prototype.bind.apply(KeyframeOriginal, arguments));//[{}].concat(arguments)));
			const result = new (Function.prototype.bind.apply(KeyframeOriginal, [{}, ...arguments]));
			// if (Format.id === "animated_entity_model") Object.assign(result, { easing: data.easing });
			// console.log('keyframeConstructor arguments:', arguments, 'this:', this, 'result:', result);
			return result;
	}

	Plugin.register("animation_utils", {
		name: "Gecko's Animation Utils",
		author: "Gecko",
		title: "Gecko's Animation Utils",
		description:
			"This plugin lets you create animated java entities with GeckoLib. Learn about Geckolib here: https://github.com/bernie-g/geckolib",
		icon: "movie_filter",
		version: "1.0.0",
		variant: "both",
		onload() {
			Codecs.project.on('compile', compileCallback);
			Codecs.project.on('parse', parseCallback);
			Blockbench.on('display_animation_frame', displayAnimationFrameCallback);
			Blockbench.on('update_keyframe_selection', updateKeyframeSelectionCallback);
			Keyframe.prototype.getArray = keyframeGetArray;
			Keyframe.prototype.getUndoCopy = keyframeGetUndoCopy;
			Keyframe.prototype.extend = keyframeExtend;
			Keyframe = patch(Keyframe, "KeyframeOriginal", {
				constructed: keyframeConstructor,
			});
			
			global.updateKeyframeEasing = updateKeyframeEasing;
			

			exportAction = new Action({
				id: "export_animated_entity_model",
				name: "Export Animated Java Entity",
				icon: "archive",
				description:
					"Export your java animated model as a model for GeckoLib.",
				category: "file",
				condition: () => Format.id === "animated_entity_model",
				click: function () {
					codec.export();
				},
			});
			MenuBar.addAction(exportAction, "file.export");

			button = new Action('gecko_settings', {
				name: 'Animated Entity Settings...',
				description: 'Customize animated entity export.',
				icon: 'info',
				condition: () => Format.id === "animated_entity_model",
				click: function () {
					var dialog = new Dialog({
						id: 'project',
						title: 'Animated Entity Settings',
						width: 540,
						form: {
							// modSDK: {label: 'Modding SDK', type: 'select', default: geckoSettings.modSDK, options: MOD_SDK_OPTIONS},
							entityType: {label: 'Entity Type', value: geckoSettings.entityType },
							javaPackage: {label: 'Java Package', value: geckoSettings.javaPackage},
							animFileNamespace: {label: 'Animation File Namespace', value: geckoSettings.animFileNamespace},
							animFilePath: {label: 'Animation File Path', value: geckoSettings.animFilePath},
						},
						onConfirm: function(formResult) {
							Object.assign(geckoSettings, formResult);
							dialog.hide()
						}
					})
					dialog.show()
				}
			});
			MenuBar.addAction(button, 'file.1');
		},
		onunload() {
			Codecs.project.events.compile.remove(compileCallback)
			Codecs.project.events.parse.remove(parseCallback)
			Blockbench.removeListener('display_animation_frame', displayAnimationFrameCallback);
			Blockbench.removeListener('update_keyframe_selection', updateKeyframeSelectionCallback);
			exportAction.delete();
			button.delete();
			delete global.updateKeyframeEasing;
	 		Keyframe = KeyframeOriginal;
			Keyframe.prototype.getArray = KeyframeGetArrayOriginal;
			Keyframe.prototype.getUndoCopy = KeyframeGetUndoCopyOriginal;
			Keyframe.prototype.extend = KeyframeExtendOriginal;
			console.clear();
		},
	});

	const Templates = {
		"1.15": {
			name: "1.15",
			flip_y: true,
			integer_size: false,
			file: `// Made with Blockbench %(bb_version)
// Exported for Minecraft version 1.12.2 or 1.15.2 (same format for both) for entity models animated with GeckoLib
// Paste this class into your mod and follow the documentation for GeckoLib to use animations. You can find the documentation here: https://github.com/bernie-g/geckolib
// Blockbench plugin created by Gecko
package %(javaPackage);

%(imports)

public class %(identifier) extends AnimatedEntityModel<%(entityType)> {

    %(fields)

    public %(identifier)()
    {
        textureWidth = %(texture_width);
		textureHeight = %(texture_height);
		%(content)

		%(renderers)
	}


    @Override
    public ResourceLocation getAnimationFileLocation()
    {
        return new ResourceLocation("%(animFileNamespace)", "%(animFilePath)");
    }
}`,
			field: `private final AnimatedModelRenderer %(bone);`,

			bone: `%(bone) = new AnimatedModelRenderer(this);
%(bone).setRotationPoint(%(x), %(y), %(z));
?(has_parent)%(parent).addChild(%(bone));
?(has_rotation)setRotationAngle(%(bone), %(rx), %(ry), %(rz));
%(cubes)
%(bone).setModelRendererName(\"%(bone)\");
this.registerModelRenderer(%(bone));`,
			renderer: `this.rootBones.add(%(bone));`,
			cube: `%(bone).setTextureOffset(%(uv_x), %(uv_y)).addBox(%(x), %(y), %(z), %(dx), %(dy), %(dz), %(inflate), %(mirror));`,
		},

		get(key, version = Project.modded_entity_version) {
			let temp = Templates[version][key];
			if (typeof temp === "string") temp = temp.replace(/\t\t\t/g, "");
			return temp;
		},
		keepLine(line) {
			return line.replace(/\?\(\w+\)/, "");
		},
		getVariableRegex(name) {
			return new RegExp(`%\\(${name}\\)`, "g");
		},
	};

	function getIdentifier() {
		return (
			Project.geometry_name.replace(/[\s-]+/g, "_") ||
			"animated_entity_model"
		);
	}

	var codec = new Codec("animated_entity_model", {
		name: "Animated Java Class",
		extension: "java",
		remember: true,
		compile(options) {
			let R = Templates.getVariableRegex;
			let identifier = getIdentifier();

			let all_groups = getAllGroups();
			let loose_cubes = [];
			Cube.all.forEach((cube) => {
				if (cube.parent == "root") loose_cubes.push(cube);
			});
			if (loose_cubes.length) {
				all_groups.push({
					name: "bb_main",
					rotation: [0, 0, 0],
					origin: [0, 0, 0],
					parent: "root",
					children: loose_cubes,
				});
			}

			let model = Templates.get("file");

			model = model.replace(R("bb_version"), Blockbench.version);

			model = model.replace(R("javaPackage"), geckoSettings.javaPackage);
			model = model.replace(R("imports"), getImports());

			model = model.replace(R("identifier"), identifier);
			model = model.replace(R("entityType"), geckoSettings.entityType);

			model = model.replace(R("texture_width"), Project.texture_width);
			model = model.replace(R("texture_height"), Project.texture_height);

			model = model.replace(R("animFileNamespace"), geckoSettings.animFileNamespace);
			model = model.replace(R("animFilePath"), geckoSettings.animFilePath);

			model = model.replace(R("fields"), () => {
				let group_snippets = [];
				for (var group of all_groups) {
					if (group instanceof Group === false || !group.export)
						continue;
					let snippet = Templates.get("field").replace(
						R("bone"),
						group.name
					);
					group_snippets.push(snippet);
				}
				return group_snippets.join("\n\t");
			});

			model = model.replace(R("content"), () => {
				let group_snippets = [];
				for (var group of all_groups) {
					if (group instanceof Group === false || !group.export)
						continue;
					let snippet = Templates.get("bone")

						.replace(R("bone"), group.name)

						.replace(
							/\n\?\(has_rotation\).+/,
							group.rotation.allEqual(0) ? "" : Templates.keepLine
						);

					snippet = snippet
						.replace(R("rx"), F(Math.degToRad(-group.rotation[0])))
						.replace(R("ry"), F(Math.degToRad(-group.rotation[1])))
						.replace(R("rz"), F(Math.degToRad(group.rotation[2])));

					var origin = group.origin.slice();
					if (group.parent instanceof Group) {
						origin.V3_subtract(group.parent.origin);
					}
					origin[0] *= -1;
					if (Templates.get("flip_y")) {
						origin[1] *= -1;
						if (group.parent instanceof Group === false) {
							origin[1] += 24;
						}
					}

					snippet = snippet
						.replace(R("x"), F(origin[0]))
						.replace(R("y"), F(origin[1]))
						.replace(R("z"), F(origin[2]))

						.replace(
							/\n\?\(has_parent\).+/,
							group.parent instanceof Group
								? Templates.keepLine
								: ""
						)
						.replace(R("parent"), group.parent.name)

						.replace(R("cubes"), () => {
							let cube_snippets = [];
							for (var cube of group.children) {
								if (
									cube instanceof Cube === false ||
									!cube.export
								)
									continue;

								let c_snippet = Templates.get("cube")
									.replace(R("bone"), group.name)

									.replace(R("uv_x"), I(cube.uv_offset[0]))
									.replace(R("uv_y"), I(cube.uv_offset[1]))

									.replace(R("inflate"), F(cube.inflate))
									.replace(R("mirror"), cube.mirror_uv);

								if (Templates.get("flip_y")) {
									c_snippet = c_snippet
										.replace(
											R("x"),
											F(group.origin[0] - cube.to[0])
										)
										.replace(
											R("y"),
											F(
												-cube.from[1] -
													cube.size(1) +
													group.origin[1]
											)
										)
										.replace(
											R("z"),
											F(cube.from[2] - group.origin[2])
										);
								} else {
									c_snippet = c_snippet
										.replace(
											R("x"),
											F(group.origin[0] - cube.to[0])
										)
										.replace(
											R("y"),
											F(cube.from[1] - group.origin[1])
										)
										.replace(
											R("z"),
											F(cube.from[2] - group.origin[2])
										);
								}
								if (Templates.get("integer_size")) {
									c_snippet = c_snippet
										.replace(R("dx"), I(cube.size(0, true)))
										.replace(R("dy"), I(cube.size(1, true)))
										.replace(
											R("dz"),
											I(cube.size(2, true))
										);
								} else {
									c_snippet = c_snippet
										.replace(R("dx"), F(cube.size(0, true)))
										.replace(R("dy"), F(cube.size(1, true)))
										.replace(
											R("dz"),
											F(cube.size(2, true))
										);
								}

								cube_snippets.push(c_snippet);
							}
							return cube_snippets.join("\n");
						})
						.replace(/\n/g, "\n\t\t");

					group_snippets.push(snippet);
				}
				return group_snippets.join("\n\n\t\t");
			});

			model = model.replace(R("renderers"), () => {
				let group_snippets = [];
				for (var group of all_groups) {
					if (group instanceof Group === false || !group.export)
						continue;
					if (
						!Templates.get("render_subgroups") &&
						group.parent instanceof Group
					)
						continue;

					let snippet = Templates.get("renderer").replace(
						R("bone"),
						group.name
					);
					group_snippets.push(snippet);
				}
				return group_snippets.join("\n\t\t");
			});

			this.dispatchEvent("compile", { model, options });
			return model;
		},
		parse(model, path, add) {
			this.dispatchEvent("parse", { model });

			var lines = [];
			model.split("\n").forEach((l) => {
				l = l
					.replace(/\/\*[^(\*\/)]*\*\/|\/\/.*/g, "")
					.trim()
					.replace(/;$/, "");
				if (l) {
					lines.push(l);
				}
			});

			function parseScheme(scheme, input) {
				scheme = scheme
					.replace(/\(/g, "\\(")
					.replace(/\)/g, "\\)")
					.replace(/\./g, "\\.");
				var parts = scheme.split("$");
				var regexstring = "";
				var results = [];
				var location = 0;
				var i = 0;
				for (var part of parts) {
					if (i == 0) {
						var partmatch = new RegExp("^" + part).exec(input);
						if (partmatch == null) return;

						location = partmatch[0].length;
					} else {
						var key = part.substr(0, 1);
						part = part.substr(1);
						var key_regex = "";
						switch (key) {
							case "v":
								key_regex = "^[a-zA-Z_][a-zA-Z0-9_]+";
								break;
							case "i":
								key_regex = "^-?\\d+";
								break;
							case "f":
								key_regex = "^-?\\d+\\.?\\d*F";
								break;
							case "d":
								key_regex = "^-?\\d+\\.?\\d*";
								break;
							case "b":
								key_regex = "^true|false";
								break;
						}
						var partmatch = new RegExp(key_regex + part).exec(
							input.substr(location)
						);
						if (partmatch == null) return;

						var variable = new RegExp(key_regex).exec(
							input.substr(location)
						)[0];
						switch (key) {
							case "v":
								results.push(variable);
								break;
							case "i":
								results.push(parseInt(variable));
								break;
							case "f":
								results.push(
									parseFloat(variable.replace(/F$/, ""))
								);
								break;
							case "d":
								results.push(
									parseFloat(variable.replace(/F$/, ""))
								);
								break;
							case "b":
								results.push(variable == "true");
								break;
						}
						location += partmatch[0].length;
					}

					i++;
				}
				match = results;
				return true;
			}
			var scope = 0,
				bones = {},
				geo_name,
				match,
				last_uv;

			lines.forEach((line) => {
				if (scope == 0) {
					if (/^public class/.test(line)) {
						scope = 1;
						geo_name = line.split(/[\s<>()\.]+/g)[2];
					}
				} else if (scope == 1) {
					line = line
						.replace(/public |static |final |private |void /g, "")
						.trim();
					if (
						line.substr(0, 13) == "AnimatedModelRenderer" ||
						line.substr(0, 13) == "RendererModel"
					) {
						let name = line.split(" ")[1];
						bones[name] = new Group({
							name,
							origin: [0, 24, 0],
						}).init();
					} else if (line.substr(0, geo_name.length) == geo_name) {
						scope = 2;
					}
				} else if (scope == 2) {
					line = line.replace(/^this\./, "");
					match = undefined;

					if (line == "}") {
						scope--;
					} else if (parseScheme("textureWidth = $i", line)) {
						Project.texture_width = match[0];
					} else if (parseScheme("textureHeight = $i", line)) {
						Project.texture_height = match[0];
					} else if (parseScheme("super($v, $i, $i)", line)) {
						Project.texture_width = match[1];
						Project.texture_height = match[2];
					} else if (
						parseScheme(
							"AnimatedModelRenderer $v = new AnimatedModelRenderer(this, $i, $i)",
							line
						) ||
						parseScheme(
							"RendererModel $v = new RendererModel(this, $i, $i)",
							line
						) ||
						parseScheme(
							"$v = new AnimatedModelRenderer(this, $i, $i)",
							line
						) ||
						parseScheme(
							"$v = new RendererModel(this, $i, $i)",
							line
						)
					) {
						if (!bones[match[0]]) {
							bones[match[0]] = new Group({
								name: match[0],
								origin: [0, 24, 0],
							}).init();
						}
						last_uv = [match[1], match[2]];
					} else if (
						parseScheme(
							"$v = new AnimatedModelRenderer(this)",
							line
						)
					) {
						// Blockbench for 1.15
						if (!bones[match[0]]) {
							bones[match[0]] = new Group({
								name: match[0],
								origin: [0, 0, 0],
							}).init();
						}
					} else if (
						parseScheme("$v.setRotationPoint($f, $f, $f)", line)
					) {
						var bone = bones[match[0]];
						if (bone) {
							bone.extend({
								origin: [-match[1], 24 - match[2], match[3]],
							});
							bone.children.forEach((cube) => {
								if (cube instanceof Cube) {
									cube.from[0] += bone.origin[0];
									cube.to[0] += bone.origin[0];
									cube.from[1] += bone.origin[1] - 24;
									cube.to[1] += bone.origin[1] - 24;
									cube.from[2] += bone.origin[2];
									cube.to[2] += bone.origin[2];
								}
							});
						}
					} else if (
						parseScheme(
							"$v.addChild($v)",
							line.replace(/\(this\./g, "(")
						)
					) {
						var child = bones[match[1]],
							parent = bones[match[0]];
						child.addTo(parent);
						child.origin.V3_add(parent.origin);
						child.origin[1] -= 24;

						child.children.forEach((cube) => {
							if (cube instanceof Cube) {
								cube.from[0] += parent.origin[0];
								cube.to[0] += parent.origin[0];
								cube.from[1] += parent.origin[1] - 24;
								cube.to[1] += parent.origin[1] - 24;
								cube.from[2] += parent.origin[2];
								cube.to[2] += parent.origin[2];
							}
						});
					}

					//Cubes
					else if (
						parseScheme(
							"$v.cubeList.add(new ModelBox($v, $i, $i, $f, $f, $f, $i, $i, $i, $f, $b))",
							line
						)
					) {
						var group = bones[match[0]];
						var cube = new Cube({
							name: match[0],
							uv_offset: [match[2], match[3]],
							from: [
								group.origin[0] - match[4] - match[7],
								group.origin[1] - match[5] - match[8],
								group.origin[2] + match[6],
							],
							inflate: match[10],
							mirror_uv: match[11],
						});
						cube.extend({
							to: [
								cube.from[0] + Math.floor(match[7]),
								cube.from[1] + Math.floor(match[8]),
								cube.from[2] + Math.floor(match[9]),
							],
						});
						cube.addTo(bones[match[0]]).init();
					} else if (
						parseScheme(
							"$v.addBox($f, $f, $f, $i, $i, $i)",
							line
						) ||
						parseScheme(
							"$v.addBox($f, $f, $f, $i, $i, $i, $v)",
							line
						) ||
						parseScheme(
							"$v.addBox($f, $f, $f, $i, $i, $i, $f)",
							line
						)
					) {
						var group = bones[match[0]];
						var cube = new Cube({
							name: match[0],
							uv_offset: last_uv,
							from: [
								group.origin[0] - match[1] - match[4],
								group.origin[1] - match[2] - match[5],
								group.origin[2] + match[3],
							],
							inflate: typeof match[7] == "number" ? match[7] : 0,
							mirror_uv: group.mirror_uv,
						});
						cube.extend({
							to: [
								cube.from[0] + Math.floor(match[4]),
								cube.from[1] + Math.floor(match[5]),
								cube.from[2] + Math.floor(match[6]),
							],
						});
						cube.addTo(bones[match[0]]).init();
					} else if (
						parseScheme(
							"$v.setTextureOffset($i, $i).addBox($f, $f, $f, $f, $f, $f, $f, $b)",
							line
						)
					) {
						var group = bones[match[0]];
						var cube = new Cube({
							name: match[0],
							uv_offset: [match[1], match[2]],
							from: [
								group.origin[0] - match[3] - match[6],
								group.origin[1] - match[4] - match[7],
								group.origin[2] + match[5],
							],
							inflate: match[9],
							mirror_uv: match[10],
						});
						cube.extend({
							to: [
								cube.from[0] + Math.floor(match[6]),
								cube.from[1] + Math.floor(match[7]),
								cube.from[2] + Math.floor(match[8]),
							],
						});
						cube.addTo(bones[match[0]]).init();
					}

					//Rotation
					else if (
						parseScheme("setRotationAngle($v, $f, $f, $f)", line)
					) {
						//blockbench
						var group = bones[match[0]];
						if (group) {
							group.extend({
								rotation: [
									-Math.radToDeg(match[1]),
									-Math.radToDeg(match[2]),
									Math.radToDeg(match[3]),
								],
							});
						}
					} else if (
						parseScheme("setRotation($v, $f, $f, $f)", line)
					) {
						//cubik
						var group = bones[match[0]];
						if (group) {
							group.extend({
								rotation: [
									-Math.radToDeg(match[1]),
									-Math.radToDeg(match[2]),
									Math.radToDeg(match[3]),
								],
							});
						}
					} else if (
						parseScheme("setRotateAngle($v, $f, $f, $f)", line)
					) {
						//tabula
						var group = bones[match[0]];
						if (group) {
							group.extend({
								rotation: [
									-Math.radToDeg(match[1]),
									-Math.radToDeg(match[2]),
									Math.radToDeg(match[3]),
								],
							});
						}
					} else if (parseScheme("$v.rotateAngleX = $f", line)) {
						//default
						var group = bones[match[0]];
						if (group) {
							group.rotation[0] = -Math.radToDeg(match[1]);
						}
					} else if (parseScheme("$v.rotateAngleY = $f", line)) {
						//default
						var group = bones[match[0]];
						if (group) {
							group.rotation[1] = -Math.radToDeg(match[1]);
						}
					} else if (parseScheme("$v.rotateAngleZ = $f", line)) {
						//default
						var group = bones[match[0]];
						if (group) {
							group.rotation[2] = Math.radToDeg(match[1]);
						}
					} else if (parseScheme("$v.mirror = $b", line)) {
						var group = bones[match[0]];
						group.mirror_uv = match[1];
						group.children.forEach((cube) => {
							cube.mirror_uv = match[1];
						});
					}
				}
			});
			Canvas.updateAll();
		},
		fileName() {
			return getIdentifier();
		},
	});
	codec.templates = Templates;

	var format = new ModelFormat({
		id: "animated_entity_model",
		name: "Animated Java Entity",
		icon: "icon-format_java",
		codec,
		box_uv: true,
		single_texture: true,
		bone_rig: true,
		centered_grid: true,
		integer_size: true,
		animation_mode: true,
	});
	//Object.defineProperty(format, 'integer_size', {get: _ => Templates.get('integer_size')})
	codec.format = format;
})();
