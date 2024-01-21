(()=> {

	let cube_action;

	Plugin.register('double_sided_cubes', {
		title: 'Double Sided Cubes',
		author: 'SnaveSutit',
		description: 'Creates inverted duplicates of the selected cube(s) to allow double-sided rendering in java edition.',
        tags: ["Minecraft: Java Edition"],
		icon: 'flip_to_back',
		version: '1.0.1',
		variant: 'both',
		onload() {
			cube_action = new Action({
				id:"create_double_sided_cubes",
				name: 'Create Double Sided Cube',
				icon: 'flip_to_back',
				category: 'edit',
				condition: () => !Project.box_uv,
				click: function(ev) {
					if (selected.length === 0) {
						Blockbench.showMessage('No cubes selected', 'center')
						return;
					};
					Undo.initEdit({elements:[]});
					let cubes = [];
					Cube.selected.forEach((cube) => {
						const new_cube = cube.duplicate();
						new_cube.name = new_cube.name + " inverted";
						if (cube.parent !== "root") {
							new_cube.addTo(cube.parent);
						};
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
