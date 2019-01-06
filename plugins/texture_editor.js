var plugin_data = {
	id: 'texture_editor',
	title: 'Texture Editor',
	icon: 'photo_filter',
	author: 'JannisX11',
	description: 'Adds basic image manipulation functions - like contrast and saturation - to textures',
	about: 'To edit a texture, right click it and enter the Texture Editor menu. Select what you want to edit from the menu.',
	version: '1.0.0',
	min_version: '2.0.0',
	variant: 'desktop'
}


window.TextureEditor = {
	submenu: {
		id: 'texture_edit',
		name: 'Texture Editor',
		icon: 'photo_filter',
		children: [
			{name: 'Color', icon: 'palette', children: [
				{name: 'Brightness...', icon: 'fa-lightbulb-o',	click: (tex) => {TextureEditor.editMenu(tex, 'brightness', 'Brightness')}},
				{name: 'Light...', icon: 'brightness_low',		click: (tex) => {TextureEditor.editMenu(tex, 'light', 'Light')}},
				{name: 'Contrast...', icon: 'brightness_medium',click: (tex) => {TextureEditor.editMenu(tex, 'contrast', 'Contrast')}},
				{name: 'Saturation...', icon: 'flare', 			click: (tex) => {TextureEditor.editMenu(tex, 'saturation', 'Saturation')}},
				{name: 'Hue...', icon: 'looks', 				click: (tex) => {TextureEditor.editMenu(tex, 'hue', 'Hue')}},
				{name: 'Invert', icon: 'invert_colors',			click: (tex) => {TextureEditor.edit(tex, 'invert')}},
				{name: 'Grayscale', icon: 'format_color_reset',	click: (tex) => {TextureEditor.edit(tex, 'grayscale')}},
			]},
			//{name: 'Blur', icon: 'blur_on', children: [
				//{name: 'Fast Blur', icon: 'blur_circular',	click: (tex) => {TextureEditor.editMenu(tex, 'fast_blur')}},
				{name: 'Blur...', icon: 'blur_on',				click: (tex) => {TextureEditor.editMenu(tex, 'gaussian_blur', 'Gaussian Blur', -1)}},
			//]},
			{name: 'Transform', icon: 'transform', children: [
				{name: 'Mirror', icon: 'icon-mirror_x', 		click: (tex) => {TextureEditor.edit(tex, 'mirror_x')}},
				{name: 'Mirror', icon: 'icon-mirror_y', 		click: (tex) => {TextureEditor.edit(tex, 'mirror_y')}},
				{name: 'Rotate Left', icon: 'rotate_left',		click: (tex) => {TextureEditor.edit(tex, 'rotate_left')}},
				{name: 'Rotate Right', icon: 'rotate_right',	click: (tex) => {TextureEditor.edit(tex, 'rotate_right')}},
				{name: 'Rotate...', icon: 'sync',				click: (tex) => {TextureEditor.editMenu(tex, 'rotate_free', 'Rotate')}},
			]},
		]
	},
	setup: function() {

		var width = 400

		Texture.prototype.menu.addAction(TextureEditor.submenu, '3')


		TextureEditor.effect_slider = new BarSlider({
			id: 'texture_edit_effect',
			name: 'Effect Strength',
			private: true,
			min: -1, max: 1, step: 0.01, width: width + 16,
			onChange: function(slider) {
				TextureEditor.effect = TextureEditor.effect_slider.get()||0
				TextureEditor.preview()
			}
		})

		TextureEditor.dialog = new Dialog({
			id: 'texture_editor',
			title: 'Texture Editor',
			lines: [
				'<p id="texture_editor_info"></p>',
				`<div id="preview_image_wrapper" style="
					height: ${width}px;
					width: ${width}px;
					margin: 8px;
					background-color: var(--color-back);
					background-repeat: no-repeat;
					background-size: contain;
				"></div>`,
				{widget: TextureEditor.effect_slider}
			],
			draggable: true,
			onConfirm: function() {
				TextureEditor.confirmDialog()
			}
		})
	},
	editMenu: function(texture, mode, title, effect_0) {
		TextureEditor.mode = mode
		TextureEditor.texture = texture
		TextureEditor.effect = effect_0||0

		TextureEditor.dialog.title = title
		TextureEditor.dialog.show()
		TextureEditor.effect_slider.set(TextureEditor.effect)
		$(TextureEditor.dialog.object).find('#texture_editor_info').text(texture.name)

		var css = 'url("'+texture.source.split('\\').join('\\\\').replace(/ /g, '%20')+'")'
		$(TextureEditor.dialog.object).find('#preview_image_wrapper')
			.css('background-image', css)

		texture.edit(image => {
			TextureEditor.image = image
		}, {noUndo: true})
	},
	preview: function() {
		var texture = TextureEditor.texture
		var image = TextureEditor.image.clone()
			
		TextureEditor.processImage(image)

		image.getBase64(Jimp.MIME_PNG, function(a, dataUrl){
			var css = 'url("'+dataUrl+'")'
			$(TextureEditor.dialog.object).find('#preview_image_wrapper')
				.css('background-image', css)
		})
	},
	edit: function(texture, mode) {
		TextureEditor.mode = mode
		texture.edit(image => {
			TextureEditor.processImage(image)
		})
	},
	confirmDialog: function() {
		TextureEditor.texture.edit(image => {
			TextureEditor.processImage(image)
		})
		TextureEditor.dialog.hide()
	},
	processImage: function(image) {
		switch (TextureEditor.mode) {
			//Color
			case 'brightness':		image.brightness(TextureEditor.effect); break;
			case 'light':			image.color([{apply: 'lighten', params: [TextureEditor.effect*100]}]); break;
			case 'contrast':		image.contrast(TextureEditor.effect); break;
			case 'saturation':		image.color([{apply: 'saturate', params: [TextureEditor.effect*100]}]); break;
			case 'hue':				image.color([{apply: 'hue', params: [TextureEditor.effect*180]}]); break;
			case 'invert':			image.invert(); break;
			case 'grayscale':		image.greyscale(); break;
			//Blur
			//case 'fast_blur':		if (TextureEditor.effect > 0) image.blur(1 + TextureEditor.effect * 4); break;
			case 'gaussian_blur':	if (TextureEditor.effect > -1) image.gaussian(1 + (TextureEditor.effect+1) * 4); break;
			//Transform
			case 'mirror_x':		image.flip(true, false); break;
			case 'mirror_y':		image.flip(false, true); break;
			case 'rotate_left':		image.rotate(+90, false); break;
			case 'rotate_right':	image.rotate(-90, false); break;
			case 'rotate_free':		image.rotate(Math.round(TextureEditor.effect*90)*2, false); break;
			//case 'scale':			image.scale(1-TextureEditor.effect); break;
		}
		return image;
	},
}
TextureEditor.setup()


onInstall = function() {
}

onUninstall = function() {
	Texture.prototype.menu.removeAction('texture_edit')
}