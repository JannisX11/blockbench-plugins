(function() {

var fix_action;

Plugin.register('bedrock_pivot_fix', {
	title: 'Bedrock Pivot Fix 2',
	icon: 'gps_fixed',
	author: 'JannisX11',
	description: 'Rotated cubes are broken in custom-block models in Minecraft: Bedrock Edition. Use this plugin to fix them.',
	about: 'After installing, use **Filter > Fix Bedrock Pivots** to fix your current model.',
    tags: ["Deprecated", "Minecraft: Bedrock Edition"],
	version: '2.0.1',
	min_version: '3.0.0',
	variant: 'both',
	onload() {
		fix_action = new Action({
		    id: 'fix_bedrock_pivots',
		    name: 'Fix Bedrock Pivots',
		    icon: 'gps_fixed',
		    category: 'edit',
		    condition: () => (Format.id && Format.id.includes('bedrock')),
		    click: function(ev) {
		    	if (Format.id == 'bedrock_old') {
					Blockbench.showMessage('This model uses the old format and doesn\'t need to be fixed')
		    		return;
		    	}
		    	var fixable_cubes = [];
		    	Cube.all.forEach(cube => {
		    		if (!cube.rotation.allEqual(0) && cube.parent instanceof Group) {
		    			fixable_cubes.push(cube);
		    		}
		    	})
		    	if (fixable_cubes.length) {
		    		Undo.initEdit({elements: fixable_cubes})
		    	}
		    	fixable_cubes.forEach(cube => {
		    		cube.transferOrigin([0, 0, 0]);
		    	})
		    	if (fixable_cubes.length) {
		    		Undo.finishEdit('fix bedrock pivots');
		    	}
				if (!fixable_cubes.length) {
					Blockbench.showMessage('No pivots to fix in this model');
				}
		    }
		})
		MenuBar.addAction(fix_action, 'filter')
	},
	onunload() {
		fix_action.delete()
	}
});

})()
