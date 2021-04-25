(function() {
	var action;

	Plugin.register('only', {
		title: 'Only',
		icon: 'fa-glasses',
		author: 'JannisX11',
		description: 'Hide everything except for the selected cubes',
		version: '0.0.1',
		variant: 'both',
		onload() {
			let enabled = false;
			let were_hidden_before = [];
			action = new Action('hide_everything_except_selection', {
				name: 'Hide Everything Except Selection',
				icon: 'fa-glasses',
				category: 'view',
				keybind: new Keybind({key: 73}),
				condition: {modes: ['edit', 'paint']},
				click: function(ev) {
					
					enabled = !enabled;

					Undo.initEdit({elements: Cube.all.filter(cube => !cube.selected)})
					Cube.all.forEach(cube => {
						if (enabled) {
							if (cube.visibility) were_hidden_before.push(cube.uuid);
							cube.visibility = !!cube.selected;
						} else {
							cube.visibility = were_hidden_before.includes(cube.uuid);
							console.log(cube.visibility)
						}
					})
					if (!enabled) were_hidden_before.empty();
					Canvas.updateVisibility()
					Undo.finishEdit('toggle_visibility')
	
				}
			})
			MenuBar.addAction(action, 'view.-1')
		},
		onunload() {
			action.delete()
		}
	});
	
})()
