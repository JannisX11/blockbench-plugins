Plugin.register("simplify", {
	title: "Simplify Models",
	author: "Ryan Garrett",
	icon: "build",
	description: "Simplifies the cubes in a model. For example if a block was 0.99 pixels wide, then it would change it to 1.",
	version: "0.2.0",
	variant: "both",
	onload() {
		MenuBar.addAction(new Action({
			id: "simplify",
			name: "Simplify",
			icon: "build",
			category: "filter",
			click: function(ev) {
				var dialog = new Dialog({title:"Simplify cubes", id:"simplify_options", lines:[
					"<p>This will simplify the cubes in the current model. It will do this to the rotation, pivot point, size, UV, and position of each cube.</p>"
				],
				form: {
					selectOnly:		{label: "Selected Cubes Only", type: "checkbox"},
					roundAmount:	{label: "Rounding Amount", type: "number", value: 0.25, min: 0, step: 0.25},
					position:		{label: "Position", type: "checkbox", value: true},
					size:			{label: "Size", type: "checkbox", value: true},
					uv:				{label: "UV", type: "checkbox", value: true},
					rotation:		{label: "Rotation", type: "checkbox", value: true},
					origin:			{label: "Origin", type: "checkbox", value: true}
				},
				onConfirm: function(data) {
					if (data.roundAmount == 0) {
						Blockbench.showMessage("Failed, Invalid Number.", "center");
						return;
					}

					try {
						dialog.hide();

						var cubes = Cube.all;
						if (data.selectOnly == true) {
							if (selected.length > 0) {
								cubes = selected;
							}
							else {
								cubes = null;
							}
						}

						// Undo
						Undo.initEdit({elements: cubes});

						// Goes through all of the cubes and simplifies them
						for (let i = 0; i < cubes.length; i++) {

							// Size
							if (data.position) {
								// To
								cubes[i].to = Simplify(cubes[i].to, data.roundAmount);

								// From
								cubes[i].from = Simplify(cubes[i].from, data.roundAmount);
							}

							if (data.uv) {
								// UV
								cubes[i].faces.north.uv = Simplify(cubes[i].faces.north.uv, data.roundAmount);

								cubes[i].faces.east.uv = Simplify(cubes[i].faces.east.uv, data.roundAmount);

								cubes[i].faces.south.uv = Simplify(cubes[i].faces.south.uv, data.roundAmount);

								cubes[i].faces.west.uv = Simplify(cubes[i].faces.west.uv, data.roundAmount);

								cubes[i].faces.up.uv = Simplify(cubes[i].faces.up.uv, data.roundAmount);

								cubes[i].faces.down.uv = Simplify(cubes[i].faces.down.uv, data.roundAmount);
							}

							// Rotation
							if (data.rotation) {
								cubes[i].rotation = Simplify(cubes[i].rotation, data.roundAmount);
							}

							// Origin
							if (data.origin) {
								cubes[i].origin = Simplify(cubes[i].origin, data.roundAmount);
							}

							Canvas.adaptObjectPosition(cubes[i]);
							Canvas.updateUV(cubes[i]);
						}

						Undo.finishEdit("simplify cubes", {elements: cubes});

						updateSelection()
					}
					catch {
						Blockbench.showMessage("Failed", "center");
						updateSelection()
					}
				}
				});

				dialog.show()
			}
		}), "filter");
	},

	onunload() {
		MenuBar.removeAction("filter.simplify");
	}
});

// Rounds the value or values to the nearest multiple of round
function Simplify(value, round = 1) {
	if (value.length == null) {
		return Math.round(value / round) * round;
	}
	// If value is an array
	var values = [];

	for (let i = 0; i < value.length; i++) {
		values.push(Math.round(value[i] / round) * round);
	}
	return values;
}
