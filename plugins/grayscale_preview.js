/// <reference path="../types/index.d.ts" />

(function() {

let toggle, css;

Plugin.register('grayscale_preview', {
	title: 'Grayscale Preview',
	icon: 'filter_b_and_w',
	author: 'JannisX11',
	description: 'Adds a Grayscale preview mode. The mode can be toggled from the View menu.',
	tags: ['Viewport'],
	version: '1.0.0',
	min_version: '4.3.0',
	variant: 'both',
	onload() {
		toggle = new Toggle('grayscale_preview', {
			name: 'Grayscale Preview',
			icon: 'filter_b_and_w',
			category: 'view',
			onChange(value) {
				Interface.work_screen.classList.toggle('grayscale_view', value)
			}
		})
		MenuBar.addAction(toggle, 'view.5')
		css = Blockbench.addCSS(`
			#work_screen.grayscale_view #preview canvas {
				filter: grayscale(1);
			}
			#work_screen.grayscale_view #uv_frame img {
				filter: grayscale(1);
			}
		`)
	},
	onunload() {
		toggle.delete()
		css.delete()
	}
});

})()
