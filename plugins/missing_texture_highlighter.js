(function() {
var flash_action;
Plugin.register('missing_texture_highlighter', {
	title: 'Missing Texture Highlighter',
	icon: 'flash_on',
	author: 'JannisX11',
	description: 'Highlights missing textures by flashing them.',
	version: '0.1.0',
	variant: 'both',
	onload() {
		window.mt_highlighter = {
			i: 0,
			start: function() {
				clearInterval(mt_highlighter.interval);
				mt_highlighter.i = 0;
				mt_highlighter.interval = setInterval(mt_highlighter.flash, 200);
				mt_highlighter.flash();
			},
			flash: function() {
				var fc = mt_highlighter.i;
				var x = (fc%2) ? -0.3 : 0.3;
				if (fc > 16) {
					x = 0;
					clearInterval(mt_highlighter.interval);
				}
				emptyMaterials.forEach(function(m) {
					m.emissive = {r: x, b: x, g: x};
				})
				mt_highlighter.i++;
			}
		}
		flash_action = new Action({
			id: 'flash_missing_textures',
			name: 'Flash Missing Textures',
			category: 'textures',
			icon: 'flash_on',
			click() {
				mt_highlighter.start();
			}
		});
		MenuBar.addAction(flash_action, 'filter')
	},
	onunload() {
		flash_action.delete();
	}
});

})()
