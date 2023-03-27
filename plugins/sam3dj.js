/** sam3DJ | aka. Sammy's .3DJ (format implementation)
 *  ==================================================
 *  Author:     Sammy L. Koch (1Turtle)
 *  Licence:    Apache-2.0 (see https://www.apache.org/licenses/LICENSE-2.0.txt)
*/
(function () {
	const pluginProperties = {
		title: 'sam3DJ',
		author: '1Turtle',
		tags: ['Minecraft: Java Edition', 'Format', 'Exporter'],
		version: '1.0.2',
		variant: 'both',
		description: 'Generate 3D prints in MC (Java Edition) via the .3DJ format within the SC-Peripherals mod!',
		about: "This plugin allows you to **export a model into the .3DJ format**.  \nThe .3DJ format is _mostly_ used with the `3D Printer` from the **SC-Peripherals** Java Edition mod.  \n  \n**Tip:** Cubes in a `state_on` folder will be _only_ displayed whenever the model is toggled on!    \n> **Note:** _The format does not support the following attributes:_  \n> * Rotated cubes  \n> * One cube with multiple textures  \n> * Cubes outside the given block space *(16x16x16 Grid / 1x1x1 Block)*  \n  \nTry to avoid those things, or else you might run into weird results.  \nMeshes are also not supported due to the limitations of the format and Minecraft.\n> For the full format documentations, see the [SwitchCraft3 Wiki](https://docs.sc3.io/whats-new/sc-peripherals.html#_3dj-format)  \n",
		icon: 'print',
		onload() {
			MenuBar.addAction(btnExport, 'file.export');
		},
		onunload() {
			MenuBar.removeAction('file.export.export_3dj');
		}
	};
	const SC_TEXTURE_BLANK = 'sc-peripherals:block/white';

	/**
	 * Returns a fitting texture for a given cube.
	 * @param {*} cube The cube, which holds the wanted texture.
	 * @returns The wanted texture, fitting to the cube. (+ some booleans) in a object.
	 */
	function getSingleTexture(cube, scan) {
		let faces = 0;
		let missing = false;
		let texture = SC_TEXTURE_BLANK;

		for (let dir in cube.faces) { //in ['north', 'east', 'south', 'west', 'up', 'down']
			let tmp = cube.faces[dir].getTexture();
			if (tmp === undefined) {
				missing = true;
				continue;
			}
			let logOutput = ""
			// texture: <namespace>:<path>
			let namespace = ""
			let id = ""
			if (tmp.name.includes(":")) {
				id = tmp.name
			} else if (tmp.name.includes("/")) {
				id = "minecraft:" + tmp.name
			}
			if (id === "") {
				if (cube.name.includes(":")) {
					id = cube.name.replace(/\.[^/.]+$/, "")
					logOutput = "Exporting " + cube.name + " as " + id
				} else {
					if (typeof cube.parent === 'object') {
						let parents = []
						let parent = cube.parent
						while (typeof parent === 'object') {
							parents.push(parent.name)
							parent = parent.parent
						}
						parents.reverse()
						namespace = parents[0]
						parents.shift()

						logOutput = "Exporting " + cube.name + " in " + namespace + "/" + parents.join("/") + " as " + namespace + ":" + parents.join("/") + "/" + cube.name
						id = namespace + ":" + parents.join("/") + "/" + cube.name
					} else {
						if (cube.name.includes(":")) {
							logOutput = "Exporting " + cube.name + " as " + cube.name
							id = cube.name
						} else if (cube.name.includes("/")) {
							logOutput = "Exporting " + cube.name + " as minecraft:" + cube.name
							id = "minecraft:" + cube.name
						} else {
							logOutput = "Exporting " + cube.name + " as minecraft:block/" + cube.name
							id = "minecraft:block/" + cube.name
						}
					}
				}
			} else {
				logOutput = "Exporting " + cube.name + " as " + id
			}

			if (scan && logOutput !== "") {
				console.log(logOutput)
			}

			if (texture !== id) {
				faces++;
				texture = id;
			}
		}


		return {
			texture: texture,
			missingTexture: missing,
			multipleTexture: (faces > 1),
		};
	}


	/**
	 * Converts a given element to a shape in .3DJ format.
	 * @param {*} obj The given element (e.g. Cube).
	 * @returns The fianl shape (+ some booleans) in a object.
	 */
	function genShape(cube, raw = false) {
		let result = getSingleTexture(cube);
		let shape = {
			bounds: [
				cube.from[0] + 8,
				cube.from[1],
				cube.from[2] + 8,
				cube.to[0] + 8,
				cube.to[1],
				cube.to[2] + 8,
			],
			texture: result.texture,
		};

		if (!raw)
			shape.tint = 'FFFFFF';

		return {
			shape: shape,
			missingTexture: result.missingTexture,
			multipleTexture: result.multipleTexture,
		};
	}

	function isStateON(group) {
		if (group.name === 'state_on') {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Generates the object that contains the shapes in .3DJ format (off state only).
	 * @param {*} objects Contains all elements.
	 * @returns The final shapes (+ some booleans) in a object.
	 */
	function genModel(elements, raw = false) {
		let shapeOFF = [];
		let shapeON = [];

		for (const cube of elements)
			if (cube instanceof Cube && cube.visibility) {
				let stateON = false;
				if (typeof cube.parent === 'object')
					stateON = isStateON(cube.parent)

				let result = genShape(cube, raw);
				if (stateON)
					shapeON.push(result.shape);
				else
					shapeOFF.push(result.shape);

				if (result.missingTexture || result.multipleTexture)
					Blockbench.showQuickMessage('Some cubes got a blank texture', 4000);
			}

		return { on: shapeON, off: shapeOFF };
	}

	/**
	 * Returns the given value or undefined, whenever the string is usable or not.
	 * @param {*} value
	 * @returns The value or undefined.
	 */
	function aditionalValue(value) {
		return (typeof value === 'string' && value.trim() !== '') ? value : undefined;
	}

	/**
	 * Compiles a whole project to the .3DJ format (Used for exporting).
	 * @param {*} options
	 * @returns The final object in the .3DJ format.
	 */
	function compile3DJ(options = {}) {
		let output = {}

		if (!options.raw) {
			output.label = aditionalValue(options.label);
			output.tooltip = aditionalValue(options.tooltip);
			output.isButton = options.isBtn;
			output.collideWhenOn = options.collideOn;
			output.collideWhenOff = options.collideOff;
			output.lightLevel = options.lightLvl;
			output.redstoneLevel = options.redstoneLvl;
		}

		const shapes = genModel(Project.elements, options.raw);
		output.shapesOff = shapes.off;
		output.shapesOn = shapes.on;

		return output;
	}

	const codec3dj = new Codec('codec_3dj', {
		name: "3DJ model",
		remember: true,
		remember: false,
		extension: "3dj",
		load_filter: {
			type: 'json',
			extensions: ['3dj'],
			condition(model) {
				return model.shapesOff;
			}
		},

		compile(options) { return autoStringify(compile3DJ(options)); },
		export(options = {}) {
			Blockbench.export({
				resource_id: 'model',
				type: this.name,
				extensions: [this.extension],
				name: this.fileName(),
				startpath: this.startPath(),
				content: this.compile(options),
				custom_writer: isApp ? (a, b) => this.write(a, b) : null,
			}, path => this.afterDownload(path))
		},
	});

	const popConfigModel = new Dialog({
		id: 'popConfig_3dj',
		title: 'Model Propities',
		form: {
			raw: {
				label: 'Raw mode (ON = ignore all below)',
				type: 'checkbox',
				value: false,
			},
			label: {
				label: 'Label',
				type: 'input',
				value: codec3dj.fileName(),
			},
			tooltip: {
				label: 'Tooltip',
				type: 'input',
				value: Project.credit || settings.credit.value || '',
			},
			isBtn: {
				label: 'Act as Button',
				type: 'checkbox',
				value: false,
			},
			lightLvl: {
				label: 'Light Level',
				type: 'number',
				value: 0,
				min: 0, max: 15, step: 1,
			},
			redstoneLvl: {
				label: 'Redstone Power',
				type: 'number',
				value: 0,
				min: 0, max: 15, step: 1,
			},
			collideOff: {
				label: 'Collision (OFF state)',
				type: 'checkbox',
				value: true,
			},
			collideOn: {
				label: 'Collision (ON state)',
				type: 'checkbox',
				value: true,
			},
		},
		onConfirm(formData) {
			codec3dj.export(formData);
		}
	});

	/**
	 * Checks if all given cubes meet the requirements.
	 * @param {Cube} elements The cubes.
	 * @returns Object containing booleans for whenever a condition is met.
	 */
	function checkCubes(elements) {
		let rotation = false;
		let texture = false;
		let border = false;
		let mesh = false;

		for (const cube of elements) {
			if (cube instanceof Cube) {
				if (cube.visibility) {
					if (!rotation)
						rotation = (cube.rotation[0] !== 0
							|| cube.rotation[1] !== 0
							|| cube.rotation[2] !== 0);

					if (!texture)
						texture = (getSingleTexture(cube, true).multipleTexture);

					if (!border) {
						// NOTE: If you can find a better way to do this, please do so.
						// These changes had to be done due to Blockbench's 0,0 origin
						// being in the center of the block and not in the bottom left corner.
						// causing an malformed export. (off set by 8 in the x and z axis)
						function checkNum(num, height) {
							if (!border)
								if (height)
									border = (num < -16 || num > 16);
								else
									border = (num < -8 || num > 8);
						}
						checkNum(cube.from[0]);
						checkNum(cube.from[1], true);
						checkNum(cube.from[2]);
						checkNum(cube.to[0]);
						checkNum(cube.to[1], true);
						checkNum(cube.to[2]);
					}

					// We are done here
					if (rotation && texture && border)
						break
				}
			} else { mesh = true; }
		}

		return { rotation: rotation, texture: texture, border: border, mesh: mesh };
	}

	const btnExport = new Action('export_3dj', {
		name: 'Export 3DJ Model',
		description: 'Export model as a .3DJ (.json) file for 3D Printers',
		icon: 'print',
		category: 'file',
		condition: () => (Project !== 0),
		click() {
			// Check for stuff we dont want
			const result = checkCubes(Project.elements);

			// Generate warnings
			if (result.rotation || result.texture || result.border || result.mesh) {
				let warning = new Dialog({
					id: 'popWarn_3dj',
					title: "Holdup..",
					form: {
						header: {
							type: 'info',
							text: 'Exporting your model like that might give weird results because of the following things:',
						},
						introduction: {
							type: 'info',
							text: 'Cubes that...',
						}
					},
					onConfirm() {
						popConfigModel.show();
					}
				});
				// Actual messages
				if (result.rotation)
					warning.form.rotation = {
						type: 'info',
						text: '... have rotation',
					}
				if (result.texture)
					warning.form.texture = {
						type: 'info',
						text: '... use multiple textures',
					}
				if (result.border)
					warning.form.border = {
						type: 'info',
						text: '... are out of bounce (16x16x16 Grid / 1x1x1 Block)',
					}
				if (result.mesh)
					warning.form.border = {
						type: 'info',
						text: '... are actually a Mesh and not a Cube',
					}

				warning.form.nextstep = {
					type: 'info',
					text: '*Press \'Confirm\' if you still want to proceed.*',
				}

				warning.show();
				// Or just export if everything is right :)
			} else
				popConfigModel.show();
		}
	});

	Plugin.register('sam3dj', pluginProperties);
})();