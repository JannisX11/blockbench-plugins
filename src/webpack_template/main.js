import helloWorld from './hello_world'

const plugin = Plugin.register('webpack_template', {
	title: 'Webpack Template Plugin',
	author: 'Author',
	icon: 'radio_button_unchecked',
	description: 'Webpack Template Plugin',
	version: '0.0.1',
	variant: 'both',
	onload() {

		helloWorld();

	},
	onunload() {
		
	}
});
