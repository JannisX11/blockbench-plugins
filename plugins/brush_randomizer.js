(function () {
	var button;
	var options_dialog;
	var amount = 5;
	var stroke = false;
	var original_color;
	Plugin.register("brush_randomizer", {
		title: "Brush Color Randomizer",
		author: "Anniken(YT)",
		description:
			"Randomize the Brush Color with each stroke to give your artwork more variation",

		version: "1.0.0",
		icon: "brush",
		variant: "both",
		onload() {
			options_dialog = new Dialog("brush_randomizer_options", {
				title: "Brush Randomizer Options",
				form: {
					amount: {
						type: "number",
						label: "Amount (percent)",
						value: amount,
						step: 1,
						min: 1,
						max: 100,
					},
					stroke: {
						type: "checkbox",
						label: "Randomize Stroke",
						value: stroke,
					},
				},
				onConfirm: function (values) {
					amount = values.amount;
					stroke = values.stroke;
					rel_to_original = values.rel_to_original;
					this.hide();
				},
			});
			button = new Action("randomize_brush", {
				name: "Randomize Brush",
				icon: "shuffle",
				id: "randomize_brush",
				description: "Randomizes the brush color",
				click: function () {
					randomize_color();
				},
			});
			options = new Action("randomize_brush_options", {
				name: "Randomize Brush Options",
				icon: "settings",
				id: "randomize_brush_options",
				description: "Opens Brush Randomizer options",
				click: function () {
					options_dialog.show();
				},
			});
			toggle_stroke = new Action("toggle_randomize_brush_stroke", {
				name: "Toggle Random Brush Stroke",
				icon: "toggle_off",
				description: "Toggles randomizing the brush stroke",
				click: function () {
					stroke = !stroke;
					Blockbench.showToastNotification({
						text: stroke
							? "Toggled randomizing brush stroke on"
							: "Toggled randomizing brush stroke off",
						expire: 5000,
						icon: "info",
					});
				},
			});
			MenuBar.addAction(toggle_stroke, "filter");
			MenuBar.addAction(button, "filter");
			MenuBar.addAction(options, "filter");
			$(".preview").on("click", function (e) {
				// if the alt button is pressed, we don't want to randomize the color, instead set it to the original color
				if (e.altKey) {
					original_color = ColorPanel.get();
					return;
				}
				if (stroke) {
					randomize_color();
				}
			});
			$(".sp-val").on("click", (e) => {
				original_color = ColorPanel.get();
			});

			function randomize_color() {
				if (original_color == null) {
					original_color = ColorPanel.get();
					Blockbench.showToastNotification({
						text: "Original color was 0, using current",
						expire: 5000,
						icon: "info",
					});
				}
				var curr_color = original_color;
				var new_color = LightenDarkenColor(
					curr_color,
					getRandomArbitrary(amount * -1, amount)
				);
				ColorPanel.set(new_color);
			}
		},
		onunload() {
			button.delete();
			options.delete();
			toggle_stroke.delete();
			$(".preview").off("click");
			$(".sp-val").off("click");
		},
	});
})();

function LightenDarkenColor(col, percent) {
	var num = parseInt(col.replace("#", ""), 16),
		amt = Math.round(2.55 * percent),
		R = (num >> 16) + amt,
		B = ((num >> 8) & 0x00ff) + amt,
		G = (num & 0x0000ff) + amt;
	return (
		"#" +
		(
			0x1000000 +
			(R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
			(B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
			(G < 255 ? (G < 1 ? 0 : G) : 255)
		)
			.toString(16)
			.slice(1)
	);
}

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}
