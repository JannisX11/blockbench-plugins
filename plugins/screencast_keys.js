(function() {

var setting, scale_setting, element, modifier_list, mouse_buttons, style, is_installed;

Plugin.register('screencast_keys', {
	title: 'Screencast Keys',
	icon: 'keyboard',
	author: 'JannisX11',
	description: 'Displays the key combinations you press on screen. Useful for tutorial videos.',
	version: '0.2.0',
	min_version: '3.2.1',
	variant: 'both',
	onload() {

		is_installed = true;
		var timeout;
		element = Interface.createElement('div', {id: 'screencast_keys'});
		modifier_list = Interface.createElement('div', {id: 'screencast_modifier_keys'}, [
			Interface.createElement('p', {style: 'display: none;'}, 'Ctrl'),
			Interface.createElement('p', {style: 'display: none;'}, 'Shift'),
			Interface.createElement('p', {style: 'display: none;'}, 'Alt'),
		]);
		mouse_buttons = Interface.createElement('div', {id: 'screencast_mouse'}, [
			Interface.createElement('div', {class: ''}),
			Interface.createElement('div', {class: ''}),
			Interface.createElement('div', {class: ''}),
		]);

		style = Blockbench.addCSS(`
			#screencast_keys {
				position: absolute;
				pointer-events: none;
				text-align: center;
				width: 100%;
				bottom: 6px;
				font-size: calc(var(--screencast-keys-scale) * 1.1em);
				z-index: 10;
			}
			#screencast_modifier_keys {
				position: absolute;
				pointer-events: none;
				text-align: center;
				bottom: 10px;
				left: 10px;
				display: flex;
				z-index: 10;
				gap: 6px;
				font-size: 0.9em;
			}
			#screencast_modifier_keys > p {
				background-color: var(--color-text);
				color: var(--color-ui);
				padding: 0 6px;
				border-radius: 6px;
				font-size: calc(var(--screencast-keys-scale) * 1em);
				opacity: 0.7;
			}
			#screencast_mouse {
				position: absolute;
				pointer-events: none;
				height: calc(var(--screencast-keys-scale) * 24px);
				width: calc(var(--screencast-keys-scale) * 32px);
				bottom: 8px;
				right: 80px;
				display: flex;
				z-index: 10;
				gap: 4px;
				border-top-right-radius: 16px;
				border-top-left-radius: 16px;
				overflow: hidden;
				opacity: 0.8;
			}
			#screencast_mouse > * {
				background-color: var(--color-button);
				border-radius: 2px;
				height: 100%;
				flex-grow: 1;
			}
			#screencast_mouse > .selected {
				background-color: var(--color-text);
			}
			#screencast_mouse > *:last-child {
				position: absolute;
				outline: 4px solid var(--color-dark);
				border-radius: 4px;
				height: 48%;
				width: 10px;
				margin: auto;
				left: 0;
				right: 0;
				bottom: -2px;
			}
		`)
		
		setting = new Setting('screencast_keys', {
			value: true,
			name: 'Screencast Keys',
			description: 'Displays the key combinations you press on screen',
			onChange() {
				modifier_list.style.display = setting.value ? 'flex' : 'none';
				mouse_buttons.style.display = setting.value ? 'flex' : 'none';
			}
		})
		scale_setting = new Setting('screencast_keys_scale', {
			type: 'number',
			min: 50,
			value: 150,
			name: 'Screencast Keys UI Scale',
			description: 'Select the scale of the screencast keys overlay',
			onChange() {
				document.body.style.setProperty('--screencast-keys-scale', `${scale_setting.value / 100}`);
			}
		})
		setting.onChange();
		scale_setting.onChange();

		Interface.preview.append(modifier_list);
		Interface.preview.append(element);
		Interface.preview.append(mouse_buttons);

		function screencast(label) {
			if (!Settings.get('screencast_keys')) return;
			if (!element.isConnected) {
				Interface.preview.append(element);
			}
			clearTimeout(timeout);
			setTimeout(() => {
				element.textContent = label.replace(/\[\w+\] \+ /g, '');
			}, element.textContent ? 50 : 0)
			element.textContent = '';

			timeout = setTimeout(() => {
			element.textContent = '';
			}, 1000)
		}

		Keybind.prototype.screencastOldIsTriggered = Keybind.prototype.isTriggered;
		Keybind.prototype.isTriggered = function (event, ...args) {
			var result = this.screencastOldIsTriggered(event, ...args);
			if (result && event instanceof MouseEvent == false && is_installed) {
				screencast(this.label);
			}
			return result;
		}

		function updateModifierKeys(ctrl, shift, alt) {
			if (!is_installed || !setting.value) return;
			modifier_list.childNodes[0].style.display = ctrl ? 'block' : 'none';
			modifier_list.childNodes[1].style.display = shift ? 'block' : 'none';
			modifier_list.childNodes[2].style.display = alt ? 'block' : 'none';
		}
		document.addEventListener('keydown', event => {
			updateModifierKeys(event.ctrlOrCmd, event.shiftKey, event.altKey);
		})
		document.addEventListener('keyup', event => {
			updateModifierKeys(event.ctrlOrCmd, event.shiftKey, event.altKey);
		})
		window.addEventListener('blur', event => {
			updateModifierKeys();
		})

		function updateMouseButtons(event) {
			if (!is_installed || !setting.value) return;
			let buttons = event.buttons;
			let lmb = false, rmb = false, mmb = false;

			if (buttons >= 4) { mmb = true; buttons -= 4; }
			if (buttons >= 2) { rmb = true; buttons -= 2; }
			if (buttons >= 1) { lmb = true; buttons -= 1; }

			mouse_buttons.childNodes[2].classList.toggle('selected', mmb)
			mouse_buttons.childNodes[1].classList.toggle('selected', rmb)
			mouse_buttons.childNodes[0].classList.toggle('selected', lmb)
		}
		document.addEventListener('mousedown', updateMouseButtons);
		document.addEventListener('mouseup', updateMouseButtons);
		document.addEventListener('mouseleave', updateMouseButtons);

	},
	onunload() {
		element.remove();
		modifier_list.remove();
		mouse_buttons.remove();
		setting.delete();
		style.delete();
		Keybind.prototype.isTriggered = Keybind.prototype.screencastOldIsTriggered;
	}
});

})()
