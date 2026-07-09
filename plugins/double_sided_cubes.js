(()=> {

	let cube_action;

	Plugin.register('double_sided_cubes', {
		title: 'Double Sided Cubes',
		author: 'SnaveSutit',
		description: 'Creates inverted duplicates of the selected cube(s) to allow double-sided rendering in Minecraft: Java Edition.',
        tags: ["Minecraft: Java Edition"],
		icon: 'flip_to_back',
		version: '1.0.2',
		variant: 'both',
		onload() {
			cube_action = new Action({
				id: "create_double_sided_cubes",
				name: 'Create Double Sided Cube',
				icon: 'flip_to_back',
				category: 'edit',
				condition: () => !Project.box_uv || Project.optional_box_uv,
				click: function(ev) {
					if (selected.length === 0) {
						Blockbench.showMessage('No cubes selected', 'center')
						return;
					};
					Undo.initEdit({elements:[]});
					let cubes = [];
					Cube.selected.forEach((cube) => {
						const new_cube = cube.duplicate();
						// Set the new cube to Per-Face UV if it was using Box UV
						if (!!new_cube.box_uv) {
							new_cube.setUVMode(false);
						}
						// cube.duplicate() will sometimes change the name of the duplicated cube, 
						//   so we base this on cube.name instead of new_cube.name.
						new_cube.name = cube.name + " inverted";
						// Place new_cube immediately after cube in the outliner
						new_cube.sortInBefore(cube, 1);
						for (i=0; i<3; i++){
							new_cube.flip(i, 0, false)
						};
						new_cube.from = [...cube.to];
						new_cube.to = [...cube.from];
						new_cube.inflate = -new_cube.inflate;
						new_cube.origin = [-new_cube.origin[0],-new_cube.origin[1],-new_cube.origin[2]];
						Canvas.adaptObjectPosition(new_cube);
						Canvas.updateUV(new_cube);
						cubes.push(new_cube);
					});
					Undo.finishEdit('create_double_sided_cube', {elements:cubes});
				}
			});
			MenuBar.addAction(cube_action, 'filter');
		},
		onunload() {
			cube_action.delete();
		}
	});
})();
