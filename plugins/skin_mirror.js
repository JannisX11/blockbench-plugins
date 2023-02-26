(function () {

	function getTexture() {
		if (Texture.selected) {
			return [Texture.selected];
		} else {
			return Texture.all;
		}
	}

	let arm_pixels = 4;
	let invert = false;

	window.MirrorUI = {
		dialog: new Dialog({
			id: 'skin_mirror',
			title: 'Skin Mirror',
			width: 540,
			form: {
				type: {
					label: 'Type', type: 'select', options: {
						steve: 'Steve',
						alex: 'Alex',
					}
				},
				mirror: {
					label: 'Direction', type: 'select', options: {
						mirror_normal: 'Left -> Right',
						mirror_inverted: 'Right -> Left',
					}
				},
			},
			onFormChange({ type, mirror }) {
				if (type == 'steve') {
					arm_pixels = 4;
				}
				else if (type == 'alex') {
					arm_pixels = 3;
				}

				if (mirror == 'mirror_inverted') {
					invert = true;
				}
				else {
					invert = false;
				}
			},
			onConfirm() {

				this.hide()

				function rotate(ctx, texture, s_px, s_py, t_px, t_py, size_x, size_y) {
					if (invert) {
						[s_px, t_px, s_py, t_py] = [t_px, s_px, t_py, s_py]
					}

					let factor = texture.display_height / 64;

					for (let i = 0; i < size_x * factor; i++) {
						ctx.drawImage(texture.img, s_px * factor + i, s_py * factor, 1, size_y * factor, (t_px + size_x) * factor - 1 - i, t_py * factor, 1, size_y * factor);
					}
				}

				let textures = getTexture();

				Undo.initEdit({ textures, bitmap: true });
				textures.forEach(texture => {
					texture.edit((canvas) => {

						let ctx = canvas.getContext('2d');

						if (arm_pixels == 3) {
							//arms alex
							rotate(ctx, texture, 40, 20, 39, 52, 4, 12)
							rotate(ctx, texture, 44, 20, 36, 52, 3, 12)
							rotate(ctx, texture, 47, 20, 32, 52, 4, 12)
							rotate(ctx, texture, 51, 20, 43, 52, 3, 12)
							rotate(ctx, texture, 44, 16, 36, 48, 3, 4)
							rotate(ctx, texture, 47, 16, 39, 48, 3, 4)
						}
						else {
							//arms steve
							rotate(ctx, texture, 40, 20, 40, 52, 4, 12)
							rotate(ctx, texture, 44, 20, 36, 52, 4, 12)
							rotate(ctx, texture, 48, 20, 32, 52, 4, 12)
							rotate(ctx, texture, 52, 20, 44, 52, 4, 12)
							rotate(ctx, texture, 44, 16, 36, 48, 4, 4)
							rotate(ctx, texture, 48, 16, 40, 48, 4, 4)
						}

						//legs
						rotate(ctx, texture, 0, 20, 24, 52, 4, 12)
						rotate(ctx, texture, 4, 20, 20, 52, 4, 12)
						rotate(ctx, texture, 8, 20, 16, 52, 4, 12)
						rotate(ctx, texture, 12, 20, 28, 52, 4, 12)
						rotate(ctx, texture, 4, 16, 20, 48, 4, 4)
						rotate(ctx, texture, 8, 16, 24, 48, 4, 4)

					}, { no_undo: true });
				})
				Undo.finishEdit('Mirrored Skin')
			}
		})
	};

	Plugin.register('skin_mirror', {
		title: 'Skin Mirror',
		icon: 'icon-mirror_x',
		author: 'oectway',
		description: 'Tool that allows you to mirror the arms and legs of existing skins to the other side.',
		tags: ["Minecraft", "Skins"],
		version: '1.0.0',
		variant: 'both',
		onload() {
			skin_mirror_action = new Action('open_skin_mirror', {
				name: 'Mirror Skin',
				icon: 'icon-mirror_x',
				click: () => {
					MirrorUI.dialog.show();
				}
			})
			MenuBar.addAction(skin_mirror_action, 'filter');
		},
		onunload() {
			skin_mirror_action.delete();
		}
	})
})()