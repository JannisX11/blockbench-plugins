(function() {

var setting, element;

Plugin.register('screencast_keys', {
	title: 'Screencast Keys',
	icon: 'keyboard',
	author: 'JannisX11',
	description: 'Displays the key combinations you press on screen. Useful for tutorial videos.',
	version: '0.1.0',
	min_version: '3.2.1',
	variant: 'both',
	onload() {

		var timeout;
		element = $(`<div id="screencast_keys" style="
				position: absolute;
				pointer-events: none;
				text-align: center;
				width: 100%;
				bottom: 0;
				font-size: 1.5em;
			"></div>`);
		setting = new Setting('screencast_keys', {
			value: true,
			name: 'Screencast Keys',
			description: 'Displays the key combinations you press on screen',
		})
		$('#preview').append(element)

		function screencast(label) {
			if (!Settings.get('screencast_keys')) return;
			if (!element[0].isConnected) {
				$('#preview').append(element);
			}
			clearTimeout(timeout);
			element.text(label.replace(/\[\w+\] \+ /g, ''));
			timeout = setTimeout(() => {
				timeout = setTimeout(() => {
					element.text('');
				}, 900)
			}, 100)
		}

		Keybind.prototype.isTriggered = function (event) {
			var result = (
				this.key 	=== event.which &&
				(this.ctrl 	=== event.ctrlKey 	|| this.ctrl == null 	) &&
				(this.shift === event.shiftKey 	|| this.shift == null	) &&
				(this.alt 	=== event.altKey 	|| this.alt == null 	) &&
				(this.meta 	=== event.metaKey	|| this.meta == null 	)
			)
			if (result && event instanceof MouseEvent == false) {
				screencast(this.label);
			}
			return result;
		}

	},
	onunload() {
		element.detach();
		setting.delete();
	}
});

})()
