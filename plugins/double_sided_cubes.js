;(() => {
	let cube_action

	BBPlugin.register('double_sided_cubes', {
		title: 'Double Sided Cubes',
		author: 'SnaveSutit',
		description:
			'Creates inverted duplicates of the selected cube(s) to allow double-sided rendering in java edition.',
		icon: 'flip_to_back',
		version: '1.1.0',
		variant: 'both',
		onload() {
			cube_action = new Action({
				id: 'create_double_sided_cubes',
				name: 'Create Double Sided Cube',
				icon: 'flip_to_back',
				category: 'edit',
				click() {
					if (Project.box_uv) {
						Blockbench.showQuickMessage(
							'Cannot make double sided cubes with BoxUV enabled!',
							2000
						)
						return
					}
					if (Cube.selected === 0) {
						Blockbench.showQuickMessage('No Cubes Selected!', 2000)
						return
					}
					Undo.initEdit({ elements: [] })
					let cubes = []
					Cube.selected.forEach(cube => {
						const new_cube = new Cube({ ...cube }).init()
						new_cube.box_uv = false
						new_cube.name = new_cube.name + '_inverted'
						if (cube.parent !== 'root') {
							new_cube.addTo(cube.parent, cube.parent.children.indexOf(cube) + 1)
						}
						for (i = 0; i < 3; i++) {
							new_cube.flip(i, 0, false)
						}
						new_cube.from = [...cube.to]
						new_cube.to = [...cube.from]
						new_cube.inflate = -new_cube.inflate
						Canvas.adaptObjectPosition(new_cube)
						Canvas.updateUV(new_cube)
						cubes.push(new_cube)
					})
					Undo.finishEdit('create_double_sided_cube', { elements: cubes })
				},
			})
			MenuBar.addAction(cube_action, 'filter')
		},
		onunload() {
			cube_action.delete()
		},
	})
})()
