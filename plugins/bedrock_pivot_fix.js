(function() {

var fix_action, revert_action;

Plugin.register('bedrock_pivot_fix', {
	title: 'Bedrock Pivot Fix',
	icon: 'gps_fixed',
	author: 'JannisX11',
	description: 'Rotated cubes will likely be broken in Bedrock 1.13. This plugin creates support bones to fix this.',
	about: 'After installing, use **Filter > Fix Bedrock Pivots** to fix your current model. You can use Ctrl + Z to undo this change or use the option **Revert Bedrock Pivots** to revert the changes later.',
	version: '1.0.0',
	min_version: '3.0.0',
	variant: 'both',
	onload() {
		fix_action = new Action({
		    id: 'fix_bedrock_pivots',
		    name: 'Fix Bedrock Pivots',
		    description: '',
		    icon: 'gps_fixed',
		    category: 'edit',
		    condition: () => (Format.id == 'bedrock' || Format.id == 'bedrock_old'),
		    click: function(ev) {
		    	if (Format.id == 'bedrock_old') {
					Blockbench.showMessage('This model uses the old format and doesn\'t need to be fixed')
		    		return;
		    	}
		    	var fixable_cubes = [];
		    	Cube.all.forEach(cube => {
		    		if (!cube.rotation.allEqual(0)) {
		    			fixable_cubes.push(cube);
		    		}
		    	})
		    	if (fixable_cubes) {
		    		Undo.initEdit({outliner: true, elements: fixable_cubes})
		    	}
		    	fix_counter = 0;
		    	var cube_reset_data = {
		    		rotation: [0, 0, 0],
		    		origin: [0, 0, 0]
		    	}
				Group.all.slice().forEach(parent => {
					var fixgroups = {}
					parent.children.slice().forEach((cube, i) => {
						if (cube instanceof Cube == false || cube.export == false) return;
						if (cube.rotation.allEqual(0)) return;

						var pivotkey = cube.rotation.join('_') + cube.origin.join('_');
						if (!fixgroups[pivotkey]) {
							var fixgroup = fixgroups[pivotkey] = new Group({
								name: `pivotfix_${fix_counter}`,
								origin: cube.origin,
								rotation: cube.rotation
							});
							fixgroup.addTo(parent).init();
							fixgroup.createUniqueName();
							fixgroup.rotation[2] *= -1;
							fix_counter++;
						}
						cube.addTo(fixgroups[pivotkey]);
						cube.extend(cube_reset_data);

					})
				})
		    	if (fixable_cubes) {
		    		Undo.finishEdit('fix bedrock pivots');
		    	}
				if (fix_counter) {
					Canvas.updateAllPositions();
					Canvas.updateAllBones();
				} else {
					Blockbench.showMessage('No pivots to fix in this model');
				}
		    }
		})
		revert_action = new Action({
		    id: 'revert_bedrock_pivots',
		    name: 'Revert Bedrock Pivots',
		    icon: 'gps_not_fixed',
		    description: '',
		    category: 'edit',
		    condition: () => (Format.id == 'bedrock'),
		    click: function(ev) {
		    	fix_counter = 0;
		    	var fixable_cubes = [];
		    	Cube.all.forEach(cube => {
		    		if (cube.parent.name && cube.parent.name.match(/^pivotfix_\d+$/)) {
		    			fixable_cubes.push(cube);
		    		}
		    	})
		    	if (fixable_cubes) {
		    		Undo.initEdit({outliner: true, elements: fixable_cubes})
		    	}
		    	Group.all.slice().forEach(group => {
		    		if (group.name.match(/^pivotfix_\d+$/)) {
						fix_counter++;
		    			group.children.slice().forEach(cube => {
		    				cube.addTo(group.parent);
		    				if (cube instanceof Cube) {
		    					cube.extend({
		    						origin: group.origin,
		    						rotation: group.rotation
		    					});
								cube.rotation[2] *= -1;
		    				}
		    			})
		    			group.remove(false);
		    		}
		    	})
		    	if (fixable_cubes) {
		    		Undo.finishEdit('revert bedrock pivots')
		    	}
				if (fix_counter) {
					Canvas.updateAllPositions();
					Canvas.updateAllBones();
				} else {
					Blockbench.showMessage('No pivot fixes to revert in this model');
				}
		    }
		})
		MenuBar.addAction(fix_action, 'filter')
		MenuBar.addAction(revert_action, 'filter')
	},
	onunload() {
		fix_action.delete()
		revert_action.delete()
	}
});

})()
