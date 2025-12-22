/// <reference path="../../types/index.d.ts" />

let smear_brush;

Plugin.register('smear_brush', {
	title: 'Smear Brush',
	icon: 'touch_app',
	author: 'JannisX11',
	description: '',
	tags: ['Brush', 'Paint'],
	version: '0.4.0',
	min_version: '4.8.0',
	variant: 'both',
	onload() {

		let last_coord = null;
		smear_brush = new Tool('smear_brush', {
			name: 'Smear Brush',
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
				pixel_perfect: true,
				floor_coordinates: () => BarItems.slider_brush_softness.get() == 0,
				get interval() {
					let size = BarItems.slider_brush_size.get();
					if (size > 40) {
						return size / 12;
					} else {
						return 1 + size * BarItems.slider_brush_softness.get() / 1500;
					}
				},
				onStrokeStart() {
					last_coord = null;
				},
				draw({ctx, x, y, size, softness, texture, event}) {
					if (!last_coord || (last_coord[0] == x && last_coord[1] == y)) {
						console.log(last_coord)
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
						return smear_brush.brush.changePixel(px, py, pxcolor, local_opacity, {opacity: b_opacity, ctx, x, y, size, softness, texture, event});
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
					let smear_color;
					Painter.scanCanvas(ctx, smear_pixel[0], smear_pixel[1], 1, 1, (px1, py1, pxcolor) => smear_color = pxcolor);
					if (smear_color) {
						smear_color = {r: smear_color[0], g: smear_color[1], b: smear_color[2], a: smear_color[3]/255};
						result_color = Painter.combineColors(pxcolor, smear_color, a);
					}
					if (Painter.lock_alpha) result_color.a = pxcolor.a
					console.log({smear_pixel, smear_color, result_color, pxcolor, px, py, x, last_coord})
					return result_color;
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
		})

	},
	onunload() {
		smear_brush.delete();
	}
});

