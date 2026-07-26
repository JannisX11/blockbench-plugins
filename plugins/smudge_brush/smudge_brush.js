/// <reference path="../../types/index.d.ts" />

let smudge_brush;

Plugin.register('smudge_brush', {
	title: 'Smudge Brush',
	icon: 'touch_app',
	author: 'JannisX11',
	description: 'Adds a smudge brush to smear, soften, or blur textures and images',
	tags: ['Brush', 'Paint'],
	version: '1.0.0',
	min_version: '4.8.0',
    creation_date: "2025-12-27",
	variant: 'both',
	onload() {

		let last_coord = null;
		smudge_brush = new Tool('smudge_brush', {
			name: 'Smudge Brush',
			icon: 'touch_app',
			category: 'tools',
			toolbar: 'brush',
			cursor: 'crosshair',
			selectFace: true,
			transformerMode: 'hidden',
			paintTool: true,
			brush: {
				blend_modes: false,
				shapes: true,
				size: true,
				softness: true,
				opacity: true,
				offset_even_radius: true,
				floor_coordinates: () => BarItems.slider_brush_softness.get() == 0,
				interval: 1,
				onStrokeStart() {
					last_coord = null;
				},
				draw({ctx, x, y, size, softness, texture, event}) {
					if (!last_coord || (last_coord[0] == x && last_coord[1] == y)) {
						last_coord = [x, y];
						return;
					}
					let b_opacity = BarItems.slider_brush_opacity.get()/255;
					let matrix_id = Painter.current.element
								? (Painter.current.element.uuid + Painter.current.face)
								: Painter.current.face;
					let face_matrix = settings.paint_side_restrict.value && Painter.current.face_matrices[matrix_id];
					let run_per_pixel = (pxcolor, local_opacity, px, py) => {
						if (face_matrix) {
							if (!face_matrix[px] || !face_matrix[px][py % texture.display_height]) {
								return pxcolor;
							}
						}
						return smudge_brush.brush.changePixel(px, py, pxcolor, local_opacity, {opacity: b_opacity, ctx, x, y, size, softness, texture, event});
					}
					let shape = BarItems.brush_shape.value;
					if (shape == 'square') {
						Painter.editSquare(ctx, x, y, size, softness * 1.8, run_per_pixel);
					} else if (shape == 'circle') {
						Painter.editCircle(ctx, x, y, size, softness * 1.8, run_per_pixel);
					}
					last_coord = [x, y];
				},
				changePixel(px, py, pxcolor, local_opacity, {opacity, ctx, x, y, size, softness, texture, event}) {
					let a = opacity * local_opacity * 0.4;

					let result_color;
					let smear_pixel = [
						px - (x - last_coord[0]),
						py - (y - last_coord[1]),
					];
					let smear_color = {r: 0, g: 0, b: 0, a: 0};
					let count = 0;
					let start = [Math.floor(smear_pixel[0]), Math.floor(smear_pixel[1])]
					Painter.scanCanvas(ctx, ...start, 2, 2, (px1, py1, pxcolor2) => {
						let amount_x = smear_pixel[0] % 1;
						let amount_y = smear_pixel[1] % 1;
						if (px1 == start[0]) amount_x = 1-amount_x;
						if (py1 == start[1]) amount_y = 1-amount_y;
						smear_color.r += pxcolor2[0] * amount_x * amount_y;
						smear_color.g += pxcolor2[1] * amount_x * amount_y;
						smear_color.b += pxcolor2[2] * amount_x * amount_y;
						smear_color.a += (pxcolor2[3] / 255) * amount_x * amount_y;
						count++;
					});
					if (count == 4) {
						result_color = Painter.combineColors(pxcolor, smear_color, a);
					}
					if (Painter.lock_alpha) result_color.a = pxcolor.a
					return result_color || pxcolor;
				}
			},
			allowed_view_modes: ['textured', 'material'],
			modes: ['paint'],
			onCanvasClick(data) {
				Painter.startPaintToolCanvas(data, data.event);
			},
			onSelect() {
				Painter.updateNslideValues();
				Interface.addSuggestedModifierKey('shift', 'modifier_actions.draw_line');
			},
			onUnselect() {
				Interface.removeSuggestedModifierKey('shift', 'modifier_actions.draw_line');
			}
		});
		if (!localStorage.getItem('smudge_brush.init')) {
			let index = Toolbars.tools.children.indexOf(BarItems.brush_tool);
			Toolbars.tools.add(smudge_brush, index+1);
			localStorage.setItem('smudge_brush.init', 'true');
		}

	},
	onunload() {
		smudge_brush.delete();
	}
});

