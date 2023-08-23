/// <reference path="../../types/index.d.ts" />

(function () {
	BBPlugin.register("voxel_sphere_generator", {
		title: "Voxel Sphere Generator",
		author: "Doonv",
		icon: "logo.svg",
		description: "Generates voxel spheres.",
		version: "0.1.0",
		min_version: "4.8.0",
		tags: ["Shapes", "Generation", "Voxel"],
		variant: "both",
		onload() {
			SphereGeneratorAction = new Action("generate_spheres", {
				name: "Generate Voxel Sphere",
				description: "Generates a voxel sphere.",
				icon: "circle",
				click: function () {
					sphereWindow();
				},
			});
			MenuBar.addAction(SphereGeneratorAction, "filter");
		},
		onunload() {
			SphereGeneratorAction.delete();
		},
	});

	//sphere properties window
	function sphereWindow() {
		var sphere_window = new Dialog({
			title: "Sphere Options",
			id: "sphere_options",

			form: {
				radius: { label: "Radius", type: "number", value: 5 },
				thickness: {
					label: "Thickness",
					type: "number",
					value: 1,
				},
				optimization_type: {
					label: "Optimization",
					type: "select",
					options: {
						lines_z: "Lines (Z Axis)",
						lines_zy: "Lines (ZY Axis) (Experimental)",
						none: "None (Very Slow!)",
					},
				},
			},
			draggable: true,
			onConfirm(result) {
				generateSphere(result);
				sphere_window.hide();
			},
		});
		sphere_window.show();
	}

	function generateSphere(result) {
		const radius = result.radius;
		const thickness = result.thickness;

		const innerRadius = radius - thickness;
		const outerRadius = radius;

		console.log("Creation Pass");

		// Creation Pass
		var cubes = [];
		for (let x = -radius; x <= radius; x++) {
			cubes.push([]);
			for (let y = -radius; y <= radius; y++) {
				cubes[x + radius].push([]);
				for (let z = -radius; z <= radius; z++) {
					const distance = Math.sqrt(x * x + y * y + z * z);

					if (distance >= innerRadius && distance <= outerRadius) {
						cubes[x + radius][y + radius].push(true);
					} else {
						cubes[x + radius][y + radius].push(false);
					}
				}
			}
		}
		console.log("Optimization Pass");

		// Optimization Pass
		var boxes = [];
		switch (result.optimization_type) {
			default:
			case "lines_zy":
			case "lines_z":
				for (let x = 0; x <= radius * 2; x++) {
					for (let y = 0; y <= radius * 2; y++) {
						for (let z = 0; z <= radius * 2; z++) {
							// if (cubes[x][y][z] == cubes[x][y][z + 1] == true) {\
							if (cubes[x][y][z] == true) {
								// console.log(`${boxes[boxes.length - 1].to} vs ${x}, ${y}, ${z - 1}`);
								if (
									boxes[boxes.length - 1] &&
									boxes[boxes.length - 1].to[0] == x &&
									boxes[boxes.length - 1].to[1] == y &&
									boxes[boxes.length - 1].to[2] == z - 1
								) {
									// There was a box here? Great! Extend it.
									boxes[boxes.length - 1].to = [x, y, z];
									// console.log(`optimization? ${x}, ${y}, ${z}`);
								} else {
									// No box? Create one
									boxes.push({ from: [x, y, z], to: [x, y, z] });
								}
							}
						}
					}
				}
				if (result.optimization_type == "lines_zy") {
					// This is horribly inefficent, but who cares?
					var changes = 1;
					for (let iter = 1; changes > 0; iter++) {
						changes = 0;
						var new_boxes = [];
						var ignore_list = [];
						for (let index = 0; index < boxes.length; index++) {
							if (ignore_list.find((i) => i == index) != undefined) {
								continue;
							}
							const idx_adr = index < boxes.length - 2 ? 2 : 1;

							if (
								index < boxes.length - 1 &&
								boxes[index].to[0] == boxes[index + idx_adr].to[0] &&
								boxes[index].to[1] == boxes[index + idx_adr].to[1] - iter &&
								boxes[index].to[2] == boxes[index + idx_adr].to[2]
							) {
								boxes[index].to[1] = boxes[index + idx_adr].to[1];
								ignore_list.push(index + idx_adr);
								changes++;
							}
							new_boxes.push(boxes[index]);
						}
						console.log(`compact ${changes}`);
						boxes = new_boxes;
					}
				}
				break;
			case "none":
				for (let x = 0; x <= radius * 2; x++) {
					for (let y = 0; y <= radius * 2; y++) {
						for (let z = 0; z <= radius * 2; z++) {
							if (cubes[x][y][z] == true) {
								boxes.push({ from: [x, y, z], to: [x, y, z] });
							}
						}
					}
				}
				break;
		}

		console.log("Addition Pass");
		var cubes = [];
		// Addition Pass
		function additionPass() {
			var sphere_group = new Group().init();
			sphere_group.name = `Sphere Radius ${radius}`;

			for (let index = 0; index < boxes.length; index++) {
				const box = boxes[index];

				const fromX = box.from[0];
				const fromY = box.from[1];
				const fromZ = box.from[2];
				const toX = box.to[0];
				const toY = box.to[1];
				const toZ = box.to[2];

				cubes.push(
					new Cube({
						name: `Cube ${fromX} ${fromY} ${fromZ} (${index})`,
						from: [fromX, fromY, fromZ],
						to: [toX + 1, toY + 1, toZ + 1],
						rotation: { origin: [0, 0, 0], axis: "X", angle: 0 },
					})
						.addTo(sphere_group)
						.init()
				);
			}
			return cubes;
		}
		if (1000 < boxes.length) {
			var confirm_dialog = new Dialog("confirm_large_objects_dialog", {
				title: "Confirm Large Object Count",
				lines: [
					`The sphere about to be generated contains <strong>${boxes.length}</strong> objects.</br>`,
					"This amount of objectives can lag lower-end devices.</br>",
					"Are you <strong>sure</strong> you want to generate the sphere?",
				],
				onConfirm: additionPass,
				onCancel() {
					confirm_dialog.hide();
				},
			});
			confirm_dialog.show();
		} else {
			Undo.initEdit({ elements: [] });
			additionPass();
			Undo.finishEdit(`Add Sphere with radius ${radius}`, {
				elements: [new_cube, other_cube],
			});
		}
	}
})();
