(function () {
	//#region Helper Functions
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

	function lerp(start, stop, amt) {
		return amt * (stop - start) + start;
	};

	function uniq(arr) {
		return arr.reduce((acc, val) => {
			if (!acc.includes(val)) {
				return [...acc, val];
			}
			return acc;
		}, []);
	}
	//#endregion Helper Functions

	//#region Easing Functions
	const easingsFunctions = (function() {
		const pow = Math.pow;
		const sqrt = Math.sqrt;
		const sin = Math.sin;
		const cos = Math.cos;
		const PI = Math.PI;
		const getC1 = scalar => 1.70158 * scalar;
		const getC2 = c1 => c1 * 1.525;
		const getC3 = c1 => c1 + 1;
		const c4 = (2 * PI) / 3;
		const c5 = (2 * PI) / 4.5;
		function bounceOut(x) {
				const n1 = 7.5625;
				const d1 = 2.75;
				if (x < 1 / d1) {
						return n1 * x * x;
				}
				else if (x < 2 / d1) {
						return n1 * (x -= 1.5 / d1) * x + 0.75;
				}
				else if (x < 2.5 / d1) {
						return n1 * (x -= 2.25 / d1) * x + 0.9375;
				}
				else {
						return n1 * (x -= 2.625 / d1) * x + 0.984375;
				}
		}
		const easingsFunctions = {
				linear(x) {
					return x;
				},
				easeInQuad(x) {
						return x * x;
				},
				easeOutQuad(x) {
						return 1 - (1 - x) * (1 - x);
				},
				easeInOutQuad(x) {
						return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
				},
				easeInCubic(x) {
						return x * x * x;
				},
				easeOutCubic(x) {
						return 1 - pow(1 - x, 3);
				},
				easeInOutCubic(x) {
						return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
				},
				easeInQuart(x) {
						return x * x * x * x;
				},
				easeOutQuart(x) {
						return 1 - pow(1 - x, 4);
				},
				easeInOutQuart(x) {
						return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;
				},
				easeInQuint(x) {
						return x * x * x * x * x;
				},
				easeOutQuint(x) {
						return 1 - pow(1 - x, 5);
				},
				easeInOutQuint(x) {
						return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
				},
				easeInSine(x) {
						return 1 - cos((x * PI) / 2);
				},
				easeOutSine(x) {
						return sin((x * PI) / 2);
				},
				easeInOutSine(x) {
						return -(cos(PI * x) - 1) / 2;
				},
				easeInExpo(x) {
						return x === 0 ? 0 : pow(2, 10 * x - 10);
				},
				easeOutExpo(x) {
						return x === 1 ? 1 : 1 - pow(2, -10 * x);
				},
				easeInOutExpo(x) {
						return x === 0
								? 0
								: x === 1
										? 1
										: x < 0.5
												? pow(2, 20 * x - 10) / 2
												: (2 - pow(2, -20 * x + 10)) / 2;
				},
				easeInCirc(x) {
						return 1 - sqrt(1 - pow(x, 2));
				},
				easeOutCirc(x) {
						return sqrt(1 - pow(x - 1, 2));
				},
				easeInOutCirc(x) {
						return x < 0.5
								? (1 - sqrt(1 - pow(2 * x, 2))) / 2
								: (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2;
				},
				easeInBack(scalar, x) {
					const c1 = getC1(scalar);
					const c3 = getC3(c1);
					return c3 * x * x * x - c1 * x * x;
				},
				easeOutBack(scalar, x) {
					const c1 = getC1(scalar);
					const c3 = getC3(c1);
					return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
				},
				easeInOutBack(scalar, x) {
						const c1 = getC1(scalar);
						const c2 = getC2(c1);
						return x < 0.5
								? (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
								: (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
				},
				easeInElastic(x) {
						return x === 0
								? 0
								: x === 1
										? 1
										: -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
				},
				easeOutElastic(x) {
						return x === 0
								? 0
								: x === 1
										? 1
										: pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
				},
				easeInOutElastic(x) {
						return x === 0
								? 0
								: x === 1
										? 1
										: x < 0.5
												? -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2
												: (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1;
				},
				easeInBounce(x) {
						return 1 - bounceOut(1 - x);
				},
				easeOutBounce: bounceOut,
				easeInOutBounce(x) {
						return x < 0.5
								? (1 - bounceOut(1 - 2 * x)) / 2
								: (1 + bounceOut(2 * x - 1)) / 2;
				},
		};
		return easingsFunctions;
	})();

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

	//#endregion Easing Functions

	//#region Codec Helpers / Export Settings
	const GECKO_SETTINGS_DEFAULT = {
		// modSDK: MOD_SDK_1_15_FORGE,
		entityType: 'Entity',
		javaPackage: 'com.example.mod',
		animFileNamespace: 'MODID',
		animFilePath: 'animations/ANIMATIONFILE.json',
	};
	Object.freeze(GECKO_SETTINGS_DEFAULT);

	let geckoSettings = Object.assign({}, GECKO_SETTINGS_DEFAULT);

	// const MOD_SDK_1_15_FORGE = '1.15 - Forge';
	// const MOD_SDK_1_15_FABRIC = '1.15 - Fabric';
	// const MOD_SDKS = [MOD_SDK_1_15_FORGE, MOD_SDK_1_15_FABRIC];
	// const MOD_SDK_OPTIONS = Object.fromEntries(MOD_SDKS.map(x => [x, x]));

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
			geckoSettings = Object.assign({}, GECKO_SETTINGS_DEFAULT);
		}
	};

	//#endregion Codec Helpers / Export Settings

	//#region Global Animation UI Handlers
	const displayAnimationFrameCallback = (...args) => {
		// const keyframe = $('#keyframe');
		// console.log('displayAnimationFrameCallback:', args, 'keyframe:', keyframe); // keyframe is null here
	};

	const hasArgs = (easing = "") => easing.includes("Back");

	function updateKeyframeEasing(obj) {
		// var axis = $(obj).attr('axis');
		const value = $(obj).val();
		console.log('updateKeyframeEasing value:', value, 'obj:', obj); 
		if (value === "-") return;
		Timeline.selected.forEach((kf) => {
			kf.easing = value;
		})
		updateKeyframeSelection(); // Ensure easingScale display is updated
		// Animator.preview();
	}

	function updateKeyframeEasingScale(obj) {
		const value = parseInt($(obj).val().trim(), 10);
		console.log('updateKeyframeEasingScale value:', value, 'obj:', obj); 
		if (value === "-") return;
		Timeline.selected.forEach((kf) => {
			kf.easingArgs = [value];
		})
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

			const getMultiSelectValue = (property, defaultValue, conflictValue) => {
				if (Timeline.selected.length > 1) {
					const uniqSelected = uniq(Timeline.selected.map(kf => kf[property]));
					if (uniqSelected.length === 1) {
						return uniqSelected[0];
					} else {
						return conflictValue;
					}
				} else {
					return Timeline.selected[0][property] || defaultValue;
				}
			};

			if (Timeline.selected.length && Format.id === "animated_entity_model") {
				if (Timeline.selected.every(kf => kf.animator instanceof BoneAnimator)) {
					const displayedEasing = getMultiSelectValue('easing', EASING_DEFAULT, 'null');

					const keyframe = document.getElementById('keyframe');
					let easingBar = document.createElement('div');
					keyframe.appendChild(easingBar);
					easingBar.outerHTML = `<div class="bar flex" id="keyframe_bar_easing">
						<label class="tl" style="font-weight: bolder; min-width: 47px;">Easing</label>
					</div>`;
					easingBar = document.getElementById('keyframe_bar_easing');

					let sel = document.createElement('select');
					easingBar.appendChild(sel);
					sel.outerHTML = `<select class="focusable_input" id="keyframe_easing" style="flex: 1; margin-right: 9px;" oninput="updateKeyframeEasing(this)"></select>`;
					sel = document.getElementById('keyframe_easing');

					const easingOptions = displayedEasing !== "null"
						? EASING_OPTIONS
						: Object.assign({}, { null: "-" }, EASING_OPTIONS);
					for (var key in easingOptions) {
						var name = easingOptions[key];
						const option = document.createElement('option')
						sel.appendChild(option);
						option.outerHTML = `<option id="${key}" ${displayedEasing === key ? 'selected' : ''}>${name}</option>`;
					}

					if (Timeline.selected.every(kf => hasArgs(kf.easing))) {
						const [displayedValue] = getMultiSelectValue('easingArgs', [1], [1]);
						let scaleBar = document.createElement('div');
						keyframe.appendChild(scaleBar);
						scaleBar.outerHTML = `<div class="bar flex" id="keyframe_bar_easing_scale">
							<label class="tl" style="font-weight: bolder; min-width: 90px;">Easing Scale</label>
							<input type="text" id="keyframe_easing_scale" class="dark_bordered code keyframe_input tab_target" value="${displayedValue}" oninput="updateKeyframeEasingScale(this)" style="flex: 1; margin-right: 9px;">
						</div>`;
						scaleBar = document.getElementById('keyframe_bar_easing_scale');
					}

					console.log('easingBar:', easingBar, 'keyframe:', keyframe);
			}
		}
	};

	//#endregion Global Animation UI Handlers

	//#region Keyframe Mixins
	const Original = new Map();
	const addMonkeypatch = (symbol, path, functionKey, newFunction) => {
		const pathAccessor = path ? symbol[path] : symbol;
		if(!Original.get(symbol)) Original.set(symbol, { _pathAccessor: pathAccessor });
		Original.get(symbol)[functionKey] = pathAccessor[functionKey];
		pathAccessor[functionKey] = newFunction;
	};
	const removeMonkeypatches = () => {
		Original.forEach(symbol => {
			Object.keys(symbol).forEach(functionKey => {
				if(functionKey.startsWith('_')) return;
				symbol._pathAccessor[functionKey] = symbol[functionKey];
			});
		});
		Original.clear();
	}
	function keyframeGetLerp(other, axis, amount, allow_expression) {
			const easing = other.easing || EASING_DEFAULT;
			if (Format.id !== "animated_entity_model") {
				return Original.get(Keyframe).getLerp.apply(this, arguments);
			}
			let easingFunc = easingsFunctions[easing];
			if (hasArgs(easing)) {
				const easingScale = Array.isArray(other.easingArgs) && other.easingArgs.length > 0
					? other.easingArgs[0]
					: 1;
				console.log(`keyframeGetLerp easingScale: ${easingScale}`);
				easingFunc = easingFunc.bind(null, easingScale);
			}
			const easedAmount = easingFunc(amount); 
			const start = this.calc(axis);
			const stop = other.calc(axis);
			const result = lerp(start, stop, easedAmount);
			console.log('keyframeGetLerp arguments:', arguments, 'start:', start, 'stop:', stop, 'amount:', amount, 'easedAmount:', easedAmount, 'result:', result);
			return result;
	}

	function keyframeGetArray() {
			const { easing, easingArgs } = this;
			let result = Original.get(Keyframe).getArray.apply(this, arguments);
			if (Format.id === "animated_entity_model") {
				result = { vector: result, easing };
				if (hasArgs(easing)) result.easingArgs = easingArgs;
			}
			console.log('keyframeGetArray arguments:', arguments, 'this:', this, 'result:', result);
			return result;
	}

	function keyframeGetUndoCopy() {
			const { easing, easingArgs } = this;
			const result = Original.get(Keyframe).getUndoCopy.apply(this, arguments);
			if (Format.id === "animated_entity_model") {
				Object.assign(result, { easing });
				if (hasArgs(easing)) result.easingArgs = easingArgs;
			}
			console.log('keyframeGetUndoCopy arguments:', arguments, 'this:', this, 'result:', result);
			return result;
	}

	function keyframeExtend(data) {
		if (Format.id === "animated_entity_model") {
			if (typeof data.values === 'object') {
				if (data.values.easing !== undefined) {
					Merge.string(this, data.values, 'easing');
				}
				if (Array.isArray(data.values.easingArgs)) {
					this.easingArgs = data.values.easingArgs;
				}
				// Convert data to format expected by KeyframeExtendOriginal
				data.values = data.values.vector;
			} else {
				if (data.easing !== undefined) {
						Merge.string(this, data, 'easing');
				}
				if (Array.isArray(data.easingArgs)) {
					this.easingArgs = data.easingArgs;
				}
			}
		}
		const result = Original.get(Keyframe).extend.apply(this, arguments);
		console.log('keyframeExtend arguments:', arguments, 'this:', this, 'result:', result);
		return result;
	}

	//#endregion Keyframe Mixins

	//#region Plugin Definition
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

			addMonkeypatch(Keyframe, "prototype", "getLerp", keyframeGetLerp);
			addMonkeypatch(Keyframe, "prototype", "getArray", keyframeGetArray);
			addMonkeypatch(Keyframe, "prototype", "getUndoCopy", keyframeGetUndoCopy);
			addMonkeypatch(Keyframe, "prototype", "extend", keyframeExtend);
			
			addMonkeypatch(global, null, "updateKeyframeEasing", updateKeyframeEasing);
			addMonkeypatch(global, null, "updateKeyframeEasingScale", updateKeyframeEasingScale);

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
			removeMonkeypatches();
			console.clear();
		},
	});
	//#endregion Plugin Definition

	//#region Codec / ModelFormat
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

	//#endregion Codec / ModelFormat
})();
